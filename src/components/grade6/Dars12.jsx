// ============================================================
// 6 КЛАСС, УРОК 12 «Деление обыкновенных дробей»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Умножение из урока 11 даёт ключ: деление на дробь заменяется умножением
// на перевёрнутую. Модель урока — «сколько раз помещается», а не «раздать
// поровну»: именно она объясняет, почему результат может вырасти.
//
// Сцена — школьный праздник: кувшин сока и стаканчики.
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
  lessonId: 'grade6-12',
  lessonTitle: {
    ru: 'Деление обыкновенных дробей',
    uz: "Oddiy kasrlarni bo'lish",
    en: 'Dividing fractions',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 sharbat: 3/4 litr, 1/8 litrlik stakan
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 bo'lish = necha marta sig'adi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 3/4 ichida nechta 1/8 bor
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: teskari kasrga ko'paytirish
  { id: 's_whole',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 butun son qatnashgan hollar
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 7/8 : 7/16
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: nolga bo'linmaydi, natija o'sadi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_div',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 bo'lish x3
  { id: 's_fit',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 nechta sig'adi x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: natija katta yoki kichik
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: sharbat quyish
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: { ru: 'Кувшин и стаканчики', uz: 'Ko\'za va stakanlar', en: 'A jug and small cups' },
    lead: {
      ru: 'На празднике в кувшине 3/4 литра сока. Стаканчик вмещает 1/8 литра.',
      uz: "Bayramda ko'zada 3/4 litr sharbat bor. Stakanga 1/8 litr sig'adi.",
      en: 'At the party the jug holds 3/4 of a litre of juice. One cup holds 1/8 of a litre.',
    },
    voice_a: { ru: 'Азиз: делим — значит станет меньше 3/4.', uz: "Aziz: bo'lyapmiz, demak 3/4 dan kam chiqadi.", en: 'Aziz: we are dividing, so it will be less than 3/4.' },
    voice_b: { ru: 'Дилноза: получится 6 стаканчиков.', uz: 'Dilnoza: 6 ta stakan chiqadi.', en: 'Dilnoza: it will fill 6 cups.' },
    ask: { ru: 'Сколько стаканчиков получится?', uz: 'Nechta stakan chiqadi?', en: 'How many cups will it fill?' },
    options: [
      { ru: 'Меньше одного стаканчика', uz: 'Bitta stakandan ham kam', en: 'Less than one cup' },
      { ru: 'Шесть стаканчиков', uz: 'Oltita stakan', en: 'Six cups' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'На школьном празднике в кувшине три четвёртых литра сока, а стаканчик вмещает одну восьмую литра.',
          'Азиз говорит, что раз мы делим, то получится меньше трёх четвёртых. Дилноза считает, что выйдет шесть стаканчиков. Сколько стаканчиков получится? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab bayramida ko'zada uch to'rtdan litr sharbat bor, stakanga esa bir sakkizdan litr sig'adi.",
          "Aziz bo'lyapmiz, demak uch to'rtdandan kam chiqadi deydi. Dilnoza oltita stakan chiqadi deb hisoblaydi. Nechta stakan chiqadi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'At the school party the jug holds three quarters of a litre of juice, and one cup holds an eighth of a litre.',
          'Aziz says that since we divide, the answer is less than three quarters. Dilnoza thinks it fills six cups. How many cups will it fill? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Деление — это «сколько раз помещается»', uz: "Bo'lish — bu «necha marta sig'adi»", en: 'Division asks how many times it fits' },
    lines: [
      { ru: '6 : 2 = 3', uz: '6 : 2 = 3', en: '6 ÷ 2 = 3' },
      { ru: 'в 6 помещается 3 двойки', uz: "6 ichiga 3 ta ikkilik sig'adi", en: 'three twos fit into 6' },
    ],
    done: {
      ru: 'Такой взгляд на деление работает и с дробями: спрашиваем, сколько раз делитель помещается в делимом.',
      uz: "Bo'lishga shunday qarash kasrlarda ham ishlaydi: bo'luvchi bo'linuvchi ichiga necha marta sig'ishini so'raymiz.",
      en: 'This view of division works with fractions too: we ask how many times the divisor fits into the dividend.',
    },
    audio: {
      ru: [
        'Вспомним, что такое деление. Шесть разделить на два это три.',
        'Прочитать это можно иначе: сколько двоек помещается в шести. Ответ три.',
        'С дробями работает тот же вопрос. Сколько раз делитель помещается в делимом. Именно так мы и посчитаем стаканчики.',
      ],
      uz: [
        "Bo'lish nima ekanini eslaymiz. Olti bo'lingan ikki teng uch.",
        "Buni boshqacha o'qish mumkin: olti ichiga nechta ikkilik sig'adi. Javob uchta.",
        "Kasrlarda ham xuddi shu savol ishlaydi. Bo'luvchi bo'linuvchi ichiga necha marta sig'adi. Stakanlarni ham shunday sanaymiz.",
      ],
      en: [
        'Let us recall what division is. Six divided by two is three.',
        'It can be read differently: how many twos fit into six. The answer is three.',
        'The same question works for fractions: how many times the divisor fits into the dividend. That is exactly how we will count the cups.',
      ],
    },
  },

  s_core: {
    title: { ru: 'Сколько восьмых в 3/4', uz: "3/4 ichida nechta 1/8 bor", en: 'How many eighths are in 3/4' },
    total: 8,
    filled: 6,
    done: {
      ru: '3/4 — это 6/8, а восьмых там ровно 6. Значит получится 6 стаканчиков, и результат больше делимого. Права была Дилноза.',
      uz: "3/4 bu 6/8, sakkizdanlar esa roppa-rosa 6 ta. Demak 6 ta stakan chiqadi va natija bo'linuvchidan katta. Dilnoza haq edi.",
      en: '3/4 is 6/8, and there are exactly 6 eighths. So it fills 6 cups and the result is larger than the dividend. Dilnoza was right.',
    },
    audio: {
      ru: [
        'Разметим кувшин на восьмые доли. Три четвёртых это шесть восьмых.',
        'Теперь считаем стаканчики. Каждый забирает одну восьмую, и таких долей шесть.',
        'Получилось шесть стаканчиков. Обратите внимание: результат больше, чем три четвёртых. Деление на дробь меньше единицы увеличивает число. Права была Дилноза.',
      ],
      uz: [
        "Ko'zani sakkizdan ulushlarga belgilaymiz. Uch to'rtdan bu olti sakkizdan.",
        "Endi stakanlarni sanaymiz. Har biri bir sakkizdanni oladi, bunday ulush esa oltita.",
        "Oltita stakan chiqdi. Diqqat qiling: natija uch to'rtdandan katta. Birdan kichik kasrga bo'lish sonni kattalashtiradi. Dilnoza haq edi.",
      ],
      en: [
        'Mark the jug in eighths. Three quarters is six eighths.',
        'Now count the cups. Each takes one eighth, and there are six such parts.',
        'Six cups. Notice that the result is larger than three quarters. Dividing by a fraction less than one increases the number. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Перевернуть и умножить', uz: "Ag'darib ko'paytirish", en: 'Flip and multiply' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '3/4 : 1/8', uz: '3/4 : 1/8', en: '3/4 ÷ 1/8' },
      { ru: 'переворачиваем делитель: 8/1', uz: "bo'luvchini ag'daramiz: 8/1", en: 'flip the divisor: 8/1' },
      { ru: '3/4 · 8/1 = 24/4 = 6', uz: '3/4 · 8/1 = 24/4 = 6', en: '3/4 · 8/1 = 24/4 = 6' },
    ],
    demo_note: {
      ru: 'Ответ тот же, что и по счёту стаканчиков. Деление на дробь всегда заменяется умножением на перевёрнутую.',
      uz: "Javob stakanlarni sanagandagi bilan bir xil. Kasrga bo'lish doim ag'darilgan kasrga ko'paytirish bilan almashtiriladi.",
      en: 'The same answer as counting cups. Dividing by a fraction is always replaced by multiplying by its flip.',
    },
    play_ask: { ru: 'Сколько будет 2/3 : 1/6?', uz: "2/3 : 1/6 nechaga teng?", en: 'What is 2/3 ÷ 1/6?' },
    play_opts: ['1/9', '2/18', '4'],
    play_correct: 2,
    play_ok: {
      ru: 'Верно. 2/3 · 6/1 = 12/3 = 4. В двух третьих помещается четыре шестых доли.',
      uz: "To'g'ri. 2/3 · 6/1 = 12/3 = 4. Ikki uchdan ichiga to'rtta oltidan ulush sig'adi.",
      en: 'Right. 2/3 · 6/1 = 12/3 = 4. Four sixths fit into two thirds.',
    },
    play_wrong: [
      { ru: 'Так вышло бы при умножении на 1/6, а делитель надо перевернуть.', uz: "Bu 1/6 ga ko'paytirganda chiqardi, bo'luvchini esa ag'darish kerak.", en: 'That comes from multiplying by 1/6, but the divisor must be flipped.' },
      { ru: 'Знаменатели перемножены без переворота: получилось умножение.', uz: "Maxrajlar ag'darilmasdan ko'paytirilgan: ko'paytirish chiqib qolgan.", en: 'The denominators were multiplied without flipping: that is multiplication.' },
      null,
    ],
    audio: {
      intro: {
        ru: 'Считать доли каждый раз долго. Есть правило: деление на дробь заменяем умножением на перевёрнутую дробь. Покажу на трёх четвёртых и одной восьмой.',
        uz: "Har safar ulush sanash uzoq. Qoida bor: kasrga bo'lishni ag'darilgan kasrga ko'paytirish bilan almashtiramiz. Uch to'rtdan va bir sakkizdan misolida ko'rsataman.",
        en: 'Counting parts every time is slow. There is a rule: replace division by a fraction with multiplication by its flip. I will show it on three quarters and one eighth.',
      },
      demo: {
        ru: 'Переворачиваем одну восьмую и получаем восемь. Три четвёртых умножить на восемь это двадцать четыре четвёртых, то есть шесть.',
        uz: "Bir sakkizdanni ag'daramiz va sakkiz chiqadi. Uch to'rtdan karra sakkiz bu yigirma to'rt to'rtdan, ya'ni olti.",
        en: 'Flip one eighth to get eight. Three quarters times eight is twenty four quarters, that is six.',
      },
      play: {
        ru: 'Теперь ваша очередь. Сколько будет две третьих разделить на одну шестую?',
        uz: "Endi sizning navbatingiz. Ikki uchdan bo'lingan bir oltidan nechaga teng?",
        en: 'Now it is your turn. What is two thirds divided by one sixth?',
      },
      ok: {
        ru: 'Верно. Две третьих умножить на шесть это четыре.',
        uz: "To'g'ri. Ikki uchdan karra olti bu to'rt.",
        en: 'Right. Two thirds times six is four.',
      },
      wrong: {
        ru: 'Переверните делитель и замените деление умножением.',
        uz: "Bo'luvchini ag'daring va bo'lishni ko'paytirish bilan almashtiring.",
        en: 'Flip the divisor and replace division with multiplication.',
      },
    },
  },

  s_whole: {
    title: { ru: 'Когда рядом целое число', uz: 'Butun son qatnashganda', en: 'When a whole number is involved' },
    lines: [
      { ru: '5 : 1/2 = 5 · 2 = 10', uz: '5 : 1/2 = 5 · 2 = 10', en: '5 ÷ 1/2 = 5 · 2 = 10' },
      { ru: '2/3 : 4 = 2/3 · 1/4 = 2/12 = 1/6', uz: '2/3 : 4 = 2/3 · 1/4 = 2/12 = 1/6', en: '2/3 ÷ 4 = 2/3 · 1/4 = 2/12 = 1/6' },
    ],
    done: {
      ru: 'Целое число — это дробь со знаменателем 1. Перевернём 4 и получим 1/4, всё остальное как обычно.',
      uz: "Butun son bu maxraji 1 bo'lgan kasr. 4 ni ag'darsak 1/4 chiqadi, qolgani odatdagidek.",
      en: 'A whole number is a fraction with denominator 1. Flip 4 to get 1/4 and the rest is as usual.',
    },
    audio: {
      ru: [
        'Целое число тоже дробь: у него знаменатель единица. Пять это пять первых.',
        'Пять разделить на одну вторую. Переворачиваем одну вторую, получаем два, и пять умножить на два это десять. В пяти помещается десять половинок.',
        'Обратный случай: две третьих разделить на четыре. Переворачиваем четвёрку и получаем одну четвёртую. Две третьих умножить на одну четвёртую это одна шестая.',
      ],
      uz: [
        "Butun son ham kasr: uning maxraji bir. Besh bu besh birdan.",
        "Beshni bir ikkidanga bo'lamiz. Bir ikkidanni ag'daramiz, ikki chiqadi, besh karra ikki esa o'n. Besh ichiga o'nta yarim sig'adi.",
        "Teskari hol: ikki uchdanni to'rtga bo'lamiz. To'rtni ag'daramiz va bir to'rtdan chiqadi. Ikki uchdan karra bir to'rtdan bu bir oltidan.",
      ],
      en: [
        'A whole number is a fraction too: its denominator is one. Five is five over one.',
        'Five divided by one half. Flip one half to get two, and five times two is ten. Ten halves fit into five.',
        'The other way round: two thirds divided by four. Flip four to get one quarter. Two thirds times one quarter is one sixth.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Посчитаем 7/8 : 7/16', uz: "7/8 : 7/16 ni hisoblaymiz", en: 'Let us compute 7/8 ÷ 7/16' },
    lead: { ru: 'Сначала заменяем деление умножением, потом сокращаем.', uz: "Avval bo'lishni ko'paytirish bilan almashtiramiz, keyin qisqartiramiz.", en: 'Replace division with multiplication first, then reduce.' },
    steps: [
      { ru: '7/8 : 7/16 = 7/8 · 16/7', uz: '7/8 : 7/16 = 7/8 · 16/7', en: '7/8 ÷ 7/16 = 7/8 · 16/7' },
      { ru: 'семёрки сокращаются, 16 и 8 делим на 8', uz: "yettilar qisqaradi, 16 va 8 ni 8 ga bo'lamiz", en: 'the sevens cancel, 16 and 8 divide by 8' },
      { ru: '1/1 · 2/1 = 2', uz: '1/1 · 2/1 = 2', en: '1/1 · 2/1 = 2' },
    ],
    done: {
      ru: 'Ответ 2. Проверка умножением: 2 · 7/16 = 14/16 = 7/8. Сходится.',
      uz: "Javob 2. Ko'paytirib tekshiramiz: 2 · 7/16 = 14/16 = 7/8. To'g'ri keldi.",
      en: 'The answer is 2. Check by multiplying: 2 · 7/16 = 14/16 = 7/8. It matches.',
    },
    audio: {
      ru: [
        'Решаем вместе. Семь восьмых разделить на семь шестнадцатых. Переворачиваем делитель и умножаем.',
        'Семёрки сокращаются, шестнадцать и восемь делятся на восемь. Остаётся один умножить на два.',
        'Ответ два. Проверим умножением: два умножить на семь шестнадцатых это четырнадцать шестнадцатых, а это и есть семь восьмых. Сходится.',
      ],
      uz: [
        "Birga yechamiz. Yetti sakkizdanni yetti o'n oltidanga bo'lamiz. Bo'luvchini ag'darib ko'paytiramiz.",
        "Yettilar qisqaradi, o'n olti va sakkiz sakkizga bo'linadi. Bir karra ikki qoladi.",
        "Javob ikki. Ko'paytirib tekshiramiz: ikki karra yetti o'n oltidan bu o'n to'rt o'n oltidan, bu esa yetti sakkizdan. To'g'ri keldi.",
      ],
      en: [
        'Let us solve it together. Seven eighths divided by seven sixteenths. Flip the divisor and multiply.',
        'The sevens cancel, sixteen and eight divide by eight. One times two is left.',
        'The answer is two. Check by multiplying: two times seven sixteenths is fourteen sixteenths, which is seven eighths. It matches.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Переворачивают только делитель', uz: "Faqat bo'luvchi ag'dariladi", en: 'Only the divisor gets flipped' },
    bad_line: { ru: '4/5 : 2/3 = 5/4 · 3/2', uz: '4/5 : 2/3 = 5/4 · 3/2', en: '4/5 ÷ 2/3 = 5/4 · 3/2' },
    good_line: { ru: '4/5 : 2/3 = 4/5 · 3/2 = 6/5', uz: '4/5 : 2/3 = 4/5 · 3/2 = 6/5', en: '4/5 ÷ 2/3 = 4/5 · 3/2 = 6/5' },
    zero_line: { ru: 'на 0 делить нельзя, поэтому 0/7 переворачивать нечем', uz: "0 ga bo'lib bo'lmaydi, shuning uchun 0/7 ni ag'darib bo'lmaydi", en: 'division by 0 is impossible, so 0/7 cannot be flipped' },
    done: {
      ru: 'Первую дробь не трогаем, переворачиваем только вторую. И помним: делитель не может быть нулём.',
      uz: "Birinchi kasrga tegmaymiz, faqat ikkinchisini ag'daramiz. Va esda tutamiz: bo'luvchi nol bo'la olmaydi.",
      en: 'The first fraction stays, only the second is flipped. And remember: the divisor cannot be zero.',
    },
    audio: {
      ru: [
        'Частая ошибка: переворачивают обе дроби. Тогда получается совсем другое число.',
        'Переворачивать нужно только делитель, то есть вторую дробь. Первая остаётся как есть.',
        'И ещё одно. Делитель не может быть нулём: разделить на ноль нельзя, а перевернуть ноль невозможно.',
      ],
      uz: [
        "Tez-tez uchraydigan xato: ikkala kasrni ham ag'darishadi. Unda mutlaqo boshqa son chiqadi.",
        "Faqat bo'luvchini, ya'ni ikkinchi kasrni ag'darish kerak. Birinchisi qanday bo'lsa shunday qoladi.",
        "Yana bir narsa. Bo'luvchi nol bo'la olmaydi: nolga bo'lib bo'lmaydi, nolni ag'darish esa imkonsiz.",
      ],
      en: [
        'A common mistake: flipping both fractions. That gives a completely different number.',
        'Only the divisor, the second fraction, is flipped. The first one stays as it is.',
        'One more thing. The divisor cannot be zero: division by zero is impossible and zero cannot be flipped.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'Как делить дроби', uz: "Kasrlar qanday bo'linadi", en: 'How to divide fractions' },
    rule_1: {
      ru: 'Чтобы разделить на дробь, надо умножить на перевёрнутую дробь. Первую дробь не меняем, делитель переворачиваем. Делитель не может быть нулём.',
      uz: "Kasrga bo'lish uchun ag'darilgan kasrga ko'paytirish kerak. Birinchi kasrni o'zgartirmaymiz, bo'luvchini ag'daramiz. Bo'luvchi nol bo'la olmaydi.",
      en: 'To divide by a fraction, multiply by its flip. The first fraction stays, the divisor is flipped. The divisor cannot be zero.',
    },
    rule_2: {
      ru: 'Деление на дробь меньше 1 увеличивает число: делитель помещается много раз. Сок: 3/4 : 1/8 = 6 стаканчиков, права была Дилноза.',
      uz: "1 dan kichik kasrga bo'lish sonni kattalashtiradi: bo'luvchi ko'p marta sig'adi. Sharbat: 3/4 : 1/8 = 6 stakan, Dilnoza haq edi.",
      en: 'Dividing by a fraction less than 1 increases the number: the divisor fits many times. The juice: 3/4 ÷ 1/8 = 6 cups, Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Чтобы разделить на дробь, нужно умножить на перевёрнутую дробь. Первую дробь не трогаем, переворачиваем только делитель, и делитель не может быть нулём. Деление на дробь меньше единицы увеличивает число, потому что делитель помещается много раз. Вернёмся к празднику. Три четвёртых разделить на одну восьмую это шесть стаканчиков. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Kasrga bo'lish uchun ag'darilgan kasrga ko'paytirish kerak. Birinchi kasrga tegmaymiz, faqat bo'luvchini ag'daramiz, bo'luvchi esa nol bo'la olmaydi. Birdan kichik kasrga bo'lish sonni kattalashtiradi, chunki bo'luvchi ko'p marta sig'adi. Bayramga qaytamiz. Uch to'rtdan bo'lingan bir sakkizdan bu oltita stakan. Dilnoza haq edi.",
      en: 'Let us remember the rule. To divide by a fraction, multiply by its flip. The first fraction stays, only the divisor is flipped, and the divisor cannot be zero. Dividing by a fraction less than one increases the number, because the divisor fits many times. Back to the party. Three quarters divided by one eighth is six cups. Dilnoza was right.',
    },
  },

  s_div: {
    title: { ru: 'Деление дробей', uz: "Kasrlarni bo'lish", en: 'Dividing fractions' },
    lead: { ru: 'Переверни делитель и умножай.', uz: "Bo'luvchini ag'daring va ko'paytiring.", en: 'Flip the divisor and multiply.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '1/2 : 1/4', uz: '1/2 : 1/4', en: '1/2 ÷ 1/4' },
        opts: ['2', '1/8', '1/2'],
        correct: 0,
        ok: { ru: 'Верно. 1/2 · 4/1 = 4/2 = 2. Две четвертинки помещаются в половине.', uz: "To'g'ri. 1/2 · 4/1 = 4/2 = 2. Yarim ichiga ikkita chorak sig'adi.", en: 'Right. 1/2 · 4/1 = 4/2 = 2. Two quarters fit into a half.' },
        wrong: [
          null,
          { ru: 'Это умножение на 1/4, а надо на 4/1.', uz: "Bu 1/4 ga ko'paytirish, kerak bo'lgani 4/1 ga.", en: 'That multiplies by 1/4, but it must be 4/1.' },
          { ru: 'Ответ не может остаться прежним: делим на число меньше единицы.', uz: "Javob o'zgarishsiz qololmaydi: birdan kichik songa bo'lyapmiz.", en: 'The answer cannot stay the same: we divide by less than one.' },
        ],
      },
      {
        q: { ru: '3/5 : 3/10', uz: '3/5 : 3/10', en: '3/5 ÷ 3/10' },
        opts: ['9/50', '2', '1/2'],
        correct: 1,
        ok: { ru: 'Верно. 3/5 · 10/3: тройки сокращаются, 10 : 5 = 2.', uz: "To'g'ri. 3/5 · 10/3: uchlar qisqaradi, 10 : 5 = 2.", en: 'Right. 3/5 · 10/3: the threes cancel and 10 ÷ 5 = 2.' },
        wrong: [
          { ru: 'Здесь дроби перемножены без переворота.', uz: "Bu yerda kasrlar ag'darilmasdan ko'paytirilgan.", en: 'Here the fractions were multiplied without flipping.' },
          null,
          { ru: 'Наоборот: делимое больше делителя, значит ответ больше единицы.', uz: "Aksincha: bo'linuvchi bo'luvchidan katta, demak javob birdan katta.", en: 'The other way round: the dividend is larger, so the answer exceeds one.' },
        ],
      },
      {
        q: { ru: '4 : 2/3', uz: '4 : 2/3', en: '4 ÷ 2/3' },
        opts: ['6', '8/3', '2/3'],
        correct: 0,
        ok: { ru: 'Верно. 4 · 3/2 = 12/2 = 6.', uz: "To'g'ri. 4 · 3/2 = 12/2 = 6.", en: 'Right. 4 · 3/2 = 12/2 = 6.' },
        wrong: [
          null,
          { ru: 'Это 4 · 2/3, то есть умножение без переворота.', uz: "Bu 4 · 2/3, ya'ni ag'darmasdan ko'paytirish.", en: 'That is 4 · 2/3, multiplication without flipping.' },
          { ru: 'Слишком мало: в четырёх помещается много двух третьих.', uz: "Juda kam: to'rt ichiga ko'plab ikki uchdan sig'adi.", en: 'Too small: many two thirds fit into four.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на деление. Первую дробь не трогаем, переворачиваем только делитель.',
        uz: "Bo'lish mashqi. Birinchi kasrga tegmaymiz, faqat bo'luvchini ag'daramiz.",
        en: 'Division practice. The first fraction stays, only the divisor is flipped.',
      },
    },
  },

  s_fit: {
    title: { ru: 'Сколько раз поместится', uz: "Necha marta sig'adi", en: 'How many times it fits' },
    lead: { ru: 'Это тот же вопрос, что и деление.', uz: "Bu bo'lishning o'sha savoli.", en: 'This is the same question as division.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько раз 1/4 помещается в 2?', uz: "1/4 soni 2 ichiga necha marta sig'adi?", en: 'How many times does 1/4 fit into 2?' },
        opts: ['8', '1/2', '4'],
        correct: 0,
        ok: { ru: 'Верно. 2 · 4 = 8.', uz: "To'g'ri. 2 · 4 = 8.", en: 'Right. 2 · 4 = 8.' },
        wrong: [
          null,
          { ru: 'Это 2 умножить на 1/4, а нужно разделить.', uz: "Bu 2 ni 1/4 ga ko'paytirish, kerak bo'lgani bo'lish.", en: 'That multiplies 2 by 1/4, but we need to divide.' },
          { ru: '4 четвертинки помещаются в одной единице, а у нас две.', uz: "Bitta butun ichiga 4 ta chorak sig'adi, bizda esa ikkita.", en: 'Four quarters fit into one unit, and we have two.' },
        ],
      },
      {
        q: { ru: 'Сколько стаканов по 1/5 литра в 1 литре?', uz: "1 litrda 1/5 litrlik nechta stakan bor?", en: 'How many 1/5 litre cups are in 1 litre?' },
        opts: ['1/5', '5', '10'],
        correct: 1,
        ok: { ru: 'Верно. 1 : 1/5 = 1 · 5 = 5.', uz: "To'g'ri. 1 : 1/5 = 1 · 5 = 5.", en: 'Right. 1 ÷ 1/5 = 1 · 5 = 5.' },
        wrong: [
          { ru: 'Это объём одного стакана, а спрашивают про количество.', uz: "Bu bitta stakan hajmi, savol esa soni haqida.", en: 'That is the size of one cup, and the question is about the count.' },
          null,
          { ru: '10 вышло бы для стаканов по 1/10 литра.', uz: "10 soni 1/10 litrlik stakanlarda chiqardi.", en: 'Ten would be right for 1/10 litre cups.' },
        ],
      },
      {
        q: { ru: 'Сколько кусков по 3/4 метра выйдет из 3 метров ленты?', uz: "3 metr tasmadan 3/4 metrlik nechta bo'lak chiqadi?", en: 'How many 3/4 metre pieces come from 3 metres of tape?' },
        opts: ['4', '2', '9/4'],
        correct: 0,
        ok: { ru: 'Верно. 3 : 3/4 = 3 · 4/3 = 4.', uz: "To'g'ri. 3 : 3/4 = 3 · 4/3 = 4.", en: 'Right. 3 ÷ 3/4 = 3 · 4/3 = 4.' },
        wrong: [
          null,
          { ru: 'Мало: 2 куска это только 1,5 метра.', uz: "Kam: 2 bo'lak bu atigi bir yarim metr.", en: 'Too few: two pieces make only one and a half metres.' },
          { ru: 'Это 3 умножить на 3/4, а нужно разделить.', uz: "Bu 3 ni 3/4 ga ko'paytirish, kerak bo'lgani bo'lish.", en: 'That multiplies 3 by 3/4, but we need to divide.' },
        ],
      },
      {
        q: { ru: 'Сколько раз 2/3 помещается в 2/3?', uz: "2/3 soni 2/3 ichiga necha marta sig'adi?", en: 'How many times does 2/3 fit into 2/3?' },
        opts: ['0', '1', '4/9'],
        correct: 1,
        ok: { ru: 'Верно. Любое число, делённое само на себя, даёт 1.', uz: "To'g'ri. Har qanday son o'ziga bo'linsa, 1 chiqadi.", en: 'Right. Any number divided by itself gives 1.' },
        wrong: [
          { ru: 'Ноль вышел бы, если бы делимое было нулём.', uz: "Nol bo'linuvchi nol bo'lgandagina chiqardi.", en: 'Zero would appear only if the dividend were zero.' },
          null,
          { ru: 'Это произведение 2/3 на 2/3, а не частное.', uz: "Bu 2/3 ni 2/3 ga ko'paytirish, bo'lish emas.", en: 'That is 2/3 times 2/3, not the quotient.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Считаем, сколько раз одна величина помещается в другой. Это и есть деление.',
        uz: "Bir kattalik ikkinchisi ichiga necha marta sig'ishini sanaymiz. Bu bo'lishning o'zi.",
        en: 'Count how many times one amount fits into another. That is division.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Больше или меньше делимого', uz: "Bo'linuvchidan katta yoki kichik", en: 'Larger or smaller than the dividend' },
    lead: { ru: 'Смотри на делитель: меньше 1 — результат растёт.', uz: "Bo'luvchiga qarang: 1 dan kichik bo'lsa, natija o'sadi.", en: 'Look at the divisor: less than 1 means the result grows.' },
    bin_a: { ru: 'Результат больше', uz: 'Natija kattaroq', en: 'Result is larger' },
    bin_b: { ru: 'Результат меньше', uz: 'Natija kichikroq', en: 'Result is smaller' },
    cards: [
      { label: '3/4 : 1/2', bin: 'a' },
      { label: '3/4 : 2', bin: 'b' },
      { label: '5 : 1/3', bin: 'a' },
      { label: '2/3 : 4', bin: 'b' },
      { label: '1/2 : 1/4', bin: 'a' },
      { label: '5/6 : 5', bin: 'b' },
    ],
    hint: {
      ru: 'Делитель меньше единицы — частное больше делимого. Делитель больше единицы — меньше.',
      uz: "Bo'luvchi birdan kichik bo'lsa, bo'linma bo'linuvchidan katta. Birdan katta bo'lsa, kichik.",
      en: 'A divisor below one makes the quotient larger. Above one makes it smaller.',
    },
    correct_text: {
      ru: 'Верно. Всё решает делитель: меньше единицы — результат растёт, больше единицы — уменьшается.',
      uz: "To'g'ri. Hammasini bo'luvchi hal qiladi: birdan kichik bo'lsa natija o'sadi, katta bo'lsa kamayadi.",
      en: 'Right. The divisor decides: below one the result grows, above one it shrinks.',
    },
    audio: {
      intro: {
        ru: 'Разложите примеры по двум корзинам. Считать не обязательно, смотрите на делитель.',
        uz: "Misollarni ikki savatga ajrating. Hisoblash shart emas, bo'luvchiga qarang.",
        en: 'Sort the expressions into two baskets. No need to compute, just look at the divisor.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Сравни делитель с единицей.', uz: "Bu yerga emas. Bo'luvchini bir bilan solishtiring.", en: 'Not here. Compare the divisor with one.' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: 4/5 : 2/3 = 5/4 · 3/2. Где ошибка?', uz: 'Aziz: 4/5 : 2/3 = 5/4 · 3/2. Xato qayerda?', en: 'Aziz: 4/5 ÷ 2/3 = 5/4 · 3/2. Where is the mistake?' },
        opts: [
          { ru: 'Перевернул обе дроби', uz: "Ikkala kasrni ag'dardi", en: 'He flipped both fractions' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: 'Забыл сократить', uz: 'Qisqartirishni unutdi', en: 'He forgot to reduce' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Первую дробь не трогают: 4/5 · 3/2 = 12/10 = 6/5.', uz: "To'g'ri. Birinchi kasrga tegilmaydi: 4/5 · 3/2 = 12/10 = 6/5.", en: 'Right. The first fraction stays: 4/5 · 3/2 = 12/10 = 6/5.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: перевёрнута и первая дробь.', uz: "Xato bor: birinchi kasr ham ag'darilgan.", en: 'There is a mistake: the first fraction was flipped too.' },
          { ru: 'Дело не в сокращении, а в перевороте лишней дроби.', uz: "Gap qisqartirishda emas, ortiqcha kasrni ag'darishda.", en: 'The issue is not reducing but flipping the wrong fraction.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «При делении результат всегда меньше». Проверь.', uz: "Dilnoza: «Bo'lishda natija doim kichik chiqadi». Tekshiring.", en: 'Dilnoza: “Division always makes the result smaller.” Check it.' },
        opts: [
          { ru: 'Нет: при делителе меньше 1 результат больше', uz: "Yo'q: bo'luvchi 1 dan kichik bo'lsa natija katta", en: 'No: with a divisor below 1 the result is larger' },
          { ru: 'Да, всегда меньше', uz: 'Ha, doim kichik', en: 'Yes, always smaller' },
          { ru: 'Верно для дробей, неверно для целых', uz: "Kasrlar uchun to'g'ri, butun sonlar uchun emas", en: 'True for fractions, false for whole numbers' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 3/4 : 1/8 = 6, и это намного больше 3/4.', uz: "To'g'ri. 3/4 : 1/8 = 6, bu esa 3/4 dan ancha katta.", en: 'Right. 3/4 ÷ 1/8 = 6, far more than 3/4.' },
        wrong: [
          null,
          { ru: 'Не всегда: делитель меньше единицы даёт рост.', uz: "Har doim emas: birdan kichik bo'luvchi o'sish beradi.", en: 'Not always: a divisor below one makes it grow.' },
          { ru: 'Всё наоборот: рост даёт как раз дробный делитель меньше 1.', uz: "Aksincha: o'sishni aynan 1 dan kichik kasr bo'luvchi beradi.", en: 'The opposite: growth comes from a fractional divisor below 1.' },
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
    title: { ru: 'Разливаем сок', uz: 'Sharbat quyamiz', en: 'Pouring the juice' },
    lead: { ru: 'В кувшине 3/4 литра сока, стаканчик вмещает 1/8 литра.', uz: "Ko'zada 3/4 litr sharbat bor, stakanga 1/8 litr sig'adi.", en: 'The jug holds 3/4 of a litre and a cup holds 1/8.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько стаканчиков наполнится?', uz: "Nechta stakan to'ladi?", en: 'How many cups get filled?' },
        opts: ['6', '3', '8'],
        correct: 0,
        ok: { ru: 'Верно. 3/4 : 1/8 = 3/4 · 8 = 6.', uz: "To'g'ri. 3/4 : 1/8 = 3/4 · 8 = 6.", en: 'Right. 3/4 ÷ 1/8 = 3/4 · 8 = 6.' },
        wrong: [
          null,
          { ru: 'Три — это числитель делимого, а не ответ.', uz: "Uch bu bo'linuvchining surati, javob emas.", en: 'Three is the numerator of the dividend, not the answer.' },
          { ru: 'Восемь стаканчиков это целый литр, а у нас 3/4.', uz: "Sakkiz stakan bu butun litr, bizda esa 3/4.", en: 'Eight cups make a whole litre, and we have 3/4.' },
        ],
      },
      {
        q: { ru: 'В классе 9 человек. Хватит ли всем по стаканчику?', uz: "Sinfda 9 kishi bor. Hammaga bittadan stakan yetadimi?", en: 'There are 9 students. Is there a cup for everyone?' },
        opts: [
          { ru: 'Нет, не хватит трёх', uz: "Yo'q, uchtasi yetmaydi", en: 'No, three are missing' },
          { ru: 'Да, хватит', uz: 'Ha, yetadi', en: 'Yes, enough' },
          { ru: 'Хватит, ещё и останется', uz: 'Yetadi, ustiga qoladi ham', en: 'Enough, with some left over' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Стаканчиков 6, а человек 9: не хватит трёх.', uz: "To'g'ri. Stakan 6 ta, odam esa 9 ta: uchtasi yetmaydi.", en: 'Right. Six cups for nine people: three are missing.' },
        wrong: [
          null,
          { ru: 'Стаканчиков только 6, а нужно 9.', uz: "Stakan atigi 6 ta, kerak bo'lgani 9 ta.", en: 'There are only six cups and nine are needed.' },
          { ru: 'Останется, только если людей меньше шести.', uz: "Odam oltitadan kam bo'lsagina qoladi.", en: 'Something would remain only for fewer than six people.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про сок. В кувшине три четвёртых литра, стаканчик вмещает одну восьмую.',
        uz: "Sharbat haqida masala. Ko'zada uch to'rtdan litr, stakanga bir sakkizdan sig'adi.",
        en: 'A juice problem. The jug holds three quarters of a litre and a cup holds an eighth.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 10,
        q: { ru: 'Сколько раз 1/2 помещается в 5? Набери ответ.', uz: "1/2 soni 5 ichiga necha marta sig'adi? Javobni tering.", en: 'How many times does 1/2 fit into 5? Type the answer.' },
        hint: { ru: 'Переверни 1/2 и умножь: 5 · 2.', uz: "1/2 ni ag'daring va ko'paytiring: 5 · 2.", en: 'Flip 1/2 and multiply: 5 · 2.' },
        hint_audio: { ru: 'Переверните одну вторую и умножьте пять на два.', uz: "Bir ikkidanni ag'daring va beshni ikkiga ko'paytiring.", en: 'Flip one half and multiply five by two.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Сколько будет 5/6 : 5/12?', uz: '5/6 : 5/12 nechaga teng?', en: 'What is 5/6 ÷ 5/12?' },
        opts: ['25/72', '1/2', '2', '10/6'],
        wrong: [
          { ru: 'Здесь дроби перемножены без переворота.', uz: "Bu yerda kasrlar ag'darilmasdan ko'paytirilgan.", en: 'Here the fractions were multiplied without flipping.' },
          { ru: 'Наоборот: делимое больше делителя, ответ больше единицы.', uz: "Aksincha: bo'linuvchi bo'luvchidan katta, javob birdan katta.", en: 'The other way: the dividend is larger, so the answer exceeds one.' },
          null,
          { ru: 'Знаменатель тоже участвует: 5/6 · 12/5 = 2.', uz: "Maxraj ham qatnashadi: 5/6 · 12/5 = 2.", en: 'The denominator matters too: 5/6 · 12/5 = 2.' },
        ],
        correct: { ru: 'Верно. 5/6 · 12/5: пятёрки сокращаются, 12 : 6 = 2.', uz: "To'g'ri. 5/6 · 12/5: beshlar qisqaradi, 12 : 6 = 2.", en: 'Right. 5/6 · 12/5: the fives cancel and 12 ÷ 6 = 2.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Сколько будет 3/8 : 3?', uz: '3/8 : 3 nechaga teng?', en: 'What is 3/8 ÷ 3?' },
        opts: ['9/8', '1/8', '3/24', '1'],
        wrong: [
          { ru: 'Это умножение на 3, а нужно деление.', uz: "Bu 3 ga ko'paytirish, kerak bo'lgani bo'lish.", en: 'That multiplies by 3, but we need division.' },
          null,
          { ru: 'Число верное, но 3/24 надо сократить до 1/8.', uz: "Son to'g'ri, lekin 3/24 ni 1/8 gacha qisqartirish kerak.", en: 'The number is right, but 3/24 must reduce to 1/8.' },
          { ru: 'Единица вышла бы при делении на само себя.', uz: "Bir soni o'ziga bo'lganda chiqardi.", en: 'One would come from dividing by itself.' },
        ],
        correct: { ru: 'Верно. 3/8 · 1/3 = 3/24 = 1/8.', uz: "To'g'ri. 3/8 · 1/3 = 3/24 = 1/8.", en: 'Right. 3/8 · 1/3 = 3/24 = 1/8.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Какую дробь переворачивают при делении?', uz: "Bo'lishda qaysi kasr ag'dariladi?", en: 'Which fraction gets flipped in division?' },
        opts: [
          { ru: 'Только вторую, делитель', uz: "Faqat ikkinchisi, bo'luvchi", en: 'Only the second one, the divisor' },
          { ru: 'Только первую', uz: 'Faqat birinchisi', en: 'Only the first one' },
          { ru: 'Обе', uz: 'Ikkalasi', en: 'Both' },
          { ru: 'Ту, что больше', uz: 'Kattarog\'i', en: 'The larger one' },
        ],
        wrong: [
          null,
          { ru: 'Первая дробь остаётся без изменений.', uz: "Birinchi kasr o'zgarishsiz qoladi.", en: 'The first fraction stays unchanged.' },
          { ru: 'Если перевернуть обе, получится другое число.', uz: "Ikkalasini ag'darsak, boshqa son chiqadi.", en: 'Flipping both gives a different number.' },
          { ru: 'Размер дроби тут ни при чём: важно только место делителя.', uz: "Kasrning kattaligi muhim emas: faqat bo'luvchi o'rni muhim.", en: 'Size does not matter: only the divisor’s position does.' },
        ],
        correct: { ru: 'Верно. Делимое остаётся, делитель переворачивается.', uz: "To'g'ri. Bo'linuvchi qoladi, bo'luvchi ag'dariladi.", en: 'Right. The dividend stays, the divisor is flipped.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Ленту 6 метров режут на куски по 3/4 метра. Сколько кусков?', uz: "6 metrli tasma 3/4 metrlik bo'laklarga kesiladi. Nechta bo'lak chiqadi?", en: 'A 6 metre tape is cut into 3/4 metre pieces. How many pieces?' },
        opts: ['4', '4/9', '9/2', '8'],
        wrong: [
          { ru: '4 куска это только 3 метра.', uz: "4 bo'lak bu atigi 3 metr.", en: 'Four pieces make only three metres.' },
          { ru: 'Это умножение, а нужно деление.', uz: "Bu ko'paytirish, kerak bo'lgani bo'lish.", en: 'That is multiplication, but we need division.' },
          { ru: 'Тут перевёрнута не та дробь.', uz: "Bu yerda noto'g'ri kasr ag'darilgan.", en: 'The wrong fraction was flipped here.' },
          null,
        ],
        correct: { ru: 'Верно. 6 : 3/4 = 6 · 4/3 = 8.', uz: "To'g'ri. 6 : 3/4 = 6 · 4/3 = 8.", en: 'Right. 6 ÷ 3/4 = 6 · 4/3 = 8.' },
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
      ru: 'Бумажные форматы устроены на делении: лист A3 ровно вдвое больше A4, а A4 вдвое больше A5. Поэтому вопрос «сколько A5 в A3» решается делением на 1/4 и даёт 4.',
      uz: "Qog'oz formatlari bo'lishga asoslangan: A3 varaq A4 dan roppa-rosa ikki barobar katta, A4 esa A5 dan ikki barobar. Shuning uchun «A3 da nechta A5 bor» degan savol 1/4 ga bo'lish bilan yechiladi va 4 beradi.",
      en: 'Paper sizes are built on division: an A3 sheet is exactly twice an A4, and A4 is twice an A5. So the question how many A5 fit into A3 is a division by 1/4 and gives 4.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Бумажные форматы устроены на делении. Лист А три ровно вдвое больше А четыре, а А четыре вдвое больше А пять. Поэтому вопрос сколько листов А пять помещается в А три решается делением и даёт четыре.',
      uz: "Bilasizmi? Qog'oz formatlari bo'lishga asoslangan. A uch varaq A to'rtdan roppa-rosa ikki barobar katta, A to'rt esa A beshdan ikki barobar. Shuning uchun A uchga nechta A besh sig'adi degan savol bo'lish bilan yechiladi va to'rt beradi.",
      en: 'Did you know? Paper sizes are built on division. An A three sheet is exactly twice an A four, and A four is twice an A five. So the question how many A five sheets fit into an A three is solved by division and gives four.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Дроби', uz: 'Matematika · Kasrlar', en: 'Mathematics · Fractions' },
    heading: { ru: 'Деление дробей', uz: "Kasrlarni bo'lish", en: 'Dividing fractions' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'делим — значит умножаем на перевёрнутую', uz: "bo'lish = ag'darilganiga ko'paytirish", en: 'divide means multiply by the flip' },
    brief_2: { ru: 'переворачиваем только делитель', uz: "faqat bo'luvchi ag'dariladi", en: 'only the divisor is flipped' },
    brief_3: { ru: 'делитель меньше 1 — результат растёт', uz: "bo'luvchi 1 dan kichik — natija o'sadi", en: 'divisor below 1 makes it grow' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Смысл деления', uz: "Bo'lishning ma'nosi", en: 'What division means' },
    memo_a1: { ru: 'сколько раз делитель помещается', uz: "bo'luvchi necha marta sig'adi", en: 'how many times the divisor fits' },
    memo_q2: { ru: 'Целое число', uz: 'Butun son', en: 'A whole number' },
    memo_a2: { ru: 'дробь со знаменателем 1', uz: "maxraji 1 bo'lgan kasr", en: 'a fraction with denominator 1' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'перевернуть обе дроби', uz: "ikkala kasrni ag'darish", en: 'flipping both fractions' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Чтобы разделить на дробь, умножаем на перевёрнутую. Первую дробь не трогаем, переворачиваем только делитель, и он не может быть нулём.',
        'Праздник: в кувшине три четвёртых литра, стаканчик одна восьмая. Получилось шесть стаканчиков, и это больше делимого.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Kasrga bo'lish uchun ag'darilganiga ko'paytiramiz. Birinchi kasrga tegmaymiz, faqat bo'luvchini ag'daramiz va u nol bo'la olmaydi.",
        "Bayram: ko'zada uch to'rtdan litr, stakan bir sakkizdan. Oltita stakan chiqdi va bu bo'linuvchidan katta.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'To divide by a fraction, multiply by its flip. The first fraction stays, only the divisor is flipped, and it cannot be zero.',
        'The party: three quarters of a litre in the jug, an eighth per cup. Six cups, and that is more than the dividend.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Перевернуть делитель', uz: "Usul. Bo'luvchini ag'darish", en: 'Method. Flip the divisor' },
    m1_steps: {
      ru: ['Оставь первую дробь без изменений', 'Переверни делитель и замени деление умножением', 'Сократи и посчитай'],
      uz: ["Birinchi kasrni o'zgartirmang", "Bo'luvchini ag'daring va bo'lishni ko'paytirishga almashtiring", 'Qisqartiring va hisoblang'],
      en: ['Leave the first fraction unchanged', 'Flip the divisor and switch division to multiplication', 'Reduce and compute'],
    },
    m1_no: {
      ru: 'Целое число делят так же: 4 это 4/1, перевёрнутое даёт 1/4.',
      uz: "Butun son ham shunday: 4 bu 4/1, ag'dargani esa 1/4 beradi.",
      en: 'Whole numbers work the same: 4 is 4/1 and its flip is 1/4.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьный праздник. На хуке вопрос, в итоге ответ.
// ============================================================
const Cup = ({ x, y, s = 1, filled = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 h16 l-2 20 h-12 Z" fill="#FFFDF7" stroke="#DCCFB6"/>
    {filled && <path d="M1.6 5 h12.8 l-1.4 14 h-10 Z" fill="#E8A33C" opacity="0.85"/>}
  </g>
);

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d12wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d12wall)"/>

    {/* Гирлянда праздника */}
    <g className="d12-garland">
      <path d="M8 14 q100 26 196 6 q90 -18 188 8" fill="none" stroke="#C9A472" strokeWidth="1.6"/>
      {[40, 92, 148, 204, 260, 316, 366].map((fx, i) => (
        <path key={fx} d={`M${fx} 18 l7 12 l-14 0 Z`} fill={['#E8A33C', '#7ECBE6', '#D98A5A', '#8FBF7F'][i % 4]} opacity="0.85"/>
      ))}
    </g>

    {/* Кувшин с соком: уровень 3/4, делений НЕТ */}
    <g>
      <path d="M150 44 h56 q10 0 10 12 v56 q0 10 -10 10 h-56 q-10 0 -10 -10 v-56 q0 -12 10 -12 Z" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <path d="M146 60 h64 v50 q0 8 -8 8 h-48 q-8 0 -8 -8 Z" fill="#E8A33C" opacity="0.8"/>
      <path d="M216 58 q18 6 18 22 q0 16 -18 20" fill="none" stroke="#C9A472" strokeWidth="3"/>
      <path d="M156 36 h44 v8 h-44 Z" fill="#C9A472"/>
    </g>

    {/* Стаканчики на подносе: пока пустые */}
    <g>
      <rect x="238" y="112" width="130" height="8" rx="3" fill="#B08A57"/>
      <Cup x={242} y={92} s={0.9}/>
      <Cup x={264} y={92} s={0.9}/>
      <Cup x={286} y={92} s={0.9}/>
      <Cup x={308} y={92} s={0.9}/>
      <Cup x={330} y={92} s={0.9}/>
    </g>

    {/* Дети у стола */}
    <Person x={54} ground={124} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={104} ground={124} head={13} shirt="#F5C77E" hair="#5A4636"/>

    {/* Стол и тарелка с печеньем */}
    <rect x="0" y="120" width="400" height="34" fill="#D2A96F"/>
    <rect x="0" y="120" width="400" height="5" fill="#C9884A"/>
    <g>
      <ellipse cx="200" cy="136" rx="26" ry="8" fill="#FFFDF7" stroke="#E9E3D9"/>
      <circle cx="192" cy="132" r="5" fill="#D9A05A"/>
      <circle cx="204" cy="134" r="5" fill="#D9A05A"/>
      <circle cx="198" cy="128" r="5" fill="#C9884A"/>
    </g>

    {/* Струя сока: движение принадлежит сцене */}
    <path className="d12-pour" d="M228 96 q6 10 4 18" stroke="#E8A33C" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

// Итог: кувшин размечен на восьмые, шесть стаканчиков полны.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g>
      <rect x="24" y="16" width="96" height="60" rx="6" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x="24" y={16 + 7.5 * i} width="96" height="7.5"
          fill={i >= 2 ? '#E8A33C' : '#FFFDF7'} opacity={i >= 2 ? 0.8 : 1} stroke="#DCCFB6" strokeWidth="0.8"/>
      ))}
    </g>
    <g>
      {[150, 186, 222, 258, 294, 330].map((cx) => <Cup key={cx} x={cx} y={30} s={1.1} filled/>)}
      <rect x="144" y="60" width="222" height="7" rx="3" fill="#B08A57"/>
    </g>
    <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="13">
      <text x="200" y="86" textAnchor="middle">3 / 4 : 1 / 8 = 6</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Кувшин как счётный материал: total долей, filled закрашено, cuts — сколько
// стаканчиков уже отсчитали.
const Jug = ({ total, filled, counted = 0, size = 'mid' }) => (
  <span className={'d12-jug d12-jug-' + size}>
    {Array.from({ length: total }, (_, i) => (
      <i key={i} className={(i < filled ? 'on' : '') + (i < counted ? ' cut' : '')}/>
    ))}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d12-line d12-fade' + (on ? ' d12-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d12-stage">
        <span className="d12-pairs">
          {[0, 1, 2].map((i) => (
            <span key={i} className={'d12-pairbox d12-fade' + (step >= (i === 0 ? 0 : 1) ? ' d12-on' : '')}>
              <i/><i/>
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

// Ядро: кувшин делят на восьмые и отсчитывают стаканчики.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  const counted = step >= 2 ? 6 : (step >= 1 ? 3 : 0);
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d12-stage">
        <Jug total={c.total} filled={c.filled} counted={counted}/>
        <span className="d12-cups">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} className={i < counted ? 'on' : ''}/>
          ))}
        </span>
        <span className={'d12-sum d12-fade' + (step >= 2 ? ' d12-on' : '')}>
          <Frac n="3" d="4" size="mid"/><span className="d12-op">=</span>
          <Frac n="6" d="8" size="mid"/><span className="d12-op">→</span>
          <b className="d12-res">6</b>
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

const WholeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_whole;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d12-stage">
        <span className={'d12-flip d12-fade' + (step >= 1 ? ' d12-on' : '')}>
          <b className="d12-res">5</b><span className="d12-op">→</span><Frac n="5" d="1" size="mid"/>
        </span>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i + 1}/>)}
        <span className={'d12-fade' + (step >= 2 ? ' d12-on' : '')}>
          <Jug total={10} filled={10} counted={10} size="sm"/>
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
      <div className="frame fade-up delay-1 d12-stage">
        {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
        <span className={'d12-sum d12-fade' + (step >= 2 ? ' d12-on' : '')}>
          <b className="d12-res">2</b>
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

// Граница: переворачивают только делитель, на ноль делить нельзя.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d12-stage">
        <span className="d12-pair d12-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d12-pair d12-pair-good d12-fade' + (step >= 1 ? ' d12-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d12-pair d12-pair-warn d12-fade' + (step >= 2 ? ' d12-on' : '')}>
          <span className="d12-note">{mt(t(c.zero_line))}</span>
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
        <div className={'d12-banner fade-up delay-1' + (phase === 'play' ? ' d12-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d12-stage d12-stage-tool">
          {phase === 'demo' ? (
            <>
              {/* Кувшин здесь лежит на боку: вертикальные доли не помещались вместе с карточкой способа */}
              <Jug total={8} filled={6} counted={done ? 6 : 0} size="row"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d12-verdict' + (done ? ' d12-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d12-acts fade-up">
            <button className="d12-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d12-btn d12-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
      <div className="d12-stage">
        <span className="d12-sum">
          <Frac n="3" d="4" size="mid"/><span className="d12-op">:</span>
          <Frac n="1" d="8" size="mid"/><span className="d12-op">=</span>
          <Frac n="3" d="4" size="mid"/><span className="d12-op">·</span>
          <Frac n="8" d="1" size="mid"/><span className="d12-op">=</span>
          <b className="d12-res">6</b>
        </span>
        <Jug total={8} filled={6} counted={6} size="sm"/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenDiv = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_div} asideNode={methodAside}/>
);
const ScreenFit = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_fit} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: кувшин и стаканчики, во втором задании рядом стоят 9 детей.
const TaskFig = ({ idx }) => (
  <div className="d12-task-fig">
    <Jug total={8} filled={6} counted={6} size="sm"/>
    <span className="d12-cups">
      {Array.from({ length: idx >= 1 ? 9 : 6 }, (_, i) => (
        <i key={i} className={i < 6 ? 'on' : 'miss'}/>
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
.d12-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d12-stage-tool { gap: clamp(3px, 0.7vw, 6px) !important; padding: clamp(7px, 1.4vw, 10px) !important; }
.d12-stage-tool .d12-line { font-size: clamp(12px, 2vw, 16px); }

/* Кувшин: доли сверху вниз */
.d12-jug { display: inline-flex; flex-direction: column; gap: 2px; padding: 4px; border: 2px solid #C9A472; border-radius: 7px; background: #FFFDF7; }
.d12-jug i { display: block; border-radius: 2px; background: #F7F0E2; transition: background-color 400ms linear; }
.d12-jug-mid i { width: clamp(70px, 16vw, 120px); height: clamp(9px, 1.8vw, 14px); }
.d12-jug-sm i { width: clamp(56px, 13vw, 92px); height: clamp(7px, 1.4vw, 11px); }
.d12-jug-row { flex-direction: row; }
.d12-jug-row i { width: clamp(12px, 2.6vw, 20px); height: clamp(15px, 2.8vw, 24px); }
.d12-jug i.on { background: #E8A33C; }
.d12-jug i.cut { background: #7FBF95; }

/* Стаканчики */
.d12-cups { display: inline-flex; gap: 5px; flex-wrap: wrap; justify-content: center; }
.d12-cups i { display: block; width: clamp(13px, 2.8vw, 22px); height: clamp(17px, 3.4vw, 27px); border-radius: 0 0 5px 5px; border: 1px solid #DCCFB6; background: #FFFDF7; transition: background-color 400ms linear; }
.d12-cups i.on { background: #E8A33C; border-color: #C9884A; }
.d12-cups i.miss { border-style: dashed; opacity: 0.6; }

/* Пары для «сколько раз помещается» */
.d12-pairs { display: inline-flex; gap: 10px; }
.d12-pairbox { display: inline-flex; gap: 3px; padding: 4px; border: 1px dashed #C9A472; border-radius: 7px; }
.d12-pairbox i { display: block; width: clamp(13px, 2.8vw, 22px); height: clamp(13px, 2.8vw, 22px); border-radius: 3px; background: #7ECBE6; }

.d12-fade { opacity: 0; transition: opacity 420ms linear; }
.d12-on { opacity: 1; }
.d12-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }
.d12-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 21px); font-weight: 700; color: #8A8883; }
.d12-res { font-family: 'JetBrains Mono', monospace; font-size: clamp(24px, 4.6vw, 34px); color: #1F7A4D; }
.d12-sum, .d12-flip { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; }
.d12-note { font-size: clamp(13px, 2.2vw, 16px); color: #494550; }

/* Строки экрана границы */
.d12-pair { width: 100%; padding: clamp(6px, 1.4vw, 10px); border-radius: 12px; text-align: center; }
.d12-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d12-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d12-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d12-task-fig { display: flex; flex-direction: column; gap: 8px; align-items: center; }

/* Экран 4 */
.d12-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d12-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d12-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d12-verdict-on { opacity: 1; }
.d12-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d12-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d12-btn:disabled { opacity: 0.45; cursor: default; }
.d12-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d12-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: струя сока и гирлянда */
.d12-pour { animation: d12Pour 3000ms ease-in-out infinite; }
@keyframes d12Pour { 0%, 100% { opacity: 0.2; } 45% { opacity: 1; } }
.d12-garland { transform-origin: 200px 14px; animation: d12Garland 6200ms ease-in-out infinite; }
@keyframes d12Garland { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2.5px); } }
@media (prefers-reduced-motion: reduce) { .d12-pour, .d12-garland { animation: none; } }

@media (max-width: 639.98px) {
  .d12-jug-mid i { width: 66px; height: 8px; }
  .d12-jug-sm i { width: 54px; height: 7px; }
  .d12-cups i { width: 12px; height: 16px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function DivideFractionsLesson({
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
  });

  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenWhole, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenDiv, ScreenFit, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
