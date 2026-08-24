// ============================================================================
// 8-sinf, Dars 45. PIFAGOR TEOREMASIGA TESKARI TEOREMA.
//
// BLOK Б7. Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`, `geofigure.jsx`,
// `prooflines.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da. YANGI PRIBOR
// YO'Q — `GeoFigure` va `ProofLines` (dars 37+) qayta ishlatilgan.
//
// MANBA: 8-sinf geometriya darsligi, 3-§ (PIFAGOR TEOREMASI), 29-mavzu
// (98-100-bet):
//   - 1-natija: to'g'ri burchakli uchburchakda istalgan katet gipotenuzadan
//     kichik (c² = a² + b² dan, b² > 0 bo'lgani uchun c² > a², demak c > a);
//   - 2-natija: gipotenuzasi va bir katetiga ko'ra teng ikki to'g'ri
//     burchakli uchburchak teng bo'ladi (b² = c² − a² ikkalasida ham bir
//     xil, uchinchi tomon tengligi orqali isbotlanadi);
//   - teskari teorema: agar uchburchakda bir tomonning kvadrati qolgan ikki
//     tomon kvadratlari yig'indisiga teng bo'lsa, uchburchak to'g'ri
//     burchakli bo'ladi, va to'g'ri burchak aynan SHU (eng katta) tomonga
//     qarama-qarshi uchda turadi; isbot yordamchi uchburchak yasash orqali
//     (darslikdagi 178-rasm);
//   - masala (99-bet): 1) a=5, b=11, c=12 — 5²+11²=146, 12²=144, TENG EMAS,
//     to'g'ri burchakli emas; 2) a=√85, b=7, c=6 — bu yerda ENG KATTA tomon
//     √85 (taxminan 9,2), c=6 emas; 7²+6²=85=(√85)², demak to'g'ri
//     burchakli, va to'g'ri burchak √85 tomoniga qarama-qarshi uchda.
//
// Ikkinchi masala ataylab shunday tanlangan: c harfi har doim gipotenuza
// degani emas, tekshirishdan OLDIN eng katta son aniqlanishi kerak. Bu
// darsning markaziy adashishi (З94).
//
// ADASHISHLAR, uchtasi yangi:
//   З94, eng katta tomon aniqlanmasdan, boshqa (masalan, oxirida yozilgan)
//   tomon tekshirishga olingan;
//   З95, to'g'ri burchak borligi to'g'ri topilgan, ammo u ENG KATTA tomonga
//   qarama-qarshi uchda emas, boshqa uchda ko'rsatilgan;
//   З96, gipotenuza va bitta katetga ko'ra tenglik mezoni ikkita katetga
//   ko'ra tenglik deb tushunilgan;
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
  id: 'geo-8-45',
  n: 45,
  row: 50,
  block: 'Б7',
  topic: L("Pifagor teoremasiga teskari teorema", 'Теорема, обратная теореме Пифагора', 'The converse of the Pythagorean theorem'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "To'g'ri burchakli uchburchakda istalgan katet gipotenuzadan kichik",
    'В прямоугольном треугольнике любой катет меньше гипотенузы',
    'In a right triangle, any leg is smaller than the hypotenuse',
  ),
  L(
    "Agar uchburchakda bir tomonning kvadrati qolgan ikki tomon kvadratlari yig'indisiga teng bo'lsa, uchburchak to'g'ri burchakli bo'ladi, va to'g'ri burchak aynan shu ENG KATTA tomonga qarama-qarshi uchda turadi",
    'Если в треугольнике квадрат одной стороны равен сумме квадратов двух других, треугольник прямоугольный, и прямой угол лежит именно против этой НАИБОЛЬШЕЙ стороны',
    'If in a triangle the square of one side equals the sum of the squares of the other two, the triangle is right-angled, and the right angle lies exactly opposite that LONGEST side',
  ),
  L(
    "Tekshirishdan oldin eng katta tomon aniqlanadi; gipotenuzasi va bir katetiga ko'ra teng ikki to'g'ri burchakli uchburchak har doim teng bo'ladi",
    'Перед проверкой определяется наибольшая сторона; два прямоугольных треугольника с равной гипотенузой и равным катетом всегда равны',
    'Before checking, the longest side is identified; two right triangles with equal hypotenuse and equal leg are always congruent',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З94': {
    what: L(
      "eng katta tomon aniqlanmasdan, boshqa tomon tekshirishga olingan",
      'наибольшая сторона не была определена, к проверке взята другая сторона',
      'the longest side was not identified, a different side was taken for the check',
    ),
    wrong: null,
    at: 12,
  },
  'З95': {
    what: L(
      "to'g'ri burchak borligi to'g'ri topilgan, ammo u eng katta tomonga qarama-qarshi uchda emas, boshqa uchda ko'rsatilgan",
      'наличие прямого угла найдено верно, но он показан не в вершине против наибольшей стороны, а в другой',
      'the presence of a right angle was found correctly, but it was placed not at the vertex opposite the longest side, but at another one',
    ),
    wrong: null,
    at: 12,
  },
  'З96': {
    what: L(
      "gipotenuza va bitta katetga ko'ra tenglik mezoni ikkita katetga ko'ra tenglik deb tushunilgan",
      'признак равенства по гипотенузе и катету понят как признак равенства по двум катетам',
      'the hypotenuse-and-leg congruence criterion was understood as a two-legs criterion',
    ),
    wrong: null,
    at: 13,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (3-ekran, GeoFigure). Ikki uchburchak, gipotenuza
// va bir kateti teng (2-natija).
// ============================================================
const TRI2 = { A: [15, 85], B: [15, 20], C: [95, 20] }
const TRI2_ORDER = ['A', 'B', 'C']

// ============================================================
// CHERTYOZH KOORDINATALARI (4-ekran, ProofLines). Teskari teorema isboti.
// ============================================================
const TRI3 = { A: [15, 85], B: [15, 20], C: [95, 20] }
const TRI3_ORDER = ['A', 'B', 'C']

// ============================================================
// CHERTYOZH KOORDINATALARI (5-ekran, GeoFigure). Skalen uchburchak,
// tomonlari 5, 11, 12 (1-masala, 99-bet).
// ============================================================
const TRI5 = { A: [15, 85], B: [95, 85], C: [55, 20] }
const TRI5_ORDER = ['A', 'B', 'C']

// ============================================================
// SAHNALAR (§6). Xuk: uchburchak to'g'ri burchaklimi. Yakun: eng katta
// tomon — kalit.
// ============================================================
const SC_ASK = L('TO\'G\'RI BURCHAKLIMI', 'ПРЯМОУГОЛЬНЫЙ ЛИ', 'IS IT RIGHT-ANGLED')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <polygon points="130,90 200,90 200,40" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="175" cy="72" r="15" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="175" y="78" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Avval eng katta tomon topiladi, keyin uning kvadrati tekshiriladi",
      'Сначала находится наибольшая сторона, потом проверяется её квадрат',
      'First the longest side is found, then its square is checked',
    )}>
      <polygon points="130,90 230,90 230,35" fill="none" stroke={T.ok} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '1300ms' }}>
        <text x="235" y="65" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fontWeight="700" fill={T.ok} transform="rotate(58,235,65)">eng katta</text>
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
  eyebrow: L('TO\'G\'RI BURCHAKLIMI', 'ПРЯМОУГОЛЬНЫЙ ЛИ', 'IS IT RIGHT-ANGLED'),
  title: L(
    "Tomonlari to'qqiz, o'n ikki va o'n besh bo'lgan uchburchak to'g'ri burchakli bo'ladi deb o'ylaysizmi",
    'Как думаешь, будет ли прямоугольным треугольник со сторонами девять, двенадцать и пятнадцать',
    'Do you think a triangle with sides nine, twelve, and fifteen will be right-angled',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Uchburchakning uch tomoni ma'lum, burchaklari esa yo'q.",
      'Известны три стороны треугольника, а углы неизвестны.',
      'The triangle\'s three sides are known, the angles are not.'),
    A('why',
      "Taxmin qiling, bu uchburchakda to'g'ri burchak bormi.",
      'Предположи, есть ли в этом треугольнике прямой угол.',
      'Predict whether this triangle has a right angle.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, bu uchburchak to'g'ri burchaklimi?",
      'Как думаешь, этот треугольник прямоугольный?',
      'What do you think, is this triangle right-angled?',
    ),
    items: [
      { id: 'a', show: L('Ha', 'Да', 'Yes') },
      { id: 'b', show: L("Yo'q", 'Нет', 'No') },
      { id: 'c', show: L("Faqat chizib ko'rish bilan bilish mumkin", 'Узнать можно только построив чертёж', 'It can only be known by drawing it') },
      { id: 'd', show: L("Bunday tekshirib bo'lmaydi", 'Так проверить нельзя', 'It cannot be checked this way') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. 1-natija: kecha o'rgangan formuladan kelib chiqadi.
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Kechagi formuladan bitta oson xulosa",
    'Один простой вывод из вчерашней формулы',
    'One easy conclusion from yesterday\'s formula',
  ),
  audio: [
    A('mount',
      "Kecha gipotenuzaning kvadrati katetlar kvadratlari yig'indisiga teng ekanini isbotladingiz.",
      'Вчера ты доказал, что квадрат гипотенузы равен сумме квадратов катетов.',
      'Yesterday you proved that the square of the hypotenuse equals the sum of the squares of the legs.'),
    A('why',
      "b² doim musbat, shuning uchun c² a² dan katta bo'ladi.",
      'b² всегда положительно, поэтому c² больше a².',
      'b² is always positive, so c² is greater than a².'),
  ],
  props: {
    ask: L(
      "Gipotenuzaning kvadrati katetlar kvadratlari yig'indisiga teng bo'lsa, katet gipotenuzaga solishtirilganda qanday bo'ladi?",
      'Если квадрат гипотенузы равен сумме квадратов катетов, каким катет будет по сравнению с гипотенузой?',
      'If the square of the hypotenuse equals the sum of the squares of the legs, what will the leg be compared to the hypotenuse?',
    ),
    items: [
      { id: 'right', show: L('Doim kichik', 'Всегда меньше', 'Always smaller'), right: true, name: L("b² musbat, shuning uchun c² > a²", 'b² положительно, поэтому c² > a²', 'b² is positive, so c² > a²') },
      {
        id: 'wrong1', show: L("Katta bo'lishi mumkin", 'Может быть больше', 'It can be bigger'),
        hint: L("Gipotenuzaning kvadratiga musbat b² qo'shiladi, shuning uchun c² doim a² dan katta.", 'К квадрату гипотенузы добавляется положительное b², поэтому c² всегда больше a².', 'A positive b² is added to the square of the hypotenuse, so c² is always bigger than a².'),
      },
      {
        id: 'wrong2', show: L("Teng bo'lishi mumkin", 'Может быть равен', 'It can be equal'),
        hint: L("Teng bo'lishi uchun b² nolga teng bo'lishi kerak edi, bu esa uchburchakni yo'q qiladi.", 'Для равенства b² должно быть нулём, а тогда треугольника вообще нет.', 'For equality b² would have to be zero, which erases the triangle altogether.'),
      },
    ],
    after: L(
      "To'g'ri. Istalgan katet gipotenuzadan doim kichik. Bugun aksincha savolni ko'ramiz.",
      'Верно. Любой катет всегда меньше гипотенузы. Сегодня рассмотрим обратный вопрос.',
      'Correct. Any leg is always smaller than the hypotenuse. Today we look at the reverse question.',
    ),
  },
}

// ============================================================
// EKRAN 3. ISBOT (`prooflines`). 2-natija: gipotenuza va bir katetga ko'ra
// tenglik. Ловушка, ikkita katet bilan chalkashtirilishi (З96).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З96',
  eyebrow: L('IKKINCHI NATIJANI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ВТОРОЕ СЛЕДСТВИЕ', 'PROVING THE SECOND COROLLARY'),
  title: L(
    "Gipotenuzasi va bir kateti teng ikki uchburchak teng bo'ladi",
    'Два треугольника с равной гипотенузой и равным катетом равны',
    'Two triangles with an equal hypotenuse and an equal leg are congruent',
  ),
  audio: [
    A('mount',
      "Ikki to'g'ri burchakli uchburchak, gipotenuzalari teng va bittadan katetlari teng.",
      'Два прямоугольных треугольника, их гипотенузы равны, и по одному катету тоже равны.',
      'Two right triangles, their hypotenuses are equal, and one leg each is equal.'),
    A('why',
      "Qolgan katet ham teng chiqishini Pifagor formulasidan ko'ramiz.",
      'Из формулы Пифагора увидим, что и второй катет тоже равен.',
      'From the Pythagorean formula we will see the other leg is equal too.'),
  ],
  props: {
    points: TRI2,
    order: TRI2_ORDER,
    marks: [],
    given: [
      L("ABC va A1B1C1, to'g'ri burchakli uchburchaklar", 'ABC и A1B1C1, прямоугольные треугольники', 'ABC and A1B1C1, right triangles'),
      L("gipotenuzalari teng (c = c1), bir katetlari teng (a = a1)", 'гипотенузы равны (c = c1), один катет равен (a = a1)', 'their hypotenuses are equal (c = c1), one leg is equal (a = a1)'),
    ],
    goal: L("uchburchaklar teng", 'треугольники равны', 'the triangles are congruent'),
    lines: [
      {
        text: L("b² = c² − a² va b1² = c1² − a1²", 'b² = c² − a² и b1² = c1² − a1²', 'b² = c² − a² and b1² = c1² − a1²'),
        options: [
          { id: 'ok', right: true, label: L("Ikkalasi ham Pifagor teoremasidan, katetni gipotenuza va boshqa katet orqali ifodalaydi", 'Обе записаны по теореме Пифагора, катет через гипотенузу и другой катет', 'Both are written from the Pythagorean theorem, the leg through the hypotenuse and the other leg') },
          { id: 'no', label: L("Bu ikkinchi katetlar teng deb berilgan shart", 'Это условие о равенстве вторых катетов', 'This is the given condition that the second legs are equal'), hint: L("Ikkinchi katet haqida hali hech narsa berilmagan, u hisoblanadi.", 'О втором катете пока ничего не дано, он вычисляется.', 'Nothing about the second leg is given yet, it is being computed.') },
        ],
      },
      {
        text: L("c = c1 va a = a1 bo'lgani uchun, b² = b1²", 'так как c = c1 и a = a1, то b² = b1²', 'since c = c1 and a = a1, then b² = b1²'),
        options: [
          { id: 'ok', right: true, label: L("Teng sonlarning kvadratlaridan teng sonlarni ayirish natijasi ham teng", 'Из равных чисел вычитаются равные квадраты, разность тоже равна', 'Equal squares subtracted from equal numbers give an equal difference') },
          { id: 'no', label: L("b va b1 boshidanoq teng deb berilgan", 'b и b1 равны по условию с самого начала', 'b and b1 were given equal from the start'), hint: L("Boshida faqat gipotenuza va bitta katet teng edi, ikkinchi katet endi topildi.", 'Вначале были равны только гипотенуза и один катет, второй катет только сейчас найден.', 'At the start only the hypotenuse and one leg were equal, the second leg was just found.') },
        ],
      },
      {
        text: L("demak, b = b1, va uchburchaklar uch tomoniga ko'ra teng", 'значит, b = b1, и треугольники равны по трём сторонам', 'therefore b = b1, and the triangles are congruent by three sides'),
        options: [
          { id: 'ok', right: true, label: L("Uchta tomon mos ravishda teng, uchburchaklar tengligining birinchi alomati", 'Три стороны соответственно равны, первый признак равенства треугольников', 'All three sides are respectively equal, the first triangle-congruence criterion') },
          { id: 'no', label: L("Ikkita katet teng bo'lgani uchun", 'Потому что равны два катета', 'Because two legs are equal'), hint: L("Bu yerda ikkita katet emas, gipotenuza va bitta katet berilgan edi, ikkinchisi hisoblab topildi.", 'Здесь не два катета, дана гипотенуза и один катет, второй вычислен.', 'It is not two legs here, the hypotenuse and one leg were given, the second was computed.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. Gipotenuza va bir katetning tengligi ikkinchi katetni ham majburan teng qiladi, shuning uchun uchburchaklar teng.",
      'Доказано. Равенство гипотенузы и одного катета вынуждает и второй катет быть равным, поэтому треугольники равны.',
      'Proven. Equal hypotenuse and one leg force the second leg to be equal too, so the triangles are congruent.',
    ),
  },
}

// ============================================================
// EKRAN 4. ISBOT (`prooflines`). TESKARI TEOREMA, markaziy isbot.
// Ловушка, to'g'ri burchak noto'g'ri uchda (З95).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З95',
  eyebrow: L('TESKARI TEOREMANI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ОБРАТНУЮ ТЕОРЕМУ', 'PROVING THE CONVERSE THEOREM'),
  title: L(
    "Agar AB² = AC² + BC² bo'lsa, C uchidagi burchak to'g'ri bo'ladi",
    'Если AB² = AC² + BC², то угол в вершине C прямой',
    'If AB² = AC² + BC², then the angle at vertex C is right',
  ),
  audio: [
    A('mount',
      "ABC uchburchakda AB katta tomon, uning kvadrati qolgan ikkitasining yig'indisiga teng.",
      'В треугольнике ABC AB наибольшая сторона, её квадрат равен сумме двух других.',
      'In triangle ABC, AB is the longest side, its square equals the sum of the other two.'),
    A('why',
      "Yordamchi to'g'ri burchakli uchburchak yasab, uni ABC bilan solishtiramiz.",
      'Строим вспомогательный прямоугольный треугольник и сравниваем его с ABC.',
      'We build an auxiliary right triangle and compare it with ABC.'),
  ],
  props: {
    points: TRI3,
    order: TRI3_ORDER,
    marks: [],
    given: [
      L("ABC uchburchak, AB² = AC² + BC²", 'Треугольник ABC, AB² = AC² + BC²', 'Triangle ABC, AB² = AC² + BC²'),
      L("A1B1C1, to'g'ri burchakli, C1 da to'g'ri burchak, A1C1 = AC, B1C1 = BC", 'A1B1C1, прямоугольный, прямой угол в C1, A1C1 = AC, B1C1 = BC', 'A1B1C1, right-angled, right angle at C1, A1C1 = AC, B1C1 = BC'),
    ],
    goal: L("burchak C to'g'ri burchak", 'угол C прямой', 'angle C is right'),
    lines: [
      {
        text: L("A1B1² = A1C1² + B1C1² = AC² + BC²", 'A1B1² = A1C1² + B1C1² = AC² + BC²', 'A1B1² = A1C1² + B1C1² = AC² + BC²'),
        options: [
          { id: 'ok', right: true, label: L("A1B1C1 to'g'ri burchakli, shuning uchun Pifagor teoremasi qo'llaniladi", 'A1B1C1 прямоугольный, поэтому применяется теорема Пифагора', 'A1B1C1 is right-angled, so the Pythagorean theorem applies') },
          { id: 'no', label: L("Chunki A1B1 = AB deb ma'lum", 'Потому что известно A1B1 = AB', 'Because A1B1 = AB is already known'), hint: L("A1B1 hali topilmagan, u shu qatordan keyin chiqadi.", 'A1B1 пока не найдена, она получится из этой строки дальше.', 'A1B1 is not found yet, it comes out from this line further on.') },
        ],
      },
      {
        text: L("shart bo'yicha AB² = AC² + BC², demak A1B1² = AB²", 'по условию AB² = AC² + BC², значит A1B1² = AB²', 'by the given condition AB² = AC² + BC², so A1B1² = AB²'),
        options: [
          { id: 'ok', right: true, label: L("Ikkalasi ham AC² + BC² ga teng, shuning uchun o'zaro teng", 'Обе равны AC² + BC², поэтому равны между собой', 'Both equal AC² + BC², so they equal each other') },
          { id: 'no', label: L("Chunki uchburchaklar allaqachon teng", 'Потому что треугольники уже равны', 'Because the triangles are already congruent'), hint: L("Tenglik hali isbotlanmagan, aynan shu qatorda ko'rsatilayotir.", 'Равенство ещё не доказано, оно показывается именно в этой строке.', 'The congruence is not proven yet, it is being shown right in this line.') },
        ],
      },
      {
        text: L("A1B1 = AB, va uchburchaklar uch tomoniga ko'ra teng", 'A1B1 = AB, и треугольники равны по трём сторонам', 'A1B1 = AB, and the triangles are congruent by three sides'),
        options: [
          { id: 'ok', right: true, label: L("A1C1=AC, B1C1=BC, va endi A1B1=AB, uchta tomon mos", 'A1C1=AC, B1C1=BC, и теперь A1B1=AB, все три стороны соответствуют', 'A1C1=AC, B1C1=BC, and now A1B1=AB, all three sides correspond') },
          { id: 'no', label: L("Chunki ikkalasi ham to'g'ri burchakli", 'Потому что оба прямоугольные', 'Because both are right-angled'), hint: L("ABC hali to'g'ri burchakli ekani isbotlanmagan, buni hozir isbotlaymiz.", 'Про ABC ещё не доказано, что он прямоугольный, это доказывается сейчас.', 'It is not yet proven that ABC is right-angled, that is what we are proving now.') },
        ],
      },
      {
        text: L("shuning uchun burchak C burchak C1 ga teng, ya'ni burchak C to'g'ri burchak", 'поэтому угол C равен углу C1, то есть угол C прямой', 'therefore angle C equals angle C1, meaning angle C is right'),
        options: [
          { id: 'ok', right: true, label: L("Teng uchburchaklarning mos burchaklari teng, C1 esa to'g'ri burchak edi", 'У равных треугольников соответственные углы равны, а C1 был прямым', 'Congruent triangles have equal corresponding angles, and C1 was right') },
          { id: 'no', label: L("Chunki AB eng katta tomon", 'Потому что AB наибольшая сторона', 'Because AB is the longest side'), hint: L("AB katta bo'lishi burchakni to'g'ri qilmaydi, buni mos burchaklar tengligi ko'rsatadi.", 'Наибольшая сторона сама по себе не делает угол прямым, это показывает равенство углов.', 'Being the longest side alone does not make an angle right, the equal corresponding angles show it.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. To'g'ri burchak aynan ENG KATTA tomon AB ga qarama-qarshi turgan C uchida joylashadi.",
      'Доказано. Прямой угол находится именно в вершине C, лежащей против НАИБОЛЬШЕЙ стороны AB.',
      'Proven. The right angle sits exactly at vertex C, opposite the LONGEST side AB.',
    ),
  },
}

// ============================================================
// EKRAN 5. ENG KATTA TOMONNI TOPING (`geofigure`). Ловушка, tomonlar
// solishtirilmasdan tanlangan (З94).
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'geofigure',
  tag: 'З94',
  eyebrow: L('ENG KATTA TOMONNI TOPING', 'НАЙДИ НАИБОЛЬШУЮ СТОРОНУ', 'FIND THE LONGEST SIDE'),
  title: L(
    "AB = 12, BC = 11, CA = 5. Eng katta tomonni bosing",
    'AB = 12, BC = 11, CA = 5. Нажми на наибольшую сторону',
    'AB = 12, BC = 11, CA = 5. Tap the longest side',
  ),
  audio: [
    A('mount',
      "Uchburchakning uchta tomoni raqamda berilgan, o'n ikki, o'n bir va besh.",
      'Три стороны треугольника даны числами, двенадцать, одиннадцать и пять.',
      'The triangle\'s three sides are given as numbers, twelve, eleven, and five.'),
    A('why',
      "Teskari teoremani qo'llashdan oldin, avval eng katta sonni topamiz.",
      'Перед применением обратной теоремы сначала находим наибольшее число.',
      'Before applying the converse theorem, we first find the biggest number.'),
  ],
  props: {
    points: TRI5,
    order: TRI5_ORDER,
    steps: [
      {
        kind: 'edges',
        targets: ['AB'],
        ask: L("Eng katta tomonni bosing", 'Нажми на наибольшую сторону', 'Tap the longest side'),
        hints: {
          BC: L("O'n bir, o'n ikkidan kichik.", 'Одиннадцать меньше двенадцати.', 'Eleven is smaller than twelve.'),
          CA: L("Besh, uchtasining eng kichigi.", 'Пять, наименьшее из трёх.', 'Five, the smallest of the three.'),
        },
      },
    ],
    after: L(
      "To'g'ri. AB o'n ikki, eng katta tomon. Aynan uning kvadrati qolgan ikkitasining yig'indisi bilan solishtiriladi.",
      'Верно. AB равен двенадцати, это наибольшая сторона. Именно её квадрат сравнивается с суммой двух других.',
      'Correct. AB is twelve, the longest side. It is exactly its square that gets compared with the sum of the other two.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (`twoways`): darslikning ikki masalasi (99-bet).
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З94',
  eyebrow: L('IKKI MASALA', 'ДВЕ ЗАДАЧИ', 'TWO PROBLEMS'),
  title: L(
    "Ikki uchburchakni tekshirish, ikkisi ham eng katta tomondan boshlanadi",
    'Проверка двух треугольников, обе начинаются с наибольшей стороны',
    'Checking two triangles, both start from the longest side',
  ),
  audio: [
    A('mount',
      "Birinchi uchburchakning tomonlari besh, o'n bir va o'n ikki.",
      'Стороны первого треугольника пять, одиннадцать и двенадцать.',
      'The first triangle\'s sides are five, eleven, and twelve.'),
    W('w2',
      "Ikkinchisining tomonlari ildiz sakson besh, yetti va olti, eng kattasi ildiz sakson besh, olti emas.",
      'У второго стороны корень из восьмидесяти пяти, семь и шесть, наибольшая сторона это корень из восьмидесяти пяти, а не шесть.',
      'The second one\'s sides are the root of eighty-five, seven, and six, the longest is the root of eighty-five, not six.'),
    W('w4',
      "Ikkalasida ham avval eng katta tomon aniqlanadi, keyin uning kvadrati tekshiriladi.",
      'В обоих случаях сначала определяется наибольшая сторона, потом проверяется её квадрат.',
      'In both cases, the longest side is identified first, then its square is checked.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-MASALA, 5, 11, 12', 'ЗАДАЧА 1, 5, 11, 12', 'PROBLEM 1, 5, 11, 12'),
        lead: L(
          "Eng katta tomon o'n ikki, uning kvadratini tekshiramiz",
          'Наибольшая сторона двенадцать, проверяем её квадрат',
          'The longest side is twelve, we check its square',
        ),
        rows: [
          { text: '5² + 11² = 146' },
          { text: L("12² = 144, teng emas, to'g'ri burchakli emas", '12² = 144, не равно, не прямоугольный', '12² = 144, not equal, not right-angled'), tone: 'ok' },
        ],
      },
      {
        name: L('2-MASALA, √85, 7, 6', 'ЗАДАЧА 2, √85, 7, 6', 'PROBLEM 2, √85, 7, 6'),
        lead: L(
          "Endi eng katta tomon ildiz sakson besh, olti emas",
          'Теперь наибольшая сторона корень из восьмидесяти пяти, а не шесть',
          'Now the longest side is the root of eighty-five, not six',
        ),
        rows: [
          { text: '7² + 6² = 85' },
          { text: L("bu (√85)² ga teng, to'g'ri burchakli", 'это равно (√85)², прямоугольный', 'this equals (√85)², right-angled'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKI XIL NATIJA, BIR XIL USUL', 'ДВА РАЗНЫХ ОТВЕТА, ОДИН СПОСОБ', 'TWO DIFFERENT RESULTS, ONE METHOD'),
        lead: L(
          "Har safar eng katta tomon aniqlanadi, keyin tekshiriladi",
          'Каждый раз наибольшая сторона определяется первой, потом проверяется',
          'Each time the longest side is identified first, then checked',
        ),
        rows: [{ text: L("eng katta tomon aniqlanadi, keyin tekshiriladi", 'наибольшая сторона определяется, потом проверяется', 'the longest side is identified, then checked'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (`parts`): tekshirish uch qadam.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З94',
  eyebrow: L('TEKSHIRISHNING UCH QADAMI', 'ТРИ ШАГА ПРОВЕРКИ', 'THE THREE STEPS OF CHECKING'),
  title: L(
    "Tekshirishning uch qadami",
    'Три шага проверки',
    'The three steps of checking',
  ),
  audio: [
    A('mount',
      "Uchta son berilganda, teskari teorema uch qadamda qo'llaniladi.",
      'Когда даны три числа, обратная теорема применяется в три шага.',
      'When three numbers are given, the converse theorem is applied in three steps.'),
    W('p2',
      "Birinchi qadam, eng katta sonni topish, u oxirida yozilgan bo'lishi shart emas.",
      'Первый шаг, найти наибольшее число, оно не обязано быть записано последним.',
      'The first step, find the biggest number, it does not have to be written last.'),
    W('p4',
      "Uchinchi qadam, tenglikni solishtirish, teng bo'lsa, to'g'ri burchak aynan shu katta tomonga qarshi.",
      'Третий шаг, сравнить равенство, если равно, прямой угол именно против этой большой стороны.',
      'The third step, compare the equality, if equal, the right angle is exactly opposite that big side.',
    ),
  ],
  props: {
    tokens: [
      { t: 'c²', id: 'mid' },
      { t: '  ?  ', id: 'a' },
      { t: 'a² + b²', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Birinchi qadam, uchta son ichidan eng kattasini topish, uni c deb belgilaymiz.",
          'Первый шаг, найти наибольшее из трёх чисел, обозначить его c.',
          'The first step, find the biggest of the three numbers, call it c.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Ikkinchi qadam, hali hech narsa taxmin qilinmaydi, faqat kvadratlarni hisoblab, solishtiriladi.",
          'Второй шаг, ничего пока не предполагается, только считаются и сравниваются квадраты.',
          'The second step, nothing is assumed yet, the squares are simply computed and compared.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qadam, qolgan ikki sonning kvadratlari yig'indisi bilan solishtirish.",
          'Третий шаг, сравнить с суммой квадратов двух оставшихся чисел.',
          'The third step, compare with the sum of the squares of the two remaining numbers.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Qadimgi Misr yer o'lchovchilari to'g'ri burchak yasash uchun uch, to'rt va besh bo'linmalarga teng tugunli arqondan foydalanganlar, bu ham teskari teoremaning amaliy qo'llanilishi edi.",
        'Древние египетские землемеры пользовались верёвкой с узлами через три, четыре и пять делений для построения прямого угла, это тоже было практическим применением обратной теоремы.',
        'Ancient Egyptian land surveyors used a knotted rope with divisions of three, four, and five to build a right angle, this too was a practical use of the converse theorem.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 29-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З95',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Pifagor teoremasiga teskari teorema",
    'Теорема, обратная теореме Пифагора',
    'The converse of the Pythagorean theorem',
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
      { id: 'f1', label: L("istalgan katet gipotenuzadan kichik", 'любой катет меньше гипотенузы', 'any leg is smaller than the hypotenuse') },
      { id: 'f2', label: L("bir tomonning kvadrati qolgan ikkitasining yig'indisiga teng bo'lsa, uchburchak to'g'ri burchakli, va to'g'ri burchak aynan shu eng katta tomonga qarama-qarshi", 'если квадрат одной стороны равен сумме двух других, треугольник прямоугольный, и прямой угол против этой наибольшей стороны', 'if the square of one side equals the sum of the other two, the triangle is right-angled, and the right angle is opposite that longest side') },
      { id: 'f3', label: L("tekshirishdan oldin eng katta tomon aniqlanadi", 'перед проверкой определяется наибольшая сторона', 'before checking, the longest side is identified') },
      { id: 'w1', label: L("to'g'ri burchak har doim oxirgi yozilgan tomonga qarshi", 'прямой угол всегда против последней записанной стороны', 'the right angle is always opposite the last-written side') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Tomon yozilishi tartibi ahamiyatsiz, faqat qaysi son ENG KATTA ekani muhim.",
      'Так не складывается. Порядок записи сторон не важен, важно лишь какое число НАИБОЛЬШЕЕ.',
      'That does not fit. The order sides are written in does not matter, only which number is the BIGGEST.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 3-§, 29-mavzu asosida (98-100-bet)",
        'Правило на основе геометрии, § 3, тема 29 учебника (стр. 98-100)',
        'The rule is based on geometry, section 3, topic 29 of the textbook (pages 98-100)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "To'g'ri burchakli uchburchakning tomonlaridan uchinchisini topa olardik",
        'Мы умели находить третью сторону прямоугольного треугольника',
        'We could find the third side of a right triangle',
      ),
      right: L(
        "endi uchta son berilganda, uchburchak to'g'ri burchaklimi, shuni ham bila olamiz",
        'теперь по трём числам мы можем узнать, прямоугольный ли треугольник',
        'now, given three numbers, we can also tell whether the triangle is right-angled',
      ),
      winner: 'right',
      note: L(
        "Avval eng katta tomon aniqlanadi, keyin kvadratlar solishtiriladi",
        'Сначала определяется наибольшая сторона, потом сравниваются квадраты',
        'The longest side is identified first, then the squares are compared',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): to'g'ri burchaklimi, ha yoki yo'q.
// ============================================================
const ASK_RIGHT = L("Bu uchburchak to'g'ri burchaklimi?", 'Этот треугольник прямоугольный?', 'Is this triangle right-angled?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З94',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Uchta tomondan to'g'ri burchaklilikni tekshiring",
    'Проверь прямоугольность по трём сторонам',
    'Check right-angledness from three sides',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida uchta tomon berilgan.",
      'Пять заданий. В каждом даны три стороны.',
      'Five tasks. In each, three sides are given.'),
    A('why',
      "Avval eng kattasini toping, keyin uning kvadratini solishtiring.",
      'Сначала найди наибольшую, потом сравни её квадрат.',
      'First find the biggest one, then compare its square.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar avval eng katta tomon topilgan.",
      'Все пять разобраны. Каждый раз сначала находилась наибольшая сторона.',
      'All five are done. Each time the longest side was found first.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'9, 12, 15'}</Row>,
        ok: L("Ha. To'qqiz va o'n ikkining kvadratlari yig'indisi ikki yuz yigirma besh, o'n beshning kvadrati ham shu.", 'Да. Сумма квадратов девяти и двенадцати двести двадцать пять, квадрат пятнадцати тоже.', 'Yes. The sum of the squares of nine and twelve is two hundred twenty-five, the square of fifteen is the same.'),
        question: ASK_RIGHT,
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, ikkalasi ham ikki yuz yigirma besh chiqadi.", 'Посчитай, оба выходят двести двадцать пять.', 'Compute it, both come to two hundred twenty-five.') },
        ],
        solution: ['9² + 12²', '225', '15²', '225'],
      },
      {
        expr: <Row size="big" align="center">{'7, 10, 12'}</Row>,
        ok: L("Yo'q. Yetti va o'nning kvadratlari yig'indisi yuz qirq to'qqiz, o'n ikkining kvadrati esa yuz qirq to'rt.", 'Нет. Сумма квадратов семи и десяти сто сорок девять, а квадрат двенадцати сто сорок четыре.', 'No. The sum of the squares of seven and ten is a hundred forty-nine, the square of twelve is a hundred forty-four.'),
        question: ASK_RIGHT,
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, yuz qirq to'qqiz va yuz qirq to'rt teng emas.", 'Посчитай снова, сто сорок девять и сто сорок четыре не равны.', 'Compute it again, a hundred forty-nine and a hundred forty-four are not equal.') },
        ],
        solution: ['7² + 10²', '149', '12²', '144'],
      },
      {
        expr: <Row size="big" align="center">{'8, 15, 17'}</Row>,
        ok: L("Ha. Oltmish to'rt va ikki yuz yigirma beshning yig'indisi ikki yuz sakson to'qqiz, o'n yettining kvadrati ham shu.", 'Да. Сумма шестидесяти четырёх и двухсот двадцати пяти двести восемьдесят девять, квадрат семнадцати тоже.', 'Yes. The sum of sixty-four and two hundred twenty-five is two hundred eighty-nine, the square of seventeen is the same.'),
        question: ASK_RIGHT,
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, ikkalasi ham ikki yuz sakson to'qqiz chiqadi.", 'Посчитай, оба выходят двести восемьдесят девять.', 'Compute it, both come to two hundred eighty-nine.') },
        ],
        solution: ['8² + 15²', '289', '17²', '289'],
      },
      {
        expr: <Row size="big" align="center">{'6, 7, 9'}</Row>,
        ok: L("Yo'q. Olti va yettining kvadratlari yig'indisi sakson besh, to'qqizning kvadrati esa sakson bir.", 'Нет. Сумма квадратов шести и семи восемьдесят пять, а квадрат девяти восемьдесят один.', 'No. The sum of the squares of six and seven is eighty-five, the square of nine is eighty-one.'),
        question: ASK_RIGHT,
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, sakson besh va sakson bir teng emas.", 'Посчитай снова, восемьдесят пять и восемьдесят один не равны.', 'Compute it again, eighty-five and eighty-one are not equal.') },
        ],
        solution: ['6² + 7²', '85', '9²', '81'],
      },
      {
        expr: <Row size="big" align="center">{'20, 21, 29'}</Row>,
        ok: L("Ha. To'rt yuz va to'rt yuz qirq birning yig'indisi sakkiz yuz qirq bir, yigirma to'qqizning kvadrati ham shu.", 'Да. Сумма четырёхсот и четырёхсот сорока одного восемьсот сорок один, квадрат двадцати девяти тоже.', 'Yes. The sum of four hundred and four hundred forty-one is eight hundred forty-one, the square of twenty-nine is the same.'),
        question: ASK_RIGHT,
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, ikkalasi ham sakkiz yuz qirq bir chiqadi.", 'Посчитай, оба выходят восемьсот сорок один.', 'Compute it, both come to eight hundred forty-one.') },
        ],
        solution: ['20² + 21²', '841', '29²', '841'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): to'g'ri burchak qaysi ikki tomon orasida.
// ============================================================
const ASK_VERTEX = L("To'g'ri burchak qaysi ikki tomon orasida?", 'Между какими двумя сторонами прямой угол?', 'Between which two sides is the right angle?')

const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З95',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "To'g'ri burchak qaysi ikki tomon orasida ekanini toping",
    'Найди, между какими двумя сторонами прямой угол',
    'Find which two sides the right angle is between',
  ),
  audio: [
    A('mount',
      "Uchburchak to'g'ri burchakli ekani allaqachon tekshirilgan.",
      'Уже проверено, что треугольник прямоугольный.',
      'It has already been checked that the triangle is right-angled.'),
    A('why',
      "To'g'ri burchak eng katta tomonga qarshi, demak u qolgan ikkitasi ORASIDA turadi.",
      'Прямой угол против наибольшей стороны, значит он стоит МЕЖДУ двумя оставшимися.',
      'The right angle is opposite the longest side, so it stands BETWEEN the other two.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar to'g'ri burchak ikki KICHIK tomon orasida chiqdi.",
      'Все три разобраны. Каждый раз прямой угол оказывался между двумя МЕНЬШИМИ сторонами.',
      'All three are done. Each time the right angle turned out to be between the two SMALLER sides.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'9, 12, 15'}</Row>,
        ok: L("Ha. O'n besh eng katta tomon, to'g'ri burchak esa to'qqiz va o'n ikki orasida.", 'Да. Пятнадцать наибольшая сторона, а прямой угол между девятью и двенадцатью.', 'Yes. Fifteen is the longest side, and the right angle is between nine and twelve.'),
        question: ASK_VERTEX,
        items: [
          { id: 'a', right: true, label: '9, 12' },
          { id: 'b', label: '9, 15', hint: L("O'n besh eng katta tomon, u gipotenuza, to'g'ri burchak esa unga QARSHI, unda EMAS.", 'Пятнадцать наибольшая сторона, это гипотенуза, прямой угол против неё, а не рядом с ней.', 'Fifteen is the longest side, that is the hypotenuse, the right angle is opposite it, not next to it.') },
        ],
        solution: ['15 eng katta', '9, 12 orasida'],
      },
      {
        expr: <Row size="big" align="center">{'8, 15, 17'}</Row>,
        ok: L("Ha. O'n yetti eng katta tomon, to'g'ri burchak esa sakkiz va o'n besh orasida.", 'Да. Семнадцать наибольшая сторона, а прямой угол между восемью и пятнадцатью.', 'Yes. Seventeen is the longest side, and the right angle is between eight and fifteen.'),
        question: ASK_VERTEX,
        items: [
          { id: 'a', right: true, label: '8, 15' },
          { id: 'b', label: '8, 17', hint: L("O'n yetti eng katta tomon, to'g'ri burchak unga QARSHI turadi, unga tutashgan tomonlar orasida emas.", 'Семнадцать наибольшая сторона, прямой угол лежит против неё, а не рядом с ней.', 'Seventeen is the longest side, the right angle lies opposite it, not next to it.') },
        ],
        solution: ['17 eng katta', '8, 15 orasida'],
      },
      {
        expr: <Row size="big" align="center">{'20, 21, 29'}</Row>,
        ok: L("Ha. Yigirma to'qqiz eng katta tomon, to'g'ri burchak esa yigirma va yigirma bir orasida.", 'Да. Двадцать девять наибольшая сторона, а прямой угол между двадцатью и двадцатью одним.', 'Yes. Twenty-nine is the longest side, and the right angle is between twenty and twenty-one.'),
        question: ASK_VERTEX,
        items: [
          { id: 'a', right: true, label: '20, 21' },
          { id: 'b', label: '21, 29', hint: L("Yigirma to'qqiz eng katta tomon, to'g'ri burchak unga QARSHI, unga tutashgan tomon orasida emas.", 'Двадцать девять наибольшая сторона, прямой угол против неё, а не рядом с ней.', 'Twenty-nine is the longest side, the right angle is opposite it, not next to it.') },
        ],
        solution: ['29 eng katta', '20, 21 orasida'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (`drill`, приборсиз): hisoblashni son bilan tekshirish
// (З16).
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
      "Uch topshiriq. Har birida taklif qilingan xulosani tekshiring.",
      'Три задания. В каждом проверь предложенный вывод.',
      'Three tasks. In each, check the proposed conclusion.'),
    A('why',
      "Kvadratlarni hisoblab, natijalarni solishtiring.",
      'Посчитай квадраты и сравни результаты.',
      'Compute the squares and compare the results.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash xulosani tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло вывод.',
      'All three are done. Each time computation checked the conclusion.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'10, 24, 26   →   to\'g\'ri burchakli'}</Row>,
        ok: L("Ha. O'n va yigirma to'rtning kvadratlari yig'indisi olti yuz yetmish olti, yigirma oltining kvadrati ham shu.", 'Да. Сумма квадратов десяти и двадцати четырёх шестьсот семьдесят шесть, квадрат двадцати шести тоже.', 'Yes. The sum of the squares of ten and twenty-four is six hundred seventy-six, the square of twenty-six is the same.'),
        question: L("Bu xulosa to'g'rimi?", 'Верен ли этот вывод?', 'Is this conclusion correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, ikkalasi ham olti yuz yetmish olti chiqadi.", 'Посчитай, оба выходят шестьсот семьдесят шесть.', 'Compute it, both come to six hundred seventy-six.') },
        ],
        solution: ['10² + 24²', '676', '26²', '676'],
      },
      {
        expr: <Row size="big" align="center">{'9, 10, 14   →   to\'g\'ri burchakli'}</Row>,
        ok: L("Yo'q. To'qqiz va o'nning kvadratlari yig'indisi yuz sakson bir, o'n to'rtning kvadrati esa yuz to'qson olti.", 'Нет. Сумма квадратов девяти и десяти сто восемьдесят один, а квадрат четырнадцати сто девяносто шесть.', 'No. The sum of the squares of nine and ten is a hundred eighty-one, the square of fourteen is a hundred ninety-six.'),
        question: L("Bu xulosa to'g'rimi?", 'Верен ли этот вывод?', 'Is this conclusion correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, yuz sakson bir va yuz to'qson olti teng emas.", 'Посчитай снова, сто восемьдесят один и сто девяносто шесть не равны.', 'Compute it again, a hundred eighty-one and a hundred ninety-six are not equal.') },
        ],
        solution: ['9² + 10²', '181', '14²', '196'],
      },
      {
        expr: <Row size="big" align="center">{'12, 16, 20   →   to\'g\'ri burchakli'}</Row>,
        ok: L("Ha. Yuz qirq to'rt va ikki yuz ellik oltining yig'indisi to'rt yuz, yigirmaning kvadrati ham shu.", 'Да. Сумма ста сорока четырёх и двухсот пятидесяти шести четыреста, квадрат двадцати тоже.', 'Yes. The sum of a hundred forty-four and two hundred fifty-six is four hundred, the square of twenty is the same.'),
        question: L("Bu xulosa to'g'rimi?", 'Верен ли этот вывод?', 'Is this conclusion correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, ikkalasi ham to'rt yuz chiqadi.", 'Посчитай, оба выходят четыреста.', 'Compute it, both come to four hundred.') },
        ],
        solution: ['12² + 16²', '400', '20²', '400'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): tartib bo'yicha noto'g'ri tomon
// olingan (З94) va noto'g'ri uchda ko'rsatilgan (З95).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З94',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato javobda nima noto'g'ri",
    'Что неверно в двух ошибочных ответах',
    'What is wrong in two mistaken answers',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham eng katta tomon aniqlanmagan.",
      'Два задания. В обоих не определена наибольшая сторона.',
      'Two tasks. In both, the longest side was not identified.'),
    A('why',
      "Tomonlar qanday tartibda yozilgani ahamiyatsiz, faqat qaysi son eng katta ekani muhim.",
      'Порядок записи сторон не важен, важно лишь какое число наибольшее.',
      'The order sides are written in does not matter, only which number is the biggest.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham eng katta tomonni chetlab o'tishdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за того, что наибольшая сторона была обойдена.',
      'Both are done. Both mistakes came from bypassing the longest side.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'26, 10, 24   →   26² + 10² = 24² ?   776 ≠ 576, "emas"'}</Row>,
        ok: L("Ha. Eng katta tomon yigirma olti, uni o'nga va yigirma to'rtga solishtirish kerak edi, ikkalasi ham olti yuz yetmish olti chiqadi.", 'Да. Наибольшая сторона двадцать шесть, её нужно было сравнить с десятью и двадцатью четырьмя, оба выходят шестьсот семьдесят шесть.', 'Yes. The longest side is twenty-six, it should have been compared with ten and twenty-four, both come to six hundred seventy-six.'),
        question: L("Tomonlar yigirma olti, o'n va yigirma to'rt bo'lsa, va yuqoridagicha xulosa qilingan bo'lsa, bu yerda xato qayerda?", 'Если стороны двадцать шесть, десять и двадцать четыре, а вывод сделан как выше, в чём здесь ошибка?', 'If the sides are twenty-six, ten, and twenty-four, and the conclusion was made as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Oxirida yozilgan son gipotenuza deb olingan, aslida eng kattasi yigirma olti", 'Гипотенузой взято последнее записанное число, а наибольшее на самом деле двадцать шесть', 'The last-written number was taken as the hypotenuse, while the actual longest is twenty-six') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, eng katta tomon yigirma olti, yigirma to'rt emas.", 'Это и есть показанная ошибка, наибольшая сторона двадцать шесть, а не двадцать четыре.', 'This is the very mistake shown; the longest side is twenty-six, not twenty-four.') },
        ],
        solution: ['10² + 24²', '676', '26²', '676'],
      },
      {
        expr: <Row size="big" align="center">{'9, 12, 15 → to\'g\'ri burchakli, "9 va 15 orasida"'}</Row>,
        ok: L("Ha. O'n besh eng katta tomon, gipotenuza, to'g'ri burchak unga QARSHI, ya'ni to'qqiz va o'n ikki orasida.", 'Да. Пятнадцать наибольшая сторона, гипотенуза, прямой угол ПРОТИВ неё, то есть между девятью и двенадцатью.', 'Yes. Fifteen is the longest side, the hypotenuse, the right angle is OPPOSITE it, that is between nine and twelve.'),
        question: L("Uchburchak to'g'ri burchakli ekani to'g'ri topilgan bo'lsa, ammo to'g'ri burchak yuqoridagicha ko'rsatilgan bo'lsa, bu yerda xato qayerda?", 'Если верно найдено, что треугольник прямоугольный, но прямой угол указан как выше, в чём здесь ошибка?', 'If it was correctly found that the triangle is right-angled, but the right angle was placed as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("To'g'ri burchak gipotenuza yoniga qo'yilgan, unga qarshi emas", 'Прямой угол поставлен рядом с гипотенузой, а не против неё', 'The right angle was placed next to the hypotenuse, not opposite it') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, to'g'ri burchak to'qqiz va o'n ikki orasida bo'lishi kerak.", 'Это и есть показанная ошибка, прямой угол должен быть между девятью и двенадцатью.', 'This is the very mistake shown; the right angle should be between nine and twelve.') },
        ],
        solution: ['9² + 12²', '225', '15²', '225'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): 2-natija, gipotenuza va katetdan
// ikkinchi katetni topish (tengligi congruence uchun).
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З96',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Gipotenuza va bir katetdan ikkinchisini qadamlab toping",
    'По гипотенузе и одному катету найди второй, по шагам',
    'From the hypotenuse and one leg, find the second, step by step',
  ),
  audio: [
    A('mount',
      "Gipotenuza va bir katet berilgan. Ikkinchi katet qadamlab topiladi.",
      'Даны гипотенуза и один катет. Второй катет находится по шагам.',
      'The hypotenuse and one leg are given. The second leg is found step by step.'),
    A('why',
      "Agar ikkinchi uchburchakda ham xuddi shu ikkitasi berilsa, ikkinchi katet ham xuddi shunday chiqadi, demak uchburchaklar teng.",
      'Если во втором треугольнике даны те же два числа, второй катет получится таким же, значит треугольники равны.',
      'If a second triangle is given the same two numbers, its second leg comes out the same, so the triangles are congruent.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar gipotenuza va katetdan ikkinchi katet topilgan.",
      'Все три заполнены. Каждый раз по гипотенузе и катету находился второй катет.',
      'All three are filled. Each time the second leg was found from the hypotenuse and a leg.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['8'],
      lines: [
        [{ t: 'c = 10, a = 6   →   b = ' }, { slot: '8' }],
      ],
    },
    tasks: [
      {
        chips: ['12'],
        lines: [
          [{ t: 'c = 13, a = 5   →   b = ' }, { slot: '12' }],
        ],
      },
      {
        chips: ['15'],
        lines: [
          [{ t: 'c = 17, a = 8   →   b = ' }, { slot: '15' }],
        ],
      },
      {
        chips: ['24'],
        lines: [
          [{ t: 'c = 25, a = 7   →   b = ' }, { slot: '24' }],
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
    "Teskari teorema bo'yicha to'rt savol",
    'Четыре вопроса об обратной теореме',
    'Four questions about the converse theorem',
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
        id: 'q1', tag: 'З94',
        ask: L('Tomonlari sakkiz, o\'n besh va o\'n yetti bo\'lsa, bu uchburchak to\'g\'ri burchaklimi?', 'Если стороны восемь, пятнадцать и семнадцать, этот треугольник прямоугольный?', 'If the sides are eight, fifteen, and seventeen, is this triangle right-angled?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Eng katta tomon o'n yetti. Oltmish to'rt va ikki yuz yigirma beshni qo'shing.", 'Наибольшая сторона семнадцать. Сложи шестьдесят четыре и двести двадцать пять.', 'The longest side is seventeen. Add sixty-four and two hundred twenty-five.'),
        ok: L("To'g'ri, ikkalasi ham ikki yuz sakson to'qqiz chiqadi.", 'Верно, оба выходят двести восемьдесят девять.', 'Correct, both come to two hundred eighty-nine.'),
      },
      {
        id: 'q2', tag: 'З95',
        ask: L('To\'g\'ri burchakli uchburchakda tomonlari to\'qqiz, o\'n ikki, o\'n besh bo\'lsa, to\'g\'ri burchak qaysi ikki tomon orasida?', 'В прямоугольном треугольнике со сторонами девять, двенадцать, пятнадцать, между какими двумя сторонами прямой угол?', 'In a right triangle with sides nine, twelve, fifteen, between which two sides is the right angle?'),
        options: [
          { id: 'ok', right: true, label: '9, 12' },
          { id: 'no', label: '9, 15' },
        ],
        hint: L("O'n besh eng katta tomon, to'g'ri burchak unga qarshi, unda emas.", 'Пятнадцать наибольшая сторона, прямой угол против неё, а не рядом.', 'Fifteen is the longest side, the right angle is opposite it, not next to it.'),
        ok: L("To'g'ri, to'g'ri burchak ikki kichik tomon orasida.", 'Верно, прямой угол между двумя меньшими сторонами.', 'Correct, the right angle is between the two smaller sides.'),
      },
      {
        id: 'q3', tag: 'З96',
        ask: L('Ikki to\'g\'ri burchakli uchburchakning gipotenuzasi va bir katetlari mos ravishda teng bo\'lsa, bu uchburchaklar haqida nima deyish mumkin?', 'Если у двух прямоугольных треугольников соответственно равны гипотенуза и один катет, что можно сказать об этих треугольниках?', 'If two right triangles have a respectively equal hypotenuse and one leg, what can be said about these triangles?'),
        options: [
          { id: 'ok', right: true, label: L('Har doim teng', 'Всегда равны', 'Always congruent') },
          { id: 'no', label: L('Har doim teng emas', 'Не всегда равны', 'Not always congruent') },
        ],
        hint: L("Ikkinchi katet ham majburan teng chiqadi, Pifagor formulasidan.", 'Второй катет тоже обязательно получится равным, по формуле Пифагора.', 'The second leg also necessarily comes out equal, from the Pythagorean formula.'),
        ok: L("To'g'ri, gipotenuza va bir katetning tengligi ikkinchi katetni ham teng qiladi.", 'Верно, равенство гипотенузы и катета делает равным и второй катет.', 'Correct, equal hypotenuse and leg make the second leg equal too.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('20² + 21², 841ga tengmi?', 'Верно ли, что 20² + 21², равно 841?', 'Is it true that 20² + 21² equals 841?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, to'rt yuz va to'rt yuz qirq bir qo'shiladi.", 'Посчитай, складываются четыреста и четыреста сорок один.', 'Compute it, four hundred and four hundred forty-one are added.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З94',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Tomonlari yetti, yigirma to'rt va yigirma besh bo'lgan uchburchakni tekshirib yig'ing.",
            'Собери проверку треугольника со сторонами семь, двадцать четыре и двадцать пять.',
            'Assemble the check for a triangle with sides seven, twenty-four, and twenty-five.',
          ),
          lines: [
            [{ t: 'Eng katta: ' }, { slot: '25' }, { t: '   →   7² + 24² = ' }, { slot: '625' }],
          ],
          tiles: [
            { id: 't1', v: '25', x: 12, y: 12 },
            { id: 't2', v: '625', x: 60, y: 14 },
            { id: 't3', v: '31', x: 30, y: 50 },
            { id: 't4', v: '576', x: 78, y: 48 },
          ],
          hint: L(
            "Uchtasidan eng kattasini tanlang, keyin qolgan ikkitasining kvadratlarini qo'shing.",
            'Выбери наибольшее из трёх, потом сложи квадраты двух оставшихся.',
            'Pick the biggest of the three, then add the squares of the other two.',
          ),
          doneNote: L(
            "Yig'ildi. Yigirma beshning kvadrati ham olti yuz yigirma besh, demak to'g'ri burchakli.",
            'Собрано. Квадрат двадцати пяти тоже шестьсот двадцать пять, значит прямоугольный.',
            'Assembled. The square of twenty-five is also six hundred twenty-five, so it is right-angled.',
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
    "Avval eng katta tomon, keyin tekshirish",
    'Сначала наибольшая сторона, потом проверка',
    'The longest side first, then the check',
  ),
  audio: [
    A('s0',
      "Darsdan bitta odat qoladi. Uchta son ko'rilganda, avval eng kattasi topiladi.",
      'С урока остаётся одна привычка. Увидев три числа, сначала находится наибольшее.',
      'One habit stays with you. Seeing three numbers, the biggest is found first.'),
    A('s1',
      "Bugun uch narsa qilindi. Ikkinchi katet ham teng chiqishini isbotladingiz, teskari teoremani isbotladingiz va eng katta tomonni aniqlashni mashq qildingiz.",
      'Сегодня сделано три вещи. Ты доказал, что и второй катет получается равным, доказал обратную теорему, и потренировался определять наибольшую сторону.',
      'Three things are done today. You proved the second leg comes out equal too, proved the converse theorem, and practiced identifying the longest side.'),
    A('s2',
      "Keyingi darsda gipotenuzaga tushirilgan balandlik va Geron formulasi. Ikkalasi ham xuddi shu uchta tomondan hisoblanadi.",
      'В следующем уроке высота, опущенная на гипотенузу, и формула Герона. Обе считаются по тем же трём сторонам.',
      'The next lesson covers the height to the hypotenuse and Heron\'s formula. Both are computed from the same three sides.',
    ),
  ],
  props: {
    mark: L("avval eng katta, keyin tekshirish", 'сначала наибольшая, потом проверка', 'the biggest first, then the check'),
    markNote: L(
      "9, 12, 15 → o'n besh eng katta, tekshirilgan, to'g'ri burchakli",
      '9, 12, 15 → пятнадцать наибольшая, проверено, прямоугольный',
      '9, 12, 15 → fifteen is the biggest, checked, right-angled',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: balandlik va Geron formulasi",
      'Следующий урок: высота и формула Герона',
      'Next lesson: the height and Heron\'s formula',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
