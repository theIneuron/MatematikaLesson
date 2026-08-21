// ============================================================================
// 4-SINF · 40-DARS AMALIYOTI · FAZOVIY SHAKLLAR VA YOYILMALAR
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// SKELET: src/books/grade4/AMALIYOT_31_40_SKELET.md §5.10.
// Raskladka (scripts/grade4-practice-31-40-layout.mjs):
//   match · missing · construct · numpad · mc · missing · order · mc · sort · construct
//
// NEGA BITTA FAYL VA NEGA CHIZMALAR SHU YERDA. LMS darsni bitta avtonom .jsx
// sifatida qabul qiladi: lokal import yo'q. Kub va yoyilma chizmasi shu faylda
// yoziladi. CLAUDE.md §5 nusxa taqiqiga zid emas — LMS kontrakti majbur qiladi.
//
// DIZAYN: Dars01Practice.jsx. RUS TILIDA MUROJAAT — «ты».
//
// CHIZMA QOIDASI. Kubning orqa qirralari PUNKTIR bilan chiziladi: ko'rinadigan
// yoqlar uchta, jami esa oltita. Shundan 03-topshiriqdagi «faqat ko'rinadigan
// yoqlarni sanash» xatosi chizmadan ko'rinadi. 04 va 06 topshiriqlarida
// yoyilma haqiqiy joylashuvda chiziladi: 04 da yettita kvadrat, 06 da esa
// oltita, lekin ikkitasi ustma-ust tushgan.
//
// 6, 12 va 8 sonlari qaytadan uchraydi — bu misol emas, kubning o'zgarmas
// xossasi. 10-topshiriqning ma'nosi ham shunda: shakl boshqa, sanoq bir xil.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { PRACTICE_FIX_CSS } from './grade4PracticeFixStyles.js';

const T = {
  bg: '#F5F5F0',
  paper: '#FFFFFF',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
};

const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');
const tx = (value, lang) => (
  value && typeof value === 'object' && !Array.isArray(value) ? value[lang] ?? '' : value
);

const UI = {
  title: b(
    'Урок 40. Практика: пространственные фигуры и развёртки',
    '40-dars. Amaliyot: fazoviy shakllar va yoyilmalar',
    'Lesson 40. Practice: solids and their nets',
  ),
  language: b('Язык', 'Til', 'Language'),
  task: b('Задание', 'Topshiriq', 'Task'),
  level: {
    green: b('Базовое', 'Asosiy', 'Core'),
    yellow: b('Применение', "Qo'llash", 'Application'),
    red: b('Перенос', "Ko'chirish", 'Transfer'),
  },
  check: b('Проверить', 'Tekshirish', 'Check'),
  retry: b('Исправить ответ', 'Javobni tuzatish', 'Correct the answer'),
  next: b('Следующее', 'Keyingisi', 'Next'),
  finish: b('Завершить', 'Yakunlash', 'Finish'),
  again: b('Пройти заново', 'Qaytadan ishlash', 'Try again'),
  done: b('Практика пройдена', 'Amaliyot tugadi', 'Practice complete'),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", 'correct on the first check'),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', 'All 10 tasks have been solved.'),
  rule: b('Запомни', 'Eslab qoling', 'Remember'),
  typeAnswer: b('Наберите числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Стереть', "O'chirish", 'Delete'),
  matchHint: b(
    'Нажми карточку слева, потом её пару справа.',
    "Chapdagi kartani bosing, keyin uning juftini o'ngdan tanlang.",
    'Tap a card on the left, then its match on the right.',
  ),
  orderHint: b(
    'Нажми место, потом карточку шага.',
    'Avval joyni, keyin qadam kartasini bosing.',
    'Tap a position, then a step card.',
  ),
  sortHint: b(
    'Нажми утверждение, потом его ящик.',
    'Gapni bosing, keyin uning qutisini bosing.',
    'Tap a statement, then its box.',
  ),
  constructHint: b(
    'Нажимай карточки по порядку. Нажми занятое место, чтобы освободить его.',
    'Kartalarni tartib bilan bosing. Bo\'shatish uchun band joyni bosing.',
    'Tap the cards in order. Tap a filled place to clear it.',
  ),
  emptyPlace: b('пусто', "bo'sh", 'empty'),
  returnCard: b('Вернуть', 'Qaytarish', 'Return'),
};

const LESSON_META = {
  lessonId: 'num-4-40-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 40,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'record-build', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'step-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const PART_NAMES = {
  face: b('грань', 'yoq', 'a face'),
  edge: b('ребро', 'qirra', 'an edge'),
  vertex: b('вершина', 'uch', 'a vertex'),
};

const TASKS = [
  {
    id: '01', level: 'green', kind: 'match', skillTag: 'face_edge_vertex',
    visual: { type: 'cube', highlight: 'all' },
    setup: b(
      'В макетной мастерской три части пространственной фигуры называют по-разному.',
      'Maket ustaxonasida fazoviy jismning uch qismi turlicha nomlanadi.',
      'In the model workshop the three parts of a solid have different names.',
    ),
    prompt: b(
      'Соедини описание с названием части.',
      'Tavsifni qism nomi bilan birlashtiring.',
      'Match each description with the name of the part.',
    ),
    pairs: [
      {
        id: 'flat', left: b('плоская поверхность', 'tekis yuza', 'a flat surface'),
        correctRight: 'face',
      },
      {
        id: 'line', left: b('линия, где встретились две грани', 'ikki yoq kesishgan chiziq', 'the line where two faces meet'),
        correctRight: 'edge',
      },
      {
        id: 'point', left: b('точка, где встретились три ребра', 'uchta qirra uchrashgan nuqta', 'the point where three edges meet'),
        correctRight: 'vertex',
      },
    ],
    right: [
      { id: 'face', text: PART_NAMES.face },
      { id: 'edge', text: PART_NAMES.edge },
      { id: 'vertex', text: PART_NAMES.vertex },
    ],
    wrong: [b(
      'Различай по размерности: поверхность, линия или точка.',
      "O'lchamiga qarab farqlang: yuza, chiziq yoki nuqta.",
      'Tell them apart by what they are: a surface, a line or a point.',
    )],
    secondHint: b(
      'Поверхность можно закрасить, линию можно провести, точку только поставить.',
      "Yuzani bo'yash mumkin, chiziqni o'tkazish mumkin, nuqtani esa faqat qo'yish.",
      'A surface can be coloured, a line can be drawn, a point can only be marked.',
    ),
    thirdHint: b(
      'Грань — поверхность, ребро — линия, вершина — точка.',
      'Yoq — yuza, qirra — chiziq, uch — nuqta.',
      'A face is a surface, an edge is a line, a vertex is a point.',
    ),
    correctText: b(
      'Верно. Три части — это поверхность, линия и точка.',
      "To'g'ri. Uch qism — yuza, chiziq va nuqta.",
      'Correct. The three parts are a surface, a line and a point.',
    ),
    rule: b(
      'Грань, ребро и вершина — это разные части одной фигуры.',
      'Yoq, qirra va uch — bitta jismning turli qismlari.',
      'A face, an edge and a vertex are different parts of the same solid.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'missing', skillTag: 'count_faces',
    answer: '6', maxLen: 2,
    visual: { type: 'cube', highlight: 'faces' },
    setup: b(
      'На чертеже куба задние рёбра показаны пунктиром: три грани видны, остальные спрятаны.',
      "Kub chizmasida orqa qirralar punktir bilan ko'rsatilgan: uchta yoq ko'rinadi, qolganlari yashiringan.",
      'On the drawing of the cube the back edges are dashed: three faces are visible and the rest are hidden.',
    ),
    prompt: b(
      'Сколько всего граней у куба?',
      'Kubda jami nechta yoq bor?',
      'How many faces does a cube have in total?',
    ),
    wrongAnswers: {
      3: b(
        'Это только видимые грани. Спрятанные тоже считают.',
        "Bu faqat ko'rinadigan yoqlar. Yashiringanlari ham sanaladi.",
        'Those are only the visible faces. The hidden ones count too.',
      ),
      8: b(
        'Восемь — это число вершин, а не граней.',
        'Sakkiz — bu uchlar soni, yoqlar soni emas.',
        'Eight is the number of vertices, not faces.',
      ),
      12: b(
        'Двенадцать — это число рёбер.',
        "O'n ikki — bu qirralar soni.",
        'Twelve is the number of edges.',
      ),
    },
    wrong: [b(
      'Посчитай грани парами: верх и низ, левая и правая, передняя и задняя.',
      "Yoqlarni juft-juft sanang: tepa va past, chap va o'ng, old va orqa.",
      'Count the faces in pairs: top and bottom, left and right, front and back.',
    )],
    secondHint: b(
      'У каждой видимой грани есть спрятанная напротив.',
      "Har ko'rinadigan yoqning qarshisida yashiringani bor.",
      'Each visible face has a hidden one opposite it.',
    ),
    thirdHint: b(
      'Три пары граней дают 3 умножить на 2.',
      "Uchta yoq jufti 3 ni 2 ga ko'paytirishni beradi.",
      'Three pairs of faces give 3 times 2.',
    ),
    correctText: b(
      'Верно. У куба 6 граней: три видимые и три спрятанные.',
      "To'g'ri. Kubda 6 yoq bor: uchtasi ko'rinadi, uchtasi yashiringan.",
      'Correct. A cube has 6 faces: three visible and three hidden.',
    ),
    rule: b(
      'Считают все части, а не только те, что видно.',
      "Barcha qismlar sanaladi, faqat ko'rinadiganlari emas.",
      'Count every part, not only the ones you can see.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'construct', skillTag: 'visible_versus_total',
    slotCount: 2, answer: ['3', '6'],
    cards: [
      { id: 'c3', symbol: '3' },
      { id: 'c6', symbol: '6' },
      { id: 'c9', symbol: '9' },
      { id: 'c12', symbol: '12' },
    ],
    visual: { type: 'cube', highlight: 'faces' },
    setup: b(
      'В журнале макетов две строки: сколько граней видно и сколько их всего.',
      "Maketlar jurnalida ikki qator bor: nechta yoq ko'rinadi va jami nechta.",
      'The model log has two lines: how many faces are visible and how many there are in total.',
    ),
    prompt: b(
      'Собери запись: сначала видимые грани, потом все грани.',
      "Yozuvni yig'ing: avval ko'rinadigan yoqlar, keyin barcha yoqlar.",
      'Build the record: the visible faces first, then all the faces.',
    ),
    wrongBySequence: {
      63: b(
        'Порядок обратный: в первой строке стоит меньшее число.',
        'Tartib teskari: birinchi qatorda kichik son turadi.',
        'The order is reversed: the smaller number goes in the first line.',
      ),
      312: b(
        'Двенадцать — это рёбра, а речь идёт о гранях.',
        "O'n ikki — bu qirralar, gap esa yoqlar haqida.",
        'Twelve is the edges, but the lines are about faces.',
      ),
      69: b(
        'Девять граней у куба не бывает: их ровно шесть.',
        "Kubda to'qqizta yoq bo'lmaydi: ular aynan oltita.",
        'A cube never has nine faces: it has exactly six.',
      ),
    },
    wrong: [b(
      'Видимых частей всегда меньше, чем всех.',
      "Ko'rinadigan qismlar har doim hammasidan kam.",
      'There are always fewer visible parts than parts in total.',
    )],
    secondHint: b(
      'С одной стороны куб показывает ровно половину своих граней.',
      "Kub bir tomondan o'z yoqlarining aynan yarmini ko'rsatadi.",
      'From one side a cube shows exactly half of its faces.',
    ),
    thirdHint: b(
      'Видно 3 грани, всего их 6.',
      "3 yoq ko'rinadi, jami 6 ta.",
      '3 faces are visible and there are 6 in total.',
    ),
    correctText: b(
      'Верно. Видно 3 грани из 6: половина спрятана.',
      "To'g'ri. 6 yoqdan 3 tasi ko'rinadi: yarmi yashiringan.",
      'Correct. 3 of the 6 faces are visible: half of them are hidden.',
    ),
    rule: b(
      'Чертёж показывает не все части, поэтому их считают, а не разглядывают.',
      'Chizma barcha qismlarni ko\'rsatmaydi, shuning uchun ular sanaladi, ko\'zdan kechirilmaydi.',
      'A drawing does not show every part, so the parts are counted rather than looked at.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'count_net_squares',
    answer: '7', maxLen: 2,
    visual: { type: 'net', squares: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [2, 2]] },
    setup: b(
      'Из бумаги вырезали заготовку для куба.',
      "Qog'ozdan kub uchun zagotovka qirqildi.",
      'A blank for a cube was cut out of paper.',
    ),
    prompt: b(
      'Сколько квадратов в этой заготовке?',
      'Bu zagotovkada nechta kvadrat bor?',
      'How many squares are in this blank?',
    ),
    wrongAnswers: {
      6: b(
        'Шесть нужно кубу, но здесь квадратов другое число. Посчитай их по чертежу.',
        "Kubga oltita kerak, lekin bu yerda kvadratlar soni boshqa. Ularni chizmadan sanang.",
        'Six is what a cube needs, but this blank has a different number. Count them on the drawing.',
      ),
      5: b(
        'Проверь верхний и нижний ряды: там тоже есть квадраты.',
        'Yuqori va pastki qatorlarni tekshiring: ularda ham kvadrat bor.',
        'Check the top and bottom rows: there are squares there too.',
      ),
      8: b(
        'Посчитай ещё раз по рядам, не считая один квадрат дважды.',
        'Qatorlar bo\'yicha yana sanang, bitta kvadratni ikki marta sanamang.',
        'Count row by row again, without counting one square twice.',
      ),
    },
    wrong: [b(
      'Считай по рядам: верхний, средний, нижний.',
      "Qatorlar bo'yicha sanang: yuqori, o'rta, pastki.",
      'Count row by row: the top, the middle and the bottom.',
    )],
    secondHint: b(
      'В среднем ряду квадратов больше всего.',
      "O'rta qatorda kvadratlar eng ko'p.",
      'The middle row has the most squares.',
    ),
    thirdHint: b(
      'Один сверху, четыре в середине, два снизу.',
      "Bittasi tepada, to'rttasi o'rtada, ikkitasi pastda.",
      'One on top, four in the middle, two at the bottom.',
    ),
    correctText: b(
      'Верно. В заготовке 7 квадратов, а кубу нужно ровно 6.',
      "To'g'ri. Zagotovkada 7 kvadrat bor, kubga esa aynan 6 kerak.",
      'Correct. The blank has 7 squares, but a cube needs exactly 6.',
    ),
    rule: b(
      'Развёртка куба состоит ровно из шести квадратов.',
      "Kub yoyilmasi aynan oltita kvadratdan iborat.",
      'The net of a cube consists of exactly six squares.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'mc', skillTag: 'missing_word',
    visual: { type: 'record-plate', text: b('12 = ?', '12 = ?', '12 = ?') },
    setup: b(
      'В протоколе пропало слово: «У куба 12 …».',
      "Bayonnomada so'z tushib qolgan: «Kubda 12 ta …».",
      'A word is missing from the protocol: a cube has 12 …',
    ),
    prompt: b(
      'Какое слово пропущено?',
      'Qaysi so\'z tushib qolgan?',
      'Which word is missing?',
    ),
    options: [
      option('edges', 'рёбер', 'qirra', 'edges', true),
      option('faces', 'граней', 'yoq', 'faces', false,
        'Граней у куба шесть, а не двенадцать.',
        'Kubning yoqlari oltita, o\'n ikkita emas.',
        'A cube has six faces, not twelve.'),
      option('vertices', 'вершин', 'uch', 'vertices', false,
        'Вершин у куба восемь.',
        'Kubning uchlari sakkizta.',
        'A cube has eight vertices.'),
      option('sides', 'сторон', 'tomon', 'sides', false,
        'Сторона — это часть плоской фигуры, а у пространственной есть рёбра.',
        'Tomon — tekis figuraning qismi, fazoviy jismda esa qirralar bor.',
        'A side belongs to a flat figure, while a solid has edges.'),
    ],
    secondHint: b(
      'Вспомни три числа куба: 6, 12 и 8.',
      "Kubning uch sonini eslang: 6, 12 va 8.",
      'Recall the three numbers of a cube: 6, 12 and 8.',
    ),
    thirdHint: b(
      '6 — грани, 12 — рёбра, 8 — вершины.',
      '6 — yoqlar, 12 — qirralar, 8 — uchlar.',
      '6 is faces, 12 is edges, 8 is vertices.',
    ),
    correctText: b(
      'Верно. У куба 12 рёбер.',
      "To'g'ri. Kubda 12 qirra bor.",
      'Correct. A cube has 12 edges.',
    ),
    rule: b(
      'Каждое из трёх чисел куба относится к своей части.',
      'Kubning uch sonidan har biri o\'z qismiga tegishli.',
      'Each of the three numbers of a cube belongs to its own part.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'missing', skillTag: 'gift_box_net',
    visual: { type: 'net', squares: [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 0]], overlap: true },
    setup: b(
      'Для подарочной коробки вырезали шесть квадратов, но два из них легли на одно место, и коробка не собралась.',
      "Sovg'a qutisi uchun oltita kvadrat qirqildi, lekin ikkitasi bir joyga tushdi va quti yig'ilmadi.",
      'Six squares were cut for a gift box, but two of them ended up in the same place and the box did not close.',
    ),
    prompt: b(
      'Что нужно сделать?',
      'Nima qilish kerak?',
      'What has to be done?',
    ),
    options: [
      option('move', 'изменить расположение квадратов', 'kvadratlarning joylashuvini o\'zgartirish', 'change where the squares are placed', true),
      option('add', 'добавить седьмой квадрат', 'yettinchi kvadrat qo\'shish', 'add a seventh square', false,
        'Седьмой квадрат лишний: кубу нужно ровно шесть.',
        "Yettinchi kvadrat ortiqcha: kubga aynan oltita kerak.",
        'A seventh square is one too many: a cube needs exactly six.'),
      option('remove', 'убрать один квадрат', 'bitta kvadratni olib tashlash', 'remove one square', false,
        'Тогда останется пять, и одна грань будет открыта.',
        "Unda beshta qoladi va bitta yoq ochiq bo'ladi.",
        'Then five would be left and one face would stay open.'),
      option('nothing', 'ничего, шести квадратов достаточно', "hech narsa, oltita kvadrat yetadi", 'nothing, six squares are enough', false,
        'Числа мало: важно ещё, как квадраты расположены.',
        "Son yetarli emas: kvadratlar qanday joylashgani ham muhim.",
        'The number alone is not enough: how the squares are arranged also matters.'),
    ],
    secondHint: b(
      'Квадратов ровно шесть, значит дело не в их числе.',
      'Kvadratlar aynan oltita, demak gap ularning sonida emas.',
      'There are exactly six squares, so the number is not the problem.',
    ),
    thirdHint: b(
      'При сгибании два квадрата накрыли одну и ту же грань.',
      'Buklaganda ikki kvadrat bitta yoqni qopladi.',
      'When folded, two squares covered the same face.',
    ),
    correctText: b(
      'Верно. Шести квадратов мало: их нужно расположить так, чтобы каждый закрыл свою грань.',
      "To'g'ri. Oltita kvadrat yetarli emas: har biri o'z yog'ini yopadigan qilib joylashtirish kerak.",
      'Correct. Six squares are not enough on their own: each must be placed to cover its own face.',
    ),
    rule: b(
      'Развёртка годится, когда верны и число квадратов, и их расположение.',
      "Yoyilma kvadratlar soni ham, joylashuvi ham to'g'ri bo'lganda yaroqli.",
      'A net works when both the number of squares and their arrangement are right.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'fold_order',
    visual: { type: 'net', squares: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]] },
    setup: b(
      'Развёртку проверяют мысленным сгибанием, не разрезая бумагу.',
      "Yoyilma qog'ozni qirqmasdan, xayolda buklab tekshiriladi.",
      'A net is checked by folding it in the mind, without cutting the paper.',
    ),
    prompt: b(
      'Расставь шаги проверки по порядку.',
      'Tekshiruv qadamlarini tartib bilan joylashtiring.',
      'Put the checking steps in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'base', text: b('Выбираем основание', 'Asosni tanlaymiz', 'Choose the base'), order: 0 },
      { id: 'walls', text: b('Поднимаем боковые квадраты', 'Yon kvadratlarni ko\'taramiz', 'Raise the side squares'), order: 1 },
      { id: 'lid', text: b('Закрываем крышку', 'Qopqoqni yopamiz', 'Close the lid'), order: 2 },
      { id: 'check', text: b('Проверяем, нет ли пустого места', "Bo'sh joy yo'qligini tekshiramiz", 'Check that no gap is left'), order: 3 },
    ],
    wrong: [b(
      'Сгибание начинается с основания, а заканчивается проверкой.',
      'Buklash asosdan boshlanadi va tekshiruv bilan tugaydi.',
      'Folding starts from the base and ends with a check.',
    )],
    secondHint: b(
      'Без основания непонятно, куда поднимать стенки.',
      "Asossiz devorlarni qayerga ko'tarish noma'lum.",
      'Without a base it is unclear where to raise the walls.',
    ),
    thirdHint: b(
      'Основание, стенки, крышка, проверка.',
      'Asos, devorlar, qopqoq, tekshiruv.',
      'Base, walls, lid, check.',
    ),
    correctText: b(
      'Верно. Проверка на пустое место стоит последней.',
      "To'g'ri. Bo'sh joy tekshiruvi oxirida turadi.",
      'Correct. The check for a gap comes last.',
    ),
    rule: b(
      'Развёртку проверяют сгибанием, а не только счётом квадратов.',
      'Yoyilma buklash bilan tekshiriladi, faqat kvadratlarni sanash bilan emas.',
      'A net is checked by folding, not only by counting squares.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'cube_versus_box',
    visual: { type: 'solid-pair' },
    setup: b(
      'В мастерской обсуждают, какое из тел является кубом.',
      'Ustaxonada qaysi jism kub ekani muhokama qilinadi.',
      'The workshop is discussing which of the solids is a cube.',
    ),
    prompt: b(
      'Какое тело — куб?',
      'Qaysi jism kub?',
      'Which solid is a cube?',
    ),
    options: [
      option('all-equal', 'рёбра 4 см, 4 см и 4 см', 'qirralari 4 cm, 4 cm va 4 cm', 'edges of 4 cm, 4 cm and 4 cm', true),
      option('two-equal', 'рёбра 4 см, 4 см и 9 см', 'qirralari 4 cm, 4 cm va 9 cm', 'edges of 4 cm, 4 cm and 9 cm', false,
        'Третье ребро другое, значит это коробка, а не куб.',
        "Uchinchi qirra boshqa, demak bu quti, kub emas.",
        'The third edge is different, so this is a box, not a cube.'),
      option('six-faces', 'любое тело с шестью гранями', 'oltita yoqi bor har qanday jism', 'any solid with six faces', false,
        'Шесть граней есть и у коробки: этого признака мало.',
        "Oltita yoq qutida ham bor: bu belgi yetarli emas.",
        'A box also has six faces: that feature is not enough.'),
      option('square-base', 'любое тело с квадратным основанием', 'asosi kvadrat bo\'lgan har qanday jism', 'any solid with a square base', false,
        'Основание может быть квадратным, а высота другой.',
        "Asos kvadrat bo'lishi mumkin, balandlik esa boshqa.",
        'The base may be square while the height is different.'),
    ],
    secondHint: b(
      'У куба все рёбра одинаковой длины.',
      'Kubning barcha qirralari bir xil uzunlikda.',
      'All the edges of a cube are the same length.',
    ),
    thirdHint: b(
      'Куб и коробка имеют по 6 граней, но у куба все рёбра равны.',
      "Kub va qutining har birida 6 yoq bor, lekin kubning barcha qirralari teng.",
      'A cube and a box each have 6 faces, but only a cube has all its edges equal.',
    ),
    correctText: b(
      'Верно. Куб — это тело, у которого все рёбра равны.',
      "To'g'ri. Kub — barcha qirralari teng bo'lgan jism.",
      'Correct. A cube is a solid with all its edges equal.',
    ),
    rule: b(
      'Число граней у куба и коробки одинаковое, различают их рёбра.',
      'Kub va qutining yoqlari soni bir xil, ularni qirralar farqlaydi.',
      'A cube and a box have the same number of faces; their edges tell them apart.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'sort', skillTag: 'sort_the_claims',
    visual: { type: 'claim-cards', count: 4 },
    setup: b(
      'В мастерской записали четыре утверждения. Не все они верны.',
      "Ustaxonada to'rtta gap yozildi. Ularning hammasi to'g'ri emas.",
      'Four statements were written down in the workshop. Not all of them are true.',
    ),
    prompt: b(
      'Разложи утверждения по ящикам.',
      'Gaplarni qutilarga joylashtiring.',
      'Sort the statements into the boxes.',
    ),
    bins: [
      { id: 'true', label: b('верно', "to'g'ri", 'true') },
      { id: 'false', label: b('неверно', 'xato', 'false') },
    ],
    items: [
      {
        id: 'v8',
        text: b('у куба 8 вершин', 'kubda 8 uch bor', 'a cube has 8 vertices'),
        bin: 'true',
        wrong: b(
          'Проверь три числа куба: 6, 12 и 8. Какой части отвечает восемь?',
          "Kubning uch sonini tekshiring: 6, 12 va 8. Sakkiz qaysi qismga javob beradi?",
          'Check the three numbers of a cube: 6, 12 and 8. Which part does eight answer for?',
        ),
      },
      {
        id: 'flat-solid',
        text: b('квадрат — пространственное тело', 'kvadrat — fazoviy jism', 'a square is a solid'),
        bin: 'false',
        wrong: b(
          'Квадрат лежит на плоскости: у него нет ни граней, ни вершин в пространстве.',
          "Kvadrat tekislikda yotadi: unda na yoq, na fazodagi uch bor.",
          'A square lies in a plane: it has neither faces nor vertices in space.',
        ),
      },
      {
        id: 'six-enough',
        text: b('шесть квадратов — уже развёртка', "oltita kvadrat — allaqachon yoyilma", 'six squares already make a net'),
        bin: 'false',
        wrong: b(
          'Вспомни подарочную коробку: квадратов было шесть, а коробка не собралась.',
          "Sovg'a qutisini eslang: kvadrat oltita edi, quti esa yig'ilmadi.",
          'Recall the gift box: there were six squares, but the box did not close.',
        ),
      },
      {
        id: 'edge-line',
        text: b('ребро — линия двух граней', 'qirra — ikki yoq chizig\'i', 'an edge is the line of two faces'),
        bin: 'true',
        wrong: b(
          'Посмотри, чем ребро отличается от грани и от вершины.',
          'Qirra yoqdan va uchdan nimasi bilan farq qilishiga qarang.',
          'Look at how an edge differs from a face and from a vertex.',
        ),
      },
    ],
    wrong: [b(
      'Проверяй каждое утверждение по трём числам куба и по правилу развёртки.',
      "Har gapni kubning uch soni va yoyilma qoidasi bo'yicha tekshiring.",
      'Check each statement against the three numbers of a cube and the rule for nets.',
    )],
    secondHint: b(
      'Два утверждения про числа куба верны, два — про фигуру и развёртку — нет.',
      "Kubning sonlari haqidagi ikki gap to'g'ri, figura va yoyilma haqidagi ikkitasi esa xato.",
      'The two statements about the numbers of a cube are true; the two about the figure and the net are not.',
    ),
    thirdHint: b(
      'У куба 8 вершин и 12 рёбер; квадрат не пространственное тело; шести квадратов мало.',
      "Kubda 8 uch va 12 qirra bor; kvadrat fazoviy jism emas; oltita kvadrat yetarli emas.",
      'A cube has 8 vertices and 12 edges; a square is not a solid; six squares are not enough.',
    ),
    correctText: b(
      'Верно. Числа куба верны, а два других утверждения — нет.',
      "To'g'ri. Kubning sonlari to'g'ri, boshqa ikki gap esa xato.",
      'Correct. The numbers of a cube are right, and the other two statements are not.',
    ),
    rule: b(
      'Каждое утверждение проверяют признаком, а не тем, что оно похоже на правду.',
      'Har gap belgi bilan tekshiriladi, rostga o\'xshaganiga qarab emas.',
      'Each statement is checked against a feature, not against how true it sounds.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'construct', skillTag: 'box_counts_transfer',
    slotCount: 3, answer: ['6', '12', '8'],
    cards: [
      { id: 'b6', symbol: '6' },
      { id: 'b12', symbol: '12' },
      { id: 'b8', symbol: '8' },
      { id: 'b4', symbol: '4' },
    ],
    visual: { type: 'record-plate', text: b('? · ? · ?', '? · ? · ?', '? · ? · ?') },
    setup: b(
      'Новый заказ: спичечная коробка. Это не куб — её рёбра разной длины. Чертежа нет.',
      "Yangi buyurtma: gugurt qutisi. Bu kub emas — uning qirralari har xil uzunlikda. Chizma yo'q.",
      'A new order: a matchbox. It is not a cube — its edges have different lengths. There is no drawing.',
    ),
    prompt: b(
      'Собери запись: грани, рёбра, вершины.',
      "Yozuvni yig'ing: yoqlar, qirralar, uchlar.",
      'Build the record: faces, edges, vertices.',
    ),
    wrongBySequence: {
      '6812': b(
        'Порядок другой: рёбер больше, чем вершин.',
        "Tartib boshqa: qirralar uchlardan ko'p.",
        'The order is different: there are more edges than vertices.',
      ),
      '1268': b(
        'Первым идёт число граней, а не рёбер.',
        'Birinchi bo\'lib yoqlar soni turadi, qirralar emas.',
        'The number of faces comes first, not the edges.',
      ),
      '6124': b(
        'Четыре — это число вершин одной грани, а не всего тела.',
        "To'rt — bu bitta yoqning uchlari soni, butun jismning emas.",
        'Four is the number of vertices of one face, not of the whole solid.',
      ),
      '4126': b(
        'Начни с граней: их у коробки столько же, сколько у куба.',
        'Yoqlardan boshlang: qutida ular kubdagidek.',
        'Start with the faces: a box has as many as a cube.',
      ),
    },
    wrong: [b(
      'Форма изменилась, но части остались те же: грани, рёбра, вершины.',
      "Shakl o'zgardi, lekin qismlar o'sha: yoqlar, qirralar, uchlar.",
      'The shape has changed, but the parts are the same: faces, edges, vertices.',
    )],
    secondHint: b(
      'Коробка тоже собирается из шести прямоугольных граней.',
      "Quti ham oltita to'g'ri to'rtburchak yoqdan yig'iladi.",
      'A box is also made from six rectangular faces.',
    ),
    thirdHint: b(
      'У коробки те же числа, что у куба: 6, 12 и 8.',
      "Qutida kubdagi sonlar: 6, 12 va 8.",
      'A box has the same numbers as a cube: 6, 12 and 8.',
    ),
    correctText: b(
      'Верно. У коробки 6 граней, 12 рёбер и 8 вершин — как у куба.',
      "To'g'ri. Qutida 6 yoq, 12 qirra va 8 uch bor — kubdagidek.",
      'Correct. A box has 6 faces, 12 edges and 8 vertices, just like a cube.',
    ),
    rule: b(
      'Длины рёбер разные, а числа частей у куба и коробки одинаковые.',
      'Qirralar uzunligi har xil, kub va qutining qismlari soni esa bir xil.',
      'The edge lengths differ, but a cube and a box have the same counts of parts.',
    ),
  },
];

const adaptive = (task, pickedOption, typed, itemWrong, sequenceWrong, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  if (pickedOption?.wrong) return pickedOption.wrong;
  if (typed && task.wrongAnswers?.[typed]) return task.wrongAnswers[typed];
  if (sequenceWrong) return sequenceWrong;
  if (itemWrong) return itemWrong;
  return task.wrong?.[0] || task.secondHint;
};

// ---------------------------------------------------------------------------
// CHIZMALAR. Kub izometriyada: orqa qirralar punktir, ya'ni uchta yoq ko'rinadi
// va uchtasi yashiringan. Yoyilma kataklar to'ridan yasaladi, shuning uchun
// kvadratlar soni va joylashuvi ma'lumotdan chiqadi.
// ---------------------------------------------------------------------------
function CubeSvg({ highlight }) {
  const showFaces = highlight === 'faces' || highlight === 'all';
  return (
    <svg className="p4-svg p4-svg-narrow" viewBox="0 0 130 124" aria-hidden="true">
      <path d="M22 44 H86 V108 H22 Z" fill={showFaces ? T.cyanSoft : 'none'} stroke={T.cyan} strokeWidth="2" />
      <path d="M22 44 L46 22 H110 L86 44" fill={showFaces ? '#EFF7F8' : 'none'} stroke={T.cyan} strokeWidth="2" />
      <path d="M86 44 L110 22 V86 L86 108" fill={showFaces ? '#E3F1F3' : 'none'} stroke={T.cyan} strokeWidth="2" />
      <path d="M46 22 V86 H110" fill="none" stroke={T.ink3} strokeWidth="1.4" strokeDasharray="4 4" />
      <path d="M46 86 L22 108" fill="none" stroke={T.ink3} strokeWidth="1.4" strokeDasharray="4 4" />
      {highlight === 'all' && (
        <g>
          <circle cx="110" cy="22" r="4" fill={T.accent} />
          <path d="M22 44 H86" stroke={T.accent} strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}

function NetSvg({ squares, overlap }) {
  const size = 26;
  const cols = Math.max(...squares.map(([x]) => x)) + 1;
  const rows = Math.max(...squares.map(([, y]) => y)) + 1;
  const seen = new Set();
  return (
    <svg className="p4-svg" viewBox={`0 0 ${cols * size + 16} ${rows * size + 16}`} aria-hidden="true">
      {squares.map(([x, y], index) => {
        const key = `${x}-${y}`;
        const duplicate = seen.has(key);
        seen.add(key);
        return (
          <rect key={index} x={8 + x * size + (duplicate ? 5 : 0)} y={8 + y * size + (duplicate ? 5 : 0)}
            width={size - 2} height={size - 2} rx="2"
            fill={duplicate ? T.warnSoft : T.cyanSoft}
            stroke={duplicate ? T.warn : T.cyan} strokeWidth={duplicate ? 2.2 : 1.6}
            strokeDasharray={duplicate ? '4 3' : undefined} />
        );
      })}
      {overlap && <text x={8} y={rows * size + 14} className="p4-net-note">!</text>}
    </svg>
  );
}

function Visual({ task, lang }) {
  const visual = task.visual;
  if (!visual) return null;

  if (visual.type === 'cube') {
    return <div className="p4-visual"><CubeSvg highlight={visual.highlight} /></div>;
  }

  if (visual.type === 'net') {
    return <div className="p4-visual"><NetSvg squares={visual.squares} overlap={visual.overlap} /></div>;
  }

  if (visual.type === 'record-plate') {
    return <div className="p4-visual"><strong>{tx(visual.text, lang)}</strong></div>;
  }

  if (visual.type === 'solid-pair') {
    return (
      <div className="p4-visual p4-visual-row">
        <CubeSvg highlight="faces" />
        <svg className="p4-svg p4-svg-narrow" viewBox="0 0 150 124" aria-hidden="true">
          <path d="M18 56 H118 V104 H18 Z" fill="#EFF7F8" stroke={T.cyan} strokeWidth="2" />
          <path d="M18 56 L40 34 H140 L118 56" fill={T.paper} stroke={T.cyan} strokeWidth="2" />
          <path d="M118 56 L140 34 V82 L118 104" fill="#E3F1F3" stroke={T.cyan} strokeWidth="2" />
        </svg>
      </div>
    );
  }

  if (visual.type === 'claim-cards') {
    return (
      <div className="p4-visual p4-visual-row">
        {Array.from({ length: visual.count }, (_, index) => (
          <span className="p4-claim" key={index} style={{ animationDelay: `${index * 70}ms` }}>{index + 1}</span>
        ))}
      </div>
    );
  }

  return null;
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return (
    <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
      <output className="p4-pad-display">{value || '—'}</output>
      <div className="p4-pad-keys">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button type="button" key={digit} disabled={disabled}
            onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>
            {digit}
          </button>
        ))}
        <button type="button" className="p4-key-del is-delete" disabled={disabled}
          aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>
          ⌫
        </button>
      </div>
    </div>
  );
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return (
    <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
      <p>{tx(text, lang)}</p>
      {ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
    </div>
  );
}

function Task({ task, lang, isLast, onSolved, shuffleSeed }) {
  const [pickedId, setPickedId] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [built, setBuilt] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const options = useMemo(() => shuffle(task.options || []), [shuffleSeed, task.id, task.options, wrongRound]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const rightCards = useMemo(() => shuffle(task.right || []), [shuffleSeed, task.id, task.right]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const bankCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const sortItems = useMemo(() => shuffle(task.items || []), [shuffleSeed, task.id, task.items]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const symbolOf = (cardId) => task.cards?.find((card) => card.id === cardId)?.symbol;
  const builtSequence = built.map(symbolOf).join('');

  const answerReady = (() => {
    if (task.options) return pickedId !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed.length > 0;
    if (task.kind === 'construct') return built.length === task.slotCount;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'sort') return task.items.every((item) => assignments[item.id]);
    return task.steps.every((step) => placed[step.id]);
  })();

  const answerCorrect = () => {
    if (task.options) return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'construct') return built.map(symbolOf).join('|') === task.answer.join('|');
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'sort') return task.items.every((item) => assignments[item.id] === item.bin);
    return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
  };

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false);
    setPickedId(null);
    setTyped('');
    setPairs({});
    setActiveLeft(null);
    setPlaced({});
    setActiveCell(null);
    setAssignments({});
    setActiveItem(null);
    setBuilt([]);
  };

  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    setAttempts((old) => old + 1);
    setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };

  const placeCard = (cardId) => {
    if (solved || activeCell === null) return;
    checkingRef.current = false;
    setPlaced((old) => {
      const next = { ...old };
      Object.keys(next).forEach((key) => { if (next[key] === cardId) delete next[key]; });
      next[activeCell] = cardId;
      return next;
    });
    setActiveCell(null);
    setChecked(false);
  };

  const pickedOption = task.options ? task.options.find((item) => item.id === pickedId) : null;
  const firstWrongItem = task.kind === 'sort'
    ? task.items.find((item) => assignments[item.id] && assignments[item.id] !== item.bin)
    : null;
  const sequenceWrong = task.kind === 'construct' ? task.wrongBySequence?.[builtSequence] : null;
  const cardText = (cardId) => tx(task.cards?.find((card) => card.id === cardId)?.text, lang);

  const studentAnswer = (() => {
    if (task.options) return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'construct') return { sequence: built.map(symbolOf) };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'sort') return { bins: assignments };
    return { order: task.steps.map((step) => placed[step.id]) };
  })();

  const correctAnswer = (() => {
    if (task.options) {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: task.answer };
    if (task.kind === 'construct') return { sequence: task.answer };
    if (task.kind === 'match') {
      return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    }
    if (task.kind === 'sort') {
      return { bins: Object.fromEntries(task.items.map((item) => [item.id, item.bin])) };
    }
    return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
  })();

  const optionClass = (item) => {
    if (pickedId !== item.id) return '';
    if (!checked) return 'is-on';
    return item.correct ? 'is-ok' : 'is-no';
  };

  const unassigned = sortItems.filter((item) => !assignments[item.id]);

  return (
    <section className="p4-task" aria-labelledby={`task-${task.id}`}>
      <p className={`p4-eyebrow is-${task.level}`}>
        <span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}
      </p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      <h2 id={`task-${task.id}`}>{tx(task.prompt, lang)}</h2>
      <Visual task={task} lang={lang} />

      {task.options && (
        <div className={task.kind === 'missing' ? 'p4-missing p4-options' : 'p4-options'}>
          {options.map((item, index) => (
            <button type="button" key={item.id} className={`p4-option ${optionClass(item)}`}
              disabled={solved} aria-pressed={pickedId === item.id}
              onClick={() => { checkingRef.current = false; setPickedId(item.id); setChecked(false); }}>
              <span className="p4-letter">{'ABCD'[index]}</span>
              {tx(item.text, lang)}
            </button>
          ))}
        </div>
      )}

      {(task.kind === 'numpad' || task.kind === 'missing') && !task.options && (
        <NumPad value={typed} max={task.maxLen} disabled={solved} lang={lang}
          onChange={(value) => { checkingRef.current = false; setTyped(value); setChecked(false); }} />
      )}

      {task.kind === 'construct' && (
        <div className="p4-construct">
          <p className="p4-note">{tx(UI.constructHint, lang)}</p>
          <div className="p4-build-row" role="group" aria-label={tx(task.prompt, lang)}>
            {Array.from({ length: task.slotCount }, (_, index) => {
              const cardId = built[index];
              const state = checked && cardId
                ? (task.answer[index] === symbolOf(cardId) ? 'is-ok' : 'is-no')
                : '';
              return (
                <button type="button" key={index} className={`p4-build-slot ${cardId ? 'is-filled' : ''} ${state}`}
                  disabled={solved || !cardId}
                  aria-label={cardId ? `${index + 1}: ${symbolOf(cardId)}` : `${index + 1}: ${tx(UI.emptyPlace, lang)}`}
                  onClick={() => {
                    checkingRef.current = false;
                    setBuilt((old) => old.filter((_, position) => position !== index));
                    setChecked(false);
                  }}>
                  {cardId ? symbolOf(cardId) : '·'}
                </button>
              );
            })}
          </div>
          <div className="p4-card-bank">
            {bankCards.map((card) => {
              const used = built.includes(card.id);
              return (
                <button type="button" key={card.id} className={`p4-card ${used ? 'is-used' : ''}`}
                  disabled={solved || used || built.length >= task.slotCount}
                  onClick={() => {
                    checkingRef.current = false;
                    setBuilt((old) => (old.length >= task.slotCount ? old : [...old, card.id]));
                    setChecked(false);
                  }}>
                  {card.symbol}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {task.kind === 'match' && (
        <div className="p4-match">
          <p className="p4-note">{tx(UI.matchHint, lang)}</p>
          <div className="p4-match-grid">
            <section className="p4-match-col">
              {task.pairs.map((pair) => (
                <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id}
                  className={`${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`}
                  onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}>
                  {tx(pair.left, lang)}
                  {pairs[pair.id] && (
                    <small>{tx(task.right.find((item) => item.id === pairs[pair.id])?.text, lang)}</small>
                  )}
                </button>
              ))}
            </section>
            <section className="p4-match-col">
              {rightCards.map((item) => {
                const used = Object.values(pairs).includes(item.id);
                return (
                  <button type="button" key={item.id} className={used ? 'is-used' : ''}
                    disabled={solved || activeLeft === null || used}
                    onClick={() => {
                      checkingRef.current = false;
                      setPairs((old) => ({ ...old, [activeLeft]: item.id }));
                      setActiveLeft(null);
                      setChecked(false);
                    }}>
                    {tx(item.text, lang)}
                  </button>
                );
              })}
            </section>
          </div>
        </div>
      )}

      {task.kind === 'order' && (
        <div className="p4-order">
          <p className="p4-note">{tx(UI.orderHint, lang)}</p>
          <div className="p4-order-slots">
            {task.steps.map((step) => (
              <button type="button" key={step.id} disabled={solved} aria-pressed={activeCell === step.id}
                className={activeCell === step.id ? 'is-active' : ''}
                onClick={() => { checkingRef.current = false; setActiveCell(step.id); setChecked(false); }}>
                <small>{tx(step.label, lang)}</small>
                <b>{placed[step.id] ? cardText(placed[step.id]) : '—'}</b>
              </button>
            ))}
          </div>
          <div className="p4-card-bank">
            {bankCards.map((card) => {
              const used = Object.values(placed).includes(card.id);
              return (
                <button type="button" key={card.id} className={`p4-card ${used ? 'is-used' : ''}`}
                  disabled={solved || activeCell === null || used} onClick={() => placeCard(card.id)}>
                  {tx(card.text, lang)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {task.kind === 'sort' && (
        <div className="p4-sort">
          <p className="p4-note">{tx(UI.sortHint, lang)}</p>
          <div className="p4-sort-pool" role="group" aria-label={tx(task.prompt, lang)}>
            {unassigned.map((item) => (
              <button type="button" key={item.id} disabled={solved} aria-pressed={activeItem === item.id}
                className={`p4-sort-token ${activeItem === item.id ? 'is-active' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveItem(item.id); setChecked(false); }}>
                {tx(item.text, lang)}
              </button>
            ))}
            {unassigned.length === 0 && <span className="p4-pool-done" aria-hidden="true">✓</span>}
          </div>
          <div className="p4-sort-bins">
            {task.bins.map((bin) => (
              <div className="p4-sort-bin" key={bin.id}>
                <button type="button" className="p4-sort-bin-head" disabled={solved || activeItem === null}
                  onClick={() => {
                    if (activeItem === null) return;
                    checkingRef.current = false;
                    setAssignments((old) => ({ ...old, [activeItem]: bin.id }));
                    setActiveItem(null);
                    setChecked(false);
                  }}>
                  {tx(bin.label, lang)}
                </button>
                <div className="p4-sort-bin-items">
                  {sortItems.filter((item) => assignments[item.id] === bin.id).map((item) => (
                    <button type="button" key={item.id} disabled={solved}
                      className={`p4-sort-token is-placed ${checked && item.bin !== bin.id ? 'is-no' : ''} ${checked && item.bin === bin.id ? 'is-ok' : ''}`}
                      aria-label={`${tx(UI.returnCard, lang)} ${tx(item.text, lang)}`}
                      onClick={() => {
                        checkingRef.current = false;
                        setAssignments((old) => {
                          const next = { ...old };
                          delete next[item.id];
                          return next;
                        });
                        setChecked(false);
                      }}>
                      {tx(item.text, lang)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {checked && (
        <Feedback feedbackRef={feedbackRef} ok={solved} lang={lang} rule={task.rule}
          text={solved ? task.correctText : adaptive(task, pickedOption, typed, firstWrongItem?.wrong, sequenceWrong, attempts)} />
      )}

      <div className="p4-actions">
        {!checked && !solved && (
          <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>
            {tx(UI.check, lang)}
          </button>
        )}
        {checked && !solved && (
          <button type="button" className="p4-btn p4-btn-ghost is-ghost" onClick={clearResponse}>
            {tx(UI.retry, lang)}
          </button>
        )}
        {solved && (
          <button type="button" className="p4-btn p4-btn-ready is-ready" disabled={advancing}
            onClick={() => {
              if (advancedRef.current) return;
              advancedRef.current = true;
              checkingRef.current = false;
              setAdvancing(true);
              onSolved({
                taskId: task.id,
                taskNumber: Number(task.id),
                level: task.level,
                kind: task.kind,
                skillTag: task.skillTag,
                attempts,
                firstTry: attempts === 1,
                correct: true,
                setup: task.setup,
                prompt: task.prompt,
                studentAnswer,
                correctAnswer,
                answerChoices: task.options
                  ? options.map(({ id, text, correct }) => ({ id, text, correct }))
                  : task.right ?? task.cards ?? task.items ?? null,
                screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id),
              });
            }}>
            {tx(isLast ? UI.finish : UI.next, lang)}
          </button>
        )}
      </div>
    </section>
  );
}

export default function Grade4Dars40Practice({ studentName, lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const [runId, setRunId] = useState(0);
  const finishedRef = useRef(false);
  const startedAtRef = useRef(0);

  useEffect(() => { if (!startedAtRef.current) startedAtRef.current = Date.now(); }, []);

  const task = TASKS[index];
  const total = TASKS.length;
  const percent = Math.round(((finished ? total : index) / total) * 100);

  const onSolved = (record) => {
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTry + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers);
    setFirstTry(nextFirstTry);
    if (index !== total - 1) { setIndex((old) => old + 1); return; }
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    const scorePercent = Math.round((nextFirstTry / total) * 100);
    const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({
      ...result,
      [level]: {
        total: TASKS.filter((item) => item.level === level).length,
        firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length,
      },
    }), {});
    onFinished?.({
      lessonId: LESSON_META.lessonId,
      lessonTitle: tx(LESSON_META.lessonTitle, lang),
      lessonTitleLocalized: LESSON_META.lessonTitle,
      studentName: studentName || null,
      activityType: 'practice',
      completed: true,
      totalQuestions: total,
      answeredQuestions: total,
      correctAnswers: nextFirstTry,
      firstTryCorrect: nextFirstTry,
      scorePercent,
      finalScore: nextFirstTry,
      finalTotal: total,
      passed: nextFirstTry >= 6,
      firstTryStats: { total, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: total, scorePercent },
      attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
      // eslint-disable-next-line react-hooks/purity -- davomiylik amaliyot yakunlanganda olinadi
      durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
      skillTags: [...new Set(TASKS.map((item) => item.skillTag))],
      levelBreakdown,
      lessonMeta: LESSON_META,
      screenMeta: SCREEN_META,
      answers: nextAnswers,
    });
  };

  const restart = () => {
    finishedRef.current = false;
    startedAtRef.current = Date.now();
    setIndex(0);
    setAnswers([]);
    setFirstTry(0);
    setFinished(false);
    setRunId((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES + PRACTICE_FIX_CSS}</style>
      {preview && (
        <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>
          {SUPPORTED_LANGS.map((code) => (
            <button type="button" key={code} aria-pressed={lang === code}
              className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <header>
        <div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)}
          aria-valuemin="0" aria-valuemax={total} aria-valuenow={finished ? total : index}>
          <i style={{ width: `${percent}%` }} />
        </div>
        <div>
          <span className="p4-title">{tx(UI.title, lang)}</span>
          <b className="p4-counter">{finished ? total : index + 1} / {total}</b>
        </div>
      </header>

      <main>
        {finished ? (
          <section className="p4-done" aria-live="polite">
            <h2>{tx(UI.done, lang)}</h2>
            <strong>{firstTry}<small>/ {total}</small></strong>
            <p>{tx(UI.firstTry, lang)}</p>
            <p>{tx(UI.allSolved, lang)}</p>
            <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
          </section>
        ) : (
          <Task key={`${runId}-${task.id}`} task={task} lang={lang} isLast={index === total - 1}
            onSolved={onSolved} shuffleSeed={`${LESSON_META.lessonId}:${runId}`} />
        )}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root { position: relative; min-height: 100dvh; overflow-x: clip; padding: 0 0 24px; background: ${T.bg} !important; color: ${T.ink}; font-family: 'Manrope', system-ui, sans-serif; }
.p4-root *, .p4-root *::before, .p4-root *::after { box-sizing: border-box; }
.p4-root p, .p4-root h2 { margin: 0; }
.p4-root button:focus-visible { outline: 3px solid rgba(22, 143, 163, .45); outline-offset: 3px; }

.p4-lang { position: absolute; top: 8px; right: 8px; z-index: 9; display: flex; gap: 6px; }
.p4-lang button { min-width: 44px; min-height: 44px; padding: 0 10px; border: 0; border-radius: 99px; background: ${T.paper}; color: ${T.ink2}; font: 800 11px 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 4px 12px -8px rgba(23, 59, 82, .4); }
.p4-lang button.is-active { background: ${T.accent}; color: #fff; }

.p4-root > header { padding: 46px clamp(12px, 4vw, 24px) 8px; }
.p4-root > header > div, .p4-root > main { width: min(720px, 100%) !important; margin-inline: auto; }
.p4-progress { height: 6px; border: 0; border-radius: 99px; background: rgba(23, 59, 82, .12); overflow: hidden; }
.p4-progress i { display: block; height: 100%; background: linear-gradient(90deg, ${T.cyan}, ${T.accent}); transition: width .4s ease; }
.p4-root > header > div:last-child { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-top: 8px; }
.p4-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(15px, 2.4vw, 19px); }
.p4-counter { white-space: nowrap; font: 700 13px 'JetBrains Mono', monospace; color: ${T.ink3}; }

.p4-root > main { padding: 4px clamp(12px, 4vw, 24px); }
.p4-task { display: grid; gap: 12px; }
.p4-eyebrow, .p4-eyebrow.is-green, .p4-eyebrow.is-yellow, .p4-eyebrow.is-red { color: ${T.accent}; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.p4-setup { color: ${T.ink2}; font-size: clamp(14px, 2vw, 16px); line-height: 1.5; }
.p4-task h2 { font: 600 clamp(17px, 2.6vw, 21px)/1.25 'Source Serif 4', Georgia, serif; color: ${T.ink}; }
.p4-note { color: ${T.ink3}; font-size: 13px; }

.p4-visual { display: grid; place-items: center; gap: 8px; min-height: 108px; padding: 12px 10px; border-radius: 16px; background: ${T.paper} !important; box-shadow: inset 0 0 0 1px rgba(23, 59, 82, .08); overflow: hidden; }
.p4-visual-row { grid-auto-flow: column; grid-auto-columns: max-content; align-items: end; }
.p4-visual strong { text-align: center; color: ${T.navy}; font: 800 clamp(20px, 4.4vw, 30px)/1.25 'JetBrains Mono', monospace; }
.p4-svg { width: 100%; max-width: 200px; height: auto; }
.p4-svg-narrow { max-width: 124px; }
.p4-net-note { fill: ${T.warn}; font: 800 14px 'JetBrains Mono', monospace; }
.p4-claim { display: grid; place-items: center; width: 40px; height: 50px; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 17px 'JetBrains Mono', monospace; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }

.p4-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.p4-option { display: flex; align-items: center; gap: 9px; min-width: 44px; min-height: 56px; padding: 10px 12px; text-align: left; border: 1px solid rgba(23, 59, 82, .12); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font: 700 clamp(12.5px, 1.9vw, 14.5px)/1.35 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-option:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-letter { flex: 0 0 26px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-option.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-option.is-ok { border-color: rgba(34, 122, 83, .4); background: ${T.successSoft}; color: ${T.success}; }
.p4-option.is-ok .p4-letter { background: ${T.success}; color: #fff; }
.p4-option.is-no { border-color: rgba(169, 111, 19, .4); background: ${T.warnSoft}; color: ${T.warn}; }
.p4-option.is-no .p4-letter { background: ${T.warn}; color: #fff; }

.p4-construct { display: grid; gap: 7px; justify-items: center; }
.p4-build-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.p4-build-slot { min-width: 60px; min-height: 52px; border: 2px dashed rgba(23, 59, 82, .22); border-radius: 12px; background: #FBFBF8; color: ${T.ink3}; font: 800 clamp(15px, 3.2vw, 20px) 'JetBrains Mono', monospace; cursor: pointer; }
.p4-build-slot.is-filled { border-style: solid; border-color: ${T.cyan}; background: ${T.paper}; color: ${T.navy}; }
.p4-build-slot.is-ok { border-color: ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
.p4-build-slot.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; color: ${T.warn}; }

.p4-match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 7px; }
.p4-match-col { display: grid; gap: 8px; }
.p4-match button, .p4-order button { min-width: 44px; min-height: 48px; padding: 8px 10px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 700 clamp(11px, 1.75vw, 13px)/1.3 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-match button:hover:not(:disabled), .p4-order button:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-match button.is-active, .p4-order button.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-match button.is-tied { border-color: rgba(34, 122, 83, .35); }
.p4-match button small { display: block; margin-top: 3px; color: ${T.success}; font-size: 10.5px; }
.p4-match button.is-used, .p4-card.is-used { background: ${T.successSoft}; opacity: .62; }

.p4-order-slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-order-slots button { display: grid; gap: 3px; place-items: center; }
.p4-order-slots small { color: ${T.ink3}; font-size: 10px; }
.p4-order-slots b { font: 800 clamp(10px, 1.6vw, 12px)/1.2 'Manrope', sans-serif; text-align: center; }
.p4-card-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: 8px; }
.p4-card { min-width: 48px; min-height: 46px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 12px/1.25 'Manrope', sans-serif; cursor: pointer; }

.p4-sort { display: grid; gap: 7px; }
.p4-sort-pool { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; min-height: 52px; padding: 7px; border: 1px dashed rgba(23, 59, 82, .2); border-radius: 12px; }
.p4-pool-done { display: grid; place-items: center; color: ${T.success}; font-size: 20px; font-weight: 800; }
.p4-sort-token { min-width: 64px; min-height: 44px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .14); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 14px 'JetBrains Mono', monospace; cursor: pointer; }
.p4-sort-token.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-sort-token.is-ok { border-color: ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
.p4-sort-token.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; color: ${T.warn}; }
.p4-sort-bins { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
.p4-sort-bin { display: grid; gap: 5px; align-content: start; padding: 7px; border-radius: 12px; background: #FBFBF8; box-shadow: inset 0 0 0 1px rgba(23, 59, 82, .08); }
.p4-sort-bin-head { min-width: 44px; min-height: 44px; padding: 7px 8px; border: 0; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 12px/1.25 'Manrope', sans-serif; cursor: pointer; }
.p4-sort-bin-head:disabled { opacity: .62; cursor: default; }
.p4-sort-bin-items { display: flex; flex-wrap: wrap; gap: 5px; min-height: 30px; }

.p4-pad { display: flex; flex-direction: column; align-items: center; gap: 8px; width: min(240px, 100%); margin: 0 auto; padding: 12px; border-radius: 18px; background: linear-gradient(155deg, #EDF1F3, #DDE4E8); box-shadow: inset 0 1px rgba(255, 255, 255, .9); }
.p4-pad-display { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 50px; padding: 8px; border: 2px solid ${T.accent}; border-radius: 13px; background: ${T.paper}; color: ${T.navy}; font: 800 clamp(20px, 4.4vw, 26px) 'JetBrains Mono', monospace; letter-spacing: 2px; }
.p4-pad-keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; width: 100%; }
.p4-pad-keys button { min-width: 44px; min-height: 44px; border: 1px solid rgba(23, 59, 82, .16); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 clamp(18px, 3.6vw, 22px) 'JetBrains Mono', monospace; cursor: pointer; }
.p4-pad-keys button:hover:not(:disabled) { border-color: ${T.cyan}; }
.p4-pad-keys button.p4-key-del { background: ${T.accentSoft}; color: ${T.accent}; }

.p4-feedback { padding: 12px 14px; border-radius: 14px; line-height: 1.45; }
.p4-feedback.is-ok { background: ${T.successSoft}; color: #1B6644; box-shadow: inset 4px 0 0 ${T.success}; }
.p4-feedback.is-no { background: ${T.warnSoft}; color: #8A5C10; box-shadow: inset 4px 0 0 ${T.warn}; }
.p4-feedback p { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(14px, 2.1vw, 16px); }
.p4-feedback .p4-rule { margin-top: 5px; color: ${T.ink2}; }

.p4-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
.p4-actions .p4-btn, .p4-done .p4-btn { min-width: 44px; min-height: 46px; padding: 10px 22px; border: 0; border-radius: 12px; background: ${T.paper}; color: ${T.accent}; font: 800 14px 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 8px 20px -10px rgba(255, 91, 53, .5), inset 0 0 0 1px rgba(255, 91, 53, .2); }
.p4-actions .p4-btn:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
.p4-actions button.p4-btn-ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
.p4-actions button.p4-btn-ready, .p4-done button.p4-btn-ready { background: ${T.accent}; color: #fff; }

.p4-done { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px 12px; text-align: center; }
.p4-done h2 { font: 600 clamp(19px, 3vw, 24px) 'Source Serif 4', Georgia, serif; }
.p4-done > strong { font: 800 clamp(32px, 7vw, 44px) 'JetBrains Mono', monospace; color: ${T.success}; }
.p4-done > strong small { font-size: 14px; color: ${T.ink3}; }
.p4-done p { color: ${T.ink2}; }

@keyframes p4-drop { 0% { opacity: 0; transform: translateY(-10px) scale(.86); } 70% { opacity: 1; transform: translateY(1px) scale(1.03); } 100% { opacity: 1; transform: none; } }
@keyframes p4-rise { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: none; } }

@media (max-width: 520px) {
  .p4-options { grid-template-columns: 1fr; }
  .p4-order-slots { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .p4-visual-row { grid-auto-flow: row; grid-auto-columns: auto; }
  .p4-root > header { padding-top: 54px; }
}
@media (max-width: 640px) and (max-height: 700px) {
  .p4-root > header { padding: 40px 10px 3px !important; }
  .p4-root > main { padding: 1px 8px !important; }
  .p4-task { gap: 5px !important; }
  .p4-setup { font-size: 12px; line-height: 1.3; }
  .p4-task h2 { font-size: 16px !important; }
  .p4-visual { min-height: 76px !important; padding: 8px 10px !important; }
  .p4-svg { max-width: 150px; }
  .p4-options { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 5px !important; }
  .p4-option, .p4-match button, .p4-order button { min-height: 44px !important; padding: 5px 8px !important; font-size: 11px !important; }
  .p4-actions .p4-btn, .p4-done .p4-btn { min-height: 44px !important; padding: 7px 14px; }
  .p4-feedback { padding: 8px 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .p4-root *, .p4-root *::before, .p4-root *::after { scroll-behavior: auto !important; animation: none !important; transition: none !important; }
}
`;
