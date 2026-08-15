// ============================================================================
// 11-sinf, Dars 01. BOSHLANG'ICH FUNKSIYA.  (Первообразная)
//
// B1 blokining va butun kursning BIRINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/DARS01_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// Etalondan (12-dars) farqi NOL ekran. `graph` roli yangi asbobni chizadi
// (`CurveBoard`), lekin bu MA'LUMOT, rol emas.
//
// DARSNING BITTA GAPI: boshlang'ich funksiya BITTA emas. Ular cheksiz ko'p va
// bir-biridan o'zgarmas songa farq qiladi. B2 blokida javob doim bitta edi --
// son, oraliq, juft. Bu yerda javob butun OILA, va `+ C` uning nomi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_01',
  title: L('Boshlang\'ich funksiya', 'Первообразная', 'The antiderivative'),
}

const BLOCK = { label: 'B1', from: 1, to: 7, current: 1 }

// ============================================================
// SLAYD 1. XUK. Bitta javobmi yoki cheksiz ko'p.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Boshlang\'ich funksiya', 'Первообразная', 'The antiderivative'),
  title: L('Bitta javobmi?', 'Ответ один?', 'Is the answer unique?'),
  expr: L(
    "Qaysi funksiyaning hosilasi 2x ga teng?",
    'У какой функции производная равна 2x ?',
    'Which function has derivative 2x ?',
  ),
  rows: [
    {
      id: 'a',
      name: L('birinchi yechim', 'первое решение', 'first solution'),
      value: 'F = x²',
    },
    {
      id: 'b',
      name: L('ikkinchi yechim', 'второе решение', 'second solution'),
      value: 'F = x²,  x² + 5,  x² − 7,  …',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi ikkalasini ham differensiallab tekshiramiz.",
      'Твой ответ записан. Сейчас продифференцируем и проверим оба.',
      'Your answer is saved. Now we will differentiate and check both.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первое', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второе', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [5000, 3000, 6000, 4000],
  audio: [
    A('mount', "Bugun teskari savol. Ilgari funksiya berilardi va hosila so'ralardi. Endi hosila berilgan, funksiyaning o'zi so'ralyapti.", 'Сегодня вопрос обратный. Раньше давали функцию и спрашивали производную. Теперь дана производная, а спрашивают саму функцию.', 'Today the question is reversed. Before, a function was given and the derivative was asked. Now the derivative is given and the function itself is asked.'),
    A('r1', "Birinchi javob: iks kvadrat. Uning hosilasi haqiqatan ikki iks.", 'Первый ответ: икс в квадрате. Его производная действительно два икс.', 'The first answer: x squared. Its derivative really is two x.'),
    A('r2', "Ikkinchi javob: iks kvadrat, va yana iks kvadrat plyus besh, va iks kvadrat minus yetti, va shu tariqa cheksiz.", 'Второй ответ: икс в квадрате, и ещё икс в квадрате плюс пять, и икс в квадрате минус семь, и так без конца.', 'The second answer: x squared, and also x squared plus five, and x squared minus seven, and so on without end.'),
    A('ask', "Sizningcha qaysi javob to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какой ответ верный? Пока просто предположи.', 'Which answer do you think is correct? Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH: hosila haqida uch narsa.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Teskari savolga javob berishdan oldin hosila haqida uch narsani eslaymiz. Bu baholanmaydi.",
    'Прежде чем отвечать на обратный вопрос, вспомним три вещи о производной. Это не оценивается.',
    'Before answering the reverse question, let us recall three things about the derivative. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('O\'zgarmasning hosilasi nol', 'Производная постоянной равна нулю', 'The derivative of a constant is zero'),
      short: L("o'zgarmas → 0", 'постоянная → 0', 'a constant → 0'),
      ex: [
        { e: "(5)' = 0", why: L('o\'zgarmas o\'sgani yo\'q', 'постоянная не растёт', 'a constant does not grow') },
        { e: "(−7)' = 0", why: L('u ham', 'она тоже', 'that one too') },
      ],
    },
    {
      id: 'c2',
      title: L('Daraja hosilasi', 'Производная степени', 'The derivative of a power'),
      short: L('daraja hosilasi', 'производная степени', 'derivative of a power'),
      ex: [
        { e: "(x²)' = 2x", why: L("ko'rsatkich oldinga chiqdi, o'zi bir kamaydi", 'показатель вышел вперёд, сам стал на один меньше', 'the exponent moved to the front and dropped by one') },
        { e: "(x³)' = 3x²", why: L('xuddi shunday', 'точно так же', 'exactly the same') },
      ],
    },
    {
      id: 'c3',
      title: L('Yig\'indi hosilasi — hosilalar yig\'indisi', 'Производная суммы — сумма производных', 'The derivative of a sum is the sum of derivatives'),
      short: L("yig'indi bo'yicha", 'по слагаемым', 'term by term'),
      ex: [
        { e: "(x² + 5)' = 2x + 0 = 2x", why: L("o'zgarmas yo'qoldi", 'постоянная исчезла', 'the constant vanished') },
      ],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L("(x³)' nechaga teng?", 'Чему равна (x³)’ ?', 'What is (x³)’ ?'),
      cols: 4,
      items: [
        { id: 'a', label: '3x²', correct: true },
        { id: 'b', label: 'x²', hint: L("Ko'rsatkich oldinga chiqadi: uch qoladi ko'paytuvchi bo'lib.", 'Показатель выходит вперёд: тройка остаётся множителем.', 'The exponent moves to the front: the three stays as a factor.') },
        { id: 'c', label: '3x³', hint: L("Ko'rsatkich bir kamayadi: uch emas, ikki.", 'Показатель уменьшается на один: не три, а два.', 'The exponent drops by one: two, not three.') },
        { id: 'd', label: 'x⁴/4', hint: L("Bu teskari amal. Hozircha hosila so'ralyapti.", 'Это обратное действие. Пока спрашивают производную.', 'That is the reverse operation. For now the derivative is asked.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L("(x² + 5)' nechaga teng?", 'Чему равна (x² + 5)’ ?', 'What is (x² + 5)’ ?'),
      cols: 4,
      items: [
        { id: 'a', label: '2x', correct: true },
        { id: 'b', label: '2x + 5', hint: L("Beshning hosilasi nol: u o'sgani yo'q.", 'Производная пятёрки равна нулю: она не растёт.', 'The derivative of five is zero: it does not grow.') },
        { id: 'c', label: '2x + 1', hint: L("O'zgarmasdan bir emas, nol qoladi.", 'От постоянной остаётся не единица, а ноль.', 'A constant leaves not one but zero.') },
        { id: 'd', label: 'x² ', hint: L("Bu hosila emas, funksiyaning o'zi.", 'Это не производная, а сама функция.', 'That is not the derivative but the function itself.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L("Ikki har xil funksiyaning hosilasi bir xil bo'lishi mumkinmi?", 'Могут ли у двух разных функций быть одинаковые производные?', 'Can two different functions have the same derivative?'),
      cols: 2,
      items: [
        { id: 'a', label: L('ha, agar ular o\'zgarmasga farq qilsa', 'да, если они отличаются на постоянную', 'yes, if they differ by a constant'), correct: true },
        { id: 'b', label: L("yo'q, hosila funksiyani bir qiymatli aniqlaydi", 'нет, производная задаёт функцию однозначно', 'no, the derivative determines the function uniquely'), hint: L("Iks kvadrat va iks kvadrat plyus beshni differensiallang: ikkalasida ham ikki iks chiqadi.", 'Продифференцируй икс в квадрате и икс в квадрате плюс пять: в обоих случаях получится два икс.', 'Differentiate x squared and x squared plus five: both give two x.') },
        { id: 'c', label: L('faqat chiziqli funksiyalarda', 'только у линейных функций', 'only for linear functions'), hint: L("Daraja bilan ham shunday: qo'shilgan o'zgarmas hosilada yo'qoladi.", 'Со степенями то же самое: добавленная постоянная исчезает в производной.', 'The same with powers: an added constant vanishes in the derivative.') },
        { id: 'd', label: L("faqat nolga teng hosilada", 'только при нулевой производной', 'only when the derivative is zero'), hint: L("Har qanday hosilada: o'zgarmas har doim yo'qoladi.", 'При любой производной: постоянная исчезает всегда.', 'For any derivative: a constant always vanishes.') },
      ],
    },
  ],
  holds: [3000, 6000, 8000, 6500, 4500, 5500],
  audio: [
    A('mount', 'Uch narsani tiklaymiz. Bu baho emas.', 'Восстановим три вещи. Это не оценка.', 'Let us restore three things. This is not graded.'),
    A('c1', "Birinchi tayanch, va bugun eng muhimi. O'zgarmas sonning hosilasi nol. Besh ham, minus yetti ham o'smaydi, shuning uchun hosila nol.", 'Первая опора, и сегодня она главная. Производная постоянной равна нулю. И пятёрка, и минус семь не растут, поэтому производная ноль.', 'First basic, and today the main one. The derivative of a constant is zero. Neither five nor minus seven grows, so the derivative is zero.'),
    A('c2', "Ikkinchi tayanch. Daraja hosilasida ko'rsatkich oldinga ko'paytuvchi bo'lib chiqadi, o'zi esa bir kamayadi. Iks kvadratdan ikki iks chiqadi.", 'Вторая опора. При производной степени показатель выходит вперёд множителем, а сам уменьшается на один. Из икс в квадрате выходит два икс.', 'Second basic. In the derivative of a power the exponent moves to the front as a factor and drops by one. From x squared we get two x.'),
    A('c3', "Uchinchi tayanch. Yig'indining hosilasi bu hosilalar yig'indisi. Iks kvadrat plyus beshning hosilasi ikki iks plyus nol, ya'ni shunchaki ikki iks. Beshdan asar ham qolmadi.", 'Третья опора. Производная суммы это сумма производных. Производная икс в квадрате плюс пять равна два икс плюс ноль, то есть просто два икс. От пятёрки не осталось и следа.', 'Third basic. The derivative of a sum is the sum of derivatives. The derivative of x squared plus five is two x plus zero, that is simply two x. Nothing is left of the five.'),
    A('recap', "Qisqacha: o'zgarmas yo'qoladi, ko'rsatkich oldinga chiqadi, yig'indi bo'yicha ishlanadi.", 'Коротко: постоянная исчезает, показатель выходит вперёд, работаем по слагаемым.', 'Briefly: a constant vanishes, the exponent moves to the front, we work term by term.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. Bahsni DIFFERENSIALLASH hal qiladi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'check_by_diff',
  eyebrow: L('Differensiallab tekshiramiz', 'Проверим дифференцированием', 'Let us check by differentiating'),
  title: L('Bahsni hosila hal qiladi', 'Спор решает производная', 'The derivative settles it'),
  expr: L('kerak:  hosila = 2x', 'нужно: производная = 2x', 'needed: derivative = 2x'),
  goal: L('hosilasi 2x chiqsin', 'производная должна дать 2x', 'the derivative must give 2x'),
  rule: L(
    "Nomzodni tekshirish oson: uni differensiallaymiz. Hosila 2x chiqsa — nomzod yaroqli.",
    'Проверить кандидата легко: продифференцируем его. Получилось 2x — кандидат годится.',
    'Checking a candidate is easy: differentiate it. If the derivative is 2x, the candidate is valid.',
  ),
  pick: L('Qaysi nomzodni tekshiramiz?', 'Какого кандидата проверим?', 'Which candidate shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('birinchi yechim', 'первое решение', 'first solution'), value: 'F = x²' },
    { id: 'b', key: 'inB', name: L('ikkinchi yechim', 'второе решение', 'second solution'), value: L('F = x² + har qanday son', 'F = x² + любое число', 'F = x² + any number') },
  ],
  points: [
    {
      id: 'q1', label: 'F = x²', num: 'x²', step: 'calc', verdict: 'in',
      role: L('ikki javobda ham bor', 'есть в обоих ответах', 'in both answers'),
      calc: "(x²)' = 2x  ✓",
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: 'F = x² + 5', num: 'x² + 5', step: 'calc', verdict: 'in',
      role: L('faqat ikkinchisida', 'только во втором', 'only in the second'),
      calc: "(x² + 5)' = 2x + 0 = 2x  ✓",
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: 'F = 2x²', num: '2x²', step: 'calc', verdict: 'out',
      role: L('nazorat uchun', 'для контроля', 'as a control'),
      calc: "(2x²)' = 4x  ✗",
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'b', label: L('cheksiz ko\'p', 'бесконечно много', 'infinitely many'), correct: true,
        ok: L("To'g'ri. Ikki har xil funksiya bir xil hosila berdi, va o'rtadagi farq — o'zgarmas son.", 'Верно. Две разные функции дали одну и ту же производную, а разница между ними — постоянная.', 'Correct. Two different functions gave the same derivative, and the difference between them is a constant.'),
      },
      {
        id: 'a', label: L('bitta', 'одна', 'one'),
        hint: L("Iks kvadrat plyus beshni differensiallang: yana ikki iks chiqadi. Demak u ham yaroqli, birinchi javobga esa u kirmaydi.", 'Продифференцируй икс в квадрате плюс пять: снова получается два икс. Значит и она годится, а в первый ответ она не входит.', 'Differentiate x squared plus five: you get two x again. So it is valid too, yet the first answer does not include it.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 12000, 4500],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A('mount', "Nomzodni tekshirish uchun uni differensiallaymiz. Bu teskari amalning tekshiruvi: hosila ikki iks chiqsa, nomzod yaroqli.", 'Чтобы проверить кандидата, продифференцируем его. Это и есть проверка обратного действия: получилась производная два икс, кандидат годится.', 'To check a candidate we differentiate it. That is the check of the reverse operation: if the derivative is two x, the candidate is valid.'),
    A('mount', "Nomzodni tanlang.", 'Выбери кандидата.', 'Pick a candidate.'),
    A('calc', 'Differensiallaymiz.', 'Дифференцируем.', 'We differentiate.'),
    A('mark', "Uch nomzod tekshirildi. Iks kvadrat ikki iks berdi. Iks kvadrat plyus besh HAM ikki iks berdi: beshning hosilasi nol. Ikki iks kvadrat esa to'rt iks berdi, bu boshqa. Demak ikkita har xil funksiya bir xil hosilaga ega bo'lishi mumkin.", 'Три кандидата проверены. Икс в квадрате дал два икс. Икс в квадрате плюс пять дал ТОЖЕ два икс: производная пятёрки ноль. А два икс в квадрате дал четыре икс, это другое. Значит две разные функции могут иметь одинаковую производную.', 'Three candidates checked. x squared gave two x. x squared plus five gave two x AS WELL: the derivative of five is zero. And two x squared gave four x, which is different. So two different functions can have the same derivative.'),
    A('next', 'Endi javob bering: nechta yechim bor?', 'Теперь ответь: сколько решений?', 'Now answer: how many solutions are there?'),
  ],
}

// ============================================================
// SLAYD 4. OILA va URINMALAR: nega +C yo'qoladi.
// ============================================================
const F0 = (x) => x * x
const F5 = (x) => x * x + 5
const FM7 = (x) => x * x - 7

const S4 = {
  role: 'graph',
  tag: 'plus_c',
  drag: false,
  eyebrow: L('Nega o\'zgarmas yo\'qoladi', 'Почему постоянная исчезает', 'Why the constant vanishes'),
  title: L('Bir xil qiyalik', 'Одинаковый наклон', 'The same slope'),
  chip: 'F,  F + 5,  F − 7',
  graph: {
    curves: [
      { fn: F0, tone: 'ink', from: 1 },
      { fn: F5, tone: 'graph', from: 2 },
      { fn: FM7, tone: 'accent', from: 2 },
    ],
    xDomain: [-3.2, 3.2],
    yDomain: [-8.5, 11],
    xTicks: [{ v: -2 }, { v: 1 }, { v: 2 }],
    yTicks: [{ v: 0 }, { v: 5 }],
    tangentAt: 1,
    height: 168,
  },
  graphSteps: 3,
  bonus: L(
    "O'zgarmas egri chiziqni yuqoriga yoki pastga suradi, lekin BURMAYDI. Hosila esa aynan burilishni o'lchaydi.",
    'Постоянная двигает кривую вверх или вниз, но НЕ поворачивает её. А производная измеряет как раз поворот.',
    'A constant moves the curve up or down but does NOT turn it. And the derivative measures exactly the turning.',
  ),
  probe: {
    question: L("Nega uchala funksiyaning hosilasi bir xil?", 'Почему у всех трёх функций производная одинакова?', 'Why do all three functions have the same derivative?'),
    items: [
      { id: 'a', label: L('urinmalarning qiyaligi bir xil', 'наклон касательных одинаков', 'the slopes of the tangents are the same'), correct: true },
      { id: 'b', label: L("chunki egri chiziqlar ustma-ust tushadi", 'потому что кривые совпадают', 'because the curves coincide'), hint: L("Ular ustma-ust tushmaydi: biri yuqorida, biri pastda. Lekin qiyaligi bir xil.", 'Они не совпадают: одна выше, другая ниже. Но наклон у них одинаковый.', 'They do not coincide: one is higher, another lower. But their slope is the same.') },
      { id: 'c', label: L("chunki ular bir nuqtada kesishadi", 'потому что они пересекаются в одной точке', 'because they meet at a point'), hint: L("Bu egri chiziqlar umuman kesishmaydi.", 'Эти кривые вообще не пересекаются.', 'These curves do not meet at all.') },
      { id: 'd', label: L("chunki o'zgarmas kichik", 'потому что постоянная маленькая', 'because the constant is small'), hint: L("O'zgarmasni ming marta katta qiling — qiyalik yana o'zgarmaydi.", 'Сделай постоянную в тысячу раз больше — наклон опять не изменится.', 'Make the constant a thousand times bigger, and the slope still will not change.') },
    ],
  },
  holds: [5000, 3000, 7000, 6500],
  audio: [
    A('mount', "Hosila javobni ko'rsatdi. Endi nega shundayligini chizmada ko'ramiz.", 'Производная показала ответ. Теперь посмотрим на чертеже, почему так.', 'The derivative showed the answer. Now let us see in the drawing why it is so.'),
    A('one', "Mana birinchi egri chiziq, iks kvadrat.", 'Вот первая кривая, икс в квадрате.', 'Here is the first curve, x squared.'),
    A('family', "Endi yana ikkitasi: bittasi besh birlik yuqorida, ikkinchisi yetti birlik pastda. Ular bir xil shaklda, faqat suriladi.", 'Теперь ещё две: одна на пять единиц выше, другая на семь ниже. Они одинаковой формы, просто сдвинуты.', 'Now two more: one five units higher, another seven lower. They have the same shape, just shifted.'),
    A('tangent', "Va mana eng muhimi. Bitta nuqtada uchala egri chiziqqa urinma o'tkazamiz: uchalasining qiyaligi BIR XIL. O'zgarmas egrini suradi, lekin burmaydi, shuning uchun hosilada u yo'qoladi.", 'И вот главное. В одной точке проведём касательные ко всем трём кривым: наклон у всех трёх ОДИНАКОВЫЙ. Постоянная двигает кривую, но не поворачивает её, поэтому в производной она исчезает.', 'And here is the main thing. At one point we draw tangents to all three curves: the slope of all three is THE SAME. A constant moves the curve but does not turn it, and that is why it vanishes in the derivative.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: ta'rif va + C.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'plus_c',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Ta\'rif va + C', 'Определение и + C', 'The definition and + C'),
  rows: [
    L("F — f ning boshlang'ich funksiyasi, agar F' = f", "F — первообразная для f, если F' = f", "F is an antiderivative of f if F' = f"),
    "(x²)' = 2x   →   x² — 2x uchun",
    "(x² + C)' = 2x   →   hammasi to'g'ri",
  ],
  probe: {
    question: L(
      "F boshlang'ich funksiya bo'lsa, F + 5 ham shundaymi?",
      'Если F первообразная, будет ли F + 5 тоже первообразной?',
      'If F is an antiderivative, is F + 5 one as well?',
    ),
    items: [
      { id: 'a', label: L("ha: o'zgarmasning hosilasi nol", 'да: производная постоянной равна нулю', 'yes: the derivative of a constant is zero'), correct: true },
      { id: 'b', label: L("yo'q: bu boshqa funksiya", 'нет: это другая функция', 'no: that is a different function'), hint: L("Funksiya boshqa, lekin hosilasi o'sha. Ta'rif hosila haqida, funksiyaning o'zi haqida emas.", 'Функция другая, но производная та же. Определение говорит о производной, а не о самой функции.', 'The function differs, but the derivative is the same. The definition speaks about the derivative, not about the function itself.') },
      { id: 'c', label: L('faqat musbat sonlar uchun', 'только для положительных чисел', 'only for positive numbers'), hint: L("Minus yetti bilan ham shunday: hosilasi baribir nol.", 'С минус семью так же: производная всё равно ноль.', 'The same with minus seven: the derivative is zero anyway.') },
      { id: 'd', label: L("faqat f chiziqli bo'lsa", 'только если f линейна', 'only if f is linear'), hint: L("Har qanday f uchun: qo'shilgan o'zgarmas hosilada har doim yo'qoladi.", 'Для любой f: добавленная постоянная в производной исчезает всегда.', 'For any f: an added constant always vanishes in the derivative.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Ta\'rif', 'Правило 1. Определение', 'Rule 1. The definition'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: "F'(x) = f(x)",
    lines: [
      L("F — f ning boshlang'ich funksiyasi, agar F ning hosilasi f ga teng bo'lsa", "F — первообразная для f, если производная F равна f", "F is an antiderivative of f if the derivative of F equals f"),
      L("F yagona EMAS: F + C ham boshlang'ich funksiya", 'F НЕ единственная: F + C тоже первообразная', 'F is NOT unique: F + C is an antiderivative too'),
      L('C — har qanday o\'zgarmas son', 'C — любое постоянное число', 'C is any constant number'),
      L("javobda + C yozilmasa, javob to'liq emas", 'без + C ответ неполный', 'without + C the answer is incomplete'),
    ],
    example: L('misol:  f = 2x  →  F = x² + C', 'пример:  f = 2x  →  F = x² + C', 'example:  f = 2x  →  F = x² + C'),
  },
  holds: [4500, 6500, 5500],
  audio: [
    A('mount', "Chizmani ko'rdik. Endi buni ta'rif qilib yozamiz.", 'Чертёж мы увидели. Теперь запишем это определением.', 'We have seen the drawing. Now let us write it as a definition.'),
    A('def', "Funksiya boshlang'ich deyiladi, agar uning hosilasi berilgan funksiyaga teng bo'lsa. Iks kvadratning hosilasi ikki iks, demak u ikki iks uchun boshlang'ich.", 'Функцию называют первообразной, если её производная равна данной функции. Производная икс в квадрате это два икс, значит она первообразная для два икс.', 'A function is called an antiderivative if its derivative equals the given function. The derivative of x squared is two x, so it is an antiderivative for two x.'),
    A('c', "Va shu yerda o'zgarmas qo'shiladi: iks kvadrat plyus se ning hosilasi ham ikki iks.", 'И вот здесь добавляется постоянная: производная икс в квадрате плюс це это тоже два икс.', 'And here the constant is added: the derivative of x squared plus C is also two x.'),
    A('rule', "To'g'ri. O'zgarmasning hosilasi nol, shuning uchun uni istalgan qilib olish mumkin. Javobda tse yozilmasa, javob to'liq emas.", 'Верно. Производная постоянной равна нулю, поэтому её можно брать любой. Без це в ответе ответ неполный.', 'Correct. The derivative of a constant is zero, so it can be anything. Without the C the answer is incomplete.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: f = x² uchun nima?
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'power_rule',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Endi x² uchun', 'Теперь для x²', 'Now for x²'),
  was: { label: UI.was, expr: 'f = 2x   →   F = x² + C' },
  now: { label: UI.now, expr: 'f = x²   →   F = ?' },
  probe1: {
    question: L('Bu holat oldingisidan nimasi bilan qiyinroq?', 'Чем этот случай труднее прежнего?', 'Why is this case harder than the previous one?'),
    items: [
      { id: 'a', label: L("javobni darrov ko'rib bo'lmaydi: ko'rsatkichni ko'tarish kerak", 'ответ не виден сразу: надо поднять показатель', 'the answer is not obvious: the exponent must be raised'), correct: true },
      { id: 'b', label: L("chunki x² manfiy bo'lishi mumkin", 'потому что x² может быть отрицательным', 'because x² can be negative'), hint: L("Iks kvadrat manfiy bo'lmaydi, va bu masalaga aloqasi yo'q.", 'Икс в квадрате не бывает отрицательным, и к делу это не относится.', 'x squared is never negative, and it is beside the point.') },
      { id: 'c', label: L('bu yerda + C kerak emas', 'здесь не нужно + C', 'no + C is needed here'), hint: L("Kerak: qoida hamma holatga tegishli.", 'Нужно: правило относится ко всем случаям.', 'It is needed: the rule applies to every case.') },
      { id: 'd', label: L("f endi funksiya emas", 'f теперь не функция', 'f is no longer a function'), hint: L("Funksiya: har iksga bitta qiymat.", 'Функция: каждому иксу одно значение.', 'It is a function: one value for each x.') },
    ],
  },
  probe2: {
    question: L('Nima chiqadi?', 'Что получится?', 'What will come out?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: 'x³/3 + C' },
      { id: 'b', label: 'x³ + C' },
      { id: 'c', label: '3x² + C' },
      { id: 'd', label: '2x + C' },
    ],
  },
  holds: [4500, 6000, 3500, 3000],
  audio: [
    A('mount', "Birinchi holat oson edi: ikki iks uchun javobni yoddan bildik.", 'Первый случай был лёгкий: для два икс ответ мы знали наизусть.', 'The first case was easy: for two x we knew the answer by heart.'),
    A('now', "Endi berilgan funksiya iks kvadrat. Bu safar javobni darrov aytib bo'lmaydi: ko'rsatkichni ko'tarish kerak, va koeffitsient bilan nimadir qilish kerak.", 'Теперь дана функция икс в квадрате. Тут ответ сразу не назовёшь: надо поднять показатель, и что-то сделать с коэффициентом.', 'Now the given function is x squared. Here the answer is not immediate: the exponent must be raised, and something must be done with the coefficient.'),
    A('q1', 'Bu holat oldingisidan nimasi bilan qiyinroq?', 'Чем этот случай труднее прежнего?', 'Why is this case harder than the previous one?'),
    A('q2', 'Sizningcha nima chiqadi? Shunchaki taxmin qiling.', 'Как думаешь, что получится? Просто предположи.', 'What do you think will come out? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: x³ va x³/3.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'check_by_diff',
  eyebrow: L('Ikkisini ham differensiallaymiz', 'Продифференцируем обе', 'Let us differentiate both'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: 'f = x²',
  need: "= x²",
  answerLabel: L('ikkinchi nomzod', 'второй кандидат', 'the second candidate'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: 'F = x³',
      point: {
        label: L('differensiallaymiz', 'дифференцируем', 'we differentiate'),
        calc: "(x³)' = 3x²  ✗",
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: 'F = x³/3',
      point: {
        label: L('differensiallaymiz', 'дифференцируем', 'we differentiate'),
        calc: "(x³/3)' = 3x²/3 = x²  ✓",
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['x³', 'x³/3', '3x²', 'x³/2'],
    value: ['x³/3'],
    label: 'F(x) =',
    prompt: L('Boshlang\'ich funksiyani yozing', 'Запиши первообразную', 'Write the antiderivative'),
    wrongs: [
      { key: 'x³', hint: L("Uni differensiallang: uch iks kvadrat chiqadi, bizga esa iks kvadrat kerak. Uchga bo'lish kerak.", 'Продифференцируй её: получится три икс в квадрате, а нужно икс в квадрате. Надо разделить на три.', 'Differentiate it: you get three x squared, but we need x squared. It must be divided by three.') },
      { key: '3x²', hint: L("Bu hosila, boshlang'ich funksiya emas: yo'nalishni chalkashtirdingiz.", 'Это производная, а не первообразная: перепутано направление.', 'That is the derivative, not the antiderivative: the direction is mixed up.') },
      { key: '*', hint: L("Ko'rsatkichni bittaga ko'taring va YANGI ko'rsatkichga bo'ling.", 'Подними показатель на один и раздели на НОВЫЙ показатель.', 'Raise the exponent by one and divide by the NEW exponent.') },
    ],
  },
  holds: [3000, 7000, 8000, 4500],
  audio: [
    A('mount', 'Siz taxmin qildingiz. Endi ikkala nomzodni ham differensiallaymiz.', 'Прогноз есть. Теперь продифференцируем обоих кандидатов.', 'You made a guess. Now let us differentiate both candidates.'),
    A('p1', "Birinchi nomzod: iks kubi. Uni differensiallaymiz va uch iks kvadrat chiqadi. Bizga esa iks kvadrat kerak edi: uch marta ortiqcha.", 'Первый кандидат: икс в кубе. Дифференцируем и получаем три икс в квадрате. А нужно было икс в квадрате: в три раза больше.', 'The first candidate: x cubed. We differentiate and get three x squared. But we needed x squared: three times too much.'),
    A('p2', "Ikkinchi nomzod: iks kubi bo'lingan uchga. Hosila uch iks kvadrat bo'lingan uch, ya'ni aynan iks kvadrat. Mos keladi.", 'Второй кандидат: икс в кубе делить на три. Производная три икс в квадрате делить на три, то есть ровно икс в квадрате. Подходит.', 'The second candidate: x cubed divided by three. The derivative is three x squared over three, that is exactly x squared. It fits.'),
    A('write', "Demak ortiqcha uchni oldindan bo'lib qo'yish kerak ekan. Javobni yozing.", 'Значит лишнюю тройку надо поделить заранее. Запиши ответ.', 'So the extra three must be divided out in advance. Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: daraja qoidasi va JAMLANMA.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'power_rule',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Daraja qoidasi', 'Правило степени', 'The power rule'),
  cases: [
    {
      label: L('hosila', 'производная', 'derivative'),
      text: L("ko'rsatkich oldinga, o'zi bir kamayadi", 'показатель вперёд, сам на один меньше', 'exponent to the front, one less'),
      tone: 'graph',
    },
    {
      label: L("boshlang'ich funksiya", 'первообразная', 'antiderivative'),
      text: L("ko'rsatkich bir ortadi, unga bo'linadi", 'показатель на один больше, на него делим', 'exponent one more, divide by it'),
      tone: 'accent',
    },
  ],
  rows: ['xⁿ  →  xⁿ⁺¹ / (n + 1) + C', "tekshiruv:  (xⁿ⁺¹ / (n+1))' = xⁿ"],
  probe: {
    question: L("Nega yangi ko'rsatkichga bo'linadi?", 'Почему делим именно на новый показатель?', 'Why do we divide by the new exponent?'),
    items: [
      { id: 'a', label: L("differensiallashda u oldinga chiqadi va bo'linish uni yo'qotadi", 'при дифференцировании он выйдет вперёд, и деление его погасит', 'when differentiating it moves to the front, and the division cancels it'), correct: true },
      { id: 'b', label: L("shunday qabul qilingan", 'так принято', 'that is the convention'), hint: L("Bu kelishuv emas: bo'linishsiz hosila ortiqcha ko'paytuvchi bilan chiqadi.", 'Это не договорённость: без деления производная выходит с лишним множителем.', 'It is not a convention: without the division the derivative comes out with an extra factor.') },
      { id: 'c', label: L("eski ko'rsatkichga bo'linadi", 'делим на старый показатель', 'we divide by the old exponent'), hint: L("Tekshiring: iks kubini ikkiga bo'lib differensiallang — iks kvadrat chiqmaydi.", 'Проверь: раздели икс в кубе на два и продифференцируй — икс в квадрате не выйдет.', 'Check: divide x cubed by two and differentiate — you will not get x squared.') },
      { id: 'd', label: L("bo'lish shart emas", 'делить не обязательно', 'dividing is optional'), hint: L("Shart: bo'lmasa hosila n plyus bir marta ortiqcha chiqadi.", 'Обязательно: без деления производная выйдет в n плюс один раз больше.', 'It is required: without it the derivative is n plus one times too big.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Daraja', 'Правило 2. Степень', 'Rule 2. The power'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'xⁿ  →  xⁿ⁺¹ / (n + 1) + C',
    lines: [
      L("ko'rsatkichni bittaga ko'tar", 'подними показатель на один', 'raise the exponent by one'),
      L("YANGI ko'rsatkichga bo'l", 'раздели на НОВЫЙ показатель', 'divide by the NEW exponent'),
      L('+ C qo\'shishni unutma', 'не забудь + C', 'do not forget + C'),
      L('tekshir: differensialla va f bilan solishtir', 'проверь: продифференцируй и сравни с f', 'check: differentiate and compare with f'),
    ],
    example: L('misol:  x²  →  x³/3 + C', 'пример:  x²  →  x³/3 + C', 'example:  x²  →  x³/3 + C'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: "F' = f",
    lines: [
      L("1. ko'rsatkichni ko'tar va yangisiga bo'l", '1. подними показатель и раздели на новый', '1. raise the exponent and divide by the new one'),
      L("2. yig'indi bo'yicha alohida ishla", '2. работай по слагаемым отдельно', '2. work term by term'),
      L('3. + C yoz: javob bitta emas, u OILA', '3. напиши + C: ответ не один, это СЕМЕЙСТВО', '3. write + C: the answer is not one, it is a FAMILY'),
      L('4. differensiallab tekshir', '4. проверь дифференцированием', '4. check by differentiating'),
    ],
  },
  holds: [4500, 5500, 3000, 5000],
  audio: [
    A('mount', "Nomzodlar javobni ko'rsatdi. Endi umumiy qoidani yozamiz.", 'Кандидаты показали ответ. Теперь запишем общее правило.', 'The candidates showed the answer. Now let us write the general rule.'),
    A('rows', "Iks darajada en uchun boshlang'ich funksiya bu iks darajada en plyus bir, bo'lingan en plyus birga.", 'Для икс в степени эн первообразная это икс в степени эн плюс один, делить на эн плюс один.', 'For x to the power n the antiderivative is x to the power n plus one, divided by n plus one.'),
    A('q', "Savol: nega aynan yangi ko'rsatkichga bo'linadi?", 'Вопрос: почему делим именно на новый показатель?', 'The question: why do we divide by the new exponent?'),
    A('rule', "To'g'ri. Differensiallashda yangi ko'rsatkich oldinga ko'paytuvchi bo'lib chiqadi, va oldindan qo'yilgan bo'linish uni aynan yo'qotadi.", 'Верно. При дифференцировании новый показатель выйдет вперёд множителем, и заранее поставленное деление его как раз погасит.', 'Correct. When differentiating, the new exponent moves to the front as a factor, and the division put there in advance cancels it exactly.'),
    A('both', 'Endi butun usulni bitta qoidaga yig\'ing.', 'А теперь собери весь способ в одно правило.', 'Now combine the whole method into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. MAXRAJNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'power_rule',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Maxrajni qo\'ying', 'Поставь знаменатель', 'Place the denominator'),
  left: 'f = x⁵',
  template: ['F = x⁶ / ', { slot: 0 }, ' + C'],
  signs: ['5', '6', '7'],
  answer: '6',
  checkNote: L(
    "Tekshiruv: (x⁶/6)' = 6x⁵/6 = x⁵",
    "Проверка: (x⁶/6)' = 6x⁵/6 = x⁵",
    "Check: (x⁶/6)' = 6x⁵/6 = x⁵",
  ),
  wrongs: [
    { key: '5', hint: L("Beshga bo'lsak, hosila olti beshdan iks beshinchi darajada chiqadi. Yangi ko'rsatkichga bo'linadi, eskisiga emas.", 'Если делить на пять, производная выйдет шесть пятых икс в пятой. Делим на новый показатель, а не на старый.', 'Dividing by five gives six fifths x to the fifth. We divide by the new exponent, not the old one.') },
    { key: '7', hint: L("Yetti qayerdan? Ko'rsatkich bittaga ko'tarildi: besh plyus bir bu olti.", 'Откуда семь? Показатель поднялся на один: пять плюс один это шесть.', 'Where does seven come from? The exponent rose by one: five plus one is six.') },
  ],
  probe: {
    question: L("Maxraj qayerdan olinadi?", 'Откуда берётся знаменатель?', 'Where does the denominator come from?'),
    items: [
      { id: 'a', label: L("yangi ko'rsatkichdan", 'из нового показателя', 'from the new exponent'), correct: true },
      { id: 'b', label: L("eski ko'rsatkichdan", 'из старого показателя', 'from the old exponent'), hint: L("Tekshiring: eskisiga bo'lsak hosila mos kelmaydi.", 'Проверь: при делении на старый производная не сходится.', 'Check: dividing by the old one makes the derivative disagree.') },
      { id: 'c', label: L("f oldidagi koeffitsientdan", 'из коэффициента перед f', 'from the coefficient in front of f'), hint: L("Bu yerda koeffitsient bir. Maxraj esa olti.", 'Здесь коэффициент единица. А знаменатель шесть.', 'Here the coefficient is one. But the denominator is six.') },
      { id: 'd', label: L('ixtiyoriy son', 'это любое число', 'it is any number'), hint: L("Ixtiyoriy son bu C. Maxraj esa qat'iy aniqlangan.", 'Любое число это C. А знаменатель определён строго.', 'Any number is C. The denominator is strictly determined.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Maxrajni qo'ying.", 'Поставь знаменатель.', 'Place the denominator.'),
    A('checked', "Bo'ldi. Endi ta'riflang: u qayerdan olinadi?", 'Получилось. Теперь сформулируй: откуда он берётся?', 'Done. Now put it into words: where does it come from?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'split', label: L("yig'indi bo'yicha ajratish", 'разбить по слагаемым', 'split term by term') },
  { id: 'power', label: L('daraja qoidasini qo\'llash', 'применить правило степени', 'apply the power rule') },
  { id: 'plusC', label: L('+ C qo\'shish', 'добавить + C', 'add + C') },
  { id: 'diff', label: L('differensiallash', 'продифференцировать', 'differentiate') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'power_rule',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: 'f = 3x² + 2x',
  actions: ACTIONS_10,
  steps: [
    {
      action: 'split',
      to: '3x²  va  2x  alohida',
      wrongs: [
        { action: 'plusC', hint: L("+ C oxirida qo'shiladi, hozircha erta.", '+ C добавляется в конце, пока рано.', '+ C is added at the end, it is too early.') },
        { action: 'diff', hint: L("Differensiallash TEKSHIRUV, u oxirida.", 'Дифференцирование это ПРОВЕРКА, она в конце.', 'Differentiating is the CHECK, it comes at the end.') },
      ],
    },
    {
      action: 'power',
      to: 'x³  va  x²',
      wrongs: [
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'diff', hint: L("Avval boshlang'ich funksiyani toping.", 'Сначала найди первообразную.', 'First find the antiderivative.') },
        { action: 'plusC', hint: L("Avval har slagayemni hisoblang.", 'Сначала посчитай каждое слагаемое.', 'First compute each term.') },
      ],
    },
    {
      action: 'plusC',
      to: 'F = x³ + x² + C',
      wrongs: [
        { action: 'power', hint: L("Daraja qoidasi qo'llanildi.", 'Правило степени уже применено.', 'The power rule is already applied.') },
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'diff', hint: L("Avval javobni to'liq yozing, keyin tekshiring.", 'Сначала запиши ответ полностью, потом проверяй.', 'Write the answer in full first, then check.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['x³ + x² + C', 'x³ + x²', '3x³ + 2x²', '6x + 2'],
    value: ['x³ + x² + C'],
    label: 'F(x) =',
    prompt: L('Javobni to\'liq yozing', 'Запиши ответ полностью', 'Write the answer in full'),
    wrongs: [
      { key: 'x³ + x²', hint: L("Javob to'liq emas: + C yozilmagan. Boshlang'ich funksiya bitta emas.", 'Ответ неполный: не написано + C. Первообразная не одна.', 'The answer is incomplete: + C is missing. The antiderivative is not unique.') },
      { key: '6x + 2', hint: L("Bu hosila, teskari amal emas.", 'Это производная, а не обратное действие.', 'That is the derivative, not the reverse operation.') },
      { key: '*', hint: L("Har slagayem uchun ko'rsatkichni ko'tarib, yangisiga bo'ling.", 'Для каждого слагаемого подними показатель и раздели на новый.', 'For each term raise the exponent and divide by the new one.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi ikki slagayemli misolni o\'tamiz.', 'Правило сформулировано. Пройдём пример с двумя слагаемыми.', 'The rule is yours now. Let us go through an example with two terms.'),
    A('start', "Ikki slagayem bor. Nimadan boshlashni tanlang.", 'Есть два слагаемых. Выбери, с чего начать.', 'There are two terms. Choose where to start.'),
    A('step4', 'Endi javobni to\'liq yozing.', 'Теперь запиши ответ полностью.', 'Now write the answer in full.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'plus_c',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Boshlang\'ich funksiyani toping', 'Найди первообразную', 'Find the antiderivative'),
  start: 'f = 4x³ − 1',
  actions: ACTIONS_10,
  hint: L(
    "Bir bu iks nolinchi darajada: uning boshlang'ich funksiyasi iks.",
    'Единица это икс в нулевой степени: её первообразная это икс.',
    'One is x to the power zero: its antiderivative is x.',
  ),
  steps: [
    {
      action: 'split',
      to: '4x³  va  −1  alohida',
      wrongs: [
        { action: 'plusC', hint: L("+ C oxirida.", '+ C в конце.', '+ C at the end.') },
        { action: 'diff', hint: L("Differensiallash tekshiruv uchun, oxirida.", 'Дифференцирование для проверки, в конце.', 'Differentiating is for the check, at the end.') },
      ],
    },
    {
      action: 'power',
      to: 'x⁴  va  −x',
      wrongs: [
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'diff', hint: L("Avval javobni toping.", 'Сначала найди ответ.', 'Find the answer first.') },
        { action: 'plusC', hint: L("Avval slagayemlarni hisoblang.", 'Сначала посчитай слагаемые.', 'Compute the terms first.') },
      ],
    },
    {
      action: 'plusC',
      to: 'F = x⁴ − x + C',
      wrongs: [
        { action: 'power', hint: L("Daraja qoidasi qo'llanildi.", 'Правило степени применено.', 'The power rule is applied.') },
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'diff', hint: L("Javobni yozing, keyin tekshiring.", 'Запиши ответ, потом проверяй.', 'Write the answer, then check.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['x⁴ − x + C', 'x⁴ − 1 + C', '4x⁴ − x + C', '12x² + C'],
    value: ['x⁴ − x + C'],
    label: 'F(x) =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: 'x⁴ − 1 + C', hint: L("Birning boshlang'ich funksiyasi bir emas, iks: (x)' = 1.", "Первообразная единицы это не единица, а икс: (x)' = 1.", "The antiderivative of one is not one but x: (x)' = 1.") },
      { key: '12x² + C', hint: L("Bu hosila. Yo'nalish teskari.", 'Это производная. Направление обратное.', 'That is the derivative. The direction is reversed.') },
      { key: '*', hint: L("Differensiallab tekshiring: hosila to'rt iks kubi minus bir chiqishi kerak.", 'Проверь дифференцированием: производная должна дать четыре икс в кубе минус один.', 'Check by differentiating: the derivative must give four x cubed minus one.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Ikki slagayem, va ikkinchisi oddiy son. Uning ham boshlang'ich funksiyasi bor.", 'Два слагаемых, и второе просто число. У него тоже есть первообразная.', 'Two terms, and the second is just a number. It has an antiderivative too.'),
    A('answered', "Javobni yozing va + C ni unutmang.", 'Запиши ответ и не забудь + C.', 'Write the answer and do not forget + C.'),
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
      id: 'b1', tag: 'plus_c', ask: true, cols: 4,
      done: L("o'zgarmasning hosilasi 0", 'производная постоянной 0', 'the derivative of a constant is 0'),
      prompt: L("O'zgarmas sonning hosilasi nechaga teng?", 'Чему равна производная постоянной?', 'What is the derivative of a constant?'),
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: '1', hint: L("Bir bu iksning hosilasi, o'zgarmasniki emas.", 'Единица это производная икса, а не постоянной.', 'One is the derivative of x, not of a constant.') },
        { id: 'c', label: L("o'zi", 'сама постоянная', 'the constant itself'), hint: L("O'zgarmas o'smaydi, demak hosilasi nol.", 'Постоянная не растёт, значит производная ноль.', 'A constant does not grow, so its derivative is zero.') },
        { id: 'd', label: 'C', hint: L("Se bu o'zgarmasning nomi, hosilasi emas.", 'Це это имя постоянной, а не её производная.', 'C is the name of the constant, not its derivative.') },
      ],
    },
    {
      id: 'b2', tag: 'power_rule', ask: true, cols: 4,
      done: 'x⁴  →  x⁵/5 + C',
      prompt: L("x⁴ uchun boshlang'ich funksiya?", 'Первообразная для x⁴ ?', 'The antiderivative of x⁴ ?'),
      items: [
        { id: 'a', label: 'x⁵/5 + C', correct: true },
        { id: 'b', label: 'x⁵ + C', hint: L("Yangi ko'rsatkichga bo'lish kerak: beshga.", 'Надо разделить на новый показатель: на пять.', 'You must divide by the new exponent: by five.') },
        { id: 'c', label: '4x³ + C', hint: L("Bu hosila, teskari amal emas.", 'Это производная, а не обратное действие.', 'That is the derivative, not the reverse.') },
        { id: 'd', label: 'x⁴/4 + C', hint: L("Ko'rsatkich ko'tarilmagan: to'rt emas, besh bo'lishi kerak.", 'Показатель не поднят: должно быть пять, а не четыре.', 'The exponent was not raised: it must be five, not four.') },
      ],
    },
    {
      id: 'b3', tag: 'plus_c', ask: true, cols: 4,
      done: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'),
      prompt: L("2x ning nechta boshlang'ich funksiyasi bor?", 'Сколько первообразных у 2x ?', 'How many antiderivatives does 2x have?'),
      items: [
        { id: 'a', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L("Iks kvadrat plyus har qanday son yaroqli.", 'Годится икс в квадрате плюс любое число.', 'x squared plus any number works.') },
        { id: 'c', label: L('ikkita', 'две', 'two'), hint: L("Nega ikkita? Har qanday o'zgarmas yaroqli.", 'Почему две? Годится любая постоянная.', 'Why two? Any constant works.') },
        { id: 'd', label: L("bitta ham yo'q", 'ни одной', 'none'), hint: L("Iks kvadrat bor, va u topilgan.", 'Есть икс в квадрате, и она найдена.', 'There is x squared, and it is found.') },
      ],
    },
    {
      id: 'b4', tag: 'check_by_diff', ask: true, cols: 1,
      done: L('tekshiruv: differensiallash', 'проверка: продифференцировать', 'check: differentiate'),
      prompt: L(
        "Boshlang'ich funksiyani topdingiz. Uni qanday tekshirasiz?",
        'Первообразная найдена. Как её проверить?',
        'You found an antiderivative. How do you check it?',
      ),
      items: [
        { id: 'a', label: L("differensiallab, f bilan solishtirish", 'продифференцировать и сравнить с f', 'differentiate it and compare with f'), correct: true },
        { id: 'b', label: L("yana bir marta boshlang'ich funksiya olish", 'взять первообразную ещё раз', 'take the antiderivative once more'), hint: L("Bu uzoqlashtiradi: yana bitta yangi funksiya chiqadi.", 'Это уводит дальше: получится ещё одна новая функция.', 'That leads further away: you get yet another new function.') },
        { id: 'c', label: L('javoblarga qarash', 'посмотреть в ответы', 'look at the answers'), hint: L("Imtihonda javoblar bo'lmaydi, hosila esa har doim bor.", 'На экзамене ответов нет, а производная всегда под рукой.', 'On the exam there are no answers, but the derivative is always at hand.') },
        { id: 'd', label: L("son qo'yib ko'rish", 'подставить число', 'substitute a number'), hint: L("Bitta son yetmaydi: u tasodifan mos kelishi mumkin. Hosila esa hamma iks uchun tekshiradi.", 'Одного числа мало: оно может совпасть случайно. А производная проверяет при всех иксах.', 'One number is not enough: it may match by chance. The derivative checks for all x.') },
      ],
    },
    {
      id: 'b5', tag: 'power_rule', ask: true, cols: 4,
      done: '5  →  5x + C',
      prompt: L("f = 5 uchun boshlang'ich funksiya?", 'Первообразная для f = 5 ?', 'The antiderivative of f = 5 ?'),
      items: [
        { id: 'a', label: '5x + C', correct: true },
        { id: 'b', label: '5 + C', hint: L("Differensiallang: nol chiqadi, besh emas.", 'Продифференцируй: получится ноль, а не пять.', 'Differentiate it: you get zero, not five.') },
        { id: 'c', label: '0', hint: L("Nol bu beshning HOSILASI, boshlang'ich funksiyasi emas.", 'Ноль это ПРОИЗВОДНАЯ пятёрки, а не первообразная.', 'Zero is the DERIVATIVE of five, not its antiderivative.') },
        { id: 'd', label: '5x²/2 + C', hint: L("Besh bu iks nolinchi darajada: ko'rsatkich birga ko'tariladi, ikkiga emas.", 'Пять это икс в нулевой: показатель поднимается до одного, а не до двух.', 'Five is x to the power zero: the exponent rises to one, not to two.') },
      ],
    },
    {
      id: 'b6', tag: 'check_by_diff', ask: true, cols: 4,
      done: "(x³/3 + 7)' = x²",
      prompt: L("(x³/3 + 7)' nechaga teng?", "Чему равна (x³/3 + 7)’ ?", "What is (x³/3 + 7)’ ?"),
      items: [
        { id: 'a', label: 'x²', correct: true },
        { id: 'b', label: 'x² + 7', hint: L("Yettining hosilasi nol.", 'Производная семёрки равна нулю.', 'The derivative of seven is zero.') },
        { id: 'c', label: 'x³', hint: L("Ko'rsatkich bir kamayadi: uch emas, ikki.", 'Показатель уменьшается на один: не три, а два.', 'The exponent drops by one: two, not three.') },
        { id: 'd', label: '3x²', hint: L("Uchga bo'linganini unutmang: uch bo'lingan uch bu bir.", 'Не забудь про деление на три: три делить на три это один.', 'Do not forget the division by three: three over three is one.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Daraja qoidasi.", 'Правило степени.', 'The power rule.'),
    A('q3', "Bu savol darsning bitta gapi haqida.", 'Этот вопрос про главную мысль урока.', 'This question is about the main point of the lesson.'),
    A('q4', 'Tekshiruv haqida savol.', 'Вопрос про проверку.', 'A question about checking.'),
    A('q5', "Diqqat: bu oddiy son.", 'Внимание: здесь просто число.', 'Careful: here it is just a number.'),
    A('q6', 'Oxirgi. Endi teskari tomonga.', 'Последний. Теперь в обратную сторону.', 'The last one. Now the other way.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: koeffitsient yo'qolgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'power_rule',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Tekshiruv o'zi xatoni ko'rsatadi", 'Проверка сама показывает ошибку', 'The check itself shows the error'),
  rows: [
    { id: 'r1', text: 'f(x) = x³' },
    { id: 'r2', text: 'F(x) = x⁴' },
    { id: 'r3', text: "tekshiruv:  (x⁴)' = 4x³" },
    { id: 'r4', text: L('javob: F = x⁴', 'ответ: F = x⁴', 'answer: F = x⁴') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu berilgan funksiya, unda xato bo'lishi mumkin emas.", 'Это данная функция, ошибки в ней быть не может.', 'This is the given function, there can be no error in it.'),
    r3: L("Bu satr o'zi to'g'ri: iks to'rtinchi darajaning hosilasi haqiqatan to'rt iks kubi. Aynan shu satr oldingisining xato ekanini ko'rsatadi.", 'Эта строка верна сама по себе: производная икс в четвёртой действительно четыре икс в кубе. Именно она и показывает, что предыдущая неверна.', 'This line is correct in itself: the derivative of x to the fourth really is four x cubed. And it is exactly this line that shows the previous one is wrong.'),
    r4: L("Javob haqiqatan xato, lekin u oldin xato bo'lgan.", 'Ответ действительно неверный, но неверным он стал раньше.', 'The answer is indeed wrong, but it became wrong earlier.'),
  },
  proofPoint: "(x⁴)' = 4x³",
  proof: L(
    "Tekshiruv to'rt iks kubi berdi, kerak esa iks kubi: to'rt marta ortiqcha. Demak oldindan to'rtga bo'lish kerak edi: F = x⁴/4 + C",
    'Проверка дала четыре икс в кубе, а нужно икс в кубе: в четыре раза больше. Значит надо было заранее поделить на четыре: F = x⁴/4 + C',
    'The check gave four x cubed, but we need x cubed: four times too much. So it had to be divided by four in advance: F = x⁴/4 + C',
  ),
  probe: {
    question: L('Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
    items: [
      { id: 'a', label: L("yangi ko'rsatkichga bo'lish unutilgan", 'забыли разделить на новый показатель', 'the division by the new exponent was forgotten'), correct: true },
      { id: 'b', label: L("+ C yozilmagan", 'не написано + C', '+ C was not written'), hint: L("Bu ham xato, lekin BIRINCHI xato koeffitsientda: hosila mos kelmadi.", 'Это тоже ошибка, но ПЕРВАЯ ошибка в коэффициенте: производная не сошлась.', 'That is an error too, but the FIRST error is in the coefficient: the derivative did not match.') },
      { id: 'c', label: L("ko'rsatkich noto'g'ri ko'tarilgan", 'показатель поднят неверно', 'the exponent was raised incorrectly'), hint: L("Ko'rsatkich to'g'ri: uch plyus bir bu to'rt.", 'Показатель верен: три плюс один это четыре.', 'The exponent is right: three plus one is four.') },
      { id: 'd', label: L('tekshiruv noto\'g\'ri', 'проверка выполнена неверно', 'the check was done incorrectly'), hint: L("Tekshiruv to'g'ri bajarilgan, va aynan u xatoni fosh qildi.", 'Проверка выполнена верно, и именно она разоблачила ошибку.', 'The check was done correctly, and it is what exposed the error.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hatto tekshiruv ham bajarilgan. Va shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь даже проверка выполнена. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here even the check was carried out. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Qarang: tekshiruv to'rt iks kubi berdi, kerak esa iks kubi. Tekshiruv ishladi, lekin uning natijasiga e'tibor berilmadi.", 'Смотри: проверка дала четыре икс в кубе, а нужно икс в кубе. Проверка сработала, но на её результат не посмотрели.', 'Look: the check gave four x cubed, but we need x cubed. The check worked, but nobody looked at its result.'),
    A('q2', 'Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const PARTS_14 = ['x⁶', 'x⁵', 'x²', '+ C']

const S14 = {
  role: 'build',
  led: 'student',
  tag: 'power_rule',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Teskari yig\'ing', 'Собери обратно', 'Build it back'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("differensiallang — f chiqsin", 'продифференцируй — должно выйти f', 'differentiate — you must get f'),
  tasks: [
    {
      prompt: L('f = 6x⁵ uchun', 'Для f = 6x⁵', 'For f = 6x⁵'),
      template: ['F = ', { slot: 0 }, ' ', { slot: 1 }],
      parts: PARTS_14,
      answer: ['x⁶', '+ C'],
      doneLabel: "6x⁵  →  x⁶ + C",
      wrongs: [
        { key: 'x⁵|+ C', hint: L("Differensiallang: besh iks to'rtinchi darajada chiqadi, olti iks beshinchi emas.", 'Продифференцируй: получится пять икс в четвёртой, а не шесть икс в пятой.', 'Differentiate it: you get five x to the fourth, not six x to the fifth.') },
        { key: '*', hint: L("Oltilik ko'rsatkichdan chiqadi: iks oltinchi darajaning hosilasi olti iks beshinchi.", 'Шестёрка выходит из показателя: производная икс в шестой это шесть икс в пятой.', 'The six comes from the exponent: the derivative of x to the sixth is six x to the fifth.') },
      ],
    },
    {
      prompt: L('Endi f = 2x uchun', 'А теперь для f = 2x', 'And now for f = 2x'),
      template: ['F = ', { slot: 0 }, ' ', { slot: 1 }],
      parts: PARTS_14,
      answer: ['x²', '+ C'],
      doneLabel: "2x  →  x² + C",
      wrongs: [
        { key: '*', hint: L("Darsning boshida shu bilan boshlagan edik: iks kvadratning hosilasi ikki iks.", 'С этого мы и начали урок: производная икс в квадрате это два икс.', 'That is what the lesson began with: the derivative of x squared is two x.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi eng birinchi misolga qaytamiz. Uni endi qoida bo'yicha yig'asiz.", 'А теперь вернёмся к самому первому примеру. Теперь ты соберёшь его по правилу.', 'And now back to the very first example. This time you assemble it by the rule.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'check_by_diff',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: "F' = f",
  // Raqam YOZILMAYDI: yakun tanasi satrlarni o'zi 01, 02, 03 deb belgilaydi.
  ruleLines: [
    L("ko'rsatkichni ko'tar, yangisiga bo'l", 'подними показатель, раздели на новый', 'raise the exponent, divide by the new one'),
    L('+ C yoz: javob bitta emas, u oila', 'напиши + C: ответ не один, это семейство', 'write + C: the answer is not one, it is a family'),
    L('differensiallab tekshir', 'проверь дифференцированием', 'check by differentiating'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L("2x uchun nechta javob", 'сколько ответов у 2x', 'how many answers for 2x'),
      right: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'),
      map: {
        a: L('bitta', 'одна', 'one'),
        b: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'),
        both: '—',
        none: '—',
      },
    },
    {
      screen: 5,
      expr: 'f = x²',
      right: 'x³/3 + C',
      map: { a: 'x³/3 + C', b: 'x³ + C', c: '3x² + C', d: '2x + C' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: "f = 2x   →   F = x² + C   →   (x² + C)' = 2x",
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Urinmalar ekraniga va daraja qoidasiga qayting', 'Вернись к экрану с касательными и к правилу степени', 'Go back to the tangents screen and to the power rule'),
  },
  probe: {
    question: L("Javobingizni qanday tekshirasiz?", 'Как проверить свой ответ?', 'How do you check your answer?'),
    items: [
      { id: 'a', label: L("differensiallab, f bilan solishtirish", 'продифференцировать и сравнить с f', 'differentiate and compare with f'), correct: true },
      { id: 'b', label: L("qayta yechish", 'решить заново', 'solve it again'), hint: L("O'sha usul o'sha xatoni takrorlaydi.", 'Тот же способ повторит ту же ошибку.', 'The same way repeats the same mistake.') },
      { id: 'c', label: L('darslikka qarash', 'посмотреть в учебник', 'look in the textbook'), hint: L("Darslikda aynan sizning funksiyangiz bo'lmaydi.", 'В учебнике не будет именно твоей функции.', 'The textbook will not contain your exact function.') },
      { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L("Bor: hosila har doim qo'l ostida.", 'Есть: производная всегда под рукой.', 'There is: the derivative is always at hand.') },
    ],
  },
  sheetTitle: L('Boshlang\'ich funksiya · shpargalka', 'Первообразная · шпаргалка', 'The antiderivative · cheat sheet'),
  sheetSrc: L('11-sinf · 1-dars', '11 класс · урок 1', 'Grade 11 · lesson 1'),
  lifehack: L(
    "10 sekundlik tekshiruv: topgan funksiyangizni differensiallang. f chiqsa — to'g'ri. Va + C ni unutmang.",
    'Проверка за 10 секунд: продифференцируй найденную функцию. Получилось f — верно. И не забудь + C.',
    'A 10-second check: differentiate the function you found. If you get f, it is right. And do not forget + C.',
  ),
  holds: [2500, 8000, 4500, 4500],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminingiz va mana qanday chiqdi. Taxminda xato qilish normal edi, biz shuning uchun tekshirdik.", 'Вот твой прогноз и вот как оказалось. Ошибиться в догадке было нормально, именно поэтому мы проверяли.', 'Here is what you guessed and here is how it turned out. Being wrong in a guess was fine, that is exactly why we checked.'),
    A('rule', "Va mana savol, qaysidan boshladik. Javob bitta funksiya emas, butun oila, va ular bir-biridan o'zgarmasga farq qiladi.", 'А вот вопрос, с которого мы начали. Ответ это не одна функция, а целое семейство, и различаются они на постоянную.', 'And here is the question we began with. The answer is not one function but a whole family, and they differ by a constant.'),
    A('q', "Va eng muhimi: javobni har doim o'zingiz tekshirishingiz mumkin.", 'И главное: ответ ты всегда можешь проверить сам.', 'And the main thing: you can always check the answer yourself.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
