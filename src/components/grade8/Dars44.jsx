// ============================================================================
// 8-sinf, Dars 44. PIFAGOR TEOREMASI VA UNING ISBOTI.
//
// BLOK Б7, BIRINCHI DARS (2026-08-23 qayta qurilgan reja bo'yicha). Bu fayl,
// FAQAT MA'LUMOT. Mexanika `screens.jsx`, `geofigure.jsx`, `prooflines.jsx`,
// `squareswap.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da.
//
// ESLATMA BLOK REJASI HAQIDA: eski reja (44-55-darslar o'xshashlik,
// trigonometriya, koordinatalar usuli haqida edi) darslikda YO'Q mavzular
// bo'lgani uchun 2026-08-23 metodist qarori bilan qayta qurildi, haqiqiy
// kitobga ko'ra (Pifagor, aylana, vektorlar). Tafsilot:
// DARSLAR_REJASI_8SINF.md, Блок 7.
//
// YANGI PRIBOR: `SquareSwap` — BLOKNING PILOT DARSI. `AreaCut`ning davomi
// (ETALON_8SINF.md, "AreaCut" bo'limida oldindan aytilgan: "to'rt uchburchak
// kvadrat ichida qayta joylashtiriladi"). Tomoni (a+b) bo'lgan bitta katta
// kvadrat ichida to'rt xil to'g'ri burchakli uchburchak (katetlari a, b) ikki
// xil holatda joylashtiriladi: birinchisida o'rtada qiyshiq c² qoladi,
// ikkinchisida ikki burchakda a² va b² qoladi. Katta kvadrat o'zgarmadi,
// demak ochiq yuzalar teng: c² = a² + b².
//
// MANBA: 8-sinf geometriya darsligi, 3-§ (PIFAGOR TEOREMASI):
//   - 27-mavzu (93-95-bet): teorema bayoni, tarixiy ma'lumot, Pifagor
//     uchliklari jadvali (3,4,5 — "misr uchburchagi"; 5,12,13; va h.k.),
//     ma:n formulasi (a=m²-n², b=2mn, c=m²+n²), 2-masala (rombning
//     diagonallari 10 va 24 → tomoni 13, yarim diagonallar orqali);
//   - 28-mavzu (96-97-bet): isbot, ikkita bir xil (a+b) tomonli kvadrat,
//     174-rasm (a — pinvil, o'rtada c²; b — ikki burchakda a² va b²).
//
// TESKARI TEOREMA (29-mavzu) BU DARSDA YO'Q — u DARS 45 uchun saqlanadi.
//
// ADASHISHLAR, uchtasi yangi:
//   З91, gipotenuza katetlar YIG'INDISIGA teng deb hisoblangan (c = a + b,
//   chiziqli qo'shish, kvadratlar ishlatilmagan);
//   З92, ikkinchi katet gipotenuzadan birinchi katetni CHIZIQLI AYIRISH
//   orqali topilgan (b = c − a), kvadratlar ishlatilmagan;
//   З93, gipotenuza sifatida noto'g'ri tomon tanlangan (to'g'ri burchakka
//   qarama-qarshi turgan, ENG KATTA tomon emas);
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
  id: 'geo-8-44',
  n: 44,
  row: 49,
  block: 'Б7',
  topic: L("Pifagor teoremasi va uning isboti", 'Теорема Пифагора и её доказательство', "The Pythagorean theorem and its proof"),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "To'g'ri burchakli uchburchakda to'g'ri burchakka qarama-qarshi turgan tomon gipotenuza, u eng katta tomon, qolgan ikkitasi katetlar",
    'В прямоугольном треугольнике сторона, лежащая против прямого угла, гипотенуза, это наибольшая сторона, две другие катеты',
    'In a right triangle, the side opposite the right angle is the hypotenuse, it is the longest side, the other two are the legs',
  ),
  L(
    "Gipotenuzaning kvadrati katetlar kvadratlarining yig'indisiga teng, c² = a² + b²",
    'Квадрат гипотенузы равен сумме квадратов катетов, c² = a² + b²',
    'The square of the hypotenuse equals the sum of the squares of the legs, c² = a² + b²',
  ),
  L(
    "Bir xil to'rt uchburchakdan tuzilgan ikkita bir xil katta kvadratda, birida o'rtada c² qoladi, ikkinchisida a² va b² qoladi, demak ular teng",
    'В двух одинаковых больших квадратах, сложенных из одних и тех же четырёх треугольников, в одном остаётся c², в другом a² и b², значит они равны',
    'In two identical big squares made of the same four triangles, one leaves c² uncovered, the other leaves a² and b², so they are equal',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З91': {
    what: L(
      "gipotenuza katetlar yig'indisiga teng deb hisoblangan (c = a + b), kvadratlar ishlatilmagan",
      'гипотенуза принята равной сумме катетов (c = a + b), квадраты не использованы',
      'the hypotenuse was taken as the sum of the legs (c = a + b), squares were not used',
    ),
    wrong: null,
    at: 12,
  },
  'З92': {
    what: L(
      "ikkinchi katet gipotenuzadan birinchi katetni chiziqli ayirish orqali topilgan (b = c − a), kvadratlar ishlatilmagan",
      'второй катет найден линейным вычитанием первого катета из гипотенузы (b = c − a), квадраты не использованы',
      'the second leg was found by linearly subtracting the first leg from the hypotenuse (b = c − a), squares were not used',
    ),
    wrong: null,
    at: 12,
  },
  'З93': {
    what: L(
      "gipotenuza sifatida noto'g'ri tomon tanlangan, to'g'ri burchakka qarama-qarshi turgan eng katta tomon emas",
      'в качестве гипотенузы выбрана неверная сторона, не наибольшая, лежащая против прямого угла',
      'the wrong side was chosen as the hypotenuse, not the longest one lying opposite the right angle',
    ),
    wrong: null,
    at: 3,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (3-ekran, GeoFigure). To'g'ri burchakli
// uchburchak, to'g'ri burchak B da.
// ============================================================
const TRI = { A: [15, 85], B: [15, 20], C: [95, 20] }
const TRI_ORDER = ['A', 'B', 'C']

// ============================================================
// CHERTYOZH KOORDINATALARI (4-ekran, ProofLines). Bir xil uchburchak,
// isbot uchun nomlangan.
// ============================================================
const PYT = { A: [15, 85], B: [15, 20], C: [95, 20] }
const PYT_ORDER = ['A', 'B', 'C']

// ============================================================
// SAHNALAR (§6). Xuk: gipotenuza qanday topiladi. Yakun: ikki bir xil
// kvadrat, c² = a² + b².
// ============================================================
const SC_ASK = L('GIPOTENUZA QANDAY TOPILADI', 'КАК НАЙТИ ГИПОТЕНУЗУ', 'HOW IS THE HYPOTENUSE FOUND')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <polygon points="130,90 130,35 220,90" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="175" cy="70" r="15" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="175" y="76" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Ikki bir xil katta kvadrat, ikki xil ochiq yuza, ular teng",
      'Два одинаковых больших квадрата, две разные открытые площади, они равны',
      'Two identical big squares, two different uncovered areas, they are equal',
    )}>
      <rect x="130" y="35" width="55" height="55" fill="none" stroke={T.ink3} strokeWidth="1.4"/>
      <text x="157" y="67" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12" fontWeight="700" fill={T.ok}>c²</text>
      <text x="200" y="55" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14" fontWeight="700" fill={T.ok}>=</text>
      <rect x="215" y="35" width="30" height="30" fill="none" stroke={T.ink3} strokeWidth="1.2"/>
      <text x="230" y="53" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fontWeight="700" fill={T.graph}>a²</text>
      <text x="248" y="72" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14" fontWeight="700" fill={T.ok}>+</text>
      <rect x="215" y="70" width="25" height="25" fill="none" stroke={T.ink3} strokeWidth="1.2"/>
      <text x="227" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fontWeight="700" fill={T.accent}>b²</text>
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
  eyebrow: L('GIPOTENUZANI TOPISH', 'НАЙТИ ГИПОТЕНУЗУ', 'FINDING THE HYPOTENUSE'),
  title: L(
    "Katetlari uch va to'rt bo'lgan to'g'ri burchakli uchburchakning gipotenuzasi nechchiga teng deb o'ylaysiz",
    'Как думаешь, чему равна гипотенуза прямоугольного треугольника с катетами три и четыре',
    'What do you think the hypotenuse of a right triangle with legs three and four equals',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "To'g'ri burchakli uchburchakning ikki tomoni, katetlari, ma'lum, uch va to'rt.",
      'Известны два катета прямоугольного треугольника, три и четыре.',
      'Two sides of the right triangle, the legs, are known, three and four.'),
    A('why',
      "Taxmin qiling, uchinchi tomon, gipotenuza, nechchiga teng bo'ladi.",
      'Предположи, чему будет равна третья сторона, гипотенуза.',
      'Predict what the third side, the hypotenuse, will equal.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, gipotenuza nechchiga teng?",
      'Как думаешь, чему равна гипотенуза?',
      'What do you think the hypotenuse equals?',
    ),
    items: [
      { id: 'a', show: '7' },
      { id: 'b', show: '5' },
      { id: 'c', show: '12' },
      { id: 'd', show: L("Oldindan bilib bo'lmaydi", 'Заранее узнать нельзя', 'It cannot be known in advance') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Kvadratning yuzi (isbot uchun kerak).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Kvadratning yuzini eslash",
    'Вспоминаем площадь квадрата',
    'Recalling the area of the square',
  ),
  audio: [
    A('mount',
      "Kvadratning yuzi allaqachon ma'lum.",
      'Площадь квадрата уже известна.',
      'The area of the square is already known.'),
    A('why',
      "Bugungi isbot aynan shu formulaga tayanadi.",
      'Сегодняшнее доказательство опирается именно на эту формулу.',
      "Today's proof relies exactly on this formula."),
  ],
  props: {
    ask: L(
      "Kvadratning tomoni a bo'lsa, yuzi qanday topiladi?",
      'Если сторона квадрата a, как найти площадь?',
      'If the side of a square is a, how is the area found?',
    ),
    items: [
      { id: 'right', show: 'S = a²', right: true, name: L("tomon o'z-o'ziga ko'paytiriladi", 'сторона умножается сама на себя', 'the side is multiplied by itself') },
      {
        id: 'wrong1', show: 'S = 4a',
        hint: L("Bu perimetr formulasi, yuza emas.", 'Это формула периметра, а не площади.', 'That is the perimeter formula, not the area.'),
      },
      {
        id: 'wrong2', show: 'S = 2a',
        hint: L("Tomon ikki marta olinmaydi, o'z-o'ziga ko'paytiriladi.", 'Сторона не берётся дважды, а умножается сама на себя.', 'The side is not taken twice, it is multiplied by itself.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun buni ikki katta kvadratni solishtirish uchun ishlatamiz.",
      'Верно. Сегодня мы используем это, чтобы сравнить два больших квадрата.',
      'Correct. Today we will use this to compare two big squares.',
    ),
  },
}

// ============================================================
// EKRAN 3. GIPOTENUZANI TOPING (`geofigure`). Ловушка, eng katta
// tomon emas, boshqasi tanlangan (З93).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'geofigure',
  tag: 'З93',
  eyebrow: L('GIPOTENUZANI TOPING', 'НАЙДИ ГИПОТЕНУЗУ', 'FIND THE HYPOTENUSE'),
  title: L(
    "To'g'ri burchak B da. Gipotenuzani bosing",
    'Прямой угол в точке B. Нажми на гипотенузу',
    'The right angle is at B. Tap the hypotenuse',
  ),
  audio: [
    A('mount',
      "ABC uchburchakda to'g'ri burchak B nuqtada turadi.",
      'В треугольнике ABC прямой угол стоит в точке B.',
      'In triangle ABC, the right angle stands at point B.'),
    A('why',
      "Gipotenuza to'g'ri burchakka qarama-qarshi turgan tomon, u eng uzun tomon.",
      'Гипотенуза, сторона, лежащая против прямого угла, она самая длинная.',
      'The hypotenuse is the side opposite the right angle, it is the longest side.'),
  ],
  props: {
    points: TRI,
    order: TRI_ORDER,
    steps: [
      {
        kind: 'edges',
        targets: ['AC'],
        ask: L("Gipotenuzani bosing", 'Нажми на гипотенузу', 'Tap the hypotenuse'),
        hints: {
          AB: L("AB, katet, u to'g'ri burchakka tutashadi, gipotenuza emas.", 'AB, катет, он примыкает к прямому углу, это не гипотенуза.', 'AB is a leg, it touches the right angle, it is not the hypotenuse.'),
          BC: L("BC ham katet, u ham to'g'ri burchakka tutashadi.", 'BC тоже катет, он тоже примыкает к прямому углу.', 'BC is also a leg, it also touches the right angle.'),
        },
      },
    ],
    after: L(
      "To'g'ri. AC, to'g'ri burchakka qarama-qarshi, u gipotenuza va eng uzun tomon.",
      'Верно. AC лежит против прямого угла, это гипотенуза и самая длинная сторона.',
      'Correct. AC is opposite the right angle, it is the hypotenuse and the longest side.',
    ),
  },
}

// ============================================================
// EKRAN 4. ISBOT (`prooflines`). Teorema: c² = a² + b² (28-mavzu, 96-97-bet).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З91',
  eyebrow: L('FORMULANI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ФОРМУЛУ', 'PROVING THE FORMULA'),
  title: L(
    "Gipotenuzaning kvadrati katetlar kvadratlari yig'indisiga teng",
    'Квадрат гипотенузы равен сумме квадратов катетов',
    'The square of the hypotenuse equals the sum of the squares of the legs',
  ),
  audio: [
    A('mount',
      "ABC, to'g'ri burchakli uchburchak, AB va BC katetlar, AC gipotenuza.",
      'ABC, прямоугольный треугольник, AB и BC катеты, AC гипотенуза.',
      'ABC, a right triangle, AB and BC the legs, AC the hypotenuse.'),
    A('why',
      "Tomoni katetlar yig'indisiga teng bo'lgan ikkita bir xil kvadrat yasaymiz.",
      'Строим два одинаковых квадрата со стороной, равной сумме катетов.',
      'We build two identical squares with a side equal to the sum of the legs.'),
  ],
  props: {
    points: PYT,
    order: PYT_ORDER,
    marks: [],
    given: [
      L("ABC, to'g'ri burchakli uchburchak", 'ABC, прямоугольный треугольник', 'ABC, a right triangle'),
      L("AB, BC, katetlar; AC, gipotenuza", 'AB, BC, катеты; AC, гипотенуза', 'AB, BC, the legs; AC, the hypotenuse'),
    ],
    goal: L("AC² = AB² + BC²", 'AC² = AB² + BC²', 'AC² = AB² + BC²'),
    lines: [
      {
        text: L("shu uchburchakdan to'rttasini olib, tomoni (AB+BC) bo'lgan ikkita bir xil kvadrat yasaymiz", 'взяв четыре таких треугольника, строим два одинаковых квадрата со стороной (AB+BC)', 'taking four such triangles, we build two identical squares with side (AB+BC)'),
        options: [
          { id: 'ok', right: true, label: L("Ikkalasi ham to'rt bir xil uchburchakdan tuzilgan, shuning uchun yuzalari teng", 'Оба сложены из четырёх одинаковых треугольников, поэтому их площади равны', 'Both are made of four identical triangles, so their areas are equal') },
          { id: 'no', label: L("Ular teng, chunki bir xilday ko'rinadi", 'Они равны, потому что выглядят одинаково', 'They are equal because they look alike'), hint: L("Ko'rinish sabab emas, ikkalasi ham (AB+BC) tomonli kvadrat, shuning uchun teng.", 'Внешний вид не причина, оба квадрата со стороной (AB+BC), поэтому равны.', 'Appearance is not the reason, both are squares with side (AB+BC), so they are equal.') },
        ],
      },
      {
        text: L("birinchi kvadratda to'rt uchburchakdan tashqari, o'rtada tomoni AC bo'lgan qiyshiq kvadrat qoladi", 'в первом квадрате, кроме четырёх треугольников, в середине остаётся косой квадрат со стороной AC', 'in the first square, besides the four triangles, a tilted square with side AC remains in the middle'),
        options: [
          { id: 'ok', right: true, label: L("Uchburchaklarning gipotenuzalari o'rtada aynan shu qiyshiq kvadratni hosil qiladi", 'Гипотенузы треугольников в середине образуют именно этот косой квадрат', 'The hypotenuses of the triangles form exactly this tilted square in the middle') },
          { id: 'no', label: L("O'rtada hech narsa qolmaydi", 'В середине ничего не остаётся', 'Nothing remains in the middle'), hint: L("To'rt uchburchak butun kvadratni qoplamaydi, o'rtada AC tomonli kvadrat qoladi.", 'Четыре треугольника не покрывают весь квадрат, в середине остаётся квадрат со стороной AC.', 'The four triangles do not cover the whole square, a square with side AC remains in the middle.') },
        ],
      },
      {
        text: L("ikkinchi kvadratda esa xuddi shu to'rt uchburchak qayta joylashtirilib, ikki burchakda AB² va BC² kvadratlar qoladi", 'а во втором квадрате те же четыре треугольника переставлены так, что в двух углах остаются квадраты AB² и BC²', 'in the second square, the same four triangles are rearranged so that squares AB² and BC² remain in two corners'),
        options: [
          { id: 'ok', right: true, label: L("Uchburchaklar shu bilan bir xil, faqat joyi o'zgargan", 'Треугольники те же самые, изменилось только их положение', 'The triangles are the same, only their position changed') },
          { id: 'no', label: L("Bu boshqa uchburchaklar", 'Это другие треугольники', 'These are different triangles'), hint: L("Uchburchaklar bir xil qoladi, chunki katetlari AB va BC o'zgarmagan.", 'Треугольники остаются те же самые, потому что катеты AB и BC не изменились.', 'The triangles stay the same, because the legs AB and BC did not change.') },
        ],
      },
      {
        text: L("ikki kvadratning ochiq yuzasi teng, shuning uchun AC² = AB² + BC²", 'открытые площади двух квадратов равны, поэтому AC² = AB² + BC²', 'the uncovered areas of the two squares are equal, therefore AC² = AB² + BC²'),
        options: [
          { id: 'ok', right: true, label: L("Katta kvadratlar teng va ichidagi to'rt uchburchak ham teng, qolgan qismlar ham teng bo'lishi kerak", 'Большие квадраты равны, и четыре треугольника в них равны, значит и оставшиеся части равны', 'The big squares are equal, and the four triangles inside them are equal, so the remaining parts must be equal too') },
          { id: 'no', label: L("Chunki AC eng uzun tomon", 'Потому что AC самая длинная сторона', 'Because AC is the longest side'), hint: L("Uzunlikning o'zi sabab emas, teng yuzalarni ayirish kerak.", 'Сама длина не причина, нужно вычесть равные площади.', 'Length alone is not the reason, equal areas must be subtracted.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. Ikki bir xil katta kvadratda bitta xil to'rt uchburchak, demak qolgan qismlar ham teng, AC kvadrati AB kvadrati bilan BC kvadratining yig'indisiga teng.",
      'Доказано. В двух одинаковых больших квадратах одни и те же четыре треугольника, значит и оставшиеся части равны, квадрат AC равен сумме квадратов AB и BC.',
      'Proven. In two identical big squares the same four triangles, so the remaining parts are equal too, the square of AC equals the sum of the squares of AB and BC.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI (`squareswap`). PILOT DARS: to'rt
// uchburchak qayta joylashtiriladi, c² o'rniga a² va b² ochiladi.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'squareswap',
  tag: 'З91',
  eyebrow: L('QAYTA JOYLASHTIRING', 'ПЕРЕСТАВЬ', 'REARRANGE'),
  title: L(
    "To'rt uchburchakni qayta joylashtiring va ikkita ochiq yuzani solishtiring",
    'Переставь четыре треугольника и сравни две открытые площади',
    'Rearrange the four triangles and compare the two uncovered areas',
  ),
  audio: [
    A('mount',
      "Katetlar uch va to'rt. Bu, darslikdagi mashhur misr uchburchagi.",
      'Катеты три и четыре. Это знаменитый египетский треугольник из учебника.',
      'The legs are three and four. This is the famous Egyptian triangle from the textbook.'),
    A('why',
      "Tugmani bosib, to'rt uchburchakni ikkinchi holatga o'tkazing.",
      'Нажми на кнопку, чтобы перевести четыре треугольника в другое положение.',
      'Press the button to move the four triangles into the other position.'),
    W('swap',
      "Katta kvadrat o'zgarmadi, faqat ochiq qism o'zgardi. C kvadrati, a va b kvadratlari yig'indisiga teng.",
      'Большой квадрат не изменился, изменилась только открытая часть. Квадрат c равен сумме квадратов a и b.',
      'The big square did not change, only the uncovered part changed. The square of c equals the sum of the squares of a and b.'),
  ],
  props: {
    a: 3,
    b: 4,
    ask: L("Tugmani bosing", 'Нажми на кнопку', 'Press the button'),
    after: L(
      "Katta kvadrat bir xil qoldi, uning yuzasi ham. Ochiq qism o'zgardi, lekin qiymati bir xil.",
      'Большой квадрат остался тем же, как и его площадь. Открытая часть изменилась, но её значение то же.',
      'The big square stayed the same, so did its area. The uncovered part changed, but its value is the same.',
    ),
    fields: [
      {
        ask: L("Gipotenuzaning kvadrati, c², nechchiga teng?", 'Чему равен квадрат гипотенузы, c²?', 'What does the square of the hypotenuse, c², equal?'),
        kind: 'number',
        answer: '25',
        accepts: ['25'],
        hints: {
          '7': L("Yetti, uch bilan to'rtning yig'indisi, bu c emas. Kvadratlarni qo'shing, to'qqiz va o'n olti.", 'Семь, сумма трёх и четырёх, это не c. Сложи квадраты, девять и шестнадцать.', 'Seven is the sum of three and four, that is not c. Add the squares, nine and sixteen.'),
        },
      },
    ],
    note: L(
      "To'qqiz qo'shilgan o'n olti, yigirma besh.",
      'Девять плюс шестнадцать, двадцать пять.',
      'Nine plus sixteen, twenty-five.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (`twoways`): ikki xil uchlik, bir xil usul.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З91',
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Ikki xil uchburchakda bir xil usul bilan gipotenuzani topish",
    'Найти гипотенузу одинаковым способом в двух разных треугольниках',
    'Finding the hypotenuse the same way in two different triangles',
  ),
  audio: [
    A('mount',
      "Birinchi uchburchakning katetlari olti va sakkiz.",
      'Катеты первого треугольника шесть и восемь.',
      'The first triangle\'s legs are six and eight.'),
    W('w2',
      "Ikkinchisining katetlari besh va o'n ikki, ammo usul bir xil.",
      'У второго катеты пять и двенадцать, но способ тот же.',
      'The second one\'s legs are five and twelve, but the method is the same.'),
    W('w4',
      "Ikkalasida ham avval katetlarning kvadratlari qo'shiladi, keyin ildiz olinadi.",
      'В обоих случаях сначала складываются квадраты катетов, потом извлекается корень.',
      'In both cases, first the squares of the legs are added, then the root is taken.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL, OLTI VA SAKKIZ', 'СПОСОБ 1, ШЕСТЬ И ВОСЕМЬ', 'METHOD 1, SIX AND EIGHT'),
        lead: L(
          "Katetlari olti va sakkiz bo'lgan uchburchakda gipotenuzani topamiz",
          'Находим гипотенузу треугольника с катетами шесть и восемь',
          'We find the hypotenuse of a triangle with legs six and eight',
        ),
        rows: [
          { text: '6² + 8² = 36 + 64 = 100' },
          { text: L("ildiz o'n chiqadi", 'корень выходит десять', 'the root comes out to ten'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL, BESH VA O\'N IKKI', 'СПОСОБ 2, ПЯТЬ И ДВЕНАДЦАТЬ', 'METHOD 2, FIVE AND TWELVE'),
        lead: L(
          "Endi katetlari besh va o'n ikki bo'lgan uchburchakda topamiz",
          'Теперь находим для треугольника с катетами пять и двенадцать',
          'Now we find it for a triangle with legs five and twelve',
        ),
        rows: [
          { text: '5² + 12² = 25 + 144 = 169' },
          { text: L("ildiz o'n uch chiqadi", 'корень выходит тринадцать', 'the root comes out to thirteen'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASIDA HAM BIR XIL USUL', 'В ОБОИХ ОДИН И ТОТ ЖЕ СПОСОБ', 'THE SAME METHOD IN BOTH'),
        lead: L(
          "Katetlar boshqacha, usul bir xil, kvadratlar qo'shiladi",
          'Катеты разные, способ один, складываются квадраты',
          'The legs differ, the method is the same, squares are added',
        ),
        rows: [{ text: L("kvadratlar qo'shiladi, keyin ildiz olinadi", 'квадраты складываются, потом извлекается корень', 'squares are added, then the root is taken'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (`parts`): formulaning uch qismi va qayta yozilishi.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З92',
  eyebrow: L('FORMULANING UCH QISMI', 'ТРИ ЧАСТИ ФОРМУЛЫ', 'THE THREE PARTS OF THE FORMULA'),
  title: L(
    "Formulaning uch qismi",
    'Три части формулы',
    'The three parts of the formula',
  ),
  audio: [
    A('mount',
      "Bir formula, uch qism. Kerak bo'lganini oldinga olib chiqish mumkin.",
      'Одна формула, три части. Нужную часть можно вынести вперёд.',
      'One formula, three parts. The needed part can be moved to the front.'),
    W('p2',
      "Birinchi katet, uni topish uchun boshqa ikkitasi kerak.",
      'Первый катет, чтобы его найти, нужны два других.',
      'The first leg, to find it the other two are needed.'),
    W('p4',
      "Ikkinchi katet ham xuddi shunday, lekin sonlar ayirilib, keyin ildiz olinadi, oddiy ayirish emas.",
      'Второй катет так же, но числа вычитаются, а потом извлекается корень, не простое вычитание.',
      'The second leg the same way, but the numbers are subtracted, then the root is taken, not a plain subtraction.',
    ),
  ],
  props: {
    tokens: [
      { t: 'c²', id: 'mid' },
      { t: '  =  a²  +  ', id: 'a' },
      { t: 'b²', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Birinchi qism, gipotenuzaning kvadrati. Uni topish, eng oson yo'l.",
          'Первая часть, квадрат гипотенузы. Найти его, самый простой путь.',
          'The first part, the square of the hypotenuse. Finding it is the easiest path.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Ikkinchi qism, birinchi katetning kvadrati. Uni topmoqchi bo'lsak, a² = c² − b², ayirish, oddiy emas.",
          'Вторая часть, квадрат первого катета. Чтобы найти его, a² = c² − b², вычитание, не простое.',
          'The second part, the square of the first leg. To find it, a² = c² − b², a subtraction, not a plain one.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qism, ikkinchi katetning kvadrati. b² = c² − a², KVADRATLAR ayirilib, keyin ILDIZ olinadi.",
          'Третья часть, квадрат второго катета. b² = c² − a², вычитаются КВАДРАТЫ, потом извлекается КОРЕНЬ.',
          'The third part, the square of the second leg. b² = c² − a², the SQUARES are subtracted, then the ROOT is taken.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Katetlari va gipotenuzasi butun sonlardan iborat uchburchak Pifagor uchligi deyiladi, eng kichigi uch, to'rt va besh, u qadimgi Misrda to'g'ri burchak yasashda ishlatilgan.",
        'Треугольник, у которого катеты и гипотенуза целые числа, называется пифагоровой тройкой, самая маленькая, три, четыре и пять, применялась в древнем Египте для построения прямого угла.',
        'A triangle whose legs and hypotenuse are whole numbers is called a Pythagorean triple, the smallest, three, four, and five, was used in ancient Egypt to build a right angle.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 27-28-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З91',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Pifagor teoremasi",
    'Теорема Пифагора',
    'The Pythagorean theorem',
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
      { id: 'f1', label: L("to'g'ri burchakka qarama-qarshi tomon gipotenuza, u eng katta tomon", 'сторона против прямого угла, гипотенуза, она наибольшая', 'the side opposite the right angle is the hypotenuse, it is the longest') },
      { id: 'f2', label: L("gipotenuzaning kvadrati katetlar kvadratlari yig'indisiga teng, c² = a² + b²", 'квадрат гипотенузы равен сумме квадратов катетов, c² = a² + b²', 'the square of the hypotenuse equals the sum of the squares of the legs, c² = a² + b²') },
      { id: 'f3', label: L("ikkita bir xil (a+b) tomonli kvadratda ochiq qismlar teng, shu bilan isbotlanadi", 'в двух одинаковых квадратах со стороной (a+b) открытые части равны, этим доказывается', 'in two identical squares with side (a+b), the uncovered parts are equal, this proves it') },
      { id: 'w1', label: L("gipotenuza katetlar yig'indisiga teng, c = a + b", 'гипотенуза равна сумме катетов, c = a + b', 'the hypotenuse equals the sum of the legs, c = a + b') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Gipotenuza katetlar YIG'INDISI emas, KVADRATLARI yig'indisining ILDIZI.",
      'Так не складывается. Гипотенуза не СУММА катетов, а КОРЕНЬ из суммы их КВАДРАТОВ.',
      'That does not fit. The hypotenuse is not the SUM of the legs, but the ROOT of the sum of their SQUARES.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 3-§, 27-28-mavzu asosida (93-97-bet)",
        'Правило на основе геометрии, § 3, темы 27-28 учебника (стр. 93-97)',
        'The rule is based on geometry, section 3, topics 27-28 of the textbook (pages 93-97)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Uchinchi tomonni topish uchun ikkitasini shunchaki qo'shardik",
        'Чтобы найти третью сторону, мы просто складывали две другие',
        'To find the third side, we simply added the other two',
      ),
      right: L(
        "endi kvadratlar qo'shilib, keyin ildiz olinishini bilamiz",
        'теперь знаем, что складываются квадраты, а потом извлекается корень',
        'now we know the squares are added, then the root is taken',
      ),
      winner: 'right',
      note: L(
        "Kvadratlar qo'shiladi, tomonlarning o'zi emas",
        'Складываются квадраты, а не сами стороны',
        'The squares are added, not the sides themselves',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): gipotenuzani ikki katetdan hisoblash.
// ============================================================
const ASK_HYP = L("Gipotenuza qancha?", 'Чему равна гипотенуза?', 'What is the hypotenuse?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З91',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ikki katetdan gipotenuzani hisoblang",
    'Вычисли гипотенузу по двум катетам',
    'Compute the hypotenuse from the two legs',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida ikki katet berilgan.",
      'Пять заданий. В каждом даны два катета.',
      'Five tasks. In each, two legs are given.'),
    A('why',
      "Kvadratlar qo'shiladi, keyin ildiz olinadi.",
      'Складываются квадраты, потом извлекается корень.',
      'The squares are added, then the root is taken.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar kvadratlar qo'shilib, ildiz olingan.",
      'Все пять разобраны. Каждый раз складывались квадраты, извлекался корень.',
      'All five are done. Each time the squares were added, the root was taken.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 6,  b = 8'}</Row>,
        ok: L("Ha. O'ltmish to'rt qo'shilgan o'ttiz olti, yuz, ildizi o'n.", 'Да. Шестьдесят четыре плюс тридцать шесть, сто, корень десять.', 'Yes. Sixty-four plus thirty-six is a hundred, the root is ten.'),
        question: ASK_HYP,
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '14', hint: L("Bu yig'indi, kvadratlar ishlatilmadi.", 'Это сумма, квадраты не использованы.', 'That is the sum, squares were not used.') },
        ],
        solution: ['6² + 8²', '100', '10'],
      },
      {
        expr: <Row size="big" align="center">{'a = 5,  b = 12'}</Row>,
        ok: L("Ha. Yigirma besh qo'shilgan yuz qirq to'rt, yuz oltmish to'qqiz, ildizi o'n uch.", 'Да. Двадцать пять плюс сто сорок четыре, сто шестьдесят девять, корень тринадцать.', 'Yes. Twenty-five plus a hundred forty-four is a hundred sixty-nine, the root is thirteen.'),
        question: ASK_HYP,
        items: [
          { id: 'a', right: true, label: '13' },
          { id: 'b', label: '17', hint: L("Bu yig'indi, kvadratlar ishlatilmadi.", 'Это сумма, квадраты не использованы.', 'That is the sum, squares were not used.') },
        ],
        solution: ['5² + 12²', '169', '13'],
      },
      {
        expr: <Row size="big" align="center">{'a = 8,  b = 15'}</Row>,
        ok: L("Ha. Oltmish to'rt qo'shilgan ikki yuz yigirma besh, ikki yuz sakson to'qqiz, ildizi o'n yetti.", 'Да. Шестьдесят четыре плюс двести двадцать пять, двести восемьдесят девять, корень семнадцать.', 'Yes. Sixty-four plus two hundred twenty-five is two hundred eighty-nine, the root is seventeen.'),
        question: ASK_HYP,
        items: [
          { id: 'a', right: true, label: '17' },
          { id: 'b', label: '23', hint: L("Bu yig'indi, kvadratlar ishlatilmadi.", 'Это сумма, квадраты не использованы.', 'That is the sum, squares were not used.') },
        ],
        solution: ['8² + 15²', '289', '17'],
      },
      {
        expr: <Row size="big" align="center">{'a = 9,  b = 12'}</Row>,
        ok: L("Ha. Sakson bir qo'shilgan yuz qirq to'rt, ikki yuz yigirma besh, ildizi o'n besh.", 'Да. Восемьдесят один плюс сто сорок четыре, двести двадцать пять, корень пятнадцать.', 'Yes. Eighty-one plus a hundred forty-four is two hundred twenty-five, the root is fifteen.'),
        question: ASK_HYP,
        items: [
          { id: 'a', right: true, label: '15' },
          { id: 'b', label: '21', hint: L("Bu yig'indi, kvadratlar ishlatilmadi.", 'Это сумма, квадраты не использованы.', 'That is the sum, squares were not used.') },
        ],
        solution: ['9² + 12²', '225', '15'],
      },
      {
        expr: <Row size="big" align="center">{'a = 7,  b = 24'}</Row>,
        ok: L("Ha. Qirq to'qqiz qo'shilgan besh yuz yetmish olti, olti yuz yigirma besh, ildizi yigirma besh.", 'Да. Сорок девять плюс пятьсот семьдесят шесть, шестьсот двадцать пять, корень двадцать пять.', 'Yes. Forty-nine plus five hundred seventy-six is six hundred twenty-five, the root is twenty-five.'),
        question: ASK_HYP,
        items: [
          { id: 'a', right: true, label: '25' },
          { id: 'b', label: '31', hint: L("Bu yig'indi, kvadratlar ishlatilmadi.", 'Это сумма, квадраты не использованы.', 'That is the sum, squares were not used.') },
        ],
        solution: ['7² + 24²', '625', '25'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): gipotenuza va bir katetdan ikkinchi
// katetni topish.
// ============================================================
const ASK_LEG = L("Ikkinchi katet qancha?", 'Чему равен второй катет?', 'What is the second leg?')

const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З92',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Gipotenuza va bir katetdan ikkinchisini toping",
    'Найди второй катет по гипотенузе и одному катету',
    'Find the second leg from the hypotenuse and one leg',
  ),
  audio: [
    A('mount',
      "Gipotenuza va bitta katet berilgan. Ikkinchi katet izlanadi.",
      'Даны гипотенуза и один катет. Ищется второй катет.',
      'The hypotenuse and one leg are given. The second leg is sought.'),
    A('why',
      "Kvadratlar ayirilib, keyin ildiz olinadi, sonlarning o'zi ayirilmaydi.",
      'Вычитаются квадраты, потом извлекается корень, сами числа не вычитаются.',
      'The squares are subtracted, then the root is taken, the numbers themselves are not subtracted.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar kvadratlar ayirilib, ildiz olingan.",
      'Все три разобраны. Каждый раз вычитались квадраты, извлекался корень.',
      'All three are done. Each time the squares were subtracted, the root was taken.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'c = 13,  a = 5'}</Row>,
        ok: L("Ha. Yuz oltmish to'qqizdan yigirma beshni ayirsak, yuz qirq to'rt, ildizi o'n ikki.", 'Да. Из ста шестидесяти девяти вычесть двадцать пять, сто сорок четыре, корень двенадцать.', 'Yes. A hundred sixty-nine minus twenty-five is a hundred forty-four, the root is twelve.'),
        question: ASK_LEG,
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '8', hint: L("Bu o'n uchdan beshni chiziqli ayirish, kvadratlar ishlatilmadi.", 'Это линейное вычитание пяти из тринадцати, квадраты не использованы.', 'That is a linear subtraction of five from thirteen, squares were not used.') },
        ],
        solution: ['13² − 5²', '144', '12'],
      },
      {
        expr: <Row size="big" align="center">{'c = 17,  a = 8'}</Row>,
        ok: L("Ha. Ikki yuz sakson to'qqizdan oltmish to'rtni ayirsak, ikki yuz yigirma besh, ildizi o'n besh.", 'Да. Из двести восьмидесяти девяти вычесть шестьдесят четыре, двести двадцать пять, корень пятнадцать.', 'Yes. Two hundred eighty-nine minus sixty-four is two hundred twenty-five, the root is fifteen.'),
        question: ASK_LEG,
        items: [
          { id: 'a', right: true, label: '15' },
          { id: 'b', label: '9', hint: L("Bu o'n yettidan sakkizni chiziqli ayirish, kvadratlar ishlatilmadi.", 'Это линейное вычитание восьми из семнадцати, квадраты не использованы.', 'That is a linear subtraction of eight from seventeen, squares were not used.') },
        ],
        solution: ['17² − 8²', '225', '15'],
      },
      {
        expr: <Row size="big" align="center">{'c = 25,  a = 7'}</Row>,
        ok: L("Ha. Olti yuz yigirma beshdan qirq to'qqizni ayirsak, besh yuz yetmish olti, ildizi yigirma to'rt.", 'Да. Из шестисот двадцати пяти вычесть сорок девять, пятьсот семьдесят шесть, корень двадцать четыре.', 'Yes. Six hundred twenty-five minus forty-nine is five hundred seventy-six, the root is twenty-four.'),
        question: ASK_LEG,
        items: [
          { id: 'a', right: true, label: '24' },
          { id: 'b', label: '18', hint: L("Bu yigirma beshdan yettini chiziqli ayirish, kvadratlar ishlatilmadi.", 'Это линейное вычитание семи из двадцати пяти, квадраты не использованы.', 'That is a linear subtraction of seven from twenty-five, squares were not used.') },
        ],
        solution: ['25² − 7²', '576', '24'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (`drill`, приборсиз): uchlikni son bilan tekshirish
// (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Uchlikni son bilan tekshiring",
    'Проверь тройку вычислением',
    'Check the triple by computation',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida uchlik teoremaga mos kelishini tekshiring.",
      'Три задания. В каждом проверь, подходит ли тройка теореме.',
      'Three tasks. In each, check whether the triple fits the theorem.'),
    A('why',
      "Kichik ikkitasining kvadratlarini qo'shib, kattasining kvadrati bilan solishtiring.",
      'Сложи квадраты двух меньших чисел и сравни с квадратом большего.',
      'Add the squares of the two smaller numbers and compare with the square of the larger one.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash mosligini tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло соответствие.',
      'All three are done. Each time the computation checked the match.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3, 4, 5'}</Row>,
        ok: L("Ha. Uch va to'rtning kvadratlari yig'indisi yigirma besh, beshning kvadrati ham yigirma besh.", 'Да. Сумма квадратов трёх и четырёх двадцать пять, квадрат пяти тоже двадцать пять.', 'Yes. The sum of the squares of three and four is twenty-five, the square of five is also twenty-five.'),
        question: L("Bu uchlik teoremaga mos keladimi?", 'Подходит ли эта тройка теореме?', 'Does this triple fit the theorem?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, uch va to'rtning kvadratlari yig'indisi beshning kvadratiga teng chiqadi.", 'Посчитай, сумма квадратов трёх и четырёх равна квадрату пяти.', 'Compute it, the sum of the squares of three and four equals the square of five.') },
        ],
        solution: ['3² + 4²', '25', '5²', '25'],
      },
      {
        expr: <Row size="big" align="center">{'6, 8, 11'}</Row>,
        ok: L("Yo'q. Olti va sakkizning kvadratlari yig'indisi yuz, o'n birning kvadrati esa yuz yigirma bir.", 'Нет. Сумма квадратов шести и восьми сто, а квадрат одиннадцати сто двадцать один.', 'No. The sum of the squares of six and eight is a hundred, the square of eleven is a hundred twenty-one.'),
        question: L("Bu uchlik teoremaga mos keladimi?", 'Подходит ли эта тройка теореме?', 'Does this triple fit the theorem?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, yuz va yuz yigirma bir teng emas.", 'Посчитай снова, сто и сто двадцать один не равны.', 'Compute it again, a hundred and a hundred twenty-one are not equal.') },
        ],
        solution: ['6² + 8²', '100', '11²', '121'],
      },
      {
        expr: <Row size="big" align="center">{'9, 12, 15'}</Row>,
        ok: L("Ha. To'qqiz va o'n ikkining kvadratlari yig'indisi ikki yuz yigirma besh, o'n beshning kvadrati ham shu.", 'Да. Сумма квадратов девяти и двенадцати двести двадцать пять, квадрат пятнадцати тоже.', 'Yes. The sum of the squares of nine and twelve is two hundred twenty-five, the square of fifteen is the same.'),
        question: L("Bu uchlik teoremaga mos keladimi?", 'Подходит ли эта тройка теореме?', 'Does this triple fit the theorem?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, ikkalasi ham ikki yuz yigirma besh chiqadi.", 'Посчитай, оба выходят двести двадцать пять.', 'Compute it, both come to two hundred twenty-five.') },
        ],
        solution: ['9² + 12²', '225', '15²', '225'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): chiziqli qo'shish (З91) va
// chiziqli ayirish (З92).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З91',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato javobda nima noto'g'ri",
    'Что неверно в двух ошибочных ответах',
    'What is wrong in two mistaken answers',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham tomon kvadratsiz, chiziqli hisoblangan.",
      'Два задания. В обоих сторона посчитана без квадрата, линейно.',
      'Two tasks. In both, a side was computed without a square, linearly.'),
    A('why',
      "Pifagor teoremasida sonlarning o'zi qo'shilmaydi va ayirilmaydi, kvadratlari ishlatiladi.",
      'В теореме Пифагора сами числа не складываются и не вычитаются, используются их квадраты.',
      'In the Pythagorean theorem the numbers themselves are not added or subtracted, their squares are used.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham kvadratlarni chetlab o'tishdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за того, что квадраты были обойдены.',
      'Both are done. Both mistakes came from bypassing the squares.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 6, b = 8   →   c = 6 + 8 = 14'}</Row>,
        ok: L("Ha. Olti va sakkizning kvadratlari qo'shilib, o'n chiqishi kerak, o'n to'rt emas.", 'Да. Должны складываться квадраты шести и восьми, выходит десять, а не четырнадцать.', 'Yes. The squares of six and eight should be added, giving ten, not fourteen.'),
        question: L("Katetlar olti va sakkiz bo'lsa, va gipotenuza yuqoridagicha hisoblangan bo'lsa, bu yerda xato qayerda?", 'Если катеты шесть и восемь, а гипотенуза посчитана как выше, в чём здесь ошибка?', 'If the legs are six and eight, and the hypotenuse was computed as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Katetlar kvadratlanmasdan to'g'ridan-to'g'ri qo'shilgan", 'Катеты сложены напрямую, без возведения в квадрат', 'The legs were added directly, without squaring') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, kvadratlar qo'shilib, o'n chiqishi kerak.", 'Это и есть показанная ошибка, должны складываться квадраты, выходит десять.', 'This is the very mistake shown; the squares should be added, giving ten.') },
        ],
        solution: ['6² + 8²', '100', '10'],
      },
      {
        expr: <Row size="big" align="center">{'c = 13, a = 5   →   b = 13 − 5 = 8'}</Row>,
        ok: L("Ha. O'n uch va beshning kvadratlari ayirilib, o'n ikki chiqishi kerak, sakkiz emas.", 'Да. Должны вычитаться квадраты тринадцати и пяти, выходит двенадцать, а не восемь.', 'Yes. The squares of thirteen and five should be subtracted, giving twelve, not eight.'),
        question: L("Gipotenuza o'n uch, bir katet besh bo'lsa, va ikkinchi katet yuqoridagicha hisoblangan bo'lsa, bu yerda xato qayerda?", 'Если гипотенуза тринадцать, один катет пять, а второй катет посчитан как выше, в чём здесь ошибка?', 'If the hypotenuse is thirteen, one leg is five, and the second leg was computed as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Gipotenuzadan katet kvadratlanmasdan to'g'ridan-to'g'ri ayirilgan", 'Катет вычтен из гипотенузы напрямую, без возведения в квадрат', 'The leg was subtracted from the hypotenuse directly, without squaring') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, kvadratlar ayirilib, o'n ikki chiqishi kerak.", 'Это и есть показанная ошибка, должны вычитаться квадраты, выходит двенадцать.', 'This is the very mistake shown; the squares should be subtracted, giving twelve.') },
        ],
        solution: ['13² − 5²', '144', '12'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): c = √(a² + b²) ni qadamlab hisoblash.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З92',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Ikki katetdan gipotenuzani qadamlab hisoblang",
    'Вычисли гипотенузу по двум катетам, по шагам',
    'Compute the hypotenuse from the two legs, step by step',
  ),
  audio: [
    A('mount',
      "Ikki katet berilgan. Kvadratlarini qo'shib, ildiz olamiz.",
      'Даны два катета. Складываем их квадраты, извлекаем корень.',
      'Two legs are given. We add their squares, take the root.'),
    A('why',
      "Bu qadam har doim bir xil, faqat sonlar o'zgaradi.",
      'Этот шаг всегда одинаков, меняются только числа.',
      'This step is always the same, only the numbers change.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar kvadratlar qo'shilib, ildiz olingan.",
      'Все три заполнены. Каждый раз складывались квадраты, извлекался корень.',
      'All three are filled. Each time the squares were added, the root was taken.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['100', '10'],
      lines: [
        [{ t: 'a = 6, b = 8   →   a² + b² = ' }, { slot: '100' }, { t: '   →   c = ' }, { slot: '10' }],
      ],
    },
    tasks: [
      {
        chips: ['225', '15'],
        lines: [
          [{ t: 'a = 9, b = 12   →   a² + b² = ' }, { slot: '225' }, { t: '   →   c = ' }, { slot: '15' }],
        ],
      },
      {
        chips: ['289', '17'],
        lines: [
          [{ t: 'a = 8, b = 15   →   a² + b² = ' }, { slot: '289' }, { t: '   →   c = ' }, { slot: '17' }],
        ],
      },
      {
        chips: ['841', '29'],
        lines: [
          [{ t: 'a = 20, b = 21   →   a² + b² = ' }, { slot: '841' }, { t: '   →   c = ' }, { slot: '29' }],
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
    "Pifagor teoremasi bo'yicha to'rt savol",
    'Четыре вопроса о теореме Пифагора',
    'Four questions about the Pythagorean theorem',
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
        id: 'q1', tag: 'З91',
        ask: L('Katetlari to\'qqiz va o\'n ikki bo\'lsa, gipotenuza qancha?', 'Если катеты девять и двенадцать, чему равна гипотенуза?', 'If the legs are nine and twelve, what is the hypotenuse?'),
        options: [
          { id: 'ok', right: true, label: '15' },
          { id: 'no', label: '21' },
        ],
        hint: L("Yigirma bir bu yig'indi. Kvadratlarni qo'shib, ildiz oling.", 'Двадцать один это сумма. Сложи квадраты и извлеки корень.', 'Twenty-one is the sum. Add the squares and take the root.'),
        ok: L("To'g'ri, sakson bir qo'shilgan yuz qirq to'rt, ikki yuz yigirma besh, ildizi o'n besh.", 'Верно, восемьдесят один плюс сто сорок четыре, двести двадцать пять, корень пятнадцать.', 'Correct, eighty-one plus a hundred forty-four is two hundred twenty-five, the root is fifteen.'),
      },
      {
        id: 'q2', tag: 'З92',
        ask: L('Gipotenuza o\'n yetti, bir kateti sakkiz bo\'lsa, ikkinchi katet qancha?', 'Если гипотенуза семнадцать, один катет восемь, чему равен второй катет?', 'If the hypotenuse is seventeen, one leg is eight, what is the second leg?'),
        options: [
          { id: 'ok', right: true, label: '15' },
          { id: 'no', label: '9' },
        ],
        hint: L("To'qqiz bu chiziqli ayirish. Kvadratlarni ayirib, ildiz oling.", 'Девять это линейное вычитание. Вычти квадраты и извлеки корень.', 'Nine is a linear subtraction. Subtract the squares and take the root.'),
        ok: L("To'g'ri, ikki yuz sakson to'qqizdan oltmish to'rtni ayirsak, ikki yuz yigirma besh, ildizi o'n besh.", 'Верно, из двухсот восьмидесяти девяти вычесть шестьдесят четыре, двести двадцать пять, корень пятнадцать.', 'Correct, two hundred eighty-nine minus sixty-four is two hundred twenty-five, the root is fifteen.'),
      },
      {
        id: 'q3', tag: 'З93',
        ask: L('To\'g\'ri burchakli uchburchakda katetlar to\'qqiz va o\'n ikki, gipotenuza o\'n besh. Qaysi tomon gipotenuza?', 'В прямоугольном треугольнике катеты девять и двенадцать, гипотенуза пятнадцать. Какая сторона гипотенуза?', 'In a right triangle the legs are nine and twelve, the hypotenuse is fifteen. Which side is the hypotenuse?'),
        options: [
          { id: 'ok', right: true, label: '15' },
          { id: 'no', label: '12' },
        ],
        hint: L("Gipotenuza to'g'ri burchakka qarama-qarshi turgan, eng katta tomon.", 'Гипотенуза, сторона, лежащая против прямого угла, самая большая.', 'The hypotenuse is the side opposite the right angle, the longest one.'),
        ok: L("To'g'ri, o'n besh eng katta tomon, u to'g'ri burchakka qarama-qarshi turadi.", 'Верно, пятнадцать самая большая сторона, она лежит против прямого угла.', 'Correct, fifteen is the longest side, it lies opposite the right angle.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('6² + 8², 10² ga tengmi?', 'Верно ли, что 6² + 8², равно 10²?', 'Is it true that 6² + 8² equals 10²?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, ikkalasi ham yuzga teng chiqadi.", 'Посчитай, оба выходят равными ста.', 'Compute it, both come out equal to a hundred.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З91',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Katetlari o'n va yigirma to'rt bo'lgan uchburchakning gipotenuzasini yig'ing.",
            'Собери гипотенузу треугольника с катетами десять и двадцать четыре.',
            'Assemble the hypotenuse of a triangle with legs ten and twenty-four.',
          ),
          lines: [
            [{ t: '10² + 24² = ' }, { slot: '676' }, { t: '   →   c = ' }, { slot: '26' }],
          ],
          tiles: [
            { id: 't1', v: '676', x: 12, y: 12 },
            { id: 't2', v: '26', x: 60, y: 14 },
            { id: 't3', v: '34', x: 30, y: 50 },
            { id: 't4', v: '700', x: 78, y: 48 },
          ],
          hint: L(
            "O'nning kvadrati yuz, yigirma to'rtning kvadrati bilan qo'shing.",
            'Квадрат десяти сто, сложи с квадратом двадцати четырёх.',
            'The square of ten is a hundred, add it to the square of twenty-four.',
          ),
          doneNote: L(
            "Yig'ildi. Kvadratlar qo'shilib, ildiz olingan, o'ttiz to'rt emas.",
            'Собрано. Квадраты сложены, извлечён корень, а не тридцать четыре.',
            'Assembled. The squares were added, the root taken, not thirty-four.',
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
    "Kvadratlar qo'shiladi, tomonlarning o'zi emas",
    'Складываются квадраты, а не сами стороны',
    'The squares are added, not the sides themselves',
  ),
  audio: [
    A('s0',
      "Darsdan bitta chertyozh qoladi. Ikki bir xil kvadrat, ikki xil ochiq qism, ular teng.",
      'С урока остаётся один чертёж. Два одинаковых квадрата, две разные открытые части, они равны.',
      'One drawing stays with you. Two identical squares, two different uncovered parts, they are equal.'),
    A('s1',
      "Bugun uch narsa qilindi. Teoremani isbotladingiz, to'rt uchburchakni qayta joylashtirib chertyozhda ko'rdingiz va turli uchliklarda bir xil usulni qo'lladingiz.",
      'Сегодня сделано три вещи. Ты доказал теорему, увидел это на чертеже, переставив четыре треугольника, и применил один и тот же способ к разным тройкам.',
      'Three things are done today. You proved the theorem, saw it on the drawing by rearranging four triangles, and applied the same method to different triples.'),
    A('s2',
      "Keyingi darsda Pifagor teoremasiga teskari teorema. Uchburchak to'g'ri burchakli ekanini xuddi shu tekshiruv orqali bilib olamiz.",
      'В следующем уроке теорема, обратная теореме Пифагора. Узнаём, прямоугольный ли треугольник, той же проверкой.',
      'The next lesson covers the converse of the Pythagorean theorem. We find out if a triangle is right-angled with the same check.',
    ),
  ],
  props: {
    mark: 'c² = a² + b²',
    markNote: L(
      "katetlar uch va to'rt, gipotenuza besh",
      'катеты три и четыре, гипотенуза пять',
      'legs three and four, hypotenuse five',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: Pifagor teoremasiga teskari teorema",
      'Следующий урок: теорема, обратная теореме Пифагора',
      'Next lesson: the converse of the Pythagorean theorem',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
