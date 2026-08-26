// ============================================================================
// 8-sinf, Dars 18. DISKRIMINANT VA ILDIZLAR SONI.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `plot.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `paramplot`: erkin had suriladi, parabola
// o'q bilan qanday uchrashishi ko'zda ko'rinadi.
//
// REJADAGI IKKI ASBOB, BITTASI TANLANDI. Reja bu darsga ParamPlot va
// PlotTap ni beradi. Blokning boshqa uchdan-uchga qoidasi (metodist qarori
// 2026-08-21) — bitta mexanika, bitta pozitsiya. ParamPlot D = 0 holini
// aynan shu darsning markaziy adashishi bilan bog'laydi (pastga qarang),
// PlotTap alohida ekran talab qilardi va 15 ta joy band. Ochiq savol
// sifatida qoladi: agar kerak bo'lsa, keyingi hisob-kitobda PlotTap alohida
// darsga (masalan, 21-darsga, FourWindows bilan bir qatorda) ko'chirilishi
// mumkin.
//
// DARSNING UCH ISHI (darslik, 24-§, 144-bet):
//   1) D > 0 bo'lsa, ikkita TURLI ildiz;
//   2) D = 0 bo'lsa, BITTA ildiz (ikkitasi teng, yo'q emas!);
//   3) D < 0 bo'lsa, haqiqiy ildiz yo'q.
//
// ENG NOZIK JOY. «D = 0» «ildiz yo'q» bilan chalkashtiriladi — bu kurs
// ro'yxatida allaqachon turgan З9 adashishi. Formula buni ko'rsatadi:
// D = 0 bo'lganda plyus-minus ildiz nolga aylanadi, ± YO'QOLADI, lekin
// o'ZI yo'qolmaydi — natija bitta son, hech narsa emas.
//
// DARSLIK. O'zbek darsligi, 24-§, 144-bet: (2) formuladan uch hol
// chiqarilishi, uch masala misolida.
//
// ADASHISHLAR: uchtasi ham qaytadi, yangisi yo'q:
//   З9  — D va ildiz soni chalkashtirildi, «D = 0 — ildiz yo'q» deb
//         o'ylandi (kursda oldindan turgan tag, Б3, 18-dars uchun);
//   З41 — D manfiy bo'lganda ildiz bor-yo'qligi xato baholandi
//         (16-darsdan qaytadi);
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
  id: 'alg-8-18',
  n: 18,
  row: 20,
  block: 'Б3',
  topic: L(
    'Diskriminant va ildizlar soni',
    'Дискриминант и количество корней',
    'The discriminant and the number of roots',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "D > 0 bo'lsa, tenglama ikkita TURLI ildizga ega",
    'Если D > 0, уравнение имеет два РАЗЛИЧНЫХ корня',
    'If D > 0, the equation has two DIFFERENT roots',
  ),
  L(
    "D = 0 bo'lsa, tenglama BITTA ildizga ega, ildiz yo'q emas",
    'Если D = 0, уравнение имеет ОДИН корень, а не отсутствие корней',
    'If D = 0, the equation has ONE root, not an absence of roots',
  ),
  L(
    "D < 0 bo'lsa, tenglama haqiqiy ildizga ega emas",
    'Если D < 0, уравнение не имеет действительных корней',
    'If D < 0, the equation has no real roots',
  ),
]

export const MISS = {
  'З9': {
    what: L(
      "D va ildizlar soni chalkashtirildi, «D nolga teng — ildiz yo'q» deb o'ylandi",
      'дискриминант и число корней спутаны, решили что «D равно нулю значит корней нет»',
      'the discriminant and the root count were confused, taken as "D equals zero means no roots"',
    ),
    wrong: '0',
    at: 5,
  },
  'З41': {
    what: L(
      "D manfiy bo'lganda ildiz bor-yo'qligi xato baholandi",
      'при отрицательном D наличие корней оценено неверно',
      'when D is negative, whether roots exist was judged wrong',
    ),
    wrong: 'x^2+3*x+5',
    at: 3,
  },
  'З16': {
    what: L(
      'javob son bilan tekshirilmadi',
      'ответ не проверен числом',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 11,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: ikki tenglama, ikkalasida ham ildiz bormi.
// Yakun: ikkalasida ham bor, faqat soni boshqa.
// ============================================================
const SC_BOTH = L('IKKALASIDA HAM ILDIZ BORMI', 'ЕСТЬ ЛИ КОРНИ У ОБОИХ', 'DO BOTH HAVE ROOTS')
const SC_TWO = L('IKKI ILDIZ', 'ДВА КОРНЯ', 'TWO ROOTS')
const SC_ONE = L('BITTA ILDIZ', 'ОДИН КОРЕНЬ', 'ONE ROOT')

const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Ikki tenglama, D lari boshqa",
      'Два уравнения, у них разный D',
      'Two equations, with different D',
    )}>
      <text x="96" y="65" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'x² − 5x + 6 = 0'}</text>

      <text x="304" y="65" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'x² − 4x + 4 = 0'}</text>

      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="75" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="126" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_BOTH)}</text>
      <line x1="112" y1="138" x2="288" y2="138" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

const FinalScene = () => {
  const t = useT()
  return (
    <SceneBand kind="final" label={L(
      "Ikkalasida ham ildiz bor, faqat soni boshqa",
      'У обоих есть корни, только число разное',
      'Both have roots, only the count differs',
    )}>
      <text x="92" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink}>{'D = 1'}</text>
      <g className="g8-seat" style={{ '--d': '500ms' }}>
        <text x="92" y="48" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="8" letterSpacing="0.14em" fill={T.ok}>{t(SC_TWO)}</text>
      </g>

      <line x1="200" y1="16" x2="200" y2="56" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>

      <text x="306" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink}>{'D = 0'}</text>
      <g className="g8-seat" style={{ '--d': '1000ms' }}>
        <text x="306" y="48" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="8" letterSpacing="0.14em" fill={T.tip}>{t(SC_ONE)}</text>
      </g>

      <g className="g8-seat" style={{ '--d': '1500ms' }}>
        <line x1="60" y1="74" x2="340" y2="74" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <circle cx="112" cy="74" r="4.4" fill={T.ok}/>
        <text x="112" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>2</text>
        <circle cx="150" cy="74" r="4.4" fill={T.ok}/>
        <text x="150" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>3</text>
        <circle cx="280" cy="74" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
        <text x="280" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>2</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('IKKALASIDA HAM BORMI', 'ЕСТЬ ЛИ У ОБОИХ', 'DO BOTH HAVE THEM'),
  title: L(
    "Ikkalasining ham ildizi bormi",
    'Есть ли у обоих корни',
    'Do both have roots',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki tenglama. Ikkalasi ham kvadrat tenglama.",
      'Два уравнения. Оба квадратные.',
      'Two equations. Both are quadratic.'),
    A('why',
      "Taxmin qiling, ikkalasining ham ildizi bormi.",
      'Предположи, есть ли корни у обоих.',
      'Predict whether both have roots.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, ikkalasining ham ildizi bormi?",
      'Как думаешь, есть ли корни у обоих?',
      'Do you think both have roots?',
    ),
    items: [
      { id: 'both', show: L('Ha, ikkalasida ham', 'Да, у обоих', 'Yes, both') },
      { id: 'one', show: L('Yo\'q, faqat bittasida', 'Нет, только у одного', 'No, only one') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. D ni hisoblashni eslash (17-darsdan).
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "D ni hisoblang",
    'Вычисли D',
    'Compute D',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida D to'g'ri hisoblangan.",
      'Четыре записи. Только в одной D посчитан верно.',
      'Four records. Only one has D computed correctly.'),
    A('why',
      "D b kvadrat minus to'rt ac ga teng, o'tgan darsda ko'rgan edik.",
      'D равно b в квадрате минус четыре ac, мы видели это на прошлом уроке.',
      'D equals b squared minus four a c, as we saw in the last lesson.'),
  ],
  props: {
    ask: L(
      "3x² + 2x − 1 = 0 uchun D qaysi to'g'ri?",
      'Какое D верно для 3x² + 2x − 1 = 0?',
      'Which D is correct for 3x² + 2x − 1 = 0?',
    ),
    items: [
      { id: 'right', show: 'D = 16', right: true, name: L("to'rt plyus o'n ikki", 'четыре плюс двенадцать', 'four plus twelve') },
      {
        id: 'sign', show: 'D = −8',
        hint: L("To'rt ac ni ayirish kerak, c manfiy bo'lgani uchun bu qo'shishga aylanadi.", 'Четыре ac нужно вычесть, а так как c отрицательно, это становится сложением.', 'Four a c must be subtracted, and since c is negative, this becomes addition.'),
      },
      {
        id: 'noSquare', show: 'D = 2 − 12',
        hint: L("B ning o'zi emas, b ning kvadrati olinadi.", 'Берётся не сам b, а квадрат b.', 'It is not b itself, but b squared that is used.'),
      },
      {
        id: 'wrongMul', show: 'D = 4 − 6',
        hint: L("To'rt ac hisobida a uch, c minus bir, ko'paytma minus o'n ikki.", 'В четырёх ac учти, что a три, c минус один, произведение минус двенадцать.', 'In four a c, a is three and c is negative one, so the product is negative twelve.'),
      },
    ],
    after: L(
      "To'g'ri. To'rt plyus o'n ikki o'n oltiga teng.",
      'Верно. Четыре плюс двенадцать равно шестнадцати.',
      'Correct. Four plus twelve equals sixteen.',
    ),
  },
}

// ============================================================
// EKRAN 3. ERKIN HADNI BURANG (1-darsning `steppers`). Natija — D dan
// ildiz. D manfiyga tushganda qiymat yo'qoladi (З41).
// ============================================================
const S3 = {
  eyebrow: L('ERKIN HADNI BURANG', 'КРУТИ СВОБОДНЫЙ ЧЛЕН', 'TURN THE CONSTANT TERM'),
  title: L(
    "Iks kvadrat plyus 6x plyus c uchun D dan ildiz",
    'Корень из D для икс квадрат плюс шесть икс плюс c',
    'The root of D for x squared plus six x plus c',
  ),
  audio: [
    A('mount',
      "b olti bo'lganda D o'ttiz olti minus to'rt c ga teng. Natija D dan ildiz.",
      'При b равном шести D равно тридцати шести минус четыре c. Результат равен корню из D.',
      'With b equal to six, D equals thirty six minus four c. The result is the root of D.'),
    A('why',
      "Uch maqsad beriladi. c ning turli qiymatlarida natijani toping.",
      'Даны три цели. Находи результат при разных значениях c.',
      'Three targets are given. Find the result at different values of c.'),
    A('why',
      "Oxirida c ni yana oshiring va nima bo'lishini ko'ring.",
      'В конце увеличь c ещё и посмотри, что будет.',
      'At the end increase c further and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'c', label: L('c ning qiymati', 'значение c', 'the value of c'),
        start: 0, min: 0, max: 12, step: 1, risky: true,
      },
    ],
    calc: (v) => {
      const D = 36 - 4 * v[0]
      return D < 0 ? null : Math.round(Math.sqrt(D) * 100) / 100
    },
    resultLabel: L('√D', '√D', '√D'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "D hali manfiyga tushmasin, avval maqsadlarni oling.",
      'D пока не опускай в минус, сначала возьми цели.',
      'Do not bring D into the negatives yet, take the targets first.',
    ),
    goals: [
      {
        value: 4,
        ask: L("Natija 4 ga teng bo'lsin", 'Пусть результат будет равен 4', 'Make the result equal 4'),
        after: L(
          "To'rt. c beshga teng bo'lganda D o'n oltiga teng.",
          'Четыре. При c равном пяти D равно шестнадцати.',
          'Four. With c equal to five, D equals sixteen.',
        ),
      },
      {
        value: 2,
        ask: L("Endi natija 2 ga teng bo'lsin", 'Теперь пусть результат будет равен 2', 'Now make the result equal 2'),
        after: L(
          "Ikki. c sakkizga teng bo'lganda D to'rtga teng.",
          'Два. При c равном восьми D равно четырём.',
          'Two. With c equal to eight, D equals four.',
        ),
      },
      {
        value: 0,
        ask: L("Oxirgisi, natija nolga teng bo'lsin", 'Последняя, пусть результат будет равен нулю', 'The last one, make the result equal zero'),
        after: L(
          "Nol. c to'qqizga teng bo'lganda D nolga teng, lekin qiymat yo'q emas, u nolning o'zi.",
          'Нуль. При c равном девяти D равно нулю, но значения не отсутствует, оно и есть нуль.',
          'Zero. With c equal to nine, D equals zero, but the value is not absent, it is zero itself.',
        ),
      },
    ],
    ask: L("Natija 4 ga teng bo'lsin", 'Пусть результат будет равен 4', 'Make the result equal 4'),
    ask2: L("Endi c ni yana oshiring", 'Теперь увеличь c ещё', 'Now increase c further'),
    broke: L(
      "c to'qqizdan katta bo'lganda D manfiy bo'ladi, kvadrat ildiz ostida manfiy son qoladi, qiymat yo'q. Demak bu holda haqiqiy ildiz yo'q.",
      'Когда c больше девяти, D становится отрицательным, под квадратным корнем остаётся отрицательное число, значения нет. Значит в этом случае действительных корней нет.',
      'When c exceeds nine, D becomes negative, a negative number is left under the square root, and there is no value. So in this case there are no real roots.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI TENGLAMANING IKKI ILDIZI BOR (1-darsning `pick`).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI BIRI', 'КОТОРОЕ ИЗ ЭТИХ', 'WHICH ONE'),
  title: L(
    "Qaysi tenglamaning ikkita turli ildizi bor",
    'У какого уравнения два различных корня',
    'Which equation has two different roots',
  ),
  audio: [
    A('mount',
      "To'rt tenglama. Faqat bittasida D musbat.",
      'Четыре уравнения. Только в одном D положительно.',
      'Four equations. Only one has a positive D.'),
    A('why',
      "Qolganlarida D nol yoki manfiy.",
      'В остальных D равно нулю или отрицательно.',
      'In the others, D is zero or negative.'),
  ],
  props: {
    ask: L(
      "Qaysi tenglamaning ikkita turli ildizi bor?",
      'У какого уравнения два различных корня?',
      'Which equation has two different roots?',
    ),
    items: [
      { id: 'right', show: 'x² − 5x + 6 = 0', right: true, name: L('D = 1', 'D = 1', 'D = 1') },
      {
        id: 'zero1', show: 'x² − 4x + 4 = 0',
        hint: L("D nolga teng, bitta ildiz bor, ikkita emas.", 'D равно нулю, есть один корень, а не два.', 'D equals zero, there is one root, not two.'),
      },
      {
        id: 'neg1', show: 'x² + 2x + 5 = 0',
        hint: L("D manfiy, haqiqiy ildiz yo'q.", 'D отрицательно, действительных корней нет.', 'D is negative, there are no real roots.'),
      },
      {
        id: 'neg2', show: 'x² + x + 1 = 0',
        hint: L("D manfiy, bu yerda ham ildiz yo'q.", 'D отрицательно, здесь тоже нет корней.', 'D is negative, here too there are no roots.'),
      },
    ],
    after: L(
      "To'g'ri. D bir, bu musbat, ikkita turli ildiz beradi.",
      'Верно. D равно единице, это положительно, даёт два разных корня.',
      'Correct. D equals one, which is positive, giving two different roots.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — SLAYDER (`paramplot`). Erkin had
// suriladi, D = 0 nuqtasi topiladi: parabola o'qqa BIR nuqtada tegadi.
// ============================================================
const S5 = {
  eyebrow: L('ERKIN HADNI SURING', 'СДВИНЬ СВОБОДНЫЙ ЧЛЕН', 'MOVE THE CONSTANT TERM'),
  title: L(
    "Erkin had to'qqizga teng bo'lganda nima bo'ladi",
    'Что будет, когда свободный член равен девяти',
    'What happens when the constant term equals nine',
  ),
  audio: [
    A('mount',
      "y teng iks kvadrat minus 6x plyus c. Erkin had c ni surib ko'ring.",
      'y равно икс квадрат минус шесть икс плюс c. Подвигай свободный член c.',
      'y equals x squared minus six x plus c. Move the constant term c.'),
    A('why',
      "Avval taxmin qiling, keyin slayderni suring.",
      'Сначала предположи, потом подвигай слайдер.',
      'First predict, then move the slider.'),
  ],
  props: {
    build: (c) => (x) => x * x - 6 * x + c,
    param: { name: 'c', start: 0, from: 0, to: 12, step: 1 },
    formula: (c) => [{ t: 'y = x² − 6x + ' }, { t: String(c), accent: true }],
    from: -2, to: 8, yFrom: -12, yTo: 15, h: 196,
    xLabel: 'x', yLabel: 'y', grid: true,
    ask: L(
      "Erkin had to'qqizga teng bo'lganda, parabola o'q bilan necha nuqtada uchrashadi?",
      'Когда свободный член равен девяти, в скольких точках парабола встречается с осью?',
      'When the constant term equals nine, at how many points does the parabola meet the axis?',
    ),
    predict: {
      items: [
        {
          id: 'two',
          label: L('Ikkita', 'Два', 'Two'),
          hint: L(
            "Ikkita bo'lishi uchun parabola ikki xil nuqtada kesishishi kerak, lekin to'qqizda ular bir nuqtaga birlashadi.",
            'Для двух парабола должна пересекать ось в двух разных точках, а при девяти они сливаются в одну.',
            'For two, the parabola must cross the axis at two distinct points, but at nine they merge into one.',
          ),
        },
        {
          id: 'one', right: true,
          label: L('Bitta', 'Один', 'One'),
        },
        {
          id: 'zero',
          label: L('Nolta', 'Нуль', 'Zero'),
          hint: L(
            "Nolta bo'lishi uchun parabola umuman tegmasligi kerak, lekin to'qqizda u bir nuqtada tegadi.",
            'Для нуля парабола не должна касаться вовсе, а при девяти она касается в одной точке.',
            'For zero, the parabola must not touch at all, but at nine it does touch at one point.',
          ),
        },
      ],
    },
    checkAt: (c) => c === 9,
    after: L(
      "To'qqizda parabola o'qqa faqat bir nuqtada tegadi. D nolga teng bo'lganda ildiz yo'q emas, u bitta.",
      'При девяти парабола касается оси только в одной точке. Когда D равно нулю, корень не отсутствует, он один.',
      'At nine the parabola touches the axis at only one point. When D equals zero, the root is not absent, it is one.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): ildizlar sonini ikki yo'l
// bilan aniqlash — D hisoblab yoki grafik chizib.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Ildizlar sonini ikki yo'l bilan aniqlash",
    'Определить число корней двумя способами',
    'Determining the number of roots two ways',
  ),
  audio: [
    A('mount',
      "Bitta tenglama va ikki yo'l. Ikkalasi ham bir xil javob beradi.",
      'Одно уравнение и два пути. Оба дают один ответ.',
      'One equation and two ways. Both give the same answer.'),
    W('w2',
      "Birinchi yo'lda D hisoblanadi va ishorasiga qaraladi.",
      'В первом пути считается D и смотрят на его знак.',
      'In the first way, D is computed and its sign is checked.'),
    W('w4',
      "Ikkinchi yo'lda parabola chiziladi va o'q bilan kesishishlar sanaladi.",
      'Во втором пути строится парабола и считаются пересечения с осью.',
      'In the second way, the parabola is drawn and its crossings with the axis are counted.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L("1-USUL — D HISOBLASH", 'СПОСОБ 1 — СЧИТАТЬ D', 'METHOD 1 — COMPUTE D'),
        lead: L(
          "D ishorasiga qaraladi, grafik kerak emas",
          'Смотрят на знак D, график не нужен',
          "D's sign is checked, no graph needed",
        ),
        rows: [
          { text: 'x² − 5x + 6 = 0' },
          { text: 'D = 25 − 24 = 1', tone: 'ok', note: L('musbat', 'положительно', 'positive') },
        ],
      },
      {
        name: L("2-USUL — GRAFIK CHIZISH", 'СПОСОБ 2 — СТРОИТЬ ГРАФИК', 'METHOD 2 — DRAW THE GRAPH'),
        lead: L(
          "Parabola chiziladi, o'q bilan kesishishlar sanaladi",
          'Строится парабола, считаются пересечения с осью',
          'The parabola is drawn, its crossings with the axis are counted',
        ),
        rows: [
          { text: L('parabola pastga qaraydi', 'парабола смотрит вниз', 'the parabola opens downward') },
          { text: L("o'qni ikki nuqtada kesadi", 'пересекает ось в двух точках', 'crosses the axis at two points'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "D hisoblash tezroq, grafik esa ko'zga ko'rinadigan isbot",
          'Считать D быстрее, а график — видимое доказательство',
          'Computing D is faster, the graph is a visible proof',
        ),
        rows: [{ text: L('ikkita ildiz', 'два корня', 'two roots'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): formula ichida D nolga teng
// bo'lganda nima bo'ladi — plyus-minus yo'qoladi, natija emas.
// ============================================================
const S7 = {
  eyebrow: L('D NOLGA TENG BO\'LSA', 'ЕСЛИ D РАВНО НУЛЮ', 'IF D EQUALS ZERO'),
  title: L(
    "Formulada plyus-minus qanday yo'qoladi",
    'Как в формуле исчезает плюс-минус',
    'How plus-or-minus disappears in the formula',
  ),
  audio: [
    A('mount',
      "Formulada iks bir, ikki teng minus b plyus-minus D dan ildiz, ikkiga a ga bo'lingan.",
      'В формуле x один, два равно минус b плюс-минус корень из D, делённое на два a.',
      'In the formula, x one, two equals negative b plus or minus the root of D, over two a.'),
    W('p2',
      "D nolga teng bo'lganda D dan ildiz ham nolga teng bo'ladi.",
      'Когда D равно нулю, корень из D тоже равен нулю.',
      'When D equals zero, the root of D is also zero.'),
    W('p4',
      "Plyus nol va minus nol bir xil, shuning uchun ikki ildiz bir songa birlashadi, ular yo'qolmaydi.",
      'Плюс нуль и минус нуль одно и то же, поэтому два корня сливаются в одно число, а не исчезают.',
      'Plus zero and minus zero are the same, so the two roots merge into one number, they do not vanish.',
    ),
  ],
  props: {
    tokens: [
      { t: 'x', id: 'x' },
      { t: ' = (−b ', id: 'nb' },
      { t: '± √D', id: 'pm' },
      { t: ') / 2a', id: 'den' },
    ],
    steps: [
      {
        focus: 'pm',
        text: L(
          "Birinchi qadam. D nolga teng bo'lganda D dan ildiz ham nolga teng.",
          'Первый шаг. Когда D равно нулю, корень из D тоже равен нулю.',
          'Step one. When D equals zero, the root of D is also zero.',
        ),
      },
      {
        focus: 'pm',
        text: L(
          "Ikkinchi qadam. Plyus nol qo'shish va minus nol ayirish bir xil natija beradi.",
          'Второй шаг. Прибавить нуль и вычесть нуль дают один и тот же результат.',
          'Step two. Adding zero and subtracting zero give the same result.',
        ),
      },
      {
        focus: 'den',
        text: L(
          "Uchinchi qadam. Ikki ildiz bitta songa birlashadi, u minus b ikkiga a ga bo'lingan, ILDIZ YO'QOLMAYDI.",
          'Третий шаг. Два корня сливаются в одно число, равное минус b, делённому на два a, КОРЕНЬ НЕ ИСЧЕЗАЕТ.',
          'Step three. The two roots merge into one number, negative b over two a, the ROOT DOES NOT DISAPPEAR.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "D nolga teng bo'lganda yagona ildiz aynan parabolaning uchi bo'ladi, chunki uch nuqtada parabola o'qqa eng yaqin keladi.",
        'Когда D равно нулю, единственный корень оказывается ровно вершиной параболы, потому что в вершине парабола ближе всего подходит к оси.',
        'When D equals zero, the single root turns out to be exactly the vertex of the parabola, since at the vertex the parabola comes closest to the axis.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 24-§, 144-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "D ning uch holi",
    'Три случая D',
    'The three cases of D',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik qoidasi ochildi, va xukdagi ikkinchi tenglamaning javobi keldi.",
      'Открылось правило из учебника, и второе уравнение с хука получило ответ.',
      'The textbook rule opened, and the second equation from the hook got its answer.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("D musbat bo'lsa, tenglama ikkita turli ildizga ega", 'Если D положительно, уравнение имеет два различных корня', 'If D is positive, the equation has two different roots') },
      { id: 'f2', label: L("D nolga teng bo'lsa, tenglama bitta ildizga ega", 'Если D равно нулю, уравнение имеет один корень', 'If D equals zero, the equation has one root') },
      { id: 'f3', label: L("D manfiy bo'lsa", 'Если D отрицательно', 'If D is negative') },
      { id: 'f4', label: L("tenglama haqiqiy ildizga ega emas", 'уравнение не имеет действительных корней', 'the equation has no real roots') },
      { id: 'w1', label: L("D nolga teng bo'lsa ham ildiz yo'q", 'даже при D равном нулю корней нет', 'even when D equals zero there are no roots') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. D nolga teng bo'lganda ildiz yo'q emas, formula bitta son beradi.",
      'Так не складывается. Когда D равно нулю, корень не отсутствует, формула даёт одно число.',
      'That does not fit. When D equals zero, the root is not absent, the formula gives one number.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 24-§, 144-bet",
        'Учебник, § 24, стр. 144',
        'Textbook, section 24, page 144',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "ikkalasining ham ildizi bormi degan savol edi",
        'вопрос был, есть ли корни у обоих',
        'the question was whether both have roots',
      ),
      right: L(
        "ikkalasida ham bor: birida ikkita, ikkinchisida bitta",
        'у обоих есть: у одного два, у другого один',
        'both have them: one has two, the other has one',
      ),
      winner: 'right',
      note: L(
        "D nolga teng bo'lishi ildizsizlik emas",
        'D равное нулю — не отсутствие корня',
        'D equal to zero is not the absence of a root',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): D ishorasidan ildizlar sonini
// aniqlang.
// ============================================================
const ASK_COUNT = L('Nechta ildiz bor?', 'Сколько корней?', 'How many roots?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "D ishorasidan ildizlar sonini aniqlang",
    'Определи число корней по знаку D',
    'Tell the number of roots from the sign of D',
  ),
  audio: [
    A('mount',
      "Besh tenglama. Har birida D ishorasiga qarab ildizlar sonini ayting.",
      'Пять уравнений. В каждом назови число корней по знаку D.',
      'Five equations. In each, name the number of roots by the sign of D.'),
    A('why',
      "Musbat ikkita, nol bitta, manfiy nolta.",
      'Положительное даёт два, нуль даёт один, отрицательное даёт нуль.',
      'Positive means two, zero means one, negative means zero.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. D ning ishorasi har safar ildizlar sonini aytib berdi.",
      'Все пять разобраны. Знак D каждый раз называл число корней.',
      'All five are done. The sign of D told the number of roots each time.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² + 5x + 6 = 0'}</Row>,
        ok: L("Ha. D bir, bu musbat, ikkita ildiz.", 'Да. D равно одному, это положительно, два корня.', 'Yes. D equals one, which is positive, two roots.'),
        question: ASK_COUNT,
        items: [
          { id: 'a', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'b', label: L('Bitta', 'Один', 'One'), hint: L("D nolga teng emas, u musbat bir.", 'D не равно нулю, оно положительное, единица.', 'D is not zero, it is positive, one.') },
        ],
        solution: ['D = 25 − 24 = 1', L('ikkita ildiz', 'два корня', 'two roots')],
      },
      {
        expr: <Row size="big" align="center">{'x² − 4x + 4 = 0'}</Row>,
        ok: L("Ha. D nol, bitta ildiz.", 'Да. D равно нулю, один корень.', 'Yes. D equals zero, one root.'),
        question: ASK_COUNT,
        items: [
          { id: 'a', right: true, label: L('Bitta', 'Один', 'One') },
          { id: 'b', label: L("Nolta", 'Нуль', 'Zero'), hint: L("D nolga teng bo'lishi ildizsizlik emas.", 'D равное нулю не означает отсутствие корня.', 'D equal to zero does not mean no root.') },
        ],
        solution: ['D = 16 − 16 = 0', L('bitta ildiz', 'один корень', 'one root')],
      },
      {
        expr: <Row size="big" align="center">{'x² + x + 1 = 0'}</Row>,
        ok: L("Ha. D minus uch, manfiy, nolta ildiz.", 'Да. D минус три, отрицательно, нуль корней.', 'Yes. D is negative three, negative, zero roots.'),
        question: ASK_COUNT,
        items: [
          { id: 'a', right: true, label: L('Nolta', 'Нуль', 'Zero') },
          { id: 'b', label: L('Bitta', 'Один', 'One'), hint: L("D manfiy, bu holda umuman haqiqiy ildiz yo'q.", 'D отрицательно, в этом случае действительных корней нет вовсе.', 'D is negative, and in that case there are no real roots at all.') },
        ],
        solution: ['D = 1 − 4 = −3', L('nolta ildiz', 'нуль корней', 'zero roots')],
      },
      {
        expr: <Row size="big" align="center">{'2x² − 4x + 2 = 0'}</Row>,
        ok: L("Ha. D nol, bitta ildiz.", 'Да. D равно нулю, один корень.', 'Yes. D equals zero, one root.'),
        question: ASK_COUNT,
        items: [
          { id: 'a', right: true, label: L('Bitta', 'Один', 'One') },
          { id: 'b', label: L('Ikkita', 'Два', 'Two'), hint: L("O'n olti minus o'n olti nolga teng, ikkita emas.", 'Шестнадцать минус шестнадцать равно нулю, а не двум.', 'Sixteen minus sixteen equals zero, not two.') },
        ],
        solution: ['D = 16 − 16 = 0', L('bitta ildiz', 'один корень', 'one root')],
      },
      {
        expr: <Row size="big" align="center">{'3x² + 2x − 1 = 0'}</Row>,
        ok: L("Ha. D o'n olti, musbat, ikkita ildiz.", 'Да. D шестнадцать, положительно, два корня.', 'Yes. D is sixteen, positive, two roots.'),
        question: ASK_COUNT,
        items: [
          { id: 'a', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'b', label: L("Nolta", 'Нуль', 'Zero'), hint: L("To'rt plyus o'n ikki o'n oltiga teng, bu musbat.", 'Четыре плюс двенадцать равно шестнадцати, это положительно.', 'Four plus twelve equals sixteen, which is positive.') },
        ],
        solution: ['D = 4 + 12 = 16', L('ikkita ildiz', 'два корня', 'two roots')],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): D ni hisoblab, ildizlar sonini
// ayting.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "D ni hisoblang, ildizlar sonini ayting",
    'Вычисли D, назови число корней',
    'Compute D, name the number of roots',
  ),
  audio: [
    A('mount',
      "Uch tenglama. Avval D ni hisoblang, keyin sonini ayting.",
      'Три уравнения. Сначала посчитай D, потом назови число.',
      'Three equations. First compute D, then name the count.'),
    A('why',
      "Formulani eslang, D b kvadrat minus to'rt ac.",
      'Вспомни формулу, D равно b в квадрате минус четыре ac.',
      'Recall the formula, D equals b squared minus four a c.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar D hisoblanib, soni to'g'ri aytildi.",
      'Все три разобраны. Каждый раз D считался и число называлось верно.',
      'All three are done. Each time D was computed and the count named correctly.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² − 2x − 3 = 0'}</Row>,
        ok: L("Ha. To'rt plyus o'n ikki o'n olti, musbat, ikkita ildiz.", 'Да. Четыре плюс двенадцать шестнадцать, положительно, два корня.', 'Yes. Four plus twelve is sixteen, positive, two roots.'),
        question: ASK_COUNT,
        items: [
          { id: 'a', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'b', label: L('Bitta', 'Один', 'One'), hint: L("D o'n olti, nolga teng emas.", 'D равно шестнадцати, а не нулю.', 'D is sixteen, not zero.') },
        ],
        solution: ['D = 4 + 12 = 16', L('ikkita ildiz', 'два корня', 'two roots')],
      },
      {
        expr: <Row size="big" align="center">{'x² + 6x + 9 = 0'}</Row>,
        ok: L("Ha. O'ttiz olti minus o'ttiz olti nol, bitta ildiz.", 'Да. Тридцать шесть минус тридцать шесть нуль, один корень.', 'Yes. Thirty six minus thirty six is zero, one root.'),
        question: ASK_COUNT,
        items: [
          { id: 'a', right: true, label: L('Bitta', 'Один', 'One') },
          { id: 'b', label: L("Nolta", 'Нуль', 'Zero'), hint: L("D nol, bu ildiz yo'qligini bildirmaydi.", 'D равно нулю, это не означает отсутствие корня.', 'D is zero, which does not mean no root.') },
        ],
        solution: ['D = 36 − 36 = 0', L('bitta ildiz', 'один корень', 'one root')],
      },
      {
        expr: <Row size="big" align="center">{'x² + 4 = 0'}</Row>,
        ok: L("Ha. Nol minus o'n olti minus o'n olti, manfiy, nolta ildiz.", 'Да. Нуль минус шестнадцать минус шестнадцать, отрицательно, нуль корней.', 'Yes. Zero minus sixteen is negative sixteen, negative, zero roots.'),
        question: ASK_COUNT,
        items: [
          { id: 'a', right: true, label: L('Nolta', 'Нуль', 'Zero') },
          { id: 'b', label: L('Ikkita', 'Два', 'Two'), hint: L("B nolga teng, D esa minus o'n olti, manfiy.", 'B равно нулю, а D равно минус шестнадцати, это отрицательно.', 'b is zero, and D is negative sixteen, which is negative.') },
        ],
        solution: ['D = 0 − 16 = −16', L('nolta ildiz', 'нуль корней', 'zero roots')],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): ildizni podstavka
// bilan tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ildizni tekshirish",
    'Проверка корня',
    'Checking the root',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Taklif qilingan sonni qo'yib tekshiring.",
      'Три задания. Подставь предложенное число и проверь.',
      'Three tasks. Substitute the proposed number and check.'),
    A('why',
      "D manfiy bo'lgan tenglamada hech qanday son ildiz bo'lolmaydi.",
      'В уравнении с отрицательным D никакое число не может быть корнем.',
      'In an equation with negative D, no number can be a root.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. D manfiy bo'lgan tenglamada hech bir son ildiz bo'lmadi.",
      'Все три разобраны. В уравнении с отрицательным D ни одно число не оказалось корнем.',
      'All three are done. In the equation with negative D, no number turned out to be a root.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² − 4x + 4 = 0,   x = 2'}</Row>,
        ok: L("Ha. To'rt minus sakkiz plyus to'rt nolga teng.", 'Да. Четыре минус восемь плюс четыре равно нулю.', 'Yes. Four minus eight plus four equals zero.'),
        question: L('x = 2 shu tenglamaning ildizimi?', 'Является ли x = 2 корнем этого уравнения?', 'Is x = 2 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikkini qo'yib hisoblang, to'rt minus sakkiz plyus to'rt.", 'Подставь два и посчитай, четыре минус восемь плюс четыре.', 'Substitute two and compute, four minus eight plus four.') },
        ],
        solution: ['4 − 8 + 4', '= 0'],
      },
      {
        expr: <Row size="big" align="center">{'x² + 5x + 6 = 0,   x = −2'}</Row>,
        ok: L("Ha. To'rt minus o'n plyus olti nolga teng.", 'Да. Четыре минус десять плюс шесть равно нулю.', 'Yes. Four minus ten plus six equals zero.'),
        question: L('x = −2 shu tenglamaning ildizimi?', 'Является ли x = −2 корнем этого уравнения?', 'Is x = −2 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Minus ikkini qo'yib hisoblang, to'rt minus o'n plyus olti.", 'Подставь минус два и посчитай, четыре минус десять плюс шесть.', 'Substitute negative two and compute, four minus ten plus six.') },
        ],
        solution: ['4 − 10 + 6', '= 0'],
      },
      {
        expr: <Row size="big" align="center">{'x² + x + 1 = 0,   x = 0'}</Row>,
        ok: L("Yo'q. Nol plyus nol plyus bir birga teng, nolga emas.", 'Нет. Нуль плюс нуль плюс один равно единице, а не нулю.', 'No. Zero plus zero plus one equals one, not zero.'),
        question: L('x = 0 shu tenglamaning ildizimi?', 'Является ли x = 0 корнем этого уравнения?', 'Is x = 0 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Nolni qo'yib hisoblang, nol plyus nol plyus bir.", 'Подставь нуль и посчитай, нуль плюс нуль плюс один.', 'Substitute zero and compute, zero plus zero plus one.') },
        ],
        solution: ['0 + 0 + 1', '= 1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): D nolga teng bo'lganda
// "ildiz yo'q" deb aytilgan — З9 ning eng aniq ko'rinishi.
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "D nol — ildiz yo'q emas",
    'D нуль — не значит нет корня',
    'D zero does not mean no root',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham D nolga teng bo'lgani uchun ildiz yo'q deb aytilgan.",
      'Два задания. В обоих сказано, что корней нет, потому что D равно нулю.',
      'Two tasks. In both, it was claimed there are no roots because D equals zero.'),
    A('why',
      "D nol bo'lsa ildiz bitta bo'ladi, yo'q emas.",
      'Если D равно нулю, корень один, а не отсутствует.',
      'If D equals zero, there is one root, not none.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. D nolga teng bo'lganda tenglama bitta ildizga ega bo'lib qoldi.",
      'Оба разобраны. При D равном нулю у уравнения оставался один корень.',
      'Both are done. With D equal to zero, the equation kept one root.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² − 6x + 9 = 0   →   D = 0,   "ildiz yo\'q"'}</Row>,
        ok: L("Yo'q. D nol, demak bitta ildiz bor, x uchga teng.", 'Нет. D равно нулю, значит есть один корень, x равен трём.', 'No. D is zero, so there is one root, x equals three.'),
        question: L("To'g'ri xulosa qaysi?", 'Какой вывод верен?', 'Which conclusion is correct?'),
        items: [
          { id: 'a', right: true, label: L('Bitta ildiz bor: x = 3', 'Есть один корень: x = 3', 'There is one root: x = 3') },
          { id: 'b', label: L("Ildiz yo'q", 'Корней нет', 'There are no roots'), hint: L("Bu ko'rsatilgan xato xulosaning o'zi, D nol ildizsizlik emas.", 'Это и есть показанный ошибочный вывод, D нуль не означает отсутствие корня.', 'This is the very mistaken conclusion shown, D zero does not mean no root.') },
          { id: 'c', label: L('Ikkita ildiz bor', 'Есть два корня', 'There are two roots'), hint: L("Ikkita bo'lishi uchun D musbat bo'lishi kerak edi, D esa nol.", 'Для двух корней D должно быть положительным, а D равно нулю.', 'For two roots D should be positive, but D is zero.') },
        ],
        solution: ['D = 36 − 36 = 0', 'x = 3'],
      },
      {
        expr: <Row size="big" align="center">{'x² − 8x + 16 = 0   →   D = 0,   "ildiz yo\'q"'}</Row>,
        ok: L("Yo'q. D nol, demak bitta ildiz bor, x to'rtga teng.", 'Нет. D равно нулю, значит есть один корень, x равен четырём.', 'No. D is zero, so there is one root, x equals four.'),
        question: L("To'g'ri xulosa qaysi?", 'Какой вывод верен?', 'Which conclusion is correct?'),
        items: [
          { id: 'a', right: true, label: L('Bitta ildiz bor: x = 4', 'Есть один корень: x = 4', 'There is one root: x = 4') },
          { id: 'b', label: L("Ildiz yo'q", 'Корней нет', 'There are no roots'), hint: L("Bu ko'rsatilgan xato xulosaning o'zi, D nol ildizsizlik emas.", 'Это и есть показанный ошибочный вывод, D нуль не означает отсутствие корня.', 'This is the very mistaken conclusion shown, D zero does not mean no root.') },
          { id: 'c', label: L('Ikkita ildiz bor', 'Есть два корня', 'There are two roots'), hint: L("D nol, ikkita ildiz uchun musbat bo'lishi kerak edi.", 'D равно нулю, а для двух корней нужно положительное.', 'D is zero, while two roots require a positive D.') },
        ],
        solution: ['D = 64 − 64 = 0', 'x = 4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill`): perimetr va
// yuza masalasida D manfiy bo'lsa, bunday to'rtburchak yo'q.
// ============================================================
const S13 = {
  eyebrow: L('BUNDAY TO\'RTBURCHAK BORMI', 'СУЩЕСТВУЕТ ЛИ ТАКОЙ ПРЯМОУГОЛЬНИК', 'DOES SUCH A RECTANGLE EXIST'),
  title: L(
    "D orqali to'rtburchak borligini bilib oling",
    'Узнай через D, существует ли прямоугольник',
    'Use D to tell whether the rectangle exists',
  ),
  audio: [
    A('mount',
      "Perimetr va yuza berilgan. Tenglama tuzib, D ni hisoblaymiz.",
      'Даны периметр и площадь. Составляем уравнение и считаем D.',
      'The perimeter and area are given. We set up an equation and compute D.'),
    A('why',
      "D manfiy chiqsa, bunday tomonlar bilan to'rtburchak yo'q.",
      'Если D выходит отрицательным, прямоугольника с такими сторонами не существует.',
      'If D comes out negative, no rectangle with such sides exists.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Bir holda D manfiy chiqib, to'rtburchak yo'qligi aniqlandi.",
      'Все три заполнены. В одном случае D вышел отрицательным, и прямоугольника не оказалось.',
      'All three are filled. In one case D came out negative, and no rectangle existed.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['24', '4', '6', '4'],
      lines: [
        [{ t: 'P = 20, S = 24   →   x² − 10x + ' }, { slot: '24' }, { t: ' = 0' }],
        [{ t: 'D = ' }, { slot: '4' }, { t: ',   x = ' }, { slot: '6' }, { t: L('  yoki  ', '  или  ', '  or  ') }, { slot: '4' }],
      ],
    },
    tasks: [
      {
        chips: ['15', '4', '5', '3'],
        lines: [
          [{ t: 'P = 16, S = 15   →   x² − 8x + ' }, { slot: '15' }, { t: ' = 0' }],
          [{ t: 'D = ' }, { slot: '4' }, { t: ',   x = ' }, { slot: '5' }, { t: L('  yoki  ', '  или  ', '  or  ') }, { slot: '3' }],
        ],
      },
      {
        chips: ['10', '−15'],
        lines: [
          [{ t: 'P = 10, S = 10   →   x² − 5x + ' }, { slot: '10' }, { t: ' = 0' }],
          [{ t: 'D = ' }, { slot: '−15' }, { t: L(',   bunday to\'rtburchak yo\'q', ',   такого прямоугольника нет', ',   there is no such rectangle') }],
        ],
      },
      {
        chips: ['24', '25', '8', '3'],
        lines: [
          [{ t: 'P = 22, S = 24   →   x² − 11x + ' }, { slot: '24' }, { t: ' = 0' }],
          [{ t: 'D = ' }, { slot: '25' }, { t: ',   x = ' }, { slot: '8' }, { t: L('  yoki  ', '  или  ', '  or  ') }, { slot: '3' }],
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
    "D bo'yicha to'rt savol",
    'Четыре вопроса о D',
    'Four questions about D',
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
        id: 'q1', tag: 'З9',
        ask: L("x² − 6x + 9 = 0 tenglamada D nolga teng. Nechta ildiz bor?", 'В уравнении x² − 6x + 9 = 0 D равно нулю. Сколько корней?', 'In x² − 6x + 9 = 0, D equals zero. How many roots?'),
        options: [
          { id: 'one', right: true, label: L('Bitta', 'Один', 'One') },
          { id: 'zero', label: L('Nolta', 'Нуль', 'Zero') },
          { id: 'two', label: L('Ikkita', 'Два', 'Two') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("D nol bo'lishi ildizsizlik emas.", 'D равное нулю не означает отсутствие корня.', 'D equal to zero does not mean no root.'),
        ok: L("To'g'ri, bitta ildiz bor.", 'Верно, есть один корень.', 'Correct, there is one root.'),
      },
      {
        id: 'q2', tag: 'З41',
        ask: L('x² + 3x + 5 = 0 tenglamaning ildizlari bormi?', 'Есть ли корни у уравнения x² + 3x + 5 = 0?', 'Does x² + 3x + 5 = 0 have roots?'),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'two', label: L('Ha, ikkita', 'Да, два', 'Yes, two') },
          { id: 'one', label: L('Ha, bitta', 'Да, один', 'Yes, one') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("D to'qqiz minus yigirma, bu manfiy.", 'D равно девять минус двадцать, это отрицательно.', 'D equals nine minus twenty, which is negative.'),
        ok: L("To'g'ri, D manfiy, ildiz yo'q.", 'Верно, D отрицательно, корней нет.', 'Correct, D is negative, there are no roots.'),
      },
      {
        id: 'q3', tag: 'З9',
        ask: L("D musbat bo'lganda nechta ildiz bor?", 'Сколько корней, когда D положительно?', 'How many roots when D is positive?'),
        options: [
          { id: 'two', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'one', label: L('Bitta', 'Один', 'One') },
          { id: 'zero', label: L('Nolta', 'Нуль', 'Zero') },
          { id: 'inf', label: L('Cheksiz', 'Бесконечно', 'Infinitely many') },
        ],
        hint: L("Plyus va minus turli ikki son beradi.", 'Плюс и минус дают два разных числа.', 'Plus and minus give two different numbers.'),
        ok: L("To'g'ri, ikkita turli ildiz.", 'Верно, два разных корня.', 'Correct, two different roots.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L("x = 3 son x² − 6x + 9 = 0 tenglamaning ildizimi?", 'Является ли x = 3 корнем уравнения x² − 6x + 9 = 0?', 'Is x = 3 a root of x² − 6x + 9 = 0?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
          { id: 'onlyD', label: L('Faqat D nolga teng bo\'lsa', 'Только если D равно нулю', 'Only if D equals zero') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Uchni qo'yib hisoblang, to'qqiz minus o'n sakkiz plyus to'qqiz.", 'Подставь три и посчитай, девять минус восемнадцать плюс девять.', 'Substitute three and compute, nine minus eighteen plus nine.'),
        ok: L("To'g'ri, natija nolga teng.", 'Верно, результат равен нулю.', 'Correct, the result equals zero.'),
      },
      {
        id: 'q5', tag: 'З9',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "X kvadrat plyus 2x plyus 1 teng nolni yechib, D va ildizni yig'ing.",
            'Реши икс квадрат плюс два икс плюс один равно нулю и собери D и корень.',
            'Solve x squared plus two x plus one equals zero and assemble D and the root.',
          ),
          lines: [
            [{ t: 'x² + 2x + 1 = 0   →   D = ' }, { slot: '0' }, { t: ',   x = ' }, { slot: '−1' }],
          ],
          tiles: [
            { id: 't1', v: '0', x: 12, y: 12 },
            { id: 't2', v: '−1', x: 70, y: 14 },
            { id: 't3', v: '4', x: 40, y: 50 },
            { id: 't4', v: '1', x: 78, y: 48 },
            { id: 't5', v: '2', x: 14, y: 52 },
          ],
          hint: L(
            "To'rt minus to'rt nolga teng, va yagona ildiz minus b ikkiga bo'lingan.",
            'Четыре минус четыре равно нулю, а единственный корень равен минус b, делённому на два.',
            'Four minus four equals zero, and the single root equals negative b divided by two.',
          ),
          doneNote: L(
            "Yig'ildi. D nol, ildiz minus bir.",
            'Собрано. D нуль, корень минус один.',
            'Assembled. D is zero, the root is negative one.',
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
    "D nolga teng bo'lishi ildizsizlik emas",
    'D равное нулю — не отсутствие корня',
    'D equal to zero is not the absence of a root',
  ),
  audio: [
    A('s0',
      "Darsdan bitta rasm qoladi. Parabola o'qqa bir nuqtada tegadi, va bu nuqta ildiz.",
      'С урока остаётся одна картинка. Парабола касается оси в одной точке, и эта точка является корнем.',
      'One picture stays with you. The parabola touches the axis at one point, and that point is a root.'),
    A('s1',
      "Bugun uch narsa qilindi. D ishorasiga qarab ildizlar sonini aniqladingiz, formulada D nolga teng bo'lganda nima bo'lishini ko'rdingiz va D manfiy bo'lganda bunday shakl yo'qligini bildingiz.",
      'Сегодня сделано три вещи. Ты определял число корней по знаку D, увидел, что происходит в формуле при D равном нулю, и узнал, что при отрицательном D такой фигуры нет.',
      'Three things are done today. You told the number of roots by the sign of D, saw what happens in the formula when D equals zero, and learned that with negative D no such figure exists.'),
    A('s2',
      "Keyingi darsda tenglamalarning ildizlari orasidagi bog'lanish o'rganiladi, bu Viyet teoremasi.",
      'В следующем уроке изучается связь между корнями уравнения, это теорема Виета.',
      'The next lesson covers the link between the roots of an equation, Vieta\'s theorem.',
    ),
  ],
  props: {
    mark: 'D = b² − 4ac',
    markNote: L(
      "musbat — ikki ildiz, nol — bitta, manfiy — nolta",
      'положительно — два корня, нуль — один, отрицательно — нуль',
      'positive means two roots, zero means one, negative means zero',
    ),
    lines: [
      L(
        "D > 0: ikkita turli ildiz",
        'D > 0: два различных корня',
        'D > 0: two different roots',
      ),
      L(
        "D = 0: bitta ildiz, yo'q emas",
        'D = 0: один корень, а не отсутствие',
        'D = 0: one root, not an absence',
      ),
      L(
        "D < 0: haqiqiy ildiz yo'q",
        'D < 0: действительных корней нет',
        'D < 0: no real roots',
      ),
    ],
    bridge: L(
      "Keyingi dars: Viyet teoremasi",
      'Следующий урок: теорема Виета',
      "Next lesson: Vieta's theorem",
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — SLAYDER.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З41', 'З41', 'З9',
    'З9', 'З9', 'З9', 'З9', 'З41',
    'З16', 'З9', 'З41', null, null,
  ],
  mechanic: { at: 5, tool: 'paramplot', kind: 'discriminant' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
