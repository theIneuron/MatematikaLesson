// ============================================================
// 6 КЛАСС, УРОК 21 «Проценты»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Процент — это сотая доля, то есть дробь со знаменателем 100 из блока Б2 и
// десятичная запись из блока Б3. Модель урока — квадрат из ста клеток: на нём
// видно и долю, и её десятичную запись, и обыкновенную дробь сразу.
//
// Сцена — коридор школы: стенд с итогами опроса.
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
  lessonId: 'grade6-21',
  lessonTitle: {
    ru: 'Проценты',
    uz: 'Foizlar',
    en: 'Percentages',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 so'rovnoma: 200 dan 25 foiz
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 kasr va o'nli kasr esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 foiz = yuzdan bir ulush
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: sonning foizini topish
  { id: 's_how',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 necha foizini tashkil qiladi
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 18 va 24
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: qaysi butundan
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_part',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 sonning foizi x3
  { id: 's_ratio',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 necha foiz x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: yarimdan katta yoki kichik
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: so'rovnoma
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Опрос в школе', uz: "Maktabdagi so'rovnoma", en: 'The school survey' },
    lead: {
      ru: 'В опросе участвовали 200 учеников. Математику выбрали 25 процентов из них.',
      uz: "So'rovnomada 200 o'quvchi qatnashdi. Ulardan 25 foizi matematikani tanladi.",
      en: 'Two hundred students took the survey and 25 percent chose maths.',
    },
    voice_a: { ru: 'Азиз: значит 25 человек.', uz: 'Aziz: demak 25 kishi.', en: 'Aziz: so 25 people.' },
    voice_b: { ru: 'Дилноза: нет, 50.', uz: "Dilnoza: yo'q, 50.", en: 'Dilnoza: no, 50.' },
    ask: { ru: 'Сколько человек выбрали математику?', uz: 'Matematikani necha kishi tanladi?', en: 'How many chose maths?' },
    options: [
      { ru: '25 человек', uz: '25 kishi', en: '25 people' },
      { ru: '50 человек', uz: '50 kishi', en: '50 people' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В школе провели опрос о любимом предмете. Участвовали двести учеников, и математику выбрали двадцать пять процентов из них.',
          'Азиз говорит, что это двадцать пять человек, а Дилноза что пятьдесят. Сколько человек выбрали математику? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktabda sevimli fan haqida so'rovnoma o'tkazildi. Ikki yuz o'quvchi qatnashdi va ulardan yigirma besh foizi matematikani tanladi.",
          "Aziz bu yigirma besh kishi deydi, Dilnoza esa ellik deydi. Matematikani necha kishi tanladi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The school ran a survey about favourite subjects. Two hundred students took part and twenty five percent chose maths.',
          'Aziz says that is twenty five people, Dilnoza says fifty. How many chose maths? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Дробь и десятичная запись', uz: "Kasr va o'nli yozuv", en: 'Fraction and decimal' },
    rows: [
      { frac: [1, 4], dec: '0,25' },
      { frac: [1, 2], dec: '0,5' },
      { frac: [3, 4], dec: '0,75' },
    ],
    done: {
      ru: 'Одна и та же часть записывается тремя способами. Сегодня добавится четвёртый — процент.',
      uz: "Bitta qism uch xil usulda yoziladi. Bugun to'rtinchisi qo'shiladi — foiz.",
      en: 'The same part can be written three ways. Today a fourth appears: the percent.',
    },
    audio: {
      ru: [
        'Вспомним предыдущие блоки. Одна четвёртая это ноль целых двадцать пять сотых.',
        'Одна вторая это ноль целых пять десятых, три четвёртых это ноль целых семьдесят пять сотых.',
        'Одна и та же часть записана двумя способами. Сегодня появится третий, и он окажется самым привычным в жизни.',
      ],
      uz: [
        "Oldingi bloklarni eslaymiz. Bir to'rtdan bu nol butun yigirma besh yuzdan.",
        "Bir ikkidan bu nol butun besh o'ndan, uch to'rtdan bu nol butun yetmish besh yuzdan.",
        "Bitta qism ikki xil usulda yozilgan. Bugun uchinchisi paydo bo'ladi va u hayotda eng ko'p uchraydigani bo'lib chiqadi.",
      ],
      en: [
        'Recall the earlier blocks. One quarter is zero point two five.',
        'One half is zero point five and three quarters is zero point seven five.',
        'The same part written two ways. Today a third appears, and it turns out to be the most familiar one in real life.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Процент — сотая доля', uz: 'Foiz — yuzdan bir ulush', en: 'A percent is a hundredth' },
    lines: [
      { ru: '1 процент — это 1 клетка из 100', uz: '1 foiz — bu 100 dan 1 katak', en: '1 percent is 1 cell out of 100' },
      { ru: '25 процентов = 25/100 = 0,25', uz: '25 foiz = 25/100 = 0,25', en: '25 percent = 25/100 = 0.25' },
      { ru: '25/100 сокращается до 1/4', uz: '25/100 qisqarib 1/4 bo\'ladi', en: '25/100 reduces to 1/4' },
    ],
    done: {
      ru: 'Процент — это доля от целого, а не количество людей. Четверть от двухсот это пятьдесят человек. Права была Дилноза.',
      uz: "Foiz butundan olingan ulush, odamlar soni emas. Ikki yuzning choragi ellik kishi. Dilnoza haq edi.",
      en: 'A percent is a share of the whole, not a count of people. A quarter of two hundred is fifty. Dilnoza was right.',
    },
    audio: {
      ru: [
        'Разделим квадрат на сто одинаковых клеток. Одна такая клетка это один процент.',
        'Закрасим двадцать пять клеток. Это двадцать пять процентов, или двадцать пять сотых, или ноль целых двадцать пять сотых.',
        'А если сократить двадцать пять сотых, получится одна четвёртая. Значит двадцать пять процентов от двухсот это четверть от двухсот, то есть пятьдесят человек. Права была Дилноза.',
      ],
      uz: [
        "Kvadratni yuzta bir xil katakka bo'lamiz. Shunday bitta katak bir foiz.",
        "Yigirma beshta katakni bo'yaymiz. Bu yigirma besh foiz yoki yigirma besh yuzdan yoki nol butun yigirma besh yuzdan.",
        "Yigirma besh yuzdanni qisqartirsak, bir to'rtdan chiqadi. Demak ikki yuzning yigirma besh foizi ikki yuzning choragi, ya'ni ellik kishi. Dilnoza haq edi.",
      ],
      en: [
        'Divide a square into one hundred equal cells. One such cell is one percent.',
        'Shade twenty five cells. That is twenty five percent, or twenty five hundredths, or zero point two five.',
        'And twenty five hundredths reduces to one quarter. So twenty five percent of two hundred is a quarter of two hundred, that is fifty people. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Процент от числа', uz: 'Sonning foizi', en: 'A percent of a number' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '25% от 200', uz: "200 ning 25% i", en: '25% of 200' },
      { ru: '25% = 0,25', uz: '25% = 0,25', en: '25% = 0.25' },
      { ru: '200 · 0,25 = 50', uz: '200 · 0,25 = 50', en: '200 · 0.25 = 50' },
    ],
    demo_note: {
      ru: 'Можно и через единицу: 1% от 200 это 2, а 25% это 2 · 25 = 50. Оба пути дают одно и то же.',
      uz: "Bir foiz orqali ham bo'ladi: 200 ning 1% i 2, 25% i esa 2 · 25 = 50. Ikkala yo'l bir xil natija beradi.",
      en: 'Or through one percent: 1% of 200 is 2, so 25% is 2 · 25 = 50. Both routes agree.',
    },
    play_ask: { ru: 'Сколько будет 10% от 350?', uz: "350 ning 10% i nechaga teng?", en: 'What is 10% of 350?' },
    play_opts: ['3,5', '35', '350'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. 10% это 0,1, а 350 · 0,1 = 35.',
      uz: "To'g'ri. 10% bu 0,1, 350 · 0,1 = 35.",
      en: 'Right. 10% is 0.1 and 350 · 0.1 = 35.',
    },
    play_wrong: [
      { ru: 'Это 1% от 350, а нужно в десять раз больше.', uz: "Bu 350 ning 1% i, kerak bo'lgani o'n barobar ko'p.", en: 'That is 1% of 350, and we need ten times more.' },
      null,
      { ru: 'Это всё число целиком, то есть 100%.', uz: "Bu butun sonning o'zi, ya'ni 100%.", en: 'That is the whole number, that is 100%.' },
    ],
    audio: {
      intro: {
        ru: 'Чтобы найти процент от числа, процент переводят в десятичную дробь и умножают. Покажу на двадцати пяти процентах от двухсот.',
        uz: "Sonning foizini topish uchun foizni o'nli kasrga aylantirib ko'paytiriladi. Ikki yuzning yigirma besh foizi misolida ko'rsataman.",
        en: 'To find a percent of a number, turn the percent into a decimal and multiply. I will show it on twenty five percent of two hundred.',
      },
      demo: {
        ru: 'Двадцать пять процентов это ноль целых двадцать пять сотых. Двести умножить на ноль целых двадцать пять сотых пятьдесят.',
        uz: "Yigirma besh foiz bu nol butun yigirma besh yuzdan. Ikki yuz karra nol butun yigirma besh yuzdan ellik.",
        en: 'Twenty five percent is zero point two five. Two hundred times zero point two five is fifty.',
      },
      play: {
        ru: 'Теперь ваша очередь. Сколько будет десять процентов от трёхсот пятидесяти?',
        uz: "Endi sizning navbatingiz. Uch yuz ellikning o'n foizi nechaga teng?",
        en: 'Now it is your turn. What is ten percent of three hundred fifty?',
      },
      ok: {
        ru: 'Верно. Десять процентов это одна десятая, значит тридцать пять.',
        uz: "To'g'ri. O'n foiz bu o'ndan bir, demak o'ttiz besh.",
        en: 'Right. Ten percent is one tenth, so thirty five.',
      },
      wrong: {
        ru: 'Переведите процент в десятичную дробь и умножьте на число.',
        uz: "Foizni o'nli kasrga aylantiring va songa ko'paytiring.",
        en: 'Turn the percent into a decimal and multiply by the number.',
      },
    },
  },

  s_how: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Сколько это процентов', uz: 'Bu necha foiz', en: 'What percent is it' },
    lines: [
      { ru: '30 из 120 — какая это часть?', uz: '120 dan 30 — bu qanday qism?', en: '30 out of 120: what share is it?' },
      { ru: '30 : 120 = 0,25', uz: '30 : 120 = 0,25', en: '30 ÷ 120 = 0.25' },
      { ru: '0,25 · 100 = 25%', uz: '0,25 · 100 = 25%', en: '0.25 · 100 = 25%' },
    ],
    done: {
      ru: 'Обратный вопрос решается делением: часть делим на целое и умножаем на 100. Получаем ответ в процентах.',
      uz: "Teskari savol bo'lish bilan yechiladi: qismni butunga bo'lamiz va 100 ga ko'paytiramiz. Javob foizda chiqadi.",
      en: 'The reverse question uses division: divide the part by the whole and multiply by 100. The answer comes out in percent.',
    },
    audio: {
      ru: [
        'Бывает и обратный вопрос: не сколько составит процент, а сколько это процентов.',
        'Тридцать человек из ста двадцати. Делим часть на целое и получаем ноль целых двадцать пять сотых.',
        'Умножаем на сто и получаем двадцать пять процентов. Порядок такой: сначала деление, потом умножение на сто.',
      ],
      uz: [
        "Teskari savol ham bo'ladi: foiz qanchani tashkil qiladi emas, bu necha foiz.",
        "Bir yuz yigirmadan o'ttiz kishi. Qismni butunga bo'lamiz va nol butun yigirma besh yuzdan chiqadi.",
        "Yuzga ko'paytiramiz va yigirma besh foiz chiqadi. Tartib shunday: avval bo'lish, keyin yuzga ko'paytirish.",
      ],
      en: [
        'There is also the reverse question: not how much a percent is, but what percent it is.',
        'Thirty out of one hundred twenty. Divide the part by the whole and get zero point two five.',
        'Multiply by one hundred and get twenty five percent. The order is: divide first, then multiply by a hundred.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: '18 человек из 24', uz: '24 dan 18 kishi', en: '18 people out of 24' },
    lead: { ru: 'Какую часть класса это составляет в процентах?', uz: 'Bu sinfning necha foizini tashkil qiladi?', en: 'What percent of the class is that?' },
    steps: [
      { ru: '18 : 24 = 0,75', uz: '18 : 24 = 0,75', en: '18 ÷ 24 = 0.75' },
      { ru: '0,75 · 100 = 75%', uz: '0,75 · 100 = 75%', en: '0.75 · 100 = 75%' },
      { ru: 'проверка: 24 · 0,75 = 18', uz: 'tekshiruv: 24 · 0,75 = 18', en: 'check: 24 · 0.75 = 18' },
    ],
    done: {
      ru: 'Ответ 75 процентов. Заодно видно: 0,75 это 3/4, а три четверти класса и есть 18 из 24.',
      uz: "Javob 75 foiz. Ayni paytda ko'rinadi: 0,75 bu 3/4, sinfning uchdan to'rt qismi esa 24 dan 18.",
      en: 'The answer is 75 percent. And 0.75 is 3/4, so three quarters of the class is exactly 18 out of 24.',
    },
    audio: {
      ru: [
        'Решаем вместе. Восемнадцать человек из двадцати четырёх. Делим часть на целое.',
        'Получается ноль целых семьдесят пять сотых, а это семьдесят пять процентов.',
        'Проверим обратным действием: двадцать четыре умножить на ноль целых семьдесят пять сотых восемнадцать. Сходится. Заодно заметим, что ноль целых семьдесят пять сотых это три четвёртых.',
      ],
      uz: [
        "Birga yechamiz. Yigirma to'rtdan o'n sakkiz kishi. Qismni butunga bo'lamiz.",
        "Nol butun yetmish besh yuzdan chiqadi, bu esa yetmish besh foiz.",
        "Teskari amal bilan tekshiramiz: yigirma to'rt karra nol butun yetmish besh yuzdan o'n sakkiz. To'g'ri keldi. Nol butun yetmish besh yuzdan uch to'rtdan ekanini ham payqaymiz.",
      ],
      en: [
        'Let us solve it together. Eighteen out of twenty four. Divide the part by the whole.',
        'That gives zero point seven five, which is seventy five percent.',
        'Check with the inverse: twenty four times zero point seven five is eighteen. It matches. And notice that zero point seven five is three quarters.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Процент всегда от какого-то целого', uz: 'Foiz doim qaysidir butundan', en: 'A percent always belongs to a whole' },
    bad_line: { ru: 'ошибка: 25% от 200 = 25 человек', uz: "xato: 200 ning 25% i = 25 kishi", en: 'mistake: 25% of 200 = 25 people' },
    good_line: { ru: 'верно: 200 · 0,25 = 50 человек', uz: "to'g'ri: 200 · 0,25 = 50 kishi", en: 'right: 200 · 0.25 = 50 people' },
    more_line: { ru: '100% — это всё целое, а 120% бывает только при росте', uz: "100% bu butunning o'zi, 120% esa faqat o'sishda bo'ladi", en: '100% is the whole thing, and 120% happens only when something grows' },
    done: {
      ru: 'Процент — не количество, а доля. 25% от 200 и 25% от 40 дают разные числа, потому что целое разное.',
      uz: "Foiz son emas, ulush. 200 ning 25% i va 40 ning 25% i har xil son beradi, chunki butun har xil.",
      en: 'A percent is not a count but a share. 25% of 200 and 25% of 40 give different numbers because the wholes differ.',
    },
    audio: {
      ru: [
        'Самая частая ошибка в теме: считать проценты людьми. Двадцать пять процентов это не двадцать пять человек.',
        'Процент это доля от целого. Двадцать пять процентов от двухсот пятьдесят, а от сорока всего десять.',
        'И запомните: сто процентов это всё целое. Больше ста процентов бывает, только когда величина выросла: например, цена стала сто двадцать процентов от прежней.',
      ],
      uz: [
        "Mavzudagi eng ko'p uchraydigan xato: foizni odam deb hisoblash. Yigirma besh foiz yigirma besh kishi emas.",
        "Foiz butundan olingan ulush. Ikki yuzning yigirma besh foizi ellik, qirqniki esa atigi o'n.",
        "Va eslab qoling: yuz foiz butunning o'zi. Yuz foizdan ko'pi faqat kattalik o'sganda bo'ladi: masalan, narx avvalgisining yuz yigirma foizi bo'lib qolganda.",
      ],
      en: [
        'The most common mistake here is counting percents as people. Twenty five percent is not twenty five people.',
        'A percent is a share of the whole. Twenty five percent of two hundred is fifty, but of forty it is only ten.',
        'And remember: one hundred percent is the whole thing. More than a hundred happens only when something grew, for example when a price becomes one hundred twenty percent of the old one.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Что такое процент', uz: 'Foiz nima', en: 'What a percent is' },
    rule_1: {
      ru: 'Процент — это сотая доля числа. Чтобы найти процент от числа, переводим процент в десятичную дробь и умножаем.',
      uz: "Foiz — sonning yuzdan bir ulushi. Sonning foizini topish uchun foizni o'nli kasrga aylantirib ko'paytiramiz.",
      en: 'A percent is a hundredth of a number. To find a percent of a number, turn it into a decimal and multiply.',
    },
    rule_2: {
      ru: 'Чтобы узнать, сколько это процентов, делим часть на целое и умножаем на 100. Опрос: 200 · 0,25 = 50 человек. Права была Дилноза.',
      uz: "Bu necha foiz ekanini bilish uchun qismni butunga bo'lib 100 ga ko'paytiramiz. So'rovnoma: 200 · 0,25 = 50 kishi. Dilnoza haq edi.",
      en: 'To find what percent something is, divide the part by the whole and multiply by 100. The survey: 200 · 0.25 = 50 people. Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Процент это сотая доля числа. Чтобы найти процент от числа, переводим процент в десятичную дробь и умножаем. Чтобы узнать, сколько процентов составляет часть, делим её на целое и умножаем на сто. Вернёмся к опросу. Двадцать пять процентов от двухсот это пятьдесят человек. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Foiz sonning yuzdan bir ulushi. Sonning foizini topish uchun foizni o'nli kasrga aylantirib ko'paytiramiz. Qism necha foiz ekanini bilish uchun uni butunga bo'lib yuzga ko'paytiramiz. So'rovnomaga qaytamiz. Ikki yuzning yigirma besh foizi ellik kishi. Dilnoza haq edi.",
      en: 'Let us remember the rule. A percent is a hundredth of a number. To find a percent of a number, turn the percent into a decimal and multiply. To find what percent a part is, divide it by the whole and multiply by a hundred. Back to the survey. Twenty five percent of two hundred is fifty people. Dilnoza was right.',
    },
  },

  s_part: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Процент от числа', uz: 'Sonning foizi', en: 'A percent of a number' },
    lead: { ru: 'Удобно сначала найти 1% или 10%.', uz: "Avval 1% yoki 10% ni topish qulay.", en: 'It helps to find 1% or 10% first.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '50% от 80', uz: "80 ning 50% i", en: '50% of 80' },
        opts: ['40', '50', '20'],
        correct: 0,
        ok: { ru: 'Верно. 50% это половина: 80 : 2 = 40.', uz: "To'g'ri. 50% bu yarim: 80 : 2 = 40.", en: 'Right. 50% is a half: 80 ÷ 2 = 40.' },
        wrong: [
          null,
          { ru: '50 — это сам процент, а не результат.', uz: "50 bu foizning o'zi, natija emas.", en: 'Fifty is the percent itself, not the result.' },
          { ru: '20 — это 25% от 80.', uz: "20 bu 80 ning 25% i.", en: 'Twenty is 25% of 80.' },
        ],
      },
      {
        q: { ru: '20% от 150', uz: "150 ning 20% i", en: '20% of 150' },
        opts: ['30', '20', '75'],
        correct: 0,
        ok: { ru: 'Верно. 10% это 15, значит 20% это 30.', uz: "To'g'ri. 10% bu 15, demak 20% bu 30.", en: 'Right. 10% is 15, so 20% is 30.' },
        wrong: [
          null,
          { ru: 'Это сам процент, а не часть числа.', uz: "Bu foizning o'zi, sonning qismi emas.", en: 'That is the percent, not the part.' },
          { ru: '75 — это половина от 150.', uz: '75 bu 150 ning yarmi.', en: 'Seventy five is half of 150.' },
        ],
      },
      {
        q: { ru: '5% от 60', uz: "60 ning 5% i", en: '5% of 60' },
        opts: ['3', '5', '12'],
        correct: 0,
        ok: { ru: 'Верно. 1% это 0,6, значит 5% это 3.', uz: "To'g'ri. 1% bu 0,6, demak 5% bu 3.", en: 'Right. 1% is 0.6, so 5% is 3.' },
        wrong: [
          null,
          { ru: 'Это процент, а не результат.', uz: 'Bu foiz, natija emas.', en: 'That is the percent, not the result.' },
          { ru: '12 — это 20% от 60.', uz: "12 bu 60 ning 20% i.", en: 'Twelve is 20% of 60.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Проценты удобно считать через один или десять процентов.',
        uz: "Mashq. Foizni bir yoki o'n foiz orqali hisoblash qulay.",
        en: 'Practice. Percents are easy to compute through one or ten percent.',
      },
    },
  },

  s_ratio: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Сколько это процентов', uz: 'Bu necha foiz', en: 'What percent is it' },
    lead: { ru: 'Часть делим на целое и умножаем на 100.', uz: "Qismni butunga bo'lib 100 ga ko'paytiramiz.", en: 'Divide the part by the whole and multiply by 100.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '15 из 60 — это сколько процентов?', uz: '60 dan 15 — bu necha foiz?', en: '15 out of 60 is what percent?' },
        opts: ['25%', '15%', '40%'],
        correct: 0,
        ok: { ru: 'Верно. 15 : 60 = 0,25, а это 25%.', uz: "To'g'ri. 15 : 60 = 0,25, bu esa 25%.", en: 'Right. 15 ÷ 60 = 0.25, that is 25%.' },
        wrong: [
          null,
          { ru: 'Число части само по себе процентом не является.', uz: "Qismning soni o'zicha foiz bo'lolmaydi.", en: 'The part itself is not the percent.' },
          { ru: '40% от 60 это 24, а у нас 15.', uz: "60 ning 40% i 24, bizda esa 15.", en: '40% of 60 is 24, but we have 15.' },
        ],
      },
      {
        q: { ru: '9 из 30 — это сколько процентов?', uz: '30 dan 9 — bu necha foiz?', en: '9 out of 30 is what percent?' },
        opts: ['30%', '9%', '3%'],
        correct: 0,
        ok: { ru: 'Верно. 9 : 30 = 0,3, а это 30%.', uz: "To'g'ri. 9 : 30 = 0,3, bu esa 30%.", en: 'Right. 9 ÷ 30 = 0.3, that is 30%.' },
        wrong: [
          null,
          { ru: 'Это само количество, а не доля.', uz: "Bu sonning o'zi, ulush emas.", en: 'That is the count, not the share.' },
          { ru: 'Слишком мало: 3% от 30 это меньше единицы.', uz: "Juda kam: 30 ning 3% i birdan kam.", en: 'Too little: 3% of 30 is less than one.' },
        ],
      },
      {
        q: { ru: '40 из 40 — это сколько процентов?', uz: '40 dan 40 — bu necha foiz?', en: '40 out of 40 is what percent?' },
        opts: ['100%', '40%', '1%'],
        correct: 0,
        ok: { ru: 'Верно. Часть равна целому, значит 100%.', uz: "To'g'ri. Qism butunga teng, demak 100%.", en: 'Right. The part equals the whole, so 100%.' },
        wrong: [
          null,
          { ru: 'Число совпадает случайно: доля здесь целая.', uz: "Son tasodifan mos keldi: bu yerda ulush butun.", en: 'The numbers match by chance: the share here is whole.' },
          { ru: '1% это всего 0,4 от сорока.', uz: "1% bu qirqning atigi 0,4 qismi.", en: 'One percent is only 0.4 of forty.' },
        ],
      },
      {
        q: { ru: 'Что делают первым, чтобы найти проценты?', uz: 'Foizni topish uchun avval nima qilinadi?', en: 'What is the first step to find a percent?' },
        opts: [
          { ru: 'Делят часть на целое', uz: "Qismni butunga bo'ladi", en: 'Divide the part by the whole' },
          { ru: 'Умножают часть на 100', uz: "Qismni 100 ga ko'paytiradi", en: 'Multiply the part by 100' },
          { ru: 'Складывают часть и целое', uz: "Qism va butunni qo'shadi", en: 'Add the part and the whole' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Сначала деление, потом умножение на 100.', uz: "To'g'ri. Avval bo'lish, keyin 100 ga ko'paytirish.", en: 'Right. Divide first, then multiply by 100.' },
        wrong: [
          null,
          { ru: 'Умножение идёт вторым шагом, после деления.', uz: "Ko'paytirish ikkinchi qadam, bo'lishdan keyin.", en: 'Multiplying is the second step, after dividing.' },
          { ru: 'Складывать часть и целое незачем.', uz: "Qism va butunni qo'shishning hojati yo'q.", en: 'There is no reason to add them.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на обратный вопрос. Сначала деление, потом умножение на сто.',
        uz: "Teskari savol mashqi. Avval bo'lish, keyin yuzga ko'paytirish.",
        en: 'Practice on the reverse question. Divide first, then multiply by a hundred.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Больше или меньше половины', uz: 'Yarimdan katta yoki kichik', en: 'More or less than half' },
    lead: { ru: 'Половина — это 50 процентов.', uz: 'Yarim — bu 50 foiz.', en: 'A half is 50 percent.' },
    bin_a: { ru: 'Больше половины', uz: "Yarimdan ko'p", en: 'More than half' },
    bin_b: { ru: 'Меньше половины', uz: 'Yarimdan kam', en: 'Less than half' },
    cards: [
      { label: '75%', bin: 'a' },
      { label: '55%', bin: 'a' },
      { label: '90%', bin: 'a' },
      { label: '40%', bin: 'b' },
      { label: '25%', bin: 'b' },
      { label: '10%', bin: 'b' },
    ],
    hint: {
      ru: 'Сравни число с 50: больше — правая корзина, меньше — левая.',
      uz: "Sonni 50 bilan solishtiring: katta bo'lsa o'ng savat, kichik bo'lsa chap.",
      en: 'Compare the number with 50: larger goes right, smaller goes left.',
    },
    correct_text: {
      ru: 'Верно. Половина это ровно 50 процентов, и всё сравнение идёт с этим числом.',
      uz: "To'g'ri. Yarim roppa-rosa 50 foiz va butun solishtirish shu son bilan boradi.",
      en: 'Right. A half is exactly 50 percent, and every comparison is with that number.',
    },
    audio: {
      intro: {
        ru: 'Разложите проценты по двум корзинам. Половина это пятьдесят процентов.',
        uz: 'Foizlarni ikki savatga ajrating. Yarim bu ellik foiz.',
        en: 'Sort the percents into two baskets. A half is fifty percent.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Сравни с пятьюдесятью процентами.', uz: 'Bu yerga emas. Ellik foiz bilan solishtiring.', en: 'Not here. Compare with fifty percent.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «30% от 60 это 30 : 60 = 0,5». Проверь.', uz: "Aziz: «60 ning 30% i bu 30 : 60 = 0,5». Tekshiring.", en: 'Aziz: “30% of 60 is 30 ÷ 60 = 0.5.” Check it.' },
        opts: [
          { ru: 'Нет: надо 60 · 0,3 = 18', uz: "Yo'q: 60 · 0,3 = 18 bo'lishi kerak", en: 'No: it should be 60 · 0.3 = 18' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 2', uz: "Yo'q, 2 bo'ladi", en: 'No, it is 2' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Он решил обратную задачу: 30 из 60 это 50%, а спрашивали другое.', uz: "To'g'ri. U teskari masalani yechdi: 60 dan 30 bu 50%, savol esa boshqa edi.", en: 'Right. He solved the reverse problem: 30 out of 60 is 50%, but the question was different.' },
        wrong: [
          null,
          { ru: 'Проверь смыслом: 30% меньше трети, а 0,5 это половина.', uz: "Ma'no bilan tekshiring: 30% uchdan birdan kam, 0,5 esa yarim.", en: 'Check by sense: 30% is under a third, while 0.5 is a half.' },
          { ru: 'Двойка не получится ни при каком из двух действий.', uz: "Ikki bu ikkala amalda ham chiqmaydi.", en: 'Two comes from neither of the two operations.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «В классе 25 человек, 10% из них это 2,5 ученика». Проверь.', uz: "Dilnoza: «Sinfda 25 kishi, ularning 10% i 2,5 o'quvchi». Tekshiring.", en: 'Dilnoza: “A class of 25, and 10% of them is 2.5 students.” Check it.' },
        opts: [
          { ru: 'Счёт верный, но людей столько быть не может', uz: "Hisob to'g'ri, lekin buncha odam bo'lolmaydi", en: 'The arithmetic is right, but people cannot be counted so' },
          { ru: 'Счёт неверный', uz: "Hisob noto'g'ri", en: 'The arithmetic is wrong' },
          { ru: 'Всё верно, так и записывают', uz: "Hammasi to'g'ri, shunday yoziladi", en: 'All correct, that is how it is written' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 25 · 0,1 = 2,5, но людей считают целыми, значит в задаче нужны другие числа.', uz: "To'g'ri. 25 · 0,1 = 2,5, lekin odam butun sanaladi, demak masalada boshqa sonlar kerak.", en: 'Right. 25 · 0.1 = 2.5, but people are counted whole, so the problem needs different numbers.' },
        wrong: [
          null,
          { ru: 'Счёт как раз верный: ошибка в смысле ответа.', uz: "Hisob aynan to'g'ri: xato javobning ma'nosida.", en: 'The arithmetic is fine: the meaning of the answer is the problem.' },
          { ru: 'Половину ученика записать нельзя.', uz: "Yarim o'quvchini yozib bo'lmaydi.", en: 'Half a student cannot be written down.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в действии, и в смысле ответа.',
        uz: "Birovning yechimini tekshiring. Xato amalda ham, javobning ma'nosida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the operation and in the meaning of the answer.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Итоги опроса', uz: "So'rovnoma natijalari", en: 'Survey results' },
    lead: { ru: 'В опросе 200 учеников. Математику выбрали 25%, спорт 40%.', uz: "So'rovnomada 200 o'quvchi. Matematikani 25%, sportni 40% tanladi.", en: 'Two hundred students took part: 25% chose maths and 40% sport.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько человек выбрали спорт?', uz: 'Sportni necha kishi tanladi?', en: 'How many chose sport?' },
        opts: ['80', '40', '60'],
        correct: 0,
        ok: { ru: 'Верно. 200 · 0,4 = 80 человек.', uz: "To'g'ri. 200 · 0,4 = 80 kishi.", en: 'Right. 200 · 0.4 = 80 people.' },
        wrong: [
          null,
          { ru: 'Это сам процент, а не количество.', uz: "Bu foizning o'zi, son emas.", en: 'That is the percent, not the count.' },
          { ru: '60 — это 30% от 200.', uz: "60 bu 200 ning 30% i.", en: 'Sixty is 30% of 200.' },
        ],
      },
      {
        q: { ru: 'На сколько человек больше выбрали спорт, чем математику?', uz: 'Sportni matematikadan necha kishi ko\'proq tanladi?', en: 'How many more chose sport than maths?' },
        opts: ['30', '15', '80'],
        correct: 0,
        ok: { ru: 'Верно. 80 − 50 = 30 человек.', uz: "To'g'ri. 80 − 50 = 30 kishi.", en: 'Right. 80 − 50 = 30 people.' },
        wrong: [
          null,
          { ru: '15 — это разность процентов, а спрашивают о людях.', uz: "15 bu foizlar ayirmasi, savol esa odamlar haqida.", en: 'Fifteen is the difference in percents, but the question is about people.' },
          { ru: '80 — это все, кто выбрал спорт.', uz: "80 bu sportni tanlaganlarning hammasi.", en: 'Eighty is everyone who chose sport.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про опрос. Двести учеников, математику выбрали двадцать пять процентов, спорт сорок.',
        uz: "So'rovnoma haqida masala. Ikki yuz o'quvchi, matematikani yigirma besh foiz, sportni qirq foiz tanladi.",
        en: 'A survey problem. Two hundred students: twenty five percent chose maths and forty percent sport.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 45,
        q: { ru: 'Найди 15% от 300. Набери ответ.', uz: "300 ning 15% ini toping. Javobni tering.", en: 'Find 15% of 300. Type the answer.' },
        hint: { ru: '1% от 300 это 3, значит 15% это 3 · 15.', uz: "300 ning 1% i 3, demak 15% i 3 · 15.", en: '1% of 300 is 3, so 15% is 3 · 15.' },
        hint_audio: { ru: 'Один процент от трёхсот это три. Значит пятнадцать процентов это три умножить на пятнадцать.', uz: "Uch yuzning bir foizi uch. Demak o'n besh foiz uch karra o'n besh.", en: 'One percent of three hundred is three. So fifteen percent is three times fifteen.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Чему равен 1 процент?', uz: '1 foiz nimaga teng?', en: 'What is 1 percent?' },
        opts: [
          { ru: 'Десятой доле', uz: "O'ndan bir ulushga", en: 'A tenth' },
          { ru: 'Сотой доле', uz: 'Yuzdan bir ulushga', en: 'A hundredth' },
          { ru: 'Одной единице', uz: 'Bitta birlikka', en: 'One unit' },
          { ru: 'Тысячной доле', uz: 'Mingdan bir ulushga', en: 'A thousandth' },
        ],
        wrong: [
          { ru: 'Десятая доля это 10 процентов.', uz: "O'ndan bir ulush bu 10 foiz.", en: 'A tenth is 10 percent.' },
          null,
          { ru: 'Единица зависит от целого: 1% от 200 это 2.', uz: "Birlik butunga bog'liq: 200 ning 1% i 2.", en: 'A unit depends on the whole: 1% of 200 is 2.' },
          { ru: 'Тысячная доля это одна десятая процента.', uz: "Mingdan bir ulush bu foizning o'ndan biri.", en: 'A thousandth is a tenth of a percent.' },
        ],
        correct: { ru: 'Верно. Поэтому 100 процентов это всё целое.', uz: "To'g'ri. Shuning uchun 100 foiz butunning o'zi.", en: 'Right. That is why 100 percent is the whole thing.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: '12 из 48 — сколько процентов?', uz: '48 dan 12 — necha foiz?', en: '12 out of 48 is what percent?' },
        opts: ['12%', '48%', '25%', '4%'],
        wrong: [
          { ru: 'Это число части, а не доля.', uz: "Bu qismning soni, ulush emas.", en: 'That is the count, not the share.' },
          { ru: 'Это целое, а не часть.', uz: 'Bu butun, qism emas.', en: 'That is the whole, not the part.' },
          null,
          { ru: 'Слишком мало: 4% от 48 это меньше двух.', uz: "Juda kam: 48 ning 4% i ikkidan kam.", en: 'Too little: 4% of 48 is under two.' },
        ],
        correct: { ru: 'Верно. 12 : 48 = 0,25, а это 25%.', uz: "To'g'ri. 12 : 48 = 0,25, bu esa 25%.", en: 'Right. 12 ÷ 48 = 0.25, that is 25%.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Как записать 60% обыкновенной дробью?', uz: '60% ni oddiy kasr bilan qanday yoziladi?', en: 'How is 60% written as a common fraction?' },
        opts_i18n: [
          { ru: '3/5', uz: '3/5', en: '3/5' },
          { ru: '6/10 нельзя сократить', uz: '6/10 qisqarmaydi', en: '6/10 cannot be reduced' },
          { ru: '1/6', uz: '1/6', en: '1/6' },
          { ru: '60/10', uz: '60/10', en: '60/10' },
        ],
        wrong: [
          null,
          { ru: '6/10 сокращается на 2 и даёт 3/5.', uz: '6/10 ikkiga qisqarib 3/5 beradi.', en: '6/10 reduces by 2 to 3/5.' },
          { ru: '1/6 — это меньше 17 процентов.', uz: '1/6 bu 17 foizdan kam.', en: 'One sixth is under 17 percent.' },
          { ru: 'Знаменатель у процента 100, а не 10.', uz: "Foizning maxraji 100, 10 emas.", en: 'A percent has denominator 100, not 10.' },
        ],
        correct: { ru: 'Верно. 60/100 сокращается на 20 и даёт 3/5.', uz: "To'g'ri. 60/100 yigirmaga qisqarib 3/5 beradi.", en: 'Right. 60/100 reduces by 20 to 3/5.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'В книге 240 страниц, прочитано 25%. Сколько осталось?', uz: 'Kitobda 240 bet, 25% i o\'qildi. Qancha qoldi?', en: 'A book has 240 pages and 25% is read. How many are left?' },
        opts: ['60', '25', '215', '180'],
        wrong: [
          { ru: '60 — это прочитанная часть.', uz: "60 bu o'qilgan qism.", en: 'Sixty is the part already read.' },
          { ru: 'Это процент, а не страницы.', uz: 'Bu foiz, bet emas.', en: 'That is the percent, not pages.' },
          { ru: 'Вычли 25 страниц вместо 25 процентов.', uz: "25 foiz o'rniga 25 bet ayirilgan.", en: 'Twenty five pages were subtracted instead of 25 percent.' },
          null,
        ],
        correct: { ru: 'Верно. Прочитано 60 страниц, осталось 240 − 60 = 180.', uz: "To'g'ri. 60 bet o'qildi, 240 − 60 = 180 qoldi.", en: 'Right. Sixty pages are read, so 240 − 60 = 180 remain.' },
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
      ru: 'Тело человека примерно на 60 процентов состоит из воды, а мозг почти на 75. Врачи и биологи описывают состав именно процентами: так удобно сравнивать организмы разного размера.',
      uz: "Inson tanasi taxminan 60 foiz suvdan iborat, miya esa deyarli 75 foiz. Shifokorlar va biologlar tarkibni aynan foizda tasvirlaydi: shunda har xil kattalikdagi organizmlarni solishtirish qulay.",
      en: 'A human body is about 60 percent water and the brain nearly 75. Doctors and biologists describe composition in percents precisely because it lets them compare organisms of different sizes.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Тело человека примерно на шестьдесят процентов состоит из воды, а мозг почти на семьдесят пять. Врачи и биологи описывают состав процентами, потому что так удобно сравнивать организмы разного размера.',
      uz: "Bilasizmi? Inson tanasi taxminan oltmish foiz suvdan iborat, miya esa deyarli yetmish besh foiz. Shifokorlar va biologlar tarkibni foizda tasvirlaydi, chunki shunda har xil kattalikdagi organizmlarni solishtirish qulay.",
      en: 'Did you know? A human body is about sixty percent water and the brain nearly seventy five. Doctors and biologists describe composition in percents because it lets them compare organisms of different sizes.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Проценты', uz: 'Matematika · Foizlar', en: 'Mathematics · Percentages' },
    heading: { ru: 'Проценты', uz: 'Foizlar', en: 'Percentages' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: '1 процент — сотая доля', uz: '1 foiz — yuzdan bir ulush', en: '1 percent is a hundredth' },
    brief_2: { ru: 'процент от числа — умножаем', uz: "sonning foizi — ko'paytiramiz", en: 'a percent of a number: multiply' },
    brief_3: { ru: 'сколько процентов — делим и на 100', uz: "necha foiz — bo'lamiz va 100 ga", en: 'what percent: divide and times 100' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Перевод', uz: 'Aylantirish', en: 'Conversion' },
    memo_a1: { ru: '25% = 0,25 = 1/4', uz: '25% = 0,25 = 1/4', en: '25% = 0.25 = 1/4' },
    memo_q2: { ru: 'Удобный приём', uz: 'Qulay usul', en: 'A handy trick' },
    memo_a2: { ru: 'сначала найди 1% или 10%', uz: 'avval 1% yoki 10% ni toping', en: 'find 1% or 10% first' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'считать проценты штуками', uz: 'foizni dona deb hisoblash', en: 'treating percents as counts' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Процент это сотая доля. Чтобы найти процент от числа, умножаем на десятичную дробь. Чтобы узнать, сколько процентов составляет часть, делим её на целое и умножаем на сто.',
        'Опрос: двадцать пять процентов от двухсот это пятьдесят человек.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Foiz yuzdan bir ulush. Sonning foizini topish uchun o'nli kasrga ko'paytiramiz. Qism necha foiz ekanini bilish uchun uni butunga bo'lib yuzga ko'paytiramiz.",
        "So'rovnoma: ikki yuzning yigirma besh foizi ellik kishi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'A percent is a hundredth. To find a percent of a number we multiply by the decimal. To find what percent a part is, we divide it by the whole and multiply by a hundred.',
        'The survey: twenty five percent of two hundred is fifty people.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Через один процент', uz: 'Usul. Bir foiz orqali', en: 'Method. Through one percent' },
    m1_steps: {
      ru: ['Найди 1% — раздели число на 100', 'Умножь на нужное число процентов', 'Проверь: 50% должно дать половину'],
      uz: ["1% ni toping — sonni 100 ga bo'ling", "Kerakli foizga ko'paytiring", 'Tekshiring: 50% yarimni berishi kerak'],
      en: ['Find 1%: divide the number by 100', 'Multiply by the number of percents', 'Check: 50% must give half'],
    },
    m1_no: {
      ru: 'Обратный вопрос решается делением: часть на целое, потом умножить на 100.',
      uz: "Teskari savol bo'lish bilan yechiladi: qismni butunga, keyin 100 ga ko'paytirish.",
      en: 'The reverse question uses division: part by whole, then times 100.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: коридор школы, стенд с итогами опроса.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d21wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d21wall)"/>

    {/* Панель коридора и двери класса */}
    <rect x="0" y="96" width="400" height="8" fill="#E5DAC6"/>
    <g opacity="0.6">
      <rect x="12" y="30" width="46" height="74" rx="3" fill="#D2A96F"/>
      <circle cx="50" cy="70" r="3" fill="#B08A57"/>
      <rect x="342" y="30" width="46" height="74" rx="3" fill="#D2A96F"/>
      <circle cx="350" cy="70" r="3" fill="#B08A57"/>
    </g>

    {/* Стенд: столбики с наклейками, чисел на стенде НЕТ */}
    <g>
      <rect x="96" y="14" width="208" height="86" rx="4" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <path d="M110 88 h180" stroke="#C9A472" strokeWidth="1.6"/>
      {[
        { x: 122, h: 30, fill: '#7ECBE6' },
        { x: 162, h: 48, fill: '#F5C77E' },
        { x: 202, h: 22, fill: '#8FBF7F' },
        { x: 242, h: 16, fill: '#D98A5A' },
      ].map((b) => (
        <rect key={b.x} x={b.x} y={88 - b.h} width="26" height={b.h} rx="2" fill={b.fill} stroke="rgba(90,62,34,0.25)"/>
      ))}
      {/* стикеры-голоса на верхнем поле стенда */}
      <g className="d21-sticker">
        {[112, 132, 152, 172].map((sx, i) => (
          <circle key={sx} cx={sx} cy="24" r="4" fill={['#7ECBE6', '#F5C77E', '#8FBF7F', '#D98A5A'][i]}/>
        ))}
      </g>
    </g>

    {/* Дети у стенда: один клеит наклейку */}
    <Person x={64} ground={130} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={336} ground={130} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <g className="d21-hand">
      <path d="M84 112 l14 -12" stroke="#F1C9A5" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="100" cy="98" r="4" fill="#7ECBE6"/>
    </g>

    {/* Пол и урна */}
    <rect x="0" y="130" width="400" height="24" fill="#D2A96F"/>
    <g>
      <path d="M300 112 h20 l-3 18 h-14 Z" fill="#8E8578"/>
      <path d="M298 112 h24" stroke="#6F6759" strokeWidth="2"/>
    </g>
  </svg>
);

// Итог: квадрат из ста клеток, закрашена четверть, рядом три записи.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g>
      {Array.from({ length: 100 }, (_, i) => {
        const r = Math.floor(i / 10);
        const c = i % 10;
        const on = r < 5 && c < 5;
        return <rect key={i} x={30 + c * 7} y={16 + r * 6} width="6" height="5"
          fill={on ? '#E8A33C' : '#F7F0E2'} stroke="#DCCFB6" strokeWidth="0.5"/>;
      })}
    </g>
    <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="15">
      <text x="200" y="34" textAnchor="middle">25%</text>
      <text x="200" y="56" textAnchor="middle">0,25</text>
      <text x="200" y="78" textAnchor="middle">1 / 4</text>
    </g>
    <g fill="#494550" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="14">
      <text x="330" y="50" textAnchor="middle">200 → 50</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Квадрат ста клеток: закрашено percent клеток. Модель процента.
const Hundred = ({ percent, tone = 'a', size = 'mid' }) => (
  <span className={'d21-hundred d21-hundred-' + size + ' d21-tone-' + tone}>
    {Array.from({ length: 100 }, (_, i) => <i key={i} className={i < percent ? 'on' : ''}/>)}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d21-line d21-fade' + (on ? ' d21-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d21-stage">
        {c.rows.map((r, i) => (
          <span key={i} className={'d21-pairline d21-fade' + (step >= i ? ' d21-on' : '')}>
            <Frac n={r.frac[0]} d={r.frac[1]} size="mid"/>
            <span className="d21-op">=</span>
            <b className="d21-dec">{r.dec}</b>
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

// Ядро: квадрат из ста клеток и три записи одной доли.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d21-stage">
        <div className="d21-row">
          <Hundred percent={step >= 1 ? 25 : 1}/>
          <span className={'d21-three d21-fade' + (step >= 1 ? ' d21-on' : '')}>
            <b>25%</b>
            <b>0,25</b>
            <span className={'d21-fade' + (step >= 2 ? ' d21-on' : '')}><Frac n="1" d="4" size="mid"/></span>
          </span>
        </div>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const HowBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_how;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d21-stage">
        <div className="d21-row">
          <Hundred percent={step >= 2 ? 25 : 0} tone="b"/>
          <span className="d21-table">
            <span className="d21-trow"><b>qism</b><i>30</i></span>
            <span className="d21-trow"><b>butun</b><i>120</i></span>
            <span className="d21-trow"><b>foiz</b><i className={step >= 2 ? 'ok' : 'q'}>{step >= 2 ? '25%' : '?'}</i></span>
          </span>
        </div>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
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
      <div className="frame fade-up delay-1 d21-stage">
        <Hundred percent={step >= 1 ? 75 : 0} tone="ok"/>
        {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Граница: процент это доля, а не количество.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d21-stage">
        <span className="d21-pair d21-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d21-pair d21-pair-good d21-fade' + (step >= 1 ? ' d21-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d21-pair d21-pair-warn d21-fade' + (step >= 2 ? ' d21-on' : '')}>
          <Line node={t(c.more_line)} on/>
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
        <div className={'d21-banner fade-up delay-1' + (phase === 'play' ? ' d21-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d21-stage d21-stage-tool">
          {phase === 'demo' ? (
            <>
              <Hundred percent={shown >= 1 ? 25 : 0} size="sm"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d21-verdict' + (done ? ' d21-verdict-on' : '')}>{done ? mt(t(c.demo_note)) : ''}</p>
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
          <div className="d21-acts fade-up">
            <button className="d21-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d21-btn d21-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenHow = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_how} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <HowBody step={step}/>}/>
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
      <div className="d21-row">
        <Hundred percent={25} size="sm"/>
        <span className="d21-three">
          <b>25%</b>
          <b>0,25</b>
          <Frac n="1" d="4" size="mid"/>
        </span>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenPart = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_part} asideNode={methodAside}/>
);
const ScreenRatio = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_ratio} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: столбики опроса, во втором задании оба предмета.
const TaskFig = ({ idx }) => (
  <div className="d21-task-fig">
    <span className="d21-bars">
      <span className="d21-bar"><i style={{ height: '38%' }} className="a"/><b>25%</b></span>
      <span className="d21-bar"><i style={{ height: '60%' }} className="b"/><b>40%</b></span>
      {idx >= 1 && <span className="d21-bar"><i style={{ height: '52%' }} className="c"/><b>35%</b></span>}
    </span>
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
.d21-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d21-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d21-stage-tool .d21-line { font-size: clamp(12px, 2vw, 16px); }
.d21-row { display: flex; align-items: center; gap: clamp(10px, 2.4vw, 20px); flex-wrap: wrap; justify-content: center; }

/* Квадрат ста клеток */
.d21-hundred { display: grid; grid-template-columns: repeat(10, 1fr); gap: 1px; padding: 2px; border: 2px solid #B08A57; border-radius: 5px; background: #FFFDF7; }
.d21-hundred i { display: block; background: #F7F0E2; transition: background-color 380ms linear; }
.d21-hundred-mid i { width: clamp(8px, 1.8vw, 14px); height: clamp(8px, 1.8vw, 14px); }
.d21-hundred-sm i { width: clamp(5px, 1.2vw, 10px); height: clamp(5px, 1.2vw, 10px); }
.d21-tone-a i.on { background: #E8A33C; }
.d21-tone-b i.on { background: #7ECBE6; }
.d21-tone-ok i.on { background: #7FBF95; }

/* Три записи одной доли */
.d21-three { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.d21-three b { font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 26px); font-weight: 700; color: #1F7A4D; }

/* Таблица «часть, целое, процент» */
.d21-table { display: flex; flex-direction: column; gap: 4px; }
.d21-trow { display: inline-flex; align-items: center; gap: 4px; }
.d21-trow b { min-width: clamp(38px, 7.4vw, 56px); font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 1.9vw, 14px); color: #8A8883; text-align: right; }
.d21-trow i { font-style: normal; display: grid; place-items: center; min-width: clamp(46px, 10vw, 74px); height: clamp(24px, 4.4vw, 34px); border-radius: 8px; background: #F7F0E2; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }
.d21-trow i.q { background: #FBF3D6; border-color: #E4CE93; color: #C99B3A; }
.d21-trow i.ok { background: #E3F0E8; border-color: #A9CFBA; color: #1F7A4D; }

.d21-fade { opacity: 0; transition: opacity 420ms linear; }
.d21-on { opacity: 1; }
.d21-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; }
.d21-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 21px); font-weight: 700; color: #8A8883; }
.d21-dec { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 23px); font-weight: 700; color: #1F7A4D; }
.d21-pairline { display: inline-flex; align-items: center; gap: 9px; }

/* Строки экрана границы */
.d21-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d21-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d21-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d21-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача: столбики */
.d21-task-fig { display: flex; justify-content: center; }
.d21-bars { display: inline-flex; align-items: flex-end; gap: clamp(10px, 2.4vw, 20px); height: clamp(70px, 14vw, 100px); }
.d21-bar { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; gap: 4px; }
.d21-bar i { display: block; width: clamp(22px, 5vw, 36px); border-radius: 3px 3px 0 0; }
.d21-bar i.a { background: #7ECBE6; }
.d21-bar i.b { background: #F5C77E; }
.d21-bar i.c { background: #8FBF7F; }
.d21-bar b { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 2vw, 14px); color: #8A8883; }

/* Экран 4 */
.d21-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d21-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d21-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d21-verdict-on { opacity: 1; }
.d21-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d21-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d21-btn:disabled { opacity: 0.45; cursor: default; }
.d21-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d21-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: рука клеит наклейку, стикеры покачиваются */
.d21-hand { transform-origin: 84px 112px; animation: d21Hand 4200ms ease-in-out infinite; }
@keyframes d21Hand { 0%, 70%, 100% { transform: translate(0, 0); } 85% { transform: translate(4px, -5px); } }
.d21-sticker { animation: d21Sticker 5000ms ease-in-out infinite; }
@keyframes d21Sticker { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2px); } }
@media (prefers-reduced-motion: reduce) { .d21-hand, .d21-sticker { animation: none; } }

@media (max-width: 639.98px) {
  .d21-hundred-mid i { width: 7px; height: 7px; }
  .d21-hundred-sm i { width: 5px; height: 5px; }
  .d21-trow i { min-width: 44px; height: 22px; font-size: 12px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function PercentLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenHow, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenPart, ScreenRatio, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
