// ============================================================================
// 8-sinf, Dars 42. TRAPETSIYANING YUZI.
//
// BLOK Б6. Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`, `prooflines.jsx`,
// `areacut.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da. Yangi pribor
// YO'Q — `AreaCut` (Dars 40-41) shu darsda YANA bir usulda ishlatiladi:
// trapetsiya ikkilanib, asosi (a+b), balandligi h bo'lgan parallelogrammga
// aylanadi (dars 41 dagi uchburchak ikkilash naqshi bilan bir xil), keyin
// kesib ko'chirilib to'g'ri to'rtburchakka aylanadi.
//
// KARKAS: Dars 37-41 dagidek, SCREENS to'g'ridan-to'g'ri qurilgan.
//
// MANBA: 8-sinf geometriya darsligi, 2-§ (YUZLAR), 24-mavzu (84-bet).
// Barcha teorema, natija va misollar darslikdan:
//   - teorema: S = (a+b)/2 · h, isbot diagonal AC orqali ABC va ACD
//     uchburchaklarga bo'lib (dars 41 ning formulasi bilan) va ularning
//     yuzlarini qo'shib (18-mavzuning yig'indi aksiomasi bilan);
//   - natija: trapetsiyaning yuzi o'rta chizig'i bilan balandligining
//     ko'paytmasiga teng (o'rta chiziq asoslar yig'indisining yarmiga
//     teng bo'lgani uchun).
//
// ADASHISHLAR, ikkitasi yangi:
//   З87, asoslar yig'indisi o'rniga ular ko'paytirilgan (S = a·b·h yoki
//   shunga o'xshash noto'g'ri tuzilma);
//   З88, balandlik yon tomon bilan chalkashtirilgan;
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
  id: 'geo-8-42',
  n: 42,
  row: 47,
  block: 'Б6',
  topic: L("Trapetsiyaning yuzi", 'Площадь трапеции', 'The area of the trapezoid'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Trapetsiyaning yuzi asoslari yig'indisining yarmi bilan balandligi ko'paytmasiga teng, S = (a+b)/2 · h",
    'Площадь трапеции равна половине суммы оснований, умноженной на высоту, S = (a+b)/2 · h',
    'The area of a trapezoid equals half the sum of the bases times the height, S = (a+b)/2 · h',
  ),
  L(
    "Trapetsiyaning yuzi o'rta chizig'i bilan balandligining ko'paytmasiga teng",
    'Площадь трапеции равна произведению её средней линии на высоту',
    "A trapezoid's area equals its midline times the height",
  ),
  L(
    "Balandlik yon tomonning o'zi emas, ikki asos orasidagi perpendikulyar masofa",
    'Высота, не сама боковая сторона, а перпендикулярное расстояние между основаниями',
    'The height is not the leg itself, but the perpendicular distance between the bases',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З87': {
    what: L(
      "asoslar yig'indisi o'rniga ular ko'paytirilgan",
      'вместо суммы оснований они перемножены',
      'the bases were multiplied instead of added',
    ),
    wrong: null,
    at: 12,
  },
  'З88': {
    what: L(
      "balandlik yon tomon bilan chalkashtirilgan",
      'высота спутана с боковой стороной',
      'the height was confused with the leg',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (3-ekran, ProofLines). ABCD trapetsiya, AD=a,
// BC=b asoslar, CE=h balandlik, AC diagonal.
// ============================================================
const TRAP = { A: [15, 90], B: [45, 30], C: [90, 30], D: [110, 90], E: [90, 90] }
const TRAP_ORDER = ['A', 'B', 'C', 'D']

// ============================================================
// SAHNALAR (§6). Xuk: asoslar va balandlikdan yuza qanday topiladi.
// Yakun: trapetsiya ikkilansa, parallelogramm chiqadi.
// ============================================================
const SC_ASK = L('YUZASI QANDAY TOPILADI', 'КАК НАЙТИ ПЛОЩАДЬ', 'HOW IS THE AREA FOUND')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <polygon points="140,90 165,35 225,35 250,90" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
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
      "Trapetsiya ikkilansa, parallelogramm chiqadi",
      'Трапеция, удвоенная, даёт параллелограмм',
      'The trapezoid, doubled, gives a parallelogram',
    )}>
      <polygon points="130,85 150,35 220,35 260,85" fill="none" stroke={T.ink2} strokeWidth="1.2"/>
      <g className="g8-seat" style={{ '--d': '1300ms' }}>
        <text x="195" y="105" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.ok}>{'S = (a+b)/2 · h'}</text>
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
  eyebrow: L('QANDAY HISOBLANADI', 'КАК ВЫЧИСЛЯЕТСЯ', 'HOW IS IT COMPUTED'),
  title: L(
    "Asoslari o'n va olti, balandligi besh bo'lgan trapetsiyaning yuzi qanday topiladi",
    'Как найти площадь трапеции с основаниями десять и шесть, высотой пять',
    'How is the area found for a trapezoid with bases ten and six, height five',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Trapetsiyaning ikki asosi va balandligi bor.",
      'У трапеции два основания и высота.',
      'The trapezoid has two bases and a height.'),
    A('why',
      "Taxmin qiling, bu uch sondan yuza qanday topiladi.",
      'Предположи, как из этих трёх чисел находится площадь.',
      'Predict how the area is found from these three numbers.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, yuzi qanday son bo'ladi?",
      'Как думаешь, какой будет площадь?',
      'What do you think the area will be?',
    ),
    items: [
      { id: 'a', show: '80' },
      { id: 'b', show: '40' },
      { id: 'c', show: '30' },
      { id: 'd', show: '21' },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Uchburchakning yuzi (dars 41 dan).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Uchburchakning yuzini eslash",
    'Вспоминаем площадь треугольника',
    'Recalling the area of the triangle',
  ),
  audio: [
    A('mount',
      "O'tgan darsda uchburchakning yuzi formulasi chiqarilgan edi.",
      'На прошлом уроке была выведена формула площади треугольника.',
      'Last lesson, the formula for the area of the triangle was derived.'),
    A('why',
      "Trapetsiya diagonal bilan ikkita uchburchakka bo'linadi, shu formula ikki marta ishlatiladi.",
      'Диагональ делит трапецию на два треугольника, эта формула используется два раза.',
      'A diagonal splits a trapezoid into two triangles, this formula is used twice.'),
  ],
  props: {
    ask: L(
      "Uchburchakning asosi a, balandligi h bo'lsa, yuzi qanday topiladi?",
      'Если основание треугольника a, высота h, как найти площадь?',
      'If the base of a triangle is a, the height h, how is the area found?',
    ),
    items: [
      { id: 'right', show: 'S = ½ a · h', right: true, name: L('ko\'paytma ikkiga bo\'linadi', 'произведение делится на два', 'the product is divided by two') },
      {
        id: 'wrong1', show: 'S = a · h',
        hint: L("Bu parallelogramm uchun, uchburchakda ikkiga bo'linadi.", 'Это для параллелограмма, у треугольника делится на два.', 'That is for a parallelogram; for a triangle it is divided by two.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun ikki marta shu formuladan foydalanamiz.",
      'Верно. Сегодня используем эту формулу два раза.',
      'Correct. Today we will use this formula twice.',
    ),
  },
}

// ============================================================
// EKRAN 3. ISBOT (`prooflines`). Teorema: S = (a+b)/2 · h.
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З87',
  eyebrow: L('FORMULANI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ФОРМУЛУ', 'PROVING THE FORMULA'),
  title: L(
    "Trapetsiyaning yuzi asoslar yig'indisining yarmi bilan balandlikning ko'paytmasi",
    'Площадь трапеции, половина суммы оснований на высоту',
    'The area of a trapezoid, half the sum of the bases times the height',
  ),
  audio: [
    A('mount',
      "ABCD trapetsiya, AD va BC asoslar, CE balandlik. Diagonal AC o'tkaziladi.",
      'ABCD, трапеция, AD и BC основания, CE высота. Проводится диагональ AC.',
      'ABCD is a trapezoid, AD and BC the bases, CE the height. Diagonal AC is drawn.'),
    A('why',
      "Diagonal trapetsiyani ikkita uchburchakka bo'ladi, ularning yuzlari qo'shiladi.",
      'Диагональ делит трапецию на два треугольника, их площади складываются.',
      'The diagonal splits the trapezoid into two triangles, their areas are added.'),
  ],
  props: {
    points: TRAP,
    order: TRAP_ORDER,
    marks: [['A', 'C'], ['C', 'E']],
    given: [
      L("ABCD, trapetsiya, AD=a, BC=b, asoslar", 'ABCD, трапеция, AD=a, BC=b, основания', 'ABCD, a trapezoid, AD=a, BC=b, the bases'),
      L("CE, balandlik, CE=h", 'CE, высота, CE=h', 'CE, the height, CE=h'),
    ],
    goal: L("S(ABCD) = (a+b)/2 · h", 'S(ABCD) = (a+b)/2 · h', 'S(ABCD) = (a+b)/2 · h'),
    lines: [
      {
        text: L("AC diagonali ABCD ni ABC va ACD uchburchaklarga bo'ladi", 'диагональ AC делит ABCD на треугольники ABC и ACD', 'the diagonal AC splits ABCD into triangles ABC and ACD'),
        options: [
          { id: 'ok', right: true, label: L("Har qanday ko'pburchak diagonallar orqali uchburchaklarga bo'linadi", 'Любой многоугольник делится диагоналями на треугольники', 'Any polygon is split into triangles by diagonals') },
          { id: 'no', label: L("Chunki ABCD ning to'rt tomoni bor", 'Потому что у ABCD четыре стороны', 'Because ABCD has four sides'), hint: L("Tomonlar sonining o'zi bo'linishni bermaydi, diagonal chizilishi kerak.", 'Само число сторон не даёт разбиения, нужно провести диагональ.', 'The number of sides alone does not give the split, a diagonal must be drawn.') },
        ],
      },
      {
        text: L("uchburchak ABC va ACD balandliklari ikkalasi ham h ga teng", 'высоты треугольников ABC и ACD оба равны h', 'the heights of triangles ABC and ACD are both equal to h'),
        options: [
          { id: 'ok', right: true, label: L("BC va AD parallel, ular orasidagi masofa hamma joyda bir xil", 'BC и AD параллельны, расстояние между ними везде одинаковое', 'BC and AD are parallel, the distance between them is the same everywhere') },
          { id: 'no', label: L("Chunki AC ikkalasiga ham umumiy tomon", 'Потому что AC общая сторона у обоих', 'Because AC is a common side of both'), hint: L("Umumiy tomon balandlikni bermaydi, parallel asoslar orasidagi masofadan foydalaning.", 'Общая сторона не даёт высоту, используй расстояние между параллельными основаниями.', 'A common side does not give the height, use the distance between the parallel bases.') },
        ],
      },
      {
        text: L("S(ABC) teng ikkidan bir b ko'paytirilgan h, S(ACD) teng ikkidan bir a ko'paytirilgan h", 'S(ABC) равна одной второй b на h, S(ACD) равна одной второй a на h', 'S(ABC) equals one half b times h, S(ACD) equals one half a times h'),
        options: [
          { id: 'ok', right: true, label: L("Uchburchakning yuzi formulasi (dars 41), BC va AD mos asoslar", 'Формула площади треугольника (урок 41), BC и AD соответствующие основания', "The triangle's area formula (lesson 41), BC and AD as the matching bases") },
          { id: 'no', label: L("Chunki ular trapetsiyaning qismlari", 'Потому что это части трапеции', 'Because they are parts of the trapezoid'), hint: L("Qismi bo'lishning o'zi yetarli emas, uchburchak formulasini qo'llang.", 'Того, что это часть, недостаточно, примени формулу треугольника.', 'Being a part alone is not enough, apply the triangle formula.') },
        ],
      },
      {
        text: L("shuning uchun S(ABCD) teng ikkidan bir a qo'shilgan b, ko'paytirilgan h", 'поэтому S(ABCD) равна одной второй от a плюс b, умноженной на h', 'therefore S(ABCD) equals one half of a plus b, times h'),
        options: [
          { id: 'ok', right: true, label: L("Ko'pburchakning yuzi uni tashkil qilgan uchburchaklar yuzlari yig'indisiga teng", 'Площадь многоугольника равна сумме площадей составляющих его треугольников', "A polygon's area equals the sum of the areas of the triangles that make it up") },
          { id: 'no', label: L("Chunki ikkalasining balandligi bir xil", 'Потому что у обоих одна высота', 'Because both have the same height'), hint: L("Balandlikning bir xilligi yetarli emas, ikki yuzani qo'shishdan foydalaning.", 'Одинаковой высоты недостаточно, используй сложение двух площадей.', 'The same height alone is not enough, use the addition of the two areas.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. Ikki uchburchakning yuzlari qo'shilib, aynan shu formula chiqadi.",
      'Доказано. Сложив площади двух треугольников, получается именно эта формула.',
      'Proven. Adding the areas of the two triangles gives exactly this formula.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI KESMA BALANDLIK (1-darsning `pick`). Ловушка, yon
// tomon balandlik bilan chalkashtirilgan (З88).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З88',
  eyebrow: L('QAYSI KESMA BALANDLIK', 'КАКОЙ ОТРЕЗОК ВЫСОТА', 'WHICH SEGMENT IS THE HEIGHT'),
  title: L(
    "Trapetsiyada qaysi kesma balandlik bo'ladi",
    'Какой отрезок в трапеции является высотой',
    'Which segment in the trapezoid is the height',
  ),
  audio: [
    A('mount',
      "Ikki asos orasida ikki kesma bor, yon tomon va perpendikulyar kesma.",
      'Между двумя основаниями есть два отрезка, боковая сторона и перпендикулярный отрезок.',
      'Between the two bases there are two segments, the leg and a perpendicular segment.'),
    A('why',
      "Balandlik faqat perpendikulyar kesma, yon tomon qiyshiq turadi.",
      'Высотой является только перпендикулярный отрезок, боковая сторона стоит наклонно.',
      'Only the perpendicular segment is the height, the leg stands slanted.'),
  ],
  props: {
    ask: L(
      "Ikki asos orasidagi balandlik qaysi kesma?",
      'Какой отрезок является высотой между основаниями?',
      'Which segment is the height between the bases?',
    ),
    items: [
      { id: 'right', show: L("Asoslarga perpendikulyar kesma", 'Отрезок, перпендикулярный основаниям', 'The segment perpendicular to the bases'), right: true, name: L("balandlik doim perpendikulyar", 'высота всегда перпендикулярна', 'the height is always perpendicular') },
      {
        id: 'wrong', show: L("Yon tomonning o'zi", 'Сама боковая сторона', 'The leg itself'),
        hint: L("Yon tomon asoslarga perpendikulyar emas, qiyshiq turadi, u balandlik emas.", 'Боковая сторона не перпендикулярна основаниям, стоит наклонно, это не высота.', 'The leg is not perpendicular to the bases, it stands slanted, it is not the height.'),
      },
    ],
    after: L(
      "To'g'ri. Balandlik faqat perpendikulyar kesma, yon tomon undan uzunroq bo'ladi.",
      'Верно. Высота, только перпендикулярный отрезок, боковая сторона длиннее её.',
      'Correct. The height is only the perpendicular segment, the leg is longer than it.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI (`areacut`, dars 40-41 dan qayta).
// Trapetsiya ikkilanib, asosi (a+b), balandligi h bo'lgan parallelogrammga
// aylanadi.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'areacut',
  tag: 'З87',
  eyebrow: L('IKKILANTIRING, KO\'CHIRING, BO\'LING', 'УДВОЙ, ПЕРЕДВИНЬ, РАЗДЕЛИ', 'DOUBLE, SLIDE, HALVE'),
  title: L(
    "Trapetsiyani ikkilab, to'g'ri to'rtburchakka aylantiring",
    'Удвой трапецию и получи прямоугольник',
    'Double the trapezoid and turn it into a rectangle',
  ),
  audio: [
    A('mount',
      "Trapetsiya ikkilanib, asosi o'n olti, balandligi besh bo'lgan parallelogramm hosil qilingan.",
      'Трапеция удвоена, получен параллелограмм с основанием шестнадцать и высотой пять.',
      'The trapezoid is doubled, giving a parallelogram with base sixteen and height five.'),
    A('why',
      "O'n olti, o'n asos qo'shilgan olti, ikkinchi asos, chunki ikkinchi nusxa teskari qo'yiladi.",
      'Шестнадцать, это десять плюс шесть, второе основание, ведь вторая копия ставится в обратную сторону.',
      'Sixteen is ten plus six, the second base, since the second copy is placed the other way round.'),
    W('cut',
      "To'g'ri to'rtburchak chiqdi. Uning yuzi parallelogrammning yuzi, trapetsiya esa aynan uning yarmi.",
      'Получился прямоугольник. Его площадь, это площадь параллелограмма, а трапеция, ровно её половина.',
      'A rectangle came out. Its area is the parallelogram\'s area, and the trapezoid is exactly half of it.'),
  ],
  props: {
    base: 16,
    height: 5,
    shiftStart: 6,
    shiftMax: 6,
    shiftStep: 3,
    ask: L("Tugmani ikki marta bosing", 'Нажми кнопку два раза', 'Press the button twice'),
    after: L(
      "Parallelogrammning yuzi sakson. Bu ikkilangan trapetsiya, shuning uchun trapetsiyaning yuzi ikkiga bo'linadi.",
      'Площадь параллелограмма восемьдесят. Это удвоенная трапеция, поэтому площадь трапеции делится на два.',
      'The area of the parallelogram is eighty. This is the doubled trapezoid, so the trapezoid\'s area is divided by two.',
    ),
    fields: [
      {
        ask: L("Trapetsiyaning o'zining yuzi nechchiga teng?", 'Чему равна площадь самой трапеции?', 'What is the area of the trapezoid itself?'),
        kind: 'number',
        answer: '40',
        accepts: ['40'],
        hints: {
          '80': L("Bu parallelogrammning yuzi, trapetsiya esa aynan uning yarmi, ikkiga bo'ling.", 'Это площадь параллелограмма, а трапеция, ровно её половина, раздели на два.', 'That is the parallelogram\'s area; the trapezoid is exactly half of it, divide by two.'),
        },
      },
    ],
    note: L(
      "Sakson ikkiga bo'linsa, qirq.",
      'Восемьдесят, делённое на два, сорок.',
      'Eighty divided by two is forty.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): trapetsiya yuzini ikki
// yo'l bilan topish.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З87',
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Trapetsiya yuzini ikki yo'l bilan topish",
    'Найти площадь трапеции двумя способами',
    'Finding the area of a trapezoid in two ways',
  ),
  audio: [
    A('mount',
      "Asoslari o'n va olti, balandligi besh. Ikki yo'l bir xil yuzani beradi.",
      'Основания десять и шесть, высота пять. Два пути дают одну площадь.',
      'The bases are ten and six, the height five. Two ways give the same area.'),
    W('w2',
      "Birinchi yo'lda formula to'g'ridan-to'g'ri qo'llaniladi.",
      'В первом пути формула применяется прямо.',
      'In the first way, the formula is applied directly.'),
    W('w4',
      "Ikkinchi yo'lda diagonal orqali ikkita uchburchakning yuzi topilib, qo'shiladi.",
      'Во втором пути через диагональ находятся площади двух треугольников и складываются.',
      'In the second way, the areas of two triangles are found through the diagonal and added.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL, FORMULA', 'СПОСОБ 1, ФОРМУЛА', 'METHOD 1, THE FORMULA'),
        lead: L(
          "Asoslar yig'indisining yarmini balandlikka ko'paytiramiz",
          'Умножаем половину суммы оснований на высоту',
          'We multiply half the sum of the bases by the height',
        ),
        rows: [
          { text: '(10+6) : 2 · 5' },
          { text: L("qirq chiqadi", 'выходит сорок', 'comes out to forty'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL, IKKI UCHBURCHAK', 'СПОСОБ 2, ДВА ТРЕУГОЛЬНИКА', 'METHOD 2, TWO TRIANGLES'),
        lead: L(
          "Diagonal orqali ikkita uchburchakning yuzini topib qo'shamiz",
          'Через диагональ находим площади двух треугольников и складываем',
          'Through the diagonal we find the areas of two triangles and add them',
        ),
        rows: [
          { text: '½ · 6 · 5 = 15,   ½ · 10 · 5 = 25' },
          { text: L("qo'shilsa, yana qirq chiqadi", 'сложенные, снова дают сорок', 'added, again give forty'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL YUZA BERDI', 'ОБА ДАЛИ ОДНУ ПЛОЩАДЬ', 'BOTH GAVE THE SAME AREA'),
        lead: L(
          "Formula tezroq, ikki uchburchak esa nega ishlashini ko'rsatadi",
          'Формула быстрее, а два треугольника показывают, почему это работает',
          'The formula is faster, the two triangles show why it works',
        ),
        rows: [{ text: '40', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): formulaning to'rt qismi.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З87',
  eyebrow: L('FORMULANING QISMLARI', 'ЧАСТИ ФОРМУЛЫ', 'THE PARTS OF THE FORMULA'),
  title: L(
    "Formulaning qismlari",
    'Части формулы',
    'The parts of the formula',
  ),
  audio: [
    A('mount',
      "Bir formula, bir necha qism. Birinchi qadam, asoslarni qo'shish.",
      'Одна формула, несколько частей. Первый шаг, сложение оснований.',
      'One formula, several parts. The first step, adding the bases.'),
    W('p2',
      "Asoslar qo'shiladi, ko'paytirilmaydi, bu eng ko'p unutiladigan joy.",
      'Основания складываются, а не перемножаются, это чаще всего забывают.',
      'The bases are added, not multiplied, this is what is forgotten most often.'),
    W('p4',
      "Yig'indi ikkiga bo'linadi, keyingina balandlikka ko'paytiriladi.",
      'Сумма делится на два, только потом умножается на высоту.',
      'The sum is divided by two, only then multiplied by the height.',
    ),
  ],
  props: {
    tokens: [
      { t: 'S  =  ', id: 'mid' },
      { t: '(a + b)', id: 'a' },
      { t: '  ÷ 2  ·  ', id: 'div' },
      { t: 'h', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qism, ikki asosning yig'indisi. Ko'paytma emas, aynan yig'indi.",
          'Первая часть, сумма двух оснований. Не произведение, а именно сумма.',
          'The first part, the sum of the two bases. Not a product, precisely a sum.',
        ),
      },
      {
        focus: 'div',
        text: L(
          "Ikkinchi qism, ikkiga bo'lish. Chunki bu, aslida, o'rta chiziqning uzunligi.",
          'Вторая часть, деление на два. Ведь это, по сути, длина средней линии.',
          'The second part, dividing by two. Because this is, in essence, the length of the midline.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qism, balandlik. Ikki asos orasidagi perpendikulyar masofa.",
          'Третья часть, высота. Перпендикулярное расстояние между основаниями.',
          'The third part, the height. The perpendicular distance between the bases.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Bu formulaning natijasi shundayki, trapetsiyaning yuzi uning o'rta chizig'i bilan balandligining ko'paytmasiga ham teng, chunki o'rta chiziq aynan asoslar yig'indisining yarmi.",
        'Из этой формулы следует, что площадь трапеции равна и произведению её средней линии на высоту, ведь средняя линия, ровно половина суммы оснований.',
        "This formula implies that a trapezoid's area also equals its midline times the height, since the midline is exactly half the sum of the bases.",
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Darslik 24-mavzu teoremasi
// va natijasi.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З87',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Trapetsiyaning yuzi",
    'Площадь трапеции',
    'The area of the trapezoid',
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
      { id: 'f1', label: L("trapetsiyaning yuzi asoslar yig'indisining yarmi bilan balandlikning ko'paytmasi, S = (a+b)/2 · h", 'площадь трапеции равна половине суммы оснований на высоту, S = (a+b)/2 · h', "a trapezoid's area equals half the sum of the bases times the height, S = (a+b)/2 · h") },
      { id: 'f2', label: L("bu yuza o'rta chiziq bilan balandlikning ko'paytmasiga ham teng", 'эта площадь равна и произведению средней линии на высоту', 'this area also equals the midline times the height') },
      { id: 'f3', label: L("balandlik yon tomonning o'zi emas, asoslarga perpendikulyar masofa", 'высота не сама боковая сторона, а перпендикулярное расстояние между основаниями', 'the height is not the leg itself, but the perpendicular distance to the bases') },
      { id: 'w1', label: L("trapetsiyaning yuzi asoslarning ko'paytmasiga teng", 'площадь трапеции равна произведению оснований', "a trapezoid's area equals the product of the bases") },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Asoslar ko'PAYTIRILMAYDI, ular QO'SHILADI, keyin yig'indi ikkiga bo'linadi.",
      'Так не складывается. Основания НЕ ПЕРЕМНОЖАЮТСЯ, они СКЛАДЫВАЮТСЯ, потом сумма делится на два.',
      'That does not fit. The bases are NOT MULTIPLIED, they are ADDED, then the sum is divided by two.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 2-§, 24-mavzu asosida (84-bet)",
        'Правило на основе геометрии, § 2, тема 24 учебника (стр. 84)',
        'The rule is based on geometry, section 2, topic 24 of the textbook (page 84)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Uch sondan trapetsiyaning yuzini qanday topishni bilmasdik",
        'Мы не знали, как из трёх чисел найти площадь трапеции',
        'We did not know how to find a trapezoid\'s area from three numbers',
      ),
      right: L(
        "endi asoslarni qo'shib, ikkiga bo'lib, balandlikka ko'paytirishni bilamiz",
        'теперь знаем, что нужно сложить основания, разделить на два и умножить на высоту',
        'now we know to add the bases, divide by two, and multiply by the height',
      ),
      winner: 'right',
      note: L(
        "Asoslar qo'shiladi, keyin ikkiga bo'linadi, keyin balandlikka ko'paytiriladi",
        'Основания складываются, потом делятся на два, потом умножаются на высоту',
        'The bases are added, then divided by two, then multiplied by the height',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): S = (a+b)/2 · h to'g'ridan-to'g'ri
// hisoblash.
// ============================================================
const ASK_AREA = L("Yuzi qancha?", 'Чему равна площадь?', 'What is the area?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З87',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Asoslar va balandlikdan trapetsiya yuzini hisoblang",
    'Вычисли площадь трапеции по основаниям и высоте',
    'Compute the area of the trapezoid from the bases and height',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida ikki asos va balandlik berilgan.",
      'Пять заданий. В каждом даны два основания и высота.',
      'Five tasks. In each, two bases and a height are given.'),
    A('why',
      "Avval asoslar qo'shiladi, keyin ikkiga bo'linadi, keyin balandlikka ko'paytiriladi.",
      'Сначала складываются основания, потом делятся на два, потом умножаются на высоту.',
      'First the bases are added, then divided by two, then multiplied by the height.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar asoslar qo'shilib, keyin ko'paytirilgan.",
      'Все пять разобраны. Каждый раз основания складывались, потом умножались.',
      'All five are done. Each time the bases were added, then multiplied.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 12,  b = 8,  h = 5'}</Row>,
        ok: L("Ha. O'n ikki qo'shilgan sakkiz, yigirma, ikkiga bo'linsa, o'n, beshga ko'paytirilsa, ellik.", 'Да. Двенадцать плюс восемь, двадцать, разделить на два, десять, умножить на пять, пятьдесят.', 'Yes. Twelve plus eight is twenty, divided by two is ten, times five is fifty.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '50' },
          { id: 'b', label: '96', hint: L("Asoslar qo'shilishi kerak, ko'paytirilmasligi.", 'Основания нужно складывать, а не перемножать.', 'The bases must be added, not multiplied.') },
        ],
        solution: ['12+8', '20', '20 : 2', '10', '10 · 5', '50'],
      },
      {
        expr: <Row size="big" align="center">{'a = 15,  b = 9,  h = 4'}</Row>,
        ok: L("Ha. O'n besh qo'shilgan to'qqiz, yigirma to'rt, ikkiga bo'linsa, o'n ikki, to'rtga ko'paytirilsa, qirq sakkiz.", 'Да. Пятнадцать плюс девять, двадцать четыре, разделить на два, двенадцать, умножить на четыре, сорок восемь.', 'Yes. Fifteen plus nine is twenty-four, divided by two is twelve, times four is forty-eight.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '48' },
          { id: 'b', label: '135', hint: L("Asoslar qo'shilishi kerak, ko'paytirilmasligi.", 'Основания нужно складывать, а не перемножать.', 'The bases must be added, not multiplied.') },
        ],
        solution: ['15+9', '24', '24 : 2', '12', '12 · 4', '48'],
      },
      {
        expr: <Row size="big" align="center">{'a = 20,  b = 14,  h = 6'}</Row>,
        ok: L("Ha. Yigirma qo'shilgan o'n to'rt, o'ttiz to'rt, ikkiga bo'linsa, o'n yetti, oltiga ko'paytirilsa, yuz ikki.", 'Да. Двадцать плюс четырнадцать, тридцать четыре, разделить на два, семнадцать, умножить на шесть, сто два.', 'Yes. Twenty plus fourteen is thirty-four, divided by two is seventeen, times six is a hundred two.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '102' },
          { id: 'b', label: '280', hint: L("Asoslar qo'shilishi kerak, ko'paytirilmasligi.", 'Основания нужно складывать, а не перемножать.', 'The bases must be added, not multiplied.') },
        ],
        solution: ['20+14', '34', '34 : 2', '17', '17 · 6', '102'],
      },
      {
        expr: <Row size="big" align="center">{'a = 11,  b = 5,  h = 3'}</Row>,
        ok: L("Ha. O'n bir qo'shilgan besh, o'n olti, ikkiga bo'linsa, sakkiz, uchga ko'paytirilsa, yigirma to'rt.", 'Да. Одиннадцать плюс пять, шестнадцать, разделить на два, восемь, умножить на три, двадцать четыре.', 'Yes. Eleven plus five is sixteen, divided by two is eight, times three is twenty-four.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '24' },
          { id: 'b', label: '55', hint: L("Asoslar qo'shilishi kerak, ko'paytirilmasligi.", 'Основания нужно складывать, а не перемножать.', 'The bases must be added, not multiplied.') },
        ],
        solution: ['11+5', '16', '16 : 2', '8', '8 · 3', '24'],
      },
      {
        expr: <Row size="big" align="center">{'a = 18,  b = 10,  h = 7'}</Row>,
        ok: L("Ha. O'n sakkiz qo'shilgan o'n, yigirma sakkiz, ikkiga bo'linsa, o'n to'rt, yettiga ko'paytirilsa, to'qson sakkiz.", 'Да. Восемнадцать плюс десять, двадцать восемь, разделить на два, четырнадцать, умножить на семь, девяносто восемь.', 'Yes. Eighteen plus ten is twenty-eight, divided by two is fourteen, times seven is ninety-eight.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '98' },
          { id: 'b', label: '180', hint: L("Asoslar qo'shilishi kerak, ko'paytirilmasligi.", 'Основания нужно складывать, а не перемножать.', 'The bases must be added, not multiplied.') },
        ],
        solution: ['18+10', '28', '28 : 2', '14', '14 · 7', '98'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): o'rta chiziq orqali yuzani
// hisoblash (natija).
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З87',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "O'rta chiziq orqali trapetsiya yuzini hisoblang",
    'Вычисли площадь трапеции через среднюю линию',
    'Compute the area of the trapezoid through the midline',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida o'rta chiziq va balandlik berilgan.",
      'Три задания. В каждом даны средняя линия и высота.',
      'Three tasks. In each, the midline and height are given.'),
    A('why',
      "O'rta chiziq bevosita balandlikka ko'paytiriladi, asoslarni qo'shish kerak emas.",
      'Средняя линия прямо умножается на высоту, складывать основания не нужно.',
      'The midline is directly multiplied by the height, no need to add the bases.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar o'rta chiziq to'g'ridan-to'g'ri balandlikka ko'paytirilgan.",
      'Все три разобраны. Каждый раз средняя линия прямо умножалась на высоту.',
      'All three are done. Each time the midline was directly multiplied by the height.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'m = 9,  h = 6'}</Row>,
        ok: L("Ha. To'qqiz ko'paytirilgan olti, ellik to'rt.", 'Да. Девять умножить на шесть, пятьдесят четыре.', 'Yes. Nine times six, fifty-four.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '54' },
          { id: 'b', label: '15', hint: L("Bu yig'indi, ko'paytma emas.", 'Это сумма, а не произведение.', 'That is the sum, not the product.') },
        ],
        solution: ['9 · 6', '54'],
      },
      {
        expr: <Row size="big" align="center">{'m = 7,  h = 8'}</Row>,
        ok: L("Ha. Yetti ko'paytirilgan sakkiz, ellik olti.", 'Да. Семь умножить на восемь, пятьдесят шесть.', 'Yes. Seven times eight, fifty-six.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '56' },
          { id: 'b', label: '15', hint: L("Bu yig'indi, ko'paytma emas.", 'Это сумма, а не произведение.', 'That is the sum, not the product.') },
        ],
        solution: ['7 · 8', '56'],
      },
      {
        expr: <Row size="big" align="center">{'m = 11,  h = 4'}</Row>,
        ok: L("Ha. O'n bir ko'paytirilgan to'rt, qirq to'rt.", 'Да. Одиннадцать умножить на четыре, сорок четыре.', 'Yes. Eleven times four, forty-four.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '44' },
          { id: 'b', label: '15', hint: L("Bu yig'indi, ko'paytma emas.", 'Это сумма, а не произведение.', 'That is the sum, not the product.') },
        ],
        solution: ['11 · 4', '44'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): ikki uchburchakka
// bo'lib tekshirish (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Trapetsiya yuzini ikki uchburchak orqali tekshiring",
    'Проверь площадь трапеции через два треугольника',
    'Check the trapezoid\'s area through two triangles',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida ikki uchburchak yuzi qo'shilib, formula natijasi bilan solishtiriladi.",
      'Три задания. В каждом складываются площади двух треугольников и сравниваются с формулой.',
      'Three tasks. In each, the areas of two triangles are added and compared with the formula.'),
    A('why',
      "Ikki usul bir xil javobni berishi shart.",
      'Оба способа обязаны дать один и тот же ответ.',
      'Both methods must give the same answer.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ikki usul bir xil yuzani bergan.",
      'Все три разобраны. Каждый раз оба способа давали одну площадь.',
      'All three are done. Each time both methods gave the same area.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 10,  b = 6,  h = 5   →   S = 40'}</Row>,
        ok: L("Ha. Yarim olti besh, o'n besh, yarim o'n besh, yigirma besh, qo'shilsa, qirq.", 'Да. Половина шесть на пять, пятнадцать, половина десять на пять, двадцать пять, вместе сорок.', 'Yes. Half of six times five is fifteen, half of ten times five is twenty-five, together forty.'),
        question: L("Ikki uchburchak yuzlari yig'indisi ham 40ga tengmi?", 'Равна ли сумма площадей двух треугольников также 40?', 'Does the sum of the two triangles\' areas also equal 40?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, o'n besh qo'shilgan yigirma besh, qirq chiqadi.", 'Посчитай, пятнадцать плюс двадцать пять, выходит сорок.', 'Compute it, fifteen plus twenty-five comes to forty.') },
        ],
        solution: ['½·6·5=15', '½·10·5=25', '15+25', '40'],
      },
      {
        expr: <Row size="big" align="center">{'a = 14,  b = 8,  h = 4   →   S = 44'}</Row>,
        ok: L("Ha. Yarim sakkiz to'rt, o'n olti, yarim o'n to'rt to'rt, yigirma sakkiz, qo'shilsa, qirq to'rt.", 'Да. Половина восемь на четыре, шестнадцать, половина четырнадцать на четыре, двадцать восемь, вместе сорок четыре.', 'Yes. Half of eight times four is sixteen, half of fourteen times four is twenty-eight, together forty-four.'),
        question: L("Ikki uchburchak yuzlari yig'indisi ham 44ga tengmi?", 'Равна ли сумма площадей двух треугольников также 44?', 'Does the sum of the two triangles\' areas also equal 44?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, o'n olti qo'shilgan yigirma sakkiz, qirq to'rt chiqadi.", 'Посчитай, шестнадцать плюс двадцать восемь, выходит сорок четыре.', 'Compute it, sixteen plus twenty-eight comes to forty-four.') },
        ],
        solution: ['½·8·4=16', '½·14·4=28', '16+28', '44'],
      },
      {
        expr: <Row size="big" align="center">{'a = 9,  b = 5,  h = 6   →   S = 40'}</Row>,
        ok: L("Yo'q. Yarim besh olti, o'n besh, yarim to'qqiz olti, yigirma yetti, qo'shilsa, qirq ikki, qirq emas.", 'Нет. Половина пять на шесть, пятнадцать, половина девять на шесть, двадцать семь, вместе сорок два, а не сорок.', 'No. Half of five times six is fifteen, half of nine times six is twenty-seven, together forty-two, not forty.'),
        question: L("Ikki uchburchak yuzlari yig'indisi ham 40ga tengmi?", 'Равна ли сумма площадей двух треугольников также 40?', 'Does the sum of the two triangles\' areas also equal 40?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, qirq ikki chiqishi kerak.", 'Посчитай снова, должно выйти сорок два.', 'Compute it again, it should come to forty-two.') },
        ],
        solution: ['½·5·6=15', '½·9·6=27', '15+27', '42'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): asoslar ko'paytirilgan
// (З87) va balandlik yon tomon bilan chalkashtirilgan (З88).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З87',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato javobda nima noto'g'ri",
    'Что неверно в двух ошибочных ответах',
    'What is wrong in two mistaken answers',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham trapetsiyaning yuzi noto'g'ri topilgan.",
      'Два задания. В обоих площадь трапеции найдена неверно.',
      'Two tasks. In both, the trapezoid\'s area was found incorrectly.'),
    A('why',
      "Asoslar qo'shilishi kerak, ko'paytirilmasligi, va balandlik yon tomon bilan chalkashtirilmasligi kerak.",
      'Основания нужно складывать, а не перемножать, и высоту нельзя путать с боковой стороной.',
      'The bases must be added, not multiplied, and the height must not be confused with the leg.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham formulaning bir qismini chalkashtirishdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за путаницы в одной части формулы.',
      'Both are done. Both mistakes came from confusing one part of the formula.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 10,  b = 6,  h = 5   →   S = ½ · 10 · 6 = 30'}</Row>,
        ok: L("Ha. O'n va olti ko'paytirilgan, aslida ular qo'shilishi kerak edi, balandlik esa hisobga olinmagan.", 'Да. Десять и шесть перемножены, хотя должны были быть сложены, а высота вообще не учтена.', 'Yes. Ten and six were multiplied, when they should have been added, and the height was not used at all.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Asoslar qo'shilish o'rniga ko'paytirilgan, balandlik ishlatilmagan", 'Основания перемножены вместо сложения, высота не использована', 'The bases were multiplied instead of added, the height was not used') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, asoslar qo'shilishi va balandlik ko'paytirilishi kerak edi.", 'Это и есть показанная ошибка, основания нужно было сложить и умножить на высоту.', 'This is the very mistake shown; the bases should have been added and multiplied by the height.') },
        ],
        solution: ['(10+6):2 · 5', '40'],
      },
      {
        expr: <Row size="big" align="center">{'a = 12,  b = 8,  7,  h = 6   →   S = (12+8)/2 · 7 = 70'}</Row>,
        ok: L("Ha. Yetti yon tomon uzunligi, u balandlik emas, balandlik olti edi.", 'Да. Семь это длина боковой стороны, а не высота, высота была шесть.', 'Yes. Seven is the length of the leg, not the height, the height was six.'),
        question: L("To'rtinchi son, yon tomon uzunligi bo'lib, u balandlik o'rniga ko'paytirilgan bo'lsa, bu yerda xato qayerda?", 'Если четвёртое число, длина боковой стороны, умножена вместо высоты, в чём здесь ошибка?', 'If the fourth number, the length of the leg, was multiplied instead of the height, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Yon tomon balandlik o'rniga ko'paytirilgan", 'Боковая сторона умножена вместо высоты', 'The leg was multiplied instead of the height') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, yetti yon tomon, balandlik olti edi.", 'Это и есть показанная ошибка, семь, боковая сторона, высота была шесть.', 'This is the very mistake shown; seven is the leg, the height was six.') },
        ],
        solution: ['(12+8)/2 · 6', '60'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): S = (a+b)/2 · h ni
// qadamlab hisoblash.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З87',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Asoslar va balandlikdan trapetsiya yuzini qadamlab toping",
    'Найди площадь трапеции по основаниям и высоте, по шагам',
    'Find the area of the trapezoid from the bases and height, step by step',
  ),
  audio: [
    A('mount',
      "Ikki asos va balandlik berilgan. Uch qadam, qo'shish, ikkiga bo'lish, ko'paytirish.",
      'Даны два основания и высота. Три шага, сложение, деление на два, умножение.',
      'Two bases and a height are given. Three steps, adding, dividing by two, multiplying.'),
    A('why',
      "Qadamlarning tartibi hech qachon o'zgarmaydi.",
      'Порядок шагов никогда не меняется.',
      'The order of the steps never changes.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar uch qadam ketma-ket bajarilgan.",
      'Все три заполнены. Каждый раз три шага выполнялись по порядку.',
      'All three are filled. Each time the three steps were done in order.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['10', '5', '25'],
      lines: [
        [{ t: 'a=7, b=3, h=5   →   7+3=' }, { slot: '10' }, { t: ', :2=' }, { slot: '5' }, { t: ', ·5=' }, { slot: '25' }],
      ],
    },
    tasks: [
      {
        chips: ['12', '6', '30'],
        lines: [
          [{ t: 'a=8, b=4, h=5   →   8+4=' }, { slot: '12' }, { t: ', :2=' }, { slot: '6' }, { t: ', ·5=' }, { slot: '30' }],
        ],
      },
      {
        chips: ['16', '8', '32'],
        lines: [
          [{ t: 'a=10, b=6, h=4   →   10+6=' }, { slot: '16' }, { t: ', :2=' }, { slot: '8' }, { t: ', ·4=' }, { slot: '32' }],
        ],
      },
      {
        chips: ['20', '10', '70'],
        lines: [
          [{ t: 'a=13, b=7, h=7   →   13+7=' }, { slot: '20' }, { t: ', :2=' }, { slot: '10' }, { t: ', ·7=' }, { slot: '70' }],
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
    "Trapetsiyaning yuzi bo'yicha to'rt savol",
    'Четыре вопроса о площади трапеции',
    'Four questions about the area of the trapezoid',
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
        id: 'q1', tag: 'З87',
        ask: L('Asoslari 9 va 5, balandligi 4 bo\'lsa, trapetsiyaning yuzi qancha?', 'Если основания 9 и 5, высота 4, чему равна площадь трапеции?', 'If the bases are 9 and 5, the height 4, what is the area of the trapezoid?'),
        options: [
          { id: 'ok', right: true, label: '28' },
          { id: 'no', label: '45' },
        ],
        hint: L("To'qqiz qo'shilgan besh, o'n to'rt, ikkiga bo'linsa, yetti, to'rtga ko'paytirilsa, yigirma sakkiz.", 'Девять плюс пять, четырнадцать, разделить на два, семь, умножить на четыре, двадцать восемь.', 'Nine plus five is fourteen, divided by two is seven, times four is twenty-eight.'),
        ok: L("To'g'ri, asoslar qo'shilib, ikkiga bo'linib, balandlikka ko'paytirilgan.", 'Верно, основания сложены, разделены на два, умножены на высоту.', 'Correct, the bases were added, divided by two, multiplied by the height.'),
      },
      {
        id: 'q2', tag: 'З88',
        ask: L('Trapetsiyada balandlik yon tomonning o\'ziga tengmi?', 'Равна ли высота трапеции самой боковой стороне?', 'Is the height of a trapezoid equal to the leg itself?'),
        options: [
          { id: 'ok', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'no', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Balandlik perpendikulyar masofa, yon tomon esa qiyshiq turadi.", 'Высота, перпендикулярное расстояние, а боковая сторона стоит наклонно.', 'The height is the perpendicular distance, the leg stands slanted.'),
        ok: L("To'g'ri, ular teng emas.", 'Верно, они не равны.', 'Correct, they are not equal.'),
      },
      {
        id: 'q3', tag: 'З87',
        ask: L('O\'rta chiziq 8, balandlik 5 bo\'lsa, yuzi qancha?', 'Если средняя линия 8, высота 5, чему равна площадь?', 'If the midline is 8, the height 5, what is the area?'),
        options: [
          { id: 'ok', right: true, label: '40' },
          { id: 'no', label: '13' },
        ],
        hint: L("O'rta chiziq bevosita balandlikka ko'paytiriladi.", 'Средняя линия прямо умножается на высоту.', 'The midline is directly multiplied by the height.'),
        ok: L("To'g'ri, sakkiz ko'paytirilgan besh, qirq.", 'Верно, восемь умножить на пять, сорок.', 'Correct, eight times five, forty.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('(14+6) ikkiga bo\'linsa, 10ga tengmi?', 'Верно ли, что (14+6), делённое на два, равно 10?', 'Is it true that (14+6) divided by two equals 10?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, yigirma ikkiga bo'linsa, o'n chiqadi.", 'Посчитай, двадцать, делённое на два, выходит десять.', 'Compute it, twenty divided by two comes to ten.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З87',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Asoslari 16 va 10, balandligi 6 bo'lgan trapetsiyaning yuzini yig'ing.",
            'Собери площадь трапеции с основаниями 16 и 10, высотой 6.',
            'Assemble the area of a trapezoid with bases 16 and 10, height 6.',
          ),
          lines: [
            [{ t: '16, 10, 6   →   S = ' }, { slot: '78' }],
          ],
          tiles: [
            { id: 't1', v: '78', x: 12, y: 12 },
            { id: 't2', v: '160', x: 60, y: 14 },
            { id: 't3', v: '96', x: 30, y: 50 },
            { id: 't4', v: '13', x: 78, y: 48 },
          ],
          hint: L(
            "O'n olti qo'shilgan o'n, yigirma olti, ikkiga bo'linsa, o'n uch, oltiga ko'paytirilsa.",
            'Шестнадцать плюс десять, двадцать шесть, разделить на два, тринадцать, умножить на шесть.',
            'Sixteen plus ten is twenty-six, divided by two is thirteen, times six.',
          ),
          doneNote: L(
            "Yig'ildi. Asoslar qo'shilib, ikkiga bo'linib, balandlikka ko'paytirilgan.",
            'Собрано. Основания сложены, разделены на два, умножены на высоту.',
            'Assembled. The bases were added, divided by two, multiplied by the height.',
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
    "Asoslar qo'shiladi, ikkiga bo'linadi, keyin balandlikka ko'paytiriladi",
    'Основания складываются, делятся на два, потом умножаются на высоту',
    'The bases are added, divided by two, then multiplied by the height',
  ),
  audio: [
    A('s0',
      "Darsdan bitta chertyozh qoladi. Trapetsiya ikkilansa, parallelogramm chiqadi.",
      'С урока остаётся один чертёж. Трапеция, удвоенная, даёт параллелограмм.',
      'One drawing stays with you. The trapezoid, doubled, gives a parallelogram.'),
    A('s1',
      "Bugun uch narsa qilindi. Formulani ikki uchburchakka bo'lib isbotladingiz, ikkilantirib chertyozhda ko'rdingiz va o'rta chiziq bilan bog'liqligini bildingiz.",
      'Сегодня сделано три вещи. Ты доказал формулу через два треугольника, увидел это на чертеже через удвоение, и узнал связь со средней линией.',
      'Three things are done today. You proved the formula through two triangles, saw it on the drawing by doubling, and learned the connection with the midline.'),
    A('s2',
      "Keyingi darsda Falyes teoremasi va o'rta chiziqning o'zi. Bugun eslatilgan bog'liqlik to'liq ochiladi.",
      'В следующем уроке теорема Фалеса и сама средняя линия. Сегодняшняя связь раскроется полностью.',
      'The next lesson covers the Thales theorem and the midline itself. Today\'s connection will be fully revealed.',
    ),
  ],
  props: {
    mark: 'S = (a+b)/2 · h',
    markNote: L(
      "asoslar o'n va olti, balandlik besh, yuza qirq",
      'основания десять и шесть, высота пять, площадь сорок',
      'bases ten and six, height five, area forty',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: Falyes teoremasi va o'rta chiziq",
      'Следующий урок: теорема Фалеса и средняя линия',
      'Next lesson: the Thales theorem and the midline',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
