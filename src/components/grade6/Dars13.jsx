// ============================================================
// 6 КЛАСС, УРОК 13 «Взаимно обратные числа. Нахождение числа по его части»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок 12 научил делить на дробь. Здесь это превращается в инструмент:
// зная часть, находим целое. Пара взаимно обратных чисел объясняет, почему
// деление и умножение отменяют друг друга.
//
// Сцена — дорога в школу, размеченная на пять участков.
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
  lessonId: 'grade6-13',
  lessonTitle: {
    ru: 'Взаимно обратные числа. Число по его части',
    uz: "O'zaro teskari sonlar. Qismiga ko'ra sonni topish",
    en: 'Reciprocals. Finding a number from its part',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 yo'l: 2/5 qismi 600 metr
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 kasrga bo'lish esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 o'zaro teskari sonlar: ko'paytma 1
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: qismga ko'ra butunni topish
  { id: 's_two',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 ikki masala: ko'paytirish yoki bo'lish
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 21 bet = 7/9
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: nolning teskarisi yo'q
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_rec',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 teskari sonni toping x3
  { id: 's_whole',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 butunni toping x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: ko'paytma 1 mi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: maktabgacha yo'l
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Дорога в школу', uz: 'Maktabgacha yo\'l', en: 'The way to school' },
    lead: {
      ru: 'Азиз прошёл 2/5 дороги до школы. Это ровно 600 метров.',
      uz: "Aziz maktabgacha yo'lning 2/5 qismini bosib o'tdi. Bu roppa-rosa 600 metr.",
      en: 'Aziz has walked 2/5 of the way to school. That is exactly 600 metres.',
    },
    voice_a: { ru: 'Азиз: вся дорога короче километра.', uz: "Aziz: butun yo'l bir kilometrdan qisqa.", en: 'Aziz: the whole way is under a kilometre.' },
    voice_b: { ru: 'Дилноза: нет, длиннее.', uz: "Dilnoza: yo'q, uzunroq.", en: 'Dilnoza: no, it is longer.' },
    ask: { ru: 'Какая вся дорога?', uz: "Butun yo'l qanday?", en: 'How long is the whole way?' },
    options: [
      { ru: 'Короче километра', uz: 'Bir kilometrdan qisqa', en: 'Less than a kilometre' },
      { ru: 'Длиннее километра', uz: 'Bir kilometrdan uzun', en: 'More than a kilometre' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Азиз идёт в школу. Он прошёл две пятых дороги, и это ровно шестьсот метров.',
          'Азиз думает, что вся дорога короче километра, а Дилноза что длиннее. Какая вся дорога? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Aziz maktabga ketyapti. U yo'lning ikki beshdan qismini bosib o'tdi, bu roppa-rosa olti yuz metr.",
          "Aziz butun yo'l bir kilometrdan qisqa deb o'ylaydi, Dilnoza esa uzunroq deydi. Butun yo'l qanday? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'Aziz is walking to school. He has covered two fifths of the way, exactly six hundred metres.',
          'Aziz thinks the whole way is under a kilometre, Dilnoza says it is longer. How long is the whole way? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Делим на дробь', uz: "Kasrga bo'lamiz", en: 'Dividing by a fraction' },
    lines: [
      { ru: '6 : 2/3 = 6 · 3/2 = 9', uz: '6 : 2/3 = 6 · 3/2 = 9', en: '6 ÷ 2/3 = 6 · 3/2 = 9' },
    ],
    done: {
      ru: 'Делитель переворачивали, и деление превращалось в умножение. Сегодня посмотрим, почему это работает.',
      uz: "Bo'luvchini ag'dardik va bo'lish ko'paytirishga aylandi. Bugun bu nega ishlashini ko'ramiz.",
      en: 'We flipped the divisor and division turned into multiplication. Today we see why that works.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Шесть разделить на две третьих.',
        'Переворачиваем делитель и умножаем: шесть на три вторых. Получается девять.',
        'Сегодня разберёмся, что за пара чисел получается при перевороте и зачем она нужна.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Oltini ikki uchdanga bo'lamiz.",
        "Bo'luvchini ag'darib ko'paytiramiz: olti karra uch ikkidan. To'qqiz chiqadi.",
        "Bugun ag'darganda qanday sonlar juftligi hosil bo'lishini va u nimaga kerakligini ko'ramiz.",
      ],
      en: [
        'Let us recall the last lesson. Six divided by two thirds.',
        'Flip the divisor and multiply: six times three halves. That gives nine.',
        'Today we look at the pair of numbers that appears when flipping and why it matters.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Произведение равно 1', uz: "Ko'paytma 1 ga teng", en: 'The product equals 1' },
    pairs: [
      { a: { n: 2, d: 5 }, b: { n: 5, d: 2 } },
      { a: { n: 3, d: 4 }, b: { n: 4, d: 3 } },
      { a: { n: 7, d: 1 }, b: { n: 1, d: 7 } },
    ],
    done: {
      ru: 'Такие числа называют взаимно обратными: их произведение равно 1. У нуля обратного числа нет.',
      uz: "Bunday sonlar o'zaro teskari deyiladi: ularning ko'paytmasi 1 ga teng. Nolning teskarisi yo'q.",
      en: 'Such numbers are called reciprocals: their product is 1. Zero has no reciprocal.',
    },
    audio: {
      ru: [
        'Возьмём дробь две пятых и перевернём её. Получилось пять вторых. Перемножим их.',
        'Два умножить на пять и пять умножить на два дают одно и то же: десять десятых, то есть единицу.',
        'Так работает любая пара. Три четвёртых и четыре третьих, семь и одна седьмая. Такие числа называют взаимно обратными, а их произведение всегда равно единице.',
      ],
      uz: [
        "Ikki beshdan kasrini olib ag'daramiz. Besh ikkidan chiqdi. Ularni ko'paytiramiz.",
        "Ikki karra besh va besh karra ikki bir xil natija beradi: o'n o'ndan, ya'ni bir.",
        "Har qanday juftlik shunday ishlaydi. Uch to'rtdan va to'rt uchdan, yetti va bir yettidan. Bunday sonlar o'zaro teskari deyiladi, ko'paytmasi esa doim birga teng.",
      ],
      en: [
        'Take the fraction two fifths and flip it. That gives five halves. Multiply them.',
        'Two times five and five times two give the same thing: ten tenths, that is one.',
        'Every pair works this way. Three quarters and four thirds, seven and one seventh. Such numbers are called reciprocals and their product is always one.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Целое по его части', uz: "Qismiga ko'ra butunni topish", en: 'The whole from its part' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '2/5 дороги = 600 м', uz: "yo'lning 2/5 qismi = 600 m", en: '2/5 of the way = 600 m' },
      { ru: '600 : 2/5 = 600 · 5/2', uz: '600 : 2/5 = 600 · 5/2', en: '600 ÷ 2/5 = 600 · 5/2' },
      { ru: '= 1500 м', uz: '= 1500 m', en: '= 1500 m' },
    ],
    demo_note: {
      ru: 'Вся дорога 1500 метров, это полтора километра. Один участок из пяти равен 300 метрам.',
      uz: "Butun yo'l 1500 metr, bu bir yarim kilometr. Beshdan bitta bo'lak 300 metrga teng.",
      en: 'The whole way is 1500 metres, one and a half kilometres. One of the five parts is 300 metres.',
    },
    play_ask: { ru: '12 конфет — это 3/4 коробки. Сколько конфет во всей коробке?', uz: "12 ta konfet bu quti'ning 3/4 qismi. Butun qutida nechta konfet bor?", en: '12 sweets are 3/4 of a box. How many are in the whole box?' },
    play_opts: ['9', '16', '48'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. 12 : 3/4 = 12 · 4/3 = 16.',
      uz: "To'g'ri. 12 : 3/4 = 12 · 4/3 = 16.",
      en: 'Right. 12 ÷ 3/4 = 12 · 4/3 = 16.',
    },
    play_wrong: [
      { ru: 'Это 3/4 от 12: часть от числа, а нам нужно целое.', uz: "Bu 12 ning 3/4 qismi: sonning qismi, bizga esa butun kerak.", en: 'That is 3/4 of 12: a part of a number, but we need the whole.' },
      null,
      { ru: 'Умножили на 4, но забыли разделить на 3.', uz: "4 ga ko'paytirdingiz, lekin 3 ga bo'lishni unutdingiz.", en: 'You multiplied by 4 but forgot to divide by 3.' },
    ],
    audio: {
      intro: {
        ru: 'Теперь главный приём урока. Если известна часть и её доля, целое находят делением на эту долю. Покажу на дороге Азиза.',
        uz: "Endi darsning asosiy usuli. Qism va uning ulushi ma'lum bo'lsa, butun shu ulushga bo'lish orqali topiladi. Azizning yo'lida ko'rsataman.",
        en: 'Now the main move of the lesson. If a part and its fraction are known, the whole is found by dividing by that fraction. I will show it on Aziz’s route.',
      },
      demo: {
        ru: 'Шестьсот метров это две пятых дороги. Делим шестьсот на две пятых, то есть умножаем на пять вторых. Получается тысяча пятьсот метров.',
        uz: "Olti yuz metr bu yo'lning ikki beshdan qismi. Olti yuzni ikki beshdanga bo'lamiz, ya'ni besh ikkidanga ko'paytiramiz. Ming besh yuz metr chiqadi.",
        en: 'Six hundred metres is two fifths of the way. Divide six hundred by two fifths, that is multiply by five halves. The result is one thousand five hundred metres.',
      },
      play: {
        ru: 'Теперь ваша очередь. Двенадцать конфет это три четвёртых коробки. Сколько конфет во всей коробке?',
        uz: "Endi sizning navbatingiz. O'n ikki konfet bu qutining uch to'rtdan qismi. Butun qutida nechta konfet bor?",
        en: 'Now it is your turn. Twelve sweets are three quarters of a box. How many are in the whole box?',
      },
      ok: {
        ru: 'Верно. Двенадцать разделить на три четвёртых это шестнадцать.',
        uz: "To'g'ri. O'n ikkini uch to'rtdanga bo'lsak, o'n olti chiqadi.",
        en: 'Right. Twelve divided by three quarters is sixteen.',
      },
      wrong: {
        ru: 'Известна часть, а нужно целое. Значит делим на дробь, а не умножаем.',
        uz: "Qism ma'lum, butun kerak. Demak kasrga bo'lamiz, ko'paytirmaymiz.",
        en: 'The part is known and the whole is needed. So divide by the fraction, do not multiply.',
      },
    },
  },

  s_two: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Две похожие задачи', uz: "Ikkita o'xshash masala", en: 'Two similar problems' },
    left_q: { ru: 'Известно целое: 20 страниц. Найти 3/4', uz: "Butun ma'lum: 20 bet. 3/4 qismini topish", en: 'The whole is known: 20 pages. Find 3/4' },
    left_a: { ru: '20 · 3/4 = 15', uz: '20 · 3/4 = 15', en: '20 · 3/4 = 15' },
    right_q: { ru: 'Известна часть: 15 страниц это 3/4. Найти целое', uz: "Qism ma'lum: 15 bet bu 3/4. Butunni topish", en: 'The part is known: 15 pages are 3/4. Find the whole' },
    right_a: { ru: '15 : 3/4 = 20', uz: '15 : 3/4 = 20', en: '15 ÷ 3/4 = 20' },
    done: {
      ru: 'Слова похожи, действия обратные. Известно целое — умножаем, известна часть — делим.',
      uz: "So'zlar o'xshash, amallar teskari. Butun ma'lum bo'lsa ko'paytiramiz, qism ma'lum bo'lsa bo'lamiz.",
      en: 'The wording is similar, the actions are opposite. Whole known: multiply. Part known: divide.',
    },
    audio: {
      ru: [
        'Две задачи звучат почти одинаково, а решаются по-разному. Слева известно целое: двадцать страниц, найти три четвёртых.',
        'Здесь умножаем и получаем пятнадцать страниц.',
        'Справа наоборот: пятнадцать страниц это три четвёртых, найти всю книгу. Здесь делим и получаем двадцать. Смотрите, что дано: целое или часть.',
      ],
      uz: [
        "Ikki masala deyarli bir xil eshitiladi, lekin har xil yechiladi. Chapda butun ma'lum: yigirma bet, uning uch to'rtdan qismini topish kerak.",
        "Bu yerda ko'paytiramiz va o'n besh bet chiqadi.",
        "O'ngda aksincha: o'n besh bet bu uch to'rtdan, butun kitobni topish kerak. Bu yerda bo'lamiz va yigirma chiqadi. Nima berilganiga qarang: butunmi yoki qismmi.",
      ],
      en: [
        'Two problems sound almost the same but are solved differently. On the left the whole is known: twenty pages, find three quarters.',
        'Here we multiply and get fifteen pages.',
        'On the right it is the other way: fifteen pages are three quarters, find the whole book. Here we divide and get twenty. Look at what is given: the whole or the part.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: '21 страница — это 7/9 книги', uz: "21 bet bu kitobning 7/9 qismi", en: '21 pages are 7/9 of a book' },
    lead: { ru: 'Известна часть, значит делим на дробь.', uz: "Qism ma'lum, demak kasrga bo'lamiz.", en: 'The part is known, so divide by the fraction.' },
    steps: [
      { ru: '21 : 7/9 = 21 · 9/7', uz: '21 : 7/9 = 21 · 9/7', en: '21 ÷ 7/9 = 21 · 9/7' },
      { ru: '21 и 7 сокращаются на 7', uz: '21 va 7 soni 7 ga qisqaradi', en: '21 and 7 reduce by 7' },
      { ru: '3 · 9 = 27 страниц', uz: '3 · 9 = 27 bet', en: '3 · 9 = 27 pages' },
    ],
    done: {
      ru: 'В книге 27 страниц. Проверка: 27 · 7/9 = 21. Сходится.',
      uz: "Kitobda 27 bet bor. Tekshiruv: 27 · 7/9 = 21. To'g'ri keldi.",
      en: 'The book has 27 pages. Check: 27 · 7/9 = 21. It matches.',
    },
    audio: {
      ru: [
        'Решаем вместе. Двадцать одна страница это семь девятых книги. Делим на семь девятых, то есть умножаем на девять седьмых.',
        'Двадцать один и семь сокращаются на семь, остаётся тройка.',
        'Три умножить на девять двадцать семь. В книге двадцать семь страниц. Проверим обратным действием: двадцать семь умножить на семь девятых это двадцать одна. Сходится.',
      ],
      uz: [
        "Birga yechamiz. Yigirma bir bet bu kitobning yetti to'qqizdan qismi. Yetti to'qqizdanga bo'lamiz, ya'ni to'qqiz yettidanga ko'paytiramiz.",
        "Yigirma bir va yetti yettiga qisqaradi, uch qoladi.",
        "Uch karra to'qqiz yigirma yetti. Kitobda yigirma yetti bet bor. Teskari amal bilan tekshiramiz: yigirma yetti karra yetti to'qqizdan bu yigirma bir. To'g'ri keldi.",
      ],
      en: [
        'Let us solve it together. Twenty one pages are seven ninths of a book. Divide by seven ninths, that is multiply by nine sevenths.',
        'Twenty one and seven reduce by seven, leaving three.',
        'Three times nine is twenty seven. The book has twenty seven pages. Check with the inverse: twenty seven times seven ninths is twenty one. It matches.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Умножить вместо деления', uz: "Bo'lish o'rniga ko'paytirish", en: 'Multiplying instead of dividing' },
    bad_line: { ru: '600 · 2/5 = 240 м', uz: '600 · 2/5 = 240 m', en: '600 · 2/5 = 240 m' },
    good_line: { ru: '600 : 2/5 = 1500 м', uz: '600 : 2/5 = 1500 m', en: '600 ÷ 2/5 = 1500 m' },
    zero_line: { ru: 'у нуля обратного числа нет: 0 · любое = 0', uz: "nolning teskarisi yo'q: 0 · har qanday son = 0", en: 'zero has no reciprocal: 0 times anything is 0' },
    done: {
      ru: 'Целое не может быть меньше своей части. 240 меньше 600, значит действие выбрано неверно. Такая прикидка ловит ошибку сразу.',
      uz: "Butun o'z qismidan kichik bo'la olmaydi. 240 soni 600 dan kichik, demak amal noto'g'ri tanlangan. Bunday chamalash xatoni darrov ushlaydi.",
      en: 'A whole cannot be smaller than its part. 240 is less than 600, so the wrong operation was chosen. This quick check catches it at once.',
    },
    audio: {
      ru: [
        'Самая частая ошибка в таких задачах: вместо деления умножают. Шестьсот умножить на две пятых это двести сорок.',
        'Но целое не может быть меньше своей части. Двести сорок меньше шестисот, значит ответ точно неверный.',
        'Правильно разделить: получается тысяча пятьсот. И ещё одно: у нуля обратного числа нет, потому что ноль, умноженный на что угодно, остаётся нулём.',
      ],
      uz: [
        "Bunday masalalardagi eng ko'p uchraydigan xato: bo'lish o'rniga ko'paytirish. Olti yuz karra ikki beshdan bu ikki yuz qirq.",
        "Lekin butun o'z qismidan kichik bo'la olmaydi. Ikki yuz qirq olti yuzdan kichik, demak javob aniq noto'g'ri.",
        "To'g'risi bo'lish: ming besh yuz chiqadi. Yana bir narsa: nolning teskari soni yo'q, chunki nol har qanday songa ko'paytirilsa ham nol bo'lib qoladi.",
      ],
      en: [
        'The most common mistake here: multiplying instead of dividing. Six hundred times two fifths is two hundred forty.',
        'But a whole cannot be smaller than its part. Two hundred forty is less than six hundred, so the answer is certainly wrong.',
        'Dividing is right and gives one thousand five hundred. One more thing: zero has no reciprocal, because zero times anything stays zero.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Обратные числа и целое по части', uz: "Teskari sonlar va qismga ko'ra butun", en: 'Reciprocals and the whole from a part' },
    rule_1: {
      ru: 'Два числа взаимно обратны, если их произведение равно 1. Чтобы найти обратное дроби, её переворачивают. У нуля обратного числа нет.',
      uz: "Ikki son o'zaro teskari bo'ladi, agar ko'paytmasi 1 ga teng bo'lsa. Kasrning teskarisini topish uchun uni ag'daradilar. Nolning teskarisi yo'q.",
      en: 'Two numbers are reciprocals if their product is 1. To find the reciprocal of a fraction you flip it. Zero has no reciprocal.',
    },
    rule_2: {
      ru: 'Известно целое — умножаем на дробь. Известна часть — делим на дробь. Дорога: 600 : 2/5 = 1500 метров, права была Дилноза.',
      uz: "Butun ma'lum bo'lsa kasrga ko'paytiramiz. Qism ma'lum bo'lsa kasrga bo'lamiz. Yo'l: 600 : 2/5 = 1500 metr, Dilnoza haq edi.",
      en: 'Whole known: multiply by the fraction. Part known: divide by it. The route: 600 ÷ 2/5 = 1500 metres, Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Два числа взаимно обратны, если их произведение равно единице, а обратное к дроби получают переворотом. У нуля обратного нет. Если известно целое, часть находят умножением. Если известна часть, целое находят делением. Вернёмся к дороге. Шестьсот разделить на две пятых это тысяча пятьсот метров, то есть полтора километра. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Ikki son o'zaro teskari bo'ladi, agar ko'paytmasi birga teng bo'lsa, kasrning teskarisi esa ag'darish bilan olinadi. Nolning teskarisi yo'q. Butun ma'lum bo'lsa, qism ko'paytirish bilan topiladi. Qism ma'lum bo'lsa, butun bo'lish bilan topiladi. Yo'lga qaytamiz. Olti yuzni ikki beshdanga bo'lsak, ming besh yuz metr, ya'ni bir yarim kilometr chiqadi. Dilnoza haq edi.",
      en: 'Let us remember the rule. Two numbers are reciprocals if their product is one, and a fraction’s reciprocal comes from flipping it. Zero has none. If the whole is known, the part comes from multiplying. If the part is known, the whole comes from dividing. Back to the route. Six hundred divided by two fifths is one thousand five hundred metres, one and a half kilometres. Dilnoza was right.',
    },
  },

  s_rec: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди обратное число', uz: 'Teskari sonni toping', en: 'Find the reciprocal' },
    lead: { ru: 'Проверь себя умножением: должно получиться 1.', uz: "O'zingizni ko'paytirib tekshiring: 1 chiqishi kerak.", en: 'Check by multiplying: the product must be 1.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Обратное к 3/8', uz: '3/8 ning teskarisi', en: 'The reciprocal of 3/8' },
        opts: ['8/3', '3/8', '1/8'],
        correct: 0,
        ok: { ru: 'Верно. 3/8 · 8/3 = 24/24 = 1.', uz: "To'g'ri. 3/8 · 8/3 = 24/24 = 1.", en: 'Right. 3/8 · 8/3 = 24/24 = 1.' },
        wrong: [
          null,
          { ru: 'Это та же дробь: её произведение с собой не равно 1.', uz: "Bu o'sha kasr: o'ziga ko'paytmasi 1 ga teng emas.", en: 'That is the same fraction: its square is not 1.' },
          { ru: 'Числитель тоже участвует: переворачивают всю дробь.', uz: "Surat ham qatnashadi: butun kasr ag'dariladi.", en: 'The numerator matters too: the whole fraction is flipped.' },
        ],
      },
      {
        q: { ru: 'Обратное к 5', uz: '5 ning teskarisi', en: 'The reciprocal of 5' },
        opts: ['5/1', '1/5', '0'],
        correct: 1,
        ok: { ru: 'Верно. 5 = 5/1, переворот даёт 1/5, и 5 · 1/5 = 1.', uz: "To'g'ri. 5 = 5/1, ag'darsak 1/5 chiqadi, 5 · 1/5 = 1.", en: 'Right. 5 = 5/1, flipping gives 1/5, and 5 · 1/5 = 1.' },
        wrong: [
          { ru: 'Это само число 5, а не обратное.', uz: "Bu 5 sonining o'zi, teskarisi emas.", en: 'That is the number 5 itself, not its reciprocal.' },
          null,
          { ru: 'Ноль обратным быть не может: 5 · 0 = 0.', uz: "Nol teskari bo'la olmaydi: 5 · 0 = 0.", en: 'Zero cannot be a reciprocal: 5 · 0 = 0.' },
        ],
      },
      {
        q: { ru: 'У какого числа нет обратного?', uz: 'Qaysi sonning teskarisi yo\'q?', en: 'Which number has no reciprocal?' },
        opts: ['1', '0', '1/2'],
        correct: 1,
        ok: { ru: 'Верно. Ноль, умноженный на любое число, остаётся нулём.', uz: "To'g'ri. Nol har qanday songa ko'paytirilsa ham nol bo'lib qoladi.", en: 'Right. Zero times any number stays zero.' },
        wrong: [
          { ru: 'У единицы обратное есть: это она сама.', uz: "Birning teskarisi bor: bu o'zi.", en: 'One does have a reciprocal: itself.' },
          null,
          { ru: 'У 1/2 обратное это 2.', uz: '1/2 ning teskarisi 2.', en: 'The reciprocal of 1/2 is 2.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на обратные числа. Проверяйте себя умножением: должна получаться единица.',
        uz: "Teskari sonlar mashqi. O'zingizni ko'paytirib tekshiring: bir chiqishi kerak.",
        en: 'Reciprocal practice. Check yourself by multiplying: the answer must be one.',
      },
    },
  },

  s_whole: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди целое', uz: 'Butunni toping', en: 'Find the whole' },
    lead: { ru: 'Целое всегда больше своей части — так проверяют ответ.', uz: "Butun doim o'z qismidan katta — javob shunday tekshiriladi.", en: 'The whole is always larger than its part: that is how you check.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '8 — это 2/3 числа. Какое число?', uz: '8 bu sonning 2/3 qismi. Bu qaysi son?', en: '8 is 2/3 of a number. Which number?' },
        opts: ['12', '16/3', '24'],
        correct: 0,
        ok: { ru: 'Верно. 8 : 2/3 = 8 · 3/2 = 12.', uz: "To'g'ri. 8 : 2/3 = 8 · 3/2 = 12.", en: 'Right. 8 ÷ 2/3 = 8 · 3/2 = 12.' },
        wrong: [
          null,
          { ru: 'Здесь умножили на 2/3, а надо разделить.', uz: "Bu yerda 2/3 ga ko'paytirilgan, kerak bo'lgani bo'lish.", en: 'That multiplied by 2/3, but division is needed.' },
          { ru: 'Слишком много: 2/3 от 24 это 16, а не 8.', uz: "Juda ko'p: 24 ning 2/3 qismi 16, 8 emas.", en: 'Too much: 2/3 of 24 is 16, not 8.' },
        ],
      },
      {
        q: { ru: '15 конфет — это 5/6 пачки. Сколько в пачке?', uz: "15 konfet bu paketning 5/6 qismi. Paketda nechta bor?", en: '15 sweets are 5/6 of a pack. How many in the pack?' },
        opts: ['18', '12', '25'],
        correct: 0,
        ok: { ru: 'Верно. 15 : 5/6 = 15 · 6/5 = 18.', uz: "To'g'ri. 15 : 5/6 = 15 · 6/5 = 18.", en: 'Right. 15 ÷ 5/6 = 15 · 6/5 = 18.' },
        wrong: [
          null,
          { ru: 'Целое не может быть меньше части: 12 меньше 15.', uz: "Butun qismdan kichik bo'lolmaydi: 12 soni 15 dan kichik.", en: 'A whole cannot be smaller than its part: 12 is less than 15.' },
          { ru: '25 вышло бы при делении на 3/5.', uz: "25 soni 3/5 ga bo'lganda chiqardi.", en: '25 would come from dividing by 3/5.' },
        ],
      },
      {
        q: { ru: '30 метров — это 3/4 верёвки. Какая длина верёвки?', uz: "30 metr bu arqonning 3/4 qismi. Arqon uzunligi qancha?", en: '30 metres are 3/4 of a rope. How long is the rope?' },
        opts: ['22,5', '40', '90'],
        correct: 1,
        ok: { ru: 'Верно. 30 : 3/4 = 30 · 4/3 = 40.', uz: "To'g'ri. 30 : 3/4 = 30 · 4/3 = 40.", en: 'Right. 30 ÷ 3/4 = 30 · 4/3 = 40.' },
        wrong: [
          { ru: 'Это 3/4 от 30, то есть часть, а не целое.', uz: "Bu 30 ning 3/4 qismi, ya'ni qism, butun emas.", en: 'That is 3/4 of 30, a part rather than the whole.' },
          null,
          { ru: 'Умножили на 3, но забыли разделить на 4.', uz: "3 ga ko'paytirdingiz, lekin 4 ga bo'lishni unutdingiz.", en: 'You multiplied by 3 but forgot to divide by 4.' },
        ],
      },
      {
        q: { ru: 'Что делают, если известна часть, а нужно целое?', uz: "Qism ma'lum, butun kerak bo'lsa nima qilinadi?", en: 'What do you do when the part is known and the whole is needed?' },
        opts: [
          { ru: 'Делят на дробь', uz: "Kasrga bo'ladilar", en: 'Divide by the fraction' },
          { ru: 'Умножают на дробь', uz: "Kasrga ko'paytiradilar", en: 'Multiply by the fraction' },
          { ru: 'Складывают', uz: "Qo'shadilar", en: 'Add them' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Деление на дробь меньше 1 увеличивает число — как раз то, что нужно.', uz: "To'g'ri. 1 dan kichik kasrga bo'lish sonni kattalashtiradi — aynan kerakli narsa.", en: 'Right. Dividing by a fraction below 1 increases the number, exactly what we need.' },
        wrong: [
          null,
          { ru: 'Умножают, когда известно целое.', uz: "Butun ma'lum bo'lganda ko'paytiriladi.", en: 'Multiplying is for when the whole is known.' },
          { ru: 'Складывать здесь нечего: доли разные.', uz: "Bu yerda qo'shishga narsa yo'q: ulushlar har xil.", en: 'There is nothing to add here.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Ищем целое по части. Ответ должен получиться больше данной части.',
        uz: "Qismga ko'ra butunni qidiramiz. Javob berilgan qismdan katta chiqishi kerak.",
        en: 'Find the whole from a part. The answer must be larger than the given part.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Произведение равно 1 или нет', uz: "Ko'paytma 1 ga tengmi yoki yo'q", en: 'Does the product equal 1' },
    lead: { ru: 'Взаимно обратные числа дают в произведении ровно 1.', uz: "O'zaro teskari sonlar ko'paytmada roppa-rosa 1 beradi.", en: 'Reciprocals multiply to exactly 1.' },
    bin_a: { ru: 'Произведение 1', uz: "Ko'paytma 1", en: 'Product is 1' },
    bin_b: { ru: 'Не равно 1', uz: '1 ga teng emas', en: 'Not 1' },
    cards: [
      { label: '2/3 · 3/2', bin: 'a' },
      { label: '4/5 · 5/4', bin: 'a' },
      { label: '3 · 1/3', bin: 'a' },
      { label: '2/5 · 5/3', bin: 'b' },
      { label: '1/2 · 2/3', bin: 'b' },
      { label: '7 · 1/8', bin: 'b' },
    ],
    hint: {
      ru: 'Числитель первой дроби должен совпасть со знаменателем второй, и наоборот.',
      uz: "Birinchi kasrning surati ikkinchisining maxraji bilan mos kelishi kerak, va aksincha.",
      en: 'The first numerator must match the second denominator, and the other way round.',
    },
    correct_text: {
      ru: 'Верно. Обратные пары перевёрнуты друг относительно друга, у остальных числа не совпадают.',
      uz: "To'g'ri. Teskari juftliklar bir-biriga nisbatan ag'darilgan, qolganlarida sonlar mos kelmaydi.",
      en: 'Right. Reciprocal pairs are flips of each other; in the rest the numbers do not match.',
    },
    audio: {
      intro: {
        ru: 'Разложите произведения по двум корзинам. Считать до конца не обязательно, смотрите на числа.',
        uz: "Ko'paytmalarni ikki savatga ajrating. Oxirigacha hisoblash shart emas, sonlarga qarang.",
        en: 'Sort the products into two baskets. No need to compute, just look at the numbers.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Проверь, перевёрнута ли вторая дробь.', uz: "Bu yerga emas. Ikkinchi kasr ag'darilganini tekshiring.", en: 'Not here. Check whether the second fraction is the flip.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «10 книг это 2/5 полки, значит на полке 4 книги». Проверь.', uz: "Aziz: «10 kitob bu javonning 2/5 qismi, demak javonda 4 kitob bor». Tekshiring.", en: 'Aziz: “10 books are 2/5 of the shelf, so the shelf holds 4.” Check it.' },
        opts: [
          { ru: 'Нет: целое меньше части, значит умножил вместо деления', uz: "Yo'q: butun qismdan kichik, demak bo'lish o'rniga ko'paytirgan", en: 'No: the whole came out smaller, so he multiplied instead of dividing' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Ошибка в дроби', uz: 'Xato kasrda', en: 'The mistake is in the fraction' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 10 : 2/5 = 25 книг.', uz: "To'g'ri. 10 : 2/5 = 25 kitob.", en: 'Right. 10 ÷ 2/5 = 25 books.' },
        wrong: [
          null,
          { ru: 'На полке не может быть меньше книг, чем на её части.', uz: "Javonda uning qismidagidan kam kitob bo'lolmaydi.", en: 'A shelf cannot hold fewer books than a part of it.' },
          { ru: 'Дробь дана верно, неверно выбрано действие.', uz: "Kasr to'g'ri berilgan, amal noto'g'ri tanlangan.", en: 'The fraction is fine; the operation was wrong.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «Обратное к 2/7 это 7/2, а обратное к 0 это 1/0». Проверь.', uz: "Dilnoza: «2/7 ning teskarisi 7/2, nolning teskarisi esa 1/0». Tekshiring.", en: 'Dilnoza: “The reciprocal of 2/7 is 7/2, and of 0 it is 1/0.” Check it.' },
        opts: [
          { ru: 'Первое верно, второе нет: на 0 делить нельзя', uz: "Birinchisi to'g'ri, ikkinchisi emas: 0 ga bo'lib bo'lmaydi", en: 'The first is right, the second is not: division by 0 is impossible' },
          { ru: 'Оба верны', uz: "Ikkalasi ham to'g'ri", en: 'Both are right' },
          { ru: 'Оба неверны', uz: "Ikkalasi ham noto'g'ri", en: 'Both are wrong' },
        ],
        correct: 0,
        ok: { ru: 'Верно. У нуля обратного числа не существует.', uz: "To'g'ri. Nolning teskari soni mavjud emas.", en: 'Right. Zero has no reciprocal at all.' },
        wrong: [
          null,
          { ru: 'Запись 1/0 не имеет смысла: делить на ноль нельзя.', uz: "1/0 yozuvi ma'nosiz: nolga bo'lib bo'lmaydi.", en: 'The expression 1/0 is meaningless: division by zero is not allowed.' },
          { ru: 'Первое как раз верно: 2/7 · 7/2 = 1.', uz: "Birinchisi aynan to'g'ri: 2/7 · 7/2 = 1.", en: 'The first one is correct: 2/7 · 7/2 = 1.' },
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
    title: { ru: 'Дорога Азиза', uz: 'Azizning yo\'li', en: 'Aziz’s route' },
    lead: { ru: 'Азиз прошёл 2/5 дороги, это 600 метров.', uz: "Aziz yo'lning 2/5 qismini bosdi, bu 600 metr.", en: 'Aziz has walked 2/5 of the way, which is 600 metres.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какая длина всей дороги?', uz: "Butun yo'l uzunligi qancha?", en: 'How long is the whole route?' },
        opts: ['1500 м', '240 м', '3000 м'],
        correct: 0,
        ok: { ru: 'Верно. 600 : 2/5 = 600 · 5/2 = 1500 метров.', uz: "To'g'ri. 600 : 2/5 = 600 · 5/2 = 1500 metr.", en: 'Right. 600 ÷ 2/5 = 600 · 5/2 = 1500 metres.' },
        wrong: [
          null,
          { ru: 'Целое не может быть меньше части: здесь умножили.', uz: "Butun qismdan kichik bo'lolmaydi: bu yerda ko'paytirilgan.", en: 'A whole cannot be smaller than a part: this was multiplied.' },
          { ru: 'Умножили на 5, но забыли разделить на 2.', uz: "5 ga ko'paytirdingiz, lekin 2 ga bo'lishni unutdingiz.", en: 'Multiplied by 5 but forgot to divide by 2.' },
        ],
      },
      {
        q: { ru: 'Сколько метров ему осталось?', uz: 'Unga necha metr qoldi?', en: 'How many metres are left?' },
        opts: ['900 м', '600 м', '1500 м'],
        correct: 0,
        ok: { ru: 'Верно. Осталось 3/5 дороги: 1500 − 600 = 900 метров.', uz: "To'g'ri. Yo'lning 3/5 qismi qoldi: 1500 − 600 = 900 metr.", en: 'Right. Three fifths remain: 1500 − 600 = 900 metres.' },
        wrong: [
          null,
          { ru: '600 метров он уже прошёл.', uz: "600 metrni u allaqachon bosib o'tdi.", en: 'He has already walked those 600 metres.' },
          { ru: '1500 — это вся дорога, а не остаток.', uz: "1500 bu butun yo'l, qolgan qism emas.", en: '1500 is the whole route, not the remainder.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про дорогу. Азиз прошёл две пятых пути, это шестьсот метров.',
        uz: "Yo'l haqida masala. Aziz yo'lning ikki beshdan qismini bosdi, bu olti yuz metr.",
        en: 'A route problem. Aziz walked two fifths of the way, six hundred metres.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 20,
        q: { ru: '12 — это 3/5 числа. Найди число и набери ответ.', uz: '12 bu sonning 3/5 qismi. Sonni toping va javobni tering.', en: '12 is 3/5 of a number. Find it and type the answer.' },
        hint: { ru: 'Дели на дробь: 12 · 5/3.', uz: "Kasrga bo'ling: 12 · 5/3.", en: 'Divide by the fraction: 12 · 5/3.' },
        hint_audio: { ru: 'Известна часть, значит делим на три пятых, то есть умножаем на пять третьих.', uz: "Qism ma'lum, demak uch beshdanga bo'lamiz, ya'ni besh uchdanga ko'paytiramiz.", en: 'The part is known, so divide by three fifths, that is multiply by five thirds.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Какое число обратно 4/9?', uz: '4/9 ga qaysi son teskari?', en: 'Which number is the reciprocal of 4/9?' },
        opts: ['4/9', '1/9', '9/4', '9'],
        wrong: [
          { ru: 'Произведение дроби на себя единицы не даёт.', uz: "Kasrning o'ziga ko'paytmasi bir bermaydi.", en: 'A fraction times itself does not give one.' },
          { ru: 'Числитель тоже переворачивается.', uz: "Surat ham ag'dariladi.", en: 'The numerator flips too.' },
          null,
          { ru: '9 — это обратное к 1/9, а не к 4/9.', uz: '9 bu 1/9 ning teskarisi, 4/9 niki emas.', en: 'Nine is the reciprocal of 1/9, not of 4/9.' },
        ],
        correct: { ru: 'Верно. 4/9 · 9/4 = 36/36 = 1.', uz: "To'g'ri. 4/9 · 9/4 = 36/36 = 1.", en: 'Right. 4/9 · 9/4 = 36/36 = 1.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'В классе 3/8 учеников — девочки, их 9. Сколько учеников в классе?', uz: "Sinf o'quvchilarining 3/8 qismi qizlar, ular 9 ta. Sinfda nechta o'quvchi bor?", en: 'Girls make 3/8 of a class and there are 9 of them. How many students?' },
        opts: ['12', '24', '27', '3'],
        wrong: [
          { ru: 'Мало: 3/8 от 12 это меньше 9.', uz: "Kam: 12 ning 3/8 qismi 9 dan kichik.", en: 'Too few: 3/8 of 12 is less than 9.' },
          null,
          { ru: 'Умножили на 3, а надо делить на 3 и умножать на 8.', uz: "3 ga ko'paytirdingiz, kerak bo'lgani 3 ga bo'lib 8 ga ko'paytirish.", en: 'Multiplied by 3, but you must divide by 3 and multiply by 8.' },
          { ru: 'Это одна доля из восьми, а не весь класс.', uz: "Bu sakkizdan bitta ulush, butun sinf emas.", en: 'That is one of the eight parts, not the class.' },
        ],
        correct: { ru: 'Верно. 9 : 3/8 = 9 · 8/3 = 24.', uz: "To'g'ri. 9 : 3/8 = 9 · 8/3 = 24.", en: 'Right. 9 ÷ 3/8 = 9 · 8/3 = 24.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Известно целое, нужна его часть. Что делают?', uz: "Butun ma'lum, uning qismi kerak. Nima qilinadi?", en: 'The whole is known and a part is needed. What do you do?' },
        opts: [
          { ru: 'Умножают на дробь', uz: "Kasrga ko'paytiradilar", en: 'Multiply by the fraction' },
          { ru: 'Делят на дробь', uz: "Kasrga bo'ladilar", en: 'Divide by the fraction' },
          { ru: 'Переворачивают целое', uz: "Butunni ag'daradilar", en: 'Flip the whole' },
          { ru: 'Вычитают дробь', uz: 'Kasrni ayiradilar', en: 'Subtract the fraction' },
        ],
        wrong: [
          null,
          { ru: 'Делят, когда целое неизвестно.', uz: "Butun noma'lum bo'lganda bo'ladilar.", en: 'Dividing is for when the whole is unknown.' },
          { ru: 'Переворачивают только делитель при делении.', uz: "Bo'lishda faqat bo'luvchi ag'dariladi.", en: 'Only the divisor is flipped, and only in division.' },
          { ru: 'Вычитание тут ни при чём.', uz: 'Ayirishning bunga aloqasi yo\'q.', en: 'Subtraction has nothing to do with it.' },
        ],
        correct: { ru: 'Верно. Часть от числа — это умножение, как в одиннадцатом уроке.', uz: "To'g'ri. Sonning qismi bu ko'paytirish, o'n birinchi darsdagidek.", en: 'Right. A part of a number is multiplication, as in lesson eleven.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Почему у нуля нет обратного числа?', uz: "Nega nolning teskari soni yo'q?", en: 'Why does zero have no reciprocal?' },
        opts: [
          { ru: 'Потому что ноль меньше единицы', uz: 'Chunki nol birdan kichik', en: 'Because zero is less than one' },
          { ru: 'Потому что ноль не дробь', uz: 'Chunki nol kasr emas', en: 'Because zero is not a fraction' },
          { ru: 'Потому что ноль чётный', uz: 'Chunki nol juft', en: 'Because zero is even' },
          { ru: 'Потому что 0 умножить на любое число даёт 0', uz: "Chunki 0 ni har qanday songa ko'paytirsak 0 chiqadi", en: 'Because 0 times any number is 0' },
        ],
        wrong: [
          { ru: 'Дело не в размере: у 1/2 обратное есть.', uz: "Gap kattalikda emas: 1/2 ning teskarisi bor.", en: 'Size is not the reason: 1/2 has a reciprocal.' },
          { ru: 'Ноль можно записать дробью 0/1, дело не в этом.', uz: "Nolni 0/1 kasr bilan yozish mumkin, gap bunda emas.", en: 'Zero can be written as 0/1, that is not the reason.' },
          { ru: 'Чётность здесь ни при чём.', uz: 'Juftlikning bunga aloqasi yo\'q.', en: 'Evenness has nothing to do with it.' },
          null,
        ],
        correct: { ru: 'Верно. Единицу из нуля получить невозможно.', uz: "To'g'ri. Noldan birni hosil qilib bo'lmaydi.", en: 'Right. There is no way to get one out of zero.' },
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
      ru: 'Частота и период — взаимно обратные величины. Если колесо делает 4 оборота в секунду, один оборот занимает 1/4 секунды. Физики умножают их и всегда получают 1.',
      uz: "Chastota va davr o'zaro teskari kattaliklar. Agar g'ildirak sekundiga 4 marta aylansa, bitta aylanish 1/4 sekund davom etadi. Fiziklar ularni ko'paytirib doim 1 oladi.",
      en: 'Frequency and period are reciprocals. If a wheel turns 4 times a second, one turn takes 1/4 of a second. Physicists multiply them and always get 1.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Частота и период это взаимно обратные величины. Если колесо делает четыре оборота в секунду, один оборот занимает одну четвёртую секунды. Физики перемножают их и всегда получают единицу.',
      uz: "Bilasizmi? Chastota va davr o'zaro teskari kattaliklar. Agar g'ildirak sekundiga to'rt marta aylansa, bitta aylanish bir to'rtdan sekund davom etadi. Fiziklar ularni ko'paytirib doim bir oladi.",
      en: 'Did you know? Frequency and period are reciprocals. If a wheel turns four times a second, one turn takes a quarter of a second. Physicists multiply them and always get one.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Дроби', uz: 'Matematika · Kasrlar', en: 'Mathematics · Fractions' },
    heading: { ru: 'Обратные числа и целое по части', uz: "Teskari sonlar va qismga ko'ra butun", en: 'Reciprocals and the whole' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'взаимно обратные дают в произведении 1', uz: "o'zaro teskari sonlar ko'paytmada 1 beradi", en: 'reciprocals multiply to 1' },
    brief_2: { ru: 'известно целое — умножаем', uz: "butun ma'lum — ko'paytiramiz", en: 'whole known: multiply' },
    brief_3: { ru: 'известна часть — делим', uz: "qism ma'lum — bo'lamiz", en: 'part known: divide' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Обратное число', uz: 'Teskari son', en: 'Reciprocal' },
    memo_a1: { ru: 'перевёрнутая дробь, произведение равно 1', uz: "ag'darilgan kasr, ko'paytma 1", en: 'the flipped fraction, product is 1' },
    memo_q2: { ru: 'Целое по части', uz: "Qismga ko'ra butun", en: 'Whole from a part' },
    memo_a2: { ru: 'делим часть на её дробь', uz: "qismni o'z kasriga bo'lamiz", en: 'divide the part by its fraction' },
    memo_q3: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Check' },
    memo_a3: { ru: 'целое больше своей части', uz: "butun o'z qismidan katta", en: 'the whole exceeds its part' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Взаимно обратные числа дают в произведении единицу, а получают их переворотом дроби. У нуля обратного нет. Если известно целое, умножаем, если известна часть, делим.',
        'Дорога: шестьсот метров это две пятых пути, а вся дорога тысяча пятьсот метров.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "O'zaro teskari sonlar ko'paytmada bir beradi, ular kasrni ag'darish bilan olinadi. Nolning teskarisi yo'q. Butun ma'lum bo'lsa ko'paytiramiz, qism ma'lum bo'lsa bo'lamiz.",
        "Yo'l: olti yuz metr bu yo'lning ikki beshdan qismi, butun yo'l esa ming besh yuz metr.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Reciprocals multiply to one and come from flipping a fraction. Zero has none. If the whole is known we multiply, if the part is known we divide.',
        'The route: six hundred metres are two fifths of the way, and the whole way is one thousand five hundred metres.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Целое по части', uz: "Usul. Qismga ko'ra butun", en: 'Method. The whole from a part' },
    m1_steps: {
      ru: ['Определи, что дано: целое или часть', 'Если дана часть — дели её на дробь', 'Проверь: целое должно быть больше части'],
      uz: ["Nima berilganini aniqlang: butunmi yoki qism", "Qism berilgan bo'lsa, uni kasrga bo'ling", "Tekshiring: butun qismdan katta bo'lishi kerak"],
      en: ['Decide what is given: the whole or a part', 'If a part is given, divide it by the fraction', 'Check: the whole must exceed the part'],
    },
    m1_no: {
      ru: 'Если дано целое, наоборот, умножаем на дробь — это урок 11.',
      uz: "Butun berilgan bo'lsa, aksincha, kasrga ko'paytiramiz — bu 11-dars.",
      en: 'If the whole is given, multiply by the fraction instead: that was lesson 11.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: дорога в школу. На хуке вопрос, в итоге ответ.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d13sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d13sky)"/>

    {/* Школа справа: цель пути */}
    <g opacity="0.85">
      <rect x="308" y="34" width="80" height="58" rx="3" fill="#E5DAC6"/>
      <path d="M304 34 L348 12 L392 34 Z" fill="#D2A96F"/>
      {[318, 340, 362].map((wx) => <rect key={wx} x={wx} y="48" width="14" height="16" rx="2" fill="#DCEDF5"/>)}
      <rect x="340" y="70" width="18" height="22" rx="2" fill="#C9A472"/>
      <circle cx="348" cy="24" r="5" fill="#FFFDF7" stroke="#C9A472"/>
    </g>

    {/* Дома и деревья вдоль дороги */}
    <g opacity="0.5">
      <rect x="16" y="52" width="44" height="40" rx="3" fill="#E5DAC6"/>
      <path d="M12 52 L38 36 L64 52 Z" fill="#C9A472"/>
      <rect x="76" y="62" width="34" height="30" rx="3" fill="#E5DAC6"/>
      <path d="M72 62 L93 48 L114 62 Z" fill="#C9A472"/>
    </g>
    {[130, 190, 250].map((tx) => (
      <g key={tx} className="d13-tree">
        <path d={`M${tx} 92 v-14`} stroke="#B08A57" strokeWidth="3"/>
        <circle cx={tx} cy="72" r="11" fill="#8FBF7F"/>
      </g>
    ))}

    {/* Дорога: пройденный участок закрашен, делений НЕТ */}
    <g>
      <rect x="10" y="100" width="380" height="22" rx="4" fill="#CFC7B8"/>
      <rect x="10" y="100" width="152" height="22" rx="4" fill="#E8A33C" opacity="0.8"/>
      <g className="d13-road">
        {[20, 60, 100, 140, 180, 220, 260, 300, 340].map((rx) => (
          <rect key={rx} x={rx} y="110" width="22" height="2.6" rx="1.3" fill="#FFFDF7" opacity="0.85"/>
        ))}
      </g>
    </g>

    {/* Азиз идёт по дороге, Дилноза ждёт у школы */}
    <g className="d13-walk">
      <Person x={162} ground={100} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    </g>
    <Person x={296} ground={100} head={12} shirt="#F5C77E" hair="#5A4636"/>

    {/* Тротуар и рюкзак у обочины */}
    <rect x="0" y="122" width="400" height="32" fill="#D2A96F"/>
    <g>
      <rect x="34" y="130" width="24" height="20" rx="5" fill="#D98A5A"/>
      <path d="M40 130 v-6 h12 v6" fill="none" stroke="#B5714A" strokeWidth="2"/>
    </g>
    <g className="d13-cloud" opacity="0.75">
      <circle cx="90" cy="24" r="10" fill="#FFFDF7"/>
      <circle cx="104" cy="22" r="13" fill="#FFFDF7"/>
      <circle cx="118" cy="26" r="9" fill="#FFFDF7"/>
    </g>
  </svg>
);

// Итог: дорога размечена на пять участков, пройдено два.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    {Array.from({ length: 5 }, (_, i) => (
      <rect key={i} x={20 + 72 * i} y="24" width="72" height="26"
        fill={i < 2 ? '#E8A33C' : '#F7F0E2'} stroke="#B08A57" strokeWidth="1.6"/>
    ))}
    <g fill="#494550" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="12">
      {Array.from({ length: 5 }, (_, i) => (
        <text key={i} x={56 + 72 * i} y="42" textAnchor="middle" fill={i < 2 ? '#FFFDF7' : '#8A8883'}>300</text>
      ))}
    </g>
    <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="14">
      <text x="200" y="74" textAnchor="middle">600 : 2 / 5 = 1500</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Дорога как счётный материал: total участков, done пройдено, values — подписи.
const Road = ({ total, done, values = null, size = 'mid' }) => (
  <span className={'d13-road-row d13-road-' + size}>
    {Array.from({ length: total }, (_, i) => (
      <i key={i} className={i < done ? 'on' : ''}>{values ? values[i] : ''}</i>
    ))}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d13-line d13-fade' + (on ? ' d13-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d13-stage">
        <Line node={t(c.lines[0])} on={step >= 0}/>
        <span className={'d13-flip d13-fade' + (step >= 1 ? ' d13-on' : '')}>
          <Frac n="2" d="3" size="mid"/><span className="d13-op">→</span><Frac n="3" d="2" size="mid"/>
        </span>
        <span className={'d13-fade' + (step >= 2 ? ' d13-on' : '')}>
          <Road total={9} done={9} size="sm"/>
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

// Ядро: пары взаимно обратных чисел, произведение равно единице.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d13-stage">
        {c.pairs.map((p, i) => (
          <span key={i} className={'d13-pairline d13-fade' + (step >= i ? ' d13-on' : '')}>
            <Frac n={p.a.n} d={p.a.d} size="mid"/>
            <span className="d13-op">·</span>
            <Frac n={p.b.n} d={p.b.d} size="mid"/>
            <span className="d13-op">=</span>
            <b className="d13-res">1</b>
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

const TwoBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_two;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d13-stage">
        <span className="d13-two">
          <span className="d13-card d13-card-mul">
            <b>{mt(t(c.left_q))}</b>
            <span className={'d13-fade' + (step >= 1 ? ' d13-on' : '')}>{mt(t(c.left_a))}</span>
          </span>
          <span className={'d13-card d13-card-div d13-fade' + (step >= 2 ? ' d13-on' : '')}>
            <b>{mt(t(c.right_q))}</b>
            <span>{mt(t(c.right_a))}</span>
          </span>
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
      <div className="frame fade-up delay-1 d13-stage">
        <Road total={9} done={7} size="sm"/>
        {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
        <span className={'d13-fade' + (step >= 2 ? ' d13-on' : '')}>
          <b className="d13-res">27</b>
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

// Граница: умножили вместо деления, целое вышло меньше части.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d13-stage">
        <span className="d13-pair d13-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d13-pair d13-pair-good d13-fade' + (step >= 1 ? ' d13-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d13-pair d13-pair-warn d13-fade' + (step >= 2 ? ' d13-on' : '')}>
          <span className="d13-note">{mt(t(c.zero_line))}</span>
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
        <div className={'d13-banner fade-up delay-1' + (phase === 'play' ? ' d13-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d13-stage d13-stage-tool">
          {phase === 'demo' ? (
            <>
              <Road total={5} done={2} size="sm"
                values={done ? ['300', '300', '300', '300', '300'] : ['', '', '', '', '']}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d13-verdict' + (done ? ' d13-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d13-acts fade-up">
            <button className="d13-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d13-btn d13-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenTwo = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_two} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <TwoBody step={step}/>}/>
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
      <div className="d13-stage">
        <span className="d13-pairline">
          <Frac n="2" d="5" size="mid"/><span className="d13-op">·</span>
          <Frac n="5" d="2" size="mid"/><span className="d13-op">=</span>
          <b className="d13-res">1</b>
        </span>
        <Road total={5} done={2} size="sm" values={['300', '300', '300', '300', '300']}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenRec = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_rec} asideNode={methodAside}/>
);
const ScreenWhole = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_whole} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: дорога на пять участков, во втором задании виден остаток.
const TaskFig = ({ idx }) => (
  <div className="d13-task-fig">
    <Road total={5} done={2} size="sm"
      values={idx >= 1 ? ['300', '300', '300', '300', '300'] : ['', '', '', '', '']}/>
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
.d13-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d13-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d13-stage-tool .d13-line { font-size: clamp(12px, 2vw, 16px); }

/* Дорога как счётный материал */
.d13-road-row { display: inline-flex; gap: 2px; border: 2px solid #B08A57; border-radius: 5px; padding: 2px; background: #FFFDF7; }
.d13-road-row i { display: grid; place-items: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #8A8883; background: #F7F0E2; border-radius: 3px; transition: background-color 400ms linear; }
.d13-road-mid i { width: clamp(30px, 6.4vw, 54px); height: clamp(22px, 4vw, 32px); font-size: clamp(11px, 2vw, 14px); }
.d13-road-sm i { width: clamp(24px, 5.2vw, 44px); height: clamp(18px, 3.4vw, 27px); font-size: clamp(9px, 1.8vw, 13px); }
.d13-road-row i.on { background: #E8A33C; color: #FFFDF7; }

.d13-fade { opacity: 0; transition: opacity 420ms linear; }
.d13-on { opacity: 1; }
.d13-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }
.d13-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 21px); font-weight: 700; color: #8A8883; }
.d13-res { font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 4.2vw, 32px); color: #1F7A4D; }
.d13-pairline, .d13-flip { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; }

/* Две задачи рядом */
.d13-two { display: flex; gap: clamp(8px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; width: 100%; }
.d13-card { flex: 1 1 190px; display: flex; flex-direction: column; gap: 6px; padding: clamp(8px, 1.6vw, 12px); border-radius: 13px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 19px); font-weight: 700; color: #1F7A4D; }
.d13-card b { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 600; color: #494550; }
.d13-card-mul { background: #E7F5FA; border: 1px solid #B6DCEA; }
.d13-card-div { background: #E3F0E8; border: 1px solid #A9CFBA; }

/* Строки экрана границы */
.d13-pair { width: 100%; padding: clamp(6px, 1.4vw, 10px); border-radius: 12px; text-align: center; }
.d13-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d13-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d13-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }
.d13-note { font-size: clamp(13px, 2.2vw, 16px); color: #494550; }

/* Задача */
.d13-task-fig { display: flex; justify-content: center; }

/* Экран 4 */
.d13-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d13-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d13-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d13-verdict-on { opacity: 1; }
.d13-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d13-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d13-btn:disabled { opacity: 0.45; cursor: default; }
.d13-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d13-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: Азиз идёт, разметка бежит, облако плывёт */
.d13-walk { animation: d13Walk 5200ms ease-in-out infinite; }
@keyframes d13Walk { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(16px); } }
.d13-road { animation: d13Road 3000ms linear infinite; }
@keyframes d13Road { from { transform: translateX(0); } to { transform: translateX(-40px); } }
.d13-cloud { animation: d13Cloud 9000ms ease-in-out infinite; }
@keyframes d13Cloud { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(22px); } }
.d13-tree { transform-origin: bottom center; animation: d13Tree 4400ms ease-in-out infinite; }
@keyframes d13Tree { 0%, 100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.4deg); } }
@media (prefers-reduced-motion: reduce) { .d13-walk, .d13-road, .d13-cloud, .d13-tree { animation: none; } }

@media (max-width: 639.98px) {
  .d13-road-mid i { width: 28px; height: 20px; font-size: 10px; }
  .d13-road-sm i { width: 23px; height: 17px; font-size: 9px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function ReciprocalsLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenTwo, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenRec, ScreenWhole, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
