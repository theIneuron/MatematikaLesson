// ============================================================
// 6 КЛАСС, УРОК 18 «Пропорция»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок 17 дал отношение. Здесь два отношения ставят рядом и получают
// пропорцию — уравнение, в котором можно найти неизвестное. Основное
// свойство пропорции проверяется тем же счётом, что и равенство дробей.
//
// Сцена — кружок краеведения: карта похода и масштабная линейка.
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
  lessonId: 'grade6-18',
  lessonTitle: {
    ru: 'Пропорция',
    uz: 'Proporsiya',
    en: 'Proportion',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 xarita: 1 sm uch km
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 teng nisbatlar esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 proporsiya va asosiy xossa
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: nomaʼlum hadni topish
  { id: 's_scale',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 masshtab ham proporsiya
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: daftarlar
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: tartib va tekshirish
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_check',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 proporsiya to'g'rimi x3
  { id: 's_find',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 nomaʼlum hadni topish x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: to'g'ri yoki noto'g'ri
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: xarita
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Карта похода', uz: 'Yurish xaritasi', en: 'The hiking map' },
    lead: {
      ru: 'На карте от школы до родника 4 см. В масштабе 1 см — это 3 км на местности.',
      uz: "Xaritada maktabdan buloqqacha 4 sm. Masshtabda 1 sm bu joyida 3 km.",
      en: 'On the map the spring is 4 cm from school. In this scale 1 cm means 3 km on the ground.',
    },
    voice_a: { ru: 'Азиз: значит идти 7 км.', uz: "Aziz: demak 7 km yurish kerak.", en: 'Aziz: so the walk is 7 km.' },
    voice_b: { ru: 'Дилноза: нет, 12 км.', uz: "Dilnoza: yo'q, 12 km.", en: 'Dilnoza: no, 12 km.' },
    ask: { ru: 'Сколько километров до родника?', uz: 'Buloqqacha necha kilometr?', en: 'How far is the spring?' },
    options: [
      { ru: '7 км', uz: '7 km', en: '7 km' },
      { ru: '12 км', uz: '12 km', en: '12 km' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Кружок краеведения готовит поход. На карте от школы до родника четыре сантиметра, а масштаб такой: один сантиметр это три километра.',
          'Азиз говорит, что идти семь километров, а Дилноза что двенадцать. Сколько километров до родника? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "O'lkashunoslik to'garagi yurishga tayyorlanyapti. Xaritada maktabdan buloqqacha to'rt santimetr, masshtab esa shunday: bir santimetr bu uch kilometr.",
          "Aziz yetti kilometr yurish kerak deydi, Dilnoza esa o'n ikki deydi. Buloqqacha necha kilometr? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The local history club is planning a hike. On the map the spring is four centimetres from school and the scale says one centimetre is three kilometres.',
          'Aziz says the walk is seven kilometres, Dilnoza says twelve. How far is the spring? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Равные отношения', uz: 'Teng nisbatlar', en: 'Equal ratios' },
    rows: [
      { a: 2, b: 3 },
      { a: 4, b: 6 },
      { a: 6, b: 9 },
    ],
    done: {
      ru: 'Все три записи упрощаются до 2 : 3. Равные отношения — заготовка для сегодняшней темы.',
      uz: "Uchala yozuv ham soddalashib 2 : 3 bo'ladi. Teng nisbatlar — bugungi mavzuning tayyorgarligi.",
      en: 'All three simplify to 2 : 3. Equal ratios are the groundwork for today.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Отношение два к трём.',
        'Четыре к шести и шесть к девяти упрощаются до того же самого отношения.',
        'Значит эти записи можно соединить знаком равенства. Именно такое равенство мы сегодня и назовём по имени.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Ikki ning uchga nisbati.",
        "To'rt ning oltiga va olti ning to'qqizga nisbati o'sha nisbatga soddalashadi.",
        "Demak bu yozuvlarni tenglik belgisi bilan bog'lash mumkin. Aynan shu tenglikka bugun nom beramiz.",
      ],
      en: [
        'Recall the last lesson. The ratio two to three.',
        'Four to six and six to nine simplify to the very same ratio.',
        'So these can be joined by an equals sign. That equality is what we name today.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Пропорция и её проверка', uz: 'Proporsiya va uni tekshirish', en: 'A proportion and its check' },
    prop: { a: 2, b: 3, c: 4, d: 6 },
    lines: [
      { ru: '2 : 3 = 4 : 6 — это пропорция', uz: '2 : 3 = 4 : 6 — bu proporsiya', en: '2 : 3 = 4 : 6 is a proportion' },
      { ru: 'крайние 2 и 6, средние 3 и 4', uz: "chetkilar 2 va 6, o'rtadagilar 3 va 4", en: 'the outer terms are 2 and 6, the inner ones 3 and 4' },
      { ru: '2 · 6 = 12 и 3 · 4 = 12', uz: '2 · 6 = 12 va 3 · 4 = 12', en: '2 · 6 = 12 and 3 · 4 = 12' },
    ],
    done: {
      ru: 'В верной пропорции произведение крайних равно произведению средних. Это и есть основное свойство пропорции — способ проверить любое такое равенство.',
      uz: "To'g'ri proporsiyada chetki hadlar ko'paytmasi o'rtadagilar ko'paytmasiga teng. Bu proporsiyaning asosiy xossasi — har qanday shunday tenglikni tekshirish usuli.",
      en: 'In a true proportion the product of the outer terms equals the product of the inner ones. That is the basic property: a way to check any such equality.',
    },
    audio: {
      ru: [
        'Равенство двух отношений называют пропорцией. Два к трём равно четыре к шести.',
        'У пропорции есть имена членов. Крайние это первое и последнее число, средние это два числа внутри.',
        'Перемножим крайние: два умножить на шесть двенадцать. Перемножим средние: три умножить на четыре тоже двенадцать. В верной пропорции эти произведения всегда совпадают.',
      ],
      uz: [
        "Ikki nisbatning tengligi proporsiya deyiladi. Ikki ning uchga nisbati to'rt ning oltiga nisbatiga teng.",
        "Proporsiyada hadlarning nomi bor. Chetkilari birinchi va oxirgi son, o'rtadagilari ichkaridagi ikki son.",
        "Chetkilarni ko'paytiramiz: ikki karra olti o'n ikki. O'rtadagilarni ko'paytiramiz: uch karra to'rt ham o'n ikki. To'g'ri proporsiyada bu ko'paytmalar doim mos keladi.",
      ],
      en: [
        'An equality of two ratios is called a proportion. Two to three equals four to six.',
        'The terms have names. The outer ones are the first and the last number, the inner ones are the two in the middle.',
        'Multiply the outer terms: two times six is twelve. Multiply the inner ones: three times four is twelve as well. In a true proportion these products always match.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Ищем неизвестный член', uz: "Noma'lum hadni qidiramiz", en: 'Finding the unknown term' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '3 : 4 = x : 12', uz: '3 : 4 = x : 12', en: '3 : 4 = x : 12' },
      { ru: 'крайние 3 и 12, средние 4 и x', uz: "chetkilar 3 va 12, o'rtadagilar 4 va x", en: 'outer 3 and 12, inner 4 and x' },
      { ru: '3 · 12 = 4 · x → x = 36 : 4 = 9', uz: '3 · 12 = 4 · x → x = 36 : 4 = 9', en: '3 · 12 = 4 · x → x = 36 ÷ 4 = 9' },
    ],
    demo_note: {
      ru: 'Неизвестный средний член находят так: перемножают крайние и делят на известный средний.',
      uz: "Noma'lum o'rta had shunday topiladi: chetkilar ko'paytiriladi va ma'lum o'rta hadga bo'linadi.",
      en: 'An unknown inner term is found this way: multiply the outer terms and divide by the known inner one.',
    },
    play_ask: { ru: 'Найди x в пропорции 2 : 5 = 6 : x', uz: '2 : 5 = 6 : x proporsiyada x ni toping', en: 'Find x in the proportion 2 : 5 = 6 : x' },
    play_opts: ['9', '15', '12'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. Средние 5 и 6, их произведение 30, делим на крайний 2: x = 15.',
      uz: "To'g'ri. O'rtadagilar 5 va 6, ko'paytmasi 30, chetki 2 ga bo'lamiz: x = 15.",
      en: 'Right. The inner terms 5 and 6 give 30, divided by the outer 2: x = 15.',
    },
    play_wrong: [
      { ru: 'Это разность, а не результат пропорции: проверь перемножением.', uz: "Bu ayirma, proporsiya natijasi emas: ko'paytirib tekshiring.", en: 'That is a difference, not the proportion result: check by multiplying.' },
      null,
      { ru: 'Проверь: 2 · 12 = 24, а 5 · 6 = 30. Не сходится.', uz: 'Tekshiring: 2 · 12 = 24, 5 · 6 = 30. Mos kelmadi.', en: 'Check: 2 · 12 = 24 but 5 · 6 = 30. They do not match.' },
    ],
    audio: {
      intro: {
        ru: 'Основное свойство пропорции работает не только для проверки. Оно помогает найти неизвестное число. Покажу на примере три к четырём равно икс к двенадцати.',
        uz: "Proporsiyaning asosiy xossasi faqat tekshirish uchun emas. U noma'lum sonni topishga yordam beradi. Uch ning to'rtga nisbati iks ning o'n ikkiga nisbatiga teng misolida ko'rsataman.",
        en: 'The basic property is not only for checking. It helps find an unknown number. I will show it on three to four equals x to twelve.',
      },
      demo: {
        ru: 'Крайние это три и двенадцать, их произведение тридцать шесть. Средние это четыре и икс. Значит четыре умножить на икс равно тридцать шесть, и икс равен девяти.',
        uz: "Chetkilar uch va o'n ikki, ko'paytmasi o'ttiz olti. O'rtadagilar to'rt va iks. Demak to'rt karra iks o'ttiz oltiga teng va iks to'qqizga teng.",
        en: 'The outer terms are three and twelve with product thirty six. The inner ones are four and x. So four times x is thirty six and x is nine.',
      },
      play: {
        ru: 'Теперь ваша очередь. Найдите икс в пропорции два к пяти равно шесть к икс.',
        uz: "Endi sizning navbatingiz. Ikki ning beshga nisbati olti ning iksga nisbatiga teng, iksni toping.",
        en: 'Now it is your turn. Find x in the proportion two to five equals six to x.',
      },
      ok: {
        ru: 'Верно. Пять умножить на шесть тридцать, разделить на два пятнадцать.',
        uz: "To'g'ri. Besh karra olti o'ttiz, ikkiga bo'lsak o'n besh.",
        en: 'Right. Five times six is thirty, divided by two is fifteen.',
      },
      wrong: {
        ru: 'Перемножьте два известных числа, стоящих напротив друг друга, и разделите на третье.',
        uz: "Bir-biriga qarama-qarshi turgan ikki ma'lum sonni ko'paytiring va uchinchisiga bo'ling.",
        en: 'Multiply the two known numbers standing opposite each other and divide by the third.',
      },
    },
  },

  s_scale: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Масштаб — это тоже пропорция', uz: 'Masshtab ham proporsiya', en: 'Scale is a proportion too' },
    lines: [
      { ru: '1 см : 3 км = 4 см : x', uz: '1 sm : 3 km = 4 sm : x', en: '1 cm : 3 km = 4 cm : x' },
      { ru: '1 · x = 3 · 4', uz: '1 · x = 3 · 4', en: '1 · x = 3 · 4' },
      { ru: 'x = 12 км', uz: 'x = 12 km', en: 'x = 12 km' },
    ],
    done: {
      ru: 'Карта хранит одно и то же отношение для любого отрезка. До родника 12 км — права была Дилноза.',
      uz: "Xarita har qanday kesma uchun bir xil nisbatni saqlaydi. Buloqqacha 12 km — Dilnoza haq edi.",
      en: 'A map keeps the same ratio for every segment. The spring is 12 km away, so Dilnoza was right.',
    },
    audio: {
      ru: [
        'Вернёмся к карте. Масштаб один сантиметр к трём километрам держится на всей карте, значит четыре сантиметра относятся к искомому расстоянию так же.',
        'Записываем пропорцию и применяем основное свойство: один умножить на икс равно три умножить на четыре.',
        'Получается двенадцать километров. Азиз прибавил три к четырём, а надо было умножить. Права была Дилноза.',
      ],
      uz: [
        "Xaritaga qaytamiz. Bir santimetrning uch kilometrga masshtabi butun xaritada saqlanadi, demak to'rt santimetr ham izlanayotgan masofaga xuddi shunday nisbatda.",
        "Proporsiyani yozamiz va asosiy xossani qo'llaymiz: bir karra iks teng uch karra to'rt.",
        "O'n ikki kilometr chiqadi. Aziz uchni to'rtga qo'shdi, ko'paytirish kerak edi. Dilnoza haq edi.",
      ],
      en: [
        'Back to the map. The scale one centimetre to three kilometres holds everywhere, so four centimetres relate to the distance in the same way.',
        'Write the proportion and apply the basic property: one times x equals three times four.',
        'That gives twelve kilometres. Aziz added three to four when he should have multiplied. Dilnoza was right.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: '5 тетрадей стоят 12 500 сум', uz: "5 ta daftar 12 500 so'm", en: '5 notebooks cost 12,500' },
    lead: { ru: 'Сколько заплатим за 8 таких тетрадей?', uz: "Shunday 8 ta daftar uchun qancha to'laymiz?", en: 'What do 8 such notebooks cost?' },
    steps: [
      { ru: '5 : 12 500 = 8 : x', uz: '5 : 12 500 = 8 : x', en: '5 : 12,500 = 8 : x' },
      { ru: '5 · x = 12 500 · 8 = 100 000', uz: '5 · x = 12 500 · 8 = 100 000', en: '5 · x = 12,500 · 8 = 100,000' },
      { ru: 'x = 100 000 : 5 = 20 000', uz: 'x = 100 000 : 5 = 20 000', en: 'x = 100,000 ÷ 5 = 20,000' },
    ],
    done: {
      ru: 'Восемь тетрадей стоят 20 000 сум. Проверка: одна тетрадь 2500, восемь по 2500 дают то же самое.',
      uz: "Sakkiz daftar 20 000 so'm. Tekshiruv: bitta daftar 2500, sakkiztasi 2500 dan xuddi shuni beradi.",
      en: 'Eight notebooks cost 20,000. Check: one notebook is 2,500 and eight of them give the same.',
    },
    audio: {
      ru: [
        'Решаем вместе. Пять тетрадей стоят двенадцать тысяч пятьсот сумов. Записываем пропорцию: пять относится к двенадцати тысячам пятистам так же, как восемь к неизвестной цене.',
        'По основному свойству пять умножить на икс равно двенадцать тысяч пятьсот умножить на восемь, то есть сто тысяч.',
        'Икс равен двадцати тысячам. Проверим иначе: одна тетрадь стоит две тысячи пятьсот, восемь тетрадей двадцать тысяч. Сходится.',
      ],
      uz: [
        "Birga yechamiz. Besh daftar o'n ikki ming besh yuz so'm turadi. Proporsiyani yozamiz: besh ning o'n ikki ming besh yuzga nisbati sakkiz ning noma'lum narxga nisbatiga teng.",
        "Asosiy xossaga ko'ra besh karra iks teng o'n ikki ming besh yuz karra sakkiz, ya'ni yuz ming.",
        "Iks yigirma mingga teng. Boshqacha tekshiramiz: bitta daftar ikki ming besh yuz, sakkiz daftar yigirma ming. To'g'ri keldi.",
      ],
      en: [
        'Let us solve it together. Five notebooks cost twelve thousand five hundred. Write the proportion: five is to twelve thousand five hundred as eight is to the unknown price.',
        'By the basic property five times x equals twelve thousand five hundred times eight, that is one hundred thousand.',
        'So x is twenty thousand. Another check: one notebook is two thousand five hundred and eight of them make twenty thousand. It matches.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Порядок величин и проверка', uz: 'Kattaliklar tartibi va tekshiruv', en: 'Order of quantities and the check' },
    bad_line: { ru: 'ошибка: 5 : 12 500 = x : 8', uz: 'xato: 5 : 12 500 = x : 8', en: 'mistake: 5 : 12,500 = x : 8' },
    good_line: { ru: 'верно: 5 : 12 500 = 8 : x', uz: "to'g'ri: 5 : 12 500 = 8 : x", en: 'right: 5 : 12,500 = 8 : x' },
    check_line: { ru: 'проверка: 5 · 20 000 = 12 500 · 8', uz: 'tekshiruv: 5 · 20 000 = 12 500 · 8', en: 'check: 5 · 20,000 = 12,500 · 8' },
    done: {
      ru: 'В обеих частях пропорции величины идут в одном порядке: сначала тетради, потом деньги. И готовую пропорцию всегда проверяют перемножением.',
      uz: "Proporsiyaning ikkala qismida kattaliklar bir tartibda turadi: avval daftarlar, keyin pul. Tayyor proporsiya esa doim ko'paytirib tekshiriladi.",
      en: 'On both sides of a proportion the quantities keep the same order: notebooks first, money second. And a finished proportion is always checked by multiplying.',
    },
    audio: {
      ru: [
        'Главная ошибка это перепутать порядок величин. Слева сначала тетради, потом цена, значит справа должно быть так же.',
        'Если записать пять к двенадцати тысячам пятистам равно икс к восьми, то слева тетради и деньги, а справа деньги и тетради. Ответ выйдет неверным.',
        'И последнее. Готовую пропорцию всегда проверяйте перемножением крайних и средних. Если произведения совпали, решение верное.',
      ],
      uz: [
        "Asosiy xato kattaliklar tartibini chalkashtirish. Chapda avval daftarlar, keyin narx, demak o'ngda ham shunday bo'lishi kerak.",
        "Agar besh ning o'n ikki ming besh yuzga nisbati iks ning sakkizga nisbatiga teng deb yozsak, chapda daftar va pul, o'ngda esa pul va daftar bo'ladi. Javob noto'g'ri chiqadi.",
        "Va oxirgisi. Tayyor proporsiyani doim chetkilar va o'rtadagilarni ko'paytirib tekshiring. Ko'paytmalar mos kelsa, yechim to'g'ri.",
      ],
      en: [
        'The main mistake is mixing up the order of quantities. On the left it is notebooks then price, so the right side must follow the same order.',
        'Writing five to twelve thousand five hundred equals x to eight puts notebooks and money on the left but money and notebooks on the right. The answer comes out wrong.',
        'And finally. Always check a finished proportion by multiplying the outer and inner terms. If the products match, the solution is right.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Основное свойство пропорции', uz: 'Proporsiyaning asosiy xossasi', en: 'The basic property of a proportion' },
    rule_1: {
      ru: 'Пропорция — равенство двух отношений. В верной пропорции произведение крайних членов равно произведению средних.',
      uz: "Proporsiya — ikki nisbatning tengligi. To'g'ri proporsiyada chetki hadlar ko'paytmasi o'rtadagilar ko'paytmasiga teng.",
      en: 'A proportion is an equality of two ratios. In a true proportion the product of the outer terms equals the product of the inner ones.',
    },
    rule_2: {
      ru: 'Неизвестный член находят так же: перемножают два известных, стоящих напротив, и делят на третий. Карта: 1 : 3 = 4 : 12, до родника 12 км. Права была Дилноза.',
      uz: "Noma'lum had ham shunday topiladi: qarama-qarshi turgan ikki ma'lum son ko'paytiriladi va uchinchisiga bo'linadi. Xarita: 1 : 3 = 4 : 12, buloqqacha 12 km. Dilnoza haq edi.",
      en: 'An unknown term is found the same way: multiply the two known opposite numbers and divide by the third. The map: 1 : 3 = 4 : 12, the spring is 12 km away. Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Пропорция это равенство двух отношений, и в верной пропорции произведение крайних членов равно произведению средних. Неизвестный член находят по этому же свойству: перемножают два известных числа, стоящих напротив друг друга, и делят на третье. Вернёмся к карте. Один сантиметр к трём километрам равно четыре сантиметра к двенадцати километрам. До родника двенадцать километров, права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Proporsiya bu ikki nisbatning tengligi va to'g'ri proporsiyada chetki hadlar ko'paytmasi o'rtadagilar ko'paytmasiga teng. Noma'lum had ham shu xossa bilan topiladi: qarama-qarshi turgan ikki ma'lum son ko'paytiriladi va uchinchisiga bo'linadi. Xaritaga qaytamiz. Bir santimetrning uch kilometrga nisbati to'rt santimetrning o'n ikki kilometrga nisbatiga teng. Buloqqacha o'n ikki kilometr, Dilnoza haq edi.",
      en: 'Let us remember the rule. A proportion is an equality of two ratios, and in a true one the product of the outer terms equals the product of the inner ones. An unknown term is found by the same property: multiply the two known opposite numbers and divide by the third. Back to the map. One centimetre to three kilometres equals four centimetres to twelve kilometres. The spring is twelve kilometres away and Dilnoza was right.',
    },
  },

  s_check: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Верна ли пропорция', uz: 'Proporsiya to\'g\'rimi', en: 'Is the proportion true' },
    lead: { ru: 'Перемножь крайние и средние — числа должны совпасть.', uz: "Chetkilar va o'rtadagilarni ko'paytiring — sonlar mos kelishi kerak.", en: 'Multiply the outer and inner terms: the numbers must match.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '3 : 5 = 9 : 15 — верно?', uz: "3 : 5 = 9 : 15 — to'g'rimi?", en: 'Is 3 : 5 = 9 : 15 true?' },
        opts: [
          { ru: 'Верно', uz: "To'g'ri", en: 'True' },
          { ru: 'Неверно', uz: "Noto'g'ri", en: 'False' },
          { ru: 'Нельзя проверить', uz: "Tekshirib bo'lmaydi", en: 'Cannot be checked' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 3 · 15 = 45 и 5 · 9 = 45.', uz: "To'g'ri. 3 · 15 = 45 va 5 · 9 = 45.", en: 'Right. 3 · 15 = 45 and 5 · 9 = 45.' },
        wrong: [
          null,
          { ru: 'Проверь произведения: оба дают 45.', uz: "Ko'paytmalarni tekshiring: ikkalasi ham 45 beradi.", en: 'Check the products: both give 45.' },
          { ru: 'Проверить можно всегда: перемножь крайние и средние.', uz: "Har doim tekshirsa bo'ladi: chetkilar va o'rtadagilarni ko'paytiring.", en: 'It can always be checked by multiplying.' },
        ],
      },
      {
        q: { ru: '2 : 7 = 6 : 20 — верно?', uz: "2 : 7 = 6 : 20 — to'g'rimi?", en: 'Is 2 : 7 = 6 : 20 true?' },
        opts: [
          { ru: 'Верно', uz: "To'g'ri", en: 'True' },
          { ru: 'Неверно', uz: "Noto'g'ri", en: 'False' },
          { ru: 'Верно только для целых', uz: "Faqat butun sonlar uchun to'g'ri", en: 'True only for whole numbers' },
        ],
        correct: 1,
        ok: { ru: 'Верно, что неверно. 2 · 20 = 40, а 7 · 6 = 42.', uz: "To'g'ri, u noto'g'ri. 2 · 20 = 40, 7 · 6 = 42.", en: 'Right, it is false. 2 · 20 = 40 but 7 · 6 = 42.' },
        wrong: [
          { ru: 'Произведения разные: 40 и 42.', uz: "Ko'paytmalar har xil: 40 va 42.", en: 'The products differ: 40 and 42.' },
          null,
          { ru: 'Свойство работает для любых чисел, дело в самих числах.', uz: 'Xossa har qanday son uchun ishlaydi, gap sonlarning o\'zida.', en: 'The property works for any numbers; the numbers themselves are off.' },
        ],
      },
      {
        q: { ru: '8 : 6 = 4 : 3 — верно?', uz: "8 : 6 = 4 : 3 — to'g'rimi?", en: 'Is 8 : 6 = 4 : 3 true?' },
        opts: [
          { ru: 'Верно', uz: "To'g'ri", en: 'True' },
          { ru: 'Неверно', uz: "Noto'g'ri", en: 'False' },
          { ru: 'Порядок нарушен', uz: 'Tartib buzilgan', en: 'The order is broken' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 8 · 3 = 24 и 6 · 4 = 24, а 8 : 6 упрощается до 4 : 3.', uz: "To'g'ri. 8 · 3 = 24 va 6 · 4 = 24, 8 : 6 esa 4 : 3 gacha soddalashadi.", en: 'Right. 8 · 3 = 24 and 6 · 4 = 24, and 8 : 6 simplifies to 4 : 3.' },
        wrong: [
          null,
          { ru: 'Проверь: оба произведения равны 24.', uz: "Tekshiring: ikkala ko'paytma ham 24 ga teng.", en: 'Check: both products equal 24.' },
          { ru: 'Порядок как раз сохранён: большее к меньшему в обеих частях.', uz: 'Tartib aynan saqlangan: ikkala qismda ham katta kichikka.', en: 'The order is kept: larger to smaller on both sides.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Проверяйте пропорцию перемножением крайних и средних членов.',
        uz: "Mashq. Proporsiyani chetki va o'rta hadlarni ko'paytirib tekshiring.",
        en: 'Practice. Check a proportion by multiplying the outer and inner terms.',
      },
    },
  },

  s_find: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди неизвестный член', uz: "Noma'lum hadni toping", en: 'Find the unknown term' },
    lead: { ru: 'Перемножь два известных напротив и раздели на третий.', uz: "Qarama-qarshi ikki ma'lum sonni ko'paytiring va uchinchisiga bo'ling.", en: 'Multiply the two known opposite numbers and divide by the third.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '2 : 3 = x : 12', uz: '2 : 3 = x : 12', en: '2 : 3 = x : 12' },
        opts: ['8', '18', '6'],
        correct: 0,
        ok: { ru: 'Верно. 2 · 12 = 24, делим на 3: x = 8.', uz: "To'g'ri. 2 · 12 = 24, 3 ga bo'lamiz: x = 8.", en: 'Right. 2 · 12 = 24 divided by 3 gives x = 8.' },
        wrong: [
          null,
          { ru: 'Проверь: 2 · 12 = 24, а 3 · 18 = 54.', uz: 'Tekshiring: 2 · 12 = 24, 3 · 18 = 54.', en: 'Check: 2 · 12 = 24 but 3 · 18 = 54.' },
          { ru: 'Здесь удвоили 3, но 12 это 3 умножить на 4.', uz: "Bu yerda 3 ikkilantirilgan, 12 esa 3 karra 4.", en: 'That doubled 3, but 12 is 3 times 4.' },
        ],
      },
      {
        q: { ru: 'x : 6 = 10 : 15', uz: 'x : 6 = 10 : 15', en: 'x : 6 = 10 : 15' },
        opts: ['4', '9', '25'],
        correct: 0,
        ok: { ru: 'Верно. 6 · 10 = 60, делим на 15: x = 4.', uz: "To'g'ri. 6 · 10 = 60, 15 ga bo'lamiz: x = 4.", en: 'Right. 6 · 10 = 60 divided by 15 gives x = 4.' },
        wrong: [
          null,
          { ru: 'Проверь: 9 · 15 = 135, а 6 · 10 = 60.', uz: 'Tekshiring: 9 · 15 = 135, 6 · 10 = 60.', en: 'Check: 9 · 15 = 135 but 6 · 10 = 60.' },
          { ru: 'Числа сложили, а надо перемножить и разделить.', uz: "Sonlar qo'shilgan, kerak bo'lgani ko'paytirib bo'lish.", en: 'The numbers were added, but they must be multiplied and divided.' },
        ],
      },
      {
        q: { ru: '4 : x = 12 : 21', uz: '4 : x = 12 : 21', en: '4 : x = 12 : 21' },
        opts: ['7', '9', '63'],
        correct: 0,
        ok: { ru: 'Верно. 4 · 21 = 84, делим на 12: x = 7.', uz: "To'g'ri. 4 · 21 = 84, 12 ga bo'lamiz: x = 7.", en: 'Right. 4 · 21 = 84 divided by 12 gives x = 7.' },
        wrong: [
          null,
          { ru: 'Проверь перемножением: 4 · 21 = 84, а 9 · 12 = 108.', uz: "Ko'paytirib tekshiring: 4 · 21 = 84, 9 · 12 = 108.", en: 'Check: 4 · 21 = 84 but 9 · 12 = 108.' },
          { ru: 'Разделить забыли: 84 надо разделить на 12.', uz: "Bo'lish unutilgan: 84 ni 12 ga bo'lish kerak.", en: 'The division was skipped: 84 must be divided by 12.' },
        ],
      },
      {
        q: { ru: '9 : 12 = 6 : x', uz: '9 : 12 = 6 : x', en: '9 : 12 = 6 : x' },
        opts: ['8', '3', '18'],
        correct: 0,
        ok: { ru: 'Верно. 12 · 6 = 72, делим на 9: x = 8.', uz: "To'g'ri. 12 · 6 = 72, 9 ga bo'lamiz: x = 8.", en: 'Right. 12 · 6 = 72 divided by 9 gives x = 8.' },
        wrong: [
          null,
          { ru: 'Это разность 9 и 6, а нужна пропорция.', uz: 'Bu 9 va 6 ning ayirmasi, kerak bo\'lgani proporsiya.', en: 'That is the difference of 9 and 6, but we need the proportion.' },
          { ru: 'Проверь: 9 · 18 = 162, а 12 · 6 = 72.', uz: 'Tekshiring: 9 · 18 = 162, 12 · 6 = 72.', en: 'Check: 9 · 18 = 162 but 12 · 6 = 72.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Находите неизвестный член по основному свойству и проверяйте ответ.',
        uz: "Mashq. Noma'lum hadni asosiy xossa bilan toping va javobni tekshiring.",
        en: 'Practice. Find the unknown term by the basic property and check the answer.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Верная или неверная', uz: "To'g'ri yoki noto'g'ri", en: 'True or false' },
    lead: { ru: 'Считай произведения крайних и средних.', uz: "Chetkilar va o'rtadagilar ko'paytmasini hisoblang.", en: 'Compute the products of the outer and inner terms.' },
    bin_a: { ru: 'Верная', uz: "To'g'ri", en: 'True' },
    bin_b: { ru: 'Неверная', uz: "Noto'g'ri", en: 'False' },
    cards: [
      { label: '2:3 = 4:6', bin: 'a' },
      { label: '3:4 = 9:12', bin: 'a' },
      { label: '5:2 = 10:4', bin: 'a' },
      { label: '2:3 = 3:4', bin: 'b' },
      { label: '4:6 = 6:8', bin: 'b' },
      { label: '1:2 = 3:5', bin: 'b' },
    ],
    hint: {
      ru: 'Перемножь первое с последним и второе с третьим. Числа должны совпасть.',
      uz: "Birinchini oxirgisi bilan, ikkinchisini uchinchisi bilan ko'paytiring. Sonlar mos kelishi kerak.",
      en: 'Multiply the first by the last and the second by the third. The numbers must match.',
    },
    correct_text: {
      ru: 'Верно. В первых трёх произведения совпали, в остальных нет.',
      uz: "To'g'ri. Birinchi uchtasida ko'paytmalar mos keldi, qolganlarida yo'q.",
      en: 'Right. In the first three the products matched, in the rest they did not.',
    },
    audio: {
      intro: {
        ru: 'Разложите пропорции по двум корзинам. Проверяйте перемножением.',
        uz: "Proporsiyalarni ikki savatga ajrating. Ko'paytirib tekshiring.",
        en: 'Sort the proportions into two baskets. Check by multiplying.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Перемножь крайние и средние члены.', uz: "Bu yerga emas. Chetki va o'rta hadlarni ko'paytiring.", en: 'Not here. Multiply the outer and inner terms.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз решил 3 : 4 = x : 8 так: x = 8 + 3 = 11. Где ошибка?', uz: "Aziz 3 : 4 = x : 8 ni shunday yechdi: x = 8 + 3 = 11. Xato qayerda?", en: 'Aziz solved 3 : 4 = x : 8 as x = 8 + 3 = 11. Where is the mistake?' },
        opts: [
          { ru: 'Сложил вместо перемножения и деления', uz: "Ko'paytirish va bo'lish o'rniga qo'shdi", en: 'He added instead of multiplying and dividing' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: 'Перепутал крайние и средние', uz: "Chetki va o'rtadagilarni chalkashtirdi", en: 'He mixed up outer and inner terms' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 3 · 8 = 24, делим на 4: x = 6.', uz: "To'g'ri. 3 · 8 = 24, 4 ga bo'lamiz: x = 6.", en: 'Right. 3 · 8 = 24 divided by 4 gives x = 6.' },
        wrong: [
          null,
          { ru: 'Проверь: 3 · 8 = 24, а 4 · 11 = 44.', uz: 'Tekshiring: 3 · 8 = 24, 4 · 11 = 44.', en: 'Check: 3 · 8 = 24 but 4 · 11 = 44.' },
          { ru: 'Члены он назвал верно, а действие выбрал не то.', uz: "Hadlarni to'g'ri aytdi, amalni esa noto'g'ri tanladi.", en: 'He named the terms correctly but chose the wrong operation.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «6 : 4 = 4 : 6, ведь числа те же». Проверь.', uz: "Dilnoza: «6 : 4 = 4 : 6, axir sonlar o'sha». Tekshiring.", en: 'Dilnoza: “6 : 4 = 4 : 6, the numbers are the same.” Check it.' },
        opts: [
          { ru: 'Нет: 6 · 6 = 36, а 4 · 4 = 16', uz: "Yo'q: 6 · 6 = 36, 4 · 4 = 16", en: 'No: 6 · 6 = 36 but 4 · 4 = 16' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Верно, если сократить', uz: "Qisqartirsak to'g'ri", en: 'True after reducing' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Порядок в отношении менять нельзя: 6 : 4 больше единицы, а 4 : 6 меньше.', uz: "To'g'ri. Nisbatda tartibni o'zgartirib bo'lmaydi: 6 : 4 birdan katta, 4 : 6 esa kichik.", en: 'Right. The order cannot be swapped: 6 : 4 is above one and 4 : 6 below.' },
        wrong: [
          null,
          { ru: 'Одни и те же числа в разном порядке дают разные отношения.', uz: "Bir xil sonlar boshqa tartibda boshqa nisbat beradi.", en: 'The same numbers in a different order give different ratios.' },
          { ru: 'Сокращение порядок не меняет: 3 : 2 и 2 : 3 тоже разные.', uz: "Qisqartirish tartibni o'zgartirmaydi: 3 : 2 va 2 : 3 ham har xil.", en: 'Reducing does not change the order: 3 : 2 and 2 : 3 also differ.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в действии, и в порядке чисел.',
        uz: "Birovning yechimini tekshiring. Xato amalda ham, sonlar tartibida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the operation and in the order.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Маршрут по карте', uz: 'Xarita bo\'yicha marshrut', en: 'The route on the map' },
    lead: { ru: 'Масштаб карты: 1 см — 3 км. От школы до родника 4 см, до моста 6 см.', uz: "Xarita masshtabi: 1 sm — 3 km. Maktabdan buloqqacha 4 sm, ko'prikkacha 6 sm.", en: 'Map scale: 1 cm is 3 km. The spring is 4 cm away and the bridge 6 cm.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько километров до моста?', uz: "Ko'prikkacha necha kilometr?", en: 'How far is the bridge?' },
        opts: ['18', '9', '2'],
        correct: 0,
        ok: { ru: 'Верно. 1 : 3 = 6 : x, значит x = 18 км.', uz: "To'g'ri. 1 : 3 = 6 : x, demak x = 18 km.", en: 'Right. 1 : 3 = 6 : x, so x = 18 km.' },
        wrong: [
          null,
          { ru: 'Здесь сложили 6 и 3, а надо умножить.', uz: "Bu yerda 6 va 3 qo'shilgan, kerak bo'lgani ko'paytirish.", en: 'That added 6 and 3, but they must be multiplied.' },
          { ru: 'Это деление 6 на 3, но масштаб переводит сантиметры в километры умножением.', uz: "Bu 6 ni 3 ga bo'lish, masshtab esa santimetrni kilometrga ko'paytirib o'tkazadi.", en: 'That divides 6 by 3, but the scale converts by multiplying.' },
        ],
      },
      {
        q: { ru: 'Путь от родника до моста на карте 5 см. Сколько это на местности?', uz: "Buloqdan ko'prikkacha xaritada 5 sm. Joyida bu qancha?", en: 'The spring to the bridge is 5 cm on the map. How far on the ground?' },
        opts: ['15 км', '8 км', '5 км'],
        correct: 0,
        ok: { ru: 'Верно. 1 : 3 = 5 : x, x = 15 км.', uz: "To'g'ri. 1 : 3 = 5 : x, x = 15 km.", en: 'Right. 1 : 3 = 5 : x, so x = 15 km.' },
        wrong: [
          null,
          { ru: 'Снова сложение вместо умножения.', uz: "Yana ko'paytirish o'rniga qo'shish.", en: 'Addition instead of multiplication again.' },
          { ru: 'Это длина на карте, а не на местности.', uz: "Bu xaritadagi uzunlik, joyidagi emas.", en: 'That is the map length, not the real one.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про карту. Масштаб один сантиметр это три километра.',
        uz: "Xarita haqida masala. Masshtab bir santimetr bu uch kilometr.",
        en: 'A map problem. The scale is one centimetre to three kilometres.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 20,
        q: { ru: 'Найди x: 4 : 5 = 16 : x. Набери ответ.', uz: 'x ni toping: 4 : 5 = 16 : x. Javobni tering.', en: 'Find x: 4 : 5 = 16 : x. Type the answer.' },
        hint: { ru: 'Перемножь 5 и 16, потом раздели на 4.', uz: "5 va 16 ni ko'paytiring, keyin 4 ga bo'ling.", en: 'Multiply 5 by 16, then divide by 4.' },
        hint_audio: { ru: 'Перемножьте пять и шестнадцать, получится восемьдесят, и разделите на четыре.', uz: "Besh va o'n oltini ko'paytiring, sakson chiqadi, keyin to'rtga bo'ling.", en: 'Multiply five by sixteen to get eighty, then divide by four.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Какое равенство является верной пропорцией?', uz: "Qaysi tenglik to'g'ri proporsiya?", en: 'Which equality is a true proportion?' },
        opts: ['3 : 5 = 5 : 3', '6 : 9 = 8 : 12', '2 : 4 = 4 : 6', '1 : 3 = 2 : 5'],
        wrong: [
          { ru: 'Порядок переставлен: 9 не равно 25.', uz: "Tartib o'zgargan: 9 soni 25 ga teng emas.", en: 'The order is swapped: 9 does not equal 25.' },
          null,
          { ru: '2 · 6 = 12, а 4 · 4 = 16.', uz: '2 · 6 = 12, 4 · 4 = 16.', en: '2 · 6 = 12 but 4 · 4 = 16.' },
          { ru: '1 · 5 = 5, а 3 · 2 = 6.', uz: '1 · 5 = 5, 3 · 2 = 6.', en: '1 · 5 = 5 but 3 · 2 = 6.' },
        ],
        correct: { ru: 'Верно. 6 · 12 = 72 и 9 · 8 = 72.', uz: "To'g'ri. 6 · 12 = 72 va 9 · 8 = 72.", en: 'Right. 6 · 12 = 72 and 9 · 8 = 72.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Что такое основное свойство пропорции?', uz: 'Proporsiyaning asosiy xossasi nima?', en: 'What is the basic property of a proportion?' },
        opts: [
          { ru: 'Сумма крайних равна сумме средних', uz: "Chetkilar yig'indisi o'rtadagilar yig'indisiga teng", en: 'The sum of the outer terms equals the sum of the inner ones' },
          { ru: 'Все четыре числа равны', uz: "To'rtala son ham teng", en: 'All four numbers are equal' },
          { ru: 'Произведение крайних равно произведению средних', uz: "Chetkilar ko'paytmasi o'rtadagilar ko'paytmasiga teng", en: 'The product of the outer terms equals the product of the inner ones' },
          { ru: 'Разность крайних равна разности средних', uz: "Chetkilar ayirmasi o'rtadagilar ayirmasiga teng", en: 'The difference of the outer terms equals that of the inner ones' },
        ],
        wrong: [
          { ru: 'Проверь на 2 : 3 = 4 : 6: суммы 8 и 7, а свойство выполняется.', uz: "2 : 3 = 4 : 6 da tekshiring: yig'indilar 8 va 7, xossa esa bajariladi.", en: 'Check 2 : 3 = 4 : 6: the sums are 8 and 7, yet the property holds.' },
          { ru: 'Числа бывают разные, важны произведения.', uz: "Sonlar har xil bo'lishi mumkin, muhimi ko'paytmalar.", en: 'The numbers may differ; the products matter.' },
          null,
          { ru: 'Разности тоже не совпадают: 4 и 1 в примере 2 : 3 = 4 : 6.', uz: '2 : 3 = 4 : 6 misolda ayirmalar 4 va 1, ular mos emas.', en: 'The differences do not match either: 4 and 1 in 2 : 3 = 4 : 6.' },
        ],
        correct: { ru: 'Верно. Именно этим свойством проверяют и решают пропорции.', uz: "To'g'ri. Aynan shu xossa bilan proporsiyalar tekshiriladi va yechiladi.", en: 'Right. That property both checks and solves proportions.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'На карте 1 : 100 000 отрезок 3 см. Сколько это на местности?', uz: "1 : 100 000 xaritada kesma 3 sm. Joyida bu qancha?", en: 'On a 1 : 100,000 map a segment is 3 cm. How long is it in reality?' },
        opts: ['3 км', '300 м', '30 км', '100 км'],
        wrong: [
          null,
          { ru: '300 метров вышло бы при масштабе 1 : 10 000.', uz: '300 metr 1 : 10 000 masshtabda chiqardi.', en: 'Three hundred metres would come from a 1 : 10,000 scale.' },
          { ru: 'Это в десять раз больше нужного.', uz: 'Bu keragidan o\'n barobar katta.', en: 'That is ten times too much.' },
          { ru: '100 км соответствует ста сантиметрам на такой карте.', uz: 'Bunday xaritada 100 km yuz santimetrga to\'g\'ri keladi.', en: 'On such a map 100 km would be a hundred centimetres.' },
        ],
        correct: { ru: 'Верно. 1 см это 100 000 см, то есть 1 км, значит 3 см это 3 км.', uz: "To'g'ri. 1 sm bu 100 000 sm, ya'ni 1 km, demak 3 sm bu 3 km.", en: 'Right. One centimetre is 100,000 cm, that is 1 km, so 3 cm is 3 km.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: '3 яблока стоят 6000 сум. Сколько стоят 7 яблок?', uz: "3 ta olma 6000 so'm. 7 ta olma qancha turadi?", en: 'Three apples cost 6,000. What do seven cost?' },
        opts: ['10 000', '18 000', '2000', '14 000'],
        wrong: [
          { ru: 'Проверь: 3 · 10 000 = 30 000, а 6000 · 7 = 42 000.', uz: 'Tekshiring: 3 · 10 000 = 30 000, 6000 · 7 = 42 000.', en: 'Check: 3 · 10,000 = 30,000 but 6,000 · 7 = 42,000.' },
          { ru: 'Это цена девяти яблок.', uz: "Bu to'qqizta olmaning narxi.", en: 'That is the price of nine apples.' },
          { ru: 'Это цена одного яблока.', uz: 'Bu bitta olmaning narxi.', en: 'That is the price of one apple.' },
          null,
        ],
        correct: { ru: 'Верно. 3 : 6000 = 7 : x, значит x = 42 000 : 3 = 14 000.', uz: "To'g'ri. 3 : 6000 = 7 : x, demak x = 42 000 : 3 = 14 000.", en: 'Right. 3 : 6,000 = 7 : x, so x = 42,000 ÷ 3 = 14,000.' },
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
      ru: 'Фалес измерил высоту египетской пирамиды по её тени. Он дождался момента, когда его собственная тень стала равна росту, и понял: тень пирамиды в этот час равна её высоте. Дальше работает пропорция.',
      uz: "Fales Misr piramidasining balandligini soyasi orqali o'lchagan. U o'z soyasi bo'yiga teng bo'lgan lahzani kutgan va tushungan: shu paytda piramidaning soyasi uning balandligiga teng. Keyingisini proporsiya hal qiladi.",
      en: 'Thales measured the height of an Egyptian pyramid by its shadow. He waited until his own shadow matched his height and realised the pyramid’s shadow then equalled its height. The rest is proportion.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Фалес измерил высоту египетской пирамиды по её тени. Он дождался момента, когда его собственная тень стала равна росту, и понял, что тень пирамиды в этот час равна её высоте. Дальше работает пропорция.',
      uz: "Bilasizmi? Fales Misr piramidasining balandligini soyasi orqali o'lchagan. U o'z soyasi bo'yiga teng bo'lgan lahzani kutgan va shu paytda piramidaning soyasi uning balandligiga teng ekanini tushungan. Keyingisini proporsiya hal qiladi.",
      en: 'Did you know? Thales measured the height of an Egyptian pyramid by its shadow. He waited until his own shadow matched his height and realised the pyramid shadow then equalled its height. The rest is proportion.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Пропорции', uz: 'Matematika · Proporsiyalar', en: 'Mathematics · Proportions' },
    heading: { ru: 'Пропорция', uz: 'Proporsiya', en: 'Proportion' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'пропорция — равенство двух отношений', uz: 'proporsiya — ikki nisbatning tengligi', en: 'a proportion is an equality of two ratios' },
    brief_2: { ru: 'крайние на крайние, средние на средние', uz: "chetkilar chetkilarga, o'rtadagilar o'rtadagilarga", en: 'outer times outer, inner times inner' },
    brief_3: { ru: 'неизвестное находится делением', uz: "noma'lum bo'lish bilan topiladi", en: 'the unknown comes from division' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Крайние члены', uz: 'Chetki hadlar', en: 'Outer terms' },
    memo_a1: { ru: 'первое и последнее число', uz: 'birinchi va oxirgi son', en: 'the first and the last number' },
    memo_q2: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Check' },
    memo_a2: { ru: 'два произведения должны совпасть', uz: "ikki ko'paytma mos kelishi kerak", en: 'the two products must match' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'перепутать порядок величин', uz: 'kattaliklar tartibini chalkashtirish', en: 'mixing up the order of quantities' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Пропорция это равенство двух отношений. В верной пропорции произведение крайних равно произведению средних, и по этому же свойству находят неизвестный член.',
        'Карта: один сантиметр к трём километрам равно четыре сантиметра к двенадцати. До родника двенадцать километров.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Proporsiya bu ikki nisbatning tengligi. To'g'ri proporsiyada chetkilar ko'paytmasi o'rtadagilar ko'paytmasiga teng va noma'lum had ham shu xossa bilan topiladi.",
        "Xarita: bir santimetrning uch kilometrga nisbati to'rt santimetrning o'n ikkiga nisbatiga teng. Buloqqacha o'n ikki kilometr.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'A proportion is an equality of two ratios. In a true one the product of the outer terms equals that of the inner ones, and the same property finds an unknown term.',
        'The map: one centimetre to three kilometres equals four centimetres to twelve. The spring is twelve kilometres away.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Крест-накрест', uz: 'Usul. Krestasiga', en: 'Method. Cross-wise' },
    m1_steps: {
      ru: ['Запиши величины в одном порядке в обеих частях', 'Перемножь два известных числа напротив друг друга', 'Раздели на третье известное число'],
      uz: ['Kattaliklarni ikkala qismda bir tartibda yozing', "Qarama-qarshi turgan ikki ma'lum sonni ko'paytiring", "Uchinchi ma'lum songa bo'ling"],
      en: ['Write the quantities in the same order on both sides', 'Multiply the two known numbers standing opposite', 'Divide by the third known number'],
    },
    m1_no: {
      ru: 'Готовый ответ проверяют перемножением: произведения крайних и средних должны совпасть.',
      uz: "Tayyor javob ko'paytirib tekshiriladi: chetkilar va o'rtadagilar ko'paytmasi mos kelishi kerak.",
      en: 'Check the answer by multiplying: the outer and inner products must match.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кружок краеведения. На хуке вопрос, в итоге ответ.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d18wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d18wall)"/>

    {/* Карта на стене: школа, родник, тропа и линейка масштаба */}
    <g>
      <rect x="66" y="10" width="268" height="104" rx="4" fill="#F7F0E2" stroke="#C9A472" strokeWidth="2"/>
      <path d="M78 92 q40 -18 74 -8 q38 12 66 -18 q28 -28 60 -18" fill="none" stroke="#8FBF7F" strokeWidth="6" opacity="0.5"/>
      <path d="M78 40 q46 10 92 -4 q52 -16 96 8" fill="none" stroke="#7ECBE6" strokeWidth="4" opacity="0.7"/>
      {/* тропа от школы к роднику: пунктир, длину на глаз не измерить */}
      <path d="M112 82 L196 52" stroke="#C4452B" strokeWidth="2.4" strokeDasharray="5 4"/>
      <g>
        <rect x="102" y="78" width="18" height="14" rx="2" fill="#D2A96F"/>
        <path d="M100 78 L111 70 L122 78 Z" fill="#C9884A"/>
      </g>
      <g>
        <circle cx="196" cy="52" r="7" fill="#7ECBE6" stroke="#019ACB"/>
        <path d="M196 45 v-6" stroke="#8FBF7F" strokeWidth="2"/>
      </g>
      {/* линейка масштаба: 1 см и подпись 3 km */}
      <g>
        <rect x="248" y="92" width="24" height="8" fill="#494550"/>
        <rect x="272" y="92" width="24" height="8" fill="#FFFDF7" stroke="#494550"/>
        <text x="284" y="88" textAnchor="middle" fill="#494550"
          fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">3 km</text>
      </g>
    </g>

    {/* Линейка в руках и компас на столе */}
    <g className="d18-ruler">
      <rect x="120" y="118" width="96" height="12" rx="2" fill="#FBF3D6" stroke="#C9A472"/>
      {[128, 140, 152, 164, 176, 188, 200, 212].map((lx) => <path key={lx} d={`M${lx} 118 v6`} stroke="#C9A472" strokeWidth="1"/>)}
    </g>
    <g>
      <circle cx="252" cy="128" r="12" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <path className="d18-needle" d="M252 128 l0 -8" stroke="#FF4F28" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="252" cy="128" r="2" fill="#3B3730"/>
    </g>

    {/* Дети у карты */}
    <Person x={36} ground={140} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={364} ground={140} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <rect x="0" y="140" width="400" height="14" fill="#D2A96F"/>
  </svg>
);

// Итог: пропорция на карте решена, расстояние подписано.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <g>
      <rect x="24" y="12" width="150" height="60" rx="4" fill="#F7F0E2" stroke="#C9A472" strokeWidth="2"/>
      <path d="M44 58 L134 28" stroke="#C4452B" strokeWidth="2.4" strokeDasharray="5 4"/>
      <rect x="36" y="52" width="16" height="12" rx="2" fill="#D2A96F"/>
      <circle cx="134" cy="28" r="6" fill="#7ECBE6" stroke="#019ACB"/>
      <text x="99" y="70" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">4 cm</text>
    </g>
    <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
      <text x="288" y="36" textAnchor="middle" fontSize="14">1 : 3 = 4 : 12</text>
      <text x="288" y="64" textAnchor="middle" fontSize="18">12 km</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Пропорция с подписанными членами: крайние снаружи, средние внутри.
const Prop = ({ a, b, c, d, mark = false, size = 'mid' }) => (
  <span className={'d18-prop d18-prop-' + size + (mark ? ' d18-prop-mark' : '')}>
    <i className="out">{a}</i>
    <span className="sep">:</span>
    <i className="mid">{b}</i>
    <span className="eq">=</span>
    <i className="mid">{c}</i>
    <span className="sep">:</span>
    <i className="out">{d}</i>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d18-line d18-fade' + (on ? ' d18-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d18-stage">
        {c.rows.map((r, i) => (
          <span key={i} className={'d18-row d18-fade' + (step >= i ? ' d18-on' : '')}>
            <span className="d18-bars">
              {Array.from({ length: r.a }, (_, k) => <i key={'a' + k} className="blue"/>)}
              {Array.from({ length: r.b }, (_, k) => <i key={'b' + k} className="yellow"/>)}
            </span>
            <b className="d18-ratio">{r.a} : {r.b}</b>
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

// Ядро: пропорция, названия членов, произведения крест-накрест.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d18-stage">
        <Prop a={c.prop.a} b={c.prop.b} c={c.prop.c} d={c.prop.d} mark={step >= 1}/>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        <span className={'d18-cross d18-fade' + (step >= 2 ? ' d18-on' : '')}>
          <b>12</b><span className="d18-eqsign">=</span><b>12</b>
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

const ScaleBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_scale;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d18-stage">
        <span className="d18-table">
          <span className="d18-trow"><b>cm</b><i>1</i><i>4</i></span>
          <span className="d18-trow"><b>km</b><i>3</i><i className={step >= 2 ? 'ok' : 'q'}>{step >= 2 ? '12' : '?'}</i></span>
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

const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d18-stage">
        <span className="d18-table">
          <span className="d18-trow"><b>шт</b><i>5</i><i>8</i></span>
          <span className="d18-trow"><b>sum</b><i>12500</i><i className={step >= 2 ? 'ok' : 'q'}>{step >= 2 ? '20000' : '?'}</i></span>
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

// Граница: порядок величин и проверка перемножением.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d18-stage">
        <span className="d18-pair d18-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d18-pair d18-pair-good d18-fade' + (step >= 1 ? ' d18-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d18-pair d18-pair-warn d18-fade' + (step >= 2 ? ' d18-on' : '')}>
          <Line node={t(c.check_line)} on/>
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
        <div className={'d18-banner fade-up delay-1' + (phase === 'play' ? ' d18-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d18-stage d18-stage-tool">
          {phase === 'demo' ? (
            <>
              <Prop a="3" b="4" c={done ? '9' : 'x'} d="12" mark={shown >= 1} size="sm"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d18-verdict' + (done ? ' d18-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d18-acts fade-up">
            <button className="d18-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d18-btn d18-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenScale = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_scale} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <ScaleBody step={step}/>}/>
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
      <div className="d18-stage">
        <Prop a="1" b="3" c="4" d="12" mark/>
        <span className="d18-cross"><b>12</b><span className="d18-eqsign">=</span><b>12</b></span>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenCheck = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_check} asideNode={methodAside}/>
);
const ScreenFind = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_find} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: таблица карты — сантиметры и километры.
const TaskFig = ({ idx }) => (
  <div className="d18-task-fig">
    <span className="d18-table">
      <span className="d18-trow"><b>cm</b><i>1</i><i>{idx >= 1 ? '5' : '6'}</i></span>
      <span className="d18-trow"><b>km</b><i>3</i><i className="q">?</i></span>
    </span>
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
.d18-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d18-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d18-stage-tool .d18-line { font-size: clamp(12px, 2vw, 16px); }
.d18-row { display: flex; align-items: center; gap: clamp(8px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; }

/* Пропорция с подписанными членами */
.d18-prop { display: inline-flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-weight: 700; }
.d18-prop i { font-style: normal; display: grid; place-items: center; border-radius: 8px; border: 2px solid transparent; transition: border-color 380ms linear, background-color 380ms linear; }
.d18-prop-mid i { min-width: clamp(30px, 6vw, 46px); height: clamp(30px, 5.6vw, 44px); font-size: clamp(16px, 3vw, 24px); }
.d18-prop-sm i { min-width: clamp(26px, 5.4vw, 40px); height: clamp(26px, 5vw, 38px); font-size: clamp(14px, 2.6vw, 20px); }
.d18-prop .sep, .d18-prop .eq { color: #8A8883; font-size: clamp(15px, 2.8vw, 21px); }
.d18-prop-mark i.out { border-color: #019ACB; background: #E7F5FA; }
.d18-prop-mark i.mid { border-color: #C99B3A; background: #FBF3D6; }
.d18-cross { display: inline-flex; align-items: center; gap: 10px; opacity: 0; transition: opacity 420ms linear; }
.d18-cross b { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px, 3.8vw, 30px); color: #1F7A4D; }
.d18-eqsign { color: #8A8883; font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 22px); }

/* Таблица величин */
.d18-table { display: flex; flex-direction: column; gap: 4px; }
.d18-trow { display: inline-flex; align-items: center; gap: 4px; }
.d18-trow b { min-width: clamp(30px, 6vw, 44px); font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 2vw, 14px); color: #8A8883; text-align: right; }
.d18-trow i { font-style: normal; display: grid; place-items: center; min-width: clamp(52px, 11vw, 84px); height: clamp(26px, 4.6vw, 36px); border-radius: 8px; background: #F7F0E2; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }
.d18-trow i.q { background: #FBF3D6; border-color: #E4CE93; color: #C99B3A; }
.d18-trow i.ok { background: #E3F0E8; border-color: #A9CFBA; color: #1F7A4D; }

/* Полоски отношения */
.d18-bars { display: inline-flex; gap: 3px; }
.d18-bars i { display: block; width: clamp(10px, 2.2vw, 18px); height: clamp(20px, 3.6vw, 30px); border-radius: 3px; }
.d18-bars i.blue { background: #7ECBE6; border: 1px solid #019ACB; }
.d18-bars i.yellow { background: #F5C77E; border: 1px solid #C99B3A; }
.d18-ratio { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 22px); font-weight: 700; color: #1F7A4D; }

.d18-fade { opacity: 0; transition: opacity 420ms linear; }
.d18-on { opacity: 1; }
.d18-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; }

/* Строки экрана границы */
.d18-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d18-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d18-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d18-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d18-task-fig { display: flex; justify-content: center; }

/* Экран 4 */
.d18-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d18-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d18-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d18-verdict-on { opacity: 1; }
.d18-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d18-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d18-btn:disabled { opacity: 0.45; cursor: default; }
.d18-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d18-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: стрелка компаса и линейка */
.d18-needle { transform-origin: 252px 128px; animation: d18Needle 5200ms ease-in-out infinite; }
@keyframes d18Needle { 0%, 100% { transform: rotate(-12deg); } 40% { transform: rotate(9deg); } 70% { transform: rotate(-3deg); } }
.d18-ruler { animation: d18Ruler 6000ms ease-in-out infinite; }
@keyframes d18Ruler { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
@media (prefers-reduced-motion: reduce) { .d18-needle, .d18-ruler { animation: none; } }

@media (max-width: 639.98px) {
  .d18-trow i { min-width: 48px; height: 24px; font-size: 12px; }
  .d18-bars i { width: 9px; height: 18px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function ProportionLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenScale, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenCheck, ScreenFind, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
