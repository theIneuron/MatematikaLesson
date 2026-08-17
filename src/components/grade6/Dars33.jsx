// ============================================================
// 6 КЛАСС, УРОК 33 «Приведение подобных слагаемых»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б9, первый урок. Подобные слагаемые вводятся через счёт
// одинаковых предметов: пять коробок мячей и ещё три коробки мячей это
// восемь коробок, а не восемь. Складываются коэффициенты, буквенная
// часть остаётся. Разные буквы не складываются вовсе.
//
// Сцена — кладовка спортзала, инвентарь в подписанных коробках.
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
  lessonId: 'grade6-33',
  lessonTitle: {
    ru: 'Приведение подобных слагаемых',
    uz: "O'xshash hadlarni ixchamlash",
    en: 'Collecting like terms',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 sport zali: 5x + 3x
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 koeffitsiyent esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 bir xil harfli qism
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: koeffitsiyentlar bilan ishlash
  { id: 's_diff',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 har xil harflar qo'shilmaydi
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: qavs va ixchamlash
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: harf yo'qolmaydi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_same',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 ixchamlash x3
  { id: 's_mix',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 qavs va ishoralar x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: o'xshashmi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: inventar
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Коробки с мячами', uz: "To'plar solingan quti", en: 'Boxes of balls' },
    lead: {
      ru: 'В каждой коробке x мячей. В зале 5 коробок, из кладовки принесли ещё 3.',
      uz: "Har bir qutida x ta to'p bor. Zalda 5 ta quti bor edi, omborxonadan yana 3 tasi keltirildi.",
      en: 'Each box holds x balls. The hall had 5 boxes and 3 more came from the store room.',
    },
    voice_a: { ru: 'Дилшод записал: 5x + 3x = 8', uz: 'Dilshod yozdi: 5x + 3x = 8', en: 'Dilshod wrote: 5x + 3x = 8' },
    voice_b: { ru: 'Нигора записала: 5x + 3x = 8x', uz: 'Nigora yozdi: 5x + 3x = 8x', en: 'Nigora wrote: 5x + 3x = 8x' },
    ask: { ru: 'Какая запись верна?', uz: "Qaysi yozuv to'g'ri?", en: 'Which line is right?' },
    options: [
      { ru: '8', uz: '8', en: '8' },
      { ru: '8x', uz: '8x', en: '8x' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В кладовке спортзала мячи лежат в одинаковых коробках, и в каждой их икс штук. В зале стояло пять коробок, потом принесли ещё три.',
          'Дилшод записал, что пять икс плюс три икс равно восьми. Нигора записала, что получается восемь икс. Какая запись верна? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Sport zali omborxonasida to'plar bir xil qutilarda turadi, har birida iks tadan. Zalda beshta quti bor edi, keyin yana uchtasi keltirildi.",
          "Dilshod besh iks qo'shuv uch iks sakkizga teng deb yozdi. Nigora sakkiz iks chiqadi deb yozdi. Qaysi yozuv to'g'ri? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'In the gym store room the balls sit in identical boxes, x balls in each. The hall had five boxes and three more were brought in.',
          'Dilshod wrote that five x plus three x is eight. Nigora wrote that it makes eight x. Which line is right? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Коэффициент и буквенная часть', uz: 'Koeffitsiyent va harfli qism', en: 'Coefficient and letter part' },
    done: {
      ru: 'У каждого слагаемого есть число впереди и буквенная часть. Сегодня посмотрим, что бывает, когда буквенные части совпадают.',
      uz: "Har bir hadning oldida son va harfli qismi bor. Bugun harfli qismlar mos kelganda nima bo'lishini ko'ramiz.",
      en: 'Every term has a number in front and a letter part. Today we look at what happens when the letter parts match.',
    },
    audio: {
      ru: [
        'Вспомним тридцать первый урок. В записи пять икс число пять это коэффициент, а икс буквенная часть.',
        'Если буква стоит одна, коэффициент всё равно есть, и он равен единице.',
        'Сегодня главный вопрос: что будет, если у двух слагаемых буквенные части одинаковые.',
      ],
      uz: [
        "O'ttiz birinchi darsni eslaymiz. Besh iks yozuvida besh soni koeffitsiyent, iks esa harfli qism.",
        "Harf yolg'iz tursa ham koeffitsiyent bor va u birga teng.",
        "Bugungi asosiy savol: ikki hadning harfli qismlari bir xil bo'lsa nima bo'ladi.",
      ],
      en: [
        'Recall lesson thirty one. In five x the five is the coefficient and x is the letter part.',
        'If a letter stands alone the coefficient is still there and equals one.',
        'Today the main question: what happens when two terms have the same letter part.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Считаем коробки, а не мячи', uz: "To'plarni emas, qutilarni sanaymiz", en: 'Counting boxes, not balls' },
    lines: [
      { ru: '5 коробок и ещё 3 коробки', uz: '5 ta quti va yana 3 ta quti', en: '5 boxes and 3 more boxes' },
      { ru: '5x + 3x = (5 + 3)x', uz: '5x + 3x = (5 + 3)x', en: '5x + 3x = (5 + 3)x' },
      { ru: '= 8x коробок мячей', uz: "= 8x ta to'p", en: '= 8x balls in all' },
    ],
    done: {
      ru: 'Буквенная часть у слагаемых одинаковая, поэтому её выносят за скобку, а коэффициенты складывают. Права была Нигора.',
      uz: "Hadlarning harfli qismi bir xil, shuning uchun u qavs tashqarisiga chiqariladi, koeffitsiyentlar esa qo'shiladi. Nigora haq edi.",
      en: 'The terms share a letter part, so it comes out of the bracket while the coefficients add. Nigora was right.',
    },
    audio: {
      ru: [
        'Посмотрим на коробки. Пять коробок и ещё три коробки это восемь коробок, а не восемь мячей.',
        'В записи это выглядит так: пять икс плюс три икс равно скобка пять плюс три, закрыть скобку, икс. Мы просто вынесли одинаковую буквенную часть за скобку, как в тридцать втором уроке.',
        'Получилось восемь икс. Дилшод потерял букву, а вместе с ней и смысл: восемь чего? Права была Нигора.',
      ],
      uz: [
        "Qutilarga qaraymiz. Beshta quti va yana uchta quti sakkizta quti bo'ladi, sakkizta to'p emas.",
        "Yozuvda bu shunday ko'rinadi: besh iks qo'shuv uch iks qavs besh qo'shuv uch qavs yopiladi iks. Biz shunchaki bir xil harfli qismni qavs tashqarisiga chiqardik, o'ttiz ikkinchi darsdagidek.",
        "Sakkiz iks chiqdi. Dilshod harfni yo'qotdi, u bilan birga ma'noni ham: sakkizta nima? Nigora haq edi.",
      ],
      en: [
        'Look at the boxes. Five boxes and three more boxes make eight boxes, not eight balls.',
        'In writing: five x plus three x equals bracket five plus three close bracket x. We simply took the shared letter part out of the bracket, as in lesson thirty two.',
        'That gives eight x. Dilshod lost the letter and with it the meaning: eight of what? Nigora was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Работаем с коэффициентами', uz: 'Koeffitsiyentlar bilan ishlaymiz', en: 'Working with coefficients' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '7a − 2a: буквенная часть одна и та же', uz: "7a − 2a: harfli qism bir xil", en: '7a − 2a: the letter part is the same' },
      { ru: 'работаем только с числами: 7 − 2 = 5', uz: 'faqat sonlar bilan ishlaymiz: 7 − 2 = 5', en: 'work with the numbers only: 7 − 2 = 5' },
      { ru: 'буква остаётся: 5a', uz: 'harf qoladi: 5a', en: 'the letter stays: 5a' },
    ],
    demo_note: {
      ru: 'Подобные слагаемые — это слагаемые с одинаковой буквенной частью. Складывают и вычитают только их коэффициенты.',
      uz: "O'xshash hadlar — harfli qismi bir xil bo'lgan hadlar. Faqat ularning koeffitsiyentlari qo'shiladi va ayiriladi.",
      en: 'Like terms are terms with the same letter part. Only their coefficients are added or subtracted.',
    },
    play_ask: { ru: 'Приведи подобные: 4m + 6m', uz: "O'xshash hadlarni ixchamlang: 4m + 6m", en: 'Collect like terms: 4m + 6m' },
    play_opts: ['10m', '10', '24m'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 4 + 6 = 10, буква m остаётся.',
      uz: "To'g'ri. 4 + 6 = 10, m harfi qoladi.",
      en: 'Right. 4 + 6 = 10 and the letter m stays.',
    },
    play_wrong: [
      null,
      { ru: 'Буква никуда не делась: десять чего?', uz: "Harf yo'qolgani yo'q: o'nta nima?", en: 'The letter did not vanish: ten of what?' },
      { ru: 'Коэффициенты складывают, а не перемножают.', uz: "Koeffitsiyentlar qo'shiladi, ko'paytirilmaydi.", en: 'Coefficients are added, not multiplied.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу приём на примере семь а минус два а.',
        uz: "Usulni yetti a minus ikki a misolida ko'rsataman.",
        en: 'I will show the move on seven a minus two a.',
      },
      demo: {
        ru: 'Буквенная часть у слагаемых одна и та же, значит они подобные. Работаем только с числами: семь минус два пять. Буква остаётся как была. Получилось пять а.',
        uz: "Hadlarning harfli qismi bir xil, demak ular o'xshash. Faqat sonlar bilan ishlaymiz: yetti minus ikki besh. Harf o'sha holicha qoladi. Besh a chiqdi.",
        en: 'The terms share a letter part, so they are like terms. Work with the numbers only: seven minus two is five. The letter stays. That gives five a.',
      },
      play: {
        ru: 'Теперь ваша очередь. Приведите подобные: четыре эм плюс шесть эм.',
        uz: "Endi sizning navbatingiz. O'xshash hadlarni ixchamlang: to'rt em qo'shuv olti em.",
        en: 'Now it is your turn. Collect like terms: four m plus six m.',
      },
      ok: {
        ru: 'Верно. Четыре и шесть дают десять, буква остаётся.',
        uz: "To'g'ri. To'rt va olti o'nni beradi, harf qoladi.",
        en: 'Right. Four and six make ten and the letter stays.',
      },
      wrong: {
        ru: 'Складывайте только числа впереди, буквенную часть не трогайте.',
        uz: "Faqat oldidagi sonlarni qo'shing, harfli qismga tegmang.",
        en: 'Add only the numbers in front and leave the letter part alone.',
      },
    },
  },

  s_diff: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Разные буквы не складываются', uz: "Har xil harflar qo'shilmaydi", en: 'Different letters do not add' },
    lines: [
      { ru: '3a + 4b: коробки мячей и скакалки', uz: "3a + 4b: to'p qutilari va arg'amchilar", en: '3a + 4b: ball boxes and skipping ropes' },
      { ru: 'буквенные части разные', uz: 'harfli qismlar har xil', en: 'the letter parts differ' },
      { ru: 'запись 3a + 4b уже упрощена', uz: '3a + 4b yozuvi allaqachon ixcham', en: '3a + 4b is already as simple as it gets' },
    ],
    mix: { ru: '2x + 5 + 3x = 5x + 5', uz: '2x + 5 + 3x = 5x + 5', en: '2x + 5 + 3x = 5x + 5' },
    done: {
      ru: 'Складывают только подобные. Число без буквы тоже стоит особняком: его складывают с другими числами, а не с буквенными слагаемыми.',
      uz: "Faqat o'xshash hadlar qo'shiladi. Harfsiz son ham alohida turadi: u boshqa sonlar bilan qo'shiladi, harfli hadlar bilan emas.",
      en: 'Only like terms combine. A number without a letter also stands apart: it joins other numbers, not letter terms.',
    },
    audio: {
      ru: [
        'В кладовке есть и скакалки. Три коробки мячей и четыре скакалки нельзя записать одним числом: это разные вещи.',
        'В математике так же. Буквенные части разные, значит слагаемые не подобные, и запись три а плюс четыре бэ уже упрощена дальше некуда.',
        'А если в выражении есть и буквы, и просто числа, собирают отдельно буквы и отдельно числа. Два икс плюс пять плюс три икс это пять икс плюс пять.',
      ],
      uz: [
        "Omborxonada arg'amchilar ham bor. Uchta to'p qutisi va to'rtta arg'amchini bitta son bilan yozib bo'lmaydi: bular har xil narsalar.",
        "Matematikada ham shunday. Harfli qismlar har xil, demak hadlar o'xshash emas va uch a qo'shuv to'rt b yozuvini yanada soddalashtirib bo'lmaydi.",
        "Ifodada ham harflar, ham shunchaki sonlar bo'lsa, harflar alohida, sonlar alohida yig'iladi. Ikki iks qo'shuv besh qo'shuv uch iks bu besh iks qo'shuv besh.",
      ],
      en: [
        'The store room also holds skipping ropes. Three boxes of balls and four ropes cannot be written as one number: they are different things.',
        'Mathematics works the same way. Different letter parts mean the terms are not alike, and three a plus four b cannot be simplified further.',
        'If an expression has both letters and plain numbers, gather the letters separately and the numbers separately. Two x plus five plus three x is five x plus five.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Сначала скобки, потом подобные', uz: "Avval qavslar, keyin o'xshashlar", en: 'Brackets first, then like terms' },
    lead: { ru: 'Упростим 4(x + 2) − 3x.', uz: "4(x + 2) − 3x ni soddalashtiramiz.", en: 'Simplify 4(x + 2) − 3x.' },
    steps: [
      { ru: 'раскрываем скобки: 4x + 8 − 3x', uz: 'qavslarni ochamiz: 4x + 8 − 3x', en: 'open the brackets: 4x + 8 − 3x' },
      { ru: 'подобные: 4x − 3x = x', uz: "o'xshashlar: 4x − 3x = x", en: 'like terms: 4x − 3x = x' },
      { ru: 'ответ: x + 8', uz: 'javob: x + 8', en: 'answer: x + 8' },
    ],
    done: {
      ru: 'Порядок такой: сначала раскрыть скобки, потом собрать подобные. Коэффициент 1 перед буквой не пишут.',
      uz: "Tartib shunday: avval qavslarni ochish, keyin o'xshashlarni yig'ish. Harf oldidagi 1 koeffitsiyent yozilmaydi.",
      en: 'The order is: open the brackets first, then collect like terms. A coefficient of 1 is not written.',
    },
    audio: {
      ru: [
        'Решаем вместе. Упростим четыре, скобка, икс плюс два, закрыть скобку, минус три икс.',
        'Сначала раскрываем скобки по правилу прошлого урока: четыре икс плюс восемь минус три икс.',
        'Теперь собираем подобные. Четыре икс минус три икс это один икс, а единицу перед буквой не пишут. Ответ икс плюс восемь. Восьмёрка осталась одна: подобных ей нет.',
      ],
      uz: [
        "Birga yechamiz. To'rt, qavs, iks qo'shuv ikki, qavs yopiladi, minus uch iksni soddalashtiramiz.",
        "Avval o'tgan dars qoidasi bo'yicha qavslarni ochamiz: to'rt iks qo'shuv sakkiz minus uch iks.",
        "Endi o'xshashlarni yig'amiz. To'rt iks minus uch iks bu bitta iks, harf oldidagi birni esa yozmaydilar. Javob iks qo'shuv sakkiz. Sakkiz yolg'iz qoldi: unga o'xshash had yo'q.",
      ],
      en: [
        'Let us solve it together. Simplify four, bracket, x plus two, close bracket, minus three x.',
        'First open the brackets by the rule of the last lesson: four x plus eight minus three x.',
        'Now collect like terms. Four x minus three x is one x, and a one before a letter is not written. The answer is x plus eight. The eight stands alone: it has no like term.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Буква никуда не девается', uz: 'Harf hech qayerga ketmaydi', en: 'The letter does not vanish' },
    bad_line: { ru: 'ошибка: 5x + 3x = 8', uz: 'xato: 5x + 3x = 8', en: 'mistake: 5x + 3x = 8' },
    good_line: { ru: 'верно: 5x + 3x = 8x', uz: "to'g'ri: 5x + 3x = 8x", en: 'right: 5x + 3x = 8x' },
    warn_line: { ru: 'ошибка: 3a + 4b = 7ab, буквы разные', uz: 'xato: 3a + 4b = 7ab, harflar har xil', en: 'mistake: 3a + 4b = 7ab, the letters differ' },
    done: {
      ru: 'Проверка простая: подставь число. При x = 2 первая запись даёт 16, а не 8. Разные буквы не складываются вовсе.',
      uz: "Tekshiruv oddiy: sonni qo'ying. x = 2 da birinchi yozuv 8 emas, 16 beradi. Har xil harflar umuman qo'shilmaydi.",
      en: 'The check is simple: substitute a number. At x = 2 the first line gives 16, not 8. Different letters do not add at all.',
    },
    audio: {
      ru: [
        'Две частые ошибки урока. Первая: буква теряется, и остаётся голое число.',
        'Проверим подстановкой. Пусть в коробке два мяча. Тогда пять коробок и три коробки это шестнадцать мячей, а не восемь. Правильно писать восемь икс.',
        'Вторая ошибка: складывают слагаемые с разными буквами и приписывают буквы друг к другу. Три а плюс четыре бэ так и остаётся тремя а плюс четыре бэ.',
      ],
      uz: [
        "Darsning tez-tez uchraydigan ikki xatosi. Birinchisi: harf yo'qoladi va yalang'och son qoladi.",
        "Qo'yib tekshiramiz. Qutida ikkita to'p bo'lsin. Unda beshta va uchta quti sakkizta emas, o'n oltita to'p bo'ladi. To'g'risi sakkiz iks deb yozish.",
        "Ikkinchi xato: har xil harfli hadlarni qo'shib, harflarni yonma-yon yozishadi. Uch a qo'shuv to'rt b o'sha uch a qo'shuv to'rt b bo'lib qolaveradi.",
      ],
      en: [
        'Two common mistakes here. First: the letter is lost and a bare number remains.',
        'Check by substituting. Say a box holds two balls. Then five boxes and three boxes make sixteen balls, not eight. The right line is eight x.',
        'Second mistake: terms with different letters are added and the letters stuck together. Three a plus four b simply stays three a plus four b.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как приводят подобные', uz: "O'xshash hadlar qanday ixchamlanadi", en: 'How like terms are collected' },
    rule_1: {
      ru: 'Подобные слагаемые — это слагаемые с одинаковой буквенной частью. Их приводят так: складывают или вычитают коэффициенты, а буквенную часть оставляют.',
      uz: "O'xshash hadlar — harfli qismi bir xil bo'lgan hadlar. Ular shunday ixchamlanadi: koeffitsiyentlar qo'shiladi yoki ayiriladi, harfli qism esa qoladi.",
      en: 'Like terms are terms with the same letter part. To collect them, add or subtract the coefficients and keep the letter part.',
    },
    rule_2: {
      ru: 'Слагаемые с разными буквами не складывают. Если есть скобки, их раскрывают первыми. Спортзал: 5x + 3x = 8x, права была Нигора.',
      uz: "Har xil harfli hadlar qo'shilmaydi. Qavslar bo'lsa, avval ular ochiladi. Sport zali: 5x + 3x = 8x, Nigora haq edi.",
      en: 'Terms with different letters are not added. If there are brackets, open them first. The gym: 5x + 3x = 8x, so Nigora was right.',
    },
    audio: {
      ru: 'Запомним правило. Подобные слагаемые это слагаемые с одинаковой буквенной частью. Чтобы привести их, складывают или вычитают коэффициенты, а буквенную часть оставляют без изменений. Слагаемые с разными буквами не складывают вовсе. Если в выражении есть скобки, сначала раскрывают их. Вернёмся в спортзал. Пять икс плюс три икс это восемь икс. Права была Нигора.',
      uz: "Qoidani eslab qolamiz. O'xshash hadlar bu harfli qismi bir xil bo'lgan hadlar. Ularni ixchamlash uchun koeffitsiyentlar qo'shiladi yoki ayiriladi, harfli qism esa o'zgarishsiz qoladi. Har xil harfli hadlar umuman qo'shilmaydi. Ifodada qavslar bo'lsa, avval ular ochiladi. Sport zaliga qaytamiz. Besh iks qo'shuv uch iks bu sakkiz iks. Nigora haq edi.",
      en: 'Let us remember the rule. Like terms are terms with the same letter part. To collect them, add or subtract the coefficients and leave the letter part unchanged. Terms with different letters do not add at all. If there are brackets, open them first. Back to the gym. Five x plus three x is eight x. Nigora was right.',
    },
  },

  s_same: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Приводим подобные', uz: "O'xshashlarni ixchamlaymiz", en: 'Collecting like terms' },
    lead: { ru: 'Работай с коэффициентами, букву не трогай.', uz: 'Koeffitsiyentlar bilan ishlang, harfga tegmang.', en: 'Work with the coefficients and leave the letter.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Приведи подобные: 6y + 5y', uz: "O'xshashlarni ixchamlang: 6y + 5y", en: 'Collect like terms: 6y + 5y' },
        opts: ['11y', '11', '30y'],
        correct: 0,
        ok: { ru: 'Верно. 6 + 5 = 11, буква y остаётся.', uz: "To'g'ri. 6 + 5 = 11, y harfi qoladi.", en: 'Right. 6 + 5 = 11 and the y stays.' },
        wrong: [
          null,
          { ru: 'Одиннадцать чего? Буква обязана остаться.', uz: "O'n bitta nima? Harf qolishi shart.", en: 'Eleven of what? The letter must stay.' },
          { ru: 'Коэффициенты складывают, а не перемножают.', uz: "Koeffitsiyentlar qo'shiladi, ko'paytirilmaydi.", en: 'Coefficients add, they do not multiply.' },
        ],
      },
      {
        q: { ru: 'Приведи подобные: 9k − 4k', uz: "O'xshashlarni ixchamlang: 9k − 4k", en: 'Collect like terms: 9k − 4k' },
        opts: ['5k', '5', '13k'],
        correct: 0,
        ok: { ru: 'Верно. 9 − 4 = 5, буква остаётся.', uz: "To'g'ri. 9 − 4 = 5, harf qoladi.", en: 'Right. 9 − 4 = 5 and the letter stays.' },
        wrong: [
          null,
          { ru: 'Буква не исчезает при вычитании.', uz: "Ayirishda harf yo'qolmaydi.", en: 'The letter does not disappear in subtraction.' },
          { ru: 'Здесь вычитание, а не сложение.', uz: "Bu yerda ayirish, qo'shish emas.", en: 'This is subtraction, not addition.' },
        ],
      },
      {
        q: { ru: 'Приведи подобные: a + 7a', uz: "O'xshashlarni ixchamlang: a + 7a", en: 'Collect like terms: a + 7a' },
        opts: ['8a', '7a', '8'],
        correct: 0,
        ok: { ru: 'Верно. У одинокой буквы коэффициент 1, значит 1 + 7 = 8.', uz: "To'g'ri. Yolg'iz harfning koeffitsiyenti 1, demak 1 + 7 = 8.", en: 'Right. A lone letter has coefficient 1, so 1 + 7 = 8.' },
        wrong: [
          null,
          { ru: 'Первое слагаемое тоже считается: у него коэффициент 1.', uz: 'Birinchi had ham hisobga olinadi: uning koeffitsiyenti 1.', en: 'The first term counts too: its coefficient is 1.' },
          { ru: 'Буква обязана остаться.', uz: 'Harf qolishi shart.', en: 'The letter must stay.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на приведение подобных. Меняются только числа впереди.',
        uz: "O'xshashlarni ixchamlash mashqi. Faqat oldidagi sonlar o'zgaradi.",
        en: 'Practice on collecting like terms. Only the numbers in front change.',
      },
    },
  },

  s_mix: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Скобки и знаки', uz: 'Qavslar va ishoralar', en: 'Brackets and signs' },
    lead: { ru: 'Сначала раскрой скобки, потом собери подобные.', uz: "Avval qavslarni oching, keyin o'xshashlarni yig'ing.", en: 'Open the brackets first, then collect.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Упрости: 3x + 4 + 2x', uz: 'Soddalashtiring: 3x + 4 + 2x', en: 'Simplify: 3x + 4 + 2x' },
        opts: ['5x + 4', '9x', '5x + 4x'],
        correct: 0,
        ok: { ru: 'Верно. Буквы к буквам, числа к числам.', uz: "To'g'ri. Harflar harflarga, sonlar sonlarga.", en: 'Right. Letters with letters, numbers with numbers.' },
        wrong: [
          null,
          { ru: 'Четвёрка без буквы, к иксам её не прибавляют.', uz: "To'rt harfsiz, uni ikslarga qo'shilmaydi.", en: 'The four has no letter, it does not join the x terms.' },
          { ru: 'У четвёрки буквы нет, дописывать её нельзя.', uz: "To'rtda harf yo'q, uni yozib qo'yib bo'lmaydi.", en: 'The four has no letter and one cannot be added to it.' },
        ],
      },
      {
        q: { ru: 'Упрости: 2(a + 3) + a', uz: 'Soddalashtiring: 2(a + 3) + a', en: 'Simplify: 2(a + 3) + a' },
        opts: ['3a + 6', '2a + 6', '3a + 3'],
        correct: 0,
        ok: { ru: 'Верно. 2a + 6 + a, дальше 2a + a = 3a.', uz: "To'g'ri. 2a + 6 + a, keyin 2a + a = 3a.", en: 'Right. 2a + 6 + a, then 2a + a = 3a.' },
        wrong: [
          null,
          { ru: 'Последнее слагаемое a тоже подобное.', uz: "Oxirgi a hadi ham o'xshash.", en: 'The last term a is a like term too.' },
          { ru: 'Тройку в скобке умножают на 2.', uz: "Qavsdagi uchni 2 ga ko'paytiriladi.", en: 'The three inside the bracket is multiplied by 2.' },
        ],
      },
      {
        q: { ru: 'Упрости: 5b − (2b + 1)', uz: 'Soddalashtiring: 5b − (2b + 1)', en: 'Simplify: 5b − (2b + 1)' },
        opts: ['3b − 1', '3b + 1', '7b + 1'],
        correct: 0,
        ok: { ru: 'Верно. Минус меняет знаки: 5b − 2b − 1.', uz: "To'g'ri. Minus ishoralarni o'zgartiradi: 5b − 2b − 1.", en: 'Right. The minus flips the signs: 5b − 2b − 1.' },
        wrong: [
          null,
          { ru: 'Единица тоже меняет знак.', uz: "Bir ham ishorasini o'zgartiradi.", en: 'The one flips its sign too.' },
          { ru: 'Перед скобкой минус, а не плюс.', uz: 'Qavs oldida minus turibdi, plyus emas.', en: 'There is a minus before the bracket, not a plus.' },
        ],
      },
      {
        q: { ru: 'Какие слагаемые подобны?', uz: "Qaysi hadlar o'xshash?", en: 'Which terms are alike?' },
        opts: [
          { ru: '4x и 9x', uz: '4x va 9x', en: '4x and 9x' },
          { ru: '4x и 9y', uz: '4x va 9y', en: '4x and 9y' },
          { ru: '4x и 9', uz: '4x va 9', en: '4x and 9' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Буквенные части совпадают.', uz: "To'g'ri. Harfli qismlar mos keladi.", en: 'Right. The letter parts match.' },
        wrong: [
          null,
          { ru: 'Буквы разные, значит не подобны.', uz: "Harflar har xil, demak o'xshash emas.", en: 'Different letters mean they are not alike.' },
          { ru: 'У девятки буквы нет вовсе.', uz: "To'qqizda harf umuman yo'q.", en: 'The nine has no letter at all.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика посложнее. Следите за знаком перед скобкой и не смешивайте буквы с числами.',
        uz: 'Murakkabroq mashq. Qavs oldidagi ishoraga qarang va harflarni sonlar bilan aralashtirmang.',
        en: 'Harder practice. Watch the sign before the bracket and do not mix letters with numbers.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Подобные или нет', uz: "O'xshashmi yoki yo'q", en: 'Alike or not' },
    lead: { ru: 'Смотри только на буквенную часть.', uz: 'Faqat harfli qismga qarang.', en: 'Look only at the letter part.' },
    bin_a: { ru: 'Подобные', uz: "O'xshash", en: 'Alike' },
    bin_b: { ru: 'Не подобные', uz: "O'xshash emas", en: 'Not alike' },
    cards: [
      { label: '2x и 7x', bin: 'a' },
      { label: '5a и a', bin: 'a' },
      { label: '9m и 4m', bin: 'a' },
      { label: '3x и 3y', bin: 'b' },
      { label: '6b и 6', bin: 'b' },
      { label: '4k и 4n', bin: 'b' },
    ],
    hint: {
      ru: 'Числа впереди могут быть любыми, важна только буква.',
      uz: "Oldidagi sonlar istalgan bo'lishi mumkin, faqat harf muhim.",
      en: 'The numbers in front can be anything; only the letter matters.',
    },
    correct_text: {
      ru: 'Верно. Подобие решает буквенная часть, а не коэффициент.',
      uz: "To'g'ri. O'xshashlikni koeffitsiyent emas, harfli qism hal qiladi.",
      en: 'Right. The letter part decides, not the coefficient.',
    },
    audio: {
      intro: {
        ru: 'Разложите пары по двум корзинам. Смотрите только на буквенную часть.',
        uz: 'Juftliklarni ikki savatga ajrating. Faqat harfli qismga qarang.',
        en: 'Sort the pairs into two baskets. Look only at the letter part.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Сравни буквы.', uz: 'Bu yerga emas. Harflarni solishtiring.', en: 'Not here. Compare the letters.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Дилшод: «2a + 3b = 5ab». Проверь.', uz: "Dilshod: «2a + 3b = 5ab». Tekshiring.", en: 'Dilshod: “2a + 3b = 5ab.” Check it.' },
        opts: [
          { ru: 'Нет: буквы разные, упростить нельзя', uz: "Yo'q: harflar har xil, soddalashtirib bo'lmaydi", en: 'No: different letters, it cannot be simplified' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 5a', uz: "Yo'q, 5a bo'ladi", en: 'No, it is 5a' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Подставь a = 1 и b = 2: слева 8, справа 10.', uz: "To'g'ri. a = 1 va b = 2 ni qo'ying: chapda 8, o'ngda 10.", en: 'Right. Substitute a = 1 and b = 2: 8 on the left, 10 on the right.' },
        wrong: [
          null,
          { ru: 'Буквы нельзя приписывать друг к другу.', uz: "Harflarni yonma-yon yozib bo'lmaydi.", en: 'Letters cannot be stuck together.' },
          { ru: 'Слагаемое с буквой b никуда не денется.', uz: 'b harfli had hech qayerga ketmaydi.', en: 'The b term does not disappear.' },
        ],
      },
      {
        q: { ru: 'Нигора: «7x − x = 7». Проверь.', uz: "Nigora: «7x − x = 7». Tekshiring.", en: 'Nigora: “7x − x = 7.” Check it.' },
        opts: [
          { ru: 'Нет: у одинокой буквы коэффициент 1, будет 6x', uz: "Yo'q: yolg'iz harfning koeffitsiyenti 1, 6x bo'ladi", en: 'No: a lone letter has coefficient 1, it is 6x' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 8x', uz: "Yo'q, 8x bo'ladi", en: 'No, it is 8x' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 7 − 1 = 6, буква остаётся.', uz: "To'g'ri. 7 − 1 = 6, harf qoladi.", en: 'Right. 7 − 1 = 6 and the letter stays.' },
        wrong: [
          null,
          { ru: 'Вычли всю букву целиком, а вычесть надо один икс.', uz: "Butun harf ayirilgan, bitta iksni ayirish kerak edi.", en: 'The whole letter was removed, but only one x should go.' },
          { ru: 'Здесь вычитание, значит коэффициент уменьшается.', uz: 'Bu yerda ayirish, demak koeffitsiyent kamayadi.', en: 'This is subtraction, so the coefficient drops.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Подстановка чисел показывает ошибку сразу.',
        uz: "Birovning yechimini tekshiring. Son qo'yish xatoni darrov ko'rsatadi.",
        en: 'Check someone else’s work. Substituting numbers shows the mistake at once.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Инвентарь спортзала', uz: 'Sport zali inventari', en: 'The gym inventory' },
    lead: { ru: 'В коробке x мячей, в связке y скакалок.', uz: "Qutida x ta to'p, bog'lamda y ta arg'amchi.", en: 'A box holds x balls, a bundle holds y ropes.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Было 6 коробок, 2 отдали в другой зал. Сколько мячей осталось?', uz: "6 ta quti bor edi, 2 tasi boshqa zalga berildi. Nechta to'p qoldi?", en: 'There were 6 boxes and 2 were given away. How many balls remain?' },
        opts: ['4x', '4', '8x'],
        correct: 0,
        ok: { ru: 'Верно. 6x − 2x = 4x.', uz: "To'g'ri. 6x − 2x = 4x.", en: 'Right. 6x − 2x = 4x.' },
        wrong: [
          null,
          { ru: 'Четыре чего? Букву терять нельзя.', uz: "To'rtta nima? Harfni yo'qotib bo'lmaydi.", en: 'Four of what? The letter cannot be lost.' },
          { ru: 'Коробки отдали, значит их стало меньше.', uz: 'Qutilar berildi, demak ular kamaydi.', en: 'Boxes were given away, so there are fewer.' },
        ],
      },
      {
        q: { ru: 'В зале 4 коробки и 3 связки, привезли ещё 5 коробок. Запиши всё.', uz: "Zalda 4 ta quti va 3 ta bog'lam bor, yana 5 ta quti keltirildi. Hammasini yozing.", en: 'The hall has 4 boxes and 3 bundles, and 5 more boxes arrived. Write it all.' },
        opts: ['9x + 3y', '12xy', '9x + 3x'],
        correct: 0,
        ok: { ru: 'Верно. Коробки сложились, связки остались отдельно.', uz: "To'g'ri. Qutilar qo'shildi, bog'lamlar alohida qoldi.", en: 'Right. Boxes combined, bundles stayed apart.' },
        wrong: [
          null,
          { ru: 'Разные буквы не складывают и не приписывают.', uz: "Har xil harflar qo'shilmaydi va yonma-yon yozilmaydi.", en: 'Different letters neither add nor stick together.' },
          { ru: 'У связок другая буква.', uz: "Bog'lamlarning harfi boshqa.", en: 'The bundles have a different letter.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про инвентарь. В коробке икс мячей, в связке игрек скакалок.',
        uz: "Inventar haqida masala. Qutida iks ta to'p, bog'lamda igrek ta arg'amchi.",
        en: 'An inventory problem. A box holds x balls, a bundle holds y ropes.',
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
        q: { ru: 'Приведи подобные: 8c + 4c. Набери коэффициент ответа.', uz: "O'xshashlarni ixchamlang: 8c + 4c. Javob koeffitsiyentini tering.", en: 'Collect: 8c + 4c. Type the coefficient of the answer.' },
        hint: { ru: 'Складываются только числа: 8 + 4.', uz: "Faqat sonlar qo'shiladi: 8 + 4.", en: 'Only the numbers add: 8 + 4.' },
        hint_audio: { ru: 'Буквенная часть одинаковая, значит складываем только числа восемь и четыре.', uz: "Harfli qism bir xil, demak faqat sakkiz va to'rt sonlarini qo'shamiz.", en: 'The letter part is the same, so add only eight and four.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Упрости: 10p − 3p', uz: 'Soddalashtiring: 10p − 3p', en: 'Simplify: 10p − 3p' },
        opts: ['7', '13p', '7p', '30p'],
        wrong: [
          { ru: 'Буква обязана остаться.', uz: 'Harf qolishi shart.', en: 'The letter must stay.' },
          { ru: 'Здесь вычитание, а не сложение.', uz: "Bu yerda ayirish, qo'shish emas.", en: 'This is subtraction, not addition.' },
          null,
          { ru: 'Коэффициенты вычитают, а не перемножают.', uz: "Koeffitsiyentlar ayiriladi, ko'paytirilmaydi.", en: 'Coefficients subtract, they do not multiply.' },
        ],
        correct: { ru: 'Верно. 10 − 3 = 7, буква p остаётся.', uz: "To'g'ri. 10 − 3 = 7, p harfi qoladi.", en: 'Right. 10 − 3 = 7 and the p stays.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Можно ли упростить 5a + 2b?', uz: "5a + 2b ni soddalashtirsa bo'ladimi?", en: 'Can 5a + 2b be simplified?' },
        opts: [
          { ru: 'да, будет 7ab', uz: "ha, 7ab bo'ladi", en: 'yes, it is 7ab' },
          { ru: 'нет, буквы разные', uz: "yo'q, harflar har xil", en: 'no, the letters differ' },
          { ru: 'да, будет 7', uz: "ha, 7 bo'ladi", en: 'yes, it is 7' },
          { ru: 'да, будет 7a', uz: "ha, 7a bo'ladi", en: 'yes, it is 7a' },
        ],
        wrong: [
          { ru: 'Буквы нельзя приписывать друг к другу.', uz: "Harflarni yonma-yon yozib bo'lmaydi.", en: 'Letters cannot be stuck together.' },
          null,
          { ru: 'Буквы никуда не деваются.', uz: 'Harflar hech qayerga ketmaydi.', en: 'The letters do not vanish.' },
          { ru: 'Слагаемое с b нельзя превратить в слагаемое с a.', uz: "b hadini a hadiga aylantirib bo'lmaydi.", en: 'The b term cannot become an a term.' },
        ],
        correct: { ru: 'Верно. Подобных слагаемых здесь нет.', uz: "To'g'ri. Bu yerda o'xshash hadlar yo'q.", en: 'Right. There are no like terms here.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Упрости: 3(y + 2) − y', uz: 'Soddalashtiring: 3(y + 2) − y', en: 'Simplify: 3(y + 2) − y' },
        opts: ['3y + 6', '2y + 2', '4y + 6', '2y + 6'],
        wrong: [
          { ru: 'Последнее слагаемое −y тоже подобное.', uz: "Oxirgi −y hadi ham o'xshash.", en: 'The last term −y is a like term too.' },
          { ru: 'Двойку в скобке умножают на 3.', uz: "Qavsdagi ikkini 3 ga ko'paytiriladi.", en: 'The two inside is multiplied by 3.' },
          { ru: 'Перед y стоит минус, значит вычитаем.', uz: 'y oldida minus turibdi, demak ayiramiz.', en: 'There is a minus before y, so we subtract.' },
          null,
        ],
        correct: { ru: 'Верно. 3y + 6 − y = 2y + 6.', uz: "To'g'ri. 3y + 6 − y = 2y + 6.", en: 'Right. 3y + 6 − y = 2y + 6.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'В коробке x мячей. 5 коробок и ещё 3 — сколько мячей?', uz: "Qutida x ta to'p. 5 ta quti va yana 3 tasi — nechta to'p?", en: 'A box holds x balls. 5 boxes and 3 more: how many balls?' },
        opts: ['8x', '8', '15x', 'x + 8'],
        wrong: [
          null,
          { ru: 'Восемь чего? Букву терять нельзя.', uz: "Sakkizta nima? Harfni yo'qotib bo'lmaydi.", en: 'Eight of what? The letter cannot be lost.' },
          { ru: 'Коробки складывают, а не перемножают.', uz: "Qutilar qo'shiladi, ko'paytirilmaydi.", en: 'Boxes add, they do not multiply.' },
          { ru: 'Коробок стало восемь, каждая по x мячей.', uz: "Qutilar sakkizta bo'ldi, har birida x tadan to'p.", en: 'There are eight boxes, each with x balls.' },
        ],
        correct: { ru: 'Верно. 5x + 3x = 8x.', uz: "To'g'ri. 5x + 3x = 8x.", en: 'Right. 5x + 3x = 8x.' },
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
      ru: 'Складывать можно только одинаковое — это правило работает и за пределами тетради. В 1999 году аппарат Mars Climate Orbiter сгорел в атмосфере Марса: одна группа инженеров считала силу в фунтах, другая в ньютонах, и числа сложили как подобные, хотя они таковыми не были. Ошибка стоила 125 миллионов долларов.',
      uz: "Faqat bir xilini qo'shish mumkin — bu qoida daftardan tashqarida ham ishlaydi. 1999 yilda Mars Climate Orbiter apparati Mars atmosferasida yonib ketdi: muhandislarning bir guruhi kuchni funtda, ikkinchisi nyutonda hisoblagan, sonlar esa o'xshash hadlardek qo'shilgan edi, holbuki ular o'xshash emas edi. Xato 125 million dollarga tushdi.",
      en: 'Only alike things can be added, and that rule reaches far beyond a notebook. In 1999 the Mars Climate Orbiter burned up in the Martian atmosphere: one engineering team worked in pounds of force, another in newtons, and the numbers were added as if alike when they were not. The mistake cost 125 million dollars.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Складывать можно только одинаковое, и это правило работает не только в тетради. В тысяча девятьсот девяносто девятом году аппарат Марс Климат Орбитер сгорел в атмосфере Марса: одна группа инженеров считала силу в фунтах, другая в ньютонах, а числа сложили как подобные, хотя они таковыми не были. Ошибка стоила сто двадцать пять миллионов долларов.',
      uz: "Bilasizmi? Faqat bir xilini qo'shish mumkin va bu qoida daftardagina emas. Ming to'qqiz yuz to'qson to'qqizinchi yilda Mars Klimat Orbiter apparati Mars atmosferasida yonib ketdi: muhandislarning bir guruhi kuchni funtda, ikkinchisi nyutonda hisoblagan, sonlar esa o'xshash hadlardek qo'shilgan. Xato bir yuz yigirma besh million dollarga tushdi.",
      en: 'Did you know? Only alike things can be added, and that rule is not just about notebooks. In nineteen ninety nine the Mars Climate Orbiter burned up in the Martian atmosphere: one engineering team worked in pounds of force, another in newtons, and the numbers were added as if alike. The mistake cost one hundred twenty five million dollars.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Выражения', uz: 'Matematika · Ifodalar', en: 'Mathematics · Expressions' },
    heading: { ru: 'Подобные слагаемые', uz: "O'xshash hadlar", en: 'Like terms' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'подобные — с одинаковой буквенной частью', uz: "o'xshash — harfli qismi bir xil", en: 'alike means the same letter part' },
    brief_2: { ru: 'складывают только коэффициенты', uz: "faqat koeffitsiyentlar qo'shiladi", en: 'only the coefficients add' },
    brief_3: { ru: 'разные буквы не складываются', uz: "har xil harflar qo'shilmaydi", en: 'different letters do not add' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Одинокая буква', uz: "Yolg'iz harf", en: 'A lone letter' },
    memo_a1: { ru: 'имеет коэффициент 1', uz: 'koeffitsiyenti 1 ga teng', en: 'has coefficient 1' },
    memo_q2: { ru: 'Порядок работы', uz: 'Ish tartibi', en: 'The working order' },
    memo_a2: { ru: 'скобки, потом подобные', uz: "qavslar, keyin o'xshashlar", en: 'brackets, then like terms' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'потерять буквенную часть', uz: "harfli qismni yo'qotish", en: 'losing the letter part' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Подобные слагаемые это слагаемые с одинаковой буквенной частью. Приводя их, складывают или вычитают коэффициенты, а буквенную часть оставляют. Слагаемые с разными буквами не складывают. Если есть скобки, их раскрывают первыми.',
        'Спортзал: пять икс плюс три икс это восемь икс.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "O'xshash hadlar bu harfli qismi bir xil bo'lgan hadlar. Ularni ixchamlashda koeffitsiyentlar qo'shiladi yoki ayiriladi, harfli qism esa qoladi. Har xil harfli hadlar qo'shilmaydi. Qavslar bo'lsa, avval ular ochiladi.",
        "Sport zali: besh iks qo'shuv uch iks bu sakkiz iks.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Like terms are terms with the same letter part. To collect them, add or subtract the coefficients and keep the letter part. Terms with different letters do not add. If there are brackets, open them first.',
        'The gym: five x plus three x is eight x.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Собери по буквам', uz: "Usul. Harflar bo'yicha yig'ing", en: 'Method. Gather by letters' },
    m1_steps: {
      ru: ['Раскрой скобки, если они есть', 'Найди слагаемые с одинаковой буквой', 'Сложи их коэффициенты, букву оставь'],
      uz: ["Qavslar bo'lsa, ularni oching", 'Harfi bir xil hadlarni toping', "Ularning koeffitsiyentlarini qo'shing, harfni qoldiring"],
      en: ['Open the brackets if there are any', 'Find terms with the same letter', 'Add their coefficients and keep the letter'],
    },
    m1_no: {
      ru: 'Слагаемые с разными буквами и числа без букв остаются на своих местах.',
      uz: "Har xil harfli hadlar va harfsiz sonlar o'z joyida qoladi.",
      en: 'Terms with different letters and plain numbers stay where they are.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кладовка спортзала, инвентарь в подписанных коробках.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d33wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE4D2"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d33wall)"/>

    {/* Шведская стенка и баскетбольное кольцо */}
    <g opacity="0.85">
      <rect x="10" y="14" width="5" height="104" fill="#C9A472"/>
      <rect x="58" y="14" width="5" height="104" fill="#C9A472"/>
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x="10" y={22 + i * 17} width="53" height="4" rx="2" fill="#D9B989"/>
      ))}
    </g>
    <g>
      <rect x="330" y="16" width="42" height="30" rx="3" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <circle cx="351" cy="52" r="9" fill="none" stroke="#D9603F" strokeWidth="2.4"/>
      <path d="M343 56 q8 12 16 0" fill="none" stroke="#D9603F" strokeWidth="1.6"/>
    </g>

    {/* Пять коробок в зале */}
    {[0, 1, 2, 3, 4].map((k) => (
      <g key={'a' + k} transform={`translate(${86 + k * 34}, 84)`}>
        <rect x="0" y="0" width="28" height="26" rx="3" fill="#F5C77E" stroke="#C9A472" strokeWidth="1.6"/>
        <circle cx="9" cy="12" r="5" fill="#D9603F"/>
        <circle cx="19" cy="12" r="5" fill="#D9603F"/>
        <text x="14" y="24" textAnchor="middle" fill="#8A6A22"
          fontFamily="'JetBrains Mono', monospace" fontSize="7" fontWeight="700">x</text>
      </g>
    ))}

    {/* Три коробки, которые вносят из кладовки */}
    <g className="d33-bring">
      {[0, 1, 2].map((k) => (
        <g key={'b' + k} transform={`translate(${k * 34}, 0)`}>
          <rect x="0" y="0" width="28" height="26" rx="3" fill="#8FBF7F" stroke="#6FA463" strokeWidth="1.6"/>
          <circle cx="9" cy="12" r="5" fill="#D9603F"/>
          <circle cx="19" cy="12" r="5" fill="#D9603F"/>
          <text x="14" y="24" textAnchor="middle" fill="#3F5B4A"
            fontFamily="'JetBrains Mono', monospace" fontSize="7" fontWeight="700">x</text>
        </g>
      ))}
    </g>

    {/* Дверь кладовки и физрук со свистком */}
    <rect x="292" y="66" width="34" height="52" rx="3" fill="#B08A55"/>
    <circle cx="298" cy="94" r="2.4" fill="#F4EEDF"/>
    <Person x={262} ground={118} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={96} ground={140} head={12} shirt="#8FBF7F" hair="#5A4636"/>
    <rect x="0" y="140" width="400" height="14" fill="#D2A96F"/>
  </svg>
);

// Итог: коробки собрались в одну запись.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      {Array.from({ length: 8 }, (_, k) => (
        <g key={k} transform={`translate(${22 + k * 26}, 20)`}>
          <rect x="0" y="0" width="20" height="20" rx="3" fill="#F5C77E" stroke="#C9A472" strokeWidth="1.4"/>
          <text x="10" y="14" textAnchor="middle" fill="#8A6A22"
            fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">x</text>
        </g>
      ))}
      <text x="300" y="36" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="24" fontWeight="700">8x</text>
      <text x="200" y="70" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'коэффициенты сложились, буква осталась',
          "koeffitsiyentlar qo'shildi, harf qoldi",
          'the coefficients added, the letter stayed')}
      </text>
      <text x="200" y="86" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">5x + 3x = 8x</text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: ряд коробок, где видно, сколько их и что внутри одно и то же.
const BoxRow = ({ groups }) => (
  <span className="d33-boxes">
    {groups.map((g, gi) => (
      <span key={gi} className="d33-group">
        {Array.from({ length: g.n }, (_, k) => (
          <i key={k} className={'d33-box d33-box-' + (g.tone || 'a')}>{g.letter}</i>
        ))}
        {g.caption && <b className="d33-cap">{g.caption}</b>}
      </span>
    ))}
  </span>
);

// Разбор записи: подобные слагаемые подсвечены одним цветом.
const Terms = ({ parts, on }) => (
  <span className="d33-terms">
    {parts.map((p, i) => (
      <i key={i} className={'d33-term d33-term-' + (p.kind || 'n') + (on && p.hit ? ' d33-term-hit' : '')}>{p.s}</i>
    ))}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d33-line d33-fade' + (on ? ' d33-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d33-stage">
        <span className="d33-split">
          <i className="d33-split-k">5</i>
          <i className="d33-split-v">x</i>
        </span>
        <span className={'d33-chips d33-fade' + (step >= 1 ? ' d33-on' : '')}>
          <i className="d33-chip-r">{tri(lang, 'коэффициент', 'koeffitsiyent', 'coefficient')}</i>
          <i className="d33-chip-l">{tri(lang, 'буквенная часть', 'harfli qism', 'letter part')}</i>
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

// Ядро: пять коробок и ещё три.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d33-stage">
        <BoxRow groups={step >= 1
          ? [{ n: 8, letter: 'x', tone: 'c', caption: '8x' }]
          : [{ n: 5, letter: 'x', tone: 'a', caption: '5x' }, { n: 3, letter: 'x', tone: 'b', caption: '3x' }]}/>
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

// Разные буквы: коробки и скакалки.
const DiffBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_diff;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d33-stage">
        <BoxRow groups={[
          { n: 3, letter: 'a', tone: 'a', caption: '3a' },
          { n: 4, letter: 'b', tone: 'd', caption: '4b' },
        ]}/>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        <span className={'d33-mix d33-fade' + (step >= 2 ? ' d33-on' : '')}>{mt(t(c.mix))}</span>
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
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d33-stage">
        <Terms on={step >= 1} parts={step >= 1
          ? [{ s: '4x', kind: 'v', hit: true }, { s: '+ 8', kind: 'n' }, { s: '− 3x', kind: 'v', hit: true }]
          : [{ s: '4(x + 2)', kind: 'v' }, { s: '− 3x', kind: 'v' }]}/>
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

// Граница: буква теряется, буквы приписывают друг к другу.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d33-stage">
        <span className="d33-pair d33-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d33-pair d33-pair-good d33-fade' + (step >= 1 ? ' d33-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d33-pair d33-pair-warn d33-fade' + (step >= 2 ? ' d33-on' : '')}>
          <Line node={t(c.warn_line)} on/>
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
        <div className={'d33-banner fade-up delay-1' + (phase === 'play' ? ' d33-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d33-stage d33-stage-tool">
          {phase === 'demo' ? (
            <>
              <Terms on={shown >= 1} parts={shown >= 2
                ? [{ s: '5a', kind: 'v', hit: true }]
                : [{ s: '7a', kind: 'v', hit: true }, { s: '− 2a', kind: 'v', hit: true }]}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d33-verdict' + (done ? ' d33-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d33-acts fade-up">
            <button className="d33-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d33-btn d33-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenDiff = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_diff} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <DiffBody step={step}/>}/>
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
      <div className="d33-stage">
        <BoxRow groups={[{ n: 8, letter: 'x', tone: 'c', caption: '5x + 3x = 8x' }]}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenSame = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_same} asideNode={methodAside}/>
);
const ScreenMix = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_mix} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: инвентарь на полке.
const TaskFig = ({ idx }) => (
  <div className="d33-task-fig">
    <BoxRow groups={idx >= 1
      ? [{ n: 9, letter: 'x', tone: 'a', caption: '9x' }, { n: 3, letter: 'y', tone: 'd', caption: '3y' }]
      : [{ n: 6, letter: 'x', tone: 'a', caption: '6x' }]}/>
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
.d33-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d33-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d33-stage-tool .d33-line { font-size: clamp(12px, 2vw, 16px); }

.d33-fade { opacity: 0; transition: opacity 420ms linear; }
.d33-on { opacity: 1; }
.d33-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.2vw, 17px); font-weight: 700; color: #494550; text-align: center; }
.d33-mix { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 20px); font-weight: 700; color: #1F7A4D; }

/* Коробки инвентаря */
.d33-boxes { display: flex; gap: clamp(10px, 2.2vw, 20px); flex-wrap: wrap; justify-content: center; align-items: flex-start; }
.d33-group { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.d33-group { flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px; }
.d33-box { font-style: normal; width: clamp(20px, 3.6vw, 28px); height: clamp(20px, 3.6vw, 28px); display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.8vw, 14px); font-weight: 700; }
.d33-box-a { background: #FBF3D6; border: 1px solid #E4CE93; color: #8A6A22; }
.d33-box-b { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }
.d33-box-c { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }
.d33-box-d { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d33-cap { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; margin-left: 6px; }

/* Разбор записи */
.d33-terms { display: inline-flex; gap: clamp(6px, 1.3vw, 11px); flex-wrap: wrap; justify-content: center; align-items: center; }
.d33-term { font-style: normal; padding: 6px 13px; border-radius: 11px; font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 22px); font-weight: 700; background: #F4F1EA; border: 1px solid #E9E3D9; color: #494550; transition: background-color 320ms linear, border-color 320ms linear, color 320ms linear; }
.d33-term-hit { background: #E7F5FA; border-color: #B6DCEA; color: #019ACB; }
.d33-term-n { color: #8A6A22; background: #FBF3D6; border-color: #E4CE93; }

/* Коэффициент и буква */
.d33-split { display: inline-flex; align-items: baseline; gap: 4px; }
.d33-split i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(26px, 5vw, 42px); font-weight: 700; }
.d33-split-k { color: #D9603F; }
.d33-split-v { color: #019ACB; }

/* Подписи */
.d33-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d33-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d33-chip-r { background: #FFF1EC; border: 1px solid #F3C4B4; color: #D9603F; }
.d33-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }

/* Строки экрана границы */
.d33-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d33-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d33-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d33-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d33-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d33-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d33-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d33-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d33-verdict-on { opacity: 1; }
.d33-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d33-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d33-btn:disabled { opacity: 0.45; cursor: default; }
.d33-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d33-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: три коробки вносят из кладовки */
.d33-bring { animation: d33Bring 6000ms ease-in-out infinite; }
@keyframes d33Bring { 0%, 12% { transform: translate(296px, 84px); opacity: 0.2; } 45%, 100% { transform: translate(258px, 84px); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d33-bring { animation: none; transform: translate(258px, 84px); } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function LikeTermsLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenDiff, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenSame, ScreenMix, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
