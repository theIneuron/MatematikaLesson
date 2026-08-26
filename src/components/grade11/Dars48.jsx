// ============================================================================
// 11-sinf, Dars 48. GRAFIKLAR VA YUZA: SINOV DTM.
//
// B6 blokining oltinchi darsi, DTM rejimida uchinchisi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md, 1.2-band (DTM anatomiyasi)
//   asbob:    `SecantBoard` (sign), `AreaBoard`, `AnswerValue`, `Probe`
//   tayanch:  kursning 1-7 darslari (boshlang'ich funksiya, aniq integral,
//             yuza) va 43-45 darslari (hosila, ishora lentasi)
//
// DARSNING BITTA GAPI: grafik savolga javob beradi, lekin ISHORA va CHEGARA
// tartibi javobni o'zgartiradi -- yuza musbat, integral esa manfiy bo'lishi
// mumkin.
//
// NEGA INTEGRAL SHU DARSDA. Reja «Funksiyalar va grafiklar» deydi, integral
// esa aynan GRAFIK OSTIDAGI YUZA. B1 bloki (7 dars) uchun takrorlash joyi
// boshqa yerda yo'q, shuning uchun u shu darsga qo'shildi.
//
// SONLAR TEKSHIRILDI:
//   integral 0 dan 2 gacha (−x) dx = −2, yuza esa 2
//   f = x² − 4 > 0:  x = 3 -> 5;  x = 1 -> −3;  x = −3 -> 5;  x = 0 -> −4
//     demak javob [−2; 2] dan TASHQARIDA
//   integral 0 dan 2 gacha 2x dx = 4
//   integral 1 dan 3 gacha 2x dx = 9 − 1 = 8;  chegaralar almashsa −8
//   ildiz(9 − x²) ODZ:  x = 0 va x = 3 mumkin, x = 4 va x = −4 mumkin emas
//     demak [−3; 3]
//   integral −1 dan 1 gacha x³ dx = 0 (toq funksiya, ikki yuza qisqaradi)
//   blits: integral 0 dan 1 gacha 3x² dx = 1;  integral −2 dan 0 gacha x dx = −2;
//          1/x ning boshlang'ich funksiyasi ln|x| + C;
//          integral 0 dan 3 gacha x² dx = 9;  log₂(4 − x) ODZ: x < 4
//   audit: chegaralar almashtirilgan, yuza manfiy chiqqan
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_48',
  title: L('Grafiklar va yuza: sinov DTM', 'Графики и площадь: пробный ДТМ', 'Graphs and area: a mock exam'),
}

const BLOCK = { label: 'B6', from: 43, to: 49, current: 48 }

// DTM REJIMI. Etalon 1.2-bandi.
const MODE = 'dtm'

// f = x³ − 3x: ishora lentasi uchun
const CUB = (x) => x * x * x - 3 * x

// ============================================================
// SLAYD 1. XUK. Yuza va integral: bir xil emas.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sinov DTM', 'Пробный ДТМ', 'Mock exam'),
  title: L('Yuza va integral', 'Площадь и интеграл', 'Area and integral'),
  expr: L('0 dan 2 gacha, y = −x', 'от 0 до 2, y = −x', 'from 0 to 2, y = −x'),
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: '2',
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: '−2',
    },
  ],
  probe: {
    question: L(
      'Integral nimaga teng?',
      'Чему равен интеграл?',
      'What does the integral equal?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi masalalar boshlanadi.',
      'Твой ответ записан. Теперь начинаются задачи.',
      'Your answer is saved. Now the problems begin.',
    ),
    items: [
      { id: 'a', label: '−2' },
      { id: 'b', label: '2' },
      { id: 'c', label: '0' },
      { id: 'd', label: '4' },
    ],
  },
  holds: [4200, 4200, 3200],
  audio: [
    A('mount', "Uchinchi sinov. Bu safar grafiklar va grafik ostidagi yuza.", 'Третья проверка. На этот раз графики и площадь под графиком.', 'The third check. This time graphs and the area under a graph.'),
    A('r1', "Chiziq o'qdan PASTDA yotadi. Karim yuzani hisobladi va ikki deb aytdi.", 'Линия лежит НИЖЕ оси. Карим посчитал площадь и сказал два.', 'The line lies BELOW the axis. Karim computed the area and said two.'),
    A('r2', "Nargiza esa minus ikki deb javob berdi.", 'А Наргиза ответила минус два.', 'Nargiza answered minus two.'),
    A('ask', "Sizningcha integral nimaga teng. Taxmin qiling.", 'Как думаешь, чему равен интеграл. Предположи.', 'What do you think the integral equals. Make a guess.'),
  ],
}

// ============================================================
// SLAYD 2. MASALA 1. Funksiya qayerda musbat.
// ============================================================
const S2 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'check_by_point',
  eyebrow: L('Masala 1', 'Задача 1', 'Problem 1'),
  title: L('Funksiya qayerda musbat', 'Где функция положительна', 'Where the function is positive'),
  expr: 'f = x² − 4',
  goal: L('musbat qiymatlarni ajratish', 'отделить положительные значения', 'separate the positive values'),
  rule: L(
    "Har bir nuqtada funksiyani hisoblaymiz.",
    'В каждой точке считаем функцию.',
    'At each point we compute the function.',
  ),
  pick: L('Qaysi nuqtani tekshiramiz?', 'Какую точку проверим?', 'Which point shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('musbat iksda', 'при плюсовом x', 'for positive x'), value: 'x > 0' },
    { id: 'b', key: 'inB', name: L('ikkidan tashqarida', 'вне двойки', 'outside two'), value: '|x| > 2' },
  ],
  points: [
    {
      id: 'q1', label: 'x = 3', num: '5', step: 'calc', verdict: 'in',
      calc: L('to\'qqiz minus to\'rt', 'девять минус четыре', 'nine minus four'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: 'x = 1', num: '−3', step: 'calc', verdict: 'out',
      calc: L('bir minus to\'rt', 'один минус четыре', 'one minus four'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: 'x = −3', num: '5', step: 'calc', verdict: 'in',
      calc: L('kvadrat ishorasiz', 'квадрат без знака', 'a square has no sign'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q4', label: 'x = 0', num: '−4', step: 'calc', verdict: 'out',
      calc: L('eng kichik qiymat', 'наименьшее значение', 'the least value'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L(
      'Funksiya qayerda musbat?',
      'Где функция положительна?',
      'Where is the function positive?',
    ),
    items: [
      { id: 'b', label: L('ikkitadan tashqarida', 'вне двойки', 'outside two'), correct: true },
      { id: 'a', label: L('musbat iksda', 'при положительном x', 'for positive x'), hint: L("Birda funksiya manfiy chiqdi, garchi iks musbat bo'lsa ham.", 'В единице функция отрицательна, хотя икс положителен.', 'At one the function is negative, though x is positive.') },
      { id: 'c', label: L('hamma joyda', 'всюду', 'everywhere'), hint: L("Nolda minus to'rt chiqdi.", 'В нуле вышло минус четыре.', 'At zero it gave minus four.') },
      { id: 'd', label: L('faqat nolda', 'только в нуле', 'only at zero'), hint: L("Nolda aynan eng kichik va manfiy qiymat.", 'В нуле как раз наименьшее и отрицательное значение.', 'At zero we get the least and negative value.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Birinchi masala. Ikki da'vo bor, to'rtta nuqta ularni sinaydi.", 'Первая задача. Есть два утверждения, четыре точки их испытают.', 'The first problem. Two claims, four points to test them.'),
    A('mount', "Nuqtani o'zingiz tanlaysiz.", 'Точку выбираешь сам.', 'You choose the point yourself.'),
    A('calc', 'Hisoblaymiz.', 'Считаем.', 'We compute.'),
    A('mark', "Mana natija. Uch va minus uchda funksiya musbat, bir va nolda manfiy. Demak ishora iks ning ishorasiga bog'liq emas: muhimi nuqta ikkitadan uzoqda yoki yaqinda ekani. Parabola o'qni minus ikki va ikkida kesib o'tadi, va ular orasida pastda yotadi.", 'Вот результат. В трёх и минус трёх функция положительна, в единице и нуле отрицательна. Значит знак не зависит от знака икс: важно, далеко точка от двойки или близко. Парабола пересекает ось в минус двух и двух и между ними лежит ниже.', 'Here is the result. At three and minus three the function is positive, at one and zero negative. So the sign does not follow the sign of x: what matters is whether the point is far from two or near. The parabola crosses the axis at minus two and two and lies below between them.'),
  ],
}

// ============================================================
// SLAYD 3. MASALA 2. Yuza pastda: integralning ishorasi.
// ============================================================
const S3 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'signed_area',
  eyebrow: L('Masala 2', 'Задача 2', 'Problem 2'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    "Figura o'qdan PASTDA yotadi",
    'Фигура лежит НИЖЕ оси',
    'The figure lies BELOW the axis',
  ),
  template: ['integral =  ', { slot: 0 }, ' 4'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    "yuza har doim musbat, integral esa ishorani saqlaydi",
    'площадь всегда положительна, а интеграл сохраняет знак',
    'an area is always positive, an integral keeps the sign',
  ),
  wrongs: [
    { key: '+', hint: L("Musbat javob YUZAni beradi. Integral esa funksiyaning ishorasini eslab qoladi.", 'Положительный ответ даёт ПЛОЩАДЬ. А интеграл помнит знак функции.', 'A positive answer gives the AREA. An integral remembers the sign of the function.') },
  ],
  probe: {
    question: L(
      'Yuza va integral qanday bog\'langan?',
      'Как связаны площадь и интеграл?',
      'How are area and integral linked?',
    ),
    items: [
      { id: 'a', label: L('pastda ular ishorasi bilan farq qiladi', 'ниже оси они различаются знаком', 'below the axis they differ by sign'), correct: true },
      { id: 'b', label: L('ular har doim teng', 'они всегда равны', 'they are always equal'), hint: L("O'q ustida teng, o'q ostida esa integral manfiy.", 'Над осью равны, а под осью интеграл отрицателен.', 'Above the axis they agree, below it the integral is negative.') },
      { id: 'c', label: L('ular bog\'lanmagan', 'они не связаны', 'they are unrelated'), hint: L("Bog'langan: modul bo'yicha ular bir xil.", 'Связаны: по модулю они совпадают.', 'They are linked: in absolute value they agree.') },
      { id: 'd', label: L('integral har doim musbat', 'интеграл всегда положителен', 'an integral is always positive'), hint: L("Bu darsning xuki aynan manfiy integral haqida edi.", 'Начало этого урока как раз про отрицательный интеграл.', 'The start of this lesson was exactly about a negative integral.') },
    ],
  },
  audio: [
    A('mount', "Ikkinchi masala. Figura o'qdan pastda, va uning yuzasi to'rtga teng.", 'Вторая задача. Фигура ниже оси, и её площадь равна четырём.', 'The second problem. The figure is below the axis, and its area is four.'),
    A('write', "Integralning ishorasini qo'ying.", 'Поставь знак интеграла.', 'Place the sign of the integral.'),
  ],
}

// ============================================================
// SLAYD 4. MASALA 3. Ishora lentasi: qayerda o'sadi.
// ============================================================
const S4 = {
  role: 'graph',
  section: 'practice',
  tag: 'deriv_sign_monotone',
  drag: false,
  graphSteps: 2,
  eyebrow: L('Masala 3', 'Задача 3', 'Problem 3'),
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
      'Funksiya qayerda kamayadi?',
      'Где функция убывает?',
      'Where does the function fall?',
    ),
    items: [
      { id: 'a', label: '(−1; 1)', correct: true },
      { id: 'b', label: '(1; +∞)', hint: L("O'ngda lenta plyus, ya'ni funksiya o'sadi.", 'Справа лента плюс, то есть функция возрастает.', 'On the right the band is plus, so the function rises.') },
      { id: 'c', label: '(−∞; −1)', hint: L("Chapda ham plyus turadi.", 'Слева тоже стоит плюс.', 'On the left there is a plus as well.') },
      { id: 'd', label: L('hamma joyda', 'всюду', 'everywhere'), hint: L("Ikki oraliqda lenta plyus, demak u yerda o'sadi.", 'На двух промежутках лента плюс, значит там возрастает.', 'On two intervals the band is plus, so it rises there.') },
    ],
  },
  holds: [4500, 5000],
  audio: [
    A('mount', "Uchinchi masala. Grafik ostidagi lenta hosilaning ishorasini ko'rsatadi.", 'Третья задача. Лента под графиком показывает знак производной.', 'The third problem. The band under the graph shows the sign of the derivative.'),
    A('mount', "Chegara nuqtalari minus bir va bir. Ular orasida lenta minus, va funksiya u yerda tushadi.", 'Граничные точки минус один и один. Между ними лента минус, и функция там опускается.', 'The boundary points are minus one and one. Between them the band is minus, and the function falls there.'),
  ],
}

// Zanjir amallari: integral va yuza masalalarining amallari bir ro'yxatda.
const ACTIONS_48 = [
  { id: 'anti', label: L("boshlang'ich funksiyani topish", 'найти первообразную', 'find the antiderivative') },
  { id: 'put', label: L("chegaralarni qo'yish", 'подставить границы', 'put in the bounds') },
  { id: 'sub', label: L('ayirish', 'вычесть', 'subtract') },
  { id: 'abs', label: L('modulini olish', 'взять модуль', 'take the modulus') },
  { id: 'swap', label: L("chegaralarni almashtirish", 'поменять границы', 'swap the bounds') },
]

// ============================================================
// SLAYD 5. MASALA 4. Zanjir: aniq integral.
// ============================================================
const S5 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'accumulation',
  noLine: true,
  eyebrow: L('Masala 4', 'Задача 4', 'Problem 4'),
  title: L('Aniq integral', 'Определённый интеграл', 'A definite integral'),
  start: L('0 dan 2 gacha, 2x', 'от 0 до 2, 2x', 'from 0 to 2, 2x'),
  actions: ACTIONS_48,
  steps: [
    {
      action: 'anti',
      to: 'x²',
      wrongs: [
        { action: 'put', hint: L("Chegaralarni qo'yish uchun avval boshlang'ich funksiya kerak.", 'Чтобы подставлять границы, сначала нужна первообразная.', 'To put in the bounds, the antiderivative comes first.') },
        { action: 'sub', hint: L("Ayirish uchun ikkita son kerak.", 'Чтобы вычитать, нужны два числа.', 'To subtract, two numbers are needed.') },
        { action: 'abs', hint: L("Modul bu yerda kerak emas: figura o'q ustida.", 'Модуль здесь не нужен: фигура над осью.', 'No modulus here: the figure is above the axis.') },
      ],
    },
    {
      action: 'put',
      to: '4 − 0',
      wrongs: [
        { action: 'anti', hint: L("Boshlang'ich funksiya topildi: iks kvadrat.", 'Первообразная найдена: икс квадрат.', 'The antiderivative is found: x squared.') },
        { action: 'swap', hint: L("Chegaralarni almashtirish javobning ishorasini o'zgartiradi.", 'Смена границ меняет знак ответа.', 'Swapping the bounds flips the sign of the answer.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['4', '2', '8', '0'],
    value: ['4'],
    label: L('integral qiymati =', 'интеграл =', 'integral ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '2', hint: L("Ikki bu yuqori chegara, javob esa uning kvadrati.", 'Два это верхняя граница, а ответ её квадрат.', 'Two is the upper bound, the answer is its square.') },
      { key: '8', hint: L("Sakkiz bu ikkining kubi. Boshlang'ich funksiya kvadrat.", 'Восемь это два в кубе. Первообразная это квадрат.', 'Eight is two cubed. The antiderivative is a square.') },
      { key: '0', hint: L("Nol pastki chegaraning qiymati, undan ayirish kerak.", 'Ноль это значение нижней границы, его надо вычесть.', 'Zero is the value at the lower bound, it must be subtracted.') },
      { key: '*', hint: L("Ikkining kvadrati to'rt, noldan esa nol chiqadi.", 'Два в квадрате четыре, а из нуля выходит ноль.', 'Two squared is four, and zero gives zero.') },
    ],
  },
  audio: [
    A('mount', "To'rtinchi masala. Ro'yxatda keyingi masalaning amallari ham bor.", 'Четвёртая задача. В списке есть действия и следующей задачи.', 'The fourth problem. The list also holds actions of the next problem.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 6. MASALA 5. Chegaralar tartibi.
// ============================================================
const S6 = {
  role: 'twoway',
  section: 'practice',
  tag: 'bounds_order',
  eyebrow: L('Masala 5', 'Задача 5', 'Problem 5'),
  title: L('Chegaralar almashsa', 'Если поменять границы', 'If the bounds swap'),
  expr: L('1 dan 3 gacha, 2x', 'от 1 до 3, 2x', 'from 1 to 3, 2x'),
  need: L('chegaralar tartibi', 'порядок границ', 'the order of the bounds'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('1 dan 3 gacha', 'считал от 1 до 3', 'from 1 to 3'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '8',
        verdict: 'in',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('3 dan 1 gacha', 'считала от 3 до 1', 'from 3 to 1'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '−8',
        verdict: 'out',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['8', '−8', '4', '0'],
    value: ['8'],
    label: L('integral qiymati =', 'интеграл =', 'integral ='),
    prompt: L('1 dan 3 gacha yozing', 'Запиши от 1 до 3', 'Write it from 1 to 3'),
    wrongs: [
      { key: '−8', hint: L("Bu Dilnozaning javobi: uning chegaralari teskari.", 'Это ответ Дилнозы: у неё границы наоборот.', 'That is Dilnoza answer: her bounds are reversed.') },
      { key: '4', hint: L("To'rt bu noldan ikkigacha bo'lgan javob, bu yerda esa chegaralar bir va uch.", 'Четыре это ответ от нуля до двух, а здесь границы один и три.', 'Four is the answer from zero to two, here the bounds are one and three.') },
      { key: '0', hint: L("Nol chiqishi uchun ikki tomon qisqarishi kerak, bu yerda esa funksiya musbat.", 'Чтобы вышел ноль, две части должны сократиться, а здесь функция положительна.', 'For zero the two parts must cancel, and here the function is positive.') },
      { key: '*', hint: L("To'qqiz minus bir sakkiz beradi.", 'Девять минус один даёт восемь.', 'Nine minus one gives eight.') },
    ],
  },
  holds: [4200, 4200, 5200],
  audio: [
    A('mount', "Beshinchi masala. Ikkisi bir xil funksiyani, lekin boshqa tartibda oldi.", 'Пятая задача. Оба взяли одну функцию, но в другом порядке.', 'The fifth problem. Both took one function, but in a different order.'),
    A('p1', "Aziz birdan uchgacha hisobladi va sakkiz oldi.", 'Азиз считал от одного до трёх и получил восемь.', 'Aziz counted from one to three and got eight.'),
    A('p2', "Dilnoza esa uchdan birgacha oldi, va uning javobi minus sakkiz. Ikkisi ham to'g'ri hisobladi: chegaralar almashsa, integral ishorasini almashtiradi. Lekin savol birdan uchgacha, demak javob sakkiz.", 'А Дилноза взяла от трёх до одного, и её ответ минус восемь. Оба посчитали верно: если границы меняются местами, интеграл меняет знак. Но вопрос от одного до трёх, значит ответ восемь.', 'Dilnoza took it from three to one, and her answer is minus eight. Both computed correctly: swapping the bounds flips the sign of the integral. But the question is from one to three, so the answer is eight.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 7. MASALA 6. Ildizning ODZ si.
// ============================================================
const S7 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'log_domain',
  eyebrow: L('Masala 6', 'Задача 6', 'Problem 6'),
  title: L('Qaysi nuqta ODZ da', 'Какая точка в области', 'Which point is in the domain'),
  expr: '√(9 − x²)',
  goal: L('ildiz ostidagi ifodani tekshirish', 'проверить выражение под корнем', 'check the expression under the root'),
  rule: L(
    "Har bir nuqtada ildiz ostini hisoblaymiz.",
    'В каждой точке считаем подкоренное.',
    'At each point we compute what is under the root.',
  ),
  pick: L('Qaysi nuqtani tekshiramiz?', 'Какую точку проверим?', 'Which point shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('hamma iks', 'любой x', 'any x'), value: 'R' },
    { id: 'b', key: 'inB', name: L('uchtagacha', 'до трёх', 'up to three'), value: '|x| ≤ 3' },
  ],
  points: [
    {
      id: 'q1', label: 'x = 0', num: '9', step: 'calc', verdict: 'in',
      calc: L('to\'qqiz musbat', 'девять положительно', 'nine is positive'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: 'x = 3', num: '0', step: 'calc', verdict: 'in',
      calc: L('nolning ildizi bor', 'корень из нуля есть', 'the root of zero exists'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: 'x = 4', num: '−7', step: 'calc', verdict: 'out',
      calc: L('manfiydan ildiz yo\'q', 'из минуса корня нет', 'no root of a minus'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q4', label: 'x = −4', num: '−7', step: 'calc', verdict: 'out',
      calc: L('yana manfiy', 'снова минус', 'minus again'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      'ODZ qanday yoziladi?',
      'Как записывается область?',
      'How is the domain written?',
    ),
    items: [
      { id: 'a', label: '[−3; 3]', correct: true },
      { id: 'b', label: '(−3; 3)', hint: L("Uchda ildiz ostida nol, va nolning ildizi bor: uchlar KIRADI.", 'В трёх под корнем ноль, а корень из нуля есть: концы ВХОДЯТ.', 'At three the root has zero inside, and the root of zero exists: the ends are IN.') },
      { id: 'c', label: '[0; 3]', hint: L("Manfiy iks ham mumkin: kvadrat ishorani yo'qotadi.", 'Отрицательный икс тоже можно: квадрат убирает знак.', 'A negative x works too: the square drops the sign.') },
      { id: 'd', label: L('hamma sonlar', 'все числа', 'all numbers'), hint: L("To'rtda ildiz ostida minus yetti chiqdi.", 'В четырёх под корнем вышло минус семь.', 'At four we got minus seven under the root.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Oltinchi masala. Ildiz ostida kvadrat turadi, va bu chegara qo'yadi.", 'Шестая задача. Под корнем квадрат, и это ставит границу.', 'The sixth problem. There is a square under the root, and that sets a boundary.'),
    A('mount', "Nuqtani o'zingiz tanlaysiz.", 'Точку выбираешь сам.', 'You choose the point yourself.'),
    A('calc', 'Hisoblaymiz.', 'Считаем.', 'We compute.'),
    A('mark', "Mana natija. Nolda va uchda ildiz ostidagi ifoda manfiy emas, demak ildiz mavjud. To'rtda va minus to'rtda esa u minus yetti: bunday ildiz yo'q. Kvadrat ishorani yo'qotadi, shuning uchun chegara ikki tomonda ham uchda turadi, va uchlar javobga kiradi.", 'Вот результат. В нуле и в трёх подкоренное неотрицательно, значит корень существует. А в четырёх и минус четырёх оно минус семь: такого корня нет. Квадрат убирает знак, поэтому граница с двух сторон в трёх, и концы входят в ответ.', 'Here is the result. At zero and three what is under the root is not negative, so the root exists. At four and minus four it is minus seven: no such root. The square drops the sign, so the boundary sits at three on both sides, and the ends are in the answer.'),
  ],
}

// ============================================================
// SLAYD 8. MASALA 7. Mustaqil: toq funksiya.
// ============================================================
const S8 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'signed_area',
  noLine: true,
  solo: true,
  eyebrow: L('Masala 7', 'Задача 7', 'Problem 7'),
  title: L('Imtihondagidek', 'Как на экзамене', 'As on the exam'),
  start: L('−1 dan 1 gacha, x³', 'от −1 до 1, x³', 'from −1 to 1, x³'),
  actions: ACTIONS_48,
  hint: L(
    "Chapdagi yuza o'q ostida, o'ngdagisi o'q ustida.",
    'Левая площадь под осью, правая над осью.',
    'The left area is below the axis, the right one above.',
  ),
  steps: [
    {
      action: 'anti',
      to: 'x⁴ / 4',
      wrongs: [
        { action: 'put', hint: L("Avval boshlang'ich funksiya, keyin chegaralar.", 'Сначала первообразная, потом границы.', 'The antiderivative first, then the bounds.') },
        { action: 'abs', hint: L("Modul YUZA uchun kerak, integral esa ishorani saqlaydi.", 'Модуль нужен для ПЛОЩАДИ, а интеграл сохраняет знак.', 'The modulus is for the AREA, an integral keeps the sign.') },
        { action: 'swap', hint: L("Chegaralar to'g'ri tartibda turadi.", 'Границы стоят в правильном порядке.', 'The bounds are in the right order.') },
      ],
    },
    {
      action: 'put',
      to: '1/4 − 1/4',
      wrongs: [
        { action: 'anti', hint: L("Boshlang'ich funksiya topildi: iks ning to'rtinchi darajasi bo'lingan to'rt.", 'Первообразная найдена: икс в четвёртой делить на четыре.', 'The antiderivative is found: x to the fourth over four.') },
        { action: 'sub', hint: L("Ayirish uchun ikkita qiymat kerak, ular hali qo'yilmagan.", 'Чтобы вычитать, нужны два значения, а они ещё не подставлены.', 'To subtract, two values are needed, and they are not in yet.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['0', '1/2', '2', '1/4'],
    value: ['0'],
    label: L('integral qiymati =', 'интеграл =', 'integral ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '1/2', hint: L("Bu ikki YUZAning yig'indisi. Integral esa chapdagi yuzani MINUS bilan oladi.", 'Это сумма двух ПЛОЩАДЕЙ. А интеграл берёт левую площадь с МИНУСОМ.', 'That is the sum of two AREAS. An integral takes the left area with a MINUS.') },
      { key: '2', hint: L("Bunday katta son chiqmaydi: minus birdan birgacha funksiya kichik.", 'Такое большое число не выходит: от минус одного до одного функция мала.', 'No such large number appears: from minus one to one the function is small.') },
      { key: '1/4', hint: L("Bu bitta chegaraning qiymati, ayirish esa bajarilmagan.", 'Это значение одной границы, а вычитание не выполнено.', 'That is the value at one bound, the subtraction is not done.') },
      { key: '*', hint: L("Ikki chegarada bir xil son chiqdi, va ularning ayirmasi nol.", 'На двух границах вышло одно и то же число, и их разность ноль.', 'Both bounds gave the same number, and their difference is zero.') },
    ],
  },
  audio: [
    A('mount', "Yettinchi masala mustaqil, imtihondagidek.", 'Седьмая задача самостоятельная, как на экзамене.', 'The seventh problem is on your own, as on the exam.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 9. MASALA 8. Grafik tushadi: hosila.
// ============================================================
const S9 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'deriv_sign_monotone',
  eyebrow: L('Masala 8', 'Задача 8', 'Problem 8'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    "(0; 2) da TUSHADI",
    'На (0; 2) ОПУСКАЕТСЯ',
    'On (0; 2) it FALLS',
  ),
  template: ['(0; 2) da  f ′  ', { slot: 0 }, ' 0'],
  signs: ['>', '<'],
  answer: '<',
  checkNote: L(
    'kamayishga manfiy hosila to\'g\'ri keladi',
    'убыванию отвечает отрицательная производная',
    'a fall matches a negative derivative',
  ),
  wrongs: [
    { key: '>', hint: L("Musbat hosila grafikni ko'taradi, bu yerda esa u tushadi.", 'Положительная производная поднимает график, а здесь он опускается.', 'A positive derivative lifts the graph, here it falls.') },
  ],
  probe: {
    question: L(
      'Hosila nolga aylangan nuqta nima beradi?',
      'Что даёт точка, где производная стала нулём?',
      'What does a point with a zero derivative give?',
    ),
    items: [
      { id: 'a', label: L('nomzodni', 'кандидата', 'a candidate'), correct: true },
      { id: 'b', label: L('maksimumni', 'максимум', 'a maximum'), hint: L("Maksimum uchun ishora plyusdan minusga o'tishi kerak.", 'Для максимума знак должен пройти с плюса на минус.', 'For a maximum the sign must pass from plus to minus.') },
      { id: 'c', label: L('minimumni', 'минимум', 'a minimum'), hint: L("Minimum uchun ham ishora almashishi kerak.", 'Для минимума знак тоже должен смениться.', 'A minimum also needs the sign to flip.') },
      { id: 'd', label: L('hech nimani', 'ничего', 'nothing'), hint: L("Ekstremum FAQAT shunday nuqtalarda bo'ladi, demak ular kerak.", 'Экстремум бывает ТОЛЬКО в таких точках, значит они нужны.', 'An extremum happens ONLY at such points, so they matter.') },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi masala. Grafik noldan ikkigacha tushadi.", 'Восьмая задача. График опускается от нуля до двух.', 'The eighth problem. The graph falls from zero to two.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 10. MASALA 9. Teskari masala: boshlang'ich funksiya.
// ============================================================
const S10 = {
  role: 'build',
  section: 'practice',
  led: 'student',
  tag: 'plus_c',
  right: '2/2',
  eyebrow: L('Masala 9', 'Задача 9', 'Problem 9'),
  title: L('Boshlang\'ich funksiyani yig\'ing', 'Собери первообразную', 'Build the antiderivative'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('differensiallab tekshirish', 'проверка дифференцированием', 'check by differentiating'),
  tasks: [
    {
      prompt: L('3x² uchun', 'Для 3x²', 'For 3x²'),
      template: [{ slot: 0 }, ' + ', { slot: 1 }],
      parts: ['x³', 'x²', 'C', '3'],
      answer: ['x³', 'C'],
      doneLabel: 'x³ + C',
      wrongs: [
        { key: 'x²|C', hint: L("Differensiallab tekshiring: iks kvadratning hosilasi ikki iks, uch iks kvadrat emas.", 'Проверь дифференцированием: производная икс квадрат это два икс, а не три икс квадрат.', 'Check by differentiating: the derivative of x squared is two x, not three x squared.') },
        { key: 'x³|3', hint: L("O'zgarmas HARF bilan yoziladi: aniq son emas, chunki u har qanday bo'lishi mumkin.", 'Постоянная пишется БУКВОЙ: не конкретным числом, потому что она может быть любой.', 'The constant is written as a LETTER: not a fixed number, because it may be anything.') },
        { key: '*', hint: L("Uch iks kvadratning boshlang'ich funksiyasi iks kub, va oxirida o'zgarmas.", 'Первообразная трёх икс квадрат это икс куб, и в конце постоянная.', 'The antiderivative of three x squared is x cubed, plus a constant.') },
      ],
    },
    {
      prompt: L('1/x uchun, x > 0', 'Для 1/x при x > 0', 'For 1/x with x > 0'),
      template: [{ slot: 0 }, ' + C'],
      parts: ['ln x', 'x ln x', '1/x²', 'eˣ'],
      answer: ['ln x'],
      doneLabel: 'ln x + C',
      wrongs: [
        { key: 'x ln x', hint: L("Bu ko'paytma, va uning hosilasi boshqacha chiqadi.", 'Это произведение, и его производная выходит другой.', 'That is a product, and its derivative comes out different.') },
        { key: '1/x²', hint: L("Bu hosila, boshlang'ich funksiya emas: minus bir bo'lingan iks ning hosilasi.", 'Это производная, а не первообразная: производная минус единицы делить на икс.', 'That is a derivative, not an antiderivative: the derivative of minus one over x.') },
        { key: '*', hint: L("Jadvalda natural logarifmning hosilasi bir bo'lingan iks.", 'В таблице производная натурального логарифма это один делить на икс.', 'In the table the derivative of the natural logarithm is one over x.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'qqizinchi masala teskari: hosila berilgan, boshlang'ich funksiya kerak.", 'Девятая задача обратная: дана производная, нужна первообразная.', 'The ninth problem is reverse: the derivative is given, the antiderivative is needed.'),
    A('built1', "Endi ikkinchisi.", 'Теперь второе.', 'Now the second.'),
  ],
}

// ============================================================
// SLAYD 11. MASALA 10. Grafikni nuqta bilan aniqlash.
// ============================================================
const S11 = {
  role: 'twoway',
  section: 'practice',
  tag: 'check_by_point',
  eyebrow: L('Masala 10', 'Задача 10', 'Problem 10'),
  title: L('Qaysi grafik qaysi funksiya', 'Какой график какая функция', 'Which graph is which function'),
  expr: L('nuqta (2; 4) chizig\'i', 'линия через (2; 4)', 'the line through (2; 4)'),
  need: L('nuqta bilan tekshirish', 'проверка точкой', 'a check by a point'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('logarifm dedi', 'сказал: логарифм', 'said a logarithm'),
      point: {
        label: L('tekshiruv', 'проверка', 'the check'),
        calc: 'log₂ 2 = 1',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L("ko'rsatkichli dedi", 'это показательная', 'an exponential'),
      point: {
        label: L('tekshiruv', 'проверка', 'the check'),
        calc: '2² = 4',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2ˣ', 'log₂ x', 'x²', '√x'],
    value: ['2ˣ'],
    label: L('funksiya:', 'функция:', 'function:'),
    prompt: L('Funksiyani yozing', 'Запиши функцию', 'Write the function'),
    wrongs: [
      { key: 'log₂ x', hint: L("Ikkida logarifm birga teng, to'rtga emas.", 'В двойке логарифм равен единице, а не четырём.', 'At two the logarithm is one, not four.') },
      { key: 'x²', hint: L("Ikkining kvadrati ham to'rt, lekin bu javob nuqtani ajratmaydi: yana bitta nuqta kerak. Uchda kvadrat to'qqiz, daraja esa sakkiz beradi.", 'Два в квадрате тоже четыре, но этот ответ не различает: нужна вторая точка. В трёх квадрат девять, а степень восемь.', 'Two squared is four as well, but that answer does not separate them: a second point is needed. At three the square gives nine and the power gives eight.') },
      { key: '√x', hint: L("Ikkining ildizi bir butun to'rt, to'rt emas.", 'Корень из двух примерно один и четыре, а не четыре.', 'The root of two is about one point four, not four.') },
      { key: '*', hint: L("Ikkini o'zining darajasiga ko'tarsak to'rt chiqadi.", 'Два в степени два даёт четыре.', 'Two to the power two gives four.') },
    ],
  },
  holds: [4200, 3600, 5500],
  audio: [
    A('mount', "O'ninchi masala, oxirgisi. Chiziq ikki, to'rt nuqtasidan o'tadi.", 'Десятая задача, последняя. Линия проходит через точку два, четыре.', 'The tenth problem, the last. The line passes through the point two, four.'),
    A('p1', "Aziz logarifm deb aytdi. Tekshiruv: ikki asosida ikkining logarifmi bir, to'rt emas.", 'Азиз сказал логарифм. Проверка: логарифм двух по основанию два равен одному, а не четырём.', 'Aziz said a logarithm. The check: the logarithm of two to base two is one, not four.'),
    A('p2', "Dilnoza ko'rsatkichli deb aytdi, va tekshiruv rost chiqdi: ikkining kvadrati to'rt. Nuqta bilan tekshirish eng tez usul: bitta nuqta ko'p javobni yiqitadi.", 'Дилноза сказала показательная, и проверка сошлась: два в квадрате четыре. Проверка точкой самый быстрый способ: одна точка валит много ответов.', 'Dilnoza said an exponential, and the check held: two squared is four. Checking by a point is the fastest way: one point knocks out many answers.'),
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
      id: 'b1', tag: 'accumulation', ask: true, cols: 2,
      done: '1',
      prompt: L('0 dan 1 gacha 3x² integrali?', 'Интеграл 3x² от 0 до 1?', 'The integral of 3x² from 0 to 1?'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '3', hint: L("Uch bu ko'paytuvchi, boshlang'ich funksiya esa iks kub.", 'Три это множитель, а первообразная икс куб.', 'Three is the factor, the antiderivative is x cubed.') },
        { id: 'c', label: '1/3', hint: L("Uchga bo'linmaydi: ko'paytuvchi uch daraja qoidasi bilan qisqaradi.", 'На три не делят: множитель три сокращается с правилом степени.', 'No division by three: the factor cancels with the power rule.') },
        { id: 'd', label: '0', hint: L("Funksiya oraliqda musbat, demak integral ham musbat.", 'Функция на промежутке положительна, значит и интеграл положителен.', 'The function is positive on the interval, so the integral is positive.') },
      ],
    },
    {
      id: 'b2', tag: 'signed_area', ask: true, cols: 2,
      done: '−2',
      prompt: L('−2 dan 0 gacha x integrali?', 'Интеграл x от −2 до 0?', 'The integral of x from −2 to 0?'),
      items: [
        { id: 'a', label: '−2', correct: true },
        { id: 'b', label: '2', hint: L("Bu yuza. Chiziq o'q ostida, demak integral manfiy.", 'Это площадь. Линия под осью, значит интеграл отрицателен.', 'That is the area. The line is below the axis, so the integral is negative.') },
        { id: 'c', label: '0', hint: L("Nol chiqishi uchun figura o'qning ikki tomonida bo'lishi kerak.", 'Чтобы вышел ноль, фигура должна быть с двух сторон оси.', 'For zero the figure must sit on both sides of the axis.') },
        { id: 'd', label: '−4', hint: L("Boshlang'ich funksiya iks kvadrat bo'lingan ikki, ikkiga bo'lish esa unutilgan.", 'Первообразная икс квадрат делить на два, а деление забыто.', 'The antiderivative is x squared over two, and the division was forgotten.') },
      ],
    },
    {
      id: 'b3', tag: 'plus_c', ask: true, cols: 2,
      done: 'ln |x| + C',
      prompt: L('1/x ning boshlang\'ich funksiyasi?', 'Первообразная 1/x?', 'The antiderivative of 1/x?'),
      items: [
        { id: 'a', label: 'ln |x| + C', correct: true },
        { id: 'b', label: 'ln x', hint: L("Ikki narsa yetmaydi: modul va o'zgarmas.", 'Не хватает двух вещей: модуля и постоянной.', 'Two things are missing: the modulus and the constant.') },
        { id: 'c', label: '1/x² + C', hint: L("Bu hosila tomoni: bir bo'lingan iks ning hosilasi minus bir bo'lingan iks kvadrat.", 'Это в сторону производной: производная одной делить на икс это минус один делить на икс квадрат.', 'That goes the derivative way: the derivative of one over x is minus one over x squared.') },
        { id: 'd', label: 'x ln x + C', hint: L("Differensiallab tekshiring: bu boshqa narsa beradi.", 'Проверь дифференцированием: выйдет другое.', 'Check by differentiating: it gives something else.') },
      ],
    },
    {
      id: 'b4', tag: 'bounds_order', ask: true, cols: 2,
      done: L('ishora almashadi', 'знак меняется', 'the sign flips'),
      prompt: L('Chegaralar almashsa nima bo\'ladi?', 'Что будет, если поменять границы?', 'What happens if the bounds swap?'),
      items: [
        { id: 'a', label: L('ishora almashadi', 'знак меняется', 'the sign flips'), correct: true },
        { id: 'b', label: L('hech nima', 'ничего', 'nothing'), hint: L("Bu darsda sakkiz va minus sakkiz chiqdi.", 'На этом уроке вышло восемь и минус восемь.', 'In this lesson we got eight and minus eight.') },
        { id: 'c', label: L('javob ikki barobar bo\'ladi', 'ответ удвоится', 'the answer doubles'), hint: L("Modul o'zgarmaydi: faqat ishora almashadi.", 'Модуль не меняется: меняется только знак.', 'The size does not change: only the sign flips.') },
        { id: 'd', label: L('javob nol bo\'ladi', 'ответ станет нулём', 'the answer becomes zero'), hint: L("Nol faqat ikki yuza qisqarganda chiqadi.", 'Ноль выходит только когда две площади сокращаются.', 'Zero appears only when two areas cancel.') },
      ],
    },
    {
      id: 'b5', tag: 'accumulation', ask: true, cols: 2,
      done: '9',
      prompt: L('0 dan 3 gacha x² integrali?', 'Интеграл x² от 0 до 3?', 'The integral of x² from 0 to 3?'),
      items: [
        { id: 'a', label: '9', correct: true },
        { id: 'b', label: '27', hint: L("Uchga bo'linmagan: boshlang'ich funksiya iks kub bo'lingan uch.", 'Не поделено на три: первообразная икс куб делить на три.', 'Not divided by three: the antiderivative is x cubed over three.') },
        { id: 'c', label: '3', hint: L("Uch bu chegara, javob esa undan katta.", 'Три это граница, а ответ больше.', 'Three is the bound, and the answer is larger.') },
        { id: 'd', label: '6', hint: L("Olti bu hosila tomoni: ikki iks uchda oltiga teng.", 'Шесть это в сторону производной: два икс в трёх равно шести.', 'Six goes the derivative way: two x at three is six.') },
      ],
    },
    {
      id: 'b6', tag: 'log_domain', ask: true, cols: 2,
      done: 'x < 4',
      prompt: L('log₂(4 − x) ODZ si?', 'Область log₂(4 − x)?', 'The domain of log₂(4 − x)?'),
      items: [
        { id: 'a', label: 'x < 4', correct: true },
        { id: 'b', label: 'x > 4', hint: L("To'rtdan o'ngda argument manfiy bo'lib qoladi.", 'Правее четырёх аргумент становится отрицательным.', 'Right of four the argument becomes negative.') },
        { id: 'c', label: 'x > −4', hint: L("Ishora almashgan: qavs ichida to'rt minus iks.", 'Знак перепутан: в скобке четыре минус икс.', 'The sign is confused: the bracket is four minus x.') },
        { id: 'd', label: 'x ≤ 4', hint: L("To'rtda argument nolga teng, va nolning logarifmi yo'q.", 'В четырёх аргумент равен нулю, а логарифма нуля нет.', 'At four the argument is zero, and there is no logarithm of zero.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, va faqat shu ekran natijaga kiradi.", 'Блиц. Шесть вопросов, и только этот экран идёт в результат.', 'Quick round. Six questions, and only this screen counts.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Chegaralar almashtirilgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'bounds_order',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: L('yuza: 1 dan 4 gacha, y = 2x', 'площадь: от 1 до 4, y = 2x', 'area: from 1 to 4, y = 2x') },
    { id: 'r2', text: L('boshlang\'ich funksiya: x²', 'первообразная: x²', 'antiderivative: x²') },
    { id: 'r3', text: '1 − 16 = −15' },
    { id: 'r4', text: L('yuza = −15', 'площадь = −15', 'area = −15') },
    { id: 'r5', text: L('javob: −15', 'ответ: −15', 'answer: −15') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Boshlang'ich funksiya to'g'ri: iks kvadratning hosilasi ikki iks.", 'Первообразная верна: производная икс квадрат это два икс.', 'The antiderivative is right: the derivative of x squared is two x.'),
    r4: L("Bu satr faqat oldingi natijani ko'chiradi.", 'Эта строка только переписывает предыдущий результат.', 'This line only copies the previous result.'),
    r5: L("Oxirgi satr ham ko'chirma, xato undan yuqorida.", 'Последняя строка тоже перепись, ошибка выше.', 'The last line is a copy too, the error is above.'),
  },
  proofPoint: L('chegaralar almashtirilgan', 'границы перепутаны', 'the bounds are swapped'),
  proof: L(
    "Yuqori chegara to'rt, pastki chegara bir. Demak o'n oltidan bir ayirilishi kerak, ya'ni o'n besh. Yechimda esa teskari yozilgan, va yuza manfiy chiqib qolgan. Yuza manfiy bo'lmaydi.",
    'Верхняя граница четыре, нижняя один. Значит из шестнадцати надо вычесть один, то есть пятнадцать. А в решении записано наоборот, и площадь вышла отрицательной. Площадь отрицательной не бывает.',
    'The upper bound is four, the lower one is one. So one must be subtracted from sixteen, giving fifteen. The solution wrote it the other way, and the area came out negative. An area is never negative.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('chegaralar almashtirilgan', 'границы перепутаны', 'the bounds are swapped'), correct: true },
      { id: 'b', label: L('boshlang\'ich funksiya xato', 'первообразная неверна', 'the antiderivative is wrong'), hint: L("Iks kvadratning hosilasi ikki iks, ya'ni to'g'ri.", 'Производная икс квадрат это два икс, то есть верно.', 'The derivative of x squared is two x, so it is right.') },
      { id: 'c', label: L('modul olinmagan', 'не взят модуль', 'the modulus is missing'), hint: L("Bu figura o'q USTIDA, demak modul kerak emas. Tartib esa xato.", 'Эта фигура НАД осью, значит модуль не нужен. А порядок неверен.', 'This figure is ABOVE the axis, so no modulus is needed. The order is what is wrong.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Yuza manfiy bo'lmaydi, demak javob xato.", 'Площадь не бывает отрицательной, значит ответ неверен.', 'An area is never negative, so the answer is wrong.') },
    ],
  },
  audio: [
    A('mount', "Masalalar tugadi. Endi boshqaning yechimiga qaraymiz.", 'Задачи закончились. Теперь посмотрим на чужое решение.', 'The problems are done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: boshlang'ich funksiya to'g'ri topilgan, arifmetika ham to'g'ri. Xato baribir bor.", 'Внимание: первообразная найдена верно, арифметика тоже. Ошибка всё равно есть.', 'Careful: the antiderivative is right and so is the arithmetic. The error is there anyway.'),
    A('proof', "Qarang: yuqori chegarada to'rt turadi, uning kvadrati o'n olti. Pastkisida bir, kvadrati bir. Nyuton va Leybnits formulasi yuqoridan pastkisini AYIRISHNI talab qiladi, ya'ni o'n olti minus bir, o'n besh. Yechimda esa aksincha yozilgan. Tekshiruv oson: yuza manfiy bo'lmaydi, va bu figura o'q ustida yotadi.", 'Смотри: в верхней границе четыре, её квадрат шестнадцать. В нижней один, квадрат один. Формула Ньютона и Лейбница требует ВЫЧИТАТЬ нижнее из верхнего, то есть шестнадцать минус один, пятнадцать. А в решении наоборот. Проверка простая: площадь не бывает отрицательной, а эта фигура лежит над осью.', 'Look: the upper bound is four, its square sixteen. The lower is one, its square one. The Newton and Leibniz formula asks to SUBTRACT the lower from the upper, that is sixteen minus one, fifteen. The solution did the opposite. The check is easy: an area is never negative, and this figure lies above the axis.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'accumulation',
  right: '2/2',
  eyebrow: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  title: L('Integralni yozing', 'Запиши интеграл', 'Write the integral'),
  targetLabel: L('Figura', 'Фигура', 'The figure'),
  targetValue: L('y = x², 0 dan 3 gacha', 'y = x², от 0 до 3', 'y = x², from 0 to 3'),
  tasks: [
    {
      prompt: L('Boshlang\'ich funksiyani tanlang', 'Выбери первообразную', 'Choose the antiderivative'),
      template: [{ slot: 0 }],
      parts: ['x³ / 3', 'x³', '3x²', 'x² / 2'],
      answer: ['x³ / 3'],
      doneLabel: 'x³ / 3',
      wrongs: [
        { key: 'x³', hint: L("Differensiallab tekshiring: iks kubning hosilasi uch iks kvadrat, iks kvadrat emas.", 'Проверь дифференцированием: производная икс куб это три икс квадрат, а не икс квадрат.', 'Check by differentiating: the derivative of x cubed is three x squared, not x squared.') },
        { key: '3x²', hint: L("Bu hosila tomoni.", 'Это в сторону производной.', 'That goes the derivative way.') },
        { key: '*', hint: L("Daraja bittaga o'sadi va yangi ko'rsatkichga bo'linadi.", 'Показатель растёт на единицу и делится на новый показатель.', 'The exponent grows by one and is divided by the new exponent.') },
      ],
    },
    {
      prompt: L('Yuzani hisoblang', 'Посчитай площадь', 'Compute the area'),
      template: [L('yuza = ', 'площадь = ', 'area = '), { slot: 0 }],
      parts: ['9', '27', '3', '18'],
      answer: ['9'],
      doneLabel: '9',
      wrongs: [
        { key: '27', hint: L("Uchga bo'linmagan.", 'Не поделено на три.', 'Not divided by three.') },
        { key: '3', hint: L("Uch bu chegara.", 'Три это граница.', 'Three is the bound.') },
        { key: '*', hint: L("Uchning kubi yigirma yetti, uchga bo'linsa to'qqiz.", 'Три в кубе двадцать семь, делить на три девять.', 'Three cubed is twenty seven, over three is nine.') },
      ],
    },
  ],
  audio: [
    A('mount', "Xato topildi. Oxirgi topshiriq: yuzani boshdan hisoblash.", 'Ошибка найдена. Последнее задание: посчитать площадь с начала.', 'The error is found. The last task: compute the area from scratch.'),
    A('built1', "Endi sonni hisoblang.", 'Теперь посчитай число.', 'Now compute the number.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'signed_area',
  gapMap: true,
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L('Qayerda teshik bor', 'Где дырка', 'Where the gap is'),
  law: L('ishora va chegara tartibi', 'знак и порядок границ', 'the sign and the order of bounds'),
  ruleLines: [
    L("o'q ostida integral manfiy", 'под осью интеграл отрицателен', 'below the axis the integral is negative'),
    L('chegaralar almashsa ishora almashadi', 'смена границ меняет знак', 'swapping bounds flips the sign'),
    L('nuqta bilan tekshirish eng tez usul', 'проверка точкой самый быстрый способ', 'a point check is the fastest way'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('0 dan 2 gacha, y = −x', 'от 0 до 2, y = −x', 'from 0 to 2, y = −x'),
      right: '−2',
      map: { a: '−2', b: '2', c: '0', d: '4' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('yuza 2, integral −2', 'площадь 2, интеграл −2', 'area 2, integral −2'),
  },
  levels: {
    full: L('Bu blok DTM da siz uchun yopildi', 'Этот блок на ДТМ у тебя закрыт', 'This block is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Xaritada ko\'rsatilgan darslarga qayting', 'Вернись к урокам, указанным в карте', 'Go back to the lessons named in the map'),
  },
  probe: {
    question: L(
      'Yuza va integral qachon farq qiladi?',
      'Когда площадь и интеграл различаются?',
      'When do area and integral differ?',
    ),
    items: [
      { id: 'a', label: L('figura o\'q ostida bo\'lganda', 'когда фигура под осью', 'when the figure is below the axis'), correct: true },
      { id: 'b', label: L('hech qachon', 'никогда', 'never'), hint: L("Bu darsning boshida yuza ikki, integral esa minus ikki edi.", 'В начале этого урока площадь была два, а интеграл минус два.', 'At the start of this lesson the area was two and the integral minus two.') },
      { id: 'c', label: L('har doim', 'всегда', 'always'), hint: L("O'q ustida ular teng.", 'Над осью они равны.', 'Above the axis they agree.') },
      { id: 'd', label: L('chegaralar butun bo\'lmasa', 'когда границы не целые', 'when the bounds are not whole'), hint: L("Chegaralarning butunligi ahamiyatsiz: muhimi chiziq qayerda yotgani.", 'Целость границ не важна: важно, где лежит линия.', 'Whether the bounds are whole does not matter: what matters is where the line lies.') },
    ],
  },
  sheetTitle: L('Grafiklar va yuza · shpargalka', 'Графики и площадь · шпаргалка', 'Graphs and area · cheat sheet'),
  sheetSrc: L('11-sinf · 48-dars', '11 класс · урок 48', 'Grade 11 · lesson 48'),
  lifehack: L(
    "Javob manfiy chiqdi, savolda esa yuza so'ralgan bo'lsa, chegaralarni tekshiring.",
    'Если ответ отрицательный, а спрашивали площадь, проверь границы.',
    'If the answer is negative but the question asked for an area, check the bounds.',
  ),
  holds: [3200, 5500, 6500],
  audio: [
    A('mount', "Sinov tugadi. Natijaga qaraymiz.", 'Проверка закончена. Смотрим результат.', 'The check is over. Let us look at the result.'),
    A('p1', "Mana taxminingiz va mana javob. Integral minus ikki, yuza esa ikki.", 'Вот твоя догадка и вот ответ. Интеграл минус два, а площадь два.', 'Here is your guess and here is the answer. The integral is minus two, and the area is two.'),
    A('rule', "O'ng tomonda kamchiliklar xaritasi. Uchta narsa esa har imtihonda uchraydi. Birinchisi: o'q ostidagi figura uchun integral manfiy, yuza esa har doim musbat. Ikkinchisi: chegaralar almashsa integral ishorasini almashtiradi, shuning uchun tartib muhim. Uchinchisi: grafikni aniqlashda bitta nuqta ko'p javobni yiqitadi, va bu eng tez usul.", 'Справа карта пробелов. А три вещи встречаются на каждом экзамене. Первая: для фигуры под осью интеграл отрицателен, а площадь всегда положительна. Вторая: смена границ меняет знак интеграла, поэтому порядок важен. Третья: при определении графика одна точка валит много ответов, и это самый быстрый способ.', 'On the right is your gap map. And three things appear in every exam. First: for a figure below the axis the integral is negative while the area is always positive. Second: swapping the bounds flips the sign, so the order matters. Third: when identifying a graph one point knocks out many answers, and that is the fastest way.'),
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
