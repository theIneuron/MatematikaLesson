// ============================================================
// 6 КЛАСС, УРОК 42 «Треугольник: элементы, виды и периметр»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б12, первый урок. Сумма углов не объявляется, а получается из
// опыта: три угла отрывают и прикладывают друг к другу, выходит прямая
// линия. Неравенство треугольника выводится из хука: из палочек 3, 4 и
// 10 фигура не смыкается, потому что короткие вместе короче длинной.
//
// Сцена — кружок моделирования, палочки и узлы на столе.
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
  lessonId: 'div_6_42',
  lessonTitle: {
    ru: 'Треугольник: элементы, виды и периметр',
    uz: 'Uchburchak: elementlari, turlari va perimetri',
    en: 'The triangle: parts, kinds and perimeter',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 tayoqchalar 3, 4, 10
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 perimetr va burchak esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 tajriba: burchaklar to'g'ri chiziq beradi
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: uchinchi burchak
  { id: 's_kinds',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 tomon va burchak bo'yicha turlar
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: tengsizlik
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: ikki o'tmas burchak
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_ang',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 uchinchi burchak x3
  { id: 's_kind',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 turlar va perimetr x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: yasaladimi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: to'garak
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Три палочки', uz: 'Uchta tayoqcha', en: 'Three sticks' },
    lead: {
      ru: 'На столе палочки 3 см, 4 см и 10 см. Из них хотят собрать треугольник.',
      uz: "Stolda 3 sm, 4 sm va 10 sm tayoqchalar. Ulardan uchburchak yasashni xohlaydilar.",
      en: 'Sticks of 3, 4 and 10 cm lie on the table. They want to build a triangle.',
    },
    voice_a: { ru: 'Тимур: соберётся.', uz: 'Timur: yasaladi.', en: 'Timur: it will work.' },
    voice_b: { ru: 'Зумрад: не соберётся.', uz: 'Zumrad: yasalmaydi.', en: 'Zumrad: it will not.' },
    ask: { ru: 'Получится ли треугольник?', uz: 'Uchburchak chiqadimi?', en: 'Will a triangle come out?' },
    options: [
      { ru: 'да', uz: 'ha', en: 'yes' },
      { ru: 'нет', uz: "yo'q", en: 'no' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В кружке моделирования собирают фигуры из палочек. На столе лежат три палочки: три сантиметра, четыре сантиметра и десять сантиметров.',
          'Тимур говорит, что треугольник соберётся, ведь палочек ровно три. Зумрад отвечает, что не соберётся. Получится ли треугольник? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Modellashtirish to'garagida tayoqchalardan shakllar yasaladi. Stolda uchta tayoqcha yotibdi: uch santimetr, to'rt santimetr va o'n santimetr.",
          "Timur uchburchak yasaladi deydi, axir tayoqcha roppa-rosa uchta. Zumrad esa yasalmaydi deb javob beradi. Uchburchak chiqadimi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The modelling club builds shapes from sticks. Three sticks lie on the table: three centimetres, four centimetres and ten centimetres.',
          'Timur says a triangle will come out since there are exactly three sticks. Zumrad answers it will not. Will a triangle come out? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Периметр и углы', uz: 'Perimetr va burchaklar', en: 'Perimeter and angles' },
    done: {
      ru: 'Периметр — сумма всех сторон. Углы измеряют в градусах, а развёрнутый угол, то есть прямая линия, равен 180 градусам.',
      uz: "Perimetr — barcha tomonlar yig'indisi. Burchaklar darajada o'lchanadi, yoyilgan burchak, ya'ni to'g'ri chiziq esa 180 darajaga teng.",
      en: 'The perimeter is the sum of all sides. Angles are measured in degrees, and a straight angle, a straight line, is 180 degrees.',
    },
    audio: {
      ru: [
        'Вспомним два знакомых понятия. Периметр это сумма длин всех сторон: обошли фигуру по краю и сложили.',
        'Углы измеряют в градусах. Прямой угол это девяносто градусов, а развёрнутый угол, когда стороны лежат на одной прямой, сто восемьдесят.',
        'Сегодня число сто восемьдесят появится ещё раз, и совсем неожиданно.',
      ],
      uz: [
        "Ikki tanish tushunchani eslaymiz. Perimetr barcha tomonlar uzunligining yig'indisi: shaklni chetidan aylanib chiqib qo'shdik.",
        "Burchaklar darajada o'lchanadi. To'g'ri burchak to'qson daraja, yoyilgan burchak esa, tomonlari bitta to'g'ri chiziqda yotganda, bir yuz sakson.",
        "Bugun bir yuz sakson soni yana bir marta, mutlaqo kutilmaganda paydo bo'ladi.",
      ],
      en: [
        'Recall two familiar ideas. The perimeter is the sum of all side lengths: walk around the shape and add.',
        'Angles are measured in degrees. A right angle is ninety degrees, and a straight angle, with the sides on one line, is one hundred eighty.',
        'Today the number one hundred eighty will show up again, quite unexpectedly.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Три угла складываются в прямую', uz: "Uch burchak to'g'ri chiziqqa yig'iladi", en: 'Three angles make a straight line' },
    lines: [
      { ru: 'у треугольника 3 вершины, 3 стороны, 3 угла', uz: 'uchburchakda 3 uch, 3 tomon, 3 burchak', en: 'a triangle has 3 vertices, 3 sides, 3 angles' },
      { ru: 'отрываем углы и прикладываем друг к другу', uz: "burchaklarni uzib, bir-biriga qo'yamiz", en: 'tear off the corners and put them together' },
      { ru: 'получилась прямая: 180°', uz: "to'g'ri chiziq chiqdi: 180°", en: 'a straight line appears: 180°' },
    ],
    done: {
      ru: 'Сумма углов любого треугольника равна 180 градусам. Форма не важна: узкий, широкий, любой — всегда 180.',
      uz: "Har qanday uchburchak burchaklari yig'indisi 180 darajaga teng. Shakl muhim emas: ingichka, keng, qanday bo'lsa ham — doim 180.",
      en: 'The angles of any triangle add to 180 degrees. The shape does not matter: narrow, wide, any — always 180.',
    },
    audio: {
      ru: [
        'Сначала назовём части. У треугольника три вершины, три стороны и три угла. Отсюда и название.',
        'Теперь опыт. Вырежем треугольник из бумаги и оторвём все три угла. Приложим их вершинами в одну точку, один к другому.',
        'Углы легли в одну прямую линию. А развёрнутый угол это сто восемьдесят градусов. Возьмите любой другой треугольник, узкий или широкий, и получится то же самое. Сумма углов треугольника всегда сто восемьдесят градусов.',
      ],
      uz: [
        "Avval qismlarini nomlaymiz. Uchburchakda uchta uch, uchta tomon va uchta burchak bor. Nomi ham shundan.",
        "Endi tajriba. Qog'ozdan uchburchak qirqib olib, uchta burchagini uzib olamiz. Ularni uchlari bilan bitta nuqtaga, ketma-ket qo'yamiz.",
        "Burchaklar bitta to'g'ri chiziqqa tushdi. Yoyilgan burchak esa bir yuz sakson daraja. Istalgan boshqa uchburchakni, ingichka yoki kengini olsangiz ham xuddi shu chiqadi. Uchburchak burchaklari yig'indisi doim bir yuz sakson daraja.",
      ],
      en: [
        'First name the parts. A triangle has three vertices, three sides and three angles. Hence the name.',
        'Now the experiment. Cut a triangle from paper and tear off all three corners. Put them apex to apex at one point, one next to another.',
        'The angles lie along one straight line. And a straight angle is one hundred eighty degrees. Take any other triangle, narrow or wide, and the same happens. The angles of a triangle always add to one hundred eighty degrees.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Третий угол', uz: 'Uchinchi burchak', en: 'The third angle' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'два угла известны: 40° и 60°', uz: "ikki burchak ma'lum: 40° va 60°", en: 'two angles are known: 40° and 60°' },
      { ru: 'складываем: 40 + 60 = 100', uz: "qo'shamiz: 40 + 60 = 100", en: 'add them: 40 + 60 = 100' },
      { ru: 'вычитаем из 180: третий 80°', uz: '180 dan ayiramiz: uchinchisi 80°', en: 'subtract from 180: the third is 80°' },
    ],
    demo_note: {
      ru: 'Все три угла вместе дают 180. Значит третий угол — это 180 без суммы двух известных.',
      uz: "Uchala burchak birga 180 ni beradi. Demak uchinchi burchak 180 dan ma'lum ikkitasining yig'indisini ayirgandagi qoldiq.",
      en: 'All three angles make 180. So the third one is 180 minus the sum of the two known ones.',
    },
    play_ask: { ru: 'Два угла 50° и 60°. Чему равен третий?', uz: "Ikki burchak 50° va 60°. Uchinchisi nechaga teng?", en: 'Two angles are 50° and 60°. The third?' },
    play_opts: ['70°', '110°', '90°'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 50 + 60 = 110, а 180 − 110 = 70.',
      uz: "To'g'ri. 50 + 60 = 110, 180 − 110 = 70.",
      en: 'Right. 50 + 60 = 110 and 180 − 110 = 70.',
    },
    play_wrong: [
      null,
      { ru: 'Это сумма двух известных, а нужен остаток до 180.', uz: "Bu ma'lum ikkitasining yig'indisi, 180 gacha qoldiq kerak esa.", en: 'That is the sum of the two known, not the remainder.' },
      { ru: 'Прямой угол здесь ни при чём: проверьте вычитанием.', uz: "To'g'ri burchakning bunga aloqasi yo'q: ayirib tekshiring.", en: 'A right angle has nothing to do with it: check by subtracting.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу приём. Пусть в треугольнике два угла известны: сорок градусов и шестьдесят.',
        uz: "Usulni ko'rsataman. Uchburchakda ikki burchak ma'lum bo'lsin: qirq daraja va oltmish.",
        en: 'I will show the move. Suppose two angles are known: forty degrees and sixty.',
      },
      demo: {
        ru: 'Сложим известные углы: сорок плюс шестьдесят это сто. Все три вместе дают сто восемьдесят, значит на третий остаётся сто восемьдесят минус сто, то есть восемьдесят градусов.',
        uz: "Ma'lum burchaklarni qo'shamiz: qirq qo'shuv oltmish yuz. Uchalasi birga bir yuz sakson beradi, demak uchinchisiga bir yuz sakson minus yuz, ya'ni sakson daraja qoladi.",
        en: 'Add the known angles: forty plus sixty is one hundred. All three make one hundred eighty, so the third gets one hundred eighty minus one hundred, that is eighty degrees.',
      },
      play: {
        ru: 'Теперь ваша очередь. Два угла пятьдесят и шестьдесят градусов. Чему равен третий?',
        uz: 'Endi sizning navbatingiz. Ikki burchak ellik va oltmish daraja. Uchinchisi nechaga teng?',
        en: 'Now it is your turn. Two angles are fifty and sixty degrees. What is the third?',
      },
      ok: {
        ru: 'Верно. Сто десять уже занято, на третий остаётся семьдесят.',
        uz: "To'g'ri. Bir yuz o'n band, uchinchisiga yetmish qoladi.",
        en: 'Right. One hundred ten is taken, seventy is left for the third.',
      },
      wrong: {
        ru: 'Сложите два известных угла и вычтите сумму из ста восьмидесяти.',
        uz: "Ma'lum ikki burchakni qo'shib, yig'indini bir yuz saksondan ayiring.",
        en: 'Add the two known angles and subtract the sum from one hundred eighty.',
      },
    },
  },

  s_kinds: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Виды треугольников', uz: 'Uchburchak turlari', en: 'Kinds of triangles' },
    lines: [
      { ru: 'по сторонам: все равны, две равны, все разные', uz: "tomonlar bo'yicha: barchasi teng, ikkitasi teng, barchasi har xil", en: 'by sides: all equal, two equal, all different' },
      { ru: 'по углам: все острые, один прямой, один тупой', uz: "burchaklar bo'yicha: barchasi o'tkir, biri to'g'ri, biri o'tmas", en: 'by angles: all acute, one right, one obtuse' },
      { ru: 'тупой или прямой угол бывает только один', uz: "o'tmas yoki to'g'ri burchak faqat bitta bo'ladi", en: 'there can be only one right or obtuse angle' },
    ],
    done: {
      ru: 'Виды считают отдельно по сторонам и по углам. Двух тупых углов быть не может: они вдвоём уже больше 180.',
      uz: "Turlar tomonlar va burchaklar bo'yicha alohida sanaladi. Ikki o'tmas burchak bo'lishi mumkin emas: ular ikkovlon 180 dan katta.",
      en: 'Kinds are counted separately by sides and by angles. Two obtuse angles are impossible: together they already exceed 180.',
    },
    audio: {
      ru: [
        'Треугольники делят на виды двумя способами. По сторонам: если все три стороны равны, треугольник равносторонний, если равны две, равнобедренный, если все разные, разносторонний.',
        'По углам: если все три угла острые, треугольник остроугольный. Если есть прямой угол, прямоугольный. Если есть тупой, тупоугольный.',
        'Обратите внимание: тупой угол может быть только один. Два тупых угла это уже больше ста восьмидесяти градусов, а на весь треугольник у нас ровно сто восемьдесят.',
      ],
      uz: [
        "Uchburchaklar ikki usulda turlarga bo'linadi. Tomonlar bo'yicha: uchala tomon teng bo'lsa teng tomonli, ikkitasi teng bo'lsa teng yonli, barchasi har xil bo'lsa har xil tomonli.",
        "Burchaklar bo'yicha: uchala burchak o'tkir bo'lsa o'tkir burchakli. To'g'ri burchak bo'lsa to'g'ri burchakli. O'tmas burchak bo'lsa o'tmas burchakli.",
        "E'tibor bering: o'tmas burchak faqat bitta bo'lishi mumkin. Ikki o'tmas burchak bu allaqachon bir yuz saksondan ko'p, butun uchburchakka esa roppa-rosa bir yuz sakson bor.",
      ],
      en: [
        'Triangles are sorted in two ways. By sides: all three equal makes it equilateral, two equal isosceles, all different scalene.',
        'By angles: all three acute makes it acute, one right angle makes it right, one obtuse makes it obtuse.',
        'Note that there can be only one obtuse angle. Two obtuse angles already exceed one hundred eighty degrees, and the whole triangle has exactly one hundred eighty.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Соберётся или нет', uz: "Yasaladimi yoki yo'q", en: 'Will it close or not' },
    lead: { ru: 'Палочки 3, 4 и 10. Проверим, сомкнутся ли они.', uz: 'Tayoqchalar 3, 4 va 10. Ular tutashadimi, tekshiramiz.', en: 'Sticks 3, 4 and 10. Check whether they meet.' },
    steps: [
      { ru: 'кладём длинную палочку 10', uz: "uzun 10 tayoqchani qo'yamiz", en: 'lay the long stick 10' },
      { ru: 'две короткие вместе: 3 + 4 = 7', uz: 'ikki qisqasi birga: 3 + 4 = 7', en: 'the two short ones: 3 + 4 = 7' },
      { ru: '7 меньше 10 — концы не встретятся', uz: '7 dan 10 katta — uchlari uchrashmaydi', en: '7 is less than 10, the ends will not meet' },
    ],
    done: {
      ru: 'Две короткие стороны вместе должны быть длиннее третьей, иначе треугольник не замкнётся. Права была Зумрад.',
      uz: "Ikki qisqa tomon birgalikda uchinchisidan uzun bo'lishi kerak, aks holda uchburchak tutashmaydi. Zumrad haq edi.",
      en: 'The two shorter sides together must beat the third, otherwise the triangle will not close. Zumrad was right.',
    },
    audio: {
      ru: [
        'Решаем вместе. Положим на стол самую длинную палочку, десять сантиметров.',
        'Теперь пристроим к её концам две короткие. Вместе они дают три плюс четыре, то есть семь сантиметров.',
        'Семь меньше десяти, значит короткие палочки просто не дотянутся друг до друга: между ними останется просвет. Треугольник не замкнётся. Права была Зумрад. Чтобы фигура собралась, две короткие стороны вместе должны быть длиннее третьей.',
      ],
      uz: [
        "Birga yechamiz. Stolga eng uzun tayoqchani, o'n santimetrni qo'yamiz.",
        "Endi uning uchlariga ikki qisqasini qo'shamiz. Ular birga uch qo'shuv to'rt, ya'ni yetti santimetr beradi.",
        "Yettidan o'n katta, demak qisqa tayoqchalar bir-biriga yetib bormaydi: ular orasida bo'shliq qoladi. Uchburchak tutashmaydi. Zumrad haq edi. Shakl yasalishi uchun ikki qisqa tomon birgalikda uchinchisidan uzun bo'lishi kerak.",
      ],
      en: [
        'Let us solve it together. Lay the longest stick, ten centimetres, on the table.',
        'Now attach the two short ones to its ends. Together they give three plus four, that is seven centimetres.',
        'Seven is less than ten, so the short sticks simply cannot reach each other: a gap stays between them. The triangle will not close. Zumrad was right. For a shape to close, the two shorter sides together must beat the third.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Не любые три числа', uz: 'Har qanday uch son emas', en: 'Not any three numbers' },
    bad_line: { ru: 'ошибка: палочек три, значит треугольник будет', uz: "xato: tayoqcha uchta, demak uchburchak bo'ladi", en: 'mistake: three sticks means a triangle' },
    good_line: { ru: 'верно: 3 + 4 = 7 меньше 10, не замкнётся', uz: "to'g'ri: 3 + 4 = 7 dan 10 katta, tutashmaydi", en: 'right: 3 + 4 = 7 is less than 10, no closing' },
    warn_line: { ru: 'ошибка: углы 100° и 90° в одном треугольнике', uz: "xato: bitta uchburchakda 100° va 90° burchaklar", en: 'mistake: angles 100° and 90° in one triangle' },
    done: {
      ru: 'Проверяют всегда самую длинную сторону против суммы двух других. С углами так же: сумма двух не должна дойти до 180.',
      uz: "Doim eng uzun tomon boshqa ikkitasining yig'indisiga qarshi tekshiriladi. Burchaklarda ham shunday: ikkitasining yig'indisi 180 ga yetmasligi kerak.",
      en: 'Always test the longest side against the sum of the other two. Angles the same: two of them must not reach 180.',
    },
    audio: {
      ru: [
        'Главная ошибка урока. Видят три палочки и решают, что треугольник соберётся сам собой.',
        'Но три числа ещё не треугольник. Всегда берите самую длинную сторону и сравнивайте с суммой двух других. Три плюс четыре это семь, а десять больше. Значит не соберётся.',
        'С углами похожая ловушка. Сто градусов и девяносто это уже сто девяносто, больше ста восьмидесяти. Такого треугольника нет, и тупой угол в треугольнике всегда только один.',
      ],
      uz: [
        "Darsning asosiy xatosi. Uchta tayoqchani ko'rib, uchburchak o'zidan yasaladi deb hisoblashadi.",
        "Ammo uch son hali uchburchak emas. Doim eng uzun tomonni olib, boshqa ikkitasining yig'indisi bilan solishtiring. Uch qo'shuv to'rt yetti, o'n esa katta. Demak yasalmaydi.",
        "Burchaklarda ham shunga o'xshash tuzoq. Yuz daraja va to'qson bu allaqachon bir yuz to'qson, bir yuz saksondan ko'p. Bunday uchburchak yo'q, uchburchakda o'tmas burchak doim faqat bitta.",
      ],
      en: [
        'The main mistake here. People see three sticks and assume a triangle will form by itself.',
        'But three numbers are not yet a triangle. Always take the longest side and compare it with the sum of the other two. Three plus four is seven and ten is more. So it will not close.',
        'Angles have a similar trap. One hundred degrees and ninety already make one hundred ninety, more than one hundred eighty. No such triangle exists, and a triangle always has at most one obtuse angle.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Что известно о треугольнике', uz: "Uchburchak haqida nima ma'lum", en: 'What we know about triangles' },
    rule_1: {
      ru: 'У треугольника три вершины, три стороны и три угла, а сумма углов равна 180°. Периметр — сумма всех сторон. Виды считают по сторонам и по углам отдельно.',
      uz: "Uchburchakda uchta uch, uchta tomon va uchta burchak bor, burchaklar yig'indisi 180° ga teng. Perimetr — barcha tomonlar yig'indisi. Turlar tomonlar va burchaklar bo'yicha alohida sanaladi.",
      en: 'A triangle has three vertices, three sides and three angles, and the angles add to 180°. The perimeter is the sum of the sides. Kinds are counted by sides and by angles separately.',
    },
    rule_2: {
      ru: 'Треугольник существует, только если каждая сторона меньше суммы двух других. Палочки 3, 4 и 10 не годятся: 3 + 4 меньше 10. Права была Зумрад.',
      uz: "Uchburchak faqat har bir tomon boshqa ikkitasining yig'indisidan kichik bo'lganda mavjud. 3, 4 va 10 tayoqchalar yaramaydi: 3 + 4 dan 10 katta. Zumrad haq edi.",
      en: 'A triangle exists only if every side is less than the sum of the other two. Sticks 3, 4 and 10 fail: 3 + 4 is less than 10. Zumrad was right.',
    },
    audio: {
      ru: 'Запомним правило. У треугольника три вершины, три стороны и три угла, а сумма углов всегда равна ста восьмидесяти градусам. Периметр это сумма всех сторон. Виды считают отдельно: по сторонам равносторонний, равнобедренный или разносторонний, по углам остроугольный, прямоугольный или тупоугольный. И главное: треугольник существует только тогда, когда каждая сторона меньше суммы двух других. Вернёмся к палочкам. Три плюс четыре это семь, а десять больше семи, значит фигура не замкнётся. Права была Зумрад.',
      uz: "Qoidani eslab qolamiz. Uchburchakda uchta uch, uchta tomon va uchta burchak bor, burchaklar yig'indisi esa doim bir yuz sakson darajaga teng. Perimetr barcha tomonlar yig'indisi. Turlar alohida sanaladi: tomonlar bo'yicha teng tomonli, teng yonli yoki har xil tomonli, burchaklar bo'yicha o'tkir, to'g'ri yoki o'tmas burchakli. Asosiysi: uchburchak faqat har bir tomon boshqa ikkitasining yig'indisidan kichik bo'lganda mavjud. Tayoqchalarga qaytamiz. Uch qo'shuv to'rt yetti, o'n esa yettidan katta, demak shakl tutashmaydi. Zumrad haq edi.",
      en: 'Let us remember the rule. A triangle has three vertices, three sides and three angles, and the angles always add to one hundred eighty degrees. The perimeter is the sum of the sides. Kinds are counted separately: by sides equilateral, isosceles or scalene, by angles acute, right or obtuse. And the key part: a triangle exists only when every side is less than the sum of the other two. Back to the sticks. Three plus four is seven and ten beats seven, so the shape will not close. Zumrad was right.',
    },
  },

  s_ang: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Находим угол', uz: 'Burchakni topamiz', en: 'Finding the angle' },
    lead: { ru: 'Все три угла вместе дают 180°.', uz: "Uchala burchak birga 180° beradi.", en: 'All three angles make 180°.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Углы 90° и 45°. Третий?', uz: 'Burchaklar 90° va 45°. Uchinchisi?', en: 'Angles 90° and 45°. The third?' },
        opts: ['45°', '135°', '90°'],
        correct: 0,
        ok: { ru: 'Верно. 180 − 135 = 45°.', uz: "To'g'ri. 180 − 135 = 45°.", en: 'Right. 180 − 135 = 45°.' },
        wrong: [
          null,
          { ru: 'Это сумма двух известных углов.', uz: "Bu ma'lum ikki burchakning yig'indisi.", en: 'That is the sum of the two known angles.' },
          { ru: 'Двух прямых углов в треугольнике быть не может.', uz: "Uchburchakda ikki to'g'ri burchak bo'lishi mumkin emas.", en: 'A triangle cannot have two right angles.' },
        ],
      },
      {
        q: { ru: 'Углы 30° и 30°. Третий?', uz: 'Burchaklar 30° va 30°. Uchinchisi?', en: 'Angles 30° and 30°. The third?' },
        opts: ['120°', '60°', '30°'],
        correct: 0,
        ok: { ru: 'Верно. 180 − 60 = 120°, треугольник тупоугольный.', uz: "To'g'ri. 180 − 60 = 120°, uchburchak o'tmas burchakli.", en: 'Right. 180 − 60 = 120°, an obtuse triangle.' },
        wrong: [
          null,
          { ru: 'Это сумма двух известных углов.', uz: "Bu ma'lum ikki burchakning yig'indisi.", en: 'That is the sum of the two known angles.' },
          { ru: 'Тогда сумма была бы 90, а не 180.', uz: "U holda yig'indi 180 emas, 90 bo'lardi.", en: 'Then the sum would be 90, not 180.' },
        ],
      },
      {
        q: { ru: 'В равностороннем треугольнике каждый угол?', uz: 'Teng tomonli uchburchakda har bir burchak?', en: 'Each angle of an equilateral triangle?' },
        opts: ['60°', '90°', '45°'],
        correct: 0,
        ok: { ru: 'Верно. 180 : 3 = 60°.', uz: "To'g'ri. 180 : 3 = 60°.", en: 'Right. 180 : 3 = 60°.' },
        wrong: [
          null,
          { ru: 'Три прямых угла дали бы 270.', uz: "Uchta to'g'ri burchak 270 berardi.", en: 'Three right angles would give 270.' },
          { ru: 'Три по 45 дают только 135.', uz: 'Uchta 45 dan atigi 135 beradi.', en: 'Three 45s give only 135.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на углы. Сложите известные и вычтите из ста восьмидесяти.',
        uz: "Burchaklar mashqi. Ma'lumlarini qo'shib, bir yuz saksondan ayiring.",
        en: 'Practice on angles. Add the known ones and subtract from one hundred eighty.',
      },
    },
  },

  s_kind: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Виды и периметр', uz: 'Turlar va perimetr', en: 'Kinds and perimeter' },
    lead: { ru: 'Смотри отдельно на стороны и отдельно на углы.', uz: 'Tomonlarga va burchaklarga alohida qarang.', en: 'Look at the sides and the angles separately.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Стороны 7, 7 и 10 см. Периметр?', uz: 'Tomonlar 7, 7 va 10 sm. Perimetr?', en: 'Sides 7, 7 and 10 cm. Perimeter?' },
        opts: ['24 см', '17 см', '490 см'],
        correct: 0,
        ok: { ru: 'Верно. 7 + 7 + 10 = 24 см.', uz: "To'g'ri. 7 + 7 + 10 = 24 sm.", en: 'Right. 7 + 7 + 10 = 24 cm.' },
        wrong: [
          null,
          { ru: 'Складывать надо все три стороны.', uz: "Uchala tomonni qo'shish kerak.", en: 'All three sides must be added.' },
          { ru: 'Периметр складывают, а не перемножают.', uz: "Perimetr qo'shiladi, ko'paytirilmaydi.", en: 'A perimeter adds, it does not multiply.' },
        ],
      },
      {
        q: { ru: 'Стороны 7, 7 и 10. Какой это треугольник?', uz: 'Tomonlar 7, 7 va 10. Bu qanday uchburchak?', en: 'Sides 7, 7 and 10. Which kind?' },
        opts: [
          { ru: 'равнобедренный', uz: 'teng yonli', en: 'isosceles' },
          { ru: 'равносторонний', uz: 'teng tomonli', en: 'equilateral' },
          { ru: 'разносторонний', uz: 'har xil tomonli', en: 'scalene' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Две стороны равны.', uz: "To'g'ri. Ikki tomon teng.", en: 'Right. Two sides are equal.' },
        wrong: [
          null,
          { ru: 'Для равностороннего нужны все три равные.', uz: "Teng tomonli uchun uchalasi teng bo'lishi kerak.", en: 'Equilateral needs all three equal.' },
          { ru: 'Здесь две стороны совпадают.', uz: 'Bu yerda ikki tomon mos keladi.', en: 'Here two sides match.' },
        ],
      },
      {
        q: { ru: 'Один угол 100°. Какой это треугольник по углам?', uz: "Bir burchak 100°. Burchaklar bo'yicha bu qanday uchburchak?", en: 'One angle is 100°. Which kind by angles?' },
        opts: [
          { ru: 'тупоугольный', uz: "o'tmas burchakli", en: 'obtuse' },
          { ru: 'прямоугольный', uz: "to'g'ri burchakli", en: 'right' },
          { ru: 'остроугольный', uz: "o'tkir burchakli", en: 'acute' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Угол больше 90°, значит тупой.', uz: "To'g'ri. Burchak 90° dan katta, demak o'tmas.", en: 'Right. The angle exceeds 90°, so it is obtuse.' },
        wrong: [
          null,
          { ru: 'Прямой угол это ровно 90°.', uz: "To'g'ri burchak roppa-rosa 90°.", en: 'A right angle is exactly 90°.' },
          { ru: 'Острые углы меньше 90°.', uz: "O'tkir burchaklar 90° dan kichik.", en: 'Acute angles are less than 90°.' },
        ],
      },
      {
        q: { ru: 'Сколько тупых углов может быть в треугольнике?', uz: "Uchburchakda nechta o'tmas burchak bo'lishi mumkin?", en: 'How many obtuse angles can a triangle have?' },
        opts: ['один', 'два', 'три'],
        correct: 0,
        ok: { ru: 'Верно. Два тупых дали бы больше 180°.', uz: "To'g'ri. Ikki o'tmas 180° dan ko'p berardi.", en: 'Right. Two obtuse would exceed 180°.' },
        wrong: [
          null,
          { ru: 'Два угла больше 90 дают уже больше 180.', uz: "90 dan katta ikki burchak allaqachon 180 dan ko'p beradi.", en: 'Two angles over 90 already exceed 180.' },
          { ru: 'Тем более три.', uz: "Uchtasi haqida gapirmasa ham bo'ladi.", en: 'Three even more so.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на виды и периметр. Стороны складываем, углы сравниваем с девяноста.',
        uz: "Turlar va perimetr mashqi. Tomonlarni qo'shamiz, burchaklarni to'qson bilan solishtiramiz.",
        en: 'Practice on kinds and perimeter. Add the sides, compare the angles with ninety.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Соберётся ли треугольник', uz: 'Uchburchak yasaladimi', en: 'Will a triangle close' },
    lead: { ru: 'Сравни самую длинную сторону с суммой двух других.', uz: "Eng uzun tomonni boshqa ikkitasining yig'indisi bilan solishtiring.", en: 'Compare the longest side with the sum of the other two.' },
    bin_a: { ru: 'Соберётся', uz: 'Yasaladi', en: 'It closes' },
    bin_b: { ru: 'Не соберётся', uz: 'Yasalmaydi', en: 'It does not' },
    cards: [
      { label: '3, 4, 5', bin: 'a' },
      { label: '6, 6, 6', bin: 'a' },
      { label: '7, 8, 10', bin: 'a' },
      { label: '2, 3, 9', bin: 'b' },
      { label: '1, 1, 5', bin: 'b' },
      { label: '4, 5, 12', bin: 'b' },
    ],
    hint: {
      ru: 'Две короткие вместе должны быть длиннее третьей.',
      uz: "Ikki qisqasi birga uchinchisidan uzun bo'lishi kerak.",
      en: 'The two short ones together must beat the third.',
    },
    correct_text: {
      ru: 'Верно. Всё решает одно сравнение с самой длинной стороной.',
      uz: "To'g'ri. Hammasini eng uzun tomon bilan bitta solishtirish hal qiladi.",
      en: 'Right. One comparison with the longest side decides it.',
    },
    audio: {
      intro: {
        ru: 'Разложите тройки по двум корзинам. Складывайте две короткие и сравнивайте с длинной.',
        uz: "Uchliklarni ikki savatga ajrating. Ikki qisqasini qo'shib, uzuni bilan solishtiring.",
        en: 'Sort the triples into two baskets. Add the two short ones and compare with the long one.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Сложи две короткие стороны.', uz: "Bu yerga emas. Ikki qisqa tomonni qo'shing.", en: 'Not here. Add the two short sides.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Тимур: «Углы 100° и 90°, третий 10°». Проверь.', uz: "Timur: «Burchaklar 100° va 90°, uchinchisi 10°». Tekshiring.", en: 'Timur: “Angles 100° and 90°, third 10°.” Check it.' },
        opts: [
          { ru: 'Нет: 100 и 90 уже больше 180, треугольника нет', uz: "Yo'q: 100 va 90 allaqachon 180 dan ko'p, uchburchak yo'q", en: 'No: 100 and 90 already exceed 180, no such triangle' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, третий 20°', uz: "Yo'q, uchinchisi 20°", en: 'No, the third is 20°' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Тупой угол в треугольнике только один.', uz: "To'g'ri. Uchburchakda o'tmas burchak faqat bitta.", en: 'Right. A triangle has at most one obtuse angle.' },
        wrong: [
          null,
          { ru: 'Сложите: 100 плюс 90 это 190, больше 180.', uz: "Qo'shing: 100 qo'shuv 90 bu 190, 180 dan ko'p.", en: 'Add them: 100 plus 90 is 190, more than 180.' },
          { ru: 'Дело не в третьем угле: такого треугольника нет вовсе.', uz: "Gap uchinchi burchakda emas: bunday uchburchak umuman yo'q.", en: 'It is not about the third angle: no such triangle exists.' },
        ],
      },
      {
        q: { ru: 'Зумрад: «Стороны 2, 3 и 9, периметр 14, значит есть». Проверь.', uz: "Zumrad: «Tomonlar 2, 3 va 9, perimetr 14, demak bor». Tekshiring.", en: 'Zumrad: “Sides 2, 3, 9, perimeter 14, so it exists.” Check it.' },
        opts: [
          { ru: 'Нет: 2 + 3 = 5 меньше 9, фигура не замкнётся', uz: "Yo'q: 2 + 3 = 5 dan 9 katta, shakl tutashmaydi", en: 'No: 2 + 3 = 5 is less than 9, it will not close' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, периметр 12', uz: "Yo'q, perimetr 12", en: 'No, the perimeter is 12' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Периметр можно посчитать, а треугольника всё равно нет.', uz: "To'g'ri. Perimetrni hisoblash mumkin, uchburchak esa baribir yo'q.", en: 'Right. You can add the numbers, yet no triangle exists.' },
        wrong: [
          null,
          { ru: 'Сумма чисел ещё не значит, что фигура существует.', uz: "Sonlar yig'indisi shakl mavjudligini bildirmaydi.", en: 'A sum does not prove the shape exists.' },
          { ru: 'Сумма посчитана верно, ошибка не в ней.', uz: "Yig'indi to'g'ri hisoblangan, xato unda emas.", en: 'The sum is right, the error is elsewhere.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в углах, и в самом существовании фигуры.',
        uz: "Birovning yechimini tekshiring. Xato burchaklarda ham, shaklning mavjudligida ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the angles and in whether the shape exists at all.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Каркас из палочек', uz: 'Tayoqchalardan karkas', en: 'A frame of sticks' },
    lead: { ru: 'В наборе палочки 5, 6, 9 и 12 см.', uz: "To'plamda 5, 6, 9 va 12 sm tayoqchalar bor.", en: 'The set has sticks of 5, 6, 9 and 12 cm.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Соберётся ли треугольник из 5, 6 и 9?', uz: '5, 6 va 9 dan uchburchak yasaladimi?', en: 'Will 5, 6 and 9 close?' },
        opts: [
          { ru: 'да, 5 + 6 = 11 больше 9', uz: "ha, 5 + 6 = 11 dan 9 kichik", en: 'yes, 5 + 6 = 11 beats 9' },
          { ru: 'нет', uz: "yo'q", en: 'no' },
          { ru: 'нельзя определить', uz: "aniqlab bo'lmaydi", en: 'cannot tell' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Две короткие вместе длиннее третьей.', uz: "To'g'ri. Ikki qisqasi birga uchinchisidan uzun.", en: 'Right. The two short ones beat the third.' },
        wrong: [
          null,
          { ru: 'Проверьте: 5 плюс 6 это 11, а 11 больше 9.', uz: "Tekshiring: 5 qo'shuv 6 bu 11, 11 dan 9 kichik.", en: 'Check: 5 plus 6 is 11, and 11 beats 9.' },
          { ru: 'Определить можно: хватает одного сравнения.', uz: 'Aniqlash mumkin: bitta solishtirish yetadi.', en: 'It can be told: one comparison is enough.' },
        ],
      },
      {
        q: { ru: 'Периметр треугольника из 5, 6 и 9?', uz: '5, 6 va 9 dan uchburchakning perimetri?', en: 'The perimeter of 5, 6 and 9?' },
        opts: ['20 см', '11 см', '270 см'],
        correct: 0,
        ok: { ru: 'Верно. 5 + 6 + 9 = 20 см.', uz: "To'g'ri. 5 + 6 + 9 = 20 sm.", en: 'Right. 5 + 6 + 9 = 20 cm.' },
        wrong: [
          null,
          { ru: 'Третью сторону тоже складывают.', uz: "Uchinchi tomon ham qo'shiladi.", en: 'The third side is added too.' },
          { ru: 'Стороны складывают, а не перемножают.', uz: "Tomonlar qo'shiladi, ko'paytirilmaydi.", en: 'Sides add, they do not multiply.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про каркас. В наборе палочки пять, шесть, девять и двенадцать сантиметров.',
        uz: "Karkas haqida masala. To'plamda besh, olti, to'qqiz va o'n ikki santimetrlik tayoqchalar bor.",
        en: 'A frame problem. The set has sticks of five, six, nine and twelve centimetres.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 75,
        q: { ru: 'Углы 45° и 60°. Найди третий в градусах.', uz: 'Burchaklar 45° va 60°. Uchinchisini darajada toping.', en: 'Angles 45° and 60°. Find the third in degrees.' },
        hint: { ru: '45 + 60 = 105, дальше вычти из 180.', uz: '45 + 60 = 105, keyin 180 dan ayiring.', en: '45 + 60 = 105, then subtract from 180.' },
        hint_audio: { ru: 'Сложите сорок пять и шестьдесят, получится сто пять, а потом вычтите эту сумму из ста восьмидесяти.', uz: "Qirq besh va oltmishni qo'shing, bir yuz besh chiqadi, keyin bu yig'indini bir yuz saksondan ayiring.", en: 'Add forty five and sixty to get one hundred five, then subtract that from one hundred eighty.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Чему равна сумма углов треугольника?', uz: "Uchburchak burchaklari yig'indisi nechaga teng?", en: 'What do the angles of a triangle add to?' },
        opts: ['90°', '360°', '180°', 'зависит от формы'],
        wrong: [
          { ru: 'Девяносто это один прямой угол.', uz: "To'qson bu bitta to'g'ri burchak.", en: 'Ninety is one right angle.' },
          { ru: 'Триста шестьдесят это полный оборот.', uz: "Uch yuz oltmish bu to'liq aylanish.", en: 'Three hundred sixty is a full turn.' },
          null,
          { ru: 'Форма не важна: сумма всегда одна.', uz: "Shakl muhim emas: yig'indi doim bitta.", en: 'The shape does not matter: the sum is always the same.' },
        ],
        correct: { ru: 'Верно. Три оторванных угла складываются в прямую.', uz: "To'g'ri. Uzib olingan uch burchak to'g'ri chiziqqa yig'iladi.", en: 'Right. Three torn corners make a straight line.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Соберётся ли треугольник из 4, 5 и 12?', uz: '4, 5 va 12 dan uchburchak yasaladimi?', en: 'Will 4, 5 and 12 close?' },
        opts: [
          { ru: 'да, палочек три', uz: 'ha, tayoqcha uchta', en: 'yes, there are three sticks' },
          { ru: 'нет, 4 + 5 меньше 12', uz: "yo'q, 4 + 5 dan 12 katta", en: 'no, 4 + 5 is less than 12' },
          { ru: 'да, периметр 21', uz: 'ha, perimetr 21', en: 'yes, the perimeter is 21' },
          { ru: 'нельзя определить', uz: "aniqlab bo'lmaydi", en: 'cannot tell' },
        ],
        wrong: [
          { ru: 'Трёх палочек мало, нужна проверка длин.', uz: 'Uch tayoqcha kam, uzunliklarni tekshirish kerak.', en: 'Three sticks are not enough, lengths must be checked.' },
          null,
          { ru: 'Периметр посчитать можно, а фигуры нет.', uz: "Perimetrni hisoblash mumkin, shakl esa yo'q.", en: 'You can add the numbers but the shape does not exist.' },
          { ru: 'Хватает одного сравнения.', uz: 'Bitta solishtirish yetadi.', en: 'One comparison is enough.' },
        ],
        correct: { ru: 'Верно. Короткие вместе дают 9, а это меньше 12.', uz: "To'g'ri. Qisqalar birga 9 beradi, bu esa 12 dan kichik.", en: 'Right. The short ones give 9, less than 12.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Стороны 8, 8 и 8. Какой это треугольник?', uz: 'Tomonlar 8, 8 va 8. Bu qanday uchburchak?', en: 'Sides 8, 8 and 8. Which kind?' },
        opts: [
          { ru: 'разносторонний', uz: 'har xil tomonli', en: 'scalene' },
          { ru: 'прямоугольный', uz: "to'g'ri burchakli", en: 'right' },
          { ru: 'тупоугольный', uz: "o'tmas burchakli", en: 'obtuse' },
          { ru: 'равносторонний', uz: 'teng tomonli', en: 'equilateral' },
        ],
        wrong: [
          { ru: 'Разносторонний это когда все стороны разные.', uz: "Har xil tomonli bu barcha tomonlar har xil bo'lganda.", en: 'Scalene means all sides different.' },
          { ru: 'Все углы здесь по 60°.', uz: 'Bu yerda barcha burchaklar 60° dan.', en: 'All angles here are 60°.' },
          { ru: 'Тупых углов здесь нет.', uz: "Bu yerda o'tmas burchak yo'q.", en: 'There is no obtuse angle here.' },
          null,
        ],
        correct: { ru: 'Верно. Все три стороны равны, каждый угол 60°.', uz: "To'g'ri. Uchala tomon teng, har bir burchak 60°.", en: 'Right. All three sides equal, each angle 60°.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Палочки 3, 4 и 10. Что скажешь?', uz: 'Tayoqchalar 3, 4 va 10. Nima deysiz?', en: 'Sticks 3, 4 and 10. What do you say?' },
        opts: [
          { ru: 'треугольник не соберётся', uz: 'uchburchak yasalmaydi', en: 'no triangle' },
          { ru: 'соберётся равнобедренный', uz: 'teng yonli yasaladi', en: 'an isosceles one' },
          { ru: 'соберётся тупоугольный', uz: "o'tmas burchakli yasaladi", en: 'an obtuse one' },
          { ru: 'соберётся прямоугольный', uz: "to'g'ri burchakli yasaladi", en: 'a right one' },
        ],
        wrong: [
          null,
          { ru: 'Равных сторон здесь нет, и фигура не замкнётся.', uz: "Bu yerda teng tomon yo'q va shakl tutashmaydi.", en: 'No equal sides here, and it will not close.' },
          { ru: 'Углов не будет вовсе: фигура не замкнётся.', uz: "Burchaklar umuman bo'lmaydi: shakl tutashmaydi.", en: 'There will be no angles: it will not close.' },
          { ru: 'Прямого угла тоже не будет.', uz: "To'g'ri burchak ham bo'lmaydi.", en: 'No right angle either.' },
        ],
        correct: { ru: 'Верно. 3 + 4 = 7, а 7 меньше 10.', uz: "To'g'ri. 3 + 4 = 7, 7 esa 10 dan kichik.", en: 'Right. 3 + 4 = 7, and 7 is less than 10.' },
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
      ru: 'Треугольник — единственная фигура из палочек, которую нельзя перекосить, не сломав. Четырёхугольник из тех же палочек легко складывается в ромб, а треугольник держит форму. Поэтому треугольники видно всюду: в мостах, в стрелах кранов, в опорах линий электропередачи и в рамах велосипедов.',
      uz: "Uchburchak tayoqchalardan yasalgan yagona shakl bo'lib, uni sindirmasdan qiyshaytirib bo'lmaydi. Xuddi shu tayoqchalardan yasalgan to'rtburchak osongina rombga aylanadi, uchburchak esa shaklini saqlaydi. Shuning uchun uchburchaklar hamma joyda ko'rinadi: ko'priklarda, kran strelalarida, elektr uzatish tayanchlarida va velosiped ramalarida.",
      en: 'A triangle is the only stick figure you cannot skew without breaking it. A quadrilateral of the same sticks folds easily into a rhombus, while a triangle holds its shape. That is why triangles are everywhere: in bridges, crane jibs, power line towers and bicycle frames.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Треугольник это единственная фигура из палочек, которую нельзя перекосить, не сломав. Четырёхугольник из тех же палочек легко складывается набок, а треугольник держит форму. Поэтому треугольники видно всюду: в мостах, в стрелах кранов, в опорах линий электропередачи и в рамах велосипедов.',
      uz: "Bilasizmi? Uchburchak tayoqchalardan yasalgan yagona shakl bo'lib, uni sindirmasdan qiyshaytirib bo'lmaydi. Xuddi shu tayoqchalardan yasalgan to'rtburchak osongina yonga og'adi, uchburchak esa shaklini saqlaydi. Shuning uchun uchburchaklar hamma joyda ko'rinadi: ko'priklarda, kran strelalarida, elektr uzatish tayanchlarida va velosiped ramalarida.",
      en: 'Did you know? A triangle is the only stick figure you cannot skew without breaking it. A quadrilateral of the same sticks folds sideways easily, while a triangle holds its shape. That is why triangles are everywhere: in bridges, crane jibs, power line towers and bicycle frames.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Геометрия', uz: 'Matematika · Geometriya', en: 'Mathematics · Geometry' },
    heading: { ru: 'Треугольник', uz: 'Uchburchak', en: 'The triangle' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'сумма углов всегда 180°', uz: "burchaklar yig'indisi doim 180°", en: 'the angles always add to 180°' },
    brief_2: { ru: 'периметр — сумма сторон', uz: "perimetr — tomonlar yig'indisi", en: 'the perimeter is the sum of sides' },
    brief_3: { ru: 'каждая сторона меньше суммы двух других', uz: "har bir tomon boshqa ikkitasining yig'indisidan kichik", en: 'each side is less than the other two' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Тупой угол', uz: "O'tmas burchak", en: 'An obtuse angle' },
    memo_a1: { ru: 'в треугольнике только один', uz: 'uchburchakda faqat bitta', en: 'appears only once' },
    memo_q2: { ru: 'Виды', uz: 'Turlar', en: 'Kinds' },
    memo_a2: { ru: 'по сторонам и по углам', uz: "tomonlar va burchaklar bo'yicha", en: 'by sides and by angles' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'считать, что три числа — уже треугольник', uz: 'uch son uchburchak deb hisoblash', en: 'assuming three numbers make a triangle' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'У треугольника три вершины, три стороны и три угла, а сумма углов всегда сто восемьдесят градусов. Периметр это сумма сторон. Виды считают отдельно по сторонам и по углам, причём тупой угол бывает только один.',
        'Палочки: три плюс четыре меньше десяти, значит треугольник не соберётся.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Uchburchakda uchta uch, uchta tomon va uchta burchak bor, burchaklar yig'indisi esa doim bir yuz sakson daraja. Perimetr tomonlar yig'indisi. Turlar tomonlar va burchaklar bo'yicha alohida sanaladi, o'tmas burchak esa faqat bitta bo'ladi.",
        "Tayoqchalar: uch qo'shuv to'rt o'ndan kichik, demak uchburchak yasalmaydi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'A triangle has three vertices, three sides and three angles, and the angles always add to one hundred eighty degrees. The perimeter is the sum of the sides. Kinds are counted by sides and by angles, and there is only one obtuse angle.',
        'The sticks: three plus four is less than ten, so no triangle.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Сравни и вычти', uz: 'Usul. Solishtiring va ayiring', en: 'Method. Compare and subtract' },
    m1_steps: {
      ru: ['Для угла: сложи два известных и вычти из 180', 'Для сторон: сложи две короткие', 'Сравни их сумму с самой длинной'],
      uz: ["Burchak uchun: ma'lum ikkitasini qo'shib, 180 dan ayiring", "Tomonlar uchun: ikki qisqasini qo'shing", "Yig'indini eng uzuni bilan solishtiring"],
      en: ['For an angle: add the two known and subtract from 180', 'For sides: add the two short ones', 'Compare that sum with the longest side'],
    },
    m1_no: {
      ru: 'Периметр можно посчитать и у несуществующей тройки, поэтому сначала проверяют, замкнётся ли фигура.',
      uz: "Perimetrni mavjud bo'lmagan uchlikda ham hisoblash mumkin, shuning uchun avval shakl tutashishini tekshiriladi.",
      en: 'A perimeter can be computed even for an impossible triple, so first check whether the shape closes.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кружок моделирования, палочки и узлы на столе.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d42wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE4D2"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d42wall)"/>

    {/* Готовые модели на полке: мост из треугольников */}
    <g opacity="0.9">
      <rect x="10" y="52" width="110" height="5" rx="2.5" fill="#C9A472"/>
      <path d="M16 52 L34 24 L52 52 L70 24 L88 52 L106 24 L114 52"
        fill="none" stroke="#8FBF7F" strokeWidth="2.6"/>
      <path d="M16 24 h98" stroke="#8FBF7F" strokeWidth="2.2"/>
    </g>

    {/* Стол с палочками: три и четыре сомкнуть не удаётся */}
    <rect x="0" y="112" width="400" height="42" fill="#D2A96F"/>
    <rect x="0" y="108" width="400" height="6" fill="#C9A472"/>

    <g>
      {/* длинная палочка 10 */}
      <rect x="150" y="94" width="200" height="8" rx="4" fill="#B99B72" stroke="#8B7350" strokeWidth="1.4"/>
      <text x="250" y="90" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">10</text>
      {/* короткая 3 слева, короткая 4 справа: между ними просвет */}
      <g className="d42-try">
        <rect x="150" y="94" width="60" height="8" rx="4" fill="#7ECBE6" stroke="#4F9EBB" strokeWidth="1.4"
          transform="rotate(-42 154 98)"/>
      </g>
      <rect x="270" y="94" width="80" height="8" rx="4" fill="#F5C77E" stroke="#C9A472" strokeWidth="1.4"
        transform="rotate(48 346 98)"/>
      <text x="176" y="58" textAnchor="middle" fill="#019ACB"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">3</text>
      <text x="330" y="52" textAnchor="middle" fill="#8A6A22"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">4</text>
      {/* просвет между концами */}
      <path className="d42-gap" d="M216 56 h56" stroke="#D9603F" strokeWidth="2" strokeDasharray="4 4"/>
    </g>

    <Person x={52} ground={112} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={96} ground={112} head={13} shirt="#F5C77E" hair="#5A4636"/>
  </svg>
);

// Итог: три угла складываются в прямую.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <path d="M40 34 L116 34 L74 74 z" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2.2"/>
      <path d="M150 58 h200" stroke="#8E8578" strokeWidth="2.4"/>
      <path d="M150 58 L186 26 L214 58 z" fill="#A9CFBA" stroke="#1F7A4D" strokeWidth="1.8"/>
      <path d="M214 58 L246 30 L282 58 z" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="1.8"/>
      <path d="M282 58 L318 34 L350 58 z" fill="#FFF1EC" stroke="#D9603F" strokeWidth="1.8"/>
      <text x="250" y="82" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'три угла дают прямую: 180 градусов',
          "uch burchak to'g'ri chiziq beradi: 180 daraja",
          'three angles make a straight line: 180 degrees')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: треугольник с подписями углов и сторон.
const Tri = ({ a, b, c, sides, torn = false, size = 'mid' }) => (
  <span className={'d42-tri-box d42-tri-' + size}>
    <svg viewBox="0 0 260 150" aria-hidden="true">
      <path d="M30 116 L206 116 L96 30 z" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2.6"/>
      {a && (
        <text x="50" y="106" fill="#D9603F"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{a}</text>
      )}
      {b && (
        <text x="176" y="106" textAnchor="end" fill="#8A6A22"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{b}</text>
      )}
      {c && (
        <text x="96" y="52" textAnchor="middle" fill="#1F7A4D"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{c}</text>
      )}
      {sides && (
        <g>
          <text x="118" y="132" textAnchor="middle" fill="#8A8883"
            fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{sides[0]}</text>
          <text x="46" y="70" textAnchor="middle" fill="#8A8883"
            fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{sides[1]}</text>
          <text x="166" y="66" textAnchor="middle" fill="#8A8883"
            fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{sides[2]}</text>
        </g>
      )}
      {torn && (
        <g>
          <path d="M30 116 L52 116 L38 100 z" fill="#FFF1EC" stroke="#D9603F" strokeWidth="1.6"/>
          <path d="M206 116 L184 116 L196 100 z" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="1.6"/>
          <path d="M96 30 L84 48 L110 48 z" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="1.6"/>
        </g>
      )}
    </svg>
  </span>
);

// Три палочки: смыкаются или нет.
const Sticks = ({ a, b, c, ok }) => {
  const unit = 200 / Math.max(c, 1);
  return (
    <span className="d42-sticks-box">
      <svg viewBox="0 0 260 96" aria-hidden="true">
        <rect x="26" y="66" width={c * unit} height="8" rx="4" fill="#B99B72" stroke="#8B7350" strokeWidth="1.4"/>
        <text x={26 + c * unit / 2} y="90" textAnchor="middle" fill="#8A8883"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{c}</text>
        <rect x="26" y="34" width={a * unit} height="8" rx="4" fill="#7ECBE6" stroke="#4F9EBB" strokeWidth="1.4"/>
        <text x={26 + a * unit / 2} y="30" textAnchor="middle" fill="#019ACB"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{a}</text>
        <rect x={26 + a * unit + 4} y="34" width={b * unit} height="8" rx="4" fill="#F5C77E" stroke="#C9A472" strokeWidth="1.4"/>
        <text x={26 + a * unit + b * unit / 2} y="30" textAnchor="middle" fill="#8A6A22"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{b}</text>
        <path d={`M${26 + (a + b) * unit + 4} 38 H${26 + c * unit}`}
          stroke={ok ? '#1F7A4D' : '#D9603F'} strokeWidth="2.4" strokeDasharray="4 4"/>
        <text x={26 + c * unit + 12} y="56" fill={ok ? '#1F7A4D' : '#D9603F'}
          fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">{ok ? '+' : '−'}</text>
      </svg>
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d42-line d42-fade' + (on ? ' d42-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d42-stage">
        <span className="d42-ang">
          <svg viewBox="0 0 240 70" aria-hidden="true">
            <path d="M20 52 h200" stroke="#8E8578" strokeWidth="2.6"/>
            <path d="M120 52 v-30" stroke="#D9603F" strokeWidth="2.2" strokeDasharray="5 4"/>
            <path d="M96 52 a24 24 0 0 1 48 0" fill="none" stroke="#019ACB" strokeWidth="2"/>
            <text x="120" y="18" textAnchor="middle" fill="#019ACB"
              fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">180°</text>
          </svg>
        </span>
        <span className={'d42-chips d42-fade' + (step >= 1 ? ' d42-on' : '')}>
          <i className="d42-chip-l">{tri(lang, 'развёрнутый угол', 'yoyilgan burchak', 'a straight angle')}</i>
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

// Ядро: опыт с оторванными углами.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d42-stage d42-stage-row">
        <Tri size="sm" torn={step >= 1}/>
        <span className="d42-col">
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

// Виды треугольников.
const KindsBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_kinds;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d42-stage">
        <span className="d42-kinds">
          <svg viewBox="0 0 300 96" aria-hidden="true">
            <path d="M14 76 L74 76 L44 24 z" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2.2"/>
            <g className={'d42-fade' + (step >= 1 ? ' d42-on' : '')}>
              <path d="M110 76 L170 76 L110 28 z" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2.2"/>
              <path d="M110 66 h10 v10" fill="none" stroke="#019ACB" strokeWidth="1.6"/>
            </g>
            <g className={'d42-fade' + (step >= 2 ? ' d42-on' : '')}>
              <path d="M198 76 L288 76 L216 44 z" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="2.2"/>
            </g>
          </svg>
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
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d42-stage">
        <Sticks a={3} b={4} c={10} ok={false}/>
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

// Граница: не любые три числа.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d42-stage">
        <span className="d42-pair d42-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d42-pair d42-pair-good d42-fade' + (step >= 1 ? ' d42-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d42-pair d42-pair-warn d42-fade' + (step >= 2 ? ' d42-on' : '')}>
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
        <div className={'d42-banner fade-up delay-1' + (phase === 'play' ? ' d42-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d42-stage d42-stage-tool d42-stage-row">
          {phase === 'demo' ? (
            <>
              <Tri size="xs" a="40°" b="60°" c={shown >= 2 ? '80°' : '?'}/>
              <span className="d42-col">
                {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
                <p className={'body d42-verdict' + (done ? ' d42-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
              </span>
            </>
          ) : (
            <span className="d42-col">
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
          <div className="d42-acts fade-up">
            <button className="d42-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d42-btn d42-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenKinds = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_kinds} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <KindsBody step={step}/>}/>
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
      <div className="d42-stage">
        <Tri size="xs" a="60°" b="60°" c="60°" sides={['8', '8', '8']}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenAng = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_ang} asideNode={methodAside}/>
);
const ScreenKind = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_kind} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: палочки набора.
const TaskFig = ({ idx }) => (
  <div className="d42-task-fig">
    {idx >= 1
      ? <Tri size="xs" sides={['9', '5', '6']}/>
      : <Sticks a={5} b={6} c={9} ok/>}
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
.d42-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d42-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d42-stage-tool .d42-line { font-size: clamp(12px, 2vw, 16px); }
.d42-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d42-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 200px; min-width: 0; }

/* Треугольник и палочки */
.d42-tri-box { display: block; width: 100%; max-width: 250px; }
.d42-tri-sm { max-width: 210px; }
.d42-tri-xs { max-width: 172px; }
.d42-tri-box svg { width: 100%; height: auto; display: block; }
.d42-sticks-box { display: block; width: 100%; max-width: 300px; }
.d42-sticks-box svg { width: 100%; height: auto; display: block; }
.d42-ang { display: block; width: 100%; max-width: 240px; }
.d42-ang svg { width: 100%; height: auto; display: block; }
.d42-kinds { display: block; width: 100%; max-width: 300px; }
.d42-kinds svg { width: 100%; height: auto; display: block; }

.d42-fade { opacity: 0; transition: opacity 420ms linear; }
.d42-on { opacity: 1; }
.d42-line { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Подписи */
.d42-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d42-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d42-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }

/* Строки экрана границы */
.d42-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d42-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d42-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d42-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d42-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d42-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d42-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d42-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d42-verdict-on { opacity: 1; }
.d42-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d42-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d42-btn:disabled { opacity: 0.45; cursor: default; }
.d42-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d42-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: короткую палочку пробуют дотянуть, просвет мигает */
.d42-try { animation: d42Try 3600ms ease-in-out infinite; }
@keyframes d42Try { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
.d42-gap { animation: d42Gap 2400ms ease-in-out infinite; }
@keyframes d42Gap { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d42-try, .d42-gap { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function TriangleLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenKinds, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenAng, ScreenKind, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
