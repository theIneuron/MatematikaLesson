// ============================================================================
// 8-sinf, Dars 43. FALYES TEOREMASI. UCHBURCHAK VA TRAPETSIYANING O'RTA
// CHIZIG'I.
//
// BLOK Б6 NING SO'NGGI DARSI. Bu fayl, FAQAT MA'LUMOT. Mexanika
// `screens.jsx`, `geofigure.jsx`, `prooflines.jsx`, `tools.jsx`, `feed.jsx`,
// `method.jsx` da. Yangi pribor YO'Q — `GeoFigure` va `ProofLines` (Dars 37)
// qayta ishlatiladi.
//
// KARKAS: Dars 37-42 dagidek, SCREENS to'g'ridan-to'g'ri qurilgan.
//
// MANBA: 8-sinf geometriya darsligi, I bob, 8-, 11- va 12-mavzular
// (27-, 34-, 40-bet). Uch mavzu bitta darsga birlashtirilgan (rejaga
// ko'ra, o'rta chiziq mavzulari darslikdagi joyidan bu darsga
// ko'chirilgan, dars 39 va 42 ning boshida bu qayd etilgan edi). Barcha
// ta'rif, teorema va misollar darslikdan:
//   - Falyes teoremasi (40-bet): agar parallel to'g'ri chiziqlar birini
//     kesuvchidan teng kesmalar ajratsa, ular ikkinchi kesuvchidan ham
//     teng kesmalar ajratadi;
//   - uchburchakning o'rta chizig'i (27-bet): ikki tomon o'rtalarini
//     tutashtiruvchi kesma uchinchi tomonga parallel va unga teng
//     ikkiga bo'linadi;
//   - trapetsiyaning o'rta chizig'i (34-bet): yon tomonlar o'rtalarini
//     tutashtiruvchi kesma asoslariga parallel va ularning yig'indisining
//     yarmiga teng.
//
// ADASHISHLAR, ikkitasi yangi:
//   З89, Falyes teoremasi chiziqlarning PARALLEL ekanini tekshirmasdan
//   qo'llanilgan;
//   З90, o'rta chiziq to'liq tomon yoki asosga teng deb hisoblangan,
//   ikkiga bo'lish unutilgan;
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
  id: 'geo-8-43',
  n: 43,
  row: 48,
  block: 'Б6',
  topic: L(
    "Falyes teoremasi, uchburchak va trapetsiyaning o'rta chizig'i",
    'Теорема Фалеса, средняя линия треугольника и трапеции',
    'The Thales theorem, the midline of the triangle and the trapezoid',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Agar parallel to'g'ri chiziqlar bir kesuvchidan teng kesmalar ajratsa, ular istalgan boshqa kesuvchidan ham teng kesmalar ajratadi",
    'Если параллельные прямые отсекают на одной секущей равные отрезки, они отсекают равные отрезки и на любой другой секущей',
    'If parallel lines cut off equal segments on one transversal, they cut off equal segments on any other transversal too',
  ),
  L(
    "Uchburchakning o'rta chizig'i uchinchi tomonga parallel va unga teng ikkiga bo'linadi",
    'Средняя линия треугольника параллельна третьей стороне и равна её половине',
    "A triangle's midline is parallel to the third side and equals half of it",
  ),
  L(
    "Trapetsiyaning o'rta chizig'i asoslariga parallel va ularning yig'indisining yarmiga teng",
    'Средняя линия трапеции параллельна основаниям и равна половине их суммы',
    "A trapezoid's midline is parallel to the bases and equals half their sum",
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З89': {
    what: L(
      "Falyes teoremasi chiziqlarning parallel ekanini tekshirmasdan qo'llanilgan",
      'теорема Фалеса применена без проверки параллельности прямых',
      'the Thales theorem was applied without checking that the lines are parallel',
    ),
    wrong: null,
    at: 12,
  },
  'З90': {
    what: L(
      "o'rta chiziq to'liq tomon yoki asosga teng deb hisoblangan, ikkiga bo'lish unutilgan",
      'средняя линия принята равной целой стороне или основанию, забыто деление на два',
      'the midline was taken as equal to the whole side or base, the division by two was forgotten',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (4-ekran, ProofLines). ABC uchburchak, M va N,
// AB va BC tomonlarining o'rtalari.
// ============================================================
const TRI_MN = { A: [20, 90], B: [65, 25], C: [110, 90], M: [42.5, 57.5], N: [87.5, 57.5] }
const TRI_MN_ORDER = ['A', 'B', 'C']

// ============================================================
// SAHNALAR (§6). Xuk: teng kesmalar bir chiziqdan ikkinchisiga qanday
// o'tadi. Yakun: uch teorema, bitta g'oya, parallel chiziqlar.
// ============================================================
const SC_ASK = L('TENG KESMALAR QAYERGA O\'TADI', 'КУДА ПЕРЕХОДЯТ РАВНЫЕ ОТРЕЗКИ', 'WHERE DO EQUAL SEGMENTS GO')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <line x1="130" y1="40" x2="260" y2="40" stroke={T.ink3} strokeWidth="1.4"/>
      <line x1="130" y1="65" x2="260" y2="65" stroke={T.ink3} strokeWidth="1.4"/>
      <line x1="130" y1="90" x2="260" y2="90" stroke={T.ink3} strokeWidth="1.4"/>
      <line x1="150" y1="30" x2="220" y2="100" stroke={T.graph} strokeWidth="1.4"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="195" cy="65" r="15" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="195" y="71" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Uch teorema, bitta g'oya, parallel chiziqlar",
      'Три теоремы, одна идея, параллельные прямые',
      'Three theorems, one idea, parallel lines',
    )}>
      <text x="195" y="45" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fill={T.ink}>{'Falyes: teng → teng'}</text>
      <g className="g8-seat" style={{ '--d': '1300ms' }}>
        <text x="195" y="70" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
          fill={T.ok}>{"o'rta chiziq = yarmi"}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1900ms' }}>
        <text x="195" y="95" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>{"uchburchakda va trapetsiyada"}</text>
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
  eyebrow: L('UCH TENG KESMA', 'ТРИ РАВНЫХ ОТРЕЗКА', 'THREE EQUAL SEGMENTS'),
  title: L(
    "Uch parallel chiziq bir kesuvchidan teng kesmalar ajratadi. Ikkinchi kesuvchida nima bo'ladi",
    'Три параллельные прямые отсекают на одной секущей равные отрезки. Что будет на второй секущей',
    'Three parallel lines cut off equal segments on one transversal. What happens on the second transversal',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Uch parallel chiziq bitta kesuvchidan teng uch kesma ajratadi.",
      'Три параллельные прямые отсекают на одной секущей три равных отрезка.',
      'Three parallel lines cut three equal segments on one transversal.'),
    A('why',
      "Taxmin qiling, ikkinchi kesuvchida bu kesmalar qanday bo'ladi.",
      'Предположи, какими будут эти отрезки на второй секущей.',
      'Predict what these segments will be like on the second transversal.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Ikkinchi kesuvchidagi uch kesma haqida nima deyish mumkin?",
      'Что можно сказать о трёх отрезках на второй секущей?',
      'What can be said about the three segments on the second transversal?',
    ),
    items: [
      { id: 'a', show: L("Ular ham o'zaro teng", 'Они тоже равны друг другу', 'They are also equal to each other') },
      { id: 'b', show: L("Ular ikki marta kattalashadi", 'Они увеличиваются вдвое', 'They double in size') },
      { id: 'c', show: L("Ular butunlay boshqacha", 'Они совсем другие', 'They are completely different') },
      { id: 'd', show: L("Bu haqida hech narsa deyib bo'lmaydi", 'Об этом ничего нельзя сказать', 'Nothing can be said about this') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Parallel chiziqlar orasidagi masofa o'zgarmas
// (darslar 39-42 dan).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Parallel chiziqlar haqidagi faktni eslash",
    'Вспоминаем факт о параллельных прямых',
    'Recalling a fact about parallel lines',
  ),
  audio: [
    A('mount',
      "Oldingi darslarda parallel chiziqlar orasidagi masofa haqida bir fakt qayta-qayta ishlatilgan edi.",
      'В прошлых уроках снова и снова использовался один факт о расстоянии между параллельными прямыми.',
      'In previous lessons, one fact about the distance between parallel lines was used again and again.'),
    A('why',
      "Bu fakt bugun Falyes teoremasining isbotida ham kerak bo'ladi.",
      'Этот факт понадобится и сегодня, в доказательстве теоремы Фалеса.',
      "This fact will be needed today too, in the proof of Thales' theorem."),
  ],
  props: {
    ask: L(
      "Ikki parallel chiziq orasidagi masofa haqida qaysi gap to'g'ri?",
      'Какое утверждение верно о расстоянии между двумя параллельными прямыми?',
      'Which statement is true about the distance between two parallel lines?',
    ),
    items: [
      { id: 'right', show: L("U hamma joyda bir xil", 'Оно везде одинаковое', 'It is the same everywhere'), right: true, name: L('parallel chiziqlarning asosiy xossasi', 'основное свойство параллельных прямых', 'the main property of parallel lines') },
      {
        id: 'wrong1', show: L("U bir uchida kattaroq", 'Оно больше на одном конце', 'It is larger at one end'),
        hint: L("Parallel chiziqlar hech qachon yaqinlashmaydi yoki uzoqlashmaydi.", 'Параллельные прямые никогда не сближаются и не расходятся.', 'Parallel lines never get closer or farther apart.'),
      },
      {
        id: 'wrong2', show: L("Uni o'lchab bo'lmaydi", 'Его нельзя измерить', 'It cannot be measured'),
        hint: L("Masofa har doim o'lchanadi, u faqat o'zgarmas qoladi.", 'Расстояние всегда измеримо, оно просто остаётся неизменным.', 'The distance is always measurable, it just stays constant.'),
      },
    ],
    after: L(
      "To'g'ri. Bu o'zgarmaslik bugungi barcha teoremalarning kaliti.",
      'Верно. Это постоянство, ключ ко всем сегодняшним теоремам.',
      'Correct. This constancy is the key to all of today\'s theorems.',
    ),
  },
}

// ============================================================
// EKRAN 3. TENG KESMALARGA TAP (`geofigure`). Falyes teoremasi:
// parallel chiziqlar teng kesmalarni saqlaydi.
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'geofigure',
  tag: 'З89',
  eyebrow: L('PARALLEL SHARTINI TEKSHIRING', 'ПРОВЕРЬ УСЛОВИЕ ПАРАЛЛЕЛЬНОСТИ', 'CHECK THE PARALLEL CONDITION'),
  title: L(
    "Uchburchakda qaysi tomonlar parallel ekanini belgilang",
    'Отметь, какие стороны треугольника параллельны',
    'Mark which sides of the triangle are parallel',
  ),
  audio: [
    A('mount',
      "Falyes teoremasi faqat chiziqlar rostdan ham parallel bo'lgandagina ishlaydi.",
      'Теорема Фалеса работает только тогда, когда прямые действительно параллельны.',
      "Thales' theorem works only when the lines are truly parallel."),
    A('why',
      "ABC uchburchakda MN, AC ga parallel. Shu juftni belgilang.",
      'В треугольнике ABC MN параллельна AC. Отметь эту пару.',
      'In triangle ABC, MN is parallel to AC. Mark this pair.'),
  ],
  props: {
    points: TRI_MN,
    order: TRI_MN_ORDER,
    steps: [
      {
        kind: 'edges',
        targets: ['AC'],
        ask: L("MN ga parallel tomonni bosing", 'Нажми сторону, параллельную MN', 'Tap the side parallel to MN'),
        hints: {
          AB: L("AB, MN ga parallel emas, M aynan shu tomonning o'rtasida turadi.", 'AB не параллельна MN, M стоит ровно на середине этой стороны.', 'AB is not parallel to MN, M stands right at the midpoint of this side.'),
          BC: L("BC ham parallel emas, N aynan shu tomonning o'rtasida turadi.", 'BC тоже не параллельна, N стоит ровно на середине этой стороны.', 'BC is also not parallel, N stands right at the midpoint of this side.'),
        },
      },
    ],
    after: L(
      "To'g'ri. MN va AC parallel, shuning uchun Falyes teoremasi va o'rta chiziq haqidagi natija ishlaydi.",
      'Верно. MN и AC параллельны, поэтому работают теорема Фалеса и вывод о средней линии.',
      "Correct. MN and AC are parallel, so Thales' theorem and the midline result apply.",
    ),
  },
}

// ============================================================
// EKRAN 4. ISBOT (`prooflines`). Uchburchakning o'rta chizig'i haqidagi
// teorema.
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З90',
  eyebrow: L('O\'RTA CHIZIQNI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ СРЕДНЮЮ ЛИНИЮ', 'PROVING THE MIDLINE'),
  title: L(
    "Uchburchakning o'rta chizig'i uchinchi tomonning yarmiga teng",
    'Средняя линия треугольника равна половине третьей стороны',
    "A triangle's midline equals half the third side",
  ),
  audio: [
    A('mount',
      "ABC uchburchak, M va N, AB va BC tomonlarining o'rtalari.",
      'Треугольник ABC, M и N, середины сторон AB и BC.',
      'Triangle ABC, M and N, the midpoints of sides AB and BC.'),
    A('why',
      "Falyes teoremasidan foydalanib, MN ning AC ga parallel va teng yarim ekanini ko'rsatamiz.",
      'Используя теорему Фалеса, покажем, что MN параллельна AC и равна её половине.',
      "Using Thales' theorem, we show MN is parallel to AC and equals half of it."),
  ],
  props: {
    points: TRI_MN,
    order: TRI_MN_ORDER,
    marks: [['M', 'N']],
    given: [
      L("ABC, uchburchak", 'ABC, треугольник', 'ABC, a triangle'),
      L("M, N, AB va BC tomonlarining o'rtalari", 'M, N, середины сторон AB и BC', 'M, N, the midpoints of sides AB and BC'),
    ],
    goal: L("MN parallel AC, MN = ½ AC", 'MN параллельна AC, MN = ½ AC', 'MN is parallel to AC, MN = ½ AC'),
    lines: [
      {
        text: L("BM/BA teng BN/BC ga (ikkalasi ham ikkidan bir)", 'BM/BA равно BN/BC (оба равны одной второй)', 'BM/BA equals BN/BC (both equal one half)'),
        options: [
          { id: 'ok', right: true, label: L("M va N mos tomonlarning o'rtalari, shuning uchun nisbatlar teng", 'M и N середины соответствующих сторон, поэтому отношения равны', 'M and N are midpoints of the matching sides, so the ratios are equal') },
          { id: 'no', label: L("Chunki uchburchak teng tomonli", 'Потому что треугольник равносторонний', 'Because the triangle is equilateral'), hint: L("Uchburchak haqida bunday shart berilmagan, faqat o'rtalar haqida.", 'Такого условия о треугольнике не дано, только про середины.', 'No such condition about the triangle was given, only about the midpoints.') },
        ],
      },
      {
        text: L("shuning uchun MN parallel AC", 'поэтому MN параллельна AC', 'therefore MN is parallel to AC'),
        options: [
          { id: 'ok', right: true, label: L("Teng nisbatda bo'lingan tomonlarni tutashtiruvchi kesma uchinchi tomonga parallel", 'Отрезок, соединяющий стороны в равном отношении, параллелен третьей стороне', 'The segment joining the sides in equal ratio is parallel to the third side') },
          { id: 'no', label: L("Chertyozhda shunday ko'rinadi", 'Так выглядит на чертеже', 'That is how it looks on the drawing'), hint: L("Ko'rinish isbot emas, nisbatlar tengligidan foydalaning.", 'Внешний вид не доказательство, используй равенство отношений.', 'Appearance is not a proof, use the equality of the ratios.') },
        ],
      },
      {
        text: L("MN teng ikkidan bir AC ga", 'MN равна одной второй AC', 'MN equals one half of AC'),
        options: [
          { id: 'ok', right: true, label: L("Parallel bo'lgani uchun uchburchak BMN uchburchak BAC ga o'xshash, koeffitsiyenti ikkidan bir", 'Из-за параллельности треугольник BMN подобен треугольнику BAC с коэффициентом одна вторая', 'Being parallel, triangle BMN is similar to triangle BAC with ratio one half') },
          { id: 'no', label: L("Chunki M va N o'rtalar", 'Потому что M и N середины', 'Because M and N are midpoints'), hint: L("O'rta bo'lishning o'zi yetarli emas, o'xshashlik koeffitsiyentidan foydalaning.", 'Того, что это середины, недостаточно, используй коэффициент подобия.', 'Being midpoints alone is not enough, use the similarity ratio.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. O'rta chiziq uchinchi tomonga parallel va aynan uning yarmi.",
      'Доказано. Средняя линия параллельна третьей стороне и равна ровно её половине.',
      'Proven. The midline is parallel to the third side and equals exactly half of it.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI (`geofigure`). O'rta chiziqni belgilash,
// uchburchakdagi barcha uch o'rta chiziqni topish.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'geofigure',
  tag: 'З90',
  eyebrow: L('BARCHA O\'RTA CHIZIQLARNI TOPING', 'НАЙДИ ВСЕ СРЕДНИЕ ЛИНИИ', 'FIND ALL THE MIDLINES'),
  title: L(
    "Uchburchakda uchta tomonning uchtasi ham o'rtalarga ega",
    'У треугольника у всех трёх сторон есть середины',
    'A triangle has midpoints on all three of its sides',
  ),
  audio: [
    A('mount',
      "Har qanday uchburchakda uchta o'rta chiziq bor, chunki uchta tomon bor.",
      'В любом треугольнике три средних линии, ведь сторон три.',
      'Any triangle has three midlines, since it has three sides.'),
    A('why',
      "Uchburchakning barcha burchaklarini bosib chiqing, har biri o'rta chiziqning bir uchi.",
      'Нажми все вершины треугольника, каждая, конец одной из средних линий.',
      'Tap all the vertices of the triangle, each one an end of a midline.'),
    W('mark',
      "Uchtasi ham topildi. Ular uchburchakni to'rt kichik teng uchburchakka ajratadi.",
      'Все три найдены. Они делят треугольник на четыре равных маленьких треугольника.',
      'All three are found. They split the triangle into four equal small triangles.'),
  ],
  props: {
    points: TRI_MN,
    order: TRI_MN_ORDER,
    steps: [
      {
        kind: 'angles',
        targets: ['A', 'B', 'C'],
        ask: L("Uchburchakning barcha uchlarini bosing", 'Нажми все вершины треугольника', 'Tap all the vertices of the triangle'),
        hints: { '*': L("Har bir uch bosilishi kerak, birontasi ham qolmasin.", 'Каждую вершину нужно нажать, ни одну не пропустить.', 'Every vertex must be tapped, none skipped.') },
      },
    ],
    after: L(
      "To'g'ri. Har bir juft tomonning o'rtalari orasida bitta o'rta chiziq bor, jami uchta.",
      'Верно. Между серединами каждой пары сторон есть одна средняя линия, всего три.',
      'Correct. Between the midpoints of each pair of sides there is one midline, three in total.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): trapetsiyaning o'rta
// chizig'ini ikki xil isbotlash yo'li (34-bet).
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З90',
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Trapetsiyaning o'rta chizig'ini ikki xil yo'l bilan topish",
    'Найти среднюю линию трапеции двумя разными путями',
    'Finding the midline of a trapezoid in two different ways',
  ),
  audio: [
    A('mount',
      "Asoslari o'n va olti. Ikki yo'l bir xil o'rta chiziqni beradi.",
      'Основания десять и шесть. Два пути дают одну среднюю линию.',
      'The bases are ten and six. Two ways give the same midline.'),
    W('w2',
      "Birinchi yo'lda formula to'g'ridan-to'g'ri qo'llaniladi, asoslar qo'shilib ikkiga bo'linadi.",
      'В первом пути формула применяется прямо, основания складываются и делятся на два.',
      'In the first way, the formula is applied directly, the bases are added and divided by two.'),
    W('w4',
      "Ikkinchi yo'lda trapetsiya diagonal bilan uchburchakka ajratilib, o'rta chiziqlar taqqoslanadi.",
      'Во втором пути трапеция делится диагональю на треугольник, и сравниваются средние линии.',
      'In the second way, the trapezoid is split by a diagonal into a triangle, and midlines are compared.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL, FORMULA', 'СПОСОБ 1, ФОРМУЛА', 'METHOD 1, THE FORMULA'),
        lead: L(
          "Asoslarni qo'shib, ikkiga bo'lamiz",
          'Складываем основания и делим на два',
          'We add the bases and divide by two',
        ),
        rows: [
          { text: '(10+6) : 2' },
          { text: L("sakkiz chiqadi", 'выходит восемь', 'comes out to eight'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL, UCHBURCHAKKA AJRATISH', 'СПОСОБ 2, РАЗБИЕНИЕ НА ТРЕУГОЛЬНИК', 'METHOD 2, SPLITTING INTO A TRIANGLE'),
        lead: L(
          "Diagonal bilan trapetsiyani ajratib, uchburchakning o'rta chizig'idan foydalanamiz",
          'Разделив трапецию диагональю, используем среднюю линию треугольника',
          'Splitting the trapezoid by a diagonal, we use the triangle\'s midline',
        ),
        rows: [
          { text: L("uchburchakning o'rta chizig'i orqali qurilma", 'построение через среднюю линию треугольника', 'a construction through the triangle\'s midline') },
          { text: L("yana sakkiz chiqadi", 'снова выходит восемь', 'again comes out to eight'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL NATIJA BERDI', 'ОБА ДАЛИ ОДИН РЕЗУЛЬТАТ', 'BOTH GAVE THE SAME RESULT'),
        lead: L(
          "Formula tezroq, uchburchakka ajratish esa nega ishlashini ko'rsatadi",
          'Формула быстрее, а разбиение показывает, почему это работает',
          'The formula is faster, splitting shows why it works',
        ),
        rows: [{ text: '8', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): Falyes teoremasining uch
// qismi.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З89',
  eyebrow: L('TEOREMANING UCH QISMI', 'ТРИ ЧАСТИ ТЕОРЕМЫ', 'THE THREE PARTS OF THE THEOREM'),
  title: L(
    "Falyes teoremasining uch qismi",
    'Три части теоремы Фалеса',
    "The three parts of Thales' theorem",
  ),
  audio: [
    A('mount',
      "Bir teorema, uch qism. Birinchi shart hech qachon tashlab qo'yilmasligi kerak.",
      'Одна теорема, три части. Первое условие никогда нельзя пропускать.',
      'One theorem, three parts. The first condition must never be skipped.'),
    W('p2',
      "Chiziqlar parallel bo'lishi shart, aks holda teorema ishlamaydi.",
      'Прямые обязаны быть параллельными, иначе теорема не работает.',
      'The lines must be parallel, otherwise the theorem does not work.'),
    W('p4',
      "Bitta kesuvchida teng kesmalar bo'lsa, ikkinchisida ham teng bo'ladi.",
      'Если на одной секущей отрезки равны, то и на другой они равны.',
      'If the segments are equal on one transversal, they are equal on the other too.',
    ),
  ],
  props: {
    tokens: [
      { t: 'l₁ ∥ l₂ ∥ l₃', id: 'a' },
      { t: '  ,  ', id: 'mid' },
      { t: 'AB = BC  →  A₁B₁ = B₁C₁', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qism, shart. Uch chiziq parallel bo'lishi kerak.",
          'Первая часть, условие. Три прямые должны быть параллельны.',
          'The first part, the condition. Three lines must be parallel.',
        ),
      },
      {
        focus: 'mid',
        text: L(
          "Shartsiz xulosa chiqmaydi, u avval tekshiriladi.",
          'Без условия вывод не следует, его сначала проверяют.',
          'Without the condition the conclusion does not follow, it is checked first.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi qism, bir kesuvchidagi tenglik. Uchinchi qism, natija, ikkinchi kesuvchidagi tenglik.",
          'Вторая часть, равенство на одной секущей. Третья часть, вывод, равенство на другой секущей.',
          'The second part, equality on one transversal. The third part, the conclusion, equality on the other.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Falyes teoremasi qadimgi yunon olimi Falyesning nomi bilan ataladi, u piramidaning balandligini soyasi orqali o'lchagan deb hisoblanadi.",
        'Теорема Фалеса названа в честь древнегреческого учёного Фалеса, который, как считается, измерил высоту пирамиды по её тени.',
        'The Thales theorem is named after the ancient Greek scholar Thales, believed to have measured the height of a pyramid by its shadow.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Uch mavzuning teoremalari.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З90',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Falyes teoremasi va ikki o'rta chiziq",
    'Теорема Фалеса и две средние линии',
    'The Thales theorem and the two midlines',
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
      { id: 'f1', label: L("parallel chiziqlar bir kesuvchidan teng kesmalar ajratsa, boshqasidan ham teng ajratadi", 'если параллельные прямые отсекают равные отрезки на одной секущей, они делают то же на другой', 'if parallel lines cut equal segments on one transversal, they do the same on another') },
      { id: 'f2', label: L("uchburchakning o'rta chizig'i uchinchi tomonga parallel va uning yarmiga teng", 'средняя линия треугольника параллельна третьей стороне и равна её половине', "a triangle's midline is parallel to the third side and equals half of it") },
      { id: 'f3', label: L("trapetsiyaning o'rta chizig'i asoslariga parallel va ularning yig'indisining yarmiga teng", 'средняя линия трапеции параллельна основаниям и равна половине их суммы', "a trapezoid's midline is parallel to the bases and equals half their sum") },
      { id: 'w1', label: L("o'rta chiziq har doim tegishli tomon yoki asosga to'liq teng", 'средняя линия всегда равна целой соответствующей стороне или основанию', 'the midline always equals the whole corresponding side or base') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. O'rta chiziq hech qachon to'liq tomonga teng emas, u DOIM yarmiga teng.",
      'Так не складывается. Средняя линия никогда не равна целой стороне, она ВСЕГДА равна половине.',
      'That does not fit. The midline is never equal to the whole side, it is ALWAYS half.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, I bob, 8-, 11- va 12-mavzular asosida (27-, 34-, 40-bet)",
        'Правило на основе геометрии, глава I, темы 8, 11 и 12 учебника (стр. 27, 34, 40)',
        'The rule is based on geometry, chapter I, topics 8, 11, and 12 of the textbook (pages 27, 34, 40)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Teng kesmalar ikkinchi kesuvchida qanday bo'lishini bilmasdik",
        'Мы не знали, какими будут равные отрезки на второй секущей',
        'We did not know what the equal segments would be like on the second transversal',
      ),
      right: L(
        "endi ular ham teng bo'lib qolishini, va o'rta chiziqlarning yarmiga teng ekanini bilamiz",
        'теперь знаем, что они тоже остаются равными, и что средние линии равны половине',
        'now we know they stay equal too, and that midlines equal half',
      ),
      winner: 'right',
      note: L(
        "Parallellik teng kesmalarni saqlaydi, o'rta chiziq esa doim yarmi",
        'Параллельность сохраняет равенство отрезков, средняя линия всегда половина',
        'Parallelism preserves the equality of segments, the midline is always half',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): uchburchakning o'rta chizig'i,
// to'g'ridan-to'g'ri hisoblash.
// ============================================================
const ASK_MID = L("O'rta chiziq qancha?", 'Чему равна средняя линия?', 'What is the midline?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З90',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Uchinchi tomondan uchburchakning o'rta chizig'ini toping",
    'Найди среднюю линию треугольника по третьей стороне',
    'Find the triangle\'s midline from the third side',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida uchinchi tomon berilgan.",
      'Пять заданий. В каждом дана третья сторона.',
      'Five tasks. In each, the third side is given.'),
    A('why',
      "O'rta chiziq uchinchi tomonning aynan yarmi.",
      'Средняя линия, ровно половина третьей стороны.',
      "The midline is exactly half the third side."),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar uchinchi tomon ikkiga bo'lingan.",
      'Все пять разобраны. Каждый раз третья сторона делилась на два.',
      'All five are done. Each time the third side was divided by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'AC = 18'}</Row>,
        ok: L("Ha. O'n sakkizni ikkiga bo'lsak, to'qqiz.", 'Да. Восемнадцать, делённое на два, девять.', 'Yes. Eighteen divided by two is nine.'),
        question: ASK_MID,
        items: [
          { id: 'a', right: true, label: '9' },
          { id: 'b', label: '18', hint: L("Bu uchinchi tomonning o'zi, ikkiga bo'linmagan.", 'Это сама третья сторона, не делённая на два.', 'That is the third side itself, not divided by two.') },
        ],
        solution: ['18 : 2', '9'],
      },
      {
        expr: <Row size="big" align="center">{'AC = 25'}</Row>,
        ok: L("Ha. Yigirma beshni ikkiga bo'lsak, o'n ikki nuqta besh.", 'Да. Двадцать пять, делённое на два, двенадцать целых пять.', 'Yes. Twenty-five divided by two is twelve point five.'),
        question: ASK_MID,
        items: [
          { id: 'a', right: true, label: '12,5' },
          { id: 'b', label: '25', hint: L("Bu uchinchi tomonning o'zi, ikkiga bo'linmagan.", 'Это сама третья сторона, не делённая на два.', 'That is the third side itself, not divided by two.') },
        ],
        solution: ['25 : 2', '12,5'],
      },
      {
        expr: <Row size="big" align="center">{'AC = 14'}</Row>,
        ok: L("Ha. O'n to'rtni ikkiga bo'lsak, yetti.", 'Да. Четырнадцать, делённое на два, семь.', 'Yes. Fourteen divided by two is seven.'),
        question: ASK_MID,
        items: [
          { id: 'a', right: true, label: '7' },
          { id: 'b', label: '14', hint: L("Bu uchinchi tomonning o'zi, ikkiga bo'linmagan.", 'Это сама третья сторона, не делённая на два.', 'That is the third side itself, not divided by two.') },
        ],
        solution: ['14 : 2', '7'],
      },
      {
        expr: <Row size="big" align="center">{'AC = 9'}</Row>,
        ok: L("Ha. To'qqizni ikkiga bo'lsak, to'rt nuqta besh.", 'Да. Девять, делённое на два, четыре целых пять.', 'Yes. Nine divided by two is four point five.'),
        question: ASK_MID,
        items: [
          { id: 'a', right: true, label: '4,5' },
          { id: 'b', label: '9', hint: L("Bu uchinchi tomonning o'zi, ikkiga bo'linmagan.", 'Это сама третья сторона, не делённая на два.', 'That is the third side itself, not divided by two.') },
        ],
        solution: ['9 : 2', '4,5'],
      },
      {
        expr: <Row size="big" align="center">{'AC = 30'}</Row>,
        ok: L("Ha. O'ttizni ikkiga bo'lsak, o'n besh.", 'Да. Тридцать, делённое на два, пятнадцать.', 'Yes. Thirty divided by two is fifteen.'),
        question: ASK_MID,
        items: [
          { id: 'a', right: true, label: '15' },
          { id: 'b', label: '30', hint: L("Bu uchinchi tomonning o'zi, ikkiga bo'linmagan.", 'Это сама третья сторона, не делённая на два.', 'That is the third side itself, not divided by two.') },
        ],
        solution: ['30 : 2', '15'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): trapetsiyaning o'rta chizig'i.
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З90',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Asoslardan trapetsiyaning o'rta chizig'ini toping",
    'Найди среднюю линию трапеции по основаниям',
    'Find the trapezoid\'s midline from the bases',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida ikki asos berilgan.",
      'Три задания. В каждом даны два основания.',
      'Three tasks. In each, two bases are given.'),
    A('why',
      "Asoslar qo'shilib, ikkiga bo'linadi.",
      'Основания складываются и делятся на два.',
      'The bases are added and divided by two.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar asoslar qo'shilib, ikkiga bo'lingan.",
      'Все три разобраны. Каждый раз основания складывались и делились на два.',
      'All three are done. Each time the bases were added and divided by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 13,  b = 7'}</Row>,
        ok: L("Ha. O'n uch qo'shilgan yetti, yigirma, ikkiga bo'linsa, o'n.", 'Да. Тринадцать плюс семь, двадцать, разделить на два, десять.', 'Yes. Thirteen plus seven is twenty, divided by two is ten.'),
        question: L("O'rta chiziq qancha?", 'Чему равна средняя линия?', 'What is the midline?'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '20', hint: L("Bu yig'indi, ikkiga bo'linmagan.", 'Это сумма, не делённая на два.', 'That is the sum, not divided by two.') },
        ],
        solution: ['13+7', '20 : 2', '10'],
      },
      {
        expr: <Row size="big" align="center">{'a = 22,  b = 14'}</Row>,
        ok: L("Ha. Yigirma ikki qo'shilgan o'n to'rt, o'ttiz olti, ikkiga bo'linsa, o'n sakkiz.", 'Да. Двадцать два плюс четырнадцать, тридцать шесть, разделить на два, восемнадцать.', 'Yes. Twenty-two plus fourteen is thirty-six, divided by two is eighteen.'),
        question: L("O'rta chiziq qancha?", 'Чему равна средняя линия?', 'What is the midline?'),
        items: [
          { id: 'a', right: true, label: '18' },
          { id: 'b', label: '36', hint: L("Bu yig'indi, ikkiga bo'linmagan.", 'Это сумма, не делённая на два.', 'That is the sum, not divided by two.') },
        ],
        solution: ['22+14', '36 : 2', '18'],
      },
      {
        expr: <Row size="big" align="center">{'a = 17,  b = 9'}</Row>,
        ok: L("Ha. O'n yetti qo'shilgan to'qqiz, yigirma olti, ikkiga bo'linsa, o'n uch.", 'Да. Семнадцать плюс девять, двадцать шесть, разделить на два, тринадцать.', 'Yes. Seventeen plus nine is twenty-six, divided by two is thirteen.'),
        question: L("O'rta chiziq qancha?", 'Чему равна средняя линия?', 'What is the midline?'),
        items: [
          { id: 'a', right: true, label: '13' },
          { id: 'b', label: '26', hint: L("Bu yig'indi, ikkiga bo'linmagan.", 'Это сумма, не делённая на два.', 'That is the sum, not divided by two.') },
        ],
        solution: ['17+9', '26 : 2', '13'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): Falyes teoremasini
// son bilan tekshirish (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Falyes teoremasini son bilan tekshiring",
    'Проверь теорему Фалеса вычислением',
    'Check the Thales theorem by computation',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Bitta kesuvchidagi kesmalar berilgan, ikkinchisi tekshiriladi.",
      'Три задания. Даны отрезки на одной секущей, проверяется вторая.',
      'Three tasks. Segments on one transversal are given, the second is checked.'),
    A('why',
      "Birinchi kesuvchida teng bo'lsa, ikkinchisida ham teng bo'lishi shart.",
      'Если на первой секущей равны, то и на второй обязаны быть равны.',
      'If equal on the first transversal, they must be equal on the second too.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ikkinchi kesuvchidagi tenglik tekshirilgan.",
      'Все три разобраны. Каждый раз проверялось равенство на второй секущей.',
      'All three are done. Each time the equality on the second transversal was checked.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'AB = 4,  BC = 4   →   A₁B₁ = 5'}</Row>,
        ok: L("Ha. Birinchi kesuvchida ikkalasi ham to'rt, teng, shuning uchun ikkinchisida ham teng bo'lishi kerak, ya'ni B₁C₁ ham besh.", 'Да. На первой секущей оба четыре, равны, значит и на второй должны быть равны, то есть B₁C₁ тоже пять.', 'Yes. On the first transversal both are four, equal, so on the second they must be equal too, meaning B₁C₁ is also five.'),
        question: L("B₁C₁ qancha bo'lishi kerak?", 'Чему должен быть равен B₁C₁?', 'What must B₁C₁ equal?'),
        items: [
          { id: 'a', right: true, label: '5' },
          { id: 'b', label: '4', hint: L("Bu birinchi kesuvchidagi qiymat, ikkinchisiniki emas.", 'Это значение с первой секущей, а не со второй.', 'That is the value from the first transversal, not the second.') },
        ],
        solution: ['AB = BC', 'A₁B₁ = B₁C₁', '5'],
      },
      {
        expr: <Row size="big" align="center">{'AB = 3,  BC = 3,  CD = 3   →   A₁B₁ = 6'}</Row>,
        ok: L("Ha. Uchtasi ham teng, shuning uchun ikkinchi kesuvchida B₁C₁ va C₁D₁ ham olti bo'lishi kerak.", 'Да. Все три равны, значит и на второй секущей B₁C₁ и C₁D₁ должны быть шесть.', 'Yes. All three are equal, so on the second transversal B₁C₁ and C₁D₁ must be six too.'),
        question: L("B₁C₁ va C₁D₁ qancha bo'lishi kerak?", 'Чему должны быть равны B₁C₁ и C₁D₁?', 'What must B₁C₁ and C₁D₁ equal?'),
        items: [
          { id: 'a', right: true, label: '6, 6' },
          { id: 'b', label: '3, 3', hint: L("Bu birinchi kesuvchidagi qiymatlar, ikkinchisiniki emas.", 'Это значения с первой секущей, а не со второй.', 'Those are the values from the first transversal, not the second.') },
        ],
        solution: ['AB = BC = CD', 'A₁B₁ = B₁C₁ = C₁D₁', '6, 6'],
      },
      {
        expr: <Row size="big" align="center">{'AB = 7,  BC = 5   →   A₁B₁ = 7,  B₁C₁ = 5'}</Row>,
        ok: L("Yo'q. AB va BC teng emas, yetti va besh, shuning uchun Falyes teoremasi teng kesmalar haqida hech narsa da'vo qilmaydi, bu yerda xato yo'q.", 'Нет. AB и BC не равны, семь и пять, поэтому теорема Фалеса о равных отрезках ничего не утверждает, здесь ошибки нет.', 'No. AB and BC are not equal, seven and five, so the Thales theorem about equal segments makes no claim here, there is no mistake.'),
        question: L("Bu tenglik teoremaga zid keladimi?", 'Противоречит ли это равенство теореме?', 'Does this equality contradict the theorem?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, chunki AB va BC teng emas edi", 'Нет, потому что AB и BC не были равны', 'No, because AB and BC were not equal') },
          { id: 'b', label: L('Ha, zid keladi', 'Да, противоречит', 'Yes, it contradicts'), hint: L("Teorema faqat TENG kesmalar haqida gapiradi, bu yerda ular teng emas edi.", 'Теорема говорит только о РАВНЫХ отрезках, а здесь они не были равны.', 'The theorem speaks only of EQUAL segments, and here they were not equal.') },
        ],
        solution: ['AB ≠ BC', L("teorema qo'llanmaydi", 'теорема не применяется', 'the theorem does not apply')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): parallellik
// tekshirilmagan (З89) va o'rta chiziq ikkiga bo'linmagan (З90).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З89',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato javobda nima noto'g'ri",
    'Что неверно в двух ошибочных ответах',
    'What is wrong in two mistaken answers',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham teoremalar noto'g'ri qo'llangan.",
      'Два задания. В обоих теоремы применены неверно.',
      'Two tasks. In both, the theorems were applied incorrectly.'),
    A('why',
      "Parallellik tekshirilmasligi va o'rta chiziqni ikkiga bo'lishni unutish, ikki xil xato.",
      'Не проверить параллельность и забыть разделить среднюю линию на два, две разные ошибки.',
      'Not checking parallelism and forgetting to halve the midline are two different mistakes.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham shartni to'liq tekshirmasdan qo'llashdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за применения без полной проверки условия.',
      'Both are done. Both mistakes came from applying without fully checking the condition.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'AB = BC   →   A₁B₁ = B₁C₁'}</Row>,
        ok: L("Ha. Falyes teoremasi faqat chiziqlar parallel bo'lganda ishlaydi, bu shart tekshirilmasdan xulosa chiqarilgan.", 'Да. Теорема Фалеса работает только при параллельности прямых, а вывод сделан без этой проверки.', "Yes. Thales' theorem works only when the lines are parallel, and the conclusion was drawn without this check."),
        question: L("Chiziqlarning parallel ekani tekshirilmasdan shu xulosa chiqarilgan bo'lsa, bu yerda xato qayerda?", 'Если этот вывод сделан без проверки параллельности прямых, в чём здесь ошибка?', 'If this conclusion was drawn without checking that the lines are parallel, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Chiziqlarning parallel ekani tekshirilmagan", 'Не проверено, что прямые параллельны', 'It was not checked that the lines are parallel') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, parallellik shartsiz teorema ishlamaydi.", 'Это и есть показанная ошибка, без условия параллельности теорема не работает.', 'This is the very mistake shown; without the parallel condition the theorem does not work.') },
        ],
        solution: [L("parallellik shart", 'параллельность обязательна', 'parallelism is required')],
      },
      {
        expr: <Row size="big" align="center">{'AC = 16   →   16'}</Row>,
        ok: L("Ha. O'rta chiziq uchinchi tomonning o'zi emas, uning yarmi, sakkiz bo'lishi kerak edi.", 'Да. Средняя линия не сама третья сторона, а её половина, должна была быть восемь.', 'Yes. The midline is not the third side itself, but half of it, it should have been eight.'),
        question: L("AC o'n olti bo'lsa va o'rta chiziq ham o'n olti deb olingan bo'lsa, bu yerda xato qayerda?", 'Если AC равна шестнадцати, а средняя линия тоже принята равной шестнадцати, в чём здесь ошибка?', 'If AC is sixteen, and the midline was also taken as sixteen, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ikkiga bo'lish unutilgan", 'Забыто деление на два', 'The division by two was forgotten') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, natija sakkiz bo'lishi kerak edi, o'n olti emas.", 'Это и есть показанная ошибка, результат должен был быть восемь, а не шестнадцать.', 'This is the very mistake shown; the result should have been eight, not sixteen.') },
        ],
        solution: ['16 : 2', '8'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): asosdan yoki tomondan
// o'rta chiziqni qadamlab topish.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З90',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "O'rta chiziqni qadamlab toping",
    'Найди среднюю линию по шагам',
    'Find the midline step by step',
  ),
  audio: [
    A('mount',
      "Ba'zida uchinchi tomon, ba'zida ikki asos beriladi, qadam har doim ikkiga bo'lish bilan tugaydi.",
      'Иногда дана третья сторона, иногда два основания, шаг всегда заканчивается делением на два.',
      'Sometimes the third side is given, sometimes two bases, the step always ends with dividing by two.'),
    A('why',
      "Ikkiga bo'lish qadami hech qachon tushib qolmasligi kerak.",
      'Шаг деления на два никогда не должен пропадать.',
      'The step of dividing by two must never be dropped.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar to'g'ri son ikkiga bo'lingan.",
      'Все три заполнены. Каждый раз верное число делилось на два.',
      'All three are filled. Each time the right number was divided by two.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['20', '10'],
      lines: [
        [{ t: 'AC = 20   →   20 : 2 = ' }, { slot: '10' }],
      ],
    },
    tasks: [
      {
        chips: ['24', '12'],
        lines: [
          [{ t: 'AC = 24   →   24 : 2 = ' }, { slot: '12' }],
        ],
      },
      {
        chips: ['19', '8', '27', '13,5'],
        lines: [
          [{ t: 'a=19, b=8   →   19+8=' }, { slot: '27' }, { t: ', :2=' }, { slot: '13,5' }],
        ],
      },
      {
        chips: ['15', '11', '26', '13'],
        lines: [
          [{ t: 'a=15, b=11   →   15+11=' }, { slot: '26' }, { t: ', :2=' }, { slot: '13' }],
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
    "Falyes teoremasi va o'rta chiziqlar bo'yicha to'rt savol",
    'Четыре вопроса о теореме Фалеса и средних линиях',
    'Four questions about the Thales theorem and the midlines',
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
        id: 'q1', tag: 'З89',
        ask: L('Falyes teoremasi ishlashi uchun chiziqlar qanday bo\'lishi shart?', 'Какими должны быть прямые, чтобы работала теорема Фалеса?', 'What must the lines be like for the Thales theorem to work?'),
        options: [
          { id: 'ok', right: true, label: L('Parallel', 'Параллельными', 'Parallel') },
          { id: 'no', label: L('Perpendikulyar', 'Перпендикулярными', 'Perpendicular') },
        ],
        hint: L("Teorema aynan parallel chiziqlar haqida.", 'Теорема именно о параллельных прямых.', 'The theorem is precisely about parallel lines.'),
        ok: L("To'g'ri, parallellik shart.", 'Верно, параллельность обязательна.', 'Correct, parallelism is required.'),
      },
      {
        id: 'q2', tag: 'З90',
        ask: L('Uchburchakning uchinchi tomoni 22 bo\'lsa, o\'rta chiziq qancha?', 'Если третья сторона треугольника 22, чему равна средняя линия?', 'If the third side of a triangle is 22, what is the midline?'),
        options: [
          { id: 'ok', right: true, label: '11' },
          { id: 'no', label: '22' },
        ],
        hint: L("O'rta chiziq uchinchi tomonning yarmi.", 'Средняя линия, половина третьей стороны.', 'The midline is half the third side.'),
        ok: L("To'g'ri, yigirma ikki ikkiga bo'linsa, o'n bir.", 'Верно, двадцать два, делённое на два, одиннадцать.', 'Correct, twenty-two divided by two is eleven.'),
      },
      {
        id: 'q3', tag: 'З90',
        ask: L('Trapetsiya asoslari 12 va 8 bo\'lsa, o\'rta chiziq qancha?', 'Если основания трапеции 12 и 8, чему равна средняя линия?', 'If the bases of a trapezoid are 12 and 8, what is the midline?'),
        options: [
          { id: 'ok', right: true, label: '10' },
          { id: 'no', label: '20' },
        ],
        hint: L("Asoslar qo'shilib, ikkiga bo'linadi.", 'Основания складываются и делятся на два.', 'The bases are added and divided by two.'),
        ok: L("To'g'ri, o'n ikki qo'shilgan sakkiz, yigirma, ikkiga bo'linsa, o'n.", 'Верно, двенадцать плюс восемь, двадцать, разделить на два, десять.', 'Correct, twelve plus eight is twenty, divided by two is ten.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('18 ikkiga bo\'linsa, 9ga tengmi?', 'Верно ли, что 18, делённое на два, равно 9?', 'Is it true that 18 divided by two equals 9?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, natija to'qqiz chiqadi.", 'Посчитай, результат девять.', 'Compute it, the result is nine.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З89',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "AB=BC bo'lsa va chiziqlar parallel bo'lsa, A₁B₁ va B₁C₁ orasidagi munosabatni yig'ing.",
            'Собери соотношение между A₁B₁ и B₁C₁, если AB=BC и прямые параллельны.',
            'Assemble the relation between A₁B₁ and B₁C₁, if AB=BC and the lines are parallel.',
          ),
          lines: [
            [{ t: 'AB = BC   →   A₁B₁ ' }, { slot: '=' }, { t: ' B₁C₁' }],
          ],
          tiles: [
            { id: 't1', v: '=', x: 12, y: 12 },
            { id: 't2', v: '>', x: 60, y: 14 },
            { id: 't3', v: '<', x: 30, y: 50 },
            { id: 't4', v: '≠', x: 78, y: 48 },
          ],
          hint: L(
            "Bir kesuvchidagi tenglik ikkinchisida ham saqlanadi.",
            'Равенство на одной секущей сохраняется и на другой.',
            'Equality on one transversal is preserved on the other too.',
          ),
          doneNote: L(
            "Yig'ildi. Parallel chiziqlar tenglikni saqlaydi.",
            'Собрано. Параллельные прямые сохраняют равенство.',
            'Assembled. Parallel lines preserve equality.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (1-darsning `takeaway`). Blok Б6 yakunlanadi.
// ============================================================
const S15 = {
  role: 'summary',
  tool: 'takeaway',
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Parallellik tenglikni saqlaydi, o'rta chiziq doim yarmi",
    'Параллельность сохраняет равенство, средняя линия всегда половина',
    'Parallelism preserves equality, the midline is always half',
  ),
  audio: [
    A('s0',
      "Darsdan bitta g'oya qoladi. Parallel chiziqlar tenglikni saqlaydi, o'rta chiziqlar esa doim yarmi.",
      'С урока остаётся одна идея. Параллельные прямые сохраняют равенство, а средние линии всегда половина.',
      'One idea stays with you. Parallel lines preserve equality, and midlines are always half.'),
    A('s1',
      "Bugun uch narsa qilindi. Falyes teoremasini isbotladingiz, uchburchakning o'rta chizig'ini chiqarib oldingiz va trapetsiyaning o'rta chizig'ini ikki yo'l bilan tekshirdingiz.",
      'Сегодня сделано три вещи. Ты доказал теорему Фалеса, вывел среднюю линию треугольника и проверил среднюю линию трапеции двумя способами.',
      'Three things are done today. You proved the Thales theorem, derived the triangle\'s midline, and checked the trapezoid\'s midline two ways.'),
    A('s2',
      "Bu bilan to'rtburchaklar va yuzalar bloki yakunlandi. Keyingi darsda to'g'ri burchakli uchburchak va Pifagor teoremasi.",
      'Этим блок четырёхугольников и площадей завершён. В следующем уроке прямоугольный треугольник и теорема Пифагора.',
      'With this, the block on quadrilaterals and areas is complete. The next lesson covers the right triangle and the Pythagorean theorem.',
    ),
  ],
  props: {
    mark: "l₁ ∥ l₂ ∥ l₃,   o'rta chiziq = ½",
    markNote: L(
      "teng kesmalar teng qoladi, o'rta chiziq har doim yarmi",
      'равные отрезки остаются равными, средняя линия всегда половина',
      'equal segments stay equal, the midline is always half',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: to'g'ri burchakli uchburchak, Pifagor teoremasi",
      'Следующий урок: прямоугольный треугольник, теорема Пифагора',
      'Next lesson: the right triangle, the Pythagorean theorem',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
