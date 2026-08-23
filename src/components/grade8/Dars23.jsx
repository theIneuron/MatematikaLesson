// ============================================================================
// 8-sinf, Dars 23. SONLI TENGSIZLIKLAR.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `twosides.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `twosides`: ayirma usuli bilan taqqoslash,
// belgi burilmaydi (bu З blokning eng nozik joyi 24-darsda, bu yerda hali yo'q).
//
// DARSNING ISHI (darslik, 11-§, 68-70-bet):
//   1) a-b ayirma musbat bo'lsa, a son b sondan katta (a > b);
//   2) a-b ayirma manfiy bo'lsa, a son b sondan kichik (a < b);
//   3) taqqoslash ayirmaning ISHORASIGA qaraladi, sonlarning o'zi qanchalik
//      katta ko'rinishiga emas.
//
// ENG NOZIK JOY. Ayirma TARTIB bilan olinadi: a dan b ni ayirish, aksincha
// emas. Tartib almashsa, ishora ham almashadi, va xulosa teskari chiqadi.
//
// DARSLIK. O'zbek darsligi, 11-§, 68-70-bet: ta'rif, 4/5 va 3/4 ni taqqoslash
// (1-namuna), 0,79 va 4/5 ni taqqoslash (2-namuna, ayirma manfiy).
//
// ADASHISHLAR: uchtasi yangi:
//   З49 — ayirma teskari tartibda olindi (b − a o'rniga a − b), xulosa teskari
//         chiqdi;
//   З50 — ishoraga qaramay, sonning "kattaligiga" qarab taqqoslandi;
//   З51 — 1/n kasrida n ortganda natija ham ortadi deb o'ylandi;
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
  id: 'alg-8-23',
  n: 23,
  row: 26,
  block: 'Б4',
  topic: L(
    'Sonli tengsizliklar',
    'Числовые неравенства',
    'Numerical inequalities',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "a − b ayirma musbat bo'lsa, a son b sondan katta, ya'ni a > b",
    'Если разность a минус b положительна, то a больше b, то есть a > b',
    'If the difference a minus b is positive, then a is greater than b, that is a > b',
  ),
  L(
    "a − b ayirma manfiy bo'lsa, a son b sondan kichik, ya'ni a < b",
    'Если разность a минус b отрицательна, то a меньше b, то есть a < b',
    'If the difference a minus b is negative, then a is less than b, that is a < b',
  ),
  L(
    "taqqoslash ayirmaning ishorasiga qaraladi, sonlarning ko'rinishiga emas",
    'Сравнение смотрит на знак разности, а не на то, как выглядят сами числа',
    'Comparison looks at the sign of the difference, not at how the numbers themselves look',
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
  'З49': {
    what: L(
      "ayirma teskari tartibda olindi, shu sababli xulosa teskari chiqdi",
      'разность взята в обратном порядке, из-за чего вывод получился обратным',
      'the difference was taken in the reversed order, so the conclusion came out reversed',
    ),
    wrong: '4-5',
    at: 4,
  },
  'З50': {
    what: L(
      "ishoraga qaramay, son qanchalik katta ko'rinishiga qarab taqqoslandi",
      'сравнение сделано по тому, как велико число на вид, а не по знаку разности',
      'the comparison was made by how large the number looks, not by the sign of the difference',
    ),
    wrong: '3/4',
    at: 8,
  },
  'З51': {
    what: L(
      "1/n kasrida n ortganda natija ham ortadi deb o'ylandi",
      'предполагалось, что при увеличении n дробь 1/n тоже увеличивается',
      'it was assumed that as n grows, the fraction 1/n also grows',
    ),
    wrong: '0.2',
    at: 3,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: ikki juft son, qaysi biri kattaligini hisoblamasdan
// aytish mumkinmi. Yakun: 4/5 va 3/4, ayirma orqali 4/5 kattaroq.
// ============================================================
const SC_ASK = L('HISOBLAMASDAN AYTISH MUMKINMI', 'МОЖНО СКАЗАТЬ БЕЗ ВЫЧИСЛЕНИЙ', 'CAN YOU TELL WITHOUT CALCULATING')

const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="96" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fill={T.ink}>{'4/5'}</text>
      <text x="304" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fill={T.ink}>{'3/4'}</text>
      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="60" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="67" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
      <line x1="112" y1="128" x2="288" y2="128" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Ayirma orqali 4/5 kattaroq ekani chiqadi",
      'Через разность выходит, что 4/5 больше',
      'Through the difference it comes out that 4/5 is greater',
    )}>
      <text x="70" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink}>{'4/5 − 3/4'}</text>
      <path d="M138 26 L156 26 M150 20 L156 26 L150 32" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '500ms' }}>
        <text x="200" y="33" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.ok}>{'1/20'}</text>
      </g>
      <path d="M240 26 L258 26 M252 20 L258 26 L252 32" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '1000ms' }}>
        <text x="320" y="33" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.ok}>{'4/5 > 3/4'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1500ms' }}>
        <line x1="60" y1="72" x2="340" y2="72" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <circle cx="200" cy="72" r="4.4" fill={T.ok}/>
        <text x="200" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>0</text>
        <circle cx="230" cy="72" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
        <text x="230" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>{'1/20'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('QAYSI BIRI KATTAROQ', 'КОТОРОЕ БОЛЬШЕ', 'WHICH IS GREATER'),
  title: L(
    "To'rtdan besh va to'rtdan uch, qaysi biri kattaroq",
    'Четыре пятых и три четверти, что больше',
    'Four fifths and three quarters, which is greater',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki kasr. Ikkalasi ham birga yaqin.",
      'Две дроби. Обе близки к единице.',
      'Two fractions. Both are close to one.'),
    A('why',
      "Taxmin qiling, hisoblamasdan qaysi biri kattaroq deyish mumkinmi.",
      'Предположи, можно ли сказать, какая больше, без вычислений.',
      'Predict whether you can tell which is greater without calculating.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, hisoblamasdan aytish mumkinmi?",
      'Как думаешь, можно сказать без вычислений?',
      'Do you think you can tell without calculating?',
    ),
    items: [
      { id: 'yes', show: L('Ha, ko\'rinib turadi', 'Да, это видно', 'Yes, it is visible') },
      { id: 'no', show: L('Yo\'q, hisoblash kerak', 'Нет, нужно вычислить', 'No, calculation is needed') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Umumiy maxrajga keltirish (7-sinf). Shu tayanch
// 5, 9 va 13-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Umumiy maxrajga keltirish",
    'Приведение к общему знаменателю',
    'Bringing to a common denominator',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida ayirma umumiy maxrajga to'g'ri keltirilgan.",
      'Четыре записи. Только в одной разность верно приведена к общему знаменателю.',
      'Four records. Only one correctly brings the difference to a common denominator.'),
    A('why',
      "Har ikki kasrni yigirmadan qilib qaytadan tekshiring.",
      'Проверь заново, приведя обе дроби к двадцатым.',
      'Check again by converting both fractions to twentieths.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuvda umumiy maxrajga keltirish to'g'ri?",
      'В какой записи приведение к общему знаменателю верно?',
      'In which record is the conversion to a common denominator correct?',
    ),
    items: [
      { id: 'right', show: '4/5 − 3/4 = 16/20 − 15/20', right: true, name: L("orqaga tekshirildi", 'проверено обратно', 'checked back') },
      {
        id: 'wrongnum', show: '4/5 − 3/4 = 16/20 − 12/20',
        hint: L(
          "Uchdan to'rtni yigirmadan qilsak, o'n besh chiqadi, o'n ikki emas, chunki bu uch karra besh.",
          'Три четверти в двадцатых даёт пятнадцать, а не двенадцать, ведь это три умножить на пять.',
          'Three quarters in twentieths gives fifteen, not twelve, since it is three times five.',
        ),
      },
      {
        id: 'wrongden', show: '4/5 − 3/4 = 8/10 − 6/8',
        hint: L(
          "Ikki kasr uchun IKKITA xil maxraj qoldi, ular teng bo'lishi kerak edi.",
          'У двух дробей остались ДВА разных знаменателя, они должны были стать одинаковыми.',
          'The two fractions kept TWO different denominators, but they needed to become equal.',
        ),
      },
      {
        id: 'order', show: '3/4 − 4/5 = 15/20 − 16/20',
        hint: L(
          "Bu ayirma teskari tartibda, dars davomida a minus b tartibi kerak bo'ladi.",
          'Эта разность в обратном порядке, по ходу урока нужен порядок a минус b.',
          'This difference is in the reversed order; the lesson needs the order a minus b.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Yigirmadan qilib olingan, va tartib to'g'ri, to'rtdan besh minus to'rtdan uch tartibida.",
      'Верно. Приведено к двадцатым, и порядок верный, четыре пятых минус три четверти.',
      'Correct. Converted to twentieths, and the order is right, four fifths minus three quarters.',
    ),
  },
}

// ============================================================
// EKRAN 3. N NI BURANG (1-darsning `steppers`). 1/n ni kuzatish: n ortganda
// natija KAMAYADI, bu З51 ning to'g'ridan-to'g'ri qarama-qarshisi.
// ============================================================
const S3 = {
  eyebrow: L('N NI BURANG', 'КРУТИ N', 'TURN N'),
  title: L(
    "Bittadan n ulush",
    'Одна n-ая доля',
    'One n-th part',
  ),
  audio: [
    A('mount',
      "N bo'linadigan qismlar soni bo'lsin. Natija bir bo'lingan n ga teng.",
      'Пусть n будет числом частей деления. Результат равен единице, делённой на n.',
      'Let n be the number of parts. The result equals one divided by n.'),
    A('why',
      "Uch maqsad beriladi. n ning turli qiymatlarida natijani toping.",
      'Даны три цели. Находи результат при разных значениях n.',
      'Three targets are given. Find the result at different values of n.'),
    A('why',
      "Oxirida n ni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти n до нуля и посмотри, что будет.',
      'At the end bring n down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'n', label: L('n ning qiymati', 'значение n', 'the value of n'),
        start: 20, min: 0, max: 20, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : Math.round((1 / v[0]) * 100) / 100),
    resultLabel: L('1/n', '1/n', '1/n'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "n hali nolga tushmasin, avval maqsadlarni oling.",
      'n пока не опускай до нуля, сначала возьми цели.',
      'Do not bring n down to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: 0.1,
        ask: L("Natija 0,1 ga teng bo'lsin", 'Пусть результат будет равен 0,1', 'Make the result equal 0.1'),
        after: L(
          "0,1. Bir o'ndan bo'lingan bitta ulush.",
          '0,1. Одна доля, делённая на десять.',
          '0.1. One part divided by ten.',
        ),
      },
      {
        value: 0.25,
        ask: L("Endi natija 0,25 ga teng bo'lsin", 'Теперь пусть результат будет равен 0,25', 'Now make the result equal 0.25'),
        after: L(
          "0,25. To'rtdan bo'lingan bitta ulush.",
          '0,25. Одна доля, делённая на четыре.',
          '0.25. One part divided by four.',
        ),
      },
      {
        value: 0.5,
        ask: L("Oxirgisi, natija 0,5 ga teng bo'lsin", 'Последняя, пусть результат будет равен 0,5', 'The last one, make the result equal 0.5'),
        after: L(
          "0,5. Ikkiga bo'lingan bitta ulush.",
          '0,5. Одна доля, делённая на два.',
          '0.5. One part divided by two.',
        ),
      },
    ],
    ask: L("Natija 0,1 ga teng bo'lsin", 'Пусть результат будет равен 0,1', 'Make the result equal 0.1'),
    ask2: L("Endi n ni nolga tushiring", 'Теперь опусти n до нуля', 'Now bring n down to zero'),
    broke: L(
      "n nol bo'lganda natija yo'q, chunki nolga bo'lish mumkin emas.",
      'При n равном нулю результата нет, потому что делить на нуль нельзя.',
      'With n equal to zero there is no result, because dividing by zero is not possible.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI XULOSA TO'G'RI (1-darsning `pick`). Ловушка — tartib va
// ishora aralashadi.
// ============================================================
const S4 = {
  eyebrow: L('AYIRMA NIMA DEYDI', 'ЧТО ГОВОРИТ РАЗНОСТЬ', 'WHAT THE DIFFERENCE SAYS'),
  title: L(
    "5 minus 8 ayirmasidan qaysi xulosa to'g'ri",
    'Какой вывод верен из разности 5 минус 8',
    'Which conclusion follows from the difference 5 minus 8',
  ),
  audio: [
    A('mount',
      "5 minus 8 hisoblanadi. Natija manfiy chiqadi.",
      'Вычисляется пять минус восемь. Результат выходит отрицательным.',
      'Five minus eight is computed. The result comes out negative.'),
    A('why',
      "Ayirma manfiy bo'lsa, birinchi son ikkinchisidan kichik.",
      'Если разность отрицательна, первое число меньше второго.',
      'If the difference is negative, the first number is smaller than the second.'),
  ],
  props: {
    ask: L(
      "5 − 8 = −3 dan qaysi xulosa to'g'ri?",
      'Какой вывод верен из 5 минус 8 равно минус 3?',
      'Which conclusion follows from 5 minus 8 equals negative 3?',
    ),
    items: [
      { id: 'right', show: '5 < 8', right: true, name: L("ayirma manfiy", 'разность отрицательна', 'the difference is negative') },
      {
        id: 'reverse', show: '5 > 8',
        hint: L("Ayirma manfiy, demak birinchi son KICHIK, katta emas.", 'Разность отрицательна, значит первое число МЕНЬШЕ, а не больше.', 'The difference is negative, so the first number is SMALLER, not greater.'),
      },
      {
        id: 'abs', show: '8 < 5',
        hint: L("Bu sonlarning o'zini solishtirish, ayirmaning ishorasi teskarisini beradi.", 'Это сравнение самих чисел даёт вывод, обратный знаку разности.', 'Comparing the numbers themselves gives the conclusion opposite to the sign of the difference.'),
      },
      {
        id: 'equal', show: '5 = 8',
        hint: L("Ayirma nolga teng emas, u minus uchga teng, demak sonlar teng emas.", 'Разность не равна нулю, она равна минус трём, значит числа не равны.', 'The difference is not zero, it equals negative three, so the numbers are not equal.'),
      },
    ],
    after: L(
      "To'g'ri. Ayirma manfiy, shuning uchun besh sakkizdan kichik.",
      'Верно. Разность отрицательна, поэтому пять меньше восьми.',
      'Correct. The difference is negative, so five is less than eight.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — AYIRMA USULI (`twosides`). Xukdagi
// taqqoslash shu yerda to'liq yechiladi: darslik 1-namunasi (68-bet).
// ============================================================
const S5 = {
  eyebrow: L('TAQQOSLAYMIZ', 'СРАВНИВАЕМ', 'WE COMPARE'),
  title: L(
    "To'rtdan besh va to'rtdan uchni ayirma orqali taqqoslash",
    'Сравнить четыре пятых и три четверти через разность',
    'Compare four fifths and three quarters through the difference',
  ),
  audio: [
    A('mount',
      "Xukdagi ikki kasr. Ularning ayirmasini topamiz.",
      'Две дроби с хука. Найдём их разность.',
      'The two fractions from the hook. We find their difference.'),
    A('why',
      "Amal ikkala qismga birdan qo'llanadi. Qadamni tanlang.",
      'Действие применяется сразу к обеим частям. Выбери шаг.',
      'The action applies to both sides at once. Choose the step.'),
    W('a2',
      "Ikkinchi qadamda ayirma bajarildi.",
      'На втором шаге разность вычислена.',
      'In the second step the subtraction was carried out.'),
  ],
  props: {
    from: -1,
    to: 1,
    start: { left: '4/5 − 3/4', rel: '=', right: '?', set: null },
    steps: [
      {
        ask: L('Nima qilamiz?', 'Что делаем?', 'What do we do?'),
        actions: [
          {
            id: 'common', right: true,
            label: L("Ikkalasini yigirmadan qilish", 'Привести обе к двадцатым', 'Convert both to twentieths'),
            to: { left: '16/20 − 15/20', rel: '=', right: '?' },
          },
          {
            id: 'straight',
            label: L("Suratlarni to'g'ridan-to'g'ri ayirish", 'Вычесть числители напрямую', 'Subtract the numerators directly'),
            hint: L(
              "Maxrajlar har xil, avval ularni bir xil qilish kerak.",
              'Знаменатели разные, сначала их нужно сделать одинаковыми.',
              'The denominators differ; they must first be made equal.',
            ),
          },
        ],
      },
      {
        ask: L('Endi nima qilamiz?', 'Что теперь?', 'And now?'),
        actions: [
          {
            id: 'sub', right: true,
            label: L('Ayirishni bajarish', 'Выполнить вычитание', 'Carry out the subtraction'),
            to: { left: '1/20', rel: '=', right: '0' },
          },
          {
            id: 'add',
            label: L("Qo'shishni bajarish", 'Выполнить сложение', 'Carry out an addition'),
            hint: L(
              "Bu yerda ayirma so'ralgan, qo'shish emas.",
              'Здесь спрашивалась разность, а не сложение.',
              'A difference was asked for here, not a sum.',
            ),
          },
        ],
      },
      {
        ask: L("Ayirma qanday ishorali? Xulosa qanday?", 'Какой знак у разности? Каков вывод?', 'What is the sign of the difference? What is the conclusion?'),
        actions: [
          {
            id: 'pos', right: true,
            label: L("Musbat, demak to'rtdan besh kattaroq", 'Положительная, значит четыре пятых больше', 'Positive, so four fifths is greater'),
            to: { left: '4/5', rel: '>', right: '3/4' },
            set: { gt: 0.75 },
            note: L(
              "Ayirma musbat, shuning uchun to'rtdan besh to'rtdan uchdan kattaroq.",
              'Разность положительна, поэтому четыре пятых больше трёх четвертей.',
              'The difference is positive, so four fifths is greater than three quarters.',
            ),
          },
          {
            id: 'neg',
            label: L("Manfiy, demak to'rtdan besh kichikroq", 'Отрицательная, значит четыре пятых меньше', 'Negative, so four fifths is smaller'),
            counter: { at: '1/20', gives: '> 0', verdict: L('musbat, kichik emas', 'положительно, не меньше', 'positive, not smaller') },
            hint: L(
              "Bir bo'lingan yigirma musbat son, manfiy emas.",
              'Одна двадцатая положительное число, не отрицательное.',
              'One twentieth is a positive number, not negative.',
            ),
          },
        ],
      },
    ],
    note: L(
      "To'rtdan besh to'rtdan uchdan kattaroq: 4/5 > 3/4.",
      'Четыре пятых больше трёх четвертей: 4/5 > 3/4.',
      'Four fifths is greater than three quarters: 4/5 > 3/4.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): 0,79 va 4/5 ni taqqoslash
// (darslik 2-namunasi, 69-bet).
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "0,79 va to'rtdan to'rtni ikki yo'l bilan taqqoslash",
    'Сравнить 0,79 и четыре пятых двумя способами',
    'Comparing 0.79 and four fifths two ways',
  ),
  audio: [
    A('mount',
      "Bitta juft son va ikki yo'l. Ikkalasi ham bir xil javob beradi.",
      'Одна пара чисел и два пути. Оба дают один ответ.',
      'One pair of numbers and two ways. Both give the same answer.'),
    W('w2',
      "Birinchi yo'lda ayirma hisoblanadi.",
      'В первом пути вычисляется разность.',
      'In the first way the difference is computed.'),
    W('w4',
      "Ikkinchi yo'lda to'rtdan to'rt o'nlik kasrga aylantiriladi.",
      'Во втором пути четыре пятых переводится в десятичную дробь.',
      'In the second way four fifths is converted to a decimal.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL — AYIRMA', 'СПОСОБ 1 — РАЗНОСТЬ', 'METHOD 1 — THE DIFFERENCE'),
        lead: L(
          "0,79 dan 4/5 ni ayirish uchun 4/5 ni 0,8 ga aylantiramiz",
          'Чтобы вычесть 4/5 из 0,79, переводим 4/5 в 0,8',
          "To subtract 4/5 from 0.79, we convert 4/5 to 0.8",
        ),
        rows: [
          { text: '0,79 − 0,8' },
          { text: '−0,01', tone: 'ok', note: L('manfiy', 'отрицательно', 'negative') },
        ],
      },
      {
        name: L('2-USUL — O\'NLIK KASR', 'СПОСОБ 2 — ДЕСЯТИЧНАЯ ДРОБЬ', 'METHOD 2 — DECIMAL FORM'),
        lead: L(
          "4/5 ni bo'lib chiqamiz va raqamma-raqam solishtiramiz",
          'Делим 4/5 и сравниваем цифру за цифрой',
          'We divide 4/5 and compare digit by digit',
        ),
        rows: [
          { text: '4/5 = 0,80' },
          { text: L("0,79 kichikroq, chunki o'ndan bir xonasi 7 < 8", '0,79 меньше, потому что в разряде десятых 7 < 8', '0.79 is smaller, because in the tenths place 7 is less than 8'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Ayirma tezroq, o'nlik kasr esa ko'zga ko'rinadigan taqqoslash",
          'Разность быстрее, а десятичная дробь — наглядное сравнение',
          'The difference is faster, the decimal form is a visible comparison',
        ),
        rows: [{ text: L('0,79 kichikroq', '0,79 меньше', '0.79 is smaller'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): nega ayirma usuli ishlaydi —
// sonlar to'g'ri chiziqda, ayirma ularning masofasi va yo'nalishi.
// ============================================================
const S7 = {
  eyebrow: L('AYIRMA NIMANI KO\'RSATADI', 'ЧТО ПОКАЗЫВАЕТ РАЗНОСТЬ', 'WHAT THE DIFFERENCE SHOWS'),
  title: L(
    "Nega ayirmaning ishorasi taqqoslaydi",
    'Почему знак разности сравнивает числа',
    'Why the sign of the difference compares numbers',
  ),
  audio: [
    A('mount',
      "To'g'ri chiziqda har bir son o'z o'rnida turadi.",
      'На числовой прямой каждое число стоит на своём месте.',
      'On the number line, every number stands in its own place.'),
    W('p2',
      "a son b sondan o'ngda tursa, a kattaroq, va a minus b musbat chiqadi.",
      'Если a стоит правее b, то a больше, и a минус b выходит положительным.',
      'If a stands to the right of b, then a is greater, and a minus b comes out positive.'),
    W('p4',
      "a son b sondan chapda tursa, a kichikroq, va a minus b manfiy chiqadi.",
      'Если a стоит левее b, то a меньше, и a минус b выходит отрицательным.',
      'If a stands to the left of b, then a is smaller, and a minus b comes out negative.',
    ),
  ],
  props: {
    tokens: [
      { t: 'a', id: 'a' },
      { t: ' − ', id: 'sign' },
      { t: 'b', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qadam. Har bir son to'g'ri chiziqda o'z o'rnida turadi.",
          'Первый шаг. Каждое число стоит на числовой прямой на своём месте.',
          'Step one. Each number stands in its own place on the number line.',
        ),
      },
      {
        focus: 'sign',
        text: L(
          "Ikkinchi qadam. a b dan o'ngda bo'lsa, ayirma musbat, a kattaroq.",
          'Второй шаг. Если a правее b, разность положительна, a больше.',
          'Step two. If a is to the right of b, the difference is positive, a is greater.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qadam. a b dan chapda bo'lsa, ayirma manfiy, a kichikroq.",
          'Третий шаг. Если a левее b, разность отрицательна, a меньше.',
          'Step three. If a is to the left of b, the difference is negative, a is smaller.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Kichik va katta belgilari, ya'ni < va >, ingliz matematigi Tomas Xarriot tomonidan o'n yettinchi asrda kiritilgan.",
        'Знаки меньше и больше, то есть < и >, ввёл английский математик Томас Гарриот в семнадцатом веке.',
        'The less-than and greater-than signs, < and >, were introduced by the English mathematician Thomas Harriot in the seventeenth century.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 11-§, 68-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Sonli tengsizlik ta'rifi",
    'Определение числового неравенства',
    'The definition of a numerical inequality',
  ),
  audio: [
    A('mount',
      "Ta'rif uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для определения, ты уже видел. Теперь собери его.',
      'Everything the definition needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik ta'rifi ochildi, va xukdagi qarz to'landi.",
      'Открылось определение из учебника, и долг с хука оплачен.',
      'The textbook definition opened, and the debt from the hook is paid.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("a minus b ayirma musbat bo'lsa", 'если разность a минус b положительна', 'if the difference a minus b is positive') },
      { id: 'f2', label: L("a son b sondan katta bo'ladi", 'то a больше b', 'then a is greater than b') },
      { id: 'f3', label: L("a minus b ayirma manfiy bo'lsa", 'если разность a минус b отрицательна', 'if the difference a minus b is negative') },
      { id: 'f4', label: L("a son b sondan kichik bo'ladi", 'то a меньше b', 'then a is less than b') },
      { id: 'w1', label: L("a son doim b sondan katta bo'ladi", 'a всегда больше b', 'a is always greater than b') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Xulosa ayirmaning ISHORASIGA bog'liq, doim emas.",
      'Так не складывается. Вывод зависит от ЗНАКА разности, а не всегда одинаков.',
      'That does not fit. The conclusion depends on the SIGN of the difference, not always the same.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 11-§, 68-bet",
        'Учебник, § 11, стр. 68',
        'Textbook, section 11, page 68',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "To'rtdan besh va to'rtdan uchni hali taqqoslay olmaymiz",
        'Четыре пятых и три четверти мы пока не сравниваем',
        'We still cannot compare four fifths and three quarters',
      ),
      right: L(
        "endi ayirma orqali taqqoslaymiz, sonning ko'rinishiga qaramay",
        'теперь сравниваем через разность, не глядя на то, как число выглядит',
        'now we compare through the difference, without looking at how the number looks',
      ),
      winner: 'right',
      note: L(
        "Ayirma ishlaydi, son qanchalik katta ko'rinishi shart emas",
        'Разность работает, не важно, каким большим число кажется',
        'The difference works, it does not matter how large the number looks',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): ayirmaning ishorasidan taqqoslash.
// ============================================================
const ASK_SIGN = L('Ayirma qaysi ishorali?', 'Какой знак у разности?', 'What is the sign of the difference?')
const ASK_CMP = L('Qaysi taqqoslash to\'g\'ri?', 'Какое сравнение верно?', 'Which comparison is correct?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ayirmaning ishorasini toping",
    'Найди знак разности',
    'Find the sign of the difference',
  ),
  audio: [
    A('mount',
      "Besh juft son. Har birida ayirma hisoblanadi.",
      'Пять пар чисел. В каждой вычисляется разность.',
      'Five pairs of numbers. In each, the difference is computed.'),
    A('why',
      "Ishora aniqlansa, taqqoslash o'zi chiqadi.",
      'Как только знак найден, сравнение получается само.',
      'Once the sign is found, the comparison follows on its own.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar ishora taqqoslashni bergan.",
      'Все пять разобраны. Каждый раз знак давал сравнение.',
      'All five are done. Each time the sign gave the comparison.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'7 − 5'}</Row>,
        ok: L("Ha. Musbat, demak yetti beshdan kattaroq.", 'Да. Положительно, значит семь больше пяти.', 'Yes. Positive, so seven is greater than five.'),
        question: ASK_SIGN,
        items: [
          { id: 'a', right: true, label: L('Musbat', 'Положительная', 'Positive') },
          { id: 'b', label: L('Manfiy', 'Отрицательная', 'Negative'), hint: L("Yetti beshdan katta, ayirma manfiy bo'lolmaydi.", 'Семь больше пяти, разность не может быть отрицательной.', 'Seven is greater than five, the difference cannot be negative.') },
        ],
        solution: ['7 − 5', '2', L('musbat, 7 > 5', 'положительно, 7 > 5', 'positive, 7 > 5')],
      },
      {
        expr: <Row size="big" align="center">{'3 − 9'}</Row>,
        ok: L("Ha. Manfiy, demak uch to'qqizdan kichikroq.", 'Да. Отрицательно, значит три меньше девяти.', 'Yes. Negative, so three is less than nine.'),
        question: ASK_SIGN,
        items: [
          { id: 'a', right: true, label: L('Manfiy', 'Отрицательная', 'Negative') },
          { id: 'b', label: L('Musbat', 'Положительная', 'Positive'), hint: L("Uch to'qqizdan kichik, ayirma manfiy chiqadi.", 'Три меньше девяти, разность выходит отрицательной.', 'Three is less than nine, the difference comes out negative.') },
        ],
        solution: ['3 − 9', '−6', L('manfiy, 3 < 9', 'отрицательно, 3 < 9', 'negative, 3 < 9')],
      },
      {
        expr: <Row size="big" align="center">{'−2 − (−5)'}</Row>,
        ok: L("Ha. Musbat, demak minus ikki minus beshdan kattaroq.", 'Да. Положительно, значит минус два больше минус пяти.', 'Yes. Positive, so negative two is greater than negative five.'),
        question: ASK_SIGN,
        items: [
          { id: 'a', right: true, label: L('Musbat', 'Положительная', 'Positive') },
          { id: 'b', label: L('Manfiy', 'Отрицательная', 'Negative'), hint: L("Minus ikkini minus beshdan ayirish, minus ikki qo'shilgan besh, bu uch.", 'Минус два минус минус пять равно минус два плюс пять, то есть три.', 'Negative two minus negative five is negative two plus five, which is three.') },
        ],
        solution: ['−2 − (−5)', '3', L('musbat, −2 > −5', 'положительно, −2 > −5', 'positive, −2 > −5')],
      },
      {
        expr: <Row size="big" align="center">{'5/6 − 7/9'}</Row>,
        ok: L("Ha. Musbat, demak oltidan besh to'qqizdan yettidan kattaroq.", 'Да. Положительно, значит пять шестых больше семи девятых.', 'Yes. Positive, so five sixths is greater than seven ninths.'),
        question: ASK_SIGN,
        items: [
          { id: 'a', right: true, label: L('Musbat', 'Положительная', 'Positive') },
          { id: 'b', label: L('Manfiy', 'Отрицательная', 'Negative'), hint: L("O'n sakkizdan qilib solishtirsak, o'n besh o'n to'rtdan katta.", 'Приведя к восемнадцатым, пятнадцать больше четырнадцати.', 'Converting to eighteenths, fifteen is greater than fourteen.') },
        ],
        solution: ['5/6 − 7/9', '15/18 − 14/18', L('musbat, 5/6 > 7/9', 'положительно, 5/6 > 7/9', 'positive, 5/6 > 7/9')],
      },
      {
        expr: <Row size="big" align="center">{'0,4 − 2/5'}</Row>,
        ok: L("Ha. Nolga teng, demak sonlar teng.", 'Да. Равно нулю, значит числа равны.', 'Yes. Equal to zero, so the numbers are equal.'),
        question: ASK_SIGN,
        items: [
          { id: 'a', right: true, label: L('Nolga teng', 'Равна нулю', 'Equal to zero') },
          { id: 'b', label: L('Musbat', 'Положительная', 'Positive'), hint: L("Ikkidan besh o'nlik kasrda 0,4 ning o'ziga teng.", 'Две пятых в виде десятичной дроби равна ровно 0,4.', 'Two fifths as a decimal equals exactly 0.4.') },
        ],
        solution: ['0,4 − 2/5', '0,4 − 0,4', L('nolga teng, 0,4 = 2/5', 'равно нулю, 0,4 = 2/5', 'equal to zero, 0.4 = 2/5')],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): ayirmadan taqqoslash yozuvi.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ayirmadan taqqoslash yozuvini toping",
    'Найди запись сравнения из разности',
    'Find the comparison record from the difference',
  ),
  audio: [
    A('mount',
      "Uch ayirma. Har biridan taqqoslash yozuvi kerak.",
      'Три разности. Из каждой нужна запись сравнения.',
      'Three differences. Each needs a comparison record.'),
    A('why',
      "Ishora aniq, endi tartibga ahamiyat bering.",
      'Знак ясен, теперь обрати внимание на порядок.',
      'The sign is clear, now pay attention to the order.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ishora tartibli yozuvga aylandi.",
      'Все три разобраны. Каждый раз знак превращался в упорядоченную запись.',
      'All three are done. Each time the sign turned into an ordered record.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'12 − 8 = 4'}</Row>,
        ok: L("Ha. Musbat, demak o'n ikki sakkizdan kattaroq.", 'Да. Положительно, значит двенадцать больше восьми.', 'Yes. Positive, so twelve is greater than eight.'),
        question: ASK_CMP,
        items: [
          { id: 'a', right: true, label: '12 > 8' },
          { id: 'b', label: '8 > 12', hint: L("Ayirma o'n ikki minus sakkiz tartibida olindi, o'n ikki oldin turadi.", 'Разность взята в порядке двенадцать минус восемь, двенадцать стоит первым.', 'The difference was taken as twelve minus eight, so twelve comes first.') },
        ],
        solution: ['12 − 8 = 4', L('musbat', 'положительно', 'positive'), '12 > 8'],
      },
      {
        expr: <Row size="big" align="center">{'6 − 15 = −9'}</Row>,
        ok: L("Ha. Manfiy, demak olti o'n beshdan kichikroq.", 'Да. Отрицательно, значит шесть меньше пятнадцати.', 'Yes. Negative, so six is less than fifteen.'),
        question: ASK_CMP,
        items: [
          { id: 'a', right: true, label: '6 < 15' },
          { id: 'b', label: '15 < 6', hint: L("Ayirma olti minus o'n besh tartibida, olti oldin turadi.", 'Разность в порядке шесть минус пятнадцать, шесть стоит первым.', 'The difference is in the order six minus fifteen, so six comes first.') },
        ],
        solution: ['6 − 15 = −9', L('manfiy', 'отрицательно', 'negative'), '6 < 15'],
      },
      {
        expr: <Row size="big" align="center">{'−3 − (−3) = 0'}</Row>,
        ok: L("Ha. Nolga teng, demak sonlar teng.", 'Да. Равно нулю, значит числа равны.', 'Yes. Equal to zero, so the numbers are equal.'),
        question: ASK_CMP,
        items: [
          { id: 'a', right: true, label: '−3 = −3' },
          { id: 'b', label: '−3 > −3', hint: L("Ayirma aynan nol, bu tenglik, katta emas.", 'Разность равна нулю, это равенство, а не больше.', 'The difference is exactly zero, that is equality, not greater.') },
        ],
        solution: ['−3 − (−3) = 0', L('nolga teng', 'равно нулю', 'equal to zero'), '−3 = −3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): taqqoslashni ayirma
// bilan tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Taqqoslashni son bilan tekshirish",
    'Проверка сравнения числом',
    'Checking the comparison with a number',
  ),
  audio: [
    A('mount',
      "Uch taqqoslash taklif qilinadi. Har birini ayirma bilan tekshiring.",
      'Предложены три сравнения. Каждое проверь через разность.',
      'Three comparisons are proposed. Check each one via the difference.'),
    A('why',
      "Ayirmani hisoblab, ishorasi taklif bilan mos kelishini ko'ring.",
      'Вычисли разность и посмотри, совпадает ли знак с предложением.',
      'Compute the difference and see whether the sign matches the claim.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ayirma taklifni tekshirib berdi.",
      'Все три разобраны. Каждый раз разность проверяла предложение.',
      'All three are done. Each time the difference checked the claim.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'9 > 4'}</Row>,
        ok: L("Ha. To'qqiz minus to'rt besh, musbat, to'g'ri.", 'Да. Девять минус четыре пять, положительно, верно.', 'Yes. Nine minus four is five, positive, correct.'),
        question: L("Bu taqqoslash to'g'rimi?", 'Верно ли это сравнение?', 'Is this comparison correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("To'qqiz minus to'rt musbat chiqadi.", 'Девять минус четыре выходит положительным.', 'Nine minus four comes out positive.') },
        ],
        solution: ['9 − 4', '5', L('musbat, to\'g\'ri', 'положительно, верно', 'positive, correct')],
      },
      {
        expr: <Row size="big" align="center">{'2 > 7'}</Row>,
        ok: L("Yo'q. Ikki minus yetti manfiy, taqqoslash xato.", 'Нет. Два минус семь отрицательно, сравнение неверно.', 'No. Two minus seven is negative, the comparison is wrong.'),
        question: L("Bu taqqoslash to'g'rimi?", 'Верно ли это сравнение?', 'Is this comparison correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Ikki minus yetti manfiy chiqadi, demak ikki yettidan kichik.", 'Два минус семь выходит отрицательным, значит два меньше семи.', 'Two minus seven comes out negative, so two is less than seven.') },
        ],
        solution: ['2 − 7', '−5', L('manfiy, xato', 'отрицательно, неверно', 'negative, wrong')],
      },
      {
        expr: <Row size="big" align="center">{'−1 < 1/2'}</Row>,
        ok: L("Ha. Minus bir minus ikkidan bir manfiy, to'g'ri.", 'Да. Минус один минус одна вторая отрицательно, верно.', 'Yes. Negative one minus one half is negative, correct.'),
        question: L("Bu taqqoslash to'g'rimi?", 'Верно ли это сравнение?', 'Is this comparison correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Har qanday manfiy son har qanday musbat sondan kichik.", 'Любое отрицательное число меньше любого положительного.', 'Any negative number is less than any positive number.') },
        ],
        solution: ['−1 − 1/2', '−3/2', L('manfiy, to\'g\'ri', 'отрицательно, верно', 'negative, correct')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): ayirma teskari
// tartibda olingan (З49).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ayirma qaysi tartibda olindi",
    'В каком порядке взята разность',
    'In which order the difference was taken',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham ayirma teskari tartibda olingan.",
      'Два задания. В обоих разность взята в обратном порядке.',
      'Two tasks. In both, the difference was taken in the reversed order.'),
    A('why',
      "Tartib almashsa, ishora ham almashadi, va xulosa teskari chiqadi.",
      'Если порядок меняется, меняется и знак, и вывод получается обратным.',
      'If the order changes, the sign changes too, and the conclusion comes out reversed.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Tartib almashsa, xulosa ham almashadi.",
      'Оба разобраны. При смене порядка меняется и вывод.',
      'Both are done. Changing the order changes the conclusion too.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'9 − 4 = 5'}</Row>,
        ok: L("Ha. To'qqiz minus to'rt hisoblangan, lekin savol to'rt va to'qqizni taqqoslaydi.", 'Да. Посчитано девять минус четыре, но вопрос сравнивает четыре и девять.', 'Yes. Nine minus four was computed, but the question compares four and nine.'),
        question: L("4 va 9 uchun to'g'ri xulosa qaysi?", 'Какой вывод верен для 4 и 9?', 'Which conclusion is correct for 4 and 9?'),
        items: [
          { id: 'a', right: true, label: '4 < 9' },
          { id: 'b', label: '4 > 9', hint: L("Bu ko'rsatilgan xato tartibning o'zi, to'qqiz minus to'rt hisoblangan, savol esa to'rtdan boshlanadi.", 'Это и есть показанный ошибочный порядок, посчитано девять минус четыре, а вопрос начинается с четырёх.', 'This is the very mistaken order shown, nine minus four was computed, but the question starts from four.') },
        ],
        solution: ['4 − 9', '−5', '4 < 9'],
      },
      {
        expr: <Row size="big" align="center">{'−6 − (−2) = −4'}</Row>,
        ok: L("Ha. Minus olti minus minus ikki hisoblangan, savol esa minus ikki bilan boshlanadi.", 'Да. Посчитано минус шесть минус минус два, а вопрос начинается с минус двух.', 'Yes. Negative six minus negative two was computed, but the question starts from negative two.'),
        question: L("−2 va −6 uchun to'g'ri xulosa qaysi?", 'Какой вывод верен для −2 и −6?', 'Which conclusion is correct for −2 and −6?'),
        items: [
          { id: 'a', right: true, label: '−2 > −6' },
          { id: 'b', label: '−2 < −6', hint: L("Bu ko'rsatilgan xato tartibning o'zi, minus olti minus minus ikki hisoblangan.", 'Это и есть показанный ошибочный порядок, посчитано минус шесть минус минус два.', 'This is the very mistaken order shown, negative six minus negative two was computed.') },
        ],
        solution: ['−2 − (−6)', '4', '−2 > −6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH (1-darsning `fill`): ayirma usulini qadamlab yozish.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Ayirma usulini qadamlab yozing",
    'Запиши способ разности по шагам',
    'Write the difference method step by step',
  ),
  audio: [
    A('mount',
      "Ikki kasr berilgan. Umumiy maxrajga keltirib, ayirmani toping.",
      'Даны две дроби. Приведи к общему знаменателю и найди разность.',
      'Two fractions are given. Bring them to a common denominator and find the difference.'),
    A('why',
      "Ishorasi aniqlanganda, taqqoslash o'zi chiqadi.",
      'Как только знак найден, сравнение получается само.',
      'Once the sign is found, the comparison follows on its own.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar umumiy maxraj ayirmani, ayirma esa taqqoslashni bergan.",
      'Все три заполнены. Каждый раз общий знаменатель давал разность, а разность — сравнение.',
      'All three are filled. Each time the common denominator gave the difference, and the difference gave the comparison.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['20', '1', '>'],
      lines: [
        [{ t: '3/4 − 2/5 = 15/20 − 8/20 = 7/' }, { slot: '20' }],
        [{ t: '7/20 ' }, { slot: '>' }, { t: ' 0,   3/4 ' }, { slot: '>' }, { t: ' 2/5' }],
      ],
    },
    tasks: [
      {
        chips: ['12', '5', '>'],
        lines: [
          [{ t: '5/6 − 3/4 = 10/12 − 9/' }, { slot: '12' }, { t: ' = 1/12' }],
          [{ t: '1/12 ' }, { slot: '>' }, { t: ' 0,   5/6 ' }, { slot: '>' }, { t: ' 3/4' }],
        ],
      },
      {
        chips: ['15', '−1', '<'],
        lines: [
          [{ t: '2/5 − 3/5 = 6/15 − 9/' }, { slot: '15' }, { t: ' = ' }, { slot: '−1' }, { t: '/5' }],
          [{ t: '−1/5 ' }, { slot: '<' }, { t: ' 0,   2/5 ' }, { slot: '<' }, { t: ' 3/5' }],
        ],
      },
      {
        chips: ['18', '1', '>'],
        lines: [
          [{ t: '5/6 − 7/9 = 15/18 − 14/' }, { slot: '18' }, { t: ' = ' }, { slot: '1' }, { t: '/18' }],
          [{ t: '1/18 ' }, { slot: '>' }, { t: ' 0,   5/6 ' }, { slot: '>' }, { t: ' 7/9' }],
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
    "Ta'rif bo'yicha to'rt savol",
    'Четыре вопроса об определении',
    'Four questions about the definition',
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
        id: 'q1', tag: 'З50',
        ask: L('6/7 va 5/6 dan qaysi biri kattaroq?', 'Какая из дробей больше: 6/7 или 5/6?', 'Which fraction is greater, 6/7 or 5/6?'),
        options: [
          { id: 'ok', right: true, label: '6/7' },
          { id: 'other', label: '5/6' },
          { id: 'equal', label: L('Teng', 'Равны', 'Equal') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Qirq ikkidan qilib solishtirsang, oltmish ikki elliktdan katta.", 'Приведя к сорока двум, шестьдесят два больше пятидесяти пяти.', 'Converting to forty-seconds, sixty-two is greater than fifty-five.'),
        ok: L("To'g'ri, ayirma musbat chiqadi.", 'Верно, разность выходит положительной.', 'Correct, the difference comes out positive.'),
      },
      {
        id: 'q2', tag: 'З49',
        ask: L('5 − 11 = −6 dan qaysi taqqoslash to\'g\'ri?', 'Какое сравнение верно из 5 минус 11 равно минус 6?', 'Which comparison follows from 5 minus 11 equals negative 6?'),
        options: [
          { id: 'ok', right: true, label: '5 < 11' },
          { id: 'reverse', label: '5 > 11' },
          { id: 'abs', label: '11 < 5' },
          { id: 'equal', label: '5 = 11' },
        ],
        hint: L("Ayirma manfiy, birinchi son ikkinchisidan kichik.", 'Разность отрицательна, первое число меньше второго.', 'The difference is negative, the first number is smaller than the second.'),
        ok: L("To'g'ri, manfiy ayirma kichikroq degani.", 'Верно, отрицательная разность значит меньше.', 'Correct, a negative difference means smaller.'),
      },
      {
        id: 'q3', tag: 'З51',
        ask: L('1/8 va 1/3 dan qaysi biri kattaroq?', 'Какая из дробей больше: 1/8 или 1/3?', 'Which fraction is greater, 1/8 or 1/3?'),
        options: [
          { id: 'ok', right: true, label: '1/3' },
          { id: 'other', label: '1/8' },
          { id: 'equal', label: L('Teng', 'Равны', 'Equal') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Bo'linadigan qism kamroq bo'lsa, ulush kattaroq chiqadi.", 'Чем меньше частей деления, тем больше доля.', 'The fewer parts something is divided into, the larger the part.'),
        ok: L("To'g'ri, uchdan bir sakkizdan birdan kattaroq.", 'Верно, одна треть больше одной восьмой.', 'Correct, one third is greater than one eighth.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('7 > 4 taqqoslash ayirma bilan tekshirilganmi?', 'Проверено ли сравнение 7 > 4 разностью?', 'Was the comparison 7 > 4 checked with the difference?'),
        options: [
          { id: 'ok', right: true, label: L('Ha, yetti minus to\'rt musbat', 'Да, семь минус четыре положительно', 'Yes, seven minus four is positive') },
          { id: 'no', label: L("Yo'q, ko'rinishidan aytilgan", 'Нет, сказано на вид', 'No, it was said just by appearance') },
        ],
        hint: L("Yetti minus to'rt uch, musbat, taqqoslash tasdiqlanadi.", 'Семь минус четыре три, положительно, сравнение подтверждается.', 'Seven minus four is three, positive, confirming the comparison.'),
        ok: L("To'g'ri, ayirma tasdiqladi.", 'Верно, разность подтвердила.', 'Correct, the difference confirmed it.'),
      },
      {
        id: 'q5', tag: 'З49',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "8 minus 3 ayirmasini toping va taqqoslash belgisini qo'ying.",
            'Найди разность восемь минус три и поставь знак сравнения.',
            'Find the difference eight minus three and put the comparison sign.',
          ),
          lines: [
            [{ t: '8 − 3 = ' }, { slot: '5' }, { t: ',   8 ' }, { slot: '>' }, { t: ' 3' }],
          ],
          tiles: [
            { id: 't1', v: '5', x: 12, y: 12 },
            { id: 't2', v: '>', x: 70, y: 14 },
            { id: 't3', v: '−5', x: 40, y: 50 },
            { id: 't4', v: '<', x: 78, y: 48 },
          ],
          hint: L(
            "Sakkiz minus uch besh, musbat, demak sakkiz uchdan kattaroq.",
            'Восемь минус три пять, положительно, значит восемь больше трёх.',
            'Eight minus three is five, positive, so eight is greater than three.',
          ),
          doneNote: L(
            "Yig'ildi. Musbat ayirma katta belgisini beradi.",
            'Собрано. Положительная разность даёт знак больше.',
            'Assembled. A positive difference gives the greater-than sign.',
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
    "Taqqoslash ayirmaning ishorasiga qaraladi",
    'Сравнение смотрит на знак разности',
    'Comparison looks at the sign of the difference',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. To'rtdan besh minus to'rtdan uch teng bir bo'lingan yigirma, musbat.",
      'С урока остаётся одна запись. Четыре пятых минус три четверти равно одной двадцатой, положительно.',
      'One record stays with you. Four fifths minus three quarters equals one twentieth, positive.'),
    A('s1',
      "Bugun uch narsa qilindi. Ayirma usulini ko'rdingiz, ishorasiga qarab taqqosladingiz va tartibning ahamiyatini ko'rdingiz.",
      'Сегодня сделано три вещи. Ты увидел способ разности, сравнил по знаку и увидел важность порядка.',
      'Three things are done today. You saw the difference method, compared by sign, and saw why order matters.'),
    A('s2',
      "Keyingi darsda tengsizlikning asosiy xossalari. Manfiy songa ko'paytirishda nima bo'lishini ko'rasiz.",
      'В следующем уроке основные свойства неравенств. Увидишь, что происходит при умножении на отрицательное число.',
      'The next lesson covers the basic properties of inequalities. You will see what happens when multiplying by a negative number.',
    ),
  ],
  props: {
    mark: '4/5 − 3/4 = 1/20 > 0',
    markNote: L(
      "musbat ayirma: 4/5 > 3/4",
      'положительная разность: 4/5 > 3/4',
      'positive difference: 4/5 > 3/4',
    ),
    lines: [
      L(
        "a − b musbat bo'lsa, a > b",
        'Если a минус b положительно, то a > b',
        'If a minus b is positive, then a > b',
      ),
      L(
        "a − b manfiy bo'lsa, a < b",
        'Если a минус b отрицательно, то a < b',
        'If a minus b is negative, then a < b',
      ),
      L(
        "ayirma tartib bilan olinadi: a minus b, aksincha emas",
        'разность берётся по порядку: a минус b, а не наоборот',
        'the difference is taken in order: a minus b, not the other way around',
      ),
    ],
    bridge: L(
      "Keyingi dars: tengsizliklarning asosiy xossalari",
      'Следующий урок: основные свойства неравенств',
      'Next lesson: the basic properties of inequalities',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — AYIRMA USULI (`twosides`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З51', 'З49', 'З49',
    'З50', 'З50', 'З49', 'З50', 'З49',
    'З16', 'З49', 'З50', null, null,
  ],
  mechanic: { at: 5, tool: 'twosides', kind: 'difference' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
