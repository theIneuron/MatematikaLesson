// ============================================================================
// 11-sinf, Dars 53. VEKTORLAR VA KOORDINATALAR: SINOV DTM.
//
// B7 blokining uchinchi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md, 1.2-band (DTM anatomiyasi)
//   asbob:    `SpaceFrame` (fazoviy karkas), `AnswerValue`, `Probe`
//   manba:    2-qism, V bob, 177-178-betlar -- kirish imtihonlari
//             topshiriqlari. VARIANTLAR ham darslikdan olingan: chalg'ituvchi
//             javoblar o'zimdan emas, imtihon bankidan.
//   tayanch:  kursning 35-41 darslari (B5 bloki)
//
// DARSNING BITTA GAPI: koordinatalarda javobni TARTIB va ISHORA beradi --
// oxiri minus boshi, kvadratlar yig'indisi, qaysi koordinata ishora almashadi.
//
// SONLAR TEKSHIRILDI (darslik topshirig'i raqami bilan):
//   1:  a(−3; 2; −1) + b(−4; 4; 1) = (−7; 6; 0)
//   3:  M(3; −2; 0), N(−1; 1; 12) -> √(16 + 9 + 144) = 13
//   4:  a(−1; 3; 2) · b(−2; 4; −3) = 2 + 12 − 6 = 8  (musbat, burchak o'tkir)
//   5:  bir uchi A(3; 4; 8), o'rtasi C(5; 6; 12) -> ikkinchi uchi (7; 8; 16)
//   6:  a(−2; −4; 5) − b(−3; 4; −2) = (1; −8; 7)
//   8:  Oxy ga nisbatan (−1; 2; 3) ga simmetrik -> (−1; 2; −3)
//   9:  2a − 3b,  a(0; −5; 2),  b(2; −3; 1) -> (−6; −1; 1)
//   10: Oxz tekisligida yotgan nuqta -- ordinatasi nol: (2; 0; −8)
//   12: A(1; −3; −5), B(5; −1; −3) o'rtasi -> (3; −2; −4)
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_53',
  title: L('Vektorlar va koordinatalar: sinov DTM', 'Векторы и координаты: пробный ДТМ', 'Vectors and coordinates: a mock exam'),
}

const BLOCK = { label: 'B7', from: 51, to: 56, current: 53 }

// DTM REJIMI. Etalon 1.2-bandi.
const MODE = 'dtm'

// ============================================================
// SLAYD 1. XUK. Vektorlar yig'indisi (darslik 1-topshiriq).
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sinov DTM', 'Пробный ДТМ', 'Mock exam'),
  title: L('Ikki vektor yig\'indisi', 'Сумма двух векторов', 'The sum of two vectors'),
  expr: 'a (−3; 2; −1),  b (−4; 4; 1)',
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: '(7; 6; 0)',
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: '(−7; 6; 0)',
    },
  ],
  probe: {
    question: L(
      'Yig\'indi qanday?',
      'Какова сумма?',
      'What is the sum?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi masalalar boshlanadi.',
      'Твой ответ записан. Теперь начинаются задачи.',
      'Your answer is saved. Now the problems begin.',
    ),
    items: [
      { id: 'a', label: '(−7; 6; 0)' },
      { id: 'b', label: '(7; 6; 0)' },
      { id: 'c', label: '(−7; 6; −1)' },
      { id: 'd', label: '(12; 8; −1)' },
    ],
  },
  holds: [4200, 3600, 3600],
  audio: [
    A('mount', "Koordinatalar bo'yicha sinov. Masalalar va hatto chalg'ituvchi javoblar ham darslikning imtihon bankidan.", 'Проверка по координатам. Задачи и даже неверные варианты взяты из экзаменационного банка учебника.', 'A check on coordinates. The problems and even the wrong options come from the exam bank in the textbook.'),
    A('r1', "Karim birinchi koordinatada ishorani tashlab ketdi.", 'Карим в первой координате потерял знак.', 'Karim dropped the sign in the first coordinate.'),
    A('r2', "Nargiza esa minus yettini qoldirdi.", 'А Наргиза оставила минус семь.', 'Nargiza kept minus seven.'),
    A('ask', "Sizningcha qaysi javob to'g'ri. Taxmin qiling.", 'Как думаешь, какой ответ верный. Предположи.', 'Which answer do you think is right. Make a guess.'),
  ],
}

// ============================================================
// SLAYD 2. MASALA 1. Qaysi nuqta Oxz da (darslik 10-topshiriq).
// ============================================================
const S2 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'coord_order',
  eyebrow: L('Masala 1', 'Задача 1', 'Problem 1'),
  title: L('Qaysi nuqta Oxz da yotadi', 'Какая точка лежит в Oxz', 'Which point lies in Oxz'),
  expr: L('mezon: qaysi koordinata nol', 'признак: какая координата ноль', 'the criterion: which coordinate is zero'),
  goal: L('tekislikni tanib olish', 'узнать плоскость', 'recognise the plane'),
  rule: L(
    "Har yozuvda nolning JOYINI qaraymiz.",
    'В каждой записи смотрим МЕСТО нуля.',
    'In each record we look at the PLACE of the zero.',
  ),
  pick: L('Qaysi nuqtani tekshiramiz?', 'Какую точку проверим?', 'Which point shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('nol bo\'lsa yetadi', 'достаточно нуля', 'a zero is enough'), value: '0' },
    { id: 'b', key: 'inB', name: L('ordinata nol bo\'lsin', 'нулём должна быть ордината', 'the ordinate must be zero'), value: 'y = 0' },
  ],
  points: [
    {
      id: 'q1', label: '(−4; 2; 0)', num: L('applikata nol', 'аппликата ноль', 'the applicate is zero'), step: 'calc', verdict: 'out',
      calc: L('bu Oxy tekisligi', 'это плоскость Oxy', 'that is the plane Oxy'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q2', label: '(0; 5; 0)', num: L('ikkita nol', 'два нуля', 'two zeros'), step: 'calc', verdict: 'out',
      calc: L('bu Oy o\'qi', 'это ось Oy', 'that is the Oy axis'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: '(2; 0; −8)', num: L('ordinata nol', 'ордината ноль', 'the ordinate is zero'), step: 'calc', verdict: 'in',
      calc: L('aynan Oxz', 'именно Oxz', 'exactly Oxz'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q4', label: '(0; −2; 1)', num: L('abssissa nol', 'абсцисса ноль', 'the abscissa is zero'), step: 'calc', verdict: 'out',
      calc: L('bu Oyz tekisligi', 'это плоскость Oyz', 'that is the plane Oyz'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      'Oxz tekisligida qaysi koordinata nol?',
      'Какая координата равна нулю в плоскости Oxz?',
      'Which coordinate is zero in the plane Oxz?',
    ),
    items: [
      { id: 'b', label: L('ordinata', 'ордината', 'the ordinate'), correct: true },
      { id: 'a', label: L('abssissa', 'абсцисса', 'the abscissa'), hint: L("Abssissa nol bo'lsa, nuqta Oyz da qoladi: nomda x yo'q.", 'Если ноль абсцисса, точка остаётся в Oyz: в имени нет x.', 'If the abscissa is zero the point lies in Oyz: the name has no x.') },
      { id: 'c', label: L('applikata', 'аппликата', 'the applicate'), hint: L("Applikata nol bo'lsa, bu Oxy: nomda z yo'q.", 'Если ноль аппликата, это Oxy: в имени нет z.', 'If the applicate is zero it is Oxy: the name has no z.') },
      { id: 'd', label: L('ikkitasi', 'две из них', 'two of them'), hint: L("Ikkita nol nuqtani O'QQA olib chiqadi, tekislikka esa bittasi yetadi.", 'Два нуля выводят точку на ОСЬ, а для плоскости хватает одного.', 'Two zeros put the point on an AXIS, and a plane needs only one.') },
    ],
  },
  holds: [3000, 2400, 2600, 8500],
  audio: [
    A('mount', "Birinchi masala darslikning o'ninchi topshirig'i. To'rtta yozuv, va nol har birida bor.", 'Первая задача это десятое задание учебника. Четыре записи, и ноль есть в каждой.', 'The first problem is item ten from the textbook. Four records, and each has a zero.'),
    A('mount', "Nuqtani o'zingiz tanlaysiz.", 'Точку выбираешь сам.', 'You choose the point yourself.'),
    A('calc', 'Qaraymiz.', 'Смотрим.', 'We look.'),
    A('mark', "Mana natija. Nolning o'zi hech narsa aytmaydi: muhimi uning JOYI. Tekislik nomida qaysi harf yo'q bo'lsa, o'sha koordinata nol bo'ladi. Oxz nomida y yo'q, demak ordinata nol. Va yana bir tuzoq: ikkita nol nuqtani tekislikdan o'qqa olib chiqadi.", 'Вот результат. Сам ноль ничего не говорит: важно его МЕСТО. Какой буквы нет в имени плоскости, та координата и равна нулю. В имени Oxz нет y, значит ноль ордината. И ещё ловушка: два нуля выводят точку с плоскости на ось.', 'Here is the result. A zero by itself says nothing: its PLACE matters. Whichever letter is missing from the name of the plane, that coordinate is zero. The name Oxz has no y, so the ordinate is zero. And another trap: two zeros move the point from a plane to an axis.'),
  ],
}

// ============================================================
// SLAYD 3. MASALA 2. Skalyar ko'paytma va burchak (darslik 4-topshiriq).
// ============================================================
const S3 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'dot_sign',
  eyebrow: L('Masala 2', 'Задача 2', 'Problem 2'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Skalyar ko\'paytma 8, ya\'ni MUSBAT',
    'Скалярное произведение 8, то есть ПЛЮС',
    'The dot product is 8, that is PLUS',
  ),
  template: [L('burchak  ', 'угол  ', 'the angle  '), { slot: 0 }, '  90°'],
  signs: ['<', '>'],
  answer: '<',
  checkNote: L(
    'kosinus musbat bo\'lsa burchak o\'tkir',
    'если косинус положителен, угол острый',
    'a positive cosine means an acute angle',
  ),
  wrongs: [
    { key: '>', hint: L("O'tmas burchakda kosinus manfiy, va ko'paytma ham manfiy chiqadi.", 'У тупого угла косинус отрицателен, и произведение выходит отрицательным.', 'An obtuse angle has a negative cosine, and the product comes out negative.') },
  ],
  probe: {
    question: L(
      'Ko\'paytma nolga teng bo\'lsa?',
      'А если произведение равно нулю?',
      'And if the product is zero?',
    ),
    items: [
      { id: 'a', label: '90°', correct: true },
      { id: 'b', label: '0°', hint: L("Nol daraja bir yo'nalishni beradi, va ko'paytma eng KATTA bo'ladi.", 'Ноль градусов даёт одно направление, и произведение НАИБОЛЬШЕЕ.', 'Zero degrees means one direction, and the product is LARGEST.') },
      { id: 'c', label: '180°', hint: L("Yuz sakson darajada ko'paytma manfiy va eng kichik.", 'При ста восьмидесяти произведение отрицательно и наименьшее.', 'At one hundred eighty the product is negative and smallest.') },
      { id: 'd', label: L('aniqlab bo\'lmaydi', 'нельзя определить', 'cannot be decided'), hint: L("Aniqlanadi: nol faqat perpendikulyarlikda chiqadi.", 'Определяется: ноль выходит только при перпендикулярности.', 'It can: zero appears only for perpendicular vectors.') },
    ],
  },
  audio: [
    A('mount', "Ikkinchi masala darslikning to'rtinchi topshirig'i: ko'paytma sakkizga teng chiqdi.", 'Вторая задача это четвёртое задание учебника: произведение вышло восемь.', 'The second problem is item four from the textbook: the product came out eight.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 4. MASALA 3. Chizma: o'rta va ikkinchi uchi (darslik 5-topshiriq).
// ============================================================
const S4 = {
  role: 'graph',
  section: 'practice',
  tag: 'mid_ratio',
  drag: false,
  graphSteps: 2,
  eyebrow: L('Masala 3', 'Задача 3', 'Problem 3'),
  title: L('Ikkinchi uchi qayerda', 'Где второй конец', 'Where the other end is'),
  chip: 'A (3; 4; 8),  C (5; 6; 12)',
  space: {
    mode: 'mid',
    box: [[0, 8], [0, 9], [0, 17]],
    frame: true,
    points: [
      { at: [3, 4, 8], label: 'A', coords: true },
      { at: [5, 6, 12], label: 'C', tone: 'accent', coords: true, showAt: 1 },
      { at: [7, 8, 16], label: 'B', tone: 'graph', coords: true, showAt: 2 },
    ],
    height: 186,
  },
  probe: {
    question: L(
      'O\'rta nuqta nimani bildiradi?',
      'Что означает середина?',
      'What does a midpoint mean?',
    ),
    items: [
      { id: 'a', label: L('har koordinata bo\'yicha o\'rta arifmetik', 'среднее арифметическое по каждой координате', 'the average in each coordinate'), correct: true },
      { id: 'b', label: L('koordinatalar yarmi', 'половина координат', 'half the coordinates'), hint: L("Yarim faqat boshi koordinata boshida bo'lsa to'g'ri bo'lardi.", 'Половина была бы верна, только если начало в начале координат.', 'A half would be right only if the start were at the origin.') },
      { id: 'c', label: L('koordinatalar ayirmasi', 'разность координат', 'the difference of coordinates'), hint: L("Ayirma VEKTORni beradi, o'rta esa nuqtani.", 'Разность даёт ВЕКТОР, а середина точку.', 'A difference gives a VECTOR, a midpoint gives a point.') },
      { id: 'd', label: L('eng katta koordinata', 'наибольшая координата', 'the largest coordinate'), hint: L("O'rta har koordinatada alohida hisoblanadi, tanlash yo'q.", 'Середину считают по каждой координате отдельно, выбора нет.', 'A midpoint is computed coordinate by coordinate, there is no choosing.') },
    ],
  },
  holds: [4500, 4500],
  audio: [
    A('mount', "Uchinchi masala chizmada, darslikning beshinchi topshirig'i. Bitta uchi va o'rtasi berilgan.", 'Третья задача на чертеже, это пятое задание учебника. Дан один конец и середина.', 'The third problem is on a drawing, item five from the textbook. One end and the midpoint are given.'),
    A('mount', "O'rta har koordinatada o'rta arifmetik. Demak ikkinchi uchi topilishi uchun o'rtani ikki barobar olib, birinchi uchini ayirish kerak.", 'Середина это среднее арифметическое по каждой координате. Значит, чтобы найти второй конец, надо взять середину дважды и вычесть первый конец.', 'A midpoint is the average in each coordinate. So to find the other end we take the midpoint twice and subtract the first end.'),
    A('mount', "Uchtala koordinatada shu ishlaydi, va javob yetti, sakkiz, o'n olti.", 'Во всех трёх координатах это работает, и ответ семь, восемь, шестнадцать.', 'It works in all three coordinates, and the answer is seven, eight, sixteen.'),
  ],
}

// Zanjir amallari.
const ACTIONS_53 = [
  { id: 'coord', label: L('koordinatalarni yozish', 'выписать координаты', 'write the coordinates') },
  { id: 'sub', label: L('koordinatalarni ayirish', 'вычесть координаты', 'subtract the coordinates') },
  { id: 'scale', label: L('songa ko\'paytirish', 'умножить на число', 'multiply by a number') },
  { id: 'add', label: L('koordinatalarni qo\'shish', 'сложить координаты', 'add the coordinates') },
  { id: 'len', label: L('uzunlikni hisoblash', 'посчитать длину', 'compute the length') },
]

// ============================================================
// SLAYD 5. MASALA 4. Zanjir: ayirma (darslik 6-topshiriq).
// ============================================================
const S5 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'vector_order',
  noLine: true,
  eyebrow: L('Masala 4', 'Задача 4', 'Problem 4'),
  title: L('Vektorlar ayirmasi', 'Разность векторов', 'The difference of vectors'),
  start: 'a (−2; −4; 5),  b (−3; 4; −2)',
  actions: ACTIONS_53,
  steps: [
    {
      action: 'coord',
      to: 'a − b',
      wrongs: [
        { action: 'add', hint: L("Shartda AYIRMA so'ralgan, yig'indi emas.", 'В условии спрашивают РАЗНОСТЬ, а не сумму.', 'The problem asks for the DIFFERENCE, not the sum.') },
        { action: 'scale', hint: L("Songa ko'paytirish keyingi masalada kerak bo'ladi.", 'Умножение на число понадобится в следующей задаче.', 'Multiplying by a number belongs to the next problem.') },
        { action: 'len', hint: L("Uzunlik so'ralmagan: vektorning O'ZI kerak.", 'Длину не спрашивают: нужен САМ вектор.', 'The length is not asked: the vector ITSELF is.') },
      ],
    },
    {
      action: 'sub',
      to: '(1; −8; 7)',
      wrongs: [
        { action: 'coord', hint: L("Yozuv tayyor: a minus b.", 'Запись готова: a минус b.', 'The record is ready: a minus b.') },
        { action: 'add', hint: L("Qo'shish boshqa javob berardi.", 'Сложение дало бы другой ответ.', 'Adding would give another answer.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(1; −8; 7)', '(−5; 0; 3)', '(5; 0; 3)', '(1; 8; 7)'],
    value: ['(1; −8; 7)'],
    label: 'a − b =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '(−5; 0; 3)', hint: L("Bu YIG'INDI: koordinatalar qo'shilgan.", 'Это СУММА: координаты сложены.', 'That is the SUM: the coordinates were added.') },
      { key: '(5; 0; 3)', hint: L("Bu yig'indi, ustiga birinchi koordinatada ishora ham yo'qolgan.", 'Это сумма, и вдобавок потерян знак в первой координате.', 'That is the sum, and the sign in the first coordinate is lost too.') },
      { key: '(1; 8; 7)', hint: L("Ikkinchi koordinatada ishora yo'qolgan: minus to'rt minus to'rt minus sakkiz beradi.", 'Во второй координате потерян знак: минус четыре минус четыре даёт минус восемь.', 'The sign is lost in the second coordinate: minus four minus four gives minus eight.') },
      { key: '*', hint: L("Har koordinatada birinchisidan ikkinchisini ayiramiz.", 'В каждой координате из первого вычитаем второе.', 'In each coordinate we subtract the second from the first.') },
    ],
  },
  audio: [
    A('mount', "To'rtinchi masala darslikning oltinchi topshirig'i. Chalg'ituvchi javoblar ham shu yerdan.", 'Четвёртая задача это шестое задание учебника. Неверные варианты тоже оттуда.', 'The fourth problem is item six from the textbook. The wrong options come from there too.'),
    A('step3', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 6. MASALA 5. Ikkinchi uchi (darslik 5-topshiriq).
// ============================================================
const S6 = {
  role: 'twoway',
  section: 'practice',
  tag: 'mid_ratio',
  eyebrow: L('Masala 5', 'Задача 5', 'Problem 5'),
  title: L('Ikkinchi uchini toping', 'Найди второй конец', 'Find the other end'),
  expr: 'A (3; 4; 8),  o\'rta C (5; 6; 12)',
  need: L('ikkinchi uchi', 'второй конец', 'the other end'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('o\'rtani ikkiga bo\'ldi', 'поделил середину на два', 'halved the midpoint'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '(2; 2; 0)',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('o\'rtani ikkilab, uchini ayirdi', 'удвоила середину и вычла конец', 'doubled the midpoint and subtracted'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '(7; 8; 16)',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(7; 8; 16)', '(2; 2; 0)', '(8; 7; 7)', '(8; 10; 1)'],
    value: ['(7; 8; 16)'],
    label: 'B =',
    prompt: L('Ikkinchi uchini yozing', 'Запиши второй конец', 'Write the other end'),
    wrongs: [
      { key: '(2; 2; 0)', hint: L("Bu AYIRMA: o'rta minus uchi. Ayirma vektor beradi, ikkinchi uch esa nuqta.", 'Это РАЗНОСТЬ: середина минус конец. Разность даёт вектор, а второй конец это точка.', 'That is the DIFFERENCE: midpoint minus end. A difference gives a vector, the other end is a point.') },
      { key: '(8; 7; 7)', hint: L("Koordinatalar aralashgan: har biri O'Z o'qi bilan ishlaydi.", 'Координаты перемешаны: каждая работает со СВОЕЙ осью.', 'The coordinates are mixed: each works with its OWN axis.') },
      { key: '(8; 10; 1)', hint: L("Ikkinchi va uchinchi koordinatada hisob buzilgan: ikki karra olti minus to'rt sakkiz beradi.", 'Во второй и третьей координате счёт сбит: два на шесть минус четыре даёт восемь.', 'The count breaks in the second and third: two times six minus four gives eight.') },
      { key: '*', hint: L("Har koordinatada o'rtani ikkiga ko'paytirib, birinchi uchni ayiramiz.", 'В каждой координате умножаем середину на два и вычитаем первый конец.', 'In each coordinate we double the midpoint and subtract the first end.') },
    ],
  },
  holds: [4200, 3600, 5500],
  audio: [
    A('mount', "Beshinchi masala. Ikki o'quvchi bitta shartni boshqacha o'qidi.", 'Пятая задача. Два ученика прочитали одно условие по-разному.', 'The fifth problem. Two students read one problem differently.'),
    A('p1', "Aziz o'rtani ikkiga bo'ldi. Uning javobi ayirmaga o'xshab qoldi.", 'Азиз поделил середину на два. Его ответ оказался похож на разность.', 'Aziz halved the midpoint. His answer came out like a difference.'),
    A('p2', "Dilnoza esa o'rta ikki uchning yarim yig'indisi ekanini esladi. Demak ikkinchi uchi o'rtaning ikki barobaridan birinchi uchni ayirish bilan topiladi. Tekshiruv oson: topilgan uch va berilgan uchning yarim yig'indisi aynan o'rta bo'lishi kerak.", 'А Дилноза вспомнила, что середина это полусумма двух концов. Значит второй конец находят как удвоенную середину минус первый конец. Проверка простая: полусумма найденного и данного концов должна дать ровно середину.', 'Dilnoza recalled that a midpoint is the half sum of the two ends. So the other end is twice the midpoint minus the first end. The check is easy: the half sum of the found and the given end must give exactly the midpoint.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 7. MASALA 6. Simmetriya (darslik 8-topshiriq).
// ============================================================
const S7 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'sym_coord',
  eyebrow: L('Masala 6', 'Задача 6', 'Problem 6'),
  title: L('Oxy ga nisbatan simmetrik', 'Симметрия относительно Oxy', 'Symmetric about Oxy'),
  expr: L('nuqta (−1; 2; 3)', 'точка (−1; 2; 3)', 'the point (−1; 2; 3)'),
  goal: L('qaysi koordinata ishora almashadi', 'какая координата меняет знак', 'which coordinate flips'),
  rule: L(
    "Har javobda qaysi ishora almashganini qaraymiz.",
    'В каждом ответе смотрим, какой знак сменился.',
    'In each answer we see which sign flipped.',
  ),
  pick: L('Qaysi javobni tekshiramiz?', 'Какой ответ проверим?', 'Which answer shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('hamma ishora almashadi', 'все знаки меняются', 'all signs flip'), value: L('uchtasi', 'три', 'three') },
    { id: 'b', key: 'inB', name: L('faqat applikata', 'только аппликата', 'the applicate only'), value: 'z' },
  ],
  points: [
    {
      id: 'q1', label: '(−1; −2; −3)', num: L('uchtasi almashdi', 'сменились три', 'three flipped'), step: 'calc', verdict: 'out',
      calc: L('bu koordinata boshiga nisbatan', 'это относительно начала координат', 'that is about the origin'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q2', label: '(1; 2; −3)', num: L('abssissa va applikata', 'абсцисса и аппликата', 'the abscissa and the applicate'), step: 'calc', verdict: 'out',
      calc: L('bu Oy o\'qiga nisbatan emas', 'это не относительно Oy', 'that is not about Oy'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q3', label: '(−1; 2; −3)', num: L('faqat applikata', 'только аппликата', 'the applicate only'), step: 'calc', verdict: 'in',
      calc: L('aynan Oxy', 'именно Oxy', 'exactly Oxy'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q4', label: '(1; 2; 3)', num: L('faqat abssissa', 'только абсцисса', 'the abscissa only'), step: 'calc', verdict: 'out',
      calc: L('bu Oyz tekisligiga nisbatan', 'это относительно Oyz', 'that is about Oyz'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L(
      'Qaysi koordinata ishorasini almashtiradi?',
      'Какая координата меняет знак?',
      'Which coordinate flips its sign?',
    ),
    items: [
      { id: 'b', label: L('tekislik nomida YO\'Q koordinata', 'та, которой НЕТ в имени плоскости', 'the one MISSING from the name'), correct: true },
      { id: 'a', label: L('hammasi', 'все', 'all of them'), hint: L("Hammasi almashsa, bu koordinata boshiga nisbatan simmetriya bo'ladi.", 'Если меняются все, это симметрия относительно начала координат.', 'If all flip, that is symmetry about the origin.') },
      { id: 'c', label: L('birinchisi', 'первая', 'the first'), hint: L("Birinchisi Oyz tekisligida almashadi: u yerda nomda x yo'q.", 'Первая меняется в плоскости Oyz: там в имени нет x.', 'The first flips for the plane Oyz: there the name has no x.') },
      { id: 'd', label: L('eng kattasi', 'наибольшая', 'the largest'), hint: L("Kattalik ahamiyatsiz: qoida tekislikning nomiga bog'liq.", 'Величина не важна: правило зависит от имени плоскости.', 'Size does not matter: the rule follows the name of the plane.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Oltinchi masala darslikning sakkizinchi topshirig'i.", 'Шестая задача это восьмое задание учебника.', 'The sixth problem is item eight from the textbook.'),
    A('mount', "Javobni o'zingiz tanlaysiz.", 'Ответ выбираешь сам.', 'You choose the answer yourself.'),
    A('calc', 'Qaraymiz.', 'Смотрим.', 'We look.'),
    A('mark', "Mana natija. Faqat bitta javob mos keldi: applikata ishora almashdi, qolganlari joyida qoldi. Qoida oson eslanadi: tekislik nomida qaysi harf yo'q bo'lsa, o'sha koordinata ishora almashadi. Oxy nomida z yo'q, demak z minus bo'ladi. Bu bilan oldingi ekrandagi qoida ham bog'lanadi: u yerda ham nomda yo'q harf ishlagan edi.", 'Вот результат. Сошёлся только один ответ: аппликата сменила знак, остальные остались. Правило запоминается легко: какой буквы нет в имени плоскости, та координата и меняет знак. В имени Oxy нет z, значит z становится минусом. И это связано с правилом предыдущего экрана: там тоже работала отсутствующая буква.', 'Here is the result. Only one answer fits: the applicate flipped, the others stayed. The rule is easy: whichever letter is missing from the name of the plane, that coordinate flips. The name Oxy has no z, so z becomes negative. And this links to the rule from the earlier screen: there too the missing letter did the work.'),
  ],
}

// ============================================================
// SLAYD 8. MASALA 7. Mustaqil: 2a − 3b (darslik 9-topshiriq).
// ============================================================
const S8 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'scale_sign',
  noLine: true,
  solo: true,
  eyebrow: L('Masala 7', 'Задача 7', 'Problem 7'),
  title: L('Imtihondagidek', 'Как на экзамене', 'As on the exam'),
  start: '2a − 3b,  a (0; −5; 2),  b (2; −3; 1)',
  actions: ACTIONS_53,
  hint: L(
    "Avval har vektorni songa ko'paytiring, keyin ayiring.",
    'Сначала умножь каждый вектор на число, потом вычитай.',
    'First multiply each vector by its number, then subtract.',
  ),
  steps: [
    {
      action: 'scale',
      to: '(0; −10; 4)  va  (6; −9; 3)',
      wrongs: [
        { action: 'sub', hint: L("Ayirishdan oldin ko'paytmalarni hisoblash kerak.", 'Прежде чем вычитать, надо посчитать произведения.', 'Before subtracting, the products must be computed.') },
        { action: 'add', hint: L("Shartda ayirma turadi.", 'В условии стоит разность.', 'The problem has a difference.') },
        { action: 'len', hint: L("Uzunlik so'ralmagan.", 'Длину не спрашивают.', 'The length is not asked.') },
      ],
    },
    {
      action: 'sub',
      to: '(−6; −1; 1)',
      wrongs: [
        { action: 'scale', hint: L("Ko'paytmalar tayyor: nol, minus o'n, to'rt va olti, minus to'qqiz, uch.", 'Произведения готовы: ноль, минус десять, четыре и шесть, минус девять, три.', 'The products are ready: zero, minus ten, four and six, minus nine, three.') },
        { action: 'coord', hint: L("Koordinatalar allaqachon yozilgan.", 'Координаты уже выписаны.', 'The coordinates are already written.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(−6; −1; 1)', '(−6; −19; 1)', '(0; −4; −1)', '(6; −4; 1)'],
    value: ['(−6; −1; 1)'],
    label: '2a − 3b =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '(−6; −19; 1)', hint: L("Ikkinchi koordinatada QO'SHILGAN: minus o'n minus minus to'qqiz minus bir beradi.", 'Во второй координате СЛОЖЕНО: минус десять минус минус девять даёт минус один.', 'The second coordinate was ADDED: minus ten minus minus nine gives minus one.') },
      { key: '(0; −4; −1)', hint: L("Ko'paytuvchilar unutilgan: ikki va uch ishlatilmagan.", 'Забыты множители: два и три не использованы.', 'The factors are forgotten: two and three were not used.') },
      { key: '(6; −4; 1)', hint: L("Birinchi koordinatada ishora teskari: nol minus olti minus olti beradi.", 'В первой координате знак обратный: ноль минус шесть даёт минус шесть.', 'The sign is reversed in the first: zero minus six gives minus six.') },
      { key: '*', hint: L("Ikki karra a nol, minus o'n, to'rt; uch karra b olti, minus to'qqiz, uch. Ayiramiz.", 'Два a это ноль, минус десять, четыре; три b это шесть, минус девять, три. Вычитаем.', 'Two a is zero, minus ten, four; three b is six, minus nine, three. Subtract.') },
    ],
  },
  audio: [
    A('mount', "Yettinchi masala mustaqil, darslikning to'qqizinchi topshirig'i.", 'Седьмая задача самостоятельная, это девятое задание учебника.', 'The seventh problem is on your own, item nine from the textbook.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 9. MASALA 8. Perpendikulyarlik.
// ============================================================
const S9 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'perp_zero',
  eyebrow: L('Masala 8', 'Задача 8', 'Problem 8'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Vektorlar PERPENDIKULYAR',
    'Векторы ПЕРПЕНДИКУЛЯРНЫ',
    'The vectors are PERPENDICULAR',
  ),
  template: [L('skalyar ko\'paytma  ', 'скалярное произведение  ', 'the dot product  '), { slot: 0 }, '  0'],
  signs: ['=', '>'],
  answer: '=',
  checkNote: L(
    'to\'qsan darajaning kosinusi nol',
    'косинус девяноста градусов равен нулю',
    'the cosine of ninety degrees is zero',
  ),
  wrongs: [
    { key: '>', hint: L("Musbat ko'paytma o'tkir burchakni beradi, perpendikulyarlikda esa aynan nol chiqadi.", 'Положительное произведение даёт острый угол, а при перпендикулярности выходит ровно ноль.', 'A positive product means an acute angle, and perpendicularity gives exactly zero.') },
  ],
  probe: {
    question: L(
      'Bu shart nima uchun qulay?',
      'Чем это условие удобно?',
      'Why is this condition handy?',
    ),
    items: [
      { id: 'a', label: L('burchakni hisoblash kerak emas', 'угол считать не нужно', 'no angle needs computing'), correct: true },
      { id: 'b', label: L('uzunliklar kerak emas', 'длины не нужны', 'no lengths are needed'), hint: L("Uzunliklar shundoq ham kerak emas: ko'paytma koordinatalardan hisoblanadi.", 'Длины и так не нужны: произведение считают по координатам.', 'Lengths are not needed anyway: the product is computed from coordinates.') },
      { id: 'c', label: L('javob har doim nol', 'ответ всегда ноль', 'the answer is always zero'), hint: L("Ko'paytma nol, lekin savol odatda BOSHQA narsani so'raydi: masalan parametrni.", 'Произведение ноль, но спрашивают обычно ДРУГОЕ: например параметр.', 'The product is zero, but the question usually asks for something else, for instance a parameter.') },
      { id: 'd', label: L('chizma kerak emas', 'чертёж не нужен', 'no drawing is needed'), hint: L("Chizma ham kerak emas, lekin asosiy foyda burchakni chetlab o'tishda.", 'Чертёж тоже не нужен, но главная выгода в том, что угол обходят.', 'No drawing either, but the main gain is skipping the angle.') },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi masala. Vektorlar perpendikulyar.", 'Восьмая задача. Векторы перпендикулярны.', 'The eighth problem. The vectors are perpendicular.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 10. MASALA 9. Teskari masala: masofa (darslik 3-topshiriq).
// ============================================================
const S10 = {
  role: 'build',
  section: 'practice',
  led: 'student',
  tag: 'dist_flat',
  right: '2/2',
  eyebrow: L('Masala 9', 'Задача 9', 'Problem 9'),
  title: L('Masofani yig\'ing', 'Собери расстояние', 'Build the distance'),
  targetLabel: L('Nuqtalar', 'Точки', 'The points'),
  targetValue: 'M (3; −2; 0),  N (−1; 1; 12)',
  tasks: [
    {
      prompt: L('Ayirmalar kvadratlari', 'Квадраты разностей', 'The squares of the differences'),
      template: [{ slot: 0 }, ' + ', { slot: 1 }, ' + 144'],
      parts: ['16', '9', '4', '3'],
      answer: ['16', '9'],
      doneLabel: '16 + 9 + 144',
      wrongs: [
        { key: '4|9', hint: L("Birinchi ayirma minus to'rt, uning kvadrati o'n olti.", 'Первая разность минус четыре, её квадрат шестнадцать.', 'The first difference is minus four, its square sixteen.') },
        { key: '16|3', hint: L("Ikkinchi ayirma uch, uning KVADRATI to'qqiz.", 'Вторая разность три, её КВАДРАТ девять.', 'The second difference is three, its SQUARE nine.') },
        { key: '*', hint: L("Har koordinatada ayirmani olib, kvadratga ko'taramiz.", 'В каждой координате берём разность и возводим в квадрат.', 'In each coordinate we take the difference and square it.') },
      ],
    },
    {
      prompt: L('Masofa', 'Расстояние', 'The distance'),
      template: ['d = ', { slot: 0 }],
      parts: ['13', '169', '12', '23'],
      answer: ['13'],
      doneLabel: 'd = 13',
      wrongs: [
        { key: '169', hint: L("Ildiz olinmagan: bu kvadratlar yig'indisi.", 'Корень не взят: это сумма квадратов.', 'The root is not taken: that is the sum of squares.') },
        { key: '12', hint: L("O'n ikki bu eng katta ayirma, masofa esa undan kattaroq.", 'Двенадцать это наибольшая разность, а расстояние больше.', 'Twelve is the largest difference, and the distance exceeds it.') },
        { key: '23', hint: L("Yigirma uch bu ayirmalar yig'indisi, kvadratlar emas.", 'Двадцать три это сумма разностей, а не квадратов.', 'Twenty three is the sum of the differences, not of the squares.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'qqizinchi masala teskari, darslikning uchinchi topshirig'i: yozuvni o'zingiz yig'asiz.", 'Девятая задача обратная, это третье задание учебника: запись собираешь сам.', 'The ninth problem is reverse, item three from the textbook: you build the record.'),
    A('built1', "Endi sonni yozing.", 'Теперь запиши число.', 'Now write the number.'),
  ],
}

// ============================================================
// SLAYD 11. MASALA 10. Burchak turi (darslik 4-topshiriq).
// ============================================================
const S11 = {
  role: 'twoway',
  section: 'practice',
  tag: 'dot_sign',
  eyebrow: L('Masala 10', 'Задача 10', 'Problem 10'),
  title: L('Burchak qanday', 'Каков угол', 'What kind of angle'),
  expr: 'a (−1; 3; 2) · b (−2; 4; −3)',
  need: L('burchak turi', 'вид угла', 'the kind of angle'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('minuslarni sanadi', 'посчитал минусы', 'counted the minuses'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: L('o\'tmas', 'тупой', 'obtuse'),
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('ko\'paytmani hisobladi', 'посчитала произведение', 'computed the product'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: L('o\'tkir', 'острый', 'acute'),
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['8', '10', '14', '−2'],
    value: ['8'],
    label: L('ko\'paytma =', 'произведение =', 'product ='),
    prompt: L('Ko\'paytmani yozing', 'Запиши произведение', 'Write the product'),
    wrongs: [
      { key: '10', hint: L("O'n bu ikki plyus o'n ikki minus to'rt: uchinchi ko'paytma xato hisoblangan.", 'Десять это два плюс двенадцать минус четыре: третье произведение посчитано неверно.', 'Ten is two plus twelve minus four: the third product is computed wrong.') },
      { key: '14', hint: L("O'n to'rt uchinchi qo'shiluvchi tashlab ketilganda chiqadi.", 'Четырнадцать выходит, если отбросить третье слагаемое.', 'Fourteen appears when the third term is dropped.') },
      { key: '−2', hint: L("Minus ikki minuslar sanalganda chiqadi, hisob esa boshqacha.", 'Минус два выходит при подсчёте минусов, а счёт другой.', 'Minus two comes from counting minuses, and the arithmetic differs.') },
      { key: '*', hint: L("Ikki plyus o'n ikki minus olti sakkiz beradi.", 'Два плюс двенадцать минус шесть даёт восемь.', 'Two plus twelve minus six gives eight.') },
    ],
  },
  holds: [4200, 3600, 5500],
  audio: [
    A('mount', "O'ninchi masala, oxirgisi. Darslikning to'rtinchi topshirig'i.", 'Десятая задача, последняя. Четвёртое задание учебника.', 'The tenth problem, the last. Item four from the textbook.'),
    A('p1', "Aziz yozuvdagi minuslarni sanadi va o'tmas burchak deb aytdi.", 'Азиз посчитал минусы в записи и сказал, что угол тупой.', 'Aziz counted the minuses in the record and said the angle is obtuse.'),
    A('p2', "Dilnoza esa ko'paytmani hisobladi. Ikki plyus o'n ikki minus olti sakkizga teng, va sakkiz musbat. Demak burchak o'tkir. Minuslar soni hech narsa aytmaydi: hisobning o'zi kerak.", 'А Дилноза посчитала произведение. Два плюс двенадцать минус шесть равно восьми, и восемь положительно. Значит угол острый. Число минусов ничего не говорит: нужен сам счёт.', 'Dilnoza computed the product. Two plus twelve minus six equals eight, and eight is positive. So the angle is acute. The number of minuses says nothing: the arithmetic itself is needed.'),
    A('write', 'Ko\'paytmani yozing.', 'Запиши произведение.', 'Write the product.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS. Hammasi darslik bankidan.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol', 'Шесть вопросов', 'Six questions'),
  items: [
    {
      id: 'b1', tag: 'coord_order', ask: true, cols: 2,
      done: '13',
      prompt: L('M (3; −2; 0) va N (−1; 1; 12) orasidagi masofa?', 'Расстояние между M (3; −2; 0) и N (−1; 1; 12)?', 'The distance between M (3; −2; 0) and N (−1; 1; 12)?'),
      items: [
        { id: 'a', label: '13', correct: true },
        { id: 'b', label: '10', hint: L("O'n bitta koordinata tashlab ketilganda chiqadi.", 'Десять выходит, если отбросить одну координату.', 'Ten appears when one coordinate is dropped.') },
        { id: 'c', label: '12', hint: L("O'n ikki bu eng katta ayirma.", 'Двенадцать это наибольшая разность.', 'Twelve is the largest difference.') },
        { id: 'd', label: '23', hint: L("Yigirma uch ayirmalar yig'indisi.", 'Двадцать три это сумма разностей.', 'Twenty three is the sum of the differences.') },
      ],
    },
    {
      id: 'b2', tag: 'vector_order', ask: true, cols: 2,
      done: '(−7; 6; 0)',
      prompt: 'a (−3; 2; −1) + b (−4; 4; 1)',
      items: [
        { id: 'a', label: '(−7; 6; 0)', correct: true },
        { id: 'b', label: '(7; 6; 0)', hint: L("Birinchi koordinatada ishora yo'qolgan.", 'В первой координате потерян знак.', 'The sign is lost in the first coordinate.') },
        { id: 'c', label: '(−7; 6; −1)', hint: L("Uchinchi koordinatada minus bir plyus bir nolga teng.", 'В третьей координате минус один плюс один равно нулю.', 'In the third, minus one plus one is zero.') },
        { id: 'd', label: '(12; 8; −1)', hint: L("Bu ko'paytma emas, yig'indi: koordinatalar QO'SHILADI.", 'Это не произведение, а сумма: координаты СКЛАДЫВАЮТ.', 'This is a sum, not a product: the coordinates are ADDED.') },
      ],
    },
    {
      id: 'b3', tag: 'dot_sign', ask: true, cols: 2,
      done: '8',
      prompt: 'a (−1; 3; 2) · b (−2; 4; −3)',
      items: [
        { id: 'a', label: '8', correct: true },
        { id: 'b', label: '10', hint: L("Uchinchi ko'paytma minus olti, minus to'rt emas.", 'Третье произведение минус шесть, а не минус четыре.', 'The third product is minus six, not minus four.') },
        { id: 'c', label: '14', hint: L("Uchinchi qo'shiluvchi tashlab ketilgan.", 'Третье слагаемое отброшено.', 'The third term was dropped.') },
        { id: 'd', label: '−2', hint: L("Ishoralar chalkashgan: birinchi ko'paytma musbat ikki.", 'Знаки спутаны: первое произведение плюс два.', 'The signs are confused: the first product is plus two.') },
      ],
    },
    {
      id: 'b4', tag: 'mid_ratio', ask: true, cols: 2,
      done: '(3; −2; −4)',
      prompt: L('A (1; −3; −5) va B (5; −1; −3) o\'rtasi?', 'Середина A (1; −3; −5) и B (5; −1; −3)?', 'The midpoint of A (1; −3; −5) and B (5; −1; −3)?'),
      items: [
        { id: 'a', label: '(3; −2; −4)', correct: true },
        { id: 'b', label: '(3; 2; 4)', hint: L("Ishoralar yo'qolgan: manfiy sonlarning o'rtasi ham manfiy.", 'Потеряны знаки: середина отрицательных тоже отрицательна.', 'The signs are lost: the midpoint of negatives is negative too.') },
        { id: 'c', label: '(2; −1; 1)', hint: L("Bu ayirmaning yarmi, o'rta esa YIG'INDINING yarmi.", 'Это половина разности, а середина это половина СУММЫ.', 'That is half the difference, and a midpoint is half the SUM.') },
        { id: 'd', label: '(2; 1; 1)', hint: L("Ikki xato birga: ayirma va ishoralar.", 'Две ошибки сразу: разность и знаки.', 'Two errors at once: the difference and the signs.') },
      ],
    },
    {
      id: 'b5', tag: 'sym_coord', ask: true, cols: 2,
      done: '(−1; 2; −3)',
      prompt: L('Oxy ga nisbatan (−1; 2; 3) ning simmetrigi?', 'Симметричная (−1; 2; 3) относительно Oxy?', 'The point symmetric to (−1; 2; 3) about Oxy?'),
      items: [
        { id: 'a', label: '(−1; 2; −3)', correct: true },
        { id: 'b', label: '(−1; −2; −3)', hint: L("Ikki ishora almashgan, Oxy da esa faqat applikata.", 'Сменились два знака, а в Oxy только аппликата.', 'Two signs flipped, and in Oxy only the applicate does.') },
        { id: 'c', label: '(1; 2; −3)', hint: L("Abssissa tegilmasligi kerak.", 'Абсциссу трогать не нужно.', 'The abscissa must stay.') },
        { id: 'd', label: '(1; 2; 3)', hint: L("Bu Oyz tekisligiga nisbatan simmetriya.", 'Это симметрия относительно Oyz.', 'That is symmetry about Oyz.') },
      ],
    },
    {
      id: 'b6', tag: 'coord_order', ask: true, cols: 2,
      done: '(2; 0; −8)',
      prompt: L('Qaysi nuqta Oxz tekisligida yotadi?', 'Какая точка лежит в плоскости Oxz?', 'Which point lies in the plane Oxz?'),
      items: [
        { id: 'a', label: '(2; 0; −8)', correct: true },
        { id: 'b', label: '(−4; 2; 0)', hint: L("Bu Oxy: nolga applikata aylangan.", 'Это Oxy: нулём стала аппликата.', 'That is Oxy: the applicate is zero.') },
        { id: 'c', label: '(0; 5; 0)', hint: L("Ikkita nol nuqtani Oy o'qiga olib chiqadi.", 'Два нуля выводят точку на ось Oy.', 'Two zeros put the point on the Oy axis.') },
        { id: 'd', label: '(0; −2; 1)', hint: L("Bu Oyz: nolga abssissa aylangan.", 'Это Oyz: нулём стала абсцисса.', 'That is Oyz: the abscissa is zero.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, hammasi darslikning imtihon bankidan, va faqat shu ekran natijaga kiradi.", 'Блиц. Шесть вопросов, все из экзаменационного банка учебника, и только этот экран идёт в результат.', 'Quick round. Six questions, all from the exam bank of the textbook, and only this screen counts.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Boshi minus oxiri.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'vector_order',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: 'A (1; 2; 3),  B (4; 6; 9)' },
    { id: 'r2', text: L('AB vektori kerak', 'нужен вектор AB', 'the vector AB is needed') },
    { id: 'r3', text: 'AB = (1 − 4;  2 − 6;  3 − 9)' },
    { id: 'r4', text: 'AB = (−3; −4; −6)' },
    { id: 'r5', text: L('uzunligi: √61', 'длина: √61', 'the length: √61') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Bu ham shart: AB vektori so'ralgan.", 'Это тоже условие: спрашивают вектор AB.', 'This is the problem too: the vector AB is asked.'),
    r4: L("Uchinchi satrdagi yozuvdan bu to'g'ri chiqadi.", 'Из записи третьей строки это выходит верно.', 'From the third line record this follows correctly.'),
    r5: L("Uzunlik to'g'ri: to'qqiz plyus o'n olti plyus o'ttiz olti oltmish bir. Ishora uzunlikka ta'sir qilmaydi.", 'Длина верна: девять плюс шестнадцать плюс тридцать шесть это шестьдесят один. Знак на длину не влияет.', 'The length is right: nine plus sixteen plus thirty six is sixty one. A sign does not affect a length.'),
  },
  proofPoint: L('oxiri minus boshi', 'конец минус начало', 'the head minus the tail'),
  proof: L(
    "AB vektorida boshi A, oxiri B. Demak har koordinatada B ning koordinatasidan A ning koordinatasi ayiriladi: to'rt minus bir uch, olti minus ikki to'rt, to'qqiz minus uch olti. To'g'ri javob uch, to'rt, olti. Uzunlik esa ikki holatda ham bir xil chiqadi, va shu sababli xato uzunlik bilan ushlanmaydi.",
    'В векторе AB начало A, конец B. Значит в каждой координате из координаты B вычитают координату A: четыре минус один три, шесть минус два четыре, девять минус три шесть. Верный ответ три, четыре, шесть. А длина в обоих случаях выходит одинаковой, и поэтому ошибку длиной не поймать.',
    'In the vector AB the tail is A and the head is B. So in each coordinate the coordinate of A is subtracted from that of B: four minus one three, six minus two four, nine minus three six. The right answer is three, four, six. The length comes out the same either way, so a length check will not catch this error.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('tartib teskari', 'порядок обратный', 'the order is reversed'), correct: true },
      { id: 'b', label: L('uzunlik xato', 'длина неверна', 'the length is wrong'), hint: L("Uzunlik to'g'ri: ishora kvadratda yo'qoladi.", 'Длина верна: знак исчезает в квадрате.', 'The length is right: a sign vanishes in the square.') },
      { id: 'c', label: L('koordinatalar aralashgan', 'координаты перепутаны', 'the coordinates are mixed'), hint: L("Koordinatalar joyida: har biri o'z o'qi bilan ishlagan.", 'Координаты на месте: каждая работала со своей осью.', 'The coordinates are fine: each worked with its own axis.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Javobda hamma ishora manfiy, aslida esa hammasi musbat.", 'В ответе все знаки отрицательны, а на самом деле все положительны.', 'The answer has all signs negative, and in fact all are positive.') },
    ],
  },
  audio: [
    A('mount', "Masalalar tugadi. Endi boshqaning yechimiga qaraymiz.", 'Задачи закончились. Теперь посмотрим на чужое решение.', 'The problems are done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: bu yechimda uzunlik ham hisoblangan, va u to'g'ri. Xato baribir bor.", 'Внимание: в этом решении посчитана и длина, и она верна. Ошибка всё равно есть.', 'Careful: this solution even computes the length, and it is right. The error is there anyway.'),
    A('proof', "Qarang: vektorning nomi tartibni AYTADI. AB da boshi A, oxiri B, va koordinatalar oxiridan boshini ayirish bilan topiladi. Bu yechimda teskari qilingan, va natijada vektor qarama-qarshi tomonga qaragan. Uzunlik esa ikki holatda bir xil chiqadi, chunki ishora kvadratga ko'tarilganda yo'qoladi. Shuning uchun uzunlik bilan tekshirish bu xatoni ushlamaydi: ISHORAlarga qarash kerak.", 'Смотри: имя вектора САМО говорит о порядке. В AB начало A, конец B, и координаты находят вычитанием начала из конца. В этом решении сделано наоборот, и вектор смотрит в противоположную сторону. А длина в обоих случаях одинакова, потому что знак исчезает при возведении в квадрат. Поэтому проверка длиной эту ошибку не поймает: надо смотреть на ЗНАКИ.', 'Look: the name of the vector itself gives the order. In AB the tail is A and the head is B, and the coordinates come from subtracting the tail from the head. This solution did the opposite, and the vector points the other way. The length is the same either way, because the sign vanishes when squared. So a length check will not catch it: the SIGNS must be read.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: simmetriya jadvali.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'sym_coord',
  right: '2/2',
  eyebrow: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  title: L('Jadvalni yig\'ing', 'Собери таблицу', 'Build the table'),
  targetLabel: L('Nuqta', 'Точка', 'The point'),
  targetValue: '(x; y; z)',
  tasks: [
    {
      prompt: L('Oxz ga nisbatan', 'Относительно Oxz', 'About Oxz'),
      template: ['(x; ', { slot: 0 }, '; z)'],
      parts: ['−y', 'y', '−z', '−x'],
      answer: ['−y'],
      doneLabel: '(x; −y; z)',
      wrongs: [
        { key: 'y', hint: L("Bir narsa o'zgarishi kerak: aks holda nuqta joyida qoladi.", 'Что-то должно измениться: иначе точка останется на месте.', 'Something must change: otherwise the point stays put.') },
        { key: '−z', hint: L("Applikata Oxy da almashadi, Oxz da esa ordinata.", 'Аппликата меняется в Oxy, а в Oxz ордината.', 'The applicate flips for Oxy, and for Oxz the ordinate does.') },
        { key: '*', hint: L("Nomda y yo'q, demak ordinata ishora almashadi.", 'В имени нет y, значит знак меняет ордината.', 'The name has no y, so the ordinate flips.') },
      ],
    },
    {
      prompt: L('Koordinata boshiga nisbatan', 'Относительно начала координат', 'About the origin'),
      template: ['(', { slot: 0 }, ')'],
      parts: ['−x; −y; −z', 'x; y; −z', '−x; y; z', 'x; −y; z'],
      answer: ['−x; −y; −z'],
      doneLabel: '(−x; −y; −z)',
      wrongs: [
        { key: 'x; y; −z', hint: L("Bu Oxy tekisligiga nisbatan.", 'Это относительно плоскости Oxy.', 'That is about the plane Oxy.') },
        { key: '−x; y; z', hint: L("Bu Oyz tekisligiga nisbatan.", 'Это относительно плоскости Oyz.', 'That is about the plane Oyz.') },
        { key: '*', hint: L("Nuqtaga nisbatan simmetriyada uchala ishora almashadi.", 'При симметрии относительно точки меняются все три знака.', 'For symmetry about a point all three signs flip.') },
      ],
    },
  ],
  audio: [
    A('mount', "Oxirgi topshiriq: simmetriya jadvali. Qoida bitta: nomda yo'q harf ishora almashtiradi.", 'Последнее задание: таблица симметрий. Правило одно: отсутствующая в имени буква меняет знак.', 'The last task: the symmetry table. One rule: the letter missing from the name flips its sign.'),
    A('built1', "Endi nuqtaga nisbatan.", 'Теперь относительно точки.', 'Now about a point.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'vector_order',
  gapMap: true,
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L('Qayerda teshik bor', 'Где дырка', 'Where the gap is'),
  law: L('tartib va ishora', 'порядок и знак', 'the order and the sign'),
  ruleLines: [
    L('vektor: oxiri minus boshi', 'вектор: конец минус начало', 'a vector: head minus tail'),
    L('o\'rta: yarim yig\'indi', 'середина: полусумма', 'a midpoint: the half sum'),
    L('nomda yo\'q harf ishora almashtiradi', 'отсутствующая буква меняет знак', 'the missing letter flips the sign'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('vektorlar yig\'indisi', 'сумма векторов', 'the sum of vectors'),
      right: '(−7; 6; 0)',
      map: { a: '(−7; 6; 0)', b: '(7; 6; 0)', c: '(−7; 6; −1)', d: '(12; 8; −1)' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '(−3) + (−4) = −7',
  },
  levels: {
    full: L('Bu blok DTM da siz uchun yopildi', 'Этот блок на ДТМ у тебя закрыт', 'This block is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Xaritada ko\'rsatilgan darslarga qayting', 'Вернись к урокам, указанным в карте', 'Go back to the lessons named in the map'),
  },
  probe: {
    question: L(
      'Nima uchun uzunlik xatoni ushlamaydi?',
      'Почему длина не ловит ошибку?',
      'Why does a length not catch the error?',
    ),
    items: [
      { id: 'a', label: L('kvadratga ko\'tarilganda ishora yo\'qoladi', 'при возведении в квадрат знак исчезает', 'squaring destroys the sign'), correct: true },
      { id: 'b', label: L('uzunlik har doim butun', 'длина всегда целая', 'a length is always whole'), hint: L("Uzunlik kasr ham bo'lishi mumkin: bu masalada ildiz oltmish bir.", 'Длина может быть и дробной: в этой задаче корень из шестидесяти одного.', 'A length may be irrational: in that problem it was the root of sixty one.') },
      { id: 'c', label: L('uzunlik hisoblanmaydi', 'длину не считают', 'a length is not computed'), hint: L("Hisoblanadi, va u to'g'ri chiqdi: shuning uchun xato yashiringan.", 'Считают, и она вышла верной: поэтому ошибка и спряталась.', 'It is computed, and it came out right: that is exactly why the error hid.') },
      { id: 'd', label: L('uzunlik tartibga bog\'liq', 'длина зависит от порядка', 'a length depends on the order'), hint: L("Aynan bog'liq EMAS: shuning uchun u tartib xatosini ko'rmaydi.", 'Как раз НЕ зависит: поэтому она и не видит ошибку порядка.', 'It precisely does NOT: that is why it cannot see an order error.') },
    ],
  },
  sheetTitle: L('Vektorlar · shpargalka', 'Векторы · шпаргалка', 'Vectors · cheat sheet'),
  sheetSrc: L('11-sinf · 53-dars', '11 класс · урок 53', 'Grade 11 · lesson 53'),
  lifehack: L(
    "Vektorning nomi tartibni aytadi: AB da oxiri B.",
    'Имя вектора говорит о порядке: в AB конец это B.',
    'The name of a vector gives the order: in AB the head is B.',
  ),
  holds: [3200, 5000, 6500],
  audio: [
    A('mount', "Sinov tugadi. Natijaga qaraymiz.", 'Проверка закончена. Смотрим результат.', 'The check is over. Let us look at the result.'),
    A('p1', "Mana taxminingiz va mana javob. Yig'indi minus yetti, olti, nol: ishora tashlab ketilmaydi.", 'Вот твоя догадка и вот ответ. Сумма минус семь, шесть, ноль: знак не отбрасывают.', 'Here is your guess and here is the answer. The sum is minus seven, six, zero: a sign is never dropped.'),
    A('rule', "O'ng tomonda kamchiliklar xaritasi. Uchta qoida esa har imtihonda uchraydi. Birinchisi: vektor oxiri minus boshi, va vektorning nomi tartibni aytadi. Ikkinchisi: o'rta ikki uchning yarim yig'indisi, ayirma esa vektor beradi. Uchinchisi: simmetriyada tekislik nomida yo'q koordinata ishora almashtiradi. Keyingi darsda tayyorlov varianti: masalalar hamma blokdan.", 'Справа карта пробелов. А три правила встречаются на каждом экзамене. Первое: вектор это конец минус начало, и имя вектора говорит о порядке. Второе: середина это полусумма концов, а разность даёт вектор. Третье: при симметрии знак меняет та координата, которой нет в имени плоскости. На следующем уроке тренировочный вариант: задачи из всех блоков.', 'On the right is your gap map. And three rules appear in every exam. First: a vector is head minus tail, and its name gives the order. Second: a midpoint is the half sum of the ends, while a difference gives a vector. Third: under a symmetry the coordinate missing from the name of the plane flips its sign. The next lesson is a training variant: problems from every block.'),
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
