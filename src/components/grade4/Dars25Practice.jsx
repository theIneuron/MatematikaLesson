// 4-sinf, 25-dars amaliyoti: ikki mezon bo'yicha saralash.
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
  title: b('Урок 25. Практика: сортировка по двум критериям', "25-dars. Amaliyot: ikki mezon bo'yicha saralash", 'Lesson 25. Practice: sorting by two criteria'),
  language: b('Язык', 'Til', 'Language'), task: b('Задание', 'Topshiriq', 'Task'),
  level: { green: b('Базовое', 'Asosiy', 'Core'), yellow: b('Применение', "Qo'llash", 'Application'), red: b('Перенос', "Ko'chirish", 'Transfer') },
  check: b('Проверить', 'Tekshirish', 'Check'), retry: b('Исправить ответ', 'Javobni tuzatish', 'Correct the answer'),
  next: b('Следующее', 'Keyingisi', 'Next'), finish: b('Завершить', 'Yakunlash', 'Finish'),
  again: b('Пройти заново', 'Qaytadan ishlash', 'Try again'), done: b('Практика пройдена', 'Amaliyot tugadi', 'Practice complete'),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", 'correct on the first check'),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', 'All 10 tasks have been solved.'),
  rule: b('Запомните', 'Eslab qoling', 'Remember'), typeAnswer: b('Введите числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Стереть', "O'chirish", 'Delete'),
  matchHint: b('Сначала выберите карточку слева, затем её место справа.', "Avval chapdagi kartani, keyin o'ngdagi joyini tanlang.", 'Choose a card on the left, then its place on the right.'),
  orderHint: b('Сначала выберите место, затем карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', 'Choose a position, then a step card.'),
};

const LESSON_META = {
  lessonId: 'num-4-25-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 25,
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
    id: '01', level: 'green', kind: 'mc', skillTag: 'two-criterion-classification',
    visual: { headline: b('Карточка: англоязычный атлас о животных Центральной Азии', "Karta: Markaziy Osiyo hayvonlari haqidagi ingliz tilidagi atlas", 'Card: an English-language atlas about Central Asian animals'), chips: [b('A: о животных', 'A: hayvonlar haqida', 'A: about animals'), b('B: на узбекском', "B: o'zbek tilida", 'B: in Uzbek')] },
    setup: b('A — книги о животных. B — книги на узбекском языке.', "A — hayvonlar haqidagi kitoblar. B — o'zbek tilidagi kitoblar.", 'A is books about animals. B is books in Uzbek.'),
    prompt: b('Куда поместить карточку?', 'Kartani qayerga joylashtirish kerak?', 'Where should the card go?'),
    options: [
      option('a-only', 'Только A', 'Faqat A', 'A only', true),
      option('both', 'Оба', 'Ikkalasi ham', 'Both', false, 'Язык атласа — английский, поэтому B ему не подходит.', "Atlas ingliz tilida, shuning uchun u B ga mos kelmaydi.", 'The atlas is in English, so it does not meet B.'),
      option('b-only', 'Только B', 'Faqat B', 'B only', false, 'Тема подходит A, а язык не подходит B.', "Mavzu A ga mos, til esa B ga mos emas.", 'Its topic meets A, but its language does not meet B.'),
      option('outside', 'Ни A, ни B', 'A ham emas, B ham emas', 'Neither A nor B', false, 'Атлас о животных подходит A.', 'Hayvonlar haqidagi atlas A ga mos keladi.', 'An atlas about animals meets A.'),
    ],
    secondHint: b('Проверьте тему и язык отдельно.', 'Mavzu va tilni alohida tekshiring.', 'Check the topic and the language separately.'),
    thirdHint: b('На первый вопрос ответ «да», на второй — «нет».', "Birinchi savolga «ha», ikkinchisiga «yo'q» deb javob beriladi.", 'The first answer is yes and the second is no.'),
    correctText: b('Верно. Карточка подходит только A.', "To'g'ri. Karta faqat A ga mos keladi.", 'Correct. The card meets A only.'),
    rule: b('Каждый критерий проверяют отдельно.', 'Har bir mezon alohida tekshiriladi.', 'Check each criterion separately.'),
  },
  {
    id: '02', level: 'green', kind: 'match', skillTag: 'four-zone-map',
    visual: { headline: b('A: содержит яблоко · B: холодное', 'A: olma bor · B: sovuq', 'A: contains apple · B: cold'), chips: [b('4 блюда', '4 ta taom', '4 foods'), b('4 места', '4 ta joy', '4 places')] },
    setup: b('Распределите блюда по двум признакам.', "Taomlarni ikki belgiga ko'ra joylashtiring.", 'Sort the foods by two properties.'),
    prompt: b('Соедините каждое блюдо с его местом.', 'Har bir taomni o‘z joyi bilan moslang.', 'Match each food to its place.'),
    pairs: [
      { id: 'warm-pie', left: b('Тёплый яблочный пирог', 'Iliq olmali pirog', 'Warm apple pie'), correctRight: 'a-only' },
      { id: 'cold-apple', left: b('Холодные ломтики яблока', "Sovuq olma bo'laklari", 'Cold apple slices'), correctRight: 'both' },
      { id: 'grape-juice', left: b('Холодный виноградный сок', 'Sovuq uzum sharbati', 'Cold grape juice'), correctRight: 'b-only' },
      { id: 'hot-tea', left: b('Горячий чай', 'Issiq choy', 'Hot tea'), correctRight: 'outside' },
    ],
    right: [
      { id: 'a-only', text: b('Только A', 'Faqat A', 'A only') }, { id: 'both', text: b('Оба', 'Ikkalasi ham', 'Both') },
      { id: 'b-only', text: b('Только B', 'Faqat B', 'B only') }, { id: 'outside', text: b('Ни A, ни B', 'A ham emas, B ham emas', 'Neither A nor B') },
    ],
    wrong: [b('Для каждого блюда дважды ответьте «да» или «нет».', "Har bir taom uchun ikki marta «ha» yoki «yo'q» deb javob bering.", 'Answer yes or no twice for each food.')],
    secondHint: b('Холодные ломтики яблока подходят обоим признакам.', 'Sovuq olma bo‘laklari ikkala belgiga ham mos.', 'Cold apple slices meet both properties.'),
    thirdHint: b('Горячий чай не содержит яблоко и не является холодным.', 'Issiq choyda olma yo‘q va u sovuq emas.', 'Hot tea contains no apple and is not cold.'),
    correctText: b('Верно. Все четыре блюда на своих местах.', "To'g'ri. To'rtta taom ham o'z joyida.", 'Correct. All four foods are in the right places.'),
    rule: b('Два ответа «да/нет» однозначно задают место.', "Ikkita «ha/yo'q» javobi joyni aniq ko'rsatadi.", 'Two yes/no answers determine the place.'),
  },
  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'yes-no-to-zone',
    visual: { headline: b('Дилшод ходит только в секцию плавания', "Dilshod faqat suzish to'garagiga qatnaydi", 'Dilshod attends the swimming club only'), chips: [b('A: шахматы', 'A: shaxmat', 'A: chess'), b('B: плавание', 'B: suzish', 'B: swimming')] },
    setup: b('Нужно определить место карточки Дилшода.', 'Dilshod kartasining joyini aniqlash kerak.', "Dilshod's card needs a place."),
    prompt: b('Расположите шаги решения по порядку.', 'Yechish qadamlarini tartib bilan joylashtiring.', 'Put the solution steps in order.'),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') }, { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') }, { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'read', order: 0, text: b('Прочитать оба критерия', "Ikkala mezonni o'qish", 'Read both criteria') },
      { id: 'check-a', order: 1, text: b('A? Нет', "A? Yo'q", 'A? No') },
      { id: 'check-b', order: 2, text: b('B? Да', 'B? Ha', 'B? Yes') },
      { id: 'choose', order: 3, text: b('Выбрать «только B»', '«Faqat B»ni tanlash', 'Choose B only') },
    ],
    wrong: [b('Сначала читают критерии, затем проверяют A и B.', "Avval mezonlar o'qiladi, keyin A va B tekshiriladi.", 'Read the criteria first, then check A and B.')],
    secondHint: b('Проверка A должна идти раньше выбора места.', 'A ni tekshirish joyni tanlashdan oldin keladi.', 'Checking A must come before choosing the place.'),
    thirdHint: b('Порядок: критерии → A? → B? → место.', 'Tartib: mezonlar → A? → B? → joy.', 'Order: criteria → A? → B? → place.'),
    correctText: b('Верно. Два ответа приводят к месту «только B».', "To'g'ri. Ikki javob «Faqat B» joyiga olib keladi.", 'Correct. The two answers lead to B only.'),
    rule: b('Сначала проверяют оба критерия, потом выбирают место.', 'Avval ikkala mezon tekshiriladi, keyin joy tanlanadi.', 'Check both criteria before choosing a place.'),
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'criterion-total', answer: '8', maxLen: 2,
    visual: { headline: b('Кружки: только A — 5, оба — 3, только B — 4, ни один — 2', "To'garaklar: faqat A — 5, ikkalasi — 3, faqat B — 4, hech biri — 2", 'Clubs: A only — 5, both — 3, B only — 4, neither — 2'), chips: [b('A?', 'A?', 'A?'), b('5 + 3', '5 + 3', '5 + 3')] },
    setup: b('В таблице показано, сколько учеников выбрали кружки.', "Jadvalda nechta o'quvchi to'garaklarni tanlagani ko'rsatilgan.", 'The table shows how many pupils chose the clubs.'),
    prompt: b('Сколько учеников подходят критерию A?', 'Nechta o‘quvchi A mezoniga mos keladi?', 'How many pupils meet criterion A?'),
    wrong: [b('К A относятся «только A» и «оба».', 'A ga «Faqat A» va «Ikkalasi» kiradi.', 'A includes A only and both.')],
    secondHint: b('К пяти прибавьте троих из среднего места.', "Beshtaga o'rtadagi uch nafarni qo'shing.", 'Add the three in the middle to five.'),
    thirdHint: b('5 + 3 = 8.', '5 + 3 = 8.', '5 + 3 = 8.'),
    correctText: b('Верно. Критерию A подходят 8 учеников.', "To'g'ri. A mezoniga 8 nafar o'quvchi mos.", 'Correct. Eight pupils meet criterion A.'),
    rule: b('Для итога A считают «только A» и «оба».', 'A jami uchun «Faqat A» va «Ikkalasi» sanaladi.', 'For the A total, count A only and both.'),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'outside-count', answer: '4', maxLen: 2,
    visual: { headline: b('Всего 17: только A — 6, оба — 2, только B — 5, ни один — □', "Jami 17: faqat A — 6, ikkalasi — 2, faqat B — 5, hech biri — □", 'Total 17: A only — 6, both — 2, B only — 5, neither — □'), chips: [b('17 всего', 'Jami 17', '17 total'), b('6 + 2 + 5', '6 + 2 + 5', '6 + 2 + 5')] },
    setup: b('Все 17 карточек находятся ровно в одном из четырёх мест.', "17 ta kartaning har biri to'rtta joydan aynan bittasida turibdi.", 'Each of the 17 cards is in exactly one of four places.'),
    prompt: b('Сколько карточек не подходят ни A, ни B?', 'Nechta karta A ga ham, B ga ham mos kelmaydi?', 'How many cards meet neither A nor B?'),
    wrong: [b('Сначала сложите три известные части, затем вычтите их из 17.', "Avval ma'lum uch qismni qo'shing, keyin 17 dan ayiring.", 'Add the three known parts, then subtract from 17.')],
    secondHint: b('6 + 2 + 5 = 13 карточек уже размещены.', "6 + 2 + 5 = 13 ta karta joylashtirilgan.", '6 + 2 + 5 = 13 cards are already placed.'),
    thirdHint: b('17 − 13 = 4.', '17 − 13 = 4.', '17 − 13 = 4.'),
    correctText: b('Верно. Четыре карточки не подходят ни одному критерию.', "To'g'ri. To'rtta karta hech bir mezonga mos kelmaydi.", 'Correct. Four cards meet neither criterion.'),
    rule: b('Неизвестную часть находят вычитанием известных частей из общего числа.', "Noma'lum qism jamidan ma'lum qismlarni ayirish orqali topiladi.", 'Find an unknown part by subtracting the known parts from the total.'),
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'at-least-one-count', answer: '19', maxLen: 2,
    visual: { headline: b('Ярмарка: только A — 8, оба — 5, только B — 6, ни один — 3', "Yarmarka: faqat A — 8, ikkalasi — 5, faqat B — 6, hech biri — 3", 'Fair: A only — 8, both — 5, B only — 6, neither — 3'), chips: [b('A или B', 'A yoki B', 'A or B'), b('8 + 5 + 6', '8 + 5 + 6', '8 + 5 + 6')] },
    setup: b('Нужно посчитать участников, которые подходят A или B, включая тех, кто подходит обоим.', "A yoki B ga mos ishtirokchilarni, jumladan ikkalasiga moslarni sanash kerak.", 'Count participants who meet A or B, including those who meet both.'),
    prompt: b('Сколько участников подходят хотя бы одному критерию?', 'Nechta ishtirokchi kamida bitta mezonga mos?', 'How many participants meet at least one criterion?'),
    wrong: [b('Среднюю группу считают один раз, а группу «ни один» не считают.', "O'rtadagi guruh bir marta sanaladi, «hech biri» guruhi sanalmaydi.", 'Count the middle group once and do not count the neither group.')],
    secondHint: b('Сложите три подходящие части: 8, 5 и 6.', "Mos uch qismni qo'shing: 8, 5 va 6.", 'Add the three matching parts: 8, 5 and 6.'),
    thirdHint: b('8 + 5 + 6 = 19.', '8 + 5 + 6 = 19.', '8 + 5 + 6 = 19.'),
    correctText: b('Верно. Хотя бы одному критерию подходят 19 участников.', "To'g'ri. Kamida bitta mezonga 19 nafar ishtirokchi mos.", 'Correct. Nineteen participants meet at least one criterion.'),
    rule: b('Три подходящие части складывают, каждую карточку считая один раз.', 'Mos uch qism qo‘shiladi, har bir karta bir marta sanaladi.', 'Add the three matching parts, counting each card once.'),
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'number-property-classification',
    visual: { headline: b('A: чётное число · B: больше 20', 'A: juft son · B: 20 dan katta', 'A: even number · B: greater than 20'), chips: [b('14 · 26', '14 · 26', '14 · 26'), b('35 · 9', '35 · 9', '35 · 9')] },
    setup: b('Проверьте у каждого числа оба свойства.', 'Har bir sonning ikkala xususiyatini tekshiring.', 'Check both properties of each number.'),
    prompt: b('Соедините число с его местом.', 'Sonni o‘z joyi bilan moslang.', 'Match each number to its place.'),
    pairs: [
      { id: 'n14', left: b('14', '14', '14'), correctRight: 'a-only' }, { id: 'n26', left: b('26', '26', '26'), correctRight: 'both' },
      { id: 'n35', left: b('35', '35', '35'), correctRight: 'b-only' }, { id: 'n9', left: b('9', '9', '9'), correctRight: 'outside' },
    ],
    right: [
      { id: 'a-only', text: b('Только A', 'Faqat A', 'A only') }, { id: 'both', text: b('Оба', 'Ikkalasi ham', 'Both') },
      { id: 'b-only', text: b('Только B', 'Faqat B', 'B only') }, { id: 'outside', text: b('Ни A, ни B', 'A ham emas, B ham emas', 'Neither A nor B') },
    ],
    wrong: [b('Чётность и сравнение с 20 проверяйте независимо.', 'Juftlik va 20 bilan taqqoslashni alohida tekshiring.', 'Check evenness and comparison with 20 independently.')],
    secondHint: b('26 — чётное и больше 20.', '26 juft va 20 dan katta.', '26 is even and greater than 20.'),
    thirdHint: b('14: только A; 26: оба; 35: только B; 9: ни один.', '14: faqat A; 26: ikkalasi; 35: faqat B; 9: hech biri.', '14: A only; 26: both; 35: B only; 9: neither.'),
    correctText: b('Верно. Все числа распределены по двум свойствам.', "To'g'ri. Barcha sonlar ikki xususiyat bo'yicha joylashtirildi.", 'Correct. All numbers are sorted by the two properties.'),
    rule: b('Одно число может подходить двум свойствам одновременно.', 'Bitta son bir vaqtda ikkala xususiyatga mos kelishi mumkin.', 'One number can meet both properties at the same time.'),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'shared-element-once',
    visual: { headline: b('Карточка 18 · A: кратно 3 · B: чётное', '18 kartasi · A: 3 ga karrali · B: juft', 'Card 18 · A: multiple of 3 · B: even'), chips: [b('18 ÷ 3 = 6', '18 ÷ 3 = 6', '18 ÷ 3 = 6'), b('18 — чётное', '18 — juft', '18 is even')] },
    setup: b('Есть одна карточка с числом 18.', '18 soni yozilgan bitta karta bor.', 'There is one card with the number 18.'),
    prompt: b('Как правильно разместить карточку?', "Kartani qanday to'g'ri joylashtirish kerak?", 'How should the card be placed?'),
    options: [
      option('both-once', 'В место «оба», одной карточкой', '«Ikkalasi» joyiga, bitta karta sifatida', 'In both, as one card', true),
      option('two-copies', 'Сделать две копии: одну в A, другую в B', 'Ikki nusxa qilish: birini A ga, birini B ga', 'Make two copies: one in A and one in B', false, 'Одна исходная карточка должна остаться одной карточкой.', 'Bitta asl karta bitta karta bo‘lib qolishi kerak.', 'One original card must remain one card.'),
      option('a-only', 'Поместить только в A', 'Faqat A ga joylashtirish', 'Place it in A only', false, '18 также является чётным.', '18 juft son hamdir.', '18 is also even.'),
      option('b-only', 'Поместить только в B', 'Faqat B ga joylashtirish', 'Place it in B only', false, '18 также кратно 3.', '18 soni 3 ga karrali hamdir.', '18 is also a multiple of 3.'),
    ],
    secondHint: b('18 подходит обоим критериям, но карточка всего одна.', '18 ikkala mezonga ham mos, lekin karta bitta.', '18 meets both criteria, but there is only one card.'),
    thirdHint: b('Выберите место «оба» и не дублируйте карточку.', '«Ikkalasi» joyini tanlang va kartani ko‘paytirmang.', 'Choose both and do not duplicate the card.'),
    correctText: b('Верно. Одна карточка 18 занимает место «оба».', "To'g'ri. Bitta 18 kartasi «Ikkalasi» joyini egallaydi.", 'Correct. The single 18 card goes in both.'),
    rule: b('Общий объект считают и размещают один раз.', 'Umumiy obyekt bir marta sanaladi va joylashtiriladi.', 'Count and place a shared object once.'),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'middle-count-error',
    visual: { headline: b('Только A — 4 · оба — 3 · только B — 5', 'Faqat A — 4 · ikkalasi — 3 · faqat B — 5', 'A only — 4 · both — 3 · B only — 5'), chips: [b('Ответ ученика: A = 4', "O'quvchi javobi: A = 4", "Pupil's answer: A = 4"), b('Проверьте', 'Tekshiring', 'Check')] },
    setup: b('Ученик сказал: «Критерию A подходят 4 карточки».', "O'quvchi: «A mezoniga 4 ta karta mos», dedi.", 'A pupil said: “Four cards meet criterion A.”'),
    prompt: b('В чём ошибка и каков верный итог A?', "Xato nimada va A ning to'g'ri jami nechaga teng?", 'What is the error and what is the correct A total?'),
    options: [
      option('include-middle', 'Не учтены 3 карточки «оба»: 4 + 3 = 7', '«Ikkalasi»dagi 3 ta karta olinmagan: 4 + 3 = 7', 'The 3 both cards were missed: 4 + 3 = 7', true),
      option('all-three', 'Нужно сложить всё: 4 + 3 + 5 = 12', "Hammasini qo'shish kerak: 4 + 3 + 5 = 12", 'Add everything: 4 + 3 + 5 = 12', false, 'Пять карточек «только B» не подходят A.', '«Faqat B»dagi beshta karta A ga mos emas.', 'The five B-only cards do not meet A.'),
      option('four-right', 'Ошибки нет: итог A равен 4', "Xato yo'q: A jami 4", 'There is no error: A total is 4', false, 'Карточки «оба» тоже подходят A.', '«Ikkalasi»dagi kartalar A ga ham mos.', 'The both cards also meet A.'),
      option('subtract', 'Нужно вычесть: 5 − 3 = 2', 'Ayirish kerak: 5 − 3 = 2', 'Subtract: 5 − 3 = 2', false, 'Итог A находят по частям, которые подходят A.', 'A jami A ga mos qismlardan topiladi.', 'Find the A total from the parts that meet A.'),
    ],
    secondHint: b('Спросите: подходят ли карточки «оба» критерию A?', '«Ikkalasi»dagi kartalar A mezoniga mosmi, deb so‘rang.', 'Ask whether the both cards meet criterion A.'),
    thirdHint: b('Да. Поэтому 4 + 3 = 7.', 'Ha. Shuning uchun 4 + 3 = 7.', 'Yes. Therefore 4 + 3 = 7.'),
    correctText: b('Верно. Ученик пропустил средние 3 карточки; итог A равен 7.', "To'g'ri. O'quvchi o'rtadagi 3 ta kartani o'tkazib yuborgan; A jami 7.", 'Correct. The pupil missed the middle three cards; the A total is 7.'),
    rule: b('В итог критерия входят все карточки, которые ему подходят.', 'Mezon jamiga unga mos barcha kartalar kiradi.', 'A criterion total includes every card that meets it.'),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'classification-strategy-transfer',
    visual: { headline: b('Билет R4: действует в выходные — да; аудиогид — нет', "R4 chipta: dam olish kunlari amal qiladi — ha; audiogid — yo'q", 'Ticket R4: valid at weekends — yes; audio guide — no'), chips: [b('A: выходные', 'A: dam olish kunlari', 'A: weekends'), b('B: аудиогид', 'B: audiogid', 'B: audio guide')] },
    setup: b('A — билеты, действующие в выходные. B — билеты с аудиогидом.', "A — dam olish kunlari amal qiladigan chiptalar. B — audiogidli chiptalar.", 'A is tickets valid at weekends. B is tickets with an audio guide.'),
    prompt: b('Какой план полностью и верно определяет место R4?', "Qaysi reja R4 joyini to'liq va to'g'ri aniqlaydi?", 'Which plan fully and correctly determines the place for R4?'),
    options: [
      option('full-plan', 'Проверить A: да; проверить B: нет; выбрать «только A»', 'A ni tekshirish: ha; B ni tekshirish: yo‘q; «Faqat A»ni tanlash', 'Check A: yes; check B: no; choose A only', true),
      option('stop-early', 'После ответа A «да» сразу выбрать «оба»', 'A ga «ha» javobidan keyin darhol «Ikkalasi»ni tanlash', 'After A is yes, immediately choose both', false, 'Ответ «да» для A ничего не говорит о B.', 'A uchun «ha» javobi B haqida hech narsa demaydi.', 'A yes answer tells us nothing about B.'),
      option('only-b', 'Проверить только B и выбрать «только B»', 'Faqat B ni tekshirib, «Faqat B»ni tanlash', 'Check B only and choose B only', false, 'У билета нет аудиогида, а в выходные он действует.', "Chiptada audiogid yo'q, ammo u dam olish kunlari amal qiladi.", 'The ticket has no audio guide and is valid at weekends.'),
      option('outside', 'Не проверять ответы и выбрать «ни A, ни B»', 'Javoblarni tekshirmay, «A ham emas, B ham emas»ni tanlash', 'Do not check the answers and choose neither', false, 'Для R4 уже указано, что он действует в выходные.', 'R4 dam olish kunlari amal qilishi ko‘rsatilgan.', 'R4 is stated to be valid at weekends.'),
    ],
    secondHint: b('Полный план обязан проверить A и B.', 'To‘liq reja A va B ni tekshirishi shart.', 'A complete plan must check both A and B.'),
    thirdHint: b('A — «да», B — «нет», значит место «только A».', 'A — «ha», B — «yo‘q», demak joy «Faqat A».', 'A is yes and B is no, so the place is A only.'),
    correctText: b('Верно. Полная проверка приводит к месту «только A».', "To'g'ri. To'liq tekshiruv «Faqat A» joyiga olib keladi.", 'Correct. The complete check leads to A only.'),
    rule: b('Нельзя останавливаться после первого «да»: проверяют оба критерия.', "Birinchi «ha»dan keyin to'xtab bo'lmaydi: ikkala mezon tekshiriladi.", 'Do not stop after the first yes: check both criteria.'),
  },
];

function Visual({ visual, lang }) {
  return <div className="p4-visual">
    <strong>{tx(visual.headline, lang)}</strong>
    <div className="p4-chips">{visual.chips.map((chip, index) => <span key={index}>{tx(chip, lang)}</span>)}</div>
  </div>;
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
    <div className="p4-pad-display">{value || '—'}</div>
    <div className="p4-pad-keys">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => <button type="button" key={digit} disabled={disabled} onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>{digit}</button>)}
      <button type="button" className="is-delete" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
    </div>
  </div>;
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
    <p className="p4-feedback-text">{tx(text, lang)}</p>{ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
  </div>;
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
  const resetResponse = () => {
    checkingRef.current = false; setChecked(false); setPicked(null); setTyped(''); setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null);
  };
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
    <p className="p4-setup">{tx(task.setup, lang)}</p>
    <Visual visual={task.visual} lang={lang}/>
    <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

    {task.kind === 'mc' && <div className="p4-options" role="group" aria-label={tx(task.prompt, lang)}>{options.map((item, index) => <button type="button" key={item.id} disabled={solved} aria-pressed={picked === item.id} className={`p4-option ${picked === item.id ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} onClick={() => setAnswer(setPicked, item.id)}><span className="p4-letter">{'ABCD'[index]}</span><span>{tx(item.text, lang)}</span></button>)}</div>}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang}/>}
    {task.kind === 'match' && <div className="p4-match"><p className="p4-note">{tx(UI.matchHint, lang)}</p><div className="p4-match-cols"><div className="p4-match-col">{task.pairs.map((pair) => <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id} className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`} onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}><span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b>{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}</button>)}</div><div className="p4-match-col">{rightCards.map((right) => { const used = Object.values(pairs).includes(right.id); return <button type="button" key={right.id} disabled={solved || activeLeft === null || used} className={`p4-match-item ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPairs((old) => ({ ...old, [activeLeft]: right.id })); setActiveLeft(null); setChecked(false); }}>{tx(right.text, lang)}</button>; })}</div></div></div>}
    {task.kind === 'order' && <div className="p4-order"><p className="p4-note">{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button type="button" key={step.id} disabled={solved} aria-pressed={activeStep === step.id} className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''}`} onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button type="button" key={card.id} disabled={solved || activeStep === null || used} className={`p4-card ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPlaced((old) => ({ ...old, [activeStep]: card.id })); setActiveStep(null); setChecked(false); }}>{tx(card.text, lang)}</button>; })}</div></div>}

    {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={solved ? task.correctText : wrongText} rule={task.rule} lang={lang}/>}
    <div className="p4-actions">
      {!checked && !solved && <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>}
      {checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={resetResponse}>{tx(UI.retry, lang)}</button>}
      {solved && <button type="button" className="p4-btn p4-btn-ready" disabled={advancing} onClick={() => {
        if (advancedRef.current) return;
        advancedRef.current = true; checkingRef.current = false; setAdvancing(true);
        onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, locale: lang, setup: task.setup, prompt: task.prompt, studentAnswer: answerSnapshot(), correctAnswer: correctSnapshot(), answerChoices: task.options?.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) })) ?? task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) });
      }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}
    </div>
  </section>;
}

export default function Grade4Dars25Practice({ lang: langProp, onFinished }) {
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
        grade: 4, lessonNumber: 25, locale: lang, activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
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
  const restart = () => {
    finishedRef.current = false; startedAtRef.current = Date.now(); setRunId((old) => old + 1);
    setIndex(0); setAnswers([]); setFirstTry(0); setFinished(false);
  };

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
