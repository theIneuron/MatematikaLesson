// ============================================================================
// 8-sinf, Dars 48. AYLANA. MARKAZIY BURCHAK.
//
// BLOK Б7, AYLANA QISMI BOSHLANADI (Pifagor qismi 44-47 darslarda yakunlandi).
// Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`, `circlefigure.jsx`,
// `prooflines.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da.
//
// YANGI PRIBOR: `CircleFigure` — AYLANA QISMINING PILOT DARSI. `GeoFigure`
// ko'pburchak uchun edi, tomonlari bor; aylanada TOMON yo'q, YOY bor.
// Ikki nuqta orasida IKKITA yoy (kichik va katta) bo'ladi, ikkalasi ham
// bosiladigan holda chiziladi — o'quvchi TO'G'RI yoyni tanlashi kerak.
//
// MANBA: 8-sinf geometriya darsligi, 4-§ (AYLANA), 33-mavzu (107-108-bet):
//   - 1. Aylana haqida boshlang'ich ma'lumotlar: aylana ta'rifi, markaz O,
//     radius, vatar (ixtiyoriy ikki nuqtani tutashtiruvchi kesma), diametr
//     (markazdan o'tuvchi vatar);
//   - 2. Markaziy burchak: uchi aylananing markazida bo'lgan burchak;
//   - 3. Aylana yoyining burchak kattaligi: yoy yarim aylanadan kichik yoki
//     teng bo'lsa, mos markaziy burchakka teng; katta bo'lsa, 360° dan
//     markaziy burchakni ayirish bilan topiladi. Ikki yoyning gradus
//     o'lchovlari yig'indisi 360°;
//   - Masala (108-bet): ∠AOB=115°, yoy BC = yoy AB. AOC burchakni toping.
//     Yechim: yoy AB=115° (kichik, ∠AOB ga teng), yoy BC=115° (shart bo'yicha
//     teng), yoy ABC=230°>180° (katta), demak ∠AOC=360°−230°=130°.
//
// ADASHISHLAR, ikkitasi yangi:
//   З102, ixtiyoriy vatar diametr deb hisoblangan, markazdan o'tishi shart
//   ekani unutilgan (yoki radius bilan vatar chalkashtirilgan);
//   З103, katta yoyning gradus o'lchovi markaziy burchakka teng deb olingan,
//   360° dan ayirilmagan;
//   З16, javob son bilan tekshirilmadi (11-ekranda, har doim shart).
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { SceneBand } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'
import { UI } from './karkas.js'

export const META = {
  id: 'geo-8-48',
  n: 48,
  row: 53,
  block: 'Б7',
  topic: L('Aylana, markaziy burchak', 'Окружность, центральный угол', 'The circle, the central angle'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Aylana markazidan o'tuvchi vatar diametr deyiladi, markazdan o'tmagan ixtiyoriy kesma esa oddiy vatar",
    'Хорда, проходящая через центр окружности, называется диаметром, а не проходящая через центр называется просто хордой',
    'A chord passing through the centre of the circle is called a diameter, one that does not pass through the centre is just a chord',
  ),
  L(
    "Yoyning gradus o'lchovi, u yarim aylanadan kichik yoki teng bo'lsa, mos markaziy burchakka teng; katta bo'lsa, 360° dan markaziy burchak ayrilib topiladi",
    'Градусная мера дуги, если она меньше или равна полуокружности, равна соответствующему центральному углу; если больше, находится вычитанием центрального угла из 360°',
    "An arc's degree measure, if it is less than or equal to a semicircle, equals the matching central angle; if greater, it is found by subtracting the central angle from 360°",
  ),
  L(
    "Bir xil ikki nuqta bilan chegaralangan ikki yoyning gradus o'lchovlari yig'indisi 360° ga teng",
    'Сумма градусных мер двух дуг, ограниченных одними и теми же двумя точками, равна 360°',
    'The sum of the degree measures of the two arcs bounded by the same two points equals 360°',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З102': {
    what: L(
      "ixtiyoriy vatar diametr deb hisoblangan, markazdan o'tishi shart ekani unutilgan",
      'произвольная хорда принята за диаметр, забыто, что диаметр обязан проходить через центр',
      'an arbitrary chord was taken for a diameter, forgetting that a diameter must pass through the centre',
    ),
    wrong: null,
    at: 12,
  },
  'З103': {
    what: L(
      "katta yoyning gradus o'lchovi markaziy burchakka teng deb olingan, 360° dan ayirilmagan",
      'градусная мера большой дуги принята равной центральному углу, вычитание из 360° не сделано',
      "the major arc's degree measure was taken equal to the central angle, the subtraction from 360° was not done",
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: yoyning gradus o'lchovi doim markaziy burchakka
// tengmi. Yakun: kichik va katta yoy, ikki xil qoida.
// ============================================================
const SC_ASK = L('YOY VA MARKAZIY BURCHAK', 'ДУГА И ЦЕНТРАЛЬНЫЙ УГОЛ', 'THE ARC AND THE CENTRAL ANGLE')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <circle cx="175" cy="62" r="30" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <line x1="175" y1="62" x2="175" y2="32" stroke={T.ink3} strokeWidth="1.4"/>
      <line x1="175" y1="62" x2="203" y2="80" stroke={T.ink3} strokeWidth="1.4"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="189" cy="52" r="11" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.2"/>
        <text x="189" y="56" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Kichik yoyga to'g'ridan-to'g'ri, katta yoyga 360° dan ayirib",
      'К малой дуге напрямую, к большой — вычитанием из 360°',
      'Directly for the minor arc, by subtracting from 360° for the major arc',
    )}>
      <circle cx="185" cy="62" r="28" fill="none" stroke={T.ok} strokeWidth="1.6"/>
      <text x="185" y="20" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11" fontWeight="700" fill={T.ok}>360°</text>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  role: 'hook',
  tool: 'pick',
  scene: <HookScene/>,
  eyebrow: L('YOY VA MARKAZIY BURCHAK', 'ДУГА И ЦЕНТРАЛЬНЫЙ УГОЛ', 'THE ARC AND THE CENTRAL ANGLE'),
  title: L(
    "Markaziy burchak yetmish daraja bo'lsa, unga mos yoyning gradus o'lchovi doim yetmish darajami",
    'Если центральный угол семьдесят градусов, всегда ли соответствующая дуга семьдесят градусов',
    'If the central angle is seventy degrees, is the matching arc always seventy degrees',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Aylanada ikki nuqta ikkita yoyga ajratadi, kichik va katta.",
      'На окружности две точки делят её на две дуги, малую и большую.',
      'On a circle, two points split it into two arcs, minor and major.'),
    A('why',
      "Taxmin qiling, ikkalasi ham bir xil qoida bilan topiladimi.",
      'Предположи, находятся ли обе одним и тем же правилом.',
      'Predict whether both are found by the same rule.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, ikkala yoy ham markaziy burchakka teng bo'ladimi?",
      'Как думаешь, обе дуги равны центральному углу?',
      'What do you think, are both arcs equal to the central angle?',
    ),
    items: [
      { id: 'a', show: L('Ha, ikkalasi ham', 'Да, обе', 'Yes, both') },
      { id: 'b', show: L("Faqat kichik yoy", 'Только малая дуга', 'Only the minor arc') },
      { id: 'c', show: L('Faqat katta yoy', 'Только большая дуга', 'Only the major arc') },
      { id: 'd', show: L("Hech qaysi biri", 'Ни одна из них', 'Neither of them') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Burchakni eslash.
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Burchakni eslash",
    'Вспоминаем угол',
    'Recalling the angle',
  ),
  audio: [
    A('mount',
      "Burchak ikki nurdan va ularning umumiy uchidan tuziladi.",
      'Угол состоит из двух лучей и их общей вершины.',
      'An angle is made of two rays and their shared vertex.'),
    A('why',
      "Bugun bu uchi qayerda turishi juda muhim bo'ladi.",
      'Сегодня очень важно, где именно стоит эта вершина.',
      'Today it matters a great deal exactly where that vertex stands.'),
  ],
  props: {
    ask: L(
      "Burchakning uchi deb nima ataladi?",
      'Как называется вершина угла?',
      'What is the vertex of an angle called?',
    ),
    items: [
      { id: 'right', show: L("Ikki nurning umumiy boshlanish nuqtasi", 'Общая начальная точка двух лучей', 'The shared starting point of the two rays'), right: true, name: L("burchak shu nuqtadan chiqadi", 'угол выходит из этой точки', 'the angle originates from this point') },
      {
        id: 'wrong', show: L("Nurlarning istalgan nuqtasi", 'Любая точка на лучах', 'Any point on the rays'),
        hint: L("Uch faqat bitta nuqta, ikki nur boshlanadigan joy.", 'Вершина только одна точка, там, где начинаются оба луча.', 'The vertex is only one point, where both rays begin.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun uchi aylananing markazida bo'lgan burchakni ko'ramiz.",
      'Верно. Сегодня рассмотрим угол, вершина которого в центре окружности.',
      "Correct. Today we'll look at an angle whose vertex is at the centre of a circle.",
    ),
  },
}

// ============================================================
// EKRAN 3. VATAR VA DIAMETR (`pick`). Ловушка, radius/vatar/diametr
// chalkashtirilishi (З102).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З102',
  eyebrow: L('VATAR VA DIAMETR', 'ХОРДА И ДИАМЕТР', 'THE CHORD AND THE DIAMETER'),
  title: L(
    "Aylananing ikki nuqtasini tutashtiruvchi ixtiyoriy kesma nima deyiladi",
    'Как называется произвольный отрезок, соединяющий две точки окружности',
    'What is an arbitrary segment connecting two points of a circle called',
  ),
  audio: [
    A('mount',
      "Aylanada ikkita nuqta olinsa, ularni kesma bilan tutashtirish mumkin.",
      'Если на окружности взять две точки, их можно соединить отрезком.',
      'If two points are taken on a circle, they can be connected by a segment.'),
    A('why',
      "Bu kesma markazdan o'tishi shart emas, radius esa markazdan chiqadi.",
      'Этому отрезку не обязательно проходить через центр, а радиус обязательно выходит из центра.',
      'This segment does not have to pass through the centre, while a radius always starts from the centre.'),
  ],
  props: {
    ask: L(
      "Aylananing ixtiyoriy ikki nuqtasini tutashtiruvchi kesma nima deyiladi?",
      'Как называется отрезок, соединяющий любые две точки окружности?',
      'What is a segment connecting any two points of a circle called?',
    ),
    items: [
      { id: 'right', show: L('Vatar', 'Хорда', 'Chord'), right: true, name: L("markazdan o'tishi shart emas", 'необязательно проходит через центр', 'it does not have to pass through the centre') },
      {
        id: 'wrong1', show: L('Radius', 'Радиус', 'Radius'),
        hint: L("Radius markazni aylana nuqtasi bilan tutashtiradi, ikki aylana nuqtasini emas.", 'Радиус соединяет центр с точкой окружности, а не две точки окружности.', 'A radius connects the centre to a point on the circle, not two points on the circle.'),
      },
      {
        id: 'wrong2', show: L('Diametr', 'Диаметр', 'Diameter'),
        hint: L("Diametr faqat markazdan o'tuvchi maxsus vatar, har qanday vatar emas.", 'Диаметр это особая хорда, проходящая через центр, а не любая хорда.', 'A diameter is a special chord passing through the centre, not just any chord.'),
      },
    ],
    after: L(
      "To'g'ri, vatar. Agar u aynan markazdan o'tsa, u diametr deb ataladi.",
      'Верно, хорда. Если она проходит именно через центр, она называется диаметром.',
      'Correct, a chord. If it passes exactly through the centre, it is called a diameter.',
    ),
  },
}

// ============================================================
// EKRAN 4. KATTA YOYNI TOPING (`circlefigure`). PILOT DARS. Ловушka,
// kichik yoy bosilishi (З103).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'circlefigure',
  tag: 'З103',
  eyebrow: L('KATTA YOYNI TOPING', 'НАЙДИ БОЛЬШУЮ ДУГУ', 'FIND THE MAJOR ARC'),
  title: L(
    "Markaziy burchak yetmish daraja. Katta yoyni bosing",
    'Центральный угол семьдесят градусов. Нажми на большую дугу',
    'The central angle is seventy degrees. Tap the major arc',
  ),
  audio: [
    A('mount',
      "A va B nuqtalar aylanani ikki yoyga ajratadi, kichik va katta.",
      'Точки A и B делят окружность на две дуги, малую и большую.',
      'Points A and B split the circle into two arcs, minor and major.'),
    A('why',
      "Katta yoy kichik yoydan farqli, u yarim aylanadan katta bo'ladi.",
      'Большая дуга, в отличие от малой, больше полуокружности.',
      'The major arc, unlike the minor one, is bigger than a semicircle.'),
  ],
  props: {
    points: { A: 210, B: 280 },
    radii: ['A', 'B'],
    pair: ['A', 'B'],
    target: 'major',
    ask: L("Katta yoy AB ni bosing", 'Нажми на большую дугу AB', 'Tap the major arc AB'),
    hints: {
      minor: L("Bu kichik yoy, u yetmish daraja, sizga esa katta yoy kerak.", 'Это малая дуга, она семьдесят градусов, а нужна большая.', 'That is the minor arc, it is seventy degrees, you need the major one.'),
    },
    after: L(
      "To'g'ri. Katta yoy uch yuz to'qson daraja, kichik yoy yetmish daraja.",
      'Верно. Большая дуга триста девяносто... нет, двести девяносто градусов, малая семьдесят.',
      'Correct. The major arc is two hundred ninety degrees, the minor one is seventy.',
    ),
  },
}

// ============================================================
// EKRAN 5. MASALANI ISBOTLAYMIZ (`prooflines`). Darslik masalasi, 108-bet.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З103',
  eyebrow: L('MASALANI YECHAMIZ', 'РЕШАЕМ ЗАДАЧУ', 'SOLVING THE PROBLEM'),
  title: L(
    "∠AOB = 115°, yoy BC = yoy AB. ∠AOC ni topamiz",
    '∠AOB = 115°, дуга BC = дуге AB. Находим ∠AOC',
    '∠AOB = 115°, arc BC = arc AB. We find ∠AOC',
  ),
  audio: [
    A('mount',
      "O nuqta aylananing markazi, A, B, C esa aylanada, shu tartibda.",
      'Точка O центр окружности, A, B, C на окружности, именно в таком порядке.',
      'Point O is the centre of the circle, A, B, C are on the circle, in that order.'),
    A('why',
      "Avval yoy AB, keyin yoy BC, so'ngra ular yig'ilgan yoy ABC tekshiriladi.",
      'Сначала дуга AB, потом дуга BC, затем проверяется их сумма, дуга ABC.',
      'First arc AB, then arc BC, then their sum, arc ABC, is checked.'),
  ],
  props: {
    points: { A: [20, 85], B: [95, 55], C: [55, 15], O: [55, 55] },
    order: ['A', 'B', 'C'],
    marks: [['O', 'A'], ['O', 'B'], ['O', 'C']],
    given: [
      L("O, markaz; ∠AOB = 115°", 'O, центр; ∠AOB = 115°', 'O, the centre; ∠AOB = 115°'),
      L("yoy BC = yoy AB", 'дуга BC = дуге AB', 'arc BC = arc AB'),
    ],
    goal: L("∠AOC ni topish", 'найти ∠AOC', 'find ∠AOC'),
    lines: [
      {
        text: L("yoy AB yarim aylanadan kichik, shuning uchun yoy AB = 115°", 'дуга AB меньше полуокружности, поэтому дуга AB = 115°', 'arc AB is smaller than a semicircle, so arc AB = 115°'),
        options: [
          { id: 'ok', right: true, label: L("115° yarim aylana 180° dan kichik, shuning uchun yoy to'g'ridan-to'g'ri burchakka teng", '115° меньше полуокружности 180°, поэтому дуга равна углу напрямую', '115° is less than the semicircle 180°, so the arc equals the angle directly') },
          { id: 'no', label: L("Yoy doim 360° dan burchak ayirilib topiladi", 'Дуга всегда находится вычитанием угла из 360°', 'The arc is always found by subtracting the angle from 360°'), hint: L("Faqat katta yoy uchun shunday, bu yoy kichik, u burchakka to'g'ridan-to'g'ri teng.", 'Так только для большой дуги, эта дуга малая, она равна углу напрямую.', 'That is only for the major arc, this arc is minor, it equals the angle directly.') },
        ],
      },
      {
        text: L("shart bo'yicha yoy BC = yoy AB = 115°", 'по условию дуга BC = дуге AB = 115°', 'by the condition arc BC = arc AB = 115°'),
        options: [
          { id: 'ok', right: true, label: L("Bu berilgan shartning o'zi", 'Это само условие задачи', 'This is the condition of the problem itself') },
          { id: 'no', label: L("Bu markaziy burchakdan kelib chiqadi", 'Это следует из центрального угла', 'This follows from the central angle'), hint: L("Yo'q, bu alohida berilgan shart, hisoblab topilmagan.", 'Нет, это отдельно данное условие, а не вычисленное.', 'No, this is a separately given condition, not something computed.') },
        ],
      },
      {
        text: L("yoy ABC = yoy AB + yoy BC = 230°, bu 180° dan katta", 'дуга ABC = дуге AB + дуге BC = 230°, это больше 180°', 'arc ABC = arc AB + arc BC = 230°, this is more than 180°'),
        options: [
          { id: 'ok', right: true, label: L("Ikki qo'shni yoy qo'shiladi, 115 va 115 ning yig'indisi 230", 'Складываются две соседние дуги, сумма 115 и 115 равна 230', 'Two adjacent arcs are added, the sum of 115 and 115 is 230') },
          { id: 'no', label: L("230° yarim aylanadan kichik", '230° меньше полуокружности', '230° is less than a semicircle'), hint: L("230, 180 dan katta, demak yoy ABC katta yoy.", '230 больше 180, значит дуга ABC большая.', '230 is more than 180, so arc ABC is the major one.') },
        ],
      },
      {
        text: L("shuning uchun ∠AOC = 360° − 230° = 130°", 'поэтому ∠AOC = 360° − 230° = 130°', 'therefore ∠AOC = 360° − 230° = 130°'),
        options: [
          { id: 'ok', right: true, label: L("Yoy ABC katta bo'lgani uchun, mos markaziy burchak 360° dan ayirib topiladi", 'Так как дуга ABC большая, соответствующий центральный угол находится вычитанием из 360°', 'Since arc ABC is major, the matching central angle is found by subtracting from 360°') },
          { id: 'no', label: L("∠AOC to'g'ridan-to'g'ri 230° ga teng", '∠AOC равен 230° напрямую', '∠AOC equals 230° directly'), hint: L("230° yoyning o'zi, u 180° dan katta, shuning uchun burchak 360° dan ayirib topiladi.", '230° это сама дуга, она больше 180°, поэтому угол находится вычитанием из 360°.', '230° is the arc itself, it is more than 180°, so the angle is found by subtracting from 360°.') },
        ],
      },
    ],
    after: L(
      "Topildi. ∠AOC yuz o'ttiz daraja. Yoy katta bo'lgani uchun, ayirish kerak edi.",
      'Найдено. ∠AOC равен ста тридцати градусам. Так как дуга большая, потребовалось вычитание.',
      'Found. ∠AOC equals a hundred thirty degrees. Since the arc was major, subtraction was needed.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI HOLAT (`twoways`): kichik yig'indi va katta yig'indi.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З103',
  eyebrow: L('IKKI HOLAT', 'ДВА СЛУЧАЯ', 'TWO CASES'),
  title: L(
    "Yoylar yig'indisi kichik yoki katta bo'lishi mumkin",
    'Сумма дуг может быть малой или большой',
    'The sum of the arcs can be minor or major',
  ),
  audio: [
    A('mount',
      "Birinchi holatda ikki yoyning yig'indisi yarim aylanadan kichik qoladi.",
      'В первом случае сумма двух дуг остаётся меньше полуокружности.',
      'In the first case, the sum of the two arcs stays smaller than a semicircle.'),
    W('w2',
      "Ikkinchi holatda esa yig'indi yarim aylanadan oshib ketadi.",
      'А во втором случае сумма превышает полуокружность.',
      'In the second case, the sum exceeds the semicircle.'),
    W('w4',
      "Har safar yig'indi 180° bilan solishtiriladi, keyingina qoida tanlanadi.",
      'Каждый раз сумма сравнивается с 180°, и только потом выбирается правило.',
      'Each time the sum is compared with 180°, and only then is the rule chosen.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('YIG\'INDI KICHIK', 'СУММА МАЛАЯ', 'SMALL SUM'),
        lead: L(
          "Yoy AB va yoy BC har biri 40°",
          'Дуга AB и дуга BC по 40° каждая',
          'Arc AB and arc BC are each 40°',
        ),
        rows: [
          { text: '40° + 40° = 80°' },
          { text: L("180° dan kichik, ∠AOC to'g'ridan-to'g'ri 80°", 'меньше 180°, ∠AOC напрямую 80°', 'less than 180°, ∠AOC directly 80°'), tone: 'ok' },
        ],
      },
      {
        name: L('YIG\'INDI KATTA', 'СУММА БОЛЬШАЯ', 'LARGE SUM'),
        lead: L(
          "Yoy AB va yoy BC har biri 115°",
          'Дуга AB и дуга BC по 115° каждая',
          'Arc AB and arc BC are each 115°',
        ),
        rows: [
          { text: '115° + 115° = 230°' },
          { text: L("180° dan katta, ∠AOC = 360° − 230° = 130°", 'больше 180°, ∠AOC = 360° − 230° = 130°', 'more than 180°, ∠AOC = 360° − 230° = 130°'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('AVVAL SOLISHTIRISH', 'СНАЧАЛА СРАВНЕНИЕ', 'COMPARE FIRST'),
        lead: L(
          "Yig'indi 180° bilan solishtiriladi, keyin qoida tanlanadi",
          'Сумма сравнивается с 180°, потом выбирается правило',
          'The sum is compared with 180°, then the rule is chosen',
        ),
        rows: [{ text: L("180° dan kichik bo'lsa to'g'ridan-to'g'ri, katta bo'lsa 360° dan ayirib", 'если меньше 180°, напрямую, если больше, вычитанием из 360°', 'if less than 180°, directly, if more, by subtracting from 360°'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. UCH QOIDA (`parts`): yoyning gradus o'lchovi.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З103',
  eyebrow: L('YOYNING GRADUS O\'LCHOVI, UCH HOLAT', 'ГРАДУСНАЯ МЕРА ДУГИ, ТРИ СЛУЧАЯ', 'THE ARC\'S DEGREE MEASURE, THREE CASES'),
  title: L(
    "Yoyning gradus o'lchovi, uch holat",
    'Градусная мера дуги, три случая',
    "The arc's degree measure, three cases",
  ),
  audio: [
    A('mount',
      "Yoy va markaziy burchak orasidagi bog'lanish uch holatga bo'linadi.",
      'Связь между дугой и центральным углом делится на три случая.',
      'The connection between the arc and the central angle splits into three cases.'),
    W('p2',
      "Yarim aylana aynan yuz sakson daraja, bu doim shunday.",
      'Полуокружность это ровно сто восемьдесят градусов, это всегда так.',
      'The semicircle is exactly a hundred eighty degrees, this is always the case.'),
    W('p4',
      "Katta yoyda 360° dan markaziy burchak ayriladi, burchakning o'zi emas.",
      'У большой дуги из 360° вычитается центральный угол, а не сама дуга.',
      'For the major arc, the central angle is subtracted from 360°, not the arc itself.',
    ),
  ],
  props: {
    tokens: [
      { t: '< 180°', id: 'mid' },
      { t: '  = 180°  ', id: 'a' },
      { t: '= 360° − ∠', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Birinchi holat, kichik yoy, u markaziy burchakka to'g'ridan-to'g'ri teng.",
          'Первый случай, малая дуга, она напрямую равна центральному углу.',
          'The first case, the minor arc, it equals the central angle directly.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Ikkinchi holat, diametr chegaralagan yoy, u aynan yuz sakson daraja.",
          'Второй случай, дуга, ограниченная диаметром, она ровно сто восемьдесят градусов.',
          'The second case, the arc bounded by a diameter, it is exactly a hundred eighty degrees.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi holat, katta yoy, u markaziy burchak 360° dan ayirilib topiladi.",
          'Третий случай, большая дуга, она находится вычитанием центрального угла из 360°.',
          'The third case, the major arc, it is found by subtracting the central angle from 360°.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Aylanani gradusga bo'lish qadimgi Bobilda paydo bo'lgan, bir yilda taxminan uch yuz oltmish kun borligidan kelib chiqqan deb taxmin qilinadi.",
        'Деление окружности на градусы возникло в древнем Вавилоне, предположительно из того, что в году примерно триста шестьдесят дней.',
        'Dividing the circle into degrees arose in ancient Babylon, presumably from there being roughly three hundred sixty days in a year.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 33-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З102',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Aylana, markaziy burchak va yoy",
    'Окружность, центральный угол и дуга',
    'The circle, the central angle, and the arc',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Qoida ochildi, va xukdagi savolga javob topildi.",
      'Правило открылось, и ответ на вопрос из хука найден.',
      'The rule opened, and the hook question found its answer.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("markazdan o'tuvchi vatar diametr deyiladi, boshqasi oddiy vatar", 'хорда через центр называется диаметром, иначе просто хорда', 'a chord through the centre is called a diameter, otherwise just a chord') },
      { id: 'f2', label: L("kichik yoy markaziy burchakka to'g'ridan-to'g'ri teng, katta yoy 360° dan ayirib topiladi", 'малая дуга напрямую равна центральному углу, большая находится вычитанием из 360°', 'the minor arc directly equals the central angle, the major arc is found by subtracting from 360°') },
      { id: 'f3', label: L("bir xil ikki nuqtaning ikki yoyi yig'indisi 360°", 'сумма двух дуг одних и тех же двух точек равна 360°', 'the sum of the two arcs of the same two points equals 360°') },
      { id: 'w1', label: L("ixtiyoriy vatar diametr deyiladi", 'любая хорда называется диаметром', 'any chord is called a diameter') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Faqat markazdan o'tuvchi vatar diametr, ixtiyoriysi emas.",
      'Так не складывается. Диаметром является только хорда через центр, а не любая.',
      'That does not fit. Only a chord through the centre is a diameter, not just any chord.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 4-§, 33-mavzu asosida (107-108-bet)",
        'Правило на основе геометрии, § 4, тема 33 учебника (стр. 107-108)',
        'The rule is based on geometry, section 4, topic 33 of the textbook (pages 107-108)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Burchak faqat ikki nur orasidagi masofa deb bilardik",
        'Мы знали угол только как раствор между двумя лучами',
        'We knew the angle only as the gap between two rays',
      ),
      right: L(
        "endi uning aylanadagi yoy bilan qanday bog'langanini bilamiz",
        'теперь мы знаем, как он связан с дугой на окружности',
        'now we know how it connects to an arc on a circle',
      ),
      winner: 'right',
      note: L(
        "Kichikka to'g'ridan-to'g'ri, kattaga 360° dan ayirib",
        'К малой напрямую, к большой вычитанием из 360°',
        'Directly for the minor one, by subtracting from 360° for the major one',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): katta yoyni hisoblash.
// ============================================================
const ASK_MAJOR = L("Katta yoy AB necha daraja?", 'Чему равна большая дуга AB в градусах?', 'What is the major arc AB in degrees?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З103',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Markaziy burchakdan katta yoyni hisoblang",
    'Вычисли большую дугу по центральному углу',
    'Compute the major arc from the central angle',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida markaziy burchak berilgan.",
      'Пять заданий. В каждом дан центральный угол.',
      'Five tasks. In each, the central angle is given.'),
    A('why',
      "Katta yoy uchun burchak 360° dan ayriladi.",
      'Для большой дуги угол вычитается из 360°.',
      'For the major arc, the angle is subtracted from 360°.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar burchak 360° dan ayirilgan.",
      'Все пять разобраны. Каждый раз угол вычитался из 360°.',
      'All five are done. Each time the angle was subtracted from 360°.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'∠AOB = 80°'}</Row>,
        ok: L("Ha. Uch yuz oltmishdan sakson ayirilsa, ikki yuz sakson.", 'Да. Из трёхсот шестидесяти вычесть восемьдесят, двести восемьдесят.', 'Yes. Three hundred sixty minus eighty is two hundred eighty.'),
        question: ASK_MAJOR,
        items: [
          { id: 'a', right: true, label: '280°' },
          { id: 'b', label: '80°', hint: L("Bu markaziy burchakning o'zi, kichik yoy, katta yoy emas.", 'Это сам центральный угол, малая дуга, а не большая.', 'That is the central angle itself, the minor arc, not the major one.') },
        ],
        solution: ['360 − 80', '280'],
      },
      {
        expr: <Row size="big" align="center">{'∠AOB = 45°'}</Row>,
        ok: L("Ha. Uch yuz oltmishdan qirq besh ayirilsa, uch yuz o'n besh.", 'Да. Из трёхсот шестидесяти вычесть сорок пять, триста пятнадцать.', 'Yes. Three hundred sixty minus forty-five is three hundred fifteen.'),
        question: ASK_MAJOR,
        items: [
          { id: 'a', right: true, label: '315°' },
          { id: 'b', label: '45°', hint: L("Bu markaziy burchakning o'zi, kichik yoy, katta yoy emas.", 'Это сам центральный угол, малая дуга, а не большая.', 'That is the central angle itself, the minor arc, not the major one.') },
        ],
        solution: ['360 − 45', '315'],
      },
      {
        expr: <Row size="big" align="center">{'∠AOB = 150°'}</Row>,
        ok: L("Ha. Uch yuz oltmishdan yuz ellik ayirilsa, ikki yuz o'n.", 'Да. Из трёхсот шестидесяти вычесть сто пятьдесят, двести десять.', 'Yes. Three hundred sixty minus a hundred fifty is two hundred ten.'),
        question: ASK_MAJOR,
        items: [
          { id: 'a', right: true, label: '210°' },
          { id: 'b', label: '150°', hint: L("Bu markaziy burchakning o'zi, kichik yoy, katta yoy emas.", 'Это сам центральный угол, малая дуга, а не большая.', 'That is the central angle itself, the minor arc, not the major one.') },
        ],
        solution: ['360 − 150', '210'],
      },
      {
        expr: <Row size="big" align="center">{'∠AOB = 100°'}</Row>,
        ok: L("Ha. Uch yuz oltmishdan yuz ayirilsa, ikki yuz oltmish.", 'Да. Из трёхсот шестидесяти вычесть сто, двести шестьдесят.', 'Yes. Three hundred sixty minus a hundred is two hundred sixty.'),
        question: ASK_MAJOR,
        items: [
          { id: 'a', right: true, label: '260°' },
          { id: 'b', label: '100°', hint: L("Bu markaziy burchakning o'zi, kichik yoy, katta yoy emas.", 'Это сам центральный угол, малая дуга, а не большая.', 'That is the central angle itself, the minor arc, not the major one.') },
        ],
        solution: ['360 − 100', '260'],
      },
      {
        expr: <Row size="big" align="center">{'∠AOB = 162°'}</Row>,
        ok: L("Ha. Uch yuz oltmishdan yuz oltmish ikki ayirilsa, ikki yuz to'qqiz.", 'Да. Из трёхсот шестидесяти вычесть сто шестьдесят два, сто девяносто восемь.', 'Yes. Three hundred sixty minus a hundred sixty-two is a hundred ninety-eight.'),
        question: ASK_MAJOR,
        items: [
          { id: 'a', right: true, label: '198°' },
          { id: 'b', label: '162°', hint: L("Bu markaziy burchakning o'zi, kichik yoy, katta yoy emas.", 'Это сам центральный угол, малая дуга, а не большая.', 'That is the central angle itself, the minor arc, not the major one.') },
        ],
        solution: ['360 − 162', '198'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): radius va diametr orasidagi bog'lanish.
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З102',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Radius va diametr orasidagi bog'lanishni ishlating",
    'Примени связь между радиусом и диаметром',
    'Apply the connection between the radius and the diameter',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Diametr ikki radiusga teng.",
      'Три задания. Диаметр равен двум радиусам.',
      'Three tasks. The diameter equals two radii.'),
    A('why',
      "Radiusdan diametrga o'tishda ikkiga ko'paytiriladi, aksincha bo'lsa ikkiga bo'linadi.",
      'При переходе от радиуса к диаметру умножают на два, а обратно делят на два.',
      'Going from the radius to the diameter, multiply by two, going back, divide by two.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ikkiga ko'paytirilgan yoki bo'lingan.",
      'Все три разобраны. Каждый раз умножали или делили на два.',
      'All three are done. Each time it was multiplied or divided by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'R = 7'}</Row>,
        ok: L("Ha. Yetti ikkiga ko'paytirilsa, o'n to'rt.", 'Да. Семь умножить на два, четырнадцать.', 'Yes. Seven times two is fourteen.'),
        question: L("Diametr necha sm?", 'Чему равен диаметр в см?', 'What is the diameter in cm?'),
        items: [
          { id: 'a', right: true, label: '14' },
          { id: 'b', label: '7', hint: L("Bu radiusning o'zi, diametr emas.", 'Это сам радиус, а не диаметр.', 'That is the radius itself, not the diameter.') },
        ],
        solution: ['7 · 2', '14'],
      },
      {
        expr: <Row size="big" align="center">{'R = 12,5'}</Row>,
        ok: L("Ha. O'n ikki nuqta besh ikkiga ko'paytirilsa, yigirma besh.", 'Да. Двенадцать целых пять умножить на два, двадцать пять.', 'Yes. Twelve point five times two is twenty-five.'),
        question: L("Diametr necha sm?", 'Чему равен диаметр в см?', 'What is the diameter in cm?'),
        items: [
          { id: 'a', right: true, label: '25' },
          { id: 'b', label: '12,5', hint: L("Bu radiusning o'zi, diametr emas.", 'Это сам радиус, а не диаметр.', 'That is the radius itself, not the diameter.') },
        ],
        solution: ['12,5 · 2', '25'],
      },
      {
        expr: <Row size="big" align="center">{'D = 18'}</Row>,
        ok: L("Ha. O'n sakkiz ikkiga bo'linsa, to'qqiz.", 'Да. Восемнадцать разделить на два, девять.', 'Yes. Eighteen divided by two is nine.'),
        question: L("Radius necha sm?", 'Чему равен радиус в см?', 'What is the radius in cm?'),
        items: [
          { id: 'a', right: true, label: '9' },
          { id: 'b', label: '36', hint: L("Bu diametrni ko'paytirish, radius esa bo'lish bilan topiladi.", 'Это умножение диаметра, а радиус находится делением.', 'That is multiplying the diameter, but the radius is found by dividing.') },
        ],
        solution: ['18 : 2', '9'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (`drill`, приборсиз): son bilan tekshirish (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Hisoblashni son bilan tekshiring",
    'Проверь вычисление числом',
    'Check the computation with a number',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida taklif qilingan javobni tekshiring.",
      'Три задания. В каждом проверь предложенный ответ.',
      'Three tasks. In each, check the proposed answer.'),
    A('why',
      "Yoy 180° dan kichik yoki katta ekanini avval aniqlang.",
      'Сначала определи, дуга меньше или больше 180°.',
      'First determine whether the arc is less than or more than 180°.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar 180° bilan solishtirish javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз сравнение с 180° проверяло ответ.',
      'All three are done. Each time comparing with 180° checked the answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'∠AOB=90°   →   AB = 90°'}</Row>,
        ok: L("Ha. To'qson daraja yuz sakson darajadan kichik, yoy burchakka to'g'ridan-to'g'ri teng.", 'Да. Девяносто градусов меньше ста восьмидесяти, дуга напрямую равна углу.', 'Yes. Ninety degrees is less than a hundred eighty, the arc directly equals the angle.'),
        question: L("Kichik yoy AB to'qson darajaga tengmi?", 'Верна ли малая дуга AB, девяносто градусов?', "Is the minor arc AB ninety degrees correct?"),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("To'qson kichik yoy, u yuz sakkondan kichik, burchakka to'g'ridan-to'g'ri teng.", 'Девяносто это малая дуга, она меньше ста восьмидесяти, равна углу напрямую.', 'Ninety is the minor arc, it is less than a hundred eighty, it equals the angle directly.') },
        ],
        solution: ['90 < 180', 'yoy = 90'],
      },
      {
        expr: <Row size="big" align="center">{'∠AOB=140°   →   AB = 140°'}</Row>,
        ok: L("Yo'q. Katta yoy uch yuz oltmishdan yuz qirqni ayirib topiladi, ikki yuz yigirma chiqadi, yuz qirq emas.", 'Нет. Большая дуга находится вычитанием ста сорока из трёхсот шестидесяти, выходит двести двадцать, а не сто сорок.', 'No. The major arc is found by subtracting a hundred forty from three hundred sixty, giving two hundred twenty, not a hundred forty.'),
        question: L("Katta yoy AB yuz qirq darajaga tengmi?", 'Верна ли большая дуга AB, сто сорок градусов?', "Is the major arc AB a hundred forty degrees correct?"),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, uch yuz oltmishdan yuz qirq ayirilishi kerak.", 'Посчитай снова, нужно вычесть сто сорок из трёхсот шестидесяти.', 'Compute it again, a hundred forty should be subtracted from three hundred sixty.') },
        ],
        solution: ['360 − 140', '220'],
      },
      {
        expr: <Row size="big" align="center">{'∠AOB=115°, BC=AB   →   ∠AOC = 130°'}</Row>,
        ok: L("Ha. Yoy ABC ikki yuz o'ttiz daraja, u yuz sakksondan katta, uch yuz oltmishdan ayirilsa, yuz o'ttiz chiqadi.", 'Да. Дуга ABC двести тридцать градусов, она больше ста восьмидесяти, вычтя из трёхсот шестидесяти, выходит сто тридцать.', 'Yes. Arc ABC is two hundred thirty degrees, more than a hundred eighty, subtracting from three hundred sixty gives a hundred thirty.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, ikki yuz o'ttizni uch yuz oltmishdan ayirsak, yuz o'ttiz chiqadi.", 'Посчитай, вычтя двести тридцать из трёхсот шестидесяти, выходит сто тридцать.', 'Compute it, subtracting two hundred thirty from three hundred sixty gives a hundred thirty.') },
        ],
        solution: ['115 + 115', '230', '360 − 230', '130'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): vatar diametr deb olingan (З102)
// va katta yoy 360° dan ayirilmagan (З103).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З102',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato javobda nima noto'g'ri",
    'Что неверно в двух ошибочных ответах',
    'What is wrong in two mistaken answers',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham boshqa-boshqa xato bor.",
      'Два задания. В обоих разные ошибки.',
      'Two tasks. Each has a different mistake.'),
    A('why',
      "Birinchisida markazdan o'tmagan vatar diametr deb atalgan, ikkinchisida katta yoy ayirilmagan.",
      'В первом хорда без центра названа диаметром, во втором большая дуга не вычтена.',
      'In the first, a chord without the centre was called a diameter, in the second, the major arc was not subtracted.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham boshqa-boshqa qoidani chetlab o'tgan.",
      'Обе разобраны. Обе ошибки обошли разные правила.',
      'Both are done. Each mistake bypassed a different rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'AB'}</Row>,
        ok: L("Ha. Markazdan o'tmagan kesma diametr emas, u oddiy vatar.", 'Да. Отрезок, не проходящий через центр, не диаметр, это просто хорда.', 'Yes. A segment that does not pass through the centre is not a diameter, it is just a chord.'),
        question: L("AB kesmasi aylananing markazidan o'tmasa, va u diametr deb atalgan bo'lsa, bu yerda xato qayerda?", 'Если отрезок AB не проходит через центр окружности, а назван диаметром, в чём здесь ошибка?', 'If segment AB does not pass through the centre of the circle, and it was called a diameter, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Markazdan o'tmagan kesma vatar, diametr emas", 'Отрезок, не проходящий через центр, хорда, а не диаметр', 'A segment not passing through the centre is a chord, not a diameter') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, diametr faqat markazdan o'tuvchi vatar.", 'Это и есть показанная ошибка, диаметром является только хорда через центр.', 'This is the very mistake shown; only a chord through the centre is a diameter.') },
        ],
        solution: ['AB'],
      },
      {
        expr: <Row size="big" align="center">{'∠AOB=160°   →   AB = 160°'}</Row>,
        ok: L("Ha. Katta yoy uch yuz oltmishdan yuz oltmishni ayirib topiladi, ikki yuz chiqadi, yuz oltmish emas.", 'Да. Большая дуга находится вычитанием ста шестидесяти из трёхсот шестидесяти, выходит двести, а не сто шестьдесят.', 'Yes. The major arc is found by subtracting a hundred sixty from three hundred sixty, giving two hundred, not a hundred sixty.'),
        question: L("Markaziy burchak yuz oltmish daraja bo'lsa, va katta yoy yuqoridagicha topilgan bo'lsa, bu yerda xato qayerda?", 'Если центральный угол сто шестьдесят градусов, а большая дуга найдена как выше, в чём здесь ошибка?', 'If the central angle is a hundred sixty degrees, and the major arc was found as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("360° dan burchak ayirilmagan, burchakning o'zi yozilgan", 'Угол не вычтен из 360°, записан сам угол', 'The angle was not subtracted from 360°, the angle itself was written') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, ikki yuz chiqishi kerak, yuz oltmish emas.", 'Это и есть показанная ошибка, должно выйти двести, а не сто шестьдесят.', 'This is the very mistake shown; it should come to two hundred, not a hundred sixty.') },
        ],
        solution: ['360 − 160', '200'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): masala uslubida qadamlab hisoblash.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З103',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "∠AOB va yoy BC = yoy AB dan ∠AOC ni qadamlab toping",
    'По ∠AOB и дуге BC, равной дуге AB, найди ∠AOC, по шагам',
    'From ∠AOB and arc BC equal to arc AB, find ∠AOC, step by step',
  ),
  audio: [
    A('mount',
      "∠AOB berilgan, yoy BC yoy AB ga teng. Avval yoy ABC, keyin ∠AOC topiladi.",
      'Дан ∠AOB, дуга BC равна дуге AB. Сначала находится дуга ABC, потом ∠AOC.',
      'Given ∠AOB, arc BC equals arc AB. First arc ABC is found, then ∠AOC.'),
    A('why',
      "Yoy ABC 180° dan katta chiqsa, 360° dan ayiriladi.",
      'Если дуга ABC выходит больше 180°, из 360° вычитается.',
      'If arc ABC comes out more than 180°, it is subtracted from 360°.',
    ),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar yoy ABC topilib, keyin 360° dan ayirilgan.",
      'Все три заполнены. Каждый раз находилась дуга ABC, потом вычиталась из 360°.',
      'All three are filled. Each time arc ABC was found, then subtracted from 360°.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['230', '130'],
      lines: [
        [{ t: '∠AOB = 115°   →   ABC = ' }, { slot: '230' }, { t: '°   →   ∠AOC = ' }, { slot: '130' }, { t: '°' }],
      ],
    },
    tasks: [
      {
        chips: ['200', '160'],
        lines: [
          [{ t: '∠AOB = 100°   →   ABC = ' }, { slot: '200' }, { t: '°   →   ∠AOC = ' }, { slot: '160' }, { t: '°' }],
        ],
      },
      {
        chips: ['280', '80'],
        lines: [
          [{ t: '∠AOB = 140°   →   ABC = ' }, { slot: '280' }, { t: '°   →   ∠AOC = ' }, { slot: '80' }, { t: '°' }],
        ],
      },
      {
        chips: ['190', '170'],
        lines: [
          [{ t: '∠AOB = 95°   →   ABC = ' }, { slot: '190' }, { t: '°   →   ∠AOC = ' }, { slot: '170' }, { t: '°' }],
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS (to'rt savol va beshinchisi SBORKA).
// ============================================================
const S14 = {
  role: 'blitz',
  tool: 'blitz',
  eyebrow: UI.blitzEyebrow,
  title: L(
    "Aylana va markaziy burchak bo'yicha to'rt savol",
    'Четыре вопроса об окружности и центральном угле',
    'Four questions about the circle and the central angle',
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
        id: 'q1', tag: 'З102',
        ask: L('Aylananing markazidan o\'tuvchi vatar nima deyiladi?', 'Как называется хорда, проходящая через центр окружности?', 'What is a chord passing through the centre of a circle called?'),
        options: [
          { id: 'ok', right: true, label: L('Diametr', 'Диаметр', 'Diameter') },
          { id: 'no', label: L('Radius', 'Радиус', 'Radius') },
        ],
        hint: L("Radius markazdan chiqadi, aylana nuqtasiga, ikkinchi aylana nuqtasiga emas.", 'Радиус выходит из центра к точке окружности, а не к другой точке окружности.', 'A radius goes from the centre to a point on the circle, not to another point on the circle.'),
        ok: L("To'g'ri, bu diametr.", 'Верно, это диаметр.', 'Correct, this is a diameter.'),
      },
      {
        id: 'q2', tag: 'З103',
        ask: L('∠AOB = 130°. Katta yoy AB necha daraja?', '∠AOB = 130°. Чему равна большая дуга AB в градусах?', '∠AOB = 130°. What is the major arc AB in degrees?'),
        options: [
          { id: 'ok', right: true, label: '230°' },
          { id: 'no', label: '130°' },
        ],
        hint: L("Yuz o'ttiz kichik yoy, katta yoy uch yuz oltmishdan ayirib topiladi.", 'Сто тридцать это малая дуга, большая находится вычитанием из трёхсот шестидесяти.', 'A hundred thirty is the minor arc, the major one is found by subtracting from three hundred sixty.'),
        ok: L("To'g'ri, ikki yuz o'ttiz.", 'Верно, двести тридцать.', 'Correct, two hundred thirty.'),
      },
      {
        id: 'q3', tag: 'З103',
        ask: L('∠AOB = 60°. Kichik yoy AB necha daraja?', '∠AOB = 60°. Чему равна малая дуга AB в градусах?', '∠AOB = 60°. What is the minor arc AB in degrees?'),
        options: [
          { id: 'ok', right: true, label: '60°' },
          { id: 'no', label: '300°' },
        ],
        hint: L("Uch yuz bu katta yoy, kichik yoy burchakka to'g'ridan-to'g'ri teng.", 'Триста это большая дуга, малая дуга напрямую равна углу.', 'Three hundred is the major arc, the minor arc directly equals the angle.'),
        ok: L("To'g'ri, oltmish.", 'Верно, шестьдесят.', 'Correct, sixty.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('360 dan 230 ni ayirsak, 130 chiqadimi?', 'Верно ли, что 360 минус 230, равно 130?', 'Is it true that 360 minus 230 equals 130?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, uch yuz oltmishdan ikki yuz o'ttiz ayiring.", 'Посчитай, вычти двести тридцать из трёхсот шестидесяти.', 'Compute it, subtract two hundred thirty from three hundred sixty.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З103',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "∠AOB = 170°, yoy BC = yoy AB bo'lgan holda ∠AOC ni yig'ing.",
            'Собери ∠AOC, если ∠AOB = 170°, а дуга BC равна дуге AB.',
            'Assemble ∠AOC, if ∠AOB = 170°, and arc BC equals arc AB.',
          ),
          lines: [
            [{ t: 'ABC = ' }, { slot: '340' }, { t: '°   →   ∠AOC = ' }, { slot: '20' }, { t: '°' }],
          ],
          tiles: [
            { id: 't1', v: '340', x: 12, y: 12 },
            { id: 't2', v: '20', x: 60, y: 14 },
            { id: 't3', v: '170', x: 30, y: 50 },
            { id: 't4', v: '190', x: 78, y: 48 },
          ],
          hint: L(
            "Yuz yetmishni ikki marta qo'shing, keyin uch yuz oltmishdan ayiring.",
            'Сложи сто семьдесят два раза, потом вычти из трёхсот шестидесяти.',
            'Add a hundred seventy twice, then subtract from three hundred sixty.',
          ),
          doneNote: L(
            "Yig'ildi. Yoy ABC uch yuz qirq, ∠AOC esa yigirma daraja chiqdi.",
            'Собрано. Дуга ABC триста сорок, а ∠AOC вышел двадцать градусов.',
            'Assembled. Arc ABC is three hundred forty, and ∠AOC comes out to twenty degrees.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (`takeaway`). Yangi matematika yo'q.
// ============================================================
const S15 = {
  role: 'summary',
  tool: 'takeaway',
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Kichikka to'g'ridan-to'g'ri, kattaga 360° dan ayirib",
    'К малой напрямую, к большой вычитанием из 360°',
    'Directly for the minor one, by subtracting from 360° for the major one',
  ),
  audio: [
    A('s0',
      "Darsdan bitta rasm qoladi. Ikki nuqta aylanani kichik va katta yoyga bo'ladi.",
      'С урока остаётся один рисунок. Две точки делят окружность на малую и большую дугу.',
      'One picture stays with you. Two points split the circle into a minor and a major arc.'),
    A('s1',
      "Bugun uch narsa qilindi. Vatar va diametrni ajratdingiz, katta yoyni chertyozhda topdingiz va darslik masalasini yechdingiz.",
      'Сегодня сделано три вещи. Ты отличил хорду от диаметра, нашёл большую дугу на чертеже, и решил задачу учебника.',
      "Three things are done today. You told a chord apart from a diameter, found the major arc on a drawing, and solved the textbook's problem."),
    A('s2',
      "Keyingi darsda vatar va diametrning xossalari, jumladan markazdan vatargacha bo'lgan perpendikulyar.",
      'В следующем уроке свойства хорды и диаметра, в том числе перпендикуляр от центра к хорде.',
      'The next lesson covers the properties of the chord and the diameter, including the perpendicular from the centre to a chord.',
    ),
  ],
  props: {
    mark: L("yoy < 180° → burchak;   yoy > 180° → 360° − burchak", 'дуга < 180° → угол;   дуга > 180° → 360° − угол', 'arc < 180° → the angle;   arc > 180° → 360° − the angle'),
    markNote: L(
      "∠AOB = 115°, yoy BC = yoy AB → ∠AOC = 130°",
      '∠AOB = 115°, дуга BC = дуге AB → ∠AOC = 130°',
      '∠AOB = 115°, arc BC = arc AB → ∠AOC = 130°',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: vatar va diametrning xossalari",
      'Следующий урок: свойства хорды и диаметра',
      'Next lesson: the properties of the chord and the diameter',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
