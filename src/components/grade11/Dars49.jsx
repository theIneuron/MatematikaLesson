// ============================================================================
// 11-sinf, Dars 49. MATNLI MASALALAR VA YIL YAKUNI: SINOV DTM.
//
// B6 blokining oxirgi darsi, DTM rejimida to'rtinchisi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md, 1.2-band (DTM anatomiyasi)
//   asbob:    `GraphProjection`, `AnswerValue`, `Probe`
//   tayanch:  BUTUN yil -- B1 dan B6 gacha. Har masala boshqa blokdan.
//
// DARSNING BITTA GAPI: matnli masalada eng qiyin joy hisob emas, SHARTNI
// YOZUVGA aylantirish; va yil bo'yicha teshiklar shu darsda ko'rinadi.
//
// SONLAR TEKSHIRILDI:
//   100 dan 20 foiz o'sish 120, keyin 20 foiz tushish 96 -- boshiga QAYTMAYDI
//   2 daraja (t bo'lingan 5) = 8  ->  t bo'lingan 5 = 3  ->  t = 15
//   konus hajmi silindrning UCHDAN BIRI (bir xil asos va balandlikda)
//   uch tanga: sakkiz natija, ikkita gerb uchta yo'l bilan  ->  3/8
//   o'tmas burchak  ->  skalyar ko'paytma MANFIY
//   o'rtacha 22,8 lekin mediana 4 (2, 3, 4, 5, 100 to'plamida)
//   blits: integral 0 dan 1 gacha x dx = 1/2;  log₃ 81 = 4;
//          kubning hajmi qirrasi 3 da 27;  (0;0;0) dan (2;3;6) gacha 7,
//          chunki 4 + 9 + 36 = 49;  (x⁴)' = 4x³;  kub ildiz 64 dan 4
//   audit: «uch marta ko'p» yozuvda QO'SHISH bilan berilgan
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_49',
  title: L('Matnli masalalar va yil yakuni', 'Текстовые задачи и итог года', 'Word problems and the year'),
}

const BLOCK = { label: 'B6', from: 43, to: 49, current: 49 }

// DTM REJIMI. Etalon 1.2-bandi.
const MODE = 'dtm'

// y = log₂ x
const LOG2 = (x) => Math.log(x) / Math.log(2)

// ============================================================
// SLAYD 1. XUK. Foiz o'sdi va tushdi.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sinov DTM', 'Пробный ДТМ', 'Mock exam'),
  title: L('Narx boshiga qaytdimi', 'Вернулась ли цена', 'Did the price come back'),
  // HERO satri o'ralmaydi: uch tilli gap 51 px kesilgan edi. Endi bu
  // FORMULA, uch tilda bir xil, va shartni ovoz aytadi.
  expr: '100 → +20% → −20% → ?',
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: L('qaytdi', 'вернулась', 'it came back'),
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: L('qaytmadi', 'не вернулась', 'it did not'),
    },
  ],
  probe: {
    question: L(
      'Boshlang\'ich narx 100 edi. Endi qancha?',
      'Начальная цена была 100. Сколько теперь?',
      'The starting price was 100. What is it now?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi masalalar boshlanadi.',
      'Твой ответ записан. Теперь начинаются задачи.',
      'Your answer is saved. Now the problems begin.',
    ),
    items: [
      { id: 'a', label: '96' },
      { id: 'b', label: '100' },
      { id: 'c', label: '104' },
      { id: 'd', label: '80' },
    ],
  },
  holds: [4200, 4200, 3600],
  audio: [
    A('mount', "Yilning oxirgi sinovi. Har masala boshqa blokdan olingan, va yakunda butun yil bo'yicha xarita chiqadi.", 'Последняя проверка года. Каждая задача из другого блока, а в конце выйдет карта по всему году.', 'The last check of the year. Each problem comes from a different block, and at the end a map of the whole year appears.'),
    A('r1', "Karim shunday deydi: yigirma foiz o'sdi, yigirma foiz tushdi, demak narx joyida.", 'Карим говорит так: выросла на двадцать процентов, упала на двадцать, значит цена на месте.', 'Karim says: up twenty percent, down twenty, so the price is where it was.'),
    A('r2', "Nargiza esa qaytmadi deydi.", 'А Наргиза говорит, что не вернулась.', 'Nargiza says it did not come back.'),
    A('ask', "Boshlang'ich narx yuz edi. Sizningcha endi qancha. Taxmin qiling.", 'Начальная цена была сто. Как думаешь, сколько теперь. Предположи.', 'The starting price was one hundred. What do you think it is now. Make a guess.'),
  ],
}

// ============================================================
// SLAYD 2. MASALA 1. Shartni yozuvga aylantirish (B2).
// ============================================================
const S2 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'word_model',
  eyebrow: L('Masala 1', 'Задача 1', 'Problem 1'),
  title: L('Qaysi yozuv shartga mos', 'Какая запись отвечает условию', 'Which record matches the problem'),
  expr: L('b soni a dan 3 marta KATTA', 'число b в 3 раза БОЛЬШЕ a', 'b is 3 times MORE than a'),
  goal: L('to\'g\'ri yozuvni ajratish', 'отделить верную запись', 'separate the right record'),
  rule: L(
    "Har bir yozuvni shart bilan solishtiramiz.",
    'Каждую запись сравниваем с условием.',
    'We compare each record with the problem.',
  ),
  pick: L('Qaysi yozuvni tekshiramiz?', 'Какую запись проверим?', 'Which record shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('marta bu qo\'shish', 'раза это сложение', 'times means adding'), value: '+' },
    { id: 'b', key: 'inB', name: L('marta bu ko\'paytirish', 'раза это умножение', 'times means multiplying'), value: '×' },
  ],
  points: [
    {
      id: 'q1', label: 'b = 3a', num: L('mos', 'подходит', 'fits'), step: 'calc', verdict: 'in',
      calc: L('a = 2 da b = 6', 'при a = 2 выходит b = 6', 'a = 2 gives b = 6'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: 'b = a + 3', num: L('mos emas', 'не подходит', 'does not fit'), step: 'calc', verdict: 'out',
      calc: L('a = 2 da b = 5', 'при a = 2 выходит b = 5', 'a = 2 gives b = 5'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: 'a = 3b', num: L('teskari', 'наоборот', 'reversed'), step: 'calc', verdict: 'out',
      calc: L('bunda a katta chiqadi', 'здесь больше выходит a', 'here a comes out larger'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q4', label: 'b − a = 3', num: L('mos emas', 'не подходит', 'does not fit'), step: 'calc', verdict: 'out',
      calc: L('bu ayirma, marta emas', 'это разность, а не раза', 'that is a difference, not times'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      '«3 marta katta» qanday yoziladi?',
      'Как записывается «в 3 раза больше»?',
      'How is "3 times more" written?',
    ),
    items: [
      { id: 'a', label: 'b = 3a', correct: true },
      { id: 'b', label: 'b = a + 3', hint: L("Bu «uchga ko'p», ya'ni ayirma. Marta ko'paytirish beradi.", 'Это «больше на три», то есть разность. Раза дают умножение.', 'That is "more by three", a difference. Times means multiplying.') },
      { id: 'c', label: 'a = 3b', hint: L("Bu teskari: bunda a katta bo'lib qoladi.", 'Это наоборот: здесь больше становится a.', 'That is reversed: here a becomes the larger one.') },
      { id: 'd', label: 'b = a / 3', hint: L("Bo'lish «uch marta kichik» degani.", 'Деление значит «в три раза меньше».', 'Division means "three times less".') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Birinchi masala. Bu yerda hisob yo'q: shartni yozuvga aylantirish kerak.", 'Первая задача. Здесь нет счёта: надо перевести условие в запись.', 'The first problem. No arithmetic here: the condition must become a record.'),
    A('mount', "Yozuvni o'zingiz tanlaysiz.", 'Запись выбираешь сам.', 'You choose the record yourself.'),
    A('calc', 'Tekshiramiz.', 'Проверяем.', 'We check.'),
    A('mark', "Mana natija. Faqat bitta yozuv shartga mos. Marta so'zi har doim ko'paytirishni beradi, ko'p yoki kam esa qo'shish va ayirishni. Tekshirishning eng tez usuli: kichik son qo'ying va sanang.", 'Вот результат. Только одна запись отвечает условию. Слово раза всегда даёт умножение, а больше или меньше на дают сложение и вычитание. Самый быстрый способ проверки: подставь маленькое число и посчитай.', 'Here is the result. Only one record matches. The word times always means multiplying, while more by or less by mean adding and subtracting. The fastest check: put in a small number and count.'),
  ],
}

// ============================================================
// SLAYD 3. MASALA 2. Ehtimollik chegarasi (B3).
// ============================================================
const S3 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'frequency_vs_prob',
  eyebrow: L('Masala 2', 'Задача 2', 'Problem 2'),
  title: L('Chegarani qo\'ying', 'Поставь границу', 'Place the boundary'),
  left: L(
    'Ehtimollik chegarasi',
    'Граница вероятности',
    'The bound on a probability',
  ),
  template: ['P (A)  ', { slot: 0 }, ' 1'],
  signs: ['≤', '>'],
  answer: '≤',
  checkNote: L(
    'ishonchli hodisada ehtimollik birga teng, undan katta bo\'lolmaydi',
    'у достоверного события вероятность равна единице, больше быть не может',
    'a certain event has probability one, and it cannot exceed that',
  ),
  wrongs: [
    { key: '>', hint: L("Birdan katta ehtimollik yo'q: hamma natijalar birga yig'iladi.", 'Вероятности больше единицы нет: все исходы складываются в единицу.', 'There is no probability above one: all outcomes add up to one.') },
  ],
  probe: {
    question: L(
      'Ehtimollik 1,2 bo\'lishi mumkinmi?',
      'Может ли вероятность быть 1,2?',
      'Can a probability be 1,2?',
    ),
    items: [
      { id: 'a', label: L('yo\'q, hech qachon', 'нет, никогда', 'no, never'), correct: true },
      { id: 'b', label: L('ha, ko\'p sinovda', 'да, при многих испытаниях', 'yes, in many trials'), hint: L("Chastota har xil bo'lishi mumkin, lekin u ham birdan oshmaydi.", 'Частота может быть разной, но и она не превышает единицу.', 'A frequency may vary, but it too never exceeds one.') },
      { id: 'c', label: L('ha, ishonchli hodisada', 'да, у достоверного', 'yes, for a certain event'), hint: L("Ishonchli hodisada aynan bir, undan ko'p emas.", 'У достоверного ровно единица, не больше.', 'A certain event has exactly one, no more.') },
      { id: 'd', label: L('foizda mumkin', 'в процентах можно', 'in percent it can'), hint: L("Foizda chegara yuz, va bir yuz foizga teng.", 'В процентах граница сто, а единица это сто процентов.', 'In percent the bound is one hundred, and one is one hundred percent.') },
    ],
  },
  audio: [
    A('mount', "Ikkinchi masala ehtimollik blokidan.", 'Вторая задача из блока вероятности.', 'The second problem comes from the probability block.'),
    A('write', "Chegarani qo'ying.", 'Поставь границу.', 'Place the boundary.'),
  ],
}

// ============================================================
// SLAYD 4. MASALA 3. Chizma: nechta yechim (B2).
// ============================================================
const S4 = {
  role: 'graph',
  section: 'practice',
  tag: 'check_by_point',
  drag: false,
  eyebrow: L('Masala 3', 'Задача 3', 'Problem 3'),
  title: L('Nechta yechim bor', 'Сколько решений', 'How many solutions'),
  chip: 'log₂ x = 1,5',
  graph: {
    fn: LOG2,
    xDomain: [0, 9],
    yDomain: [-3, 3.4],
    asymptote: 0,
    hline: 1.5,
    cross: 2.83,
    xTicks: [{ v: 1 }, { v: 2 }, { v: 4 }, { v: 8 }],
    yTicks: [{ v: 0 }, { v: 1.5, label: '1,5' }, { v: 3 }],
    drop: true,
    dropLabel: '≈ 2,8',
    height: 168,
  },
  probe: {
    question: L(
      'Nechta yechim bor?',
      'Сколько решений?',
      'How many solutions?',
    ),
    items: [
      { id: 'a', label: L('bitta', 'одно', 'one'), correct: true },
      { id: 'b', label: L('ikkita', 'два', 'two'), hint: L("Logarifm faqat o'sadi, demak har balandlikni BIR marta kesib o'tadi.", 'Логарифм только возрастает, значит каждую высоту пересекает ОДИН раз.', 'A logarithm only rises, so it meets each height ONCE.') },
      { id: 'c', label: L('bitta ham yo\'q', 'ни одного', 'none'), hint: L("Chiziq bir butun besh balandligiga chiqadi: kesishish bor.", 'Кривая доходит до высоты один и пять: пересечение есть.', 'The curve reaches the height one point five: there is a crossing.') },
      { id: 'd', label: L('cheksiz ko\'p', 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p yechim faqat ikki tomon bir xil bo'lganda bo'ladi.", 'Бесконечно много решений бывает, только когда обе части совпадают.', 'Infinitely many solutions happen only when both sides coincide.') },
    ],
  },
  holds: [4500, 5000],
  audio: [
    A('mount', "Uchinchi masala chizmada. Logarifm chizig'i o'sib boradi va hech qayerda burilmaydi.", 'Третья задача на чертеже. Линия логарифма возрастает и нигде не поворачивает.', 'The third problem is on a drawing. The logarithm rises and never turns.'),
    A('mount', "Shu sababli u har qanday gorizontal chiziqni bir marta kesib o'tadi, va yechim bitta.", 'Поэтому она пересекает любую горизонтальную прямую один раз, и решение одно.', 'So it meets any horizontal line exactly once, and there is one solution.'),
  ],
}

// Zanjir amallari: matnli masala va ehtimollik masalasining amallari.
const ACTIONS_49 = [
  { id: 'model', label: L('shartni yozuvga aylantirish', 'перевести условие в запись', 'turn the words into a record') },
  { id: 'base', label: L('bir asosga keltirish', 'привести к одному основанию', 'reduce to one base') },
  { id: 'solve', label: L('tenglamani yechish', 'решить уравнение', 'solve the equation') },
  { id: 'count', label: L('natijalarni sanash', 'посчитать исходы', 'count the outcomes') },
  { id: 'ratio', label: L('nisbatni tuzish', 'составить отношение', 'form the ratio') },
]

// ============================================================
// SLAYD 5. MASALA 4. Zanjir: ikki barobar o'sish (B2).
// ============================================================
const S5 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'word_model',
  noLine: true,
  eyebrow: L('Masala 4', 'Задача 4', 'Problem 4'),
  title: L('Qancha yil kerak', 'Сколько лет нужно', 'How many years'),
  start: L('100 dan 800 gacha, ×2', 'от 100 до 800, ×2', '100 to 800, ×2'),
  actions: ACTIONS_49,
  steps: [
    {
      action: 'model',
      to: '2^(t/5) = 8',
      wrongs: [
        { action: 'base', hint: L("Bir asosga keltirish uchun avval tenglama yozilishi kerak.", 'Чтобы приводить к одному основанию, сначала нужно уравнение.', 'To reduce to one base, the equation must be written first.') },
        { action: 'count', hint: L("Bu masalada natijalar sanalmaydi: bu o'sish masalasi.", 'В этой задаче исходы не считают: это задача о росте.', 'No outcomes are counted here: this is a growth problem.') },
        { action: 'ratio', hint: L("Nisbat ehtimollikda kerak bo'ladi.", 'Отношение понадобится в вероятности.', 'A ratio will be needed in probability.') },
      ],
    },
    {
      action: 'base',
      to: '2^(t/5) = 2³',
      wrongs: [
        { action: 'model', hint: L("Yozuv tayyor: ikki daraja t bo'lingan besh sakkizga teng.", 'Запись готова: два в степени t делить на пять равно восьми.', 'The record is ready: two to the t over five equals eight.') },
        { action: 'solve', hint: L("Yechishdan oldin asoslarni tenglashtirish kerak.", 'Прежде чем решать, нужно уравнять основания.', 'Before solving, the bases must match.') },
      ],
    },
    {
      action: 'solve',
      to: 't = 15',
      wrongs: [
        { action: 'base', hint: L("Asoslar allaqachon bir xil.", 'Основания уже одинаковы.', 'The bases already match.') },
        { action: 'count', hint: L("Sanash kerak emas, tenglama yechiladi.", 'Считать не нужно, решается уравнение.', 'No counting needed, an equation is solved.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['15', '3', '8', '40'],
    value: ['15'],
    label: L('yillar =', 'лет =', 'years ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '3', hint: L("Uch bu ikki barobar o'sishlar SONI, yillar esa besh barobar ko'p.", 'Три это ЧИСЛО удвоений, а лет в пять раз больше.', 'Three is the NUMBER of doublings, and the years are five times more.') },
      { key: '8', hint: L("Sakkiz bu necha barobar o'sgani, yillar emas.", 'Восемь это во сколько раз выросло, а не годы.', 'Eight is how many times it grew, not the years.') },
      { key: '40', hint: L("Beshga ko'paytirish o'rniga sakkizga ko'paytirilgan.", 'Умножено на восемь вместо пяти.', 'Multiplied by eight instead of five.') },
      { key: '*', hint: L("Uchta ikki barobar o'sish kerak, va har biri besh yil.", 'Нужны три удвоения, и каждое по пять лет.', 'Three doublings are needed, and each takes five years.') },
    ],
  },
  audio: [
    A('mount', "To'rtinchi masala. Ro'yxatda ehtimollik masalasining amallari ham bor.", 'Четвёртая задача. В списке есть действия и задачи о вероятности.', 'The fourth problem. The list also holds actions of the probability problem.'),
    A('step4', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 6. MASALA 5. Konus va silindr (B4).
// ============================================================
const S6 = {
  role: 'twoway',
  section: 'practice',
  tag: 'third_coefficient',
  eyebrow: L('Masala 5', 'Задача 5', 'Problem 5'),
  title: L('Konus silindrning qanchasi', 'Какая часть цилиндра конус', 'What part of the cylinder is the cone'),
  expr: L('bir xil asos va balandlik', 'одинаковые основание и высота', 'the same base and height'),
  need: L('hajmlar nisbati', 'отношение объёмов', 'the ratio of volumes'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('yarmi dedi', 'сказал: половина', 'said a half'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '1/2',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('uchdan biri dedi', 'сказала: треть', 'said a third'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '1/3',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['1/3', '1/2', '2/3', '1/4'],
    value: ['1/3'],
    label: L('nisbat =', 'отношение =', 'ratio ='),
    prompt: L('Nisbatni yozing', 'Запиши отношение', 'Write the ratio'),
    wrongs: [
      { key: '1/2', hint: L("Yarim bu tekislikdagi uchburchak va to'rtburchak nisbati. Hajmda koeffitsiyent boshqacha.", 'Половина это отношение треугольника и прямоугольника на плоскости. В объёме коэффициент другой.', 'A half is the ratio of a triangle to a rectangle in the plane. In volume the coefficient differs.') },
      { key: '2/3', hint: L("Uchdan ikki shar va silindr nisbatida uchraydi.", 'Две трети встречаются в отношении шара и цилиндра.', 'Two thirds appears in the ratio of a ball to a cylinder.') },
      { key: '1/4', hint: L("Chorak bu yerda paydo bo'lmaydi: koeffitsiyent uchdan bir.", 'Четверть здесь не появляется: коэффициент одна третья.', 'A quarter does not appear here: the coefficient is one third.') },
      { key: '*', hint: L("Konus va piramida hajmida uchdan bir koeffitsiyenti turadi.", 'В объёме конуса и пирамиды стоит коэффициент одна третья.', 'The volume of a cone and a pyramid carries the one third coefficient.') },
    ],
  },
  holds: [3200, 3600, 5200],
  audio: [
    A('mount', "Beshinchi masala stereometriya blokidan.", 'Пятая задача из блока стереометрии.', 'The fifth problem comes from the solid geometry block.'),
    A('p1', "Aziz yarim dedi. Bu tekislikdagi odatdan keladi: uchburchak to'rtburchakning yarmi.", 'Азиз сказал половина. Это привычка с плоскости: треугольник половина прямоугольника.', 'Aziz said a half. That habit comes from the plane: a triangle is half a rectangle.'),
    A('p2', "Dilnoza esa uchdan bir dedi. Fazoda koeffitsiyent boshqacha: konus va piramida hajmida uchdan bir turadi, va bu Kavalyeri natijasidan kelib chiqadi.", 'А Дилноза сказала треть. В пространстве коэффициент другой: в объёме конуса и пирамиды стоит одна третья, и это следует из результата Кавальери.', 'Dilnoza said a third. In space the coefficient differs: the volume of a cone and a pyramid carries one third, and that follows from the Cavalieri result.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 7. MASALA 6. Fazoda masofa (B5).
// ============================================================
const S7 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'dist_flat',
  eyebrow: L('Masala 6', 'Задача 6', 'Problem 6'),
  title: L('Qaysi nuqta yetti masofada', 'Какая точка на расстоянии семь', 'Which point is at distance seven'),
  expr: L('koordinata boshidan masofa', 'расстояние от начала координат', 'the distance from the origin'),
  goal: L('yetti masofani topish', 'найти расстояние семь', 'find the distance seven'),
  rule: L(
    "Uch kvadratni qo'shamiz.",
    'Складываем три квадрата.',
    'We add the three squares.',
  ),
  pick: L('Qaysi nuqtani tekshiramiz?', 'Какую точку проверим?', 'Which point shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('yig\'indi', 'сумма', 'the sum'), value: 'x + y + z' },
    { id: 'b', key: 'inB', name: L('kvadratlar', 'квадраты', 'the squares'), value: '√(x² + y² + z²)' },
  ],
  points: [
    {
      id: 'q1', label: '(2; 3; 6)', num: '7', step: 'calc', verdict: 'in',
      calc: '4 + 9 + 36 = 49',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: '(7; 0; 0)', num: '7', step: 'calc', verdict: 'in',
      calc: L('o\'qda yotadi', 'лежит на оси', 'lies on an axis'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: '(1; 2; 4)', num: '≈ 4,6', step: 'calc', verdict: 'out',
      calc: '1 + 4 + 16 = 21',
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q4', label: '(3; 3; 1)', num: '≈ 4,4', step: 'calc', verdict: 'out',
      calc: '9 + 9 + 1 = 19',
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      'Masofa qanday topiladi?',
      'Как находят расстояние?',
      'How is the distance found?',
    ),
    items: [
      { id: 'b', label: L('kvadratlar yig\'indisidan ildiz', 'корень из суммы квадратов', 'the root of the sum of squares'), correct: true },
      { id: 'a', label: L('koordinatalar yig\'indisi', 'сумма координат', 'the sum of coordinates'), hint: L("Bir, ikki, to'rt nuqtasida yig'indi yetti, masofa esa to'rt butun olti.", 'В точке один, два, четыре сумма семь, а расстояние четыре и шесть.', 'At one, two, four the sum is seven, but the distance is four point six.') },
      { id: 'c', label: L('eng katta koordinata', 'наибольшая координата', 'the largest coordinate'), hint: L("Uch, uch, bir nuqtasida eng kattasi uch, masofa esa to'rt butun to'rt.", 'В точке три, три, один наибольшая три, а расстояние четыре и четыре.', 'At three, three, one the largest is three, but the distance is four point four.') },
      { id: 'd', label: L('koordinatalar ko\'paytmasi', 'произведение координат', 'the product of coordinates'), hint: L("Nolga teng koordinata bo'lsa ko'paytma nol bo'lardi, masofa esa yo'q emas.", 'Если координата нулевая, произведение стало бы нулём, а расстояние не исчезает.', 'With a zero coordinate the product would vanish, but the distance does not.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Oltinchi masala fazo blokidan.", 'Шестая задача из блока пространства.', 'The sixth problem comes from the space block.'),
    A('mount', "Nuqtani o'zingiz tanlaysiz.", 'Точку выбираешь сам.', 'You choose the point yourself.'),
    A('calc', 'Hisoblaymiz.', 'Считаем.', 'We compute.'),
    A('mark', "Mana natija. Ikkita nuqta yetti masofada: bittasi o'qda yotadi, ikkinchisi esa oktanta ichida. Diqqat: bir, ikki, to'rt nuqtasida koordinatalar yig'indisi ham yetti, lekin masofa boshqa. Demak masofani yig'indi bilan hisoblab bo'lmaydi: kvadratlar kerak.", 'Вот результат. Две точки на расстоянии семь: одна лежит на оси, другая внутри октанта. Внимание: в точке один, два, четыре сумма координат тоже семь, а расстояние другое. Значит расстояние суммой не считают: нужны квадраты.', 'Here is the result. Two points sit at distance seven: one on an axis, the other inside an octant. Careful: at one, two, four the sum of coordinates is also seven, but the distance differs. So a distance is not computed by a sum: the squares are needed.'),
  ],
}

// ============================================================
// SLAYD 8. MASALA 7. Mustaqil: uch tanga (B3).
// ============================================================
const S8 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'order_matters',
  noLine: true,
  solo: true,
  eyebrow: L('Masala 7', 'Задача 7', 'Problem 7'),
  title: L('Imtihondagidek', 'Как на экзамене', 'As on the exam'),
  start: L('uch tanga, aynan ikki gerb', 'три монеты, ровно два герба', 'three coins, exactly two heads'),
  actions: ACTIONS_49,
  hint: L(
    "Har tanga ikki holatda, va tartib muhim.",
    'Каждая монета в двух состояниях, и порядок важен.',
    'Each coin has two states, and the order matters.',
  ),
  steps: [
    {
      action: 'count',
      to: '8',
      wrongs: [
        { action: 'ratio', hint: L("Nisbat uchun avval ikki son kerak.", 'Для отношения сначала нужны два числа.', 'For a ratio two numbers are needed first.') },
        { action: 'model', hint: L("Tenglama kerak emas: natijalar sanaladi.", 'Уравнение не нужно: считают исходы.', 'No equation needed: the outcomes are counted.') },
        { action: 'base', hint: L("Asoslar bu masalada yo'q.", 'Оснований в этой задаче нет.', 'There are no bases in this problem.') },
      ],
    },
    {
      action: 'ratio',
      to: '3 / 8',
      wrongs: [
        { action: 'count', hint: L("Natijalar sanaldi: sakkizta.", 'Исходы посчитаны: восемь.', 'The outcomes are counted: eight.') },
        { action: 'solve', hint: L("Yechish kerak emas, nisbat tuziladi.", 'Решать не нужно, составляется отношение.', 'No solving needed, a ratio is formed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['3/8', '1/8', '1/2', '2/8'],
    value: ['3/8'],
    label: 'P =',
    prompt: L('Ehtimollikni yozing', 'Запиши вероятность', 'Write the probability'),
    wrongs: [
      { key: '1/8', hint: L("Bu BITTA natijaning ehtimolligi. Ikki gerb uchta yo'l bilan chiqadi.", 'Это вероятность ОДНОГО исхода. Два герба выходят тремя способами.', 'That is the probability of ONE outcome. Two heads come three ways.') },
      { key: '1/2', hint: L("Yarim bu bitta tanga uchun.", 'Половина это для одной монеты.', 'A half is for one coin.') },
      { key: '2/8', hint: L("Qulay natijalar SONI ikki emas, uch: gerb qaysi tangada tushmaganini sanang.", 'ЧИСЛО благоприятных исходов не два, а три: посчитай, на какой монете герба нет.', 'The NUMBER of favourable outcomes is three, not two: count which coin lacks the head.') },
      { key: '*', hint: L("Sakkizta natijadan uchtasida aynan ikki gerb bor.", 'Из восьми исходов ровно в трёх есть два герба.', 'Of eight outcomes exactly three have two heads.') },
    ],
  },
  audio: [
    A('mount', "Yettinchi masala mustaqil, imtihondagidek.", 'Седьмая задача самостоятельная, как на экзамене.', 'The seventh problem is on your own, as on the exam.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 9. MASALA 8. O'tmas burchak (B5).
// ============================================================
const S9 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'dot_sign',
  eyebrow: L('Masala 8', 'Задача 8', 'Problem 8'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Burchak O\'TMAS',
    'Угол ТУПОЙ',
    'The angle is OBTUSE',
  ),
  template: [L('skalyar ko\'paytma  ', 'скалярное произведение  ', 'the dot product  '), { slot: 0 }],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    'o\'tmas burchakning kosinusi manfiy',
    'у тупого угла косинус отрицателен',
    'an obtuse angle has a negative cosine',
  ),
  wrongs: [
    { key: '+', hint: L("Musbat ko'paytma o'tkir burchakni beradi.", 'Положительное произведение даёт острый угол.', 'A positive product means an acute angle.') },
  ],
  probe: {
    question: L(
      'Skalyar ko\'paytma nol bo\'lsa?',
      'Если скалярное произведение ноль?',
      'If the dot product is zero?',
    ),
    items: [
      { id: 'a', label: L('perpendikulyar', 'перпендикулярны', 'perpendicular'), correct: true },
      { id: 'b', label: L('parallel', 'параллельны', 'parallel'), hint: L("Parallelda ko'paytma eng katta bo'ladi, nol emas.", 'При параллельности произведение наибольшее, а не ноль.', 'When parallel the product is largest, not zero.') },
      { id: 'c', label: L('teng', 'равны', 'equal'), hint: L("Tenglik uzunlik va yo'nalish haqida, ko'paytma esa burchak haqida.", 'Равенство о длине и направлении, а произведение об угле.', 'Equality is about length and direction, the product is about the angle.') },
      { id: 'd', label: L('nol vektor', 'нулевой вектор', 'the zero vector'), hint: L("Nol vektor ham nol beradi, lekin asosiy holat perpendikulyarlik.", 'Нулевой вектор тоже даёт ноль, но основной случай это перпендикулярность.', 'The zero vector gives zero too, but the main case is perpendicularity.') },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi masala. Burchak o'tmas, ya'ni to'qsondan katta.", 'Восьмая задача. Угол тупой, то есть больше девяноста.', 'The eighth problem. The angle is obtuse, more than ninety.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 10. MASALA 9. Teskari masala: modelni yig'ish.
// ============================================================
const S10 = {
  role: 'build',
  section: 'practice',
  led: 'student',
  tag: 'word_model',
  right: '2/2',
  eyebrow: L('Masala 9', 'Задача 9', 'Problem 9'),
  title: L('Modelni yig\'ing', 'Собери модель', 'Build the model'),
  targetLabel: L('Shart', 'Условие', 'The condition'),
  targetValue: L('narx 15 foizga tushdi', 'цена упала на 15 процентов', 'the price fell by 15 percent'),
  tasks: [
    {
      prompt: L('Yangi narxni yozing', 'Запиши новую цену', 'Write the new price'),
      template: [L('yangi = ', 'новая = ', 'new = '), { slot: 0 }, ' · ', { slot: 1 }],
      parts: ['0,85', '1,15', 'eski', '15'],
      answer: ['0,85', 'eski'],
      doneLabel: '0,85 · eski',
      wrongs: [
        { key: '1,15|eski', hint: L("Tushish koeffitsiyentni KICHRAYTIRADI: bir minus nol butun o'n besh.", 'Падение УМЕНЬШАЕТ коэффициент: один минус ноль целых пятнадцать.', 'A fall LOWERS the coefficient: one minus zero point one five.') },
        { key: '0,85|15', hint: L("Ko'paytuvchi eski NARX, foiz emas.", 'Множитель это старая ЦЕНА, а не процент.', 'The factor is the old PRICE, not the percent.') },
        { key: '*', hint: L("Foizga tushish nol butun sakson beshga ko'paytirish bilan bir xil.", 'Падение на процент это то же, что умножение на ноль целых восемьдесят пять.', 'A percent fall is the same as multiplying by zero point eight five.') },
      ],
    },
    {
      prompt: L('Ikki marta tushsa?', 'Если упала дважды?', 'If it fell twice?'),
      template: [L('yangi = ', 'новая = ', 'new = '), { slot: 0 }, ' · ', L('eski', 'старая', 'old')],
      parts: ['0,85²', '0,7', '1,7', '0,85'],
      answer: ['0,85²'],
      doneLabel: '0,85² · eski',
      wrongs: [
        { key: '0,7', hint: L("Foizlar qo'shilmaydi: ikkinchi tushish YANGI narxdan olinadi.", 'Проценты не складываются: второе падение считается от НОВОЙ цены.', 'Percents do not add: the second fall is taken from the NEW price.') },
        { key: '1,7', hint: L("Ikkiga ko'paytirish narxni oshirardi, tushish esa kamaytiradi.", 'Умножение на два подняло бы цену, а падение её снижает.', 'Multiplying by two would raise the price, and a fall lowers it.') },
        { key: '*', hint: L("Bir xil ko'paytuvchi ikki marta ishlaydi, ya'ni kvadrat.", 'Один и тот же множитель работает дважды, то есть квадрат.', 'The same factor works twice, that is a square.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'qqizinchi masala teskari: modelni o'zingiz yig'asiz.", 'Девятая задача обратная: модель собираешь сам.', 'The ninth problem is reverse: you build the model.'),
    A('built1', "Endi ikkinchisi: tushish ikki marta.", 'Теперь второе: падение дважды.', 'Now the second: the fall happens twice.'),
  ],
}

// ============================================================
// SLAYD 11. MASALA 10. O'rtacha va mediana (B3).
// ============================================================
const S11 = {
  role: 'twoway',
  section: 'practice',
  tag: 'mean_vs_median',
  eyebrow: L('Masala 10', 'Задача 10', 'Problem 10'),
  title: L('Qaysi son to\'plamni tasvirlaydi', 'Какое число описывает набор', 'Which number describes the set'),
  expr: '2,  3,  4,  5,  100',
  need: L('tipik qiymat', 'типичное значение', 'the typical value'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('o\'rtachani oldi', 'взял среднее', 'took the mean'),
      point: {
        label: L('uning soni', 'его число', 'his number'),
        calc: '22,8',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('medianani oldi', 'взяла медиану', 'took the median'),
      point: {
        label: L('uning soni', 'её число', 'her number'),
        calc: '4',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['4', '22,8', '100', '5'],
    value: ['4'],
    label: L('tipik qiymat =', 'типичное значение =', 'typical value ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '22,8', hint: L("O'rtacha yuzni ham hisobga oladi, va u to'plamning hech bir soniga o'xshamaydi.", 'Среднее учитывает и сотню, и оно не похоже ни на одно число набора.', 'The mean counts the hundred too, and it resembles no number in the set.') },
      { key: '100', hint: L("Yuz bu chetdagi qiymat: to'plamda bittagina shunday son bor.", 'Сто это выброс: в наборе всего одно такое число.', 'One hundred is the outlier: the set has only one such number.') },
      { key: '5', hint: L("Besh o'rtada emas: uning chapida uchta, o'ngida bitta son bor.", 'Пять не в середине: слева от него три числа, справа одно.', 'Five is not in the middle: three numbers stand left of it and one right.') },
      { key: '*', hint: L("Tartiblangan to'plamning o'rtasida turgan son medianadir.", 'Число, стоящее в середине упорядоченного набора, и есть медиана.', 'The number standing in the middle of the ordered set is the median.') },
    ],
  },
  holds: [3200, 3600, 5500],
  audio: [
    A('mount', "O'ninchi masala, oxirgisi. Statistika blokidan.", 'Десятая задача, последняя. Из блока статистики.', 'The tenth problem, the last. From the statistics block.'),
    A('p1', "Aziz o'rtachani oldi va yigirma ikki butun sakkiz chiqardi.", 'Азиз взял среднее и получил двадцать два и восемь.', 'Aziz took the mean and got twenty two point eight.'),
    A('p2', "Dilnoza esa medianani oldi. To'plamda bitta chetdagi qiymat bor, va aynan u o'rtachani tortib ketadi. Mediana chetdagi qiymatga sezgir emas, shuning uchun bunday to'plamni u yaxshiroq tasvirlaydi.", 'А Дилноза взяла медиану. В набоpе есть один выброс, и именно он тянет среднее. Медиана к выбросу не чувствительна, поэтому такой набор она описывает лучше.', 'Dilnoza took the median. The set holds one outlier, and it is what drags the mean. The median is not sensitive to an outlier, so it describes such a set better.'),
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
      id: 'b1', tag: 'accumulation', ask: true, cols: 2,
      done: '1/2',
      prompt: L('0 dan 1 gacha x integrali?', 'Интеграл x от 0 до 1?', 'The integral of x from 0 to 1?'),
      items: [
        { id: 'a', label: '1/2', correct: true },
        { id: 'b', label: '1', hint: L("Ikkiga bo'linmagan: boshlang'ich funksiya iks kvadrat bo'lingan ikki.", 'Не поделено на два: первообразная икс квадрат делить на два.', 'Not halved: the antiderivative is x squared over two.') },
        { id: 'c', label: '0', hint: L("Funksiya oraliqda musbat, demak integral ham musbat.", 'Функция на промежутке положительна, значит и интеграл.', 'The function is positive there, so the integral is too.') },
        { id: 'd', label: '2', hint: L("Bo'lish o'rniga ko'paytirilgan.", 'Вместо деления умножено.', 'Multiplied instead of divided.') },
      ],
    },
    {
      id: 'b2', tag: 'same_base', ask: true, cols: 2,
      done: '4',
      prompt: 'log₃ 81',
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '3', hint: L("Uch daraja uch yigirma yetti, sakson bir esa keyingisi.", 'Три в третьей двадцать семь, а восемьдесят один следующая.', 'Three cubed is twenty seven, and eighty one is the next.') },
        { id: 'c', label: '27', hint: L("Yigirma yetti bu daraja qiymati, ko'rsatkich emas.", 'Двадцать семь это значение степени, а не показатель.', 'Twenty seven is the value of the power, not the exponent.') },
        { id: 'd', label: '9', hint: L("To'qqiz uchning kvadrati, sakson bir esa to'rtinchi darajasi.", 'Девять это три в квадрате, а восемьдесят один в четвёртой.', 'Nine is three squared, eighty one is the fourth power.') },
      ],
    },
    {
      id: 'b3', tag: 'frequency_vs_prob', ask: true, cols: 2,
      done: '1/6',
      prompt: L('Kubikda olti tushish ehtimolligi?', 'Вероятность выпадения шести на кубике?', 'The chance of a six on a die?'),
      items: [
        { id: 'a', label: '1/6', correct: true },
        { id: 'b', label: '1/2', hint: L("Yarim bu tanga uchun, kubikda esa olti yoq bor.", 'Половина это для монеты, а у кубика шесть граней.', 'A half is for a coin, and a die has six faces.') },
        { id: 'c', label: '6', hint: L("Ehtimollik birdan katta bo'lolmaydi.", 'Вероятность не может быть больше единицы.', 'A probability cannot exceed one.') },
        { id: 'd', label: '1/36', hint: L("Bir bo'lingan o'ttiz olti IKKI kubik uchun.", 'Одна тридцать шестая для ДВУХ кубиков.', 'One thirty sixth is for TWO dice.') },
      ],
    },
    {
      id: 'b4', tag: 'axis_matters', ask: true, cols: 2,
      done: '27',
      prompt: L('Qirrasi 3 bo\'lgan kubning hajmi?', 'Объём куба с ребром 3?', 'The volume of a cube with edge 3?'),
      items: [
        { id: 'a', label: '27', correct: true },
        { id: 'b', label: '9', hint: L("To'qqiz bu bitta yoqning yuzasi.", 'Девять это площадь одной грани.', 'Nine is the area of one face.') },
        { id: 'c', label: '54', hint: L("Ellik to'rt bu to'liq sirt yuzasi.", 'Пятьдесят четыре это полная поверхность.', 'Fifty four is the total surface.') },
        { id: 'd', label: '12', hint: L("O'n ikki bu qirralar soni.", 'Двенадцать это число рёбер.', 'Twelve is the number of edges.') },
      ],
    },
    {
      id: 'b5', tag: 'dist_flat', ask: true, cols: 2,
      done: '7',
      prompt: L('Boshdan (2; 3; 6) gacha masofa?', 'Расстояние от начала до (2; 3; 6)?', 'The distance from the origin to (2; 3; 6)?'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '11', hint: L("O'n bir bu koordinatalar yig'indisi, masofa esa kvadratlardan olinadi.", 'Одиннадцать это сумма координат, а расстояние берут из квадратов.', 'Eleven is the sum of coordinates, a distance comes from the squares.') },
        { id: 'c', label: '6', hint: L("Olti bu eng katta koordinata.", 'Шесть это наибольшая координата.', 'Six is the largest coordinate.') },
        { id: 'd', label: '49', hint: L("Qirq to'qqiz bu kvadratlar yig'indisi, ildiz olinmagan.", 'Сорок девять это сумма квадратов, корень не взят.', 'Forty nine is the sum of squares, the root is not taken.') },
      ],
    },
    {
      id: 'b6', tag: 'power_vs_exp', ask: true, cols: 2,
      done: '4x³',
      prompt: L('(x⁴) hosilasi?', 'Производная (x⁴)?', 'The derivative of (x⁴)?'),
      items: [
        { id: 'a', label: '4x³', correct: true },
        { id: 'b', label: '4x⁴', hint: L("Ko'rsatkich bittaga kamayadi.", 'Показатель уменьшается на единицу.', 'The exponent drops by one.') },
        { id: 'c', label: 'x³', hint: L("Ko'paytuvchi tushib qolgan.", 'Потерян множитель.', 'The factor is lost.') },
        { id: 'd', label: '3x⁴', hint: L("Oldiga eski ko'rsatkich chiqadi, ya'ni to'rt.", 'Вперёд выходит старый показатель, то есть четыре.', 'The old exponent comes in front, that is four.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, va har biri boshqa blokdan. Faqat shu ekran natijaga kiradi.", 'Блиц. Шесть вопросов, каждый из другого блока. Только этот экран идёт в результат.', 'Quick round. Six questions, each from a different block. Only this screen counts.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Shart yozuvga xato aylantirilgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'word_model',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: L('kitob daftardan 3 marta qimmat', 'книга в 3 раза дороже тетради', 'the book costs 3 times the notebook') },
    { id: 'r2', text: L('birgalikda 20 ming', 'вместе 20 тысяч', 'together 20 thousand') },
    { id: 'r3', text: 'd + (d + 3) = 20' },
    { id: 'r4', text: 'd = 8,5' },
    { id: 'r5', text: L('javob: daftar 8,5 ming', 'ответ: тетрадь 8,5 тысяч', 'answer: the notebook is 8,5 thousand') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Bu ham shart.", 'Это тоже условие.', 'This is the problem too.'),
    r4: L("Yozuv bo'yicha hisob to'g'ri: o'n yetti bo'lingan ikki sakkiz butun besh.", 'По записи счёт верен: семнадцать делить на два восемь и пять.', 'For that record the arithmetic is right: seventeen over two is eight point five.'),
    r5: L("Oxirgi satr faqat ko'chirma.", 'Последняя строка только перепись.', 'The last line is just a copy.'),
  },
  proofPoint: L('«marta» ko\'paytirish beradi', '«раза» дают умножение', '"times" means multiplying'),
  proof: L(
    "Uch marta qimmat degani uch bilan KO'PAYTIRISH, uch qo'shish emas. To'g'ri yozuv d plyus uch d yigirmaga teng, ya'ni to'rt d yigirma va d beshga teng. Tekshiruv: besh va o'n besh, birgalikda yigirma, va o'n besh besh dan uch marta katta.",
    'В три раза дороже значит УМНОЖИТЬ на три, а не прибавить три. Верная запись d плюс три d равно двадцати, то есть четыре d равно двадцати и d равно пяти. Проверка: пять и пятнадцать, вместе двадцать, и пятнадцать втрое больше пяти.',
    'Three times more expensive means MULTIPLY by three, not add three. The right record is d plus three d equals twenty, so four d is twenty and d is five. The check: five and fifteen, together twenty, and fifteen is three times five.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('marta qo\'shish bilan yozilgan', '«раза» записано сложением', '"times" was written as adding'), correct: true },
      { id: 'b', label: L('arifmetikada xato', 'ошибка в арифметике', 'an arithmetic slip'), hint: L("Arifmetika to'g'ri: yozuv bo'yicha sakkiz butun besh chiqadi.", 'Арифметика верна: по записи выходит восемь и пять.', 'The arithmetic is right: that record gives eight point five.') },
      { id: 'c', label: L('shart xato', 'условие неверно', 'the problem is wrong'), hint: L("Shart aniq: uch marta qimmat.", 'Условие ясное: в три раза дороже.', 'The problem is clear: three times more expensive.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Tekshiruv: sakkiz butun besh va o'n bir butun besh uch marta farq qilmaydi.", 'Проверка: восемь и пять и одиннадцать и пять различаются не втрое.', 'The check: eight point five and eleven point five do not differ threefold.') },
    ],
  },
  audio: [
    A('mount', "Masalalar tugadi. Endi boshqaning yechimiga qaraymiz.", 'Задачи закончились. Теперь посмотрим на чужое решение.', 'The problems are done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: hisob to'g'ri bajarilgan. Xato yozuvda.", 'Внимание: счёт выполнен верно. Ошибка в записи.', 'Careful: the arithmetic is done right. The error is in the record.'),
    A('proof', "Qarang: shartda uch MARTA qimmat deyilgan, yozuvda esa uch QO'SHILGAN. Bu ikki xil narsa: marta ko'paytirishni beradi. To'g'ri yozuvda daftar besh, kitob esa o'n besh ming bo'ladi, va ularning yig'indisi yigirma. Tekshiruv esa oson: javobni shartga qaytaring va o'qing, uch marta chiqadimi.", 'Смотри: в условии сказано в три РАЗА дороже, а в записи три ПРИБАВЛЕНО. Это разные вещи: раза дают умножение. В верной записи тетрадь пять, а книга пятнадцать тысяч, и вместе двадцать. А проверка простая: верни ответ в условие и прочитай, выходит ли втрое.', 'Look: the problem says three TIMES more expensive, and the record ADDS three. Those differ: times means multiplying. In the right record the notebook is five and the book fifteen thousand, and together twenty. The check is easy: put the answer back into the problem and read whether it comes out threefold.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: tekshiruvni yig'ish.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'check_by_point',
  right: '2/2',
  eyebrow: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  title: L('Tekshiruvni yig\'ing', 'Собери проверку', 'Build the check'),
  targetLabel: L('Javob', 'Ответ', 'The answer'),
  targetValue: L('daftar 5, kitob 15', 'тетрадь 5, книга 15', 'notebook 5, book 15'),
  tasks: [
    {
      prompt: L('Birinchi shartni tekshiring', 'Проверь первое условие', 'Check the first condition'),
      template: ['15 ', { slot: 0 }, ' 5 = 3'],
      parts: [':', '−', '+', '·'],
      answer: [':'],
      doneLabel: '15 : 5 = 3',
      wrongs: [
        { key: '−', hint: L("Ayirma o'nni beradi, marta esa bo'lish bilan tekshiriladi.", 'Разность даёт десять, а раза проверяют делением.', 'The difference gives ten, and times is checked by dividing.') },
        { key: '+', hint: L("Qo'shish yigirmani beradi, bu esa ikkinchi shart.", 'Сложение даёт двадцать, а это второе условие.', 'Adding gives twenty, and that is the second condition.') },
        { key: '*', hint: L("Necha marta ekanini bo'lish ko'rsatadi.", 'Во сколько раз показывает деление.', 'How many times is shown by division.') },
      ],
    },
    {
      prompt: L('Ikkinchi shartni tekshiring', 'Проверь второе условие', 'Check the second condition'),
      template: ['15 ', { slot: 0 }, ' 5 = 20'],
      parts: ['+', ':', '−', '·'],
      answer: ['+'],
      doneLabel: '15 + 5 = 20',
      wrongs: [
        { key: ':', hint: L("Bo'lish uchni beradi, bu birinchi shart edi.", 'Деление даёт три, это было первое условие.', 'Division gives three, that was the first condition.') },
        { key: '−', hint: L("Ayirma o'nni beradi, shartda esa yigirma.", 'Разность даёт десять, а в условии двадцать.', 'The difference gives ten, and the problem says twenty.') },
        { key: '*', hint: L("Birgalikda degani qo'shish.", '«Вместе» значит сложение.', '"Together" means adding.') },
      ],
    },
  ],
  audio: [
    A('mount', "Oxirgi topshiriq: javob berilgan, tekshiruvni yig'ish kerak. Imtihonda aynan shu ish vaqtni tejaydi.", 'Последнее задание: ответ дан, нужно собрать проверку. На экзамене именно это экономит время.', 'The last task: the answer is given, the check must be built. On the exam this is what saves time.'),
    A('built1', "Endi ikkinchi shart.", 'Теперь второе условие.', 'Now the second condition.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN. Yil bo'yicha xarita.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'word_model',
  gapMap: 6,
  eyebrow: L('Yil yakuni', 'Итог года', 'The year'),
  title: L('Yil bo\'yicha xarita', 'Карта по всему году', 'A map of the whole year'),
  law: L('shartni yozuvga aylantirish', 'перевод условия в запись', 'turning words into a record'),
  ruleLines: [
    L("«marta» ko'paytirish, «ko'p» qo'shish", '«раза» умножение, «больше на» сложение', '"times" multiplies, "more by" adds'),
    L('foizlar qo\'shilmaydi', 'проценты не складываются', 'percents do not add'),
    L('javobni shartga qaytarib tekshirish', 'проверка возвратом в условие', 'check by returning to the problem'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('20 foiz o\'sdi va tushdi', 'выросла и упала на 20', 'up and down by 20'),
      right: '96',
      map: { a: '96', b: '100', c: '104', d: '80' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '100 → 120 → 96',
  },
  levels: {
    full: L('Yil bo\'yicha teshik ko\'rinmadi', 'По году дырок не видно', 'No gaps show for the year'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Xaritada ko\'rsatilgan darslarga qayting', 'Вернись к урокам, указанным в карте', 'Go back to the lessons named in the map'),
  },
  probe: {
    question: L(
      'Matnli masalada eng qiyin joy qaysi?',
      'Что в текстовой задаче самое трудное?',
      'What is the hardest part of a word problem?',
    ),
    items: [
      { id: 'a', label: L('shartni yozuvga aylantirish', 'перевод условия в запись', 'turning the words into a record'), correct: true },
      { id: 'b', label: L('hisoblash', 'вычисление', 'the computation'), hint: L("Hisob odatda oddiy: bu darsda ham hisoblar bir qadamli edi.", 'Счёт обычно простой: и в этом уроке вычисления были в один шаг.', 'The arithmetic is usually simple: in this lesson too it was one step.') },
      { id: 'c', label: L('javobni yozish', 'запись ответа', 'writing the answer'), hint: L("Javob yozuvdan kelib chiqadi: yozuv to'g'ri bo'lsa, javob ham to'g'ri.", 'Ответ следует из записи: если запись верна, верен и ответ.', 'The answer follows from the record: if the record is right, so is the answer.') },
      { id: 'd', label: L('birliklarni tanlash', 'выбор единиц', 'choosing the units'), hint: L("Birliklar muhim, lekin asosiy xato yozuvda tug'iladi.", 'Единицы важны, но основная ошибка рождается в записи.', 'Units matter, but the main error is born in the record.') },
    ],
  },
  sheetTitle: L('Matnli masalalar · shpargalka', 'Текстовые задачи · шпаргалка', 'Word problems · cheat sheet'),
  sheetSrc: L('11-sinf · 49-dars', '11 класс · урок 49', 'Grade 11 · lesson 49'),
  lifehack: L(
    "Javobni shartga qaytarib o'qing: gap rost chiqsa, yozuv to'g'ri edi.",
    'Верни ответ в условие и прочитай: если фраза сходится, запись была верной.',
    'Put the answer back into the problem and read it: if the sentence holds, the record was right.',
  ),
  holds: [3200, 5000, 7000],
  audio: [
    A('mount', "Sinov tugadi, va bu bilan takrorlash bloki yopiladi.", 'Проверка закончена, и на этом блок повторения закрывается.', 'The check is over, and with it the revision block closes.'),
    A('p1', "Mana taxminingiz va mana javob. Narx to'qson oltiga tushdi: foizlar qo'shilmaydi, ular ko'paytiriladi.", 'Вот твоя догадка и вот ответ. Цена стала девяносто шесть: проценты не складываются, они умножаются.', 'Here is your guess and here is the answer. The price became ninety six: percents do not add, they multiply.'),
    A('rule', "O'ng tomonda butun yil bo'yicha kamchiliklar xaritasi. Har satr bitta blok va bitta joyni aytadi, va o'sha darsga qaytish kerak. Matnli masalada esa qoida bitta: eng qiyin joy hisob emas, shartni yozuvga aylantirish. Marta so'zi ko'paytirishni beradi, ko'p esa qo'shishni, foizlar esa qo'shilmaydi. Va oxirida javobni shartga qaytarib o'qish kerak.", 'Справа карта пробелов по всему году. Каждая строка называет блок и место, и к тому уроку надо вернуться. А в текстовой задаче правило одно: самое трудное не счёт, а перевод условия в запись. Слово раза даёт умножение, больше на сложение, а проценты не складываются. И в конце ответ надо вернуть в условие и прочитать.', 'On the right is the gap map for the whole year. Each line names a block and a spot, and that is the lesson to return to. In a word problem the rule is one: the hardest part is not the arithmetic but turning the words into a record. The word times multiplies, more by adds, and percents do not add. And at the end the answer goes back into the problem to be read.'),
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
