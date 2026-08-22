// ============================================================================
// 8-sinf, Dars 9. KVADRAT ILDIZ TUSHUNCHASI.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `tools.jsx`, `feed.jsx` va `zoom.jsx` da.
//
// B2 BLOKINING BIRINCHI DARSI VA YANGI QOIDA BO'YICHA BIRINCHI DARS.
// Metodist qarori 2026-08-21: sinfning namunasi — 1-DARS, va yangi dars undan
// ko'pi bilan o'n foizga farq qiladi. Shuning uchun bu darsning o'n to'rt
// ekranida 1-darsning asboblari turadi (`pick`, `steppers`, `movechain` o'rniga
// blok mexanikasi, `twoways`, `parts`, `rulebuild`, `drill`, `fill`, `blitz`,
// `takeaway`), va faqat BITTA ekran — 5-si — blokning o'z mexanikasi, LUPA.
// Ya'ni farq bir ekran, o'n to'rtdan biri.
//
// LUPA (`zoom`) blokning mexanikasi: o'quvchi kesmani kattalashtiradi, metka
// esa har safar ichida qoladi va bo'linishga tushmaydi. Ildiz BOR, lekin oxirgi
// raqami yo'q — bu 14-darsning irratsional soniga tayyorgarlik.
//
// DARSLIK. O'zbek darsligi, 8-§, 39-bet: «a nomanfiy sonning n >= 2 natural
// ko'rsatkichli arifmetik ildizi deb, n-darajasi a ga teng bo'lgan NOMANFIY
// soniga aytiladi... Agar n = 2 bo'lsa, u holda ikkinchi darajali ildiz
// o'rniga √a yoziladi.» Kvadrat ildiz shu ta'rifning n = 2 dagi holi.
//
// ADASHISHLAR: З4 (ildiz hadlarga bo'linadi), З16, З29 (ildiz ikki son deb
// olindi) — oldingi darslardan. З30 (ildiz faqat to'liq kvadratda bor) YANGI.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { SceneBand, rootPath } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'
// КАРКАС КЛАССА: пятнадцать позиций и подписи интерфейса лежат один раз
// (решение методиста 2026-08-21). Урок держит только своё.
import { UI, buildScreens } from './karkas.js'

export const META = {
  id: 'alg-8-09',
  n: 9,
  row: 10,
  block: 'Б2',
  topic: L(
    'Kvadrat ildiz tushunchasi',
    'Понятие квадратного корня',
    'The concept of a square root',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Kvadrat ildiz — kvadrati ildiz ostidagi songa teng bo'lgan NOMANFIY son",
    'Квадратный корень это НЕОТРИЦАТЕЛЬНОЕ число, квадрат которого равен подкоренному',
    'A square root is the NON-NEGATIVE number whose square equals the radicand',
  ),
  L(
    "Ildiz har qanday nomanfiy sondan bor, lekin u har doim butun chiqmaydi",
    'Корень есть у любого неотрицательного числа, но он не всегда выходит целым',
    'Every non-negative number has a root, but it is not always a whole number',
  ),
  L(
    "Butun chiqmaganda ildiz ikki butun son orasida turadi, va uni aniqlash tugamaydi",
    'Когда он не целый, корень лежит между двумя целыми, и уточнение не заканчивается',
    'When it is not whole the root lies between two integers and refining never ends',
  ),
]

export const MISS = {
  'З4': {
    what: L(
      "ildiz hadlarga bo'lib chiqarildi",
      'корень «раздали» по слагаемым',
      'the root was distributed over the terms',
    ),
    wrong: 'sqrt(16+9)',
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
  'З29': {
    what: L(
      'arifmetik ildiz ikki son deb olindi',
      'арифметический корень принят за два числа',
      'the arithmetic root was taken for two numbers',
    ),
    wrong: 'sqrt(9)',
    at: 9,
  },
  'З30': {
    what: L(
      "ildiz faqat to'liq kvadratda bor deb o'ylandi",
      'решили, что корень есть только у полного квадрата',
      'it was assumed that only a perfect square has a root',
    ),
    wrong: 'sqrt(10)',
    at: 10,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: ikki yozuv va savol. Yakun: o'sha ikki yozuv, javob
// bilan.
// ============================================================
const SC_VAL = L('QIYMATI BORMI', 'ЕСТЬ ЛИ ЗНАЧЕНИЕ', 'IS THERE A VALUE')

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "To'qqizdan va o'ndan ildiz",
      'Корень из девяти и из десяти',
      'The root of nine and of ten',
    )}>
      <path d={rootPath(48, 74, 44)} fill="none" stroke={T.ink} strokeWidth="2.6"
        pathLength="1" className="g8-draw"/>
      <text x="92" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="24" fill={T.ink}>9</text>

      <path d={rootPath(238, 74, 44)} fill="none" stroke={T.ink} strokeWidth="2.6"
        pathLength="1" className="g8-draw"/>
      <text x="282" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="24" fill={T.ink}>10</text>

      <g className="g8-seat" style={{ '--d': '3000ms' }}>
        <circle cx="176" cy="74" r="16" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="176" y="80" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="130" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_VAL)}</text>
      <line x1="136" y1="140" x2="264" y2="140" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

// YAKUN: ikkalasida ham qiymat bor, faqat bittasi butun, ikkinchisi esa
// tugamaydigan kasr.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Ikkalasida ham qiymat bor",
    'Значение есть у обеих',
    'Both of them have a value',
  )}>
    <path d="M28 46 L36 54 L48 22 L92 22" fill="none" stroke={T.ink} strokeWidth="2.2"/>
    <text x="70" y="42" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17" fill={T.ink}>9</text>
    <text x="106" y="42" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ok}>=</text>
    <text x="126" y="43" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
      fontWeight="700" fill={T.ok}>3</text>

    <path d="M208 46 L216 54 L228 22 L280 22" fill="none" stroke={T.ink} strokeWidth="2.2"/>
    <text x="254" y="42" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17" fill={T.ink}>10</text>
    <g className="g8-seat" style={{ '--d': '600ms' }}>
      <text x="332" y="43" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
        fill={T.tip}>{'3,162...'}</text>
    </g>

    <g className="g8-seat" style={{ '--d': '1000ms' }}>
      <line x1="60" y1="72" x2="340" y2="72" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
      <text x="100" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10" fill={T.ink3}>3</text>
      <text x="300" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10" fill={T.ink3}>4</text>
      <circle cx="100" cy="72" r="4.4" fill={T.ok}/>
      <circle cx="146" cy="72" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
      <text x="200" y="90" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="9.5" fill={T.tip}>{'oxirgi raqami yoq'}</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('IKKI YOZUV', 'ДВЕ ЗАПИСИ', 'TWO RECORDS'),
  title: L(
    'Ildiz ostida 9 va 10',
    'Под корнем 9 и 10',
    'Nine and ten under the root',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki yozuv. To'qqiz uchning kvadrati, o'n esa hech qanday butun sonning kvadrati emas.",
      'Две записи. Девять это квадрат трёх, а десять не квадрат никакого целого числа.',
      'Two records. Nine is the square of three, and ten is the square of no whole number.'),
    A('why',
      "Taxmin qiling, ikkinchi yozuvning qiymati bormi.",
      'Предположи, есть ли значение у второй записи.',
      'Predict whether the second record has a value.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Qaysi yozuvlarning qiymati bor?",
      'У каких записей есть значение?',
      'Which records have a value?',
    ),
    items: [
      {
        id: 'both',
        show: L('Ikkalasining ham', 'У обеих', 'Both of them'),
      },
      {
        id: 'first',
        show: L('Faqat birinchisining', 'Только у первой', 'Only the first one'),
      },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. To'rt yozuv, bittasida ildiz ostida to'liq kvadrat YO'Q.
// Ekran davolaydigan adashish: «ildiz faqat to'liq kvadratda bor» (З30) —
// bu yerda o'quvchi hali shunday o'ylaydi, va ayni shu yozuvni topadi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "To'liq kvadrat va qolganlari",
    'Полный квадрат и остальные',
    'A perfect square and the rest',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Uchtasida ildiz ostida butun sonning kvadrati turibdi.",
      'Четыре записи. В трёх под корнем стоит квадрат целого числа.',
      'Four records. In three of them the radicand is the square of a whole number.'),
    A('why',
      "To'rtinchisini toping. Uning ildizi butun chiqmaydi.",
      'Найди четвёртую. Её корень не выходит целым.',
      'Find the fourth one. Its root does not come out whole.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuvning qiymati butun emas?",
      'У какой записи значение не целое?',
      'Which record has a non-whole value?',
    ),
    items: [
      {
        id: 's16',
        show: '√16',
        name: L('4 · 4', '4 · 4', '4 · 4'),
        hint: L(
          "O'n olti to'rtning kvadrati, ildizi to'rt.",
          'Шестнадцать это квадрат четырёх, корень равен четырём.',
          'Sixteen is the square of four, the root is four.',
        ),
      },
      {
        id: 's25',
        show: '√25',
        name: L('5 · 5', '5 · 5', '5 · 5'),
        hint: L(
          "Yigirma besh beshning kvadrati, ildizi besh.",
          'Двадцать пять это квадрат пяти, корень равен пяти.',
          'Twenty five is the square of five, the root is five.',
        ),
      },
      {
        id: 's10',
        show: '√10',
        right: true,
        name: L('? · ?', '? · ?', '? · ?'),
      },
      {
        id: 's49',
        show: '√49',
        name: L('7 · 7', '7 · 7', '7 · 7'),
        hint: L(
          "Qirq to'qqiz yettining kvadrati, ildizi yetti.",
          'Сорок девять это квадрат семи, корень равен семи.',
          'Forty nine is the square of seven, the root is seven.',
        ),
      },
    ],
    after: L(
      "Ha. O'n hech qanday butun sonning kvadrati emas. Qiymati bormi, shuni topamiz.",
      'Да. Десять не квадрат никакого целого. Есть ли у него значение, это мы и найдём.',
      'Yes. Ten is the square of no whole number. Whether it has a value is what we will find.',
    ),
  },
}

// ============================================================
// EKRAN 3. KVADRATLAR USTUNI (1-darsning `steppers` asbobi). O'quvchi sonni
// buraydi va kvadratni ko'radi: uchta maqsad, oxirgisi eng katta.
// Bu qatordan keyin ko'rinadi, qaysi sonlar to'liq kvadrat, qaysilari yo'q.
// ============================================================
const S3 = {
  eyebrow: L('ILDIZ OSTIDA', 'ПОД КОРНЕМ', 'THE RADICAND'),
  title: L(
    'Ildiz ostini burang',
    'Крути подкоренное',
    'Turn the radicand',
  ),
  audio: [
    A('mount',
      "Ildiz ostidagi sonni o'zingiz buraysiz, ildiz esa o'zi hisoblanadi.",
      'Число под корнем крутишь ты, а корень считается сам.',
      'You turn the number under the root, and the root computes itself.'),
    A('why',
      "Uch maqsad beriladi. Ildiz aynan shu songa teng bo'lsin.",
      'Даны три цели. Пусть корень будет равен указанному числу.',
      'Three targets are given. Make the root equal the given number.'),
    A('why',
      "Maqsadlar orasida ildiz butun chiqmaydi, va bu normal. Oxirida esa ildiz ostini minusga olib boring.",
      'Между целями корень выходит не целым, и это нормально. А в конце уведи подкоренное в минус.',
      'Between the targets the root is not whole, and that is normal. At the end take the radicand into the negatives.'),
  ],
  props: {
    cols: [
      {
        id: 'u',
        label: L('ildiz ostida', 'под корнем', 'radicand'),
        start: 0, min: -3, max: 12, step: 1,
        risky: true,
      },
    ],
    // Ildiz SANALADI, ma'lumotdan olinmaydi. Manfiy son ostida qiymat yo'q —
    // asbob shu holatda «Error» ko'rsatadi, va bu darsning chegarasi.
    calc: (v) => (v[0] < 0 ? null : Math.round(Math.sqrt(v[0]) * 100) / 100),
    resultLabel: L('ildiz', 'корень', 'the root'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "Nol ostida ildiz nolga teng, bu yaraydi. Manfiy son ostida esa qiymat yo'q.",
      'Под нулём корень равен нулю, это годится. А под отрицательным значения нет.',
      'Under zero the root is zero, and that is fine. Under a negative there is no value.',
    ),
    goals: [
      {
        value: 1,
        ask: L(
          "Ildiz 1 ga teng bo'ladigan sonni toping",
          'Найди число, при котором корень равен 1',
          'Find the number that makes the root equal 1',
        ),
        after: L(
          "Bir. Birning kvadrati bir.",
          'Один. Квадрат единицы это единица.',
          'One. The square of one is one.',
        ),
      },
      {
        value: 2,
        ask: L(
          "Endi ildiz 2 ga teng bo'lsin",
          'Теперь пусть корень будет равен 2',
          'Now make the root equal 2',
        ),
        after: L(
          "To'rt. Yo'lda ildiz butun chiqmadi, va bu normal.",
          'Четыре. По дороге корень выходил не целым, и это нормально.',
          'Four. Along the way the root was not whole, and that is normal.',
        ),
      },
      {
        value: 3,
        ask: L(
          "Oxirgisi, ildiz 3 ga teng",
          'Последняя, корень равен 3',
          'The last one, the root equals 3',
        ),
        after: L(
          "To'qqiz. Uchta to'liq kvadrat topildi, oralarida esa boshqa sonlar.",
          'Девять. Три полных квадрата найдены, а между ними другие числа.',
          'Nine. Three perfect squares found, and other numbers between them.',
        ),
      },
    ],
    ask: L(
      "Ildiz 1 ga teng bo'ladigan sonni toping",
      'Найди число, при котором корень равен 1',
      'Find the number that makes the root equal 1',
    ),
    ask2: L(
      "Endi ildiz ostini minusga olib boring va nima bo'lishini ko'ring",
      'Теперь уведи подкоренное в минус и посмотри, что будет',
      'Now take the radicand into the negatives and see what happens',
    ),
    broke: L(
      "Ildiz ostida manfiy son, va qiymat yo'q. Hech qanday sonning kvadrati manfiy bo'lmaydi.",
      'Под корнем отрицательное число, и значения нет. Квадрат никакого числа не бывает отрицательным.',
      'The radicand is negative and there is no value. No number has a negative square.',
    ),
  },
}

// ============================================================
// EKRAN 4. BELGI NIMANI BILDIRADI (1-darsning `pick` asbobi va PODSTANOVKA
// jadvali). To'rt yozuv, va faqat bittasi arifmetik ildizni bildiradi (З29).
// ============================================================
const S4 = {
  eyebrow: L('BELGI', 'ЗНАК', 'THE SIGN'),
  title: L(
    'Ildiz belgisi nimani beradi',
    'Что даёт знак корня',
    'What the root sign gives',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Ular o'xshash, lekin bir xil narsani bildirmaydi.",
      'Четыре записи. Они похожи, но означают не одно и то же.',
      'Four records. They look alike but do not mean the same.'),
    A('why',
      "Arifmetik ildizni bildirganini tanlang.",
      'Выбери ту, которая означает арифметический корень.',
      'Choose the one that means the arithmetic root.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuv arifmetik ildizni bildiradi?",
      'Какая запись означает арифметический корень?',
      'Which record means the arithmetic root?',
    ),
    items: [
      {
        id: 'plain',
        show: '√16',
        right: true,
        name: L('bitta son', 'одно число', 'one number'),
      },
      {
        id: 'minus',
        show: '−√16',
        hint: L(
          "Bu ildizning qarama-qarshisi, minus to'rt. Ildizning o'zi nomanfiy.",
          'Это противоположное корню число, минус четыре. Сам корень неотрицателен.',
          'That is the opposite of the root, minus four. The root itself is non-negative.',
        ),
      },
      {
        id: 'pm',
        show: '±√16',
        hint: L(
          "Bu ikki son birdan, to'rt va minus to'rt. Belgi esa bittasini beradi.",
          'Это сразу два числа, четыре и минус четыре. А знак даёт одно.',
          'That is two numbers at once, four and minus four. But the sign gives one.',
        ),
      },
      {
        id: 'sq',
        show: '16²',
        hint: L(
          "Bu kvadratga oshirish, ildiz chiqarish emas. Ikki yuz ellik olti chiqadi.",
          'Это возведение в квадрат, а не извлечение корня. Выйдет двести пятьдесят шесть.',
          'That is squaring, not taking a root. It gives two hundred fifty six.',
        ),
      },
    ],
    after: L(
      "Ha. Belgi bitta nomanfiy sonni beradi.",
      'Да. Знак даёт одно неотрицательное число.',
      'Yes. The sign gives one non-negative number.',
    ),
    proof: {
      varLabel: L('yozuv', 'запись', 'record'),
      leftLabel: L('qiymati', 'значение', 'value'),
      rightLabel: L('nechta son', 'сколько чисел', 'how many numbers'),
      noValue: L("qiymat yo'q", 'значения нет', 'no value'),
      rows: [
        { v: '√16', left: '4', right: L('bitta', 'одно', 'one') },
        { v: '−√16', left: '−4', right: L('bitta', 'одно', 'one') },
        { v: '±√16', left: '4, −4', right: L('ikkita', 'два', 'two') },
      ],
    },
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — LUPA. Bu ekran 1-darsdan farq qiladigan
// YAGONA ekran (metodist qarori 2026-08-21, o'n foiz).
//
// O'quvchi kesmani uch marta kattalashtiradi va ko'radi: metka har safar
// ichida qoladi, bo'linishga tushmaydi. Ildiz BOR, oxirgi raqami esa yo'q.
// ============================================================
const S5 = {
  eyebrow: L('LUPA', 'ЛУПА', 'THE MAGNIFIER'),
  title: L(
    'Ildiz ikki son orasida',
    'Корень между двумя числами',
    'The root between two numbers',
  ),
  audio: [
    A('mount',
      "Ikkidan ildiz bir va ikki orasida. Kesmani kattalashtirib, uni aniqlaymiz.",
      'Корень из двух лежит между одним и двумя. Увеличивая отрезок, будем его уточнять.',
      'The root of two lies between one and two. Zooming the segment, we refine it.'),
    W('z1',
      "Metka bir butun to'rt va bir butun besh orasida qoldi.",
      'Метка осталась между одна целая четыре и одна целая пять.',
      'The mark stayed between one point four and one point five.'),
    W('z3',
      "Uch marta kattalashtirdik, va metka har safar bo'linishlar orasida qoldi.",
      'Мы увеличили три раза, и метка каждый раз оставалась между делениями.',
      'We zoomed three times, and each time the mark stayed between the ticks.'),
  ],
  props: {
    expr: 'sqrt(2)',
    label: '√2',
    depth: 3,
    ask: L(
      "Yana kattalashtirsak, metka bo'linishga tushadimi?",
      'Если увеличивать дальше, ляжет ли метка на деление?',
      'Zooming further, will the mark land on a tick?',
    ),
    items: [
      {
        id: 'never',
        right: true,
        label: L('Hech qachon tushmaydi', 'Никогда не ляжет', 'It never will'),
      },
      {
        id: 'soon',
        label: L('Ha, tez orada', 'Да, скоро', 'Yes, soon'),
        hint: L(
          "Uch marta kattalashtirdik va har safar metka ichida qoldi. To'rtinchisi ham shunday bo'ladi.",
          'Мы увеличили три раза, и каждый раз метка оставалась внутри. Четвёртый будет таким же.',
          'We zoomed three times and each time the mark stayed inside. The fourth will be the same.',
        ),
      },
      {
        id: 'ten',
        label: L("O'ninchi kattalashtirishda", 'На десятом увеличении', 'At the tenth zoom'),
        hint: L(
          "Qadamlar soni ahamiyatsiz. Har qadamda yangi raqam paydo bo'ladi, va ular tugamaydi.",
          'Число шагов ни при чём. На каждом шаге появляется новая цифра, и они не заканчиваются.',
          'The number of steps is irrelevant. Each step brings a new digit, and they never end.',
        ),
      },
    ],
    after: L(
      "Ildiz bor, lekin oxirgi raqami yo'q. Uni faqat aniqlab borish mumkin.",
      'Корень есть, но последней цифры у него нет. Его можно только уточнять.',
      'The root exists but it has no last digit. It can only be refined.',
    ),
    note: L(
      "Shunday sonlar bilan 14-darsda tanishamiz",
      'С такими числами познакомимся на уроке 14',
      'We will meet such numbers in lesson 14',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways` asbobi): ildizni topishning ikki
// yo'li. Birinchisi to'liq kvadratlar uchun, ikkinchisi qolganlari uchun.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    'Ildizni topishning ikki yo\'li',
    'Два пути найти корень',
    'Two ways to find a root',
  ),
  audio: [
    A('mount',
      "Bitta savol va ikki yo'l. Birinchisi butun javob beradi, ikkinchisi chegaralarni.",
      'Один вопрос и два пути. Первый даёт целый ответ, второй границы.',
      'One question and two ways. The first gives a whole answer, the second gives bounds.'),
    W('w4',
      "To'liq kvadratlar jadvalidan javob to'g'ridan to'g'ri o'qiladi.",
      'По таблице полных квадратов ответ читается прямо.',
      'From the table of perfect squares the answer is read directly.'),
    W('w7',
      "O'n esa jadvalda yo'q, shuning uchun uni qo'shni kvadratlar orasiga qo'yamiz.",
      'А десяти в таблице нет, поэтому его помещают между соседними квадратами.',
      'Ten is not in the table, so we place it between neighbouring squares.'),
  ],
  props: {
    // Темп: семь строк по 1400 мс это девять секунд показа. Быстрее нельзя,
    // медленнее — ученик ждёт.
    stepMs: 1400,
    blocks: [
      {
        name: L('1-USUL — KVADRATLAR JADVALI', 'СПОСОБ 1 — ТАБЛИЦА КВАДРАТОВ', 'METHOD 1 — TABLE OF SQUARES'),
        lead: L(
          "Kvadrati aynan shu son bo'lgan sonni izlaymiz",
          'Ищем число, квадрат которого равен данному',
          'We look for the number whose square is the given one',
        ),
        rows: [
          { text: '1 · 1 = 1        2 · 2 = 4' },
          { text: '3 · 3 = 9        4 · 4 = 16' },
          { text: '√9 = 3', tone: 'ok', note: L('topildi', 'найдено', 'found') },
        ],
      },
      {
        name: L('2-USUL — QO\'SHNI KVADRATLAR', 'СПОСОБ 2 — СОСЕДНИЕ КВАДРАТЫ', 'METHOD 2 — NEIGHBOURING SQUARES'),
        lead: L(
          "Jadvalda yo'q bo'lsa, ikki qo'shni kvadrat orasiga qo'yamiz",
          'Если в таблице нет, помещаем между двумя соседними квадратами',
          'If it is not in the table, we place it between two neighbouring squares',
        ),
        rows: [
          { text: '9 < 10 < 16' },
          { text: '3 < √10 < 4', tone: 'ok', note: L('chegaralar', 'границы', 'bounds') },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM ISHLADI', 'СРАБОТАЛИ ОБА', 'BOTH WORKED'),
        lead: L(
          "Birinchisi aniq son beradi, ikkinchisi har qanday son uchun ishlaydi",
          'Первый даёт точное число, второй работает для любого числа',
          'The first gives an exact number, the second works for any number',
        ),
        rows: [{ text: '√10 ≈ 3,16', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. YOZUVNI QISMLARGA AJRATAMIZ (1-darsning `parts` asbobi).
// Ildiz belgisi, ildiz ostidagi ifoda va qiymat — uchta rol.
// ============================================================
const S7 = {
  eyebrow: L('QISMLARGA', 'ПО ЧАСТЯМ', 'PART BY PART'),
  title: L(
    'Belgi, ildiz osti va qiymat',
    'Знак, подкоренное и значение',
    'The sign, the radicand and the value',
  ),
  audio: [
    A('mount',
      "Yozuv uch qismdan iborat, va har birining o'z roli bor.",
      'Запись состоит из трёх частей, и у каждой своя роль.',
      'The record has three parts and each has its own role.'),
    W('p2',
      "Ildiz ostidagi ifoda nomanfiy bo'lishi kerak, aks holda qiymat yo'q.",
      'Подкоренное выражение обязано быть неотрицательным, иначе значения нет.',
      'The radicand must be non-negative, otherwise there is no value.'),
    W('p3',
      "Qiymat esa har doim nomanfiy, va bu belgining o'z sharti.",
      'А значение всегда неотрицательно, и это условие самого знака.',
      'And the value is always non-negative, which is the condition of the sign itself.'),
  ],
  props: {
    frac: {
      num: [{ t: '√', id: 'sign' }, { t: '49', id: 'under' }],
      den: [{ t: '= 7', id: 'val' }],
    },
    steps: [
      {
        focus: 'sign',
        text: L(
          "Ildiz belgisi. U ikkinchi darajali ildizni bildiradi, daraja yozilmaydi.",
          'Знак корня. Он означает корень второй степени, степень не пишут.',
          'The root sign. It means the second-degree root; the index is not written.',
        ),
      },
      {
        focus: 'under',
        text: L(
          "Ildiz ostidagi ifoda. U nomanfiy bo'lishi shart.",
          'Подкоренное выражение. Оно обязано быть неотрицательным.',
          'The radicand. It must be non-negative.',
        ),
      },
      {
        focus: 'val',
        text: L(
          "Qiymat. U nomanfiy, va uning kvadrati ildiz ostidagi ifodaga teng.",
          'Значение. Оно неотрицательно, и его квадрат равен подкоренному.',
          'The value. It is non-negative and its square equals the radicand.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Ildiz belgisi lotincha radix, ya'ni ildiz so'zining birinchi harfidan chiqqan: XVI asrda uni r harfi bilan yozardilar.",
        'Знак корня вырос из первой буквы латинского radix, то есть корень: в XVI веке его писали буквой r.',
        'The root sign grew out of the first letter of the Latin radix, meaning root: in the 16th century it was written as an r.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild` asbobi). Ta'rif darslikdan, 8-§,
// 39-bet, n = 2 dagi holi. Shu yerda dars XUKKA QAYTADI.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    'Kvadrat ildiz ta\'rifi',
    'Определение квадратного корня',
    'The definition of a square root',
  ),
  audio: [
    A('mount',
      "Ta'rif uchun kerak bo'lgan hamma narsani siz allaqachon qildingiz. Endi uni yig'ing.",
      'Всё, что нужно для определения, ты уже сделал руками. Теперь собери его.',
      'Everything the definition needs is already done by your hands. Now assemble it.'),
    W('card',
      "Darslik matni ochildi, va birinchi ekrandagi ikki yozuv qaytdi.",
      'Открылся текст учебника, и вернулись две записи с первого экрана.',
      'The textbook wording opened and the two records from the first screen are back.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L('Kvadrat ildiz — bu', 'Квадратный корень это', 'A square root is') },
      { id: 'f2', label: L('nomanfiy son', 'неотрицательное число', 'a non-negative number') },
      { id: 'f3', label: L('uning kvadrati', 'квадрат которого', 'whose square') },
      { id: 'f4', label: L('ildiz ostidagi ifodaga teng', 'равен подкоренному', 'equals the radicand') },
      { id: 'w1', label: L('ikki son', 'два числа', 'two numbers') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Darsda belgi HAR SAFAR bitta son berdi, va u manfiy bo'lmadi.",
      'Так не складывается. В уроке знак КАЖДЫЙ раз давал одно число, и оно не было отрицательным.',
      'That does not fit. In the lesson the sign gave one number every time, and it was not negative.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        L(
          "a nomanfiy sonning arifmetik kvadrat ildizi — kvadrati a ga teng bo'lgan nomanfiy son",
          'Арифметический квадратный корень из неотрицательного a это неотрицательное число, квадрат которого равен a',
          'The arithmetic square root of a non-negative a is the non-negative number whose square equals a',
        ),
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L('Darslik, 8-§, 39-bet (n = 2)', 'Учебник, § 8, стр. 39 (n = 2)', 'Textbook, section 8, page 39 (n = 2)'),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L('√9 = 3', '√9 = 3', '√9 = 3'),
      right: L('√10 = 3,16...', '√10 = 3,16...', '√10 = 3,16...'),
      winner: 'right',
      note: L(
        "Ikkalasining ham qiymati bor, faqat ikkinchisi butun emas",
        'Значение есть у обеих, только второе не целое',
        'Both have a value, only the second one is not whole',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill` asbobi). Besh yozuv, oson dan
// og'irga: to'liq kvadratlardan ildiz.
// ============================================================
const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    'Ildizni toping',
    'Найди корень',
    'Find the root',
  ),
  audio: [
    A('mount',
      "Besh yozuv. Har javobdan keyin yechim ochiladi.",
      'Пять записей. После каждого ответа открывается решение.',
      'Five records. After each answer the solution opens.'),
    A('why',
      "Har safar bir xil savol. Kvadrati shu songa teng bo'lgan nomanfiy son qaysi?",
      'Каждый раз один вопрос. Какое неотрицательное число в квадрате даёт это число?',
      'Every time the same question. Which non-negative number squared gives this number?'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar bitta yo'l, kvadratlar jadvali.",
      'Все пять разобраны. Каждый раз один путь, таблица квадратов.',
      'All five are done. Every time the same path, the table of squares.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√36'}</Row>,
        ok: L(
          "Ha. Olti oltiga o'ttiz olti beradi.",
          'Да. Шесть на шесть даёт тридцать шесть.',
          'Yes. Six times six gives thirty six.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '18', hint: L("Bu yarmi. Ildiz bo'lishga emas, kvadratga bog'liq.", 'Это половина. Корень связан не с делением, а с квадратом.', 'That is half. A root is about squaring, not halving.') },
          { id: 'c', label: '1296', hint: L("Bu kvadratga oshirish bo'ldi.", 'Это возведение в квадрат.', 'That is squaring.') },
        ],
        solution: ['6 · 6 = 36', '√36 = 6'],
      },
      {
        expr: <Row size="big" align="center">{'√81'}</Row>,
        ok: L(
          "Ha. To'qqiz to'qqizga sakson bir beradi.",
          'Да. Девять на девять даёт восемьдесят один.',
          'Yes. Nine times nine gives eighty one.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '9' },
          { id: 'b', label: '40,5', hint: L('Yarmi emas. Kvadrati sakson bir bo\'lgan sonni izlaymiz.', 'Не половина. Ищем число, квадрат которого восемьдесят один.', 'Not half. We look for the number whose square is eighty one.') },
          { id: 'c', label: '−9', hint: L('Minus to\'qqiz ham kvadratda sakson bir beradi, lekin ildiz nomanfiy.', 'Минус девять тоже даёт в квадрате восемьдесят один, но корень неотрицателен.', 'Minus nine also squares to eighty one, but a root is non-negative.') },
        ],
        solution: ['9 · 9 = 81', '√81 = 9'],
      },
      {
        expr: <Row size="big" align="center">{'√0'}</Row>,
        ok: L(
          "Ha. Nolning kvadrati nol, va nol nomanfiy son.",
          'Да. Квадрат нуля это нуль, а нуль неотрицателен.',
          'Yes. The square of zero is zero, and zero is non-negative.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: L("qiymat yo'q", 'значения нет', 'no value'), hint: L('Nol nomanfiy son, shuning uchun ildizi bor.', 'Нуль неотрицателен, поэтому корень у него есть.', 'Zero is non-negative, so it does have a root.') },
          { id: 'c', label: '1', hint: L('Birning kvadrati bir, nol emas.', 'Квадрат единицы это единица, а не нуль.', 'The square of one is one, not zero.') },
        ],
        solution: ['0 · 0 = 0', '√0 = 0'],
      },
      {
        expr: <Row size="big" align="center">{'√121'}</Row>,
        ok: L(
          "Ha. O'n bir o'n birga yuz yigirma bir beradi.",
          'Да. Одиннадцать на одиннадцать даёт сто двадцать один.',
          'Yes. Eleven times eleven gives one hundred twenty one.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '11' },
          { id: 'b', label: '12', hint: L("O'n ikkining kvadrati yuz qirq to'rt, bu ko'p.", 'Квадрат двенадцати сто сорок четыре, это больше.', 'The square of twelve is one hundred forty four, that is more.') },
          { id: 'c', label: '10', hint: L("O'nning kvadrati yuz, bu kam.", 'Квадрат десяти сто, это меньше.', 'The square of ten is one hundred, that is less.') },
        ],
        solution: ['11 · 11 = 121', '√121 = 11'],
      },
      {
        expr: <Row size="big" align="center">{'√(−4)'}</Row>,
        ok: L(
          "Ha. Hech qanday sonning kvadrati manfiy bo'lmaydi, shuning uchun qiymat yo'q.",
          'Да. Квадрат никакого числа не бывает отрицательным, поэтому значения нет.',
          'Yes. No number has a negative square, so there is no value.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: L("qiymat yo'q", 'значения нет', 'no value') },
          { id: 'b', label: '−2', hint: L('Minus ikkining kvadrati to\'rt, minus to\'rt emas.', 'Квадрат минус двух это четыре, а не минус четыре.', 'The square of minus two is four, not minus four.') },
          { id: 'c', label: '2', hint: L('Ikkining kvadrati to\'rt, ildiz ostida esa minus to\'rt.', 'Квадрат двух это четыре, а под корнем минус четыре.', 'The square of two is four, but the radicand is minus four.') },
        ],
        solution: ['a · a ≥ 0', '√(−4) — qiymat yo\'q'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): chegaralar. To'liq kvadrat
// bo'lmasa, ildiz ikki butun son orasida.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    'Ikki butun son orasida',
    'Между двумя целыми',
    'Between two integers',
  ),
  audio: [
    A('mount',
      "Uch yozuv, va hech biri to'liq kvadrat emas. Chegaralarni topamiz.",
      'Три записи, и ни одна не полный квадрат. Найдём границы.',
      'Three records and none is a perfect square. We will find the bounds.'),
    A('why',
      "Qo'shni kvadratlarni eslang. Ular chegaralarni beradi.",
      'Вспомни соседние квадраты. Они и дают границы.',
      'Recall the neighbouring squares. They give the bounds.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar qo'shni kvadratlar orasiga qo'yildi.",
      'Все три разобраны. Каждый раз помещали между соседними квадратами.',
      'All three are done. Every time it was placed between neighbouring squares.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√30'}</Row>,
        ok: L(
          "Ha. Yigirma besh o'ttizdan kichik, o'ttiz oltidan katta.",
          'Да. Двадцать пять меньше тридцати, тридцать шесть больше.',
          'Yes. Twenty five is less than thirty, thirty six is more.',
        ),
        question: L('Qaysi butun sonlar orasida?', 'Между какими целыми лежит?', 'Between which integers does it lie?'),
        items: [
          { id: 'a', right: true, label: '5 va 6' },
          { id: 'b', label: '4 va 5', hint: L("Beshning kvadrati yigirma besh, u o'ttizdan kichik.", 'Квадрат пяти двадцать пять, он меньше тридцати.', 'The square of five is twenty five, less than thirty.') },
          { id: 'c', label: '29 va 31', hint: L("Bu ildiz ostidagi sonning qo'shnilari, ildizning emas.", 'Это соседи подкоренного числа, а не корня.', 'Those are neighbours of the radicand, not of the root.') },
        ],
        solution: ['25 < 30 < 36', '5 < √30 < 6'],
      },
      {
        expr: <Row size="big" align="center">{'√50'}</Row>,
        ok: L(
          "Ha. Qirq to'qqiz ellikdan kichik, oltmish to'rt esa katta.",
          'Да. Сорок девять меньше пятидесяти, шестьдесят четыре больше.',
          'Yes. Forty nine is less than fifty, sixty four is more.',
        ),
        question: L('Qaysi butun sonlar orasida?', 'Между какими целыми лежит?', 'Between which integers does it lie?'),
        items: [
          { id: 'a', right: true, label: '7 va 8' },
          { id: 'b', label: '6 va 7', hint: L("Yettining kvadrati qirq to'qqiz, u ellikdan kichik.", 'Квадрат семи сорок девять, он меньше пятидесяти.', 'The square of seven is forty nine, less than fifty.') },
          { id: 'c', label: '25 va 26', hint: L("Ellikning yarmi ildiz emas.", 'Половина пятидесяти это не корень.', 'Half of fifty is not the root.') },
        ],
        solution: ['49 < 50 < 64', '7 < √50 < 8'],
      },
      {
        expr: <Row size="big" align="center">{'√8'}</Row>,
        ok: L(
          "Ha. To'rt sakkizdan kichik, to'qqiz esa katta.",
          'Да. Четыре меньше восьми, девять больше.',
          'Yes. Four is less than eight, nine is more.',
        ),
        question: L('Qaysi butun sonlar orasida?', 'Между какими целыми лежит?', 'Between which integers does it lie?'),
        items: [
          { id: 'a', right: true, label: '2 va 3' },
          { id: 'b', label: '3 va 4', hint: L("Uchning kvadrati to'qqiz, u sakkizdan katta.", 'Квадрат трёх девять, он больше восьми.', 'The square of three is nine, more than eight.') },
          { id: 'c', label: '4 va 5', hint: L("To'rtning kvadrati o'n olti, bu ancha ko'p.", 'Квадрат четырёх шестнадцать, это уже много.', 'The square of four is sixteen, far too much.') },
        ],
        solution: ['4 < 8 < 9', '2 < √8 < 3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`): qiymat BORMI. Nol bor, manfiy
// yo'q — bu ekran З30 ni davolaydi.
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    'Qiymat bormi',
    'Есть ли значение',
    'Is there a value',
  ),
  audio: [
    A('mount',
      "Uch yozuv. Savol bitta, qiymat bormi.",
      'Три записи. Вопрос один, есть ли значение.',
      'Three records. One question, is there a value.'),
    A('why',
      "Ildiz ostidagi ifodaga qarang. Manfiy bo'lsa, qiymat yo'q.",
      'Смотри на подкоренное. Если оно отрицательное, значения нет.',
      'Look at the radicand. If it is negative, there is no value.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Ildiz ostidagi ifoda nomanfiy bo'lishi shart.",
      'Все три разобраны. Подкоренное обязано быть неотрицательным.',
      'All three are done. The radicand must be non-negative.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√2'}</Row>,
        ok: L(
          "Ha. Ikki nomanfiy, demak ildizi bor, faqat u butun emas.",
          'Да. Два неотрицательно, значит корень есть, только он не целый.',
          'Yes. Two is non-negative, so the root exists, only it is not whole.',
        ),
        question: L('Qiymati bormi?', 'Есть ли значение?', 'Is there a value?'),
        items: [
          { id: 'a', right: true, label: L('Bor, lekin butun emas', 'Есть, но не целое', 'Yes, but not whole') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L('Lupada uni ko\'rdingiz, u bir va ikki orasida.', 'Ты видел его в лупе, оно между одним и двумя.', 'You saw it in the magnifier, between one and two.') },
          { id: 'c', label: L('Bor va butun', 'Есть и целое', 'Yes and whole'), hint: L('Ikki hech qanday butun sonning kvadrati emas.', 'Два не квадрат никакого целого.', 'Two is the square of no whole number.') },
        ],
        solution: ['1 < √2 < 2', '√2 ≈ 1,41'],
      },
      {
        expr: <Row size="big" align="center">{'√(−9)'}</Row>,
        ok: L(
          "Ha. Kvadrat manfiy bo'lmaydi, shuning uchun bunday son yo'q.",
          'Да. Квадрат не бывает отрицательным, поэтому такого числа нет.',
          'Yes. A square is never negative, so no such number exists.',
        ),
        question: L('Qiymati bormi?', 'Есть ли значение?', 'Is there a value?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: '−3', hint: L('Minus uchning kvadrati to\'qqiz, minus to\'qqiz emas.', 'Квадрат минус трёх девять, а не минус девять.', 'The square of minus three is nine, not minus nine.') },
          { id: 'c', label: '3', hint: L('Uchning kvadrati to\'qqiz, ildiz ostida esa minus to\'qqiz.', 'Квадрат трёх девять, а под корнем минус девять.', 'The square of three is nine, but the radicand is minus nine.') },
        ],
        solution: ['a · a ≥ 0', '√(−9) — qiymat yo\'q'],
      },
      {
        expr: <Row size="big" align="center">{'√1'}</Row>,
        ok: L(
          "Ha. Birning kvadrati bir, va bir nomanfiy.",
          'Да. Квадрат единицы это единица, и она неотрицательна.',
          'Yes. The square of one is one, and one is non-negative.',
        ),
        question: L('Qiymati bormi?', 'Есть ли значение?', 'Is there a value?'),
        items: [
          { id: 'a', right: true, label: L('Bor, u birga teng', 'Есть, равно единице', 'Yes, it equals one') },
          { id: 'b', label: L('Bor, nolga teng', 'Есть, равно нулю', 'Yes, it equals zero'), hint: L('Nolning kvadrati nol, bizda esa bir.', 'Квадрат нуля это нуль, а у нас единица.', 'The square of zero is zero, but here we have one.') },
          { id: 'c', label: L("Yo'q", 'Нет', 'No'), hint: L('Bir nomanfiy son, ildizi bor.', 'Единица неотрицательна, корень есть.', 'One is non-negative, the root exists.') },
        ],
        solution: ['1 · 1 = 1', '√1 = 1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): ildizni hadlarga bo'lib
// chiqarish (З4). Ikki chuqur xato ketma ket.
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ildiz va yig'indi",
    'Корень и сумма',
    'The root and the sum',
  ),
  audio: [
    A('mount',
      "Ikki yozuv, va ikkalasida ham ildiz ostida amal turibdi.",
      'Две записи, и в обеих под корнем стоит действие.',
      'Two records, and in both an operation stands under the root.'),
    A('why',
      "Har safar tekshiring, avval ildiz ostidagi amalni bajaring, keyin ildizni oling.",
      'Каждый раз проверяй, сначала выполни действие под корнем, потом бери корень.',
      'Check every time, first do the operation under the root, then take the root.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Ildiz hadlarga bo'linmaydi, ko'paytuvchilarga esa bo'linadi.",
      'Оба разобраны. По слагаемым корень не раздаётся, а по множителям раздаётся.',
      'Both are done. A root does not distribute over terms, but it does over factors.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'√(16 + 9)'}</Row>,
        ok: L(
          "Ha. Avval o'n olti plyus to'qqiz, ya'ni yigirma besh, keyin ildiz, ya'ni besh.",
          'Да. Сначала шестнадцать плюс девять, то есть двадцать пять, потом корень, то есть пять.',
          'Yes. First sixteen plus nine, that is twenty five, then the root, that is five.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '5' },
          { id: 'b', label: '7', hint: L("Bu ildizlarning yig'indisi, to'rt plyus uch. Yig'indining ildizi esa boshqa son.", 'Это сумма корней, четыре плюс три. А корень суммы другое число.', 'That is the sum of the roots, four plus three. The root of the sum is a different number.') },
          { id: 'c', label: '25', hint: L("Yigirma besh bu ildiz ostidagi son. Ildizni olish qoldi.", 'Двадцать пять это подкоренное число. Осталось взять корень.', 'Twenty five is the radicand. The root still has to be taken.') },
        ],
        solution: ['16 + 9 = 25', '√25 = 5'],
      },
      {
        expr: <Row size="big" align="center">{'√(9 · 4)'}</Row>,
        ok: L(
          "Ha. Bu yerda ko'paytuvchilarga bo'lish ishlaydi, uch karra ikki olti.",
          'Да. Здесь раздача по множителям работает: три на два шесть.',
          'Yes. Here distributing over factors works: three times two is six.',
        ),
        question: L('Qiymati qancha?', 'Чему равно значение?', 'What is the value?'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '36', hint: L("O'ttiz olti bu ildiz ostidagi son.", 'Тридцать шесть это подкоренное число.', 'Thirty six is the radicand.') },
          { id: 'c', label: '13', hint: L("Bu yig'indi. Ildiz ostida ko'paytirish turibdi.", 'Это сумма. А под корнем стоит умножение.', 'That is a sum. But the radicand holds a product.') },
        ],
        solution: ['9 · 4 = 36', '√36 = 6'],
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
      "Yozuv ikki qadamdan iborat. Kvadratni topasiz, keyin ildizni yozasiz.",
      'Запись состоит из двух шагов. Находишь квадрат, потом пишешь корень.',
      'The record has two steps. You find the square, then write the root.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Yozuv to'ldi. Ikki qadam, kvadratni topish va ildizni yozish.",
      'Запись заполнена. Два шага, найти квадрат и записать корень.',
      'The record is filled. Two steps, find the square and write the root.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['8', '64', '='],
      lines: [
        [{ t: '8 · 8 ' }, { slot: '=' }, { t: ' ' }, { slot: '64' }],
        [{ t: '√64 = ' }, { slot: '8' }],
      ],
    },
    tasks: [
      {
        chips: ['7', '49', '='],
        lines: [
          [{ t: '7 · 7 ' }, { slot: '=' }, { t: ' ' }, { slot: '49' }],
          [{ t: '√49 = ' }, { slot: '7' }],
        ],
      },
      {
        chips: ['12', '144', '='],
        lines: [
          [{ t: '12 · 12 ' }, { slot: '=' }, { t: ' ' }, { slot: '144' }],
          [{ t: '√144 = ' }, { slot: '12' }],
        ],
      },
      {
        chips: ['10', '100', '='],
        lines: [
          [{ t: '10 · 10 ' }, { slot: '=' }, { t: ' ' }, { slot: '100' }],
          [{ t: '√100 = ' }, { slot: '10' }],
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
    'Ildiz belgilari',
    'Признаки корня',
    'The marks of a root',
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
        tag: 'З29',
        ask: L('√49 nechta son beradi?', 'Сколько чисел даёт √49?', 'How many numbers does √49 give?'),
        options: [
          { id: 'one', right: true, label: L('Bitta, 7', 'Одно, 7', 'One, 7') },
          { id: 'two', label: L('Ikkita, 7 va −7', 'Два, 7 и −7', 'Two, 7 and −7') },
          { id: 'none', label: L('Hech qanday', 'Ни одного', 'None') },
          { id: 'many', label: L("Cheksiz ko'p", 'Бесконечно много', 'Infinitely many') },
        ],
        hint: L(
          "Ta'rif nomanfiy sonni talab qiladi.",
          'Определение требует неотрицательное число.',
          'The definition demands a non-negative number.',
        ),
        ok: L(
          "Tenglamaning ikki ildizi bo'ladi, belgi esa bittasini beradi.",
          'У уравнения бывает два корня, а знак даёт одно число.',
          'An equation may have two roots, but the sign gives one number.',
        ),
      },
      {
        id: 'q2',
        tag: 'З30',
        ask: L('√7 ning qiymati bormi?', 'Есть ли значение у √7?', 'Does √7 have a value?'),
        options: [
          { id: 'yes', right: true, label: L('Bor, butun emas', 'Есть, не целое', 'Yes, not whole') },
          { id: 'no', label: L("Yo'q, 7 to'liq kvadrat emas", 'Нет, 7 не полный квадрат', 'No, 7 is not a perfect square') },
          { id: 'half', label: L('Bor, 3,5 ga teng', 'Есть, равно 3,5', 'Yes, it equals 3.5') },
          { id: 'zero', label: L('Bor, nolga teng', 'Есть, равно нулю', 'Yes, it equals zero') },
        ],
        hint: L(
          "To'rt yettidan kichik, to'qqiz katta. Demak ildiz ikki va uch orasida.",
          'Четыре меньше семи, девять больше. Значит корень между двумя и тремя.',
          'Four is less than seven, nine is more. So the root is between two and three.',
        ),
        ok: L(
          "Har qanday nomanfiy sonning ildizi bor. Butun bo'lishi esa shart emas.",
          'У любого неотрицательного числа корень есть. А целым он быть не обязан.',
          'Every non-negative number has a root. It need not be whole.',
        ),
      },
      {
        id: 'q3',
        tag: 'З4',
        ask: L('√(4 + 9) nimaga teng?', 'Чему равно √(4 + 9)?', 'What does √(4 + 9) equal?'),
        options: [
          { id: 'ok', right: true, label: L('13 dan ildiz', 'Корень из 13', 'The root of 13') },
          { id: 'five', label: '5' },
          { id: 'six', label: '6' },
          { id: 'thirteen', label: '13' },
        ],
        hint: L(
          "Avval ildiz ostidagi amal, keyin ildiz. Ikki plyus uch bu ildizlarning yig'indisi.",
          'Сначала действие под корнем, потом корень. Два плюс три это сумма корней.',
          'First the operation under the root, then the root. Two plus three is the sum of roots.',
        ),
        ok: L(
          "O'n uch to'liq kvadrat emas, shuning uchun javob shunday qoladi.",
          'Тринадцать не полный квадрат, поэтому ответ так и остаётся.',
          'Thirteen is not a perfect square, so the answer stays as it is.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          'Ildizni qanday tekshirasiz?',
          'Как проверить корень?',
          'How do you check a root?',
        ),
        options: [
          { id: 'sq', right: true, label: L('Javobni kvadratga oshirib', 'Возвести ответ в квадрат', 'Square the answer') },
          { id: 'half', label: L('Ildiz ostini ikkiga bo\'lib', 'Разделить подкоренное на два', 'Halve the radicand') },
          { id: 'look', label: L("Ko'z bilan", 'Глазами', 'By eye') },
          { id: 'add', label: L("Javobni ikki marta qo'shib", 'Сложить ответ дважды', 'Add the answer twice') },
        ],
        hint: L(
          "Ta'rifga qaytamiz: qiymatning KVADRATI ildiz ostidagi ifodaga teng.",
          'Возвращаемся к определению: КВАДРАТ значения равен подкоренному.',
          'Back to the definition: the SQUARE of the value equals the radicand.',
        ),
        ok: L(
          "Kvadratga oshirib tekshirish har safar ishlaydi, taxmin qilish esa yo'q.",
          'Проверка возведением в квадрат работает каждый раз, а угадывание нет.',
          'Checking by squaring works every time; guessing does not.',
        ),
      },
      {
        id: 'q5',
        tag: 'З30',
        ask: L('Yozuvni yig\'ing', 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Kvadrati 30 ga eng yaqin bo'lgan butun sonlarni toping va chegarani yig'ing.",
            'Найди целые числа, чьи квадраты ближе всего к 30, и собери границы.',
            'Find the integers whose squares are closest to 30 and assemble the bounds.',
          ),
          lines: [
            [{ t: '  ' }, { slot: '5' }, { t: '  <  √30  <  ' }, { slot: '6' }],
          ],
          tiles: [
            { id: 't1', v: '5', x: 10, y: 12 },
            { id: 't2', v: '6', x: 64, y: 10 },
            { id: 't3', v: '30', x: 36, y: 48 },
            { id: 't4', v: '4', x: 78, y: 46 },
            { id: 't5', v: '25', x: 20, y: 50 },
          ],
          hint: L(
            "Kvadratlar jadvalini eslang: yigirma besh va o'ttiz olti.",
            'Вспомни таблицу квадратов: двадцать пять и тридцать шесть.',
            'Recall the table of squares: twenty five and thirty six.',
          ),
          doneNote: L(
            "Yig'ildi. Ildiz besh va olti orasida, chunki kvadratlari yigirma besh va o'ttiz olti.",
            'Собрано. Корень между пятью и шестью, потому что их квадраты двадцать пять и тридцать шесть.',
            'Assembled. The root is between five and six because their squares are twenty five and thirty six.',
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
    'Ildiz bor, oxirgi raqami yo\'q',
    'Корень есть, последней цифры нет',
    'The root exists, the last digit does not',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi, ildiz ikki va uch orasida.",
      'С урока остаётся одна запись, корень между двумя и тремя.',
      'One record stays with you, a root between two and three.'),
    A('s1',
      "Bugun uch narsani qildingiz. Kvadratlar jadvalidan ildiz topdingiz, chegaralarni qo'ydingiz va lupada aniqladingiz.",
      'Сегодня сделано три вещи. Найден корень по таблице квадратов, поставлены границы и уточнение в лупе.',
      'Three things are done today. A root from the table of squares, the bounds, and refining in the magnifier.'),
    A('s2',
      "Keyingi darsda arifmetik kvadrat ildiz va uning yozuvi. Belgi o'sha, shartlari aniqroq bo'ladi.",
      'В следующем уроке арифметический квадратный корень и его запись. Знак тот же, условия станут строже.',
      'The next lesson covers the arithmetic square root and its notation. The same sign, stricter conditions.'),
  ],
  props: {
    mark: '2 < √8 < 3',
    markNote: L(
      "qo'shni kvadratlar chegara beradi",
      'соседние квадраты дают границы',
      'neighbouring squares give the bounds',
    ),
    // Строки итога КОРОТКИЕ: полные утверждения занимают по две строки каждое,
    // и вместе со сценой экран выходил за фолд на 60 пикселей (замер стенда).
    lines: [
      L('Ildiz nomanfiy son', 'Корень неотрицателен', 'A root is non-negative'),
      L(
        "Har qanday nomanfiy sondan ildiz bor",
        'Корень есть у любого неотрицательного',
        'Every non-negative number has a root',
      ),
      L(
        "Butun chiqmasa, ikki butun orasida",
        'Не целый — значит между двумя целыми',
        'Not whole means between two integers',
      ),
    ],
    bridge: L(
      "Keyingi dars: arifmetik kvadrat ildiz",
      'Следующий урок: арифметический квадратный корень',
      'Next lesson: the arithmetic square root',
    ),
  },
}

// ============================================================
// EKRANLAR. O'n to'rt ekran 1-darsning asboblarida, bitta — blokning
// mexanikasi (5-ekran, lupa). Farq bir ekran, o'n foizdan kam.
// ============================================================
// Экраны собирает КАРКАС: роли, приборы и виды приходят из обстановки урока 1,
// урок отдаёт только свои данные, теги и одну подмену — механику блока.
// Механика блока стоит на ПЯТОМ экране: одна позиция из пятнадцати, шесть
// процентов, и правило десяти процентов выполнено.
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З30', 'З29', 'З30',
    'З30', 'З29', 'З29', 'З29', 'З30',
    'З30', 'З4', 'З16', null, null,
  ],
  mechanic: { at: 5, tool: 'zoom', kind: 'zoom' },
  hook: <HookScene />,
  final: FinalScene,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
