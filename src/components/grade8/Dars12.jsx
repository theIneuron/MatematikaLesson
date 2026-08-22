// ============================================================================
// 8-sinf, Dars 12. KO'PAYTMADAN KVADRAT ILDIZ.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx` va `math.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi (metodist qarori 2026-08-21, o'n foiz).
// 5-ekranda `transform` va WhyStep: o'quvchi yozuvni qayta yozadi va har
// qadamda «nima asosida» degan savolga javob beradi.
//
// DARSNING BUTUN OG'IRLIGI BITTA FARQDA: ildiz KO'PAYTUVCHILARGA bo'linadi,
// HADLARGA esa bo'linmaydi. Bu farq aytilmaydi, u 4-ekrandagi jadvalda bitta
// qarashda ko'rinadi: ko'paytmada ikki ustun teng chiqadi, yig'indida esa
// besh va yetti.
//
// SHART HAM SHU DARSDA TUG'ILADI: ikkala ko'paytuvchi nomanfiy bo'lishi kerak.
// 12-ekran aynan shu joyni ochadi — (−4) karra (−9) ning ildizi BOR, lekin
// uni ikki ildizga ajratib bo'lmaydi.
//
// DARSLIK. O'zbek darsligi, 8-§, 39-bet — arifmetik ildiz ta'rifi (n = 2).
// Ko'paytma uchun xossa darsda ta'rifdan chiqariladi va son bilan tekshiriladi.
//
// ADASHISHLAR: З4, З16, З32 — oldingi darslardan. Yangi kod yo'q.
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
  id: 'alg-8-12',
  n: 12,
  row: 13,
  block: 'Б2',
  topic: L(
    "Ko'paytmadan kvadrat ildiz",
    'Квадратный корень из произведения',
    'The square root of a product',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Ko'paytmadan ildiz ildizlarning ko'paytmasiga teng, ikkala ko'paytuvchi nomanfiy bo'lganda",
    'Корень из произведения равен произведению корней, когда оба множителя неотрицательны',
    'The root of a product equals the product of the roots when both factors are non-negative',
  ),
  L(
    "Yig'indi uchun bunday xossa YO'Q, ildiz hadlarga bo'linmaydi",
    'Для суммы такого свойства НЕТ, корень по слагаемым не раздаётся',
    'There is no such property for a sum; a root does not distribute over terms',
  ),
  L(
    "Xossa katta sonni qulay ko'paytuvchilarga ajratib hisoblash imkonini beradi",
    'Свойство позволяет считать, разбив большое число на удобные множители',
    'The property lets you compute by splitting a big number into convenient factors',
  ),
]

export const MISS = {
  'З4': {
    what: L(
      "ildiz hadlarga bo'lib chiqarildi",
      'корень «раздали» по слагаемым',
      'the root was distributed over the terms',
    ),
    wrong: 'sqrt(9+16)',
    at: 25,
  },
  'З16': {
    what: L(
      'javob son bilan tekshirilmadi',
      'ответ не проверен числом',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 0,
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
}

// ============================================================
// SAHNALAR (§6). Xuk: ikki yozuv va savol — teng yoki teng emas.
// Yakun: ko'paytmada teng, yig'indida teng emas.
// ============================================================
const SC_EQ = L('TENG YOKI TENG EMAS', 'РАВНЫ ИЛИ НЕТ', 'EQUAL OR NOT')

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Ko'paytmadan ildiz va ildizlarning ko'paytmasi",
      'Корень из произведения и произведение корней',
      'The root of a product and the product of roots',
    )}>
      <path d={rootPath(38, 74, 76)} fill="none" stroke={T.ink} strokeWidth="2.6"
        pathLength="1" className="g8-draw"/>
      <text x="98" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21"
        fill={T.ink}>{'4 · 25'}</text>

      <g className="g8-seat" style={{ '--d': '2600ms' }}>
        <circle cx="200" cy="74" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="81" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <path d={rootPath(246, 74, 26)} fill="none" stroke={T.ink} strokeWidth="2.6"
        pathLength="1" className="g8-draw" style={{ animationDelay: '700ms' }}/>
      <text x="282" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21"
        fill={T.ink}>4</text>
      <text x="304" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18"
        fill={T.ink3}>·</text>
      <path d={rootPath(318, 74, 32)} fill="none" stroke={T.ink} strokeWidth="2.6"
        pathLength="1" className="g8-draw" style={{ animationDelay: '1200ms' }}/>
      <text x="356" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21"
        fill={T.ink}>25</text>

      <text x="200" y="128" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_EQ)}</text>
      <line x1="120" y1="138" x2="280" y2="138" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

// YAKUN: ko'paytmada teng, yig'indida esa teng emas.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Ko'paytmada teng, yig'indida teng emas",
    'В произведении равны, в сумме нет',
    'Equal for a product, not for a sum',
  )}>
    <text x="90" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
      fill={T.ink}>{'√(4 · 25) = √4 · √25'}</text>
    <g className="g8-seat" style={{ '--d': '500ms' }}>
      <text x="214" y="31" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
        fontWeight="700" fill={T.ok}>{'10 = 10'}</text>
    </g>

    <text x="90" y="58" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
      fill={T.ink}>{'√(9 + 16)   √9 + √16'}</text>
    <g className="g8-seat" style={{ '--d': '1000ms' }}>
      <text x="214" y="59" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
        fontWeight="700" fill={T.tip}>{'5   va   7'}</text>
    </g>

    <g className="g8-seat" style={{ '--d': '1500ms' }}>
      <text x="330" y="38" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink}>{'√(ab) = √a · √b'}</text>
      <text x="330" y="56" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="9" fill={T.ink3}>{'a va b nomanfiy'}</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('IKKI YOZUV', 'ДВЕ ЗАПИСИ', 'TWO RECORDS'),
  title: L(
    "√(4 · 25) va √4 · √25",
    'Корень из 4 · 25 и √4 · √25',
    'The root of 4 · 25 and √4 · √25',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Chapda ko'paytmadan ildiz, o'ngda esa ikki ildizning ko'paytmasi.",
      'Слева корень из произведения, справа произведение двух корней.',
      'On the left the root of a product, on the right the product of two roots.'),
    A('why',
      "Taxmin qiling, ular teng yoki teng emas.",
      'Предположи, равны они или нет.',
      'Predict whether they are equal or not.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, bu yozuvlar teng?",
      'Как думаешь, эти записи равны?',
      'Do you think these records are equal?',
    ),
    items: [
      { id: 'eq', show: L('Teng', 'Равны', 'Equal') },
      { id: 'no', show: L('Teng emas', 'Не равны', 'Not equal') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Bu darsning tayanchi — to'liq kvadratlardan ildiz
// (9-dars). Bittasi xato yozilgan, o'quvchi shuni topadi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Kvadratlar jadvali yodda",
    'Таблица квадратов в памяти',
    'The table of squares from memory',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Uchtasi to'g'ri, bittasida xato bor.",
      'Четыре записи. Три верные, в одной ошибка.',
      'Four records. Three are true, one has a mistake.'),
    A('why',
      "Xato yozuvni toping. Har birini kvadratga oshirib tekshiring.",
      'Найди ошибочную. Проверь каждую возведением в квадрат.',
      'Find the false one. Check each by squaring.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuv xato?",
      'Какая запись ошибочная?',
      'Which record is false?',
    ),
    items: [
      {
        id: 'ok100',
        show: '√100 = 10',
        name: L('10 · 10', '10 · 10', '10 · 10'),
        hint: L(
          "O'n o'ninchi marta yuz beradi, yozuv to'g'ri.",
          'Десять на десять даёт сто, запись верная.',
          'Ten times ten gives one hundred, the record is true.',
        ),
      },
      {
        id: 'ok36',
        show: '√36 = 6',
        name: L('6 · 6', '6 · 6', '6 · 6'),
        hint: L(
          "Olti oltiga o'ttiz olti, yozuv to'g'ri.",
          'Шесть на шесть тридцать шесть, запись верная.',
          'Six times six is thirty six, the record is true.',
        ),
      },
      {
        id: 'bad81',
        show: '√81 = 8',
        right: true,
        name: L('8 · 8 = 64', '8 · 8 = 64', '8 · 8 = 64'),
      },
      {
        id: 'ok49',
        show: '√49 = 7',
        name: L('7 · 7', '7 · 7', '7 · 7'),
        hint: L(
          "Yetti yettiga qirq to'qqiz, yozuv to'g'ri.",
          'Семь на семь сорок девять, запись верная.',
          'Seven times seven is forty nine, the record is true.',
        ),
      },
    ],
    after: L(
      "Ha. Sakkizning kvadrati oltmish to'rt, sakson bir esa to'qqizning kvadrati.",
      'Да. Квадрат восьми шестьдесят четыре, а восемьдесят один это квадрат девяти.',
      'Yes. The square of eight is sixty four, and eighty one is the square of nine.',
    ),
  },
}

// ============================================================
// EKRAN 3. IKKINCHI KO'PAYTUVCHINI BURAYMIZ (1-darsning `steppers`).
// Yozuv √(9b): natija ustuni har safar uchni b ning ildiziga ko'paytirib
// beradi. Xossa shu qatorda ko'rinadi, aytilmaydi.
// ============================================================
const S3 = {
  eyebrow: L("KO'PAYTUVCHINI BURANG", 'КРУТИ МНОЖИТЕЛЬ', 'TURN THE FACTOR'),
  title: L(
    "√(9b) ni burang",
    'Крути √(9b)',
    'Turn √(9b)',
  ),
  audio: [
    A('mount',
      "Ildiz ostida to'qqiz karra b turibdi. Birinchi ko'paytuvchi qotib qoldi, ikkinchisini siz buraysiz.",
      'Под корнем девять умножить на b. Первый множитель закреплён, второй крутишь ты.',
      'Under the root nine times b. The first factor is fixed, the second you turn.'),
    A('why',
      "Uch maqsad beriladi. Natija aytilgan songa teng bo'lsin.",
      'Даны три цели. Пусть результат будет равен названному числу.',
      'Three targets are given. Make the result equal the number named.'),
    A('why',
      "Oxirida b ni minusga olib boring.",
      'В конце уведи b в минус.',
      'At the end take b into the negatives.'),
  ],
  props: {
    cols: [
      {
        id: 'b',
        label: L('b ning qiymati', 'значение b', 'the value of b'),
        start: 1, min: -2, max: 16, step: 1,
        risky: true,
      },
    ],
    // Natija YOZUVDAN sanaladi. Manfiy b da ildiz ostida manfiy son
    // paydo bo'ladi, va qiymat yo'qoladi.
    calc: (v) => (9 * v[0] < 0 ? null : Math.round(Math.sqrt(9 * v[0]) * 100) / 100),
    resultLabel: L('√(9b)', '√(9b)', '√(9b)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "Nolda ildiz nol, chunki to'qqiz karra nol nolga teng.",
      'На нуле корень нуль, потому что девять на нуль это нуль.',
      'At zero the root is zero, because nine times zero is zero.',
    ),
    goals: [
      {
        value: 6,
        ask: L(
          "Natija 6 ga teng bo'lsin",
          'Пусть результат будет равен 6',
          'Make the result equal 6',
        ),
        after: L(
          "To'rt. Natija olti chiqdi, ya'ni uch karra ikki.",
          'Четыре. Результат вышел шесть, то есть три на два.',
          'Four. The result came out six, that is three times two.',
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
          "To'qqiz. Natija esa uch karra uch, ya'ni yana uchga ko'paytirildi.",
          'Девять. А результат три на три, то есть снова умножение на три.',
          'Nine. And the result is three times three, again a multiplication by three.',
        ),
      },
      {
        value: 12,
        ask: L(
          "Oxirgisi, natija 12 ga teng bo'lsin",
          'Последняя, пусть результат будет равен 12',
          'The last one, make the result equal 12',
        ),
        after: L(
          "O'n olti. Natija uch karra to'rt, ya'ni uch har safar o'z joyida qoldi.",
          'Шестнадцать. Результат три на четыре, то есть тройка каждый раз оставалась на месте.',
          'Sixteen. The result is three times four, so the three stayed in place every time.',
        ),
      },
    ],
    ask: L(
      "Natija 6 ga teng bo'lsin",
      'Пусть результат будет равен 6',
      'Make the result equal 6',
    ),
    ask2: L(
      "Endi b ni kamaytiring",
      'Теперь уменьши b',
      'Now decrease b',
    ),
    broke: L(
      "b manfiy, ildiz ostida manfiy son, va qiymat yo'q. Demak xossada shart bor, ikkala ko'paytuvchi nomanfiy bo'lishi kerak.",
      'b отрицательно, под корнем отрицательное, и значения нет. Значит у свойства есть условие, оба множителя должны быть неотрицательны.',
      'b is negative, the radicand is negative and there is no value. So the property has a condition, both factors must be non-negative.',
    ),
  },
}

// ============================================================
// EKRAN 4. KO'PAYTMA VA YIG'INDI (1-darsning `pick` va PODSTANOVKA
// jadvali). Jadval darsning butun og'irligini bitta qarashda beradi (З4).
// ============================================================
const S4 = {
  eyebrow: L("KO'PAYTMA VA YIG'INDI", 'ПРОИЗВЕДЕНИЕ И СУММА', 'PRODUCT AND SUM'),
  title: L(
    "Ildiz nimaga bo'linadi",
    'На что раздаётся корень',
    'What a root distributes over',
  ),
  audio: [
    A('mount',
      "To'rt javob. Faqat bittasi √(4 karra 25) ga teng.",
      'Четыре ответа. Только один равен корню из четыре на двадцать пять.',
      'Four answers. Only one equals the root of four times twenty five.'),
    A('why',
      "Jadvalga qarang, u ko'paytma va yig'indini yonma yon qo'yadi.",
      'Смотри в таблицу, она ставит произведение и сумму рядом.',
      'Look at the table, it puts the product and the sum side by side.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuv √(4 · 25) ga teng?",
      'Какая запись равна √(4 · 25)?',
      'Which record equals √(4 · 25)?',
    ),
    items: [
      {
        id: 'mul',
        show: '√4 · √25',
        right: true,
        name: L('2 · 5 = 10', '2 · 5 = 10', '2 · 5 = 10'),
      },
      {
        id: 'add',
        show: '√4 + √25',
        hint: L(
          "Bu ikki plyus besh, ya'ni yetti. Ildiz osti esa yuz, uning ildizi o'n.",
          'Это два плюс пять, то есть семь. А подкоренное сто, его корень десять.',
          'That is two plus five, seven. But the radicand is one hundred and its root is ten.',
        ),
      },
      {
        id: 'prod',
        show: '4 · 25',
        hint: L(
          "Bu ildiz ostidagi son, ya'ni yuz. Ildizni olish qoldi.",
          'Это подкоренное число, то есть сто. Осталось взять корень.',
          'That is the radicand, one hundred. The root still has to be taken.',
        ),
      },
      {
        id: 'sum',
        show: '√29',
        hint: L(
          "Yigirma to'qqiz bu yig'indi. Ildiz ostida esa ko'paytma turibdi.",
          'Двадцать девять это сумма. А под корнем стоит произведение.',
          'Twenty nine is a sum. But the radicand holds a product.',
        ),
      },
    ],
    after: L(
      "Ha. Ko'paytmada ikki ustun teng chiqdi, yig'indida esa yo'q.",
      'Да. В произведении два столбца сошлись, а в сумме нет.',
      'Yes. For the product the two columns matched, for the sum they did not.',
    ),
    proof: {
      varLabel: L('ildiz ostida', 'под корнем', 'the radicand'),
      leftLabel: L('√(ifoda)', '√(выражение)', '√(expression)'),
      rightLabel: L('ildizlar bilan', 'через корни', 'through the roots'),
      noValue: L("qiymat yo'q", 'значения нет', 'no value'),
      rows: [
        { v: '4 · 25', left: '10', right: '10' },
        { v: '9 · 16', left: '12', right: '12' },
        { v: '9 + 16', left: '5', right: '7' },
      ],
    },
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — QAYTA YOZISH VA ASOS (`transform` va
// WhyStep). 1-darsdan farq qiladigan YAGONA ekran.
//
// Yozuv √(36a²), a manfiy. Ikki qadam: ildizni ko'paytuvchilarga ajratish,
// keyin har bir ildizni hisoblash. Ikkinchi qadamda modul qaytadi (11-dars).
// ============================================================
const S5 = {
  eyebrow: L('QAYTA YOZISH', 'ПЕРЕПИСАТЬ', 'REWRITE IT'),
  title: L(
    "√(36a²) ni sodda ko'rinishga keltiring",
    'Приведи √(36a²) к простому виду',
    'Bring √(36a²) to a simple form',
  ),
  audio: [
    A('mount',
      "Ildiz ostida ikki ko'paytuvchi bor, va ikkalasi ham nomanfiy. a manfiy deb berilgan.",
      'Под корнем два множителя, и оба неотрицательны. Дано, что a отрицательно.',
      'The radicand has two factors and both are non-negative. It is given that a is negative.'),
    W('s2',
      "Ildiz ko'paytuvchilarga bo'lindi, chunki o'ttiz olti ham, a kvadrat ham nomanfiy.",
      'Корень раздался по множителям, потому что и тридцать шесть, и a квадрат неотрицательны.',
      'The root distributed over the factors because both thirty six and a squared are non-negative.'),
    W('s3',
      "Ikkinchi ildiz modulni berdi, va a manfiy bo'lgani uchun modul minus a ga teng.",
      'Второй корень дал модуль, и поскольку a отрицательно, модуль равен минус a.',
      'The second root gave the modulus, and since a is negative the modulus equals minus a.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {'√(36a²),   a < 0'}
      </Row>
    ),
    actions: [
      { id: 'split', label: L("Ildizni ko'paytuvchilarga bo'lish", 'Раздать корень по множителям', 'Distribute the root over the factors') },
      { id: 'terms', label: L("Ildizni hadlarga bo'lish", 'Раздать корень по слагаемым', 'Distribute the root over the terms') },
      { id: 'sq', label: L("Yozuvni kvadratga oshirish", 'Возвести запись в квадрат', 'Square the record') },
      { id: 'half', label: L("Ildiz ostini ikkiga bo'lish", 'Разделить подкоренное на два', 'Halve the radicand') },
    ],
    steps: [
      {
        action: 'split',
        wrongs: [
          {
            action: 'terms',
            hint: L(
              "Ildiz ostida had yo'q, ko'paytma turibdi. Hadlarga bo'lish esa umuman ishlamaydi.",
              'Под корнем нет слагаемых, стоит произведение. А по слагаемым раздавать вообще нельзя.',
              'There are no terms under the root, only a product. And distributing over terms never works.',
            ),
          },
          {
            action: 'sq',
            hint: L(
              "Kvadratga oshirsak, yozuv boshqa yozuv bo'lib qoladi.",
              'Если возвести в квадрат, запись станет другой записью.',
              'Squaring turns the record into a different record.',
            ),
          },
          {
            action: 'half',
            hint: L(
              "Ildiz ostini ikkiga bo'lish qiymatni o'zgartiradi.",
              'Деление подкоренного на два меняет значение.',
              'Halving the radicand changes the value.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'mul',
              right: true,
              label: L(
                "Ko'paytmadan ildiz, ikki ko'paytuvchi nomanfiy",
                'Корень из произведения, оба множителя неотрицательны',
                'The root of a product, both factors non-negative',
              ),
            },
            {
              id: 'mod',
              label: L('√(a²) = |a|', '√(a²) = |a|', '√(a²) = |a|'),
              hint: L(
                "Bu keyingi qadamda kerak bo'ladi, hozir ildiz hali bo'linmadi.",
                'Это понадобится на следующем шаге, сейчас корень ещё не раздан.',
                'That is needed on the next step; the root has not been distributed yet.',
              ),
            },
            {
              id: 'sum',
              label: L(
                "Yig'indidan ildiz",
                'Корень из суммы',
                'The root of a sum',
              ),
              hint: L(
                "Bunday xossa yo'q, va jadval buni ko'rsatdi.",
                'Такого свойства нет, и таблица это показала.',
                'There is no such property, and the table showed it.',
              ),
            },
          ],
        },
        ask: L(
          "Yozuv qanday bo'ldi? Yozing",
          'Что получилось? Запиши',
          'What came out? Write it down',
        ),
        answer: 'sqrt(36)*sqrt(a^2)',
        accepts: ['sqrt(a^2)*sqrt(36)', '6*sqrt(a^2)'],
        hints: {
          'sqrt(36)+sqrt(a^2)': L(
            "Ko'paytma qo'shishga aylanmaydi, ildiz ostida karra turgan edi.",
            'Произведение не превращается в сумму, под корнем стояло умножение.',
            'A product does not turn into a sum; the radicand held a multiplication.',
          ),
          '6*a': L(
            "Ikkinchi ildizda modul chiqadi, a esa manfiy. Bu keyingi qadam.",
            'Во втором корне выйдет модуль, а a отрицательно. Это следующий шаг.',
            'The second root gives a modulus, and a is negative. That is the next step.',
          ),
          '36*sqrt(a^2)': L(
            "O'ttiz oltidan ildiz olti, o'ttiz olti emas.",
            'Корень из тридцати шести равен шести, а не тридцати шести.',
            'The root of thirty six is six, not thirty six.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'√(36a²) = √36 · √(a²)'}
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
              "a manfiy, ildiz esa manfiy son bermaydi. Minus ikkini tekshiring.",
              'a отрицательно, а корень отрицательного не даёт. Проверь на минус двух.',
              'a is negative, but a root never gives a negative. Check it at minus two.',
            ),
          },
          {
            action: 'drop',
            hint: L(
              "Modulni tashlasak, a manfiy bo'lganda javob manfiy chiqadi.",
              'Если отбросить модуль, при отрицательном a ответ выйдет отрицательным.',
              'Dropping the modulus makes the answer negative for negative a.',
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
              id: 'six',
              label: L(
                "Oltining oldida minus turadi",
                'Минус стоит перед шестёркой',
                'The minus stands before the six',
              ),
              hint: L(
                "Olti o'zgarmaydi, u √36 dan chiqdi va musbat.",
                'Шесть не меняется, она вышла из корня из тридцати шести и положительна.',
                'The six does not change; it came from the root of thirty six and is positive.',
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
        answer: '-6a',
        accepts: ['0-6*a', '6*(0-a)'],
        hints: {
          '6a': L(
            "a manfiy, demak olti karra a ham manfiy. Ildiz esa manfiy son bermaydi.",
            'a отрицательно, значит шесть на a тоже отрицательно. А корень отрицательного не даёт.',
            'a is negative, so six times a is negative too. But a root never gives a negative.',
          ),
          '6': L(
            "Ikkinchi ko'paytuvchi yo'qolmaydi, u minus a bo'lib qoladi.",
            'Второй множитель не исчезает, он становится минус a.',
            'The second factor does not vanish, it becomes minus a.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'6 · |a| = −6a,   a < 0'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): √1600 ni ikki yo'l bilan.
// Xossa katta sonni qulay ko'paytuvchilarga ajratish uchun kerak.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "√1600 ni hisoblash",
    'Вычислить √1600',
    'Computing √1600',
  ),
  audio: [
    A('mount',
      "Bitta son va ikki yo'l. Birinchisi jadvalni talab qiladi, ikkinchisi yo'q.",
      'Одно число и два пути. Первый требует таблицы, второй нет.',
      'One number and two ways. The first needs a table, the second does not.'),
    W('w2',
      "Birinchi yo'lda kvadrati bir ming olti yuz bo'lgan sonni izlash kerak.",
      'В первом пути нужно искать число, квадрат которого одна тысяча шестьсот.',
      'The first way needs the number whose square is one thousand six hundred.'),
    W('w4',
      "Ikkinchi yo'lda son qulay ko'paytuvchilarga ajratildi, va ikki kichik ildiz qoldi.",
      'Во втором пути число разбили на удобные множители, и остались два маленьких корня.',
      'In the second way the number is split into convenient factors, leaving two small roots.'),
  ],
  props: {
    stepMs: 1400,
    blocks: [
      {
        name: L('1-USUL — TO\'G\'RIDAN TO\'G\'RI', 'СПОСОБ 1 — НАПРЯМУЮ', 'METHOD 1 — DIRECTLY'),
        lead: L(
          "Kvadrati 1600 ga teng bo'lgan sonni izlaymiz",
          'Ищем число, квадрат которого равен 1600',
          'We look for the number whose square is 1600',
        ),
        rows: [
          { text: '30² = 900     50² = 2500' },
          { text: '40² = 1600   →   √1600 = 40', tone: 'ok', note: L('topildi', 'найдено', 'found') },
        ],
      },
      {
        name: L("2-USUL — KO'PAYTUVCHILARGA", 'СПОСОБ 2 — ПО МНОЖИТЕЛЯМ', 'METHOD 2 — BY FACTORS'),
        lead: L(
          "Sonni qulay ko'paytuvchilarga ajratamiz va ildizni bo'lamiz",
          'Разбиваем число на удобные множители и раздаём корень',
          'We split the number into convenient factors and distribute the root',
        ),
        rows: [
          { text: '1600 = 16 · 100' },
          { text: '√16 · √100 = 4 · 10 = 40', tone: 'ok', note: L('javob', 'ответ', 'the answer') },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM 40 BERDI', 'ОБА ДАЛИ 40', 'BOTH GAVE 40'),
        lead: L(
          "Ikkinchi yo'l katta sonlarda qulay, chunki jadval kerak bo'lmaydi",
          'Второй путь удобен на больших числах, потому что таблица не нужна',
          'The second way is handy for big numbers because no table is needed',
        ),
        rows: [{ text: '√1600 = 40', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. YOZUVNI QISMLARGA AJRATAMIZ (1-darsning `parts`): xossaning
// chap tomoni, o'ng tomoni va SHARTI.
// ============================================================
const S7 = {
  eyebrow: L('QISMLARGA', 'ПО ЧАСТЯМ', 'PART BY PART'),
  title: L(
    "Xossa va uning sharti",
    'Свойство и его условие',
    'The property and its condition',
  ),
  audio: [
    A('mount',
      "Xossa uch qismdan iborat, va uchinchisi eng ko'p tashlab ketiladi.",
      'Свойство состоит из трёх частей, и третью чаще всего забывают.',
      'A property has three parts, and the third is most often forgotten.'),
    W('p2',
      "O'ng tomonda ikki ildiz paydo bo'ldi, va ular ko'paytiriladi.",
      'Справа появились два корня, и они перемножаются.',
      'On the right two roots appeared, and they are multiplied.'),
    W('p3',
      "Shart ikkala ko'paytuvchiga tegishli, faqat bittasiga emas.",
      'Условие относится к обоим множителям, а не к одному.',
      'The condition applies to both factors, not just one.'),
  ],
  props: {
    frac: {
      num: [{ t: '√(ab)', id: 'left' }, { t: '= √a · √b', id: 'right' }],
      den: [{ t: 'a ≥ 0,  b ≥ 0', id: 'cond' }],
    },
    steps: [
      {
        focus: 'left',
        text: L(
          "Chap tomon. Avval ko'paytirish bajariladi, keyin ildiz olinadi.",
          'Левая часть. Сначала выполняют умножение, потом берут корень.',
          'The left side. First the multiplication, then the root.',
        ),
      },
      {
        focus: 'right',
        text: L(
          "O'ng tomon. Har bir ko'paytuvchidan ildiz alohida olinadi, keyin ko'paytiriladi.",
          'Правая часть. Из каждого множителя корень берут отдельно, потом перемножают.',
          'The right side. The root of each factor is taken separately, then they are multiplied.',
        ),
      },
      {
        focus: 'cond',
        text: L(
          "Shart. Ikkala ko'paytuvchi nomanfiy bo'lishi kerak, aks holda o'ng tomonda ildiz yo'q.",
          'Условие. Оба множителя должны быть неотрицательны, иначе справа нет корня.',
          'The condition. Both factors must be non-negative, otherwise the right side has no root.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Aynan shu shart tashlab ketilganda XVIII asrda mashhur xato tug'ilgan, o'shanda manfiy sonlardan ildizlar ko'paytirilib qarama-qarshi natija chiqarilgan.",
        'Именно из-за отброшенного условия в восемнадцатом веке родилась известная ошибка, когда перемножали корни из отрицательных чисел и получали противоречие.',
        'It was this dropped condition that produced a famous eighteenth-century error, when roots of negative numbers were multiplied and gave a contradiction.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Yig'ilgan qoida xukdagi
// savolga javob beradi.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Ko'paytmadan ildiz qoidasi",
    'Правило корня из произведения',
    'The rule for the root of a product',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon qildingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже сделал руками. Теперь собери его.',
      'Everything the rule needs is already done by your hands. Now assemble it.'),
    W('card',
      "Darslik matni ochildi, va xukdagi ikki yozuv qaytdi.",
      'Открылся текст учебника, и вернулись две записи с хука.',
      'The textbook wording opened and the two records from the hook are back.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("Ko'paytmadan ildiz", 'Корень из произведения', 'The root of a product') },
      { id: 'f2', label: L("ildizlarning ko'paytmasiga teng", 'равен произведению корней', 'equals the product of the roots') },
      { id: 'f3', label: L("ikkala ko'paytuvchi ham", 'когда оба множителя', 'when both factors') },
      { id: 'f4', label: L("nomanfiy bo'lganda", 'неотрицательны', 'are non-negative') },
      { id: 'w1', label: L("yig'indi uchun ham shunday", 'и для суммы тоже так', 'and the same for a sum') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Jadvalda yig'indi uchun besh va yetti chiqdi, ya'ni teng emas.",
      'Так не складывается. В таблице для суммы вышли пять и семь, то есть не равно.',
      'That does not fit. In the table the sum gave five and seven, so they are not equal.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        L(
          "Ildizni bo'lishdan oldin ikkala ko'paytuvchi nomanfiyligini tekshirish kerak",
          'Прежде чем раздавать корень, надо проверить неотрицательность обоих множителей',
          'Before distributing the root you must check that both factors are non-negative',
        ),
      ],
      source: L(
        "Darslik, 8-§, 39-bet (n = 2); ko'paytma uchun xossa darsda chiqarildi",
        'Учебник, § 8, стр. 39 (n = 2); свойство для произведения выведено в уроке',
        'Textbook, section 8, page 39 (n = 2); the product property is derived in the lesson',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L('√(4 · 25) = √4 + √25', '√(4 · 25) = √4 + √25', '√(4 · 25) = √4 + √25'),
      right: L('√(4 · 25) = √4 · √25', '√(4 · 25) = √4 · √25', '√(4 · 25) = √4 · √25'),
      winner: 'right',
      note: L(
        "Ko'paytmada teng, yig'indida esa yo'q",
        'В произведении равно, а в сумме нет',
        'Equal for a product, not for a sum',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): xossa bilan hisoblash. Beshinchi
// topshiriqda uch ko'paytuvchi — og'irlik STRUKTURADA.
// ============================================================
const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ko'paytuvchilarga bo'lib hisoblang",
    'Считай, раздав по множителям',
    'Compute by distributing over factors',
  ),
  audio: [
    A('mount',
      "Besh yozuv. Har javobdan keyin yechim ochiladi.",
      'Пять записей. После каждого ответа открывается решение.',
      'Five records. After each answer the solution opens.'),
    A('why',
      "Har safar bir xil yo'l. Ildizni ko'paytuvchilarga bo'ling, keyin har birini hisoblang.",
      'Каждый раз один путь. Раздай корень по множителям, потом посчитай каждый.',
      'Every time the same path. Distribute the root over the factors, then compute each.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Ildiz har safar ko'paytuvchilarga bo'lindi.",
      'Все пять разобраны. Корень каждый раз раздавался по множителям.',
      'All five are done. The root distributed over the factors every time.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√(4 · 9)'}</Row>,
        ok: L(
          "Ha. Ikki karra uch olti, yoki o'ttiz oltidan ildiz olti.",
          'Да. Два на три шесть, или корень из тридцати шести шесть.',
          'Yes. Two times three is six, or the root of thirty six is six.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '5', hint: L("Bu ikki plyus uch. Ildiz ostida esa ko'paytma turibdi.", 'Это два плюс три. А под корнем произведение.', 'That is two plus three. But the radicand is a product.') },
          { id: 'c', label: '36', hint: L("O'ttiz olti bu ildiz ostidagi son.", 'Тридцать шесть это подкоренное число.', 'Thirty six is the radicand.') },
        ],
        solution: ['√4 · √9', '2 · 3 = 6'],
      },
      {
        expr: <Row size="big" align="center">{'√(25 · 16)'}</Row>,
        ok: L(
          "Ha. Besh karra to'rt yigirma.",
          'Да. Пять на четыре двадцать.',
          'Yes. Five times four is twenty.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '20' },
          { id: 'b', label: '9', hint: L("Bu besh plyus to'rt, ya'ni yig'indi.", 'Это пять плюс четыре, то есть сумма.', 'That is five plus four, a sum.') },
          { id: 'c', label: '400', hint: L("To'rt yuz bu ildiz ostidagi son.", 'Четыреста это подкоренное число.', 'Four hundred is the radicand.') },
        ],
        solution: ['√25 · √16', '5 · 4 = 20'],
      },
      {
        expr: <Row size="big" align="center">{'√(2 · 8)'}</Row>,
        ok: L(
          "Ha. Ildiz ostida o'n olti, uning ildizi to'rt. Ko'paytuvchilar alohida butun bermaydi.",
          'Да. Под корнем шестнадцать, его корень четыре. Множители по отдельности целого не дают.',
          'Yes. The radicand is sixteen and its root is four. Separately the factors give no whole roots.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: L("Butun chiqmaydi", 'Целым не выходит', 'It is not whole'), hint: L("Ikki karra sakkiz o'n olti, va o'n olti to'liq kvadrat.", 'Два на восемь шестнадцать, а шестнадцать полный квадрат.', 'Two times eight is sixteen, and sixteen is a perfect square.') },
          { id: 'c', label: '16', hint: L("O'n olti bu ildiz ostidagi son.", 'Шестнадцать это подкоренное число.', 'Sixteen is the radicand.') },
        ],
        solution: ['2 · 8 = 16', '√16 = 4'],
      },
      {
        expr: <Row size="big" align="center">{'√900'}</Row>,
        ok: L(
          "Ha. To'qqiz yuz bu to'qqiz karra yuz, ildizi uch karra o'n.",
          'Да. Девятьсот это девять на сто, корень три на десять.',
          'Yes. Nine hundred is nine times one hundred, the root is three times ten.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '30' },
          { id: 'b', label: '300', hint: L("Uch yuzning kvadrati to'qson ming, bu ancha ko'p.", 'Квадрат трёхсот девяносто тысяч, это гораздо больше.', 'The square of three hundred is ninety thousand, far too much.') },
          { id: 'c', label: '90', hint: L("To'qsonning kvadrati sakkiz ming yuz.", 'Квадрат девяноста восемь тысяч сто.', 'The square of ninety is eight thousand one hundred.') },
        ],
        solution: ['900 = 9 · 100', '√9 · √100 = 3 · 10 = 30'],
      },
      {
        expr: <Row size="big" align="center">{'√(4 · 9 · 25)'}</Row>,
        ok: L(
          "Ha. Uch ko'paytuvchi ham nomanfiy, shuning uchun ildiz uchtasiga bo'lindi.",
          'Да. Все три множителя неотрицательны, поэтому корень раздался на три.',
          'Yes. All three factors are non-negative, so the root distributed over three.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '30' },
          { id: 'b', label: '10', hint: L("Bu ikki plyus uch plyus besh, ya'ni yig'indi.", 'Это два плюс три плюс пять, то есть сумма.', 'That is two plus three plus five, a sum.') },
          { id: 'c', label: '900', hint: L("To'qqiz yuz bu ildiz ostidagi son.", 'Девятьсот это подкоренное число.', 'Nine hundred is the radicand.') },
        ],
        solution: ['√4 · √9 · √25', '2 · 3 · 5 = 30'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): harf bilan. Modul qaytadi.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Harf bilan ko'paytma",
    'Произведение с буквой',
    'A product with a letter',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida ildiz ostida harf bor.",
      'Три задания. В каждом под корнем есть буква.',
      'Three tasks. In each there is a letter under the root.'),
    A('why',
      "Har safar so'rang, harf manfiy bo'lishi mumkinmi.",
      'Каждый раз спрашивай, может ли буква быть отрицательной.',
      'Each time ask whether the letter can be negative.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Harf manfiy bo'lishi mumkin bo'lsa, modul kerak.",
      'Все три разобраны. Если буква может быть отрицательной, нужен модуль.',
      'All three are done. If the letter can be negative, the modulus is needed.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√(25x²),   x > 0'}</Row>,
        ok: L(
          "Ha. Iks musbat, shuning uchun modul kerak bo'lmaydi.",
          'Да. Икс положителен, поэтому модуль не нужен.',
          'Yes. x is positive, so no modulus is needed.',
        ),
        question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
        items: [
          { id: 'a', right: true, label: '5x' },
          { id: 'b', label: '25x', hint: L("Yigirma beshdan ildiz besh, yigirma besh emas.", 'Корень из двадцати пяти пять, а не двадцать пять.', 'The root of twenty five is five, not twenty five.') },
          { id: 'c', label: '5x²', hint: L("Iks kvadratdan ildiz iks, kvadrat qolmaydi.", 'Корень из икс квадрат это икс, квадрат не остаётся.', 'The root of x squared is x; the square does not stay.') },
        ],
        solution: ['√25 · √(x²)', 'x > 0   →   5x'],
      },
      {
        expr: <Row size="big" align="center">{'√(9y²),   y < 0'}</Row>,
        ok: L(
          "Ha. Igrek manfiy, shuning uchun javob minus uch igrek.",
          'Да. Игрек отрицателен, поэтому ответ минус три игрек.',
          'Yes. y is negative, so the answer is minus three y.',
        ),
        question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
        items: [
          { id: 'a', right: true, label: '−3y' },
          { id: 'b', label: '3y', hint: L("Igrek manfiy, demak uch igrek ham manfiy. Ildiz esa manfiy bermaydi.", 'Игрек отрицателен, значит три игрек тоже отрицательно. А корень отрицательного не даёт.', 'y is negative, so three y is negative. But a root never gives a negative.') },
          { id: 'c', label: '9y', hint: L("To'qqizdan ildiz uch, to'qqiz emas.", 'Корень из девяти три, а не девять.', 'The root of nine is three, not nine.') },
        ],
        solution: ['√9 · √(y²)', 'y < 0   →   3 · (−y) = −3y'],
      },
      {
        expr: <Row size="big" align="center">{'√(a² b²),   a > 0,  b < 0'}</Row>,
        ok: L(
          "Ha. Birinchi modul a ni beradi, ikkinchisi minus b ni.",
          'Да. Первый модуль даёт a, второй минус b.',
          'Yes. The first modulus gives a, the second gives minus b.',
        ),
        question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
        items: [
          { id: 'a', right: true, label: '−ab' },
          { id: 'b', label: 'ab', hint: L("a musbat, b manfiy, demak ko'paytmasi manfiy. Ildiz esa manfiy bermaydi.", 'a положительно, b отрицательно, значит произведение отрицательно. А корень отрицательного не даёт.', 'a is positive, b is negative, so the product is negative. But a root never gives a negative.') },
          { id: 'c', label: 'a²b', hint: L("Har bir kvadratdan ildiz olinadi, birinchisida ham kvadrat qolmaydi.", 'Из каждого квадрата берут корень, в первом квадрат тоже не остаётся.', 'The root is taken from each square; the first square does not stay either.') },
        ],
        solution: ['√(a²) · √(b²) = |a| · |b|', 'a > 0, b < 0   →   a · (−b) = −ab'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`): YIG'INDI bilan taqqoslash (З4).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Yig'indi bilan ishlamaydi",
    'С суммой не работает',
    'It does not work for a sum',
  ),
  audio: [
    A('mount',
      "Uch yozuv, va har birida ildiz ostida qo'shish turibdi.",
      'Три записи, и в каждой под корнем стоит сложение.',
      'Three records, and in each an addition stands under the root.'),
    A('why',
      "Har safar avval ildiz ostidagi amalni bajaring.",
      'Каждый раз сначала выполни действие под корнем.',
      'Every time do the operation under the root first.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Ildiz hadlarga bo'linmaydi.",
      'Все три разобраны. По слагаемым корень не раздаётся.',
      'All three are done. A root does not distribute over terms.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√(9 + 16)'}</Row>,
        ok: L(
          "Ha. To'qqiz plyus o'n olti yigirma besh, uning ildizi besh.",
          'Да. Девять плюс шестнадцать двадцать пять, его корень пять.',
          'Yes. Nine plus sixteen is twenty five, and its root is five.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '5' },
          { id: 'b', label: '7', hint: L("Bu ildizlarning yig'indisi, uch plyus to'rt. Yig'indining ildizi esa boshqa son.", 'Это сумма корней, три плюс четыре. А корень суммы другое число.', 'That is the sum of roots, three plus four. The root of the sum is a different number.') },
          { id: 'c', label: '25', hint: L("Yigirma besh bu ildiz ostidagi son.", 'Двадцать пять это подкоренное число.', 'Twenty five is the radicand.') },
        ],
        solution: ['9 + 16 = 25', '√25 = 5'],
      },
      {
        expr: <Row size="big" align="center">{'√(36 + 64)'}</Row>,
        ok: L(
          "Ha. O'ttiz olti plyus oltmish to'rt yuz, uning ildizi o'n.",
          'Да. Тридцать шесть плюс шестьдесят четыре сто, его корень десять.',
          'Yes. Thirty six plus sixty four is one hundred, and its root is ten.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '14', hint: L("Bu olti plyus sakkiz, ya'ni ildizlarning yig'indisi.", 'Это шесть плюс восемь, то есть сумма корней.', 'That is six plus eight, the sum of the roots.') },
          { id: 'c', label: '100', hint: L("Yuz bu ildiz ostidagi son.", 'Сто это подкоренное число.', 'One hundred is the radicand.') },
        ],
        solution: ['36 + 64 = 100', '√100 = 10'],
      },
      {
        expr: <Row size="big" align="center">{'√(2 · 50)'}</Row>,
        ok: L(
          "Ha. Bu ko'paytma, shuning uchun ildizni bo'lish yaraydi, o'n chiqadi.",
          'Да. Это произведение, поэтому раздача корня годится, выходит десять.',
          'Yes. This is a product, so distributing the root is allowed, and it gives ten.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '52', hint: L("Ellik ikki bu yig'indi bo'lardi. Bu yerda esa karra turibdi.", 'Пятьдесят два это была бы сумма. А здесь стоит умножение.', 'Fifty two would be a sum. But here we have a multiplication.') },
          { id: 'c', label: '100', hint: L("Yuz bu ildiz ostidagi son, ildizni olish qoldi.", 'Сто это подкоренное число, осталось взять корень.', 'One hundred is the radicand; the root still has to be taken.') },
        ],
        solution: ['2 · 50 = 100', '√100 = 10'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): shart buzilgan holat
// (З32). Ko'paytmaning ildizi BOR, uni bo'lish esa mumkin emas.
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikki minus ildiz ostida",
    'Два минуса под корнем',
    'Two minuses under the root',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham ildiz ostida manfiy sonlar bor.",
      'Два задания. В обоих под корнем есть отрицательные числа.',
      'Two tasks. In both there are negative numbers under the root.'),
    A('why',
      "Avval ko'paytirishni bajaring, keyin ildizni bo'lish mumkinmi deb so'rang.",
      'Сначала выполни умножение, потом спроси, можно ли раздать корень.',
      'First do the multiplication, then ask whether the root can be distributed.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Ko'paytmaning ildizi bor, ammo bo'lish sharti buzilgan.",
      'Оба разобраны. У произведения корень есть, но условие раздачи нарушено.',
      'Both are done. The product has a root, but the condition for distributing is broken.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√((−4) · (−9))'}</Row>,
        ok: L(
          "Ha. Ko'paytma o'ttiz olti, u nomanfiy, demak ildiz bor va oltiga teng.",
          'Да. Произведение тридцать шесть, оно неотрицательно, значит корень есть и равен шести.',
          'Yes. The product is thirty six, which is non-negative, so the root exists and equals six.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: L("qiymat yo'q", 'значения нет', 'no value'), hint: L("Ildiz ostida minus emas, o'ttiz olti turadi, chunki minusga minus urildi.", 'Под корнем не минус, а тридцать шесть, потому что минус умножился на минус.', 'The radicand is not a minus but thirty six, because minus times minus.') },
          { id: 'c', label: '−6', hint: L("Ildiz belgisi manfiy son bermaydi.", 'Знак корня не даёт отрицательного числа.', 'The root sign never gives a negative number.') },
        ],
        solution: ['(−4) · (−9) = 36', '√36 = 6'],
      },
      {
        expr: <Row size="big" align="center">{'√(−4) · √(−9)'}</Row>,
        ok: L(
          "Ha. Har bir ildiz alohida qaraldi, va ikkalasining ham qiymati yo'q.",
          'Да. Каждый корень рассмотрен отдельно, и ни у одного нет значения.',
          'Yes. Each root is taken separately, and neither has a value.',
        ),
        question: L('Bu yozuv ma\'noga egami?', 'Имеет ли смысл эта запись?', 'Does this record make sense?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, ikkala ildiz ham yo'q", 'Нет, оба корня не существуют', 'No, neither root exists') },
          { id: 'b', label: '6', hint: L("Oldingi topshiriqda olti chiqdi, lekin u yerda ko'paytma ildiz OSTIDA edi.", 'В прошлом задании вышло шесть, но там произведение было ПОД корнем.', 'The previous task gave six, but there the product was UNDER the root.') },
          { id: 'c', label: '−6', hint: L("Ikki ildizning ikkalasi ham mavjud emas, ko'paytirishga navbat kelmaydi.", 'Оба корня не существуют, до умножения дело не доходит.', 'Neither root exists, so the multiplication never happens.') },
        ],
        solution: ['−4 < 0,  −9 < 0', "√(−4) va √(−9) — qiymat yo'q"],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill`).
// ============================================================
const S13 = {
  eyebrow: L('YOZUV', 'ЗАПИСЬ', 'THE RECORD'),
  title: L(
    'Yechimni qadamlar bilan yozing',
    'Запиши решение по шагам',
    'Write the solution step by step',
  ),
  audio: [
    A('mount',
      "Yechim yozilgan, lekin kataklar bo'sh. Ularni birma-bir to'ldiring.",
      'Решение записано, но клетки пустые. Заполняй их по одной.',
      'The solution is written but the cells are empty. Fill them one by one.'),
    A('why',
      "Yozuv ikki qadamdan iborat. Ildizni bo'lasiz, keyin har birini hisoblaysiz.",
      'Запись состоит из двух шагов. Раздаёшь корень, потом считаешь каждый.',
      'The record has two steps. You distribute the root, then compute each part.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Yozuv to'ldi. Ikki qadam, bo'lish va hisoblash.",
      'Запись заполнена. Два шага, раздать и посчитать.',
      'The record is filled. Two steps, distribute and compute.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['√25', '2', '10'],
      lines: [
        [{ t: '√(4 · 25) = √4 · ' }, { slot: '√25' }],
        [{ t: '= ' }, { slot: '2' }, { t: ' · 5 = ' }, { slot: '10' }],
      ],
    },
    tasks: [
      {
        chips: ['√49', '3', '21'],
        lines: [
          [{ t: '√(9 · 49) = √9 · ' }, { slot: '√49' }],
          [{ t: '= ' }, { slot: '3' }, { t: ' · 7 = ' }, { slot: '21' }],
        ],
      },
      {
        chips: ['√100', '4', '40'],
        lines: [
          [{ t: '√(16 · 100) = √16 · ' }, { slot: '√100' }],
          [{ t: '= ' }, { slot: '4' }, { t: ' · 10 = ' }, { slot: '40' }],
        ],
      },
      {
        chips: ['√36', '5', '30'],
        lines: [
          [{ t: '√(25 · 36) = √25 · ' }, { slot: '√36' }],
          [{ t: '= ' }, { slot: '5' }, { t: ' · 6 = ' }, { slot: '30' }],
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
    "Ko'paytma, yig'indi va shart",
    'Произведение, сумма и условие',
    'Product, sum and condition',
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
        id: 'q1',
        tag: 'З4',
        ask: L('√(16 · 9) nimaga teng?', 'Чему равен √(16 · 9)?', 'What does √(16 · 9) equal?'),
        options: [
          { id: 'ok', right: true, label: '12' },
          { id: 'sum', label: '7' },
          { id: 'under', label: '144' },
          { id: 'none', label: L("qiymat yo'q", 'значения нет', 'no value') },
        ],
        hint: L(
          "Ildizni ko'paytuvchilarga bo'ling, to'rt karra uch.",
          'Раздай корень по множителям, четыре на три.',
          'Distribute the root over the factors, four times three.',
        ),
        ok: L(
          "Ko'paytmada ildizni bo'lish yaraydi, chunki ikkala son nomanfiy.",
          'В произведении раздача корня годится, потому что оба числа неотрицательны.',
          'For a product distributing the root is allowed, because both numbers are non-negative.',
        ),
      },
      {
        id: 'q2',
        tag: 'З4',
        ask: L('√(16 + 9) nimaga teng?', 'Чему равен √(16 + 9)?', 'What does √(16 + 9) equal?'),
        options: [
          { id: 'ok', right: true, label: '5' },
          { id: 'sum', label: '7' },
          { id: 'under', label: '25' },
          { id: 'twelve', label: '12' },
        ],
        hint: L(
          "Avval ildiz ostidagi qo'shishni bajaring.",
          'Сначала выполни сложение под корнем.',
          'First do the addition under the root.',
        ),
        ok: L(
          "Yig'indi uchun xossa yo'q, shuning uchun avval qo'shildi, keyin ildiz olindi.",
          'Для суммы свойства нет, поэтому сначала сложили, потом взяли корень.',
          'There is no property for a sum, so we added first and took the root after.',
        ),
      },
      {
        id: 'q3',
        tag: 'З32',
        ask: L(
          '√(4x²) nimaga teng, x manfiy bo\'lsa?',
          'Чему равен √(4x²), если x отрицателен?',
          'What does √(4x²) equal if x is negative?',
        ),
        options: [
          { id: 'ok', right: true, label: '−2x' },
          { id: 'plain', label: '2x' },
          { id: 'four', label: '4x' },
          { id: 'sq', label: '2x²' },
        ],
        hint: L(
          "Ikkinchi ko'paytuvchidan ildiz modulni beradi.",
          'Корень из второго множителя даёт модуль.',
          'The root of the second factor gives the modulus.',
        ),
        ok: L(
          "Iks manfiy, shuning uchun moduli minus iks, va javob musbat chiqadi.",
          'Икс отрицателен, поэтому его модуль минус икс, и ответ выходит положительным.',
          'x is negative, so its modulus is minus x, and the answer comes out positive.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          "Xossani qanday tekshirasiz?",
          'Как проверить свойство?',
          'How do you check a property?',
        ),
        options: [
          { id: 'num', right: true, label: L("Ikki tomonga son qo'yib", 'Подставив числа в обе части', 'By substituting numbers into both sides') },
          { id: 'eye', label: L("Ko'z bilan", 'Глазами', 'By eye') },
          { id: 'len', label: L("Yozuvning uzunligiga qarab", 'По длине записи', 'By the length of the record') },
          { id: 'book', label: L("Darslikda borligiga ishonib", 'Поверив, что оно в учебнике', 'By trusting it is in the textbook') },
        ],
        hint: L(
          "Jadval shu ish bilan yig'ilgan, ikki ustun va uch qator.",
          'Таблица собрана именно так, два столбца и три строки.',
          'The table was built exactly that way, two columns and three rows.',
        ),
        ok: L(
          "Son qo'yish yig'indi bilan ko'paytmani darrov ajratdi.",
          'Подстановка чисел сразу отделила сумму от произведения.',
          'Substituting numbers separated the sum from the product at once.',
        ),
      },
      {
        id: 'q5',
        tag: 'З4',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "√(49 · 4) ni ko'paytuvchilarga bo'ling va javobni yig'ing.",
            'Раздай √(49 · 4) по множителям и собери ответ.',
            'Distribute √(49 · 4) over the factors and assemble the answer.',
          ),
          lines: [
            [{ t: '√(49 · 4) = 7 · ' }, { slot: '2' }, { t: ' = ' }, { slot: '14' }],
          ],
          tiles: [
            { id: 't1', v: '2', x: 14, y: 12 },
            { id: 't2', v: '14', x: 68, y: 14 },
            { id: 't3', v: '4', x: 40, y: 50 },
            { id: 't4', v: '9', x: 78, y: 48 },
            { id: 't5', v: '196', x: 14, y: 52 },
          ],
          hint: L(
            "To'rtdan ildiz ikki, keyin yetti karra ikki.",
            'Корень из четырёх два, потом семь на два.',
            'The root of four is two, then seven times two.',
          ),
          doneNote: L(
            "Yig'ildi. Ikki ko'paytuvchi ham nomanfiy, demak bo'lish yaradi.",
            'Собрано. Оба множителя неотрицательны, значит раздача годится.',
            'Assembled. Both factors are non-negative, so distributing is allowed.',
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
    "Ko'paytuvchilarga bo'linadi, hadlarga yo'q",
    'По множителям раздаётся, по слагаемым нет',
    'It distributes over factors, not over terms',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi, ko'paytmadan ildiz ildizlarning ko'paytmasiga teng.",
      'С урока остаётся одна запись, корень из произведения равен произведению корней.',
      'One record stays with you, the root of a product equals the product of the roots.'),
    A('s1',
      "Bugun uch narsani qildingiz. Ko'paytuvchini burab qatorni ko'rdingiz, jadvalda ko'paytma bilan yig'indini ajratdingiz va katta sonni ko'paytuvchilarga bo'lib hisobladingiz.",
      'Сегодня сделано три вещи. Крутил множитель и увидел закономерность, в таблице отделил произведение от суммы и посчитал большое число через множители.',
      'Three things are done today. You turned a factor and saw the pattern, separated product from sum in the table, and computed a big number through its factors.'),
    A('s2',
      "Keyingi darsda ildizli ifodalarni o'zgartirish. Ko'paytuvchini ildiz ostidan chiqarish shu xossaga tayanadi.",
      'В следующем уроке преобразование выражений с корнями. Вынесение множителя опирается на это свойство.',
      'The next lesson covers transforming expressions with roots. Taking a factor out relies on this property.'),
  ],
  props: {
    mark: '√(ab) = √a · √b',
    markNote: L(
      "a va b nomanfiy bo'lganda",
      'когда a и b неотрицательны',
      'when a and b are non-negative',
    ),
    lines: [
      L(
        "Ildiz ko'paytuvchilarga bo'linadi",
        'Корень раздаётся по множителям',
        'A root distributes over factors',
      ),
      L(
        "Hadlarga esa bo'linmaydi",
        'А по слагаемым не раздаётся',
        'But it does not distribute over terms',
      ),
      L(
        "Ikkala ko'paytuvchi nomanfiy bo'lishi shart",
        'Оба множителя обязаны быть неотрицательны',
        'Both factors must be non-negative',
      ),
    ],
    bridge: L(
      "Keyingi dars: ildizli ifodalarni o'zgartirish",
      'Следующий урок: преобразование выражений с корнями',
      'Next lesson: transforming expressions with roots',
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
    null, null, 'З32', 'З4', 'З32',
    'З4', 'З32', 'З4', 'З4', 'З32',
    'З4', 'З32', 'З4', null, null,
  ],
  mechanic: { at: 5, tool: 'transform', kind: 'rewrite' },
  hook: <HookScene />,
  final: FinalScene,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
