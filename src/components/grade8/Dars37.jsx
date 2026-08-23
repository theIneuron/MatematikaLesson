// ============================================================================
// 8-sinf, Dars 37. PARALLELOGRAMM VA UNING XOSSALARI.
//
// BLOK Б6 NING BIRINCHI DARSI — GEOMETRIYA. Bu fayl, FAQAT MA'LUMOT.
// Mexanika `screens.jsx`, `geofigure.jsx`, `prooflines.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx` da.
//
// KARKAS O'ZGARDI: algebra darslarida `karkas.js`ning `buildScreens`i 1-dars
// asboblarini oladi va faqat 5-ekranni almashtiradi. Geometriyada 1-dars
// asboblari (steppers, movechain, pick/place kabi) mos kelmaydi — deyarli
// har bir «explain» ekrani o'z chertyozh-asbobini talab qiladi. Shuning
// uchun SCREENS bu yerda TO'G'RIDAN-TO'G'RI qurilgan, lekin ROL TARTIBI
// (`ROLE_ORDER`, `check-grade8.mjs`) algebra bilan BIR XIL: xuk, tayanch,
// besh izoh, qoida, to'rt mashq, ko'chirish, blits, yakun.
//
// MANBA: 8-sinf geometriya darsligi, I bob, 3-mavzu (14-15-bet). Barcha
// ta'rif, teorema va misollar darslikdan:
//   - ta'rif: qarama-qarshi tomonlari parallel to'rtburchak (14-bet);
//   - 1-teorema (1-xossa): diagonal ikkita teng uchburchakka bo'ladi;
//   - 1- va 2-natija: qarama-qarshi tomonlar va burchaklar teng;
//   - 2-teorema (2-xossa): diagonallar kesishadi va teng ikkiga bo'linadi;
//   - 3-teorema (3-xossa): bir tomonga yopishgan burchaklar yig'indisi 180°;
//   - 1-masala (15-bet): ikki burchak yig'indisi 172°, ular QARAMA-QARSHI
//     ekani (chunki qo'shni bo'lsa 180° bo'lardi) — javob 86°,94°,86°,94°;
//   - 2-masala (15-bet): tomonlar 5:7 nisbatda, perimetri 4,8 sm — javob
//     1 sm, 1,4 sm, 1 sm, 1,4 sm.
//
// YANGI PRIBORLAR: `GeoFigure` (chertyozhga tap) va `ProofLines` (isbotni
// asoslab to'ldirish) — ikkalasi ham shu blok uchun birinchi marta yozildi.
//
// ADASHISHLAR, to'rttasi yangi:
//   З75, ta'rif chalkashtirilgan (parallel o'rniga teng tomonlar);
//   З76, qo'shni burchaklar qoidasi (180°) qarama-qarshi burchaklarga
//   qo'llanilgan;
//   З77, parallelogrammning diagonallari teng deb hisoblangan;
//   З78, isbotda noto'g'ri asos tanlangan;
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
  id: 'geo-8-37',
  n: 37,
  row: 42,
  block: 'Б6',
  topic: L(
    "Parallelogramm va uning xossalari",
    'Параллелограмм и его свойства',
    'The parallelogram and its properties',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Qarama-qarshi tomonlari o'zaro parallel bo'lgan to'rtburchak parallelogramm deyiladi",
    'Четырёхугольник, у которого противоположные стороны параллельны, называется параллелограммом',
    'A quadrilateral whose opposite sides are parallel is called a parallelogram',
  ),
  L(
    "Parallelogrammning qarama-qarshi tomonlari va qarama-qarshi burchaklari teng",
    'Противоположные стороны и противоположные углы параллелограмма равны',
    'The opposite sides and opposite angles of a parallelogram are equal',
  ),
  L(
    "Parallelogrammning diagonallari kesishadi va kesishish nuqtasida teng ikkiga bo'linadi, bir tomoniga yopishgan burchaklar yig'indisi esa 180 gradusga teng",
    'Диагонали параллелограмма пересекаются и делятся точкой пересечения пополам, а сумма углов, прилежащих к одной стороне, равна 180 градусам',
    'The diagonals of a parallelogram intersect and bisect each other, and the angles adjacent to one side sum to 180 degrees',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З75': {
    what: L(
      "ta'rif chalkashtirilgan, parallellik o'rniga tomonlar tengligi ta'rif qilib olingan",
      'определение спутано, вместо параллельности взято равенство сторон',
      'the definition was confused, equality of sides was taken instead of parallelism',
    ),
    wrong: null,
    at: 3,
  },
  'З76': {
    what: L(
      "qo'shni burchaklar qoidasi (180°) qarama-qarshi burchaklarga qo'llanilgan",
      'правило соседних углов (180°) применено к противоположным углам',
      'the adjacent-angle rule (180°) was applied to opposite angles',
    ),
    wrong: '86',
    at: 9,
  },
  'З77': {
    what: L(
      "parallelogrammning diagonallari teng deb hisoblangan",
      'диагонали параллелограмма приняты равными',
      'the diagonals of the parallelogram were assumed equal',
    ),
    wrong: null,
    at: 12,
  },
  'З78': {
    what: L(
      "isbotda noto'g'ri asos tanlangan",
      'в доказательстве выбрано неверное обоснование',
      'the wrong justification was chosen in the proof',
    ),
    wrong: null,
    at: 4,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI. Bitta ABCD parallelogramm 3, 4, 5, 6-ekranlarda
// qayta ishlatiladi (koordinatalar — abstrakt birlik, 0-110 x 0-100).
// ============================================================
const PTS = { A: [15, 82], B: [32, 18], C: [95, 18], D: [78, 82] }
const ORDER = ['A', 'B', 'C', 'D']

// ============================================================
// SAHNALAR (§6). Xuk: uch to'rtburchak, qaysi biri parallelogramm.
// Yakun: uch xossa bir chertyozhda.
// ============================================================
const SC_ASK = L('QAYSI BIRI PARALLELOGRAMM', 'КАКОЙ ИЗ НИХ ПАРАЛЛЕЛОГРАММ', 'WHICH ONE IS A PARALLELOGRAM')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <polygon points="130,90 155,35 260,35 235,90" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="195" cy="62" r="15" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="195" y="68" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Uch xossa, bitta chertyozh",
      'Три свойства, один чертёж',
      'Three properties, one drawing',
    )}>
      <polygon points="130,85 150,35 250,35 230,85" fill="none" stroke={T.ink2} strokeWidth="1.4"/>
      <line x1="130" y1="85" x2="250" y2="35" stroke={T.graph} strokeWidth="1.2"/>
      <g className="g8-seat" style={{ '--d': '1300ms' }}>
        <text x="190" y="105" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fill={T.ok}>{'AB = CD,  AD = BC,  AO = OC'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1900ms' }}>
        <text x="190" y="122" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>{"qo'shni burchaklar yig'indisi 180°"}</text>
      </g>
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
  eyebrow: L('BURCHAKLARGA QARANG', 'ПОСМОТРИ НА УГЛЫ', 'LOOK AT THE ANGLES'),
  title: L(
    "To'rtburchakning burchaklari qanday bo'lsa, u parallelogramm bo'ladi",
    'Какими должны быть углы четырёхугольника, чтобы он был параллелограммом',
    'What must the angles of a quadrilateral be for it to be a parallelogram',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "To'rt xil burchaklar to'plami beriladi. Faqat bittasi parallelogrammga tegishli bo'lishi mumkin.",
      'Даны четыре набора углов. Только один может принадлежать параллелограмму.',
      'Four sets of angles are given. Only one can belong to a parallelogram.'),
    A('why',
      "Taxmin qiling, qaysi to'plamda qarama-qarshi burchaklar teng.",
      'Предположи, в каком наборе противоположные углы равны.',
      'Predict in which set the opposite angles are equal.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Qaysi burchaklar to'plami parallelogrammga tegishli bo'lishi mumkin?",
      'Какой набор углов может принадлежать параллелограмму?',
      'Which set of angles could belong to a parallelogram?',
    ),
    items: [
      { id: 'a', show: '70°, 110°, 70°, 110°' },
      { id: 'b', show: '80°, 100°, 110°, 70°' },
      { id: 'c', show: '60°, 100°, 90°, 110°' },
      { id: 'd', show: '85°, 95°, 100°, 80°' },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Ichki almashinuvchi burchaklar, parallel to'g'ri
// chiziqlar va kesuvchi (7-sinfdan, darslik ham shu bilan boshlanadi).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Parallel chiziqlar va kesuvchini eslash",
    'Вспоминаем параллельные прямые и секущую',
    'Recalling parallel lines and a transversal',
  ),
  audio: [
    A('mount',
      "To'rt javob taklif qilinadi. Faqat bittasida ichki almashinuvchi burchaklar to'g'ri ko'rsatilgan.",
      'Предложены четыре ответа. Только в одном верно указаны внутренние накрест лежащие углы.',
      'Four answers are proposed. Only one correctly shows the alternate interior angles.'),
    A('why',
      "Ikki parallel chiziq va ularni kesuvchi to'g'ri chiziq bo'lsa, ichki almashinuvchi burchaklar teng bo'ladi.",
      'Если есть две параллельные прямые и секущая, внутренние накрест лежащие углы равны.',
      'If there are two parallel lines and a transversal, the alternate interior angles are equal.'),
  ],
  props: {
    ask: L(
      "Ikki parallel chiziq kesuvchi bilan kesishganda qaysi burchaklar doim teng bo'ladi?",
      'Когда две параллельные прямые пересекает секущая, какие углы всегда равны?',
      'When two parallel lines are cut by a transversal, which angles are always equal?',
    ),
    items: [
      { id: 'right', show: L("Ichki almashinuvchi burchaklar", 'Внутренние накрест лежащие углы', 'The alternate interior angles'), right: true, name: L('kesuvchining ikki tomonida, ichkarida', 'по разным сторонам секущей, внутри', 'on different sides of the transversal, inside') },
      {
        id: 'wrong1', show: L("Kesuvchi bilan ixtiyoriy burchak", 'Любой угол с секущей', 'Any angle with the transversal'),
        hint: L("Faqat AYNI shu joylashuvdagi burchaklar teng, ixtiyoriysi emas.", 'Равны только углы именно в этом расположении, а не любые.', 'Only angles in exactly this arrangement are equal, not just any.'),
      },
      {
        id: 'wrong2', show: L("Bir tomondagi burchaklar", 'Углы с одной стороны', 'Angles on the same side'),
        hint: L("Bir tomondagi ichki burchaklar teng emas, ularning yig'indisi 180 gradus.", 'Внутренние углы с одной стороны не равны, их сумма 180 градусов.', 'Interior angles on the same side are not equal, their sum is 180 degrees.'),
      },
      {
        id: 'wrong3', show: L("Kesuvchining o'zidagi burchak", 'Угол самой секущей', 'The angle of the transversal itself'),
        hint: L("Kesuvchining o'zi burchak hosil qilmaydi, u ikki chiziqni kesadi.", 'Сама секущая не образует угол, она пересекает две прямые.', 'The transversal itself does not form an angle, it cuts the two lines.'),
      },
    ],
    after: L(
      "To'g'ri. Ichki almashinuvchi burchaklar parallel chiziqlarda doim teng.",
      'Верно. Внутренние накрест лежащие углы при параллельных прямых всегда равны.',
      'Correct. The alternate interior angles at parallel lines are always equal.',
    ),
  },
}

// ============================================================
// EKRAN 3. TOMONLARGA TAP (`geofigure`). Ta'rif: AB tomoniga qarama-qarshi
// tomonni toping. Ловушка, ta'rif chalkashtirilgan (З75).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'geofigure',
  tag: 'З75',
  eyebrow: L('QARAMA-QARSHI TOMONNI TOPING', 'НАЙДИ ПРОТИВОПОЛОЖНУЮ СТОРОНУ', 'FIND THE OPPOSITE SIDE'),
  title: L(
    "Parallelogrammda AB tomoniga qarama-qarshi tomonni toping",
    'В параллелограмме найди сторону, противоположную AB',
    'In the parallelogram, find the side opposite AB',
  ),
  audio: [
    A('mount',
      "ABCD chertyozhda turibdi. Parallelogrammda qarama-qarshi tomonlar parallel.",
      'На чертеже стоит ABCD. В параллелограмме противоположные стороны параллельны.',
      'ABCD stands on the drawing. In a parallelogram, the opposite sides are parallel.'),
    A('why',
      "AB tomonidan boshlab, qo'shni emas, aynan QARAMA-QARSHI tomonni bosing.",
      'Начиная от AB, нажми именно ПРОТИВОПОЛОЖНУЮ сторону, а не соседнюю.',
      'Starting from AB, tap exactly the OPPOSITE side, not the adjacent one.'),
  ],
  props: {
    points: PTS,
    order: ORDER,
    steps: [
      {
        kind: 'edges',
        targets: ['CD'],
        ask: L("AB tomoniga qarama-qarshi tomonni bosing", 'Нажми сторону, противоположную AB', 'Tap the side opposite AB'),
        hints: {
          BC: L("BC, AB ga QO'SHNI tomon, qarama-qarshisi emas.", 'BC, соседняя с AB сторона, а не противоположная.', 'BC is adjacent to AB, not opposite.'),
          AD: L("AD ham AB ga qo'shni, ular bitta uchda tutashadi.", 'AD тоже соседняя с AB, они сходятся в одной вершине.', 'AD is also adjacent to AB, they meet at one vertex.'),
        },
      },
    ],
    after: L(
      "To'g'ri. AB va CD qarama-qarshi tomonlar, parallelogrammda ular parallel.",
      'Верно. AB и CD противоположные стороны, в параллелограмме они параллельны.',
      'Correct. AB and CD are opposite sides, in a parallelogram they are parallel.',
    ),
  },
}

// ============================================================
// EKRAN 4. ISBOT (`prooflines`). 1-teorema: diagonal ikkita teng
// uchburchakka bo'ladi. Ловушка, noto'g'ri asos (З78).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З78',
  eyebrow: L('DIAGONALNI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ПРО ДИАГОНАЛЬ', 'PROVING ABOUT THE DIAGONAL'),
  title: L(
    "Diagonal parallelogrammni ikkita teng uchburchakka bo'ladi",
    'Диагональ делит параллелограмм на два равных треугольника',
    'The diagonal divides the parallelogram into two congruent triangles',
  ),
  audio: [
    A('mount',
      "ABCD parallelogramm, AC diagonali chizilgan. Har qatorda asosni tanlaymiz.",
      'ABCD, параллелограмм, проведена диагональ AC. В каждой строке выбираем обоснование.',
      'ABCD is a parallelogram, the diagonal AC is drawn. In each line we choose the justification.'),
    A('why',
      "Noto'g'ri asos ham taklif qilinadi, chertyozhga qarab emas, sababiga qarab tanlang.",
      'Предлагается и неверное обоснование, выбирай не по виду на чертеже, а по причине.',
      'A wrong justification is also offered; choose by the reason, not by the look of the drawing.'),
  ],
  props: {
    points: PTS,
    order: ORDER,
    marks: [['A', 'C']],
    given: [
      L("ABCD, parallelogramm", 'ABCD, параллелограмм', 'ABCD, a parallelogram'),
      L("AC, diagonal", 'AC, диагональ', 'AC, a diagonal'),
    ],
    goal: L("△ADC = △CBA", '△ADC = △CBA', '△ADC = △CBA'),
    lines: [
      {
        text: L("AC, ikkala uchburchakka ham tegishli", 'AC принадлежит обоим треугольникам', 'AC belongs to both triangles'),
        options: [
          { id: 'ok', right: true, label: L("Umumiy tomon", 'Общая сторона', 'A common side') },
          { id: 'no', label: L("Ular teng, chunki chertyozhda shunday ko'rinadi", 'Они равны, потому что так видно на чертеже', 'They are equal because it looks that way on the drawing'), hint: L("Chertyozhdagi ko'rinish isbot emas, AC ikkala uchburchakning tomoni ekanidan foydalaning.", 'Вид на чертеже не доказательство, используй, что AC сторона обоих треугольников.', 'The look of the drawing is not a proof, use that AC is a side of both triangles.') },
        ],
      },
      {
        text: L("burchak DAC burchak BCA ga teng", 'угол DAC равен углу BCA', 'angle DAC equals angle BCA'),
        options: [
          { id: 'ok', right: true, label: L("AB va DC parallel, AC kesuvchi, ichki almashinuvchi burchaklar", 'AB и DC параллельны, AC секущая, внутренние накрест лежащие углы', 'AB and DC are parallel, AC is the transversal, alternate interior angles') },
          { id: 'no', label: L("Bu burchaklar tepadosh, shuning uchun teng", 'Эти углы вертикальные, поэтому равны', 'These angles are vertical, so they are equal'), hint: L("Bu ikki burchak tepadosh emas, ular ichki almashinuvchi joylashgan.", 'Эти два угла не вертикальные, они расположены как накрест лежащие.', 'These two angles are not vertical, they are positioned as alternate interior angles.') },
        ],
      },
      {
        text: L("burchak DCA burchak BAC ga teng", 'угол DCA равен углу BAC', 'angle DCA equals angle BAC'),
        options: [
          { id: 'ok', right: true, label: L("AD va BC parallel, AC kesuvchi, ichki almashinuvchi burchaklar", 'AD и BC параллельны, AC секущая, внутренние накрест лежащие углы', 'AD and BC are parallel, AC is the transversal, alternate interior angles') },
          { id: 'no', label: L("AB va DC parallel bo'lgani uchun", 'Потому что AB и DC параллельны', 'Because AB and DC are parallel'), hint: L("Bu boshqa juft burchak uchun sabab edi, bu yerda AD va BC parallelligidan foydalaning.", 'Это была причина для другой пары углов, здесь используй параллельность AD и BC.', 'That was the reason for the other pair of angles; here use that AD and BC are parallel.') },
        ],
      },
      {
        text: L("shuning uchun uchburchak ADC uchburchak CBA ga teng", 'поэтому треугольник ADC равен треугольнику CBA', 'therefore triangle ADC equals triangle CBA'),
        options: [
          { id: 'ok', right: true, label: L("Tomon, burchak, burchak (ikkinchi belgi)", 'Сторона, угол, угол (второй признак)', 'Side, angle, angle (second criterion)') },
          { id: 'no1', label: L("Uch tomon (birinchi belgi)", 'Три стороны (первый признак)', 'Three sides (first criterion)'), hint: L("Uch tomon haqida ma'lumot yo'q, faqat bitta umumiy tomon va ikki juft burchak bor.", 'Данных о трёх сторонах нет, есть только одна общая сторона и две пары углов.', 'There is no data about three sides, only one common side and two pairs of angles.') },
          { id: 'no2', label: L("Ikki tomon va ular orasidagi burchak (uchinchi belgi)", 'Две стороны и угол между ними (третий признак)', 'Two sides and the angle between them (third criterion)'), hint: L("Bizda faqat bitta tomon (AC) va ikki burchak bor, ikki tomon emas.", 'У нас только одна сторона (AC) и два угла, а не две стороны.', 'We have only one side (AC) and two angles, not two sides.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. Uchburchaklar teng, shuning uchun ularning mos tomonlari ham teng.",
      'Доказано. Треугольники равны, поэтому их соответственные стороны тоже равны.',
      'Proven. The triangles are equal, so their corresponding sides are equal too.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI (`geofigure`, ikki bosqich). Natijalar:
// qarama-qarshi tomonlar va burchaklar teng.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'geofigure',
  tag: 'З75',
  eyebrow: L('TENG QISMLARNI BELGILANG', 'ОТМЕТЬ РАВНЫЕ ЧАСТИ', 'MARK THE EQUAL PARTS'),
  title: L(
    "Avval teng tomonlarni, keyin teng burchaklarni belgilang",
    'Сначала отметь равные стороны, потом равные углы',
    'First mark the equal sides, then the equal angles',
  ),
  audio: [
    A('mount',
      "Isbotdan ikki natija chiqadi, qarama-qarshi tomonlar teng, qarama-qarshi burchaklar teng.",
      'Из доказательства следуют два вывода, противоположные стороны равны, противоположные углы равны.',
      'Two conclusions follow from the proof, the opposite sides are equal, the opposite angles are equal.'),
    A('why',
      "Avval AB bilan teng tomonni bosing.",
      'Сначала нажми сторону, равную AB.',
      'First tap the side equal to AB.'),
    W('mark',
      "Endi burchak A bilan teng burchakni bosing.",
      'Теперь нажми угол, равный углу A.',
      'Now tap the angle equal to angle A.'),
  ],
  props: {
    points: PTS,
    order: ORDER,
    steps: [
      {
        kind: 'edges',
        targets: ['CD'],
        ask: L("AB bilan teng tomonni bosing", 'Нажми сторону, равную AB', 'Tap the side equal to AB'),
        hints: {
          BC: L("BC, AB bilan teng emas, u qo'shni tomon.", 'BC не равна AB, это соседняя сторона.', 'BC is not equal to AB, it is the adjacent side.'),
          AD: L("AD, AB bilan teng emas, u qo'shni tomon.", 'AD не равна AB, это соседняя сторона.', 'AD is not equal to AB, it is the adjacent side.'),
        },
      },
      {
        kind: 'angles',
        targets: ['C'],
        ask: L("Burchak A bilan teng burchakni bosing", 'Нажми угол, равный углу A', 'Tap the angle equal to angle A'),
        hints: {
          B: L("Burchak B, A ga qo'shni, teng emas, ularning yig'indisi 180 gradus.", 'Угол B соседний с A, не равен, их сумма 180 градусов.', 'Angle B is adjacent to A, not equal; their sum is 180 degrees.'),
          D: L("Burchak D ham A ga qo'shni, teng emas.", 'Угол D тоже соседний с A, не равен.', 'Angle D is also adjacent to A, not equal.'),
        },
      },
    ],
    after: L(
      "To'g'ri. AB teng CD ga, burchak A teng burchak C ga.",
      'Верно. AB равна CD, угол A равен углу C.',
      'Correct. AB equals CD, angle A equals angle C.',
    ),
  },
}

// ============================================================
// EKRAN 6. ISBOT (`prooflines`). 2-teorema: diagonallar kesishish
// nuqtasida teng ikkiga bo'linadi. Ловушка, diagonallar teng emasligi (З77).
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З77',
  eyebrow: L('DIAGONALLARNI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ПРО ДИАГОНАЛИ', 'PROVING ABOUT THE DIAGONALS'),
  title: L(
    "Diagonallar kesishish nuqtasida teng ikkiga bo'linadi",
    'Диагонали делятся точкой пересечения пополам',
    'The diagonals are bisected by their point of intersection',
  ),
  audio: [
    A('mount',
      "ABCD parallelogramm, AC va BD diagonallari O nuqtada kesishadi.",
      'ABCD, параллелограмм, диагонали AC и BD пересекаются в точке O.',
      'ABCD is a parallelogram, the diagonals AC and BD intersect at point O.'),
    A('why',
      "AO va OC tengligini isbotlaymiz, uchburchak AOD va COB orqali.",
      'Докажем равенство AO и OC через треугольники AOD и COB.',
      'We prove AO equals OC through triangles AOD and COB.'),
  ],
  props: {
    points: PTS,
    order: ORDER,
    marks: [['A', 'C'], ['B', 'D']],
    given: [
      L("ABCD, parallelogramm", 'ABCD, параллелограмм', 'ABCD, a parallelogram'),
      L("AC va BD, diagonallar, O ularning kesishish nuqtasi", 'AC и BD, диагонали, O их точка пересечения', 'AC and BD, diagonals, O their intersection point'),
    ],
    goal: L("AO = OC, DO = OB", 'AO = OC, DO = OB', 'AO = OC, DO = OB'),
    lines: [
      {
        text: L("AD burchak BC ga teng (uzunlikda)", 'AD равна BC (по длине)', 'AD equals BC (in length)'),
        options: [
          { id: 'ok', right: true, label: L("Parallelogrammning qarama-qarshi tomonlari teng, oldingi natija", 'Противоположные стороны параллелограмма равны, из предыдущего вывода', 'The opposite sides of a parallelogram are equal, from the earlier result') },
          { id: 'no', label: L("Diagonallar teng bo'lgani uchun", 'Потому что диагонали равны', 'Because the diagonals are equal'), hint: L("Diagonallarning tengligi bu yerda ishlatilmaydi, ular umuman teng bo'lmasligi mumkin.", 'Равенство диагоналей здесь не используется, они вообще могут быть не равны.', 'The equality of the diagonals is not used here; they may not even be equal.') },
        ],
      },
      {
        text: L("burchak ADO burchak CBO ga teng", 'угол ADO равен углу CBO', 'angle ADO equals angle CBO'),
        options: [
          { id: 'ok', right: true, label: L("AD va BC parallel, BD kesuvchi, ichki almashinuvchi burchaklar", 'AD и BC параллельны, BD секущая, внутренние накрест лежащие углы', 'AD and BC are parallel, BD is the transversal, alternate interior angles') },
          { id: 'no', label: L("AB va DC parallel bo'lgani uchun", 'Потому что AB и DC параллельны', 'Because AB and DC are parallel'), hint: L("Bu burchaklar BD kesuvchisiga tegishli, AB va DC ga emas.", 'Эти углы относятся к секущей BD, а не к AB и DC.', 'These angles belong to the transversal BD, not to AB and DC.') },
        ],
      },
      {
        text: L("burchak DAO burchak BCO ga teng", 'угол DAO равен углу BCO', 'angle DAO equals angle BCO'),
        options: [
          { id: 'ok', right: true, label: L("AD va BC parallel, AC kesuvchi, ichki almashinuvchi burchaklar", 'AD и BC параллельны, AC секущая, внутренние накрест лежащие углы', 'AD and BC are parallel, AC is the transversal, alternate interior angles') },
          { id: 'no', label: L("Bu burchaklar qo'shni, shuning uchun teng", 'Эти углы соседние, поэтому равны', 'These angles are adjacent, so they are equal'), hint: L("Qo'shni burchaklar teng bo'lishi shart emas, bu yerda parallellikdan foydalaniladi.", 'Соседние углы не обязаны быть равными, здесь используется параллельность.', 'Adjacent angles need not be equal; here parallelism is used.') },
        ],
      },
      {
        text: L("shuning uchun uchburchak AOD uchburchak COB ga teng", 'поэтому треугольник AOD равен треугольнику COB', 'therefore triangle AOD equals triangle COB'),
        options: [
          { id: 'ok', right: true, label: L("Tomon, burchak, burchak (ikkinchi belgi)", 'Сторона, угол, угол (второй признак)', 'Side, angle, angle (second criterion)') },
          { id: 'no', label: L("Uch tomon (birinchi belgi)", 'Три стороны (первый признак)', 'Three sides (first criterion)'), hint: L("Bitta tomon, AD teng BC, va ikki burchak bor, uch tomon emas.", 'Есть одна сторона, AD равна BC, и два угла, а не три стороны.', 'There is one side, AD equal to BC, and two angles, not three sides.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. AO va OC uchburchaklarning mos tomonlari, shuning uchun teng, xuddi shu tarzda DO va OB.",
      'Доказано. AO и OC, соответственные стороны треугольников, поэтому равны, так же DO и OB.',
      'Proven. AO and OC are corresponding sides of the triangles, so they are equal, likewise DO and OB.',
    ),
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): 3-teorema, bir tomonga
// yopishgan burchaklar yig'indisi 180°.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З76',
  eyebrow: L('QO\'SHNI BURCHAKLAR', 'СОСЕДНИЕ УГЛЫ', 'ADJACENT ANGLES'),
  title: L(
    "Bir tomonga yopishgan burchaklar yig'indisi",
    'Сумма углов, прилежащих к одной стороне',
    'The sum of the angles adjacent to one side',
  ),
  audio: [
    A('mount',
      "Burchak A va burchak B, AB tomoniga yopishgan. Ularning yig'indisi hisoblanadi.",
      'Угол A и угол B прилежат к стороне AB. Считается их сумма.',
      'Angle A and angle B are adjacent to side AB. Their sum is computed.'),
    W('p2',
      "AD va BC parallel, AB esa ularni kesadi, shuning uchun bir tomondagi ichki burchaklar hosil bo'ladi.",
      'AD и BC параллельны, а AB их пересекает, поэтому образуются внутренние углы с одной стороны.',
      'AD and BC are parallel, and AB crosses them, so same-side interior angles are formed.'),
    W('p4',
      "Bir tomondagi ichki burchaklar yig'indisi doim 180 gradus.",
      'Сумма внутренних углов с одной стороны всегда 180 градусов.',
      'The sum of same-side interior angles is always 180 degrees.',
    ),
  ],
  props: {
    tokens: [
      { t: '∠A', id: 'a' },
      { t: '  +  ', id: 'mid' },
      { t: '∠B  =  180°', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi burchak, A. U AB va AD tomonlari orasida.",
          'Первый угол, A. Он между сторонами AB и AD.',
          'The first angle, A. It is between sides AB and AD.',
        ),
      },
      {
        focus: 'mid',
        text: L(
          "AD va BC parallel, AB ularni kesadi, shuning uchun A va B bir tomondagi ichki burchaklar.",
          'AD и BC параллельны, AB их пересекает, поэтому A и B, внутренние углы с одной стороны.',
          'AD and BC are parallel, AB crosses them, so A and B are same-side interior angles.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Bir tomondagi ichki burchaklar yig'indisi 180 gradus, bu qat'iy qoida.",
          'Сумма внутренних углов с одной стороны 180 градусов, это твёрдое правило.',
          'The sum of same-side interior angles is 180 degrees, a firm rule.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Parallelogrammning, umuman aytganda, bir-biridan farq qiladigan ikkita balandligi bo'ladi, chunki balandlik qarama-qarshi tomonga perpendikulyar o'tkaziladi va ikki juft tomon bor.",
        'У параллелограмма, вообще говоря, две разные высоты, потому что высота проводится перпендикулярно противоположной стороне, а пар сторон две.',
        'A parallelogram generally has two different heights, since a height is drawn perpendicular to the opposite side, and there are two pairs of sides.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Darslik 3-mavzu ta'rif va
// xossalari.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З77',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Parallelogramm va uning xossalari",
    'Параллелограмм и его свойства',
    'The parallelogram and its properties',
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
      { id: 'f1', label: L("qarama-qarshi tomonlari parallel bo'lgan to'rtburchak parallelogramm deyiladi", 'четырёхугольник с параллельными противоположными сторонами называется параллелограммом', 'a quadrilateral with parallel opposite sides is called a parallelogram') },
      { id: 'f2', label: L("qarama-qarshi tomonlari va qarama-qarshi burchaklari teng", 'противоположные стороны и противоположные углы равны', 'the opposite sides and opposite angles are equal') },
      { id: 'f3', label: L("diagonallari kesishish nuqtasida teng ikkiga bo'linadi", 'диагонали делятся точкой пересечения пополам', 'the diagonals are bisected by their point of intersection') },
      { id: 'f4', label: L("bir tomoniga yopishgan burchaklar yig'indisi 180 gradus", 'сумма углов, прилежащих к одной стороне, 180 градусов', 'the sum of the angles adjacent to one side is 180 degrees') },
      { id: 'w1', label: L("diagonallari teng", 'диагонали равны', 'the diagonals are equal') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Parallelogrammning diagonallari TENG emas, ular faqat kesishish nuqtasida teng ikkiga bo'linadi.",
      'Так не складывается. Диагонали параллелограмма НЕ равны, они лишь делятся точкой пересечения пополам.',
      'That does not fit. The diagonals of a parallelogram are NOT equal, they are only bisected by their point of intersection.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, I bob, 3-mavzu asosida (14-15-bet)",
        'Правило на основе геометрии, глава I, тема 3 учебника (стр. 14-15)',
        'The rule is based on geometry, chapter I, topic 3 of the textbook (pages 14-15)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Qaysi to'rtburchak parallelogramm ekanini burchaklarigagina qarab bilmasdik",
        'Мы не знали, какой четырёхугольник параллелограмм, только глядя на углы',
        'We did not know which quadrilateral is a parallelogram just by looking at the angles',
      ),
      right: L(
        "endi qarama-qarshi burchaklar teng bo'lishi kerakligini bilamiz",
        'теперь знаем, что противоположные углы должны быть равны',
        'now we know the opposite angles must be equal',
      ),
      winner: 'right',
      note: L(
        "Tomonlar parallel, tomonlar va burchaklar teng, diagonallar teng ikkiga bo'linadi",
        'Стороны параллельны, стороны и углы равны, диагонали делятся пополам',
        'The sides are parallel, the sides and angles are equal, the diagonals bisect each other',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): 1-masala, ikki burchak yig'indisi
// 172° (15-bet). Ловушка, qo'shni-qarama-qarshi chalkashtirilishi (З76).
// ============================================================
const ASK_ANGLE = L("Bu burchaklar qanday burchaklar?", 'Какие это углы?', 'What kind of angles are these?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З76',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Parallelogramm burchaklarining yig'indisidan turini aniqlang",
    'Определи вид углов параллелограмма по их сумме',
    'Determine the type of the parallelogram\'s angles from their sum',
  ),
  audio: [
    A('mount',
      "Ikki burchak yig'indisi berilgan. Avval ular qo'shni yoki qarama-qarshi ekanini aniqlash kerak.",
      'Дана сумма двух углов. Сначала нужно определить, соседние они или противоположные.',
      'The sum of two angles is given. First it must be determined whether they are adjacent or opposite.'),
    A('why',
      "Qo'shni burchaklar yig'indisi doim 180 gradus, boshqa son chiqsa, ular qarama-qarshi.",
      'Сумма соседних углов всегда 180 градусов, если выходит другое число, они противоположные.',
      'The sum of adjacent angles is always 180 degrees; if a different number comes out, they are opposite.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar 180 gradusdan farqi burchaklar turini ko'rsatgan.",
      'Все пять разобраны. Каждый раз отличие от 180 градусов показывало вид углов.',
      'All five are done. Each time the difference from 180 degrees showed the type of angles.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'172°'}</Row>,
        ok: L("Ha. 172 gradus 180 dan farq qiladi, shuning uchun ular qarama-qarshi.", 'Да. 172 градуса отличается от 180, поэтому они противоположные.', 'Yes. 172 degrees differs from 180, so they are opposite.'),
        question: ASK_ANGLE,
        items: [
          { id: 'a', right: true, label: L("Qarama-qarshi", 'Противоположные', 'Opposite') },
          { id: 'b', label: L("Qo'shni", 'Соседние', 'Adjacent'), hint: L("Qo'shni bo'lsa, yig'indi aynan 180 gradus bo'lishi kerak edi.", 'Если бы они были соседними, сумма должна была быть ровно 180 градусов.', 'If they were adjacent, the sum should have been exactly 180 degrees.') },
        ],
        solution: ['172°', "qarama-qarshi"],
      },
      {
        expr: <Row size="big" align="center">{'172°   →   86°, 94°, 86°, 94°'}</Row>,
        ok: L("Ha. Har biri sakson olti gradus, qolgan ikkitasi to'qson to'rt gradus.", 'Да. Каждый по восемьдесят шесть градусов, остальные два по девяносто четыре.', 'Yes. Each is eighty-six degrees, the remaining two are ninety-four degrees each.'),
        question: L("Barcha burchaklar qancha?", 'Каковы все углы?', 'What are all the angles?'),
        items: [
          { id: 'a', right: true, label: '86°, 94°, 86°, 94°' },
          { id: 'b', label: '86°, 86°, 86°, 86°', hint: L("Faqat ikkitasi bir-biriga teng, qolgan ikkitasi boshqa qiymatga ega.", 'Равны только два угла, у остальных двух другое значение.', 'Only two angles are equal, the other two have a different value.') },
        ],
        solution: ['172° : 2', '86°', '180° − 86°', '94°'],
      },
      {
        expr: <Row size="big" align="center">{'180°'}</Row>,
        ok: L("Ha. 180 gradusning o'zi, shuning uchun ular qo'shni.", 'Да. Ровно 180 градусов, поэтому они соседние.', 'Yes. Exactly 180 degrees, so they are adjacent.'),
        question: ASK_ANGLE,
        items: [
          { id: 'a', right: true, label: L("Qo'shni", 'Соседние', 'Adjacent') },
          { id: 'b', label: L("Qarama-qarshi", 'Противоположные', 'Opposite'), hint: L("Qarama-qarshi burchaklar teng bo'ladi, ularning yig'indisi 180 bo'lishi shart emas.", 'Противоположные углы равны, их сумма не обязана быть 180.', 'Opposite angles are equal; their sum need not be 180.') },
        ],
        solution: ['180°', "qo'shni"],
      },
      {
        expr: <Row size="big" align="center">{'150°   →   75°, 105°, 75°, 105°'}</Row>,
        ok: L("Ha. Yuz ellik ikkiga bo'linsa, yetmish besh, qolgani yuz besh.", 'Да. Сто пятьдесят делённое на два, семьдесят пять, остальные сто пять.', 'Yes. A hundred fifty divided by two, seventy-five, the rest a hundred five.'),
        question: L("Ikki burchak yig'indisi 150° bo'lsa, barcha burchaklar qancha?", 'Если сумма двух углов 150°, каковы все углы?', 'If the sum of two angles is 150°, what are all the angles?'),
        items: [
          { id: 'a', right: true, label: '75°, 105°, 75°, 105°' },
          { id: 'b', label: '75°, 75°, 105°, 105°', hint: L("Tartib emas, qiymatlar to'g'ri, lekin qarama-qarshi juftlarni tekshiring.", 'Дело не в порядке, но проверь, какая пара противоположна какой.', 'It is not about order, but check which pair is opposite which.') },
        ],
        solution: ['150° : 2', '75°', '180° − 75°', '105°'],
      },
      {
        expr: <Row size="big" align="center">{'65°'}</Row>,
        ok: L("Ha. Yuz o'n besh gradus, chunki qo'shni burchaklar yig'indisi 180.", 'Да. Сто пятнадцать градусов, потому что сумма соседних углов 180.', 'Yes. A hundred fifteen degrees, since the sum of adjacent angles is 180.'),
        question: L("Bir burchak 65° bo'lsa, unga yopishgan burchak qancha?", 'Если один угол 65°, каков прилежащий к нему угол?', 'If one angle is 65°, what is the angle adjacent to it?'),
        items: [
          { id: 'a', right: true, label: '115°' },
          { id: 'b', label: '65°', hint: L("Bu qarama-qarshi burchak uchun to'g'ri bo'lardi, yopishgan burchak uchun emas.", 'Это было бы верно для противоположного угла, а не для прилежащего.', 'That would be true for the opposite angle, not for the adjacent one.') },
        ],
        solution: ['180° − 65°', '115°'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): 2-masala, tomonlar nisbati
// 5:7, perimetri 4,8 sm (15-bet).
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З75',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Tomonlar nisbati va perimetridan tomonlarni toping",
    'Найди стороны по их отношению и периметру',
    'Find the sides from their ratio and the perimeter',
  ),
  audio: [
    A('mount',
      "Parallelogrammning ikki tomoni nisbatda berilgan. Perimetri ma'lum.",
      'Даны две стороны параллелограмма в отношении. Периметр известен.',
      'Two sides of the parallelogram are given as a ratio. The perimeter is known.'),
    A('why',
      "Perimetr, qarama-qarshi tomonlar teng bo'lgani uchun, ikki tomonning ikkilanganiga teng.",
      'Периметр, так как противоположные стороны равны, равен удвоенной сумме двух сторон.',
      'The perimeter, since opposite sides are equal, equals twice the sum of two sides.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar perimetr ikkilangan yig'indiga tenglashtirilgan.",
      'Все три разобраны. Каждый раз периметр приравнивался удвоенной сумме.',
      'All three are done. Each time the perimeter was set equal to twice the sum.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'5x, 7x,   2(5x+7x) = 4,8'}</Row>,
        ok: L("Ha. O'n ikki x ikkilansa, yigirma to'rt x, u to'rt nuqta sakkizga teng, x nolga nuqta ikki.", 'Да. Двадцать четыре икс равно четырём целых восемь, икс равен нолю целых два.', 'Yes. Twenty-four x equals four point eight, x equals zero point two.'),
        question: L("x ning qiymati qancha?", 'Чему равен икс?', 'What is the value of x?'),
        items: [
          { id: 'a', right: true, label: '0,2' },
          { id: 'b', label: '0,4', hint: L("Yigirma to'rt x to'rt nuqta sakkizga teng, x ni to'g'ri toping.", 'Двадцать четыре икс равно четырём целых восемь, найди икс верно.', 'Twenty-four x equals four point eight, find x correctly.') },
        ],
        solution: ['12x = 4,8', 'x = 0,2'],
      },
      {
        expr: <Row size="big" align="center">{'5 · 0,2,   7 · 0,2'}</Row>,
        ok: L("Ha. Besh nolga nuqta ikkiga ko'paytirilsa bir, yetti ko'paytirilsa bir nuqta to'rt.", 'Да. Пять умножить на ноль целых два, единица, семь умножить, одна целая четыре.', 'Yes. Five times zero point two is one, seven times zero point two is one point four.'),
        question: L("Tomonlar necha santimetr?", 'Сколько сантиметров стороны?', 'How many centimetres are the sides?'),
        items: [
          { id: 'a', right: true, label: '1, 1,4' },
          { id: 'b', label: '5, 7', hint: L("Bu nisbatning o'zi, x qiymati bilan ko'paytirilmagan.", 'Это само отношение, не умноженное на значение икс.', 'That is the ratio itself, not multiplied by the value of x.') },
        ],
        solution: ['5·0,2', '1', '7·0,2', '1,4'],
      },
      {
        expr: <Row size="big" align="center">{'1, 1,4, 1, 1,4'}</Row>,
        ok: L("Ha. Bir qo'shilgan bir nuqta to'rt, ikkilansa, to'rt nuqta sakkiz chiqadi.", 'Да. Один плюс одна целая четыре, удвоенное, выходит четыре целых восемь.', 'Yes. One plus one point four, doubled, gives four point eight.'),
        question: L("Perimetr tekshirilsa necha santimetrga teng chiqadi?", 'Сколько сантиметров периметр при проверке?', 'How many centimetres does the perimeter come out to when checked?'),
        items: [
          { id: 'a', right: true, label: '4,8' },
          { id: 'b', label: '2,4', hint: L("Faqat bir marta qo'shilgan, ikkilash unutilgan.", 'Сложено только один раз, забыто удвоение.', 'Added only once, doubling was forgotten.') },
        ],
        solution: ['2(1+1,4)', '4,8'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): diagonalning
// yarmidan to'liq diagonalni topish, javobni son bilan tekshirish (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Diagonalning yarmidan to'liq uzunlikni toping",
    'Найди полную длину диагонали по её половине',
    'Find the full length of the diagonal from its half',
  ),
  audio: [
    A('mount',
      "Uch parallelogramm. Har birida diagonalning bir qismi berilgan.",
      'Три параллелограмма. В каждом дана часть диагонали.',
      'Three parallelograms. In each, part of the diagonal is given.'),
    A('why',
      "Diagonallar kesishish nuqtasida teng ikkiga bo'linadi, shuning uchun ikkilaniladi.",
      'Диагонали делятся точкой пересечения пополам, поэтому умножаем на два.',
      'The diagonals are bisected by the intersection point, so we multiply by two.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar yarmi ikkilanib, hisoblash tekshirilgan.",
      'Все три разобраны. Каждый раз половина умножалась на два и проверялась.',
      'All three are done. Each time the half was doubled and checked.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'AO = 5,3'}</Row>,
        ok: L("Ha. Besh nuqta uch ikkilansa, o'n nuqta olti chiqadi.", 'Да. Пять целых три удвоенное, выходит десять целых шесть.', 'Yes. Five point three doubled gives ten point six.'),
        question: L("AO besh nuqta uch santimetr bo'lsa, diagonal AC nechchi santimetr?", 'Если AO равно пяти целым три десятых сантиметра, сколько сантиметров диагональ AC?', 'If AO is five point three centimetres, how many centimetres is the diagonal AC?'),
        items: [
          { id: 'a', right: true, label: '10,6' },
          { id: 'b', label: '5,3', hint: L("Bu faqat yarmi, ikkilash unutilgan.", 'Это только половина, забыто умножение на два.', 'That is only the half, doubling was forgotten.') },
        ],
        solution: ['5,3 · 2', '10,6'],
      },
      {
        expr: <Row size="big" align="center">{'OC = 4,1'}</Row>,
        ok: L("Ha. AO ham to'rt nuqta bir, chunki OC ga teng.", 'Да. AO тоже четыре целых один, потому что равно OC.', 'Yes. AO is also four point one, because it equals OC.'),
        question: L("OC to'rt nuqta bir santimetr bo'lsa, AO necha santimetr?", 'Если OC равно четырём целым одной десятой сантиметра, чему равен AO?', 'If OC is four point one centimetres, what is AO?'),
        items: [
          { id: 'a', right: true, label: '4,1' },
          { id: 'b', label: '8,2', hint: L("Bu to'liq diagonal AC, AO emas.", 'Это полная диагональ AC, а не AO.', 'That is the full diagonal AC, not AO.') },
        ],
        solution: ['AO = OC', '4,1'],
      },
      {
        expr: <Row size="big" align="center">{'BD = 9,4'}</Row>,
        ok: L("Ha. To'qqiz nuqta to'rt ikkiga bo'linsa, to'rt nuqta yetti chiqadi.", 'Да. Девять целых четыре, разделённое на два, выходит четыре целых семь.', 'Yes. Nine point four divided by two gives four point seven.'),
        question: L("Diagonal BD to'qqiz nuqta to'rt santimetr bo'lsa, DO necha santimetr?", 'Если диагональ BD равна девяти целым четырём десятым сантиметра, чему равен DO?', 'If the diagonal BD is nine point four centimetres, what is DO?'),
        items: [
          { id: 'a', right: true, label: '4,7' },
          { id: 'b', label: '9,4', hint: L("Bu to'liq diagonal BD, uning yarmi emas.", 'Это полная диагональ BD, а не её половина.', 'That is the full diagonal BD, not its half.') },
        ],
        solution: ['9,4 : 2', '4,7'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): diagonallar teng
// deb hisoblangan (З77) va noto'g'ri asos tanlangan (З78).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З77',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato fikrda nima noto'g'ri",
    'Что неверно в двух ошибочных утверждениях',
    'What is wrong in two mistaken statements',
  ),
  audio: [
    A('mount',
      "Ikki fikr aytilgan. Ikkalasida ham parallelogramm haqida xato bor.",
      'Высказаны два утверждения. В обоих есть ошибка о параллелограмме.',
      'Two statements are made. Both contain a mistake about the parallelogram.'),
    A('why',
      "Diagonallar teng emas, faqat teng ikkiga bo'linadi, va isbot chertyozh ko'rinishiga emas, sababga tayanadi.",
      'Диагонали не равны, они лишь делятся пополам, а доказательство строится на причине, а не на виде чертежа.',
      'The diagonals are not equal, they are only bisected, and a proof rests on the reason, not on the look of the drawing.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham parallelogramm xossalarini chalkashtirishdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за путаницы в свойствах параллелограмма.',
      'Both are done. Both mistakes came from confusing the properties of the parallelogram.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'AC = BD'}</Row>,
        ok: L("Ha. Parallelogrammning diagonallari umuman teng emas, faqat kesishish nuqtasida teng ikkiga bo'linadi.", 'Да. Диагонали параллелограмма вообще не равны, они лишь делятся точкой пересечения пополам.', 'Yes. The diagonals of a parallelogram are not equal in general, they are only bisected by their point of intersection.'),
        question: L("ABCD parallelogrammda diagonallar tenglashtirilgan bo'lsa, bu yerda xato qayerda?", 'Если в параллелограмме ABCD диагонали приравнены, в чём здесь ошибка?', 'If in the parallelogram ABCD the diagonals were set equal, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Diagonallar teng deb hisoblangan, bu faqat maxsus holatlarda to'g'ri", 'Диагонали приняты равными, это верно лишь в частных случаях', 'The diagonals were taken as equal, which holds only in special cases') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, umumiy parallelogrammda diagonallar teng emas.", 'Это и есть показанная ошибка, в общем параллелограмме диагонали не равны.', 'This is the very mistake shown; in a general parallelogram the diagonals are not equal.') },
        ],
        solution: ['AO = OC', 'DO = OB'],
      },
      {
        expr: <Row size="big" align="center">{'△ADC = △CBA'}</Row>,
        ok: L("Ha. Chertyozhdagi ko'rinish isbot emas, kerakli asos umumiy tomon va ikki juft almashinuvchi burchak edi.", 'Да. Вид на чертеже не доказательство, нужным обоснованием была общая сторона и две пары накрест лежащих углов.', 'Yes. The look of the drawing is not a proof; the needed justification was the common side and two pairs of alternate angles.'),
        question: L("Bu tenglik chertyozhda bir xil ko'rinishi asos qilib olingan bo'lsa, bu yerda xato qayerda?", 'Если это равенство обосновано тем, что на чертеже они выглядят одинаково, в чём здесь ошибка?', 'If this equality was justified by the two triangles looking the same on the drawing, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Isbot o'rniga chertyozhning ko'rinishi asos qilib olingan", 'Вместо доказательства взят вид чертежа', 'The look of the drawing was taken as the justification instead of a proof') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, ko'rinish hech qachon isbot o'rnini bosmaydi.", 'Это и есть показанная ошибка, внешний вид никогда не заменяет доказательство.', 'This is the very mistake shown; appearance never replaces a proof.') },
        ],
        solution: ['AC — umumiy tomon', "∠1=∠3, ∠2=∠4"],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): 3-teorema, qo'shni
// burchaklarni qadamlab hisoblash.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З76',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Bir burchakdan qo'shni burchakni qadamlab toping",
    'Найди соседний угол по одному углу, по шагам',
    'Find the adjacent angle from one angle, step by step',
  ),
  audio: [
    A('mount',
      "Bir burchak berilgan. Qo'shni burchakni 180 gradusdan ayirib toping.",
      'Дан один угол. Найди соседний, отняв его от 180 градусов.',
      'One angle is given. Find the adjacent one by subtracting it from 180 degrees.'),
    A('why',
      "Qo'shni burchaklar yig'indisi doim 180 gradus, boshqa hech qanday son emas.",
      'Сумма соседних углов всегда 180 градусов, и никакое другое число.',
      'The sum of adjacent angles is always 180 degrees, no other number.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar 180 gradusdan berilgan burchak ayirilgan.",
      'Все три заполнены. Каждый раз из ста восьмидесяти градусов вычитался данный угол.',
      'All three are filled. Each time the given angle was subtracted from a hundred eighty degrees.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['180°', '115°'],
      lines: [
        [{ t: '65°   →   ' }, { slot: '180°' }, { t: ' − 65° = ' }, { slot: '115°' }],
      ],
    },
    tasks: [
      {
        chips: ['180°', '100°'],
        lines: [
          [{ t: '80°   →   ' }, { slot: '180°' }, { t: ' − 80° = ' }, { slot: '100°' }],
        ],
      },
      {
        chips: ['180°', '145°'],
        lines: [
          [{ t: '35°   →   ' }, { slot: '180°' }, { t: ' − 35° = ' }, { slot: '145°' }],
        ],
      },
      {
        chips: ['180°', '78°'],
        lines: [
          [{ t: '102°   →   ' }, { slot: '180°' }, { t: ' − 102° = ' }, { slot: '78°' }],
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
    "Parallelogramm bo'yicha to'rt savol",
    'Четыре вопроса о параллелограмме',
    'Four questions about the parallelogram',
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
        id: 'q1', tag: 'З75',
        ask: L('Parallelogrammning ta\'rifi qaysi?', 'Каково определение параллелограмма?', 'What is the definition of a parallelogram?'),
        options: [
          { id: 'ok', right: true, label: L("Qarama-qarshi tomonlari parallel to'rtburchak", 'Четырёхугольник с параллельными противоположными сторонами', 'A quadrilateral with parallel opposite sides') },
          { id: 'no', label: L("Qarama-qarshi tomonlari teng to'rtburchak", 'Четырёхугольник с равными противоположными сторонами', 'A quadrilateral with equal opposite sides') },
        ],
        hint: L("Tenglik NATIJA, ta'rifning o'zi parallellik haqida.", 'Равенство это СЛЕДСТВИЕ, само определение о параллельности.', 'Equality is a CONSEQUENCE, the definition itself is about parallelism.'),
        ok: L("To'g'ri, ta'rif parallellik haqida.", 'Верно, определение о параллельности.', 'Correct, the definition is about parallelism.'),
      },
      {
        id: 'q2', tag: 'З76',
        ask: L('Ikki burchak yig\'indisi 140° bo\'lsa, ular qo\'shni bo\'la oladimi?', 'Могут ли два угла с суммой 140° быть соседними?', 'Can two angles with a sum of 140° be adjacent?'),
        options: [
          { id: 'ok', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'no', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Qo'shni burchaklar yig'indisi doim aynan 180 gradus.", 'Сумма соседних углов всегда ровно 180 градусов.', 'The sum of adjacent angles is always exactly 180 degrees.'),
        ok: L("To'g'ri, 140 gradus 180 dan farq qiladi, demak ular qarama-qarshi.", 'Верно, 140 градусов отличается от 180, значит они противоположные.', 'Correct, 140 degrees differs from 180, so they are opposite.'),
      },
      {
        id: 'q3', tag: 'З77',
        ask: L('Parallelogrammning diagonallari doim tengmi?', 'Всегда ли равны диагонали параллелограмма?', 'Are the diagonals of a parallelogram always equal?'),
        options: [
          { id: 'ok', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'no', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Ular faqat kesishish nuqtasida teng ikkiga bo'linadi, teng bo'lishi shart emas.", 'Они лишь делятся точкой пересечения пополам, равными быть не обязаны.', 'They are only bisected by the intersection point, they need not be equal.'),
        ok: L("To'g'ri, diagonallar teng ikkiga bo'linadi, lekin o'zaro teng emas.", 'Верно, диагонали делятся пополам, но не равны друг другу.', 'Correct, the diagonals are bisected, but not equal to each other.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('Burchaklar 86°, 94°, 86°, 94° bo\'lsa, yig\'indisi 360°ga tengmi?', 'Если углы 86°, 94°, 86°, 94°, равна ли их сумма 360°?', 'If the angles are 86°, 94°, 86°, 94°, does their sum equal 360°?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Qo'shib ko'ring, to'rtburchak burchaklari yig'indisi doim 360 gradus.", 'Сложи, сумма углов четырёхугольника всегда 360 градусов.', 'Add them up, the angle sum of a quadrilateral is always 360 degrees.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З75',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Parallelogrammning teng tomonlari va burchaklarini yig'ing.",
            'Собери равные стороны и углы параллелограмма.',
            'Assemble the equal sides and angles of the parallelogram.',
          ),
          lines: [
            [{ t: 'AB = ' }, { slot: 'CD' }, { t: ',   ∠A = ' }, { slot: '∠C' }],
          ],
          tiles: [
            { id: 't1', v: 'CD', x: 12, y: 12 },
            { id: 't2', v: '∠C', x: 70, y: 14 },
            { id: 't3', v: 'BC', x: 40, y: 50 },
            { id: 't4', v: '∠B', x: 78, y: 48 },
          ],
          hint: L(
            "AB ga qarama-qarshi tomon CD, burchak A ga qarama-qarshi burchak C.",
            'Противоположная AB сторона это CD, противоположный углу A угол C.',
            'The side opposite AB is CD, the angle opposite angle A is angle C.',
          ),
          doneNote: L(
            "Yig'ildi. Qarama-qarshi tomonlar va burchaklar teng.",
            'Собрано. Противоположные стороны и углы равны.',
            'Assembled. The opposite sides and angles are equal.',
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
  role: 'summary',
  tool: 'takeaway',
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Tomonlar parallel, tomonlar va burchaklar teng, diagonallar teng ikkiga bo'linadi",
    'Стороны параллельны, стороны и углы равны, диагонали делятся пополам',
    'The sides are parallel, the sides and angles are equal, the diagonals bisect each other',
  ),
  audio: [
    A('s0',
      "Darsdan bitta chertyozh qoladi. Uch xossa bir chertyozhda ko'rinadi.",
      'С урока остаётся один чертёж. Три свойства видны на одном чертеже.',
      'One drawing stays with you. Three properties are visible on one drawing.'),
    A('s1',
      "Bugun uch narsa qilindi. Diagonal orqali ikki uchburchakning tengligini isbotladingiz, qarama-qarshi tomon va burchaklarning tengligini ko'rdingiz va diagonallarning teng ikkiga bo'linishini bildingiz.",
      'Сегодня сделано три вещи. Ты доказал равенство двух треугольников через диагональ, увидел равенство противоположных сторон и углов, и узнал, что диагонали делятся пополам.',
      'Three things are done today. You proved the equality of two triangles through the diagonal, saw the equality of opposite sides and angles, and learned that the diagonals bisect each other.'),
    A('s2',
      "Keyingi darsda to'rtburchakning maxsus turlari. To'g'ri to'rtburchak, romb va kvadrat, parallelogrammning xususiy holatlari sifatida.",
      'В следующем уроке особые виды четырёхугольника. Прямоугольник, ромб и квадрат, как частные случаи параллелограмма.',
      'The next lesson covers special types of quadrilaterals. The rectangle, rhombus, and square, as special cases of the parallelogram.',
    ),
  ],
  props: {
    mark: 'AB = CD,  AD = BC,  AO = OC,  DO = OB',
    markNote: L(
      "qo'shni burchaklar yig'indisi 180°",
      'сумма соседних углов 180°',
      'the sum of adjacent angles is 180°',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: to'g'ri to'rtburchak, romb va kvadrat",
      'Следующий урок: прямоугольник, ромб и квадрат',
      'Next lesson: the rectangle, the rhombus, and the square',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan (§0 izohiga
// qarang): rol tartibi algebra bilan bir xil, asboblar boshqa.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
