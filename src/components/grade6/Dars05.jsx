// ============================================================
// 6 КЛАСС, УРОК 5 «Наибольший общий делитель»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Сюжет блока: школа после уроков. 1 — спортзал, 2 — буфет, 3 — ярмарка,
// 4 — мастерская, 5 — подготовка подарков к празднику.
//
// ЯДРО УРОКА: наборы должны быть ОДИНАКОВЫМИ и без остатка. Число наборов —
// это общий делитель, а самый большой из них и есть НОД.
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
  lessonId: 'grade6-05',
  lessonTitle: {
    ru: 'Наибольший общий делитель',
    uz: "Eng katta umumiy bo'luvchi",
    en: 'Greatest common divisor',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 sovg'alar: 24 va 36
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 24 va 36 ning bo'luvchilari
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 umumiylari va eng kattasi
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL 1: ikki qator
  { id: 's_fact',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 USUL 2: tub ko'paytuvchilar
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 24 va 36
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: o'zaro tub sonlar
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_common', type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 umumiy bo'luvchilar x3
  { id: 's_gcd',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 EKUB x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: o'zaro tub
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: sovg'alar
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: {
      ru: 'Подарки: 24 ручки и 36 тетрадей',
      uz: "Sovg'alar: 24 ruchka va 36 daftar",
      en: 'Gifts: 24 pens and 36 notebooks',
    },
    lead: {
      ru: 'Наборы должны быть одинаковыми, и ничего не должно остаться.',
      uz: "To'plamlar bir xil bo'lishi kerak va hech narsa ortib qolmasligi shart.",
      en: 'The sets must be identical and nothing may be left over.',
    },
    voice_a: { ru: 'Азиз: сделаем 4 набора.', uz: "Aziz: 4 ta to'plam qilamiz.", en: 'Aziz: let us make 4 sets.' },
    voice_b: { ru: 'Дилноза: можно больше.', uz: "Dilnoza: ko'proq bo'ladi.", en: 'Dilnoza: we can do more.' },
    ask: { ru: 'Сколько наборов выйдет самое большее?', uz: "Eng ko'pi bilan nechta to'plam chiqadi?", en: 'What is the largest number of sets?' },
    options: [
      { ru: '4 набора', uz: "4 ta to'plam", en: '4 sets' },
      { ru: 'Больше четырёх', uz: "To'rttadan ko'p", en: 'More than four' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: "Variantlardan birini bosing. Javobni dars davomida tekshiramiz.",
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'К празднику собирают подарки: двадцать четыре ручки и тридцать шесть тетрадей. Наборы должны быть одинаковыми, и ничего не должно остаться.',
          'Азиз предлагает сделать четыре набора, а Дилноза говорит, что можно больше. Как ты думаешь, сколько наборов выйдет самое большее? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Bayramga sovg'a yig'ilmoqda: yigirma to'rt ruchka va o'ttiz olti daftar. To'plamlar bir xil bo'lishi va hech narsa ortib qolmasligi kerak.",
          "Aziz to'rtta to'plam qilishni taklif qiladi, Dilnoza esa ko'proq bo'ladi deydi. Sizningcha eng ko'pi bilan nechta to'plam chiqadi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'Gifts are being packed for the holiday: twenty four pens and thirty six notebooks. The sets must be identical and nothing may be left over.',
          'Aziz suggests four sets, and Dilnoza says more are possible. What do you think, what is the largest number of sets? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Делители 24 и 36', uz: "24 va 36 ning bo'luvchilari", en: 'The divisors of 24 and 36' },
    d24: [1, 2, 3, 4, 6, 8, 12, 24],
    d36: [1, 2, 3, 4, 6, 9, 12, 18, 36],
    lab24: { ru: 'ручки: 24', uz: 'ruchkalar: 24', en: 'pens: 24' },
    lab36: { ru: 'тетради: 36', uz: 'daftarlar: 36', en: 'notebooks: 36' },
    done: {
      ru: 'Число наборов должно делить и 24, и 36 — иначе что-то останется.',
      uz: "To'plamlar soni 24 ni ham, 36 ni ham bo'lishi kerak — aks holda nimadir ortib qoladi.",
      en: 'The number of sets must divide both 24 and 36, or something will be left over.',
    },
    audio: {
      ru: [
        'Ищем делители по способу первого урока, парами. У двадцати четырёх их восемь: один, два, три, четыре, шесть, восемь, двенадцать и двадцать четыре.',
        'У тридцати шести девять: один, два, три, четыре, шесть, девять, двенадцать, восемнадцать и тридцать шесть.',
        'Число наборов обязано делить и двадцать четыре, и тридцать шесть. Иначе что-то останется лишним.',
      ],
      uz: [
        "Bo'luvchilarni birinchi darsdagi usul bilan, juftlab qidiramiz. Yigirma to'rtda ular sakkizta: bir, ikki, uch, to'rt, olti, sakkiz, o'n ikki va yigirma to'rt.",
        "O'ttiz oltida to'qqizta: bir, ikki, uch, to'rt, olti, to'qqiz, o'n ikki, o'n sakkiz va o'ttiz olti.",
        "To'plamlar soni yigirma to'rtni ham, o'ttiz oltini ham bo'lishi shart. Aks holda nimadir ortib qoladi.",
      ],
      en: [
        'We look for divisors the way lesson one did, in pairs. Twenty four has eight: one, two, three, four, six, eight, twelve and twenty four.',
        'Thirty six has nine: one, two, three, four, six, nine, twelve, eighteen and thirty six.',
        'The number of sets must divide both twenty four and thirty six. Otherwise something is left over.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Общие делители', uz: "Umumiy bo'luvchilar", en: 'Common divisors' },
    common: [1, 2, 3, 4, 6, 12],
    cap_common: { ru: 'общие', uz: 'umumiy', en: 'common' },
    cap_max: { ru: 'наибольший', uz: 'eng kattasi', en: 'the greatest' },
    done: {
      ru: 'Общих делителей шесть: 1, 2, 3, 4, 6 и 12. Наибольший — 12. Его и называют наибольшим общим делителем, сокращённо НОД.',
      uz: "Umumiy bo'luvchilar oltita: 1, 2, 3, 4, 6 va 12. Eng kattasi — 12. Uni eng katta umumiy bo'luvchi, qisqacha EKUB deyishadi.",
      en: 'There are six common divisors: 1, 2, 3, 4, 6 and 12. The greatest is 12, and it is called the greatest common divisor, or GCD.',
    },
    audio: {
      ru: [
        'Положим два ряда делителей друг под друга и посмотрим, какие числа есть в обоих.',
        'Совпали шесть чисел: один, два, три, четыре, шесть и двенадцать. Это общие делители.',
        'Самый большой из них двенадцать. Его называют наибольшим общим делителем, сокращённо НОД. Значит наборов может быть двенадцать.',
      ],
      uz: [
        "Ikki qator bo'luvchini bir birining ostiga qo'yamiz va ikkalasida ham bor sonlarga qaraymiz.",
        "Oltita son mos keldi: bir, ikki, uch, to'rt, olti va o'n ikki. Bular umumiy bo'luvchilar.",
        "Ularning eng kattasi o'n ikki. Uni eng katta umumiy bo'luvchi, qisqacha EKUB deyishadi. Demak to'plam o'n ikkita bo'lishi mumkin.",
      ],
      en: [
        'Put the two rows of divisors one under the other and look for the numbers that appear in both.',
        'Six numbers match: one, two, three, four, six and twelve. These are the common divisors.',
        'The greatest of them is twelve. It is called the greatest common divisor, or GCD. So there can be twelve sets.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Способ: два ряда', uz: 'Usul: ikki qator', en: 'Method: two rows' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_a: 12,
    demo_b: 18,
    demo_note: {
      ru: 'Общие делители 12 и 18: 1, 2, 3, 6. Наибольший — 6. Значит НОД(12, 18) = 6.',
      uz: "12 va 18 ning umumiy bo'luvchilari: 1, 2, 3, 6. Eng kattasi — 6. Demak EKUB(12, 18) = 6.",
      en: 'The common divisors of 12 and 18 are 1, 2, 3, 6. The greatest is 6, so GCD(12, 18) = 6.',
    },
    play_ask: { ru: 'Чему равен НОД(8, 20)?', uz: 'EKUB(8, 20) nechaga teng?', en: 'What is GCD(8, 20)?' },
    play_opts: ['2', '4', '8'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. Делители 8: 1, 2, 4, 8. Делители 20: 1, 2, 4, 5, 10, 20. Общие — 1, 2, 4, наибольший 4.',
      uz: "To'g'ri. 8 ning bo'luvchilari: 1, 2, 4, 8. 20 niki: 1, 2, 4, 5, 10, 20. Umumiylari — 1, 2, 4, eng kattasi 4.",
      en: 'Right. Divisors of 8: 1, 2, 4, 8. Divisors of 20: 1, 2, 4, 5, 10, 20. Common ones are 1, 2, 4 and the greatest is 4.',
    },
    play_wrong: [
      { ru: '2 общий делитель, но не наибольший: четвёрка тоже делит и 8, и 20.', uz: "2 umumiy bo'luvchi, lekin eng kattasi emas: to'rt ham 8 ni, ham 20 ni bo'ladi.", en: 'Two is a common divisor but not the greatest: four divides 8 and 20 as well.' },
      null,
      { ru: '8 делит само себя, но 20 на 8 не делится: 20 : 8 = 2 и 4 в остатке.', uz: "8 o'zini bo'ladi, lekin 20 soni 8 ga bo'linmaydi: 20 : 8 = 2, qoldiq 4.", en: 'Eight divides itself, but 20 does not divide by 8: 20 : 8 = 2 with 4 left over.' },
    ],
    audio: {
      intro: {
        ru: 'Способ первый. Выписываем делители обоих чисел, отмечаем общие и берём самый большой. Покажу на двенадцати и восемнадцати.',
        uz: "Birinchi usul. Ikkala sonning bo'luvchilarini yozamiz, umumiylarini belgilaymiz va eng kattasini olamiz. O'n ikki va o'n sakkizda ko'rsataman.",
        en: 'Method one. Write out the divisors of both numbers, mark the common ones and take the largest. I will show it on twelve and eighteen.',
      },
      demo: {
        ru: 'Общие делители один, два, три и шесть. Самый большой шесть. Значит наибольший общий делитель двенадцати и восемнадцати равен шести.',
        uz: "Umumiy bo'luvchilar bir, ikki, uch va olti. Eng kattasi olti. Demak o'n ikki va o'n sakkizning eng katta umumiy bo'luvchisi oltiga teng.",
        en: 'The common divisors are one, two, three and six. The largest is six. So the greatest common divisor of twelve and eighteen is six.',
      },
      play: {
        ru: 'Теперь ваша очередь. Найдите наибольший общий делитель восьми и двадцати.',
        uz: "Endi sizning navbatingiz. Sakkiz va yigirmaning eng katta umumiy bo'luvchisini toping.",
        en: 'Now it is your turn. Find the greatest common divisor of eight and twenty.',
      },
      ok: {
        ru: 'Верно. Общие делители один, два и четыре, наибольший четыре.',
        uz: "To'g'ri. Umumiy bo'luvchilar bir, ikki va to'rt, eng kattasi to'rt.",
        en: 'Right. The common divisors are one, two and four, and the greatest is four.',
      },
      wrong: {
        ru: 'Выпишите делители обоих чисел и сравните ряды.',
        uz: "Ikkala sonning bo'luvchilarini yozing va qatorlarni solishtiring.",
        en: 'Write out the divisors of both numbers and compare the rows.',
      },
    },
  },

  s_fact: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Способ 2: через простые', uz: 'Usul 2: tub sonlar orqali', en: 'Method 2: through primes' },
    a: { n: 24, f: [2, 2, 2, 3] },
    b: { n: 36, f: [2, 2, 3, 3] },
    common: [2, 2, 3],
    done: {
      ru: 'Берём только те множители, что есть у обоих: 2, 2 и 3. Их произведение 12 — это и есть НОД.',
      uz: "Faqat ikkalasida ham bor ko'paytuvchilarni olamiz: 2, 2 va 3. Ularning ko'paytmasi 12 — bu EKUB.",
      en: 'Take only the factors both have: 2, 2 and 3. Their product is 12, and that is the GCD.',
    },
    audio: {
      ru: [
        'Второй способ опирается на прошлый урок. Разложим оба числа на простые множители.',
        'Двадцать четыре это два, два, два и три. Тридцать шесть это два, два, три и три.',
        'Берём только общие множители: две двойки и одну тройку. Перемножаем и получаем двенадцать. Тот же ответ, что и первым способом.',
      ],
      uz: [
        "Ikkinchi usul o'tgan darsga tayanadi. Ikkala sonni tub ko'paytuvchilarga yoyamiz.",
        "Yigirma to'rt bu ikki, ikki, ikki va uch. O'ttiz olti bu ikki, ikki, uch va uch.",
        "Faqat umumiy ko'paytuvchilarni olamiz: ikkita ikki va bitta uch. Ko'paytiramiz va o'n ikki chiqadi. Birinchi usuldagi javobning o'zi.",
      ],
      en: [
        'The second method leans on the previous lesson. Factor both numbers into primes.',
        'Twenty four is two, two, two and three. Thirty six is two, two, three and three.',
        'Take only the shared factors: two twos and one three. Multiply them and get twelve. The same answer as the first method gave.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Сколько наборов из 24 и 36', uz: "24 va 36 dan nechta to'plam", en: 'How many sets from 24 and 36' },
    lead: { ru: 'НОД уже найден. Теперь посмотрим, что попадёт в каждый набор.', uz: "EKUB topildi. Endi har bir to'plamga nima tushishini ko'ramiz.", en: 'The GCD is found. Now let us see what goes into each set.' },
    rows: [
      { ru: 'Наборов: 12', uz: "To'plamlar: 12", en: 'Sets: 12' },
      { ru: '24 : 12 = 2 ручки в каждом', uz: "24 : 12 = 2 tadan ruchka", en: '24 : 12 = 2 pens in each' },
      { ru: '36 : 12 = 3 тетради в каждом', uz: "36 : 12 = 3 tadan daftar", en: '36 : 12 = 3 notebooks in each' },
    ],
    done: {
      ru: 'Двенадцать одинаковых наборов: 2 ручки и 3 тетради. Ничего не осталось — Дилноза была права.',
      uz: "O'n ikkita bir xil to'plam: 2 ruchka va 3 daftar. Hech narsa ortmadi — Dilnoza haq edi.",
      en: 'Twelve identical sets: 2 pens and 3 notebooks. Nothing is left over — Dilnoza was right.',
    },
    audio: {
      ru: [
        'Решаем вместе. Наибольший общий делитель двенадцать, значит наборов двенадцать.',
        'Двадцать четыре ручки разделить на двенадцать наборов это по две ручки в каждом.',
        'Тридцать шесть тетрадей разделить на двенадцать это по три тетради. Ничего не осталось, и наборы одинаковые.',
      ],
      uz: [
        "Birga yechamiz. Eng katta umumiy bo'luvchi o'n ikki, demak to'plam o'n ikkita.",
        "Yigirma to'rt ruchkani o'n ikkita to'plamga bo'lsak, har biriga ikkitadan ruchka.",
        "O'ttiz olti daftarni o'n ikkiga bo'lsak, uchtadan daftar. Hech narsa ortmadi, to'plamlar bir xil.",
      ],
      en: [
        'Let us solve it together. The greatest common divisor is twelve, so there are twelve sets.',
        'Twenty four pens divided into twelve sets is two pens each.',
        'Thirty six notebooks divided by twelve is three notebooks each. Nothing is left and the sets are identical.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Особый случай', uz: 'Alohida holat', en: 'A special case' },
    title: { ru: 'Когда НОД равен 1', uz: 'EKUB 1 ga teng bo\'lganda', en: 'When the GCD is 1' },
    a: { n: 8, d: [1, 2, 4, 8] },
    b: { n: 15, d: [1, 3, 5, 15] },
    done: {
      ru: 'У 8 и 15 общий делитель только один — единица. Такие числа называют взаимно простыми. Оба при этом составные.',
      uz: "8 va 15 ning umumiy bo'luvchisi bitta — bir. Bunday sonlar o'zaro tub sonlar deyiladi. Ikkalasi ham murakkab bo'lsa ham.",
      en: 'Eight and fifteen share only one divisor: one. Such numbers are called coprime, even though both are composite.',
    },
    audio: {
      ru: [
        'Особый случай. Возьмём восемь и пятнадцать. Делители восьми: один, два, четыре, восемь.',
        'Делители пятнадцати: один, три, пять, пятнадцать. Общий только один.',
        'Такие числа называют взаимно простыми. Обратите внимание: оба составные, а общих делителей кроме единицы у них нет.',
      ],
      uz: [
        "Alohida holat. Sakkiz va o'n beshni olamiz. Sakkizning bo'luvchilari: bir, ikki, to'rt, sakkiz.",
        "O'n beshniki: bir, uch, besh, o'n besh. Umumiysi faqat bir.",
        "Bunday sonlar o'zaro tub sonlar deyiladi. E'tibor bering: ikkalasi ham murakkab, lekin birdan boshqa umumiy bo'luvchisi yo'q.",
      ],
      en: [
        'A special case. Take eight and fifteen. The divisors of eight are one, two, four, eight.',
        'The divisors of fifteen are one, three, five, fifteen. Only one is shared.',
        'Such numbers are called coprime. Note that both are composite, yet they share no divisor except one.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Наибольший общий делитель', uz: "Eng katta umumiy bo'luvchi", en: 'The greatest common divisor' },
    rule_1: {
      ru: 'НОД(a, b) — самое большое число, на которое делятся и a, и b. Если НОД равен 1, числа называют взаимно простыми.',
      uz: "EKUB(a, b) — a ni ham, b ni ham bo'ladigan eng katta son. Agar EKUB 1 ga teng bo'lsa, sonlar o'zaro tub deyiladi.",
      en: 'GCD(a, b) is the largest number that divides both a and b. If the GCD is 1, the numbers are called coprime.',
    },
    rule_2: {
      ru: 'Подарки: НОД(24, 36) = 12, значит наборов двенадцать, по 2 ручки и 3 тетради. Права была Дилноза.',
      uz: "Sovg'alar: EKUB(24, 36) = 12, demak to'plam o'n ikkita, har birida 2 ruchka va 3 daftar. Dilnoza haq edi.",
      en: 'The gifts: GCD(24, 36) = 12, so there are twelve sets with 2 pens and 3 notebooks each. Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Наибольший общий делитель это самое большое число, на которое делятся оба. Если он равен единице, числа называют взаимно простыми. И вернёмся к подаркам. Наибольший общий делитель двадцати четырёх и тридцати шести двенадцать, значит наборов двенадцать: по две ручки и три тетради. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Eng katta umumiy bo'luvchi bu ikkalasini ham bo'ladigan eng katta son. Agar u birga teng bo'lsa, sonlar o'zaro tub deyiladi. Va sovg'alarga qaytamiz. Yigirma to'rt va o'ttiz oltining eng katta umumiy bo'luvchisi o'n ikki, demak to'plam o'n ikkita: ikkitadan ruchka va uchtadan daftar. Dilnoza haq edi.",
      en: 'Let us remember the rule. The greatest common divisor is the largest number that divides both. If it equals one, the numbers are called coprime. And back to the gifts. The greatest common divisor of twenty four and thirty six is twelve, so there are twelve sets: two pens and three notebooks each. Dilnoza was right.',
    },
  },

  s_common: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Общий делитель', uz: "Umumiy bo'luvchi", en: 'A common divisor' },
    lead: { ru: 'Число должно делить оба, а не одно.', uz: "Son ikkalasini ham bo'lishi kerak, bittasini emas.", en: 'The number must divide both, not just one.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какое число — общий делитель 18 и 30?', uz: "Qaysi son 18 va 30 ning umumiy bo'luvchisi?", en: 'Which number is a common divisor of 18 and 30?' },
        opts: ['4', '6', '9'],
        correct: 1,
        ok: { ru: 'Верно. 18 : 6 = 3 и 30 : 6 = 5 — делит оба.', uz: "To'g'ri. 18 : 6 = 3 va 30 : 6 = 5 — ikkalasini ham bo'ladi.", en: 'Right. 18 : 6 = 3 and 30 : 6 = 5 — it divides both.' },
        wrong: [
          { ru: '18 на 4 не делится: 18 : 4 = 4 и 2 в остатке.', uz: "18 soni 4 ga bo'linmaydi: 18 : 4 = 4, qoldiq 2.", en: '18 does not divide by 4: 18 : 4 = 4 with 2 left over.' },
          null,
          { ru: '9 делит 18, но 30 на 9 не делится.', uz: "9 soni 18 ni bo'ladi, lekin 30 soni 9 ga bo'linmaydi.", en: 'Nine divides 18, but 30 does not divide by 9.' },
        ],
      },
      {
        q: { ru: 'Сколько общих делителей у 10 и 25?', uz: "10 va 25 ning nechta umumiy bo'luvchisi bor?", en: 'How many common divisors do 10 and 25 have?' },
        opts: ['1', '2', '3'],
        correct: 1,
        ok: { ru: 'Верно. Делители 10: 1, 2, 5, 10. Делители 25: 1, 5, 25. Общие — 1 и 5.', uz: "To'g'ri. 10 niki: 1, 2, 5, 10. 25 niki: 1, 5, 25. Umumiylari — 1 va 5.", en: 'Right. Divisors of 10: 1, 2, 5, 10. Of 25: 1, 5, 25. Common: 1 and 5.' },
        wrong: [
          { ru: 'Единица общая всегда, но здесь есть ещё пятёрка.', uz: "Bir doim umumiy, lekin bu yerda besh ham bor.", en: 'One is always common, but five is here as well.' },
          null,
          { ru: 'Третьего общего делителя нет: двойка не делит 25, десятка тоже.', uz: "Uchinchi umumiy bo'luvchi yo'q: ikki 25 ni bo'lmaydi, o'n ham.", en: 'There is no third: two does not divide 25, nor does ten.' },
        ],
      },
      {
        q: { ru: 'Общий делитель любых двух чисел — это…', uz: "Har qanday ikki sonning umumiy bo'luvchisi — bu…", en: 'A common divisor of any two numbers is…' },
        opts: [
          { ru: 'всегда 1', uz: 'doim 1', en: 'always 1' },
          { ru: 'всегда 2', uz: 'doim 2', en: 'always 2' },
          { ru: 'меньшее из чисел', uz: 'sonlarning kichigi', en: 'the smaller number' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Единица делит любое число, поэтому она общий делитель всегда.', uz: "To'g'ri. Bir har qanday sonni bo'ladi, shuning uchun u doim umumiy bo'luvchi.", en: 'Right. One divides every number, so it is always a common divisor.' },
        wrong: [
          null,
          { ru: 'Двойка не делит нечётные: у 9 и 15 её нет.', uz: "Ikki toq sonlarni bo'lmaydi: 9 va 15 da u yo'q.", en: 'Two does not divide odd numbers: 9 and 15 do not have it.' },
          { ru: 'Меньшее не всегда делит большее: 8 и 20 — восьмёрка не делит двадцать.', uz: "Kichigi doim kattasini bo'lavermaydi: 8 va 20 — sakkiz yigirmani bo'lmaydi.", en: 'The smaller does not always divide the larger: 8 and 20 — eight does not divide twenty.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Проверяйте оба числа: делитель должен подходить каждому.',
        uz: "Mashq. Ikkala sonni tekshiring: bo'luvchi har biriga mos kelishi kerak.",
        en: 'Practice. Check both numbers: the divisor must fit each of them.',
      },
    },
  },

  s_gcd: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди НОД', uz: 'EKUB ni toping', en: 'Find the GCD' },
    lead: { ru: 'Два ряда делителей или простые множители — способ выбирай сам.', uz: "Ikki qator bo'luvchi yoki tub ko'paytuvchilar — usulni o'zingiz tanlang.", en: 'Two rows of divisors or prime factors — pick the method yourself.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'НОД(16, 24)', uz: 'EKUB(16, 24)', en: 'GCD(16, 24)' },
        opts: ['4', '8', '16'],
        correct: 1,
        ok: { ru: 'Верно. 16 = 2·2·2·2, 24 = 2·2·2·3, общее 2·2·2 = 8.', uz: "To'g'ri. 16 = 2·2·2·2, 24 = 2·2·2·3, umumiysi 2·2·2 = 8.", en: 'Right. 16 = 2·2·2·2, 24 = 2·2·2·3, shared 2·2·2 = 8.' },
        wrong: [
          { ru: '4 общий, но не наибольший: восьмёрка тоже делит оба.', uz: "4 umumiy, lekin eng kattasi emas: sakkiz ham ikkalasini bo'ladi.", en: 'Four is common but not the greatest: eight divides both as well.' },
          null,
          { ru: '24 на 16 не делится: 24 : 16 = 1 и 8 в остатке.', uz: "24 soni 16 ga bo'linmaydi: 24 : 16 = 1, qoldiq 8.", en: '24 does not divide by 16: 24 : 16 = 1 with 8 left over.' },
        ],
      },
      {
        q: { ru: 'НОД(9, 21)', uz: 'EKUB(9, 21)', en: 'GCD(9, 21)' },
        opts: ['1', '3', '9'],
        correct: 1,
        ok: { ru: 'Верно. 9 = 3·3, 21 = 3·7, общая только тройка.', uz: "To'g'ri. 9 = 3·3, 21 = 3·7, umumiysi faqat uch.", en: 'Right. 9 = 3·3, 21 = 3·7, only the three is shared.' },
        wrong: [
          { ru: 'Единица общая всегда, но тройка делит и 9, и 21.', uz: "Bir doim umumiy, lekin uch 9 ni ham, 21 ni ham bo'ladi.", en: 'One is always common, but three divides both 9 and 21.' },
          null,
          { ru: '21 на 9 не делится: 21 : 9 = 2 и 3 в остатке.', uz: "21 soni 9 ga bo'linmaydi: 21 : 9 = 2, qoldiq 3.", en: '21 does not divide by 9: 21 : 9 = 2 with 3 left over.' },
        ],
      },
      {
        q: { ru: 'НОД(14, 35)', uz: 'EKUB(14, 35)', en: 'GCD(14, 35)' },
        opts: ['5', '7', '14'],
        correct: 1,
        ok: { ru: 'Верно. 14 = 2·7, 35 = 5·7, общая семёрка.', uz: "To'g'ri. 14 = 2·7, 35 = 5·7, umumiysi yetti.", en: 'Right. 14 = 2·7, 35 = 5·7, the seven is shared.' },
        wrong: [
          { ru: '5 делит 35, но 14 на 5 не делится.', uz: "5 soni 35 ni bo'ladi, lekin 14 soni 5 ga bo'linmaydi.", en: 'Five divides 35, but 14 does not divide by 5.' },
          null,
          { ru: '35 на 14 не делится.', uz: "35 soni 14 ga bo'linmaydi.", en: '35 does not divide by 14.' },
        ],
      },
      {
        q: { ru: 'НОД(6, 30)', uz: 'EKUB(6, 30)', en: 'GCD(6, 30)' },
        opts: ['3', '6', '30'],
        correct: 1,
        ok: { ru: 'Верно. 30 делится на 6, поэтому НОД равен меньшему числу.', uz: "To'g'ri. 30 soni 6 ga bo'linadi, shuning uchun EKUB kichik songa teng.", en: 'Right. 30 divides by 6, so the GCD equals the smaller number.' },
        wrong: [
          { ru: '3 общий, но 6 тоже делит оба и он больше.', uz: "3 umumiy, lekin 6 ham ikkalasini bo'ladi va u kattaroq.", en: 'Three is common, but six divides both and is larger.' },
          null,
          { ru: '30 не делит 6: наибольший общий делитель не бывает больше меньшего числа.', uz: "30 soni 6 ni bo'lmaydi: eng katta umumiy bo'luvchi kichik sondan katta bo'lmaydi.", en: '30 does not divide 6: the GCD is never larger than the smaller number.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Ищем наибольший общий делитель. Способ выбирайте сами: два ряда или простые множители.',
        uz: "Eng katta umumiy bo'luvchini qidiramiz. Usulni o'zingiz tanlang: ikki qator yoki tub ko'paytuvchilar.",
        en: 'Find the greatest common divisor. Choose the method yourself: two rows or prime factors.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Взаимно простые или нет', uz: "O'zaro tubmi yoki yo'q", en: 'Coprime or not' },
    lead: { ru: 'Взаимно простые — те, у кого общий делитель только 1.', uz: "O'zaro tub — umumiy bo'luvchisi faqat 1 bo'lganlar.", en: 'Coprime means the only common divisor is 1.' },
    bin_a: { ru: 'Взаимно простые', uz: "O'zaro tub", en: 'Coprime' },
    bin_b: { ru: 'Есть общий делитель', uz: "Umumiy bo'luvchi bor", en: 'Have a common divisor' },
    cards: [
      { label: '8 и 15', bin: 'a' },
      { label: '12 и 18', bin: 'b' },
      { label: '9 и 16', bin: 'a' },
      { label: '10 и 25', bin: 'b' },
      { label: '7 и 12', bin: 'a' },
      { label: '14 и 21', bin: 'b' },
    ],
    hint: {
      ru: 'Ищи общий делитель: 2, 3, 5, 7. Нашёлся — значит не взаимно простые.',
      uz: "Umumiy bo'luvchi qidiring: 2, 3, 5, 7. Topilsa — o'zaro tub emas.",
      en: 'Look for a shared divisor: 2, 3, 5, 7. If you find one, they are not coprime.',
    },
    correct_text: {
      ru: 'Верно. У 12 и 18 общий 6, у 10 и 25 общий 5, у 14 и 21 общий 7. Остальные пары делят только единицу.',
      uz: "To'g'ri. 12 va 18 da umumiysi 6, 10 va 25 da 5, 14 va 21 da 7. Qolgan juftliklarda faqat bir umumiy.",
      en: 'Right. 12 and 18 share 6, 10 and 25 share 5, 14 and 21 share 7. The other pairs share only one.',
    },
    audio: {
      intro: {
        ru: 'Разложите пары по двум корзинам. Ищите общий делитель кроме единицы.',
        uz: "Juftliklarni ikki savatga ajrating. Birdan boshqa umumiy bo'luvchi qidiring.",
        en: 'Sort the pairs into two baskets. Look for a common divisor other than one.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Поищи общий делитель ещё раз.', uz: "Bu yerga emas. Umumiy bo'luvchini yana qidiring.", en: 'Not here. Look for a common divisor again.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «НОД(12, 18) = 36, ведь 36 делится и на 12, и на 18». Где ошибка?', uz: "Aziz: «EKUB(12, 18) = 36, chunki 36 soni 12 ga ham, 18 ga ham bo'linadi». Xato qayerda?", en: 'Aziz: “GCD(12, 18) = 36, since 36 divides by 12 and by 18.” Where is the mistake?' },
        opts: [
          { ru: 'Он ищет делитель, а нашёл кратное', uz: "U bo'luvchi qidirib, karralini topdi", en: 'He was after a divisor and found a multiple' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: '36 не делится на 12', uz: "36 soni 12 ga bo'linmaydi", en: '36 does not divide by 12' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Делитель не больше самого числа. НОД(12, 18) = 6, а 36 — это общее кратное.', uz: "To'g'ri. Bo'luvchi sonning o'zidan katta bo'lmaydi. EKUB(12, 18) = 6, 36 esa umumiy karrali.", en: 'Right. A divisor is never larger than the number. GCD(12, 18) = 6, while 36 is a common multiple.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: делитель не может быть больше самого числа.', uz: "Xato bor: bo'luvchi sonning o'zidan katta bo'la olmaydi.", en: 'There is a mistake: a divisor cannot exceed the number.' },
          { ru: '36 как раз делится на 12, но это делает его кратным, а не делителем.', uz: "36 aynan 12 ga bo'linadi, lekin bu uni karrali qiladi, bo'luvchi emas.", en: '36 does divide by 12, but that makes it a multiple, not a divisor.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «8 и 15 взаимно простые, значит оба простые». Проверь.', uz: "Dilnoza: «8 va 15 o'zaro tub, demak ikkalasi ham tub». Tekshiring.", en: 'Dilnoza: “8 and 15 are coprime, so both are prime.” Check it.' },
        opts: [
          { ru: 'Неверно: 8 = 2·4, 15 = 3·5 — оба составные', uz: "Noto'g'ri: 8 = 2·4, 15 = 3·5 — ikkalasi murakkab", en: 'Wrong: 8 = 2·4, 15 = 3·5 — both composite' },
          { ru: 'Верно', uz: "To'g'ri", en: 'Correct' },
          { ru: 'Неверно: они не взаимно простые', uz: "Noto'g'ri: ular o'zaro tub emas", en: 'Wrong: they are not coprime' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Взаимно простые — это про пару, а не про каждое число отдельно.', uz: "To'g'ri. O'zaro tublik juftlik haqida, har bir sonning o'zi haqida emas.", en: 'Right. Coprime is about the pair, not about each number on its own.' },
        wrong: [
          null,
          { ru: 'Не верно: 8 и 15 составные, хотя общих делителей у них нет.', uz: "To'g'ri emas: 8 va 15 murakkab, garchi umumiy bo'luvchisi bo'lmasa ham.", en: 'Not correct: 8 and 15 are composite, though they share no divisors.' },
          { ru: 'Взаимно простые они как раз: общий делитель только 1.', uz: "Ular aynan o'zaro tub: umumiy bo'luvchi faqat 1.", en: 'They are coprime: the only common divisor is 1.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое рассуждение. Ошибка бывает и в числе, и в самом понятии.',
        uz: "Birovning fikrini tekshiring. Xato sonda ham, tushunchaning o'zida ham bo'lishi mumkin.",
        en: 'Check someone else’s reasoning. A mistake can be in the number and in the idea itself.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Ещё подарки', uz: "Yana sovg'alar", en: 'More gifts' },
    lead: { ru: 'На складе 30 блокнотов и 45 карандашей. Наборы одинаковые, остатка нет.', uz: "Omborda 30 bloknot va 45 qalam bor. To'plamlar bir xil, qoldiq yo'q.", en: 'The store has 30 notepads and 45 pencils. The sets are identical, nothing is left.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    stock: ['30', '45'],
    items: [
      {
        q: { ru: 'Сколько наборов выйдет самое большее?', uz: "Eng ko'pi bilan nechta to'plam chiqadi?", en: 'What is the largest number of sets?' },
        opts: ['5', '15', '30'],
        correct: 1,
        ok: { ru: 'Верно. 30 = 2·3·5, 45 = 3·3·5, общее 3·5 = 15.', uz: "To'g'ri. 30 = 2·3·5, 45 = 3·3·5, umumiysi 3·5 = 15.", en: 'Right. 30 = 2·3·5, 45 = 3·3·5, shared 3·5 = 15.' },
        wrong: [
          { ru: '5 общий делитель, но не наибольший: 15 тоже делит оба.', uz: "5 umumiy bo'luvchi, lekin eng kattasi emas: 15 ham ikkalasini bo'ladi.", en: 'Five is common but not the greatest: fifteen divides both as well.' },
          null,
          { ru: '45 на 30 не делится, значит 30 наборов не выйдет.', uz: "45 soni 30 ga bo'linmaydi, demak 30 ta to'plam chiqmaydi.", en: '45 does not divide by 30, so thirty sets are impossible.' },
        ],
      },
      {
        q: { ru: 'Что попадёт в каждый набор?', uz: "Har bir to'plamga nima tushadi?", en: 'What goes into each set?' },
        opts: [
          { ru: '2 блокнота и 3 карандаша', uz: '2 bloknot va 3 qalam', en: '2 notepads and 3 pencils' },
          { ru: '3 блокнота и 2 карандаша', uz: '3 bloknot va 2 qalam', en: '3 notepads and 2 pencils' },
          { ru: '5 блокнотов и 9 карандашей', uz: '5 bloknot va 9 qalam', en: '5 notepads and 9 pencils' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 30 : 15 = 2 блокнота, 45 : 15 = 3 карандаша.', uz: "To'g'ri. 30 : 15 = 2 bloknot, 45 : 15 = 3 qalam.", en: 'Right. 30 : 15 = 2 notepads, 45 : 15 = 3 pencils.' },
        wrong: [
          null,
          { ru: 'Наоборот: блокнотов меньше, значит их в наборе 2.', uz: "Teskarisi: bloknot kamroq, demak to'plamda 2 ta.", en: 'The other way round: there are fewer notepads, so 2 per set.' },
          { ru: 'Это деление на 6 наборов, а наибольшее число наборов 15.', uz: "Bu 6 ta to'plamga bo'lish, eng ko'p to'plam esa 15 ta.", en: 'That splits into 6 sets, and the largest number is 15.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про склад. Тридцать блокнотов и сорок пять карандашей, наборы одинаковые.',
        uz: "Ombor haqida masala. O'ttiz bloknot va qirq besh qalam, to'plamlar bir xil.",
        en: 'A problem about the store. Thirty notepads and forty five pencils, identical sets.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 12,
        q: { ru: 'Чему равен НОД(24, 36)? Набери ответ.', uz: 'EKUB(24, 36) nechaga teng? Javobni tering.', en: 'What is GCD(24, 36)? Type the answer.' },
        hint: { ru: 'Общие делители: 1, 2, 3, 4, 6, 12. Возьми самый большой.', uz: "Umumiy bo'luvchilar: 1, 2, 3, 4, 6, 12. Eng kattasini oling.", en: 'Common divisors: 1, 2, 3, 4, 6, 12. Take the largest.' },
        hint_audio: { ru: 'Общие делители один, два, три, четыре, шесть и двенадцать. Возьмите самый большой.', uz: "Umumiy bo'luvchilar bir, ikki, uch, to'rt, olti va o'n ikki. Eng kattasini oling.", en: 'The common divisors are one, two, three, four, six and twelve. Take the largest.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Какая пара — взаимно простые числа?', uz: "Qaysi juftlik o'zaro tub sonlar?", en: 'Which pair is coprime?' },
        opts: ['6 и 9', '10 и 15', '9 и 16', '12 и 20'],
        wrong: [
          { ru: 'У 6 и 9 общий делитель 3.', uz: "6 va 9 da umumiy bo'luvchi 3.", en: '6 and 9 share the divisor 3.' },
          { ru: 'У 10 и 15 общий делитель 5.', uz: "10 va 15 da umumiy bo'luvchi 5.", en: '10 and 15 share the divisor 5.' },
          null,
          { ru: 'У 12 и 20 общий делитель 4.', uz: "12 va 20 da umumiy bo'luvchi 4.", en: '12 and 20 share the divisor 4.' },
        ],
        correct: { ru: 'Верно. 9 = 3·3, 16 = 2·2·2·2 — общих множителей нет, НОД равен 1.', uz: "To'g'ri. 9 = 3·3, 16 = 2·2·2·2 — umumiy ko'paytuvchi yo'q, EKUB 1 ga teng.", en: 'Right. 9 = 3·3, 16 = 2·2·2·2 — no shared factors, the GCD is 1.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Может ли НОД двух чисел быть больше меньшего из них?', uz: "Ikki sonning EKUBi ularning kichigidan katta bo'la oladimi?", en: 'Can the GCD be larger than the smaller number?' },
        opts: [
          { ru: 'Да, если числа большие', uz: "Ha, agar sonlar katta bo'lsa", en: 'Yes, if the numbers are large' },
          { ru: 'Нет, никогда', uz: "Yo'q, hech qachon", en: 'No, never' },
          { ru: 'Да, если оба чётные', uz: "Ha, agar ikkalasi juft bo'lsa", en: 'Yes, if both are even' },
          { ru: 'Только для простых чисел', uz: 'Faqat tub sonlar uchun', en: 'Only for primes' },
        ],
        wrong: [
          { ru: 'Размер не важен: делитель не бывает больше самого числа.', uz: "Kattaligi muhim emas: bo'luvchi sonning o'zidan katta bo'lmaydi.", en: 'Size does not matter: a divisor never exceeds the number.' },
          null,
          { ru: 'Чётность не спасает: у 8 и 12 НОД равен 4, а не больше восьми.', uz: "Juftlik yordam bermaydi: 8 va 12 da EKUB 4, sakkizdan katta emas.", en: 'Being even does not help: for 8 and 12 the GCD is 4, not more than eight.' },
          { ru: 'У простых чисел НОД равен 1 — это ещё меньше.', uz: "Tub sonlarda EKUB 1 ga teng — bu yanada kichik.", en: 'For primes the GCD is 1, which is even smaller.' },
        ],
        correct: { ru: 'Верно. Делитель числа не больше самого числа, поэтому НОД не больше меньшего.', uz: "To'g'ri. Sonning bo'luvchisi sonning o'zidan katta emas, shuning uchun EKUB kichigidan katta emas.", en: 'Right. A divisor never exceeds its number, so the GCD never exceeds the smaller one.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'НОД(15, 45) равен…', uz: 'EKUB(15, 45) nechaga teng…', en: 'GCD(15, 45) is…' },
        opts: ['15', '5', '3', '45'],
        wrong: [
          null,
          { ru: '5 общий, но 15 тоже делит оба и он больше.', uz: "5 umumiy, lekin 15 ham ikkalasini bo'ladi va u kattaroq.", en: 'Five is common, but fifteen divides both and is larger.' },
          { ru: '3 общий, но не наибольший.', uz: "3 umumiy, lekin eng kattasi emas.", en: 'Three is common but not the greatest.' },
          { ru: '45 не делит 15.', uz: "45 soni 15 ni bo'lmaydi.", en: '45 does not divide 15.' },
        ],
        correct: { ru: 'Верно. 45 делится на 15, поэтому НОД равен 15.', uz: "To'g'ri. 45 soni 15 ga bo'linadi, shuning uchun EKUB 15 ga teng.", en: 'Right. 45 divides by 15, so the GCD is 15.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Для чего нужен НОД в задаче про наборы?', uz: "To'plamlar masalasida EKUB nima uchun kerak?", en: 'What is the GCD for in the sets problem?' },
        opts: [
          { ru: 'Чтобы узнать, сколько предметов всего', uz: "Jami nechta narsa borligini bilish uchun", en: 'To find how many items there are' },
          { ru: 'Чтобы найти остаток', uz: 'Qoldiqni topish uchun', en: 'To find the remainder' },
          { ru: 'Чтобы сделать наборы разными', uz: "To'plamlarni har xil qilish uchun", en: 'To make the sets different' },
          { ru: 'Чтобы наборов было как можно больше и без остатка', uz: "To'plam iloji boricha ko'p va qoldiqsiz bo'lishi uchun", en: 'To get as many sets as possible with nothing left' },
        ],
        wrong: [
          { ru: 'Общее количество мы и так знаем, оно дано в условии.', uz: "Umumiy sonni bilamiz, u shartda berilgan.", en: 'The totals are given in the problem already.' },
          { ru: 'Остатка как раз быть не должно — в этом и смысл.', uz: "Qoldiq bo'lmasligi kerak — gap shunda.", en: 'There must be no remainder — that is the point.' },
          { ru: 'Наборы обязаны быть одинаковыми.', uz: "To'plamlar bir xil bo'lishi shart.", en: 'The sets must be identical.' },
          null,
        ],
        correct: { ru: 'Верно. НОД даёт наибольшее число одинаковых наборов, в которых ничего не остаётся.', uz: "To'g'ri. EKUB hech narsa ortmaydigan eng ko'p bir xil to'plamni beradi.", en: 'Right. The GCD gives the largest number of identical sets with nothing left over.' },
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
      ru: 'Способ находить НОД без выписывания делителей придумал Евклид: большее число заменяют остатком от деления, и так пока остаток не станет нулём.',
      uz: "Bo'luvchilarni yozmasdan EKUB topish usulini Evklid o'ylab topgan: katta son bo'lish qoldig'i bilan almashtiriladi va qoldiq nol bo'lguncha shunday davom etadi.",
      en: 'Euclid found a way to get the GCD without listing divisors: replace the larger number by the remainder and repeat until the remainder is zero.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Способ находить наибольший общий делитель без выписывания делителей придумал Евклид. Большее число заменяют остатком от деления, и так до тех пор, пока остаток не станет нулём.',
      uz: "Bilasizmi? Bo'luvchilarni yozmasdan eng katta umumiy bo'luvchini topish usulini Evklid o'ylab topgan. Katta son bo'lish qoldig'i bilan almashtiriladi va qoldiq nol bo'lguncha shunday davom etadi.",
      en: 'Did you know? Euclid found a way to get the greatest common divisor without listing divisors. You replace the larger number by the remainder and repeat until the remainder is zero.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Делимость', uz: "Matematika · Bo'linish", en: 'Mathematics · Divisibility' },
    heading: { ru: 'Наибольший общий делитель', uz: "Eng katta umumiy bo'luvchi", en: 'Greatest common divisor' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'НОД — самое большое число, делящее оба', uz: "EKUB — ikkalasini bo'ladigan eng katta son", en: 'GCD is the largest number dividing both' },
    brief_2: { ru: 'два способа: ряды делителей и простые множители', uz: "ikki usul: bo'luvchilar qatori va tub ko'paytuvchilar", en: 'two methods: rows of divisors and prime factors' },
    brief_3: { ru: 'НОД = 1 → числа взаимно простые', uz: "EKUB = 1 → sonlar o'zaro tub", en: 'GCD = 1 → the numbers are coprime' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Где НОД в жизни', uz: 'EKUB hayotda qayerda', en: 'Where the GCD shows up' },
    memo_a1: { ru: 'одинаковые наборы без остатка', uz: "qoldiqsiz bir xil to'plamlar", en: 'identical sets with nothing left' },
    memo_q2: { ru: 'Насколько велик НОД', uz: 'EKUB qanchalik katta', en: 'How large the GCD is' },
    memo_a2: { ru: 'не больше меньшего из чисел', uz: 'sonlarning kichigidan katta emas', en: 'never more than the smaller number' },
    memo_q3: { ru: 'Если общих нет', uz: "Umumiysi bo'lmasa", en: 'If nothing is shared' },
    memo_a3: { ru: 'НОД = 1, числа взаимно простые', uz: "EKUB = 1, sonlar o'zaro tub", en: 'GCD = 1, the numbers are coprime' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Наибольший общий делитель это самое большое число, на которое делятся оба. Искать его можно двумя способами: рядами делителей или через простые множители.',
        'Подарки собраны: двенадцать наборов, в каждом две ручки и три тетради. Ничего не осталось.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Eng katta umumiy bo'luvchi bu ikkalasini ham bo'ladigan eng katta son. Uni ikki usul bilan topish mumkin: bo'luvchilar qatori yoki tub ko'paytuvchilar orqali.",
        "Sovg'alar yig'ildi: o'n ikkita to'plam, har birida ikkita ruchka va uchta daftar. Hech narsa ortmadi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The greatest common divisor is the largest number that divides both. You can find it two ways: rows of divisors or prime factors.',
        'The gifts are packed: twelve sets, two pens and three notebooks in each. Nothing is left over.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Два ряда делителей', uz: "Usul. Ikki qator bo'luvchi", en: 'Method. Two rows of divisors' },
    m1_steps: {
      ru: ['Выпиши делители первого числа', 'Выпиши делители второго', 'Отметь общие и возьми самый большой'],
      uz: ["Birinchi sonning bo'luvchilarini yozing", "Ikkinchisiniknini yozing", "Umumiylarini belgilang va eng kattasini oling"],
      en: ['Write the divisors of the first number', 'Write the divisors of the second', 'Mark the shared ones and take the largest'],
    },
    m1_no: {
      ru: 'Второй способ короче: разложи оба на простые и перемножь общие множители.',
      uz: "Ikkinchi usul qisqaroq: ikkalasini tub ko'paytuvchilarga yoying va umumiylarini ko'paytiring.",
      en: 'The second method is shorter: factor both into primes and multiply the shared factors.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: подготовка подарков. На хуке вопрос, в итоге ответ.
// У людей есть лицо, место обжитое: стол, коробки, лента, ножницы.
// ============================================================

// Ручка и тетрадь: их считают в наборах, поэтому они узнаваемы по силуэту.
const Pen = ({ x, y, h = 20, tone = '#019ACB' }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="0" y="0" width="4" height={h - 5} rx="1.6" fill={tone}/>
    <path d={`M0 ${h - 5} h4 l-2 5 z`} fill="#3E3128"/>
    <rect x="0" y="3" width="4" height="2.5" fill="#FFFFFF" opacity="0.5"/>
  </g>
);

const Notebook = ({ x, y, w = 13, h = 17, tone = '#F5C77E' }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="0" y="0" width={w} height={h} rx="2" fill={tone} stroke="#C99B3A" strokeWidth="0.6"/>
    <rect x="2" y="0" width="1.6" height={h} fill="#C99B3A" opacity="0.55"/>
    <rect x={w * 0.42} y={h * 0.3} width={w * 0.42} height="1.2" fill="#FFFFFF" opacity="0.7"/>
    <rect x={w * 0.42} y={h * 0.5} width={w * 0.42} height="1.2" fill="#FFFFFF" opacity="0.7"/>
  </g>
);

const GiftBox = ({ x, y, w = 30, h = 22, open = false }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="0" y="0" width={w} height={h} rx="3" fill="#FFFDF7" stroke="#DCCFB6"/>
    <rect x={w * 0.42} y="0" width={w * 0.16} height={h} fill="#FF4F28" opacity={open ? 0.35 : 0.75}/>
    <rect x="0" y={h * 0.42} width={w} height={h * 0.16} fill="#FF4F28" opacity={open ? 0.35 : 0.75}/>
  </g>
);

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d5wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE7D8"/>
      </linearGradient>
      <linearGradient id="d5table" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E7C99A"/><stop offset="100%" stopColor="#D2A96F"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d5wall)"/>

    {/* Полка с коробками и лентой */}
    <g>
      <rect x="12" y="34" width="120" height="4" rx="2" fill="#D9CDB5"/>
      <GiftBox x={18} y={14} w={26} h={20}/>
      <GiftBox x={52} y={14} w={26} h={20}/>
      <circle cx="102" cy="24" r="10" fill="#FFE8E1" stroke="#FF4F28"/>
      <circle cx="102" cy="24" r="3.4" fill="#FFFFFF"/>
    </g>

    {/* Две стопки: ручки и тетради */}
    <g>
      <text x="196" y="26" textAnchor="middle" fill="#019ACB"
        fontFamily="'JetBrains Mono', monospace" fontSize="17" fontWeight="700">24</text>
      {Array.from({ length: 8 }).map((_, i) => (
        <Pen key={i} x={166 + i * 8} y={34} h={26} tone={i % 2 ? '#019ACB' : '#7ECBE6'}/>
      ))}
      <text x="196" y="76" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="9">· · ·</text>
    </g>
    <g>
      <text x="316" y="26" textAnchor="middle" fill="#C99B3A"
        fontFamily="'JetBrains Mono', monospace" fontSize="17" fontWeight="700">36</text>
      {Array.from({ length: 7 }).map((_, i) => (
        <Notebook key={i} x={266 + i * 15} y={32} tone={i % 2 ? '#F5C77E' : '#EFC98F'}/>
      ))}
      <text x="316" y="76" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="9">· · ·</text>
    </g>

    {/* Люди у стола */}
    <Person x={64} ground={122} head={10} shirt="#7ECBE6" hair="#3E3128"/>
    <g className="d5-note">
      <rect x="80" y="82" width="44" height="32" rx="4" fill="#FFFFFF" stroke="#DDD3C0"/>
      <text x="102" y="96" textAnchor="middle" fill="#8A8883" fontFamily="'JetBrains Mono', monospace" fontSize="10">4 ?</text>
      <text x="102" y="108" textAnchor="middle" fill="#FF4F28" fontFamily="'JetBrains Mono', monospace" fontSize="10">24 · 36</text>
    </g>
    <Person x={356} ground={122} head={10} shirt="#F5C77E" hair="#5A4636"/>

    {/* Стол */}
    <rect x="0" y="122" width="400" height="8" fill="#C9A472"/>
    <rect x="0" y="130" width="400" height="24" fill="url(#d5table)"/>

    {/* На столе: три собранных набора и ножницы */}
    {[150, 196, 242].map((x, i) => (
      <g key={x} className={i === 2 ? 'd5-box-drop' : undefined}>
        <GiftBox x={x} y={100} w={34} h={22} open/>
        <Pen x={x + 6} y={104} h={14} tone="#019ACB"/>
        <Pen x={x + 12} y={104} h={14} tone="#019ACB"/>
        <Notebook x={x + 20} y={104} w={9} h={13}/>
      </g>
    ))}
    <g>
      <path d="M300 118 l14 -12" stroke="#7C8894" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M300 106 l14 12" stroke="#7C8894" strokeWidth="2.4" strokeLinecap="round"/>
      <circle cx="299" cy="120" r="2.6" fill="none" stroke="#7C8894" strokeWidth="1.6"/>
      <circle cx="299" cy="104" r="2.6" fill="none" stroke="#7C8894" strokeWidth="1.6"/>
    </g>
  </svg>
);

// Итог: двенадцать одинаковых наборов, ничего не осталось.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <text x="200" y="16" textAnchor="middle" fill="#1F7A4D"
      fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">12 × (2 + 3)</text>
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i} transform={`translate(${8 + (i % 6) * 64} ${i < 6 ? 22 : 44})`}>
        <GiftBox x={0} y={0} w={30} h={18} open/>
        <Pen x={4} y={3} h={11} tone="#019ACB"/>
        <Pen x={9} y={3} h={11} tone="#019ACB"/>
        <Notebook x={16} y={3} w={8} h={11}/>
      </g>
    ))}
    <rect x="0" y="66" width="400" height="26" fill="#E7C99A"/>
    <rect x="0" y="64" width="400" height="4" fill="#C9A472"/>
    <Person x={352} ground={66} head={7} shirt="#7ECBE6" hair="#3E3128" arms={false}/>
    <Person x={376} ground={66} head={7} shirt="#F5C77E" hair="#5A4636" arms={false}/>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
const DivRow = ({ list, common = [], best = null, label }) => (
  <div className="d5-row">
    {label && <span className="d5-label">{label}</span>}
    <span className="d5-chips">
      {list.map((n) => (
        <i key={n} className={'d5-chip'
          + (common.includes(n) ? ' d5-chip-common' : '')
          + (best === n ? ' d5-chip-best' : '')}>{n}</i>
      ))}
    </span>
  </div>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d5-stage">
        <DivRow list={c.d24} label={t(c.lab24)}/>
        {step >= 1 && <DivRow list={c.d36} label={t(c.lab36)}/>}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  const r = CONTENT.s_recall;
  const common = step >= 1 ? c.common : [];
  const best = step >= 2 ? 12 : null;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d5-stage">
        <DivRow list={r.d24} common={common} best={best} label={t(r.lab24)}/>
        <DivRow list={r.d36} common={common} best={best} label={t(r.lab36)}/>
        {step >= 1 && (
          <div className="d5-legend">
            <span className="d5-key d5-key-common">{t(c.cap_common)}</span>
            {step >= 2 && <span className="d5-key d5-key-best">{t(c.cap_max)}: 12</span>}
          </div>
        )}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const FactBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_fact;
  const line = (o, on) => (
    <p className="d5-fact">
      <b>{o.n}</b> =
      {o.f.map((f, i) => (
        <i key={i} className={'d5-f' + (on && c.common.includes(f) ? ' d5-f-on' : '')}>{f}</i>
      ))}
    </p>
  );
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d5-stage">
        {line(c.a, step >= 2)}
        {step >= 1 && line(c.b, step >= 2)}
        {step >= 2 && (
          <p className="d5-product">2 · 2 · 3 = <b>12</b></p>
        )}
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
      <div className="frame fade-up delay-1 d5-stage">
        <div className="d5-sets">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={'d5-set' + (step >= 1 ? ' d5-set-on' : '')} style={{ animationDelay: `${i * 60}ms` }}>
              <i className="d5-pen"/><i className="d5-pen"/><i className="d5-note"/>
            </span>
          ))}
        </div>
        <div className="d5-lines">
          {c.rows.map((r, i) => (
            <p key={i} className={'d5-line' + (step >= i ? ' d5-line-on' : '')}>{t(r)}</p>
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

const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d5-stage">
        <DivRow list={c.a.d} common={step >= 2 ? [1] : []} best={step >= 2 ? 1 : null} label={String(c.a.n)}/>
        {step >= 1 && <DivRow list={c.b.d} common={step >= 2 ? [1] : []} best={step >= 2 ? 1 : null} label={String(c.b.n)}/>}
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
const DIV = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

const ToolScreen = ({ screen, totalScreens, onNext, onPrev, onAnswer, storedAnswer }) => {
  const c = CONTENT.s_tool;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_tool_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'play' : 'demo');
  const [shown, setShown] = useState(0);      // 0 ряды, 1 общие, 2 наибольший
  const [picked, setPicked] = useState(null);
  const firstTryRef = useRef(true);
  const timersRef = useRef([]);
  const solved = picked === c.play_correct;
  const done = shown >= 2;
  const dA = DIV(c.demo_a);
  const dB = DIV(c.demo_b);
  const common = dA.filter((d) => dB.includes(d));

  const say = (node, id) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(pickL(node, lang), undefined, id);
  };

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (phase !== 'demo' || done) return undefined;
    timersRef.current.push(setTimeout(() => setShown((v) => v + 1), 1500));
    if (shown === 1) timersRef.current.push(setTimeout(() => say(c.audio.demo, 's_tool_demo'), 1700));
    return () => timersRef.current.forEach(clearTimeout);
    /* eslint-disable-next-line */
  }, [phase, shown, done]);

  const toPlay = () => { setPhase('play'); setPicked(null); say(c.audio.play, 's_tool_play'); };

  const answer = (i) => {
    if (solved) return;
    setPicked(i);
    if (i !== c.play_correct) {
      firstTryRef.current = false;
      say(c.audio.wrong, 's_tool_wrong');
      return;
    }
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
        <div className={'d5-banner fade-up delay-1' + (phase === 'play' ? ' d5-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d5-stage">
          {phase === 'demo' ? (
            <>
              <DivRow list={dA} common={shown >= 1 ? common : []} best={shown >= 2 ? 6 : null} label={String(c.demo_a)}/>
              <DivRow list={dB} common={shown >= 1 ? common : []} best={shown >= 2 ? 6 : null} label={String(c.demo_b)}/>
              <p className={'body d5-verdict' + (done ? ' d5-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{t(c.play_ask)}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={o} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{o}</button>
                ))}
              </div>
              {picked !== null && !solved && <HintBlock show>{t(c.play_wrong[picked] || c.play_ok)}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{t(c.play_ok)}</p>
                </FeedbackBlock>
              )}
            </>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d5-acts fade-up">
            <button className="d5-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d5-btn d5-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenFact = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_fact} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <FactBody step={step}/>}/>
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
    exampleNode={<div className="d5-rule-ex"><DivRow list={CONTENT.s_core.common} best={12} label="24 · 36"/></div>}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenCommon = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_common} asideNode={methodAside}/>
);
const ScreenGcd = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_gcd} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

const StockRow = () => (
  <div className="d5-stock">
    {CONTENT.s_task.stock.map((s, i) => (
      <span key={s} className="d5-stockcard">
        <b>{s}</b>
        <i>{i === 0 ? '📓' : ''}</i>
      </span>
    ))}
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task} figureNode={() => <StockRow/>}/>
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
.d5-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.6vw, 12px); padding: clamp(12px, 2.4vw, 18px) !important; }

/* Ряды делителей */
.d5-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d5-label { min-width: 84px; font-size: clamp(12px, 2.2vw, 14px); color: #8A8883; text-align: right; }
.d5-chips { display: flex; flex-wrap: wrap; gap: 5px; }
.d5-chip { font-style: normal; display: grid; place-items: center; min-width: 30px; height: 30px; padding: 0 7px; border-radius: 9px; border: 1px solid #E9E3D9; background: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 16px); font-weight: 700; color: #494550; transition: all 380ms linear; }
.d5-chip-common { background: #E3F0E8; border-color: #1F7A4D; color: #1F7A4D; }
.d5-chip-best { background: #1F7A4D; border-color: #1F7A4D; color: #FFFFFF; box-shadow: 0 0 0 3px rgba(31, 122, 77, 0.18); }
.d5-legend { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.d5-key { font-size: clamp(12px, 2.2vw, 14px); padding: 4px 10px; border-radius: 999px; }
.d5-key-common { background: #E3F0E8; color: #1F7A4D; }
.d5-key-best { background: #1F7A4D; color: #FFFFFF; }

/* Простые множители */
.d5-fact { display: flex; align-items: center; gap: 6px; margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 21px); font-weight: 700; }
.d5-fact b { min-width: 42px; text-align: right; }
.d5-f { font-style: normal; padding: 3px 9px; border-radius: 8px; background: #F3EFE6; color: #8A8883; transition: all 380ms linear; }
.d5-f-on { background: #E3F0E8; color: #1F7A4D; }
.d5-product { margin: 4px 0 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 22px); color: #1F7A4D; }
.d5-product b { font-size: 1.15em; }

/* Двенадцать наборов */
.d5-sets { display: grid; grid-template-columns: repeat(6, 1fr); gap: clamp(4px, 1.2vw, 8px); width: min(100%, 360px); }
.d5-set { display: flex; align-items: flex-end; justify-content: center; gap: 2px; padding: 6px 4px; border-radius: 8px; border: 1px solid #E9E3D9; background: #FFFDF7; opacity: 0; animation: none; }
.d5-set-on { opacity: 1; animation: d5In 380ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@keyframes d5In { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: none; } }
.d5-pen { width: 3px; height: 14px; border-radius: 2px; background: #019ACB; }
.d5-note { width: 8px; height: 11px; border-radius: 2px; background: #F5C77E; }
.d5-lines { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.d5-line { margin: 0; font-size: clamp(14px, 2.4vw, 17px); color: #494550; opacity: 0; transition: opacity 380ms linear; }
.d5-line-on { opacity: 1; }

/* Экран 4 */
.d5-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(14px, 2.4vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 6px 13px; }
.d5-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d5-verdict { margin: 0; min-height: 22px; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d5-verdict-on { opacity: 1; }
.d5-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d5-btn { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d5-btn:disabled { opacity: 0.45; cursor: default; }
.d5-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d5-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Правило и задача */
.d5-rule-ex { display: flex; justify-content: center; }
.d5-stock { display: flex; justify-content: center; gap: 12px; }
.d5-stockcard { display: flex; flex-direction: column; align-items: center; min-width: 66px; padding: 8px 12px; border-radius: 12px; border: 1px solid #DCCFB6; background: #FFFDF7; }
.d5-stockcard b { font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 23px); }
.d5-stockcard i { font-style: normal; font-size: 12px; color: #8A8883; }

/* Движение сцены */
.d5-note { }
.d5-box-drop { animation: d5Drop 1200ms cubic-bezier(0.3, 1.3, 0.5, 1) both; }
@keyframes d5Drop { from { transform: translateY(-26px); opacity: 0; } to { transform: none; opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d5-box-drop, .d5-set-on { animation: none; opacity: 1; } }

@media (max-width: 639.98px) {
  .d5-label { min-width: 0; text-align: left; }
  .d5-sets { grid-template-columns: repeat(4, 1fr); }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function GcdLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenFact, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenCommon, ScreenGcd, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
