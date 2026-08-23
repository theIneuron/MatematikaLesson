// ============================================================================
// 8-sinf, Dars 52. ICHKI VA TASHQI CHIZILGAN AYLANALAR, KESUVCHI
// BURCHAKLARI.
//
// BLOK Б7, AYLANA QISMINING SO'NGGI DARSI (uch mavzu bir darsga sig'diriladi,
// reja bo'yicha). Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`,
// `prooflines.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da. YANGI PRIBOR
// YO'Q — `ProofLines` (dars 37+) qayta ishlatilgan.
//
// MANBA: 8-sinf geometriya darsligi, 4-§ (AYLANA):
//   - 37-mavzu (118-119-bet), ICHKI CHIZILGAN AYLANA: har qanday
//     uchburchakka ichki aylana chizish mumkin, markazi UCH BISSEKTRISA
//     kesishgan nuqta (A va B bissektrisalari O da kesishsa, OD=OF va
//     OD=OE, demak OF=OE, O uchinchi bissektrisada ham yotadi). Masala
//     (119-bet): AF=5, FC=6 (urinish nuqtalari), BC=10 → perimetr 30
//     (50-darsdagi teng urinmalar faktidan). Tashqi chizilgan to'rtburchak:
//     qarama-qarshi tomonlar YIG'INDISI teng (AB+CD=AD+BC), teng emas;
//   - 38-mavzu (121-bet), TASHQI CHIZILGAN AYLANA: har qanday uchburchakka
//     tashqi aylana chizish mumkin, markazi UCH TOMONNING O'RTA
//     PERPENDIKULYARI kesishgan nuqta. To'g'ri burchakli uchburchakda bu
//     markaz gipotenuzaning o'rtasi (51-darsdagi Fales natijasidan!),
//     R = gipotenuza : 2. Ichki chizilgan to'rtburchakning qarama-qarshi
//     burchaklari yig'indisi 180° (ikkalasi ham ichki chizilgan burchak,
//     ular tiralgan ikki yoy yig'indisi 360°, yarmi 180°);
//   - 39-mavzu (124-bet), KESUVCHI BURCHAKLARI: urinma va vatar orasidagi
//     burchak ichiga olgan yoyning yarmi bilan o'lchanadi (1-teorema, bu
//     darsda shu birdan olinadi, 2- va 3-teoremalar — ikki vatar va ikki
//     kesuvchi orasidagi burchaklar — keyingi bosqichga qoldiriladi);
//   - 460-, 461-, 482-mashqlar: to'g'ri burchakli uchburchakda r =
//     (katet+katet−gipotenuza):2 va R = gipotenuza:2, allaqachon tanish
//     Pifagor uchliklari bilan (3,4,5 → r=1; 6,8,10 → R=5, r=2; va h.k.).
//
// ADASHISHLAR, ikkitasi yangi:
//   З110, ichki chizilgan aylananing markazi bissektrisalar emas, o'rta
//   perpendikulyarlar kesishgan nuqta deb o'ylangan (yoki aksincha);
//   З111, tashqi chizilgan to'rtburchakda qarama-qarshi tomonlar TENG deb
//   o'ylangan, aslida ularning YIG'INDILARI teng;
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
  id: 'geo-8-52',
  n: 52,
  row: 57,
  block: 'Б7',
  topic: L('Ichki va tashqi chizilgan aylanalar, kesuvchi burchaklari', 'Вписанная и описанная окружности, углы секущих', 'The inscribed and circumscribed circles, the angles of secants'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Har qanday uchburchakka ichki aylana chizish mumkin, markazi burchak BISSEKTRISALARI kesishgan nuqta",
    'Внутрь любого треугольника можно вписать окружность, её центр — точка пересечения БИССЕКТРИС углов',
    'A circle can be inscribed in any triangle, its centre is the point where the angle BISECTORS meet',
  ),
  L(
    "Har qanday uchburchakka tashqi aylana chizish mumkin, markazi tomonlarning O'RTA PERPENDIKULYARLARI kesishgan nuqta; to'g'ri burchaklida bu gipotenuzaning o'rtasi, R = gipotenuza : 2",
    'Вокруг любого треугольника можно описать окружность, её центр — точка пересечения СЕРЕДИННЫХ ПЕРПЕНДИКУЛЯРОВ сторон; в прямоугольном это середина гипотенузы, R = гипотенуза : 2',
    "A circle can be circumscribed about any triangle, its centre is the point where the perpendicular BISECTORS of the sides meet; in a right triangle this is the midpoint of the hypotenuse, R = hypotenuse : 2",
  ),
  L(
    "Ichki chizilgan to'rtburchakning qarama-qarshi burchaklari yig'indisi 180°; tashqi chizilgan to'rtburchakning qarama-qarshi tomonlari YIG'INDILARI teng",
    'Сумма противоположных углов вписанного четырёхугольника равна 180°; у описанного четырёхугольника равны СУММЫ противоположных сторон',
    "The sum of opposite angles of an inscribed quadrilateral is 180°; for a circumscribed quadrilateral, the SUMS of opposite sides are equal",
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З110': {
    what: L(
      "ichki chizilgan aylananing markazi bissektrisalar emas, o'rta perpendikulyarlar kesishgan nuqta deb o'ylangan",
      'центр вписанной окружности принят за точку пересечения серединных перпендикуляров, а не биссектрис',
      'the centre of the inscribed circle was taken as the intersection of the perpendicular bisectors, not the angle bisectors',
    ),
    wrong: null,
    at: 12,
  },
  'З111': {
    what: L(
      "tashqi chizilgan to'rtburchakda qarama-qarshi tomonlar teng deb o'ylangan, aslida ularning yig'indilari teng",
      'считалось, что у описанного четырёхугольника противоположные стороны равны, а на самом деле равны их суммы',
      "it was thought that a circumscribed quadrilateral's opposite sides are equal, but actually their sums are equal",
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (4-, 6-ekran, ProofLines). Uchburchak ABC,
// ichki nuqta O uchta uchga tutashgan (bissektrisa YOKI o'rta perpendikulyar
// sifatida talqin qilinadi).
// ============================================================
const TRI_PTS = { A: [15, 85], B: [95, 85], C: [55, 15], O: [55, 60] }
const TRI_ORDER = ['A', 'B', 'C']

// ============================================================
// SAHNALAR (§6). Xuk: uchburchakka ichki aylana doim chizish mumkinmi.
// ============================================================
const SC_ASK = L('ICHKI VA TASHQI AYLANA', 'ВПИСАННАЯ И ОПИСАННАЯ', 'INSCRIBED AND CIRCUMSCRIBED')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <polygon points="140,90 210,90 175,35" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <circle cx="175" cy="72" r="16" fill="none" stroke={T.ink4} strokeWidth="1.2" strokeDasharray="3,2"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="175" cy="72" r="10" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.2"/>
        <text x="175" y="76" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Bissektrisalar — ichki markaz; o'rta perpendikulyarlar — tashqi markaz",
      'Биссектрисы — центр вписанной; серединные перпендикуляры — центр описанной',
      'Bisectors, the inscribed centre; perpendicular bisectors, the circumscribed centre',
    )}>
      <polygon points="150,90 220,90 185,35" fill="none" stroke={T.ok} strokeWidth="1.6"/>
      <circle cx="185" cy="72" r="15" fill="none" stroke={T.ok} strokeWidth="1.2"/>
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
  eyebrow: L('ICHKI VA TASHQI AYLANA', 'ВПИСАННАЯ И ОПИСАННАЯ', 'INSCRIBED AND CIRCUMSCRIBED'),
  title: L(
    "Har qanday uchburchak ichiga, uning hamma tomonlariga urinadigan aylana chizib bo'ladi deb o'ylaysizmi",
    'Думаешь, внутрь любого треугольника можно вписать окружность, касающуюся всех его сторон',
    'Do you think a circle touching all three sides can be drawn inside any triangle',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Uchburchaklar har xil, ba'zilari o'tkir, ba'zilari o'tmas burchakli.",
      'Треугольники разные, одни остроугольные, другие тупоугольные.',
      'Triangles differ, some are acute, some are obtuse.'),
    A('why',
      "Taxmin qiling, ichki aylana ularning hammasiga chizib bo'ladimi.",
      'Предположи, можно ли вписать окружность в любой из них.',
      'Predict whether a circle can be inscribed in any of them.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, HAR QANDAY uchburchakka ichki aylana chizish mumkinmi?",
      'Как думаешь, можно ли вписать окружность в ЛЮБОЙ треугольник?',
      'What do you think, can a circle be inscribed in ANY triangle?',
    ),
    items: [
      { id: 'a', show: L('Ha, hammasiga', 'Да, во все', 'Yes, into any') },
      { id: 'b', show: L("Faqat teng tomonlilarga", 'Только в равносторонние', 'Only into equilateral ones') },
      { id: 'c', show: L("Faqat to'g'ri burchaklilarga", 'Только в прямоугольные', 'Only into right triangles') },
      { id: 'd', show: L("Hech qaysiga", 'В никакой', 'Into none') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Bissektrisa va o'rta perpendikulyarni eslash.
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Bissektrisa va o'rta perpendikulyarni ajratish",
    'Различаем биссектрису и серединный перпендикуляр',
    'Telling the bisector and the perpendicular bisector apart',
  ),
  audio: [
    A('mount',
      "Bissektrisa burchakni teng ikkiga bo'ladi, u burchak uchidan chiqadi.",
      'Биссектриса делит угол пополам, она выходит из вершины угла.',
      'The bisector splits an angle in half, it starts from the vertex of the angle.'),
    A('why',
      "O'rta perpendikulyar esa tomonning o'rtasidan, unga perpendikulyar chiqadi, burchak uchidan emas.",
      'А серединный перпендикуляр выходит из середины стороны, перпендикулярно ей, а не из вершины.',
      'The perpendicular bisector, though, starts from the midpoint of a side, perpendicular to it, not from a vertex.'),
  ],
  props: {
    ask: L(
      "Bissektrisa qayerdan chiqadi?",
      'Откуда выходит биссектриса?',
      'Where does the bisector start from?',
    ),
    items: [
      { id: 'right', show: L("Burchak uchidan, uni teng ikkiga bo'lib", 'Из вершины угла, деля его пополам', 'From the vertex of an angle, splitting it in half'), right: true, name: L("bissektrisa burchakning yarmi", 'биссектриса половина угла', 'the bisector is half the angle') },
      {
        id: 'wrong', show: L("Tomonning o'rtasidan, unga perpendikulyar", 'Из середины стороны, перпендикулярно ей', 'From the midpoint of a side, perpendicular to it'),
        hint: L("Bu o'rta perpendikulyarning ta'rifi, bissektrisaning emas.", 'Это определение серединного перпендикуляра, а не биссектрисы.', 'That is the definition of the perpendicular bisector, not the bisector.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun ikkalasi ham kerak bo'ladi, ammo ular boshqa-boshqa markazga olib boradi.",
      'Верно. Сегодня понадобятся оба, но они ведут к разным центрам.',
      'Correct. Today both will be needed, but they lead to different centres.',
    ),
  },
}

// ============================================================
// EKRAN 3. QAYSI MARKAZ (`pick`). Ловушка, bissektrisa/o'rta perpendikulyar
// chalkashtirilishi (З110).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З110',
  eyebrow: L('QAYSI MARKAZ', 'КАКОЙ ЦЕНТР', 'WHICH CENTRE'),
  title: L(
    "Ichki chizilgan aylananing markazi qanday topiladi",
    'Как находится центр вписанной окружности',
    'How is the centre of the inscribed circle found',
  ),
  audio: [
    A('mount',
      "Ichki chizilgan aylana uchburchakning hamma tomonlariga urinadi.",
      'Вписанная окружность касается всех сторон треугольника.',
      'The inscribed circle touches all the sides of the triangle.'),
    A('why',
      "Uning markazi tomonlardan TENG MASOFADA, bu esa bissektrisalar orqali topiladi.",
      'Её центр находится на РАВНОМ РАССТОЯНИИ от сторон, а это находится через биссектрисы.',
      "Its centre is at an EQUAL DISTANCE from the sides, and that is found through the bisectors."),
  ],
  props: {
    ask: L(
      "Ichki chizilgan aylananing markazi qayerda joylashadi?",
      'Где находится центр вписанной окружности?',
      'Where is the centre of the inscribed circle located?',
    ),
    items: [
      { id: 'right', show: L("Uch bissektrisa kesishgan nuqtada", 'В точке пересечения трёх биссектрис', 'At the point where the three bisectors meet'), right: true, name: L("bissektrisa tomonlardan teng masofani ta'minlaydi", 'биссектриса обеспечивает равное расстояние от сторон', 'the bisector ensures an equal distance from the sides') },
      {
        id: 'wrong', show: L("Uch o'rta perpendikulyar kesishgan nuqtada", 'В точке пересечения трёх серединных перпендикуляров', 'At the point where the three perpendicular bisectors meet'),
        hint: L("Bu tashqi chizilgan aylananing markazi, ichki chizilganining emas.", 'Это центр описанной окружности, а не вписанной.', 'That is the centre of the circumscribed circle, not the inscribed one.'),
      },
    ],
    after: L(
      "To'g'ri. Bissektrisalar kesishgan nuqta hamma tomondan teng masofada, aynan shu ichki aylananing markazi.",
      'Верно. Точка пересечения биссектрис равноудалена от всех сторон, это и есть центр вписанной окружности.',
      'Correct. The point where the bisectors meet is equidistant from all the sides, this is exactly the centre of the inscribed circle.',
    ),
  },
}

// ============================================================
// EKRAN 4. ICHKI AYLANANI ISBOTLAYMIZ (`prooflines`). 37-mavzu, 118-bet.
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З110',
  eyebrow: L('ICHKI AYLANA MAVJUDLIGINI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ СУЩЕСТВОВАНИЕ ВПИСАННОЙ', 'PROVING THE INSCRIBED CIRCLE EXISTS'),
  title: L(
    "Har qanday uchburchakka ichki aylana chizish mumkin",
    'В любой треугольник можно вписать окружность',
    'A circle can be inscribed in any triangle',
  ),
  audio: [
    A('mount',
      "A va B burchaklarning bissektrisalari O nuqtada kesishadi.",
      'Биссектрисы углов A и B пересекаются в точке O.',
      'The bisectors of angles A and B meet at point O.'),
    A('why',
      "O bissektrisada bo'lgani uchun, u har ikki tomondan teng masofada turadi.",
      'Так как O на биссектрисе, она находится на равном расстоянии от обеих сторон.',
      'Since O is on the bisector, it is at an equal distance from both sides.'),
  ],
  props: {
    points: TRI_PTS,
    order: TRI_ORDER,
    marks: [['A', 'O'], ['B', 'O'], ['C', 'O']],
    given: [
      L("ABC uchburchak, O — A va B bissektrisalarining kesishgan nuqtasi", 'Треугольник ABC, O — точка пересечения биссектрис A и B', 'Triangle ABC, O the intersection point of the bisectors of A and B'),
    ],
    goal: L("O uchinchi bissektrisada ham yotadi", 'O лежит и на третьей биссектрисе', 'O also lies on the third bisector'),
    lines: [
      {
        text: L("O, A burchak bissektrisasida bo'lgani uchun, AB va AC tomonlaridan teng masofada", 'так как O на биссектрисе угла A, она равноудалена от сторон AB и AC', 'since O is on the bisector of angle A, it is equidistant from sides AB and AC'),
        options: [
          { id: 'ok', right: true, label: L("Bissektrisaning har bir nuqtasi burchak tomonlaridan teng masofada bo'ladi", 'Каждая точка биссектрисы равноудалена от сторон угла', 'Every point of a bisector is equidistant from the sides of the angle') },
          { id: 'no', label: L("Bu chizmadan shunday ko'rinadi", 'Так видно на чертеже', 'That is how it looks on the drawing'), hint: L("Ko'rinish sabab emas, bu bissektrisaning ma'lum xossasi.", 'Внешний вид не причина, это известное свойство биссектрисы.', 'Appearance is not the reason, this is a known property of the bisector.') },
        ],
      },
      {
        text: L("O, B burchak bissektrisasida bo'lgani uchun, AB va BC tomonlaridan teng masofada", 'так как O на биссектрисе угла B, она равноудалена от сторон AB и BC', 'since O is on the bisector of angle B, it is equidistant from sides AB and BC'),
        options: [
          { id: 'ok', right: true, label: L("Xuddi shu xossa, endi B burchagi uchun", 'То же свойство, теперь для угла B', 'The same property, now for angle B') },
          { id: 'no', label: L("Bu birinchi qatordan avtomatik kelib chiqadi", 'Это автоматически следует из первой строки', 'This automatically follows from the first line'), hint: L("Yo'q, bu B bissektrisasining alohida xossasi, A dan kelib chiqmaydi.", 'Нет, это отдельное свойство биссектрисы B, оно не следует из A.', 'No, this is a separate property of bisector B, it does not follow from A.') },
        ],
      },
      {
        text: L("shuning uchun O, AC va BC tomonlaridan ham teng masofada, ya'ni C bissektrisasida ham yotadi", 'поэтому O равноудалена и от AC, и от BC, то есть лежит и на биссектрисе C', 'therefore O is equidistant from both AC and BC too, that is, it also lies on the bisector of C'),
        options: [
          { id: 'ok', right: true, label: L("AC dan masofa AB dan masofaga teng, BC dan masofa ham AB dan masofaga teng, demak ular o'zaro teng", 'Расстояние от AC равно расстоянию от AB, расстояние от BC тоже равно расстоянию от AB, значит они равны между собой', 'The distance from AC equals the distance from AB, the distance from BC also equals the distance from AB, so they are equal to each other') },
          { id: 'no', label: L("Bu qo'shimcha faraz", 'Это дополнительное предположение', 'This is an extra assumption'), hint: L("Yo'q, bu ikki oldingi qatordan to'g'ridan-to'g'ri kelib chiqadi.", 'Нет, это прямо следует из двух предыдущих строк.', 'No, this follows directly from the two previous lines.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. Uchala bissektrisa bitta O nuqtada kesishadi, u hamma tomondan teng masofada, shu masofa ichki aylananing radiusi.",
      'Доказано. Все три биссектрисы пересекаются в одной точке O, равноудалённой от всех сторон, это расстояние и есть радиус вписанной окружности.',
      'Proven. All three bisectors meet at one point O, equidistant from all the sides, that distance is the radius of the inscribed circle.',
    ),
  },
}

// ============================================================
// EKRAN 5. PERIMETRNI TOPING (`twoways`): masala, 119-bet, teng urinmalar
// (50-darsdan).
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З111',
  eyebrow: L('PERIMETRNI URINMALARDAN TOPISH', 'НАХОДИМ ПЕРИМЕТР ПО КАСАТЕЛЬНЫМ', 'FINDING THE PERIMETER FROM THE TANGENTS'),
  title: L(
    "Urinish nuqtalari asosida perimetrni topish",
    'Нахождение периметра по точкам касания',
    'Finding the perimeter from the points of tangency',
  ),
  audio: [
    A('mount',
      "AC tomonda urinish nuqtasi bor, u AC ni besh va olti santimetrli qismlarga bo'ladi.",
      'На стороне AC есть точка касания, она делит AC на части пять и шесть сантиметров.',
      'On side AC there is a point of tangency, it splits AC into parts five and six centimetres.'),
    W('w2',
      "BC o'n santimetr berilgan, undan olti ayirilib, to'rt qoladi, bu B dan chiqqan urinma.",
      'BC дано десять сантиметров, из него вычитается шесть, остаётся четыре, это касательная из B.',
      'BC is given as ten centimetres, six is subtracted, leaving four, this is the tangent from B.'),
    W('w4',
      "50-darsdagi faktga ko'ra, bir nuqtadan chiqqan ikki urinma teng, shu bilan hamma tomon topiladi.",
      'По факту из 50 урока, две касательные из одной точки равны, этим находятся все стороны.',
      'By the fact from lesson 50, two tangents from one point are equal, this finds all the sides.',
    ),
  ],
  props: {
    stepMs: 1600,
    blocks: [
      {
        name: L('AC TOMONI', 'СТОРОНА AC', 'SIDE AC'),
        lead: L(
          "Urinish nuqtasi AC ni besh va olti qismga bo'ladi",
          'Точка касания делит AC на пять и шесть',
          'The point of tangency splits AC into five and six',
        ),
        rows: [{ text: 'AC = 5 + 6 = 11', tone: 'ok' }],
      },
      {
        name: L('AB VA BC TOMONLARI', 'СТОРОНЫ AB И BC', 'SIDES AB AND BC'),
        lead: L(
          "BC o'n, undan olti ayirilsa, to'rt qoladi, bu AB uchun ham ishlatiladi",
          'BC десять, минус шесть, остаётся четыре, это же используется для AB',
          'BC is ten, minus six leaves four, this is used for AB too',
        ),
        rows: [{ text: 'AB = 5 + 4 = 9', tone: 'ok' }],
      },
      {
        tone: 'sum',
        name: L('PERIMETR', 'ПЕРИМЕТР', 'THE PERIMETER'),
        lead: L(
          "Uchta tomon qo'shiladi",
          'Три стороны складываются',
          'The three sides are added',
        ),
        rows: [{ text: '9 + 10 + 11 = 30', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 6. TASHQI AYLANANI ISBOTLAYMIZ (`prooflines`). 38-mavzu, 121-bet.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З110',
  eyebrow: L('TASHQI AYLANA MAVJUDLIGINI ISBOTLAYMIZ', 'ДОКАЗЫВАЕМ СУЩЕСТВОВАНИЕ ОПИСАННОЙ', 'PROVING THE CIRCUMSCRIBED CIRCLE EXISTS'),
  title: L(
    "Har qanday uchburchak atrofida aylana chizish mumkin",
    'Вокруг любого треугольника можно описать окружность',
    'A circle can be circumscribed about any triangle',
  ),
  audio: [
    A('mount',
      "AB va BC tomonlarining o'rta perpendikulyarlari O nuqtada kesishadi.",
      'Серединные перпендикуляры сторон AB и BC пересекаются в точке O.',
      'The perpendicular bisectors of sides AB and BC meet at point O.'),
    A('why',
      "O'rta perpendikulyarning har bir nuqtasi tomon uchlaridan teng masofada.",
      'Каждая точка серединного перпендикуляра равноудалена от концов стороны.',
      "Every point of a perpendicular bisector is equidistant from the endpoints of the side."),
  ],
  props: {
    points: TRI_PTS,
    order: TRI_ORDER,
    marks: [['A', 'O'], ['B', 'O'], ['C', 'O']],
    given: [
      L("ABC uchburchak, O — AB va BC ning o'rta perpendikulyarlari kesishgan nuqta", 'Треугольник ABC, O — точка пересечения серединных перпендикуляров AB и BC', 'Triangle ABC, O the intersection point of the perpendicular bisectors of AB and BC'),
    ],
    goal: L("OA = OB = OC", 'OA = OB = OC', 'OA = OB = OC'),
    lines: [
      {
        text: L("O, AB ning o'rta perpendikulyarida bo'lgani uchun, OA = OB", 'так как O на серединном перпендикуляре AB, OA = OB', 'since O is on the perpendicular bisector of AB, OA = OB'),
        options: [
          { id: 'ok', right: true, label: L("O'rta perpendikulyarning har bir nuqtasi kesma uchlaridan teng masofada", 'Каждая точка серединного перпендикуляра равноудалена от концов отрезка', 'Every point of a perpendicular bisector is equidistant from the ends of the segment') },
          { id: 'no', label: L("Bu chizmadan shunday ko'rinadi", 'Так видно на чертеже', 'That is how it looks on the drawing'), hint: L("Ko'rinish sabab emas, bu o'rta perpendikulyarning ma'lum xossasi.", 'Внешний вид не причина, это известное свойство серединного перпендикуляра.', 'Appearance is not the reason, this is a known property of the perpendicular bisector.') },
        ],
      },
      {
        text: L("O, BC ning o'rta perpendikulyarida bo'lgani uchun, OB = OC", 'так как O на серединном перпендикуляре BC, OB = OC', 'since O is on the perpendicular bisector of BC, OB = OC'),
        options: [
          { id: 'ok', right: true, label: L("Xuddi shu xossa, endi BC tomoni uchun", 'То же свойство, теперь для стороны BC', 'The same property, now for side BC') },
          { id: 'no', label: L("Bu birinchi qatordan avtomatik kelib chiqadi", 'Это автоматически следует из первой строки', 'This automatically follows from the first line'), hint: L("Yo'q, bu BC ning o'rta perpendikulyarining alohida xossasi.", 'Нет, это отдельное свойство серединного перпендикуляра BC.', 'No, this is a separate property of the perpendicular bisector of BC.') },
        ],
      },
      {
        text: L("shuning uchun OA = OB = OC, demak O uchburchakning uchala uchidan teng masofada", 'поэтому OA = OB = OC, значит O равноудалена от всех трёх вершин', 'therefore OA = OB = OC, so O is equidistant from all three vertices'),
        options: [
          { id: 'ok', right: true, label: L("Ikkalasi ham OB ga teng, demak OA va OC ham o'zaro teng", 'Обе равны OB, значит OA и OC равны между собой', 'Both equal OB, so OA and OC are equal to each other') },
          { id: 'no', label: L("Bu qo'shimcha faraz", 'Это дополнительное предположение', 'This is an extra assumption'), hint: L("Yo'q, bu ikki oldingi qatordan to'g'ridan-to'g'ri kelib chiqadi.", 'Нет, это прямо следует из двух предыдущих строк.', 'No, this follows directly from the two previous lines.') },
        ],
      },
    ],
    after: L(
      "Isbotlandi. O uchburchakning uchala uchidan teng masofada, shu masofa tashqi chizilgan aylananing radiusi.",
      'Доказано. O равноудалена от всех трёх вершин треугольника, это расстояние и есть радиус описанной окружности.',
      'Proven. O is equidistant from all three vertices of the triangle, that distance is the radius of the circumscribed circle.',
    ),
  },
}

// ============================================================
// EKRAN 7. TO'RTBURCHAKLAR HAQIDA (`parts`): ichki va tashqi chizilgan
// to'rtburchaklarning uch qoidasi.
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З111',
  eyebrow: L("TO'RTBURCHAKLARNING QOIDALARI", 'ПРАВИЛА ДЛЯ ЧЕТЫРЁХУГОЛЬНИКОВ', 'THE RULES FOR QUADRILATERALS'),
  title: L(
    "Ichki va tashqi chizilgan to'rtburchaklarning qoidasi",
    'Правило для вписанных и описанных четырёхугольников',
    'The rule for inscribed and circumscribed quadrilaterals',
  ),
  audio: [
    A('mount',
      "Ichki chizilgan to'rtburchakda burchaklar, tashqi chizilganida tomonlar tekshiriladi.",
      'У вписанного четырёхугольника проверяются углы, а у описанного стороны.',
      'For an inscribed quadrilateral, the angles are checked, for a circumscribed one, the sides.'),
    W('p2',
      "Ichki chizilganda qarama-qarshi burchaklarning YIG'INDISI yuz sakson daraja.",
      'У вписанного сумма противоположных углов сто восемьдесят градусов.',
      'For the inscribed one, the sum of opposite angles is a hundred eighty degrees.'),
    W('p4',
      "Tashqi chizilganda qarama-qarshi tomonlarning YIG'INDISI teng, tomonlarning o'zi emas.",
      'У описанного равны СУММЫ противоположных сторон, а не сами стороны.',
      'For the circumscribed one, the SUMS of opposite sides are equal, not the sides themselves.',
    ),
  ],
  props: {
    tokens: [
      { t: '∠A + ∠C = 180°', id: 'mid' },
      { t: '   |   ', id: 'a' },
      { t: 'AB + CD = BC + AD', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Ichki chizilgan to'rtburchakda qarama-qarshi burchaklar yig'indisi yuz sakson daraja.",
          'У вписанного четырёхугольника сумма противоположных углов сто восемьдесят градусов.',
          'For an inscribed quadrilateral, the sum of opposite angles is a hundred eighty degrees.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Bu ikki turli qoida, bir-biriga aloqasi yo'q, faqat ikkalasi ham qarama-qarshilik haqida.",
          'Это два разных правила, друг с другом не связаны, оба просто про противоположность.',
          'These are two different rules, unrelated to each other, both are just about opposite parts.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Tashqi chizilgan to'rtburchakda esa qarama-qarshi TOMONLARNING yig'indisi teng, tomonlarning o'zi emas.",
          'А у описанного четырёхугольника равны суммы противоположных СТОРОН, а не сами стороны.',
          'For a circumscribed quadrilateral, the sums of opposite SIDES are equal, not the sides themselves.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Ikkinchi qoidaning isboti aynan 50-darsdagi bir nuqtadan chiqqan ikki urinmaning tengligiga tayanadi, har bir uchdan ikkita teng urinma chiqadi.",
        'Доказательство второго правила опирается ровно на равенство двух касательных из одной точки из 50 урока, из каждой вершины выходят две равные касательные.',
        "The proof of the second rule relies exactly on the equality of two tangents from one point from lesson 50, two equal tangents come from each vertex.",
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 37-39-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З110',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Ichki va tashqi chizilgan aylanalar",
    'Вписанная и описанная окружности',
    'The inscribed and circumscribed circles',
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
      { id: 'f1', label: L("ichki chizilgan aylananing markazi bissektrisalar kesishgan nuqta", 'центр вписанной окружности, точка пересечения биссектрис', 'the centre of the inscribed circle, the point where the bisectors meet') },
      { id: 'f2', label: L("tashqi chizilgan aylananing markazi o'rta perpendikulyarlar kesishgan nuqta", 'центр описанной окружности, точка пересечения серединных перпендикуляров', 'the centre of the circumscribed circle, the point where the perpendicular bisectors meet') },
      { id: 'f3', label: L("ichki chizilgan to'rtburchakda burchaklar yig'indisi 180°, tashqi chizilganda tomonlar yig'indilari teng", 'у вписанного четырёхугольника сумма углов 180°, у описанного равны суммы сторон', "for an inscribed quadrilateral the sum of angles is 180°, for a circumscribed one the sums of sides are equal") },
      { id: 'w1', label: L("ichki chizilgan aylananing markazi o'rta perpendikulyarlar kesishgan nuqta", 'центр вписанной окружности, точка пересечения серединных перпендикуляров', 'the centre of the inscribed circle, the point where the perpendicular bisectors meet') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Ichki chizilgan aylananing markazi bissektrisalar orqali, o'rta perpendikulyarlar emas.",
      'Так не складывается. Центр вписанной окружности через биссектрисы, а не серединные перпендикуляры.',
      'That does not fit. The centre of the inscribed circle is through the bisectors, not the perpendicular bisectors.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 4-§, 37-39-mavzu asosida (118-125-bet)",
        'Правило на основе геометрии, § 4, темы 37-39 учебника (стр. 118-125)',
        'The rule is based on geometry, section 4, topics 37-39 of the textbook (pages 118-125)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Bissektrisa va o'rta perpendikulyarni alohida chiziqlar deb bilardik",
        'Мы знали биссектрису и серединный перпендикуляр как отдельные линии',
        'We knew the bisector and the perpendicular bisector as separate lines',
      ),
      right: L(
        "endi ular qaysi markazga olib borishini bilamiz",
        'теперь мы знаем, к какому центру каждая из них ведёт',
        'now we know which centre each of them leads to',
      ),
      winner: 'right',
      note: L(
        "Bissektrisa — ichkariga, o'rta perpendikulyar — tashqariga",
        'Биссектриса — внутрь, серединный перпендикуляр — наружу',
        'The bisector, inward; the perpendicular bisector, outward',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): to'g'ri burchaklida tashqi aylana radiusi.
// ============================================================
const ASK_R = L("Tashqi chizilgan aylana radiusi R qancha?", 'Чему равен радиус описанной окружности R?', 'What is the radius of the circumscribed circle R?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З110',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "To'g'ri burchakli uchburchakda tashqi aylana radiusini hisoblang",
    'Вычисли радиус описанной окружности в прямоугольном треугольнике',
    'Compute the circumscribed radius in a right triangle',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Gipotenuza tashqi chizilgan aylananing diametri, 51-darsdagi Fales natijasidan.",
      'Пять заданий. Гипотенуза это диаметр описанной окружности, по следствию Фалеса из 51 урока.',
      "Five tasks. The hypotenuse is the diameter of the circumscribed circle, by the Thales corollary from lesson 51."),
    A('why',
      "Radius gipotenuzaning yarmi, boshqa hech narsa kerak emas.",
      'Радиус это половина гипотенузы, больше ничего не нужно.',
      'The radius is half the hypotenuse, nothing else is needed.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar faqat gipotenuza ikkiga bo'lingan.",
      'Все пять разобраны. Каждый раз только гипотенуза делилась на два.',
      'All five are done. Each time only the hypotenuse was divided by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'12, 16'}</Row>,
        ok: L("Ha. O'n ikki va o'n oltidan gipotenuza yigirma, yarmi o'n.", 'Да. От двенадцати и шестнадцати гипотенуза двадцать, половина десять.', 'Yes. From twelve and sixteen the hypotenuse is twenty, half is ten.'),
        question: ASK_R,
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '20', hint: L("Bu gipotenuzaning o'zi, yarmi emas.", 'Это сама гипотенуза, а не половина.', 'That is the hypotenuse itself, not half of it.') },
        ],
        solution: ['12² + 16²', '400', '20', '20 : 2', '10'],
      },
      {
        expr: <Row size="big" align="center">{'9, 12'}</Row>,
        ok: L("Ha. To'qqiz va o'n ikkidan gipotenuza o'n besh, yarmi yetti nuqta besh.", 'Да. От девяти и двенадцати гипотенуза пятнадцать, половина семь целых пять.', 'Yes. From nine and twelve the hypotenuse is fifteen, half is seven point five.'),
        question: ASK_R,
        items: [
          { id: 'a', right: true, label: '7,5' },
          { id: 'b', label: '15', hint: L("Bu gipotenuzaning o'zi, yarmi emas.", 'Это сама гипотенуза, а не половина.', 'That is the hypotenuse itself, not half of it.') },
        ],
        solution: ['9² + 12²', '225', '15', '15 : 2', '7,5'],
      },
      {
        expr: <Row size="big" align="center">{'6, 8'}</Row>,
        ok: L("Ha. Olti va sakkizdan gipotenuza o'n, yarmi besh.", 'Да. От шести и восьми гипотенуза десять, половина пять.', 'Yes. From six and eight the hypotenuse is ten, half is five.'),
        question: ASK_R,
        items: [
          { id: 'a', right: true, label: '5' },
          { id: 'b', label: '10', hint: L("Bu gipotenuzaning o'zi, yarmi emas.", 'Это сама гипотенуза, а не половина.', 'That is the hypotenuse itself, not half of it.') },
        ],
        solution: ['6² + 8²', '100', '10', '10 : 2', '5'],
      },
      {
        expr: <Row size="big" align="center">{'8, 15'}</Row>,
        ok: L("Ha. Sakkiz va o'n beshdan gipotenuza o'n yetti, yarmi sakkiz nuqta besh.", 'Да. От восьми и пятнадцати гипотенуза семнадцать, половина восемь целых пять.', 'Yes. From eight and fifteen the hypotenuse is seventeen, half is eight point five.'),
        question: ASK_R,
        items: [
          { id: 'a', right: true, label: '8,5' },
          { id: 'b', label: '17', hint: L("Bu gipotenuzaning o'zi, yarmi emas.", 'Это сама гипотенуза, а не половина.', 'That is the hypotenuse itself, not half of it.') },
        ],
        solution: ['8² + 15²', '289', '17', '17 : 2', '8,5'],
      },
      {
        expr: <Row size="big" align="center">{'7, 24'}</Row>,
        ok: L("Ha. Yetti va yigirma to'rtdan gipotenuza yigirma besh, yarmi o'n ikki nuqta besh.", 'Да. От семи и двадцати четырёх гипотенуза двадцать пять, половина двенадцать целых пять.', 'Yes. From seven and twenty-four the hypotenuse is twenty-five, half is twelve point five.'),
        question: ASK_R,
        items: [
          { id: 'a', right: true, label: '12,5' },
          { id: 'b', label: '25', hint: L("Bu gipotenuzaning o'zi, yarmi emas.", 'Это сама гипотенуза, а не половина.', 'That is the hypotenuse itself, not half of it.') },
        ],
        solution: ['7² + 24²', '625', '25', '25 : 2', '12,5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): to'g'ri burchaklida ichki aylana radiusi.
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З110',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "To'g'ri burchakli uchburchakda ichki aylana radiusini hisoblang",
    'Вычисли радиус вписанной окружности в прямоугольном треугольнике',
    'Compute the inscribed radius in a right triangle',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Ichki radius, ikki katet yig'indisidan gipotenuzani ayirib, ikkiga bo'lish bilan topiladi.",
      'Три задания. Внутренний радиус находится вычитанием гипотенузы из суммы катетов и делением на два.',
      "Three tasks. The inradius is found by subtracting the hypotenuse from the sum of the legs and dividing by two."),
    A('why',
      "Bu safar gipotenuza AYIRILADI, boshqa mashqda esa ikkiga bo'lingan edi.",
      'На этот раз гипотенуза ВЫЧИТАЕТСЯ, а в другом задании она делилась на два.',
      'This time the hypotenuse is SUBTRACTED, in the other task it was divided by two.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar katetlar qo'shilib, gipotenuza ayirilgan, keyin ikkiga bo'lingan.",
      'Все три разобраны. Каждый раз катеты складывались, вычиталась гипотенуза, потом делилось на два.',
      'All three are done. Each time the legs were added, the hypotenuse subtracted, then divided by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3, 4, 5'}</Row>,
        ok: L("Ha. Uch va to'rt qo'shilsa yetti, beshni ayirsak ikki, ikkiga bo'linsa bir.", 'Да. Три и четыре в сумме семь, минус пять два, разделить на два, один.', 'Yes. Three and four add to seven, minus five is two, divided by two is one.'),
        question: L("Ichki chizilgan aylana radiusi r qancha?", 'Чему равен радиус вписанной окружности r?', 'What is the inscribed radius r?'),
        items: [
          { id: 'a', right: true, label: '1' },
          { id: 'b', label: '6', hint: L("Gipotenuza ayirilmagan, faqat katetlar qo'shilgan.", 'Гипотенуза не вычтена, сложены только катеты.', 'The hypotenuse was not subtracted, only the legs were added.') },
        ],
        solution: ['3 + 4', '7', '7 − 5', '2', '2 : 2', '1'],
      },
      {
        expr: <Row size="big" align="center">{'9, 12, 15'}</Row>,
        ok: L("Ha. To'qqiz va o'n ikki qo'shilsa yigirma bir, o'n beshni ayirsak olti, ikkiga bo'linsa uch.", 'Да. Девять и двенадцать в сумме двадцать один, минус пятнадцать шесть, разделить на два, три.', 'Yes. Nine and twelve add to twenty-one, minus fifteen is six, divided by two is three.'),
        question: L("Ichki chizilgan aylana radiusi r qancha?", 'Чему равен радиус вписанной окружности r?', 'What is the inscribed radius r?'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '18', hint: L("Gipotenuza ayirilmagan, faqat katetlar qo'shilgan.", 'Гипотенуза не вычтена, сложены только катеты.', 'The hypotenuse was not subtracted, only the legs were added.') },
        ],
        solution: ['9 + 12', '21', '21 − 15', '6', '6 : 2', '3'],
      },
      {
        expr: <Row size="big" align="center">{'8, 15, 17'}</Row>,
        ok: L("Ha. Sakkiz va o'n besh qo'shilsa yigirma uch, o'n yettini ayirsak olti, ikkiga bo'linsa uch.", 'Да. Восемь и пятнадцать в сумме двадцать три, минус семнадцать шесть, разделить на два, три.', 'Yes. Eight and fifteen add to twenty-three, minus seventeen is six, divided by two is three.'),
        question: L("Ichki chizilgan aylana radiusi r qancha?", 'Чему равен радиус вписанной окружности r?', 'What is the inscribed radius r?'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '23', hint: L("Gipotenuza ayirilmagan, faqat katetlar qo'shilgan.", 'Гипотенуза не вычтена, сложены только катеты.', 'The hypotenuse was not subtracted, only the legs were added.') },
        ],
        solution: ['8 + 15', '23', '23 − 17', '6', '6 : 2', '3'],
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
      "Formuladagi qadamlarni bittalab qaytadan bajaring.",
      'Повтори шаги формулы один за другим.',
      'Redo the steps of the formula one at a time.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash taklif qilingan javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло предложенный ответ.',
      'All three are done. Each time computation checked the proposed answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'AF=4, FC=7, BC=9   →   P=26'}</Row>,
        ok: L("Ha. EC yetti, BE ikki, BD ikki, AD to'rt, AB olti, AC o'n bir, yig'indisi yigirma olti.", 'Да. EC семь, BE два, BD два, AD четыре, AB шесть, AC одиннадцать, сумма двадцать шесть.', 'Yes. EC is seven, BE is two, BD is two, AD is four, AB is six, AC is eleven, the sum is twenty-six.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham yigirma olti chiqadi.", 'Посчитай, ответ действительно выходит двадцать шесть.', 'Compute it, the answer really comes to twenty-six.') },
        ],
        solution: ['9 − 7', '2', '4 + 2', '6', '4 + 7', '11', '6 + 9 + 11', '26'],
      },
      {
        expr: <Row size="big" align="center">{'∠A=65°, ∠C=115°'}</Row>,
        ok: L("Ha. Oltmish besh va yuz o'n beshning yig'indisi yuz sakson, ichki chizilgan to'rtburchak uchun to'g'ri.", 'Да. Сумма шестидесяти пяти и ста пятнадцати сто восемьдесят, для вписанного четырёхугольника верно.', 'Yes. The sum of sixty-five and a hundred fifteen is a hundred eighty, correct for an inscribed quadrilateral.'),
        question: L("A va C qarama-qarshi burchaklar bo'lsa, bu javob to'g'rimi?", 'Если A и C — противоположные углы, верен ли этот ответ?', 'If A and C are opposite angles, is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, oltmish besh va yuz o'n besh qo'shilsa, yuz sakson chiqadi.", 'Посчитай, шестьдесят пять плюс сто пятнадцать даёт сто восемьдесят.', 'Compute it, sixty-five plus a hundred fifteen gives a hundred eighty.') },
        ],
        solution: ['65 + 115', '180'],
      },
      {
        expr: <Row size="big" align="center">{'6, 8   →   R=5'}</Row>,
        ok: L("Ha. Olti va sakkizdan gipotenuza o'n, yarmi besh.", 'Да. От шести и восьми гипотенуза десять, половина пять.', 'Yes. From six and eight the hypotenuse is ten, half is five.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham besh chiqadi.", 'Посчитай, ответ действительно выходит пять.', 'Compute it, the answer really comes to five.') },
        ],
        solution: ['6² + 8²', '100', '10', '10 : 2', '5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): markazlar chalkashtirilishi (З110)
// va tomonlar teng deb olinishi (З111).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З110',
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
      "Birinchisida markazlar chalkashtirilgan, ikkinchisida tomonlar teng deb olingan.",
      'В первом спутаны центры, во втором стороны приняты равными.',
      'In the first, the centres were confused, in the second, the sides were taken as equal.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham boshqa-boshqa qoidani chetlab o'tgan.",
      'Обе разобраны. Обе ошибки обошли разные правила.',
      'Both are done. Each mistake bypassed a different rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'r-markaz ↔ o.p.'}</Row>,
        ok: L("Ha. Ichki chizilgan aylananing markazi bissektrisalar kesishgan nuqta, o'rta perpendikulyarlar tashqi chizilganiga tegishli.", 'Да. Центр вписанной окружности это точка пересечения биссектрис, серединные перпендикуляры относятся к описанной.', 'Yes. The centre of the inscribed circle is where the bisectors meet, perpendicular bisectors belong to the circumscribed one.'),
        question: L("Ichki chizilgan aylananing markazi o'rta perpendikulyarlar kesishgan nuqta deb aytilgan bo'lsa, bu yerda xato qayerda?", 'Если сказано, что центр вписанной окружности это точка пересечения серединных перпендикуляров, в чём здесь ошибка?', "If it was said that the centre of the inscribed circle is where the perpendicular bisectors meet, where is the mistake here?"),
        items: [
          { id: 'a', right: true, label: L("Bissektrisalar o'rniga o'rta perpendikulyarlar yozilgan", 'Вместо биссектрис записаны серединные перпендикуляры', 'Perpendicular bisectors were written instead of bisectors') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, ichki chizilganida bissektrisalar ishlatiladi.", 'Это и есть показанная ошибка, для вписанной используются биссектрисы.', 'This is the very mistake shown; for the inscribed circle, bisectors are used.') },
        ],
        solution: ['bissektrisalar'],
      },
      {
        expr: <Row size="big" align="center">{'AB+CD=BC+AD   →   "AB=BC, CD=AD"'}</Row>,
        ok: L("Ha. Tashqi chizilgan to'rtburchakda qarama-qarshi tomonlarning YIG'INDISI teng, tomonlarning o'zi teng bo'lishi shart emas.", 'Да. У описанного четырёхугольника равны СУММЫ противоположных сторон, сами стороны не обязаны быть равны.', "Yes. For a circumscribed quadrilateral, the SUMS of opposite sides are equal, the sides themselves do not have to be equal."),
        question: L("Yuqoridagi xulosada xato qayerda?", 'В чём ошибка в выводе выше?', 'Where is the mistake in the conclusion above?'),
        items: [
          { id: 'a', right: true, label: L("Yig'indilar tengligidan tomonlarning o'zi teng deb xulosa chiqarilgan", 'Из равенства сумм сделан вывод о равенстве самих сторон', 'From the equality of the sums, the equality of the sides themselves was concluded') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, faqat yig'indilar teng bo'lishi kifoya.", 'Это и есть показанная ошибка, достаточно равенства только сумм.', 'This is the very mistake shown; only the equality of the sums is needed.') },
        ],
        solution: ['AB + CD = BC + AD'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): urinish nuqtalaridan perimetr.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З111',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Urinish nuqtalaridan perimetrni qadamlab toping",
    'Найди периметр по точкам касания, по шагам',
    'Find the perimeter from the points of tangency, step by step',
  ),
  audio: [
    A('mount',
      "Bir tomon ikki qismga bo'lingan, uchinchi tomon berilgan. Har safar teng urinmalar ishlatiladi.",
      'Одна сторона разделена на две части, дана третья сторона. Каждый раз используются равные касательные.',
      'One side is split into two parts, the third side is given. Equal tangents are used each time.'),
    A('why',
      "Uchta tomon topilib, oxirida qo'shiladi.",
      'Находятся три стороны, в конце складываются.',
      'The three sides are found, then added at the end.',
    ),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar uchta tomon topilib, qo'shilgan.",
      'Все три заполнены. Каждый раз находились три стороны, потом складывались.',
      'All three are filled. Each time the three sides were found, then added.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['4', '30'],
      lines: [
        [{ t: 'AF=5, FC=6, BC=10   →   BE=' }, { slot: '4' }, { t: '   →   P=' }, { slot: '30' }],
      ],
    },
    tasks: [
      {
        chips: ['2', '26'],
        lines: [
          [{ t: 'AF=4, FC=7, BC=9   →   BE=' }, { slot: '2' }, { t: '   →   P=' }, { slot: '26' }],
        ],
      },
      {
        chips: ['4', '30'],
        lines: [
          [{ t: 'AF=3, FC=8, BC=12   →   BE=' }, { slot: '4' }, { t: '   →   P=' }, { slot: '30' }],
        ],
      },
      {
        chips: ['3', '24'],
        lines: [
          [{ t: 'AF=4, FC=5, BC=8   →   BE=' }, { slot: '3' }, { t: '   →   P=' }, { slot: '24' }],
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
    "Ichki va tashqi chizilgan aylanalar bo'yicha to'rt savol",
    'Четыре вопроса о вписанной и описанной окружностях',
    'Four questions about the inscribed and circumscribed circles',
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
        id: 'q1', tag: 'З110',
        ask: L('Tashqi chizilgan aylananing markazi qanday topiladi?', 'Как находится центр описанной окружности?', 'How is the centre of the circumscribed circle found?'),
        options: [
          { id: 'ok', right: true, label: L("O'rta perpendikulyarlar kesishgan nuqta", 'Точка пересечения серединных перпендикуляров', 'The point where the perpendicular bisectors meet') },
          { id: 'no', label: L("Bissektrisalar kesishgan nuqta", 'Точка пересечения биссектрис', 'The point where the bisectors meet') },
        ],
        hint: L("Bissektrisalar ichki chizilganiga olib boradi, tashqi chizilganiga emas.", 'Биссектрисы ведут к вписанной, а не к описанной.', 'Bisectors lead to the inscribed one, not the circumscribed one.'),
        ok: L("To'g'ri, o'rta perpendikulyarlar.", 'Верно, серединные перпендикуляры.', 'Correct, the perpendicular bisectors.'),
      },
      {
        id: 'q2', tag: 'З111',
        ask: L('Tashqi chizilgan to\'rtburchakda AB=7, BC=5, CD=9. AD qancha?', 'У описанного четырёхугольника AB=7, BC=5, CD=9. Чему равен AD?', 'For a circumscribed quadrilateral AB=7, BC=5, CD=9. What is AD?'),
        options: [
          { id: 'ok', right: true, label: '11' },
          { id: 'no', label: '9' },
        ],
        hint: L("Qarama-qarshi tomonlar yig'indilari teng, demak o'n olti besh qo'shilgan AD ga teng.", 'Суммы противоположных сторон равны, значит шестнадцать равно пяти плюс AD.', "The sums of opposite sides are equal, so sixteen equals five plus AD."),
        ok: L("To'g'ri, o'n bir, chunki yetti qo'shilgan to'qqiz o'n olti, undan beshni ayirsak o'n bir.", 'Верно, одиннадцать, потому что семь плюс девять шестнадцать, минус пять одиннадцать.', 'Correct, eleven, because seven plus nine is sixteen, minus five is eleven.'),
      },
      {
        id: 'q3', tag: 'З110',
        ask: L('To\'g\'ri burchakli uchburchakning katetlari 5, 12. Tashqi chizilgan aylana radiusi qancha?', 'Катеты прямоугольного треугольника 5, 12. Чему равен радиус описанной окружности?', 'The legs of a right triangle are 5, 12. What is the circumscribed radius?'),
        options: [
          { id: 'ok', right: true, label: '6,5' },
          { id: 'no', label: '13' },
        ],
        hint: L("Gipotenuza o'n uch, radius uning yarmi.", 'Гипотенуза тринадцать, радиус это её половина.', 'The hypotenuse is thirteen, the radius is half of it.'),
        ok: L("To'g'ri, olti nuqta besh.", 'Верно, шесть целых пять.', 'Correct, six point five.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('9 + 12 dan 15 ni ayirsak, 6 chiqadimi?', 'Верно ли, что 9 плюс 12, минус 15, равно 6?', 'Is it true that 9 plus 12, minus 15, equals 6?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, to'qqiz va o'n ikki yigirma bir, undan o'n beshni ayiring.", 'Посчитай, девять и двенадцать двадцать один, вычти пятнадцать.', 'Compute it, nine and twelve is twenty-one, subtract fifteen.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З110',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Katetlari 8 va 6 bo'lgan to'g'ri burchakli uchburchakning ichki va tashqi aylana radiuslarini yig'ing.",
            'Собери радиусы вписанной и описанной окружностей треугольника с катетами 8 и 6.',
            'Assemble the inscribed and circumscribed radii of the triangle with legs 8 and 6.',
          ),
          lines: [
            [{ t: 'r = ' }, { slot: '2' }, { t: ',   R = ' }, { slot: '5' }],
          ],
          tiles: [
            { id: 't1', v: '2', x: 12, y: 12 },
            { id: 't2', v: '5', x: 60, y: 14 },
            { id: 't3', v: '10', x: 30, y: 50 },
            { id: 't4', v: '4', x: 78, y: 48 },
          ],
          hint: L(
            "Gipotenuza o'n. r uchun katetlar yig'indisidan gipotenuzani ayirib ikkiga bo'ling, R uchun gipotenuzani ikkiga bo'ling.",
            'Гипотенуза десять. Для r вычти гипотенузу из суммы катетов и раздели на два, для R раздели гипотенузу на два.',
            'The hypotenuse is ten. For r, subtract the hypotenuse from the sum of the legs and divide by two, for R divide the hypotenuse by two.',
          ),
          doneNote: L(
            "Yig'ildi. Ichki radius ikki, tashqi radius besh chiqdi.",
            'Собрано. Внутренний радиус два, внешний радиус вышел пять.',
            'Assembled. The inscribed radius is two, the circumscribed radius comes out to five.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (`takeaway`). BLOK YAKUNI: aylana qismi tugadi.
// ============================================================
const S15 = {
  role: 'summary',
  tool: 'takeaway',
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Bissektrisa — ichkariga, o'rta perpendikulyar — tashqariga",
    'Биссектриса — внутрь, серединный перпендикуляр — наружу',
    'The bisector, inward; the perpendicular bisector, outward',
  ),
  audio: [
    A('s0',
      "Darsdan bitta uchburchak qoladi, unda ikkita aylana, biri ichida, biri tashqarida.",
      'С урока остаётся один треугольник с двумя окружностями, одна внутри, одна снаружи.',
      'One triangle stays with you, with two circles, one inside, one outside.'),
    A('s1',
      "Bugun uch narsa qilindi. Ikki markazni isbotladingiz, urinmalar bilan perimetr topdingiz va to'rtburchaklar qoidasini bildingiz.",
      'Сегодня сделано три вещи. Ты доказал два центра, нашёл периметр через касательные, и узнал правило для четырёхугольников.',
      'Three things are done today. You proved two centres, found the perimeter through tangents, and learned the rule for quadrilaterals.'),
    A('s2',
      "Aylana qismi shu bilan tugadi. Keyingi darsda vektor tushunchasi boshlanadi.",
      'Часть про окружность этим завершается. В следующем уроке начинается понятие вектора.',
      'The circle part ends here. The next lesson begins the concept of the vector.',
    ),
  ],
  props: {
    mark: L("bissektrisa → ichki markaz; o'rta perpendikulyar → tashqi markaz", 'биссектриса → внутренний центр; серединный перпендикуляр → внешний центр', 'bisector → inner centre; perpendicular bisector → outer centre'),
    markNote: L(
      "katetlar 6, 8 → r=2, R=5",
      'катеты 6, 8 → r=2, R=5',
      'legs 6, 8 → r=2, R=5',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: vektor tushunchasi",
      'Следующий урок: понятие вектора',
      'Next lesson: the concept of the vector',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
