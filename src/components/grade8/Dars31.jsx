// ============================================================================
// 8-sinf, Dars 31. BUTUN KO'RSATKICHLI DARAJA.
//
// Bu fayl, FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya, 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `ladder` (`PowerLadder`): daraja qatori
// pastga tushib, nolinchi va manfiy ko'rsatkichga o'tadi.
//
// DIQQAT, darslikda BUTUN ko'rsatkichli darajaning ALOHIDA ta'rif sahifasi
// YO'Q: 9-§ (42-47-bet) ratsional ko'rsatkichli darajani beradi va butun
// holatni 7-sinfdan MA'LUM deb qabul qiladi (42-bet: "...butun ko'rsatkichli
// darajaning xossalaridan foydalanib..."). Shu sababli ta'rif darsda umumiy
// matematik konvensiya sifatida beriladi, darslik faqat MISOLLAR uchun
// ishlatiladi (masalan, 27^(−2/3) = 1/9, 43-bet).
//
// DARSNING ISHI:
//   1) a⁰ = 1 (a ≠ 0), qator davomi, kelishuv emas;
//   2) a⁻ⁿ = 1/aⁿ (a ≠ 0, n natural), manfiy ko'rsatkich TESKARI SONNI
//      bildiradi, ishorani EMAS;
//   3) a = 0 uchun manfiy va nolinchi daraja aniqlanmagan (nolga bo'lish).
//
// ADASHISHLAR: ikkitasi yangi:
//   З62, a⁰ = 0 deb hisoblandi (nol bilan chalkashtirildi);
//   З63, a⁻ⁿ = −aⁿ deb hisoblandi (teskari son o'rniga ishora almashtirildi);
//   З16, javob son bilan tekshirilmadi (11-ekranda, qaytadi).
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
  id: 'alg-8-31',
  n: 31,
  row: 35,
  block: 'Б5',
  topic: L(
    "Butun ko'rsatkichli daraja",
    'Степень с целым показателем',
    'Power with an integer exponent',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "a ≠ 0 bo'lsa, a⁰ = 1",
    'Если a ≠ 0, то a⁰ = 1',
    'If a ≠ 0, then a⁰ = 1',
  ),
  L(
    "a ≠ 0 va n natural son bo'lsa, a⁻ⁿ = 1/aⁿ",
    'Если a ≠ 0 и n натуральное, то a⁻ⁿ = 1/aⁿ',
    'If a ≠ 0 and n is natural, then a⁻ⁿ = 1/aⁿ',
  ),
  L(
    "a = 0 uchun nolinchi va manfiy daraja aniqlanmagan",
    'Для a = 0 нулевая и отрицательная степень не определены',
    'For a = 0, the zero and negative powers are not defined',
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
  'З62': {
    what: L(
      "a⁰ nolga teng deb hisoblandi",
      'a⁰ принято равным нулю',
      "a⁰ was taken to equal zero",
    ),
    wrong: '0',
    at: 4,
  },
  'З63': {
    what: L(
      "a⁻ⁿ minus aⁿ deb hisoblandi, teskari son o'rniga ishora almashtirildi",
      'a⁻ⁿ принято равным минус aⁿ, вместо обратного числа поменяли знак',
      'a⁻ⁿ was taken to equal negative aⁿ, swapping the sign instead of taking the reciprocal',
    ),
    wrong: '-8',
    at: 9,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: ikki noldan qanday qiymat chiqadi. Yakun: o'nning
// qatori uchdan minus ikkigacha, ming dan bir yuzdan birgacha.
// ============================================================
const SC_ASK = L('IKKI NOLDAN QIYMAT', 'ЗНАЧЕНИЕ ДВА В СТЕПЕНИ НУЛЬ', 'THE VALUE OF TWO TO THE ZERO')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="22"
        fill={T.ink}>{'2⁰'}</text>
      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="100" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="107" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "O'nning qatori uchdan minus ikkigacha davom etadi",
      'Ряд степеней десяти продолжается от трёх до минус двух',
      "The row of powers of ten continues from three to negative two",
    )}>
      <text x="200" y="22" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fill={T.ink}>{'10³ 10² 10¹ 10⁰ 10⁻¹ 10⁻²'}</text>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <text x="200" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
          fontWeight="700" fill={T.ok}>{'1000  100  10  1  0,1  0,01'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1800ms' }}>
        <text x="200" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fill={T.ink3}>{"har qadam o'nga bo'lish"}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('NOLINCHI DARAJA', 'НУЛЕВАЯ СТЕПЕНЬ', 'THE ZERO POWER'),
  title: L(
    "Ikki nolinchi daraja qanday songa teng",
    'Чему равно два в нулевой степени',
    'What does two to the zero power equal',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki nolinchi daraja. Ko'rsatkich nolga teng.",
      'Два в нулевой степени. Показатель равен нулю.',
      'Two to the zero power. The exponent equals zero.'),
    A('why',
      "Taxmin qiling, natija qanday son bo'ladi.",
      'Предположи, каким будет результат.',
      'Predict what the result will be.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, natija qanday son?",
      'Как думаешь, каков результат?',
      'What do you think the result is?',
    ),
    items: [
      { id: 'zero', show: '0' },
      { id: 'one', show: '1' },
      { id: 'two', show: '2' },
      { id: 'undef', show: L("Aniqlanmagan", 'Не определено', 'Undefined') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Natural ko'rsatkichli daraja (7-sinfdan). Shu tayanch
// 5 va 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Natural ko'rsatkichli darajani eslash",
    'Вспоминаем степень с натуральным показателем',
    'Recalling the power with a natural exponent',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida daraja to'g'ri ochilgan.",
      'Четыре записи. Только в одной степень верно раскрыта.',
      'Four records. Only one correctly expands the power.'),
    A('why',
      "Ko'rsatkich ko'paytiruvchilar sonini aytadi.",
      'Показатель говорит, сколько множителей.',
      'The exponent tells how many factors there are.'),
  ],
  props: {
    ask: L(
      "3⁴ qaysi yozuvda to'g'ri ochilgan?",
      'В какой записи верно раскрыто 3⁴?',
      'In which record is 3⁴ correctly expanded?',
    ),
    items: [
      { id: 'right', show: '3 · 3 · 3 · 3', right: true, name: L("to'rt marta ko'paytiruvchi", 'четыре множителя', 'four factors') },
      {
        id: 'three', show: '3 · 3 · 3',
        hint: L("Bu uch marta, ko'rsatkich to'rt, bir ko'paytiruvchi yetishmaydi.", 'Это три раза, показатель четыре, не хватает множителя.', 'That is three times; the exponent is four, one factor is missing.'),
      },
      {
        id: 'mul', show: '3 · 4',
        hint: L("Bu ko'paytirish, daraja emas.", 'Это умножение, а не степень.', 'That is multiplication, not a power.'),
      },
      {
        id: 'sum', show: '3 + 3 + 3 + 3',
        hint: L("Bu qo'shish, ko'paytirish emas.", 'Это сложение, а не умножение.', 'That is addition, not multiplication.'),
      },
    ],
    after: L(
      "To'g'ri. To'rt ko'rsatkich to'rt marta ko'paytirishni bildiradi.",
      'Верно. Показатель четыре означает четыре множителя.',
      'Correct. The exponent four means four factors.',
    ),
  },
}

// ============================================================
// EKRAN 3. A NI BURANG (1-darsning `steppers`). Manfiy birinchi daraja
// teskari son ekanini kuzatish: a nolga tushganda YO'QOLADI (З63 bilan
// bog'liq, nolga bo'lish emasligini ko'rsatadi).
// ============================================================
const S3 = {
  eyebrow: L('A NI BURANG', 'КРУТИ A', 'TURN A'),
  title: L(
    "Minus birinchi daraja teskari son",
    'Степень минус один, обратное число',
    'The power negative one is the reciprocal',
  ),
  audio: [
    A('mount',
      "A ning minus birinchi darajasi bir bo'lingan a ga teng.",
      'A в степени минус один равно единице, делённой на a.',
      'A to the power negative one equals one divided by a.'),
    A('why',
      "Ikki maqsad beriladi. a ning turli qiymatlarida natijani toping.",
      'Даны две цели. Находи результат при разных значениях a.',
      'Two targets are given. Find the result at different values of a.'),
    A('why',
      "Oxirida a ni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти a до нуля и посмотри, что будет.',
      'At the end bring a down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'a', label: L('a ning qiymati', 'значение a', 'the value of a'),
        start: -4, min: -4, max: 4, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : Math.round((1 / v[0]) * 100) / 100),
    resultLabel: L('a⁻¹', 'a⁻¹', 'a⁻¹'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "a hali nolga tushmasin, avval maqsadlarni oling.",
      'a пока не опускай до нуля, сначала возьми цели.',
      'Do not bring a down to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: -0.25,
        ask: L("Natija minus 0,25 ga teng bo'lsin", 'Пусть результат будет равен минус 0,25', 'Make the result equal negative 0.25'),
        after: L(
          "Minus 0,25. Minus to'rtning teskarisi minus bir bo'lingan to'rt.",
          'Минус 0,25. Обратное к минус четырём, минус одна четвёртая.',
          'Negative 0.25. The reciprocal of negative four is negative one quarter.',
        ),
      },
      {
        value: 0.5,
        ask: L("Endi natija 0,5 ga teng bo'lsin", 'Теперь пусть результат будет равен 0,5', 'Now make the result equal 0.5'),
        after: L(
          "0,5. Ikkining teskarisi bir bo'lingan ikki.",
          '0,5. Обратное к двум, одна вторая.',
          '0.5. The reciprocal of two is one half.',
        ),
      },
    ],
    ask: L("Natija minus 0,25 ga teng bo'lsin", 'Пусть результат будет равен минус 0,25', 'Make the result equal negative 0.25'),
    ask2: L("Endi a ni nolga tushiring", 'Теперь опусти a до нуля', 'Now bring a down to zero'),
    broke: L(
      "a nolga teng bo'lganda natija yo'q, chunki nolga bo'lish mumkin emas. Shuning uchun nol uchun manfiy daraja aniqlanmagan.",
      'При a равном нулю результата нет, потому что делить на нуль нельзя. Поэтому для нуля отрицательная степень не определена.',
      'With a equal to zero there is no result, because dividing by zero is not possible. That is why the negative power is not defined for zero.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI QIYMAT TO'G'RI (1-darsning `pick`). Ловушка, a⁰ nol deb
// hisoblangan (З62).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI QIYMAT TO\'G\'RI', 'КАКОЕ ЗНАЧЕНИЕ ВЕРНО', 'WHICH VALUE IS CORRECT'),
  title: L(
    "Besh nolinchi darajaning qiymati qaysi",
    'Каково значение пяти в нулевой степени',
    'What is the value of five to the zero power',
  ),
  audio: [
    A('mount',
      "To'rt javob taklif qilinadi. Faqat bittasi to'g'ri.",
      'Предложены четыре ответа. Только один верный.',
      'Four answers are proposed. Only one is correct.'),
    A('why',
      "Nolinchi daraja doim bir, asos nolga teng bo'lmasa.",
      'Нулевая степень всегда равна единице, если основание не равно нулю.',
      'The zero power is always one, as long as the base is not zero.'),
  ],
  props: {
    ask: L(
      "5⁰ ning qiymati qaysi?",
      'Каково значение 5⁰?',
      'What is the value of 5⁰?',
    ),
    items: [
      { id: 'right', show: '1', right: true, name: L("nolinchi daraja doim bir", 'нулевая степень всегда единица', 'the zero power is always one') },
      {
        id: 'zero', show: '0',
        hint: L("Nol emas, nolinchi daraja qator davomida bir chiqadi.", 'Не нуль, в продолжении ряда нулевая степень выходит единицей.', 'Not zero; continuing the row, the zero power comes out one.'),
      },
      {
        id: 'five', show: '5',
        hint: L("Bu birinchi daraja, nolinchi emas.", 'Это первая степень, а не нулевая.', 'That is the first power, not the zero one.'),
      },
      {
        id: 'undef', show: L("Aniqlanmagan", 'Не определено', 'Undefined'),
        hint: L("Asos nolga teng bo'lmasa, nolinchi daraja aniqlangan.", 'Если основание не нуль, нулевая степень определена.', 'If the base is not zero, the zero power is defined.'),
      },
    ],
    after: L(
      "To'g'ri. Besh nolga teng emas, shuning uchun nolinchi darajasi bir.",
      'Верно. Пять не равно нулю, поэтому его нулевая степень равна единице.',
      'Correct. Five is not zero, so its zero power equals one.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI, DARAJA QATORI (`ladder`). O'nning qatori
// uchdan minus ikkigacha davom etadi.
// ============================================================
const S5 = {
  eyebrow: L('QATORNI DAVOM ETTIRAMIZ', 'ПРОДОЛЖАЕМ РЯД', 'WE CONTINUE THE ROW'),
  title: L(
    "O'nning qatorini nolinchi va manfiy darajagacha davom ettiring",
    'Продолжи ряд степеней десяти до нулевой и отрицательной',
    'Continue the row of powers of ten to the zero and negative power',
  ),
  audio: [
    A('mount',
      "Ming, yuz, o'n. Har qadamda o'ngga bo'linadi.",
      'Тысяча, сто, десять. На каждом шаге деление на десять.',
      'A thousand, a hundred, ten. Each step is division by ten.'),
    A('why',
      "Qatorni davom ettiring, qadam o'zgarmaydi.",
      'Продолжай ряд, шаг не меняется.',
      'Continue the row, the step stays the same.'),
    W('l3',
      "Nolinchi daraja chiqdi, u ham qadamning davomi.",
      'Вышла нулевая степень, она тоже продолжение шага.',
      'The zero power came out, it too is a continuation of the step.'),
  ],
  props: {
    base: 10,
    known: 2,
    rows: [
      { e: 3 },
      { e: 2 },
      { e: 1 },
      { e: 0 },
      { e: -1 },
      { e: -2 },
    ],
    stepLabel: L(': 10', ': 10', ': 10'),
    labels: {
      pow: L('DARAJA', 'СТЕПЕНЬ', 'POWER'),
      val: L('QIYMAT', 'ЗНАЧЕНИЕ', 'VALUE'),
    },
    ask: L(
      "Keyingi qiymatni yozing",
      'Запиши следующее значение',
      'Write the next value',
    ),
    hints: {
      '0': L(
        "Nol chiqmaydi. Har qadam o'nga BO'LISH, ayirish emas.",
        'Нуль не выйдет. Каждый шаг это ДЕЛЕНИЕ на десять, а не вычитание.',
        'Zero will not come out. Each step is DIVISION by ten, not subtraction.',
      ),
      '*': L(
        "Yuqoridagi qiymatni o'nga bo'ling.",
        'Раздели значение сверху на десять.',
        'Divide the value above by ten.',
      ),
    },
    after: L(
      "To'g'ri. Qator hech qayerda to'xtamaydi, nolinchi va manfiy daraja ham qadamning davomi.",
      'Верно. Ряд не останавливается, нулевая и отрицательная степень, тоже продолжение шага.',
      'Correct. The row does not stop anywhere; the zero and negative power are also a continuation of the step.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): a⁰ = 1 ni ikki yo'l bilan
// ko'rish, qator va bo'lish qoidasi.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "a⁰ = 1 ni ikki yo'l bilan ko'rish",
    'Увидеть a⁰ = 1 двумя способами',
    'Seeing a⁰ = 1 two ways',
  ),
  audio: [
    A('mount',
      "Bitta xulosa va ikki yo'l. Ikkalasi ham bir xil natijani beradi.",
      'Один вывод и два пути. Оба дают один результат.',
      'One conclusion and two ways. Both give the same result.'),
    W('w2',
      "Birinchi yo'lda qatorni davom ettirib topiladi.",
      'В первом пути находится продолжением ряда.',
      'In the first way it is found by continuing the row.'),
    W('w4',
      "Ikkinchi yo'lda bo'lish qoidasidan kelib chiqadi.",
      'Во втором пути следует из правила деления.',
      'In the second way it follows from the division rule.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL, QATOR', 'СПОСОБ 1, РЯД', 'METHOD 1, THE ROW'),
        lead: L(
          "2³, 2², 2¹ qatorini davom ettiramiz",
          'Продолжаем ряд 2³, 2², 2¹',
          'We continue the row 2³, 2², 2¹',
        ),
        rows: [
          { text: '8, 4, 2' },
          { text: '2⁰ = 1', tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL, BO\'LISH QOIDASI', 'СПОСОБ 2, ПРАВИЛО ДЕЛЕНИЯ', 'METHOD 2, THE DIVISION RULE'),
        lead: L(
          "2³ ni 2³ ga bo'lamiz",
          'Делим 2³ на 2³',
          'We divide 2³ by 2³',
        ),
        rows: [
          { text: '2³⁻³ = 2⁰' },
          { text: L("sekin har qanday son o'ziga bo'linsa bir chiqadi", 'ведь любое число, делённое на себя, даёт единицу', 'since any number divided by itself gives one'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Qator ko'rgazmali, bo'lish qoidasi esa har doim ishlaydi",
          'Ряд нагляден, а правило деления работает всегда',
          'The row is visual, the division rule always works',
        ),
        rows: [{ text: '2⁰ = 1', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): nega a⁻ⁿ teskari son, ishora
// emas.
// ============================================================
const S7 = {
  eyebrow: L('NEGA TESKARI SON', 'ПОЧЕМУ ОБРАТНОЕ ЧИСЛО', 'WHY THE RECIPROCAL'),
  title: L(
    "Nega a⁻ⁿ teskari son, ishora emas",
    'Почему a⁻ⁿ это обратное число, а не знак',
    'Why a⁻ⁿ is the reciprocal, not a sign',
  ),
  audio: [
    A('mount',
      "aⁿ dan a⁻ⁿ ga o'tish uchun ikki n marta o'ngga bo'linadi.",
      'От aⁿ до a⁻ⁿ нужно две n раз разделить на a.',
      'Going from aⁿ to a⁻ⁿ requires dividing by a twice n times.'),
    W('p2',
      "aⁿ dan a⁰ ga n marta bo'linadi, a⁰ dan a⁻ⁿ ga yana n marta bo'linadi.",
      'От aⁿ до a⁰ делим n раз, от a⁰ до a⁻ⁿ делим ещё n раз.',
      'From aⁿ to a⁰ we divide n times, from a⁰ to a⁻ⁿ we divide n more times.'),
    W('p4',
      "Shuning uchun a minus n daraja bir bo'lingan a n darajaga teng, u teskari son, ishorasi almashmaydi.",
      'Поэтому a⁻ⁿ равно единице, делённой на aⁿ, это обратное число, знак не меняется.',
      'That is why a⁻ⁿ equals one divided by aⁿ, the reciprocal; the sign does not change.',
    ),
  ],
  props: {
    tokens: [
      { t: 'aⁿ', id: 'a' },
      { t: '  →  a⁰ = 1  →  ', id: 'sign' },
      { t: 'a⁻ⁿ = 1/aⁿ', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qadam. aⁿ dan boshlab, har qadamda a ga bo'linadi.",
          'Первый шаг. Начиная с aⁿ, на каждом шаге делим на a.',
          'Step one. Starting from aⁿ, we divide by a at each step.',
        ),
      },
      {
        focus: 'sign',
        text: L(
          "Ikkinchi qadam. N qadamdan keyin a⁰ = 1 ga yetiladi.",
          'Второй шаг. После n шагов доходим до a⁰ = 1.',
          'Step two. After n steps we reach a⁰ = 1.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qadam. Yana n marta bo'linsa, a⁻ⁿ = 1/aⁿ chiqadi, ishora emas, teskari son.",
          'Третий шаг. Ещё n раз разделив, получаем a⁻ⁿ = 1/aⁿ, это обратное число, а не знак.',
          'Step three. Dividing n more times gives a⁻ⁿ = 1/aⁿ, the reciprocal, not a sign.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Manfiy ko'rsatkichli daraja tushunchasi ingliz matematigi Jon Vallis tomonidan XVII asrda kiritilgan.",
        'Понятие степени с отрицательным показателем ввёл английский математик Джон Валлис в семнадцатом веке.',
        'The concept of a power with a negative exponent was introduced by the English mathematician John Wallis in the seventeenth century.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIKDA ALOHIDA SAHIFA YO'Q:
// qoida 9-§ misollari asosida umumlashtirilgan.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Nolinchi va manfiy daraja",
    'Нулевая и отрицательная степень',
    'The zero and negative power',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Qoida ochildi, va xukdagi qarz to'landi.",
      'Правило открылось, и долг с хука оплачен.',
      'The rule opened, and the debt from the hook is paid.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("a ≠ 0 bo'lsa", 'если a ≠ 0', 'if a ≠ 0') },
      { id: 'f2', label: L("a⁰ = 1", 'то a⁰ = 1', 'then a⁰ = 1') },
      { id: 'f3', label: L("a ≠ 0 va n natural bo'lsa", 'если a ≠ 0 и n натуральное', 'if a ≠ 0 and n is natural') },
      { id: 'f4', label: L("a⁻ⁿ = 1/aⁿ", 'то a⁻ⁿ = 1/aⁿ', 'then a⁻ⁿ = 1/aⁿ') },
      { id: 'w1', label: L("a⁻ⁿ = −aⁿ", 'a⁻ⁿ = −aⁿ', 'a⁻ⁿ = −aⁿ') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Manfiy ko'rsatkich TESKARI SONNI beradi, ishorani emas.",
      'Так не складывается. Отрицательный показатель даёт ОБРАТНОЕ ЧИСЛО, а не смену знака.',
      'That does not fit. A negative exponent gives the RECIPROCAL, not a sign change.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darsda umumlashtirilgan, darslik 9-§ misollari asosida (42-47-bet)",
        'Правило обобщено в уроке, на основе примеров § 9 учебника (стр. 42–47)',
        'The rule is generalized in the lesson, based on the examples of textbook section 9 (pages 42–47)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Ikki nolinchi daraja qanday son ekanini hali bilmaymiz",
        'Мы пока не знаем, чему равно два в нулевой степени',
        'We still do not know what two to the zero power equals',
      ),
      right: L(
        "endi qatorni davom ettirib, bir ekanini bilamiz",
        'теперь, продолжив ряд, знаем, что это единица',
        'now, having continued the row, we know it is one',
      ),
      winner: 'right',
      note: L(
        "Nolinchi daraja bir, manfiy daraja teskari son",
        'Нулевая степень единица, отрицательная степень обратное число',
        'The zero power is one, the negative power is the reciprocal',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): butun ko'rsatkichli darajani
// hisoblang.
// ============================================================
const ASK_VALUE = L('Qiymati qaysi?', 'Каково значение?', 'What is the value?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Darajaning qiymatini hisoblang",
    'Вычисли значение степени',
    'Compute the value of the power',
  ),
  audio: [
    A('mount',
      "Besh daraja. Har birida ko'rsatkich nol yoki manfiy.",
      'Пять степеней. В каждой показатель нуль или отрицательный.',
      'Five powers. In each, the exponent is zero or negative.'),
    A('why',
      "Manfiy ko'rsatkich teskari sonni beradi, ishorani emas.",
      'Отрицательный показатель даёт обратное число, а не смену знака.',
      'A negative exponent gives the reciprocal, not a sign change.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar teskari son to'g'ri topilgan.",
      'Все пять разобраны. Каждый раз верно находилось обратное число.',
      'All five are done. Each time the reciprocal was correctly found.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'7⁰'}</Row>,
        ok: L("Ha. Yetti nolga teng emas, nolinchi darajasi bir.", 'Да. Семь не равно нулю, его нулевая степень равна единице.', 'Yes. Seven is not zero, its zero power equals one.'),
        question: ASK_VALUE,
        items: [
          { id: 'a', right: true, label: '1' },
          { id: 'b', label: '0', hint: L("Yetti nolga teng emas, nolinchi daraja bir chiqadi.", 'Семь не равно нулю, нулевая степень выходит единицей.', 'Seven is not zero, the zero power comes out one.') },
        ],
        solution: ['7⁰', '1'],
      },
      {
        expr: <Row size="big" align="center">{'2⁻³'}</Row>,
        ok: L("Ha. Ikki kub sakkiz, teskarisi bir bo'lingan sakkiz.", 'Да. Два в кубе восемь, обратное, одна восьмая.', 'Yes. Two cubed is eight, the reciprocal is one eighth.'),
        question: ASK_VALUE,
        items: [
          { id: 'a', right: true, label: '1/8' },
          { id: 'b', label: '−8', hint: L("Bu ishora almashtirish, teskari son emas. Ikki kub sakkiz, teskarisi bir bo'lingan sakkiz.", 'Это смена знака, а не обратное число. Два в кубе восемь, обратное, одна восьмая.', 'That is a sign change, not the reciprocal. Two cubed is eight, the reciprocal is one eighth.') },
        ],
        solution: ['2³', '8', '2⁻³ = 1/8'],
      },
      {
        expr: <Row size="big" align="center">{'5⁻¹'}</Row>,
        ok: L("Ha. Beshning teskarisi bir bo'lingan besh.", 'Да. Обратное к пяти, одна пятая.', 'Yes. The reciprocal of five is one fifth.'),
        question: ASK_VALUE,
        items: [
          { id: 'a', right: true, label: '1/5' },
          { id: 'b', label: '−5', hint: L("Teskari son kerak, ishora emas.", 'Нужно обратное число, а не смена знака.', 'The reciprocal is needed, not a sign change.') },
        ],
        solution: ['5⁻¹', '1/5'],
      },
      {
        expr: <Row size="big" align="center">{'(−3)⁰'}</Row>,
        ok: L("Ha. Minus uch nolga teng emas, nolinchi darajasi bir.", 'Да. Минус три не равно нулю, его нулевая степень равна единице.', 'Yes. Negative three is not zero, its zero power equals one.'),
        question: ASK_VALUE,
        items: [
          { id: 'a', right: true, label: '1' },
          { id: 'b', label: '−1', hint: L("Nolinchi daraja doim bir, asos manfiy bo'lsa ham.", 'Нулевая степень всегда единица, даже если основание отрицательно.', 'The zero power is always one, even if the base is negative.') },
        ],
        solution: ['(−3)⁰', '1'],
      },
      {
        expr: <Row size="big" align="center">{'10⁻²'}</Row>,
        ok: L("Ha. O'n kvadrat yuz, teskarisi bir bo'lingan yuz, ya'ni 0,01.", 'Да. Десять в квадрате сто, обратное, одна сотая, то есть 0,01.', 'Yes. Ten squared is a hundred, the reciprocal is one hundredth, that is 0.01.'),
        question: ASK_VALUE,
        items: [
          { id: 'a', right: true, label: '0,01' },
          { id: 'b', label: '−100', hint: L("Teskari son kerak, ishora almashtirish emas.", 'Нужно обратное число, а не смена знака.', 'The reciprocal is needed, not a sign change.') },
        ],
        solution: ['10²', '100', '10⁻² = 0,01'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): ifodani darajasiz yozing.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ifodani darajasiz yozing",
    'Запиши выражение без степени',
    'Write the expression without a power',
  ),
  audio: [
    A('mount',
      "Uch ifoda. Har birini kasr sifatida yozing.",
      'Три выражения. Каждое запиши в виде дроби.',
      'Three expressions. Write each as a fraction.'),
    A('why',
      "Manfiy ko'rsatkichli daraja maxrajga o'tadi.",
      'Степень с отрицательным показателем переходит в знаменатель.',
      'A power with a negative exponent moves to the denominator.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar manfiy ko'rsatkich maxrajga o'tgan.",
      'Все три разобраны. Каждый раз отрицательный показатель переходил в знаменатель.',
      'All three are done. Each time the negative exponent moved to the denominator.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x⁻²'}</Row>,
        ok: L("Ha. Manfiy ko'rsatkich maxrajga o'tib, ishorasi musbat bo'ladi.", 'Да. Отрицательный показатель переходит в знаменатель и становится положительным.', 'Yes. The negative exponent moves to the denominator and becomes positive.'),
        question: L("Darajasiz yozuv qaysi?", 'Какая запись без степени?', 'Which record is without a power?'),
        items: [
          { id: 'a', right: true, label: '1/x²' },
          { id: 'b', label: '−1/x²', hint: L("Ishora almashmaydi, faqat maxrajga o'tadi.", 'Знак не меняется, только переходит в знаменатель.', 'The sign does not change, it only moves to the denominator.') },
        ],
        solution: ['x⁻²', '1/x²'],
      },
      {
        expr: <Row size="big" align="center">{'3x⁻¹'}</Row>,
        ok: L("Ha. Faqat x ning ko'rsatkichi maxrajga o'tadi, uch koeffitsiyent bo'lib qoladi.", 'Да. В знаменатель переходит только показатель x, три остаётся коэффициентом.', 'Yes. Only the exponent of x moves to the denominator; three stays as the coefficient.'),
        question: L("Darajasiz yozuv qaysi?", 'Какая запись без степени?', 'Which record is without a power?'),
        items: [
          { id: 'a', right: true, label: '3/x' },
          { id: 'b', label: '1/(3x)', hint: L("Uch koeffitsiyent, u ham maxrajga o'tib ketmaydi.", 'Три это коэффициент, он не переходит в знаменатель.', 'Three is the coefficient; it does not move to the denominator too.') },
        ],
        solution: ['3x⁻¹', '3/x'],
      },
      {
        expr: <Row size="big" align="center">{'(2x)⁻²'}</Row>,
        ok: L("Ha. Butun qavs maxrajga o'tib, kvadratga ko'tariladi.", 'Да. Вся скобка переходит в знаменатель и возводится в квадрат.', 'Yes. The whole bracket moves to the denominator and is squared.'),
        question: L("Darajasiz yozuv qaysi?", 'Какая запись без степени?', 'Which record is without a power?'),
        items: [
          { id: 'a', right: true, label: '1/(4x²)' },
          { id: 'b', label: '1/(2x²)', hint: L("Ikki ham kvadratga ko'tariladi, to'rt chiqadi.", 'Двойка тоже возводится в квадрат, получается четыре.', 'The two is also squared, giving four.') },
        ],
        solution: ['(2x)⁻²', '1/(2x)²', '1/(4x²)'],
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
      "Uch taklif qilingan javob. Har birini hisoblab tekshiring.",
      'Предложены три ответа. Каждый проверь вычислением.',
      'Three proposed answers. Check each by computing.'),
    A('why',
      "Darajani ochib, natijani solishtiring.",
      'Раскрой степень и сравни результат.',
      'Expand the power and compare the result.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло ответ.',
      'All three are done. Each time computation checked the answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'4⁻¹   →   1/4'}</Row>,
        ok: L("Ha. To'rtning teskarisi bir bo'lingan to'rt.", 'Да. Обратное к четырём, одна четвёртая.', 'Yes. The reciprocal of four is one quarter.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("To'rtning teskarisi rostdan ham bir bo'lingan to'rt.", 'Обратное к четырём действительно одна четвёртая.', 'The reciprocal of four is indeed one quarter.') },
        ],
        solution: ['4⁻¹', '1/4'],
      },
      {
        expr: <Row size="big" align="center">{'6⁰   →   6'}</Row>,
        ok: L("Yo'q. Nolinchi daraja doim bir, asosning o'zi emas.", 'Нет. Нулевая степень всегда единица, а не само основание.', 'No. The zero power is always one, not the base itself.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Nolinchi daraja bir chiqadi, olti emas.", 'Нулевая степень выходит единицей, а не шестью.', 'The zero power comes out one, not six.') },
        ],
        solution: ['6⁰', '1'],
      },
      {
        expr: <Row size="big" align="center">{'2⁻⁴   →   1/16'}</Row>,
        ok: L("Ha. Ikki to'rtinchi daraja o'n olti, teskarisi bir bo'lingan o'n olti.", 'Да. Два в четвёртой степени шестнадцать, обратное, одна шестнадцатая.', 'Yes. Two to the fourth is sixteen, the reciprocal is one sixteenth.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikki to'rtinchi daraja rostdan ham o'n olti.", 'Два в четвёртой степени действительно шестнадцать.', 'Two to the fourth is indeed sixteen.') },
        ],
        solution: ['2⁴', '16', '2⁻⁴ = 1/16'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): a⁻ⁿ ishora almashtirish
// bilan chalkashtirilgan (З63).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Teskari son yoki ishora almashtirish",
    'Обратное число или смена знака',
    'The reciprocal or a sign change',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham teskari son o'rniga ishora almashtirilgan.",
      'Два задания. В обоих вместо обратного числа сменили знак.',
      'Two tasks. In both, the sign was changed instead of taking the reciprocal.'),
    A('why',
      "Manfiy ko'rsatkich har doim teskari sonni beradi, ishorani emas.",
      'Отрицательный показатель всегда даёт обратное число, а не смену знака.',
      'A negative exponent always gives the reciprocal, never a sign change.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Manfiy ko'rsatkich har doim teskari son beradi.",
      'Оба разобраны. Отрицательный показатель всегда даёт обратное число.',
      'Both are done. A negative exponent always gives the reciprocal.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3⁻²   →   −9'}</Row>,
        ok: L("Ha. Uch kvadrat to'qqiz, teskarisi bir bo'lingan to'qqiz bo'lishi kerak edi, minus to'qqiz emas.", 'Да. Три в квадрате девять, обратное должно быть одной девятой, а не минус девятью.', 'Yes. Three squared is nine, the reciprocal should be one ninth, not negative nine.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Teskari son o'rniga ishora almashtirilgan", 'Вместо обратного числа сменили знак', 'The sign was changed instead of the reciprocal') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, teskari son bir bo'lingan to'qqiz bo'lishi kerak edi.", 'Это и есть показанная ошибка, обратное должно быть одной девятой.', 'This is the very mistake shown; the reciprocal should be one ninth.') },
        ],
        solution: ['3²', '9', '3⁻² = 1/9'],
      },
      {
        expr: <Row size="big" align="center">{'4⁻¹   →   −4'}</Row>,
        ok: L("Ha. To'rtning teskarisi bir bo'lingan to'rt bo'lishi kerak edi, minus to'rt emas.", 'Да. Обратное к четырём должно быть одной четвёртой, а не минус четыре.', 'Yes. The reciprocal of four should be one quarter, not negative four.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Teskari son o'rniga ishora almashtirilgan", 'Вместо обратного числа сменили знак', 'The sign was changed instead of the reciprocal') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, teskari son bir bo'lingan to'rt bo'lishi kerak edi.", 'Это и есть показанная ошибка, обратное должно быть одной четвёртой.', 'This is the very mistake shown; the reciprocal should be one quarter.') },
        ],
        solution: ['4⁻¹', '1/4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH (1-darsning `fill`): darajani qadamlab hisoblash.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Manfiy ko'rsatkichli darajani qadamlab hisoblang",
    'Вычисли степень с отрицательным показателем по шагам',
    'Compute the power with a negative exponent step by step',
  ),
  audio: [
    A('mount',
      "Daraja berilgan. Avval musbat ko'rsatkichli qiymatni, keyin teskarisini toping.",
      'Дана степень. Сначала найди значение с положительным показателем, потом обратное.',
      'A power is given. First find the value with the positive exponent, then its reciprocal.'),
    A('why',
      "Ikkinchi qadamda ishorani emas, teskari sonni yozing.",
      'На втором шаге запиши обратное число, а не смену знака.',
      'In the second step, write the reciprocal, not a sign change.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar musbat qiymat teskari sonni bergan.",
      'Все три заполнены. Каждый раз положительное значение давало обратное число.',
      'All three are filled. Each time the positive value gave the reciprocal.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['9', '1/9'],
      lines: [
        [{ t: '3² = ' }, { slot: '9' }, { t: '   →   3⁻² = ' }, { slot: '1/9' }],
      ],
    },
    tasks: [
      {
        chips: ['25', '1/25'],
        lines: [
          [{ t: '5² = ' }, { slot: '25' }, { t: '   →   5⁻² = ' }, { slot: '1/25' }],
        ],
      },
      {
        chips: ['64', '1/64'],
        lines: [
          [{ t: '4³ = ' }, { slot: '64' }, { t: '   →   4⁻³ = ' }, { slot: '1/64' }],
        ],
      },
      {
        chips: ['49', '1/49'],
        lines: [
          [{ t: '7² = ' }, { slot: '49' }, { t: '   →   7⁻² = ' }, { slot: '1/49' }],
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
    "Butun ko'rsatkich bo'yicha to'rt savol",
    'Четыре вопроса о целом показателе',
    'Four questions about the integer exponent',
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
        id: 'q1', tag: 'З62',
        ask: L('9⁰ ning qiymati qaysi?', 'Каково значение 9⁰?', 'What is the value of 9⁰?'),
        options: [
          { id: 'ok', right: true, label: '1' },
          { id: 'zero', label: '0' },
          { id: 'nine', label: '9' },
          { id: 'undef', label: L("Aniqlanmagan", 'Не определено', 'Undefined') },
        ],
        hint: L("To'qqiz nolga teng emas, nolinchi darajasi bir.", 'Девять не равно нулю, его нулевая степень равна единице.', 'Nine is not zero, its zero power equals one.'),
        ok: L("To'g'ri, nolinchi daraja doim bir.", 'Верно, нулевая степень всегда единица.', 'Correct, the zero power is always one.'),
      },
      {
        id: 'q2', tag: 'З63',
        ask: L('6⁻¹ ning qiymati qaysi?', 'Каково значение 6⁻¹?', 'What is the value of 6⁻¹?'),
        options: [
          { id: 'ok', right: true, label: '1/6' },
          { id: 'neg', label: '−6' },
          { id: 'six', label: '6' },
        ],
        hint: L("Manfiy ko'rsatkich teskari sonni beradi.", 'Отрицательный показатель даёт обратное число.', 'A negative exponent gives the reciprocal.'),
        ok: L("To'g'ri, oltining teskarisi bir bo'lingan olti.", 'Верно, обратное к шести, одна шестая.', 'Correct, the reciprocal of six is one sixth.'),
      },
      {
        id: 'q3', tag: 'З62',
        ask: L('0⁰ nima uchun aniqlanmagan?', 'Почему 0⁰ не определено?', 'Why is 0⁰ undefined?'),
        options: [
          { id: 'ok', right: true, label: L("Chunki qoida faqat a ≠ 0 uchun ishlaydi", 'Потому что правило работает только при a ≠ 0', 'Because the rule only works for a ≠ 0') },
          { id: 'wrong', label: L("Chunki nol juda kichik", 'Потому что нуль слишком мал', 'Because zero is too small') },
        ],
        hint: L("Qator asosi nolga teng bo'lganda ishlamaydi.", 'Ряд не работает, когда основание равно нулю.', 'The row does not work when the base equals zero.'),
        ok: L("To'g'ri, asos nolga teng bo'lmasligi shart.", 'Верно, условие, что основание не равно нулю, обязательно.', 'Correct, the condition that the base is not zero is required.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('3⁻² = 1/9 to\'g\'rimi?', 'Верно ли 3⁻² = 1/9?', 'Is 3⁻² = 1/9 correct?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Uch kvadrat to'qqiz, teskarisi bir bo'lingan to'qqiz.", 'Три в квадрате девять, обратное, одна девятая.', 'Three squared is nine, the reciprocal is one ninth.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З62',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "12⁰ va 2⁻³ ning qiymatlarini yig'ing.",
            'Собери значения 12⁰ и 2⁻³.',
            'Assemble the values of 12⁰ and 2⁻³.',
          ),
          lines: [
            [{ t: '12⁰ = ' }, { slot: '1' }, { t: ',   2⁻³ = ' }, { slot: '1/8' }],
          ],
          tiles: [
            { id: 't1', v: '1', x: 12, y: 12 },
            { id: 't2', v: '1/8', x: 70, y: 14 },
            { id: 't3', v: '0', x: 40, y: 50 },
            { id: 't4', v: '−8', x: 78, y: 48 },
          ],
          hint: L(
            "O'n ikki nolga teng emas, nolinchi darajasi bir. Ikki kub sakkiz, teskarisi bir bo'lingan sakkiz.",
            'Двенадцать не равно нулю, нулевая степень единица. Два в кубе восемь, обратное, одна восьмая.',
            'Twelve is not zero, the zero power is one. Two cubed is eight, the reciprocal is one eighth.',
          ),
          doneNote: L(
            "Yig'ildi. Ikkalasi ham qator davomi sifatida chiqdi.",
            'Собрано. Оба вышли как продолжение ряда.',
            'Assembled. Both came out as a continuation of the row.',
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
    "Nolinchi daraja bir, manfiy daraja teskari son",
    'Нулевая степень единица, отрицательная степень, обратное число',
    'The zero power is one, the negative power is the reciprocal',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. O'nning qatori uchdan minus ikkigacha davom etadi.",
      'С урока остаётся одна запись. Ряд степеней десяти продолжается от трёх до минус двух.',
      'One record stays with you. The row of powers of ten continues from three to negative two.'),
    A('s1',
      "Bugun uch narsa qilindi. Qatorni pastga davom ettirdingiz, nolinchi darajaning birga tengligini ko'rdingiz va manfiy darajaning teskari son ekanini bildingiz.",
      'Сегодня сделано три вещи. Ты продолжил ряд вниз, увидел, что нулевая степень равна единице, и узнал, что отрицательная степень, обратное число.',
      'Three things are done today. You continued the row downward, saw that the zero power equals one, and learned that the negative power is the reciprocal.'),
    A('s2',
      "Keyingi darsda darajaning xossalari. Ular butun ko'rsatkich uchun ham to'g'ri ekanini ko'rasiz.",
      'В следующем уроке свойства степени. Увидишь, что они верны и для целого показателя.',
      'The next lesson covers the properties of powers. You will see they hold for the integer exponent too.',
    ),
  ],
  props: {
    mark: '10³, 10², 10¹, 10⁰, 10⁻¹, 10⁻²',
    markNote: L(
      "1000, 100, 10, 1, 0,1, 0,01",
      '1000, 100, 10, 1, 0,1, 0,01',
      '1000, 100, 10, 1, 0.1, 0.01',
    ),
    lines: [
      L(
        "a ≠ 0 bo'lsa, a⁰ = 1",
        'Если a ≠ 0, то a⁰ = 1',
        'If a ≠ 0, then a⁰ = 1',
      ),
      L(
        "a ≠ 0 bo'lsa, a⁻ⁿ = 1/aⁿ",
        'Если a ≠ 0, то a⁻ⁿ = 1/aⁿ',
        'If a ≠ 0, then a⁻ⁿ = 1/aⁿ',
      ),
      L(
        "manfiy ko'rsatkich ishorani emas, teskari sonni beradi",
        'Отрицательный показатель даёт не смену знака, а обратное число',
        'A negative exponent gives not a sign change, but the reciprocal',
      ),
    ],
    bridge: L(
      "Keyingi dars: butun ko'rsatkichli darajaning xossalari",
      'Следующий урок: свойства степени с целым показателем',
      'Next lesson: the properties of the power with an integer exponent',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya, 1-darsning asboblari,
// bitta pozitsiya (5-ekran), DARAJA QATORI (`ladder`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З63', 'З62', 'З62',
    'З62', 'З62', 'З62', 'З63', 'З63',
    'З16', 'З63', 'З63', null, null,
  ],
  mechanic: { at: 5, tool: 'ladder', kind: 'continue' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
