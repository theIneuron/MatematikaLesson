// ============================================================================
// 11-sinf, Dars 54. TAYYORLOV VARIANTI: SINOV DTM.
//
// B7 blokining to'rtinchi darsi. Rejada shu dars «Trenirovochnyy variant»
// deb turadi: bu butun yil bo'yicha aralash variant.
//   kontrakt: src/books/grade11/ETALON_11SINF.md, 1.2-band (DTM anatomiyasi)
//   asbob:    `SecantBoard` (ishora lentasi), `AnswerValue`, `Probe`
//   manba:    2-qism, V bob (imtihon banki) + kursning hamma bloklari.
//             Har masala BOSHQA blokdan: B1 dan B7 gacha.
//
// DARSNING BITTA GAPI: imtihonda masalalar aralash keladi, va birinchi ish
// -- masala qaysi blokdan ekanini tanib olish.
//
// SONLAR TEKSHIRILDI:
//   kub qirrasi 6: fazoviy diagonal 6√3 ≈ 10,4;  YOQ diagonali esa 6√2 ≈ 8,5
//   6x ning boshlang'ich funksiyasi 3x² (differensiallab tekshiriladi)
//   3ˣ > 1  ->  x > 0
//   1, 2, 3 raqamlaridan takrorsiz uch xonali son: 3 · 2 · 1 = 6
//   R = 3 da shar hajmi 36π va sfera sirti 36π TENG chiqadi (tasodif),
//     R = 6 da esa 288π va 144π -- ya'ni tenglik umumiy qoida emas
//   perpendikulyarlik: 3x·x + 2·(−2x) + (−1)(−1) = 3x² − 4x + 1 = 0
//     -> x = 1 yoki x = 1/3   [darslik 2-topshiriq]
//   x³ − 3x:  hosila 3x² − 3,  nollari x = −1 va x = 1
//   ikki tanga, kamida bitta gerb: 1 − 1/4 = 3/4
//   log₅(2x − 6) ODZ: x > 3
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_54',
  title: L('Tayyorlov varianti: sinov DTM', 'Тренировочный вариант: пробный ДТМ', 'A training variant: mock exam'),
}

const BLOCK = { label: 'B7', from: 51, to: 56, current: 54 }

// DTM REJIMI. Etalon 1.2-bandi.
const MODE = 'dtm'

// f = x³ − 3x: ishora lentasi uchun
const CUB = (x) => x * x * x - 3 * x

// ============================================================
// SLAYD 1. XUK. Kubning diagonali.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sinov DTM', 'Пробный ДТМ', 'Mock exam'),
  title: L('Kubning diagonali', 'Диагональ куба', 'The diagonal of a cube'),
  expr: L('qirrasi 6', 'ребро 6', 'edge 6'),
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: '6√2',
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: '6√3',
    },
  ],
  probe: {
    question: L(
      'Kubning FAZOVIY diagonali qancha?',
      'Чему равна ПРОСТРАНСТВЕННАЯ диагональ куба?',
      'What is the SPACE diagonal of the cube?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi variant boshlanadi.',
      'Твой ответ записан. Теперь начинается вариант.',
      'Your answer is saved. Now the variant begins.',
    ),
    items: [
      { id: 'a', label: '6√3' },
      { id: 'b', label: '6√2' },
      { id: 'c', label: '6' },
      { id: 'd', label: '18' },
    ],
  },
  holds: [4200, 3600, 3600],
  audio: [
    A('mount', "Tayyorlov varianti. Masalalar aralash keladi: har biri boshqa blokdan, xuddi imtihondagidek.", 'Тренировочный вариант. Задачи идут вперемешку: каждая из другого блока, как на экзамене.', 'A training variant. The problems come mixed: each from a different block, as on the exam.'),
    A('r1', "Karim ikki ildizni oldi.", 'Карим взял корень из двух.', 'Karim took the root of two.'),
    A('r2', "Nargiza esa uch ildizni oldi.", 'А Наргиза взяла корень из трёх.', 'Nargiza took the root of three.'),
    A('ask', "Sizningcha qaysi javob to'g'ri. Taxmin qiling.", 'Как думаешь, какой ответ верный. Предположи.', 'Which answer do you think is right. Make a guess.'),
  ],
}

// ============================================================
// SLAYD 2. MASALA 1 (B1). Boshlang'ich funksiyani tekshirish.
// ============================================================
const S2 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'check_by_diff',
  eyebrow: L('Masala 1 · B1', 'Задача 1 · Б1', 'Problem 1 · B1'),
  title: L('Qaysi biri boshlang\'ich funksiya', 'Какая из них первообразная', 'Which one is the antiderivative'),
  expr: L('6x uchun', 'для 6x', 'for 6x'),
  goal: L('differensiallab tekshirish', 'проверить дифференцированием', 'check by differentiating'),
  rule: L(
    "Har nomzodni differensiallaymiz va 6x chiqishini kutamiz.",
    'Каждого кандидата дифференцируем и ждём 6x.',
    'We differentiate each candidate and expect 6x.',
  ),
  pick: L('Qaysi nomzodni tekshiramiz?', 'Какого кандидата проверим?', 'Which candidate shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('ko\'rinishiga qarab', 'по виду', 'by the look'), value: '?' },
    { id: 'b', key: 'inB', name: L('differensiallab', 'дифференцированием', 'by differentiating'), value: '6x' },
  ],
  points: [
    {
      id: 'q1', label: '3x²', num: '6x', step: 'calc', verdict: 'in',
      calc: L('aynan mos keldi', 'сошлось точно', 'an exact match'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: '6x²', num: '12x', step: 'calc', verdict: 'out',
      calc: L('ikki barobar katta', 'вдвое больше', 'twice too large'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: '3x', num: '3', step: 'calc', verdict: 'out',
      calc: L('iks yo\'qoldi', 'икс исчез', 'the x is gone'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q4', label: '6', num: '0', step: 'calc', verdict: 'out',
      calc: L('o\'zgarmasning hosilasi nol', 'производная постоянной ноль', 'the derivative of a constant is zero'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      'Boshlang\'ich funksiya qanday tekshiriladi?',
      'Как проверяют первообразную?',
      'How is an antiderivative checked?',
    ),
    items: [
      { id: 'b', label: L('differensiallab', 'дифференцированием', 'by differentiating'), correct: true },
      { id: 'a', label: L('ko\'rinishiga qarab', 'по виду', 'by the look'), hint: L("Ko'rinish aldaydi: olti iks kvadrat ham o'xshab turadi, lekin hosilasi o'n ikki iks.", 'Вид обманывает: шесть икс квадрат тоже похоже, но производная двенадцать икс.', 'The look deceives: six x squared looks similar, but its derivative is twelve x.') },
      { id: 'c', label: L('chegaralarni qo\'yib', 'подстановкой границ', 'by putting in the bounds'), hint: L("Chegaralar ANIQ integralda kerak, bu yerda esa funksiyaning o'zi tekshiriladi.", 'Границы нужны в определённом интеграле, а здесь проверяют саму функцию.', 'Bounds belong to a definite integral, here the function itself is checked.') },
      { id: 'd', label: L('tekshirib bo\'lmaydi', 'проверить нельзя', 'it cannot be checked'), hint: L("Bo'ladi, va bu eng oson tekshiruv: teskari amalni bajarish.", 'Можно, и это самая простая проверка: выполнить обратное действие.', 'It can, and it is the simplest check: do the reverse action.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Birinchi masala integral blokidan. To'rtta nomzod bor.", 'Первая задача из блока интеграла. Есть четыре кандидата.', 'The first problem comes from the integral block. There are four candidates.'),
    A('mount', "Nomzodni o'zingiz tanlaysiz.", 'Кандидата выбираешь сам.', 'You choose the candidate yourself.'),
    A('calc', 'Differensiallaymiz.', 'Дифференцируем.', 'We differentiate.'),
    A('mark', "Mana natija. Faqat uch iks kvadratning hosilasi olti iks berdi. Bu integral blokining eng foydali odati: javobni differensiallab tekshirish. U bir necha soniya oladi va butun masalani qutqaradi.", 'Вот результат. Только производная трёх икс квадрат дала шесть икс. Это самая полезная привычка блока интеграла: проверять ответ дифференцированием. Она занимает несколько секунд и спасает всю задачу.', 'Here is the result. Only the derivative of three x squared gave six x. That is the most useful habit from the integral block: check the answer by differentiating. It takes seconds and saves the whole problem.'),
  ],
}

// ============================================================
// SLAYD 3. MASALA 2 (B2). Daraja birdan katta.
// ============================================================
const S3 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'positive_power',
  eyebrow: L('Masala 2 · B2', 'Задача 2 · Б2', 'Problem 2 · B2'),
  title: L('Chegarani qo\'ying', 'Поставь границу', 'Place the boundary'),
  left: L(
    'Asos birdan KATTA',
    'Основание БОЛЬШЕ единицы',
    'The base is MORE than one',
  ),
  template: ['3ˣ > 1  ⇒  x  ', { slot: 0 }, ' 0'],
  signs: ['>', '<'],
  answer: '>',
  checkNote: L(
    'nol darajada aynan bir chiqadi',
    'в нулевой степени выходит ровно один',
    'the zero power gives exactly one',
  ),
  wrongs: [
    { key: '<', hint: L("Manfiy ko'rsatkichda daraja kasr bo'ladi, ya'ni birdan KICHIK.", 'При отрицательном показателе степень становится дробью, то есть МЕНЬШЕ единицы.', 'A negative exponent gives a fraction, that is LESS than one.') },
  ],
  probe: {
    question: L(
      'Asos birdan kichik bo\'lganda?',
      'А если основание меньше единицы?',
      'And if the base is less than one?',
    ),
    items: [
      { id: 'a', label: 'x < 0', correct: true },
      { id: 'b', label: 'x > 0', hint: L("Yarim daraja bir musbat ko'rsatkichda birdan kichik bo'ladi.", 'Половина в положительной степени меньше единицы.', 'A half to a positive power is less than one.') },
      { id: 'c', label: L('o\'zgarmaydi', 'не меняется', 'unchanged'), hint: L("O'zgaradi: asos birdan kichik bo'lsa yo'nalish almashadi.", 'Меняется: при основании меньше единицы направление переворачивается.', 'It changes: a base under one flips the direction.') },
      { id: 'd', label: L('yechim yo\'q', 'решений нет', 'no solutions'), hint: L("Yechim bor: masalan yarim daraja minus bir ikkiga teng.", 'Решения есть: например половина в минус первой равна двум.', 'Solutions exist: a half to the minus first is two.') },
    ],
  },
  audio: [
    A('mount', "Ikkinchi masala ko'rsatkichli tengsizliklar blokidan.", 'Вторая задача из блока показательных неравенств.', 'The second problem comes from the exponential block.'),
    A('write', "Chegarani qo'ying.", 'Поставь границу.', 'Place the boundary.'),
  ],
}

// ============================================================
// SLAYD 4. MASALA 3 (B6). Chizma: ishora lentasi.
// ============================================================
const S4 = {
  role: 'graph',
  section: 'practice',
  tag: 'deriv_sign_monotone',
  drag: false,
  graphSteps: 2,
  eyebrow: L('Masala 3 · B6', 'Задача 3 · Б6', 'Problem 3 · B6'),
  title: L('Qayerda o\'sadi', 'Где возрастает', 'Where it rises'),
  chip: 'f = x³ − 3x',
  secant: {
    fn: CUB,
    xDomain: [-2.4, 2.4],
    yDomain: [-4, 4],
    xTicks: [{ v: -2 }, { v: -1 }, { v: 1 }, { v: 2 }],
    yTicks: [{ v: -2 }, { v: 2 }],
    mode: 'sign',
    signs: [
      { from: -2.4, to: -1, sign: '+', showAt: 1 },
      { from: -1, to: 1, sign: '−', showAt: 1 },
      { from: 1, to: 2.4, sign: '+', showAt: 1 },
    ],
    marks: [
      { v: -1, label: '−1', showAt: 2 },
      { v: 1, label: '1', showAt: 2 },
    ],
    height: 190,
  },
  probe: {
    question: L(
      'Nechta ekstremum bor?',
      'Сколько экстремумов?',
      'How many extrema?',
    ),
    items: [
      { id: 'a', label: '2', correct: true },
      { id: 'b', label: '1', hint: L("Ishora ikki marta almashdi: minus birda va birda.", 'Знак сменился дважды: в минус единице и в единице.', 'The sign flipped twice: at minus one and at one.') },
      { id: 'c', label: '0', hint: L("Nol ekstremum ishora umuman almashmaganda bo'lardi.", 'Ноль экстремумов было бы, если знак вовсе не менялся.', 'Zero extrema would need the sign never to flip.') },
      { id: 'd', label: '3', hint: L("Uchinchi almashish yo'q: lentada faqat ikkita chegara bor.", 'Третьей смены нет: в ленте только две границы.', 'There is no third flip: the band has only two boundaries.') },
    ],
  },
  holds: [4500, 4500],
  audio: [
    A('mount', "Uchinchi masala hosila blokidan. Grafik ostidagi lenta hosilaning ishorasini beradi.", 'Третья задача из блока производной. Лента под графиком даёт знак производной.', 'The third problem comes from the derivative block. The band gives the sign of the derivative.'),
    A('mount', "Ishora ikki joyda almashadi, va har almashish bitta ekstremum beradi.", 'Знак меняется в двух местах, и каждая смена даёт один экстремум.', 'The sign flips in two places, and each flip gives one extremum.'),
  ],
}

// Zanjir amallari: kombinatorika va hosila masalalarining amallari.
const ACTIONS_54 = [
  { id: 'count', label: L('variantlarni sanash', 'посчитать варианты', 'count the options') },
  { id: 'mult', label: L('ko\'paytirish qoidasi', 'правило умножения', 'the multiplication rule') },
  { id: 'der', label: L('hosilani topish', 'найти производную', 'find the derivative') },
  { id: 'zero', label: L('nolga tenglashtirish', 'приравнять к нулю', 'set equal to zero') },
  { id: 'check', label: L('javobni tekshirish', 'проверить ответ', 'check the answer') },
]

// ============================================================
// SLAYD 5. MASALA 4 (B3). Zanjir: uch xonali sonlar.
// ============================================================
const S5 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'order_matters',
  noLine: true,
  eyebrow: L('Masala 4 · B3', 'Задача 4 · Б3', 'Problem 4 · B3'),
  title: L('Nechta son yasaladi', 'Сколько чисел получится', 'How many numbers come out'),
  start: L('1, 2, 3 raqamlari, takrorsiz', 'цифры 1, 2, 3, без повторов', 'digits 1, 2, 3, no repeats'),
  actions: ACTIONS_54,
  steps: [
    {
      action: 'count',
      to: '3 · 2 · 1',
      wrongs: [
        { action: 'mult', hint: L("Ko'paytirish qoidasi keyingi qadam: avval har o'rinda nechta variant borligini sanash kerak.", 'Правило умножения это следующий шаг: сначала надо посчитать варианты на каждом месте.', 'The multiplication rule comes next: first count the options at each place.') },
        { action: 'der', hint: L("Hosila bu masalada yo'q.", 'Производной в этой задаче нет.', 'No derivative in this problem.') },
        { action: 'zero', hint: L("Nolga tenglashtirish hosila masalasida kerak.", 'Приравнивать к нулю нужно в задаче о производной.', 'Setting to zero belongs to the derivative problem.') },
      ],
    },
    {
      action: 'mult',
      to: '6',
      wrongs: [
        { action: 'count', hint: L("Variantlar sanaldi: uch, ikki, bir.", 'Варианты посчитаны: три, два, один.', 'The options are counted: three, two, one.') },
        { action: 'check', hint: L("Tekshiruv oxirida bo'ladi, javob esa hali yo'q.", 'Проверка будет в конце, а ответа ещё нет.', 'The check comes last, and there is no answer yet.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['6', '9', '3', '27'],
    value: ['6'],
    label: L('sonlar =', 'чисел =', 'numbers ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '9', hint: L("To'qqiz bu uch karra uch: bu takrorlash MUMKIN bo'lganda, ikki xonali sonda.", 'Девять это три на три: так было бы при разрешённых повторах в двузначном числе.', 'Nine is three times three: that would be two digits with repeats allowed.') },
      { key: '3', hint: L("Uch bu faqat birinchi raqamning variantlari.", 'Три это только варианты первой цифры.', 'Three is only the options for the first digit.') },
      { key: '27', hint: L("Yigirma yetti bu takrorlash mumkin bo'lganda: uch karra uch karra uch.", 'Двадцать семь это при разрешённых повторах: три на три на три.', 'Twenty seven is with repeats allowed: three times three times three.') },
      { key: '*', hint: L("Birinchi o'rinda uch variant, ikkinchisida ikki, uchinchisida bir.", 'На первом месте три варианта, на втором два, на третьем один.', 'Three options at the first place, two at the second, one at the third.') },
    ],
  },
  audio: [
    A('mount', "To'rtinchi masala kombinatorika blokidan. Ro'yxatda hosila masalasining amallari ham bor.", 'Четвёртая задача из блока комбинаторики. В списке есть и действия задачи о производной.', 'The fourth problem comes from the combinatorics block. The list also holds actions of the derivative problem.'),
    A('step3', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 6. MASALA 5 (B4). Hajm va sirt tasodifan teng.
// ============================================================
const S6 = {
  role: 'twoway',
  section: 'practice',
  tag: 'ball_vs_sphere',
  eyebrow: L('Masala 5 · B4', 'Задача 5 · Б4', 'Problem 5 · B4'),
  title: L('Hajm va sirt teng bo\'ladimi', 'Бывают ли объём и площадь равны', 'Can volume and surface be equal'),
  expr: L('shar R = 3', 'шар R = 3', 'a ball with R = 3'),
  need: L('tenglik qoidami', 'правило ли это', 'is it a rule'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('har doim teng dedi', 'сказал: всегда равны', 'said always equal'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: L('qoida', 'правило', 'a rule'),
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('faqat R = 3 da dedi', 'сказала: только при R = 3', 'said only for R = 3'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: L('tasodif', 'совпадение', 'a coincidence'),
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['288π', '144π', '36π', '216π'],
    value: ['288π'],
    label: L('R = 6 da hajm =', 'при R = 6 объём =', 'at R = 6 the volume ='),
    prompt: L('Hajmni yozing', 'Запиши объём', 'Write the volume'),
    wrongs: [
      { key: '144π', hint: L("Bu R olti bo'lganda SIRT. Hajm boshqa: to'rt uchdan bir karra R kub.", 'Это ПОВЕРХНОСТЬ при R равном шести. Объём другой: четыре третьих на R куб.', 'That is the SURFACE at R equal six. The volume differs: four thirds times R cubed.') },
      { key: '36π', hint: L("O'ttiz olti pi bu R uchga teng bo'lgandagi hajm.", 'Тридцать шесть пи это объём при R равном трём.', 'Thirty six pi is the volume at R equal three.') },
      { key: '216π', hint: L("Ikki yuz o'n olti bu R kubning o'zi: to'rt uchdan bir koeffitsiyenti qo'shilmagan.", 'Двести шестнадцать это сам R куб: коэффициент четыре третьих не учтён.', 'Two hundred sixteen is R cubed itself: the four thirds coefficient is missing.') },
      { key: '*', hint: L("To'rt uchdan bir karra ikki yuz o'n olti ikki yuz sakson sakkiz beradi.", 'Четыре третьих на двести шестнадцать даёт двести восемьдесят восемь.', 'Four thirds times two hundred sixteen gives two hundred eighty eight.') },
    ],
  },
  holds: [4200, 4200, 5500],
  audio: [
    A('mount', "Beshinchi masala stereometriya blokidan. Radius uchga teng bo'lganda hajm ham, sirt ham o'ttiz olti pi chiqadi.", 'Пятая задача из блока стереометрии. При радиусе три и объём, и поверхность выходят тридцать шесть пи.', 'The fifth problem comes from the solid geometry block. At radius three both the volume and the surface come out thirty six pi.'),
    A('p1', "Aziz bundan qoida yasadi: hajm va sirt har doim teng.", 'Азиз сделал из этого правило: объём и поверхность всегда равны.', 'Aziz turned that into a rule: the volume and the surface are always equal.'),
    A('p2', "Dilnoza esa boshqa radiusni sinab ko'rdi. Oltida hajm ikki yuz sakson sakkiz pi, sirt esa yuz qirq to'rt pi. Demak tenglik qoida emas, tasodif: bitta misol qoida yasamaydi.", 'А Дилноза попробовала другой радиус. В шести объём двести восемьдесят восемь пи, а поверхность сто сорок четыре пи. Значит равенство не правило, а совпадение: один пример правила не делает.', 'Dilnoza tried another radius. At six the volume is two hundred eighty eight pi and the surface one hundred forty four pi. So the equality is not a rule but a coincidence: one example makes no rule.'),
    A('write', 'R olti bo\'lgandagi hajmni yozing.', 'Запиши объём при R равном шести.', 'Write the volume at R equal six.'),
  ],
}

// ============================================================
// SLAYD 7. MASALA 6 (B5). Perpendikulyarlik (darslik 2-topshiriq).
// ============================================================
const S7 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'perp_zero',
  eyebrow: L('Masala 6 · B5', 'Задача 6 · Б5', 'Problem 6 · B5'),
  title: L('Qaysi x da perpendikulyar', 'При каком x перпендикулярны', 'For which x are they perpendicular'),
  expr: 'a (3x; 2; −1),  b (x; −2x; −1)',
  goal: L('ko\'paytmani nolga tenglash', 'приравнять произведение к нулю', 'set the product to zero'),
  rule: L(
    "Skalyar ko'paytma 3x² − 4x + 1 ga teng. Har javobni sinaymiz.",
    'Скалярное произведение равно 3x² − 4x + 1. Проверяем каждый ответ.',
    'The dot product equals 3x² − 4x + 1. We test each answer.',
  ),
  pick: L('Qaysi javobni tekshiramiz?', 'Какой ответ проверим?', 'Which answer shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('bitta ildiz', 'один корень', 'one root'), value: '1' },
    { id: 'b', key: 'inB', name: L('ikkita ildiz', 'два корня', 'two roots'), value: '2' },
  ],
  points: [
    {
      id: 'q1', label: 'x = 1', num: '3 − 4 + 1 = 0', step: 'calc', verdict: 'in',
      calc: L('nolga teng', 'равно нулю', 'equals zero'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: 'x = 1/3', num: '1/3 − 4/3 + 1 = 0', step: 'calc', verdict: 'in',
      calc: L('bu ham nol', 'это тоже ноль', 'zero as well'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: 'x = 3', num: '27 − 12 + 1 = 16', step: 'calc', verdict: 'out',
      calc: L('noldan uzoq', 'далеко от нуля', 'far from zero'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q4', label: 'x = −1', num: '3 + 4 + 1 = 8', step: 'calc', verdict: 'out',
      calc: L('yana nol emas', 'снова не ноль', 'not zero again'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L(
      'Nechta javob bor?',
      'Сколько ответов?',
      'How many answers?',
    ),
    items: [
      { id: 'b', label: L('ikkita', 'два', 'two'), correct: true },
      { id: 'a', label: L('bitta', 'один', 'one'), hint: L("Kvadrat tenglama ikki ildiz berdi, va ikkisi ham nolni beradi.", 'Квадратное уравнение дало два корня, и оба дают ноль.', 'The quadratic gave two roots, and both give zero.') },
      { id: 'c', label: L('bitta ham yo\'q', 'ни одного', 'none'), hint: L("Bir va uchdan bir tekshiruvdan o'tdi.", 'Один и одна третья проверку прошли.', 'One and one third passed the check.') },
      { id: 'd', label: L('cheksiz ko\'p', 'бесконечно много', 'infinitely many'), hint: L("Kvadrat tenglamada ikkitadan ko'p ildiz bo'lmaydi.", 'У квадратного уравнения не бывает больше двух корней.', 'A quadratic never has more than two roots.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Oltinchi masala fazo blokidan, darslikning ikkinchi topshirig'i.", 'Шестая задача из блока пространства, это второе задание учебника.', 'The sixth problem comes from the space block, item two from the textbook.'),
    A('mount', "Javobni o'zingiz tanlaysiz.", 'Ответ выбираешь сам.', 'You choose the answer yourself.'),
    A('calc', 'Qo\'yamiz.', 'Подставляем.', 'We substitute.'),
    A('mark', "Mana natija. Ikkita qiymat ko'paytmani nolga aylantirdi: bir va uchdan bir. Bu tabiiy, chunki shart kvadrat tenglamaga olib keldi, kvadrat tenglama esa ikki ildiz beradi. DTM da bunday savolda bitta javob degan tuzoq ko'p uchraydi: ikkinchi ildizni ham yozish kerak.", 'Вот результат. Два значения обратили произведение в ноль: один и одна третья. Это естественно, ведь условие привело к квадратному уравнению, а оно даёт два корня. На ДТМ в таком вопросе часто ловят на одном ответе: второй корень тоже надо записать.', 'Here is the result. Two values made the product zero: one and one third. That is natural, since the condition led to a quadratic, and a quadratic gives two roots. On the exam such a question often traps with a single answer: the second root must be written too.'),
  ],
}

// ============================================================
// SLAYD 8. MASALA 7 (B6). Mustaqil: statsionar nuqtalar.
// ============================================================
const S8 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'stationary_not_extremum',
  noLine: true,
  solo: true,
  eyebrow: L('Masala 7 · B6', 'Задача 7 · Б6', 'Problem 7 · B6'),
  title: L('Imtihondagidek', 'Как на экзамене', 'As on the exam'),
  start: 'f = x³ − 3x',
  actions: ACTIONS_54,
  hint: L(
    "Statsionar nuqta -- hosila nolga aylangan joy.",
    'Стационарная точка это место, где производная обратилась в ноль.',
    'A stationary point is where the derivative vanishes.',
  ),
  steps: [
    {
      action: 'der',
      to: '3x² − 3',
      wrongs: [
        { action: 'zero', hint: L("Nolga tenglashtirish uchun avval hosila kerak.", 'Чтобы приравнять к нулю, сначала нужна производная.', 'To set it to zero the derivative comes first.') },
        { action: 'count', hint: L("Sanash kombinatorika masalasida edi.", 'Считать варианты было в задаче комбинаторики.', 'Counting options belonged to the combinatorics problem.') },
        { action: 'mult', hint: L("Ko'paytirish qoidasi ham u yerda edi.", 'Правило умножения тоже было там.', 'The multiplication rule was there too.') },
      ],
    },
    {
      action: 'zero',
      to: 'x = −1;  x = 1',
      wrongs: [
        { action: 'der', hint: L("Hosila topildi: uch iks kvadrat minus uch.", 'Производная найдена: три икс квадрат минус три.', 'The derivative is found: three x squared minus three.') },
        { action: 'check', hint: L("Tekshiruv oxirida: avval nollarni topish kerak.", 'Проверка в конце: сначала надо найти нули.', 'The check comes last: first find the zeros.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['−1;  1', '0', '3', '−1'],
    value: ['−1;  1'],
    label: L('statsionar nuqtalar', 'стационарные точки', 'stationary points'),
    prompt: L('Nuqtalarni yozing', 'Запиши точки', 'Write the points'),
    wrongs: [
      { key: '0', hint: L("Nolda hosila minus uchga teng, ya'ni nol emas.", 'В нуле производная равна минус трём, то есть не ноль.', 'At zero the derivative is minus three, so not zero.') },
      { key: '3', hint: L("Uch bu ko'paytuvchi, ildiz emas: uch iks kvadrat uchga teng bo'lsa, iks kvadrat bir.", 'Три это множитель, а не корень: если три икс квадрат равно трём, икс квадрат равен одному.', 'Three is the factor, not a root: if three x squared is three, then x squared is one.') },
      { key: '−1', hint: L("Bitta ildiz tushib qolgan: kvadrat ikki ishorani beradi.", 'Потерян один корень: квадрат даёт два знака.', 'One root is lost: a square gives two signs.') },
      { key: '*', hint: L("Iks kvadrat birga teng, demak iks minus bir va bir.", 'Икс квадрат равно одному, значит икс минус один и один.', 'x squared equals one, so x is minus one and one.') },
    ],
  },
  audio: [
    A('mount', "Yettinchi masala mustaqil, hosila blokidan. Bu funksiya uchinchi ekranda uchragan edi.", 'Седьмая задача самостоятельная, из блока производной. Эта функция была на третьем экране.', 'The seventh problem is on your own, from the derivative block. This function appeared on the third screen.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 9. MASALA 8 (B7). Diametrga tayangan burchak.
// ============================================================
const S9 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'inscribed_angle',
  eyebrow: L('Masala 8 · B7', 'Задача 8 · Б7', 'Problem 8 · B7'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Burchak DIAMETRGA tayanadi',
    'Угол опирается на ДИАМЕТР',
    'The angle rests on a DIAMETER',
  ),
  template: [L('burchak  ', 'угол  ', 'the angle  '), { slot: 0 }, '  90°'],
  signs: ['=', '<'],
  answer: '=',
  checkNote: L(
    'markaziy burchak 180°, ichki esa yarmi',
    'центральный угол 180°, а вписанный половина',
    'the central angle is 180°, the inscribed one a half',
  ),
  wrongs: [
    { key: '<', hint: L("Kichik bo'lsa, burchak diametrga emas, kichik yoyga tayangan bo'lardi.", 'Если бы меньше, угол опирался бы не на диаметр, а на меньшую дугу.', 'If it were less, the angle would rest on a smaller arc, not a diameter.') },
  ],
  probe: {
    question: L(
      'Bu qanday teorema?',
      'Как называется эта теорема?',
      'What is this theorem called?',
    ),
    items: [
      { id: 'a', label: L('Fales teoremasi', 'теорема Фалеса', 'the Thales theorem'), correct: true },
      { id: 'b', label: L('Pifagor teoremasi', 'теорема Пифагора', 'the Pythagoras theorem'), hint: L("Pifagor tomonlar haqida, bu esa burchak haqida.", 'Пифагор о сторонах, а это об угле.', 'Pythagoras is about sides, this is about an angle.') },
      { id: 'c', label: L('Kavalyeri natijasi', 'результат Кавальери', 'the Cavalieri result'), hint: L("Kavalyeri hajmlar haqida, va u fazoda ishlaydi.", 'Кавальери об объёмах, и он работает в пространстве.', 'Cavalieri is about volumes and works in space.') },
      { id: 'd', label: L('nomi yo\'q', 'без названия', 'it has no name'), hint: L("Nomi bor, va u DTM da shu nom bilan uchraydi.", 'Название есть, и на ДТМ оно встречается именно так.', 'It has a name, and the exam uses it.') },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi masala planimetriya blokidan.", 'Восьмая задача из блока планиметрии.', 'The eighth problem comes from the plane geometry block.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 10. MASALA 9 (B2). Teskari masala: ODZ.
// ============================================================
const S10 = {
  role: 'build',
  section: 'practice',
  led: 'student',
  tag: 'log_domain',
  right: '2/2',
  eyebrow: L('Masala 9 · B2', 'Задача 9 · Б2', 'Problem 9 · B2'),
  title: L('ODZ ni yig\'ing', 'Собери область', 'Build the domain'),
  targetLabel: L('Ifoda', 'Выражение', 'The expression'),
  targetValue: 'log₅(2x − 6)',
  tasks: [
    {
      prompt: L('Shartni yozing', 'Запиши условие', 'Write the condition'),
      template: ['2x − 6 ', { slot: 0 }, ' 0'],
      parts: ['>', '≥', '=', '≠'],
      answer: ['>'],
      doneLabel: '2x − 6 > 0',
      wrongs: [
        { key: '≥', hint: L("Nol mumkin emas: nolning logarifmi yo'q.", 'Ноль нельзя: логарифма нуля нет.', 'Zero is not allowed: there is no logarithm of zero.') },
        { key: '≠', hint: L("Nolga teng bo'lmaslik yetmaydi: manfiy son ham mumkin emas.", 'Не равно нулю недостаточно: отрицательное тоже нельзя.', 'Not equal to zero is not enough: a negative is not allowed either.') },
        { key: '*', hint: L("Logarifmning argumenti QAT'IY musbat bo'lishi kerak.", 'Аргумент логарифма должен быть СТРОГО положительным.', 'The argument of a logarithm must be STRICTLY positive.') },
      ],
    },
    {
      prompt: L('Yechimni yozing', 'Запиши решение', 'Write the solution'),
      template: ['x ', { slot: 0 }, ' 3'],
      parts: ['>', '<', '≥', '='],
      answer: ['>'],
      doneLabel: 'x > 3',
      wrongs: [
        { key: '<', hint: L("Ikki iks oltidan katta bo'lsa, iks ham uchdan katta.", 'Если два икс больше шести, то и икс больше трёх.', 'If two x exceeds six, then x exceeds three.') },
        { key: '≥', hint: L("Uchda argument nolga aylanadi, va bu mumkin emas.", 'В трёх аргумент обращается в ноль, а это нельзя.', 'At three the argument becomes zero, which is not allowed.') },
        { key: '*', hint: L("Ikkiga bo'lish yo'nalishni o'zgartirmaydi: ikki musbat.", 'Деление на два направление не меняет: два положительно.', 'Dividing by two keeps the direction: two is positive.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'qqizinchi masala teskari, logarifm blokidan: shartni o'zingiz yozasiz.", 'Девятая задача обратная, из блока логарифмов: условие записываешь сам.', 'The ninth problem is reverse, from the logarithm block: you write the condition.'),
    A('built1', "Endi yechimni yozing.", 'Теперь запиши решение.', 'Now write the solution.'),
  ],
}

// ============================================================
// SLAYD 11. MASALA 10 (B3). Kamida bitta gerb.
// ============================================================
const S11 = {
  role: 'twoway',
  section: 'practice',
  tag: 'frequency_vs_prob',
  eyebrow: L('Masala 10 · B3', 'Задача 10 · Б3', 'Problem 10 · B3'),
  title: L('Kamida bitta gerb', 'Хотя бы один герб', 'At least one head'),
  expr: L('ikki tanga', 'две монеты', 'two coins'),
  need: L('kamida bitta', 'хотя бы один', 'at least one'),
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
      txt: L('teskarisidan hisobladi', 'считала через обратное', 'counted via the complement'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '3/4',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['3/4', '1/2', '1/4', '2/4'],
    value: ['3/4'],
    label: 'P =',
    prompt: L('Ehtimollikni yozing', 'Запиши вероятность', 'Write the probability'),
    wrongs: [
      { key: '1/2', hint: L("Yarim bu BITTA tanga uchun. Ikki tangada to'rtta natija bor.", 'Половина это для ОДНОЙ монеты. У двух монет четыре исхода.', 'A half is for ONE coin. Two coins have four outcomes.') },
      { key: '1/4', hint: L("Bir chorak bu «ikkita gerb» yoki «bitta ham gerb yo'q».", 'Одна четвёртая это «два герба» или «ни одного герба».', 'A quarter is "two heads" or "no heads".') },
      { key: '2/4', hint: L("Ikki to'rtdan bu aynan bitta gerb bo'lgan holat, «kamida bitta» esa ko'proq.", 'Две четвёртых это ровно один герб, а «хотя бы один» больше.', 'Two quarters is exactly one head, and "at least one" is more.') },
      { key: '*', hint: L("Teskarisi «bitta ham gerb yo'q», ya'ni bir chorak. Birdan ayiramiz.", 'Обратное это «ни одного герба», то есть одна четвёртая. Вычитаем из единицы.', 'The complement is "no heads", that is a quarter. Subtract from one.') },
    ],
  },
  holds: [3200, 3600, 5500],
  audio: [
    A('mount', "O'ninchi masala, oxirgisi. Ehtimollik blokidan.", 'Десятая задача, последняя. Из блока вероятности.', 'The tenth problem, the last. From the probability block.'),
    A('p1', "Aziz yarim dedi: gerb yoki tanga.", 'Азиз сказал половина: герб или решка.', 'Aziz said a half: heads or tails.'),
    A('p2', "Dilnoza esa teskarisidan bordi. Kamida bitta gerb ning teskarisi bitta ham gerb yo'q, va bu bitta natija to'rttadan. Demak javob bir minus bir chorak, ya'ni uch chorak. Bu usul DTM da vaqtni tejaydi: kamida bitta so'zi ko'rinsa, teskarisini hisoblash kerak.", 'А Дилноза пошла через обратное. Обратное к хотя бы один герб это ни одного герба, а это один исход из четырёх. Значит ответ один минус одна четвёртая, то есть три четвёртых. Этот приём экономит время на ДТМ: увидел хотя бы один, считай обратное.', 'Dilnoza went through the complement. The complement of at least one head is no heads, one outcome of four. So the answer is one minus a quarter, that is three quarters. That trick saves time on the exam: when you see at least one, count the complement.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS. Har savol boshqa blokdan.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol, olti blok', 'Шесть вопросов, шесть блоков', 'Six questions, six blocks'),
  items: [
    {
      id: 'b1', tag: 'plus_c', ask: true, cols: 2,
      done: 'x⁴ + C',
      prompt: L('4x³ ning boshlang\'ich funksiyasi?', 'Первообразная 4x³?', 'The antiderivative of 4x³?'),
      items: [
        { id: 'a', label: 'x⁴ + C', correct: true },
        { id: 'b', label: '12x² + C', hint: L("Bu hosila tomoni.", 'Это в сторону производной.', 'That goes the derivative way.') },
        { id: 'c', label: 'x⁴', hint: L("O'zgarmas qo'shilmagan: boshlang'ich funksiya oilaviy.", 'Не добавлена постоянная: первообразная это семейство.', 'The constant is missing: an antiderivative is a family.') },
        { id: 'd', label: '4x⁴ + C', hint: L("Ko'paytuvchi ikki marta hisoblangan: to'rt daraja qoidasi bilan qisqaradi.", 'Множитель учтён дважды: четвёрка сокращается с правилом степени.', 'The factor is counted twice: the four cancels with the power rule.') },
      ],
    },
    {
      id: 'b2', tag: 'same_base', ask: true, cols: 2,
      done: '2',
      prompt: 'log₈ 64',
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '8', hint: L("Sakkiz bu asos, javob esa ko'rsatkich.", 'Восемь это основание, а ответ это показатель.', 'Eight is the base, the answer is the exponent.') },
        { id: 'c', label: '3', hint: L("Uch ikki asosida chiqardi: sakkiz ikkining kubi.", 'Три вышло бы при основании два: восемь это два в кубе.', 'Three would come with base two: eight is two cubed.') },
        { id: 'd', label: '64', hint: L("Oltmish to'rt bu argument.", 'Шестьдесят четыре это аргумент.', 'Sixty four is the argument.') },
      ],
    },
    {
      id: 'b3', tag: 'sum_vs_product', ask: true, cols: 2,
      done: '12',
      prompt: L('3 ko\'ylak va 4 shim: nechta kiyim to\'plami?', '3 рубашки и 4 брюк: сколько комплектов?', '3 shirts and 4 trousers: how many outfits?'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '7', hint: L("Qo'shish «yoki» degani, to'plamda esa ikkisi ham bor.", 'Сложение это «или», а в комплекте есть и то, и другое.', 'Adding means "or", and an outfit has both.') },
        { id: 'c', label: '4', hint: L("To'rt bu faqat shimlar soni.", 'Четыре это только число брюк.', 'Four is only the number of trousers.') },
        { id: 'd', label: '81', hint: L("Sakson bir bu uch daraja to'rt: bunday holat bu yerda yo'q.", 'Восемьдесят один это три в четвёртой: такого случая здесь нет.', 'Eighty one is three to the fourth: no such case here.') },
      ],
    },
    {
      id: 'b4', tag: 'third_coefficient', ask: true, cols: 2,
      done: '1/3',
      prompt: L('Konus hajmi silindrning qanchasi?', 'Какая часть цилиндра объём конуса?', 'What part of the cylinder is the cone volume?'),
      items: [
        { id: 'a', label: '1/3', correct: true },
        { id: 'b', label: '1/2', hint: L("Yarim tekislikdagi odatdan keladi.", 'Половина идёт от привычки с плоскости.', 'A half comes from the plane habit.') },
        { id: 'c', label: '2/3', hint: L("Uchdan ikki shar va silindr nisbatida uchraydi.", 'Две трети встречаются у шара и цилиндра.', 'Two thirds appears for a ball and a cylinder.') },
        { id: 'd', label: '1/6', hint: L("Bir oltidan hech qanday qoidada yo'q.", 'Одной шестой нет ни в одном правиле.', 'No rule gives a sixth.') },
      ],
    },
    {
      id: 'b5', tag: 'dist_flat', ask: true, cols: 2,
      done: '5',
      prompt: L('(0;0;0) dan (3;4;0) gacha masofa?', 'Расстояние от (0;0;0) до (3;4;0)?', 'The distance from (0;0;0) to (3;4;0)?'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '7', hint: L("Yetti bu koordinatalar yig'indisi.", 'Семь это сумма координат.', 'Seven is the sum of coordinates.') },
        { id: 'c', label: '25', hint: L("Yigirma besh kvadratlar yig'indisi: ildiz olinmagan.", 'Двадцать пять это сумма квадратов: корень не взят.', 'Twenty five is the sum of squares: the root is missing.') },
        { id: 'd', label: '12', hint: L("O'n ikki bu ko'paytma.", 'Двенадцать это произведение.', 'Twelve is the product.') },
      ],
    },
    {
      id: 'b6', tag: 'tangent_point', ask: true, cols: 2,
      done: '10',
      prompt: L('y = x² ga 5 nuqtada urinmaning qiyaligi?', 'Наклон касательной к y = x² в точке 5?', 'The slope of the tangent to y = x² at 5?'),
      items: [
        { id: 'a', label: '10', correct: true },
        { id: 'b', label: '25', hint: L("Yigirma besh bu funksiyaning qiymati.", 'Двадцать пять это значение функции.', 'Twenty five is the value of the function.') },
        { id: 'c', label: '5', hint: L("Besh bu nuqtaning o'zi, qiyalik esa ikki barobar.", 'Пять это сама точка, а наклон вдвое больше.', 'Five is the point itself, and the slope is twice that.') },
        { id: 'd', label: '2', hint: L("Ikki bu ko'paytuvchi: unga nuqta ham kerak.", 'Два это множитель: к нему нужна точка.', 'Two is the factor: the point is still needed.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, olti blokdan, va faqat shu ekran natijaga kiradi.", 'Блиц. Шесть вопросов из шести блоков, и только этот экран идёт в результат.', 'Quick round. Six questions from six blocks, and only this screen counts.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Yoq diagonali fazoviy deb olingan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'cross_section',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: L('kub, qirrasi 6', 'куб с ребром 6', 'a cube with edge 6') },
    { id: 'r2', text: L('fazoviy diagonal kerak', 'нужна пространственная диагональ', 'the space diagonal is needed') },
    { id: 'r3', text: 'd² = 6² + 6² = 72' },
    { id: 'r4', text: 'd = 6√2' },
    { id: 'r5', text: L('javob: 6√2', 'ответ: 6√2', 'answer: 6√2') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Bu ham shart: fazoviy diagonal so'ralgan.", 'Это тоже условие: спрашивают пространственную диагональ.', 'This is the problem too: the space diagonal is asked.'),
    r4: L("Uchinchi satrdan bu to'g'ri chiqadi: yetmish ikkining ildizi olti ildiz ikki.", 'Из третьей строки это выходит верно: корень из семидесяти двух это шесть корень два.', 'From the third line this follows: the root of seventy two is six root two.'),
    r5: L("Oxirgi satr faqat ko'chirma.", 'Последняя строка только перепись.', 'The last line is just a copy.'),
  },
  proofPoint: L('uchinchi qirra qo\'shilmagan', 'третье ребро не добавлено', 'the third edge is missing'),
  proof: L(
    "Ikki qirra YOQ diagonalini beradi. Fazoviy diagonalga UCHTA qirra kerak: oltmish olti plyus oltmish olti plyus oltmish olti, ya'ni yuz sakkiz, ildizi olti ildiz uch.",
    'Два ребра дают диагональ ГРАНИ. Пространственной диагонали нужны ТРИ ребра: тридцать шесть трижды, то есть сто восемь, корень шесть корень три.',
    'Two edges give a FACE diagonal. A space diagonal needs THREE edges: thirty six three times, that is one hundred eight, root six root three.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('uchinchi qirra hisoblanmagan', 'третье ребро не учтено', 'the third edge is not counted'), correct: true },
      { id: 'b', label: L('ildiz xato olingan', 'корень взят неверно', 'the root is wrong'), hint: L("Ildiz to'g'ri: yetmish ikkidan olti ildiz ikki chiqadi.", 'Корень верен: из семидесяти двух выходит шесть корень два.', 'The root is right: seventy two gives six root two.') },
      { id: 'c', label: L('qirra xato', 'ребро неверно', 'the edge is wrong'), hint: L("Qirra shartdan olingan.", 'Ребро взято из условия.', 'The edge comes from the problem.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Javob YOQ diagonalini beradi, so'ralgan esa fazoviy.", 'Ответ даёт диагональ ГРАНИ, а спрашивают пространственную.', 'The answer gives the FACE diagonal, and the space one is asked.') },
    ],
  },
  audio: [
    A('mount', "Variant tugadi. Endi boshqaning yechimiga qaraymiz.", 'Вариант закончен. Теперь посмотрим на чужое решение.', 'The variant is done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: hisob to'g'ri, ildiz ham to'g'ri. Xato bittasida.", 'Внимание: счёт верен, корень тоже. Ошибка в одной строке.', 'Careful: the arithmetic is right and so is the root. One line holds the error.'),
    A('proof', "Qarang: kubda ikki xil diagonal bor. Yoq diagonali ikki qirradan yasaladi, fazoviy diagonal esa uchtasidan: u kubni bir uchidan qarshi uchiga kesib o'tadi. Uchinchi satrda faqat ikki qirra qo'shilgan, shuning uchun javob yoq diagonalini berdi. To'g'ri javob olti ildiz uch, va u olti ildiz ikkidan katta. Tekshiruv oson: fazoviy diagonal kubning eng uzun kesmasi.", 'Смотри: у куба две разные диагонали. Диагональ грани строится из двух рёбер, а пространственная из трёх: она проходит от одной вершины к противоположной. В третьей строке сложены только два ребра, поэтому ответ дал диагональ грани. Верный ответ шесть корень три, и он больше шести корней двух. Проверка простая: пространственная диагональ это самый длинный отрезок куба.', 'Look: a cube has two different diagonals. A face diagonal is built from two edges, a space diagonal from three: it runs from one vertex to the opposite one. The third line added only two edges, so the answer gave the face diagonal. The right answer is six root three, larger than six root two. The check is easy: the space diagonal is the longest segment of a cube.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: ikki diagonal.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'cross_section',
  right: '2/2',
  eyebrow: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  title: L('Ikki diagonalni yig\'ing', 'Собери две диагонали', 'Build the two diagonals'),
  targetLabel: L('Kub', 'Куб', 'The cube'),
  targetValue: L('qirrasi a', 'ребро a', 'edge a'),
  tasks: [
    {
      prompt: L('Yoq diagonali', 'Диагональ грани', 'The face diagonal'),
      template: ['d = a', { slot: 0 }],
      parts: ['√2', '√3', '√6', '²'],
      answer: ['√2'],
      doneLabel: 'd = a√2',
      wrongs: [
        { key: '√3', hint: L("Uch ildiz FAZOVIY diagonalda: u yerda uchta qirra qo'shiladi.", 'Корень из трёх в ПРОСТРАНСТВЕННОЙ диагонали: там складывают три ребра.', 'Root three belongs to the SPACE diagonal: three edges are added there.') },
        { key: '√6', hint: L("Olti ildiz bu qirralar teng bo'lmagan parallelepipedda uchrashi mumkin.", 'Корень из шести может встретиться в параллелепипеде с разными рёбрами.', 'Root six may appear in a box with unequal edges.') },
        { key: '*', hint: L("Yoqda ikki qirra: a kvadrat plyus a kvadrat ikki a kvadrat beradi.", 'В грани два ребра: a квадрат плюс a квадрат даёт два a квадрат.', 'A face has two edges: a squared plus a squared gives two a squared.') },
      ],
    },
    {
      prompt: L('Fazoviy diagonal', 'Пространственная диагональ', 'The space diagonal'),
      template: ['D = a', { slot: 0 }],
      parts: ['√3', '√2', '3', '√9'],
      answer: ['√3'],
      doneLabel: 'D = a√3',
      wrongs: [
        { key: '√2', hint: L("Ikki ildiz YOQ diagonalida.", 'Корень из двух в диагонали ГРАНИ.', 'Root two belongs to the FACE diagonal.') },
        { key: '3', hint: L("Uchning o'zi ko'p: diagonal qirradan taxminan bir butun yetti barobar uzun.", 'Сама тройка это много: диагональ длиннее ребра примерно в одну целую семь.', 'Three itself is too much: the diagonal is about one point seven times the edge.') },
        { key: '*', hint: L("Uchta qirra: a kvadrat uch marta, ildizi a ildiz uch.", 'Три ребра: a квадрат трижды, корень a корень три.', 'Three edges: a squared three times, whose root is a root three.') },
      ],
    },
  ],
  audio: [
    A('mount', "Oxirgi topshiriq: kubning ikki diagonali bir joyda.", 'Последнее задание: две диагонали куба рядом.', 'The last task: the two diagonals of a cube side by side.'),
    A('built1', "Endi fazoviy diagonal.", 'Теперь пространственная диагональ.', 'Now the space diagonal.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'cross_section',
  gapMap: 6,
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L('Variant natijasi', 'Результат варианта', 'The variant result'),
  law: L('avval blokni tanib ol', 'сначала узнай блок', 'first recognise the block'),
  ruleLines: [
    L('javobni teskari amal bilan tekshir', 'проверяй обратным действием', 'check with the reverse action'),
    L('«kamida bitta» -- teskarisini hisobla', '«хотя бы один» — считай обратное', '"at least one" means count the complement'),
    L('bitta misol qoida yasamaydi', 'один пример правила не делает', 'one example makes no rule'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('kubning fazoviy diagonali', 'пространственная диагональ куба', 'the space diagonal of a cube'),
      right: '6√3',
      map: { a: '6√3', b: '6√2', c: '6', d: '18' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('yoq 6√2, fazoviy 6√3', 'грань 6√2, пространственная 6√3', 'face 6√2, space 6√3'),
  },
  levels: {
    full: L('Variant siz uchun yopildi', 'Вариант у тебя закрыт', 'The variant is covered'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Xaritada ko\'rsatilgan darslarga qayting', 'Вернись к урокам, указанным в карте', 'Go back to the lessons named in the map'),
  },
  probe: {
    question: L(
      'Aralash variantda birinchi ish qanday?',
      'Что делать первым в смешанном варианте?',
      'What comes first in a mixed variant?',
    ),
    items: [
      { id: 'a', label: L('masala qaysi blokdan ekanini aniqlash', 'определить, из какого блока задача', 'identify the block of the problem'), correct: true },
      { id: 'b', label: L('birinchi masaladan boshlash', 'начать с первой задачи', 'start with the first problem'), hint: L("Tartib majburiy emas: tanish blok bilan boshlash vaqtni tejaydi.", 'Порядок не обязателен: начать со знакомого блока экономит время.', 'The order is not fixed: starting with a familiar block saves time.') },
      { id: 'c', label: L('formulalarni eslash', 'вспомнить формулы', 'recall the formulas'), hint: L("Formulalar ko'p: qaysi biri kerakligini blok aytadi.", 'Формул много: какая нужна, говорит блок.', 'There are many formulas: the block says which one is needed.') },
      { id: 'd', label: L('javoblarni o\'qish', 'прочитать ответы', 'read the answers'), hint: L("Javoblar foydali, lekin ular blokni aytmaydi.", 'Ответы полезны, но блок они не называют.', 'The options help, but they do not name the block.') },
    ],
  },
  sheetTitle: L('Tayyorlov varianti · shpargalka', 'Тренировочный вариант · шпаргалка', 'Training variant · cheat sheet'),
  sheetSrc: L('11-sinf · 54-dars', '11 класс · урок 54', 'Grade 11 · lesson 54'),
  lifehack: L(
    "Har masalada avval blokni aniqla: shundan keyin formula o'zi keladi.",
    'В каждой задаче сначала определи блок: тогда формула придёт сама.',
    'In each problem identify the block first: then the formula comes by itself.',
  ),
  holds: [3200, 5000, 6500],
  audio: [
    A('mount', "Variant tugadi. Natijaga qaraymiz.", 'Вариант закончен. Смотрим результат.', 'The variant is done. Let us look at the result.'),
    A('p1', "Mana taxminingiz va mana javob. Fazoviy diagonal olti ildiz uch, yoq diagonali esa olti ildiz ikki.", 'Вот твоя догадка и вот ответ. Пространственная диагональ шесть корень три, а диагональ грани шесть корень два.', 'Here is your guess and here is the answer. The space diagonal is six root three, the face diagonal six root two.'),
    A('rule', "O'ng tomonda kamchiliklar xaritasi. Uchta odat esa aralash variantda eng foydali. Birinchisi: javobni teskari amal bilan tekshirish, masalan boshlang'ich funksiyani differensiallash. Ikkinchisi: kamida bitta degan gapni ko'rsangiz, teskari hodisani hisoblash. Uchinchisi: bitta misol qoida yasamaydi, va shar hajmi bilan sirti aynan shu tuzoqda uchradi. Keyingi darsda algebra va geometriya bir masalada uchrashadi.", 'Справа карта пробелов. А три привычки в смешанном варианте самые полезные. Первая: проверять ответ обратным действием, например дифференцировать первообразную. Вторая: увидел хотя бы один, считай обратное событие. Третья: один пример правила не делает, и объём шара с его поверхностью попались именно в эту ловушку. На следующем уроке алгебра и геометрия встретятся в одной задаче.', 'On the right is your gap map. And three habits help most in a mixed variant. First: check the answer with the reverse action, for instance differentiate the antiderivative. Second: when you see at least one, count the complement. Third: one example makes no rule, and the ball volume with its surface fell into exactly that trap. In the next lesson algebra and geometry meet in one problem.'),
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
