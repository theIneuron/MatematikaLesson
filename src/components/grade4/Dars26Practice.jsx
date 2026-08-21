// 4-sinf, 26-dars amaliyoti: uzunlik birliklari.
// 10 topshiriq, UZ/RU/EN, ovozsiz, solve-to-advance.

import { useEffect, useMemo, useRef, useState } from 'react';
import { PRACTICE_FIX_CSS } from './grade4PracticeFixStyles.js';

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
  title: b('Урок 26. Практика: единицы длины', '26-dars. Amaliyot: uzunlik birliklari', 'Lesson 26. Practice: units of length'),
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
  orderHint: b('Сначала выберите место, затем карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', 'Choose a position, then a step card.'),
};

const LESSON_META = {
  lessonId: 'num-4-26-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 26,
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
  { id: 'practice-07', taskId: '07', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'cm-to-mm',
    visual: { headline: b('9 см = ? мм', '9 cm = ? mm', '9 cm = ? mm'), chips: [b('1 см = 10 мм', '1 cm = 10 mm', '1 cm = 10 mm'), b('9 × 10', '9 × 10', '9 × 10')] },
    setup: b('Переведите сантиметры в миллиметры.', "Santimetrni millimetrga o'tkazing.", 'Convert centimetres to millimetres.'),
    prompt: b('Сколько миллиметров в 9 сантиметрах?', '9 santimetrda necha millimetr bor?', 'How many millimetres are in 9 centimetres?'),
    options: [
      option('90-mm', '90 мм', '90 mm', '90 mm', true),
      option('900-mm', '900 мм', '900 mm', '900 mm', false, 'Здесь один переход по таблице единиц, поэтому множитель равен 10.', "Bu yerda birliklar jadvalida bitta o'tish bor, shuning uchun ko'paytiruvchi 10.", 'There is one step in the unit table, so the multiplier is 10.'),
      option('9-mm', '9 мм', '9 mm', '9 mm', false, 'При переходе к меньшей единице число увеличивается.', "Kichikroq birlikka o'tganda son kattalashadi.", 'The number increases when converting to a smaller unit.'),
      option('19-mm', '19 мм', '19 mm', '19 mm', false, 'Нужно умножить 9 на 10, а не прибавить 10.', "9 ga 10 ni qo'shish emas, 9 ni 10 ga ko'paytirish kerak.", 'Multiply 9 by 10 rather than adding 10.'),
    ],
    secondHint: b('Каждый сантиметр содержит 10 миллиметров.', 'Har bir santimetrda 10 millimetr bor.', 'Each centimetre contains 10 millimetres.'),
    thirdHint: b('9 × 10 = 90.', '9 × 10 = 90.', '9 × 10 = 90.'),
    correctText: b('Верно. 9 см = 90 мм.', "To'g'ri. 9 cm = 90 mm.", 'Correct. 9 cm = 90 mm.'),
    rule: b('Чтобы перевести сантиметры в миллиметры, умножают на 10.', "Santimetrni millimetrga o'tkazish uchun 10 ga ko'paytiriladi.", 'Multiply centimetres by 10 to convert them to millimetres.'),
  },
  {
    id: '02', level: 'green', kind: 'match', skillTag: 'length-equivalence',
    visual: { headline: b('Найдите равные длины', 'Teng uzunliklarni toping', 'Find equal lengths'), chips: [b('дм ↔ см', 'dm ↔ cm', 'dm ↔ cm'), b('м ↔ см', 'm ↔ cm', 'm ↔ cm'), b('км ↔ м', 'km ↔ m', 'km ↔ m')] },
    setup: b('У каждой длины слева есть равная запись справа.', 'Chapdagi har bir uzunlikning o‘ngda teng yozuvi bor.', 'Each length on the left has an equal form on the right.'),
    prompt: b('Соедините равные длины.', 'Teng uzunliklarni moslang.', 'Match the equal lengths.'),
    pairs: [
      { id: 'six-dm', left: b('6 дм', '6 dm', '6 dm'), correctRight: 'sixty-cm' },
      { id: 'seven-m', left: b('7 м', '7 m', '7 m'), correctRight: 'seven-hundred-cm' },
      { id: 'five-km', left: b('5 км', '5 km', '5 km'), correctRight: 'five-thousand-m' },
    ],
    right: [
      { id: 'sixty-cm', text: b('60 см', '60 cm', '60 cm') }, { id: 'seven-hundred-cm', text: b('700 см', '700 cm', '700 cm') },
      { id: 'five-thousand-m', text: b('5000 м', '5000 m', '5000 m') },
    ],
    wrong: [b('Сначала вспомните, сколько меньших единиц в одной большей.', "Avval bitta katta birlikda nechta kichik birlik borligini eslang.", 'First recall how many smaller units make one larger unit.')],
    secondHint: b('1 дм = 10 см, 1 м = 100 см, 1 км = 1000 м.', '1 dm = 10 cm, 1 m = 100 cm, 1 km = 1000 m.', '1 dm = 10 cm, 1 m = 100 cm, 1 km = 1000 m.'),
    thirdHint: b('Умножьте 6 на 10, 7 на 100 и 5 на 1000.', '6 ni 10 ga, 7 ni 100 ga va 5 ni 1000 ga ko‘paytiring.', 'Multiply 6 by 10, 7 by 100 and 5 by 1000.'),
    correctText: b('Верно. Все три пары равны.', "To'g'ri. Uchala juft ham teng.", 'Correct. All three pairs are equal.'),
    rule: b('При переходе к меньшей единице число умножают на число таких единиц в одной большей.', "Kichik birlikka o'tganda son bitta katta birlikdagi kichik birliklar soniga ko'paytiriladi.", 'When converting to a smaller unit, multiply by the number of those units in one larger unit.'),
  },
  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'mixed-length-procedure',
    visual: { headline: b('3 м 42 см → сантиметры', "3 m 42 cm → santimetr", '3 m 42 cm → centimetres'), chips: [b('3 м', '3 m', '3 m'), b('42 см', '42 cm', '42 cm')] },
    setup: b('Нужно записать смешанную длину только в сантиметрах.', "Aralash uzunlikni faqat santimetrda yozish kerak.", 'Write the mixed length in centimetres only.'),
    prompt: b('Расположите шаги по порядку.', 'Qadamlarni tartib bilan joylashtiring.', 'Put the steps in order.'),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') }, { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') }, { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'target', order: 0, text: b('Определить цель: см', 'Maqsadni aniqlash: cm', 'Identify the target: cm') },
      { id: 'convert', order: 1, text: b('3 м = 300 см', '3 m = 300 cm', '3 m = 300 cm') },
      { id: 'add', order: 2, text: b('300 + 42', '300 + 42', '300 + 42') },
      { id: 'result', order: 3, text: b('342 см', '342 cm', '342 cm') },
    ],
    wrong: [b('Сначала выберите итоговую единицу, затем переведите метры и сложите.', "Avval yakuniy birlikni tanlang, keyin metrni o'tkazib, qo'shing.", 'Choose the target unit first, then convert the metres and add.')],
    secondHint: b('Сложение 300 + 42 идёт после перевода 3 м.', "300 + 42 yig'indisi 3 m o'tkazilgandan keyin keladi.", 'The addition 300 + 42 comes after converting 3 m.'),
    thirdHint: b('Цель → 3 м = 300 см → 300 + 42 → 342 см.', 'Maqsad → 3 m = 300 cm → 300 + 42 → 342 cm.', 'Target → 3 m = 300 cm → 300 + 42 → 342 cm.'),
    correctText: b('Верно. 3 м 42 см = 342 см.', "To'g'ri. 3 m 42 cm = 342 cm.", 'Correct. 3 m 42 cm = 342 cm.'),
    rule: b('Перед сложением все части записывают в одной единице.', 'Qo‘shishdan oldin barcha qismlar bir xil birlikda yoziladi.', 'Write all parts in one unit before adding.'),
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'mixed-length-to-cm', answer: '847', maxLen: 3,
    visual: { headline: b('8 м 47 см = ? см', '8 m 47 cm = ? cm', '8 m 47 cm = ? cm'), chips: [b('8 м = 800 см', '8 m = 800 cm', '8 m = 800 cm'), b('800 + 47', '800 + 47', '800 + 47')] },
    setup: b('Переведите всю длину в сантиметры.', "Butun uzunlikni santimetrga o'tkazing.", 'Convert the whole length to centimetres.'),
    prompt: b('Введите число сантиметров.', 'Santimetrlar sonini kiriting.', 'Enter the number of centimetres.'),
    wrong: [b('Переведите 8 м в сантиметры и прибавьте 47.', "8 m ni santimetrga o'tkazib, 47 ni qo'shing.", 'Convert 8 m to centimetres and add 47.')],
    secondHint: b('8 м = 800 см.', '8 m = 800 cm.', '8 m = 800 cm.'),
    thirdHint: b('800 + 47 = 847.', '800 + 47 = 847.', '800 + 47 = 847.'),
    correctText: b('Верно. 8 м 47 см = 847 см.', "To'g'ri. 8 m 47 cm = 847 cm.", 'Correct. 8 m 47 cm = 847 cm.'),
    rule: b('Метры сначала переводят в сантиметры, затем прибавляют оставшиеся сантиметры.', "Avval metr santimetrga o'tkaziladi, keyin qolgan santimetr qo'shiladi.", 'Convert metres to centimetres, then add the remaining centimetres.'),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'length-remainder', answer: '74', maxLen: 2,
    visual: { headline: b('274 см = 2 м □ см', '274 cm = 2 m □ cm', '274 cm = 2 m □ cm'), chips: [b('2 м = 200 см', '2 m = 200 cm', '2 m = 200 cm'), b('274 − 200', '274 − 200', '274 − 200')] },
    setup: b('Разделите 274 см на полные метры и оставшиеся сантиметры.', "274 cm ni to'liq metrlar va qolgan santimetrlarga ajrating.", 'Split 274 cm into whole metres and remaining centimetres.'),
    prompt: b('Какое число нужно вписать в пустое место?', "Bo'sh joyga qaysi sonni yozish kerak?", 'Which number belongs in the blank?'),
    wrong: [b('Два полных метра занимают 200 сантиметров.', "Ikki to'liq metr 200 santimetrni tashkil qiladi.", 'Two whole metres account for 200 centimetres.')],
    secondHint: b('Из 274 вычтите 200.', '274 dan 200 ni ayiring.', 'Subtract 200 from 274.'),
    thirdHint: b('274 − 200 = 74.', '274 − 200 = 74.', '274 − 200 = 74.'),
    correctText: b('Верно. 274 см = 2 м 74 см.', "To'g'ri. 274 cm = 2 m 74 cm.", 'Correct. 274 cm = 2 m 74 cm.'),
    rule: b('После выделения полных метров остаток должен быть меньше 100 см.', "To'liq metrlar ajratilgach, qoldiq 100 cm dan kichik bo'lishi kerak.", 'After taking out whole metres, the remainder must be less than 100 cm.'),
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'length-word-problem', answer: '625', maxLen: 3,
    visual: { headline: b('Лента: 3 м 45 см + 2 м 80 см', 'Tasma: 3 m 45 cm + 2 m 80 cm', 'Ribbon: 3 m 45 cm + 2 m 80 cm'), chips: [b('345 см', '345 cm', '345 cm'), b('280 см', '280 cm', '280 cm')] },
    setup: b('Мадина соединила две ленты.', 'Madina ikkita tasmani uladi.', 'Madina joined two ribbons.'),
    prompt: b('Какова общая длина в сантиметрах?', 'Umumiy uzunlik necha santimetr?', 'What is the total length in centimetres?'),
    wrong: [b('Сначала переведите обе ленты: 345 см и 280 см.', "Avval ikkala tasmani o'tkazing: 345 cm va 280 cm.", 'Convert both ribbons first: 345 cm and 280 cm.')],
    secondHint: b('Сложите 345 + 280 и не потеряйте сотню при переходе.', "345 + 280 ni qo'shing va o'tishda yuzlikni yo'qotmang.", 'Add 345 + 280 and keep the carried hundred.'),
    thirdHint: b('345 + 280 = 625.', '345 + 280 = 625.', '345 + 280 = 625.'),
    correctText: b('Верно. Общая длина равна 625 см.', "To'g'ri. Umumiy uzunlik 625 cm.", 'Correct. The total length is 625 cm.'),
    rule: b('Величины складывают после перевода в одну единицу.', "Kattaliklar bir xil birlikka o'tkazilgandan keyin qo'shiladi.", 'Add measurements after converting them to one unit.'),
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'unit-choice',
    visual: { headline: b('Выберите удобную единицу для каждого объекта', 'Har bir obyekt uchun qulay birlikni tanlang', 'Choose a sensible unit for each object'), chips: [b('мм · см', 'mm · cm', 'mm · cm'), b('м · км', 'm · km', 'm · km')] },
    setup: b('Единица должна соответствовать размеру объекта.', "Birlik obyekt o'lchamiga mos bo'lishi kerak.", 'The unit should suit the size of the object.'),
    prompt: b('Соедините объект с подходящей длиной.', 'Obyektni mos uzunlik bilan bog‘lang.', 'Match each object to a suitable length.'),
    pairs: [
      { id: 'paper', left: b('Толщина листа бумаги', "Qog'oz varag'ining qalinligi", 'Thickness of a sheet of paper'), correctRight: 'one-mm' },
      { id: 'book', left: b('Ширина учебника', 'Darslikning eni', 'Width of a textbook'), correctRight: 'twenty-one-cm' },
      { id: 'corridor', left: b('Длина школьного коридора', "Maktab yo'lagining uzunligi", 'Length of a school corridor'), correctRight: 'eighteen-m' },
      { id: 'route', left: b('Длина автобусного маршрута', "Avtobus yo'nalishining uzunligi", 'Length of a bus route'), correctRight: 'twelve-km' },
    ],
    right: [
      { id: 'one-mm', text: b('1 мм', '1 mm', '1 mm') }, { id: 'twenty-one-cm', text: b('21 см', '21 cm', '21 cm') },
      { id: 'eighteen-m', text: b('18 м', '18 m', '18 m') }, { id: 'twelve-km', text: b('12 км', '12 km', '12 km') },
    ],
    wrong: [b('Сравните масштаб: толщина, небольшой предмет, здание, путь между местами.', "Ko'lamni solishtiring: qalinlik, kichik buyum, bino, joylar orasidagi yo'l.", 'Compare the scales: thickness, small object, building and journey.')],
    secondHint: b('Бумагу измеряют миллиметрами, а маршрут — километрами.', "Qog'oz millimetrda, yo'nalish esa kilometrda o'lchanadi.", 'Paper thickness is measured in millimetres and a route in kilometres.'),
    thirdHint: b('1 мм; 21 см; 18 м; 12 км — от самого малого масштаба к самому большому.', "1 mm; 21 cm; 18 m; 12 km — eng kichik ko'lamdan eng kattasiga.", '1 mm; 21 cm; 18 m; 12 km — from the smallest scale to the largest.'),
    correctText: b('Верно. Каждому объекту выбрана подходящая единица.', "To'g'ri. Har bir obyektga mos birlik tanlandi.", 'Correct. Each object has a suitable unit.'),
    rule: b('Единицу выбирают так, чтобы число было понятным и удобным.', "Birlik son tushunarli va qulay bo'ladigan qilib tanlanadi.", 'Choose a unit that makes the number clear and convenient.'),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'mixed-length-zero',
    visual: { headline: b('6 м 5 см ? 605 см', '6 m 5 cm ? 605 cm', '6 m 5 cm ? 605 cm'), chips: [b('6 м = 600 см', '6 m = 600 cm', '6 m = 600 cm'), b('600 + 5', '600 + 5', '600 + 5')] },
    setup: b('Сравните смешанную длину и длину в сантиметрах.', "Aralash uzunlik bilan santimetrdagi uzunlikni taqqoslang.", 'Compare the mixed length with the length in centimetres.'),
    prompt: b('Какой знак верен?', "Qaysi belgi to'g'ri?", 'Which sign is correct?'),
    options: [
      option('equal', '=', '=', '=', true),
      option('greater', '>', '>', '>', false, '6 м 5 см — это 605 см, а не 650 см.', '6 m 5 cm — 650 cm emas, 605 cm.', '6 m 5 cm is 605 cm, not 650 cm.'),
      option('less', '<', '<', '<', false, 'Пять сантиметров записываются после нуля десятков: 605.', 'Besh santimetr o‘nlik o‘rnidagi noldan keyin yoziladi: 605.', 'Five centimetres follow a zero in the tens place: 605.'),
      option('unknown', 'Сравнить нельзя', 'Taqqoslab bo‘lmaydi', 'Cannot be compared', false, 'Обе длины можно записать в сантиметрах.', "Ikkala uzunlikni ham santimetrda yozish mumkin.", 'Both lengths can be written in centimetres.'),
    ],
    secondHint: b('6 м = 600 см; прибавьте ещё 5 см.', "6 m = 600 cm; yana 5 cm qo'shing.", '6 m = 600 cm; add another 5 cm.'),
    thirdHint: b('600 + 5 = 605, поэтому длины равны.', '600 + 5 = 605, shuning uchun uzunliklar teng.', '600 + 5 = 605, so the lengths are equal.'),
    correctText: b('Верно. 6 м 5 см = 605 см.', "To'g'ri. 6 m 5 cm = 605 cm.", 'Correct. 6 m 5 cm = 605 cm.'),
    rule: b('Ноль в записи сохраняет пустой разряд десятков сантиметров.', "Yozuvdagi nol santimetrlar o'nligi bo'sh o'rnini saqlaydi.", 'The zero keeps the empty tens-of-centimetres place.'),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'metre-kilometre-error',
    visual: { headline: b('Ответ ученика: 7200 м = 72 км', "O'quvchi javobi: 7200 m = 72 km", "Pupil's answer: 7200 m = 72 km"), chips: [b('1 км = 1000 м', '1 km = 1000 m', '1 km = 1000 m'), b('Найдите первую ошибку', 'Birinchi xatoni toping', 'Find the first error')] },
    setup: b('Ученик переводил метры в километры.', "O'quvchi metrni kilometrga o'tkazdi.", 'A pupil converted metres to kilometres.'),
    prompt: b('Как объяснить ошибку и исправить ответ?', 'Xatoni qanday tushuntirish va javobni tuzatish kerak?', 'How should the error be explained and corrected?'),
    options: [
      option('divide-1000', 'Он разделил на 100 вместо 1000; верно 7 км 200 м', "U 1000 o'rniga 100 ga bo'lgan; to'g'ri javob 7 km 200 m", 'They divided by 100 instead of 1000; the answer is 7 km 200 m', true),
      option('seventy-two', 'Ошибки нет: 72 км', "Xato yo'q: 72 km", 'There is no error: 72 km', false, 'В одном километре 1000 метров, а не 100.', 'Bir kilometrda 100 emas, 1000 metr bor.', 'There are 1000 metres, not 100, in one kilometre.'),
      option('seven-two', 'Нужно разделить на 10: 720 км', "10 ga bo'lish kerak: 720 km", 'Divide by 10: 720 km', false, 'Переход от метров к километрам требует группы по 1000 м.', "Metrdan kilometrga o'tish 1000 m lik guruhlarni talab qiladi.", 'Converting metres to kilometres requires groups of 1000 m.'),
      option('multiply', 'Нужно умножить на 1000', "1000 ga ko'paytirish kerak", 'Multiply by 1000', false, 'Километр — более крупная единица, поэтому число полных единиц уменьшается.', "Kilometr kattaroq birlik, shuning uchun to'liq birliklar soni kamayadi.", 'A kilometre is larger, so the number of whole units decreases.'),
    ],
    secondHint: b('Разделите 7200 на группы по 1000 м.', "7200 ni 1000 m lik guruhlarga ajrating.", 'Split 7200 into groups of 1000 m.'),
    thirdHint: b('Получается 7 полных километров и остаток 200 метров.', "7 to'liq kilometr va 200 metr qoldiq hosil bo'ladi.", 'There are 7 whole kilometres with 200 metres remaining.'),
    correctText: b('Верно. Первая ошибка — деление на 100; 7200 м = 7 км 200 м.', "To'g'ri. Birinchi xato — 100 ga bo'lish; 7200 m = 7 km 200 m.", 'Correct. The first error is dividing by 100; 7200 m = 7 km 200 m.'),
    rule: b('Метры переводят в километры группами по 1000.', "Metr kilometrga 1000 tadan guruhlab o'tkaziladi.", 'Convert metres to kilometres in groups of 1000.'),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'length-strategy-transfer',
    visual: { headline: b('Путь: 2 км 350 м + 1 км 875 м', "Yo'l: 2 km 350 m + 1 km 875 m", 'Journey: 2 km 350 m + 1 km 875 m'), chips: [b('2350 м', '2350 m', '2350 m'), b('1875 м', '1875 m', '1875 m')] },
    setup: b('Нужно найти общую длину пути и записать её в километрах и метрах.', "Yo'lning umumiy uzunligini topib, kilometr va metrda yozish kerak.", 'Find the total journey length and write it in kilometres and metres.'),
    prompt: b('Какое решение верно и полностью?', "Qaysi yechim to'g'ri va to'liq?", 'Which solution is correct and complete?'),
    options: [
      option('full-strategy', '2350 + 1875 = 4225 м = 4 км 225 м', '2350 + 1875 = 4225 m = 4 km 225 m', '2350 + 1875 = 4225 m = 4 km 225 m', true),
      option('lost-carry', '2 + 1 = 3 км; 350 + 875 = 1225 м; ответ 3 км 225 м', '2 + 1 = 3 km; 350 + 875 = 1225 m; javob 3 km 225 m', '2 + 1 = 3 km; 350 + 875 = 1225 m; answer 3 km 225 m', false, 'В 1225 м есть ещё один полный километр.', "1225 m ichida yana bir to'liq kilometr bor.", 'There is another whole kilometre in 1225 m.'),
      option('no-convert', '2 км 350 м + 1 км 875 м = 3 км 1225 м и остановиться', "2 km 350 m + 1 km 875 m = 3 km 1225 m deb to'xtash", 'Stop at 3 km 1225 m', false, 'Запись нужно нормализовать: метров должно быть меньше 1000.', 'Yozuvni me’yorlashtirish kerak: metr 1000 dan kichik bo‘lishi lozim.', 'The form must be normalised: metres should be below 1000.'),
      option('subtract', '2350 − 1875 = 475 м', '2350 − 1875 = 475 m', '2350 − 1875 = 475 m', false, 'Искомая общая длина требует сложения.', "Umumiy uzunlikni topish uchun qo'shish kerak.", 'The total length requires addition.'),
    ],
    secondHint: b('Переведите оба участка в метры и сложите.', "Ikkala yo'l qismini metrga o'tkazib, qo'shing.", 'Convert both sections to metres and add.'),
    thirdHint: b('4225 м содержат 4 полных километра и 225 метров.', "4225 m da 4 to'liq kilometr va 225 metr bor.", '4225 m contains 4 whole kilometres and 225 metres.'),
    correctText: b('Верно. Общая длина пути — 4 км 225 м.', "To'g'ri. Yo'lning umumiy uzunligi 4 km 225 m.", 'Correct. The total journey is 4 km 225 m.'),
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

function Task({ task, lang, isLast, runId, onSolved }) {
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

  return <section className={`p4-task ${checked && !solved && attempts >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
    <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
    <p className="p4-setup">{tx(task.setup, lang)}</p><Visual visual={task.visual} lang={lang}/><h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>
    {task.kind === 'mc' && <div className="p4-options" role="group" aria-label={tx(task.prompt, lang)}>{options.map((item, index) => <button type="button" key={item.id} disabled={solved} aria-pressed={picked === item.id} className={`p4-option ${picked === item.id ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} onClick={() => setAnswer(setPicked, item.id)}><span className="p4-letter">{'ABCD'[index]}</span><span>{tx(item.text, lang)}</span></button>)}</div>}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang}/>}
    {task.kind === 'match' && <div className="p4-match"><p className="p4-note">{tx(UI.matchHint, lang)}</p><div className="p4-match-cols"><div className="p4-match-col">{task.pairs.map((pair) => <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id} className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`} onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}><span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b>{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}</button>)}</div><div className="p4-match-col">{rightCards.map((right) => { const used = Object.values(pairs).includes(right.id); return <button type="button" key={right.id} disabled={solved || activeLeft === null || used} className={`p4-match-item ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPairs((old) => ({ ...old, [activeLeft]: right.id })); setActiveLeft(null); setChecked(false); }}>{tx(right.text, lang)}</button>; })}</div></div></div>}
    {task.kind === 'order' && <div className="p4-order"><p className="p4-note">{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button type="button" key={step.id} disabled={solved} aria-pressed={activeStep === step.id} className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''}`} onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button type="button" key={card.id} disabled={solved || activeStep === null || used} className={`p4-card ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPlaced((old) => ({ ...old, [activeStep]: card.id })); setActiveStep(null); setChecked(false); }}>{tx(card.text, lang)}</button>; })}</div></div>}
    {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={solved ? task.correctText : wrongText} rule={task.rule} lang={lang}/>}
    <div className="p4-actions">{!checked && !solved && <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>}{checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={resetResponse}>{tx(UI.retry, lang)}</button>}{solved && <button type="button" className="p4-btn p4-btn-ready" disabled={advancing} onClick={() => {
      if (advancedRef.current) return;
      advancedRef.current = true; checkingRef.current = false; setAdvancing(true);
      onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, locale: lang, setup: task.setup, prompt: task.prompt, studentAnswer: answerSnapshot(), correctAnswer: correctSnapshot(), answerChoices: task.options?.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) })) ?? task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) });
    }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}</div>
  </section>;
}

export default function Grade4Dars26Practice({ lang: langProp, onFinished }) {
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
        grade: 4, lessonNumber: 26, locale: lang, activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
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

  return <div className="p4-root"><style>{STYLES + PRACTICE_FIX_CSS}</style>
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
`;
