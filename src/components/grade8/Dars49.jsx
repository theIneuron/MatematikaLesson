// ============================================================================
// 8-sinf, Dars 49. AYLANA VATARI VA DIAMETRINING XOSSALARI.
//
// BLOK Б7, AYLANA QISMI DAVOM ETADI. Bu fayl, FAQAT MA'LUMOT. Mexanika
// `screens.jsx`, `circlefigure.jsx`, `prooflines.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx` da. YANGI PRIBOR YO'Q — `CircleFigure` (dars 48)
// va `ProofLines` (dars 37+) qayta ishlatilgan.
//
// MANBA: 8-sinf geometriya darsligi, 4-§ (AYLANA), 34-mavzu (109-110-bet):
//   - 1-teorema: vatarga perpendikulyar diametr shu vatarni va unga tiralgan
//     yoyni teng ikkiga bo'ladi. Isbot: OA=OB=R, AOB teng yonli uchburchak,
//     OP (P — kesishish nuqtasi) balandlik, demak mediana VA bissektrisa
//     ham; mediana → AP=PB, bissektrisa → ∠AOP=∠BOP → yoy AD=yoy DB;
//   - 1-natija: vatarning o'rtasidan o'tuvchi diametr shu vatarga
//     perpendikulyar;
//   - 2-natija: vatarning o'rta perpendikulari aylananing diametri bo'ladi;
//   - 2-teorema: aylana vatari uning diametridan katta bo'lmaydi. Isbot:
//     OPB to'g'ri burchakli, PB katet, OB gipotenuza, katet gipotenuzadan
//     katta emas (45-darsdagi natija!), 2PB≤2OB, ya'ni AB≤D;
//   - Amaliy natija (412-422-mashqlar): markazdan vatargacha masofa d,
//     radius R va vatarning YARMI Pifagor teoremasi bilan bog'langan,
//     R² = d² + (vatar/2)². Masalan, 418-mashq: R=13, vatar=10 → d=12
//     (5-12-13 uchligi).
//
// ADASHISHLAR, ikkitasi yangi:
//   З104, markazdan vatargacha bo'lgan masofani topishda vatarning yarmi
//   emas, to'liq uzunligi ishlatilgan;
//   З105, istalgan diametr istalgan vatarni teng ikkiga bo'ladi deb
//   o'ylangan, aslida faqat PERPENDIKULYAR diametr shunday bo'ladi;
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
  id: 'geo-8-49',
  n: 49,
  row: 54,
  block: 'Б7',
  topic: L('Aylana vatari va diametrining xossalari', 'Свойства хорды и диаметра окружности', "The properties of the circle's chord and diameter"),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Vatarga perpendikulyar diametr shu vatarni va unga tiralgan yoyni teng ikkiga bo'ladi",
    'Диаметр, перпендикулярный хорде, делит эту хорду и стягиваемую ею дугу пополам',
    'A diameter perpendicular to a chord bisects that chord and the arc it subtends',
  ),
  L(
    "Aylana vatari uning diametridan katta bo'lmaydi",
    'Хорда окружности не бывает больше её диаметра',
    "A circle's chord is never greater than its diameter",
  ),
  L(
    "Markazdan vatargacha bo'lgan masofa d, radius R va vatarning YARMI orqali Pifagor teoremasi bilan bog'langan, R² = d² + (vatar : 2)²",
    'Расстояние от центра до хорды d связано с радиусом R и ПОЛОВИНОЙ хорды теоремой Пифагора, R² = d² + (хорда : 2)²',
    "The distance from the centre to a chord d is linked to the radius R and HALF the chord by the Pythagorean theorem, R² = d² + (chord : 2)²",
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З104': {
    what: L(
      "markazdan vatargacha bo'lgan masofani topishda vatarning yarmi emas, to'liq uzunligi ishlatilgan",
      'при нахождении расстояния от центра до хорды использована не половина хорды, а вся её длина',
      'when finding the distance from the centre to a chord, the whole chord length was used instead of half of it',
    ),
    wrong: null,
    at: 12,
  },
  'З105': {
    what: L(
      "istalgan diametr istalgan vatarni teng ikkiga bo'ladi deb o'ylangan, aslida faqat perpendikulyar diametr shunday bo'ladi",
      'считалось, что любой диаметр делит любую хорду пополам, а на самом деле так только у перпендикулярного диаметра',
      'it was assumed any diameter bisects any chord, but this is only true for a perpendicular diameter',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (4-ekran, ProofLines). AB, vatar (order); O,
// markaz, C, D — perpendikulyar diametr uchlari (marks orqali).
// ============================================================
const CHORD_PTS = { A: [15, 60], B: [95, 60], O: [55, 55], C: [55, 15], D: [55, 95] }
const CHORD_ORDER = ['A', 'B']

// ============================================================
// SAHNALAR (§6). Xuk: istalgan diametr vatarni teng ikkiga bo'ladimi.
// ============================================================
const SC_ASK = L('VATAR VA DIAMETR', 'ХОРДА И ДИАМЕТР', 'THE CHORD AND THE DIAMETER')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <circle cx="175" cy="62" r="30" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <line x1="150" y1="45" x2="200" y2="45" stroke={T.ink3} strokeWidth="1.4"/>
      <line x1="175" y1="32" x2="175" y2="92" stroke={T.ink4} strokeWidth="1.2" strokeDasharray="3,2"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="175" cy="45" r="10" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.2"/>
        <text x="175" y="49" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Faqat perpendikulyar diametr vatarni teng ikkiga bo'ladi",
      'Только перпендикулярный диаметр делит хорду пополам',
      'Only a perpendicular diameter bisects the chord',
    )}>
      <circle cx="185" cy="62" r="28" fill="none" stroke={T.ok} strokeWidth="1.6"/>
      <line x1="185" y1="34" x2="185" y2="90" stroke={T.ok} strokeWidth="1.4"/>
      <line x1="160" y1="62" x2="210" y2="62" stroke={T.ok} strokeWidth="1.4"/>
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
  eyebrow: L('VATAR VA DIAMETR', 'ХОРДА И ДИАМЕТР', 'THE CHORD AND THE DIAMETER'),
  title: L(
    "Diametr vatarni kesib o'tsa, u vatarni doim teng ikkiga bo'ladi deb o'ylaysizmi",
    'Думаешь, если диаметр пересекает хорду, он всегда делит её пополам',
    'Do you think that if a diameter crosses a chord, it always bisects it',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Diametr aylananing istalgan vatarini kesib o'tishi mumkin.",
      'Диаметр может пересечь любую хорду окружности.',
      'A diameter can cross any chord of a circle.'),
    A('why',
      "Taxmin qiling, bu kesishish har doim vatarni teng ikkiga bo'ladimi.",
      'Предположи, всегда ли это пересечение делит хорду пополам.',
      'Predict whether this crossing always bisects the chord.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, diametr vatarni kesib o'tsa, u doim teng ikkiga bo'linadimi?",
      'Как думаешь, если диаметр пересекает хорду, она всегда делится пополам?',
      'What do you think, if a diameter crosses a chord, is it always bisected?',
    ),
    items: [
      { id: 'a', show: L('Ha, doim', 'Да, всегда', 'Yes, always') },
      { id: 'b', show: L("Faqat perpendikulyar bo'lsa", 'Только если он перпендикулярен', 'Only if it is perpendicular') },
      { id: 'c', show: L("Faqat vatar diametr bo'lsa", 'Только если хорда сама диаметр', 'Only if the chord is itself a diameter') },
      { id: 'd', show: L("Hech qachon", 'Никогда', 'Never') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Pifagor teoremasini eslash.
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Pifagor teoremasini eslash",
    'Вспоминаем теорему Пифагора',
    'Recalling the Pythagorean theorem',
  ),
  audio: [
    A('mount',
      "44-47-darslarda Pifagor teoremasini har xil masalalarda ishlatgan edingiz.",
      'На уроках 44-47 ты применял теорему Пифагора в разных задачах.',
      'In lessons 44-47 you applied the Pythagorean theorem in various problems.'),
    A('why',
      "Bugun uni aylana ichida, yangi uchburchakda qo'llaymiz.",
      'Сегодня применим её внутри окружности, в новом треугольнике.',
      "Today we'll apply it inside a circle, in a new triangle."),
  ],
  props: {
    ask: L(
      "To'g'ri burchakli uchburchakda gipotenuzaning kvadrati nimaga teng?",
      'Чему равен квадрат гипотенузы в прямоугольном треугольнике?',
      "What does the square of the hypotenuse equal in a right triangle?",
    ),
    items: [
      { id: 'right', show: L('Katetlar kvadratlari yig\'indisiga', 'Сумме квадратов катетов', 'The sum of the squares of the legs'), right: true, name: L("bu Pifagor teoremasi", 'это теорема Пифагора', 'this is the Pythagorean theorem') },
      {
        id: 'wrong', show: L("Katetlar yig'indisiga", 'Сумме катетов', 'The sum of the legs'),
        hint: L("Kvadratlar qo'shiladi, tomonlarning o'zi emas.", 'Складываются квадраты, а не сами стороны.', 'The squares are added, not the sides themselves.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun radius, yarim vatar va markazdan masofa shu formulaga kiradi.",
      'Верно. Сегодня радиус, половина хорды и расстояние от центра войдут в эту формулу.',
      "Correct. Today the radius, half the chord, and the distance from the centre go into this formula.",
    ),
  },
}

// ============================================================
// EKRAN 3. FAQAT PERPENDIKULYAR (`pick`). Ловушка, istalgan diametr
// teng ikkiga bo'ladi deb o'ylanishi (З105).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З105',
  eyebrow: L('FAQAT PERPENDIKULYAR DIAMETR', 'ТОЛЬКО ПЕРПЕНДИКУЛЯРНЫЙ ДИАМЕТР', 'ONLY A PERPENDICULAR DIAMETER'),
  title: L(
    "Diametr vatarga perpendikulyar EMAS. U vatarni teng ikkiga bo'ladimi",
    'Диаметр НЕ перпендикулярен хорде. Делит ли он её пополам',
    'The diameter is NOT perpendicular to the chord. Does it bisect it',
  ),
  audio: [
    A('mount',
      "Diametr vatarni kesib o'tadi, ammo qiyshiq holda, perpendikulyar emas.",
      'Диаметр пересекает хорду, но под наклоном, не перпендикулярно.',
      'The diameter crosses the chord, but at a slant, not perpendicularly.'),
    A('why',
      "Teorema faqat PERPENDIKULYAR diametr uchun aytilgan.",
      'Теорема сформулирована именно для ПЕРПЕНДИКУЛЯРНОГО диаметра.',
      'The theorem is stated specifically for a PERPENDICULAR diameter.'),
  ],
  props: {
    ask: L(
      "Diametr vatarga perpendikulyar bo'lmasa, u vatarni teng ikkiga bo'ladimi?",
      'Если диаметр не перпендикулярен хорде, делит ли он её пополам?',
      'If the diameter is not perpendicular to the chord, does it bisect it?',
    ),
    items: [
      { id: 'right', show: L("Yo'q, umuman bo'lishi shart emas", 'Нет, не обязан', 'No, it does not have to'), right: true, name: L("faqat perpendikulyar diametr teng ikkiga bo'ladi", 'только перпендикулярный делит пополам', 'only a perpendicular one bisects it') },
      {
        id: 'wrong', show: L('Ha, istalgan diametr shunday', 'Да, любой диаметр так делает', 'Yes, any diameter does this'),
        hint: L("Teorema faqat perpendikulyar holat uchun isbotlangan, umuman ixtiyoriy diametr uchun emas.", 'Теорема доказана только для перпендикулярного случая, не для произвольного диаметра.', 'The theorem is proven only for the perpendicular case, not for an arbitrary diameter.'),
      },
    ],
    after: L(
      "To'g'ri. Perpendikulyarlik shartsiz, diametr vatarni teng ikkiga bo'lishi shart emas.",
      'Верно. Без перпендикулярности диаметр не обязан делить хорду пополам.',
      'Correct. Without perpendicularity, the diameter does not have to bisect the chord.',
    ),
  },
}

// ============================================================
// EKRAN 4. TEOREMANI ISBOTLAYMIZ (`prooflines`). 1-teorema, 109-bet.
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З105',
  eyebrow: L('TEOREMANI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ ТЕОРЕМУ', 'PROVING THE THEOREM'),
  title: L(
    "Vatarga perpendikulyar diametr uni teng ikkiga bo'ladi",
    'Диаметр, перпендикулярный хорде, делит её пополам',
    'A diameter perpendicular to a chord bisects it',
  ),
  audio: [
    A('mount',
      "AB, vatar; CD, unga perpendikulyar diametr; P, ularning kesishgan nuqtasi.",
      'AB, хорда; CD, перпендикулярный ей диаметр; P, их точка пересечения.',
      'AB, the chord; CD, the diameter perpendicular to it; P, their intersection point.'),
    A('why',
      "OA va OB radiuslar teng, shuning uchun AOB uchburchak teng yonli.",
      'Радиусы OA и OB равны, поэтому треугольник AOB равнобедренный.',
      'The radii OA and OB are equal, so triangle AOB is isosceles.'),
  ],
  props: {
    points: CHORD_PTS,
    order: CHORD_ORDER,
    marks: [['O', 'A'], ['O', 'B'], ['C', 'D']],
    given: [
      L("O, markaz, R radius; AB, vatar; CD, AB ga perpendikulyar diametr, P — kesishish nuqtasi", 'O, центр, радиус R; AB, хорда; CD, диаметр, перпендикулярный AB, P — точка пересечения', 'O, the centre, radius R; AB, the chord; CD, the diameter perpendicular to AB, P the intersection point'),
    ],
    goal: L("AP = PB va yoy AD = yoy DB", 'AP = PB и дуга AD = дуге DB', 'AP = PB and arc AD = arc DB'),
    lines: [
      {
        text: L("OA = OB = R bo'lgani uchun, AOB uchburchak teng yonli", 'так как OA = OB = R, треугольник AOB равнобедренный', 'since OA = OB = R, triangle AOB is isosceles'),
        options: [
          { id: 'ok', right: true, label: L("Ikkalasi ham radius, shuning uchun teng", 'Оба радиусы, поэтому равны', 'Both are radii, so they are equal') },
          { id: 'no', label: L("Bu chizmadan shunday ko'rinadi", 'Так видно на чертеже', 'That is how it looks on the drawing'), hint: L("Ko'rinish sabab emas, OA va OB bir xil aylananing radiusi bo'lgani uchun teng.", 'Внешний вид не причина, OA и OB равны, потому что оба радиусы одной окружности.', 'Appearance is not the reason, OA and OB are equal because both are radii of the same circle.') },
        ],
      },
      {
        text: L("OP balandlik bo'lgani uchun, u teng yonli uchburchakda mediana VA bissektrisa ham bo'ladi", 'так как OP высота, в равнобедренном треугольнике она и медиана, и биссектриса', 'since OP is the height, in an isosceles triangle it is also the median and the bisector'),
        options: [
          { id: 'ok', right: true, label: L("Teng yonli uchburchakda asosga tushirilgan balandlik mediana va bissektrisa bilan ustma-ust tushadi", 'В равнобедренном треугольнике высота к основанию совпадает с медианой и биссектрисой', 'In an isosceles triangle, the height to the base coincides with the median and the bisector') },
          { id: 'no', label: L("Bu istalgan uchburchakda shunday", 'Так в любом треугольнике', 'That is so in any triangle'), hint: L("Faqat teng yonli uchburchakda, asosga tushirilgan balandlik uchun shunday bo'ladi.", 'Только в равнобедренном треугольнике, и только для высоты к основанию.', 'Only in an isosceles triangle, and only for the height to the base.') },
        ],
      },
      {
        text: L("OP mediana bo'lgani uchun, AP = PB", 'так как OP медиана, AP = PB', 'since OP is the median, AP = PB'),
        options: [
          { id: 'ok', right: true, label: L("Mediana asosni teng ikkiga bo'ladi, aynan shu vatarni", 'Медиана делит основание пополам, именно эту хорду', 'The median bisects the base, exactly this chord') },
          { id: 'no', label: L("AP va PB boshidanoq teng edi", 'AP и PB были равны с самого начала', 'AP and PB were equal from the start'), hint: L("Bu hali isbotlanmagan edi, aynan mediana xossasidan kelib chiqadi.", 'Это ещё не было доказано, оно следует именно из свойства медианы.', 'This was not proven yet, it follows exactly from the property of the median.') },
        ],
      },
      {
        text: L("OP bissektrisa bo'lgani uchun, ∠AOP = ∠BOP, demak yoy AD = yoy DB", 'так как OP биссектриса, ∠AOP = ∠BOP, значит дуга AD = дуге DB', 'since OP is the bisector, ∠AOP = ∠BOP, so arc AD = arc DB'),
        options: [
          { id: 'ok', right: true, label: L("Teng markaziy burchaklarga teng yoylar mos keladi", 'Равным центральным углам соответствуют равные дуги', 'Equal central angles correspond to equal arcs') },
          { id: 'no', label: L("Yoylar diametrning o'zidan kelib chiqadi", 'Дуги следуют из самого диаметра', 'The arcs follow from the diameter itself'), hint: L("Yoylar tengligi burchaklar tengligidan, ya'ni bissektrisadan kelib chiqadi.", 'Равенство дуг следует из равенства углов, то есть из биссектрисы.', 'The equality of the arcs follows from the equality of the angles, that is, from the bisector.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. Perpendikulyar diametr vatarni ham, unga tiralgan yoyni ham teng ikkiga bo'ladi.",
      'Доказано. Перпендикулярный диаметр делит пополам и хорду, и стягиваемую ею дугу.',
      'Proven. The perpendicular diameter bisects both the chord and the arc it subtends.',
    ),
  },
}

// ============================================================
// EKRAN 5. TENG YOYLARNI TOPING (`circlefigure`). Ловушка, noto'g'ri
// yarmi bosilishi (З105).
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'circlefigure',
  tag: 'З105',
  eyebrow: L('KICHIK YOY AD NI TOPING', 'НАЙДИ МАЛУЮ ДУГУ AD', 'FIND THE MINOR ARC AD'),
  title: L(
    "CD diametr AB vatarga perpendikulyar. Kichik yoy AD ni bosing",
    'Диаметр CD перпендикулярен хорде AB. Нажми на малую дугу AD',
    'Diameter CD is perpendicular to chord AB. Tap the minor arc AD',
  ),
  audio: [
    A('mount',
      "A, D, B nuqtalar aylanada, shu tartibda.",
      'Точки A, D, B на окружности, именно в таком порядке.',
      'Points A, D, B are on the circle, in that order.'),
    A('why',
      "Diametr perpendikulyar bo'lgani uchun, yoy AD yoy DB ga teng bo'ladi.",
      'Так как диаметр перпендикулярен, дуга AD равна дуге DB.',
      'Since the diameter is perpendicular, arc AD equals arc DB.'),
  ],
  props: {
    points: { A: 200, D: 270, B: 340 },
    radii: ['A', 'D', 'B'],
    pair: ['A', 'D'],
    target: 'minor',
    ask: L("Kichik yoy AD ni bosing", 'Нажми на малую дугу AD', 'Tap the minor arc AD'),
    hints: {
      major: L("Bu yoyning katta tomoni, aylananing ko'p qismini egallaydi, kichigi emas.", 'Это большая часть дуги, занимает большую часть окружности, а не малую.', 'That is the larger portion of the arc, taking up most of the circle, not the small one.'),
    },
    after: L(
      "To'g'ri. Xuddi shu kattalikda yoy DB ham bor, chunki diametr perpendikulyar.",
      'Верно. Дуга DB такой же величины, потому что диаметр перпендикулярен.',
      'Correct. Arc DB is the same size, because the diameter is perpendicular.',
    ),
  },
}

// ============================================================
// EKRAN 6. MASOFANI TOPISH (`twoways`): R va vatardan d ni topish.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З104',
  eyebrow: L('MARKAZDAN VATARGACHA MASOFA', 'РАССТОЯНИЕ ОТ ЦЕНТРА ДО ХОРДЫ', 'THE DISTANCE FROM THE CENTRE TO THE CHORD'),
  title: L(
    "Ikki xil aylanada markazdan vatargacha bo'lgan masofani topamiz",
    'Находим расстояние от центра до хорды в двух разных окружностях',
    'We find the distance from the centre to the chord in two different circles',
  ),
  audio: [
    A('mount',
      "Birinchi aylanada radius o'n uch, vatar o'n.",
      'В первой окружности радиус тринадцать, хорда десять.',
      'In the first circle, the radius is thirteen, the chord is ten.'),
    W('w2',
      "Ikkinchisida radius o'n besh, vatar o'n sakkiz.",
      'Во второй радиус пятнадцать, хорда восемнадцать.',
      'In the second, the radius is fifteen, the chord is eighteen.'),
    W('w4',
      "Ikkalasida ham avval vatarning yarmi olinadi, keyin Pifagor teoremasi qo'llanadi.",
      'В обоих случаях сначала берётся половина хорды, потом применяется теорема Пифагора.',
      'In both cases, half the chord is taken first, then the Pythagorean theorem is applied.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-AYLANA, R=13, VATAR=10', 'ОКРУЖНОСТЬ 1, R=13, ХОРДА=10', 'CIRCLE 1, R=13, CHORD=10'),
        lead: L(
          "Vatarning yarmi besh, radius o'n uch",
          'Половина хорды пять, радиус тринадцать',
          'Half the chord is five, the radius is thirteen',
        ),
        rows: [
          { text: '13² − 5² = 144' },
          { text: L("ildizi o'n ikki, masofa shu", 'корень двенадцать, это и есть расстояние', 'the root is twelve, that is the distance'), tone: 'ok' },
        ],
      },
      {
        name: L('2-AYLANA, R=15, VATAR=18', 'ОКРУЖНОСТЬ 2, R=15, ХОРДА=18', 'CIRCLE 2, R=15, CHORD=18'),
        lead: L(
          "Vatarning yarmi to'qqiz, radius o'n besh",
          'Половина хорды девять, радиус пятнадцать',
          'Half the chord is nine, the radius is fifteen',
        ),
        rows: [
          { text: '15² − 9² = 144' },
          { text: L("ildizi ham o'n ikki chiqdi", 'корень тоже вышел двенадцать', 'the root also came out to twelve'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('HAR SAFAR YARMI OLINADI', 'КАЖДЫЙ РАЗ БЕРЁТСЯ ПОЛОВИНА', 'HALF IS TAKEN EACH TIME'),
        lead: L(
          "Ikki xil aylana, bir xil usul",
          'Две разные окружности, один способ',
          'Two different circles, one method',
        ),
        rows: [{ text: L("radius va vatarning yarmi solishtiriladi, vatarning to'liq uzunligi emas", 'сравниваются радиус и половина хорды, а не вся хорда', 'the radius and half the chord are compared, not the whole chord'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. FORMULANING UCH QISMI (`parts`).
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З104',
  eyebrow: L('FORMULANING UCH QISMI', 'ТРИ ЧАСТИ ФОРМУЛЫ', 'THE THREE PARTS OF THE FORMULA'),
  title: L(
    "Formulaning uch qismi",
    'Три части формулы',
    'The three parts of the formula',
  ),
  audio: [
    A('mount',
      "Uchburchak radius, yarim vatar va masofadan tuziladi.",
      'Треугольник образован радиусом, половиной хорды и расстоянием.',
      'The triangle is formed by the radius, half the chord, and the distance.'),
    W('p2',
      "Radius doim gipotenuza, u eng katta tomon.",
      'Радиус всегда гипотенуза, это наибольшая сторона.',
      'The radius is always the hypotenuse, it is the longest side.'),
    W('p4',
      "Vatarning YARMI katet bo'ladi, to'liq vatar emas.",
      'Катетом служит ПОЛОВИНА хорды, а не вся хорда.',
      'Half the chord serves as a leg, not the whole chord.',
    ),
  ],
  props: {
    tokens: [
      { t: 'R²', id: 'mid' },
      { t: '  =  d²  +  ', id: 'a' },
      { t: '(c : 2)²', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Birinchi qism, radius kvadrati. Radius bu uchburchakda gipotenuza.",
          'Первая часть, квадрат радиуса. Радиус в этом треугольнике гипотенуза.',
          'The first part, the square of the radius. The radius is the hypotenuse in this triangle.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Ikkinchi qism, markazdan vatargacha bo'lgan masofa d, u bir katet.",
          'Вторая часть, расстояние от центра до хорды d, это один катет.',
          'The second part, the distance from the centre to the chord d, this is one leg.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qism, vatarning yarmi, ikkinchi katet. Butun vatar emas, aynan yarmi.",
          'Третья часть, половина хорды, второй катет. Не вся хорда, именно половина.',
          'The third part, half the chord, the second leg. Not the whole chord, exactly half.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Diametrning o'zi ham vatar, va u markazdan aynan nolga teng masofada turadi, chunki markazning o'zidan o'tadi.",
        'Сам диаметр тоже хорда, и он находится на расстоянии ровно ноль от центра, потому что проходит через сам центр.',
        'The diameter itself is also a chord, and it stands at exactly zero distance from the centre, because it passes through the centre itself.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 34-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З104',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Aylana vatari va diametrining xossalari",
    'Свойства хорды и диаметра окружности',
    "The properties of the circle's chord and diameter",
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
      { id: 'f1', label: L("vatarga perpendikulyar diametr shu vatarni va yoyni teng ikkiga bo'ladi", 'диаметр, перпендикулярный хорде, делит её и дугу пополам', 'a diameter perpendicular to a chord bisects it and the arc') },
      { id: 'f2', label: L("vatar diametridan katta bo'lmaydi", 'хорда не бывает больше диаметра', 'a chord is never greater than the diameter') },
      { id: 'f3', label: L("R, d va vatarning yarmi Pifagor teoremasi bilan bog'langan", 'R, d и половина хорды связаны теоремой Пифагора', "R, d, and half the chord are linked by the Pythagorean theorem") },
      { id: 'w1', label: L("istalgan diametr istalgan vatarni teng ikkiga bo'ladi", 'любой диаметр делит любую хорду пополам', 'any diameter bisects any chord') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Teng ikkiga bo'lish faqat perpendikulyar diametrda, ixtiyoriysida emas.",
      'Так не складывается. Деление пополам только у перпендикулярного диаметра, не у любого.',
      'That does not fit. Bisecting happens only for a perpendicular diameter, not any diameter.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 4-§, 34-mavzu asosida (109-110-bet)",
        'Правило на основе геометрии, § 4, тема 34 учебника (стр. 109-110)',
        'The rule is based on geometry, section 4, topic 34 of the textbook (pages 109-110)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Aylana ichida Pifagor teoremasini qayerda qo'llashni bilmasdik",
        'Мы не знали, где внутри окружности применять теорему Пифагора',
        'We did not know where to apply the Pythagorean theorem inside a circle',
      ),
      right: L(
        "endi radius, masofa va yarim vatardan uchburchak tuzishni bilamiz",
        'теперь мы знаем, как построить треугольник из радиуса, расстояния и половины хорды',
        'now we know how to build a triangle from the radius, the distance, and half the chord',
      ),
      winner: 'right',
      note: L(
        "Radius gipotenuza, d va vatarning yarmi katetlar",
        'Радиус гипотенуза, d и половина хорды катеты',
        'The radius is the hypotenuse, d and half the chord are the legs',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): R va vatardan d ni topish.
// ============================================================
const ASK_D = L("Markazdan vatargacha bo'lgan masofa d qancha?", 'Чему равно расстояние от центра до хорды d?', 'What is the distance from the centre to the chord d?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З104',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Radius va vatardan masofani hisoblang",
    'Вычисли расстояние по радиусу и хорде',
    'Compute the distance from the radius and the chord',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida radius va vatar berilgan.",
      'Пять заданий. В каждом даны радиус и хорда.',
      'Five tasks. In each, the radius and the chord are given.'),
    A('why',
      "Vatarning yarmini olib, Pifagor teoremasini qo'llang.",
      'Возьми половину хорды и примени теорему Пифагора.',
      'Take half the chord and apply the Pythagorean theorem.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar vatarning yarmi olingan.",
      'Все пять разобраны. Каждый раз бралась половина хорды.',
      'All five are done. Each time half the chord was taken.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'R = 13,  c = 10'}</Row>,
        ok: L("Ha. Yarmi besh, o'n uchning kvadratidan beshning kvadrati ayirilsa, yuz qirq to'rt, ildizi o'n ikki.", 'Да. Половина пять, из квадрата тринадцати минус квадрат пяти, сто сорок четыре, корень двенадцать.', 'Yes. Half is five, the square of thirteen minus the square of five is a hundred forty-four, the root is twelve.'),
        question: ASK_D,
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '8,3', hint: L("Vatarning to'liq uzunligi bilan hisoblangan, yarmi bilan emas.", 'Посчитано по всей длине хорды, а не по половине.', 'Computed with the whole chord length, not with half of it.') },
        ],
        solution: ['13² − 5²', '144', '12'],
      },
      {
        expr: <Row size="big" align="center">{'R = 17,  c = 16'}</Row>,
        ok: L("Ha. Yarmi sakkiz, o'n yettining kvadratidan sakkizning kvadrati ayirilsa, ikki yuz yigirma besh, ildizi o'n besh.", 'Да. Половина восемь, из квадрата семнадцати минус квадрат восьми, двести двадцать пять, корень пятнадцать.', 'Yes. Half is eight, the square of seventeen minus the square of eight is two hundred twenty-five, the root is fifteen.'),
        question: ASK_D,
        items: [
          { id: 'a', right: true, label: '15' },
          { id: 'b', label: '5,7', hint: L("Vatarning to'liq uzunligi bilan hisoblangan, yarmi bilan emas.", 'Посчитано по всей длине хорды, а не по половине.', 'Computed with the whole chord length, not with half of it.') },
        ],
        solution: ['17² − 8²', '225', '15'],
      },
      {
        expr: <Row size="big" align="center">{'R = 25,  c = 14'}</Row>,
        ok: L("Ha. Yarmi yetti, yigirma beshning kvadratidan yettining kvadrati ayirilsa, olti yuz yigirma sakkiz, ildizi yigirma to'rt.", 'Да. Половина семь, из квадрата двадцати пяти минус квадрат семи, шестьсот двадцать восемь, корень двадцать четыре.', 'Yes. Half is seven, the square of twenty-five minus the square of seven is six hundred twenty-eight, the root is twenty-four.'),
        question: ASK_D,
        items: [
          { id: 'a', right: true, label: '24' },
          { id: 'b', label: '21,6', hint: L("Vatarning to'liq uzunligi bilan hisoblangan, yarmi bilan emas.", 'Посчитано по всей длине хорды, а не по половине.', 'Computed with the whole chord length, not with half of it.') },
        ],
        solution: ['25² − 7²', '576', '24'],
      },
      {
        expr: <Row size="big" align="center">{'R = 15,  c = 18'}</Row>,
        ok: L("Ha. Yarmi to'qqiz, o'n beshning kvadratidan to'qqizning kvadrati ayirilsa, yuz qirq to'rt, ildizi o'n ikki.", 'Да. Половина девять, из квадрата пятнадцати минус квадрат девяти, сто сорок четыре, корень двенадцать.', 'Yes. Half is nine, the square of fifteen minus the square of nine is a hundred forty-four, the root is twelve.'),
        question: ASK_D,
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '5,2', hint: L("Vatarning to'liq uzunligi bilan hisoblangan, yarmi bilan emas.", 'Посчитано по всей длине хорды, а не по половине.', 'Computed with the whole chord length, not with half of it.') },
        ],
        solution: ['15² − 9²', '144', '12'],
      },
      {
        expr: <Row size="big" align="center">{'R = 10,  c = 12'}</Row>,
        ok: L("Ha. Yarmi olti, o'nning kvadratidan oltining kvadrati ayirilsa, oltmish to'rt, ildizi sakkiz.", 'Да. Половина шесть, из квадрата десяти минус квадрат шести, шестьдесят четыре, корень восемь.', 'Yes. Half is six, the square of ten minus the square of six is sixty-four, the root is eight.'),
        question: ASK_D,
        items: [
          { id: 'a', right: true, label: '8' },
          { id: 'b', label: '3,4', hint: L("Vatarning to'liq uzunligi bilan hisoblangan, yarmi bilan emas.", 'Посчитано по всей длине хорды, а не по половине.', 'Computed with the whole chord length, not with half of it.') },
        ],
        solution: ['10² − 6²', '64', '8'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): R va d dan vatarni topish (teskari).
// ============================================================
const ASK_CHORD = L("Vatar qancha?", 'Чему равна хорда?', 'What is the chord?')

const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З104',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Radius va masofadan vatarni toping",
    'Найди хорду по радиусу и расстоянию',
    'Find the chord from the radius and the distance',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Endi radius va masofa berilgan, vatar izlanadi.",
      'Три задания. Теперь даны радиус и расстояние, хорда ищется.',
      'Three tasks. Now the radius and the distance are given, the chord is sought.'),
    A('why',
      "Topilgan yarim vatar ikkiga ko'paytiriladi, to'liq vatar shundan chiqadi.",
      'Найденная половина хорды умножается на два, так получается вся хорда.',
      'The half-chord found is multiplied by two, that gives the whole chord.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar yarmi topilib, ikkiga ko'paytirilgan.",
      'Все три разобраны. Каждый раз находилась половина, потом умножалась на два.',
      'All three are done. Each time the half was found, then multiplied by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'R = 13,  d = 12'}</Row>,
        ok: L("Ha. O'n uchning kvadratidan o'n ikkining kvadrati ayirilsa, yigirma besh, ildizi besh, ikkiga ko'paytirilsa, o'n.", 'Да. Из квадрата тринадцати минус квадрат двенадцати, двадцать пять, корень пять, умножить на два, десять.', 'Yes. The square of thirteen minus the square of twelve is twenty-five, the root is five, times two is ten.'),
        question: ASK_CHORD,
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '5', hint: L("Bu vatarning yarmi, to'liq vatar ikkiga ko'paytirilishi kerak.", 'Это половина хорды, всю хорду нужно умножить на два.', 'That is half the chord, the whole chord must be multiplied by two.') },
        ],
        solution: ['13² − 12²', '25', '5', '5 · 2', '10'],
      },
      {
        expr: <Row size="big" align="center">{'R = 17,  d = 15'}</Row>,
        ok: L("Ha. O'n yettining kvadratidan o'n beshning kvadrati ayirilsa, oltmish to'rt, ildizi sakkiz, ikkiga ko'paytirilsa, o'n olti.", 'Да. Из квадрата семнадцати минус квадрат пятнадцати, шестьдесят четыре, корень восемь, умножить на два, шестнадцать.', 'Yes. The square of seventeen minus the square of fifteen is sixty-four, the root is eight, times two is sixteen.'),
        question: ASK_CHORD,
        items: [
          { id: 'a', right: true, label: '16' },
          { id: 'b', label: '8', hint: L("Bu vatarning yarmi, to'liq vatar ikkiga ko'paytirilishi kerak.", 'Это половина хорды, всю хорду нужно умножить на два.', 'That is half the chord, the whole chord must be multiplied by two.') },
        ],
        solution: ['17² − 15²', '64', '8', '8 · 2', '16'],
      },
      {
        expr: <Row size="big" align="center">{'R = 25,  d = 24'}</Row>,
        ok: L("Ha. Yigirma beshning kvadratidan yigirma to'rtning kvadrati ayirilsa, qirq to'qqiz, ildizi yetti, ikkiga ko'paytirilsa, o'n to'rt.", 'Да. Из квадрата двадцати пяти минус квадрат двадцати четырёх, сорок девять, корень семь, умножить на два, четырнадцать.', 'Yes. The square of twenty-five minus the square of twenty-four is forty-nine, the root is seven, times two is fourteen.'),
        question: ASK_CHORD,
        items: [
          { id: 'a', right: true, label: '14' },
          { id: 'b', label: '7', hint: L("Bu vatarning yarmi, to'liq vatar ikkiga ko'paytirilishi kerak.", 'Это половина хорды, всю хорду нужно умножить на два.', 'That is half the chord, the whole chord must be multiplied by two.') },
        ],
        solution: ['25² − 24²', '49', '7', '7 · 2', '14'],
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
      "Radiusning kvadratidan masofaning kvadratini ayirib, ildiz oling.",
      'Вычти квадрат расстояния из квадрата радиуса и извлеки корень.',
      "Subtract the square of the distance from the square of the radius and take the root."),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash taklif qilingan javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло предложенный ответ.',
      'All three are done. Each time computation checked the proposed answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'R=13, c=10   →   d=12'}</Row>,
        ok: L("Ha. Beshning kvadrati yigirma besh, o'n uchning kvadratidan ayirilsa, yuz qirq to'rt, ildizi o'n ikki.", 'Да. Квадрат пяти двадцать пять, вычесть из квадрата тринадцати, сто сорок четыре, корень двенадцать.', 'Yes. The square of five is twenty-five, subtracted from the square of thirteen gives a hundred forty-four, the root is twelve.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham o'n ikki chiqadi.", 'Посчитай, ответ действительно выходит двенадцать.', 'Compute it, the answer really comes to twelve.') },
        ],
        solution: ['13² − 5²', '144', '12'],
      },
      {
        expr: <Row size="big" align="center">{'R=15, c=18   →   d=6'}</Row>,
        ok: L("Yo'q. Vatarning yarmi to'qqiz, olti emas, to'g'ri hisoblansa d o'n ikki chiqadi.", 'Нет. Половина хорды девять, а не шесть, при верном счёте d выходит двенадцать.', 'No. Half the chord is nine, not six, computed correctly d comes out to twelve.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, vatarning yarmi to'qqiz bo'lishi kerak.", 'Посчитай снова, половина хорды должна быть девять.', 'Compute it again, half the chord should be nine.') },
        ],
        solution: ['15² − 9²', '144', '12'],
      },
      {
        expr: <Row size="big" align="center">{'R=25, d=24   →   c=14'}</Row>,
        ok: L("Ha. Yigirma beshning kvadratidan yigirma to'rtning kvadrati ayirilsa, qirq to'qqiz, ildizi yetti, ikkiga ko'paytirilsa, o'n to'rt.", 'Да. Из квадрата двадцати пяти минус квадрат двадцати четырёх, сорок девять, корень семь, умножить на два, четырнадцать.', 'Yes. The square of twenty-five minus the square of twenty-four is forty-nine, the root is seven, times two is fourteen.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham o'n to'rt chiqadi.", 'Посчитай, ответ действительно выходит четырнадцать.', 'Compute it, the answer really comes to fourteen.') },
        ],
        solution: ['25² − 24²', '49', '7', '14'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): to'liq vatar ishlatilgan (З104)
// va perpendikulyarsiz teng ikkiga bo'linishi (З105).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З104',
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
      "Birinchisida to'liq vatar ishlatilgan, ikkinchisida perpendikulyarlik shartsiz qoldirilgan.",
      'В первом использована вся хорда, во втором забыто условие перпендикулярности.',
      'In the first, the whole chord was used, in the second, the perpendicularity condition was dropped.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham boshqa-boshqa qoidani chetlab o'tgan.",
      'Обе разобраны. Обе ошибки обошли разные правила.',
      'Both are done. Each mistake bypassed a different rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'R=13, c=10   →   "d² = 13² − 10²"'}</Row>,
        ok: L("Ha. Vatarning to'liq uzunligi emas, yarmi, ya'ni besh, kvadratga oshirilishi kerak edi.", 'Да. Возводить в квадрат нужно было не всю хорду, а её половину, то есть пять.', 'Yes. It was half the chord, that is five, not the whole chord, that should have been squared.'),
        question: L("Radius o'n uch, vatar o'n bo'lsa, va d yuqoridagicha yozilgan bo'lsa, bu yerda xato qayerda?", 'Если радиус тринадцать, хорда десять, а d записано как выше, в чём здесь ошибка?', 'If the radius is thirteen, the chord is ten, and d was written as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Vatarning to'liq uzunligi olingan, yarmi emas", 'Взята вся длина хорды, а не половина', 'The whole chord length was taken, not half of it') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, vatarning yarmi besh olinishi kerak edi.", 'Это и есть показанная ошибка, нужно было взять половину хорды, пять.', 'This is the very mistake shown; half the chord, five, should have been taken.') },
        ],
        solution: ['13² − 5²', '144', '12'],
      },
      {
        expr: <Row size="big" align="center">{'AP = PB ?'}</Row>,
        ok: L("Ha. Perpendikulyarlik shartsiz, diametr vatarni teng ikkiga bo'lishi shart emas.", 'Да. Без условия перпендикулярности диаметр не обязан делить хорду пополам.', 'Yes. Without the perpendicularity condition, the diameter does not have to bisect the chord.'),
        question: L("Diametr vatarga perpendikulyar emas, va u vatarni teng ikkiga bo'ldi deb aytilgan bo'lsa, bu yerda xato qayerda?", 'Если диаметр не перпендикулярен хорде, а сказано, что он делит её пополам, в чём здесь ошибка?', 'If the diameter is not perpendicular to the chord, and it was said to bisect it, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Perpendikulyarlik sharti tekshirilmagan", 'Условие перпендикулярности не проверено', 'The perpendicularity condition was not checked') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, teorema faqat perpendikulyar holat uchun ishlaydi.", 'Это и есть показанная ошибка, теорема работает только для перпендикулярного случая.', 'This is the very mistake shown; the theorem only works for the perpendicular case.') },
        ],
        solution: ['CD ⊥ AB ?'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): R va vatardan d ni qadamlab hisoblash.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З104',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Radius va vatardan masofani qadamlab hisoblang",
    'Вычисли расстояние по радиусу и хорде, по шагам',
    'Compute the distance from the radius and the chord, step by step',
  ),
  audio: [
    A('mount',
      "Radius va vatar berilgan. Vatarning yarmi olinib, Pifagor teoremasi qo'llanadi.",
      'Даны радиус и хорда. Берётся половина хорды, применяется теорема Пифагора.',
      'The radius and the chord are given. Half the chord is taken, the Pythagorean theorem is applied.'),
    A('why',
      "Bu qadam har doim bir xil, faqat sonlar o'zgaradi.",
      'Этот шаг всегда одинаков, меняются только числа.',
      'This step is always the same, only the numbers change.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar vatarning yarmi olinib, d topilgan.",
      'Все три заполнены. Каждый раз бралась половина хорды, находилось d.',
      'All three are filled. Each time half the chord was taken, d was found.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['5', '12'],
      lines: [
        [{ t: 'R = 13, c = 10   →   c/2 = ' }, { slot: '5' }, { t: '   →   d = ' }, { slot: '12' }],
      ],
    },
    tasks: [
      {
        chips: ['8', '15'],
        lines: [
          [{ t: 'R = 17, c = 16   →   c/2 = ' }, { slot: '8' }, { t: '   →   d = ' }, { slot: '15' }],
        ],
      },
      {
        chips: ['9', '12'],
        lines: [
          [{ t: 'R = 15, c = 18   →   c/2 = ' }, { slot: '9' }, { t: '   →   d = ' }, { slot: '12' }],
        ],
      },
      {
        chips: ['6', '8'],
        lines: [
          [{ t: 'R = 10, c = 12   →   c/2 = ' }, { slot: '6' }, { t: '   →   d = ' }, { slot: '8' }],
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
    "Vatar va diametr bo'yicha to'rt savol",
    'Четыре вопроса о хорде и диаметре',
    'Four questions about the chord and the diameter',
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
        id: 'q1', tag: 'З105',
        ask: L('Diametr vatarga perpendikulyar bo\'lmasa, u vatarni teng ikkiga bo\'ladimi?', 'Если диаметр не перпендикулярен хорде, делит ли он её пополам?', 'If the diameter is not perpendicular to the chord, does it bisect it?'),
        options: [
          { id: 'ok', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'no', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Teorema faqat perpendikulyar holat uchun ishlaydi.", 'Теорема работает только для перпендикулярного случая.', 'The theorem only works for the perpendicular case.'),
        ok: L("To'g'ri, faqat perpendikulyar bo'lsa bo'ladi.", 'Верно, только если он перпендикулярен.', 'Correct, only if it is perpendicular.'),
      },
      {
        id: 'q2', tag: 'З104',
        ask: L('R = 25, vatar = 48. Markazdan vatargacha bo\'lgan masofa qancha?', 'R = 25, хорда = 48. Чему равно расстояние от центра до хорды?', 'R = 25, chord = 48. What is the distance from the centre to the chord?'),
        options: [
          { id: 'ok', right: true, label: '7' },
          { id: 'no', label: '23' },
        ],
        hint: L("Vatarning yarmi yigirma to'rt, u yigirma sakkiz emas.", 'Половина хорды двадцать четыре, а не сорок восемь.', 'Half the chord is twenty-four, not forty-eight.'),
        ok: L("To'g'ri, yigirma beshning kvadratidan yigirma to'rtning kvadrati ayirilsa, yetti chiqadi.", 'Верно, из квадрата двадцати пяти минус квадрат двадцати четырёх выходит семь.', 'Correct, the square of twenty-five minus the square of twenty-four gives seven.'),
      },
      {
        id: 'q3', tag: 'З104',
        ask: L('R = 10, d = 6. Vatar qancha?', 'R = 10, d = 6. Чему равна хорда?', 'R = 10, d = 6. What is the chord?'),
        options: [
          { id: 'ok', right: true, label: '16' },
          { id: 'no', label: '8' },
        ],
        hint: L("Sakkiz vatarning yarmi, to'liq vatar ikkiga ko'paytirilishi kerak.", 'Восемь это половина хорды, всю хорду нужно умножить на два.', 'Eight is half the chord, the whole chord must be multiplied by two.'),
        ok: L("To'g'ri, sakkiz ikkiga ko'paytirilsa, o'n olti.", 'Верно, восемь умножить на два, шестнадцать.', 'Correct, eight times two is sixteen.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('17² − 15² ni hisoblasak, 64 chiqadimi?', 'Верно ли, что 17² − 15², равно 64?', 'Is it true that 17² − 15² equals 64?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, ikki yuz sakson to'qqizdan ikki yuz yigirma beshni ayiring.", 'Посчитай, вычти двести двадцать пять из двухсот восьмидесяти девяти.', 'Compute it, subtract two hundred twenty-five from two hundred eighty-nine.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З104',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Radiusi 20, vatari 32 bo'lgan aylanada markazdan vatargacha bo'lgan masofani yig'ing.",
            'Собери расстояние от центра до хорды в окружности с радиусом 20 и хордой 32.',
            'Assemble the distance from the centre to the chord, in a circle with radius 20 and chord 32.',
          ),
          lines: [
            [{ t: 'c/2 = ' }, { slot: '16' }, { t: '   →   d = ' }, { slot: '12' }],
          ],
          tiles: [
            { id: 't1', v: '16', x: 12, y: 12 },
            { id: 't2', v: '12', x: 60, y: 14 },
            { id: 't3', v: '32', x: 30, y: 50 },
            { id: 't4', v: '4', x: 78, y: 48 },
          ],
          hint: L(
            "O'ttiz ikkini ikkiga bo'ling, keyin yigirmaning kvadratidan natijaning kvadratini ayiring.",
            'Раздели тридцать два на два, потом вычти квадрат результата из квадрата двадцати.',
            'Divide thirty-two by two, then subtract the square of the result from the square of twenty.',
          ),
          doneNote: L(
            "Yig'ildi. Vatarning yarmi o'n olti, masofa esa o'n ikki chiqdi.",
            'Собрано. Половина хорды шестнадцать, а расстояние вышло двенадцать.',
            'Assembled. Half the chord is sixteen, and the distance comes out to twelve.',
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
    "Faqat perpendikulyar diametr teng ikkiga bo'ladi, va yarmi katet bo'ladi",
    'Только перпендикулярный диаметр делит пополам, и половина служит катетом',
    'Only a perpendicular diameter bisects, and half serves as a leg',
  ),
  audio: [
    A('s0',
      "Darsdan bitta uchburchak qoladi. Radius, masofa va vatarning yarmi.",
      'С урока остаётся один треугольник. Радиус, расстояние и половина хорды.',
      'One triangle stays with you. The radius, the distance, and half the chord.'),
    A('s1',
      "Bugun uch narsa qilindi. Teoremani isbotladingiz, teng yoylarni chertyozhda topdingiz va radius bilan vatardan masofani hisobladingiz.",
      'Сегодня сделано три вещи. Ты доказал теорему, нашёл равные дуги на чертеже, и вычислил расстояние по радиусу и хорде.',
      'Three things are done today. You proved the theorem, found equal arcs on a drawing, and computed the distance from the radius and the chord.'),
    A('s2',
      "Keyingi darsda to'g'ri chiziq va aylananing o'zaro joylashishi, jumladan urinma.",
      'В следующем уроке взаимное расположение прямой и окружности, в том числе касательная.',
      'The next lesson covers the relative position of a line and a circle, including the tangent.',
    ),
  ],
  props: {
    mark: L("R² = d² + (vatar : 2)²", 'R² = d² + (хорда : 2)²', 'R² = d² + (chord : 2)²'),
    markNote: L(
      "R = 13, vatar = 10 → d = 12",
      'R = 13, хорда = 10 → d = 12',
      'R = 13, chord = 10 → d = 12',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: to'g'ri chiziq va aylana, urinma",
      'Следующий урок: прямая и окружность, касательная',
      'Next lesson: the line and the circle, the tangent',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
