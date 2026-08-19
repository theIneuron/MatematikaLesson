// ============================================================
// 6 КЛАСС, УРОК 17 «Отношение»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б4 начинается здесь. Дроби кончились, начинается сравнение величин
// делением. Отношение — это та же дробь, но читаемая как «во сколько раз» и
// «сколько частей», и сокращается оно ровно по правилу урока 8.
//
// Сцена — изостудия: банки с краской и палитра.
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
  lessonId: 'grade6-17',
  lessonTitle: {
    ru: 'Отношение',
    uz: 'Nisbat',
    en: 'Ratio',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 rassomlik: 2 ga 3 bo'yoq
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 kasrni qisqartirish esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 nisbat: 2:3 = 4:6, tartib muhim
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: nisbatni soddalashtirish
  { id: 's_whole',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 qismning qismga va butunga nisbati
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 12 va 18
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: tartib va ayirma emas
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_simp',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 nisbatni soddalashtirish x3
  { id: 's_share',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 nisbat bo'yicha qismni topish x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: 2:3 ga teng yoki yo'q
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: bo'yoq
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Зелёная краска', uz: "Yashil bo'yoq", en: 'Green paint' },
    lead: {
      ru: 'В изостудии зелёный цвет делают так: 2 части синей краски и 3 части жёлтой.',
      uz: "Rassomlik to'garagida yashil rang shunday olinadi: 2 qism ko'k bo'yoq va 3 qism sariq.",
      en: 'In the art club green is mixed like this: 2 parts blue paint and 3 parts yellow.',
    },
    voice_a: { ru: 'Азиз взял 4 части синей и 6 жёлтой.', uz: "Aziz 4 qism ko'k va 6 qism sariq oldi.", en: 'Aziz took 4 parts blue and 6 yellow.' },
    voice_b: { ru: 'Дилноза: цвет получится другой.', uz: 'Dilnoza: rang boshqacha chiqadi.', en: 'Dilnoza: the colour will be different.' },
    ask: { ru: 'Какой оттенок выйдет у Азиза?', uz: 'Azizda qanday tus chiqadi?', en: 'What shade will Aziz get?' },
    options: [
      { ru: 'Точно такой же', uz: 'Aynan o\'shanday', en: 'Exactly the same' },
      { ru: 'Другой оттенок', uz: 'Boshqa tus', en: 'A different shade' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В изостудии зелёную краску делают по рецепту: две части синей и три части жёлтой.',
          'Азиз взял четыре части синей и шесть жёлтой. Дилноза говорит, что цвет получится другой. Какой оттенок выйдет у Азиза? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Rassomlik to'garagida yashil bo'yoq shu retsept bo'yicha tayyorlanadi: ikki qism ko'k va uch qism sariq.",
          "Aziz to'rt qism ko'k va olti qism sariq oldi. Dilnoza rang boshqacha chiqadi deydi. Azizda qanday tus chiqadi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'In the art club green paint follows a recipe: two parts blue and three parts yellow.',
          'Aziz took four parts blue and six yellow. Dilnoza says the colour will differ. What shade will Aziz get? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Сокращение никуда не делось', uz: 'Qisqartirish hech qayerga ketmadi', en: 'Reducing is still here' },
    from: { n: 4, d: 6 },
    to: { n: 2, d: 3 },
    done: {
      ru: 'Четыре шестых и две третьих — одно и то же число. Сегодня та же запись прочитается по-новому.',
      uz: "To'rt oltidan va ikki uchdan bitta sonning o'zi. Bugun xuddi shu yozuv yangicha o'qiladi.",
      en: 'Four sixths and two thirds are the same number. Today the same notation gets a new reading.',
    },
    audio: {
      ru: [
        'Вспомним восьмой урок. Четыре шестых сокращаются на два.',
        'Получается две третьих. Значение не изменилось, изменилась только запись.',
        'Сегодня мы прочитаем такую пару чисел иначе: не как часть от целого, а как сравнение двух величин.',
      ],
      uz: [
        "Sakkizinchi darsni eslaymiz. To'rt oltidan ikkiga qisqaradi.",
        "Ikki uchdan chiqadi. Qiymat o'zgarmadi, faqat yozuv o'zgardi.",
        "Bugun bunday sonlar juftligini boshqacha o'qiymiz: butunning qismi emas, ikki kattalikning solishtirilishi sifatida.",
      ],
      en: [
        'Recall lesson eight. Four sixths reduces by two.',
        'That gives two thirds. The value did not change, only the notation did.',
        'Today we read such a pair differently: not as a part of a whole, but as a comparison of two quantities.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Отношение 2 к 3', uz: '2 ning 3 ga nisbati', en: 'The ratio 2 to 3' },
    mixes: [
      { a: 2, b: 3 },
      { a: 4, b: 6 },
      { a: 3, b: 2 },
    ],
    done: {
      ru: 'Отношение показывает, сколько частей одной величины приходится на части другой. 2:3 и 4:6 — один рецепт, а 3:2 — уже другой цвет. Прав был Азиз.',
      uz: "Nisbat bir kattalikning necha qismi ikkinchisining qismlariga to'g'ri kelishini ko'rsatadi. 2:3 va 4:6 bitta retsept, 3:2 esa boshqa rang. Aziz haq edi.",
      en: 'A ratio shows how many parts of one quantity go with parts of another. 2:3 and 4:6 are one recipe, while 3:2 is a different colour. Aziz was right.',
    },
    audio: {
      ru: [
        'Запись два к трём называют отношением. Она говорит, что на каждые две части синей приходится три части жёлтой.',
        'Если взять вдвое больше и того, и другого, получится четыре к шести. Частей стало больше, но на каждые две синие по-прежнему три жёлтых. Цвет тот же самый.',
        'А вот три к двум это уже другой рецепт: синей стало больше жёлтой, и цвет уйдёт в холодную сторону. Порядок чисел в отношении менять нельзя. Прав был Азиз.',
      ],
      uz: [
        "Ikki ning uchga nisbati degan yozuv nisbat deyiladi. U har ikki qism ko'kka uch qism sariq to'g'ri kelishini bildiradi.",
        "Ikkalasidan ikki barobar ko'p olsak, to'rt ning oltiga nisbati chiqadi. Qismlar ko'paydi, lekin har ikki ko'kka baribir uch sariq. Rang o'sha.",
        "Uch ning ikkiga nisbati esa boshqa retsept: ko'k sariqdan ko'p bo'ldi va rang sovuq tomonga ketadi. Nisbatdagi sonlar tartibini o'zgartirib bo'lmaydi. Aziz haq edi.",
      ],
      en: [
        'The notation two to three is called a ratio. It says that every two parts of blue come with three parts of yellow.',
        'Take twice as much of each and you get four to six. There are more parts, but every two blue still meet three yellow. The colour is the same.',
        'Three to two is a different recipe: now blue outweighs yellow and the colour turns cold. The order in a ratio cannot be swapped. Aziz was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Упрощаем отношение', uz: 'Nisbatni soddalashtiramiz', en: 'Simplifying a ratio' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '12 : 18 — оба числа делятся на 6', uz: "12 : 18 — ikkala son 6 ga bo'linadi", en: '12 : 18 — both numbers divide by 6' },
      { ru: '12 : 6 = 2 и 18 : 6 = 3', uz: '12 : 6 = 2 va 18 : 6 = 3', en: '12 ÷ 6 = 2 and 18 ÷ 6 = 3' },
      { ru: 'значит 12 : 18 = 2 : 3', uz: 'demak 12 : 18 = 2 : 3', en: 'so 12 : 18 = 2 : 3' },
    ],
    demo_note: {
      ru: 'Отношение упрощают как дробь: делят оба числа на их общий делитель. Смысл при этом не меняется.',
      uz: "Nisbat kasr kabi soddalashtiriladi: ikkala son umumiy bo'luvchiga bo'linadi. Ma'nosi esa o'zgarmaydi.",
      en: 'A ratio simplifies like a fraction: divide both numbers by their common divisor. The meaning stays.',
    },
    play_ask: { ru: 'Упрости отношение 10 : 15', uz: '10 : 15 nisbatini soddalashtiring', en: 'Simplify the ratio 10 : 15' },
    play_opts: ['2 : 3', '5 : 3', '1 : 5'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. НОД(10, 15) = 5, получается 2 : 3.',
      uz: "To'g'ri. EKUB(10, 15) = 5, 2 : 3 chiqadi.",
      en: 'Right. GCD(10, 15) = 5, giving 2 : 3.',
    },
    play_wrong: [
      null,
      { ru: 'Делить надо оба числа: 15 на 5 даёт 3, а 10 на 5 даёт 2.', uz: "Ikkala sonni bo'lish kerak: 15 ni 5 ga bo'lsak 3, 10 ni 5 ga bo'lsak 2.", en: 'Both numbers must be divided: 15 ÷ 5 is 3 and 10 ÷ 5 is 2.' },
      { ru: 'Это разность, а не частное: отношение сравнивает делением.', uz: "Bu ayirma, bo'linma emas: nisbat bo'lish orqali solishtiradi.", en: 'That is a difference: a ratio compares by dividing.' },
    ],
    audio: {
      intro: {
        ru: 'Отношение упрощают точно так же, как сокращают дробь. Делим оба числа на общий делитель. Покажу на двенадцати и восемнадцати.',
        uz: "Nisbat kasrni qisqartirgandek soddalashtiriladi. Ikkala sonni umumiy bo'luvchiga bo'lamiz. O'n ikki va o'n sakkiz misolida ko'rsataman.",
        en: 'A ratio is simplified exactly like reducing a fraction. Divide both numbers by a common divisor. I will show it on twelve and eighteen.',
      },
      demo: {
        ru: 'Наибольший общий делитель двенадцати и восемнадцати шесть. Делим оба и получаем два к трём. Это тот же рецепт краски.',
        uz: "O'n ikki va o'n sakkizning eng katta umumiy bo'luvchisi olti. Ikkalasini bo'lamiz va ikki ning uchga nisbati chiqadi. Bu o'sha bo'yoq retsepti.",
        en: 'The greatest common divisor of twelve and eighteen is six. Divide both and get two to three. It is the same paint recipe.',
      },
      play: {
        ru: 'Теперь ваша очередь. Упростите отношение десять к пятнадцати.',
        uz: "Endi sizning navbatingiz. O'n ning o'n beshga nisbatini soddalashtiring.",
        en: 'Now it is your turn. Simplify the ratio ten to fifteen.',
      },
      ok: {
        ru: 'Верно. Оба числа разделили на пять и получили два к трём.',
        uz: "To'g'ri. Ikkala sonni beshga bo'ldik va ikki ning uchga nisbati chiqdi.",
        en: 'Right. Both numbers divided by five give two to three.',
      },
      wrong: {
        ru: 'Найдите общий делитель обоих чисел и разделите на него оба.',
        uz: "Ikkala sonning umumiy bo'luvchisini toping va ikkalasini unga bo'ling.",
        en: 'Find a common divisor of both numbers and divide both by it.',
      },
    },
  },

  s_whole: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Часть к части и часть к целому', uz: 'Qismning qismga va butunga nisbati', en: 'Part to part and part to whole' },
    lines: [
      { ru: 'синей к жёлтой — 2 : 3', uz: "ko'kning sariqqa nisbati — 2 : 3", en: 'blue to yellow is 2 : 3' },
      { ru: 'всего частей 2 + 3 = 5', uz: 'jami qism 2 + 3 = 5', en: 'in total 2 + 3 = 5 parts' },
      { ru: 'синей от всей краски — 2/5', uz: "ko'k butun bo'yoqning 2/5 qismi", en: 'blue is 2/5 of all the paint' },
    ],
    done: {
      ru: 'Отношение 2:3 сравнивает части между собой, а дробь 2/5 говорит о части от целого. Это разные вопросы к одной банке.',
      uz: "2:3 nisbati qismlarni o'zaro solishtiradi, 2/5 kasri esa butundagi qismni bildiradi. Bu bitta bankaga berilgan har xil savollar.",
      en: 'The ratio 2:3 compares the parts with each other, while the fraction 2/5 tells the part of the whole. Two different questions about the same tin.',
    },
    audio: {
      ru: [
        'У отношения есть важная пара: часть к части и часть к целому. Синей к жёлтой два к трём.',
        'Но всего частей пять, потому что две и три складываются.',
        'Значит синяя краска это две пятых всей смеси, а жёлтая три пятых. Отношение и дробь отвечают на разные вопросы, и путать их нельзя.',
      ],
      uz: [
        "Nisbatda muhim juftlik bor: qismning qismga va qismning butunga nisbati. Ko'kning sariqqa nisbati ikki ning uchga.",
        "Lekin qismlar jami beshta, chunki ikki bilan uch qo'shiladi.",
        "Demak ko'k bo'yoq butun aralashmaning ikki beshdan qismi, sariq esa uch beshdan. Nisbat va kasr har xil savolga javob beradi, ularni chalkashtirib bo'lmaydi.",
      ],
      en: [
        'A ratio comes with an important pair: part to part and part to whole. Blue to yellow is two to three.',
        'But there are five parts in total, because two and three add up.',
        'So the blue paint is two fifths of the mixture and the yellow is three fifths. A ratio and a fraction answer different questions and must not be mixed up.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'В классе 12 мальчиков и 18 девочек', uz: "Sinfda 12 o'g'il va 18 qiz bola", en: '12 boys and 18 girls in a class' },
    lead: { ru: 'Сначала отношение, потом доля от всего класса.', uz: 'Avval nisbat, keyin butun sinfdagi ulush.', en: 'The ratio first, then the share of the class.' },
    steps: [
      { ru: '12 : 18 = 2 : 3 — мальчиков к девочкам', uz: "12 : 18 = 2 : 3 — o'g'illarning qizlarga nisbati", en: '12 : 18 = 2 : 3 for boys to girls' },
      { ru: 'всего частей 2 + 3 = 5, в классе 30 человек', uz: 'jami qism 2 + 3 = 5, sinfda 30 kishi', en: '2 + 3 = 5 parts and 30 students' },
      { ru: 'девочек 3/5 класса: 30 · 3/5 = 18', uz: 'qizlar sinfning 3/5 qismi: 30 · 3/5 = 18', en: 'girls are 3/5 of the class: 30 · 3/5 = 18' },
    ],
    done: {
      ru: 'Одна часть здесь равна 6 человекам. Отношение 2:3 не говорит, сколько всего, но вместе с числом учеников даёт всё.',
      uz: "Bu yerda bitta qism 6 kishiga teng. 2:3 nisbati jami sonni aytmaydi, lekin o'quvchilar soni bilan birga hammasini beradi.",
      en: 'One part here equals 6 people. The ratio 2:3 does not say the total, but together with the class size it gives everything.',
    },
    audio: {
      ru: [
        'Решаем вместе. В классе двенадцать мальчиков и восемнадцать девочек. Найдём отношение и сократим его на шесть: два к трём.',
        'Всего частей пять, а учеников тридцать. Значит одна часть это шесть человек.',
        'Девочки это три части из пяти, то есть три пятых класса. Тридцать умножить на три пятых восемнадцать. Сходится с условием.',
      ],
      uz: [
        "Birga yechamiz. Sinfda o'n ikki o'g'il va o'n sakkiz qiz bola bor. Nisbatni topamiz va uni oltiga qisqartiramiz: ikki ning uchga.",
        "Jami qism beshta, o'quvchilar esa o'ttizta. Demak bitta qism olti kishi.",
        "Qizlar beshdan uch qism, ya'ni sinfning uch beshdan qismi. O'ttiz karra uch beshdan o'n sakkiz. Shartga to'g'ri keldi.",
      ],
      en: [
        'Let us solve it together. A class has twelve boys and eighteen girls. Find the ratio and reduce it by six: two to three.',
        'There are five parts and thirty students, so one part is six people.',
        'The girls are three parts out of five, that is three fifths of the class. Thirty times three fifths is eighteen. It matches the problem.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Порядок и способ сравнения', uz: 'Tartib va solishtirish usuli', en: 'Order and the way of comparing' },
    order_line: { ru: '2 : 3 и 3 : 2 — разные отношения', uz: "2 : 3 va 3 : 2 — har xil nisbatlar", en: '2 : 3 and 3 : 2 are different ratios' },
    diff_line: { ru: 'отношение — это деление, а не вычитание', uz: "nisbat bu bo'lish, ayirish emas", en: 'a ratio is division, not subtraction' },
    unit_line: { ru: 'сравнивают величины в одних единицах: 2 м и 50 см это 200 : 50', uz: "kattaliklar bir xil birlikda solishtiriladi: 2 m va 50 sm bu 200 : 50", en: 'compare in the same units: 2 m and 50 cm is 200 : 50' },
    done: {
      ru: 'Отношение всегда отвечает на вопрос «во сколько раз», поэтому порядок важен, единицы должны совпадать, а вычитание тут не работает.',
      uz: "Nisbat doim «necha barobar» degan savolga javob beradi, shuning uchun tartib muhim, birliklar bir xil bo'lishi kerak, ayirish esa bu yerda ishlamaydi.",
      en: 'A ratio always answers how many times, so the order matters, the units must match, and subtraction does not apply.',
    },
    audio: {
      ru: [
        'Первая ошибка это переставить числа. Два к трём и три к двум описывают разные смеси, разные цвета, разные классы.',
        'Вторая ошибка сравнить вычитанием. Разность говорит, на сколько больше, а отношение во сколько раз. Это разные вопросы.',
        'И третья. Сравнивать можно только одинаковые единицы. Два метра и пятьдесят сантиметров это не два к пятидесяти, а двести к пятидесяти, то есть четыре к одному.',
      ],
      uz: [
        "Birinchi xato sonlarni o'rin almashtirish. Ikki ning uchga va uch ning ikkiga nisbati har xil aralashmalarni, har xil ranglarni, har xil sinflarni tasvirlaydi.",
        "Ikkinchi xato ayirish bilan solishtirish. Ayirma nechtaga ko'p ekanini, nisbat esa necha barobar ekanini aytadi. Bu har xil savollar.",
        "Uchinchisi. Faqat bir xil birliklarni solishtirish mumkin. Ikki metr va ellik santimetr bu ikki ning ellikka nisbati emas, ikki yuz ning ellikka nisbati, ya'ni to'rt ning birga nisbati.",
      ],
      en: [
        'The first mistake is swapping the numbers. Two to three and three to two describe different mixtures, different colours, different classes.',
        'The second is comparing by subtraction. A difference says how much more, a ratio says how many times. Different questions.',
        'And the third. Only equal units can be compared. Two metres and fifty centimetres is not two to fifty but two hundred to fifty, that is four to one.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Что такое отношение', uz: 'Nisbat nima', en: 'What a ratio is' },
    rule_1: {
      ru: 'Отношение двух чисел — их частное. Оно показывает, во сколько раз одно больше другого или сколько частей приходится на части. Отношение упрощают делением обоих чисел на общий делитель.',
      uz: "Ikki sonning nisbati — ularning bo'linmasi. U biri ikkinchisidan necha barobar katta ekanini yoki qismlar nisbatini ko'rsatadi. Nisbat ikkala sonni umumiy bo'luvchiga bo'lib soddalashtiriladi.",
      en: 'A ratio of two numbers is their quotient. It shows how many times one is bigger, or how many parts go with how many. Simplify it by dividing both numbers by a common divisor.',
    },
    rule_2: {
      ru: 'Порядок чисел менять нельзя, единицы должны совпадать. Краска: 2 : 3 = 4 : 6, оттенок тот же. Прав был Азиз.',
      uz: "Sonlar tartibini o'zgartirib bo'lmaydi, birliklar bir xil bo'lishi kerak. Bo'yoq: 2 : 3 = 4 : 6, tus o'sha. Aziz haq edi.",
      en: 'The order cannot be swapped and the units must match. The paint: 2 : 3 = 4 : 6, the same shade. Aziz was right.',
    },
    audio: {
      ru: 'Запомним правило. Отношение двух чисел это их частное: оно показывает, во сколько раз одно больше другого. Упрощают отношение так же, как сокращают дробь, деля оба числа на общий делитель. Порядок чисел менять нельзя, а величины сравнивают в одинаковых единицах. Вернёмся к краске. Два к трём и четыре к шести это одно и то же отношение, значит оттенок тот же. Прав был Азиз.',
      uz: "Qoidani eslab qolamiz. Ikki sonning nisbati bu ularning bo'linmasi: u biri ikkinchisidan necha barobar katta ekanini ko'rsatadi. Nisbat kasrni qisqartirgandek, ikkala sonni umumiy bo'luvchiga bo'lib soddalashtiriladi. Sonlar tartibini o'zgartirib bo'lmaydi, kattaliklar esa bir xil birlikda solishtiriladi. Bo'yoqqa qaytamiz. Ikki ning uchga va to'rt ning oltiga nisbati bitta nisbatning o'zi, demak tus o'sha. Aziz haq edi.",
      en: 'Let us remember the rule. A ratio of two numbers is their quotient: it shows how many times one is bigger. Simplify it like reducing a fraction, dividing both numbers by a common divisor. The order cannot be swapped and quantities are compared in the same units. Back to the paint. Two to three and four to six are the same ratio, so the shade is the same. Aziz was right.',
    },
  },

  s_simp: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Упрости отношение', uz: 'Nisbatni soddalashtiring', en: 'Simplify the ratio' },
    lead: { ru: 'Дели оба числа на их наибольший общий делитель.', uz: "Ikkala sonni eng katta umumiy bo'luvchiga bo'ling.", en: 'Divide both numbers by their greatest common divisor.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '8 : 12', uz: '8 : 12', en: '8 : 12' },
        opts: ['2 : 3', '4 : 6', '3 : 2'],
        correct: 0,
        ok: { ru: 'Верно. НОД(8, 12) = 4, получается 2 : 3.', uz: "To'g'ri. EKUB(8, 12) = 4, 2 : 3 chiqadi.", en: 'Right. GCD(8, 12) = 4, giving 2 : 3.' },
        wrong: [
          null,
          { ru: 'Это деление на 2, но 4 и 6 ещё делятся на 2.', uz: "Bu 2 ga bo'lish, lekin 4 va 6 hali 2 ga bo'linadi.", en: 'That divided by 2, but 4 and 6 still divide by 2.' },
          { ru: 'Порядок менять нельзя: первым идёт 8.', uz: "Tartibni o'zgartirib bo'lmaydi: birinchi 8 turadi.", en: 'The order cannot change: 8 comes first.' },
        ],
      },
      {
        q: { ru: '25 : 15', uz: '25 : 15', en: '25 : 15' },
        opts: ['5 : 3', '3 : 5', '5 : 15'],
        correct: 0,
        ok: { ru: 'Верно. Оба числа делятся на 5: 5 : 3.', uz: "To'g'ri. Ikkala son 5 ga bo'linadi: 5 : 3.", en: 'Right. Both divide by 5: 5 : 3.' },
        wrong: [
          null,
          { ru: 'Здесь числа переставлены местами.', uz: "Bu yerda sonlar o'rin almashgan.", en: 'The numbers were swapped here.' },
          { ru: 'Второе число тоже надо разделить.', uz: "Ikkinchi sonni ham bo'lish kerak.", en: 'The second number must be divided too.' },
        ],
      },
      {
        q: { ru: '1 м : 25 см', uz: '1 m : 25 sm', en: '1 m : 25 cm' },
        opts: ['1 : 25', '4 : 1', '1 : 4'],
        correct: 1,
        ok: { ru: 'Верно. 1 м это 100 см, значит 100 : 25 = 4 : 1.', uz: "To'g'ri. 1 m bu 100 sm, demak 100 : 25 = 4 : 1.", en: 'Right. 1 m is 100 cm, so 100 : 25 = 4 : 1.' },
        wrong: [
          { ru: 'Единицы разные: сначала переведи метры в сантиметры.', uz: "Birliklar har xil: avval metrni santimetrga aylantiring.", en: 'The units differ: convert metres to centimetres first.' },
          null,
          { ru: 'Метр больше 25 см, значит первое число больше.', uz: "Metr 25 sm dan katta, demak birinchi son kattaroq.", en: 'A metre is more than 25 cm, so the first number is larger.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Проверяйте единицы и делите оба числа на общий делитель.',
        uz: "Mashq. Birliklarni tekshiring va ikkala sonni umumiy bo'luvchiga bo'ling.",
        en: 'Practice. Check the units and divide both numbers by a common divisor.',
      },
    },
  },

  s_share: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Части по отношению', uz: 'Nisbat bo\'yicha qismlar', en: 'Shares from a ratio' },
    lead: { ru: 'Сложи части отношения — получишь целое в частях.', uz: "Nisbat qismlarini qo'shing — butun qismlarda chiqadi.", en: 'Add the parts of the ratio to get the whole in parts.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Краску смешали 2 : 3. Какую часть смеси составляет синяя?', uz: "Bo'yoq 2 : 3 aralashtirildi. Ko'k aralashmaning qaysi qismi?", en: 'Paint mixed 2 : 3. What part of the mixture is blue?' },
        opts: ['2/3', '2/5', '3/5'],
        correct: 1,
        ok: { ru: 'Верно. Всего частей 5, синей 2, значит 2/5.', uz: "To'g'ri. Jami 5 qism, ko'k 2 ta, demak 2/5.", en: 'Right. Five parts in total and blue is 2, so 2/5.' },
        wrong: [
          { ru: '2/3 — это отношение синей к жёлтой, а не к смеси.', uz: "2/3 bu ko'kning sariqqa nisbati, aralashmaga emas.", en: '2/3 is blue to yellow, not blue to the mixture.' },
          null,
          { ru: '3/5 — это доля жёлтой.', uz: '3/5 bu sariqning ulushi.', en: '3/5 is the yellow share.' },
        ],
      },
      {
        q: { ru: '20 конфет разделили в отношении 2 : 3. Сколько в меньшей части?', uz: "20 ta konfet 2 : 3 nisbatda bo'lindi. Kichik qismda nechta?", en: '20 sweets shared in the ratio 2 : 3. How many in the smaller share?' },
        opts: ['8', '4', '12'],
        correct: 0,
        ok: { ru: 'Верно. Частей 5, одна часть 4 конфеты, меньшая доля 2 части: 8.', uz: "To'g'ri. Qism 5 ta, bitta qism 4 konfet, kichik ulush 2 qism: 8.", en: 'Right. Five parts, one part is 4 sweets, the smaller share is 2 parts: 8.' },
        wrong: [
          null,
          { ru: '4 — это одна часть, а в меньшей доле их две.', uz: "4 bu bitta qism, kichik ulushda esa ikkita.", en: 'Four is one part, and the smaller share has two.' },
          { ru: '12 — это большая часть.', uz: '12 bu katta qism.', en: 'Twelve is the larger share.' },
        ],
      },
      {
        q: { ru: 'Отношение 3 : 4. Сколько всего частей?', uz: '3 : 4 nisbati. Jami nechta qism?', en: 'The ratio is 3 : 4. How many parts in total?' },
        opts: ['7', '12', '1'],
        correct: 0,
        ok: { ru: 'Верно. 3 + 4 = 7 частей.', uz: "To'g'ri. 3 + 4 = 7 qism.", en: 'Right. 3 + 4 = 7 parts.' },
        wrong: [
          null,
          { ru: 'Части складывают, а не перемножают.', uz: "Qismlar qo'shiladi, ko'paytirilmaydi.", en: 'The parts are added, not multiplied.' },
          { ru: 'Одна часть это единица меры, а всего их семь.', uz: "Bitta qism o'lchov birligi, jami esa yettita.", en: 'One part is the unit of measure; there are seven of them.' },
        ],
      },
      {
        q: { ru: 'В отношении 5 : 1 первое число во сколько раз больше?', uz: "5 : 1 nisbatda birinchi son necha barobar katta?", en: 'In the ratio 5 : 1, how many times is the first bigger?' },
        opts: ['в 4 раза', 'в 5 раз', 'в 6 раз'],
        correct: 1,
        ok: { ru: 'Верно. 5 : 1 = 5, значит в пять раз.', uz: "To'g'ri. 5 : 1 = 5, demak besh barobar.", en: 'Right. 5 ÷ 1 = 5, so five times.' },
        wrong: [
          { ru: 'В 4 раза больше — это разность 5 − 1, а нужно частное.', uz: "To'rt barobar bu 5 − 1 ayirma, kerak bo'lgani bo'linma.", en: 'Four is the difference 5 − 1, but we need the quotient.' },
          null,
          { ru: 'Шесть — это сумма частей, а не отношение.', uz: "Olti bu qismlar yig'indisi, nisbat emas.", en: 'Six is the sum of parts, not the ratio.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Отношение говорит о частях, а сумма частей даёт целое.',
        uz: "Mashq. Nisbat qismlar haqida gapiradi, qismlar yig'indisi esa butunni beradi.",
        en: 'Practice. A ratio speaks of parts, and the sum of parts gives the whole.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Тот же рецепт или нет', uz: "O'sha retseptmi yoki yo'q", en: 'Same recipe or not' },
    lead: { ru: 'Упрости каждое отношение и сравни с 2 : 3.', uz: '2 : 3 bilan solishtirish uchun har bir nisbatni soddalashtiring.', en: 'Simplify each ratio and compare it with 2 : 3.' },
    bin_a: { ru: 'Равно 2 : 3', uz: '2 : 3 ga teng', en: 'Equals 2 : 3' },
    bin_b: { ru: 'Другое отношение', uz: 'Boshqa nisbat', en: 'A different ratio' },
    cards: [
      { label: '4 : 6', bin: 'a' },
      { label: '6 : 9', bin: 'a' },
      { label: '10 : 15', bin: 'a' },
      { label: '3 : 2', bin: 'b' },
      { label: '4 : 5', bin: 'b' },
      { label: '6 : 8', bin: 'b' },
    ],
    hint: {
      ru: 'Раздели оба числа на их общий делитель и посмотри, что осталось.',
      uz: "Ikkala sonni umumiy bo'luvchiga bo'ling va nima qolganiga qarang.",
      en: 'Divide both numbers by a common divisor and see what is left.',
    },
    correct_text: {
      ru: 'Верно. 4:6, 6:9 и 10:15 упрощаются до 2:3, а 3:2 отличается порядком, 4:5 и 6:8 — самими числами.',
      uz: "To'g'ri. 4:6, 6:9 va 10:15 soddalashib 2:3 bo'ladi, 3:2 tartibi bilan, 4:5 va 6:8 esa sonlari bilan farq qiladi.",
      en: 'Right. 4:6, 6:9 and 10:15 simplify to 2:3, while 3:2 differs in order and 4:5 and 6:8 in the numbers themselves.',
    },
    audio: {
      intro: {
        ru: 'Разложите отношения по двум корзинам. Сначала упростите каждое.',
        uz: 'Nisbatlarni ikki savatga ajrating. Avval har birini soddalashtiring.',
        en: 'Sort the ratios into two baskets. Simplify each one first.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Упрости отношение и сравни порядок чисел.', uz: 'Bu yerga emas. Nisbatni soddalashtiring va sonlar tartibini solishtiring.', en: 'Not here. Simplify the ratio and compare the order.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «Синей 2 части, жёлтой 3, значит синей 2/3 смеси». Проверь.', uz: "Aziz: «Ko'k 2 qism, sariq 3, demak ko'k aralashmaning 2/3 qismi». Tekshiring.", en: 'Aziz: “Blue is 2 parts, yellow 3, so blue is 2/3 of the mixture.” Check it.' },
        opts: [
          { ru: 'Нет: всего 5 частей, синей 2/5', uz: "Yo'q: jami 5 qism, ko'k 2/5", en: 'No: there are 5 parts and blue is 2/5' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, синей 3/5', uz: "Yo'q, ko'k 3/5", en: 'No, blue is 3/5' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 2/3 — это отношение синей к жёлтой, а не доля смеси.', uz: "To'g'ri. 2/3 bu ko'kning sariqqa nisbati, aralashmadagi ulush emas.", en: 'Right. 2/3 is blue to yellow, not the share of the mixture.' },
        wrong: [
          null,
          { ru: 'Части складываются: 2 и 3 дают 5.', uz: "Qismlar qo'shiladi: 2 va 3 beshni beradi.", en: 'The parts add up: 2 and 3 make 5.' },
          { ru: '3/5 — это доля жёлтой краски.', uz: "3/5 bu sariq bo'yoqning ulushi.", en: '3/5 is the yellow share.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «В отношении 6 : 2 первое больше на 3». Проверь.', uz: "Dilnoza: «6 : 2 nisbatda birinchi son 3 taga katta». Tekshiring.", en: 'Dilnoza: “In the ratio 6 : 2 the first is bigger by 3.” Check it.' },
        opts: [
          { ru: 'Нет: больше в 3 раза, а не на 3', uz: "Yo'q: 3 taga emas, 3 barobar katta", en: 'No: three times bigger, not bigger by three' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, больше на 4', uz: "Yo'q, 4 taga katta", en: 'No, bigger by four' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Отношение сравнивает делением: 6 : 2 = 3 раза.', uz: "To'g'ri. Nisbat bo'lish orqali solishtiradi: 6 : 2 = 3 barobar.", en: 'Right. A ratio compares by dividing: 6 ÷ 2 = 3 times.' },
        wrong: [
          null,
          { ru: 'На 3 больше было бы у чисел 5 и 2, а тут 6 и 2.', uz: "3 taga katta bo'lishi 5 va 2 da bo'lardi, bu yerda esa 6 va 2.", en: 'Bigger by three would fit 5 and 2, but here it is 6 and 2.' },
          { ru: 'На 4 — это разность, а отношение спрашивает во сколько раз.', uz: "4 taga bu ayirma, nisbat esa necha barobar deb so'raydi.", en: 'Four is the difference, but a ratio asks how many times.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в числе, и в самом понятии.',
        uz: "Birovning yechimini tekshiring. Xato sonda ham, tushunchaning o'zida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the number and in the idea itself.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Банка зелёной краски', uz: "Yashil bo'yoq bankasi", en: 'A tin of green paint' },
    lead: { ru: 'Зелёную краску мешают в отношении 2 : 3. Всего нужно 15 литров.', uz: "Yashil bo'yoq 2 : 3 nisbatda aralashtiriladi. Jami 15 litr kerak.", en: 'Green paint is mixed 2 : 3 and 15 litres are needed.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько литров синей краски нужно?', uz: "Necha litr ko'k bo'yoq kerak?", en: 'How many litres of blue are needed?' },
        opts: ['6', '9', '3'],
        correct: 0,
        ok: { ru: 'Верно. Частей 5, одна часть 3 литра, синей 2 части: 6 литров.', uz: "To'g'ri. Qism 5 ta, bitta qism 3 litr, ko'k 2 qism: 6 litr.", en: 'Right. Five parts, one part is 3 litres, blue is 2 parts: 6 litres.' },
        wrong: [
          null,
          { ru: '9 литров — это жёлтая краска, её 3 части.', uz: "9 litr bu sariq bo'yoq, u 3 qism.", en: 'Nine litres is the yellow, which is 3 parts.' },
          { ru: '3 литра — это одна часть, а синей две.', uz: "3 litr bu bitta qism, ko'k esa ikkita.", en: 'Three litres is one part, and blue has two.' },
        ],
      },
      {
        q: { ru: 'Какую часть банки занимает жёлтая краска?', uz: "Sariq bo'yoq bankaning qaysi qismini egallaydi?", en: 'What part of the tin is yellow?' },
        opts: ['3/5', '3/2', '2/5'],
        correct: 0,
        ok: { ru: 'Верно. Жёлтой 3 части из 5, значит 3/5 банки.', uz: "To'g'ri. Sariq 5 dan 3 qism, demak bankaning 3/5 qismi.", en: 'Right. Yellow is 3 of 5 parts, so 3/5 of the tin.' },
        wrong: [
          null,
          { ru: 'Это отношение жёлтой к синей, а не доля банки.', uz: "Bu sariqning ko'kka nisbati, bankadagi ulush emas.", en: 'That is yellow to blue, not the share of the tin.' },
          { ru: '2/5 — это доля синей краски.', uz: "2/5 bu ko'k bo'yoqning ulushi.", en: '2/5 is the blue share.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про краску. Смешивают в отношении два к трём, всего нужно пятнадцать литров.',
        uz: "Bo'yoq haqida masala. Ikki ning uchga nisbatida aralashtiriladi, jami o'n besh litr kerak.",
        en: 'A paint problem. Mixed two to three, and fifteen litres are needed.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 7,
        q: { ru: 'Отношение 21 : 6 упростили. Каким стало первое число? Набери ответ.', uz: '21 : 6 nisbati soddalashtirildi. Birinchi son nechaga aylandi? Javobni tering.', en: 'The ratio 21 : 6 was simplified. What is the first number now? Type it.' },
        hint: { ru: 'НОД(21, 6) = 3. Раздели оба числа на 3.', uz: "EKUB(21, 6) = 3. Ikkala sonni 3 ga bo'ling.", en: 'GCD(21, 6) = 3. Divide both numbers by 3.' },
        hint_audio: { ru: 'Наибольший общий делитель двадцати одного и шести три. Разделите оба числа на три.', uz: "Yigirma bir va oltining eng katta umumiy bo'luvchisi uch. Ikkala sonni uchga bo'ling.", en: 'The greatest common divisor of twenty one and six is three. Divide both by three.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Какое отношение равно 3 : 4?', uz: '3 : 4 ga qaysi nisbat teng?', en: 'Which ratio equals 3 : 4?' },
        opts: ['4 : 3', '6 : 7', '9 : 12', '3 : 8'],
        wrong: [
          { ru: 'Числа переставлены, это другое отношение.', uz: "Sonlar o'rin almashgan, bu boshqa nisbat.", en: 'The numbers are swapped: a different ratio.' },
          { ru: 'К обоим прибавили по 3, а надо умножить.', uz: "Ikkalasiga 3 tadan qo'shilgan, kerak bo'lgani ko'paytirish.", en: 'Three was added to each, but they must be multiplied.' },
          null,
          { ru: 'Второе число удвоили, а первое нет.', uz: "Ikkinchi son ikkilantirilgan, birinchisi esa yo'q.", en: 'The second number was doubled and the first was not.' },
        ],
        correct: { ru: 'Верно. Оба числа умножили на 3.', uz: "To'g'ri. Ikkala son 3 ga ko'paytirilgan.", en: 'Right. Both numbers were multiplied by 3.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Ленту 24 см разрезали в отношении 1 : 3. Какой кусок меньше?', uz: '24 sm tasma 1 : 3 nisbatda kesildi. Qaysi bo\'lak kichik?', en: 'A 24 cm tape is cut 1 : 3. How long is the shorter piece?' },
        opts: ['8 см', '6 см', '12 см', '4 см'],
        wrong: [
          { ru: '8 см вышло бы при отношении 1 : 2.', uz: '8 sm 1 : 2 nisbatda chiqardi.', en: 'Eight would come from the ratio 1 : 2.' },
          null,
          { ru: '12 см — это половина, а отношение 1 : 3.', uz: "12 sm bu yarim, nisbat esa 1 : 3.", en: 'Twelve is half, and the ratio is 1 : 3.' },
          { ru: 'Частей 4, одна часть 6 см, а не 4.', uz: "Qism 4 ta, bitta qism 6 sm, 4 emas.", en: 'There are 4 parts and one part is 6 cm, not 4.' },
        ],
        correct: { ru: 'Верно. Частей 1 + 3 = 4, одна часть 6 см.', uz: "To'g'ri. Qismlar 1 + 3 = 4, bitta qism 6 sm.", en: 'Right. 1 + 3 = 4 parts and one part is 6 cm.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Чем отношение отличается от разности?', uz: 'Nisbat ayirmadan nimasi bilan farq qiladi?', en: 'How does a ratio differ from a difference?' },
        opts: [
          { ru: 'Отношение показывает, во сколько раз', uz: 'Nisbat necha barobar ekanini ko\'rsatadi', en: 'A ratio shows how many times' },
          { ru: 'Отношение показывает, на сколько больше', uz: 'Nisbat nechtaga ko\'p ekanini ko\'rsatadi', en: 'A ratio shows how much more' },
          { ru: 'Ничем не отличается', uz: 'Hech nima bilan farq qilmaydi', en: 'There is no difference' },
          { ru: 'Отношение всегда целое число', uz: 'Nisbat doim butun son', en: 'A ratio is always a whole number' },
        ],
        wrong: [
          null,
          { ru: 'На сколько больше отвечает вычитание.', uz: "Nechtaga ko'p degan savolga ayirish javob beradi.", en: 'How much more is answered by subtraction.' },
          { ru: 'Для 6 и 2 разность 4, а отношение 3. Это разные ответы.', uz: '6 va 2 uchun ayirma 4, nisbat esa 3. Bu har xil javoblar.', en: 'For 6 and 2 the difference is 4 and the ratio is 3. Different answers.' },
          { ru: 'Отношение бывает и дробным: 5 : 2 это два с половиной.', uz: "Nisbat kasr ham bo'lishi mumkin: 5 : 2 bu ikki yarim.", en: 'A ratio can be fractional: 5 : 2 is two and a half.' },
        ],
        correct: { ru: 'Верно. Отношение сравнивает делением, разность вычитанием.', uz: "To'g'ri. Nisbat bo'lish bilan, ayirma esa ayirish bilan solishtiradi.", en: 'Right. A ratio compares by division, a difference by subtraction.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'В отношении 7 : 3 сколько частей приходится на всё целое?', uz: '7 : 3 nisbatda butunga nechta qism to\'g\'ri keladi?', en: 'In the ratio 7 : 3, how many parts make the whole?' },
        opts: ['3', '7', '21', '10'],
        wrong: [
          { ru: 'Это только вторая доля.', uz: 'Bu faqat ikkinchi ulush.', en: 'That is only the second share.' },
          { ru: 'Это только первая доля.', uz: 'Bu faqat birinchi ulush.', en: 'That is only the first share.' },
          { ru: 'Части складывают, а не перемножают.', uz: "Qismlar qo'shiladi, ko'paytirilmaydi.", en: 'The parts are added, not multiplied.' },
          null,
        ],
        correct: { ru: 'Верно. 7 + 3 = 10 частей.', uz: "To'g'ri. 7 + 3 = 10 qism.", en: 'Right. 7 + 3 = 10 parts.' },
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
      ru: 'Пифагор заметил, что музыка держится на отношениях длин струн. Если зажать струну так, чтобы длины относились как 2 к 1, получится октава, а при 3 к 2 — квинта. Красивое созвучие это простое отношение.',
      uz: "Pifagor musiqa tor uzunliklari nisbatiga tayanishini payqagan. Torni uzunliklar 2 ning 1 ga nisbatida bo'ladigan qilib bossangiz oktava, 3 ning 2 ga nisbatida esa kvinta chiqadi. Chiroyli hamohanglik bu oddiy nisbat.",
      en: 'Pythagoras noticed that music rests on ratios of string lengths. Stop a string so the lengths are 2 to 1 and you get an octave; 3 to 2 gives a fifth. A beautiful chord is a simple ratio.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Пифагор заметил, что музыка держится на отношениях длин струн. Если длины относятся как два к одному, звучит октава, а если как три к двум, звучит квинта. Красивое созвучие это простое отношение.',
      uz: "Bilasizmi? Pifagor musiqa tor uzunliklari nisbatiga tayanishini payqagan. Uzunliklar ikki ning birga nisbatida bo'lsa oktava, uch ning ikkiga nisbatida bo'lsa kvinta yangraydi. Chiroyli hamohanglik bu oddiy nisbat.",
      en: 'Did you know? Pythagoras noticed that music rests on ratios of string lengths. Lengths of two to one sound an octave, three to two sound a fifth. A beautiful chord is a simple ratio.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Отношения', uz: 'Matematika · Nisbatlar', en: 'Mathematics · Ratios' },
    heading: { ru: 'Отношение', uz: 'Nisbat', en: 'Ratio' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'отношение — это частное двух чисел', uz: "nisbat — ikki sonning bo'linmasi", en: 'a ratio is a quotient of two numbers' },
    brief_2: { ru: 'упрощается как дробь', uz: 'kasr kabi soddalashadi', en: 'it simplifies like a fraction' },
    brief_3: { ru: 'порядок и единицы менять нельзя', uz: "tartib va birliklarni o'zgartirib bo'lmaydi", en: 'order and units must not change' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Отношение', uz: 'Nisbat', en: 'Ratio' },
    memo_a1: { ru: 'во сколько раз одно больше другого', uz: 'biri ikkinchisidan necha barobar katta', en: 'how many times one exceeds the other' },
    memo_q2: { ru: 'Части и целое', uz: 'Qismlar va butun', en: 'Parts and whole' },
    memo_a2: { ru: '2 : 3 значит 5 частей всего', uz: '2 : 3 demak jami 5 qism', en: '2 : 3 means five parts in all' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'путать 2 : 3 и долю 2/3', uz: '2 : 3 ni 2/3 ulush bilan chalkashtirish', en: 'confusing 2 : 3 with the share 2/3' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Отношение двух чисел это их частное. Оно упрощается как дробь, но порядок чисел менять нельзя, а единицы должны совпадать.',
        'Краска: два к трём и четыре к шести это один рецепт, оттенок получится тот же.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Ikki sonning nisbati bu ularning bo'linmasi. U kasr kabi soddalashadi, lekin sonlar tartibini o'zgartirib bo'lmaydi, birliklar esa bir xil bo'lishi kerak.",
        "Bo'yoq: ikki ning uchga va to'rt ning oltiga nisbati bitta retsept, tus o'sha chiqadi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'A ratio of two numbers is their quotient. It simplifies like a fraction, but the order cannot be swapped and the units must match.',
        'The paint: two to three and four to six are one recipe and the shade comes out the same.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Читать отношение', uz: "Usul. Nisbatni o'qish", en: 'Method. Reading a ratio' },
    m1_steps: {
      ru: ['Приведи величины к одним единицам', 'Раздели оба числа на общий делитель', 'Сложи части, если нужна доля от целого'],
      uz: ['Kattaliklarni bir xil birlikka keltiring', "Ikkala sonni umumiy bo'luvchiga bo'ling", "Butundagi ulush kerak bo'lsa, qismlarni qo'shing"],
      en: ['Bring the quantities to the same units', 'Divide both numbers by a common divisor', 'Add the parts if you need a share of the whole'],
    },
    m1_no: {
      ru: 'Отношение 2 : 3 и дробь 2/3 — не одно и то же: во втором случае целое это 3, а не 5.',
      uz: "2 : 3 nisbati va 2/3 kasri bir xil emas: ikkinchisida butun 3, 5 emas.",
      en: 'The ratio 2 : 3 and the fraction 2/3 differ: in the second the whole is 3, not 5.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: изостудия. На хуке вопрос, в итоге ответ.
// ============================================================
const PaintJar = ({ x, y, s = 1, tone = '#7ECBE6', level = 22 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="0" y="0" width="26" height="34" rx="4" fill="#FFFDF7" stroke="#C9A472" strokeWidth="1.6"/>
    <rect x="2" y={34 - level} width="22" height={level - 2} rx="3" fill={tone} opacity="0.85"/>
    <rect x="-2" y="-5" width="30" height="6" rx="2" fill="#C9A472"/>
  </g>
);

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d17wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d17wall)"/>

    {/* Мольберт с холстом: рисунок начат, но зелёного пятна ещё нет */}
    <g>
      <path d="M60 130 L84 44 M132 130 L108 44 M96 130 v-16" stroke="#B08A57" strokeWidth="3"/>
      <rect x="56" y="26" width="80" height="60" rx="2" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <path d="M62 74 h68" stroke="#D2A96F" strokeWidth="4"/>
      <circle cx="120" cy="40" r="7" fill="#F5C77E"/>
      <path d="M64 74 q12 -18 24 0" fill="none" stroke="#C9A472" strokeWidth="2"/>
    </g>

    {/* Полка с банками: синяя и жёлтая стоят рядом */}
    <g>
      <rect x="196" y="86" width="176" height="6" rx="2" fill="#C9A472"/>
      <PaintJar x={204} y={52} tone="#7ECBE6" level={26}/>
      <PaintJar x={240} y={52} tone="#F5C77E" level={30}/>
      <PaintJar x={276} y={52} tone="#D9603F" level={18}/>
      <PaintJar x={312} y={52} tone="#8FBF7F" level={10}/>
      <PaintJar x={348} y={52} tone="#B98AD6" level={22}/>
    </g>

    {/* Мерные стаканчики: 2 синих и 3 жёлтых — рецепт виден, итог нет */}
    <g>
      {[0, 1].map((i) => (
        <g key={'b' + i}>
          <path d={`M${206 + i * 22} 104 h16 l-2 20 h-12 Z`} fill="#DCEDF5" stroke="#019ACB"/>
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={'y' + i}>
          <path d={`M${262 + i * 22} 104 h16 l-2 20 h-12 Z`} fill="#FBF3D6" stroke="#C99B3A"/>
        </g>
      ))}
    </g>

    {/* Дети и палитра: на палитре пока пусто */}
    <Person x={166} ground={134} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={378} ground={134} head={12} shirt="#F5C77E" hair="#5A4636"/>
    <g className="d17-brush">
      <path d="M150 116 l16 -14" stroke="#B08A57" strokeWidth="3" strokeLinecap="round"/>
      <path d="M164 100 l6 -6" stroke="#8FBF7F" strokeWidth="5" strokeLinecap="round"/>
    </g>

    <rect x="0" y="130" width="400" height="24" fill="#D2A96F"/>
    <g>
      <ellipse cx="60" cy="140" rx="30" ry="9" fill="#F1E4CB" stroke="#C9A472"/>
      <circle cx="48" cy="138" r="4" fill="#7ECBE6"/>
      <circle cx="60" cy="142" r="4" fill="#F5C77E"/>
      <circle cx="72" cy="137" r="4" fill="#D9603F"/>
    </g>
  </svg>
);

// Итог: две смеси рядом, цвет одинаковый.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g>
      {[0, 1].map((i) => <rect key={'a' + i} x={30 + i * 26} y="16" width="22" height="26" rx="3" fill="#7ECBE6"/>)}
      {[0, 1, 2].map((i) => <rect key={'b' + i} x={86 + i * 26} y="16" width="22" height="26" rx="3" fill="#F5C77E"/>)}
      {/* Клякса поднята и уменьшена: подпись «2 : 3» в 88-й строке налезала на
          её низ (QA-прогон 2026-08-19, замер: наложение 12 px). Высота кадра
          финала общая для класса, поэтому подвинулась фигура. */}
      <circle cx="100" cy="58" r="13" fill="#8FBF7F" stroke="#1F7A4D" strokeWidth="2"/>
    </g>
    <text x="200" y="52" textAnchor="middle" fill="#1F7A4D"
      fontFamily="'JetBrains Mono', monospace" fontSize="18" fontWeight="700">=</text>
    <g>
      {[0, 1, 2, 3].map((i) => <rect key={'c' + i} x={232 + i * 15} y="16" width="12" height="26" rx="2" fill="#7ECBE6"/>)}
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={'d' + i} x={296 + i * 15} y="16" width="12" height="26" rx="2" fill="#F5C77E"/>)}
      <circle cx="300" cy="58" r="13" fill="#8FBF7F" stroke="#1F7A4D" strokeWidth="2"/>
    </g>
    <g fill="#8A8883" fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">
      <text x="100" y="88" textAnchor="middle">2 : 3</text>
      <text x="300" y="88" textAnchor="middle">4 : 6</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Мерные стаканчики: a синих и b жёлтых. Модель отношения.
const Mix = ({ a, b, size = 'mid', muted = false }) => (
  <span className={'d17-mix d17-mix-' + size + (muted ? ' d17-mix-muted' : '')}>
    {Array.from({ length: a }, (_, i) => <i key={'a' + i} className="blue"/>)}
    {Array.from({ length: b }, (_, i) => <i key={'b' + i} className="yellow"/>)}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d17-line d17-fade' + (on ? ' d17-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d17-stage">
        <span className="d17-pairline">
          <Frac n={c.from.n} d={c.from.d} size="mid"/>
          <span className={'d17-op' + (step >= 1 ? ' d17-on' : '')}>: 2</span>
          <span className={'d17-fade' + (step >= 2 ? ' d17-on' : '')}>
            <Frac n={c.to.n} d={c.to.d} size="mid"/>
          </span>
        </span>
        <span className={'d17-fade' + (step >= 2 ? ' d17-on' : '')}>
          <Mix a={2} b={3}/>
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

// Ядро: три смеси, третья с переставленным порядком.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d17-stage">
        {c.mixes.map((m, i) => (
          <span key={i} className={'d17-row d17-fade' + (step >= i ? ' d17-on' : '')}>
            <Mix a={m.a} b={m.b} size={m.a + m.b > 6 ? 'sm' : 'mid'}/>
            <b className={'d17-ratio' + (i === 2 ? ' d17-ratio-other' : '')}>{m.a} : {m.b}</b>
            <span className={'d17-dot' + (i === 2 ? ' d17-dot-cold' : '')}/>
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

const WholeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_whole;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d17-stage">
        <Mix a={2} b={3}/>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        <span className={'d17-pairline d17-fade' + (step >= 2 ? ' d17-on' : '')}>
          <Frac n="2" d="5" size="mid"/>
          <span className="d17-op d17-on">и</span>
          <Frac n="3" d="5" size="mid"/>
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
      <div className="frame fade-up delay-1 d17-stage">
        <span className="d17-class">
          {Array.from({ length: 30 }, (_, i) => <i key={i} className={i < 12 ? 'boy' : 'girl'}/>)}
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

// Граница: порядок, деление вместо вычитания, единицы.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d17-stage">
        <span className="d17-pair d17-pair-bad"><Line node={t(c.order_line)} on/></span>
        <span className={'d17-pair d17-pair-warn d17-fade' + (step >= 1 ? ' d17-on' : '')}>
          <Line node={t(c.diff_line)} on/>
        </span>
        <span className={'d17-pair d17-pair-good d17-fade' + (step >= 2 ? ' d17-on' : '')}>
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
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d17-banner fade-up delay-1' + (phase === 'play' ? ' d17-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d17-stage d17-stage-tool">
          {phase === 'demo' ? (
            <>
              <Mix a={done ? 2 : 12} b={done ? 3 : 18} size="sm"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d17-verdict' + (done ? ' d17-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d17-acts fade-up">
            <button className="d17-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d17-btn d17-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
      <div className="d17-stage">
        <span className="d17-row">
          <Mix a={2} b={3}/>
          <b className="d17-ratio">2 : 3</b>
        </span>
        <span className="d17-row">
          <Mix a={4} b={6} size="sm"/>
          <b className="d17-ratio">4 : 6</b>
        </span>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenSimp = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_simp} asideNode={methodAside}/>
);
const ScreenShare = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_share} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: 15 литров краски в отношении 2 : 3.
const TaskFig = ({ idx }) => (
  <div className="d17-task-fig">
    <Mix a={6} b={9} size="sm"/>
    {idx >= 1 && <span className="d17-task-cap">15 l</span>}
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
.d17-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d17-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d17-stage-tool .d17-line { font-size: clamp(12px, 2vw, 16px); }
.d17-row { display: flex; align-items: center; gap: clamp(8px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; }

/* Мерные стаканчики */
.d17-mix { display: inline-flex; gap: 3px; }
.d17-mix i { display: block; border-radius: 2px 2px 5px 5px; border: 1px solid #C9A472; }
.d17-mix-mid i { width: clamp(14px, 3vw, 24px); height: clamp(22px, 4vw, 32px); }
.d17-mix-sm i { width: clamp(9px, 2vw, 16px); height: clamp(17px, 3.2vw, 26px); }
.d17-mix i.blue { background: #7ECBE6; border-color: #019ACB; }
.d17-mix i.yellow { background: #F5C77E; border-color: #C99B3A; }
.d17-mix-muted i { opacity: 0.4; }

.d17-fade { opacity: 0; transition: opacity 420ms linear; }
.d17-on { opacity: 1; }
.d17-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; }
.d17-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 19px); font-weight: 700; color: #C99B3A; background: #FBF3D6; border-radius: 9px; padding: 3px 9px; opacity: 0; transition: opacity 380ms linear; }
.d17-pairline { display: inline-flex; align-items: center; gap: 9px; flex-wrap: wrap; justify-content: center; }
.d17-ratio { font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 25px); font-weight: 700; color: #1F7A4D; }
.d17-ratio-other { color: #C4452B; }

/* Кружок получившегося цвета */
.d17-dot { display: block; width: clamp(20px, 4vw, 30px); height: clamp(20px, 4vw, 30px); border-radius: 50%; background: #8FBF7F; border: 2px solid #1F7A4D; }
.d17-dot-cold { background: #6FA9C9; border-color: #19566E; }

/* Класс из тридцати */
.d17-class { display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px; }
.d17-class i { display: block; width: clamp(11px, 2.4vw, 18px); height: clamp(11px, 2.4vw, 18px); border-radius: 50%; }
.d17-class i.boy { background: #7ECBE6; border: 1px solid #019ACB; }
.d17-class i.girl { background: #F5C77E; border: 1px solid #C99B3A; }

/* Строки экрана границы */
.d17-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d17-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d17-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }
.d17-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }

/* Задача */
.d17-task-fig { display: flex; flex-direction: column; gap: 6px; align-items: center; }
.d17-task-cap { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.3vw, 17px); font-weight: 700; color: #1F7A4D; }

/* Экран 4 */
.d17-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d17-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d17-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d17-verdict-on { opacity: 1; }
.d17-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d17-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d17-btn:disabled { opacity: 0.45; cursor: default; }
.d17-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d17-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: кисть у палитры */
.d17-brush { transform-origin: 150px 116px; animation: d17Brush 4200ms ease-in-out infinite; }
@keyframes d17Brush { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(7deg); } }
@media (prefers-reduced-motion: reduce) { .d17-brush { animation: none; } }

@media (max-width: 639.98px) {
  .d17-mix-mid i { width: 13px; height: 20px; }
  .d17-mix-sm i { width: 8px; height: 16px; }
  .d17-class i { width: 10px; height: 10px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function RatioLesson({
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
    ScreenRule, ScreenSimp, ScreenShare, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
