// ============================================================================
// 8-sinf, Dars 25. BIR NOMA'LUMLI CHIZIQLI TENGSIZLIKLAR.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `twosides.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `twosides`: had ko'chiriladi, ikkala qism
// songa bo'linadi, natija — to'g'ri chiziqdagi NUR (24-darsdagi ishoralarni
// ishlatadi, ammo endi noma'lum x uchun).
//
// DARSNING ISHI (darslik, 15-§, 85-89-bet):
//   1) ax > b, ax < b, ax ≥ b, ax ≤ b — bir noma'lumli chiziqli tengsizlik;
//   2) yechim — tengsizlikni to'g'ri sonli tengsizlikka aylantiruvchi x;
//   3) 1-xossa: had ko'chirilganda ISHORASI o'zgaradi (tenglamadagidek);
//   4) 2-xossa: ikkala qism songa ko'paytirilsa/bo'linsa, manfiyda tengsizlik
//      ISHORASI buriladi (23-24-darslardan);
//   5) yechim to'g'ri chiziqda NUR: qat'iy tengsizlikda ochiq nuqta, qat'iy
//      bo'lmaganda to'la nuqta.
//
// DARSLIK. O'zbek darsligi, 15-§, 85-89-bet: ta'rif, yechim ta'rifi, x + 1 >
// 7 − 2x namunasi (2-masala, 86-87-bet), ochiq nuqta bilan chizmalar.
//
// ADASHISHLAR: bittasi yangi, bittasi qaytadi:
//   З54 — chegara nuqtasi (x = 2) yechimga kiritildi, qat'iy tengsizlikda
//         u yechim EMAS;
//   З52 — manfiy songa bo'linganda ishora burilmadi (qaytadi, 24-darsdan);
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
  id: 'alg-8-25',
  n: 25,
  row: 28,
  block: 'Б4',
  topic: L(
    "Bir noma'lumli chiziqli tengsizliklar",
    'Линейные неравенства с одной переменной',
    'Linear inequalities in one variable',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "ax > b, ax < b, ax ≥ b, ax ≤ b ko'rinishidagi tengsizlik bir noma'lumli chiziqli tengsizlik deyiladi",
    'Неравенство вида ax > b, ax < b, ax ≥ b, ax ≤ b называется линейным неравенством с одной переменной',
    'An inequality of the form ax > b, ax < b, ax ≥ b, ax ≤ b is called a linear inequality in one variable',
  ),
  L(
    "noma'lumning tengsizlikni to'g'ri sonli tengsizlikka aylantiradigan qiymati uning yechimi deyiladi",
    'Значение переменной, обращающее неравенство в верное числовое неравенство, называется его решением',
    "A value of the variable that turns the inequality into a true numerical inequality is called its solution",
  ),
  L(
    "had ko'chirilganda ishorasi o'zgaradi, ikkala qism manfiy songa ko'paytirilsa tengsizlik ishorasi buriladi",
    'При переносе члена его знак меняется, а при умножении обеих частей на отрицательное число знак неравенства переворачивается',
    "When a term is moved across, its sign changes, and multiplying both sides by a negative number flips the inequality's sign",
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
  'З52': {
    what: L(
      "manfiy songa bo'linganda ishora burilmadi",
      'при делении на отрицательное число знак не был перевёрнут',
      'when dividing by a negative number, the sign was not flipped',
    ),
    wrong: '-3',
    at: 4,
  },
  'З54': {
    what: L(
      "chegara nuqtasi qat'iy tengsizlikka yechim sifatida kiritildi",
      'граничная точка включена как решение строгого неравенства',
      'the boundary point was included as a solution of a strict inequality',
    ),
    wrong: '2',
    at: 3,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: x + 1 > 7 − 2x, x = 1 yechimmi. Yakun: x > 2, ochiq
// nuqta ikkida.
// ============================================================
const SC_ASK = L('X = 1 YECHIMMI', 'ЯВЛЯЕТСЯ X = 1 РЕШЕНИЕМ', 'IS X = 1 A SOLUTION')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="56" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
        fill={T.ink}>{'x + 1 > 7 − 2x'}</text>
      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="96" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="103" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Uch qadamda x katta ikkidan chiqadi, ikki o'zi kirmaydi",
      'За три шага выходит x больше двух, сама двойка не входит',
      'In three steps it comes out x greater than two, two itself is not included',
    )}>
      <text x="70" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink}>{'x + 1 > 7 − 2x'}</text>
      <path d="M148 26 L166 26 M160 20 L166 26 L160 32" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '600ms' }}>
        <text x="220" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.ok}>{'3x > 6'}</text>
      </g>
      <path d="M270 26 L288 26 M282 20 L288 26 L282 32" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <text x="330" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.ok}>{'x > 2'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1800ms' }}>
        <line x1="60" y1="72" x2="340" y2="72" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <rect x="200" y="67" width="140" height="10" rx="5" fill={T.accent} opacity=".85"/>
        <circle cx="200" cy="72" r="4.4" fill={T.paper} stroke={T.accent} strokeWidth="2.4"/>
        <text x="200" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>2</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('X = 1 SINAB KO\'RAMIZ', 'ПРОВЕРИМ X = 1', 'LET US TRY X = 1'),
  title: L(
    "X birga teng bo'lsa, tengsizlik to'g'ri bo'ladimi",
    'Если x равен одному, верно ли неравенство',
    'If x equals one, is the inequality true',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Bir tengsizlik. Unda noma'lum x bor.",
      'Одно неравенство. В нём есть неизвестное x.',
      'One inequality. It has the unknown x.'),
    A('why',
      "Taxmin qiling, x bir bo'lganda tengsizlik to'g'ri chiqadimi.",
      'Предположи, верно ли неравенство при x равном одному.',
      'Predict whether the inequality is true when x equals one.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, x = 1 da tengsizlik to'g'rimi?",
      'Как думаешь, верно ли неравенство при x = 1?',
      'Do you think the inequality is true at x = 1?',
    ),
    items: [
      { id: 'yes', show: L("Ha, to'g'ri", 'Да, верно', 'Yes, true') },
      { id: 'no', show: L("Yo'q, noto'g'ri", 'Нет, неверно', 'No, false') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Had ko'chirish (7-sinf, tenglamadagidek). Shu tayanch
// 5 va 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Hadni ko'chirish",
    'Перенос члена',
    'Moving a term across',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida had to'g'ri ko'chirilgan.",
      'Четыре записи. Только в одной член перенесён верно.',
      'Four records. Only one correctly moves the term across.'),
    A('why',
      "Ko'chirilgan had ishorasini almashtiradi.",
      'Перенесённый член меняет свой знак.',
      'The moved term changes its sign.'),
  ],
  props: {
    ask: L(
      "x + 1 > 7 − 2x dan qaysi yozuv to'g'ri ko'chirilgan?",
      'Из x + 1 > 7 − 2x какая запись верно перенесена?',
      'From x + 1 > 7 − 2x, which record is correctly transposed?',
    ),
    items: [
      { id: 'right', show: 'x + 2x > 7 − 1', right: true, name: L("ikkalasi ham ishorasini almashtirdi", 'оба сменили знак', 'both changed their sign') },
      {
        id: 'onlyone', show: 'x + 2x > 7 + 1',
        hint: L("Bir taraflama ko'chirilgan, o'ng tarafdagi bir ham ishorasini almashtirishi kerak edi.", 'Перенесён только один член, единица справа тоже должна была сменить знак.', 'Only one term was moved; the one on the right should also change its sign.'),
      },
      {
        id: 'noflip', show: 'x − 2x > 7 − 1',
        hint: L("Minus ikki iks o'ngdan ko'chirilganda musbat ikki iks bo'lishi kerak edi.", 'При переносе минус два икс справа должно получиться плюс два икс.', 'Moving negative two x from the right should give positive two x.'),
      },
      {
        id: 'order', show: '2x + x > 1 − 7',
        hint: L("O'ng taraf teskari tartibda yozilgan, bir minus yetti emas, yetti minus bir bo'lishi kerak.", 'Правая часть записана в обратном порядке, должно быть семь минус один, а не наоборот.', 'The right side is written in the reversed order; it should be seven minus one, not the other way.'),
      },
    ],
    after: L(
      "To'g'ri. Minus ikki iks chapga o'tib musbat ikki iks bo'ldi, bir o'ngga o'tib minus bir bo'ldi.",
      'Верно. Минус два икс, перейдя влево, стало плюс два икс, а единица, перейдя вправо, стала минус один.',
      'Correct. Negative two x, moving left, became positive two x, and one, moving right, became negative one.',
    ),
  },
}

// ============================================================
// EKRAN 3. X NI BURANG (1-darsning `steppers`). 1/(x−2) ni kuzatish: x ikkiga
// yaqinlashganda natija ortadi, x ikkiga tenglashganda YO'QOLADI — bu aynan
// x > 2 yechimidagi CHEGARA nuqtasi (З54 bilan bog'liq).
// ============================================================
const S3 = {
  eyebrow: L('X NI BURANG', 'КРУТИ X', 'TURN X'),
  title: L(
    "Ikkiga qanchalik yaqin",
    'Насколько близко к двум',
    'How close to two',
  ),
  audio: [
    A('mount',
      "X ikkidan qancha uzoqligini kuzatamiz. Natija bir bo'lingan x minus ikkiga teng.",
      'Смотрим, насколько x далеко от двух. Результат равен единице, делённой на x минус два.',
      'We watch how far x is from two. The result equals one divided by x minus two.'),
    A('why',
      "Ikki maqsad beriladi. x ning turli qiymatlarida natijani toping.",
      'Даны две цели. Находи результат при разных значениях x.',
      'Two targets are given. Find the result at different values of x.'),
    A('why',
      "Oxirida x ni ikkiga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти x до двух и посмотри, что будет.',
      'At the end bring x down to two and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'x', label: L('x ning qiymati', 'значение x', 'the value of x'),
        start: 6, min: 2, max: 10, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 2 ? null : Math.round((1 / (v[0] - 2)) * 100) / 100),
    resultLabel: L('1/(x−2)', '1/(x−2)', '1/(x−2)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "x hali ikkiga tushmasin, avval maqsadlarni oling.",
      'x пока не опускай до двух, сначала возьми цели.',
      'Do not bring x down to two yet, take the targets first.',
    ),
    goals: [
      {
        value: 0.5,
        ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
        after: L(
          "0,5. To'rtdan ikki ayirilganda ikki qoladi, bir bo'lingan ikki 0,5.",
          '0,5. Четыре минус два равно двум, единица, делённая на два, это 0,5.',
          '0.5. Four minus two is two, one divided by two is 0.5.',
        ),
      },
      {
        value: 1,
        ask: L("Endi natija 1 ga teng bo'lsin", 'Теперь пусть результат будет равен 1', 'Now make the result equal 1'),
        after: L(
          "1. Uchdan ikki ayirilganda bir qoladi, bir bo'lingan bir bir.",
          '1. Три минус два равно одному, единица, делённая на один, это один.',
          '1. Three minus two is one, one divided by one is one.',
        ),
      },
    ],
    ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
    ask2: L("Endi x ni ikkiga tushiring", 'Теперь опусти x до двух', 'Now bring x down to two'),
    broke: L(
      "x ikkiga teng bo'lganda natija yo'q, chunki nolga bo'lish mumkin emas. Shuning uchun ikki yechimga kirmaydi.",
      'При x равном двум результата нет, потому что делить на нуль нельзя. Поэтому два не входит в решение.',
      'With x equal to two there is no result, because dividing by zero is not possible. That is why two is not part of the solution.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI QIYMAT YECHIM (1-darsning `pick`). Ловушка — chegara
// nuqtasi yechim sifatida taklif qilinadi (З54).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI QIYMAT YECHIM', 'КАКОЕ ЗНАЧЕНИЕ РЕШЕНИЕ', 'WHICH VALUE IS A SOLUTION'),
  title: L(
    "3x > 6 ning yechimi qaysi qiymat",
    'Какое значение — решение 3x > 6',
    'Which value is a solution of 3x > 6',
  ),
  audio: [
    A('mount',
      "To'rt qiymat taklif qilinadi. Faqat bittasi tengsizlikni to'g'ri qiladi.",
      'Предложены четыре значения. Только одно делает неравенство верным.',
      'Four values are proposed. Only one makes the inequality true.'),
    A('why',
      "Chegara qiymatning o'zi qat'iy tengsizlikka kirmaydi.",
      'Само граничное значение не входит в строгое неравенство.',
      'The boundary value itself is not part of a strict inequality.'),
  ],
  props: {
    ask: L(
      "3x > 6 ning yechimi qaysi qiymat?",
      'Какое значение является решением 3x > 6?',
      'Which value is a solution of 3x > 6?',
    ),
    items: [
      { id: 'right', show: 'x = 3', right: true, name: L("uch karra uch to'qqiz, oltidan katta", 'три на три девять, больше шести', 'three times three is nine, greater than six') },
      {
        id: 'boundary', show: 'x = 2',
        hint: L("Ikki karra uch olti, oltiga TENG, oltidan katta emas, tengsizlik qat'iy.", 'Два на три шесть, РАВНО шести, а не больше, неравенство строгое.', 'Two times three is six, EQUAL to six, not greater, and the inequality is strict.'),
      },
      {
        id: 'below', show: 'x = 1',
        hint: L("Bir karra uch uch, oltidan kichik.", 'Один на три три, меньше шести.', 'One times three is three, less than six.'),
      },
      {
        id: 'neg', show: 'x = 0',
        hint: L("Nol karra uch nol, oltidan kichik.", 'Нуль на три нуль, меньше шести.', 'Zero times three is zero, less than six.'),
      },
    ],
    after: L(
      "To'g'ri. Uch ikkidan katta, va uch karra uch olti dan katta chiqadi.",
      'Верно. Три больше двух, и три на три выходит больше шести.',
      'Correct. Three is greater than two, and three times three comes out greater than six.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — HAD KO'CHIRISH VA BO'LISH (`twosides`).
// Xukdagi tengsizlik shu yerda to'liq yechiladi: darslik 2-namunasi (86-bet).
// ============================================================
const S5 = {
  eyebrow: L('YECHAMIZ', 'РЕШАЕМ', 'WE SOLVE IT'),
  title: L(
    "X plyus bir katta yetti minus ikki iksni yeching",
    'Решите x плюс один больше семи минус два икс',
    'Solve x plus one greater than seven minus two x',
  ),
  audio: [
    A('mount',
      "Xukdagi tengsizlik. Uch qadamda yechamiz.",
      'Неравенство с хука. Решаем его за три шага.',
      'The inequality from the hook. We solve it in three steps.'),
    A('why',
      "Amal ikkala qismga birdan qo'llanadi. Qadamni tanlang.",
      'Действие применяется сразу к обеим частям. Выбери шаг.',
      'The action applies to both sides at once. Choose the step.'),
    W('a2',
      "Ikkinchi qadamda hadlar keltirildi.",
      'На втором шаге члены приведены.',
      'In the second step the terms were combined.'),
  ],
  props: {
    from: -2,
    to: 8,
    start: { left: 'x + 1', rel: '>', right: '7 − 2x', set: null },
    steps: [
      {
        ask: L('Nima qilamiz?', 'Что делаем?', 'What do we do?'),
        actions: [
          {
            id: 'move2x', right: true,
            label: L("Minus ikki iksni chapga ko'chirish", 'Перенести минус два икс влево', 'Move negative two x to the left'),
            to: { left: 'x + 2x + 1', rel: '>', right: '7' },
          },
          {
            id: 'move1',
            label: L("Birni chapga ko'chirish", 'Перенести единицу влево', 'Move one to the left'),
            hint: L(
              "Bir allaqachon chap tomonda turadi, ko'chirishga hojat yo'q.",
              'Единица уже стоит слева, переносить её не нужно.',
              'One already stands on the left; there is no need to move it.',
            ),
          },
        ],
      },
      {
        ask: L('Endi nima qilamiz?', 'Что теперь?', 'And now?'),
        actions: [
          {
            id: 'move1r', right: true,
            label: L("Birni o'ngga ko'chirish", 'Перенести единицу вправо', 'Move one to the right'),
            to: { left: '3x', rel: '>', right: '6' },
          },
          {
            id: 'nomove',
            label: L("Hadlarni shu holicha qoldirish", 'Оставить члены как есть', 'Leave the terms as they are'),
            hint: L(
              "Iks va son bitta tomonda qolsa, keltirib bo'lmaydi, bir o'ngga o'tishi kerak.",
              'Если x и число остаются на одной стороне, привести нельзя, единица должна перейти вправо.',
              'If x and the number stay on one side, they cannot be combined; one must move to the right.',
            ),
          },
        ],
      },
      {
        ask: L("Oxirgi qadam. Ikkala qismni uchga bo'lsak, nima bo'ladi?", 'Последний шаг. Что будет при делении обеих частей на три?', 'The last step. What happens dividing both sides by three?'),
        actions: [
          {
            id: 'div3', right: true,
            label: L("Bo'lish, ishora shu holicha qoladi", 'Разделить, знак остаётся таким же', 'Divide, the sign stays the same'),
            to: { left: 'x', rel: '>', right: '2' },
            set: { gt: 2 },
            note: L(
              "Uch musbat, ishora saqlanadi: x ikkidan katta.",
              'Три положительное, знак сохраняется: x больше двух.',
              'Three is positive, the sign is kept: x is greater than two.',
            ),
          },
          {
            id: 'div3flip',
            label: L("Bo'lish, ishorani burish", 'Разделить и перевернуть знак', 'Divide and flip the sign'),
            counter: { at: '3', gives: '3 < 2', verdict: L("bu yolg'on", 'это ложь', 'this is false') },
            hint: L(
              "Uch musbat son, musbatga bo'linganda ishora burilmaydi.",
              'Три положительное число, при делении на положительное знак не переворачивается.',
              'Three is a positive number; dividing by a positive one does not flip the sign.',
            ),
          },
        ],
      },
    ],
    note: L(
      "X ikkidan katta. Ikki o'zi yechimga kirmaydi, chunki tengsizlik qat'iy.",
      'X больше двух. Сама двойка не входит в решение, потому что неравенство строгое.',
      'X is greater than two. Two itself is not part of the solution, because the inequality is strict.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): x > 2 ekanini ikki yo'l bilan
// tekshirish — teskari qo'yish va to'g'ri chiziq.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "X katta ikkini ikki yo'l bilan tekshirish",
    'Проверить x больше двух двумя способами',
    'Checking x greater than two two ways',
  ),
  audio: [
    A('mount',
      "Bitta javob va ikki yo'l. Ikkalasi ham bir xil tasdiqni beradi.",
      'Один ответ и два пути. Оба дают одно подтверждение.',
      'One answer and two ways. Both give the same confirmation.'),
    W('w2',
      "Birinchi yo'lda uch qo'yib tekshiriladi.",
      'В первом пути проверяется подстановкой тройки.',
      'In the first way, checking is done by substituting three.'),
    W('w4',
      "Ikkinchi yo'lda to'g'ri chiziqda ochiq nuqta chiziladi.",
      'Во втором пути на числовой прямой рисуется открытая точка.',
      'In the second way, an open point is drawn on the number line.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL — SON QO\'YIB TEKSHIRISH', 'СПОСОБ 1 — ПРОВЕРКА ПОДСТАНОВКОЙ', 'METHOD 1 — CHECKING BY SUBSTITUTION'),
        lead: L(
          "x = 3 ni asl tengsizlikka qo'yamiz",
          'Подставляем x = 3 в исходное неравенство',
          'We substitute x = 3 into the original inequality',
        ),
        rows: [
          { text: '3 + 1 > 7 − 6' },
          { text: '4 > 1', tone: 'ok', note: L("to'g'ri", 'верно', 'true') },
        ],
      },
      {
        name: L('2-USUL — TO\'G\'RI CHIZIQ', 'СПОСОБ 2 — ЧИСЛОВАЯ ПРЯМАЯ', 'METHOD 2 — THE NUMBER LINE'),
        lead: L(
          "Ikkidan o'ngdagi hamma nuqtalar yechim",
          'Все точки правее двух — решение',
          'All points to the right of two are the solution',
        ),
        rows: [
          { text: L("ikkida ochiq nuqta", 'в двух открытая точка', 'an open point at two') },
          { text: L("o'ngga qarab bo'yash", 'закраска направо', 'shading to the right'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Qo'yib tekshirish bir nuqtani, chiziq esa hamma yechimni ko'rsatadi",
          'Подстановка показывает одну точку, а прямая — все решения',
          'Substitution shows one point, the line shows all solutions',
        ),
        rows: [{ text: L('x ikkidan katta', 'x больше двух', 'x is greater than two'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): nega chegara nuqtasi ochiq
// qoladi.
// ============================================================
const S7 = {
  eyebrow: L('NEGA NUQTA OCHIQ', 'ПОЧЕМУ ТОЧКА ОТКРЫТА', 'WHY THE POINT IS OPEN'),
  title: L(
    "Nega ikkida nuqta ochiq qoladi",
    'Почему в двух точка остаётся открытой',
    'Why the point at two stays open',
  ),
  audio: [
    A('mount',
      "Tengsizlik qat'iy, katta belgisi, teng emas.",
      'Неравенство строгое, знак больше, а не равно.',
      'The inequality is strict, a greater-than sign, not equal.'),
    W('p2',
      "X ikkiga teng bo'lsa, uch karra ikki olti, oltidan katta emas.",
      'Если x равен двум, три на два шесть, а не больше шести.',
      'If x equals two, three times two is six, not greater than six.'),
    W('p4',
      "Shuning uchun ikki yechimga kirmaydi, va nuqta ochiq qoladi.",
      'Поэтому два не входит в решение, и точка остаётся открытой.',
      'That is why two is not part of the solution, and the point stays open.',
    ),
  ],
  props: {
    tokens: [
      { t: '3x', id: 'a' },
      { t: ' > ', id: 'sign' },
      { t: '6', id: 'b' },
    ],
    steps: [
      {
        focus: 'sign',
        text: L(
          "Birinchi qadam. Belgi qat'iy katta, teng emas.",
          'Первый шаг. Знак строго больше, а не равно.',
          'Step one. The sign is strictly greater, not equal.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi qadam. X ikkiga teng bo'lsa, uch karra ikki olti chiqadi, bu oltiga teng, katta emas.",
          'Второй шаг. Если x равен двум, три на два выходит шесть, это равно шести, а не больше.',
          'Step two. If x equals two, three times two comes out six, which equals six, not greater.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Uchinchi qadam. Shuning uchun ikki yechim EMAS, va u ochiq nuqta bilan belgilanadi.",
          'Третий шаг. Поэтому два НЕ решение, и оно отмечается открытой точкой.',
          'Step three. That is why two is NOT a solution, and it is marked with an open point.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Ochiq va to'la nuqta belgisi butun dunyo darsliklarida bir xil qo'llanadi, shuning uchun chizma tarjimasiz ham tushunarli.",
        'Обозначение открытой и закрытой точки одинаково во всех учебниках мира, поэтому такой чертёж понятен без перевода.',
        'The open and closed point notation is the same in textbooks worldwide, so this kind of drawing is understood without translation.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 15-§, 85-87-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Chiziqli tengsizlik va uning yechimi",
    'Линейное неравенство и его решение',
    'A linear inequality and its solution',
  ),
  audio: [
    A('mount',
      "Ta'rif uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для определения, ты уже видел. Теперь собери его.',
      'Everything the definition needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik ta'rifi ochildi, va xukdagi qarz to'landi.",
      'Открылось определение из учебника, и долг с хука оплачен.',
      'The textbook definition opened, and the debt from the hook is paid.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("ax > b, ax < b ko'rinishidagi tengsizlik", 'неравенство вида ax > b, ax < b', 'an inequality of the form ax > b, ax < b') },
      { id: 'f2', label: L("bir noma'lumli chiziqli tengsizlik deyiladi", 'называется линейным неравенством с одной переменной', 'is called a linear inequality in one variable') },
      { id: 'f3', label: L("uni to'g'ri sonli tengsizlikka aylantiruvchi qiymat", 'значение, обращающее его в верное числовое неравенство', 'a value that turns it into a true numerical inequality') },
      { id: 'f4', label: L("uning yechimi deyiladi", 'называется его решением', 'is called its solution') },
      { id: 'w1', label: L("faqat butun sonlar yechim bo'ladi", 'решением бывают только целые числа', 'only whole numbers can be a solution') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Yechim istalgan son bo'lishi mumkin, faqat butun emas.",
      'Так не складывается. Решением может быть любое число, не только целое.',
      'That does not fit. The solution can be any number, not only a whole one.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 15-§, 85-87-bet",
        'Учебник, § 15, стр. 85–87',
        'Textbook, section 15, pages 85–87',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "X plyus bir katta yetti minus ikki iksni hali yecha olmaymiz",
        'x плюс один больше семи минус два икс мы пока не решаем',
        'We still cannot solve x plus one greater than seven minus two x',
      ),
      right: L(
        "endi had ko'chirib va bo'lib yechamiz",
        'теперь решаем переносом члена и делением',
        'now we solve it by moving a term and dividing',
      ),
      winner: 'right',
      note: L(
        "Had ko'chirish va bo'lish ishlaydi, chegara nuqtasi alohida tekshiriladi",
        'Перенос члена и деление работают, граничная точка проверяется отдельно',
        'Moving a term and dividing work, the boundary point is checked separately',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): had ko'chirib tengsizlikni
// soddalashtirish.
// ============================================================
const ASK_SIMPLE = L('Soddalashtirilgan yozuv qaysi?', 'Какая запись упрощена верно?', 'Which record is correctly simplified?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Tengsizlikni soddalashtiring",
    'Упрости неравенство',
    'Simplify the inequality',
  ),
  audio: [
    A('mount',
      "Besh tengsizlik. Har birida hadlar ko'chiriladi.",
      'Пять неравенств. В каждом переносятся члены.',
      'Five inequalities. In each, terms are moved across.'),
    A('why',
      "Ko'chirilgan had ishorasini almashtiradi.",
      'Перенесённый член меняет свой знак.',
      'The moved term changes its sign.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar ko'chirilgan had ishorasini almashtirgan.",
      'Все пять разобраны. Каждый раз перенесённый член менял знак.',
      'All five are done. Each time the moved term changed its sign.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x − 3 > 5'}</Row>,
        ok: L("Ha. Minus uch o'ngga o'tib musbat uch bo'ldi.", 'Да. Минус три, перейдя вправо, стало плюс три.', 'Yes. Negative three, moving right, became positive three.'),
        question: ASK_SIMPLE,
        items: [
          { id: 'a', right: true, label: 'x > 8' },
          { id: 'b', label: 'x > 2', hint: L("Minus uch o'ngga o'tsa, ishorasi almashib musbat uch bo'ladi, ayirilmaydi.", 'Минус три, переходя вправо, меняет знак на плюс три, а не отнимается.', 'Negative three, moving right, changes sign to positive three, not subtracted.') },
        ],
        solution: ['x − 3 > 5', 'x > 5 + 3', 'x > 8'],
      },
      {
        expr: <Row size="big" align="center">{'2x < x + 4'}</Row>,
        ok: L("Ha. X o'ngdan chapga o'tib minus x bo'ldi.", 'Да. x, перейдя справа влево, стало минус x.', 'Yes. x, moving from the right to the left, became negative x.'),
        question: ASK_SIMPLE,
        items: [
          { id: 'a', right: true, label: 'x < 4' },
          { id: 'b', label: 'x < 6', hint: L("O'ngdagi x chapga o'tsa, ishorasi almashib minus x bo'ladi, qo'shilmaydi.", 'x справа, переходя влево, меняет знак на минус x, а не складывается.', 'x on the right, moving left, changes sign to negative x, not added.') },
        ],
        solution: ['2x < x + 4', '2x − x < 4', 'x < 4'],
      },
      {
        expr: <Row size="big" align="center">{'5x + 2 ≥ 4x − 1'}</Row>,
        ok: L("Ha. To'rt x chapga, ikki o'ngga o'tib, ikkalasi ham ishorasini almashtirdi.", 'Да. Четыре x влево, два вправо, оба сменили знак.', 'Yes. Four x to the left, two to the right, both changed sign.'),
        question: ASK_SIMPLE,
        items: [
          { id: 'a', right: true, label: 'x ≥ −3' },
          { id: 'b', label: 'x ≥ 3', hint: L("Ikki o'ngga o'tganda minus ikki bo'ladi, o'ng tomon minus uchga teng chiqadi.", 'Двойка, переходя вправо, становится минус два, справа выходит минус три.', 'Two, moving right, becomes negative two, giving negative three on the right.') },
        ],
        solution: ['5x + 2 ≥ 4x − 1', '5x − 4x ≥ −1 − 2', 'x ≥ −3'],
      },
      {
        expr: <Row size="big" align="center">{'7 − x ≤ 10'}</Row>,
        ok: L("Ha. Ikkalasi ham o'tib, minus x ≤ uch, keyin ishora burilib x ≥ minus uch.", 'Да. После переноса минус x ≤ три, а после деления на минус один x ≥ минус три.', 'Yes. After moving, negative x ≤ three, and dividing by negative one, x ≥ negative three.'),
        question: ASK_SIMPLE,
        items: [
          { id: 'a', right: true, label: 'x ≥ −3' },
          { id: 'b', label: 'x ≤ −3', hint: L("Minus birga bo'linganda ishora burilishi kerak, bu yerda burilmagan.", 'При делении на минус один знак должен перевернуться, а здесь не перевёрнут.', 'Dividing by negative one, the sign must flip, but here it did not.') },
        ],
        solution: ['7 − x ≤ 10', '−x ≤ 3', 'x ≥ −3'],
      },
      {
        expr: <Row size="big" align="center">{'3(x − 1) > 6'}</Row>,
        ok: L("Ha. Qavs ochilib 3x minus uch katta olti, keyin x katta uch.", 'Да. Раскрыв скобку, 3x минус три больше шести, затем x больше трёх.', 'Yes. Opening the bracket, 3x minus three greater than six, then x greater than three.'),
        question: ASK_SIMPLE,
        items: [
          { id: 'a', right: true, label: 'x > 3' },
          { id: 'b', label: 'x > 1', hint: L("Qavs ochilganda uch iksga ham ko'paytiriladi, faqat birga emas.", 'При раскрытии скобки три умножается и на x, а не только на единицу.', 'Opening the bracket, three multiplies x too, not only the one.') },
        ],
        solution: ['3(x − 1) > 6', '3x − 3 > 6', '3x > 9', 'x > 3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): manfiy songa bo'lib yechish.
// ============================================================
const ASK_RESULT2 = L('Qaysi yozuv to\'g\'ri?', 'Какая запись верна?', 'Which record is correct?')

const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Manfiy songa bo'lib yeching",
    'Реши, разделив на отрицательное число',
    'Solve by dividing by a negative number',
  ),
  audio: [
    A('mount',
      "Uch tengsizlik. Har birida manfiy songa bo'linadi.",
      'Три неравенства. В каждом деление на отрицательное число.',
      'Three inequalities. In each, division by a negative number.'),
    A('why',
      "Manfiyga bo'linganda ishora buriladi.",
      'При делении на отрицательное знак переворачивается.',
      'Dividing by a negative flips the sign.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar manfiy bo'luvchi ishorani burgan.",
      'Все три разобраны. Каждый раз отрицательный делитель переворачивал знак.',
      'All three are done. Each time the negative divisor flipped the sign.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'−2x > 8'}</Row>,
        ok: L("Ha. Minus ikkiga bo'linganda ishora buriladi, x kichik minus to'rt.", 'Да. При делении на минус два знак переворачивается, x меньше минус четырёх.', 'Yes. Dividing by negative two flips the sign, x less than negative four.'),
        question: ASK_RESULT2,
        items: [
          { id: 'a', right: true, label: 'x < −4' },
          { id: 'b', label: 'x > −4', hint: L("Minus ikki manfiy son, ishora burilishi kerak edi.", 'Минус два отрицательное число, знак должен был перевернуться.', 'Negative two is a negative number, the sign should have flipped.') },
        ],
        solution: ['−2x > 8', 'x < −4'],
      },
      {
        expr: <Row size="big" align="center">{'−5x ≤ 15'}</Row>,
        ok: L("Ha. Minus beshga bo'linganda ishora buriladi, x katta yoki teng minus uch.", 'Да. При делении на минус пять знак переворачивается, x больше либо равно минус трём.', 'Yes. Dividing by negative five flips the sign, x is greater than or equal to negative three.'),
        question: ASK_RESULT2,
        items: [
          { id: 'a', right: true, label: 'x ≥ −3' },
          { id: 'b', label: 'x ≤ −3', hint: L("Minus besh manfiy son, ishora burilishi kerak edi.", 'Минус пять отрицательное число, знак должен был перевернуться.', 'Negative five is a negative number, the sign should have flipped.') },
        ],
        solution: ['−5x ≤ 15', 'x ≥ −3'],
      },
      {
        expr: <Row size="big" align="center">{'12 − 4x < 0'}</Row>,
        ok: L("Ha. Minus to'rtga bo'linganda ishora buriladi, x katta uch.", 'Да. При делении на минус четыре знак переворачивается, x больше трёх.', 'Yes. Dividing by negative four flips the sign, x greater than three.'),
        question: ASK_RESULT2,
        items: [
          { id: 'a', right: true, label: 'x > 3' },
          { id: 'b', label: 'x < 3', hint: L("Minus to'rt manfiy son, ishora burilishi kerak edi.", 'Минус четыре отрицательное число, знак должен был перевернуться.', 'Negative four is a negative number, the sign should have flipped.') },
        ],
        solution: ['12 − 4x < 0', '−4x < −12', 'x > 3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): yechimni son bilan
// tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Yechimni son bilan tekshirish",
    'Проверка решения числом',
    'Checking the solution with a number',
  ),
  audio: [
    A('mount',
      "Uch taklif qilingan yechim. Har birini o'ziga son qo'yib tekshiring.",
      'Предложены три решения. Каждое проверь, подставив число.',
      'Three proposed solutions. Check each by substituting a number.'),
    A('why',
      "Yechimdan bir son olib, asl tengsizlikka qo'ying.",
      'Возьми число из решения и подставь в исходное неравенство.',
      'Take a number from the solution and substitute it into the original inequality.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar son yechimni tasdiqlab yoki rad etib berdi.",
      'Все три разобраны. Каждый раз число подтверждало или отвергало решение.',
      'All three are done. Each time a number confirmed or rejected the solution.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x − 4 > 0   →   x > 4'}</Row>,
        ok: L("Ha. Besh qo'yilsa, besh minus to'rt bir, noldan katta, to'g'ri.", 'Да. Подставив пять, пять минус четыре один, больше нуля, верно.', 'Yes. Substituting five, five minus four is one, greater than zero, correct.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Besh qo'yib ko'ring, besh minus to'rt bir chiqadi, bu noldan katta.", 'Подставь пять, пять минус четыре даёт один, это больше нуля.', 'Substitute five, five minus four gives one, which is greater than zero.') },
        ],
        solution: ['5 − 4', '1', L("noldan katta, to'g'ri", 'больше нуля, верно', 'greater than zero, correct')],
      },
      {
        expr: <Row size="big" align="center">{'2x < 10   →   x < 5'}</Row>,
        ok: L("Ha. To'rt qo'yilsa, ikki karra to'rt sakkiz, o'ndan kichik, to'g'ri.", 'Да. Подставив четыре, два на четыре восемь, меньше десяти, верно.', 'Yes. Substituting four, two times four is eight, less than ten, correct.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("To'rt qo'yib ko'ring, ikki karra to'rt sakkiz, bu o'ndan kichik.", 'Подставь четыре, два на четыре даёт восемь, это меньше десяти.', 'Substitute four, two times four gives eight, which is less than ten.') },
        ],
        solution: ['2 · 4', '8', L("o'ndan kichik, to'g'ri", 'меньше десяти, верно', 'less than ten, correct')],
      },
      {
        expr: <Row size="big" align="center">{'−3x > 9   →   x > −3'}</Row>,
        ok: L("Yo'q. Minus ikki qo'yilsa, minus uch karra minus ikki olti, to'qqizdan kichik, noto'g'ri.", 'Нет. Подставив минус два, минус три на минус два шесть, меньше девяти, неверно.', 'No. Substituting negative two, negative three times negative two is six, less than nine, wrong.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Minus uchga bo'linganda ishora burilishi kerak edi, javob x kichik minus uch bo'lishi kerak.", 'При делении на минус три знак должен был перевернуться, ответ должен быть x меньше минус трёх.', 'Dividing by negative three, the sign should have flipped; the answer should be x less than negative three.') },
        ],
        solution: ['−3x > 9', L('ishora burilishi kerak', 'знак должен перевернуться', 'the sign should flip'), 'x < −3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): manfiyga bo'lib
// ishora burilmagan (З52).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ishora burilishi kerak edimi",
    'Нужно ли было переворачивать знак',
    'Was flipping the sign needed',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham manfiy songa bo'lib, ishora burilmagan.",
      'Два задания. В обоих деление на отрицательное, но знак не перевёрнут.',
      'Two tasks. In both, division is by a negative number, but the sign was not flipped.'),
    A('why',
      "Manfiy songa bo'linganda ishora buriladi, bu qoidadan qochib bo'lmaydi.",
      'При делении на отрицательное знак переворачивается, от этого правила не уйти.',
      'Dividing by a negative flips the sign, and there is no escaping this rule.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Manfiyga bo'linganda ishora har doim buriladi.",
      'Оба разобраны. При делении на отрицательное знак переворачивается всегда.',
      'Both are done. Dividing by a negative always flips the sign.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'−2x < 10   →   x < −5'}</Row>,
        ok: L("Ha. Minus ikkiga bo'linganda ishora burilishi kerak edi, javob x katta minus besh.", 'Да. При делении на минус два знак должен был перевернуться, ответ x больше минус пяти.', 'Yes. Dividing by negative two, the sign should have flipped, giving x greater than negative five.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ishora burilmagan", 'Знак не перевёрнут', 'The sign was not flipped') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, minus ikki manfiy, ishora burilishi kerak edi.", 'Это и есть показанная ошибка, минус два отрицательное, знак должен был перевернуться.', 'This is the very mistake shown, negative two is negative, the sign should have flipped.') },
        ],
        solution: ['−2x < 10', 'x > −5'],
      },
      {
        expr: <Row size="big" align="center">{'−4x ≥ 20   →   x ≥ −5'}</Row>,
        ok: L("Ha. Minus to'rtga bo'linganda ishora burilishi kerak edi, javob x kichik yoki teng minus besh.", 'Да. При делении на минус четыре знак должен был перевернуться, ответ x меньше либо равно минус пяти.', 'Yes. Dividing by negative four, the sign should have flipped, giving x less than or equal to negative five.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ishora burilmagan", 'Знак не перевёрнут', 'The sign was not flipped') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, minus to'rt manfiy, ishora burilishi kerak edi.", 'Это и есть показанная ошибка, минус четыре отрицательное, знак должен был перевернуться.', 'This is the very mistake shown, negative four is negative, the sign should have flipped.') },
        ],
        solution: ['−4x ≥ 20', 'x ≤ −5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH (1-darsning `fill`): had ko'chirib yechish
// qadamlari.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Tengsizlikni qadamlab yeching",
    'Реши неравенство по шагам',
    'Solve the inequality step by step',
  ),
  audio: [
    A('mount',
      "Tengsizlik berilgan. Hadlarni ko'chirib, songa bo'lib yeching.",
      'Дано неравенство. Перенеси члены и раздели на число.',
      'An inequality is given. Move the terms and divide by a number.'),
    A('why',
      "Ko'paytiruvchining ishorasiga e'tibor bering.",
      'Обрати внимание на знак множителя.',
      'Pay attention to the sign of the multiplier.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar had ko'chirish va bo'lish yechimni bergan.",
      'Все три заполнены. Каждый раз перенос члена и деление давали решение.',
      'All three are filled. Each time moving the term and dividing gave the solution.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['12', '4', '>'],
      lines: [
        [{ t: '2x − 4 > 8   →   2x > ' }, { slot: '12' }],
        [{ t: 'x ' }, { slot: '>' }, { t: ' ' }, { slot: '4' }],
      ],
    },
    tasks: [
      {
        chips: ['18', '9', '<'],
        lines: [
          [{ t: '2x + 4 < 22   →   2x < ' }, { slot: '18' }],
          [{ t: 'x ' }, { slot: '<' }, { t: ' ' }, { slot: '9' }],
        ],
      },
      {
        chips: ['−12', '3', '<'],
        lines: [
          [{ t: '−4x > 12   →   x ' }, { slot: '<' }, { t: ' ' }, { slot: '−12' }, { t: '/4' }],
          [{ t: 'x ' }, { slot: '<' }, { t: ' −' }, { slot: '3' }],
        ],
      },
      {
        chips: ['5', '15', '≥'],
        lines: [
          [{ t: '3x − 5 ≥ 10   →   3x ' }, { slot: '≥' }, { t: ' 10 + ' }, { slot: '5' }],
          [{ t: 'x ' }, { slot: '≥' }, { t: ' ' }, { slot: '15' }, { t: '/3' }],
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
    "Chiziqli tengsizlik bo'yicha to'rt savol",
    'Четыре вопроса о линейном неравенстве',
    'Four questions about the linear inequality',
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
        id: 'q1', tag: 'З54',
        ask: L('x > 5 ning yechimiga x = 5 kiradimi?', 'Входит ли x = 5 в решение x > 5?', 'Is x = 5 part of the solution of x > 5?'),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Belgi qat'iy katta, teng holat kiritilmaydi.", 'Знак строго больше, равенство не входит.', 'The sign is strictly greater; equality is not included.'),
        ok: L("To'g'ri, chegara nuqtasi qat'iy tengsizlikka kirmaydi.", 'Верно, граничная точка не входит в строгое неравенство.', 'Correct, the boundary point is not part of a strict inequality.'),
      },
      {
        id: 'q2', tag: 'З52',
        ask: L('−x > 4 ning yechimi qaysi?', 'Каково решение −x > 4?', 'What is the solution of −x > 4?'),
        options: [
          { id: 'ok', right: true, label: 'x < −4' },
          { id: 'noflip', label: 'x > −4' },
          { id: 'abs', label: 'x > 4' },
          { id: 'wrong', label: 'x < 4' },
        ],
        hint: L("Minus birga ko'paytirilganda ishora buriladi.", 'При умножении на минус один знак переворачивается.', 'Multiplying by negative one flips the sign.'),
        ok: L("To'g'ri, ishora burilib x kichik minus to'rt chiqadi.", 'Верно, знак перевернулся, и x меньше минус четырёх.', 'Correct, the sign flipped, giving x less than negative four.'),
      },
      {
        id: 'q3', tag: 'З52',
        ask: L('5x < 20 ning yechimi qaysi?', 'Каково решение 5x < 20?', 'What is the solution of 5x < 20?'),
        options: [
          { id: 'ok', right: true, label: 'x < 4' },
          { id: 'flip', label: 'x > 4' },
          { id: 'wrong', label: 'x < 5' },
          { id: 'wrong2', label: 'x < 15' },
        ],
        hint: L("Besh musbat son, ishora burilmaydi.", 'Пять положительное число, знак не переворачивается.', 'Five is a positive number, the sign does not flip.'),
        ok: L("To'g'ri, musbat songa bo'linganda ishora saqlanadi.", 'Верно, при делении на положительное знак сохраняется.', 'Correct, dividing by a positive keeps the sign.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('x ≥ 3 yechimida x = 3 tengsizlikni to\'g\'ri qiladimi?', 'Делает ли x = 3 верным неравенство x ≥ 3?', 'Does x = 3 make the inequality x ≥ 3 true?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Belgi qat'iy emas, teng holat ham kiradi.", 'Знак не строгий, равенство тоже входит.', 'The sign is not strict; equality is also included.'),
        ok: L("To'g'ri, uch ham yechimga kiradi.", 'Верно, тройка тоже входит в решение.', 'Correct, three is also part of the solution.'),
      },
      {
        id: 'q5', tag: 'З52',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "−3x ≤ 9 ni yeching va belgini qo'ying.",
            'Реши −3x ≤ 9 и поставь знак.',
            'Solve −3x ≤ 9 and put the sign.',
          ),
          lines: [
            [{ t: 'x ' }, { slot: '≥' }, { t: ' −3' }],
          ],
          tiles: [
            { id: 't1', v: '≥', x: 12, y: 12 },
            { id: 't2', v: '≤', x: 70, y: 14 },
            { id: 't3', v: '=', x: 40, y: 50 },
          ],
          hint: L(
            "Minus uch manfiy son, ishora buriladi.",
            'Минус три отрицательное число, знак переворачивается.',
            'Negative three is a negative number, the sign flips.',
          ),
          doneNote: L(
            "Yig'ildi. Manfiy songa bo'linganda kichik teng belgisi katta tengga aylandi.",
            'Собрано. При делении на отрицательное знак меньше либо равно стал знаком больше либо равно.',
            'Assembled. Dividing by a negative turned less-than-or-equal into greater-than-or-equal.',
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
    "Chegara nuqtasi qat'iy tengsizlikka kirmaydi",
    'Граничная точка не входит в строгое неравенство',
    'The boundary point is not part of a strict inequality',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. X plyus bir katta yetti minus ikki iks, javobi x katta ikki.",
      'С урока остаётся одна запись. x плюс один больше семи минус два икс, ответ x больше двух.',
      'One record stays with you. x plus one greater than seven minus two x, the answer x greater than two.'),
    A('s1',
      "Bugun uch narsa qilindi. Had ko'chirishni ko'rdingiz, songa bo'lib yechdingiz va chegara nuqtasini alohida tekshirdingiz.",
      'Сегодня сделано три вещи. Ты увидел перенос члена, решил делением на число и отдельно проверил граничную точку.',
      'Three things are done today. You saw moving a term, solved by dividing by a number, and checked the boundary point separately.'),
    A('s2',
      "Keyingi darsda bir noma'lumli tengsizliklar sistemalari. Bir necha yechimni birlashtirishni ko'rasiz.",
      'В следующем уроке системы неравенств с одной переменной. Увидишь, как объединяются несколько решений.',
      'The next lesson covers systems of inequalities in one variable. You will see how several solutions combine.',
    ),
  ],
  props: {
    mark: 'x + 1 > 7 − 2x   →   x > 2',
    markNote: L(
      "ikki ochiq nuqta, o'ngga bo'yaladi",
      'два открытая точка, закраска направо',
      'two is an open point, shaded to the right',
    ),
    lines: [
      L(
        "had ko'chirilganda ishorasi o'zgaradi",
        'При переносе члена его знак меняется',
        'Moving a term across changes its sign',
      ),
      L(
        "manfiy songa bo'linganda tengsizlik ishorasi buriladi",
        'При делении на отрицательное число знак неравенства переворачивается',
        "Dividing by a negative number flips the inequality's sign",
      ),
      L(
        "qat'iy tengsizlikda chegara nuqtasi yechimga kirmaydi",
        'В строгом неравенстве граничная точка не входит в решение',
        'In a strict inequality the boundary point is not part of the solution',
      ),
    ],
    bridge: L(
      "Keyingi dars: bir noma'lumli tengsizliklar sistemalari",
      'Следующий урок: системы неравенств с одной переменной',
      'Next lesson: systems of inequalities in one variable',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — HAD KO'CHIRISH VA BO'LISH (`twosides`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З54', 'З54', 'З54',
    'З54', 'З54', 'З54', 'З54', 'З52',
    'З16', 'З52', 'З52', null, null,
  ],
  mechanic: { at: 5, tool: 'twosides', kind: 'isolate' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
