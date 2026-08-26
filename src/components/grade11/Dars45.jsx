// ============================================================================
// 11-sinf, Dars 45. URINMA VA FUNKSIYANI TEKSHIRISH.
//
// B6 blokining uchinchi darsi, hosila mavzusining oxirgisi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SecantBoard`, `tangent` va `sign` rejimlari
//   darslik:  1-qism, 34-49-betlar (13-14 va 18-21 soatlar): urinma
//             tenglamasi 34-bet, o'sish va kamayish 42-bet, ekstremumlar
//             44-bet, eng katta qiymat 44-bet
//
// DARSNING BITTA GAPI: nuqtadagi hosila urinma tenglamasini beradi, hosila
// ISHORASI o'sish va kamayishni beradi, hosilaning noli esa faqat NOMZOD.
//
// SONLAR TEKSHIRILDI:
//   f = x² − 5x, x₀ = 2:  f(2) = −6,  f'(2) = −1  ->  y = −x − 4   [darslik 34-bet]
//   xato yo'l: f'(x) ni qo'yish -> (2x − 5)(x − 2) − 6 = 2x² − 9x + 4, bu PARABOLA
//   x₀ = 3:  f(3) = −6,  f'(3) = 1  ->  y = x − 9
//   gorizontal urinma: 2x − 5 = 0  ->  x = 2,5
//   f = x³ − 3x + 3:  f' = 3(x − 1)(x + 1);  −2 da 9;  0 da −3;  1 da 0;  2 da 9
//     lokal maksimum x = −1 (qiymat 5), lokal minimum x = 1 (qiymat 1)  [44-bet]
//   kubning ekstremumi YO'Q: f' = 3x² nolga faqat bir nuqtada teng, ishora
//     o'zgarmaydi -> ekstremum soni nol
//   zanjir: f = x² − 4x, x₀ = 1:  f(1) = −3,  f'(1) = −2  ->  y = −2x − 1
//   mustaqil: f = x² − 6x + 5,  f' = 2x − 6 = 0  ->  x = 3
//   blits: x² ning 3 dagi qiyaligi 6;  (4; 1) va k = 2 -> y = 2x − 7;
//          f' = 3x² + 1 hamma joyda musbat;  [0; 3] da eng katta qiymat uchida
//   audit: f = x³ − 3x² + 3x,  f' = 3(x − 1)², ishora o'zgarmaydi -> ekstremum yo'q
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_45',
  title: L('Urinma va funksiyani tekshirish', 'Касательная и исследование функции', 'The tangent and studying a function'),
}

const BLOCK = { label: 'B6', from: 43, to: 49, current: 45 }

const CUB = (x) => x * x * x - 3 * x + 3

// ============================================================
// SLAYD 1. XUK. Urinma tenglamasi: ikki yozuv (darslik 34-bet).
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Urinma', 'Касательная', 'The tangent'),
  title: L('Qaysi yozuv urinma', 'Какая запись касательная', 'Which record is a tangent'),
  expr: L('f = x² − 5x,  nuqta 2', 'f = x² − 5x,  точка 2', 'f = x² − 5x,  the point 2'),
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: 'y = −x − 4',
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: 'y = 2x² − 9x + 4',
    },
  ],
  probe: {
    question: L(
      "Qaysi yozuv urinma bo'lishi mumkin?",
      'Какая запись может быть касательной?',
      'Which record can be a tangent?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi tekshiramiz.',
      'Твой ответ записан. Сейчас проверим.',
      'Your answer is saved. Now we will check.',
    ),
    items: [
      { id: 'a', label: 'y = −x − 4' },
      { id: 'b', label: 'y = 2x² − 9x + 4' },
      { id: 'c', label: 'y = −x + 4' },
      { id: 'd', label: 'y = −6' },
    ],
  },
  holds: [4000, 5500, 5500],
  audio: [
    A('mount', "Hosila topish o'rganildi. Endi undan foydalanamiz.", 'Находить производную научились. Теперь будем ею пользоваться.', 'Finding the derivative is learned. Now we will use it.'),
    A('r1', "Karim urinma tenglamasini yozdi va uning javobi minus iks minus to'rt.", 'Карим записал уравнение касательной, и его ответ минус икс минус четыре.', 'Karim wrote the tangent equation, and his answer is minus x minus four.'),
    A('r2', "Nargiza xuddi shu formuladan foydalandi, lekin uning javobida iks kvadrat bor.", 'Наргиза пользовалась той же формулой, но в её ответе есть икс квадрат.', 'Nargiza used the same formula, but her answer has x squared in it.'),
    A('ask', "Sizningcha qaysi yozuv urinma bo'lishi mumkin. Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая запись может быть касательной. Пока просто предположи.', 'Which record do you think can be a tangent. Just make a guess for now.'),
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
    "Biri kechagi darsdan, ikkitasi quyi sinflardan. Bu baholanmaydi.",
    'Одна с прошлого урока, две из младших классов. Это не оценивается.',
    'One from the last lesson, two from earlier grades. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L("To'g'ri chiziq tenglamasi", 'Уравнение прямой', 'The equation of a line'),
      short: L('nuqta va qiyalik', 'точка и наклон', 'a point and a slope'),
      ex: [{ e: 'y − y₀ = k (x − x₀)', why: L('bitta nuqta yetadi', 'хватает одной точки', 'one point is enough') }],
    },
    {
      id: 'c2',
      title: L('Jadval', 'Таблица', 'The table'),
      short: L('kechagi darsdan', 'с прошлого урока', 'from the last lesson'),
      ex: [{ e: 'xᵖ → p · xᵖ⁻¹', why: L("ko'rsatkich oldiga", 'показатель вперёд', 'the exponent in front') }],
    },
    {
      id: 'c3',
      title: L("Ko'paytmaning ishorasi", 'Знак произведения', 'The sign of a product'),
      short: L('oraliqlar usuli', 'метод интервалов', 'the interval method'),
      ex: [{ e: '(x − 1)(x + 1)', why: L('ikki nuqta, uch oraliq', 'две точки, три промежутка', 'two points, three intervals') }],
    },
  ],
  tasks: [
    {
      id: 't1',
      prompt: L('(2; 5) nuqtadan k = 3 bilan?', 'Через (2; 5) с k = 3?', 'Through (2; 5) with k = 3?'),
      items: [
        { id: 'a', label: 'y − 5 = 3 (x − 2)', correct: true },
        { id: 'b', label: 'y − 2 = 3 (x − 5)', hint: L("Koordinatalar joyini almashtirgan: avval abssissa, keyin ordinata.", 'Координаты поменялись местами: сначала абсцисса, потом ордината.', 'The coordinates swapped: the abscissa first, then the ordinate.') },
        { id: 'c', label: 'y + 5 = 3 (x + 2)', hint: L("Ishoralar teskari: formulada ayirma turadi.", 'Знаки обратные: в формуле стоит разность.', 'The signs are reversed: the formula has differences.') },
        { id: 'd', label: 'y = 3x', hint: L("Nuqta ishlatilmagan: bu chiziq boshdan o'tadi.", 'Точка не использована: эта линия проходит через начало.', 'The point is unused: that line goes through the origin.') },
      ],
    },
    {
      id: 't2',
      prompt: L('(x − 1)(x + 1) qayerda manfiy?', 'Где (x − 1)(x + 1) отрицательно?', 'Where is (x − 1)(x + 1) negative?'),
      items: [
        { id: 'a', label: '(−1; 1)', correct: true },
        { id: 'b', label: '(1; +∞)', hint: L("O'ng oraliqda ikki ko'paytuvchi ham musbat, demak ko'paytma musbat.", 'В правом промежутке оба множителя положительны, значит произведение положительно.', 'In the right interval both factors are positive, so the product is positive.') },
        { id: 'c', label: '(−∞; −1)', hint: L("Chapda ikkisi ham manfiy, va minus karra minus plyus beradi.", 'Слева оба отрицательны, а минус на минус даёт плюс.', 'On the left both are negative, and minus times minus gives plus.') },
        { id: 'd', label: L('hech qayerda', 'нигде', 'nowhere'), hint: L("Ichkarida bitta ko'paytuvchi manfiy, ikkinchisi musbat.", 'Внутри один множитель отрицателен, другой положителен.', 'Inside, one factor is negative and the other positive.') },
      ],
    },
  ],
  holds: [3600, 4200, 4200, 3200],
  audio: [
    A('mount', "Uchta tayanch kerak: biri kechagi darsdan, ikkitasi esa quyi sinflardan.", 'Нужны три опоры: одна с прошлого урока, две из младших классов.', 'Three basics are needed: one from the last lesson, two from earlier grades.'),
    A('c1', "Birinchisi to'g'ri chiziq tenglamasi. Bitta nuqta va qiyalik berilsa, chiziq to'liq aniqlanadi.", 'Первая это уравнение прямой. Если даны одна точка и наклон, прямая определена полностью.', 'The first is the equation of a line. Given one point and a slope, the line is fully determined.'),
    A('c3', "Uchinchisi oraliqlar usuli. Ko'paytmaning ishorasi ildizlar orasida almashadi, va bugun bu kerak bo'ladi.", 'Третья это метод интервалов. Знак произведения меняется между корнями, и сегодня это понадобится.', 'The third is the interval method. The sign of a product flips between the roots, and that will be needed today.'),
    A('t1', "Ikkita savol.", 'Два вопроса.', 'Two questions.'),
  ],
}

// ============================================================
// SLAYD 3. NUQTALAR. Hosila ishorasi to'rtta nuqtada.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'deriv_sign_monotone',
  eyebrow: L('Ishorani sanaymiz', 'Считаем знак', 'Counting the sign'),
  title: L('Hosila qayerda musbat', 'Где производная положительна', 'Where the derivative is positive'),
  expr: 'f ′ = 3 (x − 1)(x + 1)',
  goal: L('musbat nuqtalarni ajratish', 'отделить положительные точки', 'separate the positive points'),
  rule: L(
    "Har bir nuqtada hosilaning ishorasini o'qiymiz.",
    'В каждой точке читаем знак производной.',
    'At each point we read the sign of the derivative.',
  ),
  pick: L('Qaysi nuqtani tekshiramiz?', 'Какую точку проверим?', 'Which point shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('hamma joyda musbat', 'всюду положительна', 'positive everywhere'), value: L('hammasi', 'все', 'all') },
    { id: 'b', key: 'inB', name: L('bir joyda manfiy', 'где-то отрицательна', 'negative somewhere'), value: L('uchtasi', 'три', 'three') },
  ],
  points: [
    {
      id: 'q1', label: 'x = −2', num: '9', step: 'calc', verdict: 'in',
      calc: L('minus karra minus', 'минус на минус', 'minus times minus'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: 'x = 0', num: '−3', step: 'calc', verdict: 'out',
      calc: L('bittasi manfiy', 'один множитель минус', 'one factor is minus'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: 'x = 1', num: '0', step: 'calc', verdict: 'out',
      calc: L('qavs nolga aylandi', 'скобка стала нулём', 'the bracket became zero'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q4', label: 'x = 2', num: '9', step: 'calc', verdict: 'in',
      calc: L('ikkisi ham musbat', 'оба положительны', 'both are positive'),
      sol: true, inA: true, inB: true,
    },
  ],
  probe: {
    question: L(
      "Hosila manfiy bo'lgan oraliq bormi?",
      'Есть ли промежуток, где производная отрицательна?',
      'Is there an interval where the derivative is negative?',
    ),
    items: [
      { id: 'a', label: L('ha, ildizlar orasida', 'да, между корнями', 'yes, between the roots'), correct: true },
      { id: 'b', label: L("yo'q, hamma joyda musbat", 'нет, всюду положительна', 'no, positive everywhere'), hint: L("Nolda minus uch chiqdi, va bu manfiy son.", 'В нуле вышло минус три, а это отрицательное число.', 'At zero it gave minus three, and that is a negative number.') },
      { id: 'c', label: L('faqat manfiy iksda', 'только при отрицательном икс', 'only for negative x'), hint: L("Minus ikkida hosila musbat, ya'ni ishora iks ning ishorasidan kelib chiqmaydi.", 'В минус двух производная положительна, значит знак не следует из знака икс.', 'At minus two the derivative is positive, so the sign does not follow the sign of x.') },
      { id: 'd', label: L('hamma joyda manfiy', 'всюду отрицательна', 'negative everywhere'), hint: L("Ikki nuqtada to'qqiz chiqdi, va bu musbat.", 'В двух точках вышло девять, а это положительно.', 'At two points it gave nine, and that is positive.') },
    ],
  },
  holds: [3000, 4500, 2400, 2600, 9000],
  audio: [
    A('mount', "Taxmin bor. Endi hosilaning ishorasini sanaymiz.", 'Прогноз есть. Теперь посчитаем знак производной.', 'The guess is made. Now let us count the sign of the derivative.'),
    A('mount', "Ikki da'vo bor. Biri hosila hamma joyda musbat deydi, ikkinchisi bir oraliqda manfiy deydi.", 'Есть два утверждения. Одно говорит, что производная всюду положительна, другое, что на одном промежутке отрицательна.', 'There are two claims. One says the derivative is positive everywhere, the other that it is negative on one interval.'),
    A('mount', "To'rtta nuqtani birma bir tekshiramiz.", 'Проверим четыре точки по одной.', 'Let us check four points one by one.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana natija. Minus ikkida va ikkida hosila musbat, demak funksiya o'sadi. Nolda esa minus uch chiqdi: bu yerda funksiya kamayadi. Birda hosila nolga teng, va bu chegara nuqtasi. Demak birinchi da'vo yiqildi: kamayish oralig'i bor.", 'Вот результат. В минус двух и в двух производная положительна, значит функция возрастает. А в нуле вышло минус три: здесь функция убывает. В единице производная равна нулю, и это граничная точка. Значит первое утверждение упало: промежуток убывания есть.', 'Here is the result. At minus two and at two the derivative is positive, so the function rises. At zero it gave minus three: here the function falls. At one the derivative is zero, and that is a boundary point. So the first claim fell: there is an interval of decrease.'),
  ],
}

// ============================================================
// SLAYD 4. CHIZMA. Ishora lentasi va statsionar nuqtalar (darslik 44-bet).
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'stationary_not_extremum',
  drag: false,
  graphSteps: 3,
  eyebrow: L('Chizma', 'Чертёж', 'The drawing'),
  title: L('Ishora lentasi', 'Лента знака', 'The sign band'),
  chip: 'f = x³ − 3x + 3',
  secant: {
    fn: CUB,
    xDomain: [-2.4, 2.4],
    yDomain: [-4, 10],
    xTicks: [{ v: -2 }, { v: -1 }, { v: 1 }, { v: 2 }],
    yTicks: [{ v: 1 }, { v: 5 }],
    mode: 'sign',
    signs: [
      { from: -2.4, to: -1, sign: '+', showAt: 1 },
      { from: -1, to: 1, sign: '−', showAt: 1 },
      { from: 1, to: 2.4, sign: '+', showAt: 1 },
    ],
    marks: [
      { v: -1, label: '−1', showAt: 2 },
      { v: 1, label: '1', showAt: 3 },
    ],
    height: 190,
  },
  bonus: L(
    "Ishora plyusdan minusga o'tsa maksimum, minusdan plyusga o'tsa minimum.",
    'Знак сменился с плюса на минус это максимум, с минуса на плюс это минимум.',
    'A sign going from plus to minus is a maximum, from minus to plus a minimum.',
  ),
  probe: {
    question: L(
      'Minus birda nima bor?',
      'Что находится в минус единице?',
      'What sits at minus one?',
    ),
    items: [
      { id: 'a', label: L('lokal maksimum', 'локальный максимум', 'a local maximum'), correct: true },
      { id: 'b', label: L('lokal minimum', 'локальный минимум', 'a local minimum'), hint: L("Minimumda ishora minusdan plyusga o'tadi, bu yerda esa teskari.", 'В минимуме знак идёт с минуса на плюс, а здесь наоборот.', 'At a minimum the sign goes from minus to plus, here it is the other way.') },
      { id: 'c', label: L('eng katta qiymat', 'наибольшее значение', 'the greatest value'), hint: L("O'ngda funksiya yana ko'tariladi va bu qiymatni ortib ketadi: maksimum LOKAL.", 'Справа функция снова поднимается и перерастёт это значение: максимум ЛОКАЛЬНЫЙ.', 'On the right the function rises again and passes this value: the maximum is LOCAL.') },
      { id: 'd', label: L('hech nima', 'ничего', 'nothing'), hint: L("Ishora aynan shu nuqtada almashadi, demak bu alohida nuqta.", 'Знак меняется именно в этой точке, значит она особая.', 'The sign flips exactly at this point, so it is special.') },
    ],
  },
  holds: [4500, 6000, 4000],
  audio: [
    A('mount', "Endi butun o'q bo'ylab qaraymiz. Hosilaning ishorasi grafik ostidagi lentada turadi.", 'Теперь посмотрим по всей оси. Знак производной стоит в ленте под графиком.', 'Now let us look along the whole axis. The sign of the derivative sits in the band under the graph.'),
    A('mount', "Chapda plyus, o'rtada minus, o'ngda yana plyus. Grafik shu lentani takrorlaydi: ko'tariladi, tushadi, yana ko'tariladi.", 'Слева плюс, в середине минус, справа снова плюс. График повторяет эту ленту: поднимается, опускается, снова поднимается.', 'Plus on the left, minus in the middle, plus again on the right. The graph repeats that band: it rises, falls, rises again.'),
    A('mount', "Birinchi chegara minus birda. Shu joyda funksiya ko'tarilishni to'xtatib tusha boshlaydi, ya'ni lokal maksimum.", 'Первая граница в минус единице. Здесь функция прекращает подъём и начинает спуск, то есть локальный максимум.', 'The first boundary is at minus one. There the function stops rising and starts falling, that is a local maximum.'),
    A('mount', "Ikkinchi chegara birda, va u lokal minimum.", 'Вторая граница в единице, и это локальный минимум.', 'The second boundary is at one, and it is a local minimum.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1. Urinma tenglamasi (darslik 34-bet).
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'tangent_point',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 2,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Urinma tenglamasi', 'Уравнение касательной', 'The tangent equation'),
  rows: [
    { text: L('tegish nuqtasi: f (x₀)', 'точка касания: f (x₀)', 'the point of tangency: f (x₀)') },
    { text: L('qiyalik: f ′ (x₀)', 'наклон: f ′ (x₀)', 'the slope: f ′ (x₀)') },
    { text: 'y − f (x₀) = f ′ (x₀) (x − x₀)' },
  ],
  probe: {
    question: L(
      "Tenglamada qaysi harf o'zgaruvchi bo'lib qoladi?",
      'Какая буква остаётся переменной в уравнении?',
      'Which letter stays a variable in the equation?',
    ),
    items: [
      { id: 'a', label: 'x', correct: true },
      { id: 'b', label: 'x₀', hint: L("Iks nol -- tegish nuqtasining abssissasi, ya'ni SON.", 'Икс нулевое это абсцисса точки касания, то есть ЧИСЛО.', 'x zero is the abscissa of the point of tangency, that is a NUMBER.') },
      { id: 'c', label: 'f ′ (x₀)', hint: L("Bu ham son: hosila NUQTADA hisoblanadi.", 'Это тоже число: производную считают В ТОЧКЕ.', 'That is a number too: the derivative is computed AT THE POINT.') },
      { id: 'd', label: 'f (x₀)', hint: L("Bu tegish nuqtasining ordinatasi, ya'ni son.", 'Это ордината точки касания, то есть число.', 'That is the ordinate of the point of tangency, a number.') },
    ],
  },
  rule: {
    title: L('Uch qadam', 'Три шага', 'Three steps'),
    lines: [
      L('nuqtadagi qiymatni hisoblash', 'посчитать значение в точке', 'compute the value at the point'),
      L('hosilani nuqtada hisoblash', 'посчитать производную в точке', 'compute the derivative at the point'),
      L("ikkisini tenglamaga qo'yish", 'подставить оба в уравнение', 'put both into the equation'),
    ],
  },
  holds: [4200, 5000, 5000],
  audio: [
    A('mount', "Urinma to'g'ri chiziq, va unga bitta nuqta hamda qiyalik yetadi. Nuqtani funksiyaning o'zi beradi.", 'Касательная это прямая, и ей хватает одной точки и наклона. Точку даёт сама функция.', 'A tangent is a line, and one point with a slope is enough. The function itself gives the point.'),
    A('mount', "Qiyalikni esa hosila beradi, va u aynan tegish nuqtasida hisoblanadi.", 'А наклон даёт производная, и она считается именно в точке касания.', 'The slope comes from the derivative, computed exactly at the point of tangency.'),
    A('rule', "Shundan keyin tenglama yoziladi. Diqqat: hosila oldin SON ga aylantiriladi, keyin qo'yiladi. Agar hosila harf bilan qo'yilsa, natija to'g'ri chiziq bo'lmaydi.", 'После этого записывают уравнение. Внимание: производную сначала превращают в ЧИСЛО, потом подставляют. Если подставить производную с буквой, результат не будет прямой.', 'Then the equation is written. Careful: the derivative is first turned into a NUMBER, then substituted. If it is substituted with the letter, the result is not a line.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT. Boshqa nuqta va gorizontal urinma.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'tangent_point',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L("Nuqta o'zgardi", 'Точка изменилась', 'The point has changed'),
  was: { label: UI.was, expr: 'x₀ = 2  →  y = −x − 4' },
  now: { label: UI.now, expr: 'x₀ = 3  →  y = x − 9' },
  probe1: {
    cols: 2,
    question: L(
      'Urinma qaysi nuqtada gorizontal?',
      'В какой точке касательная горизонтальна?',
      'At which point is the tangent horizontal?',
    ),
    items: [
      { id: 'a', label: 'x = 2,5', correct: true },
      { id: 'b', label: 'x = 5', hint: L("Ikki iks minus besh nolga teng bo'lganda iks ikki butun besh chiqadi.", 'Когда два икс минус пять равно нулю, икс выходит два целых пять.', 'When two x minus five equals zero, x comes out two point five.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L(
      'Kubning nechta ekstremumi bor?',
      'Сколько экстремумов у куба?',
      'How many extrema does the cube have?',
    ),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '0' },
      { id: 'b', label: '1' },
      { id: 'c', label: '2' },
      { id: 'd', label: '3' },
    ],
  },
  holds: [4000, 6000, 4200, 4000],
  audio: [
    A('mount', "Formula bitta, nuqta esa har xil bo'lishi mumkin.", 'Формула одна, а точка может быть разной.', 'The formula is one, the point may differ.'),
    A('now', "Uchinchi nuqtada funksiyaning qiymati yana minus olti, lekin hosila endi bir. Shu sababli urinma boshqacha: iks minus to'qqiz.", 'В точке три значение функции снова минус шесть, но производная теперь один. Поэтому касательная другая: икс минус девять.', 'At the point three the value is again minus six, but the derivative is now one. So the tangent differs: x minus nine.'),
    A('q1', "Endi savol: urinma qaysi nuqtada gorizontal bo'ladi.", 'Теперь вопрос: в какой точке касательная будет горизонтальной.', 'Now a question: at which point will the tangent be horizontal.'),
    A('q2', "Va taxmin qiling: kub funksiyasining nechta ekstremumi bor.", 'И предположи: сколько экстремумов у функции куб.', 'And make a guess: how many extrema does the cube function have.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI YO'L. Statsionar nuqta ekstremum emas.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'stationary_not_extremum',
  eyebrow: L("Ikki yo'l", 'Два пути', 'Two paths'),
  title: L('Kubda nol bor, ekstremum bormi', 'В кубе ноль есть, а экстремум', 'The cube has a zero, but an extremum'),
  expr: 'f = x³,  f ′ = 3x²',
  need: L('ekstremumlar soni', 'число экстремумов', 'the number of extrema'),
  answerLabel: L("to'g'ri javob", 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      // Kartochka matni o'ralmaydi: telefonda ~22 belgi sig'adi. To'liq
      // fikrni ovoz aytadi, ekranda esa XULOSA turadi.
      txt: L('ekstremum bor', 'экстремум есть', 'an extremum exists'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '1',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('ishora almashmadi', 'знак не сменился', 'the sign held'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '0',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['0', '1', '2', '3'],
    value: ['0'],
    label: L('ekstremumlar soni =', 'число экстремумов =', 'number of extrema ='),
    prompt: L('Sonini yozing', 'Запиши число', 'Write the number'),
    wrongs: [
      { key: '1', hint: L("Statsionar nuqta bitta, lekin ekstremum uchun ishora ALMASHISHI kerak. Uch iks kvadrat ikki tomonda ham musbat.", 'Стационарная точка одна, но для экстремума знак должен СМЕНИТЬСЯ. Три икс квадрат положительно с двух сторон.', 'There is one stationary point, but an extremum needs the sign to FLIP. Three x squared is positive on both sides.') },
      { key: '2', hint: L("Hosila faqat bitta nuqtada nolga aylanadi: uch iks kvadrat nolga faqat nolda teng.", 'Производная обращается в ноль только в одной точке: три икс квадрат равно нулю только в нуле.', 'The derivative vanishes at only one point: three x squared is zero only at zero.') },
      { key: '3', hint: L("Uchta nol bo'lishi uchun hosila uchinchi darajali bo'lishi kerak edi.", 'Чтобы было три нуля, производная должна быть третьей степени.', 'For three zeros the derivative would have to be cubic.') },
      { key: '*', hint: L("Ishora ikki tomonda bir xil, demak ekstremum yo'q.", 'Знак с двух сторон одинаков, значит экстремума нет.', 'The sign is the same on both sides, so there is no extremum.') },
    ],
  },
  holds: [4200, 5000, 6000],
  audio: [
    A('mount', "Taxmin yozildi. Endi ikki o'quvchi ikki xil fikrda.", 'Догадка записана. Теперь два ученика думают по-разному.', 'The guess is saved. Now two students think differently.'),
    A('p1', "Aziz hosilani nolga tenglashtirdi va bitta nuqta topdi. Uning xulosasi: ekstremum bitta.", 'Азиз приравнял производную к нулю и нашёл одну точку. Его вывод: экстремум один.', 'Aziz set the derivative to zero and found one point. His conclusion: one extremum.'),
    A('p2', "Dilnoza esa ishorani tekshirdi. Uch iks kvadrat nolning chapida ham, o'ngida ham musbat. Funksiya to'xtamasdan o'sadi, demak ekstremum yo'q. Statsionar nuqta faqat NOMZOD, hukm esa ishorada.", 'А Дилноза проверила знак. Три икс квадрат положительно и слева от нуля, и справа. Функция растёт без остановки, значит экстремума нет. Стационарная точка это только КАНДИДАТ, а решает знак.', 'Dilnoza checked the sign. Three x squared is positive both left and right of zero. The function rises without stopping, so there is no extremum. A stationary point is only a CANDIDATE, the sign decides.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2. Tekshirish qoidasi (darslik 42 va 44-betlar).
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'stationary_not_extremum',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Ishora hukm chiqaradi', 'Знак решает', 'The sign decides'),
  cases: [
    {
      tag: L('ishora almashdi', 'знак сменился', 'the sign flipped'),
      txt: L('plyusdan minusga maksimum, minusdan plyusga minimum', 'с плюса на минус максимум, с минуса на плюс минимум', 'plus to minus a maximum, minus to plus a minimum'),
    },
    {
      tag: L("ishora o'zgarmadi", 'знак не изменился', 'the sign held'),
      txt: L("ekstremum yo'q, funksiya o'z yo'lida davom etadi", 'экстремума нет, функция продолжает свой путь', 'no extremum, the function keeps going'),
    },
  ],
  rows: [
    { text: L("f ′ > 0  →  o'sadi", 'f ′ > 0  →  возрастает', 'f ′ > 0  →  rises') },
    { text: L('f ′ < 0  →  kamayadi', 'f ′ < 0  →  убывает', 'f ′ < 0  →  falls') },
    { text: L('f ′ = 0  →  nomzod', 'f ′ = 0  →  кандидат', 'f ′ = 0  →  a candidate') },
  ],
  probe: {
    question: L(
      'Hosila nolga teng. Bu nimani beradi?',
      'Производная равна нулю. Что это даёт?',
      'The derivative is zero. What does that give?',
    ),
    items: [
      { id: 'a', label: L('faqat nomzodni', 'только кандидата', 'only a candidate'), correct: true },
      { id: 'b', label: L('maksimumni', 'максимум', 'a maximum'), hint: L("Maksimum uchun ishora plyusdan minusga o'tishi kerak, faqat nol yetmaydi.", 'Для максимума знак должен пройти с плюса на минус, одного нуля мало.', 'For a maximum the sign must pass from plus to minus, a zero alone is not enough.') },
      { id: 'c', label: L('minimumni', 'минимум', 'a minimum'), hint: L("Minimum uchun ham ishora almashishi kerak, lekin teskari tomonga.", 'Для минимума знак тоже должен смениться, но в другую сторону.', 'A minimum also needs the sign to flip, but the other way.') },
      { id: 'd', label: L('hech nimani', 'ничего', 'nothing'), hint: L("Nol bekorga emas: ekstremum FAQAT shunday nuqtalarda bo'lishi mumkin.", 'Ноль не напрасен: экстремум может быть ТОЛЬКО в таких точках.', 'The zero is not useless: an extremum can appear ONLY at such points.') },
    ],
  },
  rule: {
    title: L('Tekshirish tartibi', 'Порядок исследования', 'The order of study'),
    lines: [
      L('hosilani topish', 'найти производную', 'find the derivative'),
      L('nollarini topish', 'найти её нули', 'find its zeros'),
      L("har oraliqda ishorani qo'yish", 'расставить знак на промежутках', 'place the sign on the intervals'),
    ],
  },
  swap: {
    title: L('Jamlanma', 'Свод', 'The summary'),
    lines: [
      L('nol nomzodni beradi', 'ноль даёт кандидата', 'the zero gives a candidate'),
      L('ishora hukmni beradi', 'знак даёт решение', 'the sign gives the verdict'),
    ],
  },
  holds: [4000, 7000, 3200],
  audio: [
    A('mount', "Ikki holat ko'rildi: kubda ekstremum yo'q, uchinchi darajali funksiyada esa ikkita bor.", 'Два случая рассмотрены: у куба экстремума нет, а у функции третьей степени их два.', 'Two cases have been seen: the cube has none, the cubic on the drawing has two.'),
    A('mount', "Farq ishorada. Ishora almashsa, funksiya yo'nalishini o'zgartiradi, va bu ekstremum. Plyusdan minusga o'tish maksimum, minusdan plyusga o'tish minimum. Ishora o'zgarmasa esa funksiya shunchaki davom etadi.", 'Разница в знаке. Если знак меняется, функция меняет направление, и это экстремум. С плюса на минус максимум, с минуса на плюс минимум. Если знак не меняется, функция просто продолжает путь.', 'The difference is the sign. If it flips, the function changes direction, and that is an extremum. Plus to minus a maximum, minus to plus a minimum. If it holds, the function simply carries on.'),
    A('rule', "Shuning uchun tekshirish tartibi shunday: hosila, uning nollari, keyin ishoralar.", 'Поэтому порядок исследования такой: производная, её нули, потом знаки.', 'So the order of study is: the derivative, its zeros, then the signs.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZINGIZ QO'YING.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'deriv_sign_monotone',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L("Ishorani qo'ying", 'Поставь знак', 'Place the sign'),
  left: L(
    "Birdan o'ngda O'SADI",
    'Правее 1 функция РАСТЁТ',
    'Right of 1 it RISES',
  ),
  template: ['(1; +∞) da  f ′  ', { slot: 0 }, ' 0'],
  signs: ['>', '<'],
  answer: '>',
  checkNote: L(
    "o'sish musbat hosilaga to'g'ri keladi",
    'возрастанию отвечает положительная производная',
    'growth matches a positive derivative',
  ),
  wrongs: [
    { key: '<', hint: L("Manfiy hosila kamayishni beradi, chizmada esa funksiya ko'tariladi.", 'Отрицательная производная даёт убывание, а на чертеже функция поднимается.', 'A negative derivative gives a decrease, but on the drawing the function rises.') },
  ],
  probe: {
    question: L(
      "O'sish oralig'i qanday topiladi?",
      'Как находят промежуток возрастания?',
      'How is an interval of increase found?',
    ),
    items: [
      { id: 'a', label: L("hosila musbat bo'lgan joyda", 'там, где производная положительна', 'where the derivative is positive'), correct: true },
      { id: 'b', label: L("funksiya musbat bo'lgan joyda", 'там, где функция положительна', 'where the function is positive'), hint: L("Funksiyaning ishorasi boshqa narsa: manfiy funksiya ham o'sishi mumkin.", 'Знак функции это другое: отрицательная функция тоже может возрастать.', 'The sign of the function is different: a negative function may rise too.') },
      { id: 'c', label: L('hosila nolga teng joyda', 'там, где производная ноль', 'where the derivative is zero'), hint: L("Nol faqat chegara, oraliq esa nollar ORASIDA turadi.", 'Ноль это только граница, а промежуток лежит МЕЖДУ нулями.', 'A zero is only a boundary, the interval lies BETWEEN the zeros.') },
      { id: 'd', label: L('grafikni yasab', 'построив график', 'by drawing the graph'), hint: L("Grafik hosiladan KEYIN yasaladi: aks holda uni nima bilan yasash kerak.", 'График строят ПОСЛЕ производной: иначе чем его строить.', 'The graph is drawn AFTER the derivative: otherwise there is nothing to draw it with.') },
    ],
  },
  audio: [
    A('mount', "Endi ishorani o'zingiz qo'yasiz. Birdan o'ngda funksiya o'sadi.", 'Теперь знак ставишь сам. Правее единицы функция возрастает.', 'Now you place the sign yourself. To the right of one the function rises.'),
    A('write', "Hosila qanday bo'ladi.", 'Какой будет производная.', 'What will the derivative be.'),
  ],
}

// Zanjir amallari: urinma va ekstremum masalalarining amallari BIR
// ro'yxatda. Tanlov haqiqiy bo'lishi kerak.
const ACTIONS_45 = [
  { id: 'val', label: L('nuqtadagi qiymatni hisoblash', 'посчитать значение в точке', 'compute the value at the point') },
  { id: 'der', label: L('hosilani topish', 'найти производную', 'find the derivative') },
  { id: 'at', label: L('hosilani nuqtada hisoblash', 'посчитать производную в точке', 'compute the derivative at the point') },
  { id: 'eq', label: L("tenglamaga qo'yish", 'подставить в уравнение', 'put into the equation') },
  { id: 'zero', label: L('nolga tenglashtirish', 'приравнять к нулю', 'set equal to zero') },
]

// ============================================================
// SLAYD 10. ZANJIR. Urinma tenglamasi to'liq.
// ============================================================
const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'tangent_point',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Urinmani yozamiz', 'Записываем касательную', 'Writing the tangent'),
  start: 'f = x² − 4x,  x₀ = 1',
  actions: ACTIONS_45,
  steps: [
    {
      action: 'val',
      to: 'f (1) = −3',
      wrongs: [
        { action: 'eq', hint: L("Tenglamaga qo'yish uchun avval ikkita son kerak.", 'Чтобы подставить в уравнение, нужны сначала два числа.', 'To substitute into the equation two numbers are needed first.') },
        { action: 'zero', hint: L("Nolga tenglashtirish ekstremum masalasida kerak bo'ladi.", 'Приравнивать к нулю понадобится в задаче об экстремуме.', 'Setting to zero will be needed in the extremum task.') },
      ],
    },
    {
      action: 'der',
      to: 'f ′ (x) = 2x − 4',
      wrongs: [
        { action: 'val', hint: L("Qiymat topildi: minus uch.", 'Значение найдено: минус три.', 'The value is found: minus three.') },
        { action: 'at', hint: L("Nuqtada hisoblash uchun avval hosila formulasi kerak.", 'Чтобы считать в точке, нужна сначала формула производной.', 'To compute at a point the derivative formula is needed first.') },
      ],
    },
    {
      action: 'at',
      to: 'f ′ (1) = −2',
      wrongs: [
        { action: 'der', hint: L("Hosila topildi: ikki iks minus to'rt.", 'Производная найдена: два икс минус четыре.', 'The derivative is found: two x minus four.') },
        { action: 'eq', hint: L("Hosila hali SON emas: uni nuqtada hisoblash kerak.", 'Производная пока не ЧИСЛО: её надо посчитать в точке.', 'The derivative is not a NUMBER yet: it must be computed at the point.') },
      ],
    },
    {
      action: 'eq',
      to: 'y = −2x − 1',
      wrongs: [
        { action: 'zero', hint: L("Bu masalada nolga tenglashtirish kerak emas.", 'В этой задаче приравнивать к нулю не нужно.', 'No need to set anything to zero here.') },
        { action: 'at', hint: L("Hosila nuqtada allaqachon hisoblangan: minus ikki.", 'Производная в точке уже посчитана: минус два.', 'The derivative at the point is already computed: minus two.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['y = −2x − 1', 'y = −2x + 1', 'y = −3x − 2', 'y = 2x − 5'],
    value: ['y = −2x − 1'],
    label: L('urinma:', 'касательная:', 'tangent:'),
    prompt: L('Tenglamani yozing', 'Запиши уравнение', 'Write the equation'),
    wrongs: [
      { key: 'y = −2x + 1', hint: L("Ozod hadda xato: minus uch plyus ikki minus bir beradi.", 'Ошибка в свободном члене: минус три плюс два даёт минус один.', 'The free term is wrong: minus three plus two gives minus one.') },
      { key: 'y = −3x − 2', hint: L("Qiyalik o'rniga funksiyaning qiymati qo'yilgan: minus uch bu f dan olingan son.", 'Вместо наклона подставлено значение функции: минус три это число из f.', 'The value of the function was used as the slope: minus three comes from f.') },
      { key: 'y = 2x − 5', hint: L("Ishora yo'qolgan: hosila birinchi nuqtada minus ikki.", 'Потерян знак: производная в точке один равна минус двум.', 'The sign is lost: the derivative at one is minus two.') },
      { key: '*', hint: L("y plyus uch minus ikki karra iks minus birga teng, ochilsa y minus ikki iks minus bir.", 'y плюс три равно минус два на икс минус один, раскрыв получаем y равно минус два икс минус один.', 'y plus three equals minus two times x minus one, expanding gives y equals minus two x minus one.') },
    ],
  },
  audio: [
    A('mount', "Ishora qo'yildi. Endi urinmani boshdan oxirigacha yozamiz.", 'Знак поставлен. Теперь запишем касательную от начала до конца.', 'The sign is placed. Now let us write the tangent from start to finish.'),
    A('start', "Diqqat: ro'yxatda ekstremum masalasining amali ham bor. U hozir ortiqcha.", 'Внимание: в списке есть и действие задачи об экстремуме. Сейчас оно лишнее.', 'Careful: the list also holds an action of the extremum task. It is superfluous now.'),
    A('step5', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL. Ekstremum nuqtasi.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'stationary_not_extremum',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Minimum qayerda', 'Где минимум', 'Where the minimum is'),
  start: 'f = x² − 6x + 5',
  actions: ACTIONS_45,
  hint: L(
    "Parabola tarmoqlari tepaga qaragan, demak nomzod minimum bo'ladi.",
    'Ветви параболы смотрят вверх, значит кандидат окажется минимумом.',
    'The parabola opens upward, so the candidate will be a minimum.',
  ),
  steps: [
    {
      action: 'der',
      to: 'f ′ (x) = 2x − 6',
      wrongs: [
        { action: 'val', hint: L("Qiymat kerak emas: bizga nuqta emas, ekstremum kerak.", 'Значение не нужно: нам нужен экстремум, а не точка.', 'The value is not needed: we want an extremum, not a point.') },
        { action: 'eq', hint: L("Urinma tenglamasi bu masalada so'ralmagan.", 'Уравнение касательной в этой задаче не спрашивают.', 'The tangent equation is not asked here.') },
      ],
    },
    {
      action: 'zero',
      to: 'x = 3',
      wrongs: [
        { action: 'der', hint: L("Hosila topildi: ikki iks minus olti.", 'Производная найдена: два икс минус шесть.', 'The derivative is found: two x minus six.') },
        { action: 'at', hint: L("Nuqta hali yo'q: uni topish kerak.", 'Точки пока нет: её надо найти.', 'There is no point yet: it must be found.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['3', '6', '−3', '0'],
    value: ['3'],
    label: L('minimum nuqtasi x =', 'точка минимума x =', 'the minimum point x ='),
    prompt: L('Nuqtani yozing', 'Запиши точку', 'Write the point'),
    wrongs: [
      { key: '6', hint: L("Ikkiga bo'linmagan: ikki iks oltiga teng bo'lsa, iks uchga teng.", 'Не поделено на два: если два икс равно шести, то икс равен трём.', 'Not halved: if two x equals six, then x equals three.') },
      { key: '−3', hint: L("Ishora teskari: tenglamada minus olti ko'chirilganda plyus bo'ladi.", 'Знак обратный: при переносе минус шесть становится плюсом.', 'The sign is reversed: moving minus six makes it a plus.') },
      { key: '0', hint: L("Nolda hosila minus oltiga teng, ya'ni funksiya hali kamayadi.", 'В нуле производная равна минус шести, то есть функция ещё убывает.', 'At zero the derivative is minus six, so the function is still falling.') },
      { key: '*', hint: L("Ikki iks minus olti nolga teng, demak iks uch.", 'Два икс минус шесть равно нулю, значит икс три.', 'Two x minus six equals zero, so x is three.') },
    ],
  },
  audio: [
    A('mount', "Oxirgi masala mustaqil. Bu safar urinma emas, ekstremum.", 'Последняя задача самостоятельная. На этот раз не касательная, а экстремум.', 'The last problem is on your own. This time not a tangent but an extremum.'),
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
      id: 'b1', tag: 'tangent_point', ask: true, cols: 2,
      done: '6',
      prompt: L('y = x² ga 3 da urinmaning qiyaligi?', 'Наклон касательной к y = x² в точке 3?', 'The slope of the tangent to y = x² at 3?'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '9', hint: L("To'qqiz bu funksiyaning qiymati, qiyalik emas.", 'Девять это значение функции, а не наклон.', 'Nine is the value of the function, not the slope.') },
        { id: 'c', label: '3', hint: L("Uch bu nuqtaning o'zi.", 'Три это сама точка.', 'Three is the point itself.') },
        { id: 'd', label: '2', hint: L("Ikki bu ko'paytuvchi, unga nuqta ham kerak.", 'Два это множитель, к нему нужна точка.', 'Two is the factor, the point is still needed.') },
      ],
    },
    {
      id: 'b2', tag: 'tangent_point', ask: true, cols: 2,
      done: 'y = 2x − 7',
      prompt: L('(4; 1) nuqta, k = 2. Urinma?', 'Точка (4; 1), k = 2. Касательная?', 'The point (4; 1), k = 2. The tangent?'),
      items: [
        { id: 'a', label: 'y = 2x − 7', correct: true },
        { id: 'b', label: 'y = 2x + 1', hint: L("Nuqta ishlatilmagan: bir bu ordinata, ozod had esa boshqa son.", 'Точка не использована: единица это ордината, а свободный член другое число.', 'The point is unused: one is the ordinate, the free term is another number.') },
        { id: 'c', label: 'y = 2x − 8', hint: L("Ordinata qo'shilmagan: minus sakkiz plyus bir minus yetti beradi.", 'Не добавлена ордината: минус восемь плюс один даёт минус семь.', 'The ordinate is missing: minus eight plus one gives minus seven.') },
        { id: 'd', label: 'y = 2x − 4', hint: L("Qavs ochilmagan: ikki karra minus to'rt minus sakkiz beradi.", 'Скобка не раскрыта: два на минус четыре даёт минус восемь.', 'The bracket is not opened: two times minus four gives minus eight.') },
      ],
    },
    {
      id: 'b3', tag: 'deriv_sign_monotone', ask: true, cols: 2,
      done: L('kamayadi', 'убывает', 'falls'),
      prompt: L('(2; 5) da hosila manfiy. Funksiya?', 'На (2; 5) производная отрицательна. Функция?', 'On (2; 5) the derivative is negative. The function?'),
      items: [
        { id: 'a', label: L('kamayadi', 'убывает', 'falls'), correct: true },
        { id: 'b', label: L("o'sadi", 'возрастает', 'rises'), hint: L("O'sish musbat hosila bilan bo'ladi.", 'Возрастание идёт с положительной производной.', 'Growth comes with a positive derivative.') },
        { id: 'c', label: L('manfiy', 'отрицательна', 'is negative'), hint: L("Funksiyaning ishorasi hosilaning ishorasidan chiqmaydi.", 'Знак функции не следует из знака производной.', 'The sign of the function does not follow from the derivative.') },
        { id: 'd', label: L('ekstremumga ega', 'имеет экстремум', 'has an extremum'), hint: L("Ekstremum uchun ishora almashishi kerak, bu yerda esa u bitta.", 'Для экстремума знак должен смениться, а здесь он один.', 'An extremum needs a sign change, here the sign is constant.') },
      ],
    },
    {
      id: 'b4', tag: 'stationary_not_extremum', ask: true, cols: 2,
      done: L("ekstremum yo'q", 'экстремума нет', 'no extremum'),
      prompt: L("Hosila nolga teng, ishora o'zgarmadi. Nuqtada?", 'Производная ноль, знак не изменился. В точке?', 'The derivative is zero, the sign held. At the point?'),
      items: [
        { id: 'a', label: L("ekstremum yo'q", 'экстремума нет', 'no extremum'), correct: true },
        { id: 'b', label: L('maksimum', 'максимум', 'a maximum'), hint: L("Maksimumda ishora plyusdan minusga o'tadi.", 'В максимуме знак идёт с плюса на минус.', 'At a maximum the sign goes plus to minus.') },
        { id: 'c', label: L('minimum', 'минимум', 'a minimum'), hint: L("Minimumda ishora minusdan plyusga o'tadi.", 'В минимуме знак идёт с минуса на плюс.', 'At a minimum the sign goes minus to plus.') },
        { id: 'd', label: L('uzilish', 'разрыв', 'a break'), hint: L("Hosila bor va nolga teng, demak uzilish yo'q.", 'Производная есть и равна нулю, значит разрыва нет.', 'The derivative exists and is zero, so there is no break.') },
      ],
    },
    {
      id: 'b5', tag: 'endpoint_value', ask: true, cols: 2,
      done: 'x = 3',
      prompt: L('[0; 3] da y = x² eng katta qiymati qayerda?', 'Где наибольшее значение y = x² на [0; 3]?', 'Where is the greatest value of y = x² on [0; 3]?'),
      items: [
        { id: 'a', label: 'x = 3', correct: true },
        { id: 'b', label: 'x = 0', hint: L("Nolda qiymat eng KICHIK, chunki kvadrat o'sib boradi.", 'В нуле значение самое МАЛЕНЬКОЕ, потому что квадрат растёт.', 'At zero the value is the SMALLEST, because the square grows.') },
        { id: 'c', label: 'x = 1,5', hint: L("O'rtada hech narsa maxsus emas: hosila u yerda nolga aylanmaydi.", 'В середине ничего особенного: производная там не обращается в ноль.', 'Nothing special in the middle: the derivative does not vanish there.') },
        { id: 'd', label: L("statsionar nuqtada", 'в стационарной точке', 'at a stationary point'), hint: L("Statsionar nuqta nolda, va u kesmaning UCHI, ya'ni eng kichik qiymat joyi.", 'Стационарная точка в нуле, и это КОНЕЦ отрезка, то есть место наименьшего значения.', 'The stationary point is at zero, and it is an END of the interval, the place of the least value.') },
      ],
    },
    {
      id: 'b6', tag: 'deriv_sign_monotone', ask: true, cols: 2,
      done: L("hamma joyda o'sadi", 'возрастает всюду', 'rises everywhere'),
      prompt: L('f ′ = 3x² + 1. Funksiya?', 'f ′ = 3x² + 1. Функция?', 'f ′ = 3x² + 1. The function?'),
      items: [
        { id: 'a', label: L("hamma joyda o'sadi", 'возрастает всюду', 'rises everywhere'), correct: true },
        { id: 'b', label: L('hamma joyda kamayadi', 'убывает всюду', 'falls everywhere'), hint: L("Kvadrat manfiy bo'lmaydi, ustiga bir qo'shilgan: hosila doim musbat.", 'Квадрат неотрицателен, к нему прибавлена единица: производная всегда положительна.', 'A square is never negative, and one is added: the derivative is always positive.') },
        { id: 'c', label: L('maksimumi bor', 'имеет максимум', 'has a maximum'), hint: L("Ekstremum uchun hosila nolga aylanishi kerak, bu esa hech qachon bo'lmaydi.", 'Для экстремума производная должна обратиться в ноль, а этого не бывает.', 'An extremum needs the derivative to vanish, and it never does.') },
        { id: 'd', label: L('minimumi bor', 'имеет минимум', 'has a minimum'), hint: L("Hosila nolga aylanmaydi, demak nomzod ham yo'q.", 'Производная не обращается в ноль, значит и кандидата нет.', 'The derivative never vanishes, so there is no candidate either.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, javoblar natijaga kiradi.", 'Блиц. Шесть вопросов, ответы идут в результат.', 'Quick round. Six questions, the answers count.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Nomzod ekstremum deb e'lon qilingan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'stationary_not_extremum',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: 'f = x³ − 3x² + 3x' },
    { id: 'r2', text: 'f ′ = 3x² − 6x + 3' },
    { id: 'r3', text: 'f ′ = 3 (x − 1)²' },
    { id: 'r4', text: L('x = 1  ⇒  lokal minimum', 'x = 1  ⇒  локальный минимум', 'x = 1  ⇒  a local minimum') },
    { id: 'r5', text: L('javob: minimum 1 da', 'ответ: минимум в 1', 'answer: a minimum at 1') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Hosila to'g'ri: uch iks kvadrat minus olti iks plyus uch.", 'Производная верна: три икс квадрат минус шесть икс плюс три.', 'The derivative is right: three x squared minus six x plus three.'),
    r3: L("Ko'paytuvchilarga ajratish ham to'g'ri: uch karra qavs kvadrat.", 'Разложение тоже верно: три на скобку в квадрате.', 'The factoring is right too: three times the bracket squared.'),
    r5: L("Oxirgi satr faqat ko'chirma, xato undan oldin.", 'Последняя строка только перепись, ошибка выше.', 'The last line is just a copy, the error is above.'),
  },
  proofPoint: L('ishora tekshirilmagan', 'знак не проверен', 'the sign was not checked'),
  proof: L(
    "Kvadrat manfiy bo'lmaydi, demak hosila bir nuqtadan tashqari hamma joyda MUSBAT. Ishora almashmaydi, va funksiya to'xtamasdan o'sadi. Birda ekstremum yo'q, faqat gorizontal urinma bor.",
    'Квадрат неотрицателен, значит производная всюду, кроме одной точки, ПОЛОЖИТЕЛЬНА. Знак не меняется, и функция растёт без остановки. В единице экстремума нет, есть только горизонтальная касательная.',
    'A square is never negative, so the derivative is POSITIVE everywhere except one point. The sign does not flip, and the function rises without stopping. At one there is no extremum, only a horizontal tangent.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('ishora tekshirilmagan', 'знак не проверен', 'the sign was not checked'), correct: true },
      { id: 'b', label: L('hosila xato topilgan', 'производная найдена неверно', 'the derivative is wrong'), hint: L("Hosila to'g'ri: uchala had ham jadval bo'yicha olingan.", 'Производная верна: все три члена взяты по таблице.', 'The derivative is right: all three terms come from the table.') },
      { id: 'c', label: L('nol xato topilgan', 'ноль найден неверно', 'the zero is wrong'), hint: L("Nol to'g'ri: qavs birda nolga aylanadi.", 'Ноль верен: скобка обращается в ноль в единице.', 'The zero is right: the bracket vanishes at one.') },
      { id: 'd', label: L("javob to'g'ri", 'ответ верный', 'the answer is right'), hint: L("Javobda minimum bor, aslida esa ekstremum yo'q.", 'В ответе минимум, а на самом деле экстремума нет.', 'The answer claims a minimum, but there is no extremum.') },
    ],
  },
  audio: [
    A('mount', "Blits yopildi. Endi boshqaning yechimiga qaraymiz.", 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: hisoblar to'g'ri bajarilgan. Xato xulosada.", 'Внимание: вычисления выполнены верно. Ошибка в выводе.', 'Careful: the computations are done right. The error is in the conclusion.'),
    A('proof', "Qarang: hosila uch karra qavsning kvadrati. Kvadrat manfiy bo'lmaydi, demak hosila birdan chapda ham, o'ngda ham musbat. Ishora almashmagan, va shu sababli ekstremum yo'q: funksiya birda bir zumga to'xtaydi va yana o'sishda davom etadi. Statsionar nuqta faqat nomzod edi, hukm esa ishorada.", 'Смотри: производная это три на квадрат скобки. Квадрат неотрицателен, значит производная положительна и слева от единицы, и справа. Знак не сменился, и поэтому экстремума нет: функция на мгновение замирает в единице и продолжает расти. Стационарная точка была только кандидатом, а решает знак.', 'Look: the derivative is three times a bracket squared. A square is never negative, so the derivative is positive both left and right of one. The sign did not flip, and so there is no extremum: the function pauses for an instant at one and keeps rising. The stationary point was only a candidate, the sign decides.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'tangent_point',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L("Tenglamani yig'ing", 'Собери уравнение', 'Build the equation'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("urinma to'g'ri chiziqmi", 'прямая ли это', 'is it a straight line'),
  tasks: [
    {
      prompt: L('Nuqta (2; −6), qiyalik −1', 'Точка (2; −6), наклон −1', 'The point (2; −6), the slope −1'),
      template: ['y ', { slot: 0 }, ' 6 = ', { slot: 1 }, ' (x − 2)'],
      parts: ['+', '−', '−1', '1'],
      answer: ['+', '−1'],
      doneLabel: 'y + 6 = −1 (x − 2)',
      wrongs: [
        { key: '−|−1', hint: L("Ordinata manfiy, va ayirma plyusga aylanadi: y minus minus olti.", 'Ордината отрицательна, и разность превращается в плюс: y минус минус шесть.', 'The ordinate is negative, so the difference becomes a plus: y minus minus six.') },
        { key: '+|1', hint: L("Qiyalik manfiy: chiziq pastga ketadi.", 'Наклон отрицателен: прямая идёт вниз.', 'The slope is negative: the line goes down.') },
        { key: '*', hint: L("Formulada y minus f dan nuqta turadi, va f minus olti.", 'В формуле стоит y минус значение, а значение минус шесть.', 'The formula has y minus the value, and the value is minus six.') },
      ],
    },
    {
      prompt: L('y = x² − 6x da gorizontal urinma', 'Горизонтальная касательная к y = x² − 6x', 'A horizontal tangent to y = x² − 6x'),
      template: ['x₀ = ', { slot: 0 }],
      parts: ['3', '6', '−3', '0'],
      answer: ['3'],
      doneLabel: 'x₀ = 3',
      wrongs: [
        { key: '6', hint: L("Ikkiga bo'linmagan: ikki iks oltiga teng bo'lsa, iks uch.", 'Не поделено на два: если два икс равно шести, икс три.', 'Not halved: if two x equals six, x is three.') },
        { key: '0', hint: L("Nolda hosila minus olti, ya'ni urinma gorizontal emas.", 'В нуле производная минус шесть, значит касательная не горизонтальна.', 'At zero the derivative is minus six, so the tangent is not horizontal.') },
        { key: '*', hint: L("Gorizontal urinma hosila nolga teng joyda bo'ladi.", 'Горизонтальная касательная там, где производная равна нулю.', 'A horizontal tangent sits where the derivative is zero.') },
      ],
    },
  ],
  audio: [
    A('mount', "Xato topildi. Oxirgi topshiriq teskari: tavsif bor, tenglama kerak.", 'Ошибка найдена. Последнее задание обратное: есть описание, нужно уравнение.', 'The error is found. The last task is reverse: a description is given, an equation is needed.'),
    A('built1', "Endi ikkinchisi. Bu safar urinma gorizontal, ya'ni qiyalik nol.", 'Теперь второе. На этот раз касательная горизонтальна, то есть наклон ноль.', 'Now the second. This time the tangent is horizontal, so the slope is zero.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'stationary_not_extremum',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'y − f (x₀) = f ′ (x₀) (x − x₀)',
  ruleLines: [
    L('hosila nuqtada SON ga aylanadi', 'производная в точке становится ЧИСЛОМ', 'at a point the derivative becomes a NUMBER'),
    L("ishora o'sish va kamayishni beradi", 'знак даёт возрастание и убывание', 'the sign gives the rise and the fall'),
    L('nol faqat nomzod', 'ноль это только кандидат', 'a zero is only a candidate'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('urinma qaysi yozuv', 'какая запись касательная', 'which record is a tangent'),
      right: 'y = −x − 4',
      map: { a: 'y = −x − 4', b: 'y = 2x² − 9x + 4', c: 'y = −x + 4', d: 'y = −6' },
    },
    {
      screen: 5,
      expr: L('kubning ekstremumlari', 'экстремумы куба', 'the extrema of the cube'),
      right: '0',
      map: { a: '0', b: '1', c: '2', d: '3' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: 'y = 2x² − 9x + 4  →  y = −x − 4',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Urinma tenglamasi va ishora lentasiga qayting", 'Вернись к уравнению касательной и ленте знака', 'Go back to the tangent equation and the sign band'),
  },
  probe: {
    question: L(
      "Nima uchun hosilani harf bilan qo'yish mumkin emas?",
      'Почему нельзя подставить производную с буквой?',
      'Why can the derivative not be substituted as a letter?',
    ),
    items: [
      { id: 'a', label: L("natija to'g'ri chiziq bo'lmaydi", 'результат не будет прямой', 'the result would not be a line'), correct: true },
      { id: 'b', label: L('shunday uzun', 'так длиннее', 'it is longer that way'), hint: L("Uzunlik masalasi emas: yozuvning TURI o'zgaradi.", 'Дело не в длине: меняется САМ ВИД записи.', 'It is not about length: the KIND of record changes.') },
      { id: 'c', label: L('darslikda shunday', 'так в учебнике', 'that is how the book has it'), hint: L("Darslikda shunday, chunki urinma to'g'ri chiziq bo'lishi kerak.", 'В учебнике так потому, что касательная обязана быть прямой.', 'The book does it so because a tangent must be a line.') },
      { id: 'd', label: L('mumkin', 'можно', 'it can be'), hint: L("Qo'yilsa, iks kvadrat paydo bo'ladi, va bu parabola.", 'Если подставить, появится икс квадрат, а это парабола.', 'If substituted, x squared appears, and that is a parabola.') },
    ],
  },
  sheetTitle: L('Urinma va tekshirish · shpargalka', 'Касательная и исследование · шпаргалка', 'The tangent and the study · cheat sheet'),
  sheetSrc: L('11-sinf · 45-dars', '11 класс · урок 45', 'Grade 11 · lesson 45'),
  lifehack: L(
    "Urinma to'g'ri chiziq: javobda iks kvadrat bo'lsa, xato bor.",
    'Касательная это прямая: если в ответе икс квадрат, где-то ошибка.',
    'A tangent is a line: if the answer has x squared, something is wrong.',
  ),
  holds: [3000, 6500, 7000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Urinma minus iks minus to'rt, va kubning ekstremumi yo'q.", 'Вот твои прогнозы и вот как оказалось. Касательная минус икс минус четыре, а у куба экстремума нет.', 'Here are your guesses and here is how it turned out. The tangent is minus x minus four, and the cube has no extremum.'),
    A('rule', "Va mana darsning umumiy fikri. Urinma tenglamasida hosila avval SON ga aylanadi: aynan shu joyda ko'p xato qilinadi. Hosilaning ishorasi funksiyaning yo'nalishini beradi, plyus o'sish, minus kamayish. Hosilaning noli esa faqat nomzod: hukmni ishoraning almashishi chiqaradi. Shu bilan hosila mavzusi yopildi, va keyingi darsdan blok DTM rejimida davom etadi.", 'И вот общая мысль урока. В уравнении касательной производная сначала становится ЧИСЛОМ: именно здесь делают больше всего ошибок. Знак производной даёт направление функции, плюс это рост, минус это спад. А ноль производной только кандидат: решает смена знака. На этом тема производной закрыта, и со следующего урока блок продолжится в режиме ДТМ.', 'And here is the shared thought of the lesson. In the tangent equation the derivative first becomes a NUMBER: that is where most errors happen. Its sign gives the direction, plus a rise, minus a fall. And a zero is only a candidate: the sign change gives the verdict. From the next lesson the block continues in exam mode.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
