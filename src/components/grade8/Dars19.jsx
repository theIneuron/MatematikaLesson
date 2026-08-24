// ============================================================================
// 8-sinf, Dars 19. VIYET TEOREMASI.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `factorpair.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `factorpair`: ikkita son tanlanadi,
// pribor ularning yig'indisi va ko'paytmasini tekshiradi.
//
// DARSNING UCH ISHI (darslik, 25-§, 149-152-bet):
//   1) x² + px + q = 0 — KELTIRILGAN kvadrat tenglama (bosh koeffitsiyent
//      bir); har qanday tenglama a ga bo'lib shu shaklga keltiriladi;
//   2) Viyet teoremasi: x1 + x2 = −p, x1 · x2 = q — teng ildizlarda ham
//      (D = 0) to'g'ri;
//   3) teskari teorema orqali x² + px + q = (x − x1)(x − x2), va ildizlarni
//      «tanlash usuli» bilan topish mumkin — bu darsning mexanikasi.
//
// ENG NOZIK JOY. Yig'indi MINUS p ga teng, p ning o'ziga emas. Ko'paytma
// esa ishorasiz to'g'ridan-to'g'ri q. Ikkita formula, ikki xil qoida —
// aralashtirish oson (12-ekran, tuzoq).
//
// DARSLIK. O'zbek darsligi, 25-§, 149-152-bet: keltirilgan tenglama
// ta'rifi (149-bet), Viyet teoremasi va isboti (150-bet), teskari teorema
// va ko'paytuvchilarga ajratish (151-152-bet), tanlash usuli namunasi
// (4-masala, x² − 5x + 6 = 0 — aynan shu tenglama 5-ekranda ishlatilgan).
//
// ADASHISHLAR: ikkitasi yangi, bittasi qaytadi:
//   З45 — ikkinchi koeffitsiyentning ishorasi yig'indiga to'g'ridan-to'g'ri
//         ko'chirildi, teskari ishora olinmadi;
//   З46 — ikkinchi ildiz ko'paytmadan (yoki yig'indidan) to'g'ri
//         aniqlanmadi;
//   З16 — javob son bilan tekshirilmadi (11-ekranda).
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { SceneBand } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'
import { UI, buildScreens } from './karkas.js'

export const META = {
  id: 'alg-8-19',
  n: 19,
  row: 21,
  block: 'Б3',
  topic: L(
    'Viyet teoremasi',
    'Теорема Виета',
    "Vieta's theorem",
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "x² + px + q = 0 ko'rinishdagi tenglama keltirilgan kvadrat tenglama deyiladi",
    'Уравнение вида x² + px + q = 0 называется приведённым квадратным уравнением',
    'An equation of the form x² + px + q = 0 is called a reduced quadratic equation',
  ),
  L(
    "keltirilgan tenglamaning ildizlari uchun x1 + x2 = −p, x1 · x2 = q",
    'Для корней приведённого уравнения x1 + x2 = −p, x1 · x2 = q',
    'For the roots of a reduced equation, x1 + x2 = −p and x1 · x2 = q',
  ),
  L(
    "bu munosabatlar teng ildizlarda (D = 0) ham to'g'ri",
    'Эти соотношения верны и при равных корнях (D = 0)',
    'These relations hold even for equal roots (D = 0)',
  ),
]

export const MISS = {
  'З16': {
    what: L(
      'javob son bilan tekshirilmadi',
      'ответ не проверен числом',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 11,
  },
  'З45': {
    what: L(
      "ikkinchi koeffitsiyentning ishorasi yig'indiga to'g'ridan-to'g'ri ko'chirildi, teskari ishora olinmadi",
      'знак второго коэффициента перенесён в сумму без изменения, обратный знак не взят',
      "the second coefficient's sign was copied straight into the sum, without flipping it",
    ),
    wrong: '6',
    at: 12,
  },
  'З46': {
    what: L(
      "ikkinchi ildiz ko'paytmadan yoki yig'indidan to'g'ri aniqlanmadi",
      'второй корень не был верно определён через произведение или сумму',
      'the second root was not correctly determined from the product or the sum',
    ),
    wrong: '0',
    at: 3,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: ildizlarni yechmasdan yig'indi va ko'paytmani
// aytish mumkinmi. Yakun: x² − 5x + 6 = 0, yig'indi besh, ko'paytma olti.
// ============================================================
const SC_WITHOUT = L('YECHMASDAN AYTISH MUMKINMI', 'МОЖНО СКАЗАТЬ, НЕ РЕШАЯ', 'CAN WE TELL WITHOUT SOLVING')

const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Ildizlarni bilmasdan yig'indi va ko'paytma",
      'Сумма и произведение без знания корней',
      'The sum and product without knowing the roots',
    )}>
      <text x="200" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18"
        fill={T.ink}>{'x² − 5x + 6 = 0'}</text>

      <text x="120" y="95" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink3}>{'x1 + x2 = ?'}</text>
      <text x="280" y="95" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink3}>{'x1 · x2 = ?'}</text>

      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="95" r="15" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="101" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="130" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_WITHOUT)}</text>
    </SceneBand>
  )
}

const FinalScene = () => {
  const t = useT()
  return (
    <SceneBand kind="final" label={L(
      "Yig'indi besh, ko'paytma olti, hech nima yechilmadi",
      'Сумма пять, произведение шесть, и ничего не решалось',
      'Sum five, product six, and nothing was solved',
    )}>
      <text x="200" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'x² − 5x + 6 = 0'}</text>
      <g className="g8-seat" style={{ '--d': '600ms' }}>
        <text x="120" y="56" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.ok}>{'x1 + x2 = 5'}</text>
        <text x="280" y="56" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.ok}>{'x1 · x2 = 6'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <text x="200" y="80" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
          fill={T.graph}>{'x1 = 2,  x2 = 3'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('YECHMASDAN AYTISH', 'СКАЗАТЬ, НЕ РЕШАЯ', 'TELLING WITHOUT SOLVING'),
  title: L(
    "Ildizlarni yechmasdan yig'indi va ko'paytmasini aytish mumkinmi",
    'Можно ли назвать сумму и произведение корней, не решая уравнение',
    'Can we name the sum and product of the roots without solving',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Tenglama berilgan, lekin uning ildizlari hali yozilmagan.",
      'Уравнение дано, но его корни ещё не записаны.',
      'The equation is given, but its roots are not yet written.'),
    A('why',
      "Taxmin qiling, ildizlarni yechmasdan ularning yig'indisi va ko'paytmasini aytish mumkinmi.",
      'Предположи, можно ли назвать сумму и произведение корней, не решая уравнение.',
      'Predict whether we can name the sum and product of the roots without solving.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, bu mumkinmi?",
      'Как думаешь, это возможно?',
      'Do you think this is possible?',
    ),
    items: [
      { id: 'yes', show: L('Ha, mumkin', 'Да, возможно', 'Yes, it is possible') },
      { id: 'no', show: L('Yo\'q, avval yechish kerak', 'Нет, сначала нужно решить', 'No, we must solve it first') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Har qanday kvadrat tenglama a ga bo'lib keltirilgan
// shaklga o'tkaziladi. Shu tayanch 4, 6 va 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Keltirilgan shaklga o'tkazish",
    'Приведение к нужному виду',
    'Reducing to the right form',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida keltirish to'g'ri.",
      'Четыре записи. Только в одной приведение верно.',
      'Four records. Only one has the reduction done correctly.'),
    A('why',
      "Ikkala tomon bosh koeffitsiyentga bo'linadi.",
      'Обе части делятся на старший коэффициент.',
      'Both sides are divided by the leading coefficient.'),
  ],
  props: {
    ask: L(
      "2x² + 6x − 8 = 0 qaysi shaklga to'g'ri keltirilgan?",
      'К какому виду 2x² + 6x − 8 = 0 приведено верно?',
      'Which form correctly reduces 2x² + 6x − 8 = 0?',
    ),
    items: [
      { id: 'right', show: 'x² + 3x − 4 = 0', right: true, name: L("ikkiga bo'lindi", 'разделено на два', 'divided by two') },
      {
        id: 'onlyFirst', show: 'x² + 6x − 8 = 0',
        hint: L("Faqat birinchi had ikkiga bo'lindi, qolganlari ham bo'linishi kerak.", 'На два разделён только первый член, остальные тоже должны делиться.', 'Only the first term was divided by two; the others must be too.'),
      },
      {
        id: 'signLost', show: 'x² + 3x + 4 = 0',
        hint: L("Ozod hadning ishorasi manfiy, u yo'qolib qolmasin.", 'Знак свободного члена отрицательный, он не должен пропасть.', 'The constant term is negative; its sign must not be lost.'),
      },
      {
        id: 'wrongDiv', show: 'x² + 12x − 16 = 0',
        hint: L("Bo'lish o'rniga ko'paytirilgan, teskari amal bajarilgan.", 'Вместо деления выполнено умножение, действие сделано в обратную сторону.', 'Multiplication was done instead of division, the wrong direction.'),
      },
    ],
    after: L(
      "To'g'ri. Har had ikkiga bo'lindi, ishoralar saqlandi.",
      'Верно. Каждый член разделён на два, знаки сохранены.',
      'Correct. Every term was divided by two, and the signs were kept.',
    ),
  },
}

// ============================================================
// EKRAN 3. X1 NI BURANG (1-darsning `steppers`). x² + px − 12 = 0 da
// x1 berilgan, x2 ko'paytmadan topiladi. x1 nolga tushganda qiymat
// yo'qoladi (З46).
// ============================================================
const S3 = {
  eyebrow: L('X1 NI BURANG', 'КРУТИ X1', 'TURN X1'),
  title: L(
    "Ko'paytmadan ikkinchi ildizni topish",
    'Найти второй корень через произведение',
    'Finding the second root from the product',
  ),
  audio: [
    A('mount',
      "x kvadrat plyus px minus 12 teng nol uchun ko'paytma minus o'n ikkiga teng. x2 minus o'n ikki bo'lingan x1 ga teng.",
      'Для x квадрат плюс px минус двенадцать равно нулю произведение равно минус двенадцати. x2 равен минус двенадцати, делённому на x1.',
      'For x squared plus p x minus twelve equals zero, the product equals negative twelve. x2 equals negative twelve divided by x1.'),
    A('why',
      "Uch maqsad beriladi. x1 ning turli qiymatlarida x2 ni toping.",
      'Даны три цели. Находи x2 при разных значениях x1.',
      'Three targets are given. Find x2 at different values of x1.'),
    A('why',
      "Oxirida x1 ni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти x1 до нуля и посмотри, что будет.',
      'At the end bring x1 down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'x1', label: L('x1 ning qiymati', 'значение x1', 'the value of x1'),
        start: 6, min: 0, max: 12, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : Math.round((-12 / v[0]) * 100) / 100),
    resultLabel: L('x2', 'x2', 'x2'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "x1 hali nolga tushmasin, avval maqsadlarni oling.",
      'x1 пока не опускай до нуля, сначала возьми цели.',
      'Do not bring x1 to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: -3,
        ask: L("x2 minus 3 ga teng bo'lsin", 'Пусть x2 будет равен минус 3', 'Make x2 equal negative 3'),
        after: L(
          "Minus uch. x1 to'rtga teng bo'lganda minus o'n ikki to'rtga bo'linib minus uch chiqadi.",
          'Минус три. При x1 равном четырём минус двенадцать делится на четыре и выходит минус три.',
          'Negative three. With x1 equal to four, negative twelve divided by four gives negative three.',
        ),
      },
      {
        value: -4,
        ask: L("Endi x2 minus 4 ga teng bo'lsin", 'Теперь пусть x2 будет равен минус 4', 'Now make x2 equal negative 4'),
        after: L(
          "Minus to'rt. x1 uchga teng bo'lganda minus o'n ikki uchga bo'linib minus to'rt chiqadi.",
          'Минус четыре. При x1 равном трём минус двенадцать делится на три и выходит минус четыре.',
          'Negative four. With x1 equal to three, negative twelve divided by three gives negative four.',
        ),
      },
      {
        value: -6,
        ask: L("Oxirgisi, x2 minus 6 ga teng bo'lsin", 'Последняя, пусть x2 будет равен минус 6', 'The last one, make x2 equal negative 6'),
        after: L(
          "Minus olti. x1 ikkiga teng bo'lganda minus o'n ikki ikkiga bo'linib minus olti chiqadi.",
          'Минус шесть. При x1 равном двум минус двенадцать делится на два и выходит минус шесть.',
          'Negative six. With x1 equal to two, negative twelve divided by two gives negative six.',
        ),
      },
    ],
    ask: L("x2 minus 3 ga teng bo'lsin", 'Пусть x2 будет равен минус 3', 'Make x2 equal negative 3'),
    ask2: L("Endi x1 ni nolga tushiring", 'Теперь опусти x1 до нуля', 'Now bring x1 down to zero'),
    broke: L(
      "x1 nolga teng bo'lsa, minus o'n ikkini nolga bo'lish kerak bo'lardi, bo'linish yo'q. Demak x1 nol bo'lganda bu usul ishlamaydi.",
      'Если x1 равно нулю, минус двенадцать пришлось бы делить на нуль, а деления не существует. Значит при x1 равном нулю этот способ не работает.',
      'If x1 equals zero, negative twelve would have to be divided by zero, which has no value. So when x1 is zero, this method does not work.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI YOZUV TO'G'RI (1-darsning `pick`): ildizlardan p, q
// topish. Ловушка — p ning ishorasi.
// ============================================================
const S4 = {
  eyebrow: L('P, Q NI TOPAMIZ', 'НАХОДИМ P, Q', 'FINDING P, Q'),
  title: L(
    "Ildizlari 3 va 4 bo'lgan tenglama uchun p, q",
    'p, q для уравнения с корнями 3 и 4',
    'p, q for the equation with roots 3 and 4',
  ),
  audio: [
    A('mount',
      "Ildizlar berilgan. Yig'indi minus p ga, ko'paytma q ga teng.",
      'Корни даны. Сумма равна минус p, произведение равно q.',
      'The roots are given. The sum equals negative p, the product equals q.'),
    A('why',
      "Yig'indini toping, keyin uni minus bilan p ga aylantiring.",
      'Найди сумму, потом переведи её в p со сменой знака.',
      'Find the sum, then turn it into p by flipping the sign.'),
  ],
  props: {
    ask: L(
      "p, q qaysi to'g'ri?",
      'Какие p, q верны?',
      'Which p, q are correct?',
    ),
    items: [
      { id: 'right', show: 'p = −7,  q = 12', right: true },
      {
        id: 'signP', show: 'p = 7,  q = 12',
        hint: L("Yig'indi yetti, lekin p unga qarama-qarshi son, ya'ni minus yetti.", 'Сумма семь, а p ей противоположно, то есть минус семь.', 'The sum is seven, but p is its opposite, that is negative seven.'),
      },
      {
        id: 'swap', show: 'p = −12,  q = 7',
        hint: L("p va q almashtirilgan. p yig'indiga, q ko'paytmaga bog'liq.", 'p и q поменяны местами. p связан с суммой, q с произведением.', 'p and q are swapped. p relates to the sum, q to the product.'),
      },
      {
        id: 'signQ', show: 'p = −7,  q = −12',
        hint: L("Ko'paytma ishorasiz to'g'ridan-to'g'ri q, u manfiy bo'lmaydi.", 'Произведение прямо равно q без смены знака, оно не отрицательно.', 'The product equals q directly, with no sign change, and it is not negative.'),
      },
    ],
    after: L(
      "To'g'ri. Yig'indi yetti, p esa unga qarama-qarshi, minus yetti. Ko'paytma o'n ikki, q ham o'n ikki.",
      'Верно. Сумма семь, а p ей противоположно, минус семь. Произведение двенадцать, и q тоже двенадцать.',
      'Correct. The sum is seven, and p is its opposite, negative seven. The product is twelve, and q is twelve too.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — TANLASH USULI (`factorpair`). Darslik
// 4-masalasi: x² − 5x + 6 = 0.
// ============================================================
const S5 = {
  eyebrow: L('TANLASH USULI', 'СПОСОБ ПОДБОРА', 'THE SELECTION METHOD'),
  title: L(
    "X kvadrat minus 5x plyus 6 teng nolning ildizlarini toping",
    'Найди корни x квадрат минус пять икс плюс шесть равно нулю',
    'Find the roots of x squared minus five x plus six equals zero',
  ),
  audio: [
    A('mount',
      "Yig'indisi besh, ko'paytmasi olti bo'lgan ikki sonni toping.",
      'Найди два числа, сумма которых пять, а произведение шесть.',
      'Find two numbers whose sum is five and product is six.'),
    A('why',
      "Ikkita katakka son qo'yib, tekshiring.",
      'Поставь числа в две ячейки и проверь.',
      'Put numbers into the two cells and check.'),
  ],
  props: {
    target: { sum: 5, product: 6 },
    cellLabels: ['x1', 'x2'],
    ask: L(
      "Yig'indisi besh, ko'paytmasi olti bo'lgan ikki son",
      'Два числа с суммой пять и произведением шесть',
      'Two numbers with sum five and product six',
    ),
    hintSumOff: L(
      "Yig'indi mos kelmadi. Ikkita sonni qo'shib besh chiqishini tekshiring.",
      'Сумма не совпала. Проверь, что при сложении двух чисел выходит пять.',
      'The sum did not match. Check that adding the two numbers gives five.',
    ),
    hintProductOff: L(
      "Ko'paytma mos kelmadi. Yig'indi to'g'ri, lekin ko'paytirib olti chiqishini tekshiring.",
      'Произведение не совпало. Сумма верна, но проверь, что при умножении выходит шесть.',
      'The product did not match. The sum is right, but check that multiplying gives six.',
    ),
    hintBothOff: L(
      "Ikkalasi ham mos kelmadi. Kichik sonlardan boshlab sinab ko'ring.",
      'Не совпало ни то, ни другое. Попробуй начать с небольших чисел.',
      'Neither matched. Try starting from small numbers.',
    ),
    after: L(
      "Ikki va uch. Ular birlashib besh, ko'paytirilib olti beradi.",
      'Два и три. В сумме дают пять, в произведении шесть.',
      'Two and three. They add to five and multiply to six.',
    ),
    note: L(
      "Bu tenglama yechilmadi, ildizlar TANLAB topildi",
      'Уравнение не решалось, корни найдены ПОДБОРОМ',
      'The equation was not solved, the roots were found by SELECTION',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): ildizlarni ikki yo'l bilan
// topish — tanlash yoki formula.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Ildizlarni ikki yo'l bilan topish",
    'Найти корни двумя способами',
    'Finding the roots two ways',
  ),
  audio: [
    A('mount',
      "Bitta tenglama va ikki yo'l. Ikkalasi ham bir xil javob beradi.",
      'Одно уравнение и два пути. Оба дают один ответ.',
      'One equation and two ways. Both give the same answer.'),
    W('w2',
      "Birinchi yo'lda yig'indi va ko'paytmaga mos ikki son tanlanadi.",
      'В первом пути подбираются два числа, подходящие сумме и произведению.',
      'In the first way, two numbers matching the sum and product are picked.'),
    W('w4',
      "Ikkinchi yo'lda D hisoblanib, formula qo'llaniladi.",
      'Во втором пути считается D и применяется формула.',
      'In the second way, D is computed and the formula is applied.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L("1-USUL — TANLASH", 'СПОСОБ 1 — ПОДБОР', 'METHOD 1 — SELECTION'),
        lead: L(
          "Yig'indisi besh, ko'paytmasi olti bo'lgan sonlar",
          'Числа с суммой пять и произведением шесть',
          'Numbers with sum five and product six',
        ),
        rows: [
          { text: '2 + 3 = 5,   2 · 3 = 6' },
          { text: 'x1 = 2,  x2 = 3', tone: 'ok' },
        ],
      },
      {
        name: L("2-USUL — FORMULA", 'СПОСОБ 2 — ФОРМУЛА', 'METHOD 2 — THE FORMULA'),
        lead: L(
          "D hisoblanadi, keyin formulaga qo'yiladi",
          'Считается D, потом подставляется в формулу',
          'D is computed, then plugged into the formula',
        ),
        rows: [
          { text: 'D = 25 − 24 = 1' },
          { text: 'x = (5 ± 1) / 2', tone: 'ok' },
          { text: 'x1 = 2,  x2 = 3', tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Tanlash usuli tezroq, sonlar chiroyli bo'lganda",
          'Способ подбора быстрее, когда числа удобные',
          'The selection method is faster when the numbers are nice',
        ),
        rows: [{ text: 'x1 = 2,  x2 = 3', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): Viyet teoremasidan
// ko'paytuvchilarga ajratish qanday chiqadi.
// ============================================================
const S7 = {
  eyebrow: L('KO\'PAYTUVCHILARGA AJRATISH', 'РАЗЛОЖЕНИЕ НА МНОЖИТЕЛИ', 'FACTORING'),
  title: L(
    "Viyet teoremasi ko'paytuvchilarni qanday beradi",
    'Как теорема Виета даёт множители',
    'How Vieta\'s theorem gives the factors',
  ),
  audio: [
    A('mount',
      "x1 va x2 ildiz bo'lsa, x kvadrat plyus px plyus q ikki qavsning ko'paytmasi sifatida yoziladi.",
      'Если x1 и x2 корни, то x квадрат плюс px плюс q записывается как произведение двух скобок.',
      'If x1 and x2 are roots, x squared plus p x plus q is written as a product of two brackets.'),
    W('p2',
      "Har bir qavs iksdan tegishli ildizni ayirgan holda yoziladi.",
      'Каждая скобка содержит икс минус соответствующий корень.',
      'Each bracket holds x minus the matching root.'),
    W('p4',
      "Qavslarni ochib ko'rsak, ikki ildizning yig'indisi va ko'paytmasi qaytadan chiqadi.",
      'Раскрыв скобки, снова получаем сумму и произведение двух корней.',
      'Expanding the brackets brings back the sum and product of the two roots.',
    ),
  ],
  props: {
    tokens: [
      { t: 'x² + px + q', id: 'left' },
      { t: ' = ', id: 'eq' },
      { t: '(x − x1)', id: 'f1' },
      { t: '(x − x2)', id: 'f2' },
    ],
    steps: [
      {
        focus: 'left',
        text: L(
          "Birinchi qadam. x1 va x2 ildiz bo'lsa, chap qism shu ikki ildizga bog'liq.",
          'Первый шаг. Если x1 и x2 корни, левая часть связана именно с этими двумя корнями.',
          'Step one. If x1 and x2 are roots, the left side is tied to exactly these two roots.',
        ),
      },
      {
        focus: 'f1',
        text: L(
          "Ikkinchi qadam. Har bir qavs bitta ildizni «yo'q qiladi»: x ildizga teng bo'lganda qavs nolga aylanadi.",
          'Второй шаг. Каждая скобка «убирает» один корень: при x равном корню скобка обращается в нуль.',
          'Step two. Each bracket "removes" one root: when x equals that root, the bracket becomes zero.',
        ),
      },
      {
        focus: 'f2',
        text: L(
          "Uchinchi qadam. Qavslarni ochsak, o'rtadagi had aynan ikki ildizning yig'indisi, oxirgisi ko'paytmasi bo'lib chiqadi.",
          'Третий шаг. Раскрыв скобки, средний член оказывается суммой двух корней, а последний — их произведением.',
          'Step three. Expanding the brackets, the middle term turns out to be the sum of the two roots, and the last term their product.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Fransuz matematigi Fransua Viyet o'n oltinchi asrda tenglama koeffitsiyentlari va ildizlari orasidagi shu bog'lanishni birinchilardan bo'lib umumiy ko'rinishda yozgan.",
        'Французский математик Франсуа Виет в шестнадцатом веке одним из первых записал эту связь между коэффициентами и корнями уравнения в общем виде.',
        'The French mathematician François Viète, in the sixteenth century, was among the first to write this link between an equation\'s coefficients and roots in general form.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 25-§, 149-150-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Viyet teoremasi",
    'Теорема Виета',
    "Vieta's theorem",
  ),
  audio: [
    A('mount',
      "Teorema uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для теоремы, ты уже видел. Теперь собери её.',
      'Everything the theorem needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik teoremasi ochildi, va xukdagi savolga javob keldi.",
      'Открылась теорема из учебника, и вопрос с хука получил ответ.',
      'The textbook theorem opened, and the question from the hook got its answer.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("x kvadrat plyus px plyus q teng nol tenglamaning ildizlari", 'Если x1 и x2 корни уравнения x квадрат плюс px плюс q равно нулю', 'If x1 and x2 are roots of x squared plus p x plus q equals zero') },
      { id: 'f2', label: L("x1 va x2 bo'lsa, x1 plyus x2 minus p ga teng", 'то x1 плюс x2 равно минус p', 'then x1 plus x2 equals negative p') },
      { id: 'f3', label: L("va x1 karra x2 q ga teng", 'а x1 умножить на x2 равно q', 'and x1 times x2 equals q') },
      { id: 'f4', label: L("bu ikkala munosabat teng ildizlarda ham to'g'ri", 'оба соотношения верны и при равных корнях', 'both relations hold even for equal roots') },
      { id: 'w1', label: L("x1 plyus x2 p ning o'ziga teng", 'x1 плюс x2 равно самому p', 'x1 plus x2 equals p itself') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Yig'indi p ning o'ziga emas, unga qarama-qarshi songa teng.",
      'Так не складывается. Сумма равна не самому p, а числу, противоположному ему.',
      'That does not fit. The sum equals not p itself, but its opposite.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 25-§, 149–150-bet",
        'Учебник, § 25, стр. 149–150',
        'Textbook, section 25, pages 149–150',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "ildizlarni yechmasdan yig'indi va ko'paytmasini aytish mumkinmi degan savol edi",
        'вопрос был, можно ли назвать сумму и произведение, не решая',
        'the question was whether we can name the sum and product without solving',
      ),
      right: L(
        "mumkin ekan: yig'indi besh, ko'paytma olti, koeffitsiyentlardan to'g'ridan-to'g'ri",
        'оказалось можно: сумма пять, произведение шесть, прямо из коэффициентов',
        'it turns out we can: sum five, product six, straight from the coefficients',
      ),
      winner: 'right',
      note: L(
        "Ildizlarning o'zini bilish shart emas",
        'Знать сами корни не обязательно',
        'Knowing the roots themselves is not required',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): ildizlardan p, q tuzing.
// ============================================================
const ASK_PQ = L('p, q qanday?', 'Каковы p, q?', 'What are p, q?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ildizlardan tenglama tuzing",
    'Составь уравнение по корням',
    'Build the equation from its roots',
  ),
  audio: [
    A('mount',
      "Besh juft ildiz. Har biridan p, q ni toping.",
      'Пять пар корней. В каждой найди p, q.',
      'Five root pairs. In each, find p, q.'),
    A('why',
      "Yig'indini toping va uni ishorasini almashtirib p ga aylantiring.",
      'Найди сумму и переведи её в p со сменой знака.',
      'Find the sum and turn it into p by flipping the sign.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar yig'indi ishorasini almashtirib p ga aylandi.",
      'Все пять разобраны. Каждый раз сумма меняла знак и становилась p.',
      'All five are done. Each time the sum flipped sign to become p.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x1 = 3,  x2 = 4'}</Row>,
        ok: L("Ha. Yig'indi yetti, p minus yetti. Ko'paytma o'n ikki, q o'n ikki.", 'Да. Сумма семь, p минус семь. Произведение двенадцать, q двенадцать.', 'Yes. The sum is seven, p is negative seven. The product is twelve, q is twelve.'),
        question: ASK_PQ,
        items: [
          { id: 'a', right: true, label: 'p = −7,  q = 12' },
          { id: 'b', label: 'p = 7,  q = 12', hint: L("p yig'indiga qarama-qarshi, ishorasini almashtiring.", 'p противоположен сумме, смени знак.', 'p is the opposite of the sum, flip the sign.') },
        ],
        solution: ['x1 + x2 = 7', 'p = −7,  q = 12'],
      },
      {
        expr: <Row size="big" align="center">{'x1 = 5,  x2 = 2'}</Row>,
        ok: L("Ha. Yig'indi yetti, p minus yetti. Ko'paytma o'n, q o'n.", 'Да. Сумма семь, p минус семь. Произведение десять, q десять.', 'Yes. The sum is seven, p is negative seven. The product is ten, q is ten.'),
        question: ASK_PQ,
        items: [
          { id: 'a', right: true, label: 'p = −7,  q = 10' },
          { id: 'b', label: 'p = 7,  q = 10', hint: L("p yig'indiga qarama-qarshi.", 'p противоположен сумме.', 'p is the opposite of the sum.') },
        ],
        solution: ['x1 + x2 = 7', 'p = −7,  q = 10'],
      },
      {
        expr: <Row size="big" align="center">{'x1 = −2,  x2 = 6'}</Row>,
        ok: L("Ha. Yig'indi to'rt, p minus to'rt. Ko'paytma minus o'n ikki, q minus o'n ikki.", 'Да. Сумма четыре, p минус четыре. Произведение минус двенадцать, q минус двенадцать.', 'Yes. The sum is four, p is negative four. The product is negative twelve, q is negative twelve.'),
        question: ASK_PQ,
        items: [
          { id: 'a', right: true, label: 'p = −4,  q = −12' },
          { id: 'b', label: 'p = 4,  q = −12', hint: L("p yig'indiga qarama-qarshi, ishorasini almashtiring.", 'p противоположен сумме, смени знак.', 'p is the opposite of the sum, flip the sign.') },
        ],
        solution: ['x1 + x2 = 4', 'p = −4,  q = −12'],
      },
      {
        expr: <Row size="big" align="center">{'x1 = −3,  x2 = −5'}</Row>,
        ok: L("Ha. Yig'indi minus sakkiz, p sakkiz. Ko'paytma o'n besh, q o'n besh.", 'Да. Сумма минус восемь, p восемь. Произведение пятнадцать, q пятнадцать.', 'Yes. The sum is negative eight, p is eight. The product is fifteen, q is fifteen.'),
        question: ASK_PQ,
        items: [
          { id: 'a', right: true, label: 'p = 8,  q = 15' },
          { id: 'b', label: 'p = −8,  q = 15', hint: L("Yig'indi minus sakkiz, p unga qarama-qarshi, ya'ni musbat sakkiz.", 'Сумма минус восемь, p ей противоположно, то есть положительная восемь.', 'The sum is negative eight, p is its opposite, that is positive eight.') },
        ],
        solution: ['x1 + x2 = −8', 'p = 8,  q = 15'],
      },
      {
        expr: <Row size="big" align="center">{'x1 = 1,  x2 = −8'}</Row>,
        ok: L("Ha. Yig'indi minus yetti, p yetti. Ko'paytma minus sakkiz, q minus sakkiz.", 'Да. Сумма минус семь, p семь. Произведение минус восемь, q минус восемь.', 'Yes. The sum is negative seven, p is seven. The product is negative eight, q is negative eight.'),
        question: ASK_PQ,
        items: [
          { id: 'a', right: true, label: 'p = 7,  q = −8' },
          { id: 'b', label: 'p = −7,  q = −8', hint: L("Yig'indi minus yetti, p unga qarama-qarshi, ya'ni musbat yetti.", 'Сумма минус семь, p ей противоположно, то есть положительная семь.', 'The sum is negative seven, p is its opposite, that is positive seven.') },
        ],
        solution: ['x1 + x2 = −7', 'p = 7,  q = −8'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): bitta ildiz va tenglamadan
// ikkinchi ildizni toping.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ikkinchi ildizni toping",
    'Найди второй корень',
    'Find the second root',
  ),
  audio: [
    A('mount',
      "Uch tenglama. Har birida bitta ildiz berilgan.",
      'Три уравнения. В каждом дан один корень.',
      'Three equations. In each, one root is given.'),
    A('why',
      "Yig'indi yoki ko'paytmadan foydalanib ikkinchisini toping.",
      'Найди второй, используя сумму или произведение.',
      'Find the second one using the sum or the product.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar yig'indi orqali ikkinchi ildiz topildi.",
      'Все три разобраны. Каждый раз второй корень находился через сумму.',
      'All three are done. Each time the second root was found via the sum.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² − x − 12 = 0,   x1 = 4'}</Row>,
        ok: L("Ha. Yig'indi bir, to'rtdan ayirsak minus uch chiqadi.", 'Да. Сумма один, отняв четыре получаем минус три.', 'Yes. The sum is one; subtracting four gives negative three.'),
        question: L('x2 qanday?', 'Каков x2?', 'What is x2?'),
        items: [
          { id: 'a', right: true, label: 'x2 = −3' },
          { id: 'b', label: 'x2 = 3', hint: L("Yig'indi bir, to'rt plyus uch to'rt emas, yetti bo'lardi.", 'Сумма один, четыре плюс три было бы семь, а не один.', 'The sum is one; four plus three would be seven, not one.') },
        ],
        solution: ['x1 + x2 = 1', 'x2 = 1 − 4 = −3'],
      },
      {
        expr: <Row size="big" align="center">{'x² + 7x + 10 = 0,   x1 = −5'}</Row>,
        ok: L("Ha. Yig'indi minus yetti, minus beshdan ayirsak minus ikki chiqadi.", 'Да. Сумма минус семь, отняв минус пять получаем минус два.', 'Yes. The sum is negative seven; subtracting negative five gives negative two.'),
        question: L('x2 qanday?', 'Каков x2?', 'What is x2?'),
        items: [
          { id: 'a', right: true, label: 'x2 = −2' },
          { id: 'b', label: 'x2 = −12', hint: L("Yig'indi minus yetti, minus besh plyus minus o'n ikki minus o'n yetti bo'lardi.", 'Сумма минус семь, минус пять плюс минус двенадцать было бы минус семнадцать.', 'The sum is negative seven; negative five plus negative twelve would be negative seventeen.') },
        ],
        solution: ['x1 + x2 = −7', 'x2 = −7 − (−5) = −2'],
      },
      {
        expr: <Row size="big" align="center">{'x² − 9x + 18 = 0,   x1 = 6'}</Row>,
        ok: L("Ha. Yig'indi to'qqiz, oltidan ayirsak uch chiqadi.", 'Да. Сумма девять, отняв шесть получаем три.', 'Yes. The sum is nine; subtracting six gives three.'),
        question: L('x2 qanday?', 'Каков x2?', 'What is x2?'),
        items: [
          { id: 'a', right: true, label: 'x2 = 3' },
          { id: 'b', label: 'x2 = 12', hint: L("Yig'indi to'qqiz, olti plyus o'n ikki o'n sakkiz bo'lardi.", 'Сумма девять, шесть плюс двенадцать было бы восемнадцать.', 'The sum is nine; six plus twelve would be eighteen.') },
        ],
        solution: ['x1 + x2 = 9', 'x2 = 9 − 6 = 3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): taklif qilingan
// juftlik ikkala munosabatga mos kelishini tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Juftlik ikkala shartga mosmi",
    'Подходит ли пара под оба условия',
    'Does the pair fit both conditions',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Yig'indi va ko'paytmani ikkalasini ham tekshiring.",
      'Три задания. Проверь и сумму, и произведение.',
      'Three tasks. Check both the sum and the product.'),
    A('why',
      "Faqat bittasi mos kelsa yetarli emas, ikkalasi ham to'g'ri bo'lishi kerak.",
      'Совпадения только одного недостаточно, верными должны быть оба.',
      'Matching only one is not enough, both must be correct.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Ikkala shart tekshirilgandan keyingina javob aniqlandi.",
      'Все три разобраны. Ответ определялся только после проверки обоих условий.',
      'All three are done. The answer was decided only after checking both conditions.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² − 5x + 6 = 0,   x1 = 2,  x2 = 3'}</Row>,
        ok: L("Ha. Ikki plyus uch besh, ikki karra uch olti.", 'Да. Два плюс три пять, два умножить на три шесть.', 'Yes. Two plus three is five, two times three is six.'),
        question: L("Bu juftlik mos keladimi?", 'Подходит ли эта пара?', 'Does this pair fit?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikkalasini ham qo'shib va ko'paytirib tekshiring.", 'Проверь, сложив и умножив оба числа.', 'Check by both adding and multiplying the two numbers.') },
        ],
        solution: ['2 + 3 = 5', '2 · 3 = 6'],
      },
      {
        expr: <Row size="big" align="center">{'x² + x − 6 = 0,   x1 = 2,  x2 = −3'}</Row>,
        ok: L("Ha. Ikki plyus minus uch minus bir, ikki karra minus uch minus olti.", 'Да. Два плюс минус три минус один, два умножить на минус три минус шесть.', 'Yes. Two plus negative three is negative one, two times negative three is negative six.'),
        question: L("Bu juftlik mos keladimi?", 'Подходит ли эта пара?', 'Does this pair fit?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Yig'indi minus birga, ko'paytma minus oltiga teng bo'lishi kerak.", 'Сумма должна быть минус один, произведение минус шесть.', 'The sum must be negative one, the product negative six.') },
        ],
        solution: ['2 + (−3) = −1', '2 · (−3) = −6'],
      },
      {
        expr: <Row size="big" align="center">{'x² − 4x + 3 = 0,   x1 = 1,  x2 = 1'}</Row>,
        ok: L("Yo'q. Yig'indi ikki bo'lishi kerak edi, bu yerda ham ko'paytma uchga teng emas.", 'Нет. Сумма должна быть равна четырём, и произведение тоже не равно трём.', 'No. The sum should equal four, and the product does not equal three either.'),
        question: L("Bu juftlik mos keladimi?", 'Подходит ли эта пара?', 'Does this pair fit?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Bir plyus bir ikki, lekin yig'indi to'rt bo'lishi kerak edi.", 'Один плюс один два, а сумма должна быть четыре.', 'One plus one is two, but the sum should be four.') },
        ],
        solution: ['1 + 1 = 2 ≠ 4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): yig'indiga p ning o'zi
// qo'yilgan, ishora almashtirilmagan (З45).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Yig'indining ishorasi",
    'Знак суммы',
    'The sign of the sum',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham yig'indiga p ning o'zi qo'yilgan.",
      'Два задания. В обоих в сумму подставлен сам p, без смены знака.',
      'Two tasks. In both, p itself was used for the sum, without flipping the sign.'),
    A('why',
      "Yig'indi p ga emas, unga qarama-qarshi songa teng.",
      'Сумма равна не p, а числу, противоположному ему.',
      'The sum equals not p, but its opposite.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Yig'indi har safar p ga qarama-qarshi chiqdi.",
      'Оба разобраны. Сумма каждый раз оказывалась противоположной p.',
      'Both are done. The sum each time turned out opposite to p.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² + 6x + 8 = 0'}</Row>,
        ok: L("Ha. p olti, yig'indi esa unga qarama-qarshi, minus olti.", 'Да. p шесть, а сумма противоположна ему, минус шесть.', 'Yes. p is six, and the sum is its opposite, negative six.'),
        question: L("To'g'ri ildizlar qaysi juftlik?", 'Какая пара корней верна?', 'Which pair of roots is correct?'),
        items: [
          { id: 'a', right: true, label: 'x1 = −2,  x2 = −4' },
          { id: 'b', label: 'x1 = 2,  x2 = 4', hint: L("Bu ko'rsatilgan xato taxminning o'zi, yig'indi olti emas, minus olti.", 'Это и есть показанное ошибочное предположение, сумма не шесть, а минус шесть.', 'This is the very mistaken assumption shown, the sum is not six, but negative six.') },
          { id: 'c', label: 'x1 = −1,  x2 = −8', hint: L("Ko'paytma sakkiz to'g'ri, lekin yig'indi minus olti bo'lishi kerak edi.", 'Произведение восемь верно, но сумма должна быть минус шесть.', 'The product eight is right, but the sum should be negative six.') },
        ],
        solution: [L("yig'indi = −p = −6", 'сумма = −p = −6', 'sum = −p = −6'), 'x1 = −2,  x2 = −4'],
      },
      {
        expr: <Row size="big" align="center">{'x² + 2x − 15 = 0'}</Row>,
        ok: L("Ha. p ikki, yig'indi esa unga qarama-qarshi, minus ikki.", 'Да. p два, а сумма противоположна ему, минус два.', 'Yes. p is two, and the sum is its opposite, negative two.'),
        question: L("To'g'ri ildizlar qaysi juftlik?", 'Какая пара корней верна?', 'Which pair of roots is correct?'),
        items: [
          { id: 'a', right: true, label: 'x1 = 3,  x2 = −5' },
          { id: 'b', label: 'x1 = −3,  x2 = 5', hint: L("Bu ko'rsatilgan xato taxminning o'zi, yig'indi ikki emas, minus ikki.", 'Это и есть показанное ошибочное предположение, сумма не два, а минус два.', 'This is the very mistaken assumption shown, the sum is not two, but negative two.') },
          { id: 'c', label: 'x1 = 5,  x2 = 3', hint: L("Ko'paytma o'n besh bo'lardi, minus o'n besh emas.", 'Произведение было бы пятнадцать, а не минус пятнадцать.', 'The product would be fifteen, not negative fifteen.') },
        ],
        solution: [L("yig'indi = −p = −2", 'сумма = −p = −2', 'sum = −p = −2'), 'x1 = 3,  x2 = −5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill`): ko'paytma
// ishorasidan ikkinchi ildizning ishorasini aniqlash.
// ============================================================
const S13 = {
  eyebrow: L('ISHORANI ANIQLASH', 'ОПРЕДЕЛЕНИЕ ЗНАКА', 'DETERMINING THE SIGN'),
  title: L(
    "Yechmasdan ishorasini aniqlang",
    'Определи знак, не решая',
    'Determine the sign without solving',
  ),
  audio: [
    A('mount',
      "Bir ildizning ishorasi berilgan. Ko'paytmaga qarab ikkinchisining ishorasini aytamiz.",
      'Дан знак одного корня. По произведению называем знак второго.',
      'The sign of one root is given. From the product we tell the sign of the other.'),
    A('why',
      "Ko'paytma manfiy bo'lsa, ildizlar qarama-qarshi ishorali.",
      'Если произведение отрицательно, корни разного знака.',
      'If the product is negative, the roots have opposite signs.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar q ning ishorasi ikkinchi ildizning ishorasini aytib berdi.",
      'Все три заполнены. Каждый раз знак q называл знак второго корня.',
      'All three are filled. Each time the sign of q told the sign of the second root.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['-10', 'manfiy'],
      lines: [
        [{ t: 'x² + 3x − 10 = 0,   x1 musbat   →   q = ' }, { slot: '-10' }],
        [{ t: 'x1 musbat, demak x2 ' }, { slot: 'manfiy' }],
      ],
    },
    tasks: [
      {
        chips: ['12', 'musbat'],
        lines: [
          [{ t: 'x² − 7x + 12 = 0,   x1 musbat   →   q = ' }, { slot: '12' }],
          [{ t: 'ko\'paytma musbat, demak x2 ' }, { slot: 'musbat' }],
        ],
      },
      {
        chips: ['12', 'manfiy'],
        lines: [
          [{ t: 'x² + 8x + 12 = 0,   x1 manfiy   →   q = ' }, { slot: '12' }],
          [{ t: 'ko\'paytma musbat, demak x2 ' }, { slot: 'manfiy' }],
        ],
      },
      {
        chips: ['-20', 'manfiy'],
        lines: [
          [{ t: 'x² − x − 20 = 0,   x1 musbat   →   q = ' }, { slot: '-20' }],
          [{ t: 'ko\'paytma manfiy, demak x2 ' }, { slot: 'manfiy' }],
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS (to'rt savol va beshinchisi SBORKA).
// ============================================================
const S14 = {
  eyebrow: UI.blitzEyebrow,
  title: L(
    "Viyet teoremasi bo'yicha to'rt savol",
    'Четыре вопроса по теореме Виета',
    "Four questions about Vieta's theorem",
  ),
  audio: [
    A('mount',
      "To'rt savol va oxirida yozuvni yig'ish.",
      'Четыре вопроса и в конце сборка записи.',
      'Four questions and an assembly at the end.'),
    A('why',
      "Har javobdan keyin izoh chiqadi.",
      'После каждого ответа выходит разбор.',
      'After each answer an explanation appears.'),
  ],
  props: {
    lead: UI.blitzLead,
    items: [
      {
        id: 'q1', tag: 'З45',
        ask: L("x² + 9x + 14 = 0 tenglamada ildizlarning yig'indisi qanday?", 'Какова сумма корней уравнения x² + 9x + 14 = 0?', 'What is the sum of the roots of x² + 9x + 14 = 0?'),
        options: [
          { id: 'ok', right: true, label: '−9' },
          { id: 'wrong', label: '9' },
          { id: 'c', label: '14' },
          { id: 'd', label: '−14' },
        ],
        hint: L("p to'qqiz, yig'indi esa unga qarama-qarshi.", 'p девять, а сумма противоположна ему.', 'p is nine, and the sum is its opposite.'),
        ok: L("To'g'ri, yig'indi minus to'qqiz.", 'Верно, сумма минус девять.', 'Correct, the sum is negative nine.'),
      },
      {
        id: 'q2', tag: 'З46',
        ask: L('x² − 10x + 21 = 0 tenglamada x1 = 3. x2 qanday?', 'В уравнении x² − 10x + 21 = 0, x1 = 3. Каков x2?', 'In x² − 10x + 21 = 0, x1 = 3. What is x2?'),
        options: [
          { id: 'ok', right: true, label: '7' },
          { id: 'wrong', label: '3' },
          { id: 'c', label: '21' },
          { id: 'd', label: '−7' },
        ],
        hint: L("Yig'indi o'n, uchdan ayirib qolganini toping.", 'Сумма десять, отними три и найди остаток.', 'The sum is ten, subtract three and find the rest.'),
        ok: L("To'g'ri, o'n minus uch yetti.", 'Верно, десять минус три семь.', 'Correct, ten minus three is seven.'),
      },
      {
        id: 'q3', tag: 'З45',
        ask: L('x² − 5x − 6 = 0 tenglamada ko\'paytma qanday?', 'Каково произведение в уравнении x² − 5x − 6 = 0?', 'What is the product in x² − 5x − 6 = 0?'),
        options: [
          { id: 'ok', right: true, label: '−6' },
          { id: 'wrong', label: '6' },
          { id: 'c', label: '5' },
          { id: 'd', label: '−5' },
        ],
        hint: L("Ko'paytma ishorasiz to'g'ridan-to'g'ri q ga teng.", 'Произведение прямо равно q, без смены знака.', 'The product equals q directly, with no sign change.'),
        ok: L("To'g'ri, ko'paytma minus olti.", 'Верно, произведение минус шесть.', 'Correct, the product is negative six.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('x1 = 6, x2 = 1 son x² − 7x + 6 = 0 tenglamaga mosmi?', 'Подходят ли x1 = 6, x2 = 1 уравнению x² − 7x + 6 = 0?', 'Do x1 = 6, x2 = 1 fit x² − 7x + 6 = 0?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
          { id: 'onlySum', label: L('Faqat yig\'indi mos', 'Только сумма подходит', 'Only the sum fits') },
          { id: 'onlyProd', label: L('Faqat ko\'paytma mos', 'Только произведение подходит', 'Only the product fits') },
        ],
        hint: L("Olti plyus bir va olti karra birni tekshiring.", 'Проверь шесть плюс один и шесть умножить на один.', 'Check six plus one and six times one.'),
        ok: L("To'g'ri, ikkalasi ham mos, yetti va olti.", 'Верно, оба подходят, семь и шесть.', 'Correct, both fit, seven and six.'),
      },
      {
        id: 'q5', tag: 'З46',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "X kvadrat minus 7x plyus 10 teng nolni tanlash usuli bilan yechib, ikkala ildizni yig'ing.",
            'Реши икс квадрат минус семь икс плюс десять равно нулю подбором и собери оба корня.',
            'Solve x squared minus seven x plus ten equals zero by selection and assemble both roots.',
          ),
          lines: [
            [{ t: 'x² − 7x + 10 = 0   →   x1 = ' }, { slot: '2' }, { t: ',   x2 = ' }, { slot: '5' }],
          ],
          tiles: [
            { id: 't1', v: '2', x: 12, y: 12 },
            { id: 't2', v: '5', x: 70, y: 14 },
            { id: 't3', v: '7', x: 40, y: 50 },
            { id: 't4', v: '10', x: 78, y: 48 },
            { id: 't5', v: '−2', x: 14, y: 52 },
          ],
          hint: L(
            "Yig'indisi yetti, ko'paytmasi o'n bo'lgan ikki sonni izlang.",
            'Ищи два числа с суммой семь и произведением десять.',
            'Look for two numbers with sum seven and product ten.',
          ),
          doneNote: L(
            "Yig'ildi. Ikki plyus besh yetti, ikki karra besh o'n.",
            'Собрано. Два плюс пять семь, два умножить на пять десять.',
            'Assembled. Two plus five is seven, two times five is ten.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (1-darsning `takeaway`). Yangi matematika yo'q.
// ============================================================
const S15 = {
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Yig'indi minus p, ko'paytma q",
    'Сумма минус p, произведение q',
    'The sum is negative p, the product is q',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. Iks kvadrat minus 5x plyus 6 teng nolning ildizlari ikki va uch, ular tanlab topildi.",
      'С урока остаётся одна запись. Корни икс квадрат минус пять икс плюс шесть равно нулю равны двум и трём, они найдены подбором.',
      'One record stays with you. The roots of x squared minus five x plus six equals zero are two and three, found by selection.'),
    A('s1',
      "Bugun uch narsa qilindi. Viyet teoremasini ko'rdingiz, ildizlarni tanlab topdingiz va ko'paytuvchilarga ajratishning qayerdan chiqishini bildingiz.",
      'Сегодня сделано три вещи. Ты увидел теорему Виета, находил корни подбором и узнал, откуда берётся разложение на множители.',
      'Three things are done today. You saw Vieta\'s theorem, found roots by selection, and learned where factoring comes from.'),
    A('s2',
      "Keyingi darsda maxrajida iks bo'lgan tenglamalar. ODZ yana muhim bo'ladi.",
      'В следующем уроке уравнения с иксом в знаменателе. ОДЗ снова станет важной.',
      'The next lesson covers equations with x in the denominator. The domain restriction matters again.',
    ),
  ],
  props: {
    mark: 'x1 + x2 = −p,   x1 · x2 = q',
    markNote: L(
      "ikkalasi ham koeffitsiyentlardan to'g'ridan-to'g'ri",
      'оба прямо из коэффициентов',
      'both straight from the coefficients',
    ),
    lines: [
      L(
        "x² + px + q = 0 keltirilgan tenglama",
        'x² + px + q = 0 приведённое уравнение',
        'x² + px + q = 0 is the reduced equation',
      ),
      L(
        "yig'indi minus p, ko'paytma q",
        'сумма равна минус p, произведение q',
        'the sum equals negative p, the product q',
      ),
      L(
        "ildizlarni ba'zan tanlab topish mumkin",
        'иногда корни можно найти подбором',
        'sometimes the roots can be found by selection',
      ),
    ],
    bridge: L(
      "Keyingi dars: iks maxrajda bo'lgan tenglamalar",
      'Следующий урок: уравнения с иксом в знаменателе',
      'Next lesson: equations with x in the denominator',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — TANLASH USULI.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З46', 'З45', 'З46',
    'З45', 'З45', 'З45', 'З45', 'З46',
    'З16', 'З45', 'З46', null, null,
  ],
  mechanic: { at: 5, tool: 'factorpair', kind: 'select' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
