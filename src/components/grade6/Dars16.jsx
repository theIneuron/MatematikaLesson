// ============================================================
// 6 КЛАСС, УРОК 16 «Задачи на дроби и десятичные»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок закрывает блок Б3 и весь путь по дробям: новых правил здесь нет,
// новое только одно — план решения задачи. Главный вопрос ученика теперь
// не «как считать», а «что дано: целое или часть».
//
// Сцена — касса музея: класс покупает билеты на экскурсию.
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
  lessonId: 'grade6-16',
  lessonTitle: {
    ru: 'Задачи на дроби и десятичные дроби',
    uz: "Kasrlar va o'nli kasrlarga oid masalalar",
    en: 'Word problems with fractions and decimals',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 muzey kassasi: 1/5 chegirma
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 ikki teskari amal esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 masala rejasi: uch qadam
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: chegirma masalasi
  { id: 's_dec',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 o'nli kasr bilan bir xil reja
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: avtobus
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: qism qaysi butundan
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_part',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 qismni topish x3
  { id: 's_whole',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 butunni topish x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: natija katta yoki kichik
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: ekskursiya
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: { ru: 'Билеты со скидкой', uz: 'Chegirmali chiptalar', en: 'Tickets with a discount' },
    lead: {
      ru: 'Класс идёт в музей. Билет стоит 12 500 сум, школьникам скидка 1/5 цены.',
      uz: "Sinf muzeyga boryapti. Chipta 12 500 so'm, o'quvchilarga narxning 1/5 qismi chegirma.",
      en: 'The class is going to a museum. A ticket costs 12,500 and students get 1/5 off.',
    },
    voice_a: { ru: 'Азиз: заплатим 11 000.', uz: "Aziz: 11 000 to'laymiz.", en: 'Aziz: we pay 11,000.' },
    voice_b: { ru: 'Дилноза: нет, 10 000.', uz: "Dilnoza: yo'q, 10 000.", en: 'Dilnoza: no, 10,000.' },
    ask: { ru: 'Сколько платить за один билет?', uz: "Bitta chipta uchun qancha to'lanadi?", en: 'How much for one ticket?' },
    options: [
      { ru: '11 000 сум', uz: "11 000 so'm", en: '11,000' },
      { ru: '10 000 сум', uz: "10 000 so'm", en: '10,000' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Класс идёт на экскурсию в музей. Билет стоит двенадцать тысяч пятьсот сумов, а школьникам дают скидку в одну пятую цены.',
          'Азиз считает, что платить надо одиннадцать тысяч, а Дилноза что десять тысяч. Сколько платить за один билет? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Sinf muzeyga ekskursiyaga boryapti. Chipta o'n ikki ming besh yuz so'm, o'quvchilarga esa narxning beshdan bir qismi chegirma beriladi.",
          "Aziz o'n bir ming to'lash kerak deb hisoblaydi, Dilnoza esa o'n ming deydi. Bitta chipta uchun qancha to'lanadi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The class is going on a museum trip. A ticket costs twelve thousand five hundred and students get one fifth off the price.',
          'Aziz thinks they pay eleven thousand, Dilnoza says ten thousand. How much for one ticket? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Два обратных действия', uz: 'Ikki teskari amal', en: 'Two opposite actions' },
    left_q: { ru: 'Дано целое 20, найти 3/4', uz: 'Butun 20 berilgan, 3/4 qismini topish', en: 'The whole is 20, find 3/4' },
    left_a: { ru: '20 · 3/4 = 15', uz: '20 · 3/4 = 15', en: '20 · 3/4 = 15' },
    right_q: { ru: 'Дана часть 15, это 3/4. Найти целое', uz: 'Qism 15 berilgan, bu 3/4. Butunni topish', en: 'The part is 15 and it is 3/4. Find the whole' },
    right_a: { ru: '15 : 3/4 = 20', uz: '15 : 3/4 = 20', en: '15 ÷ 3/4 = 20' },
    done: {
      ru: 'Это весь инструмент урока. Осталось научиться выбирать, какое из двух действий нужно в задаче.',
      uz: "Bu darsning butun asbobi. Endi masalada ikkalasidan qaysi biri kerakligini tanlashni o'rganamiz.",
      en: 'That is the whole toolkit. What remains is choosing which of the two a problem needs.',
    },
    audio: {
      ru: [
        'Вспомним два действия из прошлых уроков. Если дано целое и нужна его часть, мы умножаем.',
        'Двадцать умножить на три четвёртых пятнадцать.',
        'Если дана часть и нужно целое, мы делим. Пятнадцать разделить на три четвёртых двадцать. Сегодня главная работа не считать, а выбирать между этими двумя действиями.',
      ],
      uz: [
        "O'tgan darslardagi ikki amalni eslaymiz. Butun berilgan bo'lib, uning qismi kerak bo'lsa, ko'paytiramiz.",
        "Yigirma karra uch to'rtdan o'n besh.",
        "Qism berilgan bo'lib, butun kerak bo'lsa, bo'lamiz. O'n beshni uch to'rtdanga bo'lsak yigirma. Bugungi asosiy ish hisoblash emas, shu ikki amaldan birini tanlash.",
      ],
      en: [
        'Recall the two actions from earlier lessons. If the whole is given and a part is needed, we multiply.',
        'Twenty times three quarters is fifteen.',
        'If the part is given and the whole is needed, we divide. Fifteen divided by three quarters is twenty. Today the main work is not computing but choosing between these two.',
      ],
    },
  },

  s_core: {
    title: { ru: 'План решения из трёх шагов', uz: 'Uch qadamli yechim rejasi', en: 'A three step plan' },
    steps: [
      { ru: 'Что дано: целое или часть?', uz: 'Nima berilgan: butunmi yoki qism?', en: 'What is given: the whole or a part?' },
      { ru: 'Выбираем действие: умножить или разделить', uz: "Amalni tanlaymiz: ko'paytirish yoki bo'lish", en: 'Choose the action: multiply or divide' },
      { ru: 'Прикидываем ответ и проверяем', uz: 'Javobni chamalaymiz va tekshiramiz', en: 'Estimate the answer and check' },
    ],
    demo: [
      { ru: 'Билет 12 500, скидка 1/5 — это часть цены', uz: "Chipta 12 500, chegirma 1/5 — bu narxning qismi", en: 'Ticket 12,500 and the discount 1/5 is a part of the price' },
      { ru: '12 500 · 1/5 = 2500 — размер скидки', uz: '12 500 · 1/5 = 2500 — chegirma miqdori', en: '12,500 · 1/5 = 2,500 is the discount' },
      { ru: '12 500 − 2500 = 10 000', uz: '12 500 − 2500 = 10 000', en: '12,500 − 2,500 = 10,000' },
    ],
    done: {
      ru: 'Цена известна, значит скидку находим умножением, а потом вычитаем её. Платить надо 10 000 сум — права была Дилноза.',
      uz: "Narx ma'lum, demak chegirmani ko'paytirib topamiz, keyin uni ayiramiz. 10 000 so'm to'lash kerak — Dilnoza haq edi.",
      en: 'The price is known, so the discount comes from multiplying and is then subtracted. You pay 10,000 — Dilnoza was right.',
    },
    audio: {
      ru: [
        'В задаче на дроби всегда начинают с одного вопроса: что дано, целое или часть?',
        'Здесь известна вся цена, двенадцать тысяч пятьсот, а скидка это её часть. Значит умножаем: двенадцать тысяч пятьсот умножить на одну пятую две тысячи пятьсот.',
        'Но вопрос был не о скидке, а о том, сколько платить. Вычитаем скидку из цены и получаем десять тысяч. Права была Дилноза.',
      ],
      uz: [
        "Kasrga oid masalada har doim bitta savoldan boshlanadi: nima berilgan, butunmi yoki qism?",
        "Bu yerda butun narx ma'lum, o'n ikki ming besh yuz, chegirma esa uning qismi. Demak ko'paytiramiz: o'n ikki ming besh yuz karra beshdan bir ikki ming besh yuz.",
        "Lekin savol chegirma haqida emas, qancha to'lash haqida edi. Chegirmani narxdan ayiramiz va o'n ming chiqadi. Dilnoza haq edi.",
      ],
      en: [
        'A fraction problem always starts with one question: is the whole given or a part?',
        'Here the full price is known, twelve thousand five hundred, and the discount is a part of it. So we multiply: twelve thousand five hundred times one fifth is two thousand five hundred.',
        'But the question was not about the discount, it was about what to pay. Subtract the discount from the price and get ten thousand. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Задача со скидкой', uz: 'Chegirmali masala', en: 'A discount problem' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'дано целое: 12 500', uz: 'butun berilgan: 12 500', en: 'the whole is given: 12,500' },
      { ru: 'скидка 1/5 → 12 500 · 1/5 = 2500', uz: 'chegirma 1/5 → 12 500 · 1/5 = 2500', en: 'discount 1/5 → 12,500 · 1/5 = 2,500' },
      { ru: 'платим 12 500 − 2500 = 10 000', uz: "to'laymiz 12 500 − 2500 = 10 000", en: 'we pay 12,500 − 2,500 = 10,000' },
    ],
    demo_note: {
      ru: 'Можно короче: платим 4/5 цены, значит 12 500 · 4/5 = 10 000. Оба пути дают одно и то же.',
      uz: "Qisqaroq yo'l ham bor: narxning 4/5 qismini to'laymiz, ya'ni 12 500 · 4/5 = 10 000. Ikkala yo'l ham bir xil natija beradi.",
      en: 'A shorter route: you pay 4/5 of the price, so 12,500 · 4/5 = 10,000. Both routes agree.',
    },
    play_ask: { ru: 'Блокнот стоит 8000 сум, скидка 1/4. Сколько платить?', uz: "Bloknot 8000 so'm, chegirma 1/4. Qancha to'lanadi?", en: 'A notebook costs 8,000 with 1/4 off. What do you pay?' },
    play_opts: ['2000', '6000', '7000'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. Скидка 8000 · 1/4 = 2000, платим 8000 − 2000 = 6000. Или сразу 8000 · 3/4.',
      uz: "To'g'ri. Chegirma 8000 · 1/4 = 2000, to'laymiz 8000 − 2000 = 6000. Yoki darrov 8000 · 3/4.",
      en: 'Right. The discount is 8,000 · 1/4 = 2,000, so you pay 8,000 − 2,000 = 6,000. Or 8,000 · 3/4 at once.',
    },
    play_wrong: [
      { ru: 'Это размер скидки, а спрашивают, сколько платить.', uz: "Bu chegirma miqdori, savol esa qancha to'lash haqida.", en: 'That is the discount itself, but the question is what you pay.' },
      null,
      { ru: 'Скидка четверть, а не восьмая часть: 8000 : 4 = 2000.', uz: "Chegirma chorak, sakkizdan bir emas: 8000 : 4 = 2000.", en: 'The discount is a quarter, not an eighth: 8,000 ÷ 4 = 2,000.' },
    ],
    audio: {
      intro: {
        ru: 'Разберём задачу со скидкой по плану. Сначала смотрим, что дано, потом выбираем действие, потом проверяем ответ прикидкой.',
        uz: "Chegirmali masalani reja bo'yicha ko'ramiz. Avval nima berilganiga qaraymiz, keyin amalni tanlaymiz, so'ng javobni chamalab tekshiramiz.",
        en: 'Let us work a discount problem by the plan. First see what is given, then choose the action, then check the answer roughly.',
      },
      demo: {
        ru: 'Цена известна целиком, скидка это её часть, поэтому умножаем и получаем две тысячи пятьсот. Платить надо десять тысяч.',
        uz: "Narx to'liq ma'lum, chegirma uning qismi, shuning uchun ko'paytiramiz va ikki ming besh yuz chiqadi. To'lash kerak bo'lgani o'n ming.",
        en: 'The full price is known and the discount is a part of it, so we multiply and get two thousand five hundred. The amount to pay is ten thousand.',
      },
      play: {
        ru: 'Теперь ваша очередь. Блокнот стоит восемь тысяч сумов, скидка одна четвёртая. Сколько платить?',
        uz: "Endi sizning navbatingiz. Bloknot sakkiz ming so'm, chegirma bir to'rtdan. Qancha to'lanadi?",
        en: 'Now it is your turn. A notebook costs eight thousand with a quarter off. What do you pay?',
      },
      ok: {
        ru: 'Верно. Скидка две тысячи, платить шесть тысяч.',
        uz: "To'g'ri. Chegirma ikki ming, to'lash olti ming.",
        en: 'Right. The discount is two thousand and you pay six thousand.',
      },
      wrong: {
        ru: 'Сначала найдите скидку, а потом вычтите её из цены.',
        uz: "Avval chegirmani toping, keyin uni narxdan ayiring.",
        en: 'First find the discount, then subtract it from the price.',
      },
    },
  },

  s_dec: {
    title: { ru: 'С десятичными план тот же', uz: "O'nli kasrlarda reja o'sha", en: 'The same plan with decimals' },
    lines: [
      { ru: 'дано целое 250, найти 0,4 → 250 · 0,4 = 100', uz: 'butun 250 berilgan, 0,4 qismi → 250 · 0,4 = 100', en: 'whole 250, find 0.4 → 250 · 0.4 = 100' },
      { ru: 'дана часть 100, это 0,4 → 100 : 0,4 = 250', uz: 'qism 100 berilgan, bu 0,4 → 100 : 0,4 = 250', en: 'part 100 which is 0.4 → 100 ÷ 0.4 = 250' },
    ],
    done: {
      ru: '0,4 — это те же 2/5. Запись другая, а выбор действия прежний: целое дано — умножаем, часть дана — делим.',
      uz: "0,4 bu o'sha 2/5. Yozuv boshqa, amal tanlash esa o'sha: butun berilgan bo'lsa ko'paytiramiz, qism berilgan bo'lsa bo'lamiz.",
      en: '0.4 is the same as 2/5. The notation differs, the choice does not: whole given means multiply, part given means divide.',
    },
    audio: {
      ru: [
        'Десятичная дробь ничего не меняет в плане. Ноль целых четыре десятых это те же две пятых.',
        'Если известно целое двести пятьдесят, умножаем и получаем сто.',
        'Если известна часть сто, делим на ноль целых четыре десятых и получаем двести пятьдесят. Действие выбирают по условию, а не по виду записи.',
      ],
      uz: [
        "O'nli kasr rejada hech nimani o'zgartirmaydi. Nol butun to'rt o'ndan bu o'sha ikki beshdan.",
        "Butun ikki yuz ellik ma'lum bo'lsa, ko'paytiramiz va yuz chiqadi.",
        "Qism yuz ma'lum bo'lsa, nol butun to'rt o'ndanga bo'lamiz va ikki yuz ellik chiqadi. Amal shartga qarab tanlanadi, yozuv ko'rinishiga qarab emas.",
      ],
      en: [
        'A decimal changes nothing in the plan. Zero point four is the same as two fifths.',
        'If the whole two hundred fifty is known, multiply and get one hundred.',
        'If the part one hundred is known, divide by zero point four and get two hundred fifty. The action follows the wording, not the notation.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Автобус на экскурсию', uz: 'Ekskursiya avtobusi', en: 'The trip bus' },
    lead: { ru: 'В автобусе 40 мест. Заняли 3/5, потом села ещё половина оставшихся.', uz: "Avtobusda 40 joy bor. 3/5 qismi band bo'ldi, keyin qolganlarning yarmi o'tirdi.", en: 'The bus has 40 seats. 3/5 were taken, then half the rest sat down.' },
    steps: [
      { ru: '40 · 3/5 = 24 заняты', uz: '40 · 3/5 = 24 band', en: '40 · 3/5 = 24 taken' },
      { ru: '40 − 24 = 16 осталось, 16 · 1/2 = 8', uz: '40 − 24 = 16 qoldi, 16 · 1/2 = 8', en: '40 − 24 = 16 left, 16 · 1/2 = 8' },
      { ru: 'свободно 16 − 8 = 8 мест', uz: "bo'sh 16 − 8 = 8 joy", en: '16 − 8 = 8 seats free' },
    ],
    done: {
      ru: 'Каждый раз новая часть считается от нового целого: сначала от 40, потом от 16. Свободных мест осталось 8.',
      uz: "Har safar yangi qism yangi butundan hisoblanadi: avval 40 dan, keyin 16 dan. Bo'sh joy 8 ta qoldi.",
      en: 'Each new part is taken from a new whole: first from 40, then from 16. Eight seats remain free.',
    },
    audio: {
      ru: [
        'Решаем вместе. В автобусе сорок мест, заняли три пятых. Целое известно, значит умножаем: сорок умножить на три пятых двадцать четыре.',
        'Свободными остались шестнадцать мест. Потом села половина оставшихся, то есть половина от шестнадцати, а это восемь.',
        'Свободных осталось шестнадцать минус восемь, то есть восемь мест. Обратите внимание: вторая половина считалась не от сорока, а от шестнадцати.',
      ],
      uz: [
        "Birga yechamiz. Avtobusda qirq joy bor, uch beshdan qismi band bo'ldi. Butun ma'lum, demak ko'paytiramiz: qirq karra uch beshdan yigirma to'rt.",
        "Bo'sh o'n olti joy qoldi. Keyin qolganlarning yarmi o'tirdi, ya'ni o'n oltining yarmi, bu esa sakkiz.",
        "Bo'sh joy o'n olti minus sakkiz, ya'ni sakkizta qoldi. Diqqat qiling: ikkinchi yarim qirqdan emas, o'n oltidan hisoblandi.",
      ],
      en: [
        'Let us solve it together. The bus has forty seats and three fifths were taken. The whole is known, so multiply: forty times three fifths is twenty four.',
        'Sixteen seats were free. Then half of the remaining ones sat down, that is half of sixteen, which is eight.',
        'Free seats are sixteen minus eight, that is eight. Notice that the second half was taken from sixteen, not from forty.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Часть — всегда от какого-то целого', uz: 'Qism har doim qaysidir butundan', en: 'A part always belongs to some whole' },
    bad_line: { ru: 'ошибка: 40 · 1/2 = 20 свободных', uz: "xato: 40 · 1/2 = 20 bo'sh joy", en: 'mistake: 40 · 1/2 = 20 free seats' },
    good_line: { ru: 'верно: 16 · 1/2 = 8, целое здесь 16', uz: "to'g'ri: 16 · 1/2 = 8, bu yerda butun 16", en: 'right: 16 · 1/2 = 8, the whole here is 16' },
    add_line: { ru: 'и проверка: ответ не может быть больше целого', uz: "va tekshiruv: javob butundan katta bo\'lolmaydi", en: 'and a check: the answer cannot exceed the whole' },
    done: {
      ru: 'Прежде чем считать долю, скажи вслух, от чего она берётся. Половина класса и половина автобуса — разные числа.',
      uz: "Ulushni hisoblashdan oldin u nimadan olinishini ovoz chiqarib ayting. Sinfning yarmi va avtobusning yarmi har xil sonlar.",
      en: 'Before computing a share, say out loud what it is a share of. Half a class and half a bus are different numbers.',
    },
    audio: {
      ru: [
        'Самая частая ошибка в задачах на дроби это потерять целое. Половину оставшихся мест считают от всего автобуса.',
        'Но целое поменялось: осталось шестнадцать мест, и половина берётся именно от них. Получается восемь, а не двадцать.',
        'Поэтому перед вычислением полезно сказать вслух: половина от чего. И проверить ответ: часть никогда не больше своего целого.',
      ],
      uz: [
        "Kasrga oid masalalardagi eng ko'p uchraydigan xato butunni yo'qotish. Qolgan joylarning yarmini butun avtobusdan hisoblashadi.",
        "Lekin butun o'zgardi: o'n olti joy qoldi va yarim aynan shulardan olinadi. Sakkiz chiqadi, yigirma emas.",
        "Shuning uchun hisoblashdan oldin ovoz chiqarib aytish foydali: nimaning yarmi. Va javobni tekshiring: qism hech qachon o'z butunidan katta emas.",
      ],
      en: [
        'The most common mistake in fraction problems is losing track of the whole. Half of the remaining seats gets computed from the whole bus.',
        'But the whole changed: sixteen seats remain and the half is taken from those. That gives eight, not twenty.',
        'So before computing it helps to say out loud: half of what. And check the answer: a part is never larger than its whole.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'План решения задачи', uz: 'Masala yechish rejasi', en: 'The plan for a word problem' },
    rule_1: {
      ru: 'Найди в условии целое. Если нужна его часть — умножай на дробь. Если целое неизвестно, а часть дана — дели на дробь.',
      uz: "Shartdan butunni toping. Uning qismi kerak bo'lsa — kasrga ko'paytiring. Butun noma'lum bo'lib, qism berilgan bo'lsa — kasrga bo'ling.",
      en: 'Find the whole in the problem. If a part of it is needed, multiply by the fraction. If the whole is unknown and a part is given, divide by the fraction.',
    },
    rule_2: {
      ru: 'После каждого шага целое может смениться. Проверяй ответ прикидкой. Билеты: 12 500 · 4/5 = 10 000 сум, права была Дилноза.',
      uz: "Har qadamdan keyin butun o'zgarishi mumkin. Javobni chamalab tekshiring. Chiptalar: 12 500 · 4/5 = 10 000 so'm, Dilnoza haq edi.",
      en: 'After each step the whole may change. Check the answer roughly. The tickets: 12,500 · 4/5 = 10,000, Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним план. Сначала находим в условии целое. Если нужна его часть, умножаем на дробь, а если целое неизвестно и дана часть, делим на дробь. После каждого шага целое может смениться, поэтому спрашивайте себя, от чего берётся доля. И всегда проверяйте ответ прикидкой. Вернёмся к билетам. Двенадцать тысяч пятьсот умножить на четыре пятых это десять тысяч сумов. Права была Дилноза.',
      uz: "Rejani eslab qolamiz. Avval shartdan butunni topamiz. Uning qismi kerak bo'lsa kasrga ko'paytiramiz, butun noma'lum bo'lib qism berilgan bo'lsa kasrga bo'lamiz. Har qadamdan keyin butun o'zgarishi mumkin, shuning uchun o'zingizdan so'rang: ulush nimadan olinyapti. Va javobni doim chamalab tekshiring. Chiptalarga qaytamiz. O'n ikki ming besh yuz karra to'rt beshdan bu o'n ming so'm. Dilnoza haq edi.",
      en: 'Let us remember the plan. First find the whole in the problem. If a part of it is needed, multiply by the fraction; if the whole is unknown and a part is given, divide by it. After each step the whole may change, so ask yourself what the share is taken from. And always check the answer roughly. Back to the tickets. Twelve thousand five hundred times four fifths is ten thousand. Dilnoza was right.',
    },
  },

  s_part: {
    title: { ru: 'Найти часть', uz: 'Qismni topish', en: 'Find the part' },
    lead: { ru: 'Целое известно — значит умножаем.', uz: "Butun ma'lum — demak ko'paytiramiz.", en: 'The whole is known, so multiply.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'В классе 28 учеников, 3/7 из них мальчики. Сколько мальчиков?', uz: "Sinfda 28 o'quvchi bor, 3/7 qismi o'g'il bolalar. Nechta o'g'il bola?", en: 'A class of 28 with 3/7 boys. How many boys?' },
        opts: ['12', '4', '21'],
        correct: 0,
        ok: { ru: 'Верно. 28 : 7 = 4, и 4 · 3 = 12.', uz: "To'g'ri. 28 : 7 = 4, va 4 · 3 = 12.", en: 'Right. 28 ÷ 7 = 4 and 4 · 3 = 12.' },
        wrong: [
          null,
          { ru: '4 — это одна седьмая, а мальчиков три седьмых.', uz: "4 bu bir yettidan, o'g'il bolalar esa uch yettidan.", en: 'Four is one seventh, and the boys are three sevenths.' },
          { ru: '21 — это 3/4 класса, а не 3/7.', uz: "21 bu sinfning 3/4 qismi, 3/7 emas.", en: 'Twenty one is 3/4 of the class, not 3/7.' },
        ],
      },
      {
        q: { ru: 'Экскурсия стоит 60 000 сум. Оплатили 0,3. Сколько это?', uz: "Ekskursiya 60 000 so'm. 0,3 qismi to'landi. Bu qancha?", en: 'A trip costs 60,000 and 0.3 has been paid. How much is that?' },
        opts: ['18 000', '6000', '20 000'],
        correct: 0,
        ok: { ru: 'Верно. 60 000 · 0,3 = 18 000.', uz: "To'g'ri. 60 000 · 0,3 = 18 000.", en: 'Right. 60,000 · 0.3 = 18,000.' },
        wrong: [
          null,
          { ru: 'Это 0,1 от суммы, а нужно 0,3.', uz: "Bu summaning 0,1 qismi, kerak bo'lgani 0,3.", en: 'That is 0.1 of the sum, and we need 0.3.' },
          { ru: '20 000 — это треть, а 0,3 чуть меньше трети.', uz: "20 000 bu uchdan bir, 0,3 esa uchdan birdan sal kam.", en: 'Twenty thousand is a third, and 0.3 is slightly less than a third.' },
        ],
      },
      {
        q: { ru: 'В музее 45 картин, 2/9 из них пейзажи. Сколько пейзажей?', uz: "Muzeyda 45 ta rasm bor, 2/9 qismi manzara. Nechta manzara?", en: 'A museum has 45 paintings and 2/9 are landscapes. How many?' },
        opts: ['10', '5', '18'],
        correct: 0,
        ok: { ru: 'Верно. 45 : 9 = 5, и 5 · 2 = 10.', uz: "To'g'ri. 45 : 9 = 5, va 5 · 2 = 10.", en: 'Right. 45 ÷ 9 = 5 and 5 · 2 = 10.' },
        wrong: [
          null,
          { ru: '5 — это одна девятая.', uz: "5 bu bir to'qqizdan.", en: 'Five is one ninth.' },
          { ru: '18 вышло бы при доле 2/5.', uz: "18 soni 2/5 ulushda chiqardi.", en: 'Eighteen would come from a share of 2/5.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Целое известно, значит ищем часть умножением.',
        uz: "Mashq. Butun ma'lum, demak qismni ko'paytirib topamiz.",
        en: 'Practice. The whole is known, so find the part by multiplying.',
      },
    },
  },

  s_whole: {
    title: { ru: 'Найти целое', uz: 'Butunni topish', en: 'Find the whole' },
    lead: { ru: 'Дана часть — значит делим. Ответ должен быть больше части.', uz: "Qism berilgan — demak bo'lamiz. Javob qismdan katta bo'lishi kerak.", en: 'A part is given, so divide. The answer must exceed the part.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '12 билетов — это 2/5 всех. Сколько билетов всего?', uz: '12 ta chipta bu hammasining 2/5 qismi. Jami nechta chipta?', en: '12 tickets are 2/5 of all. How many in total?' },
        opts: ['30', '24', '4,8'],
        correct: 0,
        ok: { ru: 'Верно. 12 : 2/5 = 12 · 5/2 = 30.', uz: "To'g'ri. 12 : 2/5 = 12 · 5/2 = 30.", en: 'Right. 12 ÷ 2/5 = 12 · 5/2 = 30.' },
        wrong: [
          null,
          { ru: 'Это удвоение, а нужно разделить на дробь.', uz: "Bu ikkilantirish, kerak bo'lgani kasrga bo'lish.", en: 'That is doubling, but we must divide by the fraction.' },
          { ru: 'Целое не может быть меньше своей части.', uz: "Butun o'z qismidan kichik bo'lolmaydi.", en: 'A whole cannot be smaller than its part.' },
        ],
      },
      {
        q: { ru: 'Заплатили 9000 — это 0,6 стоимости. Сколько стоит всё?', uz: "9000 to'landi — bu narxning 0,6 qismi. Hammasi qancha turadi?", en: 'They paid 9,000, which is 0.6 of the cost. What is the full cost?' },
        opts: ['15 000', '5400', '12 000'],
        correct: 0,
        ok: { ru: 'Верно. 9000 : 0,6 = 90 000 : 6 = 15 000.', uz: "To'g'ri. 9000 : 0,6 = 90 000 : 6 = 15 000.", en: 'Right. 9,000 ÷ 0.6 = 90,000 ÷ 6 = 15,000.' },
        wrong: [
          null,
          { ru: 'Здесь умножили, а надо разделить.', uz: "Bu yerda ko'paytirilgan, kerak bo'lgani bo'lish.", en: 'This multiplied instead of dividing.' },
          { ru: 'Проверь: 0,6 от 12 000 это 7200, а не 9000.', uz: "Tekshiring: 12 000 ning 0,6 qismi 7200, 9000 emas.", en: 'Check: 0.6 of 12,000 is 7,200, not 9,000.' },
        ],
      },
      {
        q: { ru: '20 мест свободны — это 1/4 автобуса. Сколько мест в автобусе?', uz: "20 joy bo'sh — bu avtobusning 1/4 qismi. Avtobusda nechta joy bor?", en: '20 seats are free, which is 1/4 of the bus. How many seats?' },
        opts: ['80', '25', '5'],
        correct: 0,
        ok: { ru: 'Верно. 20 : 1/4 = 20 · 4 = 80.', uz: "To'g'ri. 20 : 1/4 = 20 · 4 = 80.", en: 'Right. 20 ÷ 1/4 = 20 · 4 = 80.' },
        wrong: [
          null,
          { ru: 'Прибавили четверть, а надо разделить на неё.', uz: "Chorak qo'shilgan, unga bo'lish kerak edi.", en: 'A quarter was added instead of dividing by it.' },
          { ru: 'Это четверть от 20, а 20 уже и есть четверть.', uz: "Bu 20 ning choragi, 20 ning o\'zi esa allaqachon chorak.", en: 'That is a quarter of 20, but 20 is already the quarter.' },
        ],
      },
      {
        q: { ru: 'Что проверяет прикидка в таких задачах?', uz: 'Bunday masalalarda chamalash nimani tekshiradi?', en: 'What does the rough check verify here?' },
        opts: [
          { ru: 'Что целое больше части', uz: 'Butun qismdan katta ekanini', en: 'That the whole exceeds the part' },
          { ru: 'Что дробь несократима', uz: 'Kasr qisqarmas ekanini', en: 'That the fraction is irreducible' },
          { ru: 'Что знаменатель чётный', uz: 'Maxraj juft ekanini', en: 'That the denominator is even' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Если целое вышло меньше части, действие выбрано неверно.', uz: "To'g'ri. Butun qismdan kichik chiqsa, amal noto'g'ri tanlangan.", en: 'Right. If the whole came out smaller, the action was wrong.' },
        wrong: [
          null,
          { ru: 'Сократимость на выбор действия не влияет.', uz: "Qisqarishi amal tanlashga ta'sir qilmaydi.", en: 'Reducibility does not affect the choice.' },
          { ru: 'Чётность знаменателя здесь ни при чём.', uz: 'Maxrajning juftligi bunga aloqador emas.', en: 'The parity of the denominator is irrelevant.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Дана часть, значит целое ищем делением.',
        uz: "Mashq. Qism berilgan, demak butunni bo'lish bilan topamiz.",
        en: 'Practice. A part is given, so find the whole by dividing.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Больше или меньше данного числа', uz: 'Berilgan sondan katta yoki kichik', en: 'Larger or smaller than the given number' },
    lead: { ru: 'Это быстрая прикидка: она ловит неверно выбранное действие.', uz: "Bu tez chamalash: u noto'g'ri tanlangan amalni ushlaydi.", en: 'This is the quick check that catches a wrong choice of action.' },
    bin_a: { ru: 'Больше 20', uz: '20 dan katta', en: 'More than 20' },
    bin_b: { ru: 'Меньше 20', uz: '20 dan kichik', en: 'Less than 20' },
    cards: [
      { label: '20 · 0,8', bin: 'b' },
      { label: '20 : 0,8', bin: 'a' },
      { label: '20 · 1,5', bin: 'a' },
      { label: '20 : 1,5', bin: 'b' },
      { label: '20 · 2/3', bin: 'b' },
      { label: '20 : 2/3', bin: 'a' },
    ],
    hint: {
      ru: 'Умножение на число меньше 1 уменьшает, деление на такое число увеличивает.',
      uz: "1 dan kichik songa ko'paytirish kamaytiradi, shunday songa bo'lish esa kattalashtiradi.",
      en: 'Multiplying by less than 1 shrinks, dividing by less than 1 grows.',
    },
    correct_text: {
      ru: 'Верно. Умножение и деление на одно и то же число ведут в разные стороны — это и есть проверка выбора действия.',
      uz: "To'g'ri. Bir xil songa ko'paytirish va bo'lish qarama-qarshi tomonga olib boradi — bu amal tanlashni tekshirish.",
      en: 'Right. Multiplying and dividing by the same number go opposite ways: that is how you check your choice.',
    },
    audio: {
      intro: {
        ru: 'Разложите выражения по двум корзинам. Считать не обязательно, смотрите на второе число и на знак действия.',
        uz: "Ifodalarni ikki savatga ajrating. Hisoblash shart emas, ikkinchi songa va amal belgisiga qarang.",
        en: 'Sort the expressions into two baskets. No need to compute, look at the second number and the operation.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Сравни второе число с единицей и посмотри на действие.', uz: 'Bu yerga emas. Ikkinchi sonni bir bilan solishtiring va amalga qarang.', en: 'Not here. Compare the second number with one and look at the operation.' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «Скидка 1/5 от 12 500 — значит платим 2500». Проверь.', uz: "Aziz: «12 500 dan 1/5 chegirma — demak 2500 to'laymiz». Tekshiring.", en: 'Aziz: “A 1/5 discount on 12,500 means we pay 2,500.” Check it.' },
        opts: [
          { ru: 'Нет: 2500 это сама скидка, платим 10 000', uz: "Yo'q: 2500 chegirmaning o'zi, to'laymiz 10 000", en: 'No: 2,500 is the discount, we pay 10,000' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, платим 12 500', uz: "Yo'q, 12 500 to'laymiz", en: 'No, we pay 12,500' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Скидку вычитают из цены, а не платят вместо неё.', uz: "To'g'ri. Chegirma narxdan ayiriladi, uning o'rniga to'lanmaydi.", en: 'Right. The discount is subtracted from the price, not paid instead of it.' },
        wrong: [
          null,
          { ru: 'Так билет стал бы в пять раз дешевле, а скидка только пятая часть.', uz: "Unda chipta besh barobar arzon bo'lardi, chegirma esa atigi beshdan bir.", en: 'That would make the ticket five times cheaper, but the discount is only a fifth.' },
          { ru: 'Скидка есть, значит платить надо меньше полной цены.', uz: "Chegirma bor, demak to'liq narxdan kam to'lanadi.", en: 'There is a discount, so you pay less than the full price.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «6 книг это 2/3 полки, значит на полке 4 книги». Проверь.', uz: "Dilnoza: «6 kitob bu javonning 2/3 qismi, demak javonda 4 kitob bor». Tekshiring.", en: 'Dilnoza: “6 books are 2/3 of the shelf, so the shelf holds 4.” Check it.' },
        opts: [
          { ru: 'Нет: целое меньше части, надо делить — выйдет 9', uz: "Yo'q: butun qismdan kichik, bo'lish kerak — 9 chiqadi", en: 'No: the whole came out smaller; dividing gives 9' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 12', uz: "Yo'q, 12 bo'ladi", en: 'No, it is 12' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 6 : 2/3 = 6 · 3/2 = 9 книг.', uz: "To'g'ri. 6 : 2/3 = 6 · 3/2 = 9 kitob.", en: 'Right. 6 ÷ 2/3 = 6 · 3/2 = 9 books.' },
        wrong: [
          null,
          { ru: 'На полке не может быть меньше книг, чем на её части.', uz: "Javonda uning qismidagidan kam kitob bo'lolmaydi.", en: 'A shelf cannot hold fewer books than a part of it.' },
          { ru: '12 вышло бы при доле 1/2, а тут 2/3.', uz: "12 soni 1/2 ulushda chiqardi, bu yerda esa 2/3.", en: 'Twelve would come from a half, but here it is two thirds.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в числе, и в выборе действия.',
        uz: "Birovning yechimini tekshiring. Xato sonda ham, amal tanlashda ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the number and in the choice of action.',
      },
    },
  },

  s_task: {
    title: { ru: 'Экскурсия целиком', uz: "Ekskursiya to\'liq", en: 'The whole trip' },
    lead: { ru: 'В классе 30 учеников, поехали 4/5. Билет со скидкой стоит 10 000 сум.', uz: "Sinfda 30 o'quvchi bor, 4/5 qismi bordi. Chegirmali chipta 10 000 so'm.", en: 'A class of 30 with 4/5 going. A discounted ticket costs 10,000.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько учеников поехало?', uz: "Nechta o'quvchi bordi?", en: 'How many students went?' },
        opts: ['24', '6', '25'],
        correct: 0,
        ok: { ru: 'Верно. 30 : 5 = 6, и 6 · 4 = 24.', uz: "To'g'ri. 30 : 5 = 6, va 6 · 4 = 24.", en: 'Right. 30 ÷ 5 = 6 and 6 · 4 = 24.' },
        wrong: [
          null,
          { ru: '6 — это одна пятая, то есть те, кто остался.', uz: "6 bu bir beshdan, ya'ni qolganlar.", en: 'Six is one fifth, that is those who stayed.' },
          { ru: '25 — это не 4/5 от 30: проверь делением на 5.', uz: "25 bu 30 ning 4/5 qismi emas: 5 ga bo'lib tekshiring.", en: 'Twenty five is not 4/5 of 30: check by dividing by 5.' },
        ],
      },
      {
        q: { ru: 'Сколько заплатил класс за билеты?', uz: "Sinf chiptalar uchun qancha to'ladi?", en: 'How much did the class pay for tickets?' },
        opts: ['240 000', '300 000', '60 000'],
        correct: 0,
        ok: { ru: 'Верно. 24 · 10 000 = 240 000 сум.', uz: "To'g'ri. 24 · 10 000 = 240 000 so'm.", en: 'Right. 24 · 10,000 = 240,000.' },
        wrong: [
          null,
          { ru: 'Это за весь класс, а поехали не все.', uz: "Bu butun sinf uchun, hamma ham bormadi.", en: 'That is for the whole class, but not everyone went.' },
          { ru: 'Это за шестерых оставшихся.', uz: "Bu qolgan oltita uchun.", en: 'That is for the six who stayed.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про экскурсию. В классе тридцать учеников, поехали четыре пятых.',
        uz: "Ekskursiya haqida masala. Sinfda o'ttiz o'quvchi bor, to'rt beshdan qismi bordi.",
        en: 'A trip problem. A class of thirty with four fifths going.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 35,
        q: { ru: '14 книг — это 2/5 всех книг на полке. Сколько книг всего? Набери ответ.', uz: '14 kitob bu javondagi kitoblarning 2/5 qismi. Jami nechta kitob bor? Javobni tering.', en: '14 books are 2/5 of the shelf. How many books in total? Type the answer.' },
        hint: { ru: 'Дана часть, значит дели: 14 : 2/5 = 14 · 5/2.', uz: "Qism berilgan, demak bo'ling: 14 : 2/5 = 14 · 5/2.", en: 'A part is given, so divide: 14 ÷ 2/5 = 14 · 5/2.' },
        hint_audio: { ru: 'Дана часть, значит целое находим делением. Четырнадцать разделить на две пятых это четырнадцать умножить на пять вторых.', uz: "Qism berilgan, demak butunni bo'lish bilan topamiz. O'n to'rtni ikki beshdanga bo'lish bu o'n to'rtni besh ikkidanga ko'paytirish.", en: 'A part is given, so the whole comes from division. Fourteen divided by two fifths is fourteen times five halves.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Куртка стоит 200 000 сум, скидка 0,15. Сколько платить?', uz: "Kurtka 200 000 so'm, chegirma 0,15. Qancha to'lanadi?", en: 'A jacket costs 200,000 with 0.15 off. What do you pay?' },
        opts: ['30 000', '185 000', '170 000', '215 000'],
        wrong: [
          { ru: 'Это размер скидки, а не цена к оплате.', uz: "Bu chegirma miqdori, to'lanadigan narx emas.", en: 'That is the discount, not the amount to pay.' },
          { ru: 'Скидка не 15 000, а 30 000: 200 000 · 0,15.', uz: "Chegirma 15 000 emas, 30 000: 200 000 · 0,15.", en: 'The discount is 30,000, not 15,000: 200,000 · 0.15.' },
          null,
          { ru: 'При скидке цена уменьшается, а не растёт.', uz: "Chegirmada narx kamayadi, oshmaydi.", en: 'A discount lowers the price, it does not raise it.' },
        ],
        correct: { ru: 'Верно. 200 000 · 0,15 = 30 000, платим 170 000.', uz: "To'g'ri. 200 000 · 0,15 = 30 000, to'laymiz 170 000.", en: 'Right. 200,000 · 0.15 = 30,000, so you pay 170,000.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'С чего начинают решать задачу на дроби?', uz: 'Kasrga oid masalani nimadan boshlanadi?', en: 'How do you start a fraction problem?' },
        opts: [
          { ru: 'Сразу умножают на дробь', uz: "Darrov kasrga ko'paytiradilar", en: 'By multiplying by the fraction at once' },
          { ru: 'Находят целое в условии', uz: 'Shartdan butunni topadilar', en: 'By finding the whole in the problem' },
          { ru: 'Округляют числа', uz: 'Sonlarni yaxlitlaydilar', en: 'By rounding the numbers' },
          { ru: 'Переворачивают дробь', uz: "Kasrni ag'daradilar", en: 'By flipping the fraction' },
        ],
        wrong: [
          { ru: 'Умножение подходит не всегда: иногда нужно деление.', uz: "Ko'paytirish har doim mos emas: ba'zan bo'lish kerak.", en: 'Multiplying is not always right: sometimes you divide.' },
          null,
          { ru: 'Округление бывает в конце, а не в начале.', uz: "Yaxlitlash oxirida bo'ladi, boshida emas.", en: 'Rounding comes at the end, not the start.' },
          { ru: 'Переворот нужен только при делении на дробь.', uz: "Ag'darish faqat kasrga bo'lishda kerak.", en: 'Flipping is only for dividing by a fraction.' },
        ],
        correct: { ru: 'Верно. От целого зависит, умножать или делить.', uz: "To'g'ri. Ko'paytirish yoki bo'lish butunga bog'liq.", en: 'Right. The whole decides whether you multiply or divide.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'В бутылке 1,5 л сока. Выпили 2/3. Сколько осталось?', uz: "Shishada 1,5 l sharbat bor. 2/3 qismi ichildi. Qancha qoldi?", en: 'A bottle holds 1.5 l of juice and 2/3 was drunk. How much is left?' },
        opts_i18n: [
          { ru: '0,5 л', uz: '0,5 l', en: '0.5 L' },
          { ru: '1 л', uz: '1 l', en: '1 L' },
          { ru: '0,75 л', uz: '0,75 l', en: '0.75 L' },
          { ru: '2,25 л', uz: '2,25 l', en: '2.25 L' },
        ],
        wrong: [
          null,
          { ru: 'Один литр — это выпитая часть, а спрашивают об остатке.', uz: "Bir litr bu ichilgan qism, savol esa qolgani haqida.", en: 'One litre is what was drunk; the question is about the rest.' },
          { ru: '0,75 — это половина бутылки, а выпили две трети.', uz: "0,75 bu shishaning yarmi, ichilgani esa uchdan ikki.", en: '0.75 is half the bottle, but two thirds was drunk.' },
          { ru: 'Осталось не может быть больше, чем было.', uz: "Qolgani bor bo'lganidan ko'p bo'lolmaydi.", en: 'What is left cannot exceed what there was.' },
        ],
        correct: { ru: 'Верно. Осталась 1/3: 1,5 : 3 = 0,5 литра.', uz: "To'g'ri. 1/3 qismi qoldi: 1,5 : 3 = 0,5 litr.", en: 'Right. One third remains: 1.5 ÷ 3 = 0.5 litres.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'После первого шага задачи целое…', uz: 'Masalaning birinchi qadamidan keyin butun…', en: 'After the first step of a problem, the whole…' },
        opts: [
          { ru: 'всегда остаётся прежним', uz: "har doim o'sha bo'lib qoladi", en: 'always stays the same' },
          { ru: 'всегда становится больше', uz: 'har doim kattalashadi', en: 'always gets bigger' },
          { ru: 'исчезает', uz: "yo'qoladi", en: 'disappears' },
          { ru: 'может смениться на остаток', uz: 'qoldiqqa almashishi mumkin', en: 'may become the remainder' },
        ],
        wrong: [
          { ru: 'В задаче про автобус вторая доля бралась уже от остатка.', uz: 'Avtobus masalasida ikkinchi ulush qoldiqdan olindi.', en: 'In the bus problem the second share came from the remainder.' },
          { ru: 'Остаток обычно меньше исходного целого.', uz: "Qoldiq odatda dastlabki butundan kichik.", en: 'The remainder is usually smaller than the original whole.' },
          { ru: 'Целое никуда не девается, оно просто другое.', uz: "Butun hech qayerga ketmaydi, u shunchaki boshqa.", en: 'The whole does not vanish, it simply changes.' },
          null,
        ],
        correct: { ru: 'Верно. Поэтому перед каждой долей полезно назвать её целое.', uz: "To'g'ri. Shuning uchun har bir ulushdan oldin uning butunini aytish foydali.", en: 'Right. That is why you name the whole before each share.' },
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
      ru: 'Повара пересчитывают рецепты дробями каждый день. Рецепт на 4 порции для 6 человек умножают на 1,5: 200 граммов риса превращаются в 300, а 2 стакана воды в 3.',
      uz: "Oshpazlar retseptlarni har kuni kasrlar bilan qayta hisoblaydi. 4 kishilik retsept 6 kishiga 1,5 ga ko'paytiriladi: 200 gramm guruch 300 ga, 2 stakan suv esa 3 ga aylanadi.",
      en: 'Cooks rescale recipes with fractions every day. A recipe for 4 servings feeding 6 is multiplied by 1.5: 200 grams of rice becomes 300 and 2 cups of water becomes 3.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Повара пересчитывают рецепты дробями каждый день. Рецепт на четыре порции для шести человек умножают на полтора: двести граммов риса превращаются в триста, а два стакана воды в три.',
      uz: "Bilasizmi? Oshpazlar retseptlarni har kuni kasrlar bilan qayta hisoblaydi. To'rt kishilik retsept olti kishiga bir yarimga ko'paytiriladi: ikki yuz gramm guruch uch yuzga, ikki stakan suv esa uchga aylanadi.",
      en: 'Did you know? Cooks rescale recipes with fractions every day. A recipe for four servings feeding six is multiplied by one and a half: two hundred grams of rice becomes three hundred and two cups of water becomes three.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Дроби', uz: 'Matematika · Kasrlar', en: 'Mathematics · Fractions' },
    heading: { ru: 'Задачи на дроби', uz: 'Kasrlarga oid masalalar', en: 'Fraction word problems' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'сначала найди целое в условии', uz: 'avval shartdan butunni toping', en: 'find the whole in the problem first' },
    brief_2: { ru: 'целое дано — умножай, часть дана — дели', uz: "butun berilgan — ko'paytiring, qism berilgan — bo'ling", en: 'whole given: multiply; part given: divide' },
    brief_3: { ru: 'после шага целое может смениться', uz: "qadamdan keyin butun o'zgarishi mumkin", en: 'after a step the whole may change' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Первый вопрос', uz: 'Birinchi savol', en: 'First question' },
    memo_a1: { ru: 'что дано: целое или часть?', uz: 'nima berilgan: butunmi yoki qism?', en: 'is the whole or a part given?' },
    memo_q2: { ru: 'Скидка', uz: 'Chegirma', en: 'Discount' },
    memo_a2: { ru: 'найди часть и вычти её из цены', uz: 'qismni toping va narxdan ayiring', en: 'find the part and subtract it' },
    memo_q3: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Check' },
    memo_a3: { ru: 'часть меньше целого, целое больше части', uz: 'qism butundan kichik, butun qismdan katta', en: 'a part is less, a whole is more' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'В задаче сначала находим целое. Если нужна его часть, умножаем, если целое неизвестно и дана часть, делим. После каждого шага целое может смениться, а ответ проверяем прикидкой.',
        'Экскурсия: билет двенадцать тысяч пятьсот, скидка одна пятая, платить десять тысяч сумов.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Masalada avval butunni topamiz. Uning qismi kerak bo'lsa ko'paytiramiz, butun noma'lum bo'lib qism berilgan bo'lsa bo'lamiz. Har qadamdan keyin butun o'zgarishi mumkin, javobni esa chamalab tekshiramiz.",
        "Ekskursiya: chipta o'n ikki ming besh yuz, chegirma beshdan bir, to'lash o'n ming so'm.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'In a problem, find the whole first. If a part of it is needed, multiply; if the whole is unknown and a part is given, divide. After each step the whole may change, and the answer gets a rough check.',
        'The trip: a ticket at twelve thousand five hundred with one fifth off means paying ten thousand.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. План из трёх шагов', uz: 'Usul. Uch qadamli reja', en: 'Method. The three step plan' },
    m1_steps: {
      ru: ['Назови целое: от чего берётся доля', 'Целое дано — умножай, часть дана — дели', 'Прикинь ответ и проверь обратным действием'],
      uz: ['Butunni ayting: ulush nimadan olinadi', "Butun berilgan — ko'paytiring, qism berilgan — bo'ling", 'Javobni chamalang va teskari amal bilan tekshiring'],
      en: ['Name the whole: what the share comes from', 'Whole given: multiply. Part given: divide', 'Estimate and check with the inverse action'],
    },
    m1_no: {
      ru: 'Скидка — это часть цены: сначала находим её, потом вычитаем. Или сразу считаем оставшуюся долю.',
      uz: "Chegirma narxning qismi: avval uni topamiz, keyin ayiramiz. Yoki darrov qolgan ulushni hisoblaymiz.",
      en: 'A discount is a part of the price: find it, then subtract. Or compute the remaining share directly.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: касса музея. На хуке вопрос, в итоге ответ.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d16wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d16wall)"/>

    {/* Колонны и фронтон музея */}
    <g opacity="0.75">
      <path d="M40 34 L200 6 L360 34 Z" fill="#D2A96F"/>
      <rect x="40" y="34" width="320" height="8" fill="#C9A472"/>
      {[62, 118, 174, 230, 286, 330].map((cx) => (
        <rect key={cx} x={cx} y="42" width="16" height="56" rx="2" fill="#E5DAC6" stroke="#DCCFB6"/>
      ))}
    </g>

    {/* Картины в глубине зала */}
    <g opacity="0.6">
      <rect x="88" y="52" width="30" height="24" rx="2" fill="#FFFDF7" stroke="#C9A472"/>
      <path d="M92 72 l8 -12 l6 7 l6 -9 v14 Z" fill="#8FBF7F"/>
      <rect x="248" y="52" width="30" height="24" rx="2" fill="#FFFDF7" stroke="#C9A472"/>
      <circle cx="263" cy="62" r="6" fill="#F5C77E"/>
    </g>

    {/* Касса: окошко, ценник без итога, кассовый аппарат */}
    <g>
      <rect x="136" y="78" width="128" height="42" rx="4" fill="#E5DAC6" stroke="#C9A472" strokeWidth="2"/>
      <rect x="144" y="84" width="112" height="22" rx="3" fill="#FFFDF7"/>
      <text x="200" y="100" textAnchor="middle" fill="#494550"
        fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">12 500</text>
      <rect x="270" y="92" width="26" height="28" rx="3" fill="#8E8578"/>
      <rect x="274" y="96" width="18" height="8" rx="2" fill="#DCEDF5"/>
      <circle cx="283" cy="112" r="3" fill="#FF4F28" className="d16-led"/>
    </g>

    {/* Табличка со скидкой покачивается: доля есть, итога нет */}
    <g className="d16-sign">
      <path d="M96 78 v-14" stroke="#B08A57" strokeWidth="1.6"/>
      <rect x="70" y="52" width="52" height="26" rx="4" fill="#FBF3D6" stroke="#C9A472"/>
      <text x="96" y="70" textAnchor="middle" fill="#C99B3A"
        fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">1 / 5</text>
    </g>

    {/* Дети у кассы с билетами и рюкзаками */}
    <Person x={62} ground={132} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={330} ground={132} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <g className="d16-ticket">
      <rect x="82" y="104" width="24" height="14" rx="2" fill="#FFFDF7" stroke="#C9A472"/>
      <path d="M86 111 h16" stroke="#C9A472" strokeWidth="1.4" strokeDasharray="2 2"/>
    </g>
    <g>
      <rect x="348" y="106" width="22" height="20" rx="5" fill="#D98A5A"/>
      <path d="M353 106 v-5 h12 v5" fill="none" stroke="#B5714A" strokeWidth="2"/>
    </g>

    {/* Пол */}
    <rect x="0" y="128" width="400" height="26" fill="#D2A96F"/>
    <rect x="0" y="128" width="400" height="4" fill="#C9884A"/>
  </svg>
);

// Итог: чек с ценой, скидкой и итогом.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g>
      <rect x="120" y="8" width="160" height="76" rx="4" fill="#FFFDF7" stroke="#DCCFB6" strokeWidth="2"/>
      <path d="M120 22 h160" stroke="#E9E3D9"/>
      <g fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">
        <text x="132" y="40" fill="#8A8883">12 500</text>
        <text x="132" y="58" fill="#C99B3A">− 2 500</text>
        <text x="132" y="78" fill="#1F7A4D">10 000</text>
      </g>
      <path d="M128 64 h144" stroke="#C9A472" strokeWidth="1.6"/>
    </g>
    <g fill="#8A8883" fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">
      <text x="60" y="50" textAnchor="middle">1 / 5</text>
      <text x="340" y="50" textAnchor="middle">4 / 5</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
const Line = ({ node, on }) => (
  <span className={'d16-line d16-fade' + (on ? ' d16-on' : '')}>{mt(node)}</span>
);

// Полоса цены: скидка и остаток к оплате.
const PriceBar = ({ parts, cut, size = 'mid' }) => (
  <span className={'d16-bar d16-bar-' + size}>
    {Array.from({ length: parts }, (_, i) => <i key={i} className={i < cut ? 'cut' : 'pay'}/>)}
  </span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d16-stage">
        <span className="d16-two">
          <span className="d16-card d16-card-mul">
            <b>{mt(t(c.left_q))}</b>
            <span className={'d16-fade' + (step >= 1 ? ' d16-on' : '')}>{mt(t(c.left_a))}</span>
          </span>
          <span className={'d16-card d16-card-div d16-fade' + (step >= 2 ? ' d16-on' : '')}>
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

// Ядро: план из трёх шагов и разбор задачи с билетом.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d16-stage">
        <span className="d16-plan">
          {c.steps.map((s, i) => (
            <i key={i} className={'d16-fade' + (step >= 0 ? ' d16-on' : '') + (step >= i ? ' d16-step-on' : '')}>
              <b>{i + 1}</b>{t(s)}
            </i>
          ))}
        </span>
        <PriceBar parts={5} cut={step >= 1 ? 1 : 0}/>
        {c.demo.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const DecBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_dec;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d16-stage">
        <span className={'d16-pair d16-pair-mul d16-fade' + (step >= 0 ? ' d16-on' : '')}>
          <Line node={t(c.lines[0])} on/>
        </span>
        <span className={'d16-pair d16-pair-div d16-fade' + (step >= 1 ? ' d16-on' : '')}>
          <Line node={t(c.lines[1])} on/>
        </span>
        <span className={'d16-pairline d16-fade' + (step >= 2 ? ' d16-on' : '')}>
          <b className="d16-dec">0,4</b><span className="d16-op">=</span><Frac n="2" d="5" size="mid"/>
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
  const taken = step >= 1 ? 32 : 24;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d16-stage">
        <span className="d16-seats">
          {Array.from({ length: 40 }, (_, i) => (
            <i key={i} className={i < 24 ? 'on' : (i < taken ? 'later' : '')}/>
          ))}
        </span>
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

// Граница: доля берётся от нового целого.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d16-stage">
        <span className="d16-pair d16-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d16-pair d16-pair-good d16-fade' + (step >= 1 ? ' d16-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d16-pair d16-pair-warn d16-fade' + (step >= 2 ? ' d16-on' : '')}>
          <Line node={t(c.add_line)} on/>
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
        <div className={'d16-banner fade-up delay-1' + (phase === 'play' ? ' d16-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d16-stage d16-stage-tool">
          {phase === 'demo' ? (
            <>
              <PriceBar parts={5} cut={shown >= 1 ? 1 : 0} size="sm"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d16-verdict' + (done ? ' d16-verdict-on' : '')}>{done ? mt(t(c.demo_note)) : ''}</p>
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
          <div className="d16-acts fade-up">
            <button className="d16-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d16-btn d16-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenDec = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_dec} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <DecBody step={step}/>}/>
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
      <div className="d16-stage">
        <PriceBar parts={5} cut={1}/>
        <span className="d16-pairline">
          <b className="d16-dec">12 500</b><span className="d16-op">·</span>
          <Frac n="4" d="5" size="mid"/><span className="d16-op">=</span>
          <b className="d16-dec d16-dec-ok">10 000</b>
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
const ScreenWhole = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_whole} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: класс из 30 человек, поехали 4/5.
const TaskFig = ({ idx }) => (
  <div className="d16-task-fig">
    <span className="d16-class">
      {Array.from({ length: 30 }, (_, i) => <i key={i} className={i < 24 ? 'on' : ''}/>)}
    </span>
    {idx >= 1 && <span className="d16-task-cap">24 · 10 000</span>}
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
.d16-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d16-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d16-stage-tool .d16-line { font-size: clamp(12px, 2vw, 16px); }

.d16-fade { opacity: 0; transition: opacity 420ms linear; }
.d16-on { opacity: 1; }
.d16-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; }
.d16-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 21px); font-weight: 700; color: #8A8883; }
.d16-dec { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 23px); font-weight: 700; color: #494550; }
.d16-dec-ok { color: #1F7A4D; }
.d16-pairline { display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; }

/* Полоса цены: скидка и оплата */
.d16-bar { display: inline-flex; gap: 2px; border: 2px solid #B08A57; border-radius: 5px; padding: 2px; background: #FFFDF7; }
.d16-bar i { display: block; border-radius: 3px; background: #7ECBE6; transition: background-color 400ms linear; }
.d16-bar-mid i { width: clamp(30px, 6.5vw, 54px); height: clamp(20px, 3.6vw, 30px); }
.d16-bar-sm i { width: clamp(22px, 5vw, 40px); height: clamp(15px, 2.8vw, 24px); }
.d16-bar i.cut { background: #F5C77E; }

/* План из трёх шагов */
.d16-plan { display: flex; flex-direction: column; gap: 5px; width: 100%; }
.d16-plan i { display: flex; align-items: center; gap: 9px; font-style: normal; font-size: clamp(12px, 2.1vw, 16px); color: #8A8883; padding: clamp(4px, 1vw, 7px) clamp(7px, 1.4vw, 11px); border-radius: 10px; background: #F7F0E2; transition: background-color 380ms linear, color 380ms linear; }
.d16-plan i.d16-step-on { background: #E3F0E8; color: #1F7A4D; }
.d16-plan b { display: grid; place-items: center; width: 21px; height: 21px; border-radius: 50%; background: #FFFDF7; font-family: 'JetBrains Mono', monospace; font-size: 12px; }

/* Две задачи рядом */
.d16-two { display: flex; gap: clamp(8px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; width: 100%; }
.d16-card { flex: 1 1 190px; display: flex; flex-direction: column; gap: 6px; padding: clamp(8px, 1.6vw, 12px); border-radius: 13px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 19px); font-weight: 700; color: #1F7A4D; }
.d16-card b { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 600; color: #494550; }
.d16-card-mul { background: #E7F5FA; border: 1px solid #B6DCEA; }
.d16-card-div { background: #E3F0E8; border: 1px solid #A9CFBA; }

/* Места в автобусе */
.d16-seats { display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px; }
.d16-seats i { display: block; width: clamp(12px, 2.6vw, 20px); height: clamp(12px, 2.6vw, 20px); border-radius: 4px; background: #F3EFE6; border: 1px solid #E9E3D9; }
.d16-seats i.on { background: #7ECBE6; border-color: #019ACB; }
.d16-seats i.later { background: #F5C77E; border-color: #C99B3A; }

/* Строки правил и границы */
.d16-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d16-pair-mul { background: #E7F5FA; border: 1px solid #B6DCEA; }
.d16-pair-div { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d16-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d16-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d16-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d16-task-fig { display: flex; flex-direction: column; gap: 6px; align-items: center; }
.d16-class { display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px; }
.d16-class i { display: block; width: clamp(11px, 2.4vw, 18px); height: clamp(11px, 2.4vw, 18px); border-radius: 50%; background: #F3EFE6; border: 1px solid #E9E3D9; }
.d16-class i.on { background: #8FBF7F; border-color: #1F7A4D; }
.d16-task-cap { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.3vw, 17px); font-weight: 700; color: #1F7A4D; }

/* Экран 4 */
.d16-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d16-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d16-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d16-verdict-on { opacity: 1; }
.d16-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d16-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d16-btn:disabled { opacity: 0.45; cursor: default; }
.d16-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d16-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: лампочка кассы, табличка, билет в руке */
.d16-led { animation: d16Led 2600ms ease-in-out infinite; }
@keyframes d16Led { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
.d16-sign { transform-origin: 96px 64px; animation: d16Sign 4600ms ease-in-out infinite; }
@keyframes d16Sign { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
.d16-ticket { animation: d16Ticket 3800ms ease-in-out infinite; }
@keyframes d16Ticket { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@media (prefers-reduced-motion: reduce) { .d16-led, .d16-sign, .d16-ticket { animation: none; } }

@media (max-width: 639.98px) {
  .d16-bar-mid i { width: 28px; height: 18px; }
  .d16-bar-sm i { width: 20px; height: 14px; }
  .d16-seats i { width: 11px; height: 11px; }
  .d16-class i { width: 10px; height: 10px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function FractionProblemsLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenDec, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenPart, ScreenWhole, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
