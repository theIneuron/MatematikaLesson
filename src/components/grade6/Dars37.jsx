// ============================================================
// 6 КЛАСС, УРОК 37 «Окружность и круг»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б10, второй урок. Разница между окружностью и кругом вводится
// не определением, а действием: покрасить ободок тарелки или покрасить
// всю тарелку. Положение точки решается сравнением её расстояния до
// центра с радиусом — тем же сравнением, что в уроках 24-26.
//
// Сцена — кружок керамики, гончарный круг с тарелками.
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
  lessonId: 'grade6-37',
  lessonTitle: {
    ru: 'Окружность и круг',
    uz: 'Aylana va doira',
    en: 'Circle and disc',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 kulolchilik: qaysi tarelka
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 masofa esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 aylana chiziq, doira to'ldirilgan
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: radius va diametr
  { id: 's_parts',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 vatar, yoy va nuqta joylashuvi
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: nuqta qayerda
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: radius va diametr
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_rad',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 radius va diametr x3
  { id: 's_where',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 elementlar va joylashuv x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: ichida yoki tashqarida
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: ustaxona
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Задание в мастерской', uz: 'Ustaxonadagi topshiriq', en: 'A task in the workshop' },
    lead: {
      ru: 'Мастер сказал: покрасить окружность тарелки. Фаррух и Нилуфар поняли по-разному.',
      uz: "Usta aytdi: tarelkaning aylanasini bo'yash kerak. Farrux va Nilufar buni har xil tushundi.",
      en: 'The teacher said: paint the circle of the plate. Farrukh and Nilufar understood it differently.',
    },
    voice_a: { ru: 'Фаррух закрасил всю тарелку.', uz: "Farrux butun tarelkani bo'yadi.", en: 'Farrukh painted the whole plate.' },
    voice_b: { ru: 'Нилуфар покрасила только ободок.', uz: "Nilufar faqat chetini bo'yadi.", en: 'Nilufar painted only the rim.' },
    ask: { ru: 'Кто выполнил задание?', uz: 'Kim topshiriqni bajardi?', en: 'Who did the task?' },
    options: [
      { ru: 'Фаррух', uz: 'Farrux', en: 'Farrukh' },
      { ru: 'Нилуфар', uz: 'Nilufar', en: 'Nilufar' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В кружке керамики на гончарном круге сделали две одинаковые тарелки. Мастер попросил покрасить окружность тарелки.',
          'Фаррух закрасил всю тарелку целиком, а Нилуфар только тонкий ободок по краю. Кто выполнил задание? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Kulolchilik to'garagida kulolchilik charxida ikkita bir xil tarelka yasaldi. Usta tarelkaning aylanasini bo'yashni so'radi.",
          "Farrux butun tarelkani bo'yadi, Nilufar esa faqat chetidagi ingichka halqani. Kim topshiriqni bajardi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'In the pottery club two identical plates were made on the wheel. The teacher asked to paint the circle of the plate.',
          'Farrukh painted the whole plate, Nilufar only the thin rim along the edge. Who did the task? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Расстояние от точки до точки', uz: 'Nuqtadan nuqtagacha masofa', en: 'Distance from point to point' },
    done: {
      ru: 'Расстояние — это длина, оно всегда неотрицательно. Сегодня всё будет решаться сравнением расстояния с одним числом.',
      uz: "Masofa bu uzunlik, u har doim manfiy emas. Bugun hamma narsa masofani bitta son bilan solishtirish orqali hal bo'ladi.",
      en: 'Distance is a length and never negative. Today everything will be decided by comparing a distance with one number.',
    },
    audio: {
      ru: [
        'Вспомним двадцать пятый урок. Расстояние это длина пути от одной точки до другой, и отрицательным оно не бывает.',
        'На гончарном круге есть особая точка, это центр, вокруг которого всё вращается.',
        'Сегодня всё будет решаться одним сравнением: далеко ли точка от центра и как это расстояние соотносится с одним важным числом.',
      ],
      uz: [
        "Yigirma beshinchi darsni eslaymiz. Masofa bu bir nuqtadan ikkinchisigacha bo'lgan yo'l uzunligi, u manfiy bo'lmaydi.",
        "Kulolchilik charxida alohida nuqta bor, bu markaz, hamma narsa uning atrofida aylanadi.",
        "Bugun hamma narsa bitta solishtirish bilan hal bo'ladi: nuqta markazdan uzoqmi va bu masofa bitta muhim son bilan qanday nisbatda.",
      ],
      en: [
        'Recall lesson twenty five. Distance is the length of the path from one point to another and is never negative.',
        'A potter’s wheel has a special point, the centre, around which everything turns.',
        'Today everything will be settled by one comparison: how far a point is from the centre and how that distance relates to one important number.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Линия и вся фигура', uz: 'Chiziq va butun shakl', en: 'The line and the whole shape' },
    lines: [
      { ru: 'окружность — линия, все точки на равном расстоянии от центра', uz: 'aylana — chiziq, barcha nuqtalari markazdan teng masofada', en: 'a circle is a line: every point equally far from the centre' },
      { ru: 'круг — окружность и всё, что внутри', uz: "doira — aylana va uning ichidagi hamma narsa", en: 'a disc is the circle together with everything inside' },
      { ru: 'ободок — окружность, вся тарелка — круг', uz: 'chet halqa — aylana, butun tarelka — doira', en: 'the rim is the circle, the whole plate is the disc' },
    ],
    done: {
      ru: 'Окружность красят как линию, круг — как поверхность. Задание было про окружность, значит права Нилуфар.',
      uz: "Aylana chiziq sifatida, doira esa yuza sifatida bo'yaladi. Topshiriq aylana haqida edi, demak Nilufar haq.",
      en: 'A circle is painted as a line, a disc as a surface. The task named the circle, so Nilufar was right.',
    },
    audio: {
      ru: [
        'Поставим ножку циркуля в центр и обведём. Получилась линия, у которой каждая точка одинаково удалена от центра. Эту линию называют окружностью.',
        'А если закрасить всё, что внутри линии, вместе с ней самой, получится круг. Круг это поверхность, окружность это её граница.',
        'Мастер просил покрасить окружность, то есть линию по краю. Значит задание выполнила Нилуфар. Фаррух закрасил круг.',
      ],
      uz: [
        "Sirkulning oyog'ini markazga qo'yib aylantiramiz. Har bir nuqtasi markazdan bir xil uzoqlikdagi chiziq hosil bo'ldi. Bu chiziqni aylana deb atashadi.",
        "Chiziqning ichidagi hamma narsani chiziqning o'zi bilan birga bo'yasak, doira chiqadi. Doira bu yuza, aylana esa uning chegarasi.",
        "Usta aylanani, ya'ni chetidagi chiziqni bo'yashni so'radi. Demak topshiriqni Nilufar bajardi. Farrux esa doirani bo'yadi.",
      ],
      en: [
        'Put the compass point at the centre and turn it. A line appears whose every point is equally far from the centre. That line is a circle.',
        'Fill everything inside it, together with the line itself, and you get a disc. A disc is a surface, the circle is its boundary.',
        'The teacher asked to paint the circle, that is the line along the edge. So Nilufar did the task and Farrukh painted the disc.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Радиус и диаметр', uz: 'Radius va diametr', en: 'Radius and diameter' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'радиус — от центра до окружности', uz: 'radius — markazdan aylanagacha', en: 'the radius goes from the centre to the circle' },
      { ru: 'диаметр проходит через центр', uz: "diametr markazdan o'tadi", en: 'the diameter passes through the centre' },
      { ru: 'диаметр вдвое длиннее: d = 2r', uz: 'diametr ikki barobar uzun: d = 2r', en: 'the diameter is twice as long: d = 2r' },
    ],
    demo_note: {
      ru: 'Радиус один отрезок, диаметр два таких же подряд. Поэтому диаметр всегда вдвое больше радиуса.',
      uz: "Radius bitta kesma, diametr esa ketma-ket ikkita shunday kesma. Shuning uchun diametr doim radiusdan ikki barobar katta.",
      en: 'The radius is one segment, the diameter two of them in a row. So the diameter is always twice the radius.',
    },
    play_ask: { ru: 'Радиус тарелки 7 см. Чему равен диаметр?', uz: "Tarelka radiusi 7 sm. Diametri nechaga teng?", en: 'The radius is 7 cm. What is the diameter?' },
    play_opts: ['14 см', '3,5 см', '7 см'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 7 · 2 = 14 см.',
      uz: "To'g'ri. 7 · 2 = 14 sm.",
      en: 'Right. 7 · 2 = 14 cm.',
    },
    play_wrong: [
      null,
      { ru: 'Так находят радиус по диаметру, а не наоборот.', uz: 'Bunday diametr orqali radius topiladi, teskarisi emas.', en: 'That finds the radius from the diameter, not the other way.' },
      { ru: 'Диаметр длиннее радиуса, он проходит через весь круг.', uz: "Diametr radiusdan uzun, u butun doiradan o'tadi.", en: 'The diameter is longer: it crosses the whole disc.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу два главных отрезка окружности.',
        uz: "Aylananing ikki asosiy kesmasini ko'rsataman.",
        en: 'I will show the two main segments of a circle.',
      },
      demo: {
        ru: 'Отрезок от центра до любой точки окружности называют радиусом. Все радиусы одной окружности равны. Отрезок, который соединяет две точки окружности и проходит через центр, называют диаметром. В нём укладываются два радиуса, значит диаметр вдвое длиннее.',
        uz: "Markazdan aylananing istalgan nuqtasigacha bo'lgan kesma radius deb ataladi. Bitta aylananing barcha radiuslari teng. Aylananing ikki nuqtasini birlashtirib, markazdan o'tadigan kesma diametr deb ataladi. Unga ikkita radius joylashadi, demak diametr ikki barobar uzun.",
        en: 'A segment from the centre to any point of the circle is a radius. All radii of one circle are equal. A segment joining two points of the circle through the centre is a diameter. Two radii fit inside it, so the diameter is twice as long.',
      },
      play: {
        ru: 'Теперь ваша очередь. Радиус тарелки семь сантиметров. Чему равен диаметр?',
        uz: 'Endi sizning navbatingiz. Tarelka radiusi yetti santimetr. Diametri nechaga teng?',
        en: 'Now it is your turn. The radius of the plate is seven centimetres. What is the diameter?',
      },
      ok: {
        ru: 'Верно. Семь умножить на два это четырнадцать сантиметров.',
        uz: "To'g'ri. Yetti karra ikki o'n to'rt santimetr.",
        en: 'Right. Seven times two is fourteen centimetres.',
      },
      wrong: {
        ru: 'В диаметре укладываются два радиуса, значит его находят умножением на два.',
        uz: "Diametrga ikkita radius joylashadi, demak u ikkiga ko'paytirish bilan topiladi.",
        en: 'Two radii fit in a diameter, so multiply by two.',
      },
    },
  },

  s_parts: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Хорда, дуга и где точка', uz: 'Vatar, yoy va nuqta qayerda', en: 'Chord, arc and where a point is' },
    lines: [
      { ru: 'хорда соединяет две точки окружности', uz: 'vatar aylananing ikki nuqtasini birlashtiradi', en: 'a chord joins two points of the circle' },
      { ru: 'дуга — часть самой окружности', uz: "yoy — aylananing bir qismi", en: 'an arc is a part of the circle itself' },
      { ru: 'точка ближе радиуса — внутри, дальше — снаружи', uz: 'nuqta radiusdan yaqin — ichida, uzoq — tashqarida', en: 'closer than the radius is inside, further is outside' },
    ],
    done: {
      ru: 'Диаметр — самая длинная хорда. А положение точки решает одно сравнение: её расстояние до центра и радиус.',
      uz: "Diametr eng uzun vatar. Nuqtaning joylashuvini esa bitta solishtirish hal qiladi: uning markazgacha masofasi va radius.",
      en: 'The diameter is the longest chord. And a point’s position is settled by one comparison: its distance to the centre against the radius.',
    },
    audio: {
      ru: [
        'Отрезок, соединяющий две точки окружности, называют хордой. Если хорда проходит через центр, она и есть диаметр, и это самая длинная хорда.',
        'Часть самой линии между двумя точками называют дугой. Хорда прямая, дуга изогнутая.',
        'Теперь про точки. Если расстояние от точки до центра меньше радиуса, точка лежит внутри круга. Если больше, снаружи. Если ровно равно радиусу, точка лежит на самой окружности.',
      ],
      uz: [
        "Aylananing ikki nuqtasini birlashtiruvchi kesma vatar deb ataladi. Vatar markazdan o'tsa, u diametrning o'zi bo'ladi va bu eng uzun vatar.",
        "Ikki nuqta orasidagi chiziqning o'zi yoy deb ataladi. Vatar to'g'ri, yoy esa egri.",
        "Endi nuqtalar haqida. Nuqtadan markazgacha masofa radiusdan kichik bo'lsa, nuqta doira ichida yotadi. Katta bo'lsa, tashqarisida. Aynan radiusga teng bo'lsa, nuqta aylananing o'zida yotadi.",
      ],
      en: [
        'A segment joining two points of the circle is a chord. If it passes through the centre it is the diameter, and that is the longest chord.',
        'A part of the line itself between two points is an arc. A chord is straight, an arc is curved.',
        'Now about points. If the distance from a point to the centre is less than the radius, the point lies inside the disc. If greater, outside. If exactly equal, the point lies on the circle.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Где окажется точка', uz: "Nuqta qayerda bo'ladi", en: 'Where the point lands' },
    lead: { ru: 'Диаметр тарелки 18 см. Пятнышко в 11 см от центра.', uz: "Tarelka diametri 18 sm. Dog' markazdan 11 sm da.", en: 'The plate’s diameter is 18 cm. A speck is 11 cm from the centre.' },
    steps: [
      { ru: 'радиус: 18 : 2 = 9 см', uz: 'radius: 18 : 2 = 9 sm', en: 'radius: 18 : 2 = 9 cm' },
      { ru: 'сравниваем: 11 больше 9', uz: 'solishtiramiz: 11 dan 9 kichik', en: 'compare: 11 is more than 9' },
      { ru: 'значит пятнышко вне тарелки', uz: "demak dog' tarelkadan tashqarida", en: 'so the speck is off the plate' },
    ],
    done: {
      ru: 'Сначала переводим диаметр в радиус, потом сравниваем. Сравнивать расстояние с диаметром нельзя: это разные величины.',
      uz: "Avval diametrni radiusga o'tkazamiz, keyin solishtiramiz. Masofani diametr bilan solishtirib bo'lmaydi: bular har xil kattaliklar.",
      en: 'First turn the diameter into the radius, then compare. Comparing a distance with the diameter is wrong: they are different quantities.',
    },
    audio: {
      ru: [
        'Решаем вместе. Диаметр тарелки восемнадцать сантиметров, а пятнышко краски лежит в одиннадцати сантиметрах от центра.',
        'Сравнивать сразу с восемнадцатью нельзя: от центра до края идёт радиус, а не диаметр. Значит сначала находим радиус: восемнадцать разделить на два это девять.',
        'Теперь сравниваем: одиннадцать больше девяти. Расстояние больше радиуса, поэтому пятнышко оказалось за краем тарелки.',
      ],
      uz: [
        "Birga yechamiz. Tarelka diametri o'n sakkiz santimetr, bo'yoq dog'i esa markazdan o'n bir santimetrda yotibdi.",
        "Darrov o'n sakkiz bilan solishtirib bo'lmaydi: markazdan chetgacha radius boradi, diametr emas. Demak avval radiusni topamiz: o'n sakkizni ikkiga bo'lsak to'qqiz.",
        "Endi solishtiramiz: o'n bir to'qqizdan katta. Masofa radiusdan katta, shuning uchun dog' tarelka chetidan tashqarida qoldi.",
      ],
      en: [
        'Let us solve it together. The plate’s diameter is eighteen centimetres and a speck of paint lies eleven centimetres from the centre.',
        'We cannot compare with eighteen straight away: from the centre to the edge runs the radius, not the diameter. So first find the radius: eighteen divided by two is nine.',
        'Now compare: eleven is more than nine. The distance exceeds the radius, so the speck ended up beyond the edge of the plate.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Радиус или диаметр', uz: 'Radius yoki diametr', en: 'Radius or diameter' },
    bad_line: { ru: 'ошибка: ширина тарелки 24 см, значит радиус 24', uz: 'xato: tarelka eni 24 sm, demak radius 24', en: 'mistake: the plate is 24 cm wide so the radius is 24' },
    good_line: { ru: 'верно: 24 — это диаметр, радиус 12', uz: "to'g'ri: 24 bu diametr, radius 12", en: 'right: 24 is the diameter, the radius is 12' },
    warn_line: { ru: 'ошибка: «закрасили окружность» — закрашивают круг', uz: "xato: «aylanani bo'yadik» — doira bo'yaladi", en: 'mistake: “we filled the circle” — you fill a disc' },
    done: {
      ru: 'Ширина фигуры — это диаметр, от центра до края — радиус. А закрашивать можно только круг: у линии площади нет.',
      uz: "Shakl eni bu diametr, markazdan chetgacha esa radius. Bo'yash faqat doiraga tegishli: chiziqning yuzasi yo'q.",
      en: 'The width of the shape is the diameter, from centre to edge is the radius. And only a disc can be filled: a line has no area.',
    },
    audio: {
      ru: [
        'Две частые ошибки урока. Первая: слышат про ширину тарелки и называют это число радиусом.',
        'Но ширина это расстояние от края до края через центр, то есть диаметр. Радиус вдвое меньше: не двадцать четыре, а двенадцать.',
        'Вторая ошибка в словах. Говорят закрасили окружность, хотя закрашивают всегда круг. У линии нет площади, красить в ней нечего кроме самой линии.',
      ],
      uz: [
        "Darsning tez-tez uchraydigan ikki xatosi. Birinchisi: tarelka eni haqida eshitib, o'sha sonni radius deb atashadi.",
        "Ammo en bu chetdan markaz orqali chetgacha masofa, ya'ni diametr. Radius ikki barobar kichik: yigirma to'rt emas, o'n ikki.",
        "Ikkinchi xato so'zlarda. Aylanani bo'yadik deyishadi, holbuki doim doira bo'yaladi. Chiziqning yuzasi yo'q, unda chiziqning o'zidan boshqa bo'yaydigan narsa yo'q.",
      ],
      en: [
        'Two common mistakes here. First: hearing the width of a plate and calling that number the radius.',
        'But the width is edge to edge through the centre, that is the diameter. The radius is half of it: twelve, not twenty four.',
        'The second mistake is in words. People say they filled the circle, though what gets filled is always a disc. A line has no area, there is nothing to fill but the line itself.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Что есть что', uz: 'Nima nima ekan', en: 'What is what' },
    rule_1: {
      ru: 'Окружность — линия, все точки которой одинаково удалены от центра. Круг — сама окружность вместе со всем, что внутри. Радиус идёт от центра до окружности, диаметр вдвое длиннее: d = 2r.',
      uz: "Aylana — barcha nuqtalari markazdan bir xil uzoqlikdagi chiziq. Doira — aylananing o'zi va uning ichidagi hamma narsa. Radius markazdan aylanagacha boradi, diametr ikki barobar uzun: d = 2r.",
      en: 'A circle is a line whose points are all equally far from the centre. A disc is that circle together with everything inside. The radius runs from the centre to the circle, and the diameter is twice as long: d = 2r.',
    },
    rule_2: {
      ru: 'Хорда соединяет две точки окружности, дуга — часть самой линии. Точка внутри, если расстояние до центра меньше радиуса. Мастерская: красили окружность, права была Нилуфар.',
      uz: "Vatar aylananing ikki nuqtasini birlashtiradi, yoy esa chiziqning bir qismi. Markazgacha masofa radiusdan kichik bo'lsa, nuqta ichkarida. Ustaxona: aylana bo'yaldi, Nilufar haq edi.",
      en: 'A chord joins two points of the circle, an arc is a part of the line. A point is inside when its distance to the centre is less than the radius. The workshop: the circle was to be painted, so Nilufar was right.',
    },
    audio: {
      ru: 'Запомним правило. Окружность это линия, все точки которой одинаково удалены от центра. Круг это сама окружность вместе со всем, что внутри неё. Радиус идёт от центра до окружности, а диаметр проходит через центр и вдвое длиннее радиуса. Хорда соединяет две точки окружности, дуга это часть самой линии. Точка лежит внутри, если расстояние до центра меньше радиуса. Вернёмся в мастерскую. Красить нужно было окружность, то есть ободок. Права была Нилуфар.',
      uz: "Qoidani eslab qolamiz. Aylana bu barcha nuqtalari markazdan bir xil uzoqlikdagi chiziq. Doira bu aylananing o'zi va uning ichidagi hamma narsa. Radius markazdan aylanagacha boradi, diametr esa markazdan o'tadi va radiusdan ikki barobar uzun. Vatar aylananing ikki nuqtasini birlashtiradi, yoy esa chiziqning bir qismi. Markazgacha masofa radiusdan kichik bo'lsa, nuqta ichkarida yotadi. Ustaxonaga qaytamiz. Aylanani, ya'ni chet halqani bo'yash kerak edi. Nilufar haq edi.",
      en: 'Let us remember the rule. A circle is a line whose points are all equally far from the centre. A disc is that circle together with everything inside it. The radius runs from the centre to the circle, and the diameter passes through the centre and is twice the radius. A chord joins two points of the circle, an arc is a part of the line. A point lies inside when its distance to the centre is less than the radius. Back to the workshop. The circle, that is the rim, was to be painted. Nilufar was right.',
    },
  },

  s_rad: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Радиус и диаметр', uz: 'Radius va diametr', en: 'Radius and diameter' },
    lead: { ru: 'Диаметр вдвое длиннее радиуса.', uz: 'Diametr radiusdan ikki barobar uzun.', en: 'The diameter is twice the radius.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Радиус 9 см. Диаметр?', uz: 'Radius 9 sm. Diametr?', en: 'Radius 9 cm. Diameter?' },
        opts: ['18 см', '4,5 см', '9 см'],
        correct: 0,
        ok: { ru: 'Верно. 9 · 2 = 18 см.', uz: "To'g'ri. 9 · 2 = 18 sm.", en: 'Right. 9 · 2 = 18 cm.' },
        wrong: [
          null,
          { ru: 'Делят, когда известен диаметр.', uz: "Diametr ma'lum bo'lganda bo'linadi.", en: 'You divide when the diameter is known.' },
          { ru: 'Диаметр длиннее радиуса.', uz: 'Diametr radiusdan uzun.', en: 'The diameter is longer than the radius.' },
        ],
      },
      {
        q: { ru: 'Диаметр 30 см. Радиус?', uz: 'Diametr 30 sm. Radius?', en: 'Diameter 30 cm. Radius?' },
        opts: ['15 см', '60 см', '30 см'],
        correct: 0,
        ok: { ru: 'Верно. 30 : 2 = 15 см.', uz: "To'g'ri. 30 : 2 = 15 sm.", en: 'Right. 30 : 2 = 15 cm.' },
        wrong: [
          null,
          { ru: 'Умножают, когда известен радиус.', uz: "Radius ma'lum bo'lganda ko'paytiriladi.", en: 'You multiply when the radius is known.' },
          { ru: 'Радиус короче диаметра.', uz: 'Radius diametrdan qisqa.', en: 'The radius is shorter than the diameter.' },
        ],
      },
      {
        q: { ru: 'Тарелка шириной 24 см. Радиус?', uz: 'Tarelka eni 24 sm. Radius?', en: 'A plate 24 cm wide. Radius?' },
        opts: ['12 см', '24 см', '48 см'],
        correct: 0,
        ok: { ru: 'Верно. Ширина — это диаметр, значит радиус 12 см.', uz: "To'g'ri. En bu diametr, demak radius 12 sm.", en: 'Right. The width is the diameter, so the radius is 12 cm.' },
        wrong: [
          null,
          { ru: 'Ширина это расстояние через весь круг, то есть диаметр.', uz: "En butun doira orqali masofa, ya'ni diametr.", en: 'The width crosses the whole disc: that is the diameter.' },
          { ru: 'Радиус меньше ширины, а не больше.', uz: 'Radius endan kichik, katta emas.', en: 'The radius is smaller than the width, not bigger.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на радиус и диаметр. Смотрите, что дано, и выбирайте умножение или деление.',
        uz: "Radius va diametr mashqi. Nima berilganiga qarang va ko'paytirish yoki bo'lishni tanlang.",
        en: 'Practice on radius and diameter. See what is given and pick multiplying or dividing.',
      },
    },
  },

  s_where: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Элементы и положение', uz: 'Elementlar va joylashuv', en: 'Parts and position' },
    lead: { ru: 'Сравнивай расстояние с радиусом.', uz: 'Masofani radius bilan solishtiring.', en: 'Compare the distance with the radius.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Радиус 6 см, точка в 4 см от центра. Где она?', uz: 'Radius 6 sm, nuqta markazdan 4 sm da. U qayerda?', en: 'Radius 6 cm, a point 4 cm from the centre. Where is it?' },
        opts: [
          { ru: 'внутри круга', uz: 'doira ichida', en: 'inside the disc' },
          { ru: 'вне круга', uz: 'doira tashqarisida', en: 'outside the disc' },
          { ru: 'на окружности', uz: 'aylanada', en: 'on the circle' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 4 меньше 6, значит внутри.', uz: "To'g'ri. 4 dan 6 katta, demak ichkarida.", en: 'Right. Four is less than six, so inside.' },
        wrong: [
          null,
          { ru: 'Снаружи оказалась бы точка дальше 6 см.', uz: "6 sm dan uzoqdagi nuqta tashqarida bo'lardi.", en: 'A point further than 6 cm would be outside.' },
          { ru: 'На окружности расстояние было бы ровно 6 см.', uz: "Aylanada masofa aynan 6 sm bo'lardi.", en: 'On the circle the distance would be exactly 6 cm.' },
        ],
      },
      {
        q: { ru: 'Какой отрезок соединяет две точки окружности через центр?', uz: "Qaysi kesma aylananing ikki nuqtasini markaz orqali birlashtiradi?", en: 'Which segment joins two points through the centre?' },
        opts: [
          { ru: 'диаметр', uz: 'diametr', en: 'the diameter' },
          { ru: 'радиус', uz: 'radius', en: 'the radius' },
          { ru: 'дуга', uz: 'yoy', en: 'the arc' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Это самая длинная хорда.', uz: "To'g'ri. Bu eng uzun vatar.", en: 'Right. It is the longest chord.' },
        wrong: [
          null,
          { ru: 'Радиус соединяет центр с окружностью, а не две её точки.', uz: "Radius markazni aylana bilan bog'laydi, uning ikki nuqtasini emas.", en: 'A radius joins the centre to the circle, not two of its points.' },
          { ru: 'Дуга это часть линии, а не отрезок.', uz: 'Yoy chiziqning bir qismi, kesma emas.', en: 'An arc is part of the line, not a segment.' },
        ],
      },
      {
        q: { ru: 'Радиус 5 см, точка в 5 см от центра. Где она?', uz: 'Radius 5 sm, nuqta markazdan 5 sm da. U qayerda?', en: 'Radius 5 cm, a point 5 cm away. Where is it?' },
        opts: [
          { ru: 'на окружности', uz: 'aylanada', en: 'on the circle' },
          { ru: 'внутри', uz: 'ichkarida', en: 'inside' },
          { ru: 'снаружи', uz: 'tashqarida', en: 'outside' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Расстояние ровно равно радиусу.', uz: "To'g'ri. Masofa aynan radiusga teng.", en: 'Right. The distance equals the radius exactly.' },
        wrong: [
          null,
          { ru: 'Внутри расстояние было бы меньше радиуса.', uz: "Ichkarida masofa radiusdan kichik bo'lardi.", en: 'Inside the distance would be less than the radius.' },
          { ru: 'Снаружи расстояние было бы больше радиуса.', uz: "Tashqarida masofa radiusdan katta bo'lardi.", en: 'Outside the distance would be greater.' },
        ],
      },
      {
        q: { ru: 'Что можно закрасить?', uz: "Nimani bo'yash mumkin?", en: 'Which one can be filled in?' },
        opts: [
          { ru: 'круг', uz: 'doirani', en: 'the disc' },
          { ru: 'окружность', uz: 'aylanani', en: 'the circle' },
          { ru: 'дугу', uz: 'yoyni', en: 'the arc' },
        ],
        correct: 0,
        ok: { ru: 'Верно. У круга есть поверхность, у линии нет.', uz: "To'g'ri. Doiraning yuzasi bor, chiziqniki yo'q.", en: 'Right. A disc has a surface, a line does not.' },
        wrong: [
          null,
          { ru: 'Окружность это линия, закрашивать в ней нечего.', uz: "Aylana chiziq, unda bo'yaydigan narsa yo'q.", en: 'A circle is a line, there is nothing to fill.' },
          { ru: 'Дуга тоже линия, только короче.', uz: 'Yoy ham chiziq, faqat qisqaroq.', en: 'An arc is a line too, only shorter.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на элементы. Помните: положение точки решает сравнение с радиусом.',
        uz: 'Elementlar mashqi. Yodda tuting: nuqta joylashuvini radius bilan solishtirish hal qiladi.',
        en: 'Practice on the parts. Remember: a point’s position is settled by comparing with the radius.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Внутри или снаружи', uz: 'Ichkarida yoki tashqarida', en: 'Inside or outside' },
    lead: { ru: 'Радиус круга 5 см. На карточке — расстояние от точки до центра.', uz: 'Doira radiusi 5 sm. Kartochkada nuqtadan markazgacha masofa.', en: 'The radius is 5 cm. Each card shows a distance to the centre.' },
    bin_a: { ru: 'Внутри круга', uz: 'Doira ichida', en: 'Inside the disc' },
    bin_b: { ru: 'Вне круга', uz: 'Doira tashqarisida', en: 'Outside the disc' },
    cards: [
      { label: '3 см', bin: 'a' },
      { label: '1 см', bin: 'a' },
      { label: '4 см', bin: 'a' },
      { label: '6 см', bin: 'b' },
      { label: '8 см', bin: 'b' },
      { label: '12 см', bin: 'b' },
    ],
    hint: {
      ru: 'Меньше 5 — внутри, больше 5 — снаружи.',
      uz: "5 dan kichik — ichida, 5 dan katta — tashqarida.",
      en: 'Less than 5 is inside, more than 5 is outside.',
    },
    correct_text: {
      ru: 'Верно. Всё решает одно сравнение с радиусом.',
      uz: "To'g'ri. Hammasini radius bilan bitta solishtirish hal qiladi.",
      en: 'Right. One comparison with the radius decides everything.',
    },
    audio: {
      intro: {
        ru: 'Разложите расстояния по двум корзинам. Радиус круга пять сантиметров.',
        uz: 'Masofalarni ikki savatga ajrating. Doira radiusi besh santimetr.',
        en: 'Sort the distances into two baskets. The radius is five centimetres.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Сравни с радиусом.', uz: 'Bu yerga emas. Radius bilan solishtiring.', en: 'Not here. Compare with the radius.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Фаррух: «Диаметр 20 см, значит радиус 40 см». Проверь.', uz: "Farrux: «Diametr 20 sm, demak radius 40 sm». Tekshiring.", en: 'Farrukh: “Diameter 20 cm, so radius 40 cm.” Check it.' },
        opts: [
          { ru: 'Нет: радиус вдвое меньше, 10 см', uz: "Yo'q: radius ikki barobar kichik, 10 sm", en: 'No: the radius is half, 10 cm' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, радиус 20 см', uz: "Yo'q, radius 20 sm", en: 'No, the radius is 20 cm' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Радиус короче диаметра, а не длиннее.', uz: "To'g'ri. Radius diametrdan qisqa, uzun emas.", en: 'Right. The radius is shorter than the diameter, not longer.' },
        wrong: [
          null,
          { ru: 'Радиус не может быть длиннее диаметра.', uz: "Radius diametrdan uzun bo'lolmaydi.", en: 'A radius cannot be longer than the diameter.' },
          { ru: 'Тогда диаметр был бы 40 см.', uz: "U holda diametr 40 sm bo'lardi.", en: 'Then the diameter would be 40 cm.' },
        ],
      },
      {
        q: { ru: 'Нилуфар: «Радиус 8, точка в 8 см — она внутри». Проверь.', uz: "Nilufar: «Radius 8, nuqta 8 sm da — u ichkarida». Tekshiring.", en: 'Nilufar: “Radius 8, a point at 8 cm is inside.” Check it.' },
        opts: [
          { ru: 'Нет: расстояние равно радиусу, точка на окружности', uz: "Yo'q: masofa radiusga teng, nuqta aylanada", en: 'No: the distance equals the radius, the point is on the circle' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, точка снаружи', uz: "Yo'q, nuqta tashqarida", en: 'No, the point is outside' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Внутри — строго меньше радиуса.', uz: "To'g'ri. Ichkarida bu radiusdan qat'iy kichik.", en: 'Right. Inside means strictly less than the radius.' },
        wrong: [
          null,
          { ru: 'Внутри расстояние меньше радиуса, а здесь равно.', uz: 'Ichkarida masofa radiusdan kichik, bu yerda esa teng.', en: 'Inside means less than the radius, here it is equal.' },
          { ru: 'Снаружи расстояние больше радиуса.', uz: 'Tashqarida masofa radiusdan katta.', en: 'Outside means greater than the radius.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в переводе диаметра, и в сравнении.',
        uz: "Birovning yechimini tekshiring. Xato diametrni o'tkazishda ham, solishtirishda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in converting the diameter and in the comparison.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Тарелки на круге', uz: 'Charxdagi tarelkalar', en: 'Plates on the wheel' },
    lead: { ru: 'Тарелка шириной 24 см, узор идёт по краю.', uz: 'Tarelka eni 24 sm, naqsh chetidan boradi.', en: 'A plate 24 cm wide with a pattern along the edge.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Чему равен радиус тарелки?', uz: 'Tarelka radiusi nechaga teng?', en: 'What is the radius of the plate?' },
        opts: ['12 см', '24 см', '48 см'],
        correct: 0,
        ok: { ru: 'Верно. Ширина это диаметр: 24 : 2 = 12 см.', uz: "To'g'ri. En bu diametr: 24 : 2 = 12 sm.", en: 'Right. The width is the diameter: 24 : 2 = 12 cm.' },
        wrong: [
          null,
          { ru: 'Двадцать четыре — это ширина, то есть диаметр.', uz: "Yigirma to'rt bu en, ya'ni diametr.", en: 'Twenty four is the width, that is the diameter.' },
          { ru: 'Радиус меньше ширины, а не больше.', uz: 'Radius endan kichik, katta emas.', en: 'The radius is smaller than the width.' },
        ],
      },
      {
        q: { ru: 'Капля упала в 10 см от центра. Попала на тарелку?', uz: "Tomchi markazdan 10 sm da tushdi. Tarelkaga tushdimi?", en: 'A drop fell 10 cm from the centre. Did it land on the plate?' },
        opts: [
          { ru: 'да, внутри', uz: 'ha, ichkarida', en: 'yes, inside' },
          { ru: 'нет, мимо', uz: "yo'q, chetga", en: 'no, it missed' },
          { ru: 'ровно на краю', uz: 'aynan chetiga', en: 'exactly on the edge' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 10 меньше 12, значит внутри.', uz: "To'g'ri. 10 dan 12 katta, demak ichkarida.", en: 'Right. Ten is less than twelve, so inside.' },
        wrong: [
          null,
          { ru: 'Сравнивать надо с радиусом 12, а не с шириной.', uz: 'Radius 12 bilan solishtirish kerak, en bilan emas.', en: 'Compare with the radius 12, not the width.' },
          { ru: 'На краю расстояние было бы ровно 12 см.', uz: "Chetida masofa aynan 12 sm bo'lardi.", en: 'On the edge it would be exactly 12 cm.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про тарелки. Ширина тарелки двадцать четыре сантиметра, узор идёт по самому краю.',
        uz: "Tarelkalar haqida masala. Tarelka eni yigirma to'rt santimetr, naqsh esa aynan chetidan boradi.",
        en: 'A problem about plates. A plate is twenty four centimetres wide and the pattern runs along the very edge.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 26,
        q: { ru: 'Радиус 13 см. Чему равен диаметр? Набери число.', uz: 'Radius 13 sm. Diametr nechaga teng? Sonni tering.', en: 'Radius 13 cm. What is the diameter? Type the number.' },
        hint: { ru: 'Диаметр вдвое длиннее радиуса.', uz: 'Diametr radiusdan ikki barobar uzun.', en: 'The diameter is twice the radius.' },
        hint_audio: { ru: 'В диаметре укладываются два радиуса, поэтому умножьте тринадцать на два.', uz: "Diametrga ikkita radius joylashadi, shuning uchun o'n uchni ikkiga ko'paytiring.", en: 'Two radii fit in a diameter, so multiply thirteen by two.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Чем окружность отличается от круга?', uz: 'Aylana doiradan nimasi bilan farq qiladi?', en: 'How does a circle differ from a disc?' },
        opts: [
          { ru: 'ничем, это одно и то же', uz: 'hech nimasi bilan, bu bir xil', en: 'no difference, they are the same' },
          { ru: 'у окружности больше радиус', uz: 'aylananing radiusi katta', en: 'a circle has a bigger radius' },
          { ru: 'окружность — линия, круг — вся фигура', uz: 'aylana — chiziq, doira — butun shakl', en: 'a circle is a line, a disc is the whole shape' },
          { ru: 'у круга нет центра', uz: "doiraning markazi yo'q", en: 'a disc has no centre' },
        ],
        wrong: [
          { ru: 'Одно можно закрасить, другое нет.', uz: "Birini bo'yash mumkin, ikkinchisini yo'q.", en: 'One can be filled in, the other cannot.' },
          { ru: 'Радиус у них один и тот же.', uz: 'Ularning radiusi bir xil.', en: 'They share the same radius.' },
          null,
          { ru: 'Центр есть у обоих.', uz: 'Markaz ikkalasida ham bor.', en: 'Both have a centre.' },
        ],
        correct: { ru: 'Верно. Круг это окружность и всё внутри неё.', uz: "To'g'ri. Doira bu aylana va uning ichidagi hamma narsa.", en: 'Right. A disc is the circle and everything inside it.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Радиус 7 см, точка в 9 см от центра. Где она?', uz: 'Radius 7 sm, nuqta markazdan 9 sm da. U qayerda?', en: 'Radius 7 cm, a point 9 cm away. Where is it?' },
        opts: [
          { ru: 'внутри', uz: 'ichkarida', en: 'inside' },
          { ru: 'снаружи', uz: 'tashqarida', en: 'outside' },
          { ru: 'на окружности', uz: 'aylanada', en: 'on the circle' },
          { ru: 'в центре', uz: 'markazda', en: 'at the centre' },
        ],
        wrong: [
          { ru: 'Внутри расстояние меньше радиуса.', uz: 'Ichkarida masofa radiusdan kichik.', en: 'Inside the distance is less than the radius.' },
          null,
          { ru: 'На окружности расстояние равно радиусу.', uz: 'Aylanada masofa radiusga teng.', en: 'On the circle the distance equals the radius.' },
          { ru: 'В центре расстояние было бы нулевым.', uz: "Markazda masofa nol bo'lardi.", en: 'At the centre the distance would be zero.' },
        ],
        correct: { ru: 'Верно. 9 больше 7, значит снаружи.', uz: "To'g'ri. 9 dan 7 kichik, demak tashqarida.", en: 'Right. Nine is more than seven, so outside.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Какая хорда самая длинная?', uz: 'Qaysi vatar eng uzun?', en: 'Which chord is the longest?' },
        opts: [
          { ru: 'любая, они равны', uz: 'har qanday, ular teng', en: 'any of them, they are equal' },
          { ru: 'самая короткая дуга', uz: 'eng qisqa yoy', en: 'the shortest arc' },
          { ru: 'радиус', uz: 'radius', en: 'the radius' },
          { ru: 'диаметр', uz: 'diametr', en: 'the diameter' },
        ],
        wrong: [
          { ru: 'Хорды бывают разной длины.', uz: "Vatarlar har xil uzunlikda bo'ladi.", en: 'Chords come in different lengths.' },
          { ru: 'Дуга это не хорда, а часть линии.', uz: 'Yoy vatar emas, chiziqning bir qismi.', en: 'An arc is not a chord but part of the line.' },
          { ru: 'Радиус не соединяет две точки окружности.', uz: 'Radius aylananing ikki nuqtasini birlashtirmaydi.', en: 'A radius does not join two points of the circle.' },
          null,
        ],
        correct: { ru: 'Верно. Диаметр проходит через центр и длиннее всех хорд.', uz: "To'g'ri. Diametr markazdan o'tadi va barcha vatarlardan uzun.", en: 'Right. The diameter passes through the centre and beats every chord.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Мастер просил покрасить окружность. Что красить?', uz: "Usta aylanani bo'yashni so'radi. Nima bo'yaladi?", en: 'The teacher asked to paint the circle. What gets painted?' },
        opts: [
          { ru: 'только линию по краю', uz: 'faqat chetdagi chiziqni', en: 'only the line along the edge' },
          { ru: 'всю тарелку', uz: 'butun tarelkani', en: 'the whole plate' },
          { ru: 'центр тарелки', uz: 'tarelka markazini', en: 'the centre of the plate' },
          { ru: 'половину тарелки', uz: 'tarelkaning yarmini', en: 'half of the plate' },
        ],
        wrong: [
          null,
          { ru: 'Так закрашивают круг, а не окружность.', uz: "Bunday doira bo'yaladi, aylana emas.", en: 'That fills the disc, not the circle.' },
          { ru: 'Центр это одна точка.', uz: 'Markaz bu bitta nuqta.', en: 'The centre is a single point.' },
          { ru: 'Половина круга это полукруг, а не окружность.', uz: 'Doiraning yarmi yarim doira, aylana emas.', en: 'Half a disc is a half disc, not a circle.' },
        ],
        correct: { ru: 'Верно. Окружность это граница, линия по краю.', uz: "To'g'ri. Aylana bu chegara, chetdagi chiziq.", en: 'Right. The circle is the boundary, the line along the edge.' },
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
      ru: 'Канализационные люки делают круглыми не ради красоты. У круга ширина одинаковая в любом направлении, поэтому круглая крышка не проваливается в свой же колодец, как ни поверни. Квадратная крышка проваливается: её диагональ длиннее стороны.',
      uz: "Kanalizatsiya qopqoqlari chiroylik uchun dumaloq qilinmaydi. Doiraning eni har qanday yo'nalishda bir xil, shuning uchun dumaloq qopqoq qanday burasangiz ham o'z qudug'iga tushib ketmaydi. Kvadrat qopqoq esa tushib ketadi: uning diagonali tomonidan uzun.",
      en: 'Manhole covers are round for a reason, not for looks. A disc has the same width in every direction, so a round cover cannot fall into its own hole however you turn it. A square cover can: its diagonal is longer than its side.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Канализационные люки делают круглыми не ради красоты. У круга ширина одинаковая в любом направлении, поэтому круглая крышка не проваливается в свой же колодец, как её ни поверни. А квадратная крышка проваливается: её диагональ длиннее стороны.',
      uz: "Bilasizmi? Kanalizatsiya qopqoqlari chiroylik uchun dumaloq qilinmaydi. Doiraning eni har qanday yo'nalishda bir xil, shuning uchun dumaloq qopqoq qanday bursangiz ham o'z qudug'iga tushib ketmaydi. Kvadrat qopqoq esa tushib ketadi: uning diagonali tomonidan uzun.",
      en: 'Did you know? Manhole covers are round for a reason, not for looks. A disc has the same width in every direction, so a round cover cannot fall into its own hole however you turn it. A square cover can: its diagonal is longer than its side.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Геометрия', uz: 'Matematika · Geometriya', en: 'Mathematics · Geometry' },
    heading: { ru: 'Окружность и круг', uz: 'Aylana va doira', en: 'Circle and disc' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'окружность — линия, круг — фигура', uz: 'aylana — chiziq, doira — shakl', en: 'a circle is a line, a disc is a shape' },
    brief_2: { ru: 'd = 2r, радиус вдвое короче', uz: 'd = 2r, radius ikki barobar qisqa', en: 'd = 2r, the radius is half' },
    brief_3: { ru: 'положение точки решает сравнение с r', uz: 'nuqta joylashuvini r bilan solishtirish hal qiladi', en: 'a point’s place is decided against r' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Ширина фигуры', uz: 'Shakl eni', en: 'The width of the shape' },
    memo_a1: { ru: 'это диаметр', uz: 'bu diametr', en: 'is the diameter' },
    memo_q2: { ru: 'Самая длинная хорда', uz: 'Eng uzun vatar', en: 'The longest chord' },
    memo_a2: { ru: 'это диаметр', uz: 'bu diametr', en: 'is the diameter' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'принять диаметр за радиус', uz: 'diametrni radius deb olish', en: 'taking the diameter for the radius' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Окружность это линия, все точки которой одинаково удалены от центра, а круг это окружность вместе со всем, что внутри. Радиус идёт от центра до окружности, диаметр вдвое длиннее. Хорда соединяет две точки окружности, дуга это часть линии.',
        'Мастерская: красили окружность, то есть ободок по краю.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Aylana bu barcha nuqtalari markazdan bir xil uzoqlikdagi chiziq, doira esa aylana va uning ichidagi hamma narsa. Radius markazdan aylanagacha boradi, diametr ikki barobar uzun. Vatar aylananing ikki nuqtasini birlashtiradi, yoy esa chiziqning bir qismi.",
        "Ustaxona: aylana, ya'ni chetdagi halqa bo'yaldi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'A circle is a line whose points are all equally far from the centre, and a disc is that circle with everything inside. The radius runs from the centre to the circle, the diameter is twice as long. A chord joins two points, an arc is part of the line.',
        'The workshop: the circle, that is the rim along the edge, was painted.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Сравни с радиусом', uz: 'Usul. Radius bilan solishtiring', en: 'Method. Compare with the radius' },
    m1_steps: {
      ru: ['Найди радиус: если дан диаметр, раздели на 2', 'Измерь расстояние от точки до центра', 'Меньше радиуса — внутри, больше — снаружи'],
      uz: ["Radiusni toping: diametr berilgan bo'lsa, 2 ga bo'ling", "Nuqtadan markazgacha masofani o'lchang", 'Radiusdan kichik — ichida, katta — tashqarida'],
      en: ['Find the radius: halve the diameter if that is given', 'Measure the distance from the point to the centre', 'Less than the radius is inside, more is outside'],
    },
    m1_no: {
      ru: 'Сравнивать расстояние с диаметром нельзя: от центра до края идёт радиус.',
      uz: "Masofani diametr bilan solishtirib bo'lmaydi: markazdan chetgacha radius boradi.",
      en: 'Do not compare a distance with the diameter: centre to edge is the radius.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кружок керамики, гончарный круг.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d37wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE2CE"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d37wall)"/>

    {/* Полка с готовой посудой */}
    <g opacity="0.9">
      <rect x="12" y="52" width="92" height="5" rx="2.5" fill="#C9A472"/>
      <circle cx="30" cy="42" r="10" fill="#D9603F" stroke="#B24A2C" strokeWidth="1.6"/>
      <circle cx="58" cy="42" r="10" fill="#7ECBE6" stroke="#4F9EBB" strokeWidth="1.6"/>
      <circle cx="86" cy="42" r="10" fill="#8FBF7F" stroke="#6FA463" strokeWidth="1.6"/>
    </g>

    {/* Гончарный круг: тарелка вращается */}
    <g>
      <rect x="176" y="104" width="48" height="30" rx="4" fill="#7B7367"/>
      <rect x="164" y="98" width="72" height="8" rx="4" fill="#8E8578"/>
      <g className="d37-spin">
        <ellipse cx="0" cy="0" rx="46" ry="15" fill="#E4D9C6" stroke="#C9A472" strokeWidth="2"/>
        <ellipse cx="0" cy="-2" rx="34" ry="10" fill="#F4EEDF"/>
        <path d="M-46 0 a46 15 0 0 0 92 0" fill="none" stroke="#D9603F" strokeWidth="3"/>
      </g>
    </g>

    {/* Две тарелки на столе: закрашены по-разному */}
    <g>
      <circle cx="86" cy="112" r="26" fill="#D9603F" stroke="#B24A2C" strokeWidth="2"/>
      <text x="86" y="150" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">Farrux</text>
    </g>
    <g>
      <circle cx="330" cy="112" r="26" fill="#F4EEDF" stroke="#D9603F" strokeWidth="5"/>
      <text x="330" y="150" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">Nilufar</text>
    </g>

    {/* Мастер за кругом */}
    <Person x={266} ground={104} head={12} shirt="#8FBF7F" hair="#5A4636"/>
    <Person x={140} ground={104} head={12} shirt="#7ECBE6" hair="#3E3128"/>
  </svg>
);

// Итог: линия и заливка рядом.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <circle cx="112" cy="42" r="28" fill="none" stroke="#019ACB" strokeWidth="4"/>
      <text x="112" y="84" textAnchor="middle" fill="#019ACB"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'окружность', 'aylana', 'circle')}
      </text>
      <circle cx="288" cy="42" r="28" fill="#A9CFBA" stroke="#1F7A4D" strokeWidth="4"/>
      <text x="288" y="84" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'круг', 'doira', 'disc')}
      </text>
      <text x="200" y="46" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700">+</text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: окружность с центром и всеми отрезками.
const Circ = ({ fill = false, showR = false, showD = false, showChord = false, showArc = false,
  points = [], r = 52, size = 'mid' }) => {
  const cx = 130; const cy = 82;
  return (
    <span className={'d37-circ-box d37-circ-' + size}>
      <svg viewBox="0 0 260 164" aria-hidden="true">
        <circle cx={cx} cy={cy} r={r} fill={fill ? '#A9CFBA' : 'none'}
          stroke={fill ? '#1F7A4D' : '#019ACB'} strokeWidth="3.4"/>
        <circle cx={cx} cy={cy} r="3.6" fill="#494550"/>
        <text x={cx - 8} y={cy + 16} textAnchor="end" fill="#494550"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">O</text>

        {showArc && (
          <path d={`M${cx + r * 0.71} ${cy - r * 0.71} A ${r} ${r} 0 0 1 ${cx + r * 0.71} ${cy + r * 0.71}`}
            fill="none" stroke="#8A6A22" strokeWidth="5" strokeLinecap="round"/>
        )}
        {showChord && (
          <g>
            <path d={`M${cx - r * 0.6} ${cy + r * 0.8} L${cx + r * 0.95} ${cy - r * 0.3}`}
              stroke="#8A6A22" strokeWidth="2.6"/>
            <text x={cx + r * 0.2} y={cy + r * 0.55} fill="#8A6A22"
              fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">vatar</text>
          </g>
        )}
        {showD && (
          <g>
            <path d={`M${cx - r} ${cy} H${cx + r}`} stroke="#D9603F" strokeWidth="2.8"/>
            <text x={cx} y={cy - 8} textAnchor="middle" fill="#D9603F"
              fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">d</text>
          </g>
        )}
        {showR && (
          <g>
            <path d={`M${cx} ${cy} L${cx + r} ${cy}`} stroke="#019ACB" strokeWidth="3.2"/>
            <text x={cx + r * 0.55} y={cy + 16} textAnchor="middle" fill="#019ACB"
              fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">r</text>
          </g>
        )}
        {points.map((p, i) => (
          <g key={i}>
            <path d={`M${cx} ${cy} L${cx + p.d * (r / 10) * Math.cos(p.a)} ${cy + p.d * (r / 10) * Math.sin(p.a)}`}
              stroke="#8A8883" strokeWidth="1.6" strokeDasharray="4 3"/>
            <circle cx={cx + p.d * (r / 10) * Math.cos(p.a)} cy={cy + p.d * (r / 10) * Math.sin(p.a)}
              r="5.5" fill={p.tone || '#1F7A4D'}/>
            <text x={cx + p.d * (r / 10) * Math.cos(p.a)} y={cy + p.d * (r / 10) * Math.sin(p.a) - 10}
              textAnchor="middle" fill={p.tone || '#1F7A4D'}
              fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{p.name}</text>
          </g>
        ))}
      </svg>
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d37-line d37-fade' + (on ? ' d37-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d37-stage">
        <span className="d37-dist">
          <i className="d37-dot"/>
          <b/>
          <i className="d37-dot d37-dot-b"/>
          <em>7 см</em>
        </span>
        <span className={'d37-chips d37-fade' + (step >= 1 ? ' d37-on' : '')}>
          <i className="d37-chip-l">{tri(lang, 'расстояние не бывает отрицательным', "masofa manfiy bo'lmaydi", 'distance is never negative')}</i>
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

// Ядро: линия и заливка.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d37-stage d37-stage-row">
        <Circ size="sm" fill={step >= 1}/>
        <span className="d37-col">
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

// Хорда, дуга и положение точки.
const PartsBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_parts;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d37-stage d37-stage-row">
        <Circ size="sm" showChord showArc={step >= 1}
          points={step >= 2
            ? [{ d: 5, a: 2.4, name: 'A', tone: '#1F7A4D' }, { d: 13, a: -1.9, name: 'B', tone: '#D9603F' }]
            : []}/>
        <span className="d37-col">
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
      <div className="frame fade-up delay-1 d37-stage d37-stage-row">
        <Circ size="sm" showR
          points={step >= 1 ? [{ d: 12, a: -0.9, name: '11', tone: '#D9603F' }] : []}/>
        <span className="d37-col">
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

// Граница: радиус или диаметр.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d37-stage">
        <span className="d37-pair d37-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d37-pair d37-pair-good d37-fade' + (step >= 1 ? ' d37-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d37-pair d37-pair-warn d37-fade' + (step >= 2 ? ' d37-on' : '')}>
          <Line node={t(c.warn_line)} on/>
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
        <div className={'d37-banner fade-up delay-1' + (phase === 'play' ? ' d37-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d37-stage d37-stage-tool d37-stage-row">
          {phase === 'demo' ? (
            <>
              <Circ size="xs" showR showD={shown >= 1}/>
              <span className="d37-col">
                {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
                <p className={'body d37-verdict' + (done ? ' d37-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
              </span>
            </>
          ) : (
            <span className="d37-col">
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
            </span>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d37-acts fade-up">
            <button className="d37-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d37-btn d37-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenParts = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_parts} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <PartsBody step={step}/>}/>
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
      <div className="d37-stage">
        <Circ size="xs" showR showD/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenRad = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_rad} asideNode={methodAside}/>
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

// Задача: тарелка с узором по краю.
// Чертёж задачи был в размере xs (172 px) и терялся в рамке: методист попросил
// крупнее на 80..100 px (QA 2026-08-19). Размер mid — 250 px, плюс 78.
const TaskFig = ({ idx }) => (
  <div className="d37-task-fig">
    <Circ size="mid" showD={idx < 1} showR={idx >= 1}
      points={idx >= 1 ? [{ d: 8, a: -0.7, name: '10', tone: '#1F7A4D' }] : []}/>
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
.d37-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d37-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d37-stage-tool .d37-line { font-size: clamp(12px, 2vw, 16px); }
.d37-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d37-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 200px; min-width: 0; }

/* Окружность */
.d37-circ-box { display: block; width: 100%; max-width: 250px; }
.d37-circ-sm { max-width: 210px; }
.d37-circ-xs { max-width: 172px; }
.d37-circ-box svg { width: 100%; height: auto; display: block; }

.d37-fade { opacity: 0; transition: opacity 420ms linear; }
.d37-on { opacity: 1; }
.d37-line { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Расстояние между точками */
.d37-dist { display: inline-flex; align-items: center; gap: 8px; }
.d37-dist i { width: 12px; height: 12px; border-radius: 50%; background: #019ACB; display: inline-block; }
.d37-dot-b { background: #D9603F !important; }
.d37-dist b { display: inline-block; width: clamp(70px, 14vw, 120px); height: 3px; background: #8E8578; }
.d37-dist em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }

/* Подписи */
.d37-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d37-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d37-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }

/* Строки экрана границы */
.d37-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d37-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d37-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d37-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d37-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d37-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d37-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d37-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d37-verdict-on { opacity: 1; }
.d37-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d37-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d37-btn:disabled { opacity: 0.45; cursor: default; }
.d37-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d37-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: гончарный круг вращается */
.d37-spin { animation: d37Spin 5200ms linear infinite; transform-origin: 200px 96px; }
@keyframes d37Spin { from { transform: translate(200px, 96px) rotate(0deg); } to { transform: translate(200px, 96px) rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .d37-spin { animation: none; transform: translate(200px, 96px); } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function CircleDiscLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenParts, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenRad, ScreenWhere, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
