// ============================================================================
// 7-sinf, Dars 36. GRAFIKLARNI QURISH VA O'QISH.
// (Построение и чтение графиков функций)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// DARSDA IKKI YO'NALISH BOR, va ular ATAYIN ajratilgan:
//   QURISH   -- formula berilgan, nuqta chizmaga qo'yiladi;
//   O'QISH   -- chizma berilgan, koordinatalar chizmadan olinadi.
// O'quvchi ularni aralashtiradi, shuning uchun 4-ekran farqlashga ketadi.
//
// BLOKNING XATOSI: o'qishda O'QLAR ALMASHTIRILADI -- abssissa o'rniga
// ordinata o'qiladi. Xuk aynan shu yerga qo'yilgan.
//
// O'QISH EKRANLARIDA TAYYOR NUQTA IMZOSIZ (`labels` berilmaydi): imzo
// javobni berib qo'yardi. Bu asbobning qoidasi, dars uni buzmaydi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_36'
const LESSON_TITLE = L("Grafiklarni qurish va o'qish", 'Построение и чтение графиков функций', 'Building and reading graphs')
const LESSON_NO = L('36-dars', 'Урок 36', 'Lesson 36')
const BLOCK = { label: L('B6-blok', 'Блок Б6', 'Block B6'), from: 33, to: 39, current: 36 }

const BOX = { x0: -6, x1: 6, y0: -4, y1: 4 }

const TAGS = {
  Z1: L('o\'qlar almashtirildi', 'оси перепутаны', 'the axes were mixed up'),
  Z2: L('nuqta grafikda emas', 'точка не на графике', 'the point is not on the graph'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L('b hisobga olinmadi', 'b не учтено', 'b was not taken into account'),
  Z5: L('qurish va o\'qish almashtirildi', 'построение и чтение перепутаны', 'building and reading were mixed up'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. O'QISHDA O'QLAR ALMASHTIRILDI.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("GRAFIKNI O'QISH", 'ЧТЕНИЕ ГРАФИКА', 'READING A GRAPH'),
  noBack: true,
  noNotes: true,
  title: L('Qaysi o\'q bo\'yicha o\'qidi', 'По какой оси прочитал', 'Along which axis he read'),
  gate: {
    source: { kind: 'plain', tokens: ['x', '=', '2'] },
    rows: [
      { tokens: ['y', '=', '2'], value: '2' },
      { tokens: ['y', '=', '3'], value: '3' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "y = x + 1 grafigi bo'yicha x ikkiga teng bo'lgandagi y izlandi. Tabloda har biri o'qigan qiymat turadi. Kim haq?",
      'По графику y = x + 1 искали y при x равном двум. На табло значение, которое прочитал каждый. Кто прав?',
      'On the graph of y = x + 1 the y at x equal to two was looked for. The boards show what each read off. Who is right?',
    ),
    items: [
      {
        id: 'three',
        label: L('Uch degani', 'Тот, кто прочитал три', 'The one who read three'),
        hint: L(
          "Taxminingiz qabul qilindi. Chizmada va formulada tekshiramiz.",
          'Прогноз принят. Проверим на чертеже и по формуле.',
          'Your prediction is taken. We will check on the drawing and by the formula.',
        ),
      },
      {
        id: 'two',
        label: L('Ikki degani', 'Тот, кто прочитал два', 'The one who read two'),
        hint: L(
          "Ikki bu x ning qiymati. y ni topish uchun VERTIKAL bo'ylab chiziqqa chiqib, keyin y o'qiga o'tish kerak.",
          'Два это значение x. Чтобы найти y, надо по ВЕРТИКАЛИ подняться до прямой, а потом перейти на ось y.',
          'Two is the value of x. To find y you go up the VERTICAL to the line, then across to the y axis.',
        ),
      },
      {
        id: 'one',
        label: L('Bir degani', 'Тот, кто прочитал один', 'The one who read one'),
        hint: L(
          "Bir bu b, chiziq y o'qini kesgan joy. Bizga esa x ikkidagi qiymat kerak.",
          'Один это b, место пересечения с осью y. А нужно значение при x равном двум.',
          'One is b, where the line crosses the y axis. We need the value at x equal to two.',
        ),
      },
      {
        id: 'cant',
        label: L("Grafikdan o'qib bo'lmaydi", 'По графику прочитать нельзя', 'It cannot be read off the graph'),
        hint: L(
          "O'qish mumkin, va formula bilan tekshirish ham mumkin: ikkovi bir xil javob berishi kerak.",
          'Прочитать можно, и проверить формулой тоже: оба должны дать одно.',
          'It can be read, and checked by the formula too: both must agree.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi bitta grafikdan bitta qiymatni o'qidi va boshqa javob oldi.", 'Два ученика прочитали по одному графику одно значение и получили разное.', 'Two students read one value off one graph and got different answers.'),
    A('mount', "Tabloda ular o'qigan qiymat turadi: bittasida ikki, ikkinchisida uch.", 'На табло значение, которое прочитал каждый: у одного два, у другого три.', 'The boards show what each read: two for one, three for the other.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Qiymat, koordinata va k. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = x − 2 bo'lsa, x to'rtga teng bo'lganda y nechchi?",
        'Если y = x − 2, то каково y при x равном четырём?',
        'If y = x − 2, what is y at x equal to four?',
      ),
      ok: L("To'rtdan ikki ayirilsa ikki.", 'Четыре минус два это два.', 'Four minus two is two.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '6', tag: 'Z6', hint: L("Ikki ayiriladi, qo'shilmaydi.", 'Два вычитается, а не прибавляется.', 'Two is subtracted, not added.') },
        { id: 'c', label: '4', tag: 'Z4', hint: L("Ikki ayirish qoldi.", 'Осталось вычесть два.', 'Subtracting two is still to do.') },
        { id: 'd', label: '−2', tag: 'Z3', hint: L("To'rtdan ikki ayiriladi, teskarisi emas.", 'Из четырёх вычитают два, а не наоборот.', 'Two is taken from four, not the other way.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(−1; −3) juftligida ordinata nechchi?",
        'Какова ордината в паре (−1; −3)?',
        'What is the ordinate in the pair (−1; −3)?',
      ),
      ok: L("Ordinata ikkinchi o'rinda turadi.", 'Ордината стоит на втором месте.', 'The ordinate stands in second place.'),
      items: [
        { id: 'a', label: '−3', correct: true },
        { id: 'b', label: '−1', tag: 'Z1', hint: L("Manfiy bir bu abssissa, u birinchi o'rinda.", 'Минус один это абсцисса, она на первом месте.', 'Minus one is the abscissa, it is first.') },
        { id: 'c', label: '3', tag: 'Z3', hint: L("Ishora ham koordinataga kiradi.", 'Знак тоже входит в координату.', 'The sign belongs to the coordinate.') },
        { id: 'd', label: '−4', tag: 'Z6', hint: L("Sonlar qo'shilmaydi.", 'Числа не складываются.', 'The numbers are not added.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = −2x + 2 da k nechchiga teng?",
        'Чему равен k в y = −2x + 2?',
        'What is k in y = −2x + 2?',
      ),
      ok: L("k bu x oldidagi koeffitsiyent, ishorasi bilan.", 'k это коэффициент перед x, со знаком.', 'k is the coefficient before x, with its sign.'),
      items: [
        { id: 'a', label: '−2', correct: true },
        { id: 'b', label: '2', tag: 'Z3', hint: L("x oldida minus turibdi.", 'Перед x стоит минус.', 'A minus stands before x.') },
        { id: 'c', label: '0', tag: 'Z4', hint: L("Koeffitsiyent bor va u noldan farqli.", 'Коэффициент есть, и он не ноль.', 'The coefficient is there and it is not zero.') },
        { id: 'd', label: '4', tag: 'Z6', hint: L("Sonlar ko'paytirilmaydi.", 'Числа не умножаются.', 'The numbers are not multiplied.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Bugun ikki yo'nalish bilan ishlaymiz: qurish va o'qish.", 'Три коротких вопроса. Сегодня работаем в двух направлениях: построение и чтение.', 'Three short questions. Today we work in two directions: building and reading.'),
    A('1', "Ikkinchisi koordinata haqida.", 'Второй про координату.', 'The second is about a coordinate.'),
    A('2', "Uchinchisi o'tgan darsdan.", 'Третий из прошлого урока.', 'The third is from the last lesson.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. QURISH: formula berilgan, nuqta qo'yiladi.
// ============================================================
const S3 = {
  kind: 'plane',
  eyebrow: L('QURAMIZ', 'СТРОИМ', 'BUILDING'),
  title: L('Formuladan chizmaga', 'От формулы к чертежу', 'From the formula to the drawing'),
  range: BOX,
  fn: [{ id: 'l', f: (x) => x - 2 }],
  pick: { x: 4, y: 2 },
  caption: L(
    "y = x − 2 grafigi chizilgan. x o'rniga to'rtni qo'ying, y ni toping, nuqtani grafikda belgilang.",
    'График y = x − 2 нарисован. Подставь вместо x четвёрку, найди y, отметь точку на графике.',
    'The graph of y = x − 2 is drawn. Put four in place of x, find y, mark the point on the graph.',
  ),
  options: [
    { id: 'a', label: L("formula ham xuddi shuni beradi", 'формула даёт то же самое', 'the formula gives the same') },
    { id: 'b', label: L('formula boshqa javob beradi', 'формула даёт другой ответ', 'the formula gives another answer') },
    { id: 'c', label: L('formulani tekshirib bo\'lmaydi', 'формулу проверить нельзя', 'the formula cannot be checked') },
    { id: 'd', label: L("chizma formuladan aniqroq", 'чертёж точнее формулы', 'the drawing is more exact than the formula') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("To'rt minus ikki ikki beradi, va nuqtaning ordinatasi ham ikki.", 'Четыре минус два это два, и ордината точки тоже два.', 'Four minus two is two, and the ordinate is two as well.') },
    { key: 'c', tag: 'Z5', hint: L("Tekshirish oson: abssissani formulaga qo'yish kerak.", 'Проверить просто: подставить абсциссу в формулу.', 'Checking is simple: put the abscissa into the formula.') },
    { key: 'd', tag: 'Z5', hint: L("Aniq javobni FORMULA beradi, chizma esa ko'rsatadi.", 'Точный ответ даёт ФОРМУЛА, а чертёж показывает.', 'The exact answer comes from the FORMULA, the drawing shows it.') },
  ],
  note: L(
    "QURISH shunday ketadi: abssissa olinadi, formulaga qo'yiladi, chiqqan y bo'yicha nuqta qo'yiladi. Chizma va formula bir xil javob berishi shart.",
    'ПОСТРОЕНИЕ идёт так: берём абсциссу, подставляем в формулу, по полученному y ставим точку. Чертёж и формула обязаны давать одно.',
    'BUILDING goes like this: take an abscissa, put it into the formula, place the point at the y you get. The drawing and the formula must agree.',
  ),
  audio: [
    A('mount', "Birinchi yo'nalish -- qurish. Formula bor, nuqtani chizmaga qo'yamiz.", 'Первое направление это построение. Формула есть, точку ставим на чертёж.', 'The first direction is building. The formula is there, we place the point on the drawing.'),
    A('mount', "x o'rniga to'rtni qo'ying, y ni toping va nuqtani grafikda belgilang.", 'Подставь вместо x четвёрку, найди y и отметь точку на графике.', 'Put four in place of x, find y and mark the point on the graph.'),
    A('dot', "Endi tekshiring: formula ham xuddi shu qiymatni beradimi.", 'Теперь проверь: даёт ли формула то же значение.', 'Now check: does the formula give the same value.'),
  ],
}

// ============================================================
// 4. FARQLASH. O'QISH: chizma berilgan, koordinatalar izlanadi.
// Nuqta IMZOSIZ turadi -- aks holda javob berilib qo'yilardi.
// ============================================================
const S4 = {
  kind: 'plane',
  eyebrow: L("O'QIYMIZ", 'ЧИТАЕМ', 'READING'),
  title: L('Chizmadan koordinatalarga', 'От чертежа к координатам', 'From the drawing to the coordinates'),
  range: BOX,
  fn: [{ id: 'l', f: (x) => x - 2 }],
  dots: [{ x: -1, y: -3 }],
  caption: L(
    "O'sha grafik, lekin endi nuqta belgilangan. Uning koordinatalarini o'qing.",
    'Тот же график, но теперь точка отмечена. Прочитай её координаты.',
    'The same graph, but now a point is marked. Read its coordinates.',
  ),
  options: [
    { id: 'a', label: '(−1; −3)' },
    { id: 'b', label: '(−3; −1)' },
    { id: 'c', label: '(1; 3)' },
    { id: 'd', label: '(−1; 3)' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Birinchi o'rinda x bo'yicha son turadi: nuqta noldan bir qadam CHAPDA.", 'На первом месте число по оси x: точка на один шаг ЛЕВЕЕ нуля.', 'First comes the number along x: the point is one step LEFT of zero.') },
    { key: 'c', tag: 'Z3', hint: L("Nuqta ikkala o'qdan ham manfiy tomonda turibdi.", 'Точка стоит с отрицательной стороны от обеих осей.', 'The point sits on the negative side of both axes.') },
    { key: 'd', tag: 'Z3', hint: L("Nuqta x o'qidan PASTDA, demak ordinata manfiy.", 'Точка НИЖЕ оси x, значит ордината отрицательна.', 'The point is BELOW the x axis, so the ordinate is negative.') },
  ],
  note: L(
    "O'QISH teskari yo'l: nuqtadan o'qlarga tushib, ikki sonni olamiz. Diqqat -- birinchi son x o'qi bo'yicha o'qiladi.",
    'ЧТЕНИЕ это обратный путь: от точки спускаемся на оси и берём два числа. Внимание — первое число читается по оси x.',
    'READING is the inverse: from the point down to the axes, taking two numbers. Careful — the first is read along the x axis.',
  ),
  audio: [
    A('mount', "Ikkinchi yo'nalish -- o'qish. Chizma bor, koordinatalarni topamiz.", 'Второе направление это чтение. Чертёж есть, находим координаты.', 'The second direction is reading. The drawing is there, we find the coordinates.'),
    A('mount', "Nuqtadan ikki o'qqa tushib ko'ring va tartibni buzmang.", 'Спустись от точки на обе оси и не нарушь порядок.', 'Drop from the point to both axes and keep the order.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. JADVAL: ikki qiymat hisoblanadi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Ikki nuqta yetadi', 'Двух точек достаточно', 'Two points are enough'),
  given: L(
    "To'g'ri chiziqni qurish uchun ikki nuqta yetadi. Eng qulayi -- x nol va x uch.",
    'Чтобы построить прямую, достаточно двух точек. Удобнее всего взять x равным нулю и трём.',
    'Two points are enough to build a line. The handiest are x equal to zero and three.',
  ),
  template: ['y = x − 2.   x = 0   →   y = ', { slot: 0 }, ',   x = 3   →   y = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '−2' },
    { id: 'b', label: '1' },
    { id: 'c', label: '2' },
    { id: 'd', label: '5' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki qiymatni hisoblang.",
    'Посчитай два значения.',
    'Work out the two values.',
  ),
  checkNote: L(
    "x nol bo'lganda faqat b qoladi, ya'ni manfiy ikki. x uch bo'lganda uchdan ikki ayirilib bir chiqadi.",
    'При x равном нулю остаётся только b, то есть минус два. При x равном трём из трёх вычитается два и выходит один.',
    'At x zero only b remains, that is minus two. At x three, two is taken from three and one comes out.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("x nol bo'lganda manfiy ikki qoladi, musbat ikki emas.", 'При x равном нулю остаётся минус два, а не плюс два.', 'At x zero minus two remains, not plus two.') },
    { key: 'd', tag: 'Z6', hint: L("Ikki ayiriladi: uch minus ikki bir beradi.", 'Два вычитается: три минус два это один.', 'Two is subtracted: three minus two is one.') },
    { key: '*', tag: 'Z4', hint: L("Har qiymat formulaga alohida qo'yiladi.", 'Каждое значение подставляется в формулу отдельно.', 'Each value goes into the formula separately.') },
  ],
  audio: [
    A('mount', "To'g'ri chiziq ikki nuqta bilan aniqlanadi, shuning uchun jadval qisqa bo'ladi.", 'Прямая определяется двумя точками, поэтому таблица короткая.', 'A line is fixed by two points, so the table is short.'),
    A('mount', "Nol qulay: unda faqat b qoladi.", 'Ноль удобен: при нём остаётся только b.', 'Zero is handy: it leaves only b.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. Qurish, k manfiy bo'lganda.
// ============================================================
const S6 = {
  kind: 'plane',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('k manfiy bo\'lgan grafik', 'График при отрицательном k', 'A graph with a negative k'),
  range: BOX,
  fn: [{ id: 'l', f: (x) => -2 * x + 2 }],
  pick: { x: 1, y: 0 },
  caption: L(
    "y = −2x + 2 grafigi chizilgan. x o'rniga birni qo'ying, y ni toping, nuqtani grafikda belgilang.",
    'График y = −2x + 2 нарисован. Подставь вместо x единицу, найди y, отметь точку на графике.',
    'The graph of y = −2x + 2 is drawn. Put one in place of x, find y, mark the point on the graph.',
  ),
  options: [
    { id: 'a', label: L("nuqta x o'qida turibdi", 'точка стоит на оси x', 'the point sits on the x axis') },
    { id: 'b', label: L('nuqta birinchi chorakda', 'точка в первой четверти', 'the point is in the first quadrant') },
    { id: 'c', label: L("nuqta to'rtinchi chorakda", 'точка в четвёртой четверти', 'the point is in the fourth quadrant') },
    { id: 'd', label: L('bunday nuqta yo\'q', 'такой точки нет', 'there is no such point') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Ordinata nolga teng chiqdi, ya'ni nuqta o'qning ustida.", 'Ордината вышла равной нулю, значит точка на самой оси.', 'The ordinate came out zero, so the point is on the axis.') },
    { key: 'c', tag: 'Z2', hint: L("Chorakda turish uchun ordinata noldan farqli bo'lishi kerak.", 'Чтобы быть в четверти, ордината должна быть не нулевой.', 'To be in a quadrant the ordinate must be non zero.') },
    { key: 'd', tag: 'Z6', hint: L("Manfiy ikki karra bir qo'shuv ikki nol beradi -- nuqta bor.", 'Минус два на один плюс два это ноль — точка есть.', 'Minus two times one plus two is zero — the point exists.') },
  ],
  note: L(
    "Grafik x o'qini y nolga teng bo'lgan joyda kesadi. Bu qulay nuqta: uni topish uchun formulani nolga tenglashtirish kerak.",
    'График пересекает ось x там, где y равен нулю. Это удобная точка: чтобы её найти, формулу приравнивают к нулю.',
    'A graph crosses the x axis where y is zero. That is a handy point: to find it, set the formula equal to zero.',
  ),
  audio: [
    A('mount', "Bu safar k manfiy, va chiziq pastga qiyalab ketadi.", 'На этот раз k отрицательный, и прямая наклонена вниз.', 'This time k is negative, and the line tilts downward.'),
    A('mount', "x o'rniga birni qo'ying, y ni toping va nuqta qayerga tushishini ko'ring.", 'Подставь вместо x единицу, найди y и посмотри, куда попадёт точка.', 'Put one in place of x, find y and see where the point lands.'),
    A('dot', "Nuqta o'qning ustiga tushdi.", 'Точка легла на саму ось.', 'The point landed on the axis itself.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: grafik kadrdan CHIQIB ketadi, lekin
// tugamaydi.
// ============================================================
const S7 = {
  kind: 'plane',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Chiziq kadr chetida tugaydimi', 'Кончается ли график у края кадра', 'Does the graph end at the frame edge'),
  range: BOX,
  fn: [{ id: 'l', f: (x) => x + 1 }],
  caption: L(
    "Chiziq kadrning chetiga yetib to'xtab qolgandek ko'rinadi. x o'nga teng bo'lganda nuqta bormi?",
    'Прямая словно останавливается у края кадра. Есть ли точка при x равном десяти?',
    'The line seems to stop at the edge of the frame. Is there a point at x equal to ten?',
  ),
  options: [
    { id: 'a', label: L('bor, faqat chizilmagan', 'есть, просто не нарисована', 'yes, it is just not drawn') },
    { id: 'b', label: L("yo'q, grafik tugadi", 'нет, график закончился', 'no, the graph has ended') },
    { id: 'c', label: L('faqat kadr ichida nuqtalar bor', 'точки есть только внутри кадра', 'points exist only inside the frame') },
    { id: 'd', label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'it cannot be decided') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Formulaga o'n qo'yish mumkin va u javob beradi: o'n bir. Demak nuqta bor.", 'В формулу можно подставить десять, и она даёт ответ: одиннадцать. Значит точка есть.', 'Ten can go into the formula and it answers: eleven. So the point exists.') },
    { key: 'c', tag: 'Z5', hint: L("Kadr bu bizning oynamiz, grafikning chegarasi emas.", 'Кадр это наше окно, а не граница графика.', 'The frame is our window, not the boundary of the graph.') },
    { key: 'd', tag: 'Z2', hint: L("Aniqlanadi: formula har x uchun javob beradi.", 'Определяется: формула отвечает на любой x.', 'It can be decided: the formula answers for any x.') },
  ],
  note: L(
    "Chizma faqat BIR BO'LAGINI ko'rsatadi. Formula esa har x uchun javob beradi, shuning uchun grafik ikki tomonga cheksiz davom etadi. Strelkalar aynan shuni aytadi.",
    'Чертёж показывает только ЧАСТЬ. А формула отвечает на любой x, поэтому график продолжается в обе стороны бесконечно. Стрелки как раз об этом.',
    'The drawing shows only a PART. The formula answers for any x, so the graph continues forever both ways. That is what the arrows say.',
  ),
  audio: [
    A('mount', "Chizmaning cheti bor, grafikning esa yo'q.", 'У чертежа есть край, а у графика нет.', 'The drawing has an edge, the graph does not.'),
    A('mount', "O'qlardagi strelkalar shuni bildiradi.", 'Стрелки на осях говорят об этом.', 'The arrows on the axes say so.'),
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
    { id: 'f1', label: L('qurishda abssissa formulaga qo\'yiladi', 'при построении абсцисса идёт в формулу', 'when building, the abscissa goes into the formula') },
    { id: 'f2', label: L('chiqqan y bo\'yicha nuqta belgilanadi', 'по полученному y ставится точка', 'the point is placed at the y you get') },
    { id: 'f3', label: L("o'qishda esa nuqtadan o'qlarga tushiladi", 'при чтении от точки спускаются на оси', 'when reading, you drop from the point to the axes') },
    { id: 'f4', label: L("va birinchi son x o'qi bo'yicha olinadi", 'и первое число берут по оси x', 'and the first number is taken along the x axis') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval qurish ikki qadamda, keyin o'qish ikki qadamda.",
    'Порядок нарушен. Сначала построение в два шага, потом чтение в два шага.',
    'The order is off. Building in two steps first, then reading in two steps.',
  ),
  lawChips: [
    { label: 'x', tone: 's2' },
    { label: 'y', tone: 's1' },
    { label: '( ; )', tone: 'par' },
    { label: '→', tone: 'off' },
  ],
  lawSweep: L(
    "abssissa, ordinata, juftlik, yo'nalish",
    'абсцисса, ордината, пара, направление',
    'the abscissa, the ordinate, the pair, the direction',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Grafikni QURISH uchun abssissa olinadi, formulaga qo'yiladi va chiqqan qiymat bo'yicha nuqta belgilanadi. To'g'ri chiziq uchun ikki nuqta yetadi.",
        'Чтобы ПОСТРОИТЬ график, берут абсциссу, подставляют в формулу и по полученному значению ставят точку. Для прямой достаточно двух точек.',
        'To BUILD a graph, take an abscissa, put it into the formula and place the point at the value you get. Two points are enough for a line.',
      ),
      L(
        "Grafikni O'QISH uchun nuqtadan ikki o'qqa tushiladi. Birinchi son har doim x o'qi bo'yicha o'qiladi -- aynan bu joyda o'qlar almashtiriladi.",
        'Чтобы ПРОЧИТАТЬ график, от точки спускаются на обе оси. Первое число всегда читается по оси x — именно здесь и путают оси.',
        'To READ a graph, drop from the point to both axes. The first number is always read along the x axis — that is exactly where the axes get mixed up.',
      ),
    ],
  },
  hookCap: L(
    "Birinchi son -- x o'qi bo'yicha",
    'Первое число — по оси x',
    'The first number goes along x',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('qurish: formulaga', 'построение: в формулу', 'building: into the formula'),
    L("o'qish: o'qlarga", 'чтение: на оси', 'reading: onto the axes'),
    L('ikki nuqta yetadi', 'двух точек хватает', 'two points suffice'),
  ],
  audio: [
    A('mount', "Ikki yo'nalishni ko'rdik. Endi qoidani yig'amiz.", 'Оба направления мы увидели. Теперь соберём правило.', 'We have seen both directions. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda eng sodda chiziqli funksiya keladi.", 'Верно. На следующем уроке придёт самая простая линейная функция.', 'Correct. Next lesson brings the simplest linear function.'),
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
        "y = 2x + 1 grafigida x birga teng bo'lganda y nechchi?",
        'На графике y = 2x + 1, каково y при x равном единице?',
        'On the graph of y = 2x + 1, what is y at x equal to one?',
      ),
      ok: L("Ikki karra bir qo'shuv bir uch beradi.", 'Два на один плюс один это три.', 'Two times one plus one is three.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '1', tag: 'Z1', hint: L("Bir bu x, javob esa y.", 'Один это x, а ответ это y.', 'One is x, and the answer is y.') },
        { id: 'c', label: '2', tag: 'Z4', hint: L("Bir qo'shish qoldi.", 'Осталось прибавить один.', 'Adding one is still to do.') },
        { id: 'd', label: '4', tag: 'Z6', hint: L("Ikki karra bir ikki, qo'shuv bir uch.", 'Два на один два, плюс один три.', 'Two times one is two, plus one is three.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Grafikdagi nuqta noldan ikki qadam o'ngda va bir qadam pastda. Uning juftligi qanday?",
        'Точка на графике стоит на два шага правее нуля и на один ниже. Какова её пара?',
        'A point on the graph sits two steps right of zero and one step down. What is its pair?',
      ),
      ok: L("O'ngga yurish abssissani musbat, pastga yurish ordinatani manfiy qiladi.", 'Шаг вправо делает абсциссу положительной, шаг вниз ординату отрицательной.', 'Right makes the abscissa positive, down makes the ordinate negative.'),
      items: [
        { id: 'a', label: '(2; −1)', correct: true },
        { id: 'b', label: '(−1; 2)', tag: 'Z1', hint: L("Birinchi o'rinda x bo'yicha son turadi.", 'На первом месте число по оси x.', 'The first place holds the number along x.') },
        { id: 'c', label: '(2; 1)', tag: 'Z3', hint: L("Pastga yurilgan, demak ordinata manfiy.", 'Шли вниз, значит ордината отрицательна.', 'The step was down, so the ordinate is negative.') },
        { id: 'd', label: '(−2; −1)', tag: 'Z3', hint: L("O'ngga yurilgan, demak abssissa musbat.", 'Шли вправо, значит абсцисса положительна.', 'The step was right, so the abscissa is positive.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = x + 4 grafigi x o'qini qayerda kesadi?",
        'Где график y = x + 4 пересекает ось x?',
        'Where does the graph of y = x + 4 cross the x axis?',
      ),
      ok: L("x o'qida y nolga teng, demak x manfiy to'rt bo'ladi.", 'На оси x y равен нулю, значит x это минус четыре.', 'On the x axis y is zero, so x is minus four.'),
      items: [
        { id: 'a', label: '−4', correct: true },
        { id: 'b', label: '4', tag: 'Z3', hint: L("x qo'shuv to'rt nolga teng bo'lsa, x manfiy to'rt bo'ladi.", 'Если x плюс четыре равно нулю, то x это минус четыре.', 'If x plus four is zero, then x is minus four.') },
        { id: 'c', label: '0', tag: 'Z4', hint: L("Nol bu y ning qiymati, x esa boshqa.", 'Ноль это значение y, а x другое.', 'Zero is the value of y, x is another.') },
        { id: 'd', label: '1', tag: 'Z6', hint: L("Tenglama x qo'shuv to'rt teng nol bo'ladi.", 'Уравнение это x плюс четыре равно нулю.', 'The equation is x plus four equals zero.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "To'g'ri chiziqni qurish uchun kamida nechta nuqta kerak?",
        'Сколько точек нужно минимум, чтобы построить прямую?',
        'How many points are needed at least to build a line?',
      ),
      ok: L("Ikki nuqta to'g'ri chiziqni aniqlaydi.", 'Две точки определяют прямую.', 'Two points fix a line.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '1', tag: 'Z5', hint: L("Bitta nuqtadan cheksiz ko'p chiziq o'tadi.", 'Через одну точку проходит бесконечно много прямых.', 'Infinitely many lines pass through one point.') },
        { id: 'c', label: '3', tag: 'Z5', hint: L("Uchinchisi tekshiruv uchun foydali, lekin shart emas.", 'Третья полезна для проверки, но не обязательна.', 'A third is useful as a check but not required.') },
        { id: 'd', label: '4', tag: 'Z6', hint: L("To'rttasi ortiqcha.", 'Четыре это лишнее.', 'Four is too many.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ikkinchisi o'qish, uchinchisi qurish haqida.", 'Четыре вопроса. Второй про чтение, третий про построение.', 'Four questions. The second about reading, the third about building.'),
    A('1', "Ikkinchisida tartibga diqqat.", 'Во втором внимание на порядок.', 'In the second, watch the order.'),
    A('2', "Uchinchisida y nolga teng.", 'В третьем y равен нулю.', 'In the third y equals zero.'),
    A('3', "Oxirgisi to'g'ri chiziq haqida.", 'Последний про прямую.', 'The last is about a line.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: ikki nuqta, keyin k.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ikki nuqta va k', 'Две точки и k', 'Two points and k'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['y = 3x − 1.   x = 0   →   y = ', { slot: 0 }, ',   x = 2   →   y = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '−1' },
    { id: 'b', label: '5' },
    { id: 'c', label: '1' },
    { id: 'd', label: '6' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki nuqtaning ordinatalarini hisoblang.",
    'Посчитай ординаты двух точек.',
    'Work out the ordinates of the two points.',
  ),
  checkNote: L(
    "x nol bo'lganda faqat manfiy bir qoladi. x ikki bo'lganda uch karra ikki olti, undan bir ayirilsa besh.",
    'При x равном нулю остаётся только минус один. При x равном двум три на два шесть, минус один это пять.',
    'At x zero only minus one remains. At x two, three times two is six, minus one is five.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("Yozuvda ayirish turibdi, demak x nolda manfiy bir qoladi.", 'В записи вычитание, значит при x равном нулю остаётся минус один.', 'The record subtracts, so at x zero minus one remains.') },
    { key: 'd', tag: 'Z4', hint: L("Bir ayirish qoldi.", 'Осталось вычесть один.', 'Subtracting one is still to do.') },
    { key: '*', tag: 'Z6', hint: L("Har qiymat alohida hisoblanadi.", 'Каждое значение считается отдельно.', 'Each value is worked out separately.') },
  ],
  probe: {
    question: L("Bu grafik qaysi choraklardan o'tadi?", 'Через какие четверти идёт этот график?', 'Which quadrants does this graph pass through?'),
    items: [
      { id: 'a', correct: true, label: 'I, III, IV' },
      { id: 'b', tag: 'Z5', label: 'I, III', hint: L("b manfiy, shuning uchun chiziq to'rtinchi chorakdan ham o'tadi.", 'b отрицательное, поэтому прямая проходит и через четвёртую четверть.', 'b is negative, so the line also crosses the fourth quadrant.') },
      { id: 'c', tag: 'Z1', label: 'II, IV', hint: L("k musbat, demak asosiy yo'nalish birinchi va uchinchi chorak.", 'k положительный, значит основное направление первая и третья четверти.', 'k is positive, so the main direction is the first and third quadrants.') },
      { id: 'd', tag: 'Z5', label: 'I, II, III', hint: L("b manfiy bo'lganda chiziq pastdan boshlanadi, ikkinchi chorakka kirmaydi.", 'При отрицательном b прямая начинается снизу и во вторую четверть не заходит.', 'With a negative b the line starts low and does not enter the second quadrant.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval ikki nuqta, keyin choraklar.", 'Два шага. Сначала две точки, потом четверти.', 'Two steps. Two points first, then the quadrants.'),
    A('mount', "Nol qulay: unda faqat b qoladi.", 'Ноль удобен: при нём остаётся только b.', 'Zero is handy: it leaves only b.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. O'QISH so'z bilan berilgan.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Grafikni so\'z bilan o\'qish', 'Чтение графика словами', 'Reading a graph in words'),
  given: L(
    "Grafik y o'qini manfiy uchda kesadi va har qadamda ikki birlik yuqoriga ko'tariladi. Formulani yozing.",
    'График пересекает ось y в минус трёх и на каждый шаг поднимается на две единицы. Запиши формулу.',
    'A graph crosses the y axis at minus three and rises two units per step. Write the formula.',
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
    "Har qadamda ko'tarilish k ni beradi, y o'qini kesgan joy esa b ni. Ko'tarilish musbat, kesishish manfiy.",
    'Подъём на каждый шаг даёт k, а место пересечения с осью y даёт b. Подъём положительный, пересечение отрицательное.',
    'The rise per step gives k, the crossing of the y axis gives b. The rise is positive, the crossing negative.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("Chiziq yuqoriga ko'tariladi, demak k musbat.", 'Прямая поднимается, значит k положительный.', 'The line rises, so k is positive.') },
    { key: 'd', tag: 'Z3', hint: L("Kesishish manfiy uchda, demak b manfiy.", 'Пересечение в минус трёх, значит b отрицательное.', 'The crossing is at minus three, so b is negative.') },
    { key: '*', tag: 'Z4', hint: L("Ko'tarilish k, kesishish b.", 'Подъём это k, пересечение это b.', 'The rise is k, the crossing is b.') },
  ],
  audio: [
    A('mount', "Bu safar chizma yo'q, u so'z bilan aytilgan.", 'На этот раз чертежа нет, он рассказан словами.', 'This time there is no drawing, it is told in words.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). O'QLAR ALMASHTIRILGAN: qiymat abssissadan
// o'qilgan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Nuqta chizmadan to'g'ri topilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Точка на чертеже найдена верно. И всё же какая строка ошибочна?',
    'The point was found on the drawing correctly. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: 'y = x + 1' },
    { id: 'r2', text: L('so\'raladi: x = 2 da y', 'спрошено: y при x = 2', 'asked: y at x = 2') },
    { id: 'r3', text: L('nuqta topildi: (2; 3)', 'точка найдена: (2; 3)', 'point found: (2; 3)') },
    { id: 'r4', text: L('juftlikning birinchi soni y', 'первое число пары это y', 'the first number of the pair is y') },
    { id: 'r5', text: L('y = 2', 'y = 2', 'y = 2') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu berilgan formula.", 'Это данная формула.', 'That is the given formula.'),
    r2: L("Bu savolning o'zi.", 'Это сам вопрос.', 'That is the question itself.'),
    r3: L("To'g'ri: chiziq ustidagi nuqta aynan shu.", 'Верно: это и есть точка на прямой.', 'Right: that is the point on the line.'),
      r5: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r3: 'Z1' , r5: 'Z1' },
  proofFill: {
    template: ['(2; 3)   →   y = ', { slot: 0 }],
    parts: [
      { id: 'a', label: '3' },
      { id: 'b', label: '2' },
      { id: 'c', label: '5' },
      { id: 'd', label: '1' },
    ],
    answer: ['a'],
    prompt: L(
      "Juftlikdan ordinatani oling.",
      'Возьми из пары ординату.',
      'Take the ordinate from the pair.',
    ),
    checkNote: L(
      "Juftlikda ikkinchi son ordinata, ya'ni y. Ikkilik esa abssissa: u savolda BERILGAN edi, izlanmagan.",
      'В паре второе число это ордината, то есть y. А двойка это абсцисса: она была ДАНА в вопросе, её не искали.',
      'The second number of the pair is the ordinate, that is y. Two is the abscissa: it was GIVEN in the question, not sought.',
    ),
    wrongs: [
      { key: 'b', tag: 'Z1', hint: L("Ikkilik savolda berilgan abssissa, javob esa ordinata.", 'Двойка это данная в вопросе абсцисса, а ответ это ордината.', 'Two is the abscissa given in the question, the answer is the ordinate.') },
      { key: 'c', tag: 'Z6', hint: L("Sonlar qo'shilmaydi.", 'Числа не складываются.', 'The numbers are not added.') },
      { key: 'd', tag: 'Z4', hint: L("Bir bu b, u x nolda o'qiladi.", 'Один это b, оно читается при x равном нулю.', 'One is b, read at x equal to zero.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda nuqta chizmadan to'g'ri topilgan.", 'В этой ловушке точка найдена на чертеже верно.', 'In this trap the point was found on the drawing correctly.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Javobga abssissa yozilgan, ordinata esa emas.", 'Нашёл. В ответ записана абсцисса, а не ордината.', 'You found it. The abscissa went into the answer, not the ordinate.'),
    A('done', "Savolda x berilgan edi, izlangani esa y.", 'В вопросе x был дан, а искали y.', 'The question gave x and asked for y.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. HARAKAT GRAFIGI.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Harakat grafigi', 'График движения', 'A graph of motion'),
  given: L(
    "Velosipedchi soatda o'n ikki kilometr yuradi. Bosib o'tilgan yo'l vaqtga qarab chiziqli funksiya bo'ladi.",
    'Велосипедист едет двенадцать километров в час. Пройденный путь от времени это линейная функция.',
    'A cyclist rides twelve kilometres per hour. Distance against time is a linear function.',
  ),
  template: ['y = 12x.   x = 3   →   y = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '36' },
    { id: 'b', label: '15' },
    { id: 'c', label: '12' },
    { id: 'd', label: '4' },
  ],
  answer: ['a'],
  prompt: L(
    "Uch soatda qancha yo'l bosadi.",
    'Сколько пути за три часа.',
    'How far in three hours.',
  ),
  checkNote: L(
    "O'n ikki karra uch o'ttiz olti. Grafik koordinatalar boshidan chiqadi: nol soatda yo'l ham nol.",
    'Двенадцать на три тридцать шесть. График выходит из начала координат: за ноль часов путь тоже ноль.',
    'Twelve times three is thirty six. The graph starts at the origin: zero hours means zero distance.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Tezlik vaqtga KO'PAYTIRILADI, qo'shilmaydi.", 'Скорость УМНОЖАЕТСЯ на время, а не складывается с ним.', 'The speed is MULTIPLIED by the time, not added to it.') },
    { key: 'c', tag: 'Z4', hint: L("O'n ikki bu bir soatdagi yo'l, bizda esa uch soat.", 'Двенадцать это путь за один час, а у нас три.', 'Twelve is the distance in one hour, and we have three.') },
    { key: 'd', tag: 'Z1', hint: L("Uch bu vaqt, ya'ni x. Javob esa yo'l.", 'Три это время, то есть x. А ответ это путь.', 'Three is the time, that is x. The answer is the distance.') },
  ],
  audio: [
    A('mount', "Grafik harakatni ham ko'rsatadi: vaqt gorizontal o'qda, yo'l esa vertikalda.", 'График показывает и движение: время по горизонтальной оси, путь по вертикальной.', 'A graph shows motion too: time along the horizontal axis, distance along the vertical.'),
    A('mount', "Nol soatda yo'l ham nol, shuning uchun grafik boshdan chiqadi.", 'За ноль часов путь тоже ноль, поэтому график выходит из начала.', 'Zero hours means zero distance, so the graph starts at the origin.'),
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
        "y = 2x − 1 da x uchga teng bo'lganda y nechchi?",
        'Каково y при x равном трём в y = 2x − 1?',
        'What is y at x equal to three in y = 2x − 1?',
      ),
      ok: L("Ikki karra uch olti, minus bir besh.", 'Два на три шесть, минус один пять.', 'Two times three is six, minus one is five.'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '7', tag: 'Z6', hint: L("Bir ayiriladi.", 'Один вычитается.', 'One is subtracted.') },
        { id: 'c', label: '3', tag: 'Z1', hint: L("Uch bu x.", 'Три это x.', 'Three is x.') },
        { id: 'd', label: '6', tag: 'Z4', hint: L("Bir ayirish qoldi.", 'Осталось вычесть один.', 'Subtracting one is still to do.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Nuqta noldan uch qadam chapda va ikki qadam yuqorida. Juftligi qanday?",
        'Точка на три шага левее нуля и на два выше. Какова её пара?',
        'A point is three steps left of zero and two up. What is its pair?',
      ),
      ok: L("Chapga yurish abssissani manfiy qiladi.", 'Шаг влево делает абсциссу отрицательной.', 'A step left makes the abscissa negative.'),
      items: [
        { id: 'a', label: '(−3; 2)', correct: true },
        { id: 'b', label: '(2; −3)', tag: 'Z1', hint: L("Birinchi o'rinda x bo'yicha son.", 'На первом месте число по оси x.', 'The first place holds the number along x.') },
        { id: 'c', label: '(3; 2)', tag: 'Z3', hint: L("Chapga yurilgan.", 'Шли влево.', 'The step was left.') },
        { id: 'd', label: '(−3; −2)', tag: 'Z3', hint: L("Yuqoriga yurilgan, demak ordinata musbat.", 'Шли вверх, значит ордината положительна.', 'The step was up, so the ordinate is positive.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = x − 5 grafigi x o'qini qayerda kesadi?",
        'Где график y = x − 5 пересекает ось x?',
        'Where does the graph of y = x − 5 cross the x axis?',
      ),
      ok: L("y nolga teng bo'lganda x beshga teng bo'ladi.", 'Когда y равен нулю, x равен пяти.', 'When y is zero, x is five.'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '−5', tag: 'Z3', hint: L("x minus besh nolga teng bo'lsa, x beshga teng.", 'Если x минус пять равно нулю, то x это пять.', 'If x minus five is zero, then x is five.') },
        { id: 'c', label: '0', tag: 'Z4', hint: L("Nol bu y ning qiymati.", 'Ноль это значение y.', 'Zero is the value of y.') },
        { id: 'd', label: '1', tag: 'Z6', hint: L("Tenglama x minus besh teng nol.", 'Уравнение это x минус пять равно нулю.', 'The equation is x minus five equals zero.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Chizmada grafik kadr chetiga yetdi. Bu nimani bildiradi?",
        'На чертеже график дошёл до края кадра. Что это значит?',
        'On a drawing the graph reached the edge of the frame. What does that mean?',
      ),
      ok: L("Kadr tugadi, grafik esa davom etadi.", 'Кадр кончился, а график продолжается.', 'The frame ended, the graph continues.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('grafik davom etadi', 'график продолжается', 'the graph continues'),
        },
        {
          id: 'b',
          tag: 'Z5',
          label: L('grafik tugadi', 'график закончился', 'the graph has ended'),
          hint: L("Formula har x uchun javob beradi.", 'Формула отвечает на любой x.', 'The formula answers for any x.'),
        },
        {
          id: 'c',
          tag: 'Z5',
          label: L('formula ishlamaydi', 'формула не работает', 'the formula stops working'),
          hint: L("Formula ishlaydi, faqat chizmada joy qolmadi.", 'Формула работает, просто на чертеже нет места.', 'The formula works, there is just no room on the drawing.'),
        },
        {
          id: 'd',
          tag: 'Z2',
          label: L('nuqtalar tugadi', 'точки закончились', 'the points ran out'),
          hint: L("Nuqtalar cheksiz: har x uchun bittasi bor.", 'Точек бесконечно: на каждый x своя.', 'The points are endless: one for every x.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi o'qish haqida.", 'Второй про чтение.', 'The second is about reading.'),
    A('2', "Uchinchisida y nolga teng.", 'В третьем y равен нулю.', 'In the third y equals zero.'),
    A('3', "Oxirgisi kadr haqida.", 'Последний про кадр.', 'The last is about the frame.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Qurish va o'qish -- teskari yo'llar", 'Построение и чтение — обратные пути', 'Building and reading are inverse paths'),
  gate: S1.gate,
  fix: {
    tokens: ['y', '=', '3'],
    value: '3',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "x ikkiga teng bo'lganda vertikal bo'ylab chiziqqa chiqib, keyin y o'qiga o'tiladi va uch chiqadi. Ikki esa savolda berilgan abssissa edi.",
    'При x равном двум поднимаются по вертикали до прямой, потом переходят на ось y и получают три. А два было данной в вопросе абсциссой.',
    'At x equal to two you go up the vertical to the line, then across to the y axis and get three. Two was the abscissa given in the question.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    three: L('uch', 'три', 'three'),
    two: L('ikki', 'два', 'two'),
    one: L('bir', 'один', 'one'),
    cant: L("o'qib bo'lmaydi", 'прочитать нельзя', 'cannot be read'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['y = x − 2 → (4; 2)', '(−1; −3) → x = −1', 'y = −2x + 2 → (1; 0)', 'y = 12x → 36'],
  twoLabel: L('B6 bloki davom etadi', 'Блок Б6 продолжается', 'Block B6 continues'),
  twoA: L(
    'qurish  →  formulaga',
    'построение  →  в формулу',
    'building  →  into the formula',
  ),
  twoB: L(
    "o'qish  →  o'qlarga",
    'чтение  →  на оси',
    'reading  →  onto the axes',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "to'g'ri proporsionallik",
    'прямая пропорциональность',
    'direct proportionality',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish ikki yo'nalishdan chiqdi: qurish formulaga, o'qish esa o'qlarga.", 'Вся сегодняшняя работа вышла из двух направлений: построение в формулу, чтение на оси.', 'All of today came from two directions: building goes into the formula, reading onto the axes.'),
    A('mount', "Keyingi darsda eng sodda chiziqli funksiya keladi.", 'На следующем уроке придёт самая простая линейная функция.', 'Next lesson brings the simplest linear function.'),
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
