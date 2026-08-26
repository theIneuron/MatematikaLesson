// ============================================================================
// 11-sinf, Dars 37. VEKTORLARNING SKALYAR KO'PAYTMASI.
//
// B5 blokining uchinchi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpaceFrame`, `dot` rejimi
//   darslik:  1-qism, 126-128-betlar, 66-82 masalalar
//
// DARSNING BITTA GAPI: bitta SON ikki savolga javob beradi -- burchak
// o'tkirmi yoki o'tmasmi, va u aynan nechchi gradus.
//
// ASBOB SHU DARSDA ISHLAYDI TO'LIQ. 4-ekranda ikkinchi strelka buriladi va
// son 12, 8, 0, minus 8 bo'lib boradi: nol ROPPA ROSA to'qson gradusda
// chiqadi. Bu qoida emas, ekranda ko'rinadigan fakt (PODXOD_11SINF.md §7).
//
// SONLAR TEKSHIRILDI (a = (0; 4; 0) qo'zg'almaydi):
//   b (0; 3; 1) -> 12,  burchak 18 gradus
//   b (0; 2; 2) -> 8,   burchak 45
//   b (0; 0; 3) -> 0,   burchak 90
//   b (0; -2; 2) -> -8, burchak 135
//   zanjir: (1;2;2)·(2;1;2) = 8, uzunliklari 3 va 3, kosinus 8/9
//   mustaqil (72-masala): A(1;0;1), B(-1;1;2), C(0;2;-1), D = (0;0;1)
//     AB = (-2;1;1), CD = (0;-2;2), skalyar ko'paytma nol
//   blits: (1;-1;1)·(0;2;-4) = -6;  n = 1/3;  ish 30√3;  a·a = 14
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_37',
  title: L('Skalyar ko\'paytma', 'Скалярное произведение', 'The dot product'),
}

const BLOCK = { label: 'B5', from: 35, to: 41, current: 37 }

// ============================================================
// SLAYD 1. XUK. Bitta juftlik, ikki xil burchak.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Skalyar ko\'paytma', 'Скалярное произведение', 'The dot product'),
  title: L('Burchak o\'tkirmi yoki o\'tmas', 'Угол острый или тупой', 'Is the angle acute or obtuse'),
  expr: L('bitta juft vektor', 'одна пара векторов', 'one pair of vectors'),
  rows: [
    {
      id: 'a',
      name: L('Aziz', 'Азиз', 'Aziz'),
      value: '45°',
    },
    {
      id: 'b',
      name: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      value: '135°',
    },
  ],
  probe: {
    question: L(
      'Nima burchakni hal qiladi?',
      'Что решает, какой угол?',
      'What decides which angle it is?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi sanaymiz.',
      'Твой ответ записан. Сейчас посчитаем.',
      'Your answer is saved. Now we will compute.',
    ),
    items: [
      { id: 'a', label: L('uzunliklar', 'длины', 'the lengths') },
      { id: 'b', label: L('sonning ishorasi', 'знак числа', 'the sign of the number') },
      { id: 'c', label: L('chizmadagi joy', 'место на чертеже', 'the place on the drawing') },
      { id: 'd', label: L('koordinatalar ishorasi', 'знаки координат', 'the signs of the coordinates') },
    ],
  },
  holds: [4000, 4000, 5000],
  audio: [
    A('mount', "O'tgan darsda vektorlarni qo'shdik va songa ko'paytirdik. Bugun ikki vektor orasidagi burchak keladi.", 'На прошлом уроке мы складывали векторы и умножали на число. Сегодня придёт угол между двумя векторами.', 'Last lesson we added vectors and scaled them. Today the angle between two vectors arrives.'),
    A('r1', "Bitta juft vektor berilgan. Aziz burchak qirq besh gradus deydi.", 'Дана одна пара векторов. Азиз говорит, что угол сорок пять градусов.', 'One pair of vectors is given. Aziz says the angle is forty five degrees.'),
    A('r2', "Dilnoza esa bir yuz o'ttiz besh deydi. Ikkalasi bir xil sonlar bilan ishladi.", 'А Дилноза говорит сто тридцать пять. Оба работали с одними и теми же числами.', 'Dilnoza says a hundred thirty five. Both worked with the same numbers.'),
    A('ask', "Sizningcha nima burchakni hal qiladi. Hozircha shunchaki taxmin qiling.", 'Как думаешь, что решает, какой угол. Пока просто предположи.', 'What do you think decides the angle. Just make a guess for now.'),
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
    "Ikkitasi o'tgan darslardan, biri trigonometriyadan. Bu baholanmaydi.",
    'Две с прошлых уроков, одна из тригонометрии. Это не оценивается.',
    'Two from the previous lessons, one from trigonometry. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Vektor uzunligi', 'Длина вектора', 'A vector length'),
      short: L('36-darsdan', 'из урока 36', 'from lesson 36'),
      ex: [{ e: '|(1; 2; 2)| = 3', why: L('kvadratlar yig\'indisidan ildiz', 'корень из суммы квадратов', 'the root of the sum of squares') }],
    },
    {
      id: 'c2',
      title: L('Kosinus ishorasi', 'Знак косинуса', 'The cosine sign'),
      short: L('trigonometriyadan', 'из тригонометрии', 'from trigonometry'),
      ex: [{ e: 'cos 120° = −1/2', why: L("o'tmas burchakda manfiy", 'у тупого угла отрицательный', 'negative for an obtuse angle') }],
    },
    {
      id: 'c3',
      title: L('To\'g\'ri burchak', 'Прямой угол', 'A right angle'),
      short: L('kosinusi nol', 'косинус нуль', 'cosine is zero'),
      ex: [{ e: 'cos 90° = 0', why: L('shu yerda ishora almashadi', 'здесь знак меняется', 'here the sign flips') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true, cols: 4,
      prompt: '|(1; 2; 2)|',
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '5', hint: L("Bu koordinatalar yig'indisi. Ildiz ostida to'qqiz turadi.", 'Это сумма координат. Под корнем девять.', 'That is the sum of the coordinates. Under the root there is nine.') },
        { id: 'c', label: '9', hint: L("Bu ildiz ostidagi son.", 'Это число под корнем.', 'That is the number under the root.') },
        { id: 'd', label: '4', hint: L("Bir plyus to'rt plyus to'rt to'qqiz beradi.", 'Один плюс четыре плюс четыре даёт девять.', 'One plus four plus four gives nine.') },
      ],
    },
    {
      id: 't2', ask: true, cols: 4,
      prompt: 'cos 120°',
      items: [
        { id: 'a', label: '−1/2', correct: true },
        { id: 'b', label: '1/2', hint: L("O'tmas burchakda kosinus MANFIY.", 'У тупого угла косинус ОТРИЦАТЕЛЬНЫЙ.', 'For an obtuse angle the cosine is NEGATIVE.') },
        { id: 'c', label: '0', hint: L("Nol faqat to'qson gradusda.", 'Нуль только при девяноста градусах.', 'Zero only at ninety degrees.') },
        { id: 'd', label: '−1', hint: L("Minus bir bir yuz sakson gradusda.", 'Минус один при ста восьмидесяти градусах.', 'Minus one at a hundred eighty degrees.') },
      ],
    },
    {
      id: 't3', ask: true, cols: 2,
      prompt: L('Kosinus qachon nol bo\'ladi?', 'Когда косинус равен нулю?', 'When is the cosine zero?'),
      items: [
        { id: 'a', label: '90°', correct: true },
        { id: 'b', label: '0°', hint: L("Nol gradusda kosinus bir.", 'При нуле градусов косинус единица.', 'At zero degrees the cosine is one.') },
      ],
    },
  ],
  holds: [3000, 4500, 4500, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch o'tgan darsdan: uzunlik kvadratlar yig'indisidan ildiz.", 'Первая опора с прошлого урока: длина это корень из суммы квадратов.', 'The first basic from last lesson: a length is the root of the sum of squares.'),
    A('c2', "Ikkinchi tayanch trigonometriyadan: o'tkir burchakda kosinus musbat, o'tmasda esa manfiy.", 'Вторая опора из тригонометрии: у острого угла косинус положителен, у тупого отрицателен.', 'The second basic from trigonometry: an acute angle has a positive cosine, an obtuse one negative.'),
    A('c3', "Uchinchi tayanch: to'qson gradusda kosinus nolga aylanadi, va aynan shu yerda ishora almashadi.", 'Третья опора: при девяноста градусах косинус обращается в нуль, и именно здесь знак меняется.', 'The third basic: at ninety degrees the cosine turns to zero, and that is where the sign flips.'),
    A('recap', 'Uchtasi birga bugungi javobni beradi.', 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', 'Endi uchta qisqa topshiriq.', 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. MEZONNI O'ZI TOPADI: nima o'tmas burchakni aytadi.
//
// Ikki da'vogar: «koordinatalarda minus bo'lsa o'tmas» va «SON manfiy
// bo'lsa o'tmas». Ikkinchi va uchinchi qator birinchisini yiqitadi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'dot_sign',
  eyebrow: L('Sonni sanaymiz', 'Считаем число', 'Computing the number'),
  title: L('Qaysi juft o\'tmas burchak beradi', 'Какая пара даёт тупой угол', 'Which pair gives an obtuse angle'),
  expr: 'a₁b₁ + a₂b₂ + a₃b₃',
  goal: L("o'tmas burchakni topish", 'найти тупой угол', 'find the obtuse angle'),
  rule: L(
    "O'tmas burchak beradigan juftlarni izlaymiz. Har bir juftda sonni sanaymiz.",
    'Ищем пары, которые дают тупой угол. В каждой паре считаем число.',
    'We look for pairs giving an obtuse angle. In each pair we compute the number.',
  ),
  pick: L('Qaysi juftni tekshiramiz?', 'Какую пару проверим?', 'Which pair shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('koordinatada minus bor', 'в координатах есть минус', 'a minus among the coordinates'), value: '−' },
    { id: 'b', key: 'inB', name: L('son manfiy', 'число отрицательное', 'the number is negative'), value: '< 0' },
  ],
  points: [
    {
      id: 'q1', label: '(1; −1; 1)', num: '−6', step: 'calc', verdict: 'in',
      calc: L("son −6, burchak o'tmas", 'число −6, угол тупой', 'the number −6, obtuse'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: '(2; 3; −1)', num: '3', step: 'calc', verdict: 'out',
      calc: L("son 3, burchak o'tkir", 'число 3, угол острый', 'the number 3, acute'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: '(1; 2; 0)', num: '0', step: 'calc', verdict: 'out',
      calc: L("son 0, burchak to'g'ri", 'число 0, угол прямой', 'the number 0, right'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      "O'tmas burchakni nima aytadi?",
      'Что говорит о тупом угле?',
      'What tells that the angle is obtuse?',
    ),
    items: [
      { id: 'b', label: L('sonning ishorasi', 'знак числа', 'the sign of the number'), correct: true },
      { id: 'a', label: L('koordinatalardagi minus', 'минус в координатах', 'a minus in the coordinates'), hint: L("Ikkinchi juftda ham minus bor, lekin son musbat va burchak o'tkir.", 'Во второй паре минус есть, а число положительное и угол острый.', 'The second pair has a minus, yet the number is positive and the angle acute.') },
      { id: 'c', label: L('uzunliklar', 'длины', 'the lengths'), hint: L("Uzunlik doim musbat, ya'ni u burchak turini ayta olmaydi.", 'Длина всегда положительна, значит она не может сказать про вид угла.', 'A length is always positive, so it cannot tell the kind of angle.') },
      { id: 'd', label: L('vektorlar soni', 'число векторов', 'the count of vectors'), hint: L("Vektorlar doim ikkita, va bu hech narsani hal qilmaydi.", 'Векторов всегда два, и это ничего не решает.', 'There are always two vectors, and that decides nothing.') },
    ],
  },
  holds: [3000, 4000, 2500, 2600, 9000],
  audio: [
    A('mount', 'Taxmin bor. Endi mezonni topamiz.', 'Прогноз есть. Теперь найдём признак.', 'The guess is made. Now let us find the criterion.'),
    A('mount', "Har bir juftda mos koordinatalarni ko'paytirib qo'shamiz. Bu son skalyar ko'paytma deb ataladi.", 'В каждой паре перемножаем соответствующие координаты и складываем. Это число называют скалярным произведением.', 'In each pair we multiply matching coordinates and add. This number is called the dot product.'),
    A('mount', "To'rtta juftni birma bir sanaymiz.", 'Посчитаем четыре пары по одной.', 'Let us compute four pairs one by one.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana natija. Birinchi juftda son minus olti, va burchak o'tmas. Ikkinchi va uchinchi juftlarda ham koordinatalarda minus bor, lekin sonlar uch va nol, ya'ni burchaklar o'tmas emas. Demak birinchi da'vo yiqildi: koordinatadagi minus hech narsani aytmaydi, sonning ishorasi aytadi.", 'Вот результат. В первой паре число минус шесть, и угол тупой. Во второй и третьей парах минус в координатах есть, а числа три и нуль, то есть углы не тупые. Значит первое утверждение упало: минус в координате ничего не говорит, говорит знак числа.', 'Here is the result. In the first pair the number is minus six and the angle is obtuse. In the second and third pairs there is a minus among the coordinates, yet the numbers are three and zero, so the angles are not obtuse. The first claim fell: a minus in a coordinate tells nothing, the sign of the number tells.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: STRELKA BURILADI, SON NOLGA AYLANADI.
// `steps` -- har bir kadr uchun o'z ma'lumoti.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'perp_zero',
  drag: false,
  graphSteps: 3,
  eyebrow: L('Chizma', 'Чертёж', 'The drawing'),
  title: L('Son to\'qsonda nolga aylanadi', 'Число обращается в нуль на девяноста', 'The number turns zero at ninety'),
  chip: 'a (0; 4; 0)',
  space: {
    mode: 'dot',
    box: [[0, 2], [-3, 5], [0, 4]],
    value: 'dot',
    height: 200,
    vectors: [
      { from: [0, 0, 0], to: [0, 4, 0], label: 'a' },
      { from: [0, 0, 0], to: [0, 3, 1], label: 'b', tone: 'accent' },
    ],
    steps: [
      {
        vectors: [
          { from: [0, 0, 0], to: [0, 4, 0], label: 'a' },
          { from: [0, 0, 0], to: [0, 3, 1], label: 'b', tone: 'accent' },
        ],
      },
      {
        vectors: [
          { from: [0, 0, 0], to: [0, 4, 0], label: 'a' },
          { from: [0, 0, 0], to: [0, 2, 2], label: 'b', tone: 'accent' },
        ],
      },
      {
        vectors: [
          { from: [0, 0, 0], to: [0, 4, 0], label: 'a' },
          { from: [0, 0, 0], to: [0, 0, 3], label: 'b', tone: 'accent' },
        ],
      },
      {
        vectors: [
          { from: [0, 0, 0], to: [0, 4, 0], label: 'a' },
          { from: [0, 0, 0], to: [0, -2, 2], label: 'b', tone: 'accent' },
        ],
      },
    ],
    caption: L('b buriladi, a joyida qoladi', 'b поворачивается, a стоит на месте', 'b turns, a stays'),
  },
  bonus: L(
    "Nol ROPPA ROSA to'qson gradusda chiqadi. Shuning uchun perpendikularlikni tekshirish uchun burchakni o'lchash kerak emas: sonni sanash yetadi.",
    'Нуль выходит РОВНО на девяноста градусах. Поэтому для проверки перпендикулярности угол мерить не нужно: достаточно посчитать число.',
    'Zero comes out EXACTLY at ninety degrees. So checking perpendicularity needs no angle measurement: computing the number is enough.',
  ),
  probe: {
    question: L(
      'Son manfiy bo\'lsa, burchak qanday?',
      'Если число отрицательное, какой угол?',
      'If the number is negative, what is the angle?',
    ),
    items: [
      { id: 'a', label: L("o'tmas", 'тупой', 'obtuse'), correct: true },
      { id: 'b', label: L("o'tkir", 'острый', 'acute'), hint: L("O'tkir burchakda son musbat edi: o'n ikki va sakkiz.", 'У острого угла число было положительным: двенадцать и восемь.', 'For an acute angle the number was positive: twelve and eight.') },
      { id: 'c', label: L("to'g'ri", 'прямой', 'right'), hint: L("To'g'ri burchakda son roppa rosa nol.", 'У прямого угла число ровно нуль.', 'For a right angle the number is exactly zero.') },
      { id: 'd', label: L("aniqlanmaydi", 'не определить', 'cannot tell'), hint: L("Aniqlanadi: ishora burchak turini to'liq aytadi.", 'Определяется: знак полностью говорит про вид угла.', 'It can: the sign fully tells the kind of angle.') },
    ],
  },
  holds: [3500, 4500, 5000],
  audio: [
    A('mount', "Mezon topildi. Endi chizmaga qaraymiz. a vektor joyida qoladi, b esa buriladi.", 'Признак найден. Теперь посмотрим на чертёж. Вектор a стоит на месте, а b поворачивается.', 'The criterion is found. Now let us look at the drawing. The vector a stays, b turns.'),
    A('one', "Burchak o'sdi, va son sakkizga tushdi. Bu qirq besh gradus.", 'Угол вырос, и число упало до восьми. Это сорок пять градусов.', 'The angle grew and the number fell to eight. That is forty five degrees.'),
    A('two', "Yana burildi, va son nolga aylandi. Bu roppa rosa to'qson gradus, ya'ni perpendikular.", 'Ещё повернулся, и число обратилось в нуль. Это ровно девяносто градусов, то есть перпендикулярность.', 'It turned further and the number became zero. That is exactly ninety degrees, that is perpendicularity.'),
    A('three', "Va yana burildi: son minus sakkiz bo'ldi, burchak esa bir yuz o'ttiz besh. Ishora almashdi, chunki to'qsondan o'tdik.", 'И ещё повернулся: число стало минус восемь, а угол сто тридцать пять. Знак сменился, потому что мы прошли девяносто.', 'And it turned again: the number became minus eight, the angle a hundred thirty five. The sign flipped because we passed ninety.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1. Ikki ko'rinish, bitta son.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'dot_sign',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Bitta son, ikki ko\'rinish', 'Одно число, два вида', 'One number, two forms'),
  rows: [
    'a · b = |a| · |b| · cos φ',
    'a · b = a₁b₁ + a₂b₂ + a₃b₃',
  ],
  probe: {
    question: L(
      'Sonning ishorasi nimani aytadi?',
      'О чём говорит знак числа?',
      'What does the sign of the number tell?',
    ),
    items: [
      { id: 'a', label: L('burchak turini', 'о виде угла', 'the kind of angle'), correct: true },
      { id: 'b', label: L('uzunliklar haqida', 'о длинах', 'about the lengths'), hint: L("Uzunliklar doim musbat, ular ishorani bermaydi.", 'Длины всегда положительны, знак не от них.', 'Lengths are always positive, the sign is not theirs.') },
      { id: 'c', label: L('vektorlarning joyi haqida', 'о месте векторов', 'about the place of the vectors'), hint: L("Vektor erkin: joyi sonni o'zgartirmaydi.", 'Вектор свободный: место не меняет числа.', 'A vector is free: its place does not change the number.') },
      { id: 'd', label: L('hech narsani', 'ни о чём', 'nothing'), hint: L("Aytadi: minus o'tmas, nol to'g'ri, plyus o'tkir burchak.", 'Говорит: минус тупой, нуль прямой, плюс острый угол.', 'It does: minus obtuse, zero right, plus acute.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Skalyar ko\'paytma', 'Правило 1. Скалярное произведение', 'Rule 1. The dot product'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'a · b = a₁b₁ + a₂b₂ + a₃b₃',
    lines: [
      L('natija SON, vektor emas', 'результат ЧИСЛО, а не вектор', 'the result is a NUMBER, not a vector'),
      L("ikkinchi ko'rinishi uzunliklar va kosinus orqali", 'вторая форма через длины и косинус', 'the second form uses the lengths and the cosine'),
      L('ishora burchak turini beradi', 'знак даёт вид угла', 'the sign gives the kind of angle'),
      L("nol -- roppa rosa to'qson gradus", 'нуль это ровно девяносто градусов', 'zero means exactly ninety degrees'),
    ],
    example: L('misol:  (1; 2; 2) · (2; 1; 2) = 8', 'пример:  (1; 2; 2) · (2; 1; 2) = 8', 'example:  (1; 2; 2) · (2; 1; 2) = 8'),
  },
  holds: [4000, 7500, 4500],
  audio: [
    A('mount', 'Chizma ko\'rildi. Endi qoidani yozamiz.', 'Чертёж увидели. Теперь запишем правило.', 'We saw the drawing. Now let us write the rule.'),
    A('def', "Skalyar ko'paytmaning ikkita ko'rinishi bor. Birinchisi uzunliklar va burchak kosinusi orqali, ikkinchisi esa koordinatalar orqali. Ular bitta va o'sha sonni beradi, va bu son vektor emas. Uzunliklar doim musbat bo'lgani uchun ishorani faqat kosinus beradi, ya'ni burchak.", 'У скалярного произведения два вида. Первый через длины и косинус угла, второй через координаты. Они дают одно и то же число, и это число не вектор. Длины всегда положительны, поэтому знак даёт только косинус, то есть угол.', 'The dot product has two forms. The first uses lengths and the cosine of the angle, the second uses coordinates. They give one and the same number, and that number is not a vector. Lengths are always positive, so the sign comes only from the cosine, that is from the angle.'),
    A('rule', "To'g'ri. Va shu sababli son perpendikularlikni tekshiradi: nol bo'lsa burchak to'qson.", 'Верно. И поэтому число проверяет перпендикулярность: если нуль, то угол девяносто.', 'Correct. And that is why the number checks perpendicularity: zero means ninety degrees.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: burchakning o'zi kerak.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'dot_sign',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Endi burchakning o\'zi kerak', 'Теперь нужен сам угол', 'Now the angle itself is needed'),
  was: { label: UI.was, expr: L('ishora:  o\'tkir yoki o\'tmas', 'знак: острый или тупой', 'the sign: acute or obtuse') },
  now: { label: UI.now, expr: 'cos φ = (a · b) / (|a| · |b|)' },
  probe1: {
    cols: 2,
    question: L('Kosinusni topish uchun nima kerak?', 'Что нужно, чтобы найти косинус?', 'What is needed to find the cosine?'),
    items: [
      { id: 'a', label: L('son va ikkita uzunlik', 'число и две длины', 'the number and two lengths'), correct: true },
      { id: 'b', label: L('faqat son', 'только число', 'only the number'), hint: L("Faqat son yetmaydi: u uzunliklarga ham bog'liq.", 'Одного числа мало: оно зависит и от длин.', 'The number alone is not enough: it also depends on the lengths.') },
    ],
  },
  probe2: {
    // Ikki ustun: inglizcha variant to'rt ustunda kesilardi.
    cols: 2,
    question: L(
      'Nol dan bir yuz saksongacha kosinus 1/2 bo\'lgan nechta burchak bor?',
      'Сколько углов от нуля до ста восьмидесяти имеют косинус 1/2?',
      'How many angles from zero to a hundred eighty have cosine 1/2?',
    ),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L('bitta', 'один', 'one') },
      { id: 'b', label: L('ikkita', 'два', 'two') },
      { id: 'c', label: L('uchta', 'три', 'three') },
      { id: 'd', label: L('cheksiz ko\'p', 'бесконечно много', 'infinitely many') },
    ],
  },
  holds: [4000, 5500, 3000],
  audio: [
    A('mount', "Ishorani bilamiz. Lekin imtihonda burchakning o'zi so'raladi.", 'Знак мы знаем. Но на экзамене спрашивают сам угол.', 'We know the sign. But the exam asks for the angle itself.'),
    A('now', "Buning uchun sonni ikki uzunlikning ko'paytmasiga bo'lamiz, va kosinus chiqadi. Bu formula darslikning ikkinchi natijasi.", 'Для этого делим число на произведение двух длин, и выходит косинус. Это второе следствие в учебнике.', 'For that we divide the number by the product of the two lengths, and the cosine appears. That is the second corollary in the book.'),
    A('q1', 'Kosinusni topish uchun nima kerak?', 'Что нужно, чтобы найти косинус?', 'What is needed to find the cosine?'),
    A('q2', "Endi taxmin qiling: kosinus yarim bo'lgan nechta burchak bor.", 'Теперь предположи: сколько углов имеют косинус одна вторая.', 'Now make a guess: how many angles have cosine one half.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: modul olindi yoki ishora saqlandi.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'dot_sign',
  eyebrow: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  title: L('Ishora saqlanadimi', 'Сохраняется ли знак', 'Is the sign kept'),
  expr: 'a (0; 4; 0),  b (0; −2; 2)',
  need: L('kosinus manfiy', 'косинус отрицательный', 'the cosine is negative'),
  answerLabel: L('burchak', 'угол', 'the angle'),
  cards: [
    {
      tag: L('modul olindi', 'взяли модуль', 'the absolute value taken'),
      txt: 'cos φ = 8 / 8√2',
      point: {
        label: L('burchak', 'угол', 'the angle'),
        calc: '45°',
        verdict: 'out',
      },
    },
    {
      tag: L('ishora saqlandi', 'знак сохранён', 'the sign kept'),
      txt: 'cos φ = −8 / 8√2',
      point: {
        label: L('burchak', 'угол', 'the angle'),
        calc: '135°',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['135°', '45°', '90°', '225°'],
    value: ['135°'],
    label: 'φ =',
    prompt: L('Burchakni yozing', 'Запиши угол', 'Write the angle'),
    wrongs: [
      { key: '45°', hint: L("Bu modul olingan holat. Son manfiy, demak burchak o'tmas.", 'Это если взять модуль. Число отрицательное, значит угол тупой.', 'That is with the absolute value. The number is negative, so the angle is obtuse.') },
      { key: '90°', hint: L("To'qson gradus faqat son nol bo'lganda. Bu yerda son minus sakkiz.", 'Девяносто только при нуле. Здесь число минус восемь.', 'Ninety only when the number is zero. Here the number is minus eight.') },
      { key: '225°', hint: L("Vektorlar orasidagi burchak nol dan bir yuz saksongacha bo'ladi.", 'Угол между векторами лежит от нуля до ста восьмидесяти.', 'The angle between vectors lies from zero to a hundred eighty.') },
      { key: '*', hint: L("Kosinus minus bir bo'lingan ikki ildizi, ya'ni burchak bir yuz o'ttiz besh.", 'Косинус минус один на корень из двух, то есть угол сто тридцать пять.', 'The cosine is minus one over root two, so the angle is a hundred thirty five.') },
    ],
  },
  holds: [4000, 4500, 6000],
  audio: [
    A('mount', "Taxmin bor. Endi aynan shu juftni sanaymiz.", 'Прогноз есть. Теперь посчитаем именно эту пару.', 'The guess is made. Now let us compute this very pair.'),
    A('p1', "Skalyar ko'paytma minus sakkiz. Uzunliklar to'rt va ikki ildiz ikki, ko'paytmasi sakkiz ildiz ikki. Birinchi nomzod modul olib qirq besh gradus chiqardi.", 'Скалярное произведение минус восемь. Длины четыре и два корня из двух, произведение восемь корней из двух. Первый кандидат берёт модуль и выходит сорок пять градусов.', 'The dot product is minus eight. The lengths are four and two root two, their product eight root two. The first candidate took the absolute value and got forty five degrees.'),
    A('p2', "Ikkinchi nomzod ishorani saqladi va bir yuz o'ttiz besh gradus oldi. Chizmada aynan shu burchak turgan edi. Burchakni yozing.", 'Второй кандидат сохраняет знак, и выходит сто тридцать пять градусов. На чертеже стоял именно этот угол. Запиши угол.', 'The second candidate kept the sign and got a hundred thirty five degrees. That is the angle we saw on the drawing. Write the angle.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2. Perpendikularlik sharti, keyin bitta qoida.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'perp_zero',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Perpendikularlik sharti', 'Условие перпендикулярности', 'The perpendicularity test'),
  cases: [
    {
      label: L('ishora', 'знак', 'the sign'),
      text: L('burchak turini beradi', 'даёт вид угла', 'gives the kind of angle'),
      tone: 'graph',
    },
    {
      label: L('nol', 'нуль', 'zero'),
      text: L('perpendikularlik', 'перпендикулярность', 'perpendicularity'),
      tone: 'accent',
    },
  ],
  rows: [
    'a₁b₁ + a₂b₂ + a₃b₃ = 0',
    '(1; 2; 0) · (2; −1; 0) = 0',
  ],
  probe: {
    question: L(
      'a · a nimaga teng?',
      'Чему равно a · a?',
      'What does a · a equal?',
    ),
    items: [
      { id: 'a', label: '|a|²', correct: true },
      { id: 'b', label: '|a|', hint: L("Kosinus nol gradusda bir, demak uzunlik ikki marta ko'paytiriladi.", 'Косинус при нуле единица, значит длина умножается сама на себя.', 'At zero the cosine is one, so the length multiplies by itself.') },
      { id: 'c', label: '0', hint: L("Nol perpendikular vektorlarda. Vektor o'ziga perpendikular emas.", 'Нуль у перпендикулярных векторов. Вектор себе не перпендикулярен.', 'Zero belongs to perpendicular vectors. A vector is not perpendicular to itself.') },
      { id: 'd', label: '2|a|', hint: L("Ikkiga ko'paytirish emas, o'ziga ko'paytirish.", 'Не умножение на два, а умножение само на себя.', 'Not doubling, but multiplying by itself.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Nol', 'Правило 2. Нуль', 'Rule 2. Zero'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'a · b = 0  ⟺  a ⊥ b',
    lines: [
      L("shart ikki tomonga ishlaydi: noldan perpendikularlik, perpendikularlikdan nol", 'условие работает в обе стороны: из нуля перпендикулярность и наоборот', 'the test works both ways: zero gives perpendicularity and back'),
      L('burchak o\'lchash kerak emas', 'угол мерить не нужно', 'no angle measurement is needed'),
      L('a · a = |a|², chunki kosinus nol gradusda bir', 'a · a = |a|², потому что косинус нуля единица', 'a · a = |a|², because the cosine of zero is one'),
      L("noma'lum koordinata shu shartdan topiladi", 'неизвестная координата находится из этого условия', 'an unknown coordinate comes from this test'),
    ],
    example: L('misol:  (1; 2; 0) · (2; −1; 0) = 0', 'пример:  (1; 2; 0) · (2; −1; 0) = 0', 'example:  (1; 2; 0) · (2; −1; 0) = 0'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('bitta son ikki savolga javob beradi', 'одно число отвечает на два вопроса', 'one number answers two questions'),
    lines: [
      L('1. sonni koordinatalar bo\'yicha sanang', '1. посчитай число по координатам', '1. compute the number from the coordinates'),
      L('2. ishora burchak turini aytadi', '2. знак говорит вид угла', '2. the sign tells the kind of angle'),
      L('3. nol perpendikularlikni aytadi', '3. нуль говорит о перпендикулярности', '3. zero tells perpendicularity'),
      L('4. burchakning o\'zi uzunliklarga bo\'lgandan keyin chiqadi', '4. сам угол выходит после деления на длины', '4. the angle itself comes after dividing by the lengths'),
    ],
  },
  holds: [4000, 7500, 2600],
  audio: [
    A('mount', "Burchak yozildi. Endi ikkinchi qoida.", 'Угол записали. Теперь второе правило.', 'The angle is written. Now the second rule.'),
    A('rows', "Agar son nolga teng bo'lsa, kosinus ham nol, ya'ni burchak to'qson gradus. Va teskarisi ham to'g'ri. Misol: bir, ikki, nol va ikki, minus bir, nol vektorlarining ko'paytmasi ikki minus ikki plyus nol, ya'ni nol. Demak ular perpendikular, va buni tekshirish uchun chizma kerak emas.", 'Если число равно нулю, то и косинус нуль, то есть угол девяносто градусов. И обратно тоже верно. Пример: у векторов один, два, нуль и два, минус один, нуль произведение два минус два плюс нуль, то есть нуль. Значит они перпендикулярны, и чертёж для этого не нужен.', 'If the number is zero, the cosine is zero as well, that is the angle is ninety degrees. And the converse holds too. An example: the vectors one, two, zero and two, minus one, zero give two minus two plus zero, that is zero. So they are perpendicular, and no drawing is needed for that.'),
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
  tag: 'dot_sign',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Sonning ishorasi', 'Знак числа', 'The sign of the number'),
  left: L('burchak O\'TMAS, uzunliklari 3 va 4', 'угол ТУПОЙ, длины 3 и 4', 'the angle is OBTUSE, lengths 3 and 4'),
  template: ['a · b = ', { slot: 0 }, ' 6'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    "O'tmas burchakda kosinus manfiy, demak son ham manfiy",
    'У тупого угла косинус отрицателен, значит и число отрицательно',
    'An obtuse angle has a negative cosine, so the number is negative too',
  ),
  wrongs: [
    { key: '+', hint: L("Musbat son o'tkir burchakni berardi. Shartda esa o'tmas.", 'Положительное число дало бы острый угол. А в условии тупой.', 'A positive number would give an acute angle. The problem says obtuse.') },
  ],
  probe: {
    question: L("Bu burchakning kosinusi qanday?", 'Каков косинус этого угла?', 'What is the cosine of this angle?'),
    items: [
      { id: 'a', label: '−1/2', correct: true },
      { id: 'b', label: '1/2', hint: L("Ishora tushib qoldi: son manfiy edi.", 'Знак потерян: число было отрицательным.', 'The sign is lost: the number was negative.') },
      { id: 'c', label: '−6', hint: L("Bu son, kosinus emas: uni uzunliklar ko'paytmasiga bo'lish kerak.", 'Это число, а не косинус: его надо поделить на произведение длин.', 'That is the number, not the cosine: divide it by the product of the lengths.') },
      { id: 'd', label: '−2', hint: L("Kosinus minus bir bilan bir orasida bo'ladi.", 'Косинус лежит между минус единицей и единицей.', 'A cosine lies between minus one and one.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Sonning ishorasini qo'ying.", 'Поставь знак числа.', 'Place the sign of the number.'),
    A('checked', "Bo'ldi. Endi kosinusni ayting.", 'Готово. Теперь назови косинус.', 'Done. Now name the cosine.'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ: kosinusni topish.
// ============================================================
const ACTIONS_10 = [
  { id: 'dot', label: L('skalyar ko\'paytmani sanash', 'посчитать скалярное произведение', 'compute the dot product') },
  { id: 'len', label: L('uzunliklarni topish', 'найти длины', 'find the lengths') },
  { id: 'div', label: L("uzunliklar ko'paytmasiga bo'lish", 'поделить на произведение длин', 'divide by the product of the lengths') },
  { id: 'sum', label: L("koordinatalarni qo'shish", 'сложить координаты', 'add the coordinates') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'dot_sign',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Kosinusni topamiz', 'Находим косинус', 'Finding the cosine'),
  start: 'a (1; 2; 2),  b (2; 1; 2)',
  actions: ACTIONS_10,
  steps: [
    {
      action: 'dot',
      to: '2 + 2 + 4 = 8',
      wrongs: [
        { action: 'len', hint: L("Uzunliklar keyin kerak bo'ladi, avval son.", 'Длины понадобятся потом, сначала число.', 'The lengths come later, first the number.') },
        { action: 'div', hint: L("Bo'lish uchun avval nimani bo'lishni toping.", 'Чтобы делить, сначала найди, что делить.', 'To divide, first find what to divide.') },
        { action: 'sum', hint: L("Koordinatalarni shunchaki qo'shish vektorlarni qo'shishda edi. Bu yerda ular ko'paytiriladi.", 'Просто складывать координаты было при сложении векторов. Здесь они перемножаются.', 'Simply adding coordinates belonged to vector addition. Here they multiply.') },
      ],
    },
    {
      action: 'len',
      to: '|a| = 3,  |b| = 3',
      wrongs: [
        { action: 'dot', hint: L("Son topildi: sakkiz.", 'Число найдено: восемь.', 'The number is found: eight.') },
        { action: 'div', hint: L("Nimaga bo'lishni bilish uchun uzunliklar kerak.", 'Чтобы знать, на что делить, нужны длины.', 'To know what to divide by, the lengths are needed.') },
        { action: 'sum', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
    {
      action: 'div',
      to: '8 / 9',
      wrongs: [
        { action: 'dot', hint: L("Sanalgan: sakkiz.", 'Посчитано: восемь.', 'Computed: eight.') },
        { action: 'len', hint: L("Uzunliklar topilgan: uch va uch.", 'Длины найдены: три и три.', 'The lengths are found: three and three.') },
        { action: 'sum', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['8/9', '8/6', '8/3', '9/8'],
    value: ['8/9'],
    label: 'cos φ =',
    prompt: L('Kosinusni yozing', 'Запиши косинус', 'Write the cosine'),
    wrongs: [
      { key: '8/6', hint: L("Uzunliklar uch va uch, ko'paytmasi to'qqiz.", 'Длины три и три, произведение девять.', 'The lengths are three and three, their product nine.') },
      { key: '8/3', hint: L("Bitta uzunlikka bo'lingan. Ikkalasiga bo'lish kerak.", 'Поделено на одну длину. Нужно на обе.', 'Divided by one length. Both are needed.') },
      { key: '9/8', hint: L("Kosinus birdan katta bo'lmaydi.", 'Косинус не бывает больше единицы.', 'A cosine is never above one.') },
      { key: '*', hint: L("Sakkizni to'qqizga bo'lish kerak.", 'Восемь надо поделить на девять.', 'Eight must be divided by nine.') },
    ],
  },
  audio: [
    A('mount', 'Ishora qo\'yildi. Endi to\'liq masalani o\'tamiz.', 'Знак поставлен. Пройдём полную задачу.', 'The sign is placed. Let us work a full problem.'),
    A('start', "Diqqat: ro'yxatda o'tgan darsning amali ham bor, va u bu yerda ortiqcha.", 'Внимание: в списке есть действие прошлого урока, и здесь оно лишнее.', 'Careful: the list holds an action from last lesson, and it is superfluous here.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL: 72-masala. Oz o'qidagi nuqtani topish.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'perp_zero',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Perpendikular bo\'lsin', 'Пусть будут перпендикулярны', 'Let them be perpendicular'),
  // Shart QISQA: to'rtta nuqta bitta satrda 16 px kesilardi. Sonlar
  // yengillashtirildi, D esa maslahatda tasvirlangan. Javob: t = 3.
  start: 'A(1; 0; 1),  B(3; 1; 2),  C(0; 2; 1)',
  actions: ACTIONS_10,
  hint: L(
    "D nuqta Oz o'qida: (0; 0; t). AB va CD ko'paytmasini nolga tenglashtiring.",
    'Точка D на оси Oz: (0; 0; t). Приравняй произведение AB и CD к нулю.',
    'The point D is on Oz: (0; 0; t). Set the product of AB and CD to zero.',
  ),
  steps: [
    {
      action: 'dot',
      to: 'AB (2; 1; 1),  CD (0; −2; t − 1)',
      wrongs: [
        { action: 'len', hint: L("Uzunlik bu masalada kerak emas: shart nol haqida.", 'Длина в этой задаче не нужна: условие про нуль.', 'A length is not needed here: the condition is about zero.') },
        { action: 'div', hint: L("Bo'lish kerak emas, tenglama kerak.", 'Делить не нужно, нужно уравнение.', 'No division needed, an equation is needed.') },
        { action: 'sum', hint: L("Vektorlarni qo'shish emas: ularning ko'paytmasi kerak.", 'Не сложение векторов: нужно их произведение.', 'Not vector addition: their product is needed.') },
      ],
    },
    {
      action: 'div',
      to: '0 − 2 + t − 1 = 0',
      wrongs: [
        { action: 'dot', hint: L("Vektorlar yozilgan, endi ko'paytmani nolga tenglashtiring.", 'Векторы выписаны, теперь приравняй произведение к нулю.', 'The vectors are written, now set the product to zero.') },
        { action: 'len', hint: L("Uzunlik kerak emas.", 'Длина не нужна.', 'No length needed.') },
        { action: 'sum', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(0; 0; 3)', '(0; 0; −3)', '(0; 0; 1)', '(0; 0; 0)'],
    value: ['(0; 0; 3)'],
    label: 'D =',
    prompt: L('D nuqtani yozing', 'Запиши точку D', 'Write the point D'),
    wrongs: [
      { key: '(0; 0; −3)', hint: L("Ishora almashib ketgan: t minus uch nolga teng, demak t uch.", 'Знак перепутан: t минус три равно нулю, значит t равно трём.', 'The sign got flipped: t minus three is zero, so t is three.') },
      { key: '(0; 0; 1)', hint: L("Ikkinchi koordinatadagi minus ikki hisobga olinmagan.", 'Не учтено минус два во второй координате.', 'The minus two in the second coordinate was not counted.') },
      { key: '(0; 0; 0)', hint: L("Bu koordinata boshi, va u shartni qanoatlantirmaydi: minus uch chiqadi.", 'Это начало координат, и оно не подходит: выйдет минус три.', 'That is the origin, and it does not fit: minus three comes out.') },
      { key: '*', hint: L("Minus ikki plyus t minus bir nolga teng, ya'ni t uch.", 'Минус два плюс t минус один равно нулю, то есть t равно трём.', 'Minus two plus t minus one is zero, so t equals three.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "D nuqta Oz o'qida yotadi, ya'ni uning ikkita koordinatasi nol, uchinchisi noma'lum. AB va CD perpendikular bo'lishi kerak.", 'Точка D лежит на оси Oz, то есть две её координаты нули, а третья неизвестна. AB и CD должны быть перпендикулярны.', 'The point D lies on the Oz axis, so two coordinates are zeros and the third is unknown. AB and CD must be perpendicular.'),
    A('answered', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
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
      id: 'b1', tag: 'dot_sign', ask: true, cols: 4,
      done: '−6',
      prompt: '(1; −1; 1) · (0; 2; −4)',
      items: [
        { id: 'a', label: '−6', correct: true },
        { id: 'b', label: '6', hint: L("Ishora tushib qoldi: minus ikki minus to'rt.", 'Знак потерян: минус два минус четыре.', 'The sign is lost: minus two minus four.') },
        { id: 'c', label: '−2', hint: L("Uchinchi ko'paytma hisobga olinmagan: bir karra minus to'rt.", 'Не учтено третье произведение: один на минус четыре.', 'The third product was missed: one times minus four.') },
        { id: 'd', label: '(0; −2; −4)', hint: L("Natija SON, vektor emas.", 'Результат ЧИСЛО, а не вектор.', 'The result is a NUMBER, not a vector.') },
      ],
    },
    {
      id: 'b2', tag: 'perp_zero', ask: true, cols: 2,
      done: '90°',
      prompt: L('a · b = 0. Burchak?', 'a · b = 0. Угол?', 'a · b = 0. The angle?'),
      items: [
        { id: 'a', label: '90°', correct: true },
        { id: 'b', label: '0°', hint: L("Nol gradusda son eng katta bo'ladi, nol emas.", 'При нуле градусов число наибольшее, а не нуль.', 'At zero degrees the number is largest, not zero.') },
        { id: 'c', label: '180°', hint: L("Bir yuz saksonda son manfiy va eng kichik.", 'При ста восьмидесяти число отрицательное и наименьшее.', 'At a hundred eighty the number is negative and smallest.') },
        { id: 'd', label: L("aniqlanmaydi", 'не определить', 'cannot tell'), hint: L("Aniqlanadi: nol faqat to'qsonda bo'ladi.", 'Определяется: нуль бывает только при девяноста.', 'It can: zero happens only at ninety.') },
      ],
    },
    {
      id: 'b3', tag: 'dot_sign', ask: true, cols: 4,
      done: '120°',
      prompt: L('Birlik vektorlar, a · b = −1/2. Burchak?', 'Единичные векторы, a · b = −1/2. Угол?', 'Unit vectors, a · b = −1/2. The angle?'),
      items: [
        { id: 'a', label: '120°', correct: true },
        { id: 'b', label: '60°', hint: L("Oltmish gradusda kosinus musbat yarim.", 'При шестидесяти косинус положительная одна вторая.', 'At sixty the cosine is positive one half.') },
        { id: 'c', label: '150°', hint: L("Bir yuz ellikda kosinus minus ildiz uch bo'lingan ikki.", 'При ста пятидесяти косинус минус корень из трёх на два.', 'At a hundred fifty the cosine is minus root three over two.') },
        { id: 'd', label: '135°', hint: L("Bir yuz o'ttiz beshda kosinus minus bir bo'lingan ildiz ikki.", 'При ста тридцати пяти косинус минус один на корень из двух.', 'At a hundred thirty five the cosine is minus one over root two.') },
      ],
    },
    {
      id: 'b4', tag: 'perp_zero', ask: true, cols: 4,
      done: 'n = 1/3',
      prompt: 'a (2; −1; 3) ⊥ b (1; 3; n). n?',
      items: [
        { id: 'a', label: '1/3', correct: true },
        { id: 'b', label: '−1/3', hint: L("Ikki minus uch plyus uch n nolga teng, demak uch n birga teng.", 'Два минус три плюс три n равно нулю, значит три n равно одному.', 'Two minus three plus three n is zero, so three n is one.') },
        { id: 'c', label: '1', hint: L("Bunda son uch minus bir, ya'ni ikki chiqadi, nol emas.", 'Тогда число выйдет три минус один, то есть два, а не нуль.', 'Then the number is three minus one, that is two, not zero.') },
        { id: 'd', label: '−1', hint: L("Bunda son minus to'rt chiqadi.", 'Тогда число выйдет минус четыре.', 'Then the number comes out minus four.') },
      ],
    },
    {
      id: 'b5', tag: 'check_by_point', ask: true, cols: 4,
      done: '30√3',
      prompt: L('F = 20 N, 30°, s = 3 m. Ish?', 'F = 20 Н, 30°, s = 3 м. Работа?', 'F = 20 N, 30°, s = 3 m. The work?'),
      items: [
        { id: 'a', label: '30√3', correct: true },
        { id: 'b', label: '60', hint: L("Kosinus hisobga olinmagan: yigirma karra uch karra kosinus o'ttiz gradus.", 'Не учтён косинус: двадцать на три на косинус тридцати.', 'The cosine was missed: twenty times three times the cosine of thirty.') },
        { id: 'c', label: '30', hint: L("Kosinus o'ttiz gradus yarim emas, ildiz uch bo'lingan ikki.", 'Косинус тридцати это не одна вторая, а корень из трёх на два.', 'The cosine of thirty is not a half, it is root three over two.') },
        { id: 'd', label: '20√3', hint: L("Masofa uch metr, va u ham ko'paytmaga kiradi.", 'Расстояние три метра, и оно тоже входит в произведение.', 'The distance is three metres, and it enters the product too.') },
      ],
    },
    {
      id: 'b6', tag: 'check_by_point', ask: true, cols: 4,
      done: '14',
      prompt: 'a (2; 3; −1). a · a?',
      items: [
        { id: 'a', label: '14', correct: true },
        { id: 'b', label: '√14', hint: L("Bu uzunlik. a karra a uzunlik KVADRATiga teng.", 'Это длина. a на a равно КВАДРАТУ длины.', 'That is the length. a times a equals the length SQUARED.') },
        { id: 'c', label: '4', hint: L("Faqat birinchi koordinata olingan.", 'Взята только первая координата.', 'Only the first coordinate was taken.') },
        { id: 'd', label: '0', hint: L("Nol perpendikular vektorlarda, vektor esa o'ziga perpendikular emas.", 'Нуль у перпендикулярных векторов, а вектор себе не перпендикулярен.', 'Zero belongs to perpendicular vectors, and a vector is not perpendicular to itself.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', 'Nol haqida.', 'Про нуль.', 'About zero.'),
    A('q3', 'Birlik vektorlar.', 'Единичные векторы.', 'Unit vectors.'),
    A('q4', "Noma'lum koordinata.", 'Неизвестная координата.', 'An unknown coordinate.'),
    A('q5', 'Fizika.', 'Физика.', 'Physics.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: ishora yo'qolgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'dot_sign',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Uchta satr to\'g\'ri, bittasi yo\'q', 'Три строки верны, одна нет', 'Three lines are right, one is not'),
  rows: [
    { id: 'r1', text: 'a (0; 4; 0),  b (0; −2; 2)' },
    { id: 'r2', text: 'a · b = 0 − 8 + 0 = −8' },
    { id: 'r3', text: '|a| = 4,  |b| = 2√2' },
    { id: 'r4', text: 'cos φ = 8 / 8√2 = 1/√2' },
    { id: 'r5', text: 'φ = 45°' },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Son to'g'ri sanalgan: to'rt karra minus ikki minus sakkiz.", 'Число посчитано верно: четыре на минус два минус восемь.', 'The number is right: four times minus two is minus eight.'),
    r3: L("Uzunliklar to'g'ri: to'rt va ikki ildiz ikki.", 'Длины верны: четыре и два корня из двух.', 'The lengths are right: four and two root two.'),
    r5: L("Oxirgi satr oldingisidan to'g'ri chiqadi. Xato yuqorida.", 'Последняя строка верно следует из предыдущей. Ошибка выше.', 'The last line follows correctly. The error is above.'),
  },
  proofPoint: L('minus yo\'qolgan', 'минус потерян', 'the minus is lost'),
  proof: L(
    "Kosinusda son MINUS sakkiz bo'lishi kerak edi. Demak kosinus minus bir bo'lingan ildiz ikki, va burchak bir yuz o'ttiz besh gradus.",
    'В косинусе число должно было быть МИНУС восемь. Значит косинус минус один на корень из двух, а угол сто тридцать пять градусов.',
    'The cosine should have used MINUS eight. So the cosine is minus one over root two, and the angle is a hundred thirty five degrees.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('ishora yo\'qolgan', 'потерян знак', 'the sign is lost'), correct: true },
      { id: 'b', label: L('uzunlik xato', 'длина неверна', 'the length is wrong'), hint: L("Uzunliklar to'g'ri: to'rt va ikki ildiz ikki.", 'Длины верны: четыре и два корня из двух.', 'The lengths are right: four and two root two.') },
      { id: 'c', label: L("son xato sanalgan", 'число посчитано неверно', 'the number is miscomputed'), hint: L("Ikkinchi satrda son to'g'ri: minus sakkiz. U keyingi satrda o'zgarib qolgan.", 'Во второй строке число верное: минус восемь. Оно изменилось в следующей строке.', 'In the second line the number is right: minus eight. It changed in the next line.') },
      { id: 'd', label: L('kosinus jadvali xato', 'таблица косинусов неверна', 'the cosine table is wrong'), hint: L("Jadval to'g'ri: bir bo'lingan ildiz ikki qirq besh gradusga mos.", 'Таблица верна: один на корень из двух отвечает сорока пяти градусам.', 'The table is right: one over root two answers forty five degrees.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Diqqat: uchta satr haqiqatan to'g'ri. Xato bittasida, va u juda tanish.", 'Внимание: три строки действительно верны. Ошибка в одной, и она очень знакомая.', 'Careful: three lines are truly right. The error is in one, and it is a familiar one.'),
    A('proof', "Qarang: ikkinchi satrda son minus sakkiz, to'rtinchi satrda esa u musbat sakkiz bo'lib qolgan. Minus yo'qolgan, va shu sababli o'tmas burchak o'tkir bo'lib chiqdi. To'g'ri javob bir yuz o'ttiz besh gradus.", 'Смотри: во второй строке число минус восемь, а в четвёртой оно стало плюс восемь. Минус потерян, и поэтому тупой угол превратился в острый. Верный ответ сто тридцать пять градусов.', 'Look: in the second line the number is minus eight, and in the fourth it became plus eight. The minus is lost, and that turned an obtuse angle into an acute one. The right answer is a hundred thirty five degrees.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: perpendikular vektorni yig'ish.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'perp_zero',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('ko\'paytma nol bo\'lsin', 'произведение должно быть нулём', 'the product must be zero'),
  tasks: [
    {
      prompt: 'b ⊥ a (2; −1; 2),  b (1; ?; ?)',
      template: ['b ( 1 ;  ', { slot: 0 }, ' ;  ', { slot: 1 }, ' )'],
      parts: ['2', '0', '−2', '1'],
      answer: ['2', '0'],
      doneLabel: '(1; 2; 0)',
      wrongs: [
        { key: '0|−2', hint: L("Bunda son ikki minus to'rt, ya'ni minus ikki chiqadi, nol emas.", 'Тогда число выйдет два минус четыре, то есть минус два, а не нуль.', 'Then the number is two minus four, that is minus two, not zero.') },
        { key: '*', hint: L("Ikki minus ikkinchi son plyus ikki karra uchinchi son nolga teng bo'lishi kerak.", 'Два минус второе число плюс два на третье число должно равняться нулю.', 'Two minus the second number plus two times the third must equal zero.') },
      ],
    },
    {
      prompt: 'a (2; 3; −1).  a · a',
      template: ['a · a = ', { slot: 0 }],
      parts: ['14', '√14', '4', '0'],
      answer: ['14'],
      doneLabel: 'a · a = 14',
      wrongs: [
        { key: '√14', hint: L("Bu uzunlik. a karra a uzunlik kvadratiga teng.", 'Это длина. a на a равно квадрату длины.', 'That is the length. a times a equals the length squared.') },
        { key: '*', hint: L("To'rt plyus to'qqiz plyus bir.", 'Четыре плюс девять плюс один.', 'Four plus nine plus one.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari: shart bor, vektor kerak.', 'Ошибка найдена. Последнее задание обратное: есть условие, нужен вектор.', 'The error is found. The last task is reverse: a condition is given, a vector is needed.'),
    A('built1', "Endi ikkinchisi. Vektorni o'ziga ko'paytiramiz.", 'Теперь второе. Умножим вектор сам на себя.', 'Now the second. Let us multiply a vector by itself.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'dot_sign',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'a · b = a₁b₁ + a₂b₂ + a₃b₃',
  ruleLines: [
    L('natija son, vektor emas', 'результат число, а не вектор', 'the result is a number, not a vector'),
    L('ishora burchak turini beradi', 'знак даёт вид угла', 'the sign gives the kind of angle'),
    L("nol -- perpendikularlik, chizmasiz", 'нуль это перпендикулярность, без чертежа', 'zero is perpendicularity, with no drawing'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('nima hal qiladi', 'что решает', 'what decides it'),
      right: L('sonning ishorasi', 'знак числа', 'the sign of the number'),
      map: {
        a: L('uzunliklar', 'длины', 'the lengths'),
        b: L('sonning ishorasi', 'знак числа', 'the sign of the number'),
        c: L('joy', 'место', 'the place'),
        d: L('koordinatalar ishorasi', 'знаки координат', 'coordinate signs'),
      },
    },
    {
      screen: 5,
      expr: L('kosinus 1/2 bo\'lgan burchaklar', 'углов с косинусом 1/2', 'angles with cosine 1/2'),
      right: L('bitta', 'один', 'one'),
      map: {
        a: L('bitta', 'один', 'one'),
        b: L('ikkita', 'два', 'two'),
        c: L('uchta', 'три', 'three'),
        d: L('cheksiz', 'бесконечно', 'infinitely'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('45 va 135 → son manfiy → 135', '45 и 135 → число отрицательное → 135', '45 and 135 → the number is negative → 135'),
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Qoida va burilish ekraniga qayting", 'Вернись к правилу и к экрану с поворотом', 'Go back to the rule and the turning screen'),
  },
  probe: {
    question: L(
      "Nega nol perpendikularlikni beradi?",
      'Почему нуль даёт перпендикулярность?',
      'Why does zero give perpendicularity?',
    ),
    items: [
      { id: 'a', label: L("kosinus faqat to'qsonda nol", 'косинус нуль только при девяноста', 'the cosine is zero only at ninety'), correct: true },
      { id: 'b', label: L('uzunliklar nolga aylanadi', 'длины обращаются в нуль', 'the lengths become zero'), hint: L("Uzunliklar noldan katta: nolni faqat kosinus berishi mumkin.", 'Длины больше нуля: нуль может дать только косинус.', 'The lengths exceed zero: only the cosine can give zero.') },
      { id: 'c', label: L('koordinatalar qisqaradi', 'координаты сокращаются', 'the coordinates cancel'), hint: L("Qisqarishi mumkin, lekin sabab kosinusda: u to'qsonda nol.", 'Сократиться могут, но причина в косинусе: он нуль при девяноста.', 'They may cancel, but the reason is the cosine: it is zero at ninety.') },
      { id: 'd', label: L('shunday kelishilgan', 'так договорились', 'it was agreed so'), hint: L("Kelishuv emas: bu ta'rifdan chiqadi.", 'Не договорённость: это следует из определения.', 'Not an agreement: it follows from the definition.') },
    ],
  },
  sheetTitle: L('Skalyar ko\'paytma · shpargalka', 'Скалярное произведение · шпаргалка', 'The dot product · cheat sheet'),
  sheetSrc: L('11-sinf · 37-dars', '11 класс · урок 37', 'Grade 11 · lesson 37'),
  lifehack: L(
    "Avval sonni sanang, keyin ishoraga qarang.",
    'Сначала посчитай число, потом посмотри на знак.',
    'First compute the number, then look at the sign.',
  ),
  holds: [3000, 6000, 7000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Burchakni sonning ishorasi hal qiladi, va kosinus yarim bo'lgan burchak bitta.", 'Вот твои прогнозы и вот как оказалось. Угол решает знак числа, и угол с косинусом одна вторая только один.', 'Here are your guesses and here is how it turned out. The sign of the number decides the angle, and there is only one angle with cosine one half.'),
    A('rule', "Va mana darsning umumiy fikri. Skalyar ko'paytma bitta son, va u ikki savolga javob beradi. Ishorasi burchak turini aytadi: plyus o'tkir, nol to'g'ri, minus o'tmas. Uzunliklarga bo'lgandan keyin esa burchakning o'zi chiqadi. Keyingi darsda shu son tekislik tenglamasini beradi.", 'И вот общая мысль урока. Скалярное произведение это одно число, и оно отвечает на два вопроса. Знак говорит вид угла: плюс острый, нуль прямой, минус тупой. А после деления на длины выходит сам угол. На следующем уроке это число даст уравнение плоскости.', 'And here is the shared thought of the lesson. The dot product is one number, and it answers two questions. Its sign tells the kind of angle: plus acute, zero right, minus obtuse. After dividing by the lengths the angle itself appears. Next lesson this number will give the equation of a plane.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
