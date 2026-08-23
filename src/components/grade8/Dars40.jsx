// ============================================================================
// 8-sinf, Dars 40. PARALLELOGRAMMNING YUZI.
//
// BLOK Б6. Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`, `geofigure.jsx`,
// `prooflines.jsx`, `areacut.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da.
//
// YANGI PRIBOR: `AreaCut` — BLOKNING PILOT DARSI (reja: "проверка прибора
// 5 до массового производства блока"). Parallelogramm siljigan to'g'ri
// to'rtburchak: yon tomon siljitilganda (kesib ko'chirilganda) shakl
// to'g'ri to'rtburchakka aylanadi, asos va balandlik o'zgarmaydi, demak
// yuzi ham o'zgarmaydi.
//
// KARKAS: Dars 37-39 dagidek, SCREENS to'g'ridan-to'g'ri qurilgan.
//
// MANBA: 8-sinf geometriya darsligi, 2-§ (YUZLAR), 21-mavzu (77-bet).
// Oldingi mavzular (18-20, 69-76-bet) dan ikkita aksioma olingan:
//   - 1-xossa: teng shakllar teng yuzlarga ega;
//   - 2-xossa: bir-birini qoplamaydigan qismlarga bo'lingan ko'pburchak
//     yuzi shu qismlar yuzlari yig'indisiga teng (`AreaCut`ning asosi).
// Barcha teorema va misollar 21-mavzudan:
//   - ta'rif: istalgan tomon asos, unga mos balandlik qarama-qarshi
//     tomongacha bo'lgan masofa; parallelogrammda odatda IKKI XIL
//     balandlik bor (140-rasm, h_a va h_b);
//   - teorema: S = a · h, isbot PBCF to'g'ri to'rtburchak yasab, ABP va
//     DCF uchburchaklarning tengligi (gipotenuza va o'tkir burchak) orqali;
//   - natija: bitta asosga va teng balandlikka ega ikki parallelogramm
//     teng tuzilgan (tengdosh);
//   - 1-masala (77-bet): tomonlari 25 sm va 20 sm, birinchi balandligi
//     8 sm — ikkinchi balandligi S=25·8=200, h_b=200:20=10 sm.
//
// ADASHISHLAR, ikkitasi yangi:
//   З83, parallelogrammning yuzi ikki TOMONI ko'paytmasiga teng deb
//   hisoblangan (yon tomon balandlik bilan chalkashtirilgan);
//   З84, parallelogrammda bitta balandlik bor deb hisoblangan, boshqa
//   asosga o'tganda balandlik qayta hisoblanmagan;
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
  id: 'geo-8-40',
  n: 40,
  row: 45,
  block: 'Б6',
  topic: L("Parallelogrammning yuzi", 'Площадь параллелограмма', 'The area of the parallelogram'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Parallelogrammning istalgan tomoni asos bo'lishi mumkin, unga mos balandlik qarama-qarshi tomongacha bo'lgan masofa",
    'Любая сторона параллелограмма может быть основанием, соответствующая высота, расстояние до противоположной стороны',
    'Any side of a parallelogram can be the base, the matching height is the distance to the opposite side',
  ),
  L(
    "Parallelogrammning yuzi asosi bilan unga mos balandligining ko'paytmasiga teng, S = a · h",
    'Площадь параллелограмма равна произведению основания на соответствующую высоту, S = a · h',
    'The area of a parallelogram equals its base times the matching height, S = a · h',
  ),
  L(
    "Boshqa tomon asos qilib olinsa, balandlik ham boshqacha bo'ladi, lekin yuza o'zgarmaydi",
    'Если взять другую сторону за основание, высота будет другой, но площадь не изменится',
    'If a different side is taken as the base, the height will differ, but the area stays the same',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З83': {
    what: L(
      "parallelogrammning yuzi ikki tomoni ko'paytmasiga teng deb hisoblangan, yon tomon balandlik bilan chalkashtirilgan",
      'площадь параллелограмма принята равной произведению двух сторон, боковая сторона спутана с высотой',
      'the area of the parallelogram was taken as the product of two sides, the side confused with the height',
    ),
    wrong: null,
    at: 12,
  },
  'З84': {
    what: L(
      "parallelogrammda bitta balandlik bor deb hisoblangan, boshqa asosga o'tganda balandlik qayta hisoblanmagan",
      'считалось, что у параллелограмма одна высота, при смене основания высота не пересчитана',
      'it was assumed a parallelogram has one height, and the height was not recomputed when the base changed',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (4-ekran, ProofLines). ABCD parallelogramm,
// P va F, B va C dan asos chizig'iga tushirilgan balandliklarning oyoqlari.
// ============================================================
const PGRAM = { A: [20, 90], B: [45, 30], C: [110, 30], D: [85, 90], P: [45, 90], F: [110, 90] }
const PGRAM_ORDER = ['A', 'B', 'C', 'D']

// ============================================================
// SAHNALAR (§6). Xuk: parallelogrammning yuzi qanday topiladi. Yakun:
// parallelogramm to'g'ri to'rtburchakka aylanadi, yuzi saqlanadi.
// ============================================================
const SC_ASK = L('YUZASI QANDAY TOPILADI', 'КАК НАЙТИ ПЛОЩАДЬ', 'HOW IS THE AREA FOUND')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <polygon points="130,90 155,35 240,35 215,90" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="185" cy="62" r="15" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="185" y="68" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Kesib ko'chirilsa, parallelogramm to'g'ri to'rtburchakka aylanadi",
      'Отрезав и передвинув, параллелограмм становится прямоугольником',
      'Cut and shifted, the parallelogram becomes a rectangle',
    )}>
      <polygon points="130,85 175,85 175,35 130,35" fill="none" stroke={T.ok} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '1300ms' }}>
        <text x="185" y="105" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.ok}>{'S = a · h'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1900ms' }}>
        <text x="185" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>{"yuza o'zgarmaydi"}</text>
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
    "Asosi o'n, yon tomoni yetti, balandligi olti bo'lgan parallelogrammning yuzi qanday topiladi",
    'Как найти площадь параллелограмма с основанием десять, боковой стороной семь и высотой шесть',
    'How is the area found for a parallelogram with base ten, side seven, and height six',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Parallelogrammda uch son bor, asos, yon tomon va balandlik.",
      'В параллелограмме есть три числа, основание, боковая сторона и высота.',
      'The parallelogram has three numbers, the base, the side, and the height.'),
    A('why',
      "Taxmin qiling, yuzni topish uchun qaysi ikkitasi ko'paytiriladi.",
      'Предположи, какие два из них перемножаются для площади.',
      'Predict which two of them are multiplied for the area.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, yuzni topish uchun qaysi ikki son ko'paytiriladi?",
      'Как думаешь, какие два числа перемножаются для площади?',
      'What do you think, which two numbers are multiplied for the area?',
    ),
    items: [
      { id: 'a', show: L("Asos va yon tomon", 'Основание и боковая сторона', 'The base and the side') },
      { id: 'b', show: L("Asos va balandlik", 'Основание и высота', 'The base and the height') },
      { id: 'c', show: L("Yon tomon va balandlik", 'Боковая сторона и высота', 'The side and the height') },
      { id: 'd', show: L("Barcha uchtasi qo'shiladi", 'Все три складываются', 'All three are added') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. To'g'ri to'rtburchakning yuzi (20-mavzu, 74-bet).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "To'g'ri to'rtburchakning yuzini eslash",
    'Вспоминаем площадь прямоугольника',
    'Recalling the area of the rectangle',
  ),
  audio: [
    A('mount',
      "To'g'ri to'rtburchakning yuzi allaqachon ma'lum.",
      'Площадь прямоугольника уже известна.',
      'The area of the rectangle is already known.'),
    A('why',
      "Ikki qo'shni tomon qanday bog'lanishini eslang.",
      'Вспомни, как связаны две соседние стороны.',
      'Recall how two adjacent sides are related.'),
  ],
  props: {
    ask: L(
      "To'g'ri to'rtburchakning tomonlari a va b bo'lsa, yuzi qanday topiladi?",
      'Если стороны прямоугольника a и b, как найти площадь?',
      'If the sides of a rectangle are a and b, how is the area found?',
    ),
    items: [
      { id: 'right', show: 'S = a · b', right: true, name: L("qo'shni tomonlar ko'paytiriladi", 'соседние стороны перемножаются', 'the adjacent sides are multiplied') },
      {
        id: 'wrong1', show: 'S = 2(a + b)',
        hint: L("Bu perimetr formulasi, yuza emas.", 'Это формула периметра, а не площади.', 'That is the perimeter formula, not the area.'),
      },
      {
        id: 'wrong2', show: 'S = a + b',
        hint: L("Tomonlar qo'shilmaydi, ko'paytiriladi.", 'Стороны не складываются, а перемножаются.', 'The sides are not added, they are multiplied.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun bu formula parallelogramm uchun qanday o'zgarishini ko'ramiz.",
      'Верно. Сегодня увидим, как эта формула меняется для параллелограмма.',
      'Correct. Today we will see how this formula changes for a parallelogram.',
    ),
  },
}

// ============================================================
// EKRAN 3. QAYSI KESMA BALANDLIK (1-darsning `pick`). Ловушка, yon
// tomon balandlik bilan chalkashtirilgan (З83).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З83',
  eyebrow: L('QAYSI KESMA BALANDLIK', 'КАКОЙ ОТРЕЗОК ВЫСОТА', 'WHICH SEGMENT IS THE HEIGHT'),
  title: L(
    "Parallelogrammda qaysi kesma balandlik bo'ladi",
    'Какой отрезок в параллелограмме является высотой',
    'Which segment in the parallelogram is the height',
  ),
  audio: [
    A('mount',
      "Asosga ikki kesma tortilgan, yon tomon va perpendikulyar kesma.",
      'К основанию проведены два отрезка, боковая сторона и перпендикулярный отрезок.',
      'Two segments are drawn to the base, the side and a perpendicular segment.'),
    A('why',
      "Balandlik faqat perpendikulyar kesma bo'ladi, yon tomon esa qiyshiq turadi.",
      'Высотой является только перпендикулярный отрезок, боковая сторона стоит наклонно.',
      'Only the perpendicular segment is the height, the side stands slanted.'),
  ],
  props: {
    ask: L(
      "Asosga tushirilgan balandlik qaysi kesma?",
      'Какой отрезок является высотой к основанию?',
      'Which segment is the height to the base?',
    ),
    items: [
      { id: 'right', show: L("Asosga perpendikulyar kesma", 'Отрезок, перпендикулярный основанию', 'The segment perpendicular to the base'), right: true, name: L("balandlik doim perpendikulyar", 'высота всегда перпендикулярна', 'the height is always perpendicular') },
      {
        id: 'wrong', show: L("Yon tomonning o'zi", 'Сама боковая сторона', 'The side itself'),
        hint: L("Yon tomon asosga perpendikulyar emas, qiyshiq turadi, u balandlik emas.", 'Боковая сторона не перпендикулярна основанию, стоит наклонно, это не высота.', 'The side is not perpendicular to the base, it stands slanted, it is not the height.'),
      },
    ],
    after: L(
      "To'g'ri. Balandlik faqat perpendikulyar kesma, yon tomon undan uzunroq bo'ladi.",
      'Верно. Высота, только перпендикулярный отрезок, боковая сторона длиннее её.',
      'Correct. The height is only the perpendicular segment, the side is longer than it.',
    ),
  },
}

// ============================================================
// EKRAN 4. ISBOT (`prooflines`). Teorema: S = a · h.
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З83',
  eyebrow: L('FORMULANI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ФОРМУЛУ', 'PROVING THE FORMULA'),
  title: L(
    "Parallelogrammning yuzi asos ko'paytirilgan balandlikka teng",
    'Площадь параллелограмма равна произведению основания на высоту',
    'The area of the parallelogram equals the base times the height',
  ),
  audio: [
    A('mount',
      "ABCD parallelogramm, AD asos, BP va CF balandliklar.",
      'ABCD, параллелограмм, AD основание, BP и CF высоты.',
      'ABCD is a parallelogram, AD the base, BP and CF the heights.'),
    A('why',
      "PBCF to'g'ri to'rtburchak yasaymiz va uni ABCD bilan solishtiramiz.",
      'Строим прямоугольник PBCF и сравниваем его с ABCD.',
      'We build the rectangle PBCF and compare it with ABCD.'),
  ],
  props: {
    points: PGRAM,
    order: PGRAM_ORDER,
    marks: [['B', 'P'], ['C', 'F']],
    given: [
      L("ABCD, parallelogramm, AD asos", 'ABCD, параллелограмм, AD основание', 'ABCD, a parallelogram, AD the base'),
      L("BP va CF, balandliklar", 'BP и CF, высоты', 'BP and CF, the heights'),
    ],
    goal: L("S(ABCD) = AD · BP", 'S(ABCD) = AD · BP', 'S(ABCD) = AD · BP'),
    lines: [
      {
        text: L("AB teng DC ga", 'AB равна DC', 'AB equals DC'),
        options: [
          { id: 'ok', right: true, label: L("Parallelogrammning qarama-qarshi tomonlari teng", 'Противоположные стороны параллелограмма равны', 'The opposite sides of a parallelogram are equal') },
          { id: 'no', label: L("Ular teng, chunki chertyozhda shunday chizilgan", 'Они равны, потому что так нарисовано на чертеже', 'They are equal because that is how it is drawn'), hint: L("Chizmadagi ko'rinish sabab emas, parallelogrammning xossasidan foydalaning.", 'Вид на чертеже не причина, используй свойство параллелограмма.', 'The look of the drawing is not the reason, use the property of the parallelogram.') },
        ],
      },
      {
        text: L("uchburchak ABP uchburchak DCF ga teng", 'треугольник ABP равен треугольнику DCF', 'triangle ABP equals triangle DCF'),
        options: [
          { id: 'ok', right: true, label: L("Gipotenuza va o'tkir burchagiga ko'ra (to'g'ri burchakli uchburchaklar belgisi)", 'По гипотенузе и острому углу (признак прямоугольных треугольников)', 'By the hypotenuse and an acute angle (criterion for right triangles)') },
          { id: 'no', label: L("Ikki katetiga ko'ra", 'По двум катетам', 'By two legs'), hint: L("Ikki katet haqida ma'lumot yo'q, bizda gipotenuza va burchak bor.", 'Данных о двух катетах нет, у нас гипотенуза и угол.', 'There is no data about two legs, we have the hypotenuse and an angle.') },
        ],
      },
      {
        text: L("ABCD parallelogramm PBCF to'g'ri to'rtburchak bilan teng tuzilgan", 'ABCD равносоставлен с прямоугольником PBCF', 'ABCD is equidecomposable with the rectangle PBCF'),
        options: [
          { id: 'ok', right: true, label: L("Ikkalasi ham bitta trapetsiya va bir xil uchburchakdan tashkil topgan", 'Оба состоят из одной трапеции и равного треугольника', 'Both are made of one trapezoid and an equal triangle') },
          { id: 'no', label: L("Ular tengdosh, chunki bir xilday ko'rinadi", 'Они равновелики, потому что выглядят одинаково', 'They are equal in area because they look alike'), hint: L("Ko'rinish sabab emas, qismlarga bo'lish orqali ko'rsatilishi kerak.", 'Внешний вид не причина, нужно показать через разбиение на части.', 'Appearance is not the reason, it must be shown through the decomposition into parts.') },
        ],
      },
      {
        text: L("shuning uchun S(ABCD) teng AD ko'paytirilgan BP ga", 'поэтому S(ABCD) равна AD, умноженной на BP', 'therefore S(ABCD) equals AD times BP'),
        options: [
          { id: 'ok', right: true, label: L("Teng tuzilgan shakllar tengdosh, PBCF ning yuzi asos ko'paytirilgan balandlik", 'Равносоставленные фигуры равновелики, площадь PBCF, основание на высоту', 'Equidecomposable shapes are equal in area, the area of PBCF is base times height') },
          { id: 'no', label: L("Chunki ABCDning barcha tomonlari ma'lum", 'Потому что все стороны ABCD известны', 'Because all the sides of ABCD are known'), hint: L("Tomonlarning ma'lum bo'lishi yetarli emas, tengdoshlikdan foydalaning.", 'Знания сторон недостаточно, используй равновеликость.', 'Knowing the sides is not enough, use the equal-area property.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. PBCFning yuzi AD ko'paytirilgan BP, va ABCD unga tengdosh, shuning uchun ABCDning yuzi ham shunga teng.",
      'Доказано. Площадь PBCF равна AD на BP, а ABCD равновелик ему, поэтому площадь ABCD тоже такая.',
      'Proven. The area of PBCF is AD times BP, and ABCD is equal in area to it, so the area of ABCD is the same.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI (`areacut`). PILOT DARS: parallelogramm
// kesib ko'chirilib, to'g'ri to'rtburchakka aylanadi, yuza o'zgarmaydi.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'areacut',
  tag: 'З84',
  eyebrow: L('KESIB KO\'CHIRING', 'ОТРЕЖЬ И ПЕРЕДВИНЬ', 'CUT AND SLIDE'),
  title: L(
    "Parallelogrammni kesib ko'chirib, to'g'ri to'rtburchak hosil qiling",
    'Отрежь и передвинь, чтобы из параллелограмма получился прямоугольник',
    'Cut and slide to turn the parallelogram into a rectangle',
  ),
  audio: [
    A('mount',
      "Asos to'qqiz, balandlik olti. Yon tomon qiyshiq turibdi.",
      'Основание девять, высота шесть. Боковая сторона стоит наклонно.',
      'The base is nine, the height is six. The side stands slanted.'),
    A('why',
      "Tugmani bosib, chetdagi uchburchakni ikkinchi tomonga ko'chiring.",
      'Нажимай на кнопку, чтобы передвинуть крайний треугольник на другую сторону.',
      'Press the button to slide the edge triangle over to the other side.'),
    W('cut',
      "To'g'ri to'rtburchak hosil bo'ldi. Asos va balandlik o'zgarmadi, yuza ham o'zgarmadi.",
      'Получился прямоугольник. Основание и высота не изменились, площадь тоже.',
      'A rectangle was formed. The base and height did not change, neither did the area.'),
  ],
  props: {
    base: 9,
    height: 6,
    shiftStart: 6,
    shiftMax: 6,
    shiftStep: 2,
    ask: L("Tugmani uch marta bosing", 'Нажми кнопку три раза', 'Press the button three times'),
    after: L(
      "To'g'ri to'rtburchak chiqdi, tomonlari to'qqiz va olti. Yuza hech qachon o'zgarmagan edi.",
      'Получился прямоугольник со сторонами девять и шесть. Площадь не менялась ни разу.',
      'A rectangle came out with sides nine and six. The area never changed at all.',
    ),
    fields: [
      {
        ask: L("Parallelogrammning yuzi nechchiga teng?", 'Чему равна площадь параллелограмма?', 'What is the area of the parallelogram?'),
        kind: 'number',
        answer: '54',
        accepts: ['54'],
        hints: {
          '6': L("Olti siljish miqdori edi, yuza emas. Asosni balandlikka ko'paytiring.", 'Шесть это была величина сдвига, а не площадь. Умножь основание на высоту.', 'Six was the shift amount, not the area. Multiply the base by the height.'),
        },
      },
    ],
    note: L(
      "To'qqiz ko'paytirilgan olti, ellik to'rt.",
      'Девять, умноженное на шесть, пятьдесят четыре.',
      'Nine times six, fifty-four.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): bitta parallelogrammda
// ikki xil asos-balandlik, bir xil yuza (1-masala, 77-bet).
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З84',
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Ikki xil asos-balandlik bilan bir xil yuzani topish",
    'Найти одну площадь через две разные пары основание-высота',
    'Finding one area through two different base-height pairs',
  ),
  audio: [
    A('mount',
      "Parallelogrammning tomonlari yigirma besh va yigirma sm. Birinchi balandlik sakkiz.",
      'Стороны параллелограмма двадцать пять и двадцать сантиметров. Первая высота восемь.',
      'The parallelogram\'s sides are twenty-five and twenty centimetres. The first height is eight.'),
    W('w2',
      "Birinchi yo'lda yigirma besh asos, sakkiz balandlik bilan yuza topiladi.",
      'В первом пути площадь находится через основание двадцать пять и высоту восемь.',
      'In the first way, the area is found through base twenty-five and height eight.'),
    W('w4',
      "Ikkinchi yo'lda topilgan yuzadan ikkinchi balandlik hisoblanadi.",
      'Во втором пути вторая высота вычисляется из найденной площади.',
      'In the second way, the second height is computed from the found area.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL, BIRINCHI ASOS', 'СПОСОБ 1, ПЕРВОЕ ОСНОВАНИЕ', 'METHOD 1, THE FIRST BASE'),
        lead: L(
          "Yigirma besh asos, sakkiz balandlik bilan yuzani topamiz",
          'Находим площадь через основание двадцать пять и высоту восемь',
          'We find the area through base twenty-five and height eight',
        ),
        rows: [
          { text: '25 · 8' },
          { text: L("ikki yuz sm kvadrat chiqadi", 'выходит двести квадратных сантиметров', 'comes out to two hundred square centimetres'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL, IKKINCHI ASOS', 'СПОСОБ 2, ВТОРОЕ ОСНОВАНИЕ', 'METHOD 2, THE SECOND BASE'),
        lead: L(
          "Endi yigirma asosga mos balandlikni topamiz",
          'Теперь находим высоту, соответствующую основанию двадцать',
          'Now we find the height matching base twenty',
        ),
        rows: [
          { text: '200 : 20' },
          { text: L("o'n sm chiqadi, birinchisidan boshqacha", 'выходит десять сантиметров, отличается от первой', 'comes out to ten centimetres, different from the first'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL YUZA BERDI', 'ОБА ДАЛИ ОДНУ ПЛОЩАДЬ', 'BOTH GAVE THE SAME AREA'),
        lead: L(
          "Balandliklar boshqacha, yuza esa bir xil",
          'Высоты разные, а площадь одна',
          'The heights differ, the area is the same',
        ),
        rows: [{ text: '200', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): formulaning uch qismi.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З83',
  eyebrow: L('FORMULANING UCH QISMI', 'ТРИ ЧАСТИ ФОРМУЛЫ', 'THE THREE PARTS OF THE FORMULA'),
  title: L(
    "Formulaning uch qismi",
    'Три части формулы',
    'The three parts of the formula',
  ),
  audio: [
    A('mount',
      "Bir formula, uch qism. Har biri o'z ishini qiladi.",
      'Одна формула, три части. Каждая делает своё дело.',
      'One formula, three parts. Each does its own job.'),
    W('p2',
      "Asos, tanlangan tomon, u istalgan tomon bo'lishi mumkin.",
      'Основание, выбранная сторона, ею может быть любая сторона.',
      'The base, the chosen side, it can be any side.'),
    W('p4',
      "Balandlik, asosga perpendikulyar masofa, u yon tomonning o'zi emas.",
      'Высота, перпендикулярное расстояние до основания, это не сама боковая сторона.',
      'The height, the perpendicular distance to the base, it is not the side itself.',
    ),
  ],
  props: {
    tokens: [
      { t: 'S', id: 'mid' },
      { t: '  =  a  ·  ', id: 'a' },
      { t: 'h', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Birinchi qism, yuza. Uni topish maqsad.",
          'Первая часть, площадь. Её найти — цель.',
          'The first part, the area. Finding it is the goal.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Ikkinchi qism, asos. Parallelogrammning istalgan tomoni bo'lishi mumkin.",
          'Вторая часть, основание. Может быть любой стороной параллелограмма.',
          'The second part, the base. It can be any side of the parallelogram.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qism, balandlik. Faqat SHU asosga mos, perpendikulyar masofa.",
          'Третья часть, высота. Только соответствующая ЭТОМУ основанию, перпендикулярное расстояние.',
          'The third part, the height. Only the one matching THIS base, the perpendicular distance.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Yuzni o'lchash masalasi juda qadimiy, va yer maydonlari hali ham gektarlarda, uncha katta bo'lmagan maydonlar esa sotixlarda o'lchanadi, bir sotix yuz kvadrat metrga teng.",
        'Задача измерения площади очень древняя, и земельные участки до сих пор измеряют гектарами, а небольшие участки, сотыми, одна сотая равна ста квадратным метрам.',
        'The problem of measuring area is very ancient, and land plots are still measured in hectares, smaller plots in ares, one are equals a hundred square metres.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Darslik 21-mavzu teoremasi.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З83',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Parallelogrammning yuzi",
    'Площадь параллелограмма',
    'The area of the parallelogram',
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
      { id: 'f1', label: L("istalgan tomon asos, unga mos balandlik qarama-qarshi tomongacha bo'lgan masofa", 'любая сторона основание, соответствующая высота, расстояние до противоположной стороны', 'any side is the base, the matching height is the distance to the opposite side') },
      { id: 'f2', label: L("yuzi asos ko'paytirilgan balandlikka teng, S = a · h", 'площадь равна основанию, умноженному на высоту, S = a · h', 'the area equals the base times the height, S = a · h') },
      { id: 'f3', label: L("boshqa asos olinsa, balandlik ham boshqacha bo'ladi, lekin yuza o'zgarmaydi", 'при другом основании высота другая, но площадь не меняется', 'with a different base the height differs, but the area does not change') },
      { id: 'w1', label: L("yuzi ikki tomoni ko'paytmasiga teng", 'площадь равна произведению двух сторон', 'the area equals the product of two sides') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Ikki TOMON ko'paytmasi emas, asos va aynan SHU asosga mos BALANDLIK ko'paytiriladi.",
      'Так не складывается. Не произведение двух СТОРОН, а основание и именно соответствующая ему ВЫСОТА.',
      'That does not fit. Not the product of two SIDES, but the base and the HEIGHT matching that base.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 2-§, 21-mavzu asosida (77-bet)",
        'Правило на основе геометрии, § 2, тема 21 учебника (стр. 77)',
        'The rule is based on geometry, section 2, topic 21 of the textbook (page 77)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Yon tomon va balandlikni ajratmasdan, yuzani qanday topishni bilmasdik",
        'Мы не умели находить площадь, не отличая боковую сторону от высоты',
        'We did not know how to find the area without telling the side apart from the height',
      ),
      right: L(
        "endi asos ko'paytirilgan aynan mos balandlikni bilamiz",
        'теперь знаем, что нужно основание, умноженное именно на соответствующую высоту',
        'now we know it is the base times exactly the matching height',
      ),
      winner: 'right',
      note: L(
        "Asos va balandlik ko'paytiriladi, yon tomonning o'zi emas",
        'Перемножаются основание и высота, а не сама боковая сторона',
        'The base and the height are multiplied, not the side itself',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): S = a · h to'g'ridan-to'g'ri
// hisoblash.
// ============================================================
const ASK_AREA = L("Yuzi qancha?", 'Чему равна площадь?', 'What is the area?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З83',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Asos va balandlikdan yuzani hisoblang",
    'Вычисли площадь по основанию и высоте',
    'Compute the area from the base and the height',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida asos va balandlik berilgan.",
      'Пять заданий. В каждом даны основание и высота.',
      'Five tasks. In each, the base and height are given.'),
    A('why',
      "Ikkalasi ko'paytiriladi, boshqa hech qanday son emas.",
      'Они перемножаются, никакое другое число.',
      'They are multiplied, no other number.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar aynan asos va balandlik ko'paytirilgan.",
      'Все пять разобраны. Каждый раз перемножались именно основание и высота.',
      'All five are done. Each time exactly the base and height were multiplied.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 12,  h = 5'}</Row>,
        ok: L("Ha. O'n ikki ko'paytirilgan besh, oltmish.", 'Да. Двенадцать умножить на пять, шестьдесят.', 'Yes. Twelve times five, sixty.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '60' },
          { id: 'b', label: '17', hint: L("Bu yig'indi, ko'paytma emas.", 'Это сумма, а не произведение.', 'That is the sum, not the product.') },
        ],
        solution: ['12 · 5', '60'],
      },
      {
        expr: <Row size="big" align="center">{'a = 7,5,  h = 4'}</Row>,
        ok: L("Ha. Yetti nuqta besh ko'paytirilgan to'rt, o'ttiz.", 'Да. Семь целых пять умножить на четыре, тридцать.', 'Yes. Seven point five times four, thirty.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '30' },
          { id: 'b', label: '11,5', hint: L("Bu yig'indi, ko'paytma emas.", 'Это сумма, а не произведение.', 'That is the sum, not the product.') },
        ],
        solution: ['7,5 · 4', '30'],
      },
      {
        expr: <Row size="big" align="center">{'a = 15,  h = 6'}</Row>,
        ok: L("Ha. O'n besh ko'paytirilgan olti, to'qson.", 'Да. Пятнадцать умножить на шесть, девяносто.', 'Yes. Fifteen times six, ninety.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '90' },
          { id: 'b', label: '21', hint: L("Bu yig'indi, ko'paytma emas.", 'Это сумма, а не произведение.', 'That is the sum, not the product.') },
        ],
        solution: ['15 · 6', '90'],
      },
      {
        expr: <Row size="big" align="center">{'a = 20,  h = 3,5'}</Row>,
        ok: L("Ha. Yigirma ko'paytirilgan uch nuqta besh, yetmish.", 'Да. Двадцать умножить на три целых пять, семьдесят.', 'Yes. Twenty times three point five, seventy.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '70' },
          { id: 'b', label: '23,5', hint: L("Bu yig'indi, ko'paytma emas.", 'Это сумма, а не произведение.', 'That is the sum, not the product.') },
        ],
        solution: ['20 · 3,5', '70'],
      },
      {
        expr: <Row size="big" align="center">{'a = 9,  h = 9'}</Row>,
        ok: L("Ha. To'qqiz ko'paytirilgan to'qqiz, sakson bir.", 'Да. Девять умножить на девять, восемьдесят один.', 'Yes. Nine times nine, eighty-one.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '81' },
          { id: 'b', label: '18', hint: L("Bu yig'indi, ko'paytma emas.", 'Это сумма, а не произведение.', 'That is the sum, not the product.') },
        ],
        solution: ['9 · 9', '81'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): ikkinchi balandlikni topish
// (1-masala uslubi, 77-bet).
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З84',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Yuzadan ikkinchi balandlikni toping",
    'Найди вторую высоту по площади',
    'Find the second height from the area',
  ),
  audio: [
    A('mount',
      "Bitta asos va balandlik berilgan. Ikkinchi asos uchun balandlik izlanadi.",
      'Даны одно основание и высота. Ищется высота для второго основания.',
      'One base and height are given. The height for the second base is sought.'),
    A('why',
      "Avval yuza topiladi, keyin ikkinchi asosga bo'linadi.",
      'Сначала находится площадь, потом делится на второе основание.',
      'First the area is found, then divided by the second base.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar yuza orqali ikkinchi balandlik topilgan.",
      'Все три разобраны. Каждый раз вторая высота находилась через площадь.',
      'All three are done. Each time the second height was found through the area.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'25, 20,  h₂₅ = 8'}</Row>,
        ok: L("Ha. Yigirma besh ko'paytirilgan sakkiz, ikki yuz, yigirmaga bo'linsa, o'n.", 'Да. Двадцать пять умножить на восемь, двести, разделить на двадцать, десять.', 'Yes. Twenty-five times eight is two hundred, divided by twenty is ten.'),
        question: L("Yigirmalik asosga mos balandlik qancha?", 'Какова высота, соответствующая основанию двадцать?', 'What is the height matching the base of twenty?'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '8', hint: L("Bu birinchi balandlik, ikkinchisi emas.", 'Это первая высота, а не вторая.', 'That is the first height, not the second.') },
        ],
        solution: ['25 · 8', '200', '200 : 20', '10'],
      },
      {
        expr: <Row size="big" align="center">{'18, 12,  h₁₈ = 6'}</Row>,
        ok: L("Ha. O'n sakkiz ko'paytirilgan olti, yuz sakkiz, o'n ikkiga bo'linsa, to'qqiz.", 'Да. Восемнадцать умножить на шесть, сто восемь, разделить на двенадцать, девять.', 'Yes. Eighteen times six is a hundred eight, divided by twelve is nine.'),
        question: L("O'n ikkilik asosga mos balandlik qancha?", 'Какова высота, соответствующая основанию двенадцать?', 'What is the height matching the base of twelve?'),
        items: [
          { id: 'a', right: true, label: '9' },
          { id: 'b', label: '6', hint: L("Bu birinchi balandlik, ikkinchisi emas.", 'Это первая высота, а не вторая.', 'That is the first height, not the second.') },
        ],
        solution: ['18 · 6', '108', '108 : 12', '9'],
      },
      {
        expr: <Row size="big" align="center">{'30, 24,  h₃₀ = 4'}</Row>,
        ok: L("Ha. O'ttiz ko'paytirilgan to'rt, yuz yigirma, yigirma to'rtga bo'linsa, besh.", 'Да. Тридцать умножить на четыре, сто двадцать, разделить на двадцать четыре, пять.', 'Yes. Thirty times four is a hundred twenty, divided by twenty-four is five.'),
        question: L("Yigirma to'rtlik asosga mos balandlik qancha?", 'Какова высота, соответствующая основанию двадцать четыре?', 'What is the height matching the base of twenty-four?'),
        items: [
          { id: 'a', right: true, label: '5' },
          { id: 'b', label: '4', hint: L("Bu birinchi balandlik, ikkinchisi emas.", 'Это первая высота, а не вторая.', 'That is the first height, not the second.') },
        ],
        solution: ['30 · 4', '120', '120 : 24', '5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): yuzani son bilan
// tekshirish (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Yuzani son bilan tekshiring",
    'Проверь площадь вычислением',
    'Check the area by computation',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida taklif qilingan javobni tekshiring.",
      'Три задания. В каждом проверь предложенный ответ.',
      'Three tasks. In each, check the proposed answer.'),
    A('why',
      "Asosni balandlikka ko'paytirib, natijani solishtiring.",
      'Умножь основание на высоту и сравни результат.',
      'Multiply the base by the height and compare the result.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло ответ.',
      'All three are done. Each time computation checked the answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 14,  h = 5   →   S = 70'}</Row>,
        ok: L("Ha. O'n to'rt ko'paytirilgan besh, rostdan ham yetmish.", 'Да. Четырнадцать умножить на пять, действительно семьдесят.', 'Yes. Fourteen times five is indeed seventy.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, o'n to'rt besh marta, yetmish chiqadi.", 'Посчитай, четырнадцать взять пять раз, выходит семьдесят.', 'Compute it, fourteen taken five times comes to seventy.') },
        ],
        solution: ['14 · 5', '70'],
      },
      {
        expr: <Row size="big" align="center">{'a = 16,  h = 5   →   S = 84'}</Row>,
        ok: L("Yo'q. O'n olti ko'paytirilgan besh, sakson chiqadi, sakson to'rt emas.", 'Нет. Шестнадцать умножить на пять, выходит восемьдесят, а не восемьдесят четыре.', 'No. Sixteen times five is eighty, not eighty-four.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, sakkan chiqishi kerak.", 'Посчитай снова, должно выйти восемьдесят.', 'Compute it again, it should come to eighty.') },
        ],
        solution: ['16 · 5', '80'],
      },
      {
        expr: <Row size="big" align="center">{'a = 11,  h = 9   →   S = 99'}</Row>,
        ok: L("Ha. O'n bir ko'paytirilgan to'qqiz, rostdan ham to'qson to'qqiz.", 'Да. Одиннадцать умножить на девять, действительно девяносто девять.', 'Yes. Eleven times nine is indeed ninety-nine.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, o'n bir to'qqiz marta, to'qson to'qqiz chiqadi.", 'Посчитай, одиннадцать взять девять раз, выходит девяносто девять.', 'Compute it, eleven taken nine times comes to ninety-nine.') },
        ],
        solution: ['11 · 9', '99'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): ikki tomon
// ko'paytirilgan (З83) va balandlik qayta hisoblanmagan (З84).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З83',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato javobda nima noto'g'ri",
    'Что неверно в двух ошибочных ответах',
    'What is wrong in two mistaken answers',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham parallelogrammning yuzi noto'g'ri topilgan.",
      'Два задания. В обоих площадь параллелограмма найдена неверно.',
      'Two tasks. In both, the area of the parallelogram was found incorrectly.'),
    A('why',
      "Yon tomon balandlik bilan chalkashtirilmasligi va balandlik har asosga qayta hisoblanishi kerak.",
      'Боковую сторону нельзя путать с высотой, а высоту нужно пересчитывать для каждого основания.',
      'The side must not be confused with the height, and the height must be recomputed for each base.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham balandlikni chalkashtirishdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за путаницы с высотой.',
      'Both are done. Both mistakes came from confusing the height.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'10, 6, 4   →   S = 10 · 6 = 60'}</Row>,
        ok: L("Ha. Olti bu yon tomon, balandlik emas, ko'paytirilishi kerak bo'lgan son to'rt edi.", 'Да. Шесть это боковая сторона, а не высота, умножать нужно было на четыре.', 'Yes. Six is the side, not the height, four should have been multiplied instead.'),
        question: L("Asos o'n, yon tomon olti, balandlik to'rt bo'lsa, va yuza yuqoridagicha hisoblangan bo'lsa, bu yerda xato qayerda?", 'Если основание десять, боковая сторона шесть, высота четыре, а площадь посчитана как выше, в чём здесь ошибка?', 'If the base is ten, the side is six, the height is four, and the area was computed as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Yon tomon balandlik o'rniga ko'paytirilgan", 'Боковая сторона умножена вместо высоты', 'The side was multiplied instead of the height') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, olti yon tomon, balandlik to'rt edi.", 'Это и есть показанная ошибка, шесть, боковая сторона, высота была четыре.', 'This is the very mistake shown; six is the side, the height was four.') },
        ],
        solution: ['10 · 4', '40'],
      },
      {
        expr: <Row size="big" align="center">{'8, h = 5, S = 40   →   10, h = 5, S = 10 · 5 = 50'}</Row>,
        ok: L("Ha. Ikkinchi asos boshqa, shuning uchun balandlik ham boshqa, yuzadan qayta hisoblanishi kerak, besh emas.", 'Да. Второе основание другое, значит и высота другая, её нужно пересчитать из площади, не пять.', 'Yes. The second base is different, so the height is different too, it must be recomputed from the area, not five.'),
        question: L("Birinchi asos sakkiz uchun balandlik besh, yuza qirq topilgan, keyin o'nlik asos uchun ham balandlik besh deb olingan bo'lsa, bu yerda xato qayerda?", 'Для первого основания восемь высота пять, площадь найдена сорок, а затем для основания десять высоту снова взяли пять — в чём здесь ошибка?', 'For the first base eight the height is five, the area found is forty, and then for the base ten the height was again taken as five — where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Birinchi balandlik ikkinchi asosga qayta hisoblanmasdan ishlatilgan", 'Первая высота использована для второго основания без пересчёта', 'The first height was used for the second base without recomputing') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, yuza qirq bo'lib qolishi kerak, ellik emas.", 'Это и есть показанная ошибка, площадь должна остаться сорок, а не пятьдесят.', 'This is the very mistake shown; the area should stay forty, not fifty.') },
        ],
        solution: ['40 : 10', '4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): S = a · h ni qadamlab
// hisoblash.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З83',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Asos va balandlikdan yuzani qadamlab hisoblang",
    'Вычисли площадь по основанию и высоте, по шагам',
    'Compute the area from the base and height, step by step',
  ),
  audio: [
    A('mount',
      "Asos va balandlik berilgan. Ularni ko'paytirib, yuzani topamiz.",
      'Даны основание и высота. Перемножив их, находим площадь.',
      'The base and height are given. Multiplying them gives the area.'),
    A('why',
      "Bu qadam har doim bir xil, faqat sonlar o'zgaradi.",
      'Этот шаг всегда одинаков, меняются только числа.',
      'This step is always the same, only the numbers change.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar asos balandlikka ko'paytirilgan.",
      'Все три заполнены. Каждый раз основание умножалось на высоту.',
      'All three are filled. Each time the base was multiplied by the height.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['8', '48'],
      lines: [
        [{ t: 'a = 6, h = ' }, { slot: '8' }, { t: '   →   S = ' }, { slot: '48' }],
      ],
    },
    tasks: [
      {
        chips: ['7', '35'],
        lines: [
          [{ t: 'a = 5, h = ' }, { slot: '7' }, { t: '   →   S = ' }, { slot: '35' }],
        ],
      },
      {
        chips: ['9', '108'],
        lines: [
          [{ t: 'a = 12, h = ' }, { slot: '9' }, { t: '   →   S = ' }, { slot: '108' }],
        ],
      },
      {
        chips: ['4,5', '54'],
        lines: [
          [{ t: 'a = 12, h = ' }, { slot: '4,5' }, { t: '   →   S = ' }, { slot: '54' }],
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
    "Parallelogrammning yuzi bo'yicha to'rt savol",
    'Четыре вопроса о площади параллелограмма',
    'Four questions about the area of the parallelogram',
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
        id: 'q1', tag: 'З83',
        ask: L('Asos 6, yon tomon 9, balandlik 4 bo\'lsa, yuzi qancha?', 'Если основание 6, боковая сторона 9, высота 4, чему равна площадь?', 'If the base is 6, the side is 9, the height is 4, what is the area?'),
        options: [
          { id: 'ok', right: true, label: '24' },
          { id: 'no', label: '54' },
        ],
        hint: L("Balandlik to'rt, yon tomon to'qqiz emas, balandlik ko'paytiriladi.", 'Высота четыре, а не боковая сторона девять, умножается высота.', 'The height is four, not the side nine; the height is multiplied.'),
        ok: L("To'g'ri, olti ko'paytirilgan to'rt, yigirma to'rt.", 'Верно, шесть умножить на четыре, двадцать четыре.', 'Correct, six times four, twenty-four.'),
      },
      {
        id: 'q2', tag: 'З84',
        ask: L('Yuzi 60 bo\'lgan parallelogrammning bir asosi 10, unga mos balandligi qancha?', 'Если площадь параллелограмма 60, одно основание 10, чему равна соответствующая высота?', 'If the area of a parallelogram is 60, one base is 10, what is the matching height?'),
        options: [
          { id: 'ok', right: true, label: '6' },
          { id: 'no', label: '50' },
        ],
        hint: L("Oltmishni o'nga bo'ling.", 'Раздели шестьдесят на десять.', 'Divide sixty by ten.'),
        ok: L("To'g'ri, oltmish o'nga bo'linsa, olti.", 'Верно, шестьдесят, делённое на десять, шесть.', 'Correct, sixty divided by ten is six.'),
      },
      {
        id: 'q3', tag: 'З83',
        ask: L('Parallelogrammning yuzi ikki tomoni ko\'paytmasiga tengmi?', 'Верно ли, что площадь параллелограмма равна произведению двух сторон?', 'Is it true that the area of a parallelogram equals the product of two sides?'),
        options: [
          { id: 'ok', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'no', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Asos va balandlik ko'paytiriladi, ikki tomon emas.", 'Умножаются основание и высота, а не две стороны.', 'The base and the height are multiplied, not two sides.'),
        ok: L("To'g'ri, yon tomon balandlik bilan bir xil emas.", 'Верно, боковая сторона не то же самое, что высота.', 'Correct, the side is not the same as the height.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('12 ko\'paytirilgan 7, 84ga tengmi?', 'Верно ли, что 12, умноженное на 7, равно 84?', 'Is it true that 12 times 7 equals 84?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, natija sakson to'rt chiqadi.", 'Посчитай, результат восемьдесят четыре.', 'Compute it, the result is eighty-four.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З84',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Yuzi 72, asosi 8 bo'lgan parallelogrammning balandligini yig'ing.",
            'Собери высоту параллелограмма с площадью 72 и основанием 8.',
            'Assemble the height of a parallelogram with area 72 and base 8.',
          ),
          lines: [
            [{ t: 'S = 72, a = 8   →   h = ' }, { slot: '9' }],
          ],
          tiles: [
            { id: 't1', v: '9', x: 12, y: 12 },
            { id: 't2', v: '64', x: 60, y: 14 },
            { id: 't3', v: '80', x: 30, y: 50 },
            { id: 't4', v: '576', x: 78, y: 48 },
          ],
          hint: L(
            "Yetmish ikkini sakkizga bo'ling.",
            'Раздели семьдесят два на восемь.',
            'Divide seventy-two by eight.',
          ),
          doneNote: L(
            "Yig'ildi. Yuza asosga bo'linsa, mos balandlik topiladi.",
            'Собрано. Площадь, делённая на основание, даёт соответствующую высоту.',
            'Assembled. The area divided by the base gives the matching height.',
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
    "Asos va balandlik ko'paytiriladi, yon tomonning o'zi emas",
    'Перемножаются основание и высота, а не сама боковая сторона',
    'The base and the height are multiplied, not the side itself',
  ),
  audio: [
    A('s0',
      "Darsdan bitta chertyozh qoladi. Parallelogramm kesib ko'chirilsa, to'g'ri to'rtburchakka aylanadi.",
      'С урока остаётся один чертёж. Отрезав и передвинув, параллелограмм становится прямоугольником.',
      'One drawing stays with you. Cut and shifted, the parallelogram becomes a rectangle.'),
    A('s1',
      "Bugun uch narsa qilindi. Formulani isbotladingiz, kesib ko'chirib chertyozhda ko'rdingiz va bir parallelogrammda ikki xil asos-balandlik bir xil yuza berishini bildingiz.",
      'Сегодня сделано три вещи. Ты доказал формулу, увидел это на чертеже через разрезание, и узнал, что в одном параллелограмме две разные пары основание-высота дают одну площадь.',
      'Three things are done today. You proved the formula, saw it on the drawing by cutting, and learned that two different base-height pairs in one parallelogram give the same area.'),
    A('s2',
      "Keyingi darsda uchburchakning yuzi. Xuddi shu kesib ko'chirish usuli yordam beradi.",
      'В следующем уроке площадь треугольника. Тот же способ разрезания поможет.',
      'The next lesson covers the area of the triangle. The same cutting method will help.',
    ),
  ],
  props: {
    mark: 'S = a · h',
    markNote: L(
      "asos to'qqiz, balandlik olti, yuza ellik to'rt",
      'основание девять, высота шесть, площадь пятьдесят четыре',
      'base nine, height six, area fifty-four',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: uchburchakning yuzi",
      'Следующий урок: площадь треугольника',
      'Next lesson: the area of the triangle',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
