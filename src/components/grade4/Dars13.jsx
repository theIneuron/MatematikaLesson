import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 13-DARS · Ko'p xonali sonni ikki xonali songa bo'lish

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13',
  warnSoft: '#FFF5D9', lime: '#95C93D', shadowBase: '58, 53, 48',
};

const LangContext = createContext('uz');
const ActivityContext = createContext({ activityState: {}, markActivity: () => {}, finalRewardState: { reflectionChoice: null, titleState: 'unclaimed' }, setFinalRewardState: () => {} });
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return value;
    return value[lang] ?? '';
  }, [lang]);
};

// Hook -> six explanation/practice microcycles -> synthesis -> summary.
const D13_FLOW = [0, 1, 8, 2, 9, 3, 10, 4, 11, 6, 12, 5, 13, 7, 14];
const SCREEN_META = [
  { id: 's0', type: 'hook', goal: 'Estimate a two-digit-divisor quotient', template: 'DiagnosticChoice', mechanic: 'diagnostic-choice', active: true, scored: false, scope: 'hook', misconceptions: ['estimate by digits only'], resetOnReturn: true },
  { id: 's1', type: 'model', goal: 'Observe grouping with a two-digit divisor', template: 'ModelReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's2', type: 'guided-practice', goal: 'Select the first trial quotient digit', template: 'ChoiceRetry', mechanic: 'choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['trial digit too large'] },
  { id: 's3', type: 'discovery', goal: 'Discover how multiplication checks a trial digit', template: 'SequenceReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's4', type: 'guided-practice', goal: 'Adjust an unsuitable trial digit', template: 'ChoiceRetry', mechanic: 'choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['keep an excessive trial digit'] },
  { id: 's5', type: 'model', goal: 'Connect subtraction and bringing down the next digit', template: 'ModelReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's6', type: 'guided-practice', goal: 'Construct the quotient in the correct places', template: 'PlaceConstruction', mechanic: 'place-construction', active: true, scored: true, scope: 'module-mikro', misconceptions: ['misalign quotient digits'] },
  { id: 's7', type: 'model', goal: 'Compare remainder with the divisor', template: 'ComparisonReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's8', type: 'strategy', goal: 'Choose and apply a checking strategy', template: 'NumericRetry', mechanic: 'numeric-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['skip remainder in check'] },
  { id: 's9', type: 'discovery', goal: 'Express the inverse-operation relationship', template: 'RepresentationReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'transfer', misconceptions: [] },
  { id: 's10', type: 'error-analysis', goal: 'Repair a typical two-digit-division error', template: 'ErrorRepair', mechanic: 'choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['subtract wrong partial product'] },
  { id: 's11', type: 'model', goal: 'Transfer the algorithm to a second representation', template: 'TransferReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'transfer', misconceptions: [] },
  { id: 's12', type: 'life-case', goal: 'Solve a contextual grouping problem', template: 'LifeChoice', mechanic: 'choice-retry', active: true, scored: true, scope: 'final', misconceptions: ['confuse groups with group size'] },
  { id: 's13', type: 'rule', goal: 'State the complete division rule after discovery', template: 'RuleReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's14', type: 'summary', goal: 'Reflect and bridge to motion problems', template: 'ReflectionChoice', mechanic: 'reflection-choice', active: true, scored: false, scope: 'reflection', misconceptions: [] },
];
const TOTAL_SCREENS = SCREEN_META.length;

const LESSON_META = {
  lessonId: 'num-4-13-v1',
  slug: 'dars13-kop-xonali-sonni-ikki-xonali-songa-bolish',
  lessonTitle: {
    uz: "13-dars. Ko'p xonali sonni ikki xonali songa bo'lish",
    ru: 'Урок 13. Деление многозначного числа на двузначное',
    en: 'Lesson 13. Dividing a multi-digit number by a two-digit number',
  },
  skillTags: ['long_division', 'two_digit_divisor', 'trial_digit', 'remainder', 'inverse_check'],
};

const D13_BASE_FRAME_VECTOR = [3, 3, 4, 3, 4, 3, 4, 4, 2, 2, 2, 2, 2, 3, 5];
const D13_FRAME_VECTOR = D13_FLOW.map((sourceIndex) => D13_BASE_FRAME_VECTOR[sourceIndex]);

const D13_SOURCE_CONTENT = ([
  {
    eyebrow: { uz: "24 ta chorraha", ru: '24 перекрёстка', en: "24 junctions" },
    title: { uz: "Signal modullarini teng taqsimlaymiz", ru: 'Распределяем сигнальные модули поровну', en: "Sharing the signal modules equally" },
    kind: 'hook', bit: 'focus',
    visual: { total: '12 768', groups: '24', unit: { uz: "signal moduli", ru: 'сигнальных модулей', en: "signal modules" }, groupLabel: { uz: "chorraha", ru: 'перекрёсток', en: "junction" } },
    question: { uz: "Bitta chorrahadagi miqdor qaysi oraliqda?", ru: 'В каком диапазоне количество на одном перекрёстке?', en: "Which range contains the number at one junction?" },
    options: ['50–60', '500–600', '5 000–6 000'], correctIndex: 1,
    feedback: [
      { uz: "50–60 oralig'i juda kichik. Yigirma to'rtta shunday guruh 12 768 ga yetmaydi.", ru: 'Диапазон 50–60 слишком мал. Двадцать четыре такие группы не дадут 12 768.', en: "The range 50–60 is too small. Twenty-four such groups will not make 12 768." },
      { uz: "To'g'ri taxmin. Javob 500–600 oralig'ida.", ru: 'Верная оценка. Ответ находится между 500 и 600.', en: "Good estimate. The answer lies between 500 and 600." },
      { uz: "5 000–6 000 oralig'i juda katta. Bir qism jamidan deyarli yarmi bo'lib qoladi.", ru: 'Диапазон 5 000–6 000 слишком велик. Одна часть была бы почти половиной общего количества.', en: "The range 5 000–6 000 is too large. One share would be almost half of the total." },
    ],
    feedbackAudio: [
      { uz: "Bu oraliq juda kichik. Yigirma to'rtta shunday qism jami miqdorga yetmaydi.", ru: 'Этот диапазон слишком мал. Двадцать четыре такие части не дадут общего количества.', en: "This range is too small. Twenty-four such shares will not make the total." },
      { uz: "Taxmin mantiqan mos. Endi aniq bo'lishni o'rganamiz.", ru: 'Оценка подходит. Теперь выполним точное деление.', en: "The estimate is reasonable. Now let us divide exactly." },
      { uz: "Bu oraliq juda katta. Bitta qism jami miqdorning deyarli yarmi bo'lib qoladi.", ru: 'Этот диапазон слишком велик. Одна часть была бы почти половиной общего количества.', en: "This range is too large. One share would be almost half of the total." },
    ],
    audio: {
      uz: ["O'tgan darsda ko'p xonali sonni bir xonali songa bo'ldik.", "Endi signal modullari yigirma to'rtta chorrahaga teng taqsimlanadi.", "Aniq hisoblamasdan, bitta chorrahadagi miqdor oralig'ini tanlang."],
      ru: ['На прошлом уроке мы делили многозначное число на однозначное.', 'Теперь сигнальные модули распределяются поровну между двадцатью четырьмя перекрёстками.', 'Не вычисляя точно, выбери диапазон количества на одном перекрёстке.'],
      en: ["In the previous lesson, we divided a multi-digit number by a one-digit number.", "Now the signal modules are shared equally among twenty-four junctions.", "Without calculating exactly, choose the range for the number at one junction."],
    },
  },
  {
    eyebrow: { uz: "Birinchi to'liqsiz bo'linuvchi", ru: 'Первое неполное делимое', en: "First partial dividend" },
    title: { uz: "1 va 12 kichik, 127 mos", ru: '1 и 12 малы, 127 подходит', en: "1 and 12 are too small; 127 works" },
    kind: 'division', bit: 'focus',
    board: { dividend: '12 768', divisor: '24', quotient: '· · ·', active: '127', rows: ['1 < 24', '12 < 24', '127 ≥ 24', { uz: "Bo'linma 3 xonali bo'ladi", ru: "Bo'linma 3 xonali bo'ladi", en: 'The quotient will have 3 digits' }] },
    audio: {
      uz: ["Sonning eng kichik mos chap qismini izlaymiz.", "Bir ham, o'n ikki ham yigirma to'rtdan kichik.", "Bir yuz yigirma yetti eng kichik mos chap qism, shuning uchun bo'linma uch xonali bo'ladi."],
      ru: ['Ищем наименьшую подходящую левую часть числа.', 'И один, и двенадцать меньше двадцати четырёх.', 'Сто двадцать семь является первой подходящей частью, поэтому частное будет трёхзначным.'],
      en: ["Find the smallest suitable left-hand part of the number.", "Both one and twelve are less than twenty-four.", "One hundred and twenty-seven is the first suitable part, so the quotient will have three digits."],
    },
  },
  {
    eyebrow: { uz: "Bo'linma raqamini sinash", ru: 'Пробуем цифру частного', en: "Trying a quotient digit" },
    title: { uz: "Birinchi raqam — 5", ru: 'Первая цифра — 5', en: "The first digit is 5" },
    kind: 'division',
    board: { dividend: '12 768', divisor: '24', quotient: '5 · ·', active: '127', rows: [{ uz: 'Taxminiy raqam — 6', ru: 'Taxminiy raqam — 6', en: 'Trial digit — 6' }, '24 × 5 = 120', '24 × 6 = 144', '120 ≤ 127 < 144'] },
    audio: {
      uz: ["Yigirma to'rtni yigirmaga, bir yuz yigirma yettini bir yuz yigirmaga yaqinlashtirsak, taxminiy raqam olti chiqadi.", "Yigirma to'rtni beshga ko'paytirsak, bir yuz yigirma bo'ladi.", "Olti raqami katta, chunki bir yuz qirq to'rt bir yuz yigirma yettidan oshadi.", "Mos eng katta raqam besh."],
      ru: ['Если приблизить двадцать четыре к двадцати, а сто двадцать семь к ста двадцати, пробная цифра будет около шести.', 'Двадцать четыре умножить на пять равно ста двадцати.', 'Цифра шесть велика, потому что сто сорок четыре больше ста двадцати семи.', 'Наибольшая подходящая цифра равна пяти.'],
      en: ["If we round twenty-four to twenty and one hundred and twenty-seven to one hundred and twenty, the trial digit is about six.", "Twenty-four multiplied by five is one hundred and twenty.", "The digit six is too large because one hundred and forty-four is greater than one hundred and twenty-seven.", "The greatest suitable digit is five."],
    },
  },
  {
    eyebrow: { uz: "Ayirish va tushirish", ru: 'Вычитаем и сносим', en: "Subtract and bring down" },
    title: { uz: "7 qoldiqdan 76 ga", ru: 'От остатка 7 к числу 76', en: "From a remainder of 7 to 76" },
    kind: 'division',
    board: { dividend: '12 768', divisor: '24', quotient: '5 · ·', active: '76', rows: ['127 − 120 = 7', '7 < 24', '7 ↓ 6 = 76'] },
    audio: {
      uz: ["Bir yuz yigirma yettidan bir yuz yigirmani ayirsak, yetti qoladi.", "Qoldiq yigirma to'rtdan kichik, demak besh raqami mos.", "Keyingi olti raqamini tushirib, yetmish oltini hosil qilamiz."],
      ru: ['Из ста двадцати семи вычитаем сто двадцать, остаётся семь.', 'Остаток меньше двадцати четырёх, значит, цифра пять подходит.', 'Сносим следующую цифру шесть и получаем семьдесят шесть.'],
      en: ["Subtract one hundred and twenty from one hundred and twenty-seven, leaving seven.", "The remainder is less than twenty-four, so the digit five works.", "Bring down the next digit, six, to make seventy-six."],
    },
  },
  {
    eyebrow: { uz: "O'nlar xonasi", ru: 'Разряд десятков', en: "Tens place" },
    title: { uz: "Ikkinchi raqam — 3", ru: 'Вторая цифра — 3', en: "The second digit is 3" },
    kind: 'division',
    board: { dividend: '12 768', divisor: '24', quotient: '5 3 ·', active: '76', rows: ['24 × 3 = 72', '24 × 4 = 96', '76 − 72 = 4', '4 ↓ 8 = 48'] },
    audio: {
      uz: ["Yetmish oltidan oshmaydigan eng yaqin ko'paytma yetmish ikki.", "Shuning uchun bo'linmaning o'nlar xonasiga uch yozamiz.", "Yetmish oltidan yetmish ikkini ayirsak, to'rt qoladi.", "Keyingi sakkiz raqamini tushiramiz."],
      ru: ['Ближайшее произведение, не превышающее семьдесят шесть, равно семидесяти двум.', 'Поэтому в разряд десятков частного записываем три.', 'Из семидесяти шести вычитаем семьдесят два, остаётся четыре.', 'Сносим следующую цифру восемь.'],
      en: ["The nearest product that does not exceed seventy-six is seventy-two.", "Therefore, write three in the tens place of the quotient.", "Subtract seventy-two from seventy-six, leaving four.", "Bring down the next digit, eight."],
    },
  },
  {
    eyebrow: { uz: "Birliklar xonasi", ru: 'Разряд единиц', en: "Ones place" },
    title: { uz: "Oxirgi raqam — 2", ru: 'Последняя цифра — 2', en: "The final digit is 2" },
    kind: 'division',
    board: { dividend: '12 768', divisor: '24', quotient: '5 3 2', active: '48', rows: ['24 × 2 = 48', '48 − 48 = 0', '12 768 : 24 = 532'] },
    audio: {
      uz: ["Yigirma to'rtni ikkiga ko'paytirsak, qirq sakkiz bo'ladi.", "Qirq sakkizdan qirq sakkizni ayirsak, qoldiq nol.", "O'n ikki ming yetti yuz oltmish sakkizni yigirma to'rtga bo'lsak, besh yuz o'ttiz ikki chiqadi."],
      ru: ['Двадцать четыре умножить на два равно сорока восьми.', 'Из сорока восьми вычитаем сорок восемь, остаток равен нулю.', 'Двенадцать тысяч семьсот шестьдесят восемь разделить на двадцать четыре равно пятистам тридцати двум.'],
      en: ["Twenty-four multiplied by two is forty-eight.", "Subtract forty-eight from forty-eight; the remainder is zero.", "Twelve thousand seven hundred and sixty-eight divided by twenty-four equals five hundred and thirty-two."],
    },
  },
  {
    eyebrow: { uz: "Sinash va tuzatish", ru: 'Пробуем и исправляем', en: "Try and adjust" },
    title: { uz: "Kichik, katta va mos raqam", ru: 'Малая, большая и подходящая цифра', en: "A digit that is too small, too large or suitable" },
    kind: 'rules', bit: 'focus', formula: '74 : 24',
    items: [
      { uz: "2 → qoldiq 26 ≥ 24 — kichik", ru: '2 → остаток 26 ≥ 24 — мала', en: "2 → remainder 26 ≥ 24 — too small" },
      { uz: "4 → 96 > 74 — katta", ru: '4 → 96 > 74 — велика', en: "4 → 96 > 74 — too large" },
      { uz: "3 → qoldiq 2 < 24 — mos", ru: '3 → остаток 2 < 24 — подходит', en: "3 → remainder 2 < 24 — suitable" },
      { uz: "Tanlang → ko'paytiring → solishtiring → tuzating", ru: 'Подбери → умножь → сравни → исправь', en: "Choose → multiply → compare → adjust" },
    ],
    audio: {
      uz: ["Raqam juda kichik bo'lsa, qoldiq bo'luvchidan katta yoki unga teng qoladi.", "Raqam juda katta bo'lsa, ko'paytma to'liqsiz bo'linuvchidan oshadi.", "Uch raqami mos, chunki yetmish ikki yetmish to'rtdan oshmaydi, qoldiq esa ikki.", "Raqamni tanlaymiz, ko'paytiramiz, solishtiramiz va kerak bo'lsa tuzatamiz."],
      ru: ['Если цифра слишком мала, остаток остаётся больше делителя или равен ему.', 'Если цифра слишком велика, произведение превышает неполное делимое.', 'Цифра три подходит. Семьдесят два не превышает семьдесят четыре, остаток равен двум.', 'Подбираем цифру, умножаем, сравниваем и при необходимости исправляем.'],
      en: ["If the digit is too small, the remainder is greater than or equal to the divisor.", "If the digit is too large, the product exceeds the partial dividend.", "The digit three works. Seventy-two does not exceed seventy-four, and the remainder is two.", "Choose a digit, multiply, compare and adjust if necessary."],
    },
  },
  {
    eyebrow: { uz: "Teskari tekshiruv", ru: 'Обратная проверка', en: "Inverse check" },
    title: { uz: "532 soni 12 768 ni qaytaradi", ru: 'Число 532 возвращает 12 768', en: "532 returns 12 768" },
    kind: 'rules', bit: 'nod', formula: '532 × 24 = 12 768',
    items: ['532', '532 × 20 = 10 640', '532 × 4 = 2 128', '10 640 + 2 128 = 12 768'],
    audio: {
      uz: ["Bo'lish natijasi besh yuz o'ttiz ikki.", "Besh yuz o'ttiz ikkini yigirmaga ko'paytirsak, o'n ming olti yuz qirq chiqadi.", "To'rtga ko'paytma ikki ming bir yuz yigirma sakkiz. Ikki qatorning yig'indisi bo'linuvchini qaytaradi.", "Besh yuz o'ttiz ikki dastlabki taxminimizga mos."],
      ru: ['Результат деления равен пятистам тридцати двум.', 'Пятьсот тридцать два умножить на двадцать равно десяти тысячам шестистам сорока.', 'Произведение на четыре равно двум тысячам ста двадцати восьми. Сумма возвращает делимое.', 'Пятьсот тридцать два соответствует первоначальной оценке.'],
      en: ["The result of the division is five hundred and thirty-two.", "Five hundred and thirty-two multiplied by twenty is ten thousand six hundred and forty.", "The product by four is two thousand one hundred and twenty-eight. Their sum returns the dividend.", "Five hundred and thirty-two agrees with the original estimate."],
    },
  },
  {
    eyebrow: { uz: "1 / 6 · Birinchi bo'linuvchi", ru: '1 / 6 · Первое делимое', en: "1 / 6 · First partial dividend" },
    title: { uz: "Chapdan mos qismni toping", ru: 'Найди подходящую часть слева', en: "Find a suitable part on the left" },
    kind: 'choice', visual: { formula: '9 360 : 24', chips: ['9', '93', '936'] },
    question: { uz: "Birinchi to'liqsiz bo'linuvchi qaysi?", ru: 'Какое первое неполное делимое?', en: "What is the first partial dividend?" }, options: ['9', '93', '936'], correctIndex: 1,
    feedback: [
      { uz: "9 soni 24 dan kichik. Keyingi raqamni ham olish kerak.", ru: 'Число 9 меньше 24. Нужно взять следующую цифру.', en: "The number 9 is less than 24. Take the next digit as well." },
      { uz: "To'g'ri. 93 soni 24 dan kichik bo'lmagan eng kichik chap qism.", ru: 'Верно. 93 — наименьшая левая часть, которая не меньше 24.', en: "Correct. 93 is the smallest left-hand part that is not less than 24." },
      { uz: "93 ning o'zi yetarli, 936 ni olish ortiqcha.", ru: 'Уже достаточно числа 93, брать 936 не нужно.', en: "The number 93 is already enough; there is no need to take 936." },
    ],
    feedbackAudio: [
      { uz: "To'qqiz soni yigirma to'rtdan kichik. Keyingi raqamni ham oling.", ru: 'Девять меньше двадцати четырёх. Возьми следующую цифру.', en: "Nine is less than twenty-four. Take the next digit as well." },
      { uz: "To'g'ri. To'qson uch eng kichik mos chap qism.", ru: 'Верно. Девяносто три является наименьшей подходящей левой частью.', en: "Correct. Ninety-three is the smallest suitable left-hand part." },
      { uz: "To'qson uchning o'zi yetarli. Keyingi raqamni olish ortiqcha.", ru: 'Числа девяносто три уже достаточно. Следующую цифру брать не нужно.', en: "Ninety-three is already enough. There is no need to take the next digit." },
    ],
    audio: {
      uz: ["To'qqiz ming uch yuz oltmishni yigirma to'rtga bo'lishni chapdan boshlang.", "Yigirma to'rtdan kichik bo'lmagan eng kichik chap qismni tanlang."],
      ru: ['Начни деление девяти тысяч трёхсот шестидесяти на двадцать четыре слева.', 'Выбери наименьшую левую часть, которая не меньше двадцати четырёх.'],
      en: ["Start dividing nine thousand three hundred and sixty by twenty-four from the left.", "Choose the smallest left-hand part that is not less than twenty-four."],
    },
  },
  {
    eyebrow: { uz: "2 / 6 · Bo'linma raqami", ru: '2 / 6 · Цифра частного', en: "2 / 6 · Quotient digit" },
    title: { uz: "Eng yaqin kichik ko'paytma", ru: 'Ближайшее меньшее произведение', en: "Nearest lower product" },
    kind: 'choice', visual: { formula: '156 : 32', chips: ['32 × 3 = 96', '32 × 4 = 128', '32 × 5 = 160'] },
    question: { uz: "Mos bo'linma raqamini tanlang.", ru: 'Выбери подходящую цифру частного.', en: "Choose a suitable quotient digit." }, options: ['3', '4', '5'], correctIndex: 1,
    feedback: [
      { uz: "3 juda kichik: qoldiq 60 va yana bitta 32 sig'adi.", ru: '3 слишком мало: остаток равен 60, и помещается ещё одно число 32.', en: "3 is too small: the remainder is 60, which can contain another 32." },
      { uz: "To'g'ri. 32 × 4 = 128, qoldiq 28 va u 32 dan kichik.", ru: 'Верно. 32 × 4 = 128, остаток 28 меньше 32.', en: "Correct. 32 × 4 = 128, and the remainder 28 is less than 32." },
      { uz: "5 juda katta, chunki 32 × 5 = 160 soni 156 dan oshadi.", ru: '5 слишком велико, потому что 32 × 5 = 160 больше 156.', en: "5 is too large because 32 × 5 = 160, which is greater than 156." },
    ],
    feedbackAudio: [
      { uz: "Uch juda kichik. Qoldiq ichiga yana bitta o'ttiz ikki sig'adi.", ru: 'Три слишком мало. В остаток помещается ещё одно число тридцать два.', en: "Three is too small. Another thirty-two fits into the remainder." },
      { uz: "To'g'ri. To'rtga ko'paytma bo'linuvchidan oshmaydi, qoldiq esa bo'luvchidan kichik.", ru: 'Верно. Произведение на четыре не превышает делимое, а остаток меньше делителя.', en: "Correct. The product by four does not exceed the dividend, and the remainder is less than the divisor." },
      { uz: "Besh juda katta. Ko'paytma to'liqsiz bo'linuvchidan oshadi.", ru: 'Пять слишком велико. Произведение превышает неполное делимое.', en: "Five is too large. The product exceeds the partial dividend." },
    ],
    audio: {
      uz: ["Bir yuz ellik olti ichida o'ttiz ikki necha marta joylashishini toping.", "Bir yuz ellik oltidan oshmaydigan eng katta ko'paytmani tanlang."],
      ru: ['Определи, сколько раз тридцать два помещается в ста пятидесяти шести.', 'Выбери наибольшее произведение, которое не превышает сто пятьдесят шесть.'],
      en: ["Determine how many times thirty-two fits into one hundred and fifty-six.", "Choose the greatest product that does not exceed one hundred and fifty-six."],
    },
  },
  {
    eyebrow: { uz: "3 / 6 · Raqamni tushirish", ru: '3 / 6 · Сносим цифру', en: "3 / 6 · Bring down a digit" },
    title: { uz: "Yangi to'liqsiz bo'linuvchini tuzing", ru: 'Составь новое неполное делимое', en: "Form the new partial dividend" },
    kind: 'choice', visual: { formula: '8 736 : 24', chips: ['87 − 72 = 15', '↓ 3', '?'] },
    question: { uz: "Keyingi to'liqsiz bo'linuvchi qaysi?", ru: 'Какое следующее неполное делимое?', en: "What is the next partial dividend?" }, options: ['15', '153', '1 533'], correctIndex: 1,
    feedback: [
      { uz: "15 faqat qoldiq. Keyingi 3 raqamini ham tushirish kerak.", ru: '15 — только остаток. Нужно ещё снести следующую цифру 3.', en: "15 is only the remainder. You must also bring down the next digit, 3." },
      { uz: "To'g'ri. 15 qoldiq yoniga 3 tushirilsa, 153 hosil bo'ladi.", ru: 'Верно. Если к остатку 15 снести цифру 3, получится 153.', en: "Correct. Bringing 3 down beside the remainder 15 makes 153." },
      { uz: "3 raqamini tushirish 15 ni o'n marta oshirib, 3 ni qo'shadi: 153.", ru: 'При снесении цифры 3 число 15 увеличивается в десять раз и прибавляется 3: получается 153.', en: "Bringing down the digit 3 multiplies 15 by ten and adds 3, making 153." },
    ],
    feedbackAudio: [
      { uz: "O'n besh faqat qoldiq. Keyingi uch raqamini ham tushiring.", ru: 'Пятнадцать является только остатком. Снеси следующую цифру три.', en: "Fifteen is only the remainder. Bring down the next digit, three." },
      { uz: "To'g'ri. O'n besh qoldiq yoniga uch tushirilsa, bir yuz ellik uch hosil bo'ladi.", ru: 'Верно. Если к остатку пятнадцать снести цифру три, получится сто пятьдесят три.', en: "Correct. Bringing the digit three down beside the remainder fifteen makes one hundred and fifty-three." },
      { uz: "Raqamni tushirganda bir yuz ellik uch hosil bo'ladi, bir ming besh yuz o'ttiz uch emas.", ru: 'После снесения цифры получается сто пятьдесят три, а не одна тысяча пятьсот тридцать три.', en: "After bringing down the digit, the result is one hundred and fifty-three, not one thousand five hundred and thirty-three." },
    ],
    audio: {
      uz: ["Sakson yettidan yetmish ikkini ayirganda o'n besh qoladi.", "Keyingi uch raqamini tushirib, yangi to'liqsiz bo'linuvchini tuzing."],
      ru: ['После вычитания семидесяти двух из восьмидесяти семи остаётся пятнадцать.', 'Снеси следующую цифру три и составь новое неполное делимое.'],
      en: ["Subtracting seventy-two from eighty-seven leaves fifteen.", "Bring down the next digit, three, and form the new partial dividend."],
    },
  },
  {
    eyebrow: { uz: "4 / 6 · Mustaqil bo'lish", ru: '4 / 6 · Самостоятельное деление', en: "4 / 6 · Divide independently" },
    title: { uz: "Sonli javobni kiriting", ru: 'Введи числовой ответ', en: "Enter a numerical answer" },
    kind: 'input', visual: { formula: '9 360 : 24 = ?', quotient: '· · ·' },
    question: { uz: "9 360 ni 24 ga bo'ling.", ru: 'Раздели 9 360 на 24.', en: "Divide 9 360 by 24." }, answer: '390', proof: '390 × 24 = 9 360',
    feedbackCorrect: { uz: "To'g'ri. 390 × 24 = 9 360.", ru: 'Верно. 390 × 24 = 9 360.', en: "Correct. 390 × 24 = 9 360." },
    feedbackBy: {
      '39': { uz: "39 javobida birliklar xonasidagi nol yo'qolgan.", ru: 'В ответе 39 потерян ноль в разряде единиц.', en: "The answer 39 is missing the zero in the ones place." },
      '3900': { uz: "3 900 bir xona katta. Taxminan 9 600 : 24 = 400 bo'lishi kerak.", ru: '3 900 больше на один разряд. Оценка 9 600 : 24 даёт около 400.', en: "3 900 is one place too large. The estimate 9 600 ÷ 24 is about 400." },
    },
    feedbackWrong: { uz: "Har bir bo'linma raqamini ko'paytma bilan tekshiring.", ru: 'Проверь каждую цифру частного произведением.', en: "Check each quotient digit using a product." },
    feedbackAudioCorrect: { uz: "To'g'ri. Uch yuz to'qsonni yigirma to'rtga ko'paytirish bo'linuvchini qaytaradi.", ru: 'Верно. Умножение трёхсот девяноста на двадцать четыре возвращает делимое.', en: "Correct. Multiplying three hundred and ninety by twenty-four returns the dividend." },
    feedbackAudioWrong: { uz: "Har bir bo'linma raqamini ko'paytma bilan tekshiring va oxirgi nolni saqlang.", ru: 'Проверь каждую цифру частного произведением и сохрани последний ноль.', en: "Check each quotient digit using a product and keep the final zero." },
    audio: {
      uz: ["To'qqiz ming uch yuz oltmishni yigirma to'rtga bo'ling.", "Har bir bo'linma raqamini ko'paytma bilan tekshiring va oxirgi nolni saqlang."],
      ru: ['Раздели девять тысяч триста шестьдесят на двадцать четыре.', 'Проверяй каждую цифру частного произведением и сохрани последний ноль.'],
      en: ["Divide nine thousand three hundred and sixty by twenty-four.", "Check every quotient digit using a product and keep the final zero."],
    },
  },
  {
    eyebrow: { uz: "5 / 6 · Bit xatosi", ru: '5 / 6 · Ошибка Бита', en: "5 / 6 · Bit's error" },
    title: { uz: "Sinov raqamini kichraytiring", ru: 'Уменьши пробную цифру', en: "Reduce the trial digit" },
    kind: 'choice', bit: 'awkward', solvedBit: 'nod', visual: { formula: '7 488 : 24', chips: ['Bit: 74 : 24 → 4', '24 × 4 = 96', '96 > 74'], proof: '312 × 24 = 7 488' },
    question: { uz: "74 uchun to'g'ri bo'linma raqami qaysi?", ru: 'Какая цифра частного подходит для 74?', en: "Which quotient digit works for 74?" }, options: ['2', '3', '4'], correctIndex: 1,
    feedback: [
      { uz: "2 juda kichik: 74 − 48 = 26 va 26 soni 24 dan katta.", ru: '2 слишком мало: 74 − 48 = 26, а 26 больше 24.', en: "2 is too small: 74 − 48 = 26, and 26 is greater than 24." },
      { uz: "To'g'ri. 24 × 3 = 72, qoldiq 2. To'liq bo'linma 312.", ru: 'Верно. 24 × 3 = 72, остаток 2. Полное частное равно 312.', en: "Correct. 24 × 3 = 72, with remainder 2. The complete quotient is 312." },
      { uz: "4 juda katta: 24 × 4 = 96 soni 74 dan oshadi.", ru: '4 слишком велико: 24 × 4 = 96 больше 74.', en: "4 is too large: 24 × 4 = 96, which is greater than 74." },
    ],
    feedbackAudio: [
      { uz: "Ikki juda kichik. Qoldiq ichiga yana bitta yigirma to'rt sig'adi.", ru: 'Два слишком мало. В остаток помещается ещё одно число двадцать четыре.', en: "Two is too small. Another twenty-four fits into the remainder." },
      { uz: "To'g'ri. Uchga ko'paytma yetmish to'rtdan oshmaydi, qoldiq esa ikki.", ru: 'Верно. Произведение на три не превышает семьдесят четыре, а остаток равен двум.', en: "Correct. The product by three does not exceed seventy-four, and the remainder is two." },
      { uz: "To'rt juda katta. Ko'paytma yetmish to'rtdan oshadi.", ru: 'Четыре слишком велико. Произведение превышает семьдесят четыре.', en: "Four is too large. The product exceeds seventy-four." },
    ],
    audio: {
      uz: ["Bit yetmish to'rt uchun bo'linma raqami to'rt deb oldi.", "Tanlangan raqamni yigirma to'rtga ko'paytirib, natijani yetmish to'rt bilan solishtiring."],
      ru: ['Бит выбрал цифру четыре для деления семидесяти четырёх.', 'Умножь выбранную цифру на двадцать четыре и сравни результат с семьюдесятью четырьмя.'],
      en: ["Bit chose the digit four when dividing seventy-four.", "Multiply the chosen digit by twenty-four and compare the result with seventy-four."],
    },
  },
  {
    eyebrow: { uz: "6 / 6 · Yo'l guruhlari", ru: '6 / 6 · Группы дороги', en: "6 / 6 · Road teams" },
    title: { uz: "Yo'lni nazorat guruhlariga taqsimlang", ru: 'Распредели дорогу между группами контроля', en: "Share the road among the inspection teams" },
    kind: 'choice', visual: { formula: '15 600 m : 25', chips: ['16 000 : 25 ≈ 640', { uz: '25 ta guruh', ru: '25 ta guruh', en: '25 teams' }, { uz: 'aniq natija', ru: 'aniq natija', en: 'exact result' }] },
    question: { uz: "Har bir guruhga necha metr yo'l tushadi?", ru: 'Сколько метров дороги получит каждая группа?', en: "How many metres of road will each team receive?" }, options: [{ uz: "62 m", ru: '62 м', en: "62 m" }, { uz: "624 m", ru: '624 м', en: "624 m" }, { uz: "6 240 m", ru: '6 240 м', en: "6 240 m" }], correctIndex: 1,
    feedback: [
      { uz: "62 metr taxminiy 640 metrdan o'n marta kichik.", ru: '62 метра примерно в десять раз меньше оценки 640 метров.', en: "62 metres is about ten times less than the estimate of 640 metres." },
      { uz: "To'g'ri. 624 × 25 = 15 600.", ru: 'Верно. 624 × 25 = 15 600.', en: "Correct. 624 × 25 = 15 600." },
      { uz: "6 240 metr taxminiy 640 metrdan o'n marta katta.", ru: '6 240 метров примерно в десять раз больше оценки 640 метров.', en: "6 240 metres is about ten times greater than the estimate of 640 metres." },
    ],
    feedbackAudio: [
      { uz: "Bu natija taxminiy olti yuz qirq metrdan o'n marta kichik.", ru: 'Этот результат примерно в десять раз меньше оценки шестьсот сорок метров.', en: "This result is about ten times less than the estimate of six hundred and forty metres." },
      { uz: "To'g'ri. Olti yuz yigirma to'rtni yigirma beshga ko'paytirish jami yo'lni qaytaradi.", ru: 'Верно. Умножение шестисот двадцати четырёх на двадцать пять возвращает общую длину дороги.', en: "Correct. Multiplying six hundred and twenty-four by twenty-five returns the total road length." },
      { uz: "Bu natija taxminiy olti yuz qirq metrdan o'n marta katta.", ru: 'Этот результат примерно в десять раз больше оценки шестьсот сорок метров.', en: "This result is about ten times greater than the estimate of six hundred and forty metres." },
    ],
    audio: {
      uz: ["O'n besh ming olti yuz metr yo'l yigirma beshta guruhga teng taqsimlandi.", "Qulay taxmin taxminan olti yuz qirq metrni beradi.", "Taxminga yaqin aniq natijani tanlang."],
      ru: ['Пятнадцать тысяч шестьсот метров дороги поровну распределили между двадцатью пятью группами.', 'Удобная оценка даёт примерно шестьсот сорок метров.', 'Выбери точный результат, близкий к оценке.'],
      en: ["Fifteen thousand six hundred metres of road were shared equally among twenty-five teams.", "A useful estimate gives approximately six hundred and forty metres.", "Choose the exact result that is close to the estimate."],
    },
  },
  {
    eyebrow: { uz: "Yakun", ru: 'Итог', en: "Summary" },
    title: { uz: "Ikki xonali songa bo'lish algoritmi", ru: 'Алгоритм деления на двузначное число', en: "Algorithm for dividing by a two-digit number" },
    kind: 'summary', bit: 'happy',
    items: [
      { uz: "Mos chap qism", ru: 'Подходящая левая часть', en: "Suitable left-hand part" },
      { uz: "Yaqin ko'paytma", ru: 'Ближайшее произведение', en: "Nearest product" },
      { uz: "Katta bo'lsa kamaytiring", ru: 'Если велико — уменьши', en: "If it is too large, reduce it" },
      { uz: "Qoldiq kichik bo'lsin", ru: 'Остаток должен быть меньше', en: "The remainder must be smaller" },
      { uz: "Ko'paytirib tekshiring", ru: 'Проверь умножением', en: "Check by multiplying" },
    ],
    summaryValue: '532',
    bridge: { uz: "Keyingi dars: masofa, tezlik va vaqt", ru: 'Следующий урок: расстояние, скорость и время', en: "Next lesson: distance, speed and time" },
    audio: {
      uz: ["Ikki xonali bo'luvchida ham eng kichik mos chap qismdan boshlaymiz.", "Har bo'linma raqamini yaqin ko'paytmalar orqali tanlaymiz.", "Ko'paytma katta bo'lsa raqamni kamaytiramiz, qoldiq katta bo'lsa raqamni oshiramiz.", "Teskari ko'paytirish bo'linuvchini qaytardi.", "Endi masofa, tezlik va vaqt orasidagi bog'lanishni o'rganamiz."],
      ru: ['При двузначном делителе также начинаем с наименьшей подходящей левой части.', 'Каждую цифру частного выбираем по ближайшим произведениям.', 'Если произведение велико, цифру уменьшаем. Если остаток велик, цифру увеличиваем.', 'Обратное умножение вернуло делимое.', 'Теперь исследуем связь между расстоянием, скоростью и временем.'],
      en: ["With a two-digit divisor, also start with the smallest suitable left-hand part.", "Choose each quotient digit by using the nearest products.", "If the product is too large, reduce the digit. If the remainder is too large, increase the digit.", "Inverse multiplication returned the dividend.", "Next, we will explore the relationship between distance, speed and time."],
    },
  },
]);
const D13_CONTENT = D13_FLOW.map((sourceIndex) => D13_SOURCE_CONTENT[sourceIndex]);

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const buildTtsUrl = (base, text, gender) => `${base}/api/tts?text=${encodeURIComponent(String(text).slice(0, 1000))}&g=${gender === 'm' ? 'm' : 'f'}`;

class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.utterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; }
    if (this.utterance) { this.utterance.onend = null; this.utterance.onerror = null; this.utterance = null; }
    if (typeof window !== 'undefined' && window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch { /* preview only */ } }
  }
  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); }
  timed(item) {
    this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true });
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, 900);
  }
  play() {
    const item = this.queue[this.index];
    if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; }
    if (this.muted || !runtimeConfig.ttsApiBase) {
      if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          const utterance = new SpeechSynthesisUtterance(String(item.text));
          utterance.lang = ({ uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' })[this.lang] ?? 'uz-UZ'; utterance.rate = 0.95;
          utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false });
          utterance.onend = () => { this.index += 1; this.play(); };
          utterance.onerror = () => this.timed(item);
          this.utterance = utterance; window.speechSynthesis.speak(utterance); return;
        } catch { /* deterministic frame fallback below */ }
      }
      this.timed(item); return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item));
  }
  toggleMute() { this.muted = !this.muted; this.stop(); this.index = 0; this.emit({ muted: this.muted }); this.play(); }
  one(text) { this.load([{ id: `feedback-${Date.now()}`, text }]); this.play(); }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(audioValue, screen) {
  const lang = useLang();
  const segments = useMemo(() => (audioValue?.[lang] ?? []).map((text, index) => ({ id: `s${screen}-f${index}`, text })), [audioValue, lang, screen]);
  /* eslint-disable react-hooks/refs -- audio queue stabilizer */
  const stable = useRef(segments); const serialized = JSON.stringify(segments);
  if (JSON.stringify(stable.current) !== serialized) stable.current = segments;
  /* eslint-enable react-hooks/refs */
  const [state, setState] = useState({ muted: audioEngineInstance?.muted ?? false, completed: false, currentSegment: null, visualOnly: !runtimeConfig.ttsApiBase });
  useEffect(() => {
    const engine = getAudioEngine(); if (!engine) return undefined;
    engine.setLang(lang); engine.listener = (next) => setState((old) => ({ ...old, ...next })); engine.load(stable.current);
    const timer = window.setTimeout(() => engine.play(), 160);
    return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; };
  }, [lang, serialized]);
  const active = segments.findIndex((segment) => segment.id === state.currentSegment);
  const feedbackPlaying = state.currentSegment?.startsWith('feedback-') === true;
  return {
    ...state,
    beat: active >= 0 ? active : (state.completed || feedbackPlaying) ? Math.max(0, segments.length - 1) : 0,
    caption: active >= 0 ? segments[active].text : '',
    replay: () => { const engine = getAudioEngine(); engine?.load(stable.current); engine?.play(); },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.one(text),
  };
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
    <svg className={`bit g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
      <defs>
        <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2ECF2"/><stop offset="100%" stopColor="#B6C7D2"/></linearGradient>
        <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EBF2F6"/><stop offset="100%" stopColor="#C4D3DC"/></linearGradient>
      </defs>
      <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)"/>
      <g className="g1-bit-ant"><path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round"/><circle cx="60" cy="11" r="6" fill="#FF4F28"/><circle cx="58" cy="9" r="2" fill="#FFB9A6"/></g>
      <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF"/><rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF"/>
      <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2"/><rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5"/>
      {(state === 'happy' || isWave) && <g className={isWave ? 'bit-double-wave' : ''}><g className="bit-wave-left"><path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="22" cy="47" r="5" fill="#B6C7D2"/></g><g className="bit-wave-right"><path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="98" cy="47" r="5" fill="#B6C7D2"/></g></g>}
      {state === 'present' && <g><path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="103" r="5" fill="#B6C7D2"/><g className="g1-bit-wave"><path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="98" cy="43" r="5" fill="#B6C7D2"/></g></g>}
      {isThinking && <g><path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="103" r="5" fill="#B6C7D2"/><g className="bit-think-hand"><path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="83" cy="60" r="5" fill="#B6C7D2"/></g></g>}
      {isAwkward && <g className="bit-awkward-hands"><path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="54" cy="99" r="5" fill="#B6C7D2"/><path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="66" cy="99" r="5" fill="#B6C7D2"/></g>}
      {state === 'point' && <g><path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="103" r="5" fill="#B6C7D2"/><g className="bit-point-arm"><path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="109" cy="61" r="5" fill="#B6C7D2"/></g></g>}
      {state === 'idea' && <g><path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="102" r="5" fill="#B6C7D2"/><path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="94" cy="49" r="5" fill="#B6C7D2"/></g>}
      {state === 'focus' && <g className="bit-focus-hands"><path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="53" cy="94" r="5" fill="#B6C7D2"/><path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="67" cy="94" r="5" fill="#B6C7D2"/></g>}
      {state === 'nod' && <g><path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="103" r="5" fill="#B6C7D2"/><g className="bit-nod-hand"><path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="99" cy="53" r="5" fill="#B6C7D2"/></g></g>}
      <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2"/><rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C"/><path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)"/>
      <g className="g1-eyes" fill="#5BD6F2">{isAwkward ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2"/><ellipse cx="70" cy="53" rx="4.8" ry="3.2"/></> : isThinking ? <><circle cx="50" cy="50" r="4.5"/><circle cx="70" cy="49" r="5.5"/></> : <><circle cx="50" cy="50" r="5"/><circle cx="70" cy="50" r="5"/></>}</g>
      {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round"/>}{(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round"/>}{isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2"/>}
      {isAwkward && <g className="bit-awkward-face"><path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round"/><circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5"/><circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5"/></g>}
      {isThinking && <g><circle cx="99" cy="38" r="9" fill="#FFC23C"/><text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text></g>}
      {state === 'point' && <g className="bit-point-target"><circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2"/><circle cx="110" cy="61" r="2" fill="#FF5B35"/></g>}
      {state === 'idea' && <g className="bit-idea-bulb"><circle cx="99" cy="36" r="9" fill="#FFC23C"/><path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round"/></g>}
      {state === 'focus' && <g className="bit-focus-scan"><path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round"/><circle cx="80" cy="45" r="3" fill="#95C93D"/></g>}
      {state === 'nod' && <g className="bit-nod-check"><circle cx="99" cy="38" r="9" fill="#95C93D"/><path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>}
    </svg>
  );
};

const AudioIndicator = ({ audio }) => {
  const t = useT();
  const muteLabel = audio.muted
    ? t({ uz: "Ovozni yoqish", ru: 'Включить звук', en: 'Turn sound on' })
    : t({ uz: "Ovozni o'chirish", ru: 'Выключить звук', en: 'Turn sound off' });
  const replayLabel = t({ uz: "Qayta eshitish", ru: 'Повторить', en: 'Replay' });
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
  const t = useT();
  const labels = {
    hook: t({ uz: "Missiya", ru: 'Миссия', en: 'Mission' }),
    diagnostic: t({ uz: "Diagnostika", ru: 'Диагностика', en: 'Diagnostic' }),
    exploration: t({ uz: "Kashfiyot", ru: 'Исследование', en: 'Explore' }),
    rule: t({ uz: "Qoida", ru: 'Правило', en: 'Rule' }),
    practice: t({ uz: "Mashq", ru: 'Практика', en: 'Practice' }),
    test: t({ uz: "Tekshiruv", ru: 'Проверка', en: 'Check' }),
    case: t({ uz: "Vazifa", ru: 'Задача', en: 'Problem' }),
    summary: t({ uz: "Yakun", ru: 'Итог', en: 'Summary' }),
  };
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const Feedback = ({ show, correct, children }) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!show) { const id = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(id); }
    let second = 0; const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [show]);
  return <div role="status" aria-hidden={!show} data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={correct ? 'solution' : 'wrong'} className={`feedback ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'}/></span><p>{show && <><strong>{correct ? t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' }) : t({ uz: "YANA O'YLANG", ru: 'ПРОВЕРЬТЕ СПОСОБ', en: 'CHECK THE METHOD' })}</strong>{children}</>}</p></div>;
};

const ContractActivity = ({ screen, value, onComplete }) => {
  const t = useT(); const meta = SCREEN_META[screen];
  if (meta.template === 'ReflectionChoice') return null;
  if (!meta.template.includes('Reveal')) return null;
  return <div className="activity-slot"><button type="button" className={value !== undefined ? 'selected' : ''} onClick={() => onComplete(screen, true)}>{value !== undefined ? t({ uz: "Model tekshirildi", ru: 'Модель проверена', en: 'Model checked' }) : t({ uz: "Modelni tekshirish", ru: 'Проверить модель', en: 'Check the model' })}</button></div>;
};

const Stage = ({ screen, c, audio, onPrev, onNext, finish, activityDone, children }) => {
  const t = useT(); const meta = SCREEN_META[screen]; const { activityState, markActivity } = useContext(ActivityContext);
  const storedActivity = Object.prototype.hasOwnProperty.call(activityState, screen); const activityReady = !meta.active || activityDone === true || storedActivity;
  const audioReady = audio.muted || audio.visualOnly || audio.completed; const canAdvance = activityReady && audioReady;
  useEffect(() => { if (activityDone === true && !storedActivity) markActivity(screen, true); }, [activityDone, markActivity, screen, storedActivity]);
  const showCaption = Boolean(audio.caption && (audio.muted || audio.visualOnly));
  return <main className={`stage stage-${meta.type}`} data-screen={screen}><header className="stage-header"><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/><AudioIndicator audio={audio}/><span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content"><div className="stage-body">{children}<ContractActivity screen={screen} value={activityState[screen]} onComplete={markActivity}/></div><div className={`caption caption-slot ${showCaption ? 'visible' : ''}`} aria-hidden={!showCaption}>{showCaption ? audio.caption : ''}</div></section><footer className="stage-nav">{screen === 0 ? <span/> : <button type="button" className="btn ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад', en: "Back" })}</button>}<button type="button" className="btn next" onClick={onNext} disabled={!canAdvance}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок', en: "Finish lesson" }) : t({ uz: "Davom etish", ru: 'Продолжить', en: "Continue" })} →</button></footer></main>;
};

const Heading = ({ c }) => {
  const t = useT(); const hook = c.kind === 'hook';
  return <div className="heading"><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{!hook && <BitSVG state="happy" className="primary-happy-bit"/>}</div>;
};

const Options = ({ values, picked, correctIndex, solved, onPick }) => {
  const t = useT();
  return <div className="options">{values.map((value, index) => <button type="button" key={`${index}-${t(value)}`} data-g4-role="answer-card" className={`option ${picked === index ? 'picked' : ''} ${solved && index === correctIndex ? 'right' : ''} ${picked === index && !solved ? 'bad' : ''}`} onClick={() => onPick(index)} disabled={solved}><b>{String.fromCharCode(65 + index)}</b><span>{t(value)}</span></button>)}</div>;
};

const HookVisual = ({ c, beat }) => {
  const t = useT();
  const groupCount = Number(c.visual.groups); const visibleGroups = Math.min(groupCount, 8);
  return <div className="hook-scene-shell" data-g4-role="hook-scene"><section className="hook-visual" data-g4-role="visual-frame"><div className="hook-total"><small>{t({ uz: "Jami", ru: 'Всего', en: "Total" })}</small><strong>{c.visual.total}</strong><span>{t(c.visual.unit)}</span></div><div className={`route-grid ${groupCount > 8 ? 'dense' : ''}`}>{Array.from({ length: visibleGroups }, (_, index) => <div className={`route revealable ${beat >= Math.min(index, 1) ? 'visible' : ''}`} key={index}><i/><b>{index === visibleGroups - 1 && groupCount > visibleGroups ? `×${groupCount}` : index + 1}</b></div>)}</div><div className={`split-symbol revealable ${beat >= 1 ? 'visible' : ''}`}>:</div><div className={`unknown revealable ${beat >= 2 ? 'visible' : ''}`}><b>?</b><span>1 {t(c.visual.groupLabel)}</span></div><span className="context-bit" data-g4-role="hook-bit"><BitSVG state={c.bit || 'think'}/></span></section></div>;
};

const DivisionBoard = ({ board, beat, frameCount }) => {
  const t = useT();
  return <section className="division-scene"><div className="division-console"><div className="dividend"><span>{board.dividend}</span><i/><b>{board.divisor}</b></div><div className="quotient">{board.quotient.split(' ').map((digit, index) => <span className={`${digit !== '·' ? 'filled' : ''} ${digit === '0' ? 'zero' : ''}`} key={`${digit}-${index}`}>{digit}</span>)}</div><div className="active-part"><small>↳</small><strong>{board.active}</strong></div></div><div className="calc-steps">{board.rows.map((row, index) => { const rowText = t(row); return <div className={`revealable ${beat >= Math.min(index, frameCount - 1) ? 'visible' : ''} ${rowText.includes('0') || rowText.includes('<') ? 'signal' : ''}`} key={`${index}-${rowText}`}><b>{index + 1}</b><span>{rowText}</span></div>; })}</div></section>;
};

const ConceptVisual = ({ c, beat }) => {
  const t = useT();
  if (c.kind === 'division') return <DivisionBoard board={c.board} beat={beat} frameCount={c.audio?.uz?.length || 1}/>;
  if (c.kind === 'hook') return <HookVisual c={c} beat={beat}/>;
  const values = c.items || c.visual?.chips || [];
  return <section className={`concept-visual kind-${c.kind}`}>
    {c.formula && <div className="main-formula">{t(c.formula)}</div>}
    {c.visual?.formula && <div className="main-formula">{c.visual.formula}</div>}
    {c.visual?.groups && <div className="station-row">{Array.from({ length: c.visual.groups }, (_, index) => <i key={index}>{index + 1}</i>)}</div>}
    <div className="concept-items">{values.map((item, index) => <div className={`revealable ${beat >= Math.min(index, (c.audio?.uz?.length || 1) - 1) ? 'visible' : ''}`} key={`${index}-${t(item)}`}><span>{t(item)}</span></div>)}</div>
    {c.fact && <p className="fact-card">{t(c.fact)}</p>}
  </section>;
};

function ChoiceTask({ c, screen, storedAnswer, onAnswer, audio }) {
  const t = useT(); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry !== false);
  const pick = (index) => {
    if (solved) return; attempts.current += 1; const ok = index === c.correctIndex; if (!ok) clean.current = false;
    setPicked(index); setSolved(ok); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(c.feedbackAudio[index]));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <><Heading c={c}/>{c.kind === 'hook' && <h2 className="hook-question-title" data-g4-role="hook-question">{t(c.question)}</h2>}<ConceptVisual c={c} beat={audio.beat}/><section className="question">{c.kind !== 'hook' && <h2>{t(c.question)}</h2>}<Options values={c.options} picked={picked} correctIndex={c.correctIndex} solved={solved} onPick={pick}/><Feedback show={picked !== null} correct={solved}>{picked !== null ? t(c.feedback[picked]) : ''}</Feedback>{solved && c.visual?.proof && <div className="proof">{c.visual.proof}</div>}</section></>;
}

function DigitTask({ c, screen, storedAnswer, onAnswer, audio }) {
  const t = useT(); const answer = c.visual.answer; const [values, setValues] = useState(storedAnswer?.correct ? answer : Array(answer.length).fill(null)); const [message, setMessage] = useState(null); const [wrongIndex, setWrongIndex] = useState(-1); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry !== false); const solved = values.every((value, index) => value === answer[index]);
  const choose = (place, value) => {
    if (solved) return; const next = [...values]; next[place] = value; setValues(next); setMessage(null); setWrongIndex(-1);
    if (next.some((item) => item == null)) return;
    attempts.current += 1; const firstWrong = next.findIndex((item, index) => item !== answer[index]); const ok = firstWrong < 0; if (!ok) clean.current = false;
    setWrongIndex(firstWrong); setMessage(ok ? c.feedbackCorrect : c.feedbackWrong); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.feedbackAudioCorrect : c.feedbackAudioWrong));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correctAnswer: answer.join(''), studentAnswer: next.join(''), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <><Heading c={c}/><section className="digit-task"><div className="main-formula">{c.visual.formula}</div><div className="digit-slots">{answer.map((digit, place) => <div className={wrongIndex === place ? 'wrong-place' : ''} key={place}><small>{t(c.visual.labels[place])}</small><strong>{values[place] ?? '·'}</strong><span>{c.visual.choices[place].map((choice) => <button type="button" onClick={() => choose(place, choice)} disabled={solved} className={values[place] === choice ? 'selected' : ''} key={choice}>{choice}</button>)}</span></div>)}</div>{solved && <div className="proof">{c.visual.proof}</div>}</section><section className="question"><h2>{t(c.question)}</h2><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback></section></>;
}

const cleanNumber = (value) => String(value ?? '').replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '').slice(0, 9);
function InputTask({ c, screen, storedAnswer, onAnswer, audio }) {
  const t = useT(); const [value, setValue] = useState(storedAnswer?.studentAnswer ?? ''); const [solved, setSolved] = useState(storedAnswer?.correct === true); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry !== false);
  const submit = () => {
    const entered = cleanNumber(value); if (!entered || solved) return; attempts.current += 1; const ok = entered === c.answer; if (!ok) clean.current = false; setSolved(ok);
    const text = ok ? c.feedbackCorrect : c.feedbackBy?.[entered] || c.feedbackWrong; setMessage(text); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.feedbackAudioCorrect : c.feedbackAudioWrong));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correctAnswer: c.answer, studentAnswer: entered, correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <><Heading c={c}/><ConceptVisual c={c} beat={audio.beat}/><section className="question"><h2>{t(c.question)}</h2><div className="input-row"><input inputMode="numeric" aria-label={t(c.question)} placeholder="0" value={value} disabled={solved} onChange={(event) => { setValue(cleanNumber(event.target.value)); setMessage(null); }} onKeyDown={(event) => event.key === 'Enter' && submit()}/><button type="button" className="check" onClick={submit} disabled={!value || solved}>{t({ uz: "Tekshirish", ru: 'Проверить', en: "Check" })}</button></div><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback>{solved && <div className="proof">{c.proof}</div>}</section></>;
}

function useFinalReducedMotion() {
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

function G4FinalTitleReward({ finalFrameReached, completed = false, muted = false, title, firstTry, total }) {
  const lang = useLang();
  const t = useT();
  const [reducedMotion, setReducedMotion] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const [unlocked, setUnlocked] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const revealedRef = useRef(false);
  const frameRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  const ready = finalFrameReached || completed || muted || reducedMotion;
  useEffect(() => {
    if (!ready || revealedRef.current || typeof window === 'undefined') return;
    revealedRef.current = true;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      setUnlocked(true);
      setShowOverlay(true);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setShowOverlay(false);
      }, 3900);
    });
  }, [ready]);

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const localizedTitle = t(title);
  const ariaPrefix = ({ uz: 'Unvon', ru: 'Звание', en: 'Title' })[lang] ?? 'Unvon';
  const ariaLabel = `${ariaPrefix}: ${localizedTitle}`;
  return <>
    {showOverlay && typeof document !== 'undefined' && createPortal(
      <div className="g4-title-reveal-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={ariaLabel}>
        <div className="g4-title-reveal-card">
          <div className="g4-title-reveal-rays" aria-hidden="true" />
          <div className="g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ left: `${3 + index * 5.35}%`, animationDelay: `${(index % 7) * -0.21}s` }} />)}</div>
          <div className="g4-title-reveal-medal" aria-hidden="true">★</div>
          <h2 className="g4-title-reveal-title">{localizedTitle}</h2>
        </div>
      </div>,
      document.body,
    )}
    {unlocked ? <aside className="g4-title-card g4-title-card-compact" role="status" aria-live="polite" aria-atomic="true">
      <div className="g4-title-card-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
      <div className="g4-title-card-bit"><BitSVG state="happy" /></div>
      <div className="g4-title-card-medal" aria-hidden="true">★</div>
      <span className="g4-title-card-kicker">{t({ uz: "UNVON OLINDI", ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: "TITLE EARNED" })}</span>
      <h2 className="g4-title-card-title">{localizedTitle}</h2>
      <div className="g4-title-card-score"><strong>{firstTry}/{total}</strong><span>{t({ uz: "birinchi urinishda", ru: 'с первой попытки', en: "on the first attempt" })}</span></div>
    </aside> : <div className="g4-title-card-placeholder" aria-hidden="true" />}
  </>;
}

function G4TitleReveal({ active, title, onComplete }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    if (!active || typeof window === 'undefined') return undefined;
    const timer = window.setTimeout(onComplete, window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 120 : 3900);
    return () => window.clearTimeout(timer);
  }, [active, onComplete]);
  if (!active) return null;
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive"><div className="rank-boost-card g4-title-reveal-card"><div className="rank-boost-rays g4-title-reveal-rays" aria-hidden="true"/><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="rank-boost-medal g4-title-reveal-medal">★</div><h2 className="g4-title-reveal-title">{title}</h2>{reduced && <span className="sr-only">{title}</span>}</div></div>, document.body);
}

function G4TitleCard({ title, firstTry, total, canFinish }) {
  return <aside className="g4-title-card g4-title-card-stage" data-g4-role="title-card" data-can-finish={canFinish}><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" data-g4-role="reward-medal">★</div><span className="g4-title-card-kicker">TITLE EARNED</span><h2 className="g4-title-card-title">{title}</h2><div className="g4-title-card-score"><strong>{firstTry}/{total}</strong></div></aside>;
}

function ContractFinalReward({ title, firstTry, total }) {
  const t = useT(); const { markActivity, finalRewardState, setFinalRewardState } = useContext(ActivityContext); const { reflectionChoice, titleState } = finalRewardState;
  const setReflectionChoice = useCallback((value) => setFinalRewardState((previous) => ({ ...previous, reflectionChoice: value })), [setFinalRewardState]);
  const setTitleState = useCallback((value) => setFinalRewardState((previous) => ({ ...previous, titleState: value })), [setFinalRewardState]);
  const legacyContract = Boolean(G4FinalTitleReward);
  const choices = [{ uz: "Qoidani tushuntira olaman", ru: 'Могу объяснить правило', en: 'I can explain the rule' }, { uz: "Yana bir misol ishlayman", ru: 'Решу ещё один пример', en: 'I will try another example' }];
  const claimTitle = () => { if (reflectionChoice === null) return; setTitleState('revealing'); };
  const completeReveal = useCallback(() => { setTitleState('claimed'); markActivity(14, reflectionChoice); }, [markActivity, reflectionChoice, setTitleState]);
  const localizedTitle = t(title);
  return <div className="contract-final-reward" data-legacy-contract={legacyContract}>{titleState !== 'claimed' && <div className="final-reflection" data-g4-role="reflection">{choices.map((choice, index) => <button type="button" key={t(choice)} className={reflectionChoice === index ? 'selected' : ''} onClick={() => setReflectionChoice(index)}>{t(choice)}</button>)}</div>}{titleState === 'unclaimed' && <button type="button" className="g4-title-claim" data-g4-role="title-claim" disabled={reflectionChoice === null} onClick={claimTitle}><span>★</span><strong>{t({ uz: "Unvonni olish", ru: 'Получить звание', en: 'Claim title' })}</strong></button>}<G4TitleReveal active={titleState === 'revealing'} title={localizedTitle} onComplete={completeReveal}/>{titleState === 'claimed' && <G4TitleCard title={localizedTitle} firstTry={firstTry} total={total} canFinish={titleState === 'claimed'}/>}</div>;
}

const FINAL_AWARDS = [
  { ru: 'Архитектор частного', uz: "Bo'linma me'mori", en: 'Quotient Architect' },
  { ru: 'Мастер пробной цифры', uz: 'Sinov raqami ustasi', en: 'Trial Digit Master' },
  { ru: 'Исследователь частного', uz: "Bo'linma tadqiqotchisi", en: 'Quotient Explorer' },
];

function FinaleReward({ answers = [] }) {
  const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null);
  const total = scored.length;
  const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  const award = firstTry === total ? FINAL_AWARDS[0] : firstTry >= Math.max(1, total - 1) ? FINAL_AWARDS[1] : FINAL_AWARDS[2];
  return <ContractFinalReward title={award} firstTry={firstTry} total={total} />;
}

function Summary({ c, audio, answers }) {
  const t = useT(); const reduced = useFinalReducedMotion(); const frame = reduced ? 4 : audio.beat; const complete = frame >= 4;
  return <><section className="finale-heading"><BitSVG state="happy" className="finale-happy-bit"/><span>◆ {t({ uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП', en: "FINAL STAGE" })}</span><h1>{t(c.title)}</h1><p>{t({ uz: "Boshlang'ich taxminni aniq javob va teskari amal bilan yopamiz.", ru: 'Закрываем начальную оценку точным ответом и обратным действием.', en: "Complete the opening estimate with an exact answer and an inverse operation." })}</p></section><section className="finale-main"><div className="finale-payoff"><small>{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', en: "OPENING MISSION SOLUTION" })}</small><div className="finale-equation"><span>12 768</span><i>÷</i><span>24</span><i>=</i><strong>532</strong></div><p className="finale-check">532 × 24 = 12 768 <b>✓</b></p></div><div className="finale-takeaways">{c.items.map((item, index) => <div className={`finale-takeaway ${frame >= index ? 'show' : ''}`} key={t(item)}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div></section><section className="finale-bottom"><div className={`finale-bridge ${complete ? 'show' : ''}`}><small>{t({ uz: "KEYINGI MAVZU", ru: 'СЛЕДУЮЩАЯ ТЕМА', en: "NEXT TOPIC" })}</small><strong>{t(c.bridge)}</strong></div><FinaleReward answers={answers} complete={complete} audio={audio}/></section></>;
}

function ScreenRenderer({ c, screen, storedAnswer, answers, onAnswer, onPrev, onNext, finishLesson }) {
  const t = useT(); const audio = useAudio(c.audio, screen);
  let body;
  if (c.kind === 'choice' || c.kind === 'hook') body = <ChoiceTask c={c} screen={screen} storedAnswer={storedAnswer} onAnswer={onAnswer} audio={audio}/>;
  else if (c.kind === 'digits') body = <DigitTask c={c} screen={screen} storedAnswer={storedAnswer} onAnswer={onAnswer} audio={audio}/>;
  else if (c.kind === 'input') body = <InputTask c={c} screen={screen} storedAnswer={storedAnswer} onAnswer={onAnswer} audio={audio}/>;
  else if (c.kind === 'summary') body = <Summary c={c} audio={audio} answers={answers}/>;
  else body = <><Heading c={c}/><ConceptVisual c={c} beat={audio.beat}/>{c.note && <p className="scene-note">{t(c.note)}</p>}</>;
  return <Stage screen={screen} c={c} audio={audio} onPrev={onPrev} onNext={screen === 14 ? finishLesson : onNext} finish={screen === 14}><div className="stack" data-g4-screen={c.kind === 'hook' ? 'hook' : undefined}>{body}</div></Stage>;
}

function createDivisionLesson({ meta, content, frameVector }) {
  return function DivisionLesson({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
    const preview = previewMode ?? (langProp === undefined || langProp === null); const [previewLang, setPreviewLang] = useState(normalizeLang(langProp)); const lang = preview ? normalizeLang(previewLang) : normalizeLang(langProp);
    configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
    const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [activityState, setActivityState] = useState({}); const [finalRewardState, setFinalRewardState] = useState({ reflectionChoice: null, titleState: 'unclaimed' });
    const started = useRef(Date.now());
    const finished = useRef(false);
    const markActivity = useCallback((screen, value = true) => setActivityState((previous) => Object.prototype.hasOwnProperty.call(previous, screen) && previous[screen] === value ? previous : { ...previous, [screen]: value }), []);
    const recordAnswer = useCallback((answer) => { setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry }; return next; }); if (!SCREEN_META[answer.screenIdx].scored || answer.correct) markActivity(answer.screenIdx, answer.studentAnswerIndex ?? true); }, [markActivity]);
    const finishLesson = useCallback(() => {
      if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length;
      const payload = { lessonId: meta.lessonId, lessonTitle: meta.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - started.current) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: meta.skillTags, answers: answers.filter(Boolean) };
      if (onFinished) onFinished(payload); else console.log(`[${meta.lessonId} preview]`, payload);
    }, [answers, lang, onFinished, studentName]);
    const c = content[current];
    const selectorLabel = ({ uz: 'Til', ru: 'Язык', en: 'Language' })[lang] ?? 'Til';
    return <LangContext.Provider value={lang}><ActivityContext.Provider value={{ activityState, markActivity, finalRewardState, setFinalRewardState }}><style>{STYLES}</style><div className={`lesson-root ${preview ? 'preview' : ''}`} data-frame-count={frameVector[current]}>{preview && <div className="preview-language" aria-label={selectorLabel}>{SUPPORTED_LANGS.map((code) => <button type="button" className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)} key={code}>{code.toUpperCase()}</button>)}</div>}<ScreenRenderer key={`${current}-${lang}`} c={c} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(14, value + 1))} finishLesson={finishLesson}/></div></ActivityContext.Provider></LangContext.Provider>;
  };
}

const DivisionLesson13 = createDivisionLesson({ meta: LESSON_META, content: D13_CONTENT, frameVector: D13_FRAME_VECTOR });
export default function Grade4Dars13({ studentName, lang, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  return <DivisionLesson13 studentName={studentName} lang={lang} ttsApiBase={ttsApiBase} voiceGender={voiceGender} correctSoundUrl={correctSoundUrl} wrongSoundUrl={wrongSoundUrl} onFinished={onFinished} previewMode={previewMode}/>;
}

const STYLES = `
.lesson-frame .preview-language{display:none!important}
@media(max-width:639.98px){.lesson-root [data-g4-role~="hook-scene"],.lesson-root [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px!important;border-radius:18px!important}}
@media(max-width:639.98px){.lesson-root [data-g4-role~="hook-scene"]>.hook-visual{padding-right:86px!important;grid-template-columns:minmax(96px,.76fr) minmax(0,1.24fr)!important}.lesson-root [data-g4-role~="hook-scene"]>.hook-visual :is(.split-symbol,.unknown){display:none!important}}
.g4-title-card-placeholder{width:100%;min-height:116px}
.g4-title-card{position:relative;isolation:isolate;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)}
.g4-title-card-medal{position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px;z-index:2}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;z-index:2;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}.g4-title-card-bit>svg,.g4-title-card-bit .bit,.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-kicker{position:relative;color:#A8EAF0;font:900 10px/1.2 'JetBrains Mono',monospace;letter-spacing:.13em;z-index:2}.g4-title-card-title{position:relative;margin:0!important;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif;z-index:2}.g4-title-card-score{position:relative;align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10);z-index:2}.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-fall 2.4s linear 2 both}.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
.g4-title-reveal-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.8s ease both}.g4-title-reveal-card{position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)}.g4-title-reveal-card::after{content:'';position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%)}
.g4-title-reveal-rays{position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);transform:translate(-50%,-50%);animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-turn 26s linear .8s 1 both}.g4-title-reveal-medal{position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;border:6px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);font-size:52px;animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both}.g4-title-reveal-title{position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0!important;font:750 clamp(34px,5vw,58px)/1.02 'Source Serif 4',Georgia,serif;text-shadow:0 4px 24px rgba(0,0,0,.72);transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-reveal-confetti i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;background:#FFE284;animation:g4-title-reveal-fall 2.4s linear 2 both}.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes g4-title-card-fall{to{transform:translateY(230px) rotate(460deg)}}@keyframes g4-title-reveal-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}@keyframes g4-title-reveal-rays-turn{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes g4-title-reveal-fall{to{transform:translateY(470px) rotate(560deg)}}
@media(max-width:639.98px){.g4-title-card-placeholder{min-height:88px}.g4-title-card{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}.g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}.g4-title-card-bit{width:57px;height:71px}.g4-title-card-title{font-size:14px}.g4-title-reveal-card{min-height:100dvh;padding:24px 18px}.g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}.g4-title-reveal-title{top:calc(50% + 62px);font-size:29px}}
.contract-final-reward{width:100%;min-width:0;min-height:116px;display:grid;align-content:center;gap:6px}.final-reflection{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button,.g4-title-claim{min-width:44px;min-height:44px;padding:5px 7px;border:0;border-radius:11px;cursor:pointer;color:${T.navy};background:${T.cyanSoft};font-size:9px;font-weight:900;line-height:1.2}.final-reflection button.selected{color:#fff;background:${T.success}}.g4-title-claim{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;color:#fff;background:${T.accent}}.g4-title-claim:disabled{opacity:.42;cursor:not-allowed}
@media(prefers-reduced-motion:reduce){.g4-title-card,.g4-title-card-bit,.g4-title-reveal-overlay,.g4-title-reveal-rays,.g4-title-reveal-medal,.g4-title-reveal-title{animation:none!important}.g4-title-card{opacity:1;transform:none!important}.g4-title-card-confetti,.g4-title-reveal-confetti{display:none}.g4-title-reveal-overlay{opacity:1}.g4-title-reveal-rays{opacity:.28;transform:translate(-50%,-50%)}.g4-title-reveal-medal{opacity:1;transform:translate(-50%,-50%)}.g4-title-reveal-title{opacity:1;transform:translateX(-50%)}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button,.lesson-root input{font:inherit}.lesson-root button:focus-visible,.lesson-root input:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.lesson-root{position:fixed;inset:0;width:100%;min-height:100dvh;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 8% 8%,rgba(22,143,163,.11),transparent 28%),radial-gradient(circle at 92% 90%,rgba(255,91,53,.09),transparent 30%),${T.bg};font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:auto;display:flex;flex-direction:column}.stage-header,.stage-nav{flex:none;padding-left:clamp(14px,5vw,48px);padding-right:clamp(14px,5vw,48px);z-index:4}.stage-header{padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px)}.stage-nav{background:rgba(245,245,240,.94);backdrop-filter:blur(12px)}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:32px;height:32px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{min-height:0;flex:1 1 auto;overflow:visible;padding:12px clamp(14px,5vw,48px) 14px}.stage-nav{min-height:64px;padding-top:7px;padding-bottom:8px;border-top:1px solid rgba(23,59,82,.08);display:flex;align-items:center;justify-content:space-between;gap:12px}.btn{min-width:124px;min-height:48px;padding:0 18px;border:0;border-radius:15px;color:${T.ink2};background:transparent;font:850 13px/1 Manrope,sans-serif;cursor:pointer}.btn.next{color:${T.accent};background:${T.paper};box-shadow:0 13px 28px -18px rgba(255,91,53,.6)}.btn:hover{transform:translateY(-2px)}.btn.next:hover{color:white;background:${T.accent}}
.stack{display:grid;gap:14px;animation:pageIn .45s ease both}.heading{min-height:86px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div{min-width:0}.heading span,.bridge small{display:block;margin-bottom:7px;color:${T.cyan};font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}.heading h1{max-width:760px;font:750 clamp(26px,4vw,41px)/1.06 'Source Serif 4',Georgia,serif;letter-spacing:-.025em}.heading .bit{width:88px;height:110px;flex:none}.bit{overflow:visible}.g1-char-state-think .g1-bit-ant,.g1-char-state-focus .g1-bit-ant{animation:antenna 3.2s ease-in-out 2}.g1-eyes{transform-origin:center;animation:blink 4.4s ease-in-out 2}.g1-char-state-happy{animation:float 3.2s ease-in-out 2}.g1-char-state-nod{animation:nod .8s ease-in-out 2 alternate}.g1-char-state-awkward{animation:wobble .8s ease-in-out 2 alternate}
.hook-visual,.concept-visual,.division-scene,.digit-task,.question,.summary{padding:18px;border-radius:24px;background:${T.paper};box-shadow:0 18px 42px -31px rgba(${T.shadowBase},.58)}.hook-visual{min-height:238px;position:relative;overflow:hidden;display:grid;grid-template-columns:minmax(125px,.7fr) minmax(240px,1.5fr) 30px minmax(100px,.65fr);align-items:center;gap:14px;color:white;background:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px),${T.navy};background-size:25px 25px}.hook-total{padding:16px;border-radius:18px;display:grid;gap:4px;background:rgba(255,255,255,.08)}.hook-total small,.hook-total span{color:#BDEEF3;font-size:11px;font-weight:800}.hook-total strong{font:950 clamp(27px,4vw,44px)/1 'JetBrains Mono',monospace}.route-grid{display:grid;gap:12px}.route-grid.dense{grid-template-columns:repeat(4,1fr);gap:7px}.route-grid.dense .route{height:24px}.route{height:30px;position:relative;border-radius:99px;background:rgba(125,225,238,.16);box-shadow:inset 0 0 0 2px rgba(125,225,238,.22)}.route i{position:absolute;left:10px;right:12px;top:13px;height:4px;border-radius:4px;background:#7DE1EE}.route b{position:absolute;right:8px;top:3px;min-width:24px;height:24px;padding:0 4px;border-radius:12px;display:grid;place-items:center;color:${T.navy};background:${T.lime};font:900 9px/1 'JetBrains Mono',monospace}.split-symbol{color:#7DE1EE;font:900 30px/1 'JetBrains Mono',monospace}.unknown{display:grid;place-items:center;gap:5px}.unknown b{width:64px;height:64px;border-radius:20px;display:grid;place-items:center;color:${T.navy};background:${T.lime};font:950 34px/1 'JetBrains Mono',monospace}.unknown span{color:#BDEEF3;font-size:11px}.hook-visual>.bit{position:absolute;right:16px;bottom:-22px;width:64px}
.concept-visual{position:relative;display:grid;gap:14px;min-height:205px;align-content:center}.concept-visual>.bit{position:absolute;right:17px;top:15px;width:68px}.main-formula{padding:12px 16px;border-radius:16px;color:${T.navy};background:${T.cyanSoft};text-align:center;font:900 clamp(19px,3.4vw,31px)/1.25 'JetBrains Mono',monospace}.concept-items{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.concept-items>div{min-height:58px;padding:12px;border-radius:15px;display:grid;place-items:center;color:${T.ink2};background:#F8F8F4;text-align:center;font:800 13px/1.4 'JetBrains Mono',monospace}.kind-inverse .concept-items>div:last-child,.kind-rules .concept-items>div:last-child{color:${T.success};background:${T.successSoft}}.station-row{display:grid;grid-template-columns:repeat(6,1fr);gap:7px}.station-row i{height:34px;border-radius:10px;display:grid;place-items:center;color:white;background:${T.cyan};font:normal 850 11px/1 'JetBrains Mono',monospace}.fact-card{padding:10px 13px;border-left:4px solid ${T.cyan};border-radius:10px;color:${T.ink2};background:${T.cyanSoft};font-size:12px;line-height:1.45}
.division-scene{display:grid;grid-template-columns:minmax(260px,.82fr) minmax(290px,1.18fr);gap:18px;align-items:stretch}.division-console{min-height:218px;padding:19px;border-radius:19px;position:relative;color:white;background:${T.navy};overflow:hidden}.division-console:before{content:'';position:absolute;inset:0;background:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:22px 22px}.dividend{position:relative;z-index:1;display:grid;grid-template-columns:1fr 2px 54px;align-items:end;gap:10px}.dividend span{padding:0 5px 8px;text-align:right;font:950 clamp(25px,4vw,37px)/1 'JetBrains Mono',monospace}.dividend i{height:48px;background:#7DE1EE}.dividend b{padding-bottom:8px;color:#7DE1EE;text-align:center;font:950 26px/1 'JetBrains Mono',monospace}.quotient{position:relative;z-index:1;margin:12px 0 0 42%;padding-top:10px;border-top:3px solid #7DE1EE;display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.quotient span{height:40px;border-radius:10px;display:grid;place-items:center;color:rgba(255,255,255,.4);background:rgba(255,255,255,.06);font:900 18px/1 'JetBrains Mono',monospace}.quotient span.filled{color:white;background:rgba(22,143,163,.55);animation:digitDrop .42s ease both}.quotient span.zero{color:${T.navy};background:#FFC23C}.active-part{position:relative;z-index:1;margin-top:20px;display:flex;align-items:center;justify-content:center;gap:10px}.active-part small{color:${T.accent};font-size:30px}.active-part strong{padding:10px 18px;border-radius:14px;color:${T.navy};background:${T.lime};font:950 26px/1 'JetBrains Mono',monospace}.calc-steps{display:grid;gap:9px;align-content:center}.calc-steps>div{min-height:46px;padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:32px 1fr;align-items:center;gap:10px;color:${T.ink2};background:#F8F8F4}.calc-steps b{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px/1 'JetBrains Mono',monospace}.calc-steps span{font:800 13px/1.35 'JetBrains Mono',monospace}.calc-steps .signal{background:${T.warnSoft}}
.question h2{font:750 clamp(18px,2.6vw,25px)/1.28 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}.option{min-height:56px;padding:10px 13px;border:0;border-radius:15px;display:flex;align-items:center;gap:11px;color:${T.ink};background:#F8F8F4;text-align:left;font:750 13px/1.35 Manrope,sans-serif;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(135,148,157,.17)}.option>b{width:32px;height:32px;flex:none;border-radius:10px;display:grid;place-items:center;color:${T.cyan};background:white;font:900 12px/1 'JetBrains Mono',monospace}.option:hover,.option.picked{transform:translateY(-2px);background:${T.accentSoft}}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.28)}.option.right>b{color:white;background:${T.success}}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}button:disabled{cursor:default;opacity:.68}.option.right:disabled{opacity:1}
.feedback{min-height:58px;margin-top:10px;padding:9px 12px;visibility:hidden;opacity:0;border-radius:15px;display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:9px;transform:translateY(6px);transition:opacity .28s ease,transform .34s ease}.feedback.open{visibility:visible;opacity:1;transform:none}.feedback>b{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:rgba(255,255,255,.72);font-weight:950}.feedback p{min-width:0;color:${T.ink2};font-size:13px;line-height:1.4;overflow-wrap:anywhere}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.correct>b{color:${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.wrong>b{color:${T.warn}}
.digit-task{display:grid;gap:14px}.digit-slots{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.digit-slots>div{padding:11px;border-radius:16px;display:grid;justify-items:center;gap:8px;background:#F8F8F4;box-shadow:inset 0 0 0 1px rgba(135,148,157,.17)}.digit-slots>div.wrong-place{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.35)}.digit-slots small{color:${T.ink3};font-size:10px;font-weight:850}.digit-slots strong{font:950 25px/1 'JetBrains Mono',monospace}.digit-slots span{display:flex;gap:5px}.digit-slots button{width:44px;height:44px;border:0;border-radius:10px;color:${T.cyan};background:${T.cyanSoft};font:900 12px/1 'JetBrains Mono',monospace;cursor:pointer}.digit-slots button.selected{color:white;background:${T.cyan}}.input-row{display:flex;gap:10px;margin-top:14px}.input-row input{min-width:0;flex:1;height:54px;padding:0 16px;border:2px solid rgba(22,143,163,.24);border-radius:15px;color:${T.navy};background:#F8F8F4;font:900 20px/1 'JetBrains Mono',monospace}.check{min-width:126px;border:0;border-radius:15px;color:white;background:${T.cyan};font-weight:850;cursor:pointer}.proof{margin-top:12px;padding:11px 14px;border-radius:13px;color:${T.success};background:${T.successSoft};text-align:center;font:900 14px/1.4 'JetBrains Mono',monospace}
.summary{min-width:0;display:grid;grid-template-columns:minmax(180px,.65fr) minmax(320px,1.35fr);gap:18px}.summary-cycle{min-width:0;min-height:235px;border-radius:20px;display:grid;grid-template-columns:repeat(4,1fr);align-items:center;gap:7px;color:white;background:${T.navy};padding:16px}.summary-cycle span{width:min(42px,100%);max-width:42px;height:auto;aspect-ratio:1;justify-self:center;border-radius:14px;display:grid;place-items:center;background:${T.cyan};font:950 22px/1 'JetBrains Mono',monospace}.summary-cycle b{min-width:0;grid-column:1/-1;overflow-wrap:anywhere;padding:13px;border-radius:14px;color:${T.navy};background:${T.lime};text-align:center;font:950 25px/1 'JetBrains Mono',monospace}.rule-list{display:grid;gap:8px}.rule-list>div{min-height:42px;padding:8px 11px;border-radius:13px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:9px;background:#F8F8F4}.rule-list b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:white;background:${T.cyan};font:900 10px/1 'JetBrains Mono',monospace}.rule-list span{color:${T.ink2};font-size:12px;font-weight:800}.bridge{padding:14px 17px;border-radius:18px;color:white;background:${T.navy}}.bridge small{color:#7DE1EE}.bridge strong{font:750 17px/1.3 'Source Serif 4',Georgia,serif}
.finale-heading{min-width:0;padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{display:flex;align-items:center;gap:6px;color:${T.accent};font:900 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:${T.navy};font:750 clamp(21px,3vw,28px)/1.08 'Source Serif 4',Georgia,serif}.finale-heading p{margin-top:4px!important;color:${T.ink2};font-size:11px;line-height:1.35}.finale-main{min-width:0;display:grid;grid-template-columns:minmax(220px,.82fr) minmax(320px,1.18fr);align-items:stretch;gap:10px}.finale-payoff{min-width:0;padding:13px;border-radius:18px;display:grid;align-content:center;gap:10px;background:#fff;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.5)}.finale-payoff>small{color:${T.cyan};font-size:9px;font-weight:900;letter-spacing:.09em}.finale-equation{min-width:0;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px}.finale-equation span,.finale-equation strong{min-width:52px;padding:10px;border-radius:12px;text-align:center;font:900 clamp(16px,2.4vw,22px)/1 'JetBrains Mono',monospace}.finale-equation span{color:${T.navy};background:${T.cyanSoft}}.finale-equation strong{color:${T.navy};background:${T.lime}}.finale-equation i{color:${T.accent};font:normal 900 19px/1 'JetBrains Mono',monospace}.finale-check{padding:9px 11px;border-radius:12px;color:${T.ink2};background:#F8F8F4;text-align:center;font:850 12px/1.3 'JetBrains Mono',monospace}.finale-check b{color:${T.success}}.finale-takeaways{min-width:0;display:grid;gap:6px}.finale-takeaway{min-width:0;min-height:40px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px minmax(0,1fr);align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:opacity .42s ease,transform .42s ease,background .42s ease}.finale-takeaway.show{opacity:1;transform:none;background:${T.cyanSoft}}.finale-takeaway b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 9px/1 'JetBrains Mono',monospace}.finale-takeaway span{min-width:0;color:${T.ink2};font-size:11px;font-weight:800;line-height:1.3;overflow-wrap:anywhere}.finale-bottom{min-width:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(270px,.8fr);gap:10px}.finale-bridge{min-width:0;padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#fff;background:${T.navy};transition:.42s ease}.finale-bridge.show{opacity:1;transform:none}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px/1.3 'Source Serif 4',Georgia,serif}.finale-reward{min-width:0;min-height:100px;position:relative;overflow:hidden;padding:12px 72px 11px 58px;border-radius:17px;display:grid;align-content:center;color:#fff;background:linear-gradient(135deg,#234B62,${T.navy});box-shadow:0 17px 34px -27px rgba(${T.shadowBase},.74);transition:filter .45s ease,box-shadow .45s ease}.finale-reward:not(.complete){filter:saturate(.72)}.finale-reward.complete{box-shadow:0 17px 36px -22px rgba(149,201,61,.72)}.finale-medal{position:absolute;left:11px;top:50%;width:38px;height:38px;border:3px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:${T.navy};background:${T.lime};font-size:17px;font-weight:900}.finale-reward-copy{min-width:0;display:grid;gap:3px}.finale-reward-copy>small{color:#98E1E5;font-size:8px;font-weight:900;letter-spacing:.09em}.finale-reward-copy>strong{font:750 15px/1.15 'Source Serif 4',Georgia,serif}.finale-status{display:flex;align-items:center;gap:6px}.finale-status b{color:#FFE284;font:900 11px/1 'JetBrains Mono',monospace}.finale-status span{color:rgba(255,255,255,.72);font-size:8px}.finale-reward-bit{position:absolute;right:2px;bottom:-4px;width:68px;height:86px}.finale-reward-bit .bit{width:100%;height:100%}.finale-reward.complete .finale-reward-bit{animation:float 2.8s ease-in-out 2}.finale-confetti{position:absolute;inset:0;pointer-events:none}.finale-confetti i{position:absolute;top:-12px;width:5px;height:9px;border-radius:2px;background:#FFC23C;animation:finaleFall 2.8s linear 2}.finale-confetti i:nth-child(2n){background:${T.accent}}.finale-confetti i:nth-child(3n){background:#77E1EA}.finale-confetti i:nth-child(1){left:9%;animation-delay:-.2s}.finale-confetti i:nth-child(2){left:22%;animation-delay:-1.1s}.finale-confetti i:nth-child(3){left:35%;animation-delay:-.7s}.finale-confetti i:nth-child(4){left:48%;animation-delay:-1.8s}.finale-confetti i:nth-child(5){left:61%;animation-delay:-.4s}.finale-confetti i:nth-child(6){left:73%;animation-delay:-1.4s}.finale-confetti i:nth-child(7){left:84%;animation-delay:-.9s}.finale-confetti i:nth-child(8){left:93%;animation-delay:-2s}@keyframes finaleFall{to{transform:translateY(118px) rotate(180deg)}}
.finale-heading{position:relative;padding-right:86px}.finale-happy-bit{position:absolute;right:12px;bottom:-4px;width:62px;height:78px}.revealable{opacity:.16;transform:translateY(8px);transition:opacity .5s ease,transform .5s ease}.revealable.visible{opacity:1;transform:none}.caption{position:static;bottom:4px;z-index:3;width:fit-content;max-width:min(680px,100%);margin:13px auto 0;padding:9px 13px;border-radius:12px;color:white;background:rgba(23,59,82,.94);text-align:center;font-size:12px;line-height:1.4}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 8px 20px -14px rgba(${T.shadowBase},.6)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;color:${T.ink2};background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFFFFF;background:${T.accent}}
@keyframes pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes digitDrop{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}@keyframes float{to{transform:translateY(-5px)}}@keyframes antenna{50%{transform:rotate(5deg);transform-origin:60px 30px}}@keyframes blink{0%,45%,49%,100%{transform:scaleY(1)}47%{transform:scaleY(.12)}}@keyframes nod{to{transform:rotate(2deg) translateY(2px)}}@keyframes wobble{to{transform:rotate(1.5deg)}}
@media(max-width:640px){.stage-header{padding-top:60px}.screen-type{display:none}.stage-content{padding-top:12px}.heading{min-height:72px}.heading h1{font-size:27px}.heading .bit{width:67px;height:84px}.hook-visual{grid-template-columns:1fr 1.5fr 24px .65fr;min-height:210px;padding:14px}.hook-visual>.context-bit{display:none}.hook-total strong{font-size:25px}.route-grid{gap:8px}.division-scene{grid-template-columns:1fr}.division-console{min-height:170px}.calc-steps{grid-template-columns:1fr 1fr}.calc-steps>div{min-height:52px}.options{grid-template-columns:1fr}.digit-slots{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.digit-slots>div{padding:8px 4px}.summary{grid-template-columns:1fr}.summary-cycle{min-height:160px;grid-template-rows:auto auto;align-content:center}.stage-nav{min-height:66px}.btn{min-width:105px;padding:0 12px}.input-row{flex-direction:column}.check{min-height:48px}.concept-items{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.hook-visual{min-height:180px}.concept-visual{min-height:170px}}
@media(max-width:640px){.stage-content{padding-top:8px;padding-bottom:8px}.stack{gap:9px}.heading{min-height:64px}.heading .bit{width:58px;height:72px}.hook-visual{min-height:180px;padding:12px}.division-scene{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:9px}.division-console{min-height:158px;padding:13px}.calc-steps{grid-template-columns:1fr 1fr;gap:6px}.calc-steps>div{min-height:46px;padding:6px 8px}.options{grid-template-columns:1fr 1fr;gap:7px;margin-top:8px}.option{min-height:50px}.stage-nav{min-height:60px}.btn{min-height:46px}.input-row{flex-direction:row;margin-top:8px}.question,.concept-visual,.division-scene,.digit-task{padding:12px}.feedback{min-height:52px;margin-top:7px;padding:7px 10px}}
@media(max-width:390px){.stage-header,.stage-nav,.stage-content{padding-left:12px;padding-right:12px}.heading h1{font-size:25px}.hook-visual{grid-template-columns:1fr 1fr}.split-symbol,.unknown{display:none}.route-grid{min-width:0}.division-console{padding:14px}.dividend span{font-size:27px}.calc-steps{grid-template-columns:1fr}.concept-items{grid-template-columns:1fr}.digit-slots small{font-size:8px}.digit-slots button{width:44px;height:44px}.digit-slots strong{font-size:21px}}
.stage-content{position:relative;overflow:hidden;padding-bottom:54px}.stage-body{height:100%;min-height:0;overflow:hidden}.caption.caption-slot{position:absolute;left:clamp(14px,5vw,48px);right:clamp(14px,5vw,48px);bottom:5px;width:auto;max-width:none;min-height:40px;margin:0;display:grid;place-items:center;visibility:hidden;opacity:0}.caption.caption-slot.visible{visibility:visible;opacity:1}.activity-slot{min-height:48px;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:6px}.activity-slot button{min-height:44px;padding:7px 12px;border:0;border-radius:13px;color:${T.cyan};background:${T.cyanSoft};font-weight:900;cursor:pointer}.activity-slot button.selected{color:#fff;background:${T.success}}.finale-reflection{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.finale-reflection button{min-width:0;font-size:11px}.btn.next:disabled{opacity:.42;cursor:not-allowed;transform:none}.lesson-root,.stage,.stage-content,.stage-body{overscroll-behavior:none}@media(max-width:390px){.caption.caption-slot{left:12px;right:12px}.finale-reflection button{padding:5px 6px;font-size:9px}}@media(max-height:700px){.stage-header{padding-top:7px;padding-bottom:5px}.stage-content{padding-top:6px}.stack{gap:7px}.heading{min-height:54px}.heading h1{font-size:23px}.heading .bit{width:52px;height:64px}.concept-visual{min-height:154px}.activity-slot{margin-top:5px}.stage-nav{min-height:56px}}
@media(max-width:639.98px){.finale-heading{padding:9px 11px}.finale-heading h1{font-size:21px}.finale-heading p{font-size:9px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-payoff{padding:11px}.finale-takeaway{min-height:38px;padding:6px 8px}.finale-reward{min-height:92px;padding:10px 62px 9px 51px}.finale-medal{left:9px;width:34px;height:34px}.finale-reward-bit{width:58px;height:74px}.finale-reward-copy>strong{font-size:14px}}
@media(max-width:639.98px){.stage-summary .stack{gap:9px}.stage-summary .finale-heading{padding:7px 9px}.stage-summary .finale-heading p{font-size:8.5px;line-height:1.25}.stage-summary .finale-main,.stage-summary .finale-bottom{gap:8px}.stage-summary .finale-payoff{padding:8px;gap:6px}.stage-summary .finale-equation{gap:5px}.stage-summary .finale-equation span,.stage-summary .finale-equation strong{padding:8px}.stage-summary .finale-check{padding:6px 8px}.stage-summary .finale-takeaways{gap:4px}.stage-summary .finale-takeaway{min-height:34px;padding:4px 7px;grid-template-columns:25px minmax(0,1fr);gap:6px}.stage-summary .finale-takeaway b{width:24px;height:24px}.stage-summary .finale-takeaway span{font-size:10px;line-height:1.22}.stage-summary .finale-bridge{padding:8px 11px}.stage-summary .finale-bridge strong{font-size:13px}.stage-summary .finale-reward{min-height:80px;padding:8px 56px 7px 47px}.stage-summary .finale-medal{left:8px;width:30px;height:30px}.stage-summary .finale-reward-bit{width:52px;height:66px}.stage-summary .finale-reward-copy>strong{font-size:13px}.stage-summary .finale-status span{font-size:7.5px}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.revealable{opacity:1!important;transform:none!important}.quotient span.filled{opacity:1!important;transform:none!important}}
@media(max-width:390px) and (max-height:700px){.stage-hook .stack{gap:4px}.stage-hook .heading{min-height:42px}.stage-hook .heading h1{font-size:18px}.stage-hook .hook-visual{min-height:108px;padding:6px}.stage-hook .route-grid{gap:3px}.stage-hook .route{min-height:38px}.stage-hook .question{padding:6px}.stage-hook .question h2{font-size:14px;line-height:1.15}.stage-hook .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:4px}.stage-hook .option{min-height:44px;padding:4px;gap:4px;font-size:9px;line-height:1.12}.stage-hook .option>b{width:24px;height:24px;border-radius:7px}.stage-hook .feedback{min-height:48px;margin-top:4px;padding:4px 6px;font-size:9px;line-height:1.15}}
@media(prefers-reduced-motion:reduce){.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}.finale-confetti i{animation:none!important;top:8px}}
@media(max-width:390px) and (max-height:700px){.stage[data-screen="2"] .stack{gap:4px}.stage[data-screen="2"] .heading{min-height:42px}.stage[data-screen="2"] .heading h1{font-size:18px}.stage[data-screen="2"] .heading .bit{width:40px;height:50px}.stage[data-screen="2"] .concept-visual{min-height:96px;padding:6px;gap:4px}.stage[data-screen="2"] .main-formula{padding:6px 8px;font-size:17px}.stage[data-screen="2"] .concept-items{grid-template-columns:repeat(2,minmax(0,1fr));gap:4px}.stage[data-screen="2"] .concept-items>div{min-height:44px;padding:4px;font-size:9px}.stage[data-screen="2"] .question{padding:6px}.stage[data-screen="2"] .question h2{font-size:14px;line-height:1.15}.stage[data-screen="2"] .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:4px}.stage[data-screen="2"] .option{min-height:44px;padding:4px;gap:4px;font-size:9px;line-height:1.12}.stage[data-screen="2"] .option>b{width:24px;height:24px;border-radius:7px}.stage[data-screen="2"] .feedback{min-height:48px;margin-top:4px;padding:4px 6px}.stage[data-screen="2"] .feedback p{font-size:9px;line-height:1.15}}
@media(max-width:390px) and (max-height:700px){.stage[data-screen="4"] .stack{gap:4px}.stage[data-screen="4"] .heading{min-height:42px}.stage[data-screen="4"] .heading h1{font-size:18px}.stage[data-screen="4"] .heading .bit{width:40px;height:50px}.stage[data-screen="4"] .concept-visual{min-height:96px;padding:6px;gap:4px}.stage[data-screen="4"] .main-formula{padding:6px 8px;font-size:17px}.stage[data-screen="4"] .concept-items{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.stage[data-screen="4"] .concept-items>div{min-height:44px;padding:4px;font-size:9px}.stage[data-screen="4"] .question{padding:6px}.stage[data-screen="4"] .question h2{font-size:14px;line-height:1.15}.stage[data-screen="4"] .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:4px}.stage[data-screen="4"] .option{min-height:44px;padding:4px;gap:4px;font-size:9px;line-height:1.12}.stage[data-screen="4"] .option>b{width:24px;height:24px;border-radius:7px}.stage[data-screen="4"] .feedback{min-height:48px;margin-top:4px;padding:4px 6px}.stage[data-screen="4"] .feedback p{font-size:9px;line-height:1.15}}
@media(max-width:390px) and (max-height:700px){.stage[data-screen="6"] .stack{gap:4px}.stage[data-screen="6"] .heading{min-height:42px}.stage[data-screen="6"] .heading h1{font-size:18px}.stage[data-screen="6"] .heading .bit{width:40px;height:50px}.stage[data-screen="6"] .concept-visual{min-height:96px;padding:6px;gap:4px}.stage[data-screen="6"] .main-formula{padding:6px 8px;font-size:17px}.stage[data-screen="6"] .concept-items{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.stage[data-screen="6"] .concept-items>div{min-height:44px;padding:4px;font-size:9px}.stage[data-screen="6"] .question{padding:6px}.stage[data-screen="6"] .question h2{font-size:14px;line-height:1.15}.stage[data-screen="6"] .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:4px}.stage[data-screen="6"] .option{min-height:44px;padding:4px;gap:4px;font-size:9px;line-height:1.12}.stage[data-screen="6"] .option>b{width:24px;height:24px;border-radius:7px}.stage[data-screen="6"] .feedback{min-height:48px;margin-top:4px;padding:4px 6px}.stage[data-screen="6"] .feedback p{font-size:9px;line-height:1.15}}
@media(max-width:390px) and (max-height:700px){.stage:is([data-screen="10"],[data-screen="12"]) .stack{gap:4px}.stage:is([data-screen="10"],[data-screen="12"]) .heading{min-height:42px}.stage:is([data-screen="10"],[data-screen="12"]) .heading h1{font-size:18px}.stage:is([data-screen="10"],[data-screen="12"]) .heading .bit{width:40px;height:50px}.stage:is([data-screen="10"],[data-screen="12"]) .concept-visual{min-height:96px;padding:6px;gap:4px}.stage:is([data-screen="10"],[data-screen="12"]) .main-formula{padding:6px 8px;font-size:17px}.stage:is([data-screen="10"],[data-screen="12"]) .concept-items{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.stage:is([data-screen="10"],[data-screen="12"]) .concept-items>div{min-height:44px;padding:4px;font-size:9px}.stage:is([data-screen="10"],[data-screen="12"]) .question{padding:6px}.stage:is([data-screen="10"],[data-screen="12"]) .question h2{font-size:14px;line-height:1.15}.stage:is([data-screen="10"],[data-screen="12"]) .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:4px}.stage:is([data-screen="10"],[data-screen="12"]) .option{min-height:44px;padding:4px;gap:4px;font-size:9px;line-height:1.12}.stage:is([data-screen="10"],[data-screen="12"]) .option>b{width:22px;height:22px;border-radius:7px}.stage:is([data-screen="10"],[data-screen="12"]) .feedback{min-height:48px;margin-top:4px;padding:4px 6px}.stage:is([data-screen="10"],[data-screen="12"]) .feedback p{font-size:9px;line-height:1.15}}
@media(max-width:390px) and (max-height:700px){.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .stack{gap:4px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .heading{min-height:42px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .heading h1{font-size:18px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .heading .bit{width:40px;height:50px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .concept-visual{min-height:96px;padding:5px;gap:4px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .main-formula{padding:6px 8px;font-size:15px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .concept-items{grid-template-columns:repeat(2,minmax(0,1fr));gap:4px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .concept-items>div{min-height:44px;padding:4px;font-size:10px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .fact-card{padding:5px 7px;font-size:9px;line-height:1.2}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .division-scene{gap:4px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .division-console{min-height:120px;padding:6px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .calc-steps{grid-template-columns:repeat(2,minmax(0,1fr));gap:3px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .calc-steps>div{min-height:44px;padding:4px;grid-template-columns:22px minmax(0,1fr);gap:4px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .calc-steps b{width:22px;height:22px}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .calc-steps span{font-size:9px;line-height:1.15}.stage:is([data-screen="9"],[data-screen="11"],[data-screen="13"]) .activity-slot{margin-top:2px}}
.hook-scene-shell{min-width:0;max-width:100%;overflow:hidden;border-radius:24px}.hook-visual>.context-bit{position:absolute;right:16px;bottom:-22px;width:64px;height:80px;display:block}.hook-visual>.context-bit>.bit{width:100%;height:100%}.feedback-bit{width:34px;height:43px;display:block;align-self:end;overflow:hidden}.feedback-bit>.bit{width:100%;height:100%}
[data-g4-role="hook-title"],[data-g4-role="hook-question"]{width:100%;text-align:left}[data-g4-role="hook-title"]{font:650 clamp(26px,4.2vw,36px)/1.08 'Source Serif 4',Georgia,serif;letter-spacing:-.012em}[data-g4-role="hook-question"]{font:750 clamp(17px,2.5vw,21px)/1.3 Manrope,system-ui,sans-serif}[data-g4-role="visual-frame"]{max-width:100%;overflow:hidden}[data-g4-role="visual-frame"] :is(img,svg,canvas,video){display:block;max-width:100%;max-height:100%}[data-g4-role="visual-frame"] :is(img,video){width:100%;height:100%;object-fit:contain}
@media(max-width:640px){.hook-visual>.context-bit{display:block!important;right:8px;bottom:-16px;width:54px;height:68px}[data-g4-role="hook-title"]{font-size:25px}}
.lesson-root{font-family:'Manrope',system-ui,sans-serif}.lesson-root h1{font-family:'Source Serif 4',Georgia,serif}.lesson-root .question h2{font-family:'Manrope',system-ui,sans-serif}.screen-count,.main-formula,[class*="formula"],[class*="equation"],[class*="proof-label"]{font-family:'JetBrains Mono',monospace}.lead,.heading>div>span{font-size:clamp(14px,1.8vw,16px)}
[data-g4-role="hook-scene"]{width:min(760px, 100%);min-width:0;margin-inline:auto}[data-g4-role="visual-frame"]{position:relative;isolation:isolate;width:100%;min-width:0;min-height:206px;border-radius:24px;overflow:hidden;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}[data-g4-role="hook-bit"]{position:absolute!important;right:42px!important;bottom:-4px!important;width:88px!important;height:110px!important;display:block!important}[data-g4-role="hook-bit"]>.bit,[data-g4-role="hook-bit"]>.g1-char,[data-g4-role="hook-bit"]>svg{width:100%!important;height:100%!important}
[data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;grid-template-columns:62px minmax(0,1fr)}[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]{width:62px;height:76px}[data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;background:linear-gradient(135deg,#FFFFFF,#E7F3EC);box-shadow:inset 4px 0 #227A53}[data-g4-feedback="solution"] [data-g4-role="feedback-bit"]{width:51px;height:64px}[data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9);box-shadow:inset 4px 0 #A96F13}[data-g4-role~="bit-answer-comment"] p{font:700 clamp(15px,2vw,18px)/1.35 'Source Serif 4',Georgia,serif}
@media(max-width:639.98px){[data-g4-role="visual-frame"]{min-height:164px;border-radius:18px}[data-g4-role="hook-bit"]{right:12px!important;bottom:-7px!important;width:68px!important;height:85px!important}[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]{width:54px;height:68px}[data-g4-feedback="solution"] [data-g4-role="feedback-bit"]{width:47px;height:59px}}
.lesson-root [data-g4-role~="hook-title"]{font-size:clamp(26px,4.2vw,36px);font-family:'Source Serif 4',Georgia,serif}
.lesson-root [data-g4-role~="hook-question"]{font-size:clamp(17px,2.5vw,21px);font-family:'Manrope',system-ui,sans-serif}
.lesson-root [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{width:100%;min-height:206px;border-radius:24px;overflow:hidden}
.lesson-root [data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;grid-template-columns:62px minmax(0,1fr)}
.lesson-root [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:62px;height:76px}
.lesson-root [data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;grid-template-columns:51px minmax(0,1fr);background:linear-gradient(135deg,#FFFFFF,#E7F3EC)}
.lesson-root [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px;height:64px}
.lesson-root [data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9)}
@media(max-width:639.98px){.lesson-root [data-g4-role~="hook-title"]{font-size:25px}.lesson-root [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}.lesson-root [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:54px;height:68px}.lesson-root [data-g4-feedback="solution"]{min-height:68px}.lesson-root [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px;height:59px}}
`;
