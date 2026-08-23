// ============================================================================
// 8-sinf, Dars 53. VEKTOR TUSHUNCHASI, QO'SHISH VA AYIRISH.
//
// BLOK Б7, VEKTOR QISMI BOSHLANADI (Pifagor 44-47, aylana 48-52 darslarda
// yakunlandi). Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`,
// `vectorfigure.jsx`, `tools.jsx`, `feed.jsx`, `method.jsx` da.
//
// YANGI PRIBOR: `VectorFigure` — VEKTOR QISMINING PILOT DARSI. `GeoFigure`
// tomonda YO'NALISH yo'q edi (AB va BA bir xil "tomon"); vektorda esa
// yo'nalish MUHIM — AB va BA boshqa-boshqa vektor. Shuning uchun alohida
// pribor, o'q bilan chiziladigan, tartibga bog'liq id bilan.
//
// MANBA: 8-sinf geometriya darsligi, 5-§ (VEKTORLAR):
//   - 40-mavzu (129-131-bet), VEKTOR TUSHUNCHASI: skalar kattalik (faqat
//     son), vektor kattalik (son + yo'nalish); vektor — yo'naltirilgan
//     kesma, boshi va uchi bor, AB kabi belgilanadi, moduli |AB| kesmaning
//     uzunligi; TENG vektorlar — uzunligi va yo'nalishi bir xil (joylashuvi
//     AHAMIYATSIZ, "vektorni parallel ko'chirish xossasi");
//   - 41-mavzu (132-135-bet), QO'SHISH VA AYIRISH: uchburchak qoidasi,
//     AB+BC=AC (ixtiyoriy A,B,C uchun o'rinli); parallelogramm qoidasi,
//     bir nuqtadan qo'yilgan ikki vektor yig'indisi umumiy boshdan chiqadigan
//     diagonal; qo'shishning o'rin almashtirish (a+b=b+a) va guruhlash
//     ((a+b)+c=a+(b+c)) qonunlari; qarama-qarshi vektor, a+(−a)=0;
//     ayirma, a−b=a+(−b); bitta O nuqtadan qo'yilgan vektorlar uchun
//     OA−OB=BA (asosiy amaliy qoida);
//   - 514-mashq uslubi: to'g'ri to'rtburchakda AB=3, BC=4 → diagonal AC=5
//     (uchburchak qoidasi + Pifagor teoremasi bir vaqtda ishlaydi, chunki
//     to'g'ri burchakda AB va BC perpendikulyar).
//
// ADASHISHLAR, ikkitasi yangi:
//   З112, teng vektorlar bir xil boshlanish nuqtasida bo'lishi kerak deb
//   o'ylangan, aslida faqat uzunlik va yo'nalish bir xil bo'lishi kifoya;
//   З113, ayirmaning yo'nalishi teskari olingan (OA−OB uchun AB yozilgan,
//   BA o'rniga);
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
  id: 'geo-8-53',
  n: 53,
  row: 58,
  block: 'Б7',
  topic: L("Vektor tushunchasi, qo'shish va ayirish", 'Понятие вектора, сложение и вычитание', 'The concept of the vector, addition and subtraction'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Vektor, yo'nalishga ega kesma; uzunligi va yo'nalishi bir xil bo'lgan vektorlar TENG deyiladi, joylashuvi ahamiyatsiz",
    'Вектор, это отрезок, имеющий направление; векторы с одинаковой длиной и направлением называются РАВНЫМИ, их положение не важно',
    'A vector is a segment with a direction; vectors with equal length and direction are called EQUAL, their position does not matter',
  ),
  L(
    "Vektorlar uchburchak qoidasi bilan qo'shiladi, AB + BC = AC; qarama-qarshi vektor −a, a + (−a) = 0",
    'Векторы складываются по правилу треугольника, AB + BC = AC; противоположный вектор −a, a + (−a) = 0',
    'Vectors are added by the triangle rule, AB + BC = AC; the opposite vector is −a, a + (−a) = 0',
  ),
  L(
    "Bitta nuqtadan chiqqan ikki vektorning ayirmasi, ikkinchisining uchidan birinchisining uchiga qaragan vektor, OA − OB = BA",
    'Разность двух векторов, выходящих из одной точки, это вектор от конца второго к концу первого, OA − OB = BA',
    'The difference of two vectors from the same point is the vector from the end of the second to the end of the first, OA − OB = BA',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З112': {
    what: L(
      "teng vektorlar bir xil boshlanish nuqtasida bo'lishi kerak deb o'ylangan, aslida faqat uzunlik va yo'nalish bir xil bo'lishi kifoya",
      'считалось, что равные векторы обязаны иметь общее начало, а на самом деле достаточно равенства длины и направления',
      'it was thought that equal vectors must share a starting point, but equal length and direction are enough',
    ),
    wrong: null,
    at: 12,
  },
  'З113': {
    what: L(
      "ayirmaning yo'nalishi teskari olingan, OA − OB uchun AB yozilgan, BA o'rniga",
      'направление разности взято обратным, для OA − OB записано AB вместо BA',
      'the direction of the difference was taken backwards, AB was written for OA − OB instead of BA',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: bir xil uzunlik va yo'nalishdagi vektorlar tengmi.
// ============================================================
const SC_ASK = L('VEKTOR TUSHUNCHASI', 'ПОНЯТИЕ ВЕКТОРА', 'THE CONCEPT OF THE VECTOR')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <line x1="140" y1="50" x2="180" y2="50" stroke={T.ink3} strokeWidth="1.6"/>
      <polygon points="180,50 172,46 172,54" fill={T.ink3}/>
      <line x1="150" y1="85" x2="190" y2="85" stroke={T.ink3} strokeWidth="1.6"/>
      <polygon points="190,85 182,81 182,89" fill={T.ink3}/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="200" cy="67" r="10" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.2"/>
        <text x="200" y="71" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "AB + BC = AC, uchburchak qoidasi",
      'AB + BC = AC, правило треугольника',
      'AB + BC = AC, the triangle rule',
    )}>
      <line x1="140" y1="90" x2="185" y2="40" stroke={T.ok} strokeWidth="1.6"/>
      <line x1="185" y1="40" x2="225" y2="90" stroke={T.ok} strokeWidth="1.6"/>
      <line x1="140" y1="90" x2="225" y2="90" stroke={T.ink4} strokeWidth="1.4" strokeDasharray="3,2"/>
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
  eyebrow: L('VEKTOR TUSHUNCHASI', 'ПОНЯТИЕ ВЕКТОРА', 'THE CONCEPT OF THE VECTOR'),
  title: L(
    "Ikki o'qli kesmaning uzunligi bir xil va ular bir tomonga qaragan, ammo boshqa-boshqa joyda turadi. Ular teng deb o'ylaysizmi",
    'У двух отрезков со стрелкой одинаковая длина, они смотрят в одну сторону, но стоят в разных местах. Думаешь, они равны',
    'Two arrow-segments have equal length, point the same way, but stand in different places. Do you think they are equal',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Yo'naltirilgan kesma, ya'ni vektor, uzunlik va yo'nalishdan iborat.",
      'Направленный отрезок, то есть вектор, состоит из длины и направления.',
      'A directed segment, that is a vector, consists of a length and a direction.'),
    A('why',
      "Taxmin qiling, joylashuv teng bo'lish uchun kerakmi.",
      'Предположи, важно ли положение для равенства.',
      'Predict whether position matters for equality.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, joylashuvi boshqa bo'lsa ham, bu ikki vektor teng bo'ladimi?",
      'Как думаешь, будут ли эти два вектора равны, даже если их положение разное?',
      'What do you think, will these two vectors be equal, even with different positions?',
    ),
    items: [
      { id: 'a', show: L('Ha, teng', 'Да, равны', 'Yes, equal') },
      { id: 'b', show: L("Yo'q, boshlanish nuqtasi bir xil bo'lishi kerak", 'Нет, начало должно совпадать', 'No, the starting point must match') },
      { id: 'c', show: L("Faqat bitta to'g'ri chiziqda bo'lsa", 'Только если на одной прямой', 'Only if on the same line') },
      { id: 'd', show: L("Aniqlab bo'lmaydi", 'Нельзя определить', 'It cannot be determined') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Skalar va vektor kattalikni ajratish.
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Skalar va vektor kattalikni ajratish",
    'Различаем скалярную и векторную величину',
    'Telling scalar and vector quantities apart',
  ),
  audio: [
    A('mount',
      "Uzunlik, yuza, og'irlik kabi kattaliklar faqat son bilan aniqlanadi.",
      'Такие величины, как длина, площадь, вес, определяются только числом.',
      'Quantities like length, area, weight are determined only by a number.'),
    A('why',
      "Tezlik va kuch kabi kattaliklarga esa yo'nalish ham kerak.",
      'А таким величинам, как скорость и сила, нужно ещё и направление.',
      'But quantities like velocity and force also need a direction.'),
  ],
  props: {
    ask: L(
      "Faqat son qiymati bilan aniqlanadigan kattalik nima deyiladi?",
      'Как называется величина, определяемая только числовым значением?',
      'What is a quantity determined only by a numeric value called?',
    ),
    items: [
      { id: 'right', show: L('Skalar kattalik', 'Скалярная величина', 'A scalar quantity'), right: true, name: L("faqat son, yo'nalishi yo'q", 'только число, без направления', 'just a number, no direction') },
      {
        id: 'wrong', show: L('Vektor kattalik', 'Векторная величина', 'A vector quantity'),
        hint: L("Vektor kattalikka son bilan birga yo'nalish ham kerak.", 'Векторной величине нужно и число, и направление.', 'A vector quantity needs both a number and a direction.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun aynan yo'nalishi bor kattalik, vektorni o'rganamiz.",
      'Верно. Сегодня изучаем именно величину с направлением, вектор.',
      'Correct. Today we study exactly the quantity with direction, the vector.',
    ),
  },
}

// ============================================================
// EKRAN 3. TENG VEKTORLAR (`pick`). Ловушка, bir xil boshlanish nuqtasi
// talab qilinishi (З112).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З112',
  eyebrow: L('TENG VEKTORLAR', 'РАВНЫЕ ВЕКТОРЫ', 'EQUAL VECTORS'),
  title: L(
    "Ikki vektorning uzunligi va yo'nalishi bir xil, ammo joyi boshqa. Ular tengmi",
    'У двух векторов длина и направление одинаковы, но место разное. Равны ли они',
    'Two vectors have the same length and direction, but different places. Are they equal',
  ),
  audio: [
    A('mount',
      "Vektor tekislikning istalgan nuqtasiga ko'chirilishi mumkin.",
      'Вектор можно перенести в любую точку плоскости.',
      'A vector can be moved to any point of the plane.'),
    A('why',
      "Modulini va yo'nalishini o'zgartirmasdan ko'chirilsa, bu bir xil vektor bo'lib qoladi.",
      'Если перенести без изменения модуля и направления, это остаётся тем же вектором.',
      'If moved without changing the magnitude and direction, it remains the same vector.'),
  ],
  props: {
    ask: L(
      "Uzunligi va yo'nalishi bir xil bo'lgan, ammo joyi boshqa ikki vektor haqida nima deyish mumkin?",
      'Что можно сказать о двух векторах с одинаковой длиной и направлением, но разным местом?',
      'What can be said about two vectors with equal length and direction, but different places?',
    ),
    items: [
      { id: 'right', show: L('Ular teng', 'Они равны', 'They are equal'), right: true, name: L("joylashuv ahamiyatsiz", 'положение не важно', 'position does not matter') },
      {
        id: 'wrong', show: L("Ular teng emas, chunki boshi boshqa nuqtada", 'Они не равны, потому что начало в другой точке', 'They are not equal, because the start is at a different point'),
        hint: L("Vektor uchun faqat uzunlik va yo'nalish muhim, boshlanish nuqtasi emas.", 'Для вектора важны только длина и направление, а не точка начала.', 'For a vector, only length and direction matter, not the starting point.'),
      },
    ],
    after: L(
      "To'g'ri. Vektor tekislikda parallel ko'chirilishi mumkin, u shu bilan o'zgarmaydi.",
      'Верно. Вектор можно параллельно перенести по плоскости, при этом он не меняется.',
      'Correct. A vector can be translated in parallel across the plane, staying unchanged.',
    ),
  },
}

// ============================================================
// EKRAN 4. YIG'INDINI TOPING (`vectorfigure`). PILOT DARS. Ловушка,
// qo'shiluvchining o'zi bosilishi (З113).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'vectorfigure',
  tag: 'З113',
  eyebrow: L("YIG'INDINI TOPING", 'НАЙДИ СУММУ', 'FIND THE SUM'),
  title: L(
    "AB + BC yig'indisini ifodalaydigan vektorni bosing",
    'Нажми на вектор, выражающий сумму AB + BC',
    'Tap the vector that expresses the sum AB + BC',
  ),
  audio: [
    A('mount',
      "A, B, C nuqtalar bor. AB va BC vektorlar uchma-uch qo'yilgan.",
      'Есть точки A, B, C. Векторы AB и BC поставлены друг за другом.',
      'There are points A, B, C. Vectors AB and BC are placed head to tail.'),
    A('why',
      "Uchburchak qoidasiga ko'ra, yig'indi birinchi vektorning boshidan ikkinchisining uchigacha bo'lgan vektor.",
      'По правилу треугольника сумма это вектор от начала первого до конца второго.',
      'By the triangle rule, the sum is the vector from the start of the first to the end of the second.'),
  ],
  props: {
    points: { A: [15, 85], B: [65, 20], C: [95, 85] },
    vectors: [['A', 'B'], ['B', 'C'], ['A', 'C']],
    target: ['A', 'C'],
    ask: L("AB + BC ni bosing", 'Нажми на AB + BC', 'Tap AB + BC'),
    hints: {
      AB: L("Bu qo'shiluvchining o'zi, yig'indi emas.", 'Это само слагаемое, а не сумма.', 'That is the addend itself, not the sum.'),
      BC: L("Bu ham qo'shiluvchining o'zi, yig'indi emas.", 'Это тоже само слагаемое, а не сумма.', 'That is also the addend itself, not the sum.'),
    },
    after: L(
      "To'g'ri. AC, AB ning boshidan BC ning uchigacha boradi, aynan shu yig'indi.",
      'Верно. AC идёт от начала AB до конца BC, это и есть сумма.',
      'Correct. AC goes from the start of AB to the end of BC, this is exactly the sum.',
    ),
  },
}

// ============================================================
// EKRAN 5. IKKI USUL (`twoways`): uchburchak va parallelogramm qoidasi.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З113',
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Uchburchak va parallelogramm qoidasi, bir xil yig'indi",
    'Правило треугольника и параллелограмма, одна сумма',
    'The triangle and parallelogram rules, one sum',
  ),
  audio: [
    A('mount',
      "Uchburchak qoidasida vektorlar uchma-uch qo'yiladi, yig'indi ochilmagan tomon.",
      'В правиле треугольника векторы ставятся друг за другом, сумма это незамкнутая сторона.',
      'In the triangle rule, vectors are placed head to tail, the sum is the open side.'),
    W('w2',
      "Parallelogramm qoidasida ikkalasi bitta nuqtadan chiqadi, yig'indi umumiy diagonal.",
      'В правиле параллелограмма оба выходят из одной точки, сумма это общая диагональ.',
      'In the parallelogram rule, both start from one point, the sum is the shared diagonal.'),
    W('w4',
      "Ikkala usul ham bir xil natija beradi, faqat vektorlarning joylashuvi boshqacha.",
      'Оба способа дают один и тот же результат, только расположение векторов другое.',
      'Both methods give the same result, only the arrangement of the vectors differs.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('UCHBURCHAK QOIDASI', 'ПРАВИЛО ТРЕУГОЛЬНИКА', 'THE TRIANGLE RULE'),
        lead: L(
          "AB va BC uchma-uch qo'yiladi, yig'indi AC",
          'AB и BC ставятся друг за другом, сумма AC',
          'AB and BC are placed head to tail, the sum is AC',
        ),
        rows: [{ text: L("boshidan uchigacha, bitta ochiq tomon", 'от начала до конца, одна незамкнутая сторона', 'from start to end, one open side'), tone: 'ok' }],
      },
      {
        name: L('PARALLELOGRAMM QOIDASI', 'ПРАВИЛО ПАРАЛЛЕЛОГРАММА', 'THE PARALLELOGRAM RULE'),
        lead: L(
          "AB va AD bitta A nuqtadan chiqadi, yig'indi AC diagonal",
          'AB и AD выходят из одной точки A, сумма это диагональ AC',
          'AB and AD start from the same point A, the sum is diagonal AC',
        ),
        rows: [{ text: L("umumiy boshdan chiqadigan diagonal", 'диагональ, выходящая из общего начала', 'the diagonal starting from the shared origin'), tone: 'ok' }],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL', 'ОБА ОДИНАКОВЫ', 'BOTH ARE THE SAME'),
        lead: L(
          "Vektorlar qanday joylashtirilishidan qat'i nazar, yig'indi o'zgarmaydi",
          'Как бы векторы ни были расположены, сумма не меняется',
          'However the vectors are arranged, the sum stays the same',
        ),
        rows: [{ text: L("qo'shish tartibga bog'liq emas", 'сложение не зависит от порядка', 'addition does not depend on the order'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 6. AYIRMANING UCH QISMI (`parts`).
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З113',
  eyebrow: L("AYIRMANING UCH QISMI", 'ТРИ ЧАСТИ РАЗНОСТИ', 'THE THREE PARTS OF THE DIFFERENCE'),
  title: L(
    "Bitta nuqtadan chiqqan ikki vektorning ayirmasi",
    'Разность двух векторов из одной точки',
    'The difference of two vectors from one point',
  ),
  audio: [
    A('mount',
      "OA va OB, bitta O nuqtadan chiqqan ikki vektor.",
      'OA и OB, два вектора из одной точки O.',
      'OA and OB, two vectors from the same point O.'),
    W('p2',
      "Ayirma OB ning uchidan boshlanadi, O nuqtadan emas.",
      'Разность начинается от конца OB, а не от точки O.',
      'The difference starts from the end of OB, not from point O.'),
    W('p4',
      "Ayirma OA ning uchiga tugaydi, ya'ni B dan A ga qaraydi.",
      'Разность заканчивается в конце OA, то есть смотрит от B к A.',
      'The difference ends at the end of OA, that is, it points from B to A.',
    ),
  ],
  props: {
    tokens: [
      { t: 'OA − OB', id: 'mid' },
      { t: '  =  ', id: 'a' },
      { t: 'BA', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Ikkala vektor ham bitta O nuqtadan chiqadi, biri A ga, biri B ga.",
          'Оба вектора выходят из одной точки O, один к A, другой к B.',
          'Both vectors start from the same point O, one to A, one to B.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Ayirma, ikkinchi vektorning UCHIDAN boshlanadi, O nuqtaning o'zidan emas.",
          'Разность начинается от КОНЦА второго вектора, а не от самой точки O.',
          'The difference starts from the END of the second vector, not from point O itself.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ayirma birinchi vektorning uchiga boradi, shuning uchun natija B dan A ga, ya'ni BA.",
          'Разность идёт к концу первого вектора, поэтому результат от B к A, то есть BA.',
          'The difference goes to the end of the first vector, so the result is from B to A, that is BA.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Ayirma qoidasi parallelogramm qoidasi bilan bog'liq, yig'indi bitta diagonal bo'lsa, ayirma xuddi shu parallelogrammning ikkinchi diagonali bo'ladi.",
        'Правило разности связано с правилом параллелограмма, если сумма это одна диагональ, разность это вторая диагональ того же параллелограмма.',
        'The subtraction rule is connected to the parallelogram rule, if the sum is one diagonal, the difference is the other diagonal of the same parallelogram.',
      ),
    },
  },
}

// ============================================================
// EKRAN 7. AYIRMANI TOPING (`vectorfigure`). Ловушка, teskari yo'nalish
// bosilishi (З113).
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'vectorfigure',
  tag: 'З113',
  eyebrow: L('AYIRMANI TOPING', 'НАЙДИ РАЗНОСТЬ', 'FIND THE DIFFERENCE'),
  title: L(
    "OA − OB ayirmasini ifodalaydigan vektorni bosing",
    'Нажми на вектор, выражающий разность OA − OB',
    'Tap the vector that expresses the difference OA − OB',
  ),
  audio: [
    A('mount',
      "O umumiy boshlanish nuqtasi, OA va OB shu nuqtadan chiqadi.",
      'O это общее начало, OA и OB выходят из этой точки.',
      'O is the shared start, OA and OB begin from this point.'),
    A('why',
      "Ayirma OB ning uchi B dan boshlanib, OA ning uchi A ga tugaydi.",
      'Разность начинается от конца OB, точки B, и заканчивается в конце OA, точке A.',
      'The difference starts from the end of OB, point B, and ends at the end of OA, point A.'),
  ],
  props: {
    points: { O: [15, 85], A: [75, 20], B: [95, 85] },
    vectors: [['O', 'A'], ['O', 'B'], ['B', 'A']],
    target: ['B', 'A'],
    ask: L("OA − OB ni bosing", 'Нажми на OA − OB', 'Tap OA − OB'),
    hints: {
      OA: L("Bu qo'shiluvchining o'zi, ayirma emas.", 'Это само слагаемое, а не разность.', 'That is the vector itself, not the difference.'),
      OB: L("Bu ham qo'shiluvchining o'zi, ayirma emas.", 'Это тоже само слагаемое, а не разность.', 'That is also the vector itself, not the difference.'),
    },
    after: L(
      "To'g'ri. BA, OB ning uchidan OA ning uchiga qaraydi, aynan shu ayirma.",
      'Верно. BA смотрит от конца OB к концу OA, это и есть разность.',
      'Correct. BA points from the end of OB to the end of OA, this is exactly the difference.',
    ),
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 40-41-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З112',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Vektor, uning qo'shilishi va ayirilishi",
    'Вектор, его сложение и вычитание',
    'The vector, its addition and subtraction',
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
      { id: 'f1', label: L("teng vektorlarning uzunligi va yo'nalishi bir xil, joylashuvi ahamiyatsiz", 'у равных векторов одинаковы длина и направление, положение не важно', 'equal vectors have the same length and direction, position does not matter') },
      { id: 'f2', label: L("vektorlar uchburchak qoidasi bilan qo'shiladi, AB + BC = AC", 'векторы складываются по правилу треугольника, AB + BC = AC', 'vectors are added by the triangle rule, AB + BC = AC') },
      { id: 'f3', label: L("bitta nuqtadan chiqqan ikki vektorning ayirmasi, ikkinchisining uchidan birinchisining uchiga qaraydi", 'разность двух векторов из одной точки смотрит от конца второго к концу первого', 'the difference of two vectors from one point points from the end of the second to the end of the first') },
      { id: 'w1', label: L("teng vektorlar bir xil boshlanish nuqtasida bo'lishi shart", 'равные векторы обязаны иметь общее начало', 'equal vectors must share a starting point') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Teng vektorlar uchun boshlanish nuqtasi shart emas, faqat uzunlik va yo'nalish.",
      'Так не складывается. Для равных векторов начало не обязательно, важны только длина и направление.',
      'That does not fit. For equal vectors, the starting point is not required, only length and direction matter.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 5-§, 40-41-mavzu asosida (129-135-bet)",
        'Правило на основе геометрии, § 5, темы 40-41 учебника (стр. 129-135)',
        'The rule is based on geometry, section 5, topics 40-41 of the textbook (pages 129-135)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Kesmani faqat uzunlik bilan bilardik",
        'Мы знали отрезок только по длине',
        'We knew a segment only by its length',
      ),
      right: L(
        "endi kesmaning yo'nalishi ham bo'lishini, vektorni bilamiz",
        'теперь мы знаем, что у отрезка может быть направление, вектор',
        'now we know a segment can have a direction, the vector',
      ),
      winner: 'right',
      note: L(
        "Uzunlik va yo'nalish, ikkalasi ham vektor uchun muhim",
        'Длина и направление, оба важны для вектора',
        'Length and direction, both matter for a vector',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): to'g'ri to'rtburchakda AB+BC ning modulini
// topish (Pifagor bilan bog'liq).
// ============================================================
const ASK_SUM = L("AB + BC yig'indisining moduli qancha?", 'Чему равен модуль суммы AB + BC?', 'What is the magnitude of the sum AB + BC?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З113',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "To'g'ri to'rtburchakda vektorlar yig'indisining modulini hisoblang",
    'Вычисли модуль суммы векторов в прямоугольнике',
    'Compute the magnitude of the vector sum in a rectangle',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. ABCD to'g'ri to'rtburchak, AB va BC uning tomonlari.",
      'Пять заданий. ABCD прямоугольник, AB и BC его стороны.',
      'Five tasks. ABCD is a rectangle, AB and BC are its sides.'),
    A('why',
      "AB va BC perpendikulyar, shuning uchun AC ning moduli Pifagor teoremasi bilan topiladi.",
      'AB и BC перпендикулярны, поэтому модуль AC находится по теореме Пифагора.',
      'AB and BC are perpendicular, so the magnitude of AC is found by the Pythagorean theorem.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar uchburchak qoidasi va Pifagor teoremasi birga ishlatilgan.",
      'Все пять разобраны. Каждый раз правило треугольника и теорема Пифагора работали вместе.',
      'All five are done. Each time the triangle rule and the Pythagorean theorem worked together.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'|AB|=3,  |BC|=4'}</Row>,
        ok: L("Ha. Uch va to'rtning kvadratlari yig'indisi yigirma besh, ildizi besh.", 'Да. Сумма квадратов трёх и четырёх двадцать пять, корень пять.', 'Yes. The sum of the squares of three and four is twenty-five, the root is five.'),
        question: ASK_SUM,
        items: [
          { id: 'a', right: true, label: '5' },
          { id: 'b', label: '7', hint: L("Bu uzunliklarning yig'indisi, vektorlar yig'indisining moduli emas.", 'Это сумма длин, а не модуль суммы векторов.', 'That is the sum of the lengths, not the magnitude of the vector sum.') },
        ],
        solution: ['3² + 4²', '25', '5'],
      },
      {
        expr: <Row size="big" align="center">{'|AB|=6,  |BC|=8'}</Row>,
        ok: L("Ha. Olti va sakkizning kvadratlari yig'indisi yuz, ildizi o'n.", 'Да. Сумма квадратов шести и восьми сто, корень десять.', 'Yes. The sum of the squares of six and eight is a hundred, the root is ten.'),
        question: ASK_SUM,
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '14', hint: L("Bu uzunliklarning yig'indisi, vektorlar yig'indisining moduli emas.", 'Это сумма длин, а не модуль суммы векторов.', 'That is the sum of the lengths, not the magnitude of the vector sum.') },
        ],
        solution: ['6² + 8²', '100', '10'],
      },
      {
        expr: <Row size="big" align="center">{'|AB|=5,  |BC|=12'}</Row>,
        ok: L("Ha. Besh va o'n ikkining kvadratlari yig'indisi yuz oltmish to'qqiz, ildizi o'n uch.", 'Да. Сумма квадратов пяти и двенадцати сто шестьдесят девять, корень тринадцать.', 'Yes. The sum of the squares of five and twelve is a hundred sixty-nine, the root is thirteen.'),
        question: ASK_SUM,
        items: [
          { id: 'a', right: true, label: '13' },
          { id: 'b', label: '17', hint: L("Bu uzunliklarning yig'indisi, vektorlar yig'indisining moduli emas.", 'Это сумма длин, а не модуль суммы векторов.', 'That is the sum of the lengths, not the magnitude of the vector sum.') },
        ],
        solution: ['5² + 12²', '169', '13'],
      },
      {
        expr: <Row size="big" align="center">{'|AB|=8,  |BC|=15'}</Row>,
        ok: L("Ha. Sakkiz va o'n beshning kvadratlari yig'indisi ikki yuz sakson to'qqiz, ildizi o'n yetti.", 'Да. Сумма квадратов восьми и пятнадцати двести восемьдесят девять, корень семнадцать.', 'Yes. The sum of the squares of eight and fifteen is two hundred eighty-nine, the root is seventeen.'),
        question: ASK_SUM,
        items: [
          { id: 'a', right: true, label: '17' },
          { id: 'b', label: '23', hint: L("Bu uzunliklarning yig'indisi, vektorlar yig'indisining moduli emas.", 'Это сумма длин, а не модуль суммы векторов.', 'That is the sum of the lengths, not the magnitude of the vector sum.') },
        ],
        solution: ['8² + 15²', '289', '17'],
      },
      {
        expr: <Row size="big" align="center">{'|AB|=7,  |BC|=24'}</Row>,
        ok: L("Ha. Yetti va yigirma to'rtning kvadratlari yig'indisi olti yuz yigirma besh, ildizi yigirma besh.", 'Да. Сумма квадратов семи и двадцати четырёх шестьсот двадцать пять, корень двадцать пять.', 'Yes. The sum of the squares of seven and twenty-four is six hundred twenty-five, the root is twenty-five.'),
        question: ASK_SUM,
        items: [
          { id: 'a', right: true, label: '25' },
          { id: 'b', label: '31', hint: L("Bu uzunliklarning yig'indisi, vektorlar yig'indisining moduli emas.", 'Это сумма длин, а не модуль суммы векторов.', 'That is the sum of the lengths, not the magnitude of the vector sum.') },
        ],
        solution: ['7² + 24²', '625', '25'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): OA va OB perpendikulyar bo'lganda
// ayirmaning modulini topish.
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З113',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Perpendikulyar vektorlar ayirmasining modulini hisoblang",
    'Вычисли модуль разности перпендикулярных векторов',
    'Compute the magnitude of the difference of perpendicular vectors',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. OA va OB perpendikulyar, ikkalasi O nuqtadan chiqadi.",
      'Три задания. OA и OB перпендикулярны, оба выходят из точки O.',
      'Three tasks. OA and OB are perpendicular, both start from point O.'),
    A('why',
      "Ayirma BA, uning moduli ham xuddi shu Pifagor teoremasi bilan topiladi.",
      'Разность BA, её модуль находится той же теоремой Пифагора.',
      'The difference BA, its magnitude is found by the same Pythagorean theorem.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar OA va OB katet, BA gipotenuza bo'lgan.",
      'Все три разобраны. Каждый раз OA и OB были катетами, BA гипотенузой.',
      'All three are done. Each time OA and OB were the legs, BA the hypotenuse.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'|OA|=9,  |OB|=12'}</Row>,
        ok: L("Ha. To'qqiz va o'n ikkining kvadratlari yig'indisi ikki yuz yigirma besh, ildizi o'n besh.", 'Да. Сумма квадратов девяти и двенадцати двести двадцать пять, корень пятнадцать.', 'Yes. The sum of the squares of nine and twelve is two hundred twenty-five, the root is fifteen.'),
        question: L("BA ayirmasining moduli qancha?", 'Чему равен модуль разности BA?', 'What is the magnitude of the difference BA?'),
        items: [
          { id: 'a', right: true, label: '15' },
          { id: 'b', label: '21', hint: L("Bu uzunliklarning yig'indisi, ayirmaning moduli emas.", 'Это сумма длин, а не модуль разности.', 'That is the sum of the lengths, not the magnitude of the difference.') },
        ],
        solution: ['9² + 12²', '225', '15'],
      },
      {
        expr: <Row size="big" align="center">{'|OA|=6,  |OB|=8'}</Row>,
        ok: L("Ha. Olti va sakkizning kvadratlari yig'indisi yuz, ildizi o'n.", 'Да. Сумма квадратов шести и восьми сто, корень десять.', 'Yes. The sum of the squares of six and eight is a hundred, the root is ten.'),
        question: L("BA ayirmasining moduli qancha?", 'Чему равен модуль разности BA?', 'What is the magnitude of the difference BA?'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '14', hint: L("Bu uzunliklarning yig'indisi, ayirmaning moduli emas.", 'Это сумма длин, а не модуль разности.', 'That is the sum of the lengths, not the magnitude of the difference.') },
        ],
        solution: ['6² + 8²', '100', '10'],
      },
      {
        expr: <Row size="big" align="center">{'|OA|=20,  |OB|=21'}</Row>,
        ok: L("Ha. Yigirma va yigirma birning kvadratlari yig'indisi sakkiz yuz qirq bir, ildizi yigirma to'qqiz.", 'Да. Сумма квадратов двадцати и двадцати одного восемьсот сорок один, корень двадцать девять.', 'Yes. The sum of the squares of twenty and twenty-one is eight hundred forty-one, the root is twenty-nine.'),
        question: L("BA ayirmasining moduli qancha?", 'Чему равен модуль разности BA?', 'What is the magnitude of the difference BA?'),
        items: [
          { id: 'a', right: true, label: '29' },
          { id: 'b', label: '41', hint: L("Bu uzunliklarning yig'indisi, ayirmaning moduli emas.", 'Это сумма длин, а не модуль разности.', 'That is the sum of the lengths, not the magnitude of the difference.') },
        ],
        solution: ['20² + 21²', '841', '29'],
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
      "Kvadratlarni qo'shib, ildiz olib tekshiring.",
      'Проверь, сложив квадраты и извлекая корень.',
      'Check by adding the squares and taking the root.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash taklif qilingan javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло предложенный ответ.',
      'All three are done. Each time computation checked the proposed answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'|AB|=9, |BC|=12   →   |AC|=15'}</Row>,
        ok: L("Ha. To'qqiz va o'n ikkining kvadratlari yig'indisi ikki yuz yigirma besh, ildizi o'n besh.", 'Да. Сумма квадратов девяти и двенадцати двести двадцать пять, корень пятнадцать.', 'Yes. The sum of the squares of nine and twelve is two hundred twenty-five, the root is fifteen.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham o'n besh chiqadi.", 'Посчитай, ответ действительно выходит пятнадцать.', 'Compute it, the answer really comes to fifteen.') },
        ],
        solution: ['9² + 12²', '225', '15'],
      },
      {
        expr: <Row size="big" align="center">{'|OA|=8, |OB|=6   →   |BA|=10'}</Row>,
        ok: L("Ha. Sakkiz va oltining kvadratlari yig'indisi yuz, ildizi o'n.", 'Да. Сумма квадратов восьми и шести сто, корень десять.', 'Yes. The sum of the squares of eight and six is a hundred, the root is ten.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham o'n chiqadi.", 'Посчитай, ответ действительно выходит десять.', 'Compute it, the answer really comes to ten.') },
        ],
        solution: ['8² + 6²', '100', '10'],
      },
      {
        expr: <Row size="big" align="center">{'|AB|=5, |BC|=12   →   |AC|=17'}</Row>,
        ok: L("Yo'q. Besh va o'n ikkining kvadratlari yig'indisi yuz oltmish to'qqiz, u o'n uchning kvadratiga teng, o'n yettiga emas.", 'Нет. Сумма квадратов пяти и двенадцати сто шестьдесят девять, это квадрат тринадцати, а не семнадцати.', 'No. The sum of the squares of five and twelve is a hundred sixty-nine, that is the square of thirteen, not seventeen.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, javob o'n uch bo'lishi kerak.", 'Посчитай снова, ответ должен быть тринадцать.', 'Compute it again, the answer should be thirteen.') },
        ],
        solution: ['5² + 12²', '169', '13'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): boshlanish nuqtasi talab
// qilinishi (З112) va ayirma yo'nalishi teskari olinishi (З113).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З112',
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
      "Birinchisida boshlanish nuqtasi shart qilingan, ikkinchisida ayirma yo'nalishi teskari olingan.",
      'В первом потребовано общее начало, во втором направление разности взято обратным.',
      'In the first, a shared starting point was required, in the second, the direction of the difference was taken backwards.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham boshqa-boshqa qoidani chetlab o'tgan.",
      'Обе разобраны. Обе ошибки обошли разные правила.',
      'Both are done. Each mistake bypassed a different rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'|a| = |b| = 5   →   "a ≠ b"'}</Row>,
        ok: L("Ha. Uzunlik va yo'nalish bir xil bo'lgani uchun, bu vektorlar teng, joylashuv ahamiyatsiz.", 'Да. Так как длина и направление одинаковы, эти векторы равны, положение не важно.', 'Yes. Since the length and direction are equal, these vectors are equal, position does not matter.'),
        question: L("Ikki vektorning uzunligi va yo'nalishi bir xil, faqat joyi boshqa bo'lsa, va ular teng emas deb aytilgan bo'lsa, bu yerda xato qayerda?", 'Если у двух векторов длина и направление одинаковы, только место разное, а сказано, что они не равны, в чём здесь ошибка?', 'If two vectors have equal length and direction, only a different place, and it was said they are not equal, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Joylashuv vektorlar tengligiga ta'sir qilmaydi", 'Положение не влияет на равенство векторов', 'Position does not affect the equality of vectors') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, bunday vektorlar teng bo'ladi.", 'Это и есть показанная ошибка, такие векторы равны.', 'This is the very mistake shown; such vectors are equal.') },
        ],
        solution: ['a = b'],
      },
      {
        expr: <Row size="big" align="center">{'OA, OB   →   "OA − OB = AB"'}</Row>,
        ok: L("Ha. OA minus OB, AB emas, BA ga teng, chunki ayirma ikkinchi vektorning uchidan boshlanadi.", 'Да. OA минус OB равно не AB, а BA, потому что разность начинается от конца второго вектора.', 'Yes. OA minus OB equals not AB, but BA, because the difference starts from the end of the second vector.'),
        question: L("OA va OB bitta O nuqtadan chiqsa, va ayirma yuqoridagicha yozilgan bo'lsa, bu yerda xato qayerda?", 'Если OA и OB выходят из одной точки O, а разность записана как выше, в чём здесь ошибка?', 'If OA and OB start from the same point O, and the difference was written as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Yo'nalish teskari olingan, AB o'rniga BA bo'lishi kerak", 'Направление взято обратным, вместо AB должно быть BA', 'The direction was taken backwards, it should be BA instead of AB') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, ayirma BA bo'lishi kerak, AB emas.", 'Это и есть показанная ошибка, разность должна быть BA, а не AB.', 'This is the very mistake shown; the difference should be BA, not AB.') },
        ],
        solution: ['OA − OB = BA'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): to'g'ri to'rtburchakda yig'indi
// moduli.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З113',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Vektorlar yig'indisining modulini qadamlab hisoblang",
    'Вычисли модуль суммы векторов, по шагам',
    'Compute the magnitude of the vector sum, step by step',
  ),
  audio: [
    A('mount',
      "Ikki perpendikulyar vektorning uzunligi berilgan, yig'indining moduli topiladi.",
      'Даны длины двух перпендикулярных векторов, находится модуль суммы.',
      'The lengths of two perpendicular vectors are given, the magnitude of the sum is found.'),
    A('why',
      "Bu qadam har doim bir xil, faqat sonlar o'zgaradi.",
      'Этот шаг всегда одинаков, меняются только числа.',
      'This step is always the same, only the numbers change.',
    ),
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
      chips: ['25', '5'],
      lines: [
        [{ t: '|AB|=3, |BC|=4   →   |AC|² = ' }, { slot: '25' }, { t: '   →   |AC| = ' }, { slot: '5' }],
      ],
    },
    tasks: [
      {
        chips: ['169', '13'],
        lines: [
          [{ t: '|AB|=5, |BC|=12   →   |AC|² = ' }, { slot: '169' }, { t: '   →   |AC| = ' }, { slot: '13' }],
        ],
      },
      {
        chips: ['289', '17'],
        lines: [
          [{ t: '|AB|=8, |BC|=15   →   |AC|² = ' }, { slot: '289' }, { t: '   →   |AC| = ' }, { slot: '17' }],
        ],
      },
      {
        chips: ['625', '25'],
        lines: [
          [{ t: '|AB|=7, |BC|=24   →   |AC|² = ' }, { slot: '625' }, { t: '   →   |AC| = ' }, { slot: '25' }],
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
    "Vektorlar bo'yicha to'rt savol",
    'Четыре вопроса о векторах',
    'Four questions about vectors',
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
        id: 'q1', tag: 'З112',
        ask: L('Ikki vektorning uzunligi va yo\'nalishi bir xil, joyi boshqa. Ular tengmi?', 'У двух векторов длина и направление одинаковы, место разное. Они равны?', 'Two vectors have equal length and direction, different places. Are they equal?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Vektor uchun joylashuv emas, uzunlik va yo'nalish muhim.", 'Для вектора важны не положение, а длина и направление.', 'For a vector, not position but length and direction matter.'),
        ok: L("To'g'ri, ular teng.", 'Верно, они равны.', 'Correct, they are equal.'),
      },
      {
        id: 'q2', tag: 'З113',
        ask: L('OA va OB bitta O nuqtadan chiqadi. OA − OB nimaga teng?', 'OA и OB выходят из одной точки O. Чему равно OA − OB?', 'OA and OB start from the same point O. What does OA − OB equal?'),
        options: [
          { id: 'ok', right: true, label: 'BA' },
          { id: 'no', label: 'AB' },
        ],
        hint: L("Ayirma ikkinchi vektorning uchidan boshlanadi.", 'Разность начинается от конца второго вектора.', 'The difference starts from the end of the second vector.'),
        ok: L("To'g'ri, BA.", 'Верно, BA.', 'Correct, BA.'),
      },
      {
        id: 'q3', tag: 'З113',
        ask: L('To\'g\'ri to\'rtburchakda |AB|=6, |BC|=8. |AC| qancha?', 'В прямоугольнике |AB|=6, |BC|=8. Чему равен |AC|?', 'In a rectangle |AB|=6, |BC|=8. What is |AC|?'),
        options: [
          { id: 'ok', right: true, label: '10' },
          { id: 'no', label: '14' },
        ],
        hint: L("Uzunliklar qo'shilmaydi, kvadratlari qo'shilib, ildiz olinadi.", 'Длины не складываются, складываются их квадраты, извлекается корень.', 'Lengths are not added, their squares are added, then the root is taken.'),
        ok: L("To'g'ri, o'n.", 'Верно, десять.', 'Correct, ten.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('9² + 12² ni hisoblasak, 225 chiqadimi?', 'Верно ли, что 9² + 12², равно 225?', 'Is it true that 9² + 12² equals 225?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, sakson bir va yuz qirq to'rt qo'shiladi.", 'Посчитай, складываются восемьдесят один и сто сорок четыре.', 'Compute it, eighty-one and a hundred forty-four are added.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З113',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "To'g'ri to'rtburchakda |AB|=20, |BC|=21 bo'lsa, |AC| ni yig'ing.",
            'Собери |AC|, если в прямоугольнике |AB|=20, |BC|=21.',
            'Assemble |AC|, if in a rectangle |AB|=20, |BC|=21.',
          ),
          lines: [
            [{ t: '|AC|² = ' }, { slot: '841' }, { t: '   →   |AC| = ' }, { slot: '29' }],
          ],
          tiles: [
            { id: 't1', v: '841', x: 12, y: 12 },
            { id: 't2', v: '29', x: 60, y: 14 },
            { id: 't3', v: '41', x: 30, y: 50 },
            { id: 't4', v: '400', x: 78, y: 48 },
          ],
          hint: L(
            "Yigirma va yigirma birning kvadratlarini qo'shing, keyin ildiz oling.",
            'Сложи квадраты двадцати и двадцати одного, потом извлеки корень.',
            'Add the squares of twenty and twenty-one, then take the root.',
          ),
          doneNote: L(
            "Yig'ildi. |AC|² sakkiz yuz qirq bir, |AC| esa yigirma to'qqiz chiqdi.",
            'Собрано. |AC|² восемьсот сорок один, а |AC| вышло двадцать девять.',
            'Assembled. |AC|² is eight hundred forty-one, and |AC| comes out to twenty-nine.',
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
    "Uzunlik va yo'nalish, joylashuv ahamiyatsiz",
    'Длина и направление, положение не важно',
    'Length and direction, position does not matter',
  ),
  audio: [
    A('s0',
      "Darsdan bitta uchburchak qoladi. AB va BC uchma-uch, yig'indi AC.",
      'С урока остаётся один треугольник. AB и BC друг за другом, сумма AC.',
      'One triangle stays with you. AB and BC head to tail, the sum is AC.'),
    A('s1',
      "Bugun uch narsa qilindi. Teng vektorlarni ajratdingiz, uchburchak qoidasi bilan qo'shdingiz va bitta nuqtadan ayirdingiz.",
      'Сегодня сделано три вещи. Ты отличил равные векторы, сложил по правилу треугольника, и вычел из одной точки.',
      'Three things are done today. You told equal vectors apart, added by the triangle rule, and subtracted from one point.'),
    A('s2',
      "Keyingi darsda vektorni songa ko'paytirish va bu bilimlarning masalalarga qo'llanilishi.",
      'В следующем уроке умножение вектора на число и применение этих знаний в задачах.',
      'The next lesson covers multiplying a vector by a number and applying this knowledge to problems.',
    ),
  ],
  props: {
    mark: 'AB + BC = AC,   OA − OB = BA',
    markNote: L(
      "|AB|=3, |BC|=4 → |AC|=5",
      '|AB|=3, |BC|=4 → |AC|=5',
      '|AB|=3, |BC|=4 → |AC|=5',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: vektorni songa ko'paytirish",
      'Следующий урок: умножение вектора на число',
      'Next lesson: multiplying a vector by a number',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
