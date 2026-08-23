// ============================================================================
// 8-sinf, Dars 50. TO'G'RI CHIZIQ BILAN AYLANANING O'ZARO JOYLASHISHI.
// AYLANAGA URINMA.
//
// BLOK Б7, AYLANA QISMI DAVOM ETADI. Bu fayl, FAQAT MA'LUMOT. Mexanika
// `screens.jsx`, `prooflines.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da.
// YANGI PRIBOR YO'Q — `ProofLines` (dars 37+) qayta ishlatilgan. Bu darsda
// `CircleFigure` ishlatilmadi: mavzu chiziq va aylananing joylashishi haqida,
// aylana nuqtalari orasidagi yoy haqida emas, shuning uchun boshqa mexanika
// tabiiyroq.
//
// MANBA: 8-sinf geometriya darsligi, 4-§ (AYLANA), 35-mavzu (111-113-bet):
//   - Uch holat: d — markazdan to'g'ri chiziqqacha masofa, R — radius.
//     1) d > R: umumiy nuqta yo'q; 2) d = R: bitta umumiy nuqta (urinma);
//     3) d < R: ikkita umumiy nuqta (kesuvchi). Kesuvchi vatarining
//     uzunligi AB = 2·kvadrat ildiz(R² − d²);
//   - Ta'rif: aylana bilan faqat bitta umumiy nuqtaga ega to'g'ri chiziq
//     urinma, umumiy nuqtasi urinish nuqtasi;
//   - 1-teorema: urinma shu urinish nuqtasiga o'tkazilgan radiusga
//     perpendikulyar. Isbot: OA, l dagi boshqa istalgan nuqtagacha bo'lgan
//     masofalarning eng qisqasi (chunki boshqa nuqtalar aylanadan
//     tashqarida), eng qisqa masofa esa perpendikulyar orqali topiladi;
//   - 2-teorema (urinmaning alomati, teskari teorema): radiusga
//     perpendikulyar va uning aylanadagi uchidan o'tuvchi to'g'ri chiziq
//     shu aylanaga urinadi;
//   - 427-mashq: aylanadan tashqaridagi bir nuqtadan o'tkazilgan ikkita
//     urinmaning urinish nuqtalarigacha bo'lgan kesmalari teng (AOB≅AOC,
//     katet OB=OC=R, gipotenuza OA umumiy);
//   - 424-mashq: R va d turli birliklarda berilgan (dm, sm, mm aralash),
//     solishtirishdan oldin bir xil birlikka keltirish kerak.
//
// ADASHISHLAR, ikkitasi yangi:
//   З106, d va R solishtirilganda birliklar bir xilga keltirilmagan;
//   З107, d = R holati kesuvchi (ikki umumiy nuqta) deb hisoblangan, aslida
//   bu urinma (bitta umumiy nuqta);
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
  id: 'geo-8-50',
  n: 50,
  row: 55,
  block: 'Б7',
  topic: L("To'g'ri chiziq va aylana, urinma", 'Прямая и окружность, касательная', 'The line and the circle, the tangent'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Markazdan to'g'ri chiziqqacha masofa d radiusdan katta bo'lsa, umumiy nuqta yo'q; teng bo'lsa, aylana urinadi (bitta nuqta); kichik bo'lsa, ikkita umumiy nuqta bor",
    'Если расстояние от центра до прямой d больше радиуса, общих точек нет; если равно, окружность касается (одна точка); если меньше, точек две',
    "If the distance from the centre to the line d is greater than the radius, there is no common point; if equal, the circle is tangent (one point); if less, there are two common points",
  ),
  L(
    "Aylanaga urinma shu urinish nuqtasiga o'tkazilgan radiusga perpendikulyar",
    'Касательная к окружности перпендикулярна радиусу, проведённому в точку касания',
    'A tangent to a circle is perpendicular to the radius drawn to the point of tangency',
  ),
  L(
    "Aylanadan tashqaridagi bir nuqtadan o'tkazilgan ikki urinmaning uzunliklari teng",
    'Длины двух касательных, проведённых из одной внешней точки, равны',
    'The lengths of two tangents drawn from the same external point are equal',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З106': {
    what: L(
      "d va R solishtirilganda birliklar bir xilga keltirilmagan",
      'при сравнении d и R не приведены к одной единице измерения',
      'when comparing d and R, they were not converted to the same unit',
    ),
    wrong: null,
    at: 12,
  },
  'З107': {
    what: L(
      "d = R holati kesuvchi (ikki umumiy nuqta) deb hisoblangan, aslida bu urinma (bitta umumiy nuqta)",
      'случай d = R принят за секущую (две общие точки), а на самом деле это касательная (одна общая точка)',
      'the case d = R was taken as a secant (two common points), but it is actually a tangent (one common point)',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (4-ekran, ProofLines). l chiziqning bir qismi
// (A, A1), O markaz, radius OA.
// ============================================================
const TAN_PTS = { A: [55, 20], A1: [95, 15], O: [55, 85] }
const TAN_ORDER = ['A', 'A1']

// ============================================================
// SAHNALAR (§6). Xuk: uch xil joylashish. Yakun: d va R solishtiriladi.
// ============================================================
const SC_ASK = L("TO'G'RI CHIZIQ VA AYLANA", 'ПРЯМАЯ И ОКРУЖНОСТЬ', 'THE LINE AND THE CIRCLE')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <circle cx="175" cy="65" r="26" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <line x1="140" y1="65" x2="220" y2="65" stroke={T.ink4} strokeWidth="1.2" strokeDasharray="3,2"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="175" cy="65" r="11" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.2"/>
        <text x="175" y="69" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "d > R: yo'q; d = R: bitta; d < R: ikkita",
      'd > R: нет; d = R: одна; d < R: две',
      'd > R: none; d = R: one; d < R: two',
    )}>
      <circle cx="185" cy="65" r="24" fill="none" stroke={T.ok} strokeWidth="1.6"/>
      <line x1="185" y1="41" x2="230" y2="41" stroke={T.ok} strokeWidth="1.4"/>
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
  eyebrow: L("TO'G'RI CHIZIQ VA AYLANA", 'ПРЯМАЯ И ОКРУЖНОСТЬ', 'THE LINE AND THE CIRCLE'),
  title: L(
    "Radius besh, markazdan chiziqqacha masofa ham besh. Chiziq aylana bilan nechta umumiy nuqtaga ega",
    'Радиус пять, расстояние от центра до прямой тоже пять. Сколько общих точек у прямой с окружностью',
    'The radius is five, the distance from the centre to the line is also five. How many common points does the line have with the circle',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "To'g'ri chiziq va aylananing bir-biriga nisbatan uch xil joylashishi mumkin.",
      'Прямая и окружность могут располагаться друг относительно друга трёмя разными способами.',
      'A line and a circle can be positioned relative to each other in three different ways.'),
    A('why',
      "Taxmin qiling, masofa radiusga teng bo'lganda nima bo'ladi.",
      'Предположи, что происходит, когда расстояние равно радиусу.',
      'Predict what happens when the distance equals the radius.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, bunda nechta umumiy nuqta bo'ladi?",
      'Как думаешь, сколько будет общих точек?',
      'What do you think, how many common points will there be?',
    ),
    items: [
      { id: 'a', show: '0' },
      { id: 'b', show: '1' },
      { id: 'c', show: '2' },
      { id: 'd', show: L("Aniqlab bo'lmaydi", 'Нельзя определить', 'It cannot be determined') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Nuqtadan chiziqqacha eng qisqa masofa.
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Nuqtadan chiziqqacha eng qisqa masofani eslash",
    'Вспоминаем наименьшее расстояние от точки до прямой',
    'Recalling the shortest distance from a point to a line',
  ),
  audio: [
    A('mount',
      "Nuqtadan to'g'ri chiziqqacha ko'plab kesma o'tkazish mumkin.",
      'От точки до прямой можно провести много отрезков.',
      'Many segments can be drawn from a point to a line.'),
    A('why',
      "Ular orasida faqat bittasi eng qisqa bo'ladi.",
      'Среди них только один самый короткий.',
      'Among them, only one is the shortest.'),
  ],
  props: {
    ask: L(
      "Nuqtadan to'g'ri chiziqqacha eng qisqa masofa qaysi kesma bilan topiladi?",
      'Каким отрезком находится наименьшее расстояние от точки до прямой?',
      'Which segment gives the shortest distance from a point to a line?',
    ),
    items: [
      { id: 'right', show: L("Chiziqqa perpendikulyar kesma", 'Отрезок, перпендикулярный прямой', 'The segment perpendicular to the line'), right: true, name: L("perpendikulyar eng qisqa", 'перпендикуляр самый короткий', 'the perpendicular is the shortest') },
      {
        id: 'wrong', show: L("Chiziqqa istalgan qiyshiq kesma", 'Любой наклонный отрезок к прямой', 'Any slanted segment to the line'),
        hint: L("Qiyshiq kesma perpendikulyardan doim uzunroq bo'ladi.", 'Наклонный отрезок всегда длиннее перпендикуляра.', 'A slanted segment is always longer than the perpendicular.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun aynan shu perpendikulyar masofa d bo'ladi.",
      'Верно. Сегодня именно это перпендикулярное расстояние станет d.',
      'Correct. Today exactly this perpendicular distance becomes d.',
    ),
  },
}

// ============================================================
// EKRAN 3. UCH HOLAT (`pick`). Ловушка, d=R kesuvchi deb olinishi (З107).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З107',
  eyebrow: L('UCH HOLAT', 'ТРИ СЛУЧАЯ', 'THREE CASES'),
  title: L(
    "Masofa d radiusga teng bo'lsa, nechta umumiy nuqta bo'ladi",
    'Если расстояние d равно радиусу, сколько общих точек',
    'If the distance d equals the radius, how many common points are there',
  ),
  audio: [
    A('mount',
      "Uch holat bor, d radiusdan katta, teng yoki kichik bo'lishi mumkin.",
      'Есть три случая, d может быть больше, равно или меньше радиуса.',
      'There are three cases, d can be greater than, equal to, or less than the radius.'),
    A('why',
      "Masofa radiusga teng bo'lgan holat o'zgacha, u aynan bitta umumiy nuqta beradi, ikkita emas.",
      'Случай, когда расстояние равно радиусу, особый, он даёт ровно одну общую точку, а не две.',
      'The case where the distance equals the radius is special, it gives exactly one common point, not two.'),
  ],
  props: {
    ask: L(
      "d = R bo'lsa, to'g'ri chiziq bilan aylananing nechta umumiy nuqtasi bo'ladi?",
      'Если d = R, сколько общих точек у прямой с окружностью?',
      'If d = R, how many common points does the line have with the circle?',
    ),
    items: [
      { id: 'right', show: '1', right: true, name: L("bu urinma holati", 'это случай касательной', 'this is the tangent case') },
      {
        id: 'wrong1', show: '2',
        hint: L("Ikkita umumiy nuqta faqat d radiusdan KICHIK bo'lganda bo'ladi.", 'Две общие точки только когда d МЕНЬШЕ радиуса.', 'Two common points only happen when d is LESS THAN the radius.'),
      },
      {
        id: 'wrong2', show: '0',
        hint: L("Umumiy nuqta yo'qligi faqat d radiusdan KATTA bo'lganda bo'ladi.", 'Общих точек нет только когда d БОЛЬШЕ радиуса.', 'No common points only happen when d is GREATER THAN the radius.'),
      },
    ],
    after: L(
      "To'g'ri, bitta. Bu chiziq aylanaga urinadi, u urinma deyiladi.",
      'Верно, одна. Эта прямая касается окружности, она называется касательной.',
      'Correct, one. This line touches the circle, it is called a tangent.',
    ),
  },
}

// ============================================================
// EKRAN 4. TEOREMANI ISBOTLAYMIZ (`prooflines`). 1-teorema, 112-bet.
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З107',
  eyebrow: L('TEOREMANI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ТЕОРЕМУ', 'PROVING THE THEOREM'),
  title: L(
    "Urinma urinish nuqtasiga o'tkazilgan radiusga perpendikulyar",
    'Касательная перпендикулярна радиусу, проведённому в точку касания',
    'The tangent is perpendicular to the radius drawn to the point of tangency',
  ),
  audio: [
    A('mount',
      "l to'g'ri chiziq aylanaga A nuqtada urinadi, O markaz.",
      'Прямая l касается окружности в точке A, O центр.',
      'Line l touches the circle at point A, O is the centre.'),
    A('why',
      "l dagi A dan farqli har qanday nuqta aylanadan tashqarida, shuning uchun OA eng qisqa masofa.",
      'Любая точка l, отличная от A, лежит вне окружности, поэтому OA это наименьшее расстояние.',
      'Any point of l other than A lies outside the circle, so OA is the shortest distance.'),
  ],
  props: {
    points: TAN_PTS,
    order: TAN_ORDER,
    marks: [['O', 'A']],
    given: [
      L("l, aylanaga A nuqtada urinadigan to'g'ri chiziq, O — markaz", 'l, прямая, касающаяся окружности в точке A, O — центр', 'l, a line tangent to the circle at point A, O the centre'),
    ],
    goal: L("OA ⊥ l", 'OA ⊥ l', 'OA ⊥ l'),
    lines: [
      {
        text: L("l dagi A dan farqli har qanday A1 nuqta aylanadan tashqarida yotadi", 'любая точка A1 прямой l, отличная от A, лежит вне окружности', 'any point A1 of line l other than A lies outside the circle'),
        options: [
          { id: 'ok', right: true, label: L("Shartga ko'ra, l aylana bilan faqat A nuqtada umumiy, boshqa hech qayerda", 'По условию, l имеет с окружностью общей только точку A, больше нигде', 'By the condition, l shares only point A with the circle, nowhere else') },
          { id: 'no', label: L("Bu chizmadan shunday ko'rinadi", 'Так видно на чертеже', 'That is how it looks on the drawing'), hint: L("Ko'rinish sabab emas, bu urinma ta'rifining o'zidan kelib chiqadi.", 'Внешний вид не причина, это следует из самого определения касательной.', 'Appearance is not the reason, it follows from the very definition of the tangent.') },
        ],
      },
      {
        text: L("shuning uchun OA1 > OA, ya'ni OA masofalarning eng qisqasi", 'поэтому OA1 > OA, то есть OA — наименьшее из расстояний', 'therefore OA1 > OA, that is, OA is the shortest of the distances'),
        options: [
          { id: 'ok', right: true, label: L("A1 tashqarida, demak OA1 radiusdan katta, OA esa aynan radius", 'A1 снаружи, значит OA1 больше радиуса, а OA равно радиусу', 'A1 is outside, so OA1 is greater than the radius, while OA equals the radius') },
          { id: 'no', label: L("OA va OA1 har doim teng", 'OA и OA1 всегда равны', 'OA and OA1 are always equal'), hint: L("Teng bo'lsa, A1 ham aylanada bo'lardi, shartga ko'ra esa u tashqarida.", 'Если были бы равны, A1 тоже был бы на окружности, а по условию он снаружи.', 'If they were equal, A1 would also be on the circle, but by the condition it is outside.') },
        ],
      },
      {
        text: L("nuqtadan chiziqqacha eng qisqa masofa perpendikulyar orqali topiladi, shuning uchun OA ⊥ l", 'наименьшее расстояние от точки до прямой находится через перпендикуляр, поэтому OA ⊥ l', 'the shortest distance from a point to a line is found through the perpendicular, so OA ⊥ l'),
        options: [
          { id: 'ok', right: true, label: L("Bu ikkinchi ekranda eslangan xossaning o'zi", 'Это то самое свойство, вспомненное на втором экране', 'This is exactly the property recalled on the second screen') },
          { id: 'no', label: L("Bu qo'shimcha faraz", 'Это дополнительное предположение', 'This is an extra assumption'), hint: L("Yo'q, bu nuqtadan chiziqqacha eng qisqa masofa haqidagi ma'lum xossa.", 'Нет, это известное свойство наименьшего расстояния от точки до прямой.', 'No, this is the known property about the shortest distance from a point to a line.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. Urinma har doim urinish nuqtasiga o'tkazilgan radiusga perpendikulyar.",
      'Доказано. Касательная всегда перпендикулярна радиусу, проведённому в точку касания.',
      'Proven. The tangent is always perpendicular to the radius drawn to the point of tangency.',
    ),
  },
}

// ============================================================
// EKRAN 5. IKKI URINMA TENG (`twoways`): 427-mashq.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З107',
  eyebrow: L('IKKI URINMA TENG', 'ДВЕ КАСАТЕЛЬНЫЕ РАВНЫ', 'THE TWO TANGENTS ARE EQUAL'),
  title: L(
    "Bir nuqtadan o'tkazilgan ikki urinma nima uchun teng",
    'Почему две касательные из одной точки равны',
    'Why two tangents from the same point are equal',
  ),
  audio: [
    A('mount',
      "A nuqtadan aylanaga ikkita urinma o'tkazilgan, B va C urinish nuqtalari.",
      'Из точки A к окружности проведены две касательные, B и C точки касания.',
      'From point A, two tangents are drawn to the circle, B and C the points of tangency.'),
    W('w2',
      "AOB va AOC uchburchaklar to'g'ri burchakli, OB va OC radiuslar teng.",
      'Треугольники AOB и AOC прямоугольные, радиусы OB и OC равны.',
      'Triangles AOB and AOC are right triangles, radii OB and OC are equal.'),
    W('w4',
      "Ikkalasida ham gipotenuza OA umumiy, shuning uchun uchburchaklar teng.",
      'В обоих общая гипотенуза OA, поэтому треугольники равны.',
      'Both share the hypotenuse OA, so the triangles are congruent.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('UCHBURCHAK AOB', 'ТРЕУГОЛЬНИК AOB', 'TRIANGLE AOB'),
        lead: L(
          "To'g'ri burchakli, katet OB radius, gipotenuza OA",
          'Прямоугольный, катет OB радиус, гипотенуза OA',
          'Right-angled, leg OB is the radius, hypotenuse OA',
        ),
        rows: [{ text: L("katet OB, gipotenuza OA", 'катет OB, гипотенуза OA', 'leg OB, hypotenuse OA'), tone: 'ok' }],
      },
      {
        name: L('UCHBURCHAK AOC', 'ТРЕУГОЛЬНИК AOC', 'TRIANGLE AOC'),
        lead: L(
          "To'g'ri burchakli, katet OC radius, gipotenuza xuddi shu OA",
          'Прямоугольный, катет OC радиус, та же самая гипотенуза OA',
          'Right-angled, leg OC is the radius, the very same hypotenuse OA',
        ),
        rows: [{ text: L("katet OC, gipotenuza OA", 'катет OC, гипотенуза OA', 'leg OC, hypotenuse OA'), tone: 'ok' }],
      },
      {
        tone: 'sum',
        name: L('IKKALASI TENG', 'ОБА РАВНЫ', 'BOTH ARE CONGRUENT'),
        lead: L(
          "Katet va gipotenuzaga ko'ra teng, shuning uchun AB = AC",
          'Равны по катету и гипотенузе, поэтому AB = AC',
          'Congruent by the leg and the hypotenuse, so AB = AC',
        ),
        rows: [{ text: L("OB = OC, OA umumiy, demak AB = AC", 'OB = OC, OA общая, значит AB = AC', 'OB = OC, OA shared, so AB = AC'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 6. KESUVCHI VATARI (`parts`): AB = 2·kv.ildiz(R²−d²).
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З106',
  eyebrow: L('KESUVCHI VATARINING UZUNLIGI', 'ДЛИНА ХОРДЫ СЕКУЩЕЙ', 'THE LENGTH OF THE SECANT\'S CHORD'),
  title: L(
    "Kesuvchining aylana ichidagi qismi",
    'Часть секущей внутри окружности',
    "The secant's part inside the circle",
  ),
  audio: [
    A('mount',
      "Kesuvchi aylana ichida vatar hosil qiladi, uning uzunligi R va d orqali topiladi.",
      'Секущая образует внутри окружности хорду, её длина находится через R и d.',
      'A secant forms a chord inside the circle, its length is found through R and d.'),
    W('p2',
      "Avval R² dan d² ayriladi, bu 49-darsdagi vatarning yarmi.",
      'Сначала из R² вычитается d², это половина хорды из 49 урока.',
      'First d² is subtracted from R², this is the half-chord from lesson 49.'),
    W('p4',
      "Ildiz olingandan keyin, natija ikkiga ko'paytiriladi, chunki bu yarim vatar edi.",
      'После извлечения корня результат умножается на два, потому что это была половина хорды.',
      'After taking the root, the result is multiplied by two, because it was half the chord.',
    ),
  ],
  props: {
    tokens: [
      { t: 'AB = 2 · ', id: 'mid' },
      { t: '√(R² − d²)', id: 'a' },
      { t: '  (R, d)', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Formulaning boshida ikkiga ko'paytirish turadi, chunki AB to'liq vatar.",
          'В начале формулы умножение на два, потому что AB это вся хорда.',
          'At the start of the formula stands multiplication by two, because AB is the whole chord.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Ildiz ostida R kvadratidan d kvadrati ayriladi, bu yarim vatarning o'zi.",
          'Под корнем из квадрата R вычитается квадрат d, это и есть половина хорды.',
          'Under the root, d squared is subtracted from R squared, this is exactly the half-chord.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "R va d albatta bir xil birlikda bo'lishi kerak, aks holda hisoblash noto'g'ri chiqadi.",
          'R и d обязательно должны быть в одной единице измерения, иначе вычисление будет неверным.',
          'R and d must be in the same unit, otherwise the computation comes out wrong.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Bu formula darslikda o'quvchiga mustaqil isbotlash uchun qoldirilgan, chunki u 49-darsdagi vatar formulasidan to'g'ridan-to'g'ri kelib chiqadi.",
        'Эта формула в учебнике оставлена ученику для самостоятельного доказательства, потому что она напрямую следует из формулы хорды 49 урока.',
        'This formula is left in the textbook for the student to prove independently, because it follows directly from the chord formula of lesson 49.',
      ),
    },
  },
}

// ============================================================
// EKRAN 7. BIRLIKLARNI SOLISHTIRISH (`twoways`): 424-mashq uslubida.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З106',
  eyebrow: L('AVVAL BIR XIL BIRLIKKA', 'СНАЧАЛА К ОДНОЙ ЕДИНИЦЕ', 'FIRST TO ONE UNIT'),
  title: L(
    "R va d turli birlikda berilganda avval nima qilinadi",
    'Что делается сначала, когда R и d даны в разных единицах',
    'What is done first when R and d are given in different units',
  ),
  audio: [
    A('mount',
      "Birinchi holatda radius 4 santimetr, masofa 40 millimetr.",
      'В первом случае радиус четыре сантиметра, расстояние сорок миллиметров.',
      'In the first case, the radius is four centimetres, the distance is forty millimetres.'),
    W('w2',
      "Qirq millimetr to'rt santimetrga teng, shuning uchun masofa radiusga teng, bu urinma.",
      'Сорок миллиметров равно четырём сантиметрам, поэтому расстояние равно радиусу, это касательная.',
      'Forty millimetres equals four centimetres, so the distance equals the radius, this is a tangent.'),
    W('w4',
      "Ikkinchi holatda radius olti santimetr, masofa yetmish millimetr, bu yetti santimetr, demak d radiusdan katta.",
      'Во втором случае радиус шесть сантиметров, расстояние семьдесят миллиметров, это семь сантиметров, значит d больше радиуса.',
      'In the second case, the radius is six centimetres, the distance is seventy millimetres, that is seven centimetres, so d is greater than the radius.',
    ),
  ],
  props: {
    stepMs: 1600,
    blocks: [
      {
        name: L('R=4 SM, d=40 MM', 'R=4 СМ, d=40 МM', 'R=4 CM, d=40 MM'),
        lead: L(
          "Qirq millimetrni santimetrga aylantiramiz",
          'Переводим сорок миллиметров в сантиметры',
          'We convert forty millimetres to centimetres',
        ),
        rows: [
          { text: '40 mm = 4 sm' },
          { text: L("d = R, bu urinma", 'd = R, это касательная', 'd = R, this is a tangent'), tone: 'ok' },
        ],
      },
      {
        name: L('R=6 SM, d=70 MM', 'R=6 СМ, d=70 МM', 'R=6 CM, d=70 MM'),
        lead: L(
          "Yetmish millimetrni santimetrga aylantiramiz",
          'Переводим семьдесят миллиметров в сантиметры',
          'We convert seventy millimetres to centimetres',
        ),
        rows: [
          { text: '70 mm = 7 sm' },
          { text: L("d > R, umumiy nuqta yo'q", 'd > R, общих точек нет', 'd > R, there is no common point'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('AVVAL BIRLIK, KEYIN SOLISHTIRISH', 'СНАЧАЛА ЕДИНИЦА, ПОТОМ СРАВНЕНИЕ', 'UNIT FIRST, THEN COMPARISON'),
        lead: L(
          "Solishtirishdan oldin har doim bir xil birlikka keltiriladi",
          'Перед сравнением всегда приводят к одной единице измерения',
          'Before comparing, they are always converted to the same unit',
        ),
        rows: [{ text: L("birlik almashtirilmasa, xulosa xato bo'ladi", 'без перевода единиц вывод будет ошибочным', 'without converting units, the conclusion will be wrong'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 35-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З106',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "To'g'ri chiziq, aylana va urinma",
    'Прямая, окружность и касательная',
    'The line, the circle, and the tangent',
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
      { id: 'f1', label: L("d > R bo'lsa umumiy nuqta yo'q, d = R bo'lsa bitta (urinma), d < R bo'lsa ikkita", 'd > R — нет общих точек, d = R — одна (касательная), d < R — две', 'd > R, no common point; d = R, one (tangent); d < R, two') },
      { id: 'f2', label: L("urinma urinish nuqtasiga o'tkazilgan radiusga perpendikulyar", 'касательная перпендикулярна радиусу в точке касания', 'the tangent is perpendicular to the radius at the point of tangency') },
      { id: 'f3', label: L("bir nuqtadan o'tkazilgan ikki urinma teng", 'две касательные из одной точки равны', 'two tangents from the same point are equal') },
      { id: 'w1', label: L("d = R bo'lsa, chiziq ikkita nuqtada kesib o'tadi", 'если d = R, прямая пересекает в двух точках', 'if d = R, the line crosses at two points') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Masofa radiusga teng bo'lganda bitta umumiy nuqta bo'ladi, ikkita emas, bu urinma holati.",
      'Так не складывается. Когда расстояние равно радиусу, общая точка одна, а не две, это случай касательной.',
      'That does not fit. When the distance equals the radius, there is one common point, not two, this is the tangent case.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 4-§, 35-mavzu asosida (111-113-bet)",
        'Правило на основе геометрии, § 4, тема 35 учебника (стр. 111-113)',
        'The rule is based on geometry, section 4, topic 35 of the textbook (pages 111-113)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "To'g'ri chiziq va aylananing joylashishini faqat chizmadan bilardik",
        'Мы узнавали расположение прямой и окружности только по чертежу',
        'We could tell the position of a line and a circle only from a drawing',
      ),
      right: L(
        "endi d bilan R ni solishtirib, hisoblash orqali bilamiz",
        'теперь мы узнаём это вычислением, сравнивая d и R',
        'now we know it by computation, comparing d and R',
      ),
      winner: 'right',
      note: L(
        "d > R yo'q, d = R bitta, d < R ikkita",
        'd > R нет, d = R одна, d < R две',
        'd > R none, d = R one, d < R two',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): d va R ni solishtirib, holatni aniqlash.
// ============================================================
const ASK_CASE = L("Nechta umumiy nuqta bor?", 'Сколько общих точек?', 'How many common points are there?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З106',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "R va d dan holatni aniqlang",
    'Определи случай по R и d',
    'Determine the case from R and d',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Ba'zilarida birliklar boshqacha, avval ularni tenglashtiring.",
      'Пять заданий. В некоторых единицы разные, сначала их уравняй.',
      'Five tasks. In some, the units differ, first equalise them.'),
    A('why',
      "Birlik bir xil bo'lgandan keyin, d bilan R solishtiriladi.",
      'После того как единица одинакова, d сравнивается с R.',
      'Once the unit is the same, d is compared with R.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar avval birlik tenglashtirilgan.",
      'Все пять разобраны. Каждый раз сначала уравнивалась единица.',
      'All five are done. Each time the unit was equalised first.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'R = 9 sm,  d = 5 sm'}</Row>,
        ok: L("Ha. Besh to'qqizdan kichik, demak ikkita umumiy nuqta bor.", 'Да. Пять меньше девяти, значит две общие точки.', 'Yes. Five is less than nine, so there are two common points.'),
        question: ASK_CASE,
        items: [
          { id: 'a', right: true, label: '2' },
          { id: 'b', label: '1', hint: L("d radiusdan kichik, bu urinma emas, kesuvchi.", 'd меньше радиуса, это не касательная, а секущая.', 'd is less than the radius, that is not a tangent, but a secant.') },
        ],
        solution: ['5 < 9', '2'],
      },
      {
        expr: <Row size="big" align="center">{'R = 1,6 dm,  d = 24 sm'}</Row>,
        ok: L("Ha. Bir nuqta olti o'ndan o'n olti santimetr, u yigirma to'rtdan kichik, demak umumiy nuqta yo'q.", 'Да. Один целых шесть десятых дм это шестнадцать сантиметров, что меньше двадцати четырёх, значит общих точек нет.', 'Yes. One point six dm is sixteen centimetres, which is less than twenty-four, so there is no common point.'),
        question: ASK_CASE,
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '2', hint: L("Avval o'n olti santimetrga aylantiring, keyin yigirma to'rt bilan solishtiring.", 'Сначала переведи в шестнадцать сантиметров, потом сравни с двадцатью четырьмя.', 'First convert to sixteen centimetres, then compare with twenty-four.') },
        ],
        solution: ['1,6 dm = 16 sm', '24 > 16', '0'],
      },
      {
        expr: <Row size="big" align="center">{'R = 4 sm,  d = 40 mm'}</Row>,
        ok: L("Ha. Qirq millimetr to'rt santimetrga teng, demak masofa radiusga teng, bitta umumiy nuqta.", 'Да. Сорок миллиметров равно четырём сантиметрам, значит расстояние равно радиусу, одна общая точка.', 'Yes. Forty millimetres equals four centimetres, so the distance equals the radius, one common point.'),
        question: ASK_CASE,
        items: [
          { id: 'a', right: true, label: '1' },
          { id: 'b', label: '2', hint: L("Qirq millimetrni santimetrga aylantiring, u radiusga teng chiqadi.", 'Переведи сорок миллиметров в сантиметры, получится равно радиусу.', 'Convert forty millimetres to centimetres, it comes out equal to the radius.') },
        ],
        solution: ['40 mm = 4 sm', '4 = 4', '1'],
      },
      {
        expr: <Row size="big" align="center">{'R = 60 sm,  d = 7 dm'}</Row>,
        ok: L("Ha. Yetti dm yetmish santimetrga teng, u oltmishdan katta, demak umumiy nuqta yo'q.", 'Да. Семь дм равно семидесяти сантиметрам, что больше шестидесяти, значит общих точек нет.', 'Yes. Seven dm equals seventy centimetres, which is more than sixty, so there is no common point.'),
        question: ASK_CASE,
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '2', hint: L("Yetti dmni santimetrga aylantiring, u oltmish sm dan katta chiqadi.", 'Переведи семь дм в сантиметры, получится больше шестидесяти.', 'Convert seven dm to centimetres, it comes out more than sixty.') },
        ],
        solution: ['7 dm = 70 sm', '70 > 60', '0'],
      },
      {
        expr: <Row size="big" align="center">{'R = 15 sm,  d = 9 sm'}</Row>,
        ok: L("Ha. To'qqiz o'n beshdan kichik, demak ikkita umumiy nuqta bor.", 'Да. Девять меньше пятнадцати, значит две общие точки.', 'Yes. Nine is less than fifteen, so there are two common points.'),
        question: ASK_CASE,
        items: [
          { id: 'a', right: true, label: '2' },
          { id: 'b', label: '0', hint: L("To'qqiz o'n beshdan kichik, umumiy nuqta yo'qligi esa d radiusdan katta bo'lganda bo'ladi.", 'Девять меньше пятнадцати, а отсутствие точек бывает, когда d больше радиуса.', 'Nine is less than fifteen, and no common points happens when d is greater than the radius.') },
        ],
        solution: ['9 < 15', '2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): kesuvchi vatarining uzunligi.
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З107',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Kesuvchi vatarining uzunligini hisoblang",
    'Вычисли длину хорды секущей',
    "Compute the secant's chord length",
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida radius va masofa berilgan, bular d radiusdan kichik.",
      'Три задания. В каждом даны радиус и расстояние, оно меньше радиуса.',
      'Three tasks. In each, the radius and the distance are given, less than the radius.'),
    A('why',
      "R² dan d² ayirib, ildiz olinadi, keyin ikkiga ko'paytiriladi.",
      'Из R² вычитается d², извлекается корень, потом умножается на два.',
      'd² is subtracted from R², the root is taken, then multiplied by two.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar oxirida ikkiga ko'paytirilgan.",
      'Все три разобраны. Каждый раз в конце умножалось на два.',
      'All three are done. Each time it was multiplied by two at the end.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'R = 13,  d = 5'}</Row>,
        ok: L("Ha. O'n uchning kvadratidan beshning kvadrati ayirilsa, yuz qirq to'rt, ildizi o'n ikki, ikkiga ko'paytirilsa, yigirma to'rt.", 'Да. Из квадрата тринадцати минус квадрат пяти, сто сорок четыре, корень двенадцать, умножить на два, двадцать четыре.', 'Yes. The square of thirteen minus the square of five is a hundred forty-four, the root is twelve, times two is twenty-four.'),
        question: L("AB (vatar) qancha?", 'Чему равна хорда AB?', 'What is the chord AB?'),
        items: [
          { id: 'a', right: true, label: '24' },
          { id: 'b', label: '12', hint: L("Bu yarim vatar, to'liq vatar ikkiga ko'paytirilishi kerak.", 'Это половина хорды, всю хорду нужно умножить на два.', 'That is half the chord, the whole chord must be multiplied by two.') },
        ],
        solution: ['13² − 5²', '144', '12', '12 · 2', '24'],
      },
      {
        expr: <Row size="big" align="center">{'R = 17,  d = 8'}</Row>,
        ok: L("Ha. O'n yettining kvadratidan sakkizning kvadrati ayirilsa, ikki yuz yigirma besh, ildizi o'n besh, ikkiga ko'paytirilsa, o'ttiz.", 'Да. Из квадрата семнадцати минус квадрат восьми, двести двадцать пять, корень пятнадцать, умножить на два, тридцать.', 'Yes. The square of seventeen minus the square of eight is two hundred twenty-five, the root is fifteen, times two is thirty.'),
        question: L("AB (vatar) qancha?", 'Чему равна хорда AB?', 'What is the chord AB?'),
        items: [
          { id: 'a', right: true, label: '30' },
          { id: 'b', label: '15', hint: L("Bu yarim vatar, to'liq vatar ikkiga ko'paytirilishi kerak.", 'Это половина хорды, всю хорду нужно умножить на два.', 'That is half the chord, the whole chord must be multiplied by two.') },
        ],
        solution: ['17² − 8²', '225', '15', '15 · 2', '30'],
      },
      {
        expr: <Row size="big" align="center">{'R = 25,  d = 7'}</Row>,
        ok: L("Ha. Yigirma beshning kvadratidan yettining kvadrati ayirilsa, olti yuz yigirma sakkiz, ildizi yigirma to'rt, ikkiga ko'paytirilsa, qirq sakkiz.", 'Да. Из квадрата двадцати пяти минус квадрат семи, шестьсот двадцать восемь, корень двадцать четыре, умножить на два, сорок восемь.', 'Yes. The square of twenty-five minus the square of seven is six hundred twenty-eight, the root is twenty-four, times two is forty-eight.'),
        question: L("AB (vatar) qancha?", 'Чему равна хорда AB?', 'What is the chord AB?'),
        items: [
          { id: 'a', right: true, label: '48' },
          { id: 'b', label: '24', hint: L("Bu yarim vatar, to'liq vatar ikkiga ko'paytirilishi kerak.", 'Это половина хорды, всю хорду нужно умножить на два.', 'That is half the chord, the whole chord must be multiplied by two.') },
        ],
        solution: ['25² − 7²', '576', '24', '24 · 2', '48'],
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
      "Birlikni tenglashtiring, keyin d bilan R ni solishtiring.",
      'Уравняй единицу, потом сравни d и R.',
      'Equalise the unit, then compare d with R.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash taklif qilingan javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло предложенный ответ.',
      'All three are done. Each time computation checked the proposed answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'R=5 sm, d=50 mm   →   1'}</Row>,
        ok: L("Ha. Ellik millimetr besh santimetrga teng, masofa radiusga teng, demak bitta umumiy nuqta.", 'Да. Пятьдесят миллиметров равно пяти сантиметрам, расстояние равно радиусу, значит одна общая точка.', 'Yes. Fifty millimetres equals five centimetres, the distance equals the radius, so one common point.'),
        question: L("Umumiy nuqtalar soni bitta deyilgan, bu javob to'g'rimi?", 'Сказано, что общая точка одна, верен ли этот ответ?', 'It was said there is one common point, is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ellik millimetrni santimetrga aylantiring, u besh santimetrga teng chiqadi.", 'Переведи пятьдесят миллиметров в сантиметры, получится равно пяти.', 'Convert fifty millimetres to centimetres, it comes out equal to five.') },
        ],
        solution: ['50 mm = 5 sm', '5 = 5', '1'],
      },
      {
        expr: <Row size="big" align="center">{'R=10, d=6   →   0'}</Row>,
        ok: L("Yo'q. Olti o'ndan kichik, demak ikkita umumiy nuqta bo'ladi, nol emas.", 'Нет. Шесть меньше десяти, значит две общие точки, а не ноль.', 'No. Six is less than ten, so there are two common points, not zero.'),
        question: L("Umumiy nuqtalar soni nol deyilgan, bu javob to'g'rimi?", 'Сказано, что общих точек ноль, верен ли этот ответ?', 'It was said there are zero common points, is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan solishtiring, olti o'ndan kichik.", 'Сравни снова, шесть меньше десяти.', 'Compare again, six is less than ten.') },
        ],
        solution: ['6 < 10', '2'],
      },
      {
        expr: <Row size="big" align="center">{'R=13, d=5   →   AB=24'}</Row>,
        ok: L("Ha. O'n uchning kvadratidan beshning kvadrati ayirilsa, yuz qirq to'rt, ildizi o'n ikki, ikkiga ko'paytirilsa, yigirma to'rt.", 'Да. Из квадрата тринадцати минус квадрат пяти, сто сорок четыре, корень двенадцать, умножить на два, двадцать четыре.', 'Yes. The square of thirteen minus the square of five is a hundred forty-four, the root is twelve, times two is twenty-four.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham yigirma to'rt chiqadi.", 'Посчитай, ответ действительно выходит двадцать четыре.', 'Compute it, the answer really comes to twenty-four.') },
        ],
        solution: ['13² − 5²', '144', '12', '24'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): birlik tenglashtirilmagan (З106)
// va d=R kesuvchi deb olingan (З107).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З106',
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
      "Birinchisida birlik tenglashtirilmagan, ikkinchisida masofa radiusga teng holat kesuvchi deb olingan.",
      'В первом единицы не уравнены, во втором случай, когда расстояние равно радиусу, принят за секущую.',
      'In the first, the units were not equalised, in the second, the case where the distance equals the radius was taken as a secant.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham boshqa-boshqa qoidani chetlab o'tgan.",
      'Обе разобраны. Обе ошибки обошли разные правила.',
      'Both are done. Each mistake bypassed a different rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'R=8 sm, d=90 mm   →   2'}</Row>,
        ok: L("Ha. To'qson millimetr to'qqiz santimetrga teng, u sakkizdan katta, demak umumiy nuqta yo'q, ikkita emas.", 'Да. Девяносто миллиметров равно девяти сантиметрам, что больше восьми, значит общих точек нет, а не две.', 'Yes. Ninety millimetres equals nine centimetres, which is more than eight, so there is no common point, not two.'),
        question: L("Radius sakkiz santimetr, masofa to'qson millimetr bo'lsa, va yuqoridagi xulosa qilingan bo'lsa, bu yerda xato qayerda?", 'Если радиус восемь сантиметров, расстояние девяносто миллиметров, а вывод сделан как выше, в чём здесь ошибка?', 'If the radius is eight centimetres, the distance is ninety millimetres, and the conclusion above was made, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Millimetr santimetrga aylantirilmagan, aslida d radiusdan katta", 'Миллиметры не переведены в сантиметры, на самом деле d больше радиуса', 'Millimetres were not converted to centimetres, in fact d is greater than the radius') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, to'qson millimetr to'qqiz santimetr, sakkizdan katta.", 'Это и есть показанная ошибка, девяносто миллиметров это девять сантиметров, больше восьми.', 'This is the very mistake shown; ninety millimetres is nine centimetres, more than eight.') },
        ],
        solution: ['90 mm = 9 sm', '9 > 8', '0'],
      },
      {
        expr: <Row size="big" align="center">{'R=12, d=12   →   2'}</Row>,
        ok: L("Ha. D radiusga teng bo'lsa, bitta umumiy nuqta bo'ladi, bu urinma, ikkita emas.", 'Да. Когда d равно радиусу, общая точка одна, это касательная, а не две.', 'Yes. When d equals the radius, there is one common point, this is a tangent, not two.'),
        question: L("Radius o'n ikki, masofa ham o'n ikki bo'lsa, va yuqoridagi xulosa qilingan bo'lsa, bu yerda xato qayerda?", 'Если радиус двенадцать, расстояние тоже двенадцать, а вывод сделан как выше, в чём здесь ошибка?', 'If the radius is twelve, the distance is also twelve, and the conclusion above was made, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("d = R holati urinma, kesuvchi emas", 'Случай d = R это касательная, а не секущая', 'The case d = R is a tangent, not a secant') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, masofa radiusga teng bo'lganda faqat bitta umumiy nuqta bo'ladi.", 'Это и есть показанная ошибка, когда расстояние равно радиусу, общая точка только одна.', 'This is the very mistake shown; when the distance equals the radius, there is only one common point.') },
        ],
        solution: ['12 = 12', '1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): birlikni tenglashtirib, holatni
// aniqlash.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З106',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Birlikni tenglashtirib, holatni qadamlab aniqlang",
    'Уравняй единицу и определи случай по шагам',
    'Equalise the unit and determine the case step by step',
  ),
  audio: [
    A('mount',
      "R va d berilgan, ba'zan turli birlikda. Avval birlik tenglashtiriladi.",
      'Даны R и d, иногда в разных единицах. Сначала уравнивается единица.',
      'R and d are given, sometimes in different units. First the unit is equalised.'),
    A('why',
      "Keyin d bilan R solishtirilib, holat aniqlanadi.",
      'Потом d сравнивается с R, и определяется случай.',
      'Then d is compared with R, and the case is determined.',
    ),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar avval birlik tenglashtirilgan.",
      'Все три заполнены. Каждый раз сначала уравнивалась единица.',
      'All three are filled. Each time the unit was equalised first.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['4', '1'],
      lines: [
        [{ t: 'R = 4 sm, d = 40 mm = ' }, { slot: '4' }, { t: ' sm   →   n = ' }, { slot: '1' }],
      ],
    },
    tasks: [
      {
        chips: ['16', '0'],
        lines: [
          [{ t: 'R = 1,6 dm = ' }, { slot: '16' }, { t: ' sm, d = 24 sm   →   n = ' }, { slot: '0' }],
        ],
      },
      {
        chips: ['70', '0'],
        lines: [
          [{ t: 'R = 60 sm, d = 7 dm = ' }, { slot: '70' }, { t: ' sm   →   n = ' }, { slot: '0' }],
        ],
      },
      {
        chips: ['9', '1'],
        lines: [
          [{ t: 'R = 90 mm = ' }, { slot: '9' }, { t: ' sm, d = 9 sm   →   n = ' }, { slot: '1' }],
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
    "To'g'ri chiziq va aylana bo'yicha to'rt savol",
    'Четыре вопроса о прямой и окружности',
    'Four questions about the line and the circle',
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
        id: 'q1', tag: 'З106',
        ask: L('R = 5 sm, d = 60 mm. Umumiy nuqtalar soni qancha?', 'R = 5 см, d = 60 мм. Сколько общих точек?', 'R = 5 cm, d = 60 mm. How many common points?'),
        options: [
          { id: 'ok', right: true, label: '0' },
          { id: 'no', label: '2' },
        ],
        hint: L("Oltmish millimetrni santimetrga aylantiring, u beshdan katta chiqadi.", 'Переведи шестьдесят миллиметров в сантиметры, получится больше пяти.', 'Convert sixty millimetres to centimetres, it comes out more than five.'),
        ok: L("To'g'ri, olti santimetr beshdan katta, umumiy nuqta yo'q.", 'Верно, шесть сантиметров больше пяти, общих точек нет.', 'Correct, six centimetres is more than five, no common point.'),
      },
      {
        id: 'q2', tag: 'З107',
        ask: L('R = 9, d = 9. Umumiy nuqtalar soni qancha?', 'R = 9, d = 9. Сколько общих точек?', 'R = 9, d = 9. How many common points?'),
        options: [
          { id: 'ok', right: true, label: '1' },
          { id: 'no', label: '2' },
        ],
        hint: L("Masofa radiusga teng holat urinma, u bitta umumiy nuqta beradi.", 'Случай, когда расстояние равно радиусу, это касательная, она даёт одну общую точку.', 'The case where the distance equals the radius is a tangent, it gives one common point.'),
        ok: L("To'g'ri, bitta, bu urinma.", 'Верно, одна, это касательная.', 'Correct, one, this is a tangent.'),
      },
      {
        id: 'q3', tag: 'З107',
        ask: L('R = 25, d = 7. Kesuvchi vatari qancha?', 'R = 25, d = 7. Чему равна хорда секущей?', "R = 25, d = 7. What is the secant's chord?"),
        options: [
          { id: 'ok', right: true, label: '48' },
          { id: 'no', label: '24' },
        ],
        hint: L("Yigirma to'rt bu yarim vatar, to'liq vatar ikkiga ko'paytirilishi kerak.", 'Двадцать четыре это половина хорды, всю хорду нужно умножить на два.', 'Twenty-four is half the chord, the whole chord must be multiplied by two.'),
        ok: L("To'g'ri, qirq sakkiz.", 'Верно, сорок восемь.', 'Correct, forty-eight.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('17² − 8² ni hisoblasak, 225 chiqadimi?', 'Верно ли, что 17² − 8², равно 225?', 'Is it true that 17² − 8² equals 225?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, ikki yuz sakson to'qqizdan oltmish to'rtni ayiring.", 'Посчитай, вычти шестьдесят четыре из двухсот восьмидесяти девяти.', 'Compute it, subtract sixty-four from two hundred eighty-nine.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З106',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "R = 50 mm, d = 3 sm bo'lsa, umumiy nuqtalar sonini yig'ing.",
            'Собери количество общих точек, если R = 50 мм, d = 3 см.',
            'Assemble the number of common points, if R = 50 mm, d = 3 cm.',
          ),
          lines: [
            [{ t: 'R = ' }, { slot: '5' }, { t: ' sm   →   n = ' }, { slot: '2' }],
          ],
          tiles: [
            { id: 't1', v: '5', x: 12, y: 12 },
            { id: 't2', v: '2', x: 60, y: 14 },
            { id: 't3', v: '50', x: 30, y: 50 },
            { id: 't4', v: '0', x: 78, y: 48 },
          ],
          hint: L(
            "Ellik millimetrni santimetrga aylantiring, keyin uchga solishtiring.",
            'Переведи пятьдесят миллиметров в сантиметры, потом сравни с тремя.',
            'Convert fifty millimetres to centimetres, then compare with three.',
          ),
          doneNote: L(
            "Yig'ildi. R besh santimetr, u uchdan katta, demak ikkita umumiy nuqta.",
            'Собрано. R пять сантиметров, это больше трёх, значит две общие точки.',
            'Assembled. R is five centimetres, more than three, so two common points.',
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
    "Avval birlik, keyin d va R solishtiriladi",
    'Сначала единица, потом сравниваются d и R',
    'First the unit, then d and R are compared',
  ),
  audio: [
    A('s0',
      "Darsdan bitta qoida qoladi. Masofa radiusga teng bo'lsa, aynan bitta nuqta, urinma degani.",
      'С урока остаётся одно правило. Если расстояние равно радиусу, это ровно одна точка, значит касательная.',
      'One rule stays with you. If the distance equals the radius, that is exactly one point, meaning a tangent.'),
    A('s1',
      "Bugun uch narsa qilindi. Uch holatni ajratdingiz, urinma teoremasini isbotladingiz va ikki urinmaning tengligini ko'rdingiz.",
      'Сегодня сделано три вещи. Ты различил три случая, доказал теорему о касательной, и увидел равенство двух касательных.',
      'Three things are done today. You told apart three cases, proved the tangent theorem, and saw the equality of two tangents.'),
    A('s2',
      "Keyingi darsda aylanaga ichki chizilgan burchak, u yoy bilan boshqacha bog'lanadi.",
      'В следующем уроке вписанный угол, он связан с дугой иначе.',
      'The next lesson covers the inscribed angle, it connects to the arc differently.',
    ),
  ],
  props: {
    mark: L("d > R: yo'q; d = R: bitta, urinma; d < R: ikkita, kesuvchi", 'd > R: нет; d = R: одна, касательная; d < R: две, секущая', 'd > R: none; d = R: one, tangent; d < R: two, secant'),
    markNote: L(
      "R = 4 sm, d = 40 mm → d = R → urinma",
      'R = 4 см, d = 40 мм → d = R → касательная',
      'R = 4 cm, d = 40 mm → d = R → tangent',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: aylanaga ichki chizilgan burchak",
      'Следующий урок: вписанный угол',
      'Next lesson: the inscribed angle',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
