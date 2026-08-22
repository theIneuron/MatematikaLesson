// ============================================================================
// 8-sinf, Dars 10. ARIFMETIK KVADRAT ILDIZ.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx` va `twosides.jsx` da.
//
// KARKAS. Ekranlarni sinf karkasi yig'adi: o'n to'rt pozitsiyada 1-darsning
// asboblari turadi, bitta pozitsiyada — blokning mexanikasi. Metodist qarori
// 2026-08-21: dars namunadan ko'pi bilan o'n foizga farq qiladi.
//
// BLOK MEXANIKASI shu darsda — IKKI TOMON (`twosides`), 5-ekran. Ildiz ostidagi
// ifodaning sharti tengsizlik bilan yechiladi, va manfiy songa bo'lganda ishora
// aylanadi. Lupa (9-dars) o'rnida aynan shu asbob, chunki bu darsda savol
// «qiymat qanchaga teng» emas, «qiymat QACHON bor».
//
// 9-DARSDAN FARQI. O'quvchi allaqachon biladi, belgi bitta nomanfiy son beradi.
// Bu darsda uch yangi narsa bor:
//   1) √(a²) modulga teng, ya'ni kvadrat ostidan son o'zi emas, moduli chiqadi;
//   2) ildiz ostidagi ifoda nomanfiy bo'lishi SHART, va bu shart tengsizlik;
//   3) x² = a tenglamada ikki javob, √a esa bitta son — bu boshqa savollar.
//
// DARSLIK. O'zbek darsligi, 8-§, 39-bet — arifmetik ildiz ta'rifi (n = 2).
// Modul yozuvi √(a²) = |a| darslikda alohida bo'lim bo'lib turmaydi, u shu
// darsda o'quvchining o'z harakatidan chiqariladi (3 va 4-ekranlar).
//
// ADASHISHLAR: З16 va З29 — oldingi darslardan. YANGI ikkita:
//   З31 — √(a²) sonning o'zi deb olindi (modul tushib qoldi);
//   З32 — ildiz ostidagi ifodaning sharti tekshirilmadi.
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
  id: 'alg-8-10',
  n: 10,
  row: 11,
  block: 'Б2',
  topic: L(
    'Arifmetik kvadrat ildiz',
    'Арифметический квадратный корень',
    'The arithmetic square root',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Kvadratdan olingan ildiz sonning o'zini emas, MODULINI beradi",
    'Корень из квадрата даёт не само число, а его МОДУЛЬ',
    'The root of a square gives not the number itself but its MODULUS',
  ),
  L(
    "Ildiz ostidagi ifoda nomanfiy bo'lgan joyda ildiz mavjud, boshqa joyda yo'q",
    'Корень существует там, где подкоренное неотрицательно, и больше нигде',
    'A root exists where the radicand is non-negative, and nowhere else',
  ),
  L(
    "x kvadrat a ga teng tenglamada ikki javob, ildiz belgisida esa bitta son",
    'У уравнения x² = a два ответа, а у знака корня одно число',
    'The equation x² = a has two answers, the root sign gives one number',
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
  'З29': {
    what: L(
      'arifmetik ildiz ikki son deb olindi',
      'арифметический корень принят за два числа',
      'the arithmetic root was taken for two numbers',
    ),
    wrong: 'sqrt(36)',
    at: 36,
  },
  'З31': {
    what: L(
      "kvadratdan ildiz sonning o'zi deb olindi, modul tushib qoldi",
      'корень из квадрата принят за само число, модуль потерян',
      'the root of a square was taken for the number itself, the modulus was lost',
    ),
    wrong: 'sqrt((0-5)^2)',
    at: 5,
  },
  'З32': {
    what: L(
      'ildiz ostidagi ifodaning sharti tekshirilmadi',
      'условие подкоренного выражения не проверено',
      'the condition on the radicand was not checked',
    ),
    wrong: 'sqrt(0-1)',
    at: 0,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: ildiz ostida MINUS BESHNING KVADRATI, va savol —
// javob minus beshmi yoki besh. Yakun: o'sha yozuv, javobi bilan.
// ============================================================
const SC_ASK = L('JAVOB QANDAY', 'КАКОЙ ОТВЕТ', 'WHICH ANSWER')

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Ildiz ostida minus beshning kvadrati",
      'Под корнем квадрат минус пяти',
      'The square of minus five under the root',
    )}>
      <path d={rootPath(84, 74, 92)} fill="none" stroke={T.ink} strokeWidth="2.6"
        pathLength="1" className="g8-draw"/>
      <text x="150" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="23"
        fill={T.ink}>{'(−5)²'}</text>

      <g className="g8-seat" style={{ '--d': '2600ms' }}>
        <text x="212" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20"
          fill={T.ink3}>=</text>
        <circle cx="252" cy="74" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="252" y="81" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <g className="g8-seat" style={{ '--d': '3400ms' }}>
        <text x="140" y="126" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fill={T.tip}>{'−5'}</text>
        <text x="200" y="126" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="11" fill={T.ink3}>{t(SC_ASK)}</text>
        <text x="262" y="126" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fill={T.tip}>5</text>
      </g>
      <line x1="112" y1="138" x2="288" y2="138" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

// YAKUN: kvadrat minusni yo'q qiladi, shuning uchun javob modul.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Kvadrat minusni yo'q qiladi",
    'Квадрат стирает минус',
    'The square erases the minus',
  )}>
    <text x="52" y="40" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
      fill={T.ink}>{'−5'}</text>
    <path d="M78 34 L96 34 M90 28 L96 34 L90 40" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
    <text x="126" y="40" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
      fill={T.ink}>{'25'}</text>
    <path d="M152 34 L170 34 M164 28 L170 34 L164 40" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
    <g className="g8-seat" style={{ '--d': '500ms' }}>
      <text x="196" y="41" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fontWeight="700" fill={T.ok}>5</text>
    </g>

    <g className="g8-seat" style={{ '--d': '1000ms' }}>
      <text x="300" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'√(a²) = |a|'}</text>
      <text x="300" y="52" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="9" fill={T.ink3}>{'kvadratga oshirish, keyin ildiz'}</text>
    </g>

    <g className="g8-seat" style={{ '--d': '1400ms' }}>
      <line x1="52" y1="70" x2="348" y2="70" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
      <circle cx="112" cy="70" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
      <circle cx="288" cy="70" r="4.4" fill={T.ok}/>
      <text x="112" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
        fill={T.ink3}>{'−5'}</text>
      <text x="288" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
        fill={T.ink3}>5</text>
      <text x="200" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
        fill={T.ink3}>0</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('KVADRAT OSTIDA', 'КВАДРАТ ПОД КОРНЕМ', 'A SQUARE UNDER THE ROOT'),
  title: L(
    "Ildiz ostida minus beshning kvadrati",
    'Под корнем квадрат минус пяти',
    'The square of minus five under the root',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ildiz ostida minus beshning kvadrati turibdi. Belgi esa nomanfiy son beradi.",
      'Под корнем стоит квадрат минус пяти. А знак корня даёт неотрицательное число.',
      'The square of minus five stands under the root. And the sign gives a non-negative number.'),
    A('why',
      "Taxmin qiling, javob minus besh chiqadi yoki besh.",
      'Предположи, выйдет ответ минус пять или пять.',
      'Predict whether the answer comes out minus five or five.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, javob qaysi?",
      'Как думаешь, какой ответ?',
      'Which answer do you think it is?',
    ),
    items: [
      { id: 'minus', show: '−5' },
      { id: 'plus', show: '5' },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Bu darsning tayanchi — manfiy sonning kvadrati. Uni
// o'quvchi 7-sinfdan biladi, lekin «minus uch kvadrat» va «qavs ichida minus
// uch, kvadrat» farqini har safar chalkashtiradi. Shu farq bugun ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    'Kvadrat va minus',
    'Квадрат и минус',
    'The square and the minus',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Uchtasining qiymati nomanfiy, bittasining manfiy.",
      'Четыре записи. У трёх значение неотрицательное, у одной отрицательное.',
      'Four records. Three have a non-negative value, one is negative.'),
    A('why',
      "Manfiy qiymatlisini toping. Qavsga qarang, kvadrat nimaga tegishli.",
      'Найди ту, у которой значение отрицательное. Смотри на скобки, к чему относится квадрат.',
      'Find the one with a negative value. Look at the brackets to see what the square applies to.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuvning qiymati manfiy?",
      'У какой записи значение отрицательное?',
      'Which record has a negative value?',
    ),
    items: [
      {
        id: 'sq3',
        show: '(−3)²',
        name: L('9', '9', '9'),
        hint: L(
          "Qavs ichidagi butun son kvadratga oshadi, minus minusga urilib yo'qoladi.",
          'В квадрат идёт всё, что в скобках, и минус на минус исчезает.',
          'Everything in the brackets is squared, and minus times minus cancels out.',
        ),
      },
      {
        id: 'msq3',
        show: '−3²',
        right: true,
        name: L('−9', '−9', '−9'),
      },
      {
        id: 'sq0',
        show: '0²',
        name: L('0', '0', '0'),
        hint: L(
          "Nolning kvadrati nol, va nol manfiy emas.",
          'Квадрат нуля это нуль, а нуль не отрицателен.',
          'The square of zero is zero, and zero is not negative.',
        ),
      },
      {
        id: 'sq7',
        show: '(−7)²',
        name: L('49', '49', '49'),
        hint: L(
          "Minus yettining kvadrati qirq to'qqiz, chunki minus minusga urildi.",
          'Квадрат минус семи сорок девять, потому что минус умножился на минус.',
          'The square of minus seven is forty nine, minus times minus.',
        ),
      },
    ],
    after: L(
      "Ha. Bu yerda kvadrat faqat uchga tegishli, minus esa tashqarida qoladi.",
      'Да. Здесь квадрат относится только к трём, а минус остаётся снаружи.',
      'Yes. Here the square applies to the three only, and the minus stays outside.',
    ),
  },
}

// ============================================================
// EKRAN 3. ILDIZ OSTINI BURAYMIZ (1-darsning `steppers` asbobi). Yozuv
// √(x − 4): o'quvchi x ni buraydi va QIYMAT QAYERDA TUGAShINI o'z qo'li bilan
// topadi. Bu 5-ekrandagi tengsizlikning tayyorgarligi (З32).
// ============================================================
const S3 = {
  eyebrow: L('QAYERDA BOR', 'ГДЕ ЕСТЬ ЗНАЧЕНИЕ', 'WHERE THE VALUE EXISTS'),
  title: L(
    'x ni burang, ildiz esa hisoblanadi',
    'Крути x, а корень считается сам',
    'Turn x, and the root computes itself',
  ),
  audio: [
    A('mount',
      "Ildiz ostida iks minus to'rt turibdi. Iksni siz buraysiz.",
      'Под корнем стоит икс минус четыре. Икс крутишь ты.',
      'Under the root stands x minus four. You turn the x.'),
    A('why',
      "Uch maqsad beriladi. Ildiz aynan aytilgan songa teng bo'lsin.",
      'Даны три цели. Пусть корень будет равен названному числу.',
      'Three targets are given. Make the root equal the number named.'),
    A('why',
      "Oxirida esa iksni kamaytirib boring va qiymat qayerda tugashini ko'ring.",
      'А в конце уменьшай икс и посмотри, где значение заканчивается.',
      'At the end keep decreasing x and see where the value ends.'),
  ],
  props: {
    cols: [
      {
        id: 'x',
        label: L('x ning qiymati', 'значение x', 'the value of x'),
        start: 5, min: 0, max: 13, step: 1,
        risky: true,
      },
    ],
    // ИЛДИЗ СЧИТАЕТСЯ ИЗ ЗАПИСИ, а не берётся числом из данных.
    calc: (v) => (v[0] - 4 < 0 ? null : Math.round(Math.sqrt(v[0] - 4) * 100) / 100),
    resultLabel: L('√(x − 4)', '√(x − 4)', '√(x − 4)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "Iks to'rtga teng bo'lganda ildiz ostida nol turadi, va ildiz nolga teng. Bu yaraydi.",
      'Когда икс равен четырём, под корнем нуль, и корень равен нулю. Это годится.',
      'When x equals four the radicand is zero and the root is zero. That is fine.',
    ),
    goals: [
      {
        value: 2,
        ask: L(
          "Ildiz 2 ga teng bo'lsin",
          'Пусть корень будет равен 2',
          'Make the root equal 2',
        ),
        after: L(
          "Sakkiz. Ildiz ostida to'rt qoldi, uning ildizi ikki.",
          'Восемь. Под корнем осталось четыре, его корень равен двум.',
          'Eight. The radicand became four, and its root is two.',
        ),
      },
      {
        value: 3,
        ask: L(
          "Endi ildiz 3 ga teng bo'lsin",
          'Теперь пусть корень будет равен 3',
          'Now make the root equal 3',
        ),
        after: L(
          "O'n uch. Ildiz ostida to'qqiz, uning ildizi uch.",
          'Тринадцать. Под корнем девять, его корень равен трём.',
          'Thirteen. The radicand is nine, and its root is three.',
        ),
      },
      {
        value: 0,
        ask: L(
          "Oxirgisi, ildiz nolga teng bo'lsin",
          'Последняя, пусть корень будет равен 0',
          'The last one, make the root equal 0',
        ),
        after: L(
          "To'rt. Bu chegara, undan pastda nima bo'lishini ko'ramiz.",
          'Четыре. Это граница, посмотрим, что будет ниже неё.',
          'Four. That is the boundary; let us see what happens below it.',
        ),
      },
    ],
    ask: L(
      "Ildiz 2 ga teng bo'lsin",
      'Пусть корень будет равен 2',
      'Make the root equal 2',
    ),
    ask2: L(
      "Endi iksni yana kamaytiring",
      'Теперь уменьши икс ещё',
      'Now decrease x further',
    ),
    broke: L(
      "Iks to'rtdan kichik, ildiz ostida manfiy son, va qiymat yo'q. Demak shart bitta, iks minus to'rt nomanfiy bo'lsin.",
      'Икс меньше четырёх, под корнем отрицательное, и значения нет. Значит условие одно, икс минус четыре неотрицательно.',
      'x is less than four, the radicand is negative and there is no value. So the condition is one, x minus four is non-negative.',
    ),
  },
}

// ============================================================
// EKRAN 4. KVADRAT OSTIDAN NIMA CHIQADI (1-darsning `pick` asbobi va
// PODSTANOVKA jadvali). Xukdagi savolga javob shu ekranda beriladi (З31).
// ============================================================
const S4 = {
  eyebrow: L('KVADRATDAN', 'ИЗ КВАДРАТА', 'OUT OF THE SQUARE'),
  title: L(
    'Kvadrat ostidan nima chiqadi',
    'Что выходит из квадрата',
    'What comes out of the square',
  ),
  audio: [
    A('mount',
      "Xukdagi yozuvga qaytdik. Ildiz ostida minus beshning kvadrati.",
      'Вернулись к записи с хука. Под корнем квадрат минус пяти.',
      'Back to the record from the hook. The square of minus five under the root.'),
    A('why',
      "Avval ildiz ostidagi amalni bajaring, keyin ildizni oling.",
      'Сначала выполни действие под корнем, потом бери корень.',
      'First do the operation under the root, then take the root.'),
  ],
  props: {
    ask: L(
      "√((−5)²) nimaga teng?",
      'Чему равен √((−5)²)?',
      'What does √((−5)²) equal?',
    ),
    items: [
      {
        id: 'five',
        show: '5',
        right: true,
        name: L('modul', 'модуль', 'the modulus'),
      },
      {
        id: 'mfive',
        show: '−5',
        hint: L(
          "Ildiz belgisi manfiy son bermaydi. Kvadrat esa minusni yo'q qildi.",
          'Знак корня не даёт отрицательного числа. А квадрат уже стёр минус.',
          'The root sign never gives a negative number. And the square already erased the minus.',
        ),
      },
      {
        id: 'ts',
        show: '25',
        hint: L(
          "Yigirma besh bu ildiz ostidagi son. Ildizni olish qoldi.",
          'Двадцать пять это подкоренное число. Осталось взять корень.',
          'Twenty five is the radicand. The root still has to be taken.',
        ),
      },
      {
        id: 'none',
        show: L("qiymat yo'q", 'значения нет', 'no value'),
        hint: L(
          "Minus beshning kvadrati yigirma besh, u nomanfiy. Demak ildiz bor.",
          'Квадрат минус пяти двадцать пять, он неотрицателен. Значит корень есть.',
          'The square of minus five is twenty five, which is non-negative. So the root exists.',
        ),
      },
    ],
    after: L(
      "Ha. Kvadrat minusni yo'q qildi, ildiz esa nomanfiy sonni qaytardi.",
      'Да. Квадрат стёр минус, а корень вернул неотрицательное число.',
      'Yes. The square erased the minus and the root returned a non-negative number.',
    ),
    proof: {
      varLabel: L('a', 'a', 'a'),
      leftLabel: L('a²', 'a²', 'a²'),
      rightLabel: L('√(a²)', '√(a²)', '√(a²)'),
      noValue: L("qiymat yo'q", 'значения нет', 'no value'),
      rows: [
        { v: '5', left: '25', right: '5' },
        { v: '−5', left: '25', right: '5' },
        { v: '0', left: '0', right: '0' },
      ],
    },
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — IKKI TOMON. Bu ekran 1-darsdan farq
// qiladigan YAGONA ekran (metodist qarori 2026-08-21, o'n foiz).
//
// 3-ekranda o'quvchi qiymat qayerda tugashini QO'LI bilan topdi. Bu yerda
// o'sha savolga yozuv bilan javob beriladi: shart tengsizlik bo'lib yechiladi,
// va manfiy songa bo'lganda ishora AYLANADI.
// ============================================================
const S5 = {
  eyebrow: L('IKKI TOMON', 'ДВЕ ЧАСТИ', 'BOTH SIDES'),
  title: L(
    "√(6 − 2x) qachon mavjud",
    'Когда существует √(6 − 2x)',
    'When √(6 − 2x) exists',
  ),
  audio: [
    A('mount',
      "Ildiz ostidagi ifoda nomanfiy bo'lishi shart. Shuni tengsizlik qilib yozdik.",
      'Подкоренное обязано быть неотрицательным. Это и записано неравенством.',
      'The radicand must be non-negative. That is what the inequality says.'),
    A('why',
      "Ikki tomon bilan bir xil amal bajariladi. Qadamni tanlang.",
      'С обеими частями делают одно и то же действие. Выбери шаг.',
      'The same operation is done to both sides. Choose the step.'),
    W('a2',
      "Manfiy songa bo'linganda ishora aylanadi, va yechim boshqa tomonga o'tadi.",
      'При делении на отрицательное знак переворачивается, и решение уходит в другую сторону.',
      'Dividing by a negative flips the sign, and the solution moves to the other side.'),
  ],
  props: {
    from: -6,
    to: 6,
    start: { left: '6 − 2x', rel: '≥', right: '0', set: null },
    steps: [
      {
        ask: L('Nima qilamiz?', 'Что делаем?', 'What do we do?'),
        actions: [
          {
            id: 'sub6',
            right: true,
            label: L(
              "Ikki tomondan 6 ni ayirish",
              'Вычесть 6 из обеих частей',
              'Subtract 6 from both sides',
            ),
            to: { left: '−2x', rel: '≥', right: '−6' },
          },
          {
            id: 'add6',
            label: L(
              "Ikki tomonga 6 qo'shish",
              'Прибавить 6 к обеим частям',
              'Add 6 to both sides',
            ),
            hint: L(
              "Qo'shsak, chapda o'n ikki minus ikki iks bo'ladi, olti ketmaydi.",
              'Если прибавить, слева станет двенадцать минус два икс, шестёрка не уйдёт.',
              'Adding gives twelve minus two x on the left; the six does not leave.',
            ),
          },
        ],
      },
      {
        ask: L('Endi nima qilamiz?', 'Что теперь?', 'And now?'),
        actions: [
          {
            id: 'divflip',
            right: true,
            label: L(
              "Minus 2 ga bo'lish va ishorani aylantirish",
              'Разделить на минус 2 и перевернуть знак',
              'Divide by minus 2 and flip the sign',
            ),
            to: { left: 'x', rel: '≤', right: '3' },
            set: { le: 3 },
            flip: true,
            note: L(
              "Manfiy songa bo'lganda ishora aylanadi.",
              'При делении на отрицательное знак переворачивается.',
              'Dividing by a negative flips the sign.',
            ),
          },
          {
            id: 'divkeep',
            label: L(
              "Ishorani qoldirib bo'lish",
              'Разделить, оставив знак',
              'Divide and keep the sign',
            ),
            hint: L(
              "Tekshiring, iks beshga teng bo'lganda ildiz ostida nima chiqadi.",
              'Проверь, что выйдет под корнем при иксе, равном пяти.',
              'Check what the radicand becomes when x equals five.',
            ),
            counter: {
              at: 'x = 5',
              gives: '6 − 10 = −4',
              verdict: L('manfiy', 'отрицательное', 'negative'),
            },
          },
        ],
      },
    ],
    note: L(
      "Yozuv iks uchdan katta bo'lmagan joyda mavjud.",
      'Запись существует там, где икс не больше трёх.',
      'The record exists where x is not greater than three.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways` asbobi): √((−7)²) ni ikki yo'l
// bilan hisoblash. Ikkalasi ham yettini beradi, ya'ni modul.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Bitta yozuv, ikki yo'l",
    'Одна запись, два пути',
    'One record, two ways',
  ),
  audio: [
    A('mount',
      "Bitta yozuv va ikki yo'l. Birinchisi amallar bilan, ikkinchisi modul bilan.",
      'Одна запись и два пути. Первый через действия, второй через модуль.',
      'One record and two ways. The first through the operations, the second through the modulus.'),
    W('w2',
      "Birinchi yo'lda avval kvadrat, keyin ildiz, va yetti chiqdi.",
      'В первом пути сначала квадрат, потом корень, и вышло семь.',
      'In the first way the square comes first, then the root, and it gives seven.'),
    W('w4',
      "Ikkinchi yo'lda modul olinadi, va u ham yetti beradi.",
      'Во втором пути берут модуль, и он тоже даёт семь.',
      'In the second way the modulus is taken, and it also gives seven.'),
  ],
  props: {
    stepMs: 1400,
    blocks: [
      {
        name: L('1-USUL — AVVAL KVADRAT', 'СПОСОБ 1 — СНАЧАЛА КВАДРАТ', 'METHOD 1 — SQUARE FIRST'),
        lead: L(
          "Ildiz ostidagi amalni bajaramiz, keyin ildizni olamiz",
          'Выполняем действие под корнем, потом берём корень',
          'We do the operation under the root, then take the root',
        ),
        rows: [
          { text: '(−7)² = 49' },
          { text: '√49 = 7', tone: 'ok', note: L('javob', 'ответ', 'the answer') },
        ],
      },
      {
        name: L('2-USUL — MODUL ORQALI', 'СПОСОБ 2 — ЧЕРЕЗ МОДУЛЬ', 'METHOD 2 — THROUGH THE MODULUS'),
        lead: L(
          "Kvadratdan ildiz modulni beradi, moduli esa noldan uzoqlik",
          'Корень из квадрата даёт модуль, а модуль это удалённость от нуля',
          'The root of a square gives the modulus, and the modulus is the distance from zero',
        ),
        rows: [
          { text: '√(a²) = |a|' },
          { text: '|−7| = 7', tone: 'ok', note: L('javob', 'ответ', 'the answer') },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM 7 BERDI', 'ОБА ДАЛИ 7', 'BOTH GAVE 7'),
        lead: L(
          "Birinchisi son bilan ishlaydi, ikkinchisi harf bilan ham ishlaydi",
          'Первый работает с числом, второй работает и с буквой',
          'The first works with a number, the second works with a letter too',
        ),
        rows: [{ text: '√((−7)²) = 7', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. YOZUVNI QISMLARGA AJRATAMIZ (1-darsning `parts` asbobi).
// Belgi, ildiz osti va qiymat — uchta rol, va har birining sharti.
// ============================================================
const S7 = {
  eyebrow: L('QISMLARGA', 'ПО ЧАСТЯМ', 'PART BY PART'),
  title: L(
    "Uchta qism va uchta shart",
    'Три части и три условия',
    'Three parts and three conditions',
  ),
  audio: [
    A('mount',
      "Yozuv uch qismdan iborat, va har birining o'z sharti bor.",
      'Запись состоит из трёх частей, и у каждой своё условие.',
      'The record has three parts, and each has its own condition.'),
    W('p2',
      "Ildiz ostida kvadrat turibdi, va u har qanday harfda nomanfiy.",
      'Под корнем стоит квадрат, и он неотрицателен при любой букве.',
      'A square stands under the root, and it is non-negative for any letter.'),
    W('p3',
      "Qiymat esa modul, ya'ni harf manfiy bo'lsa ham javob nomanfiy.",
      'А значение это модуль, то есть даже при отрицательной букве ответ неотрицателен.',
      'And the value is the modulus, so even for a negative letter the answer is non-negative.'),
  ],
  props: {
    frac: {
      num: [{ t: '√', id: 'sign' }, { t: 'a²', id: 'under' }],
      den: [{ t: '= |a|', id: 'val' }],
    },
    steps: [
      {
        focus: 'sign',
        text: L(
          "Ildiz belgisi. U har doim nomanfiy son beradi, bu uning sharti.",
          'Знак корня. Он всегда даёт неотрицательное число, это его условие.',
          'The root sign. It always gives a non-negative number, that is its condition.',
        ),
      },
      {
        focus: 'under',
        text: L(
          "Ildiz ostidagi ifoda. Bu yerda u kvadrat, shuning uchun har qanday a da nomanfiy.",
          'Подкоренное выражение. Здесь это квадрат, поэтому при любом a оно неотрицательно.',
          'The radicand. Here it is a square, so it is non-negative for any a.',
        ),
      },
      {
        focus: 'val',
        text: L(
          "Qiymat. U a ning moduli, ya'ni a manfiy bo'lsa javob minus a bo'ladi.",
          'Значение. Это модуль a, то есть при отрицательном a ответ равен минус a.',
          'The value. It is the modulus of a, so for negative a the answer is minus a.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Modulning ikki tik chizig'ini 1841 yilda Karl Vayershtrass kiritgan, ya'ni ildiz belgisidan uch yuz yil keyin.",
        'Две вертикальные черты модуля ввёл Карл Вейерштрасс в 1841 году, то есть на триста лет позже знака корня.',
        'The two vertical bars of the modulus were introduced by Karl Weierstrass in 1841, three centuries after the root sign.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild` asbobi). Shu yerda dars XUKKA
// QAYTADI: yig'ilgan qoida xukdagi savolga javob beradi.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Kvadratdan ildiz qoidasi",
    'Правило корня из квадрата',
    'The rule for the root of a square',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon qildingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже сделал руками. Теперь собери его.',
      'Everything the rule needs is already done by your hands. Now assemble it.'),
    W('card',
      "Darslik matni ochildi, va xukdagi yozuv javobi bilan qaytdi.",
      'Открылся текст учебника, и запись с хука вернулась с ответом.',
      'The textbook wording opened, and the record from the hook is back with its answer.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("Kvadratdan ildiz", 'Корень из квадрата', 'The root of a square') },
      { id: 'f2', label: L("a ning modulini beradi", 'даёт модуль a', 'gives the modulus of a') },
      { id: 'f3', label: L("a nomanfiy bo'lsa a", 'если a неотрицательно, это a', 'if a is non-negative it is a') },
      { id: 'f4', label: L("manfiy bo'lsa minus a", 'если отрицательно, это минус a', 'if negative it is minus a') },
      { id: 'w1', label: L("a ning o'zini beradi", 'даёт само a', 'gives a itself') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Jadvalda a minus besh bo'lganda javob besh chiqdi, minus besh emas.",
      'Так не складывается. В таблице при a минус пять ответ вышел пять, а не минус пять.',
      'That does not fit. In the table, for a equal to minus five the answer came out five, not minus five.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        L(
          "Har qanday a uchun √(a²) = |a|, ya'ni kvadratdan ildiz modulni beradi",
          'При любом a верно √(a²) = |a|, то есть корень из квадрата даёт модуль',
          'For any a we have √(a²) = |a|, so the root of a square gives the modulus',
        ),
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 8-§, 39-bet (n = 2); modul yozuvi darsda chiqarildi",
        'Учебник, § 8, стр. 39 (n = 2); запись с модулем выведена в уроке',
        'Textbook, section 8, page 39 (n = 2); the modulus form is derived in the lesson',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L('√((−5)²) = −5', '√((−5)²) = −5', '√((−5)²) = −5'),
      right: L('√((−5)²) = 5', '√((−5)²) = 5', '√((−5)²) = 5'),
      winner: 'right',
      note: L(
        "Belgi manfiy son bermaydi, shuning uchun javob besh",
        'Знак не даёт отрицательного числа, поэтому ответ пять',
        'The sign never gives a negative number, so the answer is five',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): kvadratdan ildiz. Beshinchi
// topshiriqda ikki ildiz bitta yozuvda — og'irlik STRUKTURADA.
// ============================================================
const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    'Kvadratdan ildizni toping',
    'Найди корень из квадрата',
    'Find the root of the square',
  ),
  audio: [
    A('mount',
      "Besh yozuv. Har javobdan keyin yechim ochiladi.",
      'Пять записей. После каждого ответа открывается решение.',
      'Five records. After each answer the solution opens.'),
    A('why',
      "Har safar bir xil tartib. Avval kvadrat, keyin ildiz.",
      'Каждый раз один порядок. Сначала квадрат, потом корень.',
      'Every time the same order. First the square, then the root.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Javob har safar nomanfiy chiqdi.",
      'Все пять разобраны. Ответ каждый раз выходил неотрицательным.',
      'All five are done. The answer came out non-negative every time.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√(7²)'}</Row>,
        ok: L(
          "Ha. Yettining kvadrati qirq to'qqiz, ildizi yetti.",
          'Да. Квадрат семи сорок девять, корень семь.',
          'Yes. The square of seven is forty nine, the root is seven.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '7' },
          { id: 'b', label: '49', hint: L("Qirq to'qqiz bu ildiz ostidagi son.", 'Сорок девять это подкоренное число.', 'Forty nine is the radicand.') },
          { id: 'c', label: '14', hint: L("Bu ikki karra yetti, kvadrat emas.", 'Это дважды семь, а не квадрат.', 'That is twice seven, not a square.') },
        ],
        solution: ['7² = 49', '√49 = 7'],
      },
      {
        expr: <Row size="big" align="center">{'√((−7)²)'}</Row>,
        ok: L(
          "Ha. Minus yettining kvadrati ham qirq to'qqiz, ildizi yetti.",
          'Да. Квадрат минус семи тоже сорок девять, корень семь.',
          'Yes. The square of minus seven is also forty nine, the root is seven.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '7' },
          { id: 'b', label: '−7', hint: L("Ildiz belgisi manfiy son bermaydi.", 'Знак корня не даёт отрицательного числа.', 'The root sign never gives a negative number.') },
          { id: 'c', label: L("qiymat yo'q", 'значения нет', 'no value'), hint: L("Ildiz ostida qirq to'qqiz, u nomanfiy.", 'Под корнем сорок девять, оно неотрицательно.', 'The radicand is forty nine, which is non-negative.') },
        ],
        solution: ['(−7)² = 49', '√49 = 7'],
      },
      {
        expr: <Row size="big" align="center">{'√(0²)'}</Row>,
        ok: L(
          "Ha. Nolning kvadrati nol, ildizi ham nol.",
          'Да. Квадрат нуля нуль, и корень нуль.',
          'Yes. The square of zero is zero, and the root is zero.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: L("qiymat yo'q", 'значения нет', 'no value'), hint: L("Nol nomanfiy son, ildizi bor.", 'Нуль неотрицателен, корень есть.', 'Zero is non-negative, the root exists.') },
          { id: 'c', label: '1', hint: L("Birning kvadrati bir, nolning esa nol.", 'Квадрат единицы единица, а нуля нуль.', 'The square of one is one, of zero is zero.') },
        ],
        solution: ['0² = 0', '√0 = 0'],
      },
      {
        expr: <Row size="big" align="center">{'√((−12)²)'}</Row>,
        ok: L(
          "Ha. Minus o'n ikkining kvadrati yuz qirq to'rt, ildizi o'n ikki.",
          'Да. Квадрат минус двенадцати сто сорок четыре, корень двенадцать.',
          'Yes. The square of minus twelve is one hundred forty four, the root is twelve.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '−12', hint: L("Modul manfiy bo'lmaydi, u noldan uzoqlik.", 'Модуль не бывает отрицательным, это удалённость от нуля.', 'A modulus is never negative, it is a distance from zero.') },
          { id: 'c', label: '144', hint: L("Yuz qirq to'rt bu ildiz ostidagi son.", 'Сто сорок четыре это подкоренное число.', 'One hundred forty four is the radicand.') },
        ],
        solution: ['(−12)² = 144', '√144 = 12'],
      },
      {
        expr: <Row size="big" align="center">{'√((−4)²) − √(4²)'}</Row>,
        ok: L(
          "Ha. Ikkalasi ham to'rt beradi, ayirma esa nol.",
          'Да. Оба дают четыре, а разность нуль.',
          'Yes. Both give four, and the difference is zero.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '−8', hint: L("Birinchi ildiz minus to'rt emas, to'rt. Modul manfiy bo'lmaydi.", 'Первый корень не минус четыре, а четыре. Модуль не бывает отрицательным.', 'The first root is not minus four but four. A modulus is never negative.') },
          { id: 'c', label: '8', hint: L("Bu yig'indi bo'lardi, bizda esa ayirma.", 'Это была бы сумма, а у нас разность.', 'That would be the sum, but we have a difference.') },
        ],
        solution: ['√((−4)²) = 4', '√(4²) = 4', '4 − 4 = 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): ildiz QACHON mavjud. Bu ekran
// З32 ni davolaydi — shart tekshirilmasligi.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    'Qachon mavjud',
    'Когда существует',
    'When it exists',
  ),
  audio: [
    A('mount',
      "Uch yozuv, va har birida ildiz ostida harf turibdi.",
      'Три записи, и в каждой под корнем стоит буква.',
      'Three records, and in each a letter stands under the root.'),
    A('why',
      "Har safar bir xil savol. Ildiz ostidagi ifoda qachon nomanfiy.",
      'Каждый раз один вопрос. Когда подкоренное неотрицательно.',
      'Every time the same question. When is the radicand non-negative.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Shart har safar ildiz ostidagi ifodadan chiqdi.",
      'Все три разобраны. Условие каждый раз выходило из подкоренного.',
      'All three are done. The condition came from the radicand every time.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√(x − 3)'}</Row>,
        ok: L(
          "Ha. Iks minus uch nomanfiy bo'lishi kerak, demak iks uchdan kichik emas.",
          'Да. Икс минус три должно быть неотрицательным, значит икс не меньше трёх.',
          'Yes. x minus three must be non-negative, so x is not less than three.',
        ),
        question: L('Qachon qiymati bor?', 'Когда есть значение?', 'When does it have a value?'),
        items: [
          { id: 'a', right: true, label: 'x ≥ 3' },
          { id: 'b', label: 'x ≤ 3', hint: L("Iks ikkiga teng bo'lsa, ildiz ostida minus bir chiqadi.", 'Если икс равен двум, под корнем выйдет минус один.', 'If x equals two the radicand becomes minus one.') },
          { id: 'c', label: L('Har qanday x', 'При любом x', 'For any x'), hint: L("Iks noldan kichik bo'lganda ham ildiz ostida manfiy son bor.", 'При иксе меньше нуля под корнем тоже отрицательное.', 'For x below zero the radicand is negative too.') },
        ],
        solution: ['x − 3 ≥ 0', 'x ≥ 3'],
      },
      {
        expr: <Row size="big" align="center">{'√(−x)'}</Row>,
        ok: L(
          "Ha. Minus iks nomanfiy bo'lishi uchun iksning o'zi nomusbat bo'lishi kerak.",
          'Да. Чтобы минус икс было неотрицательным, сам икс должен быть неположительным.',
          'Yes. For minus x to be non-negative, x itself must be non-positive.',
        ),
        question: L('Qachon qiymati bor?', 'Когда есть значение?', 'When does it have a value?'),
        items: [
          { id: 'a', right: true, label: 'x ≤ 0' },
          { id: 'b', label: L('Hech qachon', 'Никогда', 'Never'), hint: L("Iks minus to'rtga teng bo'lsa, ildiz ostida to'rt turadi.", 'Если икс равен минус четырём, под корнем стоит четыре.', 'If x equals minus four the radicand is four.') },
          { id: 'c', label: 'x ≥ 0', hint: L("Iks to'qqizga teng bo'lsa, ildiz ostida minus to'qqiz chiqadi.", 'Если икс равен девяти, под корнем выйдет минус девять.', 'If x equals nine the radicand becomes minus nine.') },
        ],
        solution: ['−x ≥ 0', 'x ≤ 0'],
      },
      {
        expr: <Row size="big" align="center">{'√(x²)'}</Row>,
        ok: L(
          "Ha. Kvadrat har qanday harfda nomanfiy, shuning uchun shart bajarilib turadi.",
          'Да. Квадрат неотрицателен при любой букве, поэтому условие выполнено всегда.',
          'Yes. A square is non-negative for any letter, so the condition always holds.',
        ),
        question: L('Qachon qiymati bor?', 'Когда есть значение?', 'When does it have a value?'),
        items: [
          { id: 'a', right: true, label: L('Har qanday x da', 'При любом x', 'For any x') },
          { id: 'b', label: 'x ≥ 0', hint: L("Iks manfiy bo'lsa ham kvadrati nomanfiy, demak ildiz bor.", 'Даже при отрицательном иксе квадрат неотрицателен, значит корень есть.', 'Even for negative x the square is non-negative, so the root exists.') },
          { id: 'c', label: L('Faqat x nolda', 'Только при x равном нулю', 'Only when x is zero'), hint: L("Iksning har qanday qiymatida kvadrat nomanfiy.", 'При любом значении икса квадрат неотрицателен.', 'For any value of x the square is non-negative.') },
        ],
        solution: ['x² ≥ 0', 'har qanday x'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`): TENGLAMA va YOZUV boshqa
// savollar (З29). Tenglamada ikki javob, belgida bitta.
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    'Tenglama va yozuv',
    'Уравнение и запись',
    'The equation and the record',
  ),
  audio: [
    A('mount',
      "Uchta savol. Ikkitasi tenglama haqida, bittasi ildiz belgisi haqida.",
      'Три вопроса. Два про уравнение, один про знак корня.',
      'Three questions. Two about an equation, one about the root sign.'),
    A('why',
      "Farqni ushlab turing. Tenglama yechimlarni so'raydi, belgi bitta son beradi.",
      'Держи разницу. Уравнение спрашивает решения, а знак даёт одно число.',
      'Hold on to the difference. An equation asks for solutions, the sign gives one number.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Tenglama va belgi boshqa savollar.",
      'Все три разобраны. Уравнение и знак это разные вопросы.',
      'All three are done. An equation and the sign are different questions.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² = 36'}</Row>,
        ok: L(
          "Ha. Olti va minus olti, ikkalasining kvadrati o'ttiz olti.",
          'Да. Шесть и минус шесть, квадрат обоих тридцать шесть.',
          'Yes. Six and minus six, the square of both is thirty six.',
        ),
        question: L('Nechta yechimi bor?', 'Сколько у него решений?', 'How many solutions does it have?'),
        items: [
          { id: 'a', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'b', label: L('Bitta', 'Одно', 'One'), hint: L("Minus oltining kvadrati ham o'ttiz olti beradi.", 'Квадрат минус шести тоже даёт тридцать шесть.', 'The square of minus six also gives thirty six.') },
          { id: 'c', label: L('Hech qanday', 'Ни одного', 'None'), hint: L("Oltining kvadrati o'ttiz olti, demak yechim bor.", 'Квадрат шести тридцать шесть, значит решение есть.', 'The square of six is thirty six, so a solution exists.') },
        ],
        solution: ['6² = 36', '(−6)² = 36'],
      },
      {
        expr: <Row size="big" align="center">{'√36'}</Row>,
        ok: L(
          "Ha. Belgi bitta nomanfiy sonni beradi, ya'ni oltini.",
          'Да. Знак даёт одно неотрицательное число, то есть шесть.',
          'Yes. The sign gives one non-negative number, that is six.',
        ),
        question: L('Bu yozuv nechta son beradi?', 'Сколько чисел даёт эта запись?', 'How many numbers does this record give?'),
        items: [
          { id: 'a', right: true, label: L('Bitta, 6', 'Одно, 6', 'One, 6') },
          { id: 'b', label: L('Ikkita, 6 va −6', 'Два, 6 и −6', 'Two, 6 and −6'), hint: L("Ikki son tenglamada bo'ladi, belgi esa nomanfiyni tanlaydi.", 'Два числа бывают у уравнения, а знак выбирает неотрицательное.', 'Two numbers belong to the equation; the sign picks the non-negative one.') },
          { id: 'c', label: L('Hech qanday', 'Ни одного', 'None'), hint: L("O'ttiz olti nomanfiy, demak ildizi bor.", 'Тридцать шесть неотрицательно, значит корень есть.', 'Thirty six is non-negative, so the root exists.') },
        ],
        solution: ['√36 = 6', '−√36 = −6'],
      },
      {
        expr: <Row size="big" align="center">{'x² = −4'}</Row>,
        ok: L(
          "Ha. Hech qanday sonning kvadrati manfiy bo'lmaydi.",
          'Да. Квадрат никакого числа не бывает отрицательным.',
          'Yes. No number has a negative square.',
        ),
        question: L('Nechta yechimi bor?', 'Сколько у него решений?', 'How many solutions does it have?'),
        items: [
          { id: 'a', right: true, label: L('Hech qanday', 'Ни одного', 'None') },
          { id: 'b', label: L('Ikkita', 'Два', 'Two'), hint: L("Ikki son ham kvadratda musbat beradi, minus emas.", 'Оба числа в квадрате дадут положительное, а не минус.', 'Both numbers squared give a positive, not a minus.') },
          { id: 'c', label: L('Bitta, −2', 'Одно, −2', 'One, −2'), hint: L("Minus ikkining kvadrati to'rt, minus to'rt emas.", 'Квадрат минус двух четыре, а не минус четыре.', 'The square of minus two is four, not minus four.') },
        ],
        solution: ['a · a ≥ 0', 'x² = −4 — yechim yo\'q'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): modul tushib qolishi
// (З31). Ikkinchi topshiriq HARF bilan — bu darsning eng chuqur joyi.
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Modul tushib qolganda",
    'Когда модуль потерян',
    'When the modulus is lost',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Birinchisida son, ikkinchisida harf.",
      'Два задания. В первом число, во втором буква.',
      'Two tasks. A number in the first, a letter in the second.'),
    A('why',
      "Har safar so'rang, javob nomanfiy chiqdimi.",
      'Каждый раз спрашивай, вышел ли ответ неотрицательным.',
      'Each time ask whether the answer came out non-negative.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Harf manfiy bo'lganda javob minus harf bo'ladi.",
      'Оба разобраны. Когда буква отрицательна, ответ равен минус букве.',
      'Both are done. When the letter is negative the answer is minus the letter.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = −8,   √(a²) = ?'}</Row>,
        ok: L(
          "Ha. Minus sakkizning kvadrati oltmish to'rt, ildizi sakkiz.",
          'Да. Квадрат минус восьми шестьдесят четыре, корень восемь.',
          'Yes. The square of minus eight is sixty four, the root is eight.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '8' },
          { id: 'b', label: '−8', hint: L("Bu a ning o'zi. Ildiz esa modulni beradi, u nomanfiy.", 'Это само a. А корень даёт модуль, он неотрицателен.', 'That is a itself. But the root gives the modulus, which is non-negative.') },
          { id: 'c', label: '64', hint: L("Oltmish to'rt bu ildiz ostidagi son.", 'Шестьдесят четыре это подкоренное число.', 'Sixty four is the radicand.') },
        ],
        solution: ['(−8)² = 64', '√64 = 8', '|−8| = 8'],
      },
      {
        expr: <Row size="big" align="center">{'a < 0,   √(a²) = ?'}</Row>,
        ok: L(
          "Ha. Harf manfiy bo'lganda moduli minus harfga teng, va u musbat chiqadi.",
          'Да. Когда буква отрицательна, её модуль равен минус букве, и это положительное.',
          'Yes. When the letter is negative its modulus equals minus the letter, which is positive.',
        ),
        question: L('Qiymati nimaga teng?', 'Чему равно значение?', 'What does the value equal?'),
        items: [
          { id: 'a', right: true, label: '−a' },
          { id: 'b', label: 'a', hint: L("a manfiy, javob esa nomanfiy bo'lishi kerak. Demak bu a emas.", 'a отрицательно, а ответ обязан быть неотрицательным. Значит это не a.', 'a is negative, but the answer must be non-negative. So it is not a.') },
          { id: 'c', label: 'a²', hint: L("Bu ildiz ostidagi ifoda. Ildizni olish qoldi.", 'Это подкоренное выражение. Осталось взять корень.', 'That is the radicand. The root still has to be taken.') },
        ],
        solution: ['a < 0', '|a| = −a', '√(a²) = −a'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill` asbobi).
// Ko'rsatish o'z yozuvida, mustaqil ish boshqasida.
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
      "Yozuv ikki qadamdan iborat. Avval kvadrat, keyin ildiz.",
      'Запись состоит из двух шагов. Сначала квадрат, потом корень.',
      'The record has two steps. First the square, then the root.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Yozuv to'ldi. Har safar javob nomanfiy chiqdi.",
      'Запись заполнена. Каждый раз ответ выходил неотрицательным.',
      'The record is filled. Every time the answer came out non-negative.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['=', '36', '6'],
      lines: [
        [{ t: '(−6)² ' }, { slot: '=' }, { t: ' ' }, { slot: '36' }],
        [{ t: '√36 = ' }, { slot: '6' }],
      ],
    },
    tasks: [
      {
        chips: ['=', '49', '7'],
        lines: [
          [{ t: '(−7)² ' }, { slot: '=' }, { t: ' ' }, { slot: '49' }],
          [{ t: '√49 = ' }, { slot: '7' }],
        ],
      },
      {
        chips: ['=', '100', '10'],
        lines: [
          [{ t: '(−10)² ' }, { slot: '=' }, { t: ' ' }, { slot: '100' }],
          [{ t: '√100 = ' }, { slot: '10' }],
        ],
      },
      {
        chips: ['=', '81', '9'],
        lines: [
          [{ t: '(−9)² ' }, { slot: '=' }, { t: ' ' }, { slot: '81' }],
          [{ t: '√81 = ' }, { slot: '9' }],
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
    'Ildizning shartlari',
    'Условия корня',
    'The conditions of a root',
  ),
  audio: [
    A('mount',
      "To'rt savol va oxirida shartni yig'ish.",
      'Четыре вопроса и в конце сборка условия.',
      'Four questions and an assembly of the condition at the end.'),
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
        tag: 'З31',
        ask: L('√((−9)²) nimaga teng?', 'Чему равен √((−9)²)?', 'What does √((−9)²) equal?'),
        options: [
          { id: 'nine', right: true, label: '9' },
          { id: 'mnine', label: '−9' },
          { id: 'e81', label: '81' },
          { id: 'none', label: L("qiymat yo'q", 'значения нет', 'no value') },
        ],
        hint: L(
          "Avval kvadrat, u sakson bir. Keyin ildiz.",
          'Сначала квадрат, он восемьдесят один. Потом корень.',
          'First the square, which is eighty one. Then the root.',
        ),
        ok: L(
          "Kvadrat minusni yo'q qildi, ildiz esa nomanfiy sonni qaytardi.",
          'Квадрат стёр минус, а корень вернул неотрицательное число.',
          'The square erased the minus and the root returned a non-negative number.',
        ),
      },
      {
        id: 'q2',
        tag: 'З32',
        ask: L('√(x − 7) qachon mavjud?', 'Когда существует √(x − 7)?', 'When does √(x − 7) exist?'),
        options: [
          { id: 'ge', right: true, label: 'x ≥ 7' },
          { id: 'le', label: 'x ≤ 7' },
          { id: 'any', label: L('Har qanday x da', 'При любом x', 'For any x') },
          { id: 'never', label: L('Hech qachon', 'Никогда', 'Never') },
        ],
        hint: L(
          "Ildiz ostidagi ifodani nomanfiy deb yozing va tengsizlikni yeching.",
          'Запиши подкоренное неотрицательным и реши неравенство.',
          'Write the radicand as non-negative and solve the inequality.',
        ),
        ok: L(
          "Iks yettiga teng bo'lganda ildiz ostida nol turadi, va bu yaraydi.",
          'Когда икс равен семи, под корнем нуль, и это годится.',
          'When x equals seven the radicand is zero, and that is fine.',
        ),
      },
      {
        id: 'q3',
        tag: 'З29',
        ask: L(
          'x² = 49 tenglamaning nechta yechimi bor?',
          'Сколько решений у уравнения x² = 49?',
          'How many solutions does x² = 49 have?',
        ),
        options: [
          { id: 'two', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'one', label: L('Bitta', 'Одно', 'One') },
          { id: 'zero', label: L('Hech qanday', 'Ни одного', 'None') },
          { id: 'many', label: L("Cheksiz ko'p", 'Бесконечно много', 'Infinitely many') },
        ],
        hint: L(
          "Minus yettining kvadratini ham hisoblang.",
          'Посчитай и квадрат минус семи.',
          'Compute the square of minus seven as well.',
        ),
        ok: L(
          "Tenglamaning ikki yechimi bor, ildiz belgisi esa bittasini beradi.",
          'У уравнения два решения, а знак корня даёт одно.',
          'The equation has two solutions, but the root sign gives one.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          "√(a²) javobini qanday tekshirasiz?",
          'Как проверить ответ для √(a²)?',
          'How do you check the answer for √(a²)?',
        ),
        options: [
          { id: 'sub', right: true, label: L("a o'rniga manfiy son qo'yib", 'Подставить вместо a отрицательное число', 'Substitute a negative number for a') },
          { id: 'eye', label: L("Ko'z bilan", 'Глазами', 'By eye') },
          { id: 'half', label: L("Ildiz ostini ikkiga bo'lib", 'Разделив подкоренное на два', 'By halving the radicand') },
          { id: 'twice', label: L("Javobni ikkiga ko'paytirib", 'Умножив ответ на два', 'By doubling the answer') },
        ],
        hint: L(
          "Jadvalda shu ish qilindi, a minus besh bo'ldi va javob besh chiqdi.",
          'В таблице так и делали, a было минус пять, а ответ вышел пять.',
          'The table did exactly that, a was minus five and the answer came out five.',
        ),
        ok: L(
          "Manfiy son qo'yish modulni ko'rsatadi, taxmin qilish esa yo'q.",
          'Подстановка отрицательного числа показывает модуль, а угадывание нет.',
          'Substituting a negative number reveals the modulus; guessing does not.',
        ),
      },
      {
        id: 'q5',
        tag: 'З32',
        ask: L("Shartni yig'ing", 'Собери условие', 'Assemble the condition'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Ildiz ostidagi ifodani nomanfiy deb qo'ying va shartni yig'ing.",
            'Прими подкоренное неотрицательным и собери условие.',
            'Take the radicand as non-negative and assemble the condition.',
          ),
          lines: [
            [{ t: '√(2x − 6):   x ' }, { slot: '≥' }, { t: '  ' }, { slot: '3' }],
          ],
          tiles: [
            { id: 't1', v: '≥', x: 12, y: 14 },
            { id: 't2', v: '3', x: 66, y: 12 },
            { id: 't3', v: '≤', x: 38, y: 50 },
            { id: 't4', v: '0', x: 76, y: 48 },
            { id: 't5', v: '6', x: 18, y: 52 },
          ],
          hint: L(
            "Ikki iks minus olti nomanfiy bo'lsin, keyin ikkiga bo'ling.",
            'Пусть два икс минус шесть неотрицательно, потом раздели на два.',
            'Let two x minus six be non-negative, then divide by two.',
          ),
          doneNote: L(
            "Yig'ildi. Ikki musbat songa bo'linganda ishora aylanmaydi.",
            'Собрано. При делении на положительное число знак не переворачивается.',
            'Assembled. Dividing by a positive number does not flip the sign.',
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
    "Kvadratdan ildiz modulni beradi",
    'Корень из квадрата даёт модуль',
    'The root of a square gives the modulus',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi, kvadratdan ildiz modulga teng.",
      'С урока остаётся одна запись, корень из квадрата равен модулю.',
      'One record stays with you, the root of a square equals the modulus.'),
    A('s1',
      "Bugun uch narsani qildingiz. Iksni burab qiymat qayerda tugashini topdingiz, tengsizlikni yechdingiz va modulni chiqardingiz.",
      'Сегодня сделано три вещи. Крутил икс и нашёл, где значение заканчивается, решил неравенство и вывел модуль.',
      'Three things are done today. You turned x and found where the value ends, solved an inequality and derived the modulus.'),
    A('s2',
      "Keyingi darsda ildizning xossalari. Ko'paytma va bo'linma ostidan ildiz qanday chiqadi.",
      'В следующем уроке свойства корня. Как корень выходит из произведения и частного.',
      'The next lesson covers the properties of a root, how it comes out of a product and a quotient.'),
  ],
  props: {
    mark: '√(a²) = |a|',
    markNote: L(
      "kvadrat minusni yo'q qiladi",
      'квадрат стирает минус',
      'the square erases the minus',
    ),
    lines: [
      L(
        "Kvadratdan ildiz modulni beradi",
        'Корень из квадрата даёт модуль',
        'The root of a square gives the modulus',
      ),
      L(
        "Ildiz osti nomanfiy bo'lishi shart",
        'Подкоренное обязано быть неотрицательным',
        'The radicand must be non-negative',
      ),
      L(
        "Tenglamada ikki javob, belgida bitta",
        'В уравнении два ответа, в знаке одно',
        'Two answers in an equation, one in the sign',
      ),
    ],
    bridge: L(
      "Keyingi dars: arifmetik ildizning xossalari",
      'Следующий урок: свойства арифметического корня',
      'Next lesson: the properties of the arithmetic root',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — blokning mexanikasi, IKKI TOMON.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З32', 'З31', 'З32',
    'З31', 'З31', 'З31', 'З31', 'З32',
    'З29', 'З31', 'З16', null, null,
  ],
  mechanic: { at: 5, tool: 'twosides', kind: 'sides' },
  hook: <HookScene />,
  final: FinalScene,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
