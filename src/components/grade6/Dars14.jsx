// ============================================================
// 6 КЛАСС, УРОК 14 «Умножение и деление десятичных дробей»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б3 начинается здесь. Десятичная дробь — та же обыкновенная со
// знаменателем 10, 100, 1000, поэтому правила блока Б2 продолжают работать,
// а меняется только запись: вместо знаменателя за числами следит запятая.
//
// Сцена — кабинет физики: весы, гирьки, мензурка.
// ============================================================

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import {
  T,
  configureLesson,
  registerLesson,
  navLocked,
  tri,
  pickL,
  mt,
  Frac,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  getAudioEngine,
  PREVIEW_START,
  BASE_STYLES,
  Stage,
  Person,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  HintBlock,
  FeedbackBlock,
  FactCard,
  FB_HIST,
  AnimDigits,
  MethodCard,
  HookScreen,
  RevealScreen,
  RuleScreen,
  Classify,
  MultiTask,
  FinalPanel,
  SummaryScreen,
} from './screens.jsx';

const TOTAL_SCREENS = 15;

const LESSON_META = {
  lessonId: 'div_6_14',
  lessonTitle: {
    ru: 'Умножение и деление десятичных дробей',
    uz: "O'nli kasrlarni ko'paytirish va bo'lish",
    en: 'Multiplying and dividing decimals',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 fizika xonasi: 1,25 kg x 4
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 o'nli kasr = maxraji 10 bo'lgan kasr
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 vergul: raqamlar yig'indisi
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: butun kabi ko'paytir, vergul qo'y
  { id: 's_div',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 bo'lish: vergulni surish
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 4,8 : 0,6
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: 10, 100 ga va xato vergul
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_mul',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 ko'paytirish x3
  { id: 's_dv',     type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 bo'lish x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: natija katta yoki kichik
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: fizika tajribasi
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Четыре гирьки на весах', uz: 'Tarozidagi to\'rtta tosh', en: 'Four weights on the scales' },
    lead: {
      ru: 'На уроке физики взвешивают детали. Одна деталь весит 1,25 кг, их четыре.',
      uz: "Fizika darsida detallar tortilyapti. Bitta detal 1,25 kg, ular to'rtta.",
      en: 'In the physics lesson they weigh parts. One part is 1.25 kg and there are four.',
    },
    voice_a: { ru: 'Азиз: выйдет ровно 5 кг.', uz: "Aziz: roppa-rosa 5 kg chiqadi.", en: 'Aziz: it will be exactly 5 kg.' },
    voice_b: { ru: 'Дилноза: с запятой ровно не бывает.', uz: "Dilnoza: vergul bilan roppa-rosa chiqmaydi.", en: 'Dilnoza: with a comma it is never exact.' },
    ask: { ru: 'Сколько покажут весы?', uz: 'Tarozi nechani ko\'rsatadi?', en: 'What will the scales show?' },
    options: [
      { ru: 'Ровно 5 кг', uz: 'Roppa-rosa 5 kg', en: 'Exactly 5 kg' },
      { ru: 'Чуть больше или меньше 5', uz: '5 dan sal ko\'p yoki kam', en: 'A little more or less than 5' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'На уроке физики взвешивают детали. Одна деталь весит одну целую двадцать пять сотых килограмма, а всего их четыре.',
          'Азиз говорит, что выйдет ровно пять килограммов, а Дилноза что с запятой ровно не бывает. Сколько покажут весы? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Fizika darsida detallar tortilyapti. Bitta detal bir butun yigirma besh yuzdan kilogramm, ular esa to'rtta.",
          "Aziz roppa-rosa besh kilogramm chiqadi deydi, Dilnoza esa vergul bilan roppa-rosa chiqmaydi deydi. Tarozi nechani ko'rsatadi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'In the physics lesson they weigh parts. One part is one point two five kilograms and there are four of them.',
          'Aziz says it will be exactly five kilograms, Dilnoza says a decimal is never exact. What will the scales show? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Десятичная — это тоже дробь', uz: "O'nli kasr ham kasr", en: 'A decimal is a fraction too' },
    rows: [
      { dec: '0,4', n: 4, d: 10 },
      { dec: '0,25', n: 25, d: 100 },
      { dec: '1,25', n: 125, d: 100 },
    ],
    done: {
      ru: 'Запятая заменяет знаменатель: один знак после неё — десятые, два знака — сотые.',
      uz: "Vergul maxrajning o'rnini bosadi: undan keyin bitta raqam bo'lsa o'ndanlar, ikkita bo'lsa yuzdanlar.",
      en: 'The comma replaces the denominator: one digit after it means tenths, two digits means hundredths.',
    },
    audio: {
      ru: [
        'Вспомним, что такое десятичная дробь. Ноль целых четыре десятых это четыре десятых.',
        'Ноль целых двадцать пять сотых это двадцать пять сотых. Два знака после запятой значит знаменатель сто.',
        'Одна целая двадцать пять сотых это сто двадцать пять сотых. Запятая просто заменяет знаменатель, поэтому все правила прошлых уроков продолжают работать.',
      ],
      uz: [
        "O'nli kasr nima ekanini eslaymiz. Nol butun to'rt o'ndan bu to'rt o'ndan.",
        "Nol butun yigirma besh yuzdan bu yigirma besh yuzdan. Verguldan keyin ikkita raqam bo'lsa, maxraj yuz demakdir.",
        "Bir butun yigirma besh yuzdan bu bir yuz yigirma besh yuzdan. Vergul shunchaki maxraj o'rnini bosadi, shuning uchun o'tgan darslardagi qoidalar ishlashda davom etadi.",
      ],
      en: [
        'Let us recall what a decimal is. Zero point four is four tenths.',
        'Zero point two five is twenty five hundredths. Two digits after the point mean a denominator of one hundred.',
        'One point two five is one hundred twenty five hundredths. The point simply replaces the denominator, so all the rules from earlier lessons keep working.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Где ставить запятую', uz: 'Vergul qayerga qo\'yiladi', en: 'Where the comma goes' },
    lines: [
      { ru: '1,25 · 4', uz: '1,25 · 4', en: '1.25 · 4' },
      { ru: '125 · 4 = 500', uz: '125 · 4 = 500', en: '125 · 4 = 500' },
      { ru: '2 знака после запятой → 5,00 = 5', uz: "verguldan keyin 2 raqam → 5,00 = 5", en: '2 digits after the point → 5.00 = 5' },
    ],
    done: {
      ru: 'Считаем как целые числа, потом отделяем столько знаков, сколько их было у множителей вместе. Вышло ровно 5 кг — прав был Азиз.',
      uz: "Butun sonlardek hisoblaymiz, keyin ko'paytuvchilardagi raqamlar sonicha ajratamiz. Roppa-rosa 5 kg chiqdi — Aziz haq edi.",
      en: 'Compute as whole numbers, then separate as many digits as the factors had together. Exactly 5 kg — Aziz was right.',
    },
    audio: {
      ru: [
        'Умножать десятичные проще, чем кажется. Сначала забываем про запятую и считаем как целые числа.',
        'Сто двадцать пять умножить на четыре пятьсот.',
        'Теперь возвращаем запятую. У первого множителя два знака после запятой, у второго ни одного, значит отделяем два знака: пять целых ноль сотых, то есть ровно пять. Прав был Азиз.',
      ],
      uz: [
        "O'nli kasrlarni ko'paytirish ko'ringanidan oson. Avval vergulni unutamiz va butun sonlardek hisoblaymiz.",
        "Bir yuz yigirma besh karra to'rt besh yuz.",
        "Endi vergulni qaytaramiz. Birinchi ko'paytuvchida verguldan keyin ikkita raqam, ikkinchisida yo'q, demak ikkita raqam ajratamiz: besh butun nol yuzdan, ya'ni roppa-rosa besh. Aziz haq edi.",
      ],
      en: [
        'Multiplying decimals is easier than it looks. First forget the point and compute with whole numbers.',
        'One hundred twenty five times four is five hundred.',
        'Now bring the point back. The first factor has two digits after the point and the second none, so we separate two digits: five point zero zero, exactly five. Aziz was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Считаем как целые', uz: 'Butun sonlardek hisoblaymiz', en: 'Compute as whole numbers' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '0,3 · 0,4', uz: '0,3 · 0,4', en: '0.3 · 0.4' },
      { ru: '3 · 4 = 12', uz: '3 · 4 = 12', en: '3 · 4 = 12' },
      { ru: '1 знак и 1 знак → 2 знака: 0,12', uz: '1 raqam va 1 raqam → 2 raqam: 0,12', en: '1 digit and 1 digit → 2 digits: 0.12' },
    ],
    demo_note: {
      ru: 'На квадрате видно: три полосы из десяти и четыре из десяти пересеклись в 12 клетках из 100.',
      uz: "Kvadratda ko'rinadi: o'ndan uchta yo'l va o'ndan to'rtta yo'l 100 dan 12 katakda kesishdi.",
      en: 'The square shows it: three strips of ten and four of ten cross in 12 cells out of 100.',
    },
    play_ask: { ru: 'Сколько будет 1,2 · 0,5?', uz: '1,2 · 0,5 nechaga teng?', en: 'What is 1.2 · 0.5?' },
    play_opts: ['6', '0,6', '0,06'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. 12 · 5 = 60, знаков после запятой два, значит 0,60 — это 0,6.',
      uz: "To'g'ri. 12 · 5 = 60, verguldan keyin ikkita raqam, demak 0,60 — bu 0,6.",
      en: 'Right. 12 · 5 = 60 with two digits after the point, so 0.60 which is 0.6.',
    },
    play_wrong: [
      { ru: 'Запятую потеряли: у множителей вместе два знака после неё.', uz: "Vergul yo'qolgan: ko'paytuvchilarda jami ikkita raqam bor.", en: 'The point was lost: the factors have two digits after it together.' },
      null,
      { ru: 'Знаков отделили слишком много: их ровно два, а не три.', uz: "Ortiqcha raqam ajratilgan: ular roppa-rosa ikkita, uchta emas.", en: 'Too many digits separated: there are exactly two, not three.' },
    ],
    audio: {
      intro: {
        ru: 'Способ такой. Умножаем как целые числа, а потом считаем, сколько знаков после запятой было у обоих множителей вместе, и отделяем столько же. Покажу на ноль целых трёх десятых и ноль целых четырёх десятых.',
        uz: "Usul shunday. Butun sonlardek ko'paytiramiz, keyin ikkala ko'paytuvchida verguldan keyin nechta raqam borligini sanaymiz va shuncha raqamni ajratamiz. Nol butun uch o'ndan va nol butun to'rt o'ndan misolida ko'rsataman.",
        en: 'The method is this. Multiply as whole numbers, then count how many digits the factors had after the point together and separate the same number. I will show it on zero point three and zero point four.',
      },
      demo: {
        ru: 'Три умножить на четыре двенадцать. У каждого множителя по одному знаку, вместе два. Отделяем два знака и получаем ноль целых двенадцать сотых.',
        uz: "Uch karra to'rt o'n ikki. Har bir ko'paytuvchida bittadan raqam, jami ikkita. Ikkita raqam ajratamiz va nol butun o'n ikki yuzdan chiqadi.",
        en: 'Three times four is twelve. Each factor has one digit, two together. Separate two digits and get zero point one two.',
      },
      play: {
        ru: 'Теперь ваша очередь. Сколько будет одна целая две десятых умножить на ноль целых пять десятых?',
        uz: "Endi sizning navbatingiz. Bir butun ikki o'ndan karra nol butun besh o'ndan nechaga teng?",
        en: 'Now it is your turn. What is one point two times zero point five?',
      },
      ok: {
        ru: 'Верно. Двенадцать умножить на пять шестьдесят, отделяем два знака и получаем ноль целых шесть десятых.',
        uz: "To'g'ri. O'n ikki karra besh oltmish, ikkita raqam ajratamiz va nol butun olti o'ndan chiqadi.",
        en: 'Right. Twelve times five is sixty, separate two digits and get zero point six.',
      },
      wrong: {
        ru: 'Посчитайте, сколько знаков после запятой у обоих множителей, и отделите столько же.',
        uz: "Ikkala ko'paytuvchida verguldan keyin nechta raqam borligini sanang va shuncha raqamni ajrating.",
        en: 'Count the digits after the point in both factors and separate the same number.',
      },
    },
  },

  s_div: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Деление: сдвигаем запятую', uz: "Bo'lish: vergulni suramiz", en: 'Division: shift the point' },
    lines: [
      { ru: '7,5 : 2,5', uz: '7,5 : 2,5', en: '7.5 ÷ 2.5' },
      { ru: 'умножаем оба на 10: 75 : 25', uz: "ikkalasini 10 ga ko'paytiramiz: 75 : 25", en: 'multiply both by 10: 75 ÷ 25' },
      { ru: '= 3', uz: '= 3', en: '= 3' },
    ],
    done: {
      ru: 'Частное не изменится, если умножить и делимое, и делитель на 10. Это то же основное свойство дроби, только записанное десятичной.',
      uz: "Bo'linuvchi va bo'luvchini 10 ga ko'paytirsak, bo'linma o'zgarmaydi. Bu o'sha kasrning asosiy xossasi, faqat o'nli yozuvda.",
      en: 'The quotient does not change if both the dividend and the divisor are multiplied by 10. It is the same basic property of a fraction, written as a decimal.',
    },
    audio: {
      ru: [
        'С делением поступают хитрее. Делить на дробь с запятой неудобно, поэтому запятую убирают.',
        'Умножаем и делимое, и делитель на десять. Семь целых пять десятых становится семьдесят пять, а два целых пять десятых двадцать пять.',
        'Семьдесят пять разделить на двадцать пять три. Частное не изменилось, потому что оба числа выросли одинаково. Это то же самое основное свойство дроби.',
      ],
      uz: [
        "Bo'lishda ayyorroq ish tutiladi. Vergulli songa bo'lish noqulay, shuning uchun vergulni yo'qotamiz.",
        "Bo'linuvchini ham, bo'luvchini ham o'nga ko'paytiramiz. Yetti butun besh o'ndan yetmish besh bo'ladi, ikki butun besh o'ndan esa yigirma besh.",
        "Yetmish beshni yigirma beshga bo'lsak uch chiqadi. Bo'linma o'zgarmadi, chunki ikkala son bir xil o'sdi. Bu o'sha kasrning asosiy xossasi.",
      ],
      en: [
        'Division is handled with a trick. Dividing by a number with a point is awkward, so the point is removed.',
        'Multiply both the dividend and the divisor by ten. Seven point five becomes seventy five and two point five becomes twenty five.',
        'Seventy five divided by twenty five is three. The quotient did not change because both numbers grew the same way. That is the basic property of a fraction again.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Посчитаем 4,8 : 0,6', uz: '4,8 : 0,6 ni hisoblaymiz', en: 'Let us compute 4.8 ÷ 0.6' },
    lead: { ru: 'У делителя один знак после запятой — умножаем оба числа на 10.', uz: "Bo'luvchida verguldan keyin bitta raqam bor — ikkala sonni 10 ga ko'paytiramiz.", en: 'The divisor has one digit after the point, so multiply both by 10.' },
    steps: [
      { ru: '4,8 · 10 = 48 и 0,6 · 10 = 6', uz: '4,8 · 10 = 48 va 0,6 · 10 = 6', en: '4.8 · 10 = 48 and 0.6 · 10 = 6' },
      { ru: '48 : 6 = 8', uz: '48 : 6 = 8', en: '48 ÷ 6 = 8' },
      { ru: 'проверка: 8 · 0,6 = 4,8', uz: 'tekshiruv: 8 · 0,6 = 4,8', en: 'check: 8 · 0.6 = 4.8' },
    ],
    done: {
      ru: 'Ответ 8. Делитель меньше единицы, поэтому результат вышел больше делимого — как и с обыкновенными дробями.',
      uz: "Javob 8. Bo'luvchi birdan kichik, shuning uchun natija bo'linuvchidan katta chiqdi — oddiy kasrlardagidek.",
      en: 'The answer is 8. The divisor is below one, so the result came out larger than the dividend, just as with common fractions.',
    },
    audio: {
      ru: [
        'Решаем вместе. Четыре целых восемь десятых разделить на ноль целых шесть десятых. У делителя один знак после запятой.',
        'Умножаем оба числа на десять и получаем сорок восемь и шесть.',
        'Сорок восемь разделить на шесть восемь. Проверим умножением: восемь умножить на ноль целых шесть десятых это четыре целых восемь десятых. Сходится.',
      ],
      uz: [
        "Birga yechamiz. To'rt butun sakkiz o'ndanni nol butun olti o'ndanga bo'lamiz. Bo'luvchida verguldan keyin bitta raqam bor.",
        "Ikkala sonni o'nga ko'paytiramiz va qirq sakkiz bilan olti chiqadi.",
        "Qirq sakkizni oltiga bo'lsak sakkiz. Ko'paytirib tekshiramiz: sakkiz karra nol butun olti o'ndan bu to'rt butun sakkiz o'ndan. To'g'ri keldi.",
      ],
      en: [
        'Let us solve it together. Four point eight divided by zero point six. The divisor has one digit after the point.',
        'Multiply both numbers by ten and get forty eight and six.',
        'Forty eight divided by six is eight. Check by multiplying: eight times zero point six is four point eight. It matches.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Запятая едет по разрядам', uz: 'Vergul xonalar bo\'ylab suriladi', en: 'The comma moves across places' },
    rows: [
      { ru: '3,7 · 10 = 37', uz: '3,7 · 10 = 37', en: '3.7 · 10 = 37' },
      { ru: '3,7 · 100 = 370', uz: '3,7 · 100 = 370', en: '3.7 · 100 = 370' },
      { ru: '3,7 : 10 = 0,37', uz: '3,7 : 10 = 0,37', en: '3.7 ÷ 10 = 0.37' },
    ],
    bad_line: { ru: 'ошибка: 0,3 · 0,4 = 1,2', uz: 'xato: 0,3 · 0,4 = 1,2', en: 'mistake: 0.3 · 0.4 = 1.2' },
    done: {
      ru: 'Умножение на 10 двигает запятую вправо, деление — влево. И проверяй прикидкой: 0,3 и 0,4 меньше единицы, значит их произведение тоже меньше.',
      uz: "10 ga ko'paytirish vergulni o'ngga, bo'lish esa chapga suradi. Va chamalab tekshiring: 0,3 va 0,4 birdan kichik, demak ko'paytmasi ham kichik.",
      en: 'Multiplying by 10 moves the comma right, dividing moves it left. And check roughly: 0.3 and 0.4 are below one, so their product is below one too.',
    },
    audio: {
      ru: [
        'Отдельный случай это умножение и деление на десять, сто, тысячу. Считать столбиком не нужно, достаточно передвинуть запятую.',
        'При умножении она едет вправо, при делении влево. Три целых семь десятых умножить на сто это триста семьдесят.',
        'А вот частая ошибка. Ноль целых три десятых умножить на ноль целых четыре десятых пишут как одна целая две десятых. Но оба числа меньше единицы, значит и произведение меньше единицы. Верный ответ ноль целых двенадцать сотых.',
      ],
      uz: [
        "Alohida hol bu o'nga, yuzga, mingga ko'paytirish va bo'lish. Ustunda hisoblash shart emas, vergulni surish kifoya.",
        "Ko'paytirishda u o'ngga, bo'lishda chapga suriladi. Uch butun yetti o'ndan karra yuz bu uch yuz yetmish.",
        "Mana tez-tez uchraydigan xato. Nol butun uch o'ndan karra nol butun to'rt o'ndanni bir butun ikki o'ndan deb yozishadi. Lekin ikkala son ham birdan kichik, demak ko'paytma ham birdan kichik. To'g'ri javob nol butun o'n ikki yuzdan.",
      ],
      en: [
        'A special case is multiplying and dividing by ten, a hundred, a thousand. No long arithmetic is needed, just move the point.',
        'Multiplying moves it right, dividing moves it left. Three point seven times one hundred is three hundred seventy.',
        'And here is a common mistake. Zero point three times zero point four is written as one point two. But both numbers are below one, so the product is below one as well. The right answer is zero point one two.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как считать с запятой', uz: 'Vergul bilan qanday hisoblanadi', en: 'How to compute with decimals' },
    rule_1: {
      ru: 'Умножение: считаем как целые числа и отделяем столько знаков после запятой, сколько их было у множителей вместе.',
      uz: "Ko'paytirish: butun sonlardek hisoblaymiz va ko'paytuvchilardagi raqamlar sonicha verguldan keyin ajratamiz.",
      en: 'Multiplication: compute as whole numbers and separate as many digits after the point as the factors had together.',
    },
    rule_2: {
      ru: 'Деление: умножаем делимое и делитель на 10 или 100, чтобы делитель стал целым. Весы: 1,25 · 4 = 5 ровно, прав был Азиз.',
      uz: "Bo'lish: bo'luvchi butun bo'lishi uchun bo'linuvchi va bo'luvchini 10 yoki 100 ga ko'paytiramiz. Tarozi: 1,25 · 4 = roppa-rosa 5, Aziz haq edi.",
      en: 'Division: multiply the dividend and the divisor by 10 or 100 so that the divisor becomes whole. The scales: 1.25 · 4 = exactly 5, Aziz was right.',
    },
    audio: {
      ru: 'Запомним правило. При умножении считаем как целые числа, а потом отделяем столько знаков после запятой, сколько их было у обоих множителей вместе. При делении умножаем делимое и делитель на десять или на сто, чтобы делитель стал целым, и частное от этого не меняется. Вернёмся к весам. Одна целая двадцать пять сотых умножить на четыре это ровно пять килограммов. Прав был Азиз.',
      uz: "Qoidani eslab qolamiz. Ko'paytirishda butun sonlardek hisoblaymiz, keyin ikkala ko'paytuvchida verguldan keyin nechta raqam bo'lsa, shuncha raqamni ajratamiz. Bo'lishda bo'luvchi butun bo'lishi uchun bo'linuvchi va bo'luvchini o'nga yoki yuzga ko'paytiramiz, bo'linma esa o'zgarmaydi. Taroziga qaytamiz. Bir butun yigirma besh yuzdan karra to'rt bu roppa-rosa besh kilogramm. Aziz haq edi.",
      en: 'Let us remember the rule. For multiplication compute as whole numbers, then separate as many digits after the point as both factors had together. For division multiply the dividend and the divisor by ten or a hundred so the divisor becomes whole, and the quotient stays the same. Back to the scales. One point two five times four is exactly five kilograms. Aziz was right.',
    },
  },

  s_mul: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Умножение с запятой', uz: "Vergul bilan ko'paytirish", en: 'Multiplying decimals' },
    lead: { ru: 'Сначала как целые, потом считай знаки.', uz: 'Avval butun sonlardek, keyin raqamlarni sanang.', en: 'Whole numbers first, then count the digits.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '0,2 · 0,3', uz: '0,2 · 0,3', en: '0.2 · 0.3' },
        opts: ['0,6', '0,06', '6'],
        correct: 1,
        ok: { ru: 'Верно. 2 · 3 = 6, знаков два, значит 0,06.', uz: "To'g'ri. 2 · 3 = 6, raqam ikkita, demak 0,06.", en: 'Right. 2 · 3 = 6 with two digits, so 0.06.' },
        wrong: [
          { ru: 'Отделили только один знак, а у множителей их два.', uz: "Faqat bitta raqam ajratilgan, ko'paytuvchilarda esa ikkita.", en: 'Only one digit was separated, but the factors have two.' },
          null,
          { ru: 'Запятая пропала: оба числа меньше единицы.', uz: "Vergul yo'qolgan: ikkala son ham birdan kichik.", en: 'The point vanished: both numbers are below one.' },
        ],
      },
      {
        q: { ru: '2,5 · 4', uz: '2,5 · 4', en: '2.5 · 4' },
        opts: ['10', '1', '100'],
        correct: 0,
        ok: { ru: 'Верно. 25 · 4 = 100, отделяем один знак: 10,0 — это 10.', uz: "To'g'ri. 25 · 4 = 100, bitta raqam ajratamiz: 10,0 — bu 10.", en: 'Right. 25 · 4 = 100, separate one digit: 10.0 which is 10.' },
        wrong: [
          null,
          { ru: 'Слишком мало: 2,5 больше двух, а множитель 4.', uz: "Juda kam: 2,5 ikkidan katta, ko'paytuvchi esa 4.", en: 'Too small: 2.5 is more than two and the factor is 4.' },
          { ru: 'Знак после запятой отделить забыли.', uz: 'Verguldan keyingi raqamni ajratish unutilgan.', en: 'The digit after the point was not separated.' },
        ],
      },
      {
        q: { ru: '1,5 · 0,2', uz: '1,5 · 0,2', en: '1.5 · 0.2' },
        opts: ['3', '0,3', '0,03'],
        correct: 1,
        ok: { ru: 'Верно. 15 · 2 = 30, знаков два: 0,30 — это 0,3.', uz: "To'g'ri. 15 · 2 = 30, raqam ikkita: 0,30 — bu 0,3.", en: 'Right. 15 · 2 = 30 with two digits: 0.30 which is 0.3.' },
        wrong: [
          { ru: 'Множитель меньше единицы, значит ответ меньше 1,5.', uz: "Ko'paytuvchi birdan kichik, demak javob 1,5 dan kichik.", en: 'The factor is below one, so the answer is less than 1.5.' },
          null,
          { ru: 'Знаков отделили три, а их два.', uz: 'Uchta raqam ajratilgan, ular esa ikkita.', en: 'Three digits were separated instead of two.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на умножение. Считайте как целые, а потом отделяйте знаки.',
        uz: "Ko'paytirish mashqi. Butun sonlardek hisoblang, keyin raqamlarni ajrating.",
        en: 'Multiplication practice. Compute as whole numbers, then separate the digits.',
      },
    },
  },

  s_dv: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Деление с запятой', uz: "Vergul bilan bo'lish", en: 'Dividing decimals' },
    lead: { ru: 'Сделай делитель целым, умножив оба числа.', uz: "Ikkala sonni ko'paytirib, bo'luvchini butun qiling.", en: 'Make the divisor whole by multiplying both numbers.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '3,6 : 0,4', uz: '3,6 : 0,4', en: '3.6 ÷ 0.4' },
        opts: ['9', '0,9', '1,44'],
        correct: 0,
        ok: { ru: 'Верно. 36 : 4 = 9.', uz: "To'g'ri. 36 : 4 = 9.", en: 'Right. 36 ÷ 4 = 9.' },
        wrong: [
          null,
          { ru: 'Делитель меньше единицы, значит частное больше делимого.', uz: "Bo'luvchi birdan kichik, demak bo'linma bo'linuvchidan katta.", en: 'The divisor is below one, so the quotient exceeds the dividend.' },
          { ru: 'Это произведение, а не частное.', uz: "Bu ko'paytma, bo'linma emas.", en: 'That is the product, not the quotient.' },
        ],
      },
      {
        q: { ru: '6 : 0,5', uz: '6 : 0,5', en: '6 ÷ 0.5' },
        opts: ['3', '12', '1,2'],
        correct: 1,
        ok: { ru: 'Верно. 60 : 5 = 12. В шести помещается двенадцать половинок.', uz: "To'g'ri. 60 : 5 = 12. Olti ichiga o'n ikkita yarim sig'adi.", en: 'Right. 60 ÷ 5 = 12. Twelve halves fit into six.' },
        wrong: [
          { ru: 'Это умножение на 0,5, а не деление.', uz: "Bu 0,5 ga ko'paytirish, bo'lish emas.", en: 'That is multiplying by 0.5, not dividing.' },
          null,
          { ru: 'Запятая лишняя: 60 разделить на 5 это 12.', uz: "Vergul ortiqcha: 60 ni 5 ga bo'lsak 12.", en: 'The point is wrong: 60 divided by 5 is 12.' },
        ],
      },
      {
        q: { ru: '4,5 : 10', uz: '4,5 : 10', en: '4.5 ÷ 10' },
        opts: ['45', '0,45', '0,045'],
        correct: 1,
        ok: { ru: 'Верно. При делении на 10 запятая едет влево на один знак.', uz: "To'g'ri. 10 ga bo'lganda vergul chapga bitta raqam suriladi.", en: 'Right. Dividing by 10 moves the point one place left.' },
        wrong: [
          { ru: 'Это умножение на 10, запятая поехала не туда.', uz: "Bu 10 ga ko'paytirish, vergul noto'g'ri tomonga surilgan.", en: 'That is multiplying by 10: the point moved the wrong way.' },
          null,
          { ru: 'На два знака запятая едет при делении на 100.', uz: "Ikki raqamga vergul 100 ga bo'lganda suriladi.", en: 'Two places happen when dividing by 100.' },
        ],
      },
      {
        q: { ru: '1,44 : 1,2', uz: '1,44 : 1,2', en: '1.44 ÷ 1.2' },
        opts: ['1,2', '12', '0,12'],
        correct: 0,
        ok: { ru: 'Верно. 144 : 120 = 1,2. Проверка: 1,2 · 1,2 = 1,44.', uz: "To'g'ri. 144 : 120 = 1,2. Tekshiruv: 1,2 · 1,2 = 1,44.", en: 'Right. 144 ÷ 120 = 1.2. Check: 1.2 · 1.2 = 1.44.' },
        wrong: [
          null,
          { ru: 'Слишком много: делимое чуть больше делителя.', uz: "Juda ko'p: bo'linuvchi bo'luvchidan sal katta.", en: 'Too much: the dividend is only slightly larger than the divisor.' },
          { ru: 'Слишком мало: частное должно быть около единицы.', uz: "Juda kam: bo'linma bir atrofida bo'lishi kerak.", en: 'Too little: the quotient should be around one.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на деление. Сначала избавьтесь от запятой у делителя.',
        uz: "Bo'lish mashqi. Avval bo'luvchidagi verguldan qutuling.",
        en: 'Division practice. First get rid of the point in the divisor.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Больше или меньше первого числа', uz: 'Birinchi sondan katta yoki kichik', en: 'Larger or smaller than the first number' },
    lead: { ru: 'Смотри на второй множитель: меньше 1 — результат уменьшится.', uz: "Ikkinchi ko'paytuvchiga qarang: 1 dan kichik bo'lsa, natija kamayadi.", en: 'Look at the second factor: below 1 makes the result smaller.' },
    bin_a: { ru: 'Больше', uz: 'Kattaroq', en: 'Larger' },
    bin_b: { ru: 'Меньше', uz: 'Kichikroq', en: 'Smaller' },
    cards: [
      { label: '2,5 · 4', bin: 'a' },
      { label: '2,5 · 0,4', bin: 'b' },
      { label: '0,8 · 0,5', bin: 'b' },
      { label: '3,2 · 10', bin: 'a' },
      { label: '1,5 · 0,2', bin: 'b' },
      { label: '0,6 · 5', bin: 'a' },
    ],
    hint: {
      ru: 'Если второй множитель больше единицы, число растёт. Если меньше, уменьшается.',
      uz: "Ikkinchi ko'paytuvchi birdan katta bo'lsa, son o'sadi. Kichik bo'lsa, kamayadi.",
      en: 'If the second factor is above one the number grows, if below one it shrinks.',
    },
    correct_text: {
      ru: 'Верно. Запятая ничего не меняет в этом правиле: всё решает, больше или меньше единицы второй множитель.',
      uz: "To'g'ri. Vergul bu qoidada hech nimani o'zgartirmaydi: hammasini ikkinchi ko'paytuvchining birdan katta yoki kichikligi hal qiladi.",
      en: 'Right. The comma changes nothing here: what matters is whether the second factor is above or below one.',
    },
    audio: {
      intro: {
        ru: 'Разложите произведения по двум корзинам. Считать не обязательно, смотрите на второй множитель.',
        uz: "Ko'paytmalarni ikki savatga ajrating. Hisoblash shart emas, ikkinchi ko'paytuvchiga qarang.",
        en: 'Sort the products into two baskets. No need to compute, just look at the second factor.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Сравни второй множитель с единицей.', uz: "Bu yerga emas. Ikkinchi ko'paytuvchini bir bilan solishtiring.", en: 'Not here. Compare the second factor with one.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: 0,5 · 0,6 = 3,0. Где ошибка?', uz: 'Aziz: 0,5 · 0,6 = 3,0. Xato qayerda?', en: 'Aziz: 0.5 · 0.6 = 3.0. Where is the mistake?' },
        opts: [
          { ru: 'Не отделил два знака после запятой', uz: 'Verguldan keyin ikkita raqam ajratmadi', en: 'He did not separate two digits after the point' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: 'Неверно умножил 5 на 6', uz: "5 ni 6 ga noto'g'ri ko'paytirdi", en: 'He multiplied 5 by 6 wrongly' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 5 · 6 = 30, знаков два, значит 0,30 — это 0,3.', uz: "To'g'ri. 5 · 6 = 30, raqam ikkita, demak 0,30 — bu 0,3.", en: 'Right. 5 · 6 = 30 with two digits, so 0.30 which is 0.3.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: оба числа меньше единицы, а ответ вышел 3.', uz: "Xato bor: ikkala son birdan kichik, javob esa 3 chiqqan.", en: 'There is a mistake: both numbers are below one but the answer is 3.' },
          { ru: 'Умножил он верно, дело в запятой.', uz: "Ko'paytirishni to'g'ri qildi, gap vergulda.", en: 'The multiplication is fine, the point is the problem.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «7,2 : 0,8 меньше 7,2, ведь мы делим». Проверь.', uz: "Dilnoza: «7,2 : 0,8 soni 7,2 dan kichik, axir bo'lyapmiz». Tekshiring.", en: 'Dilnoza: “7.2 ÷ 0.8 is less than 7.2, we are dividing after all.” Check it.' },
        opts: [
          { ru: 'Нет: делитель меньше 1, ответ 9', uz: "Yo'q: bo'luvchi 1 dan kichik, javob 9", en: 'No: the divisor is below 1 and the answer is 9' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Верно, но только для целых', uz: "To'g'ri, lekin faqat butun sonlar uchun", en: 'True, but only for whole numbers' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 72 : 8 = 9, а это больше 7,2.', uz: "To'g'ri. 72 : 8 = 9, bu esa 7,2 dan katta.", en: 'Right. 72 ÷ 8 = 9, which is more than 7.2.' },
        wrong: [
          null,
          { ru: 'В 7,2 помещается много раз по 0,8, значит частное большое.', uz: "7,2 ichiga 0,8 ko'p marta sig'adi, demak bo'linma katta.", en: 'Many 0.8 fit into 7.2, so the quotient is large.' },
          { ru: 'Правило одно для всех чисел: важен размер делителя.', uz: "Qoida hamma sonlar uchun bitta: bo'luvchining kattaligi muhim.", en: 'The rule is the same for all numbers: the size of the divisor matters.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в числе, и в самом правиле.',
        uz: "Birovning yechimini tekshiring. Xato sonda ham, qoidaning o'zida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the number and in the rule itself.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Опыт с деталями', uz: 'Detallar bilan tajriba', en: 'The experiment with parts' },
    lead: { ru: 'Деталь весит 1,25 кг. На весах лежат четыре детали.', uz: "Detal 1,25 kg. Tarozida to'rtta detal turibdi.", en: 'One part weighs 1.25 kg and four are on the scales.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Что покажут весы?', uz: 'Tarozi nechani ko\'rsatadi?', en: 'What do the scales show?' },
        opts: ['5 кг', '4,25 кг', '0,5 кг'],
        correct: 0,
        ok: { ru: 'Верно. 1,25 · 4 = 5.', uz: "To'g'ri. 1,25 · 4 = 5.", en: 'Right. 1.25 · 4 = 5.' },
        wrong: [
          null,
          { ru: 'Здесь сложили, а надо умножить.', uz: "Bu yerda qo'shilgan, kerak bo'lgani ko'paytirish.", en: 'These were added, but multiplication is needed.' },
          { ru: 'Слишком мало: одна деталь и то тяжелее.', uz: "Juda kam: bitta detalning o'zi ham og'irroq.", en: 'Too little: even one part weighs more.' },
        ],
      },
      {
        q: { ru: 'Сколько таких деталей войдёт в ящик на 7,5 кг?', uz: "7,5 kg lik quti'ga shunday nechta detal sig'adi?", en: 'How many such parts fit in a 7.5 kg box?' },
        opts: ['6', '9', '3'],
        correct: 0,
        ok: { ru: 'Верно. 7,5 : 1,25 = 750 : 125 = 6.', uz: "To'g'ri. 7,5 : 1,25 = 750 : 125 = 6.", en: 'Right. 7.5 ÷ 1.25 = 750 ÷ 125 = 6.' },
        wrong: [
          null,
          { ru: 'Многовато: девять деталей весят больше 11 кг.', uz: "Ko'p: to'qqiz detal 11 kg dan ortiq bo'ladi.", en: 'Too many: nine parts weigh over 11 kg.' },
          { ru: 'Мало: три детали это меньше 4 кг.', uz: "Kam: uchta detal 4 kg dan kam.", en: 'Too few: three parts are under 4 kg.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про опыт. Деталь весит одну целую двадцать пять сотых килограмма.',
        uz: "Tajriba haqida masala. Detal bir butun yigirma besh yuzdan kilogramm.",
        en: 'An experiment problem. One part weighs one point two five kilograms.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 7,
        q: { ru: 'Реши 4,2 : 0,6. Набери ответ.', uz: '4,2 : 0,6 ni yeching. Javobni tering.', en: 'Solve 4.2 ÷ 0.6. Type the answer.' },
        hint: { ru: 'Умножь оба числа на 10: получится 42 : 6.', uz: "Ikkala sonni 10 ga ko'paytiring: 42 : 6 chiqadi.", en: 'Multiply both by 10 to get 42 ÷ 6.' },
        hint_audio: { ru: 'Умножьте оба числа на десять, получится сорок два разделить на шесть.', uz: "Ikkala sonni o'nga ko'paytiring, qirq ikkini oltiga bo'lish chiqadi.", en: 'Multiply both numbers by ten to get forty two divided by six.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Сколько будет 0,7 · 0,8?', uz: '0,7 · 0,8 nechaga teng?', en: 'What is 0.7 · 0.8?' },
        opts: ['5,6', '0,56', '0,056', '56'],
        wrong: [
          { ru: 'Запятую сдвинули только на один знак, а нужно на два.', uz: 'Vergul bitta raqamga surilgan, kerak bo\'lgani ikkita.', en: 'The point moved one place instead of two.' },
          null,
          { ru: 'Знаков три, а у множителей их два.', uz: "Uchta raqam, ko'paytuvchilarda esa ikkita.", en: 'Three digits, but the factors have two.' },
          { ru: 'Запятая потерялась совсем.', uz: "Vergul butunlay yo'qolgan.", en: 'The point disappeared entirely.' },
        ],
        correct: { ru: 'Верно. 7 · 8 = 56, знаков два: 0,56.', uz: "To'g'ri. 7 · 8 = 56, raqam ikkita: 0,56.", en: 'Right. 7 · 8 = 56 with two digits: 0.56.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Что происходит с числом при умножении на 100?', uz: "100 ga ko'paytirganda son bilan nima bo'ladi?", en: 'What happens to a number when you multiply by 100?' },
        opts: [
          { ru: 'Запятая едет влево на 2 знака', uz: 'Vergul chapga 2 raqamga suriladi', en: 'The point moves 2 places left' },
          { ru: 'Появляется два нуля после запятой', uz: 'Verguldan keyin ikkita nol paydo bo\'ladi', en: 'Two zeros appear after the point' },
          { ru: 'Запятая едет вправо на 2 знака', uz: "Vergul o'ngga 2 raqamga suriladi", en: 'The point moves 2 places right' },
          { ru: 'Ничего не меняется', uz: "Hech nima o'zgarmaydi", en: 'Nothing changes' },
        ],
        wrong: [
          { ru: 'Влево запятая едет при делении.', uz: "Chapga vergul bo'lishda suriladi.", en: 'The point moves left when dividing.' },
          { ru: 'Нули появляются не после запятой, а перед ней.', uz: 'Nollar verguldan keyin emas, oldin paydo bo\'ladi.', en: 'Zeros appear before the point, not after.' },
          null,
          { ru: 'Число растёт в сто раз, значит запись меняется.', uz: "Son yuz barobar o'sadi, demak yozuv o'zgaradi.", en: 'The number grows a hundred times, so the notation changes.' },
        ],
        correct: { ru: 'Верно. 3,7 · 100 = 370.', uz: "To'g'ri. 3,7 · 100 = 370.", en: 'Right. 3.7 · 100 = 370.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Зачем при делении умножают оба числа на 10?', uz: "Bo'lishda ikkala son nega 10 ga ko'paytiriladi?", en: 'Why are both numbers multiplied by 10 in division?' },
        opts: [
          { ru: 'Чтобы делитель стал целым', uz: "Bo'luvchi butun bo'lishi uchun", en: 'To make the divisor whole' },
          { ru: 'Чтобы ответ стал больше', uz: 'Javob kattalashishi uchun', en: 'To make the answer larger' },
          { ru: 'Чтобы избавиться от делимого', uz: "Bo'linuvchidan qutulish uchun", en: 'To get rid of the dividend' },
          { ru: 'Так принято', uz: 'Shunday odat', en: 'It is just a custom' },
        ],
        wrong: [
          null,
          { ru: 'Ответ не меняется: оба числа выросли одинаково.', uz: "Javob o'zgarmaydi: ikkala son bir xil o'sdi.", en: 'The answer does not change: both grew equally.' },
          { ru: 'Делимое никуда не девается.', uz: "Bo'linuvchi hech qayerga ketmaydi.", en: 'The dividend does not go anywhere.' },
          { ru: 'Причина есть: с целым делителем считать проще.', uz: "Sabab bor: butun bo'luvchi bilan hisoblash oson.", en: 'There is a reason: a whole divisor is easier to work with.' },
        ],
        correct: { ru: 'Верно. Частное при этом не меняется — это основное свойство дроби.', uz: "To'g'ri. Bo'linma esa o'zgarmaydi — bu kasrning asosiy xossasi.", en: 'Right. The quotient stays the same: that is the basic property of a fraction.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Тетрадь стоит 2,5 тысячи сум. Сколько стоят 6 тетрадей?', uz: 'Daftar 2,5 ming so\'m turadi. 6 ta daftar qancha turadi?', en: 'A notebook costs 2.5 thousand. What do 6 notebooks cost?' },
        opts: ['8,5', '12', '1,5', '15'],
        wrong: [
          { ru: 'Здесь сложили, а надо умножить.', uz: "Bu yerda qo'shilgan, kerak bo'lgani ko'paytirish.", en: 'These were added, but multiplication is needed.' },
          { ru: 'Это 2 умножить на 6, а копейки потерялись.', uz: "Bu 2 karra 6, verguldan keyingi qism yo'qolgan.", en: 'That is 2 times 6: the decimal part was lost.' },
          { ru: 'Слишком мало: одна тетрадь уже 2,5.', uz: "Juda kam: bitta daftarning o'zi 2,5.", en: 'Too little: one notebook alone is 2.5.' },
          null,
        ],
        correct: { ru: 'Верно. 25 · 6 = 150, отделяем один знак: 15,0.', uz: "To'g'ri. 25 · 6 = 150, bitta raqam ajratamiz: 15,0.", en: 'Right. 25 · 6 = 150, separate one digit: 15.0.' },
      },
    ],
    audio: {
      intro: {
        ru: 'Финальная проверка. Пять заданий на весь урок. Первое с набором числа, остальные с выбором.',
        uz: 'Yakuniy tekshiruv. Butun darsga beshta topshiriq. Birinchisida son teriladi, qolganlarida tanlanadi.',
        en: 'The final check. Five tasks covering the whole lesson. The first needs a typed number, the rest are multiple choice.',
      },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Right.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' },
    },
    fact: {
      ru: 'Десятичные дроби ввёл в математику Джамшид аль-Каши, работавший в обсерватории Улугбека в Самарканде. В книге 1427 года он считал с ними так же, как мы сегодня, за полтора века до Европы.',
      uz: "O'nli kasrlarni matematikaga Samarqanddagi Ulug'bek rasadxonasida ishlagan Jamshid al-Koshiy kiritgan. U 1427 yilgi kitobida ular bilan xuddi bizdek hisoblagan, Yevropadan bir yarim asr oldin.",
      en: 'Decimal fractions were introduced by Jamshid al-Kashi, who worked at Ulugh Beg’s observatory in Samarkand. In his book of 1427 he computed with them just as we do, a century and a half before Europe.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Десятичные дроби ввёл в математику Джамшид аль Каши, работавший в обсерватории Улугбека в Самарканде. В книге тысяча четыреста двадцать седьмого года он считал с ними так же, как мы сегодня, за полтора века до Европы.',
      uz: "Bilasizmi? O'nli kasrlarni matematikaga Samarqanddagi Ulug'bek rasadxonasida ishlagan Jamshid al Koshiy kiritgan. Ming to'rt yuz yigirma yettinchi yilgi kitobida u ular bilan xuddi bizdek hisoblagan, Yevropadan bir yarim asr oldin.",
      en: 'Did you know? Decimal fractions were introduced by Jamshid al Kashi, who worked at Ulugh Beg observatory in Samarkand. In his book of fourteen twenty seven he computed with them just as we do, a century and a half before Europe.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Десятичные дроби', uz: "Matematika · O'nli kasrlar", en: 'Mathematics · Decimals' },
    heading: { ru: 'Умножение и деление', uz: "Ko'paytirish va bo'lish", en: 'Multiplying and dividing' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'умножаем как целые, потом ставим запятую', uz: "butun kabi ko'paytiramiz, keyin vergul qo'yamiz", en: 'multiply as whole numbers, then place the point' },
    brief_2: { ru: 'знаков столько же, сколько у множителей вместе', uz: "raqamlar soni ko'paytuvchilardagidek", en: 'as many digits as the factors had together' },
    brief_3: { ru: 'при делении делаем делитель целым', uz: "bo'lishda bo'luvchini butun qilamiz", en: 'in division make the divisor whole' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Запятая', uz: 'Vergul', en: 'The point' },
    memo_a1: { ru: 'заменяет знаменатель 10, 100, 1000', uz: '10, 100, 1000 maxrajlar o\'rnini bosadi', en: 'stands for denominators 10, 100, 1000' },
    memo_q2: { ru: 'Умножение на 10', uz: "10 ga ko'paytirish", en: 'Times 10' },
    memo_a2: { ru: 'запятая едет вправо', uz: "vergul o'ngga suriladi", en: 'the point moves right' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'потерять или сдвинуть запятую не туда', uz: 'vergulni yo\'qotish yoki noto\'g\'ri surish', en: 'losing or misplacing the point' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'При умножении считаем как целые числа и отделяем столько знаков, сколько их было у множителей вместе. При делении умножаем оба числа так, чтобы делитель стал целым.',
        'Весы: одна целая двадцать пять сотых умножить на четыре это ровно пять килограммов.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Ko'paytirishda butun sonlardek hisoblaymiz va ko'paytuvchilardagi raqamlar sonicha ajratamiz. Bo'lishda esa bo'luvchi butun bo'lishi uchun ikkala sonni ko'paytiramiz.",
        "Tarozi: bir butun yigirma besh yuzdan karra to'rt bu roppa-rosa besh kilogramm.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'For multiplication compute as whole numbers and separate as many digits as the factors had together. For division multiply both numbers so the divisor becomes whole.',
        'The scales: one point two five times four is exactly five kilograms.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Запятая в конце', uz: 'Usul. Vergul oxirida', en: 'Method. The point comes last' },
    m1_steps: {
      ru: ['Забудь про запятую и умножь как целые', 'Сосчитай знаки после запятой у обоих множителей', 'Отдели столько же знаков в ответе'],
      uz: ["Vergulni unuting va butun sonlardek ko'paytiring", "Ikkala ko'paytuvchida verguldan keyingi raqamlarni sanang", 'Javobda shuncha raqamni ajrating'],
      en: ['Forget the point and multiply as whole numbers', 'Count the digits after the point in both factors', 'Separate the same number of digits in the answer'],
    },
    m1_no: {
      ru: 'При делении сначала делают делитель целым: умножают оба числа на 10 или 100.',
      uz: "Bo'lishda avval bo'luvchi butun qilinadi: ikkala son 10 yoki 100 ga ko'paytiriladi.",
      en: 'In division you first make the divisor whole: multiply both numbers by 10 or 100.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кабинет физики. На хуке вопрос, в итоге ответ.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d14wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d14wall)"/>

    {/* Плакат и полка с приборами */}
    <g opacity="0.8">
      <rect x="14" y="12" width="72" height="52" rx="3" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <path d="M22 52 L38 30 L50 42 L64 22 L78 38" fill="none" stroke="#019ACB" strokeWidth="2"/>
      <rect x="300" y="16" width="86" height="6" rx="2" fill="#C9A472"/>
      <rect x="308" y="0" width="14" height="16" rx="2" fill="#DCEDF5" stroke="#C9A472"/>
      <rect x="330" y="4" width="12" height="12" rx="2" fill="#F5C77E"/>
      <rect x="350" y="2" width="16" height="14" rx="2" fill="#8FBF7F"/>
    </g>

    {/* Весы: чаша с деталями и шкала со стрелкой */}
    <g>
      <rect x="126" y="96" width="148" height="16" rx="4" fill="#8E8578"/>
      <rect x="150" y="60" width="100" height="38" rx="5" fill="#E5DAC6" stroke="#B08A57" strokeWidth="2"/>
      {[162, 186, 210, 234].map((dx) => (
        <g key={dx}>
          <rect x={dx} y="66" width="18" height="26" rx="3" fill="#7ECBE6" stroke="#019ACB"/>
          <rect x={dx + 4} y="62" width="10" height="6" rx="2" fill="#019ACB"/>
        </g>
      ))}
      {/* Шкала: деления есть, числа НЕТ — вопрос остаётся открытым */}
      <circle cx="200" cy="126" r="20" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        return <path key={a} d={`M${200 + 15 * Math.cos(r)} ${126 + 15 * Math.sin(r)} L${200 + 19 * Math.cos(r)} ${126 + 19 * Math.sin(r)}`} stroke="#C9C7C2" strokeWidth="1.6"/>;
      })}
      <g className="d14-needle">
        <path d="M200 126 v-14" stroke="#FF4F28" strokeWidth="2.2" strokeLinecap="round"/>
      </g>
      <circle cx="200" cy="126" r="3" fill="#3B3730"/>
    </g>

    {/* Мензурка и линейка на столе */}
    <g>
      <path d="M60 96 h30 v34 q0 6 -6 6 h-18 q-6 0 -6 -6 Z" fill="#DCEDF5" stroke="#C9A472" strokeWidth="1.6"/>
      <path d="M60 112 h30 M60 120 h22 M60 128 h30" stroke="#C9A472" strokeWidth="1"/>
      <path d="M62 118 h26 v12 q0 4 -4 4 h-18 q-4 0 -4 -4 Z" fill="#7ECBE6" opacity="0.6"/>
    </g>
    <g>
      <rect x="292" y="126" width="84" height="10" rx="2" fill="#FBF3D6" stroke="#C9A472"/>
      {[300, 310, 320, 330, 340, 350, 360, 370].map((lx) => <path key={lx} d={`M${lx} 126 v5`} stroke="#C9A472" strokeWidth="1"/>)}
    </g>

    {/* Дети у стола */}
    <Person x={40} ground={140} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={360} ground={140} head={12} shirt="#F5C77E" hair="#5A4636"/>
    <rect x="0" y="140" width="400" height="14" fill="#D2A96F"/>
  </svg>
);

// Итог: на шкале ровно 5, слева запись умножения.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g>
      <rect x="120" y="18" width="160" height="16" rx="4" fill="#8E8578"/>
      {[132, 168, 204, 240].map((dx) => (
        <rect key={dx} x={dx} y="4" width="26" height="14" rx="3" fill="#7ECBE6" stroke="#019ACB"/>
      ))}
      <circle cx="200" cy="60" r="22" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <path d="M200 60 v-16" stroke="#FF4F28" strokeWidth="2.4" strokeLinecap="round"/>
      <circle cx="200" cy="60" r="3" fill="#3B3730"/>
    </g>
    <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
      <text x="70" y="56" textAnchor="middle" fontSize="14">1,25 · 4</text>
      <text x="330" y="56" textAnchor="middle" fontSize="20">5</text>
      <text x="330" y="74" textAnchor="middle" fontSize="11" fill="#8A8883">kg</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Квадрат сотых: столбцы и строки пересекаются — модель умножения десятичных.
const HundredGrid = ({ cols, rows, showRows = true, size = 'mid' }) => (
  <span className={'d14-grid d14-grid-' + size}>
    {Array.from({ length: 100 }, (_, i) => {
      const r = Math.floor(i / 10);
      const c = i % 10;
      const inCol = c < cols;
      const inRow = showRows && r < rows;
      const cls = inCol && inRow ? 'both' : (inCol ? 'col' : (inRow ? 'row' : ''));
      return <i key={i} className={cls}/>;
    })}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d14-line d14-fade' + (on ? ' d14-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d14-stage">
        {c.rows.map((r, i) => (
          <span key={r.dec} className={'d14-pairline d14-fade' + (step >= i ? ' d14-on' : '')}>
            <b className="d14-dec">{r.dec}</b>
            <span className="d14-op">=</span>
            <Frac n={r.n} d={r.d} size="mid"/>
          </span>
        ))}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: 1,25 · 4 в столбик, запятая возвращается на место.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d14-stage">
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        <span className={'d14-scale d14-fade' + (step >= 2 ? ' d14-on' : '')}>
          {[1, 2, 3, 4].map((i) => <i key={i}/>)}
          <b>5</b>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const DivBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_div;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d14-stage">
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        <span className={'d14-shift d14-fade' + (step >= 1 ? ' d14-on' : '')}>
          <b className="d14-dec">7,5</b><span className="d14-op">→</span><b className="d14-dec d14-dec-ok">75</b>
          <span className="d14-gap"/>
          <b className="d14-dec">2,5</b><span className="d14-op">→</span><b className="d14-dec d14-dec-ok">25</b>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d14-stage">
        {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
        <span className={'d14-fade' + (step >= 1 ? ' d14-on' : '')}>
          <b className="d14-res">8</b>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Граница: запятая едет по разрядам, и прикидка ловит ошибку.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d14-stage">
        {c.rows.map((r, i) => (
          <span key={i} className={'d14-pair d14-pair-move d14-fade' + (step >= (i < 2 ? 0 : 1) ? ' d14-on' : '')}>
            <Line node={t(r)} on/>
          </span>
        ))}
        <span className={'d14-pair d14-pair-bad d14-fade' + (step >= 2 ? ' d14-on' : '')}>
          <Line node={t(c.bad_line)} on/>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-tip fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ЭКРАН 4 — «сначала показали, потом сам»
// ============================================================
const ToolScreen = ({ screen, totalScreens, onNext, onPrev, onAnswer, storedAnswer }) => {
  const c = CONTENT.s_tool;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_tool_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'play' : 'demo');
  const [shown, setShown] = useState(0);
  const [picked, setPicked] = useState(null);
  const firstTryRef = useRef(true);
  const timersRef = useRef([]);
  const solved = picked === c.play_correct;
  const done = shown >= 2;

  const say = (node, id) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(pickL(node, lang), undefined, id);
  };

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (phase !== 'demo' || done) return undefined;
    timersRef.current.push(setTimeout(() => setShown((v) => v + 1), 1400));
    if (shown === 1) timersRef.current.push(setTimeout(() => say(c.audio.demo, 's_tool_demo'), 1600));
    return () => timersRef.current.forEach(clearTimeout);
    /* eslint-disable-next-line */
  }, [phase, shown, done]);

  const toPlay = () => { setPhase('play'); setPicked(null); say(c.audio.play, 's_tool_play'); };

  const answer = (i) => {
    if (solved) return;
    setPicked(i);
    if (i !== c.play_correct) { firstTryRef.current = false; say(c.audio.wrong, 's_tool_wrong'); return; }
    say(c.audio.ok, 's_tool_ok');
    if (onAnswer) {
      onAnswer({
        stage: null, screenIdx: screen, question: pickL(c.play_ask, lang),
        correctAnswer: c.play_opts[c.play_correct], studentAnswer: c.play_opts[i],
        correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true,
      });
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!solved || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d14-banner fade-up delay-1' + (phase === 'play' ? ' d14-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d14-stage d14-stage-tool">
          {phase === 'demo' ? (
            <>
              <HundredGrid cols={3} rows={4} showRows={shown >= 1} size="sm"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d14-verdict' + (done ? ' d14-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={o} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{o}</button>
                ))}
              </div>
              {picked !== null && !solved && <HintBlock show>{mt(t(c.play_wrong[picked] || c.play_ok))}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(c.play_ok))}</p>
                </FeedbackBlock>
              )}
            </>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d14-acts fade-up">
            <button className="d14-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d14-btn d14-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
          </div>
        )}

        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no} active={phase === 'play' ? 3 : shown}/>
      </div>
    </Stage>
  );
};

// ============================================================
// ОБЁРТКИ ЭКРАНОВ
// ============================================================
const ScreenHook = (props) => (
  <HookScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_hook} sceneNode={<HookScene/>}/>
);
const ScreenRecall = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_recall} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <RecallBody step={step}/>}/>
);
const ScreenCore = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_core} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <CoreBody step={step}/>}/>
);
const ScreenTool = (props) => <ToolScreen {...props} totalScreens={TOTAL_SCREENS}/>;
const ScreenDiv = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_div} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <DivBody step={step}/>}/>
);
const ScreenSolve = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_solve} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <SolveBody step={step}/>}/>
);
const ScreenEdge = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_edge} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <EdgeBody step={step}/>}/>
);
const ScreenRule = (props) => (
  <RuleScreen {...props} screenContent={CONTENT.s_rule} totalScreens={TOTAL_SCREENS}
    exampleNode={(
      <div className="d14-stage">
        <HundredGrid cols={3} rows={4} size="sm"/>
        <span className="d14-pairline">
          <b className="d14-dec">0,3</b><span className="d14-op">·</span>
          <b className="d14-dec">0,4</b><span className="d14-op">=</span>
          <b className="d14-dec d14-dec-ok">0,12</b>
        </span>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenMul = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_mul} asideNode={methodAside}/>
);
const ScreenDv = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_dv} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: детали на весах, во втором задании ящик на 7,5 кг.
const TaskFig = ({ idx }) => (
  <div className="d14-task-fig">
    <span className="d14-parts">
      {Array.from({ length: idx >= 1 ? 6 : 4 }, (_, i) => <i key={i}/>)}
    </span>
    <span className="d14-parts-cap">{idx >= 1 ? '7,5 kg' : '1,25 kg'}</span>
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={(it, idx) => <TaskFig idx={idx}/>}/>
);

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_HIST} anim={<AnimDigits/>} text={CONTENT.s_final.fact}/>}/>
);

const SummaryCards = () => {
  const t = useT();
  const c = CONTENT.s14;
  return (
    <div className="frame sm-card">
      <p className="sm-card-h">{t(c.memo_title)}</p>
      <div className="mm-grid">
        {[[c.memo_q1, c.memo_a1], [c.memo_q2, c.memo_a2], [c.memo_q3, c.memo_a3]].map((row, i) => (
          <span className="mm-row" key={i}>
            <span className="mm-q">{t(row[0])}</span>
            <span className="mm-a">{t(row[1])}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const Screen14 = (props) => (
  <SummaryScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s14}
    sceneNode={<FinalScene/>} cards={<SummaryCards/>}/>
);

// ============================================================
// CSS УРОКА
// ============================================================
const LESSON_STYLES = `
.d14-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d14-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d14-stage-tool .d14-line { font-size: clamp(12px, 2vw, 16px); }
.d14-stage-tool .d14-grid-sm i { width: clamp(5px, 1.3vw, 11px); height: clamp(5px, 1.3vw, 11px); }

/* Квадрат сотых */
.d14-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 1px; padding: 2px; border: 2px solid #B08A57; border-radius: 5px; background: #FFFDF7; }
.d14-grid i { display: block; background: #F7F0E2; transition: background-color 400ms linear; }
.d14-grid-mid i { width: clamp(10px, 2.2vw, 17px); height: clamp(10px, 2.2vw, 17px); }
.d14-grid-sm i { width: clamp(7px, 1.6vw, 13px); height: clamp(7px, 1.6vw, 13px); }
.d14-grid i.col { background: #DCEDF5; }
.d14-grid i.row { background: #F5C77E; }
.d14-grid i.both { background: #E8A33C; }

.d14-fade { opacity: 0; transition: opacity 420ms linear; }
.d14-on { opacity: 1; }
.d14-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }
.d14-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 21px); font-weight: 700; color: #8A8883; }
.d14-dec { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 23px); font-weight: 700; color: #494550; }
.d14-dec-ok { color: #1F7A4D; }
.d14-res { font-family: 'JetBrains Mono', monospace; font-size: clamp(24px, 4.6vw, 34px); color: #1F7A4D; }
.d14-pairline, .d14-shift { display: inline-flex; align-items: center; gap: 7px; flex-wrap: wrap; justify-content: center; }
.d14-gap { display: inline-block; width: clamp(10px, 3vw, 26px); }

/* Гирьки на шкале */
.d14-scale { display: inline-flex; align-items: center; gap: 6px; }
.d14-scale i { display: block; width: clamp(16px, 3.4vw, 26px); height: clamp(22px, 4.2vw, 32px); border-radius: 4px; background: #7ECBE6; border: 1px solid #019ACB; }
.d14-scale b { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 4.2vw, 32px); color: #1F7A4D; }

/* Строки экрана границы */
.d14-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d14-pair-move { background: #E7F5FA; border: 1px solid #B6DCEA; }
.d14-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }

/* Задача */
.d14-task-fig { display: flex; flex-direction: column; gap: 6px; align-items: center; }
.d14-parts { display: inline-flex; gap: 5px; }
.d14-parts i { display: block; width: clamp(14px, 3vw, 22px); height: clamp(20px, 3.8vw, 30px); border-radius: 4px; background: #7ECBE6; border: 1px solid #019ACB; }
.d14-parts-cap { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.3vw, 17px); font-weight: 700; color: #8A8883; }

/* Экран 4 */
.d14-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d14-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d14-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d14-verdict-on { opacity: 1; }
.d14-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d14-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d14-btn:disabled { opacity: 0.45; cursor: default; }
.d14-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d14-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: стрелка весов качается и замирает */
.d14-needle { transform-origin: 200px 126px; animation: d14Needle 4600ms ease-in-out infinite; }
@keyframes d14Needle { 0% { transform: rotate(-24deg); } 30% { transform: rotate(8deg); } 55% { transform: rotate(-4deg); } 75%, 100% { transform: rotate(0deg); } }
@media (prefers-reduced-motion: reduce) { .d14-needle { animation: none; } }

@media (max-width: 639.98px) {
  .d14-grid-mid i { width: 9px; height: 9px; }
  .d14-grid-sm i { width: 6px; height: 6px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function DecimalMulDivLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || tri(lang, 'Ученик', "O'quvchi", 'Student');
  configureLesson({
    ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm',
    navLock: false,
  });

  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenDiv, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenMul, ScreenDv, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
  const CurrentScreen = screens[current];

  const finishLesson = () => {
    if (!onFinished) return;
    onFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      answers: answers.filter(Boolean),
    });
  };

  return (
    <LangContext.Provider value={lang}>
      <div className="lesson-root">
        <style>{STYLES}</style>
        {isPreview && (
          <div className="g6-lang-switch">
            {['ru', 'uz', 'en'].map((l) => (
              <button key={l} className={'btn-ghost' + (l === lang ? ' is-on' : '')}
                onClick={() => setPreviewLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        )}
        <CurrentScreen
          screen={current}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          onAnswer={(data) => setAnswers((prev) => { const next = [...prev]; next[current] = data; return next; })}
          onNext={() => setCurrent((v) => Math.min(v + 1, TOTAL_SCREENS - 1))}
          onPrev={() => setCurrent((v) => Math.max(v - 1, 0))}
          onReset={() => { setAnswers([]); setCurrent(0); }}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
