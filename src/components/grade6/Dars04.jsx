// ============================================================
// 6 КЛАСС, УРОК 4 «Простые и составные числа»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Сюжет блока: школа после уроков. Урок 1 — спортзал, 2 — буфет,
// 3 — ярмарка, 4 — школьная мастерская: из плиток выкладывают панно.
//
// ЯДРО УРОКА: из 12 плиток прямоугольник складывается несколькими способами,
// из 13 — только полоской. Дело не в чётности, а в числе делителей.
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
  lessonId: 'grade6-04',
  lessonTitle: {
    ru: 'Простые и составные числа',
    uz: 'Tub va murakkab sonlar',
    en: 'Prime and composite numbers',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 ustaxona: 12 va 13 plitka
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 12 ning bo'luvchilari
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 13 da faqat ikkita bo'luvchi
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: tartib bilan tekshirish
  { id: 's_sieve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 g'alvir: 2 dan 30 gacha
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 84
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: 1 soni
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_kind',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 tub yoki murakkab x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 10 savatlar: tub / murakkab
  { id: 's_factor', type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 11 ko'paytuvchilarga yoyish x3
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: panno
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: {
      ru: 'Мастерская: 12 плиток и 13',
      uz: 'Ustaxona: 12 plitka va 13',
      en: 'The workshop: 12 tiles and 13',
    },
    lead: {
      ru: 'Из 12 плиток панно сложилось прямоугольником. Из 13 — не выходит ничего, кроме полоски.',
      uz: "12 plitkadan pano to'rtburchak bo'lib chiqdi. 13 tadan esa uzun tasmadan boshqa hech narsa chiqmaydi.",
      en: 'Twelve tiles made a rectangle. Thirteen give nothing but a long strip.',
    },
    voice_a: {
      ru: 'Азиз: 13 нечётное, поэтому не выходит.',
      uz: "Aziz: 13 toq, shuning uchun chiqmaydi.",
      en: 'Aziz: 13 is odd, that is why.',
    },
    voice_b: {
      ru: 'Дилноза: дело в делителях.',
      uz: "Dilnoza: gap bo'luvchilarda.",
      en: 'Dilnoza: it is about the divisors.',
    },
    ask: { ru: 'Чей ответ верный?', uz: 'Kimning javobi to\'g\'ri?', en: 'Whose answer is right?' },
    options: [
      { ru: 'Прав Азиз', uz: 'Aziz haq', en: 'Aziz is right' },
      { ru: 'Права Дилноза', uz: 'Dilnoza haq', en: 'Dilnoza is right' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: "Variantlardan birini bosing. Javobni dars davomida tekshiramiz.",
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В школьной мастерской выкладывают панно. Из двенадцати плиток прямоугольник сложился, а из тринадцати выходит только длинная полоска.',
          'Азиз говорит, что дело в нечётности. Дилноза говорит, что дело в делителях. Как ты думаешь, чей ответ верный? Выбери. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab ustaxonasida pano terilmoqda. O'n ikki plitkadan to'rtburchak chiqdi, o'n uchtadan esa faqat uzun tasma chiqadi.",
          "Aziz toqlikda deb aytadi. Dilnoza bo'luvchilarda deydi. Sizningcha kimning javobi to'g'ri? Tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'In the school workshop they are laying a panel. Twelve tiles made a rectangle, thirteen give only a long strip.',
          'Aziz says it is about being odd. Dilnoza says it is about the divisors. What do you think, whose answer is right? Choose one. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Все прямоугольники из 12', uz: "12 tadan barcha to'rtburchaklar", en: 'Every rectangle from 12' },
    shapes: [[1, 12], [2, 6], [3, 4]],
    done: {
      ru: 'Каждый прямоугольник — это пара делителей: 1 и 12, 2 и 6, 3 и 4. Делителей у 12 шесть.',
      uz: "Har bir to'rtburchak — bu bo'luvchilar juftligi: 1 va 12, 2 va 6, 3 va 4. 12 ning bo'luvchilari oltita.",
      en: 'Each rectangle is a pair of divisors: 1 and 12, 2 and 6, 3 and 4. Twelve has six divisors.',
    },
    audio: {
      ru: [
        'Вернёмся к первому уроку. Двенадцать плиток можно выложить полоской один на двенадцать.',
        'Можно двумя рядами по шесть. Можно тремя по четыре. Больше вариантов нет.',
        'Каждый прямоугольник это пара делителей. Один и двенадцать, два и шесть, три и четыре. Всего делителей шесть.',
      ],
      uz: [
        "Birinchi darsga qaytamiz. O'n ikki plitkani bir kenglikda o'n ikkitadan tasma qilib terish mumkin.",
        "Ikki qatorda oltitadan ham bo'ladi. Uch qatorda to'rttadan ham. Boshqa variant yo'q.",
        "Har bir to'rtburchak bu bo'luvchilar juftligi. Bir va o'n ikki, ikki va olti, uch va to'rt. Bo'luvchilar jami oltita.",
      ],
      en: [
        'Back to the first lesson. Twelve tiles can be laid as a strip one by twelve.',
        'Or as two rows of six. Or three rows of four. There are no other options.',
        'Each rectangle is a pair of divisors: one and twelve, two and six, three and four. Six divisors in all.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'А теперь 13 плиток', uz: 'Endi 13 plitka', en: 'And now 13 tiles' },
    tries: [2, 3, 4, 5, 6],
    cap_only: { ru: 'Только 1 на 13', uz: 'Faqat 1 ga 13', en: 'Only 1 by 13' },
    done: {
      ru: 'У 13 всего два делителя: 1 и само число. Такие числа называют простыми. У 12 делителей шесть — это составное число.',
      uz: "13 da atigi ikkita bo'luvchi bor: 1 va sonning o'zi. Bunday sonlar tub sonlar deyiladi. 12 da esa oltita — bu murakkab son.",
      en: 'Thirteen has just two divisors: 1 and itself. Such numbers are called prime. Twelve has six divisors, so it is composite.',
    },
    audio: {
      ru: [
        'Пробуем разложить тринадцать плиток. Двумя рядами не выходит: одна лишняя. Тремя тоже, четырьмя тоже.',
        'Пятью и шестью тоже, везде остаётся лишняя плитка. Работает только полоска один на тринадцать.',
        'Значит у тринадцати всего два делителя: единица и само число. Такие числа называют простыми. А у двенадцати делителей шесть, и оно составное.',
      ],
      uz: [
        "O'n uch plitkani terib ko'ramiz. Ikki qatorda chiqmaydi: bittasi ortib qoladi. Uch qatorda ham, to'rt qatorda ham.",
        "Besh va olti ham, hamma joyda bitta plitka ortadi. Faqat bir ga o'n uch tasma ishlaydi.",
        "Demak o'n uchda atigi ikkita bo'luvchi bor: bir va sonning o'zi. Bunday sonlar tub sonlar deyiladi. O'n ikkida esa oltita, u murakkab son.",
      ],
      en: [
        'Let us try to lay thirteen tiles. Two rows do not work: one is left over. Three rows the same, four rows the same.',
        'Five and six as well, a tile is always left over. Only the strip one by thirteen works.',
        'So thirteen has just two divisors: one and itself. Such numbers are called prime. Twelve has six divisors and is composite.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Простое или составное', uz: 'Tub yoki murakkab', en: 'Prime or composite' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    yes: { ru: 'Простое', uz: 'Tub', en: 'Prime' },
    no: { ru: 'Составное', uz: 'Murakkab', en: 'Composite' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_checks: [2, 3, 5],
    demo_note: {
      ru: '29 не делится ни на 2, ни на 3, ни на 5. Дальше проверять не нужно: 6 · 6 = 36 больше 29. Значит 29 простое.',
      uz: "29 na 2 ga, na 3 ga, na 5 ga bo'linadi. Keyin tekshirish shart emas: 6 · 6 = 36, bu 29 dan katta. Demak 29 tub son.",
      en: '29 divides by neither 2, nor 3, nor 5. No need to go further: 6 · 6 = 36 is more than 29. So 29 is prime.',
    },
    play_ask: { ru: 'Число 51 — простое или составное?', uz: '51 soni — tub yoki murakkab?', en: 'Is 51 prime or composite?' },
    play_ok: {
      ru: 'Верно, составное. Сумма цифр 6 делится на 3, значит и 51 делится: 51 = 3 · 17.',
      uz: "To'g'ri, murakkab. Raqamlar yig'indisi 6 soni 3 ga bo'linadi, demak 51 ham bo'linadi: 51 = 3 · 17.",
      en: 'Right, composite. The digit sum 6 divides by 3, so 51 divides too: 51 = 3 · 17.',
    },
    play_wrong: {
      ru: 'Проверь тройку признаком из прошлого урока: 5 + 1 = 6, делится на 3. Значит у 51 есть делитель 3.',
      uz: "O'tgan darsning alomati bilan uchni tekshiring: 5 + 1 = 6, 3 ga bo'linadi. Demak 51 da 3 bo'luvchisi bor.",
      en: 'Check three with last lesson’s rule: 5 + 1 = 6 divides by 3. So 51 has a divisor 3.',
    },
    audio: {
      intro: {
        ru: 'Способ такой. Проверяем делители по порядку: два, три, пять, семь. Останавливаемся, когда делитель, умноженный сам на себя, перерос число. Покажу на двадцати девяти.',
        uz: "Usul shunday. Bo'luvchilarni tartib bilan tekshiramiz: ikki, uch, besh, yetti. Bo'luvchi o'ziga o'zi ko'paytirilganda sondan oshsa, to'xtaymiz. Yigirma to'qqiz sonida ko'rsataman.",
        en: 'The method is this. Check divisors in order: two, three, five, seven. Stop when the divisor times itself passes the number. I will show it on twenty nine.',
      },
      demo: {
        ru: 'Двадцать девять на два не делится, на три не делится, на пять не делится. Шесть на шесть тридцать шесть, это больше двадцати девяти, значит проверять дальше нечего. Двадцать девять простое.',
        uz: "Yigirma to'qqiz ikkiga bo'linmaydi, uchga bo'linmaydi, beshga bo'linmaydi. Olti karra olti o'ttiz olti, bu yigirma to'qqizdan katta, demak keyin tekshirish shart emas. Yigirma to'qqiz tub son.",
        en: 'Twenty nine does not divide by two, by three or by five. Six times six is thirty six, more than twenty nine, so there is nothing left to check. Twenty nine is prime.',
      },
      play: {
        ru: 'Теперь ваша очередь. Число пятьдесят один. Простое оно или составное?',
        uz: "Endi sizning navbatingiz. Ellik bir soni. U tub yoki murakkabmi?",
        en: 'Now it is your turn. The number fifty one. Is it prime or composite?',
      },
      ok: {
        ru: 'Верно, составное. Сумма цифр шесть делится на три, значит и пятьдесят один делится. Пятьдесят один это три умножить на семнадцать.',
        uz: "To'g'ri, murakkab. Raqamlar yig'indisi olti uchga bo'linadi, demak ellik bir ham bo'linadi. Ellik bir bu uch karra o'n yetti.",
        en: 'Right, composite. The digit sum six divides by three, so fifty one divides too. Fifty one is three times seventeen.',
      },
      wrong: {
        ru: 'Проверьте тройку. Пять плюс один шесть, шесть делится на три. Значит у пятидесяти одного есть делитель три.',
        uz: "Uchni tekshiring. Besh qo'shuv bir olti, olti uchga bo'linadi. Demak ellik birda uch bo'luvchisi bor.",
        en: 'Check three. Five plus one is six, and six divides by three. So fifty one has a divisor three.',
      },
    },
  },

  s_sieve: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Решето: кто останется', uz: "G'alvir: kim qoladi", en: 'The sieve: who is left' },
    done: {
      ru: 'Ушли кратные 2, 3 и 5. Остались 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 — простые числа до 30.',
      uz: "2, 3 va 5 ga karralilar ketdi. 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 qoldi — 30 gacha tub sonlar.",
      en: 'The multiples of 2, 3 and 5 are gone. What is left — 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 — are the primes under 30.',
    },
    audio: {
      ru: [
        'Возьмём все числа от двух до тридцати и просеем их. Сначала убираем кратные двум, кроме самой двойки.',
        'Теперь кратные трём, потом кратные пяти. Каждый раз уходит целый ряд чисел.',
        'Остались десять чисел. Это простые числа до тридцати, и их полезно помнить наизусть.',
      ],
      uz: [
        "Ikkidan o'ttizgacha barcha sonlarni olamiz va g'alvirdan o'tkazamiz. Avval ikkiga karralilarni olib tashlaymiz, ikkining o'zidan boshqa.",
        "Endi uchga karralilar, keyin beshga karralilar. Har safar butun bir qator son ketadi.",
        "O'nta son qoldi. Bular o'ttizgacha tub sonlar, ularni yod bilish foydali.",
      ],
      en: [
        'Take every number from two to thirty and sift them. First remove the multiples of two, except two itself.',
        'Now the multiples of three, then of five. Each pass takes away a whole row of numbers.',
        'Ten numbers are left. These are the primes under thirty, and they are worth knowing by heart.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Разложим 84 на простые', uz: "84 ni tub ko'paytuvchilarga yoyamiz", en: 'Factor 84 into primes' },
    lead: { ru: 'Делим на самое маленькое простое, пока не останется 1.', uz: "Eng kichik tub songa bo'lamiz, 1 qolguncha.", en: 'Divide by the smallest prime until 1 is left.' },
    rows: [
      { n: 84, d: 2, r: 42 },
      { n: 42, d: 2, r: 21 },
      { n: 21, d: 3, r: 7 },
      { n: 7, d: 7, r: 1 },
    ],
    result: { ru: '84 = 2 · 2 · 3 · 7', uz: '84 = 2 · 2 · 3 · 7', en: '84 = 2 · 2 · 3 · 7' },
    done: {
      ru: 'Любое составное число раскладывается на простые множители, и такой набор у числа единственный.',
      uz: "Har qanday murakkab son tub ko'paytuvchilarga yoyiladi va bu to'plam har bir son uchun yagona.",
      en: 'Every composite number breaks into prime factors, and that set is unique for the number.',
    },
    audio: {
      ru: [
        'Решаем вместе. Раскладываем восемьдесят четыре на простые множители. Делим на самое маленькое простое, на два.',
        'Восемьдесят четыре разделить на два сорок два. Сорок два разделить на два двадцать один.',
        'Двадцать один на два не делится, берём три. Получается семь. Семь простое, делим на семь и получаем один.',
        'Собираем множители: два, два, три и семь. Такой набор у восьмидесяти четырёх единственный.',
      ],
      uz: [
        "Birga yechamiz. Sakson to'rtni tub ko'paytuvchilarga yoyamiz. Eng kichik tub songa, ikkiga bo'lamiz.",
        "Sakson to'rtni ikkiga bo'lsak qirq ikki. Qirq ikkini ikkiga bo'lsak yigirma bir.",
        "Yigirma bir ikkiga bo'linmaydi, uchni olamiz. Yetti chiqadi. Yetti tub son, yettiga bo'lamiz va bir chiqadi.",
        "Ko'paytuvchilarni yig'amiz: ikki, ikki, uch va yetti. Sakson to'rt uchun bu to'plam yagona.",
      ],
      en: [
        'Let us solve it together. Factor eighty four into primes. Divide by the smallest prime, two.',
        'Eighty four divided by two is forty two. Forty two divided by two is twenty one.',
        'Twenty one does not divide by two, so take three. That gives seven. Seven is prime, divide by seven and get one.',
        'Collect the factors: two, two, three and seven. For eighty four this set is unique.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Особый случай', uz: 'Alohida holat', en: 'A special case' },
    title: { ru: 'Единица не в счёт', uz: 'Bir soni hisobga kirmaydi', en: 'One is neither' },
    done: {
      ru: 'У 1 всего один делитель — она сама. Значит 1 не простое и не составное: для простого нужно ровно два делителя.',
      uz: "1 sonining bitta bo'luvchisi bor — o'zi. Demak 1 na tub, na murakkab: tub son uchun aynan ikkita bo'luvchi kerak.",
      en: 'One has a single divisor — itself. So 1 is neither prime nor composite: a prime needs exactly two divisors.',
    },
    audio: {
      ru: [
        'Отдельный случай это единица. У двойки два делителя: один и два. У тринадцати тоже два.',
        'А у единицы делитель всего один, она сама. Двух делителей нет.',
        'Поэтому единицу не относят ни к простым, ни к составным. Это уговор математиков, и он удобен: иначе разложение на множители перестало бы быть единственным.',
      ],
      uz: [
        "Alohida holat bu bir soni. Ikkida ikkita bo'luvchi bor: bir va ikki. O'n uchda ham ikkita.",
        "Birda esa bo'luvchi bitta, o'zi. Ikkita bo'luvchi yo'q.",
        "Shuning uchun bir sonini na tub, na murakkab deb hisoblashadi. Bu matematiklarning kelishuvi va u qulay: aks holda ko'paytuvchilarga yoyish yagona bo'lmay qolardi.",
      ],
      en: [
        'A special case is the number one. Two has two divisors: one and two. Thirteen has two as well.',
        'One has a single divisor, itself. There are no two divisors.',
        'So one is counted as neither prime nor composite. That is a convention among mathematicians, and a handy one: otherwise factoring would stop being unique.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Два делителя или больше', uz: "Ikkita bo'luvchi yoki ko'proq", en: 'Two divisors or more' },
    rule_1: {
      ru: 'Простое число имеет ровно два делителя: 1 и само себя. Составное — больше двух. У числа 1 делитель один, поэтому оно не относится ни к тем, ни к другим.',
      uz: "Tub sonning aynan ikkita bo'luvchisi bor: 1 va o'zi. Murakkab sonda ikkitadan ko'p. 1 sonining bitta bo'luvchisi bor, shuning uchun u na unga, na bunga kiradi.",
      en: 'A prime has exactly two divisors: 1 and itself. A composite has more than two. The number 1 has one divisor, so it belongs to neither.',
    },
    rule_2: {
      ru: 'Панно из мастерской: у 12 делителей шесть, поэтому прямоугольников несколько. У 13 делителя два, поэтому только полоска. Права была Дилноза — дело в делителях, а не в чётности.',
      uz: "Ustaxonadagi pano: 12 da oltita bo'luvchi bor, shuning uchun to'rtburchak bir nechta. 13 da ikkita, shuning uchun faqat tasma. Dilnoza haq edi — gap toqlikda emas, bo'luvchilarda.",
      en: 'The panel from the workshop: 12 has six divisors, so several rectangles. 13 has two, so only a strip. Dilnoza was right — it is the divisors, not being odd.',
    },
    audio: {
      ru: 'Запомним правило. Простое число имеет ровно два делителя: единицу и само себя. Составное имеет больше двух. У единицы делитель всего один, поэтому она не простая и не составная. И вернёмся в мастерскую. У двенадцати шесть делителей, поэтому прямоугольников несколько. У тринадцати два, поэтому только полоска. Права была Дилноза, дело в делителях, а не в чётности.',
      uz: "Qoidani eslab qolamiz. Tub sonning aynan ikkita bo'luvchisi bor: bir va o'zi. Murakkab sonda ikkitadan ko'p. Birning bo'luvchisi bitta, shuning uchun u tub ham, murakkab ham emas. Va ustaxonaga qaytamiz. O'n ikkida oltita bo'luvchi bor, shuning uchun to'rtburchak bir nechta. O'n uchda ikkita, shuning uchun faqat tasma. Dilnoza haq edi, gap bo'luvchilarda, toqlikda emas.",
      en: 'Let us remember the rule. A prime has exactly two divisors: one and itself. A composite has more than two. One has a single divisor, so it is neither prime nor composite. And back to the workshop. Twelve has six divisors, so there are several rectangles. Thirteen has two, so only a strip. Dilnoza was right: it is the divisors, not being odd.',
    },
  },

  s_kind: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Простое или составное', uz: 'Tub yoki murakkab', en: 'Prime or composite' },
    lead: { ru: 'Ищи делитель по порядку: 2, 3, 5, 7.', uz: "Bo'luvchini tartib bilan qidiring: 2, 3, 5, 7.", en: 'Look for a divisor in order: 2, 3, 5, 7.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Число 17', uz: '17 soni', en: 'The number 17' },
        opts: [{ ru: 'Простое', uz: 'Tub', en: 'Prime' }, { ru: 'Составное', uz: 'Murakkab', en: 'Composite' }],
        correct: 0,
        ok: { ru: 'Верно. 17 не делится ни на 2, ни на 3: делителей только два.', uz: "To'g'ri. 17 na 2 ga, na 3 ga bo'linadi: bo'luvchilar atigi ikkita.", en: 'Right. 17 divides by neither 2 nor 3: only two divisors.' },
        wrong: [null, { ru: 'Проверь по порядку: на 2 нет, на 3 нет (1 + 7 = 8), на 5 нет. 4 · 4 = 16, дальше не надо.', uz: "Tartib bilan tekshiring: 2 ga yo'q, 3 ga yo'q (1 + 7 = 8), 5 ga yo'q. 4 · 4 = 16, keyin shart emas.", en: 'Check in order: not by 2, not by 3 (1 + 7 = 8), not by 5. 4 · 4 = 16, no need to go further.' }],
      },
      {
        q: { ru: 'Число 21', uz: '21 soni', en: 'The number 21' },
        opts: [{ ru: 'Простое', uz: 'Tub', en: 'Prime' }, { ru: 'Составное', uz: 'Murakkab', en: 'Composite' }],
        correct: 1,
        ok: { ru: 'Верно. 2 + 1 = 3, значит 21 делится на 3: 21 = 3 · 7.', uz: "To'g'ri. 2 + 1 = 3, demak 21 soni 3 ga bo'linadi: 21 = 3 · 7.", en: 'Right. 2 + 1 = 3, so 21 divides by 3: 21 = 3 · 7.' },
        wrong: [{ ru: 'Нечётное — ещё не простое. Сумма цифр 3, значит делится на 3.', uz: "Toq bo'lishi hali tub degani emas. Raqamlar yig'indisi 3, demak 3 ga bo'linadi.", en: 'Odd does not mean prime. The digit sum is 3, so it divides by 3.' }, null],
      },
      {
        q: { ru: 'Число 2', uz: '2 soni', en: 'The number 2' },
        opts: [{ ru: 'Простое', uz: 'Tub', en: 'Prime' }, { ru: 'Составное', uz: 'Murakkab', en: 'Composite' }],
        correct: 0,
        ok: { ru: 'Верно. У 2 делители 1 и 2 — ровно два. Это единственное чётное простое число.', uz: "To'g'ri. 2 ning bo'luvchilari 1 va 2 — aynan ikkita. Bu yagona juft tub son.", en: 'Right. Two has divisors 1 and 2 — exactly two. It is the only even prime.' },
        wrong: [null, { ru: 'Чётность тут ни при чём: у 2 всего два делителя, значит оно простое.', uz: "Juftlikning bunga aloqasi yo'q: 2 da atigi ikkita bo'luvchi bor, demak u tub.", en: 'Being even is irrelevant: two has just two divisors, so it is prime.' }],
      },
      {
        q: { ru: 'Число 49', uz: '49 soni', en: 'The number 49' },
        opts: [{ ru: 'Простое', uz: 'Tub', en: 'Prime' }, { ru: 'Составное', uz: 'Murakkab', en: 'Composite' }],
        correct: 1,
        ok: { ru: 'Верно. 49 = 7 · 7, делителей три: 1, 7 и 49.', uz: "To'g'ri. 49 = 7 · 7, bo'luvchilar uchta: 1, 7 va 49.", en: 'Right. 49 = 7 · 7, three divisors: 1, 7 and 49.' },
        wrong: [{ ru: 'На 2, 3 и 5 не делится, но семёрку проверить надо: 7 · 7 = 49.', uz: "2, 3 va 5 ga bo'linmaydi, lekin yettini tekshirish kerak: 7 · 7 = 49.", en: 'It does not divide by 2, 3 or 5, but seven must be checked: 7 · 7 = 49.' }, null],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Проверяйте делители по порядку и решайте, простое число или составное.',
        uz: "Mashq. Bo'luvchilarni tartib bilan tekshiring va son tub yoki murakkabligini ayting.",
        en: 'Practice. Check the divisors in order and decide whether the number is prime or composite.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Разложи по корзинам', uz: 'Savatlarga ajrating', en: 'Sort into baskets' },
    lead: { ru: 'Два делителя — простое. Больше двух — составное.', uz: "Ikkita bo'luvchi — tub. Ikkitadan ko'p — murakkab.", en: 'Two divisors: prime. More than two: composite.' },
    bin_a: { ru: 'Простые', uz: 'Tub', en: 'Prime' },
    bin_b: { ru: 'Составные', uz: 'Murakkab', en: 'Composite' },
    cards: [
      { label: '23', bin: 'a' },
      { label: '27', bin: 'b' },
      { label: '31', bin: 'a' },
      { label: '35', bin: 'b' },
      { label: '11', bin: 'a' },
      { label: '39', bin: 'b' },
    ],
    hint: {
      ru: 'Ищи делитель: 2, 3, 5, 7. Нашёлся — составное.',
      uz: "Bo'luvchi qidiring: 2, 3, 5, 7. Topildi — murakkab.",
      en: 'Look for a divisor: 2, 3, 5, 7. Found one means composite.',
    },
    correct_text: {
      ru: 'Верно. 27 = 3 · 9, 35 = 5 · 7, 39 = 3 · 13. А у 23, 31 и 11 делителей только два.',
      uz: "To'g'ri. 27 = 3 · 9, 35 = 5 · 7, 39 = 3 · 13. 23, 31 va 11 da esa bo'luvchi atigi ikkita.",
      en: 'Right. 27 = 3 · 9, 35 = 5 · 7, 39 = 3 · 13. And 23, 31 and 11 have only two divisors.',
    },
    audio: {
      intro: {
        ru: 'Разложите числа по двум корзинам. Ищите делитель по порядку.',
        uz: "Sonlarni ikki savatga ajrating. Bo'luvchini tartib bilan qidiring.",
        en: 'Sort the numbers into two baskets. Look for a divisor in order.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Поищи делитель ещё раз.', uz: "Bu yerga emas. Bo'luvchini yana qidiring.", en: 'Not here. Look for a divisor again.' },
    },
  },

  s_factor: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Разложение на простые', uz: "Tub ko'paytuvchilarga yoyish", en: 'Prime factorisation' },
    lead: { ru: 'Начинай с самого маленького простого делителя.', uz: "Eng kichik tub bo'luvchidan boshlang.", en: 'Start with the smallest prime divisor.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Как разложить 18 на простые множители?', uz: "18 ni tub ko'paytuvchilarga qanday yoyamiz?", en: 'How does 18 factor into primes?' },
        opts: ['2 · 9', '2 · 3 · 3', '18 · 1'],
        correct: 1,
        ok: { ru: 'Верно. 18 : 2 = 9, 9 : 3 = 3, 3 : 3 = 1. Все множители простые.', uz: "To'g'ri. 18 : 2 = 9, 9 : 3 = 3, 3 : 3 = 1. Barcha ko'paytuvchilar tub.", en: 'Right. 18 : 2 = 9, 9 : 3 = 3, 3 : 3 = 1. All the factors are prime.' },
        wrong: [
          { ru: 'Девятка не простая: 9 = 3 · 3. Раскладываем до конца.', uz: "To'qqiz tub emas: 9 = 3 · 3. Oxirigacha yoyamiz.", en: 'Nine is not prime: 9 = 3 · 3. Factor all the way.' },
          null,
          { ru: 'Единица не простое число, в разложение она не входит.', uz: "Bir tub son emas, u yoyilmaga kirmaydi.", en: 'One is not a prime and does not appear in the factorisation.' },
        ],
      },
      {
        q: { ru: 'Как разложить 45?', uz: '45 ni qanday yoyamiz?', en: 'How does 45 factor?' },
        opts: ['3 · 15', '5 · 9', '3 · 3 · 5'],
        correct: 2,
        ok: { ru: 'Верно. 45 : 3 = 15, 15 : 3 = 5, 5 : 5 = 1.', uz: "To'g'ri. 45 : 3 = 15, 15 : 3 = 5, 5 : 5 = 1.", en: 'Right. 45 : 3 = 15, 15 : 3 = 5, 5 : 5 = 1.' },
        wrong: [
          { ru: '15 не простое: 15 = 3 · 5.', uz: "15 tub emas: 15 = 3 · 5.", en: 'Fifteen is not prime: 15 = 3 · 5.' },
          { ru: '9 не простое: 9 = 3 · 3.', uz: "9 tub emas: 9 = 3 · 3.", en: 'Nine is not prime: 9 = 3 · 3.' },
          null,
        ],
      },
      {
        q: { ru: 'Сколько простых множителей у числа 8?', uz: "8 sonining nechta tub ko'paytuvchisi bor?", en: 'How many prime factors does 8 have?' },
        opts: ['1', '3', '4'],
        correct: 1,
        ok: { ru: 'Верно. 8 = 2 · 2 · 2 — три множителя, и все они двойки.', uz: "To'g'ri. 8 = 2 · 2 · 2 — uchta ko'paytuvchi, hammasi ikki.", en: 'Right. 8 = 2 · 2 · 2 — three factors, all of them twos.' },
        wrong: [
          { ru: 'Двойка одна, но входит три раза: 8 = 2 · 2 · 2.', uz: "Ikki bitta, lekin uch marta keladi: 8 = 2 · 2 · 2.", en: 'There is one two, but it appears three times: 8 = 2 · 2 · 2.' },
          null,
          { ru: 'Четырёх не выйдет: 2 · 2 · 2 · 2 = 16, а не 8.', uz: "To'rtta chiqmaydi: 2 · 2 · 2 · 2 = 16, 8 emas.", en: 'Four will not do: 2 · 2 · 2 · 2 = 16, not 8.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Раскладываем числа на простые множители. Начинайте с самого маленького.',
        uz: "Sonlarni tub ko'paytuvchilarga yoyamiz. Eng kichigidan boshlang.",
        en: 'Factor the numbers into primes. Start with the smallest one.',
      },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «Все нечётные числа простые». Проверь.', uz: "Aziz: «Barcha toq sonlar tub». Tekshiring.", en: 'Aziz: “All odd numbers are prime.” Check it.' },
        opts: [
          { ru: 'Неверно: 9 нечётное, но составное', uz: "Noto'g'ri: 9 toq, lekin murakkab", en: 'Wrong: 9 is odd but composite' },
          { ru: 'Верно', uz: "To'g'ri", en: 'Correct' },
          { ru: 'Неверно: 2 чётное и составное', uz: "Noto'g'ri: 2 juft va murakkab", en: 'Wrong: 2 is even and composite' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 9 = 3 · 3, ещё 15, 21, 25, 27 — все нечётные и составные.', uz: "To'g'ri. 9 = 3 · 3, yana 15, 21, 25, 27 — hammasi toq va murakkab.", en: 'Right. 9 = 3 · 3, and 15, 21, 25, 27 are odd and composite too.' },
        wrong: [
          null,
          { ru: 'Не верно: 9, 15, 21 — нечётные, но у каждого больше двух делителей.', uz: "To'g'ri emas: 9, 15, 21 — toq, lekin har birida ikkitadan ko'p bo'luvchi bor.", en: 'Not correct: 9, 15, 21 are odd, yet each has more than two divisors.' },
          { ru: '2 как раз простое: у него делители 1 и 2.', uz: "2 aynan tub: uning bo'luvchilari 1 va 2.", en: 'Two is in fact prime: its divisors are 1 and 2.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «1 — простое число, ведь оно делится на 1 и на себя». Где ошибка?', uz: "Dilnoza: «1 tub son, chunki u 1 ga va o'ziga bo'linadi». Xato qayerda?", en: 'Dilnoza: “1 is prime, it divides by 1 and by itself.” Where is the mistake?' },
        opts: [
          { ru: 'У 1 это один и тот же делитель', uz: "1 da bu bitta va o'sha bo'luvchi", en: 'For 1 that is one and the same divisor' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: '1 составное', uz: '1 murakkab', en: '1 is composite' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Делитель у единицы один, а простому нужно ровно два разных.', uz: "To'g'ri. Birning bo'luvchisi bitta, tub songa esa aynan ikkita har xil kerak.", en: 'Right. One has a single divisor, and a prime needs exactly two different ones.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: 1 и «само себя» для единицы — это одно и то же число.', uz: "Xato bor: bir uchun 1 va «o'zi» bir xil son.", en: 'There is a mistake: for one, “1” and “itself” are the same number.' },
          { ru: 'Составным 1 тоже не считают: для этого нужно больше двух делителей.', uz: "1 murakkab ham hisoblanmaydi: buning uchun ikkitadan ko'p bo'luvchi kerak.", en: 'One is not composite either: that would need more than two divisors.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое рассуждение. Ошибка бывает и в выводе, и в самом определении.',
        uz: "Birovning fikrini tekshiring. Xato xulosada ham, ta'rifning o'zida ham bo'lishi mumkin.",
        en: 'Check someone else’s reasoning. A mistake can be in the conclusion and in the definition itself.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Панно из плиток', uz: 'Plitkalardan pano', en: 'A panel of tiles' },
    lead: { ru: 'В мастерской пять наборов плиток. Панно должно быть прямоугольным, но не полоской.', uz: "Ustaxonada beshta plitka to'plami bor. Pano to'rtburchak bo'lishi kerak, tasma emas.", en: 'The workshop has five sets of tiles. The panel must be a rectangle, not a strip.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    sets: ['14', '17', '20', '23', '36'],
    items: [
      {
        q: { ru: 'Из каких наборов панно не выйдет?', uz: "Qaysi to'plamlardan pano chiqmaydi?", en: 'Which sets will not make a panel?' },
        opts: [
          { ru: '17 и 23', uz: '17 va 23', en: '17 and 23' },
          { ru: '14 и 20', uz: '14 va 20', en: '14 and 20' },
          { ru: 'Только 36', uz: 'Faqat 36', en: 'Only 36' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 17 и 23 простые: кроме полоски, ничего не сложить.', uz: "To'g'ri. 17 va 23 tub: tasmadan boshqa hech narsa chiqmaydi.", en: 'Right. 17 and 23 are prime: nothing but a strip.' },
        wrong: [
          null,
          { ru: '14 = 2 · 7 и 20 = 4 · 5 — прямоугольники есть.', uz: "14 = 2 · 7 va 20 = 4 · 5 — to'rtburchaklar bor.", en: '14 = 2 · 7 and 20 = 4 · 5, so rectangles exist.' },
          { ru: 'У 36 делителей много: 6 · 6, 4 · 9, 3 · 12. Панно выйдет.', uz: "36 da bo'luvchi ko'p: 6 · 6, 4 · 9, 3 · 12. Pano chiqadi.", en: '36 has many divisors: 6 · 6, 4 · 9, 3 · 12. The panel works.' },
        ],
      },
      {
        q: { ru: 'Из какого набора выйдет квадратное панно?', uz: "Qaysi to'plamdan kvadrat pano chiqadi?", en: 'Which set gives a square panel?' },
        opts: ['20', '36', '14'],
        correct: 1,
        ok: { ru: 'Верно. 36 = 6 · 6 — шесть рядов по шесть.', uz: "To'g'ri. 36 = 6 · 6 — olti qatorda oltitadan.", en: 'Right. 36 = 6 · 6 — six rows of six.' },
        wrong: [
          { ru: '20 квадратом не выложить: 4 · 5, но не n · n.', uz: "20 ni kvadrat qilib bo'lmaydi: 4 · 5, lekin n · n emas.", en: 'Twenty makes no square: 4 · 5, but not n · n.' },
          null,
          { ru: '14 = 2 · 7, квадрата нет.', uz: "14 = 2 · 7, kvadrat yo'q.", en: '14 = 2 · 7, no square.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача из мастерской. Пять наборов плиток. Смотрите, у каких чисел есть делители кроме единицы и самого числа.',
        uz: "Ustaxonadan masala. Beshta plitka to'plami. Qaysi sonlarda birdan va sonning o'zidan boshqa bo'luvchi borligiga qarang.",
        en: 'A problem from the workshop. Five sets of tiles. Look at which numbers have divisors besides one and themselves.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 4,
        q: { ru: 'Сколько простых чисел между 10 и 20? Набери ответ.', uz: "10 va 20 orasida nechta tub son bor? Javobni tering.", en: 'How many primes are there between 10 and 20? Type the answer.' },
        hint: { ru: 'Проверь 11, 13, 17, 19 — и остальные числа этого промежутка.', uz: "11, 13, 17, 19 ni va bu oraliqdagi qolgan sonlarni tekshiring.", en: 'Check 11, 13, 17, 19 and the rest of the range.' },
        hint_audio: { ru: 'Проверьте одиннадцать, тринадцать, семнадцать и девятнадцать, а потом остальные числа промежутка.', uz: "O'n bir, o'n uch, o'n yetti va o'n to'qqizni, keyin oraliqdagi qolgan sonlarni tekshiring.", en: 'Check eleven, thirteen, seventeen and nineteen, then the rest of the range.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Какое число простое?', uz: 'Qaysi son tub?', en: 'Which number is prime?' },
        opts: ['33', '39', '41', '45'],
        wrong: [
          { ru: '33 = 3 · 11.', uz: '33 = 3 · 11.', en: '33 = 3 · 11.' },
          { ru: '39 = 3 · 13.', uz: '39 = 3 · 13.', en: '39 = 3 · 13.' },
          null,
          { ru: '45 = 5 · 9.', uz: '45 = 5 · 9.', en: '45 = 5 · 9.' },
        ],
        correct: { ru: 'Верно. 41 не делится ни на 2, ни на 3, ни на 5: делителей два.', uz: "To'g'ri. 41 na 2 ga, na 3 ga, na 5 ga bo'linadi: bo'luvchi ikkita.", en: 'Right. 41 divides by neither 2, 3 nor 5: two divisors.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Сколько делителей у простого числа?', uz: 'Tub sonning nechta bo\'luvchisi bor?', en: 'How many divisors does a prime have?' },
        opts: [
          { ru: 'Один', uz: 'Bitta', en: 'One' },
          { ru: 'Ровно два', uz: 'Aynan ikkita', en: 'Exactly two' },
          { ru: 'Больше двух', uz: "Ikkitadan ko'p", en: 'More than two' },
          { ru: 'Зависит от числа', uz: 'Songa bog\'liq', en: 'It depends' },
        ],
        wrong: [
          { ru: 'Один делитель только у единицы, и она не простая.', uz: "Bitta bo'luvchi faqat birda, u esa tub emas.", en: 'Only one has a single divisor, and it is not prime.' },
          null,
          { ru: 'Больше двух — это уже составное число.', uz: "Ikkitadan ko'p — bu murakkab son.", en: 'More than two means composite.' },
          { ru: 'Не зависит: у любого простого ровно два делителя.', uz: "Bog'liq emas: har qanday tub sonda aynan ikkita bo'luvchi bor.", en: 'It does not depend: every prime has exactly two.' },
        ],
        correct: { ru: 'Верно. Единица и само число — ровно два делителя.', uz: "To'g'ri. Bir va sonning o'zi — aynan ikkita bo'luvchi.", en: 'Right. One and the number itself — exactly two divisors.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Как разложить 60 на простые множители?', uz: "60 ni tub ko'paytuvchilarga qanday yoyamiz?", en: 'How does 60 factor into primes?' },
        opts: ['2 · 2 · 3 · 5', '2 · 30', '6 · 10', '4 · 15'],
        wrong: [
          null,
          { ru: '30 не простое: 30 = 2 · 3 · 5.', uz: "30 tub emas: 30 = 2 · 3 · 5.", en: 'Thirty is not prime: 30 = 2 · 3 · 5.' },
          { ru: 'Ни 6, ни 10 не простые.', uz: "Na 6, na 10 tub.", en: 'Neither 6 nor 10 is prime.' },
          { ru: '4 и 15 составные: 4 = 2 · 2, 15 = 3 · 5.', uz: "4 va 15 murakkab: 4 = 2 · 2, 15 = 3 · 5.", en: 'Four and fifteen are composite: 4 = 2 · 2, 15 = 3 · 5.' },
        ],
        correct: { ru: 'Верно. 60 : 2 = 30, 30 : 2 = 15, 15 : 3 = 5, 5 : 5 = 1.', uz: "To'g'ri. 60 : 2 = 30, 30 : 2 = 15, 15 : 3 = 5, 5 : 5 = 1.", en: 'Right. 60 : 2 = 30, 30 : 2 = 15, 15 : 3 = 5, 5 : 5 = 1.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Что верно про число 1?', uz: '1 soni haqida nima to\'g\'ri?', en: 'What is true about the number 1?' },
        opts: [
          { ru: 'Оно простое', uz: 'U tub', en: 'It is prime' },
          { ru: 'Оно составное', uz: 'U murakkab', en: 'It is composite' },
          { ru: 'У него два делителя', uz: "Unda ikkita bo'luvchi bor", en: 'It has two divisors' },
          { ru: 'Оно не простое и не составное', uz: 'U na tub, na murakkab', en: 'It is neither prime nor composite' },
        ],
        wrong: [
          { ru: 'Для простого нужно два РАЗНЫХ делителя, а у 1 он один.', uz: "Tub son uchun ikkita HAR XIL bo'luvchi kerak, 1 da esa bitta.", en: 'A prime needs two DIFFERENT divisors, and 1 has one.' },
          { ru: 'Составному нужно больше двух делителей.', uz: "Murakkab songa ikkitadan ko'p bo'luvchi kerak.", en: 'A composite needs more than two divisors.' },
          { ru: 'У 1 делитель один — она сама.', uz: "1 da bo'luvchi bitta — o'zi.", en: 'One has a single divisor: itself.' },
          null,
        ],
        correct: { ru: 'Верно. У единицы один делитель, поэтому её не относят ни к тем, ни к другим.', uz: "To'g'ri. Birning bitta bo'luvchisi bor, shuning uchun u na unga, na bunga kiradi.", en: 'Right. One has a single divisor, so it belongs to neither group.' },
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
      ru: 'Простых чисел бесконечно много — это доказал Евклид больше двух тысяч лет назад. А самое большое известное простое число сегодня имеет больше 41 миллиона цифр.',
      uz: "Tub sonlar cheksiz ko'p — buni Evklid ikki ming yildan ko'proq avval isbotlagan. Bugungi eng katta ma'lum tub sonda esa 41 milliondan ortiq raqam bor.",
      en: 'There are infinitely many primes — Euclid proved it more than two thousand years ago. The largest known prime today has over 41 million digits.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Простых чисел бесконечно много, это доказал Евклид больше двух тысяч лет назад. А самое большое известное простое число сегодня имеет больше сорока одного миллиона цифр.',
      uz: "Bilasizmi? Tub sonlar cheksiz ko'p, buni Evklid ikki ming yildan ko'proq avval isbotlagan. Bugungi eng katta ma'lum tub sonda qirq bir milliondan ortiq raqam bor.",
      en: 'Did you know? There are infinitely many primes: Euclid proved it more than two thousand years ago. The largest known prime today has over forty one million digits.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Делимость', uz: "Matematika · Bo'linish", en: 'Mathematics · Divisibility' },
    heading: { ru: 'Простые и составные', uz: 'Tub va murakkab', en: 'Prime and composite' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'простое → ровно два делителя', uz: "tub → aynan ikkita bo'luvchi", en: 'prime → exactly two divisors' },
    brief_2: { ru: 'составное → больше двух', uz: "murakkab → ikkitadan ko'p", en: 'composite → more than two' },
    brief_3: { ru: '1 → не простое и не составное', uz: '1 → na tub, na murakkab', en: '1 → neither' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Как проверять', uz: 'Qanday tekshirish kerak', en: 'How to check' },
    memo_a1: { ru: 'делители по порядку: 2, 3, 5, 7', uz: "bo'luvchilar tartib bilan: 2, 3, 5, 7", en: 'divisors in order: 2, 3, 5, 7' },
    memo_q2: { ru: 'Где остановиться', uz: "Qayerda to'xtash kerak", en: 'Where to stop' },
    memo_a2: { ru: 'когда делитель · делитель больше числа', uz: "bo'luvchi · bo'luvchi sondan oshganda", en: 'when divisor · divisor passes the number' },
    memo_q3: { ru: 'Нечётное', uz: 'Toq son', en: 'An odd number' },
    memo_a3: { ru: 'ещё не значит простое: 9, 15, 21', uz: 'hali tub degani emas: 9, 15, 21', en: 'is not automatically prime: 9, 15, 21' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'У простого числа ровно два делителя: единица и оно само. У составного больше двух. Единица не относится ни к тем, ни к другим.',
        'Панно в мастерской сложилось: из двенадцати вышли прямоугольники, а из тринадцати только полоска. Права была Дилноза, дело в делителях.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Tub sonda aynan ikkita bo'luvchi bor: bir va o'zi. Murakkab sonda ikkitadan ko'p. Bir soni na unga, na bunga kiradi.",
        "Ustaxonadagi pano yig'ildi: o'n ikkitadan to'rtburchaklar chiqdi, o'n uchtadan esa faqat tasma. Dilnoza haq edi, gap bo'luvchilarda.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'A prime has exactly two divisors: one and itself. A composite has more than two. One belongs to neither group.',
        'The panel in the workshop came together: twelve gave rectangles, thirteen only a strip. Dilnoza was right, it is about the divisors.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Проверить по порядку', uz: 'Usul. Tartib bilan tekshirish', en: 'Method. Check in order' },
    m1_steps: {
      ru: ['Пробуй делители 2, 3, 5, 7 подряд', 'Нашёлся делитель — число составное', 'Дошёл до делителя, у которого делитель · делитель больше числа, — простое'],
      uz: ["2, 3, 5, 7 bo'luvchilarni ketma-ket sinang", "Bo'luvchi topilsa — son murakkab", "Bo'luvchi · bo'luvchi sondan oshsa — tub"],
      en: ['Try the divisors 2, 3, 5, 7 in a row', 'A divisor found means composite', 'If divisor · divisor passes the number, it is prime'],
    },
    m1_no: {
      ru: 'Признаки прошлых уроков помогают: последняя цифра для 2 и 5, сумма цифр для 3.',
      uz: "O'tgan darslarning alomatlari yordam beradi: 2 va 5 uchun oxirgi raqam, 3 uchun raqamlar yig'indisi.",
      en: 'The earlier rules help: the last digit for 2 and 5, the digit sum for 3.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьная мастерская. На хуке вопрос, в итоге ответ.
// У людей есть лицо, место обжитое: верстак, инструменты, ящик с плитками.
// ============================================================
const TILE_TONES = ['#7ECBE6', '#F5C77E', '#8FD6B4', '#9FD3EA'];


// Прямоугольник из плиток прямо в SVG: панно на стене мастерской.
const TilePanel = ({ x, y, cols, rows, cell = 9, gap = 2, tone = 0 }) => (
  <g>
    {Array.from({ length: cols * rows }).map((_, i) => (
      <rect key={i}
        x={x + (i % cols) * (cell + gap)}
        y={y + Math.floor(i / cols) * (cell + gap)}
        width={cell} height={cell} rx="2"
        fill={TILE_TONES[(tone + i) % TILE_TONES.length]} opacity="0.95"/>
    ))}
  </g>
);

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d4wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE7D8"/>
      </linearGradient>
      <linearGradient id="d4bench" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D9B98C"/><stop offset="100%" stopColor="#C29A64"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d4wall)"/>

    {/* Стена мастерской: полка с инструментами */}
    <g>
      <rect x="14" y="30" width="96" height="4" rx="2" fill="#D9CDB5"/>
      {/* молоток */}
      <rect x="22" y="14" width="4" height="16" rx="1.5" fill="#8A6A45"/>
      <rect x="16" y="10" width="16" height="6" rx="2" fill="#7C8894"/>
      {/* линейка */}
      <rect x="44" y="12" width="6" height="18" rx="1.5" fill="#F5C77E"/>
      {[15, 19, 23, 27].map((ty) => <rect key={ty} x="44" y={ty} width="6" height="1" fill="#C99B3A"/>)}
      {/* кисть */}
      <rect x="66" y="14" width="4" height="12" rx="1.5" fill="#8A6A45"/>
      <rect x="63" y="24" width="10" height="6" rx="2" fill="#8FD6B4"/>
      {/* уровень */}
      <rect x="86" y="18" width="20" height="7" rx="2" fill="#7ECBE6"/>
      <circle cx="96" cy="21.5" r="1.6" fill="#1F7A4D"/>
    </g>

    {/* ПАННО ИЗ 12: прямоугольник 4 на 3 — собралось */}
    <g>
      <rect x="128" y="24" width="60" height="48" rx="5" fill="#FFFDF7" stroke="#DCCFB6"/>
      <TilePanel x={134} y={30} cols={4} rows={3}/>
      <text x="158" y="84" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">12</text>
    </g>

    {/* ПАННО ИЗ 13: прямоугольник не собрался, одна плитка осталась лишней
        и вздрагивает — её некуда положить. */}
    <g>
      <rect x="206" y="24" width="88" height="48" rx="5" fill="#FFFDF7" stroke="#DCCFB6"/>
      <TilePanel x={212} y={30} cols={6} rows={2} tone={1}/>
      <rect className="d4-extra" x="212" y="52" width="9" height="9" rx="2" fill="#FF4F28"/>
      <text x="250" y="84" textAnchor="middle" fill="#FF4F28"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">13</text>
    </g>

    {/* Люди у верстака */}
    <Person x={54} ground={122} head={10} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={330} ground={122} head={10} shirt="#F5C77E" hair="#5A4636"/>

    {/* ВЕРСТАК */}
    <rect x="0" y="122" width="400" height="8" fill="#B08A57"/>
    <rect x="0" y="130" width="400" height="24" fill="url(#d4bench)"/>

    {/* ящик с плитками на верстаке */}
    <g>
      <rect x="150" y="104" width="72" height="18" rx="3" fill="#FFFDF7" stroke="#DCCFB6"/>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={154 + (i % 6) * 11} y={108 + Math.floor(i / 6) * 7} width="9" height="5" rx="1.5"
          fill={TILE_TONES[i % TILE_TONES.length]}/>
      ))}
    </g>
    <rect className="d4-tile-drop" x="240" y="112" width="11" height="10" rx="2" fill="#8FD6B4"/>
  </svg>
);

// Итог: 12 сложилось прямоугольником, 13 осталось полоской — ответ хука.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>

    <g>
      <rect x="22" y="10" width="58" height="48" rx="5" fill="#FFFDF7" stroke="#DCCFB6"/>
      <TilePanel x={28} y={16} cols={4} rows={3}/>
      <text x="51" y="70" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">12 = 3 · 4</text>
    </g>
    <g>
      <rect x="126" y="10" width="176" height="30" rx="5" fill="#FFFDF7" stroke="#DCCFB6"/>
      <TilePanel x={132} y={16} cols={13} rows={1} cell={11} gap={2} tone={1}/>
      <text x="214" y="54" textAnchor="middle" fill="#FF4F28"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">13 = 1 · 13</text>
    </g>

    <rect x="0" y="66" width="400" height="26" fill="#C29A64"/>
    <rect x="0" y="64" width="400" height="4" fill="#B08A57"/>
    <Person x={340} ground={66} head={7} shirt="#7ECBE6" hair="#3E3128" arms={false}/>
    <Person x={366} ground={66} head={7} shirt="#F5C77E" hair="#5A4636" arms={false}/>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================

// Плитки в вёрстке: прямоугольник cols × rows и «лишние» отдельно.
const TileGrid = ({ cols, rows, extra = 0, tone = 0 }) => (
  <div className="d4-grid-wrap">
    <div className="d4-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <span key={i} className="d4-tile" style={{ background: TILE_TONES[(tone + i) % TILE_TONES.length], animationDelay: `${Math.min(i, 40) * 20}ms` }}/>
      ))}
    </div>
    {extra > 0 && (
      <div className="d4-extra-zone">
        {Array.from({ length: extra }).map((_, i) => <span key={i} className="d4-tile d4-tile-extra"/>)}
      </div>
    )}
  </div>
);

// Экран 2 — все прямоугольники из 12.
const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  const shown = Math.min(step + 1, c.shapes.length);
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d4-stage">
        <div className="d4-shapes">
          {c.shapes.slice(0, shown).map(([r, cl]) => (
            <div key={`${r}x${cl}`} className="d4-shape">
              <TileGrid cols={cl} rows={r}/>
              <span className="mono d4-cap">{r} · {cl}</span>
            </div>
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

// Экран 3 — 13 плиток: в любой раскладке одна лишняя.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  const tries = c.tries;
  const i = Math.min(step, tries.length - 1);
  const per = tries[i];
  const rows = Math.floor(13 / per);
  const extra = 13 - rows * per;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d4-stage">
        {step < 2 ? (
          <>
            <TileGrid cols={per} rows={rows} extra={extra} tone={1}/>
            <p className="mono d4-cap">13 : {per} → {extra}</p>
          </>
        ) : (
          <>
            <TileGrid cols={13} rows={1} tone={1}/>
            <p className="mono d4-cap d4-cap-ok">{t(c.cap_only)}</p>
          </>
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

// Экран 5 — решето до 30.
const SIEVE = Array.from({ length: 29 }, (_, i) => i + 2);
const SieveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_sieve;
  const killers = [2, 3, 5].slice(0, step);
  const dead = (n) => killers.some((k) => n !== k && n % k === 0);
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d4-stage">
        <div className="d4-sieve">
          {SIEVE.map((n) => (
            <span key={n} className={'d4-cellnum' + (dead(n) ? ' d4-cellnum-off' : (step >= 3 ? ' d4-cellnum-on' : ''))}>{n}</span>
          ))}
        </div>
      </div>
      {step >= 3 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Экран 6 — разложение 84 столбиком.
const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  const shown = Math.min(step + 1, c.rows.length);
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d4-stage">
        <div className="d4-col">
          {c.rows.slice(0, shown).map((r) => (
            <p key={r.n} className="d4-colrow">
              <span className="d4-coln">{r.n}</span>
              <span className="d4-cold">{r.d}</span>
            </p>
          ))}
          <p className="d4-colrow d4-colrow-end"><span className="d4-coln">1</span><span className="d4-cold"/></p>
        </div>
        {step >= 3 && <p className="d4-result">{t(c.result)}</p>}
      </div>
      {step >= 3 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Экран 7 — единица: делитель всего один.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  const cards = [
    { n: 2, divs: ['1', '2'], kind: 'ok' },
    { n: 13, divs: ['1', '13'], kind: 'ok' },
    { n: 1, divs: ['1'], kind: 'no' },
  ];
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d4-stage">
        <div className="d4-cards">
          {cards.slice(0, step === 0 ? 2 : 3).map((cd) => (
            <div key={cd.n} className={'d4-card d4-card-' + cd.kind}>
              <b>{cd.n}</b>
              <span className="d4-divs">{cd.divs.map((d) => <i key={d}>{d}</i>)}</span>
              <span className="d4-count">{cd.divs.length}</span>
            </div>
          ))}
        </div>
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
  const [shown, setShown] = useState(0);            // сколько проверок показано
  const [picked, setPicked] = useState(null);
  const firstTryRef = useRef(true);
  const timersRef = useRef([]);
  const solved = picked === false;                   // верный ответ на 51 — «составное»
  const done = shown >= c.demo_checks.length;

  const say = (node, id) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(pickL(node, lang), undefined, id);
  };

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (phase !== 'demo' || done) return undefined;
    timersRef.current.push(setTimeout(() => setShown((v) => v + 1), 1100));
    if (shown === c.demo_checks.length - 1) {
      timersRef.current.push(setTimeout(() => say(c.audio.demo, 's_tool_demo'), 1300));
    }
    return () => timersRef.current.forEach(clearTimeout);
    /* eslint-disable-next-line */
  }, [phase, shown, done]);

  const toPlay = () => { setPhase('play'); setPicked(null); say(c.audio.play, 's_tool_play'); };

  const answer = (isPrime) => {
    if (solved) return;
    setPicked(isPrime);
    if (isPrime) { firstTryRef.current = false; say(c.audio.wrong, 's_tool_wrong'); return; }
    say(c.audio.ok, 's_tool_ok');
    if (onAnswer) {
      onAnswer({
        stage: null, screenIdx: screen, question: pickL(c.play_ask, lang),
        correctAnswer: pickL(c.no, lang), studentAnswer: pickL(c.no, lang),
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
        <div className={'d4-banner fade-up delay-1' + (phase === 'play' ? ' d4-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d4-stage">
          {phase === 'demo' ? (
            <>
              <p className="d4-big">29</p>
              <div className="d4-checks">
                {c.demo_checks.map((d, i) => (
                  <span key={d} className={'d4-check' + (i < shown ? ' d4-check-on' : '')}>
                    : {d} <i>{i < shown ? '✗' : ''}</i>
                  </span>
                ))}
              </div>
              <p className={'body d4-verdict' + (done ? ' d4-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="d4-big">51</p>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{t(c.play_ask)}</p>
              <div className="sv-opts">
                <button className={'option' + (picked === true ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(true)}>{t(c.yes)}</button>
                <button className={'option' + (solved ? ' option-correct' : '')}
                  disabled={solved} onClick={() => answer(false)}>{t(c.no)}</button>
              </div>
              {picked === true && !solved && <HintBlock show>{t(c.play_wrong)}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{t(c.play_ok)}</p>
                </FeedbackBlock>
              )}
            </>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d4-acts fade-up">
            <button className="d4-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d4-btn d4-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
          </div>
        )}

        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no} active={phase === 'play' ? 2 : (done ? 1 : 0)}/>
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
const ScreenSieve = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_sieve} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <SieveBody step={step}/>}/>
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
    exampleNode={<div className="d4-rule-ex"><TileGrid cols={4} rows={3}/><TileGrid cols={13} rows={1} tone={1}/></div>}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenKind = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_kind} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenFactor = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_factor} asideNode={methodAside}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

const SetsRow = () => (
  <div className="d4-sets">
    {CONTENT.s_task.sets.map((s) => (
      <span key={s} className="d4-set"><b>{s}</b></span>
    ))}
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task} figureNode={() => <SetsRow/>}/>
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
.d4-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.6vw, 12px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d4-cap { margin: 0; color: #8A8883; font-size: clamp(13px, 2.2vw, 15px); }
.d4-cap-ok { color: #1F7A4D; font-weight: 700; }

/* Плитки */
.d4-grid-wrap { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d4-grid { display: grid; gap: 3px; }
.d4-tile { width: clamp(11px, 2.4vw, 16px); height: clamp(11px, 2.4vw, 16px); border-radius: 3px; background: #7ECBE6; animation: d4In 360ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@keyframes d4In { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
.d4-extra-zone { display: flex; gap: 3px; padding: 5px 7px; border-radius: 8px; background: #FFE8E1; border: 1px solid #FF4F28; }
.d4-tile-extra { background: #FF4F28; }
.d4-shapes { display: flex; flex-direction: column; gap: clamp(7px, 1.6vw, 11px); align-items: center; }
.d4-shape { display: flex; align-items: center; gap: 12px; }

/* Решето */
.d4-sieve { display: grid; grid-template-columns: repeat(10, 1fr); gap: clamp(3px, 0.9vw, 6px); width: min(100%, 380px); }
.d4-cellnum { display: grid; place-items: center; aspect-ratio: 1; border-radius: 7px; background: #FFFFFF; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 2.2vw, 15px); font-weight: 700; color: #0E0E10; transition: all 380ms linear; }
.d4-cellnum-off { background: #F3EFE6; border-color: transparent; color: #C9C7C2; }
.d4-cellnum-on { background: #E3F0E8; border-color: #1F7A4D; color: #1F7A4D; }

/* Разложение столбиком */
.d4-col { display: flex; flex-direction: column; gap: 2px; }
.d4-colrow { display: flex; margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 22px); font-weight: 700; }
.d4-coln { min-width: 64px; text-align: right; padding-right: 10px; border-right: 2px solid #E9E3D9; }
.d4-cold { min-width: 44px; padding-left: 10px; color: #FF4F28; }
.d4-colrow-end .d4-coln { color: #1F7A4D; }
.d4-result { margin: 6px 0 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 21px); font-weight: 700; color: #1F7A4D; }

/* Карточки делителей */
.d4-cards { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(8px, 2vw, 14px); }
.d4-card { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 96px; padding: 11px 13px; border-radius: 14px; border: 1px solid #E9E3D9; background: #FFFFFF; }
.d4-card b { font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 4.4vw, 28px); }
.d4-divs { display: flex; gap: 5px; }
.d4-divs i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 13px; padding: 2px 7px; border-radius: 999px; background: #F3EFE6; color: #494550; }
.d4-count { font-size: 12px; color: #8A8883; }
.d4-card-ok { border-color: #1F7A4D; }
.d4-card-ok .d4-count { color: #1F7A4D; }
.d4-card-no { border-color: #FF4F28; background: #FFF7F4; }
.d4-card-no .d4-count { color: #FF4F28; }

/* Экран 4 */
.d4-big { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(34px, 7vw, 46px); font-weight: 700; }
.d4-checks { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.d4-check { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 10px; background: #F3EFE6; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 17px); font-weight: 700; color: #C9C7C2; transition: all 380ms linear; }
.d4-check-on { background: #FFE8E1; color: #FF4F28; }
.d4-check i { font-style: normal; }
.d4-verdict { margin: 0; min-height: 24px; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d4-verdict-on { opacity: 1; }
.d4-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(14px, 2.4vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 6px 13px; }
.d4-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d4-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d4-btn { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d4-btn:disabled { opacity: 0.45; cursor: default; }
.d4-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d4-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Правило и задача */
.d4-rule-ex { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
.d4-sets { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(7px, 1.6vw, 11px); }
.d4-set { min-width: 54px; padding: 8px 11px; border-radius: 10px; border: 1px solid #DCCFB6; background: #FFFDF7; text-align: center; }
.d4-set b { font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 22px); }

/* Движение сцены: лишняя плитка вздрагивает, новая плитка ложится в ящик */
.d4-extra { animation: d4Shake 3600ms ease-in-out infinite; transform-origin: center; }
@keyframes d4Shake { 0%, 82%, 100% { transform: none; } 88% { transform: translateX(-2px) rotate(-6deg); } 94% { transform: translateX(2px) rotate(6deg); } }
.d4-tile-drop { animation: d4Drop 1200ms cubic-bezier(0.3, 1.3, 0.5, 1) both; }
@keyframes d4Drop { from { transform: translateY(-30px); opacity: 0; } to { transform: none; opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d4-extra, .d4-tile-drop, .d4-tile { animation: none; } }

@media (max-width: 639.98px) {
  .d4-sieve { grid-template-columns: repeat(6, 1fr); }
  .d4-shape { flex-direction: column; gap: 4px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function PrimesLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenSieve, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenKind, ScreenBins, ScreenFactor, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
