// ============================================================================
// 8-sinf, Dars 54. VEKTORNI SONGA KO'PAYTIRISH, MASALALARGA TATBIG'I.
//
// BLOK Б7, VEKTOR QISMI DAVOM ETADI (53-darsda qo'shish va ayirish o'tildi).
// Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`, `vectorfigure.jsx`,
// `tools.jsx`, `feed.jsx`, `method.jsx` da. YANGI PRIBOR YO'Q — `VectorFigure`
// (dars 53) qayta ishlatilgan.
//
// MANBA: 8-sinf geometriya darsligi, 5-§ (VEKTORLAR):
//   - 42-mavzu (136-138-bet), VEKTORNI SONGA KO'PAYTIRISH: k·a vektorining
//     moduli |k|·|a| ga teng; k musbat bo'lsa yo'nalishi a bilan bir xil,
//     k manfiy bo'lsa teskari; nol vektorning har qanday songa ko'paytmasi
//     va har qanday vektorning nolga ko'paytmasi nol vektor. a va k·a har
//     doim kollinear. To'rt xossa: (kl)a=k(la); (k+l)a=ka+la; k(a+b)=ka+kb;
//     k·0=0·a=0. Birlik vektor teoremasi, e=a:|a|, demak a=|a|·e. 532-mashq,
//     1·a=a va (−1)·a=−a isbotlari (modul va yo'nalish orqali);
//   - 43-mavzu (139-140-bet), MASALALARGA TATBIG'I: 1-masala, C — AB
//     kesmasining o'rtasi, ixtiyoriy O uchun OC=½(OA+OB) (ikki usul:
//     uchburchak qoidasi bilan qo'shish, va parallelogrammga to'ldirish);
//     uchburchak o'rta chizig'i haqidagi teorema, vektor usulida isbotlanadi
//     (EF=AF−AE=½AC−½AB=½BC, demak EF parallel BC ga va EF=½BC teng); uch
//     bosqichli vektor usuli (shart yozilgan holga keltiriladi, vektor
//     algebrasi bilan o'zgartiriladi, natija talqin qilinadi);
//   - 538-, 542-mashq uslubi: kesma ma'lum nisbatda bo'linganda vektorlar
//     orqali ifodalash, va parallellik+uzunlik nisbatini vektor usulida
//     isbotlash.
//
// ADASHISHLAR, ikkitasi yangi:
//   З114, k manfiy bo'lganda natija vektorining yo'nalishi teskarilanishi
//   unutilgan (masalan, (−2)·a⃗ a⃗ bilan bir xil tomonga chizilgan);
//   З115, o'rtaga tortilgan vektor formulasida yarim koeffitsiyent
//   unutilgan, OC⃗=OA⃗+OB⃗ deb olingan, ½ qo'yilmagan;
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
  id: 'geo-8-54',
  n: 54,
  row: 59,
  block: 'Б7',
  topic: L("Vektorni songa ko'paytirish, masalalarga tatbig'i", 'Умножение вектора на число, применение к задачам', 'Multiplying a vector by a number, applications to problems'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "k·a⃗ vektorining moduli |k|·|a⃗| ga teng; k musbat bo'lsa yo'nalishi a⃗ bilan bir xil, k manfiy bo'lsa teskari",
    'Модуль вектора k·a⃗ равен |k|·|a⃗|; при положительном k направление совпадает с a⃗, при отрицательном, противоположно',
    'The magnitude of k·a⃗ equals |k|·|a⃗|; for positive k the direction matches a⃗, for negative k it is opposite',
  ),
  L(
    "a⃗ va k·a⃗ har doim kollinear; (kl)a⃗ = k(la⃗), (k+l)a⃗ = ka⃗+la⃗, k(a⃗+b⃗) = ka⃗+kb⃗",
    'a⃗ и k·a⃗ всегда коллинеарны; (kl)a⃗ = k(la⃗), (k+l)a⃗ = ka⃗+la⃗, k(a⃗+b⃗) = ka⃗+kb⃗',
    'a⃗ and k·a⃗ are always collinear; (kl)a⃗ = k(la⃗), (k+l)a⃗ = ka⃗+la⃗, k(a⃗+b⃗) = ka⃗+kb⃗',
  ),
  L(
    "C, AB kesmasining o'rtasi bo'lsa, ixtiyoriy O nuqta uchun OC⃗ = ½(OA⃗+OB⃗); uchburchak o'rta chizig'i uchinchi tomonning yarmiga teng va unga parallel",
    'Если C, середина отрезка AB, то для любой точки O верно OC⃗ = ½(OA⃗+OB⃗); средняя линия треугольника равна половине третьей стороны и параллельна ей',
    'If C is the midpoint of segment AB, then for any point O, OC⃗ = ½(OA⃗+OB⃗); a midline of a triangle equals half the third side and is parallel to it',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З114': {
    what: L(
      "k manfiy bo'lganda natija vektorining yo'nalishi teskarilanishi unutilgan",
      'при отрицательном k направление вектора-результата забывали развернуть в противоположную сторону',
      'when k is negative, it was forgotten that the resulting vector must reverse direction',
    ),
    wrong: null,
    at: 12,
  },
  'З115': {
    what: L(
      "o'rtaga tortilgan vektor formulasida yarim koeffitsiyent unutilgan, OC⃗=OA⃗+OB⃗ deb olingan",
      'в формуле для вектора к середине забыли коэффициент половина, взяли OC⃗=OA⃗+OB⃗',
      'in the midpoint-vector formula the coefficient of a half was forgotten, OC⃗=OA⃗+OB⃗ was taken instead',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: manfiy songa ko'paytirilganda nima o'zgaradi.
// ============================================================
const SC_ASK = L("VEKTORNI SONGA KO'PAYTIRISH", 'УМНОЖЕНИЕ ВЕКТОРА НА ЧИСЛО', 'MULTIPLYING A VECTOR BY A NUMBER')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <line x1="140" y1="70" x2="185" y2="70" stroke={T.ink3} strokeWidth="1.6"/>
      <polygon points="185,70 177,66 177,74" fill={T.ink3}/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="200" cy="50" r="10" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.2"/>
        <text x="200" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "k musbat, bir xil tomon; k manfiy, teskari tomon",
      'k положительное, та же сторона; k отрицательное, противоположная',
      'k positive, the same side; k negative, the opposite side',
    )}>
      <line x1="140" y1="70" x2="175" y2="70" stroke={T.ok} strokeWidth="1.6"/>
      <polygon points="175,70 168,66 168,74" fill={T.ok}/>
      <line x1="230" y1="70" x2="195" y2="70" stroke={T.ok} strokeWidth="1.6"/>
      <polygon points="195,70 202,66 202,74" fill={T.ok}/>
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
  eyebrow: L("VEKTORNI SONGA KO'PAYTIRISH", 'УМНОЖЕНИЕ ВЕКТОРА НА ЧИСЛО', 'MULTIPLYING A VECTOR BY A NUMBER'),
  title: L(
    "Vektor a⃗ ni minus ikkiga ko'paytirsak, natija qanday bo'ladi deb o'ylaysiz",
    'Как думаешь, что получится, если вектор a⃗ умножить на минус два',
    'What do you think happens if vector a⃗ is multiplied by minus two',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "53-darsda vektorlarni qo'shdik va ayirdik. Bugun vektorni songa ko'paytiramiz.",
      'На уроке 53 мы складывали и вычитали векторы. Сегодня умножаем вектор на число.',
      'In lesson 53 we added and subtracted vectors. Today we multiply a vector by a number.'),
    A('why',
      "Taxmin qiling, manfiy songa ko'paytirilganda uzunlik va yo'nalish qanday o'zgaradi.",
      'Предположи, как меняются длина и направление при умножении на отрицательное число.',
      'Predict how the length and direction change when multiplied by a negative number.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, a⃗ ni minus ikkiga ko'paytirsak, natija qanday bo'ladi?",
      'Как думаешь, что получится, если a⃗ умножить на минус два?',
      'What do you think, what happens if a⃗ is multiplied by minus two?',
    ),
    items: [
      { id: 'a', show: L("Ikki marta uzun, bir xil tomonga", 'В два раза длиннее, в ту же сторону', 'Twice as long, the same way') },
      { id: 'b', show: L("Ikki marta uzun, teskari tomonga", 'В два раза длиннее, в противоположную сторону', 'Twice as long, the opposite way') },
      { id: 'c', show: L("Ikki marta qisqa, bir xil tomonga", 'В два раза короче, в ту же сторону', 'Twice as short, the same way') },
      { id: 'd', show: L("Uzunlik o'zgarmaydi", 'Длина не меняется', 'The length does not change') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Qarama-qarshi vektorni eslash (53-darsdan).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Qarama-qarshi vektorni eslash",
    'Вспоминаем противоположный вектор',
    'Recalling the opposite vector',
  ),
  audio: [
    A('mount',
      "53-darsda qarama-qarshi vektor −a⃗ bor edi.",
      'На уроке 53 был противоположный вектор −a⃗.',
      'In lesson 53 there was the opposite vector −a⃗.'),
    A('why',
      "Uning uzunligi a⃗ bilan bir xil, yo'nalishi esa teskari edi.",
      'Его длина была такой же, как у a⃗, а направление противоположным.',
      'Its length was the same as a⃗, but its direction was opposite.'),
  ],
  props: {
    ask: L(
      "Qarama-qarshi vektor −a⃗ ning uzunligi va yo'nalishi a⃗ ga nisbatan qanday edi?",
      'Какими были длина и направление противоположного вектора −a⃗ по отношению к a⃗?',
      'What were the length and direction of the opposite vector −a⃗ relative to a⃗?',
    ),
    items: [
      { id: 'right', show: L("Uzunligi bir xil, yo'nalishi teskari", 'Длина такая же, направление противоположное', 'The length is the same, the direction is opposite'), right: true, name: L("qarama-qarshi vektorning ta'rifi", 'определение противоположного вектора', "the definition of the opposite vector") },
      {
        id: 'wrong', show: L("Uzunligi ham, yo'nalishi ham boshqa", 'И длина, и направление другие', 'Both the length and the direction differ'),
        hint: L("Uzunlik o'zgarmaydi, faqat yo'nalish teskarilanadi.", 'Длина не меняется, меняется только направление.', 'The length does not change, only the direction reverses.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun aynan shu g'oyani, istalgan songa ko'paytirish uchun kengaytiramiz.",
      'Верно. Сегодня именно эту идею мы расширяем на умножение на любое число.',
      "Correct. Today we extend exactly this idea to multiplying by any number.",
    ),
  },
}

// ============================================================
// EKRAN 3. TA'RIF (`pick`). Ловушка, manfiy k da yo'nalish
// teskarilanmasligi (З114).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З114',
  eyebrow: L("TA'RIF", 'ОПРЕДЕЛЕНИЕ', 'THE DEFINITION'),
  title: L(
    "a⃗ ning uzunligi 2 sm. Uni minus uchga ko'paytirsak, natija qanday bo'ladi",
    'Длина a⃗ равна 2 см. Что получится, если умножить его на минус три',
    'The length of a⃗ is 2 cm. What happens if it is multiplied by minus three',
  ),
  audio: [
    A('mount',
      "k·a⃗ ning moduli |k| ko'paytirilgan |a⃗| ga teng, ishoraga qaralmaydi.",
      'Модуль k·a⃗ равен |k|, умноженному на |a⃗|, знак не учитывается.',
      "The magnitude of k·a⃗ equals |k| times |a⃗|, the sign is not considered."),
    A('why',
      "Yo'nalish esa ishoraga bog'liq, k manfiy bo'lsa teskari bo'ladi.",
      'А направление зависит от знака, при отрицательном k оно противоположное.',
      'But the direction depends on the sign, for negative k it is opposite.'),
  ],
  props: {
    ask: L(
      "a⃗ uzunligi 2 sm bo'lsa, (−3)·a⃗ ning uzunligi va yo'nalishi qanday bo'ladi?",
      'Если длина a⃗ равна 2 см, какими будут длина и направление (−3)·a⃗?',
      'If the length of a⃗ is 2 cm, what will be the length and direction of (−3)·a⃗?',
    ),
    items: [
      { id: 'right', show: L("Uzunligi 6 sm, yo'nalishi teskari", 'Длина 6 см, направление противоположное', 'The length is 6 cm, the direction is opposite'), right: true, name: L("modul |−3|=3, ishora manfiy", 'модуль |−3|=3, знак отрицательный', 'magnitude |−3|=3, the sign is negative') },
      {
        id: 'wrong', show: L("Uzunligi 6 sm, yo'nalishi bir xil", 'Длина 6 см, направление такое же', 'The length is 6 cm, the same direction'),
        hint: L("Uzunlik to'g'ri, ammo k manfiy bo'lgani uchun yo'nalish teskarilanadi.", 'Длина верна, но при отрицательном k направление разворачивается.', 'The length is correct, but since k is negative, the direction reverses.'),
      },
    ],
    after: L(
      "To'g'ri. Uzunlik ikkiga bog'liq emas, songning o'zi manfiy, shuning uchun yo'nalish teskarilanadi.",
      'Верно. Длина не зависит от знака, а само число отрицательно, поэтому направление разворачивается.',
      'Correct. The length does not depend on the sign, but the number itself is negative, so the direction reverses.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI VEKTOR (`vectorfigure`). Ловушка, yo'nalish
// teskarilanmasligi (З114).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'vectorfigure',
  tag: 'З114',
  eyebrow: L('QAYSI VEKTOR', 'КАКОЙ ВЕКТОР', 'WHICH VECTOR'),
  title: L(
    "(−2)·a⃗ ni ifodalaydigan vektorni bosing",
    'Нажми на вектор, выражающий (−2)·a⃗',
    'Tap the vector that expresses (−2)·a⃗',
  ),
  audio: [
    A('mount',
      "a⃗ berilgan. Ikki nomzod bor, ikkalasi ham ikki marta uzun.",
      'Дан a⃗. Есть два кандидата, оба в два раза длиннее.',
      'a⃗ is given. There are two candidates, both twice as long.'),
    A('why',
      "Faqat biri teskari tomonga qaraydi, aynan shuni izlaymiz.",
      'Только один из них смотрит в противоположную сторону, именно его мы ищем.',
      'Only one of them points the opposite way, and that is the one we are looking for.'),
  ],
  props: {
    points: { O: [10, 80], P: [40, 80], Q: [60, 20], R: [100, 20], U: [100, 95], V: [40, 95] },
    vectors: [['O', 'P'], ['Q', 'R'], ['U', 'V']],
    target: ['U', 'V'],
    ask: L("(−2)·a⃗ ni bosing", 'Нажми на (−2)·a⃗', 'Tap (−2)·a⃗'),
    hints: {
      OP: L("Bu berilgan a⃗ ning o'zi, ko'paytirilgan natija emas.", 'Это сам данный a⃗, а не результат умножения.', 'That is the given a⃗ itself, not the result of multiplication.'),
      QR: L("Uzunlik to'g'ri, ammo yo'nalish teskarilanmagan. Manfiy songa ko'paytirilganda yo'nalish teskari bo'lishi kerak.", 'Длина верна, но направление не развёрнуто. При умножении на отрицательное число направление должно стать противоположным.', 'The length is correct, but the direction was not reversed. Multiplying by a negative number should reverse the direction.'),
    },
    after: L(
      "To'g'ri. Uzunlik ikki marta oshgan, va yo'nalish teskari, chunki songning o'zi manfiy.",
      'Верно. Длина увеличена в два раза, и направление противоположное, потому что само число отрицательно.',
      'Correct. The length is doubled, and the direction is opposite, because the number itself is negative.',
    ),
  },
}

// ============================================================
// EKRAN 5. IKKI QOIDA (`twoways`): guruhlash va taqsimot qonuni.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З115',
  eyebrow: L('IKKI QOIDA', 'ДВА ПРАВИЛА', 'TWO RULES'),
  title: L(
    "Guruhlash va taqsimot qonunlari, sonlar bilan",
    'Правило группировки и распределения, с числами',
    'The grouping and distributive rules, with numbers',
  ),
  audio: [
    A('mount',
      "Birinchi qonunda ikki son ketma-ket ko'paytiriladi.",
      'В первом правиле два числа умножаются последовательно.',
      'In the first rule, two numbers are multiplied one after another.'),
    W('w2',
      "Ikkinchi qonunda bitta son qavs ichidagi ikki vektorga tarqatiladi.",
      'В втором правиле одно число распределяется на два вектора в скобках.',
      'In the second rule, one number is distributed over two vectors in brackets.'),
    W('w4',
      "Ikkalasida ham natija bir xil, faqat amal tartibi boshqacha.",
      'В обоих случаях результат один и тот же, только порядок действий разный.',
      'In both cases the result is the same, only the order of operations differs.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('GURUHLASH QONUNI', 'ПРАВИЛО ГРУППИРОВКИ', 'THE GROUPING RULE'),
        lead: L(
          "Ikki son ketma-ket vektorga ko'paytiriladi",
          'Два числа последовательно умножаются на вектор',
          'Two numbers are multiplied onto the vector one after another',
        ),
        rows: [{ text: '2·(3a⃗) = 6a⃗', tone: 'ok' }],
      },
      {
        name: L('TAQSIMOT QONUNI', 'ПРАВИЛО РАСПРЕДЕЛЕНИЯ', 'THE DISTRIBUTIVE RULE'),
        lead: L(
          "Bitta son qavs ichidagi ikki vektorga tarqatiladi",
          'Одно число распределяется на два вектора в скобках',
          'One number is distributed over two vectors in brackets',
        ),
        rows: [{ text: '3(a⃗+b⃗) = 3a⃗+3b⃗', tone: 'ok' }],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM AMAL TARTIBINI O\'ZGARTIRADI', 'ОБА МЕНЯЮТ ПОРЯДОК ДЕЙСТВИЙ', 'BOTH CHANGE THE ORDER OF OPERATIONS'),
        lead: L(
          "Natija o'zgarmaydi, faqat qavs ochilishi yoki yopilishi mumkin",
          'Результат не меняется, только скобки можно раскрыть или собрать',
          'The result stays the same, only the brackets can be opened or closed',
        ),
        rows: [{ text: L("songlar algebrasidagi qoidalar vektorlar uchun ham o'rinli", 'правила из алгебры чисел работают и для векторов', 'the rules from number algebra also hold for vectors'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 6. UCH QISM (`parts`): birlik vektor teoremasi.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З115',
  eyebrow: L('UCH QISM', 'ТРИ ЧАСТИ', 'THREE PARTS'),
  title: L(
    "Har qanday vektor, moduli va birlik vektor orqali",
    'Любой вектор через его модуль и единичный вектор',
    'Any vector through its magnitude and unit vector',
  ),
  audio: [
    A('mount',
      "Har qanday vektor ikki qismga ajratiladi.",
      'Любой вектор разбивается на две части.',
      'Any vector splits into two parts.'),
    W('p2',
      "Birinchi qism, uning uzunligi, bu oddiy son.",
      'Первая часть, его длина, это просто число.',
      'The first part, its length, is just a number.'),
    W('p4',
      "Ikkinchi qism, aynan shu tomonga qaragan, uzunligi bitta bo'lgan vektor.",
      'Вторая часть, вектор, смотрящий в ту же сторону, с длиной один.',
      'The second part, a vector pointing the same way, with length one.',
    ),
  ],
  props: {
    tokens: [
      { t: 'a⃗', id: 'mid' },
      { t: ' = |a⃗| · ', id: 'a' },
      { t: 'e⃗', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Chap tomonda berilgan vektorning o'zi turadi.",
          'Слева стоит сам данный вектор.',
          'On the left stands the given vector itself.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "O'ng tomonda uning uzunligi, oddiy son sifatida.",
          'Справа его длина, как обычное число.',
          'On the right, its length, as an ordinary number.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Keyin, a⃗ bilan bir xil tomonga qaragan, uzunligi bitta vektor.",
          'Потом вектор с длиной один, смотрящий в ту же сторону, что и a⃗.',
          'Then a vector of length one, pointing the same way as a⃗.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "e⃗ ning uzunligi har doim bitta, garchi a⃗ juda uzun yoki juda qisqa bo'lsa ham, chunki e⃗ = a⃗ ni o'zining uzunligiga bo'lish natijasi.",
        'Длина e⃗ всегда равна одному, даже если a⃗ очень длинный или очень короткий, потому что e⃗, это результат деления a⃗ на его собственную длину.',
        "The length of e⃗ is always one, even if a⃗ is very long or very short, because e⃗ is the result of dividing a⃗ by its own length.",
      ),
    },
  },
}

// ============================================================
// EKRAN 7. QAYSI VEKTOR (`vectorfigure`). Ловушка, teskari
// yo'nalish tanlanishi (З114).
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'vectorfigure',
  tag: 'З114',
  eyebrow: L('QAYSI VEKTOR', 'КАКОЙ ВЕКТОР', 'WHICH VECTOR'),
  title: L(
    "a⃗ bilan bir xil yo'nalishdagi qisqa vektorni bosing",
    'Нажми на короткий вектор, направленный так же, как a⃗',
    'Tap the short vector that points the same way as a⃗',
  ),
  audio: [
    A('mount',
      "a⃗ uzun vektor. Ikki qisqa nomzod bor.",
      'a⃗, это длинный вектор. Есть два коротких кандидата.',
      'a⃗ is a long vector. There are two short candidates.'),
    A('why',
      "Birlik vektor uchun uzunlik muhim emas, faqat yo'nalish bir xil bo'lishi kerak.",
      'Для единичного вектора длина не важна, важно только совпадение направления.',
      "For the unit vector, the length does not matter, only matching direction does."),
  ],
  props: {
    points: { O: [10, 20], A: [95, 20], C: [10, 55], D: [35, 55], E: [35, 85], F: [10, 85] },
    vectors: [['O', 'A'], ['C', 'D'], ['E', 'F']],
    target: ['C', 'D'],
    ask: L("Bir xil yo'nalishdagi vektorni bosing", 'Нажми на вектор с тем же направлением', 'Tap the vector with the same direction'),
    hints: {
      OA: L("Bu berilgan a⃗ ning o'zi, undan qisqaroq nomzod izlanadi.", 'Это сам данный a⃗, ищется кандидат короче него.', 'That is the given a⃗ itself, a shorter candidate is being sought.'),
      EF: L("Bu teskari tomonga qaraydi, a⃗ bilan bir xil yo'nalishda emas.", 'Он смотрит в противоположную сторону, а не в ту же, что a⃗.', 'That points the opposite way, not the same way as a⃗.'),
    },
    after: L(
      "To'g'ri. Uzunligi boshqa, ammo yo'nalishi a⃗ bilan bir xil, aynan shu kerak edi.",
      'Верно. Длина другая, но направление совпадает с a⃗, именно это и требовалось.',
      'Correct. The length differs, but the direction matches a⃗, which is exactly what was needed.',
    ),
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 42-43-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З115',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Vektorni songa ko'paytirish va masalalarga tatbiqi",
    'Умножение вектора на число и применение к задачам',
    'Multiplying a vector by a number and applying it to problems',
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
      { id: 'f1', label: L("k·a⃗ ning moduli |k|·|a⃗| ga teng, k musbat bo'lsa yo'nalishi bir xil, manfiy bo'lsa teskari", 'модуль k·a⃗ равен |k|·|a⃗|, при положительном k направление совпадает, при отрицательном противоположно', 'the magnitude of k·a⃗ equals |k|·|a⃗|, for positive k the direction matches, for negative it is opposite') },
      { id: 'f2', label: L("a⃗ va k·a⃗ har doim kollinear", 'a⃗ и k·a⃗ всегда коллинеарны', 'a⃗ and k·a⃗ are always collinear') },
      { id: 'f3', label: L("C, AB ning o'rtasi bo'lsa, OC⃗ = ½(OA⃗+OB⃗); o'rta chiziq uchinchi tomonning yarmi", 'если C середина AB, то OC⃗ = ½(OA⃗+OB⃗); средняя линия равна половине третьей стороны', 'if C is the midpoint of AB, then OC⃗ = ½(OA⃗+OB⃗); a midline equals half the third side') },
      { id: 'w1', label: L("k ishorasi natijaning uzunligiga ta'sir qiladi, yo'nalishiga emas", 'знак k влияет на длину результата, а не на направление', "the sign of k affects the result's length, not its direction") },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. k ishorasi uzunlikka ta'sir qilmaydi, u faqat yo'nalishni belgilaydi.",
      'Так не складывается. Знак k не влияет на длину, он определяет только направление.',
      'That does not fit. The sign of k does not affect the length, it only determines the direction.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 5-§, 42-43-mavzu asosida (136-140-bet)",
        'Правило на основе геометрии, § 5, темы 42-43 учебника (стр. 136-140)',
        'The rule is based on geometry, section 5, topics 42-43 of the textbook (pages 136-140)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Vektorlarni faqat qo'shish va ayirishni bilardik",
        'Мы умели только складывать и вычитать векторы',
        'We only knew how to add and subtract vectors',
      ),
      right: L(
        "endi vektorni songa ko'paytirishni, va bu bilan masala yechishni bilamiz",
        'теперь мы умеем умножать вектор на число, и решать этим задачи',
        'now we know how to multiply a vector by a number, and use it to solve problems',
      ),
      winner: 'right',
      note: L(
        "Uzunlik songa, yo'nalish ishoraga bog'liq",
        'Длина зависит от числа, направление от знака',
        'The length depends on the number, the direction on the sign',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): |k·a⃗| ni hisoblash.
// ============================================================
const ASK_MOD = L("|k·a⃗| qancha?", 'Чему равен |k·a⃗|?', 'What is |k·a⃗|?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З114',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Vektorning moduli va songa ko'paytmaning modulini hisoblang",
    'Вычисли модуль произведения вектора на число',
    'Compute the magnitude of a vector multiplied by a number',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida |a⃗| va k berilgan.",
      'Пять заданий. В каждом даны |a⃗| и k.',
      'Five tasks. In each, |a⃗| and k are given.'),
    A('why',
      "Modul hech qachon manfiy bo'lmaydi, shuning uchun k ning ishorasi emas, uning moduli olinadi.",
      'Модуль никогда не бывает отрицательным, поэтому берётся не знак k, а его модуль.',
      'The magnitude is never negative, so it is not the sign of k that is taken, but its magnitude.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar |k| va |a⃗| ko'paytirilgan.",
      'Все пять разобраны. Каждый раз умножались |k| и |a⃗|.',
      'All five are done. Each time |k| and |a⃗| were multiplied.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'|a⃗| = 4,  k = 3'}</Row>,
        ok: L("Ha. To'rt uchga ko'paytirilsa, o'n ikki.", 'Да. Четыре умножить на три, двенадцать.', 'Yes. Four times three is twelve.'),
        question: ASK_MOD,
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '7', hint: L("Bu qo'shilgan, ko'paytirilmagan.", 'Это сложено, а не умножено.', 'That is added, not multiplied.') },
        ],
        solution: ['4 · 3', '12'],
      },
      {
        expr: <Row size="big" align="center">{'|a⃗| = 5,  k = −2'}</Row>,
        ok: L("Ha. Modul manfiy bo'lmaydi, besh ikkiga ko'paytirilsa, o'n.", 'Да. Модуль не бывает отрицательным, пять умножить на два, десять.', 'Yes. The magnitude is never negative, five times two is ten.'),
        question: ASK_MOD,
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '−10', hint: L("Modul hech qachon manfiy bo'lmaydi, ishora e'tiborga olinmaydi.", 'Модуль никогда не бывает отрицательным, знак не учитывается.', 'The magnitude is never negative, the sign is not counted.') },
        ],
        solution: ['|−2| · 5', '10'],
      },
      {
        expr: <Row size="big" align="center">{'|a⃗| = 6,  k = 0,5'}</Row>,
        ok: L("Ha. Olti yarmiga ko'paytirilsa, uch.", 'Да. Шесть умножить на половину, три.', 'Yes. Six times a half is three.'),
        question: ASK_MOD,
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '12', hint: L("Bu ikkiga ko'paytirilgan, yarimga emas.", 'Это умножено на два, а не на половину.', 'That is multiplied by two, not by a half.') },
        ],
        solution: ['6 · 0,5', '3'],
      },
      {
        expr: <Row size="big" align="center">{'|a⃗| = 8,  k = −1'}</Row>,
        ok: L("Ha. Modul manfiy bo'lmaydi, sakkiz o'zgarmaydi.", 'Да. Модуль не бывает отрицательным, восемь остаётся без изменений.', 'Yes. The magnitude is never negative, eight stays unchanged.'),
        question: ASK_MOD,
        items: [
          { id: 'a', right: true, label: '8' },
          { id: 'b', label: '−8', hint: L("Modul hech qachon manfiy bo'lmaydi.", 'Модуль никогда не бывает отрицательным.', 'The magnitude is never negative.') },
        ],
        solution: ['|−1| · 8', '8'],
      },
      {
        expr: <Row size="big" align="center">{'|a⃗| = 9,  k = 4'}</Row>,
        ok: L("Ha. To'qqiz to'rtga ko'paytirilsa, o'ttiz olti.", 'Да. Девять умножить на четыре, тридцать шесть.', 'Yes. Nine times four is thirty-six.'),
        question: ASK_MOD,
        items: [
          { id: 'a', right: true, label: '36' },
          { id: 'b', label: '13', hint: L("Bu qo'shilgan, ko'paytirilmagan.", 'Это сложено, а не умножено.', 'That is added, not multiplied.') },
        ],
        solution: ['9 · 4', '36'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): o'rta chiziqni topish (EF = ½BC).
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З115',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Uchburchak o'rta chizig'ini hisoblang",
    'Вычисли среднюю линию треугольника',
    'Compute the midline of a triangle',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida uchinchi tomon BC berilgan.",
      'Три задания. В каждом дана третья сторона BC.',
      'Three tasks. In each, the third side BC is given.'),
    A('why',
      "O'rta chiziq har doim shu tomonning yarmiga teng.",
      'Средняя линия всегда равна половине этой стороны.',
      'The midline is always equal to half of that side.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar BC ikkiga bo'lingan.",
      'Все три разобраны. Каждый раз BC делилось на два.',
      'All three are done. Each time BC was divided by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'BC = 18'}</Row>,
        ok: L("Ha. O'n sakkiz ikkiga bo'linsa, to'qqiz.", 'Да. Восемнадцать разделить на два, девять.', 'Yes. Eighteen divided by two is nine.'),
        question: L("EF o'rta chizig'i qancha?", 'Чему равна средняя линия EF?', 'What is the midline EF?'),
        items: [
          { id: 'a', right: true, label: '9' },
          { id: 'b', label: '36', hint: L("Bu ikkiga ko'paytirilgan, bo'lingani emas.", 'Это умножено на два, а не разделено.', 'That is multiplied by two, not divided.') },
        ],
        solution: ['18 : 2', '9'],
      },
      {
        expr: <Row size="big" align="center">{'BC = 24'}</Row>,
        ok: L("Ha. Yigirma to'rt ikkiga bo'linsa, o'n ikki.", 'Да. Двадцать четыре разделить на два, двенадцать.', 'Yes. Twenty-four divided by two is twelve.'),
        question: L("EF o'rta chizig'i qancha?", 'Чему равна средняя линия EF?', 'What is the midline EF?'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '48', hint: L("Bu ikkiga ko'paytirilgan, bo'lingani emas.", 'Это умножено на два, а не разделено.', 'That is multiplied by two, not divided.') },
        ],
        solution: ['24 : 2', '12'],
      },
      {
        expr: <Row size="big" align="center">{'BC = 7'}</Row>,
        ok: L("Ha. Yetti ikkiga bo'linsa, uch butun o'ndan besh.", 'Да. Семь разделить на два, три целых пять десятых.', 'Yes. Seven divided by two is three point five.'),
        question: L("EF o'rta chizig'i qancha?", 'Чему равна средняя линия EF?', 'What is the midline EF?'),
        items: [
          { id: 'a', right: true, label: '3,5' },
          { id: 'b', label: '14', hint: L("Bu ikkiga ko'paytirilgan, bo'lingani emas.", 'Это умножено на два, а не разделено.', 'That is multiplied by two, not divided.') },
        ],
        solution: ['7 : 2', '3,5'],
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
      "Modulni ko'paytirib yoki o'rta chiziqni bo'lib tekshiring.",
      'Проверь, умножив модуль или разделив среднюю линию.',
      'Check by multiplying the magnitude or dividing the midline.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash taklif qilingan javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло предложенный ответ.',
      'All three are done. Each time computation checked the proposed answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'|a⃗| = 6, k = −3   →   |k·a⃗| = 18'}</Row>,
        ok: L("Ha. Olti uchga ko'paytirilsa, o'n sakkiz.", 'Да. Шесть умножить на три, восемнадцать.', 'Yes. Six times three is eighteen.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham o'n sakkiz chiqadi.", 'Посчитай, ответ действительно выходит восемнадцать.', 'Compute it, the answer really comes to eighteen.') },
        ],
        solution: ['|−3| · 6', '18'],
      },
      {
        expr: <Row size="big" align="center">{'BC = 16   →   EF = 8'}</Row>,
        ok: L("Ha. O'n olti ikkiga bo'linsa, sakkiz.", 'Да. Шестнадцать разделить на два, восемь.', 'Yes. Sixteen divided by two is eight.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham sakkiz chiqadi.", 'Посчитай, ответ действительно выходит восемь.', 'Compute it, the answer really comes to eight.') },
        ],
        solution: ['16 : 2', '8'],
      },
      {
        expr: <Row size="big" align="center">{'|a⃗| = 10, k = 0,5   →   |k·a⃗| = 6'}</Row>,
        ok: L("Yo'q. O'n yarimga ko'paytirilsa, besh chiqadi, olti emas.", 'Нет. Десять умножить на половину, выходит пять, а не шесть.', 'No. Ten times a half comes to five, not six.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, o'nning yarmi besh.", 'Посчитай снова, половина десяти пять.', 'Compute it again, half of ten is five.') },
        ],
        solution: ['10 · 0,5', '5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): yo'nalish teskarilanmagan
// (З114) va koeffitsiyent unutilgan (З115).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З114',
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
      "Birinchisida yo'nalish teskarilanmagan, ikkinchisida koeffitsiyent qo'yilmagan.",
      'В первом направление не развёрнуто, во втором не поставлен коэффициент.',
      'In the first, the direction was not reversed, in the second, the coefficient was not applied.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham boshqa-boshqa qoidani chetlab o'tgan.",
      'Обе разобраны. Обе ошибки обошли разные правила.',
      'Both are done. Each mistake bypassed a different rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'(−2)a⃗   ↑↑   a⃗'}</Row>,
        ok: L("Ha. Manfiy songa ko'paytirilganda yo'nalish teskari bo'lishi kerak, bir xil emas.", 'Да. При умножении на отрицательное число направление должно быть противоположным, а не таким же.', 'Yes. Multiplying by a negative number should give the opposite direction, not the same one.'),
        question: L("Bu yerda (−2)·a⃗ vektori a⃗ bilan bir xil tomonga qaraydi deb yozilgan bo'lsa, xato qayerda?", 'Если здесь написано, что вектор (−2)·a⃗ смотрит в ту же сторону, что и a⃗, в чём здесь ошибка?', 'If it is written here that vector (−2)·a⃗ points the same way as a⃗, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Yo'nalish teskarilanmagan, manfiy song buni talab qiladi", 'Направление не развёрнуто, а отрицательное число этого требует', 'The direction was not reversed, but a negative number requires it') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, (−2)·a⃗ teskari tomonga qarashi kerak.", 'Это и есть показанная ошибка, (−2)·a⃗ должен смотреть в противоположную сторону.', 'This is the very mistake shown; (−2)·a⃗ should point the opposite way.') },
        ],
        solution: ['(−2)a⃗   ↑↓   a⃗'],
      },
      {
        expr: <Row size="big" align="center">{'AC = CB   →   "OC⃗ = OA⃗ + OB⃗"'}</Row>,
        ok: L("Ha. Formulada yarim koeffitsiyent bo'lishi kerak, u yerda yo'q.", 'Да. В формуле должен быть коэффициент половина, а его нет.', 'Yes. There should be a coefficient of a half in the formula, but it is missing.'),
        question: L("C, AB kesmasining o'rtasi bo'lsa, va OC⃗ yuqoridagicha yozilgan bo'lsa, xato qayerda?", 'Если C середина отрезка AB, а OC⃗ записан как выше, в чём здесь ошибка?', 'If C is the midpoint of segment AB, and OC⃗ was written as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Yarim koeffitsiyent unutilgan", 'Забыт коэффициент половина', 'The coefficient of a half was forgotten') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, o'ngga ½ qo'yilishi kerak.", 'Это и есть показанная ошибка, справа нужен коэффициент ½.', 'This is the very mistake shown; a coefficient of ½ is needed on the right.') },
        ],
        solution: ['OC⃗ = ½(OA⃗ + OB⃗)'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): |k| topib, keyin ko'paytirish.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З114',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Modulni qadamlab hisoblang, avval |k|, keyin ko'paytma",
    'Вычисли модуль по шагам, сначала |k|, потом произведение',
    'Compute the magnitude step by step, first |k|, then the product',
  ),
  audio: [
    A('mount',
      "Har topshiriqda avval k ning moduli topiladi, keyin |a⃗| ga ko'paytiriladi.",
      'В каждом задании сначала находится модуль k, потом умножается на |a⃗|.',
      'In each task, first the magnitude of k is found, then multiplied by |a⃗|.'),
    A('why',
      "Bu qadam ishoradan qat'i nazar bir xil ishlaydi.",
      'Этот шаг работает одинаково независимо от знака.',
      'This step works the same regardless of the sign.',
    ),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar avval |k| topilib, keyin ko'paytirilgan.",
      'Все три заполнены. Каждый раз сначала находился |k|, потом умножение.',
      'All three are filled. Each time |k| was found first, then multiplied.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['4', '24'],
      lines: [
        [{ t: '|a⃗|=6, k=−4   →   |k| = ' }, { slot: '4' }, { t: '   →   |k·a⃗| = ' }, { slot: '24' }],
      ],
    },
    tasks: [
      {
        chips: ['3', '24'],
        lines: [
          [{ t: '|a⃗|=8, k=−3   →   |k| = ' }, { slot: '3' }, { t: '   →   |k·a⃗| = ' }, { slot: '24' }],
        ],
      },
      {
        chips: ['6', '30'],
        lines: [
          [{ t: '|a⃗|=5, k=−6   →   |k| = ' }, { slot: '6' }, { t: '   →   |k·a⃗| = ' }, { slot: '30' }],
        ],
      },
      {
        chips: ['0,5', '5'],
        lines: [
          [{ t: '|a⃗|=10, k=−0,5   →   |k| = ' }, { slot: '0,5' }, { t: '   →   |k·a⃗| = ' }, { slot: '5' }],
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
    "Songa ko'paytirish bo'yicha to'rt savol",
    'Четыре вопроса об умножении на число',
    'Four questions about multiplying by a number',
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
        id: 'q1', tag: 'З114',
        ask: L("(−3)·a⃗ qaysi tomonga qaraydi, a⃗ ga nisbatan?", '(−3)·a⃗ смотрит в какую сторону, по отношению к a⃗?', 'Which way does (−3)·a⃗ point, relative to a⃗?'),
        options: [
          { id: 'ok', right: true, label: L('Teskari tomonga', 'В противоположную', 'The opposite way') },
          { id: 'no', label: L('Bir xil tomonga', 'В ту же сторону', 'The same way') },
        ],
        hint: L("Manfiy song yo'nalishni teskarilaydi.", 'Отрицательное число разворачивает направление.', 'A negative number reverses the direction.'),
        ok: L("To'g'ri, teskari tomonga.", 'Верно, в противоположную сторону.', 'Correct, the opposite way.'),
      },
      {
        id: 'q2', tag: 'З115',
        ask: L("C, AB kesmasining o'rtasi. OC⃗ nimaga teng?", 'C, середина отрезка AB. Чему равен OC⃗?', 'C is the midpoint of segment AB. What is OC⃗?'),
        options: [
          { id: 'ok', right: true, label: '½(OA⃗+OB⃗)' },
          { id: 'no', label: 'OA⃗+OB⃗' },
        ],
        hint: L("Formulaga yarim koeffitsiyent kerak.", 'В формулу нужен коэффициент половина.', 'The formula needs a coefficient of a half.'),
        ok: L("To'g'ri, yarim koeffitsiyent bilan.", 'Верно, с коэффициентом половина.', 'Correct, with the coefficient of a half.'),
      },
      {
        id: 'q3', tag: 'З114',
        ask: L("|a⃗| = 7, k = −2. |k·a⃗| qancha?", '|a⃗| = 7, k = −2. Чему равен |k·a⃗|?', '|a⃗| = 7, k = −2. What is |k·a⃗|?'),
        options: [
          { id: 'ok', right: true, label: '14' },
          { id: 'no', label: '−14' },
        ],
        hint: L("Modul hech qachon manfiy bo'lmaydi.", 'Модуль никогда не бывает отрицательным.', 'The magnitude is never negative.') ,
        ok: L("To'g'ri, o'n to'rt.", 'Верно, четырнадцать.', 'Correct, fourteen.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L("24 ikkiga bo'linsa, 12 chiqadimi?", 'Верно ли, что 24, делённое на два, равно 12?', 'Is it true that 24 divided by two equals 12?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, natija o'n ikki chiqadi.", 'Посчитай, результат двенадцать.', 'Compute it, the result is twelve.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З115',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "BC=26 bo'lgan uchburchakning o'rta chizig'ini yig'ing.",
            'Собери среднюю линию треугольника, если BC=26.',
            'Assemble the midline of the triangle, if BC=26.',
          ),
          lines: [
            [{ t: 'BC = 26   →   EF = ' }, { slot: '13' }],
          ],
          tiles: [
            { id: 't1', v: '13', x: 12, y: 12 },
            { id: 't2', v: '52', x: 60, y: 14 },
            { id: 't3', v: '26', x: 30, y: 50 },
            { id: 't4', v: '6,5', x: 78, y: 48 },
          ],
          hint: L(
            "Yigirma oltini ikkiga bo'ling.",
            'Раздели двадцать шесть на два.',
            'Divide twenty-six by two.',
          ),
          doneNote: L(
            "Yig'ildi. O'rta chiziq o'n uchga teng chiqdi.",
            'Собрано. Средняя линия вышла тринадцать.',
            'Assembled. The midline comes out to thirteen.',
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
    "Uzunlik songa, yo'nalish ishoraga bog'liq",
    'Длина зависит от числа, направление от знака',
    'The length depends on the number, the direction on the sign',
  ),
  audio: [
    A('s0',
      "Darsdan bitta qoida qoladi. Modul |k| va |a⃗| ko'paytmasi, yo'nalish ishoraga bog'liq.",
      'С урока остаётся одно правило. Модуль это произведение |k| и |a⃗|, направление зависит от знака.',
      'One rule stays with you. The magnitude is the product of |k| and |a⃗|, the direction depends on the sign.'),
    A('s1',
      "Bugun uch narsa qilindi. Ta'rifni qo'lladingiz, o'ziga xos vektorni chertyozhda topdingiz va o'rta chiziqni hisobladingiz.",
      'Сегодня сделано три вещи. Ты применил определение, нашёл нужный вектор на чертеже, и вычислил среднюю линию.',
      'Three things are done today. You applied the definition, found the right vector on a drawing, and computed the midline.'),
    A('s2',
      "Keyingi darsda vektorning koordinatalari, skalyar ko'paytma, va butun kursning yakuni.",
      'В следующем уроке координаты вектора, скалярное произведение, и итог всего курса.',
      'The next lesson covers vector coordinates, the dot product, and a review of the whole course.',
    ),
  ],
  props: {
    mark: "k·a⃗:  |k·a⃗| = |k|·|a⃗|,   EF = ½BC",
    markNote: L(
      "a⃗=5, k=−3 → |k·a⃗|=15;  BC=18 → EF=9",
      'a⃗=5, k=−3 → |k·a⃗|=15;  BC=18 → EF=9',
      'a⃗=5, k=−3 → |k·a⃗|=15;  BC=18 → EF=9',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: vektor koordinatalari va skalyar ko'paytma",
      'Следующий урок: координаты вектора и скалярное произведение',
      'Next lesson: vector coordinates and the dot product',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
