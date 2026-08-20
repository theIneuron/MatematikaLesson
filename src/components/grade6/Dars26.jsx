// ============================================================
// 6 КЛАСС, УРОК 26 «Сравнение рациональных чисел»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок закрывает блок Б6. Порядок задаёт координатная прямая: правее значит
// больше. Отсюда следует непривычное правило для отрицательных: чем больше
// модуль, тем меньше само число.
//
// Сцена — табло погоды по городам в школьном холле.
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
  lessonId: 'grade6-26',
  lessonTitle: {
    ru: 'Сравнение рациональных чисел',
    uz: 'Ratsional sonlarni taqqoslash',
    en: 'Comparing rational numbers',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 tablo: −3 va −8
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 chiziq va modul esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 o'ngroq — kattaroq
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: ikki manfiy sonni solishtirish
  { id: 's_mix',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 kasrlar va har xil ishoralar
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: tartiblash
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: modul katta — son kichik
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_cmp',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 solishtirish x3
  { id: 's_order',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 tartiblash x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: −3 dan katta yoki kichik
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: shaharlar harorati
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: { ru: 'Табло погоды', uz: 'Ob-havo tablosi', en: 'The weather board' },
    lead: {
      ru: 'В холле школы табло: в одном городе −3 градуса, в другом −8.',
      uz: "Maktab holida tablo bor: bir shaharda −3 daraja, boshqasida −8.",
      en: 'A board in the school hall: one city shows −3 degrees, another −8.',
    },
    voice_a: { ru: 'Азиз: теплее там, где −8, ведь 8 больше 3.', uz: "Aziz: −8 bo'lgan joyda issiqroq, axir 8 soni 3 dan katta.", en: 'Aziz: it is warmer at −8, since 8 is more than 3.' },
    voice_b: { ru: 'Дилноза: теплее там, где −3.', uz: 'Dilnoza: −3 bo\'lgan joyda issiqroq.', en: 'Dilnoza: it is warmer at −3.' },
    ask: { ru: 'В каком городе теплее?', uz: 'Qaysi shaharda issiqroq?', en: 'Which city is warmer?' },
    options: [
      { ru: 'Где −8', uz: '−8 bo\'lgan joyda', en: 'Where it is −8' },
      { ru: 'Где −3', uz: '−3 bo\'lgan joyda', en: 'Where it is −3' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В холле школы висит табло с погодой в разных городах. В одном городе минус три градуса, в другом минус восемь.',
          'Азиз говорит, что теплее там, где минус восемь, ведь восемь больше трёх. Дилноза считает наоборот. В каком городе теплее? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab holida turli shaharlar ob-havosi ko'rsatilgan tablo osilgan. Bir shaharda minus uch daraja, boshqasida minus sakkiz.",
          "Aziz minus sakkiz bo'lgan joyda issiqroq deydi, axir sakkiz uchdan katta. Dilnoza aksincha deb hisoblaydi. Qaysi shaharda issiqroq? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'A board in the school hall shows the weather in different cities. One reads minus three degrees, another minus eight.',
          'Aziz says it is warmer at minus eight because eight is more than three. Dilnoza thinks the opposite. Which city is warmer? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Прямая и расстояние', uz: 'Chiziq va masofa', en: 'The line and the distance' },
    done: {
      ru: 'Прямая ставит числа по местам, а модуль показывает расстояние до нуля. Сегодня свяжем то и другое.',
      uz: "Chiziq sonlarni joy-joyiga qo'yadi, modul esa nolgacha masofani ko'rsatadi. Bugun ikkalasini bog'laymiz.",
      en: 'The line puts numbers in order and the absolute value shows the distance to zero. Today we connect the two.',
    },
    audio: {
      ru: [
        'Вспомним два прошлых урока. На координатной прямой числа стоят по порядку, вправо от нуля положительные, влево отрицательные.',
        'Модуль числа это расстояние от его точки до нуля.',
        'Сегодня посмотрим, как эти две вещи вместе решают вопрос, какое число больше.',
      ],
      uz: [
        "Ikki o'tgan darsni eslaymiz. Koordinata chizig'ida sonlar tartib bilan turadi, noldan o'ngda musbat, chapda manfiy.",
        "Sonning moduli uning nuqtasidan nolgacha masofa.",
        "Bugun bu ikkisi birgalikda qaysi son katta degan savolni qanday hal qilishini ko'ramiz.",
      ],
      en: [
        'Recall the two previous lessons. On a number line the numbers stand in order, positive to the right of zero and negative to the left.',
        'The absolute value is the distance from a point to zero.',
        'Today we see how these two together answer which number is greater.',
      ],
    },
  },

  s_core: {
    title: { ru: 'Правее значит больше', uz: "O'ngroq — kattaroq", en: 'Further right means greater' },
    lines: [
      { ru: '−8 стоит левее, чем −3', uz: '−8 soni −3 dan chapda turadi', en: '−8 stands left of −3' },
      { ru: 'значит −8 меньше, чем −3', uz: 'demak −8 soni −3 dan kichik', en: 'so −8 is less than −3' },
      { ru: 'у −8 модуль больше, а само число меньше', uz: "−8 ning moduli katta, sonning o'zi esa kichik", en: '−8 has a larger absolute value but is the smaller number' },
    ],
    done: {
      ru: 'Из двух отрицательных больше то, у которого модуль меньше: оно ближе к нулю. Теплее там, где −3. Права была Дилноза.',
      uz: "Ikki manfiy sondan moduli kichigi kattaroq: u nolga yaqinroq. −3 bo'lgan joyda issiqroq. Dilnoza haq edi.",
      en: 'Of two negatives the greater one has the smaller absolute value: it sits closer to zero. It is warmer at −3. Dilnoza was right.',
    },
    audio: {
      ru: [
        'Поставим обе температуры на прямую. Минус восемь стоит левее минус трёх.',
        'На координатной прямой порядок один: чем правее число, тем оно больше. Значит минус восемь меньше минус трёх.',
        'Обратите внимание на странность: у минус восьми модуль восемь, он больше, а само число меньше. Из двух отрицательных больше то, что ближе к нулю. Теплее там, где минус три. Права была Дилноза.',
      ],
      uz: [
        "Ikkala haroratni chiziqqa qo'yamiz. Minus sakkiz minus uchdan chapda turadi.",
        "Koordinata chizig'ida tartib bitta: son qancha o'ngda bo'lsa, shuncha katta. Demak minus sakkiz minus uchdan kichik.",
        "G'alati holga diqqat qiling: minus sakkizning moduli sakkiz, u kattaroq, sonning o'zi esa kichikroq. Ikki manfiy sondan nolga yaqini kattaroq. Minus uch bo'lgan joyda issiqroq. Dilnoza haq edi.",
      ],
      en: [
        'Put both temperatures on the line. Minus eight stands to the left of minus three.',
        'On a number line the order is single: the further right, the greater. So minus eight is less than minus three.',
        'Notice the oddity: minus eight has absolute value eight, which is larger, yet the number itself is smaller. Of two negatives the one closer to zero is greater. It is warmer at minus three. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Сравниваем два отрицательных', uz: 'Ikki manfiy sonni solishtiramiz', en: 'Comparing two negatives' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'сравним −6 и −2', uz: '−6 va −2 ni solishtiramiz', en: 'compare −6 and −2' },
      { ru: 'модули 6 и 2, у −2 модуль меньше', uz: 'modullar 6 va 2, −2 ning moduli kichik', en: 'the absolute values are 6 and 2' },
      { ru: 'значит −2 больше: оно правее', uz: "demak −2 kattaroq: u o'ngroqda", en: 'so −2 is greater: it sits further right' },
    ],
    demo_note: {
      ru: 'Правило короткое: из двух отрицательных больше то, у которого модуль меньше.',
      uz: "Qoida qisqa: ikki manfiy sondan moduli kichigi kattaroq.",
      en: 'A short rule: of two negatives the one with the smaller absolute value is greater.',
    },
    play_ask: { ru: 'Что больше: −5 или −2?', uz: 'Qaysi biri katta: −5 yoki −2?', en: 'Which is greater: −5 or −2?' },
    play_opts: [
          '−5',
          '−2',
          { ru: 'равны', uz: 'teng', en: 'equal' },
        ],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. У −2 модуль меньше, значит оно ближе к нулю и правее.',
      uz: "To'g'ri. −2 ning moduli kichik, demak u nolga yaqin va o'ngroqda.",
      en: 'Right. −2 has the smaller absolute value, so it is closer to zero and further right.',
    },
    play_wrong: [
      { ru: 'Это ловушка: 5 больше 2, но −5 стоит левее.', uz: "Bu tuzoq: 5 soni 2 dan katta, lekin −5 chaproqda turadi.", en: 'That is the trap: 5 beats 2, but −5 sits further left.' },
      null,
      { ru: 'Числа разные: они стоят в разных точках прямой.', uz: "Sonlar har xil: ular chiziqning har xil nuqtasida turadi.", en: 'The numbers differ: they sit at different points.' },
    ],
    audio: {
      intro: {
        ru: 'Сравнивать два отрицательных числа удобно через модуль. Покажу на минус шести и минус двух.',
        uz: "Ikki manfiy sonni modul orqali solishtirish qulay. Minus olti va minus ikkida ko'rsataman.",
        en: 'Comparing two negatives is easy with absolute values. I will show it on minus six and minus two.',
      },
      demo: {
        ru: 'Модули шесть и два. У минус двух модуль меньше, значит оно ближе к нулю и стоит правее. Правее значит больше.',
        uz: "Modullar olti va ikki. Minus ikkining moduli kichik, demak u nolga yaqin va o'ngroqda turadi. O'ngroq degani kattaroq.",
        en: 'The absolute values are six and two. Minus two has the smaller one, so it is closer to zero and further right. Further right means greater.',
      },
      play: {
        ru: 'Теперь ваша очередь. Что больше: минус пять или минус два?',
        uz: 'Endi sizning navbatingiz. Qaysi biri katta: minus besh yoki minus ikki?',
        en: 'Now it is your turn. Which is greater: minus five or minus two?',
      },
      ok: {
        ru: 'Верно. Минус два ближе к нулю, значит оно больше.',
        uz: 'To\'g\'ri. Minus ikki nolga yaqinroq, demak u kattaroq.',
        en: 'Right. Minus two is closer to zero, so it is greater.',
      },
      wrong: {
        ru: 'Посмотрите, какое число стоит правее на прямой.',
        uz: "Chiziqda qaysi son o'ngroqda turganiga qarang.",
        en: 'Look at which number stands further right on the line.',
      },
    },
  },

  s_mix: {
    title: { ru: 'Разные знаки и дроби', uz: 'Har xil ishoralar va kasrlar', en: 'Different signs and fractions' },
    lines: [
      { ru: 'любое положительное больше любого отрицательного', uz: 'har qanday musbat son har qanday manfiydan katta', en: 'any positive number beats any negative one' },
      { ru: 'ноль больше любого отрицательного', uz: 'nol har qanday manfiy sondan katta', en: 'zero is greater than any negative' },
      { ru: '−0,5 больше, чем −0,7: оно ближе к нулю', uz: '−0,5 soni −0,7 dan katta: u nolga yaqinroq', en: '−0.5 is greater than −0.7: it is closer to zero' },
    ],
    done: {
      ru: 'Дроби и десятичные встают на ту же прямую между целыми. Порядок задаёт положение, а не вид записи.',
      uz: "Kasrlar va o'nli kasrlar ham butun sonlar orasida shu chiziqqa joylashadi. Tartibni yozuv ko'rinishi emas, joylashuv belgilaydi.",
      en: 'Fractions and decimals sit on the same line between the whole numbers. Position sets the order, not the way of writing.',
    },
    audio: {
      ru: [
        'Прямая решает все случаи сразу. Любое положительное число стоит правее любого отрицательного, значит оно больше.',
        'Ноль стоит правее всех отрицательных, поэтому он больше их всех, хотя сам ничего не весит.',
        'Дроби ложатся на ту же прямую между целыми. Минус ноль целых пять десятых стоит правее, чем минус ноль целых семь десятых, значит оно больше.',
      ],
      uz: [
        "Chiziq hamma holni birdan hal qiladi. Har qanday musbat son har qanday manfiy sondan o'ngda turadi, demak u kattaroq.",
        "Nol barcha manfiy sonlardan o'ngda turadi, shuning uchun u hammasidan katta.",
        "Kasrlar ham butun sonlar orasida shu chiziqqa tushadi. Minus nol butun besh o'ndan minus nol butun yetti o'ndandan o'ngda, demak u kattaroq.",
      ],
      en: [
        'The line settles every case at once. Any positive number stands right of any negative one, so it is greater.',
        'Zero stands right of all negatives, so it beats them all.',
        'Fractions land on the same line between the whole numbers. Minus zero point five is right of minus zero point seven, so it is greater.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Расставим по порядку', uz: 'Tartib bilan joylashtiramiz', en: 'Put them in order' },
    lead: { ru: 'Числа: −5; 0,5; −0,5; 3; −2.', uz: 'Sonlar: −5; 0,5; −0,5; 3; −2.', en: 'The numbers: −5; 0.5; −0.5; 3; −2.' },
    steps: [
      { ru: 'сначала отрицательные: −5, −2, −0,5', uz: 'avval manfiylar: −5, −2, −0,5', en: 'negatives first: −5, −2, −0.5' },
      { ru: 'потом положительные: 0,5 и 3', uz: 'keyin musbatlar: 0,5 va 3', en: 'then positives: 0.5 and 3' },
      { ru: 'порядок: −5 < −2 < −0,5 < 0,5 < 3', uz: 'tartib: −5 < −2 < −0,5 < 0,5 < 3', en: 'the order: −5 < −2 < −0.5 < 0.5 < 3' },
    ],
    done: {
      ru: 'Удобный приём: сначала расставить всё на прямой, а потом просто прочитать слева направо.',
      uz: "Qulay usul: avval hammasini chiziqqa joylashtirib, keyin chapdan o'ngga o'qish.",
      en: 'A handy trick: place everything on the line first, then read it left to right.',
    },
    audio: {
      ru: [
        'Решаем вместе. Расставим пять чисел по возрастанию. Сначала отделим отрицательные от положительных.',
        'Отрицательные это минус пять, минус два и минус ноль целых пять десятых. Ближе всех к нулю последнее, дальше всех минус пять.',
        'Дальше идут ноль целых пять десятых и три. Получается порядок: минус пять, минус два, минус ноль целых пять десятых, ноль целых пять десятых, три. Это просто чтение прямой слева направо.',
      ],
      uz: [
        "Birga yechamiz. Beshta sonni o'sish tartibida joylashtiramiz. Avval manfiylarni musbatlardan ajratamiz.",
        "Manfiylar: minus besh, minus ikki va minus nol butun besh o'ndan. Nolga eng yaqini oxirgisi, eng uzog'i minus besh.",
        "Keyin nol butun besh o'ndan va uch keladi. Tartib chiqadi: minus besh, minus ikki, minus nol butun besh o'ndan, nol butun besh o'ndan, uch. Bu chiziqni chapdan o'ngga o'qishning o'zi.",
      ],
      en: [
        'Let us solve it together. Put five numbers in increasing order. First split negatives from positives.',
        'The negatives are minus five, minus two and minus zero point five. The last is closest to zero, minus five is furthest.',
        'Then come zero point five and three. The order is minus five, minus two, minus zero point five, zero point five, three. That is simply reading the line left to right.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Модуль больше — число меньше', uz: 'Modul katta — son kichik', en: 'Bigger absolute value, smaller number' },
    bad_line: { ru: 'ошибка: −10 больше −2, ведь 10 больше 2', uz: 'xato: −10 soni −2 dan katta, axir 10 soni 2 dan katta', en: 'mistake: −10 beats −2 because 10 beats 2' },
    good_line: { ru: 'верно: −10 левее, значит −10 меньше', uz: "to'g'ri: −10 chaproqda, demak −10 kichik", en: 'right: −10 sits further left, so it is smaller' },
    frac_line: { ru: 'дроби сравнивают по общему знаменателю, а потом смотрят на знак', uz: 'kasrlar umumiy maxrajda solishtiriladi, keyin ishoraga qaraladi', en: 'fractions get a common denominator first, then the sign is checked' },
    done: {
      ru: 'Для положительных больший модуль означает большее число, а для отрицательных наоборот. Проверяйте порядок по прямой, а не по величине без знака.',
      uz: "Musbat sonlarda katta modul katta sonni bildiradi, manfiylarda esa aksincha. Tartibni ishorasiz kattalik bo'yicha emas, chiziq bo'yicha tekshiring.",
      en: 'For positives a bigger absolute value means a bigger number; for negatives it is the opposite. Check the order on the line, not by size without the sign.',
    },
    audio: {
      ru: [
        'Главная ошибка темы. Ученик смотрит на числа без знаков и решает, что минус десять больше минус двух.',
        'Но на прямой минус десять стоит гораздо левее, значит оно меньше. Чем больше модуль у отрицательного числа, тем оно меньше.',
        'И отдельно про дроби. Чтобы сравнить минус две третьих и минус три четвёртых, сначала приводят к общему знаменателю, как в девятом уроке, а уже потом смотрят на знак и на положение.',
      ],
      uz: [
        "Mavzudagi asosiy xato. O'quvchi sonlarga ishorasiz qarab, minus o'n minus ikkidan katta deb hisoblaydi.",
        "Lekin chiziqda minus o'n ancha chaproqda turadi, demak u kichik. Manfiy sonning moduli qancha katta bo'lsa, sonning o'zi shuncha kichik.",
        "Kasrlar haqida alohida. Minus ikki uchdan va minus uch to'rtdanni solishtirish uchun avval to'qqizinchi darsdagidek umumiy maxrajga keltiriladi, keyin ishora va joylashuvga qaraladi.",
      ],
      en: [
        'The main mistake of this topic. A student looks at the numbers without signs and decides that minus ten beats minus two.',
        'But on the line minus ten sits much further left, so it is smaller. The bigger the absolute value of a negative, the smaller the number.',
        'And a word on fractions. To compare minus two thirds and minus three quarters, first bring them to a common denominator as in lesson nine, and only then look at the sign and the position.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'Как сравнивать', uz: 'Qanday solishtiriladi', en: 'How to compare' },
    rule_1: {
      ru: 'На координатной прямой из двух чисел больше то, которое стоит правее. Любое положительное больше нуля и любого отрицательного.',
      uz: "Koordinata chizig'ida ikki sondan o'ngroqda turgani kattaroq. Har qanday musbat son noldan va har qanday manfiy sondan katta.",
      en: 'On a number line the number standing further right is greater. Any positive number beats zero and every negative one.',
    },
    rule_2: {
      ru: 'Из двух отрицательных больше то, у которого меньше модуль. Табло: −3 правее, чем −8, значит там теплее. Права была Дилноза.',
      uz: "Ikki manfiy sondan moduli kichigi kattaroq. Tablo: −3 soni −8 dan o'ngroqda, demak u yerda issiqroq. Dilnoza haq edi.",
      en: 'Of two negatives the one with the smaller absolute value is greater. The board: −3 sits right of −8, so it is warmer there. Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. На координатной прямой больше то число, которое стоит правее. Любое положительное больше нуля и больше любого отрицательного, а из двух отрицательных больше то, у которого модуль меньше. Вернёмся к табло. Минус три стоит правее минус восьми, значит там теплее. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Koordinata chizig'ida o'ngroqda turgan son kattaroq. Har qanday musbat son noldan va har qanday manfiy sondan katta, ikki manfiy sondan esa moduli kichigi kattaroq. Tabloga qaytamiz. Minus uch minus sakkizdan o'ngroqda turadi, demak u yerda issiqroq. Dilnoza haq edi.",
      en: 'Let us remember the rule. On a number line the number further right is greater. Any positive beats zero and every negative, and of two negatives the one with the smaller absolute value wins. Back to the board. Minus three sits right of minus eight, so it is warmer there. Dilnoza was right.',
    },
  },

  s_cmp: {
    title: { ru: 'Что больше', uz: 'Qaysi biri katta', en: 'Which is greater' },
    lead: { ru: 'Смотри на прямую: правее значит больше.', uz: "Chiziqqa qarang: o'ngroq degani kattaroq.", en: 'Look at the line: further right means greater.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '−4 или −9?', uz: '−4 yoki −9?', en: '−4 or −9?' },
        opts: [
          '−4',
          '−9',
          { ru: 'равны', uz: 'teng', en: 'equal' },
        ],
        correct: 0,
        ok: { ru: 'Верно. У −4 модуль меньше, оно ближе к нулю.', uz: "To'g'ri. −4 ning moduli kichik, u nolga yaqinroq.", en: 'Right. −4 has the smaller absolute value and sits closer to zero.' },
        wrong: [
          null,
          { ru: 'Девять больше четырёх, но с минусом всё наоборот.', uz: "To'qqiz to'rtdan katta, lekin minus bilan aksincha.", en: 'Nine beats four, but with a minus it is the other way round.' },
          { ru: 'Точки стоят в разных местах прямой.', uz: 'Nuqtalar chiziqning har xil joyida turadi.', en: 'The points sit at different places on the line.' },
        ],
      },
      {
        q: { ru: '0 или −1?', uz: '0 yoki −1?', en: '0 or −1?' },
        opts: [
          '0',
          '−1',
          { ru: 'равны', uz: 'teng', en: 'equal' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Ноль правее любого отрицательного числа.', uz: "To'g'ri. Nol har qanday manfiy sondan o'ngda.", en: 'Right. Zero stands right of any negative number.' },
        wrong: [
          null,
          { ru: 'Минус один левее нуля.', uz: 'Minus bir noldan chapda.', en: 'Minus one is left of zero.' },
          { ru: 'Это разные точки прямой.', uz: 'Bu chiziqning har xil nuqtalari.', en: 'These are different points.' },
        ],
      },
      {
        q: { ru: '−0,3 или −0,8?', uz: '−0,3 yoki −0,8?', en: '−0.3 or −0.8?' },
        opts: [
          '−0,3',
          '−0,8',
          { ru: 'равны', uz: 'teng', en: 'equal' },
        ],
        correct: 0,
        ok: { ru: 'Верно. −0,3 ближе к нулю, значит больше.', uz: "To'g'ri. −0,3 nolga yaqinroq, demak kattaroq.", en: 'Right. −0.3 is closer to zero, so it is greater.' },
        wrong: [
          null,
          { ru: 'Восемь десятых дальше от нуля, чем три десятых.', uz: "Sakkiz o'ndan noldan uch o'ndandan uzoqroq.", en: 'Eight tenths is further from zero than three tenths.' },
          { ru: 'Дроби тоже стоят на прямой в разных точках.', uz: 'Kasrlar ham chiziqda har xil nuqtada turadi.', en: 'Fractions also sit at different points.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на сравнение. Представляйте прямую и смотрите, кто правее.',
        uz: "Solishtirish mashqi. Chiziqni tasavvur qiling va kim o'ngroqda ekaniga qarang.",
        en: 'Comparison practice. Picture the line and see which one is further right.',
      },
    },
  },

  s_order: {
    title: { ru: 'По возрастанию', uz: "O'sish tartibida", en: 'In increasing order' },
    lead: { ru: 'Сначала самые левые, потом всё правее.', uz: "Avval eng chapdagilar, keyin o'ngroqlari.", en: 'Leftmost first, then further right.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какое число наименьшее: −2, −7, 0, 3?', uz: 'Eng kichik son qaysi: −2, −7, 0, 3?', en: 'Which is smallest: −2, −7, 0, 3?' },
        opts: ['−7', '−2', '0'],
        correct: 0,
        ok: { ru: 'Верно. −7 стоит левее всех.', uz: "To'g'ri. −7 hammasidan chapda turadi.", en: 'Right. −7 stands furthest left.' },
        wrong: [
          null,
          { ru: '−2 стоит правее, чем −7.', uz: "−2 soni −7 dan o'ngroqda turadi.", en: '−2 sits right of −7.' },
          { ru: 'Ноль больше обоих отрицательных.', uz: 'Nol ikkala manfiy sondan katta.', en: 'Zero beats both negatives.' },
        ],
      },
      {
        q: { ru: 'Какое число наибольшее: −1, −0,5, −3?', uz: 'Eng katta son qaysi: −1, −0,5, −3?', en: 'Which is greatest: −1, −0.5, −3?' },
        opts: ['−0,5', '−1', '−3'],
        correct: 0,
        ok: { ru: 'Верно. У −0,5 модуль наименьший, оно ближе всех к нулю.', uz: "To'g'ri. −0,5 ning moduli eng kichik, u nolga eng yaqin.", en: 'Right. −0.5 has the smallest absolute value and is closest to zero.' },
        wrong: [
          null,
          { ru: '−1 дальше от нуля, чем −0,5.', uz: "−1 noldan −0,5 dan uzoqroq.", en: '−1 is further from zero than −0.5.' },
          { ru: '−3 дальше всех от нуля, значит оно наименьшее.', uz: "−3 noldan eng uzoq, demak u eng kichigi.", en: '−3 is furthest from zero, so it is the smallest.' },
        ],
      },
      {
        q: { ru: 'Где верный порядок по возрастанию?', uz: "O'sish tartibi qayerda to'g'ri?", en: 'Which is the correct increasing order?' },
        opts: ['−4, −1, 0, 2', '−1, −4, 0, 2', '0, −1, −4, 2'],
        correct: 0,
        ok: { ru: 'Верно. Это чтение прямой слева направо.', uz: "To'g'ri. Bu chiziqni chapdan o'ngga o'qish.", en: 'Right. That is reading the line left to right.' },
        wrong: [
          null,
          { ru: '−4 стоит левее −1, значит идёт первым.', uz: "−4 soni −1 dan chapda, demak birinchi keladi.", en: '−4 sits left of −1 and comes first.' },
          { ru: 'Ноль правее обоих отрицательных, он не может быть первым.', uz: "Nol ikkala manfiydan o'ngda, u birinchi bo'lolmaydi.", en: 'Zero is right of both negatives and cannot be first.' },
        ],
      },
      {
        q: { ru: 'Что верно для любых отрицательных чисел?', uz: 'Har qanday manfiy sonlar uchun nima to\'g\'ri?', en: 'What is true for any negative numbers?' },
        opts: [
          { ru: 'Больше то, у которого модуль меньше', uz: 'Moduli kichigi kattaroq', en: 'The one with the smaller absolute value is greater' },
          { ru: 'Больше то, у которого модуль больше', uz: 'Moduli kattasi kattaroq', en: 'The one with the bigger absolute value is greater' },
          { ru: 'Они всегда равны', uz: 'Ular doim teng', en: 'They are always equal' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Меньший модуль значит ближе к нулю и правее.', uz: "To'g'ri. Kichik modul nolga yaqinroq va o'ngroq degani.", en: 'Right. A smaller absolute value means closer to zero and further right.' },
        wrong: [
          null,
          { ru: 'Это правило работает только для положительных.', uz: 'Bu qoida faqat musbat sonlarda ishlaydi.', en: 'That rule works only for positives.' },
          { ru: 'Равны только одинаковые числа.', uz: 'Faqat bir xil sonlar teng.', en: 'Only identical numbers are equal.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на порядок. Сначала расставьте числа на прямой, потом читайте слева направо.',
        uz: "Tartib mashqi. Avval sonlarni chiziqqa joylashtiring, keyin chapdan o'ngga o'qing.",
        en: 'Practice on order. Place the numbers on the line first, then read left to right.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Больше или меньше −3', uz: '−3 dan katta yoki kichik', en: 'Greater or less than −3' },
    lead: { ru: 'Правее −3 значит больше, левее — меньше.', uz: "−3 dan o'ngda — katta, chapda — kichik.", en: 'Right of −3 is greater, left of it is smaller.' },
    bin_a: { ru: 'Больше −3', uz: '−3 dan katta', en: 'Greater than −3' },
    bin_b: { ru: 'Меньше −3', uz: '−3 dan kichik', en: 'Less than −3' },
    cards: [
      { label: '−1', bin: 'a' },
      { label: '0', bin: 'a' },
      { label: '2', bin: 'a' },
      { label: '−5', bin: 'b' },
      { label: '−10', bin: 'b' },
      { label: '−3,5', bin: 'b' },
    ],
    hint: {
      ru: 'Представь прямую: −3 посередине, слева меньше, справа больше.',
      uz: "Chiziqni tasavvur qiling: −3 o'rtada, chapda kichik, o'ngda katta.",
      en: 'Picture the line: −3 in the middle, smaller on the left, greater on the right.',
    },
    correct_text: {
      ru: 'Верно. Отрицательные с большим модулем ушли левее −3, а всё остальное правее.',
      uz: "To'g'ri. Moduli katta manfiylar −3 dan chapga ketdi, qolgani esa o'ngda.",
      en: 'Right. Negatives with bigger absolute values went left of −3, everything else stayed right.',
    },
    audio: {
      intro: {
        ru: 'Разложите числа по двум корзинам. Сравнивайте с минус тремя.',
        uz: 'Sonlarni ikki savatga ajrating. Minus uch bilan solishtiring.',
        en: 'Sort the numbers into two baskets. Compare each with minus three.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посмотри, с какой стороны от −3 стоит число.', uz: "Bu yerga emas. Son −3 ning qaysi tomonida turganiga qarang.", en: 'Not here. Check which side of −3 the number is on.' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «−12 больше −5, ведь 12 больше 5». Проверь.', uz: "Aziz: «−12 soni −5 dan katta, axir 12 soni 5 dan katta». Tekshiring.", en: 'Aziz: “−12 beats −5 because 12 beats 5.” Check it.' },
        opts: [
          { ru: 'Нет: −12 левее, значит меньше', uz: "Yo'q: −12 chaproqda, demak kichik", en: 'No: −12 sits further left, so it is smaller' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Они равны', uz: 'Ular teng', en: 'They are equal' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Для отрицательных больший модуль означает меньшее число.', uz: "To'g'ri. Manfiy sonlarda katta modul kichik sonni bildiradi.", en: 'Right. For negatives a bigger absolute value means a smaller number.' },
        wrong: [
          null,
          { ru: 'Он сравнил модули, а не сами числа.', uz: "U modullarni solishtirdi, sonlarning o'zini emas.", en: 'He compared absolute values, not the numbers.' },
          { ru: 'Числа разные и стоят в разных точках.', uz: 'Sonlar har xil va har xil nuqtada turadi.', en: 'The numbers differ and sit at different points.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «−0,2 меньше −0,9, ведь 2 меньше 9». Проверь.', uz: "Dilnoza: «−0,2 soni −0,9 dan kichik, axir 2 soni 9 dan kichik». Tekshiring.", en: 'Dilnoza: “−0.2 is less than −0.9 because 2 is less than 9.” Check it.' },
        opts: [
          { ru: 'Нет: −0,2 ближе к нулю, значит больше', uz: "Yo'q: −0,2 nolga yaqinroq, demak kattaroq", en: 'No: −0.2 is closer to zero, so it is greater' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, они равны', uz: "Yo'q, ular teng", en: 'No, they are equal' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Здесь та же ловушка: сравнили модули вместо чисел.', uz: "To'g'ri. Bu yerda ham o'sha tuzoq: sonlar o'rniga modullar solishtirilgan.", en: 'Right. The same trap: absolute values compared instead of numbers.' },
        wrong: [
          null,
          { ru: 'На прямой минус ноль целых две десятых стоит правее.', uz: "Chiziqda minus nol butun ikki o'ndan o'ngroqda turadi.", en: 'On the line minus zero point two sits further right.' },
          { ru: 'Разные точки не могут быть равными числами.', uz: "Har xil nuqtalar teng son bo'lolmaydi.", en: 'Different points cannot be equal numbers.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка почти всегда в сравнении модулей вместо чисел.',
        uz: "Birovning yechimini tekshiring. Xato deyarli doim sonlar o'rniga modullarni solishtirishda.",
        en: 'Check someone else’s work. The mistake is almost always comparing absolute values instead of numbers.',
      },
    },
  },

  s_task: {
    title: { ru: 'Табло четырёх городов', uz: "To'rt shahar tablosi", en: 'The four city board' },
    lead: { ru: 'На табло: −3, −8, 0 и 4 градуса.', uz: 'Tabloda: −3, −8, 0 va 4 daraja.', en: 'The board shows −3, −8, 0 and 4 degrees.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Где холоднее всего?', uz: 'Eng sovuq qayerda?', en: 'Where is it coldest?' },
        opts: ['−8', '−3', '0'],
        correct: 0,
        ok: { ru: 'Верно. −8 стоит левее всех на прямой.', uz: "To'g'ri. −8 chiziqda hammasidan chapda turadi.", en: 'Right. −8 stands furthest left on the line.' },
        wrong: [
          null,
          { ru: '−3 правее, значит там теплее.', uz: "−3 o'ngroqda, demak u yerda issiqroq.", en: '−3 is further right, so it is warmer there.' },
          { ru: 'Ноль теплее обоих отрицательных.', uz: 'Nol ikkala manfiydan issiqroq.', en: 'Zero is warmer than both negatives.' },
        ],
      },
      {
        q: { ru: 'Расставь города по возрастанию температуры', uz: "Shaharlarni harorat o'sishi bo'yicha joylashtiring", en: 'Order the cities by increasing temperature' },
        opts: ['−8, −3, 0, 4', '−3, −8, 0, 4', '0, −3, −8, 4'],
        correct: 0,
        ok: { ru: 'Верно. Это порядок точек на прямой слева направо.', uz: "To'g'ri. Bu chiziqdagi nuqtalar tartibi, chapdan o'ngga.", en: 'Right. That is the order of the points from left to right.' },
        wrong: [
          null,
          { ru: '−8 холоднее −3, значит идёт первым.', uz: "−8 soni −3 dan sovuqroq, demak birinchi keladi.", en: '−8 is colder than −3 and comes first.' },
          { ru: 'Ноль теплее обоих отрицательных, он не первый.', uz: "Nol ikkala manfiydan issiqroq, u birinchi emas.", en: 'Zero is warmer than both negatives and is not first.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про табло. Четыре города: минус три, минус восемь, ноль и четыре градуса.',
        uz: "Tablo haqida masala. To'rt shahar: minus uch, minus sakkiz, nol va to'rt daraja.",
        en: 'A board problem. Four cities: minus three, minus eight, zero and four degrees.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 6,
        q: { ru: 'Сколько целых чисел стоит между −4 и 3? Набери ответ.', uz: '−4 va 3 orasida nechta butun son bor? Javobni tering.', en: 'How many whole numbers lie between −4 and 3? Type the answer.' },
        hint: { ru: 'Это −3, −2, −1, 0, 1, 2. Сами −4 и 3 не считаем.', uz: "Bular −3, −2, −1, 0, 1, 2. −4 va 3 ning o'zi sanalmaydi.", en: 'They are −3, −2, −1, 0, 1, 2. The ends themselves do not count.' },
        hint_audio: { ru: 'Между минус четырьмя и тремя стоят минус три, минус два, минус один, ноль, один и два. Сами края не считаем.', uz: "Minus to'rt va uch orasida minus uch, minus ikki, minus bir, nol, bir va ikki turadi. Chetlarning o'zi sanalmaydi.", en: 'Between minus four and three stand minus three, minus two, minus one, zero, one and two. The ends do not count.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Что больше: −15 или −20?', uz: 'Qaysi biri katta: −15 yoki −20?', en: 'Which is greater: −15 or −20?' },
        opts_i18n: [
          { ru: '−20', uz: '−20', en: '−20' },
          { ru: '−15', uz: '−15', en: '−15' },
          { ru: 'равны', uz: 'teng', en: 'equal' },
          { ru: 'нельзя сравнить', uz: "solishtirib bo'lmaydi", en: 'cannot compare' },
        ],
        wrong: [
          { ru: 'У −20 модуль больше, значит само число меньше.', uz: "−20 ning moduli katta, demak sonning o'zi kichik.", en: '−20 has a bigger absolute value, so the number is smaller.' },
          null,
          { ru: 'Числа стоят в разных точках прямой.', uz: 'Sonlar chiziqning har xil nuqtasida turadi.', en: 'The numbers sit at different points.' },
          { ru: 'Сравнить можно любые два числа.', uz: 'Har qanday ikki sonni solishtirsa bo\'ladi.', en: 'Any two numbers can be compared.' },
        ],
        correct: { ru: 'Верно. −15 ближе к нулю, значит правее и больше.', uz: "To'g'ri. −15 nolga yaqinroq, demak o'ngroqda va kattaroq.", en: 'Right. −15 is closer to zero, further right and greater.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Какое число наименьшее?', uz: 'Eng kichik son qaysi?', en: 'Which number is the smallest?' },
        opts: ['0', '−2', '−6,5', '−7'],
        wrong: [
          { ru: 'Ноль больше всех отрицательных.', uz: 'Nol barcha manfiylardan katta.', en: 'Zero beats every negative.' },
          { ru: '−2 ближе к нулю, чем остальные отрицательные.', uz: "−2 boshqa manfiylarga qaraganda nolga yaqinroq.", en: '−2 is closer to zero than the other negatives.' },
          { ru: 'Почти: −7 стоит ещё левее.', uz: "Deyarli: −7 undan ham chaproqda turadi.", en: 'Almost: −7 sits even further left.' },
          null,
        ],
        correct: { ru: 'Верно. У −7 самый большой модуль среди отрицательных.', uz: "To'g'ri. Manfiylar orasida −7 ning moduli eng katta.", en: 'Right. Among the negatives −7 has the largest absolute value.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Что верно всегда?', uz: 'Nima har doim to\'g\'ri?', en: 'What is always true?' },
        opts: [
          { ru: 'Любое положительное больше любого отрицательного', uz: 'Har qanday musbat son har qanday manfiydan katta', en: 'Any positive beats any negative' },
          { ru: 'Любое отрицательное больше нуля', uz: 'Har qanday manfiy son noldan katta', en: 'Any negative beats zero' },
          { ru: 'Число с большим модулем всегда больше', uz: 'Moduli katta son doim kattaroq', en: 'A bigger absolute value always means a bigger number' },
          { ru: 'Дроби сравнивать нельзя', uz: "Kasrlarni solishtirib bo'lmaydi", en: 'Fractions cannot be compared' },
        ],
        wrong: [
          null,
          { ru: 'Отрицательные стоят левее нуля, значит меньше его.', uz: 'Manfiylar noldan chapda, demak undan kichik.', en: 'Negatives sit left of zero, so they are smaller.' },
          { ru: 'Для отрицательных это правило переворачивается.', uz: "Manfiy sonlarda bu qoida teskari bo'ladi.", en: 'For negatives that rule flips.' },
          { ru: 'Дроби тоже стоят на прямой и сравниваются.', uz: 'Kasrlar ham chiziqda turadi va solishtiriladi.', en: 'Fractions sit on the line and are compared too.' },
        ],
        correct: { ru: 'Верно. Положительные стоят правее нуля, отрицательные левее.', uz: "To'g'ri. Musbatlar noldan o'ngda, manfiylar chapda turadi.", en: 'Right. Positives sit right of zero, negatives to the left.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Ночью −9, к утру потеплело до −4. Что верно?', uz: 'Kechasi −9, ertalabga −4 gacha isidi. Nima to\'g\'ri?', en: 'It was −9 at night and warmed to −4. What is true?' },
        opts: [
          { ru: '−9 больше, чем −4', uz: "−9 soni −4 dan katta", en: '−9 is greater than −4' },
          { ru: 'Температура понизилась', uz: 'Harorat pasaydi', en: 'The temperature dropped' },
          { ru: '−4 больше, чем −9', uz: "−4 soni −9 dan katta", en: '−4 is greater than −9' },
          { ru: 'Ничего не изменилось', uz: "Hech nima o'zgarmadi", en: 'Nothing changed' },
        ],
        wrong: [
          { ru: 'У −9 модуль больше, значит само число меньше.', uz: "−9 ning moduli katta, demak sonning o'zi kichik.", en: '−9 has a bigger absolute value, so it is the smaller number.' },
          { ru: 'Потеплело — значит температура выросла.', uz: 'Isidi — demak harorat oshdi.', en: 'It warmed, so the temperature rose.' },
          null,
          { ru: 'Изменение есть: точка сдвинулась вправо.', uz: "O'zgarish bor: nuqta o'ngga siljidi.", en: 'There was a change: the point moved right.' },
        ],
        correct: { ru: 'Верно. Потеплело значит число выросло: −4 правее −9.', uz: "To'g'ri. Isidi degani son oshdi: −4 soni −9 dan o'ngda.", en: 'Right. Warming means the number grew: −4 is right of −9.' },
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
      ru: 'Самая низкая температура на Земле измерена в Антарктиде: около −89 градусов. Самая высокая в Долине Смерти: около +57. По модулю мороз оказался сильнее жары, хотя на термометре они по разные стороны от нуля.',
      uz: "Yerdagi eng past harorat Antarktidada o'lchangan: taxminan −89 daraja. Eng yuqorisi O'lim vodiysida: taxminan +57. Modul bo'yicha sovuq issiqdan kuchliroq chiqdi, garchi termometrda ular nolning har xil tomonida bo'lsa ham.",
      en: 'The lowest temperature on Earth was measured in Antarctica: about −89 degrees. The highest in Death Valley: about +57. By absolute value the frost beats the heat, even though on the thermometer they sit on opposite sides of zero.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Самая низкая температура на Земле измерена в Антарктиде, около минус восьмидесяти девяти градусов. Самая высокая в Долине Смерти, около плюс пятидесяти семи. По модулю мороз оказался сильнее жары.',
      uz: "Bilasizmi? Yerdagi eng past harorat Antarktidada o'lchangan, taxminan minus sakson to'qqiz daraja. Eng yuqorisi O'lim vodiysida, taxminan plyus ellik yetti. Modul bo'yicha sovuq issiqdan kuchliroq chiqdi.",
      en: 'Did you know? The lowest temperature on Earth was measured in Antarctica, about minus eighty nine degrees. The highest in Death Valley, about plus fifty seven. By absolute value the frost beats the heat.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Отрицательные числа', uz: 'Matematika · Manfiy sonlar', en: 'Mathematics · Negative numbers' },
    heading: { ru: 'Сравнение чисел', uz: 'Sonlarni taqqoslash', en: 'Comparing numbers' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'правее на прямой значит больше', uz: "chiziqda o'ngroq — kattaroq", en: 'further right means greater' },
    brief_2: { ru: 'положительное больше нуля и отрицательных', uz: 'musbat son noldan va manfiylardan katta', en: 'a positive beats zero and negatives' },
    brief_3: { ru: 'из отрицательных больше то, где модуль меньше', uz: 'manfiylardan moduli kichigi kattaroq', en: 'among negatives the smaller absolute value wins' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Порядок', uz: 'Tartib', en: 'Order' },
    memo_a1: { ru: 'задаёт координатная прямая', uz: "koordinata chizig'i belgilaydi", en: 'set by the number line' },
    memo_q2: { ru: 'Отрицательные', uz: 'Manfiylar', en: 'Negatives' },
    memo_a2: { ru: 'ближе к нулю — больше', uz: 'nolga yaqinroq — kattaroq', en: 'closer to zero means greater' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'сравнивать модули вместо чисел', uz: "sonlar o'rniga modullarni solishtirish", en: 'comparing absolute values instead of numbers' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Порядок задаёт координатная прямая: правее значит больше. Любое положительное больше нуля и любого отрицательного, а из двух отрицательных больше то, у которого модуль меньше.',
        'Табло: минус три правее минус восьми, значит там теплее.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Tartibni koordinata chizig'i belgilaydi: o'ngroq degani kattaroq. Har qanday musbat son noldan va har qanday manfiydan katta, ikki manfiydan esa moduli kichigi kattaroq.",
        "Tablo: minus uch minus sakkizdan o'ngroqda, demak u yerda issiqroq.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The number line sets the order: further right means greater. Any positive beats zero and every negative, and of two negatives the smaller absolute value wins.',
        'The board: minus three is right of minus eight, so it is warmer there.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Поставить на прямую', uz: "Usul. Chiziqqa qo'yish", en: 'Method. Put them on the line' },
    m1_steps: {
      ru: ['Отдели отрицательные от положительных', 'Внутри отрицательных сравни модули наоборот', 'Прочитай прямую слева направо'],
      uz: ['Manfiylarni musbatlardan ajrating', 'Manfiylar ichida modullarni teskari solishtiring', "Chiziqni chapdan o'ngga o'qing"],
      en: ['Separate negatives from positives', 'Among negatives compare absolute values in reverse', 'Read the line from left to right'],
    },
    m1_no: {
      ru: 'Дроби с разными знаменателями сначала приводят к общему, как в уроке 9, а потом ставят на прямую.',
      uz: "Har xil maxrajli kasrlar avval 9-darsdagidek umumiy maxrajga keltiriladi, keyin chiziqqa qo'yiladi.",
      en: 'Fractions with different denominators first get a common one, as in lesson 9, and then go on the line.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: табло погоды в холле школы.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d26wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d26wall)"/>

    {/* Часы и растение в холле */}
    <g opacity="0.8">
      <circle cx="46" cy="34" r="18" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <path d="M46 34 v-11 M46 34 l8 5" stroke="#3B3730" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="24" y="106" width="26" height="24" rx="4" fill="#D98A5A"/>
      <path d="M37 106 q-12 -16 -3 -24 q9 10 3 24" fill="#8FBF7F"/>
      <path d="M37 106 q12 -14 4 -22 q-9 9 -4 22" fill="#8FBF7F" opacity="0.85"/>
    </g>

    {/* Табло: четыре города, температуры без пояснений */}
    <g>
      <rect x="92" y="14" width="240" height="106" rx="6" fill="#3B3730"/>
      <rect x="98" y="20" width="228" height="94" rx="4" fill="#2A2723"/>
      {[
        { y: 42, t: '−3', tone: '#7ECBE6' },
        { y: 70, t: '−8', tone: '#7ECBE6' },
        { y: 98, t: '+4', tone: '#F5C77E' },
      ].map((row, i) => (
        <g key={row.t}>
          <rect x="110" y={row.y - 14} width="86" height="20" rx="3" fill="#4A453D"/>
          {[0, 1, 2].map((k) => (
            <rect key={k} x={116 + k * 26} y={row.y - 9} width="18" height="3" rx="1.5" fill="#7B7367"/>
          ))}
          <text x="286" y={row.y} textAnchor="middle" fill={row.tone}
            fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">{row.t}</text>
          <circle cx="216" cy={row.y - 5} r="4" fill={i === 2 ? '#F5C77E' : '#7ECBE6'} opacity="0.8"/>
        </g>
      ))}
      <g className="d26-scan">
        <rect x="98" y="20" width="228" height="8" fill="#FFFDF7" opacity="0.08"/>
      </g>
    </g>

    {/* Дети у табло */}
    <Person x={356} ground={136} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={392} ground={136} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <rect x="0" y="136" width="400" height="18" fill="#D2A96F"/>
  </svg>
);

// Итог: числа на прямой в порядке возрастания.
const FinalScene = () => {
  const x0 = 24; const step = 24; const y = 40;
  const marks = Array.from({ length: 15 }, (_, i) => i - 9);
  const px = (v) => x0 + (v + 9) * step;
  const hits = [-8, -3, 0, 4];
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <path d={`M10 ${y} h380`} stroke="#8E8578" strokeWidth="2.2"/>
      {marks.map((m) => (
        <g key={m}>
          <path d={`M${px(m)} ${y - 5} v10`} stroke="#8E8578" strokeWidth={m === 0 ? 3 : 1.2}/>
          {hits.includes(m) && (
            <>
              <circle cx={px(m)} cy={y} r="6" fill={m < 0 ? '#019ACB' : '#D9603F'}/>
              <text x={px(m)} y={y + 24} textAnchor="middle" fill={m < 0 ? '#019ACB' : '#D9603F'}
                fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{m}</text>
            </>
          )}
        </g>
      ))}
      <text x="200" y="80" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">−8 &lt; −3 &lt; 0 &lt; 4</text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
const NumLine = ({ from = -9, to = 9, points = [], size = 'mid' }) => {
  const n = to - from;
  const step = 380 / n;
  const y = 34;
  const px = (v) => 10 + (v - from) * step;
  return (
    <span className={'d26-line-box d26-line-' + size}>
      <svg viewBox="0 0 400 60" aria-hidden="true">
        <path d={`M4 ${y} h392`} stroke="#8E8578" strokeWidth="2.2"/>
        {Array.from({ length: n + 1 }, (_, i) => {
          const v = from + i;
          const x = px(v);
          return (
            <g key={v}>
              <path d={`M${x} ${y - 5} v10`} stroke="#8E8578" strokeWidth={v === 0 ? 3 : 1.2}/>
              <text x={x} y={y + 19} textAnchor="middle" fill={v === 0 ? '#494550' : '#8A8883'}
                fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{v}</text>
            </g>
          );
        })}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={px(p.v)} cy={y} r="6" fill={p.tone || (p.v < 0 ? '#019ACB' : '#D9603F')}/>
            {p.name && (
              <text x={px(p.v)} y={y - 12} textAnchor="middle" fill={p.tone || (p.v < 0 ? '#019ACB' : '#D9603F')}
                fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{p.name}</text>
            )}
          </g>
        ))}
      </svg>
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d26-line d26-fade' + (on ? ' d26-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d26-stage">
        <NumLine from={-6} to={6}
          points={step >= 1 ? [{ v: -4 }, { v: 4 }] : []}/>
        <span className={'d26-chips d26-fade' + (step >= 2 ? ' d26-on' : '')}>
          <i>|−4| = 4</i>
          <i>|4| = 4</i>
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

// Ядро: −8 и −3 на прямой, правее значит больше.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d26-stage">
        <NumLine from={-9} to={3} points={[{ v: -8, name: '−8' }, { v: -3, name: '−3' }]}/>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        <span className={'d26-cmp d26-fade' + (step >= 1 ? ' d26-on' : '')}>
          <b>−8</b><span className="d26-sign">&lt;</span><b>−3</b>
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

const MixBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_mix;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d26-stage">
        <NumLine from={-3} to={3}
          points={[
            ...(step >= 0 ? [{ v: 2, name: '2' }, { v: -2, name: '−2' }] : []),
            ...(step >= 1 ? [{ v: 0, name: '0', tone: '#1F7A4D' }] : []),
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

const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d26-stage">
        <NumLine from={-6} to={4}
          points={[
            ...(step >= 0 ? [{ v: -5 }, { v: -2 }] : []),
            ...(step >= 1 ? [{ v: 3 }] : []),
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

// Граница: модуль больше, а число меньше.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d26-stage">
        <NumLine from={-11} to={1} size="sm" points={[{ v: -10, name: '−10' }, { v: -2, name: '−2' }]}/>
        <span className="d26-pair d26-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d26-pair d26-pair-good d26-fade' + (step >= 1 ? ' d26-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d26-pair d26-pair-warn d26-fade' + (step >= 2 ? ' d26-on' : '')}>
          <Line node={t(c.frac_line)} on/>
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
        correctAnswer: t(c.play_opts[c.play_correct]), studentAnswer: t(c.play_opts[i]),
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
        <div className={'d26-banner fade-up delay-1' + (phase === 'play' ? ' d26-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d26-stage d26-stage-tool">
          {phase === 'demo' ? (
            <>
              <NumLine from={-7} to={1} size="sm"
                points={[{ v: -6, name: '−6' }, { v: -2, name: '−2' }]}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d26-verdict' + (done ? ' d26-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={i} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{mt(t(o))}</button>
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
          <div className="d26-acts fade-up">
            <button className="d26-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d26-btn d26-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenMix = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_mix} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <MixBody step={step}/>}/>
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
      <div className="d26-stage">
        <NumLine from={-9} to={5} points={[{ v: -8, name: '−8' }, { v: -3, name: '−3' }, { v: 4, name: '4' }]}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenCmp = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_cmp} asideNode={methodAside}/>
);
const ScreenOrder = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_order} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: четыре температуры на прямой.
const TaskFig = ({ idx }) => (
  <div className="d26-task-fig">
    <NumLine from={-9} to={5} size="sm"
      points={idx >= 1
        ? [{ v: -8, name: '−8' }, { v: -3, name: '−3' }, { v: 0, name: '0', tone: '#1F7A4D' }, { v: 4, name: '4' }]
        : [{ v: -8, name: '−8' }, { v: -3, name: '−3' }]}/>
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
.d26-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d26-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d26-stage-tool .d26-line { font-size: clamp(12px, 2vw, 16px); }

/* Координатная прямая */
.d26-line-box { display: block; width: 100%; }
.d26-line-box svg { width: 100%; height: auto; display: block; }

.d26-fade { opacity: 0; transition: opacity 420ms linear; }
.d26-on { opacity: 1; }
.d26-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; }

/* Сравнение крупно */
.d26-cmp { display: inline-flex; align-items: center; gap: 12px; }
.d26-cmp b { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px, 3.8vw, 30px); color: #019ACB; }
.d26-sign { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px, 3.8vw, 30px); font-weight: 700; color: #1F7A4D; }

/* Чипсы модулей */
.d26-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d26-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; background: #E7F5FA; border: 1px solid #B6DCEA; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #019ACB; }

/* Строки экрана границы */
.d26-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d26-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d26-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d26-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d26-task-fig { display: block; width: 100%; }

/* Экран 4 */
.d26-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d26-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d26-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d26-verdict-on { opacity: 1; }
.d26-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d26-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d26-btn:disabled { opacity: 0.45; cursor: default; }
.d26-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d26-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: строка обновления бежит по табло */
.d26-scan { animation: d26Scan 5200ms linear infinite; }
@keyframes d26Scan { from { transform: translateY(0); } to { transform: translateY(86px); } }
@media (prefers-reduced-motion: reduce) { .d26-scan { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function CompareRationalLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenMix, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenCmp, ScreenOrder, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
