import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { canUseGrade4TheoryContinue } from './theoryNavigation.js';

// 4-SINF · 22-DARS · Sonning kasr qismini topish
// Approved frame vector: 3,4,4,4,4,4,4,5,2,2,2,2,2,3,5.

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const stableChoiceOffset = (lessonId, length) => {
  let hash = 2166136261;
  for (const char of `${lessonId}:${length}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return length > 0 ? (hash >>> 0) % length : 0;
};

const buildOptionOrder = (length, correctIndex, lessonId, ordinal = 0) => {
  const natural = Array.from({ length: Math.max(0, length) }, (_, index) => index);
  if (length < 2 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= length) return natural;
  const target = (stableChoiceOffset(lessonId, length) + ordinal * (length - 1)) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
};

const TOTAL_SCREENS = 15;
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const LESSON_META = {
  lessonId: 'frac-4-22-v1',
  slug: 'dars22-sonning-kasr-qismini-topish',
  lessonTitle: { uz: "22-dars. Sonning kasr qismini topish", ru: 'Урок 22. Нахождение дробной части числа', en: 'Lesson 22. Finding a fraction of a number' },
  skillTags: ['fraction_of_number', 'unit_fraction', 'equal_groups', 'fraction_model', 'inverse_check'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'StoryChoice', mechanic: 'StoryChoice', goal: 'Predict how to find a fraction of a quantity', misconceptions: ['multiply before partitioning'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'model', subtype: 'equal-group-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Partition a quantity into equal denominator groups', misconceptions: ['unequal groups'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'one-part-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Find the value of one equal part', misconceptions: ['numerator used for division'], active: true, scored: false, scope: null },
  { id: 's3', type: 'discovery', subtype: 'selected-parts-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Combine the required number of equal parts', misconceptions: ['denominator used twice'], active: true, scored: false, scope: null },
  { id: 's4', type: 'discovery', subtype: 'operation-sequence', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Discover divide-then-multiply order', misconceptions: ['multiply then divide without meaning'], active: true, scored: false, scope: null },
  { id: 's5', type: 'rule', subtype: 'fraction-of-number-rule', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Formulate the fraction-of-a-number rule', misconceptions: ['swapped numerator and denominator'], active: true, scored: false, scope: null },
  { id: 's6', type: 'strategy', subtype: 'visual-check-strategy', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Check the calculation against grouped objects', misconceptions: ['result exceeds whole'], active: true, scored: false, scope: null },
  { id: 's7', type: 'consolidation', subtype: 'formula-transfer', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Transfer the strategy to a new quantity', misconceptions: ['wrong operation order'], active: true, scored: false, scope: null },
  { id: 's8', type: 'test', subtype: 'model-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Find a fraction of a represented quantity', misconceptions: ['wrong group count'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's9', type: 'test', subtype: 'numeric-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Apply divide then multiply', misconceptions: ['multiply first'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'strategy', subtype: 'operation-choice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Choose a justified solution strategy', misconceptions: ['unrelated operation'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's11', type: 'test', subtype: 'whole-fraction-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Recognise a whole fraction of a number', misconceptions: ['whole fraction changes value'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's12', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepairChoice', mechanic: 'ErrorRepairChoice', goal: "Repair Bit's reversed-operation error", misconceptions: ['dividing by numerator'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'case', subtype: 'life-context-transfer', template: 'CaseChoice', mechanic: 'CaseChoice', goal: 'Find a fraction of objects in a life context', misconceptions: ['whole misidentified'], active: true, scored: true, scoreUnits: 1, scope: 'final' },
  { id: 's14', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', mechanic: 'ReflectionClaim', goal: 'Reflect on the strategy and bridge forward', misconceptions: ['partial result check'], active: true, scored: false, scope: null },
];

const bi = (uz, ru, en) => ({ uz, ru, en });

const CONTENT = {
  s0: {
    eyebrow: bi("Lumo taqsimlash markazi", "Распределительный центр Лумо", 'Lumo distribution centre'),
    title: bi("24 ta modulning 5/6 qismi", "5/6 от 24 модулей", '5/6 of 24 modules'),
    question: bi("Nechta modul stansiyalarga yo'naltiriladi?", "Сколько модулей направят на станции?", 'How many modules will be sent to the stations?'),
    frames: [
      bi("Jami: 24 ta modul", "Всего: 24 модуля", 'Total: 24 modules'),
      bi("6 ta teng guruh", "6 равных групп", '6 equal groups'),
      bi("5 ta guruh kerak: ?", "Нужны 5 групп: ?", '5 groups are needed: ?'),
    ],
    options: [bi("20 ta", "20", '20'), bi("24 ta", "24", '24'), bi("4 ta", "4", '4')],
    neutral: bi("Taxmin saqlandi. Endi teng guruhlar modelini tekshiramiz.", "Предположение сохранено. Теперь проверим модель равных групп.", 'Your prediction has been recorded. Now we will check the equal-groups model.'),
    audio: { intro: {
      uz: ["Markazga yigirma to'rt energiya moduli keldi.", "Ularni oltita teng guruhga ajratish kerak.", "Stansiyalar uchun shu guruhlarning beshtasi kerak. Nechta modul yo'naltirilishini taxmin qiling."],
      ru: ["В центр поступили двадцать четыре энергетических модуля.", "Их нужно разделить на шесть равных групп.", "Для станций нужны пять таких групп. Предположи, сколько модулей направят."],
      en: ['Twenty-four energy modules arrived at the centre.', 'They need to be divided into six equal groups.', 'The stations need five of those groups. Predict how many modules will be sent.'],
    } },
  },
  s1: {
    eyebrow: bi("Kasrning ko'rsatmasi", "Подсказка дроби", 'What the fraction tells us'),
    title: bi("5/6 nimani bildiradi?", "Что означает 5/6?", 'What does 5/6 mean?'),
    frames: [
      bi("Butun = 24", "Целое = 24", 'Whole = 24'),
      bi("Maxraj 6 → 6 teng guruh", "Знаменатель 6 → 6 равных групп", 'Denominator 6 → 6 equal groups'),
      bi("Surat 5 → 5 guruh olinadi", "Числитель 5 → берём 5 групп", 'Numerator 5 → take 5 groups'),
      bi("5/6 = 6 teng guruhdan 5 tasi", "5/6 = 5 из 6 равных групп", '5/6 = 5 of 6 equal groups'),
    ],
    audio: {
      uz: ["Yigirma to'rt modul butun miqdor.", "Maxrajdagi olti butunni oltita teng guruhga ajratishni ko'rsatadi.", "Suratdagi besh shu guruhlarning beshtasini olishni ko'rsatadi.", "Demak, oltidan besh oltita teng guruhdan beshtasi."],
      ru: ["Двадцать четыре модуля составляют целое количество.", "Шесть в знаменателе показывает деление целого на шесть равных групп.", "Пять в числителе показывает, что нужно взять пять групп.", "Значит, пять шестых означают пять из шести равных групп."],
      en: ['Twenty-four modules make up the whole amount.', 'The six in the denominator means divide the whole into six equal groups.', 'The five in the numerator means take five of those groups.', 'So five sixths means five of six equal groups.'],
    },
  },
  s2: {
    eyebrow: bi("Avval bitta ulush", "Сначала одна доля", 'First find one part'),
    title: bi("24 ning 1/6 qismini topamiz", "Найдём 1/6 от 24", 'Find 1/6 of 24'),
    frames: [
      bi("24 ta modul", "24 модуля", '24 modules'),
      bi("24 ÷ 6", "24 ÷ 6", '24 ÷ 6'),
      bi("Har guruhda 4 ta", "В каждой группе 4", '4 in each group'),
      bi("24 ning 1/6 qismi = 4", "1/6 от 24 = 4", '1/6 of 24 = 4'),
    ],
    audio: {
      uz: ["Avval bitta teng guruhning qiymatini topamiz.", "Yigirma to'rtni oltiga bo'lamiz.", "Har bir guruhda to'rtta modul bo'ladi.", "Shuning uchun yigirma to'rtning oltidan bir qismi to'rtga teng."],
      ru: ["Сначала найдём значение одной равной группы.", "Делим двадцать четыре на шесть.", "В каждой группе получается четыре модуля.", "Поэтому одна шестая от двадцати четырёх равна четырём."],
      en: ['First, find the value of one equal group.', 'Divide twenty-four by six.', 'Each group contains four modules.', 'Therefore, one sixth of twenty-four equals four.'],
    },
  },
  s3: {
    eyebrow: bi("Endi beshta ulush", "Теперь пять долей", 'Now find five parts'),
    title: bi("5 ta guruhni birlashtiramiz", "Объединим 5 групп", 'Combine 5 groups'),
    frames: [
      bi("1 guruh = 4 ta", "1 группа = 4", '1 group = 4'),
      bi("5 ta guruh", "5 групп", '5 groups'),
      bi("4 × 5 = 20", "4 × 5 = 20", '4 × 5 = 20'),
      bi("24 ning 5/6 qismi = 20", "5/6 от 24 = 20", '5/6 of 24 = 20'),
    ],
    audio: {
      uz: ["Bitta guruhning qiymati to'rtga teng.", "Kasrning surati besh, demak beshta shunday guruh olinadi.", "To'rtni beshga ko'paytirsak, yigirma chiqadi.", "Yigirma to'rtning oltidan besh qismi yigirmaga teng."],
      ru: ["Значение одной группы равно четырём.", "Числитель равен пяти, значит берём пять таких групп.", "Четыре умножаем на пять и получаем двадцать.", "Пять шестых от двадцати четырёх равны двадцати."],
      en: ['One group has a value of four.', 'The numerator is five, so take five such groups.', 'Multiply four by five to get twenty.', 'Five sixths of twenty-four equals twenty.'],
    },
  },
  s4: {
    eyebrow: bi("Umumiy qoida", "Общее правило", 'General rule'),
    title: bi("N ning a/b qismini topish", "Как найти a/b от числа N", 'How to find a/b of N'),
    frames: [
      bi("b → teng guruhlar soni", "b → число равных групп", 'b → number of equal groups'),
      bi("N ÷ b → 1/b qism", "N ÷ b → доля 1/b", 'N ÷ b → the 1/b part'),
      bi("a → olinadigan guruhlar", "a → сколько групп берём", 'a → number of groups to take'),
      bi("a/b qism = (N ÷ b) × a", "a/b от N = (N ÷ b) × a", 'a/b of N = (N ÷ b) × a'),
    ],
    audio: {
      uz: ["Maxraj butunni nechta teng guruhga bo'lishni ko'rsatadi.", "Butun sonni maxrajga bo'lib, bitta ulush qiymatini topamiz.", "Surat nechta shunday ulush kerakligini ko'rsatadi.", "Tartib shunday: avval maxrajga bo'lamiz, keyin suratga ko'paytiramiz."],
      ru: ["Знаменатель показывает, на сколько равных групп делим целое.", "Делим целое на знаменатель и находим значение одной доли.", "Числитель показывает, сколько таких долей нужно взять.", "Порядок такой: сначала делим на знаменатель, затем умножаем на числитель."],
      en: ['The denominator tells us how many equal groups to divide the whole into.', 'Divide the whole by the denominator to find the value of one part.', 'The numerator tells us how many of those parts to take.', 'The order is: first divide by the denominator, then multiply by the numerator.'],
    },
  },
  s5: {
    eyebrow: bi("Boshqa sonda sinov", "Проверка на другом числе", 'Try another number'),
    title: bi("18 ning 2/3 qismi", "2/3 от 18", '2/3 of 18'),
    frames: [
      bi("Butun: 18", "Целое: 18", 'Whole: 18'),
      bi("18 ÷ 3 = 6", "18 ÷ 3 = 6", '18 ÷ 3 = 6'),
      bi("6 × 2 = 12", "6 × 2 = 12", '6 × 2 = 12'),
      bi("18 ning 2/3 qismi = 12", "2/3 от 18 = 12", '2/3 of 18 = 12'),
    ],
    audio: {
      uz: ["Endi butun miqdor o'n sakkiz bo'lsin.", "Uchta teng guruhning har birida oltitadan bo'ladi.", "Shunday guruhlarning ikkitasida o'n ikkita bor.", "Demak, o'n sakkizning uchdan ikki qismi o'n ikkiga teng."],
      ru: ["Теперь пусть целое количество равно восемнадцати.", "В каждой из трёх равных групп будет по шесть.", "В двух таких группах будет двенадцать.", "Значит, две трети от восемнадцати равны двенадцати."],
      en: ['Now let the whole amount be eighteen.', 'Each of the three equal groups contains six.', 'Two such groups contain twelve.', 'Therefore, two thirds of eighteen equals twelve.'],
    },
  },
  s6: {
    eyebrow: bi("Javobni tekshiramiz", "Проверим ответ", 'Check the answer'),
    title: bi("Qism va qolgan qism butunni tiklaydi", "Часть и остаток восстанавливают целое", 'The part and the remainder rebuild the whole'),
    frames: [
      bi("Topilgan 2/3 qism = 12", "Найденная часть 2/3 = 12", 'The 2/3 part found = 12'),
      bi("Qolgan 1/3 qism = 6", "Оставшаяся часть 1/3 = 6", 'Remaining 1/3 part = 6'),
      bi("12 + 6 = 18", "12 + 6 = 18", '12 + 6 = 18'),
      bi("Butun tiklandi ✓", "Целое восстановлено ✓", 'Whole rebuilt ✓'),
    ],
    audio: {
      uz: ["Topilgan uchdan ikki qism o'n ikkiga teng.", "Modelda yana uchdan bir qism, ya'ni oltita qoladi.", "O'n ikki bilan oltini qo'shsak, butun o'n sakkiz tiklanadi.", "Demak, javob modelga mos va butundan katta emas."],
      ru: ["Найденные две трети равны двенадцати.", "На модели остаётся ещё одна треть, то есть шесть.", "Двенадцать и шесть снова дают целое восемнадцать.", "Значит, ответ соответствует модели и не больше целого."],
      en: ['The two thirds we found equal twelve.', 'One third remains in the model, which is six.', 'Twelve plus six gives the whole, eighteen, again.', 'So the answer matches the model and is not greater than the whole.'],
    },
  },
  s7: {
    eyebrow: bi("Chegaraviy holatlar", "Граничные случаи", 'Boundary cases'),
    title: bi("28 ning 1/4 va 4/4 qismlari", "1/4 и 4/4 от 28", '1/4 and 4/4 of 28'),
    frames: [
      bi("28 ning 1/4 qismi", "1/4 от 28", '1/4 of 28'),
      bi("28 ÷ 4 = 7", "28 ÷ 4 = 7", '28 ÷ 4 = 7'),
      bi("28 ning 4/4 qismi", "4/4 от 28", '4/4 of 28'),
      bi("7 × 4 = 28", "7 × 4 = 28", '7 × 4 = 28'),
      bi("1/4 — bitta guruh; 4/4 — butun", "1/4 — одна группа; 4/4 — целое", '1/4 is one group; 4/4 is the whole'),
    ],
    audio: {
      uz: ["Yigirma sakkizning to'rtdan bir qismi bitta teng guruhdir.", "Yigirma sakkizni to'rtga bo'lsak, yetti chiqadi.", "To'rtdan to'rt qism barcha to'rtta guruhni oladi.", "Yettilik to'rtta guruh yigirma sakkizni beradi.", "Demak, surat bir bo'lsa bitta guruh, surat maxrajga teng bo'lsa butun olinadi."],
      ru: ["Одна четвёртая от двадцати восьми обозначает одну равную группу.", "Делим двадцать восемь на четыре и получаем семь.", "Четыре четвёртых берут все четыре группы.", "Четыре группы по семь дают двадцать восемь.", "Значит, числитель один даёт одну группу, а числитель, равный знаменателю, даёт целое."],
      en: ['One quarter of twenty-eight means one equal group.', 'Divide twenty-eight by four to get seven.', 'Four quarters take all four groups.', 'Four groups of seven make twenty-eight.', 'So a numerator of one gives one group, while a numerator equal to the denominator gives the whole.'],
    },
  },
  s8: {
    eyebrow: bi("Mashq · 1/6", "Тренировка · 1/6", 'Practice · 1/6'),
    title: bi("Bitta ulush yetarli emas", "Одной доли недостаточно", 'One part is not enough'),
    question: bi("20 ning 3/4 qismi nechaga teng?", "Чему равны 3/4 от 20?", 'What is 3/4 of 20?'),
    frames: [bi("20 → 4 teng guruh", "20 → 4 равные группы", '20 → 4 equal groups'), bi("3 guruh = ?", "3 группы = ?", '3 groups = ?')],
    options: ["15", "5", "60"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 20 ÷ 4 = 5, 5 × 3 = 15.", "Верно. 20 ÷ 4 = 5, 5 × 3 = 15.", 'Correct. 20 ÷ 4 = 5, and 5 × 3 = 15.'),
      bi("Bu faqat 1/4 qism. Yana uchta ulush kerak.", "Это только 1/4. Нужно взять три доли.", 'That is only the 1/4 part. You need to take three parts.'),
      bi("Siz suratga ko'paytirdingiz, ammo avval maxrajga bo'lish kerak.", "Ты умножил на числитель, но сначала нужно разделить на знаменатель.", 'You multiplied by the numerator, but first you must divide by the denominator.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Yigirma to'rtga bo'linsa besh, beshni uchga ko'paytirsak o'n besh.", "Верно. Двадцать делим на четыре и получаем пять, затем пять умножаем на три и получаем пятнадцать.", 'Correct. Divide twenty by four to get five, then multiply five by three to get fifteen.'),
      bi("Bu faqat to'rtdan bir qism. Uchta shunday ulush kerak.", "Это только одна четвёртая. Нужно взять три такие доли.", 'That is only one quarter. You need three such parts.'),
      bi("Siz suratga ko'paytirdingiz, ammo avval maxrajga bo'lish kerak.", "Ты умножил на числитель, но сначала нужно разделить на знаменатель.", 'You multiplied by the numerator, but first you must divide by the denominator.'),
    ],
    proof: bi("20 ÷ 4 × 3 = 15", "20 ÷ 4 × 3 = 15", '20 ÷ 4 × 3 = 15'),
    audio: { intro: {
      uz: ["Yigirma to'rtta teng guruhga ajraladi.", "Uchta guruhda nechta bo'lishini toping. Istasangiz, javobni tanlang."],
      ru: ["Двадцать делится на четыре равные группы.", "Найди, сколько будет в трёх группах. Если хочешь, выбери ответ."],
      en: ['Twenty is divided into four equal groups.', 'Find how many are in three groups. You may choose an answer if you wish.'],
    }, on_correct: bi("To'g'ri. Yigirmaning to'rtdan uch qismi o'n besh.", "Верно. Три четверти от двадцати равны пятнадцати.", 'Correct. Three quarters of twenty equals fifteen.') },
  },
  s9: {
    eyebrow: bi("Mashq · 2/6", "Тренировка · 2/6", 'Practice · 2/6'),
    title: bi("Modelni o'qing", "Прочитай модель", 'Read the model'),
    question: bi("30 ning 2/5 qismi nechaga teng?", "Чему равны 2/5 от 30?", 'What is 2/5 of 30?'),
    frames: [bi("30 → 5 teng guruh", "30 → 5 равных групп", '30 → 5 equal groups'), bi("2 guruh = ?", "2 группы = ?", '2 groups = ?')],
    options: ["12", "6", "75"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 30 ÷ 5 = 6, 6 × 2 = 12.", "Верно. 30 ÷ 5 = 6, 6 × 2 = 12.", 'Correct. 30 ÷ 5 = 6, and 6 × 2 = 12.'),
      bi("Bu faqat bitta beshdan ulush.", "Это только одна пятая.", 'That is only one fifth.'),
      bi("Surat va maxraj vazifasi almashgan: avval 30 ÷ 5.", "Роли числителя и знаменателя перепутаны: сначала 30 ÷ 5.", 'The numerator and denominator have swapped roles: first calculate 30 ÷ 5.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. O'ttizni beshga bo'lsak olti, oltini ikkiga ko'paytirsak o'n ikki.", "Верно. Тридцать делим на пять и получаем шесть, затем шесть умножаем на два и получаем двенадцать.", 'Correct. Divide thirty by five to get six, then multiply six by two to get twelve.'),
      bi("Bu faqat bitta beshdan ulush.", "Это только одна пятая.", 'That is only one fifth.'),
      bi("Surat va maxraj vazifasi almashgan. Avval o'ttizni beshga bo'lish kerak.", "Роли числителя и знаменателя перепутаны. Сначала нужно разделить тридцать на пять.", 'The numerator and denominator have swapped roles. First divide thirty by five.'),
    ],
    proof: bi("30 ÷ 5 × 2 = 12", "30 ÷ 5 × 2 = 12", '30 ÷ 5 × 2 = 12'),
    audio: { intro: {
      uz: ["O'ttizta element beshta teng guruhga ajraladi.", "Ikki guruhning qiymatini toping. Javob tanlash ixtiyoriy."],
      ru: ["Тридцать элементов делятся на пять равных групп.", "Найди значение двух групп. Ответ можно выбрать по желанию."],
      en: ['Thirty items are divided into five equal groups.', 'Find the value of two groups. Choosing an answer is optional.'],
    }, on_correct: bi("To'g'ri. O'ttizning beshdan ikki qismi o'n ikki.", "Верно. Две пятых от тридцати равны двенадцати.", 'Correct. Two fifths of thirty equals twelve.') },
  },
  s10: {
    eyebrow: bi("Mashq · 3/6", "Тренировка · 3/6", 'Practice · 3/6'),
    title: bi("Oraliq natija", "Промежуточный результат", 'Intermediate result'),
    question: bi("32 ÷ 8 = 4; 4 × 3 = ?", "32 ÷ 8 = 4; 4 × 3 = ?", '32 ÷ 8 = 4; 4 × 3 = ?'),
    frames: [bi("32 ÷ 8 = 4", "32 ÷ 8 = 4", '32 ÷ 8 = 4'), bi("4 × 3 = ?", "4 × 3 = ?", '4 × 3 = ?')],
    options: ["12", "4", "24"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. Uchta to'rt o'n ikki.", "Верно. Три раза по четыре дают двенадцать.", 'Correct. Three groups of four make twelve.'),
      bi("Bu bitta ulushning qiymati, uchta ulush emas.", "Это значение одной доли, а не трёх.", 'That is the value of one part, not three parts.'),
      bi("Siz 8 × 3 ni oldingiz; 8 guruhlar soni, guruh qiymati emas.", "Ты вычислил 8 × 3; восемь — число групп, а не значение группы.", 'You calculated 8 × 3, but eight is the number of groups, not the value of a group.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Uchta to'rt o'n ikki.", "Верно. Три раза по четыре дают двенадцать.", 'Correct. Three groups of four make twelve.'),
      bi("Bu bitta ulushning qiymati, uchta ulush emas.", "Это значение одной доли, а не трёх.", 'That is the value of one part, not three parts.'),
      bi("Siz sakkizni uchga ko'paytirdingiz. Sakkiz guruhlar soni, guruh qiymati emas.", "Ты умножил восемь на три. Восемь обозначает число групп, а не значение группы.", 'You multiplied eight by three. Eight is the number of groups, not the value of a group.'),
    ],
    proof: bi("32 ning 3/8 qismi = 12", "3/8 от 32 = 12", '3/8 of 32 = 12'),
    audio: { intro: {
      uz: ["O'ttiz ikkini sakkizga bo'lib, bitta ulush qiymati to'rt ekanini topdik.", "Endi uchta ulushning qiymatini toping."],
      ru: ["Разделив тридцать два на восемь, мы нашли значение одной доли, равное четырём.", "Теперь найди значение трёх долей."],
      en: ['By dividing thirty-two by eight, we found that one part has a value of four.', 'Now find the value of three parts.'],
    }, on_correct: bi("To'g'ri. Uchta ulushning qiymati o'n ikki.", "Верно. Значение трёх долей равно двенадцати.", 'Correct. The value of three parts is twelve.') },
  },
  s11: {
    eyebrow: bi("Mashq · 4/6", "Тренировка · 4/6", 'Practice · 4/6'),
    title: bi("To'g'ri yo'l", "Верный путь", 'The correct method'),
    question: bi("Qaysi yozuv avval bitta ulushni topadi?", "Какая запись сначала находит одну долю?", 'Which expression finds one part first?'),
    frames: [bi("Butun: 35; kasr: 4/7", "Целое: 35; дробь: 4/7", 'Whole: 35; fraction: 4/7'), bi("Qaysi yozuv avval bitta ulushni topadi?", "Какая запись сначала находит одну долю?", 'Which expression finds one part first?')],
    options: ["35 ÷ 7 × 4", "35 ÷ 4 × 7", "35 × 4"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 35 ÷ 7 = 5, 5 × 4 = 20.", "Верно. 35 ÷ 7 = 5, 5 × 4 = 20.", 'Correct. 35 ÷ 7 = 5, and 5 × 4 = 20.'),
      bi("Siz avval suratga bo'ldingiz. Teng guruhlar soni maxraj yetti.", "Ты сначала разделил на числитель. Число равных групп задаёт знаменатель семь.", 'You divided by the numerator first. The denominator seven gives the number of equal groups.'),
      bi("Maxrajga bo'lish qismi yo'q.", "Пропущено деление на знаменатель.", 'The division by the denominator is missing.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. O'ttiz beshni yettiga bo'lsak besh, beshni to'rtga ko'paytirsak yigirma.", "Верно. Тридцать пять делим на семь и получаем пять, затем пять умножаем на четыре и получаем двадцать.", 'Correct. Divide thirty-five by seven to get five, then multiply five by four to get twenty.'),
      bi("Siz avval suratga bo'ldingiz. Teng guruhlar sonini maxraj yetti ko'rsatadi.", "Ты сначала разделил на числитель. Число равных групп задаёт знаменатель семь.", 'You divided by the numerator first. The denominator seven gives the number of equal groups.'),
      bi("Maxrajga bo'lish qismi yo'q.", "Пропущено деление на знаменатель.", 'The division by the denominator is missing.'),
    ],
    proof: bi("35 ÷ 7 × 4 = 20", "35 ÷ 7 × 4 = 20", '35 ÷ 7 × 4 = 20'),
    audio: { intro: {
      uz: ["Butun son o'ttiz besh, maxraj yetti, surat to'rt.", "Qaysi yozuv avval bitta ulushni topadi?"],
      ru: ["Целое число тридцать пять, знаменатель семь, числитель четыре.", "Какая запись сначала находит одну долю?"],
      en: ['The whole number is thirty-five, the denominator is seven, and the numerator is four.', 'Which expression finds one part first?'],
    }, on_correct: bi("To'g'ri. Amal tartibi aniq tanlandi.", "Верно. Порядок действий выбран точно.", 'Correct. You chose the right order of operations.') },
  },
  s12: {
    eyebrow: bi("Mashq · 5/6", "Тренировка · 5/6", 'Practice · 5/6'),
    title: bi("Bitning xatosini toping", "Найди ошибку Бита", "Find Bit's mistake"),
    question: bi("Bit: 24 ÷ 2 × 3 = 36. Qaysi tuzatish kerak?", "Бит: 24 ÷ 2 × 3 = 36. Как исправить?", 'Bit: 24 ÷ 2 × 3 = 36. How should it be corrected?'),
    frames: [bi("Bit avval surat 2 ga bo'ldi", "Бит сначала разделил на числитель 2", 'Bit divided by the numerator 2 first'), bi("To'g'ri yozuv: ?", "Верная запись: ?", 'Correct expression: ?')],
    options: ["24 ÷ 3 × 2 = 16", "24 ÷ 2 × 3 = 36", "24 × 2 = 48"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. Avval 3 teng guruh, keyin 2 guruh olinadi.", "Верно. Сначала три равные группы, затем берём две группы.", 'Correct. First make three equal groups, then take two groups.'),
      bi("Bu Bitning o'sha xatosi: surat va maxraj almashgan.", "Это та же ошибка Бита: числитель и знаменатель поменялись ролями.", "That repeats Bit's mistake: the numerator and denominator have swapped roles."),
      bi("Maxrajga bo'lish qismi yo'q.", "Пропущено деление на знаменатель.", 'The division by the denominator is missing.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Avval uchta teng guruh tuziladi, keyin ikkita guruh olinadi.", "Верно. Сначала создаём три равные группы, затем берём две группы.", 'Correct. First make three equal groups, then take two groups.'),
      bi("Bu Bitning o'sha xatosi. Surat va maxrajning vazifasi almashgan.", "Это та же ошибка Бита. Числитель и знаменатель поменялись ролями.", "That repeats Bit's mistake. The numerator and denominator have swapped roles."),
      bi("Maxrajga bo'lish qismi yo'q.", "Пропущено деление на знаменатель.", 'The division by the denominator is missing.'),
    ],
    proof: bi("24 ÷ 3 × 2 = 16", "24 ÷ 3 × 2 = 16", '24 ÷ 3 × 2 = 16'),
    audio: { intro: {
      uz: ["Bit yigirma to'rtni avval suratdagi ikkiga bo'ldi.", "Teng guruhlar sonini maxraj ko'rsatadi. To'g'ri tuzatishni tanlashingiz mumkin."],
      ru: ["Бит сначала разделил двадцать четыре на числитель два.", "Число равных групп показывает знаменатель. Можешь выбрать исправление."],
      en: ['Bit divided twenty-four by the numerator two first.', 'The denominator gives the number of equal groups. You may choose the correction.'],
    }, on_correct: bi("To'g'ri. Yigirma to'rtning uchdan ikki qismi o'n olti.", "Верно. Две трети от двадцати четырёх равны шестнадцати.", 'Correct. Two thirds of twenty-four equals sixteen.') },
  },
  s13: {
    eyebrow: bi("Mashq · 6/6", "Тренировка · 6/6", 'Practice · 6/6'),
    title: bi("Markaz filtrlari", "Фильтры центра", 'Centre filters'),
    question: bi("42 filtrning 5/7 qismi faol. Nechta filtr faol?", "Работают 5/7 от 42 фильтров. Сколько фильтров работает?", '5/7 of 42 filters are active. How many filters are active?'),
    frames: [bi("Jami: 42 ta filtr", "Всего: 42 фильтра", 'Total: 42 filters'), bi("Faol qism: 5/7", "Рабочая часть: 5/7", 'Active part: 5/7'), bi("42 ÷ 7 × 5 = ?", "42 ÷ 7 × 5 = ?", '42 ÷ 7 × 5 = ?')],
    options: ["30", "6", "210"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 42 ÷ 7 = 6; 6 × 5 = 30.", "Верно. 42 ÷ 7 = 6; 6 × 5 = 30.", 'Correct. 42 ÷ 7 = 6, and 6 × 5 = 30.'),
      bi("Bu faqat 1/7 qism, faol besh guruh kerak.", "Это только 1/7, а работают пять групп.", 'That is only the 1/7 part, but five groups are active.'),
      bi("Siz 42 ni 5 ga ko'paytirdingiz, ammo teng guruhlarni topmadingiz.", "Ты умножил 42 на 5, но не нашёл равные группы.", 'You multiplied 42 by 5 without finding the equal groups.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Qirq ikkini yettiga bo'lsak olti, oltini beshga ko'paytirsak o'ttiz.", "Верно. Сорок два делим на семь и получаем шесть, затем шесть умножаем на пять и получаем тридцать.", 'Correct. Divide forty-two by seven to get six, then multiply six by five to get thirty.'),
      bi("Bu faqat yettidan bir qism. Faol beshta guruh kerak.", "Это только одна седьмая. Работают пять групп.", 'That is only one seventh. Five groups are active.'),
      bi("Siz qirq ikkini beshga ko'paytirdingiz, ammo teng guruhlarni topmadingiz.", "Ты умножил сорок два на пять, но не нашёл равные группы.", 'You multiplied forty-two by five without finding the equal groups.'),
    ],
    proof: bi("42 ning 5/7 qismi = 30", "5/7 от 42 = 30", '5/7 of 42 = 30'),
    audio: { intro: {
      uz: ["Lumo markazida qirq ikkita filtr bor.", "Ularning yettidan besh qismi hozir faol.", "Avval bitta ulushni, keyin beshta ulushni toping."],
      ru: ["В центре Лумо сорок два фильтра.", "Сейчас работают пять седьмых всех фильтров.", "Сначала найди одну долю, затем пять долей."],
      en: ['There are forty-two filters in the Lumo centre.', 'Five sevenths of all the filters are currently active.', 'First find one part, then five parts.'],
    }, on_correct: bi("To'g'ri. O'ttizta filtr faol.", "Верно. Работают тридцать фильтров.", 'Correct. Thirty filters are active.') },
  },
  s14: {
    eyebrow: bi("Yakuniy bosqich", "Финальный этап", 'Final stage'),
    title: bi("Siz sonning kasr qismini topa olasiz", "Ты умеешь находить дробную часть числа", 'You can find a fraction of a number'),
    frames: [
      bi("24 → 6 teng guruh", "24 → 6 равных групп", '24 → 6 equal groups'),
      bi("1/6 qism = 4", "1/6 = 4", '1/6 part = 4'),
      bi("5/6 qism = 4 × 5 = 20", "5/6 = 4 × 5 = 20", '5/6 part = 4 × 5 = 20'),
      bi("a/b qism: avval ÷ b, keyin × a", "Часть a/b: сначала ÷ b, затем × a", 'a/b part: first ÷ b, then × a'),
      bi("Keyingi: kasrli masalada qism yoki butun", "Дальше: часть или целое в задаче с дробью", 'Next: the part or the whole in a fraction problem'),
    ],
    audio: {
      uz: ["Yigirma to'rt modul oltita teng guruhga ajraladi.", "Bitta oltidan ulush to'rtta modulga teng.", "Beshta shunday ulush yigirmata modul beradi.", "Sonning a dan b qismini topishda avval maxrajga bo'lamiz, keyin suratga ko'paytiramiz.", "Keyingi darsda qism yoki butun noma'lum bo'lgan kasrli masalalarni ajratamiz."],
      ru: ["Двадцать четыре модуля делятся на шесть равных групп.", "Одна шестая равна четырём модулям.", "Пять таких долей дают двадцать модулей.", "Чтобы найти дробную часть числа, сначала делим на знаменатель, затем умножаем на числитель.", "На следующем уроке различим задачи, где неизвестна часть или целое."],
      en: ['Twenty-four modules are divided into six equal groups.', 'One sixth equals four modules.', 'Five such parts make twenty modules.', 'To find a fraction of a number, first divide by the denominator, then multiply by the numerator.', 'In the next lesson, we will distinguish problems where the part or the whole is unknown.'],
    },
  },
};
let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const LANGUAGE_LABELS = { uz: 'Til', ru: 'Язык', en: 'Language' };
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const LangContext = createContext('uz');
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return mobile;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

const buildTtsUrl = (base, text, gender) => base + '/api/tts?text=' + encodeURIComponent(String(text).slice(0, 1000)) + '&g=' + (gender === 'm' ? 'm' : 'f');

class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() {
    if (this.timer && typeof window !== 'undefined') window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) { this.previewUtterance.onstart = null; this.previewUtterance.onend = null; this.previewUtterance.onerror = null; this.previewUtterance = null; }
    if (typeof window !== 'undefined' && window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch { /* preview only */ } }
  }
  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null }); }
  start() { this.play(); }
  timed(item, duration = null) {
    if (this.timer) window.clearTimeout(this.timer);
    if (this.audio) { this.audio.onended = null; this.audio.onerror = null; }
    this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true });
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration ?? 900);
  }
  play() {
    const item = this.queue[this.index];
    if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; }
    if (this.muted || !runtimeConfig.ttsApiBase) {
      if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(String(item.text));
          utterance.lang = SPEECH_LOCALES[this.lang] ?? SPEECH_LOCALES.uz;
          utterance.rate = 0.94;
          utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false });
          utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); };
          utterance.onerror = () => this.timed(item, 900);
          this.previewUtterance = utterance;
          this.timer = window.setTimeout(() => { try { window.speechSynthesis.speak(utterance); } catch { this.timed(item, 900); } }, 50);
          return;
        } catch { /* deterministic timer fallback */ }
      }
      this.timed(item);
      return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item, 900);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item, 900));
  }
  toggleMute() { this.muted = !this.muted; this.stop(); this.index = 0; this.emit({ muted: this.muted }); this.start(); }
  pushOneOff(text) { this.load([{ id: 'feedback-' + Date.now(), text }]); this.start(); }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ muted: audioEngineInstance?.muted ?? false, completed: false, currentSegment: null, visualOnly: !runtimeConfig.ttsApiBase });
  /* eslint-disable react-hooks/refs -- stable audio queue */
  const segmentsRef = useRef(segments);
  const segmentsKey = JSON.stringify(segments || []);
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) { segmentsRef.current = segments; prevKeyRef.current = segmentsKey; }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */
  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.listener = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 220);
    return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; };
  }, [lang, stableSegments]);
  return {
    ...state,
    replay: () => { const engine = getAudioEngine(); engine?.load(stableSegments); engine?.start(); },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

function useNarration(value, screen) {
  const lang = useLang();
  const reduced = usePrefersReducedMotion();
  const segments = useMemo(() => {
    const source = value?.intro ?? value;
    const texts = source?.[lang] ?? [];
    return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: 's' + screen + '-beat-' + index, text }));
  }, [lang, screen, value]);
  const audio = useAudio(segments);
  const active = segments.findIndex((segment) => segment.id === audio.currentSegment);
  const finalFrame = Math.max(0, FRAME_COUNTS[screen] - 1);
  const feedbackPlaying = audio.currentSegment?.startsWith('feedback-') === true;
  const frame = reduced || feedbackPlaying || audio.completed ? finalFrame : active >= 0 ? active : 0;
  return { ...audio, frame, caption: active >= 0 ? segments[active].text : '' };
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try { new Audio(url).play().catch(() => {}); } catch { /* optional */ }
};

const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g421bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g421bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g421bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g421bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const labels = {
    uz: { unmute: "Ovozni yoqish", mute: "Ovozni o'chirish", replay: 'Qayta eshitish' },
    ru: { unmute: 'Включить звук', mute: 'Выключить звук', replay: 'Повторить' },
    en: { unmute: 'Turn sound on', mute: 'Turn sound off', replay: 'Replay' },
  }[lang];
  const muteLabel = audio.muted
    ? labels.unmute
    : labels.mute;
  const replayLabel = labels.replay;
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>
          ↻
        </button>
      )}
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    uz: { hook: 'Missiya', diagnostic: 'Diagnostika', exploration: 'Kashfiyot', rule: 'Qoida', practice: 'Mashq', test: 'Tekshiruv', case: 'Vazifa', summary: 'Yakun' },
    ru: { hook: 'Миссия', diagnostic: 'Диагностика', exploration: 'Исследование', rule: 'Правило', practice: 'Практика', test: 'Проверка', case: 'Задача', summary: 'Итог' },
    en: { hook: 'Mission', diagnostic: 'Diagnostic', exploration: 'Discovery', rule: 'Rule', practice: 'Practice', test: 'Check', case: 'Problem', summary: 'Summary' },
  }[lang];
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const FeedbackBlock = ({ show, correct, children, proof = null }) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!show) { const frameId = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frameId); }
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [show]);
  return <div data-g4-role={show ? (correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame') : undefined} data-g4-feedback={show ? (correct ? 'solution' : 'wrong') : undefined} role={show ? 'status' : undefined} aria-hidden={!show} className={`feedback feedback-slot ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'}/></span><p data-g4-role={show && correct ? 'bit-answer-comment' : undefined}>{show && correct && <b className="proof-label">{t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' })}</b>}<span>{show ? children : ''}</span>{show && proof && <strong className="feedback-proof">{proof}</strong>}</p></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, nextDisabled: originalNextDisabled = false, finish = false, children }) => {
  const originalGatePassed = !originalNextDisabled && Boolean(onNext);
  const nextDisabled = !canUseGrade4TheoryContinue(originalGatePassed, finish);
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen];
  return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{children}<div className={`caption-slot ${audio?.caption && (audio.muted || audio.visualOnly) ? 'is-visible' : ''}`} aria-live="polite"><span>{audio?.caption && (audio.muted || audio.visualOnly) ? audio.caption : ''}</span></div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад', en: 'Back' })}</button>}<button type="button" className="btn-white-accent" disabled={nextDisabled || !onNext} onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок', en: 'Finish lesson' }) : t({ uz: "Davom etish", ru: 'Продолжить', en: 'Continue' })} →</button></footer></main>;
};

const Heading = ({ c, bit, hook = false }) => { const t = useT(); return <div className="heading"><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{bit && !hook && <BitSVG state={bit}/>}</div>; };
const Frac = ({ n, d, size = 'sm' }) => <span className={'frac ' + (size === 'lg' ? 'frac-lg' : '')}><span>{n}</span><i/><span>{d}</span></span>;
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false, disabled = false, wrongChoices = [], order = null }) => {
  const t = useT();
  const sourceOrder = order ?? values.map((_, index) => index);
  return <div className="options">{sourceOrder.map((sourceIndex, displayIndex) => { const value = values[sourceIndex]; return <button type="button" key={sourceIndex + '-' + t(value)} data-g4-role="answer-card" data-g4-source-index={order ? sourceIndex : undefined} data-g4-correct={order ? (sourceIndex === correctIndex ? 'true' : 'false') : undefined} data-g4-wrong-choice={wrongChoices.includes(sourceIndex) || undefined} className={'option ' + (picked === sourceIndex ? 'picked ' : '') + (!neutral && solved && sourceIndex === correctIndex ? 'right ' : '') + ((!neutral && picked === sourceIndex && picked !== correctIndex) || wrongChoices.includes(sourceIndex) ? 'bad' : '')} disabled={disabled || wrongChoices.includes(sourceIndex) || (!neutral && solved)} onClick={() => onPick(sourceIndex)}><b>{String.fromCharCode(65 + displayIndex)}</b><span>{t(value)}</span></button>; })}</div>;
};

const FractionBar = ({ den = 8, filled = 0, removed = 0, label = null, compact = false }) => {
  const cells = Array.from({ length: den }, (_, index) => <i key={index} className={index < filled ? 'cyan' : index < filled + removed ? 'removed' : ''}/>);
  return <div className={'fraction-model ' + (compact ? 'compact' : '')}><div className="fraction-bar divided" style={{ gridTemplateColumns: 'repeat(' + den + ', 1fr)' }}>{cells}</div>{label && <div className="model-label">{label}</div>}</div>;
};

const FrameNotes = ({ items = [], frame = 0 }) => {
  const t = useT();
  return <div className="frame-notes">{items.map((item, index) => <div key={index} className={'frame-note ' + (frame >= index ? 'show' : '')}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>;
};

const GroupBoard = ({ total, groups, selected = 0, compact = false, condensed = false }) => {
  const t = useT();
  const perGroup = Math.floor(total / groups);
  const label = condensed
    ? t(bi(
      total + ' ta obyekt, ' + groups + ' ta teng guruh, har bir guruhda ' + perGroup + ' ta' + (selected ? ', ' + selected + ' ta guruh ajratilgan' : ''),
      total + ' объектов, ' + groups + ' равных групп, по ' + perGroup + ' в каждой' + (selected ? ', выделено ' + selected + ' групп' : ''),
      total + ' objects in ' + groups + ' equal groups, ' + perGroup + ' in each group' + (selected ? ', ' + selected + ' groups selected' : ''),
    ))
    : t(bi(total + ' ta obyekt, ' + groups + ' ta teng guruh', total + ' объектов, ' + groups + ' равных групп', total + ' objects in ' + groups + ' equal groups'));
  return <div className={'group-board ' + (compact ? 'group-board-compact ' : '') + (condensed ? 'group-board-condensed' : '')} role={condensed ? 'img' : undefined} aria-label={label}>
    {Array.from({ length: groups }, (_, group) => <div key={group} className={'group-cell ' + (group < selected ? 'group-selected' : '')}>
      {condensed
        ? <div className="group-condensed-count" aria-hidden="true"><i/><b>×{perGroup}</b></div>
        : <><div>{Array.from({ length: perGroup }, (_, item) => <i key={item}/>)}</div><small>{perGroup}</small></>}
    </div>)}
  </div>;
};

const RuleFlow = ({ frame = 0, reverse = false }) => {
  const t = useT();
  const items = reverse
    ? [bi('Qism P', 'Часть P', 'Part P'), bi('÷ a', '÷ a', '÷ a'), bi('1/b ulush', 'Доля 1/b', '1/b part'), bi('× b', '× b', '× b'), bi('Butun N', 'Целое N', 'Whole N')]
    : [bi('Butun N', 'Целое N', 'Whole N'), bi('÷ b', '÷ b', '÷ b'), bi('1/b ulush', 'Доля 1/b', '1/b part'), bi('× a', '× a', '× a'), bi('Qism', 'Часть', 'Part')];
  return <div className="rule-flow">{items.map((item, index) => <React.Fragment key={index}><span className={frame >= Math.min(index, 3) ? 'show' : ''}>{t(item)}</span>{index < items.length - 1 && <b>→</b>}</React.Fragment>)}</div>;
};

const ThreeSpanLine = ({ frame = 0 }) => {
  const t = useT();
  const highlighted = frame >= 2 ? 2 : frame >= 1 ? 1 : 0;
  return <div className="three-span-line" aria-label={t(bi("Noldan o'n sakkizgacha uchta oltilik oraliq", "От нуля до восемнадцати три отрезка по шесть", 'Three intervals of six from zero to eighteen'))}>
    <div className="three-span-track">{Array.from({ length: 3 }, (_, index) => <span key={index} className={index < highlighted ? 'span-highlighted' : ''}><i/><small>6</small></span>)}</div>
    <div className="three-span-labels"><b>0</b><b>6</b><b>12</b><b>18</b></div>
  </div>;
};

const NeutralWholeFraction = () => {
  const t = useT();
  return <div className="neutral-fact-cards"><span><small>{t(bi("Butun", "Целое", 'Whole'))}</small><strong>35</strong></span><span><small>{t(bi("Kasr", "Дробь", 'Fraction'))}</small><strong><Frac n="4" d="7" size="lg"/></strong></span></div>;
};

function ChoiceExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, visual = null, renderVisual = null, bit = null }) {
  const t = useT();
  const c = CONTENT['s' + screen];
  const ordinal = [8, 9, 11, 12, 13].indexOf(screen);
  const order = ordinal >= 0 ? buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, ordinal + 1) : null;
  const audio = useNarration(c.audio, screen);
  const narrationReady = audio.muted || audio.completed;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [hintLevel, setHintLevel] = useState((storedAnswer?.attempts ?? 0) >= 2 ? 1 : 0);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => {
    if (solved || !narrationReady) return;
    attempts.current += 1;
    const ok = index === c.correctIndex;
    if (!ok) clean.current = false;
    setPicked(index);
    setSolved(ok);
    if (!ok && attempts.current >= 2) setHintLevel(1);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.feedbackAudio[index]));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  const contextVisual = renderVisual ? renderVisual({ frame: audio.frame, solved }) : visual;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack"><Heading c={c} bit={bit}/><FrameNotes items={c.frames} frame={audio.frame}/>{contextVisual && <div className={'attempt-model ' + (hintLevel > 0 ? 'attempt-highlight' : '')}>{contextVisual}</div>}<section className={'question ' + (hintLevel > 0 ? 'attempt-highlight' : '')}><h2>{t(c.question)}</h2>{hintLevel > 0 && <div className="attempt-cue" role="status">{t(bi("Avval maxraj bo'yicha bitta teng guruhni toping.", "Сначала найди одну равную группу по знаменателю.", 'First use the denominator to find one equal group.'))}</div>}<Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved} disabled={!narrationReady} order={order}/><FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock>{solved && c.proof && <div className="proof">{t(c.proof)}</div>}</section></div></Stage>;
}

function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [wrongChoices, setWrongChoices] = useState(storedAnswer?.wrongChoices ?? []); const solved = storedAnswer?.correct === true || picked === 0; const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const order = buildOptionOrder(c.options.length, 0, LESSON_META.lessonId, 0);
  const correctFeedback = bi("To'g'ri: 24 ÷ 6 × 5 = 20.", 'Верно: 24 ÷ 6 × 5 = 20.', 'Correct: 24 ÷ 6 × 5 = 20.');
  const wrongFeedback = bi("Avval 24 ni 6 teng guruhga ajrating, so'ng 5 guruhni oling.", 'Сначала разделите 24 на 6 равных групп, затем возьмите 5 групп.', 'First divide 24 into 6 equal groups, then take 5 groups.');
  const correctAudio = bi("To'g'ri. Yigirma to'rtni oltiga bo'lib, natijani beshga ko'paytiramiz. Javob yigirma.", 'Верно. Делим двадцать четыре на шесть и умножаем результат на пять. Ответ двадцать.', 'Correct. Divide twenty-four by six and multiply the result by five. The answer is twenty.');
  const wrongAudio = bi("Avval yigirma to'rtni oltita teng guruhga ajrating, so'ng beshta guruhni oling.", 'Сначала разделите двадцать четыре на шесть равных групп, затем возьмите пять групп.', 'First divide twenty-four into six equal groups, then take five groups.');
  const pick = (index) => { if (!narrationReady || solved) return; attempts.current += 1; const ok = index === 0; if (!ok) clean.current = false; const nextWrongChoices = ok || wrongChoices.includes(index) ? wrongChoices : [...wrongChoices, index]; setPicked(index); setWrongChoices(nextWrongChoices); audio.pushOneOff(t(ok ? correctAudio : wrongAudio)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: 0, correctAnswer: t(c.options[0]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok, wrongChoices: nextWrongChoices }); };
  return <Stage screen={screen} audio={audio} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack hook-stack" data-g4-screen="hook"><Heading c={c} bit="think" hook/><h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2><section className="hook-scene-adapter" data-g4-role="hook-scene"><div className="hook-scene-visual" data-g4-role="visual-frame"><FrameNotes items={c.frames} frame={audio.frame}/><section className="hook-model"><GroupBoard total={24} groups={6} selected={audio.frame >= 2 ? 5 : 0} condensed/></section><div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think"/></div></div></section><section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} correctIndex={0} neutral disabled={!narrationReady || solved} answerCards wrongChoices={wrongChoices} order={order}/><FeedbackBlock show={picked !== null} correct={solved} proof={solved ? '24 ÷ 6 × 5 = 20' : null}>{picked !== null ? t(solved ? correctFeedback : wrongFeedback) : ''}</FeedbackBlock></section></div></Stage>;
}

function StrategyReplay({ used, onUse, audio }) {
  const t = useT();
  return <div className="strategy-slot"><button type="button" className={'strategy-replay ' + (used ? 'is-hidden' : '')} disabled={!audio.muted && !audio.completed} onClick={onUse}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button><FeedbackBlock show={used} correct proof={t({ uz: "Qadamlar modelda qayta ko'rildi", ru: 'Шаги повторно проверены по модели', en: 'The steps were replayed on the model' })}>{t({ uz: "Strategiya tekshirildi.", ru: 'Стратегия проверена.', en: 'Strategy checked.' })}</FeedbackBlock></div>;
}

function Screen1({ screen, onNext, onPrev }) {
  const c = CONTENT.s1; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="model-card"><FractionBar den={6} filled={audio.frame >= 2 ? 5 : 0} label={<Frac n="5" d="6" size="lg"/>}/></section><StrategyReplay used={strategyUsed} audio={audio} onUse={() => { setStrategyUsed(true); audio.replay(); }}/></div></Stage>;
}
function Screen2({ screen, onNext, onPrev }) {
  const c = CONTENT.s2; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="model-card"><GroupBoard total={24} groups={6} selected={audio.frame >= 2 ? 1 : 0}/></section><StrategyReplay used={strategyUsed} audio={audio} onUse={() => { setStrategyUsed(true); audio.replay(); }}/></div></Stage>;
}
function Screen3({ screen, onNext, onPrev }) {
  const c = CONTENT.s3; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="model-card"><GroupBoard total={24} groups={6} selected={audio.frame >= 1 ? 5 : 1}/><div className={'result-chip ' + (audio.frame >= 3 ? 'show' : '')}>20</div></section><StrategyReplay used={strategyUsed} audio={audio} onUse={() => { setStrategyUsed(true); audio.replay(); }}/></div></Stage>;
}
function Screen4({ screen, onNext, onPrev }) {
  const c = CONTENT.s4; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="rule-card"><RuleFlow frame={audio.frame}/><div className={'formula-card ' + (audio.frame >= 3 ? 'show' : '')}>(N ÷ b) × a</div></section><StrategyReplay used={strategyUsed} audio={audio} onUse={() => { setStrategyUsed(true); audio.replay(); }}/></div></Stage>;
}
function Screen5({ screen, onNext, onPrev }) {
  const c = CONTENT.s5; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="model-card"><ThreeSpanLine frame={audio.frame}/></section><StrategyReplay used={strategyUsed} audio={audio} onUse={() => { setStrategyUsed(true); audio.replay(); }}/></div></Stage>;
}
function Screen6({ screen, onNext, onPrev }) {
  const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="model-card"><GroupBoard total={18} groups={3} selected={2}/><div className={'state-note ' + (audio.frame >= 3 ? 'show' : '')}>12 + 6 = 18 ✓</div></section><StrategyReplay used={strategyUsed} audio={audio} onUse={() => { setStrategyUsed(true); audio.replay(); }}/></div></Stage>;
}
function Screen7({ screen, onNext, onPrev }) {
  const c = CONTENT.s7; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={frame}/><section className="boundary-grid"><div className="show"><GroupBoard total={28} groups={4} selected={frame >= 1 ? 1 : 0} compact/></div><div className={frame >= 2 ? 'show' : ''}><GroupBoard total={28} groups={4} selected={frame >= 3 ? 4 : 0} compact/></div><div className={'state-note ' + (frame >= 4 ? 'show' : '')}>1/4 → 7 · 4/4 → 28</div></section><StrategyReplay used={strategyUsed} audio={audio} onUse={() => { setStrategyUsed(true); audio.replay(); }}/></div></Stage>;
}

function Screen8(props) { return <ChoiceExercise {...props} renderVisual={({ frame }) => <div className="model-card"><GroupBoard total={20} groups={4} selected={frame >= 1 ? 3 : 0} compact/></div>}/>; }
function Screen9(props) { return <ChoiceExercise {...props} renderVisual={({ frame }) => <div className="model-card"><GroupBoard total={30} groups={5} selected={frame >= 1 ? 2 : 0} compact/></div>}/>; }
function Screen10(props) { return <ChoiceExercise {...props}/>; }
function Screen11(props) { return <ChoiceExercise {...props} visual={<div className="model-card"><NeutralWholeFraction/></div>}/>; }
function Screen12(props) { return <ChoiceExercise {...props} bit="awkward" visual={<div className="bit-error"><span>2/3 × 24</span><b>24 ÷ 2 × 3 = 36</b></div>}/>; }
function Screen13(props) { return <ChoiceExercise {...props} renderVisual={({ frame }) => <div className="model-card"><GroupBoard total={42} groups={7} selected={frame >= 1 ? 5 : 0} compact/><div className={'state-note ' + (frame >= 2 ? 'show' : '')}>42 ÷ 7 × 5 = ?</div></div>}/>; }
function G4TitleReveal({ active, title, onComplete }) {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const wasActiveRef = useRef(active);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    const wasActive = wasActiveRef.current;
    wasActiveRef.current = active;
    if (!active || wasActive || typeof window === 'undefined') return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => { setVisible(false); onCompleteRef.current?.(); }, reduced ? 120 : 3900);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active]);
  if (!visible || typeof document === 'undefined') return null;
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true"><div className="rank-boost-card g4-title-reveal-card"><div className="rank-boost-rays g4-title-reveal-rays" aria-hidden="true"/><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index}/>)}</div><div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div><h2 className="g4-title-reveal-title">{t(title)}</h2></div></div>, document.body);
}

function G4TitleCard({ title, answers = [] }) {
  const t = useT();
  const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null);
  const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <aside className="g4-title-card" data-g4-role="title-card" role="status" aria-live="polite"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t({ uz: 'UNVON OLINDI', ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: 'TITLE EARNED' })}</span><h2 className="g4-title-card-title">{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t({ uz: 'birinchi urinishda', ru: 'с первой попытки', en: 'on the first try' })}</span></div></aside>;
}

function G4FinalTitleReward({ ready, titleClaimed, reflectionChoice, onClaim, title, answers }) {
  const t = useT();
  const [revealRequested, setRevealRequested] = useState(false);
  const completeReveal = () => { setRevealRequested(false); onClaim(); };
  return <><G4TitleReveal active={revealRequested} title={title} onComplete={completeReveal}/>{titleClaimed && <G4TitleCard title={title} answers={answers}/>} {!titleClaimed && <button type="button" className="g4-title-claim" data-g4-role="title-claim" disabled={!ready || reflectionChoice === null || revealRequested} onClick={() => setRevealRequested(true)}><span aria-hidden="true">★</span><strong>{t({ uz: 'Unvonni olish', ru: 'Получить звание', en: 'Claim title' })}</strong><small>{t(title)}</small></button>}</>;
}

const ReflectionPanel = ({ choices, choice, onChoose, disabled }) => {
  const t = useT();
  return <section className="final-reflection" data-g4-role="reflection"><strong>{t({ uz: "Qaysi tekshiruv usulidan foydalanasiz?", ru: 'Какой способ проверки вы выберете?', en: 'Which checking strategy will you use?' })}</strong><div>{choices.map((item, index) => <button type="button" key={index} className={choice === index ? 'is-selected' : ''} aria-pressed={choice === index} disabled={disabled} onClick={() => onChoose(index)}><span>{index + 1}</span>{t(item)}</button>)}</div></section>;
};

function Screen14({ screen, storedAnswer, answers, onAnswer, onPrev, finishLesson }) {
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const title = { uz: "Kasr qismini topish ustasi", ru: 'Мастер дробной части', en: 'Fraction Finder' }; const reflectionOptions = [{ uz: 'Model bilan tekshiraman', ru: 'Проверю по модели', en: 'I will check with a model' }, { uz: 'Qoida va birlikni tekshiraman', ru: 'Проверю правило и единицу', en: 'I will check the rule and unit' }, { uz: 'Teskari amal bilan tekshiraman', ru: 'Проверю обратным действием', en: 'I will use the inverse operation' }]; const chooseReflection = (index) => { if (!narrationReady || titleClaimed) return; setReflectionChoice(index); onAnswer({ ...(storedAnswer ?? {}), screenIdx: screen, stage: null, reflectionChoice: index, titleClaimed: false }); audio.pushOneOff(t(reflectionOptions[index])); }; const claimTitle = () => { if (!narrationReady || reflectionChoice === null || titleClaimed) return; setTitleClaimed(true); onAnswer({ screenIdx: screen, stage: null, question: t({ uz: 'Tanlangan tekshiruv', ru: 'Выбранная проверка', en: 'Chosen check' }), options: reflectionOptions.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: reflectionChoice, studentAnswer: t(reflectionOptions[reflectionChoice]), correct: true, firstTry: true, attempts: 1, solved: true, reflectionChoice, titleClaimed: true }); }; const frame = audio.frame; const complete = frame >= 4;
  const takeaways = [
    { label: bi("Butun", "Целое", 'Whole'), value: "24" },
    { label: bi("Teng guruhlar", "Равные группы", 'Equal groups'), value: "24 ÷ 6 = 4" },
    { label: bi("Olinadigan ulushlar", "Выбранные доли", 'Parts to take'), value: "4 × 5 = 20" },
    { label: bi("Qoida", "Правило", 'Rule'), value: "÷ b, × a" },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={titleClaimed ? finishLesson : undefined} nextDisabled={!titleClaimed} finish><div className="stack"><section className="finale-heading"><span>◆ {t(bi("YAKUNIY BOSQICH", "ФИНАЛЬНЫЙ ЭТАП", 'FINAL STAGE'))}</span><h1>{t(c.title)}</h1><p>{t(bi("Boshlang'ich missiyani teng guruhlar bilan yechdik.", "Мы решили стартовую миссию с помощью равных групп.", 'We solved the starting mission using equal groups.'))}</p></section><FrameNotes items={c.frames} frame={frame}/><section className="finale-main"><div className="finale-payoff"><small>{t(bi("BOSHLANG'ICH MISSIYA YECHIMI", "РЕШЕНИЕ СТАРТОВОЙ МИССИИ", 'STARTING MISSION SOLUTION'))}</small><GroupBoard total={24} groups={6} selected={frame >= 2 ? 5 : 0} compact/><div className={'finale-answer ' + (frame >= 2 ? 'show' : '')}>24 ÷ 6 × 5 = 20</div></div><div className="finale-takeaways">{takeaways.map((item, index) => <div className={'finale-takeaway ' + (frame >= index ? 'show' : '')} key={t(item.label)}><b>{index + 1}</b><span><small>{t(item.label)}</small><strong>{item.value}</strong></span></div>)}</div></section><section className="finale-bottom"><div className={'finale-bridge ' + (complete ? 'show' : '')}><small>{t(bi("KEYINGI MAVZU", "СЛЕДУЮЩАЯ ТЕМА", 'NEXT TOPIC'))}</small><strong>{t(bi("Kasrli masalalarda qism va butun", "Часть и целое в задачах с дробями", 'Parts and wholes in fraction problems'))}</strong></div><ReflectionPanel choices={reflectionOptions} choice={reflectionChoice} onChoose={chooseReflection} disabled={!narrationReady || titleClaimed}/><G4FinalTitleReward ready={narrationReady} titleClaimed={titleClaimed} reflectionChoice={reflectionChoice} onClaim={claimTitle} title={title} answers={answers}/></section></div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars22({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const showPreviewControls = langProp === undefined || langProp === null;
  const preview = previewMode ?? showPreviewControls;
  const initialLang = normalizeLang(langProp);
  const [previewLang, setPreviewLang] = useState(initialLang);
  const lang = showPreviewControls ? normalizeLang(previewLang) : initialLang;
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started = useRef(Date.now());
  const finished = useRef(false);
  const recordAnswer = useCallback((answer) => setAnswers((previous) => {
    const next = [...previous];
    const old = previous[answer.screenIdx];
    next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry };
    return next;
  }), []);
  const finishLesson = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null);
    const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length;
    const payload = {
      lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null,
      durationSec: Math.floor((Date.now() - started.current) / 1000), totalQuestions: scored.length,
      correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100),
      finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6,
      firstTryStats: { total: scored.length, firstTryCorrect },
      attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars22 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES + G4_ETALON_OVERRIDES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{showPreviewControls && <div className="preview-language" aria-label={LANGUAGE_LABELS[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>;
}

const G4_TITLE_STYLES = `
.g4-title-reveal-overlay{
  position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;
  background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-overlay-life 3.9s ease both
}
.g4-title-reveal-card{
  position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;
  background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)
}
.g4-title-reveal-card::after{
  content:"";position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;
  background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%);pointer-events:none
}
.g4-title-reveal-rays{
  position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;
  background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);
  transform:translate(-50%,-50%);
  animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-spin 26s linear .8s 1 both
}
.g4-title-reveal-medal{
  position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;margin:0;border:6px solid rgba(255,255,255,.72);border-radius:50%;
  display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);
  box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);
  font-size:52px;transform:translate(-50%,-50%);animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both
}
.g4-title-reveal-card h2{
  position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0;
  font-family:'Source Serif 4',Georgia,serif;font-size:clamp(34px,5vw,58px);line-height:1.02;text-shadow:0 4px 24px rgba(0,0,0,.72);
  transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both
}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}
.g4-title-reveal-confetti i{
  position:absolute;top:-20px;left:calc(3% + var(--g4-title-i) * 5.35%);width:8px;height:14px;border-radius:2px;background:#FFE284;
  animation:g4-title-reveal-confetti-fall 2.4s linear var(--g4-title-delay) 2 both
}
.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
.g4-title-card-stage{
  position:relative;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;
  display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;
  background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);
  box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)
}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}
.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-medal{
  position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;
  display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);
  box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px
}
.g4-title-card-kicker{color:#A8EAF0;font:900 10px 'JetBrains Mono',monospace;letter-spacing:.13em}
.g4-title-card-stage h2{max-width:590px;margin:0;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif}
.g4-title-card-score{
  align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10)
}
.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}
.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-confetti-fall 2.4s linear 2 both}
.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}
.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
@keyframes g4-title-reveal-overlay-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}
@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}
@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}
@keyframes g4-title-reveal-rays-spin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes g4-title-reveal-confetti-fall{to{transform:translateY(470px) rotate(560deg)}}
@keyframes g4-title-card-confetti-fall{to{transform:translateY(230px) rotate(460deg)}}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@media(max-width:639.98px){
  .g4-title-reveal-card{min-height:100dvh;padding:24px 18px}
  .g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}
  .g4-title-reveal-card h2{top:calc(50% + 62px);font-size:29px}
  .g4-title-card-stage{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}
  .g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}
  .g4-title-card-bit{width:57px;height:71px}
  .g4-title-card-stage h2{font-size:14px}
}
@media(prefers-reduced-motion:reduce){
  .g4-title-reveal-overlay,.g4-title-reveal-overlay *,.g4-title-card-stage,.g4-title-card-stage *{animation:none!important;transition:none!important}
  .g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}
  .g4-title-reveal-rays{opacity:.28!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-medal{opacity:1!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-card h2{opacity:1!important;transform:translateX(-50%)!important}
  .g4-title-card-stage{transform:none!important}
}
`;

const G4_ETALON_OVERRIDES = `
/* Local Dars01 visual contract. Content, narration and scoring stay lesson-owned. */
html:has(.lesson-root),body:has(.lesson-root),.lesson-root,.lesson-root button,.lesson-root input,.lesson-root textarea,.lesson-root select{font-family:'Manrope',system-ui,sans-serif}
.lesson-root h1,.lesson-root [data-g4-role="hook-title"] h1{font-family:'Source Serif 4',Georgia,serif!important;font-size:clamp(26px,4.2vw,36px)!important;font-weight:650!important;line-height:1.08!important;letter-spacing:-.012em!important;text-align:left!important}
.lesson-root .question h2,.lesson-root .hook-question-prompt{font-family:'Manrope',system-ui,sans-serif!important;font-size:clamp(17px,2.5vw,21px)!important;font-weight:800!important;line-height:1.28!important;text-align:left!important}
.lesson-root .summary-stack h2,.lesson-root .final-reflection h2,.lesson-root .reflection-card h2,.lesson-root [data-g4-role="title-card"] h2{font-family:'Source Serif 4',Georgia,serif!important}
.lesson-root .screen-count,.lesson-root .formula,.lesson-root .formula-card,.lesson-root .equation,.lesson-root .proof,.lesson-root .proof-label,.lesson-root .result-chip,.lesson-root .model-label,.lesson-root .frac{font-family:'JetBrains Mono',monospace!important}
.lesson-root [data-g4-role="hook-topic"]{font-size:clamp(14px,1.8vw,16px)!important}.lesson-root .summary-stack h2{font-size:25px}.lesson-root .option{font-size:clamp(15px,2vw,18px)}
[data-g4-role="hook-title"]{display:block;width:100%;font-size:36px!important;justify-content:flex-start!important;text-align:left}
.hook-stack{height:100%;min-height:0;display:flex!important;flex-direction:column;align-items:stretch;gap:9px!important;overflow:hidden}
.hook-stack>.heading{height:auto!important;min-height:0!important;overflow:visible!important;align-items:flex-start!important;flex:0 0 auto}
.hook-question-prompt{flex:0 0 auto;margin:0;padding:0 2px;color:#173B52;font-size:21px!important}
.hook-stack>.question{flex:0 0 auto;height:auto!important;min-height:0}
.hook-stack .feedback[aria-hidden="true"]{display:none!important}
.stage-hook .hook-question>h2,.hook-stack>.question>h2{display:none}
[data-g4-role="hook-scene"]{position:relative;isolation:isolate;width:100%!important;height:206px!important;min-width:0;min-height:206px!important;flex:0 0 206px!important;display:block!important;grid-template-columns:1fr!important;overflow:hidden}
[data-g4-role~="visual-frame"]{position:relative;isolation:isolate;min-width:0;min-height:0;max-width:100%;overflow:hidden!important;contain:paint}
[data-g4-screen="hook"] [data-g4-role~="visual-frame"],.stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{width:min(760px,100%);min-height:206px;height:100%;margin-inline:auto;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
.stage-hook .hook-card{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
.hook-scene-visual{width:100%!important;max-width:100%!important;height:100%;min-height:130px;padding:14px 112px 14px 16px;box-sizing:border-box}
.hook-scene-visual>[data-g4-role~="visual-frame"]{height:100%;padding:0;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;contain:layout paint}
.hook-frame-bit{position:absolute;right:42px;bottom:-4px;z-index:4;width:88px;height:110px;overflow:hidden;pointer-events:none}
.hook-frame-bit>.g1-char,.hook-frame-bit>.bit,.hook-frame-bit>svg{width:100%;height:100%;display:block}
[data-g4-role~="visual-frame"] img,[data-g4-role~="visual-frame"] picture,[data-g4-role~="visual-frame"] video,[data-g4-role~="visual-frame"] canvas,[data-g4-role~="visual-frame"] svg{display:block;max-width:100%!important;max-height:100%!important;object-fit:contain;overflow:hidden!important}
.visual-shell,.attempt-model,.model-card,.test-model,.topic-visual,.conversion-visual,.time-visual,.area-visual,.length-visual,.mass-visual,.hook-model{min-width:0;min-height:0;max-width:100%;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;padding:8px 15px 8px 9px!important;border-radius:18px!important;display:grid!important;grid-template-columns:62px minmax(0,1fr)!important;align-items:center!important;gap:12px!important;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:62px!important;height:76px!important;display:block;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>.g1-char,.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>.bit,.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>svg{width:100%!important;height:100%!important}
.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:72px!important;border-radius:15px!important;grid-template-columns:51px minmax(0,1fr)!important;background:linear-gradient(135deg,#FFFFFF,#E7F3EC)!important;box-shadow:inset 5px 0 #227A53,0 13px 26px -23px rgba(34,122,83,.75)!important}
.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:51px!important;height:64px!important}
.lesson-root .feedback[data-g4-feedback="wrong"]{height:auto!important;min-height:88px!important;border-radius:18px!important;background:linear-gradient(135deg,#FFFFFF,#FFF5D9)!important;box-shadow:inset 5px 0 #A96F13,0 13px 26px -23px rgba(169,111,19,.72)!important}
.lesson-root .feedback[data-g4-role~="feedback-frame"] p{min-width:0;margin:0;font-family:'Manrope',system-ui,sans-serif!important;font-size:15px!important;line-height:1.42!important;text-align:left}
.rank-boost-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}.rank-boost-overlay .g4-title-reveal-title{font-size:58px!important}
[data-g4-role="title-card"]{position:relative;isolation:isolate;max-width:100%;overflow:hidden}
[data-g4-role="title-claim"]{font-family:'Manrope',system-ui,sans-serif}
.hook-scene-visual{width:min(760px,100%)!important;margin-inline:auto!important}
@media(max-width:639.98px){
  .lesson-root h1,.lesson-root [data-g4-role="hook-title"] h1{font-size:clamp(22px,6.2vw,28px)!important}
  .lesson-root [data-g4-role="hook-title"]{font-size:25px!important}
  .lesson-root .question h2,.lesson-root .hook-question-prompt{font-size:17px!important}
  [data-g4-role="hook-scene"]{height:164px!important;min-height:164px!important;flex:0 0 164px!important}
  [data-g4-screen="hook"] [data-g4-role~="visual-frame"],.stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  .hook-scene-visual{min-height:112px;padding:10px 78px 10px 11px}
  .hook-stack>.question .options,.stage-hook .hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  .hook-stack>.question .option,.stage-hook .hook-question .option{min-height:44px!important;grid-template-columns:1fr!important;justify-items:center!important;text-align:center!important}
  .hook-frame-bit{right:12px;bottom:-7px;width:68px;height:85px}
  .lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;grid-template-columns:54px minmax(0,1fr)!important;gap:9px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:54px!important;height:68px!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:68px!important;border-radius:15px!important;grid-template-columns:47px minmax(0,1fr)!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:47px!important;height:59px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important}.rank-boost-overlay .g4-title-reveal-title{font-size:29px!important}
}
.hook-scene-visual{display:grid!important;grid-template-rows:auto minmax(0,1fr)!important;gap:5px!important}
.hook-scene-visual>.frame-notes{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important}
.hook-scene-visual>.frame-notes .frame-note{min-height:42px!important;padding:4px!important;grid-template-columns:22px minmax(0,1fr)!important;gap:3px!important}
.hook-scene-visual>.frame-notes .frame-note>b{width:21px!important;height:21px!important}.hook-scene-visual>.frame-notes .frame-note span{font-size:8px!important;line-height:1.1!important}
.hook-scene-visual>.hook-model{height:100%!important;min-height:0!important;padding:4px!important;gap:3px!important}
@media(prefers-reduced-motion:reduce){.rank-boost-overlay,.rank-boost-overlay * ,[data-g4-role="title-card"],[data-g4-role="title-card"] *{animation:none!important;transition:none!important}.rank-boost-overlay{opacity:1}.g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}}
.lesson-root [class*="formula"],.lesson-root [class*="equation"]{font-family:'JetBrains Mono',monospace!important}
.hook-stack>.question[data-g4-role="answer-card"]{display:contents!important}
.hook-stack>.question[data-g4-role="answer-card"]:has(.feedback.open)>.options{display:none!important}
.lesson-root .question:has(.feedback[data-g4-feedback="solution"].open)>.options{display:none!important}
.lesson-root [data-g4-role="title-card"]{width:100%!important;min-height:116px!important;height:auto!important;margin:0!important;padding:12px 82px 11px 67px!important;border-radius:17px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:4px!important;color:#FFF!important;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978)!important;box-shadow:0 28px 58px -27px rgba(22,143,163,.8)!important}
.lesson-root [data-g4-role="title-card"] [data-g4-role="reward-bit"]{width:72px!important;height:90px!important}
.lesson-root [data-g4-role="title-card"] [data-g4-role="reward-medal"]{width:44px!important;height:44px!important}
@media(max-width:639.98px){
  .lesson-root [data-g4-role="title-card"]{min-height:88px!important;padding:9px 59px 8px 51px!important;border-radius:14px!important}
  .lesson-root [data-g4-role="title-card"] [data-g4-role="reward-bit"]{width:57px!important;height:71px!important}
  .lesson-root [data-g4-role="title-card"] [data-g4-role="reward-medal"]{width:34px!important;height:34px!important}
}
.lesson-root .hook-stack>.heading h1[data-g4-role="hook-title"]{font-size:36px!important}
@media(max-width:639.98px){.lesson-root .hook-stack>.heading h1[data-g4-role="hook-title"]{font-size:25px!important}}
`;

const STYLES = `${G4_TITLE_STYLES}
.stage-hook .hook-model{overflow:hidden;border:1px solid rgba(144,228,235,.12);background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}
.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{height:100%;min-height:0;overflow:hidden;display:grid;align-content:center;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;opacity:0;transform:translateY(7px)}.feedback.open{opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{font-size:13px;line-height:1.45}.caption{position:static;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:proof-in .35s ease both}.frac{display:inline-flex;min-width:25px;flex-direction:column;align-items:center;vertical-align:middle;color:inherit;font:800 1em/1 'Source Serif 4',Georgia,serif}.frac i{width:100%;height:2px;margin:2px 0;border-radius:2px;background:currentColor}.frac-lg{font-size:1.35em}.hook-model,.whole-card,.rule-card,.finale-payoff{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}
.lesson-root button:focus-visible,.lesson-root input:focus-visible,.lesson-root input[type='range']:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.hook-model{display:grid;place-items:center;gap:12px;background:linear-gradient(135deg,#E5F5F6,#FFF)}.fraction-model{width:min(620px,94%);margin:0 auto;display:grid;gap:10px}.fraction-bar{height:112px;display:grid;overflow:hidden;border-radius:18px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.fraction-bar i{min-width:0;border-right:2px solid rgba(23,59,82,.18);background:#F4F5F1;transition:background .45s ease,transform .45s ease}.fraction-bar i:last-child{border-right:0}.fraction-bar i.cyan{background:#46B8C5}.fraction-bar i.lime{background:#95C93D}.fraction-bar i.removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.12),rgba(255,91,53,.12) 7px,rgba(255,91,53,.42) 7px,rgba(255,91,53,.42) 14px)}.fraction-bar i.merged{background:linear-gradient(135deg,#168FA3,#95C93D)}.fraction-bar.whole i{border-right:0}.fraction-model.compact .fraction-bar{height:48px;border-radius:11px}.model-label{justify-self:center;padding:8px 13px;border-radius:12px;color:#173B52;background:#E5F5F6;font:900 16px "JetBrains Mono",monospace}.state-note,.formula-card,.result-chip{padding:12px 15px;border-radius:14px;opacity:.12;transform:translateY(7px);transition:.4s ease;text-align:center}.state-note{color:#227A53;background:#E7F3EC;font-size:13px;font-weight:850}.formula-card{color:#FFF;background:#173B52;font:900 17px "JetBrains Mono",monospace}.result-chip{justify-self:center;color:#FFF;background:#FF5B35;font:900 20px "JetBrains Mono",monospace}.show{opacity:1!important;transform:none!important}.tokens{display:flex;align-items:center;justify-content:center;gap:8px;color:#50616D;font-size:12px;font-weight:800}.tokens i{width:28px;height:28px;border-radius:9px;background:#95C93D;animation:token-pop .4s ease both}.tokens i:nth-child(2){animation-delay:.1s}.tokens i:nth-child(3){animation-delay:.2s}.rule-card,.whole-card{display:grid;gap:12px}.rule-line{padding:13px;border-radius:14px;opacity:.12;transform:translateY(6px);color:#173B52;background:#E5F5F6;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.rule-line.accent{color:#FFF;background:#173B52}.wrong-formula{padding:12px;position:relative;opacity:.12;color:#A96F13;background:#FFF5D9;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.wrong-formula::after{content:"";position:absolute;left:28%;right:28%;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.tank-model{width:min(560px,96%);margin:0 auto;display:grid;place-items:center;gap:10px}.tank-shell{width:min(360px,82%);height:210px;position:relative;padding:16px 16px 14px;border:5px solid ${T.navy};border-top:0;border-radius:0 0 34px 34px;background:rgba(255,255,255,.72);filter:drop-shadow(0 14px 16px rgba(${T.shadowBase},.13))}.tank-body{height:100%;overflow:hidden;border-radius:6px 6px 22px 22px;display:flex;flex-direction:column-reverse;background:#F4F5F1}.tank-body i{min-height:0;flex:1;border-top:2px solid rgba(23,59,82,.18);transition:background .38s ease,opacity .38s ease,transform .38s ease}.tank-body i:first-child{border-top:0}.tank-body i.tank-fill{background:linear-gradient(90deg,#46B8C5,${T.cyan})}.tank-body i.tank-outline{box-shadow:inset 0 0 0 3px ${T.lime}}.tank-body i.tank-removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.16),rgba(255,91,53,.16) 8px,rgba(255,91,53,.48) 8px,rgba(255,91,53,.48) 16px);animation:tank-out .42s ease both}.tank-shell.undivided .tank-body i{border-top-color:transparent}.tank-spout{width:76px;height:19px;position:absolute;left:-63px;top:-4px;border:5px solid ${T.navy};border-right:0;border-radius:13px 0 0 13px;background:#fff}.tank-handle{width:70px;height:90px;position:absolute;right:-46px;top:44px;border:12px solid ${T.navy};border-left:0;border-radius:0 38px 38px 0}.tank-model.compact .tank-shell{width:190px;height:92px;padding:7px;border-width:3px;border-radius:0 0 18px 18px}.tank-model.compact .tank-spout{width:32px;height:10px;left:-27px;border-width:3px}.tank-model.compact .tank-handle{width:34px;height:45px;right:-24px;top:18px;border-width:7px}.state-grid{margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.state-grid span{min-height:52px;padding:9px;border-radius:13px;display:grid;place-items:center;opacity:.12;transform:translateY(6px);color:${T.navy};background:${T.cyanSoft};text-align:center;font-size:11px;font-weight:850;transition:.38s ease}.boundary-grid{padding:18px;border-radius:22px;display:grid;grid-template-columns:1fr 1fr;gap:12px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.boundary-grid>div{padding:10px;border-radius:16px;opacity:.12;transform:translateY(6px);background:#F8F8F4;transition:.4s ease}.boundary-grid>.state-note{grid-column:1/-1}.hospital-model{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:14px;background:${T.cyanSoft}}.hospital-model>span{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;color:#fff;background:${T.accent};font:900 27px 'JetBrains Mono',monospace}.nl-arrow.back{border-right:0;border-left:3px solid ${T.accent};border-radius:14px 0 0 0}.nl-arrow.back::after{right:auto;left:-5px;border-left:0;border-right:8px solid ${T.accent}}.number-line{height:150px;position:relative;padding:54px 7% 0}.nl-track{height:4px;position:relative;border-radius:4px;background:#173B52}.nl-tick{width:2px;height:18px;position:absolute;top:-7px;background:#87949D}.nl-tick span{position:absolute;top:20px;left:50%;transform:translateX(-50%);font:800 12px "JetBrains Mono",monospace}.nl-dot{width:44px;height:38px;position:absolute;top:27px;transform:translateX(-50%);border-radius:12px;display:grid;place-items:center;color:#FFF;font:900 11px "JetBrains Mono",monospace;z-index:2;animation:dot-pop .35s ease both}.nl-dot.cyan{background:#168FA3}.nl-dot.lime{background:#95C93D}.nl-arrow{height:22px;position:absolute;top:84px;border-top:3px solid #FF5B35;border-right:3px solid #FF5B35;border-radius:0 14px 0 0;animation:arrow-grow .45s ease both}.nl-arrow::after{content:"";position:absolute;right:-5px;top:-7px;border-left:8px solid #FF5B35;border-top:5px solid transparent;border-bottom:5px solid transparent}.model-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.model-choices>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:26px 1fr;align-items:center;gap:6px;background:#FFF;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choices>div>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 10px "JetBrains Mono",monospace}.bit-error{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;color:#A96F13;background:#FFF5D9;font:900 19px "JetBrains Mono",monospace}.bit-error b{position:relative}.bit-error b::after{content:"";position:absolute;left:-5px;right:-5px;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.energy-model{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px}.energy-model>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;background:#FFF}.energy-model>div>span{font-size:23px}.energy-model>strong{text-align:center;color:#FF5B35;font-size:23px}.finale-heading{padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{color:#FF5B35;font:900 9px "JetBrains Mono",monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:#173B52;font:750 clamp(21px,3vw,28px)/1.08 "Source Serif 4",Georgia,serif}.finale-heading p{margin-top:4px!important;color:#50616D;font-size:11px}.finale-main{display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);gap:10px}.finale-payoff{display:grid;align-content:center;gap:8px}.finale-payoff>small{color:#168FA3;font-size:9px;font-weight:900;letter-spacing:.09em}.finale-answer{padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:#227A53;background:#E7F3EC;text-align:center;font:900 13px "JetBrains Mono",monospace;transition:.42s ease}.finale-takeaways{display:grid;gap:6px}.finale-takeaway{min-height:42px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px 1fr;align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:.42s ease}.finale-takeaway.show{background:#E5F5F6}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 9px "JetBrains Mono",monospace}.finale-takeaway span{display:grid;gap:2px;font-size:11px;font-weight:800}.finale-takeaway small{color:#168FA3;font-size:8px;text-transform:uppercase}.finale-takeaway strong{color:#173B52;font-family:"JetBrains Mono",monospace}.finale-bottom{display:grid;grid-template-columns:1.2fr .8fr;gap:10px}.finale-bridge{padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#FFF;background:#173B52;transition:.42s ease}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px "Source Serif 4",Georgia,serif}.finale-reward{min-height:100px;position:relative;overflow:hidden;padding:12px 70px 11px 52px;border-radius:17px;display:grid;align-content:center;color:#FFF;background:linear-gradient(135deg,#234B62,#173B52)}.finale-reward>div:nth-child(2){display:grid;gap:3px}.finale-reward small{color:#98E1E5;font-size:8px;font-weight:900}.finale-reward strong{font:750 14px "Source Serif 4",Georgia,serif}.finale-reward b{color:#FFE284;font:900 11px "JetBrains Mono",monospace}.finale-reward>.g1-char{position:absolute;right:2px;bottom:-5px;width:67px;height:84px}.finale-medal{position:absolute;left:10px;top:50%;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#173B52;background:#95C93D}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:#FF5B35}.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;justify-self:end;color:${T.accent};background:${T.accentSoft};cursor:pointer;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.marker-control{width:min(620px,94%);padding:10px 13px;border-radius:14px;display:grid;gap:7px;color:${T.navy};background:${T.cyanSoft};font:850 12px 'Manrope',sans-serif}.free-marker{width:100%;min-height:44px;margin:0;accent-color:${T.accent};cursor:pointer}.nl-dot.free{top:102px;background:${T.navy};animation-duration:.4s}.attempt-model{border-radius:20px;transition:box-shadow .32s ease,background .32s ease}.attempt-highlight{box-shadow:0 0 0 3px rgba(22,143,163,.38),0 14px 26px -20px rgba(22,143,163,.8)!important;background:rgba(229,245,246,.72)!important}.attempt-cue{padding:9px 12px;border-radius:12px;color:${T.cyan};background:${T.cyanSoft};font-size:12px;font-weight:850;animation:attempt-cue-in .3s ease both}.stack{animation-duration:.5s}.caption{animation:caption-in .32s ease both}.formula-card{transition-duration:.32s!important}.result-chip{transition-duration:.22s!important}
.frame-notes{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px}.frame-note{min-height:48px;padding:9px 11px;border-radius:13px;display:grid;grid-template-columns:25px 1fr;align-items:center;gap:8px;opacity:.12;transform:translateY(6px);color:${T.navy};background:${T.cyanSoft};font-size:12px;font-weight:800;transition:.36s ease}.frame-note>b{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 9px 'JetBrains Mono',monospace}
.group-board{display:grid;grid-template-columns:repeat(auto-fit,minmax(82px,1fr));gap:9px}.group-cell{min-height:94px;padding:8px;border-radius:15px;display:grid;align-content:space-between;gap:7px;background:#F4F5F1;box-shadow:inset 0 0 0 2px rgba(23,59,82,.12);transition:.4s ease}.group-cell>div{display:flex;flex-wrap:wrap;justify-content:center;gap:4px}.group-cell i{width:12px;height:12px;border-radius:4px;background:${T.cyan};box-shadow:0 3px 7px -5px rgba(23,59,82,.8)}.group-cell small{text-align:center;color:${T.ink2};font:900 10px 'JetBrains Mono',monospace}.group-cell.group-selected{background:${T.accentSoft};box-shadow:inset 0 0 0 3px rgba(255,91,53,.4)}.group-cell.group-selected i{background:${T.accent}}.group-board-compact{grid-template-columns:repeat(auto-fit,minmax(58px,1fr));gap:6px}.group-board-compact .group-cell{min-height:66px;padding:6px}.group-board-compact .group-cell i{width:9px;height:9px}.group-board-condensed{width:100%;grid-template-columns:repeat(6,minmax(0,1fr))}.group-board-condensed .group-cell{min-height:72px;padding:8px 5px;align-content:center}.group-board-condensed .group-condensed-count{align-items:center;flex-wrap:nowrap;gap:7px}.group-board-condensed .group-condensed-count i{width:16px;height:16px;flex:0 0 auto}.group-board-condensed .group-condensed-count b{color:${T.navy};font:900 15px 'JetBrains Mono',monospace}
.rule-flow{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px}.rule-flow span{padding:10px 12px;border-radius:12px;opacity:.12;transform:translateY(5px);color:${T.navy};background:${T.cyanSoft};font:850 12px 'Manrope',sans-serif;transition:.35s ease}.rule-flow b{color:${T.accent};font-size:18px}
.three-span-line{width:min(650px,96%);margin:0 auto;padding:30px 12px 8px}.three-span-track{height:22px;position:relative;display:grid;grid-template-columns:repeat(3,1fr);border-radius:999px;background:#EDF0ED;box-shadow:inset 0 0 0 3px rgba(23,59,82,.14)}.three-span-track::before{content:"";width:14px;height:14px;position:absolute;left:0;top:4px;border-radius:50%;background:${T.navy};z-index:2}.three-span-track span{position:relative;border-right:3px solid ${T.navy};transition:background .4s ease,transform .4s ease}.three-span-track span:first-child{border-radius:999px 0 0 999px}.three-span-track span:last-child{border-right:0;border-radius:0 999px 999px 0}.three-span-track span.span-highlighted{background:linear-gradient(90deg,${T.cyan},#46B8C5);animation:span-fill .42s ease both}.three-span-track i{width:14px;height:14px;position:absolute;right:-8px;top:4px;border-radius:50%;background:${T.navy};z-index:2}.three-span-track span:last-child i{right:-1px}.three-span-track small{position:absolute;left:50%;bottom:30px;transform:translateX(-50%);color:${T.ink2};font:900 11px 'JetBrains Mono',monospace}.three-span-labels{margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);color:${T.navy};font:900 12px 'JetBrains Mono',monospace}.three-span-labels b:nth-child(2),.three-span-labels b:nth-child(3){text-align:center}.three-span-labels b:last-child{text-align:right}.neutral-fact-cards{display:grid;grid-template-columns:repeat(2,minmax(120px,1fr));gap:10px}.neutral-fact-cards>span{min-height:82px;padding:10px;border-radius:16px;display:grid;place-items:center;gap:4px;background:${T.cyanSoft};box-shadow:0 12px 24px -22px rgba(${T.shadowBase},.7)}.neutral-fact-cards small{color:${T.ink2};font-size:10px;font-weight:900;text-transform:uppercase}.neutral-fact-cards strong{color:${T.navy};font:900 22px 'JetBrains Mono',monospace}
@keyframes span-fill{from{opacity:.35;transform:scaleX(.65);transform-origin:left}}@keyframes tank-out{from{opacity:0;transform:translateY(-10px)}}@keyframes caption-in{from{opacity:0;transform:translateY(5px)}}@keyframes attempt-cue-in{from{opacity:0;transform:translateY(5px)}}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(5px)}}@keyframes token-pop{from{opacity:0;transform:scale(.45)}}@keyframes dot-pop{from{opacity:0;transform:translateX(-50%) scale(.55)}}@keyframes arrow-grow{from{transform:scaleX(0);transform-origin:left}}@keyframes bit-move{to{transform:translateY(-2px) rotate(2deg)}}@keyframes pulse{to{transform:scale(1.07)}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.hook-model,.whole-card,.rule-card,.question{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.fraction-bar{height:82px}.tank-shell{width:min(292px,78%);height:168px}.state-grid{grid-template-columns:1fr 1fr}.boundary-grid{grid-template-columns:1fr}.boundary-grid>.state-note{grid-column:1}.hospital-model{padding-inline:7px}.model-choices{grid-template-columns:1fr}.energy-model{grid-template-columns:1fr}.energy-model>strong{transform:rotate(90deg)}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-main,.finale-bottom{gap:8px}.finale-takeaway{min-height:36px}.number-line{height:135px;padding-inline:9%}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.state-note,.formula-card,.result-chip,.rule-line,.wrong-formula,.finale-answer,.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}}
.caption-slot{flex:none;min-height:38px;padding:6px 10px;border-radius:11px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:10px;line-height:1.22}.caption-slot.is-visible{visibility:visible}.feedback.feedback-slot{height:76px;min-height:76px;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1}.feedback-bit{width:48px;height:58px;display:block}.feedback-bit .g1-char,.feedback-bit>svg{width:100%;height:100%}.feedback-proof{display:block;margin-top:4px;padding-top:4px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 12px/1.2 'JetBrains Mono',monospace}.feedback-proof small{display:block;font-size:8px;letter-spacing:.1em}.lesson-root{height:100dvh!important;min-height:0!important;overflow:hidden!important}.stage-content{display:flex;flex-direction:column;gap:4px;overflow:hidden!important}.stage-content>.stack{flex:1;min-height:0}.btn-white-accent:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:7px!important;padding-bottom:4px!important}.lesson-root-preview .stage-header{padding-top:48px!important}.progress-track{height:4px!important;margin-bottom:5px!important}.stage-content{padding-top:3px!important;padding-bottom:3px!important}.stage-nav{min-height:52px!important}.stack{gap:4px!important}.heading{min-height:40px!important}.heading h1{font-size:17px!important}.heading .g1-char{width:38px!important;height:48px!important}.question,.model-card,.visual-card,.hook-model,.whole-card,.rule-card,.beat-list{padding:5px!important;border-radius:11px!important}.options{gap:3px!important}.option{min-height:44px!important;padding:4px!important;border-radius:9px!important;font-size:9px!important}.feedback.feedback-slot{height:54px;min-height:54px!important;padding:4px 6px!important;grid-template-columns:32px 1fr!important;gap:4px!important}.feedback-bit{width:31px;height:39px}.feedback p{font-size:9px!important;line-height:1.16!important}.caption-slot{min-height:28px;padding:3px 7px;font-size:8px}.beat-list{gap:3px!important}.beat{min-height:29px!important;padding:3px!important;font-size:8px!important}.btn-white-accent,.btn-ghost{min-height:44px!important;min-width:104px!important;padding:0 8px!important;font-size:11px!important}.finale-main,.finale-bottom{grid-template-columns:1fr 1fr!important;gap:4px!important}}
.strategy-replay{min-height:44px;padding:7px 12px;border:0;border-radius:11px;justify-self:center;color:${T.cyan};background:${T.cyanSoft};cursor:pointer;font-size:11px;font-weight:850}.strategy-replay:disabled{cursor:not-allowed;opacity:.46}
.lesson-frame .preview-language{display:none!important}.strategy-slot{height:76px;position:relative}.strategy-slot>.strategy-replay,.strategy-slot>.feedback{position:absolute;inset:0;width:100%}.strategy-slot>.strategy-replay.is-hidden{visibility:hidden}
@media(max-width:639.98px){.lesson-frame .lesson-root-preview .stage-header{padding-top:52px!important}.strategy-slot{height:54px}.stage-hook [data-g4-role="answer-card"]{font-size:14px!important}}
.final-reflection{padding:6px 8px;border-radius:12px;display:grid;gap:5px;background:rgba(255,255,255,.9)}.final-reflection>strong{font:750 12px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button{min-height:44px;padding:4px;border:0;border-radius:9px;display:grid;grid-template-columns:20px 1fr;align-items:center;gap:3px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:8px;font-weight:850}.final-reflection button>span{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}.g4-title-claim:disabled{cursor:not-allowed;opacity:.46}
@media(max-height:800px) and (min-width:640px){.stage-hook .stack{gap:8px}.stage-hook .heading{min-height:58px}.stage-hook .heading h1{font-size:28px}.stage-hook .heading .g1-char{width:58px;height:72px}.stage-hook .frame-notes{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}.stage-hook .frame-note{min-height:44px;padding:5px 7px;grid-template-columns:22px 1fr;gap:5px;font-size:10px}.stage-hook .hook-model{padding:8px}.stage-hook .group-cell{min-height:62px;padding:5px}.stage-hook .question{padding:9px;gap:6px}.stage-hook .question h2{font-size:16px}.stage-hook .option{min-height:50px;padding:6px}.stage-hook .feedback.feedback-slot{height:62px;min-height:62px!important;padding:7px 9px}}
@media(min-width:640px) and (max-width:1100px) and (max-height:800px){.stage-hook .stack{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:auto auto minmax(0,1fr);align-content:stretch;column-gap:12px;row-gap:8px}.stage-hook .heading,.stage-hook .frame-notes{grid-column:1/-1}.stage-hook .hook-model,.stage-hook .question{min-width:0;align-self:stretch}.stage-hook .hook-model{display:grid;align-content:center}.stage-hook .group-board{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.stage-hook .group-cell{min-height:66px}.stage-hook .question{display:grid;align-content:start}.stage-hook .feedback.feedback-slot{height:70px;min-height:70px!important}}
@media(max-width:639.98px){.lesson-frame .stage-header{padding-top:11px!important}.lesson-frame .lesson-root-preview .stage-header{padding-top:52px!important}.stage-hook .stack{align-content:stretch;gap:3px}.stage-hook .heading{min-height:38px}.stage-hook .heading h1{font-size:16px!important}.stage-hook .heading .g1-char{width:34px!important;height:43px!important}.stage-hook .frame-notes{grid-template-columns:repeat(4,minmax(0,1fr));gap:3px}.stage-hook .frame-note{min-height:44px;padding:3px;grid-template-columns:16px minmax(0,1fr);gap:2px;font-size:7px;line-height:1.05}.stage-hook .frame-note>b{width:16px;height:16px;border-radius:5px;font-size:7px}.stage-hook .hook-model{padding:4px!important}.stage-hook .group-board{grid-template-columns:repeat(6,minmax(0,1fr));gap:3px}.stage-hook .group-cell{min-height:52px;padding:3px;border-radius:8px;gap:2px}.stage-hook .group-cell>div{gap:2px}.stage-hook .group-cell i{width:7px;height:7px;border-radius:2px}.stage-hook .group-cell small{font-size:8px}.stage-hook .question{gap:3px!important}.stage-hook .question h2{font-size:11px;line-height:1.12}.stage-hook .options{grid-template-columns:repeat(3,minmax(0,1fr))}.stage-hook .option{font-size:8px!important}.stage-hook .feedback.feedback-slot{height:52px;min-height:52px!important}.stage-consolidation .stack{align-content:stretch;gap:3px}.stage-consolidation .frame-notes{grid-template-columns:repeat(5,minmax(0,1fr));gap:3px}.stage-consolidation .frame-note{min-height:44px;padding:3px;grid-template-columns:16px minmax(0,1fr);gap:2px;font-size:7px;line-height:1.05}.stage-consolidation .frame-note>b{width:16px;height:16px;border-radius:5px;font-size:7px}.stage-consolidation .boundary-grid{padding:4px;grid-template-columns:repeat(2,minmax(0,1fr));gap:3px}.stage-consolidation .boundary-grid>div{padding:3px;border-radius:8px}.stage-consolidation .boundary-grid>.state-note{grid-column:1/-1;min-height:28px;padding:3px}.stage-consolidation .group-board-compact{grid-template-columns:repeat(4,minmax(0,1fr));gap:2px}.stage-consolidation .group-board-compact .group-cell{min-height:44px;padding:2px;border-radius:6px}.stage-consolidation .group-board-compact .group-cell>div{gap:1px}.stage-consolidation .group-board-compact .group-cell i{width:5px;height:5px;border-radius:2px}.stage-consolidation .strategy-slot{height:48px}.stage-consolidation .strategy-replay{min-height:44px}}
.stage-hook .group-board-condensed{width:100%;grid-template-columns:repeat(6,minmax(0,1fr))}
@media(min-width:640px) and (max-width:1100px) and (max-height:800px){.stage-hook .group-board-condensed{grid-template-columns:repeat(6,minmax(0,1fr));gap:4px}.stage-hook .group-board-condensed .group-cell{min-height:58px;padding:5px 2px}.stage-hook .group-board-condensed .group-condensed-count{gap:3px}.stage-hook .group-board-condensed .group-condensed-count i{width:10px;height:10px}.stage-hook .group-board-condensed .group-condensed-count b{font-size:10px}}
@media(max-width:639.98px){.stage-hook .group-board-condensed{grid-template-columns:repeat(6,minmax(0,1fr));gap:3px}.stage-hook .group-board-condensed .group-cell{min-height:52px;padding:3px 1px}.stage-hook .group-board-condensed .group-condensed-count{gap:3px}.stage-hook .group-board-condensed .group-condensed-count i{width:10px;height:10px}.stage-hook .group-board-condensed .group-condensed-count b{font-size:10px}}
`;
