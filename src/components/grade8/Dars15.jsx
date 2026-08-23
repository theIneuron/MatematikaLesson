// ============================================================================
// 8-sinf, Dars 15. KVADRAT TENGLAMA VA UNING ELEMENTLARI.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `twosides.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi (metodist qarori 2026-08-21, o'n foiz). 5-ekranda
// `twosides`: tenglama standart shaklga keltiriladi, bu darsda YECHILMAYDI —
// yechish 16-darsda.
//
// DARSNING UCH ISHI:
//   1) ax kvadrat plyus bx plyus c teng nol — kvadrat tenglama ta'rifi,
//      a nolga teng emas;
//   2) a — bosh koeffitsiyent, b — ikkinchi koeffitsiyent, c — ozod had;
//   3) ildiz — tenglamani to'g'ri qiladigan son, va u BIRDAN ORTIQ bo'lishi
//      mumkin.
//
// ENG NOZIK JOY. So'z «ildiz» besh dars davomida kvadrat ildizni bildirdi
// (8-13-darslar). Endi u tenglamaning ildizini bildiradi — boshqa ma'no,
// bir xil so'z. Xuk shuni ochiq aytadi: 9dan ildiz — bitta son, iks kvadrat
// to'qqizga teng tenglama — ikki ildizga ega bo'lishi mumkin. Yechish usuli
// 16-darsda, bu darsda faqat NECHTA son bo'lishi mumkinligi tushuntiriladi.
//
// DARSLIK. O'zbek darsligi, 22-§, 135–136-bet: ta'rif, a/b/c nomlari,
// standart shaklga keltirish misoli, x kvadrat teng d holining tahlili.
// Bu mavzu uchun darslik BOR — 8-13-darslardan farqli o'laroq, manba
// o'ylab topilmadi.
//
// ADASHISHLAR: yangi ikkitasi:
//   З38 — a nolga teng bo'lishi mumkin deb o'ylandi (tenglama chiziqli
//         bo'lib qolganda ham kvadrat deb hisoblandi);
//   З39 — had ko'chirilganda yoki standart shaklda bo'lmagan yozuvdan
//         o'qilganda ishorasi yo'qoldi.
// Qaytadi: З16 (javob son bilan tekshirilmadi) — 11-ekranda, ildizni
// qo'yib tekshirish.
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
  id: 'alg-8-15',
  n: 15,
  row: 17,
  block: 'Б3',
  topic: L(
    'Kvadrat tenglama va uning elementlari',
    'Квадратное уравнение и его элементы',
    'The quadratic equation and its elements',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "ax kvadrat plyus bx plyus c teng nol — kvadrat tenglama, bunda a nolga teng emas",
    'a икс квадрат плюс b икс плюс c равно нулю — квадратное уравнение, где a не равно нулю',
    'a x squared plus b x plus c equals zero is a quadratic equation, where a is not zero',
  ),
  L(
    "a — bosh koeffitsiyent, b — ikkinchi koeffitsiyent, c — ozod had",
    'a — старший коэффициент, b — второй коэффициент, c — свободный член',
    'a is the leading coefficient, b is the second coefficient, c is the constant term',
  ),
  L(
    "ildiz — tenglamani to'g'ri qiladigan son",
    'Корень — число, обращающее уравнение в верное равенство',
    'A root is a number that makes the equation true',
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
  'З38': {
    what: L(
      "a nolga teng bo'lishi mumkin deb o'ylandi, tenglama chiziqli bo'lib qolganda ham kvadrat deb hisoblandi",
      'a посчитано способным равняться нулю, уравнение назвали квадратным даже когда оно стало линейным',
      'a was assumed able to equal zero, the equation was still called quadratic even after it collapsed to linear',
    ),
    wrong: '0*x^2+5*x-3',
    at: 3,
  },
  'З39': {
    what: L(
      "had ko'chirilganda yoki standart shaklda bo'lmagan yozuvdan o'qilganda ishorasi yo'qoldi",
      'при переносе слагаемого или чтении не в стандартном виде знак пропал',
      'the sign was lost when a term was moved, or when reading off a record not in standard form',
    ),
    wrong: '3*x^2+5*x+2',
    at: 5,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: 9dan ildiz va iks kvadrat toqqiz — bir xil ishmi.
// Yakun: 9dan ildiz bitta son, iks kvadrat toqqiz — ikki ildiz.
// ============================================================
const SC_SAME = L('IKKALASI HAM ILDIZ TOPISH', 'ОБА — ПОИСК КОРНЯ', 'BOTH ARE FINDING A ROOT')
const SC_ONE = L('BITTA SON', 'ОДНО ЧИСЛО', 'ONE NUMBER')
const SC_TWO = L('IKKI ILDIZ', 'ДВА КОРНЯ', 'TWO ROOTS')

const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "9dan ildiz va iks kvadrat to'qqiz",
      'Корень из девяти и икс квадрат девять',
      'The root of nine and x squared nine',
    )}>
      <text x="96" y="70" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21"
        fill={T.ink}>√9</text>

      <text x="304" y="70" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21"
        fill={T.ink}>{'x² = 9'}</text>

      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="70" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="77" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="126" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_SAME)}</text>
      <line x1="112" y1="138" x2="288" y2="138" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

const FinalScene = () => {
  const t = useT()
  return (
    <SceneBand kind="final" label={L(
      "9dan ildiz uchga teng, iks kvadrat toqqiz ikki ildizga ega",
      'Корень из девяти равен трём, а икс квадрат девять имеет два корня',
      'The root of nine equals three, and x squared nine has two roots',
    )}>
      <text x="92" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'√9 = 3'}</text>
      <g className="g8-seat" style={{ '--d': '500ms' }}>
        <text x="92" y="48" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="8" letterSpacing="0.14em" fill={T.ok}>{t(SC_ONE)}</text>
      </g>

      <line x1="200" y1="16" x2="200" y2="56" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>

      <text x="306" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'x² = 9'}</text>
      <g className="g8-seat" style={{ '--d': '1000ms' }}>
        <text x="306" y="48" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="8" letterSpacing="0.14em" fill={T.tip}>{t(SC_TWO)}</text>
      </g>

      <g className="g8-seat" style={{ '--d': '1500ms' }}>
        <line x1="60" y1="74" x2="340" y2="74" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <circle cx="112" cy="74" r="4.4" fill={T.ok}/>
        <text x="112" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>3</text>
        <circle cx="252" cy="74" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
        <text x="252" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>{'−3'}</text>
        <circle cx="316" cy="74" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
        <text x="316" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>3</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('BIR XIL ISHMI', 'ОДНО ЛИ ЭТО ДЕЙСТВИЕ', 'IS IT THE SAME ACTION'),
  title: L(
    "9dan ildizni topish va iks kvadrat to'qqizga teng tenglamani yechish",
    'Найти корень из девяти и решить уравнение икс квадрат равно девяти',
    'Finding the root of nine and solving the equation x squared equals nine',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki yozuv. Ikkalasida ham so'z ildiz ishlatiladi.",
      'Две записи. В обеих используется слово корень.',
      'Two records. Both use the word root.'),
    A('why',
      "Taxmin qiling, bu ikkisi bir xil ishmi.",
      'Предположи, одно ли это действие.',
      'Predict whether this is the same action.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, bu ikkisi bir xil ishmi?",
      'Как думаешь, это одно и то же действие?',
      'Do you think this is the same action?',
    ),
    items: [
      { id: 'same', show: L('Ha, bir xil', 'Да, одно и то же', 'Yes, the same') },
      { id: 'diff', show: L('Yo\'q, boshqa-boshqa', 'Нет, разные', 'No, different') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Koeffitsiyent yashirin bo'lishi mumkin: yozuv "iks
// kvadrat" ozidan koeffitsiyent BIR, "minus iks kvadrat" — MINUS BIR.
// Shu tayanch 6, 9 va 12-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Yashirin koeffitsiyent",
    'Скрытый коэффициент',
    'The hidden coefficient',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida iks kvadrat oldidagi koeffitsiyent minus birga teng.",
      'Четыре записи. Только в одной коэффициент перед икс квадрат равен минус одному.',
      'Four records. Only one has the coefficient before x squared equal to negative one.'),
    A('why',
      "Hech narsa yozilmasa koeffitsiyent bir, yolgiz minus bo'lsa u minus bir bo'ladi.",
      'Если ничего не написано, коэффициент один, а если стоит только минус, то это минус один.',
      'If nothing is written, the coefficient is one; if only a minus stands there, it is negative one.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuvda koeffitsiyent minus birga teng?",
      'В какой записи коэффициент равен минус одному?',
      'In which record is the coefficient equal to negative one?',
    ),
    items: [
      { id: 'neg', show: '−x²', right: true, name: L('yashirin minus bir', 'скрытый минус один', 'a hidden negative one') },
      {
        id: 'pos', show: 'x²',
        hint: L(
          "Hech narsa yozilmagan, demak koeffitsiyent bir, minus emas.",
          'Ничего не написано, значит коэффициент один, а не минус.',
          'Nothing is written, so the coefficient is one, not negative.',
        ),
      },
      {
        id: 'five', show: '5x²',
        hint: L(
          "Bu yerda koeffitsiyent besh.",
          'Здесь коэффициент пять.',
          'Here the coefficient is five.',
        ),
      },
      {
        id: 'negfive', show: '−5x²',
        hint: L(
          "Bu yerda koeffitsiyent minus besh.",
          'Здесь коэффициент минус пять.',
          'Here the coefficient is negative five.',
        ),
      },
    ],
    after: L(
      "Ha. Yolgiz minus koeffitsiyentni yashirmaydi, u minus birni bildiradi.",
      'Да. Одинокий минус не прячет коэффициент, он и означает минус один.',
      'Yes. A lone minus does not hide the coefficient, it means negative one.',
    ),
  },
}

// ============================================================
// EKRAN 3. A NI BURANG (1-darsning `steppers`). Natija — olti bo'lingan a
// ga (keltirilgan tenglamaning ozod hadi). a nolga tushganda bo'linish
// yo'qoladi: bu З38 ning sabab bilan birinchi ko'rinishi.
// ============================================================
const S3 = {
  eyebrow: L('A NI BURANG', 'КРУТИ A', 'TURN A'),
  title: L(
    "Olti bo'lingan a ga",
    'Шесть, делённое на a',
    'Six divided by a',
  ),
  audio: [
    A('mount',
      "Kvadrat tenglamani a ga bo'lganda keltirilgan shakl chiqadi. Ozod had olti bo'lingan a ga teng bo'lsin.",
      'Разделив квадратное уравнение на a, получают приведённый вид. Пусть свободный член равен шести, делённому на a.',
      'Dividing a quadratic equation by a gives the reduced form. Let the constant term equal six divided by a.'),
    A('why',
      "Uch maqsad beriladi. a ning turli qiymatlarida natijani toping.",
      'Даны три цели. Находи результат при разных значениях a.',
      'Three targets are given. Find the result at different values of a.'),
    A('why',
      "Oxirida a ni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти a до нуля и посмотри, что будет.',
      'At the end bring a down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'a', label: L('a ning qiymati', 'значение a', 'the value of a'),
        start: 6, min: 0, max: 8, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : Math.round((6 / v[0]) * 100) / 100),
    resultLabel: L('6 : a', '6 : a', '6 : a'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "a hali nolga tushmasin, avval maqsadlarni oling.",
      'a пока не опускай до нуля, сначала возьми цели.',
      'Do not bring a to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: 2,
        ask: L("Natija 2 ga teng bo'lsin", 'Пусть результат будет равен 2', 'Make the result equal 2'),
        after: L(
          "Ikki. a uchga teng bo'lganda olti uchga bo'linib ikki chiqadi.",
          'Два. При a равном трём шесть делится на три и выходит два.',
          'Two. With a equal to three, six divided by three gives two.',
        ),
      },
      {
        value: 3,
        ask: L("Endi natija 3 ga teng bo'lsin", 'Теперь пусть результат будет равен 3', 'Now make the result equal 3'),
        after: L(
          "Uch. a ikkiga teng bo'lganda olti ikkiga bo'linib uch chiqadi.",
          'Три. При a равном двум шесть делится на два и выходит три.',
          'Three. With a equal to two, six divided by two gives three.',
        ),
      },
      {
        value: 6,
        ask: L("Oxirgisi, natija olti bo'lsin", 'Последняя, пусть результат будет равен 6', 'The last one, make the result equal 6'),
        after: L(
          "Olti. a birga teng bo'lganda olti birga bo'linib olti chiqadi.",
          'Шесть. При a равном одному шесть делится на один и выходит шесть.',
          'Six. With a equal to one, six divided by one gives six.',
        ),
      },
    ],
    ask: L("Natija 2 ga teng bo'lsin", 'Пусть результат будет равен 2', 'Make the result equal 2'),
    ask2: L("Endi a ni nolga tushiring", 'Теперь опусти a до нуля', 'Now bring a down to zero'),
    broke: L(
      "a nolga teng bo'lsa, oltini nolga bo'lish kerak bo'lardi, bo'linish yo'q. Shuning uchun kvadrat tenglamada a nolga teng bo'lishi mumkin emas.",
      'Если a равно нулю, шесть пришлось бы делить на нуль, а деления не существует. Поэтому в квадратном уравнении a не может равняться нулю.',
      'If a equals zero, six would have to be divided by zero, and that has no value. That is why in a quadratic equation a cannot equal zero.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI YOZUV KVADRAT TENGLAMA (1-darsning `pick`). Ловушка — a
// nolga yashiringan yozuv, sintaksisi o'xshab, lekin chiziqli.
// ============================================================
const S4 = {
  eyebrow: L('QAYSI BIRI', 'КОТОРОЕ ИЗ ЭТИХ', 'WHICH ONE'),
  title: L(
    "Qaysi yozuv kvadrat tenglama",
    'Какая запись является квадратным уравнением',
    'Which record is a quadratic equation',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasi kvadrat tenglama.",
      'Четыре записи. Только одна из них квадратное уравнение.',
      'Four records. Only one is a quadratic equation.'),
    A('why',
      "Standart shaklda bo'lmasligi mumkin, lekin iks kvadrat oldidagi koeffitsiyent nolga teng bo'lmasligi shart.",
      'Она может быть не в стандартном виде, но коэффициент перед икс квадрат обязан быть не нулём.',
      'It may not be in standard form, but the coefficient before x squared must not be zero.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuv kvadrat tenglama?",
      'Какая запись — квадратное уравнение?',
      'Which record is a quadratic equation?',
    ),
    items: [
      {
        id: 'zeroA', show: '0x² + 5x − 3 = 0',
        hint: L(
          "Bunda birinchi had nolga ko'paytirilgan va yo'qoladi, qolgani chiziqli tenglama.",
          'Здесь первый член умножен на нуль и исчезает, остальное, линейное уравнение.',
          'Here the first term is multiplied by zero and vanishes, leaving a linear equation.',
        ),
      },
      {
        id: 'right', show: 'x² = 4x − 3', right: true,
        name: L('standart emas', 'не стандарт', 'not standard'),
      },
      {
        id: 'cube', show: 'x³ − x = 0',
        hint: L(
          "Bunda eng katta daraja uch, kvadrat tenglamada esa ikki bo'lishi shart.",
          'Здесь наибольшая степень три, а у квадратного уравнения она обязана быть два.',
          'Here the highest power is three, while a quadratic equation requires it to be two.',
        ),
      },
      {
        id: 'linear', show: '2x − 7 = 0',
        hint: L(
          "Bunda iks kvadrat umuman yo'q.",
          'Здесь икс квадрат вовсе нет.',
          'There is no x squared here at all.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Standart shaklda bo'lmasa ham, koeffitsiyent nolga teng bo'lmasa, tenglama kvadrat bo'lib qoladi.",
      'Верно. Даже не в стандартном виде, если коэффициент не нуль, уравнение остаётся квадратным.',
      'Correct. Even out of standard form, as long as the coefficient is not zero, the equation stays quadratic.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — STANDART SHAKLGA KELTIRISH (`twosides`).
// Bu ekranda TENGLAMA YECHILMAYDI, faqat standart shaklga keltiriladi.
// ============================================================
const S5 = {
  eyebrow: L('STANDART SHAKL', 'СТАНДАРТНЫЙ ВИД', 'STANDARD FORM'),
  title: L(
    "2x kvadrat plyus besh teng yetti minus 3x ni standart shaklga keltiring",
    'Приведи два икс квадрат плюс пять равно семь минус три икс к стандартному виду',
    'Bring two x squared plus five equals seven minus three x to standard form',
  ),
  audio: [
    A('mount',
      "Tenglama standart shaklda emas. Ikki amal bilan uni keltiramiz.",
      'Уравнение не в стандартном виде. Двумя действиями приводим его.',
      'The equation is not in standard form. Two actions bring it there.'),
    A('why',
      "Amal ikkala tomonga birdan qo'llanadi. Qadamni tanlang.",
      'Действие применяется сразу к обеим частям. Выбери шаг.',
      'The action applies to both sides at once. Choose the step.'),
  ],
  props: {
    from: -6,
    to: 6,
    start: { left: '2x² + 5', rel: '=', right: '7 − 3x', set: null },
    steps: [
      {
        ask: L('Nima qilamiz?', 'Что делаем?', 'What do we do?'),
        actions: [
          {
            id: 'add3x', right: true,
            label: L("3x ni ikki tomonga qo'shish", 'Прибавить 3x к обеим частям', 'Add 3x to both sides'),
            to: { left: '2x² + 3x + 5', rel: '=', right: '7' },
          },
          {
            id: 'add5',
            label: L("Besh ni ikki tomonga qo'shish", 'Прибавить пять к обеим частям', 'Add five to both sides'),
            hint: L(
              "Besh allaqachon chap tomonda turadi, uni yana qo'shish standart shaklga yaqinlashtirmaydi.",
              'Пять уже стоит слева, и прибавление его снова не приближает к стандартному виду.',
              'Five already stands on the left, and adding it again does not bring the equation closer to standard form.',
            ),
          },
        ],
      },
      {
        ask: L('Endi nima qilamiz?', 'Что теперь?', 'And now?'),
        actions: [
          {
            id: 'sub7', right: true,
            label: L('Ikki tomondan 7 ni ayirish', 'Вычесть 7 из обеих частей', 'Subtract 7 from both sides'),
            to: { left: '2x² + 3x − 2', rel: '=', right: '0' },
            note: L(
              "Endi tenglama standart shaklda turadi.",
              'Теперь уравнение стоит в стандартном виде.',
              'Now the equation stands in standard form.',
            ),
          },
          {
            id: 'div2',
            label: L("Ikki tomonni ikkiga bo'lish", 'Разделить обе части на два', 'Divide both sides by two'),
            hint: L(
              "Bu amal keyinroq foydali bo'lardi, avval o'ng tomonni nolga tenglashtiramiz.",
              'Это действие пригодилось бы позже, а сначала делаем правую часть нулём.',
              'This move would help later; first we make the right side equal to zero.',
            ),
          },
        ],
      },
    ],
    note: L(
      "Standart shaklga keltirish — bu darsning asosiy ishi.",
      'Приведение к стандартному виду — главное дело этого урока.',
      'Bringing to standard form is this lesson’s main task.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): a, b, c ni ikki yo'l bilan
// aniqlash. Ikkinchi yo'l 5-ekrandagi yozuvni takrorlaydi.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "a, b, c ni ikki yo'l bilan aniqlash",
    'Определить a, b, c двумя способами',
    'Naming a, b, c two ways',
  ),
  audio: [
    A('mount',
      "Bitta savol va ikki yo'l. Ikkalasi ham bir xil javob beradi.",
      'Один вопрос и два пути. Оба дают один ответ.',
      'One question and two ways. Both give the same answer.'),
    W('w2',
      "Birinchi yo'lda tenglama allaqachon standart shaklda, koeffitsiyentlar to'g'ridan o'qiladi.",
      'В первом пути уравнение уже в стандартном виде, коэффициенты читаются прямо.',
      'In the first way the equation is already in standard form, and the coefficients are read directly.'),
    W('w4',
      "Ikkinchi yo'lda avval hammasi bir tomonga o'tkaziladi, keyin o'qiladi.",
      'Во втором пути сначала всё переносится в одну часть, потом читается.',
      'In the second way everything is moved to one side first, then read.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L("1-USUL — TAYYOR SHAKLDAN", 'СПОСОБ 1 — ИЗ ГОТОВОГО ВИДА', 'METHOD 1 — FROM THE READY FORM'),
        lead: L(
          "Tenglama allaqachon standart shaklda",
          'Уравнение уже в стандартном виде',
          'The equation is already in standard form',
        ),
        rows: [
          { text: '3x² − 4x + 1 = 0' },
          { text: 'a = 3,  b = −4,  c = 1', tone: 'ok', note: L("to'g'ridan o'qildi", 'прочитано прямо', 'read directly') },
        ],
      },
      {
        name: L("2-USUL — AVVAL TENGLASH", 'СПОСОБ 2 — СНАЧАЛА ПРИВЕСТИ', 'METHOD 2 — REDUCE FIRST'),
        lead: L(
          "Tenglama standart shaklda emas, avval hammasini bir tomonga o'tkazamiz",
          'Уравнение не в стандартном виде, сначала переносим всё в одну часть',
          'The equation is not in standard form, first we move everything to one side',
        ),
        rows: [
          { text: '3x² + 1 = 4x' },
          { text: '3x² − 4x + 1 = 0' },
          { text: 'a = 3,  b = −4,  c = 1', tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Standart shaklga keltirilgandan keyin koeffitsiyentlar bir xil chiqadi",
          'После приведения к стандартному виду коэффициенты совпадают',
          'After reducing to standard form the coefficients come out the same',
        ),
        rows: [{ text: 'a = 3,  b = −4,  c = 1', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): a nolga teng bo'lganda nima
// bo'ladi — birinchi had butunlay yo'qoladi.
// ============================================================
const S7 = {
  eyebrow: L('A NOLGA TENG BO\'LSA', 'ЕСЛИ A РАВНО НУЛЮ', 'IF A EQUALS ZERO'),
  title: L(
    "Birinchi had qanday yo'qoladi",
    'Как исчезает первый член',
    'How the first term disappears',
  ),
  audio: [
    A('mount',
      "a nolga teng bo'lganda yozuvning boshi butunlay o'zgaradi.",
      'Когда a равно нулю, начало записи меняется совсем.',
      'When a equals zero, the start of the record changes completely.'),
    W('p2',
      "a o'rniga nol qo'yilsa, birinchi had nolga ko'paytiriladi va yo'qoladi.",
      'Если вместо a поставить нуль, первый член умножается на нуль и исчезает.',
      'If zero is put in place of a, the first term is multiplied by zero and vanishes.'),
    W('p4',
      "Qolgani b iks plyus c teng nol, ya'ni chiziqli tenglama, kvadrat emas.",
      'Остаётся b икс плюс c равно нулю, то есть линейное уравнение, а не квадратное.',
      'What remains is b x plus c equals zero, a linear equation, not a quadratic one.',
    ),
  ],
  props: {
    tokens: [
      { t: 'a', id: 'a' },
      { t: ' x² + ', id: 'op1' },
      { t: 'b', id: 'b' },
      { t: ' x + ', id: 'op2' },
      { t: 'c', id: 'c' },
      { t: ' = 0', id: 'eq' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qadam. a o'rniga nol qo'yamiz.",
          'Первый шаг. Ставим на место a нуль.',
          'Step one. We put zero in place of a.',
        ),
      },
      {
        focus: 'op1',
        text: L(
          "Ikkinchi qadam. Birinchi had nolga ko'paytirilgan, u yo'qoladi.",
          'Второй шаг. Первый член умножен на нуль, он исчезает.',
          'Step two. The first term is multiplied by zero, and it vanishes.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qadam. Faqat b iks plyus c teng nol qoladi, bu chiziqli tenglama.",
          'Третий шаг. Остаётся только b икс плюс c равно нулю, это линейное уравнение.',
          'Step three. Only b x plus c equals zero remains, and that is a linear equation.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Algebra so'zi arab olimi Al-Xorazmiyning tenglamalar haqidagi kitobidan kelib chiqqan, va aynan shu turdagi tenglamalar o'sha kitobda birinchi marta tartib bilan yechilgan.",
        'Слово алгебра восходит к книге арабского учёного аль-Хорезми об уравнениях, и уравнения именно такого вида были впервые решены там по порядку.',
        'The word algebra traces back to a book on equations by the scholar al-Khwarizmi, and equations of exactly this kind were first solved there systematically.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Bu yerda dars XUKKA QAYTADI.
// MANBA — DARSLIK BOR: 22-§, 135-136-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Kvadrat tenglama ta'rifi",
    'Определение квадратного уравнения',
    'The definition of a quadratic equation',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik ta'rifi ochildi, va xukdagi savolga javob keldi.",
      'Открылось определение из учебника, и вопрос с хука получил ответ.',
      'The textbook definition opened, and the question from the hook got its answer.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("ax kvadrat plyus bx plyus c teng nol ko'rinishdagi tenglama", 'Уравнение вида a икс квадрат плюс b икс плюс c равно нулю', 'An equation of the form a x squared plus b x plus c equals zero') },
      { id: 'f2', label: L("kvadrat tenglama deyiladi, bunda a nolga teng emas", 'называется квадратным, где a не равно нулю', 'is called quadratic, where a is not zero') },
      { id: 'f3', label: L("a, b, c berilgan sonlar", 'a, b, c — данные числа', 'a, b, c are given numbers') },
      { id: 'f4', label: L("va tenglamani to'g'ri qiladigan son uning ildizi deyiladi", 'а число, обращающее уравнение в верное равенство, называется его корнем', 'and a number that makes the equation true is called its root') },
      { id: 'w1', label: L("a nolga teng bo'lishi ham mumkin", 'a может равняться и нулю', 'a can also equal zero') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. a nolga teng bo'lsa, iks kvadratli had yo'qoladi va tenglama chiziqli bo'lib qoladi.",
      'Так не складывается. Если a равно нулю, член с икс квадрат исчезает и уравнение становится линейным.',
      'That does not fit. If a were zero, the x-squared term would vanish and the equation would become linear.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 22-§, 135–136-bet",
        'Учебник, § 22, стр. 135–136',
        'Textbook, section 22, pages 135–136',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "ikkalasi bir xil ish",
        'обе одно действие',
        'both the same action',
      ),
      right: L(
        "9dan ildiz — bitta son, tenglama — ikki ildiz",
        'корень из девяти — одно число, уравнение — два корня',
        'root of nine is one number, the equation has two roots',
      ),
      winner: 'right',
      note: L(
        "Kvadratga oshirish ishorani yashiradi",
        'Возведение в квадрат прячет знак',
        'Squaring hides the sign',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): a, b, c ni ayting.
// ============================================================
const ASK_ABC = L('a, b, c qanday?', 'Каковы a, b, c?', 'What are a, b, c?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "a, b, c ni ayting",
    'Назови a, b, c',
    'Name a, b, c',
  ),
  audio: [
    A('mount',
      "Besh yozuv. Har javobdan keyin yechim ochiladi.",
      'Пять записей. После каждого ответа открывается решение.',
      'Five records. After each answer the solution opens.'),
    A('why',
      "Ba'zilari standart shaklda emas, avval tenglang.",
      'Некоторые не в стандартном виде, сначала приведи.',
      'Some are not in standard form, bring them there first.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Standart shaklda bo'lmagan yozuvlar avval tenglandi.",
      'Все пять разобраны. Записи не в стандартном виде сначала приводились.',
      'All five are done. Records not in standard form were reduced first.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'2x² − 5x + 3 = 0'}</Row>,
        ok: L("Ha. Yozuv allaqachon standart shaklda.", 'Да. Запись уже в стандартном виде.', 'Yes. The record is already in standard form.'),
        question: ASK_ABC,
        items: [
          { id: 'a', right: true, label: 'a = 2,  b = −5,  c = 3' },
          { id: 'b', label: 'a = 2,  b = 5,  c = 3', hint: L("Ikkinchi koeffitsiyent ishorasi minus, unutilmasin.", 'У второго коэффициента знак минус, его не теряй.', 'The second coefficient carries a minus sign, do not drop it.') },
          { id: 'c', label: 'a = 2,  b = −5,  c = −3', hint: L("Ozod had bu yerda musbat uch.", 'Свободный член здесь положительная тройка.', 'The constant term here is a positive three.') },
        ],
        solution: ['a — eng katta darajali had oldida', '2, −5, 3'],
      },
      {
        expr: <Row size="big" align="center">{'x² + 4x − 7 = 0'}</Row>,
        ok: L("Ha. Iks kvadrat oldida hech narsa yozilmagan, koeffitsiyent bir.", 'Да. Перед икс квадрат ничего не написано, коэффициент один.', 'Yes. Nothing is written before x squared, so the coefficient is one.'),
        question: ASK_ABC,
        items: [
          { id: 'a', right: true, label: 'a = 1,  b = 4,  c = −7' },
          { id: 'b', label: 'a = 0,  b = 4,  c = −7', hint: L("Yozilmagan koeffitsiyent nol emas, u bir.", 'Ненаписанный коэффициент, не нуль, а один.', 'An unwritten coefficient is not zero, it is one.') },
          { id: 'c', label: 'a = 1,  b = −4,  c = −7', hint: L("Ikkinchi had bu yerda musbat to'rt iks.", 'Второй член здесь, положительные четыре икс.', 'The second term here is a positive four x.') },
        ],
        solution: ['a — yashirin bir', '1, 4, −7'],
      },
      {
        expr: <Row size="big" align="center">{'−3x² + x + 5 = 0'}</Row>,
        ok: L("Ha. Iks oldida ham koeffitsiyent yashirin, u bir.", 'Да. Перед иксом коэффициент тоже скрыт, он единица.', 'Yes. Before x the coefficient is hidden too, it is one.'),
        question: ASK_ABC,
        items: [
          { id: 'a', right: true, label: 'a = −3,  b = 1,  c = 5' },
          { id: 'b', label: 'a = 3,  b = 1,  c = 5', hint: L("Bosh koeffitsiyent minus uch, ishorasi tushib qolmasin.", 'Старший коэффициент минус три, знак не теряй.', 'The leading coefficient is negative three, do not lose the sign.') },
          { id: 'c', label: 'a = −3,  b = 0,  c = 5', hint: L("Iks oldida yozilmagan koeffitsiyent nol emas, u bir.", 'Ненаписанный коэффициент перед иксом, не нуль, а один.', 'The unwritten coefficient before x is not zero, it is one.') },
        ],
        solution: ['a — minus uch, b — yashirin bir', '−3, 1, 5'],
      },
      {
        expr: <Row size="big" align="center">{'5x² − x = 0'}</Row>,
        ok: L("Ha. Ozod had yozilmagan, chunki u nolga teng.", 'Да. Свободный член не написан, потому что он равен нулю.', 'Yes. The constant term is not written because it equals zero.'),
        question: ASK_ABC,
        items: [
          { id: 'a', right: true, label: 'a = 5,  b = −1,  c = 0' },
          { id: 'b', label: 'a = 5,  b = −1,  c yo\'q', hint: L("Ozod had yo'q emas, u nolga teng.", 'Свободный член не отсутствует, он равен нулю.', 'The constant term is not missing, it equals zero.') },
          { id: 'c', label: 'a = 5,  b = 1,  c = 0', hint: L("Iks oldidagi koeffitsiyent minus bir.", 'Коэффициент перед иксом, минус один.', 'The coefficient before x is negative one.') },
        ],
        solution: ['c — yozilmagan, chunki nol', '5, −1, 0'],
      },
      {
        expr: <Row size="big" align="center">{'4x² + 9 = 6x'}</Row>,
        ok: L("Ha. Avval hammasi bir tomonga o'tkazildi, to'rt iks kvadrat minus olti iks plyus to'qqiz teng nol.", 'Да. Сначала всё перенесено в одну часть, четыре икс квадрат минус шесть икс плюс девять равно нулю.', 'Yes. Everything was first moved to one side, four x squared minus six x plus nine equals zero.'),
        question: ASK_ABC,
        items: [
          { id: 'a', right: true, label: 'a = 4,  b = −6,  c = 9' },
          { id: 'b', label: 'a = 4,  b = 6,  c = 9', hint: L("O'ng tomondagi olti iks ko'chirilganda ishorasi o'zgardi.", 'Шесть икс справа при переносе меняет знак.', 'The six x on the right flips sign when it is moved.') },
          { id: 'c', label: 'a = 4,  b = 0,  c = 9', hint: L("Olti iks yo'qolmadi, u ko'chirildi.", 'Шесть икс не пропало, оно перенесено.', 'The six x did not vanish, it was moved.') },
        ],
        solution: ['avval bir tomonga o\'tkazildi', '4, −6, 9'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): kvadrat tenglamami yoki emas.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Kvadrat tenglamami",
    'Квадратное ли это уравнение',
    'Is this a quadratic equation',
  ),
  audio: [
    A('mount',
      "Uch yozuv. Har birida koeffitsiyentga qarab qaror qiling.",
      'Три записи. В каждой смотри на коэффициент, чтобы решить.',
      'Three records. In each, look at the coefficient to decide.'),
    A('why',
      "Standart shaklda bo'lmasligi mumkin, bu hal qilmaydi.",
      'Она может быть не в стандартном виде, и это не решает вопрос.',
      'It may not be in standard form, and that does not decide the question.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Koeffitsiyent nolga teng bo'lsa, kvadrat tenglama emas.",
      'Все три разобраны. Если коэффициент равен нулю, это не квадратное уравнение.',
      'All three are done. If the coefficient is zero, it is not a quadratic equation.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'0x² − 2x + 8 = 0'}</Row>,
        ok: L("Ha. Iks kvadratli had nolga ko'paytirilgan, u yo'qoladi.", 'Да. Член с икс квадрат умножен на нуль и исчезает.', 'Yes. The x-squared term is multiplied by zero and vanishes.'),
        question: L('Bu kvadrat tenglamami?', 'Это квадратное уравнение?', 'Is this a quadratic equation?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, chiziqli", 'Нет, линейное', 'No, linear') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Koeffitsiyent nol, birinchi had yo'qoladi.", 'Коэффициент нуль, первый член исчезает.', 'The coefficient is zero, the first term vanishes.') },
        ],
        solution: ['0x² yo\'qoladi', '−2x + 8 = 0'],
      },
      {
        expr: <Row size="big" align="center">{'x² = 5'}</Row>,
        ok: L("Ha. Iks kvadrat oldida yashirin koeffitsiyent bir, standart shaklda emas, lekin kvadrat.", 'Да. Перед икс квадрат скрытый коэффициент один, не в стандартном виде, но квадратное.', 'Yes. Before x squared there is a hidden coefficient one; not standard form, but quadratic.'),
        question: L('Bu kvadrat tenglamami?', 'Это квадратное уравнение?', 'Is this a quadratic equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q, standart shaklda emas", 'Нет, не в стандартном виде', 'No, not in standard form'), hint: L("Standart shaklda bo'lmaslik uni kvadrat bo'lishdan to'xtatmaydi.", 'Отсутствие стандартного вида не мешает ему быть квадратным.', 'Not being in standard form does not stop it from being quadratic.') },
        ],
        solution: ['x² − 5 = 0', 'a = 1'],
      },
      {
        expr: <Row size="big" align="center">{'7x − 2 = 0'}</Row>,
        ok: L("Ha. Bunda iks kvadrat umuman yo'q.", 'Да. Здесь икс квадрат вовсе нет.', 'Yes. There is no x squared here at all.'),
        question: L('Bu kvadrat tenglamami?', 'Это квадратное уравнение?', 'Is this a quadratic equation?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, chiziqli", 'Нет, линейное', 'No, linear') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Iks kvadratli had bu yozuvda yo'q.", 'Члена с икс квадрат в этой записи нет.', 'There is no x-squared term in this record.') },
        ],
        solution: ['eng katta daraja — bir'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, prиборсиz): ildizni podstavka
// bilan tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Son ildizmi",
    'Является ли число корнем',
    'Is the number a root',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Sonni tenglamaga qo'ying va tekshiring.",
      'Три задания. Подставь число в уравнение и проверь.',
      'Three tasks. Substitute the number into the equation and check.'),
    A('why',
      "Har son ildiz bo'lmaydi. Tenglik chiqmasa, u ildiz emas.",
      'Не каждое число является корнем. Если равенства не выходит, это не корень.',
      'Not every number is a root. If equality does not come out, it is not a root.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar son qo'yildi va tenglik tekshirildi.",
      'Все три разобраны. Каждый раз число подставлялось и равенство проверялось.',
      'All three are done. Each time the number was substituted and equality checked.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² − 5x + 6 = 0,   x = 2'}</Row>,
        ok: L("Ha. To'rt minus o'n plyus olti nolga teng.", 'Да. Четыре минус десять плюс шесть равно нулю.', 'Yes. Four minus ten plus six equals zero.'),
        question: L('x = 2 shu tenglamaning ildizimi?', 'Является ли x = 2 корнем этого уравнения?', 'Is x = 2 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikkini qo'yib hisoblang, to'rt minus o'n plyus olti.", 'Подставь двойку и посчитай, четыре минус десять плюс шесть.', 'Substitute two and compute, four minus ten plus six.') },
        ],
        solution: ['4 − 10 + 6', '= 0'],
      },
      {
        expr: <Row size="big" align="center">{'x² + 3x − 4 = 0,   x = 1'}</Row>,
        ok: L("Ha. Bir plyus uch minus to'rt nolga teng.", 'Да. Один плюс три минус четыре равно нулю.', 'Yes. One plus three minus four equals zero.'),
        question: L('x = 1 shu tenglamaning ildizimi?', 'Является ли x = 1 корнем этого уравнения?', 'Is x = 1 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Birni qo'yib hisoblang, bir plyus uch minus to'rt.", 'Подставь единицу и посчитай, один плюс три минус четыре.', 'Substitute one and compute, one plus three minus four.') },
        ],
        solution: ['1 + 3 − 4', '= 0'],
      },
      {
        expr: <Row size="big" align="center">{'x² − 2x − 3 = 0,   x = 1'}</Row>,
        ok: L("Ha. Bir minus ikki minus uch minus to'rtga teng, nolga emas.", 'Да. Один минус два минус три равно минус четырём, а не нулю.', 'Yes. One minus two minus three equals minus four, not zero.'),
        question: L('x = 1 shu tenglamaning ildizimi?', 'Является ли x = 1 корнем этого уравнения?', 'Is x = 1 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Birni qo'yib hisoblang, bir minus ikki minus uch. Nol chiqmaydi.", 'Подставь единицу и посчитай, один минус два минус три. Нуль не выходит.', 'Substitute one and compute, one minus two minus three. Zero does not come out.') },
        ],
        solution: ['1 − 2 − 3', '= −4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): chetdan olingan
// yechimda had ko'chirilganda ishora yo'qoladi (З39).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ko'chirishda ishora yo'qoldi",
    'Знак потерялся при переносе',
    'The sign got lost while moving a term',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham had ko'chirilganda ishora xato qoldi.",
      'Два задания. В обоих при переносе слагаемого знак поставлен неверно.',
      'Two tasks. In both, moving a term left the sign wrong.'),
    A('why',
      "Bir tomondan boshqa tomonga o'tganda ishora aylanadi.",
      'При переходе из одной части в другую знак переворачивается.',
      'When a term moves from one side to the other, its sign flips.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Ko'chirilgan had har safar ishorasini aylantirdi.",
      'Оба разобраны. Перенесённое слагаемое каждый раз меняло знак.',
      'Both are done. The moved term flipped its sign each time.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3x² + 2 = 5x   →   3x² + 5x + 2 = 0'}</Row>,
        ok: L("Ha. Besh iks o'ng tomondan chapga o'tganda minus bo'lishi kerak edi.", 'Да. Пять икс при переходе справа налево должно было стать минусом.', 'Yes. Five x, moving from right to left, should have become negative.'),
        question: L("To'g'ri standart shakl qaysi?", 'Какой стандартный вид верен?', 'Which standard form is correct?'),
        items: [
          { id: 'a', right: true, label: '3x² − 5x + 2 = 0' },
          { id: 'b', label: '3x² + 5x + 2 = 0', hint: L("Bu ko'rsatilgan xato yozuvning o'zi, ishora aylanmagan.", 'Это и есть показанная ошибочная запись, знак не перевёрнут.', 'This is the very mistaken record shown, the sign was not flipped.') },
          { id: 'c', label: '3x² − 5x − 2 = 0', hint: L("Ozod had ikki bu yerda musbat, u o'zgarmagan edi.", 'Свободный член два здесь положителен, он не менялся.', 'The constant term two here is positive; it was never moved.') },
        ],
        solution: ['3x² + 2 − 5x = 0', '3x² − 5x + 2 = 0'],
      },
      {
        expr: <Row size="big" align="center">{'x² − 4 = 3x   →   x² − 3x + 4 = 0'}</Row>,
        ok: L("Ha. Manfiy to'rt chap tomonda turgani uchun o'zgarmaydi, uch iks esa o'tganda minus bo'ladi.", 'Да. Минус четыре стоит слева и не меняется, а три икс при переходе становится минусом.', 'Yes. Negative four stays on the left unchanged, while three x becomes negative when it moves.'),
        question: L("To'g'ri standart shakl qaysi?", 'Какой стандартный вид верен?', 'Which standard form is correct?'),
        items: [
          { id: 'a', right: true, label: 'x² − 3x − 4 = 0' },
          { id: 'b', label: 'x² − 3x + 4 = 0', hint: L("Ozod had manfiy to'rt, u chapda edi va ishorasi o'zgarmadi.", 'Свободный член минус четыре, он был слева и знак не менял.', 'The constant term is negative four; it stayed on the left and its sign did not change.') },
          { id: 'c', label: 'x² + 3x − 4 = 0', hint: L("Uch iks o'tganda ishorasi aylanadi, ikkinchi koeffitsiyent minus uch.", 'Три икс при переносе меняет знак, второй коэффициент минус три.', 'Three x flips sign when moved; the second coefficient is negative three.') },
        ],
        solution: ['x² − 4 − 3x = 0', 'x² − 3x − 4 = 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill`): to'g'ri
// to'rtburchak masalasi standart shaklga keltiriladi, yechilmaydi.
// ============================================================
const S13 = {
  eyebrow: L('MASALADAN TENGLAMA', 'ИЗ ЗАДАЧИ — УРАВНЕНИЕ', 'FROM A PROBLEM TO AN EQUATION'),
  title: L(
    "Yuza masalasini standart shaklga keltiring",
    'Приведи задачу о площади к стандартному виду',
    'Bring the area problem to standard form',
  ),
  audio: [
    A('mount',
      "To'g'ri to'rtburchakning bir tomoni ikkinchisidan uzun. Yuza berilgan.",
      'Одна сторона прямоугольника длиннее другой. Площадь дана.',
      'One side of the rectangle is longer than the other. The area is given.'),
    A('why',
      "Qisqa tomonni iks deb oling, yuzani yozing va standart shaklga keltiring.",
      'Обозначь короткую сторону иксом, запиши площадь и приведи к стандартному виду.',
      'Call the short side x, write the area, and bring it to standard form.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar yuza yozilib, keyin standart shaklga keltirildi.",
      'Все три заполнены. Каждый раз площадь записывалась, потом приводилась к стандартному виду.',
      'All three are filled. Each time the area was written, then brought to standard form.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['3', '10'],
      lines: [
        [{ t: 'x(x + ' }, { slot: '3' }, { t: ') = ' }, { slot: '10' }],
        [{ t: 'x² + 3x − ' }, { slot: '10' }, { t: ' = 0' }],
      ],
    },
    tasks: [
      {
        chips: ['5', '6'],
        lines: [
          [{ t: 'x(x + ' }, { slot: '5' }, { t: ') = ' }, { slot: '6' }],
          [{ t: 'x² + 5x − ' }, { slot: '6' }, { t: ' = 0' }],
        ],
      },
      {
        chips: ['1', '20'],
        lines: [
          [{ t: 'x(x + ' }, { slot: '1' }, { t: ') = ' }, { slot: '20' }],
          [{ t: 'x² + x − ' }, { slot: '20' }, { t: ' = 0' }],
        ],
      },
      {
        chips: ['6', '7'],
        lines: [
          [{ t: 'x(x + ' }, { slot: '6' }, { t: ') = ' }, { slot: '7' }],
          [{ t: 'x² + 6x − ' }, { slot: '7' }, { t: ' = 0' }],
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
    "Ta'rif bo'yicha to'rt savol",
    'Четыре вопроса по определению',
    'Four questions about the definition',
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
        id: 'q1', tag: 'З38',
        ask: L('Qaysi tenglama kvadrat emas?', 'Какое уравнение не является квадратным?', 'Which equation is not quadratic?'),
        options: [
          { id: 'lin', right: true, label: '5x − 2 = 0' },
          { id: 'q1o', label: 'x² − 9 = 0' },
          { id: 'q2o', label: '3x² = 0' },
          { id: 'q3o', label: 'x² = 2x' },
        ],
        hint: L("Bunda iks kvadrat umuman yo'q.", 'Здесь икс квадрат вовсе нет.', 'There is no x squared here at all.'),
        ok: L("To'g'ri, bu chiziqli tenglama.", 'Верно, это линейное уравнение.', 'Correct, this is a linear equation.'),
      },
      {
        id: 'q2', tag: 'З39',
        ask: L('3x² − 7x + 4 = 0 tenglamada ozod had qanday?', 'Каков свободный член в уравнении 3x² − 7x + 4 = 0?', 'What is the constant term in 3x² − 7x + 4 = 0?'),
        options: [
          { id: 'ok', right: true, label: '4' },
          { id: 'neg4', label: '−4' },
          { id: 'seven', label: '7' },
          { id: 'negseven', label: '−7' },
        ],
        hint: L("Ozod had, iksisiz qolgan son, ishorasi bilan birga.", 'Свободный член, число без икса, вместе со своим знаком.', 'The constant term is the number without x, sign included.'),
        ok: L("To'g'ri, u musbat to'rt.", 'Верно, это положительная четвёрка.', 'Correct, it is a positive four.'),
      },
      {
        id: 'q3', tag: 'З38',
        ask: L('0x² + 6x − 1 = 0 kvadrat tenglamami?', 'Является ли 0x² + 6x − 1 = 0 квадратным уравнением?', 'Is 0x² + 6x − 1 = 0 a quadratic equation?'),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
          { id: 'oneRoot', label: L('Ha, lekin ildizi bitta', 'Да, но с одним корнем', 'Yes, but with one root') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Koeffitsiyent nolga teng, birinchi had yo'qoladi.", 'Коэффициент равен нулю, первый член исчезает.', 'The coefficient is zero, the first term vanishes.'),
        ok: L("To'g'ri, bu chiziqli tenglama.", 'Верно, это линейное уравнение.', 'Correct, this is a linear equation.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('x = −1 son x² + 4x + 3 = 0 tenglamaning ildizimi?', 'Является ли x = −1 корнем уравнения x² + 4x + 3 = 0?', 'Is x = −1 a root of x² + 4x + 3 = 0?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
          { id: 'pos', label: L('Faqat musbat sonlar ildiz bo\'ladi', 'Корнем бывают только положительные', 'Only positive numbers can be roots') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Minus birni qo'yib hisoblang, bir minus to'rt plyus uch.", 'Подставь минус один и посчитай, один минус четыре плюс три.', 'Substitute negative one and compute, one minus four plus three.'),
        ok: L("To'g'ri, bir minus to'rt plyus uch nolga teng.", 'Верно, один минус четыре плюс три равно нулю.', 'Correct, one minus four plus three equals zero.'),
      },
      {
        id: 'q5', tag: 'З39',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "2x kvadrat plyus uch teng besh iksni standart shaklga keltirib yig'ing.",
            'Приведи два икс квадрат плюс три равно пять икс к стандартному виду и собери.',
            'Bring two x squared plus three equals five x to standard form and assemble it.',
          ),
          lines: [
            [{ t: '2x² + 3 = 5x   →   2x² − ' }, { slot: '5' }, { t: 'x + ' }, { slot: '3' }, { t: ' = 0' }],
          ],
          tiles: [
            { id: 't1', v: '5', x: 12, y: 12 },
            { id: 't2', v: '3', x: 70, y: 14 },
            { id: 't3', v: '−3', x: 40, y: 50 },
            { id: 't4', v: '2', x: 78, y: 48 },
            { id: 't5', v: '8', x: 14, y: 52 },
          ],
          hint: L(
            "O'ng tomondagi had chapga o'tganda ishorasini aylantiradi.",
            'Слагаемое справа при переходе слева меняет знак.',
            'The term on the right flips its sign when it moves to the left.',
          ),
          doneNote: L(
            "Yig'ildi. Besh iks o'tganda minus bo'ldi, uch esa o'zgarmadi.",
            'Собрано. Пять икс при переносе стало минусом, а три не изменилось.',
            'Assembled. Five x became negative when moved, while three stayed unchanged.',
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
    "Kvadrat tenglamaning ildizi birdan ortiq bo'lishi mumkin",
    'У квадратного уравнения корней может быть больше одного',
    'A quadratic equation can have more than one root',
  ),
  audio: [
    A('s0',
      "Darsdan bitta farq qoladi. 9dan ildiz bitta son, iks kvadrat to'qqiz tenglamasi esa ikki ildizga ega.",
      'С урока остаётся одно различие. Корень из девяти это одно число, а уравнение икс квадрат девять имеет два корня.',
      'One distinction stays with you. The root of nine is one number, while the equation x squared nine has two roots.'),
    A('s1',
      "Bugun uch narsa qilindi. Kvadrat tenglama ta'rifini ko'rdingiz, koeffitsiyentlarni nomladingiz va standart shaklga keltirdingiz.",
      'Сегодня сделано три вещи. Ты увидел определение квадратного уравнения, назвал коэффициенты и привёл уравнение к стандартному виду.',
      'Three things are done today. You saw the definition of a quadratic equation, named the coefficients, and brought an equation to standard form.'),
    A('s2',
      "Keyingi darsda chala kvadrat tenglamalar. Ularni yechish usulini ko'ramiz.",
      'В следующем уроке неполные квадратные уравнения, увидим способ их решения.',
      'The next lesson covers incomplete quadratic equations. We will see how to solve them.'),
  ],
  props: {
    mark: 'x² = 9',
    markNote: L(
      "ikki ildizga ega: 3 va minus 3",
      'имеет два корня: 3 и минус 3',
      'has two roots: 3 and negative 3',
    ),
    lines: [
      L(
        "ax² + bx + c = 0, a nolga teng emas",
        'a x² + b x + c = 0, a не равно нулю',
        'a x squared plus b x plus c equals zero, a is not zero',
      ),
      L(
        "a — bosh, b — ikkinchi koeffitsiyent, c — ozod had",
        'a — старший, b — второй коэффициент, c — свободный член',
        'a is the leading, b is the second coefficient, c is the constant term',
      ),
      L(
        "ildiz — tenglamani to'g'ri qiladigan son",
        'корень — число, обращающее уравнение в верное равенство',
        'a root is a number that makes the equation true',
      ),
    ],
    bridge: L(
      "Keyingi dars: chala kvadrat tenglamalar",
      'Следующий урок: неполные квадратные уравнения',
      'Next lesson: incomplete quadratic equations',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — STANDART SHAKLGA KELTIRISH.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З38', 'З38', 'З39',
    'З39', 'З38', 'З38', 'З39', 'З38',
    'З16', 'З39', 'З39', null, null,
  ],
  mechanic: { at: 5, tool: 'twosides', kind: 'standard' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
