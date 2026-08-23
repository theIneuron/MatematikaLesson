// ============================================================================
// 8-sinf, Dars 51. AYLANAGA ICHKI CHIZILGAN BURCHAK.
//
// BLOK Б7, AYLANA QISMI DAVOM ETADI. Bu fayl, FAQAT MA'LUMOT. Mexanika
// `screens.jsx`, `circlefigure.jsx`, `prooflines.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx` da. YANGI PRIBOR YO'Q — `CircleFigure` (dars 48)
// va `ProofLines` (dars 37+) qayta ishlatilgan.
//
// MANBA: 8-sinf geometriya darsligi, 4-§ (AYLANA), 36-mavzu (114-117-bet):
//   - Ta'rif: uchi aylanada yotuvchi, tomonlari esa shu aylanani kesib
//     o'tuvchi burchak ICHKI CHIZILGAN BURCHAK deyiladi; u o'zining
//     uchidan farqli, QARAMA-QARSHI yoyga tiraladi;
//   - Teorema: ichki chizilgan burchak o'zi tiralgan yoyning yarmi bilan
//     o'lchanadi, ∠ABC = ½ yoy AC. Isbot uch holatga bo'linadi (markaz
//     burchak tomonida, burchak ichida, burchakdan tashqarida); 1-holat
//     to'liq isbotlanadi (OAB teng yonli, AOC tashqi burchak = 2∠ABC,
//     AOC markaziy burchak = yoy AC, demak ∠ABC = ½ yoy AC), qolgan
//     ikkitasi darslikda o'quvchiga mustaqil ishlash uchun qoldirilgan;
//   - 1-natija: bir yoyga tiralgan hamma ichki chizilgan burchaklar teng;
//   - 2-natija: diametrga (yarim aylanaga) tiralgan ichki chizilgan
//     burchak har doim to'g'ri burchak (90°);
//   - Masala (115-116-bet): aylananing radiusiga teng vatar, markazdan
//     60° burchak ostida (teng tomonli uchburchak), aylananing ixtiyoriy
//     nuqtasidan esa 30° burchak ostida ko'rinadi;
//   - 440-mashq: ∠AOB=88° (markaziy) → ∠ACB=44° (ichki chizilgan, bir xil
//     yoyga tiralgan); 439-mashq: AB diametr, yoy AC:yoy CB = 7:2 →
//     ∠BAC=20° (yoy CB=40°, uning yarmi).
//
// ADASHISHLAR, ikkitasi yangi:
//   З108, ichki chizilgan burchakka tiralgan yoy sifatida burchak uchi
//   joylashgan yoy olingan, aslida unga QARAMA-QARSHI yoy olinishi kerak;
//   З109, ichki chizilgan burchak yoyga TENG deb olingan (yoki aksincha),
//   aslida u yoyning YARMIGA teng;
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
  id: 'geo-8-51',
  n: 51,
  row: 56,
  block: 'Б7',
  topic: L('Aylanaga ichki chizilgan burchak', 'Вписанный угол', 'The inscribed angle'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Aylanaga ichki chizilgan burchak, uchi aylanada, tomonlari esa aylanani kesib o'tuvchi vatarlar bo'lgan burchak; u o'z uchidan farqli, qarama-qarshi yoyga tiraladi",
    'Вписанный угол, это угол с вершиной на окружности, чьи стороны — пересекающие окружность хорды; он опирается на противоположную от своей вершины дугу',
    "An inscribed angle is an angle with its vertex on the circle, whose sides are chords crossing the circle; it subtends the arc opposite its own vertex",
  ),
  L(
    "Ichki chizilgan burchak o'zi tiralgan yoyning yarmi bilan o'lchanadi, ∠ABC = ½ yoy AC",
    'Вписанный угол измеряется половиной дуги, на которую он опирается, ∠ABC = ½ дуги AC',
    'An inscribed angle is measured by half the arc it subtends, ∠ABC = ½ arc AC',
  ),
  L(
    "Bir yoyga tiralgan hamma ichki chizilgan burchaklar teng; diametrga tiralgan ichki chizilgan burchak esa har doim to'g'ri burchak",
    'Все вписанные углы, опирающиеся на одну дугу, равны; а вписанный угол, опирающийся на диаметр, всегда прямой',
    'All inscribed angles subtending the same arc are equal; an inscribed angle subtending a diameter is always a right angle',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З108': {
    what: L(
      "ichki chizilgan burchakka tiralgan yoy sifatida burchak uchi joylashgan yoy olingan, aslida unga qarama-qarshi yoy olinishi kerak",
      'в качестве дуги, на которую опирается вписанный угол, взята дуга, где лежит его вершина, а на самом деле нужна противоположная',
      "the arc where the angle's own vertex lies was taken as the subtended arc, but the opposite one should be taken",
    ),
    wrong: null,
    at: 12,
  },
  'З109': {
    what: L(
      "ichki chizilgan burchak yoyga teng deb olingan, aslida u yoyning yarmiga teng",
      'вписанный угол принят равным дуге, а на самом деле он равен половине дуги',
      'the inscribed angle was taken as equal to the arc, but it actually equals half the arc',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (4-ekran, ProofLines). 1-holat: B, A, C
// uchburchagi, B-O-C diametr bo'ylab (O markaz, BC tomonda).
// ============================================================
const INS_PTS = { B: [55, 15], A: [15, 75], C: [55, 95], O: [55, 55] }
const INS_ORDER = ['B', 'A', 'C']

// ============================================================
// SAHNALAR (§6). Xuk: burchak uchi aylanada bo'lganda nima o'zgaradi.
// ============================================================
const SC_ASK = L('ICHKI CHIZILGAN BURCHAK', 'ВПИСАННЫЙ УГОЛ', 'THE INSCRIBED ANGLE')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <circle cx="175" cy="62" r="28" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <line x1="175" y1="34" x2="150" y2="80" stroke={T.ink3} strokeWidth="1.4"/>
      <line x1="175" y1="34" x2="200" y2="80" stroke={T.ink3} strokeWidth="1.4"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="175" cy="45" r="10" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.2"/>
        <text x="175" y="49" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Ichki chizilgan burchak, tiralgan yoyning yarmi",
      'Вписанный угол — половина дуги, на которую он опирается',
      'The inscribed angle is half the arc it subtends',
    )}>
      <circle cx="185" cy="62" r="26" fill="none" stroke={T.ok} strokeWidth="1.6"/>
      <text x="185" y="40" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12" fontWeight="700" fill={T.ok}>{'∠ = yoy : 2'}</text>
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
  eyebrow: L('ICHKI CHIZILGAN BURCHAK', 'ВПИСАННЫЙ УГОЛ', 'THE INSCRIBED ANGLE'),
  title: L(
    "Burchakning uchi aylananing o'zida yotadi, tomonlari vatarlar. Bu burchak yoy bilan qanday bog'langan deb o'ylaysiz",
    'Вершина угла лежит на самой окружности, стороны хорды. Как думаешь, как этот угол связан с дугой',
    'The vertex of the angle lies on the circle itself, the sides are chords. How do you think this angle relates to the arc',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "44-darsda burchakning uchi markazda edi. Bugun u aylananing o'zida.",
      'На уроке 44 вершина угла была в центре. Сегодня она на самой окружности.',
      'In lesson 48, the angle\'s vertex was at the centre. Today it is on the circle itself.'),
    A('why',
      "Taxmin qiling, bu burchak yoyga qanday bog'langan bo'ladi.",
      'Предположи, как этот угол связан с дугой.',
      'Predict how this angle relates to the arc.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, bu burchak yoyning gradus o'lchoviga qanday bog'langan?",
      'Как думаешь, как этот угол связан с градусной мерой дуги?',
      'What do you think, how is this angle related to the degree measure of the arc?',
    ),
    items: [
      { id: 'a', show: L('Yoyga teng', 'Равен дуге', 'Equal to the arc') },
      { id: 'b', show: L("Yoyning yarmiga teng", 'Равен половине дуги', 'Equal to half the arc') },
      { id: 'c', show: L("Yoyning ikki hissasiga teng", 'Равен удвоенной дуге', 'Equal to double the arc') },
      { id: 'd', show: L("Hech qanday bog'lanish yo'q", 'Никакой связи нет', 'There is no connection') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Markaziy burchakni eslash (48-darsdan).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Markaziy burchakni eslash",
    'Вспоминаем центральный угол',
    'Recalling the central angle',
  ),
  audio: [
    A('mount',
      "48-darsda markaziy burchak, uchi markazda bo'lgan burchak edi.",
      'На уроке 48 центральный угол был углом с вершиной в центре.',
      'In lesson 48, the central angle was an angle with its vertex at the centre.'),
    A('why',
      "U to'g'ridan-to'g'ri yoyga teng edi. Bugun uchi boshqa joyda.",
      'Он был напрямую равен дуге. Сегодня вершина в другом месте.',
      'It was directly equal to the arc. Today the vertex is in a different place.'),
  ],
  props: {
    ask: L(
      "Markaziy burchak (uchi markazda) mos yoyga qanday bog'langan edi?",
      'Как центральный угол (с вершиной в центре) был связан с дугой?',
      'How was the central angle (with vertex at the centre) related to the arc?',
    ),
    items: [
      { id: 'right', show: L("To'g'ridan-to'g'ri teng", 'Напрямую равен', 'Directly equal'), right: true, name: L("markaziy burchak yoyga teng", 'центральный угол равен дуге', 'the central angle equals the arc') },
      {
        id: 'wrong', show: L("Yoyning yarmiga teng", 'Равен половине дуги', 'Equal to half the arc'),
        hint: L("Bu markaziy burchak uchun emas, bugungi burchak uchun bo'ladi.", 'Это не для центрального угла, а для сегодняшнего.', 'That is not for the central angle, it will be for today\'s angle.'),
      },
    ],
    after: L(
      "To'g'ri. Bugungi burchak esa yarim nisbatda bog'langan bo'ladi, chunki uchi markazda emas.",
      'Верно. А сегодняшний угол будет связан в половинном отношении, потому что вершина не в центре.',
      'Correct. Today\'s angle will be related by a half ratio, because the vertex is not at the centre.',
    ),
  },
}

// ============================================================
// EKRAN 3. QAYSI YOYGA TIRALGAN (`pick`). Ловушка, uchi joylashgan yoy
// olinishi (З108).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З108',
  eyebrow: L('QAYSI YOYGA TIRALGAN', 'НА КАКУЮ ДУГУ ОПИРАЕТСЯ', 'WHICH ARC IT SUBTENDS'),
  title: L(
    "∠BAC, uchi A. U qaysi yoyga tiraladi",
    '∠BAC, вершина A. На какую дугу он опирается',
    '∠BAC, vertex A. Which arc does it subtend',
  ),
  audio: [
    A('mount',
      "∠BAC ning uchi A, tomonlari AB va AC vatarlar.",
      'Вершина ∠BAC это точка A, стороны AB и AC это хорды.',
      "The vertex of ∠BAC is point A, the sides AB and AC are chords."),
    A('why',
      "Tiralgan yoy A dan FARQLI, ya'ni qarama-qarshi tomondagi yoy bo'ladi.",
      'Дуга, на которую он опирается, лежит ОТДЕЛЬНО от A, то есть на противоположной стороне.',
      "The arc it subtends lies APART from A, that is, on the opposite side."),
  ],
  props: {
    ask: L(
      "∠BAC qaysi yoyga tiraladi?",
      'На какую дугу опирается ∠BAC?',
      'Which arc does ∠BAC subtend?',
    ),
    items: [
      { id: 'right', show: L("BC yoyi, A dan farqli tomondagi", 'Дуга BC, на стороне, не содержащей A', 'Arc BC, on the side apart from A'), right: true, name: L("bu A ga qarama-qarshi yoy", 'это дуга, противоположная A', 'this is the arc opposite A') },
      {
        id: 'wrong', show: L("A orqali o'tuvchi yoy", 'Дуга, проходящая через A', 'The arc passing through A'),
        hint: L("Bu yoy burchak uchi joylashgan tomonda, u tiralgan yoy emas.", 'Эта дуга на той же стороне, где вершина угла, она не является дугой опоры.', 'This arc is on the same side as the vertex, it is not the subtended arc.'),
      },
    ],
    after: L(
      "To'g'ri. Tiralgan yoy doim burchak uchidan farqli, qarama-qarshi tomonda bo'ladi.",
      'Верно. Дуга опоры всегда на стороне, не содержащей вершину угла, на противоположной.',
      'Correct. The subtended arc is always on the side apart from the vertex, on the opposite side.',
    ),
  },
}

// ============================================================
// EKRAN 4. TEOREMANI ISBOTLAYMIZ (`prooflines`). 1-holat, 115-bet.
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З109',
  eyebrow: L('TEOREMANI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ТЕОРЕМУ', 'PROVING THE THEOREM'),
  title: L(
    "Ichki chizilgan burchak tiralgan yoyning yarmiga teng",
    'Вписанный угол равен половине дуги, на которую он опирается',
    'The inscribed angle equals half the arc it subtends',
  ),
  audio: [
    A('mount',
      "ABC ichki chizilgan burchak, BC tomon markaz O dan o'tadi.",
      'ABC, вписанный угол, сторона BC проходит через центр O.',
      'ABC, an inscribed angle, side BC passes through centre O.'),
    A('why',
      "OA radius bo'lgani uchun, AOB uchburchak teng yonli bo'ladi.",
      'Так как OA радиус, треугольник AOB равнобедренный.',
      'Since OA is a radius, triangle AOB is isosceles.'),
  ],
  props: {
    points: INS_PTS,
    order: INS_ORDER,
    marks: [['O', 'A']],
    given: [
      L("O, markaz; ABC, ichki chizilgan burchak; BC tomon O dan o'tadi", 'O, центр; ABC, вписанный угол; сторона BC проходит через O', 'O, the centre; ABC, an inscribed angle; side BC passes through O'),
    ],
    goal: L("∠ABC = ½ yoy AC", '∠ABC = ½ дуги AC', '∠ABC = ½ arc AC'),
    lines: [
      {
        text: L("OA = OB = R bo'lgani uchun, AOB uchburchak teng yonli, ∠OBA = ∠OAB", 'так как OA = OB = R, треугольник AOB равнобедренный, ∠OBA = ∠OAB', 'since OA = OB = R, triangle AOB is isosceles, ∠OBA = ∠OAB'),
        options: [
          { id: 'ok', right: true, label: L("Ikkalasi ham radius, teng yonli uchburchakning asosidagi burchaklari teng", 'Оба радиусы, углы при основании равнобедренного треугольника равны', 'Both are radii, the base angles of the isosceles triangle are equal') },
          { id: 'no', label: L("Bu chizmadan shunday ko'rinadi", 'Так видно на чертеже', 'That is how it looks on the drawing'), hint: L("Ko'rinish sabab emas, OA va OB bir xil aylananing radiusi bo'lgani uchun teng.", 'Внешний вид не причина, OA и OB равны, потому что оба радиусы одной окружности.', 'Appearance is not the reason, OA and OB are equal because both are radii of the same circle.') },
        ],
      },
      {
        text: L("∠AOC, AOB uchburchakning tashqi burchagi, shuning uchun ∠AOC = ∠OBA + ∠OAB = 2∠ABC", '∠AOC, внешний угол треугольника AOB, поэтому ∠AOC = ∠OBA + ∠OAB = 2∠ABC', '∠AOC, the exterior angle of triangle AOB, so ∠AOC = ∠OBA + ∠OAB = 2∠ABC'),
        options: [
          { id: 'ok', right: true, label: L("Uchburchakning tashqi burchagi ikkita qo'shni bo'lmagan ichki burchak yig'indisiga teng", 'Внешний угол треугольника равен сумме двух несмежных внутренних углов', 'The exterior angle of a triangle equals the sum of the two non-adjacent interior angles') },
          { id: 'no', label: L("∠AOC va ∠ABC har doim teng", '∠AOC и ∠ABC всегда равны', '∠AOC and ∠ABC are always equal'), hint: L("Teng bo'lsa isbotlashning hojati qolmasdi, aynan shu tenglik isbotlanayotir.", 'Если бы были равны, доказывать было бы нечего, именно это равенство и доказывается.', 'If they were equal there would be nothing to prove, this is exactly the equality being proven.') },
        ],
      },
      {
        text: L("∠AOC markaziy burchak, yoy AC kichik bo'lgani uchun, ∠AOC = yoy AC", '∠AOC, центральный угол, дуга AC малая, поэтому ∠AOC = дуге AC', '∠AOC is a central angle, arc AC is minor, so ∠AOC = arc AC'),
        options: [
          { id: 'ok', right: true, label: L("48-darsdagi qoida, kichik yoy markaziy burchakka to'g'ridan-to'g'ri teng", 'Правило из 48 урока, малая дуга напрямую равна центральному углу', 'The rule from lesson 48, the minor arc directly equals the central angle') },
          { id: 'no', label: L("∠AOC yoyning yarmiga teng", '∠AOC равен половине дуги', '∠AOC equals half the arc'), hint: L("Yarmi ichki chizilgan burchak uchun, markaziy burchak esa to'g'ridan-to'g'ri teng.", 'Половина для вписанного угла, а центральный угол равен напрямую.', 'Half is for the inscribed angle, the central angle is directly equal.') },
        ],
      },
      {
        text: L("shuning uchun 2∠ABC = yoy AC, ya'ni ∠ABC = ½ yoy AC", 'поэтому 2∠ABC = дуге AC, то есть ∠ABC = ½ дуги AC', 'therefore 2∠ABC = arc AC, that is, ∠ABC = ½ arc AC'),
        options: [
          { id: 'ok', right: true, label: L("Ikkinchi va uchinchi qatordan, ikkalasi ham ∠AOC ga teng", 'Из второй и третьей строк, обе равны ∠AOC', 'From the second and third lines, both equal ∠AOC') },
          { id: 'no', label: L("Bu qo'shimcha faraz", 'Это дополнительное предположение', 'This is an extra assumption'), hint: L("Yo'q, bu ikki oldingi qatordan to'g'ridan-to'g'ri kelib chiqadi.", 'Нет, это прямо следует из двух предыдущих строк.', 'No, this follows directly from the two previous lines.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi (birinchi holat uchun). Qolgan ikki holat xuddi shunga o'xshash isbotlanadi.",
      'Доказано (для первого случая). Оставшиеся два случая доказываются похожим образом.',
      'Proven (for the first case). The remaining two cases are proven in a similar way.',
    ),
  },
}

// ============================================================
// EKRAN 5. TIRALGAN YOYNI TOPING (`circlefigure`). Ловушka, uchi
// joylashgan yoy bosilishi (З108).
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'circlefigure',
  tag: 'З108',
  eyebrow: L('TIRALGAN YOYNI TOPING', 'НАЙДИ ДУГУ ОПОРЫ', 'FIND THE SUBTENDED ARC'),
  title: L(
    "∠ACB ichki chizilgan burchak. U tiralgan yoyni bosing",
    'Вписанный угол ∠ACB. Нажми на дугу, на которую он опирается',
    'Inscribed angle ∠ACB. Tap the arc it subtends',
  ),
  audio: [
    A('mount',
      "C nuqta aylanada, CA va CB vatarlar ∠ACB ni hosil qiladi.",
      'Точка C на окружности, хорды CA и CB образуют ∠ACB.',
      'Point C is on the circle, chords CA and CB form ∠ACB.'),
    A('why',
      "Tiralgan yoy C dan farqli tomonda, ya'ni A va B orasidagi kichik yoyda.",
      'Дуга опоры на стороне, не содержащей C, то есть малая дуга между A и B.',
      "The subtended arc is on the side apart from C, that is, the minor arc between A and B."),
  ],
  props: {
    points: { A: 190, B: 350, C: 90 },
    radii: [],
    chords: [['A', 'B'], ['C', 'A'], ['C', 'B']],
    pair: ['A', 'B'],
    target: 'minor',
    ask: L("Kichik yoy AB ni bosing", 'Нажми на малую дугу AB', 'Tap the minor arc AB'),
    hints: {
      major: L("Bu yoy C nuqtani o'z ichiga oladi, tiralgan yoy esa C dan farqli tomonda bo'lishi kerak.", 'Эта дуга содержит точку C, а дуга опоры должна быть на стороне, не содержащей C.', 'This arc contains point C, but the subtended arc should be on the side apart from C.'),
    },
    after: L(
      "To'g'ri. Kichik yoy AB, C nuqtadan farqli tomonda, aynan shu yoyga ∠ACB tiralgan.",
      'Верно. Малая дуга AB, на стороне, не содержащей C, именно на неё опирается ∠ACB.',
      'Correct. The minor arc AB, on the side apart from C, is exactly what ∠ACB subtends.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI MASALA (`twoways`): masala (115-bet) va 440-mashq.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З109',
  eyebrow: L('IKKI MASALA', 'ДВЕ ЗАДАЧИ', 'TWO PROBLEMS'),
  title: L(
    "Ikki xil masalada bir xil yarim nisbat",
    'Одно и то же половинное отношение в двух разных задачах',
    'The same half ratio in two different problems',
  ),
  audio: [
    A('mount',
      "Birinchi masalada aylananing radiusiga teng vatar, markaziy burchagi oltmish daraja.",
      'В первой задаче хорда, равная радиусу окружности, центральный угол шестьдесят градусов.',
      'In the first problem, a chord equal to the radius, the central angle is sixty degrees.'),
    W('w2',
      "Ikkinchi masalada markaziy burchak sakson sakkiz daraja berilgan.",
      'В второй задаче дан центральный угол восемьдесят восемь градусов.',
      'In the second problem, the central angle eighty-eight degrees is given.'),
    W('w4',
      "Ikkalasida ham ichki chizilgan burchak markaziy burchakning yarmi.",
      'В обоих случаях вписанный угол равен половине центрального угла.',
      'In both cases, the inscribed angle is half the central angle.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-MASALA, MARKAZIY 60°', 'ЗАДАЧА 1, ЦЕНТРАЛЬНЫЙ 60°', 'PROBLEM 1, CENTRAL 60°'),
        lead: L(
          "Vatar radiusga teng, markaziy burchak oltmish daraja",
          'Хорда равна радиусу, центральный угол шестьдесят градусов',
          'The chord equals the radius, the central angle is sixty degrees',
        ),
        rows: [
          { text: '60° : 2 = 30°' },
          { text: L("ichki chizilgan burchak o'ttiz daraja", 'вписанный угол тридцать градусов', 'the inscribed angle is thirty degrees'), tone: 'ok' },
        ],
      },
      {
        name: L('2-MASALA, MARKAZIY 88°', 'ЗАДАЧА 2, ЦЕНТРАЛЬНЫЙ 88°', 'PROBLEM 2, CENTRAL 88°'),
        lead: L(
          "Endi markaziy burchak sakson sakkiz daraja",
          'Теперь центральный угол восемьдесят восемь градусов',
          'Now the central angle is eighty-eight degrees',
        ),
        rows: [
          { text: '88° : 2 = 44°' },
          { text: L("ichki chizilgan burchak qirq to'rt daraja", 'вписанный угол сорок четыре градуса', 'the inscribed angle is forty-four degrees'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('HAR SAFAR YARMI', 'КАЖДЫЙ РАЗ ПОЛОВИНА', 'HALF EACH TIME'),
        lead: L(
          "Markaziy burchaklar boshqacha, usul bir xil",
          'Центральные углы разные, способ один',
          'The central angles differ, the method is the same',
        ),
        rows: [{ text: L("ichki chizilgan burchak, bir xil yoyga tiralgan markaziy burchakning yarmi", 'вписанный угол, половина центрального угла на той же дуге', 'the inscribed angle, half the central angle on the same arc'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. UCH QOIDA (`parts`): burchak, yoy, natijalar.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З109',
  eyebrow: L('UCH QISM', 'ТРИ ЧАСТИ', 'THREE PARTS'),
  title: L(
    "Ichki chizilgan burchak qoidasining uch qismi",
    'Три части правила вписанного угла',
    'The three parts of the inscribed-angle rule',
  ),
  audio: [
    A('mount',
      "Qoidani qo'llashda uchta narsa tekshiriladi.",
      'При применении правила проверяются три вещи.',
      'Applying the rule, three things are checked.'),
    W('p2',
      "Avval qaysi yoy tiralgan ekani aniqlanadi, uchi joylashgan yoy emas.",
      'Сначала определяется, какая дуга опоры, не та, где вершина.',
      'First, which arc is the subtended one is determined, not the one with the vertex.'),
    W('p4',
      "Keyin shu yoy ikkiga bo'linadi, ko'paytirilmaydi.",
      'Потом эта дуга делится на два, а не умножается.',
      'Then that arc is divided by two, not multiplied.',
    ),
  ],
  props: {
    tokens: [
      { t: '∠ = ', id: 'mid' },
      { t: '⌒', id: 'a' },
      { t: ' : 2', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Chap tomonda ichki chizilgan burchakning o'zi turadi.",
          'Слева стоит сам вписанный угол.',
          'On the left stands the inscribed angle itself.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "O'ng tomonda, burchak uchidan farqli, qarama-qarshi yoy olinadi.",
          'Справа берётся дуга, противоположная вершине угла.',
          'On the right, the arc opposite the vertex is taken.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Shu yoy ikkiga bo'linadi. Markaziy burchakda bo'linish yo'q edi, bu yerda esa bor.",
          'Эта дуга делится на два. У центрального угла деления не было, а здесь есть.',
          'That arc is divided by two. The central angle had no division, but here there is.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Diametrga tiralgan ichki chizilgan burchak har doim to'qson daraja, chunki diametr yarim aylanani, ya'ni yuz sakson darajani ajratadi, uning yarmi esa to'qson.",
        'Вписанный угол, опирающийся на диаметр, всегда девяносто градусов, потому что диаметр отделяет полуокружность, сто восемьдесят градусов, а её половина девяносто.',
        'An inscribed angle subtending a diameter is always ninety degrees, because the diameter cuts off a semicircle, a hundred eighty degrees, and half of that is ninety.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 36-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З109',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Aylanaga ichki chizilgan burchak",
    'Вписанный угол',
    'The inscribed angle',
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
      { id: 'f1', label: L("uchi aylanada, tomonlari vatar bo'lgan burchak o'ziga qarama-qarshi yoyga tiraladi", 'угол с вершиной на окружности и сторонами-хордами опирается на противоположную дугу', 'an angle with a vertex on the circle and chord sides subtends the opposite arc') },
      { id: 'f2', label: L("ichki chizilgan burchak tiralgan yoyning yarmiga teng", 'вписанный угол равен половине дуги, на которую опирается', 'the inscribed angle equals half the arc it subtends') },
      { id: 'f3', label: L("bir yoyga tiralgan burchaklar teng, diametrga tiralgan burchak esa to'g'ri burchak", 'углы на одной дуге равны, а угол на диаметре прямой', 'angles on the same arc are equal, and the angle on a diameter is right') },
      { id: 'w1', label: L("ichki chizilgan burchak tiralgan yoyga teng", 'вписанный угол равен дуге, на которую опирается', 'the inscribed angle equals the arc it subtends') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Ichki chizilgan burchak yoyga TENG emas, uning YARMIGA teng.",
      'Так не складывается. Вписанный угол не РАВЕН дуге, а равен её ПОЛОВИНЕ.',
      'That does not fit. The inscribed angle is not EQUAL to the arc, it equals HALF of it.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 4-§, 36-mavzu asosida (114-117-bet)",
        'Правило на основе геометрии, § 4, тема 36 учебника (стр. 114-117)',
        'The rule is based on geometry, section 4, topic 36 of the textbook (pages 114-117)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Faqat markazdagi burchak yoy bilan qanday bog'langanini bilardik",
        'Мы знали, как с дугой связан только угол в центре',
        'We knew how the arc relates only to the angle at the centre',
      ),
      right: L(
        "endi aylananing o'zidagi burchak ham yoy bilan bog'langanini bilamiz",
        'теперь мы знаем, что и угол на самой окружности связан с дугой',
        'now we know that an angle on the circle itself is also related to the arc',
      ),
      winner: 'right',
      note: L(
        "Markazda — teng, aylanada — yarmi",
        'В центре — равен, на окружности — половина',
        'At the centre, equal; on the circle, half',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): markaziy burchakdan ichki chizilganini
// topish.
// ============================================================
const ASK_INS = L("Ichki chizilgan burchak necha daraja?", 'Чему равен вписанный угол в градусах?', 'What is the inscribed angle in degrees?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З109',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Markaziy burchakdan ichki chizilgan burchakni hisoblang",
    'Вычисли вписанный угол по центральному',
    'Compute the inscribed angle from the central angle',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida bir xil yoyga tiralgan markaziy burchak berilgan.",
      'Пять заданий. В каждом дан центральный угол на той же дуге.',
      'Five tasks. In each, the central angle on the same arc is given.'),
    A('why',
      "Markaziy burchak ikkiga bo'linadi, ko'paytirilmaydi.",
      'Центральный угол делится на два, не умножается.',
      'The central angle is divided by two, not multiplied.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar markaziy burchak ikkiga bo'lingan.",
      'Все пять разобраны. Каждый раз центральный угол делился на два.',
      'All five are done. Each time the central angle was divided by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'∠O = 88°'}</Row>,
        ok: L("Ha. Sakson sakkiz ikkiga bo'linsa, qirq to'rt.", 'Да. Восемьдесят восемь разделить на два, сорок четыре.', 'Yes. Eighty-eight divided by two is forty-four.'),
        question: ASK_INS,
        items: [
          { id: 'a', right: true, label: '44°' },
          { id: 'b', label: '176°', hint: L("Bu ikkiga ko'paytirilgan, bo'lingani emas.", 'Это умножено на два, а не разделено.', 'That is multiplied by two, not divided.') },
        ],
        solution: ['88 : 2', '44'],
      },
      {
        expr: <Row size="big" align="center">{'∠O = 120°'}</Row>,
        ok: L("Ha. Yuz yigirma ikkiga bo'linsa, oltmish.", 'Да. Сто двадцать разделить на два, шестьдесят.', 'Yes. A hundred twenty divided by two is sixty.'),
        question: ASK_INS,
        items: [
          { id: 'a', right: true, label: '60°' },
          { id: 'b', label: '240°', hint: L("Bu ikkiga ko'paytirilgan, bo'lingani emas.", 'Это умножено на два, а не разделено.', 'That is multiplied by two, not divided.') },
        ],
        solution: ['120 : 2', '60'],
      },
      {
        expr: <Row size="big" align="center">{'∠O = 70°'}</Row>,
        ok: L("Ha. Yetmish ikkiga bo'linsa, o'ttiz besh.", 'Да. Семьдесят разделить на два, тридцать пять.', 'Yes. Seventy divided by two is thirty-five.'),
        question: ASK_INS,
        items: [
          { id: 'a', right: true, label: '35°' },
          { id: 'b', label: '140°', hint: L("Bu ikkiga ko'paytirilgan, bo'lingani emas.", 'Это умножено на два, а не разделено.', 'That is multiplied by two, not divided.') },
        ],
        solution: ['70 : 2', '35'],
      },
      {
        expr: <Row size="big" align="center">{'∠O = 100°'}</Row>,
        ok: L("Ha. Yuz ikkiga bo'linsa, ellik.", 'Да. Сто разделить на два, пятьдесят.', 'Yes. A hundred divided by two is fifty.'),
        question: ASK_INS,
        items: [
          { id: 'a', right: true, label: '50°' },
          { id: 'b', label: '200°', hint: L("Bu ikkiga ko'paytirilgan, bo'lingani emas.", 'Это умножено на два, а не разделено.', 'That is multiplied by two, not divided.') },
        ],
        solution: ['100 : 2', '50'],
      },
      {
        expr: <Row size="big" align="center">{'∠O = 46°'}</Row>,
        ok: L("Ha. Qirq olti ikkiga bo'linsa, yigirma uch.", 'Да. Сорок шесть разделить на два, двадцать три.', 'Yes. Forty-six divided by two is twenty-three.'),
        question: ASK_INS,
        items: [
          { id: 'a', right: true, label: '23°' },
          { id: 'b', label: '92°', hint: L("Bu ikkiga ko'paytirilgan, bo'lingani emas.", 'Это умножено на два, а не разделено.', 'That is multiplied by two, not divided.') },
        ],
        solution: ['46 : 2', '23'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): ichki chizilgandan yoyni topish, va
// diametr holati.
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З109',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ichki chizilgan burchakdan yoyni toping",
    'Найди дугу по вписанному углу',
    'Find the arc from the inscribed angle',
  ),
  audio: [
    A('mount',
      "Endi teskari yo'nalishda, ichki chizilgan burchak berilgan, yoy izlanadi.",
      'Теперь в обратную сторону, дан вписанный угол, ищется дуга.',
      'Now in the reverse direction, the inscribed angle is given, the arc is sought.'),
    A('why',
      "Bu safar ikkiga ko'paytiriladi, chunki yoy burchakdan katta.",
      'На этот раз умножается на два, потому что дуга больше угла.',
      'This time it is multiplied by two, because the arc is bigger than the angle.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ichki chizilgan burchak ikkiga ko'paytirilgan.",
      'Все три разобраны. Каждый раз вписанный угол умножался на два.',
      'All three are done. Each time the inscribed angle was multiplied by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'∠B = 30°'}</Row>,
        ok: L("Ha. O'ttiz ikkiga ko'paytirilsa, oltmish.", 'Да. Тридцать умножить на два, шестьдесят.', 'Yes. Thirty times two is sixty.'),
        question: L("Yoy necha daraja?", 'Чему равна дуга в градусах?', 'What is the arc in degrees?'),
        items: [
          { id: 'a', right: true, label: '60°' },
          { id: 'b', label: '15°', hint: L("Bu ikkiga bo'lingan, ko'paytirilgani emas.", 'Это разделено на два, а не умножено.', 'That is divided by two, not multiplied.') },
        ],
        solution: ['30 · 2', '60'],
      },
      {
        expr: <Row size="big" align="center">{'∠B = 44°'}</Row>,
        ok: L("Ha. Qirq to'rt ikkiga ko'paytirilsa, sakson sakkiz.", 'Да. Сорок четыре умножить на два, восемьдесят восемь.', 'Yes. Forty-four times two is eighty-eight.'),
        question: L("Yoy necha daraja?", 'Чему равна дуга в градусах?', 'What is the arc in degrees?'),
        items: [
          { id: 'a', right: true, label: '88°' },
          { id: 'b', label: '22°', hint: L("Bu ikkiga bo'lingan, ko'paytirilgani emas.", 'Это разделено на два, а не умножено.', 'That is divided by two, not multiplied.') },
        ],
        solution: ['44 · 2', '88'],
      },
      {
        expr: <Row size="big" align="center">{'⌀AB,  C ≠ A, B'}</Row>,
        ok: L("Ha. Diametrga tiralgan ichki chizilgan burchak har doim to'qson daraja, boshqa son kerak emas.", 'Да. Вписанный угол на диаметре всегда девяносто градусов, другое число не нужно.', 'Yes. An inscribed angle on a diameter is always ninety degrees, no other number is needed.'),
        question: L("∠ACB necha daraja?", 'Чему равен ∠ACB в градусах?', 'What is ∠ACB in degrees?'),
        items: [
          { id: 'a', right: true, label: '90°' },
          { id: 'b', label: L("Aniqlab bo'lmaydi", 'Нельзя определить', 'It cannot be determined'), hint: L("Diametrga tiralgan ichki chizilgan burchak C ning aniq o'rniga bog'liq emas.", 'Вписанный угол на диаметре не зависит от точного положения C.', 'An inscribed angle on a diameter does not depend on the exact position of C.') },
        ],
        solution: ['180 : 2', '90'],
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
      "Yoyni ikkiga bo'lib, ichki chizilgan burchak bilan solishtiring.",
      'Раздели дугу на два и сравни с вписанным углом.',
      'Divide the arc by two and compare with the inscribed angle.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash taklif qilingan javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло предложенный ответ.',
      'All three are done. Each time computation checked the proposed answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'⌒ = 120°   →   ∠ = 60°'}</Row>,
        ok: L("Ha. Yuz yigirma ikkiga bo'linsa, oltmish.", 'Да. Сто двадцать разделить на два, шестьдесят.', 'Yes. A hundred twenty divided by two is sixty.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham oltmish chiqadi.", 'Посчитай, ответ действительно выходит шестьдесят.', 'Compute it, the answer really comes to sixty.') },
        ],
        solution: ['120 : 2', '60'],
      },
      {
        expr: <Row size="big" align="center">{'⌒ = 70°   →   ∠ = 140°'}</Row>,
        ok: L("Yo'q. Yetmish ikkiga bo'linsa, o'ttiz besh chiqadi, yuz qirq emas.", 'Нет. Семьдесят разделить на два, выходит тридцать пять, а не сто сорок.', 'No. Seventy divided by two comes to thirty-five, not a hundred forty.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, yetmishning yarmi o'ttiz besh.", 'Посчитай снова, половина семидесяти тридцать пять.', 'Compute it again, half of seventy is thirty-five.') },
        ],
        solution: ['70 : 2', '35'],
      },
      {
        expr: <Row size="big" align="center">{'⌀AB   →   ∠ACB = 90°'}</Row>,
        ok: L("Ha. Diametrga tiralgan ichki chizilgan burchak har doim to'qson daraja.", 'Да. Вписанный угол на диаметре всегда девяносто градусов.', 'Yes. An inscribed angle on a diameter is always ninety degrees.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Diametr yarim aylanani ajratadi, yuz sakson daraja, uning yarmi to'qson.", 'Диаметр отделяет полуокружность, сто восемьдесят градусов, её половина девяносто.', 'The diameter cuts off a semicircle, a hundred eighty degrees, half of that is ninety.') },
        ],
        solution: ['180 : 2', '90'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): uchi joylashgan yoy olingan
// (З108) va yoyga teng deb olingan (З109).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З108',
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
      "Birinchisida noto'g'ri yoy olingan, ikkinchisida yarmi olinmagan.",
      'В первом взята неверная дуга, во втором не взята половина.',
      'In the first, the wrong arc was taken, in the second, half was not taken.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham boshqa-boshqa qoidani chetlab o'tgan.",
      'Обе разобраны. Обе ошибки обошли разные правила.',
      'Both are done. Each mistake bypassed a different rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'⌒BC = 40°,  ⌒BAC = 320°   →   ∠BAC = 160°'}</Row>,
        ok: L("Ha. A uchi joylashgan katta yoy olingan, aslida A dan farqli kichik yoy olinishi kerak edi.", 'Да. Взята большая дуга, где лежит вершина A, а нужно было взять малую дугу, отличную от A.', 'Yes. The major arc, where vertex A lies, was taken, but the minor arc apart from A should have been taken.'),
        question: L("∠BAC uchun yuqoridagicha hisoblangan bo'lsa, bu yerda xato qayerda?", 'Если для ∠BAC посчитано как выше, в чём здесь ошибка?', 'If for ∠BAC it was computed as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("A uchi joylashgan yoy olingan, qarama-qarshi yoy emas", 'Взята дуга, где лежит вершина A, а не противоположная', 'The arc where vertex A lies was taken, not the opposite one') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, yoy BC qirq daraja olinishi kerak edi, uch yuz yigirma emas.", 'Это и есть показанная ошибка, нужно было взять дугу BC сорок градусов, а не триста двадцать.', 'This is the very mistake shown; arc BC forty degrees should have been taken, not three hundred twenty.') },
        ],
        solution: ['40 : 2', '20'],
      },
      {
        expr: <Row size="big" align="center">{'⌒ = 100°   →   ∠ = 100°'}</Row>,
        ok: L("Ha. Yuzning yarmi ellik bo'lishi kerak, ichki chizilgan burchak yoyga teng emas.", 'Да. Половина ста должна быть пятьдесят, вписанный угол не равен дуге.', 'Yes. Half of a hundred should be fifty, the inscribed angle is not equal to the arc.'),
        question: L("Yoy yuz daraja bo'lsa, va ichki chizilgan burchak yuqoridagicha olingan bo'lsa, bu yerda xato qayerda?", 'Если дуга сто градусов, а вписанный угол взят как выше, в чём здесь ошибка?', 'If the arc is a hundred degrees, and the inscribed angle was taken as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Yoy ikkiga bo'linmagan, unga teng olingan", 'Дуга не поделена на два, взята равной ей', 'The arc was not divided by two, it was taken equal to it') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, ichki chizilgan burchak ellik bo'lishi kerak.", 'Это и есть показанная ошибка, вписанный угол должен быть пятьдесят.', 'This is the very mistake shown; the inscribed angle should be fifty.') },
        ],
        solution: ['100 : 2', '50'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): 439-mashq uslubida.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З109',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Diametr va nisbatdan burchakni qadamlab toping",
    'Найди угол по диаметру и отношению, по шагам',
    'Find the angle from the diameter and the ratio, step by step',
  ),
  audio: [
    A('mount',
      "AB diametr, AC va CB yoylarning nisbati berilgan. Avval CB yoyi topiladi, keyin yarmi olinadi.",
      'AB диаметр, дано отношение дуг AC и CB. Сначала находится дуга CB, потом берётся половина.',
      'AB is a diameter, the ratio of arcs AC and CB is given. First arc CB is found, then half is taken.'),
    A('why',
      "Yig'indi har doim yuz sakson, chunki AB diametr.",
      'Сумма всегда сто восемьдесят, потому что AB диаметр.',
      'The sum is always a hundred eighty, because AB is a diameter.',
    ),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar CB yoyi topilib, yarmi olingan.",
      'Все три заполнены. Каждый раз находилась дуга CB, бралась половина.',
      'All three are filled. Each time arc CB was found, half was taken.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['40', '20'],
      lines: [
        [{ t: 'AC : CB = 7 : 2   →   CB = ' }, { slot: '40' }, { t: '°   →   ∠BAC = ' }, { slot: '20' }, { t: '°' }],
      ],
    },
    tasks: [
      {
        chips: ['60', '30'],
        lines: [
          [{ t: 'AC : CB = 2 : 1   →   CB = ' }, { slot: '60' }, { t: '°   →   ∠BAC = ' }, { slot: '30' }, { t: '°' }],
        ],
      },
      {
        chips: ['90', '45'],
        lines: [
          [{ t: 'AC : CB = 1 : 1   →   CB = ' }, { slot: '90' }, { t: '°   →   ∠BAC = ' }, { slot: '45' }, { t: '°' }],
        ],
      },
      {
        chips: ['36', '18'],
        lines: [
          [{ t: 'AC : CB = 4 : 1   →   CB = ' }, { slot: '36' }, { t: '°   →   ∠BAC = ' }, { slot: '18' }, { t: '°' }],
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
    "Ichki chizilgan burchak bo'yicha to'rt savol",
    'Четыре вопроса о вписанном угле',
    'Four questions about the inscribed angle',
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
        id: 'q1', tag: 'З108',
        ask: L('∠BAC, uchi A bo\'lsa, u qaysi yoyga tiraladi?', 'Если вершина ∠BAC — точка A, на какую дугу он опирается?', 'If the vertex of ∠BAC is point A, which arc does it subtend?'),
        options: [
          { id: 'ok', right: true, label: L('BC, A dan farqli', 'BC, отличную от A', 'BC, apart from A') },
          { id: 'no', label: L('BAC, A orqali', 'BAC, через A', 'BAC, through A') },
        ],
        hint: L("Tiralgan yoy uchidan farqli, qarama-qarshi tomonda bo'ladi.", 'Дуга опоры на стороне, не содержащей вершину.', 'The subtended arc is on the side apart from the vertex.'),
        ok: L("To'g'ri, A dan farqli tomondagi yoy.", 'Верно, дуга на стороне, не содержащей A.', 'Correct, the arc on the side apart from A.'),
      },
      {
        id: 'q2', tag: 'З109',
        ask: L('Markaziy burchak 130°. Bir xil yoyga tiralgan ichki chizilgan burchak qancha?', 'Центральный угол 130°. Чему равен вписанный угол на той же дуге?', 'The central angle is 130°. What is the inscribed angle on the same arc?'),
        options: [
          { id: 'ok', right: true, label: '65°' },
          { id: 'no', label: '260°' },
        ],
        hint: L("Ikkiga bo'ling, ko'paytirmang.", 'Раздели на два, не умножай.', 'Divide by two, do not multiply.'),
        ok: L("To'g'ri, yuz o'ttizning yarmi oltmish besh.", 'Верно, половина ста тридцати шестьдесят пять.', 'Correct, half of a hundred thirty is sixty-five.'),
      },
      {
        id: 'q3', tag: 'З109',
        ask: L('AB diametr, C aylanada, A va B dan farqli. ∠ACB qancha?', 'AB диаметр, C на окружности, отличная от A и B. Чему равен ∠ACB?', 'AB is a diameter, C is on the circle, apart from A and B. What is ∠ACB?'),
        options: [
          { id: 'ok', right: true, label: '90°' },
          { id: 'no', label: L("Aniqlab bo'lmaydi", 'Нельзя определить', 'It cannot be determined') },
        ],
        hint: L("Diametrga tiralgan ichki chizilgan burchak har doim to'g'ri burchak.", 'Вписанный угол на диаметре всегда прямой.', 'An inscribed angle on a diameter is always right.'),
        ok: L("To'g'ri, to'qson daraja.", 'Верно, девяносто градусов.', 'Correct, ninety degrees.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('100 ikkiga bo\'linsa, 50 chiqadimi?', 'Верно ли, что 100, делённое на два, равно 50?', 'Is it true that 100 divided by two equals 50?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, natija ellik chiqadi.", 'Посчитай, результат пятьдесят.', 'Compute it, the result is fifty.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З109',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Markaziy burchak 96° bo'lgan yoyga tiralgan ichki chizilgan burchakni yig'ing.",
            'Собери вписанный угол на дуге с центральным углом 96°.',
            'Assemble the inscribed angle on an arc with central angle 96°.',
          ),
          lines: [
            [{ t: '96° : 2 = ' }, { slot: '48' }, { t: '°' }],
          ],
          tiles: [
            { id: 't1', v: '48', x: 12, y: 12 },
            { id: 't2', v: '192', x: 60, y: 14 },
            { id: 't3', v: '96', x: 30, y: 50 },
            { id: 't4', v: '44', x: 78, y: 48 },
          ],
          hint: L(
            "To'qson oltini ikkiga bo'ling.",
            'Раздели девяносто шесть на два.',
            'Divide ninety-six by two.',
          ),
          doneNote: L(
            "Yig'ildi. Ichki chizilgan burchak qirq sakkiz daraja chiqdi.",
            'Собрано. Вписанный угол вышел сорок восемь градусов.',
            'Assembled. The inscribed angle comes out to forty-eight degrees.',
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
    "Qarama-qarshi yoy, va uning yarmi",
    'Противоположная дуга, и её половина',
    'The opposite arc, and half of it',
  ),
  audio: [
    A('s0',
      "Darsdan bitta rasm qoladi. Uchi aylanada, tomonlari vatar, qarshisida yoy.",
      'С урока остаётся один рисунок. Вершина на окружности, стороны хорды, напротив дуга.',
      'One picture stays with you. The vertex on the circle, the sides chords, the arc opposite.'),
    A('s1',
      "Bugun uch narsa qilindi. Teoremani isbotladingiz, tiralgan yoyni chertyozhda topdingiz va diametr holatini bildingiz.",
      'Сегодня сделано три вещи. Ты доказал теорему, нашёл дугу опоры на чертеже, и узнал случай диаметра.',
      'Three things are done today. You proved the theorem, found the subtended arc on a drawing, and learned the diameter case.'),
    A('s2',
      "Keyingi darsda aylanaga ichki va tashqi chizilgan aylanalar, jumladan uchburchakning maxsus nuqtalari.",
      'В следующем уроке вписанная и описанная окружности, в том числе особые точки треугольника.',
      'The next lesson covers the inscribed and circumscribed circles, including the special points of a triangle.',
    ),
  ],
  props: {
    mark: L("∠ = yoy : 2", '∠ = дуга : 2', '∠ = arc : 2'),
    markNote: L(
      "markaziy 88° → ichki chizilgan 44°; diametr → 90°",
      'центральный 88° → вписанный 44°; диаметр → 90°',
      'central 88° → inscribed 44°; diameter → 90°',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: ichki va tashqi chizilgan aylanalar",
      'Следующий урок: вписанная и описанная окружности',
      'Next lesson: the inscribed and circumscribed circles',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
