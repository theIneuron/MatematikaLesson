// ============================================================
// 6 КЛАСС, УРОК 22 «Задачи на проценты»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок 21 дал сам процент. Здесь появляется изменение величины: на сколько
// процентов выросла или уменьшилась, и как найти целое, зная процент.
// Главное открытие урока — два изменения подряд не складываются.
//
// Сцена — школьный стадион: забег и секундомер.
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
  lessonId: 'grade6-22',
  lessonTitle: {
    ru: 'Задачи на проценты',
    uz: 'Foizga oid masalalar',
    en: 'Percentage word problems',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 stadion: 60 s dan 10 foiz
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 sonning foizi esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 kamaytirish: toping va ayiring
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: oshirish va kamaytirish
  { id: 's_whole',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 foizga ko'ra butunni topish
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: necha foizga
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: ketma-ket o'zgarishlar
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_change', type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 oshirish va kamaytirish x3
  { id: 's_find',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 butunni va foizni topish x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: ko'paydi yoki kamaydi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: stadion
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Круг за 60 секунд', uz: '60 soniyada bir aylana', en: 'A lap in 60 seconds' },
    lead: {
      ru: 'Азиз пробегал круг за 60 секунд. После тренировок он улучшил результат на 10 процентов.',
      uz: "Aziz bir aylanani 60 soniyada yugurardi. Mashqlardan keyin natijasini 10 foizga yaxshiladi.",
      en: 'Aziz used to run a lap in 60 seconds. After training he improved his time by 10 percent.',
    },
    voice_a: { ru: 'Азиз: теперь 50 секунд.', uz: 'Aziz: endi 50 soniya.', en: 'Aziz: now it is 50 seconds.' },
    voice_b: { ru: 'Дилноза: нет, 54.', uz: "Dilnoza: yo'q, 54.", en: 'Dilnoza: no, 54.' },
    ask: { ru: 'Какой стал результат?', uz: 'Natija qanday bo\'ldi?', en: 'What is the new time?' },
    options: [
      { ru: '50 секунд', uz: '50 soniya', en: '50 seconds' },
      { ru: '54 секунды', uz: '54 soniya', en: '54 seconds' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Азиз бегал круг за шестьдесят секунд. После тренировок он улучшил результат на десять процентов.',
          'Азиз говорит, что теперь пробегает за пятьдесят секунд, а Дилноза что за пятьдесят четыре. Какой стал результат? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Aziz bir aylanani oltmish soniyada yugurardi. Mashqlardan keyin natijasini o'n foizga yaxshiladi.",
          "Aziz endi ellik soniyada yuguraman deydi, Dilnoza esa ellik to'rt deydi. Natija qanday bo'ldi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'Aziz ran a lap in sixty seconds. After training he improved his time by ten percent.',
          'Aziz says he now runs it in fifty seconds, Dilnoza says fifty four. What is the new time? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Процент от числа', uz: 'Sonning foizi', en: 'A percent of a number' },
    lines: [
      { ru: '10% от 60 = 60 · 0,1 = 6', uz: "60 ning 10% i = 60 · 0,1 = 6", en: '10% of 60 = 60 · 0.1 = 6' },
      { ru: '1% от 60 = 0,6', uz: "60 ning 1% i = 0,6", en: '1% of 60 = 0.6' },
    ],
    done: {
      ru: 'Проценты считаем от того числа, которое было в начале. Дальше эту часть либо прибавим, либо вычтем.',
      uz: "Foizni boshidagi sondan hisoblaymiz. Keyin bu qismni yo qo'shamiz, yo ayiramiz.",
      en: 'Percents are taken from the starting number. Then that part is either added or subtracted.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Десять процентов от шестидесяти это шесть.',
        'Один процент от шестидесяти это ноль целых шесть десятых.',
        'Сегодня число будет меняться: расти или уменьшаться на столько-то процентов. Считать процент всё равно надо от исходного числа.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Oltmishning o'n foizi olti.",
        "Oltmishning bir foizi nol butun olti o'ndan.",
        "Bugun son o'zgaradi: shuncha foizga oshadi yoki kamayadi. Foizni baribir dastlabki sondan hisoblash kerak.",
      ],
      en: [
        'Recall the last lesson. Ten percent of sixty is six.',
        'One percent of sixty is zero point six.',
        'Today the number will change: growing or shrinking by some percent. The percent is still taken from the starting number.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Уменьшить на 10 процентов', uz: '10 foizga kamaytirish', en: 'Decrease by 10 percent' },
    lines: [
      { ru: '10% от 60 = 6', uz: "60 ning 10% i = 6", en: '10% of 60 = 6' },
      { ru: '60 − 6 = 54 секунды', uz: '60 − 6 = 54 soniya', en: '60 − 6 = 54 seconds' },
      { ru: 'короче: 60 · 0,9 = 54', uz: 'qisqaroq: 60 · 0,9 = 54', en: 'shorter: 60 · 0.9 = 54' },
    ],
    done: {
      ru: 'Уменьшить на 10% значит оставить 90%. Азиз вычел не проценты, а секунды. Результат стал 54 секунды — права была Дилноза.',
      uz: "10 foizga kamaytirish 90 foizni qoldirish demak. Aziz foizni emas, soniyani ayirdi. Natija 54 soniya bo'ldi — Dilnoza haq edi.",
      en: 'Decreasing by 10% means keeping 90%. Aziz subtracted seconds instead of a percent. The result is 54 seconds, so Dilnoza was right.',
    },
    audio: {
      ru: [
        'Считаем по шагам. Десять процентов от шестидесяти это шесть секунд.',
        'Вычитаем эти шесть из шестидесяти и получаем пятьдесят четыре секунды.',
        'Есть путь короче. Если убрали десять процентов, осталось девяносто. Шестьдесят умножить на ноль целых девять десятых это те же пятьдесят четыре. Азиз просто вычел десять секунд вместо десяти процентов. Права была Дилноза.',
      ],
      uz: [
        "Qadamlab hisoblaymiz. Oltmishning o'n foizi olti soniya.",
        "Shu oltini oltmishdan ayiramiz va ellik to'rt soniya chiqadi.",
        "Qisqaroq yo'l ham bor. O'n foiz olib tashlansa, to'qson foiz qoladi. Oltmish karra nol butun to'qqiz o'ndan o'sha ellik to'rt. Aziz o'n foiz o'rniga o'n soniyani ayirdi. Dilnoza haq edi.",
      ],
      en: [
        'Step by step. Ten percent of sixty is six seconds.',
        'Subtract those six from sixty and get fifty four seconds.',
        'There is a shorter route. If ten percent is taken away, ninety percent remains. Sixty times zero point nine is the same fifty four. Aziz simply subtracted ten seconds instead of ten percent. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Увеличить на проценты', uz: 'Foizga oshirish', en: 'Increase by a percent' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'цена 20 000, рост на 15%', uz: "narx 20 000, 15% ga oshdi", en: 'a price of 20,000 grows by 15%' },
      { ru: '15% от 20 000 = 3000', uz: "20 000 ning 15% i = 3000", en: '15% of 20,000 = 3,000' },
      { ru: '20 000 + 3000 = 23 000, или 20 000 · 1,15', uz: '20 000 + 3000 = 23 000, yoki 20 000 · 1,15', en: '20,000 + 3,000 = 23,000, or 20,000 · 1.15' },
    ],
    demo_note: {
      ru: 'Рост на 15% значит 115% от прежнего: умножаем на 1,15. Уменьшение на 15% — умножаем на 0,85.',
      uz: "15% ga o'sish avvalgisining 115% i demak: 1,15 ga ko'paytiramiz. 15% ga kamayish esa 0,85 ga ko'paytirish.",
      en: 'Growth of 15% means 115% of the old value: multiply by 1.15. A 15% drop means multiplying by 0.85.',
    },
    play_ask: { ru: 'Число 40 увеличили на 25%. Что получилось?', uz: '40 soni 25% ga oshirildi. Nima chiqdi?', en: 'The number 40 grew by 25%. What is it now?' },
    play_opts: ['10', '50', '65'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. 25% от 40 это 10, значит 40 + 10 = 50. Или сразу 40 · 1,25.',
      uz: "To'g'ri. 40 ning 25% i 10, demak 40 + 10 = 50. Yoki darrov 40 · 1,25.",
      en: 'Right. 25% of 40 is 10, so 40 + 10 = 50. Or 40 · 1.25 at once.',
    },
    play_wrong: [
      { ru: 'Это сама прибавка, а спрашивают результат.', uz: "Bu qo'shilgan qismning o'zi, savol esa natija haqida.", en: 'That is the increase itself, but the question asks for the result.' },
      null,
      { ru: 'Здесь прибавили 25, а надо 25 процентов, то есть 10.', uz: "Bu yerda 25 qo'shilgan, kerak bo'lgani 25 foiz, ya'ni 10.", en: 'That added 25, but we need 25 percent, which is 10.' },
    ],
    audio: {
      intro: {
        ru: 'Рост считают так же, как уменьшение, только прибавляют. Покажу на цене.',
        uz: "O'sish kamayish kabi hisoblanadi, faqat qo'shiladi. Narx misolida ko'rsataman.",
        en: 'Growth is computed like a decrease, only added. I will show it on a price.',
      },
      demo: {
        ru: 'Цена двадцать тысяч, рост пятнадцать процентов. Пятнадцать процентов это три тысячи. Двадцать три тысячи. Или сразу умножаем на один целый пятнадцать сотых.',
        uz: "Narx yigirma ming, o'sish o'n besh foiz. O'n besh foiz uch ming. Yigirma uch ming. Yoki darrov bir butun o'n besh yuzdanga ko'paytiramiz.",
        en: 'A price of twenty thousand grows fifteen percent. Fifteen percent is three thousand, so twenty three thousand. Or multiply by one point one five at once.',
      },
      play: {
        ru: 'Теперь ваша очередь. Число сорок увеличили на двадцать пять процентов. Что получилось?',
        uz: "Endi sizning navbatingiz. Qirq soni yigirma besh foizga oshirildi. Nima chiqdi?",
        en: 'Now it is your turn. The number forty grew by twenty five percent. What is it now?',
      },
      ok: {
        ru: 'Верно. Двадцать пять процентов от сорока это десять, всего пятьдесят.',
        uz: "To'g'ri. Qirqning yigirma besh foizi o'n, jami ellik.",
        en: 'Right. Twenty five percent of forty is ten, making fifty.',
      },
      wrong: {
        ru: 'Найдите процент от числа и прибавьте его к самому числу.',
        uz: "Sonning foizini toping va uni sonning o'ziga qo'shing.",
        en: 'Find the percent of the number and add it to the number itself.',
      },
    },
  },

  s_whole: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Целое по проценту', uz: 'Foizga ko\'ra butun', en: 'The whole from a percent' },
    lines: [
      { ru: '30 — это 20% числа', uz: '30 — bu sonning 20% i', en: '30 is 20% of a number' },
      { ru: '20% = 0,2, значит 30 : 0,2', uz: '20% = 0,2, demak 30 : 0,2', en: '20% = 0.2, so 30 ÷ 0.2' },
      { ru: '= 150', uz: '= 150', en: '= 150' },
    ],
    done: {
      ru: 'Дана часть — делим на десятичную запись процента. Это то же деление на дробь из урока 13, только процентами.',
      uz: "Qism berilgan — foizning o'nli yozuviga bo'lamiz. Bu 13-darsdagi kasrga bo'lishning o'zi, faqat foizda.",
      en: 'A part is given, so divide by the decimal form of the percent. It is the same division from lesson 13, only with percents.',
    },
    audio: {
      ru: [
        'Третий тип задачи: известна часть и её процент, а найти надо целое.',
        'Тридцать это двадцать процентов числа. Двадцать процентов это ноль целых две десятых.',
        'Делим тридцать на ноль целых две десятых и получаем сто пятьдесят. Проверим: двадцать процентов от ста пятидесяти это тридцать. Сходится.',
      ],
      uz: [
        "Uchinchi turdagi masala: qism va uning foizi ma'lum, butunni topish kerak.",
        "O'ttiz bu sonning yigirma foizi. Yigirma foiz bu nol butun ikki o'ndan.",
        "O'ttizni nol butun ikki o'ndanga bo'lamiz va bir yuz ellik chiqadi. Tekshiramiz: bir yuz ellikning yigirma foizi o'ttiz. To'g'ri keldi.",
      ],
      en: [
        'A third kind of problem: the part and its percent are known and the whole is wanted.',
        'Thirty is twenty percent of a number. Twenty percent is zero point two.',
        'Divide thirty by zero point two and get one hundred fifty. Check: twenty percent of one hundred fifty is thirty. It matches.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Цена упала с 25 000 до 20 000', uz: 'Narx 25 000 dan 20 000 ga tushdi', en: 'The price fell from 25,000 to 20,000' },
    lead: { ru: 'На сколько процентов подешевел товар?', uz: 'Mahsulot necha foizga arzonlashdi?', en: 'By what percent did it get cheaper?' },
    steps: [
      { ru: '25 000 − 20 000 = 5000 — само изменение', uz: "25 000 − 20 000 = 5000 — o'zgarishning o'zi", en: '25,000 − 20,000 = 5,000 is the change itself' },
      { ru: '5000 : 25 000 = 0,2', uz: '5000 : 25 000 = 0,2', en: '5,000 ÷ 25,000 = 0.2' },
      { ru: '0,2 · 100 = 20%', uz: '0,2 · 100 = 20%', en: '0.2 · 100 = 20%' },
    ],
    done: {
      ru: 'Изменение считают от прежней цены, а не от новой. Товар подешевел на 20 процентов.',
      uz: "O'zgarish yangi narxdan emas, avvalgi narxdan hisoblanadi. Mahsulot 20 foizga arzonlashdi.",
      en: 'The change is measured against the old price, not the new one. The item got 20 percent cheaper.',
    },
    audio: {
      ru: [
        'Решаем вместе. Цена упала с двадцати пяти тысяч до двадцати. Сначала найдём само изменение: пять тысяч.',
        'Теперь узнаем, какую часть эти пять тысяч составляют от прежней цены. Делим пять тысяч на двадцать пять тысяч и получаем ноль целых две десятых.',
        'Умножаем на сто: двадцать процентов. Важно: делили именно на старую цену, потому что изменение всегда считают от того, что было.',
      ],
      uz: [
        "Birga yechamiz. Narx yigirma besh mingdan yigirma mingga tushdi. Avval o'zgarishning o'zini topamiz: besh ming.",
        "Endi bu besh ming avvalgi narxning qaysi qismi ekanini bilamiz. Besh mingni yigirma besh mingga bo'lamiz va nol butun ikki o'ndan chiqadi.",
        "Yuzga ko'paytiramiz: yigirma foiz. Muhimi: aynan eski narxga bo'ldik, chunki o'zgarish doim avvalgisidan hisoblanadi.",
      ],
      en: [
        'Let us solve it together. The price fell from twenty five thousand to twenty. First find the change itself: five thousand.',
        'Now see what part five thousand is of the old price. Divide five thousand by twenty five thousand and get zero point two.',
        'Multiply by a hundred: twenty percent. Note that we divided by the old price, because a change is always measured against what was.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Два изменения подряд', uz: "Ketma-ket ikki o'zgarish", en: 'Two changes in a row' },
    up_line: { ru: '100 · 1,1 = 110 — рост на 10%', uz: "100 · 1,1 = 110 — 10% ga o'sish", en: '100 · 1.1 = 110 is a 10% rise' },
    down_line: { ru: '110 · 0,9 = 99 — падение на 10%', uz: '110 · 0,9 = 99 — 10% ga tushish', en: '110 · 0.9 = 99 is a 10% fall' },
    result_line: { ru: 'было 100, стало 99, а не 100', uz: '100 edi, 99 bo\'ldi, 100 emas', en: 'it was 100 and became 99, not 100' },
    done: {
      ru: 'Второй процент считается уже от нового числа, поэтому проценты не складываются и не вычитаются. Каждый шаг — от своего целого.',
      uz: "Ikkinchi foiz allaqachon yangi sondan hisoblanadi, shuning uchun foizlar qo'shilmaydi va ayirilmaydi. Har qadam o'z butunidan.",
      en: 'The second percent is taken from the new number, so percents do not add or subtract. Each step has its own whole.',
    },
    audio: {
      ru: [
        'Самая интересная ошибка темы. Цена выросла на десять процентов, а потом упала на десять процентов. Кажется, что вернулась к прежней.',
        'Проверим. Сто выросло до ста десяти. Теперь десять процентов считаются уже от ста десяти, а это одиннадцать.',
        'Сто десять минус одиннадцать это девяносто девять. Цена стала ниже прежней. Проценты не складываются, потому что каждый раз берутся от нового целого.',
      ],
      uz: [
        "Mavzudagi eng qiziq xato. Narx o'n foizga oshdi, keyin o'n foizga tushdi. Avvalgisiga qaytgandek tuyuladi.",
        "Tekshiramiz. Yuz bir yuz o'ngacha o'sdi. Endi o'n foiz allaqachon bir yuz o'ndan hisoblanadi, bu esa o'n bir.",
        "Bir yuz o'n minus o'n bir to'qson to'qqiz. Narx avvalgisidan pastroq bo'ldi. Foizlar qo'shilmaydi, chunki har safar yangi butundan olinadi.",
      ],
      en: [
        'The most interesting mistake in this topic. A price rises ten percent and then falls ten percent. It seems to come back.',
        'Check it. One hundred grew to one hundred ten. Now ten percent is taken from one hundred ten, which is eleven.',
        'One hundred ten minus eleven is ninety nine. The price ended lower than before. Percents do not add, because each one comes from a new whole.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Три задачи на проценты', uz: 'Foizga oid uch masala', en: 'Three percentage problems' },
    rule_1: {
      ru: 'Увеличить на p процентов — умножить на 1 плюс сотые доли p. Уменьшить — умножить на 1 минус эти доли. Найти целое по части — разделить на десятичную запись процента.',
      uz: "p foizga oshirish — 1 ga p ning yuzdan ulushini qo'shib ko'paytirish. Kamaytirish — o'sha ulushni ayirib ko'paytirish. Qismga ko'ra butunni topish — foizning o'nli yozuviga bo'lish.",
      en: 'To increase by p percent multiply by 1 plus p hundredths. To decrease multiply by 1 minus that. To find the whole from a part divide by the decimal form.',
    },
    rule_2: {
      ru: 'Изменение всегда считают от прежнего значения, а два изменения подряд не складываются. Забег: 60 · 0,9 = 54 секунды. Права была Дилноза.',
      uz: "O'zgarish doim avvalgi qiymatdan hisoblanadi, ketma-ket ikki o'zgarish esa qo'shilmaydi. Yugurish: 60 · 0,9 = 54 soniya. Dilnoza haq edi.",
      en: 'A change is always measured against the previous value, and two changes in a row do not add up. The lap: 60 · 0.9 = 54 seconds. Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Чтобы увеличить число на процент, умножаем его на единицу плюс сотые доли этого процента. Чтобы уменьшить, умножаем на единицу минус эти доли. Если известна часть и её процент, целое находим делением. Изменение всегда считают от прежнего значения, а два изменения подряд не складываются. Вернёмся к забегу. Шестьдесят умножить на ноль целых девять десятых это пятьдесят четыре секунды. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Sonni foizga oshirish uchun uni birga o'sha foizning yuzdan ulushi qo'shilganiga ko'paytiramiz. Kamaytirish uchun birdan shu ulush ayirilganiga ko'paytiramiz. Qism va uning foizi ma'lum bo'lsa, butunni bo'lish bilan topamiz. O'zgarish doim avvalgi qiymatdan hisoblanadi, ketma-ket ikki o'zgarish esa qo'shilmaydi. Yugurishga qaytamiz. Oltmish karra nol butun to'qqiz o'ndan bu ellik to'rt soniya. Dilnoza haq edi.",
      en: 'Let us remember the rule. To increase a number by a percent, multiply by one plus that percent in hundredths. To decrease, multiply by one minus it. If the part and its percent are known, the whole comes from division. A change is always measured against the previous value, and two changes in a row do not add up. Back to the lap. Sixty times zero point nine is fifty four seconds. Dilnoza was right.',
    },
  },

  s_change: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Увеличить и уменьшить', uz: 'Oshirish va kamaytirish', en: 'Increase and decrease' },
    lead: { ru: 'Найди процент от исходного числа и прибавь или вычти.', uz: "Dastlabki sondan foizni toping va qo'shing yoki ayiring.", en: 'Find the percent of the original number and add or subtract.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '200 увеличить на 10%', uz: "200 ni 10% ga oshiring", en: 'Increase 200 by 10%' },
        opts: ['220', '210', '20'],
        correct: 0,
        ok: { ru: 'Верно. 10% это 20, значит 200 + 20 = 220.', uz: "To'g'ri. 10% bu 20, demak 200 + 20 = 220.", en: 'Right. 10% is 20, so 200 + 20 = 220.' },
        wrong: [
          null,
          { ru: 'Прибавили 10, а надо 10 процентов, то есть 20.', uz: "10 qo'shilgan, kerak bo'lgani 10 foiz, ya'ni 20.", en: 'Ten was added, but we need 10 percent, that is 20.' },
          { ru: 'Это сама прибавка, а не результат.', uz: "Bu qo'shilgan qism, natija emas.", en: 'That is the increase, not the result.' },
        ],
      },
      {
        q: { ru: '80 уменьшить на 25%', uz: '80 ni 25% ga kamaytiring', en: 'Decrease 80 by 25%' },
        opts: ['60', '55', '20'],
        correct: 0,
        ok: { ru: 'Верно. 25% это 20, значит 80 − 20 = 60. Или 80 · 0,75.', uz: "To'g'ri. 25% bu 20, demak 80 − 20 = 60. Yoki 80 · 0,75.", en: 'Right. 25% is 20, so 80 − 20 = 60. Or 80 · 0.75.' },
        wrong: [
          null,
          { ru: 'Вычли 25, а надо 25 процентов, то есть 20.', uz: '25 ayirilgan, kerak bo\'lgani 25 foiz, ya\'ni 20.', en: 'Twenty five was subtracted, but 25 percent is 20.' },
          { ru: 'Это сама скидка, а не то, что осталось.', uz: "Bu chegirmaning o'zi, qolgani emas.", en: 'That is the discount itself, not what remains.' },
        ],
      },
      {
        q: { ru: 'Цена 5000 выросла на 20%. Новая цена?', uz: "5000 narx 20% ga oshdi. Yangi narx?", en: 'A price of 5,000 rose by 20%. The new price?' },
        opts: ['6000', '5020', '1000'],
        correct: 0,
        ok: { ru: 'Верно. 20% это 1000, значит 6000. Или 5000 · 1,2.', uz: "To'g'ri. 20% bu 1000, demak 6000. Yoki 5000 · 1,2.", en: 'Right. 20% is 1,000, so 6,000. Or 5,000 · 1.2.' },
        wrong: [
          null,
          { ru: 'Прибавили 20 сумов вместо 20 процентов.', uz: "20 foiz o'rniga 20 so'm qo'shilgan.", en: 'Twenty was added instead of 20 percent.' },
          { ru: 'Это прибавка, а спрашивают новую цену.', uz: "Bu qo'shimcha, savol esa yangi narx haqida.", en: 'That is the increase; the question asks for the new price.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Процент считаем от исходного числа, потом прибавляем или вычитаем.',
        uz: "Mashq. Foizni dastlabki sondan hisoblaymiz, keyin qo'shamiz yoki ayiramiz.",
        en: 'Practice. Take the percent of the original number, then add or subtract.',
      },
    },
  },

  s_find: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Целое и процент изменения', uz: "Butun va o'zgarish foizi", en: 'The whole and the percent of change' },
    lead: { ru: 'Дана часть — делим. Дано изменение — делим на прежнее значение.', uz: "Qism berilgan — bo'lamiz. O'zgarish berilgan — avvalgi qiymatga bo'lamiz.", en: 'A part is given: divide. A change is given: divide by the old value.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '12 — это 30% числа. Какое число?', uz: '12 — bu sonning 30% i. Bu qaysi son?', en: '12 is 30% of a number. Which number?' },
        opts: ['40', '36', '360'],
        correct: 0,
        ok: { ru: 'Верно. 12 : 0,3 = 40.', uz: "To'g'ri. 12 : 0,3 = 40.", en: 'Right. 12 ÷ 0.3 = 40.' },
        wrong: [
          null,
          { ru: 'Здесь умножили на 3, а надо разделить на 0,3.', uz: "Bu yerda 3 ga ko'paytirilgan, kerak bo'lgani 0,3 ga bo'lish.", en: 'That multiplied by 3, but we divide by 0.3.' },
          { ru: 'Слишком много: 30% от 360 это 108.', uz: "Juda ko'p: 360 ning 30% i 108.", en: 'Too much: 30% of 360 is 108.' },
        ],
      },
      {
        q: { ru: 'Было 50, стало 60. На сколько процентов выросло?', uz: '50 edi, 60 bo\'ldi. Necha foizga oshdi?', en: 'From 50 to 60. By what percent did it grow?' },
        opts: ['20%', '10%', '17%'],
        correct: 0,
        ok: { ru: 'Верно. Изменение 10, а 10 : 50 = 0,2, то есть 20%.', uz: "To'g'ri. O'zgarish 10, 10 : 50 = 0,2, ya'ni 20%.", en: 'Right. The change is 10 and 10 ÷ 50 = 0.2, that is 20%.' },
        wrong: [
          null,
          { ru: 'Десять — это само изменение, а не проценты.', uz: "O'n bu o'zgarishning o'zi, foiz emas.", en: 'Ten is the change itself, not the percent.' },
          { ru: 'Так вышло бы при делении на новое значение.', uz: "Bu yangi qiymatga bo'lganda chiqardi.", en: 'That comes from dividing by the new value.' },
        ],
      },
      {
        q: { ru: 'Было 200, стало 150. На сколько процентов упало?', uz: '200 edi, 150 bo\'ldi. Necha foizga tushdi?', en: 'From 200 to 150. By what percent did it fall?' },
        opts: ['25%', '50%', '33%'],
        correct: 0,
        ok: { ru: 'Верно. Изменение 50, а 50 : 200 = 0,25.', uz: "To'g'ri. O'zgarish 50, 50 : 200 = 0,25.", en: 'Right. The change is 50 and 50 ÷ 200 = 0.25.' },
        wrong: [
          null,
          { ru: 'Пятьдесят — это изменение в единицах.', uz: "Ellik bu birlikdagi o'zgarish.", en: 'Fifty is the change in units.' },
          { ru: 'Так вышло бы при делении на 150.', uz: "Bu 150 ga bo'lganda chiqardi.", en: 'That comes from dividing by 150.' },
        ],
      },
      {
        q: { ru: 'От какого числа считают процент изменения?', uz: "O'zgarish foizi qaysi sondan hisoblanadi?", en: 'Which value is a change measured against?' },
        opts: [
          { ru: 'От прежнего значения', uz: 'Avvalgi qiymatdan', en: 'The previous value' },
          { ru: 'От нового значения', uz: 'Yangi qiymatdan', en: 'The new value' },
          { ru: 'От их суммы', uz: "Ularning yig'indisidan", en: 'Their sum' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Поэтому рост на 10% и падение на 10% дают разные числа.', uz: "To'g'ri. Shuning uchun 10% o'sish va 10% tushish har xil son beradi.", en: 'Right. That is why a 10% rise and a 10% fall differ.' },
        wrong: [
          null,
          { ru: 'От нового считают только в редких особых задачах.', uz: 'Yangi qiymatdan faqat kam uchraydigan maxsus masalalarda hisoblanadi.', en: 'The new value is used only in rare special cases.' },
          { ru: 'Сумма здесь ни при чём.', uz: "Yig'indining bunga aloqasi yo'q.", en: 'The sum is irrelevant here.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Помните: изменение делят на прежнее значение.',
        uz: "Mashq. Esda tuting: o'zgarish avvalgi qiymatga bo'linadi.",
        en: 'Practice. Remember: a change is divided by the previous value.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Стало больше или меньше', uz: "Ko'paydi yoki kamaydi", en: 'More or less than before' },
    lead: { ru: 'Множитель больше 1 увеличивает, меньше 1 уменьшает.', uz: "1 dan katta ko'paytuvchi oshiradi, kichigi kamaytiradi.", en: 'A factor above 1 increases, below 1 decreases.' },
    bin_a: { ru: 'Стало больше', uz: "Ko'paydi", en: 'It grew' },
    bin_b: { ru: 'Стало меньше', uz: 'Kamaydi', en: 'It shrank' },
    cards: [
      { label: '· 1,2', bin: 'a' },
      { label: '+ 50%', bin: 'a' },
      { label: '· 1,05', bin: 'a' },
      { label: '· 0,8', bin: 'b' },
      { label: '− 25%', bin: 'b' },
      { label: '· 0,95', bin: 'b' },
    ],
    hint: {
      ru: 'Прибавление процентов даёт множитель больше единицы, вычитание — меньше.',
      uz: "Foiz qo'shilsa ko'paytuvchi birdan katta, ayirilsa kichik bo'ladi.",
      en: 'Adding percents gives a factor above one, subtracting gives one below.',
    },
    correct_text: {
      ru: 'Верно. Рост на 20% это умножение на 1,2, а скидка 20% это умножение на 0,8.',
      uz: "To'g'ri. 20% o'sish 1,2 ga ko'paytirish, 20% chegirma esa 0,8 ga ko'paytirish.",
      en: 'Right. A 20% rise is multiplying by 1.2 and a 20% discount is multiplying by 0.8.',
    },
    audio: {
      intro: {
        ru: 'Разложите записи по двум корзинам. Смотрите на множитель или на знак процента.',
        uz: "Yozuvlarni ikki savatga ajrating. Ko'paytuvchiga yoki foiz belgisiga qarang.",
        en: 'Sort the expressions into two baskets. Look at the factor or the sign.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Сравни множитель с единицей.', uz: "Bu yerga emas. Ko'paytuvchini bir bilan solishtiring.", en: 'Not here. Compare the factor with one.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «Цена выросла на 20%, потом упала на 20%, значит вернулась». Проверь.', uz: "Aziz: «Narx 20% ga oshdi, keyin 20% ga tushdi, demak qaytdi». Tekshiring.", en: 'Aziz: “The price rose 20% and fell 20%, so it is back.” Check it.' },
        opts: [
          { ru: 'Нет: второй процент от нового числа, стало меньше', uz: "Yo'q: ikkinchi foiz yangi sondan, kamaydi", en: 'No: the second percent comes from the new number, so it is lower' },
          { ru: 'Да, вернулась', uz: 'Ha, qaytdi', en: 'Yes, it is back' },
          { ru: 'Нет, стало больше', uz: "Yo'q, ko'paydi", en: 'No, it is higher' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 100 · 1,2 = 120, а 120 · 0,8 = 96.', uz: "To'g'ri. 100 · 1,2 = 120, 120 · 0,8 = 96.", en: 'Right. 100 · 1.2 = 120 and 120 · 0.8 = 96.' },
        wrong: [
          null,
          { ru: 'Проценты берутся от разных чисел, поэтому не гасят друг друга.', uz: "Foizlar har xil sondan olinadi, shuning uchun bir-birini yo'qotmaydi.", en: 'The percents come from different numbers, so they do not cancel.' },
          { ru: 'Наоборот: после падения число меньше прежнего.', uz: "Aksincha: tushishdan keyin son avvalgisidan kichik.", en: 'The opposite: after the fall it is lower than before.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «15 это 25% числа, значит число 15 · 25». Проверь.', uz: "Dilnoza: «15 bu sonning 25% i, demak son 15 · 25». Tekshiring.", en: 'Dilnoza: “15 is 25% of a number, so the number is 15 · 25.” Check it.' },
        opts: [
          { ru: 'Нет: надо 15 : 0,25 = 60', uz: "Yo'q: 15 : 0,25 = 60 bo'lishi kerak", en: 'No: it should be 15 ÷ 0.25 = 60' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, надо 15 · 4 : 100', uz: "Yo'q, 15 · 4 : 100 bo'lishi kerak", en: 'No, it should be 15 · 4 ÷ 100' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Делим на десятичную запись процента: 15 : 0,25 = 60.', uz: "To'g'ri. Foizning o'nli yozuviga bo'lamiz: 15 : 0,25 = 60.", en: 'Right. Divide by the decimal form: 15 ÷ 0.25 = 60.' },
        wrong: [
          null,
          { ru: '15 · 25 это 375, а 25% от 375 не равно 15.', uz: "15 · 25 bu 375, 375 ning 25% i esa 15 emas.", en: '15 · 25 is 375, and 25% of 375 is not 15.' },
          { ru: 'Деление на 100 здесь лишнее: получится 0,6.', uz: "100 ga bo'lish bu yerda ortiqcha: 0,6 chiqadi.", en: 'Dividing by 100 here is wrong: it gives 0.6.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в действии, и в выборе целого.',
        uz: "Birovning yechimini tekshiring. Xato amalda ham, butunni tanlashda ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the operation and in the choice of the whole.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Забег и тренировки', uz: 'Yugurish va mashqlar', en: 'The lap and the training' },
    lead: { ru: 'Азиз пробегал круг за 60 секунд, после тренировок улучшил на 10%.', uz: "Aziz aylanani 60 soniyada yugurardi, mashqlardan keyin 10% ga yaxshiladi.", en: 'Aziz ran a lap in 60 seconds and improved by 10% after training.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какой стал результат?', uz: 'Natija qanday bo\'ldi?', en: 'What is the new time?' },
        opts: ['54 с', '50 с', '66 с'],
        correct: 0,
        ok: { ru: 'Верно. 60 · 0,9 = 54 секунды.', uz: "To'g'ri. 60 · 0,9 = 54 soniya.", en: 'Right. 60 · 0.9 = 54 seconds.' },
        wrong: [
          null,
          { ru: 'Вычли 10 секунд вместо 10 процентов.', uz: "10 foiz o'rniga 10 soniya ayirilgan.", en: 'Ten seconds were subtracted instead of 10 percent.' },
          { ru: 'Результат улучшился, значит время стало меньше.', uz: 'Natija yaxshilandi, demak vaqt kamaydi.', en: 'The time improved, so it went down.' },
        ],
      },
      {
        q: { ru: 'Дилноза бежала за 50 секунд и улучшила на 10%. Её результат?', uz: "Dilnoza 50 soniyada yugurardi va 10% ga yaxshiladi. Uning natijasi?", en: 'Dilnoza ran 50 seconds and improved by 10%. Her time?' },
        opts: ['45 с', '40 с', '54 с'],
        correct: 0,
        ok: { ru: 'Верно. 50 · 0,9 = 45 секунд. Проценты у каждого от своего результата.', uz: "To'g'ri. 50 · 0,9 = 45 soniya. Foiz har kimda o'z natijasidan.", en: 'Right. 50 · 0.9 = 45 seconds. Each percent comes from that person’s own time.' },
        wrong: [
          null,
          { ru: 'Вычли 10 секунд, а надо 10 процентов от 50, то есть 5.', uz: "10 soniya ayirilgan, kerak bo'lgani 50 ning 10 foizi, ya'ni 5.", en: 'Ten seconds were subtracted; 10 percent of 50 is 5.' },
          { ru: 'Это результат Азиза, а у Дилнозы другое исходное число.', uz: "Bu Azizning natijasi, Dilnozada esa boshqa dastlabki son.", en: 'That is Aziz’s time; Dilnoza started from a different number.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про забег. Азиз бегал круг за шестьдесят секунд и улучшил результат на десять процентов.',
        uz: "Yugurish haqida masala. Aziz aylanani oltmish soniyada yugurardi va natijasini o'n foizga yaxshiladi.",
        en: 'A running problem. Aziz ran a lap in sixty seconds and improved by ten percent.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 90,
        q: { ru: 'Число 120 уменьшили на 25%. Что получилось? Набери ответ.', uz: '120 soni 25% ga kamaytirildi. Nima chiqdi? Javobni tering.', en: 'The number 120 was decreased by 25%. Type the result.' },
        hint: { ru: 'Уменьшить на 25% значит оставить 75%: 120 · 0,75.', uz: "25% ga kamaytirish 75% ni qoldirish demak: 120 · 0,75.", en: 'Decreasing by 25% keeps 75%: 120 · 0.75.' },
        hint_audio: { ru: 'Уменьшить на двадцать пять процентов значит оставить семьдесят пять. Сто двадцать умножить на ноль целых семьдесят пять сотых.', uz: "Yigirma besh foizga kamaytirish yetmish beshni qoldirish demak. Bir yuz yigirma karra nol butun yetmish besh yuzdan.", en: 'Decreasing by twenty five percent keeps seventy five. One hundred twenty times zero point seven five.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Цена 8000 выросла на 25%. Новая цена?', uz: "8000 narx 25% ga oshdi. Yangi narx?", en: 'A price of 8,000 rose by 25%. The new price?' },
        opts: ['8025', '2000', '10 000', '6000'],
        wrong: [
          { ru: 'Прибавили 25 сумов вместо 25 процентов.', uz: "25 foiz o'rniga 25 so'm qo'shilgan.", en: 'Twenty five was added instead of 25 percent.' },
          { ru: 'Это сама прибавка.', uz: "Bu qo'shimchaning o'zi.", en: 'That is the increase itself.' },
          null,
          { ru: 'Это цена после скидки, а не после роста.', uz: "Bu chegirmadan keyingi narx, o'sishdan keyingi emas.", en: 'That is the price after a discount, not a rise.' },
        ],
        correct: { ru: 'Верно. 8000 · 1,25 = 10 000.', uz: "To'g'ri. 8000 · 1,25 = 10 000.", en: 'Right. 8,000 · 1.25 = 10,000.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: '24 — это 40% числа. Какое число?', uz: '24 — bu sonning 40% i. Bu qaysi son?', en: '24 is 40% of a number. Which number?' },
        opts: ['9,6', '60', '64', '600'],
        wrong: [
          { ru: 'Это 40% от 24, а надо наоборот.', uz: "Bu 24 ning 40% i, kerak bo'lgani aksincha.", en: 'That is 40% of 24, but we need the reverse.' },
          null,
          { ru: 'Проверь: 40% от 64 это 25,6.', uz: "Tekshiring: 64 ning 40% i 25,6.", en: 'Check: 40% of 64 is 25.6.' },
          { ru: 'В десять раз больше нужного.', uz: "Keragidan o'n barobar ko'p.", en: 'Ten times too much.' },
        ],
        correct: { ru: 'Верно. 24 : 0,4 = 60.', uz: "To'g'ri. 24 : 0,4 = 60.", en: 'Right. 24 ÷ 0.4 = 60.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Было 40, стало 50. На сколько процентов выросло?', uz: '40 edi, 50 bo\'ldi. Necha foizga oshdi?', en: 'From 40 to 50. By what percent did it grow?' },
        opts: ['25%', '20%', '10%', '80%'],
        wrong: [
          null,
          { ru: 'Так вышло бы при делении на 50.', uz: "Bu 50 ga bo'lganda chiqardi.", en: 'That comes from dividing by 50.' },
          { ru: 'Десять — это изменение в единицах.', uz: "O'n bu birlikdagi o'zgarish.", en: 'Ten is the change in units.' },
          { ru: '80% это отношение старого к новому, а не рост.', uz: "80% bu eskining yangiga nisbati, o'sish emas.", en: '80% is the old to new ratio, not the growth.' },
        ],
        correct: { ru: 'Верно. Изменение 10, а 10 : 40 = 0,25.', uz: "To'g'ri. O'zgarish 10, 10 : 40 = 0,25.", en: 'Right. The change is 10 and 10 ÷ 40 = 0.25.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Товар подорожал на 10%, потом подешевел на 10%. Что стало с ценой?', uz: 'Mahsulot 10% ga qimmatlashdi, keyin 10% ga arzonlashdi. Narx bilan nima bo\'ldi?', en: 'An item rose 10% then fell 10%. What happened to the price?' },
        opts: [
          { ru: 'Вернулась к прежней', uz: 'Avvalgisiga qaytdi', en: 'It returned to the original' },
          { ru: 'Стала выше прежней', uz: 'Avvalgisidan yuqori bo\'ldi', en: 'It ended higher' },
          { ru: 'Выросла на 1%', uz: '1% ga oshdi', en: 'It grew by 1%' },
          { ru: 'Стала ниже прежней на 1%', uz: "Avvalgisidan 1% ga past bo'ldi", en: 'It ended 1% lower' },
        ],
        wrong: [
          { ru: 'Проверь на числе 100: получится 99.', uz: '100 sonida tekshiring: 99 chiqadi.', en: 'Check on 100: you get 99.' },
          { ru: 'Наоборот: второе изменение считается от большего числа.', uz: "Aksincha: ikkinchi o'zgarish kattaroq sondan hisoblanadi.", en: 'The opposite: the second change comes from a larger number.' },
          { ru: 'Рост был бы, если бы порядок изменений давал прибавку.', uz: "O'sish bo'lishi uchun o'zgarishlar boshqacha bo'lishi kerak edi.", en: 'Growth would need a different pair of changes.' },
          null,
        ],
        correct: { ru: 'Верно. 100 · 1,1 · 0,9 = 99, то есть на 1% ниже.', uz: "To'g'ri. 100 · 1,1 · 0,9 = 99, ya'ni 1% past.", en: 'Right. 100 · 1.1 · 0.9 = 99, that is 1% lower.' },
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
      ru: 'В банке проценты начисляют на проценты, и вклад растёт быстрее, чем кажется. Есть правило семидесяти двух: разделив 72 на годовой процент, получаешь примерное число лет, за которое сумма удвоится.',
      uz: "Bankda foiz foizga qo'shib hisoblanadi va omonat ko'ringanidan tez o'sadi. Yetmish ikki qoidasi bor: 72 ni yillik foizga bo'lsangiz, summa ikki barobar oshadigan taxminiy yillar soni chiqadi.",
      en: 'Banks add interest on top of interest, so savings grow faster than it seems. There is a rule of seventy two: divide 72 by the yearly percent and you get roughly how many years it takes to double.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? В банке проценты начисляют на проценты, и вклад растёт быстрее, чем кажется. Есть правило семидесяти двух: разделив семьдесят два на годовой процент, получаешь примерное число лет, за которое сумма удвоится.',
      uz: "Bilasizmi? Bankda foiz foizga qo'shib hisoblanadi va omonat ko'ringanidan tez o'sadi. Yetmish ikki qoidasi bor: yetmish ikkini yillik foizga bo'lsangiz, summa ikki barobar oshadigan taxminiy yillar soni chiqadi.",
      en: 'Did you know? Banks add interest on top of interest, so savings grow faster than it seems. There is a rule of seventy two: divide seventy two by the yearly percent and you get roughly how many years it takes to double.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Проценты', uz: 'Matematika · Foizlar', en: 'Mathematics · Percentages' },
    heading: { ru: 'Задачи на проценты', uz: 'Foizga oid masalalar', en: 'Percentage problems' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'рост на p% — умножить на 1 плюс доли', uz: "p% o'sish — 1 ga ulush qo'shib ko'paytirish", en: 'a rise of p%: multiply by 1 plus' },
    brief_2: { ru: 'скидка p% — умножить на 1 минус доли', uz: 'p% chegirma — 1 dan ulush ayirib ko\'paytirish', en: 'a discount of p%: multiply by 1 minus' },
    brief_3: { ru: 'изменение считаем от прежнего числа', uz: "o'zgarishni avvalgi sondan hisoblaymiz", en: 'a change is measured against the old value' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Целое по части', uz: "Qismga ko'ra butun", en: 'Whole from a part' },
    memo_a1: { ru: 'делим на десятичную запись процента', uz: "foizning o'nli yozuviga bo'lamiz", en: 'divide by the decimal form' },
    memo_q2: { ru: 'Процент изменения', uz: "O'zgarish foizi", en: 'Percent of change' },
    memo_a2: { ru: 'изменение делим на прежнее значение', uz: "o'zgarishni avvalgi qiymatga bo'lamiz", en: 'divide the change by the old value' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'складывать проценты двух шагов', uz: "ikki qadam foizini qo'shish", en: 'adding percents of two steps' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Чтобы увеличить на процент, умножаем на единицу плюс сотые доли, а чтобы уменьшить, умножаем на единицу минус эти доли. Целое по части находим делением, а процент изменения получаем, разделив изменение на прежнее значение.',
        'Забег: шестьдесят умножить на ноль целых девять десятых это пятьдесят четыре секунды.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Foizga oshirish uchun birga yuzdan ulush qo'shilganiga, kamaytirish uchun ayirilganiga ko'paytiramiz. Qismga ko'ra butunni bo'lish bilan, o'zgarish foizini esa o'zgarishni avvalgi qiymatga bo'lish bilan topamiz.",
        "Yugurish: oltmish karra nol butun to'qqiz o'ndan bu ellik to'rt soniya.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'To increase by a percent multiply by one plus the hundredths, to decrease by one minus. The whole comes from division, and the percent of change from dividing the change by the old value.',
        'The lap: sixty times zero point nine is fifty four seconds.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Один множитель', uz: "Usul. Bitta ko'paytuvchi", en: 'Method. A single factor' },
    m1_steps: {
      ru: ['Реши, растёт величина или уменьшается', 'Составь множитель: 1 плюс или минус сотые доли процента', 'Умножь и проверь прикидкой'],
      uz: ["Kattalik oshadimi yoki kamayadimi, hal qiling", "Ko'paytuvchi tuzing: 1 ga foiz ulushini qo'shing yoki ayiring", "Ko'paytiring va chamalab tekshiring"],
      en: ['Decide whether the value grows or shrinks', 'Build the factor: 1 plus or minus the percent in hundredths', 'Multiply and check roughly'],
    },
    m1_no: {
      ru: 'Два изменения подряд считают по очереди: сначала первый множитель, потом второй от нового числа.',
      uz: "Ketma-ket ikki o'zgarish navbat bilan hisoblanadi: avval birinchi ko'paytuvchi, keyin yangi sondan ikkinchisi.",
      en: 'Two changes in a row are applied one after another: the first factor, then the second on the new number.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьный стадион. На хуке вопрос, в итоге ответ.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d22sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d22sky)"/>

    {/* Трибуна и флажки */}
    <g opacity="0.7">
      <path d="M0 66 h120 l-10 -20 h-100 Z" fill="#E5DAC6"/>
      {[8, 28, 48, 68, 88].map((sx) => <path key={sx} d={`M${sx} 66 v-16`} stroke="#C9A472" strokeWidth="1.4"/>)}
      <path d="M300 40 h96" stroke="#C9A472" strokeWidth="1.6"/>
      {[308, 332, 356, 380].map((fx, i) => (
        <path key={fx} d={`M${fx} 40 l8 6 l-8 6 Z`} fill={['#E8A33C', '#7ECBE6', '#8FBF7F', '#D98A5A'][i]}/>
      ))}
    </g>

    {/* Беговые дорожки */}
    <g>
      <path d="M40 132 q160 -50 330 -18" fill="none" stroke="#D9603F" strokeWidth="16" opacity="0.5"/>
      <path d="M40 142 q160 -50 330 -18" fill="none" stroke="#D9603F" strokeWidth="16" opacity="0.35"/>
      <path d="M40 132 q160 -50 330 -18" fill="none" stroke="#FFFDF7" strokeWidth="1.6" strokeDasharray="8 10"/>
    </g>

    {/* Секундомер: стрелка идёт, цифр НЕТ */}
    <g>
      <circle cx="200" cy="52" r="26" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2.4"/>
      <rect x="194" y="22" width="12" height="6" rx="2" fill="#8E8578"/>
      {[0, 90, 180, 270].map((a) => {
        const r = (a * Math.PI) / 180;
        return <path key={a} d={`M${200 + 19 * Math.cos(r)} ${52 + 19 * Math.sin(r)} L${200 + 24 * Math.cos(r)} ${52 + 24 * Math.sin(r)}`} stroke="#C9C7C2" strokeWidth="1.8"/>;
      })}
      <g className="d22-hand">
        <path d="M200 52 v-18" stroke="#FF4F28" strokeWidth="2.2" strokeLinecap="round"/>
      </g>
      <circle cx="200" cy="52" r="3" fill="#3B3730"/>
    </g>

    {/* Бегун и тренер с планшетом */}
    <g className="d22-run">
      <Person x={120} ground={126} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    </g>
    <Person x={318} ground={140} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <g>
      <rect x="332" y="112" width="16" height="20" rx="2" fill="#FFFDF7" stroke="#C9A472"/>
      <path d="M335 118 h10 M335 123 h10" stroke="#C9C7C2" strokeWidth="1.4"/>
    </g>

    <rect x="0" y="140" width="400" height="14" fill="#8FBF7F" opacity="0.55"/>
  </svg>
);

// Итог: два времени рядом и множитель между ними.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g>
      <rect x="34" y="24" width="110" height="44" rx="8" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <text x="89" y="54" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">60 s</text>
    </g>
    <g fill="#C99B3A" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
      <text x="200" y="42" textAnchor="middle" fontSize="14">· 0,9</text>
      <text x="200" y="62" textAnchor="middle" fontSize="12">− 10%</text>
    </g>
    <g>
      <rect x="256" y="24" width="110" height="44" rx="8" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2"/>
      <text x="311" y="54" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">54 s</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Полоса величины: было и стало, с подписями.
const Bars = ({ a, b, capA, capB, toneB = 'ok' }) => (
  <span className="d22-bars">
    <span className="d22-bar"><i style={{ width: a }} className="was"/><b>{capA}</b></span>
    <span className="d22-bar"><i style={{ width: b }} className={toneB}/><b>{capB}</b></span>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d22-line d22-fade' + (on ? ' d22-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d22-stage">
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        <span className={'d22-fade' + (step >= 2 ? ' d22-on' : '')}>
          <Bars a={180} b={18} capA="60" capB="6" toneB="part"/>
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

// Ядро: было 60, стало 54 — полоса укорачивается.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d22-stage">
        <Bars a={200} b={step >= 1 ? 180 : 200} capA="60 s" capB={step >= 1 ? '54 s' : '?'}/>
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

const WholeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_whole;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d22-stage">
        <span className="d22-table">
          <span className="d22-trow"><b>qism</b><i>30</i></span>
          <span className="d22-trow"><b>foiz</b><i>20%</i></span>
          <span className="d22-trow"><b>butun</b><i className={step >= 2 ? 'ok' : 'q'}>{step >= 2 ? '150' : '?'}</i></span>
        </span>
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
      <div className="frame fade-up delay-1 d22-stage">
        <Bars a={200} b={160} capA="25 000" capB="20 000"/>
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

// Граница: рост и падение на 10% не гасят друг друга.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d22-stage">
        <span className="d22-chain">
          <i className="d22-node">100</i>
          <span className="d22-arrow">· 1,1</span>
          <i className={'d22-node d22-fade' + (step >= 1 ? ' d22-on' : '')}>110</i>
          <span className={'d22-arrow d22-fade' + (step >= 1 ? ' d22-on' : '')}>· 0,9</span>
          <i className={'d22-node d22-node-res d22-fade' + (step >= 2 ? ' d22-on' : '')}>99</i>
        </span>
        <span className="d22-pair d22-pair-up"><Line node={t(c.up_line)} on/></span>
        <span className={'d22-pair d22-pair-down d22-fade' + (step >= 1 ? ' d22-on' : '')}>
          <Line node={t(c.down_line)} on/>
        </span>
        <span className={'d22-pair d22-pair-bad d22-fade' + (step >= 2 ? ' d22-on' : '')}>
          <Line node={t(c.result_line)} on/>
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
        <div className={'d22-banner fade-up delay-1' + (phase === 'play' ? ' d22-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d22-stage d22-stage-tool">
          {phase === 'demo' ? (
            <>
              <Bars a={150} b={done ? 173 : 150} capA="20 000" capB={done ? '23 000' : '?'}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d22-verdict' + (done ? ' d22-verdict-on' : '')}>{done ? mt(t(c.demo_note)) : ''}</p>
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
          <div className="d22-acts fade-up">
            <button className="d22-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d22-btn d22-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenWhole = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_whole} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <WholeBody step={step}/>}/>
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
      <div className="d22-stage">
        <Bars a={190} b={171} capA="60 s" capB="54 s"/>
        <span className="d22-chain">
          <i className="d22-node">60</i>
          <span className="d22-arrow">· 0,9</span>
          <i className="d22-node d22-node-res">54</i>
        </span>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenChange = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_change} asideNode={methodAside}/>
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

// Задача: два бегуна, у каждого своё исходное время.
const TaskFig = ({ idx }) => (
  <div className="d22-task-fig">
    {idx >= 1
      ? <Bars a={160} b={144} capA="50 s" capB="?"/>
      : <Bars a={190} b={171} capA="60 s" capB="?"/>}
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
.d22-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d22-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d22-stage-tool .d22-line { font-size: clamp(12px, 2vw, 16px); }

/* Полосы «было и стало» */
.d22-bars { display: flex; flex-direction: column; gap: 7px; width: 100%; }
.d22-bar { display: flex; align-items: center; gap: 10px; }
.d22-bar i { display: block; height: clamp(18px, 3.2vw, 26px); border-radius: 4px; transition: width 600ms ease; max-width: 78%; }
.d22-bar i.was { background: #C9C7C2; }
.d22-bar i.ok { background: #7FBF95; }
.d22-bar i.part { background: #F5C77E; }
.d22-bar b { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }

/* Цепочка изменений */
.d22-chain { display: inline-flex; align-items: center; gap: 7px; flex-wrap: wrap; justify-content: center; }
.d22-node { font-style: normal; display: grid; place-items: center; min-width: clamp(42px, 9vw, 66px); height: clamp(30px, 5.2vw, 42px); border-radius: 9px; background: #F7F0E2; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 21px); font-weight: 700; color: #494550; }
.d22-node-res { background: #E3F0E8; border-color: #A9CFBA; color: #1F7A4D; }
.d22-arrow { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.2vw, 16px); font-weight: 700; color: #C99B3A; }

/* Таблица «часть, процент, целое» */
.d22-table { display: flex; flex-direction: column; gap: 4px; }
.d22-trow { display: inline-flex; align-items: center; gap: 4px; }
.d22-trow b { min-width: clamp(38px, 7.4vw, 56px); font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 1.9vw, 14px); color: #8A8883; text-align: right; }
.d22-trow i { font-style: normal; display: grid; place-items: center; min-width: clamp(46px, 10vw, 74px); height: clamp(24px, 4.4vw, 34px); border-radius: 8px; background: #F7F0E2; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }
.d22-trow i.q { background: #FBF3D6; border-color: #E4CE93; color: #C99B3A; }
.d22-trow i.ok { background: #E3F0E8; border-color: #A9CFBA; color: #1F7A4D; }

.d22-fade { opacity: 0; transition: opacity 420ms linear; }
.d22-on { opacity: 1; }
.d22-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; }

/* Строки экрана границы */
.d22-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d22-pair-up { background: #E7F5FA; border: 1px solid #B6DCEA; }
.d22-pair-down { background: #FBF3D6; border: 1px solid #E4CE93; }
.d22-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }

/* Задача */
.d22-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d22-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d22-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d22-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d22-verdict-on { opacity: 1; }
.d22-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d22-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d22-btn:disabled { opacity: 0.45; cursor: default; }
.d22-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d22-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: стрелка секундомера и бегун */
.d22-hand { transform-origin: 200px 52px; animation: d22Hand 4000ms linear infinite; }
@keyframes d22Hand { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.d22-run { animation: d22Run 5600ms ease-in-out infinite; }
@keyframes d22Run { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(40px); } }
@media (prefers-reduced-motion: reduce) { .d22-hand, .d22-run { animation: none; } }

@media (max-width: 639.98px) {
  .d22-trow i { min-width: 44px; height: 22px; font-size: 12px; }
  .d22-node { min-width: 38px; height: 28px; font-size: 14px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function PercentProblemsLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenWhole, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenChange, ScreenFind, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
