// ============================================================
// 6 КЛАСС, УРОК 11 «Умножение обыкновенных дробей»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Сложение и вычитание требовали общей разметки. Умножение устроено иначе:
// это «часть от части», и модель у него своя — прямоугольник, разрезанный
// в двух направлениях. Сокращение из урока 8 работает ДО умножения.
//
// Сцена — школьная теплица: грядка, поделённая на полосы.
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
  lessonId: 'grade6-11',
  lessonTitle: {
    ru: 'Умножение обыкновенных дробей',
    uz: "Oddiy kasrlarni ko'paytirish",
    en: 'Multiplying fractions',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 issiqxona: yarmining 2/3 qismi
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 kasrni songa ko'paytirish
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 qismning qismi = to'rtburchak
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: surat suratga, maxraj maxrajga
  { id: 's_pre',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 ko'paytirishdan OLDIN qisqartirish
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 5/6 * 3/10
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: ko'paytma kichrayadi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_mul',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 ko'paytirish x3
  { id: 's_part',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 sonning kasr qismi x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: 1 dan katta yoki kichik
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: issiqxona
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Морковь в теплице', uz: 'Issiqxonadagi sabzi', en: 'Carrots in the greenhouse' },
    lead: {
      ru: 'Азизу отдали половину грядки. На 2/3 своей половины он посадил морковь.',
      uz: "Azizga pushtaning yarmi berildi. O'z yarmining 2/3 qismiga sabzi ekdi.",
      en: 'Aziz got half of the bed. He planted carrots on 2/3 of his half.',
    },
    voice_a: { ru: 'Азиз: морковь заняла 2/3 грядки.', uz: "Aziz: sabzi pushtaning 2/3 qismini egalladi.", en: 'Aziz: carrots take 2/3 of the bed.' },
    voice_b: { ru: 'Дилноза: нет, всей грядки меньше.', uz: "Dilnoza: yo'q, butun pushtadan kamroq.", en: 'Dilnoza: no, less of the whole bed.' },
    ask: { ru: 'Какую часть всей грядки заняла морковь?', uz: 'Sabzi butun pushtaning qaysi qismini egalladi?', en: 'What part of the whole bed do the carrots take?' },
    options: [
      { ru: '2/3 грядки', uz: "Pushtaning 2/3 qismi", en: '2/3 of the bed' },
      { ru: '1/3 грядки', uz: "Pushtaning 1/3 qismi", en: '1/3 of the bed' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В школьной теплице Азизу отдали половину грядки. На двух третьих своей половины он посадил морковь.',
          'Азиз считает, что морковь заняла две третьих грядки, а Дилноза что меньше. Какую часть всей грядки заняла морковь? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab issiqxonasida Azizga pushtaning yarmi berildi. U o'z yarmining ikki uchdan qismiga sabzi ekdi.",
          "Aziz sabzi pushtaning ikki uchdan qismini egalladi deb hisoblaydi, Dilnoza esa kamroq deydi. Sabzi butun pushtaning qaysi qismini egalladi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'In the school greenhouse Aziz got half of the bed. He planted carrots on two thirds of his half.',
          'Aziz thinks the carrots take two thirds of the bed, Dilnoza says less. What part of the whole bed do they take? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Дробь плюс дробь много раз', uz: 'Kasrni bir necha marta olish', en: 'Taking a fraction several times' },
    lines: [
      { ru: '1/4 + 1/4 + 1/4 = 3/4', uz: '1/4 + 1/4 + 1/4 = 3/4', en: '1/4 + 1/4 + 1/4 = 3/4' },
      { ru: '3 · 1/4 = 3/4', uz: '3 · 1/4 = 3/4', en: '3 · 1/4 = 3/4' },
    ],
    done: {
      ru: 'Умножение на натуральное число — это повтор. Числитель растёт, знаменатель остаётся.',
      uz: "Natural songa ko'paytirish takrorlash demak. Surat o'sadi, maxraj esa qoladi.",
      en: 'Multiplying by a whole number is repetition. The numerator grows, the denominator stays.',
    },
    audio: {
      ru: [
        'Вспомним, что такое умножение. Взять три раза по одной четвёртой это одна четвёртая плюс одна четвёртая плюс одна четвёртая.',
        'Получается три четвёртых. То же самое записывают короче: три умножить на одну четвёртую.',
        'Числитель вырос втрое, знаменатель остался прежним. Сегодня разберём случай посложнее: когда на дробь умножают дробь.',
      ],
      uz: [
        "Ko'paytirish nima ekanini eslaymiz. Bir to'rtdandan uch marta olish bu bir to'rtdan qo'shuv bir to'rtdan qo'shuv bir to'rtdan.",
        "Uch to'rtdan chiqadi. Xuddi shu narsa qisqaroq yoziladi: uch karra bir to'rtdan.",
        "Surat uch barobar o'sdi, maxraj o'zgarmadi. Bugun murakkabroq holni ko'ramiz: kasrni kasrga ko'paytirishni.",
      ],
      en: [
        'Let us recall what multiplication is. Taking one quarter three times is one quarter plus one quarter plus one quarter.',
        'That gives three quarters. The same thing is written shorter: three times one quarter.',
        'The numerator tripled, the denominator stayed. Today we take the harder case: a fraction times a fraction.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Часть от части', uz: 'Qismning qismi', en: 'A part of a part' },
    rows: 2,
    cols: 3,
    take_rows: 1,
    take_cols: 2,
    result: { n: 2, d: 6 },
    short: { n: 1, d: 3 },
    done: {
      ru: 'Грядку разрезали поперёк на 2 и вдоль на 3: вышло 6 клеток, морковь заняла 2. Это 2/6, то есть 1/3 всей грядки. Права была Дилноза.',
      uz: "Pushtani ko'ndalangiga 2 ga, bo'yiga 3 ga bo'ldik: 6 katak chiqdi, sabzi 2 tasini egalladi. Bu 2/6, ya'ni butun pushtaning 1/3 qismi. Dilnoza haq edi.",
      en: 'The bed was cut into 2 across and 3 along: 6 cells, and the carrots take 2. That is 2/6, or 1/3 of the whole bed. Dilnoza was right.',
    },
    audio: {
      ru: [
        'Нарисуем грядку прямоугольником. Половина Азиза это верхняя полоса из двух.',
        'Теперь режем грядку вдоль на три части и берём две из них. Клетки пересеклись, и всего их стало шесть.',
        'Морковь заняла две клетки из шести. Две шестых это одна третья. Значит на всей грядке моркови треть, и права была Дилноза.',
      ],
      uz: [
        "Pushtani to'rtburchak qilib chizamiz. Azizning yarmi bu ikkitadan yuqoridagi yo'l.",
        "Endi pushtani bo'yiga uchga bo'lamiz va ikkitasini olamiz. Kataklar kesishdi va jami oltita bo'ldi.",
        "Sabzi oltidan ikkita katakni egalladi. Ikki oltidan bu bir uchdan. Demak butun pushtada sabzi uchdan bir, Dilnoza haq edi.",
      ],
      en: [
        'Draw the bed as a rectangle. Aziz has the upper of two strips.',
        'Now cut the bed along into three parts and take two of them. The cuts crossed and there are six cells in total.',
        'The carrots take two cells out of six. Two sixths is one third. So a third of the whole bed is carrots and Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Числитель на числитель', uz: 'Surat suratga, maxraj maxrajga', en: 'Numerators, then denominators' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_a: { n: 2, d: 3 },
    demo_b: { n: 3, d: 5 },
    demo_res: { n: 6, d: 15 },
    demo_short: { n: 2, d: 5 },
    demo_lines: [
      { ru: '2/3 · 3/5', uz: '2/3 · 3/5', en: '2/3 · 3/5' },
      { ru: '2 · 3 = 6 и 3 · 5 = 15', uz: '2 · 3 = 6 va 3 · 5 = 15', en: '2 · 3 = 6 and 3 · 5 = 15' },
      { ru: '6/15 = 2/5 после сокращения на 3', uz: "6/15 = 2/5, 3 ga qisqartirilgach", en: '6/15 = 2/5 after reducing by 3' },
    ],
    demo_note: {
      ru: 'Общий знаменатель здесь не нужен: перемножаем числители, перемножаем знаменатели, ответ сокращаем.',
      uz: "Bu yerda umumiy maxraj kerak emas: suratlarni ko'paytiramiz, maxrajlarni ko'paytiramiz, javobni qisqartiramiz.",
      en: 'No common denominator is needed: multiply the numerators, multiply the denominators, reduce the answer.',
    },
    play_ask: { ru: 'Сколько будет 3/4 · 2/5?', uz: '3/4 · 2/5 nechaga teng?', en: 'What is 3/4 · 2/5?' },
    play_opts: ['5/9', '3/10', '6/9'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. 3 · 2 = 6 и 4 · 5 = 20, а 6/20 сокращается на 2 до 3/10.',
      uz: "To'g'ri. 3 · 2 = 6 va 4 · 5 = 20, 6/20 esa 2 ga qisqarib 3/10 bo'ladi.",
      en: 'Right. 3 · 2 = 6 and 4 · 5 = 20, and 6/20 reduces by 2 to 3/10.',
    },
    play_wrong: [
      { ru: 'Это сложение числителей и знаменателей, а здесь умножение.', uz: "Bu surat va maxrajni qo'shish, bu yerda esa ko'paytirish.", en: 'That is adding numerators and denominators, but this is multiplication.' },
      null,
      { ru: 'Знаменатели тоже перемножаются: 4 · 5 = 20, а не 9.', uz: "Maxrajlar ham ko'paytiriladi: 4 · 5 = 20, 9 emas.", en: 'Denominators multiply too: 4 · 5 = 20, not 9.' },
    ],
    audio: {
      intro: {
        ru: 'Правило простое. Числитель умножаем на числитель, знаменатель на знаменатель. Общий знаменатель тут не нужен. Покажу на двух третьих и трёх пятых.',
        uz: "Qoida oddiy. Suratni suratga, maxrajni maxrajga ko'paytiramiz. Bu yerda umumiy maxraj kerak emas. Ikki uchdan va uch beshdan misolida ko'rsataman.",
        en: 'The rule is simple. Multiply numerator by numerator and denominator by denominator. No common denominator here. I will show it on two thirds and three fifths.',
      },
      demo: {
        ru: 'Два умножить на три шесть, три умножить на пять пятнадцать. Шесть пятнадцатых сокращаются на три и дают две пятых.',
        uz: "Ikki karra uch olti, uch karra besh o'n besh. Olti o'n beshdan uchga qisqarib ikki beshdan beradi.",
        en: 'Two times three is six, three times five is fifteen. Six fifteenths reduces by three to two fifths.',
      },
      play: {
        ru: 'Теперь ваша очередь. Сколько будет три четвёртых умножить на две пятых?',
        uz: "Endi sizning navbatingiz. Uch to'rtdan karra ikki beshdan nechaga teng?",
        en: 'Now it is your turn. What is three quarters times two fifths?',
      },
      ok: {
        ru: 'Верно. Шесть двадцатых сокращаются до трёх десятых.',
        uz: "To'g'ri. Olti yigirmadan uch o'ndangacha qisqaradi.",
        en: 'Right. Six twentieths reduces to three tenths.',
      },
      wrong: {
        ru: 'Перемножьте отдельно числители и отдельно знаменатели, а потом сократите.',
        uz: "Suratlarni alohida, maxrajlarni alohida ko'paytiring, keyin qisqartiring.",
        en: 'Multiply the numerators and the denominators separately, then reduce.',
      },
    },
  },

  s_pre: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Сокращать удобнее заранее', uz: 'Oldindan qisqartirish qulayroq', en: 'Reducing before is easier' },
    lines: [
      { ru: '4/9 · 3/8', uz: '4/9 · 3/8', en: '4/9 · 3/8' },
      { ru: '4 и 8 делим на 4, 3 и 9 делим на 3', uz: "4 va 8 ni 4 ga, 3 va 9 ni 3 ga bo'lamiz", en: 'Divide 4 and 8 by 4, and 3 and 9 by 3' },
      { ru: '1/3 · 1/2 = 1/6', uz: '1/3 · 1/2 = 1/6', en: '1/3 · 1/2 = 1/6' },
    ],
    done: {
      ru: 'Сокращать можно крест-накрест: числитель одной дроби со знаменателем другой. Числа остаются мелкими, и ошибиться труднее.',
      uz: "Qisqartirishni krestasiga qilish mumkin: bir kasrning surati bilan boshqasining maxrajini. Sonlar kichik qoladi, xato qilish qiyinlashadi.",
      en: 'You may reduce crosswise: one fraction’s numerator against the other’s denominator. The numbers stay small and mistakes get harder.',
    },
    audio: {
      ru: [
        'Есть приём, который экономит силы. Возьмём четыре девятых умножить на три восьмых.',
        'Если перемножить сразу, получится двенадцать семьдесят вторых, и это придётся долго сокращать. Вместо этого сокращаем заранее.',
        'Четыре и восемь делятся на четыре, три и девять делятся на три. Остаётся одна третья умножить на одну вторую, то есть одна шестая. Ответ тот же, а числа мелкие.',
      ],
      uz: [
        "Kuchni tejaydigan usul bor. To'rt to'qqizdanni uch sakkizdanga ko'paytiramiz.",
        "Agar birdaniga ko'paytirsak, o'n ikki yetmish ikkidan chiqadi va uni uzoq qisqartirishga to'g'ri keladi. Buning o'rniga oldindan qisqartiramiz.",
        "To'rt va sakkiz to'rtga, uch va to'qqiz uchga bo'linadi. Bir uchdan karra bir ikkidan qoladi, ya'ni bir oltidan. Javob o'sha, sonlar esa kichik.",
      ],
      en: [
        'There is a trick that saves effort. Take four ninths times three eighths.',
        'Multiplying straight away gives twelve seventy seconds, which then takes long to reduce. Instead we reduce beforehand.',
        'Four and eight divide by four, three and nine divide by three. One third times one half is left, that is one sixth. Same answer, smaller numbers.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Посчитаем 5/6 · 3/10', uz: '5/6 · 3/10 ni hisoblaymiz', en: 'Let us compute 5/6 · 3/10' },
    lead: { ru: 'Сначала ищем, что можно сократить крест-накрест.', uz: "Avval krestasiga nimani qisqartirish mumkinligini qidiramiz.", en: 'First look for crosswise reductions.' },
    steps: [
      { ru: '5 и 10 делим на 5', uz: "5 va 10 ni 5 ga bo'lamiz", en: 'Divide 5 and 10 by 5' },
      { ru: '3 и 6 делим на 3', uz: "3 va 6 ni 3 ga bo'lamiz", en: 'Divide 3 and 6 by 3' },
      { ru: '1/2 · 1/2 = 1/4', uz: '1/2 · 1/2 = 1/4', en: '1/2 · 1/2 = 1/4' },
    ],
    done: {
      ru: 'Ответ 1/4. Если перемножить сразу, вышло бы 15/60 — то же самое, но сокращать дольше.',
      uz: "Javob 1/4. Birdaniga ko'paytirsak 15/60 chiqardi — o'sha son, lekin qisqartirish uzoqroq.",
      en: 'The answer is 1/4. Multiplying straight away gives 15/60: the same number, but slower to reduce.',
    },
    audio: {
      ru: [
        'Решаем вместе. Пять шестых умножить на три десятых. Ищем, что сокращается.',
        'Пять из первого числителя и десять из второго знаменателя делятся на пять. Остаются один и два.',
        'Три из второго числителя и шесть из первого знаменателя делятся на три. Остаётся одна вторая умножить на одну вторую, то есть одна четвёртая.',
      ],
      uz: [
        "Birga yechamiz. Besh oltidanni uch o'ndanga ko'paytiramiz. Nima qisqarishini qidiramiz.",
        "Birinchi suratdagi besh va ikkinchi maxrajdagi o'n beshga bo'linadi. Bir va ikki qoladi.",
        "Ikkinchi suratdagi uch va birinchi maxrajdagi olti uchga bo'linadi. Bir ikkidan karra bir ikkidan qoladi, ya'ni bir to'rtdan.",
      ],
      en: [
        'Let us solve it together. Five sixths times three tenths. Look for what reduces.',
        'Five in the first numerator and ten in the second denominator divide by five. One and two remain.',
        'Three in the second numerator and six in the first denominator divide by three. One half times one half is left, that is one quarter.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Умножение не всегда увеличивает', uz: "Ko'paytirish har doim kattalashtirmaydi", en: 'Multiplying does not always increase' },
    lines: [
      { ru: '6 · 3 = 18, стало больше', uz: '6 · 3 = 18, kattalashdi', en: '6 · 3 = 18, it grew' },
      { ru: '1/2 · 1/3 = 1/6, стало меньше', uz: '1/2 · 1/3 = 1/6, kichraydi', en: '1/2 · 1/3 = 1/6, it shrank' },
      { ru: '5 · 2/7 = 10/7, больше пяти седьмых', uz: '5 · 2/7 = 10/7, besh yettidandan katta', en: '5 · 2/7 = 10/7, more than five sevenths' },
    ],
    done: {
      ru: 'Умножая на дробь меньше единицы, мы берём часть — результат уменьшается. Умножая на число больше единицы, увеличиваем.',
      uz: "Birdan kichik kasrga ko'paytirganda qismini olamiz — natija kichrayadi. Birdan katta songa ko'paytirsak, kattalashadi.",
      en: 'Multiplying by a fraction less than one takes a part, so the result shrinks. Multiplying by more than one makes it grow.',
    },
    audio: {
      ru: [
        'В начальной школе умножение всегда увеличивало число. С дробями это уже не так.',
        'Одна вторая умножить на одну третью это одна шестая. Результат меньше обоих множителей, потому что мы взяли часть от части.',
        'А если множитель больше единицы, число растёт. Пять умножить на две седьмых это десять седьмых, и это больше двух седьмых. Смотрите на множитель, а не на само действие.',
      ],
      uz: [
        "Boshlang'ich sinfda ko'paytirish sonni doim kattalashtirardi. Kasrlarda bunday emas.",
        "Bir ikkidan karra bir uchdan bu bir oltidan. Natija ikkala ko'paytuvchidan ham kichik, chunki biz qismning qismini oldik.",
        "Ko'paytuvchi birdan katta bo'lsa esa son o'sadi. Besh karra ikki yettidan bu o'n yettidan va u ikki yettidandan katta. Amalga emas, ko'paytuvchiga qarang.",
      ],
      en: [
        'In primary school multiplying always made a number bigger. With fractions that is no longer true.',
        'One half times one third is one sixth. The result is smaller than both factors because we took a part of a part.',
        'If the factor is greater than one, the number grows. Five times two sevenths is ten sevenths, more than two sevenths. Look at the factor, not at the operation.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как умножать дроби', uz: "Kasrlar qanday ko'paytiriladi", en: 'How to multiply fractions' },
    rule_1: {
      ru: 'Числитель умножаем на числитель, знаменатель на знаменатель. Общий знаменатель не нужен. Сокращать удобнее до умножения, крест-накрест.',
      uz: "Suratni suratga, maxrajni maxrajga ko'paytiramiz. Umumiy maxraj kerak emas. Qisqartirishni ko'paytirishdan oldin, krestasiga qilish qulayroq.",
      en: 'Multiply numerator by numerator and denominator by denominator. No common denominator is needed. Reducing crosswise before multiplying is easier.',
    },
    rule_2: {
      ru: 'Умножение на дробь меньше 1 уменьшает число: это часть от части. Теплица: 1/2 · 2/3 = 1/3 грядки, права была Дилноза.',
      uz: "1 dan kichik kasrga ko'paytirish sonni kichraytiradi: bu qismning qismi. Issiqxona: 1/2 · 2/3 = pushtaning 1/3 qismi, Dilnoza haq edi.",
      en: 'Multiplying by a fraction less than 1 shrinks the number: it is a part of a part. The greenhouse: 1/2 · 2/3 = 1/3 of the bed, Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Числитель умножаем на числитель, знаменатель на знаменатель, общий знаменатель при этом не нужен. Сокращать удобнее заранее, крест-накрест. И помните: умножение на дробь меньше единицы уменьшает число, потому что мы берём часть от части. Вернёмся к теплице. Одна вторая умножить на две третьих это одна третья грядки. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Suratni suratga, maxrajni maxrajga ko'paytiramiz, umumiy maxraj esa kerak emas. Qisqartirishni oldindan, krestasiga qilish qulayroq. Va esda tuting: birdan kichik kasrga ko'paytirish sonni kichraytiradi, chunki biz qismning qismini olamiz. Issiqxonaga qaytamiz. Bir ikkidan karra ikki uchdan bu pushtaning bir uchdan qismi. Dilnoza haq edi.",
      en: 'Let us remember the rule. Multiply numerator by numerator and denominator by denominator, with no common denominator needed. Reducing crosswise beforehand is easier. And remember: multiplying by a fraction less than one shrinks the number, because we take a part of a part. Back to the greenhouse. One half times two thirds is one third of the bed. Dilnoza was right.',
    },
  },

  s_mul: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Умножение дробей', uz: "Kasrlarni ko'paytirish", en: 'Multiplying fractions' },
    lead: { ru: 'Сначала посмотри, что сокращается.', uz: 'Avval nima qisqarishiga qarang.', en: 'First look for what reduces.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '1/2 · 4/5', uz: '1/2 · 4/5', en: '1/2 · 4/5' },
        opts: ['2/5', '5/7', '4/10'],
        correct: 0,
        ok: { ru: 'Верно. 4 и 2 сокращаются: остаётся 1 · 2 и 1 · 5, то есть 2/5.', uz: "To'g'ri. 4 va 2 qisqaradi: 1 · 2 va 1 · 5 qoladi, ya'ni 2/5.", en: 'Right. 4 and 2 reduce, leaving 1 · 2 over 1 · 5, that is 2/5.' },
        wrong: [
          null,
          { ru: 'Это сложение числителей и знаменателей.', uz: "Bu surat va maxrajni qo'shish.", en: 'That is adding numerators and denominators.' },
          { ru: 'Почти: 4/10 надо сократить на 2 и получить 2/5.', uz: "Deyarli: 4/10 ni 2 ga qisqartirib 2/5 olish kerak.", en: 'Almost: 4/10 should reduce by 2 to 2/5.' },
        ],
      },
      {
        q: { ru: '2/3 · 3/4', uz: '2/3 · 3/4', en: '2/3 · 3/4' },
        opts: ['5/7', '1/2', '6/7'],
        correct: 1,
        ok: { ru: 'Верно. 3 сокращается с 3, 2 с 4: остаётся 1/2.', uz: "To'g'ri. 3 bilan 3, 2 bilan 4 qisqaradi: 1/2 qoladi.", en: 'Right. 3 cancels 3, and 2 cancels into 4, leaving 1/2.' },
        wrong: [
          { ru: 'Числители и знаменатели здесь сложены, а не умножены.', uz: "Bu yerda surat va maxrajlar qo'shilgan, ko'paytirilmagan.", en: 'Here they were added, not multiplied.' },
          null,
          { ru: 'Знаменатели умножаются: 3 · 4 = 12, а не 7.', uz: "Maxrajlar ko'paytiriladi: 3 · 4 = 12, 7 emas.", en: 'Denominators multiply: 3 · 4 = 12, not 7.' },
        ],
      },
      {
        q: { ru: '3 · 2/9', uz: '3 · 2/9', en: '3 · 2/9' },
        opts: ['2/3', '6/27', '5/9'],
        correct: 0,
        ok: { ru: 'Верно. 3 · 2 = 6, знаменатель 9, а 6/9 сокращается до 2/3.', uz: "To'g'ri. 3 · 2 = 6, maxraj 9, 6/9 esa 2/3 gacha qisqaradi.", en: 'Right. 3 · 2 = 6 over 9, and 6/9 reduces to 2/3.' },
        wrong: [
          null,
          { ru: 'Знаменатель на целое число не умножают: он остаётся 9.', uz: "Maxraj butun songa ko'paytirilmaydi: u 9 bo'lib qoladi.", en: 'The denominator is not multiplied by the whole number: it stays 9.' },
          { ru: 'Это прибавление тройки к числителю, а нужно умножение.', uz: "Bu suratga uchni qo'shish, kerak bo'lgani ko'paytirish.", en: 'That adds three to the numerator, but we need multiplication.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на умножение. Общий знаменатель не нужен, зато полезно сокращать заранее.',
        uz: "Ko'paytirish mashqi. Umumiy maxraj kerak emas, oldindan qisqartirish esa foydali.",
        en: 'Multiplication practice. No common denominator, but reducing beforehand helps.',
      },
    },
  },

  s_part: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Часть от числа', uz: 'Sonning kasr qismi', en: 'A fraction of a number' },
    lead: { ru: 'Найти часть от числа значит умножить число на дробь.', uz: "Sonning qismini topish uni kasrga ko'paytirish demakdir.", en: 'Finding a part of a number means multiplying it by the fraction.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '2/5 от 30', uz: '30 ning 2/5 qismi', en: '2/5 of 30' },
        opts: ['6', '12', '15'],
        correct: 1,
        ok: { ru: 'Верно. 30 : 5 = 6, и 6 · 2 = 12.', uz: "To'g'ri. 30 : 5 = 6, va 6 · 2 = 12.", en: 'Right. 30 ÷ 5 = 6 and 6 · 2 = 12.' },
        wrong: [
          { ru: '6 — это только одна пятая, а нужно две.', uz: '6 bu faqat bir beshdan, kerak bo\'lgani ikkita.', en: 'Six is only one fifth, and we need two.' },
          null,
          { ru: '15 — это половина от 30.', uz: '15 bu 30 ning yarmi.', en: 'Fifteen is half of 30.' },
        ],
      },
      {
        q: { ru: '3/4 от 20', uz: '20 ning 3/4 qismi', en: '3/4 of 20' },
        opts: ['15', '5', '16'],
        correct: 0,
        ok: { ru: 'Верно. 20 : 4 = 5, и 5 · 3 = 15.', uz: "To'g'ri. 20 : 4 = 5, va 5 · 3 = 15.", en: 'Right. 20 ÷ 4 = 5 and 5 · 3 = 15.' },
        wrong: [
          null,
          { ru: '5 — это одна четвёртая, а нужно три.', uz: "5 bu bir to'rtdan, kerak bo'lgani uchta.", en: 'Five is one quarter, and we need three.' },
          { ru: '16 — это 4/5 от 20, а не 3/4.', uz: "16 bu 20 ning 4/5 qismi, 3/4 emas.", en: 'Sixteen is 4/5 of 20, not 3/4.' },
        ],
      },
      {
        q: { ru: '1/3 от 3/4', uz: "3/4 ning 1/3 qismi", en: '1/3 of 3/4' },
        opts: ['1/4', '3/7', '1/12'],
        correct: 0,
        ok: { ru: 'Верно. 1/3 · 3/4: тройки сокращаются, остаётся 1/4.', uz: "To'g'ri. 1/3 · 3/4: uchlar qisqaradi, 1/4 qoladi.", en: 'Right. 1/3 · 3/4: the threes cancel, leaving 1/4.' },
        wrong: [
          null,
          { ru: 'Числители и знаменатели здесь сложены.', uz: "Bu yerda surat va maxrajlar qo'shilgan.", en: 'These were added, not multiplied.' },
          { ru: '1/12 вышло бы от 1/3 · 1/4.', uz: "1/12 soni 1/3 · 1/4 dan chiqardi.", en: 'One twelfth would come from 1/3 · 1/4.' },
        ],
      },
      {
        q: { ru: '5/6 от 18', uz: "18 ning 5/6 qismi", en: '5/6 of 18' },
        opts: ['3', '15', '12'],
        correct: 1,
        ok: { ru: 'Верно. 18 : 6 = 3, и 3 · 5 = 15.', uz: "To'g'ri. 18 : 6 = 3, va 3 · 5 = 15.", en: 'Right. 18 ÷ 6 = 3 and 3 · 5 = 15.' },
        wrong: [
          { ru: '3 — это одна шестая от 18.', uz: '3 bu 18 ning bir oltidan qismi.', en: 'Three is one sixth of 18.' },
          null,
          { ru: '12 — это 4/6, то есть две трети.', uz: "12 bu 4/6, ya'ni uchdan ikki.", en: 'Twelve is 4/6, that is two thirds.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Ищем часть от числа. Удобно сначала разделить на знаменатель, потом умножить на числитель.',
        uz: "Sonning qismini qidiramiz. Avval maxrajga bo'lib, keyin suratga ko'paytirish qulay.",
        en: 'Find a part of a number. It helps to divide by the denominator first and then multiply by the numerator.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Больше или меньше единицы', uz: 'Birdan katta yoki kichik', en: 'More or less than one' },
    lead: { ru: 'Смотри на множители: каждый меньше 1 — результат тоже меньше.', uz: "Ko'paytuvchilarga qarang: har biri 1 dan kichik bo'lsa, natija ham kichik.", en: 'Look at the factors: if each is less than 1, the result is too.' },
    bin_a: { ru: 'Больше 1', uz: '1 dan katta', en: 'More than 1' },
    bin_b: { ru: 'Меньше 1', uz: '1 dan kichik', en: 'Less than 1' },
    cards: [
      { label: '2/3 · 1/2', bin: 'b' },
      { label: '5 · 3/4', bin: 'a' },
      { label: '4/5 · 5/8', bin: 'b' },
      { label: '3 · 2/3', bin: 'a' },
      { label: '7/8 · 1/2', bin: 'b' },
      { label: '6 · 1/2', bin: 'a' },
    ],
    hint: {
      ru: 'Если оба множителя меньше единицы, произведение точно меньше единицы.',
      uz: "Ikkala ko'paytuvchi ham birdan kichik bo'lsa, ko'paytma aniq birdan kichik.",
      en: 'If both factors are less than one, the product is certainly less than one.',
    },
    correct_text: {
      ru: 'Верно. Целое число на дробь может дать и больше единицы, а две правильные дроби всегда дают меньше.',
      uz: "To'g'ri. Butun sonni kasrga ko'paytirsak birdan katta chiqishi mumkin, ikkita to'g'ri kasr esa doim kichik beradi.",
      en: 'Right. A whole times a fraction can exceed one, while two proper fractions always give less.',
    },
    audio: {
      intro: {
        ru: 'Разложите произведения по двум корзинам. Считать до конца не обязательно, смотрите на множители.',
        uz: "Ko'paytmalarni ikki savatga ajrating. Oxirigacha hisoblash shart emas, ko'paytuvchilarga qarang.",
        en: 'Sort the products into two baskets. You need not compute them, just look at the factors.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посмотри, есть ли множитель больше единицы.', uz: "Bu yerga emas. Birdan katta ko'paytuvchi bor-yo'qligiga qarang.", en: 'Not here. Check whether any factor is greater than one.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: 2/3 · 1/4 = 8/12. Где ошибка?', uz: 'Aziz: 2/3 · 1/4 = 8/12. Xato qayerda?', en: 'Aziz: 2/3 · 1/4 = 8/12. Where is the mistake?' },
        opts: [
          { ru: 'Привёл к общему знаменателю, как при сложении', uz: "Qo'shishdagidek umumiy maxrajga keltirdi", en: 'He used a common denominator as if adding' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: 'Забыл сократить', uz: 'Qisqartirishni unutdi', en: 'He forgot to reduce' },
        ],
        correct: 0,
        ok: { ru: 'Верно. При умножении общий знаменатель не нужен: 2 · 1 = 2 и 3 · 4 = 12, ответ 2/12 = 1/6.', uz: "To'g'ri. Ko'paytirishda umumiy maxraj kerak emas: 2 · 1 = 2 va 3 · 4 = 12, javob 2/12 = 1/6.", en: 'Right. Multiplication needs no common denominator: 2 · 1 = 2 and 3 · 4 = 12, so 2/12 = 1/6.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: 8/12 больше 2/3 · 1/4 в несколько раз.', uz: "Xato bor: 8/12 soni 2/3 · 1/4 dan bir necha barobar katta.", en: 'There is a mistake: 8/12 is several times larger than the product.' },
          { ru: 'Дело не в сокращении, а в самом действии.', uz: "Gap qisqartirishda emas, amalning o'zida.", en: 'The issue is not reducing, it is the operation itself.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «1/2 · 1/3 больше, чем 1/2, ведь это умножение». Проверь.', uz: "Dilnoza: «1/2 · 1/3 soni 1/2 dan katta, axir bu ko'paytirish». Tekshiring.", en: 'Dilnoza: “1/2 · 1/3 is more than 1/2, it is multiplication after all.” Check it.' },
        opts: [
          { ru: 'Нет: берём треть от половины, выйдет 1/6', uz: "Yo'q: yarimning uchdan birini olamiz, 1/6 chiqadi", en: 'No: a third of a half gives 1/6' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Верно, но только для правильных дробей', uz: "To'g'ri, lekin faqat to'g'ri kasrlar uchun", en: 'True, but only for proper fractions' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Множитель меньше единицы, значит результат уменьшается.', uz: "To'g'ri. Ko'paytuvchi birdan kichik, demak natija kichrayadi.", en: 'Right. The factor is less than one, so the result shrinks.' },
        wrong: [
          null,
          { ru: '1/6 меньше 1/2: часть от части всегда меньше.', uz: "1/6 soni 1/2 dan kichik: qismning qismi doim kichik.", en: '1/6 is less than 1/2: a part of a part is always smaller.' },
          { ru: 'Наоборот: у правильных дробей результат как раз уменьшается.', uz: "Aksincha: to'g'ri kasrlarda natija aynan kichrayadi.", en: 'The opposite: with proper fractions the result shrinks.' },
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
    title: { ru: 'Грядка и рассада', uz: "Pushta va ko'chat", en: 'The bed and the seedlings' },
    lead: { ru: 'В теплице 24 горшка. Азиз занял 3/4 из них, а на 1/3 своих горшков посадил базилик.', uz: "Issiqxonada 24 tuvak bor. Aziz ularning 3/4 qismini oldi, o'z tuvaklarining 1/3 qismiga rayhon ekdi.", en: 'The greenhouse has 24 pots. Aziz took 3/4 of them and planted basil in 1/3 of his pots.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько горшков занял Азиз?', uz: 'Aziz nechta tuvakni oldi?', en: 'How many pots did Aziz take?' },
        opts: ['18', '6', '12'],
        correct: 0,
        ok: { ru: 'Верно. 24 : 4 = 6, и 6 · 3 = 18.', uz: "To'g'ri. 24 : 4 = 6, va 6 · 3 = 18.", en: 'Right. 24 ÷ 4 = 6 and 6 · 3 = 18.' },
        wrong: [
          null,
          { ru: '6 — это одна четвёртая, а у него три.', uz: "6 bu bir to'rtdan, unda esa uchta.", en: 'Six is one quarter, and he has three.' },
          { ru: '12 — это половина от 24.', uz: '12 bu 24 ning yarmi.', en: 'Twelve is half of 24.' },
        ],
      },
      {
        q: { ru: 'Какую часть всех горшков занял базилик?', uz: 'Rayhon barcha tuvaklarning qaysi qismini egalladi?', en: 'What part of all the pots holds basil?' },
        opts: ['1/4', '1/3', '3/4'],
        correct: 0,
        ok: { ru: 'Верно. 3/4 · 1/3 = 1/4, то есть 6 горшков из 24.', uz: "To'g'ri. 3/4 · 1/3 = 1/4, ya'ni 24 dan 6 tuvak.", en: 'Right. 3/4 · 1/3 = 1/4, that is 6 pots out of 24.' },
        wrong: [
          null,
          { ru: '1/3 — это часть горшков Азиза, а не всех.', uz: "1/3 bu Azizning tuvaklaridan qism, hammasidan emas.", en: 'A third is a part of Aziz’s pots, not of all of them.' },
          { ru: '3/4 — это все горшки Азиза, а базилик только в трети из них.', uz: "3/4 bu Azizning barcha tuvaklari, rayhon esa faqat uchdan birida.", en: '3/4 is all of Aziz’s pots, and basil is only in a third of them.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про теплицу. Двадцать четыре горшка, Азиз занял три четвёртых из них.',
        uz: "Issiqxona haqida masala. Yigirma to'rt tuvak, Aziz ularning uch to'rtdan qismini oldi.",
        en: 'A greenhouse problem. Twenty four pots, and Aziz took three quarters of them.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 8,
        q: { ru: 'Найди 2/3 от 12. Набери ответ.', uz: '12 ning 2/3 qismini toping. Javobni tering.', en: 'Find 2/3 of 12. Type the answer.' },
        hint: { ru: 'Сначала 12 : 3, потом результат умножь на 2.', uz: "Avval 12 : 3, keyin natijani 2 ga ko'paytiring.", en: 'First 12 ÷ 3, then multiply the result by 2.' },
        hint_audio: { ru: 'Сначала двенадцать разделить на три, потом результат умножить на два.', uz: "Avval o'n ikkini uchga bo'ling, keyin natijani ikkiga ko'paytiring.", en: 'First divide twelve by three, then multiply the result by two.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Сколько будет 3/8 · 4/9?', uz: '3/8 · 4/9 nechaga teng?', en: 'What is 3/8 · 4/9?' },
        opts: ['7/17', '1/6', '12/72', '3/4'],
        wrong: [
          { ru: 'Это сложение числителей и знаменателей.', uz: "Bu surat va maxrajni qo'shish.", en: 'That adds numerators and denominators.' },
          null,
          { ru: 'Число верное, но его надо сократить: 12/72 = 1/6.', uz: "Son to'g'ri, lekin qisqartirish kerak: 12/72 = 1/6.", en: 'The number is right but needs reducing: 12/72 = 1/6.' },
          { ru: 'Слишком много: оба множителя меньше единицы.', uz: "Juda ko'p: ikkala ko'paytuvchi ham birdan kichik.", en: 'Too much: both factors are less than one.' },
        ],
        correct: { ru: 'Верно. 3 и 9 сокращаются на 3, 4 и 8 на 4: 1/2 · 1/3 = 1/6.', uz: "To'g'ri. 3 va 9 uchga, 4 va 8 to'rtga qisqaradi: 1/2 · 1/3 = 1/6.", en: 'Right. 3 and 9 reduce by 3, 4 and 8 by 4: 1/2 · 1/3 = 1/6.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Что нужно сделать перед умножением дробей?', uz: "Kasrlarni ko'paytirishdan oldin nima qilish kerak?", en: 'What must you do before multiplying fractions?' },
        opts: [
          { ru: 'Привести к общему знаменателю', uz: 'Umumiy maxrajga keltirish', en: 'Bring them to a common denominator' },
          { ru: 'Сложить знаменатели', uz: "Maxrajlarni qo'shish", en: 'Add the denominators' },
          { ru: 'Посмотреть, что сокращается', uz: 'Nima qisqarishiga qarash', en: 'Look for what reduces' },
          { ru: 'Перевернуть вторую дробь', uz: 'Ikkinchi kasrni ag\'darish', en: 'Flip the second fraction' },
        ],
        wrong: [
          { ru: 'Общий знаменатель нужен для сложения, а не для умножения.', uz: "Umumiy maxraj qo'shish uchun kerak, ko'paytirish uchun emas.", en: 'A common denominator is for addition, not multiplication.' },
          { ru: 'Знаменатели не складывают никогда.', uz: "Maxrajlar hech qachon qo'shilmaydi.", en: 'Denominators are never added.' },
          null,
          { ru: 'Переворачивают дробь при делении, это следующий урок.', uz: "Kasr bo'lishda ag'dariladi, bu keyingi dars.", en: 'Flipping happens in division, that is the next lesson.' },
        ],
        correct: { ru: 'Верно. Сокращение до умножения оставляет числа мелкими.', uz: "To'g'ri. Ko'paytirishdan oldin qisqartirish sonlarni kichik qoldiradi.", en: 'Right. Reducing first keeps the numbers small.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Когда произведение получается меньше первого множителя?', uz: "Ko'paytma qachon birinchi ko'paytuvchidan kichik chiqadi?", en: 'When is a product smaller than the first factor?' },
        opts: [
          { ru: 'Когда второй множитель меньше 1', uz: "Ikkinchi ko'paytuvchi 1 dan kichik bo'lganda", en: 'When the second factor is less than 1' },
          { ru: 'Всегда', uz: 'Har doim', en: 'Always' },
          { ru: 'Когда знаменатели равны', uz: "Maxrajlar teng bo'lganda", en: 'When the denominators match' },
          { ru: 'Никогда', uz: 'Hech qachon', en: 'Never' },
        ],
        wrong: [
          null,
          { ru: 'Не всегда: 5 · 2/7 больше, чем 2/7.', uz: "Har doim emas: 5 · 2/7 soni 2/7 dan katta.", en: 'Not always: 5 · 2/7 is more than 2/7.' },
          { ru: 'Знаменатели тут ни при чём.', uz: 'Maxrajlarning bunga aloqasi yo\'q.', en: 'Denominators have nothing to do with it.' },
          { ru: 'Бывает: 1/2 · 1/3 меньше одной второй.', uz: "Bo'ladi: 1/2 · 1/3 bir ikkidandan kichik.", en: 'It happens: 1/2 · 1/3 is less than one half.' },
        ],
        correct: { ru: 'Верно. Умножая на дробь меньше единицы, мы берём её часть.', uz: "To'g'ri. Birdan kichik kasrga ko'paytirganda uning qismini olamiz.", en: 'Right. Multiplying by a fraction less than one takes a part of it.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'В классе 28 учеников. 3/4 пришли на субботник, из них 1/3 сажали деревья. Сколько сажали деревья?', uz: "Sinfda 28 o'quvchi bor. 3/4 qismi hasharga keldi, ularning 1/3 qismi daraxt ekdi. Nechtasi daraxt ekdi?", en: 'A class of 28. Three quarters came to the clean up day, and a third of them planted trees. How many planted trees?' },
        opts: ['21', '9', '4', '7'],
        wrong: [
          { ru: '21 — это все, кто пришёл, а деревья сажала треть.', uz: "21 bu kelganlarning hammasi, daraxtni esa uchdan biri ekdi.", en: '21 is everyone who came; a third of them planted.' },
          { ru: '9 получилось бы от трети всего класса без учёта 3/4.', uz: "9 soni butun sinfning uchdan biridan chiqardi.", en: 'Nine would be a third of the whole class.' },
          { ru: 'Слишком мало: посчитай 21 разделить на 3.', uz: "Juda kam: 21 ni 3 ga bo'ling.", en: 'Too few: compute 21 divided by 3.' },
          null,
        ],
        correct: { ru: 'Верно. 3/4 · 1/3 = 1/4, а 28 : 4 = 7.', uz: "To'g'ri. 3/4 · 1/3 = 1/4, 28 : 4 = 7.", en: 'Right. 3/4 · 1/3 = 1/4, and 28 ÷ 4 = 7.' },
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
      ru: 'Умножение дробей — это площадь. У прямоугольника со сторонами 3/4 и 2/3 метра площадь равна 1/2 квадратного метра. Поэтому клетчатый прямоугольник и есть честная модель этого действия.',
      uz: "Kasrlarni ko'paytirish bu yuza. Tomonlari 3/4 va 2/3 metr bo'lgan to'rtburchakning yuzasi 1/2 kvadrat metr. Shuning uchun katakli to'rtburchak shu amalning halol modeli.",
      en: 'Multiplying fractions is area. A rectangle with sides 3/4 and 2/3 of a metre has an area of 1/2 square metre. That is why the grid rectangle is an honest model of this operation.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Умножение дробей это площадь. У прямоугольника со сторонами три четвёртых и две третьих метра площадь ровно половина квадратного метра. Поэтому клетчатый прямоугольник и есть честная модель этого действия.',
      uz: "Bilasizmi? Kasrlarni ko'paytirish bu yuza. Tomonlari uch to'rtdan va ikki uchdan metr bo'lgan to'rtburchakning yuzasi aynan yarim kvadrat metr. Shuning uchun katakli to'rtburchak shu amalning halol modeli.",
      en: 'Did you know? Multiplying fractions is area. A rectangle with sides three quarters and two thirds of a metre has an area of exactly half a square metre. That is why the grid rectangle is an honest model.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Дроби', uz: 'Matematika · Kasrlar', en: 'Mathematics · Fractions' },
    heading: { ru: 'Умножение дробей', uz: "Kasrlarni ko'paytirish", en: 'Multiplying fractions' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'числитель на числитель, знаменатель на знаменатель', uz: 'surat suratga, maxraj maxrajga', en: 'numerators together, denominators together' },
    brief_2: { ru: 'общий знаменатель не нужен', uz: 'umumiy maxraj kerak emas', en: 'no common denominator needed' },
    brief_3: { ru: 'сокращать удобнее до умножения', uz: "qisqartirish ko'paytirishdan oldin qulay", en: 'reduce before multiplying' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Модель', uz: 'Model', en: 'Model' },
    memo_a1: { ru: 'часть от части — клетки прямоугольника', uz: "qismning qismi — to'rtburchak kataklari", en: 'a part of a part: rectangle cells' },
    memo_q2: { ru: 'Часть от числа', uz: 'Sonning qismi', en: 'A part of a number' },
    memo_a2: { ru: 'раздели на знаменатель, умножь на числитель', uz: "maxrajga bo'ling, suratga ko'paytiring", en: 'divide by the denominator, multiply by the numerator' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'приводить к общему знаменателю', uz: 'umumiy maxrajga keltirish', en: 'using a common denominator' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'При умножении числитель умножаем на числитель, знаменатель на знаменатель. Общий знаменатель не нужен, а сокращать удобнее заранее.',
        'Теплица: половина грядки, а на двух третьих этой половины морковь. Значит на всей грядке моркови треть.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Ko'paytirishda suratni suratga, maxrajni maxrajga ko'paytiramiz. Umumiy maxraj kerak emas, qisqartirishni esa oldindan qilish qulay.",
        "Issiqxona: pushtaning yarmi, shu yarmining ikki uchdan qismida sabzi. Demak butun pushtada sabzi uchdan bir.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'When multiplying, numerator times numerator and denominator times denominator. No common denominator, and reducing beforehand is easier.',
        'The greenhouse: half a bed, and carrots on two thirds of that half. So a third of the whole bed is carrots.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Перемножить и сократить', uz: "Usul. Ko'paytirish va qisqartirish", en: 'Method. Multiply and reduce' },
    m1_steps: {
      ru: ['Посмотри, что сокращается крест-накрест', 'Перемножь числители и знаменатели', 'Проверь, сократим ли ответ'],
      uz: ["Krestasiga nima qisqarishiga qarang", "Suratlarni va maxrajlarni ko'paytiring", "Javob qisqaradimi, tekshiring"],
      en: ['Look for crosswise reductions', 'Multiply numerators and denominators', 'Check whether the answer reduces'],
    },
    m1_no: {
      ru: 'Общий знаменатель здесь не нужен: он нужен только для сложения и вычитания.',
      uz: "Bu yerda umumiy maxraj kerak emas: u faqat qo'shish va ayirish uchun kerak.",
      en: 'No common denominator here: that is only for addition and subtraction.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьная теплица. На хуке вопрос, в итоге ответ.
// ============================================================
const Sprout = ({ x, y, s = 1, tone = '#8FBF7F' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 v-10" stroke={tone} strokeWidth="2" strokeLinecap="round"/>
    <path d="M0 -6 q-6 -3 -7 -9 q7 0 7 7" fill={tone}/>
    <path d="M0 -8 q6 -3 7 -9 q-7 0 -7 7" fill={tone} opacity="0.85"/>
  </g>
);

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d11sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d11sky)"/>

    {/* Каркас теплицы: дуги и стойки */}
    <g opacity="0.55">
      <path d="M20 118 q180 -108 360 0" fill="none" stroke="#C9A472" strokeWidth="3"/>
      <path d="M70 124 q130 -86 260 0" fill="none" stroke="#C9A472" strokeWidth="2"/>
      <path d="M120 128 q80 -62 160 0" fill="none" stroke="#C9A472" strokeWidth="2"/>
      <path d="M200 34 v96" stroke="#C9A472" strokeWidth="2"/>
    </g>

    {/* Грядка: половина Азиза сверху, на ней часть с морковью.
        Клеток НЕТ: на глаз доля от всей грядки не считается */}
    <g>
      <rect x="70" y="62" width="260" height="56" rx="4" fill="#C9A472"/>
      <rect x="74" y="66" width="252" height="24" rx="3" fill="#B5844F"/>
      <rect x="74" y="92" width="252" height="22" rx="3" fill="#A9CFBA" opacity="0.5"/>
      <rect x="74" y="66" width="168" height="24" rx="3" fill="#E8A33C" opacity="0.75"/>
      {[92, 124, 156, 188, 220].map((sx) => <Sprout key={sx} x={sx} y={88} s={0.9} tone="#E8A33C"/>)}
      {[104, 150, 196, 244, 292].map((sx) => <Sprout key={sx} x={sx} y={112} s={0.8}/>)}
    </g>

    {/* Дети у грядки */}
    <Person x={44} ground={132} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={356} ground={132} head={12} shirt="#F5C77E" hair="#5A4636"/>

    {/* Земля, лейка и ящик с рассадой */}
    <rect x="0" y="130" width="400" height="24" fill="#D2A96F"/>
    <g className="d11-can">
      <rect x="16" y="136" width="26" height="14" rx="3" fill="#8E8578"/>
      <path d="M42 140 l12 -6 l2 3 l-12 7 Z" fill="#8E8578"/>
      <path d="M20 136 q6 -8 14 0" fill="none" stroke="#8E8578" strokeWidth="2"/>
    </g>
    <g>
      <rect x="336" y="134" width="48" height="16" rx="2" fill="#B08A57"/>
      {[344, 356, 368].map((sx) => <Sprout key={sx} x={sx} y={134} s={0.7}/>)}
    </g>

    {/* Солнечный луч через крышу */}
    <path className="d11-ray" d="M250 20 l40 60 l-14 6 l-40 -60 Z" fill="#F5C77E" opacity="0.25"/>
  </svg>
);

// Итог: та же грядка, но с клетками. Морковь занимает 2 клетки из 6.
const FinalScene = () => {
  const x0 = 80; const y0 = 16; const w = 240; const h = 60;
  const cw = w / 3; const ch = h / 2;
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      {[0, 1].map((r) => [0, 1, 2].map((c) => (
        <rect key={`${r}${c}`} x={x0 + cw * c} y={y0 + ch * r} width={cw} height={ch}
          fill={r === 0 && c < 2 ? '#E8A33C' : '#F7F0E2'} stroke="#C9A472" strokeWidth="1.4"/>
      )))}
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke="#B08A57" strokeWidth="2.4"/>
      <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="13">
        <text x="200" y="88" textAnchor="middle">2 / 6 = 1 / 3</text>
      </g>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прямоугольник «часть от части»: строки, столбцы и общая закраска.
const AreaGrid = ({ rows, cols, takeRows, takeCols, showCols = true, size = 'mid' }) => (
  <span className={'d11-grid d11-grid-' + size} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
    {Array.from({ length: rows * cols }, (_, i) => {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const inRow = r < takeRows;
      const inCol = showCols && c < takeCols;
      const cls = inRow && inCol ? 'both' : (inRow ? 'row' : (inCol ? 'col' : ''));
      return <i key={i} className={cls}/>;
    })}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d11-line d11-fade' + (on ? ' d11-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d11-stage">
        <span className="d11-row">
          {[0, 1, 2].map((i) => (
            <span key={i} className={'d11-fade' + (step >= 0 ? ' d11-on' : '')}>
              <AreaGrid rows={1} cols={4} takeRows={1} takeCols={1} size="sm"/>
            </span>
          ))}
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

// Ядро: грядку режут поперёк и вдоль, пересечение и есть ответ.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d11-stage">
        <AreaGrid rows={c.rows} cols={c.cols} takeRows={c.take_rows} takeCols={c.take_cols} showCols={step >= 1}/>
        <span className={'d11-sum d11-fade' + (step >= 2 ? ' d11-on' : '')}>
          <Frac n="1" d="2" size="mid"/><span className="d11-op">·</span>
          <Frac n="2" d="3" size="mid"/><span className="d11-op">=</span>
          <Frac n={c.result.n} d={c.result.d} size="mid"/><span className="d11-op">=</span>
          <Frac n={c.short.n} d={c.short.d} size="mid"/>
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

const PreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_pre;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d11-stage">
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        <span className={'d11-cross d11-fade' + (step >= 1 ? ' d11-on' : '')}>
          <Frac n="4" d="9" size="mid"/><span className="d11-op">·</span><Frac n="3" d="8" size="mid"/>
          <span className="d11-op">→</span>
          <Frac n="1" d="3" size="mid"/><span className="d11-op">·</span><Frac n="1" d="2" size="mid"/>
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
      <div className="frame fade-up delay-1 d11-stage">
        <span className="d11-cross">
          <Frac n={step >= 1 ? '1' : '5'} d={step >= 2 ? '2' : '6'} size="mid"/>
          <span className="d11-op">·</span>
          <Frac n={step >= 2 ? '1' : '3'} d={step >= 1 ? '2' : '10'} size="mid"/>
        </span>
        {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
        <span className={'d11-fade' + (step >= 2 ? ' d11-on' : '')}>
          <AreaGrid rows={2} cols={2} takeRows={1} takeCols={1}/>
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

// Граница: умножение может уменьшать.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d11-stage">
        {c.lines.map((l, i) => (
          <span key={i} className={'d11-pair d11-fade' + (step >= Math.min(i, 2) ? ' d11-on' : '')
            + (i === 1 ? ' d11-pair-down' : ' d11-pair-up')}>
            <Line node={t(l)} on/>
          </span>
        ))}
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
        <div className={'d11-banner fade-up delay-1' + (phase === 'play' ? ' d11-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d11-stage d11-stage-tool">
          {phase === 'demo' ? (
            <>
              <AreaGrid rows={3} cols={5} takeRows={2} takeCols={3} showCols={shown >= 1} size="sm"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d11-verdict' + (done ? ' d11-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d11-acts fade-up">
            <button className="d11-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d11-btn d11-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenPre = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_pre} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <PreBody step={step}/>}/>
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
      <div className="d11-stage">
        <AreaGrid rows={2} cols={3} takeRows={1} takeCols={2}/>
        <span className="d11-sum">
          <Frac n="1" d="2" size="mid"/><span className="d11-op">·</span>
          <Frac n="2" d="3" size="mid"/><span className="d11-op">=</span>
          <Frac n="1" d="3" size="mid"/>
        </span>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenMul = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_mul} asideNode={methodAside}/>
);
const ScreenPart = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_part} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: 24 горшка, из них доля Азиза и доля с базиликом.
const TaskFig = ({ idx }) => (
  <div className="d11-task-fig">
    <span className="d11-pots">
      {Array.from({ length: 24 }, (_, i) => (
        <i key={i} className={idx >= 1 ? (i < 6 ? 'both' : (i < 18 ? 'row' : '')) : (i < 18 ? 'row' : '')}/>
      ))}
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
.d11-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d11-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d11-stage-tool .d11-line { font-size: clamp(12px, 2vw, 16px); }
.d11-stage-tool .d11-grid-sm i { width: clamp(11px, 2.6vw, 20px); height: clamp(10px, 2.2vw, 17px); }
.d11-row { display: flex; align-items: center; gap: clamp(6px, 1.4vw, 11px); flex-wrap: wrap; justify-content: center; }

/* Прямоугольник «часть от части» */
.d11-grid { display: grid; gap: 2px; border: 2px solid #B08A57; border-radius: 5px; padding: 2px; background: #FFFDF7; }
.d11-grid i { display: block; background: #F7F0E2; border-radius: 2px; transition: background-color 400ms linear; }
.d11-grid-mid i { width: clamp(24px, 5.4vw, 44px); height: clamp(20px, 4.2vw, 34px); }
.d11-grid-sm i { width: clamp(14px, 3.2vw, 26px); height: clamp(13px, 2.8vw, 22px); }
.d11-grid i.row { background: #F5C77E; }
.d11-grid i.col { background: #DCEDF5; }
.d11-grid i.both { background: #E8A33C; }

.d11-fade { opacity: 0; transition: opacity 420ms linear; }
.d11-on { opacity: 1; }
.d11-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }
.d11-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 21px); font-weight: 700; color: #8A8883; }
.d11-sum, .d11-cross { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; }

/* Строки экрана границы */
.d11-pair { width: 100%; padding: clamp(6px, 1.4vw, 10px); border-radius: 12px; text-align: center; }
.d11-pair-up { background: #E7F5FA; border: 1px solid #B6DCEA; }
.d11-pair-down { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача: горшки */
.d11-task-fig { display: flex; justify-content: center; }
.d11-pots { display: grid; grid-template-columns: repeat(12, 1fr); gap: 3px; }
.d11-pots i { display: block; width: clamp(11px, 2.4vw, 18px); height: clamp(11px, 2.4vw, 18px); border-radius: 50%; background: #F3EFE6; border: 1px solid #E9E3D9; }
.d11-pots i.row { background: #F5C77E; border-color: #C99B3A; }
.d11-pots i.both { background: #8FBF7F; border-color: #1F7A4D; }

/* Экран 4 */
.d11-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d11-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d11-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d11-verdict-on { opacity: 1; }
.d11-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d11-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d11-btn:disabled { opacity: 0.45; cursor: default; }
.d11-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d11-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: луч солнца и лейка */
.d11-ray { animation: d11Ray 5200ms ease-in-out infinite; }
@keyframes d11Ray { 0%, 100% { opacity: 0.14; } 50% { opacity: 0.32; } }
.d11-can { transform-origin: 16px 150px; animation: d11Can 4600ms ease-in-out infinite; }
@keyframes d11Can { 0%, 70%, 100% { transform: rotate(0deg); } 84% { transform: rotate(-8deg); } }
@media (prefers-reduced-motion: reduce) { .d11-ray, .d11-can { animation: none; } }

@media (max-width: 639.98px) {
  .d11-grid-mid i { width: 22px; height: 19px; }
  .d11-grid-sm i { width: 13px; height: 12px; }
  .d11-pots i { width: 10px; height: 10px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function MultiplyFractionsLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenPre, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenMul, ScreenPart, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
