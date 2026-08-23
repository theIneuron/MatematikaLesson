// ============================================================================
// 8-sinf, Dars 41. UCHBURCHAKNING YUZI.
//
// BLOK Б6. Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`, `prooflines.jsx`,
// `areacut.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da. Yangi pribor
// YO'Q — `AreaCut` (Dars 40) shu darsda TESKARI yo'nalishda ishlatiladi:
// uchburchak ikkilanib parallelogrammga to'ldiriladi, shu parallelogramm
// kesib ko'chirilib to'g'ri to'rtburchakka aylanadi, so'ngra natija ikkiga
// bo'linib uchburchakning yuzi topiladi.
//
// KARKAS: Dars 37-40 dagidek, SCREENS to'g'ridan-to'g'ri qurilgan.
//
// MANBA: 8-sinf geometriya darsligi, 2-§ (YUZLAR), 22-mavzu (79-80-bet).
// Barcha teorema, natija va misollar darslikdan:
//   - teorema: S = ½ a · h, isbot uchburchakni ABDC parallelogrammga
//     to'ldirib (diagonal BC), dars 37 ning natijasi (diagonal teng ikki
//     uchburchakka bo'ladi) va dars 40 ning formulasi (S = a·h) orqali;
//   - 1-natija: to'g'ri burchakli uchburchakning yuzi ikki katetning
//     yarim ko'paytmasiga teng (bir katet asos, ikkinchisi balandlik);
//   - 5-natija: asoslari va balandliklari teng uchburchaklar tengdosh;
//   - 1-masala (80-bet): mediana uchburchakni ikkita tengdosh
//     uchburchakka bo'ladi (umumiy balandlik, teng asoslar);
//   - 2-masala (80-bet): to'g'ri to'rtburchak, AC=20 sm, BP=12 sm
//     (BP perp AC) — S(ABC)=0,5·20·12=120, S(ABCD)=2·120=240 sm².
//
// ADASHISHLAR, ikkitasi yangi:
//   З85, formulada ikkiga bo'lish unutilgan (S = a·h deb hisoblangan,
//   parallelogramm formulasi bilan chalkashtirilgan);
//   З86, to'g'ri burchakli uchburchakda GIPOTENUZA asos yoki balandlik
//   sifatida olingan, katetlar o'rniga;
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
  id: 'geo-8-41',
  n: 41,
  row: 46,
  block: 'Б6',
  topic: L("Uchburchakning yuzi", 'Площадь треугольника', 'The area of the triangle'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Uchburchakning yuzi asosi bilan unga mos balandligi ko'paytmasining yarmiga teng, S = ½ a · h",
    'Площадь треугольника равна половине произведения основания на соответствующую высоту, S = ½ a · h',
    'The area of a triangle equals half the product of the base and the matching height, S = ½ a · h',
  ),
  L(
    "To'g'ri burchakli uchburchakning yuzi ikki katetning yarim ko'paytmasiga teng",
    'Площадь прямоугольного треугольника равна половине произведения двух катетов',
    'The area of a right triangle equals half the product of the two legs',
  ),
  L(
    "Asoslari va balandliklari teng bo'lgan uchburchaklar tengdosh",
    'Треугольники с равными основаниями и равными высотами равновелики',
    'Triangles with equal bases and equal heights are equal in area',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З85': {
    what: L(
      "formulada ikkiga bo'lish unutilgan, S = a · h deb hisoblangan",
      'в формуле забыто деление на два, площадь принята равной a · h',
      'the division by two was forgotten in the formula, the area was taken as a · h',
    ),
    wrong: null,
    at: 12,
  },
  'З86': {
    what: L(
      "to'g'ri burchakli uchburchakda gipotenuza asos yoki balandlik sifatida olingan, katetlar o'rniga",
      'в прямоугольном треугольнике гипотенуза взята как основание или высота вместо катетов',
      'in a right triangle the hypotenuse was taken as the base or height instead of the legs',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (3-ekran, ProofLines). ABC uchburchak, D shunday
// nuqta, ABDC parallelogramm bo'ladi, BC diagonal.
// ============================================================
const TRI_D = { A: [20, 90], B: [45, 30], D: [110, 30], C: [85, 90] }
const TRI_D_ORDER = ['A', 'B', 'D', 'C']

// ============================================================
// SAHNALAR (§6). Xuk: bergan asos-balandlikdan yuza qanday topiladi.
// Yakun: uchburchak parallelogrammning yarmi.
// ============================================================
const SC_ASK = L('YARMI QANCHA', 'СКОЛЬКО ПОЛОВИНА', 'HOW MUCH IS HALF')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <polygon points="130,90 175,35 240,90" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="185" cy="70" r="15" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="185" y="76" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Uchburchak ikkilansa, parallelogramm chiqadi",
      'Треугольник, удвоенный, даёт параллелограмм',
      'The triangle, doubled, gives a parallelogram',
    )}>
      <polygon points="130,85 155,35 240,35 215,85" fill="none" stroke={T.ink2} strokeWidth="1.2"/>
      <line x1="155" y1="35" x2="215" y2="85" stroke={T.graph} strokeWidth="1.4"/>
      <g className="g8-seat" style={{ '--d': '1300ms' }}>
        <text x="185" y="105" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.ok}>{'S = ½ a · h'}</text>
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
    "Asosi o'n, balandligi olti bo'lgan uchburchakning yuzi qanday topiladi",
    'Как найти площадь треугольника с основанием десять и высотой шесть',
    'How is the area found for a triangle with base ten and height six',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Uchburchakning asosi o'n, balandligi olti.",
      'Основание треугольника десять, высота шесть.',
      'The triangle\'s base is ten, the height is six.'),
    A('why',
      "Taxmin qiling, yuzi qanday son chiqadi.",
      'Предположи, каким получится площадь.',
      'Predict what the area will be.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, yuzi qanday son bo'ladi?",
      'Как думаешь, какой будет площадь?',
      'What do you think the area will be?',
    ),
    items: [
      { id: 'a', show: '60' },
      { id: 'b', show: '30' },
      { id: 'c', show: '16' },
      { id: 'd', show: '8' },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Parallelogrammning yuzi (dars 40 dan).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Parallelogrammning yuzini eslash",
    'Вспоминаем площадь параллелограмма',
    'Recalling the area of the parallelogram',
  ),
  audio: [
    A('mount',
      "O'tgan darsda parallelogrammning yuzi formulasi chiqarilgan edi.",
      'На прошлом уроке была выведена формула площади параллелограмма.',
      'Last lesson, the formula for the area of the parallelogram was derived.'),
    A('why',
      "Bugun bu formuladan uchburchak uchun foydalanamiz.",
      'Сегодня воспользуемся этой формулой для треугольника.',
      'Today we will use this formula for the triangle.'),
  ],
  props: {
    ask: L(
      "Parallelogrammning asosi a, balandligi h bo'lsa, yuzi qanday topiladi?",
      'Если основание параллелограмма a, высота h, как найти площадь?',
      'If the base of a parallelogram is a, the height h, how is the area found?',
    ),
    items: [
      { id: 'right', show: 'S = a · h', right: true, name: L('asos balandlikka ko\'paytiriladi', 'основание умножается на высоту', 'the base is multiplied by the height') },
      {
        id: 'wrong1', show: 'S = ½ a · h',
        hint: L("Bu uchburchak uchun, parallelogramm uchun ikkiga bo'linmaydi.", 'Это для треугольника, для параллелограмма деления на два нет.', 'That is for a triangle; for a parallelogram there is no dividing by two.'),
      },
      {
        id: 'wrong2', show: 'S = 2(a + h)',
        hint: L("Bu perimetrga o'xshash yozuv, yuza emas.", 'Это похоже на периметр, а не на площадь.', 'That looks like a perimeter, not an area.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun shu formuladan uchburchakning yuzini chiqarib olamiz.",
      'Верно. Сегодня выведем из неё площадь треугольника.',
      'Correct. Today we will derive the triangle\'s area from it.',
    ),
  },
}

// ============================================================
// EKRAN 3. ISBOT (`prooflines`). Teorema: S = ½ a · h.
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З85',
  eyebrow: L('FORMULANI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ФОРМУЛУ', 'PROVING THE FORMULA'),
  title: L(
    "Uchburchakning yuzi asosi bilan balandligi ko'paytmasining yarmiga teng",
    'Площадь треугольника равна половине произведения основания на высоту',
    'The area of a triangle equals half the product of the base and the height',
  ),
  audio: [
    A('mount',
      "ABC uchburchak. D shunday nuqta olinadi, ABDC parallelogramm bo'ladi.",
      'Треугольник ABC. Берётся такая точка D, что ABDC становится параллелограммом.',
      'Triangle ABC. A point D is taken so that ABDC becomes a parallelogram.'),
    A('why',
      "Diagonal BC parallelogrammni ikkita teng uchburchakka bo'ladi, dars 37 dagidek.",
      'Диагональ BC делит параллелограмм на два равных треугольника, как на уроке 37.',
      'The diagonal BC splits the parallelogram into two equal triangles, as in lesson 37.'),
  ],
  props: {
    points: TRI_D,
    order: TRI_D_ORDER,
    marks: [['B', 'C']],
    given: [
      L("ABDC, parallelogramm, AC asos", 'ABDC, параллелограмм, AC основание', 'ABDC, a parallelogram, AC the base'),
      L("BC, diagonal", 'BC, диагональ', 'BC, the diagonal'),
    ],
    goal: L("S(ABC) = ½ AC · h", 'S(ABC) = ½ AC · h', 'S(ABC) = ½ AC · h'),
    lines: [
      {
        text: L("uchburchak ABC uchburchak DCB ga teng", 'треугольник ABC равен треугольнику DCB', 'triangle ABC equals triangle DCB'),
        options: [
          { id: 'ok', right: true, label: L("Parallelogrammning diagonali uni ikkita teng uchburchakka bo'ladi", 'Диагональ параллелограмма делит его на два равных треугольника', 'The diagonal of a parallelogram splits it into two equal triangles') },
          { id: 'no', label: L("Ular teng, chunki yuzlari bir xil ko'rinadi", 'Они равны, потому что площади выглядят одинаково', 'They are equal because the areas look alike'), hint: L("Ko'rinish sabab emas, dars 37 dagi teoremadan foydalaning.", 'Внешний вид не причина, используй теорему из урока 37.', 'Appearance is not the reason, use the theorem from lesson 37.') },
        ],
      },
      {
        text: L("S(ABC) teng S(DCB) ga", 'S(ABC) равна S(DCB)', 'S(ABC) equals S(DCB)'),
        options: [
          { id: 'ok', right: true, label: L("Teng uchburchaklar tengdosh (teng yuzli)", 'Равные треугольники равновелики (равны по площади)', 'Equal triangles are equal in area') },
          { id: 'no', label: L("Chunki BC ikkalasiga ham umumiy tomon", 'Потому что BC общая сторона у обоих', 'Because BC is a common side of both'), hint: L("Umumiy tomonning o'zi yetarli emas, teng uchburchaklar ekanidan foydalaning.", 'Общей стороны недостаточно, используй, что треугольники равны.', 'A common side alone is not enough, use that the triangles are equal.') },
        ],
      },
      {
        text: L("S(ABDC) teng 2 ko'paytirilgan S(ABC) ga", 'S(ABDC) равна двум, умноженным на S(ABC)', 'S(ABDC) equals two times S(ABC)'),
        options: [
          { id: 'ok', right: true, label: L("ABDC ikkita teng yuzli uchburchakdan tashkil topgan", 'ABDC состоит из двух равновеликих треугольников', 'ABDC is made of two equal-area triangles') },
          { id: 'no', label: L("Chunki ABDC parallelogramm", 'Потому что ABDC параллелограмм', 'Because ABDC is a parallelogram'), hint: L("Parallelogramm bo'lishining o'zi yetarli emas, uni tashkil qiluvchi uchburchaklardan foydalaning.", 'Того, что это параллелограмм, недостаточно, используй составляющие его треугольники.', 'Being a parallelogram alone is not enough, use the triangles that make it up.') },
        ],
      },
      {
        text: L("shuning uchun S(ABC) teng ikkidan bir AC ko'paytirilgan h ga", 'поэтому S(ABC) равна одной второй AC, умноженной на h', 'therefore S(ABC) equals one half of AC times h'),
        options: [
          { id: 'ok', right: true, label: L("ABDC ning yuzi AC ko'paytirilgan h (dars 40), ABC esa uning yarmi", 'Площадь ABDC равна AC на h (урок 40), а ABC её половина', 'The area of ABDC is AC times h (lesson 40), and ABC is half of it') },
          { id: 'no', label: L("Chunki AC asos deb tanlangan", 'Потому что AC выбрана основанием', 'Because AC was chosen as the base'), hint: L("Asos bo'lishning o'zi yetarli emas, parallelogrammning yuzidan foydalaning.", 'Того, что это основание, недостаточно, используй площадь параллелограмма.', 'Being the base alone is not enough, use the area of the parallelogram.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. Parallelogrammning yuzi AC ko'paytirilgan h, uchburchak esa aynan uning yarmi.",
      'Доказано. Площадь параллелограмма AC на h, а треугольник, ровно её половина.',
      'Proven. The area of the parallelogram is AC times h, and the triangle is exactly half of it.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI IKKITA SON (1-darsning `pick`). To'g'ri burchakli
// uchburchak, katetlar asos-balandlik sifatida. Ловушка, gipotenuza
// olingan (З86).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З86',
  eyebrow: L('QAYSI IKKITA SON', 'КАКИЕ ДВА ЧИСЛА', 'WHICH TWO NUMBERS'),
  title: L(
    "To'g'ri burchakli uchburchakda qaysi ikki tomon ko'paytiriladi",
    'В прямоугольном треугольнике какие две стороны перемножаются',
    'In a right triangle, which two sides are multiplied',
  ),
  audio: [
    A('mount',
      "To'g'ri burchakli uchburchakda bir katetni asos, ikkinchisini balandlik qilib olish mumkin.",
      'В прямоугольном треугольнике один катет можно взять основанием, другой высотой.',
      'In a right triangle, one leg can be taken as the base, the other as the height.'),
    A('why',
      "Ular bir-biriga perpendikulyar, shuning uchun ikkinchi katet birinchisiga balandlik bo'ladi.",
      'Они перпендикулярны друг другу, поэтому второй катет служит высотой первому.',
      'They are perpendicular to each other, so the second leg serves as the height to the first.'),
  ],
  props: {
    ask: L(
      "Katetlari 6 va 8, gipotenuzasi 10 bo'lgan to'g'ri burchakli uchburchakning yuzini topish uchun qaysi ikki son ko'paytiriladi?",
      'Чтобы найти площадь прямоугольного треугольника с катетами 6 и 8 и гипотенузой 10, какие два числа перемножаются?',
      'To find the area of a right triangle with legs 6 and 8 and hypotenuse 10, which two numbers are multiplied?',
    ),
    items: [
      { id: 'right', show: '6, 8', right: true, name: L('ikki katet, ular perpendikulyar', 'два катета, они перпендикулярны', 'the two legs, they are perpendicular') },
      {
        id: 'wrong1', show: '8, 10',
        hint: L("O'n gipotenuza, u katetlarga balandlik bo'lmaydi, hisoblash qiyinlashadi.", 'Десять это гипотенуза, она не служит высотой катетам, вычисление усложняется.', 'Ten is the hypotenuse, it does not serve as the height to the legs, the computation gets harder.'),
      },
      {
        id: 'wrong2', show: '6, 10',
        hint: L("O'n gipotenuza, katetlar bilan bevosita ko'paytirilmaydi.", 'Десять это гипотенуза, её нельзя прямо перемножать с катетом.', 'Ten is the hypotenuse, it cannot be directly multiplied with a leg.'),
      },
    ],
    after: L(
      "To'g'ri. Ikki katet bir-biriga perpendikulyar, shuning uchun bevosita asos va balandlik bo'la oladi.",
      'Верно. Два катета перпендикулярны друг другу, поэтому прямо служат основанием и высотой.',
      'Correct. The two legs are perpendicular to each other, so they directly serve as the base and height.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI (`areacut`, dars 40 dan qayta). Uchburchak
// ikkilanib parallelogrammga to'ldiriladi, keyin to'g'ri to'rtburchakka
// aylanadi, natija ikkiga bo'linadi.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'areacut',
  tag: 'З85',
  eyebrow: L('IKKILANTIRING, KO\'CHIRING, BO\'LING', 'УДВОЙ, ПЕРЕДВИНЬ, РАЗДЕЛИ', 'DOUBLE, SLIDE, HALVE'),
  title: L(
    "Uchburchakni ikkilab, to'g'ri to'rtburchakka aylantiring",
    'Удвой треугольник и получи прямоугольник',
    'Double the triangle and turn it into a rectangle',
  ),
  audio: [
    A('mount',
      "Uchburchak ikkilanib, asosi to'qqiz, balandligi olti bo'lgan parallelogramm hosil qilingan.",
      'Треугольник удвоен, получен параллелограмм с основанием девять и высотой шесть.',
      'The triangle is doubled, giving a parallelogram with base nine and height six.'),
    A('why',
      "Tugmani bosib, parallelogrammni to'g'ri to'rtburchakka aylantiring.",
      'Нажимай кнопку, чтобы превратить параллелограмм в прямоугольник.',
      'Press the button to turn the parallelogram into a rectangle.'),
    W('cut',
      "To'g'ri to'rtburchak chiqdi. Uning yuzi parallelogrammning yuzi, uchburchak esa aynan uning yarmi.",
      'Получился прямоугольник. Его площадь, это площадь параллелограмма, а треугольник, ровно её половина.',
      'A rectangle came out. Its area is the parallelogram\'s area, and the triangle is exactly half of it.'),
  ],
  props: {
    base: 9,
    height: 6,
    shiftStart: 4,
    shiftMax: 4,
    shiftStep: 2,
    ask: L("Tugmani ikki marta bosing", 'Нажми кнопку два раза', 'Press the button twice'),
    after: L(
      "Parallelogrammning yuzi ellik to'rt. Bu, ikkilangan uchburchak, shuning uchun uchburchakning yuzi ikkiga bo'linadi.",
      'Площадь параллелограмма пятьдесят четыре. Это удвоенный треугольник, поэтому площадь треугольника делится на два.',
      'The area of the parallelogram is fifty-four. This is the doubled triangle, so the triangle\'s area is divided by two.',
    ),
    fields: [
      {
        ask: L("Uchburchakning o'zining yuzi nechchiga teng?", 'Чему равна площадь самого треугольника?', 'What is the area of the triangle itself?'),
        kind: 'number',
        answer: '27',
        accepts: ['27'],
        hints: {
          '54': L("Bu parallelogrammning yuzi, uchburchak esa aynan uning yarmi, ikkiga bo'ling.", 'Это площадь параллелограмма, а треугольник, ровно её половина, раздели на два.', 'That is the parallelogram\'s area; the triangle is exactly half of it, divide by two.'),
        },
      },
    ],
    note: L(
      "Ellik to'rt ikkiga bo'linsa, yigirma yetti.",
      'Пятьдесят четыре, делённое на два, двадцать семь.',
      'Fifty-four divided by two is twenty-seven.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): to'g'ri burchakli
// uchburchak yuzini ikki xil qarashda tekshirish.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З86',
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "To'g'ri burchakli uchburchak yuzini ikki xil qarashda tekshirish",
    'Проверить площадь прямоугольного треугольника двумя способами',
    'Checking the area of a right triangle in two ways',
  ),
  audio: [
    A('mount',
      "Katetlari olti va sakkiz. Ikki yo'l bir xil yuzani beradi.",
      'Катеты шесть и восемь. Два пути дают одну площадь.',
      'The legs are six and eight. Two ways give the same area.'),
    W('w2',
      "Birinchi yo'lda formula S teng ikkidan bir a ko'paytirilgan h to'g'ridan-to'g'ri qo'llaniladi.",
      'В первом пути формула площадь равна одной второй a на h применяется прямо.',
      'In the first way, the formula area equals one half a times h is applied directly.'),
    W('w4',
      "Ikkinchi yo'lda uchburchak ikkilanib, to'rtburchak yuzi topilib, keyin ikkiga bo'linadi.",
      'Во втором пути треугольник удваивается, находится площадь прямоугольника, потом делится на два.',
      'In the second way, the triangle is doubled, the rectangle\'s area is found, then divided by two.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL, FORMULA', 'СПОСОБ 1, ФОРМУЛА', 'METHOD 1, THE FORMULA'),
        lead: L(
          "Katetlarni to'g'ridan-to'g'ri formulaga qo'yamiz",
          'Подставляем катеты прямо в формулу',
          'We substitute the legs directly into the formula',
        ),
        rows: [
          { text: '½ · 6 · 8' },
          { text: L("yigirma to'rt chiqadi", 'выходит двадцать четыре', 'comes out to twenty-four'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL, IKKILANTIRISH', 'СПОСОБ 2, УДВОЕНИЕ', 'METHOD 2, DOUBLING'),
        lead: L(
          "Uchburchakni ikkilab, to'rtburchak hosil qilamiz",
          'Удваиваем треугольник, получаем прямоугольник',
          'We double the triangle, forming a rectangle',
        ),
        rows: [
          { text: '6 · 8 = 48,   48 : 2' },
          { text: L("yana yigirma to'rt chiqadi", 'снова выходит двадцать четыре', 'again comes out to twenty-four'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL YUZA BERDI', 'ОБА ДАЛИ ОДНУ ПЛОЩАДЬ', 'BOTH GAVE THE SAME AREA'),
        lead: L(
          "Formula tezroq, ikkilantirish esa nega ishlashini ko'rsatadi",
          'Формула быстрее, а удвоение показывает, почему это работает',
          'The formula is faster, doubling shows why it works',
        ),
        rows: [{ text: '24', tone: 'ok' }],
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
  tag: 'З85',
  eyebrow: L('FORMULANING UCH QISMI', 'ТРИ ЧАСТИ ФОРМУЛЫ', 'THE THREE PARTS OF THE FORMULA'),
  title: L(
    "Formulaning uch qismi",
    'Три части формулы',
    'The three parts of the formula',
  ),
  audio: [
    A('mount',
      "Bir formula, uch qism. Birinchisi hech qachon unutilmasligi kerak.",
      'Одна формула, три части. Первую нельзя забывать.',
      'One formula, three parts. The first must never be forgotten.'),
    W('p2',
      "Ikkidan bir, chunki uchburchak parallelogrammning aynan yarmi.",
      'Одна вторая, потому что треугольник, ровно половина параллелограмма.',
      'One half, because the triangle is exactly half of the parallelogram.'),
    W('p4',
      "Asos va balandlik esa parallelogrammdagidek, biri boshqasiga perpendikulyar.",
      'Основание и высота, как и в параллелограмме, одно перпендикулярно другому.',
      'The base and height, as in the parallelogram, one perpendicular to the other.',
    ),
  ],
  props: {
    tokens: [
      { t: 'S  =  ½  ·  ', id: 'half' },
      { t: 'a', id: 'a' },
      { t: '  ·  ', id: 'mid' },
      { t: 'h', id: 'b' },
    ],
    steps: [
      {
        focus: 'half',
        text: L(
          "Birinchi qism, ikkidan bir. Bu parallelogrammdan farqi, va u hech qachon tushib qolmasligi kerak.",
          'Первая часть, одна вторая. В этом отличие от параллелограмма, и её нельзя терять.',
          'The first part, one half. This is the difference from the parallelogram, and it must never be dropped.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Ikkinchi qism, asos. Istalgan tomon bo'lishi mumkin.",
          'Вторая часть, основание. Может быть любой стороной.',
          'The second part, the base. It can be any side.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qism, balandlik. Aynan shu asosga perpendikulyar masofa.",
          'Третья часть, высота. Именно перпендикулярное расстояние к этому основанию.',
          'The third part, the height. Exactly the perpendicular distance to that base.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Formulani boshqacha ham o'qish mumkin: uchburchakning yuzi uning o'rta chizig'i bilan balandligining ko'paytmasiga teng, chunki o'rta chiziq asosning yarmiga teng.",
        'Формулу можно прочитать иначе: площадь треугольника равна произведению его средней линии на высоту, ведь средняя линия равна половине основания.',
        'The formula can be read another way: the area of a triangle equals its midline times the height, since the midline equals half the base.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Darslik 22-mavzu teoremasi
// va natijalari.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З85',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Uchburchakning yuzi",
    'Площадь треугольника',
    'The area of the triangle',
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
      { id: 'f1', label: L("uchburchakning yuzi asos ko'paytirilgan balandlikning yarmiga teng, S = ½ a · h", 'площадь треугольника равна половине основания на высоту, S = ½ a · h', 'the area of a triangle equals half the base times the height, S = ½ a · h') },
      { id: 'f2', label: L("to'g'ri burchakli uchburchakda ikki katet bevosita asos va balandlik bo'ladi", 'в прямоугольном треугольнике два катета прямо служат основанием и высотой', 'in a right triangle the two legs directly serve as the base and height') },
      { id: 'f3', label: L("asoslari va balandliklari teng uchburchaklar tengdosh", 'треугольники с равными основаниями и высотами равновелики', 'triangles with equal bases and heights are equal in area') },
      { id: 'w1', label: L("uchburchakning yuzi S = a · h formulasi bilan topiladi", 'площадь треугольника находится по формуле S = a · h', 'the area of a triangle is found by the formula S = a · h') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Bu parallelogramm formulasi, uchburchak uning YARMI, ikkiga bo'lish shart.",
      'Так не складывается. Это формула параллелограмма, треугольник, его ПОЛОВИНА, деление на два обязательно.',
      'That does not fit. That is the parallelogram formula; the triangle is HALF of it, dividing by two is required.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 2-§, 22-mavzu asosida (79-80-bet)",
        'Правило на основе геометрии, § 2, тема 22 учебника (стр. 79-80)',
        'The rule is based on geometry, section 2, topic 22 of the textbook (pages 79-80)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Parallelogrammning formulasidan uchburchak uchun qanday foydalanishni bilmasdik",
        'Мы не знали, как использовать формулу параллелограмма для треугольника',
        'We did not know how to use the parallelogram\'s formula for the triangle',
      ),
      right: L(
        "endi uchburchak parallelogrammning aynan yarmi ekanini bilamiz",
        'теперь знаем, что треугольник, ровно половина параллелограмма',
        'now we know the triangle is exactly half the parallelogram',
      ),
      winner: 'right',
      note: L(
        "Asos ko'paytirilgan balandlik, keyin ikkiga bo'linadi",
        'Основание на высоту, затем делится на два',
        'The base times the height, then divided by two',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): S = ½ a · h to'g'ridan-to'g'ri
// hisoblash.
// ============================================================
const ASK_AREA = L("Yuzi qancha?", 'Чему равна площадь?', 'What is the area?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З85',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Asos va balandlikdan uchburchak yuzini hisoblang",
    'Вычисли площадь треугольника по основанию и высоте',
    'Compute the area of the triangle from the base and height',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida asos va balandlik berilgan.",
      'Пять заданий. В каждом даны основание и высота.',
      'Five tasks. In each, the base and height are given.'),
    A('why',
      "Ko'paytmani ikkiga bo'lishni unutmang.",
      'Не забывай делить произведение на два.',
      'Do not forget to divide the product by two.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar ko'paytma ikkiga bo'lingan.",
      'Все пять разобраны. Каждый раз произведение делилось на два.',
      'All five are done. Each time the product was divided by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 10,  h = 6'}</Row>,
        ok: L("Ha. O'n ko'paytirilgan olti, oltmish, ikkiga bo'linsa, o'ttiz.", 'Да. Десять умножить на шесть, шестьдесят, разделить на два, тридцать.', 'Yes. Ten times six is sixty, divided by two is thirty.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '30' },
          { id: 'b', label: '60', hint: L("Ikkiga bo'lish unutilgan.", 'Забыто деление на два.', 'Dividing by two was forgotten.') },
        ],
        solution: ['10 · 6', '60', '60 : 2', '30'],
      },
      {
        expr: <Row size="big" align="center">{'a = 14,  h = 5'}</Row>,
        ok: L("Ha. O'n to'rt ko'paytirilgan besh, yetmish, ikkiga bo'linsa, o'ttiz besh.", 'Да. Четырнадцать умножить на пять, семьдесят, разделить на два, тридцать пять.', 'Yes. Fourteen times five is seventy, divided by two is thirty-five.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '35' },
          { id: 'b', label: '70', hint: L("Ikkiga bo'lish unutilgan.", 'Забыто деление на два.', 'Dividing by two was forgotten.') },
        ],
        solution: ['14 · 5', '70', '70 : 2', '35'],
      },
      {
        expr: <Row size="big" align="center">{'a = 9,  h = 8'}</Row>,
        ok: L("Ha. To'qqiz ko'paytirilgan sakkiz, yetmish ikki, ikkiga bo'linsa, o'ttiz olti.", 'Да. Девять умножить на восемь, семьдесят два, разделить на два, тридцать шесть.', 'Yes. Nine times eight is seventy-two, divided by two is thirty-six.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '36' },
          { id: 'b', label: '72', hint: L("Ikkiga bo'lish unutilgan.", 'Забыто деление на два.', 'Dividing by two was forgotten.') },
        ],
        solution: ['9 · 8', '72', '72 : 2', '36'],
      },
      {
        expr: <Row size="big" align="center">{'a = 16,  h = 4,5'}</Row>,
        ok: L("Ha. O'n olti ko'paytirilgan to'rt nuqta besh, yetmish ikki, ikkiga bo'linsa, o'ttiz olti.", 'Да. Шестнадцать умножить на четыре целых пять, семьдесят два, разделить на два, тридцать шесть.', 'Yes. Sixteen times four point five is seventy-two, divided by two is thirty-six.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '36' },
          { id: 'b', label: '72', hint: L("Ikkiga bo'lish unutilgan.", 'Забыто деление на два.', 'Dividing by two was forgotten.') },
        ],
        solution: ['16 · 4,5', '72', '72 : 2', '36'],
      },
      {
        expr: <Row size="big" align="center">{'a = 7,  h = 7'}</Row>,
        ok: L("Ha. Yetti ko'paytirilgan yetti, qirq to'qqiz, ikkiga bo'linsa, yigirma to'rt nuqta besh.", 'Да. Семь умножить на семь, сорок девять, разделить на два, двадцать четыре целых пять.', 'Yes. Seven times seven is forty-nine, divided by two is twenty-four point five.'),
        question: ASK_AREA,
        items: [
          { id: 'a', right: true, label: '24,5' },
          { id: 'b', label: '49', hint: L("Ikkiga bo'lish unutilgan.", 'Забыто деление на два.', 'Dividing by two was forgotten.') },
        ],
        solution: ['7 · 7', '49', '49 : 2', '24,5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): to'g'ri burchakli uchburchak,
// katetlar orqali (1-natija).
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З86',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "To'g'ri burchakli uchburchak yuzini katetlar orqali hisoblang",
    'Вычисли площадь прямоугольного треугольника через катеты',
    'Compute the area of a right triangle through the legs',
  ),
  audio: [
    A('mount',
      "Uch to'g'ri burchakli uchburchak. Har birida ikki katet berilgan.",
      'Три прямоугольных треугольника. В каждом даны два катета.',
      'Three right triangles. In each, two legs are given.'),
    A('why',
      "Gipotenuza berilgan bo'lsa ham, u ishlatilmaydi, faqat katetlar ko'paytiriladi.",
      'Даже если дана гипотенуза, она не используется, перемножаются только катеты.',
      'Even if the hypotenuse is given, it is not used, only the legs are multiplied.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar faqat ikki katet ko'paytirilgan.",
      'Все три разобраны. Каждый раз перемножались только два катета.',
      'All three are done. Each time only the two legs were multiplied.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'6, 8, 10'}</Row>,
        ok: L("Ha. Olti ko'paytirilgan sakkiz, qirq sakkiz, ikkiga bo'linsa, yigirma to'rt.", 'Да. Шесть умножить на восемь, сорок восемь, разделить на два, двадцать четыре.', 'Yes. Six times eight is forty-eight, divided by two is twenty-four.'),
        question: L("Katetlar olti va sakkiz, gipotenuza o'n bo'lsa, yuzi qancha?", 'Если катеты шесть и восемь, гипотенуза десять, чему равна площадь?', 'If the legs are six and eight, the hypotenuse ten, what is the area?'),
        items: [
          { id: 'a', right: true, label: '24' },
          { id: 'b', label: '40', hint: L("Gipotenuza ishlatilmaydi, faqat ikki katet ko'paytiriladi.", 'Гипотенуза не используется, перемножаются только два катета.', 'The hypotenuse is not used, only the two legs are multiplied.') },
        ],
        solution: ['6 · 8', '48', '48 : 2', '24'],
      },
      {
        expr: <Row size="big" align="center">{'9, 12, 15'}</Row>,
        ok: L("Ha. To'qqiz ko'paytirilgan o'n ikki, yuz sakkiz, ikkiga bo'linsa, ellik to'rt.", 'Да. Девять умножить на двенадцать, сто восемь, разделить на два, пятьдесят четыре.', 'Yes. Nine times twelve is a hundred eight, divided by two is fifty-four.'),
        question: L("Katetlar to'qqiz va o'n ikki, gipotenuza o'n besh bo'lsa, yuzi qancha?", 'Если катеты девять и двенадцать, гипотенуза пятнадцать, чему равна площадь?', 'If the legs are nine and twelve, the hypotenuse fifteen, what is the area?'),
        items: [
          { id: 'a', right: true, label: '54' },
          { id: 'b', label: '90', hint: L("Gipotenuza ishlatilmaydi, faqat ikki katet ko'paytiriladi.", 'Гипотенуза не используется, перемножаются только два катета.', 'The hypotenuse is not used, only the two legs are multiplied.') },
        ],
        solution: ['9 · 12', '108', '108 : 2', '54'],
      },
      {
        expr: <Row size="big" align="center">{'5, 12, 13'}</Row>,
        ok: L("Ha. Besh ko'paytirilgan o'n ikki, oltmish, ikkiga bo'linsa, o'ttiz.", 'Да. Пять умножить на двенадцать, шестьдесят, разделить на два, тридцать.', 'Yes. Five times twelve is sixty, divided by two is thirty.'),
        question: L("Katetlar besh va o'n ikki, gipotenuza o'n uch bo'lsa, yuzi qancha?", 'Если катеты пять и двенадцать, гипотенуза тринадцать, чему равна площадь?', 'If the legs are five and twelve, the hypotenuse thirteen, what is the area?'),
        items: [
          { id: 'a', right: true, label: '30' },
          { id: 'b', label: '32,5', hint: L("Gipotenuza ishlatilmaydi, faqat ikki katet ko'paytiriladi.", 'Гипотенуза не используется, перемножаются только два катета.', 'The hypotenuse is not used, only the two legs are multiplied.') },
        ],
        solution: ['5 · 12', '60', '60 : 2', '30'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): 2-masala uslubi
// (80-bet), javobni son bilan tekshirish (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "To'g'ri to'rtburchak yuzini diagonal orqali tekshiring",
    'Проверь площадь прямоугольника через диагональ',
    'Check the area of a rectangle through the diagonal',
  ),
  audio: [
    A('mount',
      "To'g'ri to'rtburchakning diagonali unga ikkita teng uchburchak beradi.",
      'Диагональ прямоугольника даёт два равных треугольника.',
      'A rectangle\'s diagonal gives two equal triangles.'),
    A('why',
      "Bitta uchburchak yuzi topilib, ikkilansa, to'g'ri to'rtburchakning yuzi chiqadi.",
      'Найдя площадь одного треугольника и удвоив, получаем площадь прямоугольника.',
      'Finding one triangle\'s area and doubling gives the rectangle\'s area.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar bitta uchburchak yuzasi ikkilanib tekshirilgan.",
      'Все три разобраны. Каждый раз площадь одного треугольника удваивалась для проверки.',
      'All three are done. Each time one triangle\'s area was doubled to check.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'AC = 20,  BP = 12,  BP ⊥ AC'}</Row>,
        ok: L("Ha. Yigirma ko'paytirilgan o'n ikki, ikki yuz qirq, to'g'ri to'rtburchakning yuzi.", 'Да. Двадцать умножить на двенадцать, двести сорок, площадь прямоугольника.', 'Yes. Twenty times twelve is two hundred forty, the rectangle\'s area.'),
        question: L("To'g'ri to'rtburchakning yuzi 240ga tengmi?", 'Верно ли, что площадь прямоугольника равна 240?', 'Is it true that the rectangle\'s area equals 240?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Uchburchak yuzi 0,5 ko'paytirilgan yigirma ko'paytirilgan o'n ikki, yuz yigirma, ikkilansa ikki yuz qirq.", 'Площадь треугольника, 0,5 на двадцать на двенадцать, сто двадцать, удвоенная, двести сорок.', 'The triangle\'s area is 0.5 times twenty times twelve, a hundred twenty, doubled is two hundred forty.') },
        ],
        solution: ['0,5 · 20 · 12', '120', '2 · 120', '240'],
      },
      {
        expr: <Row size="big" align="center">{'AC = 16,  BP = 9,  BP ⊥ AC'}</Row>,
        ok: L("Ha. O'n olti ko'paytirilgan to'qqiz, yuz qirq to'rt, to'g'ri to'rtburchakning yuzi.", 'Да. Шестнадцать умножить на девять, сто сорок четыре, площадь прямоугольника.', 'Yes. Sixteen times nine is a hundred forty-four, the rectangle\'s area.'),
        question: L("To'g'ri to'rtburchakning yuzi 144ga tengmi?", 'Верно ли, что площадь прямоугольника равна 144?', 'Is it true that the rectangle\'s area equals 144?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Uchburchak yuzi yetmish ikki, ikkilansa yuz qirq to'rt.", 'Площадь треугольника семьдесят два, удвоенная, сто сорок четыре.', 'The triangle\'s area is seventy-two, doubled is a hundred forty-four.') },
        ],
        solution: ['0,5 · 16 · 9', '72', '2 · 72', '144'],
      },
      {
        expr: <Row size="big" align="center">{'AC = 25,  BP = 14,  BP ⊥ AC'}</Row>,
        ok: L("Yo'q. Yigirma besh ko'paytirilgan o'n to'rt, uch yuz ellik, to'g'ri to'rtburchakning yuzi.", 'Нет. Двадцать пять умножить на четырнадцать, триста пятьдесят, площадь прямоугольника.', 'No. Twenty-five times fourteen is three hundred fifty, the rectangle\'s area.'),
        question: L("To'g'ri to'rtburchakning yuzi 300ga tengmi?", 'Верно ли, что площадь прямоугольника равна 300?', 'Is it true that the rectangle\'s area equals 300?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, uch yuz ellik chiqishi kerak, uch yuz emas.", 'Посчитай снова, должно выйти триста пятьдесят, а не триста.', 'Compute it again, it should come to three hundred fifty, not three hundred.') },
        ],
        solution: ['0,5 · 25 · 14', '175', '2 · 175', '350'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): ikkiga bo'lish
// unutilgan (З85) va gipotenuza olingan (З86).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З85',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato javobda nima noto'g'ri",
    'Что неверно в двух ошибочных ответах',
    'What is wrong in two mistaken answers',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham uchburchakning yuzi noto'g'ri topilgan.",
      'Два задания. В обоих площадь треугольника найдена неверно.',
      'Two tasks. In both, the triangle\'s area was found incorrectly.'),
    A('why',
      "Ikkiga bo'lish unutilmasligi va gipotenuza katet o'rniga olinmasligi kerak.",
      'Нельзя забывать деление на два и нельзя брать гипотенузу вместо катета.',
      'The division by two must not be forgotten, and the hypotenuse must not be taken instead of a leg.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham formulaning bir qismini chalkashtirishdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за путаницы в одной части формулы.',
      'Both are done. Both mistakes came from confusing one part of the formula.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 10,  h = 7   →   S = 10 · 7 = 70'}</Row>,
        ok: L("Ha. Bu ko'paytmaning o'zi, ikkiga bo'linmagan, to'g'ri javob o'ttiz besh.", 'Да. Это само произведение, не разделённое на два, верный ответ тридцать пять.', 'Yes. That is the product itself, not divided by two, the correct answer is thirty-five.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ikkiga bo'lish unutilgan", 'Забыто деление на два', 'The division by two was forgotten') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, natija ikkiga bo'linishi kerak edi.", 'Это и есть показанная ошибка, результат нужно было разделить на два.', 'This is the very mistake shown; the result should have been divided by two.') },
        ],
        solution: ['70 : 2', '35'],
      },
      {
        expr: <Row size="big" align="center">{'9, 12, 15   →   S = 0,5 · 12 · 15 = 90'}</Row>,
        ok: L("Ha. O'n besh gipotenuza, u katet o'rniga olinmasligi kerak edi, ikki katet ko'paytirilishi kerak edi.", 'Да. Пятнадцать это гипотенуза, её нельзя было брать вместо катета, нужно было перемножить два катета.', 'Yes. Fifteen is the hypotenuse, it should not have been taken instead of a leg, the two legs should have been multiplied.'),
        question: L("Katetlar to'qqiz va o'n ikki, gipotenuza o'n besh bo'lgan uchburchakda yuza yuqoridagicha hisoblangan bo'lsa, bu yerda xato qayerda?", 'Если в треугольнике с катетами девять и двенадцать, гипотенузой пятнадцать, площадь посчитана как выше, в чём здесь ошибка?', 'If in a triangle with legs nine and twelve, hypotenuse fifteen, the area was computed as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Gipotenuza katet o'rniga ko'paytirilgan", 'Гипотенуза умножена вместо катета', 'The hypotenuse was multiplied instead of a leg') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, o'n besh gipotenuza, u ishlatilmasligi kerak.", 'Это и есть показанная ошибка, пятнадцать, гипотенуза, её нельзя использовать.', 'This is the very mistake shown; fifteen is the hypotenuse, it must not be used.') },
        ],
        solution: ['0,5 · 9 · 12', '54'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): S = ½ a · h ni
// qadamlab hisoblash.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З85',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Asos va balandlikdan uchburchak yuzini qadamlab toping",
    'Найди площадь треугольника по основанию и высоте, по шагам',
    'Find the area of the triangle from the base and height, step by step',
  ),
  audio: [
    A('mount',
      "Asos va balandlik berilgan. Avval ko'paytiriladi, keyin ikkiga bo'linadi.",
      'Даны основание и высота. Сначала перемножаются, потом делятся на два.',
      'The base and height are given. First they are multiplied, then divided by two.'),
    A('why',
      "Ikkiga bo'lish qadami hech qachon tushib qolmasligi kerak.",
      'Шаг деления на два никогда не должен пропадать.',
      'The step of dividing by two must never be dropped.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar ko'paytma ikkiga bo'lingan.",
      'Все три заполнены. Каждый раз произведение делилось на два.',
      'All three are filled. Each time the product was divided by two.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['48', '24'],
      lines: [
        [{ t: 'a = 8, h = 6   →   8 · 6 = ' }, { slot: '48' }, { t: '   →   S = ' }, { slot: '24' }],
      ],
    },
    tasks: [
      {
        chips: ['30', '15'],
        lines: [
          [{ t: 'a = 6, h = 5   →   6 · 5 = ' }, { slot: '30' }, { t: '   →   S = ' }, { slot: '15' }],
        ],
      },
      {
        chips: ['70', '35'],
        lines: [
          [{ t: 'a = 10, h = 7   →   10 · 7 = ' }, { slot: '70' }, { t: '   →   S = ' }, { slot: '35' }],
        ],
      },
      {
        chips: ['54', '27'],
        lines: [
          [{ t: 'a = 9, h = 6   →   9 · 6 = ' }, { slot: '54' }, { t: '   →   S = ' }, { slot: '27' }],
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
    "Uchburchakning yuzi bo'yicha to'rt savol",
    'Четыре вопроса о площади треугольника',
    'Four questions about the area of the triangle',
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
        id: 'q1', tag: 'З85',
        ask: L('Asos 12, balandlik 5 bo\'lsa, uchburchakning yuzi qancha?', 'Если основание 12, высота 5, чему равна площадь треугольника?', 'If the base is 12, the height is 5, what is the area of the triangle?'),
        options: [
          { id: 'ok', right: true, label: '30' },
          { id: 'no', label: '60' },
        ],
        hint: L("Oltmish faqat ko'paytma, ikkiga bo'lish unutilgan.", 'Шестьдесят это только произведение, забыто деление на два.', 'Sixty is only the product, dividing by two was forgotten.'),
        ok: L("To'g'ri, oltmish ikkiga bo'linsa, o'ttiz.", 'Верно, шестьдесят, делённое на два, тридцать.', 'Correct, sixty divided by two is thirty.'),
      },
      {
        id: 'q2', tag: 'З86',
        ask: L('Katetlari 5 va 12, gipotenuzasi 13 bo\'lgan uchburchakning yuzi qancha?', 'Чему равна площадь треугольника с катетами 5 и 12 и гипотенузой 13?', 'What is the area of a triangle with legs 5 and 12 and hypotenuse 13?'),
        options: [
          { id: 'ok', right: true, label: '30' },
          { id: 'no', label: '32,5' },
        ],
        hint: L("Faqat ikki katet ko'paytiriladi, gipotenuza ishlatilmaydi.", 'Перемножаются только два катета, гипотенуза не используется.', 'Only the two legs are multiplied, the hypotenuse is not used.'),
        ok: L("To'g'ri, besh ko'paytirilgan o'n ikki, ikkiga bo'linsa, o'ttiz.", 'Верно, пять умножить на двенадцать, разделить на два, тридцать.', 'Correct, five times twelve, divided by two, thirty.'),
      },
      {
        id: 'q3', tag: 'З85',
        ask: L('Uchburchakning yuzi S = a · h formulasi bilan topiladimi?', 'Верно ли, что площадь треугольника находится по формуле S = a · h?', 'Is it true that the area of a triangle is found by the formula S = a · h?'),
        options: [
          { id: 'ok', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'no', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Bu parallelogramm formulasi, uchburchak uning yarmi.", 'Это формула параллелограмма, треугольник, его половина.', 'That is the parallelogram formula, the triangle is half of it.'),
        ok: L("To'g'ri, uchburchakda ikkiga bo'lish qo'shiladi.", 'Верно, у треугольника добавляется деление на два.', 'Correct, for a triangle the division by two is added.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('0,5 ko\'paytirilgan 14, so\'ngra 6ga, 42ga tengmi?', 'Верно ли, что 0,5, умноженное на 14, затем на 6, равно 42?', 'Is it true that 0.5 times 14, then times 6, equals 42?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, o'n to'rt olti marta yetmish to'rt, yarmi qirq ikki.", 'Посчитай, четырнадцать на шесть, восемьдесят четыре, половина сорок два.', 'Compute it, fourteen times six is eighty-four, half is forty-two.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З86',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Katetlari 8 va 15 bo'lgan to'g'ri burchakli uchburchakning yuzini yig'ing.",
            'Собери площадь прямоугольного треугольника с катетами 8 и 15.',
            'Assemble the area of a right triangle with legs 8 and 15.',
          ),
          lines: [
            [{ t: '8, 15   →   S = ' }, { slot: '60' }],
          ],
          tiles: [
            { id: 't1', v: '60', x: 12, y: 12 },
            { id: 't2', v: '120', x: 60, y: 14 },
            { id: 't3', v: '23', x: 30, y: 50 },
            { id: 't4', v: '17', x: 78, y: 48 },
          ],
          hint: L(
            "Sakkiz ko'paytirilgan o'n besh, yuz yigirma, so'ngra ikkiga bo'ling.",
            'Восемь умножить на пятнадцать, сто двадцать, потом раздели на два.',
            'Eight times fifteen is a hundred twenty, then divide by two.',
          ),
          doneNote: L(
            "Yig'ildi. Ikki katet ko'paytirilib, natija ikkiga bo'lindi.",
            'Собрано. Два катета перемножены, результат разделён на два.',
            'Assembled. The two legs were multiplied, the result divided by two.',
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
    "Asos ko'paytirilgan balandlik, keyin ikkiga bo'linadi",
    'Основание на высоту, затем делится на два',
    'The base times the height, then divided by two',
  ),
  audio: [
    A('s0',
      "Darsdan bitta chertyozh qoladi. Uchburchak ikkilansa, parallelogramm chiqadi.",
      'С урока остаётся один чертёж. Треугольник, удвоенный, даёт параллелограмм.',
      'One drawing stays with you. The triangle, doubled, gives a parallelogram.'),
    A('s1',
      "Bugun uch narsa qilindi. Formulani parallelogrammdan chiqarib oldingiz, to'g'ri burchakli uchburchak uchun katetlarni to'g'ridan-to'g'ri ishlatishni ko'rdingiz va ikkiga bo'lishni hech qachon unutmaslikni bildingiz.",
      'Сегодня сделано три вещи. Ты вывел формулу из параллелограмма, увидел, что в прямоугольном треугольнике катеты используются прямо, и узнал, что деление на два нельзя забывать.',
      'Three things are done today. You derived the formula from the parallelogram, saw that in a right triangle the legs are used directly, and learned never to forget the division by two.'),
    A('s2',
      "Keyingi darsda trapetsiyaning yuzi. Xuddi shu kesib ko'chirish usuli yana yordam beradi.",
      'В следующем уроке площадь трапеции. Тот же способ разрезания снова поможет.',
      'The next lesson covers the area of the trapezoid. The same cutting method will help again.',
    ),
  ],
  props: {
    mark: 'S = ½ a · h',
    markNote: L(
      "asos to'qqiz, balandlik olti, parallelogramm ellik to'rt, uchburchak yigirma yetti",
      'основание девять, высота шесть, параллелограмм пятьдесят четыре, треугольник двадцать семь',
      'base nine, height six, parallelogram fifty-four, triangle twenty-seven',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: trapetsiyaning yuzi",
      'Следующий урок: площадь трапеции',
      'Next lesson: the area of the trapezoid',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
