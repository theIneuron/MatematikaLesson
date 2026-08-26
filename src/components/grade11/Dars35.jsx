// ============================================================================
// 11-sinf, Dars 35. FAZODA KOORDINATALAR.
//
// B5 blokining birinchi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpaceFrame`, `point` va `mid` rejimlari
//   darslik:  1-qism, 113-114 va 116-betlar, 1-7 va 25-28 masalalar,
//             bob testi 142-bet
//
// DARSNING BITTA GAPI: fazodagi joyni UCHTA son beradi, va ularning
// TARTIBI ma'noni o'zgartiradi -- har bir son o'z o'qiga bog'langan.
//
// XUK darslikning tarixiy ma'lumotidan (121-bet): Beruniy «tomonlar
// oltita» deydi, Ibn Sino «o'lchovlar uchta» deb javob beradi. Ikki javob,
// umumiy son yo'q -- aynan etalon talab qilgan shakl.
//
// SONLAR TEKSHIRILDI:
//   o'rta A(0;1;4), B(4;3;0) -> C(2;2;2)
//   o'rta M(1;-1;2), N(-3;2;4) -> C(-1;0,5;3)
//   uch C(3;4;6), A(1;2;8) -> B(5;6;4), chunki (1+5)/2=3, (2+6)/2=4, (8+4)/2=6
//   blits 4: (-7;1;4) va (-1;-3;0) -> (-4;-1;2)  [bob testi, 4-savol, kalit B]
//   13-slayd: applikatada AYIRMA olingan, to'g'risi (1+7)/2 = 4
//
// OKTANTA NOMERLARI ATAYLAB ISHLATILMAGAN: I-VIII raqamlash darslikning
// 1-rasmidan keladi, o'zimizdan boshqasini o'ylab chiqarish mumkin emas.
// Shuning uchun ekranda «pol tepasida yoki tagida» degan til ishlatiladi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_35',
  title: L('Fazoda koordinatalar', 'Координаты в пространстве', 'Coordinates in space'),
}

const BLOCK = { label: 'B5', from: 35, to: 41, current: 35 }

// ============================================================
// SLAYD 1. XUK. Beruniy va Ibn Sino.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Fazoda koordinatalar', 'Координаты в пространстве', 'Coordinates in space'),
  title: L('Nechta son yetadi', 'Скольких чисел хватит', 'How many numbers are enough'),
  expr: L('fazoda joy', 'место в пространстве', 'a place in space'),
  rows: [
    {
      id: 'a',
      name: L('Beruniy', 'Беруни', 'Beruni'),
      value: L('tomonlar oltita', 'сторон шесть', 'six sides'),
    },
    {
      id: 'b',
      name: L('Ibn Sino', 'Ибн Сино', 'Ibn Sina'),
      value: L("o'lchovlar uchta", 'измерений три', 'three dimensions'),
    },
  ],
  probe: {
    question: L(
      'Fazodagi joyni ko\'rsatish uchun nechta son kerak?',
      'Сколько чисел нужно, чтобы указать место в пространстве?',
      'How many numbers are needed to point out a place in space?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi tekshiramiz.',
      'Твой ответ записан. Сейчас проверим.',
      'Your answer is saved. Now we will check.',
    ),
    items: [
      { id: 'a', label: L('bitta', 'одно', 'one') },
      { id: 'b', label: L('ikkita', 'два', 'two') },
      { id: 'c', label: L('uchta', 'три', 'three') },
      { id: 'd', label: L("to'rtta", 'четыре', 'four') },
    ],
  },
  holds: [4000, 4500, 6500],
  audio: [
    A('mount', "Yangi blok boshlanadi. Fazoda joyni qanday ko'rsatish mumkin.", 'Начинается новый блок. Как указать место в пространстве.', 'A new block begins. How to point out a place in space.'),
    A('r1', "Beruniy so'raydi: nega faylasuflar figuraning tomonlari oltita deydi.", 'Беруни спрашивает, почему философы говорят, что у фигуры шесть сторон.', 'Beruni asks why the philosophers say a figure has six sides.'),
    A('r2', "Ibn Sino javob beradi. Har qanday figurada uchta o'lchov bor, ya'ni uzunlik, kenglik va chuqurlik. Tomonlar esa ikki barobar ko'p.", 'Ибн Сино отвечает. У любой фигуры три измерения, а именно длина, ширина и глубина. Сторон же вдвое больше.', 'Ibn Sino answers. Any figure has three dimensions, namely length, width and depth. The sides are twice as many.'),
    A('ask', "Sizningcha, fazodagi joyni ko'rsatish uchun nechta son kerak. Hozircha shunchaki taxmin qiling.", 'Как думаешь, сколько чисел нужно, чтобы указать место в пространстве. Пока просто предположи.', 'How many numbers do you think are needed to point out a place in space. Just make a guess for now.'),
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
    "Uchtasi ham quyi sinflardan. Bu baholanmaydi.",
    'Все три из младших классов. Это не оценивается.',
    'All three from the earlier grades. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Tekislikda koordinatalar', 'Координаты на плоскости', 'Coordinates on a plane'),
      short: L('quyi sinflardan', 'из младших классов', 'from earlier grades'),
      ex: [{ e: '(3; 2)', why: L("avval Ox bo'ylab, keyin Oy bo'ylab", 'сначала вдоль Ox, потом вдоль Oy', 'first along Ox, then along Oy') }],
    },
    {
      id: 'c2',
      title: L('Proyeksiya', 'Проекция', 'A projection'),
      short: L("o'qdagi soya", 'тень на оси', 'the shadow on an axis'),
      ex: [{ e: L("soya -- son", 'тень — число', 'the shadow is a number'), why: L('ishorasi bilan', 'со знаком', 'with its sign') }],
    },
    {
      id: 'c3',
      title: L('Parallelepiped', 'Параллелепипед', 'A box'),
      short: L("uch o'lchov", 'три измерения', 'three dimensions'),
      ex: [{ e: L('uzunlik, kenglik, balandlik', 'длина, ширина, высота', 'length, width, height'), why: L("bir cho'qqidan uchta qirra", 'из одной вершины три ребра', 'three edges from one vertex') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true, cols: 4,
      prompt: L('(3; 2) yozuvida birinchi son qaysi o\'q bo\'ylab?', 'В записи (3; 2) первое число идёт по какой оси?', 'In the record (3; 2), the first number goes along which axis?'),
      items: [
        { id: 'a', label: 'Ox', correct: true },
        { id: 'b', label: 'Oy', hint: L("Oy bo'ylab ikkinchi son yuradi.", 'По Oy идёт второе число.', 'The second number goes along Oy.') },
        { id: 'c', label: L('ikkalasi ham', 'обе', 'both'), hint: L("Har bir son bitta o'qqa bog'langan.", 'Каждое число привязано к одной оси.', 'Each number belongs to one axis.') },
        { id: 'd', label: L('farqi yo\'q', 'всё равно', 'it does not matter'), hint: L("Farqi bor: tartib joyni o'zgartiradi.", 'Разница есть: порядок меняет место.', 'It does matter: the order changes the place.') },
      ],
    },
    {
      id: 't2', ask: true, cols: 4,
      prompt: L('(0; 5) nuqta qayerda yotadi?', 'Где лежит точка (0; 5)?', 'Where does the point (0; 5) lie?'),
      items: [
        { id: 'a', label: L('Oy o\'qida', 'на оси Oy', 'on the Oy axis'), correct: true },
        { id: 'b', label: L('Ox o\'qida', 'на оси Ox', 'on the Ox axis'), hint: L("Nol abssissada turadi, ya'ni Ox bo'ylab yurmadik.", 'Ноль стоит у абсциссы, значит по Ox мы не шли.', 'The zero is the abscissa, so we did not move along Ox.') },
        { id: 'c', label: L('koordinata boshida', 'в начале координат', 'at the origin'), hint: L("Boshida ikkala son ham nol bo'lardi.", 'В начале координат оба числа были бы нулями.', 'At the origin both numbers would be zeros.') },
        { id: 'd', label: L('chorak ichida', 'внутри четверти', 'inside a quadrant'), hint: L("Ichida bo'lishi uchun nol bo'lmasligi kerak.", 'Внутри нулей быть не должно.', 'Inside there are no zeros.') },
      ],
    },
    {
      id: 't3', ask: true, cols: 4,
      prompt: L('Parallelepipedning bir cho\'qqisidan nechta qirra chiqadi?', 'Сколько рёбер выходит из одной вершины параллелепипеда?', 'How many edges leave one vertex of a box?'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '2', hint: L("Ikkitasi tekislikda bo'lardi, bu yerda uchinchi o'lcham bor.", 'Два было бы на плоскости, здесь есть третье измерение.', 'Two would be on a plane, here there is a third dimension.') },
        { id: 'c', label: '4', hint: L("To'rtta qirra bitta yoqda, cho'qqida esa uchta.", 'Четыре ребра у одной грани, а в вершине три.', 'Four edges belong to a face, a vertex has three.') },
        { id: 'd', label: '6', hint: L("Oltitasi yoqlarning soni.", 'Шесть это число граней.', 'Six is the number of faces.') },
      ],
    },
  ],
  holds: [3000, 4500, 4000, 5000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: tekislikda nuqtani ikkita son beradi, va birinchisi Ox bo'ylab yuradi.", 'Первая опора: на плоскости точку задают два числа, и первое идёт вдоль Ox.', 'The first basic: on a plane a point is given by two numbers, and the first goes along Ox.'),
    A('c2', "Ikkinchi tayanch: proyeksiya bu o'qdagi soya, va u ishorasi bilan son beradi.", 'Вторая опора: проекция это тень на оси, и она даёт число со знаком.', 'The second basic: a projection is a shadow on an axis, and it gives a signed number.'),
    A('c3', "Uchinchi tayanch: parallelepipedning bir cho'qqisidan uchta qirra chiqadi, va ular uchta o'lchovni beradi.", 'Третья опора: из одной вершины параллелепипеда выходят три ребра, и они дают три измерения.', 'The third basic: three edges leave one vertex of a box, and they give three dimensions.'),
    A('recap', "Uchtasi birga bugungi javobni beradi.", 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. MEZONNI O'ZI TOPADI: nechta nol kerak.
//
// Ikki da'vogar: «bitta nol yetadi» va «ikkita nol kerak». Har bir nuqta
// bittasini yiqitadi yoki tasdiqlaydi -- qoida aytilmaydi, KO'RINADI.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'octant_sign',
  eyebrow: L('Nollarni sanaymiz', 'Считаем нули', 'Counting the zeros'),
  title: L("Nuqta o'qda yotadimi", 'Лежит ли точка на оси', 'Does the point lie on an axis'),
  expr: L("mezon: nechta nol", 'признак: сколько нулей', 'the criterion: how many zeros'),
  goal: L("o'qda yotishini aniqlash", 'определить, лежит ли на оси', 'decide if it lies on an axis'),
  rule: L(
    "O'qda yotgan nuqtalarni izlaymiz. Har bir yozuvda nollarni sanaymiz.",
    'Ищем те точки, которые лежат на оси. В каждой записи считаем нули.',
    'We look for the points lying on an axis. In each record we count the zeros.',
  ),
  pick: L('Qaysi nuqtani tekshiramiz?', 'Какую точку проверим?', 'Which point shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('bitta nol yetadi', 'хватит одного нуля', 'one zero is enough'), value: '1' },
    { id: 'b', key: 'inB', name: L('ikkita nol kerak', 'нужно два нуля', 'two zeros are needed'), value: '2' },
  ],
  points: [
    {
      id: 'q1', label: '(2; 3; 0)', num: '(2; 3; 0)', step: 'calc', verdict: 'out',
      calc: L('bitta nol, Oxy tekisligi', 'один нуль, плоскость Oxy', 'one zero, the plane Oxy'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q2', label: '(0; 4; 5)', num: '(0; 4; 5)', step: 'calc', verdict: 'out',
      calc: L('bitta nol, Oyz tekisligi', 'один нуль, плоскость Oyz', 'one zero, the plane Oyz'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: '(0; 0; 3)', num: '(0; 0; 3)', step: 'calc', verdict: 'in',
      calc: L("ikkita nol, Oz o'qi", 'два нуля, ось Oz', 'two zeros, the Oz axis'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q4', label: '(5; 0; 0)', num: '(5; 0; 0)', step: 'calc', verdict: 'in',
      calc: L("ikkita nol, Ox o'qi", 'два нуля, ось Ox', 'two zeros, the Ox axis'),
      sol: true, inA: true, inB: true,
    },
  ],
  probe: {
    question: L(
      "Nuqta o'qda yotishi uchun nechta nol kerak?",
      'Сколько нулей нужно, чтобы точка лежала на оси?',
      'How many zeros are needed for a point to lie on an axis?',
    ),
    items: [
      { id: 'b', label: L('ikkita', 'два', 'two'), correct: true },
      { id: 'a', label: L('bitta', 'один', 'one'), hint: L("Bitta nol nuqtani tekislikda qoldiradi: qolgan ikkita son hali ishlayapti.", 'Один нуль оставляет точку в плоскости: два числа ещё работают.', 'One zero leaves the point in a plane: two numbers still work.') },
      { id: 'c', label: L('uchta', 'три', 'three'), hint: L("Uchta nol koordinata boshini beradi, va bu bitta nuqta, o'q emas.", 'Три нуля дают начало координат, а это одна точка, а не ось.', 'Three zeros give the origin, and that is one point, not an axis.') },
      { id: 'd', label: L('nol', 'ни одного', 'none'), hint: L("Nolsiz nuqta oktanta ichida turadi.", 'Без нулей точка стоит внутри октанта.', 'With no zeros the point stands inside an octant.') },
    ],
  },
  holds: [3000, 4500, 2500, 2600, 9000],
  audio: [
    A('mount', "Taxmin bor. Endi mezonni topamiz.", 'Прогноз есть. Теперь найдём признак.', 'The guess is made. Now let us find the criterion.'),
    A('mount', "Ikki da'vo bor. Biri bitta nol yetadi deydi, ikkinchisi ikkita nol kerak deydi.", 'Есть два утверждения. Одно говорит, что хватит одного нуля, а другое, что нужно два.', 'There are two claims. One says one zero is enough, the other says two are needed.'),
    A('mount', "To'rtta yozuvni birma bir tekshiramiz.", 'Проверим четыре записи по одной.', 'Let us check four records one by one.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana natija. Ikki, uch, nol va nol, to'rt, besh yozuvlarida bittagina nol bor, va ular tekislikda yotadi, o'qda emas. Nol, nol, uch va besh, nol, nol yozuvlarida esa ikkita nol bor, va faqat shular o'qda yotadi. Demak birinchi da'vo yiqildi: bitta nol yetmaydi.", 'Вот результат. В записях два, три, нуль и нуль, четыре, пять только один нуль, и они лежат в плоскости, а не на оси. В записях нуль, нуль, три и пять, нуль, нуль нулей два, и только они лежат на оси. Значит первое утверждение упало: одного нуля не хватает.', 'Here is the result. In the records two, three, zero and zero, four, five there is only one zero, and they lie in a plane, not on an axis. In the records zero, zero, three and five, zero, zero there are two zeros, and only those lie on an axis. So the first claim fell: one zero is not enough.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: NUQTA VA UNING PROYEKSIYALARI.
// Darslikning 2- va 3-rasmi. `showAt` -- nuqta qachon paydo bo'ladi,
// `projAt` -- proyeksiyalar qachon.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'projection_point',
  drag: false,
  graphSteps: 3,
  eyebrow: L('Chizma', 'Чертёж', 'The drawing'),
  title: L('Nuqta va uning soyalari', 'Точка и её тени', 'A point and its shadows'),
  chip: 'A (2; 3; 4)',
  space: {
    mode: 'point',
    box: [5, 5, 5],
    frame: true,
    axisNums: true,
    interactive: true,
    // Kabinet proyeksiyasida chizma kvadratga yaqin, ya'ni ENI bilan emas,
    // BALANDLIGI bilan cheklanadi: 158 da u panelda juda kichik ko'rinardi.
    height: 200,
    projAt: 2,
    points: [
      { at: [2, 3, 4], label: 'A', tone: 'accent', proj: true, coords: true, showAt: 1 },
    ],
    caption: L('karkasni barmoq bilan burish mumkin', 'каркас можно повернуть пальцем', 'you can turn the frame with a finger'),
  },
  bonus: L(
    "Soya nuqtaning O'ZI emas. Uni almashtirib qo'yish blokning eng qimmat xatosi: javobda uch son o'rniga ikkitasi qoladi.",
    'Тень это НЕ сама точка. Подмена одного другим — самая дорогая ошибка блока: в ответе вместо трёх чисел остаётся два.',
    'A shadow is NOT the point itself. Swapping one for the other is the costliest error of this block: the answer keeps two numbers instead of three.',
  ),
  probe: {
    question: L(
      "Qaysi yozuv Oy o'qidagi soyaga tegishli?",
      'Какая запись принадлежит тени на оси Oy?',
      'Which record belongs to the shadow on the Oy axis?',
    ),
    items: [
      { id: 'a', label: '(0; 3; 0)', correct: true },
      { id: 'b', label: '(2; 3; 0)', hint: L("Bunda ikkita son noldan farqli, ya'ni bu tekislikdagi soya.", 'Здесь два числа отличны от нуля, значит это тень на плоскости.', 'Here two numbers are nonzero, so this is a shadow on a plane.') },
      { id: 'c', label: '(2; 0; 0)', hint: L("Bu Ox o'qidagi soya: noldan farqli son abssissa.", 'Это тень на оси Ox: отлично от нуля первое число.', 'That is the shadow on Ox: the nonzero number is the first one.') },
      { id: 'd', label: '(2; 3; 4)', hint: L("Bu nuqtaning o'zi, unda birorta nol yo'q.", 'Это сама точка, в ней нет ни одного нуля.', 'That is the point itself, it has no zeros.') },
    ],
  },
  holds: [3500, 6500, 6000],
  audio: [
    A('mount', "Mezon topildi. Endi chizmaga qaraymiz. Uchta o'zaro perpendikular o'q va kataklar.", 'Признак найден. Теперь посмотрим на чертёж. Три взаимно перпендикулярные оси и клетки.', 'The criterion is found. Now let us look at the drawing. Three mutually perpendicular axes and a grid.'),
    A('one', "A nuqta paydo bo'ldi. Unga yo'l uchta qadamdan iborat. Ox bo'ylab ikki, keyin Oy bo'ylab uch, keyin tepaga to'rt.", 'Появилась точка A. Путь к ней из трёх шагов. По Ox два, потом по Oy три, потом вверх четыре.', 'The point A appeared. The path to it takes three steps. Along Ox two, then along Oy three, then up four.'),
    A('two', "Endi soyalar. Pastdagi soya polda yotadi, qolgan uchtasi o'qlarda. Ularning har biri nuqtaning bitta sonini beradi.", 'Теперь тени. Нижняя лежит на полу, остальные три на осях. Каждая из них даёт одно число точки.', 'Now the shadows. The lower one lies on the floor, the other three on the axes. Each of them gives one number of the point.'),
    A('three', "Diqqat qiling: soya nuqtaning o'zi emas. Polda yotgan soyada applikata yo'qoladi, o'qdagi soyada esa faqat bitta son qoladi. Aynan shu almashinuv butun blok davomida xatoga olib keladi.", 'Обрати внимание: тень это не сама точка. У тени на полу теряется аппликата, у тени на оси остаётся только одно число. Именно эта подмена и приводит к ошибке во всём блоке.', 'Note this: a shadow is not the point itself. The floor shadow loses the applicate, the axis shadow keeps only one number. This very swap causes errors through the whole block.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1. Tartib.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'coord_order',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Uchlik va tartib', 'Тройка и порядок', 'The triple and the order'),
  rows: [
    'A (2; 3; 4)',
    '(2; 0; 3)  ≠  (3; 0; 2)',
  ],
  probe: {
    question: L(
      '(2; 0; 3) va (3; 0; 2) bitta nuqtami?',
      '(2; 0; 3) и (3; 0; 2) это одна точка?',
      'Are (2; 0; 3) and (3; 0; 2) one point?',
    ),
    items: [
      { id: 'a', label: L("yo'q", 'нет', 'no'), correct: true },
      { id: 'b', label: L('ha, sonlar bir xil', 'да, числа те же', 'yes, the same numbers'), hint: L("Sonlar bir xil, lekin har biri o'z o'qiga bog'langan.", 'Числа те же, но каждое привязано к своей оси.', 'The numbers are the same, but each belongs to its own axis.') },
      { id: 'c', label: L('ha, ikkisi ham bir tekislikda', 'да, обе в одной плоскости', 'yes, both in one plane'), hint: L("Ikkisi ham bir tekislikda yotadi, lekin tekislik nuqtani belgilamaydi.", 'Обе действительно лежат в одной плоскости, но плоскость не задаёт точку.', 'Both do lie in one plane, but a plane does not fix a point.') },
      { id: 'd', label: L("chizmasiz aytib bo'lmaydi", 'без чертежа не сказать', 'cannot tell without a drawing'), hint: L("Chizma kerak emas: tartib allaqachon hammasini aytdi.", 'Чертёж не нужен: порядок уже всё определяет.', 'No drawing is needed: the order has already told everything.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Uchlik', 'Правило 1. Тройка', 'Rule 1. The triple'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: '(x; y; z)',
    lines: [
      L('birinchi son abssissa, ikkinchisi ordinata, uchinchisi applikata', 'первое число абсцисса, второе ордината, третье аппликата', 'the first number is the abscissa, the second the ordinate, the third the applicate'),
      L("tartib almashtirilmaydi: har bir son o'z o'qida", 'порядок не переставляется: каждое число на своей оси', 'the order is fixed: each number sits on its own axis'),
      L('bitta nol tekislikni beradi, ikkita nol esa o\'qni', 'один нуль даёт плоскость, два нуля дают ось', 'one zero gives a plane, two zeros give an axis'),
      L('nol bo\'lmasa nuqta oktanta ichida', 'если нулей нет, точка внутри октанта', 'with no zeros the point is inside an octant'),
    ],
    example: L('misol:  A (2; 3; 4)', 'пример:  A (2; 3; 4)', 'example:  A (2; 3; 4)'),
  },
  holds: [4000, 7000, 4500],
  audio: [
    A('mount', 'Soyalar ko\'rildi. Endi qoidani yozamiz.', 'Тени увидели. Теперь запишем правило.', 'We saw the shadows. Now let us write the rule.'),
    A('def', "Fazodagi nuqtani uchta son beradi va ular qat'iy tartibda yoziladi. Birinchisi abssissa, ikkinchisi ordinata, uchinchisi applikata. Ikki, nol, uch va uch, nol, ikki yozuvlarida sonlar bir xil, lekin nuqtalar boshqa: birinchisida Ox bo'ylab ikki qadam, ikkinchisida esa uch qadam.", 'Точку в пространстве задают три числа, и они пишутся в строгом порядке. Первое абсцисса, второе ордината, третье аппликата. В записях два, нуль, три и три, нуль, два числа те же, а точки разные: в первой по Ox два шага, во второй три.', 'A point in space is given by three numbers written in a strict order. The first is the abscissa, the second the ordinate, the third the applicate. In the records two, zero, three and three, zero, two the numbers match, but the points differ: the first takes two steps along Ox, the second three.'),
    A('rule', "To'g'ri. Va tekshiruv oson: nollarni sanang. Bitta nol tekislikni beradi, ikkitasi o'qni.", 'Верно. И проверка простая: посчитай нули. Один нуль даёт плоскость, два нуля ось.', 'Correct. And the check is simple: count the zeros. One zero gives a plane, two zeros an axis.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: manfiy koordinatalar.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'octant_sign',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Manfiy sonlar paydo bo\'ldi', 'Появились отрицательные числа', 'Negative numbers appeared'),
  was: { label: UI.was, expr: 'A (2; 3; 4)' },
  now: { label: UI.now, expr: 'P (−2; 3; −4)' },
  probe1: {
    cols: 2,
    question: L('P nuqta polning tepasidami yoki tagida?', 'Точка P выше пола или ниже?', 'Is the point P above the floor or below?'),
    items: [
      { id: 'a', label: L('tagida', 'ниже', 'below'), correct: true },
      { id: 'b', label: L('tepasida', 'выше', 'above'), hint: L("Balandlikni applikata beradi, va u minus to'rt.", 'Высоту даёт аппликата, а она минус четыре.', 'The height comes from the applicate, and it is minus four.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L(
      'Uchta koordinata tekisligi fazoni nechta bo\'lakka bo\'ladi?',
      'На сколько частей три координатные плоскости делят пространство?',
      'Into how many parts do the three coordinate planes cut space?',
    ),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '4' },
      { id: 'b', label: '6' },
      { id: 'c', label: '8' },
      { id: 'd', label: '12' },
    ],
  },
  holds: [3900, 5000, 3000],
  audio: [
    A('mount', "Qoida yozildi. Endi holat o'zgaradi.", 'Правило записано. Теперь случай меняется.', 'The rule is written. Now the case changes.'),
    A('now', "Sonlar manfiy bo'lishi mumkin. Minus ikki degani Ox bo'ylab teskari tomonga ikki qadam, minus to'rt degani polning tagiga to'rt qadam.", 'Числа могут быть отрицательными. Минус два значит два шага по Ox в обратную сторону, минус четыре значит четыре шага ниже пола.', 'Numbers may be negative. Minus two means two steps back along Ox, minus four means four steps below the floor.'),
    A('q1', "P nuqta polning tepasidami yoki tagida?", 'Точка P выше пола или ниже?', 'Is the point P above the floor or below?'),
    A('q2', "Endi taxmin qiling: uchta tekislik fazoni nechta bo'lakka bo'ladi.", 'Теперь предположи: на сколько частей три плоскости делят пространство.', 'Now make a guess: into how many parts do the three planes cut space.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI YO'L, IKKI NUQTA. Javobni o'quvchi yozadi.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'coord_order',
  eyebrow: L('Ikki yo\'l', 'Два пути', 'Two paths'),
  title: L('Bir xil sonlar, boshqa joy', 'Те же числа, другое место', 'The same numbers, another place'),
  expr: 'K (1; 3; 2)',
  need: L('yozuvdagi tartib', 'порядок в записи', 'the order in the record'),
  answerLabel: L('Dilnoza yetgan nuqta', 'точка, куда пришла Дилноза', 'the point Dilnoza reached'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L("Ox bo'ylab 1, keyin Oy bo'ylab 3", 'по Ox 1, потом по Oy 3', 'along Ox 1, then along Oy 3'),
      point: {
        label: L('yo\'l oxiri', 'конец пути', 'the end of the path'),
        calc: '(1; 3; 2)',
        verdict: 'in',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L("Oy bo'ylab 1, keyin Ox bo'ylab 3", 'по Oy 1, потом по Ox 3', 'along Oy 1, then along Ox 3'),
      point: {
        label: L('yo\'l oxiri', 'конец пути', 'the end of the path'),
        calc: '(3; 1; 2)',
        verdict: 'out',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(3; 1; 2)', '(1; 3; 2)', '(2; 1; 3)', '(3; 2; 1)'],
    value: ['(3; 1; 2)'],
    label: 'K₁ =',
    prompt: L('Dilnoza nuqtasini yozing', 'Запиши точку Дилнозы', 'Write Dilnoza point'),
    wrongs: [
      { key: '(1; 3; 2)', hint: L("Bu K nuqtaning o'zi, ya'ni Aziz yetgan joy.", 'Это сама точка K, то есть место Азиза.', 'That is the point K itself, where Aziz arrived.') },
      { key: '(2; 1; 3)', hint: L("Applikata o'z joyida qoladi: u ikki.", 'Аппликата остаётся на месте: она два.', 'The applicate stays put: it is two.') },
      { key: '*', hint: L("Dilnoza Oy bo'ylab bir qadam, Ox bo'ylab uch qadam yurdi. Abssissa uch, ordinata bir.", 'Дилноза идёт по Oy один шаг, по Ox три. Абсцисса три, ордината один.', 'Dilnoza took one step along Oy and three along Ox. The abscissa is three, the ordinate one.') },
    ],
  },
  holds: [4500, 4000, 6500],
  audio: [
    A('mount', "Taxmin bor, va javob shu. Uchta tekislik fazoni sakkiz bo'lakka bo'ladi, va har biri oktanta deb ataladi. Endi tartibga qaytamiz.", 'Прогноз есть, и вот ответ. Три плоскости делят пространство на восемь частей, и каждая называется октантом. Теперь вернёмся к порядку.', 'The guess is made, and here is the answer. Three planes cut space into eight parts, and each is called an octant. Now back to the order.'),
    A('p1', "Aziz yozuvni to'g'ri o'qidi. Ox bo'ylab bir, Oy bo'ylab uch, tepaga ikki. U K nuqtaga tushdi.", 'Азиз прочитал запись верно. По Ox один, по Oy три, вверх два. Он попал в точку K.', 'Aziz read the record correctly. Along Ox one, along Oy three, up two. He landed on the point K.'),
    A('p2', "Dilnoza esa birinchi sonni Oy bo'ylab, ikkinchisini Ox bo'ylab oladi. Natijada boshqa joy chiqadi, garchi sonlar bir xil bo'lsa ham.", 'А Дилноза первое число берёт по Oy, второе по Ox. В итоге выходит другое место, хотя числа те же.', 'Dilnoza takes the first number along Oy and the second along Ox. The result is another place, though the numbers match.'),
    A('write', 'Uning nuqtasini yozing.', 'Запиши её точку.', 'Write her point.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2. Kesma o'rtasi, keyin ikkisi bitta qoidaga yig'iladi.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'mid_ratio',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Kesma o\'rtasi', 'Середина отрезка', 'The midpoint of a segment'),
  cases: [
    {
      label: L('joy', 'место', 'the place'),
      text: L('uchta son, tartib bilan', 'три числа, по порядку', 'three numbers, in order'),
      tone: 'graph',
    },
    {
      label: L("o'rta", 'середина', 'the midpoint'),
      text: L("yig'indi ikkiga bo'linadi", 'сумма делится на два', 'the sum is halved'),
      tone: 'accent',
    },
  ],
  rows: [
    'A (0; 1; 4),  B (4; 3; 0)',
    'C (2; 2; 2)',
  ],
  probe: {
    question: L(
      'AB kesmaning o\'rtasi qanday topiladi?',
      'Как находят середину отрезка AB?',
      'How is the midpoint of AB found?',
    ),
    items: [
      { id: 'a', label: L("koordinatalar qo'shiladi va ikkiga bo'linadi", 'координаты складываются и делятся на два', 'the coordinates are added and halved'), correct: true },
      { id: 'b', label: L("ayiriladi va ikkiga bo'linadi", 'вычитаются и делятся на два', 'they are subtracted and halved'), hint: L("Ayirma uzunlikni beradi, o'rtani esa yarim yig'indi.", 'Разность даёт длину, а середину даёт полусумма.', 'A difference gives a length, the midpoint comes from the half sum.') },
      { id: 'c', label: L("faqat qo'shiladi", 'только складываются', 'they are only added'), hint: L("Yig'indi kesmadan tashqariga chiqadi: ikkiga bo'lish shart.", 'Сумма выходит за отрезок: делить на два обязательно.', 'The sum leaves the segment: halving is required.') },
      { id: 'd', label: L('kattasi olinadi', 'берётся большее', 'the larger is taken'), hint: L("Katta uch bo'lsa ham o'rta ikki chiqadi: bu yarim yig'indi.", 'Даже если большее три, середина выходит два: это полусумма.', 'Even if the larger is three, the midpoint is two: it is the half sum.') },
    ],
  },
  rule: {
    badge: L('2-qoida. O\'rta', 'Правило 2. Середина', 'Rule 2. The midpoint'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'x = (x₁ + x₂) / 2',
    lines: [
      L('y va z ham xuddi shunday topiladi', 'y и z находят точно так же', 'y and z are found in the same way'),
      L('har bir koordinata alohida ishlaydi', 'каждая координата работает отдельно', 'each coordinate works on its own'),
      L("λ nisbatda bo'lish ham shu yo'l bilan", 'деление в отношении λ идёт тем же путём', 'dividing in a ratio λ goes the same way'),
      L('tekshiruv: o\'rta ikki uchning orasida turadi', 'проверка: середина стоит между концами', 'a check: the midpoint sits between the ends'),
    ],
    example: L('misol:  (0 + 4) / 2 = 2', 'пример:  (0 + 4) / 2 = 2', 'example:  (0 + 4) / 2 = 2'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('har bir koordinata o\'z o\'qi bilan ishlaydi', 'каждая координата работает со своей осью', 'each coordinate works with its own axis'),
    lines: [
      L('1. joy uchta son bilan beriladi', '1. место задаётся тремя числами', '1. a place is given by three numbers'),
      L('2. tartib almashtirilmaydi', '2. порядок не переставляется', '2. the order is not swapped'),
      L('3. nollar joyni aytadi', '3. нули говорят о месте', '3. the zeros tell the place'),
      L('4. o\'rta har bir koordinatada alohida sanaladi', '4. середина считается по каждой координате отдельно', '4. the midpoint is computed coordinate by coordinate'),
    ],
  },
  holds: [4000, 8000, 2600],
  audio: [
    A('mount', "Tartib tekshirildi. Endi ikkinchi qoida.", 'Порядок проверили. Теперь второе правило.', 'The order is checked. Now the second rule.'),
    A('rows', "A nuqta nol, bir, to'rtda, B nuqta to'rt, uch, nolda. O'rtasini topish uchun har bir koordinatani alohida olamiz. Nol plyus to'rt bo'lingan ikki teng ikki. Bir plyus uch bo'lingan ikki teng ikki. To'rt plyus nol bo'lingan ikki teng ikki. Demak o'rtasi ikki, ikki, ikki.", 'Точка A в нуле, единице, четырёх, точка B в четырёх, трёх, нуле. Чтобы найти середину, берём каждую координату отдельно. Нуль плюс четыре делить на два равно два. Один плюс три делить на два равно два. Четыре плюс нуль делить на два равно два. Значит середина два, два, два.', 'The point A is at zero, one, four, the point B at four, three, zero. To find the midpoint we take each coordinate on its own. Zero plus four over two is two. One plus three over two is two. Four plus zero over two is two. So the midpoint is two, two, two.'),
    A('rule', "To'g'ri.", 'Верно.', 'Correct.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'octant_sign',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L('Q nuqta polning TAGIDA', 'точка Q НИЖЕ пола', 'the point Q is BELOW the floor'),
  template: ['Q ( −2 ;  3 ;  ', { slot: 0 }, ' 4 )'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    "Pol tagida applikata manfiy",
    'Ниже пола аппликата отрицательна',
    'Below the floor the applicate is negative',
  ),
  wrongs: [
    { key: '+', hint: L("Musbat applikata nuqtani polning tepasiga olib chiqadi. Shart esa tagida deydi.", 'Положительная аппликата поднимает точку выше пола. А в условии сказано ниже.', 'A positive applicate lifts the point above the floor. The problem says below.') },
  ],
  probe: {
    question: L('Q ning ordinatasi qanday?', 'Какова ордината Q?', 'What is the ordinate of Q?'),
    items: [
      { id: 'a', label: L('musbat', 'положительна', 'positive'), correct: true },
      { id: 'b', label: L('manfiy', 'отрицательна', 'negative'), hint: L("Ordinata ikkinchi son, va u uch.", 'Ордината это второе число, и оно три.', 'The ordinate is the second number, and it is three.') },
      { id: 'c', label: L('nol', 'ноль', 'zero'), hint: L("Nol bo'lsa nuqta tekislikka tushib qolardi, oktanta ichida emas.", 'Если бы ноль, точка попала бы на плоскость, а не внутрь октанта.', 'If it were zero, the point would land on a plane, not inside an octant.') },
      { id: 'd', label: L("aniqlanmaydi", 'не определить', 'cannot tell'), hint: L("Aniqlanadi: yozuvda ikkinchi son uch.", 'Определяется: в записи второе число три.', 'It can: the second number in the record is three.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Applikataning ishorasini qo'ying.", 'Поставь знак аппликаты.', 'Place the sign of the applicate.'),
    A('checked', "Bo'ldi. Endi ordinata haqida javob bering.", 'Готово. Теперь ответь про ординату.', 'Done. Now answer about the ordinate.'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ. Sonlar darslikning 28-masalasidan.
// ============================================================
const ACTIONS_10 = [
  { id: 'sum', label: L("koordinatalarni qo'shish", 'сложить координаты', 'add the coordinates') },
  { id: 'half', label: L("ikkiga bo'lish", 'поделить на два', 'halve it') },
  { id: 'diff', label: L('koordinatalarni ayirish', 'вычесть координаты', 'subtract the coordinates') },
  { id: 'dbl', label: L("ikkiga ko'paytirish", 'умножить на два', 'double it') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'mid_ratio',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('M (1; −1; 2),  N (−3; 2; 4).  O\'rtasi?', 'M (1; −1; 2),  N (−3; 2; 4).  Середина?', 'M (1; −1; 2),  N (−3; 2; 4).  The midpoint?'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'sum',
      to: '(−2; 1; 6)',
      wrongs: [
        { action: 'diff', hint: L("Ayirma kesmaning uzunligiga kerak, o'rtaga esa yig'indi.", 'Разность нужна длине отрезка, а середине сумма.', 'A difference is for the segment length, the midpoint needs a sum.') },
        { action: 'half', hint: L("Avval nimani bo'lishni toping.", 'Сначала найди, что делить.', 'First find what to halve.') },
        { action: 'dbl', hint: L("Ikkiga ko'paytirish teskari masalada kerak bo'ladi.", 'Умножение на два понадобится в обратной задаче.', 'Doubling will be needed in the reverse task.') },
      ],
    },
    {
      action: 'half',
      to: '(−1; 0,5; 3)',
      wrongs: [
        { action: 'sum', hint: L("Qo'shildi: minus ikki, bir, olti.", 'Сложено: минус два, один, шесть.', 'Added: minus two, one, six.') },
        { action: 'diff', hint: L("Ayirish kerak emas.", 'Вычитать не нужно.', 'No subtraction needed.') },
        { action: 'dbl', hint: L("Ikkiga bo'lish kerak, ko'paytirish emas.", 'Нужно делить на два, а не умножать.', 'We must halve, not double.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(−1; 0,5; 3)', '(−2; 1; 6)', '(−4; 3; 2)', '(1; 0,5; 3)'],
    value: ['(−1; 0,5; 3)'],
    label: 'C =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '(−2; 1; 6)', hint: L("Bu yig'indi, ikkiga bo'linmagan.", 'Это сумма, не поделённая на два.', 'That is the sum, not halved.') },
      { key: '(−4; 3; 2)', hint: L("Bu ayirma: minus uch minus bir. O'rtaga yig'indi kerak.", 'Это разность: минус три минус один. Середине нужна сумма.', 'That is the difference: minus three minus one. The midpoint needs a sum.') },
      { key: '(1; 0,5; 3)', hint: L("Birinchi koordinatada ishora yo'qolgan: bir plyus minus uch minus ikki beradi.", 'В первой координате потерян знак: один плюс минус три даёт минус два.', 'The sign is lost in the first coordinate: one plus minus three gives minus two.') },
      { key: '*', hint: L("Yig'indi minus ikki, bir, olti. Har birini ikkiga bo'ling.", 'Сумма минус два, один, шесть. Поделили каждое на два.', 'The sum is minus two, one, six. Halve each of them.') },
    ],
  },
  audio: [
    A('mount', 'Ishora qo\'yildi. Endi masalani o\'tamiz.', 'Знак поставлен. Пройдём задачу.', 'The sign is placed. Let us work a problem.'),
    A('start', "Diqqat: ro'yxatda teskari masalaning amallari ham bor. Ular hozir ortiqcha.", 'Внимание: в списке есть действия обратной задачи. Сейчас они лишние.', 'Careful: the list holds actions of the reverse task. They are superfluous now.'),
    A('step3', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL, IMTIHONDAGIDEK. Teskari masala, o'q yo'q.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'mid_ratio',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  // Shart QISQA: telefonda uzun satr 66 px kesilardi, va `.stage-content`
  // clip qilgani uchun kesilish JIMGINA bo'lardi.
  start: L("o'rta C (3; 4; 6),  A (1; 2; 8)", 'середина C (3; 4; 6),  A (1; 2; 8)', 'midpoint C (3; 4; 6),  A (1; 2; 8)'),
  actions: ACTIONS_10,
  hint: L(
    "O'rta yarim yig'indi, demak yig'indi o'rtaning ikki barobari.",
    'Середина это полусумма, значит сумма это две середины.',
    'The midpoint is the half sum, so the sum is twice the midpoint.',
  ),
  steps: [
    {
      action: 'dbl',
      to: '(6; 8; 12)',
      wrongs: [
        { action: 'sum', hint: L("Qo'shish uchun ikkinchi uch yo'q, u izlanyapti.", 'Складывать нечего: второй конец пока неизвестен.', 'Nothing to add: the second end is unknown yet.') },
        { action: 'half', hint: L("Bo'lish to'g'ri masalada edi, bu teskari.", 'Деление было в прямой задаче, эта обратная.', 'Halving belonged to the direct task, this one is reverse.') },
        { action: 'diff', hint: L("Avval o'rtani ikkiga ko'paytiring.", 'Сначала удвой середину.', 'First double the midpoint.') },
      ],
    },
    {
      action: 'diff',
      to: '(5; 6; 4)',
      wrongs: [
        { action: 'dbl', hint: L("Ikkilantirildi: olti, sakkiz, o'n ikki.", 'Удвоено: шесть, восемь, двенадцать.', 'Doubled: six, eight, twelve.') },
        { action: 'sum', hint: L("Qo'shish yana kattaroq son beradi, B esa kichikroq.", 'Сложение даст ещё большее число, а B меньше.', 'Adding gives a larger number, while B is smaller.') },
        { action: 'half', hint: L("Ikkiga bo'lish bu yerda kerak emas.", 'Делить на два здесь не нужно.', 'No halving is needed here.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(5; 6; 4)', '(2; 3; 7)', '(4; 6; 14)', '(−1; 0; 10)'],
    value: ['(5; 6; 4)'],
    label: 'B =',
    prompt: L('B ni yozing', 'Запиши B', 'Write B'),
    wrongs: [
      { key: '(2; 3; 7)', hint: L("Bu A va C ning o'rtasi, ya'ni yana bitta o'rta.", 'Это середина A и C, то есть ещё одна середина.', 'That is the midpoint of A and C, one more midpoint.') },
      { key: '(4; 6; 14)', hint: L("Bu A va C ning yig'indisi. Ikkilantirish C ga tegishli.", 'Это сумма A и C. Удваивать нужно C.', 'That is the sum of A and C. It is C that must be doubled.') },
      { key: '(−1; 0; 10)', hint: L("Bu yerda A ikkilantirilgan. Ikkilantirish o'rtaga tegishli.", 'Здесь удвоено A. Удваивать нужно середину.', 'Here A was doubled. The midpoint is what must be doubled.') },
      { key: '*', hint: L("Ikki karra uch olti, minus bir, besh chiqadi. Qolganlarini ham shunday.", 'Дважды три шесть, минус один, выходит пять. С остальными так же.', 'Twice three is six, minus one gives five. The same for the rest.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Teskari masala: o'rta ma'lum, bitta uch ma'lum, ikkinchisi kerak.", 'Обратная задача: середина известна, один конец известен, нужен второй.', 'A reverse task: the midpoint is known, one end is known, the other is needed.'),
    A('answered', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS. Oltita savol, tushuntirishda uchramagan sonlar.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol', 'Шесть вопросов', 'Six questions'),
  items: [
    {
      // Ikki ustun: to'rttada uzun variantlar telefonda kesilardi.
      id: 'b1', tag: 'octant_sign', ask: true, cols: 2,
      done: L("Oy o'qida", 'на оси Oy', 'on the Oy axis'),
      prompt: L('(0; −7; 0) qayerda yotadi?', 'Где лежит (0; −7; 0)?', 'Where does (0; −7; 0) lie?'),
      items: [
        { id: 'a', label: L("Oy o'qida", 'на оси Oy', 'on the Oy axis'), correct: true },
        { id: 'b', label: L('Oxy tekisligida', 'в плоскости Oxy', 'in the plane Oxy'), hint: L("Bitta nol tekislikni berardi, bu yerda ular ikkita.", 'Один нуль оставил бы точку в плоскости, а здесь их два.', 'One zero would leave it in a plane, here there are two.') },
        { id: 'c', label: L("Ox o'qida", 'на оси Ox', 'on the Ox axis'), hint: L("Noldan farqli son ikkinchi o'rinda, ya'ni ordinata.", 'Отлично от нуля второе число, то есть ордината.', 'The nonzero number is the second one, the ordinate.') },
        { id: 'd', label: L('koordinata boshida', 'в начале координат', 'at the origin'), hint: L("Boshida uchala son ham nol.", 'В начале координат все три числа нули.', 'At the origin all three numbers are zeros.') },
      ],
    },
    {
      id: 'b2', tag: 'coord_order', ask: true, cols: 2,
      done: L("yo'q", 'нет', 'no'),
      prompt: L('(5; −2; 6) va (6; −2; 5) bitta nuqtami?', '(5; −2; 6) и (6; −2; 5) это одна точка?', 'Are (5; −2; 6) and (6; −2; 5) one point?'),
      items: [
        { id: 'a', label: L("yo'q", 'нет', 'no'), correct: true },
        { id: 'b', label: L('ha', 'да', 'yes'), hint: L("Abssissa va applikata o'rin almashdi, joy o'zgardi.", 'Абсцисса и аппликата поменялись местами, место изменилось.', 'The abscissa and the applicate swapped, so the place changed.') },
      ],
    },
    {
      id: 'b3', tag: 'projection_point', ask: true, cols: 4,
      done: '(4; 5; 0)',
      prompt: L('(4; 5; −3) ning Oxy dagi soyasi?', 'Тень (4; 5; −3) на Oxy?', 'The shadow of (4; 5; −3) on Oxy?'),
      items: [
        { id: 'a', label: '(4; 5; 0)', correct: true },
        { id: 'b', label: '(4; 5; −3)', hint: L("Bu nuqtaning o'zi, soyada applikata nolga aylanadi.", 'Это сама точка, у тени аппликата становится нулём.', 'That is the point itself, a shadow zeroes the applicate.') },
        { id: 'c', label: '(0; 0; −3)', hint: L("Bu Oz o'qidagi soya.", 'Это тень на оси Oz.', 'That is the shadow on the Oz axis.') },
        { id: 'd', label: '(4; 0; −3)', hint: L("Bu boshqa tekislikdagi soya: nolga ordinata aylandi.", 'Это тень в другой плоскости: нулём стала ордината.', 'That is a shadow in another plane: the ordinate became zero.') },
      ],
    },
    {
      id: 'b4', tag: 'mid_ratio', ask: true, cols: 4,
      done: '(−4; −1; 2)',
      prompt: L('(−7; 1; 4) va (−1; −3; 0) o\'rtasi?', 'Середина (−7; 1; 4) и (−1; −3; 0)?', 'The midpoint of (−7; 1; 4) and (−1; −3; 0)?'),
      items: [
        { id: 'a', label: '(−4; −1; 2)', correct: true },
        { id: 'b', label: '(−8; −2; 4)', hint: L("Bu yig'indi, ikkiga bo'linmagan.", 'Это сумма, не поделённая на два.', 'That is the sum, not halved.') },
        { id: 'c', label: '(3; −2; −2)', hint: L("Bu ayirmaning yarmi. O'rtaga yig'indi kerak.", 'Это половина разности. Середине нужна сумма.', 'That is half the difference. The midpoint needs a sum.') },
        { id: 'd', label: '(−4; 1; 2)', hint: L("Ordinatada ishora yo'qolgan: bir plyus minus uch minus ikki.", 'В ординате потерян знак: один плюс минус три это минус два.', 'The sign is lost in the ordinate: one plus minus three is minus two.') },
      ],
    },
    {
      id: 'b5', tag: 'mid_ratio', ask: true, cols: 4,
      done: '(6; 6; 6)',
      prompt: L("C (5; 5; 5) bu o'rta, A (4; 4; 4). B?", 'C (5; 5; 5) это середина, A (4; 4; 4). Найди B', 'C (5; 5; 5) is the midpoint, A (4; 4; 4). Find B'),
      items: [
        { id: 'a', label: '(6; 6; 6)', correct: true },
        { id: 'b', label: '(4,5; 4,5; 4,5)', hint: L("Bu A va C ning o'rtasi.", 'Это середина A и C.', 'That is the midpoint of A and C.') },
        { id: 'c', label: '(1; 1; 1)', hint: L("Bu ayirma. Ikki karra besh minus to'rt olti beradi.", 'Это разность. Дважды пять минус четыре даёт шесть.', 'That is the difference. Twice five minus four gives six.') },
        { id: 'd', label: '(10; 10; 10)', hint: L("Bu ikkilantirilgan o'rta, A ayirilmagan.", 'Это удвоенная середина, A не вычтено.', 'That is the doubled midpoint, A was not subtracted.') },
      ],
    },
    {
      id: 'b6', tag: 'octant_sign', ask: true, cols: 2,
      done: L('tagida', 'ниже', 'below'),
      prompt: L('(−1; −5; −2) pol tepasidami yoki tagida?', '(−1; −5; −2) выше пола или ниже?', 'Is (−1; −5; −2) above the floor or below?'),
      items: [
        { id: 'a', label: L('tagida', 'ниже', 'below'), correct: true },
        { id: 'b', label: L('tepasida', 'выше', 'above'), hint: L("Balandlikni applikata beradi, va u minus ikki.", 'Высоту даёт аппликата, а она минус два.', 'The height comes from the applicate, and it is minus two.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', 'Tartib haqida.', 'Про порядок.', 'About the order.'),
    A('q3', 'Soya haqida.', 'Про тень.', 'About the shadow.'),
    A('q4', "O'rta.", 'Середина.', 'The midpoint.'),
    A('q5', 'Teskari masala.', 'Обратная задача.', 'The reverse task.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO. Hamma qadam to'g'ri ko'rinadi.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'mid_ratio',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("O'rta: uchta satr to'g'ri, bittasi yo'q", 'Середина: три строки верны, одна нет', 'The midpoint: three lines are right, one is not'),
  rows: [
    { id: 'r1', text: 'A (−3; 5; 1),  B (1; −1; 7)' },
    { id: 'r2', text: 'x = (−3 + 1) / 2 = −1' },
    { id: 'r3', text: 'y = (5 + (−1)) / 2 = 2' },
    { id: 'r4', text: 'z = (7 − 1) / 2 = 3' },
    { id: 'r5', text: L('javob: C (−1; 2; 3)', 'ответ: C (−1; 2; 3)', 'answer: C (−1; 2; 3)') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Manfiy son bilan qo'shish to'g'ri: minus uch plyus bir minus ikki.", 'Сложение с отрицательным верно: минус три плюс один это минус два.', 'Adding the negative is right: minus three plus one is minus two.'),
    r3: L("Besh plyus minus bir to'rt, bo'lingan ikki ikki. To'g'ri.", 'Пять плюс минус один четыре, делить на два два. Верно.', 'Five plus minus one is four, halved is two. Right.'),
    r5: L("Oxirgi satrda hisob yo'q, xato undan oldin.", 'В последней строке счёта нет, ошибка выше.', 'The last line has no computation, the error is above.'),
  },
  proofPoint: L('bu ayirma, yig\'indi emas', 'это разность, а не сумма', 'that is a difference, not a sum'),
  // Ekrandagi isbot QISQA: ruscha matn 13-slaydda budjetdan 5 px oshib
  // ketgan edi. Ovozdagi isbot uzun qoladi -- u ekrandan KENG bo'lishi kerak.
  proof: L(
    "Applikatada AYIRMA olingan. To'g'risi bir plyus yetti, bo'lingan ikki, ya'ni to'rt. O'rta minus bir, ikki, to'rt, va u uchlar orasida turadi.",
    'В аппликате взята РАЗНОСТЬ. Верно: один плюс семь, делить на два, будет четыре. Середина минус один, два, четыре, и она стоит между концами.',
    'The applicate took the DIFFERENCE. Correctly: one plus seven, halved, is four. The midpoint is minus one, two, four, and it sits between the ends.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("yig'indi o'rniga ayirma", 'разность вместо суммы', 'a difference instead of a sum'), correct: true },
      { id: 'b', label: L('arifmetikada xato', 'ошибка в арифметике', 'an arithmetic slip'), hint: L("Arifmetika to'g'ri: yetti minus bir olti, bo'lingan ikki uch. Xato usulda.", 'Арифметика верна: семь минус один шесть, делить на два три. Ошибка в способе.', 'The arithmetic is right: seven minus one is six, halved is three. The method is the error.') },
      { id: 'c', label: L("o'qlar almashtirilgan", 'перепутаны оси', 'the axes are swapped'), hint: L("O'qlar joyida: birinchi satr abssissa, ikkinchisi ordinata, uchinchisi applikata.", 'Оси на месте: первая строка абсцисса, вторая ордината, третья аппликата.', 'The axes are fine: the first line is the abscissa, the second the ordinate, the third the applicate.') },
      { id: 'd', label: L("javob to'g'ri", 'ответ верный', 'the answer is right'), hint: L("Javob uch bergan, to'g'risi esa to'rt.", 'В ответе три, а верно четыре.', 'The answer says three, the right value is four.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Diqqat: uchta satr haqiqatan to'g'ri hisoblangan. Xato bittasida. Uni toping.", 'Внимание: три строки посчитаны действительно верно. Ошибка в одной. Найди её.', 'Careful: three lines are computed correctly. One holds the error. Find it.'),
    A('proof', "Qarang: applikatada yetti minus bir yozilgan, ya'ni uchlarning ayirmasi. O'rta esa yarim yig'indi. To'g'risi bir plyus yetti bo'lingan ikki, ya'ni to'rt. Va tekshiruv: o'rta ikki uchning orasida turadi, uch esa bir va yetti orasida emas.", 'Смотри: в аппликате записано семь минус один, то есть разность концов. А середина это полусумма. Правильно один плюс семь делить на два, то есть четыре. И проверка: середина стоит между концами, а три между одним и семью не стоит.', 'Look: the applicate says seven minus one, the difference of the ends. But a midpoint is the half sum. Correctly it is one plus seven over two, that is four. And the check: a midpoint sits between the ends, and three does not sit between one and seven.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: yozuvni tavsif bo'yicha yig'ish.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'projection_point',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('qaysi koordinata nol', 'какая координата ноль', 'which coordinate is zero'),
  tasks: [
    {
      prompt: L('Oyz tekisligida, ordinata 3, applikata −2', 'В плоскости Oyz, ордината 3, аппликата −2', 'In the plane Oyz, ordinate 3, applicate −2'),
      template: ['( ', { slot: 0 }, ' ;  3 ;  ', { slot: 1 }, ' )'],
      parts: ['0', '3', '−2', '2'],
      answer: ['0', '−2'],
      doneLabel: '(0; 3; −2)',
      wrongs: [
        { key: '3|−2', hint: L("Bu tekislikda nolga aylanadigan koordinata abssissa.", 'В этой плоскости нулевой становится абсцисса.', 'In this plane the abscissa is the one that vanishes.') },
        { key: '0|2', hint: L("Applikata manfiy: shartda minus ikki turadi.", 'Аппликата отрицательна: в условии минус два.', 'The applicate is negative: the problem says minus two.') },
        { key: '*', hint: L("Birinchi son abssissa, va bu tekislikda u nol.", 'Первое число абсцисса, и в этой плоскости она ноль.', 'The first number is the abscissa, and in this plane it is zero.') },
      ],
    },
    {
      prompt: L("Oz o'qida, applikata 6", 'На оси Oz, аппликата 6', 'On the Oz axis, applicate 6'),
      template: ['( ', { slot: 0 }, ' ;  0 ;  ', { slot: 1 }, ' )'],
      parts: ['0', '6', '−6', '1'],
      answer: ['0', '6'],
      doneLabel: '(0; 0; 6)',
      wrongs: [
        { key: '6|0', hint: L("Applikata uchinchi o'rinda turadi, birinchisi esa abssissa.", 'Аппликата стоит на третьем месте, а первое это абсцисса.', 'The applicate is third, the first place is the abscissa.') },
        { key: '*', hint: L("O'qda ikkita nol bo'ladi, va noldan farqli son applikata.", 'На оси два нуля, а отлично от нуля аппликата.', 'On an axis there are two zeros, and the nonzero one is the applicate.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari: tavsif bor, yozuv kerak.', 'Ошибка найдена. Последнее задание обратное: есть описание, нужна запись.', 'The error is found. The last task is reverse: a description is given, a record is needed.'),
    A('built1', "Endi ikkinchisi. Bu safar tekislik emas, o'q.", 'Теперь второе. На этот раз не плоскость, а ось.', 'Now the second. This time not a plane but an axis.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'coord_order',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: '(x; y; z)',
  ruleLines: [
    L('joy uchta son, tartib bilan', 'место это три числа, по порядку', 'a place is three numbers, in order'),
    L("bitta nol tekislik, ikkita nol o'q", 'один нуль плоскость, два нуля ось', 'one zero a plane, two zeros an axis'),
    L("o'rta har bir koordinatada alohida", 'середина по каждой координате отдельно', 'the midpoint coordinate by coordinate'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('nechta son kerak', 'сколько чисел нужно', 'how many numbers are needed'),
      right: L('uchta', 'три', 'three'),
      map: {
        a: L('bitta', 'одно', 'one'),
        b: L('ikkita', 'два', 'two'),
        c: L('uchta', 'три', 'three'),
        d: L("to'rtta", 'четыре', 'four'),
      },
    },
    {
      screen: 5,
      expr: L("fazo nechta bo'lakka", 'на сколько частей пространство', 'how many parts of space'),
      right: '8',
      map: { a: '4', b: '6', c: '8', d: '12' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('tomonlar oltita → o\'lchovlar uchta → (x; y; z)', 'сторон шесть → измерений три → (x; y; z)', 'six sides → three dimensions → (x; y; z)'),
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Qoida va soyalar ekraniga qayting", 'Вернись к правилу и к экрану с тенями', 'Go back to the rule and the shadows screen'),
  },
  probe: {
    question: L(
      'Nima uchun tartib muhim?',
      'Почему порядок важен?',
      'Why does the order matter?',
    ),
    items: [
      { id: 'a', label: L("har bir son o'z o'qiga bog'langan", 'каждое число привязано к своей оси', 'each number belongs to its own axis'), correct: true },
      { id: 'b', label: L('shunday qisqaroq', 'так короче', 'it is shorter that way'), hint: L("Uzunlik masalasi emas: tartib joyni o'zgartiradi.", 'Дело не в длине: порядок меняет место.', 'It is not about length: the order changes the place.') },
      { id: 'c', label: L('darslikda shunday', 'так в учебнике', 'that is how the book does it'), hint: L("Darslikda shunday, chunki boshqacha bo'lsa joy o'zgaradi.", 'В учебнике так потому, что иначе меняется место.', 'The book does it so because otherwise the place changes.') },
      { id: 'd', label: L('tartib muhim emas', 'порядок не важен', 'the order does not matter'), hint: L("Muhim: bir, uch, ikki va uch, bir, ikki boshqa joylar.", 'Важен: один, три, два и три, один, два это разные места.', 'It does: one, three, two and three, one, two are different places.') },
    ],
  },
  sheetTitle: L('Fazoda koordinatalar · shpargalka', 'Координаты в пространстве · шпаргалка', 'Coordinates in space · cheat sheet'),
  sheetSrc: L('11-sinf · 35-dars', '11 класс · урок 35', 'Grade 11 · lesson 35'),
  lifehack: L(
    "Nollarni sanang: bitta tekislik, ikkitasi o'q.",
    'Считай нули: один плоскость, два ось.',
    'Count the zeros: one a plane, two an axis.',
  ),
  holds: [3000, 6000, 7000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Joyni uchta son beradi, va fazo sakkiz oktantaga bo'linadi.", 'Вот твои прогнозы и вот как оказалось. Место задают три числа, а пространство делится на восемь октантов.', 'Here are your guesses and here is how it turned out. A place is given by three numbers, and space splits into eight octants.'),
    A('rule', "Va mana darsning umumiy fikri. Har bir koordinata o'z o'qi bilan ishlaydi, va shu sababli tartib almashtirilmaydi. Nollar joyni aytadi: bitta nol tekislikni, ikkita nol o'qni beradi. O'rtani ham har bir koordinatada alohida sanaladi. Keyingi darsda shu uchlik vektorga aylanadi.", 'И вот общая мысль урока. Каждая координата работает со своей осью, и поэтому порядок не переставляется. Нули говорят о месте: один нуль даёт плоскость, два нуля ось. Середину тоже считают по каждой координате отдельно. На следующем уроке эта тройка станет вектором.', 'And here is the shared thought of the lesson. Each coordinate works with its own axis, and that is why the order is fixed. Zeros tell the place: one zero gives a plane, two zeros an axis. The midpoint too is computed coordinate by coordinate. In the next lesson this triple becomes a vector.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
