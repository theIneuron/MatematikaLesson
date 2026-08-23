// ============================================================================
// 8-sinf, Dars 29. SONNING MODULI. MODUL QATNASHGAN TENGLAMA VA
// TENGSIZLIKLAR.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `modulusfold.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `modulusfold`: modul MASOFA sifatida
// ko'rsatiladi, rastvor (radius) tortiladi va ikkita zasechka chiqadi.
//
// DARSNING ISHI (darslik, 17-§, 105-110-bet):
//   1) |a| = a, agar a ≥ 0 bo'lsa; |a| = −a, agar a < 0 bo'lsa;
//   2) geometrik ma'no: |a| — a sonining noldan MASOFASI;
//   3) |x| = a (a > 0) tenglamaning IKKITA ildizi bor: x = a, x = −a;
//   4) |x| ≤ a tengsizlik −a ≤ x ≤ a qo'sh tengsizlikka teng (a > 0);
//   5) |x| ≥ a tengsizlik x ≤ −a YOKI x ≥ a ga teng (a > 0) — IKKI NUR,
//      kesma EMAS.
//
// DARSLIK. O'zbek darsligi, 17-§, 105-110-bet: ta'rif, |x| = 7, |x−1| ≥ 2
// namunalari.
//
// ADASHISHLAR: ikkitasi yangi:
//   З58 — |x| = a tenglamaning faqat BITTA ildizi (musbat) yozilgan, manfiy
//         ildiz unutilgan;
//   З59 — |x| ≥ a tengsizlik KESMA sifatida yozilgan, ikki nur o'rniga;
//   З16 — javob son bilan tekshirilmadi (11-ekranda, qaytadi).
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
  id: 'alg-8-29',
  n: 29,
  row: 32,
  block: 'Б4',
  topic: L(
    "Sonning moduli. Modul qatnashgan tenglama va tengsizliklar",
    'Модуль числа. Уравнения и неравенства, содержащие модуль',
    'Absolute value. Equations and inequalities containing absolute value',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "|a| = a, agar a ≥ 0 bo'lsa; |a| = −a, agar a < 0 bo'lsa",
    'Если a ≥ 0, то |a| = a; если a < 0, то |a| = −a',
    'If a ≥ 0, then |a| = a; if a < 0, then |a| = −a',
  ),
  L(
    "|x| = a (a > 0) tenglamaning ikkita ildizi bor: x = a va x = −a",
    'Уравнение |x| = a (a > 0) имеет два корня: x = a и x = −a',
    'The equation |x| = a (a > 0) has two roots: x = a and x = −a',
  ),
  L(
    "|x| ≤ a tengsizlik −a ≤ x ≤ a ga teng, |x| ≥ a esa x ≤ −a yoki x ≥ a ga teng",
    'Неравенство |x| ≤ a равносильно −a ≤ x ≤ a, а |x| ≥ a равносильно x ≤ −a или x ≥ a',
    'The inequality |x| ≤ a is equivalent to −a ≤ x ≤ a, and |x| ≥ a is equivalent to x ≤ −a or x ≥ a',
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
  'З58': {
    what: L(
      "|x| = a tenglamaning faqat bitta, musbat ildizi yozildi, manfiy ildiz unutildi",
      'у уравнения |x| = a записан только один, положительный корень, отрицательный забыт',
      'only one, positive root of |x| = a was written, the negative root was forgotten',
    ),
    wrong: '-7',
    at: 4,
  },
  'З59': {
    what: L(
      "|x| ≥ a tengsizlik kesma sifatida yozildi, ikki nur o'rniga",
      'неравенство |x| ≥ a записано как отрезок вместо двух лучей',
      'the inequality |x| ≥ a was written as a segment instead of two rays',
    ),
    wrong: '[-2,2]',
    at: 9,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: |x| = 7, x = 7 yagona yechimmi. Yakun: |x − 3| = 5,
// x = −2 va x = 8.
// ============================================================
const SC_ASK = L('YAGONA YECHIMMI', 'ЕДИНСТВЕННОЕ ЛИ РЕШЕНИЕ', 'IS IT THE ONLY SOLUTION')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="46" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fill={T.ink}>{'|x| = 7'}</text>
      <text x="200" y="76" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink3}>{'x = 7'}</text>
      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="108" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="115" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Uchdan besh masofadagi ikki nuqta: minus ikki va sakkiz",
      'Две точки на расстоянии пять от трёх: минус два и восемь',
      'Two points at a distance of five from three: negative two and eight',
    )}>
      <text x="200" y="24" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fill={T.ink}>{'|x − 3| = 5'}</text>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <line x1="30" y1="60" x2="370" y2="60" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <circle cx="100" cy="60" r="4.4" fill={T.ok}/>
        <text x="100" y="74" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>{'−2'}</text>
        <circle cx="230" cy="60" r="4.4" fill={T.tip}/>
        <text x="230" y="74" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>3</text>
        <circle cx="300" cy="60" r="4.4" fill={T.ok}/>
        <text x="300" y="74" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>8</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1800ms' }}>
        <text x="200" y="98" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.ok}>{'x = −2,  x = 8'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('YAGONA YECHIMMI', 'ЕДИНСТВЕННОЕ РЕШЕНИЕ', 'THE ONLY SOLUTION'),
  title: L(
    "Modul yetti tenglamasining yagona yechimi yettimi",
    'Является ли семь единственным решением уравнения с модулем семь',
    'Is seven the only solution of the equation with absolute value seven',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Iks modulining yettiga tengligi. X yetti ekani ko'rinadi.",
      'Модуль икс равен семи. Видно, что икс равен семи.',
      'The absolute value of x equals seven. It is seen that x equals seven.'),
    A('why',
      "Taxmin qiling, boshqa yechim ham bormi.",
      'Предположи, есть ли ещё одно решение.',
      'Predict whether there is another solution.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, yana bir yechim bormi?",
      'Как думаешь, есть ли ещё одно решение?',
      'Do you think there is another solution?',
    ),
    items: [
      { id: 'one', show: L("Yo'q, faqat yetti", 'Нет, только семь', 'No, only seven') },
      { id: 'two', show: L('Ha, yana bittasi bor', 'Да, есть ещё одно', 'Yes, there is another') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Modul ta'rifi (ishoraga qarab). Shu tayanch 5 va
// 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Modul ta'rifini eslash",
    'Вспоминаем определение модуля',
    'Recalling the definition of absolute value',
  ),
  audio: [
    A('mount',
      "To'rt hisoblash. Faqat bittasida modul to'g'ri topilgan.",
      'Четыре вычисления. Только в одном верно найден модуль.',
      'Four computations. Only one correctly finds the absolute value.'),
    A('why',
      "Son manfiy bo'lsa, modul uning ishorasini almashtiradi.",
      'Если число отрицательно, модуль меняет его знак.',
      'If the number is negative, the absolute value flips its sign.'),
  ],
  props: {
    ask: L(
      "Qaysi hisoblash to'g'ri?",
      'Какое вычисление верно?',
      'Which computation is correct?',
    ),
    items: [
      { id: 'right', show: '|−9| = 9', right: true, name: L("manfiy son, ishora almashadi", 'отрицательное число, знак меняется', 'negative number, sign flips') },
      {
        id: 'noflip', show: '|−9| = −9',
        hint: L("Modul doim nomanfiy, manfiy chiqmaydi.", 'Модуль всегда неотрицателен, отрицательным не бывает.', 'The absolute value is always non-negative; it cannot come out negative.'),
      },
      {
        id: 'poswrong', show: '|9| = −9',
        hint: L("To'qqiz allaqachon musbat, ishora almashmaydi.", 'Девять уже положительно, знак не меняется.', 'Nine is already positive, the sign does not flip.'),
      },
      {
        id: 'zerowrong', show: '|0| = 1',
        hint: L("Nolning moduli aynan nol, boshqa son emas.", 'Модуль нуля равен именно нулю, а не другому числу.', 'The absolute value of zero is exactly zero, not another number.'),
      },
    ],
    after: L(
      "To'g'ri. Minus to'qqiz manfiy, modul uning ishorasini almashtirib to'qqiz beradi.",
      'Верно. Минус девять отрицательно, модуль меняет знак и даёт девять.',
      'Correct. Negative nine is negative, the absolute value flips the sign and gives nine.',
    ),
  },
}

// ============================================================
// EKRAN 3. X NI BURANG (1-darsning `steppers`). Bir bo'lingan modulni
// kuzatish: x nolga yaqinlashganda natija ortadi, x nolga tenglashganda
// YO'QOLADI — modul aynan noldan masofa ekanini ko'rsatadi.
// ============================================================
const S3 = {
  eyebrow: L('X NI BURANG', 'КРУТИ X', 'TURN X'),
  title: L(
    "Noldan masofa qanchalik kichik",
    'Насколько мало расстояние до нуля',
    'How small is the distance to zero',
  ),
  audio: [
    A('mount',
      "X noldan qancha uzoqligini kuzatamiz. Natija bir bo'lingan modul x ga teng.",
      'Смотрим, насколько x далеко от нуля. Результат равен единице, делённой на модуль x.',
      'We watch how far x is from zero. The result equals one divided by the absolute value of x.'),
    A('why',
      "Ikki maqsad beriladi. x ning turli qiymatlarida natijani toping.",
      'Даны две цели. Находи результат при разных значениях x.',
      'Two targets are given. Find the result at different values of x.'),
    A('why',
      "Oxirida x ni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти x до нуля и посмотри, что будет.',
      'At the end bring x down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'x', label: L('x ning qiymati', 'значение x', 'the value of x'),
        start: 4, min: 0, max: 4, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : Math.round((1 / Math.abs(v[0])) * 100) / 100),
    resultLabel: L('1/|x|', '1/|x|', '1/|x|'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "x hali nolga tushmasin, avval maqsadlarni oling.",
      'x пока не опускай до нуля, сначала возьми цели.',
      'Do not bring x down to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: 0.5,
        ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
        after: L(
          "0,5. To'rtning modulidan bir bo'lingan ikki 0,5.",
          '0,5. Единица, делённая на модуль четырёх, равна 0,5.',
          '0.5. One divided by the absolute value of four is 0.5.',
        ),
      },
      {
        value: 1,
        ask: L("Endi natija 1 ga teng bo'lsin", 'Теперь пусть результат будет равен 1', 'Now make the result equal 1'),
        after: L(
          "1. Birning modulidan bir bo'lingan bir bir.",
          '1. Единица, делённая на модуль единицы, равна одному.',
          '1. One divided by the absolute value of one is one.',
        ),
      },
    ],
    ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
    ask2: L("Endi x ni nolga tushiring", 'Теперь опусти x до нуля', 'Now bring x down to zero'),
    broke: L(
      "x nolga teng bo'lganda natija yo'q, chunki nolga bo'lish mumkin emas. Nol nuqtaning o'zi masofa emas.",
      'При x равном нулю результата нет, потому что делить на нуль нельзя. Сама нулевая точка не расстояние.',
      'With x equal to zero there is no result, because dividing by zero is not possible. The zero point itself is not a distance.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI YECHIM TO'LIQ (1-darsning `pick`). Ловушка — manfiy ildiz
// unutilgan (З58).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI YECHIM TO\'LIQ', 'КАКОЕ РЕШЕНИЕ ПОЛНОЕ', 'WHICH SOLUTION IS COMPLETE'),
  title: L(
    "|x| = 7 tenglamasining to'liq yechimi qaysi",
    'Каково полное решение уравнения |x| = 7',
    'What is the complete solution of the equation |x| = 7',
  ),
  audio: [
    A('mount',
      "To'rt javob taklif qilinadi. Faqat bittasi to'liq.",
      'Предложены четыре ответа. Только один полный.',
      'Four answers are proposed. Only one is complete.'),
    A('why',
      "Ikkita son ham yettiga masofada turadi, yetti va minus yetti.",
      'Два числа находятся на расстоянии семь, семь и минус семь.',
      'Two numbers are at a distance of seven, seven and negative seven.'),
  ],
  props: {
    ask: L(
      "|x| = 7 ning to'liq yechimi qaysi?",
      'Каково полное решение |x| = 7?',
      'What is the complete solution of |x| = 7?',
    ),
    items: [
      { id: 'right', show: 'x = 7,  x = −7', right: true, name: L("ikkalasi ham yettiga masofada", 'оба на расстоянии семь', 'both at a distance of seven') },
      {
        id: 'onlypos', show: 'x = 7',
        hint: L("Minus yetti ham yettiga masofada, u ham yechim.", 'Минус семь тоже на расстоянии семь, это тоже решение.', 'Negative seven is also at a distance of seven; it too is a solution.'),
      },
      {
        id: 'onlyneg', show: 'x = −7',
        hint: L("Musbat yetti ham yechim, u ham unutilmasligi kerak.", 'Положительное семь тоже решение, его нельзя забывать.', 'Positive seven is also a solution; it must not be forgotten.'),
      },
      {
        id: 'zero', show: 'x = 0',
        hint: L("Nolning moduli nolga teng, yettiga emas.", 'Модуль нуля равен нулю, а не семи.', 'The absolute value of zero equals zero, not seven.'),
      },
    ],
    after: L(
      "To'g'ri. Ikkalasi ham yettiga masofada, ikkalasi ham yechim.",
      'Верно. Оба на расстоянии семь, оба являются решением.',
      'Correct. Both are at a distance of seven, both are solutions.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — MODUL MASOFA SIFATIDA (`modulusfold`).
// Xukdagi tenglama shu yerda to'liq ochiladi: |x − 3| = 5.
// ============================================================
const S5 = {
  eyebrow: L('RASTVORNI TORTAMIZ', 'ТЯНЕМ РАСТВОР', 'WE PULL THE SPAN'),
  title: L(
    "|x − 3| = 5 ni to'g'ri chiziqda yeching",
    'Решите |x − 3| = 5 на числовой прямой',
    'Solve |x − 3| = 5 on the number line',
  ),
  audio: [
    A('mount',
      "Uchdan besh masofadagi nuqtalarni izlaymiz.",
      'Ищем точки на расстоянии пять от трёх.',
      'We look for points at a distance of five from three.'),
    A('why',
      "Rastvorni besh bo'lguncha torting.",
      'Тяни раствор, пока он не станет равным пяти.',
      'Pull the span until it equals five.'),
    W('fold',
      "Ikkita zasechka chiqdi, minus ikki va sakkiz.",
      'Вышли две засечки, минус два и восемь.',
      'Two marks came out, negative two and eight.'),
  ],
  props: {
    min: -6,
    max: 12,
    c: 3,
    step: 1,
    target: 5,
    mode: 'eq',
    radiusLabel: L('Rastvor (masofa)', 'Раствор (расстояние)', 'Span (distance)'),
    fields: [
      {
        ask: L("Birinchi ildiz qancha?", 'Чему равен первый корень?', 'What is the first root?'),
        kind: 'number',
        answer: '-2',
        accepts: ['-2'],
        hints: {
          '8': L("Bu ikkinchi ildiz, avval kichigini kiriting.", 'Это второй корень, сначала введи меньший.', 'That is the second root; enter the smaller one first.'),
          '2': L("Ishora unutilgan, uchdan besh ayirilganda minus ikki chiqadi.", 'Знак забыт, три минус пять даёт минус два.', 'The sign was forgotten; three minus five gives negative two.'),
        },
      },
      {
        ask: L("Ikkinchi ildiz qancha?", 'Чему равен второй корень?', 'What is the second root?'),
        kind: 'number',
        answer: '8',
        accepts: ['8'],
        hints: {
          '-2': L("Bu birinchi ildiz, endi kattasini kiriting.", 'Это первый корень, теперь введи больший.', 'That is the first root; now enter the larger one.'),
          '2': L("Uchga besh qo'shilganda sakkiz chiqadi, ikki emas.", 'Три плюс пять даёт восемь, а не два.', 'Three plus five gives eight, not two.'),
        },
      },
    ],
    note: L(
      "To'g'ri. X minus ikkiga teng yoki sakkizga teng.",
      'Верно. x равен минус двум либо равен восьми.',
      'Correct. x equals negative two or equals eight.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): |x − 3| = 5 ni ikki yo'l bilan
// yechish — masofa va holatlarga ajratish.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "|x − 3| = 5 ni ikki yo'l bilan yechish",
    'Решить |x − 3| = 5 двумя способами',
    'Solving |x − 3| = 5 two ways',
  ),
  audio: [
    A('mount',
      "Bitta tenglama va ikki yo'l. Ikkalasi ham bir xil javob beradi.",
      'Одно уравнение и два пути. Оба дают один ответ.',
      'One equation and two ways. Both give the same answer.'),
    W('w2',
      "Birinchi yo'lda masofa sifatida to'g'ridan-to'g'ri topiladi.",
      'В первом пути находится сразу через расстояние.',
      'In the first way it is found directly through distance.'),
    W('w4',
      "Ikkinchi yo'lda ikki holatga ajratiladi.",
      'Во втором пути разбивается на два случая.',
      'In the second way it is split into two cases.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL — MASOFA', 'СПОСОБ 1 — РАССТОЯНИЕ', 'METHOD 1 — DISTANCE'),
        lead: L(
          "Uchdan besh masofadagi ikki nuqta",
          'Две точки на расстоянии пять от трёх',
          'Two points at a distance of five from three',
        ),
        rows: [
          { text: '3 − 5,   3 + 5' },
          { text: L('minus ikki, sakkiz', 'минус два, восемь', 'negative two, eight'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL — HOLATLARGA AJRATISH', 'СПОСОБ 2 — РАЗБИЕНИЕ НА СЛУЧАИ', 'METHOD 2 — SPLITTING INTO CASES'),
        lead: L(
          "x minus uch besh yoki minus besh bo'ladi",
          'x минус три равно пяти либо минус пяти',
          'x minus three equals five or negative five',
        ),
        rows: [
          { text: 'x − 3 = 5,   x − 3 = −5' },
          { text: L('sakkiz, minus ikki', 'восемь, минус два', 'eight, negative two'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Masofa tezroq, holatlarga ajratish esa har doim ishlaydi",
          'Расстояние быстрее, а разбиение на случаи работает всегда',
          'Distance is faster, splitting into cases always works',
        ),
        rows: [{ text: 'x = −2,  x = 8', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): nega |x| ≥ a ikki nur beradi,
// kesma emas.
// ============================================================
const S7 = {
  eyebrow: L('NEGA IKKI NUR', 'ПОЧЕМУ ДВА ЛУЧА', 'WHY TWO RAYS'),
  title: L(
    "Nega |x| ≥ a ikki nur beradi",
    'Почему |x| ≥ a даёт два луча',
    'Why |x| ≥ a gives two rays',
  ),
  audio: [
    A('mount',
      "Modul katta yoki teng a, demak noldan masofa kamida a.",
      'Модуль больше либо равен a, значит расстояние до нуля не менее a.',
      'The absolute value is greater than or equal to a, so the distance to zero is at least a.'),
    W('p2',
      "O'ngda a dan uzoq nuqtalar, bu x katta yoki teng a.",
      'Справа точки дальше a, это x больше либо равно a.',
      'On the right, points farther than a, that is x greater than or equal to a.'),
    W('p4',
      "Chapda minus a dan uzoq nuqtalar, bu x kichik yoki teng minus a. Ular orasidagi kesma bo'sh qoladi.",
      'Слева точки дальше минус a, это x меньше либо равно минус a. Отрезок между ними остаётся пустым.',
      'On the left, points farther than negative a, that is x less than or equal to negative a. The segment between them stays empty.',
    ),
  ],
  props: {
    tokens: [
      { t: 'x ≤ −a', id: 'a' },
      { t: '   ∪   ', id: 'sign' },
      { t: 'x ≥ a', id: 'b' },
    ],
    steps: [
      {
        focus: 'sign',
        text: L(
          "Birinchi qadam. Modul kamida a, demak noldan ikki yo'nalishda ham uzoqlashish mumkin.",
          'Первый шаг. Модуль не менее a, значит удаляться от нуля можно в обе стороны.',
          'Step one. The absolute value is at least a, so moving away from zero is possible in both directions.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi qadam. O'ngga uzoqlashish x katta yoki teng a ni beradi.",
          'Второй шаг. Удаление направо даёт x больше либо равно a.',
          'Step two. Moving away to the right gives x greater than or equal to a.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Uchinchi qadam. Chapga uzoqlashish x kichik yoki teng minus a ni beradi, ular orasida bo'sh joy qoladi.",
          'Третий шаг. Удаление налево даёт x меньше либо равно минус a, между ними остаётся пустое место.',
          'Step three. Moving away to the left gives x less than or equal to negative a, leaving an empty gap between them.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Modul belgisi ikki tik chiziq shaklida nemis matematigi Karl Veyershtrass tomonidan ming sakkiz yuz qirq birinchi yilda kiritilgan.",
        'Обозначение модуля двумя вертикальными чертами ввёл немецкий математик Карл Вейерштрасс в тысяча восемьсот сорок первом году.',
        'The absolute value notation with two vertical bars was introduced by the German mathematician Karl Weierstrass in eighteen forty-one.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 17-§, 105-110-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Modul tenglama va tengsizliklari",
    'Уравнения и неравенства с модулем',
    'Equations and inequalities with absolute value',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik qoidasi ochildi, va xukdagi qarz to'landi.",
      'Открылось правило из учебника, и долг с хука оплачен.',
      'The textbook rule opened, and the debt from the hook is paid.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("|x| = a (a > 0) tenglamaning ikkita ildizi bor", 'уравнение |x| = a (a > 0) имеет два корня', 'the equation |x| = a (a > 0) has two roots') },
      { id: 'f2', label: L("x = a va x = −a", 'x = a и x = −a', 'x = a and x = −a') },
      { id: 'f3', label: L("|x| ≤ a tengsizlik −a ≤ x ≤ a ga teng", 'неравенство |x| ≤ a равносильно −a ≤ x ≤ a', 'the inequality |x| ≤ a is equivalent to −a ≤ x ≤ a') },
      { id: 'f4', label: L("|x| ≥ a tengsizlik x ≤ −a yoki x ≥ a ga teng", 'а |x| ≥ a равносильно x ≤ −a или x ≥ a', 'and |x| ≥ a is equivalent to x ≤ −a or x ≥ a') },
      { id: 'w1', label: L("ikkala tengsizlik ham kesma beradi", 'оба неравенства дают отрезок', 'both inequalities give a segment') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Faqat |x| ≤ a kesma beradi, |x| ≥ a esa ikki nur beradi.",
      'Так не складывается. Только |x| ≤ a даёт отрезок, а |x| ≥ a даёт два луча.',
      'That does not fit. Only |x| ≤ a gives a segment, while |x| ≥ a gives two rays.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 17-§, 105-110-bet",
        'Учебник, § 17, стр. 105–110',
        'Textbook, section 17, pages 105–110',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Modul yetti tenglamasida yagona yechim yetti deb o'ylagandik",
        'Мы думали, что единственное решение — семь',
        'We thought seven was the only solution',
      ),
      right: L(
        "endi modul masofa ekanini bilib, minus yettini ham topamiz",
        'теперь, зная, что модуль это расстояние, находим и минус семь',
        'now, knowing the absolute value is a distance, we also find negative seven',
      ),
      winner: 'right',
      note: L(
        "Modul har doim ikki yo'nalishni ham hisobga oladi",
        'Модуль всегда учитывает оба направления',
        'The absolute value always accounts for both directions',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): modul tenglamasini yeching.
// ============================================================
const ASK_ROOTS = L('Ildizlar qaysi?', 'Каковы корни?', 'What are the roots?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Modul tenglamasini yeching",
    'Реши уравнение с модулем',
    'Solve the equation with absolute value',
  ),
  audio: [
    A('mount',
      "Besh tenglama. Har birida modul bor.",
      'Пять уравнений. В каждом есть модуль.',
      'Five equations. Each has an absolute value.'),
    A('why',
      "Har bir tenglamaning ikkita ildizi bo'lishi mumkin, unutmang.",
      'У каждого уравнения может быть два корня, не забывай.',
      'Each equation can have two roots, do not forget.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar ikkita ildiz topilgan.",
      'Все пять разобраны. Каждый раз находились два корня.',
      'All five are done. Each time two roots were found.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'|x| = 4'}</Row>,
        ok: L("Ha. To'rt va minus to'rt, ikkalasi ham to'rtga masofada.", 'Да. Четыре и минус четыре, оба на расстоянии четыре.', 'Yes. Four and negative four, both at a distance of four.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = 4,  x = −4' },
          { id: 'b', label: 'x = 4', hint: L("Minus to'rt ham to'rtga masofada, u ham ildiz.", 'Минус четыре тоже на расстоянии четыре, это тоже корень.', 'Negative four is also at a distance of four; it too is a root.') },
        ],
        solution: ['|x| = 4', 'x = 4,  x = −4'],
      },
      {
        expr: <Row size="big" align="center">{'|x| = 10'}</Row>,
        ok: L("Ha. O'n va minus o'n.", 'Да. Десять и минус десять.', 'Yes. Ten and negative ten.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = 10,  x = −10' },
          { id: 'b', label: 'x = 10', hint: L("Minus o'n ham unutilmasligi kerak.", 'Минус десять тоже нельзя забывать.', 'Negative ten must not be forgotten either.') },
        ],
        solution: ['|x| = 10', 'x = 10,  x = −10'],
      },
      {
        expr: <Row size="big" align="center">{'|x + 2| = 6'}</Row>,
        ok: L("Ha. X plyus ikki olti yoki minus olti bo'ladi, x to'rt yoki minus sakkiz.", 'Да. x плюс два равно шести либо минус шести, x равен четырём либо минус восьми.', 'Yes. x plus two equals six or negative six, x equals four or negative eight.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = 4,  x = −8' },
          { id: 'b', label: 'x = 4', hint: L("Ikkinchi holat, x plyus ikki minus oltiga teng, ham hisobga olinishi kerak.", 'Второй случай, x плюс два равно минус шести, тоже нужно учесть.', 'The second case, x plus two equals negative six, must also be considered.') },
        ],
        solution: ['x + 2 = 6', 'x + 2 = −6', 'x = 4,  x = −8'],
      },
      {
        expr: <Row size="big" align="center">{'|x − 5| = 0'}</Row>,
        ok: L("Ha. Modul nolga teng bo'lganda faqat bitta ildiz bor, x besh.", 'Да. Когда модуль равен нулю, есть только один корень, x пять.', 'Yes. When the absolute value equals zero, there is only one root, x five.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = 5' },
          { id: 'b', label: 'x = 5,  x = −5', hint: L("Bu yerda a nolga teng, ikki tomon ustma-ust tushib bitta ildiz qoladi.", 'Здесь a равно нулю, обе стороны совпадают, остаётся один корень.', 'Here a equals zero, both sides coincide, leaving one root.') },
        ],
        solution: ['|x − 5| = 0', 'x = 5'],
      },
      {
        expr: <Row size="big" align="center">{'|2x| = 8'}</Row>,
        ok: L("Ha. Ikki iks sakkiz yoki minus sakkiz bo'ladi, x to'rt yoki minus to'rt.", 'Да. Два икс равно восьми либо минус восьми, x равен четырём либо минус четырём.', 'Yes. Two x equals eight or negative eight, x equals four or negative four.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = 4,  x = −4' },
          { id: 'b', label: 'x = 8,  x = −8', hint: L("Ikkiga bo'lishni unutmang, sakkizni ikkiga bo'lsak to'rt chiqadi.", 'Не забудь разделить на два, восемь делённое на два даёт четыре.', 'Do not forget to divide by two; eight divided by two gives four.') },
        ],
        solution: ['2x = 8', '2x = −8', 'x = 4,  x = −4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): modul tengsizligini yeching.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Modul tengsizligini yeching",
    'Реши неравенство с модулем',
    'Solve the inequality with absolute value',
  ),
  audio: [
    A('mount',
      "Uch tengsizlik. Kesma yoki ikki nur ekanligini aniqlang.",
      'Три неравенства. Определи, отрезок это или два луча.',
      'Three inequalities. Determine whether it is a segment or two rays.'),
    A('why',
      "Kichik yoki teng belgisi kesma, katta yoki teng belgisi ikki nur beradi.",
      'Знак меньше либо равно даёт отрезок, знак больше либо равно даёт два луча.',
      'The less-than-or-equal sign gives a segment, the greater-than-or-equal sign gives two rays.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar belgi turini aniqlab kesma yoki nur topilgan.",
      'Все три разобраны. Каждый раз по типу знака находился отрезок или луч.',
      'All three are done. Each time the sign type determined a segment or ray.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'|x| ≤ 4'}</Row>,
        ok: L("Ha. Kichik yoki teng, demak kesma, minus to'rtdan to'rtgacha.", 'Да. Меньше либо равно, значит отрезок, от минус четырёх до четырёх.', 'Yes. Less than or equal, so a segment, from negative four to four.'),
        question: L("Bu kesma yoki ikki nur?", 'Это отрезок или два луча?', 'Is this a segment or two rays?'),
        items: [
          { id: 'a', right: true, label: '−4 ≤ x ≤ 4' },
          { id: 'b', label: 'x ≤ −4 yoki x ≥ 4', hint: L("Kichik yoki teng belgisi kesma beradi, ikki nur emas.", 'Знак меньше либо равно даёт отрезок, а не два луча.', 'The less-than-or-equal sign gives a segment, not two rays.') },
        ],
        solution: ['|x| ≤ 4', '−4 ≤ x ≤ 4'],
      },
      {
        expr: <Row size="big" align="center">{'|x| ≥ 6'}</Row>,
        ok: L("Ha. Katta yoki teng, demak ikki nur, oltidan uzoq nuqtalar.", 'Да. Больше либо равно, значит два луча, точки дальше шести.', 'Yes. Greater than or equal, so two rays, points farther than six.'),
        question: L("Bu kesma yoki ikki nur?", 'Это отрезок или два луча?', 'Is this a segment or two rays?'),
        items: [
          { id: 'a', right: true, label: 'x ≤ −6 yoki x ≥ 6' },
          { id: 'b', label: '−6 ≤ x ≤ 6', hint: L("Katta yoki teng belgisi ikki nur beradi, kesma emas.", 'Знак больше либо равно даёт два луча, а не отрезок.', 'The greater-than-or-equal sign gives two rays, not a segment.') },
        ],
        solution: ['|x| ≥ 6', 'x ≤ −6 yoki x ≥ 6'],
      },
      {
        expr: <Row size="big" align="center">{'|x − 1| < 3'}</Row>,
        ok: L("Ha. Bir atrofida uchdan kichik masofa, minus ikkidan to'rtgacha kesma.", 'Да. Расстояние меньше трёх вокруг единицы, отрезок от минус двух до четырёх.', 'Yes. A distance less than three around one, the segment from negative two to four.'),
        question: L("Bu kesma yoki ikki nur?", 'Это отрезок или два луча?', 'Is this a segment or two rays?'),
        items: [
          { id: 'a', right: true, label: '−2 < x < 4' },
          { id: 'b', label: 'x < −2 yoki x > 4', hint: L("Kichik belgisi kesma beradi, ikki nur emas.", 'Знак меньше даёт отрезок, а не два луча.', 'The less-than sign gives a segment, not two rays.') },
        ],
        solution: ['|x − 1| < 3', '−3 < x − 1 < 3', '−2 < x < 4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): javobni son bilan
// tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Javobni son bilan tekshirish",
    'Проверка ответа числом',
    'Checking the answer with a number',
  ),
  audio: [
    A('mount',
      "Uch taklif qilingan javob. Har birini son qo'yib tekshiring.",
      'Предложены три ответа. Каждый проверь, подставив число.',
      'Three proposed answers. Check each by substituting a number.'),
    A('why',
      "Javobdan bir son olib, asl tenglama yoki tengsizlikka qo'ying.",
      'Возьми число из ответа и подставь в исходное уравнение или неравенство.',
      'Take a number from the answer and substitute it into the original equation or inequality.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar son javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз число проверяло ответ.',
      'All three are done. Each time a number checked the answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'|x| = 5,   x = 5,  x = −5'}</Row>,
        ok: L("Ha. Ikkalasining moduli ham besh.", 'Да. Модуль обоих равен пяти.', 'Yes. The absolute value of both is five.'),
        question: L("Bu javob to'liqmi?", 'Полон ли этот ответ?', 'Is this answer complete?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Besh ham minus besh ham modulda beshni beradi.", 'И пять, и минус пять дают в модуле пять.', 'Both five and negative five give five in absolute value.') },
        ],
        solution: ['|5|', '5', '|−5|', '5'],
      },
      {
        expr: <Row size="big" align="center">{'|x| ≤ 2,   x = 2'}</Row>,
        ok: L("Ha. Ikkining moduli ikki, ikkidan katta emas, chegara kiradi.", 'Да. Модуль двух равен двум, не больше двух, граница входит.', 'Yes. The absolute value of two is two, not greater than two, the boundary is included.'),
        question: L("x = 2 yechimga kiradimi?", 'Входит ли x = 2 в решение?', 'Is x = 2 part of the solution?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Belgi qat'iy emas, chegara ham kiradi.", 'Знак нестрогий, граница тоже входит.', 'The sign is not strict; the boundary is also included.') },
        ],
        solution: ['|2|', '2', L("kiradi", 'входит', 'included')],
      },
      {
        expr: <Row size="big" align="center">{'|x| ≥ 3,   x = 0'}</Row>,
        ok: L("Yo'q. Nolning moduli nol, uchdan kichik.", 'Нет. Модуль нуля равен нулю, меньше трёх.', 'No. The absolute value of zero is zero, less than three.'),
        question: L("x = 0 yechimga kiradimi?", 'Входит ли x = 0 в решение?', 'Is x = 0 part of the solution?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Nol markazga eng yaqin nuqta, u hech qachon uzoq nur ichida bo'lolmaydi.", 'Нуль это ближайшая к центру точка, она никогда не попадёт в дальний луч.', 'Zero is the point closest to the center; it can never fall inside the far ray.') },
        ],
        solution: ['|0|', '0', L("kirmaydi", 'не входит', 'not included')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): |x| ≥ a kesma sifatida
// yozilgan (З59).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Kesma yoki ikki nur to'g'ri tanlanganmi",
    'Верно ли выбраны отрезок или два луча',
    'Was the segment or two rays chosen correctly',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham |x| ≥ a kesma sifatida yozilgan.",
      'Два задания. В обоих |x| ≥ a записано как отрезок.',
      'Two tasks. In both, |x| ≥ a is written as a segment.'),
    A('why',
      "Katta yoki teng belgisi har doim ikki nur beradi, kesma emas.",
      'Знак больше либо равно всегда даёт два луча, а не отрезок.',
      'The greater-than-or-equal sign always gives two rays, not a segment.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. |x| ≥ a har doim ikki nur bo'ladi.",
      'Оба разобраны. |x| ≥ a всегда даёт два луча.',
      'Both are done. |x| ≥ a always gives two rays.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'|x| ≥ 2   →   −2 ≤ x ≤ 2'}</Row>,
        ok: L("Ha. Bu kesma emas, ikki nur bo'lishi kerak edi, x kichik yoki teng minus ikki yoki x katta yoki teng ikki.", 'Да. Это не отрезок, должны были быть два луча, x меньше либо равно минус двум или x больше либо равно двум.', 'Yes. This is not a segment; it should have been two rays, x less than or equal to negative two or x greater than or equal to two.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Kesma sifatida yozilgan, ikki nur emas", 'Записано как отрезок, а не два луча', 'Written as a segment, not two rays') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, |x| ≥ a har doim ikki nur beradi.", 'Это и есть показанная ошибка, |x| ≥ a всегда даёт два луча.', 'This is the very mistake shown; |x| ≥ a always gives two rays.') },
        ],
        solution: ['|x| ≥ 2', 'x ≤ −2 yoki x ≥ 2'],
      },
      {
        expr: <Row size="big" align="center">{'|x − 1| ≥ 4   →   −3 ≤ x ≤ 5'}</Row>,
        ok: L("Ha. Bu ham kesma emas, x kichik yoki teng minus uch yoki x katta yoki teng besh bo'lishi kerak edi.", 'Да. Это тоже не отрезок, должно быть x меньше либо равно минус трём или x больше либо равно пяти.', 'Yes. This too is not a segment; it should be x less than or equal to negative three or x greater than or equal to five.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Kesma sifatida yozilgan, ikki nur emas", 'Записано как отрезок, а не два луча', 'Written as a segment, not two rays') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, katta yoki teng belgisi ikki nur beradi.", 'Это и есть показанная ошибка, знак больше либо равно даёт два луча.', 'This is the very mistake shown; the greater-than-or-equal sign gives two rays.') },
        ],
        solution: ['|x − 1| ≥ 4', 'x ≤ −3 yoki x ≥ 5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH (1-darsning `fill`): modul tenglamasini qadamlab
// yechish.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Modul tenglamasini qadamlab yeching",
    'Реши уравнение с модулем по шагам',
    'Solve the absolute value equation step by step',
  ),
  audio: [
    A('mount',
      "Modul tenglamasi berilgan. Ikki holatga ajratib yeching.",
      'Дано уравнение с модулем. Реши, разбив на два случая.',
      'An absolute value equation is given. Solve by splitting into two cases.'),
    A('why',
      "Ikkinchi holatni unutmang, u ham ildiz beradi.",
      'Не забудь второй случай, он тоже даёт корень.',
      'Do not forget the second case; it also gives a root.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar ikki holat ikki ildizni bergan.",
      'Все три заполнены. Каждый раз два случая давали два корня.',
      'All three are filled. Each time two cases gave two roots.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['9', '−9'],
      lines: [
        [{ t: '|x| = 9   →   x = ' }, { slot: '9' }, { t: ',   x = ' }, { slot: '−9' }],
      ],
    },
    tasks: [
      {
        chips: ['6', '−6'],
        lines: [
          [{ t: '|x| = 6   →   x = ' }, { slot: '6' }, { t: ',   x = ' }, { slot: '−6' }],
        ],
      },
      {
        chips: ['3', '−7'],
        lines: [
          [{ t: '|x + 2| = 5   →   x = ' }, { slot: '3' }, { t: ',   x = ' }, { slot: '−7' }],
        ],
      },
      {
        chips: ['5', '1'],
        lines: [
          [{ t: '|x − 3| = 2   →   x = ' }, { slot: '5' }, { t: ',   x = ' }, { slot: '1' }],
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
    "Modul bo'yicha to'rt savol",
    'Четыре вопроса о модуле',
    'Four questions about absolute value',
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
        id: 'q1', tag: 'З58',
        ask: L('|x| = 12 ning ildizlari qaysi?', 'Каковы корни |x| = 12?', 'What are the roots of |x| = 12?'),
        options: [
          { id: 'ok', right: true, label: 'x = 12,  x = −12' },
          { id: 'onlypos', label: 'x = 12' },
          { id: 'onlyneg', label: 'x = −12' },
          { id: 'zero', label: 'x = 0' },
        ],
        hint: L("Ikkalasi ham o'n ikkiga masofada.", 'Оба на расстоянии двенадцать.', 'Both are at a distance of twelve.'),
        ok: L("To'g'ri, ikkalasi ham ildiz.", 'Верно, оба являются корнями.', 'Correct, both are roots.'),
      },
      {
        id: 'q2', tag: 'З59',
        ask: L('|x| > 5 ning yechimi qaysi?', 'Каково решение |x| > 5?', 'What is the solution of |x| > 5?'),
        options: [
          { id: 'ok', right: true, label: 'x < −5 yoki x > 5' },
          { id: 'segment', label: '−5 < x < 5' },
          { id: 'wrong', label: 'x > 5' },
          { id: 'wrong2', label: 'x > −5' },
        ],
        hint: L("Katta belgisi ikki nur beradi, kesma emas.", 'Знак больше даёт два луча, а не отрезок.', 'The greater-than sign gives two rays, not a segment.'),
        ok: L("To'g'ri, ikki nur chiqadi.", 'Верно, выходят два луча.', 'Correct, two rays result.'),
      },
      {
        id: 'q3', tag: 'З59',
        ask: L('|x| < 5 ning yechimi qaysi?', 'Каково решение |x| < 5?', 'What is the solution of |x| < 5?'),
        options: [
          { id: 'ok', right: true, label: '−5 < x < 5' },
          { id: 'rays', label: 'x < −5 yoki x > 5' },
          { id: 'wrong', label: 'x < 5' },
        ],
        hint: L("Kichik belgisi kesma beradi, ikki nur emas.", 'Знак меньше даёт отрезок, а не два луча.', 'The less-than sign gives a segment, not two rays.'),
        ok: L("To'g'ri, kesma chiqadi.", 'Верно, выходит отрезок.', 'Correct, a segment results.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('x = −6 son |x| = 6 ning ildizimi?', 'Является ли x = −6 корнем |x| = 6?', 'Is x = −6 a root of |x| = 6?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Minus oltining moduli olti.", 'Модуль минус шести равен шести.', 'The absolute value of negative six is six.'),
        ok: L("To'g'ri, modul olti beradi.", 'Верно, модуль даёт шесть.', 'Correct, the absolute value gives six.'),
      },
      {
        id: 'q5', tag: 'З58',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "|x| = 15 ning ikkala ildizini yig'ing.",
            'Собери оба корня |x| = 15.',
            'Assemble both roots of |x| = 15.',
          ),
          lines: [
            [{ t: 'x = ' }, { slot: '15' }, { t: ',   x = ' }, { slot: '−15' }],
          ],
          tiles: [
            { id: 't1', v: '15', x: 12, y: 12 },
            { id: 't2', v: '−15', x: 70, y: 14 },
            { id: 't3', v: '0', x: 40, y: 50 },
            { id: 't4', v: '30', x: 78, y: 48 },
          ],
          hint: L(
            "O'n beshning ham, minus o'n beshning ham moduli o'n besh.",
            'Модуль и пятнадцати, и минус пятнадцати равен пятнадцати.',
            'The absolute value of both fifteen and negative fifteen is fifteen.',
          ),
          doneNote: L(
            "Yig'ildi. Ikkalasi ham o'n beshga masofada.",
            'Собрано. Оба на расстоянии пятнадцать.',
            'Assembled. Both at a distance of fifteen.',
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
    "Modul — noldan yoki boshqa nuqtadan masofa",
    'Модуль — это расстояние от нуля или другой точки',
    'The absolute value is the distance from zero or another point',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. Modul iks minus uch besh, javobi minus ikki va sakkiz.",
      'С урока остаётся одна запись. Модуль x минус три равен пяти, ответ минус два и восемь.',
      'One record stays with you. The absolute value of x minus three equals five, the answer negative two and eight.'),
    A('s1',
      "Bugun uch narsa qilindi. Modulni masofa sifatida ko'rdingiz, tenglamaning ikkita ildizini topdingiz va tengsizlikda kesma bilan ikki nurni farqladingiz.",
      'Сегодня сделано три вещи. Ты увидел модуль как расстояние, нашёл два корня уравнения и различил отрезок и два луча в неравенстве.',
      'Three things are done today. You saw the absolute value as distance, found two roots of the equation, and distinguished a segment from two rays in the inequality.'),
    A('s2',
      "Keyingi darsda taqribiy hisoblashlar. Xatolik bilan tanishasiz.",
      'В следующем уроке приближённые вычисления. Познакомишься с погрешностью.',
      'The next lesson covers approximate calculations. You will meet the concept of error.',
    ),
  ],
  props: {
    mark: '|x − 3| = 5   →   x = −2,  x = 8',
    markNote: L(
      "uchdan besh masofadagi ikki nuqta",
      'две точки на расстоянии пять от трёх',
      'two points at a distance of five from three',
    ),
    lines: [
      L(
        "|x| = a (a > 0) ning ikkita ildizi bor: a va minus a",
        'У |x| = a (a > 0) есть два корня: a и минус a',
        'The equation |x| = a (a > 0) has two roots: a and negative a',
      ),
      L(
        "|x| ≤ a kesma beradi, |x| ≥ a esa ikki nur beradi",
        '|x| ≤ a даёт отрезок, а |x| ≥ a даёт два луча',
        '|x| ≤ a gives a segment, while |x| ≥ a gives two rays',
      ),
      L(
        "modul har doim nomanfiy, u noldan yoki boshqa nuqtadan masofa",
        'Модуль всегда неотрицателен, это расстояние от нуля или другой точки',
        'The absolute value is always non-negative; it is the distance from zero or another point',
      ),
    ],
    bridge: L(
      "Keyingi dars: taqribiy hisoblashlar",
      'Следующий урок: приближённые вычисления',
      'Next lesson: approximate calculations',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — MODUL MASOFA SIFATIDA (`modulusfold`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З58', 'З58', 'З58',
    'З58', 'З58', 'З58', 'З58', 'З59',
    'З16', 'З59', 'З58', null, null,
  ],
  mechanic: { at: 5, tool: 'modulusfold', kind: 'equation' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
