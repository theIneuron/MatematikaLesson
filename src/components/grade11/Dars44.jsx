// ============================================================================
// 11-sinf, Dars 44. HOSILALAR JADVALI VA QOIDALAR.
//
// B6 blokining ikkinchi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SecantBoard` (`sign` rejimi, hosila grafigi bilan), `TransformChain`
//   darslik:  1-qism, 24-33-betlar (7-12 soatlar): hosilani hisoblash
//             qoidalari, hosilalar jadvali 27-bet, murakkab funksiya 30-bet
//
// DARSNING BITTA GAPI: hosilani har safar limit bilan izlash shart emas --
// jadval va besh qoida bor; lekin ko'paytma, bo'linma va murakkab funksiya
// O'Z qoidasini talab qiladi.
//
// SONLAR TEKSHIRILDI:
//   (2x + 4)(3x + 1) = 6x² + 14x + 4  ->  hosila 12x + 14      [darslik 25-bet]
//   hosilalar ko'paytmasi 2 karra 3 = 6 -- XATO javob, xuk shunga qurilgan
//   (x⁵)' = 5x⁴;  (2^x)' = 2^x ln2;  (e^x)' = e^x;  (ln x)' = 1/x  [27-bet jadval]
//   (5x³)' = 15x²;  (x³ + 7)' = 3x²
//   (−5x²)' = −10x, ya'ni ishora MANFIY
//   (2x + 5)³ hosilasi: 3(2x + 5)² karra 2 = 6(2x + 5)²
//   ((x + 1)/(x − 2))' = ((x − 2) − (x + 1)) / (x − 2)² = −3 / (x − 2)²   [25-bet]
//   blits: (x⁹)' = 9x⁸;  (12)' = 0;  (x e^x)' = e^x(1 + x);
//          (1/x)' = −1/x²;  (sin 5x)' = 5 cos 5x;  (cos x)' = −sin x
//   audit: (3x − 2)⁵ hosilasi 15(3x − 2)⁴, ichki uchlik tushib qolgan
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_44',
  title: L('Hosilalar jadvali va qoidalar', 'Таблица производных и правила', 'The table and the rules'),
}

const BLOCK = { label: 'B6', from: 43, to: 49, current: 44 }

// 43-darsning parabolasi bu darsda HOSILA bo'lib qaytadi.
const SQ = (x) => x * x

// ============================================================
// SLAYD 1. XUK. Ko'paytmaning hosilasi: ikki javob (darslik 25-bet).
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Hosilalar jadvali', 'Таблица производных', 'The table of derivatives'),
  title: L("Ko'paytmaning hosilasi", 'Производная произведения', 'The derivative of a product'),
  expr: '(2x + 4)(3x + 1)',
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: '6',
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: '12x + 14',
    },
  ],
  probe: {
    question: L(
      "Ko'paytmaning hosilasi qaysi?",
      'Какая из записей производная произведения?',
      'Which record is the derivative of the product?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi tekshiramiz.',
      'Твой ответ записан. Сейчас проверим.',
      'Your answer is saved. Now we will check.',
    ),
    items: [
      { id: 'a', label: '6' },
      { id: 'b', label: '12x + 14' },
      { id: 'c', label: '6x + 14' },
      { id: 'd', label: '12x + 4' },
    ],
  },
  holds: [4000, 5000, 5000],
  audio: [
    A('mount', "Kechagi darsda hosila limit bilan topilgan edi. Bu uzun yo'l, va uni qisqartirish mumkin.", 'На прошлом уроке производную находили пределом. Это длинный путь, и его можно сократить.', 'Last lesson the derivative was found with a limit. That is a long road, and it can be shortened.'),
    A('r1', "Karim ikkita ko'paytuvchining hosilasini alohida oladi va ularni ko'paytiradi. Ikki karra uch olti chiqadi.", 'Карим берёт производную каждого множителя отдельно и умножает их. Выходит два умножить на три, то есть шесть.', 'Karim takes the derivative of each factor separately and multiplies them. Two times three gives six.'),
    A('r2', "Nargiza esa avval qavslarni yoyadi, keyin hosila oladi. Uning javobi o'n ikki iks plyus o'n to'rt.", 'А Наргиза сначала раскрывает скобки, а потом берёт производную. Её ответ двенадцать икс плюс четырнадцать.', 'Nargiza first opens the brackets and then differentiates. Her answer is twelve x plus fourteen.'),
    A('ask', "Sizningcha qaysi yozuv ko'paytmaning hosilasi. Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая запись и есть производная произведения. Пока просто предположи.', 'Which record do you think is the derivative of the product. Just make a guess for now.'),
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
    "Ikkitasi kechagi darsdan, biri quyi sinflardan. Bu baholanmaydi.",
    'Две с прошлого урока, одна из младших классов. Это не оценивается.',
    'Two from the last lesson, one from earlier grades. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Hosila nuqtada', 'Производная в точке', 'The derivative at a point'),
      short: L('nisbatning limiti', 'предел отношения', 'the limit of a ratio'),
      ex: [{ e: L('kvadrat, nuqta 3', 'квадрат, точка 3', 'a square, the point 3'), why: L('hosila 6', 'производная 6', 'the derivative is 6') }],
    },
    {
      id: 'c2',
      title: L('Qavslarni yoyish', 'Раскрытие скобок', 'Opening brackets'),
      short: L('har biri har biriga', 'каждое на каждое', 'each by each'),
      ex: [{ e: '(2x + 4)(3x + 1)', why: '6x² + 14x + 4' }],
    },
    {
      id: 'c3',
      title: L('Daraja', 'Степень', 'A power'),
      short: L("ko'rsatkich necha marta", 'показатель сколько раз', 'the exponent counts factors'),
      ex: [{ e: 'x³ = x · x · x', why: L("uch marta ko'paytma", 'три множителя', 'three factors') }],
    },
  ],
  tasks: [
    {
      id: 't1',
      prompt: L('(x + 3)(x + 2) yoyilmasi?', 'Раскрытие (x + 3)(x + 2)?', 'Expanding (x + 3)(x + 2)?'),
      items: [
        { id: 'a', label: 'x² + 5x + 6', correct: true },
        { id: 'b', label: 'x² + 6', hint: L("O'rta hadlar tushib qolgan: uch iks va ikki iks ham bor.", 'Потеряны средние члены: есть ещё три икс и два икс.', 'The middle terms are lost: three x and two x are there too.') },
        { id: 'c', label: 'x² + 6x + 5', hint: L("Sonlar joyini almashtirgan: yig'indi besh, ko'paytma olti.", 'Числа поменялись местами: сумма пять, произведение шесть.', 'The numbers swapped: the sum is five, the product six.') },
        { id: 'd', label: '2x + 5', hint: L("Bu hosila bo'lardi, yoyilma esa kvadratdan boshlanadi.", 'Это была бы производная, а раскрытие начинается с квадрата.', 'That would be a derivative, the expansion starts with a square.') },
      ],
    },
    {
      id: 't2',
      prompt: L('Kvadrat funksiyaning 4 dagi hosilasi?', 'Производная функции квадрат в точке 4?', 'The derivative of the squaring function at 4?'),
      items: [
        { id: 'a', label: '8', correct: true },
        { id: 'b', label: '16', hint: L("O'n olti bu qiymat, hosila emas.", 'Шестнадцать это значение, а не производная.', 'Sixteen is the value, not the derivative.') },
        { id: 'c', label: '4', hint: L("To'rt bu nuqtaning o'zi.", 'Четыре это сама точка.', 'Four is the point itself.') },
        { id: 'd', label: '2', hint: L("Ikki bu ko'paytuvchi, unga nuqta ham kerak.", 'Два это множитель, к нему нужна ещё точка.', 'Two is the factor, the point is still needed.') },
      ],
    },
  ],
  holds: [3400, 4200, 4000, 3200],
  audio: [
    A('mount', "Uchta tayanch kerak: ikkitasi kechagi darsdan, biri quyi sinflardan.", 'Нужны три опоры: две с прошлого урока, одна из младших классов.', 'Three basics are needed: two from the last lesson, one from earlier grades.'),
    A('c1', "Birinchisi kechagi darsdan. Hosila nuqtada olinadi va u ayirmali nisbatning limiti.", 'Первая с прошлого урока. Производную берут в точке, и она предел разностного отношения.', 'The first is from the last lesson. The derivative is taken at a point and it is the limit of the difference ratio.'),
    A('c2', "Ikkinchisi qavslarni yoyish. Bu bugun kerak bo'ladi, chunki ko'paytmani yoyib ham hosila olish mumkin.", 'Вторая это раскрытие скобок. Оно понадобится сегодня, потому что произведение можно раскрыть и потом дифференцировать.', 'The second is opening brackets. It will be needed today, because a product may be expanded before differentiating.'),
    A('t1', "Ikkita savol.", 'Два вопроса.', 'Two questions.'),
  ],
}

// ============================================================
// SLAYD 3. NUQTALAR. Daraja qoidasi hamma qatorga to'g'ri keladimi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'power_vs_exp',
  eyebrow: L('Jadvalni sinaymiz', 'Проверяем таблицу', 'Testing the table'),
  title: L("Ko'rsatkich pastga tushadimi", 'Спускается ли показатель', 'Does the exponent come down'),
  expr: L("mezon: qaysi qatorda ishlaydi", 'признак: где правило работает', 'the criterion: where the rule works'),
  goal: L('qoida chegarasini topish', 'найти границу правила', 'find the limit of the rule'),
  rule: L(
    "Har qatorda daraja qoidasini sinaymiz.",
    'В каждой строке испытываем правило степени.',
    'In each row we test the power rule.',
  ),
  pick: L('Qaysi qatorni tekshiramiz?', 'Какую строку проверим?', 'Which row shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('hamma qatorga', 'всем строкам', 'every row'), value: L('hammasi', 'все', 'all') },
    { id: 'b', key: 'inB', name: L('faqat darajaga', 'только степени', 'the power only'), value: L('ikkitasi', 'две', 'two') },
  ],
  points: [
    {
      id: 'q1', label: 'x⁵', num: '5x⁴', step: 'calc', verdict: 'in',
      calc: L("besh oldiga chiqdi", 'пять вышло вперёд', 'five came in front'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: '√x', num: '1 / (2√x)', step: 'calc', verdict: 'in',
      calc: L("ko'rsatkich yarim", 'показатель одна вторая', 'the exponent is a half'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: '2ˣ', num: '2ˣ · ln 2', step: 'calc', verdict: 'out',
      calc: L('daraja emas', 'не степень', 'not a power'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q4', label: 'eˣ', num: 'eˣ', step: 'calc', verdict: 'out',
      calc: L("o'ziga teng", 'равна себе', 'equals itself'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      "Daraja qoidasi qayerda ishlaydi?",
      'Где работает правило степени?',
      'Where does the power rule work?',
    ),
    items: [
      { id: 'b', label: L("x daraja ko'tarilganda", 'когда в степень возведён x', 'when x is raised to a power'), correct: true },
      { id: 'a', label: L('har qanday darajada', 'в любой степени', 'in any power'), hint: L("Ikki iks darajada qoida yiqildi: u yerda o'zgarmas asos daraja ko'tariladi.", 'В два в степени икс правило упало: там в степень возводится постоянное основание.', 'For two to the power x the rule failed: there a fixed base is raised.') },
      { id: 'c', label: L('faqat butun ko\'rsatkichda', 'только при целом показателе', 'only for a whole exponent'), hint: L("Ildizda ko'rsatkich yarim, va qoida baribir ishladi.", 'У корня показатель одна вторая, и правило всё равно сработало.', 'For the root the exponent is one half, and the rule still worked.') },
      { id: 'd', label: L('hech qayerda', 'нигде', 'nowhere'), hint: L("Ikki qatorda ishladi: daraja va ildiz.", 'В двух строках сработало: степень и корень.', 'It worked in two rows: the power and the root.') },
    ],
  },
  holds: [3000, 4500, 2400, 2600, 9000],
  audio: [
    A('mount', "Taxmin bor. Endi jadvalni sinaymiz.", 'Прогноз есть. Теперь испытаем таблицу.', 'The guess is made. Now let us test the table.'),
    A('mount', "Ikki da'vo bor. Biri qoida hamma qatorga to'g'ri keladi deydi, ikkinchisi faqat iks daraja ko'tarilganda deydi.", 'Есть два утверждения. Одно говорит, что правило годится всем строкам, другое, что только когда в степень возведён икс.', 'There are two claims. One says the rule fits every row, the other that it fits only when x is raised.'),
    A('mount', "To'rtta qatorni birma bir ko'ramiz.", 'Посмотрим четыре строки по одной.', 'Let us look at the four rows one by one.'),
    A('calc', 'Tekshiramiz.', 'Проверяем.', 'We check.'),
    A('mark', "Mana natija. Darajada va ildizda ko'rsatkich haqiqatan oldiga chiqadi. Ikki iks darajada esa hamma narsa boshqacha: u yerda asos o'zgarmas, va hosila o'zining ustiga asosning logarifmi qo'shilib chiqadi. Eksponentada esa hosila funksiyaning o'ziga teng. Demak birinchi da'vo yiqildi: qatorni TANLASH kerak.", 'Вот результат. В степени и в корне показатель действительно выходит вперёд. А в два в степени икс всё иначе: там основание постоянно, и производная получается с логарифмом основания. У экспоненты же производная равна самой функции. Значит первое утверждение упало: строку нужно ВЫБИРАТЬ.', 'Here is the result. In the power and the root the exponent does come forward. In two to the power x everything differs: the base is fixed, and the derivative carries the logarithm of the base. For the exponential the derivative equals the function itself. So the first claim fell: the row must be CHOSEN.'),
  ],
}

// ============================================================
// SLAYD 4. CHIZMA. Hosila YANGI funksiya: kechagi parabola shu yerda.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'deriv_vs_value',
  drag: false,
  graphSteps: 2,
  eyebrow: L('Chizma', 'Чертёж', 'The drawing'),
  title: L('Hosila yangi funksiya', 'Производная это новая функция', 'The derivative is a new function'),
  chip: 'f (x) = x²',
  secant: {
    fn: SQ,
    xDomain: [-2.6, 2.6],
    yDomain: [-5.5, 7],
    xTicks: [{ v: -2 }, { v: -1 }, { v: 1 }, { v: 2 }],
    yTicks: [{ v: -4 }, { v: 2 }, { v: 6 }],
    mode: 'sign',
    showDeriv: true,
    derivLabel: 'f ′ = 2x',
    curveLabel: 'f',
    signs: [
      { from: -2.6, to: 0, sign: '−', showAt: 1 },
      { from: 0, to: 2.6, sign: '+', showAt: 1 },
    ],
    marks: [{ v: 0, label: '0', showAt: 2 }],
  },
  bonus: L(
    "Hosila nolga aylangan nuqta -- egri chiziqning eng pastki joyi.",
    'Точка, где производная стала нулём, это самое низкое место кривой.',
    'The point where the derivative became zero is the lowest place of the curve.',
  ),
  probe: {
    question: L(
      'Punktir chiziq nimani ko\'rsatadi?',
      'Что показывает пунктирная линия?',
      'What does the dashed line show?',
    ),
    items: [
      { id: 'a', label: L('har nuqtadagi qiyalikni', 'наклон в каждой точке', 'the slope at each point'), correct: true },
      { id: 'b', label: L('funksiyaning qiymatini', 'значение функции', 'the value of the function'), hint: L("Qiymatni qalin chiziq beradi, punktir esa uning qiyaligini.", 'Значение даёт жирная линия, а пунктир её наклон.', 'The value comes from the bold line, the dashed one gives its slope.') },
      { id: 'c', label: L('urinmani', 'касательную', 'the tangent'), hint: L("Urinma bitta nuqtaga tegishli, punktir esa hamma nuqta uchun.", 'Касательная относится к одной точке, а пунктир ко всем сразу.', 'A tangent belongs to one point, the dashed line to all of them.') },
      { id: 'd', label: L('o\'rtacha tezlikni', 'среднюю скорость', 'the average speed'), hint: L("O'rtacha tezlikka ORALIQ kerak, punktirda esa har nuqtaning o'z soni bor.", 'Средней скорости нужен ПРОМЕЖУТОК, а у пунктира в каждой точке своё число.', 'Average speed needs an INTERVAL, and the dashed line has its own number at each point.') },
    ],
  },
  holds: [4500, 5500],
  audio: [
    A('mount', "Hosila har nuqtada o'z sonini beradi. Demak uni funksiya sifatida chizish mumkin, va mana u punktir bilan.", 'Производная в каждой точке даёт своё число. Значит её можно нарисовать как функцию, и вот она пунктиром.', 'The derivative gives its own number at each point. So it can be drawn as a function, and here it is, dashed.'),
    A('mount', "Chapda hosila manfiy, va parabola pastga ketadi. O'ngda musbat, va parabola ko'tariladi. Ishora lentasi shuni ko'rsatadi.", 'Слева производная отрицательна, и парабола идёт вниз. Справа положительна, и парабола поднимается. Лента знака это и показывает.', 'On the left the derivative is negative and the parabola falls. On the right it is positive and the parabola rises. The sign band shows exactly that.'),
    A('mount', "Va nolda hosila nolga teng: aynan shu joyda parabola pastdan yuqoriga o'giriladi.", 'А в нуле производная равна нулю: именно здесь парабола поворачивает снизу вверх.', 'And at zero the derivative equals zero: right there the parabola turns from falling to rising.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1. Jadval (darslik 27-bet).
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'power_vs_exp',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Hosilalar jadvali', 'Таблица производных', 'The table of derivatives'),
  rows: [
    { text: 'c → 0' },
    { text: 'xᵖ → p · xᵖ⁻¹' },
    { text: 'sin x → cos x' },
  ],
  probe: {
    question: L('(x⁷) hosilasi?', 'Производная (x⁷)?', 'The derivative of (x⁷)?'),
    items: [
      { id: 'a', label: '7x⁶', correct: true },
      { id: 'b', label: '7x⁷', hint: L("Ko'rsatkich bittaga kamayishi kerak: yettidan olti qoladi.", 'Показатель должен уменьшиться на единицу: из семи остаётся шесть.', 'The exponent must drop by one: seven leaves six.') },
      { id: 'c', label: '6x⁶', hint: L("Oldiga ESKI ko'rsatkich chiqadi, ya'ni yetti.", 'Вперёд выходит СТАРЫЙ показатель, то есть семь.', 'The OLD exponent comes in front, that is seven.') },
      { id: 'd', label: 'x⁶', hint: L("Ko'paytuvchi tushib qolgan: yetti oldida turishi kerak.", 'Потерян множитель: семь должно стоять впереди.', 'The factor is lost: seven must stand in front.') },
    ],
  },
  rule: {
    title: L('Yana uch qator', 'Ещё три строки', 'Three more rows'),
    lines: [
      L('cos x → manfiy sin x', 'cos x → минус sin x', 'cos x → minus sin x'),
      'eˣ → eˣ',
      'ln x → 1 / x',
    ],
  },
  holds: [4000, 5000, 4500],
  audio: [
    A('mount', "Jadvalning boshi. O'zgarmas son hosilasi nol, chunki u o'zgarmaydi va o'zgarish tezligi yo'q.", 'Начало таблицы. Производная постоянной равна нулю, потому что она не меняется и скорости изменения нет.', 'The start of the table. The derivative of a constant is zero, because it does not change and has no rate of change.'),
    A('mount', "Ikkinchi qator eng ko'p ishlatiladi. Ko'rsatkich oldiga chiqadi va o'zi bittaga kamayadi.", 'Вторая строка самая ходовая. Показатель выходит вперёд, а сам уменьшается на единицу.', 'The second row is the most used. The exponent comes in front and itself drops by one.'),
    A('rule', "Jadvalda o'n ikkita qator bor. Bugun yana uchtasi kerak: kosinus, eksponenta va natural logarifm. Qolganlari shpargalkada qoladi.", 'В таблице двенадцать строк. Сегодня нужны ещё три: косинус, экспонента и натуральный логарифм. Остальные останутся в шпаргалке.', 'The table has twelve rows. Three more are needed today: the cosine, the exponential and the natural logarithm. The rest stay in the cheat sheet.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT. O'zgarmas ko'paytuvchi va o'zgarmas qo'shiluvchi.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'const_zero',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L("O'zgarmas paydo bo'ldi", 'Появилась постоянная', 'A constant has appeared'),
  was: { label: UI.was, expr: '(x³) ′ = 3x²' },
  now: { label: UI.now, expr: '(5x³) ′ = ?' },
  rows: [
    { text: '(5x³) ′ = 5 · 3x² = 15x²' },
    { text: '(x³ + 7) ′ = 3x² + 0' },
    { text: '(x³ + 7) ′ = 3x²' },
  ],
  probe1: {
    cols: 2,
    question: L(
      "O'zgarmas qo'shiluvchi hosilaga nima beradi?",
      'Что даёт производной постоянное слагаемое?',
      'What does a constant term give to the derivative?',
    ),
    items: [
      { id: 'a', label: L('nol', 'ноль', 'zero'), correct: true },
      { id: 'b', label: L("o'zini", 'себя самого', 'itself'), hint: L("O'zgarmas o'zgarmaydi, demak uning o'zgarish tezligi nol.", 'Постоянная не меняется, значит её скорость изменения ноль.', 'A constant does not change, so its rate of change is zero.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L(
      "(x sin x) hosilasi qanday bo'ladi?",
      'Какой будет производная (x sin x)?',
      'What will the derivative of (x sin x) be?',
    ),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: 'sin x + x cos x' },
      { id: 'b', label: 'cos x' },
      { id: 'c', label: 'x cos x' },
      { id: 'd', label: 'sin x − x cos x' },
    ],
  },
  holds: [4000, 6500, 3200, 4000],
  audio: [
    A('mount', "Jadval sof funksiyalar uchun yozilgan. Amalda esa oldida son turadi yoki yoniga son qo'shilgan bo'ladi.", 'Таблица написана для чистых функций. На практике же впереди стоит число или рядом прибавлено число.', 'The table is written for clean functions. In practice a number stands in front or is added beside.'),
    A('q1', "Ko'paytuvchi hosila belgisidan tashqariga chiqadi va joyida qoladi. Besh karra uch iks kvadrat o'n besh iks kvadrat beradi. Qo'shiluvchi esa yo'qoladi, chunki yettining o'zgarish tezligi nol.", 'Множитель выносится за знак производной и остаётся на месте. Пять умножить на три икс квадрат даёт пятнадцать икс квадрат. А слагаемое исчезает, потому что у семёрки скорость изменения ноль.', 'A factor comes outside the derivative sign and stays. Five times three x squared gives fifteen x squared. A term disappears, because seven has zero rate of change.'),
    A('q1', "Demak qo'shiluvchi nima beradi.", 'Значит что даёт слагаемое.', 'So what does a term give.'),
    A('q2', "Endi taxmin qiling: iks karra sinusning hosilasi qanday bo'ladi.", 'Теперь предположи: какой будет производная икс на синус.', 'Now make a guess: what will the derivative of x times sine be.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI YO'L. Xukning javobi (darslik 25-bet, 3-misol).
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'product_not_product',
  eyebrow: L('Ikki yo\'l', 'Два пути', 'Two paths'),
  title: L("Ko'paytmani ikki yo'l bilan", 'Произведение двумя путями', 'A product two ways'),
  expr: '(2x + 4)(3x + 1)',
  need: L("ko'paytmaning hosilasi", 'производная произведения', 'the derivative of the product'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      // Kartochka matni o'ralmaydi: telefonda ~22 belgi sig'adi.
      txt: L("hosilalarni ko'paytdi", 'умножил производные', 'multiplied them'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '6',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('qavsni yoydi', 'раскрыл скобки', 'expanded first'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '12x + 14',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['12x + 14', '6', '6x + 14', '12x + 4'],
    value: ['12x + 14'],
    label: L('hosila =', 'производная =', 'derivative ='),
    prompt: L('Hosilani yozing', 'Запиши производную', 'Write the derivative'),
    wrongs: [
      { key: '6', hint: L("Bu hosilalarning ko'paytmasi. Uni tekshirish oson: nolda yoyilma o'n to'rt beradi, olti emas.", 'Это произведение производных. Проверить легко: в нуле раскрытие даёт четырнадцать, а не шесть.', 'That is the product of the derivatives. Easy to check: at zero the expansion gives fourteen, not six.') },
      { key: '6x + 14', hint: L("Kvadratning ko'paytuvchisi ikkiga ko'paymagan: olti iks kvadratdan o'n ikki iks chiqadi.", 'Множитель квадрата не удвоен: из шести икс квадрат выходит двенадцать икс.', 'The square factor is not doubled: six x squared gives twelve x.') },
      { key: '12x + 4', hint: L("O'rta had xato: o'n to'rt iks ning hosilasi o'n to'rt, to'rt esa ozod had edi.", 'Средний член неверен: производная четырнадцати икс это четырнадцать, а четыре было свободным членом.', 'The middle term is wrong: the derivative of fourteen x is fourteen, and four was the free term.') },
      { key: '*', hint: L("Yoyilma olti iks kvadrat plyus o'n to'rt iks plyus to'rt. Har hadning hosilasini oling.", 'Раскрытие шесть икс квадрат плюс четырнадцать икс плюс четыре. Возьми производную каждого члена.', 'The expansion is six x squared plus fourteen x plus four. Differentiate each term.') },
    ],
  },
  holds: [4200, 4500, 6000],
  audio: [
    A('mount', "Endi xukka qaytamiz. Ikki o'quvchi ikki yo'l bilan boradi.", 'Теперь вернёмся к началу урока. Два ученика идут двумя путями.', 'Now back to the start of the lesson. Two students take two paths.'),
    A('p1', "Aziz hosilalarni ko'paytiradi va olti oladi. Bu yo'l qisqa, lekin noto'g'ri.", 'Азиз умножает производные и получает шесть. Этот путь короткий, но неверный.', 'Aziz multiplies the derivatives and gets six. That road is short but wrong.'),
    A('p2', "Dilnoza qavsni yoyadi. Olti iks kvadrat plyus o'n to'rt iks plyus to'rt chiqadi, va uning hosilasi o'n ikki iks plyus o'n to'rt. Bu yo'l uzunroq, lekin javob rost.", 'Дилноза раскрывает скобки. Выходит шесть икс квадрат плюс четырнадцать икс плюс четыре, и её производная двенадцать икс плюс четырнадцать. Этот путь длиннее, но ответ верный.', 'Dilnoza expands the brackets. Six x squared plus fourteen x plus four comes out, and its derivative is twelve x plus fourteen. That road is longer, but the answer is true.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2. Ko'paytma va bo'linma qoidalari (darslik 25-bet).
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'product_not_product',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L("Ko'paytma va bo'linma", 'Произведение и частное', 'A product and a quotient'),
  cases: [
    {
      tag: L("ko'paytma", 'произведение', 'a product'),
      txt: L('birinchining hosilasi karra ikkinchi, plyus birinchi karra ikkinchining hosilasi', 'производная первого на второе плюс первое на производную второго', 'the derivative of the first times the second plus the first times the derivative of the second'),
    },
    {
      tag: L("bo'linma", 'частное', 'a quotient'),
      txt: L('xuddi shunday, lekin minus bilan va maxraj kvadratiga bo\'linadi', 'так же, но с минусом и делится на квадрат знаменателя', 'the same, but with a minus and divided by the square of the bottom'),
    },
  ],
  rows: [
    { text: '(f g) ′ = f ′ g + f g ′' },
    { text: '(f / g) ′ = (f ′ g − f g ′) / g²' },
  ],
  probe: {
    question: L('(x · sin x) hosilasi?', 'Производная (x · sin x)?', 'The derivative of (x · sin x)?'),
    items: [
      { id: 'a', label: 'sin x + x · cos x', correct: true },
      { id: 'b', label: 'cos x', hint: L("Bu hosilalarning ko'paytmasi: bir karra kosinus. Ko'paytma qoidasi ikki qo'shiluvchi beradi.", 'Это произведение производных: единица на косинус. Правило произведения даёт два слагаемых.', 'That is the product of the derivatives: one times the cosine. The product rule gives two terms.') },
      { id: 'c', label: 'x · cos x', hint: L("Bitta qo'shiluvchi tushib qolgan: iks ning hosilasi karra sinus ham bor.", 'Потеряно одно слагаемое: есть ещё производная икса на синус.', 'One term is lost: the derivative of x times the sine is there too.') },
      { id: 'd', label: 'sin x − x · cos x', hint: L("Minus bo'linma qoidasida turadi, ko'paytmada esa plyus.", 'Минус стоит в правиле частного, а в произведении плюс.', 'The minus belongs to the quotient rule, the product has a plus.') },
    ],
  },
  rule: {
    title: L('Ikki qoida', 'Два правила', 'Two rules'),
    lines: [
      L("ko'paytmada ikki qo'shiluvchi", 'в произведении два слагаемых', 'a product gives two terms'),
      L("bo'linmada minus va kvadrat", 'в частном минус и квадрат', 'a quotient has a minus and a square'),
      L('tartib almashtirilmaydi', 'порядок не переставляется', 'the order is fixed'),
    ],
  },
  swap: {
    title: L('Jamlanma', 'Свод', 'The summary'),
    lines: [
      L('jadval sof funksiyalar uchun', 'таблица для чистых функций', 'the table is for clean functions'),
      L("qoidalar ularni bir-biriga bog'laydi", 'правила связывают их между собой', 'the rules join them together'),
    ],
  },
  holds: [4000, 7000, 3000],
  audio: [
    A('mount', "Qavsni yoyish har doim mumkin emas. Shuning uchun ko'paytmaning o'z qoidasi bor.", 'Раскрыть скобки можно не всегда. Поэтому у произведения есть своё правило.', 'Brackets cannot always be opened. That is why a product has its own rule.'),
    A('mount', "Ko'paytmada ikki qo'shiluvchi chiqadi. Birinchisida birinchi ko'paytuvchi differensiallanadi, ikkinchisida ikkinchisi. Bo'linmada esa xuddi shu tartib, lekin orasida minus turadi va hammasi maxraj kvadratiga bo'linadi.", 'В произведении выходят два слагаемых. В первом дифференцируется первый множитель, во втором второй. В частном тот же порядок, но между ними минус, и всё делится на квадрат знаменателя.', 'A product gives two terms. In the first the first factor is differentiated, in the second the second one. A quotient keeps the same order, but a minus sits between them and everything is divided by the square of the bottom.'),
    A('rule', "Bo'linmada tartib almashtirilmaydi: minus oldida aynan pay hosilasi turadi.", 'В частном порядок не переставляется: перед минусом стоит именно производная числителя.', 'In a quotient the order is fixed: the derivative of the top stands before the minus.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZINGIZ QO'YING. O'zgarmas ko'paytuvchi ishorani saqlaydi.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'const_zero',
  eyebrow: L('O\'zingiz qo\'ying', 'Поставь сам', 'Place it yourself'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    "Oldida MINUS turadi",
    'Впереди МИНУС',
    'A MINUS in front',
  ),
  template: ['(−5x²) ′ =  ', { slot: 0 }, ' 10x'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    "ko'paytuvchi hosila belgisidan tashqariga ishorasi bilan chiqadi",
    'множитель выносится за знак производной вместе со знаком',
    'the factor comes outside the derivative sign together with its sign',
  ),
  wrongs: [
    { key: '+', hint: L("Minus yo'qolib ketmaydi: u ko'paytuvchining bir qismi.", 'Минус не исчезает: он часть множителя.', 'The minus does not vanish: it is part of the factor.') },
  ],
  probe: {
    question: L(
      "O'zgarmas ko'paytuvchi bilan nima bo'ladi?",
      'Что происходит с постоянным множителем?',
      'What happens to a constant factor?',
    ),
    items: [
      { id: 'a', label: L('saqlanadi', 'сохраняется', 'it survives'), correct: true },
      { id: 'b', label: L('nolga aylanadi', 'обращается в ноль', 'becomes zero'), hint: L("Nolga QO'SHILUVCHI aylanadi, ko'paytuvchi esa qoladi.", 'В ноль обращается СЛАГАЕМОЕ, а множитель остаётся.', 'A TERM becomes zero, a factor stays.') },
      { id: 'c', label: L('birga aylanadi', 'обращается в единицу', 'becomes one'), hint: L("Birga aylanish uchun sabab yo'q: son o'z qiymatida qoladi.", 'Нет причины обращаться в единицу: число остаётся тем же.', 'There is no reason to become one: the number stays as it is.') },
      { id: 'd', label: L('ishorasini almashtiradi', 'меняет знак', 'flips its sign'), hint: L("Ishora ham o'zgarmaydi: minus minus bo'lib qoladi.", 'Знак тоже не меняется: минус остаётся минусом.', 'The sign does not change either: a minus stays a minus.') },
    ],
  },
  audio: [
    A('mount', "Endi ishorani o'zingiz qo'yasiz. Oldida manfiy ko'paytuvchi turadi.", 'Теперь знак ставишь сам. Впереди стоит отрицательный множитель.', 'Now you place the sign yourself. A negative factor stands in front.'),
    A('write', "Hosilada qanday ishora bo'ladi.", 'Какой знак будет в производной.', 'Which sign will the derivative have.'),
  ],
}

// Zanjir amallari: ro'yxatda IKKI masalaning amallari bor -- murakkab
// funksiya va bo'linma. Tanlov haqiqiy bo'lishi kerak.
const ACTIONS_44 = [
  { id: 'outer', label: L('tashqi hosila', 'внешняя производная', 'the outer derivative') },
  { id: 'inner', label: L('ichki hosila', 'внутренняя производная', 'the inner derivative') },
  { id: 'mult', label: L("ikkisini ko'paytirish", 'умножить одно на другое', 'multiply the two') },
  { id: 'quot', label: L("bo'linma qoidasi", 'правило частного', 'the quotient rule') },
  { id: 'simp', label: L('soddalashtirish', 'упростить', 'simplify') },
]

// ============================================================
// SLAYD 10. ZANJIR. Murakkab funksiya (darslik 30-bet).
// ============================================================
const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'inner_k',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Murakkab funksiya', 'Сложная функция', 'A composite function'),
  start: '(2x + 5)³',
  actions: ACTIONS_44,
  steps: [
    {
      action: 'outer',
      to: '3 (2x + 5)²',
      wrongs: [
        { action: 'inner', hint: L("Ichkidan boshlanmaydi: avval tashqi daraja differensiallanadi.", 'Начинают не с внутренней: сначала дифференцируют внешнюю степень.', 'We do not start inside: the outer power is differentiated first.') },
        { action: 'quot', hint: L("Bu yerda bo'linma yo'q, daraja bor.", 'Здесь нет частного, здесь степень.', 'There is no quotient here, there is a power.') },
        { action: 'mult', hint: L("Ko'paytirish uchun avval ikkita ko'paytuvchi kerak.", 'Чтобы умножать, нужны сначала два множителя.', 'To multiply we first need two factors.') },
      ],
    },
    {
      action: 'inner',
      to: '2',
      wrongs: [
        { action: 'outer', hint: L("Tashqi hosila allaqachon olingan: uch karra qavs kvadrat.", 'Внешняя производная уже взята: три на скобку в квадрате.', 'The outer derivative is taken already: three times the bracket squared.') },
        { action: 'simp', hint: L("Soddalashtirish oxirida bo'ladi, hozir ichki ko'paytuvchi kerak.", 'Упрощение будет в конце, сейчас нужен внутренний множитель.', 'Simplifying comes last, now the inner factor is needed.') },
      ],
    },
    {
      action: 'mult',
      to: '6 (2x + 5)²',
      wrongs: [
        { action: 'inner', hint: L("Ichki hosila topildi: u ikkiga teng.", 'Внутренняя производная найдена: она равна двум.', 'The inner derivative is found: it equals two.') },
        { action: 'quot', hint: L("Bo'linma qoidasi bu masalada ishlamaydi.", 'Правило частного в этой задаче не работает.', 'The quotient rule does not apply here.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['6 (2x + 5)²', '3 (2x + 5)²', '2 (2x + 5)²', '6 (2x + 5)³'],
    value: ['6 (2x + 5)²'],
    label: L('hosila =', 'производная =', 'derivative ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '3 (2x + 5)²', hint: L("Ichki ko'paytuvchi tushib qolgan: qavs ichidagi iks oldida ikki turadi.", 'Потерян внутренний множитель: перед иксом в скобке стоит два.', 'The inner factor is lost: a two stands before the x in the bracket.') },
      { key: '2 (2x + 5)²', hint: L("Tashqi ko'rsatkich tushib qolgan: uch ham ko'paytuvchi.", 'Потерян внешний показатель: три тоже множитель.', 'The outer exponent is lost: three is a factor too.') },
      { key: '6 (2x + 5)³', hint: L("Ko'rsatkich kamaymagan: uchdan ikki qoladi.", 'Показатель не уменьшен: из трёх остаётся два.', 'The exponent is not lowered: three leaves two.') },
      { key: '*', hint: L("Uch karra qavs kvadrat, keyin ichki ikkiga ko'paytiriladi.", 'Три на скобку в квадрате, потом умножить на внутреннюю двойку.', 'Three times the bracket squared, then times the inner two.') },
    ],
  },
  audio: [
    A('mount', "Ishora qo'yildi. Endi eng ko'p uchraydigan holat: qavs ichida yana funksiya turadi.", 'Знак поставлен. Теперь самый частый случай: внутри скобки снова функция.', 'The sign is placed. Now the most frequent case: inside the bracket there is another function.'),
    A('start', "Diqqat: ro'yxatda bo'linma qoidasi ham bor. U hozir ortiqcha.", 'Внимание: в списке есть и правило частного. Сейчас оно лишнее.', 'Careful: the list also holds the quotient rule. It is superfluous now.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL. Bo'linma (darslik 25-bet, 4-misol).
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'quotient_order',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Bo\'linma', 'Частное', 'A quotient'),
  start: '(x + 1) / (x − 2)',
  actions: ACTIONS_44,
  hint: L(
    "Pay hosilasi bir, maxraj hosilasi ham bir.",
    'Производная числителя один, производная знаменателя тоже один.',
    'The derivative of the top is one, of the bottom also one.',
  ),
  steps: [
    {
      action: 'quot',
      to: '((x − 2) − (x + 1)) / (x − 2)²',
      wrongs: [
        { action: 'outer', hint: L("Tashqi hosila darajada kerak bo'lardi, bu yerda bo'linma turadi.", 'Внешняя производная понадобилась бы в степени, а здесь частное.', 'The outer derivative would fit a power, here we have a quotient.') },
        { action: 'inner', hint: L("Ichki funksiya yo'q: pay va maxraj oddiy ikkihadlar.", 'Внутренней функции нет: числитель и знаменатель простые двучлены.', 'There is no inner function: the top and bottom are simple binomials.') },
        { action: 'mult', hint: L("Ko'paytma qoidasi emas, bo'linma qoidasi kerak.", 'Нужно не правило произведения, а правило частного.', 'Not the product rule, the quotient rule is needed.') },
      ],
    },
    {
      action: 'simp',
      to: '−3 / (x − 2)²',
      wrongs: [
        { action: 'quot', hint: L("Qoida allaqachon qo'llanildi, endi qavslarni yechish kerak.", 'Правило уже применено, теперь надо раскрыть скобки.', 'The rule is applied already, now the brackets must be cleared.') },
        { action: 'outer', hint: L("Bu yerda daraja yo'q, faqat soddalashtirish qoldi.", 'Здесь нет степени, осталось только упростить.', 'There is no power here, only simplifying is left.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['−3 / (x − 2)²', '3 / (x − 2)²', '−1 / (x − 2)²', '1 / (x − 2)'],
    value: ['−3 / (x − 2)²'],
    label: L('hosila =', 'производная =', 'derivative ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '3 / (x − 2)²', hint: L("Ishora yo'qolgan: iks minus ikkidan iks plyus bir ayirilsa, minus uch chiqadi.", 'Потерян знак: если из икс минус два вычесть икс плюс один, выйдет минус три.', 'The sign is lost: subtracting x plus one from x minus two gives minus three.') },
      { key: '−1 / (x − 2)²', hint: L("Faqat sonlar qo'shilmagan: minus ikki minus bir minus uch beradi.", 'Не сложены числа: минус два минус один даёт минус три.', 'The numbers are not added: minus two minus one gives minus three.') },
      { key: '1 / (x − 2)', hint: L("Maxraj kvadratga ko'tarilmagan, va pay ham xato.", 'Знаменатель не возведён в квадрат, и числитель неверен.', 'The bottom is not squared, and the top is wrong too.') },
      { key: '*', hint: L("Payda iks minus ikki minus iks plyus bir, ya'ni minus uch. Maxrajda kvadrat.", 'В числителе икс минус два минус икс плюс один, то есть минус три. В знаменателе квадрат.', 'The top is x minus two minus x plus one, that is minus three. The bottom is squared.') },
    ],
  },
  audio: [
    A('mount', "Oxirgi masala mustaqil. Bu safar bo'linma.", 'Последняя задача самостоятельная. На этот раз частное.', 'The last problem is on your own. This time a quotient.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
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
      done: '9x⁸',
      prompt: L('(x⁹) hosilasi?', 'Производная (x⁹)?', 'The derivative of (x⁹)?'),
      items: [
        { id: 'a', label: '9x⁸', correct: true },
        { id: 'b', label: '9x⁹', hint: L("Ko'rsatkich bittaga kamayadi.", 'Показатель уменьшается на единицу.', 'The exponent drops by one.') },
        { id: 'c', label: '8x⁸', hint: L("Oldiga eski ko'rsatkich chiqadi, ya'ni to'qqiz.", 'Вперёд выходит старый показатель, то есть девять.', 'The old exponent comes in front, that is nine.') },
        { id: 'd', label: 'x⁸', hint: L("Ko'paytuvchi tushib qolgan.", 'Потерян множитель.', 'The factor is lost.') },
      ],
    },
    {
      id: 'b2', tag: 'const_zero', ask: true, cols: 2,
      done: '0',
      prompt: L('(12) hosilasi?', 'Производная (12)?', 'The derivative of (12)?'),
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: '12', hint: L("O'zgarmas o'zgarmaydi, demak tezligi nol.", 'Постоянная не меняется, значит её скорость ноль.', 'A constant does not change, so its rate is zero.') },
        { id: 'c', label: '1', hint: L("Bir iks ning hosilasi.", 'Единица это производная икса.', 'One is the derivative of x.') },
        { id: 'd', label: '12x', hint: L("Ko'paytirish yo'q: bu shunchaki son.", 'Умножения нет: это просто число.', 'There is no multiplying: it is just a number.') },
      ],
    },
    {
      id: 'b3', tag: 'product_not_product', ask: true, cols: 2,
      done: 'eˣ (1 + x)',
      prompt: L('(x · eˣ) hosilasi?', 'Производная (x · eˣ)?', 'The derivative of (x · eˣ)?'),
      items: [
        { id: 'a', label: 'eˣ (1 + x)', correct: true },
        { id: 'b', label: 'eˣ', hint: L("Bu hosilalarning ko'paytmasi. Ko'paytma qoidasi ikki qo'shiluvchi beradi.", 'Это произведение производных. Правило произведения даёт два слагаемых.', 'That is the product of the derivatives. The product rule gives two terms.') },
        { id: 'c', label: 'x · eˣ', hint: L("Bitta qo'shiluvchi tushib qolgan: iks ning hosilasi karra eksponenta.", 'Потеряно одно слагаемое: производная икса на экспоненту.', 'One term is lost: the derivative of x times the exponential.') },
        { id: 'd', label: 'eˣ (x − 1)', hint: L("Ko'paytmada plyus turadi, minus esa bo'linmada.", 'В произведении стоит плюс, а минус в частном.', 'A product has a plus, the minus belongs to a quotient.') },
      ],
    },
    {
      id: 'b4', tag: 'quotient_order', ask: true, cols: 2,
      done: '−1 / x²',
      prompt: L('(1 / x) hosilasi?', 'Производная (1 / x)?', 'The derivative of (1 / x)?'),
      items: [
        { id: 'a', label: '−1 / x²', correct: true },
        { id: 'b', label: '1 / x²', hint: L("Ishora yo'qolgan: funksiya kamayadi, demak hosila manfiy.", 'Потерян знак: функция убывает, значит производная отрицательна.', 'The sign is lost: the function decreases, so the derivative is negative.') },
        { id: 'c', label: 'ln x', hint: L("Logarifm teskari amaldan chiqadi, hosiladan emas.", 'Логарифм выходит из обратного действия, а не из производной.', 'The logarithm comes from the reverse action, not from differentiating.') },
        { id: 'd', label: '−1 / x', hint: L("Maxraj kvadratga ko'tariladi: manfiy ko'rsatkich bittaga kamayadi.", 'Знаменатель возводится в квадрат: отрицательный показатель уменьшается на единицу.', 'The bottom is squared: the negative exponent drops by one.') },
      ],
    },
    {
      id: 'b5', tag: 'inner_k', ask: true, cols: 2,
      done: '5 cos 5x',
      prompt: L('(sin 5x) hosilasi?', 'Производная (sin 5x)?', 'The derivative of (sin 5x)?'),
      items: [
        { id: 'a', label: '5 cos 5x', correct: true },
        { id: 'b', label: 'cos 5x', hint: L("Ichki ko'paytuvchi tushib qolgan: qavs ichida besh iks turadi.", 'Потерян внутренний множитель: внутри стоит пять икс.', 'The inner factor is lost: five x sits inside.') },
        { id: 'c', label: '5 cos x', hint: L("Ichki yozuv saqlanadi: kosinus ham besh iks dan olinadi.", 'Внутренняя запись сохраняется: косинус тоже от пяти икс.', 'The inner record stays: the cosine is of five x too.') },
        { id: 'd', label: '−5 cos 5x', hint: L("Minus kosinusni differensiallaganda paydo bo'ladi, sinusda esa yo'q.", 'Минус появляется при дифференцировании косинуса, а у синуса его нет.', 'The minus appears when differentiating a cosine, the sine has none.') },
      ],
    },
    {
      id: 'b6', tag: 'power_vs_exp', ask: true, cols: 2,
      done: '−sin x',
      prompt: L('(cos x) hosilasi?', 'Производная (cos x)?', 'The derivative of (cos x)?'),
      items: [
        { id: 'a', label: '−sin x', correct: true },
        { id: 'b', label: 'sin x', hint: L("Jadvalda kosinus qatorida minus turadi.", 'В таблице в строке косинуса стоит минус.', 'In the table the cosine row carries a minus.') },
        { id: 'c', label: 'cos x', hint: L("O'ziga teng hosila faqat eksponentada bo'ladi.", 'Производная, равная себе, бывает только у экспоненты.', 'Only the exponential has a derivative equal to itself.') },
        { id: 'd', label: '−cos x', hint: L("Funksiya sinusga aylanadi, kosinus qolmaydi.", 'Функция превращается в синус, косинус не остаётся.', 'The function turns into a sine, no cosine remains.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, javoblar natijaga kiradi.", 'Блиц. Шесть вопросов, ответы идут в результат.', 'Quick round. Six questions, the answers count.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Ichki ko'paytuvchi tushib qolgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'inner_k',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: 'y = (3x − 2)⁵' },
    { id: 'r2', text: L('tashqi: 5 (3x − 2)⁴', 'внешняя: 5 (3x − 2)⁴', 'outer: 5 (3x − 2)⁴') },
    { id: 'r3', text: L('ichki: 3', 'внутренняя: 3', 'inner: 3') },
    { id: 'r4', text: 'y ′ = 5 (3x − 2)⁴' },
    { id: 'r5', text: L('javob: 5 (3x − 2)⁴', 'ответ: 5 (3x − 2)⁴', 'answer: 5 (3x − 2)⁴') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Tashqi hosila to'g'ri: besh oldiga chiqdi, ko'rsatkich to'rt bo'ldi.", 'Внешняя производная верна: пять вышло вперёд, показатель стал четыре.', 'The outer derivative is right: five came in front, the exponent became four.'),
    r3: L("Ichki hosila ham to'g'ri topilgan: uch iks ning hosilasi uch.", 'Внутренняя производная тоже найдена верно: производная трёх икс это три.', 'The inner derivative is right too: the derivative of three x is three.'),
    r5: L("Oxirgi satr faqat ko'chirma, xato undan oldin.", 'Последняя строка только перепись, ошибка выше.', 'The last line is just a copy, the error is above.'),
  },
  proofPoint: L('ichki ko\'paytuvchi ishlatilmagan', 'внутренний множитель не использован', 'the inner factor is unused'),
  proof: L(
    "Uchinchi satrda ichki hosila TOPILGAN, lekin to'rtinchi satrda u ishlatilmagan. Ikkisi ko'paytirilishi kerak edi, natijada o'n besh karra qavsning to'rtinchi darajasi chiqadi.",
    'В третьей строке внутренняя производная НАЙДЕНА, но в четвёртой не использована. Их надо было умножить, и получится пятнадцать на скобку в четвёртой степени.',
    'In the third line the inner derivative is FOUND, but the fourth line never uses it. They had to be multiplied, giving fifteen times the bracket to the fourth power.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("ichki ko'paytuvchi ishlatilmagan", 'внутренний множитель не использован', 'the inner factor is unused'), correct: true },
      { id: 'b', label: L("ko'rsatkich xato kamaytirilgan", 'показатель уменьшен неверно', 'the exponent is lowered wrong'), hint: L("Beshdan to'rt qoldi, bu to'g'ri.", 'Из пяти осталось четыре, это верно.', 'Five left four, that is right.') },
      { id: 'c', label: L('ichki hosila xato topilgan', 'внутренняя производная найдена неверно', 'the inner derivative is found wrong'), hint: L("Uch iks minus ikkining hosilasi haqiqatan uch.", 'Производная трёх икс минус два действительно три.', 'The derivative of three x minus two is indeed three.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Javobda besh turadi, to'g'risi esa o'n besh.", 'В ответе пять, а верно пятнадцать.', 'The answer says five, the right value is fifteen.') },
    ],
  },
  audio: [
    A('mount', "Blits yopildi. Endi boshqaning yechimiga qaraymiz.", 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: har bir satr alohida olganda to'g'ri. Xato bittasida. Uni toping.", 'Внимание: каждая строка по отдельности верна. Ошибка в одной. Найди её.', 'Careful: each line on its own is right. One holds the error. Find it.'),
    A('proof', "Qarang: ichki hosila uchinchi satrda topilgan, uch soni yozib ham qo'yilgan. To'rtinchi satrda esa u yo'qolgan, ya'ni ko'paytirish bajarilmagan. Murakkab funksiyada ikki hosila KO'PAYTIRILADI, va to'g'ri javob o'n besh karra qavsning to'rtinchi darajasi bo'ladi. Tekshiruv oson: qavs ichida uch iks turadi, demak javobda uchga bo'linadigan son turishi kerak.", 'Смотри: внутренняя производная найдена в третьей строке, тройка даже записана. А в четвёртой она исчезла, то есть умножение не выполнено. У сложной функции две производные УМНОЖАЮТСЯ, и верный ответ пятнадцать на скобку в четвёртой степени. Проверка простая: внутри скобки три икс, значит в ответе должно стоять число, делящееся на три.', 'Look: the inner derivative is found in the third line, the three is even written down. In the fourth line it vanished, so the multiplication was never done. In a composite function the two derivatives are MULTIPLIED, and the right answer is fifteen times the bracket to the fourth power. The check is easy: three x sits inside the bracket, so the answer must carry a number divisible by three.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: hosilani yig'ish.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'inner_k',
  right: '2/2',
  eyebrow: L('O\'zingiz yig\'ing', 'Собери сам', 'Build it yourself'),
  title: L('Hosilani yig\'ing', 'Собери производную', 'Build the derivative'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('ichki ko\'paytuvchi bormi', 'есть ли внутренний множитель', 'is the inner factor there'),
  tasks: [
    {
      prompt: L('(sin 4x) hosilasi', 'Производная (sin 4x)', 'The derivative of (sin 4x)'),
      template: [{ slot: 0 }, ' cos ', { slot: 1 }],
      parts: ['4', '4x', 'x', '1'],
      answer: ['4', '4x'],
      doneLabel: '4 cos 4x',
      wrongs: [
        { key: '1|4x', hint: L("Ichki hosila to'rtga teng, birga emas.", 'Внутренняя производная равна четырём, а не единице.', 'The inner derivative equals four, not one.') },
        { key: '4|x', hint: L("Kosinus ichidagi yozuv o'zgarmaydi: u to'rt iks dan olinadi.", 'Запись внутри косинуса не меняется: он от четырёх икс.', 'The record inside the cosine stays: it is of four x.') },
        { key: '*', hint: L("Tashqi hosila kosinus beradi, ichki hosila esa to'rt.", 'Внешняя производная даёт косинус, а внутренняя четыре.', 'The outer derivative gives the cosine, the inner one gives four.') },
      ],
    },
    {
      prompt: L('(x⁶) hosilasi', 'Производная (x⁶)', 'The derivative of (x⁶)'),
      template: [{ slot: 0 }, ' · x', { slot: 1 }],
      parts: ['6', '⁵', '5', '⁶'],
      answer: ['6', '⁵'],
      doneLabel: '6 · x⁵',
      wrongs: [
        { key: '5|⁵', hint: L("Oldiga ESKI ko'rsatkich chiqadi, ya'ni olti.", 'Вперёд выходит СТАРЫЙ показатель, то есть шесть.', 'The OLD exponent comes in front, that is six.') },
        { key: '6|⁶', hint: L("Ko'rsatkich bittaga kamayishi kerak.", 'Показатель должен уменьшиться на единицу.', 'The exponent must drop by one.') },
        { key: '*', hint: L("Olti oldiga chiqadi, ko'rsatkich esa besh bo'ladi.", 'Шесть выходит вперёд, а показатель становится пять.', 'Six comes in front, and the exponent becomes five.') },
      ],
    },
  ],
  audio: [
    A('mount', "Xato topildi. Oxirgi topshiriq teskari: hosila yozuvini yig'ish kerak.", 'Ошибка найдена. Последнее задание обратное: нужно собрать запись производной.', 'The error is found. The last task is reverse: the derivative record must be built.'),
    A('built1', "Endi ikkinchisi. Bu safar oddiy daraja.", 'Теперь второе. На этот раз простая степень.', 'Now the second. This time a plain power.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'product_not_product',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: L('jadval va besh qoida', 'таблица и пять правил', 'the table and five rules'),
  ruleLines: [
    L("jadvaldan QATOR tanlanadi", 'из таблицы ВЫБИРАЮТ строку', 'a ROW is chosen from the table'),
    L("ko'paytmada ikki qo'shiluvchi", 'в произведении два слагаемых', 'a product gives two terms'),
    L("qavs ichida funksiya bo'lsa, ichki ko'paytuvchi", 'если внутри скобки функция, нужен внутренний множитель', 'a function inside the bracket needs an inner factor'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L("ko'paytmaning hosilasi", 'производная произведения', 'the derivative of a product'),
      right: '12x + 14',
      map: { a: '6', b: '12x + 14', c: '6x + 14', d: '12x + 4' },
    },
    {
      screen: 5,
      expr: L("o'zgarmas qo'shiluvchi", 'постоянное слагаемое', 'a constant term'),
      right: L('nol', 'ноль', 'zero'),
      map: {
        a: L('nol', 'ноль', 'zero'),
        b: L('o\'zi', 'себя', 'itself'),
        c: L('bir', 'единица', 'one'),
        d: L('ko\'paytuvchi', 'множитель', 'a factor'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '6  →  12x + 14',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Jadval va ko'paytma qoidasiga qayting", 'Вернись к таблице и правилу произведения', 'Go back to the table and the product rule'),
  },
  probe: {
    question: L(
      "Nima uchun ko'paytmada ikki qo'shiluvchi chiqadi?",
      'Почему в произведении выходят два слагаемых?',
      'Why does a product give two terms?',
    ),
    items: [
      { id: 'a', label: L('ikkita ko\'paytuvchi ham o\'zgaradi', 'меняются оба множителя', 'both factors change'), correct: true },
      { id: 'b', label: L('shunday qisqaroq', 'так короче', 'it is shorter that way'), hint: L("Qisqalik masalasi emas: yoyilma ham xuddi shu javobni beradi.", 'Дело не в краткости: раскрытие даёт тот же ответ.', 'It is not about brevity: expanding gives the same answer.') },
      { id: 'c', label: L('jadvalda shunday', 'так в таблице', 'that is how the table has it'), hint: L("Jadvalda qoidalar yo'q, u faqat sof funksiyalarni beradi.", 'В таблице нет правил, она даёт только чистые функции.', 'The table holds no rules, it gives only clean functions.') },
      { id: 'd', label: L('bu shart emas', 'это не обязательно', 'it is not necessary'), hint: L("Shart: bitta qo'shiluvchi qoldirilsa, javob xato bo'ladi.", 'Обязательно: если оставить одно слагаемое, ответ будет неверным.', 'It is necessary: keeping one term gives a wrong answer.') },
    ],
  },
  sheetTitle: L('Jadval va qoidalar · shpargalka', 'Таблица и правила · шпаргалка', 'The table and rules · cheat sheet'),
  sheetSrc: L('11-sinf · 44-dars', '11 класс · урок 44', 'Grade 11 · lesson 44'),
  lifehack: L(
    "Qavs ichiga qarang: u yerda iks dan boshqa narsa bo'lsa, ichki ko'paytuvchi kerak.",
    'Посмотри внутрь скобки: если там не просто икс, нужен внутренний множитель.',
    'Look inside the bracket: if it is not just x, an inner factor is needed.',
  ),
  holds: [3000, 6500, 7000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Ko'paytmaning hosilasi o'n ikki iks plyus o'n to'rt, va o'zgarmas qo'shiluvchi nol beradi.", 'Вот твои прогнозы и вот как оказалось. Производная произведения двенадцать икс плюс четырнадцать, а постоянное слагаемое даёт ноль.', 'Here are your guesses and here is how it turned out. The derivative of the product is twelve x plus fourteen, and a constant term gives zero.'),
    A('rule', "Va mana darsning umumiy fikri. Hosilani limit bilan izlash shart emas: jadval bor, va undan mos QATOR tanlanadi. Qoidalar esa funksiyalarni bir-biriga bog'laydi. Ko'paytmada ikki qo'shiluvchi chiqadi, bo'linmada minus va maxraj kvadrati, qavs ichida funksiya bo'lsa esa ichki ko'paytuvchi qo'shiladi. Keyingi darsda shu hosila bilan urinma yasaladi va funksiya tekshiriladi.", 'И вот общая мысль урока. Производную не обязательно искать пределом: есть таблица, и из неё выбирают подходящую строку. А правила связывают функции между собой. В произведении выходят два слагаемых, в частном минус и квадрат знаменателя, а если внутри скобки функция, добавляется внутренний множитель. На следующем уроке этой производной построят касательную и исследуют функцию.', 'And here is the shared thought of the lesson. The derivative need not be hunted with a limit: there is a table, and the right ROW is chosen from it. The rules join the functions together. A product gives two terms, a quotient a minus and a squared bottom, and a function inside a bracket adds an inner factor. In the next lesson this derivative builds a tangent and studies a function.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
