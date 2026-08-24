// ============================================================================
// 8-sinf, Dars 30. TAQRIBIY HISOBLASHLAR VA XATOLIKLAR.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `zoom.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `zoom`: aniq qiymatga yaqinlashib, uni
// berilgan aniqlikkacha yaxlitlaymiz.
//
// DIQQAT — bu dars darslikda TO'RT PARAGRAFNI birlashtiradi (18-21-§,
// 111-121-bet), rejadagi bitta darsga. Metodistga xabar berilishi kerak:
// hajm boshqa darslarga (20, 22, 28) qaraganda ham kattaroq siqilgan.
//
// DARSNING ISHI:
//   1) aniq qiymat x, taqribiy qiymat a: absolut xatolik |x − a| (18-§);
//   2) x = a ± h ⟺ |x − a| ≤ h ⟺ a − h ≤ x ≤ a + h (19-§, 29-darsdagi
//      modul tengsizligining to'g'ridan-to'g'ri qo'llanilishi);
//   3) yaxlitlash qoidasi: birinchi tashlab yuboriladigan raqam beshdan
//      kichik bo'lsa kami bilan, katta yoki teng bo'lsa ortig'i bilan
//      (20-§);
//   4) nisbiy xatolik: absolut xatolikning taqribiy qiymat moduliga
//      nisbati, foizda ifodalanadi (21-§) — ANIQLIKNI TAQQOSLASH uchun.
//
// DARSLIK. O'zbek darsligi, 18-21-§, 111-121-bet: Toshkent-Samarqand
// masofasi (300 ± 1 km) va tayoq uzunligi (21,3 ± 0,1 sm) taqqoslash
// namunasi (121-bet).
//
// ADASHISHLAR: ikkitasi yangi:
//   З60 — absolut va nisbiy xatolik aralashtirildi;
//   З61 — yaxlitlash noto'g'ri yo'nalishda qilindi (besh qoidasi buzildi);
//   З16 — javob son bilan tekshirilmadi (11-ekranda, qaytadi).
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { SceneBand } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'
import { UI, buildScreens } from './karkas.js'

export const META = {
  id: 'alg-8-30',
  n: 30,
  row: 33,
  block: 'Б4',
  topic: L(
    'Taqribiy hisoblashlar va xatoliklar',
    'Приближённые вычисления и погрешности',
    'Approximate calculations and errors',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "aniq qiymat x, taqribiy qiymat a bo'lsa, |x − a| absolut xatolik deyiladi",
    'Если x — точное значение, a — приближённое, то |x − a| называется абсолютной погрешностью',
    'If x is the exact value and a is the approximate one, |x − a| is called the absolute error',
  ),
  L(
    "x = a ± h yozuvi |x − a| ≤ h, ya'ni a − h ≤ x ≤ a + h degani",
    'Запись x = a ± h означает |x − a| ≤ h, то есть a − h ≤ x ≤ a + h',
    'The notation x = a ± h means |x − a| ≤ h, that is a − h ≤ x ≤ a + h',
  ),
  L(
    "absolut xatolikning taqribiy qiymat moduliga nisbati nisbiy xatolik deyiladi, u aniqlikni taqqoslash uchun ishlatiladi",
    'Отношение абсолютной погрешности к модулю приближённого значения называется относительной погрешностью и используется для сравнения точности',
    'The ratio of the absolute error to the absolute value of the approximation is called the relative error, used to compare precision',
  ),
]

export const MISS = {
  'З16': {
    what: L(
      'javob son bilan tekshirilmadi',
      'ответ не проверен числом',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 11,
  },
  'З60': {
    what: L(
      "absolut va nisbiy xatolik aralashtirildi",
      'абсолютная и относительная погрешность перепутаны',
      'the absolute and relative errors were confused',
    ),
    wrong: '1',
    at: 4,
  },
  'З61': {
    what: L(
      "yaxlitlash noto'g'ri yo'nalishda qilindi",
      'округление сделано в неверную сторону',
      'the rounding was done in the wrong direction',
    ),
    wrong: '2,23',
    at: 3,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: qaysi o'lchov aniqroq, 300±1 km yoki 21,3±0,1 sm.
// Yakun: √5 ni yuzdan birgacha yaxlitlash, 2,24.
// ============================================================
const SC_ASK = L('QAYSI BIRI ANIQROQ', 'КОТОРОЕ ТОЧНЕЕ', 'WHICH IS MORE PRECISE')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="130" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
        fill={T.ink}>{'300 ± 1 km'}</text>
      <text x="270" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
        fill={T.ink}>{'21,3 ± 0,1 sm'}</text>
      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="94" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="101" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Kvadrat ildiz beshni yuzdan birgacha yaxlitlash: ikki butun yigirma to'rt",
      'Округление корня из пяти до сотых: два целых двадцать четыре сотых',
      'Rounding the square root of five to hundredths: two point two four',
    )}>
      <text x="200" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'√5 ≈ 2,236…'}</text>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <text x="200" y="70" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20"
          fontWeight="700" fill={T.ok}>{'√5 ≈ 2,24'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1800ms' }}>
        <text x="200" y="98" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fill={T.ink3}>{'uchinchi raqam olti, besh dan katta'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('ANIQLIKNI TAQQOSLASH', 'СРАВНЕНИЕ ТОЧНОСТИ', 'COMPARING PRECISION'),
  title: L(
    "300 dan bir km xato bilanmi yoki 21,3 sm dan bir mm xato bilanmi, qaysi biri aniqroq",
    'Что точнее: триста км с ошибкой в один км или 21,3 см с ошибкой в один мм',
    'Which is more precise: three hundred km with a one-km error, or 21.3 cm with a one-mm error',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki o'lchov. Ikkalasida ham xato bor.",
      'Два измерения. В обоих есть ошибка.',
      'Two measurements. Both have an error.'),
    A('why',
      "Taxmin qiling, qaysi biri o'ziga nisbatan aniqroq.",
      'Предположи, какое из них точнее относительно самого себя.',
      'Predict which one is more precise relative to itself.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, qaysi biri aniqroq?",
      'Как думаешь, что точнее?',
      'Which do you think is more precise?',
    ),
    items: [
      { id: 'km', show: L("Masofa, 300 ± 1 km", 'Расстояние, 300 ± 1 км', 'The distance, 300 ± 1 km') },
      { id: 'cm', show: L("Tayoq, 21,3 ± 0,1 sm", 'Палка, 21,3 ± 0,1 см', 'The rod, 21.3 ± 0.1 cm') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Yaxlitlash qoidasi (5-sinfdan). Shu tayanch 5 va
// 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Yaxlitlash qoidasini eslash",
    'Вспоминаем правило округления',
    'Recalling the rounding rule',
  ),
  audio: [
    A('mount',
      "To'rt yaxlitlash. Faqat bittasi to'g'ri.",
      'Четыре округления. Только одно верное.',
      'Four roundings. Only one is correct.'),
    A('why',
      "Tashlab yuboriladigan birinchi raqam beshdan kichik bo'lsa, kami bilan yaxlitlanadi.",
      'Если первая отбрасываемая цифра меньше пяти, округляют с недостатком.',
      'If the first dropped digit is less than five, round down.'),
  ],
  props: {
    ask: L(
      "3,247 ni yuzdan birgacha qaysi yaxlitlash to'g'ri?",
      'Какое округление 3,247 до сотых верно?',
      'Which rounding of 3.247 to hundredths is correct?',
    ),
    items: [
      { id: 'right', show: '3,247 ≈ 3,25', right: true, name: L("uchinchi raqam yetti, besh dan katta", 'третья цифра семь, больше пяти', 'the third digit is seven, greater than five') },
      {
        id: 'down', show: '3,247 ≈ 3,24',
        hint: L("Tashlab yuborilgan raqam yetti, u beshdan katta, ortig'i bilan yaxlitlanishi kerak.", 'Отбрасываемая цифра семь, она больше пяти, нужно округлить с избытком.', 'The dropped digit is seven, greater than five; it should round up.'),
      },
      {
        id: 'onedec', show: '3,247 ≈ 3,2',
        hint: L("Yuzdan birgacha so'ralgan, o'ndan birgacha emas.", 'Просили до сотых, а не до десятых.', 'Hundredths were asked for, not tenths.'),
      },
      {
        id: 'wrong', show: '3,247 ≈ 3,3',
        hint: L("Bu o'ndan birgacha yaxlitlash, va u ham noto'g'ri.", 'Это округление до десятых, и оно тоже неверное.', 'That is rounding to tenths, and it is also wrong.'),
      },
    ],
    after: L(
      "To'g'ri. Uchinchi raqam yetti, beshdan katta, shuning uchun ikkinchi raqam bittaga oshadi.",
      'Верно. Третья цифра семь, больше пяти, поэтому вторая цифра увеличивается на единицу.',
      'Correct. The third digit is seven, greater than five, so the second digit increases by one.',
    ),
  },
}

// ============================================================
// EKRAN 3. A NI BURANG (1-darsning `steppers`). Taqribiy qiymat a aniq
// qiymat besh atrofida siljiydi: a besh bo'lganda xatolik YO'QOLADI (bu
// yerda YO'Q emas, aksincha aynan nolga tenglashadi, shuning uchun teskari
// yo'l — 1/xatolik — nolga bo'linishga tushadi va YO'QOLADI, З61 bilan
// bog'liq).
// ============================================================
const S3 = {
  eyebrow: L('A NI BURANG', 'КРУТИ A', 'TURN A'),
  title: L(
    "Taqribiy qiymat aniq qiymatga qanchalik yaqin",
    'Насколько приближённое значение близко к точному',
    'How close is the approximate value to the exact one',
  ),
  audio: [
    A('mount',
      "Aniq qiymat besh. Taqribiy qiymat a o'zgaradi.",
      'Точное значение равно пяти. Приближённое значение a меняется.',
      'The exact value is five. The approximate value a changes.'),
    A('why',
      "Ikki maqsad beriladi. a ning turli qiymatlarida natijani toping.",
      'Даны две цели. Находи результат при разных значениях a.',
      'Two targets are given. Find the result at different values of a.'),
    A('why',
      "Oxirida a ni beshga tushiring va nima bo'lishini ko'ring.",
      'В конце подведи a к пяти и посмотри, что будет.',
      'At the end bring a to five and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'a', label: L('taqribiy qiymat a', 'приближённое значение a', 'the approximate value a'),
        start: 3, min: 3, max: 5, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 5 ? null : Math.round((1 / Math.abs(5 - v[0])) * 100) / 100),
    resultLabel: L('1 / absolut xatolik', '1 / абсолютная погрешность', '1 / absolute error'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "a hali beshga tushmasin, avval maqsadlarni oling.",
      'a пока не подводи к пяти, сначала возьми цели.',
      'Do not bring a to five yet, take the targets first.',
    ),
    goals: [
      {
        value: 0.5,
        ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
        after: L(
          "0,5. Xatolik ikki, bir bo'lingan ikki 0,5.",
          '0,5. Погрешность равна двум, единица, делённая на два, это 0,5.',
          '0.5. The error is two, one divided by two is 0.5.',
        ),
      },
      {
        value: 1,
        ask: L("Endi natija 1 ga teng bo'lsin", 'Теперь пусть результат будет равен 1', 'Now make the result equal 1'),
        after: L(
          "1. Xatolik bir, bir bo'lingan bir bir.",
          '1. Погрешность равна одному, единица, делённая на один, это один.',
          '1. The error is one, one divided by one is one.',
        ),
      },
    ],
    ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
    ask2: L("Endi a ni beshga tushiring", 'Теперь подведи a к пяти', 'Now bring a to five'),
    broke: L(
      "a besh bo'lganda xatolik nolga teng, teskari son yo'q. Aynan aniq qiymatning o'zida xatolik yo'qoladi.",
      'При a равном пяти погрешность равна нулю, обратного числа нет. Именно в самом точном значении погрешность исчезает.',
      'With a equal to five the error equals zero, there is no reciprocal. Exactly at the exact value the error disappears.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI XATOLIK QAYSI (1-darsning `pick`). Ловушка — absolut va
// nisbiy xatolik aralashtirilgan (З60).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI XATOLIK QAYSI', 'КАКАЯ ПОГРЕШНОСТЬ КАКАЯ', 'WHICH ERROR IS WHICH'),
  title: L(
    "300 ± 1 km uchun qaysi yozuv absolut xatolik",
    'Какая запись для 300 ± 1 км — абсолютная погрешность',
    'Which record for 300 ± 1 km is the absolute error',
  ),
  audio: [
    A('mount',
      "To'rt yozuv taklif qilinadi. Faqat bittasi absolut xatolikning o'zi.",
      'Предложены четыре записи. Только одна сама абсолютная погрешность.',
      'Four records are proposed. Only one is the absolute error itself.'),
    A('why',
      "Absolut xatolik shart ± belgisidan keyingi son, o'zi.",
      'Абсолютная погрешность это само число после знака ±.',
      'The absolute error is the number itself after the ± sign.'),
  ],
  props: {
    ask: L(
      "300 ± 1 km uchun absolut xatolik qaysi?",
      'Какова абсолютная погрешность для 300 ± 1 км?',
      'What is the absolute error for 300 ± 1 km?',
    ),
    items: [
      { id: 'right', show: '1 km', right: true, name: L("± belgisidan keyingi son", 'число после знака ±', 'the number after the ± sign') },
      {
        id: 'relative', show: '0,33%',
        hint: L("Bu nisbiy xatolik, foizda, absolut emas.", 'Это относительная погрешность, в процентах, а не абсолютная.', 'That is the relative error, in percent, not the absolute one.'),
      },
      {
        id: 'value', show: '300 km',
        hint: L("Bu taqribiy qiymatning o'zi, xatolik emas.", 'Это само приближённое значение, а не погрешность.', 'That is the approximate value itself, not the error.'),
      },
      {
        id: 'ratio', show: '1/300',
        hint: L("Bu nisbat, u foizga aylantiriladi, absolut xatolikning o'zi emas.", 'Это отношение, оно переводится в проценты, а не сама абсолютная погрешность.', 'That is a ratio, converted to percent, not the absolute error itself.'),
      },
    ],
    after: L(
      "To'g'ri. Absolut xatolik ± belgisidan keyingi son, ya'ni bir kilometr.",
      'Верно. Абсолютная погрешность это число после знака ±, то есть один километр.',
      'Correct. The absolute error is the number after the ± sign, that is one kilometer.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — YAQINLASHIB YAXLITLASH (`zoom`).
// Yakundagi misol shu yerda to'liq ochiladi: √5 ≈ 2,24.
// ============================================================
const S5 = {
  eyebrow: L('YAQINLASHAMIZ', 'ПРИБЛИЖАЕМСЯ', 'WE ZOOM IN'),
  title: L(
    "Kvadrat ildiz beshni yuzdan birgacha yaxlitlang",
    'Округли корень из пяти до сотых',
    'Round the square root of five to hundredths',
  ),
  audio: [
    A('mount',
      "Kvadrat ildiz besh to'g'ri chiziqda qayerda turadi.",
      'Где на числовой прямой стоит корень из пяти.',
      'Where the square root of five stands on the number line.'),
    A('why',
      "Lupani bosib, raqamlarni ochamiz.",
      'Нажимая на лупу, открываем цифры.',
      'Pressing the magnifier, we reveal the digits.'),
    W('z3',
      "Uchinchi raqam ochildi, endi yaxlitlash mumkin.",
      'Открылась третья цифра, теперь можно округлить.',
      'The third digit is revealed, now rounding is possible.'),
  ],
  props: {
    expr: 'sqrt(5)',
    label: L('√5', '√5', '√5'),
    depth: 3,
    ask: L(
      "√5 ni yuzdan birgacha yaxlitlash natijasi qaysi?",
      'Каков результат округления √5 до сотых?',
      'What is the result of rounding √5 to hundredths?',
    ),
    items: [
      { id: 'right', show: '2,24', right: true },
      { id: 'down', show: '2,23', hint: L("Uchinchi raqam olti, u beshdan katta, ortig'i bilan yaxlitlanadi.", 'Третья цифра шесть, она больше пяти, округляется с избытком.', 'The third digit is six, greater than five; it rounds up.') },
      { id: 'onedec', show: '2,2', hint: L("Yuzdan birgacha so'ralgan, o'ndan birgacha emas.", 'Просили до сотых, а не до десятых.', 'Hundredths were asked for, not tenths.') },
      { id: 'wrong', show: '2,3', hint: L("Bu o'ndan birgacha yaxlitlash, va yo'nalishi ham noto'g'ri bo'lardi.", 'Это округление до десятых, и направление тоже было бы неверным.', 'That is rounding to tenths, and the direction would also be wrong.') },
    ],
    after: L(
      "To'g'ri. Uchinchi raqam olti, beshdan katta, ikkinchi raqam bittaga oshadi.",
      'Верно. Третья цифра шесть, больше пяти, вторая цифра увеличивается на единицу.',
      'Correct. The third digit is six, greater than five, the second digit increases by one.',
    ),
    note: L(
      "√5 ≈ 2,24, absolut xatolik 0,004 dan kichik.",
      '√5 ≈ 2,24, абсолютная погрешность меньше 0,004.',
      '√5 ≈ 2.24, the absolute error is less than 0.004.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): aniqlikni ikki yo'l bilan
// ifodalash — absolut va nisbiy xatolik.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Aniqlikni ikki yo'l bilan ifodalash",
    'Выразить точность двумя способами',
    'Expressing precision two ways',
  ),
  audio: [
    A('mount',
      "Bitta o'lchov va ikki yo'l. Ikkalasi ham aniqlikni ko'rsatadi.",
      'Одно измерение и два пути. Оба показывают точность.',
      'One measurement and two ways. Both show precision.'),
    W('w2',
      "Birinchi yo'lda absolut xatolik, bevosita son.",
      'В первом пути абсолютная погрешность, прямое число.',
      'In the first way, the absolute error, a direct number.'),
    W('w4',
      "Ikkinchi yo'lda nisbiy xatolik, foizda.",
      'Во втором пути относительная погрешность, в процентах.',
      'In the second way, the relative error, in percent.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL — ABSOLUT XATOLIK', 'СПОСОБ 1 — АБСОЛЮТНАЯ ПОГРЕШНОСТЬ', 'METHOD 1 — ABSOLUTE ERROR'),
        lead: L(
          "300 ± 1 km, absolut xatolik bir kilometr",
          '300 ± 1 км, абсолютная погрешность один километр',
          '300 ± 1 km, absolute error one kilometer',
        ),
        rows: [
          { text: '|300 − a| ≤ 1' },
          { text: L('bir kilometr', 'один километр', 'one kilometer'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL — NISBIY XATOLIK', 'СПОСОБ 2 — ОТНОСИТЕЛЬНАЯ ПОГРЕШНОСТЬ', 'METHOD 2 — RELATIVE ERROR'),
        lead: L(
          "Bir kilometrni uch yuzga bo'lib, foizga aylantiramiz",
          'Делим один километр на триста и переводим в проценты',
          'We divide one kilometer by three hundred and convert to percent',
        ),
        rows: [
          { text: '1 / 300' },
          { text: L("taxminan 0,33 foiz", 'примерно 0,33 процента', 'about 0.33 percent'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL O\'LCHOVNI TASVIRLAYDI', 'ОБА ОПИСЫВАЮТ ОДНО ИЗМЕРЕНИЕ', 'BOTH DESCRIBE THE SAME MEASUREMENT'),
        lead: L(
          "Absolut xatolik miqdorni, nisbiy xatolik aniqlikni ko'rsatadi",
          'Абсолютная погрешность показывает величину, относительная — точность',
          'The absolute error shows the amount, the relative error shows the precision',
        ),
        rows: [{ text: L('0,33 foiz', '0,33 процента', '0.33 percent'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): nega nisbiy xatolik aniqlikni
// taqqoslashga imkon beradi.
// ============================================================
const S7 = {
  eyebrow: L('NEGA NISBIY XATOLIK KERAK', 'ПОЧЕМУ НУЖНА ОТНОСИТЕЛЬНАЯ', 'WHY THE RELATIVE ERROR IS NEEDED'),
  title: L(
    "Nega nisbiy xatolik aniqlikni taqqoslashga yordam beradi",
    'Почему относительная погрешность помогает сравнивать точность',
    'Why the relative error helps compare precision',
  ),
  audio: [
    A('mount',
      "Bir kilometr xato uch yuz kilometrlik masofada kichik.",
      'Ошибка в один километр мала на фоне трёхсот километров.',
      'A one-kilometer error is small against three hundred kilometers.'),
    W('p2',
      "Bir millimetr xato yigirma bir sm li tayoqda katta.",
      'Ошибка в один миллиметр велика на фоне палки в двадцать один сантиметр.',
      'A one-millimeter error is large against a rod of twenty-one centimeters.'),
    W('p4',
      "Nisbiy xatolik ikkalasini bir xil o'lchovga keltiradi, va tayoqniki kattaroq chiqadi.",
      'Относительная погрешность приводит оба к одной шкале, и у палки она оказывается больше.',
      'The relative error brings both to the same scale, and the rod turns out larger.',
    ),
  ],
  props: {
    tokens: [
      { t: '|x − a|', id: 'a' },
      { t: '  /  ', id: 'sign' },
      { t: '|a|', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qadam. Absolut xatolikning o'zi ikki o'lchovni to'g'ridan-to'g'ri solishtira olmaydi.",
          'Первый шаг. Сама абсолютная погрешность не может напрямую сравнить два измерения.',
          'Step one. The absolute error itself cannot directly compare two measurements.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi qadam. Uni taqribiy qiymatga bo'lib, nisbiy o'lchov olamiz.",
          'Второй шаг. Разделив её на приближённое значение, получаем относительную меру.',
          'Step two. Dividing it by the approximate value gives a relative measure.',
        ),
      },
      {
        focus: 'sign',
        text: L(
          "Uchinchi qadam. Endi ikkala o'lchov ham foizda, va ularni to'g'ridan-to'g'ri solishtirish mumkin.",
          'Третий шаг. Теперь оба измерения в процентах, и их можно сравнивать напрямую.',
          'Step three. Now both measurements are in percent, and they can be compared directly.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Darslikning o'z namunasida Toshkent-Samarqand masofasi va bir tayoq uzunligi taqqoslanadi, va aynan qisqa tayoqning nisbiy xatoligi kattaroq chiqadi.",
        'В собственном примере учебника сравниваются расстояние Ташкент-Самарканд и длина палки, и именно у короткой палки относительная погрешность оказывается больше.',
        "In the textbook's own example, the Tashkent-Samarkand distance and the length of a rod are compared, and it is the short rod that has the larger relative error.",
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 18-21-§, 111-121-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Absolut va nisbiy xatolik",
    'Абсолютная и относительная погрешность',
    'Absolute and relative error',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik qoidasi ochildi, va xukdagi qarz to'landi.",
      'Открылось правило из учебника, и долг с хука оплачен.',
      'The textbook rule opened, and the debt from the hook is paid.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("aniq qiymat x, taqribiy qiymat a bo'lsa", 'если x точное значение, a приближённое', 'if x is the exact value, a the approximate one') },
      { id: 'f2', label: L("|x − a| absolut xatolik deyiladi", 'то |x − a| называется абсолютной погрешностью', 'then |x − a| is called the absolute error') },
      { id: 'f3', label: L("absolut xatolikning |a| ga nisbati", 'отношение абсолютной погрешности к |a|', 'the ratio of the absolute error to |a|') },
      { id: 'f4', label: L("nisbiy xatolik deyiladi", 'называется относительной погрешностью', 'is called the relative error') },
      { id: 'w1', label: L("absolut xatolik doim foizda ifodalanadi", 'абсолютная погрешность всегда выражается в процентах', 'the absolute error is always expressed in percent') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Foizda ifodalanadigan aynan nisbiy xatolik, absolut emas.",
      'Так не складывается. В процентах выражается именно относительная погрешность, а не абсолютная.',
      'That does not fit. It is the relative error that is expressed in percent, not the absolute one.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 18-21-§, 111-121-bet (to'rt paragraf birlashtirilgan)",
        'Учебник, § 18–21, стр. 111–121 (объединены четыре параграфа)',
        'Textbook, sections 18-21, pages 111–121 (four sections combined)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Qaysi o'lchov aniqroq ekanini hali bilmaymiz",
        'Мы пока не знаем, какое измерение точнее',
        'We still do not know which measurement is more precise',
      ),
      right: L(
        "endi nisbiy xatolikni hisoblab, tayoq ekanini bilamiz",
        'теперь, посчитав относительную погрешность, знаем, что это расстояние',
        'now, having computed the relative error, we know it is the distance',
      ),
      winner: 'right',
      note: L(
        "Nisbiy xatolik kichikroq bo'lgan o'lchov aniqroq",
        'Точнее то измерение, у которого относительная погрешность меньше',
        'The measurement with the smaller relative error is more precise',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): yaxlitlash.
// ============================================================
const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Berilgan aniqlikkacha yaxlitlang",
    'Округли до заданной точности',
    'Round to the given precision',
  ),
  audio: [
    A('mount',
      "Besh son. Har birini ko'rsatilgan aniqlikkacha yaxlitlang.",
      'Пять чисел. Каждое округли до указанной точности.',
      'Five numbers. Round each to the indicated precision.'),
    A('why',
      "Tashlab yuboriladigan birinchi raqamga qarang.",
      'Смотри на первую отбрасываемую цифру.',
      'Look at the first digit being dropped.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar tashlab yuboriladigan raqam yo'nalishni bergan.",
      'Все пять разобраны. Каждый раз отбрасываемая цифра давала направление.',
      'All five are done. Each time the dropped digit gave the direction.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'7,382'}</Row>,
        ok: L("Ha. Uchinchi raqam ikki, beshdan kichik, kami bilan.", 'Да. Третья цифра два, меньше пяти, с недостатком.', 'Yes. The third digit is two, less than five, round down.'),
        question: L("Yuzdan birgacha yaxlitlansa, to'g'ri yaxlitlash qaysi?", 'Если округлить до сотых, какое округление верно?', 'If rounded to hundredths, which rounding is correct?'),
        items: [
          { id: 'a', right: true, label: '7,38' },
          { id: 'b', label: '7,39', hint: L("Uchinchi raqam ikki, beshdan kichik, ortig'i bilan emas.", 'Третья цифра два, меньше пяти, не с избытком.', 'The third digit is two, less than five, not rounding up.') },
        ],
        solution: ['7,382', '7,38'],
      },
      {
        expr: <Row size="big" align="center">{'4,156'}</Row>,
        ok: L("Ha. Uchinchi raqam olti, beshdan katta, ortig'i bilan.", 'Да. Третья цифра шесть, больше пяти, с избытком.', 'Yes. The third digit is six, greater than five, round up.'),
        question: L("Yuzdan birgacha yaxlitlansa, to'g'ri yaxlitlash qaysi?", 'Если округлить до сотых, какое округление верно?', 'If rounded to hundredths, which rounding is correct?'),
        items: [
          { id: 'a', right: true, label: '4,16' },
          { id: 'b', label: '4,15', hint: L("Uchinchi raqam olti, beshdan katta, ortig'i bilan yaxlitlanadi.", 'Третья цифра шесть, больше пяти, округляется с избытком.', 'The third digit is six, greater than five, rounds up.') },
        ],
        solution: ['4,156', '4,16'],
      },
      {
        expr: <Row size="big" align="center">{'12,05'}</Row>,
        ok: L("Ha. Birinchi raqam nol, beshdan kichik, kami bilan.", 'Да. Первая цифра нуль, меньше пяти, с недостатком.', 'Yes. The first digit is zero, less than five, round down.'),
        question: L("Butun songacha yaxlitlansa, to'g'ri yaxlitlash qaysi?", 'Если округлить до целого, какое округление верно?', 'If rounded to a whole number, which rounding is correct?'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '13', hint: L("O'ndan birinchi raqam nol, beshdan kichik.", 'Первая цифра после запятой нуль, меньше пяти.', 'The first digit after the decimal is zero, less than five.') },
        ],
        solution: ['12,05', '12'],
      },
      {
        expr: <Row size="big" align="center">{'0,999'}</Row>,
        ok: L("Ha. Ikkinchi raqam to'qqiz, ortig'i bilan yaxlitlanib bir chiqadi.", 'Да. Вторая цифра девять, с избытком получается единица.', 'Yes. The second digit is nine, rounding up gives one.'),
        question: L("O'ndan birgacha yaxlitlansa, to'g'ri yaxlitlash qaysi?", 'Если округлить до десятых, какое округление верно?', 'If rounded to tenths, which rounding is correct?'),
        items: [
          { id: 'a', right: true, label: '1,0' },
          { id: 'b', label: '0,9', hint: L("Ikkinchi raqam to'qqiz, beshdan katta, oshirish kerak edi.", 'Вторая цифра девять, больше пяти, нужно было увеличить.', 'The second digit is nine, greater than five; it should have increased.') },
        ],
        solution: ['0,999', '1,0'],
      },
      {
        expr: <Row size="big" align="center">{'2,5'}</Row>,
        ok: L("Ha. Tashlab yuborilgan raqam besh, teng, shuning uchun ortig'i bilan.", 'Да. Отбрасываемая цифра пять, равна, поэтому с избытком.', 'Yes. The dropped digit is five, equal, so round up.'),
        question: L("Butun songacha yaxlitlansa, to'g'ri yaxlitlash qaysi?", 'Если округлить до целого, какое округление верно?', 'If rounded to a whole number, which rounding is correct?'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '2', hint: L("Besh qoidasi katta yoki tengni ham qamrab oladi, ortig'i bilan yaxlitlanadi.", 'Правило пяти включает и равенство, округляется с избытком.', 'The rule for five includes equality too; it rounds up.') },
        ],
        solution: ['2,5', '3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): absolut va nisbiy xatolikni
// hisoblang.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Absolut va nisbiy xatolikni hisoblang",
    'Вычисли абсолютную и относительную погрешность',
    'Compute the absolute and relative error',
  ),
  audio: [
    A('mount',
      "Uch o'lchov. Har birida absolut, keyin nisbiy xatolikni toping.",
      'Три измерения. В каждом найди абсолютную, затем относительную погрешность.',
      'Three measurements. In each, find the absolute, then relative error.'),
    A('why',
      "Nisbiy xatolik absolutni taqribiy qiymatga bo'lish.",
      'Относительная погрешность это деление абсолютной на приближённое значение.',
      'The relative error is the absolute error divided by the approximate value.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar bo'lish nisbiy xatolikni bergan.",
      'Все три разобраны. Каждый раз деление давало относительную погрешность.',
      'All three are done. Each time division gave the relative error.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'100 ± 2'}</Row>,
        ok: L("Ha. Absolut ikki, nisbiy ikkidan yuzga, ikki foiz.", 'Да. Абсолютная два, относительная два к ста, два процента.', 'Yes. Absolute is two, relative is two to a hundred, two percent.'),
        question: L("Nisbiy xatolik necha foiz?", 'Сколько процентов относительная погрешность?', 'What percent is the relative error?'),
        items: [
          { id: 'a', right: true, label: '2%' },
          { id: 'b', label: '0,2%', hint: L("Ikkini yuzga bo'lib, yuzga ko'paytiring, ikki foiz chiqadi.", 'Раздели два на сто и умножь на сто, получится два процента.', 'Divide two by a hundred and multiply by a hundred, giving two percent.') },
        ],
        solution: ['2/100', '0,02', '2%'],
      },
      {
        expr: <Row size="big" align="center">{'50 ± 5'}</Row>,
        ok: L("Ha. Absolut besh, nisbiy beshdan ellikka, o'n foiz.", 'Да. Абсолютная пять, относительная пять к пятидесяти, десять процентов.', 'Yes. Absolute is five, relative is five to fifty, ten percent.'),
        question: L("Nisbiy xatolik necha foiz?", 'Сколько процентов относительная погрешность?', 'What percent is the relative error?'),
        items: [
          { id: 'a', right: true, label: '10%' },
          { id: 'b', label: '5%', hint: L("Beshni ellikka bo'lib yuzga ko'paytiring, o'n foiz chiqadi.", 'Раздели пять на пятьдесят и умножь на сто, получится десять процентов.', 'Divide five by fifty and multiply by a hundred, giving ten percent.') },
        ],
        solution: ['5/50', '0,1', '10%'],
      },
      {
        expr: <Row size="big" align="center">{'20 ± 1'}</Row>,
        ok: L("Ha. Absolut bir, nisbiy birdan yigirmaga, besh foiz.", 'Да. Абсолютная один, относительная один к двадцати, пять процентов.', 'Yes. Absolute is one, relative is one to twenty, five percent.'),
        question: L("Nisbiy xatolik necha foiz?", 'Сколько процентов относительная погрешность?', 'What percent is the relative error?'),
        items: [
          { id: 'a', right: true, label: '5%' },
          { id: 'b', label: '20%', hint: L("Birni yigirmaga bo'lib yuzga ko'paytiring, besh foiz chiqadi.", 'Раздели один на двадцать и умножь на сто, получится пять процентов.', 'Divide one by twenty and multiply by a hundred, giving five percent.') },
        ],
        solution: ['1/20', '0,05', '5%'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): javobni son bilan
// tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Javobni son bilan tekshirish",
    'Проверка ответа числом',
    'Checking the answer with a number',
  ),
  audio: [
    A('mount',
      "Uch taklif qilingan javob. Har birini hisoblab tekshiring.",
      'Предложены три ответа. Каждый проверь вычислением.',
      'Three proposed answers. Check each by computing.'),
    A('why',
      "Absolut xatolikni taqribiy qiymatga bo'lib, natijani solishtiring.",
      'Раздели абсолютную погрешность на приближённое значение и сравни результат.',
      'Divide the absolute error by the approximate value and compare the result.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло ответ.',
      'All three are done. Each time computation checked the answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'40 ± 2   →   5%'}</Row>,
        ok: L("Ha. Ikkini qirqqa bo'lib yuzga ko'paytirsak besh foiz chiqadi.", 'Да. Разделив два на сорок и умножив на сто, получаем пять процентов.', 'Yes. Dividing two by forty and multiplying by a hundred gives five percent.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikkidan qirqqa nisbat besh foizga teng chiqadi.", 'Отношение двух к сорока равно пяти процентам.', 'The ratio of two to forty equals five percent.') },
        ],
        solution: ['2/40', '0,05', '5%'],
      },
      {
        expr: <Row size="big" align="center">{'200 ± 4   →   4%'}</Row>,
        ok: L("Yo'q. To'rtni ikki yuzga bo'lib yuzga ko'paytirsak ikki foiz chiqadi, to'rt emas.", 'Нет. Разделив четыре на двести и умножив на сто, получаем два процента, а не четыре.', 'No. Dividing four by two hundred and multiplying by a hundred gives two percent, not four.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("To'rtdan ikki yuzga nisbat ikki foizga teng, to'rtga emas.", 'Отношение четырёх к двумстам равно двум процентам, а не четырём.', 'The ratio of four to two hundred equals two percent, not four.') },
        ],
        solution: ['4/200', '0,02', '2%'],
      },
      {
        expr: <Row size="big" align="center">{'10 ± 1   →   10%'}</Row>,
        ok: L("Ha. Birni o'nga bo'lib yuzga ko'paytirsak o'n foiz chiqadi.", 'Да. Разделив один на десять и умножив на сто, получаем десять процентов.', 'Yes. Dividing one by ten and multiplying by a hundred gives ten percent.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Birdan o'nga nisbat o'n foizga teng chiqadi.", 'Отношение одного к десяти равно десяти процентам.', 'The ratio of one to ten equals ten percent.') },
        ],
        solution: ['1/10', '0,1', '10%'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): absolut va nisbiy
// xatolik aralashtirilgan (З60).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Absolut va nisbiy xatolik aralashtirilmaganmi",
    'Не перепутаны ли абсолютная и относительная погрешность',
    'Were the absolute and relative error not confused',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham nisbiy xatolik o'rniga absolut yozilgan.",
      'Два задания. В обоих вместо относительной записана абсолютная погрешность.',
      'Two tasks. In both, the absolute error was written instead of the relative one.'),
    A('why',
      "Foizda so'ralganda, bo'lish va yuzga ko'paytirish shart.",
      'Когда просят в процентах, нужно делить и умножать на сто.',
      'When percent is asked for, division and multiplication by a hundred are required.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Foizda so'ralganda nisbiy xatolik kerak.",
      'Оба разобраны. Когда просят в процентах, нужна относительная погрешность.',
      'Both are done. When percent is asked for, the relative error is needed.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'25 ± 5   →   5'}</Row>,
        ok: L("Ha. Bu absolut xatolikning o'zi, nisbiy xatolik beshni yigirma beshga bo'lib yigirma foiz bo'lishi kerak edi.", 'Да. Это сама абсолютная погрешность, относительная должна быть двадцать процентов.', 'Yes. This is the absolute error itself; the relative error should be twenty percent.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Absolut xatolik nisbiy sifatida yozilgan", 'Абсолютная погрешность записана как относительная', 'The absolute error was written as the relative one') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, foizga aylantirilmagan.", 'Это и есть показанная ошибка, не переведено в проценты.', 'This is the very mistake shown; it was not converted to percent.') },
        ],
        solution: ['5/25', '0,2', '20%'],
      },
      {
        expr: <Row size="big" align="center">{'80 ± 4   →   4'}</Row>,
        ok: L("Ha. Bu ham absolut xatolik, nisbiy xatolik to'rtni sakson bo'lib besh foiz bo'lishi kerak edi.", 'Да. Это тоже абсолютная погрешность, относительная должна быть пять процентов.', 'Yes. This too is the absolute error; the relative error should be five percent.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Absolut xatolik nisbiy sifatida yozilgan", 'Абсолютная погрешность записана как относительная', 'The absolute error was written as the relative one') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, foizga aylantirilmagan.", 'Это и есть показанная ошибка, не переведено в проценты.', 'This is the very mistake shown; it was not converted to percent.') },
        ],
        solution: ['4/80', '0,05', '5%'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH (1-darsning `fill`): xatolikni qadamlab hisoblash.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Nisbiy xatolikni qadamlab hisoblang",
    'Вычисли относительную погрешность по шагам',
    'Compute the relative error step by step',
  ),
  audio: [
    A('mount',
      "O'lchov berilgan. Absolut xatolikni taqribiy qiymatga bo'lib foizga aylantiring.",
      'Дано измерение. Раздели абсолютную погрешность на приближённое значение и переведи в проценты.',
      'A measurement is given. Divide the absolute error by the approximate value and convert to percent.'),
    A('why',
      "Bo'lgandan keyin yuzga ko'paytirishni unutmang.",
      'После деления не забудь умножить на сто.',
      'After dividing, do not forget to multiply by a hundred.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar bo'lish va yuzga ko'paytirish foizni bergan.",
      'Все три заполнены. Каждый раз деление и умножение на сто давали процент.',
      'All three are filled. Each time dividing and multiplying by a hundred gave the percent.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['0,04', '4'],
      lines: [
        [{ t: '50 ± 2   →   2/50 = ' }, { slot: '0,04' }, { t: ' = ' }, { slot: '4' }, { t: '%' }],
      ],
    },
    tasks: [
      {
        chips: ['0,03', '3'],
        lines: [
          [{ t: '100 ± 3   →   3/100 = ' }, { slot: '0,03' }, { t: ' = ' }, { slot: '3' }, { t: '%' }],
        ],
      },
      {
        chips: ['0,08', '8'],
        lines: [
          [{ t: '25 ± 2   →   2/25 = ' }, { slot: '0,08' }, { t: ' = ' }, { slot: '8' }, { t: '%' }],
        ],
      },
      {
        chips: ['0,15', '15'],
        lines: [
          [{ t: '20 ± 3   →   3/20 = ' }, { slot: '0,15' }, { t: ' = ' }, { slot: '15' }, { t: '%' }],
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS (to'rt savol va beshinchisi SBORKA).
// ============================================================
const S14 = {
  eyebrow: UI.blitzEyebrow,
  title: L(
    "Xatoliklar bo'yicha to'rt savol",
    'Четыре вопроса о погрешностях',
    'Four questions about errors',
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
        id: 'q1', tag: 'З61',
        ask: L('5,45 ni o\'ndan birgacha qanday yaxlitlash to\'g\'ri?', 'Как верно округлить 5,45 до десятых?', 'How to correctly round 5.45 to tenths?'),
        options: [
          { id: 'ok', right: true, label: '5,5' },
          { id: 'down', label: '5,4' },
          { id: 'wrong', label: '5,0' },
        ],
        hint: L("Ikkinchi raqam besh, teng, ortig'i bilan yaxlitlanadi.", 'Вторая цифра пять, равна, округляется с избытком.', 'The second digit is five, equal, it rounds up.'),
        ok: L("To'g'ri, besh qoidasi ortig'i bilan yaxlitlashni beradi.", 'Верно, правило пяти даёт округление с избытком.', 'Correct, the rule for five gives rounding up.'),
      },
      {
        id: 'q2', tag: 'З60',
        ask: L('60 ± 3 uchun nisbiy xatolik necha foiz?', 'Сколько процентов относительная погрешность для 60 ± 3?', 'What percent is the relative error for 60 ± 3?'),
        options: [
          { id: 'ok', right: true, label: '5%' },
          { id: 'abs', label: '3' },
          { id: 'wrong', label: '3%' },
        ],
        hint: L("Uchni oltmishga bo'lib, yuzga ko'paytiring.", 'Раздели три на шестьдесят и умножь на сто.', 'Divide three by sixty and multiply by a hundred.'),
        ok: L("To'g'ri, besh foiz chiqadi.", 'Верно, получается пять процентов.', 'Correct, it gives five percent.'),
      },
      {
        id: 'q3', tag: 'З61',
        ask: L('x = 12 ± 0,5 nima degani?', 'Что означает x = 12 ± 0,5?', 'What does x = 12 ± 0.5 mean?'),
        options: [
          { id: 'ok', right: true, label: '11,5 ≤ x ≤ 12,5' },
          { id: 'wrong', label: 'x = 12,5' },
          { id: 'wrong2', label: 'x ≥ 12,5' },
        ],
        hint: L("± belgisi qo'sh tengsizlik beradi, kesma hosil qiladi.", 'Знак ± даёт двойное неравенство, образуя отрезок.', 'The ± sign gives a double inequality, forming a segment.'),
        ok: L("To'g'ri, o'n bir yarimdan o'n ikki yarimgacha kesma.", 'Верно, отрезок от одиннадцати с половиной до двенадцати с половиной.', 'Correct, the segment from eleven and a half to twelve and a half.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('300 ± 1 va 21,3 ± 0,1 dan qaysi biri nisbatan aniqroq?', 'Что точнее относительно себя: 300 ± 1 или 21,3 ± 0,1?', 'Which is relatively more precise: 300 ± 1 or 21.3 ± 0.1?'),
        options: [
          { id: 'ok', right: true, label: L('300 ± 1, chunki nisbiy xatoligi kichikroq', '300 ± 1, потому что его относительная погрешность меньше', '300 ± 1, because its relative error is smaller') },
          { id: 'no', label: L('21,3 ± 0,1', '21,3 ± 0,1', '21.3 ± 0.1') },
        ],
        hint: L("Ikkalasining nisbiy xatoligini hisoblab solishtiring.", 'Посчитай и сравни относительную погрешность обоих.', 'Compute and compare the relative error of both.'),
        ok: L("To'g'ri, uch yuzning nisbiy xatoligi kichikroq chiqadi.", 'Верно, относительная погрешность трёхсот выходит меньше.', 'Correct, the relative error of three hundred comes out smaller.'),
      },
      {
        id: 'q5', tag: 'З61',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "6,28 ni o'ndan birgacha yaxlitlab yozuvni yig'ing.",
            'Округли 6,28 до десятых и собери запись.',
            'Round 6.28 to tenths and assemble the record.',
          ),
          lines: [
            [{ t: '6,28 ≈ ' }, { slot: '6,3' }],
          ],
          tiles: [
            { id: 't1', v: '6,3', x: 12, y: 12 },
            { id: 't2', v: '6,2', x: 70, y: 14 },
            { id: 't3', v: '6,0', x: 40, y: 50 },
          ],
          hint: L(
            "Ikkinchi raqam sakkiz, beshdan katta, ortig'i bilan yaxlitlanadi.",
            'Вторая цифра восемь, больше пяти, округляется с избытком.',
            'The second digit is eight, greater than five, it rounds up.',
          ),
          doneNote: L(
            "Yig'ildi. Sakkiz beshdan katta bo'lgani uchun ikkinchi raqam bittaga oshdi.",
            'Собрано. Так как восемь больше пяти, вторая цифра увеличилась на единицу.',
            'Assembled. Since eight is greater than five, the second digit increased by one.',
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
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Nisbiy xatolik aniqlikni taqqoslash imkonini beradi",
    'Относительная погрешность позволяет сравнивать точность',
    'The relative error allows comparing precision',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. Kvadrat ildiz besh taxminan ikki butun yigirma to'rt yuzdan.",
      'С урока остаётся одна запись. Корень из пяти примерно равен двум целым двадцати четырём сотым.',
      'One record stays with you. The square root of five is approximately two point two four.'),
    A('s1',
      "Bugun uch narsa qilindi. Yaxlitlash qoidasini qo'lladingiz, absolut xatolikni topdingiz va nisbiy xatolik bilan aniqlikni taqqosladingiz.",
      'Сегодня сделано три вещи. Ты применил правило округления, нашёл абсолютную погрешность и сравнил точность через относительную погрешность.',
      'Three things are done today. You applied the rounding rule, found the absolute error, and compared precision using the relative error.'),
    A('s2',
      "Shu blok shu bilan yakunlanadi. Keyingi blokda darajalar, statistika va kombinatorika boshlanadi.",
      'Блок Б4 на этом завершается. В следующем блоке начинаются степени, статистика и комбинаторика.',
      'Block B4 concludes here. The next block begins with powers, statistics, and combinatorics.',
    ),
  ],
  props: {
    mark: '√5 ≈ 2,24',
    markNote: L(
      "absolut xatolik 0,004 dan kichik",
      'абсолютная погрешность меньше 0,004',
      'the absolute error is less than 0.004',
    ),
    lines: [
      L(
        "aniq va taqribiy qiymat orasidagi ayirma moduli absolut xatolik",
        'Модуль разности точного и приближённого значения — абсолютная погрешность',
        'The absolute value of the difference between the exact and approximate value is the absolute error',
      ),
      L(
        "absolut xatolikning taqribiy qiymatga nisbati nisbiy xatolik",
        'Отношение абсолютной погрешности к приближённому значению — относительная погрешность',
        'The ratio of the absolute error to the approximate value is the relative error',
      ),
      L(
        "nisbiy xatolik kichikroq bo'lgan o'lchov aniqroq",
        'Точнее то измерение, у которого относительная погрешность меньше',
        'The measurement with the smaller relative error is more precise',
      ),
    ],
    bridge: L(
      "Keyingi blok: darajalar, statistika va kombinatorika",
      'Следующий блок: степени, статистика и комбинаторика',
      'Next block: powers, statistics, and combinatorics',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — YAQINLASHIB YAXLITLASH (`zoom`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З61', 'З60', 'З61',
    'З61', 'З60', 'З60', 'З61', 'З60',
    'З16', 'З60', 'З60', null, null,
  ],
  mechanic: { at: 5, tool: 'zoom', kind: 'round' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
