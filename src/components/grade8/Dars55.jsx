// ============================================================================
// 8-sinf, Dars 55. VEKTOR KOORDINATALARI, SKALYAR KO'PAYTMA.
//
// BLOK Б7NING, VA BUTUN 8-SINF GEOMETRIYA KURSINING SO'NGGI DARSI. Bu fayl,
// FAQAT MA'LUMOT. Mexanika `screens.jsx`, `tools.jsx`, `feed.jsx`,
// `method.jsx` da. YANGI PRIBOR YO'Q — bu dars sof algebraik (koordinatalar
// ustida amallar), geometrik chertyozh pribori kerak emas, shuning uchun
// faqat matn/son asboblari (`pick`, `parts`, `twoways`, `drill`, `fill`,
// `blitz`, `rulebuild`, `takeaway`) ishlatilgan.
//
// MANBA: 8-sinf geometriya darsligi, 5-§ (VEKTORLAR), 44-46-mavzu (142-149-bet):
//   - 44-mavzu (142-143-bet), VEKTOR KOORDINATALARI: birlik vektorlar i (Ox
//     bo'yicha), j (Oy bo'yicha); a=x·i+y·j, qisqacha a(x;y). A1(x1;y1),
//     A2(x2;y2) bo'lsa, A1A2 vektorining koordinatalari (x2−x1; y2−y1) —
//     OXIRINING koordinatalaridan BOSHINING koordinatalari ayiriladi;
//   - 45-mavzu (144-146-bet), KOORDINATALAR USTIDA AMALLAR: a(x1;y1),
//     b(x2;y2) bo'lsa, a+b(x1+x2; y1+y2), a−b(x1−x2; y1−y2), k·a(kx1; ky1)
//     — har amal mos koordinatalar ustida bajariladi;
//   - 46-mavzu (146-147-bet), SKALYAR KO'PAYTMA: a(x1;y1) va b(x2;y2)
//     vektorlarining skalyar ko'paytmasi x1x2+y1y2 ga teng SON (vektor
//     emas, natija skalyar bo'lgani uchun shu nom berilgan); a·a=a²
//     (skalyar kvadrat), |a|=kvadrat ildiz(a²)=kvadrat ildiz(x1²+y1²) —
//     Pifagor teoremasining vektor ko'rinishi. Masala: a(−12;5) → |a|=13.
//
// DARSLIKDA YO'Q, shuning uchun bu darsda ham YO'Q (metodist qarori kerak
// bo'lsa qaytiladi): koordinatalar orqali kollinearlik mezoni, perpendiku-
// lyarlik mezoni (skalyar ko'paytma nolga teng), va vektorlar orasidagi
// burchak formulasi. 47-mavzu (fizik talqin, 148-149-bet) hisoblashsiz,
// sof tasviriy bo'lgani uchun amaliyotga kiritilmadi. 152-154-betdagi
// "kursni takrorlash" 616-620-mashqlardan tashqari BUTUN 8-sinf
// planimetriyasini qamraydi (parallelogramm, trapetsiya, aylana va h.k.) —
// bir darsga sig'maydi, shuning uchun bu dars FAQAT vektor qismini
// yakunlaydi, kursning umumiy takrorlanishi alohida masala.
//
// ADASHISHLAR, ikkitasi yangi:
//   З116, vektor koordinatalarini topishda tartib teskarilangan, boshi
//   koordinatalaridan oxiri koordinatalari ayirilgan (aksincha kerak);
//   З117, skalyar ko'paytma NATIJASI son ekani unutilgan, u juft son
//   (vektor) sifatida yozilgan;
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
  id: 'geo-8-55',
  n: 55,
  row: 60,
  block: 'Б7',
  topic: L("Vektor koordinatalari, skalyar ko'paytma", 'Координаты вектора, скалярное произведение', 'Vector coordinates, the dot product'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Vektorning koordinatalari, uning oxiri koordinatalaridan boshi koordinatalarini ayirish natijasi: A(x1;y1), B(x2;y2) bo'lsa, AB⃗(x2−x1; y2−y1)",
    'Координаты вектора получаются вычитанием координат его начала из координат его конца: A(x1;y1), B(x2;y2), значит AB⃗(x2−x1; y2−y1)',
    "A vector's coordinates come from subtracting the coordinates of its start from the coordinates of its end: A(x1;y1), B(x2;y2), so AB⃗(x2−x1; y2−y1)",
  ),
  L(
    "Koordinatalar bilan berilgan vektorlar ustida qo'shish, ayirish va songa ko'paytirish, mos koordinatalar ustida bajariladi",
    'Сложение, вычитание и умножение на число для векторов, заданных координатами, выполняются над соответствующими координатами',
    'Addition, subtraction, and multiplication by a number, for vectors given by coordinates, are carried out on the matching coordinates',
  ),
  L(
    "a(x1;y1) va b(x2;y2) vektorlarining skalyar ko'paytmasi x1x2+y1y2 ga teng SON; |a| = kvadrat ildiz(x1²+y1²)",
    'Скалярное произведение векторов a(x1;y1) и b(x2;y2) равно ЧИСЛУ x1x2+y1y2; |a| = корень из x1²+y1²',
    'The dot product of vectors a(x1;y1) and b(x2;y2) equals the NUMBER x1x2+y1y2; |a| = the root of x1²+y1²',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З116': {
    what: L(
      "vektor koordinatalarini topishda tartib teskarilangan, boshi koordinatalaridan oxiri koordinatalari ayirilgan",
      'при нахождении координат вектора порядок был перепутан, из координат начала вычли координаты конца',
      "when finding a vector's coordinates the order was reversed, the end's coordinates were subtracted from the start's",
    ),
    wrong: null,
    at: 12,
  },
  'З117': {
    what: L(
      "skalyar ko'paytma natijasi son ekani unutilgan, u juft son, ya'ni vektor sifatida yozilgan",
      'забыли, что результат скалярного произведения число, его записали как пару чисел, то есть как вектор',
      'it was forgotten that the dot product result is a number, it was written as a pair, that is, as a vector',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: ikki nuqta koordinatasidan vektor koordinatasi.
// ============================================================
const SC_ASK = L('VEKTOR KOORDINATALARI', 'КООРДИНАТЫ ВЕКТОРА', 'VECTOR COORDINATES')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <circle cx="150" cy="90" r="2.4" fill={T.ink}/>
      <text x="150" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink}>A</text>
      <circle cx="205" cy="35" r="2.4" fill={T.ink}/>
      <text x="205" y="27" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink}>B</text>
      <line x1="150" y1="90" x2="199" y2="41" stroke={T.ink3} strokeWidth="1.6"/>
      <polygon points="199,41 191,42 194,49" fill={T.ink3}/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="215" cy="75" r="10" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.2"/>
        <text x="215" y="79" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Oxiridan boshini ayirasiz",
      'Из конца вычитаешь начало',
      'You subtract the start from the end',
    )}>
      <text x="185" y="65" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13" fontWeight="700" fill={T.ok}>{'AB⃗(x2−x1; y2−y1)'}</text>
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
  eyebrow: L('VEKTOR KOORDINATALARI', 'КООРДИНАТЫ ВЕКТОРА', 'VECTOR COORDINATES'),
  title: L(
    "A ikkiga beshda, B oltiga sakkizda turibdi. AB⃗ vektorining koordinatalari qanday bo'ladi deb o'ylaysiz",
    'A стоит в точке два, пять, B в точке шесть, восемь. Какими, по-твоему, будут координаты вектора AB⃗',
    'A stands at two, five, B at six, eight. What do you think the coordinates of vector AB⃗ will be',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Har bir nuqtaning o'z koordinatalari bor, xuddi manzil kabi.",
      'У каждой точки свои координаты, как у адреса.',
      'Every point has its own coordinates, like an address.'),
    A('why',
      "Taxmin qiling, ikki nuqta koordinatasidan vektor koordinatasi qanday topiladi.",
      'Предположи, как из координат двух точек находятся координаты вектора.',
      'Predict how the coordinates of a vector are found from the coordinates of two points.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, AB⃗ vektorining koordinatalari qanday topiladi?",
      'Как думаешь, как находятся координаты вектора AB⃗?',
      'What do you think, how are the coordinates of vector AB⃗ found?',
    ),
    items: [
      { id: 'a', show: L("A dan B ning koordinatalari ayiriladi", 'Из A вычитаются координаты B', 'B\'s coordinates are subtracted from A') },
      { id: 'b', show: L("B dan A ning koordinatalari ayiriladi", 'Из B вычитаются координаты A', "A's coordinates are subtracted from B") },
      { id: 'c', show: L("Ikkalasi qo'shiladi", 'Обе складываются', 'Both are added') },
      { id: 'd', show: L("Aniqlab bo'lmaydi", 'Нельзя определить', 'It cannot be determined') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Pifagor teoremasini eslash (44-darsdan).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Pifagor teoremasini eslash",
    'Вспоминаем теорему Пифагора',
    "Recalling the Pythagorean theorem",
  ),
  audio: [
    A('mount',
      "To'g'ri burchakli uchburchakda gipotenuza katetlar bilan bog'langan edi.",
      'В прямоугольном треугольнике гипотенуза была связана с катетами.',
      'In a right triangle, the hypotenuse was related to the legs.'),
    A('why',
      "Bugun vektorning uzunligini xuddi shu bog'lanish orqali topamiz.",
      'Сегодня мы находим длину вектора через ту же связь.',
      "Today we find the length of a vector through this same relation."),
  ],
  props: {
    ask: L(
      "Pifagor teoremasiga ko'ra, gipotenuza katetlarga qanday bog'langan edi?",
      'По теореме Пифагора, как гипотенуза была связана с катетами?',
      'By the Pythagorean theorem, how was the hypotenuse related to the legs?',
    ),
    items: [
      { id: 'right', show: L("Gipotenuza kvadrati, katetlar kvadratlari yig'indisiga teng", 'Квадрат гипотенузы равен сумме квадратов катетов', 'The square of the hypotenuse equals the sum of the squares of the legs'), right: true, name: L("Pifagor teoremasi", 'теорема Пифагора', 'the Pythagorean theorem') },
      {
        id: 'wrong', show: L("Gipotenuza, katetlar yig'indisiga teng", 'Гипотенуза равна сумме катетов', 'The hypotenuse equals the sum of the legs'),
        hint: L("Bu to'g'ri emas, avval kvadratga oshiriladi, keyin yig'iladi, keyin ildiz olinadi.", 'Это неверно, сначала возводится в квадрат, потом складывается, потом извлекается корень.', 'That is not correct, first squared, then added, then the root is taken.'),
      },
    ],
    after: L(
      "To'g'ri. Vektorning koordinatalari xuddi shu ikki katetga o'xshaydi.",
      'Верно. Координаты вектора похожи на те же два катета.',
      "Correct. A vector's coordinates are like those same two legs.",
    ),
  },
}

// ============================================================
// EKRAN 3. QOIDANI QO'LLASH (`pick`). Ловушка, tartib teskarilanishi
// (З116).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З116',
  eyebrow: L("QOIDANI QO'LLASH", 'ПРИМЕНЯЕМ ПРАВИЛО', 'APPLYING THE RULE'),
  title: L(
    "A birga, minus birda; B to'rtga, uchda. AB⃗ ning koordinatalari qanday",
    'A стоит в точке один, минус один; B в точке четыре, три. Какими будут координаты AB⃗',
    'A stands at one, minus one; B at four, three. What are the coordinates of AB⃗',
  ),
  audio: [
    A('mount',
      "Qoidaga ko'ra, oxiri koordinatalaridan boshi koordinatalari ayiriladi.",
      'По правилу, из координат конца вычитаются координаты начала.',
      "By the rule, the start's coordinates are subtracted from the end's."),
    A('why',
      "B, vektorning oxiri, A esa boshi. Shuning uchun B dan A ayiriladi.",
      'B, конец вектора, а A начало. Поэтому из B вычитается A.',
      'B is the end of the vector, A is the start. So A is subtracted from B.'),
  ],
  props: {
    ask: L(
      "AB⃗ vektorining koordinatalari qanday bo'ladi?",
      'Какими будут координаты вектора AB⃗?',
      'What will the coordinates of vector AB⃗ be?',
    ),
    items: [
      { id: 'right', show: L("Uchga, to'rtda", 'Три, четыре', 'Three, four'), right: true, name: L("to'rtdan bir ayirilgan, uchdan minus bir ayirilgan", 'из четырёх вычли один, из трёх вычли минус один', 'one subtracted from four, minus one subtracted from three') },
      {
        id: 'wrong', show: L("Minus uchga, minus to'rtda", 'Минус три, минус четыре', 'Minus three, minus four'),
        hint: L("Bu tartib teskari, boshidan oxiri ayirilgan. Oxiridan boshi ayirilishi kerak.", 'Порядок перепутан, из начала вычли конец. Нужно из конца вычесть начало.', 'The order is reversed, the end was subtracted from the start. The start should be subtracted from the end.'),
      },
    ],
    after: L(
      "To'g'ri. Har doim oxiridan boshi ayiriladi, aksincha emas.",
      'Верно. Всегда из конца вычитается начало, а не наоборот.',
      'Correct. The start is always subtracted from the end, not the other way around.',
    ),
  },
}

// ============================================================
// EKRAN 4. UCH QISM (`parts`): AB⃗(x2−x1; y2−y1) formulasi.
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З116',
  eyebrow: L('UCH QISM', 'ТРИ ЧАСТИ', 'THREE PARTS'),
  title: L(
    "Vektor koordinatalari formulasining uch qismi",
    'Три части формулы координат вектора',
    'The three parts of the vector-coordinates formula',
  ),
  audio: [
    A('mount',
      "Chap tomonda vektorning o'zi turadi.",
      'Слева стоит сам вектор.',
      'On the left stands the vector itself.'),
    W('p2',
      "Birinchi koordinata, oxirining birinchisidan boshining birinchisi ayiriladi.",
      'Первая координата, из первой координаты конца вычитается первая координата начала.',
      "The first coordinate, the start's first coordinate is subtracted from the end's."),
    W('p4',
      "Ikkinchi koordinata xuddi shunday, ammo ikkinchi o'rin bilan.",
      'Вторая координата так же, но со вторым разрядом.',
      'The second coordinate the same way, but with the second position.',
    ),
  ],
  props: {
    tokens: [
      { t: 'AB⃗', id: 'mid' },
      { t: '(x2−x1; ', id: 'a' },
      { t: 'y2−y1)', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Chap tomonda topilishi kerak bo'lgan vektorning o'zi.",
          'Слева сам вектор, который нужно найти.',
          'On the left is the vector itself, the one to be found.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Birinchi o'rin, B ning birinchi o'rnidan A ning birinchi o'rni ayiriladi.",
          'Первый разряд, из первого разряда B вычитается первый разряд A.',
          "The first position, A's first position is subtracted from B's.",
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi o'rin xuddi shunday tartibda, oxiridan boshi.",
          'Второй разряд в том же порядке, из конца начало.',
          'The second position in the same order, the start from the end.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Agar vektorning boshi koordinatalar boshida bo'lsa, uning koordinatalari vektorning oxiri bo'lgan nuqta koordinatalari bilan aynan bir xil bo'ladi.",
        'Если начало вектора находится в начале координат, его координаты полностью совпадают с координатами точки, являющейся его концом.',
        "If a vector's start is at the origin, its coordinates exactly match the coordinates of the point that is its end.",
      ),
    },
  },
}

// ============================================================
// EKRAN 5. IKKI USUL (`twoways`): qo'shish va songa ko'paytirish
// koordinatalarda.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З116',
  eyebrow: L('IKKI AMAL', 'ДВЕ ОПЕРАЦИИ', 'TWO OPERATIONS'),
  title: L(
    "Koordinatalarda qo'shish va songa ko'paytirish",
    'Сложение и умножение на число в координатах',
    'Addition and multiplication by a number in coordinates',
  ),
  audio: [
    A('mount',
      "Birinchi amalda ikki vektorning mos koordinatalari qo'shiladi.",
      'В первой операции складываются соответствующие координаты двух векторов.',
      'In the first operation, the matching coordinates of two vectors are added.'),
    W('w2',
      "Ikkinchi amalda bitta vektorning har bir koordinatasi songa ko'paytiriladi.",
      'В второй операции каждая координата одного вектора умножается на число.',
      "In the second operation, each coordinate of one vector is multiplied by a number."),
    W('w4',
      "Ikkalasida ham amal koordinatalar bo'yicha alohida bajariladi.",
      'В обоих случаях действие выполняется по координатам отдельно.',
      'In both cases the operation is carried out on the coordinates separately.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('QO\'SHISH', 'СЛОЖЕНИЕ', 'ADDITION'),
        lead: L(
          "a uchga, beshda; b ikkiga, yettida",
          'a три, пять; b два, семь',
          'a three, five; b two, seven',
        ),
        rows: [{ text: 'a+b(3+2; 5+7) = (5; 12)', tone: 'ok' }],
      },
      {
        name: L("SONGA KO'PAYTIRISH", 'УМНОЖЕНИЕ НА ЧИСЛО', 'MULTIPLICATION BY A NUMBER'),
        lead: L(
          "a minus uchga, to'rtda; k to'rt",
          'a минус три, четыре; k четыре',
          'a minus three, four; k four',
        ),
        rows: [{ text: '4a(4·(−3); 4·4) = (−12; 16)', tone: 'ok' }],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM KOORDINATA BO\'YICHA', 'ОБА ПО КООРДИНАТАМ', 'BOTH BY COORDINATE'),
        lead: L(
          "Vektor bilan emas, uning ikki soni bilan ishlanadi",
          'Работают не с вектором целиком, а с его двумя числами',
          'The work is done not with the whole vector, but with its two numbers',
        ),
        rows: [{ text: L("har koordinata o'zining juftiga qarab hisoblanadi", 'каждая координата считается со своей парой', 'each coordinate is computed with its own pair'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 6. TA'RIF (`pick`). Ловушка, natija vektor deb olinishi
// (З117).
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З117',
  eyebrow: L("SKALYAR KO'PAYTMA", 'СКАЛЯРНОЕ ПРОИЗВЕДЕНИЕ', 'THE DOT PRODUCT'),
  title: L(
    "a ikkiga, minus uchda; b minus ikkiga, uchda. Ularning skalyar ko'paytmasi nima bo'ladi",
    'a два, минус три; b минус два, три. Чем будет их скалярное произведение',
    "a two, minus three; b minus two, three. What will their dot product be",
  ),
  audio: [
    A('mount',
      "Skalyar ko'paytma, mos koordinatalar ko'paytmalarining yig'indisi.",
      'Скалярное произведение это сумма произведений соответствующих координат.',
      'The dot product is the sum of the products of the matching coordinates.'),
    A('why',
      "Natija son bo'ladi, chunki qo'shish va ko'paytirish faqat sonlar bilan ishlaydi.",
      'Результат будет числом, потому что сложение и умножение работают только с числами.',
      'The result will be a number, because addition and multiplication work only with numbers.'),
  ],
  props: {
    ask: L(
      "a va b ning skalyar ko'paytmasi nima bo'ladi, va bu natija qanday narsa?",
      'Чем будет скалярное произведение a и b, и что это за результат?',
      'What will the dot product of a and b be, and what kind of result is it?',
    ),
    items: [
      { id: 'right', show: L("Minus o'n uch, bu son", 'Минус тринадцать, это число', 'Minus thirteen, a number'), right: true, name: L("ikkiga minus ikki, minus uchga uch qo'shilgan", 'два на минус два, плюс минус три на три', 'two times minus two, plus minus three times three') },
      {
        id: 'wrong', show: L("Minus to'rtga, minus to'qqizda, bu vektor", 'Минус четыре, минус девять, это вектор', 'Minus four, minus nine, a vector'),
        hint: L("Bu ikki ko'paytmaning o'zi, ular qo'shilishi kerak, va natija bitta son bo'ladi.", 'Это сами два произведения, их нужно сложить, и результат будет одним числом.', 'Those are the two products themselves, they must be added, and the result will be one number.'),
      },
    ],
    after: L(
      "To'g'ri. Skalyar ko'paytma har doim bitta son, vektor emas.",
      'Верно. Скалярное произведение всегда одно число, а не вектор.',
      'Correct. The dot product is always one number, not a vector.',
    ),
  },
}

// ============================================================
// EKRAN 7. UCH QISM (`parts`): skalyar ko'paytma formulasi.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З117',
  eyebrow: L('UCH QISM', 'ТРИ ЧАСТИ', 'THREE PARTS'),
  title: L(
    "Skalyar ko'paytma formulasining uch qismi",
    'Три части формулы скалярного произведения',
    'The three parts of the dot-product formula',
  ),
  audio: [
    A('mount',
      "Chap tomonda ikki vektorning ko'paytmasi turadi.",
      'Слева стоит произведение двух векторов.',
      'On the left stands the product of two vectors.'),
    W('p2',
      "O'ng tomonda birinchi koordinatalar ko'paytmasi.",
      'Справа произведение первых координат.',
      'On the right, the product of the first coordinates.'),
    W('p4',
      "Unga ikkinchi koordinatalar ko'paytmasi qo'shiladi. Yig'indi bitta son.",
      'К нему добавляется произведение вторых координат. Сумма, одно число.',
      'The product of the second coordinates is added to it. The sum is one number.',
    ),
  ],
  props: {
    tokens: [
      { t: 'a·b', id: 'mid' },
      { t: ' = x1x2 + ', id: 'a' },
      { t: 'y1y2', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Chap tomonda ikki vektorning skalyar ko'paytmasi.",
          'Слева скалярное произведение двух векторов.',
          'On the left, the dot product of two vectors.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "O'ng tomonning birinchi qismi, ikkala vektorning birinchi koordinatalari ko'paytmasi.",
          'Первая часть справа, произведение первых координат обоих векторов.',
          "The first part on the right, the product of both vectors' first coordinates.",
        ),
      },
      {
        focus: 'b',
        text: L(
          "Unga ikkinchi koordinatalar ko'paytmasi qo'shiladi. Yakuniy javob bitta son.",
          'К нему добавляется произведение вторых координат. Итоговый ответ, одно число.',
          'The product of the second coordinates is added to it. The final answer is one number.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Vektorning o'zi bilan skalyar ko'paytmasi uning uzunligi kvadratiga teng, shuning uchun modul formulasi ham aynan shu ko'paytmadan kelib chiqadi.",
        'Скалярное произведение вектора на самого себя равно квадрату его длины, поэтому формула модуля тоже вытекает именно из этого произведения.',
        "The dot product of a vector with itself equals the square of its length, which is exactly why the magnitude formula also comes from this product.",
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 44-46-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З117',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Vektor koordinatalari va skalyar ko'paytma",
    'Координаты вектора и скалярное произведение',
    'Vector coordinates and the dot product',
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
      { id: 'f1', label: L("vektor koordinatalari, oxiri koordinatalaridan boshi koordinatalarini ayirish natijasi", 'координаты вектора получаются вычитанием координат начала из координат конца', "a vector's coordinates come from subtracting the start's coordinates from the end's") },
      { id: 'f2', label: L("koordinatalar bilan berilgan vektorlarni qo'shish, ayirish, songa ko'paytirish, mos koordinatalar ustida bajariladi", 'сложение, вычитание, умножение на число для векторов в координатах выполняются над соответствующими координатами', 'addition, subtraction, multiplication by a number for vectors in coordinates are done on the matching coordinates') },
      { id: 'f3', label: L("skalyar ko'paytma bitta son, mos koordinatalar ko'paytmalari yig'indisi; modul, shu yig'indining ildizi", 'скалярное произведение это одно число, сумма произведений соответствующих координат; модуль, корень из этой суммы', 'the dot product is one number, the sum of the products of matching coordinates; the magnitude is the root of that sum') },
      { id: 'w1', label: L("skalyar ko'paytma natijasi juft son, ya'ni vektor", 'результат скалярного произведения пара чисел, то есть вектор', 'the dot product result is a pair of numbers, that is, a vector') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Skalyar ko'paytmaning natijasi bitta son, juft son emas.",
      'Так не складывается. Результат скалярного произведения одно число, а не пара чисел.',
      'That does not fit. The dot product result is one number, not a pair of numbers.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 5-§, 44-46-mavzu asosida (142-147-bet)",
        'Правило на основе геометрии, § 5, темы 44-46 учебника (стр. 142-147)',
        'The rule is based on geometry, section 5, topics 44-46 of the textbook (pages 142-147)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Vektorni faqat chizmada ko'rib ishlardik",
        'Мы работали с вектором, только видя его на чертеже',
        'We worked with a vector only by seeing it on a drawing',
      ),
      right: L(
        "endi vektorni ikki son, koordinatalar, orqali ham hisoblaymiz",
        'теперь мы считаем вектор и через два числа, координаты',
        'now we also compute a vector through two numbers, coordinates',
      ),
      winner: 'right',
      note: L(
        "Chizma bilan ko'rish, sonlar bilan hisoblash",
        'Чертёж, чтобы видеть; числа, чтобы считать',
        'A drawing to see; numbers to compute',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): ikki nuqtadan vektor koordinatasi.
// ============================================================
const ASK_COORD = L("AB⃗ ning koordinatalari qanday?", 'Какими будут координаты AB⃗?', 'What are the coordinates of AB⃗?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З116',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ikki nuqta koordinatasidan vektor koordinatasini toping",
    'Найди координаты вектора по координатам двух точек',
    'Find the coordinates of a vector from two points',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida A va B nuqtaning koordinatalari berilgan.",
      'Пять заданий. В каждом даны координаты точек A и B.',
      'Five tasks. In each, the coordinates of points A and B are given.'),
    A('why',
      "Har safar B dan A ayiriladi, aksincha emas.",
      'Каждый раз из B вычитается A, а не наоборот.',
      'Each time A is subtracted from B, not the other way around.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar oxiridan boshi ayirilgan.",
      'Все пять разобраны. Каждый раз из конца вычиталось начало.',
      'All five are done. Each time the start was subtracted from the end.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'A(2; 5),  B(6; 8)'}</Row>,
        ok: L("Ha. Oltidan ikki ayrilsa to'rt, sakkizdan besh ayrilsa uch.", 'Да. Из шести вычесть два, четыре; из восьми вычесть пять, три.', 'Yes. Six minus two is four; eight minus five is three.'),
        question: ASK_COORD,
        items: [
          { id: 'a', right: true, label: '(4; 3)' },
          { id: 'b', label: '(−4; −3)', hint: L("Bu tartib teskari, boshidan oxiri ayirilgan.", 'Порядок перепутан, из начала вычтен конец.', 'The order is reversed, the end was subtracted from the start.') },
        ],
        solution: ['6−2; 8−5', '(4; 3)'],
      },
      {
        expr: <Row size="big" align="center">{'A(3; −4),  B(1; −6)'}</Row>,
        ok: L("Ha. Birdan uch ayrilsa minus ikki, minus oltidan minus to'rt ayrilsa minus ikki.", 'Да. Из одного вычесть три, минус два; из минус шести вычесть минус четыре, минус два.', 'Yes. One minus three is minus two; minus six minus minus four is minus two.'),
        question: ASK_COORD,
        items: [
          { id: 'a', right: true, label: '(−2; −2)' },
          { id: 'b', label: '(2; 2)', hint: L("Bu tartib teskari, boshidan oxiri ayirilgan.", 'Порядок перепутан, из начала вычтен конец.', 'The order is reversed, the end was subtracted from the start.') },
        ],
        solution: ['1−3; −6−(−4)', '(−2; −2)'],
      },
      {
        expr: <Row size="big" align="center">{'A(−5; −3),  B(−1; 3)'}</Row>,
        ok: L("Ha. Minus birdan minus besh ayrilsa to'rt, uchdan minus uch ayrilsa olti.", 'Да. Из минус одного вычесть минус пять, четыре; из трёх вычесть минус три, шесть.', 'Yes. Minus one minus minus five is four; three minus minus three is six.'),
        question: ASK_COORD,
        items: [
          { id: 'a', right: true, label: '(4; 6)' },
          { id: 'b', label: '(−4; −6)', hint: L("Bu tartib teskari, boshidan oxiri ayirilgan.", 'Порядок перепутан, из начала вычтен конец.', 'The order is reversed, the end was subtracted from the start.') },
        ],
        solution: ['−1−(−5); 3−(−3)', '(4; 6)'],
      },
      {
        expr: <Row size="big" align="center">{'A(0; 1),  B(1; 0)'}</Row>,
        ok: L("Ha. Birdan nol ayrilsa bir, noldan bir ayrilsa minus bir.", 'Да. Из одного вычесть нуль, один; из нуля вычесть один, минус один.', 'Yes. One minus zero is one; zero minus one is minus one.'),
        question: ASK_COORD,
        items: [
          { id: 'a', right: true, label: '(1; −1)' },
          { id: 'b', label: '(−1; 1)', hint: L("Bu tartib teskari, boshidan oxiri ayirilgan.", 'Порядок перепутан, из начала вычтен конец.', 'The order is reversed, the end was subtracted from the start.') },
        ],
        solution: ['1−0; 0−1', '(1; −1)'],
      },
      {
        expr: <Row size="big" align="center">{'A(−2; 1),  B(−4; 3)'}</Row>,
        ok: L("Ha. Minus to'rtdan minus ikki ayrilsa minus ikki, uchdan bir ayrilsa ikki.", 'Да. Из минус четырёх вычесть минус два, минус два; из трёх вычесть один, два.', 'Yes. Minus four minus minus two is minus two; three minus one is two.'),
        question: ASK_COORD,
        items: [
          { id: 'a', right: true, label: '(−2; 2)' },
          { id: 'b', label: '(2; −2)', hint: L("Bu tartib teskari, boshidan oxiri ayirilgan.", 'Порядок перепутан, из начала вычтен конец.', 'The order is reversed, the end was subtracted from the start.') },
        ],
        solution: ['−4−(−2); 3−1', '(−2; 2)'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): koordinatalardan modulni topish.
// ============================================================
const ASK_MOD2 = L("|a| qancha?", 'Чему равен |a|?', 'What is |a|?')

const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З117',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Koordinatalardan vektorning modulini hisoblang",
    'Вычисли модуль вектора по координатам',
    "Compute a vector's magnitude from its coordinates",
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida vektorning ikki koordinatasi berilgan.",
      'Пять заданий. В каждом даны две координаты вектора.',
      'Five tasks. In each, the two coordinates of a vector are given.'),
    A('why',
      "Har biri kvadratga oshiriladi, qo'shiladi, keyin ildiz olinadi.",
      'Каждая возводится в квадрат, складывается, потом извлекается корень.',
      'Each is squared, added, then the root is taken.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar Pifagor teoremasining o'zi ishlagan.",
      'Все пять разобраны. Каждый раз работала сама теорема Пифагора.',
      'All five are done. Each time the Pythagorean theorem itself did the work.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a(−12; 5)'}</Row>,
        ok: L("Ha. O'n ikki va beshning kvadratlari yig'indisi bir yuz oltmish to'qqiz, ildizi o'n uch.", 'Да. Сумма квадратов двенадцати и пяти сто шестьдесят девять, корень тринадцать.', 'Yes. The sum of the squares of twelve and five is a hundred sixty-nine, the root is thirteen.'),
        question: ASK_MOD2,
        items: [
          { id: 'a', right: true, label: '13' },
          { id: 'b', label: '17', hint: L("Bu koordinatalarning yig'indisi, modul formulasi emas.", 'Это сумма координат, а не формула модуля.', 'That is the sum of the coordinates, not the magnitude formula.') },
        ],
        solution: ['12² + 5²', '169', '13'],
      },
      {
        expr: <Row size="big" align="center">{'a(3; 4)'}</Row>,
        ok: L("Ha. Uch va to'rtning kvadratlari yig'indisi yigirma besh, ildizi besh.", 'Да. Сумма квадратов трёх и четырёх двадцать пять, корень пять.', 'Yes. The sum of the squares of three and four is twenty-five, the root is five.'),
        question: ASK_MOD2,
        items: [
          { id: 'a', right: true, label: '5' },
          { id: 'b', label: '7', hint: L("Bu koordinatalarning yig'indisi, modul formulasi emas.", 'Это сумма координат, а не формула модуля.', 'That is the sum of the coordinates, not the magnitude formula.') },
        ],
        solution: ['3² + 4²', '25', '5'],
      },
      {
        expr: <Row size="big" align="center">{'a(−8; 15)'}</Row>,
        ok: L("Ha. Sakkiz va o'n beshning kvadratlari yig'indisi ikki yuz sakson to'qqiz, ildizi o'n yetti.", 'Да. Сумма квадратов восьми и пятнадцати двести восемьдесят девять, корень семнадцать.', 'Yes. The sum of the squares of eight and fifteen is two hundred eighty-nine, the root is seventeen.'),
        question: ASK_MOD2,
        items: [
          { id: 'a', right: true, label: '17' },
          { id: 'b', label: '23', hint: L("Bu koordinatalarning yig'indisi, modul formulasi emas.", 'Это сумма координат, а не формула модуля.', 'That is the sum of the coordinates, not the magnitude formula.') },
        ],
        solution: ['8² + 15²', '289', '17'],
      },
      {
        expr: <Row size="big" align="center">{'a(20; 21)'}</Row>,
        ok: L("Ha. Yigirma va yigirma birning kvadratlari yig'indisi sakkiz yuz qirq bir, ildizi yigirma to'qqiz.", 'Да. Сумма квадратов двадцати и двадцати одного восемьсот сорок один, корень двадцать девять.', 'Yes. The sum of the squares of twenty and twenty-one is eight hundred forty-one, the root is twenty-nine.'),
        question: ASK_MOD2,
        items: [
          { id: 'a', right: true, label: '29' },
          { id: 'b', label: '41', hint: L("Bu koordinatalarning yig'indisi, modul formulasi emas.", 'Это сумма координат, а не формула модуля.', 'That is the sum of the coordinates, not the magnitude formula.') },
        ],
        solution: ['20² + 21²', '841', '29'],
      },
      {
        expr: <Row size="big" align="center">{'a(24; 7)'}</Row>,
        ok: L("Ha. Yigirma to'rt va yettining kvadratlari yig'indisi olti yuz yigirma besh, ildizi yigirma besh.", 'Да. Сумма квадратов двадцати четырёх и семи шестьсот двадцать пять, корень двадцать пять.', 'Yes. The sum of the squares of twenty-four and seven is six hundred twenty-five, the root is twenty-five.'),
        question: ASK_MOD2,
        items: [
          { id: 'a', right: true, label: '25' },
          { id: 'b', label: '31', hint: L("Bu koordinatalarning yig'indisi, modul formulasi emas.", 'Это сумма координат, а не формула модуля.', 'That is the sum of the coordinates, not the magnitude formula.') },
        ],
        solution: ['24² + 7²', '625', '25'],
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
      "Ayirib yoki kvadratga oshirib, taklif qilingan javobni solishtiring.",
      'Вычти или возведи в квадрат, и сравни с предложенным ответом.',
      'Subtract or square, and compare with the proposed answer.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash taklif qilingan javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло предложенный ответ.',
      'All three are done. Each time computation checked the proposed answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'A(1; −1), B(4; 3)   →   AB⃗(3; 4)'}</Row>,
        ok: L("Ha. To'rtdan bir ayrilsa uch, uchdan minus bir ayrilsa to'rt.", 'Да. Из четырёх вычесть один, три; из трёх вычесть минус один, четыре.', 'Yes. Four minus one is three; three minus minus one is four.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham shunday chiqadi.", 'Посчитай, ответ действительно такой.', 'Compute it, the answer really is that.') },
        ],
        solution: ['4−1; 3−(−1)', '(3; 4)'],
      },
      {
        expr: <Row size="big" align="center">{'a(6; 8)   →   |a| = 10'}</Row>,
        ok: L("Ha. Olti va sakkizning kvadratlari yig'indisi yuz, ildizi o'n.", 'Да. Сумма квадратов шести и восьми сто, корень десять.', 'Yes. The sum of the squares of six and eight is a hundred, the root is ten.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham o'n chiqadi.", 'Посчитай, ответ действительно выходит десять.', 'Compute it, the answer really comes to ten.') },
        ],
        solution: ['6² + 8²', '100', '10'],
      },
      {
        expr: <Row size="big" align="center">{'a(9; 12)   →   |a| = 225'}</Row>,
        ok: L("Yo'q. Ikki yuz yigirma besh, modulning o'zi emas, uning kvadrati. Ildiz olinsa, o'n besh chiqadi.", 'Нет. Двести двадцать пять, это не сам модуль, а его квадрат. Если извлечь корень, выходит пятнадцать.', 'No. Two hundred twenty-five is not the magnitude itself, but its square. Taking the root gives fifteen.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Bu qadamda ildiz olinmagan, faqat kvadratlar yig'indisi qolgan.", 'На этом шаге корень не извлечён, осталась только сумма квадратов.', 'At this step the root was not taken, only the sum of the squares remains.') },
        ],
        solution: ['9² + 12²', '225', '15'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): tartib teskarilangan (З116)
// va natija vektor deb olingan (З117).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З116',
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
      "Birinchisida tartib teskarilangan, ikkinchisida natija juft son sifatida yozilgan.",
      'В первом перепутан порядок, во втором результат записан как пара чисел.',
      'In the first, the order was reversed, in the second, the result was written as a pair of numbers.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham boshqa-boshqa qoidani chetlab o'tgan.",
      'Обе разобраны. Обе ошибки обошли разные правила.',
      'Both are done. Each mistake bypassed a different rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'A(2; −3), B(5; 1)   →   "AB⃗(−3; −4)"'}</Row>,
        ok: L("Ha. Beshdan ikki ayrilsa uch, birdan minus uch ayrilsa to'rt, ikkalasi ham musbat chiqadi.", 'Да. Из пяти вычесть два, три; из одного вычесть минус три, четыре, оба выходят положительными.', 'Yes. Five minus two is three; one minus minus three is four, both come out positive.'),
        question: L("AB⃗ yuqoridagicha yozilgan bo'lsa, xato qayerda?", 'Если AB⃗ записан как выше, в чём здесь ошибка?', 'If AB⃗ was written as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Tartib teskarilangan, boshidan oxiri ayirilgan", 'Порядок перепутан, из начала вычтен конец', 'The order is reversed, the end was subtracted from the start') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, AB⃗ uchga, to'rtda bo'lishi kerak.", 'Это и есть показанная ошибка, AB⃗ должен быть три, четыре.', 'This is the very mistake shown; AB⃗ should be three, four.') },
        ],
        solution: ['5−2; 1−(−3)', '(3; 4)'],
      },
      {
        expr: <Row size="big" align="center">{'a(4; −1), b(−3; 2)   →   "a·b(−14; 2)"'}</Row>,
        ok: L("Ha. To'rt manfiy uchga, minus bir ikkiga ko'paytirilsa, ikkalasi qo'shilib minus o'n to'rt chiqadi, bu bitta son.", 'Да. Четыре на минус три, минус один на два, при сложении выходит минус четырнадцать, это одно число.', 'Yes. Four times minus three, minus one times two, added together comes to minus fourteen, a single number.'),
        question: L("Skalyar ko'paytma yuqoridagicha, juft son sifatida yozilgan bo'lsa, xato qayerda?", 'Если скалярное произведение записано как выше, парой чисел, в чём здесь ошибка?', 'If the dot product was written as above, as a pair of numbers, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Natija bitta son, juft son emas", 'Результат одно число, а не пара чисел', 'The result is one number, not a pair of numbers') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, ikki ko'paytma qo'shilishi kerak.", 'Это и есть показанная ошибка, два произведения нужно сложить.', 'This is the very mistake shown; the two products must be added.') },
        ],
        solution: ['4·(−3) + (−1)·2', '−14'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): skalyar ko'paytmani qadamlab.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З117',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Skalyar ko'paytmani qadamlab hisoblang",
    'Вычисли скалярное произведение по шагам',
    'Compute the dot product step by step',
  ),
  audio: [
    A('mount',
      "Avval birinchi koordinatalar ko'paytiriladi, keyin ikkinchilari, oxirida qo'shiladi.",
      'Сначала умножаются первые координаты, потом вторые, в конце складываются.',
      'First the first coordinates are multiplied, then the second, finally added.'),
    A('why',
      "Yakuniy javob har doim bitta son bo'lishi kerak.",
      'Итоговый ответ всегда должен быть одним числом.',
      'The final answer must always be one number.',
    ),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar ikki ko'paytma topilib, qo'shilgan.",
      'Все три заполнены. Каждый раз находились два произведения, потом складывались.',
      'All three are filled. Each time two products were found, then added.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['12', '35', '47'],
      lines: [
        [{ t: 'a(4; 5)·b(3; 7)   →   x1x2 = ' }, { slot: '12' }, { t: '   →   y1y2 = ' }, { slot: '35' }, { t: '   →   a·b = ' }, { slot: '47' }],
      ],
    },
    tasks: [
      {
        chips: ['−21', '20', '−1'],
        lines: [
          [{ t: 'a(−3; −5)·b(7; −4)   →   x1x2 = ' }, { slot: '−21' }, { t: '   →   y1y2 = ' }, { slot: '20' }, { t: '   →   a·b = ' }, { slot: '−1' }],
        ],
      },
      {
        chips: ['−16', '0', '−16'],
        lines: [
          [{ t: 'a(−2; 0)·b(8; −9)   →   x1x2 = ' }, { slot: '−16' }, { t: '   →   y1y2 = ' }, { slot: '0' }, { t: '   →   a·b = ' }, { slot: '−16' }],
        ],
      },
      {
        chips: ['−18', '18', '0'],
        lines: [
          [{ t: 'a(6; 2)·b(−3; 9)   →   x1x2 = ' }, { slot: '−18' }, { t: '   →   y1y2 = ' }, { slot: '18' }, { t: '   →   a·b = ' }, { slot: '0' }],
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
    "Koordinatalar bo'yicha to'rt savol",
    'Четыре вопроса о координатах',
    'Four questions about coordinates',
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
        id: 'q1', tag: 'З116',
        ask: L('A(3; 1), B(7; 4). AB⃗ ning koordinatalari qanday?', 'A(3; 1), B(7; 4). Какими будут координаты AB⃗?', 'A(3; 1), B(7; 4). What are the coordinates of AB⃗?'),
        options: [
          { id: 'ok', right: true, label: '(4; 3)' },
          { id: 'no', label: '(−4; −3)' },
        ],
        hint: L("Oxiridan boshi ayiriladi.", 'Из конца вычитается начало.', 'The start is subtracted from the end.'),
        ok: L("To'g'ri, to'rtga, uchda.", 'Верно, четыре, три.', 'Correct, four, three.'),
      },
      {
        id: 'q2', tag: 'З117',
        ask: L("a(2; −1)·b(3; 4). Natija qanday son?", 'a(2; −1)·b(3; 4). Каким будет число-результат?', 'a(2; −1)·b(3; 4). What is the resulting number?'),
        options: [
          { id: 'ok', right: true, label: '2' },
          { id: 'no', label: '(6; −4)' },
        ],
        hint: L("Ikki ko'paytma qo'shilishi kerak, ular alohida qolmaydi.", 'Два произведения нужно сложить, они не остаются отдельно.', 'The two products must be added, they do not stay separate.'),
        ok: L("To'g'ri, olti va minus to'rt qo'shilsa, ikki.", 'Верно, шесть и минус четыре в сумме дают два.', 'Correct, six and minus four together give two.'),
      },
      {
        id: 'q3', tag: 'З117',
        ask: L("a(5; 12). |a| qancha?", 'a(5; 12). Чему равен |a|?', 'a(5; 12). What is |a|?'),
        options: [
          { id: 'ok', right: true, label: '13' },
          { id: 'no', label: '17' },
        ],
        hint: L("Kvadratga oshirib qo'shing, keyin ildiz oling.", 'Возведи в квадрат, сложи, потом извлеки корень.', 'Square, add, then take the root.'),
        ok: L("To'g'ri, o'n uch.", 'Верно, тринадцать.', 'Correct, thirteen.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L("O'n ikkiga o'ttiz besh qo'shilsa, qirq yetti chiqadimi?", 'Верно ли, что двенадцать плюс тридцать пять равно сорок семь?', 'Is it true that twelve plus thirty-five equals forty-seven?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, natija mos keladi.", 'Посчитай, результат совпадает.', 'Compute it, the result matches.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З117',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "a(−4; 1)·b(2; −3) ni yig'ing.",
            'Собери a(−4; 1)·b(2; −3).',
            'Assemble a(−4; 1)·b(2; −3).',
          ),
          lines: [
            [{ t: 'a·b = ' }, { slot: '−11' }],
          ],
          tiles: [
            { id: 't1', v: '−11', x: 12, y: 12 },
            { id: 't2', v: '11', x: 60, y: 14 },
            { id: 't3', v: '−8', x: 30, y: 50 },
            { id: 't4', v: '−3', x: 78, y: 48 },
          ],
          hint: L(
            "Minus to'rtni ikkiga, birni minus uchga ko'paytirib, qo'shing.",
            'Умножь минус четыре на два, один на минус три, и сложи.',
            'Multiply minus four by two, one by minus three, and add.',
          ),
          doneNote: L(
            "Yig'ildi. Skalyar ko'paytma minus o'n bir chiqdi.",
            'Собрано. Скалярное произведение вышло минус одиннадцать.',
            'Assembled. The dot product comes out to minus eleven.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (`takeaway`). Butun 8-sinf kursining so'nggi ekrani.
// ============================================================
const S15 = {
  role: 'summary',
  tool: 'takeaway',
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Oxiridan boshi, va natija bitta son",
    'Из конца начало, и результат одно число',
    'The start from the end, and the result is one number',
  ),
  audio: [
    A('s0',
      "Darsdan bitta qoida qoladi. Vektor koordinatasi, oxiridan boshi ayirilgan natija.",
      'С урока остаётся одно правило. Координаты вектора, это результат вычитания начала из конца.',
      "One rule stays with you. A vector's coordinates are the result of subtracting the start from the end."),
    A('s1',
      "Bugun uch narsa qilindi. Vektor koordinatasini topdingiz, koordinatalarda amal bajardingiz va skalyar ko'paytmani hisobladingiz.",
      'Сегодня сделано три вещи. Ты нашёл координаты вектора, выполнил операцию в координатах, и вычислил скалярное произведение.',
      "Three things are done today. You found a vector's coordinates, performed an operation in coordinates, and computed the dot product."),
    A('s2',
      "Bu, 8-sinf geometriya kursining so'nggi darsi edi. Vektorlar mavzusi ham, butun kurs ham shu bilan yakunlanadi.",
      'Это был последний урок курса геометрии 8 класса. Тема векторов, и весь курс, завершаются этим уроком.',
      'This was the final lesson of the 8th-grade geometry course. Both the topic of vectors and the whole course end with this lesson.',
    ),
  ],
  props: {
    mark: 'AB⃗(x2−x1; y2−y1),   a·b = x1x2+y1y2,   |a| = √(x1²+y1²)',
    markNote: L(
      "A(1;−1), B(4;3) → AB⃗(3;4); a(4;5)·b(3;7)=47",
      'A(1;−1), B(4;3) → AB⃗(3;4); a(4;5)·b(3;7)=47',
      'A(1;−1), B(4;3) → AB⃗(3;4); a(4;5)·b(3;7)=47',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Bu, 8-sinf geometriya kursining so'nggi darsi",
      'Это последний урок курса геометрии 8 класса',
      'This is the final lesson of the 8th-grade geometry course',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
