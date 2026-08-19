// ============================================================
// 6 КЛАСС, УРОК 30 «Координатная плоскость»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б8, первый урок. Плоскость вырастает из координатной прямой
// уроков 24-26: одного числа перестаёт хватать, поэтому к прямой
// добавляется вторая ось. Порядок координат вводится как то, без чего
// точку не найти, а не как соглашение из учебника.
//
// Сцена — школьный двор, размеченный дорожками от флагштока.
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
  lessonId: 'grade6-30',
  lessonTitle: {
    ru: 'Координатная плоскость',
    uz: 'Koordinata tekisligi',
    en: 'The coordinate plane',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 hovli: xat (2; −3), ikki nuqta
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 chiziqda bitta son yetardi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 ikkinchi o'q va tartib
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: nuqtani qo'yish
  { id: 's_quad',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 to'rt chorak va o'qlardagi nuqtalar
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: masofa
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: tartib va o'qdagi nuqta
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_read',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 koordinatalarni o'qish x3
  { id: 's_where',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 chorakni aniqlash x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: o'qdan yuqorida yoki pastda
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: hovli rejasi
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Записка во дворе', uz: 'Hovlidagi xat', en: 'A note in the yard' },
    lead: {
      ru: 'Двор размечен дорожками от флагштока. В записке сказано: скамейка в точке (2; −3).',
      uz: "Hovli bayroq ustunidan yo'lkalar bilan belgilangan. Xatda: skameyka (2; −3) nuqtada.",
      en: 'The yard is marked by paths from the flagpole. The note says: the bench is at (2; −3).',
    },
    voice_a: { ru: 'Улугбек: сначала вверх на 2, потом влево на 3.', uz: "Ulug'bek: avval 2 ga tepaga, keyin 3 ga chapga.", en: 'Ulugbek: first 2 up, then 3 left.' },
    voice_b: { ru: 'Зухра: сначала вправо на 2, потом вниз на 3.', uz: "Zuhra: avval 2 ga o'ngga, keyin 3 ga pastga.", en: 'Zuhra: first 2 right, then 3 down.' },
    ask: { ru: 'Куда идти от флагштока?', uz: 'Bayroq ustunidan qayoqqa borish kerak?', en: 'Which way from the flagpole?' },
    options: [
      { ru: 'вверх 2, влево 3', uz: "2 tepaga, 3 chapga", en: '2 up, 3 left' },
      { ru: 'вправо 2, вниз 3', uz: "2 o'ngga, 3 pastga", en: '2 right, 3 down' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Школьный двор размечен дорожками, а в середине стоит флагшток. В записке сказано, что скамейка в точке два и минус три.',
          'Улугбек считает, что надо сначала подняться на два, а потом уйти влево на три. Зухра говорит, что сначала вправо на два, а потом вниз на три. Куда идти от флагштока? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab hovlisi yo'lkalar bilan belgilangan, o'rtasida bayroq ustuni turibdi. Xatda skameyka ikki va minus uch nuqtada deyilgan.",
          "Ulug'bek avval ikkiga tepaga chiqib, keyin uchga chapga yurish kerak deb hisoblaydi. Zuhra esa avval ikkiga o'ngga, keyin uchga pastga deydi. Bayroq ustunidan qayoqqa borish kerak? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The school yard is marked with paths and a flagpole stands in the middle. The note says the bench is at the point two and minus three.',
          'Ulugbek thinks you go two up first and then three left. Zuhra says two right first and then three down. Which way from the flagpole? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'На прямой хватало одного числа', uz: 'Chiziqda bitta son yetardi', en: 'One number was enough on a line' },
    done: {
      ru: 'На прямой одно число полностью задаёт место. Но двор — не прямая: по нему можно идти и вбок, и вперёд.',
      uz: "Chiziqda bitta son joyni to'liq belgilaydi. Ammo hovli chiziq emas: unda yon tomonga ham, oldinga ham yurish mumkin.",
      en: 'On a line one number fixes the spot completely. But a yard is not a line: you can walk sideways and forward.',
    },
    audio: {
      ru: [
        'Вспомним двадцать четвёртый урок. На координатной прямой каждой точке отвечает одно число, её координата.',
        'Сказали минус три, и место найдено однозначно.',
        'Но двор это не прямая. По нему можно идти и вбок, и вперёд. Одного числа перестаёт хватать.',
      ],
      uz: [
        "Yigirma to'rtinchi darsni eslaymiz. Koordinata chizig'ida har bir nuqtaga bitta son, uning koordinatasi mos keladi.",
        "Minus uch dedik va joy aniq topildi.",
        "Ammo hovli chiziq emas. Unda yon tomonga ham, oldinga ham yurish mumkin. Bitta son yetmay qoladi.",
      ],
      en: [
        'Recall lesson twenty four. On a coordinate line each point matches one number, its coordinate.',
        'Say minus three and the spot is found exactly.',
        'But a yard is not a line. You can walk sideways and forward. One number is no longer enough.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Две оси и порядок', uz: "Ikki o'q va tartib", en: 'Two axes and an order' },
    lines: [
      { ru: 'первое число — по оси x, вправо или влево', uz: "birinchi son — x o'qi bo'ylab, o'ngga yoki chapga", en: 'the first number goes along x, right or left' },
      { ru: 'второе — по оси y, вверх или вниз', uz: "ikkinchisi — y o'qi bo'ylab, tepaga yoki pastga", en: 'the second goes along y, up or down' },
      { ru: '(2; −3): вправо 2, вниз 3', uz: "(2; −3): 2 o'ngga, 3 pastga", en: '(2; −3): 2 right, 3 down' },
    ],
    done: {
      ru: 'Точка пересечения осей — начало координат. Порядок чисел в паре менять нельзя: первое всегда по горизонтали. Права была Зухра.',
      uz: "O'qlar kesishgan nuqta — koordinata boshi. Juftlikdagi sonlar tartibini o'zgartirib bo'lmaydi: birinchisi doim gorizontal bo'ylab. Zuhra haq edi.",
      en: 'Where the axes cross is the origin. The order in the pair cannot change: the first number is always horizontal. Zuhra was right.',
    },
    audio: {
      ru: [
        'Проведём через флагшток две прямые: одну вбок, другую вверх. Горизонтальную называют осью икс, вертикальную осью игрек, а их пересечение началом координат.',
        'Теперь у точки два числа. Первое показывает, сколько пройти по оси икс, вправо или влево. Второе, сколько по оси игрек, вверх или вниз.',
        'Значит два и минус три это вправо на два, потом вниз на три. Права была Зухра. Улугбек прочитал пару в обратном порядке и ушёл в другое место двора.',
      ],
      uz: [
        "Bayroq ustunidan ikki chiziq o'tkazamiz: biri yon tomonga, ikkinchisi tepaga. Gorizontalini iks o'qi, vertikalini igrek o'qi, ular kesishgan joyni koordinata boshi deb ataymiz.",
        "Endi nuqtaning ikkita soni bor. Birinchisi iks o'qi bo'ylab qancha yurishni, o'ngga yoki chapga ekanini ko'rsatadi. Ikkinchisi igrek o'qi bo'ylab, tepaga yoki pastga.",
        "Demak ikki va minus uch bu o'ngga ikki, keyin pastga uch. Zuhra haq edi. Ulug'bek juftlikni teskari tartibda o'qidi va hovlining boshqa joyiga ketdi.",
      ],
      en: [
        'Draw two lines through the flagpole: one sideways, one up. The horizontal one is the x axis, the vertical one is the y axis, and their crossing is the origin.',
        'Now a point has two numbers. The first tells how far to go along x, right or left. The second, how far along y, up or down.',
        'So two and minus three means two right and then three down. Zuhra was right. Ulugbek read the pair backwards and ended up elsewhere in the yard.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Ставим точку', uz: "Nuqtani qo'yamiz", en: 'Plotting a point' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'точка (−4; 1): начинаем с нуля', uz: '(−4; 1) nuqtasi: noldan boshlaymiz', en: 'the point (−4; 1): start at zero' },
      { ru: 'по оси x влево на 4', uz: "x o'qi bo'ylab chapga 4", en: '4 left along the x axis' },
      { ru: 'по оси y вверх на 1', uz: "y o'qi bo'ylab tepaga 1", en: '1 up along the y axis' },
    ],
    demo_note: {
      ru: 'Сначала всегда идём по горизонтали, потом по вертикали. Знак числа выбирает сторону.',
      uz: "Avval doim gorizontal, keyin vertikal bo'ylab yuramiz. Sonning ishorasi tomonni tanlaydi.",
      en: 'Always go horizontally first, then vertically. The sign picks the direction.',
    },
    play_ask: { ru: 'Куда идти для точки (3; −2)?', uz: '(3; −2) nuqtasi uchun qayoqqa borish kerak?', en: 'Where do you go for the point (3; −2)?' },
    play_opts: [
      { ru: 'вправо 3, вниз 2', uz: "3 o'ngga, 2 pastga", en: '3 right, 2 down' },
      { ru: 'вправо 3, вверх 2', uz: "3 o'ngga, 2 tepaga", en: '3 right, 2 up' },
      { ru: 'вниз 3, вправо 2', uz: "3 pastga, 2 o'ngga", en: '3 down, 2 right' },
    ],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. Первое число по оси x, второе по оси y, минус ведёт вниз.',
      uz: "To'g'ri. Birinchi son x o'qi bo'ylab, ikkinchisi y o'qi bo'ylab, minus pastga olib boradi.",
      en: 'Right. The first number goes along x, the second along y, and the minus leads down.',
    },
    play_wrong: [
      null,
      { ru: 'У второй координаты минус, значит идём вниз.', uz: 'Ikkinchi koordinata minusli, demak pastga yuramiz.', en: 'The second coordinate is negative, so we go down.' },
      { ru: 'Числа переставлены: первое всегда по горизонтали.', uz: "Sonlar o'rni almashtirilgan: birinchisi doim gorizontal bo'ylab.", en: 'The numbers are swapped: the first is always horizontal.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу, как ставят точку. Возьмём пару минус четыре и один.',
        uz: "Nuqta qanday qo'yilishini ko'rsataman. Minus to'rt va bir juftligini olamiz.",
        en: 'I will show how a point is plotted. Take the pair minus four and one.',
      },
      demo: {
        ru: 'Начинаем всегда с начала координат. Первое число минус четыре, значит идём по горизонтали влево на четыре. Второе число один, поднимаемся на один. Точка найдена.',
        uz: "Doim koordinata boshidan boshlaymiz. Birinchi son minus to'rt, demak gorizontal bo'ylab chapga to'rt yuramiz. Ikkinchi son bir, birga ko'tarilamiz. Nuqta topildi.",
        en: 'Always start from the origin. The first number is minus four, so go four left horizontally. The second number is one, so rise by one. The point is found.',
      },
      play: {
        ru: 'Теперь ваша очередь. Куда идти для точки три и минус два?',
        uz: 'Endi sizning navbatingiz. Uch va minus ikki nuqtasi uchun qayoqqa borish kerak?',
        en: 'Now it is your turn. Where do you go for the point three and minus two?',
      },
      ok: {
        ru: 'Верно. Три вправо по горизонтали и два вниз.',
        uz: "To'g'ri. Gorizontal bo'ylab uch o'ngga va ikki pastga.",
        en: 'Right. Three right horizontally and two down.',
      },
      wrong: {
        ru: 'Первое число всегда по горизонтали, второе по вертикали, а знак выбирает сторону.',
        uz: "Birinchi son doim gorizontal, ikkinchisi vertikal bo'ylab, ishora esa tomonni tanlaydi.",
        en: 'The first number is always horizontal, the second vertical, and the sign picks the direction.',
      },
    },
  },

  s_quad: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Четыре четверти', uz: "To'rtta chorak", en: 'Four quarters' },
    lines: [
      { ru: 'справа сверху оба числа положительные', uz: "o'ng tepada ikkala son ham musbat", en: 'top right: both numbers positive' },
      { ru: 'слева снизу оба отрицательные', uz: 'chap pastda ikkalasi ham manfiy', en: 'bottom left: both negative' },
      { ru: 'на оси одна из координат равна нулю', uz: "o'qda koordinatalardan biri nolga teng", en: 'on an axis one coordinate is zero' },
    ],
    done: {
      ru: 'Оси делят плоскость на четыре четверти, и знаки пары сразу говорят, в какой она. Точки самих осей ни в одну четверть не попадают.',
      uz: "O'qlar tekislikni to'rt chorakka bo'ladi va juftlikning ishoralari uning qaysi chorakda ekanini darrov aytadi. O'qlarning o'z nuqtalari hech qaysi chorakka tushmaydi.",
      en: 'The axes split the plane into four quarters, and the signs tell you which one at once. Points on the axes belong to no quarter.',
    },
    audio: {
      ru: [
        'Две оси делят плоскость на четыре части, их называют четвертями и считают против часовой стрелки от правой верхней.',
        'Знаки пары сразу показывают четверть. Справа сверху оба числа положительные, слева сверху первое отрицательное, слева снизу оба отрицательные, справа снизу отрицательное только второе.',
        'Отдельный случай это точки самих осей. Если первое число ноль, точка стоит на вертикальной оси. Если ноль второе, на горизонтальной. Такие точки не попадают ни в одну четверть.',
      ],
      uz: [
        "Ikki o'q tekislikni to'rt qismga bo'ladi, ularni choraklar deb atashadi va o'ng tepadan boshlab soat strelkasiga teskari sanashadi.",
        "Juftlikning ishoralari chorakni darrov ko'rsatadi. O'ng tepada ikkala son ham musbat, chap tepada birinchisi manfiy, chap pastda ikkalasi ham manfiy, o'ng pastda faqat ikkinchisi manfiy.",
        "Alohida hol bu o'qlarning o'z nuqtalari. Birinchi son nol bo'lsa, nuqta vertikal o'qda turadi. Ikkinchisi nol bo'lsa, gorizontal o'qda. Bunday nuqtalar hech qaysi chorakka tushmaydi.",
      ],
      en: [
        'The two axes split the plane into four parts called quarters, counted counterclockwise from the top right.',
        'The signs show the quarter at once. Top right both positive, top left the first negative, bottom left both negative, bottom right only the second negative.',
        'A special case is points on the axes. If the first number is zero the point sits on the vertical axis; if the second is zero, on the horizontal one. Such points belong to no quarter.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Расстояние по дорожке', uz: "Yo'lka bo'ylab masofa", en: 'Distance along a path' },
    lead: { ru: 'Качели в точке (−3; 2), ворота в точке (5; 2).', uz: "Arg'imchoq (−3; 2) da, darvoza (5; 2) da.", en: 'The swing is at (−3; 2), the gate at (5; 2).' },
    steps: [
      { ru: 'вторые числа равны: обе точки на одной высоте', uz: 'ikkinchi sonlar teng: ikkala nuqta bir balandlikda', en: 'the second numbers match: same height' },
      { ru: 'считаем по горизонтали: 5 − (−3)', uz: "gorizontal bo'ylab hisoblaymiz: 5 − (−3)", en: 'measure horizontally: 5 − (−3)' },
      { ru: '= 8 шагов', uz: '= 8 qadam', en: '= 8 steps' },
    ],
    done: {
      ru: 'Когда вторые координаты совпадают, дорожка горизонтальная, и длина считается вычитанием из урока 28.',
      uz: "Ikkinchi koordinatalar mos kelganda yo'lka gorizontal bo'ladi va uzunlik 28-darsdagi ayirish bilan hisoblanadi.",
      en: 'When the second coordinates match the path is horizontal, and its length comes from the subtraction of lesson 28.',
    },
    audio: {
      ru: [
        'Решаем вместе. Качели стоят в точке минус три и два, ворота в точке пять и два.',
        'Смотрим на вторые числа: у обеих точек это двойка. Значит точки на одной высоте, и дорожка между ними горизонтальная.',
        'Длину считаем вычитанием: пять минус минус три это пять плюс три, то есть восемь шагов. Заодно вспомнили прошлый урок.',
      ],
      uz: [
        "Birga yechamiz. Arg'imchoq minus uch va ikki nuqtada, darvoza besh va ikki nuqtada turibdi.",
        "Ikkinchi sonlarga qaraymiz: ikkala nuqtada ham bu ikki. Demak nuqtalar bir balandlikda va ular orasidagi yo'lka gorizontal.",
        "Uzunlikni ayirish bilan hisoblaymiz: besh minus minus uch bu besh qo'shuv uch, ya'ni sakkiz qadam. Ayni paytda o'tgan darsni ham esladik.",
      ],
      en: [
        'Let us solve it together. The swing is at minus three and two, the gate at five and two.',
        'Look at the second numbers: both are two. So the points are at the same height and the path between them is horizontal.',
        'Its length comes from subtraction: five minus minus three is five plus three, that is eight steps. And we recalled the last lesson on the way.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Пара — это не набор чисел', uz: "Juftlik — sonlar to'plami emas", en: 'A pair is not just two numbers' },
    bad_line: { ru: 'ошибка: (2; −3) и (−3; 2) — «одно и то же»', uz: "xato: (2; −3) va (−3; 2) — «bir xil»", en: 'mistake: (2; −3) and (−3; 2) are “the same”' },
    good_line: { ru: 'верно: это разные точки в разных четвертях', uz: "to'g'ri: bular har xil chorakdagi turli nuqtalar", en: 'right: different points in different quarters' },
    warn_line: { ru: '(0; −4) стоит на оси y, а не в четверти', uz: "(0; −4) y o'qida turadi, chorakda emas", en: '(0; −4) sits on the y axis, not in a quarter' },
    done: {
      ru: 'Пара упорядочена: первое число всегда горизонталь. Поменяли местами — получили другую точку двора.',
      uz: "Juftlik tartiblangan: birinchi son doim gorizontal. O'rnini almashtirdingiz — hovlining boshqa nuqtasini oldingiz.",
      en: 'The pair is ordered: the first number is always horizontal. Swap them and you get a different spot in the yard.',
    },
    audio: {
      ru: [
        'Главная ошибка урока. Ученик видит те же два числа и решает, что точка та же.',
        'Но пара упорядочена. Два и минус три стоит справа внизу, а минус три и два слева вверху. Это разные места двора, и именно на этом ошибся Улугбек.',
        'И ещё один случай. Если одна из координат ноль, точка лежит на оси и ни в какую четверть не попадает.',
      ],
      uz: [
        "Darsning asosiy xatosi. O'quvchi o'sha ikki sonni ko'radi va nuqta ham o'sha deb hisoblaydi.",
        "Ammo juftlik tartiblangan. Ikki va minus uch o'ng pastda, minus uch va ikki esa chap tepada turadi. Bular hovlining har xil joylari, Ulug'bek aynan shunda xato qildi.",
        "Yana bir hol. Koordinatalardan biri nol bo'lsa, nuqta o'qda yotadi va hech qaysi chorakka tushmaydi.",
      ],
      en: [
        'The main mistake of this lesson. A student sees the same two numbers and decides it is the same point.',
        'But the pair is ordered. Two and minus three sits bottom right, minus three and two sits top left. Different places in the yard, and that is exactly where Ulugbek went wrong.',
        'One more case. If a coordinate is zero, the point lies on an axis and belongs to no quarter.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как читают точку', uz: "Nuqta qanday o'qiladi", en: 'How a point is read' },
    rule_1: {
      ru: 'Точку на плоскости задаёт упорядоченная пара: первое число откладывают по оси x, второе по оси y, отсчёт всегда от начала координат.',
      uz: "Tekislikdagi nuqtani tartiblangan juftlik belgilaydi: birinchi son x o'qiga, ikkinchisi y o'qiga qo'yiladi, hisob doim koordinata boshidan boshlanadi.",
      en: 'A point on the plane is given by an ordered pair: the first number along the x axis, the second along the y axis, always counted from the origin.',
    },
    rule_2: {
      ru: 'Знаки пары показывают четверть, а нулевая координата ставит точку на ось. Двор: (2; −3) значит вправо 2 и вниз 3. Права была Зухра.',
      uz: "Juftlik ishoralari chorakni ko'rsatadi, nol koordinata esa nuqtani o'qqa qo'yadi. Hovli: (2; −3) bu 2 o'ngga va 3 pastga. Zuhra haq edi.",
      en: 'The signs give the quarter, and a zero coordinate puts the point on an axis. The yard: (2; −3) means 2 right and 3 down. Zuhra was right.',
    },
    audio: {
      ru: 'Запомним правило. Точку на плоскости задаёт упорядоченная пара чисел. Первое откладывают по горизонтальной оси, второе по вертикальной, а отсчёт всегда идёт от начала координат. Знаки пары показывают четверть, а если одна координата равна нулю, точка стоит на оси. Вернёмся во двор. Пара два и минус три означает вправо на два и вниз на три. Права была Зухра.',
      uz: "Qoidani eslab qolamiz. Tekislikdagi nuqtani tartiblangan sonlar juftligi belgilaydi. Birinchisi gorizontal o'qqa, ikkinchisi vertikal o'qqa qo'yiladi, hisob esa doim koordinata boshidan boshlanadi. Juftlik ishoralari chorakni ko'rsatadi, koordinatalardan biri nolga teng bo'lsa, nuqta o'qda turadi. Hovliga qaytamiz. Ikki va minus uch juftligi o'ngga ikki va pastga uch degani. Zuhra haq edi.",
      en: 'Let us remember the rule. A point on the plane is given by an ordered pair. The first number goes along the horizontal axis, the second along the vertical one, always counted from the origin. The signs give the quarter, and a zero coordinate puts the point on an axis. Back to the yard. The pair two and minus three means two right and three down. Zuhra was right.',
    },
  },

  s_read: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Читаем координаты', uz: "Koordinatalarni o'qiymiz", en: 'Reading coordinates' },
    lead: { ru: 'Сначала горизонталь, потом вертикаль.', uz: 'Avval gorizontal, keyin vertikal.', en: 'Horizontal first, then vertical.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какие координаты у отмеченной точки?', uz: 'Belgilangan nuqtaning koordinatalari qanday?', en: 'What are the coordinates of the marked point?' },
        opts: ['(4; 3)', '(3; 4)', '(−4; 3)'],
        correct: 0,
        ok: { ru: 'Верно. По горизонтали 4, по вертикали 3.', uz: "To'g'ri. Gorizontal bo'ylab 4, vertikal bo'ylab 3.", en: 'Right. Four horizontally, three vertically.' },
        wrong: [
          null,
          { ru: 'Числа переставлены: первым идёт горизонтальное.', uz: "Sonlar o'rni almashtirilgan: birinchisi gorizontal.", en: 'The numbers are swapped: the horizontal one comes first.' },
          { ru: 'Точка справа от оси, значит первое число положительное.', uz: "Nuqta o'qning o'ng tomonida, demak birinchi son musbat.", en: 'The point is right of the axis, so the first number is positive.' },
        ],
      },
      {
        q: { ru: 'Какие координаты у отмеченной точки?', uz: 'Belgilangan nuqtaning koordinatalari qanday?', en: 'What are the coordinates of the marked point?' },
        opts: ['(−3; −2)', '(−2; −3)', '(3; 2)'],
        correct: 0,
        ok: { ru: 'Верно. Влево 3 и вниз 2, оба числа отрицательные.', uz: "To'g'ri. Chapga 3 va pastga 2, ikkala son ham manfiy.", en: 'Right. Three left and two down, both negative.' },
        wrong: [
          null,
          { ru: 'Числа переставлены местами.', uz: "Sonlar o'rni almashtirilgan.", en: 'The numbers are swapped.' },
          { ru: 'Точка слева снизу, знаки не могут быть плюсами.', uz: "Nuqta chap pastda, ishoralar plyus bo'lolmaydi.", en: 'The point is bottom left, the signs cannot be plus.' },
        ],
      },
      {
        q: { ru: 'Какие координаты у отмеченной точки?', uz: 'Belgilangan nuqtaning koordinatalari qanday?', en: 'What are the coordinates of the marked point?' },
        opts: ['(0; 3)', '(3; 0)', '(0; −3)'],
        correct: 0,
        ok: { ru: 'Верно. Точка на вертикальной оси, первая координата нулевая.', uz: "To'g'ri. Nuqta vertikal o'qda, birinchi koordinatasi nol.", en: 'Right. The point is on the vertical axis, its first coordinate is zero.' },
        wrong: [
          null,
          { ru: 'Так записана точка на горизонтальной оси.', uz: "Bunday yozuv gorizontal o'qdagi nuqtaniki.", en: 'That would be a point on the horizontal axis.' },
          { ru: 'Точка выше начала координат, значит второе число положительное.', uz: 'Nuqta koordinata boshidan yuqorida, demak ikkinchi son musbat.', en: 'The point is above the origin, so the second number is positive.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на чтение. Сначала смотрите, сколько пройдено по горизонтали, потом по вертикали.',
        uz: "O'qish mashqi. Avval gorizontal bo'ylab qancha yurilganiga, keyin vertikal bo'ylab qarang.",
        en: 'Reading practice. First see how far along the horizontal, then the vertical.',
      },
    },
  },

  s_where: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Где находится точка', uz: 'Nuqta qayerda joylashgan', en: 'Where the point is' },
    lead: { ru: 'Смотри на знаки: они сразу выдают место.', uz: 'Ishoralarga qarang: ular joyni darrov aytadi.', en: 'Look at the signs: they give the place away.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Где точка (−5; 4)?', uz: '(−5; 4) nuqtasi qayerda?', en: 'Where is (−5; 4)?' },
        opts: [
          { ru: 'слева сверху', uz: 'chap tepada', en: 'top left' },
          { ru: 'справа сверху', uz: "o'ng tepada", en: 'top right' },
          { ru: 'слева снизу', uz: 'chap pastda', en: 'bottom left' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Влево от оси и вверх.', uz: "To'g'ri. O'qdan chapga va tepaga.", en: 'Right. Left of the axis and up.' },
        wrong: [
          null,
          { ru: 'Первое число отрицательное, значит идём влево.', uz: 'Birinchi son manfiy, demak chapga yuramiz.', en: 'The first number is negative, so we go left.' },
          { ru: 'Второе число положительное, значит вверх.', uz: 'Ikkinchi son musbat, demak tepaga.', en: 'The second number is positive, so up.' },
        ],
      },
      {
        q: { ru: 'Где точка (6; −1)?', uz: '(6; −1) nuqtasi qayerda?', en: 'Where is (6; −1)?' },
        opts: [
          { ru: 'справа снизу', uz: "o'ng pastda", en: 'bottom right' },
          { ru: 'справа сверху', uz: "o'ng tepada", en: 'top right' },
          { ru: 'на оси x', uz: "x o'qida", en: 'on the x axis' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Вправо и вниз.', uz: "To'g'ri. O'ngga va pastga.", en: 'Right. Right and down.' },
        wrong: [
          null,
          { ru: 'Второе число отрицательное, значит вниз.', uz: 'Ikkinchi son manfiy, demak pastga.', en: 'The second number is negative, so down.' },
          { ru: 'На оси x вторая координата была бы нулём.', uz: "x o'qida ikkinchi koordinata nol bo'lardi.", en: 'On the x axis the second coordinate would be zero.' },
        ],
      },
      {
        q: { ru: 'Где точка (−2; 0)?', uz: '(−2; 0) nuqtasi qayerda?', en: 'Where is (−2; 0)?' },
        opts: [
          { ru: 'на оси x, слева от начала', uz: "x o'qida, boshdan chapda", en: 'on the x axis, left of the origin' },
          { ru: 'слева снизу', uz: 'chap pastda', en: 'bottom left' },
          { ru: 'на оси y', uz: "y o'qida", en: 'on the y axis' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Вторая координата нулевая, подниматься не нужно.', uz: "To'g'ri. Ikkinchi koordinata nol, ko'tarilish shart emas.", en: 'Right. The second coordinate is zero, no rising needed.' },
        wrong: [
          null,
          { ru: 'Ноль не опускает точку вниз, она осталась на оси.', uz: "Nol nuqtani pastga tushirmaydi, u o'qda qoldi.", en: 'Zero does not push the point down, it stays on the axis.' },
          { ru: 'На оси y нулём было бы первое число.', uz: "y o'qida birinchi son nol bo'lardi.", en: 'On the y axis the first number would be zero.' },
        ],
      },
      {
        q: { ru: 'В какой четверти обе координаты отрицательные?', uz: 'Qaysi chorakda ikkala koordinata ham manfiy?', en: 'In which quarter are both coordinates negative?' },
        opts: [
          { ru: 'слева снизу', uz: 'chap pastda', en: 'bottom left' },
          { ru: 'справа снизу', uz: "o'ng pastda", en: 'bottom right' },
          { ru: 'слева сверху', uz: 'chap tepada', en: 'top left' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Влево от оси и вниз от неё.', uz: "To'g'ri. O'qdan chapga va undan pastga.", en: 'Right. Left of the axis and below it.' },
        wrong: [
          null,
          { ru: 'Там первое число положительное.', uz: 'U yerda birinchi son musbat.', en: 'There the first number is positive.' },
          { ru: 'Там второе число положительное.', uz: 'U yerda ikkinchi son musbat.', en: 'There the second number is positive.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на четверти. Знак первого числа выбирает сторону, знак второго высоту.',
        uz: 'Choraklar mashqi. Birinchi sonning ishorasi tomonni, ikkinchisiniki balandlikni tanlaydi.',
        en: 'Practice on quarters. The first sign picks the side, the second the height.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Выше или ниже оси', uz: "O'qdan yuqorida yoki pastda", en: 'Above or below the axis' },
    lead: { ru: 'Решает только второе число пары.', uz: 'Faqat juftlikning ikkinchi soni hal qiladi.', en: 'Only the second number of the pair decides.' },
    bin_a: { ru: 'Выше оси x', uz: "x o'qidan yuqorida", en: 'Above the x axis' },
    bin_b: { ru: 'Ниже оси x', uz: "x o'qidan pastda", en: 'Below the x axis' },
    cards: [
      { label: '(3; 5)', bin: 'a' },
      { label: '(−2; 1)', bin: 'a' },
      { label: '(−6; 4)', bin: 'a' },
      { label: '(1; −2)', bin: 'b' },
      { label: '(−4; −3)', bin: 'b' },
      { label: '(5; −7)', bin: 'b' },
    ],
    hint: {
      ru: 'Первое число двигает вбок и на высоту не влияет.',
      uz: "Birinchi son yon tomonga suradi va balandlikka ta'sir qilmaydi.",
      en: 'The first number moves sideways and does not affect the height.',
    },
    correct_text: {
      ru: 'Верно. Высоту задаёт только вторая координата.',
      uz: "To'g'ri. Balandlikni faqat ikkinchi koordinata belgilaydi.",
      en: 'Right. Only the second coordinate sets the height.',
    },
    audio: {
      intro: {
        ru: 'Разложите точки по двум корзинам. Смотрите только на второе число пары.',
        uz: 'Nuqtalarni ikki savatga ajrating. Faqat juftlikning ikkinchi soniga qarang.',
        en: 'Sort the points into two baskets. Look only at the second number.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Смотри на второе число.', uz: 'Bu yerga emas. Ikkinchi songa qarang.', en: 'Not here. Look at the second number.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Улугбек: «(4; −1) и (−1; 4) — одна точка». Проверь.', uz: "Ulug'bek: «(4; −1) va (−1; 4) — bitta nuqta». Tekshiring.", en: 'Ulugbek: “(4; −1) and (−1; 4) are one point.” Check it.' },
        opts: [
          { ru: 'Нет: одна справа снизу, другая слева сверху', uz: "Yo'q: biri o'ng pastda, ikkinchisi chap tepada", en: 'No: one is bottom right, the other top left' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, обе на оси', uz: "Yo'q, ikkalasi ham o'qda", en: 'No, both are on an axis' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Пара упорядочена, перестановка даёт другую точку.', uz: "To'g'ri. Juftlik tartiblangan, o'rin almashtirish boshqa nuqtani beradi.", en: 'Right. The pair is ordered, swapping gives another point.' },
        wrong: [
          null,
          { ru: 'Числа те же, но роли у них разные.', uz: "Sonlar o'sha, lekin ularning roli har xil.", en: 'Same numbers, different roles.' },
          { ru: 'Ни одна координата не равна нулю.', uz: 'Hech bir koordinata nolga teng emas.', en: 'Neither coordinate is zero.' },
        ],
      },
      {
        q: { ru: 'Зухра: «(0; 5) лежит в первой четверти». Проверь.', uz: "Zuhra: «(0; 5) birinchi chorakda yotadi». Tekshiring.", en: 'Zuhra: “(0; 5) lies in the first quarter.” Check it.' },
        opts: [
          { ru: 'Нет: точка на оси y, четверти у неё нет', uz: "Yo'q: nuqta y o'qida, uning choragi yo'q", en: 'No: the point is on the y axis and has no quarter' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, она в четвёртой', uz: "Yo'q, u to'rtinchida", en: 'No, it is in the fourth' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Нулевая координата ставит точку на ось.', uz: "To'g'ri. Nol koordinata nuqtani o'qqa qo'yadi.", en: 'Right. A zero coordinate puts the point on an axis.' },
        wrong: [
          null,
          { ru: 'В четверти обе координаты не равны нулю.', uz: 'Chorakda ikkala koordinata ham nolga teng emas.', en: 'In a quarter neither coordinate is zero.' },
          { ru: 'Четвёртая четверть справа снизу, а точка выше начала.', uz: "To'rtinchi chorak o'ng pastda, nuqta esa boshdan yuqorida.", en: 'The fourth quarter is bottom right, but the point is above the origin.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в порядке чисел, и в разговоре про четверти.',
        uz: "Birovning yechimini tekshiring. Xato sonlar tartibida ham, choraklar haqidagi gapda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the order and in talk about quarters.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'План двора', uz: 'Hovli rejasi', en: 'The yard plan' },
    lead: { ru: 'Фонтан (−4; 1), качели (−3; 2), скамейка (2; −3), ворота (5; 2).', uz: "Favvora (−4; 1), arg'imchoq (−3; 2), skameyka (2; −3), darvoza (5; 2).", en: 'Fountain (−4; 1), swing (−3; 2), bench (2; −3), gate (5; 2).' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Что стоит справа снизу от флагштока?', uz: "Bayroq ustunidan o'ng pastda nima turibdi?", en: 'What stands bottom right of the flagpole?' },
        opts: [
          { ru: 'скамейка', uz: 'skameyka', en: 'the bench' },
          { ru: 'фонтан', uz: 'favvora', en: 'the fountain' },
          { ru: 'ворота', uz: 'darvoza', en: 'the gate' },
        ],
        correct: 0,
        ok: { ru: 'Верно. У скамейки (2; −3): вправо и вниз.', uz: "To'g'ri. Skameyka (2; −3) da: o'ngga va pastga.", en: 'Right. The bench is at (2; −3): right and down.' },
        wrong: [
          null,
          { ru: 'У фонтана первое число отрицательное, он слева.', uz: 'Favvoraning birinchi soni manfiy, u chapda.', en: 'The fountain has a negative first number, it is on the left.' },
          { ru: 'У ворот второе число положительное, они выше оси.', uz: "Darvozaning ikkinchi soni musbat, u o'qdan yuqorida.", en: 'The gate has a positive second number, it is above the axis.' },
        ],
      },
      {
        q: { ru: 'Сколько шагов от качелей до ворот по прямой дорожке?', uz: "Arg'imchoqdan darvozagacha to'g'ri yo'lka bo'ylab necha qadam?", en: 'How many steps from the swing to the gate along the straight path?' },
        opts: ['8', '2', '5'],
        correct: 0,
        ok: { ru: 'Верно. 5 − (−3) = 8 шагов, дорожка горизонтальная.', uz: "To'g'ri. 5 − (−3) = 8 qadam, yo'lka gorizontal.", en: 'Right. 5 − (−3) = 8 steps along a horizontal path.' },
        wrong: [
          null,
          { ru: 'Это разность вторых чисел, а они равны.', uz: 'Bu ikkinchi sonlar ayirmasi, ular esa teng.', en: 'That is the difference of the second numbers, and they are equal.' },
          { ru: 'Знак у первой координаты качелей потерян.', uz: "Arg'imchoq birinchi koordinatasining ishorasi yo'qolgan.", en: 'The sign of the swing’s first coordinate was lost.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача по плану двора. Фонтан, качели, скамейка и ворота отмечены парами чисел.',
        uz: "Hovli rejasi bo'yicha masala. Favvora, arg'imchoq, skameyka va darvoza sonlar juftligi bilan belgilangan.",
        en: 'A yard plan problem. The fountain, swing, bench and gate are marked by pairs of numbers.',
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
        q: { ru: 'Точки (−2; 4) и (5; 4). Сколько между ними по горизонтали? Набери ответ.', uz: "(−2; 4) va (5; 4) nuqtalari. Gorizontal bo'ylab ular orasi qancha? Javobni tering.", en: 'Points (−2; 4) and (5; 4). How far apart horizontally? Type the answer.' },
        hint: { ru: 'Вторые числа равны, считай 5 − (−2).', uz: 'Ikkinchi sonlar teng, 5 − (−2) ni hisoblang.', en: 'The second numbers match, compute 5 − (−2).' },
        hint_audio: { ru: 'Вторые числа у точек одинаковые, значит дорожка горизонтальная. Посчитайте пять минус минус два.', uz: "Nuqtalarning ikkinchi sonlari bir xil, demak yo'lka gorizontal. Besh minus minus ikkini hisoblang.", en: 'The second numbers match, so the path is horizontal. Compute five minus minus two.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Куда идти для точки (−1; −5)?', uz: '(−1; −5) nuqtasi uchun qayoqqa borish kerak?', en: 'Where do you go for (−1; −5)?' },
        opts: [
          { ru: 'влево 5, вниз 1', uz: '5 chapga, 1 pastga', en: '5 left, 1 down' },
          { ru: 'влево 1, вверх 5', uz: '1 chapga, 5 tepaga', en: '1 left, 5 up' },
          { ru: 'влево 1, вниз 5', uz: '1 chapga, 5 pastga', en: '1 left, 5 down' },
          { ru: 'вправо 1, вниз 5', uz: "1 o'ngga, 5 pastga", en: '1 right, 5 down' },
        ],
        wrong: [
          { ru: 'Числа переставлены местами.', uz: "Sonlar o'rni almashtirilgan.", en: 'The numbers are swapped.' },
          { ru: 'Второе число отрицательное, значит вниз.', uz: 'Ikkinchi son manfiy, demak pastga.', en: 'The second number is negative, so down.' },
          null,
          { ru: 'Первое число отрицательное, значит влево.', uz: 'Birinchi son manfiy, demak chapga.', en: 'The first number is negative, so left.' },
        ],
        correct: { ru: 'Верно. Сначала по горизонтали, потом по вертикали.', uz: "To'g'ri. Avval gorizontal, keyin vertikal bo'ylab.", en: 'Right. Horizontal first, then vertical.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'У какой точки первая координата равна нулю?', uz: 'Qaysi nuqtaning birinchi koordinatasi nolga teng?', en: 'Which point has a zero first coordinate?' },
        opts: ['(4; 0)', '(0; 4)', '(4; 4)', '(−4; 0)'],
        wrong: [
          { ru: 'Здесь ноль стоит вторым, точка на горизонтальной оси.', uz: "Bu yerda nol ikkinchi, nuqta gorizontal o'qda.", en: 'Here the zero is second, the point sits on the horizontal axis.' },
          null,
          { ru: 'Здесь нулей нет вовсе.', uz: "Bu yerda nol umuman yo'q.", en: 'There are no zeros here at all.' },
          { ru: 'Ноль снова стоит вторым.', uz: 'Nol yana ikkinchi turibdi.', en: 'The zero is second again.' },
        ],
        correct: { ru: 'Верно. Точка стоит на вертикальной оси.', uz: "To'g'ri. Nuqta vertikal o'qda turadi.", en: 'Right. The point sits on the vertical axis.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Точка слева сверху. Какие у неё знаки?', uz: 'Nuqta chap tepada. Uning ishoralari qanday?', en: 'A point is top left. What are its signs?' },
        opts: [
          { ru: 'оба плюс', uz: 'ikkalasi plyus', en: 'both plus' },
          { ru: 'оба минус', uz: 'ikkalasi minus', en: 'both minus' },
          { ru: 'первое плюс, второе минус', uz: 'birinchisi plyus, ikkinchisi minus', en: 'first plus, second minus' },
          { ru: 'первое минус, второе плюс', uz: 'birinchisi minus, ikkinchisi plyus', en: 'first minus, second plus' },
        ],
        wrong: [
          { ru: 'Это справа сверху.', uz: "Bu o'ng tepada.", en: 'That is top right.' },
          { ru: 'Это слева снизу.', uz: 'Bu chap pastda.', en: 'That is bottom left.' },
          { ru: 'Это справа снизу.', uz: "Bu o'ng pastda.", en: 'That is bottom right.' },
          null,
        ],
        correct: { ru: 'Верно. Влево — минус, вверх — плюс.', uz: "To'g'ri. Chapga — minus, tepaga — plyus.", en: 'Right. Left is minus, up is plus.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Почему (3; −7) и (−7; 3) — разные точки?', uz: 'Nega (3; −7) va (−7; 3) turli nuqtalar?', en: 'Why are (3; −7) and (−7; 3) different points?' },
        opts: [
          { ru: 'Пара упорядочена: первое число всегда по горизонтали', uz: "Juftlik tartiblangan: birinchi son doim gorizontal bo'ylab", en: 'The pair is ordered: the first number is always horizontal' },
          { ru: 'Потому что числа разные', uz: 'Chunki sonlar har xil', en: 'Because the numbers differ' },
          { ru: 'Потому что одна на оси', uz: "Chunki biri o'qda", en: 'Because one is on an axis' },
          { ru: 'Они одинаковые', uz: 'Ular bir xil', en: 'They are the same' },
        ],
        wrong: [
          null,
          { ru: 'Числа как раз одни и те же, разный у них порядок.', uz: "Sonlar aynan o'sha, tartibi esa har xil.", en: 'The numbers are the same, the order differs.' },
          { ru: 'Ни одна координата не равна нулю.', uz: 'Hech bir koordinata nolga teng emas.', en: 'Neither coordinate is zero.' },
          { ru: 'Одна справа снизу, другая слева сверху.', uz: "Biri o'ng pastda, ikkinchisi chap tepada.", en: 'One is bottom right, the other top left.' },
        ],
        correct: { ru: 'Верно. Роли чисел в паре разные.', uz: "To'g'ri. Juftlikdagi sonlarning roli har xil.", en: 'Right. The numbers play different roles.' },
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
      ru: 'Любое место на Земле задают такой же парой чисел: широтой и долготой. У Ташкента это примерно 41 градус северной широты и 69 восточной долготы. Поменяешь числа местами — попадёшь в Индийский океан, поэтому в навигации порядок соблюдают строго.',
      uz: "Yer yuzidagi har qanday joy xuddi shunday sonlar juftligi bilan beriladi: kenglik va uzunlik. Toshkent uchun bu taxminan 41 daraja shimoliy kenglik va 69 daraja sharqiy uzunlik. Sonlarni almashtirsangiz, Hind okeaniga tushasiz, shuning uchun navigatsiyada tartibga qat'iy amal qilinadi.",
      en: 'Any place on Earth is given by the same kind of pair: latitude and longitude. For Tashkent that is about 41 degrees north and 69 degrees east. Swap the numbers and you land in the Indian Ocean, which is why navigation keeps the order strictly.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Любое место на Земле задают такой же парой чисел: широтой и долготой. У Ташкента это примерно сорок один градус северной широты и шестьдесят девять восточной долготы. Поменяешь числа местами и попадёшь в Индийский океан, поэтому в навигации порядок соблюдают строго.',
      uz: "Bilasizmi? Yer yuzidagi har qanday joy xuddi shunday sonlar juftligi bilan beriladi: kenglik va uzunlik. Toshkent uchun bu taxminan qirq bir daraja shimoliy kenglik va oltmish to'qqiz daraja sharqiy uzunlik. Sonlarni almashtirsangiz Hind okeaniga tushasiz, shuning uchun navigatsiyada tartibga qat'iy amal qilinadi.",
      en: 'Did you know? Any place on Earth is given by the same kind of pair: latitude and longitude. For Tashkent that is about forty one degrees north and sixty nine degrees east. Swap the numbers and you land in the Indian Ocean, which is why navigation keeps the order strictly.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Координаты', uz: 'Matematika · Koordinatalar', en: 'Mathematics · Coordinates' },
    heading: { ru: 'Плоскость', uz: 'Tekislik', en: 'The plane' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'точку задаёт упорядоченная пара', uz: 'nuqtani tartiblangan juftlik belgilaydi', en: 'an ordered pair fixes a point' },
    brief_2: { ru: 'первое число по x, второе по y', uz: "birinchi son x bo'ylab, ikkinchisi y bo'ylab", en: 'first along x, second along y' },
    brief_3: { ru: 'знаки показывают четверть', uz: "ishoralar chorakni ko'rsatadi", en: 'the signs give the quarter' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Начало координат', uz: 'Koordinata boshi', en: 'The origin' },
    memo_a1: { ru: 'точка (0; 0)', uz: '(0; 0) nuqtasi', en: 'the point (0; 0)' },
    memo_q2: { ru: 'Нулевая координата', uz: 'Nol koordinata', en: 'A zero coordinate' },
    memo_a2: { ru: 'ставит точку на ось', uz: "nuqtani o'qqa qo'yadi", en: 'puts the point on an axis' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'переставить числа пары', uz: "juftlik sonlarini almashtirish", en: 'swapping the pair' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Точку на плоскости задаёт упорядоченная пара чисел. Первое откладывают по горизонтальной оси, второе по вертикальной, отсчёт идёт от начала координат. Знаки показывают четверть, а нулевая координата ставит точку на ось.',
        'Двор: пара два и минус три это вправо на два и вниз на три.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Tekislikdagi nuqtani tartiblangan sonlar juftligi belgilaydi. Birinchisi gorizontal o'qqa, ikkinchisi vertikal o'qqa qo'yiladi, hisob koordinata boshidan boshlanadi. Ishoralar chorakni ko'rsatadi, nol koordinata esa nuqtani o'qqa qo'yadi.",
        "Hovli: ikki va minus uch juftligi o'ngga ikki va pastga uch degani.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'An ordered pair fixes a point on the plane. The first number goes along the horizontal axis, the second along the vertical one, counted from the origin. The signs give the quarter, and a zero coordinate puts the point on an axis.',
        'The yard: the pair two and minus three means two right and three down.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. От начала координат', uz: 'Usul. Koordinata boshidan', en: 'Method. From the origin' },
    m1_steps: {
      ru: ['Встань в начало координат', 'Пройди первое число по горизонтали', 'Пройди второе число по вертикали'],
      uz: ['Koordinata boshiga turing', "Birinchi sonni gorizontal bo'ylab yuring", "Ikkinchi sonni vertikal bo'ylab yuring"],
      en: ['Stand at the origin', 'Walk the first number horizontally', 'Walk the second number vertically'],
    },
    m1_no: {
      ru: 'Порядок менять нельзя: перестановка даёт другую точку.',
      uz: "Tartibni o'zgartirib bo'lmaydi: almashtirish boshqa nuqtani beradi.",
      en: 'The order cannot change: swapping gives a different point.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьный двор, размеченный дорожками от флагштока.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d30sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAF4F9"/><stop offset="100%" stopColor="#F9F4EB"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d30sky)"/>

    {/* Здание школы за двором */}
    <g opacity="0.85">
      <rect x="12" y="18" width="86" height="52" rx="4" fill="#E4D9C6" stroke="#C9A472" strokeWidth="2"/>
      {[0, 1, 2].map((k) => (
        <rect key={k} x={22 + k * 26} y="30" width="16" height="14" rx="2" fill="#7ECBE6"/>
      ))}
      <rect x="46" y="52" width="18" height="18" rx="2" fill="#B08A55"/>
    </g>
    <circle cx="360" cy="30" r="16" fill="#F5C77E" opacity="0.7"/>

    {/* Двор: дорожки образуют сетку */}
    <rect x="104" y="18" width="272" height="118" rx="6" fill="#8FBF7F"/>
    {Array.from({ length: 7 }, (_, i) => (
      <path key={'v' + i} d={`M${118 + i * 40} 18 v118`} stroke="#F4EEDF" strokeWidth="2" opacity="0.55"/>
    ))}
    {Array.from({ length: 3 }, (_, i) => (
      <path key={'h' + i} d={`M104 ${44 + i * 34} h272`} stroke="#F4EEDF" strokeWidth="2" opacity="0.55"/>
    ))}

    {/* Флагшток в середине двора */}
    <g>
      <path d="M238 112 v-64" stroke="#8E8578" strokeWidth="3"/>
      <path className="d30-flag" d="M238 50 q16 5 30 0 q-14 9 0 14 q-16 3 -30 0 z" fill="#019ACB"/>
      <ellipse cx="238" cy="113" rx="9" ry="3.5" fill="#6FA463"/>
    </g>

    {/* Две отмеченные точки двора, какая нужна — не сказано */}
    <g>
      <circle cx="318" cy="112" r="7" fill="#FFFDF7" stroke="#D9603F" strokeWidth="2.4"/>
      <text x="318" y="116" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">A</text>
      <circle cx="158" cy="78" r="7" fill="#FFFDF7" stroke="#019ACB" strokeWidth="2.4"/>
      <text x="158" y="82" textAnchor="middle" fill="#019ACB"
        fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">B</text>
    </g>

    {/* Записка в руках ученицы */}
    <g className="d30-note">
      <rect x="-22" y="-16" width="44" height="32" rx="3" fill="#FFFDF7" stroke="#C9A472" strokeWidth="1.6"/>
      <text x="0" y="4" textAnchor="middle" fill="#494550"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">(2; −3)</text>
    </g>
    <Person x={52} ground={140} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={86} ground={140} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <rect x="0" y="140" width="400" height="14" fill="#D2A96F"/>
  </svg>
);

// Итог: две точки с одинаковыми числами в разном порядке.
// Точка (−1; 2) стояла во второй строке кадра: и сама точка, и её подпись
// вылезали за верх и обрезались (QA 2026-08-19, замер: круг на 8 px, подпись на
// 10 px). Высота кадра финала общая для класса — 400 на 92, поэтому уменьшена
// клетка (22 -> 18) и центр опущен на две единицы: теперь обе точки с подписями
// внутри, а до нижней надписи остаётся двенадцать единиц.
const FinalScene = () => {
  const lang = useLang();
  const c = 18;
  const cx = 200; const cy = 44;
  const px = (v) => cx + v * c;
  const py = (v) => cy - v * c;
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <path d={`M${px(-6)} ${cy} h${12 * c}`} stroke="#8E8578" strokeWidth="1.8"/>
      <path d={`M${cx} 8 v76`} stroke="#8E8578" strokeWidth="1.8"/>
      <circle cx={px(2)} cy={py(-1)} r="6" fill="#D9603F"/>
      <text x={px(2) + 12} y={py(-1) + 4} fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">(2; −1)</text>
      <circle cx={px(-1)} cy={py(2)} r="6" fill="#019ACB"/>
      <text x={px(-1) - 12} y={py(2) + 4} textAnchor="end" fill="#019ACB"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">(−1; 2)</text>
      <text x="200" y="88" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'те же числа, другой порядок, другая точка',
          "o'sha sonlar, boshqa tartib, boshqa nuqta",
          'same numbers, different order, different point')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Координатная прямая из урока 24 — нужна только на экране «вспомним».
const OneLine = ({ mark }) => {
  const px = (v) => 200 + v * 28;
  return (
    <span className="d30-one-box">
      <svg viewBox="0 0 400 46" aria-hidden="true">
        <path d="M8 26 h384" stroke="#8E8578" strokeWidth="2.2"/>
        {Array.from({ length: 13 }, (_, i) => i - 6).map((v) => (
          <g key={v}>
            <path d={`M${px(v)} 21 v10`} stroke="#8E8578" strokeWidth={v === 0 ? 3 : 1.2}/>
            <text x={px(v)} y={42} textAnchor="middle" fill={v === 0 ? '#494550' : '#8A8883'}
              fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{v}</text>
          </g>
        ))}
        <circle cx={px(mark)} cy="26" r="6" fill="#019ACB"/>
        <text x={px(mark)} y="14" textAnchor="middle" fill="#019ACB"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{mark}</text>
      </svg>
    </span>
  );
};

// Прибор урока: координатная плоскость. leg показывает путь от начала координат.
const Plane = ({ points = [], leg = 0, quads = false, size = 'mid' }) => {
  const c = 24;
  const cx = 180; const cy = 108;
  const px = (v) => cx + v * c;
  const py = (v) => cy - v * c;
  const p0 = points[0];
  return (
    <span className={'d30-plane-box d30-plane-' + size}>
      <svg viewBox="0 0 360 232" aria-hidden="true">
        <defs>
          <marker id="d30ax" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
            <path d="M0 0 L7 3.5 L0 7 z" fill="#8E8578"/>
          </marker>
        </defs>
        <rect x="0" y="0" width="360" height="232" fill="#FFFDF7"/>

        {quads && (
          <g opacity="0.5">
            <rect x={cx} y={py(4)} width={7 * c} height={4 * c} fill="#E3F0E8"/>
            <rect x={px(-7)} y={py(4)} width={7 * c} height={4 * c} fill="#E7F5FA"/>
            <rect x={px(-7)} y={cy} width={7 * c} height={4 * c} fill="#FBF3D6"/>
            <rect x={cx} y={cy} width={7 * c} height={4 * c} fill="#FFF1EC"/>
          </g>
        )}

        {/* Сетка двора */}
        {Array.from({ length: 15 }, (_, i) => i - 7).map((v) => (
          <path key={'v' + v} d={`M${px(v)} ${py(4)} v${8 * c}`} stroke="#EDE7DC" strokeWidth="1"/>
        ))}
        {Array.from({ length: 9 }, (_, i) => i - 4).map((v) => (
          <path key={'h' + v} d={`M${px(-7)} ${py(v)} h${14 * c}`} stroke="#EDE7DC" strokeWidth="1"/>
        ))}

        {/* Оси */}
        <path d={`M${px(-7)} ${cy} h${14 * c + 8}`} stroke="#8E8578" strokeWidth="2" markerEnd="url(#d30ax)"/>
        <path d={`M${cx} ${py(-4)} v${-(8 * c + 8)}`} stroke="#8E8578" strokeWidth="2" markerEnd="url(#d30ax)"/>
        <text x={px(7) + 4} y={cy + 18} fill="#8A8883"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">x</text>
        {/* Подпись оси стояла в четвёртой строке над последней клеткой и её
            срезала рамка кадра (замер: 2 px). Опущена под наконечник стрелки. */}
        <text x={cx + 8} y={py(4) + 8} fill="#8A8883"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">y</text>
        <text x={cx - 8} y={cy + 14} textAnchor="end" fill="#8A8883"
          fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">0</text>

        {/* Подписи делений */}
        {[-6, -4, -2, 2, 4, 6].map((v) => (
          <text key={'lx' + v} x={px(v)} y={cy + 15} textAnchor="middle" fill="#8A8883"
            fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{v}</text>
        ))}
        {[-3, -1, 1, 3].map((v) => (
          <text key={'ly' + v} x={cx - 7} y={py(v) + 4} textAnchor="end" fill="#8A8883"
            fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{v}</text>
        ))}

        {/* Путь от начала координат к первой точке */}
        {p0 && leg >= 1 && (
          <path d={`M${cx} ${cy} H${px(p0.x)}`} stroke="#D9603F" strokeWidth="2.6"
            strokeDasharray="6 4" strokeLinecap="round"/>
        )}
        {p0 && leg >= 2 && (
          <path d={`M${px(p0.x)} ${cy} V${py(p0.y)}`} stroke="#019ACB" strokeWidth="2.6"
            strokeDasharray="6 4" strokeLinecap="round"/>
        )}

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={px(p.x)} cy={py(p.y)} r="6.5" fill={p.tone || '#1F7A4D'}/>
            {p.name && (
              <text x={px(p.x) + (p.x > 4 ? -10 : 10)} y={py(p.y) - 9}
                textAnchor={p.x > 4 ? 'end' : 'start'} fill={p.tone || '#1F7A4D'}
                fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{p.name}</text>
            )}
          </g>
        ))}
      </svg>
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d30-line d30-fade' + (on ? ' d30-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d30-stage">
        <OneLine mark={-3}/>
        <span className={'d30-chips d30-fade' + (step >= 1 ? ' d30-on' : '')}>
          <i className="d30-chip-l">{tri(lang, 'одно число — одно место', 'bitta son — bitta joy', 'one number, one spot')}</i>
          <i className="d30-chip-w">{tri(lang, 'а во дворе?', 'hovlida-chi?', 'and in a yard?')}</i>
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

// Ядро: две оси, путь вправо 2 и вниз 3.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d30-stage d30-stage-row">
        <Plane size="sm" leg={step >= 1 ? 2 : 1}
          points={step >= 1 ? [{ x: 2, y: -3, name: '(2; −3)' }] : []}/>
        <span className="d30-col">
          {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
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

// Четверти и точки осей.
const QuadBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_quad;
  const pts = [];
  if (step >= 0) pts.push({ x: 4, y: 3, name: '(4; 3)', tone: '#1F7A4D' });
  if (step >= 0) pts.push({ x: -4, y: -3, name: '(−4; −3)', tone: '#019ACB' });
  if (step >= 2) pts.push({ x: 0, y: 3, name: '(0; 3)', tone: '#D9603F' });
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d30-stage d30-stage-row">
        <Plane size="sm" quads points={pts}/>
        <span className="d30-col">
          {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
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
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d30-stage d30-stage-row">
        <Plane size="sm"
          points={[{ x: -3, y: 2, name: '(−3; 2)', tone: '#019ACB' }, { x: 5, y: 2, name: '(5; 2)', tone: '#D9603F' }]}/>
        <span className="d30-col">
          {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
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

// Граница: перестановка чисел даёт другую точку.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d30-stage d30-stage-row">
        <Plane size="sm"
          points={[
            { x: 2, y: -3, name: '(2; −3)', tone: '#D9603F' },
            ...(step >= 1 ? [{ x: -3, y: 2, name: '(−3; 2)', tone: '#019ACB' }] : []),
            ...(step >= 2 ? [{ x: 0, y: -4, name: '(0; −4)', tone: '#1F7A4D' }] : []),
          ]}/>
        <span className="d30-col">
          <span className="d30-pair d30-pair-bad"><Line node={t(c.bad_line)} on/></span>
          <span className={'d30-pair d30-pair-good d30-fade' + (step >= 1 ? ' d30-on' : '')}>
            <Line node={t(c.good_line)} on/>
          </span>
          <span className={'d30-pair d30-pair-warn d30-fade' + (step >= 2 ? ' d30-on' : '')}>
            <Line node={t(c.warn_line)} on/>
          </span>
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
        correctAnswer: pickL(c.play_opts[c.play_correct], lang), studentAnswer: pickL(c.play_opts[i], lang),
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
        <div className={'d30-banner fade-up delay-1' + (phase === 'play' ? ' d30-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d30-stage d30-stage-tool d30-stage-row">
          {phase === 'demo' ? (
            <>
              <Plane size="sm" leg={shown >= 1 ? (shown >= 2 ? 2 : 1) : 0}
                points={shown >= 2 ? [{ x: -4, y: 1, name: '(−4; 1)' }] : []}/>
              <span className="d30-col">
                {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
                <p className={'body d30-verdict' + (done ? ' d30-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
              </span>
            </>
          ) : (
            <span className="d30-col">
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={i} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{t(o)}</button>
                ))}
              </div>
              {picked !== null && !solved && <HintBlock show>{mt(t(c.play_wrong[picked] || c.play_ok))}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(c.play_ok))}</p>
                </FeedbackBlock>
              )}
            </span>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d30-acts fade-up">
            <button className="d30-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d30-btn d30-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenQuad = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_quad} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <QuadBody step={step}/>}/>
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
      <div className="d30-stage">
        <Plane size="sm" leg={2} points={[{ x: 2, y: -3, name: '(2; −3)' }]}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

// Чертёж к чтению координат: у каждого задания своя точка.
const READ_POINTS = [
  { x: 4, y: 3 },
  { x: -3, y: -2 },
  { x: 0, y: 3 },
];

const ScreenRead = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_read}
    figureNode={(it, idx) => (
      <div className="d30-task-fig">
        <Plane size="sm" points={[READ_POINTS[idx] || READ_POINTS[0]]}/>
      </div>
    )}/>
);
const ScreenWhere = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_where} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: весь план двора на одном чертеже.
const YARD = [
  { x: -4, y: 1, name: 'F', tone: '#019ACB' },
  { x: -3, y: 2, name: 'Q', tone: '#1F7A4D' },
  { x: 2, y: -3, name: 'S', tone: '#D9603F' },
  { x: 5, y: 2, name: 'D', tone: '#B08A55' },
];

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={() => (
      <div className="d30-task-fig">
        <Plane size="sm" points={YARD}/>
      </div>
    )}/>
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
.d30-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d30-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d30-stage-tool .d30-line { font-size: clamp(12px, 2vw, 16px); }

/* Чертёж и текст рядом, на узком экране — друг под другом */
.d30-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d30-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 200px; min-width: 0; }

/* Координатная плоскость */
.d30-plane-box { display: block; width: 100%; max-width: 300px; }
.d30-plane-sm { max-width: 268px; }
.d30-plane-xs { max-width: 218px; }
.d30-plane-box svg { width: 100%; height: auto; display: block; }

/* Координатная прямая на экране «вспомним» */
.d30-one-box { display: block; width: 100%; }
.d30-one-box svg { width: 100%; height: auto; display: block; }

.d30-fade { opacity: 0; transition: opacity 420ms linear; }
.d30-on { opacity: 1; }
.d30-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; text-align: center; }

/* Подписи */
.d30-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d30-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d30-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d30-chip-w { background: #FBF3D6; border: 1px solid #E4CE93; color: #8A6A22; }

/* Строки экрана границы */
.d30-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d30-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d30-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d30-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d30-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d30-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d30-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d30-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d30-verdict-on { opacity: 1; }
.d30-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d30-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d30-btn:disabled { opacity: 0.45; cursor: default; }
.d30-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d30-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: флаг колышется, записку держат в руках */
.d30-flag { animation: d30Flag 3200ms ease-in-out infinite; transform-origin: 238px 50px; }
@keyframes d30Flag { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(0.86); } }
.d30-note { animation: d30Note 4200ms ease-in-out infinite; }
@keyframes d30Note { 0%, 100% { transform: translate(72px, 104px) rotate(-4deg); } 50% { transform: translate(72px, 100px) rotate(3deg); } }
@media (prefers-reduced-motion: reduce) { .d30-flag { animation: none; } .d30-note { animation: none; transform: translate(72px, 102px); } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function CoordinatePlaneLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenQuad, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenRead, ScreenWhere, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
