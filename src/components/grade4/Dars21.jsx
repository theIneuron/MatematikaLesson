import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 21-DARS · Kasrlarni ayirish
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
  lessonId: 'frac-4-21-v1',
  slug: 'dars21-kasrlarni-ayirish',
  lessonTitle: { uz: "21-dars. Kasrlarni ayirish", ru: 'Урок 21. Вычитание дробей', en: 'Lesson 21. Subtracting fractions' },
  skillTags: ['fraction_subtraction', 'same_denominator', 'fraction_model', 'number_line', 'inverse_check', 'zero'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'StoryChoice', mechanic: 'StoryChoice', goal: 'Predict what changes when equal parts are removed', misconceptions: ['subtracting denominators'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'model', subtype: 'whole-and-parts', template: 'ModelTap', mechanic: 'ModelTap', goal: 'Identify the common unit fraction in one whole', misconceptions: ['different part sizes'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'minuend-model', template: 'AnimatedBar', mechanic: 'AnimatedBar', goal: 'Represent the starting fraction', misconceptions: ['counting empty parts'], active: false, scored: false, scope: null },
  { id: 's3', type: 'exploration', subtype: 'remove-parts-model', template: 'ReplayRemoval', mechanic: 'ReplayRemoval', goal: 'Remove equal parts from the same whole', misconceptions: ['changing the whole'], active: false, scored: false, scope: null },
  { id: 's4', type: 'discovery', subtype: 'count-remaining-parts', template: 'ResultReveal', mechanic: 'ResultReveal', goal: 'Discover that subtraction counts remaining equal parts', misconceptions: ['subtracting denominators'], active: true, scored: false, scope: null },
  { id: 's5', type: 'rule', subtype: 'same-denominator-rule', template: 'RuleBuild', mechanic: 'RuleBuild', goal: 'Formulate the same-denominator subtraction rule', misconceptions: ['changing the unit fraction'], active: false, scored: false, scope: null },
  { id: 's6', type: 'strategy', subtype: 'number-line-strategy', template: 'LineMarker', mechanic: 'LineMarker', goal: 'Check subtraction with a backward number-line jump', misconceptions: ['jumping in the wrong direction'], active: true, scored: false, scope: null },
  { id: 's7', type: 'consolidation', subtype: 'zero-boundary', template: 'ZeroModel', mechanic: 'ZeroModel', goal: 'Connect removing all selected parts with zero', misconceptions: ['zero denominator'], active: false, scored: false, scope: null },
  { id: 's8', type: 'test', subtype: 'notation-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Subtract fractions with a common denominator', misconceptions: ['subtracting denominators'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's9', type: 'test', subtype: 'model-selection', template: 'ModelChoice', mechanic: 'ModelChoice', goal: 'Select the model of a fraction difference', misconceptions: ['wrong remaining parts'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'strategy', subtype: 'inverse-check-strategy', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Choose an addition-based check for subtraction', misconceptions: ['checking only the numerator'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's11', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepairChoice', mechanic: 'ErrorRepairChoice', goal: "Repair Bit's zero-denominator error", misconceptions: ['subtracting denominators'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's12', type: 'test', subtype: 'boundary-transfer', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Decide when the common-denominator rule applies', misconceptions: ['using the rule with unlike denominators'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'case', subtype: 'life-context-transfer', template: 'CaseChoice', mechanic: 'CaseChoice', goal: 'Apply fraction subtraction in a hospital-supply context', misconceptions: ['removed parts counted as remaining'], active: true, scored: true, scoreUnits: 1, scope: 'final' },
  { id: 's14', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', mechanic: 'ReflectionClaim', goal: 'Reflect on the subtraction strategy and bridge forward', misconceptions: ['partial result check'], active: true, scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: "Taqsimlash markazi", ru: 'Центр распределения', en: 'Distribution centre' },
    title: { uz: "Bakdan bir qism olindi", ru: 'Из бака взяли часть', en: 'Some liquid was taken from the tank' },
    question: { uz: "Qolgan ulush 4/7 bo'ladimi?", ru: 'Будет ли остаток равен 4/7?', en: 'Will the amount left be 4/7?' },
    options: [
      { uz: "Yo'q, bo'linmalar o'nta bo'lib qoladi", ru: 'Нет, делений останется десять', en: 'No, there will still be ten equal parts' },
      { uz: "Ha, o'n minus uch yetti bo'ladi", ru: 'Да, десять минус три равно семи', en: 'Yes, because ten minus three is seven' },
      { uz: "Hali aniq emas", ru: 'Пока трудно ответить', en: 'I am not sure yet' },
    ],
    neutral: { uz: "Taxmin saqlandi. Endi nima kamayishi va nima o'zgarmasligini modelda tekshiramiz.", ru: 'Гипотеза сохранена. Теперь проверим на модели, что уменьшается, а что остаётся прежним.', en: 'Your prediction has been recorded. Now use the model to check what decreases and what stays the same.' },
    audio: { intro: {
      uz: ["Bakda o'ndan yetti qism suyuqlik bor edi, undan o'ndan uch qism olindi.", "Bit o'ndan yettidan o'ndan uchni ayirsak, yettidan to'rt qolishi mumkin deb o'yladi.", "Qolgan ulushning maxraji o'zgaradimi? Taxminingizni tanlang."],
      ru: ['В баке было семь десятых жидкости, из него взяли три десятых.', 'Бит предположил, что после вычитания трёх десятых из семи десятых может остаться четыре седьмых.', 'Изменится ли знаменатель остатка? Выбери свою гипотезу.'],
      en: ['The tank contained seven tenths of its capacity, and three tenths was taken out.', 'Bit thought that subtracting three tenths from seven tenths might leave four sevenths.', 'Will the denominator of the amount left change? Choose your prediction.'],
    } },
  },
  s1: {
    eyebrow: { uz: "Vaziyatni ajratamiz", ru: 'Разбираем ситуацию', en: 'Break down the situation' },
    title: { uz: "Bor edi, olindi, qoldi", ru: 'Было, убрали, осталось', en: 'Started with, took away, left' },
    audio: {
      uz: ["Bakda o'ndan yetti qism suyuqlik bor edi.", "Undan o'ndan uch qism olindi.", "Olingan ham, qolgan ham o'sha o'nta teng bo'linma bilan o'lchanadi.", "Endi nechta o'ndan ulush qolganini topamiz."],
      ru: ['В баке было семь десятых жидкости.', 'Из него убрали три десятых.', 'И убранная, и оставшаяся части измеряются теми же десятью равными делениями.', 'Теперь найдём, сколько десятых долей осталось.'],
      en: ['The tank contained seven tenths of its capacity.', 'Three tenths was taken out.', 'Both the part removed and the part left are measured using the same ten equal divisions.', 'Now we will find how many tenths remain.'],
    },
  },
  s2: {
    eyebrow: { uz: "Boshlang'ich miqdor", ru: 'Исходное количество', en: 'Starting amount' },
    title: { uz: "O'ndan yettini yasaymiz", ru: 'Собираем семь десятых', en: 'Build seven tenths' },
    audio: {
      uz: ["Avval bitta bo'sh bakni ko'ramiz.", "Bak o'nta teng bo'linmaga ajraladi.", "O'nta bo'linmaning yettitasi suyuqlik bilan to'ladi.", "Bu boshlang'ich miqdor o'ndan yetti."],
      ru: ['Сначала перед нами один пустой бак.', 'Бак разделяется на десять равных частей.', 'Семь из десяти частей заполняются жидкостью.', 'Исходное количество равно семи десятым.'],
      en: ['First, look at one empty tank.', 'The tank is divided into ten equal parts.', 'Seven of the ten parts fill with liquid.', 'The starting amount is seven tenths.'],
    },
  },
  s3: {
    eyebrow: { uz: "Olib tashlaymiz", ru: 'Убираем доли', en: 'Remove some parts' },
    title: { uz: "Uchta o'ndan ulush chiqadi", ru: 'Убираем три десятых', en: 'Take away three tenths' },
    audio: {
      uz: ["Bakning yettita bo'linmasi to'la.", "Olinadigan uchta o'ndan ulush kontur bilan belgilanadi.", "Belgilangan uchta ulush bakdan olib tashlanadi.", "Amal o'ndan yetti minus o'ndan uch ko'rinishida yoziladi."],
      ru: ['В баке заполнены семь делений.', 'Три десятых доли, которые нужно убрать, выделяются контуром.', 'Выделенные три доли удаляются из бака.', 'Действие записывается как семь десятых минус три десятых.'],
      en: ['Seven parts of the tank are full.', 'The three tenths to be removed are outlined.', 'Those three marked parts are taken out of the tank.', 'The calculation is written as seven tenths minus three tenths.'],
    },
  },
  s4: {
    eyebrow: { uz: "Kashfiyot", ru: 'Открытие', en: 'Discovery' },
    title: { uz: "Faqat ulushlar soni kamayadi", ru: 'Уменьшается только число долей', en: 'Only the number of parts decreases' },
    audio: {
      uz: ["Bakda to'rtta to'ldirilgan ulush qoldi.", "Suratlarni ayiramiz: yetti minus uch teng to'rt.", "Bakdagi o'nta teng bo'linma saqlanib qoldi.", "Shuning uchun natija o'ndan to'rt."],
      ru: ['В баке осталось четыре заполненные доли.', 'Вычитаем числители: семь минус три равно четырём.', 'Десять равных делений бака сохранились.', 'Поэтому результат равен четырём десятым.'],
      en: ['Four filled parts remain in the tank.', 'Subtract the numerators. Seven minus three equals four.', 'The tank still has the same ten equal divisions.', 'Therefore, the result is four tenths.'],
    },
  },
  s5: {
    eyebrow: { uz: "Qoida", ru: 'Правило', en: 'Rule' },
    title: { uz: "Maxraj o'zgarmaydi", ru: 'Знаменатель не меняется', en: 'The denominator does not change' },
    audio: {
      uz: ["Bir xil maxrajli kasrlarda suratlar ayiriladi.", "Yetti minus uch teng to'rt, shuning uchun natijaning surati to'rt.", "Bo'linmalar soni o'nligicha qoldi, shuning uchun maxraj o'n.", "Surat bilan birga maxrajni ham ayirib, yettidan to'rt yozish noto'g'ri."],
      ru: ['У дробей с одинаковыми знаменателями вычитают числители.', 'Семь минус три равно четырём, поэтому числитель результата равен четырём.', 'Число делений осталось равным десяти, поэтому знаменатель равен десяти.', 'Вычитать знаменатели вместе с числителями и писать четыре седьмых неверно.'],
      en: ['When fractions have the same denominator, subtract the numerators.', 'Seven minus three equals four, so the numerator of the result is four.', 'The number of divisions remains ten, so the denominator is ten.', 'It is incorrect to subtract the denominators as well and write four sevenths.'],
    },
  },
  s6: {
    eyebrow: { uz: "Sonlar nurida", ru: 'На числовом луче', en: 'On the number line' },
    title: { uz: "Ayirish orqaga siljitadi", ru: 'Вычитание двигает назад', en: 'Subtraction moves backwards' },
    audio: {
      uz: ["Sonlar nurida o'ndan yetti nuqtasidan boshlaymiz.", "Uchta o'ndan qadam orqaga yuramiz.", "O'ndan to'rt nuqtasiga kelamiz.", "Tekshiruvda o'ndan to'rtga o'ndan uchni qo'shsak, yana o'ndan yetti hosil bo'ladi."],
      ru: ['На числовом луче начинаем с точки семь десятых.', 'Делаем три десятых шага назад.', 'Приходим в точку четыре десятых.', 'Для проверки прибавляем к четырём десятым три десятых и снова получаем семь десятых.'],
      en: ['On the number line, start at seven tenths.', 'Move backwards by three steps of one tenth.', 'You arrive at four tenths.', 'To check, add three tenths to four tenths and you return to seven tenths.'],
    },
  },
  s7: {
    eyebrow: { uz: "Chegaraviy holatlar", ru: 'Граничные случаи', en: 'Boundary cases' },
    title: { uz: "Butundan ayirish va nol", ru: 'Вычитание из целого и ноль', en: 'Subtracting from one whole and reaching zero' },
    audio: {
      uz: ["Sakkizdan sakkiz bir butunga teng.", "Bir butundan sakkizdan uchni ayirsak, sakkizdan besh qoladi.", "Beshdan beshdan beshdan beshni ayirsak, birorta ulush qolmaydi.", "Beshdan nol oddiy nolga teng.", "Qoida: teng maxrajlarda suratlarni ayiramiz, maxrajni saqlaymiz; barcha ulushlar olinsa, natija nol."],
      ru: ['Восемь восьмых равны одному целому.', 'Если из целого вычесть три восьмых, останется пять восьмых.', 'Если из пяти пятых вычесть пять пятых, не останется ни одной доли.', 'Ноль пятых равны обычному нулю.', 'Правило: при равных знаменателях вычитаем числители и сохраняем знаменатель; если убраны все доли, результат равен нулю.'],
      en: ['Eight eighths equal one whole.', 'If three eighths are subtracted from one whole, five eighths remain.', 'If five fifths are subtracted from five fifths, no parts remain.', 'Zero fifths is simply zero.', 'The rule is to subtract the numerators and keep the denominator when the denominators are equal. If every part is removed, the result is zero.'],
    },
  },
  s8: {
    eyebrow: { uz: "Mashq · 1/6", ru: 'Тренировка · 1/6', en: 'Practice · 1/6' },
    title: { uz: "Bir xil maxrajlar", ru: 'Одинаковые знаменатели', en: 'Equal denominators' },
    question: { uz: "6/9 - 2/9 = ?", ru: '6/9 − 2/9 = ?', en: '6/9 − 2/9 = ?' },
    options: ['4/9', '4/0', '8/9'],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Olti ulushdan ikkitasi olinsa, to'rtta to'qqizdan ulush qoladi.", ru: 'Верно. Если из шести долей убрать две, останутся четыре девятых.', en: 'Correct. If two parts are removed from six, four ninths remain.' },
      { uz: "Maxrajlarni ayirmang. To'qqiz ulushlarning o'lchamini bildiradi va saqlanadi.", ru: 'Не вычитай знаменатели. Девять задаёт размер долей и сохраняется.', en: 'Do not subtract the denominators. Nine defines the size of each part and stays the same.' },
      { uz: "Sakkiz qo'shish natijasi. Bu yerda olti ulushdan ikki ulush olinmoqda.", ru: 'Восемь получается при сложении. Здесь из шести долей убирают две.', en: 'Eight is the result of addition. Here, two parts are being removed from six.' },
    ],
    proof: { uz: "6/9 - 2/9 = (6 - 2)/9 = 4/9", ru: '6/9 − 2/9 = (6 − 2)/9 = 4/9', en: '6/9 − 2/9 = (6 − 2)/9 = 4/9' },
    audio: { intro: {
      uz: ["To'qqizdan oltidan to'qqizdan ikkini ayiring. Ulushlarning o'lchami bir xil; faqat ularning sonini kamaytiring."],
      ru: ['Вычти две девятых из шести девятых. Размер долей одинаковый; уменьши только их количество.'],
      en: ['Subtract two ninths from six ninths. The parts are the same size, so reduce only their number.'],
    }, on_correct: { uz: "To'g'ri. Olti ulushdan ikkitasi olinsa, to'rtta to'qqizdan ulush qoladi.", ru: 'Верно. Если из шести долей убрать две, останутся четыре девятых.', en: 'Correct. If two parts are removed from six, four ninths remain.' }, on_wrong: { uz: "Maxrajni saqlab, suratlarni yana ayiring.", ru: 'Сохрани знаменатель и ещё раз вычти числители.', en: 'Keep the denominator and subtract the numerators again.' } },
  },
  s9: {
    eyebrow: { uz: "Mashq · 2/6", ru: 'Тренировка · 2/6', en: 'Practice · 2/6' },
    title: { uz: "Mos modelni toping", ru: 'Найди подходящую модель', en: 'Find the matching model' },
    question: { uz: "7/8 - 2/8 ni qaysi model ko'rsatadi?", ru: 'Какая модель показывает 7/8 − 2/8?', en: 'Which model shows 7/8 − 2/8?' },
    options: [
      { uz: "A: 8 qismdan 5 tasi qolgan", ru: 'A: осталось 5 из 8 частей', en: 'A: 5 of 8 parts remain' },
      { uz: "B: 6 qismdan 5 tasi qolgan", ru: 'Б: осталось 5 из 6 частей', en: 'B: 5 of 6 parts remain' },
      { uz: "C: 8 qismdan 2 tasi qolgan", ru: 'В: осталось 2 из 8 частей', en: 'C: 2 of 8 parts remain' },
    ],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Sakkizta bo'linmadan yettitasi to'la edi, ikkitasi olindi va beshtasi qoldi.", ru: 'Верно. Из восьми делений семь были заполнены, две доли убрали и осталось пять.', en: 'Correct. Seven of eight parts were filled, two were removed, and five remain.' },
      { uz: "Butun oltita qismga qayta bo'linmadi. Maxraj sakkiz bo'lib qoladi.", ru: 'Целое не делили заново на шесть частей. Знаменатель остаётся восемь.', en: 'The whole was not divided again into six parts. The denominator remains eight.' },
      { uz: "Ikki olingan ulushlar soni. Savol bakda nechta ulush qolganini so'raydi.", ru: 'Две доли были убраны. Вопрос спрашивает, сколько долей осталось.', en: 'Two is the number of parts removed. The question asks how many parts remain.' },
    ],
    proof: { uz: "7/8 - 2/8 = 5/8", ru: '7/8 − 2/8 = 5/8', en: '7/8 − 2/8 = 5/8' },
    audio: { intro: {
      uz: ["Sakkizdan yettidan sakkizdan ikkini ayirish uchun mos modelni tanlang. Sakkizta bo'linma saqlanadi, rangli ulushlar esa qolgan miqdorni ko'rsatadi."],
      ru: ['Выбери модель для семи восьмых минус двух восьмых. Восемь делений сохраняются, а закрашенные доли показывают остаток.'],
      en: ['Choose the model for seven eighths minus two eighths. The eight divisions stay the same, and the shaded parts show what remains.'],
    }, on_correct: { uz: "To'g'ri. Sakkizta bo'linmadan yettitasi to'la edi, ikkitasi olindi va beshtasi qoldi.", ru: 'Верно. Из восьми делений семь были заполнены, две доли убрали и осталось пять.', en: 'Correct. Seven of eight parts were filled, two were removed, and five remain.' }, on_wrong: { uz: "Bo'linmalar soni va qolgan ulushlarni tekshiring.", ru: 'Проверь число делений и количество оставшихся долей.', en: 'Check the number of divisions and the number of parts remaining.' } },
  },
  s10: {
    eyebrow: { uz: "Mashq · 3/6", ru: 'Тренировка · 3/6', en: 'Practice · 3/6' },
    title: { uz: "Noma'lum ayriluvchi", ru: 'Неизвестное вычитаемое', en: 'Unknown amount subtracted' },
    question: { uz: "7/12 - □/12 = 5/12. Katakka qaysi son yoziladi?", ru: '7/12 − □/12 = 5/12. Какое число нужно записать в клетку?', en: '7/12 − □/12 = 5/12. Which number belongs in the box?' },
    options: ['2', '5', '12'],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Yetti minus ikki teng besh.", ru: 'Верно. Семь минус два равно пяти.', en: 'Correct. Seven minus two equals five.' },
      { uz: "Yetti minus besh ikki bo'ladi, besh emas.", ru: 'Семь минус пять равно двум, а не пяти.', en: 'Seven minus five equals two, not five.' },
      { uz: "O'n ikki maxraj va ulush o'lchamini bildiradi. Noma'lum surat yetti bilan besh orasidagi farq.", ru: 'Двенадцать является знаменателем и задаёт размер доли. Неизвестный числитель равен разности семи и пяти.', en: 'Twelve is the denominator and defines the size of each part. The unknown numerator is the difference between seven and five.' },
    ],
    proof: { uz: "7 - 5 = 2; 7/12 - 2/12 = 5/12", ru: '7 − 5 = 2; 7/12 − 2/12 = 5/12', en: '7 − 5 = 2; 7/12 − 2/12 = 5/12' },
    audio: { intro: {
      uz: ["Noma'lum ayriluvchi suratni toping. Yettidan qaysi sonni ayirsak, besh qoladi?"],
      ru: ['Найди неизвестный числитель вычитаемого. Какое число нужно вычесть из семи, чтобы осталось пять?'],
      en: ['Find the unknown numerator being subtracted. Which number must be subtracted from seven to leave five?'],
    }, on_correct: { uz: "To'g'ri. Yetti minus ikki teng besh.", ru: 'Верно. Семь минус два равно пяти.', en: 'Correct. Seven minus two equals five.' }, on_wrong: { uz: "Boshlang'ich yetti ulush bilan qolgan besh ulush orasidagi farqni toping.", ru: 'Найди разность между исходными семью и оставшимися пятью долями.', en: 'Find the difference between the original seven parts and the five that remain.' } },
  },
  s11: {
    eyebrow: { uz: "Mashq · 4/6", ru: 'Тренировка · 4/6', en: 'Practice · 4/6' },
    title: { uz: "Bitning xatosini toping", ru: 'Найди ошибку Бита', en: "Find Bit's mistake" },
    question: { uz: "Bit: 8/11 - 3/11 = 5/0. Xato nimada?", ru: 'Бит: 8/11 − 3/11 = 5/0. В чём ошибка?', en: 'Bit: 8/11 − 3/11 = 5/0. What is the mistake?' },
    options: [
      { uz: "Bit maxrajlarni ham ayirgan", ru: 'Бит вычел и знаменатели', en: 'Bit subtracted the denominators as well' },
      { uz: "Bit suratlarni noto'g'ri ayirgan", ru: 'Бит неверно вычел числители', en: 'Bit subtracted the numerators incorrectly' },
      { uz: "Bit qo'shish amalini bajargan", ru: 'Бит выполнил сложение', en: 'Bit added instead of subtracting' },
    ],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. O'n bir ulush o'lchamini bildiradi; uni o'n birdan ayirmaymiz.", ru: 'Верно. Одиннадцать задаёт размер доли; его не вычитают из одиннадцати.', en: 'Correct. Eleven defines the size of each part, so it is not subtracted from eleven.' },
      { uz: "Suratlar to'g'ri ayirilgan: sakkiz minus uch teng besh. Xato maxrajda.", ru: 'Числители вычтены верно: восемь минус три равно пяти. Ошибка в знаменателе.', en: 'The numerators were subtracted correctly because eight minus three equals five. The mistake is in the denominator.' },
      { uz: "Bit suratlarda ayirish bajargan. Xato amal belgisida emas, maxrajni nolga aylantirishda.", ru: 'Бит вычел числители. Ошибка не в знаке действия, а в превращении знаменателя в ноль.', en: 'Bit did subtract the numerators. The mistake is not the operation sign; it is changing the denominator to zero.' },
    ],
    proof: { uz: "8/11 - 3/11 = 5/11, 5/0 emas", ru: '8/11 − 3/11 = 5/11, а не 5/0', en: '8/11 − 3/11 = 5/11, not 5/0' },
    audio: { intro: {
      uz: ["Bit o'n birdan sakkiz minus o'n birdan uch teng noldan besh deb yozdi. Uning mulohazasidagi aniq xatoni toping."],
      ru: ['Бит записал: восемь одиннадцатых минус три одиннадцатых равно пяти нулевым. Найди точную ошибку в его рассуждении.'],
      en: ['Bit wrote eight elevenths minus three elevenths equals five zero-ths. Find the exact error in the reasoning.'],
    }, on_correct: { uz: "To'g'ri. O'n bir ulush o'lchamini bildiradi; uni o'n birdan ayirmaymiz.", ru: 'Верно. Одиннадцать задаёт размер доли; его не вычитают из одиннадцати.', en: 'Correct. Eleven defines the size of each part, so it is not subtracted from eleven.' }, on_wrong: { uz: "Surat va maxraj qanday ma'no bildirishini tekshiring.", ru: 'Проверь, что обозначают числитель и знаменатель.', en: 'Check what the numerator and denominator each represent.' } },
  },
  s12: {
    eyebrow: { uz: "Mashq · 5/6", ru: 'Тренировка · 5/6', en: 'Practice · 5/6' },
    title: { uz: "Qoida qachon ishlaydi?", ru: 'Когда работает правило?', en: 'When does the rule work?' },
    question: { uz: "3/4 - 1/6 ni bugungi qoida bilan hisoblay olamizmi?", ru: 'Можно ли вычислить 3/4 − 1/6 по сегодняшнему правилу?', en: "Can today's rule be used to calculate 3/4 − 1/6?" },
    options: [
      { uz: "Ha, javob 2/2", ru: 'Да, ответ 2/2', en: 'Yes, the answer is 2/2' },
      { uz: "Yo'q, maxrajlar har xil", ru: 'Нет, знаменатели разные', en: 'No, the denominators are different' },
      { uz: "Ha, javob 2/6", ru: 'Да, ответ 2/6', en: 'Yes, the answer is 2/6' },
    ],
    correctIndex: 1,
    feedback: [
      { uz: "Surat va maxrajlarni alohida ayirish mumkin emas. Bugungi qoida faqat teng maxrajlar uchun.", ru: 'Нельзя отдельно вычитать числители и знаменатели. Сегодняшнее правило работает только при равных знаменателях.', en: "The numerators and denominators cannot be subtracted separately. Today's rule applies only when the denominators are equal." },
      { uz: "To'g'ri. To'rtdan va oltidan ulushlarning o'lchami boshqa; bugun ularni hisoblamaymiz.", ru: 'Верно. Четвёртые и шестые доли имеют разный размер; сегодня мы их не вычисляем.', en: 'Correct. Fourths and sixths are different-sized parts, so we will not calculate this difference today.' },
      { uz: "Maxrajni shunchaki oltida qoldirib bo'lmaydi. Ulushlar bir xil o'lchamda emas.", ru: 'Нельзя просто оставить знаменатель шесть. Доли имеют разный размер.', en: 'You cannot simply keep six as the denominator. The parts are not the same size.' },
    ],
    proof: { uz: "Bugungi qoida: a/b - c/b = (a - c)/b", ru: 'Правило урока: a/b − c/b = (a − c)/b', en: "Today's rule: a/b − c/b = (a − c)/b" },
    audio: { intro: {
      uz: ["To'rtdan uch va oltidan birning maxrajlariga qarang. Bugungi teng maxrajlar qoidasini bu misolga ishlatish mumkinmi?"],
      ru: ['Посмотри на знаменатели трёх четвёртых и одной шестой. Можно ли применить к этому примеру сегодняшнее правило равных знаменателей?'],
      en: ["Look at the denominators of three fourths and one sixth. Can today's equal-denominator rule be applied to this example?"],
    }, on_correct: { uz: "To'g'ri. To'rtdan va oltidan ulushlarning o'lchami boshqa; bugun ularni hisoblamaymiz.", ru: 'Верно. Четвёртые и шестые доли имеют разный размер; сегодня мы их не вычисляем.', en: 'Correct. Fourths and sixths are different-sized parts, so we will not calculate this difference today.' }, on_wrong: { uz: "Avval maxrajlar teng yoki teng emasligini tekshiring.", ru: 'Сначала проверь, равны ли знаменатели.', en: 'First check whether the denominators are equal.' } },
  },
  s13: {
    eyebrow: { uz: "Mashq · 6/6", ru: 'Тренировка · 6/6', en: 'Practice · 6/6' },
    title: { uz: "Shifoxona zaxirasini hisoblaymiz", ru: 'Считаем запас больницы', en: "Calculate the hospital's remaining stock" },
    question: { uz: "Zaxira 9/12 edi, 4/12 ishlatildi. Qancha qoldi?", ru: 'Запас составлял 9/12, использовали 4/12. Сколько осталось?', en: 'The stock was 9/12, and 4/12 was used. How much remains?' },
    options: ['5/12', '5/0', '13/12'],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. To'qqiz ulushdan to'rttasi ishlatilsa, o'n ikkidan besh qoladi.", ru: 'Верно. Если из девяти долей использовать четыре, останутся пять двенадцатых.', en: 'Correct. If four of the nine parts are used, five twelfths remain.' },
      { uz: "Maxraj nolga aylanmaydi. Zaxira hali ham o'n ikkita teng bo'linmada o'lchanadi.", ru: 'Знаменатель не превращается в ноль. Запас по-прежнему измеряется двенадцатью равными частями.', en: 'The denominator does not become zero. The stock is still measured in twelve equal parts.' },
      { uz: "O'n uch qo'shish natijasi. Vaziyatda ishlatilgan miqdor zaxiradan ayiriladi.", ru: 'Тринадцать получается при сложении. В задаче использованное количество вычитают из запаса.', en: 'Thirteen is the result of addition. In this situation, the amount used must be subtracted from the stock.' },
    ],
    proof: { uz: "9/12 - 4/12 = 5/12", ru: '9/12 − 4/12 = 5/12', en: '9/12 − 4/12 = 5/12' },
    audio: { intro: {
      uz: ["Shifoxonada o'n ikkidan to'qqiz qism zaxira bor edi.", "Uning o'n ikkidan to'rt qismi ishlatildi. Bir xil o'n ikkidan ulushlarni ayirib, qolgan zaxirani toping."],
      ru: ['В больнице было девять двенадцатых запаса.', 'Четыре двенадцатых запаса использовали. Вычти одинаковые двенадцатые доли и найди остаток.'],
      en: ['The hospital had nine twelfths of its stock available.', 'Four twelfths of the stock was used. Subtract the equal twelfth parts to find what remains.'],
    }, on_correct: { uz: "To'g'ri. To'qqiz ulushdan to'rttasi ishlatilsa, o'n ikkidan besh qoladi.", ru: 'Верно. Если из девяти долей использовать четыре, останутся пять двенадцатых.', en: 'Correct. If four of the nine parts are used, five twelfths remain.' }, on_wrong: { uz: "Ikkala miqdor ham o'n ikkidan ulushlarda. Suratlarni ayiring.", ru: 'Обе величины выражены в двенадцатых долях. Вычти числители.', en: 'Both amounts are measured in twelfths. Subtract the numerators.' } },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог', en: 'Summary' },
    title: { uz: "Bir xil ulushlarni ayiramiz", ru: 'Вычитаем одинаковые доли', en: 'Subtract equal-sized parts' },
    audio: {
      uz: ["Boshlang'ich bakda o'ndan yetti qism bor edi.", "Undan o'ndan uch qism olindi.", "Bakda o'ndan to'rt qism qoldi.", "Suratlar yetti minus uch bo'ldi, maxraj esa o'nligicha qoldi.", "Keyingi darsda kasr orqali sonning ma'lum qismini topishni o'rganamiz."],
      ru: ['В исходном баке было семь десятых.', 'Из него убрали три десятых.', 'В баке осталось четыре десятых.', 'В числителе получили семь минус три, а знаменатель остался равным десяти.', 'На следующем уроке научимся находить заданную часть числа с помощью дроби.'],
      en: ['The tank initially contained seven tenths.', 'Three tenths was removed.', 'Four tenths remained in the tank.', 'The numerator became seven minus three, while the denominator stayed ten.', 'In the next lesson, we will learn how to find a specified fraction of a number.'],
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
const Frac = ({ n, d, size = 'sm' }) => <span className={'frac ' + (size === 'lg' ? 'frac-lg' : '')}><span>{n}</span><i/><span>{d}</span></span>;
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false, disabled = false }) => {
  const t = useT();
  return <div className="options">{values.map((value, index) => <button type="button" data-g4-role="answer-card" key={index + '-' + t(value)} className={'option ' + (picked === index ? 'picked ' : '') + (!neutral && solved && index === correctIndex ? 'right ' : '') + (!neutral && picked === index && picked !== correctIndex ? 'bad' : '')} disabled={disabled || (!neutral && solved)} onClick={() => onPick(index)}><b>{String.fromCharCode(65 + index)}</b><span>{t(value)}</span></button>)}</div>;
};

const FractionBar = ({ den = 8, filled = 0, removed = 0, label = null, compact = false }) => {
  const cells = Array.from({ length: den }, (_, index) => <i key={index} className={index < filled ? 'cyan' : index < filled + removed ? 'removed' : ''}/>);
  return <div className={'fraction-model ' + (compact ? 'compact' : '')}><div className="fraction-bar divided" style={{ gridTemplateColumns: 'repeat(' + den + ', 1fr)' }}>{cells}</div>{label && <div className="model-label">{label}</div>}</div>;
};

const FractionTank = ({ den = 10, filled = 0, outlined = 0, removed = 0, divisions = true, label = null, compact = false }) => {
  const bands = Array.from({ length: den }, (_, index) => {
    const isFilled = index < filled;
    const isOutlined = isFilled && index >= Math.max(0, filled - outlined);
    const isRemoved = index >= filled && index < filled + removed;
    return <i key={index} className={(isFilled ? 'tank-fill ' : '') + (isOutlined ? 'tank-outline ' : '') + (isRemoved ? 'tank-removed' : '')}/>;
  });
  return <div className={'tank-model ' + (compact ? 'compact' : '')}><div className={'tank-shell ' + (!divisions ? 'undivided' : '')}><div className="tank-spout"/><div className="tank-handle"/><div className="tank-body">{bands}</div></div>{label && <div className="model-label">{label}</div>}</div>;
};

const SubtractionLine = ({ den = 10, start = 7, amount = 3, frame = 0, marker = null }) => {
  const end = start - amount;
  const ticks = Array.from({ length: den + 1 }, (_, index) => <i key={index} className="nl-tick" style={{ left: (index / den * 100) + '%' }}><span>{index === 0 ? '0' : index === den ? '1' : ''}</span></i>);
  return <div className="number-line">
    <div className="nl-track">{ticks}</div>
    <b className="nl-dot lime" style={{ left: (start / den * 100) + '%' }}>{start}/{den}</b>
    {frame >= 1 && <div className="nl-arrow back" style={{ left: (end / den * 100) + '%', width: (amount / den * 100) + '%' }}/>}
    {frame >= 2 && <b className="nl-dot cyan" style={{ left: (end / den * 100) + '%' }}>{end}/{den}</b>}
    {marker !== null && <b className="nl-dot free" style={{ left: (marker / den * 100) + '%' }}>{marker}/{den}</b>}
  </div>;
};

const ModelChoices = ({ picked, solved, correctIndex, onPick, options = [], disabled = false }) => {
  const t = useT();
  const items = [{ den: 8, filled: 5 }, { den: 6, filled: 5 }, { den: 8, filled: 2 }];
  return <div className="model-choices">{items.map((item, index) => <button type="button" key={index} className={`model-choice ${picked === index ? 'picked' : ''} ${solved && correctIndex === index ? 'right' : ''} ${picked === index && !solved ? 'bad' : ''}`} onClick={() => onPick(index)} disabled={disabled || solved}><b>{String.fromCharCode(65 + index)}</b><span>{t(options[index])}</span><FractionBar {...item} compact/></button>)}</div>;
};

const RuleBoundaryModels = ({ operation }) => <div className="rule-boundary-models"><div><Frac n="1" d="4"/><FractionBar den={4} filled={1} compact/></div><strong>{operation}</strong><div><Frac n="1" d="6"/><FractionBar den={6} filled={1} compact/></div></div>;

function ChoiceExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, visual = null, renderVisual = null, bit = null, modelChoices = false }) {
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
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.feedback[index]));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  const contextVisual = modelChoices ? <ModelChoices picked={picked} solved={solved} correctIndex={c.correctIndex} onPick={pick} options={c.options} disabled={!narrationReady}/> : renderVisual ? renderVisual({ frame: Math.min(audio.frame, 1), solved }) : visual;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack"><Heading c={c} bit={bit}/>{contextVisual && <div className={'attempt-model ' + (hintLevel > 0 ? 'attempt-highlight' : '')}>{contextVisual}</div>}<section className={'question ' + (hintLevel > 0 ? 'attempt-highlight' : '')}><h2>{t(c.question)}</h2>{hintLevel > 0 && <div className="attempt-cue" role="status">{t({ uz: "Modelda teng bo'linmalarni ajrating: ayirishda maxraj ulush o'lchamini saqlaydi.", ru: 'Выделите равные деления модели: при вычитании знаменатель сохраняет размер доли.', en: 'Identify the equal divisions in the model: during subtraction, the denominator keeps the size of each part unchanged.' })}</div>}{!modelChoices && <Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved} disabled={!narrationReady}/>}<FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section></div></Stage>;
}

function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT();
  const c = CONTENT.s0;
  const audio = useNarration(c.audio, screen);
  const narrationReady = audio.muted || audio.completed;
  const frame = audio.frame;
  const [picked, setPicked] = useState(storedAnswer?.neutralChoice ?? null);
  const pick = (index) => { if (!narrationReady) return; setPicked(index); audio.pushOneOff(t(c.neutral)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: true, attempts: 1, solved: true, neutralChoice: index }); };
  return <Stage screen={screen} audio={audio} onNext={onNext} nextDisabled={picked === null || !narrationReady}><div className="stack hook-stack" data-g4-screen="hook"><Heading c={c} bit="think" hook/><h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2><section className="hook-scene-adapter" data-g4-role="hook-scene"><div className="hook-scene-visual" data-g4-role="visual-frame"><section className="hook-model"><FractionTank den={10} filled={7} outlined={frame >= 1 ? 3 : 0} label={frame >= 2 ? <span><Frac n="7" d="10"/> - <Frac n="3" d="10"/> = <Frac n="4" d="7"/> ?</span> : null}/></section><div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think"/></div></div></section><section className="question" data-g4-role="answer-card"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} neutral disabled={!narrationReady}/><FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  const labels = [
    { uz: "Bor edi: 7/10", ru: 'Было: 7/10', en: 'Started with: 7/10' },
    { uz: "Olindi: 3/10", ru: 'Убрали: 3/10', en: 'Removed: 3/10' },
    { uz: "Bo'linmalar o'ndanligicha qoldi", ru: 'Деления остались десятыми', en: 'The divisions are still tenths' },
    { uz: "Qoldi: ?", ru: 'Осталось: ?', en: 'Left: ?' },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="model-card"><FractionTank den={10} filled={7} outlined={frame >= 1 ? 3 : 0}/><div className="state-grid">{labels.map((item, index) => <span className={frame >= index ? 'show' : ''} key={t(item)}>{t(item)}</span>)}</div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s2; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="model-card"><FractionTank den={10} filled={frame >= 2 ? 7 : 0} divisions={frame >= 1} label={frame >= 3 ? <Frac n="7" d="10" size="lg"/> : null}/></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s3; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  const [replay, setReplay] = useState(0); const visualFrame = replay > 0 ? 2 : frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="model-card"><FractionTank key={replay} den={10} filled={visualFrame >= 2 ? 4 : 7} outlined={visualFrame === 1 ? 3 : 0} removed={visualFrame >= 2 ? 3 : 0}/><button type="button" className="tiny-action" onClick={() => setReplay((value) => value + 1)}>{t({ uz: "Olib tashlashni qayta ko'rsatish", ru: 'Повторить удаление', en: 'Show the removal again' })}</button><div className={'formula-card ' + (frame >= 3 ? 'show' : '')}><Frac n="7" d="10"/> - <Frac n="3" d="10"/></div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen4({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s4; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c} bit="idea"/><section className="model-card"><FractionTank den={10} filled={4}/><div className={'formula-card ' + (frame >= 1 ? 'show' : '')}>7 - 3 = 4</div><div className={'state-note ' + (frame >= 2 ? 'show' : '')}>{t({ uz: "10 ta bo'linma saqlandi", ru: '10 делений сохранились', en: '10 divisions remain' })}</div><div className={'result-chip ' + (frame >= 3 ? 'show' : '')}><Frac n="4" d="10" size="lg"/></div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="rule-card"><div className={'rule-line ' + (frame >= 0 ? 'show' : '')}>(7 - 3) / 10</div><div className={'rule-line accent ' + (frame >= 1 ? 'show' : '')}>4 / 10</div><div className={'state-note ' + (frame >= 2 ? 'show' : '')}>{t({ uz: "10 ta bo'linma o'zgarmadi", ru: '10 делений не изменились', en: 'The 10 divisions did not change' })}</div><div className={'wrong-formula ' + (frame >= 3 ? 'show' : '')}>4 / 7</div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const [marker, setMarker] = useState(5);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="model-card"><SubtractionLine den={10} start={7} amount={3} frame={audio.frame} marker={marker}/><label className="marker-control"><span>{t({ uz: "Erkin belgi", ru: 'Свободная метка', en: 'Free marker' })}: {marker}/10</span><input className="free-marker" type="range" min="0" max="10" step="1" value={marker} onChange={(event) => setMarker(Number(event.target.value))}/></label><div className={'formula-card ' + (audio.frame >= 2 ? 'show' : '')}><Frac n="7" d="10"/> - <Frac n="3" d="10"/> = <Frac n="4" d="10"/></div><div className={'state-note ' + (audio.frame >= 3 ? 'show' : '')}>{t({ uz: "Tekshiruv: 4/10 + 3/10 = 7/10", ru: 'Проверка: 4/10 + 3/10 = 7/10', en: 'Check: 4/10 + 3/10 = 7/10' })}</div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen7({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s7; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="boundary-grid"><div className={frame >= 0 ? 'show' : ''}><FractionBar den={8} filled={frame >= 1 ? 5 : 8} removed={frame >= 1 ? 3 : 0} label={frame >= 1 ? <span><Frac n="8" d="8"/> - <Frac n="3" d="8"/> = <Frac n="5" d="8"/></span> : <span><Frac n="8" d="8"/> = 1</span>}/></div><div className={frame >= 2 ? 'show' : ''}><FractionBar den={5} filled={frame >= 3 ? 0 : 5} removed={frame >= 3 ? 5 : 0} label={frame >= 3 ? <span><Frac n="0" d="5"/> = 0</span> : <span><Frac n="5" d="5"/> - <Frac n="5" d="5"/></span>}/></div><div className={'state-note ' + (frame >= 4 ? 'show' : '')}>{t({ uz: "Suratlarni ayiring, maxrajni saqlang", ru: 'Вычти числители, сохрани знаменатель', en: 'Subtract the numerators and keep the denominator' })}</div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen8(props) { return <ChoiceExercise {...props}/>; }
function Screen9(props) { return <ChoiceExercise {...props} modelChoices/>; }
function Screen10(props) { return <ChoiceExercise {...props}/>; }
function Screen11(props) { return <ChoiceExercise {...props} bit="happy" visual={<div className="bit-error"><span>8/11 - 3/11</span><b>= 5/0</b></div>}/>; }
function Screen12(props) { return <ChoiceExercise {...props} visual={<RuleBoundaryModels operation="−"/>}/>; }
function Screen13(props) { return <ChoiceExercise {...props} renderVisual={({ frame }) => <div className="hospital-model"><span>−</span><FractionTank den={12} filled={9} outlined={frame >= 1 ? 4 : 0} compact/></div>}/>; }

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
  return <aside className="g4-title-card g4-title-card-stage" data-g4-role="title-card" role="status" aria-live="polite"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t({ uz: 'UNVON OLINDI', ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: 'TITLE EARNED' })}</span><h2 className="g4-title-card-title">{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t({ uz: 'birinchi urinishda', ru: 'с первой попытки', en: 'on the first try' })}</span></div></aside>;
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
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const title = { uz: "Kasrlar ayirmasi ustasi", ru: 'Мастер разности дробей', en: 'Fraction Difference Master' }; const reflectionOptions = [{ uz: 'Model bilan tekshiraman', ru: 'Проверю по модели', en: 'I will check with a model' }, { uz: 'Qoida va birlikni tekshiraman', ru: 'Проверю правило и единицу', en: 'I will check the rule and unit' }, { uz: 'Teskari amal bilan tekshiraman', ru: 'Проверю обратным действием', en: 'I will use the inverse operation' }]; const chooseReflection = (index) => { if (!narrationReady || titleClaimed) return; setReflectionChoice(index); onAnswer({ ...(storedAnswer ?? {}), screenIdx: screen, stage: null, reflectionChoice: index, titleClaimed: false }); audio.pushOneOff(t(reflectionOptions[index])); }; const claimTitle = () => { if (!narrationReady || reflectionChoice === null || titleClaimed) return; setTitleClaimed(true); onAnswer({ screenIdx: screen, stage: null, question: t({ uz: 'Tanlangan tekshiruv', ru: 'Выбранная проверка', en: 'Chosen check' }), options: reflectionOptions.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: reflectionChoice, studentAnswer: t(reflectionOptions[reflectionChoice]), correct: true, firstTry: true, attempts: 1, solved: true, reflectionChoice, titleClaimed: true }); }; const frame = audio.frame; const complete = frame >= 4;
  const takeaways = [
    { label: { uz: "Bor edi", ru: 'Было', en: 'Started with' }, value: '7/10' },
    { label: { uz: "Olindi", ru: 'Убрали', en: 'Removed' }, value: '- 3/10' },
    { label: { uz: "Qoldi", ru: 'Осталось', en: 'Left' }, value: '4/10' },
    { label: { uz: "Qoida", ru: 'Правило', en: 'Rule' }, value: '7 - 3; 10 → 10' },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={titleClaimed ? finishLesson : undefined} nextDisabled={!titleClaimed} finish><div className="stack"><section className="finale-heading"><span>◆ {t({ uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП', en: 'FINAL STAGE' })}</span><h1>{t(c.title)}</h1><p>{t({ uz: "Bakdan olingan ulushlarni va qolgan miqdorni to'g'ri bog'ladik.", ru: 'Мы правильно связали убранные доли и оставшееся количество.', en: 'We correctly connected the parts removed from the tank with the amount left.' })}</p></section><section className="finale-main"><div className="finale-payoff"><small>{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', en: 'STARTING MISSION SOLUTION' })}</small><FractionTank den={10} filled={frame >= 2 ? 4 : 7} outlined={frame === 1 ? 3 : 0} removed={frame >= 2 ? 3 : 0}/><div className={'finale-answer ' + (frame >= 2 ? 'show' : '')}><Frac n="7" d="10"/> - <Frac n="3" d="10"/> = <Frac n="4" d="10"/></div></div><div className="finale-takeaways">{takeaways.map((item, index) => <div className={'finale-takeaway ' + (frame >= index ? 'show' : '')} key={t(item.label)}><b>{index + 1}</b><span><small>{t(item.label)}</small><strong>{item.value}</strong></span></div>)}</div></section><section className="finale-bottom"><div className={'finale-bridge ' + (complete ? 'show' : '')}><small>{t({ uz: "KEYINGI MAVZU", ru: 'СЛЕДУЮЩАЯ ТЕМА', en: 'NEXT TOPIC' })}</small><strong>{t({ uz: "Sonning kasr qismini topish", ru: 'Нахождение дробной части числа', en: 'Finding a fraction of a number' })}</strong></div><ReflectionPanel choices={reflectionOptions} choice={reflectionChoice} onChoose={chooseReflection} disabled={!narrationReady || titleClaimed}/><G4FinalTitleReward ready={narrationReady} titleClaimed={titleClaimed} reflectionChoice={reflectionChoice} onClaim={claimTitle} title={title} answers={answers}/></section></div></Stage>;
}

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars21({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
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
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars21 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES + G4_ETALON_OVERRIDES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={LANGUAGE_LABELS[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>;
}

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

const STYLES = `
.stage-hook .hook-model{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
@media(max-width:639.98px){.stage-hook .hook-model{border-radius:18px}}
.g4-title-card-placeholder{width:100%;min-height:116px}
.g4-title-card{position:relative;isolation:isolate;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)}
.g4-title-card-medal{position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px;z-index:2}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;z-index:2;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}.g4-title-card-bit>svg,.g4-title-card-bit .bit,.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-kicker{position:relative;color:#A8EAF0;font:900 10px/1.2 'JetBrains Mono',monospace;letter-spacing:.13em;z-index:2}.g4-title-card-title{position:relative;margin:0!important;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif;z-index:2}.g4-title-card-score{position:relative;align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10);z-index:2}.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-fall 2.4s linear 2 both}.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
.g4-title-reveal-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}.g4-title-reveal-card{position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)}.g4-title-reveal-card::after{content:'';position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%)}
.g4-title-reveal-rays{position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);transform:translate(-50%,-50%);animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-turn 26s linear .8s 1 both}.g4-title-reveal-medal{position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;border:6px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);font-size:52px;animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both}.g4-title-reveal-title{position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0!important;font:750 clamp(34px,5vw,58px)/1.02 'Source Serif 4',Georgia,serif;text-shadow:0 4px 24px rgba(0,0,0,.72);transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-reveal-confetti i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;background:#FFE284;animation:g4-title-reveal-fall 2.4s linear 2 both}.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes g4-title-card-fall{to{transform:translateY(230px) rotate(460deg)}}@keyframes g4-title-reveal-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}@keyframes g4-title-reveal-rays-turn{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes g4-title-reveal-fall{to{transform:translateY(470px) rotate(560deg)}}
@media(max-width:639.98px){.g4-title-card-placeholder{min-height:88px}.g4-title-card{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}.g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}.g4-title-card-bit{width:57px;height:71px}.g4-title-card-title{font-size:14px}.g4-title-reveal-card{min-height:100dvh;padding:24px 18px}.g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}.g4-title-reveal-title{top:calc(50% + 62px);font-size:29px}}
@media(prefers-reduced-motion:reduce){.g4-title-card,.g4-title-card-bit,.g4-title-reveal-overlay,.g4-title-reveal-rays,.g4-title-reveal-medal,.g4-title-reveal-title{animation:none!important}.g4-title-card{opacity:1;transform:none!important}.g4-title-card-confetti,.g4-title-reveal-confetti{display:none}.g4-title-reveal-overlay{opacity:1}.g4-title-reveal-rays{opacity:.28;transform:translate(-50%,-50%)}.g4-title-reveal-medal{opacity:1;transform:translate(-50%,-50%)}.g4-title-reveal-title{opacity:1;transform:translateX(-50%)}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}
.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{height:100%;min-height:0;overflow:hidden;display:grid;align-content:center;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;opacity:0;transform:translateY(7px)}.feedback.open{opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{font-size:13px;line-height:1.45}.caption{position:static;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:proof-in .35s ease both}.frac{display:inline-flex;min-width:25px;flex-direction:column;align-items:center;vertical-align:middle;color:inherit;font:800 1em/1 'JetBrains Mono',monospace}.frac i{width:100%;height:2px;margin:2px 0;border-radius:2px;background:currentColor}.frac-lg{font-size:1.35em}.hook-model,.whole-card,.rule-card,.finale-payoff{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}
.lesson-root button:focus-visible,.lesson-root input:focus-visible,.lesson-root input[type='range']:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.hook-model{display:grid;place-items:center;gap:12px;background:linear-gradient(135deg,#E5F5F6,#FFF)}.fraction-model{width:min(620px,94%);margin:0 auto;display:grid;gap:10px}.fraction-bar{height:112px;display:grid;overflow:hidden;border-radius:18px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.fraction-bar i{min-width:0;border-right:2px solid rgba(23,59,82,.18);background:#F4F5F1;transition:background .45s ease,transform .45s ease}.fraction-bar i:last-child{border-right:0}.fraction-bar i.cyan{background:#46B8C5}.fraction-bar i.lime{background:#95C93D}.fraction-bar i.removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.12),rgba(255,91,53,.12) 7px,rgba(255,91,53,.42) 7px,rgba(255,91,53,.42) 14px)}.fraction-bar i.merged{background:linear-gradient(135deg,#168FA3,#95C93D)}.fraction-bar.whole i{border-right:0}.fraction-model.compact .fraction-bar{height:48px;border-radius:11px}.model-label{justify-self:center;padding:8px 13px;border-radius:12px;color:#173B52;background:#E5F5F6;font:900 16px "JetBrains Mono",monospace}.state-note,.formula-card,.result-chip{padding:12px 15px;border-radius:14px;opacity:.12;transform:translateY(7px);transition:.4s ease;text-align:center}.state-note{color:#227A53;background:#E7F3EC;font-size:13px;font-weight:850}.formula-card{color:#FFF;background:#173B52;font:900 17px "JetBrains Mono",monospace}.result-chip{justify-self:center;color:#FFF;background:#FF5B35;font:900 20px "JetBrains Mono",monospace}.show{opacity:1!important;transform:none!important}.tokens{display:flex;align-items:center;justify-content:center;gap:8px;color:#50616D;font-size:12px;font-weight:800}.tokens i{width:28px;height:28px;border-radius:9px;background:#95C93D;animation:token-pop .4s ease both}.tokens i:nth-child(2){animation-delay:.1s}.tokens i:nth-child(3){animation-delay:.2s}.rule-card,.whole-card{display:grid;gap:12px}.rule-line{padding:13px;border-radius:14px;opacity:.12;transform:translateY(6px);color:#173B52;background:#E5F5F6;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.rule-line.accent{color:#FFF;background:#173B52}.wrong-formula{padding:12px;position:relative;opacity:.12;color:#A96F13;background:#FFF5D9;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.wrong-formula::after{content:"";position:absolute;left:28%;right:28%;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.tank-model{width:min(560px,96%);margin:0 auto;display:grid;place-items:center;gap:10px}.tank-shell{width:min(360px,82%);height:210px;position:relative;padding:16px 16px 14px;border:5px solid ${T.navy};border-top:0;border-radius:0 0 34px 34px;background:rgba(255,255,255,.72);filter:drop-shadow(0 14px 16px rgba(${T.shadowBase},.13))}.tank-body{height:100%;overflow:hidden;border-radius:6px 6px 22px 22px;display:flex;flex-direction:column-reverse;background:#F4F5F1}.tank-body i{min-height:0;flex:1;border-top:2px solid rgba(23,59,82,.18);transition:background .38s ease,opacity .38s ease,transform .38s ease}.tank-body i:first-child{border-top:0}.tank-body i.tank-fill{background:linear-gradient(90deg,#46B8C5,${T.cyan})}.tank-body i.tank-outline{box-shadow:inset 0 0 0 3px ${T.lime}}.tank-body i.tank-removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.16),rgba(255,91,53,.16) 8px,rgba(255,91,53,.48) 8px,rgba(255,91,53,.48) 16px);animation:tank-out .42s ease both}.tank-shell.undivided .tank-body i{border-top-color:transparent}.tank-spout{width:76px;height:19px;position:absolute;left:-63px;top:-4px;border:5px solid ${T.navy};border-right:0;border-radius:13px 0 0 13px;background:#fff}.tank-handle{width:70px;height:90px;position:absolute;right:-46px;top:44px;border:12px solid ${T.navy};border-left:0;border-radius:0 38px 38px 0}.tank-model.compact .tank-shell{width:190px;height:92px;padding:7px;border-width:3px;border-radius:0 0 18px 18px}.tank-model.compact .tank-spout{width:32px;height:10px;left:-27px;border-width:3px}.tank-model.compact .tank-handle{width:34px;height:45px;right:-24px;top:18px;border-width:7px}.state-grid{margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.state-grid span{min-height:52px;padding:9px;border-radius:13px;display:grid;place-items:center;opacity:.12;transform:translateY(6px);color:${T.navy};background:${T.cyanSoft};text-align:center;font-size:11px;font-weight:850;transition:.38s ease}.boundary-grid{padding:18px;border-radius:22px;display:grid;grid-template-columns:1fr 1fr;gap:12px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.boundary-grid>div{padding:10px;border-radius:16px;opacity:.12;transform:translateY(6px);background:#F8F8F4;transition:.4s ease}.boundary-grid>.state-note{grid-column:1/-1}.hospital-model{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:14px;background:${T.cyanSoft}}.hospital-model>span{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;color:#fff;background:${T.accent};font:900 27px 'JetBrains Mono',monospace}.nl-arrow.back{border-right:0;border-left:3px solid ${T.accent};border-radius:14px 0 0 0}.nl-arrow.back::after{right:auto;left:-5px;border-left:0;border-right:8px solid ${T.accent}}.number-line{height:150px;position:relative;padding:54px 7% 0}.nl-track{height:4px;position:relative;border-radius:4px;background:#173B52}.nl-tick{width:2px;height:18px;position:absolute;top:-7px;background:#87949D}.nl-tick span{position:absolute;top:20px;left:50%;transform:translateX(-50%);font:800 12px "JetBrains Mono",monospace}.nl-dot{width:44px;height:38px;position:absolute;top:27px;transform:translateX(-50%);border-radius:12px;display:grid;place-items:center;color:#FFF;font:900 11px "JetBrains Mono",monospace;z-index:2;animation:dot-pop .35s ease both}.nl-dot.cyan{background:#168FA3}.nl-dot.lime{background:#95C93D}.nl-arrow{height:22px;position:absolute;top:84px;border-top:3px solid #FF5B35;border-right:3px solid #FF5B35;border-radius:0 14px 0 0;animation:arrow-grow .45s ease both}.nl-arrow::after{content:"";position:absolute;right:-5px;top:-7px;border-left:8px solid #FF5B35;border-top:5px solid transparent;border-bottom:5px solid transparent}.model-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.model-choices>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:26px 1fr;align-items:center;gap:6px;background:#FFF;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choices>div>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 10px "JetBrains Mono",monospace}.bit-error{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;color:#A96F13;background:#FFF5D9;font:900 19px "JetBrains Mono",monospace}.bit-error b{position:relative}.bit-error b::after{content:"";position:absolute;left:-5px;right:-5px;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.energy-model{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px}.energy-model>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;background:#FFF}.energy-model>div>span{font-size:23px}.energy-model>strong{text-align:center;color:#FF5B35;font-size:23px}.finale-heading{padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{color:#FF5B35;font:900 9px "JetBrains Mono",monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:#173B52;font:750 clamp(21px,3vw,28px)/1.08 "Source Serif 4",Georgia,serif}.finale-heading p{margin-top:4px!important;color:#50616D;font-size:11px}.finale-main{display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);gap:10px}.finale-payoff{display:grid;align-content:center;gap:8px}.finale-payoff>small{color:#168FA3;font-size:9px;font-weight:900;letter-spacing:.09em}.finale-answer{padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:#227A53;background:#E7F3EC;text-align:center;font:900 13px "JetBrains Mono",monospace;transition:.42s ease}.finale-takeaways{display:grid;gap:6px}.finale-takeaway{min-height:42px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px 1fr;align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:.42s ease}.finale-takeaway.show{background:#E5F5F6}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 9px "JetBrains Mono",monospace}.finale-takeaway span{display:grid;gap:2px;font-size:11px;font-weight:800}.finale-takeaway small{color:#168FA3;font-size:8px;text-transform:uppercase}.finale-takeaway strong{color:#173B52;font-family:"JetBrains Mono",monospace}.finale-bottom{display:grid;grid-template-columns:1.2fr .8fr;gap:10px}.finale-bridge{padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#FFF;background:#173B52;transition:.42s ease}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px "Source Serif 4",Georgia,serif}.finale-reward{min-height:100px;position:relative;overflow:hidden;padding:12px 70px 11px 52px;border-radius:17px;display:grid;align-content:center;color:#FFF;background:linear-gradient(135deg,#234B62,#173B52)}.finale-reward>div:nth-child(2){display:grid;gap:3px}.finale-reward small{color:#98E1E5;font-size:8px;font-weight:900}.finale-reward strong{font:750 14px "Source Serif 4",Georgia,serif}.finale-reward b{color:#FFE284;font:900 11px "JetBrains Mono",monospace}.finale-reward>.g1-char{position:absolute;right:2px;bottom:-5px;width:67px;height:84px}.finale-medal{position:absolute;left:10px;top:50%;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#173B52;background:#95C93D}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:#FF5B35}.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;justify-self:end;color:${T.accent};background:${T.accentSoft};cursor:pointer;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.marker-control{width:min(620px,94%);padding:10px 13px;border-radius:14px;display:grid;gap:7px;color:${T.navy};background:${T.cyanSoft};font:850 12px 'Manrope',sans-serif}.free-marker{width:100%;min-height:44px;margin:0;accent-color:${T.accent};cursor:pointer}.nl-dot.free{top:102px;background:${T.navy};animation-duration:.4s}.attempt-model{border-radius:20px;transition:box-shadow .32s ease,background .32s ease}.attempt-highlight{box-shadow:0 0 0 3px rgba(22,143,163,.38),0 14px 26px -20px rgba(22,143,163,.8)!important;background:rgba(229,245,246,.72)!important}.attempt-cue{padding:9px 12px;border-radius:12px;color:${T.cyan};background:${T.cyanSoft};font-size:12px;font-weight:850;animation:attempt-cue-in .3s ease both}.stack{animation-duration:.5s}.caption{animation:caption-in .32s ease both}.formula-card{transition-duration:.32s!important}.result-chip{transition-duration:.22s!important}
@keyframes tank-out{from{opacity:0;transform:translateY(-10px)}}@keyframes caption-in{from{opacity:0;transform:translateY(5px)}}@keyframes attempt-cue-in{from{opacity:0;transform:translateY(5px)}}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(5px)}}@keyframes token-pop{from{opacity:0;transform:scale(.45)}}@keyframes dot-pop{from{opacity:0;transform:translateX(-50%) scale(.55)}}@keyframes arrow-grow{from{transform:scaleX(0);transform-origin:left}}@keyframes bit-move{to{transform:translateY(-2px) rotate(2deg)}}@keyframes pulse{to{transform:scale(1.07)}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.hook-model,.whole-card,.rule-card,.question{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.fraction-bar{height:82px}.tank-shell{width:min(292px,78%);height:168px}.state-grid{grid-template-columns:1fr 1fr}.boundary-grid{grid-template-columns:1fr}.boundary-grid>.state-note{grid-column:1}.hospital-model{padding-inline:7px}.model-choices{grid-template-columns:1fr}.energy-model{grid-template-columns:1fr}.energy-model>strong{transform:rotate(90deg)}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-main,.finale-bottom{gap:8px}.finale-takeaway{min-height:36px}.number-line{height:135px;padding-inline:9%}}
.g4-title-claim{width:100%;min-height:100px;padding:13px 18px;border:0;border-radius:17px;display:grid;grid-template-columns:42px 1fr;grid-template-rows:auto auto;align-items:center;column-gap:12px;color:#fff;background:linear-gradient(135deg,#0E6978,#173B52);cursor:pointer;text-align:left;box-shadow:0 22px 42px -25px rgba(14,105,120,.9)}.g4-title-claim>span{grid-row:1/3;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);font-size:19px}.g4-title-claim>strong{font:750 16px 'Source Serif 4',Georgia,serif}.g4-title-claim>small{color:#A8EAF0;font-size:11px;font-weight:800}
.feedback{min-height:76px!important;padding:11px 15px 11px 10px!important;grid-template-columns:52px 1fr!important;align-items:center!important;gap:11px!important}.feedback.correct{background:linear-gradient(135deg,#DDF2E6,#F7FFF9)!important;box-shadow:inset 5px 0 ${T.success},0 13px 26px -23px rgba(34,122,83,.75)!important}.feedback.wrong{background:linear-gradient(135deg,#FFF0BE,#FFF9E8)!important;box-shadow:inset 5px 0 ${T.warn},0 13px 26px -23px rgba(169,111,19,.72)!important}.feedback-bit{width:50px;height:62px;display:block;overflow:visible}.feedback-bit .g1-char,.feedback-bit .bit,.feedback-bit>svg{width:100%;height:100%}.feedback p{display:grid;gap:7px;font-size:15px!important;line-height:1.48!important}.feedback-proof{padding-top:7px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 15px/1.35 'JetBrains Mono',monospace}
.model-choices{grid-template-columns:1fr!important;gap:11px!important}.model-choice{width:100%;min-height:100px;padding:11px 13px;border:0;border-radius:16px;display:grid;grid-template-columns:32px minmax(140px,.8fr) minmax(250px,1.2fr);align-items:center;gap:11px;color:${T.ink};background:#fff;cursor:pointer;text-align:left;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choice>b{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 11px 'JetBrains Mono',monospace}.model-choice>span{font-size:14px;font-weight:850}.model-choice .fraction-model{width:100%}.model-choice.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 3px rgba(255,91,53,.25)}.model-choice.right{background:${T.successSoft};box-shadow:inset 0 0 0 3px rgba(34,122,83,.3)}.model-choice.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 3px rgba(169,111,19,.26)}.model-choice:disabled{cursor:default}
.rule-boundary-models{padding:13px;border-radius:19px;display:grid;grid-template-columns:1fr 34px 1fr;align-items:center;gap:10px;background:${T.cyanSoft}}.rule-boundary-models>div{padding:10px;border-radius:14px;display:grid;grid-template-columns:44px 1fr;align-items:center;gap:9px;background:#fff}.rule-boundary-models>strong{text-align:center;color:${T.accent};font:900 24px 'JetBrains Mono',monospace}.rule-boundary-models .frac{font-size:18px}.tank-body i.tank-removed{opacity:.58}
@media(max-width:639.98px){.g4-title-claim{min-height:88px}.feedback{grid-template-columns:44px 1fr!important}.feedback-bit{width:43px;height:54px}.feedback p{font-size:14px!important}.model-choice{min-height:126px;grid-template-columns:30px 1fr}.model-choice>.fraction-model{grid-column:1/-1}.rule-boundary-models{grid-template-columns:1fr}.rule-boundary-models>strong{transform:rotate(90deg)}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.state-note,.formula-card,.result-chip,.rule-line,.wrong-formula,.finale-answer,.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}}
.caption-slot{flex:none;min-height:38px;padding:6px 10px;border-radius:11px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:10px;line-height:1.22}.caption-slot.is-visible{visibility:visible}.feedback.feedback-slot{height:76px;min-height:76px;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1}.feedback-bit{width:48px;height:58px;display:block}.feedback-bit .g1-char,.feedback-bit>svg{width:100%;height:100%}.feedback-proof{display:block;margin-top:4px;padding-top:4px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 12px/1.2 'JetBrains Mono',monospace}.feedback-proof small{display:block;font-size:8px;letter-spacing:.1em}.lesson-root{height:100dvh!important;min-height:0!important;overflow:hidden!important}.stage-content{display:flex;flex-direction:column;gap:4px;overflow:hidden!important}.stage-content>.stack{flex:1;min-height:0}.btn-white-accent:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:11px!important;padding-bottom:4px!important}.lesson-root-preview .stage-header{padding-top:52px!important}.progress-track{height:4px!important;margin-bottom:5px!important}.stage-content{padding-top:3px!important;padding-bottom:3px!important}.stage-nav{min-height:52px!important}.stack{gap:4px!important}.heading{min-height:40px!important}.heading h1{font-size:17px!important}.heading .g1-char{width:38px!important;height:48px!important}.question,.model-card,.visual-card,.hook-model,.whole-card,.rule-card,.beat-list{padding:5px!important;border-radius:11px!important}.boundary-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;padding:5px!important;border-radius:11px!important}.boundary-grid>div{padding:4px!important;border-radius:9px!important}.boundary-grid>.state-note{grid-column:1/-1!important}.boundary-grid .fraction-model{gap:3px!important}.boundary-grid .fraction-bar{height:44px!important;border-radius:9px!important}.boundary-grid .model-label{padding:4px 6px!important;border-radius:8px!important;font-size:9px!important}.options{gap:3px!important}.option{min-height:44px!important;padding:4px!important;border-radius:9px!important;font-size:9px!important}.feedback.feedback-slot{height:54px;min-height:54px!important;padding:4px 6px!important;grid-template-columns:32px 1fr!important;gap:4px!important}.feedback-bit{width:31px;height:39px}.feedback p{font-size:9px!important;line-height:1.16!important}.caption-slot{min-height:28px;padding:3px 7px;font-size:8px}.beat-list{gap:3px!important}.beat{min-height:29px!important;padding:3px!important;font-size:8px!important}.btn-white-accent,.btn-ghost{min-height:44px!important;min-width:104px!important;padding:0 8px!important;font-size:11px!important}.finale-main,.finale-bottom{grid-template-columns:1fr 1fr!important;gap:4px!important}}
.strategy-replay{min-height:44px;padding:7px 12px;border:0;border-radius:11px;justify-self:center;color:${T.cyan};background:${T.cyanSoft};cursor:pointer;font-size:11px;font-weight:850}.strategy-replay:disabled{cursor:not-allowed;opacity:.46}
@media(min-width:640px) and (max-width:1100px) and (max-height:800px){.stage-discovery .stack{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;align-content:stretch;column-gap:12px;row-gap:8px}.stage-discovery .heading{grid-column:1/-1;min-height:64px}.stage-discovery .heading h1{font-size:29px}.stage-discovery .heading .g1-char{width:60px;height:75px}.stage-discovery .model-card{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:10px;padding:12px}.stage-discovery .tank-model{width:100%}.stage-discovery .tank-shell{width:min(300px,80%);height:174px}.stage-discovery .formula-card,.stage-discovery .state-note,.stage-discovery .result-chip{min-height:44px;display:grid;place-items:center}.stage-discovery .strategy-replay{grid-column:1/-1}}
.final-reflection{padding:6px 8px;border-radius:12px;display:grid;gap:5px;background:rgba(255,255,255,.9)}.final-reflection>strong{font:750 12px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button{min-height:44px;padding:4px;border:0;border-radius:9px;display:grid;grid-template-columns:20px 1fr;align-items:center;gap:3px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:8px;font-weight:850}.final-reflection button>span{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}.g4-title-claim:disabled{cursor:not-allowed;opacity:.46}
`;
