// ============================================================================
// 8-sinf, Dars 11. ARIFMETIK KVADRAT ILDIZNING XOSSALARI.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx` va `math.jsx` da.
//
// KARKAS. Ekranlarni sinf karkasi yig'adi: o'n to'rt pozitsiyada 1-darsning
// asboblari, bitta pozitsiyada — blokning mexanikasi (metodist qarori
// 2026-08-21, o'n foiz).
//
// MEXANIKA SIFATIDA shu darsda `transform` va WhyStep turadi, 5-ekran. Sabab
// oddiy: bu darsda o'quvchi yozuvni QAYTA YOZADI, va har qadamda «nima
// asosida» degan savolga javob beradi. Lupa yoki ikki tomon bu ishni
// bajarmaydi — ular qiymatni ko'rsatadi, xossani qo'llamaydi.
// Darslar rejasidagi tanlov ham shu (11-13-darslar uchun `Transform` +
// `WhyStep`), va u shu darsning matematikasiga to'g'ri keladi.
//
// UCHTA XOSSA, VA UCHINCHISI SANOQSIZ ISHLATILADI:
//   1) (√a)² = a, faqat a nomanfiy bo'lganda — kvadrat ildizni «yechadi»;
//   2) √(a²) = |a|, har qanday a uchun — 10-darsdan, endi xossa sifatida;
//   3) a kichik bo'lsa ildizi ham kichik — ildizlarni HISOBLAMASDAN taqqoslash.
//
// Ikki xossaning FARQI shu darsning eng nozik joyi: √(a²) har qanday a da
// ma'noga ega, (√a)² esa faqat a nomanfiy bo'lganda. 4-ekrandagi jadval shuni
// bitta qarashda ko'rsatadi.
//
// DARSLIK. O'zbek darsligi, 8-§, 39-bet — arifmetik ildiz ta'rifi (n = 2).
// Xossalar alohida bo'lim bo'lib turmaydi, ular darsda ta'rifdan chiqariladi.
//
// ADASHISHLAR: З16, З31, З32 — oldingi darslardan. YANGI bittasi:
//   З33 — ildizlarni taqqoslaganda kvadratlarga o'tilmadi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { SceneBand, rootPath } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'
import { UI, buildScreens } from './karkas.js'

export const META = {
  id: 'alg-8-11',
  n: 11,
  row: 12,
  block: 'Б2',
  topic: L(
    'Arifmetik kvadrat ildizning xossalari',
    'Свойства арифметического квадратного корня',
    'The properties of the arithmetic square root',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Kvadratga oshirish ildizni yechadi, lekin faqat ildiz osti nomanfiy bo'lganda",
    'Возведение в квадрат снимает корень, но только когда подкоренное неотрицательно',
    'Squaring undoes the root, but only when the radicand is non-negative',
  ),
  L(
    "√(a²) har qanday a da ma'noga ega, (√a)² esa faqat a nomanfiy bo'lganda",
    'Запись √(a²) имеет смысл при любом a, а (√a)² только при неотрицательном a',
    'The record √(a²) makes sense for any a, while (√a)² only for non-negative a',
  ),
  L(
    "Ildiz osti katta bo'lsa ildiz ham katta, shuning uchun ildizlarni hisoblamasdan taqqoslash mumkin",
    'Больше подкоренное — больше корень, поэтому корни можно сравнивать без вычисления',
    'A bigger radicand means a bigger root, so roots can be compared without computing',
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
    at: 0,
  },
  'З31': {
    what: L(
      "kvadratdan ildiz sonning o'zi deb olindi, modul tushib qoldi",
      'корень из квадрата принят за само число, модуль потерян',
      'the root of a square was taken for the number itself, the modulus was lost',
    ),
    wrong: 'sqrt((0-3)^2)',
    at: 3,
  },
  'З32': {
    what: L(
      'ildiz ostidagi ifodaning sharti tekshirilmadi',
      'условие подкоренного выражения не проверено',
      'the condition on the radicand was not checked',
    ),
    wrong: 'sqrt(0-4)',
    at: 0,
  },
  'З33': {
    what: L(
      "ildizlar taqqoslanganda kvadratlarga o'tilmadi",
      'при сравнении корней не переходили к квадратам',
      'the comparison of roots did not go through the squares',
    ),
    wrong: null,
    at: 17,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: √17 va 4, qaysi biri katta. Yakun: o'sha ikki son,
// javobi bilan — 16 dan 17 katta, demak ildizi ham katta.
// ============================================================
const SC_BIG = L('QAYSI BIRI KATTA', 'ЧТО БОЛЬШЕ', 'WHICH IS GREATER')

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "O'n yettidan ildiz va to'rt",
      'Корень из семнадцати и четыре',
      'The root of seventeen and four',
    )}>
      <path d={rootPath(70, 74, 52)} fill="none" stroke={T.ink} strokeWidth="2.6"
        pathLength="1" className="g8-draw"/>
      <text x="118" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="23"
        fill={T.ink}>17</text>

      <g className="g8-seat" style={{ '--d': '2600ms' }}>
        <circle cx="200" cy="74" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="81" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="272" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="23"
        fill={T.ink}>4</text>

      <text x="200" y="128" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_BIG)}</text>
      <line x1="136" y1="138" x2="264" y2="138" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

// YAKUN: 16 dan 17 katta, demak ildizi ham katta. Hisoblash kerak emas.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Ildiz osti katta, ildiz ham katta",
    'Больше подкоренное — больше корень',
    'A bigger radicand, a bigger root',
  )}>
    <text x="60" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
      fill={T.ink}>{'16 < 17'}</text>
    <path d="M104 28 L122 28 M116 22 L122 28 L116 34" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
    <g className="g8-seat" style={{ '--d': '500ms' }}>
      <text x="182" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'√16 < √17'}</text>
    </g>
    <path d="M240 28 L258 28 M252 22 L258 28 L252 34" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
    <g className="g8-seat" style={{ '--d': '900ms' }}>
      <text x="316" y="35" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18"
        fontWeight="700" fill={T.ok}>{'4 < √17'}</text>
    </g>

    <g className="g8-seat" style={{ '--d': '1300ms' }}>
      <line x1="60" y1="70" x2="340" y2="70" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
      <circle cx="150" cy="70" r="4.4" fill={T.ok}/>
      <circle cx="196" cy="70" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
      <text x="150" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
        fill={T.ink3}>4</text>
      <text x="212" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
        fill={T.tip}>{'√17'}</text>
      <text x="300" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
        fill={T.ink3}>5</text>
      <circle cx="288" cy="70" r="4.4" fill={T.ok}/>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('QAYSI KATTA', 'ЧТО БОЛЬШЕ', 'WHICH IS GREATER'),
  title: L(
    "√17 va 4 — qaysi biri katta",
    'Корень из 17 и 4 — что больше',
    'The root of 17 and 4 — which is greater',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki son. Birinchisi ildiz ostida, ikkinchisi butun.",
      'Два числа. Первое под корнем, второе целое.',
      'Two numbers. The first is under a root, the second is whole.'),
    A('why',
      "Taxmin qiling, qaysi biri katta. Hisoblash kerak emas.",
      'Предположи, какое больше. Вычислять не нужно.',
      'Predict which one is greater. No computing needed.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, qaysi biri katta?",
      'Как думаешь, какое больше?',
      'Which one do you think is greater?',
    ),
    items: [
      { id: 'root', show: '√17' },
      { id: 'four', show: '4' },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Taqqoslashning dvigateli — kvadratlar TARTIBI: son katta
// bo'lsa kvadrati ham katta. O'quvchi XATO yozuvni topadi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    'Kvadratlar tartibi',
    'Порядок квадратов',
    'The order of squares',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Uchtasi to'g'ri, bittasi xato.",
      'Четыре записи. Три верные, одна ошибочная.',
      'Four records. Three are true, one is false.'),
    A('why',
      "Xato yozuvni toping. Nomanfiy sonlar orasida son katta bo'lsa kvadrati ham katta.",
      'Найди ошибочную. Среди неотрицательных чисел чем больше само число, тем больше его квадрат.',
      'Find the false one. Among non-negative numbers, a bigger number has a bigger square.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuv xato?",
      'Какая запись ошибочная?',
      'Which record is false?',
    ),
    items: [
      {
        id: 'ok34',
        show: '3² < 4²',
        name: L('9 < 16', '9 < 16', '9 < 16'),
        hint: L(
          "To'qqiz o'n oltidan kichik, demak yozuv to'g'ri.",
          'Девять меньше шестнадцати, значит запись верная.',
          'Nine is less than sixteen, so the record is true.',
        ),
      },
      {
        id: 'bad54',
        show: '5² < 4²',
        right: true,
        name: L('25 < 16', '25 < 16', '25 < 16'),
      },
      {
        id: 'ok01',
        show: '0² < 1²',
        name: L('0 < 1', '0 < 1', '0 < 1'),
        hint: L(
          "Nol birdan kichik, kvadratlari ham shunday.",
          'Нуль меньше единицы, и квадраты ведут себя так же.',
          'Zero is less than one, and the squares behave the same.',
        ),
      },
      {
        id: 'ok109',
        show: '10² > 9²',
        name: L('100 > 81', '100 > 81', '100 > 81'),
        hint: L(
          "Yuz sakson birdan katta, demak yozuv to'g'ri.",
          'Сто больше восьмидесяти одного, значит запись верная.',
          'One hundred is more than eighty one, so the record is true.',
        ),
      },
    ],
    after: L(
      "Ha. Besh to'rtdan katta, shuning uchun kvadrati ham katta bo'lishi kerak.",
      'Да. Пять больше четырёх, поэтому и квадрат должен быть больше.',
      'Yes. Five is greater than four, so its square must be greater too.',
    ),
  },
}

// ============================================================
// EKRAN 3. KVADRATGA OSHIRISH ILDIZNI YECHADI (1-darsning `steppers`
// asbobi). Natija ustuni har safar a ning O'ZINI beradi — birinchi xossa
// shundoq ko'rinadi. Manfiy a da esa qiymat yo'q (З32).
// ============================================================
const S3 = {
  eyebrow: L('ORQAGA QAYTISH', 'ОБРАТНЫЙ ХОД', 'THE WAY BACK'),
  title: L(
    "(√a)² ni burang",
    'Крути (√a)²',
    'Turn (√a)²',
  ),
  audio: [
    A('mount',
      "Ildizni oldik, keyin kvadratga oshirdik. Natija ustuniga qarang.",
      'Взяли корень, потом возвели в квадрат. Смотри на столбец результата.',
      'We took the root, then squared it. Watch the result column.'),
    A('why',
      "Uch maqsad beriladi. Natija aytilgan songa teng bo'lsin.",
      'Даны три цели. Пусть результат будет равен названному числу.',
      'Three targets are given. Make the result equal the number named.'),
    A('why',
      "Oxirida a ni minusga olib boring va nima bo'lishini ko'ring.",
      'В конце уведи a в минус и посмотри, что будет.',
      'At the end take a into the negatives and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'a',
        label: L('a ning qiymati', 'значение a', 'the value of a'),
        start: 3, min: -3, max: 12, step: 1,
        risky: true,
      },
    ],
    // Natija YOZUVDAN sanaladi: avval ildiz, keyin kvadrat. Manfiy a da
    // ildiz yo'q, demak butun yozuvning qiymati yo'q.
    calc: (v) => (v[0] < 0 ? null : Math.round(Math.pow(Math.sqrt(v[0]), 2) * 100) / 100),
    resultLabel: L('(√a)²', '(√a)²', '(√a)²'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "Nolda ham ishlaydi, ildiz nol, kvadrati ham nol.",
      'На нуле тоже работает, корень нуль и квадрат нуль.',
      'It works at zero as well, the root is zero and the square is zero.',
    ),
    goals: [
      {
        value: 5,
        ask: L(
          "Natija 5 ga teng bo'lsin",
          'Пусть результат будет равен 5',
          'Make the result equal 5',
        ),
        after: L(
          "Besh. Natija a ning o'ziga teng chiqdi.",
          'Пять. Результат вышел равен самому a.',
          'Five. The result came out equal to a itself.',
        ),
      },
      {
        value: 9,
        ask: L(
          "Endi natija 9 ga teng bo'lsin",
          'Теперь пусть результат будет равен 9',
          'Now make the result equal 9',
        ),
        after: L(
          "To'qqiz. Yana o'sha son, ya'ni kvadratga oshirish ildizni yechdi.",
          'Девять. Снова то же число, то есть возведение в квадрат сняло корень.',
          'Nine. The same number again, so squaring undid the root.',
        ),
      },
      {
        value: 0,
        ask: L(
          "Oxirgisi, natija nolga teng bo'lsin",
          'Последняя, пусть результат будет равен 0',
          'The last one, make the result equal 0',
        ),
        after: L(
          "Nol. Bu chegara, undan pastda nima bo'lishini ko'ramiz.",
          'Нуль. Это граница, посмотрим, что будет ниже неё.',
          'Zero. That is the boundary; let us see what happens below it.',
        ),
      },
    ],
    ask: L(
      "Natija 5 ga teng bo'lsin",
      'Пусть результат будет равен 5',
      'Make the result equal 5',
    ),
    ask2: L(
      "Endi a ni kamaytiring",
      'Теперь уменьши a',
      'Now decrease a',
    ),
    broke: L(
      "a manfiy, ildiz yo'q, demak butun yozuvning qiymati yo'q. Shuning uchun xossa shartli, a nomanfiy bo'lishi kerak.",
      'a отрицательно, корня нет, значит и у всей записи значения нет. Поэтому свойство условное, a должно быть неотрицательным.',
      'a is negative, the root does not exist, so the whole record has no value. That is why the property is conditional, a must be non-negative.',
    ),
  },
}

// ============================================================
// EKRAN 4. IKKI YOZUVNING FARQI (1-darsning `pick` asbobi va PODSTANOVKA
// jadvali). √(a²) har qanday a da ishlaydi, (√a)² esa yo'q (З32).
// ============================================================
const S4 = {
  eyebrow: L('IKKI YOZUV', 'ДВЕ ЗАПИСИ', 'TWO RECORDS'),
  title: L(
    "Qaysi biri har qanday a da ishlaydi",
    'Какая работает при любом a',
    'Which one works for any a',
  ),
  audio: [
    A('mount',
      "Ikki yozuv o'xshash, lekin shartlari boshqa.",
      'Две записи похожи, но условия у них разные.',
      'The two records look alike but their conditions differ.'),
    A('why',
      "Qaysi biri har qanday a da ma'noga ega, shuni tanlang.",
      'Выбери ту, которая имеет смысл при любом a.',
      'Choose the one that makes sense for any a.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuv har qanday a da ma'noga ega?",
      'Какая запись имеет смысл при любом a?',
      'Which record makes sense for any a?',
    ),
    items: [
      {
        id: 'sqroot',
        show: '√(a²)',
        right: true,
        name: L('har qanday a', 'любое a', 'any a'),
      },
      {
        id: 'rootsq',
        show: '(√a)²',
        hint: L(
          "a manfiy bo'lsa ildiz yo'q, demak yozuvning qiymati ham yo'q.",
          'Если a отрицательно, корня нет, значит и у записи нет значения.',
          'If a is negative the root does not exist, so the record has no value.',
        ),
      },
      {
        id: 'both',
        show: L('Ikkalasi ham', 'Обе', 'Both'),
        hint: L(
          "Jadvalga qaraymiz. a minus uch bo'lganda ikkinchi yozuv qiymatsiz qoldi.",
          'Смотрим в таблицу. При a минус три вторая запись осталась без значения.',
          'Look at the table. At a equal to minus three the second record has no value.',
        ),
      },
      {
        id: 'none',
        show: L('Hech qaysi', 'Ни одна', 'Neither'),
        hint: L(
          "Birinchi yozuvda ildiz ostida kvadrat turibdi, u har doim nomanfiy.",
          'В первой записи под корнем квадрат, он всегда неотрицателен.',
          'In the first record a square stands under the root, and it is always non-negative.',
        ),
      },
    ],
    after: L(
      "Ha. Kvadrat ildiz ostida turganda shart o'zi bajariladi.",
      'Да. Когда квадрат стоит под корнем, условие выполняется само.',
      'Yes. When the square is under the root, the condition holds by itself.',
    ),
    proof: {
      varLabel: L('a', 'a', 'a'),
      leftLabel: L('√(a²)', '√(a²)', '√(a²)'),
      rightLabel: L('(√a)²', '(√a)²', '(√a)²'),
      noValue: L("qiymat yo'q", 'значения нет', 'no value'),
      rows: [
        { v: '4', left: '4', right: '4' },
        { v: '0', left: '0', right: '0' },
        { v: '−3', left: '3', right: null },
      ],
    },
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — QAYTA YOZISH VA ASOS (`transform` va
// WhyStep). Bu ekran 1-darsdan farq qiladigan YAGONA ekran.
//
// Ikki xossa ketma-ket ishlatiladi, va har qadamda ikki narsa so'raladi:
// AMAL va NIMA ASOSIDA. Javobni o'quvchi YOZADI, tanlamaydi.
// ============================================================
const S5 = {
  eyebrow: L('QAYTA YOZISH', 'ПЕРЕПИСАТЬ', 'REWRITE IT'),
  title: L(
    "Ikki xossa bitta yozuvda",
    'Два свойства в одной записи',
    'Two properties in one record',
  ),
  audio: [
    A('mount',
      "Yozuvda ikki had bor, va ularga boshqa boshqa xossa qo'llanadi. a manfiy deb berilgan.",
      'В записи два слагаемых, и к ним применяются разные свойства. Дано, что a отрицательно.',
      'The record has two terms, and different properties apply to them. It is given that a is negative.'),
    W('s2',
      "Birinchi had ochildi, chunki olti nomanfiy va kvadrat ildizni yechdi.",
      'Первое слагаемое раскрыто, потому что шесть неотрицательно и квадрат снял корень.',
      'The first term is opened because six is non-negative and the square undid the root.'),
    W('s3',
      "Ikkinchi hadda esa modul chiqadi, va a manfiy bo'lgani uchun modul minus a ga teng.",
      'Во втором слагаемом выходит модуль, и поскольку a отрицательно, модуль равен минус a.',
      'The second term gives the modulus, and since a is negative the modulus equals minus a.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {'(√6)² + √(a²),   a < 0'}
      </Row>
    ),
    actions: [
      { id: 'open', label: L("Kvadrat ildizni yechadi", 'Квадрат снимает корень', 'The square undoes the root') },
      { id: 'add', label: L("Ildiz ostilarini qo'shish", 'Сложить подкоренные', 'Add the radicands') },
      { id: 'sq', label: L("Ikkalasini kvadratga oshirish", 'Возвести оба в квадрат', 'Square both terms') },
      { id: 'mod', label: L("Kvadratdan modul chiqarish", 'Вынести модуль из квадрата', 'Take the modulus out of the square') },
    ],
    steps: [
      {
        action: 'open',
        wrongs: [
          {
            action: 'add',
            hint: L(
              "Ildiz ostilari qo'shilmaydi. Oltidan ildiz va a dan ildiz boshqa sonlar.",
              'Подкоренные не складываются. Корень из шести и корень из a это разные числа.',
              'Radicands are not added. The root of six and the root of a are different numbers.',
            ),
          },
          {
            action: 'sq',
            hint: L(
              "Yozuvni kvadratga oshirsak, u boshqa yozuv bo'lib qoladi.",
              'Если возвести запись в квадрат, она станет другой записью.',
              'Squaring the record turns it into a different record.',
            ),
          },
          {
            action: 'mod',
            hint: L(
              "Modul ikkinchi hadda kerak bo'ladi. Birinchi hadda kvadrat ildizning ustida turibdi.",
              'Модуль понадобится во втором слагаемом. В первом квадрат стоит над корнем.',
              'The modulus is needed in the second term. In the first the square sits above the root.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'p1',
              right: true,
              label: L(
                "(√a)² = a, a nomanfiy bo'lganda",
                '(√a)² = a при неотрицательном a',
                '(√a)² = a for non-negative a',
              ),
            },
            {
              id: 'p2',
              label: L('√(a²) = |a|', '√(a²) = |a|', '√(a²) = |a|'),
              hint: L(
                "Bu ikkinchi hadning xossasi. Birinchi hadda kvadrat tashqarida turibdi.",
                'Это свойство второго слагаемого. В первом квадрат стоит снаружи.',
                'That is the property of the second term. In the first the square is outside.',
              ),
            },
            {
              id: 'p3',
              label: L(
                "Ildiz osti katta bo'lsa ildiz ham katta",
                'Больше подкоренное — больше корень',
                'A bigger radicand means a bigger root',
              ),
              hint: L(
                "Bu taqqoslash uchun kerak. Bu yerda esa hech narsa taqqoslanmaydi.",
                'Это нужно для сравнения. А здесь ничего не сравнивают.',
                'That is needed for comparing. Nothing is being compared here.',
              ),
            },
          ],
        },
        ask: L(
          "Yozuv qanday bo'ldi? Yozing",
          'Что получилось? Запиши',
          'What came out? Write it down',
        ),
        answer: '6+sqrt(a^2)',
        accepts: ['sqrt(a^2)+6'],
        hints: {
          '6+a': L(
            "Ikkinchi hadga hali tegilmadi. Uning ildizi va kvadrati o'z joyida qoladi.",
            'Второе слагаемое пока не тронуто. Его корень и квадрат остаются на месте.',
            'The second term is untouched for now. Its root and square stay in place.',
          ),
          '6-a': L(
            "Bu keyingi qadamning javobi. Hozir faqat birinchi hadni yozing.",
            'Это ответ следующего шага. Сейчас запиши только первое слагаемое.',
            'That is the next step\'s answer. For now write only the first term.',
          ),
          '36+sqrt(a^2)': L(
            "Olti kvadratga oshirilmaydi, kvadrat ildizni yechadi.",
            'Шесть не возводят в квадрат, квадрат снимает корень.',
            'Six is not squared; the square undoes the root.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'(√6)² + √(a²) = 6 + √(a²)'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'modneg', label: L("Modulni minus a bilan yozish", 'Записать модуль как минус a', 'Write the modulus as minus a') },
          { id: 'modpos', label: L("Modulni a bilan yozish", 'Записать модуль как a', 'Write the modulus as a') },
          { id: 'drop', label: L("Modulni tashlab yuborish", 'Отбросить модуль', 'Drop the modulus') },
        ],
        action: 'modneg',
        wrongs: [
          {
            action: 'modpos',
            hint: L(
              "a manfiy, moduli esa nomanfiy bo'lishi kerak. Minus uchni tekshiring.",
              'a отрицательно, а модуль обязан быть неотрицательным. Проверь на минус трёх.',
              'a is negative, but a modulus must be non-negative. Check it at minus three.',
            ),
          },
          {
            action: 'drop',
            hint: L(
              "Modulni tashlasak, javob manfiy chiqadi, ildiz esa manfiy son bermaydi.",
              'Если отбросить модуль, ответ выйдет отрицательным, а корень отрицательного не даёт.',
              'Dropping the modulus makes the answer negative, but a root never gives a negative.',
            ),
          },
        ],
        why: {
          question: L(
            "Nima uchun minus a?",
            'Почему минус a?',
            'Why minus a?',
          ),
          items: [
            {
              id: 'neg',
              right: true,
              label: L(
                "a manfiy, minus a esa musbat",
                'a отрицательно, а минус a положительно',
                'a is negative, so minus a is positive',
              ),
            },
            {
              id: 'always',
              label: L(
                "Modul har doim minus bilan yoziladi",
                'Модуль всегда пишут с минусом',
                'A modulus is always written with a minus',
              ),
              hint: L(
                "Yo'q. a musbat bo'lganda moduli a ning o'ziga teng.",
                'Нет. При положительном a модуль равен самому a.',
                'No. For positive a the modulus equals a itself.',
              ),
            },
            {
              id: 'sign',
              label: L(
                "Ildiz belgisi minus beradi",
                'Знак корня даёт минус',
                'The root sign gives a minus',
              ),
              hint: L(
                "Ildiz belgisi hech qachon manfiy son bermaydi.",
                'Знак корня никогда не даёт отрицательного числа.',
                'The root sign never gives a negative number.',
              ),
            },
          ],
        },
        ask: L(
          "Yozuvni oxirigacha yozing",
          'Запиши до конца',
          'Write it to the end',
        ),
        answer: '6-a',
        accepts: ['6+(0-a)', '0-a+6'],
        hints: {
          '6+a': L(
            "a manfiy bo'lgani uchun uni qo'shsak javob kamayadi. Modul esa qo'shadi.",
            'Поскольку a отрицательно, прибавление уменьшит ответ. А модуль прибавляет.',
            'Since a is negative, adding it would shrink the answer. The modulus adds instead.',
          ),
          '6': L(
            "Ikkinchi had yo'qolmaydi, u minus a bo'lib qoladi.",
            'Второе слагаемое не исчезает, оно становится минус a.',
            'The second term does not vanish, it becomes minus a.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'6 + |a| = 6 − a,   a < 0'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways` asbobi): √17 va 4 ni taqqoslash.
// Birinchi yo'l kvadratlar orqali, ikkinchisi qo'shni kvadratlar orqali.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "√17 va 4 ni taqqoslash",
    'Сравнить √17 и 4',
    'Comparing √17 and 4',
  ),
  audio: [
    A('mount',
      "Bitta savol va ikki yo'l. Ikkalasi ham hisoblashsiz ishlaydi.",
      'Один вопрос и два пути. Оба работают без вычисления.',
      'One question and two ways. Both work without computing.'),
    W('w2',
      "Birinchi yo'lda to'rt ildiz ostiga kiritildi, keyin ildiz ostilari taqqoslandi.",
      'В первом пути четыре внесли под корень, потом сравнили подкоренные.',
      'In the first way the four is brought under the root, then the radicands are compared.'),
    W('w4',
      "Ikkinchi yo'lda ildiz qo'shni kvadratlar orasiga qo'yildi.",
      'Во втором пути корень поместили между соседними квадратами.',
      'In the second way the root is placed between neighbouring squares.'),
  ],
  props: {
    stepMs: 1400,
    blocks: [
      {
        name: L('1-USUL — ILDIZ OSTIGA', 'СПОСОБ 1 — ПОД КОРЕНЬ', 'METHOD 1 — UNDER THE ROOT'),
        lead: L(
          "Butun sonni ildiz ostiga kiritamiz va ildiz ostilarini taqqoslaymiz",
          'Вносим целое число под корень и сравниваем подкоренные',
          'We bring the whole number under the root and compare the radicands',
        ),
        rows: [
          { text: '4 = √16' },
          { text: '16 < 17   →   √16 < √17', tone: 'ok', note: L('javob', 'ответ', 'the answer') },
        ],
      },
      {
        name: L("2-USUL — QO'SHNI KVADRATLAR", 'СПОСОБ 2 — СОСЕДНИЕ КВАДРАТЫ', 'METHOD 2 — NEIGHBOURING SQUARES'),
        lead: L(
          "Ildizni ikki butun son orasiga qo'yamiz",
          'Помещаем корень между двумя целыми',
          'We place the root between two integers',
        ),
        rows: [
          { text: '16 < 17 < 25' },
          { text: '4 < √17 < 5', tone: 'ok', note: L('javob', 'ответ', 'the answer') },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Hisoblash kerak bo'lmadi, ildiz ostilari yetarli bo'ldi",
          'Вычислять не пришлось, хватило подкоренных',
          'No computing was needed, the radicands were enough',
        ),
        rows: [{ text: '4 < √17', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. YOZUVNI QISMLARGA AJRATAMIZ (1-darsning `parts` asbobi):
// xossaning uch qismi — yozuv, natija va SHART.
// ============================================================
const S7 = {
  eyebrow: L('QISMLARGA', 'ПО ЧАСТЯМ', 'PART BY PART'),
  title: L(
    "Xossaning uch qismi",
    'Три части свойства',
    'The three parts of a property',
  ),
  audio: [
    A('mount',
      "Xossa uch qismdan iborat, va uchinchisi eng ko'p tashlab ketiladi.",
      'Свойство состоит из трёх частей, и третью чаще всего забывают.',
      'A property has three parts, and the third is the one most often dropped.'),
    W('p2',
      "O'ng tomonda ildiz ham, kvadrat ham yo'q, faqat harfning o'zi qoldi.",
      'Справа нет ни корня, ни квадрата, осталась одна буква.',
      'On the right there is neither root nor square, only the letter is left.'),
    W('p3',
      "Shart esa xossaning bir qismi. U bo'lmasa yozuv manfiy sonlarda buziladi.",
      'А условие это часть свойства. Без него запись ломается на отрицательных числах.',
      'And the condition is part of the property. Without it the record breaks for negative numbers.'),
  ],
  props: {
    frac: {
      num: [{ t: '(√a)²', id: 'left' }, { t: '= a', id: 'right' }],
      den: [{ t: 'a ≥ 0', id: 'cond' }],
    },
    steps: [
      {
        focus: 'left',
        text: L(
          "Chap tomon. Avval ildiz olinadi, keyin natija kvadratga oshiriladi.",
          'Левая часть. Сначала берут корень, потом результат возводят в квадрат.',
          'The left side. First the root is taken, then the result is squared.',
        ),
      },
      {
        focus: 'right',
        text: L(
          "O'ng tomon. Ikki amal bir birini yo'q qildi, va harfning o'zi qoldi.",
          'Правая часть. Два действия уничтожили друг друга, и осталась сама буква.',
          'The right side. The two operations cancelled each other and the letter remains.',
        ),
      },
      {
        focus: 'cond',
        text: L(
          "Shart. a manfiy bo'lsa chap tomonda ildiz yo'q, demak tenglikning ham ma'nosi yo'q.",
          'Условие. При отрицательном a слева нет корня, значит и равенство теряет смысл.',
          'The condition. For negative a there is no root on the left, so the equality loses its meaning.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Ildiz ostidagi ifodani chiziq bilan ustidan yopishni 1637 yilda Dekart kiritgan, undan oldin qavs ishlatilgan.",
        'Черту над подкоренным выражением ввёл Декарт в 1637 году, до него обходились скобками.',
        'The bar over the radicand was introduced by Descartes in 1637; before him brackets were used.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild` asbobi). Yig'ilgan qoida xukdagi
// savolga javob beradi: 16 dan 17 katta, demak ildizi ham katta.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Uchta xossa",
    'Три свойства',
    'Three properties',
  ),
  audio: [
    A('mount',
      "Xossalar uchun kerak bo'lgan hamma narsani siz allaqachon qildingiz. Endi ularni yig'ing.",
      'Всё, что нужно для свойств, ты уже сделал руками. Теперь собери их.',
      'Everything the properties need is already done by your hands. Now assemble them.'),
    W('card',
      "Darslik matni ochildi, va xukdagi savol javobini oldi.",
      'Открылся текст учебника, и вопрос с хука получил ответ.',
      'The textbook wording opened, and the question from the hook has its answer.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("(√a)² = a", '(√a)² = a', '(√a)² = a') },
      { id: 'f2', label: L("a nomanfiy bo'lganda", 'когда a неотрицательно', 'when a is non-negative') },
      { id: 'f3', label: L("√(a²) = |a|", '√(a²) = |a|', '√(a²) = |a|') },
      { id: 'f4', label: L("har qanday a uchun", 'при любом a', 'for any a') },
      { id: 'w1', label: L("har qanday a uchun (√a)² = a", 'при любом a верно (√a)² = a', 'for any a we have (√a)² = a') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Jadvalda a minus uch bo'lganda ikkinchi yozuv qiymatsiz qoldi.",
      'Так не складывается. В таблице при a минус три вторая запись осталась без значения.',
      'That does not fit. In the table, at a equal to minus three the second record had no value.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        L(
          "(√a)² = a faqat a nomanfiy bo'lganda, √(a²) = |a| esa har qanday a uchun",
          'Равенство (√a)² = a верно только при неотрицательном a, а √(a²) = |a| при любом a',
          'The equality (√a)² = a holds only for non-negative a, while √(a²) = |a| holds for any a',
        ),
        STATEMENTS[2],
        L(
          "Shart xossaning bir qismi, uni tashlab ketish xossani buzadi",
          'Условие это часть свойства, отбросить его значит сломать свойство',
          'The condition is part of the property; dropping it breaks the property',
        ),
      ],
      source: L(
        "Darslik, 8-§, 39-bet (n = 2); xossalar darsda ta'rifdan chiqarildi",
        'Учебник, § 8, стр. 39 (n = 2); свойства выведены в уроке из определения',
        'Textbook, section 8, page 39 (n = 2); the properties are derived from the definition in the lesson',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L('√17 < 4', '√17 < 4', '√17 < 4'),
      right: L('√17 > 4', '√17 > 4', '√17 > 4'),
      winner: 'right',
      note: L(
        "O'n yetti o'n oltidan katta, demak ildizi ham katta",
        'Семнадцать больше шестнадцати, значит и корень больше',
        'Seventeen is greater than sixteen, so its root is greater too',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): birinchi xossa. Beshinchi
// topshiriqda shart buzilgan — javob «qiymat yo'q».
// ============================================================
const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    'Kvadrat ildizni yechadi',
    'Квадрат снимает корень',
    'The square undoes the root',
  ),
  audio: [
    A('mount',
      "Besh yozuv. Har javobdan keyin yechim ochiladi.",
      'Пять записей. После каждого ответа открывается решение.',
      'Five records. After each answer the solution opens.'),
    A('why',
      "Har safar avval shartni tekshiring, ildiz osti nomanfiymi.",
      'Каждый раз сначала проверь условие, неотрицательно ли подкоренное.',
      'Every time check the condition first, whether the radicand is non-negative.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Oxirgisida shart buzilgan edi.",
      'Все пять разобраны. В последней условие было нарушено.',
      'All five are done. In the last one the condition was broken.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'(√5)²'}</Row>,
        ok: L(
          "Ha. Besh nomanfiy, demak kvadrat ildizni yechdi.",
          'Да. Пять неотрицательно, значит квадрат снял корень.',
          'Yes. Five is non-negative, so the square undid the root.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '5' },
          { id: 'b', label: '25', hint: L("Yigirma besh beshning kvadrati, bizda esa ildiz ham bor.", 'Двадцать пять это квадрат пяти, а у нас есть ещё и корень.', 'Twenty five is the square of five, but we also have the root.') },
          { id: 'c', label: '√5', hint: L("Kvadrat ildizni yechdi, ildiz belgisi qolmaydi.", 'Квадрат снял корень, знак корня не остаётся.', 'The square undid the root; the sign does not stay.') },
        ],
        solution: ['5 ≥ 0', '(√5)² = 5'],
      },
      {
        expr: <Row size="big" align="center">{'(√11)²'}</Row>,
        ok: L(
          "Ha. Xossa har qanday nomanfiy sonda ishlaydi, butun bo'lishi shart emas.",
          'Да. Свойство работает при любом неотрицательном числе, целым быть не обязано.',
          'Yes. The property works for any non-negative number; it need not be whole.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '11' },
          { id: 'b', label: '121', hint: L("Bu o'n birning kvadrati, ildiz esa hisobga olinmadi.", 'Это квадрат одиннадцати, а корень не учтён.', 'That is the square of eleven, the root is ignored.') },
          { id: 'c', label: '3,3', hint: L("Bu ildizning taqribiy qiymati, kvadratga oshirish qoldi.", 'Это приближённое значение корня, возведение в квадрат осталось.', 'That is the approximate root; the squaring is still to come.') },
        ],
        solution: ['11 ≥ 0', '(√11)² = 11'],
      },
      {
        expr: <Row size="big" align="center">{'(√0)²'}</Row>,
        ok: L(
          "Ha. Nolda ildiz nol, kvadrati ham nol.",
          'Да. На нуле корень нуль, и квадрат нуль.',
          'Yes. At zero the root is zero and the square is zero.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: L("qiymat yo'q", 'значения нет', 'no value'), hint: L("Nol nomanfiy son, shart bajarilgan.", 'Нуль неотрицателен, условие выполнено.', 'Zero is non-negative, the condition holds.') },
          { id: 'c', label: '1', hint: L("Nolning ildizi nol, biru emas.", 'Корень нуля нуль, а не единица.', 'The root of zero is zero, not one.') },
        ],
        solution: ['0 ≥ 0', '(√0)² = 0'],
      },
      {
        expr: <Row size="big" align="center">{'(√7)² + (√2)²'}</Row>,
        ok: L(
          "Ha. Ikki hadda ham kvadrat ildizni yechdi, keyin yetti plyus ikki.",
          'Да. В обоих слагаемых квадрат снял корень, потом семь плюс два.',
          'Yes. In both terms the square undid the root, then seven plus two.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '9' },
          { id: 'b', label: '3', hint: L("Bu to'qqizdan ildiz. Bizda esa ildiz emas, yig'indi.", 'Это корень из девяти. А у нас не корень, а сумма.', 'That is the root of nine. But we have a sum, not a root.') },
          { id: 'c', label: '√9', hint: L("Ildiz belgisi qolmaydi, ikki had ham sonlarga aylandi.", 'Знак корня не остаётся, оба слагаемых стали числами.', 'The root sign does not remain, both terms became numbers.') },
        ],
        solution: ['(√7)² = 7', '(√2)² = 2', '7 + 2 = 9'],
      },
      {
        expr: <Row size="big" align="center">{'(√(−9))²'}</Row>,
        ok: L(
          "Ha. Shart buzilgan, ildiz ostida manfiy son turibdi.",
          'Да. Условие нарушено, под корнем стоит отрицательное число.',
          'Yes. The condition is broken, a negative number stands under the root.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: L("qiymat yo'q", 'значения нет', 'no value') },
          { id: 'b', label: '−9', hint: L("Xossa faqat nomanfiy ildiz ostida ishlaydi, bu yerda esa minus to'qqiz.", 'Свойство работает только при неотрицательном подкоренном, а здесь минус девять.', 'The property works only for a non-negative radicand, and here it is minus nine.') },
          { id: 'c', label: '9', hint: L("Ildizni olishning o'zi mumkin emas, kvadratga oshirishga navbat kelmaydi.", 'Само извлечение корня невозможно, до возведения в квадрат дело не доходит.', 'Taking the root is impossible in the first place; the squaring never happens.') },
        ],
        solution: ['−9 < 0', "√(−9) — qiymat yo'q"],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): ikki xossaning FARQI. Bir xil
// son beriladi, ikki yozuv so'raladi (З31, З32).
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ikki yozuv, bir xil harf",
    'Две записи, одна буква',
    'Two records, one letter',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida a berilgan, yozuv esa boshqa.",
      'Три задания. В каждом дано a, а запись другая.',
      'Three tasks. In each a is given, but the record differs.'),
    A('why',
      "Farqni ushlab turing. Kvadrat qayerda, ildiz ostidami yoki tashqaridami.",
      'Держи разницу. Где квадрат, под корнем или снаружи.',
      'Hold on to the difference. Where is the square, under the root or outside.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Kvadrat ildiz ostida bo'lsa shart o'zi bajariladi.",
      'Все три разобраны. Когда квадрат под корнем, условие выполняется само.',
      'All three are done. When the square is under the root, the condition holds by itself.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = −3,   √(a²)'}</Row>,
        ok: L(
          "Ha. Kvadrat ildiz ostida, shuning uchun qiymat bor va u uchga teng.",
          'Да. Квадрат под корнем, поэтому значение есть и равно трём.',
          'Yes. The square is under the root, so the value exists and equals three.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '−3', hint: L("Ildiz manfiy son bermaydi, javob moduli.", 'Корень не даёт отрицательного числа, ответ это модуль.', 'A root never gives a negative number; the answer is the modulus.') },
          { id: 'c', label: L("qiymat yo'q", 'значения нет', 'no value'), hint: L("Ildiz ostida to'qqiz turibdi, u nomanfiy.", 'Под корнем стоит девять, оно неотрицательно.', 'The radicand is nine, which is non-negative.') },
        ],
        solution: ['(−3)² = 9', '√9 = 3'],
      },
      {
        expr: <Row size="big" align="center">{'a = −3,   (√a)²'}</Row>,
        ok: L(
          "Ha. Ildiz ostida minus uch, ildiz yo'q, demak butun yozuvning qiymati yo'q.",
          'Да. Под корнем минус три, корня нет, значит и у всей записи значения нет.',
          'Yes. The radicand is minus three, there is no root, so the whole record has no value.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: L("qiymat yo'q", 'значения нет', 'no value') },
          { id: 'b', label: '−3', hint: L("Xossa faqat a nomanfiy bo'lganda ishlaydi, bu yerda a manfiy.", 'Свойство работает только при неотрицательном a, а здесь a отрицательно.', 'The property works only for non-negative a, and here a is negative.') },
          { id: 'c', label: '3', hint: L("Modul bu ikkinchi yozuvning javobi, bu yerda esa ildiz yo'q.", 'Модуль это ответ второй записи, а здесь корня нет.', 'The modulus is the answer for the other record; here there is no root at all.') },
        ],
        solution: ['−3 < 0', "√(−3) — qiymat yo'q"],
      },
      {
        expr: <Row size="big" align="center">{'a = 8,   √(a²) va (√a)²'}</Row>,
        ok: L(
          "Ha. a nomanfiy bo'lganda ikki yozuv bir xil javob beradi.",
          'Да. При неотрицательном a обе записи дают один ответ.',
          'Yes. For non-negative a both records give the same answer.',
        ),
        question: L('Javoblar qanday?', 'Каковы ответы?', 'What are the answers?'),
        items: [
          { id: 'a', right: true, label: L('Ikkalasi ham 8', 'Оба равны 8', 'Both equal 8') },
          { id: 'b', label: L('Birinchisi 8, ikkinchisi 64', 'Первая 8, вторая 64', 'The first 8, the second 64'), hint: L("Ikkinchi yozuvda kvadrat ildizni yechadi, sakson to'rt chiqmaydi.", 'Во второй записи квадрат снимает корень, шестьдесят четыре не выходит.', 'In the second record the square undoes the root; sixty four does not appear.') },
          { id: 'c', label: L("Birinchisi 8, ikkinchisi qiymatsiz", 'Первая 8, вторая без значения', 'The first 8, the second has no value'), hint: L("Sakkiz nomanfiy, demak ikkinchi yozuvning sharti bajarilgan.", 'Восемь неотрицательно, значит условие второй записи выполнено.', 'Eight is non-negative, so the condition of the second record holds.') },
        ],
        solution: ['√(8²) = 8', '(√8)² = 8'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`): HISOBLAMASDAN taqqoslash (З33).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    'Hisoblamasdan taqqoslang',
    'Сравни без вычисления',
    'Compare without computing',
  ),
  audio: [
    A('mount',
      "Uch juft son. Har safar butun sonni ildiz ostiga kiritish yetarli.",
      'Три пары чисел. Каждый раз хватает внести целое число под корень.',
      'Three pairs of numbers. Each time it is enough to bring the whole number under the root.'),
    A('why',
      "Ildiz olmang. Faqat ildiz ostilarini taqqoslang.",
      'Не извлекай корень. Сравнивай только подкоренные.',
      'Do not extract the root. Compare only the radicands.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Bir marta ham ildiz hisoblanmadi.",
      'Все три разобраны. Ни один корень не был вычислен.',
      'All three are done. Not a single root was computed.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√26   va   5'}</Row>,
        ok: L(
          "Ha. Besh bu yigirma beshdan ildiz, yigirma olti esa kattaroq.",
          'Да. Пять это корень из двадцати пяти, а двадцать шесть больше.',
          'Yes. Five is the root of twenty five, and twenty six is greater.',
        ),
        question: L('Qaysi biri katta?', 'Что больше?', 'Which is greater?'),
        items: [
          { id: 'a', right: true, label: '√26' },
          { id: 'b', label: '5', hint: L("Besh yigirma beshdan ildiz, ildiz ostilari esa yigirma olti va yigirma besh.", 'Пять это корень из двадцати пяти, а подкоренные двадцать шесть и двадцать пять.', 'Five is the root of twenty five, and the radicands are twenty six and twenty five.') },
          { id: 'c', label: L('Teng', 'Равны', 'Equal'), hint: L("Ildiz ostilari boshqa sonlar, demak ildizlar ham boshqa.", 'Подкоренные разные, значит и корни разные.', 'The radicands differ, so the roots differ too.') },
        ],
        solution: ['5 = √25', '25 < 26', '5 < √26'],
      },
      {
        expr: <Row size="big" align="center">{'√8   va   3'}</Row>,
        ok: L(
          "Ha. Uch bu to'qqizdan ildiz, sakkiz esa kichikroq.",
          'Да. Три это корень из девяти, а восемь меньше.',
          'Yes. Three is the root of nine, and eight is smaller.',
        ),
        question: L('Qaysi biri katta?', 'Что больше?', 'Which is greater?'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '√8', hint: L("Sakkiz to'qqizdan kichik, demak ildizi ham kichik.", 'Восемь меньше девяти, значит и корень меньше.', 'Eight is less than nine, so its root is smaller.') },
          { id: 'c', label: L('Teng', 'Равны', 'Equal'), hint: L("Teng bo'lishi uchun ildiz ostida to'qqiz turishi kerak edi.", 'Чтобы они были равны, под корнем должно стоять девять.', 'For them to be equal the radicand would have to be nine.') },
        ],
        solution: ['3 = √9', '8 < 9', '√8 < 3'],
      },
      {
        expr: <Row size="big" align="center">{'√99   va   10'}</Row>,
        ok: L(
          "Ha. O'n bu yuzdan ildiz, to'qson to'qqiz esa yuzdan kichik.",
          'Да. Десять это корень из ста, а девяносто девять меньше ста.',
          'Yes. Ten is the root of one hundred, and ninety nine is less than one hundred.',
        ),
        question: L('Qaysi biri katta?', 'Что больше?', 'Which is greater?'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '√99', hint: L("To'qson to'qqiz yuzdan kichik, demak ildizi o'ndan kichik.", 'Девяносто девять меньше ста, значит корень меньше десяти.', 'Ninety nine is less than one hundred, so its root is less than ten.') },
          { id: 'c', label: L('Teng', 'Равны', 'Equal'), hint: L("Yaqin, lekin teng emas, chunki ildiz ostilari boshqa.", 'Близко, но не равны, потому что подкоренные разные.', 'Close, but not equal, because the radicands differ.') },
        ],
        solution: ['10 = √100', '99 < 100', '√99 < 10'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): shartni tashlab ketish
// (З32). Ikki savol ketma ket, ikkinchisi harf bilan.
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Shart tashlab ketilganda",
    'Когда условие отброшено',
    'When the condition is dropped',
  ),
  audio: [
    A('mount',
      "Ikki savol. Ikkalasida ham xossa shartsiz yozilgan.",
      'Два вопроса. В обоих свойство записано без условия.',
      'Two questions. In both the property is written without its condition.'),
    A('why',
      "Har safar tekshiring, manfiy son qo'yilsa nima bo'ladi.",
      'Каждый раз проверяй, что будет, если подставить отрицательное число.',
      'Each time check what happens if a negative number is substituted.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Shart yozuvning bir qismi.",
      'Оба разобраны. Условие это часть записи.',
      'Both are done. The condition is part of the record.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'(√a)² = a'}</Row>,
        ok: L(
          "Ha. Bu tenglik faqat a nomanfiy bo'lganda to'g'ri.",
          'Да. Это равенство верно только при неотрицательном a.',
          'Yes. This equality is true only for non-negative a.',
        ),
        question: L('Qachon to\'g\'ri?', 'Когда верно?', 'When is it true?'),
        items: [
          { id: 'a', right: true, label: 'a ≥ 0' },
          { id: 'b', label: L('Har qanday a da', 'При любом a', 'For any a'), hint: L("a minus bir bo'lsa, chap tomonda ildiz yo'q.", 'При a равном минус одному слева нет корня.', 'At a equal to minus one there is no root on the left.') },
          { id: 'c', label: L('Faqat a nolda', 'Только при a равном нулю', 'Only at a equal to zero'), hint: L("To'rtda ham ishlaydi, chunki to'rt nomanfiy.", 'На четырёх тоже работает, потому что четыре неотрицательно.', 'It works at four too, because four is non-negative.') },
        ],
        solution: ['a ≥ 0', '(√a)² = a'],
      },
      {
        expr: <Row size="big" align="center">{'√(a²) = a'}</Row>,
        ok: L(
          "Ha. Manfiy a da chap tomon musbat, o'ng tomon manfiy, demak tenglik buziladi.",
          'Да. При отрицательном a слева положительное, справа отрицательное, значит равенство ломается.',
          'Yes. For negative a the left side is positive and the right side negative, so the equality breaks.',
        ),
        question: L('Qachon to\'g\'ri?', 'Когда верно?', 'When is it true?'),
        items: [
          { id: 'a', right: true, label: 'a ≥ 0' },
          { id: 'b', label: L('Har qanday a da', 'При любом a', 'For any a'), hint: L("a minus ikki bo'lsa chapda ikki, o'ngda minus ikki chiqadi.", 'При a равном минус двум слева выйдет два, а справа минус два.', 'At a equal to minus two the left gives two and the right minus two.') },
          { id: 'c', label: L('Hech qachon', 'Никогда', 'Never'), hint: L("a uch bo'lsa ikki tomon ham uchga teng.", 'При a равном трём обе части равны трём.', 'At a equal to three both sides equal three.') },
        ],
        solution: ['a ≥ 0   →   √(a²) = a', 'a < 0   →   √(a²) = −a'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill` asbobi):
// taqqoslash uch qadamda yoziladi.
// ============================================================
const S13 = {
  eyebrow: L('YOZUV', 'ЗАПИСЬ', 'THE RECORD'),
  title: L(
    'Taqqoslashni qadamlar bilan yozing',
    'Запиши сравнение по шагам',
    'Write the comparison step by step',
  ),
  audio: [
    A('mount',
      "Yechim yozilgan, lekin kataklar bo'sh. Ularni birma-bir to'ldiring.",
      'Решение записано, но клетки пустые. Заполняй их по одной.',
      'The solution is written but the cells are empty. Fill them one by one.'),
    A('why',
      "Yozuv ikki qadamdan iborat. Butun sonni ildiz ostiga kiritasiz, keyin ildiz ostilarini taqqoslaysiz.",
      'Запись состоит из двух шагов. Вносишь целое под корень, потом сравниваешь подкоренные.',
      'The record has two steps. You bring the whole number under the root, then compare the radicands.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Yozuv to'ldi. Bir marta ham ildiz hisoblanmadi.",
      'Запись заполнена. Ни один корень не был вычислен.',
      'The record is filled. Not a single root was computed.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['36', '<', '6'],
      lines: [
        [{ t: '6 = √' }, { slot: '36' }],
        [{ t: '36 ' }, { slot: '<' }, { t: ' 40   →   ' }, { slot: '6' }, { t: ' < √40' }],
      ],
    },
    tasks: [
      {
        chips: ['49', '<', '7'],
        lines: [
          [{ t: '7 = √' }, { slot: '49' }],
          [{ t: '49 ' }, { slot: '<' }, { t: ' 51   →   ' }, { slot: '7' }, { t: ' < √51' }],
        ],
      },
      {
        chips: ['81', '>', '9'],
        lines: [
          [{ t: '9 = √' }, { slot: '81' }],
          [{ t: '81 ' }, { slot: '>' }, { t: ' 80   →   ' }, { slot: '9' }, { t: ' > √80' }],
        ],
      },
      {
        chips: ['144', '<', '12'],
        lines: [
          [{ t: '12 = √' }, { slot: '144' }],
          [{ t: '144 ' }, { slot: '<' }, { t: ' 150   →   ' }, { slot: '12' }, { t: ' < √150' }],
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS (1-darsdagidek: to'rt savol va beshinchisi SBORKA).
// ============================================================
const S14 = {
  eyebrow: UI.blitzEyebrow,
  title: L(
    'Xossalar va shartlar',
    'Свойства и условия',
    'Properties and conditions',
  ),
  audio: [
    A('mount',
      "To'rt savol va oxirida taqqoslashni yig'ish.",
      'Четыре вопроса и в конце сборка сравнения.',
      'Four questions and an assembly of a comparison at the end.'),
    A('why',
      "Har javobdan keyin izoh chiqadi.",
      'После каждого ответа выходит разбор.',
      'After each answer an explanation appears.'),
  ],
  props: {
    lead: UI.blitzLead,
    items: [
      {
        id: 'q1',
        tag: 'З32',
        ask: L('(√13)² nimaga teng?', 'Чему равно (√13)²?', 'What does (√13)² equal?'),
        options: [
          { id: 'th', right: true, label: '13' },
          { id: 'sq', label: '169' },
          { id: 'root', label: '√13' },
          { id: 'none', label: L("qiymat yo'q", 'значения нет', 'no value') },
        ],
        hint: L(
          "O'n uch nomanfiy, demak xossa ishlaydi.",
          'Тринадцать неотрицательно, значит свойство работает.',
          'Thirteen is non-negative, so the property applies.',
        ),
        ok: L(
          "Kvadrat ildizni yechdi, va harf o'z qiymatiga qaytdi.",
          'Квадрат снял корень, и число вернулось к себе.',
          'The square undid the root, and the number returned to itself.',
        ),
      },
      {
        id: 'q2',
        tag: 'З31',
        ask: L(
          'a manfiy bo\'lsa √(a²) nimaga teng?',
          'Чему равен √(a²) при отрицательном a?',
          'What does √(a²) equal for negative a?',
        ),
        options: [
          { id: 'minusa', right: true, label: '−a' },
          { id: 'a', label: 'a' },
          { id: 'sq', label: 'a²' },
          { id: 'none', label: L("qiymat yo'q", 'значения нет', 'no value') },
        ],
        hint: L(
          "Javob nomanfiy bo'lishi kerak, a esa manfiy.",
          'Ответ обязан быть неотрицательным, а a отрицательно.',
          'The answer must be non-negative, but a is negative.',
        ),
        ok: L(
          "Manfiy sonning moduli minus shu son, va u musbat chiqadi.",
          'Модуль отрицательного числа это минус это число, и оно выходит положительным.',
          'The modulus of a negative number is minus that number, which comes out positive.',
        ),
      },
      {
        id: 'q3',
        tag: 'З33',
        ask: L(
          '√37 va 6 dan qaysi biri katta?',
          'Что больше, √37 или 6?',
          'Which is greater, √37 or 6?',
        ),
        options: [
          { id: 'root', right: true, label: '√37' },
          { id: 'six', label: '6' },
          { id: 'eq', label: L('Teng', 'Равны', 'They are equal') },
          { id: 'no', label: L("Taqqoslanmaydi", 'Не сравнимы', 'Not comparable') },
        ],
        hint: L(
          "Oltini ildiz ostiga kiritib ko'ring.",
          'Попробуй внести шесть под корень.',
          'Try bringing the six under the root.',
        ),
        ok: L(
          "Olti bu o'ttiz oltidan ildiz, o'ttiz yetti esa kattaroq.",
          'Шесть это корень из тридцати шести, а тридцать семь больше.',
          'Six is the root of thirty six, and thirty seven is greater.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          "Xossada shart borligini qanday tekshirasiz?",
          'Как проверить, есть ли у свойства условие?',
          'How do you check whether a property has a condition?',
        ),
        options: [
          { id: 'sub', right: true, label: L("Manfiy son qo'yib ko'rib", 'Подставив отрицательное число', 'By substituting a negative number') },
          { id: 'eye', label: L("Ko'z bilan", 'Глазами', 'By eye') },
          { id: 'book', label: L("Darslikdagi joyiga qarab", 'По месту в учебнике', 'By its place in the textbook') },
          { id: 'len', label: L("Yozuvning uzunligiga qarab", 'По длине записи', 'By the length of the record') },
        ],
        hint: L(
          "Darsda shu ish qilindi, a minus uch bo'ldi va bir yozuv qiymatsiz qoldi.",
          'В уроке так и делали, a было минус три, и одна запись осталась без значения.',
          'The lesson did exactly that, a was minus three and one record had no value.',
        ),
        ok: L(
          "Manfiy son qo'yish shartni ko'rsatadi, esda saqlash esa aldaydi.",
          'Подстановка отрицательного числа показывает условие, а память подводит.',
          'Substituting a negative number reveals the condition; memory misleads.',
        ),
      },
      {
        id: 'q5',
        tag: 'З33',
        ask: L("Taqqoslashni yig'ing", 'Собери сравнение', 'Assemble the comparison'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Beshni ildiz ostiga kiriting va taqqoslashni yig'ing.",
            'Внеси пять под корень и собери сравнение.',
            'Bring the five under the root and assemble the comparison.',
          ),
          lines: [
            [{ t: '5 = √' }, { slot: '25' }, { t: '   →   5 ' }, { slot: '<' }, { t: ' √30' }],
          ],
          tiles: [
            { id: 't1', v: '25', x: 12, y: 12 },
            { id: 't2', v: '<', x: 70, y: 14 },
            { id: 't3', v: '>', x: 40, y: 50 },
            { id: 't4', v: '30', x: 76, y: 48 },
            { id: 't5', v: '5', x: 16, y: 52 },
          ],
          hint: L(
            "Beshning kvadrati yigirma besh, va u o'ttizdan kichik.",
            'Квадрат пяти двадцать пять, и он меньше тридцати.',
            'The square of five is twenty five, and it is less than thirty.',
          ),
          doneNote: L(
            "Yig'ildi. Ildiz osti katta bo'lgani uchun ildiz ham katta.",
            'Собрано. Подкоренное больше, поэтому и корень больше.',
            'Assembled. The radicand is bigger, so the root is bigger.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (1-darsning `takeaway` asbobi). Yangi matematika yo'q.
// ============================================================
const S15 = {
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Xossa shart bilan yashaydi",
    'Свойство живёт вместе с условием',
    'A property lives together with its condition',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi, to'rt o'n yettidan ildizdan kichik.",
      'С урока остаётся одна запись, четыре меньше корня из семнадцати.',
      'One record stays with you, four is less than the root of seventeen.'),
    A('s1',
      "Bugun uch narsani qildingiz. Kvadrat ildizni yechishini ko'rdingiz, ikki yozuvning shartlarini ajratdingiz va ildizlarni hisoblamasdan taqqosladingiz.",
      'Сегодня сделано три вещи. Увидел, что квадрат снимает корень, различил условия двух записей и сравнил корни без вычисления.',
      'Three things are done today. You saw the square undo the root, told apart the conditions of two records and compared roots without computing.'),
    A('s2',
      "Keyingi darsda ko'paytmadan ildiz. Ildiz ko'paytuvchilarga bo'linadi, hadlarga esa yo'q.",
      'В следующем уроке корень из произведения. Корень раздаётся по множителям, а по слагаемым нет.',
      'The next lesson covers the root of a product. A root distributes over factors but not over terms.'),
  ],
  props: {
    mark: '4 < √17',
    markNote: L(
      "ildiz osti katta, ildiz ham katta",
      'подкоренное больше, и корень больше',
      'a bigger radicand, a bigger root',
    ),
    lines: [
      L(
        "Kvadrat ildizni yechadi, a nomanfiy bo'lganda",
        'Квадрат снимает корень, если a неотрицательно',
        'The square undoes the root when a is non-negative',
      ),
      L(
        "√(a²) esa har qanday a da ishlaydi",
        'А √(a²) работает при любом a',
        'While √(a²) works for any a',
      ),
      L(
        "Ildizlarni hisoblamasdan taqqoslash mumkin",
        'Корни можно сравнивать без вычисления',
        'Roots can be compared without computing',
      ),
    ],
    bridge: L(
      "Keyingi dars: ko'paytmadan kvadrat ildiz",
      'Следующий урок: квадратный корень из произведения',
      'Next lesson: the square root of a product',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — QAYTA YOZISH va ASOS.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З32', 'З32', 'З31',
    'З33', 'З32', 'З32', 'З32', 'З31',
    'З33', 'З32', 'З33', null, null,
  ],
  mechanic: { at: 5, tool: 'transform', kind: 'rewrite' },
  hook: <HookScene />,
  final: FinalScene,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
