// ============================================================================
// 8-sinf, Dars 13. ILDIZLI IFODALARNI O'ZGARTIRISH.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx` va `math.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi (metodist qarori 2026-08-21, o'n foiz). 5-ekranda
// `transform` va WhyStep.
//
// DARSNING UCH ISHI:
//   1) ildiz ostidan ko'paytuvchini CHIQARISH — √50 = 5√2;
//   2) ko'paytuvchini ildiz ostiga KIRITISH — 3√2 = √18;
//   3) ildizli hadlarni QO'SHISH — 2√3 plyus 5√3 = 7√3, lekin √2 plyus √3
//      qo'shilmaydi.
//
// UCHINCHISI ENG NOZIK JOY. O'quvchi ildizli hadni harfli had bilan bir xil
// ko'rmaydi, va √2 plyus √3 ni √5 deb yozadi. Shuning uchun 2-ekranda tayanch
// aynan o'xshash hadlar, va 11-ekranda uchta yozuv yonma yon turadi.
//
// TEKSHIRISH USULI HAM SHU DARSDA BERILADI: javobni kvadratga oshirib, ildiz
// ostidagi son bilan solishtirish (4-ekrandagi jadval). Bu З16 ni davolaydi.
//
// DARSLIK. O'zbek darsligi, 8-§, 39-bet — arifmetik ildiz ta'rifi (n = 2).
// O'zgartirishlar 12-darsdagi ko'paytma xossasiga tayanib chiqariladi.
//
// ADASHISHLAR: З4, З16, З32 — oldingi darslardan. YANGI bittasi:
//   З34 — ildiz ostilari qo'shilib, ildizli hadlar o'xshash deb olindi.
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
  id: 'alg-8-13',
  n: 13,
  row: 14,
  block: 'Б2',
  topic: L(
    "Ildizli ifodalarni o'zgartirish",
    'Преобразование выражений, содержащих квадратные корни',
    'Transforming expressions with square roots',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Ildiz ostidan to'liq kvadrat bo'lgan ko'paytuvchini chiqarish mumkin",
    'Из-под корня можно вынести множитель, который является полным квадратом',
    'A factor that is a perfect square can be taken out from under the root',
  ),
  L(
    "Ildizli hadlar ildiz ostilari BIR XIL bo'lganda qo'shiladi",
    'Слагаемые с корнями складываются, когда подкоренные ОДИНАКОВЫ',
    'Terms with roots are added when the radicands are THE SAME',
  ),
  L(
    "Har qanday o'zgartirishni javobni kvadratga oshirib tekshirish mumkin",
    'Любое преобразование можно проверить, возведя ответ в квадрат',
    'Any transformation can be checked by squaring the answer',
  ),
]

export const MISS = {
  'З4': {
    what: L(
      "ildiz hadlarga bo'lib chiqarildi",
      'корень «раздали» по слагаемым',
      'the root was distributed over the terms',
    ),
    wrong: 'sqrt(2+3)',
    at: 5,
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
    wrong: 'sqrt(0-2)',
    at: 0,
  },
  'З34': {
    what: L(
      "ildiz ostilari qo'shilib, hadlar o'xshash deb olindi",
      'подкоренные сложили, приняв слагаемые за подобные',
      'the radicands were added, treating the terms as like terms',
    ),
    wrong: 'sqrt(2)+sqrt(3)',
    at: 5,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: √50 va savol — uni qisqaroq yozish mumkinmi.
// Yakun: √50 = 5√2, va tekshirish kvadratga oshirish bilan.
// ============================================================
const SC_SHORT = L('QISQAROQ YOZILADIMI', 'ЗАПИШЕТСЯ КОРОЧЕ', 'CAN IT BE SHORTER')

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Ellikdan ildiz",
      'Корень из пятидесяти',
      'The root of fifty',
    )}>
      <path d={rootPath(146, 74, 46)} fill="none" stroke={T.ink} strokeWidth="2.6"
        pathLength="1" className="g8-draw"/>
      <text x="192" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="24"
        fill={T.ink}>50</text>

      <g className="g8-seat" style={{ '--d': '2600ms' }}>
        <path d="M228 74 L252 74 M244 66 L252 74 L244 82" fill="none" stroke={T.ink3}
          strokeWidth="1.8"/>
        <circle cx="282" cy="74" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="282" y="81" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="128" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_SHORT)}</text>
      <line x1="128" y1="138" x2="272" y2="138" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

// YAKUN: √50 = 5√2, va javob kvadratga oshirib tekshiriladi.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Ellikdan ildiz besh karra ikkidan ildiz",
    'Корень из пятидесяти это пять корней из двух',
    'The root of fifty is five roots of two',
  )}>
    <text x="70" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
      fill={T.ink}>{'√50 = √(25 · 2)'}</text>
    <path d="M148 28 L166 28 M160 22 L166 28 L160 34" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
    <g className="g8-seat" style={{ '--d': '500ms' }}>
      <text x="212" y="35" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18"
        fontWeight="700" fill={T.ok}>{'5√2'}</text>
    </g>

    <g className="g8-seat" style={{ '--d': '1000ms' }}>
      <text x="320" y="28" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink}>{'(5√2)² = 25 · 2'}</text>
      <text x="320" y="46" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ok}>{'= 50'}</text>
    </g>

    <g className="g8-seat" style={{ '--d': '1500ms' }}>
      <line x1="60" y1="72" x2="340" y2="72" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
      <circle cx="140" cy="72" r="4.4" fill={T.ok}/>
      <text x="140" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
        fill={T.ink3}>7</text>
      <circle cx="196" cy="72" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
      <text x="196" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
        fill={T.tip}>{'5√2'}</text>
      <circle cx="252" cy="72" r="4.4" fill={T.ok}/>
      <text x="252" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
        fill={T.ink3}>8</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('QISQAROQ YOZUV', 'КОРОЧЕ', 'A SHORTER RECORD'),
  title: L(
    "√50 ni qisqaroq yozish mumkinmi",
    'Можно ли записать √50 короче',
    'Can √50 be written shorter',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ellik to'liq kvadrat emas, demak ildizi butun chiqmaydi.",
      'Пятьдесят не полный квадрат, значит корень не выйдет целым.',
      'Fifty is not a perfect square, so the root will not be whole.'),
    A('why',
      "Taxmin qiling, bu yozuvni boshqacha, qulayroq ko'rinishda yozish mumkinmi.",
      'Предположи, можно ли записать это иначе, в более удобном виде.',
      'Predict whether it can be written differently, in a handier form.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, √50 ni boshqacha yozish mumkinmi?",
      'Как думаешь, можно ли записать √50 иначе?',
      'Do you think √50 can be written differently?',
    ),
    items: [
      { id: 'yes', show: L('Ha, mumkin', 'Да, можно', 'Yes, it can') },
      { id: 'no', show: L("Yo'q, mumkin emas", 'Нет, нельзя', 'No, it cannot') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Bu darsning tayanchi — O'XSHASH HADLAR (7-sinf).
// Ildizli hadlar xuddi harfli hadlar kabi qo'shiladi, va shu tayanch
// 11-ekranda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "O'xshash hadlar",
    'Подобные слагаемые',
    'Like terms',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Uchtasi to'g'ri, bittasida xato bor.",
      'Четыре записи. Три верные, в одной ошибка.',
      'Four records. Three are true, one has a mistake.'),
    A('why',
      "Xato yozuvni toping. O'xshash hadlarning harf qismi bir xil bo'ladi.",
      'Найди ошибочную. У подобных слагаемых буквенная часть одинакова.',
      'Find the false one. Like terms share the same letter part.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuv xato?",
      'Какая запись ошибочная?',
      'Which record is false?',
    ),
    items: [
      {
        id: 'ok7a',
        show: '2a + 5a = 7a',
        name: L("harf qismi bir xil", 'буквенная часть одна', 'the same letter part'),
        hint: L(
          "Harf qismi bir xil, shuning uchun koeffitsiyentlar qo'shildi.",
          'Буквенная часть одинакова, поэтому сложились коэффициенты.',
          'The letter parts match, so the coefficients were added.',
        ),
      },
      {
        id: 'bad',
        show: '2a + 5b = 7ab',
        right: true,
        name: L("harflar boshqa", 'буквы разные', 'different letters'),
      },
      {
        id: 'ok2x',
        show: '3x − x = 2x',
        name: L("bitta harf", 'одна буква', 'one letter'),
        hint: L(
          "Uch iksdan bir iks ayirilsa ikki iks qoladi.",
          'Из трёх иксов вычли один икс, осталось два икса.',
          'One x subtracted from three x leaves two x.',
        ),
      },
      {
        id: 'ok5y',
        show: '4y + y = 5y',
        name: L("bitta harf", 'одна буква', 'one letter'),
        hint: L(
          "Yashirin koeffitsiyent bir, shuning uchun besh igrek chiqdi.",
          'Скрытый коэффициент один, поэтому вышло пять игреков.',
          'The hidden coefficient is one, so it gives five y.',
        ),
      },
    ],
    after: L(
      "Ha. Harflar boshqa bo'lsa hadlar qo'shilmaydi. Ildizlar bilan ham xuddi shunday bo'ladi.",
      'Да. Если буквы разные, слагаемые не складываются. С корнями будет точно так же.',
      'Yes. Different letters mean the terms do not combine. With roots it works exactly the same.',
    ),
  },
}

// ============================================================
// EKRAN 3. ILDIZ QAYERDA BUTUN CHIQADI (1-darsning `steppers`). Yozuv
// √(2k): natija faqat k ikki karra to'liq kvadrat bo'lganda butun chiqadi.
// Ko'paytuvchini chiqarish shu qatorda tug'iladi.
// ============================================================
const S3 = {
  eyebrow: L('QAYERDA BUTUN', 'ГДЕ ЦЕЛОЕ', 'WHERE IT IS WHOLE'),
  title: L(
    "√(2k) ni burang",
    'Крути √(2k)',
    'Turn √(2k)',
  ),
  audio: [
    A('mount',
      "Ildiz ostida ikki karra ka turibdi. Ikki qotib qoldi, ka ni siz buraysiz.",
      'Под корнем два умножить на ка. Двойка закреплена, ка крутишь ты.',
      'Under the root two times k. The two is fixed, the k you turn.'),
    A('why',
      "Uch maqsad beriladi. Natija butun songa teng bo'lsin.",
      'Даны три цели. Пусть результат будет равен целому числу.',
      'Three targets are given. Make the result equal a whole number.'),
    A('why',
      "Oxirida ka ni minusga olib boring.",
      'В конце уведи ка в минус.',
      'At the end take k into the negatives.'),
  ],
  props: {
    cols: [
      {
        id: 'k',
        label: L('k ning qiymati', 'значение k', 'the value of k'),
        start: 1, min: -2, max: 18, step: 1,
        risky: true,
      },
    ],
    // Natija YOZUVDAN sanaladi. Butun qiymatlar faqat k ikki karra to'liq
    // kvadrat bo'lganda chiqadi, va bu darsning butun mavzusi.
    calc: (v) => (2 * v[0] < 0 ? null : Math.round(Math.sqrt(2 * v[0]) * 100) / 100),
    resultLabel: L('√(2k)', '√(2k)', '√(2k)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "Nolda natija nol, chunki ikki karra nol nolga teng.",
      'На нуле результат нуль, потому что два на нуль это нуль.',
      'At zero the result is zero, because two times zero is zero.',
    ),
    goals: [
      {
        value: 2,
        ask: L(
          "Natija 2 ga teng bo'lsin",
          'Пусть результат будет равен 2',
          'Make the result equal 2',
        ),
        after: L(
          "Ikki. Ildiz ostida to'rt bo'ldi, ya'ni ikki karra ikki.",
          'Два. Под корнем стало четыре, то есть два на два.',
          'Two. The radicand became four, that is two times two.',
        ),
      },
      {
        value: 4,
        ask: L(
          "Endi natija 4 ga teng bo'lsin",
          'Теперь пусть результат будет равен 4',
          'Now make the result equal 4',
        ),
        after: L(
          "Sakkiz. Ildiz ostida o'n olti, ya'ni ikki karra sakkiz. Oradagi qiymatlar butun emas edi.",
          'Восемь. Под корнем шестнадцать, то есть два на восемь. Значения между ними были не целыми.',
          'Eight. The radicand is sixteen, two times eight. The values in between were not whole.',
        ),
      },
      {
        value: 6,
        ask: L(
          "Oxirgisi, natija 6 ga teng bo'lsin",
          'Последняя, пусть результат будет равен 6',
          'The last one, make the result equal 6',
        ),
        after: L(
          "O'n sakkiz. Butun qiymatlar ikki, sakkiz va o'n sakkizda chiqdi, ular ikki karra to'liq kvadrat.",
          'Восемнадцать. Целые значения вышли на двух, восьми и восемнадцати, это два на полный квадрат.',
          'Eighteen. The whole values appeared at two, eight and eighteen, each two times a perfect square.',
        ),
      },
    ],
    ask: L(
      "Natija 2 ga teng bo'lsin",
      'Пусть результат будет равен 2',
      'Make the result equal 2',
    ),
    ask2: L(
      "Endi ka ni kamaytiring",
      'Теперь уменьши ка',
      'Now decrease k',
    ),
    broke: L(
      "Ka manfiy, ildiz ostida manfiy son, qiymat yo'q. O'zgartirishlar esa faqat nomanfiy ildiz ostida ishlaydi.",
      'Ка отрицательно, под корнем отрицательное, значения нет. А преобразования работают только при неотрицательном подкоренном.',
      'k is negative, the radicand is negative, there is no value. And the transformations only work for a non-negative radicand.',
    ),
  },
}

// ============================================================
// EKRAN 4. TEKSHIRISH JADVALI (1-darsning `pick` va PODSTANOVKA jadvali).
// Javob KVADRATGA OSHIRIB tekshiriladi, va bu З16 ni davolaydi.
// ============================================================
const S4 = {
  eyebrow: L('TEKSHIRISH', 'ПРОВЕРКА', 'THE CHECK'),
  title: L(
    "Qaysi yozuv √50 ga teng",
    'Какая запись равна √50',
    'Which record equals √50',
  ),
  audio: [
    A('mount',
      "To'rt javob. Faqat bittasi to'g'ri, va uni kvadratga oshirib topamiz.",
      'Четыре ответа. Верен только один, и найдём его возведением в квадрат.',
      'Four answers. Only one is right, and we find it by squaring.'),
    A('why',
      "Jadvalga qarang. Har bir javob kvadratga oshirildi va ellik bilan solishtirildi.",
      'Смотри в таблицу. Каждый ответ возведён в квадрат и сравнён с пятьюдесятью.',
      'Look at the table. Each answer is squared and compared with fifty.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuv √50 ga teng?",
      'Какая запись равна √50?',
      'Which record equals √50?',
    ),
    items: [
      {
        id: 'r5',
        show: '5√2',
        right: true,
        name: L('25 · 2 = 50', '25 · 2 = 50', '25 · 2 = 50'),
      },
      {
        id: 'r2',
        show: '2√25',
        hint: L(
          "Bu ikki karra besh, ya'ni o'n. O'nning kvadrati esa yuz, ellik emas.",
          'Это два на пять, то есть десять. А квадрат десяти сто, не пятьдесят.',
          'That is two times five, ten. And the square of ten is one hundred, not fifty.',
        ),
      },
      {
        id: 'r25',
        show: '25√2',
        hint: L(
          "Kvadratga oshirsak, olti yuz yigirma besh karra ikki chiqadi, bu ancha ko'p.",
          'При возведении в квадрат выйдет шестьсот двадцать пять на два, это гораздо больше.',
          'Squaring gives six hundred twenty five times two, far too much.',
        ),
      },
      {
        id: 'r10',
        show: '10√5',
        hint: L(
          "Kvadrati yuz karra besh, ya'ni besh yuz. Ellikdan o'n baravar katta.",
          'Квадрат сто на пять, то есть пятьсот. В десять раз больше пятидесяти.',
          'Its square is one hundred times five, five hundred. Ten times too big.',
        ),
      },
    ],
    after: L(
      "Ha. Kvadratga oshirish har bir javobni tekshirishning eng qisqa yo'li.",
      'Да. Возведение в квадрат самый короткий способ проверить любой ответ.',
      'Yes. Squaring is the shortest way to check any answer.',
    ),
    proof: {
      varLabel: L('javob', 'ответ', 'the answer'),
      leftLabel: L('kvadrati', 'его квадрат', 'its square'),
      rightLabel: L('50 ga tengmi', 'равно 50', 'equals 50'),
      noValue: L("qiymat yo'q", 'значения нет', 'no value'),
      rows: [
        { v: '5√2', left: '50', right: L('ha', 'да', 'yes') },
        { v: '2√25', left: '100', right: L("yo'q", 'нет', 'no') },
        { v: '10√5', left: '500', right: L("yo'q", 'нет', 'no') },
      ],
    },
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — QAYTA YOZISH VA ASOS (`transform` va
// WhyStep). 1-darsdan farq qiladigan YAGONA ekran.
//
// Yozuv √72 plyus √18. Ikki qadam: ikkala ildizdan ko'paytuvchini
// chiqarish, keyin o'xshash hadlarni qo'shish. Ikkinchi qadam 2-ekrandagi
// tayanchga tayanadi.
// ============================================================
const S5 = {
  eyebrow: L('QAYTA YOZISH', 'ПЕРЕПИСАТЬ', 'REWRITE IT'),
  title: L(
    "√72 + √18 ni sodda ko'rinishga keltiring",
    'Приведи √72 + √18 к простому виду',
    'Bring √72 + √18 to a simple form',
  ),
  audio: [
    A('mount',
      "Ikki ildiz, va ikkalasining ostida to'liq kvadrat yashiringan.",
      'Два корня, и под каждым спрятан полный квадрат.',
      'Two roots, and under each one a perfect square is hiding.'),
    W('s2',
      "Ikkala ildizdan ham ko'paytuvchi chiqarildi, va ildiz ostilari bir xil bo'ldi.",
      'Из обоих корней вынесли множитель, и подкоренные стали одинаковыми.',
      'A factor was taken out of both roots, and the radicands became the same.'),
    W('s3',
      "Endi hadlar o'xshash, shuning uchun koeffitsiyentlar qo'shiladi.",
      'Теперь слагаемые подобны, поэтому складываются коэффициенты.',
      'Now the terms are alike, so the coefficients are added.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {'√72 + √18'}
      </Row>
    ),
    actions: [
      { id: 'take', label: L("Ko'paytuvchini ildiz ostidan chiqarish", 'Вынести множитель из-под корня', 'Take the factor out from under the root') },
      { id: 'addunder', label: L("Ildiz ostilarini qo'shish", 'Сложить подкоренные', 'Add the radicands') },
      { id: 'sq', label: L("Yozuvni kvadratga oshirish", 'Возвести запись в квадрат', 'Square the record') },
      { id: 'sum', label: L("Ildizlarni darrov qo'shish", 'Сразу сложить корни', 'Add the roots straight away') },
    ],
    steps: [
      {
        action: 'take',
        wrongs: [
          {
            action: 'addunder',
            hint: L(
              "Ildiz ostilari qo'shilmaydi. To'qsondan ildiz esa boshqa son.",
              'Подкоренные не складываются. А корень из девяноста другое число.',
              'Radicands are not added. And the root of ninety is a different number.',
            ),
          },
          {
            action: 'sq',
            hint: L(
              "Yig'indini kvadratga oshirish uni boshqa ifodaga aylantiradi.",
              'Возведение суммы в квадрат превращает её в другое выражение.',
              'Squaring the sum turns it into a different expression.',
            ),
          },
          {
            action: 'sum',
            hint: L(
              "Hozircha ildiz ostilari boshqa, yetmish ikki va o'n sakkiz. Qo'shish uchun ular bir xil bo'lishi kerak.",
              'Пока подкоренные разные, семьдесят два и восемнадцать. Для сложения они должны стать одинаковыми.',
              'The radicands still differ, seventy two and eighteen. To add them they must become the same.',
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
                "Ko'paytmadan ildiz xossasi",
                'Свойство корня из произведения',
                'The root-of-a-product property',
              ),
            },
            {
              id: 'like',
              label: L(
                "O'xshash hadlarni qo'shish",
                'Приведение подобных слагаемых',
                'Collecting like terms',
              ),
              hint: L(
                "Bu keyingi qadam. Hozir hadlar hali o'xshash emas.",
                'Это следующий шаг. Пока слагаемые ещё не подобны.',
                'That is the next step. The terms are not alike yet.',
              ),
            },
            {
              id: 'mod',
              label: L('√(a²) = |a|', '√(a²) = |a|', '√(a²) = |a|'),
              hint: L(
                "Bu yerda harf yo'q, ikkala son ham musbat.",
                'Здесь нет буквы, оба числа положительны.',
                'There is no letter here, both numbers are positive.',
              ),
            },
          ],
        },
        ask: L(
          "Yozuv qanday bo'ldi? Yozing",
          'Что получилось? Запиши',
          'What came out? Write it down',
        ),
        answer: '6*sqrt(2)+3*sqrt(2)',
        accepts: ['sqrt(36*2)+sqrt(9*2)', '3*sqrt(2)+6*sqrt(2)'],
        hints: {
          'sqrt(90)': L(
            "Ildiz ostilari qo'shilmaydi, bu boshqa son.",
            'Подкоренные не складываются, это другое число.',
            'Radicands are not added; that is a different number.',
          ),
          '6*sqrt(2)+9*sqrt(2)': L(
            "O'n sakkiz bu to'qqiz karra ikki, va to'qqizdan ildiz uch.",
            'Восемнадцать это девять на два, а корень из девяти три.',
            'Eighteen is nine times two, and the root of nine is three.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'√72 + √18 = 6√2 + 3√2'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'coef', label: L("Koeffitsiyentlarni qo'shish", 'Сложить коэффициенты', 'Add the coefficients') },
          { id: 'roots', label: L("Ildiz ostilarini qo'shish", 'Сложить подкоренные', 'Add the radicands') },
          { id: 'mulc', label: L("Koeffitsiyentlarni ko'paytirish", 'Умножить коэффициенты', 'Multiply the coefficients') },
        ],
        action: 'coef',
        wrongs: [
          {
            action: 'roots',
            hint: L(
              "Ildiz ostilari bir xil bo'lib qoladi, xuddi harf qismi kabi. Ikki a plyus besh a da ham harf o'zgarmaydi.",
              'Подкоренное остаётся тем же, как и буквенная часть. В два a плюс пять a буква тоже не меняется.',
              'The radicand stays the same, just like the letter part. In two a plus five a the letter does not change either.',
            ),
          },
          {
            action: 'mulc',
            hint: L(
              "Ko'paytirish qo'shishning o'rniga kelmaydi. Ikki a plyus besh a yetti a beradi, o'n a emas.",
              'Умножение не заменяет сложение. Два a плюс пять a даёт семь a, а не десять a.',
              'Multiplication does not replace addition. Two a plus five a gives seven a, not ten a.',
            ),
          },
        ],
        why: {
          question: L(
            "Nima uchun qo'shish mumkin?",
            'Почему теперь можно складывать?',
            'Why can they be added now?',
          ),
          items: [
            {
              id: 'same',
              right: true,
              label: L(
                "Ildiz ostilari bir xil bo'ldi",
                'Подкоренные стали одинаковыми',
                'The radicands became the same',
              ),
            },
            {
              id: 'both',
              label: L(
                "Ikkalasida ildiz bor",
                'В обоих есть корень',
                'Both have a root',
              ),
              hint: L(
                "Ildizning borligi yetarli emas. √2 plyus √3 qo'shilmaydi.",
                'Наличия корня недостаточно. Корень из двух плюс корень из трёх не складываются.',
                'Having a root is not enough. The root of two plus the root of three do not combine.',
              ),
            },
            {
              id: 'small',
              label: L(
                "Sonlar kichik",
                'Числа небольшие',
                'The numbers are small',
              ),
              hint: L(
                "Sonlarning kattaligi hech narsani hal qilmaydi.",
                'Величина чисел ничего не решает.',
                'The size of the numbers decides nothing.',
              ),
            },
          ],
        },
        ask: L(
          "Yozuvni oxirigacha yozing",
          'Запиши до конца',
          'Write it to the end',
        ),
        answer: '9*sqrt(2)',
        accepts: ['sqrt(162)', 'sqrt(81*2)'],
        hints: {
          '9*sqrt(4)': L(
            "Ildiz osti o'zgarmaydi, faqat koeffitsiyentlar qo'shiladi.",
            'Подкоренное не меняется, складываются только коэффициенты.',
            'The radicand does not change, only the coefficients add.',
          ),
          '18*sqrt(2)': L(
            "Olti plyus uch to'qqiz, o'n sakkiz emas.",
            'Шесть плюс три девять, а не восемнадцать.',
            'Six plus three is nine, not eighteen.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'6√2 + 3√2 = 9√2'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): √8 karra √2 ni ikki yo'l bilan.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "√8 · √2 ni hisoblash",
    'Вычислить √8 · √2',
    'Computing √8 · √2',
  ),
  audio: [
    A('mount',
      "Bitta ko'paytma va ikki yo'l. Ikkalasi ham bir xil javob beradi.",
      'Одно произведение и два пути. Оба дают один ответ.',
      'One product and two ways. Both give the same answer.'),
    W('w2',
      "Birinchi yo'lda ildizlar bitta ildiz ostiga yig'ildi.",
      'В первом пути корни собрали под один корень.',
      'In the first way the roots are gathered under one root.'),
    W('w4',
      "Ikkinchi yo'lda avval ko'paytuvchi chiqarildi, keyin ikki ildiz bir birini yo'q qildi.",
      'Во втором пути сначала вынесли множитель, потом два корня уничтожили друг друга.',
      'In the second way a factor is taken out first, then the two roots cancel each other.'),
  ],
  props: {
    stepMs: 1400,
    blocks: [
      {
        name: L("1-USUL — BITTA ILDIZ OSTIGA", 'СПОСОБ 1 — ПОД ОДИН КОРЕНЬ', 'METHOD 1 — UNDER ONE ROOT'),
        lead: L(
          "Ko'paytmadan ildiz xossasini teskari tomonga ishlatamiz",
          'Пользуемся свойством корня из произведения в обратную сторону',
          'We use the root-of-a-product property in reverse',
        ),
        rows: [
          { text: '√8 · √2 = √(8 · 2)' },
          { text: '= √16 = 4', tone: 'ok', note: L('javob', 'ответ', 'the answer') },
        ],
      },
      {
        name: L("2-USUL — KO'PAYTUVCHINI CHIQARIB", 'СПОСОБ 2 — ВЫНЕСЯ МНОЖИТЕЛЬ', 'METHOD 2 — TAKING A FACTOR OUT'),
        lead: L(
          "Avval √8 ni sodda ko'rinishga keltiramiz",
          'Сначала приводим √8 к простому виду',
          'First we bring √8 to a simple form',
        ),
        rows: [
          { text: '√8 = 2√2' },
          { text: '2√2 · √2 = 2 · 2 = 4', tone: 'ok', note: L('javob', 'ответ', 'the answer') },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM 4 BERDI', 'ОБА ДАЛИ 4', 'BOTH GAVE 4'),
        lead: L(
          "Ikkinchi yo'l uzunroq, lekin u har qanday ko'paytmada ishlaydi",
          'Второй путь длиннее, зато работает в любом произведении',
          'The second way is longer but works for any product',
        ),
        rows: [{ text: '√8 · √2 = 4', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. YOZUVNI QISMLARGA AJRATAMIZ (1-darsning `parts`): chiqarishning
// uch qismi — ajratish, chiqarish va qolgan ildiz.
// ============================================================
const S7 = {
  eyebrow: L('QISMLARGA', 'ПО ЧАСТЯМ', 'PART BY PART'),
  title: L(
    "Chiqarishning uch qadami",
    'Три шага вынесения',
    'The three steps of taking a factor out',
  ),
  audio: [
    A('mount',
      "Chiqarish uch qadamdan iborat, va birinchisi eng muhim.",
      'Вынесение состоит из трёх шагов, и первый самый важный.',
      'Taking a factor out has three steps, and the first is the most important.'),
    W('p2',
      "To'liq kvadratdan ildiz olinadi va u ildiz belgisidan tashqariga chiqadi.",
      'Из полного квадрата берут корень, и он выходит за знак корня.',
      'The root of the perfect square is taken and moves outside the sign.'),
    W('p3',
      "Qolgan ko'paytuvchi ildiz ostida qoladi, chunki u to'liq kvadrat emas.",
      'Оставшийся множитель остаётся под корнем, потому что он не полный квадрат.',
      'The remaining factor stays under the root because it is not a perfect square.'),
  ],
  props: {
    frac: {
      num: [{ t: '√50 = √(25 · 2)', id: 'split' }, { t: '= 5√2', id: 'out' }],
      den: [{ t: '25 — to\'liq kvadrat', id: 'why' }],
    },
    steps: [
      {
        focus: 'split',
        text: L(
          "Birinchi qadam. Ildiz ostidagi son to'liq kvadrat va qolgan qismga ajratiladi.",
          'Первый шаг. Подкоренное число разбивают на полный квадрат и остаток.',
          'Step one. The radicand is split into a perfect square and the rest.',
        ),
      },
      {
        focus: 'out',
        text: L(
          "Ikkinchi qadam. To'liq kvadratdan ildiz olinib, tashqariga chiqariladi.",
          'Второй шаг. Из полного квадрата берут корень и выносят наружу.',
          'Step two. The root of the perfect square is taken and moved outside.',
        ),
      },
      {
        focus: 'why',
        text: L(
          "Uchinchi qadam. Eng katta to'liq kvadratni tanlash kerak, aks holda ildiz ostida yana kvadrat qoladi.",
          'Третий шаг. Надо выбрать наибольший полный квадрат, иначе под корнем останется ещё один.',
          'Step three. You must pick the largest perfect square, otherwise another one stays under the root.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Kalkulyatorlar paydo bo'lishidan oldin jadvallarda faqat kichik sonlarning ildizlari berilgan, shuning uchun har qanday ildizni aynan shu ko'rinishga keltirish kerak edi.",
        'До калькуляторов в таблицах давали корни только небольших чисел, поэтому любой корень приходилось приводить именно к такому виду.',
        'Before calculators the tables listed roots of small numbers only, so any root had to be brought exactly to this form.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`).
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Chiqarish va qo'shish qoidasi",
    'Правило вынесения и сложения',
    'The rule for taking out and adding',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon qildingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже сделал руками. Теперь собери его.',
      'Everything the rule needs is already done by your hands. Now assemble it.'),
    W('card',
      "Darslik matni ochildi, va xukdagi yozuv javobini oldi.",
      'Открылся текст учебника, и запись с хука получила ответ.',
      'The textbook wording opened, and the record from the hook has its answer.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("To'liq kvadrat bo'lgan ko'paytuvchi", 'Множитель, который полный квадрат', 'A factor that is a perfect square') },
      { id: 'f2', label: L("ildiz ostidan chiqariladi", 'выносится из-под корня', 'is taken out from under the root') },
      { id: 'f3', label: L("ildizli hadlar esa qo'shiladi", 'а слагаемые с корнями складываются', 'and terms with roots are added') },
      { id: 'f4', label: L("ildiz ostilari bir xil bo'lganda", 'когда подкоренные одинаковы', 'when the radicands are the same') },
      { id: 'w1', label: L("ildiz ostilari qo'shiladi", 'подкоренные складываются', 'the radicands are added') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Ildiz ostilari qo'shilganda √2 plyus √3 √5 bo'lib qolardi, va bu xato.",
      'Так не складывается. Если бы подкоренные складывались, корень из двух плюс корень из трёх был бы корнем из пяти, а это неверно.',
      'That does not fit. If radicands added, the root of two plus the root of three would be the root of five, which is false.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 8-§, 39-bet (n = 2); o'zgartirishlar ko'paytma xossasidan chiqarildi",
        'Учебник, § 8, стр. 39 (n = 2); преобразования выведены из свойства произведения',
        'Textbook, section 8, page 39 (n = 2); the transformations follow from the product property',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L('√50 — qisqartirilmaydi', '√50 короче не запишется', '√50 cannot be shortened'),
      right: L('√50 = 5√2', '√50 = 5√2', '√50 = 5√2'),
      winner: 'right',
      note: L(
        "Ellik yigirma besh karra ikki, va yigirma besh to'liq kvadrat",
        'Пятьдесят это двадцать пять на два, а двадцать пять полный квадрат',
        'Fifty is twenty five times two, and twenty five is a perfect square',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): ko'paytuvchini chiqarish.
// ============================================================
const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ko'paytuvchini chiqaring",
    'Вынеси множитель',
    'Take the factor out',
  ),
  audio: [
    A('mount',
      "Besh yozuv. Har javobdan keyin yechim ochiladi.",
      'Пять записей. После каждого ответа открывается решение.',
      'Five records. After each answer the solution opens.'),
    A('why',
      "Har safar eng katta to'liq kvadratni izlang.",
      'Каждый раз ищи наибольший полный квадрат.',
      'Every time look for the largest perfect square.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar eng katta to'liq kvadrat ajratildi.",
      'Все пять разобраны. Каждый раз выделяли наибольший полный квадрат.',
      'All five are done. The largest perfect square was picked every time.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√8'}</Row>,
        ok: L(
          "Ha. Sakkiz bu to'rt karra ikki, to'rtdan ildiz ikki.",
          'Да. Восемь это четыре на два, корень из четырёх два.',
          'Yes. Eight is four times two, and the root of four is two.',
        ),
        question: L('Sodda ko\'rinishi qanday?', 'Каков простой вид?', 'What is the simple form?'),
        items: [
          { id: 'a', right: true, label: '2√2' },
          { id: 'b', label: '4√2', hint: L("To'rtdan ildiz ikki, to'rt emas.", 'Корень из четырёх два, а не четыре.', 'The root of four is two, not four.') },
          { id: 'c', label: '2√4', hint: L("Ildiz ostida qolgan qism ikki, chunki to'rt tashqariga chiqdi.", 'Под корнем остаётся два, потому что четыре вышло наружу.', 'Two stays under the root because the four moved out.') },
        ],
        solution: ['8 = 4 · 2', '√8 = 2√2'],
      },
      {
        expr: <Row size="big" align="center">{'√50'}</Row>,
        ok: L(
          "Ha. Ellik bu yigirma besh karra ikki.",
          'Да. Пятьдесят это двадцать пять на два.',
          'Yes. Fifty is twenty five times two.',
        ),
        question: L('Sodda ko\'rinishi qanday?', 'Каков простой вид?', 'What is the simple form?'),
        items: [
          { id: 'a', right: true, label: '5√2' },
          { id: 'b', label: '2√5', hint: L("Kvadratga oshirsak to'rt karra besh, ya'ni yigirma chiqadi.", 'При возведении в квадрат выйдет четыре на пять, то есть двадцать.', 'Squaring gives four times five, twenty.') },
          { id: 'c', label: '25√2', hint: L("Yigirma beshdan ildiz besh.", 'Корень из двадцати пяти пять.', 'The root of twenty five is five.') },
        ],
        solution: ['50 = 25 · 2', '√50 = 5√2'],
      },
      {
        expr: <Row size="big" align="center">{'√75'}</Row>,
        ok: L(
          "Ha. Yetmish besh bu yigirma besh karra uch.",
          'Да. Семьдесят пять это двадцать пять на три.',
          'Yes. Seventy five is twenty five times three.',
        ),
        question: L('Sodda ko\'rinishi qanday?', 'Каков простой вид?', 'What is the simple form?'),
        items: [
          { id: 'a', right: true, label: '5√3' },
          { id: 'b', label: '3√5', hint: L("Kvadrati to'qqiz karra besh, ya'ni qirq besh, yetmish besh emas.", 'Его квадрат девять на пять, то есть сорок пять, а не семьдесят пять.', 'Its square is nine times five, forty five, not seventy five.') },
          { id: 'c', label: '25√3', hint: L("Yigirma beshdan ildiz besh.", 'Корень из двадцати пяти пять.', 'The root of twenty five is five.') },
        ],
        solution: ['75 = 25 · 3', '√75 = 5√3'],
      },
      {
        expr: <Row size="big" align="center">{'√32'}</Row>,
        ok: L(
          "Ha. O'ttiz ikki bu o'n olti karra ikki, va o'n olti eng katta to'liq kvadrat.",
          'Да. Тридцать два это шестнадцать на два, и шестнадцать наибольший полный квадрат.',
          'Yes. Thirty two is sixteen times two, and sixteen is the largest perfect square.',
        ),
        question: L('Sodda ko\'rinishi qanday?', 'Каков простой вид?', 'What is the simple form?'),
        items: [
          { id: 'a', right: true, label: '4√2' },
          { id: 'b', label: '2√8', hint: L("Bu to'g'ri, lekin oxirigacha emas, chunki sakkizda yana to'rt bor.", 'Это верно, но не до конца, потому что в восьми ещё есть четыре.', 'True but not finished, because eight still holds a four.') },
          { id: 'c', label: '16√2', hint: L("O'n oltidan ildiz to'rt.", 'Корень из шестнадцати четыре.', 'The root of sixteen is four.') },
        ],
        solution: ['32 = 16 · 2', '√32 = 4√2'],
      },
      {
        expr: <Row size="big" align="center">{'√200'}</Row>,
        ok: L(
          "Ha. Ikki yuz bu yuz karra ikki, yuzdan ildiz o'n.",
          'Да. Двести это сто на два, корень из ста десять.',
          'Yes. Two hundred is one hundred times two, and the root of one hundred is ten.',
        ),
        question: L('Sodda ko\'rinishi qanday?', 'Каков простой вид?', 'What is the simple form?'),
        items: [
          { id: 'a', right: true, label: '10√2' },
          { id: 'b', label: '2√50', hint: L("Bu to'g'ri, lekin ellikda yana yigirma besh bor.", 'Это верно, но в пятидесяти ещё есть двадцать пять.', 'True, but fifty still holds twenty five.') },
          { id: 'c', label: '100√2', hint: L("Yuzdan ildiz o'n.", 'Корень из ста десять.', 'The root of one hundred is ten.') },
        ],
        solution: ['200 = 100 · 2', '√200 = 10√2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): KIRITISH, ya'ni teskari ish.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ildiz ostiga kiriting",
    'Внеси под корень',
    'Bring it under the root',
  ),
  audio: [
    A('mount',
      "Uch yozuv. Endi ish teskari, ko'paytuvchi ildiz ostiga kiritiladi.",
      'Три записи. Теперь работа обратная, множитель вносится под корень.',
      'Three records. Now the work is reversed, the factor goes under the root.'),
    A('why',
      "Kiritishda ko'paytuvchi kvadratga oshiriladi.",
      'При внесении множитель возводится в квадрат.',
      'When bringing it in, the factor is squared.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Kiritishda ko'paytuvchi har safar kvadratga oshdi.",
      'Все три разобраны. При внесении множитель каждый раз возводился в квадрат.',
      'All three are done. When brought in, the factor was squared every time.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3√2'}</Row>,
        ok: L(
          "Ha. Uchning kvadrati to'qqiz, to'qqiz karra ikki o'n sakkiz.",
          'Да. Квадрат трёх девять, девять на два восемнадцать.',
          'Yes. The square of three is nine, nine times two is eighteen.',
        ),
        question: L('Ildiz ostiga kiritilgan ko\'rinishi?', 'Как выглядит внесённая форма?', 'What is the brought-in form?'),
        items: [
          { id: 'a', right: true, label: '√18' },
          { id: 'b', label: '√6', hint: L("Uch kvadratga oshiriladi, ildiz ostiga oddiy ko'paytuvchi sifatida kirmaydi.", 'Три возводится в квадрат, а не входит под корень простым множителем.', 'The three is squared; it does not enter as a plain factor.') },
          { id: 'c', label: '√36', hint: L("To'qqiz karra ikki o'n sakkiz, o'ttiz olti emas.", 'Девять на два восемнадцать, а не тридцать шесть.', 'Nine times two is eighteen, not thirty six.') },
        ],
        solution: ['3 = √9', '√9 · √2 = √18'],
      },
      {
        expr: <Row size="big" align="center">{'2√5'}</Row>,
        ok: L(
          "Ha. Ikkining kvadrati to'rt, to'rt karra besh yigirma.",
          'Да. Квадрат двух четыре, четыре на пять двадцать.',
          'Yes. The square of two is four, four times five is twenty.',
        ),
        question: L('Ildiz ostiga kiritilgan ko\'rinishi?', 'Как выглядит внесённая форма?', 'What is the brought-in form?'),
        items: [
          { id: 'a', right: true, label: '√20' },
          { id: 'b', label: '√10', hint: L("Ikki kvadratga oshiriladi, ya'ni to'rt bo'ladi.", 'Двойка возводится в квадрат, то есть становится четырьмя.', 'The two is squared, so it becomes four.') },
          { id: 'c', label: '√7', hint: L("Bu yig'indi bo'lardi, bizda esa ko'paytma.", 'Это была бы сумма, а у нас произведение.', 'That would be a sum, but we have a product.') },
        ],
        solution: ['2 = √4', '√4 · √5 = √20'],
      },
      {
        expr: <Row size="big" align="center">{'5√3'}</Row>,
        ok: L(
          "Ha. Beshning kvadrati yigirma besh, yigirma besh karra uch yetmish besh.",
          'Да. Квадрат пяти двадцать пять, двадцать пять на три семьдесят пять.',
          'Yes. The square of five is twenty five, twenty five times three is seventy five.',
        ),
        question: L('Ildiz ostiga kiritilgan ko\'rinishi?', 'Как выглядит внесённая форма?', 'What is the brought-in form?'),
        items: [
          { id: 'a', right: true, label: '√75' },
          { id: 'b', label: '√15', hint: L("Besh kvadratga oshiriladi, ya'ni yigirma besh bo'ladi.", 'Пятёрка возводится в квадрат, то есть становится двадцатью пятью.', 'The five is squared, so it becomes twenty five.') },
          { id: 'c', label: '√8', hint: L("Bu yig'indi bo'lardi, bizda esa ko'paytma.", 'Это была бы сумма, а у нас произведение.', 'That would be a sum, but we have a product.') },
        ],
        solution: ['5 = √25', '√25 · √3 = √75'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`): ILDIZLI HADLARNI QO'SHISH (З34).
// Uchinchi topshiriq umuman qo'shilmaydi, va bu ham javob.
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ildizli hadlarni qo'shish",
    'Складываем слагаемые с корнями',
    'Adding terms with roots',
  ),
  audio: [
    A('mount',
      "Uch yozuv. Ikkitasi qo'shiladi, bittasi esa yo'q.",
      'Три записи. Две складываются, а одна нет.',
      'Three records. Two of them combine, one does not.'),
    A('why',
      "Har safar ildiz ostilariga qarang, ular bir xilmi.",
      'Каждый раз смотри на подкоренные, одинаковы ли они.',
      'Each time look at the radicands, whether they are the same.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Ildiz ostilari boshqa bo'lsa, yozuv shundoq qoladi.",
      'Все три разобраны. Если подкоренные разные, запись так и остаётся.',
      'All three are done. If the radicands differ, the record stays as it is.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'2√3 + 5√3'}</Row>,
        ok: L(
          "Ha. Ildiz ostilari bir xil, shuning uchun koeffitsiyentlar qo'shildi.",
          'Да. Подкоренные одинаковы, поэтому сложились коэффициенты.',
          'Yes. The radicands are the same, so the coefficients added.',
        ),
        question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
        items: [
          { id: 'a', right: true, label: '7√3' },
          { id: 'b', label: '7√6', hint: L("Ildiz osti o'zgarmaydi, xuddi harf qismi kabi.", 'Подкоренное не меняется, как и буквенная часть.', 'The radicand does not change, just like a letter part.') },
          { id: 'c', label: '10√3', hint: L("Bu ko'paytirish bo'ldi. Hadlar esa qo'shiladi.", 'Это умножение. А слагаемые складываются.', 'That is multiplication. But terms are added.') },
        ],
        solution: ['2 + 5 = 7', '2√3 + 5√3 = 7√3'],
      },
      {
        expr: <Row size="big" align="center">{'√2 + √8'}</Row>,
        ok: L(
          "Ha. Avval √8 dan ko'paytuvchi chiqarildi, keyin hadlar o'xshash bo'ldi.",
          'Да. Сначала из корня из восьми вынесли множитель, потом слагаемые стали подобными.',
          'Yes. First a factor was taken out of the root of eight, then the terms became alike.',
        ),
        question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
        items: [
          { id: 'a', right: true, label: '3√2' },
          { id: 'b', label: '√10', hint: L("Ildiz ostilari qo'shilmaydi. Buni son bilan tekshirish mumkin.", 'Подкоренные не складываются. Это можно проверить числом.', 'Radicands are not added. You can check that with a number.') },
          { id: 'c', label: L("Qo'shilmaydi", 'Не складываются', 'They do not combine'), hint: L("Sakkiz bu to'rt karra ikki, demak ildiz ostilarini bir xil qilish mumkin.", 'Восемь это четыре на два, значит подкоренные можно сделать одинаковыми.', 'Eight is four times two, so the radicands can be made the same.') },
        ],
        solution: ['√8 = 2√2', '√2 + 2√2 = 3√2'],
      },
      {
        expr: <Row size="big" align="center">{'√2 + √3'}</Row>,
        ok: L(
          "Ha. Ildiz ostilari boshqa va ularni bir xil qilib bo'lmaydi, shuning uchun yozuv shundoq qoladi.",
          'Да. Подкоренные разные, и одинаковыми их не сделать, поэтому запись так и остаётся.',
          'Yes. The radicands differ and cannot be made the same, so the record stays as it is.',
        ),
        question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
        items: [
          { id: 'a', right: true, label: L("Qo'shilmaydi", 'Не складываются', 'They do not combine') },
          { id: 'b', label: '√5', hint: L("Ikki plyus uch bu ildiz ostilarining yig'indisi, javob esa boshqa son.", 'Два плюс три это сумма подкоренных, а ответ другое число.', 'Two plus three is the sum of the radicands, but the answer is a different number.') },
          { id: 'c', label: '√6', hint: L("Bu ko'paytmadan ildiz bo'lardi, bizda esa yig'indi.", 'Это был бы корень из произведения, а у нас сумма.', 'That would be the root of a product, but we have a sum.') },
        ],
        solution: ['2 ≠ 3', "√2 + √3 — qo'shilmaydi"],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): ildiz ostilarini
// qo'shish (З34) va oxirigacha chiqarmaslik.
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikki eng ko'p uchraydigan xato",
    'Две самые частые ошибки',
    'The two most common mistakes',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham javob yaqin, lekin to'g'ri emas.",
      'Два задания. В обоих ответ близок, но неверен.',
      'Two tasks. In both the answer is close but wrong.'),
    A('why',
      "Har safar javobni kvadratga oshirib tekshiring.",
      'Каждый раз проверяй ответ возведением в квадрат.',
      'Each time check the answer by squaring it.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Kvadratga oshirish ikki xatoni ham ko'rsatdi.",
      'Оба разобраны. Возведение в квадрат показало обе ошибки.',
      'Both are done. Squaring revealed both mistakes.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√9 + √16'}</Row>,
        ok: L(
          "Ha. Bu ikki ildizning yig'indisi, uch plyus to'rt, ya'ni yetti.",
          'Да. Это сумма двух корней, три плюс четыре, то есть семь.',
          'Yes. This is the sum of two roots, three plus four, that is seven.',
        ),
        question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
        items: [
          { id: 'a', right: true, label: '7' },
          { id: 'b', label: '5', hint: L("Besh bu yigirma beshdan ildiz, ya'ni ildiz ostilari qo'shilgan holat.", 'Пять это корень из двадцати пяти, то есть случай, когда сложили подкоренные.', 'Five is the root of twenty five, the case where the radicands were added.') },
          { id: 'c', label: '√25', hint: L("Ildiz ostilari qo'shilmaydi, bu yerda ikki alohida ildiz turibdi.", 'Подкоренные не складываются, здесь стоят два отдельных корня.', 'Radicands are not added; here there are two separate roots.') },
        ],
        solution: ['√9 = 3,  √16 = 4', '3 + 4 = 7'],
      },
      {
        expr: <Row size="big" align="center">{'√48'}</Row>,
        ok: L(
          "Ha. Qirq sakkiz bu o'n olti karra uch, va o'n olti eng katta to'liq kvadrat.",
          'Да. Сорок восемь это шестнадцать на три, и шестнадцать наибольший полный квадрат.',
          'Yes. Forty eight is sixteen times three, and sixteen is the largest perfect square.',
        ),
        question: L('Oxirigacha sodda ko\'rinish?', 'Простой вид до конца?', 'The fully simple form?'),
        items: [
          { id: 'a', right: true, label: '4√3' },
          { id: 'b', label: '2√12', hint: L("Bu to'g'ri, lekin o'n ikkida yana to'rt bor, demak chiqarish tugamagan.", 'Это верно, но в двенадцати ещё есть четыре, значит вынесение не закончено.', 'True, but twelve still holds a four, so the work is not finished.') },
          { id: 'c', label: '16√3', hint: L("O'n oltidan ildiz to'rt, o'n olti emas.", 'Корень из шестнадцати четыре, а не шестнадцать.', 'The root of sixteen is four, not sixteen.') },
        ],
        solution: ['48 = 16 · 3', '√48 = 4√3'],
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
      "Yozuv ikki qadamdan iborat. Ajratasiz, keyin chiqarasiz.",
      'Запись состоит из двух шагов. Разбиваешь, потом выносишь.',
      'The record has two steps. You split, then you take out.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Yozuv to'ldi. Ikki qadam, ajratish va chiqarish.",
      'Запись заполнена. Два шага, разбить и вынести.',
      'The record is filled. Two steps, split and take out.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['36', '6', '6√2'],
      lines: [
        [{ t: '√72 = √(' }, { slot: '36' }, { t: ' · 2)' }],
        [{ t: '= ' }, { slot: '6' }, { t: '√2   →   ' }, { slot: '6√2' }],
      ],
    },
    tasks: [
      {
        chips: ['25', '5', '5√3'],
        lines: [
          [{ t: '√75 = √(' }, { slot: '25' }, { t: ' · 3)' }],
          [{ t: '= ' }, { slot: '5' }, { t: '√3   →   ' }, { slot: '5√3' }],
        ],
      },
      {
        chips: ['16', '4', '4√2'],
        lines: [
          [{ t: '√32 = √(' }, { slot: '16' }, { t: ' · 2)' }],
          [{ t: '= ' }, { slot: '4' }, { t: '√2   →   ' }, { slot: '4√2' }],
        ],
      },
      {
        chips: ['49', '7', '7√2'],
        lines: [
          [{ t: '√98 = √(' }, { slot: '49' }, { t: ' · 2)' }],
          [{ t: '= ' }, { slot: '7' }, { t: '√2   →   ' }, { slot: '7√2' }],
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
    "Chiqarish, kiritish, qo'shish",
    'Вынести, внести, сложить',
    'Take out, bring in, add',
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
        tag: 'З32',
        ask: L('√18 sodda ko\'rinishda qanday?', 'Каков простой вид √18?', 'What is the simple form of √18?'),
        options: [
          { id: 'ok', right: true, label: '3√2' },
          { id: 'sw', label: '2√3' },
          { id: 'nine', label: '9√2' },
          { id: 'no', label: L("O'zgarmaydi", 'Не меняется', 'It does not change') },
        ],
        hint: L(
          "O'n sakkizni to'liq kvadrat va qolgan qismga ajrating.",
          'Разбей восемнадцать на полный квадрат и остаток.',
          'Split eighteen into a perfect square and the rest.',
        ),
        ok: L(
          "To'qqiz to'liq kvadrat, uning ildizi uch, ikki esa ildiz ostida qoldi.",
          'Девять полный квадрат, его корень три, а два осталось под корнем.',
          'Nine is a perfect square, its root is three, and two stayed under the root.',
        ),
      },
      {
        id: 'q2',
        tag: 'З34',
        ask: L('3√5 + 2√5 nimaga teng?', 'Чему равно 3√5 + 2√5?', 'What does 3√5 + 2√5 equal?'),
        options: [
          { id: 'ok', right: true, label: '5√5' },
          { id: 'ten', label: '5√10' },
          { id: 'six', label: '6√5' },
          { id: 'no', label: L("Qo'shilmaydi", 'Не складываются', 'They do not combine') },
        ],
        hint: L(
          "Ildiz ostilari bir xil, demak hadlar o'xshash.",
          'Подкоренные одинаковы, значит слагаемые подобны.',
          'The radicands are the same, so the terms are alike.',
        ),
        ok: L(
          "Koeffitsiyentlar qo'shildi, ildiz osti esa o'zgarmadi.",
          'Сложились коэффициенты, а подкоренное не изменилось.',
          'The coefficients added and the radicand stayed the same.',
        ),
      },
      {
        id: 'q3',
        tag: 'З34',
        ask: L('√3 + √5 nimaga teng?', 'Чему равно √3 + √5?', 'What does √3 + √5 equal?'),
        options: [
          { id: 'ok', right: true, label: L("Qo'shilmaydi", 'Не складываются', 'They do not combine') },
          { id: 'eight', label: '√8' },
          { id: 'fifteen', label: '√15' },
          { id: 'two', label: '2√8' },
        ],
        hint: L(
          "Ildiz ostilari boshqa, va ularni bir xil qilib bo'lmaydi.",
          'Подкоренные разные, и одинаковыми их не сделать.',
          'The radicands differ and cannot be made the same.',
        ),
        ok: L(
          "Uch ham, besh ham to'liq kvadrat ko'paytuvchiga ega emas.",
          'Ни у трёх, ни у пяти нет множителя, который полный квадрат.',
          'Neither three nor five has a perfect-square factor.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          "Javobni qanday tekshirasiz?",
          'Как проверить ответ?',
          'How do you check the answer?',
        ),
        options: [
          { id: 'sq', right: true, label: L("Javobni kvadratga oshirib", 'Возвести ответ в квадрат', 'Square the answer') },
          { id: 'eye', label: L("Ko'z bilan", 'Глазами', 'By eye') },
          { id: 'add', label: L("Ildiz ostilarini qo'shib", 'Сложить подкоренные', 'Add the radicands') },
          { id: 'half', label: L("Ildiz ostini ikkiga bo'lib", 'Разделить подкоренное на два', 'Halve the radicand') },
        ],
        hint: L(
          "Jadval shu ish bilan yig'ilgan, har bir javob kvadratga oshirilgan.",
          'Таблица собрана именно так, каждый ответ возведён в квадрат.',
          'The table was built exactly that way, each answer squared.',
        ),
        ok: L(
          "Kvadratga oshirish ildiz ostidagi sonni qaytaradi, va javob darrov tekshiriladi.",
          'Возведение в квадрат возвращает подкоренное число, и ответ сразу проверен.',
          'Squaring returns the radicand, so the answer is checked at once.',
        ),
      },
      {
        id: 'q5',
        tag: 'З32',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "√48 dan ko'paytuvchini chiqaring va javobni yig'ing.",
            'Вынеси множитель из √48 и собери ответ.',
            'Take the factor out of √48 and assemble the answer.',
          ),
          lines: [
            [{ t: '√48 = √(' }, { slot: '16' }, { t: ' · 3) = ' }, { slot: '4' }, { t: '√3' }],
          ],
          tiles: [
            { id: 't1', v: '16', x: 12, y: 12 },
            { id: 't2', v: '4', x: 70, y: 14 },
            { id: 't3', v: '12', x: 40, y: 50 },
            { id: 't4', v: '2', x: 78, y: 48 },
            { id: 't5', v: '48', x: 14, y: 52 },
          ],
          hint: L(
            "Eng katta to'liq kvadratni izlang, o'n olti yaraydi.",
            'Ищи наибольший полный квадрат, шестнадцать годится.',
            'Look for the largest perfect square; sixteen works.',
          ),
          doneNote: L(
            "Yig'ildi. O'n oltidan ildiz to'rt, uch esa ildiz ostida qoldi.",
            'Собрано. Корень из шестнадцати четыре, а три осталось под корнем.',
            'Assembled. The root of sixteen is four, and three stayed under the root.',
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
    "Ildiz ostidan chiqadi, hadlar esa qo'shiladi",
    'Из-под корня выносится, а слагаемые складываются',
    'Factors come out, and terms combine',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi, ellikdan ildiz besh karra ikkidan ildiz.",
      'С урока остаётся одна запись, корень из пятидесяти это пять корней из двух.',
      'One record stays with you, the root of fifty is five roots of two.'),
    A('s1',
      "Bugun uch narsani qildingiz. Ko'paytuvchini chiqardingiz, ildiz ostiga kiritdingiz va ildizli hadlarni qo'shdingiz.",
      'Сегодня сделано три вещи. Вынес множитель, внёс его под корень и сложил слагаемые с корнями.',
      'Three things are done today. You took a factor out, brought one in, and added terms with roots.'),
    A('s2',
      "Keyingi darsda irratsional sonlar. Ikkidan ildizning oxirgi raqami nima uchun yo'qligini ko'ramiz.",
      'В следующем уроке иррациональные числа. Увидим, почему у корня из двух нет последней цифры.',
      'The next lesson covers irrational numbers. We will see why the root of two has no last digit.'),
  ],
  props: {
    mark: '√50 = 5√2',
    markNote: L(
      "kvadratga oshirib tekshirildi",
      'проверено возведением в квадрат',
      'checked by squaring',
    ),
    lines: [
      L(
        "To'liq kvadrat ildiz ostidan chiqadi",
        'Полный квадрат выносится из-под корня',
        'A perfect square comes out from under the root',
      ),
      L(
        "Ildiz ostilari bir xil bo'lsa hadlar qo'shiladi",
        'Одинаковые подкоренные — слагаемые складываются',
        'Same radicands mean the terms combine',
      ),
      L(
        "Javob kvadratga oshirib tekshiriladi",
        'Ответ проверяется возведением в квадрат',
        'The answer is checked by squaring',
      ),
    ],
    bridge: L(
      "Keyingi dars: irratsional sonlar",
      'Следующий урок: иррациональные числа',
      'Next lesson: irrational numbers',
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
    null, null, 'З32', 'З16', 'З34',
    'З32', 'З32', 'З34', 'З32', 'З32',
    'З34', 'З4', 'З32', null, null,
  ],
  mechanic: { at: 5, tool: 'transform', kind: 'rewrite' },
  hook: <HookScene />,
  final: FinalScene,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
