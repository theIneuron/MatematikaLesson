// ============================================================================
// 8-sinf, Dars 39. TRAPETSIYA VA UNING XOSSALARI.
//
// BLOK Б6. Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`, `geofigure.jsx`,
// `prooflines.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da. Yangi pribor
// YO'Q — `GeoFigure` va `ProofLines` (Dars 37) qayta ishlatiladi.
//
// KARKAS: Dars 37-38 dagidek, SCREENS to'g'ridan-to'g'ri qurilgan.
//
// MANBA: 8-sinf geometriya darsligi, I bob, 9- va 10-mavzular (29-33-bet).
// Diqqat, darslikda TRAPETSIYA 8-mavzudan (uchburchakning o'rta chizig'i)
// KEYIN keladi, lekin dars rejasi bo'yicha o'rta chiziq mavzusi 43-darsga
// (Falyes teoremasi bilan birga) qoldirilgan — shu sababli bu darsda
// o'rta chiziq YO'Q, faqat ta'rif va burchaklar. Barcha ta'rif, teorema
// va misollar darslikdan:
//   - ta'rif (29-bet): ikkita tomoni parallel, qolgan ikkitasi parallel
//     bo'lmagan to'rtburchak; asoslar, yon tomonlar, balandlik, teng
//     yonli trapetsiya, to'g'ri burchakli trapetsiya atamalari;
//   - trapetsiyaning alomati (30-bet): bir tomonga yopishgan ikki
//     burchak yig'indisi 180° VA qo'shni tomonlarga yopishgan ikki
//     burchak yig'indisi 180° dan farqli bo'lsa, trapetsiya;
//   - natija (30-bet): bir burchagi 90° bo'lsa, unga yopishgan (bir xil
//     yon tomondagi) burchak ham 90°;
//   - 2-masala (30-31-bet): teng yonli trapetsiya tomonlari 1:1:1:2 —
//     burchaklari 60°,120°,120°,60°;
//   - 103-mashq uslubi (31-bet): burchak B 110°, burchak C 99° —
//     burchak A 70°, burchak D 81°;
//   - 10-mavzu (32-33-bet): teng yonli trapetsiyaning asosidagi burchaklari
//     teng ekanligi (uchburchaklar tengligi orqali isbotlangan) — QO'SHILDI
//     2026-08-22, birinchi yozilishda tushib qolgan edi.
//
// ADASHISHLAR, ikkitasi yangi:
//   З81, trapetsiyani aniqlashda faqat bitta shart tekshirilgan, ikkinchi
//   juft tomonning parallel EMASLIGI tekshirilmagan (parallelogrammdan
//   farqlanmagan);
//   З82, to'g'ri burchakli trapetsiyada faqat bitta burchak to'g'ri deb
//   hisoblangan, bir xil yon tomondagi ikkinchisi unutilgan;
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
  id: 'geo-8-39',
  n: 39,
  row: 44,
  block: 'Б6',
  topic: L("Trapetsiya va uning xossalari", 'Трапеция и её свойства', 'The trapezoid and its properties'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Ikkita tomoni parallel (asoslar), qolgan ikki tomoni parallel bo'lmagan (yon tomonlar) to'rtburchak trapetsiya deyiladi",
    'Четырёхугольник с двумя параллельными сторонами (основаниями) и двумя непараллельными (боковыми) называется трапецией',
    'A quadrilateral with two parallel sides (the bases) and two non-parallel sides (the legs) is called a trapezoid',
  ),
  L(
    "Trapetsiyaning bir burchagi to'g'ri bo'lsa, unga yopishgan (bir xil yon tomondagi) burchak ham to'g'ri bo'ladi",
    'Если один угол трапеции прямой, то прилежащий к нему угол (на той же боковой стороне) тоже прямой',
    'If one angle of a trapezoid is right, the angle adjacent to it (on the same leg) is right too',
  ),
  L(
    "Teng yonli trapetsiyaning asosidagi burchaklari teng",
    'Углы равнобедренной трапеции при основании равны',
    'The base angles of an isosceles trapezoid are equal',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З81': {
    what: L(
      "trapetsiyani aniqlashda faqat bitta shart tekshirilgan, ikkinchi juft tomonning parallel emasligi tekshirilmagan",
      'при определении трапеции проверено только одно условие, непараллельность второй пары сторон не проверена',
      'when determining a trapezoid, only one condition was checked, the non-parallelism of the second pair of sides was not checked',
    ),
    wrong: null,
    at: 12,
  },
  'З82': {
    what: L(
      "to'g'ri burchakli trapetsiyada faqat bitta burchak to'g'ri deb hisoblangan",
      'в прямоугольной трапеции только один угол принят прямым',
      'in a right trapezoid only one angle was taken as right',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI. Oddiy trapetsiya (3, 5, 6-ekran) va to'g'ri
// burchakli trapetsiya (4-ekran) uchun.
// ============================================================
const TRAP = { A: [15, 82], B: [35, 18], C: [80, 18], D: [95, 82] }
const TRAP_ORDER = ['A', 'B', 'C', 'D']
const TRAP_RIGHT = { A: [15, 82], B: [15, 18], C: [75, 18], D: [95, 82] }

// ============================================================
// SAHNALAR (§6). Xuk: qaysi to'rtburchakda faqat BIR juft tomon parallel.
// Yakun: ta'rif va burchak qoidasi bir chertyozhda.
// ============================================================
const SC_ASK = L('FAQAT BIR JUFT TOMON PARALLEL', 'ТОЛЬКО ОДНА ПАРА СТОРОН ПАРАЛЛЕЛЬНА', 'ONLY ONE PAIR OF SIDES IS PARALLEL')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <polygon points="130,90 160,35 235,35 265,90" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
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
      "Asoslar parallel, yon tomonlar emas",
      'Основания параллельны, боковые стороны нет',
      'The bases are parallel, the legs are not',
    )}>
      <polygon points="130,85 155,35 230,35 260,85" fill="none" stroke={T.ink2} strokeWidth="1.4"/>
      <g className="g8-seat" style={{ '--d': '1300ms' }}>
        <text x="195" y="105" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fill={T.ok}>{'∠A + ∠B = 180°'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1900ms' }}>
        <text x="195" y="122" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>{"∠B + ∠C ≠ 180°"}</text>
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
  eyebrow: L('NECHTA JUFT TOMON PARALLEL', 'СКОЛЬКО ПАР СТОРОН ПАРАЛЛЕЛЬНЫ', 'HOW MANY PAIRS OF SIDES ARE PARALLEL'),
  title: L(
    "Chertyozhdagi to'rtburchakda nechta juft tomon parallel bo'lishi mumkin",
    'Сколько пар сторон четырёхугольника на чертеже может быть параллельно',
    'How many pairs of sides of the quadrilateral in the drawing could be parallel',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Chertyozhda tepasi pastidan torroq to'rtburchak turibdi.",
      'На чертеже стоит четырёхугольник, верх которого уже, чем низ.',
      'The drawing shows a quadrilateral whose top is narrower than its bottom.'),
    A('why',
      "Taxmin qiling, bunday shaklda nechta juft tomon parallel bo'lishi mumkin.",
      'Предположи, сколько пар сторон может быть параллельно в такой фигуре.',
      'Predict how many pairs of sides could be parallel in such a shape.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, bunday to'rtburchakda nechta juft tomon parallel bo'lishi mumkin?",
      'Как думаешь, сколько пар сторон может быть параллельно в таком четырёхугольнике?',
      'What do you think, how many pairs of sides could be parallel in such a quadrilateral?',
    ),
    items: [
      { id: 'a', show: '0' },
      { id: 'b', show: '1' },
      { id: 'c', show: '2' },
      { id: 'd', show: L("Har doim 2", 'Всегда 2', 'Always 2') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Bir tomondagi ichki burchaklar (dars 37-38 dan).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "O'tgan darslardan bir tomondagi ichki burchaklarni eslash",
    'Вспоминаем внутренние углы с одной стороны из прошлых уроков',
    'Recalling same-side interior angles from previous lessons',
  ),
  audio: [
    A('mount',
      "Ikki parallel chiziq va ularni kesuvchi to'g'ri chiziq bo'lsa, bir tomondagi ichki burchaklar haqida fakt bor edi.",
      'Когда есть две параллельные прямые и секущая, был факт о внутренних углах с одной стороны.',
      'When there are two parallel lines and a transversal, there was a fact about same-side interior angles.'),
    A('why',
      "Bu burchaklarning yig'indisi haqida edi.",
      'Это было про сумму этих углов.',
      'It was about the sum of these angles.'),
  ],
  props: {
    ask: L(
      "Ikki parallel chiziqni kesuvchi kesganda, bir tomondagi ichki burchaklar yig'indisi qanday?",
      'Когда секущая пересекает две параллельные прямые, какова сумма внутренних углов с одной стороны?',
      'When a transversal cuts two parallel lines, what is the sum of the same-side interior angles?',
    ),
    items: [
      { id: 'right', show: '180°', right: true, name: L('bu qat\'iy qoida', 'это твёрдое правило', 'this is a firm rule') },
      {
        id: 'wrong1', show: '90°',
        hint: L("Bu to'g'ri burchak, ichki burchaklar yig'indisi bilan bog'liq emas.", 'Это прямой угол, не связан с суммой внутренних углов.', 'That is a right angle, not related to the sum of interior angles.'),
      },
      {
        id: 'wrong2', show: L("Har doim teng", 'Всегда равны', 'Always equal'),
        hint: L("Ular teng emas, yig'indisi 180 gradus bo'ladi.", 'Они не равны, их сумма равна 180 градусам.', 'They are not equal, their sum is 180 degrees.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun aynan shu qoida trapetsiyani aniqlashda ishlatiladi.",
      'Верно. Сегодня именно это правило используется для определения трапеции.',
      'Correct. Today exactly this rule is used to determine a trapezoid.',
    ),
  },
}

// ============================================================
// EKRAN 3. ASOSLARGA TAP (`geofigure`). Ta'rif: asoslar, parallel tomonlar.
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'geofigure',
  tag: 'З81',
  eyebrow: L('ASOSLARNI TOPING', 'НАЙДИ ОСНОВАНИЯ', 'FIND THE BASES'),
  title: L(
    "Trapetsiyada parallel bo'lgan tomonlarni, asoslarni, belgilang",
    'Отметь параллельные стороны трапеции, основания',
    'Mark the parallel sides of the trapezoid, the bases',
  ),
  audio: [
    A('mount',
      "ABCD chertyozhda turibdi. Trapetsiyaning faqat bitta juft tomoni parallel.",
      'На чертеже стоит ABCD. У трапеции параллельна только одна пара сторон.',
      'ABCD stands on the drawing. Only one pair of sides of a trapezoid is parallel.'),
    A('why',
      "Parallel tomonlar asoslar deyiladi, ularni bosing.",
      'Параллельные стороны называются основаниями, нажми их.',
      'The parallel sides are called the bases, tap them.'),
  ],
  props: {
    points: TRAP,
    order: TRAP_ORDER,
    steps: [
      {
        kind: 'edges',
        targets: ['AD', 'BC'],
        ask: L("Asoslarni bosing", 'Нажми основания', 'Tap the bases'),
        hints: {
          AB: L("AB, yon tomon, parallel emas.", 'AB, боковая сторона, не параллельна.', 'AB is a leg, not parallel.'),
          CD: L("CD ham yon tomon, parallel emas.", 'CD тоже боковая сторона, не параллельна.', 'CD is also a leg, not parallel.'),
        },
      },
    ],
    after: L(
      "To'g'ri. AD va BC, trapetsiyaning asoslari, ular parallel.",
      'Верно. AD и BC, основания трапеции, они параллельны.',
      'Correct. AD and BC are the bases of the trapezoid, they are parallel.',
    ),
  },
}

// ============================================================
// EKRAN 4. ISBOT (`prooflines`). Natija: bir burchak to'g'ri bo'lsa,
// bir xil yon tomondagi burchak ham to'g'ri.
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З82',
  eyebrow: L('IKKINCHI TO\'G\'RI BURCHAKNI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ВТОРОЙ ПРЯМОЙ УГОЛ', 'PROVING THE SECOND RIGHT ANGLE'),
  title: L(
    "Bir burchak to'g'ri bo'lsa, bir xil yon tomondagi burchak ham to'g'ri",
    'Если один угол прямой, то угол на той же боковой стороне тоже прямой',
    'If one angle is right, the angle on the same leg is right too',
  ),
  audio: [
    A('mount',
      "ABCD trapetsiya, AD va BC asoslar. Burchak A to'g'ri.",
      'ABCD, трапеция, AD и BC основания. Угол A прямой.',
      'ABCD is a trapezoid, AD and BC are the bases. Angle A is right.'),
    A('why',
      "AB yon tomon ikki asosni kesadi, bir tomondagi ichki burchaklar yig'indisidan foydalanamiz.",
      'Боковая сторона AB пересекает оба основания, используем сумму внутренних углов с одной стороны.',
      'The leg AB crosses both bases, we use the sum of the same-side interior angles.'),
  ],
  props: {
    points: TRAP_RIGHT,
    order: TRAP_ORDER,
    given: [
      L("ABCD, trapetsiya, AD parallel BC", 'ABCD, трапеция, AD параллельна BC', 'ABCD, a trapezoid, AD parallel to BC'),
      L("burchak A, to'g'ri burchak", 'угол A, прямой угол', 'angle A, a right angle'),
    ],
    goal: L("burchak B, to'g'ri burchak", 'угол B, прямой угол', 'angle B, a right angle'),
    lines: [
      {
        text: L("burchak A qo'shilgan burchak B, 180 gradusga teng", 'угол A плюс угол B равно 180 градусам', 'angle A plus angle B equals 180 degrees'),
        options: [
          { id: 'ok', right: true, label: L("AD va BC parallel, AB kesuvchi, bir tomondagi ichki burchaklar", 'AD и BC параллельны, AB секущая, внутренние углы с одной стороны', 'AD and BC are parallel, AB is the transversal, same-side interior angles') },
          { id: 'no', label: L("Burchak A va burchak B teng, chunki bu trapetsiya", 'Углы A и B равны, потому что это трапеция', 'Angles A and B are equal, because this is a trapezoid'), hint: L("Ular teng emas, ular bir-birini 180 gradusgacha to'ldiradi.", 'Они не равны, они дополняют друг друга до 180 градусов.', 'They are not equal, they add up to 180 degrees.') },
        ],
      },
      {
        text: L("burchak B, to'qson gradusga teng", 'угол B равен девяносто градусам', 'angle B equals ninety degrees'),
        options: [
          { id: 'ok', right: true, label: L("180 gradusdan to'qsonni ayirsak, to'qson qoladi", 'Из ста восьмидесяти градусов отнять девяносто, останется девяносто', 'Subtracting ninety from a hundred eighty leaves ninety') },
          { id: 'no', label: L("Trapetsiyaning barcha burchaklari to'g'ri bo'lgani uchun", 'Потому что все углы трапеции прямые', 'Because all the angles of the trapezoid are right'), hint: L("Bu umuman to'g'ri emas, unday trapetsiya to'rtburchak bo'lardi. Faqat shu ikki burchak to'g'ri.", 'Это вообще не так, иначе трапеция была бы прямоугольником. Прямые только эти два угла.', 'That is not true at all, otherwise the trapezoid would be a rectangle. Only these two angles are right.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. Bir tomondagi ikki burchak birga to'g'ri bo'ladi, qolgan ikkisi haqida bu narsa aytilmagan.",
      'Доказано. Оба угла на одной боковой стороне прямые вместе, про остальные два это не сказано.',
      'Proven. Both angles on one leg are right together, nothing is said about the other two.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI (`geofigure`). Yon tomonlarni belgilash,
// asos-yon tomon farqini mustahkamlash.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'geofigure',
  tag: 'З81',
  eyebrow: L('YON TOMONLARNI TOPING', 'НАЙДИ БОКОВЫЕ СТОРОНЫ', 'FIND THE LEGS'),
  title: L(
    "Endi trapetsiyaning yon tomonlarini belgilang",
    'Теперь отметь боковые стороны трапеции',
    'Now mark the legs of the trapezoid',
  ),
  audio: [
    A('mount',
      "Bu safar parallel bo'lmagan tomonlar izlanadi.",
      'На этот раз ищутся непараллельные стороны.',
      'This time the non-parallel sides are sought.'),
    A('why',
      "Yon tomonlar parallel emas, ular asoslarni tutashtiradi.",
      'Боковые стороны не параллельны, они соединяют основания.',
      'The legs are not parallel, they connect the bases.'),
    W('mark',
      "Ikkalasi ham topildi. Asoslar parallel, yon tomonlar esa emas.",
      'Обе найдены. Основания параллельны, а боковые стороны нет.',
      'Both are found. The bases are parallel, the legs are not.'),
  ],
  props: {
    points: TRAP,
    order: TRAP_ORDER,
    steps: [
      {
        kind: 'edges',
        targets: ['AB', 'CD'],
        ask: L("Yon tomonlarni bosing", 'Нажми боковые стороны', 'Tap the legs'),
        hints: {
          AD: L("AD, asos, parallel tomon.", 'AD, основание, параллельная сторона.', 'AD is a base, a parallel side.'),
          BC: L("BC ham asos, parallel tomon.", 'BC тоже основание, параллельная сторона.', 'BC is also a base, a parallel side.'),
        },
      },
    ],
    after: L(
      "To'g'ri. AB va CD, trapetsiyaning yon tomonlari, ular parallel emas.",
      'Верно. AB и CD, боковые стороны трапеции, они не параллельны.',
      'Correct. AB and CD are the legs of the trapezoid, they are not parallel.',
    ),
  },
}

// ============================================================
// EKRAN 6. QAYSI TRAPETSIYA (1-darsning `pick`): teng yonli va to'g'ri
// burchakli trapetsiya farqi.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З82',
  eyebrow: L('QAYSI TRAPETSIYA', 'КАКАЯ ТРАПЕЦИЯ', 'WHICH TRAPEZOID'),
  title: L(
    "Yon tomonlari teng bo'lgan trapetsiya qanday ataladi",
    'Как называется трапеция с равными боковыми сторонами',
    'What is a trapezoid with equal legs called',
  ),
  audio: [
    A('mount',
      "Trapetsiyaning ikki maxsus turi bor, ular yon tomon yoki burchak bilan aniqlanadi.",
      'У трапеции есть два особых вида, они определяются боковой стороной или углом.',
      'There are two special types of trapezoid, defined by a leg or an angle.'),
    A('why',
      "Yon tomonlar teng bo'lsa, bir nom, burchaklardan biri to'g'ri bo'lsa, boshqa nom ishlatiladi.",
      'Если боковые стороны равны, одно название, если один угол прямой, другое.',
      'If the legs are equal, one name is used, if one angle is right, another.'),
    A('why',
      "Teng yonli trapetsiyaning yana bir belgisi bor, asosidagi burchaklari ham teng bo'ladi.",
      'У равнобедренной трапеции есть ещё один признак, углы при основании тоже равны.',
      'An isosceles trapezoid has another feature too, its base angles are equal as well.'),
  ],
  props: {
    ask: L(
      "AB teng CD bo'lgan trapetsiya qanday ataladi?",
      'Как называется трапеция, у которой AB равна CD?',
      'What is a trapezoid where AB equals CD called?',
    ),
    items: [
      { id: 'right', show: L("Teng yonli trapetsiya", 'Равнобедренная трапеция', 'An isosceles trapezoid'), right: true, name: L('yon tomonlar teng', 'боковые стороны равны', 'the legs are equal') },
      {
        id: 'wrong1', show: L("To'g'ri burchakli trapetsiya", 'Прямоугольная трапеция', 'A right trapezoid'),
        hint: L("Bu nom burchaklardan biri to'g'ri bo'lganda ishlatiladi, tomonlar tengligiga emas.", 'Это название для случая с прямым углом, а не с равенством сторон.', 'That name is for when one angle is right, not for equal sides.'),
      },
      {
        id: 'wrong2', show: L("Romb", 'Ромб', 'A rhombus'),
        hint: L("Rombda TO'RTALA tomon teng va parallelogramm, bu yerda faqat yon tomonlar teng.", 'В ромбе равны ВСЕ четыре стороны, и это параллелограмм, а здесь равны только боковые.', 'In a rhombus ALL four sides are equal, and it is a parallelogram; here only the legs are equal.'),
      },
    ],
    after: L(
      "To'g'ri. Yon tomonlari teng bo'lgan trapetsiya, teng yonli trapetsiya deyiladi, va uning asosidagi burchaklari ham teng bo'ladi.",
      'Верно. Трапеция с равными боковыми сторонами называется равнобедренной, и её углы при основании тоже равны.',
      'Correct. A trapezoid with equal legs is called isosceles, and its base angles are equal too.',
    ),
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): trapetsiyaning alomati,
// ikki shart birga.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З81',
  eyebrow: L('IKKI SHART BIRGA', 'ДВА УСЛОВИЯ ВМЕСТЕ', 'TWO CONDITIONS TOGETHER'),
  title: L(
    "Trapetsiyaning alomati, ikki shart birga",
    'Признак трапеции, два условия вместе',
    'The criterion for a trapezoid, two conditions together',
  ),
  audio: [
    A('mount',
      "To'rtburchak trapetsiya bo'lishi uchun ikki shart birga bajarilishi kerak.",
      'Чтобы четырёхугольник был трапецией, нужны сразу два условия.',
      'For a quadrilateral to be a trapezoid, two conditions must hold together.'),
    W('p2',
      "Birinchi shart, bir tomondagi burchaklar yig'indisi 180 gradus, bu bir juft tomonni parallel qiladi.",
      'Первое условие, сумма углов с одной стороны сто восемьдесят градусов, это делает одну пару сторон параллельной.',
      'The first condition, the sum of angles on one side is a hundred eighty degrees, this makes one pair of sides parallel.'),
    W('p4',
      "Ikkinchi shart, qo'shni tomondagi yig'indi 180 dan farqli, bu ikkinchi juftni parallel EMAS qiladi, aks holda parallelogramm chiqardi.",
      'Второе условие, сумма на соседней стороне отличается от ста восьмидесяти, это делает вторую пару НЕ параллельной, иначе вышел бы параллелограмм.',
      'The second condition, the sum on the adjacent side differs from a hundred eighty, this makes the second pair NOT parallel, otherwise a parallelogram would result.',
    ),
  ],
  props: {
    tokens: [
      { t: '∠A + ∠B = 180°', id: 'a' },
      { t: '  ,  ', id: 'mid' },
      { t: '∠B + ∠C ≠ 180°', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi shart. AB tomonga yopishgan burchaklar yig'indisi 180 gradus, shuning uchun AD parallel BC.",
          'Первое условие. Сумма углов, прилежащих к AB, сто восемьдесят градусов, поэтому AD параллельна BC.',
          'The first condition. The sum of the angles adjacent to AB is a hundred eighty degrees, so AD is parallel to BC.',
        ),
      },
      {
        focus: 'mid',
        text: L(
          "Ikki shart bir vaqtda tekshiriladi, bittasi yetarli emas.",
          'Оба условия проверяются одновременно, одного недостаточно.',
          'Both conditions are checked at once, one alone is not enough.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi shart. BC tomonga yopishgan burchaklar yig'indisi 180 dan farqli, shuning uchun AB parallel DC emas.",
          'Второе условие. Сумма углов, прилежащих к BC, отличается от ста восьмидесяти, поэтому AB не параллельна DC.',
          'The second condition. The sum of the angles adjacent to BC differs from a hundred eighty, so AB is not parallel to DC.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Agar ikkinchi shart tekshirilmasa, xato natijaga kelish mumkin: ikki shart ham 180 gradus bersa, to'rtburchak trapetsiya emas, parallelogramm bo'lib chiqadi.",
        'Если не проверить второе условие, можно ошибиться: если оба условия дают сто восемьдесят градусов, четырёхугольник не трапеция, а параллелограмм.',
        'If the second condition is not checked, a mistake can follow: if both conditions give a hundred eighty degrees, the quadrilateral is not a trapezoid but a parallelogram.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Darslik 9-mavzu ta'rifi va
// alomati.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З81',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Trapetsiya va uning alomati",
    'Трапеция и её признак',
    'The trapezoid and its criterion',
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
      { id: 'f1', label: L("ikkita tomoni parallel, qolgan ikkitasi parallel bo'lmagan to'rtburchak trapetsiya", 'четырёхугольник с двумя параллельными и двумя непараллельными сторонами это трапеция', 'a quadrilateral with two parallel and two non-parallel sides is a trapezoid') },
      { id: 'f2', label: L("parallel tomonlar asoslar, parallel bo'lmaganlari yon tomonlar deyiladi", 'параллельные стороны называются основаниями, непараллельные, боковыми', 'the parallel sides are called the bases, the non-parallel ones the legs') },
      { id: 'f3', label: L("bir burchagi to'g'ri bo'lsa, bir xil yon tomondagi burchak ham to'g'ri bo'ladi", 'если один угол прямой, угол на той же боковой стороне тоже прямой', 'if one angle is right, the angle on the same leg is right too') },
      { id: 'f4', label: L("teng yonli trapetsiyaning asosidagi burchaklari teng", 'углы равнобедренной трапеции при основании равны', 'the base angles of an isosceles trapezoid are equal') },
      { id: 'w1', label: L("bitta juft burchak yig'indisi 180 gradus bo'lishi trapetsiya uchun yetarli", 'для трапеции достаточно, чтобы одна пара углов давала сто восемьдесят градусов', 'for a trapezoid it is enough that one pair of angles sums to a hundred eighty degrees') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Faqat bitta shart YETARLI EMAS, agar ikkinchi juft ham 180 gradus bersa, bu parallelogramm bo'lib qoladi, trapetsiya emas.",
      'Так не складывается. Одного условия НЕ ДОСТАТОЧНО, если вторая пара тоже даёт сто восемьдесят градусов, это остаётся параллелограммом, а не трапецией.',
      'That does not fit. One condition alone is NOT ENOUGH; if the second pair also gives a hundred eighty degrees, it remains a parallelogram, not a trapezoid.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, I bob, 9- va 10-mavzular asosida (29-33-bet)",
        'Правило на основе геометрии, глава I, темы 9 и 10 учебника (стр. 29-33)',
        'The rule is based on geometry, chapter I, topics 9 and 10 of the textbook (pages 29-33)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Bunday shaklda nechta juft tomon parallel bo'lishini bilmasdik",
        'Мы не знали, сколько пар сторон параллельно в такой фигуре',
        'We did not know how many pairs of sides are parallel in such a shape',
      ),
      right: L(
        "endi faqat bitta juft, asoslar, parallel bo'lishini bilamiz",
        'теперь знаем, что параллельна только одна пара, основания',
        'now we know only one pair, the bases, is parallel',
      ),
      winner: 'right',
      note: L(
        "Asoslar parallel, yon tomonlar emas, bitta to'g'ri burchak ikkinchisini beradi",
        'Основания параллельны, боковые нет, один прямой угол даёт второй',
        'The bases are parallel, the legs are not, one right angle gives the second',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): asosdagi burchaklardan
// qolganlarini topish (103-mashq uslubi, 31-bet).
// ============================================================
const ASK_ANGLES = L("Qolgan burchaklar qancha?", 'Каковы остальные углы?', 'What are the remaining angles?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З81',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ikki burchakdan qolgan ikkitasini toping",
    'Найди два оставшихся угла по двум данным',
    'Find the two remaining angles from the two given',
  ),
  audio: [
    A('mount',
      "Trapetsiyaning ikki burchagi berilgan. Qolgan ikkitasi 180 dan ayirib topiladi.",
      'Даны два угла трапеции. Остальные два находятся вычитанием из ста восьмидесяти.',
      'Two angles of the trapezoid are given. The other two are found by subtracting from a hundred eighty.'),
    A('why',
      "Har bir yon tomonga yopishgan ikki burchak yig'indisi 180 gradus.",
      'Сумма двух углов, прилежащих к каждой боковой стороне, сто восемьдесят градусов.',
      'The sum of the two angles adjacent to each leg is a hundred eighty degrees.'),
  ],
  props: {
    doneNote: L(
      "To'rttasi ham hal bo'ldi. Har safar 180 dan berilgan burchak ayirilgan.",
      'Все четыре разобраны. Каждый раз из ста восьмидесяти вычитался данный угол.',
      'All four are done. Each time the given angle was subtracted from a hundred eighty.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'∠B = 110°,   ∠C = 99°'}</Row>,
        ok: L("Ha. Yuz o'ttizdan yuz o'nni ayirsak, yetmish, undan to'qson to'qqizni ayirsak, sakson bir.", 'Да. Из ста восьмидесяти минус сто десять, семьдесят, минус девяносто девять, восемьдесят один.', 'Yes. A hundred eighty minus a hundred ten is seventy, minus ninety-nine is eighty-one.'),
        question: ASK_ANGLES,
        items: [
          { id: 'a', right: true, label: '∠A = 70°, ∠D = 81°' },
          { id: 'b', label: '∠A = 110°, ∠D = 99°', hint: L("Burchaklar teng emas, ular bir-birini 180 gradusgacha to'ldiradi.", 'Углы не равны, они дополняют друг друга до ста восьмидесяти.', 'The angles are not equal, they add up to a hundred eighty.') },
        ],
        solution: ['180° − 110° = 70°', '180° − 99° = 81°'],
      },
      {
        expr: <Row size="big" align="center">{'∠A = 65°,   ∠D = 72°'}</Row>,
        ok: L("Ha. Yuz o'ttizdan oltmish beshni ayirsak, yuz o'n besh, yetmish ikkini ayirsak, yuz sakkiz.", 'Да. Из ста восьмидесяти минус шестьдесят пять, сто пятнадцать, минус семьдесят два, сто восемь.', 'Yes. A hundred eighty minus sixty-five is a hundred fifteen, minus seventy-two is a hundred eight.'),
        question: ASK_ANGLES,
        items: [
          { id: 'a', right: true, label: '∠B = 115°, ∠C = 108°' },
          { id: 'b', label: '∠B = 65°, ∠C = 72°', hint: L("Bu berilgan burchaklarning o'zi, qolganlari emas.", 'Это сами данные углы, а не остальные.', 'That is the given angles themselves, not the remaining ones.') },
        ],
        solution: ['180° − 65° = 115°', '180° − 72° = 108°'],
      },
      {
        expr: <Row size="big" align="center">{'∠A = 90°,   ∠D = 60°'}</Row>,
        ok: L("Ha. Yuz o'ttizdan to'qsonni ayirsak, to'qson, oltmishni ayirsak, yuz yigirma.", 'Да. Из ста восьмидесяти минус девяносто, девяносто, минус шестьдесят, сто двадцать.', 'Yes. A hundred eighty minus ninety is ninety, minus sixty is a hundred twenty.'),
        question: ASK_ANGLES,
        items: [
          { id: 'a', right: true, label: '∠B = 90°, ∠C = 120°' },
          { id: 'b', label: '∠B = 90°, ∠C = 60°', hint: L("Burchak C, burchak D ga teng emas, u bilan yig'indisi 180 gradus.", 'Угол C не равен углу D, их сумма сто восемьдесят.', 'Angle C is not equal to angle D, their sum is a hundred eighty.') },
        ],
        solution: ['180° − 90° = 90°', '180° − 60° = 120°'],
      },
      {
        expr: <Row size="big" align="center">{'∠B = 100°,   ∠C = 95°'}</Row>,
        ok: L("Ha. Yuz o'ttizdan yuzni ayirsak, sakson, to'qson beshni ayirsak, sakson besh.", 'Да. Из ста восьмидесяти минус сто, восемьдесят, минус девяносто пять, восемьдесят пять.', 'Yes. A hundred eighty minus a hundred is eighty, minus ninety-five is eighty-five.'),
        question: ASK_ANGLES,
        items: [
          { id: 'a', right: true, label: '∠A = 80°, ∠D = 85°' },
          { id: 'b', label: '∠A = 80°, ∠D = 80°', hint: L("Ikkinchi burchak boshqa songa bog'liq, ikkalasi bir xil chiqmaydi.", 'Второй угол зависит от другого числа, они не совпадают.', 'The second angle depends on a different number, they do not come out the same.') },
        ],
        solution: ['180° − 100° = 80°', '180° − 95° = 85°'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): to'g'ri burchakli trapetsiya,
// natijani qo'llash.
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З82',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "To'g'ri burchakli trapetsiyada ikkinchi burchakni toping",
    'Найди второй угол в прямоугольной трапеции',
    'Find the second angle in a right trapezoid',
  ),
  audio: [
    A('mount',
      "Bitta to'g'ri burchak berilgan. Bir xil yon tomondagi ikkinchisini toping.",
      'Дан один прямой угол. Найди второй на той же боковой стороне.',
      'One right angle is given. Find the second one on the same leg.'),
    A('why',
      "Bu ikkinchi burchak ham to'g'ri, chunki ular birga 180 gradus berishi kerak.",
      'Этот второй угол тоже прямой, потому что вместе они должны давать сто восемьдесят.',
      'This second angle is also right, because together they must give a hundred eighty.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar bir xil yon tomondagi ikkinchi burchak to'g'ri chiqqan.",
      'Все три разобраны. Каждый раз второй угол на той же боковой стороне выходил прямым.',
      'All three are done. Each time the second angle on the same leg came out right.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'∠A = 90°'}</Row>,
        ok: L("Ha. Bir tomondagi ikki burchak birga to'g'ri bo'ladi.", 'Да. Оба угла на одной боковой стороне прямые вместе.', 'Yes. Both angles on one leg are right together.'),
        question: L("Burchak B necha gradus?", 'Сколько градусов угол B?', 'How many degrees is angle B?'),
        items: [
          { id: 'a', right: true, label: '90°' },
          { id: 'b', label: '180°', hint: L("Bu ikki burchakning yig'indisi, bittasining o'zi emas.", 'Это сумма двух углов, а не сам угол.', 'That is the sum of the two angles, not the angle itself.') },
        ],
        solution: ['180° − 90°', '90°'],
      },
      {
        expr: <Row size="big" align="center">{'∠B = 90°,   ∠C = 115°'}</Row>,
        ok: L("Ha. Burchak D, 180 dan yuz o'n beshni ayirib topiladi, oltmish besh.", 'Да. Угол D находится вычитанием ста пятнадцати из ста восьмидесяти, шестьдесят пять.', 'Yes. Angle D is found by subtracting a hundred fifteen from a hundred eighty, sixty-five.'),
        question: L("Burchak A va burchak D necha gradus?", 'Сколько градусов угол A и угол D?', 'How many degrees are angle A and angle D?'),
        items: [
          { id: 'a', right: true, label: '∠A = 90°, ∠D = 65°' },
          { id: 'b', label: '∠A = 90°, ∠D = 115°', hint: L("Burchak D, burchak C ga teng emas, ular bilan yig'indisi 180 gradus.", 'Угол D не равен углу C, их сумма сто восемьдесят.', 'Angle D is not equal to angle C, their sum is a hundred eighty.') },
        ],
        solution: ['∠A = 90°', '180° − 115° = 65°'],
      },
      {
        expr: <Row size="big" align="center">{'∠C = 90°,   ∠D = 90°'}</Row>,
        ok: L("Ha. Bunda ikki yon tomonda ham to'g'ri burchak bor, bu maxsus holat, to'rtburchak yon tomonlari perpendikulyar.", 'Да. Здесь прямой угол есть на обеих боковых сторонах, это особый случай, боковые стороны перпендикулярны.', 'Yes. Here there is a right angle on both legs, a special case, the legs are perpendicular.'),
        question: L("Bu trapetsiyada nechta burchak to'g'ri bo'lishi mumkin?", 'Сколько углов может быть прямыми в этой трапеции?', 'How many angles could be right in this trapezoid?'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '2', hint: L("Agar ikkinchi yon tomonda ham to'g'ri burchak bo'lsa, jami to'rttasi to'g'ri bo'ladi, bu esa to'g'ri to'rtburchak.", 'Если и на второй боковой стороне прямой угол, все четыре прямые, а это уже прямоугольник.', 'If the second leg also has a right angle, all four are right, and that is a rectangle.') },
        ],
        solution: [L("barcha to'rt burchak to'g'ri bo'lsa, u to'g'ri to'rtburchak", 'если все четыре угла прямые, это прямоугольник', 'if all four angles are right, it is a rectangle')],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): burchaklar
// yig'indisini son bilan tekshirish (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Barcha burchaklar yig'indisini tekshiring",
    'Проверь сумму всех углов',
    'Check the sum of all the angles',
  ),
  audio: [
    A('mount',
      "Uch trapetsiya. Har birida to'rt burchak berilgan, yig'indisi tekshiriladi.",
      'Три трапеции. В каждой даны четыре угла, сумма проверяется.',
      'Three trapezoids. In each, four angles are given, the sum is checked.'),
    A('why',
      "Har qanday to'rtburchakning burchaklari yig'indisi 360 gradus.",
      'Сумма углов любого четырёхугольника триста шестьдесят градусов.',
      'The sum of the angles of any quadrilateral is three hundred sixty degrees.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar yig'indi 360 gradusga tekshirilgan.",
      'Все три разобраны. Каждый раз сумма проверялась на триста шестьдесят градусов.',
      'All three are done. Each time the sum was checked against three hundred sixty degrees.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'70°, 110°, 99°, 81°'}</Row>,
        ok: L("Ha. To'rttasi qo'shilsa, uch yuz oltmish chiqadi.", 'Да. Все четыре складываются, получается триста шестьдесят.', 'Yes. All four add up to three hundred sixty.'),
        question: L("Yig'indi 360 gradusga tengmi?", 'Равна ли сумма трёмстам шестидесяти градусам?', 'Does the sum equal three hundred sixty degrees?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Qo'shib ko'ring, aynan uch yuz oltmish chiqadi.", 'Сложи, получится ровно триста шестьдесят.', 'Add them, it comes out to exactly three hundred sixty.') },
        ],
        solution: ['70+110+99+81', '360°'],
      },
      {
        expr: <Row size="big" align="center">{'90°, 90°, 120°, 60°'}</Row>,
        ok: L("Ha. To'rttasi qo'shilsa, uch yuz oltmish chiqadi.", 'Да. Все четыре складываются, получается триста шестьдесят.', 'Yes. All four add up to three hundred sixty.'),
        question: L("Yig'indi qancha?", 'Чему равна сумма?', 'What is the sum?'),
        items: [
          { id: 'a', right: true, label: '360°' },
          { id: 'b', label: '350°', hint: L("Qaytadan qo'shing, bitta gradus tushib qolgan.", 'Сложи снова, потерялся один градус.', 'Add again, one degree was lost.') },
        ],
        solution: ['90+90+120+60', '360°'],
      },
      {
        expr: <Row size="big" align="center">{'65°, 115°, 108°, 72°'}</Row>,
        ok: L("Ha. To'rttasi qo'shilsa, uch yuz oltmish chiqadi.", 'Да. Все четыре складываются, получается триста шестьдесят.', 'Yes. All four add up to three hundred sixty.'),
        question: L("Yig'indi 360 gradusga tengmi?", 'Равна ли сумма трёмстам шестидесяти градусам?', 'Does the sum equal three hundred sixty degrees?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Qo'shib ko'ring, aynan uch yuz oltmish chiqadi.", 'Сложи, получится ровно триста шестьдесят.', 'Add them, it comes out to exactly three hundred sixty.') },
        ],
        solution: ['65+115+108+72', '360°'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): ikkinchi juft tomon
// tekshirilmagan (З81) va faqat bitta to'g'ri burchak deb hisoblangan (З82).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З81',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato fikrda nima noto'g'ri",
    'Что неверно в двух ошибочных утверждениях',
    'What is wrong in two mistaken statements',
  ),
  audio: [
    A('mount',
      "Ikki fikr aytilgan. Ikkalasida ham trapetsiya haqida xato bor.",
      'Высказаны два утверждения. В обоих есть ошибка о трапеции.',
      'Two statements are made. Both contain a mistake about the trapezoid.'),
    A('why',
      "Ikkinchi juft tomon tekshirilmasa yoki bitta burchak unutilsa, xato kelib chiqadi.",
      'Если не проверить вторую пару сторон или забыть один угол, возникает ошибка.',
      'If the second pair of sides is not checked, or one angle is forgotten, a mistake arises.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham shartni to'liq tekshirmaslikdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за неполной проверки условия.',
      'Both are done. Both mistakes came from not fully checking the condition.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'∠A + ∠B = 180°'}</Row>,
        ok: L("Ha. Agar qo'shni tomondagi burchaklar yig'indisi ham 180 gradus bo'lib chiqsa, bu to'rtburchak parallelogramm, trapetsiya emas.", 'Да. Если сумма углов на соседней стороне тоже окажется ста восьмидесяти, это параллелограмм, а не трапеция.', 'Yes. If the sum of the angles on the adjacent side also turns out to be a hundred eighty, this is a parallelogram, not a trapezoid.'),
        question: L("Shu shartning o'zidan to'rtburchak trapetsiya deb xulosa qilingan bo'lsa, bu yerda xato qayerda?", 'Если из одного этого условия сделан вывод, что четырёхугольник трапеция, в чём здесь ошибка?', 'If from this condition alone it was concluded that the quadrilateral is a trapezoid, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ikkinchi juft tomonning parallel emasligi tekshirilmagan", 'Не проверено, что вторая пара сторон не параллельна', 'It was not checked that the second pair of sides is not parallel') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, faqat bitta shart trapetsiya uchun yetarli emas.", 'Это и есть показанная ошибка, одного условия для трапеции не хватает.', 'This is the very mistake shown; one condition is not enough for a trapezoid.') },
        ],
        solution: [L("ikkinchi shart ham tekshirilishi kerak", 'нужно проверить и второе условие', 'the second condition must also be checked')],
      },
      {
        expr: <Row size="big" align="center">{'∠A = 90°'}</Row>,
        ok: L("Ha. Bir xil yon tomondagi burchak B ham avtomatik to'g'ri bo'ladi, bu alohida aytilishi shart emas, lekin unutilmasligi kerak.", 'Да. Угол B на той же боковой стороне тоже автоматически прямой, это не обязательно проговаривать отдельно, но забывать не нужно.', 'Yes. Angle B on the same leg is also automatically right, this need not be stated separately, but must not be forgotten.'),
        question: L("To'g'ri burchakli trapetsiyada shu burchakdan boshqa nima unutilishi mumkin?", 'Что ещё, кроме этого угла, можно забыть в прямоугольной трапеции?', 'What else, besides this angle, could be forgotten in a right trapezoid?'),
        items: [
          { id: 'a', right: true, label: L("Bir xil yon tomondagi ikkinchi to'g'ri burchak", 'Второй прямой угол на той же боковой стороне', 'The second right angle on the same leg') },
          { id: 'b', label: L("Hech narsa unutilmaydi", 'Ничего не забывается', 'Nothing is forgotten'), hint: L("Ko'pincha faqat bitta burchak to'g'ri deb qolib ketiladi, ikkinchisi esa avtomatik kelib chiqadi.", 'Часто останавливаются на одном прямом угле, а второй следует автоматически.', 'Often only one right angle is noted, while the second follows automatically.') },
        ],
        solution: [L("burchak B ham to'g'ri", 'угол B тоже прямой', 'angle B is also right')],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): asosdagi burchakdan
// qolganini qadamlab topish.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З82',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Bir burchakdan bir xil yon tomondagisini qadamlab toping",
    'Найди угол на той же боковой стороне по шагам',
    'Find the angle on the same leg step by step',
  ),
  audio: [
    A('mount',
      "Bir burchak berilgan. 180 dan ayirib, bir xil yon tomondagisini topamiz.",
      'Дан один угол. Отняв от ста восьмидесяти, находим угол на той же боковой стороне.',
      'One angle is given. Subtracting from a hundred eighty gives the angle on the same leg.'),
    A('why',
      "Bu qadam har doim bir xil, faqat sonlar o'zgaradi.",
      'Этот шаг всегда одинаков, меняются только числа.',
      'This step is always the same, only the numbers change.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar 180 dan berilgan burchak ayirilgan.",
      'Все три заполнены. Каждый раз из ста восьмидесяти вычитался данный угол.',
      'All three are filled. Each time the given angle was subtracted from a hundred eighty.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['180°', '90°'],
      lines: [
        [{ t: '90°   →   ' }, { slot: '180°' }, { t: ' − 90° = ' }, { slot: '90°' }],
      ],
    },
    tasks: [
      {
        chips: ['180°', '95°'],
        lines: [
          [{ t: '85°   →   ' }, { slot: '180°' }, { t: ' − 85° = ' }, { slot: '95°' }],
        ],
      },
      {
        chips: ['180°', '67°'],
        lines: [
          [{ t: '113°   →   ' }, { slot: '180°' }, { t: ' − 113° = ' }, { slot: '67°' }],
        ],
      },
      {
        chips: ['180°', '124°'],
        lines: [
          [{ t: '56°   →   ' }, { slot: '180°' }, { t: ' − 56° = ' }, { slot: '124°' }],
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
    "Trapetsiya bo'yicha to'rt savol",
    'Четыре вопроса о трапеции',
    'Four questions about the trapezoid',
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
        id: 'q1', tag: 'З81',
        ask: L('Trapetsiyada nechta juft tomon parallel?', 'Сколько пар сторон параллельно в трапеции?', 'How many pairs of sides are parallel in a trapezoid?'),
        options: [
          { id: 'ok', right: true, label: '1' },
          { id: 'no', label: '2' },
        ],
        hint: L("Ikkita juft parallel bo'lsa, bu parallelogramm bo'lardi.", 'Если параллельны обе пары, это был бы параллелограмм.', 'If both pairs were parallel, it would be a parallelogram.'),
        ok: L("To'g'ri, faqat bitta juft, asoslar, parallel.", 'Верно, только одна пара, основания, параллельна.', 'Correct, only one pair, the bases, is parallel.'),
      },
      {
        id: 'q2', tag: 'З82',
        ask: L('To\'g\'ri burchakli trapetsiyada burchak A to\'g\'ri bo\'lsa, burchak B ham to\'g\'rimi?', 'В прямоугольной трапеции, если угол A прямой, угол B тоже прямой?', 'In a right trapezoid, if angle A is right, is angle B right too?'),
        options: [
          { id: 'ok', right: true, label: L('Ha, agar B bir xil yon tomonda bo\'lsa', 'Да, если B на той же боковой стороне', 'Yes, if B is on the same leg') },
          { id: 'no', label: L("Yo'q, hech qachon", 'Нет, никогда', 'No, never') },
        ],
        hint: L("Bir tomondagi ikki burchak birga 180 gradus, ikkalasi ham to'g'ri bo'lishi mumkin.", 'Оба угла на одной стороне вместе дают сто восемьдесят, оба могут быть прямыми.', 'Both angles on one side together give a hundred eighty, both can be right.'),
        ok: L("To'g'ri, bir xil yon tomondagi burchak avtomatik to'g'ri bo'ladi.", 'Верно, угол на той же боковой стороне автоматически прямой.', 'Correct, the angle on the same leg is automatically right.'),
      },
      {
        id: 'q3', tag: 'З81',
        ask: L('Trapetsiyaning parallel tomonlari qanday ataladi?', 'Как называются параллельные стороны трапеции?', 'What are the parallel sides of a trapezoid called?'),
        options: [
          { id: 'ok', right: true, label: L('Asoslar', 'Основания', 'The bases') },
          { id: 'no', label: L('Yon tomonlar', 'Боковые стороны', 'The legs') },
        ],
        hint: L("Yon tomonlar aynan PARALLEL BO'LMAGAN tomonlar.", 'Боковые стороны это НЕ параллельные стороны.', 'The legs are precisely the sides that are NOT parallel.'),
        ok: L("To'g'ri, parallel tomonlar asoslar deyiladi.", 'Верно, параллельные стороны называются основаниями.', 'Correct, the parallel sides are called the bases.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('Burchaklar 70°, 110°, 99°, 81° bo\'lsa, yig\'indisi 360°ga tengmi?', 'Верно ли, что сумма углов 70°, 110°, 99°, 81° равна 360°?', 'Is it true that the sum of angles 70°, 110°, 99°, 81° equals 360°?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Qo'shib ko'ring, natija uch yuz oltmish chiqadi.", 'Сложи, результат триста шестьдесят.', 'Add them, the result is three hundred sixty.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З82',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Burchak A to'qson bo'lsa, burchak B ni yig'ing.",
            'Собери угол B, если угол A равен девяносто.',
            'Assemble angle B, if angle A is ninety.',
          ),
          lines: [
            [{ t: '∠A = 90°   →   ∠B = ' }, { slot: '90°' }],
          ],
          tiles: [
            { id: 't1', v: '90°', x: 12, y: 12 },
            { id: 't2', v: '180°', x: 60, y: 14 },
            { id: 't3', v: '45°', x: 30, y: 50 },
            { id: 't4', v: '270°', x: 78, y: 48 },
          ],
          hint: L(
            "180 dan to'qsonni ayiring.",
            'Отними девяносто от ста восьмидесяти.',
            'Subtract ninety from a hundred eighty.',
          ),
          doneNote: L(
            "Yig'ildi. Bir xil yon tomondagi ikkinchi burchak ham to'g'ri chiqdi.",
            'Собрано. Второй угол на той же боковой стороне тоже вышел прямым.',
            'Assembled. The second angle on the same leg also came out right.',
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
    "Asoslar parallel, yon tomonlar emas, bitta to'g'ri burchak ikkinchisini beradi",
    'Основания параллельны, боковые нет, один прямой угол даёт второй',
    'The bases are parallel, the legs are not, one right angle gives the second',
  ),
  audio: [
    A('s0',
      "Darsdan bitta chertyozh qoladi. Asoslar parallel, yon tomonlar emas.",
      'С урока остаётся один чертёж. Основания параллельны, боковые стороны нет.',
      'One drawing stays with you. The bases are parallel, the legs are not.'),
    A('s1',
      "Bugun uch narsa qilindi. Asos va yon tomonni ajratib bilishni o'rgandingiz, trapetsiyaning ikki shartli alomatini ko'rdingiz va to'g'ri burchakli trapetsiyada ikkinchi burchakning avtomatik kelib chiqishini isbotladingiz.",
      'Сегодня сделано три вещи. Ты научился различать основание и боковую сторону, увидел двухусловный признак трапеции и доказал, что в прямоугольной трапеции второй угол выходит автоматически.',
      'Three things are done today. You learned to tell the base from the leg, saw the two-condition criterion for a trapezoid, and proved that in a right trapezoid the second angle follows automatically.'),
    A('s2',
      "Keyingi darsda parallelogrammning yuzi. Kesish va qayta joylashtirish orqali formula chiqariladi.",
      'В следующем уроке площадь параллелограмма. Формула выводится через разрезание и перекладывание.',
      'The next lesson covers the area of the parallelogram. The formula is derived by cutting and rearranging.',
    ),
  ],
  props: {
    mark: '∠A + ∠B = 180°,   ∠B + ∠C ≠ 180°',
    markNote: L(
      "birinchi shart parallellikni beradi, ikkinchisi trapetsiya ekanini",
      'первое условие даёт параллельность, второе, что это трапеция',
      'the first condition gives parallelism, the second that it is a trapezoid',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: parallelogrammning yuzi",
      'Следующий урок: площадь параллелограмма',
      'Next lesson: the area of the parallelogram',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
