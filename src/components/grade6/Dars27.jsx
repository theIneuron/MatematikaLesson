// ============================================================
// 6 КЛАСС, УРОК 27 «Сложение рациональных чисел»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б7: действия. Сложение показывается как два шага по координатной
// прямой из урока 24, а правила знаков выводятся из модулей урока 25 —
// не заучиваются, а получаются на чертеже.
//
// Сцена — викторина в классе: табло команды с очками и штрафами.
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
  lessonId: 'grade6-27',
  lessonTitle: {
    ru: 'Сложение рациональных чисел',
    uz: "Ratsional sonlarni qo'shish",
    en: 'Adding rational numbers',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 viktorina: 5 ochko va 8 jarima
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 chiziq bo'ylab siljish esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 qo'shish = ikki qadam
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: bir xil ishoralar
  { id: 's_diff',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 har xil ishoralar
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: zanjir
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: qarama-qarshilar yig'indisi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_same',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 bir xil ishoralar x3
  { id: 's_mixed',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 har xil ishoralar x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: yig'indi musbatmi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: viktorina
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: { ru: 'Очки и штрафы', uz: 'Ochkolar va jarimalar', en: 'Points and penalties' },
    lead: {
      ru: 'На викторине команда набрала 5 очков, а потом получила штраф в 8 очков.',
      uz: "Viktorinada jamoa 5 ochko to'pladi, keyin 8 ochko jarima oldi.",
      en: 'In the quiz a team scored 5 points and then took an 8 point penalty.',
    },
    voice_a: { ru: 'Азиз: у нас теперь 3 очка.', uz: 'Aziz: endi bizda 3 ochko.', en: 'Aziz: we have 3 points now.' },
    voice_b: { ru: 'Дилноза: нет, у нас минус 3.', uz: "Dilnoza: yo'q, bizda minus 3.", en: 'Dilnoza: no, we are at minus 3.' },
    ask: { ru: 'Сколько очков у команды?', uz: 'Jamoada necha ochko bor?', en: 'What is the team score?' },
    options: [
      { ru: '3 очка', uz: '3 ochko', en: '3 points' },
      { ru: '−3 очка', uz: '−3 ochko', en: '−3 points' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'На классной викторине команда набрала пять очков, а потом ошиблась и получила штраф в восемь очков.',
          'Азиз говорит, что у команды теперь три очка, а Дилноза что минус три. Сколько очков у команды? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Sinf viktorinasida jamoa besh ochko to'pladi, keyin xato qilib sakkiz ochko jarima oldi.",
          "Aziz endi jamoada uch ochko deydi, Dilnoza esa minus uch deydi. Jamoada necha ochko bor? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'In the class quiz a team scored five points, then made a mistake and took an eight point penalty.',
          'Aziz says the team now has three points, Dilnoza says minus three. What is the score? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Шаги по прямой', uz: "Chiziq bo'ylab qadamlar", en: 'Steps along the line' },
    done: {
      ru: 'Вправо — увеличиваем, влево — уменьшаем. Сегодня каждое слагаемое станет таким шагом.',
      uz: "O'ngga — oshiramiz, chapga — kamaytiramiz. Bugun har bir qo'shiluvchi shunday qadamga aylanadi.",
      en: 'Right increases, left decreases. Today every addend becomes such a step.',
    },
    audio: {
      ru: [
        'Вспомним двадцать четвёртый урок. Движение вправо по координатной прямой увеличивает число.',
        'Движение влево уменьшает. Точка из минус двух после четырёх шагов вправо попадает в двойку.',
        'Сегодня мы посмотрим на сложение как на такие шаги: положительное слагаемое ведёт вправо, отрицательное влево.',
      ],
      uz: [
        "Yigirma to'rtinchi darsni eslaymiz. Koordinata chizig'ida o'ngga harakat sonni oshiradi.",
        "Chapga harakat kamaytiradi. Minus ikkidagi nuqta to'rt qadam o'ngga yurib ikkiga tushadi.",
        "Bugun qo'shishga shunday qadamlar deb qaraymiz: musbat qo'shiluvchi o'ngga, manfiysi chapga olib boradi.",
      ],
      en: [
        'Recall lesson twenty four. Moving right along the line increases a number.',
        'Moving left decreases it. A point at minus two lands on two after four steps right.',
        'Today we look at addition as such steps: a positive addend leads right, a negative one leads left.',
      ],
    },
  },

  s_core: {
    title: { ru: 'Сложение — это два шага', uz: "Qo'shish — ikki qadam", en: 'Addition is two steps' },
    lines: [
      { ru: 'от нуля идём вправо на 5: это очки', uz: "noldan o'ngga 5 qadam: bu ochkolar", en: 'from zero five steps right: the points' },
      { ru: 'потом влево на 8: это штраф', uz: 'keyin chapga 8 qadam: bu jarima', en: 'then eight steps left: the penalty' },
      { ru: '5 + (−8) = −3', uz: '5 + (−8) = −3', en: '5 + (−8) = −3' },
    ],
    done: {
      ru: 'Штраф больше набранного, поэтому точка ушла левее нуля. У команды −3 очка. Права была Дилноза.',
      uz: "Jarima to'plangandan katta, shuning uchun nuqta noldan chapga o'tdi. Jamoada −3 ochko. Dilnoza haq edi.",
      en: 'The penalty is bigger than the score, so the point moved left of zero. The team is at −3. Dilnoza was right.',
    },
    audio: {
      ru: [
        'Поставим счёт на прямую. Сначала команда набрала пять очков: идём от нуля вправо на пять.',
        'Потом штраф восемь очков: идём влево на восемь. Проходим ноль и оказываемся слева от него.',
        'Получилось минус три. Азиз просто вычел меньшее из большего и забыл, что штраф больше набранного. Права была Дилноза.',
      ],
      uz: [
        "Hisobni chiziqqa qo'yamiz. Avval jamoa besh ochko to'pladi: noldan o'ngga besh qadam.",
        "Keyin sakkiz ochko jarima: chapga sakkiz qadam. Noldan o'tib, uning chap tomoniga tushamiz.",
        "Minus uch chiqdi. Aziz shunchaki kichikni kattadan ayirdi va jarima to'plangandan katta ekanini unutdi. Dilnoza haq edi.",
      ],
      en: [
        'Put the score on the line. First the team earned five points: five steps right from zero.',
        'Then the eight point penalty: eight steps left. We pass zero and end up on its left.',
        'That gives minus three. Aziz simply subtracted the smaller from the bigger and forgot the penalty was larger. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Одинаковые знаки', uz: 'Bir xil ishoralar', en: 'Same signs' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '−4 + (−3): оба шага влево', uz: '−4 + (−3): ikkala qadam ham chapga', en: '−4 + (−3): both steps go left' },
      { ru: 'модули 4 и 3 складываем: 7', uz: "modullar 4 va 3 qo'shiladi: 7", en: 'add the absolute values 4 and 3: 7' },
      { ru: 'знак остаётся общий: −7', uz: 'ishora umumiy qoladi: −7', en: 'the common sign stays: −7' },
    ],
    demo_note: {
      ru: 'Если знаки одинаковые, движение идёт в одну сторону: модули складываются, а знак остаётся тот же.',
      uz: "Ishoralar bir xil bo'lsa, harakat bir tomonga boradi: modullar qo'shiladi, ishora esa o'sha qoladi.",
      en: 'With equal signs the movement goes one way: the absolute values add and the sign stays.',
    },
    play_ask: { ru: 'Сколько будет −6 + (−2)?', uz: '−6 + (−2) nechaga teng?', en: 'What is −6 + (−2)?' },
    play_opts: ['−8', '8', '−4'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. Оба шага влево: 6 + 2 = 8, знак минус.',
      uz: "To'g'ri. Ikkala qadam ham chapga: 6 + 2 = 8, ishora minus.",
      en: 'Right. Both steps go left: 6 + 2 = 8 with a minus sign.',
    },
    play_wrong: [
      null,
      { ru: 'Знак потерялся: мы шли влево от нуля, значит ответ отрицательный.', uz: "Ishora yo'qolgan: biz noldan chapga yurdik, demak javob manfiy.", en: 'The sign was lost: we moved left, so the answer is negative.' },
      { ru: 'Это вычитание модулей, оно бывает при разных знаках.', uz: "Bu modullarni ayirish, u har xil ishoralarda bo'ladi.", en: 'That subtracts the absolute values, which happens with different signs.' },
    ],
    audio: {
      intro: {
        ru: 'Начнём с простого случая: оба числа отрицательные. Покажу на минус четырёх и минус трёх.',
        uz: "Oddiy holdan boshlaymiz: ikkala son ham manfiy. Minus to'rt va minus uchda ko'rsataman.",
        en: 'Start with the easy case: both numbers negative. I will show it on minus four and minus three.',
      },
      demo: {
        ru: 'Оба шага идут влево. Значит расстояния складываются: четыре плюс три семь. Уходим влево, поэтому ответ минус семь.',
        uz: "Ikkala qadam ham chapga boradi. Demak masofalar qo'shiladi: to'rt qo'shuv uch yetti. Chapga ketdik, shuning uchun javob minus yetti.",
        en: 'Both steps go left, so the distances add: four plus three is seven. We moved left, so the answer is minus seven.',
      },
      play: {
        ru: 'Теперь ваша очередь. Сколько будет минус шесть плюс минус два?',
        uz: 'Endi sizning navbatingiz. Minus olti plyus minus ikki nechaga teng?',
        en: 'Now it is your turn. What is minus six plus minus two?',
      },
      ok: {
        ru: 'Верно. Шесть и два дают восемь, а движение влево даёт минус.',
        uz: "To'g'ri. Olti va ikki sakkizni beradi, chapga harakat esa minusni beradi.",
        en: 'Right. Six and two make eight and moving left gives the minus.',
      },
      wrong: {
        ru: 'Если оба слагаемых отрицательные, сложите их модули и поставьте минус.',
        uz: "Ikkala qo'shiluvchi manfiy bo'lsa, modullarini qo'shing va minus qo'ying.",
        en: 'If both addends are negative, add the absolute values and put a minus.',
      },
    },
  },

  s_diff: {
    title: { ru: 'Разные знаки', uz: 'Har xil ishoralar', en: 'Different signs' },
    lines: [
      { ru: '−9 + 4: шаги в разные стороны', uz: '−9 + 4: qadamlar har xil tomonga', en: '−9 + 4: the steps go opposite ways' },
      { ru: 'модули 9 и 4, вычитаем: 9 − 4 = 5', uz: 'modullar 9 va 4, ayiramiz: 9 − 4 = 5', en: 'absolute values 9 and 4, subtract: 9 − 4 = 5' },
      { ru: 'знак берём у большего модуля: −5', uz: 'ishorani moduli kattasidan olamiz: −5', en: 'the sign comes from the bigger one: −5' },
    ],
    done: {
      ru: 'Шаги гасят друг друга, поэтому модули вычитаются. Кто прошёл дальше от нуля, тот и задаёт знак.',
      uz: "Qadamlar bir-birini so'ndiradi, shuning uchun modullar ayiriladi. Noldan uzoqroq ketgani ishorani belgilaydi.",
      en: 'The steps cancel each other, so the absolute values subtract. Whoever went further from zero sets the sign.',
    },
    audio: {
      ru: [
        'Теперь случай посложнее: знаки разные. Минус девять плюс четыре.',
        'Первый шаг ведёт влево на девять, второй вправо на четыре. Шаги гасят друг друга, поэтому из большего модуля вычитаем меньший: девять минус четыре пять.',
        'Осталось решить знак. Влево прошли дальше, значит точка так и осталась слева от нуля. Ответ минус пять.',
      ],
      uz: [
        "Endi murakkabroq hol: ishoralar har xil. Minus to'qqiz plyus to'rt.",
        "Birinchi qadam chapga to'qqiz, ikkinchisi o'ngga to'rt. Qadamlar bir-birini so'ndiradi, shuning uchun katta moduldan kichigini ayiramiz: to'qqiz minus to'rt besh.",
        "Ishorani hal qilish qoldi. Chapga uzoqroq yurdik, demak nuqta nolning chapida qoldi. Javob minus besh.",
      ],
      en: [
        'Now the harder case: different signs. Minus nine plus four.',
        'The first step goes nine left, the second four right. They cancel each other, so subtract the smaller absolute value from the bigger: nine minus four is five.',
        'The sign remains. We went further left, so the point stayed left of zero. The answer is minus five.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Цепочка из трёх слагаемых', uz: "Uch qo'shiluvchidan iborat zanjir", en: 'A chain of three addends' },
    lead: { ru: 'Считаем −7 + 10 + (−5) по шагам.', uz: '−7 + 10 + (−5) ni qadamlab hisoblaymiz.', en: 'Compute −7 + 10 + (−5) step by step.' },
    steps: [
      { ru: '−7 + 10 = 3', uz: '−7 + 10 = 3', en: '−7 + 10 = 3' },
      { ru: '3 + (−5) = −2', uz: '3 + (−5) = −2', en: '3 + (−5) = −2' },
      { ru: 'итог: −2', uz: 'natija: −2', en: 'result: −2' },
    ],
    done: {
      ru: 'Складываем по порядку слева направо, каждый раз двигаясь по прямой. Можно и иначе: сначала все плюсы, потом все минусы.',
      uz: "Chapdan o'ngga tartib bilan qo'shamiz, har safar chiziq bo'ylab yurib. Boshqacha ham bo'ladi: avval barcha plyuslar, keyin minuslar.",
      en: 'Add in order from left to right, moving along the line each time. Another way: all pluses first, then all minuses.',
    },
    audio: {
      ru: [
        'Решаем вместе. Минус семь плюс десять плюс минус пять.',
        'Первый шаг: минус семь плюс десять. Знаки разные, модули десять и семь, разность три, знак у большего модуля плюс. Получилось три.',
        'Второй шаг: три плюс минус пять. Снова разные знаки, разность два, знак минус. Итог минус два. Можно было сложить отдельно плюсы и минусы: десять и минус двенадцать дают то же самое.',
      ],
      uz: [
        "Birga yechamiz. Minus yetti plyus o'n plyus minus besh.",
        "Birinchi qadam: minus yetti plyus o'n. Ishoralar har xil, modullar o'n va yetti, ayirma uch, ishora katta modulniki, ya'ni plyus. Uch chiqdi.",
        "Ikkinchi qadam: uch plyus minus besh. Yana har xil ishoralar, ayirma ikki, ishora minus. Natija minus ikki. Plyus va minuslarni alohida qo'shsa ham bo'lardi: o'n va minus o'n ikki xuddi shuni beradi.",
      ],
      en: [
        'Let us solve it together. Minus seven plus ten plus minus five.',
        'First step: minus seven plus ten. Different signs, absolute values ten and seven, difference three, the sign of the bigger one is plus. That gives three.',
        'Second step: three plus minus five. Different signs again, difference two, sign minus. The result is minus two. We could also add pluses and minuses separately: ten and minus twelve give the same.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Знак второго слагаемого', uz: "Ikkinchi qo'shiluvchining ishorasi", en: 'The sign of the second addend' },
    zero_line: { ru: '7 + (−7) = 0: противоположные гасят друг друга', uz: "7 + (−7) = 0: qarama-qarshilar bir-birini so'ndiradi", en: '7 + (−7) = 0: opposites cancel out' },
    bad_line: { ru: 'ошибка: 5 + (−8) = 3, знак потерян', uz: "xato: 5 + (−8) = 3, ishora yo'qolgan", en: 'mistake: 5 + (−8) = 3 with the sign lost' },
    good_line: { ru: 'верно: 5 + (−8) = −3', uz: "to'g'ri: 5 + (−8) = −3", en: 'right: 5 + (−8) = −3' },
    done: {
      ru: 'Прибавить отрицательное значит шагнуть влево. Проверяйте по прямой: если влево прошли дальше, ответ отрицательный.',
      uz: "Manfiy sonni qo'shish chapga qadam tashlash demak. Chiziq bo'yicha tekshiring: chapga uzoqroq ketilgan bo'lsa, javob manfiy.",
      en: 'Adding a negative means stepping left. Check on the line: if you went further left, the answer is negative.',
    },
    audio: {
      ru: [
        'Сначала красивый случай. Семь плюс минус семь равно нулю: шаги одинаковой длины в разные стороны возвращают точку в начало.',
        'А вот частая ошибка. Пять плюс минус восемь пишут как три, просто вычитая меньшее из большего.',
        'Но шаг влево длиннее, значит точка ушла за ноль. Правильный ответ минус три. Всегда смотрите, в какую сторону перевесило.',
      ],
      uz: [
        "Avval chiroyli hol. Yetti plyus minus yetti nolga teng: bir xil uzunlikdagi qadamlar har xil tomonga nuqtani boshiga qaytaradi.",
        "Mana tez-tez uchraydigan xato. Besh plyus minus sakkizni kichikni kattadan ayirib, uch deb yozishadi.",
        "Lekin chapga qadam uzunroq, demak nuqta noldan o'tib ketdi. To'g'ri javob minus uch. Doim qaysi tomon og'irroq kelganiga qarang.",
      ],
      en: [
        'First a neat case. Seven plus minus seven is zero: equal steps in opposite directions bring the point back to the start.',
        'And here is the common mistake. Five plus minus eight gets written as three by subtracting the smaller from the bigger.',
        'But the left step is longer, so the point crossed zero. The right answer is minus three. Always check which way outweighed.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'Как складывать', uz: "Qanday qo'shiladi", en: 'How to add' },
    rule_1: {
      ru: 'Если знаки одинаковые, складываем модули и оставляем общий знак. Если знаки разные, из большего модуля вычитаем меньший и берём знак числа с большим модулем.',
      uz: "Ishoralar bir xil bo'lsa, modullarni qo'shamiz va umumiy ishorani qoldiramiz. Har xil bo'lsa, katta moduldan kichigini ayiramiz va moduli katta sonning ishorasini olamiz.",
      en: 'With equal signs add the absolute values and keep the common sign. With different signs subtract the smaller absolute value from the bigger and take the sign of the number with the bigger one.',
    },
    rule_2: {
      ru: 'Прибавить отрицательное значит шагнуть влево, сумма противоположных равна нулю. Викторина: 5 + (−8) = −3, права была Дилноза.',
      uz: "Manfiy sonni qo'shish chapga qadam demak, qarama-qarshilar yig'indisi nolga teng. Viktorina: 5 + (−8) = −3, Dilnoza haq edi.",
      en: 'Adding a negative means stepping left, and opposites add to zero. The quiz: 5 + (−8) = −3, so Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Если знаки одинаковые, складываем модули и оставляем общий знак. Если знаки разные, из большего модуля вычитаем меньший и берём знак того числа, у которого модуль больше. Сумма противоположных чисел равна нулю. Вернёмся к викторине. Пять плюс минус восемь это минус три очка. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Ishoralar bir xil bo'lsa, modullarni qo'shamiz va umumiy ishorani qoldiramiz. Har xil bo'lsa, katta moduldan kichigini ayiramiz va moduli katta sonning ishorasini olamiz. Qarama-qarshi sonlar yig'indisi nolga teng. Viktorinaga qaytamiz. Besh plyus minus sakkiz bu minus uch ochko. Dilnoza haq edi.",
      en: 'Let us remember the rule. With equal signs add the absolute values and keep the common sign. With different signs subtract the smaller from the bigger and take the sign of the number with the bigger absolute value. Opposites add to zero. Back to the quiz. Five plus minus eight is minus three points. Dilnoza was right.',
    },
  },

  s_same: {
    title: { ru: 'Одинаковые знаки', uz: 'Bir xil ishoralar', en: 'Same signs' },
    lead: { ru: 'Складываем модули, знак оставляем общий.', uz: "Modullarni qo'shamiz, ishorani umumiy qoldiramiz.", en: 'Add the absolute values and keep the common sign.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '−5 + (−4)', uz: '−5 + (−4)', en: '−5 + (−4)' },
        opts: ['−9', '9', '−1'],
        correct: 0,
        ok: { ru: 'Верно. 5 + 4 = 9, оба шага влево.', uz: "To'g'ri. 5 + 4 = 9, ikkala qadam ham chapga.", en: 'Right. 5 + 4 = 9 and both steps go left.' },
        wrong: [
          null,
          { ru: 'Знак потерялся: оба слагаемых отрицательные.', uz: "Ishora yo'qolgan: ikkala qo'shiluvchi ham manfiy.", en: 'The sign was lost: both addends are negative.' },
          { ru: 'Модули вычитают при разных знаках, а тут они одинаковые.', uz: 'Modullar har xil ishorada ayiriladi, bu yerda esa bir xil.', en: 'Absolute values subtract with different signs, but here they match.' },
        ],
      },
      {
        q: { ru: '−12 + (−8)', uz: '−12 + (−8)', en: '−12 + (−8)' },
        opts: ['−20', '−4', '20'],
        correct: 0,
        ok: { ru: 'Верно. 12 + 8 = 20 и знак минус.', uz: "To'g'ri. 12 + 8 = 20 va ishora minus.", en: 'Right. 12 + 8 = 20 with a minus sign.' },
        wrong: [
          null,
          { ru: 'Это вычитание, а знаки одинаковые.', uz: 'Bu ayirish, ishoralar esa bir xil.', en: 'That is subtraction, but the signs match.' },
          { ru: 'Оба шага шли влево, ответ не может быть положительным.', uz: "Ikkala qadam ham chapga bordi, javob musbat bo'lolmaydi.", en: 'Both steps went left, so the answer cannot be positive.' },
        ],
      },
      {
        q: { ru: '7 + 6', uz: '7 + 6', en: '7 + 6' },
        opts: ['13', '−13', '1'],
        correct: 0,
        ok: { ru: 'Верно. Оба шага вправо, знак плюс.', uz: "To'g'ri. Ikkala qadam ham o'ngga, ishora plyus.", en: 'Right. Both steps go right with a plus sign.' },
        wrong: [
          null,
          { ru: 'Минус здесь взяться неоткуда.', uz: 'Bu yerda minus qayerdan ham kelsin.', en: 'There is nowhere for a minus to come from.' },
          { ru: 'Это разность, а знаки одинаковые.', uz: 'Bu ayirma, ishoralar esa bir xil.', en: 'That is a difference, but the signs match.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на одинаковые знаки. Складывайте модули и не теряйте общий знак.',
        uz: "Bir xil ishoralar mashqi. Modullarni qo'shing va umumiy ishorani yo'qotmang.",
        en: 'Practice with equal signs. Add the absolute values and keep the sign.',
      },
    },
  },

  s_mixed: {
    title: { ru: 'Разные знаки', uz: 'Har xil ishoralar', en: 'Different signs' },
    lead: { ru: 'Вычитаем модули, знак берём у большего.', uz: 'Modullarni ayiramiz, ishorani kattasidan olamiz.', en: 'Subtract the absolute values and take the sign of the bigger.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '−10 + 4', uz: '−10 + 4', en: '−10 + 4' },
        opts: ['−6', '6', '−14'],
        correct: 0,
        ok: { ru: 'Верно. 10 − 4 = 6, у −10 модуль больше.', uz: "To'g'ri. 10 − 4 = 6, −10 ning moduli katta.", en: 'Right. 10 − 4 = 6 and −10 has the bigger absolute value.' },
        wrong: [
          null,
          { ru: 'Знак у числа с большим модулем, а это −10.', uz: "Ishora moduli katta sondan olinadi, bu esa −10.", en: 'The sign comes from the bigger absolute value, which is −10.' },
          { ru: 'Модули складывают только при одинаковых знаках.', uz: "Modullar faqat bir xil ishorada qo'shiladi.", en: 'Absolute values add only with equal signs.' },
        ],
      },
      {
        q: { ru: '8 + (−3)', uz: '8 + (−3)', en: '8 + (−3)' },
        opts: ['5', '−5', '11'],
        correct: 0,
        ok: { ru: 'Верно. 8 − 3 = 5, у 8 модуль больше.', uz: "To'g'ri. 8 − 3 = 5, 8 ning moduli katta.", en: 'Right. 8 − 3 = 5 and 8 has the bigger absolute value.' },
        wrong: [
          null,
          { ru: 'Вправо прошли дальше, значит ответ положительный.', uz: "O'ngga uzoqroq yurildi, demak javob musbat.", en: 'We went further right, so the answer is positive.' },
          { ru: 'Складывать модули здесь нельзя: знаки разные.', uz: "Bu yerda modullarni qo'shib bo'lmaydi: ishoralar har xil.", en: 'The absolute values cannot add here: the signs differ.' },
        ],
      },
      {
        q: { ru: '−6 + 6', uz: '−6 + 6', en: '−6 + 6' },
        opts: ['0', '12', '−12'],
        correct: 0,
        ok: { ru: 'Верно. Противоположные числа в сумме дают ноль.', uz: "To'g'ri. Qarama-qarshi sonlar yig'indisi nol beradi.", en: 'Right. Opposite numbers add to zero.' },
        wrong: [
          null,
          { ru: 'Знаки разные, значит модули вычитаются.', uz: 'Ishoralar har xil, demak modullar ayiriladi.', en: 'The signs differ, so the absolute values subtract.' },
          { ru: 'Шаги одинаковые по длине и гасят друг друга.', uz: "Qadamlar teng uzunlikda va bir-birini so'ndiradi.", en: 'The steps are equal in length and cancel out.' },
        ],
      },
      {
        q: { ru: 'От чего зависит знак суммы при разных знаках?', uz: "Har xil ishorada yig'indi ishorasi nimaga bog'liq?", en: 'What decides the sign with different signs?' },
        opts: [
          { ru: 'От числа с большим модулем', uz: 'Moduli katta sondan', en: 'The number with the bigger absolute value' },
          { ru: 'От первого слагаемого', uz: "Birinchi qo'shiluvchidan", en: 'The first addend' },
          { ru: 'Всегда получается минус', uz: 'Har doim minus chiqadi', en: 'It is always a minus' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Кто прошёл дальше от нуля, тот и задаёт сторону.', uz: "To'g'ri. Noldan uzoqroq ketgani tomonni belgilaydi.", en: 'Right. Whoever went further from zero sets the side.' },
        wrong: [
          null,
          { ru: 'Порядок слагаемых сумму не меняет.', uz: "Qo'shiluvchilar tartibi yig'indini o'zgartirmaydi.", en: 'The order of addends does not change the sum.' },
          { ru: '8 + (−3) даёт плюс пять.', uz: '8 + (−3) plyus besh beradi.', en: '8 + (−3) gives plus five.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на разные знаки. Считайте модули и смотрите, какой перевесил.',
        uz: "Har xil ishoralar mashqi. Modullarni hisoblang va qaysi biri og'irroq kelganiga qarang.",
        en: 'Practice with different signs. Compute the absolute values and see which one outweighs.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Какой знак у суммы', uz: "Yig'indi ishorasi qanday", en: 'What sign will the sum have' },
    lead: { ru: 'Смотри, чей модуль больше, считать не обязательно.', uz: "Kimning moduli katta ekaniga qarang, hisoblash shart emas.", en: 'See whose absolute value is bigger; no need to compute.' },
    bin_a: { ru: 'Сумма положительная', uz: "Yig'indi musbat", en: 'The sum is positive' },
    bin_b: { ru: 'Сумма отрицательная', uz: "Yig'indi manfiy", en: 'The sum is negative' },
    cards: [
      { label: '−2 + 5', bin: 'a' },
      { label: '4 + (−1)', bin: 'a' },
      { label: '6 + (−2)', bin: 'a' },
      { label: '−5 + 2', bin: 'b' },
      { label: '−7 + 3', bin: 'b' },
      { label: '−3 + (−4)', bin: 'b' },
    ],
    hint: {
      ru: 'Знак суммы совпадает со знаком того числа, у которого модуль больше.',
      uz: "Yig'indi ishorasi moduli katta sonning ishorasi bilan bir xil.",
      en: 'The sign of the sum matches the number with the bigger absolute value.',
    },
    correct_text: {
      ru: 'Верно. Считать до конца не пришлось: хватило сравнения модулей.',
      uz: "To'g'ri. Oxirigacha hisoblash kerak bo'lmadi: modullarni solishtirish yetdi.",
      en: 'Right. No full computation was needed: comparing absolute values was enough.',
    },
    audio: {
      intro: {
        ru: 'Разложите суммы по двум корзинам. Смотрите на модули слагаемых.',
        uz: "Yig'indilarni ikki savatga ajrating. Qo'shiluvchilar modullariga qarang.",
        en: 'Sort the sums into two baskets. Look at the absolute values of the addends.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Сравни модули слагаемых.', uz: "Bu yerga emas. Qo'shiluvchilar modullarini solishtiring.", en: 'Not here. Compare the absolute values.' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «−3 + (−5) = −2, ведь 5 − 3 = 2». Проверь.', uz: "Aziz: «−3 + (−5) = −2, axir 5 − 3 = 2». Tekshiring.", en: 'Aziz: “−3 + (−5) = −2 because 5 − 3 = 2.” Check it.' },
        opts: [
          { ru: 'Нет: знаки одинаковые, модули складываются, будет −8', uz: "Yo'q: ishoralar bir xil, modullar qo'shiladi, −8 bo'ladi", en: 'No: equal signs mean adding, so it is −8' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 8', uz: "Yo'q, 8 bo'ladi", en: 'No, it is 8' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Оба шага влево, значит расстояния складываются.', uz: "To'g'ri. Ikkala qadam ham chapga, demak masofalar qo'shiladi.", en: 'Right. Both steps go left, so the distances add.' },
        wrong: [
          null,
          { ru: 'Вычитание модулей бывает только при разных знаках.', uz: "Modullarni ayirish faqat har xil ishorada bo'ladi.", en: 'Subtracting absolute values happens only with different signs.' },
          { ru: 'Ответ отрицательный: шли влево.', uz: 'Javob manfiy: chapga yurildi.', en: 'The answer is negative: we moved left.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «−4 + 9 = −5, ведь первое число отрицательное». Проверь.', uz: "Dilnoza: «−4 + 9 = −5, axir birinchi son manfiy». Tekshiring.", en: 'Dilnoza: “−4 + 9 = −5 because the first number is negative.” Check it.' },
        opts: [
          { ru: 'Нет: у 9 модуль больше, ответ 5', uz: "Yo'q: 9 ning moduli katta, javob 5", en: 'No: 9 has the bigger absolute value, so the answer is 5' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, ответ 13', uz: "Yo'q, javob 13", en: 'No, the answer is 13' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Знак берут не у первого числа, а у большего модуля.', uz: "To'g'ri. Ishora birinchi sondan emas, katta moduldan olinadi.", en: 'Right. The sign comes from the bigger absolute value, not from the first number.' },
        wrong: [
          null,
          { ru: 'Вправо прошли дальше, чем влево.', uz: "O'ngga chapga qaraganda uzoqroq yurildi.", en: 'We went further right than left.' },
          { ru: 'Складывать модули при разных знаках нельзя.', uz: "Har xil ishorada modullarni qo'shib bo'lmaydi.", en: 'Absolute values do not add with different signs.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в действии с модулями, и в знаке.',
        uz: "Birovning yechimini tekshiring. Xato modullar bilan amalda ham, ishorada ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the operation on absolute values and in the sign.',
      },
    },
  },

  s_task: {
    title: { ru: 'Счёт команды', uz: 'Jamoa hisobi', en: 'The team score' },
    lead: { ru: 'Команда набрала 5, получила штраф 8, потом набрала ещё 6.', uz: "Jamoa 5 to'pladi, 8 jarima oldi, keyin yana 6 to'pladi.", en: 'The team scored 5, took an 8 point penalty, then scored 6 more.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько очков после штрафа?', uz: 'Jarimadan keyin necha ochko?', en: 'What is the score after the penalty?' },
        opts: ['−3', '3', '13'],
        correct: 0,
        ok: { ru: 'Верно. 5 + (−8) = −3.', uz: "To'g'ri. 5 + (−8) = −3.", en: 'Right. 5 + (−8) = −3.' },
        wrong: [
          null,
          { ru: 'Штраф больше набранного, точка ушла за ноль.', uz: "Jarima to'plangandan katta, nuqta noldan o'tdi.", en: 'The penalty is bigger, so the point crossed zero.' },
          { ru: 'Штраф вычитают, а не прибавляют.', uz: "Jarima ayiriladi, qo'shilmaydi.", en: 'A penalty is subtracted, not added.' },
        ],
      },
      {
        q: { ru: 'Сколько очков в конце?', uz: 'Oxirida necha ochko?', en: 'What is the final score?' },
        opts: ['3', '−3', '9'],
        correct: 0,
        ok: { ru: 'Верно. −3 + 6 = 3.', uz: "To'g'ri. −3 + 6 = 3.", en: 'Right. −3 + 6 = 3.' },
        wrong: [
          null,
          { ru: 'Шесть очков вправо перевешивают три влево.', uz: "O'ngga olti ochko chapga uchtadan og'irroq.", en: 'Six points right outweigh three left.' },
          { ru: 'Так вышло бы, если бы штрафа не было.', uz: "Jarima bo'lmaganda shunday chiqardi.", en: 'That would happen without the penalty.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про викторину. Команда набрала пять очков, получила штраф восемь, потом набрала ещё шесть.',
        uz: "Viktorina haqida masala. Jamoa besh ochko to'pladi, sakkiz jarima oldi, keyin yana olti to'pladi.",
        en: 'A quiz problem. The team scored five, took an eight point penalty, then scored six more.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 4,
        q: { ru: 'Вычисли −9 + 13. Набери ответ.', uz: '−9 + 13 ni hisoblang. Javobni tering.', en: 'Compute −9 + 13. Type the answer.' },
        hint: { ru: 'Знаки разные: 13 − 9, знак у большего модуля.', uz: 'Ishoralar har xil: 13 − 9, ishora katta modulniki.', en: 'Different signs: 13 − 9 with the sign of the bigger.' },
        hint_audio: { ru: 'Знаки разные, значит из тринадцати вычитаем девять, а знак берём у числа с большим модулем.', uz: "Ishoralar har xil, demak o'n uchdan to'qqizni ayiramiz, ishorani esa moduli katta sondan olamiz.", en: 'Different signs, so subtract nine from thirteen and take the sign of the bigger absolute value.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Сколько будет −7 + (−6)?', uz: '−7 + (−6) nechaga teng?', en: 'What is −7 + (−6)?' },
        opts: ['−1', '1', '−13', '13'],
        wrong: [
          { ru: 'Это разность, а знаки одинаковые.', uz: 'Bu ayirma, ishoralar esa bir xil.', en: 'That is a difference, but the signs match.' },
          { ru: 'Оба шага влево: ответ не может быть положительным.', uz: "Ikkala qadam ham chapga: javob musbat bo'lolmaydi.", en: 'Both steps go left: the answer cannot be positive.' },
          null,
          { ru: 'Число верное, а знак потерян.', uz: "Son to'g'ri, ishora esa yo'qolgan.", en: 'The number is right but the sign is lost.' },
        ],
        correct: { ru: 'Верно. 7 + 6 = 13, знак минус.', uz: "To'g'ri. 7 + 6 = 13, ishora minus.", en: 'Right. 7 + 6 = 13 with a minus.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Сколько будет 12 + (−15)?', uz: '12 + (−15) nechaga teng?', en: 'What is 12 + (−15)?' },
        opts: ['3', '−3', '27', '−27'],
        wrong: [
          { ru: 'Влево прошли дальше, значит ответ отрицательный.', uz: 'Chapga uzoqroq yurildi, demak javob manfiy.', en: 'We went further left, so the answer is negative.' },
          null,
          { ru: 'Складывать модули при разных знаках нельзя.', uz: "Har xil ishorada modullarni qo'shib bo'lmaydi.", en: 'Absolute values do not add with different signs.' },
          { ru: 'Это сумма модулей со знаком минус.', uz: "Bu modullar yig'indisi, minus bilan.", en: 'That is the sum of absolute values with a minus.' },
        ],
        correct: { ru: 'Верно. 15 − 12 = 3, знак у −15.', uz: "To'g'ri. 15 − 12 = 3, ishora −15 niki.", en: 'Right. 15 − 12 = 3 with the sign of −15.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Чему равна сумма противоположных чисел?', uz: "Qarama-qarshi sonlar yig'indisi nimaga teng?", en: 'What do opposite numbers add up to?' },
        opts: [
          '0',
          { ru: 'их модулю', uz: 'ularning moduliga', en: 'their absolute value' },
          { ru: 'всегда 1', uz: 'har doim 1', en: 'always 1' },
          { ru: 'нельзя сказать', uz: "aytib bo'lmaydi", en: 'cannot be said' },
        ],
        wrong: [
          null,
          { ru: 'Модуль остался бы, если бы знаки совпали.', uz: "Ishoralar mos bo'lsa modul qolardi.", en: 'The absolute value would remain if the signs matched.' },
          { ru: 'Единица тут ни при чём.', uz: "Birning bunga aloqasi yo'q.", en: 'One has nothing to do with it.' },
          { ru: 'Сказать можно: шаги равны и гасят друг друга.', uz: "Aytish mumkin: qadamlar teng va bir-birini so'ndiradi.", en: 'We can say it: equal steps cancel out.' },
        ],
        correct: { ru: 'Верно. Шаги равной длины в разные стороны возвращают в ноль.', uz: "To'g'ri. Teng uzunlikdagi qarama-qarshi qadamlar nolga qaytaradi.", en: 'Right. Equal steps in opposite directions return to zero.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Ночью было −6, днём стало теплее на 10 градусов. Сколько стало?', uz: "Kechasi −6 edi, kunduzi 10 darajaga isidi. Necha bo'ldi?", en: 'It was −6 at night and warmed by 10 degrees. What now?' },
        opts: ['−16', '16', '−4', '4'],
        wrong: [
          { ru: 'Потеплело — значит идём вправо, а не влево.', uz: "Isidi — demak o'ngga yuramiz, chapga emas.", en: 'It warmed, so we move right, not left.' },
          { ru: 'Складывать модули при разных знаках нельзя.', uz: "Har xil ishorada modullarni qo'shib bo'lmaydi.", en: 'Absolute values do not add with different signs.' },
          { ru: 'Десять больше шести, значит перешли за ноль.', uz: "O'n oltidan katta, demak noldan o'tildi.", en: 'Ten beats six, so we crossed zero.' },
          null,
        ],
        correct: { ru: 'Верно. −6 + 10 = 4 градуса.', uz: "To'g'ri. −6 + 10 = 4 daraja.", en: 'Right. −6 + 10 = 4 degrees.' },
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
      ru: 'Географы считают высоты от уровня моря, и он у них ноль. Берег Мёртвого моря лежит примерно на 430 метров ниже, а вершина Хан-Тенгри почти на 7000 выше. Сложение со знаками нужно, чтобы посчитать перепад между такими точками.',
      uz: "Geograflar balandlikni dengiz sathidan sanaydi va u ular uchun nol. O'lik dengiz qirg'og'i taxminan 430 metr pastda, Xon Tangri cho'qqisi esa deyarli 7000 metr yuqorida. Bunday nuqtalar orasidagi farqni hisoblash uchun ishorali qo'shish kerak.",
      en: 'Geographers count heights from sea level, and that is their zero. The shore of the Dead Sea lies about 430 metres below it, while Khan Tengri rises almost 7000 above. Signed addition is what measures the drop between such points.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Географы считают высоты от уровня моря, и он у них ноль. Берег Мёртвого моря лежит примерно на четыреста тридцать метров ниже, а вершина Хан Тенгри почти на семь тысяч выше. Сложение со знаками нужно, чтобы посчитать перепад между такими точками.',
      uz: "Bilasizmi? Geograflar balandlikni dengiz sathidan sanaydi va u ular uchun nol. O'lik dengiz qirg'og'i taxminan to'rt yuz o'ttiz metr pastda, Xon Tangri cho'qqisi esa deyarli yetti ming metr yuqorida. Bunday nuqtalar orasidagi farqni hisoblash uchun ishorali qo'shish kerak.",
      en: 'Did you know? Geographers count heights from sea level, and that is their zero. The Dead Sea shore lies about four hundred thirty metres below, while Khan Tengri rises almost seven thousand above. Signed addition measures the drop between such points.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Отрицательные числа', uz: 'Matematika · Manfiy sonlar', en: 'Mathematics · Negative numbers' },
    heading: { ru: 'Сложение', uz: "Qo'shish", en: 'Addition' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'слагаемое — это шаг по прямой', uz: "qo'shiluvchi — chiziq bo'ylab qadam", en: 'an addend is a step along the line' },
    brief_2: { ru: 'знаки одинаковые — модули складываем', uz: "ishoralar bir xil — modullarni qo'shamiz", en: 'equal signs: add the absolute values' },
    brief_3: { ru: 'знаки разные — вычитаем, знак у большего', uz: 'har xil — ayiramiz, ishora kattasiniki', en: 'different signs: subtract, sign of the bigger' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Прибавить отрицательное', uz: "Manfiyni qo'shish", en: 'Adding a negative' },
    memo_a1: { ru: 'значит шагнуть влево', uz: 'chapga qadam tashlash demak', en: 'means stepping left' },
    memo_q2: { ru: 'Противоположные', uz: 'Qarama-qarshilar', en: 'Opposites' },
    memo_a2: { ru: 'в сумме дают ноль', uz: "yig'indida nol beradi", en: 'add up to zero' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'потерять знак у большего модуля', uz: "katta modul ishorasini yo'qotish", en: 'losing the sign of the bigger one' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Каждое слагаемое это шаг по прямой. Если знаки одинаковые, модули складываем и оставляем общий знак. Если разные, вычитаем модули и берём знак того числа, у которого модуль больше.',
        'Викторина: пять очков плюс штраф восемь это минус три.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Har bir qo'shiluvchi chiziq bo'ylab qadam. Ishoralar bir xil bo'lsa, modullarni qo'shamiz va umumiy ishorani qoldiramiz. Har xil bo'lsa, modullarni ayiramiz va moduli katta sonning ishorasini olamiz.",
        "Viktorina: besh ochko plyus sakkiz jarima bu minus uch.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Every addend is a step along the line. With equal signs add the absolute values and keep the sign. With different signs subtract them and take the sign of the bigger.',
        'The quiz: five points plus an eight point penalty is minus three.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Шаг за шагом', uz: 'Usul. Qadam ortidan qadam', en: 'Method. Step by step' },
    m1_steps: {
      ru: ['Посмотри на знаки слагаемых', 'Одинаковые — сложи модули, разные — вычти', 'Поставь знак: общий или у большего модуля'],
      uz: ["Qo'shiluvchilar ishorasiga qarang", "Bir xil bo'lsa modullarni qo'shing, har xil bo'lsa ayiring", "Ishora qo'ying: umumiy yoki katta modulniki"],
      en: ['Look at the signs of the addends', 'Equal: add the absolute values. Different: subtract', 'Set the sign: the common one or of the bigger'],
    },
    m1_no: {
      ru: 'Проверка по прямой: положительное слагаемое ведёт вправо, отрицательное влево.',
      uz: "Chiziq bo'yicha tekshiruv: musbat qo'shiluvchi o'ngga, manfiysi chapga olib boradi.",
      en: 'Check on the line: a positive addend leads right, a negative one leads left.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: классная викторина, табло команды и штрафные карточки.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d27wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d27wall)"/>

    {/* Классная доска с надписью «Викторина» и мелом */}
    <g opacity="0.9">
      <rect x="14" y="16" width="120" height="76" rx="5" fill="#3F5B4A" stroke="#C9A472" strokeWidth="3"/>
      {[0, 1, 2].map((k) => (
        <rect key={k} x={26} y={34 + k * 16} width={92 - k * 22} height="4" rx="2" fill="#DCE9DF" opacity="0.65"/>
      ))}
      <rect x="24" y="92" width="100" height="5" rx="2" fill="#C9A472"/>
      <rect x="96" y="86" width="14" height="5" rx="2" fill="#FFFDF7"/>
    </g>

    {/* Табло команды: набрано 5, рядом штрафная карточка 8. Итога на табло нет */}
    <g>
      <rect x="156" y="14" width="126" height="70" rx="6" fill="#3B3730"/>
      <rect x="162" y="20" width="114" height="58" rx="4" fill="#2A2723"/>
      <rect x="170" y="26" width="52" height="12" rx="3" fill="#4A453D"/>
      {[0, 1].map((k) => (
        <rect key={k} x={176 + k * 22} y="30" width="14" height="3" rx="1.5" fill="#7B7367"/>
      ))}
      <text x="219" y="70" textAnchor="middle" fill="#F5C77E"
        fontFamily="'JetBrains Mono', monospace" fontSize="30" fontWeight="700">5</text>
      <circle className="d27-lamp" cx="264" cy="32" r="5" fill="#F5C77E"/>
    </g>

    {/* Штрафная карточка на 8 очков, качается в руке ведущей */}
    <g className="d27-card">
      <rect x="296" y="30" width="40" height="54" rx="5" fill="#D9603F" stroke="#B24A2C" strokeWidth="2"/>
      <text x="316" y="60" textAnchor="middle" fill="#FFFDF7"
        fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">8</text>
      <rect x="306" y="66" width="20" height="3" rx="1.5" fill="#FFFDF7" opacity="0.7"/>
    </g>

    {/* Команда за партой и ведущая у табло */}
    <rect x="26" y="112" width="132" height="8" rx="3" fill="#C9A472"/>
    <rect x="34" y="120" width="6" height="16" fill="#B08A55"/>
    <rect x="144" y="120" width="6" height="16" fill="#B08A55"/>
    <Person x={58} ground={112} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={118} ground={112} head={12} shirt="#8FBF7F" hair="#5A4636"/>
    <Person x={330} ground={136} head={13} shirt="#F5C77E" hair="#3E3128"/>

    {/* Кнопка-звонок на парте */}
    <g>
      <circle cx="90" cy="110" r="7" fill="#FFFDF7" stroke="#C9A472" strokeWidth="1.6"/>
      <circle className="d27-lamp" cx="90" cy="110" r="4" fill="#D9603F"/>
    </g>
    <rect x="0" y="136" width="400" height="18" fill="#D2A96F"/>
  </svg>
);

// Итог: два шага по прямой и счёт команды.
const FinalScene = () => {
  const px = (v) => 34 + (v + 5) * 26;
  const y = 46;
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <defs>
        <marker id="d27fr" markerWidth="7" markerHeight="7" refX="5.4" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 z" fill="#D9603F"/>
        </marker>
        <marker id="d27fl" markerWidth="7" markerHeight="7" refX="5.4" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 z" fill="#019ACB"/>
        </marker>
      </defs>
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <path d={`M14 ${y} h372`} stroke="#8E8578" strokeWidth="2.2"/>
      {Array.from({ length: 13 }, (_, i) => i - 5).map((m) => (
        <g key={m}>
          <path d={`M${px(m)} ${y - 5} v10`} stroke="#8E8578" strokeWidth={m === 0 ? 3 : 1.2}/>
          <text x={px(m)} y={y + 20} textAnchor="middle" fill={m === 0 ? '#494550' : '#8A8883'}
            fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{m}</text>
        </g>
      ))}
      <path d={`M${px(0)} ${y - 4} Q ${px(2.5)} ${y - 28} ${px(5)} ${y - 4}`}
        fill="none" stroke="#D9603F" strokeWidth="2" markerEnd="url(#d27fr)"/>
      <path d={`M${px(5)} ${y - 4} Q ${px(1)} ${y - 34} ${px(-3)} ${y - 4}`}
        fill="none" stroke="#019ACB" strokeWidth="2" markerEnd="url(#d27fl)"/>
      <circle cx={px(-3)} cy={y} r="6" fill="#019ACB"/>
      <text x="200" y="84" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">5 + (−8) = −3</text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: прямая из 24-го урока, к которой добавлены дуги-шаги.
const NumLine = ({ from = -9, to = 9, points = [], arcs = [], size = 'mid' }) => {
  const n = to - from;
  const step = 380 / n;
  const y = 52;
  const px = (v) => 10 + (v - from) * step;
  return (
    <span className={'d27-line-box d27-line-' + size}>
      <svg viewBox="0 0 400 78" aria-hidden="true">
        <defs>
          <marker id="d27ar-r" markerWidth="7" markerHeight="7" refX="5.4" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 z" fill="#D9603F"/>
          </marker>
          <marker id="d27ar-l" markerWidth="7" markerHeight="7" refX="5.4" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 z" fill="#019ACB"/>
          </marker>
        </defs>
        <path d={`M4 ${y} h392`} stroke="#8E8578" strokeWidth="2.2"/>
        {Array.from({ length: n + 1 }, (_, i) => {
          const v = from + i;
          const x = px(v);
          return (
            <g key={v}>
              <path d={`M${x} ${y - 5} v10`} stroke="#8E8578" strokeWidth={v === 0 ? 3 : 1.2}/>
              <text x={x} y={y + 20} textAnchor="middle" fill={v === 0 ? '#494550' : '#8A8883'}
                fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{v}</text>
            </g>
          );
        })}
        {arcs.map((a, i) => {
          const right = a.to > a.from;
          const tone = right ? '#D9603F' : '#019ACB';
          const mid = (a.from + a.to) / 2;
          const rise = Math.min(34, 12 + Math.abs(a.to - a.from) * step * 0.32);
          return (
            <g key={i}>
              <path d={`M${px(a.from)} ${y - 4} Q ${px(mid)} ${y - rise * 2} ${px(a.to)} ${y - 4}`}
                fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round"
                markerEnd={right ? 'url(#d27ar-r)' : 'url(#d27ar-l)'}/>
              {a.name && (
                <text x={px(mid)} y={y - rise - 4} textAnchor="middle" fill={tone}
                  fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{a.name}</text>
              )}
            </g>
          );
        })}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={px(p.v)} cy={y} r="6" fill={p.tone || (p.v < 0 ? '#019ACB' : '#D9603F')}/>
            {p.name && (
              <text x={px(p.v)} y={y + 20} textAnchor="middle" fill={p.tone || (p.v < 0 ? '#019ACB' : '#D9603F')}
                fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{p.name}</text>
            )}
          </g>
        ))}
      </svg>
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d27-line d27-fade' + (on ? ' d27-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d27-stage">
        <NumLine from={-6} to={6}
          arcs={step >= 1 ? [{ from: -2, to: 2, name: '+4' }] : []}
          points={step >= 1 ? [{ v: 2, name: '2' }] : [{ v: -2, name: '−2' }]}/>
        <span className={'d27-chips d27-fade' + (step >= 1 ? ' d27-on' : '')}>
          <i className="d27-chip-r">{tri(lang, 'вправо: больше', "o'ngga: kattaroq", 'right: bigger')}</i>
          <i className="d27-chip-l">{tri(lang, 'влево: меньше', 'chapga: kichikroq', 'left: smaller')}</i>
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

// Ядро: 5 очков вправо, 8 штрафа влево.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d27-stage">
        <NumLine from={-5} to={7}
          arcs={[
            ...(step >= 0 ? [{ from: 0, to: 5, name: '+5' }] : []),
            ...(step >= 1 ? [{ from: 5, to: -3, name: '−8' }] : []),
          ]}
          points={step >= 1 ? [{ v: -3, name: '−3' }] : (step >= 0 ? [{ v: 5, name: '5' }] : [])}/>
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

// Разные знаки: шаги гасят друг друга.
const DiffBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_diff;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d27-stage">
        <NumLine from={-10} to={2}
          arcs={[
            ...(step >= 0 ? [{ from: 0, to: -9, name: '−9' }] : []),
            ...(step >= 1 ? [{ from: -9, to: -5, name: '+4' }] : []),
          ]}
          points={step >= 1 ? [{ v: -5, name: '−5' }] : (step >= 0 ? [{ v: -9, name: '−9' }] : [])}/>
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
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d27-stage">
        <NumLine from={-8} to={4} size="sm"
          arcs={[
            ...(step >= 0 ? [{ from: 0, to: -7, name: '−7' }, { from: -7, to: 3, name: '+10' }] : []),
            ...(step >= 1 ? [{ from: 3, to: -2, name: '−5' }] : []),
          ]}
          points={step >= 1 ? [{ v: -2, name: '−2' }] : (step >= 0 ? [{ v: 3, name: '3' }] : [])}/>
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

// Граница: знак второго слагаемого теряют чаще всего.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d27-stage">
        <NumLine from={-1} to={8} size="sm"
          arcs={[{ from: 0, to: 7, name: '+7' }, { from: 7, to: 0, name: '−7' }]}
          points={[{ v: 0, name: '0', tone: '#1F7A4D' }]}/>
        <span className={'d27-pair d27-pair-good d27-fade' + (step >= 0 ? ' d27-on' : '')}>
          <Line node={t(c.zero_line)} on/>
        </span>
        <span className={'d27-pair d27-pair-bad d27-fade' + (step >= 1 ? ' d27-on' : '')}>
          <Line node={t(c.bad_line)} on/>
        </span>
        <span className={'d27-pair d27-pair-warn d27-fade' + (step >= 2 ? ' d27-on' : '')}>
          <Line node={t(c.good_line)} on/>
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
        <div className={'d27-banner fade-up delay-1' + (phase === 'play' ? ' d27-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d27-stage d27-stage-tool">
          {phase === 'demo' ? (
            <>
              <NumLine from={-8} to={2} size="sm"
                arcs={[
                  ...(shown >= 0 ? [{ from: 0, to: -4, name: '−4' }] : []),
                  ...(shown >= 1 ? [{ from: -4, to: -7, name: '−3' }] : []),
                ]}
                points={shown >= 1 ? [{ v: -7, name: '−7' }] : [{ v: -4, name: '−4' }]}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d27-verdict' + (done ? ' d27-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d27-acts fade-up">
            <button className="d27-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d27-btn d27-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
      <div className="d27-stage">
        <NumLine from={-4} to={6} size="sm"
          arcs={[{ from: 0, to: 5, name: '+5' }, { from: 5, to: -3, name: '−8' }]}
          points={[{ v: -3, name: '−3' }]}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenSame = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_same} asideNode={methodAside}/>
);
const ScreenMixed = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_mixed} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: счёт команды по шагам.
const TaskFig = ({ idx }) => (
  <div className="d27-task-fig">
    <NumLine from={-5} to={7} size="sm"
      arcs={idx >= 1
        ? [{ from: 0, to: 5, name: '+5' }, { from: 5, to: -3, name: '−8' }, { from: -3, to: 3, name: '+6' }]
        : [{ from: 0, to: 5, name: '+5' }, { from: 5, to: -3, name: '−8' }]}
      points={idx >= 1 ? [{ v: 3, name: '3' }] : [{ v: -3, name: '−3' }]}/>
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
.d27-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
/* Низкое окно: у экрана показа ужимаются зазоры внутри рамки, а числовая
   прямая рисуется ниже — она масштабируется по viewBox и ничего не теряет. */
@media (min-width: 640px) and (max-height: 700px) {
  .d27-stage { gap: 6px !important; padding: 8px !important; }
  .d27-line-box svg { max-height: 112px; }
}
.d27-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d27-stage-tool .d27-line { font-size: clamp(12px, 2vw, 16px); }

/* Прямая с шагами */
.d27-line-box { display: block; width: 100%; }
.d27-line-box svg { width: 100%; height: auto; display: block; }
.d27-line-sm { max-width: 92%; }

.d27-fade { opacity: 0; transition: opacity 420ms linear; }
.d27-on { opacity: 1; }
.d27-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; text-align: center; }

/* Подписи направления */
.d27-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d27-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d27-chip-r { background: #FFF1EC; border: 1px solid #F3C4B4; color: #D9603F; }
.d27-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }

/* Строки экрана границы */
.d27-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d27-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d27-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d27-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d27-task-fig { display: block; width: 100%; }

/* Экран 4 */
.d27-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d27-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d27-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d27-verdict-on { opacity: 1; }
.d27-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d27-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d27-btn:disabled { opacity: 0.45; cursor: default; }
.d27-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d27-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: лампа звонка мигает, штрафная карточка качается */
.d27-lamp { animation: d27Lamp 1900ms ease-in-out infinite; }
@keyframes d27Lamp { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
.d27-card { transform-origin: 316px 30px; animation: d27Card 3400ms ease-in-out infinite; }
@keyframes d27Card { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(6deg); } }
@media (prefers-reduced-motion: reduce) { .d27-lamp, .d27-card { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function AddRationalLesson({
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
    ScreenRule, ScreenSame, ScreenMixed, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
