// ============================================================================
// 11-sinf, Dars 55. KOMPLEKS AMALIYOT: SINOV DTM.
//
// B7 blokining beshinchi darsi. Rejada «Kompleksnaya praktika».
//   kontrakt: src/books/grade11/ETALON_11SINF.md, 1.2-band (DTM anatomiyasi)
//   asbob:    `SpinBoard` (aylanish jismi), `AnswerValue`, `Probe`
//   manba:    kursning hamma bloklari. Har masalada geometriya ICHIDA
//             algebraik qadam turadi: ildiz, daraja, tenglama yoki hosila.
//
// DARSNING BITTA GAPI: geometriya masalasi ko'pincha algebraik tenglamaga
// olib boradi, va DTM da aynan shu o'tish joyida vaqt yo'qoladi.
//
// SONLAR TEKSHIRILDI:
//   kub hajmi 64 -> qirra 4 (KUB ildiz);  kvadrat yuzasi 64 -> tomon 8
//   sirt 96: 6a² = 96 -> a = 4 -> hajm 64
//   qirralar yig'indisi 60: 60 / 12 = 5 -> hajm 125
//   hajm 27 barobar o'sdi -> qirra 3 barobar
//   V(a) = a³,  V'(a) = 3a²,  a = 2 da 12
//   shar R = 3 -> hajm 36π
//   kvadratga ichki chizilgan doira: ehtimollik π / 4 ≈ 0,785
//   y = x chizig'i [0; 3] da aylanadi -> konus R = 3, h = 3 -> hajm 9π
//   shar kubga ichki chizilgan -> R = a / 2
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_55',
  title: L('Kompleks amaliyot: sinov DTM', 'Комплексная практика: пробный ДТМ', 'Mixed practice: a mock exam'),
}

const BLOCK = { label: 'B7', from: 51, to: 56, current: 55 }

// DTM REJIMI. Etalon 1.2-bandi.
const MODE = 'dtm'

// y = x chizig'i: aylanishdan konus chiqadi
const LIN = (x) => x

// ============================================================
// SLAYD 1. XUK. Qaysi ildiz: kvadrat yoki kub.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sinov DTM', 'Пробный ДТМ', 'Mock exam'),
  title: L('Kubning qirrasi', 'Ребро куба', 'The edge of a cube'),
  expr: L('hajm 64', 'объём 64', 'volume 64'),
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: '8',
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: '4',
    },
  ],
  probe: {
    question: L(
      'Kubning qirrasi qancha?',
      'Чему равно ребро куба?',
      'What is the edge of the cube?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi masalalar boshlanadi.',
      'Твой ответ записан. Теперь начинаются задачи.',
      'Your answer is saved. Now the problems begin.',
    ),
    items: [
      { id: 'a', label: '4' },
      { id: 'b', label: '8' },
      { id: 'c', label: '16' },
      { id: 'd', label: '2' },
    ],
  },
  holds: [4200, 3600, 3200],
  audio: [
    A('mount', "Kompleks amaliyot. Har masalada geometriya ichida algebraik qadam turadi.", 'Комплексная практика. В каждой задаче внутри геометрии стоит алгебраический шаг.', 'Mixed practice. In each problem an algebraic step sits inside the geometry.'),
    A('r1', "Karim sakkiz deb javob berdi: oltmish to'rtdan kvadrat ildiz oldi.", 'Карим ответил восемь: он извлёк квадратный корень из шестидесяти четырёх.', 'Karim answered eight: he took the square root of sixty four.'),
    A('r2', "Nargiza esa to'rt deb aytdi.", 'А Наргиза сказала четыре.', 'Nargiza said four.'),
    A('ask', "Sizningcha qirra qancha. Taxmin qiling.", 'Как думаешь, чему равно ребро. Предположи.', 'What do you think the edge is. Make a guess.'),
  ],
}

// ============================================================
// SLAYD 2. MASALA 1. Qaysi daraja, shunday ildiz.
// ============================================================
const S2 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'power_vs_exp',
  eyebrow: L('Masala 1', 'Задача 1', 'Problem 1'),
  title: L('Qaysi ildiz kerak', 'Какой корень нужен', 'Which root is needed'),
  expr: L('son 64', 'число 64', 'the number 64'),
  goal: L('darajani o\'lchov bilan bog\'lash', 'связать степень с измерением', 'link the power to the dimension'),
  rule: L(
    "Har holatda nechta o'lchov borligini qaraymiz.",
    'В каждом случае смотрим, сколько измерений.',
    'In each case we look at how many dimensions there are.',
  ),
  pick: L('Qaysi holatni tekshiramiz?', 'Какой случай проверим?', 'Which case shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('har doim kvadrat ildiz', 'всегда квадратный корень', 'always a square root'), value: '√' },
    { id: 'b', key: 'inB', name: L('o\'lchovga qarab', 'по числу измерений', 'by the dimension'), value: '∛' },
  ],
  points: [
    {
      id: 'q1', label: L('kvadrat yuzasi 64', 'площадь квадрата 64', 'square area 64'), num: '8', step: 'calc', verdict: 'in',
      calc: L('ikki o\'lchov, kvadrat ildiz', 'два измерения, квадратный корень', 'two dimensions, a square root'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: L('kub hajmi 64', 'объём куба 64', 'cube volume 64'), num: '4', step: 'calc', verdict: 'in',
      calc: L('uch o\'lchov, kub ildiz', 'три измерения, кубический корень', 'three dimensions, a cube root'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: L('kesma uzunligi 64', 'длина отрезка 64', 'segment length 64'), num: '64', step: 'calc', verdict: 'in',
      calc: L('bir o\'lchov, ildiz kerak emas', 'одно измерение, корень не нужен', 'one dimension, no root'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q4', label: L('kub sirti 64', 'поверхность куба 64', 'cube surface 64'), num: '≈ 3,3', step: 'calc', verdict: 'out',
      calc: L('avval oltiga bo\'lish kerak', 'сначала надо поделить на шесть', 'first divide by six'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L(
      'Ildizning darajasini nima belgilaydi?',
      'Что определяет степень корня?',
      'What decides the degree of the root?',
    ),
    items: [
      { id: 'b', label: L('o\'lchovlar soni', 'число измерений', 'the number of dimensions'), correct: true },
      { id: 'a', label: L('sonning kattaligi', 'величина числа', 'the size of the number'), hint: L("Son bir xil, oltmish to'rt, lekin javoblar boshqa: sakkiz va to'rt.", 'Число одно и то же, шестьдесят четыре, а ответы разные: восемь и четыре.', 'The number is the same, sixty four, and the answers differ: eight and four.') },
      { id: 'c', label: L('figura turi', 'вид фигуры', 'the kind of figure'), hint: L("Kub va shar har xil figura, lekin ikkisida ham hajm uch o'lchovli.", 'Куб и шар разные фигуры, но объём в обоих трёхмерный.', 'A cube and a ball differ, but the volume is three dimensional in both.') },
      { id: 'd', label: L('birlik', 'единица', 'the unit'), hint: L("Birlik o'lchovni KO'RSATADI: kvadrat metr ikki, kub metr uch.", 'Единица ПОКАЗЫВАЕТ измерение: квадратный метр два, кубический три.', 'The unit SHOWS the dimension: a square metre two, a cubic metre three.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Birinchi masala. Son hamma joyda bir xil, javoblar esa boshqa.", 'Первая задача. Число везде одно, а ответы разные.', 'The first problem. The number is the same everywhere, the answers differ.'),
    A('mount', "Holatni o'zingiz tanlaysiz.", 'Случай выбираешь сам.', 'You choose the case yourself.'),
    A('calc', 'Hisoblaymiz.', 'Считаем.', 'We compute.'),
    A('mark', "Mana natija. Uzunlikda ildiz kerak emas, yuzada kvadrat ildiz, hajmda kub ildiz. Va to'rtinchi holat alohida: kub sirti oltita yoqdan iborat, shuning uchun avval oltiga bo'lish, keyin ildiz olish kerak. Birlik o'zi javob beradi: kvadrat metr ikki o'lchov, kub metr uch.", 'Вот результат. В длине корень не нужен, в площади квадратный, в объёме кубический. А четвёртый случай особый: поверхность куба состоит из шести граней, поэтому сначала делят на шесть, а потом извлекают корень. Единица сама отвечает: квадратный метр это два измерения, кубический три.', 'Here is the result. A length needs no root, an area a square root, a volume a cube root. And the fourth case is special: a cube surface has six faces, so divide by six first and then take the root. The unit answers by itself: a square metre means two dimensions, a cubic metre three.'),
  ],
}

// ============================================================
// SLAYD 3. MASALA 2. Kubga ichki chizilgan shar.
// ============================================================
const S3 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'ball_vs_sphere',
  eyebrow: L('Masala 2', 'Задача 2', 'Problem 2'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Shar kubga ICHKI chizilgan',
    'Шар ВПИСАН в куб',
    'A ball is INSCRIBED in a cube',
  ),
  template: ['R  ', { slot: 0 }, '  a / 2'],
  signs: ['=', '<'],
  answer: '=',
  checkNote: L(
    'shar kubning yoqlariga tegadi, demak diametri qirraga teng',
    'шар касается граней куба, значит диаметр равен ребру',
    'the ball touches the faces, so the diameter equals the edge',
  ),
  wrongs: [
    { key: '<', hint: L("Kichik bo'lsa shar yoqlarga TEGMAY qolardi, va u ichki chizilgan bo'lmaydi.", 'Если бы меньше, шар не КАСАЛСЯ бы граней, и он не был бы вписанным.', 'If it were less, the ball would not TOUCH the faces, so it would not be inscribed.') },
  ],
  probe: {
    question: L(
      'Kub sharga ichki chizilsa?',
      'А если куб вписан в шар?',
      'And if the cube is inscribed in the ball?',
    ),
    items: [
      { id: 'a', label: L('diametr fazoviy diagonalga teng', 'диаметр равен пространственной диагонали', 'the diameter equals the space diagonal'), correct: true },
      { id: 'b', label: L('diametr qirraga teng', 'диаметр равен ребру', 'the diameter equals the edge'), hint: L("Qirra bilan tenglik TESKARI holatda edi: shar kub ichida.", 'Равенство с ребром было в ОБРАТНОМ случае: шар внутри куба.', 'Equality with the edge belonged to the OTHER case: the ball inside the cube.') },
      { id: 'c', label: L('diametr yoq diagonaliga teng', 'диаметр равен диагонали грани', 'the diameter equals the face diagonal'), hint: L("Yoq diagonali kubning eng uzun kesmasi emas: fazoviy diagonal uzunroq.", 'Диагональ грани не самый длинный отрезок куба: пространственная длиннее.', 'A face diagonal is not the longest segment: the space diagonal is longer.') },
      { id: 'd', label: L('bog\'liq emas', 'не связаны', 'unrelated'), hint: L("Bog'liq: kubning uchlari sfera ustida yotadi.", 'Связаны: вершины куба лежат на сфере.', 'They are linked: the vertices of the cube lie on the sphere.') },
    ],
  },
  audio: [
    A('mount', "Ikkinchi masala. Shar kub ichiga chizilgan va yoqlariga tegib turadi.", 'Вторая задача. Шар вписан в куб и касается его граней.', 'The second problem. A ball is inscribed in a cube and touches its faces.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 4. MASALA 3. Chizma: chiziq aylanadi.
// ============================================================
const S4 = {
  role: 'graph',
  section: 'practice',
  tag: 'axis_matters',
  drag: false,
  eyebrow: L('Masala 3', 'Задача 3', 'Problem 3'),
  title: L('Chiziq aylanganda', 'Когда линия вращается', 'When the line spins'),
  chip: L('y = x,  0 dan 3 gacha', 'y = x, от 0 до 3', 'y = x, from 0 to 3'),
  solid: {
    fn: LIN,
    a: 0,
    b: 3,
    xDomain: [-0.4, 3.6],
    yDomain: [-3.4, 3.4],
    mode: 'spin',
    showV: true,
    tilt0: 0.45,
    interactive: true,
    height: 172,
    caption: L('jismni barmoq bilan burish mumkin', 'тело можно повернуть пальцем', 'you can turn the solid with a finger'),
  },
  spinSteps: 3,
  probe: {
    question: L(
      'Qanday jism hosil bo\'ldi?',
      'Какое тело получилось?',
      'Which solid came out?',
    ),
    items: [
      { id: 'a', label: L('konus', 'конус', 'a cone'), correct: true },
      { id: 'b', label: L('silindr', 'цилиндр', 'a cylinder'), hint: L("Silindr uchun radius o'zgarmasligi kerak, bu yerda esa u o'sib boradi.", 'Для цилиндра радиус должен быть постоянным, а здесь он растёт.', 'A cylinder needs a constant radius, and here it grows.') },
      { id: 'c', label: L('shar', 'шар', 'a ball'), hint: L("Shar yarim doiradan chiqadi, bu esa to'g'ri chiziq.", 'Шар выходит из полукруга, а это прямая.', 'A ball comes from a half disc, and this is a straight line.') },
      { id: 'd', label: L('ikki konus', 'два конуса', 'two cones'), hint: L("Ikki konus gipotenuza atrofida aylanganda chiqadi.", 'Два конуса выходят при вращении вокруг гипотенузы.', 'Two cones come from spinning about a hypotenuse.') },
    ],
  },
  holds: [4200, 4200, 4200],
  audio: [
    A('mount', "Uchinchi masala chizmada. To'g'ri chiziq o'q atrofida aylanadi.", 'Третья задача на чертеже. Прямая вращается вокруг оси.', 'The third problem is on a drawing. A line spins about an axis.'),
    A('mount', "Radius chiziq bilan birga o'sadi: noldan uchgacha.", 'Радиус растёт вместе с линией: от нуля до трёх.', 'The radius grows with the line: from zero to three.'),
    A('mount', "Natijada uchi koordinata boshida bo'lgan konus chiqadi, va uning hajmi to'qqiz pi.", 'В итоге выходит конус с вершиной в начале координат, и его объём девять пи.', 'The result is a cone with its apex at the origin, and its volume is nine pi.'),
  ],
}

// Zanjir amallari.
const ACTIONS_55 = [
  { id: 'eq', label: L('tenglama tuzish', 'составить уравнение', 'set up an equation') },
  { id: 'solve', label: L('tenglamani yechish', 'решить уравнение', 'solve the equation') },
  { id: 'vol', label: L('hajmni hisoblash', 'посчитать объём', 'compute the volume') },
  { id: 'der', label: L('hosilani topish', 'найти производную', 'find the derivative') },
  { id: 'at', label: L('nuqtada hisoblash', 'посчитать в точке', 'evaluate at the point') },
]

// ============================================================
// SLAYD 5. MASALA 4. Zanjir: sirtdan hajmga.
// ============================================================
const S5 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'word_model',
  noLine: true,
  eyebrow: L('Masala 4', 'Задача 4', 'Problem 4'),
  title: L('Sirtdan hajmga', 'От поверхности к объёму', 'From surface to volume'),
  start: L('kub sirti 96', 'поверхность куба 96', 'cube surface 96'),
  actions: ACTIONS_55,
  steps: [
    {
      action: 'eq',
      to: '6a² = 96',
      wrongs: [
        { action: 'solve', hint: L("Yechish uchun avval tenglama yozilishi kerak.", 'Чтобы решать, сначала надо записать уравнение.', 'To solve, an equation must be written first.') },
        { action: 'vol', hint: L("Hajm uchun qirra kerak, u hali yo'q.", 'Для объёма нужно ребро, а его пока нет.', 'The volume needs the edge, which is not found yet.') },
        { action: 'der', hint: L("Hosila keyingi masalada kerak bo'ladi.", 'Производная понадобится в следующей задаче.', 'The derivative belongs to the next problem.') },
      ],
    },
    {
      action: 'solve',
      to: 'a = 4',
      wrongs: [
        { action: 'eq', hint: L("Tenglama tayyor: olti a kvadrat to'qsan oltiga teng.", 'Уравнение готово: шесть a квадрат равно девяноста шести.', 'The equation is ready: six a squared equals ninety six.') },
        { action: 'at', hint: L("Nuqtada hisoblash hosila masalasida edi.", 'Считать в точке было в задаче о производной.', 'Evaluating at a point belonged to the derivative problem.') },
      ],
    },
    {
      action: 'vol',
      to: '64',
      wrongs: [
        { action: 'solve', hint: L("Qirra topildi: to'rt.", 'Ребро найдено: четыре.', 'The edge is found: four.') },
        { action: 'der', hint: L("Bu masalada hosila kerak emas.", 'В этой задаче производная не нужна.', 'No derivative in this problem.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['64', '96', '16', '512'],
    value: ['64'],
    label: 'V =',
    prompt: L('Hajmni yozing', 'Запиши объём', 'Write the volume'),
    wrongs: [
      { key: '96', hint: L("To'qsan olti bu SIRT, shartdan olingan son.", 'Девяносто шесть это ПОВЕРХНОСТЬ, число из условия.', 'Ninety six is the SURFACE, the number from the problem.') },
      { key: '16', hint: L("O'n olti bu qirraning kvadrati, ya'ni bitta yoq yuzasi.", 'Шестнадцать это квадрат ребра, то есть площадь одной грани.', 'Sixteen is the edge squared, the area of one face.') },
      { key: '512', hint: L("Besh yuz o'n ikki bu sakkizning kubi: qirra to'rt, sakkiz emas.", 'Пятьсот двенадцать это восемь в кубе: ребро четыре, а не восемь.', 'Five hundred twelve is eight cubed: the edge is four, not eight.') },
      { key: '*', hint: L("Qirra to'rt, hajm esa to'rtning kubi.", 'Ребро четыре, а объём это четыре в кубе.', 'The edge is four, and the volume is four cubed.') },
    ],
  },
  audio: [
    A('mount', "To'rtinchi masala. Ro'yxatda hosila masalasining amallari ham bor.", 'Четвёртая задача. В списке есть и действия задачи о производной.', 'The fourth problem. The list also holds actions of the derivative problem.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 6. MASALA 5. Qirralar yig'indisi.
// ============================================================
const S6 = {
  role: 'twoway',
  section: 'practice',
  tag: 'net_faces',
  eyebrow: L('Masala 5', 'Задача 5', 'Problem 5'),
  title: L('Qirralar yig\'indisi 60', 'Сумма рёбер 60', 'The edges add to 60'),
  expr: L('kub, hajm kerak', 'куб, нужен объём', 'a cube, the volume is asked'),
  need: L('nechta qirra bor', 'сколько рёбер', 'how many edges'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('oltiga bo\'ldi', 'поделил на шесть', 'divided by six'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '1000',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('o\'n ikkiga bo\'ldi', 'поделила на двенадцать', 'divided by twelve'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '125',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['125', '1000', '216', '60'],
    value: ['125'],
    label: 'V =',
    prompt: L('Hajmni yozing', 'Запиши объём', 'Write the volume'),
    wrongs: [
      { key: '1000', hint: L("Oltiga bo'lingan: olti bu YOQlar soni, qirralar esa o'n ikkita.", 'Поделено на шесть: шесть это число ГРАНЕЙ, а рёбер двенадцать.', 'Divided by six: six is the number of FACES, and there are twelve edges.') },
      { key: '216', hint: L("Ikki yuz o'n olti bu qirra oltiga teng bo'lganda.", 'Двести шестнадцать это при ребре шесть.', 'Two hundred sixteen is for an edge of six.') },
      { key: '60', hint: L("Oltmish bu shartdagi son, hajm emas.", 'Шестьдесят это число из условия, а не объём.', 'Sixty is the number from the problem, not the volume.') },
      { key: '*', hint: L("Kubda o'n ikkita qirra: oltmish bo'lingan o'n ikki besh, hajm esa besh kub.", 'У куба двенадцать рёбер: шестьдесят делить на двенадцать пять, а объём пять в кубе.', 'A cube has twelve edges: sixty over twelve is five, and the volume is five cubed.') },
    ],
  },
  holds: [4200, 3600, 5200],
  audio: [
    A('mount', "Beshinchi masala. Ikki o'quvchi bir xil yo'l bilan bordi, lekin boshqa songa bo'ldi.", 'Пятая задача. Два ученика шли одним путём, но делили на разные числа.', 'The fifth problem. Two students took the same road but divided by different numbers.'),
    A('p1', "Aziz oltiga bo'ldi va o'n chiqardi, hajm esa ming.", 'Азиз поделил на шесть и получил десять, а объём тысяча.', 'Aziz divided by six and got ten, so the volume a thousand.'),
    A('p2', "Dilnoza esa qirralarni sanadi. Kubda oltita yoq, lekin o'n ikkita qirra bor. Oltmish bo'lingan o'n ikki besh, va hajm besh kub, ya'ni yuz yigirma besh. Tekshiruv: har uchidan uchta qirra chiqadi, uchlar sakkizta, va har qirra ikki uchni tutashtiradi.", 'А Дилноза посчитала рёбра. У куба шесть граней, но двенадцать рёбер. Шестьдесят делить на двенадцать пять, и объём пять в кубе, то есть сто двадцать пять. Проверка: из каждой вершины выходит три ребра, вершин восемь, и каждое ребро соединяет две вершины.', 'Dilnoza counted the edges. A cube has six faces but twelve edges. Sixty over twelve is five, and the volume is five cubed, one hundred twenty five. The check: three edges leave each vertex, there are eight vertices, and each edge joins two of them.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 7. MASALA 6. Hajm 27 barobar o'sdi.
// ============================================================
const S7 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'similar_area',
  eyebrow: L('Masala 6', 'Задача 6', 'Problem 6'),
  title: L('Qirra necha barobar o\'sdi', 'Во сколько выросло ребро', 'How much did the edge grow'),
  expr: L('hajm 27 barobar o\'sdi', 'объём вырос в 27 раз', 'the volume grew 27 times'),
  goal: L('koeffitsiyentni topish', 'найти коэффициент', 'find the ratio'),
  rule: L(
    "Har nomzodni kubga ko'taramiz va yigirma yettini kutamiz.",
    'Каждого кандидата возводим в куб и ждём двадцать семь.',
    'We cube each candidate and expect twenty seven.',
  ),
  pick: L('Qaysi nomzodni tekshiramiz?', 'Какого кандидата проверим?', 'Which candidate shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('hajm bilan bir xil', 'столько же, сколько объём', 'the same as the volume'), value: '27' },
    { id: 'b', key: 'inB', name: L('kub ildiz', 'кубический корень', 'the cube root'), value: '3' },
  ],
  points: [
    {
      id: 'q1', label: '3', num: '27', step: 'calc', verdict: 'in',
      calc: L('uch kub yigirma yetti', 'три в кубе двадцать семь', 'three cubed is twenty seven'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: '27', num: '19 683', step: 'calc', verdict: 'out',
      calc: L('juda katta', 'слишком много', 'far too much'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: '9', num: '729', step: 'calc', verdict: 'out',
      calc: L('bu kvadrat ildiz edi', 'это был квадратный корень', 'that was the square root'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q4', label: '1/3', num: '1/27', step: 'calc', verdict: 'out',
      calc: L('teskari tomonga', 'в обратную сторону', 'the wrong way'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L(
      'Hajm k kub marta o\'ssa, sirt necha marta o\'sadi?',
      'Если объём вырос в k³ раз, во сколько выросла поверхность?',
      'If the volume grew k³ times, how did the surface grow?',
    ),
    items: [
      { id: 'a', label: 'k²', correct: true },
      { id: 'b', label: 'k³', hint: L("Kub HAJMga tegishli, sirt esa ikki o'lchovli.", 'Куб относится к ОБЪЁМУ, а поверхность двумерна.', 'The cube belongs to the VOLUME, and a surface is two dimensional.') },
      { id: 'c', label: 'k', hint: L("Birinchi daraja UZUNLIKka tegishli.", 'Первая степень относится к ДЛИНЕ.', 'The first power belongs to a LENGTH.') },
      { id: 'd', label: L('o\'zgarmaydi', 'не меняется', 'unchanged'), hint: L("O'zgaradi: bo'yoq masalasi shu haqda edi.", 'Меняется: задача о краске была об этом.', 'It changes: the paint problem was about that.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Oltinchi masala. Hajm yigirma yetti barobar o'sdi, qirra esa nechaga.", 'Шестая задача. Объём вырос в двадцать семь раз, а ребро во сколько.', 'The sixth problem. The volume grew twenty seven times, and the edge?'),
    A('mount', "Nomzodni o'zingiz tanlaysiz.", 'Кандидата выбираешь сам.', 'You choose the candidate yourself.'),
    A('calc', 'Kubga ko\'taramiz.', 'Возводим в куб.', 'We cube it.'),
    A('mark', "Mana natija. Faqat uch mos keldi: uchning kubi yigirma yetti. Bu qoidaning uchinchi tomoni: uzunlik k marta o'ssa, sirt k kvadrat, hajm esa k kub marta o'sadi. Teskari yo'nalishda ham shunday ishlaydi: hajmdan qirraga o'tish uchun kub ildiz olinadi.", 'Вот результат. Сошлось только три: три в кубе двадцать семь. Это третья сторона правила: если длина растёт в k раз, поверхность в k в квадрате, а объём в k в кубе. В обратную сторону это работает так же: от объёма к ребру идут через кубический корень.', 'Here is the result. Only three fits: three cubed is twenty seven. That is the third side of the rule: if a length grows k times, a surface grows k squared and a volume k cubed. It works backwards too: from a volume to an edge you go through a cube root.'),
  ],
}

// ============================================================
// SLAYD 8. MASALA 7. Mustaqil: hajmning o'sish tezligi.
// ============================================================
const S8 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'deriv_vs_value',
  noLine: true,
  solo: true,
  eyebrow: L('Masala 7', 'Задача 7', 'Problem 7'),
  title: L('Imtihondagidek', 'Как на экзамене', 'As on the exam'),
  start: L('V (a) = a³,  a = 2 da o\'sish tezligi', 'V (a) = a³, скорость роста при a = 2', 'V (a) = a³, the growth rate at a = 2'),
  actions: ACTIONS_55,
  hint: L(
    "O'sish tezligi -- hosila.",
    'Скорость роста это производная.',
    'A growth rate is a derivative.',
  ),
  steps: [
    {
      action: 'der',
      to: '3a²',
      wrongs: [
        { action: 'at', hint: L("Nuqtada hisoblash uchun avval hosila formulasi kerak.", 'Чтобы считать в точке, нужна формула производной.', 'To evaluate at a point the derivative formula comes first.') },
        { action: 'vol', hint: L("Hajmning o'zi so'ralmagan: uning o'sish TEZLIGI kerak.", 'Сам объём не спрашивают: нужна СКОРОСТЬ его роста.', 'The volume itself is not asked: its growth RATE is.') },
        { action: 'eq', hint: L("Tenglama tuzish kerak emas: funksiya berilgan.", 'Уравнение составлять не нужно: функция дана.', 'No equation needed: the function is given.') },
      ],
    },
    {
      action: 'at',
      to: '12',
      wrongs: [
        { action: 'der', hint: L("Hosila topildi: uch a kvadrat.", 'Производная найдена: три a квадрат.', 'The derivative is found: three a squared.') },
        { action: 'solve', hint: L("Yechish kerak emas: qiymatni qo'yish yetadi.", 'Решать не нужно: достаточно подставить.', 'No solving needed: substituting is enough.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['12', '8', '6', '24'],
    value: ['12'],
    label: L('tezlik =', 'скорость =', 'rate ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '8', hint: L("Sakkiz bu hajmning O'ZI: ikki kub sakkiz.", 'Восемь это САМ объём: два в кубе восемь.', 'Eight is the volume ITSELF: two cubed is eight.') },
      { key: '6', hint: L("Olti bu uch karra ikki: kvadratga ko'tarish unutilgan.", 'Шесть это три на два: возведение в квадрат забыто.', 'Six is three times two: the squaring is forgotten.') },
      { key: '24', hint: L("Yigirma to'rt bu sirtning yarmi va bu yerda paydo bo'lmaydi.", 'Двадцать четыре это половина поверхности, здесь она не возникает.', 'Twenty four is half the surface and does not appear here.') },
      { key: '*', hint: L("Hosila uch a kvadrat, ikkida uch karra to'rt o'n ikki beradi.", 'Производная три a квадрат, в двух три на четыре даёт двенадцать.', 'The derivative is three a squared, at two three times four gives twelve.') },
    ],
  },
  audio: [
    A('mount', "Yettinchi masala mustaqil. Bu yerda geometriya va hosila birga ishlaydi.", 'Седьмая задача самостоятельная. Здесь геометрия и производная работают вместе.', 'The seventh problem is on your own. Here geometry and the derivative work together.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 9. MASALA 8. Hajm qirra bilan o'sadi.
// ============================================================
const S9 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'deriv_sign_monotone',
  eyebrow: L('Masala 8', 'Задача 8', 'Problem 8'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Qirra o\'ssa, hajm ham O\'SADI',
    'Растёт ребро — РАСТЁТ и объём',
    'As the edge grows, the volume GROWS',
  ),
  template: [L('hosila  ', 'производная  ', 'the derivative  '), { slot: 0 }, '  0'],
  signs: ['>', '<'],
  answer: '>',
  checkNote: L(
    'uch a kvadrat musbat qirrada har doim musbat',
    'три a квадрат при положительном ребре всегда положительно',
    'three a squared is always positive for a positive edge',
  ),
  wrongs: [
    { key: '<', hint: L("Manfiy hosila kamayishni berardi, hajm esa qirra bilan o'sadi.", 'Отрицательная производная дала бы убывание, а объём растёт с ребром.', 'A negative derivative would mean a decrease, and the volume grows with the edge.') },
  ],
  probe: {
    question: L(
      'Hajm funksiyasida ekstremum bormi?',
      'Есть ли экстремум у функции объёма?',
      'Does the volume function have an extremum?',
    ),
    items: [
      { id: 'a', label: L('yo\'q, u faqat o\'sadi', 'нет, она только растёт', 'no, it only grows'), correct: true },
      { id: 'b', label: L('ha, nolda', 'да, в нуле', 'yes, at zero'), hint: L("Nolda hosila nolga teng, lekin ishora almashmaydi: qirra manfiy bo'lolmaydi.", 'В нуле производная равна нулю, но знак не меняется: ребро не бывает отрицательным.', 'At zero the derivative vanishes, but the sign does not flip: an edge is never negative.') },
      { id: 'c', label: L('ha, ikkida', 'да, в двух', 'yes, at two'), hint: L("Ikkida hosila o'n ikkiga teng, ya'ni noldan uzoq.", 'В двух производная равна двенадцати, то есть далека от нуля.', 'At two the derivative is twelve, far from zero.') },
      { id: 'd', label: L('aniqlab bo\'lmaydi', 'нельзя определить', 'cannot be decided'), hint: L("Aniqlanadi: hosila musbat qirrada har doim musbat.", 'Определяется: производная при положительном ребре всегда положительна.', 'It can: the derivative is always positive for a positive edge.') },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi masala. Hajm funksiyasi qirraga bog'liq.", 'Восьмая задача. Функция объёма зависит от ребра.', 'The eighth problem. The volume function depends on the edge.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 10. MASALA 9. Teskari masala: shar hajmi.
// ============================================================
const S10 = {
  role: 'build',
  section: 'practice',
  led: 'student',
  tag: 'ball_vs_sphere',
  right: '2/2',
  eyebrow: L('Masala 9', 'Задача 9', 'Problem 9'),
  title: L('Formulani yig\'ing', 'Собери формулу', 'Build the formula'),
  targetLabel: L('Shar', 'Шар', 'The ball'),
  targetValue: 'R = 3',
  tasks: [
    {
      prompt: L('Hajm formulasi', 'Формула объёма', 'The volume formula'),
      template: ['V = ', { slot: 0 }, ' π ', { slot: 1 }],
      parts: ['4/3', '4', 'R³', 'R²'],
      answer: ['4/3', 'R³'],
      doneLabel: 'V = 4/3 π R³',
      wrongs: [
        { key: '4|R²', hint: L("Bu SFERA SIRTI: to'rt pi R kvadrat.", 'Это ПЛОЩАДЬ СФЕРЫ: четыре пи R квадрат.', 'That is the SPHERE SURFACE: four pi R squared.') },
        { key: '4/3|R²', hint: L("Hajmda daraja UCH bo'lishi kerak: uch o'lchov.", 'В объёме степень должна быть ТРЕТЬЕЙ: три измерения.', 'A volume needs the THIRD power: three dimensions.') },
        { key: '*', hint: L("Hajm to'rt uchdan bir karra pi karra R kub.", 'Объём это четыре третьих на пи на R куб.', 'The volume is four thirds times pi times R cubed.') },
      ],
    },
    {
      prompt: L('R = 3 da son', 'Число при R = 3', 'The number at R = 3'),
      template: ['V = ', { slot: 0 }],
      parts: ['36π', '27π', '12π', '108π'],
      answer: ['36π'],
      doneLabel: 'V = 36π',
      wrongs: [
        { key: '27π', hint: L("Yigirma yetti pi bu R kubning o'zi: koeffitsiyent qo'shilmagan.", 'Двадцать семь пи это сам R куб: коэффициент не учтён.', 'Twenty seven pi is R cubed itself: the coefficient is missing.') },
        { key: '12π', hint: L("O'n ikki pi bu to'rt karra uch: kub olinmagan.", 'Двенадцать пи это четыре на три: куб не взят.', 'Twelve pi is four times three: the cube is missing.') },
        { key: '108π', hint: L("Yuz sakkiz pi uchga bo'linmagan.", 'Сто восемь пи не поделено на три.', 'One hundred eight pi is not divided by three.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'qqizinchi masala teskari: formulani o'zingiz yig'asiz. Shar hajmi va sfera sirti eng ko'p almashib ketadigan juftlik.", 'Девятая задача обратная: формулу собираешь сам. Объём шара и площадь сферы это самая путаемая пара.', 'The ninth problem is reverse: you build the formula. The ball volume and the sphere surface are the most confused pair.'),
    A('built1', "Endi sonni hisoblang.", 'Теперь посчитай число.', 'Now compute the number.'),
  ],
}

// ============================================================
// SLAYD 11. MASALA 10. Geometrik ehtimollik.
// ============================================================
const S11 = {
  role: 'twoway',
  section: 'practice',
  tag: 'frequency_vs_prob',
  eyebrow: L('Masala 10', 'Задача 10', 'Problem 10'),
  title: L('Nuqta doiraga tushadimi', 'Попадёт ли точка в круг', 'Will the point land in the disc'),
  expr: L('kvadratga ichki doira', 'круг, вписанный в квадрат', 'a disc inscribed in a square'),
  need: L('yuzalar nisbati', 'отношение площадей', 'the ratio of areas'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('yarim dedi', 'сказал половина', 'said a half'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '1/2',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('yuzalarni hisobladi', 'посчитала площади', 'computed the areas'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: 'π / 4',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['π / 4', '1/2', 'π / 2', '1/4'],
    value: ['π / 4'],
    label: 'P =',
    prompt: L('Ehtimollikni yozing', 'Запиши вероятность', 'Write the probability'),
    wrongs: [
      { key: '1/2', hint: L("Yarim taxmin: doira kvadratning yarmidan KO'PROQ joyini oladi, taxminan yetmish sakkiz foiz.", 'Половина это догадка: круг занимает БОЛЬШЕ половины квадрата, примерно семьдесят восемь процентов.', 'A half is a guess: the disc covers MORE than half the square, about seventy eight percent.') },
      { key: 'π / 2', hint: L("Pi bo'lingan ikki birdan katta, ehtimollik esa birdan katta bo'lolmaydi.", 'Пи делить на два больше единицы, а вероятность больше единицы быть не может.', 'Pi over two exceeds one, and a probability cannot exceed one.') },
      { key: '1/4', hint: L("Bir chorak juda kichik: doira kvadratning katta qismini oladi.", 'Одна четвёртая слишком мало: круг занимает большую часть квадрата.', 'A quarter is far too small: the disc covers most of the square.') },
      { key: '*', hint: L("Doira yuzasi pi R kvadrat, kvadrat yuzasi esa ikki R ning kvadrati, ya'ni to'rt R kvadrat.", 'Площадь круга пи R квадрат, а площадь квадрата это два R в квадрате, то есть четыре R квадрат.', 'The disc area is pi R squared, and the square area is two R squared, that is four R squared.') },
    ],
  },
  holds: [4200, 3600, 5500],
  audio: [
    A('mount', "O'ninchi masala, oxirgisi. Nuqta kvadrat ichiga tasodifiy tushadi.", 'Десятая задача, последняя. Точка случайно попадает внутрь квадрата.', 'The tenth problem, the last. A point lands at random inside the square.'),
    A('p1', "Aziz yarim dedi: doira kvadratning yarmini oladi.", 'Азиз сказал половина: круг занимает половину квадрата.', 'Aziz said a half: the disc covers half the square.'),
    A('p2', "Dilnoza esa yuzalarni hisobladi. Doira yuzasi pi R kvadrat, kvadrat yuzasi to'rt R kvadrat, nisbat pi bo'lingan to'rt, ya'ni taxminan nol butun yetmish sakkiz. Bu geometrik ehtimollik: hodisaning ehtimolligi yuzalar nisbatiga teng.", 'А Дилноза посчитала площади. Площадь круга пи R квадрат, площадь квадрата четыре R квадрат, отношение пи делить на четыре, то есть примерно ноль целых семьдесят восемь. Это геометрическая вероятность: вероятность события равна отношению площадей.', 'Dilnoza computed the areas. The disc area is pi R squared, the square area four R squared, the ratio pi over four, about zero point seven eight. That is geometric probability: the chance equals the ratio of areas.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
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
      id: 'b1', tag: 'power_vs_exp', ask: true, cols: 2,
      done: '5',
      prompt: L('Kub hajmi 125. Qirrasi?', 'Объём куба 125. Ребро?', 'A cube volume 125. The edge?'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '25', hint: L("Yigirma besh bu kvadrat ildizga o'xshash yo'l, hajmda esa kub ildiz kerak.", 'Двадцать пять это путь квадратного корня, а в объёме нужен кубический.', 'Twenty five follows the square-root path, and a volume needs the cube root.') },
        { id: 'c', label: '11', hint: L("O'n bir taxminan yuz yigirma beshning kvadrat ildizi.", 'Одиннадцать это примерно квадратный корень из ста двадцати пяти.', 'Eleven is about the square root of one hundred twenty five.') },
        { id: 'd', label: '15', hint: L("O'n besh kub katta son beradi: uch mingdan ko'p.", 'Пятнадцать в кубе даёт больше трёх тысяч.', 'Fifteen cubed gives more than three thousand.') },
      ],
    },
    {
      id: 'b2', tag: 'net_faces', ask: true, cols: 2,
      done: '12',
      prompt: L('Kubda nechta qirra bor?', 'Сколько рёбер у куба?', 'How many edges does a cube have?'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '6', hint: L("Olti bu YOQlar soni.", 'Шесть это число ГРАНЕЙ.', 'Six is the number of FACES.') },
        { id: 'c', label: '8', hint: L("Sakkiz bu UCHlar soni.", 'Восемь это число ВЕРШИН.', 'Eight is the number of VERTICES.') },
        { id: 'd', label: '4', hint: L("To'rt bu bitta yoqning tomonlari soni.", 'Четыре это число сторон одной грани.', 'Four is the number of sides of one face.') },
      ],
    },
    {
      id: 'b3', tag: 'similar_area', ask: true, cols: 2,
      done: '27',
      prompt: L('Qirra 3 barobar. Hajm necha barobar?', 'Ребро втрое. Объём во сколько?', 'The edge triples. The volume?'),
      items: [
        { id: 'a', label: '27', correct: true },
        { id: 'b', label: '9', hint: L("To'qqiz barobar SIRT o'sadi.", 'В девять раз растёт ПОВЕРХНОСТЬ.', 'A SURFACE grows nine times.') },
        { id: 'c', label: '3', hint: L("Uch barobar UZUNLIK o'sadi.", 'Втрое растёт ДЛИНА.', 'A LENGTH grows three times.') },
        { id: 'd', label: '81', hint: L("Sakson bir bu k ning to'rtinchi darajasi.", 'Восемьдесят один это k в четвёртой.', 'Eighty one is k to the fourth.') },
      ],
    },
    {
      id: 'b4', tag: 'deriv_vs_value', ask: true, cols: 2,
      done: '27',
      prompt: L('V = a³. a = 3 da hosila?', 'V = a³. Производная при a = 3?', 'V = a³. The derivative at a = 3?'),
      items: [
        { id: 'a', label: '27', correct: true },
        { id: 'b', label: '9', hint: L("To'qqiz bu a kvadrat: uchga ko'paytirish unutilgan.", 'Девять это a квадрат: умножение на три забыто.', 'Nine is a squared: the times three is forgotten.') },
        { id: 'c', label: '3', hint: L("Uch bu nuqtaning o'zi.", 'Три это сама точка.', 'Three is the point itself.') },
        { id: 'd', label: '81', hint: L("Sakson bir uch daraja to'rt: daraja bittaga ko'p.", 'Восемьдесят один это три в четвёртой: степень на единицу больше.', 'Eighty one is three to the fourth: one power too many.') },
      ],
    },
    {
      id: 'b5', tag: 'ball_vs_sphere', ask: true, cols: 2,
      done: '4πR²',
      prompt: L('Sfera sirtining yuzasi?', 'Площадь поверхности сферы?', 'The surface area of a sphere?'),
      items: [
        { id: 'a', label: '4πR²', correct: true },
        { id: 'b', label: '4/3 πR³', hint: L("Bu HAJM: uch o'lchov.", 'Это ОБЪЁМ: три измерения.', 'That is the VOLUME: three dimensions.') },
        { id: 'c', label: 'πR²', hint: L("Pi R kvadrat bu katta DOIRAning yuzasi, sfera esa to'rt barobar ko'p.", 'Пи R квадрат это площадь большого КРУГА, а сфера вчетверо больше.', 'Pi R squared is the area of the great DISC, and a sphere is four times more.') },
        { id: 'd', label: '2πR', hint: L("Ikki pi R bu uzunlik, ya'ni bir o'lchov.", 'Два пи R это длина, то есть одно измерение.', 'Two pi R is a length, one dimension.') },
      ],
    },
    {
      id: 'b6', tag: 'frequency_vs_prob', ask: true, cols: 2,
      done: L('yuzalar nisbati', 'отношение площадей', 'the ratio of areas'),
      prompt: L('Geometrik ehtimollik nimaga teng?', 'Чему равна геометрическая вероятность?', 'What does geometric probability equal?'),
      items: [
        { id: 'a', label: L('yuzalar nisbati', 'отношение площадей', 'the ratio of areas'), correct: true },
        { id: 'b', label: L('uzunliklar nisbati', 'отношение длин', 'the ratio of lengths'), hint: L("Uzunliklar CHIZIQda ishlaydi, tekislikda esa yuzalar.", 'Длины работают на ЛИНИИ, а на плоскости площади.', 'Lengths work on a LINE, and areas in a plane.') },
        { id: 'c', label: L('natijalar soni', 'число исходов', 'the count of outcomes'), hint: L("Natijalarni sanash cheklangan to'plamda ishlaydi, bu yerda esa nuqtalar cheksiz.", 'Считать исходы можно в конечном множестве, а здесь точек бесконечно много.', 'Counting outcomes works for a finite set, and here the points are infinite.') },
        { id: 'd', label: L('har doim yarim', 'всегда половина', 'always a half'), hint: L("Bu masalada pi bo'lingan to'rt chiqdi, ya'ni yarim emas.", 'В этой задаче вышло пи делить на четыре, то есть не половина.', 'In this problem it came out pi over four, not a half.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, va faqat shu ekran natijaga kiradi.", 'Блиц. Шесть вопросов, и только этот экран идёт в результат.', 'Quick round. Six questions, and only this screen counts.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Hajmdan kvadrat ildiz olingan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'power_vs_exp',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: L('kub hajmi 64', 'объём куба 64', 'cube volume 64') },
    { id: 'r2', text: 'a³ = 64' },
    { id: 'r3', text: 'a = √64 = 8' },
    { id: 'r4', text: L('sirt: 6 · 64 = 384', 'поверхность: 6 · 64 = 384', 'surface: 6 · 64 = 384') },
    { id: 'r5', text: L('javob: 384', 'ответ: 384', 'answer: 384') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Tenglama to'g'ri yozilgan: hajm qirraning kubi.", 'Уравнение записано верно: объём это куб ребра.', 'The equation is right: the volume is the edge cubed.'),
    r4: L("Bu satr uchinchi satrdagi sondan to'g'ri hisoblangan.", 'Эта строка посчитана верно из числа третьей строки.', 'This line is computed right from the third line number.'),
    r5: L("Oxirgi satr faqat ko'chirma.", 'Последняя строка только перепись.', 'The last line is just a copy.'),
  },
  proofPoint: L('kub ildiz kerak edi', 'нужен был кубический корень', 'a cube root was needed'),
  proof: L(
    "Uchinchi satrda KVADRAT ildiz olingan. Hajm uch o'lchovli, demak KUB ildiz kerak: oltmish to'rtdan to'rt chiqadi. Sirt esa olti karra o'n olti, ya'ni to'qsan olti.",
    'В третьей строке взят КВАДРАТНЫЙ корень. Объём трёхмерный, значит нужен КУБИЧЕСКИЙ корень: из шестидесяти четырёх выходит четыре. А поверхность шесть на шестнадцать, то есть девяносто шесть.',
    'The third line took a SQUARE root. A volume is three dimensional, so a CUBE root is needed: sixty four gives four. And the surface is six times sixteen, that is ninety six.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('ildizning darajasi', 'степень корня', 'the degree of the root'), correct: true },
      { id: 'b', label: L('tenglama xato', 'уравнение неверно', 'the equation is wrong'), hint: L("Tenglama to'g'ri: a kub oltmish to'rtga teng.", 'Уравнение верно: a куб равно шестидесяти четырём.', 'The equation is right: a cubed equals sixty four.') },
      { id: 'c', label: L('sirt formulasi xato', 'формула поверхности неверна', 'the surface formula is wrong'), hint: L("Formula to'g'ri: olti karra yoq yuzasi. Faqat qirra xato olingan.", 'Формула верна: шесть на площадь грани. Только ребро взято неверно.', 'The formula is right: six times the face area. Only the edge is wrong.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Javob to'g'ri qirraga tayanmagan: sakkiz emas, to'rt.", 'Ответ опирается на неверное ребро: не восемь, а четыре.', 'The answer rests on a wrong edge: four, not eight.') },
    ],
  },
  audio: [
    A('mount', "Masalalar tugadi. Endi boshqaning yechimiga qaraymiz.", 'Задачи закончились. Теперь посмотрим на чужое решение.', 'The problems are done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: tenglama to'g'ri, formula ham to'g'ri. Xato bitta belgida.", 'Внимание: уравнение верно, формула тоже. Ошибка в одном знаке.', 'Careful: the equation is right and so is the formula. The error is in one symbol.'),
    A('proof', "Qarang: tenglamada a kub turadi, ildiz esa kvadrat olingan. Daraja va ildiz juft bo'lishi kerak: kubdan chiqish uchun kub ildiz kerak. Oltmish to'rtning kub ildizi to'rt, chunki to'rt karra to'rt karra to'rt oltmish to'rt. Shundan keyin sirt olti karra o'n olti, ya'ni to'qsan olti. Tekshiruv: sakkizli kubning hajmi besh yuz o'n ikki bo'lardi, shartda esa oltmish to'rt.", 'Смотри: в уравнении стоит a куб, а корень взят квадратный. Степень и корень должны быть парой: чтобы выйти из куба, нужен кубический корень. Кубический корень из шестидесяти четырёх это четыре, ведь четыре на четыре на четыре шестьдесят четыре. После этого поверхность шесть на шестнадцать, то есть девяносто шесть. Проверка: у куба с ребром восемь объём был бы пятьсот двенадцать, а в условии шестьдесят четыре.', 'Look: the equation has a cubed, and the root taken was square. A power and a root must match: to undo a cube you need a cube root. The cube root of sixty four is four, since four times four times four is sixty four. Then the surface is six times sixteen, ninety six. The check: a cube with edge eight would have volume five hundred twelve, and the problem says sixty four.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: uch o'lchov, uch daraja.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'similar_area',
  right: '2/2',
  eyebrow: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  title: L('Uch daraja, uch o\'lchov', 'Три степени, три измерения', 'Three powers, three dimensions'),
  targetLabel: L('Koeffitsiyent', 'Коэффициент', 'The ratio'),
  targetValue: 'k',
  tasks: [
    {
      prompt: L('Sirt necha barobar', 'Во сколько поверхность', 'The surface grows by'),
      template: [{ slot: 0 }],
      parts: ['k²', 'k', 'k³', '2k'],
      answer: ['k²'],
      doneLabel: 'k²',
      wrongs: [
        { key: 'k', hint: L("Birinchi daraja UZUNLIKda.", 'Первая степень у ДЛИНЫ.', 'The first power belongs to a LENGTH.') },
        { key: 'k³', hint: L("Kub HAJMda.", 'Куб у ОБЪЁМА.', 'The cube belongs to a VOLUME.') },
        { key: '*', hint: L("Sirt ikki o'lchovli, demak daraja ikki.", 'Поверхность двумерна, значит степень вторая.', 'A surface is two dimensional, so the power is two.') },
      ],
    },
    {
      prompt: L('Hajm necha barobar', 'Во сколько объём', 'The volume grows by'),
      template: [{ slot: 0 }],
      parts: ['k³', 'k²', 'k', '3k'],
      answer: ['k³'],
      doneLabel: 'k³',
      wrongs: [
        { key: 'k²', hint: L("Kvadrat SIRTda.", 'Квадрат у ПОВЕРХНОСТИ.', 'The square belongs to a SURFACE.') },
        { key: 'k', hint: L("Birinchi daraja uzunlikda.", 'Первая степень у длины.', 'The first power belongs to a length.') },
        { key: '*', hint: L("Hajm uch o'lchovli, demak daraja uch.", 'Объём трёхмерен, значит степень третья.', 'A volume is three dimensional, so the power is three.') },
      ],
    },
  ],
  audio: [
    A('mount', "Oxirgi topshiriq: uch o'lchov uchta darajani beradi.", 'Последнее задание: три измерения дают три степени.', 'The last task: three dimensions give three powers.'),
    A('built1', "Endi hajm.", 'Теперь объём.', 'Now the volume.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'power_vs_exp',
  gapMap: 6,
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L('Qayerda teshik bor', 'Где дырка', 'Where the gap is'),
  law: L('o\'lchov darajani beradi', 'измерение задаёт степень', 'the dimension sets the power'),
  ruleLines: [
    L('uzunlik k, sirt k kvadrat, hajm k kub', 'длина k, поверхность k², объём k³', 'length k, surface k², volume k³'),
    L('hajmdan qirraga -- kub ildiz', 'от объёма к ребру — кубический корень', 'from volume to edge, a cube root'),
    L('geometrik ehtimollik -- yuzalar nisbati', 'геометрическая вероятность — отношение площадей', 'geometric probability is a ratio of areas'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('kub hajmi 64, qirrasi', 'объём куба 64, ребро', 'cube volume 64, the edge'),
      right: '4',
      map: { a: '4', b: '8', c: '16', d: '2' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('kvadrat ildiz 8, kub ildiz 4', 'квадратный корень 8, кубический 4', 'square root 8, cube root 4'),
  },
  levels: {
    full: L('Bu blok DTM da siz uchun yopildi', 'Этот блок на ДТМ у тебя закрыт', 'This block is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Xaritada ko\'rsatilgan darslarga qayting', 'Вернись к урокам, указанным в карте', 'Go back to the lessons named in the map'),
  },
  probe: {
    question: L(
      'Ildizning darajasini nima aytadi?',
      'Что говорит о степени корня?',
      'What tells the degree of the root?',
    ),
    items: [
      { id: 'a', label: L('kattalikning o\'lchovi', 'измерение величины', 'the dimension of the quantity'), correct: true },
      { id: 'b', label: L('sonning kattaligi', 'величина числа', 'the size of the number'), hint: L("Bu darsda son bir xil edi, javoblar esa boshqa.", 'На этом уроке число было одно, а ответы разные.', 'In this lesson the number was the same and the answers differed.') },
      { id: 'c', label: L('figuraning nomi', 'название фигуры', 'the name of the figure'), hint: L("Kub va shar boshqa figura, lekin ikkisining hajmi ham uch o'lchovli.", 'Куб и шар разные фигуры, но объём у обоих трёхмерный.', 'A cube and a ball differ, but both volumes are three dimensional.') },
      { id: 'd', label: L('shartning uzunligi', 'длина условия', 'the length of the problem'), hint: L("Shart uzunligi hech narsani belgilamaydi.", 'Длина условия ничего не определяет.', 'The length of the problem decides nothing.') },
    ],
  },
  sheetTitle: L('Kompleks amaliyot · shpargalka', 'Комплексная практика · шпаргалка', 'Mixed practice · cheat sheet'),
  sheetSrc: L('11-sinf · 55-dars', '11 класс · урок 55', 'Grade 11 · lesson 55'),
  lifehack: L(
    "Birlikka qarang: kvadrat metr ikki daraja, kub metr uch daraja.",
    'Смотри на единицу: квадратный метр это вторая степень, кубический третья.',
    'Look at the unit: a square metre is the second power, a cubic metre the third.',
  ),
  holds: [3200, 5000, 6500],
  audio: [
    A('mount', "Sinov tugadi. Natijaga qaraymiz.", 'Проверка закончена. Смотрим результат.', 'The check is over. Let us look at the result.'),
    A('p1', "Mana taxminingiz va mana javob. Qirra to'rt, chunki hajmdan kub ildiz olinadi.", 'Вот твоя догадка и вот ответ. Ребро четыре, потому что из объёма извлекают кубический корень.', 'Here is your guess and here is the answer. The edge is four, because a volume needs a cube root.'),
    A('rule', "O'ng tomonda kamchiliklar xaritasi. Uchta qoida esa hamma kompleks masalada ishlaydi. Birinchisi: o'lchov darajani beradi, va shu sababli uzunlik k marta, sirt k kvadrat, hajm k kub marta o'sadi. Ikkinchisi: teskari yo'lda daraja ildizga aylanadi, hajmdan qirraga kub ildiz orqali o'tiladi. Uchinchisi: geometrik ehtimollik yuzalar nisbatiga teng, va u ko'pincha pi bilan chiqadi. Keyingi dars oxirgi: butun kursning yakuni.", 'Справа карта пробелов. А три правила работают во всех комплексных задачах. Первое: измерение задаёт степень, и поэтому длина растёт в k раз, поверхность в k в квадрате, объём в k в кубе. Второе: в обратную сторону степень становится корнем, от объёма к ребру идут через кубический корень. Третье: геометрическая вероятность равна отношению площадей и часто выходит с пи. Следующий урок последний: итог всего курса.', 'On the right is your gap map. And three rules work in every mixed problem. First: the dimension sets the power, so a length grows k times, a surface k squared, a volume k cubed. Second: backwards a power becomes a root, and from a volume to an edge you go through a cube root. Third: geometric probability equals a ratio of areas and often comes out with pi. The next lesson is the last: the summary of the whole course.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  mode: MODE,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
