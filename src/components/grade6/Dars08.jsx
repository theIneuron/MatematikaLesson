// ============================================================
// 6 КЛАСС, УРОК 8 «Сокращение дробей»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б2 начинается здесь: урок 7 дал основное свойство дроби, этот урок
// доводит его до навыка — сокращать до несократимого вида, а НОД из урока 5
// делает это за один шаг.
//
// Сцена — школьная библиотека: полка на 24 книги, 18 стоят на месте.
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
  lessonId: 'div_6_08',
  lessonTitle: {
    ru: 'Сокращение дробей',
    uz: 'Kasrlarni qisqartirish',
    en: 'Reducing fractions',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 kutubxona: 18/24 yoki 3/4
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 asosiy xossa esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 qisqartirish qadamlab
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL 1: oxirigacha qisqartirish
  { id: 's_gcd',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 USUL 2: EKUB bilan bir qadamda
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 45/60
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: qayerda to'xtash kerak
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_cut',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 qisqartiring x3
  { id: 's_find',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 nechaga qisqaradi x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: qisqaradi yoki yo'q
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: sinf ishlari
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Полка на 24 книги', uz: '24 kitoblik javon', en: 'A shelf for 24 books' },
    lead: {
      ru: 'Полка в библиотеке рассчитана на 24 книги. Сейчас на ней 18.',
      uz: "Kutubxonadagi javon 24 kitobga mo'ljallangan. Hozir unda 18 tasi turibdi.",
      en: 'The library shelf holds 24 books. Right now 18 are in place.',
    },
    voice_a: { ru: 'Дилноза: полка занята на три четверти.', uz: "Dilnoza: javonning uchdan to'rt qismi band.", en: 'Dilnoza: the shelf is three quarters full.' },
    voice_b: { ru: 'Азиз: занято 18/24, это другое число.', uz: 'Aziz: 18/24 band, bu boshqa son.', en: 'Aziz: 18/24 is taken, that is a different number.' },
    ask: { ru: 'Кто прав?', uz: 'Kim haq?', en: 'Who is right?' },
    options: [
      { ru: 'Дилноза: часть одна и та же', uz: "Dilnoza: qism bir xil", en: 'Dilnoza: the same part' },
      { ru: 'Азиз: части разные', uz: 'Aziz: qismlar har xil', en: 'Aziz: different parts' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: "Variantlardan birini bosing. Javobni dars davomida tekshiramiz.",
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В школьной библиотеке полка на двадцать четыре места. Сейчас на ней стоят восемнадцать книг.',
          'Дилноза говорит, что полка занята на три четверти, а Азиз что занято восемнадцать двадцать четвёртых и это другое число. Кто прав? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab kutubxonasida yigirma to'rt joylik javon bor. Hozir unda o'n sakkiz kitob turibdi.",
          "Dilnoza javonning uchdan to'rt qismi band deydi, Aziz esa o'n sakkiz yigirma to'rtdan band va bu boshqa son deydi. Kim haq? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The school library shelf holds twenty four books. Right now eighteen of them are in place.',
          'Dilnoza says the shelf is three quarters full, while Aziz says eighteen twenty fourths is a different number. Who is right? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Оба числа делим на одно', uz: "Ikkala sonni bittaga bo'lamiz", en: 'Divide both by the same number' },
    from: { n: 6, d: 8 },
    to: { n: 3, d: 4 },
    done: {
      ru: 'Это основное свойство дроби из прошлого урока. Оно и разрешает сокращать.',
      uz: "Bu o'tgan darsdagi kasrning asosiy xossasi. Aynan u qisqartirishga ruxsat beradi.",
      en: 'This is the basic property from the last lesson. It is what allows reducing.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Если числитель и знаменатель разделить на одно и то же число, значение дроби не изменится.',
        'Шесть восьмых. Оба числа делим на два.',
        'Получилось три четвёртых. Закрашенная часть та же самая. Такое действие называют сокращением дроби, и сегодня мы научимся делать его до конца.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Surat va maxrajni bir xil songa bo'lsak, kasrning qiymati o'zgarmaydi.",
        "Olti sakkizdan. Ikkala sonni ikkiga bo'lamiz.",
        "Uch to'rtdan chiqdi. Bo'yalgan qism o'sha. Bu amal kasrni qisqartirish deyiladi, bugun uni oxirigacha qilishni o'rganamiz.",
      ],
      en: [
        'Let us recall the last lesson. If you divide the numerator and the denominator by the same number, the value does not change.',
        'Six eighths. Divide both numbers by two.',
        'That gives three quarters. The shaded part is the same. This action is called reducing, and today we learn to do it all the way.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Полка: 18 из 24', uz: '24 dan 18', en: 'The shelf: 18 out of 24' },
    rows: [
      { n: 18, d: 24, by: 2 },
      { n: 9, d: 12, by: 3 },
      { n: 3, d: 4, by: null },
    ],
    done: {
      ru: 'Числа стали меньше, а занятая часть полки не изменилась. 18/24 и 3/4 — одно и то же число, права была Дилноза.',
      uz: "Sonlar kichraydi, javonning band qismi esa o'zgarmadi. 18/24 va 3/4 bitta sonning o'zi, Dilnoza haq edi.",
      en: 'The numbers got smaller and the occupied part did not change. 18/24 and 3/4 are the same number, so Dilnoza was right.',
    },
    audio: {
      ru: [
        'Вернёмся к полке. Восемнадцать книг из двадцати четырёх мест. Оба числа чётные, делим на два.',
        'Стало девять двенадцатых. Сумма цифр у обоих делится на три, делим на три.',
        'Получилось три четвёртых. Дальше делить нечем: у трёх и четырёх общих делителей больше нет. Занятая часть полки всё время была одной и той же.',
      ],
      uz: [
        "Javonga qaytamiz. Yigirma to'rt joydan o'n sakkiztasi band. Ikkala son juft, ikkiga bo'lamiz.",
        "To'qqiz o'n ikkidan bo'ldi. Ikkalasining raqamlar yig'indisi uchga bo'linadi, uchga bo'lamiz.",
        "Uch to'rtdan chiqdi. Endi bo'lishga narsa yo'q: uch va to'rtning boshqa umumiy bo'luvchisi yo'q. Javonning band qismi esa hamma vaqt bir xil edi.",
      ],
      en: [
        'Back to the shelf. Eighteen books out of twenty four places. Both numbers are even, divide by two.',
        'That gives nine twelfths. The digit sums of both divide by three, so divide by three.',
        'That gives three quarters. There is nothing left to divide by: three and four share no other divisor. The occupied part of the shelf was the same all along.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Сокращаем шагами', uz: 'Qadamlab qisqartiramiz', en: 'Reducing step by step' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_rows: [
      { n: 20, d: 30, by: 2 },
      { n: 10, d: 15, by: 5 },
      { n: 2, d: 3, by: null },
    ],
    demo_note: {
      ru: 'Делили, пока находился общий делитель. 2 и 3 дальше не делятся — дробь несократимая.',
      uz: "Umumiy bo'luvchi topilgunicha bo'ldik. 2 va 3 boshqa bo'linmaydi — kasr qisqarmas.",
      en: 'We divided while a common divisor could be found. 2 and 3 share none, so the fraction is irreducible.',
    },
    play_ask: { ru: 'Сократи 16/24 до конца. Что получится?', uz: '16/24 ni oxirigacha qisqartiring. Nima chiqadi?', en: 'Reduce 16/24 all the way. What do you get?' },
    play_opts: ['8/12', '4/6', '2/3'],
    play_correct: 2,
    play_ok: {
      ru: 'Верно. 16/24 : 2 = 8/12, потом : 2 = 4/6, потом : 2 = 2/3. Дальше делить нечем.',
      uz: "To'g'ri. 16/24 : 2 = 8/12, keyin : 2 = 4/6, keyin : 2 = 2/3. Endi bo'lishga narsa yo'q.",
      en: 'Right. 16/24 ÷ 2 = 8/12, then ÷ 2 = 4/6, then ÷ 2 = 2/3. Nothing left to divide by.',
    },
    play_wrong: [
      { ru: 'Это только первый шаг: 8 и 12 ещё делятся на 4.', uz: "Bu faqat birinchi qadam: 8 va 12 hali 4 ga bo'linadi.", en: 'That is only the first step: 8 and 12 still divide by 4.' },
      { ru: 'Почти. У 4 и 6 остался общий делитель 2.', uz: "Deyarli. 4 va 6 da umumiy bo'luvchi 2 qoldi.", en: 'Almost. 4 and 6 still share the divisor 2.' },
      null,
    ],
    audio: {
      intro: {
        ru: 'Способ первый. Делим на любой общий делитель и повторяем, пока делители находятся. Покажу на двадцати тридцатых.',
        uz: "Birinchi usul. Har qanday umumiy bo'luvchiga bo'lamiz va bo'luvchi topilgunicha takrorlaymiz. Yigirma o'ttizdan misolida ko'rsataman.",
        en: 'The first method. Divide by any common divisor and repeat while divisors can be found. I will show it on twenty thirtieths.',
      },
      demo: {
        ru: 'Сначала на два, потом на пять. Осталось две третьих, дальше делить нечем.',
        uz: "Avval ikkiga, keyin beshga. Ikki uchdan qoldi, endi bo'lishga narsa yo'q.",
        en: 'First by two, then by five. Two thirds is left and nothing divides it further.',
      },
      play: {
        ru: 'Теперь ваша очередь. Сократите шестнадцать двадцать четвёртых до конца. Что получится?',
        uz: "Endi sizning navbatingiz. O'n olti yigirma to'rtdanni oxirigacha qisqartiring. Nima chiqadi?",
        en: 'Now it is your turn. Reduce sixteen twenty fourths all the way. What do you get?',
      },
      ok: {
        ru: 'Верно. Делили на два три раза и получили две третьих.',
        uz: "To'g'ri. Uch marta ikkiga bo'ldik va ikki uchdan chiqdi.",
        en: 'Right. We divided by two three times and got two thirds.',
      },
      wrong: {
        ru: 'Проверьте, остался ли у чисел общий делитель. Если остался, делите дальше.',
        uz: "Sonlarda umumiy bo'luvchi qolganini tekshiring. Qolgan bo'lsa, bo'lishda davom eting.",
        en: 'Check whether the numbers still share a divisor. If they do, keep dividing.',
      },
    },
  },

  s_gcd: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'НОД делает это за один шаг', uz: 'EKUB buni bir qadamda qiladi', en: 'The GCD does it in one step' },
    from: { n: 16, d: 24 },
    gcd: 8,
    to: { n: 2, d: 3 },
    done: {
      ru: 'Шагами получилось за три деления, через НОД — за одно. Результат тот же: 2/3.',
      uz: "Qadamlab uch marta bo'ldik, EKUB bilan bir marta. Natija o'sha: 2/3.",
      en: 'Step by step took three divisions, with the GCD just one. The result is the same: 2/3.',
    },
    audio: {
      ru: [
        'Есть путь короче. Вспомним пятый урок: наибольший общий делитель это самое большое число, на которое делятся оба.',
        'Для шестнадцати и двадцати четырёх наибольший общий делитель равен восьми.',
        'Делим сразу на восемь и получаем две третьих. Если делить на наибольший общий делитель, дробь сразу становится несократимой.',
      ],
      uz: [
        "Qisqaroq yo'l bor. Beshinchi darsni eslaymiz: eng katta umumiy bo'luvchi ikkalasini ham bo'ladigan eng katta son.",
        "O'n olti va yigirma to'rt uchun eng katta umumiy bo'luvchi sakkizga teng.",
        "Birdaniga sakkizga bo'lamiz va ikki uchdan chiqadi. Eng katta umumiy bo'luvchiga bo'lsak, kasr darrov qisqarmas bo'lib qoladi.",
      ],
      en: [
        'There is a shorter route. Recall lesson five: the greatest common divisor is the largest number dividing both.',
        'For sixteen and twenty four the greatest common divisor is eight.',
        'Divide by eight at once and get two thirds. Dividing by the greatest common divisor makes the fraction irreducible immediately.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Сократим 45/60', uz: '45/60 ni qisqartiramiz', en: 'Let us reduce 45/60' },
    lead: { ru: 'Оба числа оканчиваются на 5 и 0 — значит, делятся на 5.', uz: "Ikkala son 5 va 0 bilan tugaydi — demak, 5 ga bo'linadi.", en: 'Both numbers end in 5 and 0, so both divide by 5.' },
    steps: [
      { ru: '45/60 : 5 = 9/12', uz: '45/60 : 5 = 9/12', en: '45/60 ÷ 5 = 9/12' },
      { ru: '9/12 : 3 = 3/4', uz: '9/12 : 3 = 3/4', en: '9/12 ÷ 3 = 3/4' },
      { ru: 'НОД(45, 60) = 15 → сразу 3/4', uz: 'EKUB(45, 60) = 15 → darrov 3/4', en: 'GCD(45, 60) = 15 → 3/4 at once' },
    ],
    done: {
      ru: 'И шагами, и через НОД вышло 3/4. Это та же часть, что и на полке в начале урока.',
      uz: "Qadamlab ham, EKUB bilan ham 3/4 chiqdi. Bu dars boshidagi javondagi qismning o'zi.",
      en: 'Both routes gave 3/4. That is the same part as the shelf at the start of the lesson.',
    },
    audio: {
      ru: [
        'Решаем вместе. Сорок пять шестидесятых. Оба числа делятся на пять, делим.',
        'Получилось девять двенадцатых. Сумма цифр у обоих делится на три, делим на три и получаем три четвёртых.',
        'Короткий путь: наибольший общий делитель сорока пяти и шестидесяти пятнадцать. Делим сразу на пятнадцать и получаем те же три четвёртых.',
      ],
      uz: [
        "Birga yechamiz. Qirq besh oltmishdan. Ikkala son beshga bo'linadi, bo'lamiz.",
        "To'qqiz o'n ikkidan chiqdi. Ikkalasining raqamlar yig'indisi uchga bo'linadi, uchga bo'lamiz va uch to'rtdan chiqadi.",
        "Qisqa yo'l: qirq besh va oltmishning eng katta umumiy bo'luvchisi o'n besh. Birdaniga o'n beshga bo'lamiz va o'sha uch to'rtdan chiqadi.",
      ],
      en: [
        'Let us solve it together. Forty five sixtieths. Both numbers divide by five, so divide.',
        'That gives nine twelfths. The digit sums of both divide by three, so divide by three and get three quarters.',
        'The short route: the greatest common divisor of forty five and sixty is fifteen. Divide by fifteen at once and get the same three quarters.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Когда сокращать уже нельзя', uz: 'Qachon qisqartirib bo\'lmaydi', en: 'When you must stop' },
    good: { n: 5, d: 6 },
    bad: { n: 7, d: 9 },
    done: {
      ru: 'Если у числителя и знаменателя нет общего делителя, кроме 1, дробь уже несократимая. Останавливаться на этом — не ошибка, а верный ответ.',
      uz: "Agar surat va maxrajning 1 dan boshqa umumiy bo'luvchisi bo'lmasa, kasr allaqachon qisqarmas. Shu yerda to'xtash xato emas, to'g'ri javob.",
      en: 'If the numerator and the denominator share no divisor but 1, the fraction is already irreducible. Stopping there is not a mistake but the right answer.',
    },
    audio: {
      ru: [
        'Теперь про остановку. Возьмём пять шестых. Пять делится только на один и на пять, шесть на пять не делится.',
        'Значит, общих делителей, кроме единицы, нет. Дробь уже несократимая, и трогать её не нужно.',
        'То же с семью девятыми. Числа разные, но общего делителя нет. Частая ошибка это делить числитель и знаменатель на разные числа, лишь бы стало красивее. Так делать нельзя.',
      ],
      uz: [
        "Endi to'xtash haqida. Besh oltidanni olamiz. Besh faqat birga va beshga bo'linadi, olti esa beshga bo'linmaydi.",
        "Demak, birdan boshqa umumiy bo'luvchi yo'q. Kasr allaqachon qisqarmas, unga tegish shart emas.",
        "Yetti to'qqizdan ham shunday. Sonlar har xil, lekin umumiy bo'luvchi yo'q. Tez-tez uchraydigan xato: chiroyli bo'lsin deb surat va maxrajni har xil songa bo'lish. Bunday qilish mumkin emas.",
      ],
      en: [
        'Now about stopping. Take five sixths. Five divides only by one and five, and six does not divide by five.',
        'So there is no common divisor except one. The fraction is already irreducible and needs no work.',
        'The same with seven ninths. The numbers differ, but they share no divisor. A common mistake is dividing the numerator and the denominator by different numbers just to make it look nicer. That is not allowed.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как сокращать дробь', uz: 'Kasrni qanday qisqartirish kerak', en: 'How to reduce a fraction' },
    rule_1: {
      ru: 'Сократить дробь значит разделить числитель и знаменатель на их общий делитель. Значение дроби при этом не меняется.',
      uz: "Kasrni qisqartirish surat va maxrajni ularning umumiy bo'luvchisiga bo'lish demakdir. Kasrning qiymati esa o'zgarmaydi.",
      en: 'To reduce a fraction means dividing the numerator and the denominator by their common divisor. The value does not change.',
    },
    rule_2: {
      ru: 'Дробь несократима, когда общих делителей, кроме 1, не осталось. Быстрее всего до неё доводит НОД. Полка: 18/24 = 3/4, права была Дилноза.',
      uz: "1 dan boshqa umumiy bo'luvchi qolmaganda kasr qisqarmas bo'ladi. Unga eng tez EKUB olib boradi. Javon: 18/24 = 3/4, Dilnoza haq edi.",
      en: 'A fraction is irreducible once no common divisor but 1 is left. The GCD gets there fastest. The shelf: 18/24 = 3/4, Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Сократить дробь значит разделить числитель и знаменатель на их общий делитель, значение дроби при этом не меняется. Дробь несократима, когда общих делителей, кроме единицы, больше нет, и быстрее всего к ней приводит наибольший общий делитель. Вернёмся к полке. Восемнадцать двадцать четвёртых это три четвёртых. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Kasrni qisqartirish surat va maxrajni ularning umumiy bo'luvchisiga bo'lish demak, kasrning qiymati esa o'zgarmaydi. Birdan boshqa umumiy bo'luvchi qolmaganda kasr qisqarmas bo'ladi va unga eng tez eng katta umumiy bo'luvchi olib boradi. Javonga qaytamiz. O'n sakkiz yigirma to'rtdan bu uch to'rtdan. Dilnoza haq edi.",
      en: 'Let us remember the rule. Reducing a fraction means dividing the numerator and the denominator by their common divisor, and the value does not change. A fraction is irreducible once no common divisor but one is left, and the greatest common divisor gets there fastest. Back to the shelf. Eighteen twenty fourths is three quarters. Dilnoza was right.',
    },
  },

  s_cut: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Сократи до конца', uz: 'Oxirigacha qisqartiring', en: 'Reduce all the way' },
    lead: { ru: 'Проверь: у ответа не должно остаться общего делителя.', uz: "Tekshiring: javobda umumiy bo'luvchi qolmasligi kerak.", en: 'Check: the answer must have no common divisor left.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сократи 12/18', uz: '12/18 ni qisqartiring', en: 'Reduce 12/18' },
        opts: ['6/9', '2/3', '4/6'],
        correct: 1,
        ok: { ru: 'Верно. НОД(12, 18) = 6, делим оба на 6.', uz: "To'g'ri. EKUB(12, 18) = 6, ikkalasini 6 ga bo'lamiz.", en: 'Right. GCD(12, 18) = 6, divide both by 6.' },
        wrong: [
          { ru: 'Это деление на 2, но у 6 и 9 остался общий делитель 3.', uz: "Bu 2 ga bo'lish, lekin 6 va 9 da umumiy bo'luvchi 3 qoldi.", en: 'That is division by 2, but 6 and 9 still share 3.' },
          null,
          { ru: 'Это деление на 3, но 4 и 6 ещё делятся на 2.', uz: "Bu 3 ga bo'lish, lekin 4 va 6 hali 2 ga bo'linadi.", en: 'That is division by 3, but 4 and 6 still divide by 2.' },
        ],
      },
      {
        q: { ru: 'Сократи 24/36', uz: '24/36 ni qisqartiring', en: 'Reduce 24/36' },
        opts: ['2/3', '4/6', '12/18'],
        correct: 0,
        ok: { ru: 'Верно. НОД(24, 36) = 12, делим оба на 12.', uz: "To'g'ri. EKUB(24, 36) = 12, ikkalasini 12 ga bo'lamiz.", en: 'Right. GCD(24, 36) = 12, divide both by 12.' },
        wrong: [
          null,
          { ru: 'У 4 и 6 остался общий делитель 2.', uz: "4 va 6 da umumiy bo'luvchi 2 qoldi.", en: '4 and 6 still share the divisor 2.' },
          { ru: 'Это только первый шаг: 12 и 18 делятся на 6.', uz: "Bu faqat birinchi qadam: 12 va 18 soni 6 ga bo'linadi.", en: 'That is only the first step: 12 and 18 divide by 6.' },
        ],
      },
      {
        q: { ru: 'Сократи 30/45', uz: '30/45 ni qisqartiring', en: 'Reduce 30/45' },
        opts: ['6/9', '2/3', '10/15'],
        correct: 1,
        ok: { ru: 'Верно. НОД(30, 45) = 15, получается 2/3.', uz: "To'g'ri. EKUB(30, 45) = 15, 2/3 chiqadi.", en: 'Right. GCD(30, 45) = 15, giving 2/3.' },
        wrong: [
          { ru: 'У 6 и 9 остался общий делитель 3.', uz: "6 va 9 da umumiy bo'luvchi 3 qoldi.", en: '6 and 9 still share the divisor 3.' },
          null,
          { ru: 'Это деление на 3, дальше оба делятся на 5.', uz: "Bu 3 ga bo'lish, keyin ikkalasi 5 ga bo'linadi.", en: 'That is division by 3, and both still divide by 5.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Сокращайте до конца и проверяйте, не остался ли общий делитель.',
        uz: "Mashq. Oxirigacha qisqartiring va umumiy bo'luvchi qolmaganini tekshiring.",
        en: 'Practice. Reduce all the way and check that no common divisor is left.',
      },
    },
  },

  s_find: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'На что сократить', uz: 'Nechaga qisqartirish kerak', en: 'What to divide by' },
    lead: { ru: 'Ищи наибольший общий делитель: тогда шаг будет один.', uz: "Eng katta umumiy bo'luvchini qidiring: shunda bir qadam bo'ladi.", en: 'Look for the greatest common divisor: then one step is enough.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'На какое число сразу сократится 14/21?', uz: '14/21 birdaniga nechaga qisqaradi?', en: 'What number reduces 14/21 in one step?' },
        opts: ['2', '3', '7'],
        correct: 2,
        ok: { ru: 'Верно. 14 : 7 = 2 и 21 : 7 = 3, получается 2/3.', uz: "To'g'ri. 14 : 7 = 2 va 21 : 7 = 3, 2/3 chiqadi.", en: 'Right. 14 ÷ 7 = 2 and 21 ÷ 7 = 3, giving 2/3.' },
        wrong: [
          { ru: '21 на 2 не делится: это число нечётное.', uz: "21 soni 2 ga bo'linmaydi: u toq.", en: '21 does not divide by 2: it is odd.' },
          { ru: '14 на 3 не делится: сумма цифр 5.', uz: "14 soni 3 ga bo'linmaydi: raqamlar yig'indisi 5.", en: '14 does not divide by 3: its digit sum is 5.' },
          null,
        ],
      },
      {
        q: { ru: 'На какое число сразу сократится 18/27?', uz: '18/27 birdaniga nechaga qisqaradi?', en: 'What number reduces 18/27 in one step?' },
        opts: ['3', '6', '9'],
        correct: 2,
        ok: { ru: 'Верно. НОД(18, 27) = 9, получается 2/3.', uz: "To'g'ri. EKUB(18, 27) = 9, 2/3 chiqadi.", en: 'Right. GCD(18, 27) = 9, giving 2/3.' },
        wrong: [
          { ru: 'На 3 разделить можно, но выйдет 6/9 — там ещё есть делитель 3.', uz: "3 ga bo'lish mumkin, lekin 6/9 chiqadi — u yerda yana 3 bor.", en: 'Dividing by 3 works, but gives 6/9, which still has the divisor 3.' },
          { ru: '27 на 6 не делится.', uz: "27 soni 6 ga bo'linmaydi.", en: '27 does not divide by 6.' },
          null,
        ],
      },
      {
        q: { ru: 'На какое число сразу сократится 40/50?', uz: '40/50 birdaniga nechaga qisqaradi?', en: 'What number reduces 40/50 in one step?' },
        opts: ['5', '10', '20'],
        correct: 1,
        ok: { ru: 'Верно. НОД(40, 50) = 10, получается 4/5.', uz: "To'g'ri. EKUB(40, 50) = 10, 4/5 chiqadi.", en: 'Right. GCD(40, 50) = 10, giving 4/5.' },
        wrong: [
          { ru: 'На 5 выйдет 8/10, а там ещё есть делитель 2.', uz: "5 ga bo'lsak 8/10 chiqadi, u yerda yana 2 bor.", en: 'By 5 you get 8/10, which still has the divisor 2.' },
          null,
          { ru: '50 на 20 не делится без остатка.', uz: "50 soni 20 ga qoldiqsiz bo'linmaydi.", en: '50 does not divide by 20 without a remainder.' },
        ],
      },
      {
        q: { ru: 'На какое число сразу сократится 21/28?', uz: '21/28 birdaniga nechaga qisqaradi?', en: 'What number reduces 21/28 in one step?' },
        opts: ['3', '4', '7'],
        correct: 2,
        ok: { ru: 'Верно. 21 : 7 = 3 и 28 : 7 = 4, получается 3/4.', uz: "To'g'ri. 21 : 7 = 3 va 28 : 7 = 4, 3/4 chiqadi.", en: 'Right. 21 ÷ 7 = 3 and 28 ÷ 7 = 4, giving 3/4.' },
        wrong: [
          { ru: '28 на 3 не делится: сумма цифр 10.', uz: "28 soni 3 ga bo'linmaydi: raqamlar yig'indisi 10.", en: '28 does not divide by 3: its digit sum is 10.' },
          { ru: '21 на 4 не делится.', uz: "21 soni 4 ga bo'linmaydi.", en: '21 does not divide by 4.' },
          null,
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Ищем, на что сократить. Число должно делить и числитель, и знаменатель.',
        uz: "Nechaga qisqartirishni qidiramiz. Son suratni ham, maxrajni ham bo'lishi kerak.",
        en: 'Find what to divide by. The number must divide both the numerator and the denominator.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Сократится или нет', uz: "Qisqaradimi yoki yo'q", en: 'Reducible or not' },
    lead: { ru: 'Дробь несократима, если общих делителей, кроме 1, нет.', uz: "1 dan boshqa umumiy bo'luvchi bo'lmasa, kasr qisqarmas.", en: 'A fraction is irreducible if it has no common divisor but 1.' },
    bin_a: { ru: 'Сократится', uz: 'Qisqaradi', en: 'Reducible' },
    bin_b: { ru: 'Уже несократима', uz: 'Allaqachon qisqarmas', en: 'Already irreducible' },
    cards: [
      { label: '9/12', bin: 'a' },
      { label: '5/8', bin: 'b' },
      { label: '14/35', bin: 'a' },
      { label: '7/10', bin: 'b' },
      { label: '22/33', bin: 'a' },
      { label: '9/16', bin: 'b' },
    ],
    hint: {
      ru: 'Проверь признаки: делятся ли оба числа на 2, на 3, на 5.',
      uz: "Alomatlarni tekshiring: ikkala son 2 ga, 3 ga, 5 ga bo'linadimi.",
      en: 'Check the signs: do both numbers divide by 2, by 3, by 5.',
    },
    correct_text: {
      ru: 'Верно. 9/12 сокращается на 3, 14/35 на 7, 22/33 на 11. А у 5/8, 7/10 и 9/16 общих делителей нет.',
      uz: "To'g'ri. 9/12 uchga, 14/35 yettiga, 22/33 o'n birga qisqaradi. 5/8, 7/10 va 9/16 da esa umumiy bo'luvchi yo'q.",
      en: 'Right. 9/12 reduces by 3, 14/35 by 7, 22/33 by 11. And 5/8, 7/10 and 9/16 share no divisors.',
    },
    audio: {
      intro: {
        ru: 'Разложите дроби по двум корзинам. Сократится или уже несократима.',
        uz: "Kasrlarni ikki savatga ajrating. Qisqaradimi yoki allaqachon qisqarmasmi.",
        en: 'Sort the fractions into two baskets: reducible or already irreducible.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Поищи общий делитель.', uz: "Bu yerga emas. Umumiy bo'luvchini qidiring.", en: 'Not here. Look for a common divisor.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз сократил 15/25 так: 3/4. Что не так?', uz: "Aziz 15/25 ni shunday qisqartirdi: 3/4. Nimasi noto'g'ri?", en: 'Aziz reduced 15/25 to 3/4. What is wrong?' },
        opts: [
          { ru: 'Числа разделили на разные числа', uz: "Sonlar har xil songa bo'lingan", en: 'The numbers were divided by different numbers' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: 'Надо было делить на 3', uz: "3 ga bo'lish kerak edi", en: 'He should have divided by 3' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 15 разделили на 5, а 25 на 6 с лишним. Правильно 15/25 : 5 = 3/5.', uz: "To'g'ri. 15 ni 5 ga, 25 ni esa boshqa songa bo'lgan. To'g'risi 15/25 : 5 = 3/5.", en: 'Right. 15 was divided by 5 and 25 by something else. The correct answer is 15/25 ÷ 5 = 3/5.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: 3/4 больше, чем 15/25, а значение должно сохраниться.', uz: "Xato bor: 3/4 soni 15/25 dan katta, qiymat esa saqlanishi kerak.", en: 'There is a mistake: 3/4 is bigger than 15/25, and the value must be preserved.' },
          { ru: 'На 3 нельзя: ни 15, ни 25 не дают целых при таком делении пары.', uz: "3 ga bo'lib bo'lmaydi: 25 soni 3 ga bo'linmaydi.", en: 'Three will not work: 25 does not divide by 3.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «11/13 сократим на 2». Проверь.', uz: "Dilnoza: «11/13 ni 2 ga qisqartiramiz». Tekshiring.", en: 'Dilnoza: “11/13 reduces by 2.” Check it.' },
        opts: [
          { ru: 'Нет: 11 и 13 простые, дробь несократима', uz: "Yo'q: 11 va 13 tub, kasr qisqarmas", en: 'No: 11 and 13 are prime, the fraction is irreducible' },
          { ru: 'Да, сократится', uz: 'Ha, qisqaradi', en: 'Yes, it reduces' },
          { ru: 'Сократится, но на 3', uz: 'Qisqaradi, lekin 3 ga', en: 'It reduces, but by 3' },
        ],
        correct: 0,
        ok: { ru: 'Верно. У простых чисел делители только 1 и они сами, общего делителя нет.', uz: "To'g'ri. Tub sonlarning bo'luvchisi faqat 1 va o'zi, umumiy bo'luvchi yo'q.", en: 'Right. A prime has only 1 and itself as divisors, so there is no common one.' },
        wrong: [
          null,
          { ru: '11 и 13 нечётные, на 2 они не делятся.', uz: "11 va 13 toq, ular 2 ga bo'linmaydi.", en: '11 and 13 are odd, they do not divide by 2.' },
          { ru: 'На 3 тоже нет: суммы цифр 2 и 4.', uz: "3 ga ham bo'linmaydi: raqamlar yig'indisi 2 va 4.", en: 'Not by 3 either: the digit sums are 2 and 4.' },
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
    title: { ru: 'Работы сданы', uz: 'Ishlar topshirildi', en: 'Papers handed in' },
    lead: { ru: 'В классе 36 учеников, работы сдали 27.', uz: "Sinfda 36 o'quvchi bor, 27 tasi ish topshirdi.", en: 'There are 36 students in the class and 27 handed in their papers.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какая часть класса сдала работу?', uz: 'Sinfning qaysi qismi ish topshirdi?', en: 'What part of the class handed in the work?' },
        opts: ['3/4', '2/3', '27/36 сократить нельзя'],
        correct: 0,
        ok: { ru: 'Верно. НОД(27, 36) = 9, получается 3/4.', uz: "To'g'ri. EKUB(27, 36) = 9, 3/4 chiqadi.", en: 'Right. GCD(27, 36) = 9, giving 3/4.' },
        wrong: [
          null,
          { ru: '2/3 — это 24 ученика из 36, а сдали 27.', uz: "2/3 bu 36 dan 24 o'quvchi, topshirgani esa 27.", en: '2/3 would be 24 students out of 36, but 27 handed in.' },
          { ru: 'Сократить можно: и 27, и 36 делятся на 9.', uz: "Qisqartirish mumkin: 27 ham, 36 ham 9 ga bo'linadi.", en: 'It can be reduced: both 27 and 36 divide by 9.' },
        ],
      },
      {
        q: { ru: 'Какая часть класса ещё не сдала?', uz: 'Sinfning qaysi qismi hali topshirmadi?', en: 'What part of the class has not handed in yet?' },
        opts: ['1/4', '1/3', '9/36 сократить нельзя'],
        correct: 0,
        ok: { ru: 'Верно. Не сдали 9 из 36, а 9/36 сокращается на 9: получается 1/4.', uz: "To'g'ri. 36 dan 9 tasi topshirmadi, 9/36 esa 9 ga qisqaradi: 1/4 chiqadi.", en: 'Right. Nine of 36 have not, and 9/36 reduces by 9 to 1/4.' },
        wrong: [
          null,
          { ru: '1/3 — это 12 учеников, а не сдали 9.', uz: "1/3 bu 12 o'quvchi, topshirmagani esa 9 ta.", en: 'A third would be 12 students, but 9 have not handed in.' },
          { ru: 'Сокращается: 9 и 36 делятся на 9.', uz: "Qisqaradi: 9 va 36 soni 9 ga bo'linadi.", en: 'It does reduce: 9 and 36 both divide by 9.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про класс. Тридцать шесть учеников, работы сдали двадцать семь.',
        uz: "Sinf haqida masala. O'ttiz olti o'quvchi, ish topshirgani yigirma yetti.",
        en: 'A class problem. Thirty six students, twenty seven handed in their papers.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 5,
        q: { ru: 'Сократи 24/40 до конца. Какой будет знаменатель? Набери ответ.', uz: '24/40 ni oxirigacha qisqartiring. Maxraj nechaga teng? Javobni tering.', en: 'Reduce 24/40 all the way. What is the denominator? Type the answer.' },
        hint: { ru: 'НОД(24, 40) = 8. Раздели оба числа на 8.', uz: "EKUB(24, 40) = 8. Ikkala sonni 8 ga bo'ling.", en: 'GCD(24, 40) = 8. Divide both numbers by 8.' },
        hint_audio: { ru: 'Наибольший общий делитель двадцати четырёх и сорока восемь. Разделите оба числа на восемь.', uz: "Yigirma to'rt va qirqning eng katta umumiy bo'luvchisi sakkiz. Ikkala sonni sakkizga bo'ling.", en: 'The greatest common divisor of twenty four and forty is eight. Divide both numbers by eight.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Какая дробь несократима?', uz: 'Qaysi kasr qisqarmas?', en: 'Which fraction is irreducible?' },
        opts: ['6/9', '8/9', '9/12', '10/16'],
        wrong: [
          { ru: '6/9 сокращается на 3: 2/3.', uz: '6/9 uchga qisqaradi: 2/3.', en: '6/9 reduces by 3 to 2/3.' },
          null,
          { ru: '9/12 сокращается на 3: 3/4.', uz: '9/12 uchga qisqaradi: 3/4.', en: '9/12 reduces by 3 to 3/4.' },
          { ru: '10/16 сокращается на 2: 5/8.', uz: '10/16 ikkiga qisqaradi: 5/8.', en: '10/16 reduces by 2 to 5/8.' },
        ],
        correct: { ru: 'Верно. У 8 и 9 общих делителей, кроме 1, нет.', uz: "To'g'ri. 8 va 9 da 1 dan boshqa umumiy bo'luvchi yo'q.", en: 'Right. 8 and 9 share no divisor but 1.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Что происходит со значением дроби при сокращении?', uz: "Qisqartirishda kasrning qiymati bilan nima bo'ladi?", en: 'What happens to the value when you reduce?' },
        opts: [
          { ru: 'Уменьшается', uz: 'Kamayadi', en: 'It decreases' },
          { ru: 'Увеличивается', uz: 'Ortadi', en: 'It increases' },
          { ru: 'Не меняется', uz: "O'zgarmaydi", en: 'It stays the same' },
          { ru: 'Зависит от числа', uz: "Songa bog'liq", en: 'It depends on the number' },
        ],
        wrong: [
          { ru: 'Меньше становятся числа, а не сама дробь.', uz: "Sonlar kichrayadi, kasrning o'zi emas.", en: 'The numbers get smaller, not the fraction.' },
          { ru: 'Больше она тоже не становится.', uz: 'U kattalashmaydi ham.', en: 'It does not grow either.' },
          null,
          { ru: 'Не зависит: значение сохраняется при любом общем делителе.', uz: "Bog'liq emas: har qanday umumiy bo'luvchida qiymat saqlanadi.", en: 'It does not depend: the value is preserved for any common divisor.' },
        ],
        correct: { ru: 'Верно. Меняется запись, а число остаётся тем же.', uz: "To'g'ri. Yozuv o'zgaradi, son esa o'sha bo'lib qoladi.", en: 'Right. The notation changes, the number stays.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Сколько шагов нужно, если делить на НОД?', uz: "EKUB ga bo'lsak, necha qadam kerak?", en: 'How many steps are needed when dividing by the GCD?' },
        opts: [
          { ru: 'Столько же, сколько простых множителей', uz: "Tub ko'paytuvchilar soncha", en: 'As many as there are prime factors' },
          { ru: 'Два', uz: 'Ikki', en: 'Two' },
          { ru: 'Зависит от числителя', uz: "Suratga bog'liq", en: 'It depends on the numerator' },
          { ru: 'Один', uz: 'Bitta', en: 'One' },
        ],
        wrong: [
          { ru: 'Так выходит при делении по одному множителю, а НОД берёт их все сразу.', uz: "Bu bittalab bo'lganda shunday, EKUB esa hammasini birdan oladi.", en: 'That happens when dividing factor by factor; the GCD takes them all at once.' },
          { ru: 'Двух шагов не нужно: НОД уже содержит все общие множители.', uz: "Ikki qadam kerak emas: EKUB barcha umumiy ko'paytuvchilarni o'zida saqlaydi.", en: 'Two steps are not needed: the GCD already holds every common factor.' },
          { ru: 'От числителя это не зависит.', uz: "Bu suratga bog'liq emas.", en: 'It does not depend on the numerator.' },
          null,
        ],
        correct: { ru: 'Верно. НОД собирает все общие множители, поэтому шаг один.', uz: "To'g'ri. EKUB barcha umumiy ko'paytuvchilarni yig'adi, shuning uchun qadam bitta.", en: 'Right. The GCD collects every common factor, so one step is enough.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'В корзине 16 яблок, 12 из них красные. Какая часть красная?', uz: 'Savatda 16 olma bor, 12 tasi qizil. Qaysi qismi qizil?', en: 'A basket has 16 apples and 12 are red. What part is red?' },
        opts: ['3/4', '2/3', '4/5', '12/16 сократить нельзя'],
        wrong: [
          null,
          { ru: '2/3 от 16 не даёт целого числа яблок.', uz: "16 ning 2/3 qismi butun olma bermaydi.", en: 'Two thirds of 16 is not a whole number of apples.' },
          { ru: '4/5 — это больше, чем 12 из 16.', uz: "4/5 bu 16 dan 12 tadan ko'proq.", en: 'Four fifths is more than 12 out of 16.' },
          { ru: 'Сокращается: НОД(12, 16) = 4.', uz: 'Qisqaradi: EKUB(12, 16) = 4.', en: 'It does reduce: GCD(12, 16) = 4.' },
        ],
        correct: { ru: 'Верно. 12/16 сокращается на 4 и даёт 3/4.', uz: "To'g'ri. 12/16 to'rtga qisqaradi va 3/4 beradi.", en: 'Right. 12/16 reduces by 4 to 3/4.' },
      },
    ],
    audio: {
      intro: {
        ru: 'Финальная проверка. Пять заданий на весь урок. Первое с набором числа, остальные с выбором.',
        uz: "Yakuniy tekshiruv. Butun darsga beshta topshiriq. Birinchisida son teriladi, qolganlarida tanlanadi.",
        en: 'The final check. Five tasks covering the whole lesson. The first needs a typed number, the rest are multiple choice.',
      },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Right.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' },
    },
    fact: {
      ru: 'Экран телефона и телевизора описывают сокращённой дробью. Кадр 1920 на 1080 точек — это отношение 16 к 9: обе стороны разделили на 120.',
      uz: "Telefon va televizor ekrani qisqartirilgan kasr bilan tasvirlanadi. 1920 ga 1080 nuqtali kadr bu 16 ning 9 ga nisbati: ikkala tomon 120 ga bo'lingan.",
      en: 'Phone and television screens are described by a reduced fraction. A 1920 by 1080 frame is a ratio of 16 to 9: both sides were divided by 120.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Размер экрана записывают сокращённой дробью. Кадр тысяча девятьсот двадцать на тысяча восемьдесят точек это отношение шестнадцать к девяти. Обе стороны разделили на сто двадцать.',
      uz: "Bilasizmi? Ekran o'lchami qisqartirilgan kasr bilan yoziladi. Ming to'qqiz yuz yigirmaga ming sakson nuqtali kadr bu o'n oltining to'qqizga nisbati. Ikkala tomon yuz yigirmaga bo'lingan.",
      en: 'Did you know? Screen size is written as a reduced fraction. A frame of one thousand nine hundred twenty by one thousand eighty dots is a ratio of sixteen to nine. Both sides were divided by one hundred twenty.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Дроби', uz: 'Matematika · Kasrlar', en: 'Mathematics · Fractions' },
    heading: { ru: 'Сокращение дробей', uz: 'Kasrlarni qisqartirish', en: 'Reducing fractions' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'делим оба числа на общий делитель', uz: "ikkala sonni umumiy bo'luvchiga bo'lamiz", en: 'divide both by a common divisor' },
    brief_2: { ru: 'значение дроби не меняется', uz: "kasrning qiymati o'zgarmaydi", en: 'the value does not change' },
    brief_3: { ru: 'НОД доводит до несократимой за шаг', uz: 'EKUB bir qadamda qisqarmasga olib boradi', en: 'the GCD gets there in one step' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Сократить', uz: 'Qisqartirish', en: 'To reduce' },
    memo_a1: { ru: 'разделить оба числа на общий делитель', uz: "ikkala sonni umumiy bo'luvchiga bo'lish", en: 'divide both by a common divisor' },
    memo_q2: { ru: 'Несократимая', uz: 'Qisqarmas', en: 'Irreducible' },
    memo_a2: { ru: 'общих делителей, кроме 1, нет', uz: "1 dan boshqa umumiy bo'luvchi yo'q", en: 'no common divisor but 1' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'делить числа на разные множители', uz: "sonlarni har xil songa bo'lish", en: 'dividing the numbers by different factors' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Сократить дробь значит разделить числитель и знаменатель на их общий делитель. Значение при этом сохраняется. Дробь несократима, когда общих делителей, кроме единицы, больше нет.',
        'Полка в библиотеке занята на три четверти, и восемнадцать двадцать четвёртых это та же самая часть.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Kasrni qisqartirish surat va maxrajni ularning umumiy bo'luvchisiga bo'lish demak. Qiymat esa saqlanadi. Birdan boshqa umumiy bo'luvchi qolmaganda kasr qisqarmas bo'ladi.",
        "Kutubxonadagi javonning uchdan to'rt qismi band, o'n sakkiz yigirma to'rtdan esa o'sha qismning o'zi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Reducing a fraction means dividing the numerator and the denominator by their common divisor. The value is preserved. A fraction is irreducible once no common divisor but one is left.',
        'The library shelf is three quarters full, and eighteen twenty fourths is exactly the same part.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Сокращать до конца', uz: 'Usul. Oxirigacha qisqartirish', en: 'Method. Reduce all the way' },
    m1_steps: {
      ru: ['Найди общий делитель числителя и знаменателя', 'Раздели на него оба числа', 'Повтори, пока общий делитель находится'],
      uz: ["Surat va maxrajning umumiy bo'luvchisini toping", "Ikkala sonni unga bo'ling", "Umumiy bo'luvchi topilgunicha takrorlang"],
      en: ['Find a common divisor of the numerator and denominator', 'Divide both numbers by it', 'Repeat while a common divisor exists'],
    },
    m1_no: {
      ru: 'Быстрее всего делить сразу на НОД: 16/24 делим на 8 и получаем 2/3 без повторов.',
      uz: "Eng tez yo'l birdaniga EKUB ga bo'lish: 16/24 ni 8 ga bo'lamiz va takrorsiz 2/3 chiqadi.",
      en: 'Fastest is dividing by the GCD at once: 16/24 divided by 8 gives 2/3 with no repeats.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьная библиотека. На хуке вопрос, в итоге ответ.
// ============================================================
const SPINES = ['#E8A33C', '#D98A5A', '#7ECBE6', '#C9A472', '#E9C489', '#B98A6A'];

// Полка: total мест, filled занято. Рисуется и в сцене, и в итоге.
const ShelfSvg = ({ x, y, w, h, total, filled, gap = 1.6 }) => {
  const step = w / total;
  return (
    <g>
      <rect x={x - 4} y={y - 4} width={w + 8} height={h + 9} rx="3" fill="#C9A472"/>
      <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx="2" fill="#F7F0E2"/>
      {Array.from({ length: total }, (_, i) => {
        const bx = x + step * i + gap / 2;
        const bw = step - gap;
        const on = i < filled;
        const tall = on ? h - (i % 3) * 2 : h;
        return (
          <rect key={i} x={bx} y={y + (h - tall)} width={bw} height={tall} rx="1"
            fill={on ? SPINES[i % SPINES.length] : '#EFE7D8'}
            stroke={on ? 'rgba(90,62,34,0.25)' : '#E2D8C4'} strokeWidth="0.6"/>
        );
      })}
      <rect x={x - 4} y={y + h + 4} width={w + 8} height="4" rx="2" fill="#B08A57"/>
    </g>
  );
};

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d8wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d8wall)"/>

    {/* Боковые стеллажи: библиотека, а не одна полка в пустоте */}
    <g opacity="0.75">
      <rect x="6" y="14" width="82" height="98" rx="3" fill="#E5DAC6"/>
      <ShelfSvg x={12} y={22} w={70} h={20} total={9} filled={9}/>
      <ShelfSvg x={12} y={56} w={70} h={20} total={9} filled={7}/>
      <ShelfSvg x={12} y={90} w={70} h={16} total={9} filled={8}/>
    </g>
    <g opacity="0.75">
      <rect x="312" y="14" width="82" height="98" rx="3" fill="#E5DAC6"/>
      <ShelfSvg x={318} y={22} w={70} h={20} total={9} filled={8}/>
      <ShelfSvg x={318} y={56} w={70} h={20} total={9} filled={9}/>
      <ShelfSvg x={318} y={90} w={70} h={16} total={9} filled={6}/>
    </g>

    {/* Спорная полка: 24 места, 18 книг */}
    <ShelfSvg x={116} y={36} w={168} h={30} total={24} filled={18}/>

    {/* Табличка над полкой покачивается */}
    <g className="d8-sign">
      <path d="M200 8 v10" stroke="#B08A57" strokeWidth="1.6"/>
      <rect x="176" y="18" width="48" height="12" rx="3" fill="#FBF3D6" stroke="#C9A472"/>
    </g>

    {/* Дети у стойки */}
    <Person x={150} ground={122} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={250} ground={122} head={13} shirt="#F5C77E" hair="#5A4636"/>

    {/* Стойка выдачи стоит ПЕРЕД людьми */}
    <rect x="0" y="118" width="400" height="36" fill="#D2A96F"/>
    <rect x="0" y="118" width="400" height="5" fill="#C9884A"/>

    {/* Настольная лампа, стопка книг и штамп на стойке */}
    <g>
      <path d="M306 118 v-16 h4 v16 Z" fill="#B08A57"/>
      <path d="M296 102 h24 l-6 -12 h-12 Z" fill="#E8A33C"/>
      <circle cx="308" cy="104" r="3" fill="#FBF3D6" className="d8-lamp"/>
    </g>
    <g>
      <rect x="42" y="132" width="46" height="6" rx="2" fill="#7ECBE6" stroke="rgba(90,62,34,0.25)"/>
      <rect x="46" y="126" width="42" height="6" rx="2" fill="#E8A33C" stroke="rgba(90,62,34,0.25)"/>
      <rect x="44" y="120" width="44" height="6" rx="2" fill="#C9A472" stroke="rgba(90,62,34,0.25)"/>
    </g>
    <g>
      <rect x="196" y="128" width="14" height="10" rx="2" fill="#8E8578"/>
      <rect x="200" y="122" width="6" height="7" rx="2" fill="#5A4636"/>
    </g>

    {/* Тележка с книгами едет вдоль стойки */}
    <g className="d8-cart">
      <rect x="330" y="130" width="46" height="16" rx="2" fill="#B08A57"/>
      <rect x="334" y="122" width="38" height="8" rx="2" fill="#D98A5A" stroke="rgba(90,62,34,0.25)"/>
      <circle cx="340" cy="149" r="4" fill="#3B3730"/>
      <circle cx="366" cy="149" r="4" fill="#3B3730"/>
    </g>
  </svg>
);

// Итог: 18 из 24 и 3 из 4 — одна и та же часть.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <ShelfSvg x={24} y={26} w={140} h={34} total={24} filled={18}/>
    <ShelfSvg x={236} y={26} w={140} h={34} total={4} filled={3} gap={3}/>
    <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
      <text x="200" y="42" textAnchor="middle" fontSize="18">=</text>
      <text x="94" y="82" textAnchor="middle" fontSize="13">18 / 24</text>
      <text x="306" y="82" textAnchor="middle" fontSize="13">3 / 4</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Полка как счётный материал: клетки видно и можно пересчитать.
const Books = ({ total, filled, tone = 'a', size = 'mid' }) => (
  <span className={'d8-books d8-books-' + tone + ' d8-books-' + size}>
    {Array.from({ length: total }, (_, i) => <i key={i} className={i < filled ? 'on' : ''}/>)}
  </span>
);

const FracRow = ({ n, d, total = null, tone = 'a', tag = null, size = 'mid' }) => (
  <span className="d8-frac-row">
    <Books total={total || d} filled={total ? Math.round((n / d) * total) : n} tone={tone} size={size}/>
    <Frac n={n} d={d} size={size === 'sm' ? 'sm' : 'mid'}/>
    {tag && <span className="d8-tag">{tag}</span>}
  </span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d8-stage">
        <FracRow n={c.from.n} d={c.from.d}/>
        <span className={'d8-op' + (step >= 1 ? ' d8-on' : '')}>: 2</span>
        <span className={'d8-fade' + (step >= 2 ? ' d8-on' : '')}>
          <FracRow n={c.to.n} d={c.to.d} tone="ok"/>
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

// Ядро: полка на 24 места сокращается до 3/4, занятая часть не меняется.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d8-stage">
        {c.rows.map((r, i) => (
          <span key={r.d} className={'d8-chain d8-fade' + (step >= i ? ' d8-on' : '')}>
            <FracRow n={r.n} d={r.d} tone={r.by ? 'a' : 'ok'} size={r.d > 12 ? 'sm' : 'mid'}/>
            {r.by && <span className="d8-op d8-on">: {r.by}</span>}
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

const GcdBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_gcd;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d8-stage">
        <FracRow n={c.from.n} d={c.from.d} size="sm"/>
        <span className={'d8-gcd' + (step >= 1 ? ' d8-on' : '')}>
          <span className="d8-gcd-k">{tri(useLang(), 'НОД', 'EKUB', 'GCD')}</span>
          <b>{c.gcd}</b>
        </span>
        <span className={'d8-fade' + (step >= 2 ? ' d8-on' : '')}>
          <FracRow n={c.to.n} d={c.to.d} tone="ok"/>
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
  const rows = [{ n: 45, d: 60 }, { n: 9, d: 12 }, { n: 3, d: 4 }];
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d8-stage">
        {rows.map((r, i) => (
          <span key={i} className={'d8-solve-row d8-fade' + (step >= i ? ' d8-on' : '')}>
            <Books total={12} filled={Math.round((r.n / r.d) * 12)} tone={i === 2 ? 'ok' : 'a'} size="mid"/>
            <span className="d8-solve-t">{mt(t(c.steps[i]))}</span>
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

// Граница: где остановиться. Делители выписаны, общий только 1.
const DIVISORS = { 5: [1, 5], 6: [1, 2, 3, 6], 7: [1, 7], 9: [1, 3, 9] };

const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  const pair = (f, show) => (
    <span className={'d8-pair d8-fade' + (show ? ' d8-on' : '')}>
      <Frac n={f.n} d={f.d} size="mid"/>
      <span className="d8-divs">
        <i>{DIVISORS[f.n].join(', ')}</i>
        <i>{DIVISORS[f.d].join(', ')}</i>
      </span>
    </span>
  );
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d8-stage">
        {pair(c.good, step >= 0)}
        {pair(c.bad, step >= 2)}
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
        <div className={'d8-banner fade-up delay-1' + (phase === 'play' ? ' d8-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d8-stage">
          {phase === 'demo' ? (
            <>
              {c.demo_rows.map((r, i) => (
                <span key={r.d} className={'d8-chain d8-fade' + (shown >= i ? ' d8-on' : '')}>
                  <FracRow n={r.n} d={r.d} tone={r.by ? 'a' : 'ok'} size={r.d > 12 ? 'sm' : 'mid'}/>
                  {r.by && <span className="d8-op d8-on">: {r.by}</span>}
                </span>
              ))}
              <p className={'body d8-verdict' + (done ? ' d8-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={o} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{mt(o)}</button>
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
          <div className="d8-acts fade-up">
            <button className="d8-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d8-btn d8-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenGcd = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_gcd} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <GcdBody step={step}/>}/>
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
      <div className="d8-stage">
        <FracRow n={18} d={24} size="sm"/>
        <span className="d8-op d8-on">: 6</span>
        <FracRow n={3} d={4} tone="ok"/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenCut = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_cut} asideNode={methodAside}/>
);
const ScreenFind = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_find} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: класс из 36 человек, сдали 27.
const TaskFig = ({ idx }) => (
  <div className="d8-task-fig">
    <Books total={36} filled={idx >= 1 ? 9 : 27} tone={idx >= 1 ? 'b' : 'a'} size="sm"/>
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
.d8-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }

/* Полка как счётный материал */
.d8-books { display: inline-flex; gap: 2px; }
.d8-books i { display: block; border-radius: 2px; background: #F3EFE6; border: 1px solid #E9E3D9; }
.d8-books-mid i { width: clamp(8px, 1.6vw, 13px); height: clamp(22px, 3.8vw, 32px); }
.d8-books-sm i { width: clamp(5px, 1.1vw, 9px); height: clamp(18px, 3vw, 26px); }
.d8-books-a i.on { background: #E8A33C; border-color: #C9884A; }
.d8-books-b i.on { background: #7ECBE6; border-color: #019ACB; }
.d8-books-ok i.on { background: #7FBF95; border-color: #1F7A4D; }

.d8-frac-row { display: inline-flex; align-items: center; gap: clamp(8px, 1.8vw, 15px); flex-wrap: wrap; justify-content: center; }
.d8-chain { display: flex; align-items: center; gap: clamp(8px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; }
.d8-fade { opacity: 0; transition: opacity 420ms linear; }
.d8-on { opacity: 1; }
.d8-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 19px); font-weight: 700; color: #C99B3A; background: #FBF3D6; border-radius: 9px; padding: 4px 10px; opacity: 0; transition: opacity 380ms linear; }
.d8-tag { font-size: clamp(12px, 2vw, 15px); color: #8A8883; }

/* НОД одним шагом */
.d8-gcd { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border-radius: 11px; background: #E3F0E8; opacity: 0; transition: opacity 380ms linear; }
.d8-gcd-k { font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; color: #1F7A4D; letter-spacing: 0.04em; }
.d8-gcd b { font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 25px); color: #1F7A4D; }

/* Решаем вместе */
.d8-solve-row { display: flex; align-items: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; justify-content: center; }
.d8-solve-t { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 19px); font-weight: 700; color: #494550; }

/* Делители на экране границы */
.d8-pair { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.2vw, 18px); width: 100%; padding: clamp(8px, 1.6vw, 12px); border-radius: 14px; background: #FFFDF7; border: 1px solid #E9E3D9; }
.d8-divs { display: flex; flex-direction: column; gap: 4px; }
.d8-divs i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.3vw, 17px); color: #8A8883; }

/* Задача */
.d8-task-fig { display: flex; justify-content: center; }

/* Экран 4 */
.d8-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(14px, 2.4vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 6px 13px; }
.d8-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d8-verdict { margin: 0; min-height: 22px; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d8-verdict-on { opacity: 1; }
.d8-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d8-btn { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d8-btn:disabled { opacity: 0.45; cursor: default; }
.d8-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d8-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: тележка едет, табличка качается, лампа горит */
.d8-cart { animation: d8Cart 6000ms ease-in-out infinite; }
@keyframes d8Cart { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-22px); } }
.d8-sign { transform-origin: 200px 8px; animation: d8Sign 4200ms ease-in-out infinite; }
@keyframes d8Sign { 0%, 100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
.d8-lamp { animation: d8Lamp 3000ms ease-in-out infinite; }
@keyframes d8Lamp { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d8-cart, .d8-sign, .d8-lamp { animation: none; } }

@media (max-width: 639.98px) {
  .d8-books-mid i { width: 7px; height: 20px; }
  .d8-books-sm i { width: 4px; height: 16px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function ReduceFractionsLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenGcd, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenCut, ScreenFind, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
