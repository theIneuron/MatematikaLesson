// ============================================================
// 6 КЛАСС, УРОК 24 «Координатная прямая»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б6: отрицательные числа. Числовой луч из младших классов
// продолжается влево, у него появляется начало отсчёта и два направления.
// Отрицательное число здесь не «меньше нуля», а «по другую сторону от нуля».
//
// Сцена — подъезд с лифтом: этажи вверх и подземные вниз.
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
  FB_HIST,
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
  lessonId: 'grade6-24',
  lessonTitle: {
    ru: 'Координатная прямая',
    uz: "Koordinata to'g'ri chizig'i",
    en: 'The number line',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 lift: 3-qavatdan 5 pastga
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 sonli nur esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 sanoq boshi va ikki yo'nalish
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: nuqtani koordinata bo'yicha topish
  { id: 's_opp',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 qarama-qarshi sonlar
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: siljish
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: tartib va birlik kesma
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_coord',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 nuqta koordinatasi x3
  { id: 's_move',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 siljish va qarama-qarshi x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: noldan chapda yoki o'ngda
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: lift
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: { ru: 'Лифт с подземными этажами', uz: 'Yerto\'la qavatli lift', en: 'A lift with basement floors' },
    lead: {
      ru: 'Азиз зашёл в лифт на 3 этаже и спустился на 5 этажей вниз. В доме есть подземная парковка.',
      uz: "Aziz 3-qavatda liftga chiqdi va 5 qavat pastga tushdi. Binoda yerto'la avtoturargohi bor.",
      en: 'Aziz got into the lift on floor 3 and went down 5 floors. The building has underground parking.',
    },
    voice_a: { ru: 'Азиз: значит я на 8 этаже.', uz: "Aziz: demak men 8-qavatdaman.", en: 'Aziz: so I am on floor 8.' },
    voice_b: { ru: 'Дилноза: нет, ниже нуля.', uz: "Dilnoza: yo'q, noldan pastda.", en: 'Dilnoza: no, below zero.' },
    ask: { ru: 'Где оказался Азиз?', uz: 'Aziz qayerga tushdi?', en: 'Where did Aziz end up?' },
    options: [
      { ru: 'На 8 этаже', uz: '8-qavatda', en: 'On floor 8' },
      { ru: 'На 2 подземном', uz: '2-yerto\'la qavatda', en: 'On basement 2' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Азиз зашёл в лифт на третьем этаже и спустился на пять этажей вниз. В доме есть подземная парковка, поэтому кнопки идут и ниже нуля.',
          'Азиз говорит, что оказался на восьмом этаже, а Дилноза что ниже нуля. Где оказался Азиз? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Aziz uchinchi qavatda liftga chiqdi va besh qavat pastga tushdi. Binoda yerto'la avtoturargohi bor, shuning uchun tugmalar noldan pastga ham ketadi.",
          "Aziz sakkizinchi qavatga tushdim deydi, Dilnoza esa noldan pastda deydi. Aziz qayerga tushdi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'Aziz got into the lift on the third floor and went down five floors. The building has underground parking, so the buttons continue below zero.',
          'Aziz says he ended up on floor eight, Dilnoza says below zero. Where did he end up? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Числовой луч', uz: 'Sonli nur', en: 'The number ray' },
    marks: [0, 1, 2, 3, 4, 5, 6],
    done: {
      ru: 'На луче есть начало, единичный отрезок и одно направление. Сегодня луч продолжится в другую сторону.',
      uz: "Nurda boshlanish, birlik kesma va bitta yo'nalish bor. Bugun nur ikkinchi tomonga davom etadi.",
      en: 'A ray has a start, a unit segment and one direction. Today it continues the other way.',
    },
    audio: {
      ru: [
        'Вспомним числовой луч из младших классов. Он начинается в нуле и идёт вправо.',
        'Расстояние между соседними отметками одинаковое, это единичный отрезок.',
        'Но у лифта кнопки идут и вниз, ниже нуля. Значит и линию с числами можно продолжить в другую сторону.',
      ],
      uz: [
        "Boshlang'ich sinflardagi sonli nurni eslaymiz. U noldan boshlanadi va o'ngga ketadi.",
        "Qo'shni belgilar orasidagi masofa bir xil, bu birlik kesma.",
        "Lekin liftda tugmalar pastga, noldan ham pastga ketadi. Demak sonli chiziqni ham ikkinchi tomonga davom ettirish mumkin.",
      ],
      en: [
        'Recall the number ray from earlier grades. It starts at zero and goes right.',
        'The gap between neighbouring marks is the same: the unit segment.',
        'But the lift buttons go down below zero. So the line of numbers can continue the other way too.',
      ],
    },
  },

  s_core: {
    title: { ru: 'Прямая с двумя направлениями', uz: "Ikki yo'nalishli chiziq", en: 'A line with two directions' },
    lines: [
      { ru: 'ноль — начало отсчёта', uz: 'nol — sanoq boshi', en: 'zero is the origin' },
      { ru: 'вправо положительные, влево отрицательные', uz: "o'ngda musbat, chapda manfiy", en: 'positive to the right, negative to the left' },
      { ru: 'этаж 3 минус 5 этажей = этаж −2', uz: '3-qavat minus 5 qavat = −2-qavat', en: 'floor 3 minus 5 floors is floor −2' },
    ],
    done: {
      ru: 'Отрицательное число — не «меньше нуля по количеству», а «по другую сторону от нуля». Азиз оказался на 2 подземном этаже. Права была Дилноза.',
      uz: "Manfiy son «noldan kam» emas, «nolning boshqa tomonida» degani. Aziz 2-yerto'la qavatga tushdi. Dilnoza haq edi.",
      en: 'A negative number is not a smaller count but a position on the other side of zero. Aziz ended on basement 2. Dilnoza was right.',
    },
    audio: {
      ru: [
        'Продолжим числовой луч влево и получим координатную прямую. Точка, от которой считают, называется началом отсчёта, и там стоит ноль.',
        'Вправо от нуля идут положительные числа, влево отрицательные. Расстояние между соседними отметками одинаковое: единичный отрезок.',
        'Теперь лифт. Стоим на третьем этаже и опускаемся на пять. Три минус пять это минус два, то есть второй подземный. Права была Дилноза.',
      ],
      uz: [
        "Sonli nurni chapga davom ettiramiz va koordinata to'g'ri chizig'i chiqadi. Sanaladigan nuqta sanoq boshi deyiladi, u yerda nol turadi.",
        "Noldan o'ngga musbat sonlar, chapga manfiy sonlar ketadi. Qo'shni belgilar orasidagi masofa bir xil: birlik kesma.",
        "Endi lift. Uchinchi qavatdamiz va besh qavat tushamiz. Uch minus besh bu minus ikki, ya'ni ikkinchi yerto'la qavat. Dilnoza haq edi.",
      ],
      en: [
        'Continue the ray to the left and you get a number line. The point you count from is the origin and zero stands there.',
        'To the right of zero the numbers are positive, to the left negative. The gap between marks is the same unit segment.',
        'Now the lift. We stand on floor three and go down five. Three minus five is minus two, that is basement two. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Координата точки', uz: 'Nuqta koordinatasi', en: 'The coordinate of a point' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_points: [-3, 4],
    demo_lines: [
      { ru: 'точка A стоит на 3 деления левее нуля', uz: 'A nuqtasi noldan 3 bo\'linma chapda', en: 'point A is 3 marks left of zero' },
      { ru: 'значит её координата −3', uz: 'demak uning koordinatasi −3', en: 'so its coordinate is −3' },
      { ru: 'точка B на 4 правее: координата 4', uz: "B nuqtasi 4 bo'linma o'ngda: koordinatasi 4", en: 'point B is 4 to the right: coordinate 4' },
    ],
    demo_note: {
      ru: 'Координата — это число, которое показывает, куда и на сколько единичных отрезков ушла точка от нуля.',
      uz: "Koordinata — nuqta noldan qaysi tomonga va necha birlik kesmaga ketganini ko'rsatuvchi son.",
      en: 'A coordinate is the number telling which way and how many unit segments the point sits from zero.',
    },
    play_ask: { ru: 'Точка стоит на 1 деление левее нуля. Какая у неё координата?', uz: "Nuqta noldan 1 bo'linma chapda. Uning koordinatasi qanday?", en: 'A point is 1 mark left of zero. Its coordinate?' },
    play_opts: ['1', '−1', '0'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. Влево от нуля числа отрицательные, поэтому −1.',
      uz: "To'g'ri. Noldan chapda sonlar manfiy, shuning uchun −1.",
      en: 'Right. Left of zero the numbers are negative, so −1.',
    },
    play_wrong: [
      { ru: 'Так была бы точка справа от нуля.', uz: "Bunday nuqta noldan o'ngda bo'lardi.", en: 'That would be a point to the right of zero.' },
      null,
      { ru: 'Ноль стоит в самом начале отсчёта, а точка от него ушла.', uz: 'Nol sanoq boshida turadi, nuqta esa undan uzoqlashgan.', en: 'Zero sits at the origin, but the point moved away.' },
    ],
    audio: {
      intro: {
        ru: 'Каждой точке на прямой соответствует число, его называют координатой. Покажу на двух точках.',
        uz: "Chiziqdagi har bir nuqtaga bitta son mos keladi, u koordinata deyiladi. Ikki nuqtada ko'rsataman.",
        en: 'Every point on the line matches a number called its coordinate. I will show it on two points.',
      },
      demo: {
        ru: 'Точка A стоит на три деления левее нуля, значит её координата минус три. Точка B на четыре деления правее, её координата четыре.',
        uz: "A nuqtasi noldan uch bo'linma chapda, demak koordinatasi minus uch. B nuqtasi to'rt bo'linma o'ngda, koordinatasi to'rt.",
        en: 'Point A is three marks left of zero, so its coordinate is minus three. Point B is four marks right, so its coordinate is four.',
      },
      play: {
        ru: 'Теперь ваша очередь. Точка стоит на одно деление левее нуля. Какая у неё координата?',
        uz: "Endi sizning navbatingiz. Nuqta noldan bitta bo'linma chapda. Uning koordinatasi qanday?",
        en: 'Now it is your turn. A point is one mark left of zero. What is its coordinate?',
      },
      ok: {
        ru: 'Верно. Левее нуля числа отрицательные, координата минус один.',
        uz: "To'g'ri. Noldan chapda sonlar manfiy, koordinata minus bir.",
        en: 'Right. Left of zero the numbers are negative, so minus one.',
      },
      wrong: {
        ru: 'Посмотрите, с какой стороны от нуля стоит точка.',
        uz: 'Nuqta nolning qaysi tomonida turganiga qarang.',
        en: 'Look at which side of zero the point is on.',
      },
    },
  },

  s_opp: {
    title: { ru: 'Противоположные числа', uz: 'Qarama-qarshi sonlar', en: 'Opposite numbers' },
    pairs: [[-5, 5], [-2, 2], [-1, 1]],
    lines: [
      { ru: '−5 и 5 стоят на равном расстоянии от нуля', uz: '−5 va 5 noldan teng masofada turadi', en: '−5 and 5 are the same distance from zero' },
      { ru: 'такие числа называют противоположными', uz: 'bunday sonlar qarama-qarshi deyiladi', en: 'such numbers are called opposites' },
      { ru: 'у нуля противоположное — сам ноль', uz: 'nolning qarama-qarshisi — nolning o\'zi', en: 'the opposite of zero is zero itself' },
    ],
    done: {
      ru: 'Противоположные числа отличаются только направлением: одно левее нуля, другое правее, а расстояние одинаковое.',
      uz: "Qarama-qarshi sonlar faqat yo'nalishi bilan farq qiladi: biri noldan chapda, ikkinchisi o'ngda, masofa esa bir xil.",
      en: 'Opposite numbers differ only in direction: one left of zero, one right, and the distance is equal.',
    },
    audio: {
      ru: [
        'Посмотрим на минус пять и пять. Обе точки стоят на пять делений от нуля, только в разные стороны.',
        'Такие числа называют противоположными. Минус два и два, минус один и один тоже пары противоположных.',
        'А у нуля противоположное число это сам ноль: он и есть начало отсчёта, и уходить ему некуда.',
      ],
      uz: [
        "Minus besh va beshga qaraymiz. Ikkala nuqta ham noldan besh bo'linmada, faqat har xil tomonda.",
        "Bunday sonlar qarama-qarshi deyiladi. Minus ikki va ikki, minus bir va bir ham qarama-qarshi juftlik.",
        "Nolning qarama-qarshi soni esa nolning o'zi: u sanoq boshi va hech qayerga ketmaydi.",
      ],
      en: [
        'Look at minus five and five. Both points are five marks from zero, just on different sides.',
        'Such numbers are called opposites. Minus two and two, minus one and one are opposite pairs as well.',
        'And the opposite of zero is zero itself: it is the origin and has nowhere to move.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Сдвиг по прямой', uz: 'Chiziq bo\'ylab siljish', en: 'A shift along the line' },
    lead: { ru: 'Точка стояла на −4 и сдвинулась вправо на 6 единиц.', uz: "Nuqta −4 da turgan edi va o'ngga 6 birlik siljidi.", en: 'A point at −4 moved 6 units to the right.' },
    steps: [
      { ru: 'от −4 идём вправо: −3, −2, −1, 0', uz: "−4 dan o'ngga: −3, −2, −1, 0", en: 'from −4 going right: −3, −2, −1, 0' },
      { ru: 'прошли 4 шага, осталось 2', uz: "4 qadam bosdik, 2 qoldi", en: 'four steps taken, two left' },
      { ru: 'ещё 2 вправо: попадаем в 2', uz: "yana 2 o'ngga: 2 ga tushamiz", en: 'two more to the right: we land on 2' },
    ],
    done: {
      ru: 'Движение вправо увеличивает координату, влево уменьшает. Точка оказалась в 2.',
      uz: "O'ngga harakat koordinatani oshiradi, chapga esa kamaytiradi. Nuqta 2 ga tushdi.",
      en: 'Moving right increases the coordinate, moving left decreases it. The point landed on 2.',
    },
    audio: {
      ru: [
        'Решаем вместе. Точка стоит на минус четырёх и сдвигается вправо на шесть единиц.',
        'Идём по прямой: минус три, минус два, минус один, ноль. Четыре шага сделали, осталось два.',
        'Ещё два шага вправо, и точка оказывается в двойке. Заметьте: движение вправо всегда увеличивает координату, а влево уменьшает.',
      ],
      uz: [
        "Birga yechamiz. Nuqta minus to'rtda turibdi va o'ngga olti birlik siljiydi.",
        "Chiziq bo'ylab yuramiz: minus uch, minus ikki, minus bir, nol. To'rt qadam bosdik, ikki qoldi.",
        "Yana ikki qadam o'ngga va nuqta ikkiga tushadi. Diqqat qiling: o'ngga harakat koordinatani doim oshiradi, chapga esa kamaytiradi.",
      ],
      en: [
        'Let us solve it together. A point sits at minus four and moves six units to the right.',
        'Walk along the line: minus three, minus two, minus one, zero. Four steps done, two to go.',
        'Two more steps right and the point lands on two. Note that moving right always increases the coordinate and moving left decreases it.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Порядок и единичный отрезок', uz: 'Tartib va birlik kesma', en: 'Order and the unit segment' },
    order_line: { ru: '−5 стоит левее −2, значит −5 меньше', uz: '−5 soni −2 dan chapda, demak −5 kichik', en: '−5 is left of −2, so −5 is smaller' },
    bad_line: { ru: 'ошибка: «−5 больше −2, ведь 5 больше 2»', uz: 'xato: «−5 soni −2 dan katta, axir 5 soni 2 dan katta»', en: 'mistake: “−5 is more than −2 because 5 is more than 2”' },
    unit_line: { ru: 'и деления обязаны быть одинаковыми по всей прямой', uz: "bo'linmalar butun chiziq bo'ylab bir xil bo'lishi shart", en: 'and the marks must be equally spaced along the whole line' },
    done: {
      ru: 'На координатной прямой правее значит больше. Это правило работает и для отрицательных, и мы разберём его подробно в следующих уроках.',
      uz: "Koordinata chizig'ida o'ngroq degani kattaroq. Bu qoida manfiy sonlarga ham tegishli, keyingi darslarda batafsil ko'ramiz.",
      en: 'On a number line, further right means greater. The rule holds for negatives too, and we look at it closely in the next lessons.',
    },
    audio: {
      ru: [
        'Главная ловушка отрицательных чисел. Кажется, что минус пять больше минус двух, потому что пять больше двух.',
        'Но на прямой минус пять стоит левее, а левее значит меньше. Порядок задаёт сама прямая, а не забытый знак минус.',
        'И ещё одно требование к чертежу: деления обязаны быть одинаковыми. Если единичные отрезки разной длины, координаты перестают быть честными.',
      ],
      uz: [
        "Manfiy sonlarning asosiy tuzog'i. Besh ikkidan katta bo'lgani uchun minus besh minus ikkidan katta bo'lib tuyuladi.",
        "Lekin chiziqda minus besh chaproqda turadi, chaproq esa kichikroq degani. Tartibni minus belgisi emas, chiziqning o'zi belgilaydi.",
        "Chizmaga yana bir talab: bo'linmalar bir xil bo'lishi shart. Birlik kesmalar har xil bo'lsa, koordinatalar halol bo'lmay qoladi.",
      ],
      en: [
        'The main trap of negative numbers. It seems that minus five is greater than minus two because five is greater than two.',
        'But on the line minus five sits further left, and further left means smaller. The order comes from the line, not from ignoring the minus.',
        'One more requirement for the drawing: the marks must be equally spaced. With unequal unit segments the coordinates stop being honest.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'Что такое координатная прямая', uz: "Koordinata to'g'ri chizig'i nima", en: 'What a number line is' },
    rule_1: {
      ru: 'Координатная прямая — это прямая с началом отсчёта, единичным отрезком и направлением. Вправо от нуля стоят положительные числа, влево отрицательные.',
      uz: "Koordinata to'g'ri chizig'i — sanoq boshi, birlik kesma va yo'nalishga ega chiziq. Noldan o'ngda musbat, chapda manfiy sonlar turadi.",
      en: 'A number line is a line with an origin, a unit segment and a direction. To the right of zero are positive numbers, to the left negative ones.',
    },
    rule_2: {
      ru: 'Координата показывает, куда и на сколько единиц точка ушла от нуля. Противоположные числа стоят по разные стороны на равном расстоянии. Лифт: 3 − 5 = −2, права была Дилноза.',
      uz: "Koordinata nuqta noldan qaysi tomonga va necha birlikka ketganini ko'rsatadi. Qarama-qarshi sonlar teng masofada, har xil tomonda turadi. Lift: 3 − 5 = −2, Dilnoza haq edi.",
      en: 'A coordinate shows which way and how far a point sits from zero. Opposite numbers stand on different sides at equal distance. The lift: 3 − 5 = −2, Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Координатная прямая это прямая, у которой есть начало отсчёта, единичный отрезок и направление. Вправо от нуля идут положительные числа, влево отрицательные. Координата точки показывает, куда и на сколько единичных отрезков она ушла от нуля, а противоположные числа стоят по разные стороны на равном расстоянии. Вернёмся к лифту. Три минус пять это минус два, второй подземный этаж. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Koordinata to'g'ri chizig'i sanoq boshi, birlik kesma va yo'nalishga ega chiziq. Noldan o'ngga musbat, chapga manfiy sonlar ketadi. Nuqta koordinatasi u noldan qaysi tomonga va necha birlik kesmaga ketganini ko'rsatadi, qarama-qarshi sonlar esa teng masofada har xil tomonda turadi. Liftga qaytamiz. Uch minus besh bu minus ikki, ikkinchi yerto'la qavat. Dilnoza haq edi.",
      en: 'Let us remember the rule. A number line has an origin, a unit segment and a direction. To the right of zero come positive numbers, to the left negative ones. A coordinate shows which way and how many unit segments a point sits from zero, and opposite numbers stand on different sides at equal distance. Back to the lift. Three minus five is minus two, basement floor two. Dilnoza was right.',
    },
  },

  s_coord: {
    title: { ru: 'Найди координату', uz: 'Koordinatani toping', en: 'Find the coordinate' },
    lead: { ru: 'Считай деления от нуля и смотри на сторону.', uz: "Noldan bo'linmalarni sanang va tomoniga qarang.", en: 'Count the marks from zero and check the side.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Точка на 4 деления левее нуля', uz: "Nuqta noldan 4 bo'linma chapda", en: 'A point 4 marks left of zero' },
        opts: ['−4', '4', '0'],
        correct: 0,
        ok: { ru: 'Верно. Левее нуля — знак минус.', uz: 'To\'g\'ri. Noldan chapda — minus belgisi.', en: 'Right. Left of zero means a minus sign.' },
        wrong: [
          null,
          { ru: 'Так была бы точка справа.', uz: "Bunday nuqta o'ngda bo'lardi.", en: 'That would be a point on the right.' },
          { ru: 'Ноль — это само начало отсчёта.', uz: 'Nol bu sanoq boshining o\'zi.', en: 'Zero is the origin itself.' },
        ],
      },
      {
        q: { ru: 'Точка стоит между −2 и −1, ровно посередине', uz: "Nuqta −2 va −1 orasida, roppa-rosa o'rtasida", en: 'A point sits exactly between −2 and −1' },
        opts: ['−1,5', '1,5', '−3'],
        correct: 0,
        ok: { ru: 'Верно. Середина между −2 и −1 это −1,5.', uz: "To'g'ri. −2 va −1 o'rtasi −1,5.", en: 'Right. Halfway between −2 and −1 is −1.5.' },
        wrong: [
          null,
          { ru: 'Знак потерялся: точка левее нуля.', uz: "Belgi yo'qolgan: nuqta noldan chapda.", en: 'The sign was lost: the point is left of zero.' },
          { ru: '−3 стоит ещё левее, за отметкой −2.', uz: "−3 undan ham chapda, −2 belgisidan keyin turadi.", en: '−3 sits even further left, past −2.' },
        ],
      },
      {
        q: { ru: 'Какое число стоит в начале отсчёта?', uz: 'Sanoq boshida qaysi son turadi?', en: 'Which number stands at the origin?' },
        opts: ['0', '1', '−1'],
        correct: 0,
        ok: { ru: 'Верно. Начало отсчёта — это ноль.', uz: "To'g'ri. Sanoq boshi bu nol.", en: 'Right. The origin is zero.' },
        wrong: [
          null,
          { ru: 'Единица стоит на один единичный отрезок правее.', uz: "Bir noldan bitta birlik kesma o'ngda turadi.", en: 'One stands one unit segment to the right.' },
          { ru: 'Минус один — на один отрезок левее.', uz: 'Minus bir — bitta kesma chapda.', en: 'Minus one is one segment to the left.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Сначала смотрим на сторону от нуля, потом считаем деления.',
        uz: "Mashq. Avval nolning qaysi tomoni ekaniga qaraymiz, keyin bo'linmalarni sanaymiz.",
        en: 'Practice. First look at the side of zero, then count the marks.',
      },
    },
  },

  s_move: {
    title: { ru: 'Сдвиг и противоположные', uz: 'Siljish va qarama-qarshi sonlar', en: 'Shifts and opposites' },
    lead: { ru: 'Вправо — увеличиваем, влево — уменьшаем.', uz: "O'ngga — oshiramiz, chapga — kamaytiramiz.", en: 'Right increases, left decreases.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'От 2 сдвинулись влево на 5. Где точка?', uz: "2 dan chapga 5 birlik siljidik. Nuqta qayerda?", en: 'From 2 we move 5 left. Where is the point?' },
        opts: ['−3', '7', '3'],
        correct: 0,
        ok: { ru: 'Верно. 2 − 5 = −3.', uz: "To'g'ri. 2 − 5 = −3.", en: 'Right. 2 − 5 = −3.' },
        wrong: [
          null,
          { ru: 'Влево значит уменьшаем, а не увеличиваем.', uz: 'Chapga degani kamaytirish, oshirish emas.', en: 'Left means decreasing, not increasing.' },
          { ru: 'Знак потерялся: мы ушли левее нуля.', uz: "Belgi yo'qolgan: noldan chapga o'tdik.", en: 'The sign was lost: we passed to the left of zero.' },
        ],
      },
      {
        q: { ru: 'Какое число противоположно −7?', uz: '−7 ga qaysi son qarama-qarshi?', en: 'Which number is the opposite of −7?' },
        opts: ['7', '−7', '0'],
        correct: 0,
        ok: { ru: 'Верно. Оба стоят на 7 делений от нуля, но с разных сторон.', uz: "To'g'ri. Ikkalasi ham noldan 7 bo'linmada, lekin har xil tomonda.", en: 'Right. Both are 7 marks from zero on opposite sides.' },
        wrong: [
          null,
          { ru: 'Само себе число противоположно только у нуля.', uz: "Son o'ziga faqat nolda qarama-qarshi bo'ladi.", en: 'Only zero is its own opposite.' },
          { ru: 'Ноль стоит в начале отсчёта.', uz: 'Nol sanoq boshida turadi.', en: 'Zero stands at the origin.' },
        ],
      },
      {
        q: { ru: 'От −6 сдвинулись вправо на 6. Где точка?', uz: "−6 dan o'ngga 6 siljidik. Nuqta qayerda?", en: 'From −6 we move 6 right. Where is the point?' },
        opts: ['0', '−12', '6'],
        correct: 0,
        ok: { ru: 'Верно. Ровно вернулись в начало отсчёта.', uz: "To'g'ri. Roppa-rosa sanoq boshiga qaytdik.", en: 'Right. Exactly back at the origin.' },
        wrong: [
          null,
          { ru: 'Вправо значит увеличиваем координату.', uz: "O'ngga degani koordinatani oshirish.", en: 'Right means increasing the coordinate.' },
          { ru: 'Шесть шагов от −6 доводят только до нуля.', uz: "−6 dan olti qadam faqat nolgacha olib boradi.", en: 'Six steps from −6 reach only zero.' },
        ],
      },
      {
        q: { ru: 'Что происходит с координатой при движении влево?', uz: 'Chapga harakatlanganda koordinata bilan nima bo\'ladi?', en: 'What happens to a coordinate when moving left?' },
        opts: [
          { ru: 'Уменьшается', uz: 'Kamayadi', en: 'It decreases' },
          { ru: 'Увеличивается', uz: 'Oshadi', en: 'It increases' },
          { ru: 'Не меняется', uz: "O'zgarmaydi", en: 'It stays the same' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Поэтому левее нуля числа отрицательные.', uz: "To'g'ri. Shuning uchun noldan chapda sonlar manfiy.", en: 'Right. That is why numbers left of zero are negative.' },
        wrong: [
          null,
          { ru: 'Увеличивается координата при движении вправо.', uz: "Koordinata o'ngga harakatda oshadi.", en: 'The coordinate increases when moving right.' },
          { ru: 'Если бы не менялась, точка стояла бы на месте.', uz: "O'zgarmasa, nuqta joyida turgan bo'lardi.", en: 'If it did not change, the point would stand still.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на сдвиги. Считайте шаги по прямой и следите за стороной.',
        uz: "Siljish mashqi. Chiziq bo'ylab qadamlarni sanang va tomonini kuzating.",
        en: 'Practice on shifts. Count the steps along the line and watch the side.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Левее или правее нуля', uz: "Noldan chapda yoki o'ngda", en: 'Left or right of zero' },
    lead: { ru: 'Знак минус ставит число левее начала отсчёта.', uz: 'Minus belgisi sonni sanoq boshidan chapga qo\'yadi.', en: 'A minus sign puts the number left of the origin.' },
    bin_a: { ru: 'Левее нуля', uz: 'Noldan chapda', en: 'Left of zero' },
    bin_b: { ru: 'Правее нуля', uz: "Noldan o'ngda", en: 'Right of zero' },
    cards: [
      { label: '−7', bin: 'a' },
      { label: '−0,5', bin: 'a' },
      { label: '−3,5', bin: 'a' },
      { label: '2', bin: 'b' },
      { label: '0,5', bin: 'b' },
      { label: '9', bin: 'b' },
    ],
    hint: {
      ru: 'Со знаком минус — влево, без знака — вправо.',
      uz: 'Minus belgisi bilan — chapga, belgisiz — o\'ngga.',
      en: 'With a minus sign go left, without it go right.',
    },
    correct_text: {
      ru: 'Верно. Знак числа сразу говорит, с какой стороны от нуля искать точку.',
      uz: "To'g'ri. Sonning belgisi nuqtani nolning qaysi tomonidan izlashni darrov aytadi.",
      en: 'Right. The sign immediately says which side of zero the point is on.',
    },
    audio: {
      intro: {
        ru: 'Разложите числа по двум корзинам. Смотрите на знак.',
        uz: 'Sonlarni ikki savatga ajrating. Belgiga qarang.',
        en: 'Sort the numbers into two baskets. Look at the sign.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посмотри на знак числа.', uz: 'Bu yerga emas. Sonning belgisiga qarang.', en: 'Not here. Look at the sign of the number.' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «Точка левее нуля на 2 деления, её координата 2». Проверь.', uz: "Aziz: «Nuqta noldan 2 bo'linma chapda, koordinatasi 2». Tekshiring.", en: 'Aziz: “A point 2 marks left of zero has coordinate 2.” Check it.' },
        opts: [
          { ru: 'Нет: слева от нуля числа отрицательные, это −2', uz: "Yo'q: noldan chapda sonlar manfiy, bu −2", en: 'No: left of zero numbers are negative, so −2' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, это 0', uz: "Yo'q, bu 0", en: 'No, it is 0' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Число делений он посчитал правильно, а знак потерял.', uz: "To'g'ri. Bo'linmalar sonini to'g'ri sanadi, belgini esa yo'qotdi.", en: 'Right. He counted the marks correctly but lost the sign.' },
        wrong: [
          null,
          { ru: 'Точка 2 стоит по другую сторону от нуля.', uz: '2 nuqtasi nolning boshqa tomonida turadi.', en: 'The point 2 sits on the other side of zero.' },
          { ru: 'Ноль был бы, если бы точка стояла в начале отсчёта.', uz: 'Nuqta sanoq boshida tursa, nol bo\'lardi.', en: 'Zero would mean the point sits at the origin.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «Противоположное к 0 это 1». Проверь.', uz: "Dilnoza: «0 ga qarama-qarshi son 1». Tekshiring.", en: 'Dilnoza: “The opposite of 0 is 1.” Check it.' },
        opts: [
          { ru: 'Нет: у нуля противоположное — сам ноль', uz: "Yo'q: nolning qarama-qarshisi — nolning o'zi", en: 'No: the opposite of zero is zero itself' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, это −1', uz: "Yo'q, bu −1", en: 'No, it is −1' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Ноль стоит в начале отсчёта, и расстояние до него равно нулю.', uz: "To'g'ri. Nol sanoq boshida turadi va unga masofa nolga teng.", en: 'Right. Zero sits at the origin and its distance to itself is zero.' },
        wrong: [
          null,
          { ru: 'Единица стоит на один отрезок правее нуля.', uz: "Bir noldan bitta kesma o'ngda turadi.", en: 'One stands a segment to the right of zero.' },
          { ru: 'Минус один — противоположное к единице, а не к нулю.', uz: 'Minus bir — birning qarama-qarshisi, nolniki emas.', en: 'Minus one is the opposite of one, not of zero.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в числе, и в знаке.',
        uz: "Birovning yechimini tekshiring. Xato sonda ham, belgida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the number and in the sign.',
      },
    },
  },

  s_task: {
    title: { ru: 'Этажи и лифт', uz: 'Qavatlar va lift', en: 'Floors and the lift' },
    lead: { ru: 'В доме этажи от −2 до 9. Азиз на 3 этаже, спускается на 5.', uz: "Binoda qavatlar −2 dan 9 gacha. Aziz 3-qavatda, 5 qavat tushadi.", en: 'The building has floors from −2 to 9. Aziz is on floor 3 and goes down 5.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'На каком этаже окажется Азиз?', uz: 'Aziz qaysi qavatga tushadi?', en: 'Which floor does Aziz reach?' },
        opts: ['−2', '8', '2'],
        correct: 0,
        ok: { ru: 'Верно. 3 − 5 = −2, второй подземный.', uz: "To'g'ri. 3 − 5 = −2, ikkinchi yerto'la.", en: 'Right. 3 − 5 = −2, basement two.' },
        wrong: [
          null,
          { ru: 'Он спускался, значит число должно уменьшиться.', uz: 'U tushdi, demak son kamayishi kerak.', en: 'He went down, so the number must decrease.' },
          { ru: 'Пять этажей вниз от третьего проходят через ноль.', uz: 'Uchinchidan besh qavat pastga nol orqali o\'tadi.', en: 'Five floors down from three passes through zero.' },
        ],
      },
      {
        q: { ru: 'С −2 этажа поднялись на 6. Где он теперь?', uz: "−2-qavatdan 6 qavat ko'tarildi. Endi qayerda?", en: 'From floor −2 he goes up 6. Where is he now?' },
        opts: ['4', '8', '−8'],
        correct: 0,
        ok: { ru: 'Верно. −2 + 6 = 4.', uz: "To'g'ri. −2 + 6 = 4.", en: 'Right. −2 + 6 = 4.' },
        wrong: [
          null,
          { ru: 'Два этажа уходят на подъём до нуля.', uz: "Ikki qavat nolgacha ko'tarilishga ketadi.", en: 'Two floors are spent reaching zero.' },
          { ru: 'Он поднимался, значит число растёт.', uz: "U ko'tarildi, demak son o'sadi.", en: 'He went up, so the number grows.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про лифт. Этажи в доме от минус двух до девяти.',
        uz: "Lift haqida masala. Binodagi qavatlar minus ikkidan to'qqizgacha.",
        en: 'A lift problem. The building has floors from minus two to nine.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 9,
        q: { ru: 'Сколько единичных отрезков между −4 и 5? Набери ответ.', uz: "−4 va 5 orasida nechta birlik kesma bor? Javobni tering.", en: 'How many unit segments lie between −4 and 5? Type the answer.' },
        hint: { ru: 'От −4 до 0 четыре отрезка, от 0 до 5 ещё пять.', uz: "−4 dan 0 gacha to'rtta kesma, 0 dan 5 gacha yana beshta.", en: 'From −4 to 0 there are four, from 0 to 5 another five.' },
        hint_audio: { ru: 'От минус четырёх до нуля четыре отрезка, от нуля до пяти ещё пять. Сложите.', uz: "Minus to'rtdan nolgacha to'rtta kesma, noldan beshgacha yana beshta. Qo'shing.", en: 'From minus four to zero there are four segments, from zero to five another five. Add them.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Какое число противоположно 12?', uz: '12 ga qaysi son qarama-qarshi?', en: 'Which number is the opposite of 12?' },
        opts: ['12', '−12', '0', '1/12'],
        wrong: [
          { ru: 'Само себе число противоположно только у нуля.', uz: "Son o'ziga faqat nolda qarama-qarshi.", en: 'Only zero is its own opposite.' },
          null,
          { ru: 'Ноль стоит в начале отсчёта.', uz: 'Nol sanoq boshida turadi.', en: 'Zero stands at the origin.' },
          { ru: 'Это обратное число из тринадцатого урока, а не противоположное.', uz: "Bu o'n uchinchi darsdagi teskari son, qarama-qarshi emas.", en: 'That is the reciprocal from lesson thirteen, not the opposite.' },
        ],
        correct: { ru: 'Верно. Оба на 12 делений от нуля, но с разных сторон.', uz: "To'g'ri. Ikkalasi noldan 12 bo'linmada, lekin har xil tomonda.", en: 'Right. Both are 12 marks from zero on opposite sides.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Точка была на −1 и сдвинулась влево на 4. Где она?', uz: "Nuqta −1 da edi va chapga 4 siljidi. Qayerda?", en: 'A point at −1 moved 4 left. Where is it?' },
        opts: ['3', '−3', '5', '−5'],
        wrong: [
          { ru: 'Влево значит уменьшаем.', uz: 'Chapga degani kamaytirish.', en: 'Left means decreasing.' },
          { ru: 'Четыре шага от минус одного уводят дальше.', uz: "Minus birdan to'rt qadam undan uzoqroqqa olib boradi.", en: 'Four steps from minus one go further than that.' },
          { ru: 'Знак потерялся: мы двигались влево.', uz: "Belgi yo'qolgan: biz chapga yurdik.", en: 'The sign was lost: we moved left.' },
          null,
        ],
        correct: { ru: 'Верно. −1 − 4 = −5.', uz: "To'g'ri. −1 − 4 = −5.", en: 'Right. −1 − 4 = −5.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Что задаёт единичный отрезок?', uz: 'Birlik kesma nimani belgilaydi?', en: 'What does the unit segment set?' },
        opts: [
          { ru: 'Расстояние между соседними целыми числами', uz: "Qo'shni butun sonlar orasidagi masofa", en: 'The distance between neighbouring whole numbers' },
          { ru: 'Число, стоящее в начале отсчёта', uz: 'Sanoq boshidagi son', en: 'The number at the origin' },
          { ru: 'Направление прямой', uz: "Chiziqning yo'nalishi", en: 'The direction of the line' },
          { ru: 'Количество точек на прямой', uz: 'Chiziqdagi nuqtalar soni', en: 'The number of points on the line' },
        ],
        wrong: [
          null,
          { ru: 'В начале отсчёта всегда ноль, это другое.', uz: 'Sanoq boshida doim nol turadi, bu boshqa narsa.', en: 'The origin is always zero: a different thing.' },
          { ru: 'Направление задаётся стрелкой, а не длиной отрезка.', uz: "Yo'nalishni strelka belgilaydi, kesma uzunligi emas.", en: 'The arrow sets the direction, not the segment length.' },
          { ru: 'Точек на прямой бесконечно много.', uz: 'Chiziqdagi nuqtalar cheksiz.', en: 'A line has infinitely many points.' },
        ],
        correct: { ru: 'Верно. Все деления должны быть одинаковыми.', uz: "To'g'ri. Barcha bo'linmalar bir xil bo'lishi kerak.", en: 'Right. All the marks must be equal.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Термометр показывал 2 градуса, потом похолодало на 7. Что он показывает?', uz: "Termometr 2 daraja ko'rsatardi, keyin 7 gradusga sovidi. Endi nechani ko'rsatadi?", en: 'A thermometer showed 2 degrees and it got 7 colder. What now?' },
        opts: ['9', '5', '−5', '−9'],
        wrong: [
          { ru: 'Похолодало, значит число уменьшилось.', uz: 'Sovidi, demak son kamaydi.', en: 'It got colder, so the number went down.' },
          { ru: 'Два минус семь уходит ниже нуля.', uz: 'Ikki minus yetti noldan pastga tushadi.', en: 'Two minus seven goes below zero.' },
          null,
          { ru: 'Семь градусов отсчитывают от двойки, а не от нуля.', uz: 'Yetti daraja ikkidan sanaladi, noldan emas.', en: 'The seven degrees are counted from two, not from zero.' },
        ],
        correct: { ru: 'Верно. 2 − 7 = −5 градусов.', uz: "To'g'ri. 2 − 7 = −5 daraja.", en: 'Right. 2 − 7 = −5 degrees.' },
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
      ru: 'Отрицательные числа впервые записали в Китае больше двух тысяч лет назад: считали палочками, где чёрные означали долг, а красные имущество. В Европе такие числа считали ненастоящими ещё много веков.',
      uz: "Manfiy sonlar birinchi marta Xitoyda ikki ming yildan ko'proq oldin yozilgan: tayoqchalar bilan sanashgan, qora tayoqcha qarzni, qizili mulkni bildirgan. Yevropada bunday sonlarni ko'p asrlar davomida haqiqiy emas deb hisoblashgan.",
      en: 'Negative numbers were first written down in China more than two thousand years ago: counting rods were black for debt and red for property. In Europe such numbers were considered unreal for many centuries.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Отрицательные числа впервые записали в Китае больше двух тысяч лет назад. Считали палочками: чёрные означали долг, красные имущество. В Европе такие числа долго считали ненастоящими.',
      uz: "Bilasizmi? Manfiy sonlar birinchi marta Xitoyda ikki ming yildan ko'proq oldin yozilgan. Tayoqchalar bilan sanashgan: qorasi qarzni, qizili mulkni bildirgan. Yevropada bunday sonlarni uzoq vaqt haqiqiy emas deb hisoblashgan.",
      en: 'Did you know? Negative numbers were first written down in China more than two thousand years ago. They counted with rods: black meant debt and red meant property. In Europe such numbers were long considered unreal.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Отрицательные числа', uz: 'Matematika · Manfiy sonlar', en: 'Mathematics · Negative numbers' },
    heading: { ru: 'Координатная прямая', uz: "Koordinata chizig'i", en: 'The number line' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'ноль — начало отсчёта', uz: 'nol — sanoq boshi', en: 'zero is the origin' },
    brief_2: { ru: 'вправо положительные, влево отрицательные', uz: "o'ngda musbat, chapda manfiy", en: 'right positive, left negative' },
    brief_3: { ru: 'противоположные — на равном расстоянии', uz: 'qarama-qarshi sonlar — teng masofada', en: 'opposites sit at equal distance' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Координата', uz: 'Koordinata', en: 'Coordinate' },
    memo_a1: { ru: 'куда и на сколько ушла точка от нуля', uz: 'nuqta noldan qayerga va qanchaga ketgani', en: 'which way and how far from zero' },
    memo_q2: { ru: 'Единичный отрезок', uz: 'Birlik kesma', en: 'Unit segment' },
    memo_a2: { ru: 'одинаковый по всей прямой', uz: 'butun chiziqda bir xil', en: 'the same along the whole line' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'потерять знак минус', uz: 'minus belgisini yo\'qotish', en: 'losing the minus sign' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'На координатной прямой есть начало отсчёта, единичный отрезок и два направления. Вправо от нуля числа положительные, влево отрицательные, а противоположные стоят на равном расстоянии по разные стороны.',
        'Лифт: с третьего этажа на пять вниз это минус два, второй подземный.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Koordinata chizig'ida sanoq boshi, birlik kesma va ikki yo'nalish bor. Noldan o'ngda sonlar musbat, chapda manfiy, qarama-qarshilari esa teng masofada har xil tomonda turadi.",
        "Lift: uchinchi qavatdan besh qavat pastga bu minus ikki, ikkinchi yerto'la.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'A number line has an origin, a unit segment and two directions. Right of zero the numbers are positive, left negative, and opposites sit at equal distance on different sides.',
        'The lift: from floor three five floors down is minus two, basement two.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Читать прямую', uz: "Usul. Chiziqni o'qish", en: 'Method. Reading the line' },
    m1_steps: {
      ru: ['Найди ноль — это начало отсчёта', 'Посмотри, с какой стороны от нуля точка', 'Сосчитай единичные отрезки и поставь знак'],
      uz: ['Nolni toping — bu sanoq boshi', 'Nuqta nolning qaysi tomonida ekaniga qarang', "Birlik kesmalarni sanang va belgi qo'ying"],
      en: ['Find zero: that is the origin', 'See which side of zero the point is on', 'Count the unit segments and add the sign'],
    },
    m1_no: {
      ru: 'Движение вправо увеличивает координату, влево уменьшает. Противоположное число получается сменой знака.',
      uz: "O'ngga harakat koordinatani oshiradi, chapga kamaytiradi. Qarama-qarshi son belgini almashtirish bilan olinadi.",
      en: 'Moving right increases the coordinate, moving left decreases it. The opposite number comes from flipping the sign.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: подъезд с лифтом. На хуке вопрос, в итоге ответ.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d24wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d24wall)"/>

    {/* Разрез дома: этажи, нижние два под землёй */}
    <g>
      <rect x="30" y="10" width="150" height="134" rx="4" fill="#E5DAC6" stroke="#C9A472" strokeWidth="2"/>
      {[26, 48, 70, 92, 114].map((fy) => (
        <path key={fy} d={`M30 ${fy} h150`} stroke="#C9A472" strokeWidth="1.4"/>
      ))}
      {/* земля: ниже линии подземные этажи */}
      <path d="M0 92 h400" stroke="#B08A57" strokeWidth="2.4" strokeDasharray="6 5"/>
      <rect x="30" y="92" width="150" height="52" fill="#D2A96F" opacity="0.35"/>
      {/* окна */}
      {[[44, 14], [96, 14], [148, 14], [44, 36], [96, 36], [148, 36], [44, 58], [96, 58], [148, 58]].map(([wx, wy], i) => (
        <rect key={i} x={wx} y={wy} width="22" height="12" rx="2" fill="#DCEDF5" stroke="#C9A472" strokeWidth="0.8"/>
      ))}
      {/* машина на подземном этаже */}
      <g opacity="0.8">
        <rect x="48" y="122" width="40" height="12" rx="3" fill="#7ECBE6"/>
        <circle cx="58" cy="135" r="4" fill="#3B3730"/>
        <circle cx="80" cy="135" r="4" fill="#3B3730"/>
      </g>
    </g>

    {/* Шахта лифта и кабина */}
    <g>
      <rect x="186" y="10" width="46" height="134" rx="3" fill="#F1E4CB" stroke="#C9A472" strokeWidth="2"/>
      <g className="d24-cab">
        <rect x="190" y="36" width="38" height="28" rx="3" fill="#FFFDF7" stroke="#8E8578" strokeWidth="2"/>
        <path d="M209 36 v28" stroke="#C9C7C2" strokeWidth="1.4"/>
      </g>
    </g>

    {/* Панель кнопок: подписи этажей БЕЗ ответа */}
    <g>
      <rect x="248" y="18" width="52" height="120" rx="8" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      {[
        { y: 30, t: '3' }, { y: 52, t: '2' }, { y: 74, t: '1' },
        { y: 96, t: '0' }, { y: 118, t: '−1' },
      ].map((b) => (
        <g key={b.t}>
          <circle cx="274" cy={b.y} r="9" fill="#F7F0E2" stroke="#C9A472"/>
          <text x="274" y={b.y + 4} textAnchor="middle" fill="#494550"
            fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{b.t}</text>
        </g>
      ))}
      <circle cx="274" cy="30" r="9" fill="#FBF3D6" stroke="#C99B3A" strokeWidth="2" className="d24-btn-on"/>
    </g>

    {/* Дети у лифта */}
    <Person x={330} ground={140} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={372} ground={140} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <rect x="0" y="140" width="400" height="14" fill="#D2A96F"/>
  </svg>
);

// Итог: координатная прямая с отмеченными 3 и −2.
const FinalScene = () => {
  const x0 = 30; const step = 34; const y = 46;
  const marks = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <path d={`M14 ${y} h372`} stroke="#8E8578" strokeWidth="2.4"/>
      <path d={`M386 ${y} l-8 -4 v8 Z`} fill="#8E8578"/>
      {marks.map((m, i) => {
        const x = x0 + i * step;
        const hit = m === 3 || m === -2;
        return (
          <g key={m}>
            <path d={`M${x} ${y - 6} v12`} stroke="#8E8578" strokeWidth={m === 0 ? 3 : 1.6}/>
            <text x={x} y={y + 24} textAnchor="middle" fill={hit ? '#1F7A4D' : '#8A8883'}
              fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{m}</text>
            {hit && <circle cx={x} cy={y} r="6" fill="#1F7A4D"/>}
          </g>
        );
      })}
      <path d={`M${x0 + 5 * step} ${y - 16} q-85 -22 -170 0`} fill="none" stroke="#C99B3A" strokeWidth="2" strokeDasharray="5 4"/>
      <text x="200" y="18" textAnchor="middle" fill="#C99B3A"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">− 5</text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Координатная прямая: отметки, точки, подписи. Рисуется в SVG.
const NumLine = ({ from = -6, to = 6, points = [], labels = null, arrow = null, size = 'mid' }) => {
  const n = to - from;
  const w = 360;
  const step = w / n;
  const y = 34;
  const px = (v) => 20 + (v - from) * step;
  return (
    <span className={'d24-line-box d24-line-' + size}>
      <svg viewBox="0 0 400 62" aria-hidden="true">
        <path d={`M6 ${y} h388`} stroke="#8E8578" strokeWidth="2.2"/>
        <path d={`M394 ${y} l-8 -4 v8 Z`} fill="#8E8578"/>
        {Array.from({ length: n + 1 }, (_, i) => {
          const v = from + i;
          const x = px(v);
          const show = labels ? labels.includes(v) : true;
          return (
            <g key={v}>
              <path d={`M${x} ${y - 5} v10`} stroke="#8E8578" strokeWidth={v === 0 ? 3 : 1.4}/>
              {show && (
                <text x={x} y={y + 20} textAnchor="middle" fill={v === 0 ? '#494550' : '#8A8883'}
                  fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">{v}</text>
              )}
            </g>
          );
        })}
        {arrow && (
          <path d={`M${px(arrow[0])} ${y - 12} q${(px(arrow[1]) - px(arrow[0])) / 2} -18 ${px(arrow[1]) - px(arrow[0])} 0`}
            fill="none" stroke="#C99B3A" strokeWidth="2" strokeDasharray="5 4"/>
        )}
        {points.map((p) => (
          <g key={p.v}>
            <circle cx={px(p.v)} cy={y} r="6" fill={p.tone === 'b' ? '#019ACB' : '#1F7A4D'}/>
            {p.name && (
              <text x={px(p.v)} y={y - 12} textAnchor="middle" fill={p.tone === 'b' ? '#019ACB' : '#1F7A4D'}
                fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{p.name}</text>
            )}
          </g>
        ))}
      </svg>
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d24-line d24-fade' + (on ? ' d24-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d24-stage">
        <NumLine from={0} to={6} points={step >= 1 ? [{ v: 4, name: 'A' }] : []}/>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: прямая продолжается влево, появляются отрицательные.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d24-stage">
        <NumLine from={step >= 1 ? -5 : 0} to={step >= 1 ? 5 : 6}
          points={step >= 2 ? [{ v: 3, name: 'A', tone: 'b' }, { v: -2, name: 'B' }] : []}
          arrow={step >= 2 ? [3, -2] : null}/>
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

const OppBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_opp;
  const shown = c.pairs.slice(0, step + 1);
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d24-stage">
        <NumLine from={-6} to={6}
          points={shown.flatMap((p) => [{ v: p[0] }, { v: p[1], tone: 'b' }])}/>
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
  const pos = step >= 2 ? 2 : (step >= 1 ? 0 : -4);
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d24-stage">
        <NumLine from={-6} to={6} points={[{ v: pos, name: 'A' }]} arrow={[-4, pos]}/>
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

// Граница: порядок на прямой и одинаковые деления.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d24-stage">
        <NumLine from={-6} to={2} points={[{ v: -5 }, { v: -2, tone: 'b' }]}/>
        <span className="d24-pair d24-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d24-pair d24-pair-good d24-fade' + (step >= 1 ? ' d24-on' : '')}>
          <Line node={t(c.order_line)} on/>
        </span>
        <span className={'d24-pair d24-pair-warn d24-fade' + (step >= 2 ? ' d24-on' : '')}>
          <Line node={t(c.unit_line)} on/>
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
        <div className={'d24-banner fade-up delay-1' + (phase === 'play' ? ' d24-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d24-stage d24-stage-tool">
          {phase === 'demo' ? (
            <>
              <NumLine from={-6} to={6} size="sm"
                points={[
                  ...(shown >= 1 ? [{ v: c.demo_points[0], name: 'A' }] : []),
                  ...(done ? [{ v: c.demo_points[1], name: 'B', tone: 'b' }] : []),
                ]}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d24-verdict' + (done ? ' d24-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d24-acts fade-up">
            <button className="d24-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d24-btn d24-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenOpp = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_opp} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <OppBody step={step}/>}/>
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
      <div className="d24-stage">
        <NumLine from={-5} to={5} points={[{ v: 3, name: 'A', tone: 'b' }, { v: -2, name: 'B' }]} arrow={[3, -2]}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenCoord = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_coord} asideNode={methodAside}/>
);
const ScreenMove = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_move} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: этажи как координатная прямая.
const TaskFig = ({ idx }) => (
  <div className="d24-task-fig">
    <NumLine from={-2} to={9} size="sm"
      points={idx >= 1 ? [{ v: -2, name: 'A' }, { v: 4, name: 'B', tone: 'b' }] : [{ v: 3, name: 'A', tone: 'b' }]}
      arrow={idx >= 1 ? [-2, 4] : [3, -2]}/>
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={(it, idx) => <TaskFig idx={idx}/>}/>
);

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_HIST} anim={<AnimDigits/>} text={CONTENT.s_final.fact}/>}/>
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
.d24-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d24-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d24-stage-tool .d24-line { font-size: clamp(12px, 2vw, 16px); }

/* Координатная прямая */
.d24-line-box { display: block; width: 100%; }
.d24-line-box svg { width: 100%; height: auto; display: block; }
.d24-line-sm svg { max-height: 62px; }

.d24-fade { opacity: 0; transition: opacity 420ms linear; }
.d24-on { opacity: 1; }
.d24-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; }

/* Строки экрана границы */
.d24-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d24-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d24-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d24-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d24-task-fig { display: block; width: 100%; }

/* Экран 4 */
.d24-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d24-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d24-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d24-verdict-on { opacity: 1; }
.d24-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d24-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d24-btn:disabled { opacity: 0.45; cursor: default; }
.d24-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d24-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: кабина лифта едет вниз, кнопка мигает */
.d24-cab { animation: d24Cab 6000ms ease-in-out infinite; }
@keyframes d24Cab { 0%, 15% { transform: translateY(0); } 55%, 75% { transform: translateY(76px); } 100% { transform: translateY(0); } }
.d24-btn-on { animation: d24Btn 2400ms ease-in-out infinite; }
@keyframes d24Btn { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d24-cab, .d24-btn-on { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function NumberLineLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenOpp, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenCoord, ScreenMove, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
