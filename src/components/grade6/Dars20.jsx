// ============================================================
// 6 КЛАСС, УРОК 20 «Масштаб»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б5. Масштаб — это отношение из урока 17, записанное в виде 1 : n, и
// работает он пропорцией из урока 18. Новое здесь одно: единицы длины, на
// которых ученик и спотыкается.
//
// Сцена — кружок моделирования: макет школьного двора на столе.
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
  lessonId: 'grade6-20',
  lessonTitle: {
    ru: 'Масштаб',
    uz: 'Masshtab',
    en: 'Scale',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 maket: 1 : 100
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 proporsiya esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 masshtab 1 : n nimani anglatadi
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: maketdan haqiqatga
  { id: 's_back',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 teskari yo'l: haqiqatdan maketga
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: xarita 1 : 200000
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: birliklar va kattalashtirish
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_real',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 maketdan haqiqatga x3
  { id: 's_model',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 haqiqatdan maketga x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: kichraytiradi yoki kattalashtiradi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: maket
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Макет школы', uz: 'Maktab maketi', en: 'The school model' },
    lead: {
      ru: 'Макет школы собран в масштабе 1 : 100. Здание на нём длиной 40 см.',
      uz: "Maktab maketi 1 : 100 masshtabda yig'ilgan. Undagi bino 40 sm uzunlikda.",
      en: 'A school model is built at a scale of 1 : 100. The building on it is 40 cm long.',
    },
    voice_a: { ru: 'Азиз: настоящая школа 4 метра.', uz: "Aziz: haqiqiy maktab 4 metr.", en: 'Aziz: the real school is 4 metres.' },
    voice_b: { ru: 'Дилноза: 40 метров.', uz: 'Dilnoza: 40 metr.', en: 'Dilnoza: 40 metres.' },
    ask: { ru: 'Какой длины школа на самом деле?', uz: 'Maktab aslida qanday uzunlikda?', en: 'How long is the school really?' },
    options: [
      { ru: '4 метра', uz: '4 metr', en: '4 metres' },
      { ru: '40 метров', uz: '40 metr', en: '40 metres' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В кружке моделирования собрали макет школы в масштабе один к ста. На макете здание получилось длиной сорок сантиметров.',
          'Азиз говорит, что настоящая школа четыре метра, а Дилноза что сорок. Какой длины школа на самом деле? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Modellashtirish to'garagida maktab maketi bir ga yuz masshtabda yig'ildi. Maketda bino qirq santimetr uzunlikda chiqdi.",
          "Aziz haqiqiy maktab to'rt metr deydi, Dilnoza esa qirq metr deydi. Maktab aslida qanday uzunlikda? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The modelling club built a school model at a scale of one to one hundred. On the model the building came out forty centimetres long.',
          'Aziz says the real school is four metres, Dilnoza says forty. How long is it really? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Отношение и пропорция', uz: 'Nisbat va proporsiya', en: 'Ratio and proportion' },
    lines: [
      { ru: '1 см : 3 км — отношение на карте', uz: '1 sm : 3 km — xaritadagi nisbat', en: '1 cm : 3 km is the map ratio' },
      { ru: '1 : 3 = 4 : 12 — пропорция', uz: '1 : 3 = 4 : 12 — proporsiya', en: '1 : 3 = 4 : 12 is a proportion' },
    ],
    done: {
      ru: 'Масштаб — это то же самое отношение, только записанное в одинаковых единицах: 1 : 100.',
      uz: "Masshtab ham o'sha nisbat, faqat bir xil birlikda yozilgan: 1 : 100.",
      en: 'A scale is the same ratio, only written in equal units: 1 : 100.',
    },
    audio: {
      ru: [
        'Вспомним восемнадцатый урок. На карте один сантиметр относился к трём километрам.',
        'Это отношение мы записывали пропорцией и находили неизвестное расстояние.',
        'Масштаб устроен так же, но обе величины берут в одинаковых единицах. Тогда получается короткая запись вида один к ста.',
      ],
      uz: [
        "O'n sakkizinchi darsni eslaymiz. Xaritada bir santimetr uch kilometrga nisbatda edi.",
        "Bu nisbatni proporsiya bilan yozib, noma'lum masofani topgan edik.",
        "Masshtab ham shunday tuzilgan, lekin ikkala kattalik bir xil birlikda olinadi. Shunda bir ga yuz ko'rinishidagi qisqa yozuv chiqadi.",
      ],
      en: [
        'Recall lesson eighteen. On the map one centimetre matched three kilometres.',
        'We wrote that ratio as a proportion and found the unknown distance.',
        'A scale works the same way, but both quantities are taken in the same units. That gives the short form one to one hundred.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Что значит 1 : 100', uz: '1 : 100 nimani anglatadi', en: 'What 1 : 100 means' },
    lines: [
      { ru: '1 см на макете — 100 см в жизни', uz: 'maketda 1 sm — hayotda 100 sm', en: '1 cm on the model is 100 cm in life' },
      { ru: '40 см · 100 = 4000 см', uz: '40 sm · 100 = 4000 sm', en: '40 cm · 100 = 4,000 cm' },
      { ru: '4000 см = 40 м', uz: '4000 sm = 40 m', en: '4,000 cm = 40 m' },
    ],
    done: {
      ru: 'Масштаб 1 : 100 уменьшает всё в 100 раз. Чтобы вернуться к настоящему размеру, умножаем на 100 и только потом переводим единицы. Школа длиной 40 метров — права была Дилноза.',
      uz: "1 : 100 masshtab hamma narsani 100 barobar kichraytiradi. Haqiqiy o'lchamga qaytish uchun 100 ga ko'paytiramiz va shundan keyingina birlikni o'zgartiramiz. Maktab 40 metr — Dilnoza haq edi.",
      en: 'A 1 : 100 scale shrinks everything a hundred times. To get back to the real size we multiply by 100 and only then convert the units. The school is 40 metres, so Dilnoza was right.',
    },
    audio: {
      ru: [
        'Запись один к ста читается так: один сантиметр на макете это сто сантиметров в жизни.',
        'Здание на макете сорок сантиметров. Умножаем на сто и получаем четыре тысячи сантиметров.',
        'Теперь переводим в метры: в метре сто сантиметров, значит четыре тысячи сантиметров это сорок метров. Азиз перевёл единицы раньше времени и потерял в десять раз. Права была Дилноза.',
      ],
      uz: [
        "Bir ga yuz yozuvi shunday o'qiladi: maketdagi bir santimetr hayotdagi yuz santimetr.",
        "Maketda bino qirq santimetr. Yuzga ko'paytiramiz va to'rt ming santimetr chiqadi.",
        "Endi metrga o'tkazamiz: bir metrda yuz santimetr bor, demak to'rt ming santimetr qirq metr. Aziz birlikni vaqtidan oldin o'zgartirib, o'n barobar yo'qotdi. Dilnoza haq edi.",
      ],
      en: [
        'One to one hundred reads like this: one centimetre on the model is one hundred centimetres in life.',
        'The building is forty centimetres on the model. Multiply by one hundred and get four thousand centimetres.',
        'Now convert to metres: a metre holds a hundred centimetres, so four thousand centimetres is forty metres. Aziz converted the units too early and lost a factor of ten. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'С макета в жизнь', uz: 'Maketdan hayotga', en: 'From the model to life' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'модель дерева 6 см, масштаб 1 : 50', uz: 'daraxt modeli 6 sm, masshtab 1 : 50', en: 'a tree model of 6 cm at 1 : 50' },
      { ru: '6 · 50 = 300 см', uz: '6 · 50 = 300 sm', en: '6 · 50 = 300 cm' },
      { ru: '300 см = 3 м', uz: '300 sm = 3 m', en: '300 cm = 3 m' },
    ],
    demo_note: {
      ru: 'Порядок такой: сначала умножаем на знаменатель масштаба, потом переводим сантиметры в метры.',
      uz: "Tartib shunday: avval masshtab maxrajiga ko'paytiramiz, keyin santimetrni metrga o'tkazamiz.",
      en: 'The order is: multiply by the scale number first, then convert centimetres to metres.',
    },
    play_ask: { ru: 'Модель автобуса 12 см, масштаб 1 : 100. Какова длина автобуса?', uz: 'Avtobus modeli 12 sm, masshtab 1 : 100. Avtobus uzunligi qancha?', en: 'A bus model is 12 cm at 1 : 100. How long is the bus?' },
    play_opts: [
          { ru: '1,2 м', uz: '1,2 m', en: '1.2 m' },
          { ru: '12 м', uz: '12 m', en: '12 m' },
          { ru: '120 м', uz: '120 m', en: '120 m' },
        ],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. 12 · 100 = 1200 см, а это 12 метров.',
      uz: "To'g'ri. 12 · 100 = 1200 sm, bu esa 12 metr.",
      en: 'Right. 12 · 100 = 1,200 cm, which is 12 metres.',
    },
    play_wrong: [
      { ru: 'Единицы перевели раньше умножения: вышло в десять раз меньше.', uz: "Birlik ko'paytirishdan oldin o'zgartirilgan: o'n barobar kam chiqdi.", en: 'The units were converted before multiplying: ten times too small.' },
      null,
      { ru: 'Слишком много: 1200 сантиметров это 12 метров, а не 120.', uz: "Juda ko'p: 1200 santimetr bu 12 metr, 120 emas.", en: 'Too much: 1,200 centimetres is 12 metres, not 120.' },
    ],
    audio: {
      intro: {
        ru: 'Способ такой. Длину с макета умножаем на второе число масштаба, а потом переводим в удобные единицы. Покажу на модели дерева.',
        uz: "Usul shunday. Maketdagi uzunlikni masshtabning ikkinchi soniga ko'paytiramiz, keyin qulay birlikka o'tkazamiz. Daraxt modelida ko'rsataman.",
        en: 'The method is this. Multiply the model length by the second number of the scale, then convert to convenient units. I will show it on a tree model.',
      },
      demo: {
        ru: 'Модель дерева шесть сантиметров, масштаб один к пятидесяти. Шесть умножить на пятьдесят триста сантиметров, а это три метра.',
        uz: "Daraxt modeli olti santimetr, masshtab bir ga ellik. Olti karra ellik uch yuz santimetr, bu esa uch metr.",
        en: 'The tree model is six centimetres at one to fifty. Six times fifty is three hundred centimetres, that is three metres.',
      },
      play: {
        ru: 'Теперь ваша очередь. Модель автобуса двенадцать сантиметров, масштаб один к ста. Какова настоящая длина автобуса?',
        uz: "Endi sizning navbatingiz. Avtobus modeli o'n ikki santimetr, masshtab bir ga yuz. Avtobusning haqiqiy uzunligi qancha?",
        en: 'Now it is your turn. A bus model is twelve centimetres at one to one hundred. How long is the real bus?',
      },
      ok: {
        ru: 'Верно. Тысяча двести сантиметров это двенадцать метров.',
        uz: "To'g'ri. Ming ikki yuz santimetr bu o'n ikki metr.",
        en: 'Right. One thousand two hundred centimetres is twelve metres.',
      },
      wrong: {
        ru: 'Сначала умножьте на сто, а переводите в метры только в самом конце.',
        uz: "Avval yuzga ko'paytiring, metrga esa faqat oxirida o'tkazing.",
        en: 'Multiply by one hundred first and convert to metres only at the end.',
      },
    },
  },

  s_back: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Обратный ход: в жизнь и на макет', uz: 'Teskari yo\'l: hayotdan maketga', en: 'The other way: from life to the model' },
    lines: [
      { ru: 'реальная стена 25 м, масштаб 1 : 500', uz: 'haqiqiy devor 25 m, masshtab 1 : 500', en: 'a real wall of 25 m at 1 : 500' },
      { ru: '25 м = 2500 см', uz: '25 m = 2500 sm', en: '25 m = 2,500 cm' },
      { ru: '2500 : 500 = 5 см на макете', uz: '2500 : 500 = maketda 5 sm', en: '2,500 ÷ 500 = 5 cm on the model' },
    ],
    done: {
      ru: 'Обратный путь: сначала переводим в сантиметры, потом делим на знаменатель масштаба. Умножение и деление меняются местами.',
      uz: "Teskari yo'l: avval santimetrga o'tkazamiz, keyin masshtab maxrajiga bo'lamiz. Ko'paytirish va bo'lish o'rin almashadi.",
      en: 'The way back: convert to centimetres first, then divide by the scale number. Multiplication and division swap places.',
    },
    audio: {
      ru: [
        'Задача бывает и обратной: известен настоящий размер, а нужно нарисовать его на макете.',
        'Стена длиной двадцать пять метров. Переводим в сантиметры: две тысячи пятьсот.',
        'Делим на пятьсот и получаем пять сантиметров. Это и есть длина стены на макете. Порядок действий тот же, только вместо умножения деление.',
      ],
      uz: [
        "Masala teskari ham bo'ladi: haqiqiy o'lcham ma'lum, uni maketda chizish kerak.",
        "Devor uzunligi yigirma besh metr. Santimetrga o'tkazamiz: ikki ming besh yuz.",
        "Besh yuzga bo'lamiz va besh santimetr chiqadi. Bu maketdagi devor uzunligi. Amallar tartibi o'sha, faqat ko'paytirish o'rniga bo'lish.",
      ],
      en: [
        'A problem can also run backwards: the real size is known and it has to be drawn on the model.',
        'A wall is twenty five metres long. Convert to centimetres: two thousand five hundred.',
        'Divide by five hundred and get five centimetres. That is the wall on the model. The same order of steps, only division instead of multiplication.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Карта 1 : 200 000', uz: 'Xarita 1 : 200 000', en: 'A 1 : 200,000 map' },
    lead: { ru: 'На карте отрезок 7 см. Сколько это километров?', uz: 'Xaritada kesma 7 sm. Bu necha kilometr?', en: 'A segment on the map is 7 cm. How many kilometres is that?' },
    steps: [
      { ru: '7 · 200 000 = 1 400 000 см', uz: '7 · 200 000 = 1 400 000 sm', en: '7 · 200,000 = 1,400,000 cm' },
      { ru: '1 000 см = 10 м, 100 000 см = 1 км', uz: '1 000 sm = 10 m, 100 000 sm = 1 km', en: '1,000 cm = 10 m and 100,000 cm = 1 km' },
      { ru: '1 400 000 : 100 000 = 14 км', uz: '1 400 000 : 100 000 = 14 km', en: '1,400,000 ÷ 100,000 = 14 km' },
    ],
    done: {
      ru: 'Ответ 14 км. Полезно запомнить: при масштабе 1 : 100 000 один сантиметр карты равен одному километру.',
      uz: "Javob 14 km. Eslab qolish foydali: 1 : 100 000 masshtabda xaritadagi bir santimetr bir kilometrga teng.",
      en: 'The answer is 14 km. Worth remembering: at 1 : 100,000 one centimetre on the map equals one kilometre.',
    },
    audio: {
      ru: [
        'Решаем вместе. Карта в масштабе один к двумстам тысячам, отрезок семь сантиметров. Умножаем и получаем миллион четыреста тысяч сантиметров.',
        'Переводим в километры. В одном километре сто тысяч сантиметров.',
        'Делим и получаем четырнадцать километров. Заодно запомним удобное правило: при масштабе один к ста тысячам сантиметр карты это ровно километр.',
      ],
      uz: [
        "Birga yechamiz. Xarita bir ga ikki yuz ming masshtabda, kesma yetti santimetr. Ko'paytiramiz va bir million to'rt yuz ming santimetr chiqadi.",
        "Kilometrga o'tkazamiz. Bir kilometrda yuz ming santimetr bor.",
        "Bo'lamiz va o'n to'rt kilometr chiqadi. Qulay qoidani ham eslab qolamiz: bir ga yuz ming masshtabda xaritadagi santimetr roppa-rosa bir kilometr.",
      ],
      en: [
        'Let us solve it together. The map is one to two hundred thousand and the segment is seven centimetres. Multiply and get one million four hundred thousand centimetres.',
        'Convert to kilometres. One kilometre holds one hundred thousand centimetres.',
        'Divide and get fourteen kilometres. And remember a handy rule: at one to one hundred thousand a centimetre on the map is exactly a kilometre.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Единицы и направление масштаба', uz: 'Birliklar va masshtab yo\'nalishi', en: 'Units and the direction of a scale' },
    bad_line: { ru: 'ошибка: 40 см · 100 = 40 м', uz: 'xato: 40 sm · 100 = 40 m', en: 'mistake: 40 cm · 100 = 40 m' },
    good_line: { ru: 'верно: 40 см · 100 = 4000 см = 40 м', uz: "to'g'ri: 40 sm · 100 = 4000 sm = 40 m", en: 'right: 40 cm · 100 = 4,000 cm = 40 m' },
    up_line: { ru: 'а 2 : 1 — это увеличение вдвое, деталь на чертеже больше настоящей', uz: "2 : 1 esa ikki barobar kattalashtirish, chizmadagi detal haqiqiysidan katta", en: 'and 2 : 1 doubles the size: the drawing is larger than the real part' },
    done: {
      ru: 'Единицы переводят в самом конце. И смотрят, где стоит единица: 1 : n уменьшает, n : 1 увеличивает.',
      uz: "Birliklar eng oxirida o'zgartiriladi. Birning qayerda turganiga qaraladi: 1 : n kichraytiradi, n : 1 kattalashtiradi.",
      en: 'Convert the units at the very end. And see where the one stands: 1 : n shrinks, n : 1 enlarges.',
    },
    audio: {
      ru: [
        'Первая ошибка это перевести единицы слишком рано. Сорок сантиметров умножить на сто это четыре тысячи сантиметров, а не сорок метров сразу.',
        'Переводить надо в самом конце, когда умножение уже сделано.',
        'Вторая вещь: масштаб бывает и увеличивающим. Один к ста уменьшает в сто раз, а два к одному увеличивает вдвое. Так чертят мелкие детали, чтобы их было видно.',
      ],
      uz: [
        "Birinchi xato birlikni juda erta o'zgartirish. Qirq santimetrni yuzga ko'paytirsak to'rt ming santimetr chiqadi, darrov qirq metr emas.",
        "Birlikni eng oxirida, ko'paytirish tugagach o'zgartirish kerak.",
        "Ikkinchi narsa: masshtab kattalashtiruvchi ham bo'ladi. Bir ga yuz yuz barobar kichraytiradi, ikki ga bir esa ikki barobar kattalashtiradi. Mayda detallar ko'rinsin deb shunday chiziladi.",
      ],
      en: [
        'The first mistake is converting units too early. Forty centimetres times one hundred is four thousand centimetres, not forty metres straight away.',
        'Convert at the very end, once the multiplication is done.',
        'The second thing: a scale can also enlarge. One to one hundred shrinks a hundred times, while two to one doubles. Tiny parts are drawn that way so they can be seen.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как работает масштаб', uz: 'Masshtab qanday ishlaydi', en: 'How a scale works' },
    rule_1: {
      ru: 'Масштаб 1 : n значит, что 1 см на изображении соответствует n см в жизни. С макета в жизнь — умножаем на n, из жизни на макет — делим на n.',
      uz: "1 : n masshtab tasvirdagi 1 sm hayotdagi n sm ga mos kelishini bildiradi. Maketdan hayotga — n ga ko'paytiramiz, hayotdan maketga — n ga bo'lamiz.",
      en: 'A scale of 1 : n means 1 cm on the image matches n cm in life. Model to life: multiply by n. Life to model: divide by n.',
    },
    rule_2: {
      ru: 'Единицы переводят в конце, а не в начале. Макет: 40 · 100 = 4000 см = 40 м. Права была Дилноза.',
      uz: "Birliklar oxirida o'zgartiriladi, boshida emas. Maket: 40 · 100 = 4000 sm = 40 m. Dilnoza haq edi.",
      en: 'Units are converted at the end, not at the start. The model: 40 · 100 = 4,000 cm = 40 m. Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Масштаб один к эн означает, что один сантиметр на изображении соответствует эн сантиметрам в жизни. Чтобы перейти с макета к настоящему размеру, умножаем на эн, а чтобы наоборот, делим. Единицы переводим в самом конце. Вернёмся к макету. Сорок сантиметров умножить на сто это четыре тысячи сантиметров, то есть сорок метров. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Bir ga en masshtab tasvirdagi bir santimetr hayotdagi en santimetrga mos kelishini bildiradi. Maketdan haqiqiy o'lchamga o'tish uchun en ga ko'paytiramiz, teskarisiga esa bo'lamiz. Birliklarni eng oxirida o'zgartiramiz. Maketga qaytamiz. Qirq santimetr karra yuz bu to'rt ming santimetr, ya'ni qirq metr. Dilnoza haq edi.",
      en: 'Let us remember the rule. A scale of one to n means one centimetre on the image matches n centimetres in life. Going from the model to the real size we multiply by n, going back we divide. Units are converted at the very end. Back to the model. Forty centimetres times one hundred is four thousand centimetres, that is forty metres. Dilnoza was right.',
    },
  },

  s_real: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'С макета в жизнь', uz: 'Maketdan hayotga', en: 'From model to life' },
    lead: { ru: 'Сначала умножь, потом переводи единицы.', uz: "Avval ko'paytiring, keyin birlikni o'zgartiring.", en: 'Multiply first, convert units after.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Модель 8 см, масштаб 1 : 25. Настоящая длина?', uz: 'Model 8 sm, masshtab 1 : 25. Haqiqiy uzunlik?', en: 'A model of 8 cm at 1 : 25. The real length?' },
        opts: [
          { ru: '2 м', uz: '2 m', en: '2 m' },
          { ru: '200 м', uz: '200 m', en: '200 m' },
          { ru: '0,32 м', uz: '0,32 m', en: '0.32 m' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 8 · 25 = 200 см, а это 2 метра.', uz: "To'g'ri. 8 · 25 = 200 sm, bu esa 2 metr.", en: 'Right. 8 · 25 = 200 cm, that is 2 metres.' },
        wrong: [
          null,
          { ru: 'Двести — это сантиметры, а не метры.', uz: 'Ikki yuz bu santimetr, metr emas.', en: 'Two hundred is centimetres, not metres.' },
          { ru: 'Здесь разделили, а с макета в жизнь умножают.', uz: "Bu yerda bo'lingan, maketdan hayotga esa ko'paytiriladi.", en: 'That divided, but going to real size we multiply.' },
        ],
      },
      {
        q: { ru: 'На карте 3 см, масштаб 1 : 100 000. Сколько километров?', uz: 'Xaritada 3 sm, masshtab 1 : 100 000. Necha kilometr?', en: 'On a map 3 cm at 1 : 100,000. How many kilometres?' },
        opts: [
          { ru: '3 км', uz: '3 km', en: '3 km' },
          { ru: '30 км', uz: '30 km', en: '30 km' },
          { ru: '300 м', uz: '300 m', en: '300 m' },
        ],
        correct: 0,
        ok: { ru: 'Верно. При таком масштабе 1 см равен 1 км.', uz: "To'g'ri. Bunday masshtabda 1 sm 1 km ga teng.", en: 'Right. At this scale 1 cm equals 1 km.' },
        wrong: [
          null,
          { ru: '30 км вышло бы при масштабе 1 : 1 000 000.', uz: '30 km 1 : 1 000 000 masshtabda chiqardi.', en: 'Thirty km would come from 1 : 1,000,000.' },
          { ru: 'Слишком мало: 300 000 см это 3 км.', uz: 'Juda kam: 300 000 sm bu 3 km.', en: 'Too little: 300,000 cm is 3 km.' },
        ],
      },
      {
        q: { ru: 'Деталь на чертеже 5 см, масштаб 2 : 1. Настоящий размер?', uz: 'Chizmada detal 5 sm, masshtab 2 : 1. Haqiqiy o\'lcham?', en: 'A part is 5 cm at 2 : 1. The real size?' },
        opts: [
          { ru: '2,5 см', uz: '2,5 sm', en: '2.5 cm' },
          { ru: '10 см', uz: '10 sm', en: '10 cm' },
          { ru: '5 см', uz: '5 sm', en: '5 cm' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Масштаб 2 : 1 увеличивает, значит настоящая деталь вдвое меньше.', uz: "To'g'ri. 2 : 1 masshtab kattalashtiradi, demak haqiqiy detal ikki barobar kichik.", en: 'Right. A 2 : 1 scale enlarges, so the real part is half the drawing.' },
        wrong: [
          null,
          { ru: 'Это увеличение ещё раз, а чертёж уже увеличен.', uz: "Bu yana kattalashtirish, chizma esa allaqachon kattalashtirilgan.", en: 'That enlarges again, but the drawing is already enlarged.' },
          { ru: 'При масштабе 2 : 1 размеры не совпадают.', uz: "2 : 1 masshtabda o'lchamlar mos kelmaydi.", en: 'At 2 : 1 the sizes do not match.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Умножайте на знаменатель масштаба и переводите единицы в конце.',
        uz: "Mashq. Masshtab maxrajiga ko'paytiring va birlikni oxirida o'zgartiring.",
        en: 'Practice. Multiply by the scale number and convert units at the end.',
      },
    },
  },

  s_model: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Из жизни на макет', uz: 'Hayotdan maketga', en: 'From life to the model' },
    lead: { ru: 'Сначала переведи в сантиметры, потом дели.', uz: "Avval santimetrga o'tkazing, keyin bo'ling.", en: 'Convert to centimetres first, then divide.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Реальная длина 12 м, масштаб 1 : 100. На макете?', uz: 'Haqiqiy uzunlik 12 m, masshtab 1 : 100. Maketda?', en: 'A real length of 12 m at 1 : 100. On the model?' },
        opts: [
          { ru: '12 см', uz: '12 sm', en: '12 cm' },
          { ru: '1,2 см', uz: '1,2 sm', en: '1.2 cm' },
          { ru: '120 см', uz: '120 sm', en: '120 cm' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 12 м = 1200 см, делим на 100: 12 см.', uz: "To'g'ri. 12 m = 1200 sm, 100 ga bo'lamiz: 12 sm.", en: 'Right. 12 m = 1,200 cm divided by 100 gives 12 cm.' },
        wrong: [
          null,
          { ru: 'Разделили дважды: сначала на 10, потом на 100.', uz: "Ikki marta bo'lingan: avval 10 ga, keyin 100 ga.", en: 'Divided twice: by 10 and then by 100.' },
          { ru: 'Это длина в сантиметрах без деления на масштаб.', uz: "Bu masshtabga bo'lmagan holdagi santimetrdagi uzunlik.", en: 'That is the length in centimetres without dividing by the scale.' },
        ],
      },
      {
        q: { ru: 'Стадион 90 м, масштаб 1 : 1000. На плане?', uz: 'Stadion 90 m, masshtab 1 : 1000. Rejada?', en: 'A stadium of 90 m at 1 : 1000. On the plan?' },
        opts: [
          { ru: '9 см', uz: '9 sm', en: '9 cm' },
          { ru: '90 см', uz: '90 sm', en: '90 cm' },
          { ru: '0,9 см', uz: '0,9 sm', en: '0.9 cm' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 90 м = 9000 см, делим на 1000: 9 см.', uz: "To'g'ri. 90 m = 9000 sm, 1000 ga bo'lamiz: 9 sm.", en: 'Right. 90 m = 9,000 cm divided by 1,000 gives 9 cm.' },
        wrong: [
          null,
          { ru: 'Забыли разделить на масштаб.', uz: "Masshtabga bo'lish unutilgan.", en: 'The division by the scale was skipped.' },
          { ru: 'Слишком мало: проверь перевод метров в сантиметры.', uz: "Juda kam: metrni santimetrga o'tkazishni tekshiring.", en: 'Too little: check the conversion to centimetres.' },
        ],
      },
      {
        q: { ru: 'Комната 6 м, масштаб 1 : 50. На чертеже?', uz: 'Xona 6 m, masshtab 1 : 50. Chizmada?', en: 'A room of 6 m at 1 : 50. On the drawing?' },
        opts: [
          { ru: '12 см', uz: '12 sm', en: '12 cm' },
          { ru: '6 см', uz: '6 sm', en: '6 cm' },
          { ru: '30 см', uz: '30 sm', en: '30 cm' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 6 м = 600 см, делим на 50: 12 см.', uz: "To'g'ri. 6 m = 600 sm, 50 ga bo'lamiz: 12 sm.", en: 'Right. 6 m = 600 cm divided by 50 gives 12 cm.' },
        wrong: [
          null,
          { ru: 'Это длина в метрах, а нужен размер на чертеже.', uz: "Bu metrdagi uzunlik, kerak bo'lgani chizmadagi o'lcham.", en: 'That is the length in metres, not the drawing size.' },
          { ru: 'Здесь умножили, а надо разделить.', uz: "Bu yerda ko'paytirilgan, kerak bo'lgani bo'lish.", en: 'That multiplied instead of dividing.' },
        ],
      },
      {
        q: { ru: 'Какой масштаб уменьшает сильнее?', uz: 'Qaysi masshtab kuchliroq kichraytiradi?', en: 'Which scale shrinks more?' },
        opts: ['1 : 1000', '1 : 100', '1 : 10'],
        correct: 0,
        ok: { ru: 'Верно. Чем больше второе число, тем сильнее уменьшение.', uz: "To'g'ri. Ikkinchi son qancha katta bo'lsa, kichrayish shuncha kuchli.", en: 'Right. The larger the second number, the stronger the shrinking.' },
        wrong: [
          null,
          { ru: 'Уменьшает в сто раз, а есть вариант сильнее.', uz: "Yuz barobar kichraytiradi, kuchliroq variant ham bor.", en: 'That shrinks a hundred times, but there is a stronger one.' },
          { ru: 'Это самое слабое уменьшение из трёх.', uz: 'Bu uchtasidan eng kuchsiz kichrayish.', en: 'That is the weakest of the three.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на обратный ход. Метры переводим в сантиметры и делим на знаменатель масштаба.',
        uz: "Teskari yo'l mashqi. Metrni santimetrga o'tkazamiz va masshtab maxrajiga bo'lamiz.",
        en: 'Practice going backwards. Convert metres to centimetres and divide by the scale number.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Уменьшает или увеличивает', uz: 'Kichraytiradi yoki kattalashtiradi', en: 'Shrinks or enlarges' },
    lead: { ru: 'Смотри, где стоит единица в записи масштаба.', uz: 'Masshtab yozuvida bir qayerda turganiga qarang.', en: 'See where the one stands in the scale.' },
    bin_a: { ru: 'Уменьшает', uz: 'Kichraytiradi', en: 'Shrinks' },
    bin_b: { ru: 'Увеличивает', uz: 'Kattalashtiradi', en: 'Enlarges' },
    cards: [
      { label: '1 : 100', bin: 'a' },
      { label: '1 : 5', bin: 'a' },
      { label: '1 : 1000', bin: 'a' },
      { label: '2 : 1', bin: 'b' },
      { label: '10 : 1', bin: 'b' },
      { label: '5 : 1', bin: 'b' },
    ],
    hint: {
      ru: 'Единица слева — изображение меньше настоящего. Единица справа — больше.',
      uz: "Chapda bir bo'lsa — tasvir haqiqiydan kichik. O'ngda bir bo'lsa — katta.",
      en: 'One on the left means the image is smaller. One on the right means larger.',
    },
    correct_text: {
      ru: 'Верно. Карты и планы уменьшают, а чертежи мелких деталей увеличивают.',
      uz: "To'g'ri. Xarita va rejalar kichraytiradi, mayda detallar chizmasi esa kattalashtiradi.",
      en: 'Right. Maps and plans shrink, while drawings of tiny parts enlarge.',
    },
    audio: {
      intro: {
        ru: 'Разложите масштабы по двум корзинам. Смотрите, с какой стороны стоит единица.',
        uz: 'Masshtablarni ikki savatga ajrating. Bir qaysi tomonda turganiga qarang.',
        en: 'Sort the scales into two baskets. Look at which side the one is on.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Единица слева уменьшает, справа увеличивает.', uz: "Bu yerga emas. Chapdagi bir kichraytiradi, o'ngdagisi kattalashtiradi.", en: 'Not here. One on the left shrinks, on the right enlarges.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «На макете 25 см, масштаб 1 : 200, значит 5 метров... нет, 50». Проверь.', uz: "Aziz: «Maketda 25 sm, masshtab 1 : 200, demak 5 metr... yo'q, 50». Tekshiring.", en: 'Aziz: “25 cm at 1 : 200 means 5 metres… no, 50.” Check it.' },
        opts: [
          { ru: '50 м верно: 25 · 200 = 5000 см', uz: "50 m to'g'ri: 25 · 200 = 5000 sm", en: '50 m is right: 25 · 200 = 5,000 cm' },
          { ru: 'Верно 5 м', uz: "To'g'risi 5 m", en: 'Five metres is right' },
          { ru: 'Верно 500 м', uz: "To'g'risi 500 m", en: 'Five hundred metres is right' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 5000 сантиметров это 50 метров.', uz: "To'g'ri. 5000 santimetr bu 50 metr.", en: 'Right. Five thousand centimetres is fifty metres.' },
        wrong: [
          null,
          { ru: 'Пять метров вышло бы, если бы забыли множитель.', uz: "Besh metr ko'paytuvchi unutilganda chiqardi.", en: 'Five metres would come from dropping the factor.' },
          { ru: '500 метров это уже 50 000 см.', uz: '500 metr bu 50 000 sm.', en: 'Five hundred metres would be 50,000 cm.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «Масштаб 5 : 1 уменьшает в пять раз». Проверь.', uz: "Dilnoza: «5 : 1 masshtab besh barobar kichraytiradi». Tekshiring.", en: 'Dilnoza: “A 5 : 1 scale shrinks five times.” Check it.' },
        opts: [
          { ru: 'Нет: он увеличивает в пять раз', uz: "Yo'q: u besh barobar kattalashtiradi", en: 'No: it enlarges five times' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Он ничего не меняет', uz: "U hech nimani o'zgartirmaydi", en: 'It changes nothing' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Пять сантиметров на чертеже это один сантиметр в жизни.', uz: "To'g'ri. Chizmadagi besh santimetr hayotdagi bir santimetr.", en: 'Right. Five centimetres on the drawing is one centimetre in life.' },
        wrong: [
          null,
          { ru: 'Уменьшает запись вида 1 : 5, а тут единица справа.', uz: "1 : 5 ko'rinishdagi yozuv kichraytiradi, bu yerda esa bir o'ngda.", en: 'The form 1 : 5 shrinks; here the one is on the right.' },
          { ru: 'Не меняет только масштаб 1 : 1.', uz: "Faqat 1 : 1 masshtab o'zgartirmaydi.", en: 'Only a 1 : 1 scale changes nothing.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в единицах, и в направлении масштаба.',
        uz: "Birovning yechimini tekshiring. Xato birliklarda ham, masshtab yo'nalishida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the units and in the direction of the scale.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Макет школьного двора', uz: 'Maktab hovlisi maketi', en: 'The schoolyard model' },
    lead: { ru: 'Макет в масштабе 1 : 100. Здание на макете 40 см, беговая дорожка настоящая 60 м.', uz: "Maket 1 : 100 masshtabda. Maketda bino 40 sm, haqiqiy yugurish yo'lagi 60 m.", en: 'The model is 1 : 100. The building is 40 cm on it and the real running track is 60 m.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какой длины настоящее здание?', uz: 'Haqiqiy bino qanday uzunlikda?', en: 'How long is the real building?' },
        opts: [
          { ru: '40 м', uz: '40 m', en: '40 m' },
          { ru: '4 м', uz: '4 m', en: '4 m' },
          { ru: '400 м', uz: '400 m', en: '400 m' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 40 · 100 = 4000 см = 40 м.', uz: "To'g'ri. 40 · 100 = 4000 sm = 40 m.", en: 'Right. 40 · 100 = 4,000 cm = 40 m.' },
        wrong: [
          null,
          { ru: 'Единицы перевели слишком рано.', uz: "Birlik juda erta o'zgartirilgan.", en: 'The units were converted too early.' },
          { ru: 'Это уже 40 000 см, лишний ноль.', uz: 'Bu 40 000 sm, ortiqcha nol.', en: 'That would be 40,000 cm: an extra zero.' },
        ],
      },
      {
        q: { ru: 'Какой длины дорожка на макете?', uz: "Maketda yo'lak qanday uzunlikda?", en: 'How long is the track on the model?' },
        opts_i18n: [
          { ru: '60 см', uz: '60 sm', en: '60 cm' },
          { ru: '6 см', uz: '6 sm', en: '6 cm' },
          { ru: '600 см', uz: '600 sm', en: '600 cm' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 60 м = 6000 см, делим на 100: 60 см.', uz: "To'g'ri. 60 m = 6000 sm, 100 ga bo'lamiz: 60 sm.", en: 'Right. 60 m = 6,000 cm divided by 100 gives 60 cm.' },
        wrong: [
          null,
          { ru: 'Разделили на 1000 вместо 100.', uz: "100 o'rniga 1000 ga bo'lingan.", en: 'Divided by 1,000 instead of 100.' },
          { ru: 'Это длина в сантиметрах без деления.', uz: "Bu bo'lmasdan olingan santimetrdagi uzunlik.", en: 'That is the length in centimetres without dividing.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про макет. Масштаб один к ста, здание на макете сорок сантиметров.',
        uz: "Maket haqida masala. Masshtab bir ga yuz, maketdagi bino qirq santimetr.",
        en: 'A model problem. The scale is one to one hundred and the building is forty centimetres.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 5,
        q: { ru: 'На карте 1 : 100 000 отрезок 5 см. Сколько это километров? Набери число.', uz: '1 : 100 000 xaritada kesma 5 sm. Bu necha kilometr? Sonni tering.', en: 'On a 1 : 100,000 map a segment is 5 cm. How many kilometres? Type the number.' },
        hint: { ru: 'При этом масштабе 1 см равен 1 км.', uz: 'Bu masshtabda 1 sm 1 km ga teng.', en: 'At this scale 1 cm equals 1 km.' },
        hint_audio: { ru: 'При масштабе один к ста тысячам один сантиметр карты равен одному километру.', uz: "Bir ga yuz ming masshtabda xaritadagi bir santimetr bir kilometrga teng.", en: 'At a scale of one to one hundred thousand, one centimetre equals one kilometre.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Модель самолёта 30 см, масштаб 1 : 200. Длина самолёта?', uz: 'Samolyot modeli 30 sm, masshtab 1 : 200. Samolyot uzunligi?', en: 'A plane model is 30 cm at 1 : 200. The real length?' },
        opts_i18n: [
          { ru: '6 м', uz: '6 m', en: '6 m' },
          { ru: '600 м', uz: '600 m', en: '600 m' },
          { ru: '60 м', uz: '60 m', en: '60 m' },
          { ru: '0,6 м', uz: '0,6 m', en: '0.6 m' },
        ],
        wrong: [
          { ru: 'Единицы перевели раньше умножения.', uz: "Birlik ko'paytirishdan oldin o'zgartirilgan.", en: 'Units converted before multiplying.' },
          { ru: 'Слишком много: 6000 см это 60 м.', uz: "Juda ko'p: 6000 sm bu 60 m.", en: 'Too much: 6,000 cm is 60 m.' },
          null,
          { ru: 'Здесь разделили, а надо умножить.', uz: "Bu yerda bo'lingan, kerak bo'lgani ko'paytirish.", en: 'That divided instead of multiplying.' },
        ],
        correct: { ru: 'Верно. 30 · 200 = 6000 см = 60 м.', uz: "To'g'ri. 30 · 200 = 6000 sm = 60 m.", en: 'Right. 30 · 200 = 6,000 cm = 60 m.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Что значит масштаб 1 : 500?', uz: '1 : 500 masshtab nimani anglatadi?', en: 'What does a scale of 1 : 500 mean?' },
        opts: [
          { ru: 'Изображение меньше настоящего в 500 раз', uz: 'Tasvir haqiqiydan 500 barobar kichik', en: 'The image is 500 times smaller' },
          { ru: 'Изображение больше в 500 раз', uz: 'Tasvir 500 barobar katta', en: 'The image is 500 times larger' },
          { ru: '1 см равен 500 метрам', uz: '1 sm 500 metrga teng', en: '1 cm equals 500 metres' },
          { ru: 'Размеры совпадают', uz: "O'lchamlar mos", en: 'The sizes match' },
        ],
        wrong: [
          null,
          { ru: 'Увеличивает запись вида 500 : 1.', uz: "500 : 1 ko'rinishdagi yozuv kattalashtiradi.", en: 'The form 500 : 1 enlarges.' },
          { ru: '1 см равен 500 сантиметрам, то есть 5 метрам.', uz: '1 sm 500 santimetrga, ya\'ni 5 metrga teng.', en: 'One centimetre equals 500 centimetres, that is 5 metres.' },
          { ru: 'Совпадают только при 1 : 1.', uz: 'Faqat 1 : 1 da mos keladi.', en: 'They match only at 1 : 1.' },
        ],
        correct: { ru: 'Верно. Первое число это изображение, второе — настоящий размер.', uz: "To'g'ri. Birinchi son tasvir, ikkinchisi haqiqiy o'lcham.", en: 'Right. The first number is the image, the second the real size.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Комната 8 м. Каким будет план в масштабе 1 : 200?', uz: 'Xona 8 m. 1 : 200 masshtabdagi reja qanday?', en: 'A room is 8 m. What is it on a 1 : 200 plan?' },
        opts_i18n: [
          { ru: '8 см', uz: '8 sm', en: '8 cm' },
          { ru: '4 см', uz: '4 sm', en: '4 cm' },
          { ru: '40 см', uz: '40 sm', en: '40 cm' },
          { ru: '0,4 см', uz: '0,4 sm', en: '0.4 cm' },
        ],
        wrong: [
          { ru: 'Забыли разделить на масштаб.', uz: "Masshtabga bo'lish unutilgan.", en: 'The division by the scale was skipped.' },
          null,
          { ru: 'Разделили на 20, а не на 200.', uz: "200 emas, 20 ga bo'lingan.", en: 'Divided by 20 instead of 200.' },
          { ru: 'Слишком мало: 800 разделить на 200 это 4.', uz: "Juda kam: 800 ni 200 ga bo'lsak 4 chiqadi.", en: 'Too little: 800 divided by 200 is 4.' },
        ],
        correct: { ru: 'Верно. 8 м = 800 см, делим на 200: 4 см.', uz: "To'g'ri. 8 m = 800 sm, 200 ga bo'lamiz: 4 sm.", en: 'Right. 8 m = 800 cm divided by 200 gives 4 cm.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Когда используют масштаб вида 10 : 1?', uz: '10 : 1 ko\'rinishdagi masshtab qachon ishlatiladi?', en: 'When is a 10 : 1 scale used?' },
        opts: [
          { ru: 'Для карт областей', uz: 'Viloyatlar xaritasi uchun', en: 'For regional maps' },
          { ru: 'Для планов школы', uz: 'Maktab rejasi uchun', en: 'For school plans' },
          { ru: 'Для макетов зданий', uz: 'Binolar maketi uchun', en: 'For building models' },
          { ru: 'Для чертежей мелких деталей', uz: 'Mayda detallar chizmasi uchun', en: 'For drawings of tiny parts' },
        ],
        wrong: [
          { ru: 'Карты уменьшают: там 1 стоит слева.', uz: 'Xaritalar kichraytiradi: u yerda 1 chapda turadi.', en: 'Maps shrink: the one stands on the left.' },
          { ru: 'План школы тоже уменьшение.', uz: 'Maktab rejasi ham kichrayish.', en: 'A school plan also shrinks.' },
          { ru: 'Макет здания меньше настоящего.', uz: 'Bino maketi haqiqiysidan kichik.', en: 'A building model is smaller than the real one.' },
          null,
        ],
        correct: { ru: 'Верно. Мелкую деталь чертят крупнее, чтобы её было видно.', uz: "To'g'ri. Mayda detal ko'rinsin deb kattaroq chiziladi.", en: 'Right. A tiny part is drawn larger so it can be seen.' },
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
      ru: 'У микроскопа масштаб работает в другую сторону: школьный микроскоп даёт увеличение 400 : 1, и клетка размером в одну сотую миллиметра становится видимой точкой в четыре миллиметра.',
      uz: "Mikroskopda masshtab teskari tomonga ishlaydi: maktab mikroskopi 400 : 1 kattalashtirish beradi va millimetrning yuzdan bir qismidagi hujayra to'rt millimetrli ko'rinadigan nuqtaga aylanadi.",
      en: 'In a microscope the scale works the other way: a school microscope enlarges 400 : 1, so a cell a hundredth of a millimetre across becomes a visible four millimetre dot.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? У микроскопа масштаб работает в другую сторону. Школьный микроскоп увеличивает в четыреста раз, и клетка размером в одну сотую миллиметра становится видимой точкой в четыре миллиметра.',
      uz: "Bilasizmi? Mikroskopda masshtab teskari tomonga ishlaydi. Maktab mikroskopi to'rt yuz barobar kattalashtiradi va millimetrning yuzdan bir qismidagi hujayra to'rt millimetrli ko'rinadigan nuqtaga aylanadi.",
      en: 'Did you know? In a microscope the scale works the other way. A school microscope enlarges four hundred times, so a cell a hundredth of a millimetre across becomes a visible four millimetre dot.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Масштаб', uz: 'Matematika · Masshtab', en: 'Mathematics · Scale' },
    heading: { ru: 'Масштаб', uz: 'Masshtab', en: 'Scale' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: '1 : n значит уменьшение в n раз', uz: '1 : n demak n barobar kichrayish', en: '1 : n means shrinking n times' },
    brief_2: { ru: 'с макета в жизнь — умножаем', uz: "maketdan hayotga — ko'paytiramiz", en: 'model to life: multiply' },
    brief_3: { ru: 'из жизни на макет — делим', uz: "hayotdan maketga — bo'lamiz", en: 'life to model: divide' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Единицы', uz: 'Birliklar', en: 'Units' },
    memo_a1: { ru: 'переводим в самом конце', uz: "eng oxirida o'zgartiramiz", en: 'convert at the very end' },
    memo_q2: { ru: 'Полезное правило', uz: 'Foydali qoida', en: 'A handy rule' },
    memo_a2: { ru: 'при 1 : 100 000 один см это 1 км', uz: '1 : 100 000 da bir sm bu 1 km', en: 'at 1 : 100,000 one cm is 1 km' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'перевести метры раньше умножения', uz: "metrni ko'paytirishdan oldin o'zgartirish", en: 'converting metres before multiplying' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Масштаб один к эн значит уменьшение в эн раз. С изображения в жизнь умножаем, из жизни на изображение делим, а единицы переводим в самом конце.',
        'Макет: сорок сантиметров умножить на сто это четыре тысячи сантиметров, то есть сорок метров.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Bir ga en masshtab en barobar kichrayishni bildiradi. Tasvirdan hayotga ko'paytiramiz, hayotdan tasvirga bo'lamiz, birliklarni esa eng oxirida o'zgartiramiz.",
        "Maket: qirq santimetr karra yuz bu to'rt ming santimetr, ya'ni qirq metr.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'A scale of one to n means shrinking n times. Image to life we multiply, life to image we divide, and units are converted at the very end.',
        'The model: forty centimetres times one hundred is four thousand centimetres, that is forty metres.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Умножай, потом переводи', uz: "Usul. Ko'paytiring, keyin o'tkazing", en: 'Method. Multiply, then convert' },
    m1_steps: {
      ru: ['Определи направление: с макета или на макет', 'Умножь или раздели на число масштаба', 'Переведи единицы в самом конце'],
      uz: ["Yo'nalishni aniqlang: maketdanmi yoki maketgami", "Masshtab soniga ko'paytiring yoki bo'ling", "Birliklarni eng oxirida o'zgartiring"],
      en: ['Decide the direction: from the model or to it', 'Multiply or divide by the scale number', 'Convert the units at the very end'],
    },
    m1_no: {
      ru: 'Запись 1 : n уменьшает, n : 1 увеличивает. В школьных задачах чаще встречается первая.',
      uz: "1 : n yozuvi kichraytiradi, n : 1 kattalashtiradi. Maktab masalalarida ko'proq birinchisi uchraydi.",
      en: 'The form 1 : n shrinks and n : 1 enlarges. School problems mostly use the first.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кружок моделирования. На хуке вопрос, в итоге ответ.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d20wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d20wall)"/>

    {/* Полка с готовыми моделями и лампа над столом */}
    <g opacity="0.8">
      <rect x="12" y="30" width="80" height="6" rx="2" fill="#C9A472"/>
      <rect x="18" y="16" width="18" height="14" rx="2" fill="#D98A5A"/>
      <path d="M42 30 l10 -12 l10 12 Z" fill="#8FBF7F"/>
      <rect x="68" y="18" width="18" height="12" rx="2" fill="#7ECBE6"/>
    </g>
    <g>
      <path d="M300 0 v14" stroke="#B08A57" strokeWidth="2"/>
      <path d="M286 14 h28 l-8 12 h-12 Z" fill="#E8A33C"/>
      <circle cx="300" cy="28" r="3" fill="#FBF3D6" className="d20-lamp"/>
    </g>

    {/* Стол с макетом: здание, дорожка, деревья. Линейка рядом */}
    <rect x="0" y="104" width="400" height="50" fill="#D2A96F"/>
    <rect x="0" y="104" width="400" height="5" fill="#C9884A"/>
    <g>
      <rect x="120" y="72" width="160" height="32" rx="3" fill="#F1E4CB" stroke="#C9A472"/>
      {/* здание макета */}
      <rect x="132" y="52" width="86" height="34" rx="2" fill="#E5DAC6" stroke="#C9A472" strokeWidth="1.6"/>
      <path d="M128 52 L175 36 L222 52 Z" fill="#D2A96F"/>
      {[140, 158, 176, 194].map((wx) => <rect key={wx} x={wx} y="60" width="10" height="10" rx="1.5" fill="#DCEDF5"/>)}
      {/* дорожка и деревья */}
      <path d="M226 86 q22 -10 46 -2" stroke="#C9884A" strokeWidth="4" fill="none"/>
      {[238, 258].map((tx) => (
        <g key={tx}>
          <rect x={tx} y="66" width="3" height="10" fill="#B08A57"/>
          <circle cx={tx + 1.5} cy="62" r="6" fill="#8FBF7F"/>
        </g>
      ))}
    </g>
    {/* линейка под макетом: деления есть, подписи НЕТ */}
    <g className="d20-ruler">
      <rect x="120" y="110" width="160" height="12" rx="2" fill="#FBF3D6" stroke="#C9A472"/>
      {[128, 144, 160, 176, 192, 208, 224, 240, 256, 272].map((lx) => (
        <path key={lx} d={`M${lx} 110 v6`} stroke="#C9A472" strokeWidth="1"/>
      ))}
    </g>

    {/* Дети у стола */}
    <Person x={64} ground={132} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={332} ground={132} head={13} shirt="#F5C77E" hair="#5A4636"/>

    {/* Ножницы и клей на столе */}
    <g>
      <path d="M300 128 l14 -8" stroke="#8E8578" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M300 136 l14 -8" stroke="#8E8578" strokeWidth="2.4" strokeLinecap="round"/>
      <rect x="26" y="118" width="12" height="18" rx="3" fill="#FFFDF7" stroke="#C9A472"/>
    </g>
  </svg>
);

// Итог: макет и настоящая школа рядом с подписями.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g>
      <rect x="30" y="44" width="52" height="22" rx="2" fill="#E5DAC6" stroke="#C9A472"/>
      <path d="M26 44 L56 32 L86 44 Z" fill="#D2A96F"/>
      <text x="56" y="82" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">40 cm</text>
    </g>
    <text x="150" y="56" textAnchor="middle" fill="#C99B3A"
      fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">· 100</text>
    <g>
      <rect x="210" y="20" width="140" height="46" rx="3" fill="#E5DAC6" stroke="#C9A472"/>
      <path d="M202 20 L280 2 L358 20 Z" fill="#D2A96F"/>
      {[224, 254, 284, 314].map((wx) => <rect key={wx} x={wx} y="32" width="18" height="16" rx="2" fill="#DCEDF5"/>)}
      <text x="280" y="82" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">40 m</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Пара «изображение и жизнь»: два прямоугольника с подписями.
const Pair = ({ small, big, capSmall, capBig, factor }) => (
  <span className="d20-pair-fig">
    <span className="d20-box" style={{ width: small, height: Math.round(small * 0.55) }}/>
    <span className="d20-factor">{factor}</span>
    <span className="d20-box d20-box-real" style={{ width: big, height: Math.round(big * 0.55) }}/>
    <span className="d20-caps"><i>{capSmall}</i><i>{capBig}</i></span>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d20-line d20-fade' + (on ? ' d20-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d20-stage">
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        <span className={'d20-scale d20-fade' + (step >= 2 ? ' d20-on' : '')}>
          <b>1</b><span className="d20-op">:</span><b>100</b>
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

// Ядро: макет и жизнь рядом, три строки перевода.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d20-stage">
        <Pair small={40} big={step >= 1 ? 150 : 40} capSmall="40 cm" capBig={step >= 2 ? '40 m' : '?'} factor="· 100"/>
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

const BackBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_back;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d20-stage">
        <Pair small={step >= 2 ? 30 : 0} big={150} capSmall={step >= 2 ? '5 cm' : '?'} capBig="25 m" factor=": 500"/>
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
      <div className="frame fade-up delay-1 d20-stage">
        <span className="d20-table">
          <span className="d20-trow"><b>cm</b><i>1</i><i>7</i></span>
          <span className="d20-trow"><b>km</b><i>1</i><i className={step >= 2 ? 'ok' : 'q'}>{step >= 2 ? '14' : '?'}</i></span>
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

// Граница: единицы в конце и увеличивающий масштаб.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d20-stage">
        <span className="d20-pair d20-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d20-pair d20-pair-good d20-fade' + (step >= 1 ? ' d20-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d20-pair d20-pair-warn d20-fade' + (step >= 2 ? ' d20-on' : '')}>
          <Line node={t(c.up_line)} on/>
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
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d20-banner fade-up delay-1' + (phase === 'play' ? ' d20-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d20-stage d20-stage-tool">
          {phase === 'demo' ? (
            <>
              <Pair small={26} big={done ? 120 : 26} capSmall="6 cm" capBig={done ? '3 m' : '?'} factor="· 50"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d20-verdict' + (done ? ' d20-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d20-acts fade-up">
            <button className="d20-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d20-btn d20-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenBack = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_back} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <BackBody step={step}/>}/>
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
      <div className="d20-stage">
        <Pair small={34} big={130} capSmall="40 cm" capBig="40 m" factor="· 100"/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenReal = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_real} asideNode={methodAside}/>
);
const ScreenModel = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_model} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: макет школы, во втором задании беговая дорожка.
const TaskFig = ({ idx }) => (
  <div className="d20-task-fig">
    <span className="d20-table">
      <span className="d20-trow"><b>maket</b><i>{idx >= 1 ? '?' : '40 cm'}</i></span>
      <span className="d20-trow"><b>hayot</b><i className={idx >= 1 ? '' : 'q'}>{idx >= 1 ? '60 m' : '?'}</i></span>
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
.d20-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d20-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d20-stage-tool .d20-line { font-size: clamp(12px, 2vw, 16px); }

/* Пара «изображение и жизнь» */
.d20-pair-fig { display: grid; grid-template-columns: auto auto auto; align-items: end; justify-items: center; gap: clamp(8px, 2vw, 16px); }
.d20-box { display: block; background: #E5DAC6; border: 2px solid #C9A472; border-radius: 4px; transition: width 600ms ease, height 600ms ease; }
.d20-box-real { background: #F5C77E; border-color: #C99B3A; }
.d20-factor { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #C99B3A; align-self: center; }
.d20-caps { grid-column: 1 / -1; display: flex; justify-content: space-between; width: 100%; }
.d20-caps i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.2vw, 16px); font-weight: 700; color: #8A8883; }

/* Масштаб крупно */
.d20-scale { display: inline-flex; align-items: center; gap: 8px; padding: 5px 14px; border-radius: 12px; background: #E3F0E8; opacity: 0; transition: opacity 380ms linear; }
.d20-scale b { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px, 3.8vw, 30px); color: #1F7A4D; }
.d20-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 22px); color: #8A8883; }

/* Таблица величин */
.d20-table { display: flex; flex-direction: column; gap: 4px; }
.d20-trow { display: inline-flex; align-items: center; gap: 4px; }
.d20-trow b { min-width: clamp(36px, 7vw, 54px); font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 1.9vw, 14px); color: #8A8883; text-align: right; }
.d20-trow i { font-style: normal; display: grid; place-items: center; min-width: clamp(52px, 11vw, 84px); height: clamp(26px, 4.6vw, 36px); border-radius: 8px; background: #F7F0E2; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }
.d20-trow i.q { background: #FBF3D6; border-color: #E4CE93; color: #C99B3A; }
.d20-trow i.ok { background: #E3F0E8; border-color: #A9CFBA; color: #1F7A4D; }

.d20-fade { opacity: 0; transition: opacity 420ms linear; }
.d20-on { opacity: 1; }
.d20-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; }

/* Строки экрана границы */
.d20-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d20-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d20-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d20-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d20-task-fig { display: flex; justify-content: center; }

/* Экран 4 */
.d20-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d20-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d20-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d20-verdict-on { opacity: 1; }
.d20-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d20-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d20-btn:disabled { opacity: 0.45; cursor: default; }
.d20-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d20-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: лампа над столом и линейка */
.d20-lamp { animation: d20Lamp 3200ms ease-in-out infinite; }
@keyframes d20Lamp { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
.d20-ruler { animation: d20Ruler 6400ms ease-in-out infinite; }
@keyframes d20Ruler { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
@media (prefers-reduced-motion: reduce) { .d20-lamp, .d20-ruler { animation: none; } }

@media (max-width: 639.98px) {
  .d20-trow i { min-width: 48px; height: 24px; font-size: 12px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function ScaleLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenBack, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenReal, ScreenModel, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
