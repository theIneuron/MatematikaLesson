// ============================================================================
// 4-SINF · 19-DARS AMALIYOTI · KASRLARNI TAQQOSLASH
// Dars01Practice kontrakti: 10 topshiriq, UZ/RU/EN, ovozsiz, solve-to-advance.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

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
  title: b('Урок 19. Практика: сравнение дробей', "19-dars. Amaliyot: kasrlarni taqqoslash", "Lesson 19. Practice: comparing fractions"),
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
  lessonId: 'num-4-19-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 19,
  activityType: 'practice', taskCount: 10, resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'sign-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'sign-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-card', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'sign-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'same-denominator',
    visual: { type: 'models', items: [{ shape: 'bar', total: 9, filled: 2, label: '2/9' }, { shape: 'bar', total: 9, filled: 7, label: '7/9' }] },
    setup: b('Два одинаковых целых разделены на девять равных частей.', "Ikkita bir xil butun to'qqizta teng qismga bo'lingan.", "Two identical wholes are divided into nine equal parts."),
    prompt: b('Какая дробь больше?', "Qaysi kasr katta?", "Which fraction is greater?"),
    options: [
      option('left', '2/9', '2/9', "2/9", false, 'Доли одинаковы, но во второй дроби их выбрано больше.', "Ulushlar bir xil, ammo ikkinchi kasrda ulardan ko'prog'i tanlangan.", "The parts are the same size, but more of them are selected in the second fraction."),
      option('correct', '7/9', '7/9', "7/9", true),
      option('equal', 'Дроби равны', 'Kasrlar teng', "The fractions are equal", false, 'Равные знаменатели не делают дроби равными: числители различаются.', "Teng maxrajlar kasrlarni teng qilmaydi: suratlar turlicha.", "Equal denominators do not make fractions equal: the numerators are different."),
      option('unknown', 'Определить нельзя', "Aniqlab bo'lmaydi", "It cannot be determined", false, 'Одинаковые целые и равные знаменатели позволяют сравнить числители.', "Bir xil butun va teng maxrajlar suratlarni taqqoslash imkonini beradi.", "Identical wholes and equal denominators allow us to compare the numerators."),
    ],
    secondHint: b('Каждая доля равна 1/9. Сравните число таких долей.', "Har bir ulush 1/9 ga teng. Shunday ulushlar sonini solishtiring.", "Each part is 1/9. Compare the number of these parts."),
    thirdHint: b('Из двух дробей 3/8 и 6/8 больше та, у которой числитель 6.', "3/8 va 6/8 kasrlaridan surati 6 bo'lgan kasr katta.", "Of the fractions 3/8 and 6/8, the one with numerator 6 is greater."),
    correctText: b('Верно. Семь девятых долей больше двух девятых.', "To'g'ri. Yettita to'qqizdan bir ulush ikkitasidan ko'p.", "Correct. Seven ninths is greater than two ninths."),
    rule: b('При равных знаменателях сравнивают числители.', "Maxrajlar teng bo'lsa, suratlar taqqoslanadi.", "When the denominators are equal, compare the numerators."),
  },
  {
    id: '02', level: 'green', kind: 'sign', skillTag: 'same-numerator',
    visual: { type: 'models', items: [{ shape: 'bar', total: 5, filled: 4, label: '4/5' }, { shape: 'bar', total: 7, filled: 4, label: '4/7' }] },
    setup: b('В обеих дробях выбраны четыре доли, но размеры долей различаются.', "Har ikkala kasrda to'rtta ulush tanlangan, ammo ulushlar o'lchami turlicha.", "Four parts are selected in both fractions, but the parts are different sizes."),
    prompt: b('Поставьте знак: 4/5 □ 4/7.', "Belgini qo'ying: 4/5 □ 4/7.", "Choose the sign: 4/5 □ 4/7."),
    options: [
      option('less', '<', '<', "<", false, 'Пятые доли крупнее седьмых, поэтому четыре пятых не меньше.', "Beshdan bir ulushlar yettidan bir ulushlardan katta, shuning uchun 4/5 kichik emas.", "Fifths are larger than sevenths, so four fifths is not less."),
      option('equal', '=', '=', "=", false, 'Числители равны, но размеры долей не равны.', "Suratlar teng, ammo ulushlarning o'lchami teng emas.", "The numerators are equal, but the parts are not the same size."),
      option('correct', '>', '>', ">", true),
    ],
    secondHint: b('Сравните одну пятую и одну седьмую на моделях.', "Modellarda 1/5 bilan 1/7 ni solishtiring.", "Compare one fifth and one seventh in the models."),
    thirdHint: b('При одинаковом числителе 2/3 больше 2/6, потому что трети крупнее шестых.', "Suratlar teng bo'lganda 2/3 kasri 2/6 dan katta, chunki uchdan bir ulush kattaroq.", "When the numerators are equal, 2/3 is greater than 2/6 because thirds are larger than sixths."),
    correctText: b('Верно. 4/5 больше 4/7.', "To'g'ri. 4/5 kasri 4/7 dan katta.", "Correct. 4/5 is greater than 4/7."),
    rule: b('При равных числителях больше дробь с меньшим знаменателем.', "Suratlar teng bo'lsa, maxraji kichik kasr kattaroq bo'ladi.", "When the numerators are equal, the fraction with the smaller denominator is greater."),
  },
  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'comparison-strategy',
    visual: { type: 'models', items: [
      { shape: 'bar', total: 11, filled: 5, label: '5/11 · 8/11' },
      { shape: 'bar', total: 4, filled: 3, label: '3/4 · 3/9' },
      { shape: 'bar', total: 9, filled: 4, label: '4/9 · 5/8' },
    ] },
    setup: b('Для каждой пары есть особенно удобный способ сравнения.', "Har bir juftlik uchun ayniqsa qulay taqqoslash usuli bor.", "Each pair has a particularly useful comparison strategy."),
    prompt: b('Соедините пару дробей со стратегией.', "Kasrlar juftligini strategiya bilan moslashtiring.", "Match each pair of fractions to its strategy."),
    pairs: [
      { id: 'den', left: b('5/11 и 8/11', '5/11 va 8/11', "5/11 and 8/11"), correctRight: 'numerators' },
      { id: 'num', left: b('3/4 и 3/9', '3/4 va 3/9', "3/4 and 3/9"), correctRight: 'parts' },
      { id: 'half', left: b('4/9 и 5/8', '4/9 va 5/8', "4/9 and 5/8"), correctRight: 'benchmark' },
    ],
    right: [
      { id: 'numerators', text: b('Сравнить числители', 'Suratlarni taqqoslash', "Compare the numerators") },
      { id: 'parts', text: b('Сравнить размеры долей', "Ulushlar o'lchamini taqqoslash", "Compare the sizes of the parts") },
      { id: 'benchmark', text: b('Сравнить с 1/2', '1/2 bilan taqqoslash', "Compare with 1/2") },
    ],
    wrong: [b('Сначала найдите общий признак пары: знаменатель, числитель или положение относительно половины.', "Avval juftlikning umumiy belgisini toping: maxraj, surat yoki yarimga nisbatan o'rin.", "First identify the shared feature in each pair: equal denominators, equal numerators, or positions relative to one half.")],
    secondHint: b('В ошибочной паре одинаковые числа выделены одним цветом.', "Xato juftlikdagi bir xil sonlar bitta rang bilan yoritildi.", "The matching numbers in the incorrect pair are highlighted in the same colour."),
    thirdHint: b('Для 2/7 и 5/7 удобнее сравнить числители, потому что знаменатели равны.', "2/7 va 5/7 uchun maxrajlar teng bo'lgani sabab suratlarni taqqoslash qulay.", "For 2/7 and 5/7, it is useful to compare the numerators because the denominators are equal."),
    correctText: b('Верно. Для каждой пары выбрана подходящая стратегия.', "To'g'ri. Har bir juftlik uchun mos strategiya tanlandi.", "Correct. A suitable strategy has been chosen for each pair."),
    rule: b('Стратегию выбирают по структуре сравниваемых дробей.', "Strategiya taqqoslanayotgan kasrlarning tuzilishiga qarab tanlanadi.", "Choose a strategy based on the structure of the fractions being compared."),
  },
  {
    id: '04', level: 'yellow', kind: 'sign', skillTag: 'number-line-comparison',
    visual: { type: 'models', items: [{ shape: 'line', total: 8, filled: 3, label: '3/8' }, { shape: 'line', total: 8, filled: 5, label: '5/8' }] },
    setup: b('На одном числовом луче отмечены точки 3/8 и 5/8.', "Bitta son nurida 3/8 va 5/8 nuqtalari belgilangan.", "The points 3/8 and 5/8 are marked on the same number line."),
    prompt: b('Поставьте знак: 3/8 □ 5/8.', "Belgini qo'ying: 3/8 □ 5/8.", "Choose the sign: 3/8 □ 5/8."),
    options: [
      option('correct', '<', '<', "<", true),
      option('equal', '=', '=', "=", false, 'Точки находятся в разных местах числового луча.', "Nuqtalar son nurining turli joylarida turibdi.", "The points are at different positions on the number line."),
      option('greater', '>', '>', ">", false, 'Точка 3/8 расположена левее точки 5/8.', "3/8 nuqta 5/8 nuqtadan chapda joylashgan.", "The point 3/8 is to the left of 5/8."),
    ],
    secondHint: b('На луче меньшее число расположено левее.', "Son nurida kichik son chaproqda joylashadi.", "On a number line, the smaller number is to the left."),
    thirdHint: b('Точка 2/6 левее точки 4/6, поэтому 2/6 меньше 4/6.', "2/6 nuqta 4/6 dan chapda, shuning uchun 2/6 kichik.", "The point 2/6 is to the left of 4/6, so 2/6 is less than 4/6."),
    correctText: b('Верно. Точка 3/8 находится левее 5/8.', "To'g'ri. 3/8 nuqta 5/8 dan chapda.", "Correct. The point 3/8 is to the left of 5/8."),
    rule: b('На числовом луче правее расположено большее число.', "Son nurida o'ngroqda joylashgan son kattaroq bo'ladi.", "On a number line, the number farther to the right is greater."),
  },
  {
    id: '05', level: 'yellow', kind: 'card', skillTag: 'missing-numerator',
    visual: { type: 'formula', text: '□/10 > 6/10' },
    setup: b('Знаменатели равны десяти. Нужно выбрать числитель.', "Maxrajlar o'nga teng. Suratni tanlash kerak.", "The denominators are both ten. Choose the numerator."),
    prompt: b('Какое число можно поставить в пустое место?', "Bo'sh joyga qaysi sonni qo'yish mumkin?", "Which number can go in the empty box?"),
    options: [
      option('four', '4', '4', "4", false, 'Четыре меньше шести, поэтому получится дробь меньше 6/10.', "To'rt oltidan kichik, shuning uchun hosil bo'lgan kasr 6/10 dan kichik bo'ladi.", "Four is less than six, so the resulting fraction would be less than 6/10."),
      option('six', '6', '6', "6", false, 'Одинаковые числители дали бы равные дроби.', "Bir xil suratlar teng kasrlarni beradi.", "Equal numerators would give equal fractions."),
      option('correct', '8', '8', "8", true),
    ],
    secondHint: b('При равных знаменателях знак определяется сравнением числителей.', "Maxrajlar teng bo'lsa, belgi suratlarni taqqoslash orqali aniqlanadi.", "When the denominators are equal, compare the numerators to choose the sign."),
    thirdHint: b('Чтобы □/7 было больше 3/7, можно выбрать числитель 5.', "□/7 kasri 3/7 dan katta bo'lishi uchun surat 5 ni tanlash mumkin.", "For □/7 to be greater than 3/7, you could choose the numerator 5."),
    correctText: b('Верно. 8 больше 6, поэтому 8/10 больше 6/10.', "To'g'ri. 8 soni 6 dan katta, shuning uchun 8/10 kasri 6/10 dan katta.", "Correct. 8 is greater than 6, so 8/10 is greater than 6/10."),
    rule: b('При равных знаменателях большему числителю соответствует большая дробь.', "Maxrajlar teng bo'lsa, katta surat katta kasrga mos keladi.", "When the denominators are equal, the greater numerator gives the greater fraction."),
  },
  {
    id: '06', level: 'yellow', kind: 'mc', skillTag: 'whole-size',
    visual: { type: 'tanks', items: [{ total: 8, filled: 5, label: 'A · 5/8' }, { total: 8, filled: 3, label: 'B · 3/8' }] },
    setup: b('Два бака имеют одинаковый объём и разделены на восемь равных частей.', "Ikki bakning hajmi bir xil va ular sakkizta teng qismga bo'lingan.", "The two tanks have the same capacity and are divided into eight equal parts."),
    prompt: b('В каком баке воды больше?', "Qaysi bakda suv ko'proq?", "Which tank contains more water?"),
    options: [
      option('correct', 'В баке A', 'A bakda', "In tank A", true),
      option('b', 'В баке B', 'B bakda', "In tank B", false, 'В баке B заполнено только три восьмых, а в A — пять восьмых.', "B bakda faqat 3/8, A bakda esa 5/8 qism to'lgan.", "Tank B is only three eighths full, while tank A is five eighths full."),
      option('equal', 'Поровну', 'Teng', "The same amount", false, 'Баки одинаковы, но число заполненных восьмых частей различается.', "Baklar bir xil, ammo to'lgan sakkizdan bir ulushlar soni turlicha.", "The tanks are identical, but different numbers of eighths are filled."),
      option('unknown', 'Определить нельзя', "Aniqlab bo'lmaydi", "It cannot be determined", false, 'Размеры целых и деления одинаковы, поэтому сравнение возможно.', "Butunlarning o'lchami va bo'linmalari bir xil, shuning uchun taqqoslash mumkin.", "The wholes and their divisions are identical, so they can be compared."),
    ],
    secondHint: b('Подсвечены пять заполненных частей в A и три в B.', "A dagi beshta va B dagi uchta to'lgan qism yoritildi.", "The five filled parts in A and the three filled parts in B are highlighted."),
    thirdHint: b('В одинаковых сосудах 6/10 больше 4/10.', "Bir xil idishlarda 6/10 kasri 4/10 dan katta.", "In identical containers, 6/10 is greater than 4/10."),
    correctText: b('Верно. Бак A заполнен больше: 5/8 больше 3/8.', "To'g'ri. A bak ko'proq to'lgan: 5/8 kasri 3/8 dan katta.", "Correct. Tank A is fuller: 5/8 is greater than 3/8."),
    rule: b('Количество по моделям сравнивают только при одинаковом целом.', "Modeldagi miqdorlar faqat butunlar bir xil bo'lganda taqqoslanadi.", "Use models to compare amounts only when the wholes are identical."),
  },
  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'fraction-ordering',
    visual: { type: 'models', items: [{ shape: 'bar', total: 9, filled: 1, label: '1/9' }, { shape: 'bar', total: 9, filled: 7, label: '7/9' }, { shape: 'bar', total: 9, filled: 4, label: '4/9' }] },
    setup: b('У всех трёх дробей одинаковый знаменатель 9.', "Uchala kasrning maxraji bir xil: 9.", "All three fractions have the same denominator, 9."),
    prompt: b('Расположите дроби по возрастанию.', "Kasrlarni o'sish tartibida joylashtiring.", "Put the fractions in ascending order."),
    steps: [{ id: 's1', label: b('Наименьшая', 'Eng kichik', "Smallest") }, { id: 's2', label: b('Средняя', "O'rtadagi", "Middle") }, { id: 's3', label: b('Наибольшая', 'Eng katta', "Greatest") }],
    cards: [
      { id: 'one', text: b('1/9', '1/9', "1/9"), order: 0 }, { id: 'four', text: b('4/9', '4/9', "4/9"), order: 1 }, { id: 'seven', text: b('7/9', '7/9', "7/9"), order: 2 },
    ],
    wrong: [b('При равных знаменателях расположите числители от меньшего к большему.', "Maxrajlar teng bo'lsa, suratlarni kichigidan kattasiga joylashtiring.", "When the denominators are equal, order the numerators from smallest to greatest.")],
    secondHint: b('Числители 1, 4 и 7 выделены. Знаменатели не меняются.', "1, 4 va 7 suratlari yoritildi. Maxrajlar o'zgarmaydi.", "The numerators 1, 4 and 7 are highlighted. The denominators do not change."),
    thirdHint: b('Дроби 2/8, 5/8, 7/8 идут в том же порядке, что числа 2, 5, 7.', "2/8, 5/8, 7/8 kasrlari 2, 5, 7 sonlari kabi tartiblanadi.", "The fractions 2/8, 5/8 and 7/8 are in the same order as the numbers 2, 5 and 7."),
    correctText: b('Верно. 1/9 меньше 4/9, а 4/9 меньше 7/9.', "To'g'ri. 1/9 kasri 4/9 dan, 4/9 esa 7/9 dan kichik.", "Correct. 1/9 is less than 4/9, and 4/9 is less than 7/9."),
    rule: b('При равных знаменателях порядок дробей совпадает с порядком числителей.', "Maxrajlar teng bo'lsa, kasrlar tartibi suratlar tartibiga mos keladi.", "When the denominators are equal, the order of the fractions matches the order of the numerators."),
  },
  {
    id: '08', level: 'red', kind: 'sign', skillTag: 'half-benchmark',
    visual: { type: 'models', items: [{ shape: 'bar', total: 9, filled: 5, label: '5/9' }, { shape: 'bar', total: 7, filled: 3, label: '3/7' }] },
    setup: b('Одна дробь больше половины, другая меньше половины.', "Kasrlardan biri yarimdan katta, ikkinchisi yarimdan kichik.", "One fraction is greater than one half and the other is less than one half."),
    prompt: b('Поставьте знак: 5/9 □ 3/7.', "Belgini qo'ying: 5/9 □ 3/7.", "Choose the sign: 5/9 □ 3/7."),
    options: [
      option('less', '<', '<', "<", false, '5/9 проходит за половину, а 3/7 до половины не доходит.', "5/9 yarimdan o'tadi, 3/7 esa yarimgacha yetmaydi.", "5/9 goes beyond one half, while 3/7 does not reach one half."),
      option('equal', '=', '=', "=", false, 'Дроби расположены по разные стороны от половины.', "Kasrlar yarimning turli tomonlarida joylashgan.", "The fractions are on opposite sides of one half."),
      option('correct', '>', '>', ">", true),
    ],
    secondHint: b('На обеих моделях выделена линия половины.', "Har ikkala modelda yarim chizig'i yoritildi.", "The halfway line is highlighted in both models."),
    thirdHint: b('Например, 4/7 больше 1/2, а 3/8 меньше 1/2, поэтому 4/7 больше 3/8.', "Masalan, 4/7 kasri 1/2 dan katta, 3/8 esa 1/2 dan kichik, shuning uchun 4/7 katta.", "For example, 4/7 is greater than 1/2 and 3/8 is less than 1/2, so 4/7 is greater than 3/8."),
    correctText: b('Верно. 5/9 больше половины, поэтому эта дробь больше 3/7.', "To'g'ri. 5/9 yarimdan katta, shuning uchun bu kasr 3/7 dan katta.", "Correct. 5/9 is greater than one half, so it is greater than 3/7."),
    rule: b('Половина помогает сравнить дроби с разными числителями и знаменателями.', "Yarim suratlari va maxrajlari turlicha bo'lgan kasrlarni taqqoslashga yordam beradi.", "One half helps us compare fractions with different numerators and denominators."),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'same-numerator',
    visual: { type: 'formula', text: '3/4 < 3/10', error: true },
    setup: b('Получено неверное сравнение: 3/4 < 3/10, потому что 4 < 10.', "3/4 < 3/10, chunki 4 < 10 degan noto'g'ri taqqoslash berilgan.", "The incorrect comparison 3/4 < 3/10 was made because 4 < 10."),
    prompt: b('В чём ошибка рассуждения?', "Fikrlashdagi xato nimada?", "What is the error in the reasoning?"),
    options: [
      option('correct', 'Знаменатели сравнили как обычные числа', 'Maxrajlar oddiy sonlardek taqqoslangan', "The denominators were compared as ordinary numbers", true),
      option('numerators', 'Числители не равны', 'Suratlar teng emas', "The numerators are not equal", false, 'Оба числителя равны трём.', "Har ikkala surat uchga teng.", "Both numerators are three."),
      option('whole', 'Целые имеют разный размер', "Butunlar o'lchami turlicha", "The wholes are different sizes", false, 'В задаче сравниваются доли одинакового целого.', "Masalada bir xil butunning ulushlari taqqoslanmoqda.", "The question compares parts of the same whole."),
      option('sign', 'Знак меньше всегда неверен', "Kichik belgisi doim noto'g'ri", "The less-than sign is always incorrect", false, 'Знак меньше может быть верным в других сравнениях. Ошибка именно в размере долей.', "Kichik belgisi boshqa taqqoslashlarda to'g'ri bo'lishi mumkin. Xato aynan ulushlar o'lchamida.", "A less-than sign can be correct in other comparisons. The error here is about the size of the parts."),
    ],
    secondHint: b('Показаны одна четвёртая и одна десятая: четверть крупнее.', "1/4 va 1/10 ko'rsatildi: to'rtdan bir ulush kattaroq.", "One quarter and one tenth are shown: a quarter is larger."),
    thirdHint: b('При одинаковом числителе 2/5 больше 2/9.', "Suratlar teng bo'lsa, 2/5 kasri 2/9 dan katta.", "When the numerators are equal, 2/5 is greater than 2/9."),
    correctText: b('Верно. При равных числителях 3/4 больше 3/10.', "To'g'ri. Suratlar teng bo'lganda 3/4 kasri 3/10 dan katta.", "Correct. When the numerators are equal, 3/4 is greater than 3/10."),
    rule: b('Больший знаменатель означает меньшую долю одного и того же целого.', "Katta maxraj ayni butunning kichikroq ulushini bildiradi.", "A greater denominator means a smaller part of the same whole."),
  },
  {
    id: '10', level: 'red', kind: 'match', skillTag: 'comparison-strategy',
    visual: { type: 'models', items: [
      { shape: 'bar', total: 13, filled: 2, label: '2/13 · 10/13' },
      { shape: 'bar', total: 5, filled: 4, label: '4/5 · 4/9' },
      { shape: 'bar', total: 12, filled: 7, label: '7/12 · 4/9' },
    ] },
    setup: b('Нужно не только поставить знак, но и выбрать короткое доказательство.', "Faqat belgi qo'yish emas, qisqa isbotni ham tanlash kerak.", "You need to choose not only the sign but also a short justification."),
    prompt: b('Соедините верное сравнение с его обоснованием.', "To'g'ri taqqoslashni uning asosi bilan moslashtiring.", "Match each correct comparison to its justification."),
    pairs: [
      { id: 'den', left: b('2/13 < 10/13', '2/13 < 10/13', "2/13 < 10/13"), correctRight: 'numerators' },
      { id: 'num', left: b('4/5 > 4/9', '4/5 > 4/9', "4/5 > 4/9"), correctRight: 'parts' },
      { id: 'half', left: b('7/12 > 4/9', '7/12 > 4/9', "7/12 > 4/9"), correctRight: 'benchmark' },
    ],
    right: [
      { id: 'numerators', text: b('Равные знаменатели: сравнить числители', 'Teng maxrajlar: suratlarni taqqoslash', "Equal denominators: compare the numerators") },
      { id: 'parts', text: b('Равные числители: сравнить размер доли', "Teng suratlar: ulush o'lchamini taqqoslash", "Equal numerators: compare the size of each part") },
      { id: 'benchmark', text: b('Дроби по разные стороны от 1/2', 'Kasrlar 1/2 ning turli tomonlarida', "The fractions are on opposite sides of 1/2") },
    ],
    wrong: [b('Проверьте, какой признак действительно общий у каждой пары.', "Har bir juftlik uchun qaysi belgi haqiqatan umumiy ekanini tekshiring.", "Check which feature each pair really has in common.")],
    secondHint: b('Равные числители или знаменатели выделены; в третьей паре показана половина.', "Teng surat yoki maxrajlar yoritildi; uchinchi juftlikda yarim ko'rsatildi.", "The equal numerators or denominators are highlighted; one half is shown for the third pair."),
    thirdHint: b('Пара 3/8 и 6/8 требует сравнения числителей, потому что знаменатели равны.', "3/8 va 6/8 juftligida maxrajlar teng bo'lgani uchun suratlar taqqoslanadi.", "The pair 3/8 and 6/8 requires comparing the numerators because the denominators are equal."),
    correctText: b('Верно. Каждое сравнение подтверждено подходящей стратегией.', "To'g'ri. Har bir taqqoslash mos strategiya bilan isbotlandi.", "Correct. Each comparison is supported by a suitable strategy."),
    rule: b('Хорошее сравнение содержит знак и объяснение выбора этого знака.', "Yaxshi taqqoslash belgi va bu belgi nega tanlanganining izohini o'z ichiga oladi.", "A good comparison includes a sign and an explanation of why that sign was chosen."),
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

function FractionModel({ model }) {
  if (model.shape === 'circle') return <div className="p4-model-card"><div className="p4-circle" style={{ background: `conic-gradient(${T.accent} 0 ${(model.filled / model.total) * 100}%, ${T.cyanSoft} ${(model.filled / model.total) * 100}% 100%)` }}>{Array.from({ length: model.total }, (_, i) => <span aria-hidden="true" key={i} style={{ transform: `rotate(${(i * 360) / model.total}deg)` }}/>)}</div><b>{model.label}</b></div>;
  if (model.shape === 'line') return <div className="p4-model-card"><div className="p4-number-line">{Array.from({ length: model.total + 1 }, (_, i) => <span key={i} className={i === model.filled ? 'is-point' : ''} />)}</div><b>{model.label}</b></div>;
  return <div className="p4-model-card"><Cells total={model.total} filled={model.filled} second={model.second} removed={model.removed} unequal={model.unequal} layout={model.shape}/><b>{model.label}</b></div>;
}

function Visual({ task, hintLevel, lang }) {
  const visual = task.visual;
  if (!visual) return null;
  if (visual.type === 'scale') return <div className="p4-visual"><ScaleModel visual={visual} hint={hintLevel >= 2}/></div>;
  if (visual.type === 'scale-set') return <div className="p4-visual p4-model-grid">{visual.items.map((item) => <div className="p4-model-card" key={item.label}><b>{item.label}</b><ScaleModel visual={item}/></div>)}</div>;
  if (visual.type === 'sequence') return <div className="p4-visual p4-sequence">{visual.values.map((value, i) => <span key={`${value}-${i}`}>{value}</span>)}</div>;
  if (visual.type === 'bar') return <div className="p4-visual"><Cells {...visual}/>{visual.label && <b className="p4-caption">{visual.label}</b>}</div>;
  if (visual.type === 'models') return <div className="p4-visual p4-model-grid">{visual.items.map((model, i) => <FractionModel model={model} key={`${model.label}-${i}`}/>)}</div>;
  if (visual.type === 'formula') return <div className="p4-visual p4-formula"><b className={visual.error ? 'is-error' : ''}>{visual.text}</b>{visual.subtext && <span>{tx(visual.subtext, lang)}</span>}</div>;
  if (visual.type === 'tanks') return <div className="p4-visual p4-model-grid">{visual.items.map((model) => <FractionModel model={{ ...model, shape: 'bar' }} key={model.label}/>)}</div>;
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

function Task({ task, lang, isLast, onSolved }) {
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
  const rightCards = useMemo(() => shuffle(task.right || []), [task.right]);
  const orderCards = useMemo(() => shuffle(task.cards || []), [task.cards]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'mc' || task.kind === 'sign' || task.kind === 'card' || task.kind === 'ticks') return picked !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed !== '';
    if (task.kind === 'match') return Object.keys(pairs).length === task.pairs.length;
    if (task.kind === 'order') return Object.keys(placed).length === task.steps.length;
    if (task.kind === 'shade') return selected.length > 0;
    if (task.kind === 'fracbuild') return fraction.n !== null && fraction.d !== null;
    return false;
  })();
  const answerCorrect = () => {
    if (task.kind === 'mc' || task.kind === 'sign' || task.kind === 'card') return Boolean(task.options[picked]?.correct);
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
    if (answerCorrect()) setSolved(true);
  };
  const hintLevel = checked && !solved ? attempts : 0;
  const wrongText = adaptive(task, ['mc', 'sign', 'card'].includes(task.kind) ? task.options[picked] : null, attempts);
  const setAnswer = (setter, value) => { checkingRef.current = false; setter(value); setChecked(false); };
  const toggleSelected = (index) => setAnswer(setSelected, selected.includes(index) ? selected.filter((value) => value !== index) : [...selected, index]);

  return <section className={`p4-task ${hintLevel >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
    <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
    <p className="p4-setup">{tx(task.setup, lang)}</p>
    {task.kind === 'ticks' ? <div className="p4-visual"><ScaleModel visual={task.visual} interactive picked={picked} onPick={(value) => setAnswer(setPicked, value)} hint={hintLevel >= 2} disabled={solved}/></div> :
      task.kind === 'shade' ? <div className="p4-visual"><Cells total={task.visual.total} filled={task.visual.filled} second={task.visual.second} removed={task.visual.removed} selected={selected} allowed={task.allowed} onToggle={toggleSelected} selectionMode={task.selectionMode} resolved={solved} disabled={solved}/></div> : <Visual task={task} hintLevel={hintLevel} lang={lang}/>}
    <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

    {['mc', 'sign', 'card'].includes(task.kind) && <div className={`p4-options ${task.kind === 'sign' ? 'is-sign' : ''}`}>{task.options.map((item, index) => <button type="button" key={item.id} disabled={solved} aria-pressed={picked === index} className={`p4-option ${picked === index ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} onClick={() => setAnswer(setPicked, index)}><span className="p4-letter">{'ABCD'[index]}</span><span>{tx(item.text, lang)}</span></button>)}</div>}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang}/>}
    {task.kind === 'match' && <div className="p4-match"><p className="p4-note">{tx(UI.matchHint, lang)}</p><div className="p4-match-cols"><div className="p4-match-col">{task.pairs.map((pair) => <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id} className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`} onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}><span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b>{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}</button>)}</div><div className="p4-match-col">{rightCards.map((right) => { const used = Object.values(pairs).includes(right.id); return <button type="button" key={right.id} disabled={solved || activeLeft === null || used} className={`p4-match-item ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPairs((old) => ({ ...old, [activeLeft]: right.id })); setActiveLeft(null); setChecked(false); }}>{tx(right.text, lang)}</button>; })}</div></div></div>}
    {task.kind === 'order' && <div className="p4-order"><p className="p4-note">{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button type="button" key={step.id} disabled={solved} aria-pressed={activeStep === step.id} className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''}`} onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button type="button" key={card.id} disabled={solved || activeStep === null || used} className={`p4-card ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPlaced((old) => ({ ...old, [activeStep]: card.id })); setActiveStep(null); setChecked(false); }}>{tx(card.text, lang)}</button>; })}</div></div>}
    {task.kind === 'fracbuild' && <div className="p4-frac-builder"><div><span>{tx(UI.numerator, lang)}</span>{task.nChoices.map((value) => <button type="button" key={value} disabled={solved} className={fraction.n === value ? 'is-active' : ''} onClick={() => { checkingRef.current = false; setFraction((old) => ({ ...old, n: value })); setChecked(false); }}>{value}</button>)}</div><hr/><div><span>{tx(UI.denominator, lang)}</span>{task.dChoices.map((value) => <button type="button" key={value} disabled={solved} className={fraction.d === value ? 'is-active' : ''} onClick={() => { checkingRef.current = false; setFraction((old) => ({ ...old, d: value })); setChecked(false); }}>{value}</button>)}</div></div>}

    {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={solved ? task.correctText : wrongText} rule={task.rule} lang={lang}/>}
    <div className="p4-actions">{!checked && !solved && <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>}{checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={resetResponse}>{tx(UI.retry, lang)}</button>}{solved && <button type="button" className="p4-btn p4-btn-ready" disabled={advancing} onClick={() => { if (advancedRef.current) return; advancedRef.current = true; checkingRef.current = false; setAdvancing(true); onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, setup: task.setup, prompt: task.prompt, studentAnswer: answerSnapshot(), correctAnswer: correctSnapshot(), answerChoices: task.options?.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) })) ?? task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) }); }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}</div>
  </section>;
}

export default function Grade4Dars19Practice({ lang: langProp, onFinished }) {
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
.p4-options.is-sign{grid-template-columns:repeat(3,minmax(0,1fr))}.p4-options.is-sign .p4-option{justify-content:center;text-align:center;font:800 clamp(20px,4vw,28px) 'JetBrains Mono',monospace}
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
`;
