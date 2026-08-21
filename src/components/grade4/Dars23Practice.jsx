// ============================================================================
// 4-SINF · 23-DARS AMALIYOTI · KASRLI MASALALAR: QISM VA BUTUN
// Dars01Practice metodik ketma-ketligi va Dars21Practice texnik kontrakti.
// ============================================================================

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
  title: b('Урок 23. Практика: дробные задачи о части и целом', '23-dars. Amaliyot: kasrli masalalar — qism va butun', 'Lesson 23. Practice: fraction problems with parts and wholes'),
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
  lessonId: 'num-4-23-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 23,
  activityType: 'practice', taskCount: 10, resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
  topic: b('Часть и целое в дробных задачах', 'Kasrli masalalarda qism va butun', 'Parts and wholes in fraction problems'),
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
    id: '01', level: 'green', kind: 'mc', skillTag: 'fraction_word_problems',
    visual: { type: 'story', main: b('48 солнечных панелей · проверено 3/8', '48 ta quyosh paneli · 3/8 qismi tekshirildi', '48 solar panels · 3/8 checked'), note: b('Проверка модели: 48 ÷ 8 × 3 = 18.', 'Model tekshiruvi: 48 ÷ 8 × 3 = 18.', 'Model check: 48 ÷ 8 × 3 = 18.') },
    setup: b('У Бекзода было 48 солнечных панелей. Он проверил 3/8 всех панелей.', 'Bekzodda 48 ta quyosh paneli bor edi. U barcha panellarning 3/8 qismini tekshirdi.', 'Bekzod had 48 solar panels. He checked 3/8 of all the panels.'),
    prompt: b('Какая величина неизвестна в задаче?', "Masalada qaysi miqdor noma'lum?", 'Which quantity is unknown in the problem?'),
    options: [
      option('part', 'Число проверенных панелей', 'Tekshirilgan panellar soni', 'The number of checked panels', true),
      option('whole', 'Общее число панелей', 'Panellarning umumiy soni', 'The total number of panels', false, 'Целое уже известно: всего 48 панелей.', 'Butun ma’lum: jami 48 ta panel.', 'The whole is already known: there are 48 panels.'),
      option('denominator', 'Число равных долей', 'Teng ulushlar soni', 'The number of equal shares', false, 'Знаменатель 8 уже задан.', '8 maxraj berilgan.', 'The denominator 8 is already given.'),
      option('remainder', 'Число непроверенных панелей', 'Tekshirilmagan panellar soni', 'The number of unchecked panels', false, 'Вопрос относится к проверенной части.', 'Savol tekshirilgan qism haqida.', 'The question is about the checked part.'),
    ],
    secondHint: b('Известны целое 48 и дробь 3/8; нужно найти часть.', 'Butun 48 va 3/8 kasr ma’lum; qismni topish kerak.', 'The whole 48 and fraction 3/8 are known; the part is needed.'),
    thirdHint: b('Искомая часть равна 48 ÷ 8 × 3 = 18.', 'Izlangan qism 48 ÷ 8 × 3 = 18 ga teng.', 'The required part is 48 ÷ 8 × 3 = 18.'),
    correctText: b('Верно. Неизвестно число проверенных панелей.', "To'g'ri. Tekshirilgan panellar soni noma'lum.", 'Correct. The number of checked panels is unknown.'),
    rule: b('Если известны целое и дробь, находят дробную часть целого.', 'Butun va kasr ma’lum bo‘lsa, butunning kasr qismi topiladi.', 'When the whole and fraction are known, find the fractional part of the whole.'),
  },
  {
    id: '02', level: 'green', kind: 'order', skillTag: 'find_part',
    visual: { type: 'groups', groups: 7, groupSize: 9, selected: 4, main: b('63 лампы: проверено 4/7', '63 ta chiroq: 4/7 qismi tekshirildi', '63 bulbs: 4/7 checked'), note: b('Семь равных групп по 9 ламп.', 'Yettita teng guruhda 9 tadan chiroq.', 'Seven equal groups of 9 bulbs.') },
    setup: b('На складе 63 лампы. Специалист проверил 4/7 всех ламп.', 'Omborda 63 ta chiroq bor. Mutaxassis ularning 4/7 qismini tekshirdi.', 'A store has 63 bulbs. A technician checked 4/7 of them.'),
    prompt: b('Расположите шаги решения по порядку.', 'Yechish qadamlarini tartib bilan joylashtiring.', 'Put the solution steps in order.'),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1'), correct: 'divide' },
      { id: 's2', label: b('Одна доля', 'Bitta ulush', 'One share'), correct: 'unit' },
      { id: 's3', label: b('Шаг 2', '2-qadam', 'Step 2'), correct: 'multiply' },
      { id: 's4', label: b('Ответ', 'Javob', 'Answer'), correct: 'result' },
    ],
    cards: [
      { id: 'divide', text: b('63 ÷ 7', '63 ÷ 7', '63 ÷ 7') },
      { id: 'unit', text: b('= 9', '= 9', '= 9') },
      { id: 'multiply', text: b('9 × 4', '9 × 4', '9 × 4') },
      { id: 'result', text: b('= 36', '= 36', '= 36') },
    ],
    wrong: [b('Сначала найдите одну седьмую, затем четыре седьмых.', 'Avval yettidan bir qismini, keyin yettidan to‘rt qismini toping.', 'Find one seventh first, then four sevenths.')],
    secondHint: b('Первое действие — 63 ÷ 7.', 'Birinchi amal — 63 ÷ 7.', 'The first operation is 63 ÷ 7.'),
    thirdHint: b('После 63 ÷ 7 = 9 выполните 9 × 4.', '63 ÷ 7 = 9 dan keyin 9 × 4 ni bajaring.', 'After 63 ÷ 7 = 9, calculate 9 × 4.'),
    correctText: b('Верно. Проверено 36 ламп.', "To'g'ri. 36 ta chiroq tekshirilgan.", 'Correct. 36 bulbs were checked.'),
    rule: b('Чтобы найти часть, разделите целое на знаменатель и умножьте на числитель.', 'Qismni topish uchun butunni maxrajga bo‘lib, suratga ko‘paytiring.', 'To find the part, divide the whole by the denominator and multiply by the numerator.'),
  },
  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'problem_representation',
    visual: { type: 'cards', main: b('Три ситуации: часть или целое', 'Uchta holat: qism yoki butun', 'Three situations: part or whole'), note: b('Направление вычислений зависит от неизвестной величины.', 'Hisoblash yo‘nalishi noma’lum miqdorga bog‘liq.', 'The direction of calculation depends on the unknown quantity.') },
    setup: b('В одной ситуации нужно восстановить целое, в двух других — найти часть.', 'Bitta holatda butunni tiklash, qolgan ikkitasida qismni topish kerak.', 'One situation requires restoring the whole; the other two require finding a part.'),
    prompt: b('Соедините условие с верным решением.', "Shartni to'g'ri yechim bilan moslashtiring.", 'Match each condition to the correct solution.'),
    pairs: [
      { id: 'a', left: b('A · Целое 60, найти 2/5', 'A · Butun 60, 2/5 qismini topish', 'A · Whole 60, find 2/5'), correctRight: 'part24' },
      { id: 'b', left: b('B · 24 — это 3/8 целого', 'B · 24 — butunning 3/8 qismi', 'B · 24 is 3/8 of the whole'), correctRight: 'whole64' },
      { id: 'c', left: b('C · Целое 54, найти 5/9', 'C · Butun 54, 5/9 qismini topish', 'C · Whole 54, find 5/9'), correctRight: 'part30' },
    ],
    right: [
      { id: 'part24', text: b('60 ÷ 5 × 2 = 24', '60 ÷ 5 × 2 = 24', '60 ÷ 5 × 2 = 24') },
      { id: 'whole64', text: b('24 ÷ 3 × 8 = 64', '24 ÷ 3 × 8 = 64', '24 ÷ 3 × 8 = 64') },
      { id: 'part30', text: b('54 ÷ 9 × 5 = 30', '54 ÷ 9 × 5 = 30', '54 ÷ 9 × 5 = 30') },
    ],
    wrong: [b('Определите, что известно: целое или дробная часть.', 'Nima ma’lumligini aniqlang: butunmi yoki kasr qismmi.', 'Identify what is known: the whole or the fractional part.')],
    secondHint: b('Только в ситуации B нужно восстановить целое.', 'Faqat B holatida butunni tiklash kerak.', 'Only situation B requires restoring the whole.'),
    thirdHint: b('A и C: целое ÷ знаменатель × числитель. B: часть ÷ числитель × знаменатель.', 'A va C: butun ÷ maxraj × surat. B: qism ÷ surat × maxraj.', 'A and C: whole ÷ denominator × numerator. B: part ÷ numerator × denominator.'),
    correctText: b('Верно. Получены 24, 64 и 30.', "To'g'ri. 24, 64 va 30 olindi.", 'Correct. The results are 24, 64 and 30.'),
    rule: b('Модель вычисления меняется вместе с неизвестной величиной.', 'Noma’lum miqdor o‘zgarsa, hisoblash modeli ham o‘zgaradi.', 'The calculation model changes with the unknown quantity.'),
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'find_whole', answer: '63', maxLen: 2,
    visual: { type: 'formula', main: b('4/9 целого = 28', 'Butunning 4/9 qismi = 28', '4/9 of the whole = 28'), note: b('28 ÷ 4 × 9', '28 ÷ 4 × 9', '28 ÷ 4 × 9') },
    setup: b('Четыре девятых некоторого числа равны 28.', 'Noma’lum sonning to‘qqizdan to‘rt qismi 28 ga teng.', 'Four ninths of an unknown number equal 28.'),
    prompt: b('Введите целое число.', 'Butun sonni kiriting.', 'Enter the whole number.'),
    wrong: [b('Сначала найдите одну девятую по четырём известным долям.', 'Avval ma’lum to‘rtta ulushdan to‘qqizdan bir qismini toping.', 'First find one ninth from the four known shares.')],
    secondHint: b('28 ÷ 4 = 7 — одна девятая.', '28 ÷ 4 = 7 — to‘qqizdan bir qism.', '28 ÷ 4 = 7 is one ninth.'),
    thirdHint: b('Целое состоит из девяти долей: 7 × 9.', 'Butun to‘qqizta ulushdan iborat: 7 × 9.', 'The whole has nine shares: 7 × 9.'),
    correctText: b('Верно. Целое равно 63.', "To'g'ri. Butun 63 ga teng.", 'Correct. The whole is 63.'),
    rule: b('Целое восстанавливают: часть ÷ числитель × знаменатель.', 'Butun qism ÷ surat × maxraj orqali tiklanadi.', 'Restore the whole with: part ÷ numerator × denominator.'),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'equal_groups', answer: '7', maxLen: 1,
    visual: { type: 'formula', main: b('5/6 целого = 35; 35 ÷ 5 = □; □ × 6 = 42', 'Butunning 5/6 qismi = 35; 35 ÷ 5 = □; □ × 6 = 42', '5/6 of the whole = 35; 35 ÷ 5 = □; □ × 6 = 42'), note: b('Пустое место — размер одной доли.', 'Bo‘sh joy — bitta ulush miqdori.', 'The blank is the size of one share.') },
    setup: b('Пять равных долей вместе дают 35.', 'Beshta teng ulush birgalikda 35 ni beradi.', 'Five equal shares total 35.'),
    prompt: b('Какое число нужно вписать?', 'Qaysi sonni yozish kerak?', 'Which number belongs in the blank?'),
    wrong: [b('Разделите 35 на число известных долей — на 5.', '35 ni ma’lum ulushlar soniga, ya’ni 5 ga bo‘ling.', 'Divide 35 by the number of known shares, which is 5.')],
    secondHint: b('Одна доля равна 35 ÷ 5.', 'Bitta ulush 35 ÷ 5 ga teng.', 'One share equals 35 ÷ 5.'),
    thirdHint: b('35 ÷ 5 = 7.', '35 ÷ 5 = 7.', '35 ÷ 5 = 7.'),
    correctText: b('Верно. Одна шестая равна 7, а целое равно 42.', "To'g'ri. Oltidan bir qism 7, butun esa 42 ga teng.", 'Correct. One sixth is 7 and the whole is 42.'),
    rule: b('Известную часть делят на числитель, чтобы получить одну долю.', 'Bitta ulushni topish uchun ma’lum qism suratga bo‘linadi.', 'Divide the known part by the numerator to get one share.'),
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'find_whole', answer: '80', maxLen: 2,
    visual: { type: 'story', main: b('24 аккумулятора = 3/10 поставки', '24 ta akkumulyator = yetkazmaning 3/10 qismi', '24 batteries = 3/10 of the shipment'), note: b('Найдите все десять долей.', 'O‘nta ulushning barchasini toping.', 'Find all ten shares.') },
    setup: b('24 аккумулятора для дронов составляют 3/10 всей поставки Алишера.', '24 ta dron akkumulyatori Alisherning butun yetkazmasining 3/10 qismini tashkil qiladi.', 'Twenty-four drone batteries make up 3/10 of Alisher’s full shipment.'),
    prompt: b('Сколько аккумуляторов было во всей поставке?', 'Butun yetkazmada nechta akkumulyator bo‘lgan?', 'How many batteries were in the full shipment?'),
    wrong: [b('Число 24 обозначает три равные доли, а не всё целое.', '24 soni uchta teng ulushni bildiradi, butunni emas.', 'The number 24 represents three equal shares, not the whole.')],
    secondHint: b('24 ÷ 3 = 8 аккумуляторов в одной десятой.', '24 ÷ 3 = 8 ta akkumulyator o‘ndan bir qismda.', '24 ÷ 3 = 8 batteries in one tenth.'),
    thirdHint: b('Теперь найдите 8 × 10.', 'Endi 8 × 10 ni toping.', 'Now find 8 × 10.'),
    correctText: b('Верно. Во всей поставке было 80 аккумуляторов.', "To'g'ri. Butun yetkazmada 80 ta akkumulyator bo'lgan.", 'Correct. The full shipment contained 80 batteries.'),
    rule: b('Для целого соберите все доли, названные знаменателем.', 'Butun uchun maxraj bildirgan barcha ulushlarni yig‘ing.', 'For the whole, assemble all the shares named by the denominator.'),
  },
  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'inverse_path_order',
    visual: { type: 'groups', groups: 9, groupSize: 5, selected: 4, main: b('4/9 целого = 20', 'Butunning 4/9 qismi = 20', '4/9 of the whole = 20'), note: b('Четыре доли по 5; всего девять долей.', 'To‘rtta ulushda 5 tadan; jami to‘qqiz ulush.', 'Four shares of 5; nine shares altogether.') },
    setup: b('Четыре девятых неизвестного целого равны 20.', 'Noma’lum butunning 4/9 qismi 20 ga teng.', 'Four ninths of an unknown whole equal 20.'),
    prompt: b('Восстановите порядок рассуждения.', 'Fikrlash tartibini tiklang.', 'Restore the order of reasoning.'),
    steps: [
      { id: 's1', label: b('Дано', 'Berilgan', 'Given'), correct: 'known' },
      { id: 's2', label: b('Одна доля', 'Bitta ulush', 'One share'), correct: 'unit' },
      { id: 's3', label: b('Целое', 'Butun', 'Whole'), correct: 'all' },
      { id: 's4', label: b('Результат', 'Natija', 'Result'), correct: 'result' },
    ],
    cards: [
      { id: 'known', text: b('4 доли = 20', '4 ta ulush = 20', '4 shares = 20') },
      { id: 'unit', text: b('20 ÷ 4 = 5', '20 ÷ 4 = 5', '20 ÷ 4 = 5') },
      { id: 'all', text: b('Целое = 9 долей', 'Butun = 9 ta ulush', 'Whole = 9 shares') },
      { id: 'result', text: b('5 × 9 = 45', '5 × 9 = 45', '5 × 9 = 45') },
    ],
    wrong: [b('Идите от известной части к одной доле, затем ко всему целому.', 'Ma’lum qismdan bitta ulushga, so‘ng butunga boring.', 'Go from the known part to one share, then to the whole.')],
    secondHint: b('После «4 доли = 20» идёт 20 ÷ 4.', '“4 ta ulush = 20” dan keyin 20 ÷ 4 keladi.', 'After “4 shares = 20” comes 20 ÷ 4.'),
    thirdHint: b('Последний шаг умножает одну долю на 9.', 'Oxirgi qadam bitta ulushni 9 ga ko‘paytiradi.', 'The final step multiplies one share by 9.'),
    correctText: b('Верно. Целое равно 45.', "To'g'ri. Butun 45 ga teng.", 'Correct. The whole is 45.'),
    rule: b('Обратный путь: известные доли → одна доля → целое.', 'Teskari yo‘l: ma’lum ulushlar → bitta ulush → butun.', 'The inverse path is: known shares → one share → whole.'),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'unit_fraction_to_whole',
    visual: { type: 'groups', groups: 12, groupSize: 6, selected: 1, main: b('1/12 целого = 6 микросхем', 'Butunning 1/12 qismi = 6 ta mikrosxema', '1/12 of the whole = 6 chips'), note: b('Одна доля уже известна.', 'Bitta ulush allaqachon ma’lum.', 'One share is already known.') },
    setup: b('Одна двенадцатая всей партии равна 6 микросхемам.', 'Butun partiyaning o‘n ikkidan bir qismi 6 ta mikrosxemaga teng.', 'One twelfth of the full batch equals 6 chips.'),
    prompt: b('Сколько микросхем во всей партии?', 'Butun partiyada nechta mikrosxema bor?', 'How many chips are in the full batch?'),
    options: [
      option('whole', '72', '72', '72', true),
      option('part', '6', '6', '6', false, '6 — только одна из двенадцати долей.', '6 — o‘n ikkita ulushdan faqat bittasi.', '6 is only one of twelve shares.'),
      option('denominator', '12', '12', '12', false, '12 — число долей, а не микросхем.', '12 ulushlar soni, mikrosxemalar soni emas.', '12 is the number of shares, not chips.'),
      option('sum', '18', '18', '18', false, 'Нужно двенадцать групп по 6.', '6 tadan o‘n ikkita guruh kerak.', 'Twelve groups of 6 are needed.'),
    ],
    secondHint: b('Целое состоит из 12 долей по 6 микросхем.', 'Butun 6 tadan 12 ta ulushdan iborat.', 'The whole consists of 12 shares of 6 chips.'),
    thirdHint: b('Вычислите 6 × 12.', '6 × 12 ni hisoblang.', 'Calculate 6 × 12.'),
    correctText: b('Верно. Во всей партии 72 микросхемы.', "To'g'ri. Butun partiyada 72 ta mikrosxema bor.", 'Correct. The full batch has 72 chips.'),
    rule: b('Известную одну долю умножают на знаменатель.', 'Ma’lum bitta ulush maxrajga ko‘paytiriladi.', 'Multiply the known one share by the denominator.'),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'inverse_check',
    visual: { type: 'formula', main: b('2/9 целого = 18; ошибочно: 18 ÷ 9 × 2 = 4', 'Butunning 2/9 qismi = 18; xato: 18 ÷ 9 × 2 = 4', '2/9 of the whole = 18; incorrect: 18 ÷ 9 × 2 = 4'), note: b('Известна часть: направление нужно обратить.', 'Qism ma’lum: yo‘nalishni teskarilash kerak.', 'The part is known: reverse the direction.') },
    setup: b('Применили алгоритм поиска части, хотя нужно восстановить целое.', 'Qismni topish algoritmi ishlatilgan, aslida butunni tiklash kerak.', 'The find-a-part algorithm was used even though the whole must be restored.'),
    prompt: b('Какое исправление верно?', "Qaysi tuzatish to'g'ri?", 'Which correction is right?'),
    options: [
      option('repair', '18 ÷ 2 × 9 = 81', '18 ÷ 2 × 9 = 81', '18 ÷ 2 × 9 = 81', true),
      option('keep', '18 ÷ 9 × 2 = 4', '18 ÷ 9 × 2 = 4', '18 ÷ 9 × 2 = 4', false, '18 обозначает две доли: сначала делите на 2.', '18 ikkita ulushni bildiradi: avval 2 ga bo‘ling.', '18 represents two shares: divide by 2 first.'),
      option('unit', '18 ÷ 2 = 9', '18 ÷ 2 = 9', '18 ÷ 2 = 9', false, '9 — одна девятая; нужно собрать девять долей.', '9 — to‘qqizdan bir qism; to‘qqiz ulushni yig‘ish kerak.', '9 is one ninth; assemble all nine shares.'),
      option('part-again', 'Ответ 18', 'Javob 18', 'The answer is 18', false, '18 — известная часть, а не целое.', '18 ma’lum qism, butun emas.', '18 is the known part, not the whole.'),
    ],
    secondHint: b('Разделите 18 на числитель 2.', '18 ni surat 2 ga bo‘ling.', 'Divide 18 by the numerator 2.'),
    thirdHint: b('Одна девятая равна 9; целое равно 9 × 9.', 'To‘qqizdan bir qism 9; butun 9 × 9 ga teng.', 'One ninth is 9; the whole is 9 × 9.'),
    correctText: b('Верно. Целое равно 81.', "To'g'ri. Butun 81 ga teng.", 'Correct. The whole is 81.'),
    rule: b('Проверка: 2/9 от 81 действительно равно 18.', 'Tekshiruv: 81 ning 2/9 qismi haqiqatan 18 ga teng.', 'Check: 2/9 of 81 is indeed 18.'),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'fraction_word_problems',
    visual: { type: 'story', main: b('Использовано 3/10 ленты · осталось 42 м', 'Tasmaning 3/10 qismi ishlatildi · 42 m qoldi', '3/10 of a ribbon was used · 42 m remains'), note: b('Остаток составляет 7/10 целого.', 'Qoldiq butunning 7/10 qismini tashkil qiladi.', 'The remainder is 7/10 of the whole.') },
    setup: b('Мадина использовала 3/10 рулона ленты. После этого осталось 42 метра.', 'Madina tasma o‘ramining 3/10 qismini ishlatdi. Shundan keyin 42 metr qoldi.', 'Madina used 3/10 of a roll of ribbon. Afterwards, 42 metres remained.'),
    prompt: b('Какая стратегия находит первоначальную длину?', 'Dastlabki uzunlikni qaysi strategiya topadi?', 'Which strategy finds the original length?'),
    options: [
      option('strategy', 'Осталось 7/10; 42 ÷ 7 × 10 = 60', '7/10 qismi qoldi; 42 ÷ 7 × 10 = 60', '7/10 remains; 42 ÷ 7 × 10 = 60', true),
      option('used-fraction', '42 ÷ 3 × 10 = 140', '42 ÷ 3 × 10 = 140', '42 ÷ 3 × 10 = 140', false, '42 метра — оставшиеся 7/10, а не использованные 3/10.', '42 metr qolgan 7/10 qism, ishlatilgan 3/10 emas.', 'The 42 metres are the remaining 7/10, not the used 3/10.'),
      option('find-part', '42 ÷ 10 × 7', '42 ÷ 10 × 7', '42 ÷ 10 × 7', false, '42 — уже часть; нужно восстановить целое.', '42 allaqachon qism; butunni tiklash kerak.', '42 is already a part; restore the whole.'),
      option('unchanged', 'Первоначально было 42 м', 'Dastlab 42 m bo‘lgan', 'The original length was 42 m', false, 'До использования рулон был длиннее 42 метров.', 'Ishlatishdan oldin o‘ram 42 metrdan uzunroq bo‘lgan.', 'Before use, the roll was longer than 42 metres.'),
    ],
    secondHint: b('Сначала: 10/10 − 3/10 = 7/10.', 'Avval: 10/10 − 3/10 = 7/10.', 'First: 10/10 − 3/10 = 7/10.'),
    thirdHint: b('42 метра — семь долей; одна доля равна 42 ÷ 7 = 6.', '42 metr — yettita ulush; bitta ulush 42 ÷ 7 = 6.', '42 metres is seven shares; one share is 42 ÷ 7 = 6.'),
    correctText: b('Верно. Первоначальная длина была 60 метров.', "To'g'ri. Dastlabki uzunlik 60 metr bo'lgan.", 'Correct. The original length was 60 metres.'),
    rule: b('В задачах на остаток сначала найдите, какая дробь целого осталась.', 'Qoldiqli masalalarda avval butunning qanday kasr qismi qolganini toping.', 'In remainder problems, first find what fraction of the whole remains.'),
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
  const right = useMemo(() => shuffle(task.right, `${task.id}:${runSeed}`), [task.right, task.id, runSeed]);
  const used = new Set(Object.values(pairs));
  return <div>
    <p className="p4-interaction-hint">{tx(UI.matchHint, lang)}</p>
    <div className="p4-match">
      <div className="p4-match-col">
        {task.pairs.map((pair) => <button key={pair.id} type="button" className={activeLeft === pair.id ? 'is-active' : pairs[pair.id] ? 'is-filled' : ''} disabled={locked} onClick={() => setActiveLeft(pair.id)}>{tx(pair.left, lang)}{pairs[pair.id] ? <small>✓</small> : null}</button>)}
      </div>
      <div className="p4-match-col">
        {right.map((item) => <button key={item.id} type="button" disabled={locked || !activeLeft || (used.has(item.id) && pairs[activeLeft] !== item.id)} onClick={() => {
          if (!activeLeft) return;
          setPairs((value) => ({ ...value, [activeLeft]: item.id }));
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

function PracticeTask({ task, index, lang, runSeed, onSolved }) {
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
    <div className="p4-actions">
      {!solved && !checked && <button type="button" className="p4-btn" disabled={!responseReady} onClick={check}>{tx(UI.check, lang)}</button>}
      {!solved && checked && <button type="button" className="p4-btn p4-btn-ghost" onClick={resetResponse}>{tx(UI.retry, lang)}</button>}
      {solved && <button type="button" className="p4-btn p4-btn-ready" onClick={advance}>{index === 9 ? tx(UI.finish, lang) : tx(UI.next, lang)}</button>}
    </div>
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

export default function Grade4Dars23Practice({ studentName, lang: langProp, onFinished }) {
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
    <style>{CSS + PRACTICE_FIX_CSS}</style>
    <main className="p4-main">
      <header className="p4-header">
        <div><span className="p4-kicker">4 · 23</span><h1>{tx(UI.title, lang)}</h1></div>
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
`;
