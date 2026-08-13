import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 23-DARS · Kasrli masalalar
// Approved frame vector: 3,4,4,4,4,4,4,5,2,2,2,2,2,3,5.

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const LESSON_META = {
  lessonId: 'frac-4-23-v1',
  slug: 'dars23-kasrli-masalalar',
  lessonTitle: { uz: "23-dars. Kasrli masalalar", ru: 'Урок 23. Задачи с дробями', en: 'Lesson 23. Fraction problems' },
  skillTags: ['fraction_word_problems', 'find_part', 'find_whole', 'equal_groups', 'inverse_check'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'StoryChoice', mechanic: 'StoryChoice', goal: 'Predict how to recover a whole from a known fraction', misconceptions: ['known part treated as whole'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'model', subtype: 'known-share-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Represent the known share with equal groups', misconceptions: ['unequal groups'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'one-part-recovery', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Recover one equal part from several known parts', misconceptions: ['divide by denominator first'], active: true, scored: false, scope: null },
  { id: 's3', type: 'discovery', subtype: 'whole-recovery', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Build all denominator parts to recover the whole', misconceptions: ['multiply by numerator'], active: true, scored: false, scope: null },
  { id: 's4', type: 'discovery', subtype: 'operation-sequence', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Discover divide-by-numerator then multiply-by-denominator', misconceptions: ['reversed operation order'], active: true, scored: false, scope: null },
  { id: 's5', type: 'rule', subtype: 'whole-from-fraction-rule', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Formulate the recovery rule', misconceptions: ['numerator and denominator swapped'], active: true, scored: false, scope: null },
  { id: 's6', type: 'strategy', subtype: 'inverse-check-strategy', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Check the recovered whole by finding its fraction', misconceptions: ['no inverse check'], active: true, scored: false, scope: null },
  { id: 's7', type: 'consolidation', subtype: 'formula-transfer', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Transfer the recovery strategy to a new model', misconceptions: ['wrong group count'], active: true, scored: false, scope: null },
  { id: 's8', type: 'test', subtype: 'model-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Recover a whole from a represented fraction', misconceptions: ['known share treated as one part'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's9', type: 'test', subtype: 'numeric-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Apply the recovery operation sequence', misconceptions: ['wrong operation order'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'strategy', subtype: 'operation-choice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Choose a justified whole-recovery strategy', misconceptions: ['unrelated operation'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's11', type: 'test', subtype: 'transfer-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Recover a whole in another representation', misconceptions: ['denominator ignored'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's12', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepairChoice', mechanic: 'ErrorRepairChoice', goal: "Repair Bit's fraction-of-number calculation", misconceptions: ['finding a fraction instead of the whole'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'case', subtype: 'life-context-transfer', template: 'CaseChoice', mechanic: 'CaseChoice', goal: 'Recover a total quantity in a life context', misconceptions: ['part and whole swapped'], active: true, scored: true, scoreUnits: 1, scope: 'final' },
  { id: 's14', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', mechanic: 'ReflectionClaim', goal: 'Reflect on recovery and bridge forward', misconceptions: ['partial result check'], active: true, scored: false, scope: null },
];

const bi = (uz, ru, en) => ({ uz, ru, en });

const CONTENT = {
  s0: {
    eyebrow: bi("Sug'orish baki", "Бак для полива", 'Watering tank'),
    title: bi("18 litr suv bakning 3/5 qismini to'ldirdi", "18 литров воды заполнили 3/5 бака", '18 litres of water filled 3/5 of the tank'),
    question: bi("To'liq bakka necha litr suv sig'adi?", "Сколько литров воды вмещает полный бак?", 'How many litres of water does the full tank hold?'),
    frames: [
      bi("Bakdagi suv: 18 litr", "В баке: 18 литров", 'Water in the tank: 18 litres'),
      bi("To'lgan qism: 3/5", "Заполненная часть: 3/5", 'Filled part: 3/5'),
      bi("Bak sig'imi: ? litr", "Вместимость бака: ? литров", 'Tank capacity: ? litres'),
    ],
    options: [
      bi("24 litr", "24 литра", '24 litres'),
      bi("30 litr", "30 литров", '30 litres'),
      bi("45 litr", "45 литров", '45 litres'),
    ],
    visualLabel: bi("Besh teng bo'limli bakning uch bo'limi o'n sakkiz litr suv bilan to'lgan.", "Три из пяти равных частей бака заполнены восемнадцатью литрами воды.", "Three of the tank's five equal sections contain eighteen litres of water."),
    filledLabel: bi("18 litr = 3/5", "18 литров = 3/5", '18 litres = 3/5'),
    capacityLabel: bi("To'liq sig'im: ? litr", "Полная вместимость: ? литров", 'Full capacity: ? litres'),
    neutral: bi("Taxmin saqlandi. Endi ma'lum suv miqdoridan bakning to'liq sig'imini topamiz.", "Предположение сохранено. Теперь найдём полную вместимость бака по известному количеству воды.", "Your prediction has been recorded. Now we will use the known amount of water to find the tank's full capacity."),
    audio: { intro: {
      uz: ["Bog'ni sug'orish uchun bakka o'n sakkiz litr suv quyildi.", "Bu suv bakning beshdan uch qismini to'ldirdi.", "Bak to'la bo'lsa, unga necha litr suv sig'ishini taxmin qiling."],
      ru: ["Для полива сада в бак налили восемнадцать литров воды.", "Эта вода заполнила три пятых бака.", "Предположите, сколько литров воды вмещает полный бак."],
      en: ['Eighteen litres of water were poured into a tank for watering the garden.', 'This water filled three fifths of the tank.', 'Predict how many litres of water the full tank holds.'],
    } },
  },
  s1: {
    eyebrow: bi("Masala yo'nalishi", "Направление задачи", 'Problem direction'),
    title: bi("Qismgami yoki butungami?", "К части или к целому?", 'Towards the part or the whole?'),
    frames: [
      bi("Butun ma'lum: N", "Целое известно: N", 'Whole known: N'),
      bi("Qism noma'lum: P = ?", "Часть неизвестна: P = ?", 'Part unknown: P = ?'),
      bi("Qism ma'lum: P", "Часть известна: P", 'Part known: P'),
      bi("Butun noma'lum: N = ?", "Целое неизвестно: N = ?", 'Whole unknown: N = ?'),
    ],
    audio: {
      uz: ["Birinchi turda butun son ma'lum bo'ladi.", "Undan kasrga mos qismni topamiz.", "Ikkinchi turda kasrga mos qismning qiymati ma'lum bo'ladi.", "Undan butun miqdorni tiklaymiz."],
      ru: ["В первом типе известно целое число.", "По нему находим часть, соответствующую дроби.", "Во втором типе известно значение дробной части.", "По нему восстанавливаем целое количество."],
      en: ['In the first type, the whole number is known.', 'Use it to find the part represented by the fraction.', 'In the second type, the value of the fractional part is known.', 'Use it to reconstruct the whole amount.'],
    },
  },
  s2: {
    eyebrow: bi("Butundan qismga", "От целого к части", 'From the whole to the part'),
    title: bi("40 ning 3/5 qismi", "3/5 от 40", '3/5 of 40'),
    frames: [
      bi("Butun: 40", "Целое: 40", 'Whole: 40'),
      bi("5 ta teng guruh", "5 равных групп", '5 equal groups'),
      bi("40 ÷ 5 = 8", "40 ÷ 5 = 8", '40 ÷ 5 = 8'),
      bi("1/5 qism = 8", "1/5 = 8", '1/5 part = 8'),
    ],
    audio: {
      uz: ["Bu masalada butun miqdor qirq ekanini bilamiz.", "Maxraj besh, shuning uchun butunni beshta teng guruhga ajratamiz.", "Qirqni beshga bo'lsak, sakkiz chiqadi.", "Demak, beshdan bir qismning qiymati sakkiz."],
      ru: ["В этой задаче известно целое сорок.", "Знаменатель пять, поэтому делим целое на пять равных групп.", "Сорок делим на пять и получаем восемь.", "Значит, одна пятая равна восьми."],
      en: ['In this problem, the whole, forty, is known.', 'The denominator is five, so divide the whole into five equal groups.', 'Divide forty by five to get eight.', 'Therefore, one fifth equals eight.'],
    },
  },
  s3: {
    eyebrow: bi("Butundan qismga", "От целого к части", 'From the whole to the part'),
    title: bi("Uchta ulushni olamiz", "Берём три доли", 'Take three parts'),
    frames: [
      bi("3 guruh: 8 + 8 + 8", "3 группы: 8 + 8 + 8", '3 groups: 8 + 8 + 8'),
      bi("8 × 3 = 24", "8 × 3 = 24", '8 × 3 = 24'),
      bi("40 ning 3/5 qismi = 24", "3/5 от 40 = 24", '3/5 of 40 = 24'),
      bi("24 + 16 = 40 ✓", "24 + 16 = 40 ✓", '24 + 16 = 40 ✓'),
    ],
    audio: {
      uz: ["Surat uch, shuning uchun sakkiztadan uchta guruh olinadi.", "Sakkizni uchga ko'paytirib, yigirma to'rtni topamiz.", "Qirqning beshdan uch qismi yigirma to'rtga teng.", "Qolgan beshdan ikki qism o'n olti. Yigirma to'rt bilan o'n olti butun qirqni tiklaydi."],
      ru: ["Числитель три, поэтому берём три группы по восемь.", "Восемь умножаем на три и получаем двадцать четыре.", "Три пятых от сорока равны двадцати четырём.", "Оставшиеся две пятых равны шестнадцати. Двадцать четыре и шестнадцать восстанавливают целое сорок."],
      en: ['The numerator is three, so take three groups of eight.', 'Multiply eight by three to get twenty-four.', 'Three fifths of forty equals twenty-four.', 'The remaining two fifths equals sixteen. Twenty-four plus sixteen reconstructs the whole, forty.'],
    },
  },
  s4: {
    eyebrow: bi("Qismdan butunga", "От части к целому", 'From the part to the whole'),
    title: bi("3/5 qism 18 ga teng", "3/5 равны 18", '3/5 equals 18'),
    frames: [
      bi("3 ta ulush = 18", "3 доли = 18", '3 parts = 18'),
      bi("18 ÷ 3 = 6", "18 ÷ 3 = 6", '18 ÷ 3 = 6'),
      bi("1 ta ulush = 6", "1 доля = 6", '1 part = 6'),
      bi("1/5 qism = 6", "1/5 = 6", '1/5 part = 6'),
    ],
    audio: {
      uz: ["Ma'lum o'n sakkiz litr suv uchta teng ulushni bildiradi.", "Bitta ulushni topish uchun o'n sakkizni suratdagi uchga bo'lamiz.", "Har bir ulush olti litrga teng.", "Bu olti litr bak sig'imining beshdan bir qismidir."],
      ru: ["Известные восемнадцать литров воды обозначают три равные доли.", "Чтобы найти одну долю, делим восемнадцать на числитель три.", "Каждая доля равна шести литрам.", "Эти шесть литров составляют одну пятую вместимости бака."],
      en: ['The known eighteen litres of water represent three equal parts.', 'To find one part, divide eighteen by the numerator, three.', 'Each part equals six litres.', "Those six litres make up one fifth of the tank's capacity."],
    },
  },
  s5: {
    eyebrow: bi("Qismdan butunga", "От части к целому", 'From the part to the whole'),
    title: bi("Barcha beshta ulushni yig'amiz", "Соберём все пять долей", 'Combine all five parts'),
    frames: [
      bi("1 ta ulush = 6", "1 доля = 6", '1 part = 6'),
      bi("Butun = 5 ta ulush", "Целое = 5 долей", 'Whole = 5 parts'),
      bi("6 × 5 = 30", "6 × 5 = 30", '6 × 5 = 30'),
      bi("Bak sig'imi = 30 litr", "Вместимость бака = 30 литров", 'Tank capacity = 30 litres'),
    ],
    audio: {
      uz: ["Bitta teng ulush olti litrga teng.", "Maxraj besh, demak bakning to'liq sig'imi beshta shunday ulushdan tuzilgan.", "Oltini beshga ko'paytirib, o'ttizni topamiz.", "Shunday qilib, bakning to'liq sig'imi o'ttiz litr."],
      ru: ["Одна равная доля равна шести литрам.", "Знаменатель пять, значит полная вместимость бака состоит из пяти таких долей.", "Умножаем шесть на пять и получаем тридцать.", "Значит, полная вместимость бака равна тридцати литрам."],
      en: ['One equal part equals six litres.', "The denominator is five, so the tank's full capacity consists of five such parts.", 'Multiply six by five to get thirty.', "Therefore, the tank's full capacity is thirty litres."],
    },
  },
  s6: {
    eyebrow: bi("Ikki yo'l", "Два пути", 'Two paths'),
    title: bi("Qismni va butunni topish", "Нахождение части и целого", 'Finding the part and the whole'),
    frames: [
      bi("Butun N ma'lum → qism P noma'lum", "Целое N известно → часть P неизвестна", 'Whole N known → part P unknown'),
      bi("P = N ÷ b × a", "P = N ÷ b × a", 'P = N ÷ b × a'),
      bi("Qism P ma'lum → butun N noma'lum", "Часть P известна → целое N неизвестно", 'Part P known → whole N unknown'),
      bi("N = P ÷ a × b", "N = P ÷ a × b", 'N = P ÷ a × b'),
    ],
    audio: {
      uz: ["Butun ma'lum bo'lsa, avval uni maxrajga bo'lamiz.", "Keyin bitta ulushni suratga ko'paytirib, qismni topamiz.", "Qism ma'lum bo'lsa, avval uni suratga bo'lib, bitta ulushni tiklaymiz.", "Keyin bitta ulushni maxrajga ko'paytirib, butunni topamiz."],
      ru: ["Если известно целое, сначала делим его на знаменатель.", "Затем умножаем одну долю на числитель и находим часть.", "Если известна часть, сначала делим её на числитель и восстанавливаем одну долю.", "Затем умножаем одну долю на знаменатель и находим целое."],
      en: ['If the whole is known, first divide it by the denominator.', 'Then multiply one part by the numerator to find the required part.', 'If the part is known, first divide it by the numerator to reconstruct one part.', 'Then multiply one part by the denominator to find the whole.'],
    },
  },
  s7: {
    eyebrow: bi("Ikki yo'l tekshiruvi", "Проверка двух путей", 'Check both paths'),
    title: bi("49 va uning 4/7 qismi", "49 и его часть 4/7", '49 and its 4/7 part'),
    frames: [
      bi("Butun: 49", "Целое: 49", 'Whole: 49'),
      bi("49 ÷ 7 = 7", "49 ÷ 7 = 7", '49 ÷ 7 = 7'),
      bi("7 × 4 = 28", "7 × 4 = 28", '7 × 4 = 28'),
      bi("28 ÷ 4 = 7", "28 ÷ 4 = 7", '28 ÷ 4 = 7'),
      bi("7 × 7 = 49 ✓", "7 × 7 = 49 ✓", '7 × 7 = 49 ✓'),
    ],
    audio: {
      uz: ["Butun qirq to'qqizdan boshlaymiz.", "Yetti teng ulushning har biri yettiga teng.", "To'rtta ulush yigirma sakkizni beradi.", "Endi ma'lum qism yigirma sakkizni surat to'rtga bo'lib, yana bitta ulush yettini topamiz.", "Uni maxraj yettiga ko'paytirib, boshlang'ich butun qirq to'qqizga qaytamiz."],
      ru: ["Начинаем с целого сорок девять.", "Каждая из семи равных долей равна семи.", "Четыре доли дают двадцать восемь.", "Теперь делим известную часть двадцать восемь на числитель четыре и снова получаем одну долю семь.", "Умножаем её на знаменатель семь и возвращаемся к исходному целому сорок девять."],
      en: ['Start with the whole, forty-nine.', 'Each of the seven equal parts equals seven.', 'Four parts make twenty-eight.', 'Now divide the known part, twenty-eight, by the numerator, four, to get one part, seven, again.', 'Multiply it by the denominator, seven, to return to the original whole, forty-nine.'],
    },
  },
  s8: {
    eyebrow: bi("Mashq · 1/6", "Тренировка · 1/6", 'Practice · 1/6'),
    title: bi("Butundan qismga", "От целого к части", 'From the whole to the part'),
    question: bi("27 ning 2/3 qismi nechaga teng?", "Чему равны 2/3 от 27?", 'What is 2/3 of 27?'),
    frames: [bi("Butun 27 → 3 teng ulush", "Целое 27 → 3 равные доли", 'Whole 27 → 3 equal parts'), bi("2 ta ulush = ?", "2 доли = ?", '2 parts = ?')],
    options: ["18", "9", "54"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 27 ÷ 3 = 9; 9 × 2 = 18.", "Верно. 27 ÷ 3 = 9; 9 × 2 = 18.", 'Correct. 27 ÷ 3 = 9, and 9 × 2 = 18.'),
      bi("Bu faqat 1/3 qism.", "Это только 1/3.", 'That is only the 1/3 part.'),
      bi("Siz 27 ni surat 2 ga ko'paytirdingiz, maxraj ishlamadi.", "Ты умножил 27 на числитель 2, но не использовал знаменатель.", 'You multiplied 27 by the numerator 2 without using the denominator.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Yigirma yettini uchga bo'lsak to'qqiz, to'qqizni ikkiga ko'paytirsak o'n sakkiz.", "Верно. Двадцать семь делим на три и получаем девять, затем девять умножаем на два и получаем восемнадцать.", 'Correct. Divide twenty-seven by three to get nine, then multiply nine by two to get eighteen.'),
      bi("Bu faqat uchdan bir qism.", "Это только одна треть.", 'That is only one third.'),
      bi("Siz yigirma yettini surat ikkiga ko'paytirdingiz, ammo maxrajni ishlatmadingiz.", "Ты умножил двадцать семь на числитель два, но не использовал знаменатель.", 'You multiplied twenty-seven by the numerator two without using the denominator.'),
    ],
    proof: bi("27 ÷ 3 × 2 = 18", "27 ÷ 3 × 2 = 18", '27 ÷ 3 × 2 = 18'),
    audio: { intro: {
      uz: ["Butun yigirma yetti ma'lum, demak bu qismni topish masalasi.", "Avval uchdan birni, so'ng uchdan ikki qismni toping."],
      ru: ["Известно целое двадцать семь, значит это задача на нахождение части.", "Сначала найди одну треть, затем две трети."],
      en: ['The whole, twenty-seven, is known, so this problem asks for a part.', 'First find one third, then two thirds.'],
    }, on_correct: bi("To'g'ri. Yigirma yettining uchdan ikki qismi o'n sakkiz.", "Верно. Две трети от двадцати семи равны восемнадцати.", 'Correct. Two thirds of twenty-seven equals eighteen.') },
  },
  s9: {
    eyebrow: bi("Mashq · 2/6", "Тренировка · 2/6", 'Practice · 2/6'),
    title: bi("Qismdan butunga", "От части к целому", 'From the part to the whole'),
    question: bi("21 ta modul jamining 3/4 qismi. Jami nechta?", "21 модуль составляет 3/4 целого. Сколько всего?", '21 modules are 3/4 of the whole. How many are there altogether?'),
    frames: [bi("3 ta ulush = 21", "3 доли = 21", '3 parts = 21'), bi("4 ta ulush = ?", "4 доли = ?", '4 parts = ?')],
    options: ["28", "7", "63"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 21 ÷ 3 = 7; 7 × 4 = 28.", "Верно. 21 ÷ 3 = 7; 7 × 4 = 28.", 'Correct. 21 ÷ 3 = 7, and 7 × 4 = 28.'),
      bi("Bu bitta 1/4 ulush, butun emas.", "Это одна доля 1/4, а не целое.", 'That is one 1/4 part, not the whole.'),
      bi("Siz ma'lum uchta ulushni yana 3 ga ko'paytirdingiz.", "Ты снова умножил известные три доли на 3.", 'You multiplied the known three parts by 3 again.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Yigirma birni uchga bo'lsak yetti, yettini to'rtga ko'paytirsak yigirma sakkiz.", "Верно. Двадцать один делим на три и получаем семь, затем семь умножаем на четыре и получаем двадцать восемь.", 'Correct. Divide twenty-one by three to get seven, then multiply seven by four to get twenty-eight.'),
      bi("Bu bitta to'rtdan ulush, butun emas.", "Это одна четвёртая доля, а не целое.", 'That is one quarter, not the whole.'),
      bi("Siz ma'lum uchta ulushni yana uchga ko'paytirdingiz. Avval bitta ulushni toping.", "Ты снова умножил известные три доли на три. Сначала найди одну долю.", 'You multiplied the known three parts by three again. Find one part first.'),
    ],
    proof: bi("21 ÷ 3 × 4 = 28", "21 ÷ 3 × 4 = 28", '21 ÷ 3 × 4 = 28'),
    audio: { intro: {
      uz: ["Yigirma bitta modul butunning to'rtdan uch qismini bildiradi.", "Avval bitta ulushni, keyin barcha to'rtta ulushni tiklang."],
      ru: ["Двадцать один модуль составляет три четверти целого.", "Сначала восстанови одну долю, затем все четыре доли."],
      en: ['Twenty-one modules make up three quarters of the whole.', 'First reconstruct one part, then all four parts.'],
    }, on_correct: bi("To'g'ri. Jami yigirma sakkizta modul bor.", "Верно. Всего двадцать восемь модулей.", 'Correct. There are twenty-eight modules altogether.') },
  },
  s10: {
    eyebrow: bi("Mashq · 3/6", "Тренировка · 3/6", 'Practice · 3/6'),
    title: bi("Masala turini aniqlang", "Определи тип задачи", 'Identify the problem type'),
    question: bi("36 sensorning 5/6 qismi tekshirildi. Nima noma'lum?", "5/6 от 36 датчиков проверены. Что неизвестно?", '5/6 of 36 sensors have been checked. What is unknown?'),
    frames: [bi("Jami 36 ta sensor ma'lum", "Всего 36 датчиков известно", 'The total of 36 sensors is known'), bi("Tekshirilgan sensorlar: ?", "Проверенные датчики: ?", 'Checked sensors: ?')],
    options: [bi("Qismni topish", "Найти часть", 'Find the part'), bi("Butunni topish", "Найти целое", 'Find the whole'), bi("Maxrajni topish", "Найти знаменатель", 'Find the denominator')], correctIndex: 0,
    feedback: [
      bi("To'g'ri. Butun ma'lum, qism noma'lum.", "Верно. Целое известно, часть неизвестна.", 'Correct. The whole is known and the part is unknown.'),
      bi("Butun allaqachon 36 deb berilgan.", "Целое уже дано: 36.", 'The whole has already been given as 36.'),
      bi("Maxraj 6 ham berilgan; noma'lum sensorlar qismi.", "Знаменатель 6 тоже дан; неизвестно число датчиков в части.", 'The denominator 6 is also given; the number of sensors in the part is unknown.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Butun ma'lum, qism noma'lum.", "Верно. Целое известно, часть неизвестна.", 'Correct. The whole is known and the part is unknown.'),
      bi("Butun allaqachon o'ttiz olti deb berilgan.", "Целое уже дано и равно тридцати шести.", 'The whole has already been given as thirty-six.'),
      bi("Maxraj olti ham berilgan. Noma'lum miqdor sensorlar qismi.", "Знаменатель шесть тоже дан. Неизвестно число датчиков в части.", 'The denominator six is also given. The number of sensors in the part is unknown.'),
    ],
    proof: bi("Bu qismni topish masalasi.", "Это задача на нахождение части.", 'This problem asks us to find the part.'),
    audio: { intro: {
      uz: ["Masalada jami o'ttiz oltita sensor borligi ma'lum.", "Oltidan besh qismga mos sensorlar soni so'ralgan. Masala turini tanlashingiz mumkin."],
      ru: ["В задаче известно, что всего тридцать шесть датчиков.", "Нужно найти число датчиков, соответствующее пяти шестым. Можешь выбрать тип задачи."],
      en: ['The problem tells us that there are thirty-six sensors altogether.', 'We need to find the number of sensors represented by five sixths. You may choose the problem type.'],
    }, on_correct: bi("To'g'ri. Bu butundan qismga boradigan masala.", "Верно. Это задача от целого к части.", 'Correct. This problem goes from the whole to the part.') },
  },
  s11: {
    eyebrow: bi("Mashq · 4/6", "Тренировка · 4/6", 'Practice · 4/6'),
    title: bi("Butunni tiklang", "Восстанови целое", 'Reconstruct the whole'),
    question: bi("5/8 qism 25 ga teng. 8/8 qism nechaga teng?", "5/8 равны 25. Чему равны 8/8?", '5/8 equals 25. What does 8/8 equal?'),
    frames: [bi("5 ta ulush = 25", "5 долей = 25", '5 parts = 25'), bi("8 ta ulush = ?", "8 долей = ?", '8 parts = ?')],
    options: ["40", "5", "200"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 25 ÷ 5 = 5; 5 × 8 = 40.", "Верно. 25 ÷ 5 = 5; 5 × 8 = 40.", 'Correct. 25 ÷ 5 = 5, and 5 × 8 = 40.'),
      bi("Bu bitta 1/8 ulush, butun emas.", "Это одна доля 1/8, а не целое.", 'That is one 1/8 part, not the whole.'),
      bi("Siz 25 ni 8 ga ko'paytirdingiz, ammo bitta ulushni topmadingiz.", "Ты умножил 25 на 8, но не нашёл одну долю.", 'You multiplied 25 by 8 without finding one part.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Yigirma beshni beshga bo'lsak besh, beshni sakkizga ko'paytirsak qirq.", "Верно. Двадцать пять делим на пять и получаем пять, затем пять умножаем на восемь и получаем сорок.", 'Correct. Divide twenty-five by five to get five, then multiply five by eight to get forty.'),
      bi("Bu bitta sakkizdan ulush, butun emas.", "Это одна восьмая доля, а не целое.", 'That is one eighth, not the whole.'),
      bi("Siz yigirma beshni sakkizga ko'paytirdingiz, ammo avval bitta ulushni topmadingiz.", "Ты умножил двадцать пять на восемь, но сначала не нашёл одну долю.", 'You multiplied twenty-five by eight without first finding one part.'),
    ],
    proof: bi("25 ÷ 5 × 8 = 40", "25 ÷ 5 × 8 = 40", '25 ÷ 5 × 8 = 40'),
    audio: { intro: {
      uz: ["Yigirma besh soni sakkizdan besh qismning qiymati.", "Bitta ulushni topib, undan barcha sakkizta ulushni tiklang."],
      ru: ["Число двадцать пять является значением пяти восьмых.", "Найди одну долю и восстанови по ней все восемь долей."],
      en: ['The number twenty-five is the value of five eighths.', 'Find one part and use it to reconstruct all eight parts.'],
    }, on_correct: bi("To'g'ri. Butun qirqka teng.", "Верно. Целое равно сорока.", 'Correct. The whole equals forty.') },
  },
  s12: {
    eyebrow: bi("Mashq · 5/6", "Тренировка · 5/6", 'Practice · 5/6'),
    title: bi("Bitning teskari xatosi", "Обратная ошибка Бита", "Bit's inverse-problem mistake"),
    question: bi("2/5 qism 20 ga teng. Qaysi yozuv butunni tiklaydi?", "2/5 равны 20. Какая запись восстановит целое?", '2/5 equals 20. Which expression reconstructs the whole?'),
    frames: [bi("Ma'lum 20 ichida 2 ta ulush bor", "В известных 20 содержатся 2 доли", 'The known 20 contains 2 parts'), bi("Butun uchun to'g'ri yozuv: ?", "Верная запись для целого: ?", 'Correct expression for the whole: ?')],
    options: ["20 ÷ 2 × 5 = 50", "20 ÷ 5 × 2 = 8", "20 × 5 = 100"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. Avval ma'lum ikki ulushdan bittasi topiladi.", "Верно. Сначала из двух известных долей находят одну.", 'Correct. First find one of the two known parts.'),
      bi("Bu to'g'ri masala algoritmi; teskari masalada avval suratga bo'linadi.", "Это алгоритм прямой задачи; в обратной сначала делят на числитель.", 'That is the direct-problem method; in an inverse problem, divide by the numerator first.'),
      bi("Avval ma'lum ikki ulushdan bittasini topish kerak.", "Сначала нужно найти одну долю из двух известных.", 'First find one part from the two known parts.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Avval ma'lum ikkita ulushdan bittasi topiladi, keyin beshta ulush tiklanadi.", "Верно. Сначала из двух известных долей находят одну, затем восстанавливают пять долей.", 'Correct. First find one of the two known parts, then reconstruct all five parts.'),
      bi("Bu to'g'ri masala algoritmi. Teskari masalada avval suratga bo'linadi.", "Это алгоритм прямой задачи. В обратной задаче сначала делят на числитель.", 'That is the direct-problem method. In an inverse problem, divide by the numerator first.'),
      bi("Avval ma'lum ikkita ulushdan bittasini topish kerak.", "Сначала нужно найти одну долю из двух известных.", 'First find one part from the two known parts.'),
    ],
    proof: bi("20 ÷ 2 × 5 = 50", "20 ÷ 2 × 5 = 50", '20 ÷ 2 × 5 = 50'),
    audio: { intro: {
      uz: ["Bit teskari masalada surat bilan maxrajning vazifasini almashtirdi.", "Ma'lum yigirma ichida ikkita ulush bor. To'g'ri yozuvni tanlashingiz mumkin."],
      ru: ["Бит в обратной задаче поменял роли числителя и знаменателя.", "В известных двадцати содержатся две доли. Можешь выбрать верную запись."],
      en: ['In the inverse problem, Bit swapped the roles of the numerator and denominator.', 'The known twenty contains two parts. You may choose the correct expression.'],
    }, on_correct: bi("To'g'ri. Butun ellikka teng.", "Верно. Целое равно пятидесяти.", 'Correct. The whole equals fifty.') },
  },
  s13: {
    eyebrow: bi("Mashq · 6/6", "Тренировка · 6/6", 'Practice · 6/6'),
    title: bi("Maktablarga yetkazish", "Доставка в школы", 'Delivery to schools'),
    question: bi("56 paketning 3/7 qismi yuboriladi. Nechta paket?", "Отправят 3/7 от 56 пакетов. Сколько пакетов?", '3/7 of 56 packages will be sent. How many packages is that?'),
    frames: [bi("Jami: 56 ta paket", "Всего: 56 пакетов", 'Total: 56 packages'), bi("Yuboriladigan qism: 3/7", "Отправляемая часть: 3/7", 'Part to send: 3/7'), bi("56 ÷ 7 × 3 = ?", "56 ÷ 7 × 3 = ?", '56 ÷ 7 × 3 = ?')],
    options: ["24", "8", "168"], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 56 ÷ 7 = 8; 8 × 3 = 24.", "Верно. 56 ÷ 7 = 8; 8 × 3 = 24.", 'Correct. 56 ÷ 7 = 8, and 8 × 3 = 24.'),
      bi("Bu faqat 1/7 qism; uchta ulush yuboriladi.", "Это только 1/7; отправляют три доли.", 'That is only the 1/7 part; three parts will be sent.'),
      bi("Siz 56 ni surat 3 ga ko'paytirdingiz, maxrajga bo'lmadingiz.", "Ты умножил 56 на числитель 3, но не разделил на знаменатель.", 'You multiplied 56 by the numerator 3 without dividing by the denominator.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Ellik oltini yettiga bo'lsak sakkiz, sakkizni uchga ko'paytirsak yigirma to'rt.", "Верно. Пятьдесят шесть делим на семь и получаем восемь, затем восемь умножаем на три и получаем двадцать четыре.", 'Correct. Divide fifty-six by seven to get eight, then multiply eight by three to get twenty-four.'),
      bi("Bu faqat yettidan bir qism. Uchta ulush yuboriladi.", "Это только одна седьмая. Отправляют три доли.", 'That is only one seventh. Three parts will be sent.'),
      bi("Siz ellik oltini surat uchga ko'paytirdingiz, ammo maxrajga bo'lmadingiz.", "Ты умножил пятьдесят шесть на числитель три, но не разделил на знаменатель.", 'You multiplied fifty-six by the numerator three without dividing by the denominator.'),
    ],
    proof: bi("56 ÷ 7 × 3 = 24", "56 ÷ 7 × 3 = 24", '56 ÷ 7 × 3 = 24'),
    audio: { intro: {
      uz: ["Markazda maktablar uchun ellik oltita paket tayyorlandi.", "Ularning yettidan uch qismi bugun yuboriladi.", "Butun ma'lum, demak qismni topish yo'lidan boring."],
      ru: ["В центре подготовили пятьдесят шесть пакетов для школ.", "Сегодня отправят три седьмых всех пакетов.", "Целое известно, значит используй путь от целого к части."],
      en: ['The centre prepared fifty-six packages for schools.', 'Three sevenths of all the packages will be sent today.', 'The whole is known, so use the path from the whole to the part.'],
    }, on_correct: bi("To'g'ri. Yigirma to'rtta paket yuboriladi.", "Верно. Отправят двадцать четыре пакета.", 'Correct. Twenty-four packages will be sent.') },
  },
  s14: {
    eyebrow: bi("Yakuniy bosqich", "Финальный этап", 'Final stage'),
    title: bi("Siz qismni ham, butunni ham topa olasiz", "Ты умеешь находить и часть, и целое", 'You can find both the part and the whole'),
    frames: [
      bi("3/5 qism = 18", "3/5 = 18", '3/5 part = 18'),
      bi("18 ÷ 3 = 6 → 1/5", "18 ÷ 3 = 6 → 1/5", '18 ÷ 3 = 6 → 1/5'),
      bi("6 × 5 = 30 → butun", "6 × 5 = 30 → целое", '6 × 5 = 30 → whole'),
      bi("Butun → qism: ÷b, ×a; qism → butun: ÷a, ×b", "Целое → часть: ÷b, ×a; часть → целое: ÷a, ×b", 'Whole → part: ÷b, ×a; part → whole: ÷a, ×b'),
      bi("Keyingi: o'ndan, yuzdan va mingdan ulushlar", "Дальше: десятые, сотые и тысячные", 'Next: tenths, hundredths and thousandths'),
    ],
    audio: {
      uz: ["Boshlang'ich masalada beshdan uch qism o'n sakkizga teng edi.", "O'n sakkizni surat uchga bo'lib, bitta ulush oltini topdik.", "Oltini maxraj beshga ko'paytirib, butun o'ttizni tikladik.", "Butun ma'lum bo'lsa maxrajga bo'lib suratga ko'paytiramiz. Qism ma'lum bo'lsa suratga bo'lib maxrajga ko'paytiramiz.", "Keyingi darsda o'ndan, yuzdan va mingdan ulushlarni o'nli kasr bilan yozamiz."],
      ru: ["В стартовой задаче три пятых были равны восемнадцати.", "Разделив восемнадцать на числитель три, мы нашли одну долю шесть.", "Умножив шесть на знаменатель пять, восстановили целое тридцать.", "Если известно целое, делим на знаменатель и умножаем на числитель. Если известна часть, делим на числитель и умножаем на знаменатель.", "На следующем уроке запишем десятые, сотые и тысячные доли десятичными дробями."],
      en: ['In the starting problem, three fifths equalled eighteen.', 'By dividing eighteen by the numerator, three, we found one part, six.', 'By multiplying six by the denominator, five, we reconstructed the whole, thirty.', 'If the whole is known, divide by the denominator and multiply by the numerator. If the part is known, divide by the numerator and multiply by the denominator.', 'In the next lesson, we will write tenths, hundredths and thousandths as decimal fractions.'],
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

const Stage = ({ screen, audio, onPrev, onNext, nextDisabled = false, finish = false, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen];
  return <main className={`stage stage-${meta.type}`} data-g4-screen={meta.type === 'hook' ? 'hook' : meta.type}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{children}<div className={`caption-slot ${audio?.caption && (audio.muted || audio.visualOnly) ? 'is-visible' : ''}`} aria-live="polite"><span>{audio?.caption && (audio.muted || audio.visualOnly) ? audio.caption : ''}</span></div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад', en: 'Back' })}</button>}<button type="button" className="btn-white-accent" disabled={nextDisabled || !onNext} onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок', en: 'Finish lesson' }) : t({ uz: "Davom etish", ru: 'Продолжить', en: 'Continue' })} →</button></footer></main>;
};

const Heading = ({ c, bit, hook = false }) => { const t = useT(); return <div className="heading"><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{bit && !hook && <BitSVG state={bit}/>}</div>; };
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false, disabled = false }) => {
  const t = useT();
  return <div className="options">{values.map((value, index) => <button type="button" data-g4-role="answer-card" key={index + '-' + t(value)} className={'option ' + (picked === index ? 'picked ' : '') + (!neutral && solved && index === correctIndex ? 'right ' : '') + (!neutral && picked === index && picked !== correctIndex ? 'bad' : '')} disabled={disabled || (!neutral && solved)} onClick={() => onPick(index)}><b>{String.fromCharCode(65 + index)}</b><span>{t(value)}</span></button>)}</div>;
};

const FrameNotes = ({ items = [], frame = 0 }) => {
  const t = useT();
  return <div className="frame-notes">{items.map((item, index) => <div key={index} className={'frame-note ' + (frame >= index ? 'show' : '')}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>;
};

const GroupBoard = ({ total, groups, selected = 0, compact = false }) => {
  const t = useT();
  const perGroup = Math.floor(total / groups);
  return <div className={'group-board ' + (compact ? 'group-board-compact' : '')} aria-label={t(bi(total + ' ta obyekt, ' + groups + ' ta teng guruh', total + ' объектов, ' + groups + ' равных групп', total + ' objects in ' + groups + ' equal groups'))}>
    {Array.from({ length: groups }, (_, group) => <div key={group} className={'group-cell ' + (group < selected ? 'group-selected' : '')}>
      <div>{Array.from({ length: perGroup }, (_, item) => <i key={item}/>)}</div>
      <small>{perGroup}</small>
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

function ChoiceExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, visual = null, renderVisual = null, bit = null }) {
  const t = useT();
  const c = CONTENT['s' + screen];
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
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack"><Heading c={c} bit={bit}/><FrameNotes items={c.frames} frame={audio.frame}/>{contextVisual && <div className={'attempt-model ' + (hintLevel > 0 ? 'attempt-highlight' : '')}>{contextVisual}</div>}<section className={'question ' + (hintLevel > 0 ? 'attempt-highlight' : '')}><h2>{t(c.question)}</h2>{hintLevel > 0 && <div className="attempt-cue" role="status">{t(bi("Avval ma'lum va noma'lum miqdorni ajrating.", "Сначала различи известную и неизвестную величины.", 'First identify the known and unknown quantities.'))}</div>}<Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved} disabled={!narrationReady}/><FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section></div></Stage>;
}

const FractionTank = ({ den = 5, filled = 0, outlined = 0, removed = 0, divisions = true, label = null, compact = false }) => {
  const bands = Array.from({ length: den }, (_, index) => {
    const isFilled = index < filled;
    const isOutlined = isFilled && index >= Math.max(0, filled - outlined);
    const isRemoved = index >= filled && index < filled + removed;
    return <i key={index} className={(isFilled ? 'tank-fill ' : '') + (isOutlined ? 'tank-outline ' : '') + (isRemoved ? 'tank-removed' : '')}/>;
  });
  return <div className={'tank-model ' + (compact ? 'compact' : '')}><div className={'tank-shell ' + (!divisions ? 'undivided' : '')}><div className="tank-spout"/><div className="tank-handle"/><div className="tank-body">{bands}</div></div>{label && <div className="model-label">{label}</div>}</div>;
};

const ShareSlots = ({ groups, known, per, revealAll = false }) => (
  <div className="group-board">
    {Array.from({ length: groups }, (_, group) => {
      const visible = revealAll || group < known;
      return <div key={group} className={'group-cell ' + (visible ? 'group-selected' : 'group-unknown')}>
        <div>{visible ? Array.from({ length: per }, (_, item) => <i key={item}/>) : <em>?</em>}</div>
        <small>{visible ? per : '?'}</small>
      </div>;
    })}
  </div>
);
const CycleFlow = ({ frame }) => {
  const values = ['49', '7', '28', '7', '49'];
  return <div className="rule-flow">{values.map((value, index) => <React.Fragment key={index}><span className={frame >= index ? 'show' : ''}>{value}</span>{index < values.length - 1 && <b>→</b>}</React.Fragment>)}</div>;
};
function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [picked, setPicked] = useState(storedAnswer?.neutralChoice ?? null);
  const pick = (index) => { if (!narrationReady) return; setPicked(index); audio.pushOneOff(t(c.neutral)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: true, attempts: 1, solved: true, neutralChoice: index }); };
  return <Stage screen={screen} audio={audio} onNext={onNext} nextDisabled={picked === null || !narrationReady}><div className="stack hook-stack" data-g4-screen="hook"><Heading c={c} hook/><h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2><section className="hook-scene-adapter" data-g4-role="hook-scene"><div className="hook-scene-visual" data-g4-role="visual-frame"><section className="hook-model hook-tank-model" role="img" aria-label={t(c.visualLabel)}><FractionTank den={5} filled={3} divisions={audio.frame >= 1} label={audio.frame >= 1 ? t(c.filledLabel) : null}/><div className={'tank-capacity-question ' + (audio.frame >= 2 ? 'show' : '')}>{t(c.capacityLabel)}</div></section><div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think"/></div></div></section><section className="question" data-g4-role="answer-card"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} neutral disabled={!narrationReady}/><FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock></section></div></Stage>;
}
function Screen1({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s1; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={frame}/><section className="boundary-grid"><div className={frame >= 0 ? 'show' : ''}><RuleFlow frame={frame}/></div><div className={frame >= 2 ? 'show' : ''}><RuleFlow frame={frame - 2} reverse/></div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen2({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s2; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="model-card"><GroupBoard total={40} groups={5} selected={audio.frame >= 3 ? 1 : 0}/></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen3({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s3; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="model-card"><GroupBoard total={40} groups={5} selected={audio.frame >= 1 ? 3 : 0}/><div className={'result-chip ' + (audio.frame >= 2 ? 'show' : '')}>24</div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen4({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s4; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="model-card"><ShareSlots groups={5} known={3} per={6}/></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen5({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s5; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="model-card"><ShareSlots groups={5} known={3} per={6} revealAll={audio.frame >= 1}/><div className={'result-chip ' + (audio.frame >= 3 ? 'show' : '')}>30</div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen6({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={frame}/><section className="boundary-grid"><div className="show"><RuleFlow frame={Math.min(frame, 1)}/></div><div className={frame >= 2 ? 'show' : ''}><RuleFlow frame={frame >= 2 ? frame - 2 : -1} reverse/></div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen7({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s7; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="rule-card"><CycleFlow frame={audio.frame}/><div className={'state-note ' + (audio.frame >= 4 ? 'show' : '')}>49 → 28 → 49 ✓</div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen8(props) { return <ChoiceExercise {...props} renderVisual={({ frame }) => <div className="model-card"><GroupBoard total={27} groups={3} selected={frame >= 1 ? 2 : 0} compact/></div>}/>; }
function Screen9(props) { return <ChoiceExercise {...props} renderVisual={({ frame }) => <div className="model-card"><ShareSlots groups={4} known={3} per={7}/><div className={'state-note ' + (frame >= 1 ? 'show' : '')}>3 → 4</div></div>}/>; }
function Screen10(props) { return <ChoiceExercise {...props}/>; }
function Screen11(props) { return <ChoiceExercise {...props} renderVisual={({ frame }) => <div className="model-card"><ShareSlots groups={8} known={5} per={5}/><div className={'state-note ' + (frame >= 1 ? 'show' : '')}>5 → 8</div></div>}/>; }
function Screen12(props) { return <ChoiceExercise {...props} bit="awkward" visual={<div className="bit-error"><span>2/5 = 20</span><b>20 ÷ 5 × 2 = 8</b></div>}/>; }
function Screen13(props) { return <ChoiceExercise {...props} renderVisual={({ frame }) => <div className="model-card"><GroupBoard total={56} groups={7} selected={frame >= 1 ? 3 : 0} compact/><div className={'state-note ' + (frame >= 2 ? 'show' : '')}>56 ÷ 7 × 3 = ?</div></div>}/>; }
function G4TitleReveal({ active, title, onComplete }) {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const wasActiveRef = useRef(active);
  useEffect(() => {
    const wasActive = wasActiveRef.current;
    wasActiveRef.current = active;
    if (!active || wasActive || typeof window === 'undefined') return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => { setVisible(false); onComplete?.(); }, reduced ? 120 : 3900);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active, onComplete]);
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
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const title = { uz: "Kasrli masalalar ustasi", ru: 'Мастер задач с дробями', en: 'Fraction Problem Master' }; const reflectionOptions = [{ uz: 'Model bilan tekshiraman', ru: 'Проверю по модели', en: 'I will check with a model' }, { uz: 'Qoida va birlikni tekshiraman', ru: 'Проверю правило и единицу', en: 'I will check the rule and unit' }, { uz: 'Teskari amal bilan tekshiraman', ru: 'Проверю обратным действием', en: 'I will use the inverse operation' }]; const chooseReflection = (index) => { if (!narrationReady || titleClaimed) return; setReflectionChoice(index); onAnswer({ ...(storedAnswer ?? {}), screenIdx: screen, stage: null, reflectionChoice: index, titleClaimed: false }); audio.pushOneOff(t(reflectionOptions[index])); }; const claimTitle = () => { if (!narrationReady || reflectionChoice === null || titleClaimed) return; setTitleClaimed(true); onAnswer({ screenIdx: screen, stage: null, question: t({ uz: 'Tanlangan tekshiruv', ru: 'Выбранная проверка', en: 'Chosen check' }), options: reflectionOptions.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: reflectionChoice, studentAnswer: t(reflectionOptions[reflectionChoice]), correct: true, firstTry: true, attempts: 1, solved: true, reflectionChoice, titleClaimed: true }); }; const frame = audio.frame; const complete = frame >= 4;
  const takeaways = [
    { label: bi("Ma'lum qism", "Известная часть", 'Known part'), value: "3/5 = 18" },
    { label: bi("Bitta ulush", "Одна доля", 'One part'), value: "18 ÷ 3 = 6" },
    { label: bi("Butun", "Целое", 'Whole'), value: "6 × 5 = 30" },
    { label: bi("Ikki yo'l", "Два пути", 'Two paths'), value: "N ↔ P" },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={titleClaimed ? finishLesson : undefined} nextDisabled={!titleClaimed} finish><div className="stack"><section className="finale-heading"><span>◆ {t(bi("YAKUNIY BOSQICH", "ФИНАЛЬНЫЙ ЭТАП", 'FINAL STAGE'))}</span><h1>{t(c.title)}</h1><p>{t(bi("Qismdan butunni tiklab, ikki yo'lni bog'ladik.", "Мы восстановили целое по части и связали два пути.", 'We reconstructed the whole from a part and connected the two paths.'))}</p></section><FrameNotes items={c.frames} frame={frame}/><section className="finale-main"><div className="finale-payoff"><small>{t(bi("BOSHLANG'ICH MISSIYA YECHIMI", "РЕШЕНИЕ СТАРТОВОЙ МИССИИ", 'STARTING MISSION SOLUTION'))}</small><FractionTank den={5} filled={frame >= 2 ? 5 : 3} compact label={frame >= 2 ? t(bi("5/5 = 30 litr", "5/5 = 30 литров", '5/5 = 30 litres')) : t(bi("3/5 = 18 litr", "3/5 = 18 литров", '3/5 = 18 litres'))}/><div className={'finale-answer ' + (frame >= 2 ? 'show' : '')}>18 ÷ 3 × 5 = 30</div></div><div className="finale-takeaways">{takeaways.map((item, index) => <div className={'finale-takeaway ' + (frame >= index ? 'show' : '')} key={t(item.label)}><b>{index + 1}</b><span><small>{t(item.label)}</small><strong>{item.value}</strong></span></div>)}</div></section><section className="finale-bottom"><div className={'finale-bridge ' + (complete ? 'show' : '')}><small>{t(bi("KEYINGI MAVZU", "СЛЕДУЮЩАЯ ТЕМА", 'NEXT TOPIC'))}</small><strong>{t(bi("O'ndan, yuzdan va mingdan ulushlar", "Десятые, сотые и тысячные доли", 'Tenths, hundredths and thousandths'))}</strong></div><ReflectionPanel choices={reflectionOptions} choice={reflectionChoice} onChoose={chooseReflection} disabled={!narrationReady || titleClaimed}/><G4FinalTitleReward ready={narrationReady} titleClaimed={titleClaimed} reflectionChoice={reflectionChoice} onClaim={claimTitle} title={title} answers={answers}/></section></div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars23({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const preview = previewMode ?? (langProp === undefined || langProp === null);
  const initialLang = normalizeLang(langProp);
  const [previewLang, setPreviewLang] = useState(initialLang);
  const lang = preview ? normalizeLang(previewLang) : initialLang;
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
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars23 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES + G4_ETALON_OVERRIDES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={LANGUAGE_LABELS[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>;
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
@media(max-width:639.98px){.stage-header{padding-top:11px!important}.lesson-root-preview .stage-header{padding-top:52px!important}}
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
.rank-boost-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}
[data-g4-role="title-card"]{position:relative;isolation:isolate;max-width:100%;overflow:hidden}
[data-g4-role="title-claim"]{font-family:'Manrope',system-ui,sans-serif}
.lesson-frame .preview-language{display:none!important}
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
  .lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important}
}
@media(prefers-reduced-motion:reduce){.rank-boost-overlay,.rank-boost-overlay * ,[data-g4-role="title-card"],[data-g4-role="title-card"] *{animation:none!important;transition:none!important}.rank-boost-overlay{opacity:1}.g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}}
`;

const STYLES = `${G4_TITLE_STYLES}
.stage-hook .hook-model{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
@media(max-width:639.98px){.stage-hook .hook-model{border-radius:18px}}
.stage-hook .hook-tank-model{min-height:188px;padding:10px 18px;grid-template-columns:minmax(0,1fr) minmax(170px,.42fr);align-items:center;column-gap:18px}
.stage-hook .hook-tank-model .tank-model{width:min(430px,100%);gap:6px}
.stage-hook .hook-tank-model .tank-shell{width:min(265px,72%);height:128px;padding:10px 10px 9px;border-width:4px;border-radius:0 0 25px 25px}
.stage-hook .hook-tank-model .tank-spout{width:52px;height:14px;left:-43px;border-width:4px}
.stage-hook .hook-tank-model .tank-handle{width:48px;height:64px;right:-34px;top:27px;border-width:9px}
.stage-hook .hook-tank-model .model-label{padding:6px 11px;font-size:14px}
.tank-capacity-question{min-width:170px;padding:13px 15px;border-radius:15px;visibility:hidden;opacity:0;transform:translateY(7px);color:#fff;background:rgba(255,255,255,.11);box-shadow:inset 0 0 0 1px rgba(152,225,229,.22);text-align:center;font:900 15px/1.25 'JetBrains Mono',monospace;transition:opacity .38s ease,transform .38s ease}
.tank-capacity-question.show{visibility:visible}
@media(max-width:639.98px){.stage-hook .hook-tank-model{min-height:116px;padding:5px 6px!important;grid-template-columns:minmax(0,1fr) 104px;column-gap:4px}.stage-hook .hook-tank-model .tank-model{width:100%;gap:3px}.stage-hook .hook-tank-model .tank-shell{width:142px;height:86px;padding:6px;border-width:3px;border-radius:0 0 18px 18px}.stage-hook .hook-tank-model .tank-spout{width:31px;height:10px;left:-26px;border-width:3px}.stage-hook .hook-tank-model .tank-handle{width:31px;height:42px;right:-22px;top:18px;border-width:6px}.stage-hook .hook-tank-model .model-label{padding:4px 7px;border-radius:8px;font-size:9px}.tank-capacity-question{min-width:0;padding:8px 5px;border-radius:10px;font-size:9px}}
@media(max-width:639.98px){.stage-hook .options{grid-template-columns:repeat(3,minmax(0,1fr))}.stage-hook .question h2{font-size:12px;line-height:1.16}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}
.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{height:100%;min-height:0;overflow:hidden;display:grid;align-content:center;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;opacity:0;transform:translateY(7px)}.feedback.open{opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{font-size:13px;line-height:1.45}.caption{position:static;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:proof-in .35s ease both}.frac{display:inline-flex;min-width:25px;flex-direction:column;align-items:center;vertical-align:middle;color:inherit;font:800 1em/1 'Source Serif 4',Georgia,serif}.frac i{width:100%;height:2px;margin:2px 0;border-radius:2px;background:currentColor}.frac-lg{font-size:1.35em}.hook-model,.whole-card,.rule-card,.finale-payoff{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}
.lesson-root button:focus-visible,.lesson-root input:focus-visible,.lesson-root input[type='range']:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.hook-model{display:grid;place-items:center;gap:12px;background:linear-gradient(135deg,#E5F5F6,#FFF)}.fraction-model{width:min(620px,94%);margin:0 auto;display:grid;gap:10px}.fraction-bar{height:112px;display:grid;overflow:hidden;border-radius:18px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.fraction-bar i{min-width:0;border-right:2px solid rgba(23,59,82,.18);background:#F4F5F1;transition:background .45s ease,transform .45s ease}.fraction-bar i:last-child{border-right:0}.fraction-bar i.cyan{background:#46B8C5}.fraction-bar i.lime{background:#95C93D}.fraction-bar i.removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.12),rgba(255,91,53,.12) 7px,rgba(255,91,53,.42) 7px,rgba(255,91,53,.42) 14px)}.fraction-bar i.merged{background:linear-gradient(135deg,#168FA3,#95C93D)}.fraction-bar.whole i{border-right:0}.fraction-model.compact .fraction-bar{height:48px;border-radius:11px}.model-label{justify-self:center;padding:8px 13px;border-radius:12px;color:#173B52;background:#E5F5F6;font:900 16px "JetBrains Mono",monospace}.state-note,.formula-card,.result-chip{padding:12px 15px;border-radius:14px;opacity:.12;transform:translateY(7px);transition:.4s ease;text-align:center}.state-note{color:#227A53;background:#E7F3EC;font-size:13px;font-weight:850}.formula-card{color:#FFF;background:#173B52;font:900 17px "JetBrains Mono",monospace}.result-chip{justify-self:center;color:#FFF;background:#FF5B35;font:900 20px "JetBrains Mono",monospace}.show{opacity:1!important;transform:none!important}.tokens{display:flex;align-items:center;justify-content:center;gap:8px;color:#50616D;font-size:12px;font-weight:800}.tokens i{width:28px;height:28px;border-radius:9px;background:#95C93D;animation:token-pop .4s ease both}.tokens i:nth-child(2){animation-delay:.1s}.tokens i:nth-child(3){animation-delay:.2s}.rule-card,.whole-card{display:grid;gap:12px}.rule-line{padding:13px;border-radius:14px;opacity:.12;transform:translateY(6px);color:#173B52;background:#E5F5F6;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.rule-line.accent{color:#FFF;background:#173B52}.wrong-formula{padding:12px;position:relative;opacity:.12;color:#A96F13;background:#FFF5D9;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.wrong-formula::after{content:"";position:absolute;left:28%;right:28%;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.tank-model{width:min(560px,96%);margin:0 auto;display:grid;place-items:center;gap:10px}.tank-shell{width:min(360px,82%);height:210px;position:relative;padding:16px 16px 14px;border:5px solid ${T.navy};border-top:0;border-radius:0 0 34px 34px;background:rgba(255,255,255,.72);filter:drop-shadow(0 14px 16px rgba(${T.shadowBase},.13))}.tank-body{height:100%;overflow:hidden;border-radius:6px 6px 22px 22px;display:flex;flex-direction:column-reverse;background:#F4F5F1}.tank-body i{min-height:0;flex:1;border-top:2px solid rgba(23,59,82,.18);transition:background .38s ease,opacity .38s ease,transform .38s ease}.tank-body i:first-child{border-top:0}.tank-body i.tank-fill{background:linear-gradient(90deg,#46B8C5,${T.cyan})}.tank-body i.tank-outline{box-shadow:inset 0 0 0 3px ${T.lime}}.tank-body i.tank-removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.16),rgba(255,91,53,.16) 8px,rgba(255,91,53,.48) 8px,rgba(255,91,53,.48) 16px);animation:tank-out .42s ease both}.tank-shell.undivided .tank-body i{border-top-color:transparent}.tank-spout{width:76px;height:19px;position:absolute;left:-63px;top:-4px;border:5px solid ${T.navy};border-right:0;border-radius:13px 0 0 13px;background:#fff}.tank-handle{width:70px;height:90px;position:absolute;right:-46px;top:44px;border:12px solid ${T.navy};border-left:0;border-radius:0 38px 38px 0}.tank-model.compact .tank-shell{width:190px;height:92px;padding:7px;border-width:3px;border-radius:0 0 18px 18px}.tank-model.compact .tank-spout{width:32px;height:10px;left:-27px;border-width:3px}.tank-model.compact .tank-handle{width:34px;height:45px;right:-24px;top:18px;border-width:7px}.state-grid{margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.state-grid span{min-height:52px;padding:9px;border-radius:13px;display:grid;place-items:center;opacity:.12;transform:translateY(6px);color:${T.navy};background:${T.cyanSoft};text-align:center;font-size:11px;font-weight:850;transition:.38s ease}.boundary-grid{padding:18px;border-radius:22px;display:grid;grid-template-columns:1fr 1fr;gap:12px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.boundary-grid>div{padding:10px;border-radius:16px;opacity:.12;transform:translateY(6px);background:#F8F8F4;transition:.4s ease}.boundary-grid>.state-note{grid-column:1/-1}.hospital-model{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:14px;background:${T.cyanSoft}}.hospital-model>span{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;color:#fff;background:${T.accent};font:900 27px 'JetBrains Mono',monospace}.nl-arrow.back{border-right:0;border-left:3px solid ${T.accent};border-radius:14px 0 0 0}.nl-arrow.back::after{right:auto;left:-5px;border-left:0;border-right:8px solid ${T.accent}}.number-line{height:150px;position:relative;padding:54px 7% 0}.nl-track{height:4px;position:relative;border-radius:4px;background:#173B52}.nl-tick{width:2px;height:18px;position:absolute;top:-7px;background:#87949D}.nl-tick span{position:absolute;top:20px;left:50%;transform:translateX(-50%);font:800 12px "JetBrains Mono",monospace}.nl-dot{width:44px;height:38px;position:absolute;top:27px;transform:translateX(-50%);border-radius:12px;display:grid;place-items:center;color:#FFF;font:900 11px "JetBrains Mono",monospace;z-index:2;animation:dot-pop .35s ease both}.nl-dot.cyan{background:#168FA3}.nl-dot.lime{background:#95C93D}.nl-arrow{height:22px;position:absolute;top:84px;border-top:3px solid #FF5B35;border-right:3px solid #FF5B35;border-radius:0 14px 0 0;animation:arrow-grow .45s ease both}.nl-arrow::after{content:"";position:absolute;right:-5px;top:-7px;border-left:8px solid #FF5B35;border-top:5px solid transparent;border-bottom:5px solid transparent}.model-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.model-choices>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:26px 1fr;align-items:center;gap:6px;background:#FFF;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choices>div>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 10px "JetBrains Mono",monospace}.bit-error{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;color:#A96F13;background:#FFF5D9;font:900 19px "JetBrains Mono",monospace}.bit-error b{position:relative}.bit-error b::after{content:"";position:absolute;left:-5px;right:-5px;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.energy-model{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px}.energy-model>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;background:#FFF}.energy-model>div>span{font-size:23px}.energy-model>strong{text-align:center;color:#FF5B35;font-size:23px}.finale-heading{padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{color:#FF5B35;font:900 9px "JetBrains Mono",monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:#173B52;font:750 clamp(21px,3vw,28px)/1.08 "Source Serif 4",Georgia,serif}.finale-heading p{margin-top:4px!important;color:#50616D;font-size:11px}.finale-main{display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);gap:10px}.finale-payoff{display:grid;align-content:center;gap:8px}.finale-payoff>small{color:#168FA3;font-size:9px;font-weight:900;letter-spacing:.09em}.finale-answer{padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:#227A53;background:#E7F3EC;text-align:center;font:900 13px "JetBrains Mono",monospace;transition:.42s ease}.finale-takeaways{display:grid;gap:6px}.finale-takeaway{min-height:42px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px 1fr;align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:.42s ease}.finale-takeaway.show{background:#E5F5F6}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 9px "JetBrains Mono",monospace}.finale-takeaway span{display:grid;gap:2px;font-size:11px;font-weight:800}.finale-takeaway small{color:#168FA3;font-size:8px;text-transform:uppercase}.finale-takeaway strong{color:#173B52;font-family:"JetBrains Mono",monospace}.finale-bottom{display:grid;grid-template-columns:1.2fr .8fr;gap:10px}.finale-bridge{padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#FFF;background:#173B52;transition:.42s ease}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px "Source Serif 4",Georgia,serif}.finale-reward{min-height:100px;position:relative;overflow:hidden;padding:12px 70px 11px 52px;border-radius:17px;display:grid;align-content:center;color:#FFF;background:linear-gradient(135deg,#234B62,#173B52)}.finale-reward>div:nth-child(2){display:grid;gap:3px}.finale-reward small{color:#98E1E5;font-size:8px;font-weight:900}.finale-reward strong{font:750 14px "Source Serif 4",Georgia,serif}.finale-reward b{color:#FFE284;font:900 11px "JetBrains Mono",monospace}.finale-reward>.g1-char{position:absolute;right:2px;bottom:-5px;width:67px;height:84px}.finale-medal{position:absolute;left:10px;top:50%;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#173B52;background:#95C93D}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:#FF5B35}.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;justify-self:end;color:${T.accent};background:${T.accentSoft};cursor:pointer;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.marker-control{width:min(620px,94%);padding:10px 13px;border-radius:14px;display:grid;gap:7px;color:${T.navy};background:${T.cyanSoft};font:850 12px 'Manrope',sans-serif}.free-marker{width:100%;min-height:44px;margin:0;accent-color:${T.accent};cursor:pointer}.nl-dot.free{top:102px;background:${T.navy};animation-duration:.4s}.attempt-model{border-radius:20px;transition:box-shadow .32s ease,background .32s ease}.attempt-highlight{box-shadow:0 0 0 3px rgba(22,143,163,.38),0 14px 26px -20px rgba(22,143,163,.8)!important;background:rgba(229,245,246,.72)!important}.attempt-cue{padding:9px 12px;border-radius:12px;color:${T.cyan};background:${T.cyanSoft};font-size:12px;font-weight:850;animation:attempt-cue-in .3s ease both}.stack{animation-duration:.5s}.caption{animation:caption-in .32s ease both}.formula-card{transition-duration:.32s!important}.result-chip{transition-duration:.22s!important}

.group-cell.group-unknown{border:2px dashed rgba(80,97,109,.35);background:#fff}.group-cell.group-unknown em{display:grid;place-items:center;color:${T.ink3};font:900 22px 'JetBrains Mono',monospace}
@keyframes tank-out{from{opacity:0;transform:translateY(-10px)}}@keyframes caption-in{from{opacity:0;transform:translateY(5px)}}@keyframes attempt-cue-in{from{opacity:0;transform:translateY(5px)}}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(5px)}}@keyframes token-pop{from{opacity:0;transform:scale(.45)}}@keyframes dot-pop{from{opacity:0;transform:translateX(-50%) scale(.55)}}@keyframes arrow-grow{from{transform:scaleX(0);transform-origin:left}}@keyframes bit-move{to{transform:translateY(-2px) rotate(2deg)}}@keyframes pulse{to{transform:scale(1.07)}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.hook-model,.whole-card,.rule-card,.question{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.fraction-bar{height:82px}.tank-shell{width:min(292px,78%);height:168px}.state-grid{grid-template-columns:1fr 1fr}.boundary-grid{grid-template-columns:1fr}.boundary-grid>.state-note{grid-column:1}.hospital-model{padding-inline:7px}.model-choices{grid-template-columns:1fr}.energy-model{grid-template-columns:1fr}.energy-model>strong{transform:rotate(90deg)}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-main,.finale-bottom{gap:8px}.finale-takeaway{min-height:36px}.number-line{height:135px;padding-inline:9%}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.state-note,.formula-card,.result-chip,.rule-line,.wrong-formula,.finale-answer,.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}}
.caption-slot{flex:none;min-height:38px;padding:6px 10px;border-radius:11px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:10px;line-height:1.22}.caption-slot.is-visible{visibility:visible}.feedback.feedback-slot{height:76px;min-height:76px;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1}.feedback-bit{width:48px;height:58px;display:block}.feedback-bit .g1-char,.feedback-bit>svg{width:100%;height:100%}.feedback-proof{display:block;margin-top:4px;padding-top:4px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 12px/1.2 'JetBrains Mono',monospace}.feedback-proof small{display:block;font-size:8px;letter-spacing:.1em}.lesson-root{height:100dvh!important;min-height:0!important;overflow:hidden!important}.stage-content{display:flex;flex-direction:column;gap:4px;overflow:hidden!important}.stage-content>.stack{flex:1;min-height:0}.btn-white-accent:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:11px!important;padding-bottom:4px!important}.lesson-root-preview .stage-header{padding-top:52px!important}.progress-track{height:4px!important;margin-bottom:5px!important}.stage-content{padding-top:3px!important;padding-bottom:3px!important}.stage-nav{min-height:52px!important}.stack{gap:4px!important}.heading{min-height:40px!important}.heading h1{font-size:17px!important}.heading .g1-char{width:38px!important;height:48px!important}.question,.model-card,.visual-card,.hook-model,.whole-card,.rule-card,.beat-list{padding:5px!important;border-radius:11px!important}.options{gap:3px!important}.option{min-height:44px!important;padding:4px!important;border-radius:9px!important;font-size:9px!important}.feedback.feedback-slot{height:54px;min-height:54px!important;padding:4px 6px!important;grid-template-columns:32px 1fr!important;gap:4px!important}.feedback-bit{width:31px;height:39px}.feedback p{font-size:9px!important;line-height:1.16!important}.caption-slot{min-height:28px;padding:3px 7px;font-size:8px}.beat-list{gap:3px!important}.beat{min-height:29px!important;padding:3px!important;font-size:8px!important}.btn-white-accent,.btn-ghost{min-height:44px!important;min-width:104px!important;padding:0 8px!important;font-size:11px!important}.finale-main,.finale-bottom{grid-template-columns:1fr 1fr!important;gap:4px!important}}
.strategy-replay{min-height:44px;padding:7px 12px;border:0;border-radius:11px;justify-self:center;color:${T.cyan};background:${T.cyanSoft};cursor:pointer;font-size:11px;font-weight:850}.strategy-replay:disabled{cursor:not-allowed;opacity:.46}
.final-reflection{padding:6px 8px;border-radius:12px;display:grid;gap:5px;background:rgba(255,255,255,.9)}.final-reflection>strong{font:750 12px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button{min-height:44px;padding:4px;border:0;border-radius:9px;display:grid;grid-template-columns:20px 1fr;align-items:center;gap:3px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:8px;font-weight:850}.final-reflection button>span{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}.g4-title-claim:disabled{cursor:not-allowed;opacity:.46}
`;
