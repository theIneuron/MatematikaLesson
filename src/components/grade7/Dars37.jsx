// ============================================================================
// 7-sinf, Dars 37. TO'G'RI PROPORSIONALLIK VA UNING GRAFIGI.
// (Прямая пропорциональность и её график)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// FARQ BITTA HADDA: y = kx da b YO'Q. Shuning uchun grafik KOORDINATALAR
// BOSHIDAN o'tadi, va bu tekshirishning eng qisqa yo'li: x nolga teng
// bo'lganda y ham nol bo'lishi kerak.
//
// BLOKNING XATOSI: b bor yozuvni ham to'g'ri proporsionallik deb atash.
// Tuzoq aynan shuni qo'yadi: y = 2x + 1 uchun hamma hisob to'g'ri, lekin
// grafik boshdan o'tmaydi.
//
// 4-EKRANDA ASBOB IKKI CHIZIQ CHIZADI: y = 2x va y = 2x + 3. Ikkinchisi
// uzuq chiziq bilan ketadi (`g7-pl-l1`), ya'ni ular ko'z bilan ajratiladi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_37'
const LESSON_TITLE = L("To'g'ri proporsionallik va uning grafigi", 'Прямая пропорциональность и её график', 'Direct proportionality and its graph')
const LESSON_NO = L('37-dars', 'Урок 37', 'Lesson 37')
const BLOCK = { label: L('B6-blok', 'Блок Б6', 'Block B6'), from: 33, to: 39, current: 37 }

const BOX = { x0: -6, x1: 6, y0: -4, y1: 4 }

const TAGS = {
  Z1: L('b tushib qoldi', 'потеряно b', 'b was dropped'),
  Z2: L('grafik boshdan o\'tmadi', 'график не через начало', 'the graph misses the origin'),
  Z3: L('ishora va choraklar', 'знак и четверти', 'the sign and the quadrants'),
  Z4: L('k topilmadi', 'k не найден', 'k was not found'),
  Z5: L('formula almashtirildi', 'формула спутана', 'the formula was mixed up'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Qaysi grafik BOSHDAN o'tadi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("TO'G'RI PROPORSIONALLIK", 'ПРЯМАЯ ПРОПОРЦИОНАЛЬНОСТЬ', 'DIRECT PROPORTIONALITY'),
  noBack: true,
  noNotes: true,
  title: L('Qaysi grafik boshdan o\'tadi', 'Какой график через начало', 'Which graph passes the origin'),
  gate: {
    source: { kind: 'plain', tokens: ['x', '=', '0'] },
    rows: [
      { tokens: ['y', '=', '2x'], value: '0' },
      { tokens: ['y', '=', '2x', '+', '3'], value: '3' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Ikki formula. Tabloda x nolga teng bo'lgandagi y turadi. Qaysi grafik koordinatalar boshidan o'tadi?",
      'Две формулы. На табло значение y при x равном нулю. Какой график проходит через начало координат?',
      'Two formulas. The boards show y at x equal to zero. Which graph passes through the origin?',
    ),
    items: [
      {
        id: 'first',
        label: L('Birinchisi: y teng ikki x', 'Первая: y равно два x', 'The first: y equals two x'),
        hint: L(
          "Taxminingiz qabul qilindi. Tekislikda tekshiramiz.",
          'Прогноз принят. Проверим на плоскости.',
          'Your prediction is taken. We will check it on the plane.',
        ),
      },
      {
        id: 'second',
        label: L("Ikkinchisi: y teng ikki x qo'shuv uch", 'Вторая: y равно два x плюс три', 'The second: y equals two x plus three'),
        hint: L(
          "x nolga teng bo'lganda unda y uchga teng bo'ladi, ya'ni nuqta boshdan uch birlik yuqorida.",
          'При x равном нулю у неё y равен трём, значит точка на три единицы выше начала.',
          'At x equal to zero its y is three, so the point sits three units above the origin.',
        ),
      },
      {
        id: 'both',
        label: L('Ikkovi ham', 'Обе', 'Both of them'),
        hint: L(
          "Ikkinchisida x nol bo'lganda y uch chiqadi, nol emas.",
          'У второй при x равном нулю y выходит три, а не ноль.',
          'For the second, at x zero the y comes out three, not zero.',
        ),
      },
      {
        id: 'none',
        label: L('Hech qaysi', 'Ни одна', 'Neither'),
        hint: L(
          "Birinchisida x nol bo'lganda ikki karra nol nol beradi, ya'ni grafik aynan boshdan o'tadi.",
          'У первой при x равном нулю два на ноль это ноль, значит график идёт точно через начало.',
          'For the first, at x zero two times zero is zero, so the graph passes exactly through the origin.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki formula juda o'xshash: farq faqat oxirgi hadda.", 'Две формулы очень похожи: разница только в последнем члене.', 'Two very similar formulas: the difference is only in the last term.'),
    A('mount', "Tabloda x nolga teng bo'lgandagi y turadi.", 'На табло значение y при x равном нулю.', 'The boards show y at x equal to zero.'),
    A('mount', "Qaysi grafik boshdan o'tadi deb taxmin qilasiz.", 'Какой график, по-твоему, идёт через начало.', 'Which graph do you predict passes the origin.'),
  ],
}

// ============================================================
// 2. TAYANCH. Nolga qo'yish, k va chorak. KVOTA EKRANI.
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
        "y = 5x bo'lsa, x nolga teng bo'lganda y nechchi?",
        'Если y = 5x, то каково y при x равном нулю?',
        'If y = 5x, what is y at x equal to zero?',
      ),
      ok: L("Har qanday son nolga ko'paytirilsa nol chiqadi.", 'Любое число, умноженное на ноль, даёт ноль.', 'Any number times zero gives zero.'),
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: '5', tag: 'Z6', hint: L("Besh nolga ko'paytiriladi, va bu nol beradi.", 'Пять умножается на ноль, и это даёт ноль.', 'Five is multiplied by zero, and that gives zero.') },
        { id: 'c', label: '1', tag: 'Z6', hint: L("Nolga ko'paytirish birni bermaydi.", 'Умножение на ноль не даёт единицу.', 'Multiplying by zero does not give one.') },
        { id: 'd', label: '−5', tag: 'Z3', hint: L("Ishora ham o'zgarmaydi: natija nol.", 'Знак тоже не меняется: результат ноль.', 'The sign does not change either: the result is zero.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = −4x da k nechchiga teng?",
        'Чему равен k в y = −4x?',
        'What is k in y = −4x?',
      ),
      ok: L("k bu x oldidagi koeffitsiyent, ishorasi bilan.", 'k это коэффициент перед x, со знаком.', 'k is the coefficient before x, with its sign.'),
      items: [
        { id: 'a', label: '−4', correct: true },
        { id: 'b', label: '4', tag: 'Z3', hint: L("x oldida minus turibdi.", 'Перед x стоит минус.', 'A minus stands before x.') },
        { id: 'c', label: '0', tag: 'Z4', hint: L("Koeffitsiyent noldan farqli.", 'Коэффициент не ноль.', 'The coefficient is not zero.') },
        { id: 'd', label: '−1', tag: 'Z4', hint: L("x oldida manfiy to'rt turibdi.", 'Перед x стоит минус четыре.', 'Minus four stands before x.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "k musbat bo'lganda chiziqli funksiyaning grafigi qaysi choraklardan o'tadi?",
        'При k положительном через какие четверти идёт график линейной функции?',
        'With a positive k, which quadrants does a linear graph pass through?',
      ),
      ok: L("Bu o'tgan darsdan: k musbat bo'lsa birinchi va uchinchi chorak.", 'Это из прошлого урока: при k положительном первая и третья четверти.', 'From the last lesson: a positive k means the first and third quadrants.'),
      items: [
        { id: 'a', label: 'I, III', correct: true },
        { id: 'b', label: 'II, IV', tag: 'Z3', hint: L("Bu k manfiy bo'lganda bo'ladi.", 'Так бывает при k отрицательном.', 'That happens with a negative k.') },
        { id: 'c', label: 'I, II', tag: 'Z3', hint: L("Chiziq qarama-qarshi choraklardan o'tadi.", 'Прямая идёт через противоположные четверти.', 'A line goes through opposite quadrants.') },
        { id: 'd', label: 'III, IV', tag: 'Z3', hint: L("Bu ham yonma-yon turgan choraklar.", 'Это тоже соседние четверти.', 'Those are neighbouring quadrants too.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Birinchisi bugungi darsning kaliti.", 'Три коротких вопроса. Первый это ключ к уроку.', 'Three short questions. The first is the key to this lesson.'),
    A('1', "Ikkinchisi k haqida.", 'Второй про k.', 'The second is about k.'),
    A('2', "Uchinchisi o'tgan darsdan.", 'Третий из прошлого урока.', 'The third is from the last lesson.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. GRAFIK BOSHDAN o'tadi: nuqtani nolga qo'yish.
// ============================================================
const S3 = {
  kind: 'plane',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Grafik boshdan o\'tadi', 'График идёт через начало', 'The graph passes the origin'),
  range: BOX,
  fn: [{ id: 'l', f: (x) => 2 * x }],
  pick: { x: 0, y: 0 },
  caption: L(
    "y = 2x grafigi chizilgan. x o'rniga nolni qo'ying, y ni toping, nuqtani grafikda belgilang.",
    'График y = 2x нарисован. Подставь вместо x ноль, найди y, отметь точку на графике.',
    'The graph of y = 2x is drawn. Put zero in place of x, find y, mark the point on the graph.',
  ),
  options: [
    { id: 'a', label: L('koordinatalar boshi', 'начало координат', 'the origin') },
    { id: 'b', label: L("y o'qida, boshdan yuqorida", 'на оси y, выше начала', 'on the y axis, above the origin') },
    { id: 'c', label: L('birinchi chorakda', 'в первой четверти', 'in the first quadrant') },
    { id: 'd', label: L('bunday nuqta yo\'q', 'такой точки нет', 'there is no such point') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Ikki karra nol nol beradi, ya'ni ordinata ham nol.", 'Два на ноль это ноль, значит и ордината ноль.', 'Two times zero is zero, so the ordinate is zero too.') },
    { key: 'c', tag: 'Z2', hint: L("Chorakda turish uchun ikki koordinata ham noldan farqli bo'lishi kerak.", 'Чтобы быть в четверти, обе координаты должны быть не нулевыми.', 'To sit in a quadrant both coordinates must be non zero.') },
    { key: 'd', tag: 'Z6', hint: L("Nuqta bor va u ikki o'qning kesishgan joyida.", 'Точка есть, и она в месте пересечения осей.', 'The point exists, at the crossing of the axes.') },
  ],
  note: L(
    "y = kx ko'rinishidagi funksiya TO'G'RI PROPORSIONALLIK deb ataladi. Unda b yo'q, shuning uchun x nol bo'lganda y ham nol: grafik koordinatalar boshidan o'tadi.",
    'Функция вида y = kx называется ПРЯМОЙ ПРОПОРЦИОНАЛЬНОСТЬЮ. В ней нет b, поэтому при x равном нулю y тоже ноль: график проходит через начало координат.',
    'A function of the form y = kx is called DIRECT PROPORTIONALITY. It has no b, so at x zero the y is zero too: the graph passes through the origin.',
  ),
  audio: [
    A('mount', "Bu formulada faqat bitta had bor: k karra x. Qo'shiluvchi yo'q.", 'В этой формуле только один член: k на x. Слагаемого нет.', 'This formula has one term only: k times x. There is no addend.'),
    A('mount', "x o'rniga nolni qo'ying, y ni toping va nuqtani grafikda belgilang.", 'Подставь вместо x ноль, найди y и отметь точку на графике.', 'Put zero in place of x, find y and mark the point on the graph.'),
    A('dot', "Nuqta ikki o'qning kesishgan joyiga tushdi.", 'Точка легла в место пересечения осей.', 'The point landed where the axes cross.'),
  ],
}

// ============================================================
// 4. FARQLASH. IKKI CHIZIQ birga: b bor va b yo'q.
// ============================================================
const S4 = {
  kind: 'plane',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('b bor va b yo\'q', 'С b и без b', 'With b and without b'),
  range: BOX,
  fn: [
    { id: 'p', f: (x) => 2 * x },
    { id: 'l', f: (x) => 2 * x + 3 },
  ],
  caption: L(
    "Ikki chiziq: y = 2x va y = 2x + 3. Uzuq chiziq ikkinchisi. Farqni ko'ring.",
    'Две прямые: y = 2x и y = 2x + 3. Пунктиром вторая. Найди разницу.',
    'Two lines: y = 2x and y = 2x + 3. The dashed one is the second. Find the difference.',
  ),
  options: [
    { id: 'a', label: L('uzuq chiziq boshdan o\'tmaydi', 'пунктирная не через начало', 'the dashed one misses the origin') },
    { id: 'b', label: L('ikkovi ham boshdan o\'tadi', 'обе через начало', 'both pass the origin') },
    { id: 'c', label: L('ikkovining qiyaligi boshqa', 'у них разный наклон', 'their tilts differ') },
    { id: 'd', label: L('ular kesishadi', 'они пересекаются', 'they cross') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Uzuq chiziq y o'qini uchda kesadi, boshda emas.", 'Пунктирная пересекает ось y в трёх, а не в начале.', 'The dashed one crosses the y axis at three, not at the origin.') },
    { key: 'c', tag: 'Z1', hint: L("Ikkovida k ikkiga teng, demak qiyalik bir xil: chiziqlar parallel.", 'У обеих k равен двум, значит наклон одинаков: прямые параллельны.', 'Both have k equal to two, so the tilt is the same: the lines are parallel.') },
    { key: 'd', tag: 'Z1', hint: L("Qiyaliklari bir xil bo'lgan chiziqlar kesishmaydi.", 'Прямые с одинаковым наклоном не пересекаются.', 'Lines with equal tilts do not cross.') },
  ],
  note: L(
    "b ikki chiziqni bir-biridan SURADI, qiyalikni esa o'zgartirmaydi. Faqat b nol bo'lgan chiziq boshdan o'tadi -- va faqat u to'g'ri proporsionallik.",
    'b СДВИГАЕТ прямую, а наклон не меняет. Через начало проходит только прямая с b равным нулю — и только она прямая пропорциональность.',
    'b SHIFTS the line and does not change its tilt. Only the line with b equal to zero passes the origin — and only that one is direct proportionality.',
  ),
  audio: [
    A('mount', "Ikki chiziq bir chizmada. Ularning formulasi bitta hadda farq qiladi.", 'Две прямые на одном чертеже. Их формулы отличаются одним членом.', 'Two lines on one drawing. Their formulas differ by one term.'),
    A('mount', "Qiyalikka va boshga alohida qarang.", 'Посмотри отдельно на наклон и на начало.', 'Look at the tilt and at the origin separately.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Formulani shart bo'yicha yig'ish.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Faqat bitta had', 'Только один член', 'One term only'),
  given: L(
    "To'g'ri proporsionallikda k manfiy uchga teng. Formulani yozing: qo'shiluvchi yo'q.",
    'В прямой пропорциональности k равен минус трём. Запиши формулу: слагаемого нет.',
    'In a direct proportionality k is minus three. Write the formula: there is no addend.',
  ),
  template: ['y = ', { slot: 0 }, 'x'],
  parts: [
    { id: 'a', label: '−3' },
    { id: 'b', label: '3' },
    { id: 'c', label: '−3 +' },
    { id: 'd', label: '0' },
  ],
  answer: ['a'],
  prompt: L(
    "Koeffitsiyentni yozing.",
    'Запиши коэффициент.',
    'Write the coefficient.',
  ),
  checkNote: L(
    "To'g'ri proporsionallikda faqat k karra x turadi. b yo'q, va shuning uchun grafik boshdan o'tadi.",
    'В прямой пропорциональности стоит только k на x. b нет, и поэтому график идёт через начало.',
    'A direct proportionality holds only k times x. There is no b, so the graph passes the origin.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("k manfiy uch deb berilgan.", 'k дано равным минус трём.', 'k is given as minus three.') },
    { key: 'c', tag: 'Z1', hint: L("To'g'ri proporsionallikda qo'shiluvchi bo'lmaydi.", 'В прямой пропорциональности слагаемого не бывает.', 'A direct proportionality has no addend.') },
    { key: 'd', tag: 'Z4', hint: L("k nol bo'lsa funksiya x ga bog'liq bo'lmay qoladi.", 'Если k ноль, функция перестаёт зависеть от x.', 'With k zero the function stops depending on x.') },
  ],
  audio: [
    A('mount', "To'g'ri proporsionallikning yozuvi eng qisqasi: y teng k karra x.", 'Запись прямой пропорциональности самая короткая: y равно k на x.', 'The record of direct proportionality is the shortest: y equals k times x.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. k MANFIY: choraklar.
// ============================================================
const S6 = {
  kind: 'plane',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('k manfiy bo\'lganda', 'Когда k отрицательный', 'When k is negative'),
  range: BOX,
  fn: [{ id: 'p', f: (x) => -x }],
  pick: { x: 2, y: -2 },
  caption: L(
    "y = −x grafigi chizilgan. x o'rniga ikkini qo'ying, y ni toping, nuqtani grafikda belgilang.",
    'График y = −x нарисован. Подставь вместо x двойку, найди y, отметь точку на графике.',
    'The graph of y = −x is drawn. Put two in place of x, find y, mark the point on the graph.',
  ),
  options: [
    { id: 'a', label: L("ikkinchi va to'rtinchi chorak", 'вторая и четвёртая четверти', 'the second and fourth quadrants') },
    { id: 'b', label: L('birinchi va uchinchi chorak', 'первая и третья четверти', 'the first and third quadrants') },
    { id: 'c', label: L("faqat to'rtinchi chorak", 'только четвёртая четверть', 'the fourth quadrant only') },
    { id: 'd', label: L('hamma choraklar', 'все четверти', 'all the quadrants') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("k manfiy, demak yo'nalish boshqa: nuqta x o'qidan pastda turdi.", 'k отрицательный, значит направление другое: точка легла ниже оси x.', 'k is negative, so the direction differs: the point landed below the x axis.') },
    { key: 'c', tag: 'Z3', hint: L("Chiziq ikki tomonga davom etadi, demak qarama-qarshi chorakka ham kiradi.", 'Прямая продолжается в обе стороны, значит заходит и в противоположную четверть.', 'The line runs both ways, so it enters the opposite quadrant too.') },
    { key: 'd', tag: 'Z3', hint: L("To'g'ri chiziq ikki chorakdan o'tadi, to'rttadan emas.", 'Прямая проходит через две четверти, а не через четыре.', 'A line passes two quadrants, not four.') },
  ],
  note: L(
    "To'g'ri proporsionallikda k ning ishorasi choraklarni belgilaydi: musbat bo'lsa birinchi va uchinchi, manfiy bo'lsa ikkinchi va to'rtinchi. Grafik esa har holda boshdan o'tadi.",
    'В прямой пропорциональности знак k задаёт четверти: положительный — первая и третья, отрицательный — вторая и четвёртая. А через начало график проходит в любом случае.',
    'In a direct proportionality the sign of k sets the quadrants: positive gives the first and third, negative the second and fourth. The graph passes the origin either way.',
  ),
  audio: [
    A('mount', "Bu safar k manfiy bir. Chiziq pastga qiyalab ketadi.", 'На этот раз k равен минус одному. Прямая наклонена вниз.', 'This time k is minus one. The line tilts downward.'),
    A('mount', "x o'rniga ikkini qo'ying, y ni toping va nuqtani grafikda belgilang.", 'Подставь вместо x двойку, найди y и отметь точку на графике.', 'Put two in place of x, find y and mark the point on the graph.'),
    A('dot', "Nuqta pastda chiqdi. Endi choraklarni ayting.", 'Точка вышла снизу. Теперь назови четверти.', 'The point came out below. Now name the quadrants.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: hamma to'g'ri proporsionallik BITTA nuqtada
// uchrashadi.
// ============================================================
const S7 = {
  kind: 'plane',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Umumiy nuqta', 'Общая точка', 'A shared point'),
  range: BOX,
  fn: [
    { id: 'p', f: (x) => 3 * x },
    { id: 'q', f: (x) => -x / 2 },
  ],
  caption: L(
    "Ikki to'g'ri proporsionallik: y = 3x va y = −x bo'lingan ikki. Ular qayerda uchrashadi?",
    'Две прямые пропорциональности: y = 3x и y = −x, делённое на два. Где они встречаются?',
    'Two direct proportionalities: y = 3x and y = −x over two. Where do they meet?',
  ),
  options: [
    { id: 'a', label: L('koordinatalar boshida', 'в начале координат', 'at the origin') },
    { id: 'b', label: L('uchrashmaydi', 'не встречаются', 'they never meet') },
    { id: 'c', label: L('birinchi chorakda', 'в первой четверти', 'in the first quadrant') },
    { id: 'd', label: L('ikki joyda', 'в двух местах', 'in two places') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Ikkovi ham boshdan o'tadi, demak umumiy nuqta bor.", 'Обе проходят через начало, значит общая точка есть.', 'Both pass the origin, so a shared point exists.') },
    { key: 'c', tag: 'Z2', hint: L("Chizmaga qarang: ular nolda kesishadi.", 'Посмотри на чертёж: они пересекаются в нуле.', 'Look at the drawing: they cross at zero.') },
    { key: 'd', tag: 'Z5', hint: L("Ikki to'g'ri chiziq ko'pi bilan bitta nuqtada kesishadi.", 'Две прямые пересекаются не более чем в одной точке.', 'Two straight lines cross in at most one point.') },
  ],
  note: L(
    "Har qanday to'g'ri proporsionallik boshdan o'tadi, shuning uchun ularning HAMMASI shu bitta nuqtada uchrashadi. Bu ta'rifning bevosita natijasi.",
    'Любая прямая пропорциональность проходит через начало, поэтому ВСЕ они встречаются в этой одной точке. Это прямое следствие определения.',
    'Every direct proportionality passes the origin, so ALL of them meet at that one point. That follows straight from the definition.',
  ),
  audio: [
    A('mount', "Endi ikki to'g'ri proporsionallik bir chizmada.", 'Теперь две прямые пропорциональности на одном чертеже.', 'Now two direct proportionalities on one drawing.'),
    A('mount', "Qiyaliklari boshqa, lekin bitta umumiy joyi bor.", 'Наклоны разные, но одно общее место есть.', 'The tilts differ, but they share one place.'),
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
    { id: 'f1', label: L("to'g'ri proporsionallik y = kx ko'rinishida", 'прямая пропорциональность это y = kx', 'a direct proportionality is y = kx') },
    { id: 'f2', label: L("unda qo'shiluvchi yo'q", 'в ней нет слагаемого', 'it has no addend') },
    { id: 'f3', label: L('shuning uchun grafik boshdan o\'tadi', 'поэтому график идёт через начало', 'so the graph passes the origin') },
    { id: 'f4', label: L("k ning ishorasi esa choraklarni belgilaydi", 'а знак k задаёт четверти', 'and the sign of k sets the quadrants') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval ko'rinish, keyin qo'shiluvchining yo'qligi, keyin bosh, oxirida choraklar.",
    'Порядок нарушен. Сначала вид, потом отсутствие слагаемого, потом начало, в конце четверти.',
    'The order is off. The form first, then the missing addend, then the origin, and the quadrants last.',
  ),
  lawChips: [
    { label: 'k', tone: 's2' },
    { label: 'x', tone: 's1' },
    { label: '0', tone: 'off' },
    { label: '( )', tone: 'par' },
  ],
  lawSweep: L(
    'koeffitsiyent, argument, nol, chorak',
    'коэффициент, аргумент, ноль, четверть',
    'the coefficient, the argument, zero, the quadrant',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "y = kx ko'rinishidagi funksiya to'g'ri proporsionallik deb ataladi, bu yerda k noldan farqli. Unda qo'shiluvchi yo'q, shuning uchun grafik har doim koordinatalar boshidan o'tadi.",
        'Функция вида y = kx называется прямой пропорциональностью, где k не равен нулю. В ней нет слагаемого, поэтому график всегда проходит через начало координат.',
        'A function of the form y = kx, with k not zero, is called a direct proportionality. It has no addend, so the graph always passes through the origin.',
      ),
      L(
        "k musbat bo'lsa grafik birinchi va uchinchi chorakdan o'tadi, k manfiy bo'lsa ikkinchi va to'rtinchi chorakdan. Yozuvda qo'shiluvchi paydo bo'lsa, bu boshqa funksiya: uning grafigi boshdan surilgan bo'ladi.",
        'При k положительном график идёт через первую и третью четверти, при отрицательном через вторую и четвёртую. Если в записи появилось слагаемое, это другая функция: её график сдвинут от начала.',
        'A positive k sends the graph through the first and third quadrants, a negative one through the second and fourth. If an addend appears, it is another function: its graph is shifted off the origin.',
      ),
    ],
  },
  hookCap: L(
    "b yo'q  --  grafik boshdan o'tadi",
    'нет b — график через начало',
    'no b means through the origin',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("qo'shiluvchi yo'q", 'слагаемого нет', 'no addend'),
    L('bosh -- umumiy nuqta', 'начало это общая точка', 'the origin is shared'),
    L('ishora -- choraklar', 'знак это четверти', 'the sign gives the quadrants'),
  ],
  audio: [
    A('mount', "Uch narsani ko'rdik: bosh, b ning ta'siri va choraklar. Endi qoidani yig'amiz.", 'Три вещи мы увидели: начало, влияние b и четверти. Теперь соберём правило.', 'We have seen three things: the origin, the effect of b and the quadrants. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda ikki chiziq bir masalada uchrashadi.", 'Верно. На следующем уроке две прямые встретятся в одной задаче.', 'Correct. Next lesson two lines meet in one problem.'),
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
        "Qaysi yozuv to'g'ri proporsionallik?",
        'Какая запись является прямой пропорциональностью?',
        'Which record is a direct proportionality?',
      ),
      ok: L("Unda faqat k karra x turadi, qo'shiluvchi yo'q.", 'В ней только k на x, слагаемого нет.', 'It holds only k times x, with no addend.'),
      items: [
        { id: 'a', label: 'y = 7x', correct: true },
        { id: 'b', label: 'y = 7x + 1', tag: 'Z1', hint: L("Bu yerda qo'shiluvchi bor, demak grafik boshdan o'tmaydi.", 'Здесь есть слагаемое, значит график не через начало.', 'There is an addend here, so the graph misses the origin.') },
        { id: 'c', label: 'y = 7', tag: 'Z5', hint: L("Bu yerda x umuman yo'q: grafik gorizontal chiziq bo'ladi.", 'Здесь вообще нет x: график будет горизонтальной прямой.', 'There is no x at all: the graph is a horizontal line.') },
        { id: 'd', label: 'y = x + 7', tag: 'Z1', hint: L("Qo'shiluvchi yetti bor.", 'Есть слагаемое семь.', 'There is an addend of seven.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = 6x grafigi (2; 12) nuqtasidan o'tadimi?",
        'Проходит ли график y = 6x через точку (2; 12)?',
        'Does the graph of y = 6x pass through (2; 12)?',
      ),
      ok: L("Olti karra ikki o'n ikki, ordinata ham o'n ikki.", 'Шесть на два двенадцать, и ордината двенадцать.', 'Six times two is twelve, and the ordinate is twelve.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z2', label: L("yo'q", 'нет', 'no'), hint: L("Ikkini formulaga qo'ying: olti karra ikki o'n ikki.", 'Подставь два в формулу: шесть на два двенадцать.', 'Substitute two: six times two is twelve.') },
        { id: 'c', tag: 'Z2', label: L('chizma kerak', 'нужен чертёж', 'a drawing is needed'), hint: L("Son qo'yish yetadi.", 'Достаточно подстановки.', 'Substituting is enough.') },
        { id: 'd', tag: 'Z4', label: L('k ni bilish kerak emas', 'k знать не нужно', 'k need not be known'), hint: L("k kerak: aynan u qiymatni beradi.", 'k нужно: именно оно даёт значение.', 'k is needed: it gives the value.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = kx grafigi (3; 12) nuqtasidan o'tadi. k nechchiga teng?",
        'График y = kx проходит через точку (3; 12). Чему равен k?',
        'The graph of y = kx passes through (3; 12). What is k?',
      ),
      ok: L("O'n ikkini uchga bo'lsak to'rt chiqadi.", 'Двенадцать разделить на три это четыре.', 'Twelve divided by three is four.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '9', tag: 'Z4', hint: L("k ni topish uchun ordinata abssissaga BO'LINADI.", 'Чтобы найти k, ординату ДЕЛЯТ на абсциссу.', 'To find k the ordinate is DIVIDED by the abscissa.') },
        { id: 'c', label: '36', tag: 'Z4', hint: L("Ko'paytirish emas, bo'lish kerak.", 'Нужно делить, а не умножать.', 'Divide, do not multiply.') },
        { id: 'd', label: '3', tag: 'Z4', hint: L("Uch bu abssissa, k esa bo'linma.", 'Три это абсцисса, а k это частное.', 'Three is the abscissa, k is the quotient.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "To'g'ri proporsionallikning grafigi qaysi nuqtadan har doim o'tadi?",
        'Через какую точку всегда проходит график прямой пропорциональности?',
        'Which point does a direct proportionality always pass through?',
      ),
      ok: L("x nol bo'lganda y ham nol chiqadi.", 'При x равном нулю y тоже ноль.', 'At x zero the y is zero too.'),
      items: [
        { id: 'a', label: '(0; 0)', correct: true },
        { id: 'b', label: '(1; 1)', tag: 'Z5', hint: L("Bu faqat k birga teng bo'lganda bo'ladi.", 'Это бывает только при k равном единице.', 'That happens only when k is one.') },
        { id: 'c', label: '(0; 1)', tag: 'Z2', hint: L("Bunday nuqta b birga teng bo'lganda bo'lardi, bu yerda esa b yo'q.", 'Такая точка была бы при b равном единице, а здесь b нет.', 'That point would need b equal to one, but there is no b here.') },
        { id: 'd', label: '(1; 0)', tag: 'Z2', hint: L("Bu nuqta k nolga teng bo'lganda chiqardi.", 'Эта точка вышла бы при k равном нулю.', 'That point would need k equal to zero.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Uchinchisida k ni topish kerak.", 'Четыре вопроса. В третьем надо найти k.', 'Four questions. The third asks for k.'),
    A('1', "Ikkinchisi son qo'yish bilan tekshiriladi.", 'Второй проверяется подстановкой.', 'The second is checked by substituting.'),
    A('2', "Uchinchisida bo'lish kerak.", 'В третьем нужно делить.', 'The third needs division.'),
    A('3', "Oxirgisi butun darsning savoli.", 'Последний это вопрос всего урока.', 'The last is the question of the whole lesson.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: k, keyin qiymat.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('k va qiymat', 'k и значение', 'k and the value'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "y = kx grafigi (2; 6) nuqtasidan o'tadi.",
    'График y = kx проходит через точку (2; 6).',
    'The graph of y = kx passes through (2; 6).',
  ),
  template: ['k = 6 : 2 = ', { slot: 0 }, ',   x = 4   →   y = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '3' },
    { id: 'b', label: '12' },
    { id: 'c', label: '8' },
    { id: 'd', label: '2' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "k ni toping va formulani yozing.",
    'Найди k и запиши формулу.',
    'Find k and write the formula.',
  ),
  checkNote: L(
    "k ni topish uchun ordinata abssissaga bo'linadi: olti bo'lingan ikki uch. So'ngra uch karra to'rt o'n ikki.",
    'Чтобы найти k, ординату делят на абсциссу: шесть на два три. Затем три на четыре двенадцать.',
    'To find k, divide the ordinate by the abscissa: six by two is three. Then three times four is twelve.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Uch karra to'rt o'n ikki beradi.", 'Три на четыре это двенадцать.', 'Three times four is twelve.') },
    { key: 'd', tag: 'Z6', hint: L("Olti bo'lingan ikki uch beradi.", 'Шесть на два это три.', 'Six by two is three.') },
    { key: '*', tag: 'Z4', hint: L("k har doim ordinatani abssissaga bo'lish bilan topiladi.", 'k всегда находится делением ординаты на абсциссу.', 'k is always found by dividing the ordinate by the abscissa.') },
  ],
  probe: {
    question: L("Shu grafikda x beshga teng bo'lganda y nechchi?", 'Каково y на этом графике при x равном пяти?', 'What is y on this graph at x equal to five?'),
    items: [
      { id: 'a', correct: true, label: '15' },
      { id: 'b', tag: 'Z6', label: '8', hint: L("k karra x ko'paytiriladi, qo'shilmaydi.", 'k на x умножается, а не складывается.', 'k times x is multiplied, not added.') },
      { id: 'c', tag: 'Z4', label: '5', hint: L("Besh bu x, javob esa y.", 'Пять это x, а ответ это y.', 'Five is x, and the answer is y.') },
      { id: 'd', tag: 'Z6', label: '10', hint: L("k uchga teng: uch karra besh o'n besh.", 'k равен трём: три на пять пятнадцать.', 'k is three: three times five is fifteen.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval k, keyin yangi qiymat.", 'Два шага. Сначала k, потом новое значение.', 'Two steps. k first, then a new value.'),
    A('mount', "k ni topish uchun bitta nuqta yetadi, chunki grafik boshdan o'tishi ma'lum.", 'Чтобы найти k, достаточно одной точки, ведь известно, что график идёт через начало.', 'One point is enough for k, since the graph is known to pass the origin.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. k ni nuqtadan topish, ishora bilan.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Ishora bilan', 'Со знаком', 'With a sign'),
  given: L(
    "y = kx grafigi (4; −8) nuqtasidan o'tadi. k nechchiga teng?",
    'График y = kx проходит через точку (4; −8). Чему равен k?',
    'The graph of y = kx passes through (4; −8). What is k?',
  ),
  template: ['k = −8 : 4 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '−2' },
    { id: 'b', label: '2' },
    { id: 'c', label: '−32' },
    { id: 'd', label: '−4' },
  ],
  answer: ['a'],
  prompt: L(
    "Koeffitsiyentni toping.",
    'Найди коэффициент.',
    'Find the coefficient.',
  ),
  checkNote: L(
    "Manfiy sakkizni to'rtga bo'lsak manfiy ikki chiqadi. k manfiy, demak grafik ikkinchi va to'rtinchi chorakdan o'tadi.",
    'Минус восемь разделить на четыре это минус два. k отрицательный, значит график идёт через вторую и четвёртую четверти.',
    'Minus eight by four is minus two. k is negative, so the graph runs through the second and fourth quadrants.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Ordinata manfiy, demak bo'linma ham manfiy.", 'Ордината отрицательна, значит и частное отрицательно.', 'The ordinate is negative, so the quotient is negative too.') },
    { key: 'c', tag: 'Z4', hint: L("Bo'lish kerak, ko'paytirish emas.", 'Нужно делить, а не умножать.', 'Divide, do not multiply.') },
    { key: 'd', tag: 'Z6', hint: L("Sakkizni to'rtga bo'lsak ikki chiqadi.", 'Восемь разделить на четыре это два.', 'Eight by four is two.') },
  ],
  audio: [
    A('mount', "Bu safar ordinata manfiy. Ishora bo'linmaga o'tadi.", 'На этот раз ордината отрицательна. Знак переходит в частное.', 'This time the ordinate is negative. The sign goes into the quotient.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Hisob to'g'ri, lekin yozuvda QO'SHILUVCHI bor
// va shuning uchun bu to'g'ri proporsionallik emas.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Hisoblar to'g'ri bajarilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Все подсчёты выполнены верно. И всё же какая строка ошибочна?',
    'Every computation is done right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: 'y = 2x + 1' },
    { id: 'r2', text: 'x = 1   →   y = 3' },
    { id: 'r3', text: 'x = 2   →   y = 5' },
    { id: 'r4', text: L("x nol bo'lganda y ham nol", 'при x = 0 выходит y = 0', 'at x = 0 the y comes out 0') },
    { id: 'r5', text: L("javob: to'g'ri proporsionallik", 'ответ: прямая пропорциональность', 'answer: a direct proportionality') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu berilgan formula.", 'Это данная формула.', 'That is the given formula.'),
    r2: L("To'g'ri: ikki karra bir qo'shuv bir uch.", 'Верно: два на один плюс один три.', 'Right: two times one plus one is three.'),
    r3: L("To'g'ri: ikki karra ikki qo'shuv bir besh.", 'Верно: два на два плюс один пять.', 'Right: two times two plus one is five.'),
      r5: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r3: 'Z1' , r5: 'Z1' },
  proofFill: {
    template: ['x = 0   →   y = ', { slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: '1' },
      { id: 'b', label: L("proporsionallik emas", 'не пропорциональность', 'not a proportionality') },
      { id: 'c', label: '0' },
      { id: 'd', label: L("proporsionallik", 'пропорциональность', 'a proportionality') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Nolni qo'yib ko'ring va xulosani tuzating.",
      'Подставь ноль и исправь вывод.',
      'Substitute zero and fix the conclusion.',
    ),
    checkNote: L(
      "x nol bo'lganda y birga teng bo'ldi, nolga emas. Demak grafik boshdan o'tmaydi va bu to'g'ri proporsionallik emas -- yozuvda qo'shiluvchi bor.",
      'При x равном нулю y оказался равен единице, а не нулю. Значит график не проходит через начало и это не прямая пропорциональность — в записи есть слагаемое.',
      'At x zero the y came out one, not zero. So the graph misses the origin and this is not a direct proportionality — the record has an addend.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z1', hint: L("Ikki karra nol nol beradi, lekin bir qo'shiladi.", 'Два на ноль это ноль, но прибавляется один.', 'Two times zero is zero, but one is added.') },
      { key: 'd', tag: 'Z1', hint: L("Grafik boshdan o'tmadi, demak bu boshqa funksiya.", 'График не прошёл через начало, значит это другая функция.', 'The graph missed the origin, so it is another function.') },
      { key: '*', tag: 'Z2', hint: L("Tekshirishning eng qisqa yo'li -- nolni qo'yish.", 'Самый короткий способ проверки это подставить ноль.', 'The shortest check is to substitute zero.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda hamma hisob to'g'ri bajarilgan.", 'В этой ловушке все подсчёты выполнены верно.', 'In this trap every computation is right.'),
    A('mount', "Shunday bo'lsa ham xulosa noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же вывод неверен. В какой строке ошибка впервые.', 'And yet the conclusion is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Nolda y bir chiqdi, ya'ni grafik boshdan o'tmaydi.", 'Нашёл. При нуле y вышел один, значит график не через начало.', 'You found it. At zero the y was one, so the graph misses the origin.'),
    A('done', "Qo'shiluvchi bor bo'lsa, bu to'g'ri proporsionallik emas.", 'Если есть слагаемое, это не прямая пропорциональность.', 'With an addend it is not a direct proportionality.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. NARX: to'g'ri proporsionallik hayotda.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Daftarlar narxi', 'Цена тетрадей', 'The price of notebooks'),
  given: L(
    "Uch daftar o'n besh ming so'm turadi. Narx daftarlar soniga to'g'ri proporsional: nol daftar nol so'm.",
    'Три тетради стоят пятнадцать тысяч сумов. Цена прямо пропорциональна числу тетрадей: ноль тетрадей ноль сумов.',
    'Three notebooks cost fifteen thousand sums. The price is directly proportional to the count: zero notebooks, zero sums.',
  ),
  template: ['k = 15 : 3 = ', { slot: 0 }, ',   x = 7   →   y = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '5' },
    { id: 'b', label: '35' },
    { id: 'c', label: '45' },
    { id: 'd', label: '12' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Bir daftarning narxini toping, keyin yetti daftar uchun hisoblang.",
    'Найди цену одной тетради, потом посчитай за семь.',
    'Find the price of one notebook, then compute for seven.',
  ),
  checkNote: L(
    "O'n beshni uchga bo'lsak besh, ya'ni bir daftar besh ming so'm. Yetti daftar esa o'ttiz besh ming.",
    'Пятнадцать разделить на три это пять, значит одна тетрадь пять тысяч. А семь тетрадей тридцать пять тысяч.',
    'Fifteen by three is five, so one notebook is five thousand. Seven notebooks make thirty five thousand.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Yetti karra besh o'ttiz besh beradi.", 'Семь на пять это тридцать пять.', 'Seven times five is thirty five.') },
    { key: 'd', tag: 'Z6', hint: L("Sonlar qo'shilmaydi, ko'paytiriladi.", 'Числа не складываются, а умножаются.', 'The numbers are multiplied, not added.') },
    { key: '*', tag: 'Z4', hint: L("Avval bir daftarning narxi, keyin ko'paytirish.", 'Сначала цена одной тетради, потом умножение.', 'The price of one notebook first, then multiply.') },
  ],
  audio: [
    A('mount', "To'g'ri proporsionallik hayotda ham uchraydi: narx soniga to'g'ri proporsional.", 'Прямая пропорциональность встречается и в жизни: цена прямо пропорциональна количеству.', 'Direct proportionality shows up in life too: the price is proportional to the count.'),
    A('mount', "Nol daftar nol so'm, shuning uchun grafik boshdan chiqadi.", 'Ноль тетрадей ноль сумов, поэтому график выходит из начала.', 'Zero notebooks cost zero, so the graph starts at the origin.'),
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
        "Qaysi yozuv to'g'ri proporsionallik?",
        'Какая запись прямая пропорциональность?',
        'Which record is a direct proportionality?',
      ),
      ok: L("Faqat k karra x, qo'shiluvchi yo'q.", 'Только k на x, слагаемого нет.', 'Only k times x, no addend.'),
      items: [
        { id: 'a', label: 'y = −5x', correct: true },
        { id: 'b', label: 'y = −5x + 2', tag: 'Z1', hint: L("Qo'shiluvchi bor.", 'Есть слагаемое.', 'There is an addend.') },
        { id: 'c', label: 'y = −5', tag: 'Z5', hint: L("Bu yerda x yo'q.", 'Здесь нет x.', 'There is no x here.') },
        { id: 'd', label: 'y = x − 5', tag: 'Z1', hint: L("Qo'shiluvchi manfiy besh.", 'Слагаемое минус пять.', 'The addend is minus five.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = kx grafigi (5; 20) dan o'tadi. k nechchi?",
        'График y = kx проходит через (5; 20). Чему равен k?',
        'The graph of y = kx passes through (5; 20). What is k?',
      ),
      ok: L("Yigirmani beshga bo'lsak to'rt.", 'Двадцать разделить на пять это четыре.', 'Twenty by five is four.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '100', tag: 'Z4', hint: L("Bo'lish kerak.", 'Нужно делить.', 'Division is needed.') },
        { id: 'c', label: '15', tag: 'Z4', hint: L("Ayirish emas, bo'lish.", 'Не вычитание, а деление.', 'Not subtraction but division.') },
        { id: 'd', label: '5', tag: 'Z4', hint: L("Besh bu abssissa.", 'Пять это абсцисса.', 'Five is the abscissa.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = −7x grafigi qaysi choraklardan o'tadi?",
        'Через какие четверти идёт график y = −7x?',
        'Which quadrants does the graph of y = −7x pass through?',
      ),
      ok: L("k manfiy: ikkinchi va to'rtinchi.", 'k отрицательный: вторая и четвёртая.', 'k is negative: the second and fourth.'),
      items: [
        { id: 'a', label: 'II, IV', correct: true },
        { id: 'b', label: 'I, III', tag: 'Z3', hint: L("Bu k musbat bo'lganda.", 'Это при k положительном.', 'That is with a positive k.') },
        { id: 'c', label: 'I, II', tag: 'Z3', hint: L("Yonma-yon turgan choraklar.", 'Это соседние четверти.', 'Those are neighbouring quadrants.') },
        { id: 'd', label: 'III, IV', tag: 'Z3', hint: L("Bu ham yonma-yon.", 'Это тоже соседние.', 'Those are neighbouring too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = 3x + 1 grafigi boshdan o'tadimi?",
        'Проходит ли график y = 3x + 1 через начало?',
        'Does the graph of y = 3x + 1 pass the origin?',
      ),
      ok: L("x nolda y bir chiqadi, nol emas.", 'При x равном нулю y выходит один, а не ноль.', 'At x zero the y is one, not zero.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z2', label: L('ha', 'да', 'yes'), hint: L("Nolni qo'ying: uch karra nol qo'shuv bir bir beradi.", 'Подставь ноль: три на ноль плюс один это один.', 'Substitute zero: three times zero plus one is one.') },
        { id: 'c', tag: 'Z2', label: L('chizma kerak', 'нужен чертёж', 'a drawing is needed'), hint: L("Nolni qo'yish yetadi.", 'Достаточно подставить ноль.', 'Substituting zero is enough.') },
        { id: 'd', tag: 'Z1', label: L('k ga bog\'liq', 'зависит от k', 'it depends on k'), hint: L("Boshdan o'tish b ga bog'liq, k ga emas.", 'Проход через начало зависит от b, а не от k.', 'Passing the origin depends on b, not on k.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida k topiladi.", 'Во втором находится k.', 'The second finds k.'),
    A('2', "Uchinchisi choraklar haqida.", 'Третий про четверти.', 'The third is about quadrants.'),
    A('3', "Oxirgisi nolni qo'yish bilan tekshiriladi.", 'Последний проверяется подстановкой нуля.', 'The last is checked by substituting zero.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('b yo\'q -- grafik boshdan', 'Нет b — график через начало', 'No b means through the origin'),
  gate: S1.gate,
  fix: {
    tokens: ['y', '=', '2x'],
    value: '0',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "To'g'ri proporsionallikda qo'shiluvchi yo'q, shuning uchun x nol bo'lganda y ham nol bo'ladi va grafik koordinatalar boshidan o'tadi.",
    'В прямой пропорциональности нет слагаемого, поэтому при x равном нулю y тоже ноль и график проходит через начало координат.',
    'A direct proportionality has no addend, so at x zero the y is zero and the graph passes the origin.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    first: L('birinchi formula', 'первая формула', 'the first formula'),
    second: L('ikkinchi formula', 'вторая формула', 'the second formula'),
    both: L('ikkovi ham', 'обе', 'both'),
    none: L('hech qaysi', 'ни одна', 'neither'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['y = 2x → (0; 0)', 'y = 2x + 3 → 3', 'y = −x → II, IV', '(2; 6) → k = 3'],
  twoLabel: L('B6 bloki davom etadi', 'Блок Б6 продолжается', 'Block B6 continues'),
  twoA: L(
    "qo'shiluvchi yo'q  →  bosh",
    'нет слагаемого  →  начало',
    'no addend  →  the origin',
  ),
  twoB: L(
    "k ning ishorasi  →  choraklar",
    'знак k  →  четверти',
    'the sign of k  →  the quadrants',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'chiziqli tenglamalar sistemasi',
    'системы линейных уравнений',
    'systems of linear equations',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta hadning yo'qligidan chiqdi: b yo'q, demak grafik boshdan o'tadi.", 'Вся сегодняшняя работа вышла из отсутствия одного члена: нет b, значит график через начало.', 'All of today came from one missing term: no b means through the origin.'),
    A('mount', "Keyingi darsda ikki chiziq bir masalada uchrashadi.", 'На следующем уроке две прямые встретятся в одной задаче.', 'Next lesson two lines meet in one problem.'),
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
