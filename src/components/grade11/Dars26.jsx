// ============================================================================
// 11-sinf, Dars 26. KO'P YOQLI BURCHAKLAR VA KO'PYOQLIKLAR.
//
// B4 blokining birinchi darsi rejada, lekin OXIRGI bo'lib yig'ildi:
// unga prizma yoyilmasi kerak edi, va u asbobga keyin qo'shildi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpinBoard`, `net` rejimi, `solid: 'prism'`
//
// DARSNING BITTA GAPI: ko'pyoqlikning yoqlari, qirralari va cho'qqilari
// SANALADI, va ular tasodifiy emas -- asos tomonlari soni hammasini
// belgilaydi.
//
// Sonlar tekshirilgan. Olti burchakli prizma: 8 yoq, 18 qirra, 12 cho'qqi.
// Olti burchakli piramida: 7, 12, 7. Kub: 6, 12, 8. Har uchtasida
// cho'qqi minus qirra plyus yoq ikkiga teng -- Eyler formulasi.
// n burchakli prizmada: 2n cho'qqi, 3n qirra, n plyus 2 yoq.
//
// Darslik: 1-qism, «Prizma va silindr» bobi, 146-bet -- ko'p yoqli
// burchaklar va ko'pyoqliklar. Bu blokdagi ikkinchi dars, unda darslik bor.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_26',
  title: L("Ko'pyoqliklar", 'Многогранники', 'Polyhedra'),
}

const BLOCK = { label: 'B4', from: 26, to: 33, current: 26 }

// ============================================================
// SLAYD 1. XUK. Nechta yoq.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L("Ko'pyoqliklar", 'Многогранники', 'Polyhedra'),
  title: L('Nechta yoq bor', 'Сколько всего граней', 'How many faces in all'),
  expr: L('asosi -- oltiburchak', 'основание шестиугольник', 'a hexagonal base'),
  rows: [
    {
      id: 'a',
      name: L('birinchi', 'первый', 'the first'),
      value: L('oltita: asos tomonlari qancha', 'шесть: по сторонам основания', 'six: one per base side'),
    },
    {
      id: 'b',
      name: L('ikkinchi', 'второй', 'the second'),
      value: L('sakkizta: asoslar ham yoq', 'восемь: основания тоже грани', 'eight: the bases are faces too'),
    },
  ],
  probe: {
    question: L('Prizmada nechta yoq?', 'Сколько граней у призмы?', 'How many faces has the prism?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi jismni yoyamiz.",
      'Твой ответ записан. Сейчас развернём тело.',
      'Your answer is saved. Now we will unroll the solid.',
    ),
    items: [
      { id: 'a', label: '6' },
      { id: 'b', label: '8' },
      { id: 'both', label: '7' },
      { id: 'none', label: '12' },
    ],
  },
  holds: [5000, 4500, 4500, 4000],
  audio: [
    A('mount', "Blok jismlardan boshlanadi, va birinchi jism eng oddiysi: prizma. Uni tashkil qiladigan qismlarni sanashdan boshlaymiz.", 'Блок начинается с тел, и первое тело самое простое: призма. Начнём со счёта частей, из которых она состоит.', 'The block starts with solids, and the first is the simplest: a prism. Let us begin by counting the parts it is made of.'),
    A('r1', "Prizmaning asosi oltiburchak. Birinchi fikr: yoqlar oltita, asosning har bir tomoniga bittadan.", 'Основание призмы шестиугольник. Первое мнение: граней шесть, по одной на каждую сторону основания.', 'The prism base is a hexagon. The first opinion: six faces, one per base side.'),
    A('r2', "Ikkinchi fikr: sakkizta, chunki ikkita asosning o'zi ham yoq.", 'Второе мнение: восемь, потому что и сами два основания это грани.', 'The second opinion: eight, because the two bases are faces as well.'),
    A('ask', "Sizningcha nechta? Hozircha shunchaki taxmin qiling.", 'Как думаешь, сколько? Пока просто предположи.', 'How many do you think? Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Uchta so'z: yoq, qirra, cho'qqi. Bu baholanmaydi.",
    'Три слова: грань, ребро, вершина. Это не оценивается.',
    'Three words: face, edge, vertex. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Yoq', 'Грань', 'A face'),
      short: L('tekis qism', 'плоская часть', 'a flat part'),
      ex: [{ e: L("ko'pburchak", 'многоугольник', 'a polygon'), why: L('jismning devori', 'стенка тела', 'a wall of the solid') }],
    },
    {
      id: 'c2',
      title: L('Qirra', 'Ребро', 'An edge'),
      short: L('ikki yoq kesishmasi', 'пересечение двух граней', 'where two faces meet'),
      ex: [{ e: L('kesma', 'отрезок', 'a segment'), why: L('yoqlar chegarasi', 'граница граней', 'the border of faces') }],
    },
    {
      id: 'c3',
      title: L("Cho'qqi", 'Вершина', 'A vertex'),
      short: L('qirralar uchrashadi', 'сходятся рёбра', 'edges meet'),
      ex: [{ e: L('nuqta', 'точка', 'a point'), why: L('kamida uchta qirra', 'не меньше трёх рёбер', 'at least three edges') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('Kubda nechta yoq?', 'Сколько граней у куба?', 'How many faces has a cube?'),
      cols: 4,
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '8', hint: L("Sakkiztasi cho'qqilar.", 'Восемь это вершины.', 'Eight is the vertices.') },
        { id: 'c', label: '12', hint: L("O'n ikkitasi qirralar.", 'Двенадцать это рёбра.', 'Twelve is the edges.') },
        { id: 'd', label: '4', hint: L("To'rtta faqat yon yoqlar, tepasi va tagi ham bor.", 'Четыре это только боковые, есть ещё верх и низ.', 'Four is the sides only; there is a top and a bottom too.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('Kubda nechta qirra?', 'Сколько рёбер у куба?', 'How many edges has a cube?'),
      cols: 4,
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '6', hint: L("Oltitasi yoqlar.", 'Шесть это грани.', 'Six is the faces.') },
        { id: 'c', label: '8', hint: L("Sakkiztasi cho'qqilar.", 'Восемь это вершины.', 'Eight is the vertices.') },
        { id: 'd', label: '24', hint: L("Har bir qirra ikkita yoqqa tegishli, shuning uchun ikki barobar kam.", 'Каждое ребро принадлежит двум граням, поэтому вдвое меньше.', 'Each edge belongs to two faces, so half as many.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L("Qirra nima?", 'Что такое ребро?', 'What is an edge?'),
      cols: 2,
      items: [
        { id: 'a', label: L('ikki yoqning kesishmasi', 'пересечение двух граней', 'where two faces meet'), correct: true },
        { id: 'b', label: L('yoqning tomoni', 'сторона грани', 'a side of a face'), hint: L("Bu yaqin, lekin qirra IKKITA yoqqa tegishli, bittasiga emas.", 'Это близко, но ребро принадлежит ДВУМ граням, а не одной.', 'Close, but an edge belongs to TWO faces, not one.') },
        { id: 'c', label: L("cho'qqilar orasidagi masofa", 'расстояние между вершинами', 'the distance between vertices'), hint: L("Qirra kesma, masofa emas: u chizmada ko'rinadi.", 'Ребро это отрезок, а не расстояние: его видно на чертеже.', 'An edge is a segment, not a distance: it is visible in the drawing.') },
        { id: 'd', label: L('jismning balandligi', 'высота тела', 'the height'), hint: L("Balandlik alohida kattalik.", 'Высота это отдельная величина.', 'The height is a separate quantity.') },
      ],
    },
  ],
  holds: [3000, 4000, 4000, 4000, 2100, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi so'z: yoq. Bu jismning tekis qismi, ko'pburchak.", 'Первое слово: грань. Это плоская часть тела, многоугольник.', 'The first word: a face. It is a flat part of the solid, a polygon.'),
    A('c2', "Ikkinchi so'z: qirra. Bu ikkita yoq kesishadigan kesma. Diqqat qiling: aynan IKKITA, va shuning uchun qirralar yoqlardan ko'p bo'lsa ham, ikki marta sanalmaydi.", 'Второе слово: ребро. Это отрезок, по которому пересекаются две грани. Обрати внимание: именно ДВЕ, и поэтому рёбра, хоть их и больше граней, дважды не считаются.', 'The second word: an edge. It is the segment where two faces meet. Note: exactly TWO, so edges, though more numerous than faces, are not counted twice.'),
    A('c3', "Uchinchi so'z: cho'qqi. Bu nuqta, unda kamida uchta qirra uchrashadi.", 'Третье слово: вершина. Это точка, в которой сходятся не меньше трёх рёбер.', 'The third word: a vertex. It is a point where at least three edges meet.'),
    A('recap', "Uchtasini bugun sanaymiz.", 'Все три сегодня и посчитаем.', 'We will count all three today.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. UCHTASINI SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'net_faces',
  eyebrow: L('Uchtasini sanaymiz', 'Посчитаем все три', 'Let us count all three'),
  title: L('Olti burchakli prizma', 'Шестиугольная призма', 'A hexagonal prism'),
  expr: L('asos tomonlari: 6', 'сторон основания: 6', 'base sides: 6'),
  goal: L('yoq, qirra, cho\'qqi sonini topish', 'найти число граней, рёбер, вершин', 'find the faces, edges and vertices'),
  rule: L(
    "Har birini asos tomonlari soni orqali ifodalaymiz.",
    'Выразим каждое через число сторон основания.',
    'Let us express each through the base side count.',
  ),
  pick: L('Nimani sanaymiz?', 'Что посчитаем?', 'What shall we count?'),
  claims: [
    { id: 'a', key: 'inA', name: L('faqat yon', 'только боковые', 'sides only'), value: '6' },
    { id: 'b', key: 'inB', name: L('asoslar bilan', 'с основаниями', 'with bases'), value: '8' },
  ],
  points: [
    {
      id: 'q1', label: L('yoqlar', 'грани', 'faces'), num: '8', step: 'calc', verdict: 'in',
      role: L('6 yon va 2 asos', '6 боковых и 2 основания', '6 sides and 2 bases'),
      calc: '6 + 2 = 8',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: L('qirralar', 'рёбра', 'edges'), num: '18', step: 'calc', verdict: 'in',
      role: L('2 asosda va 6 tik', '2 основания и 6 вертикальных', '2 bases and 6 uprights'),
      calc: '6 + 6 + 6 = 18',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: L("cho'qqilar", 'вершины', 'vertices'), num: '12', step: 'calc', verdict: 'in',
      role: L('har asosda 6 ta', 'по 6 в каждом основании', 'six in each base'),
      calc: '6 · 2 = 12',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Prizmada nechta yoq?", 'Сколько граней у призмы?', 'How many faces has the prism?'),
    items: [
      {
        id: 'b', label: '8', correct: true,
        ok: L(
          "To'g'ri. Yon yoqlar oltita, asos tomonlari qancha bo'lsa shuncha, va ustiga ikkita asos qo'shiladi.",
          'Верно. Боковых граней шесть, по числу сторон основания, и сверху добавляются два основания.',
          'Correct. Six side faces, one per base side, plus the two bases.',
        ),
      },
      { id: 'a', label: '6', hint: L("Bu faqat yon yoqlar. Asoslar ham yoq: ular tekis ko'pburchaklar.", 'Это только боковые. Основания тоже грани: это плоские многоугольники.', 'That is the sides only. The bases are faces too: they are flat polygons.') },
      { id: 'both', label: '7', hint: L("Bitta asos hisobga olingan. Prizmada ular ikkita.", 'Учтено одно основание. У призмы их два.', 'One base was counted. A prism has two.') },
      { id: 'none', label: '12', hint: L("O'n ikkitasi CHO'QQILAR soni.", 'Двенадцать это число ВЕРШИН.', 'Twelve is the number of VERTICES.') },
    ],
  },
  holds: [2500, 4100, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi uchala sonni ham sanaymiz.', 'Опора восстановлена. Теперь посчитаем все три числа.', 'The basics are back. Now let us count all three numbers.'),
    A('mount', "Har birini asos tomonlari soni orqali ifodalaymiz: shunda javob har qanday prizmaga yaraydi.", 'Каждое выразим через число сторон основания: тогда ответ подойдёт любой призме.', 'Let us express each through the base side count: then the answer fits any prism.'),
    A('mount', "Nimadan boshlashni tanlang.", 'Выбери, с чего начать.', 'Choose where to start.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana uchala son. Yoqlar sakkizta: oltita yon va ikkita asos. Qirralar o'n sakkizta: yuqori asosda oltita, pastkisida oltita va oltita tik qirra. Cho'qqilar o'n ikkita: har bir asosda oltitadan. Uchala son ham oltidan, ya'ni asos tomonlari sonidan chiqdi.", 'Вот все три числа. Граней восемь: шесть боковых и два основания. Рёбер восемнадцать: шесть в верхнем основании, шесть в нижнем и шесть вертикальных. Вершин двенадцать: по шесть в каждом основании. Все три числа вышли из шестёрки, то есть из числа сторон основания.', 'Here are all three. Eight faces: six sides and two bases. Eighteen edges: six on the top base, six on the bottom and six uprights. Twelve vertices: six in each base. All three came from the six, that is from the base side count.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: YOYILMA.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'net_faces',
  eyebrow: L('Yoyamiz', 'Разворачиваем', 'Unrolling'),
  title: L('Yon yoqlar lentaga yotadi', 'Боковые ложатся лентой', 'The side faces lie in a band'),
  chip: L('asos: 6 tomon', 'основание: 6 сторон', 'base: 6 sides'),
  solid: {
    mode: 'net',
    solid: 'prism',
    sides: 6,
    hh: 2.4,
    height: 148,
    caption: L('lentadagi to\'rtburchaklar soni', 'число прямоугольников в ленте', 'the count of rectangles in the band'),
  },
  spinSteps: 3,
  bonus: L(
    "Lentada roppa rosa oltita to'rtburchak, va bu tasodif emas: har bir yon yoq asosning bitta tomoniga tegib turadi. Asos tomonlari o'zgarsa, yoqlar soni ham o'zgaradi.",
    'В ленте ровно шесть прямоугольников, и это не случайность: каждая боковая грань опирается на одну сторону основания. Изменится число сторон, изменится и число граней.',
    'The band holds exactly six rectangles, and that is no accident: each side face rests on one base side. Change the base sides and the face count changes with them.',
  ),
  probe: {
    question: L("Yon yoqlar soni nimaga teng?", 'Чему равно число боковых граней?', 'What does the side face count equal?'),
    items: [
      { id: 'a', label: L('asos tomonlari soniga', 'числу сторон основания', 'the base side count'), correct: true },
      { id: 'b', label: L("cho'qqilar soniga", 'числу вершин', 'the vertex count'), hint: L("Cho'qqilar ikki barobar ko'p: har asosda oltitadan.", 'Вершин вдвое больше: по шесть в каждом основании.', 'There are twice as many vertices: six in each base.') },
      { id: 'c', label: L('qirralar soniga', 'числу рёбер', 'the edge count'), hint: L("Qirralar uch barobar ko'p: o'n sakkizta.", 'Рёбер втрое больше: восемнадцать.', 'There are three times as many edges: eighteen.') },
      { id: 'd', label: L('har doim to\'rtta', 'всегда четыре', 'always four'), hint: L("To'rtta faqat to'rtburchakli asosda.", 'Четыре только при четырёхугольном основании.', 'Four only with a quadrilateral base.') },
    ],
  },
  holds: [4500, 2500, 1700, 6500],
  audio: [
    A('mount', "Sonlar sanaldi. Endi jismni qirqib yoyamiz.", 'Числа посчитаны. Теперь разрежем тело и развернём.', 'The numbers are computed. Now let us cut the solid open.'),
    A('one', "Yon yoqlar ochila boshladi.", 'Боковые грани начали раскрываться.', 'The side faces have begun to open.'),
    A('two', "Yarmi yotdi.", 'Половина легла.', 'Half is down.'),
    A('three', "Lenta tayyor, va undagi to'rtburchaklarni sanash mumkin: oltita. Har biri asosning bitta tomoniga tegib turadi, shuning uchun ular soni har doim asos tomonlari soniga teng.", 'Лента готова, и прямоугольники в ней можно пересчитать: шесть. Каждый опирается на одну сторону основания, поэтому их число всегда равно числу сторон.', 'The band is ready, and its rectangles can be counted: six. Each rests on one base side, so their number always equals the side count.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'net_faces',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Hammasi n dan chiqadi', 'Всё выходит из n', 'Everything comes from n'),
  rows: ['n = 6:  8,  18,  12', L('yoqlar n + 2', 'граней n + 2', 'faces n + 2')],
  probe: {
    question: L(
      "Asosi 10 burchakli prizmada nechta yoq?",
      'Сколько граней у призмы с 10-угольным основанием?',
      'How many faces has a prism with a 10-gon base?',
    ),
    items: [
      { id: 'a', label: '12', correct: true },
      { id: 'b', label: '10', hint: L("Bu faqat yon yoqlar. Ikkita asos qo'shiladi.", 'Это только боковые. Добавляются два основания.', 'That is the sides only. Two bases are added.') },
      { id: 'c', label: '20', hint: L("Yigirmatasi CHO'QQILAR: ikki karra o'n.", 'Двадцать это ВЕРШИНЫ: дважды по десять.', 'Twenty is the VERTICES: twice ten.') },
      { id: 'd', label: '30', hint: L("O'ttiztasi QIRRALAR: uch karra o'n.", 'Тридцать это РЁБРА: трижды по десять.', 'Thirty is the EDGES: three times ten.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Prizma', 'Правило 1. Призма', 'Rule 1. The prism'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('yoq n + 2,  qirra 3n,  cho\'qqi 2n', 'граней n + 2, рёбер 3n, вершин 2n', 'faces n + 2, edges 3n, vertices 2n'),
    lines: [
      L("n -- asos tomonlari soni", 'n это число сторон основания', 'n is the base side count'),
      L("yon yoqlar n ta, ustiga ikkita asos", 'боковых граней n, плюс два основания', 'n side faces, plus two bases'),
      L("qirralar: n yuqorida, n pastda, n tik", 'рёбра: n сверху, n снизу, n вертикальных', 'edges: n on top, n below, n upright'),
      L("cho'qqilar har asosda n tadan", 'вершин по n в каждом основании', 'n vertices in each base'),
    ],
    example: L('misol:  n = 6 -> 8, 18, 12', 'пример:  n = 6 -> 8, 18, 12', 'example:  n = 6 -> 8, 18, 12'),
  },
  holds: [4000, 6000, 4500],
  audio: [
    A('mount', "Yoyilma ko'rildi. Endi qoidani yozamiz.", 'Развёртку увидели. Теперь запишем правило.', 'We saw the net. Now let us write the rule.'),
    A('def', "Uchala son ham bitta harfdan, asos tomonlari sonidan chiqadi. Yoqlar n plyus ikki, qirralar uch n, cho'qqilar ikki n. Bu formulalarni yodlash shart emas: chizmaga qarab har safar sanab olish mumkin.", 'Все три числа выходят из одной буквы, из числа сторон основания. Граней n плюс два, рёбер три n, вершин два n. Эти формулы не нужно запоминать: по чертежу их каждый раз можно пересчитать.', 'All three numbers come from one letter, the base side count. Faces n plus two, edges three n, vertices two n. These formulas need not be memorised: they can be recounted from the drawing every time.'),
    A('rule', "To'g'ri. Va e'tibor bering: qirralar eng ko'p, cho'qqilar o'rtada, yoqlar eng kam.", 'Верно. И заметь: рёбер больше всего, вершин посередине, граней меньше всего.', 'Correct. And note: edges are the most, vertices in between, faces the fewest.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: piramida.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'euler',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Endi piramida', 'Теперь пирамида', 'Now a pyramid'),
  was: { label: UI.was, expr: L('prizma: 8, 18, 12', 'призма: 8, 18, 12', 'prism: 8, 18, 12') },
  now: { label: UI.now, expr: L('olti burchakli piramida: ?', 'шестиугольная пирамида: ?', 'a hexagonal pyramid: ?') },
  probe1: {
    question: L('Piramidada nechta yoq?', 'Сколько граней у пирамиды?', 'How many faces has the pyramid?'),
    items: [
      { id: 'a', label: '7', correct: true },
      { id: 'b', label: '8', hint: L("Sakkizta prizmada edi: u yerda asos ikkita.", 'Восемь было у призмы: там два основания.', 'Eight belonged to the prism: it has two bases.') },
      { id: 'c', label: '6', hint: L("Oltitasi faqat yon yoqlar. Asos ham yoq.", 'Шесть это только боковые. Основание тоже грань.', 'Six is the sides only. The base is a face too.') },
      { id: 'd', label: '12', hint: L("O'n ikkitasi QIRRALAR soni.", 'Двенадцать это число РЁБЕР.', 'Twelve is the EDGE count.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L("Cho'qqi minus qirra plyus yoq?", 'Вершины минус рёбра плюс грани?', 'Vertices minus edges plus faces?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '2' },
      { id: 'b', label: '0' },
      { id: 'c', label: '1' },
      { id: 'd', label: '6' },
    ],
  },
  holds: [4500, 5500, 2500, 3000],
  audio: [
    A('mount', "Prizma uchun uchala son ham topildi: sakkiz, o'n sakkiz, o'n ikki.", 'Для призмы все три числа найдены: восемь, восемнадцать, двенадцать.', 'For the prism all three are found: eight, eighteen, twelve.'),
    A('now', "Endi boshqa jism: o'sha oltiburchak asos, lekin yuqorida ikkinchi asos o'rniga bitta cho'qqi. Bu piramida, va uning sonlari boshqacha bo'ladi.", 'Теперь другое тело: то же шестиугольное основание, но сверху вместо второго основания одна вершина. Это пирамида, и числа у неё другие.', 'Now another solid: the same hexagonal base, but on top a single vertex instead of a second base. That is a pyramid, and its numbers differ.'),
    A('q1', "Piramidada nechta yoq?", 'Сколько граней у пирамиды?', 'How many faces has the pyramid?'),
    A('q2', "Endi qiziq savol. Cho'qqilar sonidan qirralar sonini ayirib, yoqlar sonini qo'shing. Sizningcha nima chiqadi? Shunchaki taxmin qiling.", 'А теперь интересный вопрос. Из числа вершин вычти число рёбер и прибавь число граней. Как думаешь, что получится? Просто предположи.', 'And now an interesting question. Take the vertex count, subtract the edges, add the faces. What do you think comes out? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'euler',
  eyebrow: L('Ikkalasini tekshiramiz', 'Проверим оба', 'Let us check both'),
  title: L('Prizma va piramida', 'Призма и пирамида', 'Prism and pyramid'),
  expr: L("cho'qqi − qirra + yoq", 'вершины − рёбра + грани', 'vertices − edges + faces'),
  need: '= ?',
  answerLabel: L('natija', 'результат', 'the result'),
  cards: [
    {
      tag: L('prizma', 'призма', 'prism'),
      txt: '12 − 18 + 8',
      point: {
        label: L('sanaymiz', 'считаем', 'compute'),
        calc: '= 2',
        verdict: 'in',
      },
    },
    {
      tag: L('piramida', 'пирамида', 'pyramid'),
      txt: '7 − 12 + 7',
      point: {
        label: L('sanaymiz', 'считаем', 'compute'),
        calc: '= 2',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2', '0', '1', '6'],
    value: ['2'],
    label: L('natija =', 'результат =', 'result ='),
    prompt: L('Natijani yozing', 'Запиши результат', 'Write the result'),
    wrongs: [
      { key: '0', hint: L("Nol emas: o'n ikki minus o'n sakkiz plyus sakkiz ikkiga teng.", 'Не ноль: двенадцать минус восемнадцать плюс восемь равно двум.', 'Not zero: twelve minus eighteen plus eight is two.') },
      { key: '6', hint: L("Oltitasi asos tomonlari soni, va u har xil jismda har xil. Natija esa bir xil chiqdi.", 'Шесть это число сторон основания, оно у разных тел разное. А результат вышел одинаковым.', 'Six is the base side count, which differs between solids. The result came out the same.') },
      { key: '*', hint: L("Ikkala jismda ham bir xil son chiqadi.", 'У обоих тел выходит одно и то же число.', 'Both solids give the same number.') },
    ],
  },
  holds: [3500, 5500, 5500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala jismda ham sanaymiz.', 'Прогноз есть. Теперь посчитаем у обоих тел.', 'The guess is made. Now let us compute for both solids.'),
    A('p1', "Prizma: o'n ikki cho'qqi, o'n sakkiz qirra, sakkiz yoq. O'n ikki minus o'n sakkiz plyus sakkiz, ikki.", 'Призма: двенадцать вершин, восемнадцать рёбер, восемь граней. Двенадцать минус восемнадцать плюс восемь, два.', 'The prism: twelve vertices, eighteen edges, eight faces. Twelve minus eighteen plus eight is two.'),
    A('p2', "Piramida: yetti cho'qqi, o'n ikki qirra, yetti yoq. Yetti minus o'n ikki plyus yetti, yana ikki. Sonlar butunlay boshqacha edi, natija esa bir xil. Bu tasodif emas, bu Eyler formulasi.", 'Пирамида: семь вершин, двенадцать рёбер, семь граней. Семь минус двенадцать плюс семь, снова два. Числа были совсем разные, а результат один. Это не случайность, это формула Эйлера.', 'The pyramid: seven vertices, twelve edges, seven faces. Seven minus twelve plus seven, two again. The numbers were quite different, the result the same. That is no accident: it is the Euler formula.'),
    A('write', "Natijani yozing.", 'Запиши результат.', 'Write the result.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: EYLER.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'euler',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Eyler formulasi', 'Формула Эйлера', 'The Euler formula'),
  cases: [
    {
      label: L('prizma', 'призма', 'prism'),
      text: '12 − 18 + 8 = 2',
      tone: 'graph',
    },
    {
      label: L('kub', 'куб', 'cube'),
      text: '8 − 12 + 6 = 2',
      tone: 'accent',
    },
  ],
  rows: ['V − E + F = 2', L('har qanday ko\'pyoqlikda', 'у любого многогранника', 'for every polyhedron')],
  probe: {
    question: L(
      "Jismda 6 cho'qqi va 12 qirra. Nechta yoq?",
      'У тела 6 вершин и 12 рёбер. Сколько граней?',
      'A solid has 6 vertices and 12 edges. How many faces?',
    ),
    items: [
      { id: 'a', label: '8', correct: true },
      { id: 'b', label: '6', hint: L("Eyler formulasiga qo'ying: olti minus o'n ikki plyus yoq ikkiga teng.", 'Подставь в формулу Эйлера: шесть минус двенадцать плюс грани равно двум.', 'Put it into Euler: six minus twelve plus faces equals two.') },
      { id: 'c', label: '18', hint: L("Ko'p: olti minus o'n ikki bu minus olti, unga sakkiz qo'shilsa ikki chiqadi.", 'Много: шесть минус двенадцать это минус шесть, плюс восемь даёт два.', 'Too many: six minus twelve is minus six, plus eight gives two.') },
      { id: 'd', label: '2', hint: L("Ikki bu formulaning NATIJASI, yoqlar soni emas.", 'Два это РЕЗУЛЬТАТ формулы, а не число граней.', 'Two is the RESULT of the formula, not the face count.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Eyler', 'Правило 2. Эйлер', 'Rule 2. Euler'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'V − E + F = 2',
    lines: [
      L("V -- cho'qqilar, E -- qirralar, F -- yoqlar", 'V вершины, E рёбра, F грани', 'V vertices, E edges, F faces'),
      L('har qanday qavariq ko\'pyoqlikda ishlaydi', 'работает для любого выпуклого многогранника', 'it holds for every convex polyhedron'),
      L("ikkitasi ma'lum bo'lsa, uchinchisi topiladi", 'если известны два, третье находится', 'given two, the third follows'),
      L("bu tekshiruv ham: son mos kelmasa, xato bor", 'это и проверка: не сошлось, значит ошибка', 'it is also a check: if it fails, something is wrong'),
    ],
    example: L('misol:  8 − 12 + 6 = 2', 'пример:  8 − 12 + 6 = 2', 'example:  8 − 12 + 6 = 2'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('sanash mumkin, yodlash shart emas', 'можно сосчитать, не нужно запоминать', 'count it, do not memorise it'),
    lines: [
      L("1. asos tomonlari sonini toping: n", '1. найди число сторон основания: n', '1. find the base side count: n'),
      L('2. yoq, qirra, cho\'qqini n orqali yozing', '2. вырази грани, рёбра, вершины через n', '2. write faces, edges, vertices through n'),
      L('3. Eyler bilan tekshiring: V − E + F = 2', '3. проверь Эйлером: V − E + F = 2', '3. check with Euler: V − E + F = 2'),
      L("4. mos kelmasa, sanashda xato bor", '4. не сошлось — ошибка в счёте', '4. if it fails, the count is wrong'),
    ],
  },
  holds: [4000, 6000, 2900, 5000],
  audio: [
    A('mount', 'Ikkala jismda ham ikki chiqdi. Endi qoidani yozamiz.', 'У обоих тел вышло два. Теперь запишем правило.', 'Both solids gave two. Now let us write the rule.'),
    A('rows', "Bu Eyler formulasi: cho'qqilar minus qirralar plyus yoqlar har doim ikkiga teng. Kubda ham shunday: sakkiz minus o'n ikki plyus olti, ikki. Formula har qanday qavariq ko'pyoqlik uchun ishlaydi, jismning shakli qanday bo'lishidan qat'i nazar.", 'Это формула Эйлера: вершины минус рёбра плюс грани всегда равно двум. У куба так же: восемь минус двенадцать плюс шесть, два. Формула работает для любого выпуклого многогранника, какой бы формы он ни был.', 'This is the Euler formula: vertices minus edges plus faces always equals two. The cube too: eight minus twelve plus six is two. It holds for every convex polyhedron, whatever its shape.'),
    A('q', "Savol: jismda olti cho'qqi va o'n ikki qirra bor. Nechta yoq?", 'Вопрос: у тела шесть вершин и двенадцать рёбер. Сколько граней?', 'The question: a solid has six vertices and twelve edges. How many faces?'),
    A('rule', "To'g'ri. Va bu formulaning eng foydali tomoni: u tekshiruv bo'lib ishlaydi. Sanadingiz, qo'ydingiz, ikki chiqmadi -- demak biror joyda xato.", 'Верно. И самое полезное в этой формуле: она работает как проверка. Если посчитал, подставил и два не вышло, значит где-то ошибка.', 'Correct. And the most useful thing about it: it works as a check. Count, substitute, and if two does not come out, something is wrong.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. AMALNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'euler',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Amalni qo\'ying', 'Поставь действие', 'Place the operation'),
  left: L('kub: 8 cho\'qqi, 12 qirra, 6 yoq', 'куб: 8 вершин, 12 рёбер, 6 граней', 'a cube: 8 vertices, 12 edges, 6 faces'),
  template: ['8 ', { slot: 0 }, ' 12 + 6 = 2'],
  signs: ['−', '+'],
  answer: '−',
  checkNote: L(
    "Qirralar AYIRILADI: ular eng ko'p",
    'Рёбра ВЫЧИТАЮТСЯ: их больше всего',
    'Edges are SUBTRACTED: they are the most numerous',
  ),
  wrongs: [
    { key: '+', hint: L("Qo'shsak yigirma olti chiqadi. Formulada qirralar ayiriladi.", 'Сложение даст двадцать шесть. В формуле рёбра вычитаются.', 'Adding gives twenty six. The formula subtracts the edges.') },
  ],
  probe: {
    question: L("Nega aynan qirralar ayiriladi?", 'Почему вычитаются именно рёбра?', 'Why are the edges subtracted?'),
    items: [
      { id: 'a', label: L("ular eng ko'p, va ular ikki yoqqa umumiy", 'их больше всего, и они общие для двух граней', 'they are the most, and shared by two faces'), correct: true },
      { id: 'b', label: L("shunday kelishilgan", 'так договорились', 'a convention'), hint: L("Kelishuv emas: qirra ikkita yoqni bog'laydi, va shuning uchun ortiqcha sanaladi.", 'Не договорённость: ребро связывает две грани и потому считается лишний раз.', 'Not a convention: an edge joins two faces and so gets counted twice over.') },
      { id: 'c', label: L("ular eng uzun", 'они самые длинные', 'they are longest'), hint: L("Uzunlik bu yerda ahamiyatsiz: biz SONlarni sanayapmiz.", 'Длина здесь ни при чём: мы считаем ЧИСЛА.', 'Length is beside the point: we are counting NUMBERS.') },
      { id: 'd', label: L('tasodif', 'случайность', 'chance'), hint: L("Tasodif emas: uchala jismda ham ikki chiqdi.", 'Не случайность: у всех трёх тел вышло два.', 'Not chance: all three solids gave two.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Amalni qo'ying.", 'Поставь действие.', 'Place the operation.'),
    A('checked', "Bo'ldi. Endi ta'riflang.", 'Получилось. Теперь сформулируй.', 'Done. Now put it into words.'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'n', label: L('asos tomonlarini sanash', 'посчитать стороны основания', 'count the base sides') },
  { id: 'faces', label: L('yoqlarni sanash', 'посчитать грани', 'count the faces') },
  { id: 'edges', label: L('qirralarni sanash', 'посчитать рёбра', 'count the edges') },
  { id: 'euler', label: L('Eyler bilan tekshirish', 'проверить Эйлером', 'check with Euler') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'euler',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('uch burchakli prizma. Cho\'qqilar?', 'треугольная призма. Вершины?', 'a triangular prism. Vertices?'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'n',
      to: 'n = 3',
      wrongs: [
        { action: 'faces', hint: L("Avval asos tomonlarini sanang: hammasi shundan chiqadi.", 'Сначала посчитай стороны основания: всё выходит из них.', 'Count the base sides first: everything follows from them.') },
        { action: 'edges', hint: L("Qirralar ham n orqali topiladi.", 'Рёбра тоже находятся через n.', 'The edges also follow from n.') },
        { action: 'euler', hint: L("Tekshiruv oxirida: avval sonlarni toping.", 'Проверка в конце: сначала найди числа.', 'The check comes last: find the numbers first.') },
      ],
    },
    {
      action: 'faces',
      to: '3 + 2 = 5',
      wrongs: [
        { action: 'n', hint: L("Topilgan: uch.", 'Найдено: три.', 'Found: three.') },
        { action: 'edges', hint: L("Qirralarni ham sanaymiz, lekin keyin.", 'Рёбра тоже посчитаем, но позже.', 'The edges too, but later.') },
        { action: 'euler', hint: L("Hali erta.", 'Ещё рано.', 'Too early.') },
      ],
    },
    {
      action: 'edges',
      to: '3 · 3 = 9',
      wrongs: [
        { action: 'n', hint: L("Topilgan.", 'Найдено.', 'Found.') },
        { action: 'faces', hint: L("Sanalgan: besh.", 'Посчитано: пять.', 'Computed: five.') },
        { action: 'euler', hint: L("Cho'qqilar hali topilmagan.", 'Вершины ещё не найдены.', 'The vertices are not found yet.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['6', '9', '5', '3'],
    value: ['6'],
    label: L("cho'qqilar =", 'вершин =', 'vertices ='),
    prompt: L('Cho\'qqilar sonini yozing', 'Запиши число вершин', 'Write the vertex count'),
    wrongs: [
      { key: '9', hint: L("To'qqiztasi QIRRALAR.", 'Девять это РЁБРА.', 'Nine is the EDGES.') },
      { key: '5', hint: L("Beshtasi YOQLAR.", 'Пять это ГРАНИ.', 'Five is the FACES.') },
      { key: '3', hint: L("Uchtasi faqat bitta asosda. Asos ikkita.", 'Три это только в одном основании. Оснований два.', 'Three is one base only. There are two bases.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi boshqa prizmani sanaymiz.', 'Правило сформулировано. Посчитаем другую призму.', 'The rule is stated. Let us count another prism.'),
    A('start', "Bu safar asos uchburchak. Diqqat: ro'yxatdagi hamma amal kerak emas.", 'На этот раз основание треугольник. Внимание: не все действия из списка нужны.', 'This time the base is a triangle. Careful: not every action in the list is needed.'),
    A('step4', "Endi cho'qqilar sonini yozing.", 'Теперь запиши число вершин.', 'Now write the vertex count.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'euler',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Yoqlarni toping', 'Найди грани', 'Find the faces'),
  start: L("10 cho'qqi, 15 qirra. Yoqlar?", '10 вершин, 15 рёбер. Грани?', '10 vertices, 15 edges. Faces?'),
  actions: ACTIONS_10,
  hint: L(
    "Eyler formulasiga qo'ying.",
    'Подставь в формулу Эйлера.',
    'Put it into the Euler formula.',
  ),
  steps: [
    {
      action: 'euler',
      to: '10 − 15 + F = 2',
      wrongs: [
        { action: 'n', hint: L("Asos tomonlari berilmagan, lekin ular kerak ham emas.", 'Стороны основания не даны, но они и не нужны.', 'The base sides are not given, and not needed.') },
        { action: 'faces', hint: L("Yoqlarni to'g'ridan to'g'ri sanay olmaymiz: chizma yo'q.", 'Грани напрямую не посчитать: чертежа нет.', 'The faces cannot be counted directly: there is no drawing.') },
        { action: 'edges', hint: L("Qirralar berilgan: o'n besh.", 'Рёбра даны: пятнадцать.', 'The edges are given: fifteen.') },
      ],
    },
    {
      action: 'faces',
      to: 'F = 2 + 15 − 10 = 7',
      wrongs: [
        { action: 'euler', hint: L("Formulaga qo'yilgan.", 'В формулу подставлено.', 'It is substituted.') },
        { action: 'n', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
        { action: 'edges', hint: L("Qirralar ma'lum.", 'Рёбра известны.', 'The edges are known.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['7', '5', '27', '3'],
    value: ['7'],
    label: L('yoqlar =', 'граней =', 'faces ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '5', hint: L("O'n besh minus o'n bu besh, lekin ustiga ikki qo'shiladi.", 'Пятнадцать минус десять это пять, но сверху прибавляется два.', 'Fifteen minus ten is five, but two is added on top.') },
      { key: '27', hint: L("Qo'shib yuborilgan: o'n besh plyus o'n plyus ikki.", 'Всё сложено: пятнадцать плюс десять плюс два.', 'Everything was added: fifteen plus ten plus two.') },
      { key: '*', hint: L("Ikki plyus o'n besh minus o'n.", 'Два плюс пятнадцать минус десять.', 'Two plus fifteen minus ten.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Diqqat: bu safar chizma yo'q va jismning nomi ham aytilmagan. Faqat ikkita son berilgan, va bu yetarli.", 'Внимание: на этот раз нет ни чертежа, ни названия тела. Даны только два числа, и этого достаточно.', 'Careful: this time there is no drawing and no name of the solid. Only two numbers are given, and that suffices.'),
    A('answered', "Javobni yozing.", 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol', 'Шесть вопросов', 'Six questions'),
  items: [
    {
      id: 'b1', tag: 'net_faces', ask: true, cols: 4,
      done: '8',
      prompt: L('6 burchakli prizma: yoqlar?', '6-угольная призма: граней?', 'A 6-gon prism: faces?'),
      items: [
        { id: 'a', label: '8', correct: true },
        { id: 'b', label: '6', hint: L("Asoslar qo'shilmagan.", 'Основания не добавлены.', 'The bases are missing.') },
        { id: 'c', label: '12', hint: L("Bu cho'qqilar.", 'Это вершины.', 'That is the vertices.') },
        { id: 'd', label: '18', hint: L("Bu qirralar.", 'Это рёбра.', 'That is the edges.') },
      ],
    },
    {
      id: 'b2', tag: 'net_faces', ask: true, cols: 4,
      done: '18',
      prompt: L('U prizmada qirralar?', 'У той призмы рёбер?', 'That prism: edges?'),
      items: [
        { id: 'a', label: '18', correct: true },
        { id: 'b', label: '12', hint: L("Bu cho'qqilar soni: ikki karra olti.", 'Это число вершин: дважды шесть.', 'That is the vertices: twice six.') },
        { id: 'c', label: '8', hint: L("Bu yoqlar.", 'Это грани.', 'That is the faces.') },
        { id: 'd', label: '24', hint: L("Ko'p: uch karra olti o'n sakkiz.", 'Много: трижды шесть восемнадцать.', 'Too many: three times six is eighteen.') },
      ],
    },
    {
      id: 'b3', tag: 'euler', ask: true, cols: 4,
      done: '2',
      prompt: L("V − E + F nimaga teng?", 'Чему равно V − E + F?', 'What is V − E + F?'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '0', hint: L("Nol emas: kubda sakkiz minus o'n ikki plyus olti ikki.", 'Не ноль: у куба восемь минус двенадцать плюс шесть два.', 'Not zero: a cube gives eight minus twelve plus six is two.') },
        { id: 'c', label: '1', hint: L("Bir emas: uchala jismda ham ikki chiqdi.", 'Не один: у всех трёх тел вышло два.', 'Not one: all three solids gave two.') },
        { id: 'd', label: L("jismga bog'liq", 'зависит от тела', 'depends'), hint: L("Bog'liq emas: shuning uchun ham bu formula.", 'Не зависит: потому это и формула.', 'It does not: that is why it is a formula.') },
      ],
    },
    {
      id: 'b4', tag: 'euler', ask: true, cols: 4,
      done: '7',
      prompt: L('6 burchakli piramida: yoqlar?', '6-угольная пирамида: граней?', 'A 6-gon pyramid: faces?'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '8', hint: L("Sakkizta prizmada: u yerda asos ikkita.", 'Восемь у призмы: там два основания.', 'Eight is the prism: two bases there.') },
        { id: 'c', label: '6', hint: L("Asos qo'shilmagan.", 'Основание не добавлено.', 'The base is missing.') },
        { id: 'd', label: '12', hint: L("Bu qirralar.", 'Это рёбра.', 'That is the edges.') },
      ],
    },
    {
      id: 'b5', tag: 'net_faces', ask: true, cols: 4,
      done: '5',
      prompt: L('3 burchakli prizma: yoqlar?', '3-угольная призма: граней?', 'A 3-gon prism: faces?'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '3', hint: L("Asoslar qo'shilmagan.", 'Основания не добавлены.', 'The bases are missing.') },
        { id: 'c', label: '6', hint: L("Bu cho'qqilar soni.", 'Это число вершин.', 'That is the vertex count.') },
        { id: 'd', label: '9', hint: L("Bu qirralar.", 'Это рёбра.', 'That is the edges.') },
      ],
    },
    {
      id: 'b6', tag: 'euler', ask: true, cols: 4,
      done: '12',
      prompt: L("6 cho'qqi, 8 yoq. Qirralar?", '6 вершин, 8 граней. Рёбра?', '6 vertices, 8 faces. Edges?'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '14', hint: L("Bu yig'indi. Eylerdan: olti plyus sakkiz minus ikki.", 'Это сумма. По Эйлеру: шесть плюс восемь минус два.', 'That is the sum. By Euler: six plus eight minus two.') },
        { id: 'c', label: '2', hint: L("Ikki bu formulaning natijasi.", 'Два это результат формулы.', 'Two is the formula result.') },
        { id: 'd', label: '16', hint: L("Ikkini ayirish kerak.", 'Нужно вычесть два.', 'Two must be subtracted.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi qirralar.", 'Теперь рёбра.', 'Now the edges.'),
    A('q3', "Eyler.", 'Эйлер.', 'Euler.'),
    A('q4', "Piramida.", 'Пирамида.', 'The pyramid.'),
    A('q5', "Boshqa asos.", 'Другое основание.', 'Another base.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'net_faces',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Asoslar unutilgan', 'Забыли основания', 'The bases were forgotten'),
  rows: [
    { id: 'r1', text: L('5 burchakli prizma', '5-угольная призма', 'a 5-gon prism') },
    { id: 'r2', text: L('yon yoqlar: 5', 'боковых граней: 5', 'side faces: 5') },
    { id: 'r3', text: L('demak yoqlar: 5', 'значит граней: 5', 'so faces: 5') },
    { id: 'r4', text: L('tekshiruv: 10 − 15 + 5 = 0', 'проверка: 10 − 15 + 5 = 0', 'check: 10 − 15 + 5 = 0') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Yon yoqlar to'g'ri sanalgan: beshta.", 'Боковые посчитаны верно: пять.', 'The side faces are right: five.'),
    r4: L("Bu satr xatoni ochib berdi: nol chiqdi, ikki emas. Lekin xatoning o'zi oldinroq.", 'Эта строка ошибку и обнаружила: вышел ноль, а не два. Но сама ошибка раньше.', 'This line exposed the error: zero came out, not two. But the error itself is earlier.'),
  },
  proofPoint: L('Eyler ikki bermadi', 'Эйлер не дал двойку', 'Euler did not give two'),
  proof: L(
    "Eyler formulasi tekshiruv bo'lib ishladi: nol chiqdi, ikki emas, demak sanashda xato bor. Xato uchinchi satrda: yon yoqlarga ikkita asos qo'shilmagan. Yoqlar yettita, va o'shanda o'n minus o'n besh plyus yetti ikkiga teng bo'ladi.",
    'Формула Эйлера сработала как проверка: вышел ноль, а не два, значит в счёте ошибка. Ошибка в третьей строке: к боковым не добавлены два основания. Граней семь, и тогда десять минус пятнадцать плюс семь равно двум.',
    'The Euler formula worked as a check: zero came out, not two, so the count is wrong. The error is on the third line: the two bases were not added. There are seven faces, and then ten minus fifteen plus seven equals two.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("asoslar qo'shilmagan", 'не добавлены основания', 'the bases were not added'), correct: true },
      { id: 'b', label: L("qirralar noto'g'ri", 'рёбра посчитаны неверно', 'the edges are wrong'), hint: L("Qirralar to'g'ri: uch karra besh o'n besh.", 'Рёбра верны: трижды пять пятнадцать.', 'The edges are right: three times five is fifteen.') },
      { id: 'c', label: L("cho'qqilar noto'g'ri", 'вершины посчитаны неверно', 'the vertices are wrong'), hint: L("Cho'qqilar to'g'ri: ikki karra besh o'n.", 'Вершины верны: дважды пять десять.', 'The vertices are right: twice five is ten.') },
      { id: 'd', label: L("Eyler formulasi ishlamaydi", 'формула Эйлера не работает', 'Euler fails here'), hint: L("Ishlaydi: aynan u xatoni ko'rsatdi.", 'Работает: именно она и показала ошибку.', 'It works: it is what exposed the error.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda oxirgi satr o'zi xatoni ochib berdi: Eyler ikki o'rniga nol chiqardi. Lekin xato oldinroq. Uni toping.", 'Здесь последняя строка сама обнаружила ошибку: Эйлер дал ноль вместо двух. Но ошибка раньше. Найди её.', 'Here the last line exposed the error itself: Euler gave zero instead of two. But the error is earlier. Find it.'),
    A('proof', "Qarang: yon yoqlar to'g'ri sanalgan, beshta. Lekin prizmada ikkita asos ham bor, va ular ham yoq. Yoqlar yettita bo'lishi kerak edi, va o'shanda Eyler ikki berardi.", 'Смотри: боковые посчитаны верно, пять. Но у призмы есть ещё два основания, и они тоже грани. Граней должно было быть семь, и тогда Эйлер дал бы два.', 'Look: the side faces are right, five. But a prism also has two bases, and they are faces too. There should have been seven faces, and then Euler would give two.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'net_faces',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('nechta asos bor', 'сколько оснований', 'how many bases'),
  tasks: [
    {
      prompt: L('4 burchakli prizma', '4-угольная призма', 'a 4-gon prism'),
      template: [L('yoqlar = 4 + ', 'граней = 4 + ', 'faces = 4 + '), { slot: 0 }, ' = ', { slot: 1 }],
      parts: ['2', '1', '6', '5'],
      answer: ['2', '6'],
      doneLabel: L('yoqlar: 6', 'граней: 6', 'faces: 6'),
      wrongs: [
        { key: '1|5', hint: L("Bitta asos piramidada. Prizmada ular ikkita.", 'Одно основание у пирамиды. У призмы их два.', 'One base belongs to a pyramid. A prism has two.') },
        { key: '*', hint: L("To'rt yon yoq plyus ikkita asos.", 'Четыре боковых плюс два основания.', 'Four sides plus two bases.') },
      ],
    },
    {
      prompt: L('4 burchakli piramida', '4-угольная пирамида', 'a 4-gon pyramid'),
      template: [L('yoqlar = 4 + ', 'граней = 4 + ', 'faces = 4 + '), { slot: 0 }, ' = ', { slot: 1 }],
      parts: ['1', '2', '5', '6'],
      answer: ['1', '5'],
      doneLabel: L('yoqlar: 5', 'граней: 5', 'faces: 5'),
      wrongs: [
        { key: '2|6', hint: L("Ikkita asos prizmada. Piramidaning yuqorisida cho'qqi turadi.", 'Два основания у призмы. У пирамиды сверху вершина.', 'Two bases belong to a prism. A pyramid has a vertex on top.') },
        { key: '*', hint: L("To'rt yon yoq plyus bitta asos.", 'Четыре боковых плюс одно основание.', 'Four sides plus one base.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi. Asos o'sha, lekin jism boshqa.", 'А теперь второе. Основание то же, а тело другое.', 'And now the second. The same base, a different solid.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'euler',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'V − E + F = 2',
  ruleLines: [
    L("yoq, qirra, cho'qqi -- asos tomonlaridan chiqadi", 'грани, рёбра, вершины выходят из сторон основания', 'faces, edges and vertices come from the base sides'),
    L("prizmada n + 2 yoq, piramidada n + 1", 'у призмы n + 2 грани, у пирамиды n + 1', 'a prism has n + 2 faces, a pyramid n + 1'),
    L("Eyler formulasi -- tekshiruv, ikki chiqishi shart", 'формула Эйлера это проверка: должно выйти два', 'Euler is a check: two must come out'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('prizmada yoqlar', 'граней у призмы', 'prism faces'),
      right: '8',
      map: { a: '6', b: '8', both: '7', none: '12' },
    },
    {
      screen: 5,
      expr: 'V − E + F',
      right: '2',
      map: { a: '2', b: '0', c: '1', d: '6' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '6 + 2 = 8',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Yoyilma ekraniga qayting', 'Вернись к экрану с развёрткой', 'Go back to the net screen'),
  },
  probe: {
    question: L(
      "Sanadingiz, Eyler ikki bermadi. Nima qilasiz?",
      'Посчитал, Эйлер не дал двойку. Что делать?',
      'You counted and Euler did not give two. What now?',
    ),
    items: [
      { id: 'a', label: L('qayta sanayman: xato menda', 'пересчитаю: ошибка у меня', 'recount: the error is mine'), correct: true },
      { id: 'b', label: L("formulani tashlab yuboraman", 'откажусь от формулы', 'drop the formula'), hint: L("Formula qavariq ko'pyoqlik uchun har doim ishlaydi.", 'Формула для выпуклого многогранника работает всегда.', 'The formula always holds for a convex polyhedron.') },
      { id: 'c', label: L("javobni shundayligicha yozaman", 'запишу ответ как есть', 'write the answer anyway'), hint: L("Tekshiruv aynan shuning uchun bor: u xatoni ushladi.", 'Проверка для того и есть: она поймала ошибку.', 'The check exists for exactly this: it caught the error.') },
      { id: 'd', label: L("jism noto'g'ri", 'тело неправильное', 'the solid is wrong'), hint: L("Ko'pincha jism to'g'ri, sanash esa yo'q.", 'Чаще тело верное, а счёт нет.', 'Usually the solid is fine and the count is not.') },
    ],
  },
  sheetTitle: L("Ko'pyoqliklar · shpargalka", 'Многогранники · шпаргалка', 'Polyhedra · cheat sheet'),
  sheetSrc: L('11-sinf · 26-dars', '11 класс · урок 26', 'Grade 11 · lesson 26'),
  lifehack: L(
    "Sanab bo'lgach, Eyler bilan tekshiring: bu bir soniya vaqt oladi va butun javobni saqlaydi.",
    'Посчитал — проверь Эйлером: это секунда времени и спасённый ответ.',
    'Once counted, check with Euler: one second of time, a saved answer.',
  ),
  holds: [2500, 5500, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Yoqlar sakkizta: asoslar ham yoq.", 'Вот твои прогнозы и вот как оказалось. Граней восемь: основания тоже грани.', 'Here are your guesses and here is how it turned out. Eight faces: the bases are faces too.'),
    A('rule', "Va mana asosiy fikr. Ko'pyoqlikning qismlarini yodlash shart emas, ularni sanash mumkin, va hammasi bitta sondan, asos tomonlari sonidan chiqadi. Va oxirida har doim Eyler formulasi bilan tekshiring: cho'qqilar minus qirralar plyus yoqlar ikkiga teng bo'lishi kerak. Ikki chiqmadimi, demak sanashda xato bor, va uni javobni topshirishdan oldin topish mumkin.", 'И вот главная мысль. Части многогранника не нужно запоминать, их можно сосчитать, и всё выходит из одного числа, из числа сторон основания. А в конце всегда проверяй формулой Эйлера: вершины минус рёбра плюс грани должно равняться двум. Если два не вышло, значит ошибка в счёте, и найти её можно до того, как сдашь ответ.', 'And here is the main point. The parts of a polyhedron need not be memorised, they can be counted, and everything comes from one number, the base side count. And at the end always check with Euler: vertices minus edges plus faces must equal two. If it does not, the count is wrong, and it can be found before the answer is handed in.'),
    A('q', "Oxirgi savol: Eyler ikki bermasa, nima qilasiz?", 'Последний вопрос: если Эйлер не дал двойку, что делать?', 'The last question: if Euler does not give two, what then?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
