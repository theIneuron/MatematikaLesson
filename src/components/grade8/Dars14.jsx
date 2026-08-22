// ============================================================================
// 8-sinf, Dars 14. IRRATSIONAL SONLAR.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx` va `zoom.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi (metodist qarori 2026-08-21, o'n foiz). 5-ekranda
// `zoom`, ya'ni sonlar o'qidagi lupa: reja shu asbobni 9, 10 va 14-darsga
// beradi, va 9-dars aynan shu yerga havola qoldirgan.
//
// DARSNING UCH ISHI:
//   1) ratsional son — kasr ko'rinishida yozilishi mumkin bo'lgan son,
//      maxraj nolga teng emas;
//   2) uning onli yozuvi TUGAYDI yoki TAKRORLANADI, uchinchi hol yo'q;
//   3) yozuvi tugamaydigan va takrorlanmaydigan son irratsional deyiladi.
//
// ENG NOZIK JOY — CHEKSIZLIK IRRATSIONALLIK EMAS. Bir uchdanning yozuvi ham
// cheksiz, lekin unda takrorlanuvchi bo'lak bor. Shuning uchun 2-ekranda
// tayanch aynan 6-sinfning «chekli yoki davriy» belgisi, 5-ekranda lupa
// RAQAMLARGA qaraydi, va 7-ekranda isbot beriladi.
//
// DARSLIK. Bu MAVZU O'ZBEK 8-SINF DARSLIGIDA YO'Q: Alimov, «Algebra 8», 2019,
// mundarija — I bob 1-10-§ (algebraik kasrlar), II bob tengsizliklar, III bob
// kvadrat tenglamalar. 7- va 9-sinf darsliklarida ham yo'q. Shuning uchun
// 8-ekrandagi qoida DARSDA chiqariladi, ta'rif uchun tayanch — 8-§, 39-bet
// (arifmetik ildiz), va manba satrida shu yozilgan. Metodist boshqa
// ta'riflashni bersa — o'sha so'z bilan almashtiriladi.
//
// TAYANCH — O'Z KURSIMIZ: 6-sinf, 15-dars «davriy onli kasrlar», belgisi
// «qisqarmas kasr maxrajida faqat ikki va besh bo'lsa yozuv chekli».
//
// ADASHISHLAR: З16, З34 — oldingi darslardan. YANGI uchtasi:
//   З35 — cheksiz onli yozuv irratsionallik belgisi deb olindi;
//   З36 — har qanday ildiz irratsional son deb olindi;
//   З37 — yaqinlashish aniq qiymat deb olindi.
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
  id: 'alg-8-14',
  n: 14,
  row: 15,
  block: 'Б2',
  topic: L(
    'Irratsional sonlar',
    'Иррациональные числа',
    'Irrational numbers',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Kasr ko'rinishida yozilgan son ratsional deyiladi, maxraj nolga teng emas",
    'Число, записанное дробью, называется рациональным, знаменатель не равен нулю',
    'A number written as a fraction is called rational, the denominator is not zero',
  ),
  L(
    "Ratsional sonning onli yozuvi tugaydi yoki takrorlanadi",
    'Десятичная запись рационального числа заканчивается или повторяется',
    'The decimal record of a rational number either ends or repeats',
  ),
  L(
    "Yozuvi tugamaydigan va takrorlanmaydigan son irratsional, ikkidan ildiz shunday",
    'Число, чья запись не заканчивается и не повторяется, иррационально; корень из двух такой',
    'A number whose record neither ends nor repeats is irrational; the root of two is such',
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
    at: 4,
  },
  'З34': {
    what: L(
      "ildiz ostilari qo'shilib, hadlar o'xshash deb olindi",
      'подкоренные сложили, приняв слагаемые за подобные',
      'the radicands were added, treating the terms as like terms',
    ),
    wrong: 'sqrt(2)+sqrt(2)-sqrt(4)',
    at: 12,
  },
  'З35': {
    what: L(
      'cheksiz onli yozuv irratsionallik belgisi deb olindi',
      'бесконечная десятичная запись принята за признак иррациональности',
      'an infinite decimal record was taken as the mark of irrationality',
    ),
    wrong: '1/3',
    at: 5,
  },
  'З36': {
    what: L(
      'har qanday ildiz irratsional son deb olindi',
      'любой корень принят за иррациональное число',
      'any root was taken to be an irrational number',
    ),
    wrong: 'sqrt(9)',
    at: 6,
  },
  'З37': {
    what: L(
      'yaqinlashish aniq qiymat deb olindi',
      'приближение принято за точное значение',
      'an approximation was taken for the exact value',
    ),
    wrong: '1.41',
    at: 3,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: ikki cheksiz yozuv va ular bir xil turdami degan savol.
// Yakun: AYNI shu ikki yozuv, biri qavsli davr bilan, ikkinchisi davrsiz.
// ============================================================
const SC_BOTH = L('IKKALASI HAM CHEKSIZ', 'ОБЕ ЗАПИСИ БЕСКОНЕЧНЫ', 'BOTH RECORDS ARE INFINITE')
const SC_RAT = L('RATSIONAL', 'РАЦИОНАЛЬНОЕ', 'RATIONAL')
const SC_IRR = L('IRRATSIONAL', 'ИРРАЦИОНАЛЬНОЕ', 'IRRATIONAL')

const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Bir uchdan va ikkidan ildiz",
      'Одна третья и корень из двух',
      'One third and the root of two',
    )}>
      <text x="96" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20"
        fill={T.ink}>1 : 3</text>
      <text x="96" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fill={T.graph} className="g8-draw" pathLength="1">0,3333…</text>

      <text x="304" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20"
        fill={T.ink}>{'√2'}</text>
      <text x="304" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fill={T.graph}>1,4142…</text>

      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="70" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="77" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="126" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_BOTH)}</text>
      <line x1="112" y1="138" x2="288" y2="138" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

const FinalScene = () => {
  const t = useT()
  return (
    <SceneBand kind="final" label={L(
      "Bir uchdan ratsional, ikkidan ildiz irratsional",
      'Одна третья рациональна, корень из двух иррационален',
      'One third is rational, the root of two is irrational',
    )}>
      <text x="92" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>1 : 3 = 0,(3)</text>
      <g className="g8-seat" style={{ '--d': '500ms' }}>
        <text x="92" y="48" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="8" letterSpacing="0.14em" fill={T.ok}>{t(SC_RAT)}</text>
      </g>

      <line x1="200" y1="16" x2="200" y2="56" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>

      <text x="306" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'√2 = 1,4142…'}</text>
      <g className="g8-seat" style={{ '--d': '1000ms' }}>
        <text x="306" y="48" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="8" letterSpacing="0.14em" fill={T.tip}>{t(SC_IRR)}</text>
      </g>

      <g className="g8-seat" style={{ '--d': '1500ms' }}>
        <line x1="60" y1="74" x2="340" y2="74" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <circle cx="112" cy="74" r="4.4" fill={T.ok}/>
        <text x="112" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>0,(3)</text>
        <circle cx="248" cy="74" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
        <text x="248" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>{'√2'}</text>
        <circle cx="316" cy="74" r="4.4" fill={T.ok}/>
        <text x="316" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>2</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q. Javob 6- va
// 7-ekranda o'quvchining o'zi tomonidan olinadi.
// ============================================================
const S1 = {
  eyebrow: L('IKKI CHEKSIZ YOZUV', 'ДВЕ БЕСКОНЕЧНЫЕ ЗАПИСИ', 'TWO INFINITE RECORDS'),
  title: L(
    "Bir uchdan va ikkidan ildiz bir xil turdami",
    'Одного ли вида одна третья и корень из двух',
    'Are one third and the root of two of the same kind',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki yozuv. Ikkalasining ham raqamlari tugamaydi.",
      'Две записи. У обеих цифры не заканчиваются.',
      'Two records. In both the digits never end.'),
    A('why',
      "Taxmin qiling, bu ikki son bir xil turdagimi.",
      'Предположи, одного ли вида эти два числа.',
      'Predict whether these two numbers are of the same kind.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, bu ikki son bir xil turdagimi?",
      'Как думаешь, эти два числа одного вида?',
      'Do you think these two numbers are of the same kind?',
    ),
    items: [
      { id: 'same', show: L('Ha, bir xil turda', 'Да, одного вида', 'Yes, the same kind') },
      { id: 'diff', show: L("Yo'q, boshqa turda", 'Нет, разного вида', 'No, different kinds') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Bu darsning tayanchi — 6-SINFNING «CHEKLI YOKI DAVRIY»
// BELGISI (15-dars): qisqarmas kasr maxrajida faqat ikki va besh bo'lsa
// yozuv chekli. Shu tayanch 5- va 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Kasrning onli yozuvi",
    'Десятичная запись дроби',
    'The decimal record of a fraction',
  ),
  audio: [
    A('mount',
      "To'rt kasr. Uchtasining yozuvi tugaydi, bittasining tugamaydi.",
      'Четыре дроби. У трёх запись заканчивается, у одной не заканчивается.',
      'Four fractions. Three of them have a record that ends, one does not.'),
    A('why',
      "Maxrajning ko'paytuvchilariga qarang. Faqat ikkilar va beshlar bo'lsa yozuv tugaydi.",
      'Смотри на множители знаменателя. Если только двойки и пятёрки, запись заканчивается.',
      'Look at the factors of the denominator. Only twos and fives mean the record ends.'),
  ],
  props: {
    ask: L(
      "Qaysi kasrning yozuvi tugamaydi?",
      'У какой дроби запись не заканчивается?',
      'Which fraction has a record that does not end?',
    ),
    items: [
      {
        id: 'f38',
        show: '3/8',
        name: L('faqat ikkilar', 'только двойки', 'only twos'),
        hint: L(
          "Sakkiz bu ikki karra ikki karra ikki, shuning uchun yozuv tugaydi.",
          'Восемь это два на два на два, поэтому запись заканчивается.',
          'Eight is two times two times two, so the record ends.',
        ),
      },
      {
        id: 'f720',
        show: '7/20',
        name: L('ikki va besh', 'двойки и пять', 'twos and five'),
        hint: L(
          "Yigirma bu ikki karra ikki karra besh. Ikki va besh yozuvni tugatadi.",
          'Двадцать это два на два на пять. Двойки и пятёрки запись заканчивают.',
          'Twenty is two times two times five. Twos and fives let the record end.',
        ),
      },
      {
        id: 'f425',
        show: '4/25',
        name: L('beshlar', 'пятёрки', 'fives'),
        hint: L(
          "Yigirma besh bu besh karra besh, va yozuv tugaydi.",
          'Двадцать пять это пять на пять, и запись заканчивается.',
          'Twenty five is five times five, and the record ends.',
        ),
      },
      {
        id: 'f16',
        show: '1/6',
        right: true,
        name: L('uchlik bor', 'есть тройка', 'a three'),
      },
    ],
    after: L(
      "Ha. Oltida uch bor, shuning uchun yozuv tugamaydi, balki takrorlanadi.",
      'Да. В шести есть тройка, поэтому запись не заканчивается, а повторяется.',
      'Yes. Six holds a three, so the record does not end but repeats.',
    ),
    proof: {
      varLabel: L('kasr', 'дробь', 'the fraction'),
      leftLabel: L("maxrajning ko'paytuvchilari", 'множители знаменателя', 'the factors of the denominator'),
      rightLabel: L('onli yozuvi', 'десятичная запись', 'the decimal record'),
      noValue: L("qiymat yo'q", 'значения нет', 'no value'),
      rows: [
        { v: '3/8', left: '2 · 2 · 2', right: '0,375' },
        { v: '7/20', left: '2 · 2 · 5', right: '0,35' },
        { v: '4/25', left: '5 · 5', right: '0,16' },
        { v: '1/6', left: '2 · 3', right: '0,1(6)' },
      ],
    },
  },
}

// ============================================================
// EKRAN 3. AYIRMA NOLGA TEGMAYDI (1-darsning `steppers`).
//
// NIMA UCHUN AYNAN BUTUN SONLAR. Agar m ni n ga bo'lish natijasini
// ko'rsatsak, `fmt` ikki xonaga qirqadi va bir uchdan «0,33» bo'lib chiqadi —
// ya'ni asbob aynan aniqlik haqidagi darsda YOLG'ON gapiradi. Shuning uchun
// ekranda BUTUN SONLARDAN tuzilgan yozuv turadi: m kvadrati minus ikki karra
// n kvadrati. Kasr ikkidan ildizga teng bo'lsa, bu ayirma nol bo'lardi.
//
// O'LIK NATIJA, ekran shu bilan yopiladi: n nolga tushadi va kasr yo'qoladi.
// ============================================================
const S3 = {
  eyebrow: L('ANIQ TENGLIKMI', 'ТОЧНОЕ ЛИ РАВЕНСТВО', 'IS THE EQUALITY EXACT'),
  title: L(
    "Kasr ikkidan ildizga teng bo'lishi mumkinmi",
    'Может ли дробь равняться корню из двух',
    'Can a fraction equal the root of two',
  ),
  audio: [
    A('mount',
      "Agar m ni n ga bo'lgan kasr ikkidan ildizga teng bo'lsa, m ning kvadrati n ning kvadratidan ikki baravar katta bo'ladi. Ya'ni ayirma nol chiqadi.",
      'Если дробь m на n равна корню из двух, то квадрат m вдвое больше квадрата n. Значит разность выходит нулём.',
      'If the fraction m over n equals the root of two, then m squared is twice n squared. So the difference comes out zero.'),
    A('why',
      "Uch maqsad beriladi. Ayirmani nolga yaqinlashtiring.",
      'Даны три цели. Приближай разность к нулю.',
      'Three targets are given. Bring the difference close to zero.'),
    A('why',
      "Oxirida n ni nolga olib boring.",
      'В конце уведи n в нуль.',
      'At the end take n down to zero.'),
  ],
  props: {
    cols: [
      { id: 'm', label: L('m ning qiymati', 'значение m', 'the value of m'), start: 1, min: 1, max: 20, step: 1 },
      { id: 'n', label: L('n ning qiymati', 'значение n', 'the value of n'), start: 1, min: 0, max: 14, step: 1, risky: true },
    ],
    // Ayirma BUTUN son, shuning uchun ekranda aynan chiqadi. n nol bo'lsa kasr
    // yo'q — natija ham yo'q, va ekran shu holatda yopiladi.
    calc: (v) => (v[1] === 0 ? null : v[0] * v[0] - 2 * v[1] * v[1]),
    resultLabel: L('m² − 2n²', 'm² − 2n²', 'm² − 2n²'),
    sign: ',',
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "n nolga tushdi, lekin maqsadlar hali olinmagan. Avval ularni oling.",
      'n опустилось до нуля, но цели ещё не взяты. Сначала возьми их.',
      'n has dropped to zero, but the targets are not taken yet. Take them first.',
    ),
    goals: [
      {
        value: 1,
        ask: L(
          "Ayirma birga teng bo'lsin",
          'Пусть разность будет равна одному',
          'Make the difference equal one',
        ),
        after: L(
          "Uch ikkidan kasr. To'qqizdan sakkiz ayirilsa bir qoladi. Nolga bir qadam qoldi.",
          'Дробь три вторых. Из девяти вычесть восемь, остаётся один. До нуля один шаг.',
          'The fraction three halves. Nine minus eight leaves one. One step from zero.',
        ),
      },
      {
        value: -2,
        ask: L(
          "Endi ayirma minus ikkiga teng bo'lsin",
          'Теперь пусть разность будет равна минус двум',
          'Now make the difference equal minus two',
        ),
        after: L(
          "To'rt uchdan kasr. O'n oltidan o'n sakkiz ayirilsa minus ikki chiqadi. Ayirma nolning boshqa tomoniga o'tdi.",
          'Дробь четыре третьих. Из шестнадцати вычесть восемнадцать, выходит минус два. Разность перешла на другую сторону нуля.',
          'The fraction four thirds. Sixteen minus eighteen gives minus two. The difference crossed to the other side of zero.',
        ),
      },
      {
        value: 1,
        ask: L(
          "Oxirgisi. Yana bir, lekin n o'ndan katta bo'lsin",
          'Последняя. Снова один, но пусть n станет больше десяти',
          'The last one. Again one, but let n grow past ten',
        ),
        after: L(
          "O'n yetti o'n ikkidan. Sonlar o'sdi, ayirma esa o'sha bir bo'lib qoldi. Nol hech qachon chiqmaydi.",
          'Семнадцать двенадцатых. Числа выросли, а разность осталась той же единицей. Нуль не выходит никогда.',
          'Seventeen twelfths. The numbers grew, and the difference stayed the same one. Zero never appears.',
        ),
      },
    ],
    ask: L(
      "Ayirma birga teng bo'lsin",
      'Пусть разность будет равна одному',
      'Make the difference equal one',
    ),
    ask2: L(
      "Endi n ni nolga olib boring",
      'Теперь уведи n в нуль',
      'Now take n down to zero',
    ),
    broke: L(
      "n nol bo'lsa kasr yo'q, chunki nolga bo'linmaydi. Shuning uchun ta'rifda maxraj nolga teng emas.",
      'Если n нуль, дроби нет, потому что на нуль не делят. Поэтому в определении знаменатель не равен нулю.',
      'If n is zero there is no fraction, because nothing is divided by zero. That is why the definition keeps the denominator away from zero.',
    ),
  },
}

// ============================================================
// EKRAN 4. TEKSHIRISH JADVALI (1-darsning `pick` va PODSTANOVKA jadvali).
// Onli yozuvning kvadrati ikkiga yetmaydi — З16 ni davolaydi: javob KO'Z
// bilan emas, kvadratga oshirib tekshiriladi.
// ============================================================
const S4 = {
  eyebrow: L('TEKSHIRISH', 'ПРОВЕРКА', 'THE CHECK'),
  title: L(
    "Qaysi onli yozuvning kvadrati aynan ikki",
    'Квадрат какой десятичной записи равен ровно двум',
    'Which decimal record squares to exactly two',
  ),
  audio: [
    A('mount',
      "To'rt javob. Har birini kvadratga oshirib tekshiramiz.",
      'Четыре ответа. Каждый проверяем возведением в квадрат.',
      'Four answers. We check each one by squaring it.'),
    A('why',
      "Jadvalga qarang. Raqamlar ko'paygani bilan kvadrat ikkiga yetmaydi.",
      'Смотри в таблицу. Цифр становится больше, а квадрат до двух не доходит.',
      'Look at the table. The digits grow in number, and the square still falls short of two.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuvning kvadrati aynan ikki?",
      'Квадрат какой записи равен ровно двум?',
      'Which record squares to exactly two?',
    ),
    items: [
      {
        id: 'a141',
        show: '1,41',
        hint: L(
          "Kvadrati ikkidan kichik, demak yozuvning o'zi ham ildizdan kichik.",
          'Его квадрат меньше двух, значит и сама запись меньше корня.',
          'Its square is less than two, so the record itself is less than the root.',
        ),
      },
      {
        id: 'a1414',
        show: '1,414',
        hint: L(
          "Bu ham kichik, garchi raqamlar ko'paygan bo'lsa ham.",
          'Это тоже меньше, хотя цифр стало больше.',
          'This is less as well, even though there are more digits.',
        ),
      },
      {
        id: 'a14142',
        show: '1,4142',
        hint: L(
          "Yana kichik. Yangi raqamlar yaqinlashtiradi, lekin oxirigacha olib bormaydi.",
          'Снова меньше. Новые цифры приближают, но до конца не доводят.',
          'Less again. New digits bring you closer but never all the way.',
        ),
      },
      {
        id: 'none',
        show: L('Hech biri', 'Ни одна', 'None of them'),
        right: true,
        name: L('ikki chiqmaydi', 'двух не выйдет', 'never two'),
      },
    ],
    after: L(
      "Ha. Onli yozuv qancha uzun bo'lsa ham, uning kvadrati ikkiga yetmaydi.",
      'Да. Какой бы длинной ни была десятичная запись, её квадрат до двух не доходит.',
      'Yes. However long the decimal record is, its square never reaches two.',
    ),
    proof: {
      varLabel: L('yozuv', 'запись', 'the record'),
      leftLabel: L('kvadrati', 'его квадрат', 'its square'),
      rightLabel: L('ikkiga tengmi', 'равно двум', 'equals two'),
      noValue: L("qiymat yo'q", 'значения нет', 'no value'),
      rows: [
        { v: '1,41', left: '1,9881', right: L("yo'q", 'нет', 'no') },
        { v: '1,414', left: '1,999396', right: L("yo'q", 'нет', 'no') },
        { v: '1,4142', left: '1,99996164', right: L("yo'q", 'нет', 'no') },
      ],
    },
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — LUPA (`zoom`).
//
// 9-darsda lupa metka BO'LINISHGA tushmasligini ko'rsatgan va shu yerga
// havola qoldirgan. Bu yerda savol boshqa: RAQAMLARNING O'ZIGA qaraymiz,
// chunki bir uchdanning yozuvi ham cheksiz, va cheksizlik o'zi hech narsani
// hal qilmaydi (З35).
// ============================================================
const S5 = {
  eyebrow: L('LUPA', 'ЛУПА', 'THE MAGNIFIER'),
  title: L(
    "Ikkidan ildizning raqamlari",
    'Цифры корня из двух',
    'The digits of the root of two',
  ),
  audio: [
    A('mount',
      "To'qqizinchi darsda metka bo'linishga hech qachon tushmasligini ko'rdik. Endi raqamlarning o'ziga qaraymiz.",
      'На девятом уроке мы видели, что метка никогда не ложится на деление. Теперь посмотрим на сами цифры.',
      'In lesson nine we saw the mark never land on a tick. Now we look at the digits themselves.'),
    W('z2',
      "Ikki marta kattalashtirdik, va har qadamda yangi raqam paydo bo'ldi.",
      'Мы увеличили два раза, и на каждом шаге появлялась новая цифра.',
      'We zoomed twice, and each step brought a new digit.'),
    W('z4',
      "To'rt marta kattalashtirdik. Bir, to'rt, bir, to'rt, ikki. Takrorlanuvchi bo'lak ko'rinmaydi.",
      'Мы увеличили четыре раза. Один, четыре, один, четыре, два. Повторяющегося куска не видно.',
      'We zoomed four times. One, four, one, four, two. No repeating block appears.'),
  ],
  props: {
    expr: 'sqrt(2)',
    label: '√2',
    depth: 4,
    ask: L(
      "Bir uchdanda uchlik takrorlanadi. Bu yerda takrorlanuvchi bo'lak bormi?",
      'У одной третьей повторяется тройка. Есть ли повторяющийся кусок здесь?',
      'One third repeats a three. Is there a repeating block here?',
    ),
    items: [
      {
        id: 'none',
        right: true,
        label: L("Yo'q, takrorlanuvchi bo'lak yo'q", 'Нет, повторяющегося куска нет', 'No, there is no repeating block'),
      },
      {
        id: 'soon',
        label: L('Ha, tez orada boshlanadi', 'Да, скоро начнётся', 'Yes, it starts soon'),
        hint: L(
          "Bir uchdanda qoldiq har qadamda bir xil, shuning uchun raqam takrorlanadi. Bu yerda esa har qadamda boshqa qoldiq chiqadi.",
          'У одной третьей остаток на каждом шаге один и тот же, поэтому цифра повторяется. А здесь на каждом шаге выходит другой остаток.',
          'In one third the remainder repeats at every step, so the digit repeats. Here every step gives a different remainder.',
        ),
      },
      {
        id: 'block',
        label: L("Bir to'rt bo'lagi takrorlanadi", 'Повторяется кусок один четыре', 'The block one four repeats'),
        hint: L(
          "Beshinchi va oltinchi raqamlar bir va uch. Bo'lak shu yerda buzildi.",
          'Пятая и шестая цифры один и три. Кусок здесь ломается.',
          'The fifth and sixth digits are one and three. The block breaks right there.',
        ),
      },
    ],
    after: L(
      "Yozuv tugamaydi va takrorlanmaydi ham. Kasrlarda bunday yozuv bo'lmaydi.",
      'Запись не заканчивается и не повторяется. У дробей такой записи не бывает.',
      'The record neither ends nor repeats. Fractions never have such a record.',
    ),
    note: L(
      "Buni ko'rdik. Endi nima uchun shundayligini isbotlaymiz",
      'Это увидено. Теперь докажем, почему так',
      'That is seen. Now we prove why it is so',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): sonning turini aniqlashning ikki
// yo'li. TUZOQ shu ekranda — to'qqizdan ildiz uchga teng, ya'ni RATSIONAL,
// va ildiz belgisi o'zi hech narsani hal qilmaydi (З36).
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Sonning turini qanday aniqlash mumkin",
    'Как определить вид числа',
    'How to tell the kind of a number',
  ),
  audio: [
    A('mount',
      "Bitta savol va ikki yo'l. Ikkalasi ham bir xil javob beradi.",
      'Один вопрос и два пути. Оба дают один ответ.',
      'One question and two ways. Both give the same answer.'),
    W('w2',
      "Birinchi yo'lda kasr izlanadi. Topilsa, son ratsional.",
      'В первом пути ищут дробь. Если она находится, число рациональное.',
      'The first way looks for a fraction. If it is found, the number is rational.'),
    W('w4',
      "Ikkinchi yo'lda onli yozuvga qaraladi. Tugasa yoki takrorlansa, son yana ratsional.",
      'Во втором пути смотрят на десятичную запись. Если она заканчивается или повторяется, число снова рациональное.',
      'The second way looks at the decimal record. If it ends or repeats, the number is rational again.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L("1-USUL — KASR KO'RINISHIDA YOZISH", 'СПОСОБ 1 — ЗАПИСАТЬ ДРОБЬЮ', 'METHOD 1 — WRITE IT AS A FRACTION'),
        lead: L(
          "Kasr topilsa, son ratsional",
          'Если дробь находится, число рациональное',
          'If a fraction is found, the number is rational',
        ),
        rows: [
          { text: '√9 = 3 = 3/1' },
          {
            text: '0,35 = 7/20',
            tone: 'ok',
            note: L('ikkalasi ratsional', 'оба рациональны', 'both are rational'),
          },
        ],
      },
      {
        name: L("2-USUL — ONLI YOZUVGA QARASH", 'СПОСОБ 2 — ПОСМОТРЕТЬ НА ЗАПИСЬ', 'METHOD 2 — LOOK AT THE RECORD'),
        lead: L(
          "Yozuv tugasa yoki takrorlansa, son ratsional",
          'Если запись заканчивается или повторяется, число рациональное',
          'If the record ends or repeats, the number is rational',
        ),
        rows: [
          {
            text: '1/6 = 0,1(6)',
            note: L('davri bor', 'период есть', 'it has a period'),
          },
          {
            text: '√2 = 1,4142…',
            tone: 'no',
            note: L("davri yo'q", 'периода нет', 'no period'),
          },
        ],
      },
      {
        tone: 'sum',
        name: L('ILDIZ HAM RATSIONAL BO\'LADI', 'КОРЕНЬ БЫВАЕТ И РАЦИОНАЛЬНЫМ', 'A ROOT CAN BE RATIONAL TOO'),
        lead: L(
          "To'qqizdan ildiz uchga teng, demak ratsional. Ildiz belgisining o'zi turni aniqlamaydi.",
          'Корень из девяти равен трём, значит рационален. Сам знак корня вид числа не определяет.',
          'The root of nine equals three, so it is rational. The root sign alone does not decide the kind.',
        ),
        rows: [{ text: '√9 = 3,   √2 = 1,4142…', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): NIMA UCHUN bunday kasr yo'q.
// Lupa kuzatuv berdi, bu ekran SABAB beradi — juftlik bo'yicha isbot.
// ============================================================
const S7 = {
  eyebrow: L('ISBOT', 'ДОКАЗАТЕЛЬСТВО', 'THE PROOF'),
  title: L(
    "Nima uchun bunday kasr yo'q",
    'Почему такой дроби нет',
    'Why there is no such fraction',
  ),
  audio: [
    A('mount',
      "Ayirma nolga tegmasligini ko'rdik. Endi nima uchun tegmasligini isbotlaymiz.",
      'Мы видели, что разность нуля не касается. Теперь докажем, почему не касается.',
      'We saw the difference never touch zero. Now we prove why it never does.'),
    W('p2',
      "Surat kvadrati maxraj kvadratidan ikki baravar katta, demak surat juft son.",
      'Квадрат числителя вдвое больше квадрата знаменателя, значит числитель чётный.',
      'The numerator squared is twice the denominator squared, so the numerator is even.'),
    W('p4',
      "Ikkalasi juft bo'lib qoldi, lekin kasr qisqarmas edi. Ziddiyat chiqdi, ya'ni bunday kasr yo'q.",
      'Оба вышли чётными, а дробь была несократимой. Вышло противоречие, значит такой дроби нет.',
      'Both came out even, yet the fraction was in lowest terms. A contradiction, so no such fraction exists.'),
  ],
  props: {
    frac: {
      num: [{ t: 'm', id: 'm' }],
      den: [{ t: 'n', id: 'n' }],
    },
    steps: [
      {
        focus: 'm',
        text: L(
          "Aytaylik, bunday kasr bor va u qisqarmas, ya'ni surat bilan maxraj birga juft emas.",
          'Допустим, такая дробь есть и она несократима, то есть числитель и знаменатель не оба чётные.',
          'Suppose such a fraction exists and is in lowest terms, so the numerator and denominator are not both even.',
        ),
      },
      {
        focus: 'm',
        text: L(
          "Ikki tomonni kvadratga oshiramiz. Surat kvadrati maxraj kvadratining ikki barobari, demak surat juft.",
          'Возводим обе части в квадрат. Квадрат числителя вдвое больше квадрата знаменателя, значит числитель чётный.',
          'Square both sides. The numerator squared is twice the denominator squared, so the numerator is even.',
        ),
      },
      {
        focus: 'n',
        text: L(
          "Juft suratni ikkiga ko'paytma sifatida yozamiz, va maxraj kvadrati ham juft chiqadi.",
          'Чётный числитель записываем как два умножить на что-то, и квадрат знаменателя тоже выходит чётным.',
          'Write the even numerator as two times something, and the denominator squared comes out even too.',
        ),
      },
      {
        focus: 'n',
        text: L(
          "Demak maxraj ham juft. Ikkalasi juft bo'lsa kasr qisqarardi, lekin u qisqarmas edi. Bunday kasr yo'q.",
          'Значит и знаменатель чётный. Если оба чётные, дробь сократилась бы, а она несократима. Такой дроби нет.',
          'So the denominator is even as well. Both even would let the fraction reduce, yet it was in lowest terms. No such fraction exists.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Bu isbot ikki yarim ming yil oldin topilgan. Kvadratning diagonali tomoni bilan bir o'lchovga tushmasligi o'sha vaqtda kutilmagan xabar bo'lgan, chunki har qanday uzunlik kasr bilan yozilishiga ishonilgan.",
        'Это доказательство нашли две с половиной тысячи лет назад. То, что диагональ квадрата не измеряется его стороной, было тогда неожиданной новостью: считалось, что любая длина записывается дробью.',
        'This proof was found two and a half thousand years ago. That a square diagonal shares no common measure with its side was unexpected news back then: any length was believed to be writable as a fraction.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Bu yerda dars XUKKA QAYTADI.
// MANBA: mavzu darslikda yo'q, qoida darsda chiqarildi — fayl boshidagi
// izohga qarang.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Ratsional va irratsional sonlar",
    'Рациональные и иррациональные числа',
    'Rational and irrational numbers',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon qildingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, уже сделано твоими руками. Теперь собери его.',
      'Everything the rule needs is already done by your hands. Now assemble it.'),
    W('card',
      "Qoida yig'ildi, va xukdagi ikki yozuv javobini oldi.",
      'Правило собрано, и две записи с хука получили ответ.',
      'The rule is assembled, and the two records from the hook have their answer.'),
  ],
  props: {
    fragments: [
      {
        id: 'f1',
        label: L(
          "Kasr ko'rinishida yozilishi mumkin bo'lgan son",
          'Число, которое можно записать дробью',
          'A number that can be written as a fraction',
        ),
      },
      {
        id: 'f2',
        label: L(
          "ratsional deyiladi, va uning onli yozuvi tugaydi yoki takrorlanadi",
          'называется рациональным, и его десятичная запись заканчивается или повторяется',
          'is called rational, and its decimal record ends or repeats',
        ),
      },
      {
        id: 'f3',
        label: L(
          "Onli yozuvi tugamaydigan va takrorlanmaydigan son",
          'Число, у которого запись не заканчивается и не повторяется',
          'A number whose record neither ends nor repeats',
        ),
      },
      {
        id: 'f4',
        label: L(
          "irratsional deyiladi",
          'называется иррациональным',
          'is called irrational',
        ),
      },
      {
        id: 'w1',
        label: L(
          "har qanday ildiz irratsional bo'ladi",
          'любой корень является иррациональным',
          'any root is irrational',
        ),
      },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. To'qqizdan ildiz uchga teng va u ratsional, demak ildiz belgisi turni aniqlamaydi.",
      'Так не складывается. Корень из девяти равен трём и он рационален, значит знак корня вид числа не определяет.',
      'That does not fit. The root of nine is three and it is rational, so the root sign does not decide the kind.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darsda chiqarildi; ta'rif uchun tayanch — darslik, 8-§, 39-bet",
        'Правило выведено на уроке; опора определения — учебник, § 8, стр. 39',
        'The rule was derived in the lesson; the definition rests on the textbook, section 8, page 39',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "bir uchdan va ikkidan ildiz bir xil turda",
        'одна третья и корень из двух одного вида',
        'one third and the root of two are of the same kind',
      ),
      right: L(
        "bir uchdan ratsional, ikkidan ildiz irratsional",
        'одна третья рациональна, корень из двух иррационален',
        'one third is rational, the root of two is irrational',
      ),
      winner: 'right',
      note: L(
        "Ikkalasining yozuvi cheksiz, lekin takrorlanuvchi bo'lak faqat bittasida bor",
        'У обеих запись бесконечна, но повторяющийся кусок есть только у одной',
        'Both records are infinite, but only one has a repeating block',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): sonning turini aniqlash.
// ============================================================
const DRILL_ASK = L('Ratsional yoki irratsional?', 'Рациональное или иррациональное?', 'Rational or irrational?')
const OPT_RAT = L('Ratsional', 'Рациональное', 'Rational')
const OPT_IRR = L('Irratsional', 'Иррациональное', 'Irrational')
const OPT_NONE = L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told')
const HINT_MARK = L(
  "Belgi har doim bor. Yozuv tugaydi yoki takrorlanadi, yoki ikkalasi ham yo'q.",
  'Признак есть всегда. Запись либо заканчивается или повторяется, либо ни то ни другое.',
  'There is always a mark. The record either ends or repeats, or does neither.',
)

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Sonning turini aniqlang",
    'Определи вид числа',
    'Tell the kind of the number',
  ),
  audio: [
    A('mount',
      "Besh son. Har javobdan keyin yechim ochiladi.",
      'Пять чисел. После каждого ответа открывается решение.',
      'Five numbers. After each answer the solution opens.'),
    A('why',
      "Har safar belgini izlang, ildiz belgisiga emas.",
      'Каждый раз ищи признак, а не знак корня.',
      'Every time look for the mark, not for the root sign.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Ikki holda ildiz ostidan butun son chiqdi.",
      'Все пять разобраны. В двух случаях из-под корня вышло целое число.',
      'All five are done. In two of them a whole number came out from under the root.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'0,75'}</Row>,
        ok: L(
          "Ha. Yozuv tugadi, va kasr topildi.",
          'Да. Запись закончилась, и дробь нашлась.',
          'Yes. The record ended, and the fraction was found.',
        ),
        question: DRILL_ASK,
        items: [
          { id: 'a', right: true, label: OPT_RAT },
          {
            id: 'b',
            label: OPT_IRR,
            hint: L(
              "Yozuv tugadi, demak kasr albatta topiladi.",
              'Запись закончилась, значит дробь обязательно находится.',
              'The record ended, so a fraction is bound to be found.',
            ),
          },
          { id: 'c', label: OPT_NONE, hint: HINT_MARK },
        ],
        solution: ['0,75 = 75/100', '= 3/4'],
      },
      {
        expr: <Row size="big" align="center">{'2/7'}</Row>,
        ok: L(
          "Ha. Yozuv cheksiz, lekin bo'lak takrorlanadi.",
          'Да. Запись бесконечна, но кусок повторяется.',
          'Yes. The record is infinite, but a block repeats.',
        ),
        question: DRILL_ASK,
        items: [
          { id: 'a', right: true, label: OPT_RAT },
          {
            id: 'b',
            label: OPT_IRR,
            hint: L(
              "Bu allaqachon kasr. Cheksizlikning o'zi hech narsani hal qilmaydi.",
              'Это уже дробь. Сама бесконечность ничего не решает.',
              'This is a fraction already. Infinity by itself decides nothing.',
            ),
          },
          { id: 'c', label: OPT_NONE, hint: HINT_MARK },
        ],
        solution: ['2 : 7 = 0,(285714)'],
      },
      {
        expr: <Row size="big" align="center">{'√16'}</Row>,
        ok: L(
          "Ha. O'n olti to'liq kvadrat, ildizi to'rt.",
          'Да. Шестнадцать полный квадрат, его корень четыре.',
          'Yes. Sixteen is a perfect square, its root is four.',
        ),
        question: DRILL_ASK,
        items: [
          { id: 'a', right: true, label: OPT_RAT },
          {
            id: 'b',
            label: OPT_IRR,
            hint: L(
              "Ildiz belgisi turni aniqlamaydi. O'n olti to'liq kvadrat.",
              'Знак корня вид числа не определяет. Шестнадцать полный квадрат.',
              'The root sign does not decide the kind. Sixteen is a perfect square.',
            ),
          },
          { id: 'c', label: OPT_NONE, hint: HINT_MARK },
        ],
        solution: ['√16 = 4', '4 = 4/1'],
      },
      {
        expr: <Row size="big" align="center">{'√3'}</Row>,
        ok: L(
          "Ha. Uch to'liq kvadrat emas, va yozuv takrorlanmaydi.",
          'Да. Три не полный квадрат, и запись не повторяется.',
          'Yes. Three is not a perfect square, and the record does not repeat.',
        ),
        question: DRILL_ASK,
        items: [
          { id: 'a', right: true, label: OPT_IRR },
          {
            id: 'b',
            label: OPT_RAT,
            hint: L(
              "Kasr topilmaydi. Kvadratga oshirib tekshiring, hech bir onli yozuv uch bermaydi.",
              'Дробь не находится. Проверь возведением в квадрат, ни одна десятичная запись не даёт трёх.',
              'No fraction is found. Check by squaring, no decimal record gives three.',
            ),
          },
          { id: 'c', label: OPT_NONE, hint: HINT_MARK },
        ],
        solution: ['1,7² = 2,89', '1,73² = 2,9929'],
      },
      {
        expr: <Row size="big" align="center">{'0,1010010001…'}</Row>,
        ok: L(
          "Ha. Nollar soni har safar o'sadi, demak bo'lak takrorlanmaydi.",
          'Да. Число нулей каждый раз растёт, значит кусок не повторяется.',
          'Yes. The count of zeros grows every time, so no block repeats.',
        ),
        question: DRILL_ASK,
        items: [
          { id: 'a', right: true, label: OPT_IRR },
          {
            id: 'b',
            label: OPT_RAT,
            hint: L(
              "Bo'lak takrorlanmaydi, chunki nollar soni har birlikdan keyin ortadi.",
              'Кусок не повторяется, потому что нулей после каждой единицы становится больше.',
              'No block repeats, because the zeros after each one keep increasing.',
            ),
          },
          { id: 'c', label: OPT_NONE, hint: HINT_MARK },
        ],
        solution: ['0,1  01  001  0001  …'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): BELGINI KO'RSATISH — kasrni
// keltirish yoki kasr yo'qligini aytish.
// ============================================================
const ASK_FRAC = L("Kasr ko'rinishi qanday?", 'Какова запись дробью?', 'What is the fraction form?')
const OPT_NOFRAC = L("Kasr yo'q", 'Дроби нет', 'There is no fraction')

const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Kasrni keltiring",
    'Предъяви дробь',
    'Produce the fraction',
  ),
  audio: [
    A('mount',
      "Endi belgini ko'rsatish kerak. Kasrni keltiring yoki kasr yo'qligini ayting.",
      'Теперь надо предъявить признак. Приведи дробь или скажи, что её нет.',
      'Now the mark has to be produced. Give the fraction or say there is none.'),
    A('why',
      "Butun son ham kasr, uning maxraji bir.",
      'Целое число тоже дробь, его знаменатель один.',
      'A whole number is a fraction too, its denominator is one.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Faqat bitta holda kasr yo'q edi.",
      'Все пять разобраны. Только в одном случае дроби не было.',
      'All five are done. In only one case there was no fraction.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'0,4'}</Row>,
        ok: L(
          "Ha. To'rt o'ndan qisqartirilsa ikki beshdan bo'ladi.",
          'Да. Четыре десятых сокращается до двух пятых.',
          'Yes. Four tenths reduces to two fifths.',
        ),
        question: ASK_FRAC,
        items: [
          { id: 'a', right: true, label: '2/5' },
          {
            id: 'b',
            label: '4/5',
            hint: L(
              "To'rt beshdan bu nol butun sakkiz o'ndan.",
              'Четыре пятых это ноль целых восемь десятых.',
              'Four fifths is zero point eight.',
            ),
          },
          {
            id: 'c',
            label: OPT_NOFRAC,
            hint: L(
              "Yozuv tugagan, bunday holda kasr har doim topiladi.",
              'Запись закончилась, в таком случае дробь находится всегда.',
              'The record ended, and then a fraction is always found.',
            ),
          },
        ],
        solution: ['0,4 = 4/10', '= 2/5'],
      },
      {
        expr: <Row size="big" align="center">{'√25'}</Row>,
        ok: L(
          "Ha. Ildiz besh, va beshning maxraji bir.",
          'Да. Корень пять, а у пяти знаменатель один.',
          'Yes. The root is five, and five has denominator one.',
        ),
        question: ASK_FRAC,
        items: [
          { id: 'a', right: true, label: '5/1' },
          {
            id: 'b',
            label: '25/1',
            hint: L(
              "Yigirma besh ildiz ostidagi son, ildizning o'zi esa besh.",
              'Двадцать пять это подкоренное число, а сам корень пять.',
              'Twenty five is the radicand, while the root itself is five.',
            ),
          },
          {
            id: 'c',
            label: OPT_NOFRAC,
            hint: L(
              "Yigirma besh to'liq kvadrat, shuning uchun kasr bor.",
              'Двадцать пять полный квадрат, поэтому дробь есть.',
              'Twenty five is a perfect square, so a fraction exists.',
            ),
          },
        ],
        solution: ['√25 = 5', '5 = 5/1'],
      },
      {
        expr: <Row size="big" align="center">{'0,(3)'}</Row>,
        ok: L(
          "Ha. Bu bir uchdan, va xukdagi yozuv aynan shu edi.",
          'Да. Это одна третья, и запись с хука была именно такой.',
          'Yes. This is one third, exactly the record from the hook.',
        ),
        question: ASK_FRAC,
        items: [
          { id: 'a', right: true, label: '1/3' },
          {
            id: 'b',
            label: '3/10',
            hint: L(
              "Uch o'ndan bu nol butun uch, davri yo'q.",
              'Три десятых это ноль целых три, без периода.',
              'Three tenths is zero point three, with no period.',
            ),
          },
          {
            id: 'c',
            label: OPT_NOFRAC,
            hint: L(
              "Davr bor, demak kasr ham bor.",
              'Период есть, значит и дробь есть.',
              'There is a period, so there is a fraction.',
            ),
          },
        ],
        solution: ['0,(3) = 1/3'],
      },
      {
        expr: <Row size="big" align="center">{'√5'}</Row>,
        ok: L(
          "Ha. Besh to'liq kvadrat emas, va kasr topilmaydi.",
          'Да. Пять не полный квадрат, и дробь не находится.',
          'Yes. Five is not a perfect square, and no fraction is found.',
        ),
        question: ASK_FRAC,
        items: [
          { id: 'a', right: true, label: OPT_NOFRAC },
          {
            id: 'b',
            label: '5/2',
            hint: L(
              "Besh yarimning kvadrati olti butun yigirma besh, beshdan katta.",
              'Квадрат двух с половиной шесть целых двадцать пять, больше пяти.',
              'The square of two and a half is six point two five, more than five.',
            ),
          },
          {
            id: 'c',
            label: '2/1',
            hint: L(
              "Ikkining kvadrati to'rt, beshdan kichik.",
              'Квадрат двух четыре, меньше пяти.',
              'The square of two is four, less than five.',
            ),
          },
        ],
        solution: ['2,2² = 4,84', '2,24² = 5,0176'],
      },
      {
        expr: <Row size="big" align="center">{'2,5'}</Row>,
        ok: L(
          "Ha. Ikki butun besh o'ndan bu besh ikkidan.",
          'Да. Две целых пять десятых это пять вторых.',
          'Yes. Two and a half is five halves.',
        ),
        question: ASK_FRAC,
        items: [
          { id: 'a', right: true, label: '5/2' },
          {
            id: 'b',
            label: '2/5',
            hint: L(
              "Ikki beshdan birdan kichik, bu yerda esa son ikkidan katta.",
              'Две пятых меньше одного, а здесь число больше двух.',
              'Two fifths is less than one, while this number is more than two.',
            ),
          },
          {
            id: 'c',
            label: OPT_NOFRAC,
            hint: L(
              "Yozuv tugagan, demak kasr bor.",
              'Запись закончилась, значит дробь есть.',
              'The record ended, so a fraction exists.',
            ),
          },
        ],
        solution: ['2,5 = 25/10', '= 5/2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`): YAQINLASHISH ANIQ QIYMAT EMAS
// (З37). Javob kvadratga oshirib tekshiriladi.
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Yaqin qiymat va aniq qiymat",
    'Приближённое значение и точное',
    'An approximate value and an exact one',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har safar kvadratga oshirib tekshiring.",
      'Три задания. Каждый раз проверяй возведением в квадрат.',
      'Three tasks. Check by squaring every time.'),
    A('why',
      "Aniq javobda ildiz belgisi qoladi.",
      'В точном ответе знак корня остаётся.',
      'In an exact answer the root sign stays.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Yaqin qiymat javob emas, u faqat baho.",
      'Все три разобраны. Приближённое значение не ответ, а только оценка.',
      'All three are done. An approximate value is not the answer, only an estimate.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√7'}</Row>,
        ok: L(
          "Ha. Ikkining kvadrati to'rt, uchning kvadrati to'qqiz, yetti ular orasida.",
          'Да. Квадрат двух четыре, квадрат трёх девять, семь между ними.',
          'Yes. Two squared is four, three squared is nine, and seven lies between.',
        ),
        question: L(
          "Qaysi butun sonlar orasida?",
          'Между какими целыми числами?',
          'Between which whole numbers?',
        ),
        items: [
          { id: 'a', right: true, label: L('2 va 3', '2 и 3', '2 and 3') },
          {
            id: 'b',
            label: L('3 va 4', '3 и 4', '3 and 4'),
            hint: L(
              "Uchning kvadrati to'qqiz, bu yettidan katta.",
              'Квадрат трёх девять, это больше семи.',
              'Three squared is nine, more than seven.',
            ),
          },
          {
            id: 'c',
            label: L('1 va 2', '1 и 2', '1 and 2'),
            hint: L(
              "Ikkining kvadrati to'rt, bu yettidan kichik.",
              'Квадрат двух четыре, это меньше семи.',
              'Two squared is four, less than seven.',
            ),
          },
        ],
        solution: ['2² = 4 < 7', '3² = 9 > 7'],
      },
      {
        expr: <Row size="big" align="center">{'√7 = 2,65'}</Row>,
        ok: L(
          "Ha. Ikki butun oltmish beshning kvadrati yettidan katta, demak tenglik emas.",
          'Да. Квадрат двух целых шестидесяти пяти больше семи, значит это не равенство.',
          'Yes. The square of two point six five is more than seven, so it is not an equality.',
        ),
        question: L(
          "Bu tenglik to'g'rimi?",
          'Верно ли это равенство?',
          'Is this equality true?',
        ),
        items: [
          {
            id: 'a',
            right: true,
            label: L("Yo'q, bu faqat yaqinlashish", 'Нет, это только приближение', 'No, this is only an approximation'),
          },
          {
            id: 'b',
            label: L("Ha, to'g'ri", 'Да, верно', 'Yes, it is true'),
            hint: L(
              "Kvadratga oshiring. Yetti butun nol yigirma besh chiqadi, yetti emas.",
              'Возведи в квадрат. Выйдет семь целых двести двадцать пять, а не семь.',
              'Square it. You get seven point zero two two five, not seven.',
            ),
          },
          {
            id: 'c',
            label: L("Kalkulyator shunday deydi", 'Так говорит калькулятор', 'The calculator says so'),
            hint: L(
              "Kalkulyator ham yozuvni qirqadi, chunki ekran cheksiz emas.",
              'Калькулятор тоже обрезает запись, потому что экран не бесконечен.',
              'The calculator also cuts the record short, because the screen is not infinite.',
            ),
          },
        ],
        solution: ['2,65² = 7,0225', '7,0225 > 7'],
      },
      {
        expr: <Row size="big" align="center">{'√49'}</Row>,
        ok: L(
          "Ha. Qirq to'qqiz to'liq kvadrat, ildizi yetti.",
          'Да. Сорок девять полный квадрат, его корень семь.',
          'Yes. Forty nine is a perfect square, its root is seven.',
        ),
        question: DRILL_ASK,
        items: [
          { id: 'a', right: true, label: OPT_RAT },
          {
            id: 'b',
            label: OPT_IRR,
            hint: L(
              "Oldingi topshiriqda yettidan ildiz turgan edi, bu yerda esa qirq to'qqizdan.",
              'В предыдущем задании стоял корень из семи, а здесь из сорока девяти.',
              'The previous task held the root of seven, this one the root of forty nine.',
            ),
          },
          { id: 'c', label: OPT_NONE, hint: HINT_MARK },
        ],
        solution: ['√49 = 7', '7 = 7/1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): ildiz ostilari qo'shildi
// (З34), va irratsional sonlarning yig'indisi haqidagi shoshilinch xulosa.
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikki irratsional sonning yig'indisi",
    'Сумма двух иррациональных чисел',
    'The sum of two irrational numbers',
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
      "Ikkalasi ham hal bo'ldi. Yig'indi irratsional ham, ratsional ham bo'lishi mumkin.",
      'Оба разобраны. Сумма может оказаться и иррациональной, и рациональной.',
      'Both are done. The sum can turn out irrational or rational.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√2 + √2'}</Row>,
        ok: L(
          "Ha. Ildiz ostilari bir xil, shuning uchun koeffitsiyentlar qo'shildi.",
          'Да. Подкоренные одинаковы, поэтому сложились коэффициенты.',
          'Yes. The radicands match, so the coefficients added.',
        ),
        question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
        items: [
          { id: 'a', right: true, label: '2√2' },
          {
            id: 'b',
            label: '√4',
            hint: L(
              "Ildiz ostilari qo'shilmaydi. To'rtdan ildiz ikki, ikki karra ikkidan ildiz esa uch butundan katta.",
              'Подкоренные не складываются. Корень из четырёх два, а два корня из двух больше трёх целых.',
              'Radicands do not add. The root of four is two, while two roots of two exceed three.',
            ),
          },
          {
            id: 'c',
            label: '2',
            hint: L(
              "Kvadratga oshiring. Ikkining kvadrati to'rt, javobning kvadrati esa sakkiz.",
              'Возведи в квадрат. Квадрат двух четыре, а квадрат ответа восемь.',
              'Square it. Two squared is four, while the answer squared is eight.',
            ),
          },
        ],
        solution: ['√2 + √2 = 2√2', '(2√2)² = 8'],
      },
      {
        expr: <Row size="big" align="center">{'√2 + (−√2)'}</Row>,
        ok: L(
          "Ha. Nol ratsional son, ya'ni ikki irratsional sonning yig'indisi ratsional bo'lishi mumkin.",
          'Да. Нуль рационален, то есть сумма двух иррациональных может быть рациональной.',
          'Yes. Zero is rational, so the sum of two irrational numbers can be rational.',
        ),
        question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
        items: [
          { id: 'a', right: true, label: '0' },
          {
            id: 'b',
            label: L('Irratsional son', 'Иррациональное число', 'An irrational number'),
            hint: L(
              "Qarama-qarshi ikki son qo'shilsa nol chiqadi, va nol kasr ko'rinishida yoziladi.",
              'Два противоположных числа в сумме дают нуль, а нуль записывается дробью.',
              'Two opposite numbers add to zero, and zero is written as a fraction.',
            ),
          },
          {
            id: 'c',
            label: '2√2',
            hint: L(
              "Ikkinchi qo'shiluvchi manfiy, shuning uchun koeffitsiyentlar bir birini yo'q qiladi.",
              'Второе слагаемое отрицательное, поэтому коэффициенты уничтожают друг друга.',
              'The second term is negative, so the coefficients cancel each other.',
            ),
          },
        ],
        solution: ['√2 − √2 = 0', '0 = 0/1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill`): kvadratning tomoni
// aniq yozuvda ildiz bilan qoladi, yonida esa butun sonli baho turadi.
// ============================================================
const S13 = {
  eyebrow: L('YOZUV', 'ЗАПИСЬ', 'THE RECORD'),
  title: L(
    "Kvadratning tomonini yozing",
    'Запиши сторону квадрата',
    'Write the side of the square',
  ),
  audio: [
    A('mount',
      "Yuza berilgan, tomon esa kataklarda. Ularni birma bir to'ldiring.",
      'Площадь дана, а сторона в клетках. Заполняй их по одной.',
      'The area is given and the side sits in the cells. Fill them one by one.'),
    A('why',
      "Aniq javobda ildiz qoladi, yonidagi baho esa butun sonlar bilan beriladi.",
      'В точном ответе корень остаётся, а оценка рядом даётся целыми числами.',
      'The exact answer keeps the root, and the estimate beside it uses whole numbers.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Aniq javobda ildiz qoldi, baho esa ikki butun son orasida.",
      'Все три заполнены. В точном ответе остался корень, а оценка между двумя целыми.',
      'All three are filled. The exact answer kept the root, and the estimate lies between two whole numbers.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['10', '4'],
      lines: [
        [{ t: 'S = 10,   a = √' }, { slot: '10' }],
        [{ t: '3 < a < ' }, { slot: '4' }],
      ],
    },
    tasks: [
      {
        chips: ['5', '3'],
        lines: [
          [{ t: 'S = 5,   a = √' }, { slot: '5' }],
          [{ t: '2 < a < ' }, { slot: '3' }],
        ],
      },
      {
        chips: ['7', '3'],
        lines: [
          [{ t: 'S = 7,   a = √' }, { slot: '7' }],
          [{ t: '2 < a < ' }, { slot: '3' }],
        ],
      },
      {
        chips: ['20', '5'],
        lines: [
          [{ t: 'S = 20,   a = √' }, { slot: '20' }],
          [{ t: '4 < a < ' }, { slot: '5' }],
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
    "Belgi bo'yicha to'rt savol",
    'Четыре вопроса о признаке',
    'Four questions about the mark',
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
        tag: 'З35',
        ask: L('0,(6) qanday son?', 'Какое число 0,(6)?', 'What kind of number is 0,(6)?'),
        options: [
          { id: 'ok', right: true, label: OPT_RAT },
          { id: 'irr', label: OPT_IRR },
          { id: 'none', label: OPT_NONE },
          { id: 'int', label: L('Butun son', 'Целое число', 'A whole number') },
        ],
        hint: L(
          "Qavs takrorlanuvchi bo'lakni ko'rsatadi.",
          'Скобка показывает повторяющийся кусок.',
          'The bracket marks the repeating block.',
        ),
        ok: L(
          "Davr bor, demak kasr topiladi. Bu ikki uchdan.",
          'Период есть, значит дробь находится. Это две третьих.',
          'There is a period, so a fraction is found. This is two thirds.',
        ),
      },
      {
        id: 'q2',
        tag: 'З36',
        ask: L('√36 qanday son?', 'Какое число √36?', 'What kind of number is √36?'),
        options: [
          { id: 'ok', right: true, label: OPT_RAT },
          { id: 'irr', label: OPT_IRR },
          { id: 'none', label: OPT_NONE },
          { id: 'int', label: L("Faqat ildiz ostida yoziladi", 'Записывается только под корнем', 'It is written only under a root') },
        ],
        hint: L(
          "O'ttiz olti to'liq kvadratmi.",
          'Полный ли квадрат тридцать шесть.',
          'Is thirty six a perfect square.',
        ),
        ok: L(
          "Ildiz olti, va oltining maxraji bir. Ildiz belgisi turni aniqlamaydi.",
          'Корень шесть, а у шести знаменатель один. Знак корня вид не определяет.',
          'The root is six, and six has denominator one. The root sign does not decide the kind.',
        ),
      },
      {
        id: 'q3',
        tag: 'З35',
        ask: L(
          "Yozuv tugamaydi va takrorlanmaydi. Bu qanday son?",
          'Запись не заканчивается и не повторяется. Какое это число?',
          'The record neither ends nor repeats. What kind of number is it?',
        ),
        options: [
          { id: 'ok', right: true, label: OPT_IRR },
          { id: 'rat', label: OPT_RAT },
          { id: 'int', label: L('Butun son', 'Целое число', 'A whole number') },
          { id: 'none', label: OPT_NONE },
        ],
        hint: L(
          "Ikki belgi birga kelgan holni eslang.",
          'Вспомни случай, когда два признака сошлись вместе.',
          'Recall the case where both marks came together.',
        ),
        ok: L(
          "Aynan shunday. Kasrda esa yozuv yoki tugaydi, yoki takrorlanadi.",
          'Именно так. А у дроби запись либо заканчивается, либо повторяется.',
          'Exactly so. A fraction always either ends or repeats.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          "Javob aniq yoki yaqin ekanini qanday tekshirasiz?",
          'Как проверить, точен ответ или приближён?',
          'How do you check whether an answer is exact or approximate?',
        ),
        options: [
          { id: 'ok', right: true, label: L("Kvadratga oshirib", 'Возвести в квадрат', 'Square it') },
          { id: 'eye', label: L("Ko'z bilan", 'Глазами', 'By eye') },
          { id: 'calc', label: L("Kalkulyatorga qarab", 'Посмотреть в калькулятор', 'Look at the calculator') },
          { id: 'count', label: L("Raqamlarni sanab", 'Посчитать цифры', 'Count the digits') },
        ],
        hint: L(
          "To'rtinchi ekrandagi jadval shu ish bilan yig'ilgan.",
          'Таблица на четвёртом экране собрана именно этим действием.',
          'The table on screen four was built by exactly this action.',
        ),
        ok: L(
          "Kvadrat ildiz ostidagi sonni qaytaradi. Qaytmasa, javob faqat yaqin.",
          'Квадрат возвращает подкоренное число. Если не возвращает, ответ только приближён.',
          'The square returns the radicand. If it does not, the answer is only approximate.',
        ),
      },
      {
        id: 'q5',
        tag: 'З37',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Aniq tenglik va yaqin qiymatni yig'ing.",
            'Собери точное равенство и приближённое значение.',
            'Assemble the exact equality and the approximate value.',
          ),
          lines: [
            [{ t: '√2 · √2 = ' }, { slot: '2' }],
            [{ t: '(1,41)² = ' }, { slot: '1,9881' }],
          ],
          tiles: [
            { id: 't1', v: '2', x: 14, y: 12 },
            { id: 't2', v: '1,9881', x: 62, y: 16 },
            { id: 't3', v: '4', x: 22, y: 52 },
            { id: 't4', v: '1,41', x: 68, y: 50 },
          ],
          hint: L(
            "Ildizni o'ziga ko'paytirsak ildiz ostidagi son chiqadi, onli yozuvda esa chiqmaydi.",
            'Корень на себя даёт подкоренное число, а десятичная запись его не даёт.',
            'A root times itself gives the radicand, while a decimal record does not.',
          ),
          doneNote: L(
            "Yig'ildi. Birinchi qatorda aniq ikki, ikkinchisida esa ikkidan kichik son.",
            'Собрано. В первой строке ровно два, во второй число меньше двух.',
            'Assembled. The first line holds exactly two, the second a number below two.',
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
    "Kasr bo'lsa ratsional, bo'lmasa irratsional",
    'Есть дробь — рациональное, нет дроби — иррациональное',
    'A fraction means rational, no fraction means irrational',
  ),
  audio: [
    A('s0',
      "Darsdan bitta xulosa qoladi. Ikkidan ildizga teng kasr yo'q.",
      'С урока остаётся один вывод. Дроби, равной корню из двух, нет.',
      'One conclusion stays with you. There is no fraction equal to the root of two.'),
    A('s1',
      "Bugun uch narsa qilindi. Kasrning onli yozuvi ikki xil bo'lishini ko'rdingiz, ayirmani nolga yaqinlashtirdingiz va bunday kasr yo'qligini isbotladingiz.",
      'Сегодня сделано три вещи. Ты видишь два вида десятичной записи дроби, приближаешь разность к нулю и доказываешь, что такой дроби нет.',
      'Three things are done today. You see the two kinds of decimal record, bring the difference close to zero, and prove no such fraction exists.'),
    A('s2',
      "Keyingi blokda kvadrat tenglamalar. Ularning ildizlari ham ko'pincha irratsional bo'ladi.",
      'В следующем блоке квадратные уравнения. Их корни тоже часто иррациональны.',
      'The next block covers quadratic equations. Their roots are often irrational too.'),
  ],
  props: {
    mark: '√2 ≠ m/n',
    markNote: L(
      "juftlik bo'yicha isbotlandi",
      'доказано чётностью',
      'proved by parity',
    ),
    lines: [
      L(
        "Kasr ko'rinishida yozilsa, son ratsional",
        'Записывается дробью, значит рациональное',
        'Written as a fraction, so rational',
      ),
      L(
        "Ratsional sonning yozuvi tugaydi yoki takrorlanadi",
        'Запись рационального заканчивается или повторяется',
        'The record of a rational number ends or repeats',
      ),
      L(
        "Tugamasa va takrorlanmasa, son irratsional",
        'Не заканчивается и не повторяется, значит иррациональное',
        'Neither ends nor repeats, so irrational',
      ),
    ],
    bridge: L(
      "Keyingi blok: kvadrat tenglamalar",
      'Следующий блок: квадратные уравнения',
      'Next block: quadratic equations',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — BLOKNING LUPASI.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З37', 'З16', 'З35',
    'З36', 'З37', 'З36', 'З36', 'З36',
    'З37', 'З34', 'З37', null, null,
  ],
  mechanic: { at: 5, tool: 'zoom', kind: 'zoom' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
