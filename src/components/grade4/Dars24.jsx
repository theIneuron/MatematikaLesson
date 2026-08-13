import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 24-DARS · O'nli kasrlar
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
  lessonId: 'dec-4-24-v1',
  slug: 'dars24-onli-kasrlar',
  lessonTitle: { uz: "24-dars. O'nli kasrlar", ru: 'Урок 24. Десятичные дроби', en: 'Lesson 24. Decimal fractions' },
  skillTags: ['decimal_notation', 'tenths', 'hundredths', 'thousandths', 'place_value', 'mixed_decimal'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'StoryChoice', mechanic: 'StoryChoice', goal: 'Predict how a fraction is written as a decimal', misconceptions: ['comma position guessed'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'model', subtype: 'tenths-strip', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Connect tenths on a strip with decimal notation', misconceptions: ['tenths written as hundredths'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'hundredths-grid', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Connect hundredths on a grid with decimal places', misconceptions: ['missing zero placeholder'], active: true, scored: false, scope: null },
  { id: 's3', type: 'discovery', subtype: 'thousandths-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Extend the model to thousandths', misconceptions: ['wrong place value'], active: true, scored: false, scope: null },
  { id: 's4', type: 'discovery', subtype: 'place-value-link', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Discover the fraction-to-place-value connection', misconceptions: ['digits shifted'], active: true, scored: false, scope: null },
  { id: 's5', type: 'rule', subtype: 'decimal-writing-rule', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Formulate the decimal notation rule', misconceptions: ['zero placeholders removed'], active: true, scored: false, scope: null },
  { id: 's6', type: 'strategy', subtype: 'place-table-strategy', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Use a place table to check decimal notation', misconceptions: ['separator treated as operation'], active: true, scored: false, scope: null },
  { id: 's7', type: 'consolidation', subtype: 'mixed-number-transfer', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Transfer notation to a whole plus fractional part', misconceptions: ['whole part lost'], active: true, scored: false, scope: null },
  { id: 's8', type: 'test', subtype: 'tenths-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Write tenths as a decimal', misconceptions: ['wrong decimal place'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's9', type: 'test', subtype: 'hundredths-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Write hundredths as a decimal', misconceptions: ['missing zero'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'strategy', subtype: 'thousandths-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Choose the correct place-value strategy', misconceptions: ['digit shift'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's11', type: 'test', subtype: 'mixed-decimal', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Write a mixed decimal quantity', misconceptions: ['whole part ignored'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's12', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepairChoice', mechanic: 'ErrorRepairChoice', goal: "Repair Bit's missing-zero error", misconceptions: ['five hundredths written as five tenths'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'case', subtype: 'life-context-transfer', template: 'CaseChoice', mechanic: 'CaseChoice', goal: 'Read a decimal sensor value in context', misconceptions: ['fractional digits reversed'], active: true, scored: true, scoreUnits: 1, scope: 'final' },
  { id: 's14', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', mechanic: 'ReflectionClaim', goal: 'Reflect on place value and bridge forward', misconceptions: ['partial place-value check'], active: true, scored: false, scope: null },
];

const bi = (uz, ru, en) => ({ uz, ru, en });

const CONTENT = {
  s0: {
    eyebrow: bi("Lumo sensor paneli", "Панель датчиков Лумо", 'Lumo sensor panel'),
    title: bi("3/10 uchun qisqa yozuv", "Короткая запись для 3/10", 'A shorter notation for 3/10'),
    question: bi("Panel qaysi vergulli kodni ko'rsatishi kerak?", "Какой код с запятой должна показать панель?", 'Which decimal code should the panel display?'),
    frames: [bi("Sensor: 3/10", "Датчик: 3/10", 'Sensor: 3/10'), bi("Panel kodi: ?", "Код панели: ?", 'Panel code: ?'), bi("0,3   0,03   3,0", "0,3   0,03   3,0", '0.3   0.03   3.0')],
    options: [bi('0,3', '0,3', '0.3'), bi('0,03', '0,03', '0.03'), bi('3,0', '3,0', '3.0')],
    neutral: bi("Taxmin saqlandi. Endi o'ndan ulushlar modelini ochamiz.", "Предположение сохранено. Теперь откроем модель десятых долей.", 'Your prediction has been recorded. Now we will explore a model of tenths.'),
    audio: { intro: {
      uz: ["Sensor o'nta teng ulushdan uchtasini qayd etdi.", "Hisobotda bu miqdor o'ndan uch kasri bilan yozilgan.", "Panelga shu miqdorning vergulli yozuvi kerak. Taxminingizni belgilashingiz yoki kuzatishingiz mumkin."],
      ru: ["Датчик зафиксировал три доли из десяти равных.", "В отчёте это количество записано дробью три десятых.", "Панели нужна запись того же количества с запятой. Можешь отметить предположение или просто наблюдать."],
      en: ['The sensor recorded three of ten equal parts.', 'The report writes this amount as the fraction three tenths.', 'The panel needs the decimal notation for the same amount. You may record a prediction or simply observe.'],
    } },
  },
  s1: {
    eyebrow: bi("O'ndan ulushlar", "Десятые доли", 'Tenths'),
    title: bi("Bir butunni 10 teng qismga ajratamiz", "Разделим единицу на 10 равных частей", 'Divide one whole into 10 equal parts'),
    frames: [bi("1 butun = 10 teng qism", "1 целое = 10 равных частей", '1 whole = 10 equal parts'), bi("3 qism bo'yalgan", "Закрашены 3 части", '3 parts are shaded'), bi("3/10", "3/10", '3/10'), bi("0,3", "0,3", '0.3')],
    audio: {
      uz: ["Bitta butun tasma o'nta teng qismga ajratildi.", "Ulardan uchtasi bo'yalgan.", "Oddiy kasrda bu o'ndan uch deb yoziladi.", "O'nli kasrda shu miqdor nol butun o'ndan uch, ya'ni nol vergul uch deb yoziladi."],
      ru: ["Одна целая полоска разделена на десять равных частей.", "Три из них закрашены.", "Обыкновенной дробью это записывают как три десятых.", "Десятичной дробью то же количество записывают как ноль целых три десятых, то есть ноль запятая три."],
      en: ['One whole strip is divided into ten equal parts.', 'Three of them are shaded.', 'As a common fraction, this is written as three tenths.', 'As a decimal, the same amount is written as zero point three.'],
    },
  },
  s2: {
    eyebrow: bi("Vergulning ikki tomoni", "Две стороны запятой", 'Two sides of the decimal point'),
    title: bi("0,3 yozuvini o'qiymiz", "Прочитаем запись 0,3", 'Read the notation 0.3'),
    frames: [bi("0 | , | 3", "0 | , | 3", '0 | . | 3'), bi("Birlar | , | O'ndan", "Единицы | , | Десятые", 'Ones | . | Tenths'), bi("0 — butun qism", "0 — целая часть", '0 — whole-number part'), bi("3 — o'ndan ulushlar", "3 — десятые доли", '3 — tenths')],
    audio: {
      uz: ["Nol vergul uch yozuvida vergul ikki qismni ajratadi.", "Vergulning chap tomonida birlar, o'ng tomonidagi birinchi xonada o'ndan ulushlar turadi.", "Nol bu yerda butun qism yo'qligini ko'rsatadi.", "Uch esa o'ndan uchni ko'rsatadi. Son nol butun o'ndan uch deb o'qiladi."],
      ru: ["В записи ноль запятая три запятая разделяет две части.", "Слева от запятой стоят единицы, а первая позиция справа обозначает десятые.", "Ноль показывает, что целая часть равна нулю.", "Тройка показывает три десятых. Число читается как ноль целых три десятых."],
      en: ['In the notation zero point three, the decimal point separates two parts.', 'Ones are to the left of the point, and the first place to the right represents tenths.', 'The zero shows that there is no whole-number part.', 'The three represents three tenths. The number is read as zero point three.'],
    },
  },
  s3: {
    eyebrow: bi("Yuzdan ulushlar", "Сотые доли", 'Hundredths'),
    title: bi("7/100 ni vergulli yozamiz", "Запишем 7/100 с запятой", 'Write 7/100 as a decimal'),
    frames: [bi("1 butun = 100 teng katak", "1 целое = 100 равных клеток", '1 whole = 100 equal squares'), bi("7 katak bo'yalgan", "Закрашены 7 клеток", '7 squares are shaded'), bi("7/100", "7/100", '7/100'), bi("0,07 — nol butun yuzdan yetti", "0,07 — ноль целых семь сотых", '0.07 — seven hundredths')],
    audio: {
      uz: ["Bir butun kvadrat yuzta teng katakka ajratilgan.", "Kataklardan yettitasi bo'yalgan.", "Oddiy kasrda bu yuzdan yetti.", "Verguldan keyin ikkita xona kerak. O'ndan xonasida nol, yuzdan xonasida yetti turadi. Shuning uchun nol vergul nol yetti yoziladi."],
      ru: ["Один целый квадрат разделён на сто равных клеток.", "Закрашены семь клеток.", "Обыкновенной дробью это семь сотых.", "После запятой нужны две позиции. В десятых стоит ноль, в сотых семь. Поэтому записываем ноль запятая ноль семь."],
      en: ['One whole square is divided into one hundred equal small squares.', 'Seven squares are shaded.', 'As a common fraction, this is seven hundredths.', 'Two places are needed after the decimal point. There is zero in the tenths place and seven in the hundredths place, so write zero point zero seven.'],
    },
  },
  s4: {
    eyebrow: bi("Mingdan ulushlar", "Тысячные доли", 'Thousandths'),
    title: bi("46/1000 ni vergulli yozamiz", "Запишем 46/1000 с запятой", 'Write 46/1000 as a decimal'),
    frames: [bi("1 butun = 1000 teng ulush", "1 целое = 1000 равных долей", '1 whole = 1000 equal parts'), bi("46 ulush belgilangan", "Отмечены 46 долей", '46 parts are marked'), bi("46/1000", "46/1000", '46/1000'), bi("0,046 — nol butun mingdan qirq olti", "0,046 — ноль целых сорок шесть тысячных", '0.046 — forty-six thousandths')],
    audio: {
      uz: ["Bir butun endi mingta teng ulush bilan ko'rsatiladi.", "Ulardan qirq oltitasi belgilangan.", "Oddiy kasrda bu mingdan qirq olti.", "Verguldan keyin uchta xona kerak. O'ndan nol, yuzdan to'rt, mingdan olti turadi. Yozuv nol vergul nol to'rt olti."],
      ru: ["Теперь одно целое показано тысячей равных долей.", "Отмечены сорок шесть из них.", "Обыкновенной дробью это сорок шесть тысячных.", "После запятой нужны три позиции. В десятых ноль, в сотых четыре, в тысячных шесть. Запись читается как ноль запятая ноль четыре шесть."],
      en: ['Now one whole is represented by one thousand equal parts.', 'Forty-six of them are marked.', 'As a common fraction, this is forty-six thousandths.', 'Three places are needed after the decimal point. There is zero in tenths, four in hundredths and six in thousandths. The notation is zero point zero four six.'],
    },
  },
  s5: {
    eyebrow: bi("Butun ham bor", "Есть и целая часть", 'There is a whole-number part too'),
    title: bi("2 butun 3/10", "2 целых и 3/10", '2 wholes and 3/10'),
    frames: [bi("2 ta butun", "2 целых", '2 wholes'), bi("yana 3/10 qism", "ещё 3/10", 'and another 3/10'), bi("2 3/10", "2 3/10", '2 3/10'), bi("2,3 — ikki butun o'ndan uch", "2,3 — две целых три десятых", '2.3 — two and three tenths')],
    audio: {
      uz: ["Modelda ikkita to'liq tasma bor.", "Yana uchta o'ndan ulush bo'yalgan.", "Aralash yozuvda bu ikki butun o'ndan uch.", "O'nli yozuvda ikki vergul uch yoziladi va ikki butun o'ndan uch deb o'qiladi."],
      ru: ["На модели есть две полные полоски.", "Ещё закрашены три десятые доли.", "Смешанной записью это две целых и три десятых.", "Десятичной записью пишем два запятая три и читаем как две целых три десятых."],
      en: ['The model has two complete strips.', 'Another three tenths are shaded.', 'As a mixed number, this is two and three tenths.', 'In decimal notation, write two point three and read it as two and three tenths.'],
    },
  },
  s6: {
    eyebrow: bi("Har raqamning o'rni", "У каждой цифры своё место", 'Every digit has a place'),
    title: bi("5,308 ni xonalarga ajratamiz", "Разложим 5,308 по разрядам", 'Partition 5.308 by place value'),
    frames: [bi("5,308", "5,308", '5.308'), bi("5 — birlar", "5 — единицы", '5 — ones'), bi("3 — o'ndan; 0 — yuzdan", "3 — десятые; 0 — сотые", '3 — tenths; 0 — hundredths'), bi("8 — mingdan", "8 — тысячные", '8 — thousandths')],
    audio: {
      uz: ["Besh vergul uch nol sakkiz sonida har bir raqam o'z joyida turadi.", "Besh vergulning chapida va butun birlarni ko'rsatadi.", "Uch o'ndan xonasida, nol esa yuzdan xonasida turadi.", "Sakkiz mingdan xonasida. Son besh butun mingdan uch yuz sakkiz deb o'qiladi."],
      ru: ["В числе пять запятая три ноль восемь каждая цифра стоит на своём месте.", "Пять находится слева от запятой и показывает целые единицы.", "Три стоит в десятых, а ноль в сотых.", "Восемь стоит в тысячных. Число читается как пять целых триста восемь тысячных."],
      en: ['In the number five point three zero eight, every digit has its own place.', 'Five is to the left of the decimal point and represents whole ones.', 'Three is in the tenths place, and zero is in the hundredths place.', 'Eight is in the thousandths place. The number is read as five and three hundred eight thousandths.'],
    },
  },
  s7: {
    eyebrow: bi("Yozuv xaritasi", "Карта записи", 'Notation map'),
    title: bi("Maxraj nechta xona kerakligini ko'rsatadi", "Знаменатель показывает число позиций", 'The denominator shows how many decimal places are needed'),
    frames: [
      bi("__/10 → verguldan keyin 1 xona", "__/10 → 1 позиция после запятой", '__/10 → 1 place after the decimal point'),
      bi("__/100 → 2 xona", "__/100 → 2 позиции", '__/100 → 2 places'),
      bi("__/1000 → 3 xona", "__/1000 → 3 позиции", '__/1000 → 3 places'),
      bi("Butun qism → vergulning chapiga", "Целая часть → слева от запятой", 'Whole-number part → left of the decimal point'),
      bi("Yetishmagan xona → 0", "Пустая позиция → 0", 'Missing place → 0'),
    ],
    audio: {
      uz: ["Maxraj o'n bo'lsa, verguldan keyin bitta xona yoziladi.", "Maxraj yuz bo'lsa, ikkita xona yoziladi.", "Maxraj ming bo'lsa, uchta xona yoziladi.", "Butun qism doim vergulning chap tomonida qoladi.", "Kerakli xonada raqam bo'lmasa, uning o'rnini nol saqlaydi."],
      ru: ["При знаменателе десять после запятой нужна одна позиция.", "При знаменателе сто нужны две позиции.", "При знаменателе тысяча нужны три позиции.", "Целая часть всегда остаётся слева от запятой.", "Если в нужном разряде нет цифры, её место сохраняет ноль."],
      en: ['With a denominator of ten, one place is needed after the decimal point.', 'With a denominator of one hundred, two places are needed.', 'With a denominator of one thousand, three places are needed.', 'The whole-number part always stays to the left of the decimal point.', 'If a required place has no digit, zero holds that place.'],
    },
  },
  s8: {
    eyebrow: bi("Mashq · 1/6", "Тренировка · 1/6", 'Practice · 1/6'),
    title: bi("O'nli yozuvni tanlang", "Выбери десятичную запись", 'Choose the decimal notation'),
    question: bi("6/10 qaysi yozuvga teng?", "Какая запись равна 6/10?", 'Which notation equals 6/10?'),
    frames: [bi("6/10 — o'ndan olti", "6/10 — шесть десятых", '6/10 — six tenths'), bi("Mos bir xonali yozuvni toping", "Найди запись с одной позицией", 'Find the matching one-place decimal')],
    options: [bi('0,6', '0,6', '0.6'), bi('0,06', '0,06', '0.06'), bi('6,0', '6,0', '6.0')], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 6 o'ndan xonasida turibdi.", "Верно. Цифра 6 стоит в десятых.", 'Correct. The digit 6 is in the tenths place.'),
      bi("Bu yuzdan olti; verguldan keyin ikki xona bor.", "Это шесть сотых: после запятой две позиции.", 'That is six hundredths, with two places after the decimal point.'),
      bi("Bu olti butun; 6 vergulning chapida.", "Это шесть целых: цифра 6 стоит слева от запятой.", 'That is six wholes, with 6 to the left of the decimal point.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Olti o'ndan xonasida turibdi.", "Верно. Цифра шесть стоит в десятых.", 'Correct. Six is in the tenths place.'),
      bi("Bu yuzdan olti. Verguldan keyin ikkita xona bor.", "Это шесть сотых. После запятой две позиции.", 'That is six hundredths. There are two places after the decimal point.'),
      bi("Bu olti butun. Olti vergulning chapida turibdi.", "Это шесть целых. Цифра шесть стоит слева от запятой.", 'That is six wholes. Six is to the left of the decimal point.'),
    ],
    proof: bi("6/10 ↔ 0,6", "6/10 ↔ 0,6", '6/10 ↔ 0.6'),
    audio: { intro: {
      uz: ["O'ndan olti uchun verguldan keyin bitta xona kerak.", "Bir xonali uch variantdan kasrga aynan mosini tanlashingiz mumkin."],
      ru: ["Для шести десятых нужна одна позиция после запятой.", "Среди трёх вариантов можешь выбрать запись, точно соответствующую дроби."],
      en: ['Six tenths needs one place after the decimal point.', 'You may choose the notation that exactly matches the fraction from the three options.'],
    }, on_correct: bi("To'g'ri. O'ndan olti nol vergul olti deb yoziladi.", "Верно. Шесть десятых записываются как ноль запятая шесть.", 'Correct. Six tenths is written as zero point six.') },
  },
  s9: {
    eyebrow: bi("Mashq · 2/6", "Тренировка · 2/6", 'Practice · 2/6'),
    title: bi("Nol joyni saqlaydi", "Ноль сохраняет место", 'Zero holds a place'),
    question: bi("4/100 qaysi yozuvga teng?", "Какая запись равна 4/100?", 'Which notation equals 4/100?'),
    frames: [bi("4/100 — yuzdan to'rt", "4/100 — четыре сотых", '4/100 — four hundredths'), bi("Shablon: 0,__", "Шаблон: 0,__", 'Template: 0.__')],
    options: [bi('0,04', '0,04', '0.04'), bi('0,4', '0,4', '0.4'), bi('4,00', '4,00', '4.00')], correctIndex: 0,
    feedback: [
      bi("To'g'ri. Nol o'ndan xonasini, 4 yuzdan xonasini ko'rsatadi.", "Верно. Ноль показывает десятые, а 4 — сотые.", 'Correct. Zero holds the tenths place, and 4 is in the hundredths place.'),
      bi("Bu o'ndan to'rt, yuzdan to'rt emas.", "Это четыре десятых, а не четыре сотых.", 'That is four tenths, not four hundredths.'),
      bi("Bu to'rt butun; 4 vergulning chapida.", "Это четыре целых: 4 стоит слева от запятой.", 'That is four wholes, with 4 to the left of the decimal point.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Nol o'ndan xonasini saqlaydi, to'rt yuzdan xonasida turadi.", "Верно. Ноль сохраняет место десятых, а четыре стоит в сотых.", 'Correct. Zero holds the tenths place, and four is in the hundredths place.'),
      bi("Bu o'ndan to'rt, yuzdan to'rt emas.", "Это четыре десятых, а не четыре сотых.", 'That is four tenths, not four hundredths.'),
      bi("Bu to'rt butun. To'rt vergulning chapida turibdi.", "Это четыре целых. Цифра четыре стоит слева от запятой.", 'That is four wholes. Four is to the left of the decimal point.'),
    ],
    proof: bi("4/100 ↔ 0,04", "4/100 ↔ 0,04", '4/100 ↔ 0.04'),
    audio: { intro: {
      uz: ["Yuzdan to'rt uchun verguldan keyin ikkita xona kerak.", "Shu ikki xonani to'g'ri saqlagan yozuvni tanlashingiz mumkin."],
      ru: ["Для четырёх сотых нужны две позиции после запятой.", "Можешь выбрать запись, которая правильно сохраняет обе позиции."],
      en: ['Four hundredths needs two places after the decimal point.', 'You may choose the notation that correctly preserves both places.'],
    }, on_correct: bi("To'g'ri. Yuzdan to'rt nol vergul nol to'rt deb yoziladi.", "Верно. Четыре сотых записываются как ноль запятая ноль четыре.", 'Correct. Four hundredths is written as zero point zero four.') },
  },
  s10: {
    eyebrow: bi("Mashq · 3/6", "Тренировка · 3/6", 'Practice · 3/6'),
    title: bi("Uchta xona", "Три позиции", 'Three decimal places'),
    question: bi("23/1000 qaysi yozuvga teng?", "Какая запись равна 23/1000?", 'Which notation equals 23/1000?'),
    frames: [bi("23/1000 — mingdan yigirma uch", "23/1000 — двадцать три тысячных", '23/1000 — twenty-three thousandths'), bi("Shablon: 0,___", "Шаблон: 0,___", 'Template: 0.___')],
    options: [bi('0,023', '0,023', '0.023'), bi('0,23', '0,23', '0.23'), bi('23,0', '23,0', '23.0')], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 0 — o'ndan, 2 — yuzdan, 3 — mingdan.", "Верно. 0 — десятые, 2 — сотые, 3 — тысячные.", 'Correct. 0 is in tenths, 2 in hundredths and 3 in thousandths.'),
      bi("Bu yuzdan yigirma uch; verguldan keyin ikki xona.", "Это двадцать три сотых: после запятой две позиции.", 'That is twenty-three hundredths, with two places after the decimal point.'),
      bi("Bu yigirma uch butun.", "Это двадцать три целых.", 'That is twenty-three wholes.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Nol o'ndan, ikki yuzdan, uch mingdan xonasida turibdi.", "Верно. Ноль стоит в десятых, два в сотых, три в тысячных.", 'Correct. Zero is in tenths, two in hundredths and three in thousandths.'),
      bi("Bu yuzdan yigirma uch. Verguldan keyin ikkita xona bor.", "Это двадцать три сотых. После запятой две позиции.", 'That is twenty-three hundredths. There are two places after the decimal point.'),
      bi("Bu yigirma uch butun.", "Это двадцать три целых.", 'That is twenty-three wholes.'),
    ],
    proof: bi("23/1000 ↔ 0,023", "23/1000 ↔ 0,023", '23/1000 ↔ 0.023'),
    audio: { intro: {
      uz: ["Mingdan yigirma uch uchun verguldan keyin uchta xona kerak.", "Uchta xonani to'g'ri joylashtirgan yozuvni tanlashingiz mumkin."],
      ru: ["Для двадцати трёх тысячных нужны три позиции после запятой.", "Можешь выбрать запись, в которой все три позиции расположены верно."],
      en: ['Twenty-three thousandths needs three places after the decimal point.', 'You may choose the notation in which all three places are positioned correctly.'],
    }, on_correct: bi("To'g'ri. Mingdan yigirma uch nol vergul nol ikki uch deb yoziladi.", "Верно. Двадцать три тысячных записываются как ноль запятая ноль два три.", 'Correct. Twenty-three thousandths is written as zero point zero two three.') },
  },
  s11: {
    eyebrow: bi("Mashq · 4/6", "Тренировка · 4/6", 'Practice · 4/6'),
    title: bi("Butunni saqlang", "Сохрани целое", 'Keep the whole-number part'),
    question: bi("3 butun 8/100 ni o'nli yozing", "Запиши 3 целых и 8/100 десятичной дробью", 'Write 3 and 8/100 as a decimal'),
    frames: [bi("Butun qism: 3", "Целая часть: 3", 'Whole-number part: 3'), bi("Shablon: 3,__", "Шаблон: 3,__", 'Template: 3.__')],
    options: [bi('3,08', '3,08', '3.08'), bi('3,8', '3,8', '3.8'), bi('0,38', '0,38', '0.38')], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 3 — butun, 0 — o'ndan, 8 — yuzdan.", "Верно. 3 — целые, 0 — десятые, 8 — сотые.", 'Correct. 3 is the whole number, 0 is in tenths and 8 is in hundredths.'),
      bi("Bu uch butun o'ndan sakkiz.", "Это три целых восемь десятых.", 'That is three and eight tenths.'),
      bi("Butun 3 o'z joyini yo'qotgan.", "Целое 3 потеряло своё место.", 'The whole-number part 3 has lost its place.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Uch butun, nol o'ndan, sakkiz yuzdan xonasida turibdi.", "Верно. Три целых, ноль в десятых, восемь в сотых.", 'Correct. Three is the whole number, zero is in tenths and eight is in hundredths.'),
      bi("Bu uch butun o'ndan sakkiz.", "Это три целых восемь десятых.", 'That is three and eight tenths.'),
      bi("Butun uch o'z joyini yo'qotgan.", "Целое три потеряло своё место.", 'The whole-number part three has lost its place.'),
    ],
    proof: bi("3 8/100 ↔ 3,08", "3 8/100 ↔ 3,08", '3 8/100 ↔ 3.08'),
    audio: { intro: {
      uz: ["Butun qism uch vergulning chap tomonida turadi.", "Kasr qism yuzdan sakkiz. Unga mos ikki xonali yozuvni tanlashingiz mumkin."],
      ru: ["Целая часть три стоит слева от запятой.", "Дробная часть равна восьми сотым. Можешь выбрать соответствующую запись с двумя позициями."],
      en: ['The whole-number part three is to the left of the decimal point.', 'The fractional part is eight hundredths. You may choose the matching notation with two decimal places.'],
    }, on_correct: bi("To'g'ri. Uch butun yuzdan sakkiz uch vergul nol sakkiz deb yoziladi.", "Верно. Три целых восемь сотых записываются как три запятая ноль восемь.", 'Correct. Three and eight hundredths is written as three point zero eight.') },
  },
  s12: {
    eyebrow: bi("Mashq · 5/6", "Тренировка · 5/6", 'Practice · 5/6'),
    title: bi("Bit qaysi nolni unutdi?", "Какой ноль забыл Бит?", 'Which zero did Bit forget?'),
    question: bi("Bit: 5/100 = 0,5. To'g'ri yozuvni toping.", "Бит: 5/100 = 0,5. Найди верную запись.", 'Bit: 5/100 = 0.5. Find the correct notation.'),
    frames: [bi("Maxraj 100 → 2 xona", "Знаменатель 100 → 2 позиции", 'Denominator 100 → 2 places'), bi("Bitning 0,5 yozuvini tekshiring", "Проверь запись Бита 0,5", "Check Bit's notation 0.5")],
    options: [bi('0,05', '0,05', '0.05'), bi('0,50', '0,50', '0.50'), bi('5,00', '5,00', '5.00')], correctIndex: 0,
    feedback: [
      bi("To'g'ri. Nol o'ndan xonasini saqlaydi, 5 yuzdan xonasida.", "Верно. Ноль сохраняет место десятых, а 5 стоит в сотых.", 'Correct. Zero holds the tenths place, and 5 is in the hundredths place.'),
      bi("Bu yuzdan ellik, yuzdan besh emas.", "Это пятьдесят сотых, а не пять сотых.", 'That is fifty hundredths, not five hundredths.'),
      bi("Bu besh butun.", "Это пять целых.", 'That is five wholes.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Nol o'ndan xonasini saqlaydi, besh yuzdan xonasida turadi.", "Верно. Ноль сохраняет место десятых, а пять стоит в сотых.", 'Correct. Zero holds the tenths place, and five is in the hundredths place.'),
      bi("Bu yuzdan ellik, yuzdan besh emas.", "Это пятьдесят сотых, а не пять сотых.", 'That is fifty hundredths, not five hundredths.'),
      bi("Bu besh butun.", "Это пять целых.", 'That is five wholes.'),
    ],
    proof: bi("5/100 ↔ 0,05", "5/100 ↔ 0,05", '5/100 ↔ 0.05'),
    audio: { intro: {
      uz: ["Bit yuzdan beshni o'ndan besh kabi yozdi.", "Maxraj yuz bo'lgani uchun yozuvdagi xonalar sonini tekshirib, variantni tanlashingiz mumkin."],
      ru: ["Бит записал пять сотых как пять десятых.", "При знаменателе сто проверь число позиций в записи и, если хочешь, выбери вариант."],
      en: ['Bit wrote five hundredths as five tenths.', 'With a denominator of one hundred, check the number of decimal places and choose an option if you wish.'],
    }, on_correct: bi("To'g'ri. Yuzdan besh nol vergul nol besh deb yoziladi.", "Верно. Пять сотых записываются как ноль запятая ноль пять.", 'Correct. Five hundredths is written as zero point zero five.') },
  },
  s13: {
    eyebrow: bi("Mashq · 6/6", "Тренировка · 6/6", 'Practice · 6/6'),
    title: bi("Sensor kodi", "Код датчика", 'Sensor code'),
    question: bi("Ikki butun mingdan uch yuz besh qaysi yozuv?", "Какая запись означает две целых триста пять тысячных?", 'Which notation means two and three hundred five thousandths?'),
    frames: [bi("Butun qism: 2", "Целая часть: 2", 'Whole-number part: 2'), bi("Mingdan qism: 305/1000", "Дробная часть: 305/1000", 'Fractional part: 305/1000'), bi("Yozuv: ?", "Запись: ?", 'Notation: ?')],
    options: [bi('2,305', '2,305', '2.305'), bi('2,035', '2,035', '2.035'), bi('2305', '2305', '2305')], correctIndex: 0,
    feedback: [
      bi("To'g'ri. 2 — butun; 3 — o'ndan; 0 — yuzdan; 5 — mingdan.", "Верно. 2 — целые; 3 — десятые; 0 — сотые; 5 — тысячные.", 'Correct. 2 is the whole number, 3 is in tenths, 0 in hundredths and 5 in thousandths.'),
      bi("Bu ikki butun mingdan o'ttiz besh.", "Это две целых тридцать пять тысячных.", 'That is two and thirty-five thousandths.'),
      bi("Vergul yo'q, shuning uchun bu butun son.", "Запятой нет, поэтому это целое число.", 'There is no decimal point, so this is a whole number.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Ikki butun, uch o'ndan, nol yuzdan, besh mingdan xonasida turibdi.", "Верно. Два в целых, три в десятых, ноль в сотых, пять в тысячных.", 'Correct. Two is the whole number, three is in tenths, zero in hundredths and five in thousandths.'),
      bi("Bu ikki butun mingdan o'ttiz besh. Uch yuzdan xonasiga tushib qolgan.", "Это две целых тридцать пять тысячных. Цифра три оказалась в сотых.", 'That is two and thirty-five thousandths. The digit three has moved into the hundredths place.'),
      bi("Vergul yo'q, shuning uchun bu ikki ming uch yuz besh butun soni.", "Запятой нет, поэтому это целое число две тысячи триста пять.", 'There is no decimal point, so this is the whole number two thousand three hundred five.'),
    ],
    proof: bi("2 305/1000 ↔ 2,305", "2 305/1000 ↔ 2,305", '2 305/1000 ↔ 2.305'),
    audio: { intro: {
      uz: ["Sensor qiymatining butun qismi ikkiga teng.", "Kasr qismi mingdan uch yuz besh deb o'qiladi.", "Ikki butun mingdan uch yuz beshga mos yozuvni tanlang yoki kuzating."],
      ru: ["Целая часть показания датчика равна двум.", "Дробная часть читается как триста пять тысячных.", "Выбери запись для двух целых трёхсот пяти тысячных или просто наблюдай."],
      en: ['The whole-number part of the sensor reading is two.', 'The fractional part is read as three hundred five thousandths.', 'Choose the notation for two and three hundred five thousandths, or simply observe.'],
    }, on_correct: bi("To'g'ri. Sensor kodi ikki vergul uch nol besh.", "Верно. Код датчика два запятая три ноль пять.", 'Correct. The sensor code is two point three zero five.') },
  },
  s14: {
    eyebrow: bi("Yakuniy bosqich", "Финальный этап", 'Final stage'),
    title: bi("Siz o'nli kasrlarni yoza olasiz", "Ты умеешь записывать десятичные дроби", 'You can write decimal fractions'),
    frames: [
      bi("3/10 ↔ 0,3", "3/10 ↔ 0,3", '3/10 ↔ 0.3'),
      bi("10 → 1 xona; 100 → 2; 1000 → 3", "10 → 1 позиция; 100 → 2; 1000 → 3", '10 → 1 place; 100 → 2; 1000 → 3'),
      bi("Vergul: chapda butun, o'ngda ulushlar", "Запятая: слева целое, справа доли", 'Decimal point: whole on the left, fractional parts on the right'),
      bi("7/100 ↔ 0,07; nol joyni saqlaydi", "7/100 ↔ 0,07; ноль сохраняет место", '7/100 ↔ 0.07; zero holds a place'),
      bi("Keyingi: obyektlarni to'plamlarga ajratamiz", "Дальше: распределим объекты по множествам", 'Next: sorting objects into sets'),
    ],
    audio: {
      uz: ["Boshlang'ich sensor kodi o'ndan uch edi. Uning o'nli yozuvi nol vergul uch.", "Maxraj o'n, yuz yoki ming bo'lsa, verguldan keyin mos ravishda bir, ikki yoki uch xona kerak.", "Vergulning chapida butun qism, o'ngida o'ndan, yuzdan va mingdan ulushlar turadi.", "Yuzdan yetti nol vergul nol yetti deb yoziladi. Nol bo'sh xonaning joyini saqlaydi.", "Keyingi darsda obyektlarni umumiy belgilariga ko'ra to'plamlarga ajratamiz."],
      ru: ["Стартовый код датчика был равен трём десятым. Его десятичная запись читается как ноль запятая три.", "При знаменателе десять, сто или тысяча после запятой нужны соответственно одна, две или три позиции.", "Слева от запятой стоит целая часть, справа десятые, сотые и тысячные.", "Семь сотых записываются как ноль запятая ноль семь. Ноль сохраняет пустую позицию.", "На следующем уроке распределим объекты по множествам и общим признакам."],
      en: ['The starting sensor code was three tenths. Its decimal notation is zero point three.', 'With a denominator of ten, one decimal place is needed; with one hundred, two; and with one thousand, three.', 'The whole-number part is to the left of the decimal point, with tenths, hundredths and thousandths to the right.', 'Seven hundredths is written as zero point zero seven. Zero holds the empty place.', 'In the next lesson, we will sort objects into sets according to shared properties.'],
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

const FrameNotes = ({ items = [], frame = 0 }) => {
  const t = useT();
  return <div className="frame-notes">{items.map((item, index) => <div key={index} className={'frame-note ' + (frame >= index ? 'show' : '')}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>;
};

const DecimalStrip = ({ filled = 0, compact = false }) => {
  const t = useT();
  return <div className={'decimal-strip ' + (compact ? 'decimal-strip-compact' : '')} aria-label={t(bi("O'nta teng qismdan " + filled + " tasi belgilangan", filled + ' из десяти равных частей отмечены', filled + ' of ten equal parts are marked'))}>
    {Array.from({ length: 10 }, (_, index) => <i key={index} className={index < filled ? 'decimal-active' : ''}/>)}
  </div>;
};

const HundredGrid = ({ filled = 0, compact = false }) => {
  const t = useT();
  return <div className={'hundred-grid ' + (compact ? 'hundred-grid-compact' : '')} aria-label={t(bi("Yuzta teng katakdan " + filled + " tasi belgilangan", filled + ' из ста равных клеток отмечены', filled + ' of one hundred equal squares are marked'))}>
    {Array.from({ length: 100 }, (_, index) => <i key={index} className={index < filled ? 'decimal-active' : ''}/>)}
  </div>;
};

const ThousandDeck = ({ filled = 0, compact = false }) => {
  const t = useT();
  return <div className={'thousand-deck ' + (compact ? 'thousand-deck-compact' : '')} aria-label={t(bi("Mingta teng ulushdan " + filled + " tasi belgilangan", filled + ' из тысячи равных долей отмечены', filled + ' of one thousand equal parts are marked'))}>
    {Array.from({ length: 10 }, (_, sheet) => <div className="thousand-sheet" key={sheet}>
      {Array.from({ length: 100 }, (_, cell) => {
        const index = sheet * 100 + cell;
        return <i key={cell} className={index < filled ? 'decimal-active' : ''}/>;
      })}
    </div>)}
  </div>;
};

const PlaceTable = ({ values = ['', '', '', ''], active = -1, compact = false }) => {
  const t = useT();
  const headers = [bi('Birlar', 'Единицы', 'Ones'), bi("O'ndan", 'Десятые', 'Tenths'), bi('Yuzdan', 'Сотые', 'Hundredths'), bi('Mingdan', 'Тысячные', 'Thousandths')];
  return <div className={'place-table ' + (compact ? 'place-table-compact' : '')}>
    {headers.map((header, index) => <div key={index} className={'place-column ' + (active === index ? 'place-active' : '')}>
      <small>{t(header)}</small><strong>{values[index] === '' ? '·' : values[index]}</strong>
    </div>)}
  </div>;
};

const WholeAndHundredths = ({ whole = 3, filled = 8 }) => {
  const t = useT();
  return <div className="mixed-model" aria-label={t(bi(whole + " ta butun va yuzdan " + filled, whole + ' целых и ' + filled + ' сотых', whole + ' wholes and ' + filled + ' hundredths'))}>
    <div className="whole-units">{Array.from({ length: whole }, (_, index) => <b key={index}>1</b>)}</div>
    <HundredGrid filled={filled} compact/>
  </div>;
};

const MappingCards = ({ frame = 0 }) => {
  const t = useT();
  const rows = [
    bi("Maxraj 10: verguldan keyin 1 xona", 'Знаменатель 10: 1 позиция после запятой', 'Denominator 10: 1 place after the decimal point'),
    bi("Maxraj 100: verguldan keyin 2 xona", 'Знаменатель 100: 2 позиции после запятой', 'Denominator 100: 2 places after the decimal point'),
    bi("Maxraj 1000: verguldan keyin 3 xona", 'Знаменатель 1000: 3 позиции после запятой', 'Denominator 1000: 3 places after the decimal point'),
    bi("Butun qism vergulning chapida", 'Целая часть слева от запятой', 'Whole-number part to the left of the decimal point'),
    bi("Bo'sh xonani nol saqlaydi", 'Пустую позицию сохраняет ноль', 'Zero holds an empty place'),
  ];
  return <div className="mapping-cards">{rows.map((row, index) => <div className={frame >= index ? 'show' : ''} key={index}><b>{index < 3 ? ['10', '100', '1000'][index] : index === 3 ? ',' : '0'}</b><span>{t(row)}</span></div>)}</div>;
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
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack"><Heading c={c} bit={bit}/><FrameNotes items={c.frames} frame={audio.frame}/>{contextVisual && <div className={'attempt-model ' + (hintLevel > 0 ? 'attempt-highlight' : '')}>{contextVisual}</div>}<section className={'question ' + (hintLevel > 0 ? 'attempt-highlight' : '')}><h2>{t(c.question)}</h2>{hintLevel > 0 && <div className="attempt-cue" role="status">{t(bi("Maxrajga qarab verguldan keyingi xonalar sonini tekshiring.", 'Проверь число позиций после запятой по знаменателю.', 'Use the denominator to check the number of places after the decimal point.'))}</div>}<Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved} disabled={!narrationReady}/><FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section></div></Stage>;
}

function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [picked, setPicked] = useState(storedAnswer?.neutralChoice ?? null);
  const pick = (index) => { if (!narrationReady) return; setPicked(index); audio.pushOneOff(t(c.neutral)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: true, attempts: 1, solved: true, neutralChoice: index }); };
  return <Stage screen={screen} audio={audio} onNext={onNext} nextDisabled={picked === null || !narrationReady}><div className="stack hook-stack" data-g4-screen="hook"><Heading c={c} bit="think" hook/><h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2><section className="hook-scene-adapter" data-g4-role="hook-scene"><div className="hook-scene-visual" data-g4-role="visual-frame"><FrameNotes items={c.frames} frame={audio.frame}/><section className="hook-model"><DecimalStrip filled={3}/><div className="model-label"><Frac n="3" d="10" size="lg"/></div></section><div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think"/></div></div></section><section className="question" data-g4-role="answer-card"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} neutral disabled={!narrationReady}/><FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={frame}/><section className="model-card"><DecimalStrip filled={frame >= 1 ? 3 : 0}/><div className={'representation-row ' + (frame >= 2 ? 'show' : '')}><span><Frac n="3" d="10" size="lg"/></span><b>↔</b><span className={frame >= 3 ? 'decimal-ready' : ''}>{frame >= 3 ? t(bi('0,3', '0,3', '0.3')) : t(bi('0,?', '0,?', '0.?'))}</span></div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s2; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  const values = [frame >= 2 ? '0' : '', frame >= 3 ? '3' : '', '', ''];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={frame}/><section className="model-card"><div className="decimal-code">0<span>{t(bi(',', ',', '.'))}</span>3</div><PlaceTable values={values} active={frame >= 3 ? 1 : frame >= 2 ? 0 : -1}/></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s3; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  const values = frame >= 3 ? ['0', '0', '7', ''] : ['', '', '', ''];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={frame}/><section className="model-card decimal-model-split"><HundredGrid filled={frame >= 1 ? 7 : 0}/><PlaceTable values={values} active={frame >= 3 ? 2 : -1}/></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s4; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  const values = frame >= 3 ? ['0', '0', '4', '6'] : ['', '', '', ''];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={frame}/><section className="model-card decimal-model-split"><ThousandDeck filled={frame >= 1 ? 46 : 0}/><PlaceTable values={values} active={frame >= 3 ? 3 : -1}/></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={frame}/><section className="model-card"><div className="strip-stack"><DecimalStrip filled={10} compact/><DecimalStrip filled={10} compact/><DecimalStrip filled={frame >= 1 ? 3 : 0} compact/></div><div className={'representation-row ' + (frame >= 2 ? 'show' : '')}><span>2</span><b>|</b><span><Frac n="3" d="10"/></span><b>↔</b><span className={frame >= 3 ? 'decimal-ready' : ''}>{frame >= 3 ? t(bi('2,3', '2,3', '2.3')) : t(bi('2,?', '2,?', '2.?'))}</span></div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  const values = [frame >= 1 ? '5' : '', frame >= 2 ? '3' : '', frame >= 2 ? '0' : '', frame >= 3 ? '8' : ''];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={frame}/><section className="model-card"><div className="decimal-code">5<span>{t(bi(',', ',', '.'))}</span>308</div><PlaceTable values={values} active={frame === 1 ? 0 : frame === 2 ? 2 : frame >= 3 ? 3 : -1}/></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen7({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s7; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><FrameNotes items={c.frames} frame={audio.frame}/><section className="rule-card"><MappingCards frame={audio.frame}/></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen8(props) { return <ChoiceExercise {...props} renderVisual={() => <div className="model-card decimal-test-model"><DecimalStrip filled={6} compact/><PlaceTable compact/></div>}/>; }
function Screen9(props) { return <ChoiceExercise {...props} renderVisual={() => <div className="model-card decimal-test-model"><HundredGrid filled={4} compact/><PlaceTable compact/></div>}/>; }
function Screen10(props) { return <ChoiceExercise {...props} renderVisual={() => <div className="model-card decimal-test-model"><ThousandDeck filled={23} compact/><PlaceTable compact/></div>}/>; }
function Screen11(props) { return <ChoiceExercise {...props} renderVisual={() => <div className="model-card decimal-test-model"><WholeAndHundredths/><PlaceTable values={['3', '', '', '']} compact/></div>}/>; }
function Screen12(props) { const t = useT(); return <ChoiceExercise {...props} bit="awkward" visual={<div className="model-card decimal-test-model"><div className="bit-error"><span>5/100</span><b>→ {t(bi('0,5', '0,5', '0.5'))}</b></div><PlaceTable compact/></div>}/>; }
function Screen13(props) { return <ChoiceExercise {...props} renderVisual={() => <div className="model-card decimal-test-model"><div className="sensor-parts"><span>2</span><span><Frac n="305" d="1000"/></span><b>→ ?</b></div><PlaceTable values={['2', '', '', '']} compact/></div>}/>; }

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
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const title = { uz: "O'nli yozuv ustasi", ru: 'Мастер десятичной записи', en: 'Decimal Notation Master' }; const reflectionOptions = [{ uz: 'Model bilan tekshiraman', ru: 'Проверю по модели', en: 'I will check with a model' }, { uz: 'Qoida va birlikni tekshiraman', ru: 'Проверю правило и единицу', en: 'I will check the rule and unit' }, { uz: 'Teskari amal bilan tekshiraman', ru: 'Проверю обратным действием', en: 'I will use the inverse operation' }]; const chooseReflection = (index) => { if (!narrationReady || titleClaimed) return; setReflectionChoice(index); onAnswer({ ...(storedAnswer ?? {}), screenIdx: screen, stage: null, reflectionChoice: index, titleClaimed: false }); audio.pushOneOff(t(reflectionOptions[index])); }; const claimTitle = () => { if (!narrationReady || reflectionChoice === null || titleClaimed) return; setTitleClaimed(true); onAnswer({ screenIdx: screen, stage: null, question: t({ uz: 'Tanlangan tekshiruv', ru: 'Выбранная проверка', en: 'Chosen check' }), options: reflectionOptions.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: reflectionChoice, studentAnswer: t(reflectionOptions[reflectionChoice]), correct: true, firstTry: true, attempts: 1, solved: true, reflectionChoice, titleClaimed: true }); }; const frame = audio.frame; const complete = frame >= 4;
  const takeaways = [
    { label: bi("O'ndan ulush", "Десятые", 'Tenths'), value: bi('3/10 ↔ 0,3', '3/10 ↔ 0,3', '3/10 ↔ 0.3') },
    { label: bi("Yuzdan ulush", "Сотые", 'Hundredths'), value: bi('7/100 ↔ 0,07', '7/100 ↔ 0,07', '7/100 ↔ 0.07') },
    { label: bi("Mingdan ulush", "Тысячные", 'Thousandths'), value: bi('46/1000 ↔ 0,046', '46/1000 ↔ 0,046', '46/1000 ↔ 0.046') },
    { label: bi("Xona xaritasi", "Карта разрядов", 'Place-value map'), value: bi('10 · 100 · 1000', '10 · 100 · 1000', '10 · 100 · 1000') },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={titleClaimed ? finishLesson : undefined} nextDisabled={!titleClaimed} finish><div className="stack"><section className="finale-heading"><span>◆ {t(bi("YAKUNIY BOSQICH", "ФИНАЛЬНЫЙ ЭТАП", 'FINAL STAGE'))}</span><h1>{t(c.title)}</h1><p>{t(bi("Oddiy kasr yozuvini o'nli yozuv va xona jadvali bilan bog'ladik.", "Мы связали обыкновенную дробь с десятичной записью и таблицей разрядов.", 'We connected common fractions with decimal notation and the place-value chart.'))}</p></section><FrameNotes items={c.frames} frame={frame}/><section className="finale-main"><div className="finale-payoff"><small>{t(bi("BOSHLANG'ICH MISSIYA YECHIMI", "РЕШЕНИЕ СТАРТОВОЙ МИССИИ", 'STARTING MISSION SOLUTION'))}</small><DecimalStrip filled={frame >= 1 ? 3 : 0} compact/><div className={'finale-answer ' + (frame >= 1 ? 'show' : '')}><Frac n="3" d="10"/> ↔ {t(bi('0,3', '0,3', '0.3'))}</div></div><div className="finale-takeaways">{takeaways.map((item, index) => <div className={'finale-takeaway ' + (frame >= index ? 'show' : '')} key={t(item.label)}><b>{index + 1}</b><span><small>{t(item.label)}</small><strong>{t(item.value)}</strong></span></div>)}</div></section><section className="finale-bottom"><div className={'finale-bridge finale-bridge-venn ' + (complete ? 'show' : '')}><span className="venn-bridge-icon" aria-hidden="true"><i/><i/></span><small>{t(bi("KEYINGI MAVZU", "СЛЕДУЮЩАЯ ТЕМА", 'NEXT TOPIC'))}</small><strong>{t(bi("Obyektlarni to'plamlarga ajratish", "Распределение объектов по множествам", 'Sorting objects into sets'))}</strong></div><ReflectionPanel choices={reflectionOptions} choice={reflectionChoice} onChoose={chooseReflection} disabled={!narrationReady || titleClaimed}/><G4FinalTitleReward ready={narrationReady} titleClaimed={titleClaimed} reflectionChoice={reflectionChoice} onClaim={claimTitle} title={title} answers={answers}/></section></div></Stage>;
}

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars24({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
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
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars24 preview]', payload);
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
  .hook-scene-visual>.frame-notes{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}
  .hook-scene-visual>.frame-notes .frame-note{min-height:42px;padding:4px;grid-template-columns:22px minmax(0,1fr);gap:3px}
  .hook-scene-visual>.frame-notes .frame-note>b{width:21px;height:21px}
  .hook-scene-visual>.frame-notes .frame-note span{font-size:8px;line-height:1.12}
  .hook-scene-visual>.hook-model{min-height:0!important;padding:3px!important;gap:2px!important;overflow:hidden}
  .hook-scene-visual>.hook-model .decimal-strip{min-height:50px!important}
  .hook-scene-visual>.hook-model .model-label{padding:2px 7px;font-size:11px}
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
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}
.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{height:100%;min-height:0;overflow:hidden;display:grid;align-content:center;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;opacity:0;transform:translateY(7px)}.feedback.open{opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{font-size:13px;line-height:1.45}.caption{position:static;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:proof-in .35s ease both}.frac{display:inline-flex;min-width:25px;flex-direction:column;align-items:center;vertical-align:middle;color:inherit;font:800 1em/1 'Source Serif 4',Georgia,serif}.frac i{width:100%;height:2px;margin:2px 0;border-radius:2px;background:currentColor}.frac-lg{font-size:1.35em}.hook-model,.whole-card,.rule-card,.finale-payoff{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}
.lesson-root button:focus-visible,.lesson-root input:focus-visible,.lesson-root input[type='range']:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.frame-notes{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px}.frame-note{min-height:54px;padding:9px 11px;border-radius:14px;display:grid;grid-template-columns:26px 1fr;align-items:center;gap:8px;opacity:.12;transform:translateY(7px);color:${T.ink2};background:rgba(255,255,255,.86);box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.55);transition:opacity .38s ease,transform .38s ease,background .38s ease}.frame-note.show{color:${T.navy};background:${T.cyanSoft}}.frame-note>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.frame-note span{font-size:11px;font-weight:800;line-height:1.3}
.decimal-strip{width:min(620px,96%);min-height:108px;margin:0 auto;display:grid;grid-template-columns:repeat(10,1fr);overflow:hidden;border-radius:18px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.decimal-strip i{min-width:0;border-right:2px solid rgba(23,59,82,.18);background:#F4F5F1;transition:background .42s ease,transform .42s ease}.decimal-strip i:last-child{border-right:0}.decimal-strip i.decimal-active,.hundred-grid i.decimal-active,.thousand-sheet i.decimal-active{background:linear-gradient(145deg,#46B8C5,${T.cyan});animation:decimal-cell-in .38s ease both}.decimal-strip-compact{min-height:46px;border-radius:11px}
.hundred-grid{width:min(280px,88%);aspect-ratio:1;margin:0 auto;display:grid;grid-template-columns:repeat(10,1fr);overflow:hidden;border-radius:14px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.hundred-grid i{border-right:1px solid rgba(23,59,82,.11);border-bottom:1px solid rgba(23,59,82,.11);transition:background .32s ease}.hundred-grid-compact{width:min(150px,48vw);border-radius:10px}
.thousand-deck{width:min(590px,96%);margin:0 auto;display:grid;grid-template-columns:repeat(5,1fr);gap:7px}.thousand-sheet{aspect-ratio:1;display:grid;grid-template-columns:repeat(10,1fr);overflow:hidden;border-radius:7px;background:#F4F5F1;box-shadow:inset 0 0 0 2px rgba(23,59,82,.14)}.thousand-sheet i{border-right:1px solid rgba(23,59,82,.07);border-bottom:1px solid rgba(23,59,82,.07);transition:background .3s ease}.thousand-deck-compact{width:min(310px,86%);gap:4px}.thousand-deck-compact .thousand-sheet{border-radius:4px}
.place-table{width:min(620px,100%);margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.place-column{min-width:0;overflow:hidden;border-radius:14px;display:grid;background:#F8F8F4;text-align:center;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.48);transition:transform .35s ease,background .35s ease}.place-column small{min-height:34px;padding:7px 4px;color:${T.ink2};background:${T.cyanSoft};font-size:9px;font-weight:900;text-transform:uppercase}.place-column strong{min-height:55px;display:grid;place-items:center;color:${T.navy};font:900 25px 'JetBrains Mono',monospace}.place-column.place-active{transform:translateY(-3px);background:${T.accentSoft};box-shadow:0 14px 26px -20px rgba(255,91,53,.75)}.place-table-compact .place-column small{min-height:28px;font-size:8px}.place-table-compact .place-column strong{min-height:40px;font-size:19px}
.representation-row,.sensor-parts{padding:11px 14px;border-radius:15px;display:flex;align-items:center;justify-content:center;gap:13px;opacity:.12;transform:translateY(7px);color:${T.navy};background:${T.cyanSoft};font:900 20px 'JetBrains Mono',monospace;transition:.4s ease}.representation-row .decimal-ready{padding:6px 10px;border-radius:10px;color:#fff;background:${T.accent};animation:decimal-pop .35s ease both}.decimal-code{padding:8px;text-align:center;color:${T.navy};font:900 clamp(30px,6vw,54px) 'JetBrains Mono',monospace}.decimal-code span{color:${T.accent};animation:comma-pulse .8s ease-in-out both}.decimal-model-split,.decimal-test-model{display:grid;align-items:center;gap:12px}.decimal-model-split{grid-template-columns:minmax(220px,.8fr) minmax(300px,1.2fr)}.decimal-test-model{grid-template-columns:minmax(170px,.7fr) minmax(300px,1.3fr)}.strip-stack{display:grid;gap:7px}.mixed-model{display:flex;align-items:center;justify-content:center;gap:12px}.whole-units{display:flex;gap:7px}.whole-units b{width:43px;height:43px;border-radius:12px;display:grid;place-items:center;color:#fff;background:${T.navy};font:900 18px 'JetBrains Mono',monospace}.mapping-cards{display:grid;gap:8px}.mapping-cards>div{min-height:48px;padding:8px 11px;border-radius:14px;display:grid;grid-template-columns:52px 1fr;align-items:center;gap:9px;opacity:.12;transform:translateY(6px);background:#F8F8F4;transition:.38s ease}.mapping-cards>div.show{background:${T.cyanSoft}}.mapping-cards b{padding:7px;border-radius:9px;color:#fff;background:${T.cyan};text-align:center;font:900 11px 'JetBrains Mono',monospace}.mapping-cards span{font-size:12px;font-weight:850}.sensor-parts{opacity:1;transform:none}.bit-error{flex-wrap:wrap}
.finale-bridge-venn{grid-template-columns:42px 1fr;column-gap:10px;align-items:center}.finale-bridge-venn>.venn-bridge-icon{grid-row:1/3}.finale-bridge-venn>small,.finale-bridge-venn>strong{grid-column:2}.venn-bridge-icon{width:42px;height:30px;position:relative;display:block}.venn-bridge-icon i{width:28px;height:28px;position:absolute;top:1px;border:2px solid #98E1E5;border-radius:50%;background:rgba(22,143,163,.28)}.venn-bridge-icon i:first-child{left:0}.venn-bridge-icon i:last-child{right:0;border-color:#FFE284;background:rgba(255,226,132,.24)}
.hook-model{display:grid;place-items:center;gap:12px;background:linear-gradient(135deg,#E5F5F6,#FFF)}.fraction-model{width:min(620px,94%);margin:0 auto;display:grid;gap:10px}.fraction-bar{height:112px;display:grid;overflow:hidden;border-radius:18px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.fraction-bar i{min-width:0;border-right:2px solid rgba(23,59,82,.18);background:#F4F5F1;transition:background .45s ease,transform .45s ease}.fraction-bar i:last-child{border-right:0}.fraction-bar i.cyan{background:#46B8C5}.fraction-bar i.lime{background:#95C93D}.fraction-bar i.removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.12),rgba(255,91,53,.12) 7px,rgba(255,91,53,.42) 7px,rgba(255,91,53,.42) 14px)}.fraction-bar i.merged{background:linear-gradient(135deg,#168FA3,#95C93D)}.fraction-bar.whole i{border-right:0}.fraction-model.compact .fraction-bar{height:48px;border-radius:11px}.model-label{justify-self:center;padding:8px 13px;border-radius:12px;color:#173B52;background:#E5F5F6;font:900 16px "JetBrains Mono",monospace}.state-note,.formula-card,.result-chip{padding:12px 15px;border-radius:14px;opacity:.12;transform:translateY(7px);transition:.4s ease;text-align:center}.state-note{color:#227A53;background:#E7F3EC;font-size:13px;font-weight:850}.formula-card{color:#FFF;background:#173B52;font:900 17px "JetBrains Mono",monospace}.result-chip{justify-self:center;color:#FFF;background:#FF5B35;font:900 20px "JetBrains Mono",monospace}.show{opacity:1!important;transform:none!important}.tokens{display:flex;align-items:center;justify-content:center;gap:8px;color:#50616D;font-size:12px;font-weight:800}.tokens i{width:28px;height:28px;border-radius:9px;background:#95C93D;animation:token-pop .4s ease both}.tokens i:nth-child(2){animation-delay:.1s}.tokens i:nth-child(3){animation-delay:.2s}.rule-card,.whole-card{display:grid;gap:12px}.rule-line{padding:13px;border-radius:14px;opacity:.12;transform:translateY(6px);color:#173B52;background:#E5F5F6;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.rule-line.accent{color:#FFF;background:#173B52}.wrong-formula{padding:12px;position:relative;opacity:.12;color:#A96F13;background:#FFF5D9;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.wrong-formula::after{content:"";position:absolute;left:28%;right:28%;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.tank-model{width:min(560px,96%);margin:0 auto;display:grid;place-items:center;gap:10px}.tank-shell{width:min(360px,82%);height:210px;position:relative;padding:16px 16px 14px;border:5px solid ${T.navy};border-top:0;border-radius:0 0 34px 34px;background:rgba(255,255,255,.72);filter:drop-shadow(0 14px 16px rgba(${T.shadowBase},.13))}.tank-body{height:100%;overflow:hidden;border-radius:6px 6px 22px 22px;display:flex;flex-direction:column-reverse;background:#F4F5F1}.tank-body i{min-height:0;flex:1;border-top:2px solid rgba(23,59,82,.18);transition:background .38s ease,opacity .38s ease,transform .38s ease}.tank-body i:first-child{border-top:0}.tank-body i.tank-fill{background:linear-gradient(90deg,#46B8C5,${T.cyan})}.tank-body i.tank-outline{box-shadow:inset 0 0 0 3px ${T.lime}}.tank-body i.tank-removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.16),rgba(255,91,53,.16) 8px,rgba(255,91,53,.48) 8px,rgba(255,91,53,.48) 16px);animation:tank-out .42s ease both}.tank-shell.undivided .tank-body i{border-top-color:transparent}.tank-spout{width:76px;height:19px;position:absolute;left:-63px;top:-4px;border:5px solid ${T.navy};border-right:0;border-radius:13px 0 0 13px;background:#fff}.tank-handle{width:70px;height:90px;position:absolute;right:-46px;top:44px;border:12px solid ${T.navy};border-left:0;border-radius:0 38px 38px 0}.tank-model.compact .tank-shell{width:190px;height:92px;padding:7px;border-width:3px;border-radius:0 0 18px 18px}.tank-model.compact .tank-spout{width:32px;height:10px;left:-27px;border-width:3px}.tank-model.compact .tank-handle{width:34px;height:45px;right:-24px;top:18px;border-width:7px}.state-grid{margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.state-grid span{min-height:52px;padding:9px;border-radius:13px;display:grid;place-items:center;opacity:.12;transform:translateY(6px);color:${T.navy};background:${T.cyanSoft};text-align:center;font-size:11px;font-weight:850;transition:.38s ease}.boundary-grid{padding:18px;border-radius:22px;display:grid;grid-template-columns:1fr 1fr;gap:12px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.boundary-grid>div{padding:10px;border-radius:16px;opacity:.12;transform:translateY(6px);background:#F8F8F4;transition:.4s ease}.boundary-grid>.state-note{grid-column:1/-1}.hospital-model{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:14px;background:${T.cyanSoft}}.hospital-model>span{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;color:#fff;background:${T.accent};font:900 27px 'JetBrains Mono',monospace}.nl-arrow.back{border-right:0;border-left:3px solid ${T.accent};border-radius:14px 0 0 0}.nl-arrow.back::after{right:auto;left:-5px;border-left:0;border-right:8px solid ${T.accent}}.number-line{height:150px;position:relative;padding:54px 7% 0}.nl-track{height:4px;position:relative;border-radius:4px;background:#173B52}.nl-tick{width:2px;height:18px;position:absolute;top:-7px;background:#87949D}.nl-tick span{position:absolute;top:20px;left:50%;transform:translateX(-50%);font:800 12px "JetBrains Mono",monospace}.nl-dot{width:44px;height:38px;position:absolute;top:27px;transform:translateX(-50%);border-radius:12px;display:grid;place-items:center;color:#FFF;font:900 11px "JetBrains Mono",monospace;z-index:2;animation:dot-pop .35s ease both}.nl-dot.cyan{background:#168FA3}.nl-dot.lime{background:#95C93D}.nl-arrow{height:22px;position:absolute;top:84px;border-top:3px solid #FF5B35;border-right:3px solid #FF5B35;border-radius:0 14px 0 0;animation:arrow-grow .45s ease both}.nl-arrow::after{content:"";position:absolute;right:-5px;top:-7px;border-left:8px solid #FF5B35;border-top:5px solid transparent;border-bottom:5px solid transparent}.model-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.model-choices>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:26px 1fr;align-items:center;gap:6px;background:#FFF;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choices>div>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 10px "JetBrains Mono",monospace}.bit-error{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;color:#A96F13;background:#FFF5D9;font:900 19px "JetBrains Mono",monospace}.bit-error b{position:relative}.bit-error b::after{content:"";position:absolute;left:-5px;right:-5px;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.energy-model{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px}.energy-model>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;background:#FFF}.energy-model>div>span{font-size:23px}.energy-model>strong{text-align:center;color:#FF5B35;font-size:23px}.finale-heading{padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{color:#FF5B35;font:900 9px "JetBrains Mono",monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:#173B52;font:750 clamp(21px,3vw,28px)/1.08 "Source Serif 4",Georgia,serif}.finale-heading p{margin-top:4px!important;color:#50616D;font-size:11px}.finale-main{display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);gap:10px}.finale-payoff{display:grid;align-content:center;gap:8px}.finale-payoff>small{color:#168FA3;font-size:9px;font-weight:900;letter-spacing:.09em}.finale-answer{padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:#227A53;background:#E7F3EC;text-align:center;font:900 13px "JetBrains Mono",monospace;transition:.42s ease}.finale-takeaways{display:grid;gap:6px}.finale-takeaway{min-height:42px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px 1fr;align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:.42s ease}.finale-takeaway.show{background:#E5F5F6}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 9px "JetBrains Mono",monospace}.finale-takeaway span{display:grid;gap:2px;font-size:11px;font-weight:800}.finale-takeaway small{color:#168FA3;font-size:8px;text-transform:uppercase}.finale-takeaway strong{color:#173B52;font-family:"JetBrains Mono",monospace}.finale-bottom{display:grid;grid-template-columns:1.2fr .8fr;gap:10px}.finale-bridge{padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#FFF;background:#173B52;transition:.42s ease}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px "Source Serif 4",Georgia,serif}.finale-reward{min-height:100px;position:relative;overflow:hidden;padding:12px 70px 11px 52px;border-radius:17px;display:grid;align-content:center;color:#FFF;background:linear-gradient(135deg,#234B62,#173B52)}.finale-reward>div:nth-child(2){display:grid;gap:3px}.finale-reward small{color:#98E1E5;font-size:8px;font-weight:900}.finale-reward strong{font:750 14px "Source Serif 4",Georgia,serif}.finale-reward b{color:#FFE284;font:900 11px "JetBrains Mono",monospace}.finale-reward>.g1-char{position:absolute;right:2px;bottom:-5px;width:67px;height:84px}.finale-medal{position:absolute;left:10px;top:50%;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#173B52;background:#95C93D}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:#FF5B35}.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;justify-self:end;color:${T.accent};background:${T.accentSoft};cursor:pointer;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.marker-control{width:min(620px,94%);padding:10px 13px;border-radius:14px;display:grid;gap:7px;color:${T.navy};background:${T.cyanSoft};font:850 12px 'Manrope',sans-serif}.free-marker{width:100%;min-height:44px;margin:0;accent-color:${T.accent};cursor:pointer}.nl-dot.free{top:102px;background:${T.navy};animation-duration:.4s}.attempt-model{border-radius:20px;transition:box-shadow .32s ease,background .32s ease}.attempt-highlight{box-shadow:0 0 0 3px rgba(22,143,163,.38),0 14px 26px -20px rgba(22,143,163,.8)!important;background:rgba(229,245,246,.72)!important}.attempt-cue{padding:9px 12px;border-radius:12px;color:${T.cyan};background:${T.cyanSoft};font-size:12px;font-weight:850;animation:attempt-cue-in .3s ease both}.stack{animation-duration:.5s}.caption{animation:caption-in .32s ease both}.formula-card{transition-duration:.32s!important}.result-chip{transition-duration:.22s!important}
@keyframes decimal-cell-in{from{opacity:.3;transform:scale(.7)}}@keyframes decimal-pop{from{opacity:0;transform:scale(.72)}}@keyframes comma-pulse{to{transform:translateY(-2px)}}@keyframes tank-out{from{opacity:0;transform:translateY(-10px)}}@keyframes caption-in{from{opacity:0;transform:translateY(5px)}}@keyframes attempt-cue-in{from{opacity:0;transform:translateY(5px)}}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(5px)}}@keyframes token-pop{from{opacity:0;transform:scale(.45)}}@keyframes dot-pop{from{opacity:0;transform:translateX(-50%) scale(.55)}}@keyframes arrow-grow{from{transform:scaleX(0);transform-origin:left}}@keyframes bit-move{to{transform:translateY(-2px) rotate(2deg)}}@keyframes pulse{to{transform:scale(1.07)}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.hook-model,.whole-card,.rule-card,.question{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.frame-notes{grid-template-columns:1fr 1fr}.frame-note{min-height:48px;padding:7px}.decimal-strip{min-height:70px}.decimal-strip-compact{min-height:36px}.decimal-model-split,.decimal-test-model{grid-template-columns:1fr}.hundred-grid{width:min(210px,72vw)}.hundred-grid-compact{width:min(125px,38vw)}.thousand-deck{width:min(340px,96%);gap:4px}.place-column small{font-size:7px}.place-column strong{min-height:45px;font-size:20px}.mixed-model{flex-wrap:wrap}.representation-row{gap:8px;font-size:16px}.state-grid{grid-template-columns:1fr 1fr}.boundary-grid{grid-template-columns:1fr}.boundary-grid>.state-note{grid-column:1}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-main,.finale-bottom{gap:8px}.finale-takeaway{min-height:36px}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.state-note,.formula-card,.result-chip,.rule-line,.wrong-formula,.finale-answer,.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}}
.caption-slot{flex:none;min-height:38px;padding:6px 10px;border-radius:11px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:10px;line-height:1.22}.caption-slot.is-visible{visibility:visible}.feedback.feedback-slot{height:76px;min-height:76px;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1}.feedback-bit{width:48px;height:58px;display:block}.feedback-bit .g1-char,.feedback-bit>svg{width:100%;height:100%}.feedback-proof{display:block;margin-top:4px;padding-top:4px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 12px/1.2 'JetBrains Mono',monospace}.feedback-proof small{display:block;font-size:8px;letter-spacing:.1em}.lesson-root{height:100dvh!important;min-height:0!important;overflow:hidden!important}.stage-content{display:flex;flex-direction:column;gap:4px;overflow:hidden!important}.stage-content>.stack{flex:1;min-height:0}.btn-white-accent:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:11px!important;padding-bottom:4px!important}.lesson-root-preview .stage-header{padding-top:52px!important}.progress-track{height:4px!important;margin-bottom:5px!important}.stage-content{padding-top:3px!important;padding-bottom:3px!important}.stage-nav{min-height:52px!important}.stack{gap:4px!important}.heading{min-height:40px!important}.heading h1{font-size:17px!important}.heading .g1-char{width:38px!important;height:48px!important}.question,.model-card,.visual-card,.hook-model,.whole-card,.rule-card,.beat-list{padding:5px!important;border-radius:11px!important}.options{gap:3px!important}.option{min-height:44px!important;padding:4px!important;border-radius:9px!important;font-size:9px!important}.feedback.feedback-slot{height:54px;min-height:54px!important;padding:4px 6px!important;grid-template-columns:32px 1fr!important;gap:4px!important}.feedback-bit{width:31px;height:39px}.feedback p{font-size:9px!important;line-height:1.16!important}.caption-slot{min-height:28px;padding:3px 7px;font-size:8px}.beat-list{gap:3px!important}.beat{min-height:29px!important;padding:3px!important;font-size:8px!important}.btn-white-accent,.btn-ghost{min-height:44px!important;min-width:104px!important;padding:0 8px!important;font-size:11px!important}.finale-main,.finale-bottom{grid-template-columns:1fr 1fr!important;gap:4px!important}}
.strategy-replay{min-height:44px;padding:7px 12px;border:0;border-radius:11px;justify-self:center;color:${T.cyan};background:${T.cyanSoft};cursor:pointer;font-size:11px;font-weight:850}.strategy-replay:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px) and (max-height:700px){.stage-discovery .decimal-model-split{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr)!important;gap:4px!important}.stage-discovery .hundred-grid,.stage-discovery .thousand-deck{width:100%!important}.stage-discovery .thousand-deck{gap:2px!important}.stage-discovery .place-table{gap:3px!important}.stage-discovery .place-column small{min-height:28px;padding:3px 1px}.stage-discovery .place-column strong{min-height:38px}.stage-consolidation .frame-notes{grid-template-columns:repeat(3,minmax(0,1fr))}.stage-consolidation .frame-note{min-height:44px;padding:3px;grid-template-columns:22px 1fr;gap:3px}.stage-consolidation .frame-note>b{width:21px;height:21px}.stage-consolidation .frame-note span{font-size:8px}.stage-consolidation .mapping-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:3px}.stage-consolidation .mapping-cards>div{min-height:44px;padding:3px;grid-template-columns:40px 1fr;gap:3px}.stage-consolidation .mapping-cards>div:last-child{grid-column:1/-1}.stage-consolidation .mapping-cards b{padding:4px;font-size:9px}.stage-consolidation .mapping-cards span{font-size:9px}}
.final-reflection{padding:6px 8px;border-radius:12px;display:grid;gap:5px;background:rgba(255,255,255,.9)}.final-reflection>strong{font:750 12px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button{min-height:44px;padding:4px;border:0;border-radius:9px;display:grid;grid-template-columns:20px 1fr;align-items:center;gap:3px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:8px;font-weight:850}.final-reflection button>span{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}.g4-title-claim:disabled{cursor:not-allowed;opacity:.46}
`;
