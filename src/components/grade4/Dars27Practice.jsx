// 4-sinf, 27-dars amaliyoti: massa birliklari.
// 10 topshiriq, UZ/RU/EN, ovozsiz, solve-to-advance.

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

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const tx = (value, lang) => value && typeof value === 'object' && !Array.isArray(value) ? (value[lang] ?? '') : value;
const shuffle = (items, changeToken = 0) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  if (copy.length < 2) return copy;
  const shift = changeToken % copy.length;
  return [...copy.slice(shift), ...copy.slice(0, shift)];
};
const adaptive = (task, pickedOption, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  return pickedOption?.wrong || task.wrong?.[0] || task.secondHint;
};

const UI = {
  title: b('Урок 27. Практика: единицы массы', '27-dars. Amaliyot: massa birliklari', 'Lesson 27. Practice: units of mass'),
  language: b('Язык', 'Til', 'Language'), task: b('Задание', 'Topshiriq', 'Task'),
  level: { green: b('Базовое', 'Asosiy', 'Core'), yellow: b('Применение', "Qo'llash", 'Application'), red: b('Перенос', "Ko'chirish", 'Transfer') },
  check: b('Проверить', 'Tekshirish', 'Check'), retry: b('Исправить ответ', 'Javobni tuzatish', 'Correct the answer'),
  next: b('Следующее', 'Keyingisi', 'Next'), finish: b('Завершить', 'Yakunlash', 'Finish'),
  again: b('Пройти заново', 'Qaytadan ishlash', 'Try again'), done: b('Практика пройдена', 'Amaliyot tugadi', 'Practice complete'),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", 'correct on the first check'),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', 'All 10 tasks have been solved.'),
  rule: b('Запомните', 'Eslab qoling', 'Remember'), typeAnswer: b('Введите числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Стереть', "O'chirish", 'Delete'),
  matchHint: b('Сначала выберите карточку слева, затем равную ей карточку справа.', "Avval chapdagi kartani, keyin unga teng o'ngdagi kartani tanlang.", 'Choose a card on the left, then its equal card on the right.'),
  orderHint: b('Сначала выберите место, затем карточку массы.', 'Avval joyni, keyin massa kartasini tanlang.', 'Choose a position, then a mass card.'),
};

const LESSON_META = {
  lessonId: 'num-4-27-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 27,
  activityType: 'practice', taskCount: 10, resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 }, locales: SUPPORTED_LANGS,
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'step-order', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'step-order', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'kg-to-g',
    visual: { headline: b('8 кг = ? г', '8 kg = ? g', '8 kg = ? g'), chips: [b('1 кг = 1000 г', '1 kg = 1000 g', '1 kg = 1000 g'), b('8 × 1000', '8 × 1000', '8 × 1000')] },
    setup: b('Переведите килограммы в граммы.', "Kilogrammni grammga o'tkazing.", 'Convert kilograms to grams.'),
    prompt: b('Сколько граммов в 8 килограммах?', '8 kilogrammda necha gramm bor?', 'How many grams are in 8 kilograms?'),
    options: [
      option('8000-g', '8000 г', '8000 g', '8000 g', true),
      option('800-g', '800 г', '800 g', '800 g', false, 'В одном килограмме 1000 граммов, а не 100.', 'Bir kilogrammda 100 emas, 1000 gramm bor.', 'One kilogram contains 1000 grams, not 100.'),
      option('80-g', '80 г', '80 g', '80 g', false, 'Переход к граммам требует умножения на 1000.', "Grammga o'tish 1000 ga ko'paytirishni talab qiladi.", 'Converting to grams requires multiplication by 1000.'),
      option('80000-g', '80 000 г', '80 000 g', '80,000 g', false, 'Не добавляйте лишний ноль: 8 × 1000 = 8000.', "Ortiqcha nol qo'shmang: 8 × 1000 = 8000.", 'Do not add an extra zero: 8 × 1000 = 8000.'),
    ],
    secondHint: b('Восемь групп по тысяче граммов.', 'Ming grammdan sakkizta guruh.', 'Eight groups of one thousand grams.'),
    thirdHint: b('8 × 1000 = 8000.', '8 × 1000 = 8000.', '8 × 1000 = 8000.'),
    correctText: b('Верно. 8 кг = 8000 г.', "To'g'ri. 8 kg = 8000 g.", 'Correct. 8 kg = 8000 g.'),
    rule: b('Чтобы перевести килограммы в граммы, умножают на 1000.', "Kilogrammni grammga o'tkazish uchun 1000 ga ko'paytiriladi.", 'Multiply kilograms by 1000 to convert them to grams.'),
  },
  {
    id: '02', level: 'green', kind: 'match', skillTag: 'mass-equivalence',
    visual: { headline: b('Найдите равные массы', 'Teng massalarni toping', 'Find equal masses'), chips: [b('центнер ↔ кг', 'sentner ↔ kg', 'centner ↔ kg'), b('т ↔ центнер', 't ↔ sentner', 't ↔ centner'), b('т ↔ кг', 't ↔ kg', 't ↔ kg')] },
    setup: b('У каждой массы слева есть равная запись справа.', 'Chapdagi har bir massaning o‘ngda teng yozuvi bor.', 'Each mass on the left has an equal form on the right.'),
    prompt: b('Соедините равные массы.', 'Teng massalarni moslang.', 'Match the equal masses.'),
    pairs: [
      { id: 'seven-centners', left: b('7 центнеров', '7 sentner', '7 centners'), correctRight: 'seven-hundred-kg' },
      { id: 'six-tonnes', left: b('6 т', '6 t', '6 t'), correctRight: 'sixty-centners' },
      { id: 'nine-tonnes', left: b('9 т', '9 t', '9 t'), correctRight: 'nine-thousand-kg' },
    ],
    right: [
      { id: 'seven-hundred-kg', text: b('700 кг', '700 kg', '700 kg') }, { id: 'sixty-centners', text: b('60 центнеров', '60 sentner', '60 centners') },
      { id: 'nine-thousand-kg', text: b('9000 кг', '9000 kg', '9000 kg') },
    ],
    wrong: [b('Вспомните три связи: 1 центнер = 100 кг, 1 т = 10 центнеров, 1 т = 1000 кг.', 'Uch bog‘lanishni eslang: 1 sentner = 100 kg, 1 t = 10 sentner, 1 t = 1000 kg.', 'Recall three facts: 1 centner = 100 kg, 1 t = 10 centners and 1 t = 1000 kg.')],
    secondHint: b('Умножьте 7 на 100, 6 на 10 и 9 на 1000.', '7 ni 100 ga, 6 ni 10 ga va 9 ni 1000 ga ko‘paytiring.', 'Multiply 7 by 100, 6 by 10 and 9 by 1000.'),
    thirdHint: b('7 центнеров = 700 кг; 6 т = 60 центнеров; 9 т = 9000 кг.', '7 sentner = 700 kg; 6 t = 60 sentner; 9 t = 9000 kg.', '7 centners = 700 kg; 6 t = 60 centners; 9 t = 9000 kg.'),
    correctText: b('Верно. Все три пары равны.', "To'g'ri. Uchala juft ham teng.", 'Correct. All three pairs are equal.'),
    rule: b('Множитель зависит от выбранной пары единиц.', "Ko'paytiruvchi tanlangan birliklar juftiga bog'liq.", 'The multiplier depends on the pair of units.'),
  },
  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'mixed-mass-procedure',
    visual: { headline: b('2 т 350 кг → килограммы', "2 t 350 kg → kilogramm", '2 t 350 kg → kilograms'), chips: [b('2 т', '2 t', '2 t'), b('350 кг', '350 kg', '350 kg')] },
    setup: b('Нужно записать смешанную массу только в килограммах.', "Aralash massani faqat kilogrammda yozish kerak.", 'Write the mixed mass in kilograms only.'),
    prompt: b('Расположите шаги по порядку.', 'Qadamlarni tartib bilan joylashtiring.', 'Put the steps in order.'),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') }, { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') }, { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'target', order: 0, text: b('Определить цель: кг', 'Maqsadni aniqlash: kg', 'Identify the target: kg') },
      { id: 'convert', order: 1, text: b('2 т = 2000 кг', '2 t = 2000 kg', '2 t = 2000 kg') },
      { id: 'add', order: 2, text: b('2000 + 350', '2000 + 350', '2000 + 350') },
      { id: 'result', order: 3, text: b('2350 кг', '2350 kg', '2350 kg') },
    ],
    wrong: [b('Сначала выберите килограммы, затем переведите тонны и сложите.', "Avval kilogrammni tanlang, keyin tonnani o'tkazib, qo'shing.", 'Choose kilograms first, then convert the tonnes and add.')],
    secondHint: b('Сложение 2000 + 350 идёт после перевода 2 т.', "2000 + 350 yig'indisi 2 t o'tkazilgandan keyin keladi.", 'The addition 2000 + 350 comes after converting 2 t.'),
    thirdHint: b('Цель → 2 т = 2000 кг → 2000 + 350 → 2350 кг.', 'Maqsad → 2 t = 2000 kg → 2000 + 350 → 2350 kg.', 'Target → 2 t = 2000 kg → 2000 + 350 → 2350 kg.'),
    correctText: b('Верно. 2 т 350 кг = 2350 кг.', "To'g'ri. 2 t 350 kg = 2350 kg.", 'Correct. 2 t 350 kg = 2350 kg.'),
    rule: b('Перед сложением все части массы записывают в одной единице.', 'Qo‘shishdan oldin massaning barcha qismlari bir xil birlikda yoziladi.', 'Write all mass parts in one unit before adding.'),
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'mixed-centner-to-kg', answer: '365', maxLen: 3,
    visual: { headline: b('3 центнера 65 кг = ? кг', '3 sentner 65 kg = ? kg', '3 centners 65 kg = ? kg'), chips: [b('3 центнера = 300 кг', '3 sentner = 300 kg', '3 centners = 300 kg'), b('300 + 65', '300 + 65', '300 + 65')] },
    setup: b('Переведите всю массу в килограммы.', "Butun massani kilogrammga o'tkazing.", 'Convert the whole mass to kilograms.'),
    prompt: b('Введите число килограммов.', 'Kilogrammlar sonini kiriting.', 'Enter the number of kilograms.'),
    wrong: [b('Переведите 3 центнера в килограммы и прибавьте 65.', "3 sentnerni kilogrammga o'tkazib, 65 ni qo'shing.", 'Convert 3 centners to kilograms and add 65.')],
    secondHint: b('3 центнера = 300 кг.', '3 sentner = 300 kg.', '3 centners = 300 kg.'),
    thirdHint: b('300 + 65 = 365.', '300 + 65 = 365.', '300 + 65 = 365.'),
    correctText: b('Верно. 3 центнера 65 кг = 365 кг.', "To'g'ri. 3 sentner 65 kg = 365 kg.", 'Correct. 3 centners 65 kg = 365 kg.'),
    rule: b('Центнеры переводят в килограммы умножением на 100, затем прибавляют килограммы.', "Sentner 100 ga ko'paytirilib kilogrammga o'tkaziladi, keyin kilogrammlar qo'shiladi.", 'Multiply centners by 100, then add the kilograms.'),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'mass-remainder', answer: '275', maxLen: 3,
    visual: { headline: b('4275 кг = 4 т □ кг', '4275 kg = 4 t □ kg', '4275 kg = 4 t □ kg'), chips: [b('4 т = 4000 кг', '4 t = 4000 kg', '4 t = 4000 kg'), b('4275 − 4000', '4275 − 4000', '4275 − 4000')] },
    setup: b('Разделите 4275 кг на полные тонны и оставшиеся килограммы.', "4275 kg ni to'liq tonnalar va qolgan kilogrammlarga ajrating.", 'Split 4275 kg into whole tonnes and remaining kilograms.'),
    prompt: b('Какое число нужно вписать в пустое место?', "Bo'sh joyga qaysi sonni yozish kerak?", 'Which number belongs in the blank?'),
    wrong: [b('Четыре полные тонны занимают 4000 килограммов.', "To'rt to'liq tonna 4000 kilogrammni tashkil qiladi.", 'Four whole tonnes account for 4000 kilograms.')],
    secondHint: b('Из 4275 вычтите 4000.', '4275 dan 4000 ni ayiring.', 'Subtract 4000 from 4275.'),
    thirdHint: b('4275 − 4000 = 275.', '4275 − 4000 = 275.', '4275 − 4000 = 275.'),
    correctText: b('Верно. 4275 кг = 4 т 275 кг.', "To'g'ri. 4275 kg = 4 t 275 kg.", 'Correct. 4275 kg = 4 t 275 kg.'),
    rule: b('После выделения полных тонн остаток должен быть меньше 1000 кг.', "To'liq tonnalar ajratilgach, qoldiq 1000 kg dan kichik bo'lishi kerak.", 'After taking out whole tonnes, the remainder must be less than 1000 kg.'),
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'mass-word-problem', answer: '415', maxLen: 3,
    visual: { headline: b('Склад: 2 центнера 35 кг + 1 центнер 80 кг', 'Ombor: 2 sentner 35 kg + 1 sentner 80 kg', 'Warehouse: 2 centners 35 kg + 1 centner 80 kg'), chips: [b('235 кг', '235 kg', '235 kg'), b('180 кг', '180 kg', '180 kg')] },
    setup: b('На склад привезли две партии товара.', 'Omborga ikki partiya mahsulot keltirildi.', 'Two batches of goods arrived at a warehouse.'),
    prompt: b('Какова общая масса в килограммах?', 'Umumiy massa necha kilogramm?', 'What is the total mass in kilograms?'),
    wrong: [b('Сначала переведите обе партии: 235 кг и 180 кг.', "Avval ikkala partiyani o'tkazing: 235 kg va 180 kg.", 'Convert both batches first: 235 kg and 180 kg.')],
    secondHint: b('Сложите 235 + 180 и сохраните перенесённую сотню.', "235 + 180 ni qo'shing va o'tgan yuzlikni saqlang.", 'Add 235 + 180 and keep the carried hundred.'),
    thirdHint: b('235 + 180 = 415.', '235 + 180 = 415.', '235 + 180 = 415.'),
    correctText: b('Верно. Общая масса равна 415 кг.', "To'g'ri. Umumiy massa 415 kg.", 'Correct. The total mass is 415 kg.'),
    rule: b('Перед сложением обе массы переводят в одну единицу.', "Qo'shishdan oldin ikkala massa bir xil birlikka o'tkaziladi.", 'Convert both masses to one unit before adding.'),
  },
  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'mass-ordering',
    visual: { headline: b('Расположите массы по возрастанию', "Massalarni o'sish tartibida joylashtiring", 'Put the masses in ascending order'), chips: [b('950 кг', '950 kg', '950 kg'), b('1 т 50 кг', '1 t 50 kg', '1 t 50 kg'), b('1 т 2 центнера', '1 t 2 sentner', '1 t 2 centners')] },
    setup: b('Для сравнения можно перевести все массы в килограммы.', "Taqqoslash uchun barcha massalarni kilogrammga o'tkazish mumkin.", 'You can convert all masses to kilograms for comparison.'),
    prompt: b('Поставьте массы от наименьшей к наибольшей.', 'Massalarni eng kichigidan eng kattasiga qo‘ying.', 'Place the masses from smallest to largest.'),
    steps: [
      { id: 'place-1', label: b('Наименьшая', 'Eng kichik', 'Smallest') }, { id: 'place-2', label: b('Средняя', "O'rtacha", 'Middle') },
      { id: 'place-3', label: b('Наибольшая', 'Eng katta', 'Largest') },
    ],
    cards: [
      { id: 'mass-950', order: 0, text: b('950 кг', '950 kg', '950 kg') },
      { id: 'mass-1050', order: 1, text: b('1 т 50 кг', '1 t 50 kg', '1 t 50 kg') },
      { id: 'mass-1200', order: 2, text: b('1 т 2 центнера', '1 t 2 sentner', '1 t 2 centners') },
    ],
    wrong: [b('Сравните 950 кг, 1050 кг и 1200 кг.', '950 kg, 1050 kg va 1200 kg ni taqqoslang.', 'Compare 950 kg, 1050 kg and 1200 kg.')],
    secondHint: b('1 т 50 кг = 1050 кг; 1 т 2 центнера = 1200 кг.', '1 t 50 kg = 1050 kg; 1 t 2 sentner = 1200 kg.', '1 t 50 kg = 1050 kg; 1 t 2 centners = 1200 kg.'),
    thirdHint: b('950 < 1050 < 1200.', '950 < 1050 < 1200.', '950 < 1050 < 1200.'),
    correctText: b('Верно. 950 кг < 1 т 50 кг < 1 т 2 центнера.', "To'g'ri. 950 kg < 1 t 50 kg < 1 t 2 sentner.", 'Correct. 950 kg < 1 t 50 kg < 1 t 2 centners.'),
    rule: b('Разные записи удобно сравнивать после перевода в одну единицу.', "Turli yozuvlarni bir xil birlikka o'tkazib taqqoslash qulay.", 'Different forms are easier to compare after converting them to one unit.'),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'mixed-mass-zero',
    visual: { headline: b('7 кг 5 г = ? г', '7 kg 5 g = ? g', '7 kg 5 g = ? g'), chips: [b('7 кг = 7000 г', '7 kg = 7000 g', '7 kg = 7000 g'), b('7000 + 5', '7000 + 5', '7000 + 5')] },
    setup: b('Переведите смешанную массу в граммы.', "Aralash massani grammga o'tkazing.", 'Convert the mixed mass to grams.'),
    prompt: b('Какая запись верна?', "Qaysi yozuv to'g'ri?", 'Which form is correct?'),
    options: [
      option('7005-g', '7005 г', '7005 g', '7005 g', true),
      option('7500-g', '7500 г', '7500 g', '7500 g', false, 'Пять граммов — это 5, а не 500.', 'Besh gramm 500 emas, 5.', 'Five grams is 5, not 500.'),
      option('7050-g', '7050 г', '7050 g', '7050 g', false, 'Пять граммов занимают разряд единиц, поэтому нужны два нуля перед пятёркой.', "Besh gramm birliklar xonasida turadi, shuning uchun beshdan oldin ikkita nol kerak.", 'Five grams occupies the ones place, so two zeros are needed before the five.'),
      option('75-g', '75 г', '75 g', '75 g', false, 'Семь килограммов уже равны 7000 граммов.', 'Yetti kilogrammning o‘zi 7000 gramm.', 'Seven kilograms alone is 7000 grams.'),
    ],
    secondHint: b('7 кг = 7000 г; прибавьте только 5 г.', "7 kg = 7000 g; faqat 5 g qo'shing.", '7 kg = 7000 g; add just 5 g.'),
    thirdHint: b('7000 + 5 = 7005.', '7000 + 5 = 7005.', '7000 + 5 = 7005.'),
    correctText: b('Верно. 7 кг 5 г = 7005 г.', "To'g'ri. 7 kg 5 g = 7005 g.", 'Correct. 7 kg 5 g = 7005 g.'),
    rule: b('Нули сохраняют пустые разряды сотен и десятков граммов.', "Nollar grammning bo'sh yuzlik va o'nlik xonalarini saqlaydi.", 'Zeros keep the empty hundreds and tens places for grams.'),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'kilogram-tonne-error',
    visual: { headline: b('Ответ ученика: 6400 кг = 64 т', "O'quvchi javobi: 6400 kg = 64 t", "Pupil's answer: 6400 kg = 64 t"), chips: [b('1 т = 1000 кг', '1 t = 1000 kg', '1 t = 1000 kg'), b('Найдите первую ошибку', 'Birinchi xatoni toping', 'Find the first error')] },
    setup: b('Ученик переводил килограммы в тонны.', "O'quvchi kilogrammni tonnaga o'tkazdi.", 'A pupil converted kilograms to tonnes.'),
    prompt: b('Как объяснить ошибку и исправить ответ?', 'Xatoni qanday tushuntirish va javobni tuzatish kerak?', 'How should the error be explained and corrected?'),
    options: [
      option('divide-1000', 'Он разделил на 100 вместо 1000; верно 6 т 400 кг', "U 1000 o'rniga 100 ga bo'lgan; to'g'ri javob 6 t 400 kg", 'They divided by 100 instead of 1000; the answer is 6 t 400 kg', true),
      option('sixty-four', 'Ошибки нет: 64 т', "Xato yo'q: 64 t", 'There is no error: 64 t', false, 'В одной тонне 1000 килограммов, а не 100.', 'Bir tonnada 100 emas, 1000 kilogramm bor.', 'There are 1000 kilograms, not 100, in one tonne.'),
      option('divide-ten', 'Нужно разделить на 10: 640 т', "10 ga bo'lish kerak: 640 t", 'Divide by 10: 640 t', false, 'Тонны образуются группами по 1000 кг.', "Tonnalar 1000 kg lik guruhlardan hosil bo'ladi.", 'Tonnes are formed in groups of 1000 kg.'),
      option('multiply', 'Нужно умножить на 1000', "1000 ga ko'paytirish kerak", 'Multiply by 1000', false, 'Тонна крупнее килограмма, поэтому число полных единиц уменьшается.', "Tonna kilogrammdan katta, shuning uchun to'liq birliklar soni kamayadi.", 'A tonne is larger than a kilogram, so the number of whole units decreases.'),
    ],
    secondHint: b('Разделите 6400 на группы по 1000 кг.', "6400 ni 1000 kg lik guruhlarga ajrating.", 'Split 6400 into groups of 1000 kg.'),
    thirdHint: b('Получается 6 полных тонн и остаток 400 килограммов.', "6 to'liq tonna va 400 kilogramm qoldiq hosil bo'ladi.", 'There are 6 whole tonnes with 400 kilograms remaining.'),
    correctText: b('Верно. Первая ошибка — деление на 100; 6400 кг = 6 т 400 кг.', "To'g'ri. Birinchi xato — 100 ga bo'lish; 6400 kg = 6 t 400 kg.", 'Correct. The first error is dividing by 100; 6400 kg = 6 t 400 kg.'),
    rule: b('Килограммы переводят в тонны группами по 1000.', "Kilogramm tonnaga 1000 tadan guruhlab o'tkaziladi.", 'Convert kilograms to tonnes in groups of 1000.'),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'mass-strategy-transfer',
    visual: { headline: b('Груз: 1 т 250 кг + 7 центнеров 80 кг', 'Yuk: 1 t 250 kg + 7 sentner 80 kg', 'Load: 1 t 250 kg + 7 centners 80 kg'), chips: [b('1250 кг', '1250 kg', '1250 kg'), b('780 кг', '780 kg', '780 kg')] },
    setup: b('Нужно найти общую массу и записать её в тоннах и килограммах.', 'Umumiy massani topib, tonna va kilogrammda yozish kerak.', 'Find the total mass and write it in tonnes and kilograms.'),
    prompt: b('Какое решение верно и полностью?', "Qaysi yechim to'g'ri va to'liq?", 'Which solution is correct and complete?'),
    options: [
      option('full-strategy', '1250 + 780 = 2030 кг = 2 т 30 кг', '1250 + 780 = 2030 kg = 2 t 30 kg', '1250 + 780 = 2030 kg = 2 t 30 kg', true),
      option('centner-ten', '1250 + 150 = 1400 кг', '1250 + 150 = 1400 kg', '1250 + 150 = 1400 kg', false, 'Один центнер равен 100 кг, поэтому 7 центнеров 80 кг = 780 кг.', 'Bir sentner 100 kg, shuning uchun 7 sentner 80 kg = 780 kg.', 'One centner is 100 kg, so 7 centners 80 kg = 780 kg.'),
      option('stop-2030', '1250 + 780 = 2030 кг и не выделять тонны', "1250 + 780 = 2030 kg deb, tonnani ajratmaslik", 'Stop at 1250 + 780 = 2030 kg', false, 'Вопрос просит итог в тоннах и килограммах.', 'Savol natijani tonna va kilogrammda so‘raydi.', 'The question asks for the result in tonnes and kilograms.'),
      option('subtract', '1250 − 780 = 470 кг', '1250 − 780 = 470 kg', '1250 − 780 = 470 kg', false, 'Общую массу двух грузов находят сложением.', "Ikki yukning umumiy massasi qo'shish bilan topiladi.", 'The total mass of two loads is found by addition.'),
    ],
    secondHint: b('Переведите обе массы в килограммы: 1250 кг и 780 кг.', "Ikkala massani kilogrammga o'tkazing: 1250 kg va 780 kg.", 'Convert both masses to kilograms: 1250 kg and 780 kg.'),
    thirdHint: b('2030 кг содержат 2 полные тонны и 30 килограммов.', "2030 kg da 2 to'liq tonna va 30 kilogramm bor.", '2030 kg contains 2 whole tonnes and 30 kilograms.'),
    correctText: b('Верно. Общая масса — 2 т 30 кг.', "To'g'ri. Umumiy massa 2 t 30 kg.", 'Correct. The total mass is 2 t 30 kg.'),
    rule: b('Надёжная стратегия: одна единица для вычисления, затем удобная смешанная запись.', "Ishonchli usul: hisoblash uchun bitta birlik, keyin qulay aralash yozuv.", 'A reliable strategy uses one unit for calculation, then a convenient mixed form.'),
  },
];

function Visual({ visual, lang }) {
  return <div className="p4-visual"><strong>{tx(visual.headline, lang)}</strong><div className="p4-chips">{visual.chips.map((chip, index) => <span key={index}>{tx(chip, lang)}</span>)}</div></div>;
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}><div className="p4-pad-display">{value || '—'}</div><div className="p4-pad-keys">{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => <button type="button" key={digit} disabled={disabled} onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>{digit}</button>)}<button type="button" className="is-delete" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button></div></div>;
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite"><p className="p4-feedback-text">{tx(text, lang)}</p>{ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}</div>;
}

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, runId, onSolved ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);
  const scrollTimerRef = useRef(null);
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const options = useMemo(() => shuffle(task.options || [], runId), [task, runId, wrongRound]);
  const rightCards = useMemo(() => shuffle(task.right || [], runId), [task, runId]);
  const orderCards = useMemo(() => shuffle(task.cards || [], runId), [task, runId]);

  useEffect(() => {
    if (!checked) return undefined;
    scrollTimerRef.current = window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
    return () => window.clearTimeout(scrollTimerRef.current);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'mc') return picked !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed !== '';
    if (task.kind === 'match') return Object.keys(pairs).length === task.pairs.length;
    if (task.kind === 'order') return Object.keys(placed).length === task.steps.length;
    return false;
  })();
  const answerCorrect = () => {
    if (task.kind === 'mc') return Boolean(task.options.find((item) => item.id === picked)?.correct);
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
    return false;
  };
  const answerSnapshot = () => {
    if (task.kind === 'mc') { const selected = task.options.find((item) => item.id === picked); return { optionId: picked, text: selected?.text, displayOrder: options.map((item) => item.id) }; }
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'match') return { pairs: { ...pairs }, displayOrder: rightCards.map((item) => item.id) };
    return { order: task.steps.map((step) => placed[step.id]), displayOrder: orderCards.map((item) => item.id) };
  };
  const correctSnapshot = () => {
    if (task.kind === 'mc') { const correct = task.options.find((item) => item.correct); return { optionId: correct.id, text: correct.text }; }
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: task.answer };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    return { order: task.cards.slice().sort((left, right) => left.order - right.order).map((card) => card.id) };
  };
  const resetResponse = () => { checkingRef.current = false; setChecked(false); setPicked(null); setTyped(''); setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null); };
  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts); setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };
  const setAnswer = (setter, value) => { checkingRef.current = false; setter(value); setChecked(false); };
  const pickedOption = task.kind === 'mc' ? task.options.find((item) => item.id === picked) : null;
  const wrongText = adaptive(task, pickedOption, attempts);

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
  return <section className={`p4-task ${checked && !solved && attempts >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
    <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
    <p className="p4-setup">{tx(task.setup, lang)}</p><Visual visual={task.visual} lang={lang}/><h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>
    {task.kind === 'mc' && <div className="p4-options" role="group" aria-label={tx(task.prompt, lang)}>{options.map((item, index) => <button type="button" key={item.id} disabled={solved} aria-pressed={picked === item.id} className={`p4-option ${picked === item.id ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} onClick={() => setAnswer(setPicked, item.id)}><span className="p4-letter">{'ABCD'[index]}</span><span>{tx(item.text, lang)}</span></button>)}</div>}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang}/>}
    {task.kind === 'match' && <div className="p4-match"><p className="p4-note">{tx(UI.matchHint, lang)}</p><div className="p4-match-cols"><div className="p4-match-col">{task.pairs.map((pair) => <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id} className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`} onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}><span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b>{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}</button>)}</div><div className="p4-match-col">{rightCards.map((right) => { const used = Object.values(pairs).includes(right.id); return <button type="button" key={right.id} disabled={solved || activeLeft === null || used} className={`p4-match-item ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPairs((old) => ({ ...old, [activeLeft]: right.id })); setActiveLeft(null); setChecked(false); }}>{tx(right.text, lang)}</button>; })}</div></div></div>}
    {task.kind === 'order' && <div className="p4-order"><p className="p4-note">{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button type="button" key={step.id} disabled={solved} aria-pressed={activeStep === step.id} className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''}`} onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button type="button" key={card.id} disabled={solved || activeStep === null || used} className={`p4-card ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPlaced((old) => ({ ...old, [activeStep]: card.id })); setActiveStep(null); setChecked(false); }}>{tx(card.text, lang)}</button>; })}</div></div>}
    {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={solved ? task.correctText : wrongText} rule={task.rule} lang={lang}/>}
    {!platform && <div className="p4-actions">{!checked && !solved && <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>}{checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={resetResponse}>{tx(UI.retry, lang)}</button>}{solved && <button type="button" className="p4-btn p4-btn-ready" disabled={advancing} onClick={() => {
      if (advancedRef.current) return;
      advancedRef.current = true; checkingRef.current = false; setAdvancing(true);
      onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, locale: lang, setup: task.setup, prompt: task.prompt, studentAnswer: answerSnapshot(), correctAnswer: correctSnapshot(), answerChoices: task.options?.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) })) ?? task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) });
    }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}</div>}
  </section>;
}

export default function Grade4Dars27Practice({ lang: langProp, onFinished }) {
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
    setAnswers(nextAnswers); setFirstTry(nextFirstTry);
    if (index === 9) {
      if (finishedRef.current) return;
      finishedRef.current = true; setFinished(true);
      const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({ ...result, [level]: { total: TASKS.filter((item) => item.level === level).length, firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length } }), {});
      onFinished?.({
        lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), lessonTitleLocalized: LESSON_META.lessonTitle,
        grade: 4, lessonNumber: 27, locale: lang, activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
        correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100), finalScore: nextFirstTry, finalTotal: 10, passed: nextFirstTry >= 6,
        firstTryStats: { total: 10, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: 10, scorePercent: Math.round((nextFirstTry / 10) * 100) },
        attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
        // eslint-disable-next-line react-hooks/purity -- completion duration is captured in the finish event
        durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
        skillTags: [...new Set(TASKS.map((item) => item.skillTag))], levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
      });
      return;
    }
    setIndex((old) => old + 1);
  };
  const restart = () => { finishedRef.current = false; startedAtRef.current = Date.now(); setRunId((old) => old + 1); setIndex(0); setAnswers([]); setFirstTry(0); setFinished(false); };

  return <div className="p4-root"><style>{STYLES}</style>
    {preview && <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} aria-pressed={lang === code} className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
    <header className="p4-head"><div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}><div className="p4-progress-bar" style={{ width: `${percent}%` }}/></div><div className="p4-head-row"><span className="p4-title">{tx(UI.title, lang)}</span><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div></header>
    <main className="p4-main">{finished ? <section className="p4-done" aria-live="polite"><h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b><span>/ 10</span></p><p className="p4-note">{tx(UI.firstTry, lang)}</p><p className="p4-complete">{tx(UI.allSolved, lang)}</p><button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button></section> : <Task key={`${runId}-${task.id}`} task={task} lang={lang} isLast={index === 9} runId={runId} onSolved={onSolved}/>}</main>
  </div>;
}

const STYLES = `
.p4-root{position:relative;display:flex;flex-direction:column;min-height:100dvh;overflow-x:clip;padding:0 0 24px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root h1,.p4-root h2,.p4-root p{margin:0}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:5}.p4-lang button{min-width:44px;min-height:44px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font-family:'Manrope',system-ui,sans-serif;font-weight:800;font-size:11px;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{width:100%;padding:46px clamp(12px,4vw,24px) 8px}.p4-lang+.p4-head{padding-top:54px}.p4-progress,.p4-head-row{width:min(100%,720px);margin-inline:auto}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{flex:0 0 auto;white-space:nowrap;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;color:${T.ink3}}
.p4-main{flex:1;width:min(100%,720px);margin:0 auto;padding:4px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:12px;width:100%}.p4-eyebrow{margin:6px 0 0;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${T.accent}}.p4-setup{font-size:clamp(14px,2vw,16px);line-height:1.5;color:${T.ink2}}.p4-ask{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.25}.p4-note{font-size:13px;line-height:1.42;color:${T.ink3}}
.p4-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;min-height:126px;padding:14px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);text-align:center}.p4-visual>strong{font:800 clamp(16px,3vw,22px)/1.35 'Source Serif 4',Georgia,serif;color:${T.navy}}.p4-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:7px}.p4-chips span{min-height:36px;padding:8px 11px;border-radius:11px;background:${T.cyanSoft};color:${T.cyan};font:800 13px/1.35 'JetBrains Mono',monospace}.p4-task.is-hint .p4-visual{box-shadow:inset 0 0 0 2px rgba(169,111,19,.28)}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-option{display:flex;align-items:center;gap:9px;min-width:0;min-height:56px;padding:10px 12px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}.p4-option:disabled{cursor:default}.p4-option>span:last-child{min-width:0;overflow-wrap:anywhere}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800}.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}.p4-option.is-ok .p4-letter{background:${T.success};color:#fff}.p4-option.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}.p4-option.is-no .p4-letter{background:${T.warn};color:#fff}
.p4-match-cols{display:flex;gap:10px;margin-top:8px}.p4-match-col{display:flex;flex:1;min-width:0;flex-direction:column;gap:8px}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:0;min-height:50px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,15px)/1.35 'Manrope',sans-serif;color:${T.navy};overflow-wrap:anywhere;cursor:pointer}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35);background:${T.successSoft}}.p4-match-item.is-used{border-color:rgba(22,143,163,.3);background:${T.cyanSoft}}.p4-match-item:disabled{cursor:default;opacity:.65}.p4-match-item b{font-size:12px;color:${T.success}}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px}.p4-order-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:0;min-height:82px;padding:8px;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};color:${T.ink2};font-family:inherit;overflow-wrap:anywhere;cursor:pointer}.p4-order-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-order-slot:disabled{cursor:default}.p4-order-slot small{font-weight:800}.p4-order-slot b{font:800 12px/1.3 'JetBrains Mono',monospace;color:${T.navy}}.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:8px}.p4-card{min-width:44px;min-height:48px;padding:8px 12px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 13px/1.35 'Manrope',sans-serif;color:${T.ink};overflow-wrap:anywhere;cursor:pointer}.p4-card:hover:not(:disabled){border-color:rgba(22,143,163,.4)}.p4-card.is-used{border-color:rgba(34,122,83,.35);background:${T.successSoft};color:${T.success}}.p4-card:disabled{cursor:default;opacity:.65}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8);box-shadow:inset 0 1px rgba(255,255,255,.9)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;letter-spacing:2px;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}.p4-pad-keys button{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-pad-keys button:hover:not(:disabled){border-color:${T.cyan}}.p4-pad-keys button:disabled{opacity:.4;cursor:not-allowed}.p4-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.p4-feedback{padding:12px 14px;border-radius:14px}.p4-feedback.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-feedback.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-feedback-text{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-feedback.is-ok .p4-feedback-text{color:#1B6644}.p4-feedback.is-no .p4-feedback-text{color:#8A5C10}.p4-rule{margin:8px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-width:44px;min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}
.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(19px,3vw,24px)}.p4-score{display:flex;align-items:baseline;gap:5px;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}.p4-complete{font-size:13px;color:${T.ink2}}
@media(max-width:520px){.p4-options{grid-template-columns:1fr}.p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}.p4-match-cols{gap:8px}.p4-visual{min-height:112px}}
@media(max-width:520px) and (max-height:700px){.p4-root{padding-bottom:0}.p4-head{padding:42px 10px 3px}.p4-head-row{margin-top:5px}.p4-main{padding:2px 8px}.p4-task{gap:5px}.p4-eyebrow{margin-top:2px}.p4-setup{font-size:12px;line-height:1.25}.p4-ask{font-size:16px;line-height:1.2}.p4-visual{min-height:72px;padding:8px 9px;gap:5px;border-radius:15px}.p4-chips{gap:4px}.p4-chips span{min-height:30px;padding:5px 7px;font-size:11px}.p4-options{grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.p4-option{min-height:44px;padding:5px 7px;gap:5px;font-size:11.5px;line-height:1.2}.p4-letter{width:24px;height:24px}.p4-order-slot{min-height:60px}.p4-btn{min-height:44px;padding:7px 14px}.p4-feedback{padding:8px 10px}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;animation:none!important;transition:none!important}}

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
