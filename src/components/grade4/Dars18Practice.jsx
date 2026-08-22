// ============================================================================
// 4-SINF · 18-DARS AMALIYOTI · KASR TUSHUNCHASI
// Dars01Practice kontrakti: 10 topshiriq, UZ/RU/EN, ovozsiz, solve-to-advance.
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
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '0 16px 36px -24px rgba(23,59,82,.34)',
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? (value[lang] ?? '') : value);
const adaptive = (task, pickedOption, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  return pickedOption?.wrong || task.wrong?.[0] || task.secondHint;
};
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const UI = {
  title: b('Урок 18. Практика: понятие дроби', "18-dars. Amaliyot: kasr tushunchasi", "Lesson 18. Practice: understanding fractions"),
  language: b('Язык', 'Til', 'Language'),
  numerator: b('Числитель', 'Surat', 'Numerator'),
  denominator: b('Знаменатель', 'Maxraj', 'Denominator'),
  task: b('Задание', 'Topshiriq', "Task"),
  level: { green: b('Базовое', 'Asosiy', "Core"), yellow: b('Применение', "Qo'llash", "Application"), red: b('Перенос', "Ko'chirish", "Transfer") },
  check: b('Проверить', 'Tekshirish', "Check"), retry: b('Исправить ответ', 'Javobni tuzatish', "Correct the answer"),
  next: b('Следующее', 'Keyingisi', "Next"), finish: b('Завершить', 'Yakunlash', "Finish"),
  again: b('Пройти заново', 'Qaytadan ishlash', "Try again"), done: b('Практика пройдена', 'Amaliyot tugadi', "Practice complete"),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", "correct on the first check"),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', "All 10 tasks have been solved."),
  rule: b('Запомните', 'Eslab qoling', "Remember"), typeAnswer: b('Введите числовой ответ', 'Sonli javobni kiriting', "Enter a numerical answer"),
  clear: b('Стереть', "O'chirish", "Delete"), matchHint: b('Выберите карточку слева, затем пару справа.', "Avval chapdagi kartani, keyin o'ngdagi juftini tanlang.", "Choose a card on the left, then its match on the right."),
  orderHint: b('Выберите место, затем карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', "Choose a position, then a step card."),
};

const LESSON_META = {
  lessonId: 'num-4-18-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 18,
  activityType: 'practice', taskCount: 10, resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'fraction-builder', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'tap-construction', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'point-to-model', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'model-to-fraction',
    visual: { type: 'bar', total: 7, filled: 3, label: '3/7' },
    setup: b('Целое разделено на семь равных частей. Три части закрашены.', "Butun yettita teng qismga bo'lingan. Uchta qism bo'yalgan.", "The whole is divided into seven equal parts. Three parts are shaded."),
    prompt: b('Какая дробь показана на модели?', "Modelda qaysi kasr ko'rsatilgan?", "Which fraction is shown by the model?"),
    options: [
      option('correct', '3/7', '3/7', "3/7", true),
      option('swapped', '7/3', '7/3', "7/3", false, 'Вы поменяли местами число выбранных и всех частей.', "Tanlangan va jami qismlar sonining o'rnini almashtirdingiz.", "You swapped the number of selected parts and the total number of parts."),
      option('empty', '4/7', '4/7', "4/7", false, 'Четыре части не закрашены. Числитель показывает выбранные части.', "To'rtta qism bo'yalmagan. Surat tanlangan qismlarni ko'rsatadi.", "Four parts are not shaded. The numerator shows the selected parts."),
      option('count', '3/6', '3/6', "3/6", false, 'Всего частей семь, а не шесть.', "Jami qismlar oltita emas, yettita.", "There are seven parts altogether, not six."),
    ],
    secondHint: b('Сначала посчитайте все равные части, затем закрашенные.', "Avval barcha teng qismlarni, keyin bo'yalgan qismlarni sanang.", "First count all the equal parts, then count the shaded parts."),
    thirdHint: b('Если из пяти равных частей выбраны две, запись будет 2/5.', "Besh teng qismdan ikkitasi tanlansa, yozuv 2/5 bo'ladi.", "If two of five equal parts are selected, the fraction is 2/5."),
    correctText: b('Верно. Три выбранные части из семи записываются как 3/7.', "To'g'ri. Yettita qismdan tanlangan uchtasi 3/7 deb yoziladi.", "Correct. Three selected parts out of seven are written as 3/7."),
    rule: b('Числитель показывает выбранные части, знаменатель — все равные части.', "Surat tanlangan qismlarni, maxraj barcha teng qismlarni ko'rsatadi.", "The numerator shows the selected parts; the denominator shows all the equal parts."),
  },
  {
    id: '02', level: 'green', kind: 'fracbuild', skillTag: 'numerator-denominator',
    visual: { type: 'bar', total: 9, filled: 4, label: b('4 из 9', '9 tadan 4 tasi', '4 of 9') }, answer: { n: 4, d: 9 },
    nChoices: [3, 4, 5], dChoices: [4, 8, 9],
    setup: b('Из девяти равных частей выбраны четыре.', "To'qqizta teng qismdan to'rttasi tanlangan.", "Four of nine equal parts are selected."),
    prompt: b('Составьте дробь: выберите числитель и знаменатель.', "Kasrni tuzing: surat va maxrajni tanlang.", "Build the fraction: choose the numerator and denominator."),
    wrong: [b('Числитель равен числу выбранных частей, знаменатель — числу всех частей.', "Surat tanlangan qismlar soniga, maxraj esa barcha qismlar soniga teng.", "The numerator is the number of selected parts; the denominator is the number of all the parts.")],
    secondHint: b('Закрашенные четыре части выделены оранжевым, все девять — голубой сеткой.', "Bo'yalgan to'rtta qism zarg'aldoq, barcha to'qqiz qism havorang to'r bilan yoritildi.", "The four shaded parts are highlighted in orange, and all nine are shown by the blue grid."),
    thirdHint: b('Для модели с двумя выбранными частями из шести числитель 2, знаменатель 6.', "Oltita qismdan ikkitasi tanlangan modelda surat 2, maxraj 6 bo'ladi.", "For a model with two selected parts out of six, the numerator is 2 and the denominator is 6."),
    correctText: b('Верно. Числитель 4, знаменатель 9, дробь равна 4/9.', "To'g'ri. Surat 4, maxraj 9, kasr 4/9 ga teng.", "Correct. The numerator is 4, the denominator is 9, and the fraction is 4/9."),
    rule: b('Сначала определяют целое и число его равных частей.', "Avval butun va uning teng qismlari soni aniqlanadi.", "First identify the whole and the number of equal parts in it."),
  },
  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'model-to-fraction',
    visual: { type: 'models', items: [
      { shape: 'bar', total: 5, filled: 2, label: 'A' }, { shape: 'circle', total: 4, filled: 3, label: 'B' },
      { shape: 'grid', total: 8, filled: 5, label: 'C' },
    ] },
    setup: b('Полоска, круг и клетчатая модель показывают дроби.', "Tasma, doira va katakli model kasrlarni ko'rsatadi.", "A bar, a circle and a grid model show fractions."),
    prompt: b('Соедините каждую модель с дробью.', "Har bir modelni kasr bilan moslashtiring.", "Match each model to its fraction."),
    pairs: [
      { id: 'a', left: b('A · полоска', 'A · tasma', "A · bar"), correctRight: '2/5' },
      { id: 'b', left: b('B · круг', 'B · doira', "B · circle"), correctRight: '3/4' },
      { id: 'c', left: b('C · клетки', 'C · kataklar', "C · grid"), correctRight: '5/8' },
    ],
    right: [{ id: '2/5', text: b('2/5', '2/5', "2/5") }, { id: '3/4', text: b('3/4', '3/4', "3/4") }, { id: '5/8', text: b('5/8', '5/8', "5/8") }],
    wrong: [b('Для каждой модели отдельно посчитайте все и закрашенные части.', "Har bir modelda jami va bo'yalgan qismlarni alohida sanang.", "For each model, count all the parts and the shaded parts separately.")],
    secondHint: b('В ошибочной паре сначала выделено число всех частей.', "Xato juftlikda avval barcha qismlar soni yoritildi.", "The total number of parts is highlighted first in the incorrect match."),
    thirdHint: b('Например, одна закрашенная часть из трёх равных частей даёт дробь 1/3.', "Masalan, uchta teng qismdan bittasi bo'yalsa, 1/3 kasri hosil bo'ladi.", "For example, one shaded part out of three equal parts gives the fraction 1/3."),
    correctText: b('Верно. Форма модели меняется, но значения дробей сохраняются.', "To'g'ri. Model shakli o'zgaradi, ammo kasr qiymati saqlanadi.", "Correct. The shape of the model changes, but the fraction values stay the same."),
    rule: b('Дробь определяется числом выбранных и всех равных частей.', "Kasr tanlangan va barcha teng qismlar soni bilan aniqlanadi.", "A fraction is determined by the number of selected parts and all equal parts."),
  },
  {
    id: '04', level: 'yellow', kind: 'shade', skillTag: 'fraction-construction', selectCount: 5,
    visual: { type: 'bar', total: 9, filled: 0 }, allowed: [0,1,2,3,4,5,6,7,8],
    setup: b('Перед вами целое из девяти равных частей.', "Sizning oldingizda to'qqizta teng qismli butun bor.", "The whole in front of you has nine equal parts."),
    prompt: b('Выберите ровно пять частей, чтобы построить 5/9.', "5/9 ni qurish uchun aynan beshta qismni tanlang.", "Select exactly five parts to build 5/9."),
    wrong: [b('Количество выбранных частей должно совпасть с числителем.', "Tanlangan qismlar soni suratga teng bo'lishi kerak.", "The number of selected parts must match the numerator.")],
    secondHint: b('Знаменатель 9 уже задан. Проверьте только число выбранных клеток.', "Maxraj 9 berilgan. Faqat tanlangan kataklar sonini tekshiring.", "The denominator 9 is already given. Check only the number of selected squares."),
    thirdHint: b('Для 3/7 выбирают три клетки из семи. Здесь числитель равен пяти.', "3/7 uchun yettita katakdan uchtasi tanlanadi. Bu yerda surat besh.", "For 3/7, select three squares out of seven. Here, the numerator is five."),
    correctText: b('Верно. Выбраны пять из девяти равных частей.', "To'g'ri. To'qqizta teng qismdan beshtasi tanlandi.", "Correct. Five of the nine equal parts are selected."),
    rule: b('При построении дроби знаменатель задаёт все части, числитель — выбранные.', "Kasrni qurishda maxraj barcha qismlarni, surat tanlangan qismlarni bildiradi.", "When building a fraction, the denominator gives all the parts and the numerator gives the selected parts."),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'denominator', answer: '8', maxLen: 2,
    visual: { type: 'bar', total: 8, filled: 6, label: '6/□' },
    setup: b('На модели закрашены шесть частей, а всего частей восемь.', "Modelda oltita qism bo'yalgan, jami qismlar sakkizta.", "Six parts are shaded in the model, and there are eight parts altogether."),
    prompt: b('Какое число нужно записать в знаменатель 6/□?', "6/□ kasrining maxrajiga qaysi son yoziladi?", "Which number should be written as the denominator in 6/□?"),
    wrong: [b('В знаменатель записывают число всех равных частей, а не только закрашенных.', "Maxrajga faqat bo'yalgan emas, barcha teng qismlar soni yoziladi.", "The denominator contains the number of all equal parts, not only the shaded parts.")],
    secondHint: b('Голубой контур показывает все восемь частей целого.', "Havorang chegara butunning barcha sakkiz qismini ko'rsatmoqda.", "The blue outline shows all eight parts of the whole."),
    thirdHint: b('Если целое разделено на пять частей, знаменатель равен пяти.', "Butun besh qismga bo'linsa, maxraj besh bo'ladi.", "If a whole is divided into five parts, the denominator is five."),
    correctText: b('Верно. Всего восемь равных частей, поэтому знаменатель равен 8.', "To'g'ri. Jami sakkizta teng qism bor, shuning uchun maxraj 8.", "Correct. There are eight equal parts altogether, so the denominator is 8."),
    rule: b('Знаменатель показывает, на сколько равных частей разделено целое.', "Maxraj butun nechta teng qismga bo'linganini ko'rsatadi.", "The denominator shows how many equal parts the whole is divided into."),
  },
  {
    id: '06', level: 'yellow', kind: 'mc', skillTag: 'fraction-of-set',
    visual: { type: 'bar', total: 12, filled: 7, label: b('12 ламп', '12 ta chiroq', '12 lights') },
    setup: b('Из двенадцати одинаковых умных фонарей семь включены.', "O'n ikkita bir xil aqlli chiroqdan yettitasi yonib turibdi.", "Seven of twelve identical smart lights are switched on."),
    prompt: b('Какую часть всех фонарей составляют включённые?', "Yongan chiroqlar barcha chiroqlarning qanday qismini tashkil qiladi?", "What fraction of all the lights are switched on?"),
    options: [
      option('correct', '7/12', '7/12', "7/12", true),
      option('swapped', '12/7', '12/7', "12/7", false, 'Общее число фонарей должно стоять в знаменателе.', "Barcha chiroqlar soni maxrajda turishi kerak.", "The total number of lights must be in the denominator."),
      option('off', '5/12', '5/12', "5/12", false, 'Пять фонарей выключены, но вопрос спрашивает о включённых.', "Beshta chiroq o'chgan, ammo savolda yongan chiroqlar so'ralgan.", "Five lights are switched off, but the question asks about those that are switched on."),
      option('wrongWhole', '7/5', '7/5', "7/5", false, 'Пять — число выключенных фонарей, а не размер целого набора.', "Besh o'chgan chiroqlar soni, butun to'plam soni emas.", "Five is the number of lights that are switched off, not the size of the whole set."),
    ],
    secondHint: b('Все двенадцать фонарей образуют целое, семь выделены.', "Barcha o'n ikkita chiroq butunni hosil qiladi, yettitasi ajratilgan.", "All twelve lights form the whole, and seven are selected."),
    thirdHint: b('Если работают четыре прибора из десяти, их доля равна 4/10.', "O'nta qurilmadan to'rttasi ishlasa, ularning ulushi 4/10 bo'ladi.", "If four of ten devices are working, their fraction is 4/10."),
    correctText: b('Верно. Семь работающих фонарей из двенадцати составляют 7/12.', "To'g'ri. O'n ikkita chiroqdan yongan yettitasi 7/12 ni tashkil qiladi.", "Correct. Seven working lights out of twelve make 7/12."),
    rule: b('Для дроби множества все предметы должны относиться к одному целому набору.', "To'plam kasrida barcha buyumlar bitta butun to'plamga tegishli bo'lishi kerak.", "For a fraction of a set, all the objects must belong to the same whole set."),
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'fraction-vocabulary',
    visual: { type: 'formula', text: '4/9', subtext: b('числитель · дробная черта · знаменатель', "surat · kasr chizig'i · maxraj", "numerator · fraction bar · denominator") },
    setup: b('Каждая часть записи дроби выполняет свою роль.', "Kasr yozuvining har bir qismi o'z vazifasini bajaradi.", "Each part of a fraction notation has its own role."),
    prompt: b('Соедините термин с его значением.', "Atamani uning ma'nosi bilan moslashtiring.", "Match each term to its meaning."),
    pairs: [
      { id: 'numerator', left: b('Числитель', 'Surat', "Numerator"), correctRight: 'selected' },
      { id: 'denominator', left: b('Знаменатель', 'Maxraj', "Denominator"), correctRight: 'all' },
      { id: 'line', left: b('Дробная черта', "Kasr chizig'i", "Fraction bar"), correctRight: 'separates' },
    ],
    right: [
      { id: 'selected', text: b('Число выбранных частей', 'Tanlangan qismlar soni', "Number of selected parts") },
      { id: 'all', text: b('Число всех равных частей', 'Barcha teng qismlar soni', "Number of all equal parts") },
      { id: 'separates', text: b('Разделяет два числа дроби', 'Kasrdagi ikki sonni ajratadi', "Separates the two numbers in a fraction") },
    ],
    wrong: [b('Сопоставьте роль элемента с его положением в записи дроби.', "Element vazifasini kasr yozuvidagi o'rni bilan bog'lang.", "Match the role of each element to its position in the fraction notation.")],
    secondHint: b('В записи 4/9 верхнее число относится к выбранным частям, нижнее — ко всем.', "4/9 yozuvida yuqoridagi son tanlangan qismlarga, pastdagi son barcha qismlarga tegishli.", "In 4/9, the top number refers to the selected parts and the bottom number refers to all the parts."),
    thirdHint: b('В дроби 2/5 число 2 является числителем, а 5 — знаменателем.', "2/5 kasrida 2 surat, 5 esa maxraj bo'ladi.", "In the fraction 2/5, 2 is the numerator and 5 is the denominator."),
    correctText: b('Верно. Все три элемента дробной записи сопоставлены правильно.', "To'g'ri. Kasr yozuvining uchala qismi to'g'ri moslashtirildi.", "Correct. All three elements of the fraction notation are matched correctly."),
    rule: b('Числитель сверху, знаменатель снизу, между ними дробная черта.', "Surat yuqorida, maxraj pastda, ularning orasida kasr chizig'i turadi.", "The numerator is above, the denominator is below, and the fraction bar is between them."),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'zero-fraction',
    visual: { type: 'bar', total: 7, filled: 0, label: b('0 из 7', '7 tadan 0 tasi', '0 of 7') },
    setup: b('Целое разделено на семь равных частей, но ни одна не выбрана.', "Butun yettita teng qismga bo'lingan, ammo birortasi tanlanmagan.", "The whole is divided into seven equal parts, but none is selected."),
    prompt: b('Какая дробь соответствует модели?', "Modelga qaysi kasr mos keladi?", "Which fraction matches the model?"),
    options: [
      option('correct', '0/7', '0/7', "0/7", true),
      option('one', '1/7', '1/7', "1/7", false, 'Ни одна часть не выбрана, поэтому числитель не может быть равен одному.', "Hech bir qism tanlanmagan, shuning uchun surat bir bo'la olmaydi.", "No part is selected, so the numerator cannot be one."),
      option('empty', '6/7', '6/7', "6/7", false, 'Шесть невыбранных частей не являются числителем.', "Tanlanmagan oltita qism surat bo'lmaydi.", "The six unselected parts are not the numerator."),
      option('whole', '7/7', '7/7', "7/7", false, '7/7 означало бы, что выбраны все части.', "7/7 barcha qismlar tanlanganini bildirardi.", "7/7 would mean that all the parts are selected."),
    ],
    secondHint: b('Подсвечено отсутствие выбранных частей при семи частях целого.', "Butun yetti qismdan iborat, ammo tanlangan qism yo'qligi yoritildi.", "The model highlights that none of the seven parts of the whole is selected."),
    thirdHint: b('Если из пяти частей ничего не выбрано, получается 0/5.', "Besh qismdan hech biri tanlanmasa, 0/5 hosil bo'ladi.", "If none of five parts is selected, the fraction is 0/5."),
    correctText: b('Верно. Ноль выбранных частей из семи — это 0/7, то есть ноль.', "To'g'ri. Yettita qismdan nol qism tanlansa, 0/7, ya'ni nol bo'ladi.", "Correct. Zero selected parts out of seven is 0/7, which equals zero."),
    rule: b('Дробь с нулевым числителем равна нулю.', "Surati nol bo'lgan kasr nolga teng.", "A fraction with a zero numerator equals zero."),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'numerator-denominator',
    visual: { type: 'models', items: [{ shape: 'bar', total: 9, filled: 4, label: b('Модель', 'Model', 'Model') }, { shape: 'bar', total: 9, filled: 4, label: '9/4  ✕' }] },
    setup: b('В модели четыре из девяти частей закрашены, но записано 9/4.', "Modelda to'qqizta qismdan to'rttasi bo'yalgan, ammo 9/4 deb yozilgan.", "Four of nine parts are shaded in the model, but the fraction is written as 9/4."),
    prompt: b('В чём ошибка записи?', "Yozuvdagi xato nimada?", "What is the error in the notation?"),
    options: [
      option('correct', 'Числитель и знаменатель поменяли местами', "Surat va maxraj o'rni almashgan", "The numerator and denominator were swapped", true),
      option('unequal', 'Части модели не равны', 'Model qismlari teng emas', "The parts of the model are unequal", false, 'Все девять частей модели имеют одинаковый размер.', "Modeldagi barcha to'qqiz qism bir xil o'lchamda.", "All nine parts of the model are the same size."),
      option('whole', 'Целое не показано', "Butun ko'rsatilmagan", "The whole is not shown", false, 'Внешняя граница полоски показывает одно целое.', "Tasmaning tashqi chegarasi bitta butunni ko'rsatadi.", "The outer edge of the bar shows one whole."),
      option('line', 'Не нужна дробная черта', "Kasr chizig'i kerak emas", "A fraction bar is not needed", false, 'Дробная черта нужна, чтобы разделить числитель и знаменатель.', "Kasr chizig'i surat va maxrajni ajratish uchun kerak.", "The fraction bar is needed to separate the numerator and denominator."),
    ],
    secondHint: b('Выделены четыре закрашенные и все девять частей.', "Bo'yalgan to'rtta va jami to'qqizta qism yoritildi.", "The four shaded parts and all nine parts are highlighted."),
    thirdHint: b('Три выбранные части из восьми записываются как 3/8, а не 8/3.', "Sakkiz qismdan tanlangan uchtasi 3/8 deb yoziladi, 8/3 emas.", "Three selected parts out of eight are written as 3/8, not 8/3."),
    correctText: b('Верно. Правильная запись модели — 4/9.', "To'g'ri. Modelning to'g'ri yozuvi 4/9.", "Correct. The correct fraction for the model is 4/9."),
    rule: b('Выбранные части записывают в числителе, все части — в знаменателе.', "Tanlangan qismlar suratga, barcha qismlar maxrajga yoziladi.", "Write the selected parts in the numerator and all the parts in the denominator."),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'number-line-fraction',
    visual: { type: 'models', items: [
      { shape: 'line', total: 10, filled: 7, label: '7/10' },
      { shape: 'bar', total: 10, filled: 7, label: 'A' }, { shape: 'bar', total: 10, filled: 3, label: 'B' },
      { shape: 'bar', total: 10, filled: 7, label: b('C · неравные части', 'C · noteng qismlar', 'C · unequal parts'), unequal: true },
    ] },
    setup: b('На луче от 0 до 1 точка стоит на седьмом из десяти делений.', "0 dan 1 gacha son nuridagi nuqta o'nta bo'linmaning yettinchisida turibdi.", "On the number line from 0 to 1, the point is at the seventh of ten intervals."),
    prompt: b('Какая модель показывает то же число?', "Qaysi model ayni sonni ko'rsatadi?", "Which model shows the same number?"),
    options: [
      option('correct', 'A · 7 из 10 равных частей', 'A · 10 teng qismdan 7 tasi', "A · 7 of 10 equal parts", true),
      option('three', 'B · 3 из 10 равных частей', 'B · 10 teng qismdan 3 tasi', "B · 3 of 10 equal parts", false, 'Модель B показывает 3/10, а точка стоит на 7/10.', "B model 3/10 ni ko'rsatadi, nuqta esa 7/10 da turibdi.", "Model B shows 3/10, while the point is at 7/10."),
      option('unequal', 'C · 7 из 10 неравных частей', 'C · 10 ta noteng qismdan 7 tasi', "C · 7 of 10 unequal parts", false, 'Неравные части не показывают одинаковые десятые доли.', "Noteng qismlar bir xil o'ndan bir ulushlarni ko'rsatmaydi.", "Unequal parts do not show equal tenths."),
      option('seven', 'Полоска из 7 частей целиком', "7 qismli to'liq tasma", "A complete bar of 7 parts", false, 'Целая полоска из семи частей показывает 7/7, то есть единицу.', "Yetti qismli to'liq tasma 7/7 ni, ya'ni birni ko'rsatadi.", "A complete bar of seven parts shows 7/7, which is one whole."),
    ],
    secondHint: b('На луче и на модели должно быть по десять равных частей и семь выбранных.', "Son nuri va modelda o'ntadan teng qism hamda yettitadan tanlangan qism bo'lishi kerak.", "The number line and the model must each have ten equal parts with seven selected."),
    thirdHint: b('Точка 4/6 соответствует полоске с четырьмя выбранными частями из шести.', "4/6 nuqta oltita qismdan to'rttasi tanlangan tasmaga mos keladi.", "The point 4/6 matches a bar with four selected parts out of six."),
    correctText: b('Верно. Точка и модель A показывают 7/10.', "To'g'ri. Nuqta va A model 7/10 ni ko'rsatadi.", "Correct. The point and model A both show 7/10."),
    rule: b('Одна дробь может быть показана моделью, записью и точкой на луче.', "Bitta kasr model, yozuv va son nuridagi nuqta bilan ko'rsatilishi mumkin.", "The same fraction can be shown by a model, notation and a point on a number line."),
  },
];

function ScaleModel({ visual, interactive = false, picked, onPick, hint = false, disabled = false }) {
  const { min, max, intervals, markerIndex, vertical, showAll, unit = '' } = visual;
  const values = Array.from({ length: intervals + 1 }, (_, i) => min + ((max - min) / intervals) * i);
  return <div className={`p4-scale ${vertical ? 'is-vertical' : ''} ${hint ? 'is-hint' : ''}`}>
    <div className="p4-scale-axis">
      {values.map((value, index) => {
        const pos = `${(index / intervals) * 100}%`;
        const style = vertical ? { bottom: pos } : { left: pos };
        const label = `${value}${unit ? ` ${unit}` : ''}`;
        return <div className="p4-scale-tick" style={style} key={value}>
          {interactive ? <button type="button" disabled={disabled} className={picked === String(value) ? 'is-picked' : ''} onClick={() => onPick(String(value))} aria-label={label}>{showAll ? label : value}</button> : <span>{showAll || index === 0 || index === intervals ? label : ''}</span>}
        </div>;
      })}
      {markerIndex !== undefined && <span className="p4-marker" style={vertical ? { bottom: `${(markerIndex / intervals) * 100}%` } : { left: `${(markerIndex / intervals) * 100}%` }} aria-hidden="true">▼</span>}
    </div>
    {visual.error && <del className="p4-error-formula">{visual.error}</del>}
  </div>;
}

function Cells({ total, filled = 0, second = 0, removed = 0, selected = [], onToggle, allowed = null, unequal = false, selectionMode = 'add', resolved = false, layout = 'bar', disabled = false }) {
  const widths = unequal ? [1.6, .7, 1.2, .8, 1.7, 1, 1, 1, 1, 1].slice(0, total) : Array(total).fill(1);
  const gridColumns = total % 5 === 0 ? 5 : total % 4 === 0 ? 4 : Math.ceil(Math.sqrt(total));
  return <div className={`p4-cells ${layout === 'grid' ? 'is-grid' : ''}`} style={{ gridTemplateColumns: layout === 'grid' ? `repeat(${gridColumns},1fr)` : widths.map((v) => `${v}fr`).join(' ') }}>
    {Array.from({ length: total }, (_, i) => {
      const successful = resolved && selectionMode !== 'remove' && (i < filled || selected.includes(i));
      const cls = [i < filled ? 'is-filled' : '', i >= filled && i < filled + second ? 'is-second' : '', i >= Math.max(0, filled - removed) && i < filled ? 'is-removed' : '', selected.includes(i) ? (selectionMode === 'remove' ? 'is-selected-remove' : 'is-selected') : '', successful ? 'is-success' : ''].filter(Boolean).join(' ');
      const enabled = onToggle && !disabled && (!allowed || allowed.includes(i));
      return enabled ? <button type="button" aria-pressed={selected.includes(i)} aria-label={String(i + 1)} className={cls} key={i} onClick={() => onToggle(i)} style={{ animationDelay: `${i * 70}ms` }} /> : <span className={cls} key={i} style={{ animationDelay: `${i * 70}ms` }} />;
    })}
  </div>;
}

function FractionModel({ model, lang }) {
  if (model.shape === 'circle') return <div className="p4-model-card"><div className="p4-circle" style={{ background: `conic-gradient(${T.accent} 0 ${(model.filled / model.total) * 100}%, ${T.cyanSoft} ${(model.filled / model.total) * 100}% 100%)` }}>{Array.from({ length: model.total }, (_, i) => <span aria-hidden="true" key={i} style={{ transform: `rotate(${(i * 360) / model.total}deg)` }}/>)}</div><b>{tx(model.label, lang)}</b></div>;
  if (model.shape === 'line') return <div className="p4-model-card"><div className="p4-number-line">{Array.from({ length: model.total + 1 }, (_, i) => <span key={i} className={i === model.filled ? 'is-point' : ''} />)}</div><b>{tx(model.label, lang)}</b></div>;
  return <div className="p4-model-card"><Cells total={model.total} filled={model.filled} second={model.second} removed={model.removed} unequal={model.unequal} layout={model.shape}/><b>{tx(model.label, lang)}</b></div>;
}

function Visual({ task, hintLevel, lang }) {
  const visual = task.visual;
  if (!visual) return null;
  if (visual.type === 'scale') return <div className="p4-visual"><ScaleModel visual={visual} hint={hintLevel >= 2}/></div>;
  if (visual.type === 'scale-set') return <div className="p4-visual p4-model-grid">{visual.items.map((item) => <div className="p4-model-card" key={item.label}><b>{item.label}</b><ScaleModel visual={item}/></div>)}</div>;
  if (visual.type === 'sequence') return <div className="p4-visual p4-sequence">{visual.values.map((value, i) => <span key={`${value}-${i}`}>{value}</span>)}</div>;
  if (visual.type === 'bar') return <div className="p4-visual"><Cells {...visual}/>{visual.label && <b className="p4-caption">{tx(visual.label, lang)}</b>}</div>;
  if (visual.type === 'models') return <div className="p4-visual p4-model-grid">{visual.items.map((model, i) => <FractionModel model={model} lang={lang} key={i}/>)}</div>;
  if (visual.type === 'formula') return <div className="p4-visual p4-formula"><b className={visual.error ? 'is-error' : ''}>{visual.text}</b>{visual.subtext && <span>{tx(visual.subtext, lang)}</span>}</div>;
  if (visual.type === 'tanks') return <div className="p4-visual p4-model-grid">{visual.items.map((model, i) => <FractionModel model={{ ...model, shape: 'bar' }} lang={lang} key={i}/>)}</div>;
  return null;
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}><div className="p4-pad-display">{value || '—'}</div><div className="p4-pad-keys">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => <button type="button" key={digit} disabled={disabled} onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>{digit}</button>)}
    <button type="button" className="is-delete" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
  </div></div>;
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite"><p>{tx(text, lang)}</p>{ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}</div>;
}

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const [selected, setSelected] = useState([]);
  const [fraction, setFraction] = useState({ n: null, d: null });
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- yangi tartib ataylab: qayta boshlash va topshiriq kalitlari aralashtirishni chaqiradi
  const rightCards = useMemo(() => matchSpread(task.right, (card, row) => card.id === task.pairs[row]?.correctRight), [task.right]);
  const orderCards = useMemo(() => shuffle(task.cards || []), [task.cards]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'mc' || task.kind === 'ticks') return picked !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed !== '';
    if (task.kind === 'match') return Object.keys(pairs).length === task.pairs.length;
    if (task.kind === 'order') return Object.keys(placed).length === task.steps.length;
    if (task.kind === 'shade') return selected.length > 0;
    if (task.kind === 'fracbuild') return fraction.n !== null && fraction.d !== null;
    return false;
  })();
  // Variantlar aralashtiriladi va XATO javobdan keyin qayta aralashadi:
  // bola javobni o'rni bo'yicha eslab qolmasin (metodist qarori 2026-08-21).
  // Tanlov ID bo'yicha saqlanadi, shuning uchun tartib o'zgarsa ham javob
  // va uning izohi kartaning o'ziga bog'langan qoladi.
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const mcOptions = useMemo(() => (task.kind === 'mc' ? shuffle(task.options) : []), [task.id, task.options, task.kind, wrongRound]);
  const mcPicked = task.kind === 'mc' ? task.options.find((item) => item.id === picked) : null;
  const answerCorrect = () => {
    if (task.kind === 'mc') return Boolean(mcPicked?.correct);
    if (task.kind === 'ticks') return picked === task.answer;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
    if (task.kind === 'shade') return selected.length === task.selectCount;
    if (task.kind === 'fracbuild') return fraction.n === task.answer.n && fraction.d === task.answer.d;
    return false;
  };
  const answerSnapshot = () => {
    if (['mc', 'sign', 'card'].includes(task.kind)) return { optionId: task.options[picked]?.id, text: task.options[picked]?.text };
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'ticks') return { value: picked };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'order') return { order: task.steps.map((step) => placed[step.id]) };
    if (task.kind === 'shade') return { selected: [...selected], selectedCount: selected.length };
    return { numerator: fraction.n, denominator: fraction.d };
  };
  const correctSnapshot = () => {
    if (['mc', 'sign', 'card'].includes(task.kind)) { const correct = task.options.find((item) => item.correct); return { optionId: correct.id, text: correct.text }; }
    if (task.kind === 'numpad' || task.kind === 'missing' || task.kind === 'ticks') return { value: task.answer };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    if (task.kind === 'order') return { order: task.cards.slice().sort((a, b) => a.order - b.order).map((card) => card.id) };
    if (task.kind === 'shade') {
      const numerator = task.selectionMode === 'remove' ? task.visual.filled - task.selectCount : task.visual.filled + task.selectCount;
      return { selectedCount: task.selectCount, fraction: `${numerator}/${task.visual.total}` };
    }
    return { numerator: task.answer.n, denominator: task.answer.d };
  };
  const resetResponse = () => {
    checkingRef.current = false; setChecked(false); setPicked(null); setTyped(''); setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null); setSelected([]); setFraction({ n: null, d: null });
  };
  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts); setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };
  const hintLevel = checked && !solved ? attempts : 0;
  const wrongText = adaptive(task, mcPicked, attempts);
  const setAnswer = (setter, value) => { checkingRef.current = false; setter(value); setChecked(false); };
  const toggleSelected = (index) => setAnswer(setSelected, selected.includes(index) ? selected.filter((value) => value !== index) : [...selected, index]);

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
  return <section className={`p4-task ${hintLevel >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
    <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
    <p className="p4-setup">{tx(task.setup, lang)}</p>
    {task.kind === 'ticks' ? <div className="p4-visual"><ScaleModel visual={task.visual} interactive picked={picked} onPick={(value) => setAnswer(setPicked, value)} hint={hintLevel >= 2} disabled={solved}/></div> :
      task.kind === 'shade' ? <div className="p4-visual"><Cells total={task.visual.total} filled={task.visual.filled} second={task.visual.second} removed={task.visual.removed} selected={selected} allowed={task.allowed} onToggle={toggleSelected} selectionMode={task.selectionMode} resolved={solved} disabled={solved}/></div> : <Visual task={task} hintLevel={hintLevel} lang={lang}/>}
    <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

    {task.kind === 'mc' && <div className="p4-options">{mcOptions.map((item, index) => <button type="button" key={item.id} disabled={solved} aria-pressed={picked === item.id} className={`p4-option ${picked === item.id ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} onClick={() => setAnswer(setPicked, item.id)}><span className="p4-letter">{'ABCD'[index]}</span><span>{tx(item.text, lang)}</span></button>)}</div>}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang}/>}
    {task.kind === 'match' && <div className="p4-match"><p className="p4-note">{tx(UI.matchHint, lang)}</p><div className="p4-match-cols"><div className="p4-match-col">{task.pairs.map((pair) => <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id} className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}${matchToneLeft(task, pairs, pair.id)}`} onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}><span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b>{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}</button>)}</div><div className="p4-match-col">{rightCards.map((right) => { const used = Object.values(pairs).includes(right.id); return <button type="button" key={right.id} disabled={solved || activeLeft === null} className={`p4-match-item ${used ? 'is-used' : ''}${matchToneRight(task, pairs, right.id)}`} onClick={() => { checkingRef.current = false; setPairs((old) => matchTie(old, activeLeft, right.id)); setActiveLeft(null); setChecked(false); }}>{tx(right.text, lang)}</button>; })}</div></div></div>}
    {task.kind === 'order' && <div className="p4-order"><p className="p4-note">{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button type="button" key={step.id} disabled={solved} aria-pressed={activeStep === step.id} className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''}`} onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button type="button" key={card.id} disabled={solved || activeStep === null || used} className={`p4-card ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPlaced((old) => ({ ...old, [activeStep]: card.id })); setActiveStep(null); setChecked(false); }}>{tx(card.text, lang)}</button>; })}</div></div>}
    {task.kind === 'fracbuild' && <div className="p4-frac-builder"><div><span>{tx(UI.numerator, lang)}</span>{task.nChoices.map((value) => <button type="button" key={value} disabled={solved} className={fraction.n === value ? 'is-active' : ''} onClick={() => { checkingRef.current = false; setFraction((old) => ({ ...old, n: value })); setChecked(false); }}>{value}</button>)}</div><hr/><div><span>{tx(UI.denominator, lang)}</span>{task.dChoices.map((value) => <button type="button" key={value} disabled={solved} className={fraction.d === value ? 'is-active' : ''} onClick={() => { checkingRef.current = false; setFraction((old) => ({ ...old, d: value })); setChecked(false); }}>{value}</button>)}</div></div>}

    {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={solved ? task.correctText : wrongText} rule={task.rule} lang={lang}/>}
    {!platform && <div className="p4-actions">{!checked && !solved && <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>}{checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={resetResponse}>{tx(UI.retry, lang)}</button>}{solved && <button type="button" className="p4-btn p4-btn-ready" disabled={advancing} onClick={() => { if (advancedRef.current) return; advancedRef.current = true; checkingRef.current = false; setAdvancing(true); onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, setup: task.setup, prompt: task.prompt, studentAnswer: answerSnapshot(), correctAnswer: correctSnapshot(), answerChoices: task.options?.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) })) ?? task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) }); }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}</div>}
  </section>;
}

export default function Grade4Dars18Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
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
        studentName: null, activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
        correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100),
        finalScore: nextFirstTry, finalTotal: 10, passed: nextFirstTry >= 6,
        firstTryStats: { total: 10, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: 10, scorePercent: Math.round((nextFirstTry / 10) * 100) },
        attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
        // eslint-disable-next-line react-hooks/purity -- duration is captured when the lesson finishes
        durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
        skillTags: [...new Set(TASKS.map((item) => item.skillTag))], levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
      });
      return;
    }
    setIndex((old) => old + 1);
  };
  const restart = () => { finishedRef.current = false; startedAtRef.current = Date.now(); setIndex(0); setAnswers([]); setFirstTry(0); setFinished(false); };

  return <div className="p4-root"><style>{STYLES}</style>
    {preview && <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} aria-pressed={lang === code} className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
    <header className="p4-head"><div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}><div className="p4-progress-bar" style={{ width: `${percent}%` }}/></div><div className="p4-head-row"><span className="p4-title">{tx(UI.title, lang)}</span><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div></header>
    <main className="p4-main">{finished ? <section className="p4-done" aria-live="polite"><span className="p4-medal" aria-hidden="true">★</span><h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b><span>/ 10</span></p><p className="p4-note">{tx(UI.firstTry, lang)}</p><p className="p4-complete">{tx(UI.allSolved, lang)}</p><button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button></section> : <Task key={task.id} task={task} lang={lang} isLast={index === 9} onSolved={onSolved}/>}</main>
  </div>;
}

const STYLES = `
.p4-root{position:relative;display:flex;flex-direction:column;min-height:100dvh;overflow-x:hidden;padding:0 0 18px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root h1,.p4-root h2,.p4-root h3,.p4-root h4,.p4-root h5,.p4-root h6,.p4-root p,.p4-root ul,.p4-root ol{margin:0}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:fixed;top:9px;right:9px;display:flex;gap:4px;padding:3px;z-index:20;border-radius:999px;background:${T.paper};box-shadow:${T.shadowBase}}.p4-lang button{min-width:44px;min-height:44px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:${T.ink2};font:800 12px 'Manrope',sans-serif;cursor:pointer}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{width:100%;padding:54px clamp(12px,4vw,24px) 7px}.p4-progress,.p4-head-row{width:min(100%,936px);margin-inline:auto}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 14px rgba(255,79,40,.42);transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font:700 13px 'JetBrains Mono',monospace;color:${T.ink3}}
.p4-main{flex:1;width:min(100%,936px);margin:0 auto;padding:3px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:10px;width:100%;max-width:820px;margin:0 auto}.p4-eyebrow{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.p4-eyebrow.is-green{color:${T.success}}.p4-eyebrow.is-yellow{color:${T.warn}}.p4-eyebrow.is-red{color:${T.accent}}.p4-setup{font-size:clamp(14px,2vw,16px);line-height:1.45;color:${T.ink2}}.p4-ask{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.3}.p4-note{font-size:13px;line-height:1.4;color:${T.ink3}}
.p4-visual{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:118px;padding:12px;border-radius:18px;background:${T.paper};box-shadow:${T.shadowBase};overflow:hidden}.p4-model-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch}.p4-model-card{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-width:0;padding:8px;border-radius:14px;background:#FBFBF8}.p4-model-card>b,.p4-caption{font:800 13px 'JetBrains Mono',monospace;color:${T.navy}}
.p4-task.is-hint .p4-visual{box-shadow:inset 0 0 0 3px rgba(255,91,53,.2),${T.shadowBase}}.p4-task.is-hint .p4-formula b{color:${T.warn}}
.p4-scale{position:relative;width:min(100%,560px);height:92px;padding:30px 26px 18px}.p4-scale-axis{position:relative;width:100%;height:5px;margin-top:24px;border-radius:99px;background:${T.navy}}.p4-scale-tick{position:absolute;top:50%;transform:translate(-50%,-50%);width:3px;height:22px;border-radius:2px;background:${T.cyan}}.p4-scale-tick span,.p4-scale-tick button{position:absolute;top:25px;left:50%;transform:translateX(-50%);min-width:44px;min-height:44px;padding:4px;border:0;background:transparent;color:${T.navy};font:800 12px 'JetBrains Mono',monospace;white-space:nowrap}.p4-scale-tick button{border-radius:10px;cursor:pointer}.p4-scale-tick button:hover,.p4-scale-tick button.is-picked{background:${T.accentSoft};color:${T.accent}}.p4-marker{position:absolute;top:-34px;transform:translateX(-50%);color:${T.accent};font-size:24px;transition:left .4s ease,bottom .4s ease}.p4-scale.is-hint .p4-scale-axis{box-shadow:0 0 0 5px rgba(255,91,53,.16)}.p4-scale.is-vertical{width:150px;height:240px;padding:22px 45px}.p4-scale.is-vertical .p4-scale-axis{width:5px;height:190px;margin:0 auto}.p4-scale.is-vertical .p4-scale-tick{top:auto;left:50%;transform:translate(-50%,50%);width:24px;height:3px}.p4-scale.is-vertical .p4-scale-tick span,.p4-scale.is-vertical .p4-scale-tick button{top:50%;left:30px;transform:translateY(-50%)}.p4-scale.is-vertical .p4-marker{top:auto;left:-34px;transform:translateY(50%) rotate(-90deg)}.p4-error-formula{display:block;margin-top:13px;text-align:center;color:${T.warn};font:800 14px 'JetBrains Mono',monospace}.p4-sequence{gap:8px}.p4-sequence span{display:flex;align-items:center;justify-content:center;min-width:66px;min-height:50px;border-radius:12px;background:${T.cyanSoft};font:800 18px 'JetBrains Mono',monospace;color:${T.navy}}
.p4-cells{display:grid;width:min(100%,520px);gap:4px}.p4-cells>span,.p4-cells>button{min-width:0;min-height:62px;border:0;border-radius:8px;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(22,143,163,.2);animation:p4-cell-in .28s both}.p4-cells>button{cursor:pointer}.p4-cells .is-filled{background:${T.cyan}}.p4-cells .is-second,.p4-cells .is-selected{background:${T.lime}}.p4-cells .is-removed,.p4-cells .is-selected-remove{background:${T.warnSoft};box-shadow:inset 0 0 0 2px ${T.warn}}.p4-cells .is-success{background:${T.success};box-shadow:inset 0 0 0 1px rgba(34,122,83,.34)}.p4-circle{position:relative;overflow:hidden;width:84px;height:84px;border-radius:50%;box-shadow:inset 0 0 0 2px ${T.paper},0 0 0 2px ${T.cyan}}.p4-circle>span{position:absolute;top:0;left:50%;height:50%;border-left:2px solid rgba(255,255,255,.92);transform-origin:50% 100%}.p4-number-line{position:relative;display:flex;align-items:center;width:150px;height:52px;margin-bottom:20px;border-bottom:4px solid ${T.navy}}.p4-number-line span{position:relative;flex:1;height:14px;border-left:2px solid ${T.cyan}}.p4-number-line span:last-child{flex:0}.p4-number-line span.is-point::after{content:'';position:absolute;left:-7px;bottom:-1px;width:12px;height:12px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 4px ${T.accentSoft}}.p4-number-line::before,.p4-number-line::after{position:absolute;bottom:-23px;font:800 11px 'JetBrains Mono',monospace;color:${T.ink2}}.p4-number-line::before{content:'0';left:-2px}.p4-number-line::after{content:'1';right:-2px}
.p4-cells.is-grid{width:min(100%,260px)}.p4-cells.is-grid>span,.p4-cells.is-grid>button{min-height:44px}
.p4-formula{flex-direction:column}.p4-formula b{font:800 clamp(18px,4vw,27px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-formula b.is-error{color:${T.warn};text-decoration:line-through}.p4-formula span{color:${T.ink2}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.p4-option{display:flex;align-items:center;gap:9px;min-height:54px;padding:9px 11px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);line-height:1.35;color:${T.ink};background:${T.paper};border:0;border-radius:14px;cursor:pointer;box-shadow:${T.shadowBase};transition:border-color .18s,background-color .18s,transform .18s}.p4-option:hover:not(:disabled){transform:translateY(-1px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-option.is-ok{background:${T.successSoft};color:${T.success}}.p4-option.is-no{background:${T.warnSoft};color:${T.warn};animation:p4-shake .17s ease}
.p4-match-cols{display:flex;gap:9px;margin-top:7px}.p4-match-col{display:flex;flex-direction:column;gap:7px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:48px;padding:7px 9px;border:0;border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,15px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer;box-shadow:${T.shadowBase}}.p4-match-item.is-active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-match-item.is-tied{background:${T.cyanSoft}}.p4-match-item.is-used{background:${T.successSoft}}.p4-match-item:disabled{cursor:default;opacity:.62}.p4-match-item b{font-size:12px;color:${T.success}}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:7px}.p4-order-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:74px;padding:7px;border:0;border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer;box-shadow:${T.shadowBase}}.p4-order-slot.is-active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-order-slot small{font-weight:800}.p4-order-slot b{font:800 12px/1.25 'JetBrains Mono',monospace;color:${T.navy}}.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}.p4-card{min-width:44px;min-height:46px;padding:7px 11px;border:0;border-radius:12px;background:${T.paper};font:800 13px 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer;box-shadow:${T.shadowBase}}.p4-card.is-used{background:${T.cyanSoft}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:7px;width:min(232px,100%);margin:0 auto;padding:10px;border-radius:17px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:100%}.p4-pad-keys button{min-width:44px;min-height:44px;border:0;border-radius:11px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer;box-shadow:0 5px 14px -12px rgba(23,59,82,.7)}.p4-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.p4-frac-builder{display:grid;gap:8px;padding:12px;border-radius:17px;background:${T.paper};box-shadow:${T.shadowBase}}.p4-frac-builder>div{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap}.p4-frac-builder span{min-width:90px;color:${T.ink2};font-weight:800}.p4-frac-builder button{min-width:44px;min-height:44px;border:0;border-radius:11px;background:${T.cyanSoft};color:${T.cyan};font:800 17px 'JetBrains Mono',monospace;cursor:pointer}.p4-frac-builder button.is-active{background:${T.accent};color:#fff}.p4-frac-builder hr{width:180px;margin:0 auto;border:0;border-top:3px solid ${T.navy}}
.p4-feedback{padding:11px 13px;border-radius:14px;animation:p4-result .22s ease both}.p4-feedback.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-feedback.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-feedback p{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.42}.p4-rule{margin-top:7px!important;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:9px}.p4-btn{min-width:44px;min-height:46px;padding:9px 20px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}
.p4-done{display:flex;flex-direction:column;align-items:center;gap:9px;padding:24px 12px;text-align:center}.p4-done h2{font-family:'Source Serif 4',Georgia,serif}.p4-medal{display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:${T.accent};color:#fff;font-size:34px;box-shadow:0 0 0 9px ${T.accentSoft}}.p4-score{display:flex;align-items:baseline;gap:5px;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:16px;color:${T.ink3}}.p4-complete{color:${T.ink2}}
@keyframes p4-cell-in{from{opacity:.35;transform:scale(.94)}to{opacity:1;transform:none}}@keyframes p4-result{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}@keyframes p4-shake{0%,100%{transform:none}35%{transform:translateX(-4px)}70%{transform:translateX(4px)}}
@media(max-width:640px){.p4-model-grid{grid-template-columns:1fr}.p4-options{grid-template-columns:1fr}.p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}.p4-scale.is-vertical{height:220px}.p4-visual{min-height:104px}.p4-match-cols{gap:7px}}
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
