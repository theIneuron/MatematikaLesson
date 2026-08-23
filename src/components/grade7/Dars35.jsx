// ============================================================================
// 7-sinf, Dars 35. CHIZIQLI FUNKSIYA.
// (Линейная функция)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// BU DARSDA ASBOB CHIZIQ CHIZADI. `Plane` ga `fn` beriladi va u FUNKSIYADAN
// quriladi: nuqtalar ro'yxati emas. Sabab qat'iy -- ro'yxat berilsa, muallif
// noto'g'ri grafik chizadi va buni hech qanday tekshiruv tutmaydi.
//
// BLOKNING XATOSI (etalon §2): k manfiy bo'lganda choraklar almashtiriladi.
// Darslik (120-bet) qat'iy aytadi: k musbat bo'lsa grafik birinchi va
// uchinchi chorakdan, k manfiy bo'lsa ikkinchi va to'rtinchi chorakdan
// o'tadi. Xuk aynan shu yerga qo'yilgan.
//
// IKKINCHI XATO: nuqta grafikka «ko'z bilan» tegishli deb qaraladi. Bu
// yerda u shunday yopiladi: o'quvchi nuqtani O'ZI qo'yadi va chiziqdan
// chetga tushsa buni ko'radi, keyin esa formulaga son qo'yib tekshiradi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_35'
const LESSON_TITLE = L('Chiziqli funksiya', 'Линейная функция', 'The linear function')
const LESSON_NO = L('35-dars', 'Урок 35', 'Lesson 35')
const BLOCK = { label: L('B6-blok', 'Блок Б6', 'Block B6'), from: 33, to: 39, current: 35 }

const BOX = { x0: -6, x1: 6, y0: -4, y1: 4 }

const TAGS = {
  Z1: L('k ning ishorasi va choraklar', 'знак k и четверти', 'the sign of k and the quadrants'),
  Z2: L('nuqta grafikda emas', 'точка не на графике', 'the point is not on the graph'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L('b tushib qoldi', 'потеряно b', 'b was dropped'),
  Z5: L('formula va grafik almashtirildi', 'формула и график перепутаны', 'the formula and the graph were mixed up'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. k MANFIY: qaysi choraklardan o'tadi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('CHIZIQLI FUNKSIYA', 'ЛИНЕЙНАЯ ФУНКЦИЯ', 'THE LINEAR FUNCTION'),
  noBack: true,
  noNotes: true,
  title: L('Qaysi choraklardan o\'tadi', 'Через какие четверти', 'Through which quadrants'),
  gate: {
    source: { kind: 'plain', tokens: ['y', '=', '−2x'] },
    rows: [
      { tokens: ['I', 'III'], value: '2' },
      { tokens: ['II', 'IV'], value: '−2' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "y = −2x grafigi qaysi choraklardan o'tadi? Tabloda x birga teng bo'lganda har biri hisoblagan y turadi. Kim haq?",
      'Через какие четверти идёт график y = −2x? На табло значение y при x равном единице, как его посчитал каждый. Кто прав?',
      'Which quadrants does the graph of y = −2x pass through? The boards show y at x equal to one as each student computed it. Who is right?',
    ),
    items: [
      {
        id: 'second',
        label: L("Ikkinchi va to'rtinchi", 'Вторая и четвёртая', 'The second and the fourth'),
        hint: L(
          "Taxminingiz qabul qilindi. Tekislikda tekshiramiz.",
          'Прогноз принят. Проверим на плоскости.',
          'Your prediction is taken. We will check it on the plane.',
        ),
      },
      {
        id: 'first',
        label: L('Birinchi va uchinchi', 'Первая и третья', 'The first and the third'),
        hint: L(
          "x birga teng bo'lganda y manfiy ikki chiqadi, ya'ni nuqta x o'qidan PASTDA turadi.",
          'При x равном единице y выходит минус два, значит точка НИЖЕ оси x.',
          'At x equal to one, y comes out minus two, so the point sits BELOW the x axis.',
        ),
      },
      {
        id: 'all',
        label: L("To'rtta chorakning hammasidan", 'Через все четыре четверти', 'Through all four quadrants'),
        hint: L(
          "To'g'ri chiziq ikki QARAMA-QARSHI chorakdan o'tadi, to'rttadan emas.",
          'Прямая проходит через две ПРОТИВОПОЛОЖНЫЕ четверти, а не через четыре.',
          'A straight line passes through two OPPOSITE quadrants, not four.',
        ),
      },
      {
        id: 'none',
        label: L('Bu to\'g\'ri chiziq emas', 'Это не прямая', 'That is not a straight line'),
        hint: L(
          "Har x ga bitta y mos keladi va nuqtalar bitta to'g'ri chiziqqa tushadi. Buni chizmada ko'ramiz.",
          'Каждому x отвечает одно y, и точки ложатся на одну прямую. Это мы увидим на чертеже.',
          'Each x has one y, and the points fall on one straight line. We will see it on the drawing.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi bitta formulaning grafigi qaysi choraklardan o'tishini aytdi.", 'Два ученика сказали, через какие четверти идёт график одной формулы.', 'Two students said which quadrants the graph of one formula passes through.'),
    A('mount', "Tabloda x birga teng bo'lgandagi y turadi: bittasida ikki, ikkinchisida manfiy ikki.", 'На табло значение y при x равном единице: у одного два, у другого минус два.', 'The boards show y at x equal to one: two for one, minus two for the other.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Qiymat, ishora va chorak. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch qisqa savol', 'Три коротких вопроса', 'Three short questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = 3x − 1 bo'lsa, x ikkiga teng bo'lganda y nechchi?",
        'Если y = 3x − 1, то каково y при x равном двум?',
        'If y = 3x − 1, what is y at x equal to two?',
      ),
      ok: L("Uch karra ikki olti, undan bir ayirilsa besh.", 'Три на два шесть, минус один это пять.', 'Three times two is six, minus one is five.'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '7', tag: 'Z6', hint: L("Bir ayiriladi, qo'shilmaydi.", 'Один вычитается, а не прибавляется.', 'One is subtracted, not added.') },
        { id: 'c', label: '6', tag: 'Z4', hint: L("Bir ayirish qoldi.", 'Осталось вычесть один.', 'Subtracting one is still to do.') },
        { id: 'd', label: '2', tag: 'Z5', hint: L("Ikki bu x, javob esa y.", 'Два это x, а ответ это y.', 'Two is x, and the answer is y.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = −x + 4 bo'lsa, x beshga teng bo'lganda y nechchi?",
        'Если y = −x + 4, то каково y при x равном пяти?',
        'If y = −x + 4, what is y at x equal to five?',
      ),
      ok: L("Manfiy besh qo'shuv to'rt manfiy bir beradi.", 'Минус пять плюс четыре это минус один.', 'Minus five plus four is minus one.'),
      items: [
        { id: 'a', label: '−1', correct: true },
        { id: 'b', label: '9', tag: 'Z3', hint: L("x oldida minus turibdi, demak besh manfiy bo'lib kiradi.", 'Перед x стоит минус, значит пятёрка входит отрицательной.', 'A minus stands before x, so five enters as negative.') },
        { id: 'c', label: '1', tag: 'Z3', hint: L("Manfiy besh qo'shuv to'rt manfiy bir, musbat bir emas.", 'Минус пять плюс четыре это минус один, а не плюс один.', 'Minus five plus four is minus one, not plus one.') },
        { id: 'd', label: '−9', tag: 'Z3', hint: L("To'rt qo'shiladi, ayirilmaydi.", 'Четыре прибавляется, а не вычитается.', 'Four is added, not subtracted.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(2; −4) nuqtasi qaysi chorakda?",
        'В какой четверти точка (2; −4)?',
        'Which quadrant holds the point (2; −4)?',
      ),
      ok: L("Abssissa musbat, ordinata manfiy: to'rtinchi chorak.", 'Абсцисса положительна, ордината отрицательна: четвёртая четверть.', 'A positive abscissa and a negative ordinate: the fourth quadrant.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '1', tag: 'Z1', hint: L("Birinchi chorakda ordinata musbat bo'lardi.", 'В первой четверти ордината была бы положительной.', 'In the first quadrant the ordinate would be positive.') },
        { id: 'c', label: '2', tag: 'Z1', hint: L("Ikkinchi chorakda abssissa manfiy bo'lardi.", 'Во второй четверти абсцисса была бы отрицательной.', 'In the second quadrant the abscissa would be negative.') },
        { id: 'd', label: '3', tag: 'Z1', hint: L("Uchinchi chorakda ikkovi ham manfiy.", 'В третьей четверти обе отрицательны.', 'In the third quadrant both are negative.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Ikkitasi qiymat haqida, bittasi chorak haqida.", 'Три коротких вопроса. Два про значение, один про четверть.', 'Three short questions. Two about the value, one about the quadrant.'),
    A('1', "Ikkinchisida x oldida minus bor.", 'Во втором перед x стоит минус.', 'In the second a minus stands before x.'),
    A('2', "Uchinchisi o'tgan darsdan.", 'Третий из прошлых уроков.', 'The third is from the earlier lessons.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. CHIZIQ CHIZILDI: nuqtani chiziq USTIGA qo'yish.
// ============================================================
const S3 = {
  kind: 'plane',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Grafik to\'g\'ri chiziq', 'График это прямая', 'The graph is a straight line'),
  range: BOX,
  fn: [{ id: 'l', f: (x) => x + 1 }],
  pick: { x: 2, y: 3 },
  caption: L(
    "y = x + 1 grafigi chizilgan. x o'rniga ikkini qo'ying, y ni toping, nuqtani grafikda belgilang.",
    'График y = x + 1 нарисован. Подставь вместо x двойку, найди y, отметь точку на графике.',
    'The graph of y = x + 1 is drawn. Put two in place of x, find y, mark the point on the graph.',
  ),
  options: [
    { id: 'a', label: '3' },
    { id: 'b', label: '2' },
    { id: 'c', label: '1' },
    { id: 'd', label: '4' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Formulada birlik qo'shiladi: ikki qo'shuv bir uch.", 'В формуле прибавляется единица: два плюс один три.', 'The formula adds one: two plus one is three.') },
    { key: 'c', tag: 'Z5', hint: L("Bir bu b, ya'ni chiziq y o'qini kesgan joy. Bizga esa x ikkidagi qiymat kerak.", 'Один это b, место пересечения с осью y. А нужно значение при x равном двум.', 'One is b, where the line crosses the y axis. We need the value at x equal to two.') },
    { key: 'd', tag: 'Z6', hint: L("Ikki qo'shuv bir uch, to'rt emas.", 'Два плюс один три, а не четыре.', 'Two plus one is three, not four.') },
  ],
  note: L(
    "Chiziq FORMULADAN quriladi: har x uchun y hisoblanadi va nuqta o'z joyiga tushadi. Shuning uchun hamma nuqta bitta to'g'ri chiziqda yotadi.",
    'Прямая строится ИЗ ФОРМУЛЫ: для каждого x считается y, и точка встаёт на своё место. Поэтому все точки лежат на одной прямой.',
    'The line is built FROM THE FORMULA: for each x the y is computed and the point takes its place. That is why every point lies on one straight line.',
  ),
  audio: [
    A('mount', "Formulaning grafigi to'g'ri chiziq bo'ladi.", 'График формулы это прямая.', 'The graph of the formula is a straight line.'),
    A('mount', "x o'rniga ikkini qo'ying, y ni toping va nuqtani chiziq ustida belgilang.", 'Подставь вместо x двойку, найди y и отметь точку на прямой.', 'Put two in place of x, find y and mark the point on the line.'),
    A('dot', "Nuqta qo'yildi. Endi shu qiymatni formuladan ham oling.", 'Точка поставлена. Теперь получи это же значение из формулы.', 'The point is placed. Now get the same value from the formula.'),
  ],
}

// ============================================================
// 4. FARQLASH. k MANFIY: chiziq boshqa tomonga ketadi.
// ============================================================
const S4 = {
  kind: 'plane',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('k manfiy bo\'lsa', 'Если k отрицательный', 'When k is negative'),
  range: BOX,
  fn: [{ id: 'l', f: (x) => -x + 1 }],
  caption: L(
    "Endi y = −x + 1. Chiziq boshqa tomonga ketdi. Qaysi choraklardan o'tadi?",
    'Теперь y = −x + 1. Прямая пошла в другую сторону. Через какие четверти она идёт?',
    'Now y = −x + 1. The line went the other way. Which quadrants does it pass through?',
  ),
  options: [
    { id: 'a', label: L("ikkinchi va to'rtinchi", 'вторая и четвёртая', 'the second and the fourth') },
    { id: 'b', label: L('birinchi va uchinchi', 'первая и третья', 'the first and the third') },
    { id: 'c', label: L('faqat ikkinchi', 'только вторая', 'the second only') },
    { id: 'd', label: L('hamma choraklardan', 'через все четверти', 'through all the quadrants') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Birinchi va uchinchi chorak k MUSBAT bo'lganda bo'ladi, oldingi ekrandagidek.", 'Первая и третья бывают при k ПОЛОЖИТЕЛЬНОМ, как на прошлом экране.', 'The first and third happen when k is POSITIVE, as on the last screen.') },
    { key: 'c', tag: 'Z1', hint: L("Chiziq ikki tomonga cheksiz davom etadi, faqat bitta chorakda qolmaydi.", 'Прямая продолжается в обе стороны бесконечно, в одной четверти она не остаётся.', 'A line goes on forever both ways, it does not stay in one quadrant.') },
    { key: 'd', tag: 'Z1', hint: L("Chizmaga qarang: chiziq ikki qarama-qarshi chorakdan o'tadi.", 'Посмотри на чертёж: прямая проходит через две противоположные четверти.', 'Look at the drawing: the line passes through two opposite quadrants.') },
  ],
  note: L(
    "k ning ISHORASI yo'nalishni belgilaydi: k musbat bo'lsa chiziq birinchi va uchinchi chorakdan, k manfiy bo'lsa ikkinchi va to'rtinchi chorakdan o'tadi.",
    'ЗНАК k задаёт направление: при k положительном прямая идёт через первую и третью четверти, при k отрицательном — через вторую и четвёртую.',
    'The SIGN of k sets the direction: a positive k sends the line through the first and third quadrants, a negative k through the second and fourth.',
  ),
  audio: [
    A('mount', "Formulada bitta belgi o'zgardi: x oldida minus paydo bo'ldi.", 'В формуле изменился один знак: перед x появился минус.', 'One sign changed in the formula: a minus appeared before x.'),
    A('mount', "Chiziqqa qarang: u boshqa tomonga qiyalab ketdi.", 'Посмотри на прямую: она наклонилась в другую сторону.', 'Look at the line: it tilted the other way.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. k va b dan formula yig'iladi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('k va b dan formula', 'Формула из k и b', 'A formula from k and b'),
  given: L(
    "Chiziqli funksiya y = kx + b ko'rinishida yoziladi. Bu funksiyada k ikkiga, b esa manfiy uchga teng.",
    'Линейная функция записывается как y = kx + b. В этой функции k равен двум, а b равен минус трём.',
    'A linear function is written as y = kx + b. In this one k is two and b is minus three.',
  ),
  template: ['y = ', { slot: 0 }, 'x ', { slot: 1 }],
  parts: [
    { id: 'a', label: '2' },
    { id: 'b', label: '− 3' },
    { id: 'c', label: '−2' },
    { id: 'd', label: '+ 3' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Formulani yig'ing.",
    'Собери формулу.',
    'Build the formula.',
  ),
  checkNote: L(
    "k bu x oldidagi koeffitsiyent, b esa qo'shiluvchi. b manfiy bo'lsa, u ayirish bo'lib yoziladi.",
    'k это коэффициент перед x, а b это слагаемое. Если b отрицательно, оно записывается вычитанием.',
    'k is the coefficient before x, b is the addend. A negative b is written as a subtraction.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("k ikkiga teng deb berilgan, manfiy ikkiga emas.", 'k дано равным двум, а не минус двум.', 'k is given as two, not minus two.') },
    { key: 'd', tag: 'Z3', hint: L("b manfiy uch, demak yozuvda ayirish turadi.", 'b это минус три, значит в записи вычитание.', 'b is minus three, so the record takes a subtraction.') },
    { key: '*', tag: 'Z4', hint: L("k x oldida turadi, b esa alohida had.", 'k стоит перед x, а b отдельный член.', 'k stands before x, b is a separate term.') },
  ],
  audio: [
    A('mount', "Chiziqli funksiyaning umumiy ko'rinishi bor: y teng k x qo'shuv b.", 'У линейной функции есть общий вид: y равно k x плюс b.', 'A linear function has a general form: y equals k x plus b.'),
    A('mount', "k qiyalikni beradi, b esa chiziq y o'qini qayerda kesishini.", 'k задаёт наклон, а b то, где прямая пересекает ось y.', 'k sets the tilt, b sets where the line crosses the y axis.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. Nuqta grafikda yoki yo'q: qo'yib ko'rish.
// ============================================================
const S6 = {
  kind: 'plane',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Nuqta chiziqda turadimi', 'Лежит ли точка на прямой', 'Does the point lie on the line'),
  range: BOX,
  fn: [{ id: 'l', f: (x) => 2 * x - 3 }],
  pick: { x: 3, y: 3 },
  caption: L(
    "y = 2x − 3 grafigi chizilgan. x o'rniga uchni qo'ying, y ni toping, nuqtani grafikda belgilang.",
    'График y = 2x − 3 нарисован. Подставь вместо x тройку, найди y, отметь точку на графике.',
    'The graph of y = 2x − 3 is drawn. Put three in place of x, find y, mark the point on the graph.',
  ),
  options: [
    { id: 'a', label: L('(3; 4) chiziqda turmaydi', '(3; 4) на прямой не лежит', '(3; 4) does not lie on the line') },
    { id: 'b', label: L('(3; 4) ham chiziqda turadi', '(3; 4) тоже лежит на прямой', '(3; 4) lies on the line too') },
    { id: 'c', label: L('chiziqda faqat butun nuqtalar bor', 'на прямой только целые точки', 'the line holds only whole points') },
    { id: 'd', label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'it cannot be decided') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Formulaga uchni qo'ying: ikki karra uch minus uch, ya'ni uch. To'rt emas.", 'Подставь три в формулу: два на три минус три это три. А не четыре.', 'Substitute three: two times three minus three is three. Not four.') },
    { key: 'c', tag: 'Z5', hint: L("Chiziqda cheksiz nuqta bor, kasr koordinatalilari ham.", 'На прямой бесконечно много точек, и с дробными координатами тоже.', 'A line holds infinitely many points, including fractional ones.') },
    { key: 'd', tag: 'Z2', hint: L("Aniqlanadi va ko'z bilan emas: formulaga son qo'yiladi.", 'Определяется, и не на глаз: в формулу подставляется число.', 'It can be decided, and not by eye: a number goes into the formula.') },
  ],
  note: L(
    "Nuqta grafikka tegishlimi yoki yo'q -- buni KO'Z hal qilmaydi. Formulaga abssissani qo'yish kerak: chiqqan y nuqtaning ordinatasiga teng bo'lsa, tegishli.",
    'Принадлежит точка графику или нет — решает не ГЛАЗ. Надо подставить абсциссу в формулу: если вышедшее y совпало с ординатой точки, принадлежит.',
    'Whether a point belongs to a graph is not decided by EYE. Put the abscissa into the formula: if the y matches the ordinate, it belongs.',
  ),
  audio: [
    A('mount', "Bu safar koeffitsiyent ikki, va chiziq tikroq ketadi.", 'На этот раз коэффициент два, и прямая идёт круче.', 'This time the coefficient is two, and the line runs steeper.'),
    A('mount', "x o'rniga uchni qo'ying, y ni toping va nuqtani grafikda belgilang.", 'Подставь вместо x тройку, найди y и отметь точку на графике.', 'Put three in place of x, find y and mark the point on the graph.'),
    A('dot', "Endi savolga javob bering: yaqin nuqta ham chiziqda turadimi.", 'Теперь ответь на вопрос: лежит ли на прямой соседняя точка.', 'Now answer: does the neighbouring point lie on the line.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: k NOL. Chiziq gorizontal bo'lib qoladi.
// ============================================================
const S7 = {
  kind: 'plane',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('k nolga teng bo\'lsa', 'Если k равен нулю', 'When k equals zero'),
  range: BOX,
  fn: [{ id: 'l', f: () => 2 }],
  caption: L(
    "Bu yerda k nolga teng: y = 2. Chiziq qanday ketdi?",
    'Здесь k равен нулю: y = 2. Как пошла прямая?',
    'Here k equals zero: y = 2. How does the line run?',
  ),
  options: [
    { id: 'a', label: L("gorizontal: y har doim ikkiga teng", 'горизонтально: y всегда равен двум', 'horizontal: y always equals two') },
    { id: 'b', label: L('vertikal', 'вертикально', 'vertical') },
    { id: 'c', label: L('bu funksiya emas', 'это не функция', 'this is not a function') },
    { id: 'd', label: L('chiziq yo\'q', 'прямой нет', 'there is no line') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Vertikal chiziq funksiya bo'lmaydi: bitta x ga cheksiz y mos kelib qolardi.", 'Вертикальная прямая не функция: одному x отвечало бы бесконечно много y.', 'A vertical line is not a function: one x would have infinitely many y.') },
    { key: 'c', tag: 'Z5', hint: L("Funksiya: har x ga aniq bitta y, va u ikkiga teng.", 'Функция: каждому x ровно одно y, и оно равно двум.', 'It is a function: each x has exactly one y, and it equals two.') },
    { key: 'd', tag: 'Z6', hint: L("Chiziq bor va u chizmada ko'rinib turibdi.", 'Прямая есть, и она видна на чертеже.', 'The line is there and visible on the drawing.') },
  ],
  note: L(
    "k nol bo'lsa x hech narsani o'zgartirmaydi: y har doim b ga teng bo'ladi va chiziq GORIZONTAL bo'lib qoladi. Bu ham chiziqli funksiya.",
    'Если k равен нулю, x ничего не меняет: y всегда равен b, и прямая становится ГОРИЗОНТАЛЬНОЙ. Это тоже линейная функция.',
    'When k is zero, x changes nothing: y always equals b and the line becomes HORIZONTAL. That is a linear function too.',
  ),
  audio: [
    A('mount', "Endi maxsus holat: k nolga teng.", 'Теперь особый случай: k равен нулю.', 'Now a special case: k equals zero.'),
    A('mount', "x oldida koeffitsiyent yo'q, ya'ni x qiymatga ta'sir qilmaydi.", 'Перед x нет коэффициента, значит x на значение не влияет.', 'There is no coefficient before x, so x does not affect the value.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z1',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("chiziqli funksiyaning grafigi to'g'ri chiziq", 'график линейной функции это прямая', 'the graph of a linear function is a straight line') },
    { id: 'f2', label: L('k musbat bo\'lsa birinchi va uchinchi chorakdan', 'при k положительном через первую и третью', 'a positive k means the first and third') },
    { id: 'f3', label: L("k manfiy bo'lsa ikkinchi va to'rtinchi chorakdan", 'при k отрицательном через вторую и четвёртую', 'a negative k means the second and fourth') },
    { id: 'f4', label: L("b esa chiziq y o'qini kesgan joy", 'а b это место пересечения с осью y', 'and b is where it crosses the y axis') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval grafik nima ekani, keyin k musbat, keyin k manfiy, oxirida b.",
    'Порядок нарушен. Сначала что такое график, потом k положительный, потом отрицательный, в конце b.',
    'The order is off. What the graph is first, then a positive k, then a negative one, and b last.',
  ),
  lawChips: [
    { label: 'k', tone: 's2' },
    { label: 'b', tone: 's1' },
    { label: '( )', tone: 'par' },
    { label: '0', tone: 'off' },
  ],
  lawSweep: L(
    'qiyalik, kesishish, chorak, nol',
    'наклон, пересечение, четверть, ноль',
    'the tilt, the crossing, the quadrant, zero',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Chiziqli funksiya y = kx + b ko'rinishida yoziladi, va uning grafigi TO'G'RI CHIZIQ bo'ladi. k qiyalikni belgilaydi, b esa chiziq y o'qini qayerda kesishini.",
        'Линейная функция записывается как y = kx + b, и её график это ПРЯМАЯ. k задаёт наклон, а b то, где прямая пересекает ось y.',
        'A linear function is written y = kx + b, and its graph is a STRAIGHT LINE. k sets the tilt, b sets where it crosses the y axis.',
      ),
      L(
        "k musbat bo'lsa chiziq birinchi va uchinchi chorakdan o'tadi, k manfiy bo'lsa ikkinchi va to'rtinchi chorakdan. k nol bo'lsa chiziq gorizontal bo'ladi.",
        'При k положительном прямая идёт через первую и третью четверти, при k отрицательном через вторую и четвёртую. При k равном нулю прямая горизонтальна.',
        'A positive k sends the line through the first and third quadrants, a negative k through the second and fourth. A zero k makes it horizontal.',
      ),
    ],
  },
  hookCap: L(
    'k ning ishorasi yo\'nalishni belgilaydi',
    'Знак k задаёт направление',
    'The sign of k sets the direction',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('grafik -- chiziq', 'график это прямая', 'the graph is a line'),
    L('k -- qiyalik', 'k это наклон', 'k is the tilt'),
    L('b -- kesishish', 'b это пересечение', 'b is the crossing'),
  ],
  audio: [
    A('mount', "Uch holatni ko'rdik: k musbat, k manfiy va k nol. Endi qoidani yig'amiz.", 'Три случая мы увидели: k положительный, отрицательный и ноль. Теперь соберём правило.', 'We have seen three cases: a positive k, a negative one and zero. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda grafik bo'yicha O'QIYMIZ.", 'Верно. На следующем уроке будем ЧИТАТЬ по графику.', 'Correct. Next lesson we will READ off the graph.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni toping', 'Найди ответ', 'Find the answer'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = 5x grafigi qaysi choraklardan o'tadi?",
        'Через какие четверти идёт график y = 5x?',
        'Which quadrants does the graph of y = 5x pass through?',
      ),
      ok: L("k musbat, demak birinchi va uchinchi chorak.", 'k положительный, значит первая и третья четверти.', 'k is positive, so the first and third quadrants.'),
      items: [
        { id: 'a', label: 'I, III', correct: true },
        { id: 'b', label: 'II, IV', tag: 'Z1', hint: L("Bunday k manfiy bo'lganda bo'ladi.", 'Так бывает при k отрицательном.', 'That happens when k is negative.') },
        { id: 'c', label: 'I, II', tag: 'Z1', hint: L("Chiziq QARAMA-QARSHI choraklardan o'tadi, yonma-yon turganlaridan emas.", 'Прямая проходит через ПРОТИВОПОЛОЖНЫЕ четверти, а не через соседние.', 'A line passes through OPPOSITE quadrants, not neighbouring ones.') },
        { id: 'd', label: 'III, IV', tag: 'Z1', hint: L("Bu ham yonma-yon turgan choraklar.", 'Это тоже соседние четверти.', 'Those are neighbouring quadrants too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = −3x + 2 da k nechchiga teng?",
        'Чему равен k в y = −3x + 2?',
        'What is k in y = −3x + 2?',
      ),
      ok: L("k bu x oldidagi koeffitsiyent, ishorasi bilan.", 'k это коэффициент перед x, со своим знаком.', 'k is the coefficient before x, with its sign.'),
      items: [
        { id: 'a', label: '−3', correct: true },
        { id: 'b', label: '3', tag: 'Z3', hint: L("Ishora ham koeffitsiyentga kiradi.", 'Знак тоже входит в коэффициент.', 'The sign belongs to the coefficient.') },
        { id: 'c', label: '2', tag: 'Z4', hint: L("Ikki bu b, x oldida turmaydi.", 'Два это b, оно не стоит перед x.', 'Two is b, it does not stand before x.') },
        { id: 'd', label: '−1', tag: 'Z6', hint: L("x oldida manfiy uch turibdi.", 'Перед x стоит минус три.', 'Minus three stands before x.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(1; 4) nuqtasi y = 3x + 1 grafigida turadimi?",
        'Лежит ли точка (1; 4) на графике y = 3x + 1?',
        'Does the point (1; 4) lie on the graph of y = 3x + 1?',
      ),
      ok: L("Birni qo'ysak uch qo'shuv bir to'rt chiqadi, ordinata ham to'rt.", 'Подставим один: три плюс один это четыре, и ордината четыре.', 'Substituting one gives three plus one, four, and the ordinate is four.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('ha, turadi', 'да, лежит', 'yes, it does'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L("yo'q, turmaydi", 'нет, не лежит', 'no, it does not'),
          hint: L("Formulaga birni qo'ying: uch karra bir qo'shuv bir to'rt beradi.", 'Подставь один в формулу: три на один плюс один это четыре.', 'Substitute one: three times one plus one is four.'),
        },
        {
          id: 'c',
          tag: 'Z2',
          label: L("chizmasiz aniqlab bo'lmaydi", 'без чертежа определить нельзя', 'it cannot be decided without a drawing'),
          hint: L("Formulaga son qo'yish yetadi, chizma kerak emas.", 'Достаточно подставить число в формулу, чертёж не нужен.', 'Substituting into the formula is enough, no drawing needed.'),
        },
        {
          id: 'd',
          tag: 'Z5',
          label: L('faqat b ga qarash kerak', 'надо смотреть только на b', 'only b should be checked'),
          hint: L("b faqat bitta nuqtani beradi, qolganlari k bilan hisoblanadi.", 'b даёт только одну точку, остальные считаются через k.', 'b gives one point only, the rest come from k.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = 4x − 8 grafigi y o'qini qayerda kesadi?",
        'Где график y = 4x − 8 пересекает ось y?',
        'Where does the graph of y = 4x − 8 cross the y axis?',
      ),
      ok: L("y o'qida x nolga teng, demak y ga b qoladi.", 'На оси y x равен нулю, значит остаётся b.', 'On the y axis x is zero, so b is what remains.'),
      items: [
        { id: 'a', label: '−8', correct: true },
        { id: 'b', label: '8', tag: 'Z3', hint: L("Yozuvda ayirish turibdi, demak b manfiy sakkiz.", 'В записи вычитание, значит b это минус восемь.', 'The record subtracts, so b is minus eight.') },
        { id: 'c', label: '4', tag: 'Z4', hint: L("To'rt bu k, u qiyalikni beradi.", 'Четыре это k, оно задаёт наклон.', 'Four is k, it sets the tilt.') },
        { id: 'd', label: '2', tag: 'Z6', hint: L("x nol bo'lganda to'rt karra nol nol beradi, qolgani manfiy sakkiz.", 'При x равном нулю четыре на ноль это ноль, остаётся минус восемь.', 'At x zero, four times zero is zero, leaving minus eight.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Birinchisi choraklar haqida, oxirgisi b haqida.", 'Четыре вопроса. Первый про четверти, последний про b.', 'Four questions. The first about quadrants, the last about b.'),
    A('1', "Ikkinchisida ishoraga diqqat.", 'Во втором внимание на знак.', 'In the second, watch the sign.'),
    A('2', "Uchinchisi son qo'yish bilan tekshiriladi.", 'Третий проверяется подстановкой.', 'The third is checked by substituting.'),
    A('3', "Oxirgisida x nolga teng.", 'В последнем x равен нулю.', 'In the last one x equals zero.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: qiymat, keyin chorak.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Qiymat va chorak', 'Значение и четверть', 'The value and the quadrant'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['y = −2x + 1.   x = 3   →   y = ', { slot: 0 }, ',   x = 0   →   y = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '−5' },
    { id: 'b', label: '1' },
    { id: 'c', label: '5' },
    { id: 'd', label: '−1' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki qiymatni hisoblang.",
    'Посчитай два значения.',
    'Work out the two values.',
  ),
  checkNote: L(
    "Manfiy ikki karra uch manfiy olti, qo'shuv bir manfiy besh. x nol bo'lganda esa faqat b qoladi.",
    'Минус два на три это минус шесть, плюс один минус пять. А при x равном нулю остаётся только b.',
    'Minus two times three is minus six, plus one is minus five. At x zero only b remains.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("k manfiy, demak ko'paytma ham manfiy chiqadi.", 'k отрицательный, значит и произведение отрицательно.', 'k is negative, so the product is negative too.') },
    { key: 'd', tag: 'Z4', hint: L("x nol bo'lganda ko'paytma nol bo'ladi va b qoladi, b esa musbat bir.", 'При x равном нулю произведение ноль и остаётся b, а b это плюс один.', 'At x zero the product is zero and b remains, and b is plus one.') },
    { key: '*', tag: 'Z6', hint: L("Har qiymat alohida hisoblanadi.", 'Каждое значение считается отдельно.', 'Each value is worked out separately.') },
  ],
  probe: {
    question: L("Birinchi nuqta qaysi chorakda?", 'В какой четверти первая точка?', 'Which quadrant is the first point in?'),
    items: [
      { id: 'a', correct: true, label: '4' },
      { id: 'b', tag: 'Z1', label: '1', hint: L("Ordinata manfiy besh, ya'ni nuqta x o'qidan pastda.", 'Ордината минус пять, значит точка ниже оси x.', 'The ordinate is minus five, so the point is below the x axis.') },
      { id: 'c', tag: 'Z1', label: '2', hint: L("Abssissa uch, u musbat.", 'Абсцисса три, она положительна.', 'The abscissa is three, it is positive.') },
      { id: 'd', tag: 'Z1', label: '3', hint: L("Uchinchi chorakda abssissa ham manfiy bo'lardi.", 'В третьей четверти абсцисса тоже была бы отрицательной.', 'In the third quadrant the abscissa would be negative too.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval ikki qiymat, keyin chorak.", 'Два шага. Сначала два значения, потом четверть.', 'Two steps. Two values first, then the quadrant.'),
    A('mount', "Diqqat: k manfiy, va bu ishoraga ta'sir qiladi.", 'Внимание: k отрицательный, и это влияет на знак.', 'Careful: k is negative, and that affects the sign.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Nuqta grafikda turadimi: SON QO'YISH.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Ko\'z bilan emas', 'Не на глаз', 'Not by eye'),
  given: L(
    "(2; 5) nuqtasi y = 4x − 3 grafigida turadimi? Chizmaga qaramasdan tekshiring.",
    'Лежит ли точка (2; 5) на графике y = 4x − 3? Проверь без чертежа.',
    'Does the point (2; 5) lie on the graph of y = 4x − 3? Check without a drawing.',
  ),
  template: ['4 · 2 − 3 = ', { slot: 0 }, '   →   ', { slot: 1 }],
  parts: [
    { id: 'a', label: '5' },
    { id: 'b', label: L('turadi', 'лежит', 'it lies on it') },
    { id: 'c', label: '11' },
    { id: 'd', label: L('turmaydi', 'не лежит', 'it does not') },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Hisoblang va xulosa qiling.",
    'Посчитай и сделай вывод.',
    'Compute and draw the conclusion.',
  ),
  checkNote: L(
    "To'rt karra ikki sakkiz, undan uch ayirilsa besh. Nuqtaning ordinatasi ham besh, demak nuqta grafikda turadi.",
    'Четыре на два восемь, минус три это пять. Ордината точки тоже пять, значит точка лежит на графике.',
    'Four times two is eight, minus three is five. The ordinate is five too, so the point lies on the graph.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Uch ayiriladi, qo'shilmaydi.", 'Три вычитается, а не прибавляется.', 'Three is subtracted, not added.') },
    { key: 'd', tag: 'Z2', hint: L("Hisob besh berdi, ordinata ham besh. Ular teng.", 'Счёт дал пять, и ордината пять. Они равны.', 'The computation gave five, and the ordinate is five. They match.') },
    { key: '*', tag: 'Z2', hint: L("Abssissani formulaga qo'yib, chiqqan sonni ordinata bilan solishtiring.", 'Подставь абсциссу в формулу и сравни результат с ординатой.', 'Substitute the abscissa and compare the result with the ordinate.') },
  ],
  audio: [
    A('mount', "Bu safar chizma yo'q. Tegishlilikni son qo'yish hal qiladi.", 'На этот раз чертежа нет. Принадлежность решает подстановка.', 'This time there is no drawing. Substitution decides membership.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Chizmada nuqta chiziqqa YAQIN turibdi, va
// shuning uchun «tegishli» deb aytilgan. Son qo'yish rad etadi.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Formula va nuqta to'g'ri yozilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Формула и точка выписаны верно. И всё же какая строка ошибочна?',
    'The formula and the point are written right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: 'y = 3x + 2' },
    { id: 'r2', text: L('nuqta: (1; 6)', 'точка: (1; 6)', 'point: (1; 6)') },
    { id: 'r3', text: '3 · 1 + 2 = 5' },
    { id: 'r4', text: L('5 nuqtaning y si bilan mos keldi', '5 совпало с y точки', '5 matched the y of the point') },
    { id: 'r5', text: L('javob: nuqta grafikda turadi', 'ответ: точка лежит на графике', 'answer: the point lies on the graph') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu berilgan formula.", 'Это данная формула.', 'That is the given formula.'),
    r2: L("Bu berilgan nuqta.", 'Это данная точка.', 'That is the given point.'),
    r3: L("To'g'ri: uch karra bir qo'shuv ikki besh beradi.", 'Верно: три на один плюс два это пять.', 'Right: three times one plus two is five.'),
      r5: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z2', r2: 'Z2', r3: 'Z2' , r5: 'Z2' },
  proofFill: {
    template: ['5 ', { slot: 0 }, ' 6   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: '≠' },
      { id: 'b', label: L('turmaydi', 'не лежит', 'it does not lie on it') },
      { id: 'c', label: '=' },
      { id: 'd', label: L('turadi', 'лежит', 'it lies on it') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Hisobni ordinata bilan solishtiring va xulosani tuzating.",
      'Сравни результат с ординатой и исправь вывод.',
      'Compare the result with the ordinate and fix the conclusion.',
    ),
    checkNote: L(
      "Hisob besh berdi, nuqtaning ordinatasi esa olti. Ular teng emas, demak nuqta grafikda turmaydi -- chizmada u chiziqqa yaqin ko'ringan bo'lsa ham.",
      'Счёт дал пять, а ордината точки шесть. Они не равны, значит точка на графике не лежит — даже если на чертеже казалась близкой к прямой.',
      'The computation gave five, the ordinate is six. They differ, so the point does not lie on the graph — even if it looked close to the line.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z2', hint: L("Besh va olti teng emas.", 'Пять и шесть не равны.', 'Five and six are not equal.') },
      { key: 'd', tag: 'Z2', hint: L("Qiymatlar mos kelmadi, demak nuqta chiziqdan chetda.", 'Значения не совпали, значит точка вне прямой.', 'The values did not match, so the point is off the line.') },
      { key: '*', tag: 'Z2', hint: L("Tegishlilikni faqat tenglik hal qiladi.", 'Принадлежность решает только равенство.', 'Only equality decides membership.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda hisob to'g'ri bajarilgan.", 'В этой ловушке счёт выполнен верно.', 'In this trap the computation is done right.'),
    A('mount', "Shunday bo'lsa ham xulosa noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же вывод неверен. В какой строке ошибка впервые.', 'And yet the conclusion is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Hisob besh berdi, ordinata esa olti edi.", 'Нашёл. Счёт дал пять, а ордината была шесть.', 'You found it. The computation gave five, and the ordinate was six.'),
    A('done', "Yaqin turish yetarli emas: tegishlilikni tenglik hal qiladi.", 'Быть рядом недостаточно: принадлежность решает равенство.', 'Being close is not enough: equality decides membership.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. SO'ZLI HOLAT: taksi narxi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Taksining narxi', 'Цена поездки', 'The price of a ride'),
  given: L(
    "Taksi o'tirish uchun ikki ming so'm, keyin har kilometr uchun uch ming so'm oladi. Narx yo'lga qarab chiziqli funksiya bo'ladi.",
    'Такси берёт две тысячи сумов за посадку и три тысячи за каждый километр. Цена от расстояния это линейная функция.',
    'A taxi charges two thousand sums to start and three thousand per kilometre. The price against distance is a linear function.',
  ),
  template: ['y = ', { slot: 0 }, 'x + ', { slot: 1 }],
  parts: [
    { id: 'a', label: '3' },
    { id: 'b', label: '2' },
    { id: 'c', label: '5' },
    { id: 'd', label: '6' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Formulani yig'ing, ming so'mda.",
    'Собери формулу, в тысячах сумов.',
    'Build the formula, in thousands of sums.',
  ),
  checkNote: L(
    "Har kilometr narxi k bo'ladi, o'tirish narxi esa b: u yo'lga bog'liq emas va nolinchi kilometrda ham to'lanadi.",
    'Цена за километр это k, а плата за посадку это b: она не зависит от расстояния и платится даже на нулевом километре.',
    'The price per kilometre is k, the boarding fee is b: it does not depend on distance and is paid even at zero kilometres.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Sonlar qo'shilmaydi: biri kilometr uchun, ikkinchisi o'tirish uchun.", 'Числа не складываются: одно за километр, другое за посадку.', 'The numbers do not add: one is per kilometre, the other for boarding.') },
    { key: 'd', tag: 'Z6', hint: L("Ko'paytirish ham kerak emas.", 'Умножать тоже не нужно.', 'No multiplying either.') },
    { key: '*', tag: 'Z4', hint: L("Yo'lga bog'liq narx k bo'ladi, bog'liq bo'lmagani esa b.", 'Цена, зависящая от расстояния, это k, а не зависящая это b.', 'The distance dependent price is k, the independent one is b.') },
  ],
  audio: [
    A('mount', "Chiziqli funksiya hayotda ham uchraydi: taksining narxi shunday.", 'Линейная функция встречается и в жизни: так устроена цена поездки.', 'A linear function shows up in life too: that is how a ride is priced.'),
    A('mount', "Bir qismi yo'lga bog'liq, bir qismi esa yo'q.", 'Одна часть зависит от расстояния, другая нет.', 'One part depends on the distance, the other does not.'),
  ],
}

// ============================================================
// 14. BLITS. Baholanadigan YAGONA ekran.
// ============================================================
const S14 = {
  kind: 'blitz',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = −4x grafigi qaysi choraklardan o'tadi?",
        'Через какие четверти идёт график y = −4x?',
        'Which quadrants does the graph of y = −4x pass through?',
      ),
      ok: L("k manfiy: ikkinchi va to'rtinchi.", 'k отрицательный: вторая и четвёртая.', 'k is negative: the second and the fourth.'),
      items: [
        { id: 'a', label: 'II, IV', correct: true },
        { id: 'b', label: 'I, III', tag: 'Z1', hint: L("Bu k musbat bo'lganda bo'ladi.", 'Так бывает при k положительном.', 'That happens when k is positive.') },
        { id: 'c', label: 'I, II', tag: 'Z1', hint: L("Chiziq qarama-qarshi choraklardan o'tadi.", 'Прямая проходит через противоположные четверти.', 'A line passes through opposite quadrants.') },
        { id: 'd', label: 'II, III', tag: 'Z1', hint: L("Bu ham yonma-yon turgan choraklar.", 'Это тоже соседние четверти.', 'Those are neighbouring quadrants too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = 7x − 5 da b nechchiga teng?",
        'Чему равен b в y = 7x − 5?',
        'What is b in y = 7x − 5?',
      ),
      ok: L("b bu qo'shiluvchi, ishorasi bilan.", 'b это слагаемое, со своим знаком.', 'b is the addend, with its sign.'),
      items: [
        { id: 'a', label: '−5', correct: true },
        { id: 'b', label: '5', tag: 'Z3', hint: L("Yozuvda ayirish turibdi.", 'В записи вычитание.', 'The record subtracts.') },
        { id: 'c', label: '7', tag: 'Z4', hint: L("Yetti bu k.", 'Семь это k.', 'Seven is k.') },
        { id: 'd', label: '2', tag: 'Z6', hint: L("Sonlar ayirilmaydi, ular alohida turadi.", 'Числа не вычитаются друг из друга, они стоят отдельно.', 'The numbers are not subtracted from each other, they stand apart.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(3; 7) nuqtasi y = 2x + 1 grafigida turadimi?",
        'Лежит ли точка (3; 7) на графике y = 2x + 1?',
        'Does the point (3; 7) lie on the graph of y = 2x + 1?',
      ),
      ok: L("Ikki karra uch qo'shuv bir yetti beradi, ordinata ham yetti.", 'Два на три плюс один это семь, и ордината семь.', 'Two times three plus one is seven, and the ordinate is seven.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z2', label: L("yo'q", 'нет', 'no'), hint: L("Hisob yetti berdi, ordinata ham yetti.", 'Счёт дал семь, и ордината семь.', 'The computation gave seven, and so is the ordinate.') },
        { id: 'c', tag: 'Z2', label: L('chizma kerak', 'нужен чертёж', 'a drawing is needed'), hint: L("Son qo'yish yetadi.", 'Достаточно подстановки.', 'Substitution is enough.') },
        { id: 'd', tag: 'Z5', label: L('k ni bilish kerak emas', 'k знать не нужно', 'k need not be known'), hint: L("k kerak: aynan u qiymatni hisoblashda qatnashadi.", 'k нужно: именно оно участвует в подсчёте значения.', 'k is needed: it takes part in computing the value.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "k nolga teng bo'lsa grafik qanday ketadi?",
        'Как идёт график, если k равен нулю?',
        'How does the graph run when k equals zero?',
      ),
      ok: L("x qiymatga ta'sir qilmaydi, chiziq gorizontal bo'ladi.", 'x на значение не влияет, прямая горизонтальна.', 'x does not affect the value, the line is horizontal.'),
      items: [
        { id: 'a', correct: true, label: L('gorizontal', 'горизонтально', 'horizontally') },
        { id: 'b', tag: 'Z5', label: L('vertikal', 'вертикально', 'vertically'), hint: L("Vertikal chiziq funksiya bo'lmaydi.", 'Вертикальная прямая не функция.', 'A vertical line is not a function.') },
        { id: 'c', tag: 'Z5', label: L('chiziq bo\'lmaydi', 'прямой не будет', 'there will be no line'), hint: L("Chiziq bor: u b balandligida ketadi.", 'Прямая есть: она идёт на высоте b.', 'The line is there: it runs at the height b.') },
        { id: 'd', tag: 'Z1', label: L('birinchi chorakdan', 'через первую четверть', 'through the first quadrant'), hint: L("Gorizontal chiziq ikki chorakdan o'tadi, va bu b ga bog'liq.", 'Горизонтальная прямая проходит через две четверти, и это зависит от b.', 'A horizontal line crosses two quadrants, and that depends on b.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi b haqida.", 'Второй про b.', 'The second is about b.'),
    A('2', "Uchinchisi son qo'yish bilan tekshiriladi.", 'Третий проверяется подстановкой.', 'The third is checked by substituting.'),
    A('3', "Oxirgisi chegaraviy holat.", 'Последний это граничный случай.', 'The last is the edge case.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('k ning ishorasi yo\'nalishni belgilaydi', 'Знак k задаёт направление', 'The sign of k sets the direction'),
  gate: S1.gate,
  fix: {
    tokens: ['II', 'IV'],
    value: '−2',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "k manfiy bo'lsa grafik ikkinchi va to'rtinchi chorakdan o'tadi. x birga teng bo'lganda y manfiy ikki chiqadi, ya'ni nuqta x o'qidan pastda turadi.",
    'При k отрицательном график идёт через вторую и четвёртую четверти. При x равном единице y выходит минус два, то есть точка ниже оси x.',
    'A negative k sends the graph through the second and fourth quadrants. At x equal to one, y is minus two, so the point is below the x axis.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    second: L("ikkinchi va to'rtinchi", 'вторая и четвёртая', 'the second and fourth'),
    first: L('birinchi va uchinchi', 'первая и третья', 'the first and third'),
    all: L('hamma choraklardan', 'через все четверти', 'through all quadrants'),
    none: L("to'g'ri chiziq emas", 'не прямая', 'not a line'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['y = x + 1 → (2; 3)', 'y = −x + 1 → 2', 'y = 2x − 3 → (3; 3)', 'y = 2 → 0'],
  twoLabel: L('B6 bloki davom etadi', 'Блок Б6 продолжается', 'Block B6 continues'),
  twoA: L(
    'k musbat  →  I va III',
    'k положительный  →  I и III',
    'a positive k  →  I and III',
  ),
  twoB: L(
    "k manfiy  →  II va IV",
    'k отрицательный  →  II и IV',
    'a negative k  →  II and IV',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'grafiklarni qurish va o\'qish',
    'построение и чтение графиков',
    'building and reading graphs',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish ikki narsadan chiqdi: grafik to'g'ri chiziq, va k ning ishorasi uning yo'nalishini belgilaydi.", 'Вся сегодняшняя работа вышла из двух вещей: график это прямая, и знак k задаёт её направление.', 'All of today came from two things: the graph is a line, and the sign of k sets its direction.'),
    A('mount', "Keyingi darsda grafik bo'yicha o'qishni o'rganamiz.", 'На следующем уроке научимся читать по графику.', 'Next lesson we learn to read off the graph.'),
  ],
}

export default makeLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
