// ============================================================
// 6 КЛАСС, УРОК 25 «Модуль числа»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок 24 поставил числа на прямую. Модуль отвечает на другой вопрос:
// не «где точка», а «как далеко она от нуля». Поэтому модуль никогда не
// бывает отрицательным, а уравнение с модулем имеет два решения.
//
// Сцена — окно класса: уличный термометр и комнатный.
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
  lessonId: 'grade6-25',
  lessonTitle: {
    ru: 'Модуль числа',
    uz: 'Sonning moduli',
    en: 'Absolute value',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 termometr: −7 va 5
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 qarama-qarshi sonlar esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 modul = noldan masofa
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: modulni hisoblash
  { id: 's_eq',     type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 modulli tenglama: ikki yechim
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: nuqtalar orasidagi masofa
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: modul manfiy bo'lmaydi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_abs',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 modulni toping x3
  { id: 's_dist',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 tenglama va masofa x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: modul o'ziga tengmi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: harorat
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Мороз и жара', uz: 'Sovuq va issiq', en: 'Frost and heat' },
    lead: {
      ru: 'Зимой термометр показал −7 градусов, летом +5 в тени ранним утром.',
      uz: "Qishda termometr −7 daraja ko'rsatdi, yozda esa erta tongda soyada +5.",
      en: 'In winter the thermometer showed −7 degrees, in summer +5 in the shade at dawn.',
    },
    voice_a: { ru: 'Азиз: +5 дальше от нуля, оно же больше.', uz: "Aziz: +5 noldan uzoqroq, u kattaroq-ku.", en: 'Aziz: +5 is further from zero, it is the bigger one.' },
    voice_b: { ru: 'Дилноза: нет, −7 дальше.', uz: "Dilnoza: yo'q, −7 uzoqroq.", en: 'Dilnoza: no, −7 is further.' },
    ask: { ru: 'Какая температура дальше от нуля?', uz: 'Qaysi harorat noldan uzoqroq?', en: 'Which temperature is further from zero?' },
    options: [
      { ru: '+5 градусов', uz: '+5 daraja', en: '+5 degrees' },
      { ru: '−7 градусов', uz: '−7 daraja', en: '−7 degrees' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Зимой уличный термометр показал минус семь градусов, а летом ранним утром плюс пять.',
          'Азиз считает, что плюс пять дальше от нуля, ведь это число больше. Дилноза говорит, что дальше минус семь. Какая температура дальше от нуля? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Qishda ko'chadagi termometr minus yetti daraja ko'rsatdi, yozda erta tongda esa plyus besh.",
          "Aziz plyus besh noldan uzoqroq deb hisoblaydi, axir bu son kattaroq. Dilnoza minus yetti uzoqroq deydi. Qaysi harorat noldan uzoqroq? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'In winter the outdoor thermometer showed minus seven degrees, in summer at dawn plus five.',
          'Aziz thinks plus five is further from zero because it is the bigger number. Dilnoza says minus seven is further. Which is further from zero? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Противоположные числа', uz: 'Qarama-qarshi sonlar', en: 'Opposite numbers' },
    pair: [-4, 4],
    done: {
      ru: 'Противоположные числа стоят по разные стороны от нуля, но на одинаковом расстоянии. Именно это расстояние нам сегодня и нужно.',
      uz: "Qarama-qarshi sonlar nolning har xil tomonida, lekin bir xil masofada turadi. Bugun bizga aynan shu masofa kerak.",
      en: 'Opposite numbers sit on different sides of zero but at the same distance. That distance is exactly what we need today.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Минус четыре и четыре противоположные числа.',
        'Они стоят по разные стороны от нуля, но расстояние до нуля у них одинаковое: четыре единичных отрезка.',
        'Сегодня мы дадим этому расстоянию имя и научимся его записывать.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Minus to'rt va to'rt qarama-qarshi sonlar.",
        "Ular nolning har xil tomonida turadi, lekin nolgacha masofasi bir xil: to'rtta birlik kesma.",
        "Bugun shu masofaga nom beramiz va uni yozishni o'rganamiz.",
      ],
      en: [
        'Recall the last lesson. Minus four and four are opposites.',
        'They sit on different sides of zero, but their distance to zero is the same: four unit segments.',
        'Today we give that distance a name and learn to write it.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Модуль — это расстояние', uz: 'Modul — bu masofa', en: 'Absolute value is a distance' },
    lines: [
      { ru: 'от −7 до нуля 7 единиц', uz: '−7 dan nolgacha 7 birlik', en: 'from −7 to zero is 7 units' },
      { ru: 'от 5 до нуля 5 единиц', uz: '5 dan nolgacha 5 birlik', en: 'from 5 to zero is 5 units' },
      { ru: 'модуль −7 равен 7, модуль 5 равен 5', uz: '−7 ning moduli 7, 5 ning moduli 5', en: 'the absolute value of −7 is 7, of 5 is 5' },
    ],
    done: {
      ru: 'Модуль показывает расстояние от нуля, а у расстояния не бывает знака. 7 больше 5, значит мороз был дальше от нуля. Права была Дилноза.',
      uz: "Modul noldan masofani ko'rsatadi, masofada esa ishora bo'lmaydi. 7 soni 5 dan katta, demak sovuq noldan uzoqroq edi. Dilnoza haq edi.",
      en: 'Absolute value shows the distance from zero, and a distance has no sign. Seven is more than five, so the frost was further from zero. Dilnoza was right.',
    },
    audio: {
      ru: [
        'Поставим обе температуры на координатную прямую. От минус семи до нуля семь делений.',
        'От пяти до нуля пять делений. Это расстояние и называют модулем числа. Записывают его двумя вертикальными чертами.',
        'Модуль минус семи равен семи, модуль пяти равен пяти. Расстояние не бывает отрицательным, поэтому модуль всегда положительный или ноль. Семь больше пяти, значит мороз дальше от нуля. Права была Дилноза.',
      ],
      uz: [
        "Ikkala haroratni koordinata chizig'iga qo'yamiz. Minus yettidan nolgacha yetti bo'linma.",
        "Beshdan nolgacha besh bo'linma. Bu masofa sonning moduli deyiladi. U ikkita tik chiziq bilan yoziladi.",
        "Minus yettining moduli yetti, beshning moduli besh. Masofa manfiy bo'lmaydi, shuning uchun modul doim musbat yoki nol. Yetti beshdan katta, demak sovuq noldan uzoqroq. Dilnoza haq edi.",
      ],
      en: [
        'Put both temperatures on the number line. From minus seven to zero is seven marks.',
        'From five to zero is five marks. That distance is called the absolute value and is written with two vertical bars.',
        'The absolute value of minus seven is seven, of five is five. A distance is never negative, so an absolute value is always positive or zero. Seven is more than five, so the frost is further from zero. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Как найти модуль', uz: 'Modul qanday topiladi', en: 'How to find an absolute value' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'у положительного модуль равен самому числу', uz: "musbat sonning moduli sonning o'ziga teng", en: 'for a positive number it equals the number' },
      { ru: 'у отрицательного — противоположному', uz: 'manfiy sonniki — qarama-qarshisiga', en: 'for a negative one it equals its opposite' },
      { ru: 'модуль нуля равен нулю', uz: 'nolning moduli nolga teng', en: 'the absolute value of zero is zero' },
    ],
    demo_note: {
      ru: 'Проще всего представить точку на прямой и посчитать шаги до нуля: знак при этом просто исчезает.',
      uz: "Eng oson yo'li nuqtani chiziqda tasavvur qilib, nolgacha qadamlarni sanash: shunda ishora yo'qoladi.",
      en: 'The easiest way is to picture the point and count steps to zero: the sign simply disappears.',
    },
    play_ask: { ru: 'Чему равен модуль −4,5?', uz: '−4,5 ning moduli nechaga teng?', en: 'What is the absolute value of −4.5?' },
    play_opts: ['−4,5', '4,5', '0'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. Расстояние от −4,5 до нуля равно 4,5.',
      uz: "To'g'ri. −4,5 dan nolgacha masofa 4,5 ga teng.",
      en: 'Right. The distance from −4.5 to zero is 4.5.',
    },
    play_wrong: [
      { ru: 'Модуль не бывает отрицательным: это расстояние.', uz: "Modul manfiy bo'lmaydi: bu masofa.", en: 'An absolute value is never negative: it is a distance.' },
      null,
      { ru: 'Ноль был бы, если бы точка стояла в начале отсчёта.', uz: 'Nuqta sanoq boshida tursagina nol bo\'lardi.', en: 'Zero would mean the point sits at the origin.' },
    ],
    audio: {
      intro: {
        ru: 'Модуль находят просто. У положительного числа он равен самому числу, у отрицательного противоположному, а у нуля нулю. Покажу на прямой.',
        uz: "Modul oson topiladi. Musbat sonda u sonning o'ziga, manfiyda qarama-qarshisiga, nolda esa nolga teng. Chiziqda ko'rsataman.",
        en: 'Absolute value is simple. For a positive number it equals the number, for a negative one its opposite, and for zero it is zero. I will show it on the line.',
      },
      demo: {
        ru: 'Модуль трёх равен трём, модуль минус трёх тоже три. Обе точки стоят на три деления от нуля, только с разных сторон.',
        uz: "Uchning moduli uch, minus uchning moduli ham uch. Ikkala nuqta ham noldan uch bo'linmada, faqat har xil tomonda.",
        en: 'The absolute value of three is three, and of minus three is also three. Both points are three marks from zero, just on different sides.',
      },
      play: {
        ru: 'Теперь ваша очередь. Чему равен модуль минус четырёх целых пяти десятых?',
        uz: "Endi sizning navbatingiz. Minus to'rt butun besh o'ndanning moduli nechaga teng?",
        en: 'Now it is your turn. What is the absolute value of minus four point five?',
      },
      ok: {
        ru: 'Верно. Расстояние до нуля четыре целых пять десятых.',
        uz: "To'g'ri. Nolgacha masofa to'rt butun besh o'ndan.",
        en: 'Right. The distance to zero is four point five.',
      },
      wrong: {
        ru: 'Представьте точку на прямой и сосчитайте расстояние до нуля.',
        uz: 'Nuqtani chiziqda tasavvur qiling va nolgacha masofani sanang.',
        en: 'Picture the point on the line and count the distance to zero.',
      },
    },
  },

  s_eq: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Уравнение с модулем', uz: 'Modulli tenglama', en: 'An equation with absolute value' },
    lines: [
      { ru: 'какие числа стоят в 3 шагах от нуля?', uz: 'noldan 3 qadamda qaysi sonlar turadi?', en: 'which numbers are 3 steps from zero?' },
      { ru: 'слева −3 и справа 3', uz: "chapda −3 va o'ngda 3", en: '−3 on the left and 3 on the right' },
      { ru: 'значит у такого уравнения два решения', uz: 'demak bunday tenglamaning ikkita yechimi bor', en: 'so such an equation has two solutions' },
    ],
    done: {
      ru: 'Модуль стирает знак, поэтому подходят сразу два числа: положительное и противоположное ему. Одно решение бывает только у нуля.',
      uz: "Modul ishorani o'chiradi, shuning uchun ikkita son mos keladi: musbati va uning qarama-qarshisi. Bitta yechim faqat nolda bo'ladi.",
      en: 'Absolute value erases the sign, so two numbers fit at once: the positive one and its opposite. Only zero gives a single solution.',
    },
    audio: {
      ru: [
        'Зададим обратный вопрос. Модуль числа равен трём. Какое это число?',
        'Смотрим на прямую: в трёх шагах от нуля стоят две точки, минус три и три.',
        'Значит подходят оба, и у такого уравнения два решения. Единственное исключение это ноль: если модуль равен нулю, само число тоже ноль.',
      ],
      uz: [
        "Teskari savol beramiz. Sonning moduli uchga teng. Bu qaysi son?",
        "Chiziqqa qaraymiz: noldan uch qadamda ikkita nuqta turibdi, minus uch va uch.",
        "Demak ikkalasi ham mos keladi va bunday tenglamaning ikkita yechimi bor. Yagona istisno bu nol: modul nolga teng bo'lsa, sonning o'zi ham nol.",
      ],
      en: [
        'Ask the reverse question. The absolute value of a number is three. Which number is it?',
        'Look at the line: three steps from zero there are two points, minus three and three.',
        'Both fit, so such an equation has two solutions. The only exception is zero: if the absolute value is zero, the number is zero too.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Расстояние между точками', uz: 'Nuqtalar orasidagi masofa', en: 'The distance between points' },
    lead: { ru: 'Точка A стоит на −2, точка B на 5.', uz: "A nuqtasi −2 da, B nuqtasi 5 da turibdi.", en: 'Point A is at −2 and point B at 5.' },
    steps: [
      { ru: 'от −2 до нуля 2 шага', uz: '−2 dan nolgacha 2 qadam', en: 'from −2 to zero is 2 steps' },
      { ru: 'от нуля до 5 ещё 5 шагов', uz: 'noldan 5 gacha yana 5 qadam', en: 'from zero to 5 another 5 steps' },
      { ru: 'всего 2 + 5 = 7 единиц', uz: 'jami 2 + 5 = 7 birlik', en: '2 + 5 = 7 units in total' },
    ],
    done: {
      ru: 'Когда точки по разные стороны от нуля, расстояния складываются. Модуль помогает считать длину, а не смотреть на знаки.',
      uz: "Nuqtalar nolning har xil tomonida bo'lsa, masofalar qo'shiladi. Modul ishoralarga qarash emas, uzunlikni hisoblashga yordam beradi.",
      en: 'When the points are on opposite sides of zero, the distances add up. Absolute value helps count length instead of watching signs.',
    },
    audio: {
      ru: [
        'Решаем вместе. Точка A стоит на минус двух, точка B на пяти. Найдём расстояние между ними.',
        'От минус двух до нуля два шага, это модуль минус двух.',
        'От нуля до пяти ещё пять шагов. Складываем и получаем семь единичных отрезков. Точки по разные стороны от нуля, поэтому расстояния сложились.',
      ],
      uz: [
        "Birga yechamiz. A nuqtasi minus ikkida, B nuqtasi beshda. Ular orasidagi masofani topamiz.",
        "Minus ikkidan nolgacha ikki qadam, bu minus ikkining moduli.",
        "Noldan beshgacha yana besh qadam. Qo'shamiz va yetti birlik kesma chiqadi. Nuqtalar nolning har xil tomonida, shuning uchun masofalar qo'shildi.",
      ],
      en: [
        'Let us solve it together. Point A is at minus two and point B at five. Find the distance between them.',
        'From minus two to zero is two steps, the absolute value of minus two.',
        'From zero to five is five more steps. Adding gives seven unit segments. The points are on opposite sides of zero, so the distances added up.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Модуль не убирает минус везде', uz: 'Modul har joyda minusni yo\'qotmaydi', en: 'Absolute value does not erase every minus' },
    bad_line: { ru: 'ошибка: минус модуль −3 равен 3', uz: 'xato: minus modul −3 teng 3', en: 'mistake: minus the absolute value of −3 equals 3' },
    good_line: { ru: 'верно: модуль −3 равен 3, а минус перед ним даёт −3', uz: "to'g'ri: −3 ning moduli 3, oldidagi minus esa −3 beradi", en: 'right: the absolute value is 3 and the minus in front gives −3' },
    none_line: { ru: 'а уравнение с модулем, равным −2, решений не имеет', uz: 'moduli −2 ga teng tenglamaning yechimi yo\'q', en: 'and an equation with absolute value −2 has no solutions' },
    done: {
      ru: 'Модуль убирает знак только внутри своих черт. Всё, что стоит снаружи, остаётся как было, а расстояние не может равняться отрицательному числу.',
      uz: "Modul ishorani faqat o'z chiziqlari ichida yo'qotadi. Tashqaridagi hamma narsa o'z holicha qoladi, masofa esa manfiy songa teng bo'lolmaydi.",
      en: 'Absolute value removes the sign only inside its bars. Anything outside stays as it was, and a distance cannot equal a negative number.',
    },
    audio: {
      ru: [
        'Первая ловушка. Ученик видит минус перед модулем и решает, что минусы сократились. Это не так.',
        'Модуль минус трёх равен трём, но минус, стоящий снаружи, никуда не делся. Ответ минус три.',
        'Вторая ловушка. Уравнение, где модуль равен минус двум, решений не имеет: расстояние не бывает отрицательным.',
      ],
      uz: [
        "Birinchi tuzoq. O'quvchi modul oldidagi minusni ko'rib, minuslar qisqardi deb o'ylaydi. Bunday emas.",
        "Minus uchning moduli uch, lekin tashqarida turgan minus hech qayerga ketmagan. Javob minus uch.",
        "Ikkinchi tuzoq. Moduli minus ikkiga teng tenglamaning yechimi yo'q: masofa manfiy bo'lmaydi.",
      ],
      en: [
        'The first trap. A student sees a minus in front of the bars and decides the minuses cancel. They do not.',
        'The absolute value of minus three is three, but the minus outside is still there. The answer is minus three.',
        'The second trap. An equation where the absolute value equals minus two has no solutions: a distance is never negative.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Что такое модуль', uz: 'Modul nima', en: 'What absolute value is' },
    rule_1: {
      ru: 'Модуль числа — это расстояние от точки до начала отсчёта. У положительного числа модуль равен самому числу, у отрицательного — противоположному, у нуля равен нулю.',
      uz: "Sonning moduli — nuqtadan sanoq boshigacha masofa. Musbat sonda modul sonning o'ziga, manfiyda qarama-qarshisiga, nolda nolga teng.",
      en: 'The absolute value of a number is the distance from its point to the origin. For a positive number it equals the number, for a negative one its opposite, and for zero it is zero.',
    },
    rule_2: {
      ru: 'Модуль никогда не бывает отрицательным, а уравнение с модулем обычно даёт два решения. Термометр: расстояние 7 больше 5, права была Дилноза.',
      uz: "Modul hech qachon manfiy bo'lmaydi, modulli tenglama esa odatda ikkita yechim beradi. Termometr: 7 masofa 5 dan katta, Dilnoza haq edi.",
      en: 'An absolute value is never negative, and an equation with it usually has two solutions. The thermometer: a distance of 7 beats 5, so Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Модуль числа это расстояние от его точки до начала отсчёта. У положительного числа модуль равен самому числу, у отрицательного противоположному, у нуля нулю. Модуль никогда не бывает отрицательным, а уравнение с модулем обычно имеет два решения. Вернёмся к термометру. Расстояние от минус семи до нуля семь, а от пяти пять. Семь больше, значит мороз дальше от нуля. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Sonning moduli uning nuqtasidan sanoq boshigacha masofa. Musbat sonda modul sonning o'ziga, manfiyda qarama-qarshisiga, nolda nolga teng. Modul hech qachon manfiy bo'lmaydi, modulli tenglama esa odatda ikkita yechimga ega. Termometrga qaytamiz. Minus yettidan nolgacha masofa yetti, beshdan esa besh. Yetti kattaroq, demak sovuq noldan uzoqroq. Dilnoza haq edi.",
      en: 'Let us remember the rule. The absolute value of a number is the distance from its point to the origin. For a positive number it equals the number, for a negative one its opposite, and for zero it is zero. It is never negative, and an equation with it usually has two solutions. Back to the thermometer. From minus seven to zero is seven, from five it is five. Seven is more, so the frost is further from zero. Dilnoza was right.',
    },
  },

  s_abs: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди модуль', uz: 'Modulni toping', en: 'Find the absolute value' },
    lead: { ru: 'Считай шаги до нуля, знак не переносится.', uz: 'Nolgacha qadamlarni sanang, ishora ko\'chmaydi.', en: 'Count the steps to zero; the sign does not carry over.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Модуль −9', uz: '−9 ning moduli', en: 'The absolute value of −9' },
        opts: ['9', '−9', '0'],
        correct: 0,
        ok: { ru: 'Верно. Расстояние от −9 до нуля равно 9.', uz: "To'g'ri. −9 dan nolgacha masofa 9.", en: 'Right. The distance from −9 to zero is 9.' },
        wrong: [
          null,
          { ru: 'Расстояние не бывает отрицательным.', uz: "Masofa manfiy bo'lmaydi.", en: 'A distance is never negative.' },
          { ru: 'Ноль был бы только у самого нуля.', uz: 'Nol faqat nolning o\'zida bo\'lardi.', en: 'Zero would happen only for zero itself.' },
        ],
      },
      {
        q: { ru: 'Модуль 12', uz: '12 ning moduli', en: 'The absolute value of 12' },
        opts: ['12', '−12', '1,2'],
        correct: 0,
        ok: { ru: 'Верно. У положительного числа модуль равен ему самому.', uz: "To'g'ri. Musbat sonning moduli o'ziga teng.", en: 'Right. For a positive number it equals the number itself.' },
        wrong: [
          null,
          { ru: 'Знак минус здесь взяться неоткуда.', uz: 'Bu yerda minus belgisi qayerdan ham kelsin.', en: 'There is nowhere for a minus to come from.' },
          { ru: 'Запятая появилась сама собой.', uz: "Vergul o'z-o'zidan paydo bo'ldi.", en: 'The decimal point appeared out of nowhere.' },
        ],
      },
      {
        q: { ru: 'Модуль 0', uz: '0 ning moduli', en: 'The absolute value of 0' },
        opts: ['0', '1', 'нет ответа'],
        correct: 0,
        ok: { ru: 'Верно. Ноль стоит в начале отсчёта, расстояние равно нулю.', uz: "To'g'ri. Nol sanoq boshida turadi, masofa nolga teng.", en: 'Right. Zero sits at the origin, so the distance is zero.' },
        wrong: [
          null,
          { ru: 'От нуля до нуля нет ни одного шага.', uz: "Noldan nolgacha bironta ham qadam yo'q.", en: 'From zero to zero there are no steps.' },
          { ru: 'Ответ есть: модуль нуля определён и равен нулю.', uz: "Javob bor: nolning moduli aniqlangan va nolga teng.", en: 'There is an answer: the absolute value of zero is defined and equals zero.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на модуль. Представляйте точку и считайте расстояние до нуля.',
        uz: 'Modul mashqi. Nuqtani tasavvur qiling va nolgacha masofani sanang.',
        en: 'Practice on absolute value. Picture the point and count the distance to zero.',
      },
    },
  },

  s_dist: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Уравнения и расстояния', uz: 'Tenglamalar va masofalar', en: 'Equations and distances' },
    lead: { ru: 'Помни: подходящих чисел обычно два.', uz: 'Esda tuting: mos sonlar odatda ikkita.', en: 'Remember: usually two numbers fit.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Модуль числа равен 6. Какие это числа?', uz: 'Sonning moduli 6 ga teng. Bular qaysi sonlar?', en: 'The absolute value is 6. Which numbers are they?' },
        opts: ['6 и −6', 'только 6', 'только −6'],
        correct: 0,
        ok: { ru: 'Верно. Обе точки стоят в 6 шагах от нуля.', uz: "To'g'ri. Ikkala nuqta ham noldan 6 qadamda.", en: 'Right. Both points are 6 steps from zero.' },
        wrong: [
          null,
          { ru: 'Слева от нуля есть такая же точка.', uz: "Noldan chapda ham xuddi shunday nuqta bor.", en: 'There is a matching point to the left of zero.' },
          { ru: 'Справа от нуля есть такая же точка.', uz: "Noldan o'ngda ham xuddi shunday nuqta bor.", en: 'There is a matching point to the right of zero.' },
        ],
      },
      {
        q: { ru: 'Расстояние между точками −3 и 4', uz: '−3 va 4 nuqtalari orasidagi masofa', en: 'The distance between −3 and 4' },
        opts: ['7', '1', '12'],
        correct: 0,
        ok: { ru: 'Верно. 3 шага до нуля и ещё 4 после него.', uz: "To'g'ri. Nolgacha 3 qadam va undan keyin yana 4.", en: 'Right. Three steps to zero and four after it.' },
        wrong: [
          null,
          { ru: 'Так вышло бы, если бы обе точки были справа.', uz: "Ikkala nuqta ham o'ngda bo'lsa shunday chiqardi.", en: 'That would happen if both points were on the right.' },
          { ru: 'Это произведение, а не расстояние.', uz: "Bu ko'paytma, masofa emas.", en: 'That is a product, not a distance.' },
        ],
      },
      {
        q: { ru: 'Модуль числа равен 0. Какое это число?', uz: 'Sonning moduli 0 ga teng. Bu qaysi son?', en: 'The absolute value is 0. Which number is it?' },
        opts: ['0', '0 и −0', 'любое'],
        correct: 0,
        ok: { ru: 'Верно. Только ноль стоит в начале отсчёта.', uz: "To'g'ri. Faqat nol sanoq boshida turadi.", en: 'Right. Only zero sits at the origin.' },
        wrong: [
          null,
          { ru: 'У нуля нет отдельного отрицательного близнеца.', uz: "Nolning alohida manfiy egizagi yo'q.", en: 'Zero has no separate negative twin.' },
          { ru: 'У других чисел расстояние до нуля больше нуля.', uz: "Boshqa sonlarda nolgacha masofa noldan katta.", en: 'For other numbers the distance to zero is more than zero.' },
        ],
      },
      {
        q: { ru: 'Может ли модуль равняться −4?', uz: 'Modul −4 ga teng bo\'la oladimi?', en: 'Can an absolute value equal −4?' },
        opts: [
          { ru: 'Нет, расстояние не бывает отрицательным', uz: "Yo'q, masofa manfiy bo'lmaydi", en: 'No, a distance is never negative' },
          { ru: 'Да, если число отрицательное', uz: "Ha, agar son manfiy bo'lsa", en: 'Yes, if the number is negative' },
          { ru: 'Да, всегда', uz: 'Ha, har doim', en: 'Yes, always' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Поэтому такое уравнение решений не имеет.', uz: "To'g'ri. Shuning uchun bunday tenglamaning yechimi yo'q.", en: 'Right. That is why such an equation has no solutions.' },
        wrong: [
          null,
          { ru: 'У отрицательного числа модуль положительный.', uz: 'Manfiy sonning moduli musbat.', en: 'A negative number has a positive absolute value.' },
          { ru: 'Никогда: модуль это длина пути до нуля.', uz: "Hech qachon: modul nolgacha yo'l uzunligi.", en: 'Never: it is the length of the way to zero.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на уравнения и расстояния. Смотрите на прямую, а не только на знаки.',
        uz: 'Tenglama va masofa mashqi. Faqat ishoralarga emas, chiziqqa qarang.',
        en: 'Practice on equations and distances. Look at the line, not just at signs.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Модуль равен самому числу или нет', uz: "Modul sonning o'ziga tengmi", en: 'Does the absolute value equal the number' },
    lead: { ru: 'У положительных и нуля модуль совпадает с числом.', uz: "Musbat sonlar va nolda modul son bilan mos keladi.", en: 'For positives and zero the absolute value matches the number.' },
    bin_a: { ru: 'Равен числу', uz: 'Songa teng', en: 'Equals the number' },
    bin_b: { ru: 'Равен противоположному', uz: 'Qarama-qarshisiga teng', en: 'Equals its opposite' },
    cards: [
      { label: '7', bin: 'a' },
      { label: '0', bin: 'a' },
      { label: '2,5', bin: 'a' },
      { label: '−7', bin: 'b' },
      { label: '−0,5', bin: 'b' },
      { label: '−12', bin: 'b' },
    ],
    hint: {
      ru: 'Если число справа от нуля или в нуле — модуль совпадает с ним.',
      uz: "Son noldan o'ngda yoki nolda bo'lsa — modul u bilan mos keladi.",
      en: 'If the number is right of zero or at zero, the absolute value matches it.',
    },
    correct_text: {
      ru: 'Верно. Модуль меняет только знак минус, а само расстояние остаётся тем же.',
      uz: "To'g'ri. Modul faqat minus belgisini o'zgartiradi, masofaning o'zi esa o'sha bo'lib qoladi.",
      en: 'Right. Absolute value changes only the minus sign; the distance itself stays.',
    },
    audio: {
      intro: {
        ru: 'Разложите числа по двум корзинам. Смотрите на знак.',
        uz: 'Sonlarni ikki savatga ajrating. Belgiga qarang.',
        en: 'Sort the numbers into two baskets. Look at the sign.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посмотри, с какой стороны от нуля число.', uz: 'Bu yerga emas. Son nolning qaysi tomonida ekaniga qarang.', en: 'Not here. Check which side of zero the number is on.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «Модуль −8 равен −8, ведь число отрицательное». Проверь.', uz: "Aziz: «−8 ning moduli −8, axir son manfiy». Tekshiring.", en: 'Aziz: “The absolute value of −8 is −8 because the number is negative.” Check it.' },
        opts: [
          { ru: 'Нет: модуль это расстояние, он равен 8', uz: "Yo'q: modul masofa, u 8 ga teng", en: 'No: it is a distance and equals 8' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, он равен 0', uz: "Yo'q, u 0 ga teng", en: 'No, it equals 0' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Знак числа на расстояние не влияет.', uz: "To'g'ri. Sonning ishorasi masofaga ta'sir qilmaydi.", en: 'Right. The sign of the number does not affect the distance.' },
        wrong: [
          null,
          { ru: 'Расстояние не бывает отрицательным.', uz: "Masofa manfiy bo'lmaydi.", en: 'A distance is never negative.' },
          { ru: 'Ноль был бы только у самого нуля.', uz: "Nol faqat nolning o'zida bo'lardi.", en: 'Zero would happen only for zero itself.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «Если модуль равен 5, то число только 5». Проверь.', uz: "Dilnoza: «Modul 5 ga teng bo'lsa, son faqat 5». Tekshiring.", en: 'Dilnoza: “If the absolute value is 5, the number is only 5.” Check it.' },
        opts: [
          { ru: 'Нет: подходит и −5', uz: "Yo'q: −5 ham mos keladi", en: 'No: −5 fits too' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, подходит только −5', uz: "Yo'q, faqat −5 mos keladi", en: 'No, only −5 fits' },
        ],
        correct: 0,
        ok: { ru: 'Верно. В пяти шагах от нуля стоят две точки.', uz: "To'g'ri. Noldan besh qadamda ikkita nuqta turadi.", en: 'Right. Five steps from zero there are two points.' },
        wrong: [
          null,
          { ru: 'Слева от нуля есть точка на том же расстоянии.', uz: "Noldan chapda ham shu masofada nuqta bor.", en: 'There is a point at the same distance to the left.' },
          { ru: 'Пятёрка тоже подходит: её модуль равен пяти.', uz: 'Besh ham mos: uning moduli beshga teng.', en: 'Five fits as well: its absolute value is five.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в знаке, и в числе решений.',
        uz: "Birovning yechimini tekshiring. Xato ishorada ham, yechimlar sonida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the sign and in the number of solutions.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Термометр за окном', uz: 'Deraza ortidagi termometr', en: 'The thermometer outside' },
    lead: { ru: 'Утром было −7, днём стало +5.', uz: 'Ertalab −7 edi, kunduzi +5 bo\'ldi.', en: 'In the morning it was −7 and by noon +5.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'На сколько градусов потеплело?', uz: 'Necha darajaga isidi?', en: 'By how many degrees did it warm up?' },
        opts: ['12', '2', '35'],
        correct: 0,
        ok: { ru: 'Верно. 7 градусов до нуля и ещё 5 после: всего 12.', uz: "To'g'ri. Nolgacha 7 daraja va undan keyin yana 5: jami 12.", en: 'Right. Seven degrees to zero and five after: twelve in total.' },
        wrong: [
          null,
          { ru: 'Так вышло бы, если бы обе температуры были выше нуля.', uz: "Ikkala harorat ham noldan yuqori bo'lsa shunday chiqardi.", en: 'That would happen if both temperatures were above zero.' },
          { ru: 'Это произведение, а не разность.', uz: "Bu ko'paytma, ayirma emas.", en: 'That is a product, not a difference.' },
        ],
      },
      {
        q: { ru: 'Какая температура была дальше от нуля?', uz: 'Qaysi harorat noldan uzoqroq edi?', en: 'Which temperature was further from zero?' },
        opts: ['Утренняя', 'Дневная', 'Одинаково'],
        correct: 0,
        ok: { ru: 'Верно. Модуль −7 равен 7, а модуль 5 равен 5.', uz: "To'g'ri. −7 ning moduli 7, 5 ning moduli 5.", en: 'Right. The absolute value of −7 is 7 and of 5 is 5.' },
        wrong: [
          null,
          { ru: 'Пять ближе к нулю, чем семь.', uz: 'Besh nolga yettidan yaqinroq.', en: 'Five is closer to zero than seven.' },
          { ru: 'Расстояния разные: 7 и 5.', uz: 'Masofalar har xil: 7 va 5.', en: 'The distances differ: 7 and 5.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про термометр. Утром было минус семь, днём стало плюс пять.',
        uz: "Termometr haqida masala. Ertalab minus yetti edi, kunduzi plyus besh bo'ldi.",
        en: 'A thermometer problem. Minus seven in the morning and plus five by noon.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 11,
        q: { ru: 'Найди расстояние между точками −6 и 5. Набери ответ.', uz: '−6 va 5 nuqtalari orasidagi masofani toping. Javobni tering.', en: 'Find the distance between −6 and 5. Type the answer.' },
        hint: { ru: '6 шагов до нуля и 5 после него.', uz: 'Nolgacha 6 qadam va undan keyin 5.', en: 'Six steps to zero and five after it.' },
        hint_audio: { ru: 'От минус шести до нуля шесть шагов, от нуля до пяти ещё пять. Сложите.', uz: "Minus oltidan nolgacha olti qadam, noldan beshgacha yana besh. Qo'shing.", en: 'From minus six to zero is six steps and from zero to five another five. Add them.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Чему равен модуль −15?', uz: '−15 ning moduli nechaga teng?', en: 'What is the absolute value of −15?' },
        opts: ['−15', '0', '15', '1,5'],
        wrong: [
          { ru: 'Модуль не бывает отрицательным.', uz: "Modul manfiy bo'lmaydi.", en: 'An absolute value is never negative.' },
          { ru: 'Ноль был бы только у самого нуля.', uz: "Nol faqat nolning o'zida bo'lardi.", en: 'Zero would happen only for zero.' },
          null,
          { ru: 'Запятая появилась ниоткуда.', uz: "Vergul qayerdandir paydo bo'ldi.", en: 'The decimal point appeared from nowhere.' },
        ],
        correct: { ru: 'Верно. Расстояние от −15 до нуля равно 15.', uz: "To'g'ri. −15 dan nolgacha masofa 15.", en: 'Right. The distance from −15 to zero is 15.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Модуль числа равен 4. Сколько таких чисел?', uz: 'Sonning moduli 4 ga teng. Bunday son nechta?', en: 'The absolute value is 4. How many such numbers?' },
        opts: ['Одно', 'Два', 'Ни одного', 'Бесконечно много'],
        wrong: [
          { ru: 'Точек на таком расстоянии от нуля две.', uz: 'Noldan shunday masofada ikkita nuqta bor.', en: 'There are two points at that distance from zero.' },
          null,
          { ru: 'Числа есть: это 4 и −4.', uz: 'Sonlar bor: bu 4 va −4.', en: 'They exist: 4 and −4.' },
          { ru: 'Бесконечно много было бы, если бы модуль не был задан.', uz: "Modul berilmagan bo'lsa cheksiz ko'p bo'lardi.", en: 'Infinitely many would need an unspecified absolute value.' },
        ],
        correct: { ru: 'Верно. Это 4 и −4.', uz: "To'g'ri. Bu 4 va −4.", en: 'Right. They are 4 and −4.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Может ли модуль быть меньше нуля?', uz: 'Modul noldan kichik bo\'la oladimi?', en: 'Can an absolute value be less than zero?' },
        opts: [
          { ru: 'Нет, это расстояние', uz: "Yo'q, bu masofa", en: 'No, it is a distance' },
          { ru: 'Да, у отрицательных чисел', uz: 'Ha, manfiy sonlarda', en: 'Yes, for negative numbers' },
          { ru: 'Да, если число дробное', uz: "Ha, son kasr bo'lsa", en: 'Yes, if the number is a fraction' },
          { ru: 'Только у нуля', uz: 'Faqat nolda', en: 'Only for zero' },
        ],
        wrong: [
          null,
          { ru: 'У отрицательных модуль как раз положительный.', uz: 'Manfiy sonlarda modul aynan musbat.', en: 'Negatives have positive absolute values.' },
          { ru: 'Дробность знака не меняет.', uz: "Kasrlik ishorani o'zgartirmaydi.", en: 'Being fractional does not change the sign.' },
          { ru: 'У нуля модуль равен нулю, а не меньше.', uz: 'Nolda modul nolga teng, kichik emas.', en: 'For zero it equals zero, not less.' },
        ],
        correct: { ru: 'Верно. Наименьшее значение модуля это ноль.', uz: "To'g'ri. Modulning eng kichik qiymati nol.", en: 'Right. The smallest possible value is zero.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Ночью было −12, днём −3. На сколько потеплело?', uz: 'Kechasi −12, kunduzi −3 edi. Necha darajaga isidi?', en: 'It was −12 at night and −3 by day. How much warmer?' },
        opts: ['15', '12', '3', '9'],
        wrong: [
          { ru: 'Так было бы, если бы точки стояли по разные стороны от нуля.', uz: "Nuqtalar nolning har xil tomonida bo'lsa shunday bo'lardi.", en: 'That would fit points on opposite sides of zero.' },
          { ru: 'Это ночная температура по модулю.', uz: "Bu kechasi haroratning moduli.", en: 'That is the night temperature in absolute value.' },
          { ru: 'Это дневная температура по модулю.', uz: 'Bu kunduzgi haroratning moduli.', en: 'That is the day temperature in absolute value.' },
          null,
        ],
        correct: { ru: 'Верно. Обе точки левее нуля, расстояние 12 − 3 = 9.', uz: "To'g'ri. Ikkala nuqta ham noldan chapda, masofa 12 − 3 = 9.", en: 'Right. Both points are left of zero and the distance is 12 − 3 = 9.' },
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
      ru: 'В физике модуль встречается каждый день: спидометр показывает модуль скорости, без направления. Машина едет вперёд или назад, а прибор в обоих случаях покажет 40, потому что важна только величина.',
      uz: "Fizikada modul har kuni uchraydi: spidometr tezlikning modulini, yo'nalishsiz ko'rsatadi. Mashina oldinga yoki orqaga yursin, asbob ikkala holda ham 40 ni ko'rsatadi, chunki faqat kattalik muhim.",
      en: 'In physics absolute value appears daily: a speedometer shows the magnitude of speed without direction. Driving forwards or backwards, the dial reads 40 either way because only the size matters.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? В физике модуль встречается каждый день. Спидометр показывает модуль скорости без направления: едет машина вперёд или назад, прибор покажет сорок, потому что важна только величина.',
      uz: "Bilasizmi? Fizikada modul har kuni uchraydi. Spidometr tezlikning modulini yo'nalishsiz ko'rsatadi: mashina oldinga yoki orqaga yursin, asbob qirqni ko'rsatadi, chunki faqat kattalik muhim.",
      en: 'Did you know? In physics absolute value appears daily. A speedometer shows the magnitude of speed without direction: forwards or backwards, the dial reads forty because only the size matters.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Отрицательные числа', uz: 'Matematika · Manfiy sonlar', en: 'Mathematics · Negative numbers' },
    heading: { ru: 'Модуль числа', uz: 'Sonning moduli', en: 'Absolute value' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'модуль — расстояние до нуля', uz: 'modul — nolgacha masofa', en: 'absolute value is the distance to zero' },
    brief_2: { ru: 'он никогда не отрицательный', uz: 'u hech qachon manfiy emas', en: 'it is never negative' },
    brief_3: { ru: 'уравнение с модулем даёт два решения', uz: 'modulli tenglama ikki yechim beradi', en: 'an equation with it gives two solutions' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Положительное число', uz: 'Musbat son', en: 'A positive number' },
    memo_a1: { ru: 'модуль равен самому числу', uz: "moduli sonning o'ziga teng", en: 'its absolute value is itself' },
    memo_q2: { ru: 'Отрицательное число', uz: 'Manfiy son', en: 'A negative number' },
    memo_a2: { ru: 'модуль равен противоположному', uz: 'moduli qarama-qarshisiga teng', en: 'its absolute value is its opposite' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'убрать минус, стоящий снаружи', uz: "tashqaridagi minusni yo'qotish", en: 'erasing the minus outside the bars' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Модуль числа это расстояние от его точки до нуля. Он никогда не бывает отрицательным, а уравнение с модулем обычно имеет два решения.',
        'Термометр: расстояние от минус семи до нуля семь, от пяти пять. Мороз был дальше от нуля.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Sonning moduli uning nuqtasidan nolgacha masofa. U hech qachon manfiy bo'lmaydi, modulli tenglama esa odatda ikkita yechimga ega.",
        "Termometr: minus yettidan nolgacha masofa yetti, beshdan esa besh. Sovuq noldan uzoqroq edi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The absolute value of a number is the distance from its point to zero. It is never negative, and an equation with it usually has two solutions.',
        'The thermometer: from minus seven to zero is seven, from five it is five. The frost was further from zero.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Считать шаги до нуля', uz: 'Usul. Nolgacha qadamlarni sanash', en: 'Method. Count steps to zero' },
    m1_steps: {
      ru: ['Поставь число на координатную прямую', 'Сосчитай единичные отрезки до нуля', 'Запиши результат без знака'],
      uz: ["Sonni koordinata chizig'iga qo'ying", 'Nolgacha birlik kesmalarni sanang', 'Natijani ishorasiz yozing'],
      en: ['Place the number on the line', 'Count the unit segments to zero', 'Write the result without a sign'],
    },
    m1_no: {
      ru: 'Если модуль известен, а число нет — таких чисел два: положительное и противоположное ему.',
      uz: "Modul ma'lum, son noma'lum bo'lsa — bunday son ikkita: musbati va qarama-qarshisi.",
      en: 'If the absolute value is known but the number is not, there are two: a positive one and its opposite.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: окно класса с термометром.
// ============================================================
const Thermo = ({ x, y, value, min = -20, max = 20, tone = '#D9603F' }) => {
  const h = 76;
  const frac = (value - min) / (max - min);
  const fill = Math.max(4, h * frac);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="14" height={h} rx="7" fill="#FFFDF7" stroke="#C9A472" strokeWidth="1.6"/>
      <rect x="4" y={h - fill} width="6" height={fill - 2} rx="3" fill={tone}/>
      <circle cx="7" cy={h + 6} r="8" fill={tone} stroke="#C9A472" strokeWidth="1.4"/>
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <path key={p} d={`M14 ${h * p} h5`} stroke="#C9A472" strokeWidth="1.2"/>
      ))}
      <path d={`M14 ${h * 0.5} h9`} stroke="#8E8578" strokeWidth="2"/>
    </g>
  );
};

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d25wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d25wall)"/>

    {/* Окно: за стеклом зима, снежинки падают */}
    <g>
      <rect x="96" y="12" width="200" height="102" rx="4" fill="#DCEDF5" stroke="#C9A472" strokeWidth="3"/>
      <path d="M196 12 v102 M96 63 h200" stroke="#C9A472" strokeWidth="2.4"/>
      <g opacity="0.85">
        <path d="M104 96 q40 -14 88 -4 q52 12 100 -6" fill="none" stroke="#FFFDF7" strokeWidth="7"/>
        <circle cx="150" cy="34" r="9" fill="#FBF3D6"/>
      </g>
      <g className="d25-snow">
        {[118, 146, 174, 214, 242, 270].map((sx, i) => (
          <circle key={sx} cx={sx} cy={24 + (i % 3) * 18} r="2.6" fill="#FFFDF7"/>
        ))}
      </g>
    </g>

    {/* Термометры: уличный слева на раме, комнатный справа */}
    <Thermo x={68} y={26} value={-7} tone="#019ACB"/>
    <Thermo x={316} y={26} value={5} tone="#D9603F"/>

    {/* Подоконник, цветок и дети */}
    <rect x="60" y="114" width="280" height="8" rx="2" fill="#C9A472"/>
    <g>
      <path d="M240 114 h20 v-10 h-20 Z" fill="#D98A5A"/>
      <path d="M250 104 q-10 -12 -2 -18 q8 8 2 18" fill="#8FBF7F"/>
      <path d="M250 104 q10 -10 3 -16 q-7 7 -3 16" fill="#8FBF7F" opacity="0.85"/>
    </g>
    <Person x={30} ground={140} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={370} ground={140} head={12} shirt="#F5C77E" hair="#5A4636"/>
    <rect x="0" y="140" width="400" height="14" fill="#D2A96F"/>
  </svg>
);

// Итог: прямая с −7 и 5 и подписанными расстояниями.
const FinalScene = () => {
  const x0 = 24; const step = 24; const y = 44;
  const marks = Array.from({ length: 15 }, (_, i) => i - 7);
  const px = (v) => x0 + (v + 7) * step;
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <path d={`M10 ${y} h380`} stroke="#8E8578" strokeWidth="2.2"/>
      {marks.map((m) => (
        <path key={m} d={`M${px(m)} ${y - 5} v10`} stroke="#8E8578" strokeWidth={m === 0 ? 3 : 1.2}/>
      ))}
      <circle cx={px(-7)} cy={y} r="6" fill="#019ACB"/>
      <circle cx={px(5)} cy={y} r="6" fill="#D9603F"/>
      <path d={`M${px(-7)} ${y - 14} h${px(0) - px(-7)}`} stroke="#019ACB" strokeWidth="2"/>
      <path d={`M${px(0)} ${y + 16} h${px(5) - px(0)}`} stroke="#D9603F" strokeWidth="2"/>
      <g fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="12">
        <text x={px(-3.5)} y={y - 20} textAnchor="middle" fill="#019ACB">7</text>
        <text x={px(2.5)} y={y + 32} textAnchor="middle" fill="#D9603F">5</text>
        <text x={px(-7)} y={y + 30} textAnchor="middle" fill="#8A8883">−7</text>
        <text x={px(5)} y={y - 16} textAnchor="middle" fill="#8A8883">5</text>
      </g>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прямая с подсветкой расстояния до нуля.
const NumLine = ({ from = -8, to = 8, points = [], spans = [], size = 'mid' }) => {
  const n = to - from;
  const step = 380 / n;
  const y = 34;
  const px = (v) => 10 + (v - from) * step;
  return (
    <span className={'d25-line-box d25-line-' + size}>
      <svg viewBox="0 0 400 62" aria-hidden="true">
        <path d={`M4 ${y} h392`} stroke="#8E8578" strokeWidth="2.2"/>
        {Array.from({ length: n + 1 }, (_, i) => {
          const v = from + i;
          const x = px(v);
          return (
            <g key={v}>
              <path d={`M${x} ${y - 5} v10`} stroke="#8E8578" strokeWidth={v === 0 ? 3 : 1.3}/>
              <text x={x} y={y + 20} textAnchor="middle" fill={v === 0 ? '#494550' : '#8A8883'}
                fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">{v}</text>
            </g>
          );
        })}
        {spans.map((s, i) => (
          <g key={i}>
            <path d={`M${px(s.from)} ${y - 13} H${px(s.to)}`} stroke={s.tone || '#C99B3A'} strokeWidth="2.4"/>
            {s.label && (
              <text x={(px(s.from) + px(s.to)) / 2} y={y - 18} textAnchor="middle" fill={s.tone || '#C99B3A'}
                fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{s.label}</text>
            )}
          </g>
        ))}
        {points.map((p) => (
          <circle key={p.v} cx={px(p.v)} cy={y} r="6" fill={p.tone || '#1F7A4D'}/>
        ))}
      </svg>
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d25-line d25-fade' + (on ? ' d25-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d25-stage">
        <NumLine from={-6} to={6}
          points={[{ v: c.pair[0], tone: '#019ACB' }, { v: c.pair[1], tone: '#D9603F' }]}
          spans={step >= 1 ? [
            { from: -4, to: 0, label: '4', tone: '#019ACB' },
            { from: 0, to: 4, label: '4', tone: '#D9603F' },
          ] : []}/>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: расстояния от −7 и 5 до нуля.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d25-stage">
        <NumLine from={-8} to={8}
          points={[{ v: -7, tone: '#019ACB' }, { v: 5, tone: '#D9603F' }]}
          spans={[
            ...(step >= 0 ? [{ from: -7, to: 0, label: '7', tone: '#019ACB' }] : []),
            ...(step >= 1 ? [{ from: 0, to: 5, label: '5', tone: '#D9603F' }] : []),
          ]}/>
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

const EqBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_eq;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d25-stage">
        <NumLine from={-6} to={6}
          points={step >= 1 ? [{ v: -3, tone: '#019ACB' }, { v: 3, tone: '#D9603F' }] : []}
          spans={step >= 1 ? [
            { from: -3, to: 0, label: '3', tone: '#019ACB' },
            { from: 0, to: 3, label: '3', tone: '#D9603F' },
          ] : []}/>
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
      <div className="frame fade-up delay-1 d25-stage">
        <NumLine from={-6} to={6}
          points={[{ v: -2, tone: '#019ACB' }, { v: 5, tone: '#D9603F' }]}
          spans={[
            ...(step >= 0 ? [{ from: -2, to: 0, label: '2', tone: '#019ACB' }] : []),
            ...(step >= 1 ? [{ from: 0, to: 5, label: '5', tone: '#D9603F' }] : []),
          ]}/>
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

// Граница: минус снаружи и модуль, равный отрицательному.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d25-stage">
        <span className="d25-pair d25-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d25-pair d25-pair-good d25-fade' + (step >= 1 ? ' d25-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d25-pair d25-pair-warn d25-fade' + (step >= 2 ? ' d25-on' : '')}>
          <Line node={t(c.none_line)} on/>
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
        <div className={'d25-banner fade-up delay-1' + (phase === 'play' ? ' d25-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d25-stage d25-stage-tool">
          {phase === 'demo' ? (
            <>
              <NumLine from={-5} to={5} size="sm"
                points={[{ v: 3, tone: '#D9603F' }, { v: -3, tone: '#019ACB' }]}
                spans={[
                  ...(shown >= 1 ? [{ from: 0, to: 3, label: '3', tone: '#D9603F' }] : []),
                  ...(done ? [{ from: -3, to: 0, label: '3', tone: '#019ACB' }] : []),
                ]}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d25-verdict' + (done ? ' d25-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d25-acts fade-up">
            <button className="d25-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d25-btn d25-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenEq = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_eq} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <EqBody step={step}/>}/>
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
      <div className="d25-stage">
        <NumLine from={-8} to={8}
          points={[{ v: -7, tone: '#019ACB' }, { v: 5, tone: '#D9603F' }]}
          spans={[
            { from: -7, to: 0, label: '7', tone: '#019ACB' },
            { from: 0, to: 5, label: '5', tone: '#D9603F' },
          ]}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenAbs = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_abs} asideNode={methodAside}/>
);
const ScreenDist = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_dist} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: две температуры на прямой.
const TaskFig = ({ idx }) => (
  <div className="d25-task-fig">
    <NumLine from={-8} to={8} size="sm"
      points={[{ v: -7, tone: '#019ACB' }, { v: 5, tone: '#D9603F' }]}
      spans={idx >= 1
        ? [{ from: -7, to: 0, label: '7', tone: '#019ACB' }, { from: 0, to: 5, label: '5', tone: '#D9603F' }]
        : [{ from: -7, to: 5, label: '?', tone: '#C99B3A' }]}/>
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
.d25-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d25-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d25-stage-tool .d25-line { font-size: clamp(12px, 2vw, 16px); }

/* Координатная прямая с подсветкой расстояний */
.d25-line-box { display: block; width: 100%; }
.d25-line-box svg { width: 100%; height: auto; display: block; }

.d25-fade { opacity: 0; transition: opacity 420ms linear; }
.d25-on { opacity: 1; }
.d25-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; }

/* Строки экрана границы */
.d25-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d25-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d25-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d25-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d25-task-fig { display: block; width: 100%; }

/* Экран 4 */
.d25-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d25-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d25-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d25-verdict-on { opacity: 1; }
.d25-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d25-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d25-btn:disabled { opacity: 0.45; cursor: default; }
.d25-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d25-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: снег за окном */
.d25-snow { animation: d25Snow 6000ms linear infinite; }
@keyframes d25Snow { from { transform: translateY(-10px); opacity: 0.4; } 50% { opacity: 1; } to { transform: translateY(46px); opacity: 0.3; } }
@media (prefers-reduced-motion: reduce) { .d25-snow { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function AbsoluteValueLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenEq, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenAbs, ScreenDist, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
