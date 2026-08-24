// ============================================================================
// 8-sinf, Dars 38. TO'G'RI TO'RTBURCHAK, ROMB VA KVADRAT.
//
// BLOK Б6. Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`, `geofigure.jsx`,
// `prooflines.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da. Yangi pribor
// YO'Q — Dars 37 da yozilgan `GeoFigure` va `ProofLines` qayta ishlatiladi.
//
// KARKAS: Dars 37 dagidek, SCREENS to'g'ridan-to'g'ri qurilgan (rol tartibi
// bir xil, asboblar geometriyaga mos).
//
// MANBA: 8-sinf geometriya darsligi, I bob, 5-, 6-, 7-mavzular (20-25-bet).
// Uch mavzu bitta darsga birlashtirilgan (rejaga ko'ra). Barcha ta'rif,
// teorema va misollar darslikdan:
//   - 5-mavzu (20-21-bet): to'g'ri to'rtburchak, ta'rif va diagonallari
//     teng ekanligi teoremasi; 2-masala (AP=17, PD=21, bissektrisa) —
//     perimetr 110; 3-masala (perimetr 24, BD=9) — uchburchak perimetri 21;
//   - 6-mavzu (23-bet): romb, ta'rif va diagonallari perpendikulyar hamda
//     burchaklarni teng ikkiga bo'lishi; 1-masala (burchak 35°) — burchaklar
//     70°,110°,70°,110°;
//   - 7-mavzu (25-bet): kvadrat, ta'rif va uch xossa; 2-masala — diagonallari
//     teng VA perpendikulyar bo'lishi HALI kvadrat qilmaydi, ular kesishish
//     nuqtasida teng ikkiga ham bo'linishi kerak (49-rasm, muhim ogohlantirish).
//
// ADASHISHLAR, ikkitasi yangi:
//   З79, diagonallari teng va perpendikulyar bo'lishi kvadrat uchun yetarli
//   deb hisoblangan, teng ikkiga bo'linishi unutilgan;
//   З80, to'g'ri to'rtburchak va romb xossalari aralashtirilgan (diagonal
//   burchakni teng ikkiga bo'lishi — romb xossasi, to'g'ri to'rtburchakka
//   tegishli emas);
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
  id: 'geo-8-38',
  n: 38,
  row: 43,
  block: 'Б6',
  topic: L(
    "To'g'ri to'rtburchak, romb va kvadrat",
    'Прямоугольник, ромб и квадрат',
    'The rectangle, the rhombus, and the square',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Hamma burchaklari to'g'ri bo'lgan parallelogramm to'g'ri to'rtburchak deyiladi, uning diagonallari teng",
    'Параллелограмм, у которого все углы прямые, называется прямоугольником, его диагонали равны',
    'A parallelogram with all right angles is called a rectangle, its diagonals are equal',
  ),
  L(
    "Tomonlari teng bo'lgan parallelogramm romb deyiladi, uning diagonallari perpendikulyar va burchaklarni teng ikkiga bo'ladi",
    'Параллелограмм с равными сторонами называется ромбом, его диагонали перпендикулярны и делят углы пополам',
    'A parallelogram with equal sides is called a rhombus, its diagonals are perpendicular and bisect its angles',
  ),
  L(
    "Tomonlari teng bo'lgan to'g'ri to'rtburchak kvadrat deyiladi, u ham to'g'ri to'rtburchak, ham rombning barcha xossalariga ega",
    'Прямоугольник с равными сторонами называется квадратом, он обладает всеми свойствами и прямоугольника, и ромба',
    'A rectangle with equal sides is called a square, it has all the properties of both the rectangle and the rhombus',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З79': {
    what: L(
      "diagonallari teng va perpendikulyar bo'lishi kvadrat uchun yetarli deb hisoblangan, teng ikkiga bo'linishi unutilgan",
      'равенство и перпендикулярность диагоналей приняты достаточными для квадрата, забыто деление пополам',
      'equal and perpendicular diagonals were taken as sufficient for a square, bisection was forgotten',
    ),
    wrong: null,
    at: 12,
  },
  'З80': {
    what: L(
      "to'g'ri to'rtburchak va romb xossalari aralashtirilgan",
      'свойства прямоугольника и ромба перепутаны',
      'the properties of the rectangle and the rhombus were mixed up',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI. To'g'ri to'rtburchak (3-4-ekran) va romb
// (5-6-ekran) uchun.
// ============================================================
const RECT = { A: [15, 82], B: [15, 18], C: [95, 18], D: [95, 82] }
const RECT_ORDER = ['A', 'B', 'C', 'D']
const RHOMB = { A: [15, 50], B: [55, 20], C: [95, 50], D: [55, 80] }
const RHOMB_ORDER = ['A', 'B', 'C', 'D']

// ============================================================
// SAHNALAR (§6). Xuk: qaysi shart HAM to'g'ri to'rtburchak, HAM romb
// qiladi. Yakun: uch shakl, bitta ierarxiya.
// ============================================================
const SC_ASK = L('QAYSI SHAKL IKKALASI HAM', 'КАКАЯ ФИГУРА И ТО, И ДРУГОЕ', 'WHICH SHAPE IS BOTH AT ONCE')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <rect x="150" y="30" width="60" height="60" fill="none" stroke={T.ink3} strokeWidth="1.6" transform="rotate(0 180 60)"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="180" cy="60" r="15" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="180" y="66" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "To'g'ri to'rtburchak va romb kesishgan joyida kvadrat turadi",
      'На пересечении прямоугольника и ромба стоит квадрат',
      'At the intersection of the rectangle and the rhombus stands the square',
    )}>
      <text x="190" y="45" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fill={T.ink}>{"to'g'ri to'rtburchak: burchaklari 90°, diagonallari teng"}</text>
      <text x="190" y="65" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fill={T.ink}>{"romb: tomonlari teng, diagonallari perpendikulyar"}</text>
      <g className="g8-seat" style={{ '--d': '1500ms' }}>
        <text x="190" y="95" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fontWeight="700" fill={T.ok}>{'kvadrat = ikkalasi ham'}</text>
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
  eyebrow: L('IKKALA XOSSAGA EGA SHAKL', 'ФИГУРА С ОБОИМИ СВОЙСТВАМИ', 'A SHAPE WITH BOTH PROPERTIES'),
  title: L(
    "Parallelogramm qanday shart bilan HAM to'g'ri to'rtburchak, HAM romb bo'ladi",
    'При каком условии параллелограмм одновременно и прямоугольник, и ромб',
    'Under what condition is a parallelogram both a rectangle and a rhombus at once',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "To'g'ri to'rtburchakning burchaklari to'g'ri, rombning tomonlari teng. Ikkalasi birga bo'lishi mumkin.",
      'У прямоугольника углы прямые, у ромба стороны равны. Оба свойства могут быть вместе.',
      'A rectangle has right angles, a rhombus has equal sides. Both can hold at once.'),
    A('why',
      "Taxmin qiling, qaysi shart ikkalasini ham birlashtiradi.",
      'Предположи, какое условие объединяет оба.',
      'Predict which condition unites both.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Qaysi shart parallelogrammni HAM to'g'ri to'rtburchak, HAM romb qiladi?",
      'Какое условие делает параллелограмм одновременно и прямоугольником, и ромбом?',
      'Which condition makes a parallelogram both a rectangle and a rhombus at once?',
    ),
    items: [
      { id: 'a', show: L("Burchaklari to'g'ri va tomonlari teng", 'Углы прямые и стороны равны', 'The angles are right and the sides are equal') },
      { id: 'b', show: L("Faqat diagonallari teng", 'Только диагонали равны', 'Only the diagonals are equal') },
      { id: 'c', show: L("Faqat tomonlari parallel", 'Только стороны параллельны', 'Only the sides are parallel') },
      { id: 'd', show: L("Faqat bitta burchagi to'g'ri", 'Только один угол прямой', 'Only one angle is right') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Dars 37 dan: parallelogrammning diagonallari teng
// ikkiga bo'linadi, LEKIN o'zaro teng emas.
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "O'tgan darsni eslash: parallelogramm diagonallari",
    'Вспоминаем прошлый урок: диагонали параллелограмма',
    'Recalling last lesson: the diagonals of a parallelogram',
  ),
  audio: [
    A('mount',
      "O'tgan darsda parallelogrammning diagonallari haqida bir fakt isbotlangan edi.",
      'На прошлом уроке был доказан один факт о диагоналях параллелограмма.',
      'Last lesson, one fact about the diagonals of a parallelogram was proven.'),
    A('why',
      "Umumiy parallelogrammda diagonallar qanday bo'lishini eslang.",
      'Вспомни, какими бывают диагонали в общем параллелограмме.',
      'Recall what the diagonals are like in a general parallelogram.'),
  ],
  props: {
    ask: L(
      "Umumiy parallelogrammning diagonallari haqida qaysi gap to'g'ri?",
      'Какое утверждение верно о диагоналях общего параллелограмма?',
      'Which statement is true about the diagonals of a general parallelogram?',
    ),
    items: [
      { id: 'right', show: L("Kesishish nuqtasida teng ikkiga bo'linadi, lekin o'zaro teng emas", 'Делятся точкой пересечения пополам, но не равны друг другу', 'They are bisected by the intersection point, but not equal to each other'), right: true, name: L("dars 37 ning asosiy natijasi", 'главный результат урока 37', 'the main result of lesson 37') },
      {
        id: 'wrong1', show: L("O'zaro teng", 'Равны друг другу', 'Equal to each other'),
        hint: L("Bu faqat maxsus holatda, umumiy parallelogrammda emas.", 'Это верно лишь в частном случае, а не в общем параллелограмме.', 'This holds only in a special case, not in a general parallelogram.'),
      },
      {
        id: 'wrong2', show: L("O'zaro perpendikulyar", 'Перпендикулярны друг другу', 'Perpendicular to each other'),
        hint: L("Bu ham faqat maxsus holatda to'g'ri.", 'Это тоже верно лишь в частном случае.', 'This too holds only in a special case.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun aynan qaysi maxsus holatlarda diagonallar teng yoki perpendikulyar bo'lishini ko'ramiz.",
      'Верно. Сегодня увидим, в каких именно частных случаях диагонали равны или перпендикулярны.',
      'Correct. Today we will see in which special cases exactly the diagonals are equal or perpendicular.',
    ),
  },
}

// ============================================================
// EKRAN 3. BURCHAKLARGA TAP (`geofigure`). To'g'ri to'rtburchak ta'rifi:
// barcha burchaklar to'g'ri.
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'geofigure',
  tag: 'З80',
  eyebrow: L('BARCHA BURCHAKLARNI TEKSHIRING', 'ПРОВЕРЬ ВСЕ УГЛЫ', 'CHECK ALL THE ANGLES'),
  title: L(
    "To'g'ri to'rtburchakda barcha burchaklarni belgilang",
    'Отметь все углы прямоугольника',
    'Mark all the angles of the rectangle',
  ),
  audio: [
    A('mount',
      "ABCD chertyozhda turibdi. To'g'ri to'rtburchakning ta'rifi barcha burchaklar to'g'ri ekanligidan iborat.",
      'На чертеже стоит ABCD. Определение прямоугольника в том, что все углы прямые.',
      'ABCD stands on the drawing. The definition of a rectangle is that all angles are right.'),
    A('why',
      "To'rtta burchakning barchasini bosib chiqing.",
      'Нажми все четыре угла по очереди.',
      'Tap all four angles one by one.'),
  ],
  props: {
    points: RECT,
    order: RECT_ORDER,
    steps: [
      {
        kind: 'angles',
        targets: ['A', 'B', 'C', 'D'],
        ask: L("Barcha burchaklarni bosing", 'Нажми все углы', 'Tap all the angles'),
        hints: { '*': L("Har bir burchak bosilishi kerak, birontasi ham qolmasin.", 'Каждый угол нужно нажать, ни один не пропустить.', 'Every angle must be tapped, none skipped.') },
      },
    ],
    after: L(
      "To'g'ri. Hamma burchaklari to'g'ri bo'lgan parallelogramm, to'g'ri to'rtburchak deyiladi.",
      'Верно. Параллелограмм, у которого все углы прямые, называется прямоугольником.',
      'Correct. A parallelogram whose angles are all right is called a rectangle.',
    ),
  },
}

// ============================================================
// EKRAN 4. ISBOT (`prooflines`). To'g'ri to'rtburchakning diagonallari
// teng. Ловушка, chertyozh ko'rinishiga tayanish (З78 uslubida, lekin
// bu darsda tegishli tag З80).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З80',
  eyebrow: L('DIAGONALLARNI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ПРО ДИАГОНАЛИ', 'PROVING ABOUT THE DIAGONALS'),
  title: L(
    "To'g'ri to'rtburchakning diagonallari o'zaro teng",
    'Диагонали прямоугольника равны друг другу',
    'The diagonals of a rectangle are equal to each other',
  ),
  audio: [
    A('mount',
      "ABCD to'g'ri to'rtburchak. Uchburchak ACD va DBA to'g'ri burchakli uchburchaklar.",
      'ABCD, прямоугольник. Треугольники ACD и DBA прямоугольные.',
      'ABCD is a rectangle. Triangles ACD and DBA are right triangles.'),
    A('why',
      "Ikki katet bo'yicha tenglikni isbotlab, gipotenuzalarning tengligiga o'tamiz.",
      'Доказав равенство по двум катетам, переходим к равенству гипотенуз.',
      'Having proven equality by two legs, we move to the equality of the hypotenuses.'),
  ],
  props: {
    points: RECT,
    order: RECT_ORDER,
    marks: [['A', 'C'], ['B', 'D']],
    given: [
      L("ABCD, to'g'ri to'rtburchak", 'ABCD, прямоугольник', 'ABCD, a rectangle'),
    ],
    goal: L("AC = BD", 'AC = BD', 'AC = BD'),
    lines: [
      {
        text: L("AD, ikkala uchburchakka umumiy katet", 'AD, общий катет обоих треугольников', 'AD, the common leg of both triangles'),
        options: [
          { id: 'ok', right: true, label: L("Umumiy katet", 'Общий катет', 'A common leg') },
          { id: 'no', label: L("Umumiy gipotenuza", 'Общая гипотенуза', 'A common hypotenuse'), hint: L("AD to'g'ri burchakka tutashgan tomon, u katet, gipotenuza emas.", 'AD стороны, прилежащие к прямому углу, это катет, а не гипотенуза.', 'AD is a side adjacent to the right angle, it is a leg, not a hypotenuse.') },
        ],
      },
      {
        text: L("CD teng BA ga", 'CD равна BA', 'CD equals BA'),
        options: [
          { id: 'ok', right: true, label: L("To'g'ri to'rtburchak parallelogramm, qarama-qarshi tomonlar teng", 'Прямоугольник это параллелограмм, противоположные стороны равны', 'A rectangle is a parallelogram, opposite sides are equal') },
          { id: 'no', label: L("Chertyozhda teng ko'rinadi", 'На чертеже выглядят равными', 'They look equal on the drawing'), hint: L("Ko'rinish isbot emas, parallelogrammning xossasidan foydalaning.", 'Внешний вид не доказательство, используй свойство параллелограмма.', 'Appearance is not a proof, use the property of the parallelogram.') },
        ],
      },
      {
        text: L("uchburchak ACD uchburchak DBA ga teng", 'треугольник ACD равен треугольнику DBA', 'triangle ACD equals triangle DBA'),
        options: [
          { id: 'ok', right: true, label: L("Ikki katet bo'yicha (to'g'ri burchakli uchburchaklar belgisi)", 'По двум катетам (признак прямоугольных треугольников)', 'By two legs (criterion for right triangles)') },
          { id: 'no', label: L("Tomon, burchak, burchak bo'yicha", 'По стороне и двум углам', 'By a side and two angles'), hint: L("Bizda ikki tomon (katetlar) bor, burchaklar haqida alohida ma'lumot berilmagan.", 'У нас есть две стороны (катеты), про углы отдельных данных нет.', 'We have two sides (the legs), no separate data about angles was given.') },
        ],
      },
      {
        text: L("shuning uchun AC teng BD ga", 'поэтому AC равна BD', 'therefore AC equals BD'),
        options: [
          { id: 'ok', right: true, label: L("Teng uchburchaklarning mos gipotenuzalari", 'Соответственные гипотенузы равных треугольников', 'Corresponding hypotenuses of equal triangles') },
          { id: 'no', label: L("Ikkalasi ham diagonal bo'lgani uchun", 'Потому что оба являются диагоналями', 'Because both are diagonals'), hint: L("Diagonal bo'lishning o'zi tenglikni bermaydi, aynan shu isbot kerak edi.", 'Само по себе быть диагональю не даёт равенства, именно это и требовалось доказать.', 'Merely being a diagonal does not give equality, that is exactly what needed proving.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. To'g'ri to'rtburchakning diagonallari, umumiy parallelogrammdan farqli, o'zaro teng.",
      'Доказано. Диагонали прямоугольника, в отличие от общего параллелограмма, равны друг другу.',
      'Proven. The diagonals of a rectangle, unlike a general parallelogram, are equal to each other.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI (`geofigure`). Romb ta'rifi: barcha
// tomonlar teng.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'geofigure',
  tag: 'З80',
  eyebrow: L('TENG TOMONLARNI BELGILANG', 'ОТМЕТЬ РАВНЫЕ СТОРОНЫ', 'MARK THE EQUAL SIDES'),
  title: L(
    "Rombning barcha tomonlarini belgilang",
    'Отметь все стороны ромба',
    'Mark all the sides of the rhombus',
  ),
  audio: [
    A('mount',
      "ABCD chertyozhda turibdi. Rombning ta'rifi barcha tomonlar teng ekanligidan iborat.",
      'На чертеже стоит ABCD. Определение ромба в том, что все стороны равны.',
      'ABCD stands on the drawing. The definition of a rhombus is that all sides are equal.'),
    A('why',
      "To'rtta tomonning barchasini bosib chiqing.",
      'Нажми все четыре стороны по очереди.',
      'Tap all four sides one by one.'),
    W('mark',
      "Hammasi teng. To'g'ri to'rtburchakda burchaklar to'g'ri edi, rombda esa tomonlar teng.",
      'Все равны. В прямоугольнике углы были прямыми, а в ромбе равны стороны.',
      'All are equal. In the rectangle the angles were right, in the rhombus the sides are equal.'),
  ],
  props: {
    points: RHOMB,
    order: RHOMB_ORDER,
    steps: [
      {
        kind: 'edges',
        targets: ['AB', 'BC', 'CD', 'AD'],
        ask: L("Barcha tomonlarni bosing", 'Нажми все стороны', 'Tap all the sides'),
        hints: { '*': L("Har bir tomon bosilishi kerak, birontasi ham qolmasin.", 'Каждую сторону нужно нажать, ни одну не пропустить.', 'Every side must be tapped, none skipped.') },
      },
    ],
    after: L(
      "To'g'ri. Tomonlari teng bo'lgan parallelogramm, romb deyiladi.",
      'Верно. Параллелограмм с равными сторонами называется ромбом.',
      'Correct. A parallelogram with equal sides is called a rhombus.',
    ),
  },
}

// ============================================================
// EKRAN 6. ISBOT (`prooflines`). Rombning diagonallari perpendikulyar
// va burchaklarni teng ikkiga bo'ladi.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З80',
  eyebrow: L('DIAGONALLARNI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ПРО ДИАГОНАЛИ', 'PROVING ABOUT THE DIAGONALS'),
  title: L(
    "Rombning diagonallari perpendikulyar va burchaklarini teng ikkiga bo'ladi",
    'Диагонали ромба перпендикулярны и делят его углы пополам',
    'The diagonals of a rhombus are perpendicular and bisect its angles',
  ),
  audio: [
    A('mount',
      "ABCD romb, O diagonallarning kesishish nuqtasi. Uchburchak BAD teng yonli.",
      'ABCD, ромб, O точка пересечения диагоналей. Треугольник BAD равнобедренный.',
      'ABCD is a rhombus, O is the intersection of the diagonals. Triangle BAD is isosceles.'),
    A('why',
      "Teng yonli uchburchakda asosga tushirilgan mediana bissektrisa va balandlik bilan bir xil ekanidan foydalanamiz.",
      'Используем, что в равнобедренном треугольнике медиана к основанию совпадает с биссектрисой и высотой.',
      'We use that in an isosceles triangle the median to the base coincides with the bisector and the height.'),
  ],
  props: {
    points: RHOMB,
    order: RHOMB_ORDER,
    marks: [['A', 'C'], ['B', 'D']],
    given: [
      L("ABCD, romb", 'ABCD, ромб', 'ABCD, a rhombus'),
      L("O, diagonallarning kesishish nuqtasi", 'O, точка пересечения диагоналей', 'O, the intersection point of the diagonals'),
    ],
    goal: L("AC perpendikulyar BD, burchak BAC teng burchak DAC ga", 'AC перпендикулярна BD, угол BAC равен углу DAC', 'AC is perpendicular to BD, angle BAC equals angle DAC'),
    lines: [
      {
        text: L("AB teng AD ga", 'AB равна AD', 'AB equals AD'),
        options: [
          { id: 'ok', right: true, label: L("Rombning ta'rifiga ko'ra, barcha tomonlar teng", 'По определению ромба, все стороны равны', 'By the definition of a rhombus, all sides are equal') },
          { id: 'no', label: L("Parallelogrammning xossasiga ko'ra", 'По свойству параллелограмма', 'By the property of the parallelogram'), hint: L("Parallelogramm faqat qarama-qarshi tomonlarni teng qiladi, AB va AD esa qo'shni tomonlar.", 'Параллелограмм делает равными только противоположные стороны, а AB и AD соседние.', 'A parallelogram only makes opposite sides equal, but AB and AD are adjacent.') },
        ],
      },
      {
        text: L("BO teng OD ga", 'BO равна OD', 'BO equals OD'),
        options: [
          { id: 'ok', right: true, label: L("Parallelogrammning diagonallari kesishish nuqtasida teng ikkiga bo'linadi", 'Диагонали параллелограмма делятся точкой пересечения пополам', 'The diagonals of a parallelogram are bisected by their point of intersection') },
          { id: 'no', label: L("Rombning ta'rifiga ko'ra", 'По определению ромба', 'By the definition of a rhombus'), hint: L("Bu diagonallar bo'linishi umumiy parallelogrammning xossasi, romb ta'rifidan emas.", 'Деление диагоналей это свойство общего параллелограмма, а не определения ромба.', 'The bisection of diagonals is a property of a general parallelogram, not the rhombus definition.') },
        ],
      },
      {
        text: L("AO, teng yonli BAD uchburchakning asosga tushirilgan medianasi", 'AO, медиана равнобедренного треугольника BAD к основанию', 'AO, the median of isosceles triangle BAD to its base'),
        options: [
          { id: 'ok', right: true, label: L("AB=AD bo'lgani uchun BAD teng yonli, BO=OD bo'lgani uchun AO uning medianasi", 'BAD равнобедренный, так как AB=AD, а AO его медиана, так как BO=OD', 'BAD is isosceles since AB=AD, and AO is its median since BO=OD') },
          { id: 'no', label: L("Chunki romb simmetrik shakl", 'Потому что ромб симметричная фигура', 'Because a rhombus is a symmetric shape'), hint: L("Simmetriyaning umumiy ko'rinishi isbot emas, aniq uchburchak orqali asoslash kerak.", 'Общий вид симметрии не доказательство, нужно обосновать через конкретный треугольник.', 'A general appeal to symmetry is not a proof, it must be justified through the specific triangle.') },
        ],
      },
      {
        text: L("shuning uchun AC perpendikulyar BD, va burchak BAC teng burchak DAC ga", 'поэтому AC перпендикулярна BD, и угол BAC равен углу DAC', 'therefore AC is perpendicular to BD, and angle BAC equals angle DAC'),
        options: [
          { id: 'ok', right: true, label: L("Teng yonli uchburchakda asosga tushirilgan mediana bissektrisa va balandlik ham bo'ladi", 'В равнобедренном треугольнике медиана к основанию является также биссектрисой и высотой', 'In an isosceles triangle the median to the base is also the bisector and the height') },
          { id: 'no', label: L("Chunki diagonallar teng", 'Потому что диагонали равны', 'Because the diagonals are equal'), hint: L("Rombning diagonallari umuman teng emas, ular perpendikulyar bo'lishi boshqa sababga tayanadi.", 'Диагонали ромба вообще не равны, их перпендикулярность обоснована иначе.', 'The diagonals of a rhombus are not equal in general; their perpendicularity rests on a different reason.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. Bissektrisa bo'lgani uchun burchak teng ikkiga bo'linadi, balandlik bo'lgani uchun diagonallar perpendikulyar.",
      'Доказано. Будучи биссектрисой, угол делится пополам, будучи высотой, диагонали перпендикулярны.',
      'Proven. Being the bisector, the angle is split in half; being the height, the diagonals are perpendicular.',
    ),
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): kvadrat, ikkalasining
// kesishmasi.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З79',
  eyebrow: L('KVADRAT, IKKALASI HAM', 'КВАДРАТ, ОБА ВМЕСТЕ', 'THE SQUARE, BOTH AT ONCE'),
  title: L(
    "Kvadrat, to'g'ri to'rtburchak va rombning kesishmasi",
    'Квадрат, пересечение прямоугольника и ромба',
    'The square, the intersection of the rectangle and the rhombus',
  ),
  audio: [
    A('mount',
      "Kvadrat, tomonlari teng bo'lgan to'g'ri to'rtburchak. U ikkalasining barcha xossalarini oladi.",
      'Квадрат, прямоугольник с равными сторонами. Он берёт все свойства обоих.',
      'A square is a rectangle with equal sides. It takes all the properties of both.'),
    W('p2',
      "To'g'ri to'rtburchakdan, burchaklarning to'g'riligi va diagonallarning tengligini oladi.",
      'От прямоугольника берёт прямоту углов и равенство диагоналей.',
      'From the rectangle it takes the rightness of the angles and the equality of the diagonals.'),
    W('p4',
      "Rombdan, tomonlarning tengligi va diagonallarning perpendikulyarligini, burchaklarni teng ikkiga bo'lishini oladi.",
      'От ромба берёт равенство сторон, перпендикулярность диагоналей и деление углов пополам.',
      'From the rhombus it takes the equality of the sides, the perpendicularity of the diagonals, and the bisection of the angles.',
    ),
  ],
  props: {
    tokens: [
      { t: '□', id: 'a' },
      { t: '  +  ', id: 'mid' },
      { t: '◇', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi manba, to'g'ri to'rtburchak. Burchaklar to'g'ri, diagonallar teng.",
          'Первый источник, прямоугольник. Углы прямые, диагонали равны.',
          'The first source, the rectangle. The angles are right, the diagonals are equal.',
        ),
      },
      {
        focus: 'mid',
        text: L(
          "Ikkinchi manba qo'shiladi, ikkalasi bir shaklda birlashadi.",
          'Добавляется второй источник, оба объединяются в одной фигуре.',
          'The second source is added, both unite in one shape.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi manba, romb. Tomonlar teng, diagonallar perpendikulyar va burchaklarni teng ikkiga bo'ladi.",
          'Второй источник, ромб. Стороны равны, диагонали перпендикулярны и делят углы пополам.',
          'The second source, the rhombus. The sides are equal, the diagonals are perpendicular and bisect the angles.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Diagonallari teng VA perpendikulyar bo'lgan to'rtburchak hali ham kvadrat bo'lmasligi mumkin, agar ular kesishish nuqtasida teng ikkiga bo'linmasa.",
        'Четырёхугольник с равными И перпендикулярными диагоналями всё ещё может не быть квадратом, если они не делятся точкой пересечения пополам.',
        'A quadrilateral with equal AND perpendicular diagonals may still not be a square, if they are not bisected by their point of intersection.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Darslik 5-, 6-, 7-mavzu
// ta'riflari.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З79',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "To'g'ri to'rtburchak, romb va kvadrat",
    'Прямоугольник, ромб и квадрат',
    'The rectangle, the rhombus, and the square',
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
      { id: 'f1', label: L("hamma burchaklari to'g'ri bo'lgan parallelogramm to'g'ri to'rtburchak, uning diagonallari teng", 'параллелограмм с прямыми углами это прямоугольник, его диагонали равны', 'a parallelogram with right angles is a rectangle, its diagonals are equal') },
      { id: 'f2', label: L("tomonlari teng bo'lgan parallelogramm romb, uning diagonallari perpendikulyar va burchaklarni teng ikkiga bo'ladi", 'параллелограмм с равными сторонами это ромб, его диагонали перпендикулярны и делят углы пополам', 'a parallelogram with equal sides is a rhombus, its diagonals are perpendicular and bisect the angles') },
      { id: 'f3', label: L("tomonlari teng bo'lgan to'g'ri to'rtburchak kvadrat, u ikkalasining barcha xossalariga ega", 'прямоугольник с равными сторонами это квадрат, он обладает всеми свойствами обоих', 'a rectangle with equal sides is a square, it has all the properties of both') },
      { id: 'w1', label: L("diagonallari teng va perpendikulyar bo'lgan har qanday to'rtburchak kvadrat bo'ladi", 'любой четырёхугольник с равными и перпендикулярными диагоналями — квадрат', 'any quadrilateral with equal and perpendicular diagonals is a square') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Diagonallari teng va perpendikulyar bo'lishi YETARLI EMAS, ular kesishish nuqtasida teng ikkiga ham bo'linishi kerak.",
      'Так не складывается. Равенство и перпендикулярность диагоналей НЕ ДОСТАТОЧНЫ, они должны ещё и делиться точкой пересечения пополам.',
      'That does not fit. Equal and perpendicular diagonals are NOT ENOUGH, they must also be bisected by their point of intersection.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, I bob, 5-, 6-, 7-mavzular asosida (20-25-bet)",
        'Правило на основе геометрии, глава I, темы 5, 6, 7 учебника (стр. 20-25)',
        'The rule is based on geometry, chapter I, topics 5, 6, 7 of the textbook (pages 20-25)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Qaysi shart ikkalasini birlashtirishini bilmasdik",
        'Мы не знали, какое условие объединяет оба',
        'We did not know which condition unites both',
      ),
      right: L(
        "endi burchaklar to'g'ri VA tomonlar teng bo'lishi kerakligini bilamiz",
        'теперь знаем, что нужны прямые углы И равные стороны',
        'now we know that right angles AND equal sides are needed',
      ),
      winner: 'right',
      note: L(
        "To'g'ri to'rtburchak burchaklardan, romb tomonlardan, kvadrat ikkalasidan",
        'Прямоугольник от углов, ромб от сторон, квадрат от обоих',
        'The rectangle from the angles, the rhombus from the sides, the square from both',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): to'g'ri to'rtburchak, 2- va
// 3-masalalar (20-21-bet).
// ============================================================
const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З80',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "To'g'ri to'rtburchak masalalarini yeching",
    'Решай задачи о прямоугольнике',
    'Solve problems about the rectangle',
  ),
  audio: [
    A('mount',
      "Ikki masala. Ikkalasi ham to'g'ri to'rtburchakning diagonal tengligiga tayanadi.",
      'Две задачи. Обе основаны на равенстве диагоналей прямоугольника.',
      'Two problems. Both rest on the equality of the rectangle\'s diagonals.'),
    A('why',
      "Bissektrisa teng yonli uchburchak hosil qiladi, diagonal esa perimetrga qo'shiladi.",
      'Биссектриса образует равнобедренный треугольник, а диагональ входит в периметр.',
      'The bisector forms an isosceles triangle, and the diagonal enters the perimeter.'),
  ],
  props: {
    doneNote: L(
      "To'rttasi ham hal bo'ldi. Har safar to'g'ri to'rtburchakning xossalari ishlatilgan.",
      'Все четыре разобраны. Каждый раз использовались свойства прямоугольника.',
      'All four are done. Each time the properties of the rectangle were used.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'AP = 17,   PD = 21'}</Row>,
        ok: L("Ha. Bissektrisa AB ni AP ga tenglashtiradi, o'n yetti, va AD ni AP qo'shilgan PD, o'ttiz sakkiz.", 'Да. Биссектриса приравнивает AB к AP, семнадцать, а AD равна AP плюс PD, тридцать восемь.', 'Yes. The bisector makes AB equal to AP, seventeen, and AD equals AP plus PD, thirty-eight.'),
        question: L("B burchagining bissektrisasi AD ni shu ikki qismga bo'lsa, perimetr necha santimetr?", 'Если биссектриса угла B делит AD на эти две части, сколько сантиметров периметр?', 'If the bisector of angle B splits AD into these two parts, how many centimetres is the perimeter?'),
        items: [
          { id: 'a', right: true, label: '110' },
          { id: 'b', label: '76', hint: L("AB, AP ga teng ekanini hisobga oling, AD emas.", 'Учти, что AB равна AP, а не AD.', 'Take into account that AB equals AP, not AD.') },
        ],
        solution: ['AB = AP = 17', 'AD = 17+21 = 38', '2(17+38) = 110'],
      },
      {
        expr: <Row size="big" align="center">{'P = 24,   BD = 9'}</Row>,
        ok: L("Ha. AB qo'shilgan AD, perimetrning yarmi, o'n ikki, diagonal qo'shilsa, yigirma bir.", 'Да. AB плюс AD, половина периметра, двенадцать, плюс диагонали, двадцать один.', 'Yes. AB plus AD, half the perimeter, twelve, plus the diagonal, twenty-one.'),
        question: L("Uchburchak ABD ning perimetri necha santimetr?", 'Сколько сантиметров периметр треугольника ABD?', 'How many centimetres is the perimeter of triangle ABD?'),
        items: [
          { id: 'a', right: true, label: '21' },
          { id: 'b', label: '33', hint: L("Perimetrning yarmi o'n ikki, hammasi emas.", 'Половина периметра двенадцать, а не весь периметр.', 'Half the perimeter is twelve, not the whole perimeter.') },
        ],
        solution: ['24 : 2 = 12', '12 + 9 = 21'],
      },
      {
        expr: <Row size="big" align="center">{'AC = 13'}</Row>,
        ok: L("Ha. To'g'ri to'rtburchakning diagonallari o'zaro teng, shuning uchun BD ham o'n uch.", 'Да. Диагонали прямоугольника равны друг другу, поэтому BD тоже тринадцать.', 'Yes. The diagonals of a rectangle are equal to each other, so BD is also thirteen.'),
        question: L("BD necha santimetr?", 'Сколько сантиметров BD?', 'How many centimetres is BD?'),
        items: [
          { id: 'a', right: true, label: '13' },
          { id: 'b', label: '6,5', hint: L("Bu diagonalning yarmi, to'liq diagonal AC ga teng bo'lishi kerak.", 'Это половина диагонали, полная диагональ должна быть равна AC.', 'That is half the diagonal, the full diagonal must equal AC.') },
        ],
        solution: ['AC = BD', '13'],
      },
      {
        expr: <Row size="big" align="center">{'AB = 6,   AD = 8'}</Row>,
        ok: L("Ha. To'g'ri burchakli uchburchakda oltinchi va sakkizinchi katetlar bo'lsa, gipotenuza o'n.", 'Да. В прямоугольном треугольнике с катетами шесть и восемь гипотенуза десять.', 'Yes. In a right triangle with legs six and eight, the hypotenuse is ten.'),
        question: L("Diagonal AC necha santimetr?", 'Сколько сантиметров диагональ AC?', 'How many centimetres is the diagonal AC?'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '14', hint: L("Diagonal tomonlarning yig'indisi emas, u to'g'ri burchakli uchburchakning gipotenuzasi.", 'Диагональ не сумма сторон, а гипотенуза прямоугольного треугольника.', 'The diagonal is not the sum of the sides, it is the hypotenuse of a right triangle.') },
        ],
        solution: ['6² + 8² = 100', '√100 = 10'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): romb, 1-masala (23-bet).
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З80',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Romb burchaklarini toping",
    'Найди углы ромба',
    'Find the angles of the rhombus',
  ),
  audio: [
    A('mount',
      "Diagonal tomon bilan burchak hosil qiladi. Bu burchak rombning burchaklarini topishga yordam beradi.",
      'Диагональ образует угол со стороной. Этот угол помогает найти углы ромба.',
      'The diagonal forms an angle with the side. This angle helps find the angles of the rhombus.'),
    A('why',
      "Diagonal burchakni teng ikkiga bo'ladi, so'ngra parallelogrammning xossalari ishlatiladi.",
      'Диагональ делит угол пополам, затем используются свойства параллелограмма.',
      'The diagonal bisects the angle, then the properties of the parallelogram are used.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar bissektrisa xossasi va parallelogramm xossasi birga ishlatilgan.",
      'Все три разобраны. Каждый раз вместе использовались свойство биссектрисы и свойство параллелограмма.',
      'All three are done. Each time the bisector property and the parallelogram property were used together.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'∠ABD = 35°'}</Row>,
        ok: L("Ha. Diagonal burchakni teng ikkiga bo'lgani uchun burchak CBD ham o'ttiz besh.", 'Да. Так как диагональ делит угол пополам, угол CBD тоже тридцать пять.', 'Yes. Since the diagonal bisects the angle, angle CBD is also thirty-five.'),
        question: L("Burchak ABC necha gradus?", 'Сколько градусов угол ABC?', 'How many degrees is angle ABC?'),
        items: [
          { id: 'a', right: true, label: '70°' },
          { id: 'b', label: '35°', hint: L("Bu faqat yarmi, ikkilash unutilgan.", 'Это только половина, забыто удвоение.', 'That is only half, doubling was forgotten.') },
        ],
        solution: ['35° · 2', '70°'],
      },
      {
        expr: <Row size="big" align="center">{'∠ABC = 70°'}</Row>,
        ok: L("Ha. Parallelogrammda qarama-qarshi burchaklar teng, shuning uchun burchak ADC ham yetmish.", 'Да. В параллелограмме противоположные углы равны, поэтому угол ADC тоже семьдесят.', 'Yes. In a parallelogram opposite angles are equal, so angle ADC is also seventy.'),
        question: L("Burchak ADC necha gradus?", 'Сколько градусов угол ADC?', 'How many degrees is angle ADC?'),
        items: [
          { id: 'a', right: true, label: '70°' },
          { id: 'b', label: '110°', hint: L("Bu qo'shni burchak, qarama-qarshisi emas.", 'Это соседний угол, а не противоположный.', 'That is the adjacent angle, not the opposite one.') },
        ],
        solution: ['70°'],
      },
      {
        expr: <Row size="big" align="center">{'∠ABC = 70°   →   ∠DAB'}</Row>,
        ok: L("Ha. Bir tomonga yopishgan burchaklar yig'indisi 180, shuning uchun 180 dan yetmishni ayirsak, yuz o'n.", 'Да. Сумма углов, прилежащих к одной стороне, сто восемьдесят, отняв семьдесят, сто десять.', 'Yes. The sum of angles adjacent to one side is a hundred eighty, subtracting seventy gives a hundred ten.'),
        question: L("Burchak DAB necha gradus?", 'Сколько градусов угол DAB?', 'How many degrees is angle DAB?'),
        items: [
          { id: 'a', right: true, label: '110°' },
          { id: 'b', label: '70°', hint: L("Bu burchak ABC ning o'zi, unga yopishganini emas.", 'Это сам угол ABC, а не прилежащий к нему.', 'That is angle ABC itself, not the one adjacent to it.') },
        ],
        solution: ['180° − 70°', '110°'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): kvadrat va romb
// perimetri, javobni son bilan tekshirish (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Perimetrdan tomonni toping",
    'Найди сторону по периметру',
    'Find the side from the perimeter',
  ),
  audio: [
    A('mount',
      "Uch shakl. Har birida perimetr berilgan, tomon topiladi.",
      'Три фигуры. В каждой дан периметр, находится сторона.',
      'Three shapes. In each, the perimeter is given, the side is found.'),
    A('why',
      "Romb va kvadratda barcha tomonlar teng, shuning uchun perimetr to'rtga bo'linadi.",
      'В ромбе и квадрате все стороны равны, поэтому периметр делится на четыре.',
      'In a rhombus and a square all sides are equal, so the perimeter is divided by four.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar tomon perimetrni to'rtga bo'lib tekshirilgan.",
      'Все три разобраны. Каждый раз сторона проверялась делением периметра на четыре.',
      'All three are done. Each time the side was checked by dividing the perimeter by four.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'P = 72'}</Row>,
        ok: L("Ha. Yetmish ikkini to'rtga bo'lsak, o'n sakkiz chiqadi.", 'Да. Семьдесят два, делённое на четыре, выходит восемнадцать.', 'Yes. Seventy-two divided by four gives eighteen.'),
        question: L("Rombning tomoni necha santimetr?", 'Сколько сантиметров сторона ромба?', 'How many centimetres is the side of the rhombus?'),
        items: [
          { id: 'a', right: true, label: '18' },
          { id: 'b', label: '36', hint: L("Yetmish ikkini ikkiga emas, to'rtga bo'lish kerak, chunki tomonlar to'rtta.", 'Семьдесят два нужно делить не на два, а на четыре, ведь сторон четыре.', 'Seventy-two must be divided not by two but by four, since there are four sides.') },
        ],
        solution: ['72 : 4', '18'],
      },
      {
        expr: <Row size="big" align="center">{'P = 52'}</Row>,
        ok: L("Ha. Ellik ikkini to'rtga bo'lsak, o'n uch chiqadi.", 'Да. Пятьдесят два, делённое на четыре, выходит тринадцать.', 'Yes. Fifty-two divided by four gives thirteen.'),
        question: L("Kvadratning tomoni necha santimetr?", 'Сколько сантиметров сторона квадрата?', 'How many centimetres is the side of the square?'),
        items: [
          { id: 'a', right: true, label: '13' },
          { id: 'b', label: '26', hint: L("Ellik ikkini ikkiga emas, to'rtga bo'lish kerak.", 'Пятьдесят два нужно делить не на два, а на четыре.', 'Fifty-two must be divided not by two but by four.') },
        ],
        solution: ['52 : 4', '13'],
      },
      {
        expr: <Row size="big" align="center">{'a = 9'}</Row>,
        ok: L("Ha. To'qqizni to'rt marta qo'shsak, o'ttiz olti chiqadi.", 'Да. Девять, сложенное четыре раза, выходит тридцать шесть.', 'Yes. Nine added four times gives thirty-six.'),
        question: L("Kvadratning perimetri necha santimetr?", 'Сколько сантиметров периметр квадрата?', 'How many centimetres is the perimeter of the square?'),
        items: [
          { id: 'a', right: true, label: '36' },
          { id: 'b', label: '18', hint: L("Bu faqat ikki tomon yig'indisi, kvadratda to'rt tomon bor.", 'Это сумма только двух сторон, в квадрате их четыре.', 'That is the sum of only two sides, a square has four.') },
        ],
        solution: ['9 · 4', '36'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): diagonallar teng
// va perpendikulyar bo'lishi kvadrat uchun yetarli emas (З79) va
// to'g'ri to'rtburchak-romb xossalari aralashtirilgan (З80).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З79',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato fikrda nima noto'g'ri",
    'Что неверно в двух ошибочных утверждениях',
    'What is wrong in two mistaken statements',
  ),
  audio: [
    A('mount',
      "Ikki fikr aytilgan. Ikkalasida ham to'rtburchaklarning maxsus turlari haqida xato bor.",
      'Высказаны два утверждения. В обоих есть ошибка об особых видах четырёхугольников.',
      'Two statements are made. Both contain a mistake about special quadrilaterals.'),
    A('why',
      "Kvadrat uchun uch shart birga kerak, va har bir xossa aynan o'z figurasiga tegishli.",
      'Для квадрата нужны три условия сразу, и каждое свойство относится к своей фигуре.',
      'A square needs three conditions at once, and each property belongs to its own figure.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham shartlarni yetarli deb hisoblashdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за того, что условия посчитали достаточными без проверки.',
      'Both are done. Both mistakes came from taking the conditions as sufficient without checking.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'d₁ = d₂,   d₁ ⊥ d₂'}</Row>,
        ok: L("Ha. Diagonallar teng ikkiga bo'linishi ham tekshirilishi kerak, aks holda to'rtburchak kvadrat bo'lmasligi mumkin.", 'Да. Нужно ещё проверить, делятся ли диагонали пополам, иначе четырёхугольник может не быть квадратом.', 'Yes. It must also be checked whether the diagonals are bisected, otherwise the quadrilateral may not be a square.'),
        question: L("To'rtburchakning diagonallari teng va perpendikulyar ekanidan u kvadrat deb xulosa qilingan bo'lsa, bu yerda xato qayerda?", 'Если из равенства и перпендикулярности диагоналей сделан вывод, что четырёхугольник квадрат, в чём здесь ошибка?', 'If from the diagonals being equal and perpendicular it was concluded that the quadrilateral is a square, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Diagonallarning teng ikkiga bo'linishi tekshirilmagan", 'Не проверено деление диагоналей пополам', 'The bisection of the diagonals was not checked') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, uchinchi shart tekshirilmasdan qoldirilgan.", 'Это и есть показанная ошибка, третье условие осталось непроверенным.', 'This is the very mistake shown; the third condition was left unchecked.') },
        ],
        solution: [L("teng, perpendikulyar, VA teng ikkiga bo'linadigan", 'равны, перпендикулярны, И делятся пополам', 'equal, perpendicular, AND bisected')],
      },
      {
        expr: <Row size="big" align="center">{'∠1 = ∠2'}</Row>,
        ok: L("Ha. Diagonalning burchakni teng ikkiga bo'lishi rombning xossasi, to'g'ri to'rtburchakning umumiy xossasi emas.", 'Да. Деление угла диагонали пополам это свойство ромба, а не общее свойство прямоугольника.', 'Yes. The diagonal bisecting the angle is a property of the rhombus, not a general property of the rectangle.'),
        question: L("Oddiy to'g'ri to'rtburchakda diagonal burchakni teng ikkiga bo'ladi deb aytilgan bo'lsa, bu yerda xato qayerda?", 'Если было сказано, что в обычном прямоугольнике диагональ делит угол пополам, в чём здесь ошибка?', 'If it was said that in an ordinary rectangle the diagonal bisects the angle, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Rombning xossasi to'g'ri to'rtburchakka noto'g'ri qo'llanilgan", 'Свойство ромба неверно применено к прямоугольнику', 'A property of the rhombus was wrongly applied to the rectangle') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, oddiy to'g'ri to'rtburchakda bu to'g'ri emas.", 'Это и есть показанная ошибка, в обычном прямоугольнике это не так.', 'This is the very mistake shown; in an ordinary rectangle this does not hold.') },
        ],
        solution: [L("romb xossasi, to'g'ri to'rtburchak emas", 'свойство ромба, а не прямоугольника', 'a property of the rhombus, not the rectangle')],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): romb burchaklarini
// diagonal-tomon burchagidan qadamlab topish.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З80',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Diagonal-tomon burchagidan romb burchaklarini qadamlab toping",
    'Найди углы ромба по углу между диагональю и стороной, по шагам',
    'Find the angles of the rhombus from the diagonal-side angle, step by step',
  ),
  audio: [
    A('mount',
      "Diagonal tomon bilan burchak hosil qiladi. Uni ikkilab, so'ngra 180 dan ayirib, barcha burchaklarni topamiz.",
      'Диагональ образует угол со стороной. Удвоив его и отняв от ста восьмидесяти, находим все углы.',
      'The diagonal forms an angle with the side. Doubling it and subtracting from a hundred eighty gives all the angles.'),
    A('why',
      "Ikkilangan burchak bir juftini, undan 180 dan ayirilgani ikkinchi juftini beradi.",
      'Удвоенный угол даёт одну пару, а вычитание из ста восьмидесяти, вторую.',
      'The doubled angle gives one pair, subtracting from a hundred eighty gives the other.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar ikkilash va 180 dan ayirish qadamlari bajarilgan.",
      'Все три заполнены. Каждый раз выполнялись шаги удвоения и вычитания из ста восьмидесяти.',
      'All three are filled. Each time the steps of doubling and subtracting from a hundred eighty were done.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['70°', '110°'],
      lines: [
        [{ t: '35°   →   35°·2 = ' }, { slot: '70°' }, { t: ',   180° − 70° = ' }, { slot: '110°' }],
      ],
    },
    tasks: [
      {
        chips: ['50°', '130°'],
        lines: [
          [{ t: '25°   →   25°·2 = ' }, { slot: '50°' }, { t: ',   180° − 50° = ' }, { slot: '130°' }],
        ],
      },
      {
        chips: ['84°', '96°'],
        lines: [
          [{ t: '42°   →   42°·2 = ' }, { slot: '84°' }, { t: ',   180° − 84° = ' }, { slot: '96°' }],
        ],
      },
      {
        chips: ['60°', '120°'],
        lines: [
          [{ t: '30°   →   30°·2 = ' }, { slot: '60°' }, { t: ',   180° − 60° = ' }, { slot: '120°' }],
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
    "To'g'ri to'rtburchak, romb va kvadrat bo'yicha to'rt savol",
    'Четыре вопроса о прямоугольнике, ромбе и квадрате',
    'Four questions about the rectangle, rhombus, and square',
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
        id: 'q1', tag: 'З80',
        ask: L('To\'g\'ri to\'rtburchakning diagonallari doim burchakni teng ikkiga bo\'ladimi?', 'Всегда ли диагонали прямоугольника делят угол пополам?', 'Do the diagonals of a rectangle always bisect the angle?'),
        options: [
          { id: 'ok', right: true, label: L("Yo'q, faqat kvadrat bo'lganda", 'Нет, только если это квадрат', 'No, only if it is a square') },
          { id: 'no', label: L('Ha, har doim', 'Да, всегда', 'Yes, always') },
        ],
        hint: L("Burchakni teng ikkiga bo'lish rombning xossasi, oddiy to'g'ri to'rtburchakda bu yo'q.", 'Деление угла пополам это свойство ромба, в обычном прямоугольнике этого нет.', 'Bisecting the angle is a property of the rhombus, an ordinary rectangle does not have it.'),
        ok: L("To'g'ri, bu faqat kvadratda, ya'ni ikkalasi bo'lganda ishlaydi.", 'Верно, это работает только в квадрате, то есть когда есть оба свойства.', 'Correct, this only works in a square, that is, when both properties hold.'),
      },
      {
        id: 'q2', tag: 'З79',
        ask: L('Diagonallari teng va perpendikulyar bo\'lgan har qanday to\'rtburchak kvadratmi?', 'Является ли квадратом любой четырёхугольник с равными и перпендикулярными диагоналями?', 'Is any quadrilateral with equal and perpendicular diagonals a square?'),
        options: [
          { id: 'ok', right: true, label: L("Yo'q, shart emas", 'Нет, не обязательно', 'No, not necessarily') },
          { id: 'no', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Ular yana kesishish nuqtasida teng ikkiga bo'linishi kerak.", 'Они должны ещё делиться точкой пересечения пополам.', 'They must also be bisected by their point of intersection.'),
        ok: L("To'g'ri, uchinchi shart, teng ikkiga bo'linish, ham kerak.", 'Верно, нужно и третье условие, деление пополам.', 'Correct, the third condition, bisection, is also needed.'),
      },
      {
        id: 'q3', tag: 'З80',
        ask: L('Romb qanday parallelogramm?', 'Какой параллелограмм называется ромбом?', 'What kind of parallelogram is called a rhombus?'),
        options: [
          { id: 'ok', right: true, label: L("Tomonlari teng bo'lgan", 'С равными сторонами', 'One with equal sides') },
          { id: 'no', label: L("Burchaklari to'g'ri bo'lgan", 'С прямыми углами', 'One with right angles') },
        ],
        hint: L("Burchaklari to'g'ri bo'lgani, to'g'ri to'rtburchak ta'rifi.", 'Прямые углы это определение прямоугольника.', 'Right angles are the definition of the rectangle.'),
        ok: L("To'g'ri, romb tomonlar tengligi bilan aniqlanadi.", 'Верно, ромб определяется равенством сторон.', 'Correct, the rhombus is defined by equal sides.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('Kvadratning perimetri o\'ttiz olti bo\'lsa, tomoni to\'qqizga tengmi?', 'Если периметр квадрата тридцать шесть, равна ли сторона девяти?', 'If the perimeter of a square is thirty-six, is the side equal to nine?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("O'ttiz oltini to'rtga bo'lib ko'ring.", 'Раздели тридцать шесть на четыре.', 'Divide thirty-six by four.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З79',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "To'g'ri to'rtburchakda AB olti, AD sakkiz bo'lsa, diagonalni yig'ing.",
            'Собери диагональ, если в прямоугольнике AB шесть, AD восемь.',
            'Assemble the diagonal, if in the rectangle AB is six and AD is eight.',
          ),
          lines: [
            [{ t: 'AB = 6,  AD = 8   →   AC = ' }, { slot: '10' }],
          ],
          tiles: [
            { id: 't1', v: '10', x: 12, y: 12 },
            { id: 't2', v: '14', x: 60, y: 14 },
            { id: 't3', v: '7', x: 30, y: 50 },
            { id: 't4', v: '48', x: 78, y: 48 },
          ],
          hint: L(
            "Olti va sakkiz katetlar, gipotenuzani hisoblang.",
            'Шесть и восемь это катеты, вычисли гипотенузу.',
            'Six and eight are the legs, compute the hypotenuse.',
          ),
          doneNote: L(
            "Yig'ildi. To'g'ri to'rtburchakning diagonali to'g'ri burchakli uchburchakning gipotenuzasi.",
            'Собрано. Диагональ прямоугольника, гипотенуза прямоугольного треугольника.',
            'Assembled. The rectangle\'s diagonal is the hypotenuse of a right triangle.',
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
    "To'g'ri to'rtburchak burchaklardan, romb tomonlardan, kvadrat ikkalasidan",
    'Прямоугольник от углов, ромб от сторон, квадрат от обоих',
    'The rectangle from the angles, the rhombus from the sides, the square from both',
  ),
  audio: [
    A('s0',
      "Darsdan bitta ierarxiya qoladi. Kvadrat, to'g'ri to'rtburchak va rombning kesishmasi.",
      'С урока остаётся одна иерархия. Квадрат, пересечение прямоугольника и ромба.',
      'One hierarchy stays with you. The square, the intersection of the rectangle and the rhombus.'),
    A('s1',
      "Bugun uch narsa qilindi. To'g'ri to'rtburchakning diagonal tengligini isbotladingiz, rombning diagonal perpendikulyarligini ko'rdingiz va kvadrat uchun uch shartning birga kerakligini bildingiz.",
      'Сегодня сделано три вещи. Ты доказал равенство диагоналей прямоугольника, увидел перпендикулярность диагоналей ромба, и узнал, что для квадрата нужны все три условия вместе.',
      'Three things are done today. You proved the equality of a rectangle\'s diagonals, saw the perpendicularity of a rhombus\'s diagonals, and learned that a square needs all three conditions together.'),
    A('s2',
      "Keyingi darsda trapetsiya. Parallel tomonlari faqat bir juft bo'lgan to'rtburchak.",
      'В следующем уроке трапеция. Четырёхугольник с только одной парой параллельных сторон.',
      'The next lesson covers the trapezoid, a quadrilateral with only one pair of parallel sides.',
    ),
  ],
  props: {
    mark: "to'g'ri to'rtburchak  +  romb  =  kvadrat",
    markNote: L(
      "burchaklar to'g'ri, tomonlar teng, diagonallar teng, perpendikulyar va teng ikkiga bo'linadi",
      'углы прямые, стороны равны, диагонали равны, перпендикулярны и делятся пополам',
      'the angles are right, the sides are equal, the diagonals are equal, perpendicular, and bisected',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: trapetsiya",
      'Следующий урок: трапеция',
      'Next lesson: the trapezoid',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
