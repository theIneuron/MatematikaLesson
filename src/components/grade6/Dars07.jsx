// ============================================================
// 6 КЛАСС, УРОК 7 «Основное свойство дроби»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Сюжет блока: школа после уроков. 6 — остановка, 7 — классный час с пиццей.
// Этот урок — МОСТИК из делимости в дроби: расширяют кратными, сокращают
// делителями, а самый короткий путь даёт НОД из урока 5.
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
  lessonId: 'grade6-07',
  lessonTitle: {
    ru: 'Основное свойство дроби',
    uz: 'Kasrning asosiy xossasi',
    en: 'The basic property of a fraction',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 sinf soati: 1/2 va 2/4
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 surat va maxraj
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 bo'laklar ikki barobar, qism o'sha
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL 1: kengaytirish
  { id: 's_short',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 USUL 2: qisqartirish
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 18/24
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: IKKALASI ham
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_equal',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 teng kasrlar x3
  { id: 's_mult',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 ko'paytuvchini top x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: 1/2 ga teng
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: pitsa
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: { ru: 'Пицца: 1/2 или 2/4?', uz: 'Pitsa: 1/2 yoki 2/4?', en: 'Pizza: 1/2 or 2/4?' },
    lead: {
      ru: 'На классном часе две одинаковые пиццы. Одну разрезали пополам, другую на четыре части.',
      uz: "Sinf soatida ikkita bir xil pitsa bor. Birini teng ikkiga, ikkinchisini to'rtga bo'lishdi.",
      en: 'Two identical pizzas at the class hour. One is cut in half, the other into four.',
    },
    voice_a: { ru: 'Азиз: мне дали 1/2 — больше.', uz: "Aziz: menga 1/2 berishdi, ko'proq.", en: 'Aziz: I got 1/2, that is more.' },
    voice_b: { ru: 'Дилноза: у меня 2/4 — столько же.', uz: 'Dilnoza: menda 2/4, xuddi shuncha.', en: 'Dilnoza: I have 2/4, the same.' },
    ask: { ru: 'У кого кусок больше?', uz: "Kimning ulushi kattaroq?", en: 'Whose share is bigger?' },
    options: [
      { ru: 'У Азиза больше', uz: "Azizniki kattaroq", en: 'Aziz has more' },
      { ru: 'Поровну', uz: 'Teng', en: 'The same' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: "Variantlardan birini bosing. Javobni dars davomida tekshiramiz.",
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'На классном часе две одинаковые пиццы. Одну разрезали пополам, другую на четыре части. Азизу дали одну вторую, Дилнозе две четвёртых.',
          'Азиз говорит, что у него больше, а Дилноза что поровну. Как ты думаешь, у кого кусок больше? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Sinf soatida ikkita bir xil pitsa bor. Birini teng ikkiga, ikkinchisini to'rtga bo'lishdi. Azizga bir ikkidan, Dilnozaga ikki to'rtdan berildi.",
          "Aziz meniki ko'proq deydi, Dilnoza esa teng deydi. Sizningcha kimning ulushi kattaroq? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'Two identical pizzas at the class hour. One is cut in half, the other into four. Aziz got one half, Dilnoza got two quarters.',
          'Aziz says his share is bigger, Dilnoza says they are equal. What do you think, whose share is bigger? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Числитель и знаменатель', uz: 'Surat va maxraj', en: 'Numerator and denominator' },
    cap_den: { ru: 'знаменатель: на сколько частей разрезали', uz: "maxraj: nechaga bo'lingan", en: 'denominator: how many parts' },
    cap_num: { ru: 'числитель: сколько взяли', uz: 'surat: nechtasi olingan', en: 'numerator: how many taken' },
    done: {
      ru: 'Знаменатель говорит про размер куска, числитель — про их количество.',
      uz: "Maxraj bo'lak kattaligini, surat esa ularning sonini aytadi.",
      en: 'The denominator tells the size of a piece, the numerator how many you take.',
    },
    audio: {
      ru: [
        'Вспомним, что означают числа в дроби. Нижнее число, знаменатель, говорит, на сколько равных частей разрезали целое.',
        'Верхнее число, числитель, говорит, сколько таких частей взяли.',
        'Значит знаменатель отвечает за размер куска, а числитель за их количество.',
      ],
      uz: [
        "Kasrdagi sonlar nimani anglatishini eslaymiz. Pastki son, maxraj, butun necha teng bo'lakka bo'linganini aytadi.",
        "Yuqoridagi son, surat, shunday bo'laklardan nechtasi olinganini aytadi.",
        "Demak maxraj bo'lak kattaligini, surat esa ularning sonini bildiradi.",
      ],
      en: [
        'Let us recall what the numbers in a fraction mean. The lower one, the denominator, says how many equal parts the whole was cut into.',
        'The upper one, the numerator, says how many of those parts were taken.',
        'So the denominator is about the size of a piece and the numerator about how many.',
      ],
    },
  },

  s_core: {
    title: { ru: 'Разрезов больше — часть та же', uz: "Kesim ko'p, qism o'sha", en: 'More cuts, same part' },
    steps: [
      { n: 1, d: 2 },
      { n: 2, d: 4 },
      { n: 4, d: 8 },
    ],
    done: {
      ru: 'Кусков стало вдвое больше, но и взяли вдвое больше. Закрашенная часть не изменилась: 1/2 = 2/4 = 4/8.',
      uz: "Bo'laklar ikki barobar ko'paydi, lekin olinganlari ham ikki barobar. Bo'yalgan qism o'zgarmadi: 1/2 = 2/4 = 4/8.",
      en: 'There are twice as many pieces, but twice as many were taken. The shaded part did not change: 1/2 = 2/4 = 4/8.',
    },
    audio: {
      ru: [
        'Возьмём круг и закрасим половину. Это одна вторая.',
        'Теперь разрежем каждый кусок пополам. Кусков стало четыре, закрашенных два. Но закрашенная часть та же самая.',
        'Разрежем ещё раз. Восемь кусков, закрашены четыре. Часть снова не изменилась. Значит одна вторая, две четвёртых и четыре восьмых это одно и то же число.',
      ],
      uz: [
        "Doira olamiz va yarmini bo'yaymiz. Bu bir ikkidan.",
        "Endi har bir bo'lakni teng ikkiga bo'lamiz. Bo'lak to'rtta bo'ldi, bo'yalgani ikkita. Lekin bo'yalgan qism o'sha.",
        "Yana bir marta bo'lamiz. Sakkiz bo'lak, bo'yalgani to'rtta. Qism yana o'zgarmadi. Demak bir ikkidan, ikki to'rtdan va to'rt sakkizdan bitta sonning o'zi.",
      ],
      en: [
        'Take a circle and shade half of it. That is one half.',
        'Now cut each piece in two. There are four pieces and two are shaded. But the shaded part is the same.',
        'Cut once more. Eight pieces, four shaded. The part is unchanged again. So one half, two quarters and four eighths are the same number.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Расширение дроби', uz: 'Kasrni kengaytirish', en: 'Expanding a fraction' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_from: { n: 1, d: 2 },
    demo_to: { n: 3, d: 6 },
    demo_note: {
      ru: 'Умножили и числитель, и знаменатель на 3: получилось 3/6. Это та же половина.',
      uz: "Surat va maxrajni 3 ga ko'paytirdik: 3/6 chiqdi. Bu o'sha yarim.",
      en: 'We multiplied the numerator and the denominator by 3 and got 3/6. It is the same half.',
    },
    play_ask: { ru: 'Дробь 2/3 записали со знаменателем 9. Каким стал числитель?', uz: "2/3 kasri 9 maxraj bilan yozildi. Surat nechaga aylandi?", en: 'The fraction 2/3 was rewritten with denominator 9. What is the numerator?' },
    play_opts: ['3', '6', '8'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. Знаменатель умножили на 3, значит и числитель тоже: 2 · 3 = 6. Получилось 6/9.',
      uz: "To'g'ri. Maxrajni 3 ga ko'paytirdik, demak suratni ham: 2 · 3 = 6. 6/9 chiqdi.",
      en: 'Right. The denominator was multiplied by 3, so the numerator too: 2 · 3 = 6. That gives 6/9.',
    },
    play_wrong: [
      { ru: 'К числителю прибавили, а надо умножить: знаменатель вырос втрое, значит и числитель втрое.', uz: "Suratga qo'shdingiz, ko'paytirish kerak: maxraj uch barobar oshdi, demak surat ham.", en: 'You added to the numerator, but it must be multiplied: the denominator tripled, so the numerator triples.' },
      null,
      { ru: 'Восьмёрка не подходит: 3 умножили на 3, значит и 2 надо умножить на 3.', uz: "Sakkiz mos emas: 3 ni 3 ga ko'paytirdik, demak 2 ni ham 3 ga ko'paytirish kerak.", en: 'Eight does not fit: 3 was multiplied by 3, so 2 must be multiplied by 3.' },
    ],
    audio: {
      intro: {
        ru: 'Способ первый называется расширением. Умножаем и числитель, и знаменатель на одно и то же число. Покажу на одной второй.',
        uz: "Birinchi usul kengaytirish deyiladi. Surat va maxrajni bir xil songa ko'paytiramiz. Bir ikkidan misolida ko'rsataman.",
        en: 'The first method is called expanding. Multiply the numerator and the denominator by the same number. I will show it on one half.',
      },
      demo: {
        ru: 'Умножаем оба числа на три. Сверху три, снизу шесть. Закрашенная часть осталась прежней.',
        uz: "Ikkala sonni uchga ko'paytiramiz. Yuqorida uch, pastda olti. Bo'yalgan qism o'zgarmadi.",
        en: 'Multiply both numbers by three. Three above, six below. The shaded part stayed the same.',
      },
      play: {
        ru: 'Теперь ваша очередь. Дробь две третьих записали со знаменателем девять. Каким стал числитель?',
        uz: "Endi sizning navbatingiz. Ikki uchdan kasri to'qqiz maxraj bilan yozildi. Surat nechaga aylandi?",
        en: 'Now it is your turn. Two thirds was rewritten with denominator nine. What is the numerator?',
      },
      ok: {
        ru: 'Верно. Знаменатель умножили на три, значит и числитель умножаем на три. Получается шесть девятых.',
        uz: "To'g'ri. Maxrajni uchga ko'paytirdik, demak suratni ham uchga ko'paytiramiz. Olti to'qqizdan chiqadi.",
        en: 'Right. The denominator was multiplied by three, so the numerator is multiplied by three. That gives six ninths.',
      },
      wrong: {
        ru: 'Посмотрите, во сколько раз вырос знаменатель, и умножьте числитель на столько же.',
        uz: "Maxraj necha barobar oshganiga qarang va suratni ham shuncha barobar ko'paytiring.",
        en: 'See how many times the denominator grew and multiply the numerator by the same.',
      },
    },
  },

  s_short: {
    title: { ru: 'Обратный ход: сокращение', uz: 'Teskari yo\'l: qisqartirish', en: 'The other way: reducing' },
    from: { n: 6, d: 8 },
    to: { n: 3, d: 4 },
    done: {
      ru: 'Делим оба числа на общий делитель 2. Дробь стала проще, а значение осталось прежним.',
      uz: "Ikkala sonni umumiy bo'luvchi 2 ga bo'lamiz. Kasr soddalashdi, qiymati esa o'zgarmadi.",
      en: 'Divide both numbers by the common divisor 2. The fraction got simpler and its value stayed the same.',
    },
    audio: {
      ru: [
        'Расширение можно пройти назад. Возьмём шесть восьмых.',
        'У шести и восьми есть общий делитель два. Делим на два и числитель, и знаменатель.',
        'Получилось три четвёртых. Кусков стало меньше, но каждый больше, и часть та же. Это называется сокращением дроби.',
      ],
      uz: [
        "Kengaytirishni teskari yo'nalishda ham bosib o'tish mumkin. Olti sakkizdanni olamiz.",
        "Olti va sakkizning umumiy bo'luvchisi ikki. Surat va maxrajni ikkiga bo'lamiz.",
        "Uch to'rtdan chiqdi. Bo'laklar kamaydi, lekin har biri kattalashdi, qism esa o'sha. Bu kasrni qisqartirish deyiladi.",
      ],
      en: [
        'Expanding can be walked backwards. Take six eighths.',
        'Six and eight share the divisor two. Divide both the numerator and the denominator by two.',
        'That gives three quarters. Fewer pieces, each larger, and the same part. This is called reducing a fraction.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Сократим 18/24', uz: '18/24 ni qisqartiramiz', en: 'Let us reduce 18/24' },
    lead: { ru: 'Можно шагами, а можно сразу — через НОД из пятого урока.', uz: "Qadamlab ham, birdaniga ham bo'ladi — beshinchi darsdagi EKUB orqali.", en: 'Step by step, or in one go with the GCD from lesson five.' },
    steps: [
      { ru: '18/24 : 2 = 9/12', uz: '18/24 : 2 = 9/12', en: '18/24 ÷ 2 = 9/12' },
      { ru: '9/12 : 3 = 3/4', uz: '9/12 : 3 = 3/4', en: '9/12 ÷ 3 = 3/4' },
      { ru: 'НОД(18, 24) = 6 → сразу 3/4', uz: 'EKUB(18, 24) = 6 → darrov 3/4', en: 'GCD(18, 24) = 6 → 3/4 at once' },
    ],
    done: {
      ru: 'Оба пути дали 3/4. Дробь, которую больше не сократить, называют несократимой.',
      uz: "Ikkala yo'l ham 3/4 ni berdi. Boshqa qisqartirib bo'lmaydigan kasr qisqarmas kasr deyiladi.",
      en: 'Both routes gave 3/4. A fraction that cannot be reduced further is called irreducible.',
    },
    audio: {
      ru: [
        'Решаем вместе. Сокращаем восемнадцать двадцать четвёртых. Оба числа чётные, делим на два.',
        'Получилось девять двенадцатых. Сумма цифр у обоих делится на три, делим на три и получаем три четвёртых.',
        'А можно короче. Наибольший общий делитель восемнадцати и двадцати четырёх шесть. Делим сразу на шесть и получаем те же три четвёртых.',
      ],
      uz: [
        "Birga yechamiz. O'n sakkiz yigirma to'rtdanni qisqartiramiz. Ikkala son juft, ikkiga bo'lamiz.",
        "To'qqiz o'n ikkidan chiqdi. Ikkalasining raqamlar yig'indisi uchga bo'linadi, uchga bo'lamiz va uch to'rtdan chiqadi.",
        "Qisqaroq yo'l ham bor. O'n sakkiz va yigirma to'rtning eng katta umumiy bo'luvchisi olti. Birdaniga oltiga bo'lamiz va o'sha uch to'rtdan chiqadi.",
      ],
      en: [
        'Let us solve it together. Reduce eighteen twenty fourths. Both numbers are even, divide by two.',
        'That gives nine twelfths. The digit sums of both divide by three, so divide by three and get three quarters.',
        'There is a shorter way. The greatest common divisor of eighteen and twenty four is six. Divide by six at once and get the same three quarters.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Делить надо ОБА числа', uz: "IKKALA sonni ham bo'lish kerak", en: 'BOTH numbers must change' },
    good: { from: { n: 2, d: 4 }, to: { n: 1, d: 2 } },
    bad: { from: { n: 2, d: 4 }, to: { n: 1, d: 4 } },
    done: {
      ru: 'Если разделить только числитель, часть станет меньше: 1/4 — это половина от 2/4. Правило работает, только когда меняются оба числа.',
      uz: "Faqat suratni bo'lsangiz, qism kichrayadi: 1/4 bu 2/4 ning yarmi. Qoida faqat ikkala son o'zgarganda ishlaydi.",
      en: 'Divide only the numerator and the part shrinks: 1/4 is half of 2/4. The rule works only when both numbers change.',
    },
    audio: {
      ru: [
        'Самая частая ошибка. Возьмём две четвёртых и разделим на два только числитель.',
        'Получилась одна четвёртая. Но это уже другая часть, вдвое меньше.',
        'Правильно делить оба числа: две четвёртых делим на два сверху и снизу и получаем одну вторую. Часть остаётся прежней.',
      ],
      uz: [
        "Eng ko'p uchraydigan xato. Ikki to'rtdanni olamiz va faqat suratni ikkiga bo'lamiz.",
        "Bir to'rtdan chiqdi. Lekin bu boshqa qism, ikki barobar kichik.",
        "To'g'risi ikkala sonni bo'lish: ikki to'rtdanni yuqorida ham, pastda ham ikkiga bo'lamiz va bir ikkidan chiqadi. Qism o'zgarmaydi.",
      ],
      en: [
        'The most common mistake. Take two quarters and divide only the numerator by two.',
        'That gives one quarter. But it is a different part, half as much.',
        'The right way is to divide both numbers: two quarters divided top and bottom by two gives one half. The part stays the same.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'Основное свойство дроби', uz: 'Kasrning asosiy xossasi', en: 'The basic property of a fraction' },
    rule_1: {
      ru: 'Если числитель и знаменатель умножить или разделить на одно и то же число, кроме нуля, значение дроби не изменится.',
      uz: "Agar surat va maxrajni noldan boshqa bir xil songa ko'paytirsak yoki bo'lsak, kasrning qiymati o'zgarmaydi.",
      en: 'If you multiply or divide the numerator and the denominator by the same number, except zero, the value of the fraction does not change.',
    },
    rule_2: {
      ru: 'Пицца: 2/4 — это 1/2, умноженная сверху и снизу на 2. Куски разные, а части равные. Права была Дилноза.',
      uz: "Pitsa: 2/4 bu 1/2 ning yuqori va pastini 2 ga ko'paytirgani. Bo'laklar har xil, qismlar teng. Dilnoza haq edi.",
      en: 'The pizza: 2/4 is 1/2 with both numbers multiplied by 2. Different pieces, equal parts. Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Если числитель и знаменатель умножить или разделить на одно и то же число, кроме нуля, значение дроби не изменится. И вернёмся к пицце. Две четвёртых это одна вторая, у которой оба числа умножили на два. Куски разного размера, а части равные. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Agar surat va maxrajni noldan boshqa bir xil songa ko'paytirsak yoki bo'lsak, kasrning qiymati o'zgarmaydi. Va pitsaga qaytamiz. Ikki to'rtdan bu bir ikkidan bo'lib, ikkala soni ikkiga ko'paytirilgan. Bo'laklar har xil, qismlar esa teng. Dilnoza haq edi.",
      en: 'Let us remember the rule. If you multiply or divide the numerator and the denominator by the same number, except zero, the value does not change. And back to the pizza. Two quarters is one half with both numbers multiplied by two. The pieces differ, the parts are equal. Dilnoza was right.',
    },
  },

  s_equal: {
    title: { ru: 'Равные дроби', uz: 'Teng kasrlar', en: 'Equal fractions' },
    lead: { ru: 'Смотри, во сколько раз выросли оба числа.', uz: "Ikkala son necha barobar oshganiga qarang.", en: 'See how many times both numbers grew.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какая дробь равна 1/3?', uz: '1/3 ga qaysi kasr teng?', en: 'Which fraction equals 1/3?' },
        opts: ['2/4', '2/6', '3/4'],
        correct: 1,
        ok: { ru: 'Верно. 1 · 2 = 2 и 3 · 2 = 6, оба числа выросли вдвое.', uz: "To'g'ri. 1 · 2 = 2 va 3 · 2 = 6, ikkala son ikki barobar oshdi.", en: 'Right. 1 · 2 = 2 and 3 · 2 = 6, both numbers doubled.' },
        wrong: [
          { ru: '2/4 — это 1/2, а не 1/3.', uz: "2/4 bu 1/2, 1/3 emas.", en: '2/4 is 1/2, not 1/3.' },
          null,
          { ru: 'У 3/4 числитель и знаменатель выросли по-разному.', uz: "3/4 da surat va maxraj har xil o'sgan.", en: 'In 3/4 the numerator and denominator grew differently.' },
        ],
      },
      {
        q: { ru: 'Какая дробь равна 3/9?', uz: '3/9 ga qaysi kasr teng?', en: 'Which fraction equals 3/9?' },
        opts: ['1/3', '1/6', '3/6'],
        correct: 0,
        ok: { ru: 'Верно. Разделили оба числа на 3.', uz: "To'g'ri. Ikkala sonni 3 ga bo'ldik.", en: 'Right. Both numbers were divided by 3.' },
        wrong: [
          null,
          { ru: 'Знаменатель разделили на 1,5 — так нельзя, делим на одно число.', uz: "Maxrajni boshqa songa bo'ldingiz — bir xil songa bo'lish kerak.", en: 'The denominator was divided by a different number: both must share the same one.' },
          { ru: '3/6 — это 1/2, а 3/9 это 1/3.', uz: "3/6 bu 1/2, 3/9 esa 1/3.", en: '3/6 is 1/2, while 3/9 is 1/3.' },
        ],
      },
      {
        q: { ru: 'Дробь 5/10 в самом простом виде — это…', uz: "5/10 kasrining eng sodda ko'rinishi — bu…", en: 'The simplest form of 5/10 is…' },
        opts: ['1/2', '5/10', '2/5'],
        correct: 0,
        ok: { ru: 'Верно. НОД(5, 10) = 5, делим оба на 5.', uz: "To'g'ri. EKUB(5, 10) = 5, ikkalasini 5 ga bo'lamiz.", en: 'Right. GCD(5, 10) = 5, divide both by 5.' },
        wrong: [
          null,
          { ru: 'Её можно сократить: у 5 и 10 есть общий делитель 5.', uz: "Uni qisqartirish mumkin: 5 va 10 da umumiy bo'luvchi 5 bor.", en: 'It can be reduced: 5 and 10 share the divisor 5.' },
          { ru: '2/5 — другая дробь: 5/10 это половина.', uz: "2/5 boshqa kasr: 5/10 bu yarim.", en: '2/5 is a different fraction: 5/10 is a half.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Ищите дробь, у которой оба числа изменились одинаково.',
        uz: "Mashq. Ikkala soni bir xil o'zgargan kasrni qidiring.",
        en: 'Practice. Look for the fraction where both numbers changed the same way.',
      },
    },
  },

  s_mult: {
    title: { ru: 'Подбери множитель', uz: "Ko'paytuvchini toping", en: 'Find the multiplier' },
    lead: { ru: 'Сначала знаменатель, потом числитель.', uz: 'Avval maxraj, keyin surat.', en: 'First the denominator, then the numerator.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '1/4 = ?/12', uz: '1/4 = ?/12', en: '1/4 = ?/12' },
        opts: ['2', '3', '4'],
        correct: 1,
        ok: { ru: 'Верно. 4 · 3 = 12, значит и 1 · 3 = 3.', uz: "To'g'ri. 4 · 3 = 12, demak 1 · 3 = 3.", en: 'Right. 4 · 3 = 12, so 1 · 3 = 3.' },
        wrong: [
          { ru: 'Знаменатель вырос втрое, а не вдвое: 4 · 3 = 12.', uz: "Maxraj uch barobar oshdi, ikki emas: 4 · 3 = 12.", en: 'The denominator tripled, not doubled: 4 · 3 = 12.' },
          null,
          { ru: 'Четвёрка — это множитель для 16, а нам нужен 12.', uz: "To'rt bu 16 uchun ko'paytuvchi, bizga 12 kerak.", en: 'Four would give 16, and we need 12.' },
        ],
      },
      {
        q: { ru: '2/5 = ?/15', uz: '2/5 = ?/15', en: '2/5 = ?/15' },
        opts: ['4', '6', '10'],
        correct: 1,
        ok: { ru: 'Верно. 5 · 3 = 15, значит 2 · 3 = 6.', uz: "To'g'ri. 5 · 3 = 15, demak 2 · 3 = 6.", en: 'Right. 5 · 3 = 15, so 2 · 3 = 6.' },
        wrong: [
          { ru: 'На 2 умножать нельзя: 5 · 2 = 10, а нужен 15.', uz: "2 ga ko'paytirib bo'lmaydi: 5 · 2 = 10, kerak esa 15.", en: 'Multiplying by 2 gives 10, and we need 15.' },
          null,
          { ru: '10 получится, если умножить на 5, но тогда знаменатель станет 25.', uz: "10 chiqadi, agar 5 ga ko'paytirsak, lekin unda maxraj 25 bo'ladi.", en: 'Ten comes from multiplying by 5, but then the denominator becomes 25.' },
        ],
      },
      {
        q: { ru: '6/9 = 2/?', uz: '6/9 = 2/?', en: '6/9 = 2/?' },
        opts: ['3', '4', '6'],
        correct: 0,
        ok: { ru: 'Верно. Числитель уменьшили втрое, значит и знаменатель: 9 : 3 = 3.', uz: "To'g'ri. Surat uch barobar kamaydi, demak maxraj ham: 9 : 3 = 3.", en: 'Right. The numerator was divided by three, so the denominator too: 9 : 3 = 3.' },
        wrong: [
          null,
          { ru: '9 на 4 не делится, а делить надо на то же число, что и числитель.', uz: "9 soni 4 ga bo'linmaydi, surat bilan bir xil songa bo'lish kerak.", en: 'Nine does not divide by four, and both must share the same divisor.' },
          { ru: 'Если бы знаменатель стал 6, дробь была бы 2/6 — это другое число.', uz: "Maxraj 6 bo'lsa, kasr 2/6 bo'lardi — bu boshqa son.", en: 'If the denominator were 6, the fraction would be 2/6, a different number.' },
        ],
      },
      {
        q: { ru: '10/12 = 5/?', uz: '10/12 = 5/?', en: '10/12 = 5/?' },
        opts: ['5', '6', '7'],
        correct: 1,
        ok: { ru: 'Верно. Оба числа разделили на 2: 12 : 2 = 6.', uz: "To'g'ri. Ikkala sonni 2 ga bo'ldik: 12 : 2 = 6.", en: 'Right. Both numbers were divided by 2: 12 : 2 = 6.' },
        wrong: [
          { ru: '12 на 2 даёт 6, а не 5.', uz: "12 ni 2 ga bo'lsak 6 chiqadi, 5 emas.", en: 'Twelve divided by two is six, not five.' },
          null,
          { ru: 'Семёрка не получается ни при каком делении 12.', uz: "Yetti 12 ni hech qanday bo'lishda chiqmaydi.", en: 'Seven does not come from dividing twelve.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Подбираем множитель. Сначала смотрим на знаменатель, потом делаем то же самое с числителем.',
        uz: "Ko'paytuvchini tanlaymiz. Avval maxrajga qaraymiz, keyin surat bilan ham xuddi shunday qilamiz.",
        en: 'Find the multiplier. Look at the denominator first, then do the same to the numerator.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Равно 1/2 или нет', uz: "1/2 ga tengmi yoki yo'q", en: 'Equal to 1/2 or not' },
    lead: { ru: 'Половина — это когда знаменатель вдвое больше числителя.', uz: "Yarim — bu maxraj suratdan ikki barobar katta bo'lganda.", en: 'A half is when the denominator is twice the numerator.' },
    bin_a: { ru: 'Равно 1/2', uz: '1/2 ga teng', en: 'Equals 1/2' },
    bin_b: { ru: 'Не равно', uz: 'Teng emas', en: 'Not equal' },
    cards: [
      { label: '2/4', bin: 'a' },
      { label: '3/9', bin: 'b' },
      { label: '5/10', bin: 'a' },
      { label: '4/6', bin: 'b' },
      { label: '6/12', bin: 'a' },
      { label: '3/8', bin: 'b' },
    ],
    hint: {
      ru: 'Раздели знаменатель на числитель. Получилось 2 — это половина.',
      uz: "Maxrajni suratga bo'ling. 2 chiqsa — bu yarim.",
      en: 'Divide the denominator by the numerator. If you get 2, it is a half.',
    },
    correct_text: {
      ru: 'Верно. 2/4, 5/10 и 6/12 — половины. А 3/9 это треть, 4/6 две трети, 3/8 меньше половины.',
      uz: "To'g'ri. 2/4, 5/10 va 6/12 — yarim. 3/9 esa uchdan bir, 4/6 uchdan ikki, 3/8 yarimdan kichik.",
      en: 'Right. 2/4, 5/10 and 6/12 are halves. 3/9 is a third, 4/6 is two thirds, 3/8 is less than a half.',
    },
    audio: {
      intro: {
        ru: 'Разложите дроби по двум корзинам. Равна половине или нет.',
        uz: "Kasrlarni ikki savatga ajrating. Yarimga tengmi yoki yo'q.",
        en: 'Sort the fractions into two baskets: equal to a half or not.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Раздели знаменатель на числитель.', uz: "Bu yerga emas. Maxrajni suratga bo'ling.", en: 'Not here. Divide the denominator by the numerator.' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз сократил 6/8 так: 3/8. Где ошибка?', uz: "Aziz 6/8 ni shunday qisqartirdi: 3/8. Xato qayerda?", en: 'Aziz reduced 6/8 to 3/8. Where is the mistake?' },
        opts: [
          { ru: 'Разделил только числитель', uz: "Faqat suratni bo'ldi", en: 'He divided only the numerator' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: 'Надо было делить на 3', uz: "3 ga bo'lish kerak edi", en: 'He should have divided by 3' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Делить надо оба: 6 : 2 = 3 и 8 : 2 = 4, получается 3/4.', uz: "To'g'ri. Ikkalasini bo'lish kerak: 6 : 2 = 3 va 8 : 2 = 4, 3/4 chiqadi.", en: 'Right. Both must be divided: 6 : 2 = 3 and 8 : 2 = 4, giving 3/4.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: 3/8 меньше, чем 6/8, а значение должно остаться прежним.', uz: "Xato bor: 3/8 soni 6/8 dan kichik, qiymat esa o'zgarmasligi kerak.", en: 'There is a mistake: 3/8 is less than 6/8, and the value must stay the same.' },
          { ru: 'На 3 делить нельзя: 8 на 3 не делится.', uz: "3 ga bo'lib bo'lmaydi: 8 soni 3 ga bo'linmaydi.", en: 'Dividing by 3 will not work: 8 does not divide by 3.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «5/10 сократить нельзя, числа разные». Проверь.', uz: "Dilnoza: «5/10 ni qisqartirib bo'lmaydi, sonlar har xil». Tekshiring.", en: 'Dilnoza: “5/10 cannot be reduced, the numbers differ.” Check it.' },
        opts: [
          { ru: 'Можно: общий делитель 5', uz: "Mumkin: umumiy bo'luvchi 5", en: 'It can: they share the divisor 5' },
          { ru: 'Верно, нельзя', uz: "To'g'ri, bo'lmaydi", en: 'Correct, it cannot' },
          { ru: 'Можно, но только на 2', uz: "Mumkin, lekin faqat 2 ga", en: 'It can, but only by 2' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 5 : 5 = 1 и 10 : 5 = 2, получается 1/2.', uz: "To'g'ri. 5 : 5 = 1 va 10 : 5 = 2, 1/2 chiqadi.", en: 'Right. 5 : 5 = 1 and 10 : 5 = 2, giving 1/2.' },
        wrong: [
          null,
          { ru: 'Сократить можно: у 5 и 10 общий делитель 5.', uz: "Qisqartirish mumkin: 5 va 10 da umumiy bo'luvchi 5 bor.", en: 'It can be reduced: 5 and 10 share the divisor 5.' },
          { ru: '5 на 2 не делится, а делить надо оба числа.', uz: "5 soni 2 ga bo'linmaydi, bo'lish esa ikkala songa tegishli.", en: 'Five does not divide by two, and both numbers must be divided.' },
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
    title: { ru: 'Пицца на всех', uz: 'Hammaga pitsa', en: 'Pizza for everyone' },
    lead: { ru: 'Пиццу разрезали на 12 кусков. Азиз взял 3, Дилноза 4.', uz: "Pitsa 12 bo'lakka bo'lindi. Aziz 3 tasini, Dilnoza 4 tasini oldi.", en: 'The pizza is cut into 12 pieces. Aziz took 3, Dilnoza 4.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какую часть пиццы взял Азиз?', uz: 'Aziz pitsaning qaysi qismini oldi?', en: 'What part of the pizza did Aziz take?' },
        opts: [
          '1/4',
          '1/3',
          { ru: '3/12 и 1/4 — разные', uz: '3/12 va 1/4 — har xil', en: '3/12 and 1/4 are different' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 3/12 сокращается на 3: получается 1/4.', uz: "To'g'ri. 3/12 ni 3 ga qisqartiramiz: 1/4 chiqadi.", en: 'Right. 3/12 reduces by 3 to 1/4.' },
        wrong: [
          null,
          { ru: '1/3 — это 4 куска из 12, а Азиз взял 3.', uz: "1/3 bu 12 dan 4 bo'lak, Aziz esa 3 tasini oldi.", en: 'A third is 4 pieces of 12, and Aziz took 3.' },
          { ru: 'Они равны: 3/12 = 1/4, это одно и то же число.', uz: "Ular teng: 3/12 = 1/4, bu bitta sonning o'zi.", en: 'They are equal: 3/12 = 1/4, the same number.' },
        ],
      },
      {
        q: { ru: 'У кого кусков больше по объёму?', uz: "Kimning ulushi hajm bo'yicha kattaroq?", en: 'Whose share is larger?' },
        opts: [
          { ru: 'У Азиза', uz: 'Azizniki', en: 'Aziz' },
          { ru: 'У Дилнозы', uz: 'Dilnozaniki', en: 'Dilnoza' },
          { ru: 'Поровну', uz: 'Teng', en: 'Equal' },
        ],
        correct: 1,
        ok: { ru: 'Верно. 4/12 = 1/3, а 3/12 = 1/4. Треть больше четверти.', uz: "To'g'ri. 4/12 = 1/3, 3/12 = 1/4. Uchdan bir to'rtdan birdan katta.", en: 'Right. 4/12 = 1/3 and 3/12 = 1/4. A third is more than a quarter.' },
        wrong: [
          { ru: 'У Азиза 3 куска, у Дилнозы 4 — из одной и той же пиццы.', uz: "Azizda 3 bo'lak, Dilnozada 4 — bitta pitsadan.", en: 'Aziz has 3 pieces, Dilnoza 4, from the same pizza.' },
          null,
          { ru: 'Куски одинаковые, но их разное количество: 3 и 4.', uz: "Bo'laklar bir xil, lekin soni har xil: 3 va 4.", en: 'The pieces are the same size, but the counts differ: 3 and 4.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про пиццу. Двенадцать кусков, Азиз взял три, Дилноза четыре.',
        uz: "Pitsa haqida masala. O'n ikki bo'lak, Aziz uchtasini, Dilnoza to'rttasini oldi.",
        en: 'A pizza problem. Twelve pieces, Aziz took three, Dilnoza four.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 4,
        q: { ru: 'Сократи 12/16. Какой будет знаменатель? Набери ответ.', uz: '12/16 ni qisqartiring. Maxraj nechaga teng? Javobni tering.', en: 'Reduce 12/16. What is the denominator? Type the answer.' },
        hint: { ru: 'НОД(12, 16) = 4. Раздели оба числа на 4.', uz: "EKUB(12, 16) = 4. Ikkala sonni 4 ga bo'ling.", en: 'GCD(12, 16) = 4. Divide both numbers by 4.' },
        hint_audio: { ru: 'Наибольший общий делитель двенадцати и шестнадцати четыре. Разделите оба числа на четыре.', uz: "O'n ikki va o'n oltining eng katta umumiy bo'luvchisi to'rt. Ikkala sonni to'rtga bo'ling.", en: 'The greatest common divisor of twelve and sixteen is four. Divide both numbers by four.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Какая дробь равна 2/3?', uz: '2/3 ga qaysi kasr teng?', en: 'Which fraction equals 2/3?' },
        opts: ['3/4', '4/9', '8/12', '2/6'],
        wrong: [
          { ru: '3/4 больше: оба числа выросли по-разному.', uz: "3/4 kattaroq: ikkala son har xil o'sgan.", en: '3/4 is larger: the numbers grew differently.' },
          { ru: 'Числитель умножили на 2, а знаменатель на 3.', uz: "Suratni 2 ga, maxrajni 3 ga ko'paytirilgan.", en: 'The numerator was multiplied by 2 and the denominator by 3.' },
          null,
          { ru: '2/6 — это 1/3, вдвое меньше.', uz: "2/6 bu 1/3, ikki barobar kichik.", en: '2/6 is 1/3, half as much.' },
        ],
        correct: { ru: 'Верно. 2 · 4 = 8 и 3 · 4 = 12.', uz: "To'g'ri. 2 · 4 = 8 va 3 · 4 = 12.", en: 'Right. 2 · 4 = 8 and 3 · 4 = 12.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Что происходит с дробью при сокращении?', uz: 'Qisqartirishda kasr bilan nima bo\'ladi?', en: 'What happens to a fraction when you reduce it?' },
        opts: [
          { ru: 'Становится меньше', uz: 'Kichrayadi', en: 'It becomes smaller' },
          { ru: 'Значение не меняется', uz: "Qiymati o'zgarmaydi", en: 'Its value stays the same' },
          { ru: 'Становится больше', uz: 'Kattalashadi', en: 'It becomes larger' },
          { ru: 'Меняется только числитель', uz: "Faqat surat o'zgaradi", en: 'Only the numerator changes' },
        ],
        wrong: [
          { ru: 'Кусков меньше, но каждый больше: часть та же.', uz: "Bo'lak kam, lekin har biri katta: qism o'sha.", en: 'Fewer pieces, but each is larger: the part is the same.' },
          null,
          { ru: 'Больше она тоже не становится — значение сохраняется.', uz: "U kattalashmaydi ham — qiymat saqlanadi.", en: 'It does not grow either: the value is preserved.' },
          { ru: 'Меняются оба числа, иначе значение сломается.', uz: "Ikkala son ham o'zgaradi, aks holda qiymat buziladi.", en: 'Both numbers change, otherwise the value breaks.' },
        ],
        correct: { ru: 'Верно. Это и есть основное свойство дроби.', uz: "To'g'ri. Bu kasrning asosiy xossasi.", en: 'Right. That is the basic property of a fraction.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Какая дробь несократима?', uz: 'Qaysi kasr qisqarmas?', en: 'Which fraction is irreducible?' },
        opts: ['5/7', '6/8', '9/12', '10/15'],
        wrong: [
          null,
          { ru: '6/8 сокращается на 2: 3/4.', uz: "6/8 ni 2 ga qisqartiramiz: 3/4.", en: '6/8 reduces by 2 to 3/4.' },
          { ru: '9/12 сокращается на 3: 3/4.', uz: "9/12 ni 3 ga qisqartiramiz: 3/4.", en: '9/12 reduces by 3 to 3/4.' },
          { ru: '10/15 сокращается на 5: 2/3.', uz: "10/15 ni 5 ga qisqartiramiz: 2/3.", en: '10/15 reduces by 5 to 2/3.' },
        ],
        correct: { ru: 'Верно. 5 и 7 взаимно простые: НОД равен 1, сокращать нечем.', uz: "To'g'ri. 5 va 7 o'zaro tub: EKUB 1 ga teng, qisqartirishga narsa yo'q.", en: 'Right. 5 and 7 are coprime: the GCD is 1, nothing to reduce by.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Зачем нужно расширение дроби?', uz: 'Kasrni kengaytirish nima uchun kerak?', en: 'What is expanding a fraction for?' },
        opts: [
          { ru: 'Чтобы дробь стала больше', uz: 'Kasr kattalashishi uchun', en: 'To make the fraction larger' },
          { ru: 'Чтобы упростить запись', uz: 'Yozuvni soddalashtirish uchun', en: 'To simplify the notation' },
          { ru: 'Чтобы избавиться от знаменателя', uz: 'Maxrajdan qutulish uchun', en: 'To get rid of the denominator' },
          { ru: 'Чтобы привести дроби к одному знаменателю', uz: 'Kasrlarni bitta maxrajga keltirish uchun', en: 'To bring fractions to a common denominator' },
        ],
        wrong: [
          { ru: 'Значение не меняется, дробь не растёт.', uz: "Qiymat o'zgarmaydi, kasr o'smaydi.", en: 'The value does not change, the fraction does not grow.' },
          { ru: 'Запись как раз становится длиннее: это делает сокращение.', uz: "Yozuv aksincha uzayadi: soddalashtirishni qisqartirish qiladi.", en: 'The notation gets longer: simplifying is what reducing does.' },
          { ru: 'Знаменатель никуда не девается.', uz: "Maxraj hech qayerga ketmaydi.", en: 'The denominator does not go anywhere.' },
          null,
        ],
        correct: { ru: 'Верно. Общий знаменатель нужен, чтобы дроби можно было сравнивать и складывать — это следующие уроки.', uz: "To'g'ri. Umumiy maxraj kasrlarni solishtirish va qo'shish uchun kerak — bu keyingi darslar.", en: 'Right. A common denominator lets you compare and add fractions — that is the next lessons.' },
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
      ru: 'Древние египтяне писали почти все дроби как суммы долей вида 1/n: 2/5 у них было 1/3 плюс 1/15. Наша запись с числителем и знаменателем короче и удобнее.',
      uz: "Qadimgi misrliklar deyarli barcha kasrlarni 1/n ko'rinishidagi ulushlar yig'indisi qilib yozishgan: 2/5 ular uchun 1/3 qo'shuv 1/15 edi. Bizning surat va maxrajli yozuvimiz qisqaroq va qulayroq.",
      en: 'The ancient Egyptians wrote almost every fraction as a sum of unit parts like 1/n: for them 2/5 was 1/3 plus 1/15. Our notation with a numerator and a denominator is shorter and handier.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Древние египтяне писали почти все дроби как суммы долей вида один делить на эн. Две пятых у них были одна третья плюс одна пятнадцатая. Наша запись короче и удобнее.',
      uz: "Bilasizmi? Qadimgi misrliklar deyarli barcha kasrlarni bir bo'lingan en ko'rinishidagi ulushlar yig'indisi qilib yozishgan. Ikki beshdan ular uchun bir uchdan qo'shuv bir o'n beshdan edi. Bizning yozuvimiz qisqaroq va qulayroq.",
      en: 'Did you know? The ancient Egyptians wrote almost every fraction as a sum of unit parts. Two fifths for them was one third plus one fifteenth. Our notation is shorter and handier.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Дроби', uz: 'Matematika · Kasrlar', en: 'Mathematics · Fractions' },
    heading: { ru: 'Основное свойство дроби', uz: 'Kasrning asosiy xossasi', en: 'The basic property' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'умножили оба числа → дробь та же', uz: "ikkala sonni ko'paytirdik → kasr o'sha", en: 'multiply both → same fraction' },
    brief_2: { ru: 'разделили оба → дробь та же', uz: "ikkalasini bo'ldik → kasr o'sha", en: 'divide both → same fraction' },
    brief_3: { ru: 'НОД сокращает дробь за один шаг', uz: 'EKUB kasrni bir qadamda qisqartiradi', en: 'the GCD reduces in one step' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Расширение', uz: 'Kengaytirish', en: 'Expanding' },
    memo_a1: { ru: 'умножаем оба числа: кусков больше', uz: "ikkala sonni ko'paytiramiz: bo'lak ko'p", en: 'multiply both: more pieces' },
    memo_q2: { ru: 'Сокращение', uz: 'Qisqartirish', en: 'Reducing' },
    memo_a2: { ru: 'делим оба числа: кусков меньше', uz: "ikkala sonni bo'lamiz: bo'lak kam", en: 'divide both: fewer pieces' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'изменить только числитель', uz: "faqat suratni o'zgartirish", en: 'changing only the numerator' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Если умножить или разделить оба числа дроби на одно и то же число, значение не изменится. Наибольший общий делитель сокращает дробь за один шаг.',
        'Пиццы одинаковые: одна вторая и две четвёртых это одна и та же часть. Права была Дилноза.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Kasrning ikkala sonini bir xil songa ko'paytirsak yoki bo'lsak, qiymati o'zgarmaydi. Eng katta umumiy bo'luvchi kasrni bir qadamda qisqartiradi.",
        "Pitsalar bir xil: bir ikkidan va ikki to'rtdan bu bitta qismning o'zi. Dilnoza haq edi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Multiplying or dividing both numbers of a fraction by the same number leaves the value unchanged. The greatest common divisor reduces a fraction in one step.',
        'The pizzas are the same: one half and two quarters are the same part. Dilnoza was right.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Менять оба числа', uz: "Usul. Ikkala sonni o'zgartirish", en: 'Method. Change both numbers' },
    m1_steps: {
      ru: ['Посмотри, во сколько раз изменился знаменатель', 'Сделай то же самое с числителем', 'Проверь: часть должна остаться прежней'],
      uz: ["Maxraj necha barobar o'zgarganiga qarang", "Surat bilan ham xuddi shunday qiling", "Tekshiring: qism o'zgarmasligi kerak"],
      en: ['See how the denominator changed', 'Do the same to the numerator', 'Check: the part must stay the same'],
    },
    m1_no: {
      ru: 'Сокращать быстрее всего на НОД: 18/24 делим на 6 и сразу получаем 3/4.',
      uz: "Eng tez qisqartirish EKUB orqali: 18/24 ni 6 ga bo'lamiz va darrov 3/4 chiqadi.",
      en: 'Reducing is fastest with the GCD: divide 18/24 by 6 and get 3/4 at once.',
    },
  },
};

// ============================================================
// ПИЦЦА — общий рисунок урока: круг, разрезы, взятые куски.
// Один компонент рисует и сцену, и материал на экранах, поэтому
// «кусок» выглядит одинаково везде.
// ============================================================
const CRUST = '#C9884A';
const TAKEN = '#F0A64B';
const TAKEN_B = '#7ECBE6';
const EMPTY = '#FBF3E2';

const sector = (cx, cy, r, a0, a1) => {
  const px = (a) => cx + r * Math.cos(a);
  const py = (a) => cy + r * Math.sin(a);
  const big = a1 - a0 > Math.PI ? 1 : 0;
  return `M${cx} ${cy} L${px(a0)} ${py(a0)} A${r} ${r} 0 ${big} 1 ${px(a1)} ${py(a1)} Z`;
};

const Pizza = ({ cx, cy, r, cuts, taken = 0, fills = null, tone = TAKEN, rot = -Math.PI / 2, base = true, plate = false }) => {
  const step = (Math.PI * 2) / cuts;
  const color = (i) => (fills ? fills[i] : (i < taken ? tone : EMPTY));
  const mid = (i) => rot + step * (i + 0.5);
  return (
    <g>
      {plate && <circle cx={cx} cy={cy} r={r + 5} fill="#FFFDF7" stroke="#E9E3D9"/>}
      {base && <circle cx={cx} cy={cy} r={r} fill={EMPTY}/>}
      {Array.from({ length: cuts }, (_, i) => {
        const fill = color(i);
        if (!fill) return null;
        return <path key={i} d={sector(cx, cy, r, rot + i * step, rot + (i + 1) * step)}
          fill={fill} stroke={CRUST} strokeWidth="1"/>;
      })}
      {/* Колбаса лежит только на взятых кусках: их видно и можно пересчитать */}
      {Array.from({ length: cuts }, (_, i) => {
        const fill = color(i);
        if (!fill || fill === EMPTY) return null;
        const a = mid(i);
        return <circle key={'p' + i} cx={cx + r * 0.55 * Math.cos(a)} cy={cy + r * 0.55 * Math.sin(a)}
          r={Math.max(2, r * 0.11)} fill="#C4452B" opacity="0.85"/>;
      })}
      {base && <circle cx={cx} cy={cy} r={r} fill="none" stroke={CRUST} strokeWidth={Math.max(1.6, r * 0.06)}/>}
    </g>
  );
};

// ============================================================
// СЦЕНЫ УРОКА: классный час с пиццей. На хуке вопрос, в итоге ответ.
// ============================================================
const Glass = ({ x, y, tone = '#E8A33C' }) => (
  <g>
    <path d={`M${x} ${y} h13 l-1.6 17 h-9.8 Z`} fill="#FFFFFF" opacity="0.9"/>
    <path d={`M${x + 1.4} ${y + 5} h10.2 l-1.2 12 h-7.8 Z`} fill={tone} opacity="0.85"/>
    <path d={`M${x} ${y} h13`} stroke="#DCCFB6" strokeWidth="1.2" fill="none"/>
  </g>
);

// Хук: у Азиза один большой кусок, у Дилнозы два маленьких. Сцена ставит
// вопрос и НЕ отвечает на него: куски лежат порознь, сложить их глазом нельзя.
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d7wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d7wall)"/>

    {/* Окно класса */}
    <g>
      <rect x="14" y="12" width="62" height="46" rx="3" fill="#DCEDF5" stroke="#C9A472" strokeWidth="2"/>
      <path d="M45 12 v46 M14 35 h62" stroke="#C9A472" strokeWidth="1.6"/>
      <circle cx="30" cy="24" r="6" fill="#F5C77E"/>
    </g>

    {/* Доска: на ней расписание мелом */}
    <g>
      <rect x="92" y="10" width="196" height="50" rx="4" fill="#8E8578"/>
      <rect x="92" y="10" width="196" height="50" rx="4" fill="none" stroke="#C9A472" strokeWidth="3"/>
      <path d="M104 24 h140" stroke="#FFFDF7" strokeWidth="2" opacity="0.55" strokeLinecap="round"/>
      <path d="M104 34 h140" stroke="#FFFDF7" strokeWidth="2" opacity="0.55" strokeLinecap="round"/>
      <path d="M104 44 h84" stroke="#FFFDF7" strokeWidth="2" opacity="0.55" strokeLinecap="round"/>
      <rect x="240" y="42" width="34" height="4" rx="2" fill="#FFFDF7" opacity="0.4"/>
    </g>

    {/* Часы */}
    <g>
      <circle cx="342" cy="30" r="14" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <g className="d7-clock">
        <path d="M342 30 v-9" stroke="#3B3730" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M342 30 l7 4" stroke="#FF4F28" strokeWidth="1.6" strokeLinecap="round"/>
      </g>
    </g>

    {/* Дети за столом */}
    <Person x={150} ground={116} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={252} ground={116} head={13} shirt="#F5C77E" hair="#5A4636"/>

    {/* Стол */}
    <rect x="0" y="112" width="400" height="42" fill="#D2A96F"/>
    <rect x="0" y="112" width="400" height="5" fill="#C9884A"/>
    <rect x="0" y="127" width="400" height="3" fill="#E0BE8B" opacity="0.7"/>

    {/* Коробка от пиццы с откинутой крышкой */}
    <g>
      <path d="M18 122 h56 v22 h-56 Z" fill="#E5DAC6" stroke="#C9A472"/>
      <path d="M18 122 l10 -18 h56 l-10 18 Z" fill="#F1E4CB" stroke="#C9A472"/>
    </g>

    {/* Две пиццы на столе: из левой взяли половину, из правой две четверти */}
    <Pizza cx={104} cy={134} r={17} cuts={2} fills={['#F7F0E2', TAKEN]} plate/>
    <Pizza cx={330} cy={134} r={17} cuts={4} fills={['#F7F0E2', '#F7F0E2', TAKEN, TAKEN]} plate/>

    {/* Доли на тарелках: слева один большой кусок, справа два маленьких */}
    <ellipse cx="172" cy="136" rx="24" ry="9" fill="#FFFDF7" stroke="#E9E3D9"/>
    <Pizza cx={172} cy={134} r={15} cuts={2} fills={[TAKEN, null]} base={false} rot={-Math.PI * 0.86}/>
    <ellipse cx="244" cy="136" rx="26" ry="9" fill="#FFFDF7" stroke="#E9E3D9"/>
    <Pizza cx={236} cy={133} r={13} cuts={4} fills={[TAKEN, null, null, null]} base={false} rot={-Math.PI * 0.9}/>
    <Pizza cx={254} cy={136} r={13} cuts={4} fills={[TAKEN, null, null, null]} base={false} rot={-Math.PI * 0.35}/>

    {/* Пар над пиццей, сок и салфетки */}
    <g className="d7-steam">
      <path d="M100 112 q4 -7 0 -13 q-4 -6 0 -12" stroke="#C9C7C2" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M112 114 q4 -6 0 -11 q-4 -5 0 -10" stroke="#C9C7C2" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </g>
    <Glass x={64} y={120} tone="#E8A33C"/>
    <Glass x={294} y={120} tone="#D98A5A"/>
    <rect x="196" y="146" width="26" height="6" rx="2" fill="#FFFDF7" stroke="#E9E3D9"/>
    <rect x="199" y="143" width="26" height="6" rx="2" fill="#FFFDF7" stroke="#E9E3D9"/>
  </svg>
);

// Итог: две пиццы рядом, закрашено одинаково.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <Pizza cx={104} cy={46} r={34} cuts={2} taken={1} plate/>
    <Pizza cx={296} cy={46} r={34} cuts={4} taken={2} plate/>
    <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
      <text x="176" y="40" textAnchor="middle" fontSize="15">1</text>
      <text x="176" y="62" textAnchor="middle" fontSize="15">2</text>
      <text x="224" y="40" textAnchor="middle" fontSize="15">2</text>
      <text x="224" y="62" textAnchor="middle" fontSize="15">4</text>
      <text x="200" y="52" textAnchor="middle" fontSize="17">=</text>
    </g>
    <path d="M166 46 h20 M214 46 h20" stroke="#1F7A4D" strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
const PizzaFig = ({ cuts, taken = 0, fills = null, tone = TAKEN, cap = null, wide = false }) => (
  <span className={'d7-pz' + (wide ? ' d7-pz-wide' : '')}>
    <svg viewBox="0 0 108 108" aria-hidden="true">
      <Pizza cx={54} cy={54} r={46} cuts={cuts} taken={taken} fills={fills} tone={tone} plate/>
    </svg>
    {cap && <span className="d7-pz-cap">{cap}</span>}
  </span>
);

// Полоса из d клеток, n закрашено: на 24 куска круг уже не читается, полоса читается.
const Bar = ({ n, d, tone = 'a' }) => (
  <span className={'d7-bar d7-bar-' + tone}>
    {Array.from({ length: d }, (_, i) => <i key={i} className={i < n ? 'on' : ''}/>)}
  </span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d7-stage">
        <div className="d7-row">
          <PizzaFig cuts={4} taken={3} wide/>
          <span className="d7-labels">
            <span className={'d7-cap' + (step >= 2 ? ' d7-on' : '')}>{t(c.cap_num)}</span>
            <Frac n="3" d="4" size="display"/>
            <span className={'d7-cap' + (step >= 1 ? ' d7-on' : '')}>{t(c.cap_den)}</span>
          </span>
        </div>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: тот же круг режут чаще, закрашенная часть не меняется.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d7-stage">
        <div className="d7-row">
          {c.steps.map((s, i) => (
            <React.Fragment key={s.d}>
              {i > 0 && <span className={'d7-op' + (step >= i ? ' d7-on' : '')}>=</span>}
              <span className={'d7-fade' + (step >= i ? ' d7-on' : '')}>
                <PizzaFig cuts={s.d} taken={s.n} cap={<Frac n={s.n} d={s.d} size="mid"/>}/>
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const ShortBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_short;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d7-stage">
        <div className="d7-row">
          <PizzaFig cuts={c.from.d} taken={c.from.n} cap={<Frac n={c.from.n} d={c.from.d} size="mid"/>}/>
          <span className={'d7-op d7-op-tag' + (step >= 1 ? ' d7-on' : '')}>: 2</span>
          <span className={'d7-fade' + (step >= 2 ? ' d7-on' : '')}>
            <PizzaFig cuts={c.to.d} taken={c.to.n} cap={<Frac n={c.to.n} d={c.to.d} size="mid"/>}/>
          </span>
        </div>
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
  const bars = [{ n: 18, d: 24 }, { n: 9, d: 12 }, { n: 3, d: 4 }];
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d7-stage">
        {bars.map((b, i) => (
          <span key={i} className={'d7-solve-row d7-fade' + (step >= i ? ' d7-on' : '')}>
            <Bar n={b.n} d={b.d} tone={i === 2 ? 'ok' : 'a'}/>
            <span className="d7-solve-t">{mt(t(c.steps[i]))}</span>
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

// Граница: изменили только числитель, и часть уехала.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d7-stage">
        <span className="d7-pair d7-pair-bad">
          <PizzaFig cuts={c.bad.from.d} taken={c.bad.from.n} cap={<Frac n={c.bad.from.n} d={c.bad.from.d} size="mid"/>}/>
          <span className="d7-op d7-on">→</span>
          <span className={'d7-fade' + (step >= 1 ? ' d7-on' : '')}>
            <PizzaFig cuts={c.bad.to.d} taken={c.bad.to.n} cap={<Frac n={c.bad.to.n} d={c.bad.to.d} size="mid"/>}/>
          </span>
        </span>
        <span className={'d7-pair d7-pair-good d7-fade' + (step >= 2 ? ' d7-on' : '')}>
          <PizzaFig cuts={c.good.from.d} taken={c.good.from.n} cap={<Frac n={c.good.from.n} d={c.good.from.d} size="mid"/>}/>
          <span className="d7-op d7-on">→</span>
          <PizzaFig cuts={c.good.to.d} taken={c.good.to.n} cap={<Frac n={c.good.to.n} d={c.good.to.d} size="mid"/>}/>
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d7-banner fade-up delay-1' + (phase === 'play' ? ' d7-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d7-stage">
          {phase === 'demo' ? (
            <>
              <div className="d7-row">
                <PizzaFig cuts={c.demo_from.d} taken={c.demo_from.n} cap={<Frac n={c.demo_from.n} d={c.demo_from.d} size="mid"/>}/>
                <span className={'d7-op d7-op-tag' + (shown >= 1 ? ' d7-on' : '')}>× 3</span>
                <span className={'d7-fade' + (done ? ' d7-on' : '')}>
                  <PizzaFig cuts={c.demo_to.d} taken={c.demo_to.n} cap={<Frac n={c.demo_to.n} d={c.demo_to.d} size="mid"/>}/>
                </span>
              </div>
              <p className={'body d7-verdict' + (done ? ' d7-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d7-acts fade-up">
            <button className="d7-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d7-btn d7-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenShort = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_short} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <ShortBody step={step}/>}/>
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
      <div className="d7-row">
        <PizzaFig cuts={2} taken={1} cap={<Frac n="1" d="2" size="mid"/>}/>
        <span className="d7-op d7-on">=</span>
        <PizzaFig cuts={4} taken={2} cap={<Frac n="2" d="4" size="mid"/>}/>
        <span className="d7-op d7-on">=</span>
        <PizzaFig cuts={8} taken={4} cap={<Frac n="4" d="8" size="mid"/>}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenEqual = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_equal} asideNode={methodAside}/>
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

// Задача: одна пицца на двоих, куски Азиза и Дилнозы разного цвета.
const TaskFig = ({ idx }) => {
  const fills = Array.from({ length: 12 }, (_, i) => {
    if (i < 3) return TAKEN;
    if (idx >= 1 && i < 7) return TAKEN_B;
    return EMPTY;
  });
  return (
    <div className="d7-row d7-task-fig">
      <PizzaFig cuts={12} fills={fills}/>
    </div>
  );
};

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
.d7-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 1.8vw, 16px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d7-row { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 1.8vw, 16px); flex-wrap: wrap; }

/* Пицца */
.d7-pz { display: inline-flex; flex-direction: column; align-items: center; gap: 6px; }
.d7-pz svg { width: clamp(78px, 17vw, 116px); height: auto; display: block; }
.d7-pz-wide svg { width: clamp(120px, 26vw, 188px); }
.d7-task-fig .d7-pz svg { width: clamp(86px, 19vw, 124px); }
.d7-pz-cap { line-height: 1; }

/* Знаки между рисунками */
.d7-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 26px); font-weight: 700; color: #8A8883; opacity: 0; transition: opacity 380ms linear; }
.d7-op-tag { padding: 4px 10px; border-radius: 9px; background: #FBF3D6; color: #C99B3A; font-size: clamp(15px, 2.8vw, 20px); }
.d7-fade { opacity: 0; transition: opacity 420ms linear; }
.d7-on { opacity: 1; }

/* Подписи числителя и знаменателя */
.d7-labels { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.d7-cap { max-width: 260px; text-align: center; font-size: clamp(13px, 2.2vw, 16px); color: #8A8883; opacity: 0; transition: opacity 380ms linear; }

/* Полоса долей */
.d7-bar { display: inline-flex; gap: 2px; }
.d7-bar i { display: block; width: clamp(7px, 1.5vw, 12px); height: clamp(20px, 3.6vw, 30px); border-radius: 3px; background: #F3EFE6; border: 1px solid #E9E3D9; }
.d7-bar-a i.on { background: #F0A64B; border-color: #C9884A; }
.d7-bar-ok i.on { background: #7FBF95; border-color: #1F7A4D; }
.d7-solve-row { display: flex; align-items: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; justify-content: center; }
.d7-solve-t { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 19px); font-weight: 700; color: #494550; }

/* Пары «было и стало» */
.d7-pair { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 1.8vw, 16px); flex-wrap: wrap; width: 100%; padding: clamp(8px, 1.6vw, 12px); border-radius: 14px; }
/* Низкое окно: у экрана границы два блока сравнения по 206 пикселей, запас на
   1280 на 680 был всего семь. Под нагрузкой промежуточное состояние вылезало
   под панель, поэтому подкладка блоков и зазор между ними меньше. */
@media (min-width: 640px) and (max-height: 700px) {
  .lesson-root .d7-pair { padding: 7px !important; gap: 10px !important; }
  .lesson-root .d7-stage { gap: 10px !important; }
}
.d7-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d7-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }

/* Экран 4 */
.d7-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(14px, 2.4vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 6px 13px; }
.d7-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d7-verdict { margin: 0; min-height: 22px; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d7-verdict-on { opacity: 1; }
.d7-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d7-btn { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d7-btn:disabled { opacity: 0.45; cursor: default; }
.d7-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d7-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: пар над пиццей и стрелка часов */
.d7-steam { animation: d7Steam 3200ms ease-in-out infinite; transform-origin: 106px 112px; }
@keyframes d7Steam { 0%, 100% { opacity: 0.25; transform: translateY(2px); } 50% { opacity: 0.75; transform: translateY(-4px); } }
.d7-clock { transform-origin: 342px 30px; animation: d7Tick 4000ms steps(8, end) infinite; }
@keyframes d7Tick { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .d7-steam, .d7-clock { animation: none; } }

@media (max-width: 639.98px) {
  .d7-bar i { width: 6px; height: 18px; }
  .d7-cap { max-width: 190px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function FractionPropertyLesson({
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
  });

  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenShort, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenEqual, ScreenMult, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
