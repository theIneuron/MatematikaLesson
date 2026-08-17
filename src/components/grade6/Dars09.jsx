// ============================================================
// 6 КЛАСС, УРОК 9 «Приведение дробей к общему знаменателю»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок 7 дал основное свойство, урок 8 научил сокращать. Здесь то же
// свойство работает в обратную сторону: дроби расширяют до общей разметки,
// а наименьшую общую разметку даёт НОК из урока 6.
//
// Сцена — кабинет технологии: две ленты одной длины с разной разметкой.
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
  FB_SCI,
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
  lessonId: 'grade6-09',
  lessonTitle: {
    ru: 'Приведение дробей к общему знаменателю',
    uz: 'Kasrlarni umumiy maxrajga keltirish',
    en: 'Bringing fractions to a common denominator',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 tasma: 3/4 yoki 5/6
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 kengaytirish esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 umumiy bo'linma: 12
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: EKUK va qo'shimcha ko'paytuvchi
  { id: 's_easy',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 oson hol: bittasi ikkinchisiga bo'linadi
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 3/8 va 5/12
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: ko'paytma ham umumiy, lekin katta
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_lcd',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 umumiy maxrajni toping x3
  { id: 's_mult',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 qo'shimcha ko'paytuvchi x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: maxraj 12 yoki 24
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: tasmalar
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Две ленты, разная разметка', uz: 'Ikki tasma, har xil belgi', en: 'Two tapes, different marks' },
    lead: {
      ru: 'На уроке технологии две одинаковые ленты. Одна размечена на 4 части, другая на 6.',
      uz: "Texnologiya darsida ikkita bir xil tasma bor. Biri 4 qismga, ikkinchisi 6 qismga bo'lingan.",
      en: 'Two identical tapes in the craft lesson. One is marked into 4 parts, the other into 6.',
    },
    voice_a: { ru: 'Азиз отрезал 3/4 своей ленты.', uz: "Aziz o'z tasmasining 3/4 qismini kesdi.", en: 'Aziz cut 3/4 of his tape.' },
    voice_b: { ru: 'Дилноза отрезала 5/6 своей.', uz: "Dilnoza o'zinikining 5/6 qismini kesdi.", en: 'Dilnoza cut 5/6 of hers.' },
    ask: { ru: 'У кого кусок длиннее?', uz: 'Kimning bo\'lagi uzunroq?', en: 'Whose piece is longer?' },
    options: [
      { ru: 'У Азиза', uz: 'Azizniki', en: 'Aziz' },
      { ru: 'У Дилнозы', uz: 'Dilnozaniki', en: 'Dilnoza' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'На уроке технологии две одинаковые ленты. Одна размечена на четыре части, другая на шесть.',
          'Азиз отрезал три четвёртых своей ленты, Дилноза пять шестых своей. У кого кусок длиннее? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Texnologiya darsida ikkita bir xil tasma bor. Biri to'rt qismga, ikkinchisi olti qismga bo'lingan.",
          "Aziz o'z tasmasining uch to'rtdan qismini kesdi, Dilnoza o'zinikining besh oltidan qismini. Kimning bo'lagi uzunroq? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'Two identical tapes in the craft lesson. One is marked into four parts, the other into six.',
          'Aziz cut three quarters of his tape, Dilnoza five sixths of hers. Whose piece is longer? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Расширение: обратный ход', uz: 'Kengaytirish: teskari yo\'l', en: 'Expanding: the other direction' },
    from: { n: 3, d: 4 },
    to: { n: 9, d: 12 },
    by: 3,
    done: {
      ru: 'Умножили оба числа на 3. Разметка стала мельче, а длина куска прежней.',
      uz: "Ikkala sonni 3 ga ko'paytirdik. Belgilar maydalashdi, bo'lak uzunligi esa o'sha.",
      en: 'We multiplied both numbers by 3. The marks got finer, the piece stayed the same length.',
    },
    audio: {
      ru: [
        'Вспомним основное свойство дроби. Оно работает и в обратную сторону: оба числа можно умножить на одно и то же число.',
        'Три четвёртых. Умножаем и числитель, и знаменатель на три.',
        'Получилось девять двенадцатых. Лента разделена мельче, но отрезанный кусок остался таким же. Сегодня этим приёмом мы будем сравнивать дроби.',
      ],
      uz: [
        "Kasrning asosiy xossasini eslaymiz. U teskari yo'nalishda ham ishlaydi: ikkala sonni bir xil songa ko'paytirish mumkin.",
        "Uch to'rtdan. Surat va maxrajni uchga ko'paytiramiz.",
        "To'qqiz o'n ikkidan chiqdi. Tasma maydaroq bo'lindi, kesilgan bo'lak esa o'sha bo'lib qoldi. Bugun shu usul bilan kasrlarni solishtiramiz.",
      ],
      en: [
        'Let us recall the basic property. It works the other way too: both numbers can be multiplied by the same number.',
        'Three quarters. Multiply the numerator and the denominator by three.',
        'That gives nine twelfths. The tape is divided more finely, but the cut piece is the same. Today we compare fractions with this move.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Общая разметка — 12', uz: 'Umumiy belgi — 12', en: 'A shared scale of 12' },
    a: { n: 3, d: 4, to: { n: 9, d: 12 } },
    b: { n: 5, d: 6, to: { n: 10, d: 12 } },
    done: {
      ru: 'На общей разметке видно сразу: 9/12 меньше, чем 10/12. Длиннее кусок у Дилнозы.',
      uz: "Umumiy belgida darrov ko'rinadi: 9/12 soni 10/12 dan kichik. Bo'lak Dilnozaniki uzunroq.",
      en: 'On a shared scale it is obvious: 9/12 is less than 10/12. Dilnoza has the longer piece.',
    },
    audio: {
      ru: [
        'Четвёртые и шестые доли сравнивать неудобно: клетки разного размера. Нужна общая разметка.',
        'Двенадцать делится и на четыре, и на шесть. Значит, обе ленты можно разметить на двенадцать частей.',
        'Три четвёртых становятся девятью двенадцатыми, пять шестых десятью двенадцатыми. Теперь клетки одинаковые, и видно, что у Дилнозы кусок длиннее.',
      ],
      uz: [
        "To'rtdan va oltidan ulushlarni solishtirish noqulay: katakchalar har xil. Umumiy belgi kerak.",
        "O'n ikki soni to'rtga ham, oltiga ham bo'linadi. Demak, ikkala tasmani ham o'n ikki qismga belgilash mumkin.",
        "Uch to'rtdan to'qqiz o'n ikkidan bo'ladi, besh oltidan esa o'n o'n ikkidan. Endi katakchalar bir xil va Dilnozaning bo'lagi uzunroq ekani ko'rinadi.",
      ],
      en: [
        'Quarters and sixths are hard to compare: the cells differ in size. A shared scale is needed.',
        'Twelve divides by four and by six. So both tapes can be marked into twelve parts.',
        'Three quarters becomes nine twelfths, five sixths becomes ten twelfths. The cells match now, and Dilnoza clearly has the longer piece.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'НОК знаменателей', uz: 'Maxrajlarning EKUKi', en: 'The LCM of the denominators' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_a: { n: 1, d: 2, to: { n: 3, d: 6 }, by: 3 },
    demo_b: { n: 1, d: 3, to: { n: 2, d: 6 }, by: 2 },
    demo_lcm: 6,
    demo_note: {
      ru: 'НОК(2, 3) = 6. Дополнительный множитель у первой дроби 3, у второй 2.',
      uz: "EKUK(2, 3) = 6. Qo'shimcha ko'paytuvchi birinchi kasrda 3, ikkinchisida 2.",
      en: 'LCM(2, 3) = 6. The extra factor is 3 for the first fraction and 2 for the second.',
    },
    play_ask: { ru: 'Какой общий знаменатель у 2/5 и 1/2?', uz: '2/5 va 1/2 uchun umumiy maxraj qanday?', en: 'What is the common denominator of 2/5 and 1/2?' },
    play_opts: ['7', '10', '20'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. НОК(5, 2) = 10: 2/5 = 4/10, 1/2 = 5/10.',
      uz: "To'g'ri. EKUK(5, 2) = 10: 2/5 = 4/10, 1/2 = 5/10.",
      en: 'Right. LCM(5, 2) = 10: 2/5 = 4/10 and 1/2 = 5/10.',
    },
    play_wrong: [
      { ru: 'Знаменатели складывать нельзя: нужен общий кратный, а не сумма.', uz: "Maxrajlarni qo'shib bo'lmaydi: yig'indi emas, umumiy karrali kerak.", en: 'Denominators are not added: you need a common multiple, not a sum.' },
      null,
      { ru: '20 тоже общий, но не наименьший: числа получатся крупнее нужного.', uz: "20 ham umumiy, lekin eng kichigi emas: sonlar keraksiz kattalashadi.", en: '20 is common too, but not the least: the numbers become bigger than needed.' },
    ],
    audio: {
      intro: {
        ru: 'Способ такой. Берём наименьшее общее кратное знаменателей, для каждой дроби находим дополнительный множитель и умножаем на него оба числа. Покажу на одной второй и одной третьей.',
        uz: "Usul shunday. Maxrajlarning eng kichik umumiy karralisini olamiz, har bir kasr uchun qo'shimcha ko'paytuvchini topamiz va ikkala sonni unga ko'paytiramiz. Bir ikkidan va bir uchdan misolida ko'rsataman.",
        en: 'The method is this. Take the least common multiple of the denominators, find the extra factor for each fraction and multiply both of its numbers by it. I will show it on one half and one third.',
      },
      demo: {
        ru: 'Наименьшее общее кратное двух и трёх шесть. Первую дробь умножаем на три, вторую на два. Получаются три шестых и две шестых.',
        uz: "Ikki va uchning eng kichik umumiy karralisi olti. Birinchi kasrni uchga, ikkinchisini ikkiga ko'paytiramiz. Uch oltidan va ikki oltidan chiqadi.",
        en: 'The least common multiple of two and three is six. Multiply the first fraction by three and the second by two. That gives three sixths and two sixths.',
      },
      play: {
        ru: 'Теперь ваша очередь. Какой общий знаменатель у двух пятых и одной второй?',
        uz: "Endi sizning navbatingiz. Ikki beshdan va bir ikkidan uchun umumiy maxraj qanday?",
        en: 'Now it is your turn. What is the common denominator of two fifths and one half?',
      },
      ok: {
        ru: 'Верно. Наименьшее общее кратное пяти и двух десять.',
        uz: "To'g'ri. Besh va ikkining eng kichik umumiy karralisi o'n.",
        en: 'Right. The least common multiple of five and two is ten.',
      },
      wrong: {
        ru: 'Ищите число, которое делится на оба знаменателя, и берите самое маленькое такое.',
        uz: "Ikkala maxrajga ham bo'linadigan sonni qidiring va eng kichigini oling.",
        en: 'Look for a number divisible by both denominators and take the smallest one.',
      },
    },
  },

  s_easy: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Лёгкий случай', uz: 'Oson hol', en: 'The easy case' },
    a: { n: 1, d: 3, to: { n: 3, d: 9 }, by: 3 },
    b: { n: 5, d: 9 },
    done: {
      ru: 'Если один знаменатель делится на другой, он и есть общий. Вторую дробь трогать не надо.',
      uz: "Agar bir maxraj ikkinchisiga bo'linsa, o'sha umumiy bo'ladi. Ikkinchi kasrga tegish shart emas.",
      en: 'If one denominator divides by the other, it is already the common one. The second fraction stays as it is.',
    },
    audio: {
      ru: [
        'Есть случай, где считать почти нечего. Возьмём одну третью и пять девятых.',
        'Девять делится на три. Значит, девять и есть общий знаменатель.',
        'Одну третью умножаем на три и получаем три девятых. Вторая дробь остаётся как была. Три девятых меньше пяти девятых.',
      ],
      uz: [
        "Deyarli hisoblash kerak bo'lmaydigan hol ham bor. Bir uchdan va besh to'qqizdanni olamiz.",
        "To'qqiz soni uchga bo'linadi. Demak, to'qqizning o'zi umumiy maxraj.",
        "Bir uchdanni uchga ko'paytiramiz va uch to'qqizdan chiqadi. Ikkinchi kasr qanday bo'lsa shunday qoladi. Uch to'qqizdan besh to'qqizdandan kichik.",
      ],
      en: [
        'There is a case with almost nothing to compute. Take one third and five ninths.',
        'Nine divides by three. So nine is already the common denominator.',
        'Multiply one third by three and get three ninths. The second fraction stays. Three ninths is less than five ninths.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Сравним 3/8 и 5/12', uz: '3/8 va 5/12 ni solishtiramiz', en: 'Compare 3/8 and 5/12' },
    lead: { ru: 'Ни один знаменатель не делится на другой — ищем НОК.', uz: "Maxrajlar bir-biriga bo'linmaydi — EKUK ni qidiramiz.", en: 'Neither denominator divides the other, so find the LCM.' },
    steps: [
      { ru: 'НОК(8, 12) = 24', uz: 'EKUK(8, 12) = 24', en: 'LCM(8, 12) = 24' },
      { ru: '3/8 = 9/24, множитель 3', uz: "3/8 = 9/24, ko'paytuvchi 3", en: '3/8 = 9/24, factor 3' },
      { ru: '5/12 = 10/24, множитель 2', uz: "5/12 = 10/24, ko'paytuvchi 2", en: '5/12 = 10/24, factor 2' },
    ],
    done: {
      ru: '9/24 меньше 10/24, значит 3/8 меньше 5/12. Сравнивать можно только на одной разметке.',
      uz: "9/24 soni 10/24 dan kichik, demak 3/8 soni 5/12 dan kichik. Solishtirish faqat bitta belgida mumkin.",
      en: '9/24 is less than 10/24, so 3/8 is less than 5/12. Comparison works only on one shared scale.',
    },
    audio: {
      ru: [
        'Решаем вместе. Три восьмых и пять двенадцатых. Восемь на двенадцать не делится, двенадцать на восемь тоже. Ищем наименьшее общее кратное.',
        'Кратные восьми: восемь, шестнадцать, двадцать четыре. Кратные двенадцати: двенадцать, двадцать четыре. Общее наименьшее двадцать четыре.',
        'Первую дробь умножаем на три, получаем девять двадцать четвёртых. Вторую на два, получаем десять двадцать четвёртых. Значит, три восьмых меньше пяти двенадцатых.',
      ],
      uz: [
        "Birga yechamiz. Uch sakkizdan va besh o'n ikkidan. Sakkiz o'n ikkiga bo'linmaydi, o'n ikki ham sakkizga bo'linmaydi. Eng kichik umumiy karralini qidiramiz.",
        "Sakkizning karralilari: sakkiz, o'n olti, yigirma to'rt. O'n ikkining karralilari: o'n ikki, yigirma to'rt. Umumiysi eng kichigi yigirma to'rt.",
        "Birinchi kasrni uchga ko'paytiramiz, to'qqiz yigirma to'rtdan chiqadi. Ikkinchisini ikkiga, o'n yigirma to'rtdan chiqadi. Demak, uch sakkizdan besh o'n ikkidandan kichik.",
      ],
      en: [
        'Let us solve it together. Three eighths and five twelfths. Eight does not divide by twelve and twelve does not divide by eight. Find the least common multiple.',
        'Multiples of eight: eight, sixteen, twenty four. Multiples of twelve: twelve, twenty four. The least common one is twenty four.',
        'Multiply the first fraction by three to get nine twenty fourths. Multiply the second by two to get ten twenty fourths. So three eighths is less than five twelfths.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Произведение тоже общее, но крупное', uz: "Ko'paytma ham umumiy, lekin katta", en: 'The product works too, but it is bigger' },
    lcm_line: { ru: 'НОК(6, 8) = 24 → 5/6 = 20/24', uz: 'EKUK(6, 8) = 24 → 5/6 = 20/24', en: 'LCM(6, 8) = 24 → 5/6 = 20/24' },
    prod_line: { ru: '6 · 8 = 48 → 5/6 = 40/48', uz: '6 · 8 = 48 → 5/6 = 40/48', en: '6 · 8 = 48 → 5/6 = 40/48' },
    done: {
      ru: 'Оба ответа верные, но 48 придётся потом сокращать. И главное: умножать надо оба числа дроби, а не только знаменатель.',
      uz: "Ikkala javob ham to'g'ri, lekin 48 ni keyin qisqartirishga to'g'ri keladi. Eng muhimi: faqat maxrajni emas, kasrning ikkala sonini ko'paytirish kerak.",
      en: 'Both answers are correct, but 48 will need reducing later. And most important: multiply both numbers of the fraction, not just the denominator.',
    },
    audio: {
      ru: [
        'Общий знаменатель можно получить и проще: перемножить знаменатели. Для шести и восьми выйдет сорок восемь.',
        'Это не ошибка, но числа станут крупнее, и ответ потом придётся сокращать. Наименьшее общее кратное двадцать четыре работает аккуратнее.',
        'А вот настоящая ошибка: умножить только знаменатель. Тогда дробь превратится в другое число. Умножать надо оба числа.',
      ],
      uz: [
        "Umumiy maxrajni osonroq ham olish mumkin: maxrajlarni ko'paytirish. Olti va sakkiz uchun qirq sakkiz chiqadi.",
        "Bu xato emas, lekin sonlar kattalashadi va javobni keyin qisqartirishga to'g'ri keladi. Eng kichik umumiy karrali yigirma to'rt ozodaroq ishlaydi.",
        "Haqiqiy xato esa bu: faqat maxrajni ko'paytirish. Unda kasr boshqa songa aylanadi. Ikkala sonni ham ko'paytirish kerak.",
      ],
      en: [
        'A common denominator can be found more simply: multiply the denominators. For six and eight that gives forty eight.',
        'This is not a mistake, but the numbers grow and the answer will need reducing. The least common multiple, twenty four, is tidier.',
        'The real mistake is multiplying only the denominator. Then the fraction turns into a different number. Both numbers must be multiplied.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как привести к общему знаменателю', uz: 'Umumiy maxrajga qanday keltiriladi', en: 'How to reach a common denominator' },
    rule_1: {
      ru: 'Находим НОК знаменателей. Для каждой дроби делим НОК на её знаменатель — это дополнительный множитель. Умножаем на него и числитель, и знаменатель.',
      uz: "Maxrajlarning EKUKini topamiz. Har bir kasr uchun EKUKni uning maxrajiga bo'lamiz — bu qo'shimcha ko'paytuvchi. Surat va maxrajni unga ko'paytiramiz.",
      en: 'Find the LCM of the denominators. For each fraction divide the LCM by its denominator: that is the extra factor. Multiply both the numerator and the denominator by it.',
    },
    rule_2: {
      ru: 'На общей разметке дроби можно сравнивать. Ленты: 3/4 = 9/12, 5/6 = 10/12, длиннее кусок у Дилнозы.',
      uz: "Umumiy belgida kasrlarni solishtirish mumkin. Tasmalar: 3/4 = 9/12, 5/6 = 10/12, bo'lak Dilnozaniki uzunroq.",
      en: 'On a shared scale fractions can be compared. The tapes: 3/4 = 9/12, 5/6 = 10/12, Dilnoza has the longer piece.',
    },
    audio: {
      ru: 'Запомним правило. Находим наименьшее общее кратное знаменателей. Для каждой дроби делим его на знаменатель и получаем дополнительный множитель, а потом умножаем на этот множитель и числитель, и знаменатель. На общей разметке дроби уже можно сравнивать. Вернёмся к лентам. Три четвёртых это девять двенадцатых, пять шестых это десять двенадцатых. Кусок длиннее у Дилнозы.',
      uz: "Qoidani eslab qolamiz. Maxrajlarning eng kichik umumiy karralisini topamiz. Har bir kasr uchun uni maxrajga bo'lib qo'shimcha ko'paytuvchini olamiz, keyin surat va maxrajni shu ko'paytuvchiga ko'paytiramiz. Umumiy belgida kasrlarni solishtirsa bo'ladi. Tasmalarga qaytamiz. Uch to'rtdan bu to'qqiz o'n ikkidan, besh oltidan bu o'n o'n ikkidan. Bo'lak Dilnozaniki uzunroq.",
      en: 'Let us remember the rule. Find the least common multiple of the denominators. For each fraction divide it by the denominator to get the extra factor, then multiply both the numerator and the denominator by that factor. On a shared scale fractions can be compared. Back to the tapes. Three quarters is nine twelfths, five sixths is ten twelfths. Dilnoza has the longer piece.',
    },
  },

  s_lcd: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди общий знаменатель', uz: 'Umumiy maxrajni toping', en: 'Find the common denominator' },
    lead: { ru: 'Нужно наименьшее число, которое делится на оба знаменателя.', uz: "Ikkala maxrajga bo'linadigan eng kichik son kerak.", en: 'You need the smallest number divisible by both denominators.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Общий знаменатель для 1/4 и 1/6', uz: '1/4 va 1/6 uchun umumiy maxraj', en: 'A common denominator for 1/4 and 1/6' },
        opts: ['10', '12', '24'],
        correct: 1,
        ok: { ru: 'Верно. 12 делится и на 4, и на 6.', uz: "To'g'ri. 12 soni 4 ga ham, 6 ga ham bo'linadi.", en: 'Right. 12 divides by both 4 and 6.' },
        wrong: [
          { ru: 'Знаменатели не складывают: 10 на 4 не делится.', uz: "Maxrajlar qo'shilmaydi: 10 soni 4 ga bo'linmaydi.", en: 'Denominators are not added: 10 does not divide by 4.' },
          null,
          { ru: '24 подходит, но это не наименьшее: 12 меньше.', uz: '24 mos, lekin eng kichigi emas: 12 kichikroq.', en: '24 works, but it is not the least: 12 is smaller.' },
        ],
      },
      {
        q: { ru: 'Общий знаменатель для 2/5 и 3/10', uz: '2/5 va 3/10 uchun umumiy maxraj', en: 'A common denominator for 2/5 and 3/10' },
        opts: ['10', '15', '50'],
        correct: 0,
        ok: { ru: 'Верно. 10 делится на 5, значит 10 и есть общий знаменатель.', uz: "To'g'ri. 10 soni 5 ga bo'linadi, demak 10 umumiy maxraj.", en: 'Right. 10 divides by 5, so 10 is the common denominator.' },
        wrong: [
          null,
          { ru: '15 на 10 не делится.', uz: "15 soni 10 ga bo'linmaydi.", en: '15 does not divide by 10.' },
          { ru: '50 подходит, но лишнее: 10 уже делится на 5.', uz: "50 mos, lekin ortiqcha: 10 allaqachon 5 ga bo'linadi.", en: '50 works, but it is excessive: 10 already divides by 5.' },
        ],
      },
      {
        q: { ru: 'Общий знаменатель для 5/9 и 1/6', uz: '5/9 va 1/6 uchun umumiy maxraj', en: 'A common denominator for 5/9 and 1/6' },
        opts: ['15', '18', '54'],
        correct: 1,
        ok: { ru: 'Верно. НОК(9, 6) = 18.', uz: "To'g'ri. EKUK(9, 6) = 18.", en: 'Right. LCM(9, 6) = 18.' },
        wrong: [
          { ru: '15 на 9 не делится.', uz: "15 soni 9 ga bo'linmaydi.", en: '15 does not divide by 9.' },
          null,
          { ru: '54 — это произведение, оно подходит, но 18 меньше.', uz: "54 bu ko'paytma, u mos, lekin 18 kichikroq.", en: '54 is the product; it works, but 18 is smaller.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Ищите наименьшее число, которое делится на оба знаменателя.',
        uz: "Mashq. Ikkala maxrajga bo'linadigan eng kichik sonni qidiring.",
        en: 'Practice. Look for the smallest number divisible by both denominators.',
      },
    },
  },

  s_mult: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Дополнительный множитель', uz: "Qo'shimcha ko'paytuvchi", en: 'The extra factor' },
    lead: { ru: 'Дели общий знаменатель на знаменатель дроби.', uz: "Umumiy maxrajni kasr maxrajiga bo'ling.", en: 'Divide the common denominator by the fraction’s denominator.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '3/4 приводим к знаменателю 20. Каким станет числитель?', uz: '3/4 ni 20 maxrajga keltiramiz. Surat nechaga aylanadi?', en: '3/4 goes to denominator 20. What is the numerator?' },
        opts: ['12', '15', '5'],
        correct: 1,
        ok: { ru: 'Верно. 20 : 4 = 5, значит 3 · 5 = 15.', uz: "To'g'ri. 20 : 4 = 5, demak 3 · 5 = 15.", en: 'Right. 20 ÷ 4 = 5, so 3 · 5 = 15.' },
        wrong: [
          { ru: 'На 4 умножать не надо: множитель равен 20 : 4 = 5.', uz: "4 ga ko'paytirish shart emas: ko'paytuvchi 20 : 4 = 5.", en: 'Do not multiply by 4: the factor is 20 ÷ 4 = 5.' },
          null,
          { ru: '5 — это сам множитель, а числитель 3 · 5.', uz: "5 bu ko'paytuvchining o'zi, surat esa 3 · 5.", en: 'Five is the factor itself; the numerator is 3 · 5.' },
        ],
      },
      {
        q: { ru: '2/3 приводим к знаменателю 12. Каким станет числитель?', uz: '2/3 ni 12 maxrajga keltiramiz. Surat nechaga aylanadi?', en: '2/3 goes to denominator 12. What is the numerator?' },
        opts: ['6', '8', '4'],
        correct: 1,
        ok: { ru: 'Верно. 12 : 3 = 4, значит 2 · 4 = 8.', uz: "To'g'ri. 12 : 3 = 4, demak 2 · 4 = 8.", en: 'Right. 12 ÷ 3 = 4, so 2 · 4 = 8.' },
        wrong: [
          { ru: '6 получилось бы при множителе 3, но 12 : 3 = 4.', uz: "6 soni 3 ko'paytuvchida chiqardi, lekin 12 : 3 = 4.", en: 'Six would come from factor 3, but 12 ÷ 3 = 4.' },
          null,
          { ru: '4 — это множитель, а числитель 2 · 4.', uz: "4 bu ko'paytuvchi, surat esa 2 · 4.", en: 'Four is the factor; the numerator is 2 · 4.' },
        ],
      },
      {
        q: { ru: '5/6 приводим к знаменателю 24. Каким станет числитель?', uz: '5/6 ni 24 maxrajga keltiramiz. Surat nechaga aylanadi?', en: '5/6 goes to denominator 24. What is the numerator?' },
        opts: ['20', '24', '10'],
        correct: 0,
        ok: { ru: 'Верно. 24 : 6 = 4, значит 5 · 4 = 20.', uz: "To'g'ri. 24 : 6 = 4, demak 5 · 4 = 20.", en: 'Right. 24 ÷ 6 = 4, so 5 · 4 = 20.' },
        wrong: [
          null,
          { ru: 'Числитель не равен знаменателю: 5/6 меньше единицы.', uz: 'Surat maxrajga teng emas: 5/6 birdan kichik.', en: 'The numerator is not the denominator: 5/6 is less than one.' },
          { ru: '10 вышло бы при множителе 2, но 24 : 6 = 4.', uz: "10 soni 2 ko'paytuvchida chiqardi, lekin 24 : 6 = 4.", en: 'Ten would come from factor 2, but 24 ÷ 6 = 4.' },
        ],
      },
      {
        q: { ru: '7/10 приводим к знаменателю 30. Каким станет числитель?', uz: '7/10 ni 30 maxrajga keltiramiz. Surat nechaga aylanadi?', en: '7/10 goes to denominator 30. What is the numerator?' },
        opts: ['17', '21', '3'],
        correct: 1,
        ok: { ru: 'Верно. 30 : 10 = 3, значит 7 · 3 = 21.', uz: "To'g'ri. 30 : 10 = 3, demak 7 · 3 = 21.", en: 'Right. 30 ÷ 10 = 3, so 7 · 3 = 21.' },
        wrong: [
          { ru: 'К числителю не прибавляют: его умножают на множитель.', uz: "Suratga qo'shilmaydi: u ko'paytuvchiga ko'paytiriladi.", en: 'Nothing is added to the numerator: it is multiplied by the factor.' },
          null,
          { ru: '3 — это множитель, а числитель 7 · 3.', uz: "3 bu ko'paytuvchi, surat esa 7 · 3.", en: 'Three is the factor; the numerator is 7 · 3.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Ищем дополнительный множитель. Делим общий знаменатель на знаменатель дроби и умножаем числитель на результат.',
        uz: "Qo'shimcha ko'paytuvchini qidiramiz. Umumiy maxrajni kasr maxrajiga bo'lamiz va suratni natijaga ko'paytiramiz.",
        en: 'Find the extra factor. Divide the common denominator by the fraction’s denominator and multiply the numerator by the result.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Какой знаменатель общий', uz: 'Qaysi maxraj umumiy', en: 'Which denominator is common' },
    lead: { ru: 'В карточке пара знаменателей. Реши, какое НОК им подходит.', uz: 'Kartochkada maxrajlar juftligi. Ularga qaysi EKUK mos ekanini aniqlang.', en: 'Each card holds a pair of denominators. Decide which LCM fits.' },
    bin_a: { ru: 'НОК = 12', uz: 'EKUK = 12', en: 'LCM = 12' },
    bin_b: { ru: 'НОК = 24', uz: 'EKUK = 24', en: 'LCM = 24' },
    cards: [
      { label: '4 · 6', bin: 'a' },
      { label: '8 · 6', bin: 'b' },
      { label: '3 · 12', bin: 'a' },
      { label: '8 · 3', bin: 'b' },
      { label: '2 · 12', bin: 'a' },
      { label: '8 · 12', bin: 'b' },
    ],
    hint: {
      ru: 'Проверь: делится ли 12 на оба числа. Если нет, бери 24.',
      uz: "Tekshiring: 12 soni ikkala songa bo'linadimi. Bo'linmasa, 24 ni oling.",
      en: 'Check whether 12 divides by both numbers. If not, take 24.',
    },
    correct_text: {
      ru: 'Верно. Пары с восьмёркой требуют 24, потому что 12 на 8 не делится.',
      uz: "To'g'ri. Sakkiz qatnashgan juftliklarga 24 kerak, chunki 12 soni 8 ga bo'linmaydi.",
      en: 'Right. Pairs with eight need 24, because 12 does not divide by 8.',
    },
    audio: {
      intro: {
        ru: 'Разложите карточки по двум корзинам. В каждой карточке пара знаменателей.',
        uz: 'Kartochkalarni ikki savatga ajrating. Har bir kartochkada maxrajlar juftligi bor.',
        en: 'Sort the cards into two baskets. Each card holds a pair of denominators.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Проверь, делится ли число на оба знаменателя.', uz: "Bu yerga emas. Son ikkala maxrajga bo'linishini tekshiring.", en: 'Not here. Check whether the number divides by both denominators.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз привёл 2/3 к знаменателю 9 так: 2/9. Где ошибка?', uz: "Aziz 2/3 ni 9 maxrajga shunday keltirdi: 2/9. Xato qayerda?", en: 'Aziz brought 2/3 to denominator 9 as 2/9. Where is the mistake?' },
        opts: [
          { ru: 'Умножил только знаменатель', uz: "Faqat maxrajni ko'paytirdi", en: 'He multiplied only the denominator' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: 'Взял не тот знаменатель', uz: "Maxrajni noto'g'ri oldi", en: 'He took the wrong denominator' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Множитель 3, значит и числитель умножаем: 2 · 3 = 6, выходит 6/9.', uz: "To'g'ri. Ko'paytuvchi 3, demak suratni ham ko'paytiramiz: 2 · 3 = 6, 6/9 chiqadi.", en: 'Right. The factor is 3, so the numerator too: 2 · 3 = 6, giving 6/9.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: 2/9 меньше, чем 2/3, а значение должно сохраниться.', uz: "Xato bor: 2/9 soni 2/3 dan kichik, qiymat esa saqlanishi kerak.", en: 'There is a mistake: 2/9 is less than 2/3, and the value must be preserved.' },
          { ru: 'Знаменатель как раз подходит: 9 делится на 3.', uz: "Maxraj aynan mos: 9 soni 3 ga bo'linadi.", en: 'The denominator is fine: 9 divides by 3.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «Общий знаменатель для 1/2 и 1/5 равен 7». Проверь.', uz: "Dilnoza: «1/2 va 1/5 uchun umumiy maxraj 7 ga teng». Tekshiring.", en: 'Dilnoza: “The common denominator of 1/2 and 1/5 is 7.” Check it.' },
        opts: [
          { ru: 'Нет: знаменатели не складывают, нужно 10', uz: "Yo'q: maxrajlar qo'shilmaydi, 10 kerak", en: 'No: denominators are not added, it should be 10' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, нужно 25', uz: "Yo'q, 25 kerak", en: 'No, it should be 25' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Общий знаменатель делится на оба: 10 : 2 = 5 и 10 : 5 = 2.', uz: "To'g'ri. Umumiy maxraj ikkalasiga bo'linadi: 10 : 2 = 5 va 10 : 5 = 2.", en: 'Right. A common denominator divides by both: 10 ÷ 2 = 5 and 10 ÷ 5 = 2.' },
        wrong: [
          null,
          { ru: '7 не делится ни на 2, ни на 5.', uz: "7 soni na 2 ga, na 5 ga bo'linadi.", en: 'Seven divides by neither 2 nor 5.' },
          { ru: '25 на 2 не делится.', uz: "25 soni 2 ga bo'linmaydi.", en: '25 does not divide by 2.' },
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
    title: { ru: 'Ленты на выставку', uz: "Ko'rgazma uchun tasmalar", en: 'Tapes for the exhibition' },
    lead: { ru: 'Азиз украсил 2/3 стенда, Дилноза 3/5 такого же стенда.', uz: "Aziz stendning 2/3 qismini, Dilnoza xuddi shunday stendning 3/5 qismini bezadi.", en: 'Aziz decorated 2/3 of a stand, Dilnoza 3/5 of an identical one.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'К какому знаменателю удобно привести обе дроби?', uz: 'Ikkala kasrni qaysi maxrajga keltirish qulay?', en: 'Which denominator suits both fractions?' },
        opts: ['8', '15', '30'],
        correct: 1,
        ok: { ru: 'Верно. НОК(3, 5) = 15.', uz: "To'g'ri. EKUK(3, 5) = 15.", en: 'Right. LCM(3, 5) = 15.' },
        wrong: [
          { ru: 'Знаменатели не складывают: 8 не делится ни на 3, ни на 5.', uz: "Maxrajlar qo'shilmaydi: 8 na 3 ga, na 5 ga bo'linadi.", en: 'Denominators are not added: 8 divides by neither 3 nor 5.' },
          null,
          { ru: '30 подойдёт, но 15 меньше и уже делится на оба.', uz: "30 mos keladi, lekin 15 kichikroq va ikkalasiga bo'linadi.", en: '30 works, but 15 is smaller and already divides by both.' },
        ],
      },
      {
        q: { ru: 'Кто украсил большую часть стенда?', uz: 'Stendning kattaroq qismini kim bezadi?', en: 'Who decorated the larger part?' },
        opts: [
          { ru: 'Азиз', uz: 'Aziz', en: 'Aziz' },
          { ru: 'Дилноза', uz: 'Dilnoza', en: 'Dilnoza' },
          { ru: 'Поровну', uz: 'Teng', en: 'Equally' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 2/3 = 10/15, а 3/5 = 9/15. У Азиза больше.', uz: "To'g'ri. 2/3 = 10/15, 3/5 esa 9/15. Azizniki ko'proq.", en: 'Right. 2/3 = 10/15 and 3/5 = 9/15. Aziz did more.' },
        wrong: [
          null,
          { ru: '3/5 это 9/15, а 2/3 это 10/15 — меньше у Дилнозы.', uz: "3/5 bu 9/15, 2/3 esa 10/15 — Dilnozaniki kamroq.", en: '3/5 is 9/15 and 2/3 is 10/15, so Dilnoza did less.' },
          { ru: 'Не поровну: 10/15 и 9/15 отличаются на одну пятнадцатую.', uz: "Teng emas: 10/15 va 9/15 bir o'n beshdanga farq qiladi.", en: 'Not equal: 10/15 and 9/15 differ by one fifteenth.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про стенды. Азиз украсил две третьих, Дилноза три пятых такого же стенда.',
        uz: "Stendlar haqida masala. Aziz ikki uchdan qismini, Dilnoza xuddi shunday stendning uch beshdan qismini bezadi.",
        en: 'A stand problem. Aziz decorated two thirds and Dilnoza three fifths of an identical stand.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 18,
        q: { ru: 'Общий знаменатель для 1/6 и 4/9. Набери ответ.', uz: '1/6 va 4/9 uchun umumiy maxraj. Javobni tering.', en: 'The common denominator of 1/6 and 4/9. Type the answer.' },
        hint: { ru: 'Кратные 9: 9, 18, 27. Какое из них делится на 6?', uz: "9 ning karralilari: 9, 18, 27. Qaysi biri 6 ga bo'linadi?", en: 'Multiples of 9: 9, 18, 27. Which divides by 6?' },
        hint_audio: { ru: 'Кратные девяти: девять, восемнадцать, двадцать семь. Какое из них делится на шесть?', uz: "To'qqizning karralilari: to'qqiz, o'n sakkiz, yigirma yetti. Qaysi biri oltiga bo'linadi?", en: 'Multiples of nine: nine, eighteen, twenty seven. Which divides by six?' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: '3/5 приводим к знаменателю 20. Какой числитель?', uz: '3/5 ni 20 maxrajga keltiramiz. Surat qanday?', en: '3/5 goes to denominator 20. What is the numerator?' },
        opts: ['4', '9', '12', '15'],
        wrong: [
          { ru: '4 — это дополнительный множитель, а не числитель.', uz: "4 bu qo'shimcha ko'paytuvchi, surat emas.", en: 'Four is the extra factor, not the numerator.' },
          { ru: '9 вышло бы при множителе 3, но 20 : 5 = 4.', uz: "9 soni 3 ko'paytuvchida chiqardi, lekin 20 : 5 = 4.", en: 'Nine would come from factor 3, but 20 ÷ 5 = 4.' },
          null,
          { ru: '15 — это числитель при знаменателе 25.', uz: '15 bu 25 maxrajdagi surat.', en: 'Fifteen is the numerator for denominator 25.' },
        ],
        correct: { ru: 'Верно. 20 : 5 = 4 и 3 · 4 = 12.', uz: "To'g'ri. 20 : 5 = 4 va 3 · 4 = 12.", en: 'Right. 20 ÷ 5 = 4 and 3 · 4 = 12.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Что больше: 5/8 или 2/3?', uz: 'Qaysi biri katta: 5/8 yoki 2/3?', en: 'Which is greater: 5/8 or 2/3?' },
        opts: [
          { ru: '5/8', uz: '5/8', en: '5/8' },
          { ru: '2/3', uz: '2/3', en: '2/3' },
          { ru: 'Равны', uz: 'Teng', en: 'Equal' },
          { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi", en: 'They cannot be compared' },
        ],
        wrong: [
          { ru: 'На знаменателе 24: 5/8 = 15/24, а 2/3 = 16/24.', uz: "24 maxrajda: 5/8 = 15/24, 2/3 esa 16/24.", en: 'At denominator 24: 5/8 = 15/24 and 2/3 = 16/24.' },
          null,
          { ru: 'Не равны: 15/24 и 16/24 отличаются на одну двадцать четвёртую.', uz: "Teng emas: 15/24 va 16/24 bir yigirma to'rtdanga farq qiladi.", en: 'Not equal: 15/24 and 16/24 differ by one twenty fourth.' },
          { ru: 'Сравнить можно: для этого и приводят к общему знаменателю.', uz: "Solishtirsa bo'ladi: shuning uchun umumiy maxrajga keltiriladi.", en: 'They can be compared: that is what a common denominator is for.' },
        ],
        correct: { ru: 'Верно. 16/24 больше 15/24.', uz: "To'g'ri. 16/24 soni 15/24 dan katta.", en: 'Right. 16/24 is greater than 15/24.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Когда общим знаменателем становится больший из двух?', uz: 'Qachon kattaroq maxraj umumiy bo\'lib qoladi?', en: 'When is the larger denominator itself the common one?' },
        opts: [
          { ru: 'Когда он делится на меньший', uz: "U kichigiga bo'linganda", en: 'When it divides by the smaller one' },
          { ru: 'Всегда', uz: 'Har doim', en: 'Always' },
          { ru: 'Когда числители равны', uz: 'Suratlar teng bo\'lganda', en: 'When the numerators match' },
          { ru: 'Никогда', uz: 'Hech qachon', en: 'Never' },
        ],
        wrong: [
          null,
          { ru: 'Не всегда: 4 и 6 — больший 6, но на 4 он не делится.', uz: "Har doim emas: 4 va 6 da kattasi 6, lekin u 4 ga bo'linmaydi.", en: 'Not always: with 4 and 6 the larger is 6, but it does not divide by 4.' },
          { ru: 'Числители на выбор знаменателя не влияют.', uz: "Suratlar maxraj tanlashga ta'sir qilmaydi.", en: 'Numerators do not affect the choice of denominator.' },
          { ru: 'Бывает: для 1/3 и 5/9 общий знаменатель как раз 9.', uz: 'Bo\'ladi: 1/3 va 5/9 uchun umumiy maxraj aynan 9.', en: 'It happens: for 1/3 and 5/9 the common denominator is 9.' },
        ],
        correct: { ru: 'Верно. Тогда вторую дробь менять не нужно.', uz: "To'g'ri. Unda ikkinchi kasrni o'zgartirish shart emas.", en: 'Right. Then the second fraction needs no change.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Зачем дроби приводят к общему знаменателю?', uz: 'Kasrlar nima uchun umumiy maxrajga keltiriladi?', en: 'Why are fractions brought to a common denominator?' },
        opts: [
          { ru: 'Чтобы они стали больше', uz: 'Kattalashishi uchun', en: 'To make them bigger' },
          { ru: 'Чтобы упростить запись', uz: 'Yozuvni soddalashtirish uchun', en: 'To simplify the notation' },
          { ru: 'Чтобы избавиться от числителя', uz: 'Suratdan qutulish uchun', en: 'To get rid of the numerator' },
          { ru: 'Чтобы сравнивать, складывать и вычитать', uz: "Solishtirish, qo'shish va ayirish uchun", en: 'To compare, add and subtract them' },
        ],
        wrong: [
          { ru: 'Значение дроби не меняется, только запись.', uz: "Kasrning qiymati o'zgarmaydi, faqat yozuv.", en: 'The value does not change, only the notation.' },
          { ru: 'Запись как раз становится длиннее.', uz: 'Yozuv aksincha uzayadi.', en: 'The notation actually gets longer.' },
          { ru: 'Числитель никуда не девается.', uz: 'Surat hech qayerga ketmaydi.', en: 'The numerator does not go anywhere.' },
          null,
        ],
        correct: { ru: 'Верно. Одинаковые доли можно сравнивать и считать — это следующий урок.', uz: "To'g'ri. Bir xil ulushlarni solishtirish va hisoblash mumkin — bu keyingi dars.", en: 'Right. Equal parts can be compared and counted — that is the next lesson.' },
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
      ru: 'Час делят на 60 минут именно потому, что 60 делится на 2, 3, 4, 5, 6, 10, 12, 15, 20 и 30. Половину, треть и четверть часа можно записать целыми минутами — это удобный общий знаменатель времени.',
      uz: "Soat 60 daqiqaga aynan shuning uchun bo'linadi: 60 soni 2, 3, 4, 5, 6, 10, 12, 15, 20 va 30 ga bo'linadi. Soatning yarmi, uchdan biri va choragi butun daqiqalarda yoziladi — bu vaqtning qulay umumiy maxraji.",
      en: 'An hour is split into 60 minutes precisely because 60 divides by 2, 3, 4, 5, 6, 10, 12, 15, 20 and 30. Half, a third and a quarter of an hour are all whole minutes: a handy common denominator for time.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Час делят на шестьдесят минут потому, что шестьдесят делится на два, три, четыре, пять, шесть и ещё много чисел. Поэтому половина, треть и четверть часа выходят целыми минутами. Это удобный общий знаменатель для времени.',
      uz: "Bilasizmi? Soat oltmish daqiqaga bo'linadi, chunki oltmish ikkiga, uchga, to'rtga, beshga, oltiga va yana ko'p songa bo'linadi. Shuning uchun soatning yarmi, uchdan biri va choragi butun daqiqa bo'lib chiqadi. Bu vaqt uchun qulay umumiy maxraj.",
      en: 'Did you know? An hour is split into sixty minutes because sixty divides by two, three, four, five, six and many more. So half, a third and a quarter of an hour all come out as whole minutes. A handy common denominator for time.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Дроби', uz: 'Matematika · Kasrlar', en: 'Mathematics · Fractions' },
    heading: { ru: 'Общий знаменатель', uz: 'Umumiy maxraj', en: 'Common denominator' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'общий знаменатель = НОК знаменателей', uz: 'umumiy maxraj = maxrajlar EKUKi', en: 'common denominator = LCM of denominators' },
    brief_2: { ru: 'множитель = НОК : знаменатель', uz: "ko'paytuvchi = EKUK : maxraj", en: 'factor = LCM ÷ denominator' },
    brief_3: { ru: 'умножаем оба числа дроби', uz: "kasrning ikkala sonini ko'paytiramiz", en: 'multiply both numbers of the fraction' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Общий знаменатель', uz: 'Umumiy maxraj', en: 'Common denominator' },
    memo_a1: { ru: 'делится на оба знаменателя', uz: "ikkala maxrajga bo'linadi", en: 'divides by both denominators' },
    memo_q2: { ru: 'Лёгкий случай', uz: 'Oson hol', en: 'Easy case' },
    memo_a2: { ru: 'один знаменатель делится на другой', uz: "bir maxraj ikkinchisiga bo'linadi", en: 'one denominator divides by the other' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'умножить только знаменатель', uz: "faqat maxrajni ko'paytirish", en: 'multiplying only the denominator' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Общий знаменатель это наименьшее общее кратное знаменателей. Дополнительный множитель находим делением, а умножаем оба числа дроби.',
        'Ленты: три четвёртых это девять двенадцатых, пять шестых это десять двенадцатых. Кусок длиннее у Дилнозы.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Umumiy maxraj bu maxrajlarning eng kichik umumiy karralisi. Qo'shimcha ko'paytuvchini bo'lish bilan topamiz, ko'paytirishni esa kasrning ikkala soniga qilamiz.",
        "Tasmalar: uch to'rtdan bu to'qqiz o'n ikkidan, besh oltidan bu o'n o'n ikkidan. Bo'lak Dilnozaniki uzunroq.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The common denominator is the least common multiple of the denominators. The extra factor comes from division, and both numbers of the fraction get multiplied.',
        'The tapes: three quarters is nine twelfths, five sixths is ten twelfths. Dilnoza has the longer piece.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Общая разметка', uz: 'Usul. Umumiy belgi', en: 'Method. A shared scale' },
    m1_steps: {
      ru: ['Найди НОК знаменателей', 'Раздели НОК на каждый знаменатель — это множители', 'Умножь на множитель оба числа своей дроби'],
      uz: ["Maxrajlarning EKUKini toping", "EKUKni har bir maxrajga bo'ling — bu ko'paytuvchilar", "O'z kasringizning ikkala sonini ko'paytuvchiga ko'paytiring"],
      en: ['Find the LCM of the denominators', 'Divide the LCM by each denominator: those are the factors', 'Multiply both numbers of each fraction by its factor'],
    },
    m1_no: {
      ru: 'Если один знаменатель делится на другой, он и есть общий: для 1/3 и 5/9 это 9.',
      uz: "Agar bir maxraj ikkinchisiga bo'linsa, o'sha umumiy: 1/3 va 5/9 uchun bu 9.",
      en: 'If one denominator divides by the other, it is the common one: for 1/3 and 5/9 that is 9.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кабинет технологии. На хуке вопрос, в итоге ответ.
// ============================================================
// Лента с разметкой: total делений, cut закрашено. Одна и та же лента
// рисуется и в сцене, и на экранах — ребёнок узнаёт её.
const TapeSvg = ({ x, y, w, h, total, cut, tone = '#E8A33C', dark = '#C9884A' }) => {
  const step = w / total;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill="#F7F0E2" stroke="#DCCFB6"/>
      <rect x={x} y={y} width={step * cut} height={h} rx="3" fill={tone}/>
      {Array.from({ length: total - 1 }, (_, i) => (
        <path key={i} d={`M${x + step * (i + 1)} ${y} v${h}`} stroke={dark} strokeWidth="1" opacity="0.55"/>
      ))}
      <rect x={x} y={y} width={w} height={h} rx="3" fill="none" stroke={dark} strokeWidth="1.6"/>
    </g>
  );
};

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d9wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d9wall)"/>

    {/* Полка с катушками ниток и корзиной лоскутов */}
    <g>
      <rect x="10" y="18" width="104" height="6" rx="2" fill="#C9A472"/>
      {[18, 40, 62, 84].map((sx, i) => (
        <g key={sx}>
          <rect x={sx} y="6" width="14" height="12" rx="2" fill={['#E8A33C', '#7ECBE6', '#D98A5A', '#C9A472'][i]}/>
          <path d={`M${sx + 2} 6 h10`} stroke="#B08A57" strokeWidth="1.4"/>
        </g>
      ))}
      <path d="M124 24 q10 12 4 26" stroke="#D98A5A" strokeWidth="1.6" fill="none" className="d9-thread"/>
    </g>

    {/* Швейная машинка на столе */}
    <g>
      <rect x="300" y="62" width="70" height="34" rx="5" fill="#8E8578"/>
      <rect x="300" y="86" width="70" height="10" rx="3" fill="#6F6759"/>
      <rect x="352" y="40" width="12" height="26" rx="3" fill="#8E8578"/>
      <rect x="310" y="40" width="54" height="10" rx="4" fill="#8E8578"/>
      <path d="M316 50 v12" stroke="#C9C7C2" strokeWidth="2" className="d9-needle"/>
      <circle cx="366" cy="78" r="7" fill="#C9A472"/>
    </g>

    {/* Две ленты одной длины: 4 деления и 6 делений */}
    <TapeSvg x={116} y={40} w={168} h={22} total={4} cut={3} tone="#7ECBE6" dark="#019ACB"/>
    <TapeSvg x={116} y={72} w={168} h={22} total={6} cut={5} tone="#F5C77E" dark="#C99B3A"/>

    {/* Ножницы рядом с лентами */}
    <g className="d9-scissors">
      <path d="M292 46 l16 12 M292 58 l16 -12" stroke="#8E8578" strokeWidth="2.4" strokeLinecap="round"/>
      <circle cx="290" cy="44" r="3.4" fill="none" stroke="#8E8578" strokeWidth="2"/>
      <circle cx="290" cy="60" r="3.4" fill="none" stroke="#8E8578" strokeWidth="2"/>
    </g>

    {/* Дети за рабочим столом */}
    <Person x={150} ground={124} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={250} ground={124} head={13} shirt="#F5C77E" hair="#5A4636"/>

    <rect x="0" y="120" width="400" height="34" fill="#D2A96F"/>
    <rect x="0" y="120" width="400" height="5" fill="#C9884A"/>

    {/* Обрезки и линейка на столе */}
    <g>
      <rect x="24" y="128" width="52" height="8" rx="2" fill="#FBF3D6" stroke="#DCCFB6"/>
      {[30, 40, 50, 60, 70].map((lx) => <path key={lx} d={`M${lx} 128 v4`} stroke="#C9A472" strokeWidth="1"/>)}
      <path d="M196 140 l14 -8 l10 6 l-12 8 Z" fill="#7ECBE6" opacity="0.8"/>
      <path d="M214 146 l12 -7 l9 5 l-11 7 Z" fill="#F5C77E" opacity="0.8"/>
    </g>
  </svg>
);

// Итог: обе ленты на общей разметке в 12 делений.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <TapeSvg x={40} y={16} w={320} h={24} total={12} cut={9} tone="#7ECBE6" dark="#019ACB"/>
    <TapeSvg x={40} y={52} w={320} h={24} total={12} cut={10} tone="#F5C77E" dark="#C99B3A"/>
    <g fill="#494550" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="12">
      <text x="372" y="33">9</text>
      <text x="372" y="69">10</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Лента как счётный материал на экранах.
const Tape = ({ total, cut, tone = 'a', label = null }) => (
  <span className="d9-tape-row">
    <span className={'d9-tape d9-tape-' + tone}>
      {Array.from({ length: total }, (_, i) => <i key={i} className={i < cut ? 'on' : ''}/>)}
    </span>
    {label}
  </span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d9-stage">
        <Tape total={c.from.d} cut={c.from.n} label={<Frac n={c.from.n} d={c.from.d} size="mid"/>}/>
        <span className={'d9-op' + (step >= 1 ? ' d9-on' : '')}>× {c.by}</span>
        <span className={'d9-fade' + (step >= 2 ? ' d9-on' : '')}>
          <Tape total={c.to.d} cut={c.to.n} tone="ok" label={<Frac n={c.to.n} d={c.to.d} size="mid"/>}/>
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

// Ядро: две ленты сначала со своей разметкой, потом на общей.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d9-stage">
        <Tape total={c.a.d} cut={c.a.n} label={<Frac n={c.a.n} d={c.a.d} size="mid"/>}/>
        <Tape total={c.b.d} cut={c.b.n} tone="b" label={<Frac n={c.b.n} d={c.b.d} size="mid"/>}/>
        <span className={'d9-lcm' + (step >= 1 ? ' d9-on' : '')}>
          <span className="d9-lcm-k">{tri(useLang(), 'НОК', 'EKUK', 'LCM')}</span>
          <b>12</b>
        </span>
        <span className={'d9-fade' + (step >= 2 ? ' d9-on' : '')}>
          <Tape total={c.a.to.d} cut={c.a.to.n} label={<Frac n={c.a.to.n} d={c.a.to.d} size="mid"/>}/>
          <Tape total={c.b.to.d} cut={c.b.to.n} tone="ok" label={<Frac n={c.b.to.n} d={c.b.to.d} size="mid"/>}/>
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

const EasyBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_easy;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d9-stage">
        <Tape total={c.a.d} cut={c.a.n} label={<Frac n={c.a.n} d={c.a.d} size="mid"/>}/>
        <span className={'d9-op' + (step >= 1 ? ' d9-on' : '')}>× {c.a.by}</span>
        <span className={'d9-fade' + (step >= 1 ? ' d9-on' : '')}>
          <Tape total={c.a.to.d} cut={c.a.to.n} tone="ok" label={<Frac n={c.a.to.n} d={c.a.to.d} size="mid"/>}/>
        </span>
        <span className={'d9-fade' + (step >= 2 ? ' d9-on' : '')}>
          <Tape total={c.b.d} cut={c.b.n} tone="b" label={<Frac n={c.b.n} d={c.b.d} size="mid"/>}/>
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
  const tapes = [null, { total: 24, cut: 9, tone: 'a' }, { total: 24, cut: 10, tone: 'ok' }];
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d9-stage">
        {c.steps.map((s, i) => (
          <span key={i} className={'d9-solve-row d9-fade' + (step >= i ? ' d9-on' : '')}>
            <span className="d9-solve-t">{mt(t(s))}</span>
            {tapes[i] && <Tape total={tapes[i].total} cut={tapes[i].cut} tone={tapes[i].tone}/>}
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

// Граница: произведение знаменателей тоже общее, но крупнее.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d9-stage">
        <span className="d9-pair d9-pair-good">
          <span className="d9-solve-t">{mt(t(c.lcm_line))}</span>
          <Tape total={24} cut={20} tone="ok"/>
        </span>
        <span className={'d9-pair d9-pair-warn d9-fade' + (step >= 1 ? ' d9-on' : '')}>
          <span className="d9-solve-t">{mt(t(c.prod_line))}</span>
          <Tape total={48} cut={40} tone="b"/>
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
        <div className={'d9-banner fade-up delay-1' + (phase === 'play' ? ' d9-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d9-stage">
          {phase === 'demo' ? (
            <>
              {/* Ленты не копятся, а ПЕРЕРИСОВЫВАЮТСЯ на общей разметке:
                  четыре ряда подряд не помещались на экране телефона. */}
              <Tape total={done ? c.demo_a.to.d : c.demo_a.d} cut={done ? c.demo_a.to.n : c.demo_a.n}
                tone={done ? 'ok' : 'a'}
                label={<Frac n={done ? c.demo_a.to.n : c.demo_a.n} d={done ? c.demo_a.to.d : c.demo_a.d} size="mid"/>}/>
              <Tape total={done ? c.demo_b.to.d : c.demo_b.d} cut={done ? c.demo_b.to.n : c.demo_b.n}
                tone={done ? 'ok' : 'b'}
                label={<Frac n={done ? c.demo_b.to.n : c.demo_b.n} d={done ? c.demo_b.to.d : c.demo_b.d} size="mid"/>}/>
              <span className={'d9-lcm' + (shown >= 1 ? ' d9-on' : '')}>
                <span className="d9-lcm-k">{tri(lang, 'НОК', 'EKUK', 'LCM')}</span>
                <b>{c.demo_lcm}</b>
              </span>
              <p className={'body d9-verdict' + (done ? ' d9-verdict-on' : '')}>{done ? mt(t(c.demo_note)) : ''}</p>
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
          <div className="d9-acts fade-up">
            <button className="d9-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d9-btn d9-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenEasy = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_easy} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <EasyBody step={step}/>}/>
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
      <div className="d9-stage">
        <Tape total={12} cut={9} label={<Frac n="9" d="12" size="mid"/>}/>
        <Tape total={12} cut={10} tone="ok" label={<Frac n="10" d="12" size="mid"/>}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenLcd = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_lcd} asideNode={methodAside}/>
);
const ScreenMult = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_mult} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: два стенда одного размера.
const TaskFig = ({ idx }) => (
  <div className="d9-task-fig">
    <Tape total={idx >= 1 ? 15 : 3} cut={idx >= 1 ? 10 : 2}/>
    <Tape total={idx >= 1 ? 15 : 5} cut={idx >= 1 ? 9 : 3} tone="b"/>
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={(it, idx) => <TaskFig idx={idx}/>}/>
);

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s_final.fact}/>}/>
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
.d9-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }

/* Лента как счётный материал */
.d9-tape-row { display: flex; align-items: center; gap: clamp(8px, 1.8vw, 14px); justify-content: center; flex-wrap: wrap; }
.d9-tape { display: inline-flex; gap: 1px; border-radius: 4px; overflow: hidden; border: 1px solid #DCCFB6; }
.d9-tape i { display: block; width: clamp(9px, 2vw, 17px); height: clamp(20px, 3.4vw, 28px); background: #F7F0E2; }
.d9-tape-a i.on { background: #7ECBE6; }
.d9-tape-b i.on { background: #F5C77E; }
.d9-tape-ok i.on { background: #7FBF95; }

.d9-fade { opacity: 0; transition: opacity 420ms linear; display: flex; flex-direction: column; gap: clamp(6px, 1.4vw, 11px); align-items: center; }
.d9-on { opacity: 1; }
.d9-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 19px); font-weight: 700; color: #C99B3A; background: #FBF3D6; border-radius: 9px; padding: 4px 10px; opacity: 0; transition: opacity 380ms linear; }

/* НОК знаменателей */
.d9-lcm { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border-radius: 11px; background: #E3F0E8; opacity: 0; transition: opacity 380ms linear; }
.d9-lcm-k { font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; color: #1F7A4D; letter-spacing: 0.04em; }
.d9-lcm b { font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 25px); color: #1F7A4D; }

/* Решаем вместе и граница */
.d9-solve-row { display: flex; align-items: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; justify-content: center; }
.d9-solve-t { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }
.d9-pair { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.2vw, 18px); flex-wrap: wrap; width: 100%; padding: clamp(8px, 1.6vw, 12px); border-radius: 14px; }
.d9-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d9-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }
.d9-pair-warn .d9-tape i { width: clamp(4px, 1vw, 8px); }

/* Задача */
.d9-task-fig { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.d9-task-fig .d9-tape i { width: clamp(7px, 1.6vw, 14px); }

/* Экран 4 */
.d9-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(14px, 2.4vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 6px 13px; }
.d9-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d9-verdict { margin: 0; min-height: 22px; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d9-verdict-on { opacity: 1; }
.d9-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d9-btn { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d9-btn:disabled { opacity: 0.45; cursor: default; }
.d9-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d9-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: игла машинки, нитка с катушки, ножницы */
.d9-needle { animation: d9Needle 900ms ease-in-out infinite; }
@keyframes d9Needle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
.d9-thread { animation: d9Thread 5200ms ease-in-out infinite; transform-origin: 124px 24px; }
@keyframes d9Thread { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
.d9-scissors { transform-origin: 290px 52px; animation: d9Scis 4000ms ease-in-out infinite; }
@keyframes d9Scis { 0%, 70%, 100% { transform: rotate(0deg); } 82% { transform: rotate(-7deg); } }
@media (prefers-reduced-motion: reduce) { .d9-needle, .d9-thread, .d9-scissors { animation: none; } }

@media (max-width: 639.98px) {
  .d9-tape i { width: 8px; height: 18px; }
  .d9-pair-warn .d9-tape i { width: 4px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function CommonDenominatorLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenEasy, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenLcd, ScreenMult, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
