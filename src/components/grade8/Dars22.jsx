// ============================================================================
// 8-sinf, Dars 22. KO'PAYTUVCHILARGA AJRATISH VA BIKVADRAT TENGLAMALAR.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `factorpair.jsx` da.
//
// REJADAGI IKKI ASBOB, BITTASI TANLANDI. Reja bu darsga FactorPair va
// SquareCut ni beradi. Blokning boshqa uchdan-uchga qoidasi bo'yicha bitta
// mexanika tanlandi: FactorPair, chunki u ko'paytuvchilarga ajratishning
// o'zi (5-ekran). SquareCut bu yerda ishlatilmadi — to'la kvadratni
// ajratish bikvadrat tenglamaga hech narsa qo'shmaydi.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `factorpair`: bosh koeffitsiyent birdan
// farqli tenglamani ko'paytuvchilarga ajratish.
//
// DARSNING IKKI ISHI, IKKI YARIM:
//   BIRINCHI YARIM (1-8-ekran, darslik 25-§, 152-154-bet): ax² + bx + c
//   = a(x − x1)(x − x2) — Viyet teoremasidan chiqadigan umumiy teorema,
//   bosh koeffitsiyent birdan farqli bo'lganda ham ishlaydi;
//   IKKINCHI YARIM (9-13-ekran, darslik 26-§, 156-157-bet): ax⁴ + bx² + c
//   = 0 BIKVADRAT tenglama, x² = t belgilash bilan kvadrat tenglamaga
//   keltiriladi. t MANFIY chiqsa, undan x topilmaydi — chunki x kvadrat
//   manfiy songa teng bo'lolmaydi (9-darsdan qaytadigan fakt, endi ikki
//   qavatli).
//
// ENG NOZIK JOY. t manfiy chiqishi mumkin, va bu holda U TENGLAMANING
// yechimi emas — u FAQAT YORDAMCHI o'zgaruvchi edi. Manfiy t dan x
// «topishga» urinish yangi tag: З48.
//
// DARSLIK. O'zbek darsligi: 25-§ 152-154-bet (teorema 5, 6-masala — aynan
// shu misol 5-ekranda ishlatilgan), 26-§ 156-157-bet (ta'rif, 1- va
// 2-masala — 2-masala 10-ekranda ishlatilgan).
//
// ADASHISHLAR: bittasi yangi, to'rttasi qaytadi:
//   З48 — t manfiy bo'lganda ham undan x qiymati topilgan;
//   З46 — ikkinchi ildiz ko'paytmadan to'g'ri aniqlanmadi (19-darsdan,
//         endi bosh koeffitsiyent birdan farqli holda);
//   З40 — kvadrat ildiz olinganda plyus-minus unutildi;
//   З38 — a nolga teng bo'lishi mumkin deb o'ylandi;
//   З16 — javob son bilan tekshirilmadi (11-ekranda).
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
  id: 'alg-8-22',
  n: 22,
  row: 24,
  block: 'Б3',
  topic: L(
    "Ko'paytuvchilarga ajratish va bikvadrat tenglamalar",
    'Разложение квадратного трёхчлена на множители и биквадратные уравнения',
    'Factoring a quadratic trinomial and biquadratic equations',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "agar x1, x2 lar ax² + bx + c = 0 tenglamaning ildizlari bo'lsa, ax² + bx + c = a(x − x1)(x − x2)",
    'Если x1, x2 — корни уравнения ax² + bx + c = 0, то ax² + bx + c = a(x − x1)(x − x2)',
    'If x1, x2 are roots of a x squared plus b x plus c equals zero, then a x squared plus b x plus c equals a times (x minus x1)(x minus x2)',
  ),
  L(
    "ax⁴ + bx² + c = 0 bikvadrat tenglama deyiladi, x² = t belgilash bilan kvadrat tenglamaga keltiriladi",
    'Уравнение ax⁴ + bx² + c = 0 называется биквадратным, заменой x² = t приводится к квадратному',
    'The equation a x to the fourth plus b x squared plus c equals zero is called biquadratic, and the substitution x squared equals t reduces it to quadratic',
  ),
  L(
    "t manfiy chiqsa, undan haqiqiy x topilmaydi, chunki x kvadrat manfiy bo'lolmaydi",
    'Если t выходит отрицательным, из него нельзя найти действительный x, потому что x в квадрате не бывает отрицательным',
    'If t comes out negative, no real x can be found from it, since x squared is never negative',
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
  'З38': {
    what: L(
      "a nolga teng bo'lishi mumkin deb o'ylandi",
      'a посчитано способным равняться нулю',
      'a was assumed able to equal zero',
    ),
    wrong: '0',
    at: 4,
  },
  'З40': {
    what: L(
      "kvadrat ildiz olinganda faqat musbat javob yozildi, plyus-minus unutildi",
      'при извлечении квадратного корня записан только положительный ответ, плюс-минус забыт',
      'when taking the square root, only the positive answer was written, plus-or-minus forgotten',
    ),
    wrong: '2',
    at: 9,
  },
  'З46': {
    what: L(
      "ikkinchi ildiz ko'paytmadan yoki yig'indidan to'g'ri aniqlanmadi",
      'второй корень не был верно определён через произведение или сумму',
      'the second root was not correctly determined from the product or the sum',
    ),
    wrong: '3',
    at: 5,
  },
  'З48': {
    what: L(
      "t manfiy bo'lganda ham undan x qiymati topilgan",
      'значение x найдено из t, даже когда t отрицательно',
      'an x value was found from t even when t is negative',
    ),
    wrong: '-1',
    at: 10,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: bikvadrat tenglama, ikkita yoki to'rtta ildiz.
// Yakun: to'rtta emas, ikkita — chunki bitta t manfiy chiqdi.
// ============================================================
const SC_HOW_MANY = L('IKKITA YOKI TO\'RTTA', 'ДВА ИЛИ ЧЕТЫРЕ', 'TWO OR FOUR')

const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "To'rtinchi darajali tenglama",
      'Уравнение четвёртой степени',
      'A fourth-degree equation',
    )}>
      <text x="200" y="65" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18"
        fill={T.ink}>{'9x⁴ + 5x² − 4 = 0'}</text>

      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="95" r="16" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="130" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_HOW_MANY)}</text>
    </SceneBand>
  )
}

const FinalScene = () => {
  const t = useT()
  return (
    <SceneBand kind="final" label={L(
      "To'rtta emas, ikkita ildiz",
      'Не четыре, а два корня',
      'Not four, but two roots',
    )}>
      <text x="200" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
        fill={T.ink}>{'9x⁴ + 5x² − 4 = 0'}</text>
      <g className="g8-seat" style={{ '--d': '600ms' }}>
        <text x="200" y="52" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fill={T.graph}>{t(L('t = 4/9  yoki  t = −1', 't = 4/9 или t = −1', 't = 4/9 or t = −1'))}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <line x1="80" y1="76" x2="320" y2="76" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <circle cx="150" cy="76" r="4.4" fill={T.ok}/>
        <text x="150" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>{'x = ±2/3'}</text>
        <circle cx="260" cy="76" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
        <text x="260" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>{t(L('t = −1 rad etildi', 't = −1 отвергнуто', 't = −1 rejected'))}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('IKKITA YOKI TO\'RTTA', 'ДВА ИЛИ ЧЕТЫРЕ', 'TWO OR FOUR'),
  title: L(
    "9x to'rtinchi daraja plyus 5x kvadrat minus 4 teng nolning nechta ildizi bor",
    'Сколько корней у 9x в четвёртой степени плюс 5x квадрат минус 4 равно нулю',
    'How many roots does nine x to the fourth plus five x squared minus four equal zero have',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Bu tenglamada iks to'rtinchi darajada. Kvadrat tenglamadan farqli.",
      'В этом уравнении икс в четвёртой степени. Оно отличается от квадратного.',
      'In this equation x is to the fourth power. It differs from a quadratic.'),
    A('why',
      "Taxmin qiling, nechta ildiz bo'ladi.",
      'Предположи, сколько будет корней.',
      'Predict how many roots there will be.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, nechta ildiz bo'ladi?",
      'Как думаешь, сколько будет корней?',
      'How many roots do you think there will be?',
    ),
    items: [
      { id: 'four', show: L("To'rtta", 'Четыре', 'Four') },
      { id: 'two', show: L('Ikkita', 'Два', 'Two') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Viyet teoremasini eslash (19-darsdan). Shu tayanch
// 5, 6 va 7-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Viyet teoremasini eslaymiz",
    'Вспоминаем теорему Виета',
    'Recalling Vieta\'s theorem',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida yig'indi va ko'paytma to'g'ri.",
      'Четыре записи. Только в одной сумма и произведение верны.',
      'Four records. Only one has the sum and product correct.'),
    A('why',
      "Yig'indi minus p ga, ko'paytma q ga teng.",
      'Сумма равна минус p, произведение равно q.',
      'The sum equals negative p, the product equals q.'),
  ],
  props: {
    ask: L(
      "x² − 5x + 6 = 0 uchun qaysi to'g'ri?",
      'Что верно для x² − 5x + 6 = 0?',
      'What is correct for x² − 5x + 6 = 0?',
    ),
    items: [
      { id: 'right', show: "x1+x2=5,  x1·x2=6", right: true },
      {
        id: 'signP', show: "x1+x2=−5,  x1·x2=6",
        hint: L("p minus besh, yig'indi esa unga qarama-qarshi, musbat besh.", 'p минус пять, а сумма противоположна ему, положительная пять.', 'p is negative five, and the sum is its opposite, positive five.'),
      },
      {
        id: 'signQ', show: "x1+x2=5,  x1·x2=−6",
        hint: L("Ko'paytma ishorasiz to'g'ridan-to'g'ri q, u musbat olti.", 'Произведение прямо равно q, оно положительная шесть.', 'The product equals q directly, and it is positive six.'),
      },
      {
        id: 'swap', show: "x1+x2=6,  x1·x2=5",
        hint: L("Yig'indi va ko'paytma almashtirilgan.", 'Сумма и произведение поменяны местами.', 'The sum and product are swapped.'),
      },
    ],
    after: L(
      "To'g'ri. Yig'indi besh, ko'paytma olti.",
      'Верно. Сумма пять, произведение шесть.',
      'Correct. The sum is five, the product is six.',
    ),
  },
}

// ============================================================
// EKRAN 3. T NI BURANG (1-darsning `steppers`). Natija — t dan ildiz.
// t manfiyga tushganda qiymat yo'qoladi (З48 ning sabab bilan birinchi
// ko'rinishi).
// ============================================================
const S3 = {
  eyebrow: L('T NI BURANG', 'КРУТИ T', 'TURN T'),
  title: L(
    "Iks kvadrat t ga teng bo'lsin",
    'Пусть икс квадрат равен t',
    'Let x squared equal t',
  ),
  audio: [
    A('mount',
      "Agar iks kvadrat t ga teng bo'lsa, iks t dan ildizga teng.",
      'Если икс квадрат равен t, то икс равен корню из t.',
      'If x squared equals t, then x equals the root of t.'),
    A('why',
      "Uch maqsad beriladi. t ning turli qiymatlarida iksni toping.",
      'Даны три цели. Находи икс при разных значениях t.',
      'Three targets are given. Find x at different values of t.'),
    A('why',
      "Oxirida t ni manfiyga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти t в минус и посмотри, что будет.',
      'At the end bring t into the negatives and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 't', label: L('t ning qiymati', 'значение t', 'the value of t'),
        start: 16, min: -4, max: 20, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] < 0 ? null : Math.round(Math.sqrt(v[0]) * 100) / 100),
    resultLabel: L('x (musbat qiymati)', 'x (положительное значение)', 'x (positive value)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "t hali manfiyga tushmasin, avval maqsadlarni oling.",
      't пока не опускай в минус, сначала возьми цели.',
      'Do not bring t into the negatives yet, take the targets first.',
    ),
    goals: [
      {
        value: 3,
        ask: L("Natija 3 ga teng bo'lsin", 'Пусть результат будет равен 3', 'Make the result equal 3'),
        after: L("Uch. To'qqizdan ildiz uch.", 'Три. Корень из девяти три.', 'Three. The root of nine is three.'),
      },
      {
        value: 2,
        ask: L("Endi natija 2 ga teng bo'lsin", 'Теперь пусть результат будет равен 2', 'Now make the result equal 2'),
        after: L("Ikki. To'rtdan ildiz ikki.", 'Два. Корень из четырёх два.', 'Two. The root of four is two.'),
      },
      {
        value: 1,
        ask: L("Oxirgisi, natija 1 ga teng bo'lsin", 'Последняя, пусть результат будет равен 1', 'The last one, make the result equal 1'),
        after: L("Bir. Birdan ildiz bir.", 'Один. Корень из единицы один.', 'One. The root of one is one.'),
      },
    ],
    ask: L("Natija 3 ga teng bo'lsin", 'Пусть результат будет равен 3', 'Make the result equal 3'),
    ask2: L("Endi t ni manfiyga tushiring", 'Теперь опусти t в минус', 'Now bring t into the negatives'),
    broke: L(
      "t manfiy bo'lganda qiymat yo'q, chunki iks ning istalgan qiymatida iks kvadrat manfiy bo'lmaydi. t faqat yordamchi harf, agar u manfiy chiqsa, undan iks topilmaydi.",
      'При отрицательном t значения нет, потому что икс квадрат не бывает отрицательным при любом иксе. t лишь вспомогательная буква, и если она выходит отрицательной, икс из неё не находится.',
      't has no value when negative, because x squared is never negative for any x. t is only an auxiliary letter, and if it comes out negative, x cannot be found from it.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI YOZUV BIKVADRAT (1-darsning `pick`). Ловушка — toq
// darajali had borligi (bikvadrat emas) yoki a nolga yashiringan.
// ============================================================
const S4 = {
  eyebrow: L('QAYSI BIRI BIKVADRAT', 'КАКОЕ БИКВАДРАТНОЕ', 'WHICH ONE IS BIQUADRATIC'),
  title: L(
    "Qaysi tenglama bikvadrat tenglama",
    'Какое уравнение — биквадратное',
    'Which equation is biquadratic',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Bikvadrat tenglamada faqat to'rtinchi, ikkinchi daraja va ozod had bo'ladi.",
      'Четыре записи. В биквадратном уравнении есть только четвёртая, вторая степень и свободный член.',
      'Four records. A biquadratic equation has only the fourth power, the second power, and the constant term.'),
    A('why',
      "Toq darajali had (iks yoki iks kub) bo'lsa, bu bikvadrat emas.",
      'Если есть член нечётной степени (икс или икс в кубе), это не биквадратное.',
      'If there is a term of odd power (x or x cubed), it is not biquadratic.'),
  ],
  props: {
    ask: L(
      "Qaysi tenglama bikvadrat?",
      'Какое уравнение биквадратное?',
      'Which equation is biquadratic?',
    ),
    items: [
      { id: 'right', show: '2x⁴ − 7x² + 3 = 0', right: true, name: L('faqat juft darajalar', 'только чётные степени', 'only even powers') },
      {
        id: 'odd', show: 'x⁴ − 3x² + x = 0',
        hint: L("Bunda iksning o'zi bor, birinchi darajali had.", 'Здесь есть сам икс, член первой степени.', 'Here there is x itself, a first-power term.'),
      },
      {
        id: 'cube', show: 'x⁴ + x³ − 4 = 0',
        hint: L("Bunda iks kub bor, uchinchi darajali had.", 'Здесь есть икс в кубе, член третьей степени.', 'Here there is x cubed, a third-power term.'),
      },
      {
        id: 'zeroA', show: '0x⁴ + 5x² − 1 = 0',
        hint: L("Bosh koeffitsiyent nolga teng, birinchi had yo'qoladi, bu kvadrat tenglama.", 'Старший коэффициент равен нулю, первый член исчезает, это квадратное уравнение.', 'The leading coefficient is zero, the first term vanishes, and this is a quadratic equation.'),
      },
    ],
    after: L(
      "To'g'ri. Faqat to'rtinchi va ikkinchi daraja bor, toq daraja yo'q.",
      'Верно. Есть только четвёртая и вторая степень, нечётной нет.',
      'Correct. Only the fourth and second powers are present, no odd power.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — TANLASH USULI (`factorpair`). Darslik
// 6-masalasi: 2x² + 5x − 3 = 0, bosh koeffitsiyent birdan farqli.
// ============================================================
const S5 = {
  eyebrow: L('TANLASH USULI', 'СПОСОБ ПОДБОРА', 'THE SELECTION METHOD'),
  title: L(
    "2x kvadrat plyus 5x minus 3 ni ko'paytuvchilarga ajratamiz",
    'Разложим два x квадрат плюс пять x минус три на множители',
    'Let us factor two x squared plus five x minus three',
  ),
  audio: [
    A('mount',
      "Bosh koeffitsiyent ikki, bir emas. Avval ikkiga bo'lib, ildizlarni tanlaymiz.",
      'Старший коэффициент два, не один. Сначала разделим на два и подберём корни.',
      'The leading coefficient is two, not one. First we divide by two and select the roots.'),
    A('why',
      "Ikkiga bo'lgandan keyin yig'indisi minus ikki yarim, ko'paytmasi minus bir yarim bo'lgan ikki sonni toping.",
      'После деления на два найди два числа с суммой минус два с половиной и произведением минус полтора.',
      'After dividing by two, find two numbers with sum negative two point five and product negative one point five.'),
  ],
  props: {
    target: { sum: -2.5, product: -1.5 },
    cellLabels: ['x1', 'x2'],
    ask: L(
      "Yig'indisi minus 2,5, ko'paytmasi minus 1,5 bo'lgan ikki son",
      'Два числа с суммой минус 2,5 и произведением минус 1,5',
      'Two numbers with sum negative 2.5 and product negative 1.5',
    ),
    hintSumOff: L(
      "Yig'indi mos kelmadi. Ikkita sonni qo'shib minus ikki yarim chiqishini tekshiring.",
      'Сумма не совпала. Проверь, что при сложении выходит минус два с половиной.',
      'The sum did not match. Check that adding the two numbers gives negative two point five.',
    ),
    hintProductOff: L(
      "Ko'paytma mos kelmadi. Yig'indi to'g'ri, lekin ko'paytirib minus bir yarim chiqishini tekshiring.",
      'Произведение не совпало. Сумма верна, но проверь, что при умножении выходит минус полтора.',
      'The product did not match. The sum is right, but check that multiplying gives negative one point five.',
    ),
    hintBothOff: L(
      "Ikkalasi ham mos kelmadi. Yarim songa e'tibor bering.",
      'Не совпало ни то, ни другое. Обрати внимание на половинное число.',
      'Neither matched. Pay attention to the half number.',
    ),
    after: L(
      "Nol yarim va minus uch. Ular birlashib minus ikki yarim, ko'paytirilib minus bir yarim beradi.",
      'Ноль целых пять и минус три. В сумме дают минус два с половиной, в произведении минус полтора.',
      'Zero point five and negative three. They add to negative two point five and multiply to negative one point five.',
    ),
    note: L(
      "x1 = 0,5,  x2 = −3.  2x² + 5x − 3 = 2(x − 0,5)(x + 3) = (2x − 1)(x + 3)",
      'x1 = 0,5,  x2 = −3.  2x² + 5x − 3 = 2(x − 0,5)(x + 3) = (2x − 1)(x + 3)',
      'x1 = 0.5,  x2 = −3.  2x² + 5x − 3 = 2(x − 0.5)(x + 3) = (2x − 1)(x + 3)',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): ko'paytuvchilarga ajratish —
// Viyet orqali yoki guruhlash usuli bilan.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Ko'paytuvchilarga ikki yo'l bilan ajratish",
    'Разложить на множители двумя способами',
    'Factoring two ways',
  ),
  audio: [
    A('mount',
      "Bitta ifoda va ikki yo'l. Ikkalasi ham bir xil natija beradi.",
      'Одно выражение и два пути. Оба дают один результат.',
      'One expression and two ways. Both give the same result.'),
    W('w2',
      "Birinchi yo'lda Viyet teoremasi orqali ildizlar tanlab topiladi.",
      'В первом пути корни находятся подбором через теорему Виета.',
      'In the first way, the roots are found by selection using Vieta\'s theorem.'),
    W('w4',
      "Ikkinchi yo'lda o'rtadagi had ikkiga ajratilib, guruhlash qo'llaniladi.",
      'Во втором пути средний член разбивается на два, и применяется группировка.',
      'In the second way, the middle term is split into two, and grouping is applied.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L("1-USUL — VIYET ORQALI", 'СПОСОБ 1 — ЧЕРЕЗ ВИЕТА', 'METHOD 1 — VIA VIETA'),
        lead: L(
          "Ikkiga bo'lib, ildizlarni tanlab topamiz",
          'Разделив на два, находим корни подбором',
          'Dividing by two, we find the roots by selection',
        ),
        rows: [
          { text: 'x1 = 0,5,  x2 = −3' },
          { text: '2(x − 0,5)(x + 3) = (2x − 1)(x + 3)', tone: 'ok' },
        ],
      },
      {
        name: L("2-USUL — GURUHLASH", 'СПОСОБ 2 — ГРУППИРОВКА', 'METHOD 2 — GROUPING'),
        lead: L(
          "O'rtadagi had ikkiga ajratiladi: besh iks olti iks minus iks",
          'Средний член разбивается на два: пять икс — шесть икс минус икс',
          'The middle term splits into two: five x is six x minus x',
        ),
        rows: [
          { text: '2x² + 6x − x − 3' },
          { text: '2x(x + 3) − (x + 3) = (2x − 1)(x + 3)', tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL NATIJA BERDI', 'ОБА ДАЛИ ОДИН РЕЗУЛЬТАТ', 'BOTH GAVE THE SAME RESULT'),
        lead: L(
          "Guruhlash sonlar chiroyli bo'lmaganda ham ishlaydi",
          'Группировка работает и когда числа не круглые',
          'Grouping works even when the numbers are not neat',
        ),
        rows: [{ text: '(2x − 1)(x + 3)', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): umumiy teoremaning chiqarilishi.
// ============================================================
const S7 = {
  eyebrow: L('TEOREMA QAYERDAN CHIQADI', 'ОТКУДА БЕРЁТСЯ ТЕОРЕМА', 'WHERE THE THEOREM COMES FROM'),
  title: L(
    "ax² + bx + c = a(x − x1)(x − x2) qayerdan chiqadi",
    'Откуда берётся ax² + bx + c = a(x − x1)(x − x2)',
    'Where a x squared plus b x plus c equals a(x minus x1)(x minus x2) comes from',
  ),
  audio: [
    A('mount',
      "Ikkiga bo'lib, x kvadrat plyus b bo'lingan a x plyus c bo'lingan a olamiz.",
      'Разделив на a, получаем икс квадрат плюс b, делённое на a, икс плюс c, делённое на a.',
      'Dividing by a, we get x squared plus b over a times x plus c over a.'),
    W('p2',
      "Viyet teoremasiga ko'ra x1 plyus x2 minus b bo'lingan a ga, x1 karra x2 c bo'lingan a ga teng.",
      'По теореме Виета x1 плюс x2 равно минус b, делённому на a, x1 умножить на x2 равно c, делённому на a.',
      'By Vieta\'s theorem, x1 plus x2 equals negative b over a, and x1 times x2 equals c over a.'),
    W('p4',
      "Shu ikkisini qo'ysak, ikkiga bo'lgan tenglama x kvadrat minus ikkisining yig'indisi ko'paytirilgan x plyus ko'paytmasi bo'lib chiqadi, va uni orqaga a ga ko'paytirsak (7) formulaga qaytamiz.",
      'Подставив это, разделённое уравнение оказывается икс квадрат минус сумма умножить на икс плюс произведение, и, умножив обратно на a, возвращаемся к формуле.',
      'Substituting this, the divided equation turns into x squared minus the sum times x plus the product, and multiplying back by a returns the formula.',
    ),
  ],
  props: {
    tokens: [
      { t: 'ax² + bx + c', id: 'left' },
      { t: '  =  ', id: 'eq' },
      { t: 'a', id: 'a' },
      { t: '(x − x1)(x − x2)', id: 'factors' },
    ],
    steps: [
      {
        focus: 'left',
        text: L(
          "Birinchi qadam. Ikkiga bo'lib, bosh koeffitsiyenti bir bo'lgan tenglamaga o'tamiz.",
          'Первый шаг. Разделив на a, переходим к уравнению со старшим коэффициентом один.',
          'Step one. Dividing by a, we move to an equation with leading coefficient one.',
        ),
      },
      {
        focus: 'factors',
        text: L(
          "Ikkinchi qadam. Bu yerda Viyet teoremasi ishlaydi: x1 va x2 yig'indisi va ko'paytmasi orqali qavslar hosil bo'ladi.",
          'Второй шаг. Здесь работает теорема Виета: скобки получаются через сумму и произведение x1 и x2.',
          'Step two. Here Vieta\'s theorem applies: the brackets come from the sum and product of x1 and x2.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Uchinchi qadam. Orqaga a ga ko'paytirib, asl tenglamaga qaytamiz — a endi qavslardan tashqarida turadi.",
          'Третий шаг. Умножив обратно на a, возвращаемся к исходному уравнению — a теперь стоит вне скобок.',
          'Step three. Multiplying back by a, we return to the original equation — a now stands outside the brackets.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Shu teorema algebraik kasrlarni qisqartirishda ham ishlatiladi: surat va maxrajni ko'paytuvchilarga ajratib, umumiy qavsni qisqartirish mumkin bo'ladi.",
        'Эта теорема применяется и при сокращении алгебраических дробей: разложив числитель и знаменатель на множители, общую скобку можно сократить.',
        'This theorem is also used when reducing algebraic fractions: factoring the numerator and denominator, a common bracket can be cancelled.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 25-§, 152-153-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Ko'paytuvchilarga ajratish teoremasi",
    'Теорема о разложении на множители',
    'The theorem for factoring',
  ),
  audio: [
    A('mount',
      "Teorema uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для теоремы, ты уже видел. Теперь собери её.',
      'Everything the theorem needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik teoremasi ochildi, va xukning ikkinchi yarmiga tayyorgarlik ko'rildi.",
      'Открылась теорема из учебника, и подготовлена почва для второй половины хука.',
      'The textbook theorem opened, and the ground is set for the second half of the hook.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("Agar x1, x2 lar ax kvadrat plyus bx plyus c teng nol", 'Если x1, x2 являются корнями a x квадрат плюс b x плюс c равно нулю', 'If x1, x2 are roots of a x squared plus b x plus c equals zero') },
      { id: 'f2', label: L("tenglamaning ildizlari bo'lsa", 'то', 'then') },
      { id: 'f3', label: L("ax kvadrat plyus bx plyus c a karra (x minus x1) (x minus x2) ga teng", 'a x квадрат плюс b x плюс c равно a умножить на (x минус x1)(x минус x2)', 'a x squared plus b x plus c equals a times (x minus x1)(x minus x2)') },
      { id: 'f4', label: L("bu barcha x uchun to'g'ri", 'это верно для всех x', 'this holds for all x') },
      { id: 'w1', label: L("bunda a har doim birga teng", 'при этом a всегда равно единице', 'here a always equals one') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. a birga teng bo'lishi shart emas, aynan shu teorema a ni ham hisobga oladi.",
      'Так не складывается. a не обязан быть равным единице, именно эта теорема учитывает и a.',
      'That does not fit. a need not equal one; this very theorem accounts for a too.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 25-§, 152–153-bet; 26-§, 156–157-bet",
        'Учебник, § 25, стр. 152–153; § 26, стр. 156–157',
        'Textbook, section 25, pages 152–153; section 26, pages 156–157',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "to'rt ildiz bormi degan savol edi",
        'вопрос был, есть ли четыре корня',
        'the question was whether there are four roots',
      ),
      right: L(
        "keyingi ekranlarda ko'ramiz: ba'zan ikkita, ba'zan to'rtta",
        'увидим на следующих экранах: иногда два, иногда четыре',
        'we will see on the next screens: sometimes two, sometimes four',
      ),
      winner: 'right',
      note: L(
        "t manfiy chiqsa, ildizlar soni kamayadi",
        'Если t выходит отрицательным, число корней уменьшается',
        'If t comes out negative, the number of roots decreases',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): bikvadrat tenglama, ikkala t
// ham musbat — to'rtta ildiz.
// ============================================================
const ASK_ROOTS = L('Ildizlari qaysi?', 'Каковы корни?', 'What are the roots?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Bikvadrat tenglamani yeching",
    'Реши биквадратное уравнение',
    'Solve the biquadratic equation',
  ),
  audio: [
    A('mount',
      "Besh tenglama. Har birida ikkala t ham musbat chiqadi.",
      'Пять уравнений. В каждом оба t выходят положительными.',
      'Five equations. In each, both values of t come out positive.'),
    A('why',
      "Har musbat t dan ikki ildiz chiqadi, plyus va minus.",
      'Каждое положительное t даёт два корня, плюс и минус.',
      'Each positive t gives two roots, plus and minus.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar to'rtta ildiz chiqdi.",
      'Все пять разобраны. Каждый раз выходило четыре корня.',
      'All five are done. Each time four roots came out.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x⁴ − 5x² + 4 = 0'}</Row>,
        ok: L("Ha. t to'rt yoki bir, ikkalasi ham musbat.", 'Да. t равно четырём или одному, оба положительны.', 'Yes. t is four or one, both positive.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = ±2,  x = ±1' },
          { id: 'b', label: 'x = 4,  x = 1', hint: L("Bu t ning qiymatlari, iks emas. Iks t dan ildiz, va u plyus-minus bo'ladi.", 'Это значения t, а не икс. Икс, корень из t, и он с плюс-минусом.', 'Those are the t values, not x. x is the root of t, with plus or minus.') },
        ],
        solution: ['t² − 5t + 4 = 0', 't = 4,  t = 1', 'x = ±2,  x = ±1'],
      },
      {
        expr: <Row size="big" align="center">{'x⁴ − 13x² + 36 = 0'}</Row>,
        ok: L("Ha. t to'qqiz yoki to'rt, ikkalasi ham musbat.", 'Да. t равно девяти или четырём, оба положительны.', 'Yes. t is nine or four, both positive.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = ±3,  x = ±2' },
          { id: 'b', label: 'x = ±9,  x = ±4', hint: L("Bu t larning o'zi, ulardan ildiz olinmagan.", 'Это сами значения t, из них не извлечён корень.', 'Those are the t values themselves, without taking the root.') },
        ],
        solution: ['t² − 13t + 36 = 0', 't = 9,  t = 4', 'x = ±3,  x = ±2'],
      },
      {
        expr: <Row size="big" align="center">{'x⁴ − 10x² + 9 = 0'}</Row>,
        ok: L("Ha. t to'qqiz yoki bir.", 'Да. t равно девяти или единице.', 'Yes. t is nine or one.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = ±3,  x = ±1' },
          { id: 'b', label: 'x = ±1,  x = ±9', hint: L("To'qqizdan ildiz uch, to'qqiz emas.", 'Корень из девяти три, а не девять.', 'The root of nine is three, not nine.') },
        ],
        solution: ['t² − 10t + 9 = 0', 't = 9,  t = 1', 'x = ±3,  x = ±1'],
      },
      {
        expr: <Row size="big" align="center">{'x⁴ − 29x² + 100 = 0'}</Row>,
        ok: L("Ha. t yigirma besh yoki to'rt.", 'Да. t равно двадцати пяти или четырём.', 'Yes. t is twenty five or four.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = ±5,  x = ±2' },
          { id: 'b', label: 'x = ±25,  x = ±4', hint: L("Yigirma beshdan ildiz besh, yigirma besh emas.", 'Корень из двадцати пяти пять, а не двадцать пять.', 'The root of twenty five is five, not twenty five.') },
        ],
        solution: ['t² − 29t + 100 = 0', 't = 25,  t = 4', 'x = ±5,  x = ±2'],
      },
      {
        expr: <Row size="big" align="center">{'x⁴ − 20x² + 64 = 0'}</Row>,
        ok: L("Ha. t o'n olti yoki to'rt.", 'Да. t равно шестнадцати или четырём.', 'Yes. t is sixteen or four.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = ±4,  x = ±2' },
          { id: 'b', label: 'x = ±16,  x = ±4', hint: L("O'n oltidan ildiz to'rt, o'n olti emas.", 'Корень из шестнадцати четыре, а не шестнадцать.', 'The root of sixteen is four, not sixteen.') },
        ],
        solution: ['t² − 20t + 64 = 0', 't = 16,  t = 4', 'x = ±4,  x = ±2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): bikvadrat tenglama, bitta t
// manfiy — ikkita ildiz (darslik 2-masalasi, З48).
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Bitta t manfiy chiqadi",
    'Одно t выходит отрицательным',
    'One t comes out negative',
  ),
  audio: [
    A('mount',
      "Uch tenglama. Har birida ikkita t chiqadi, lekin faqat bittasi musbat.",
      'Три уравнения. В каждом выходит два t, но только одно положительно.',
      'Three equations. In each, two t values come out, but only one is positive.'),
    A('why',
      "Manfiy t dan iks topilmaydi, u rad etiladi.",
      'Из отрицательного t икс не находится, оно отвергается.',
      'x cannot be found from a negative t; it is rejected.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar manfiy t rad etilib, ikkita ildiz qoldi.",
      'Все три разобраны. Каждый раз отрицательное t отвергалось, оставались два корня.',
      'All three are done. Each time the negative t was rejected, leaving two roots.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'9x⁴ + 5x² − 4 = 0'}</Row>,
        ok: L("Ha. t to'qqizdan to'rt yoki minus bir, minus bir rad etiladi.", 'Да. t равно четырём девятым или минус одному, минус один отвергается.', 'Yes. t is four ninths or negative one, and negative one is rejected.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = ±2/3' },
          { id: 'b', label: 'x = ±2/3,  x = ±1', hint: L("t minus bir manfiy, undan iks topilmaydi.", 'T минус один отрицательно, из него икс не находится.', 't negative one is negative; x cannot be found from it.') },
        ],
        solution: [
          '9t² + 5t − 4 = 0',
          't = 4/9,  t = −1',
          L('t = −1 manfiy, rad etildi', 't = −1 отрицательно, отвергнут', 't = −1 is negative, rejected'),
          'x = ±2/3',
        ],
      },
      {
        expr: <Row size="big" align="center">{'x⁴ + 3x² − 4 = 0'}</Row>,
        ok: L("Ha. t bir yoki minus to'rt, minus to'rt rad etiladi.", 'Да. t равно одному или минус четырём, минус четыре отвергается.', 'Yes. t is one or negative four, and negative four is rejected.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = ±1' },
          { id: 'b', label: 'x = ±1,  x = ±2', hint: L("t minus to'rt manfiy, undan iks topilmaydi.", 'T минус четыре отрицательно, из него икс не находится.', 't negative four is negative; x cannot be found from it.') },
        ],
        solution: [
          't² + 3t − 4 = 0',
          't = 1,  t = −4',
          L('t = −4 manfiy, rad etildi', 't = −4 отрицательно, отвергнут', 't = −4 is negative, rejected'),
          'x = ±1',
        ],
      },
      {
        expr: <Row size="big" align="center">{'x⁴ − x² − 6 = 0'}</Row>,
        ok: L("Ha. t uch yoki minus ikki, minus ikki rad etiladi.", 'Да. t равно трём или минус двум, минус два отвергается.', 'Yes. t is three or negative two, and negative two is rejected.'),
        question: ASK_ROOTS,
        items: [
          { id: 'a', right: true, label: 'x = ±√3' },
          { id: 'b', label: 'x = ±√3,  x = ±√2', hint: L("t minus ikki manfiy, undan iks topilmaydi.", 'T минус два отрицательно, из него икс не находится.', 't negative two is negative; x cannot be found from it.') },
        ],
        solution: [
          't² − t − 6 = 0',
          't = 3,  t = −2',
          L('t = −2 manfiy, rad etildi', 't = −2 отрицательно, отвергнут', 't = −2 is negative, rejected'),
          'x = ±√3',
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): topilgan ildizni
// podstavka bilan tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ildizni tekshirish",
    'Проверка корня',
    'Checking the root',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Sonni bikvadrat tenglamaga qo'yib tekshiring.",
      'Три задания. Подставь число в биквадратное уравнение и проверь.',
      'Three tasks. Substitute the number into the biquadratic equation and check.'),
    A('why',
      "To'rtinchi darajani hisoblashni unutmang.",
      'Не забывай считать четвёртую степень.',
      'Do not forget to compute the fourth power.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar to'rtinchi va ikkinchi daraja hisoblanib tekshirildi.",
      'Все три разобраны. Каждый раз считались четвёртая и вторая степень.',
      'All three are done. Each time the fourth and second powers were computed.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x⁴ − 5x² + 4 = 0,   x = 2'}</Row>,
        ok: L("Ha. O'n olti minus yigirma plyus to'rt nolga teng.", 'Да. Шестнадцать минус двадцать плюс четыре равно нулю.', 'Yes. Sixteen minus twenty plus four equals zero.'),
        question: L('x = 2 shu tenglamaning ildizimi?', 'Является ли x = 2 корнем этого уравнения?', 'Is x = 2 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikkini qo'yib hisoblang, ikkining to'rtinchi darajasi, kvadrati.", 'Подставь два и посчитай его четвёртую степень и квадрат.', 'Substitute two and compute its fourth power and square.') },
        ],
        solution: ['16 − 20 + 4', '= 0'],
      },
      {
        expr: <Row size="big" align="center">{'x⁴ − 5x² + 4 = 0,   x = 3'}</Row>,
        ok: L("Yo'q. Sakson bir minus qirq besh plyus to'rt qirqga teng, nolga emas.", 'Нет. Восемьдесят один минус сорок пять плюс четыре равно сорока, а не нулю.', 'No. Eighty one minus forty five plus four equals forty, not zero.'),
        question: L('x = 3 shu tenglamaning ildizimi?', 'Является ли x = 3 корнем этого уравнения?', 'Is x = 3 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Uchni qo'yib hisoblang, sakson bir minus qirq besh plyus to'rt.", 'Подставь три и посчитай, восемьдесят один минус сорок пять плюс четыре.', 'Substitute three and compute, eighty one minus forty five plus four.') },
        ],
        solution: ['81 − 45 + 4', '= 40'],
      },
      {
        expr: <Row size="big" align="center">{'x⁴ + 3x² − 4 = 0,   x = −1'}</Row>,
        ok: L("Ha. Bir plyus uch minus to'rt nolga teng.", 'Да. Один плюс три минус четыре равно нулю.', 'Yes. One plus three minus four equals zero.'),
        question: L('x = −1 shu tenglamaning ildizimi?', 'Является ли x = −1 корнем этого уравнения?', 'Is x = −1 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Minus birni qo'yib hisoblang, to'rtinchi daraja musbat chiqadi.", 'Подставь минус один, четвёртая степень выйдет положительной.', 'Substitute negative one; the fourth power comes out positive.') },
        ],
        solution: ['1 + 3 − 4', '= 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): manfiy t dan ham iks
// «topilgan» (З48, darsning markaziy xatosi).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Manfiy t dan iks topilmaydi",
    'Из отрицательного t икс не находится',
    'x cannot be found from a negative t',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham manfiy t dan iks noto'g'ri topilgan.",
      'Два задания. В обоих из отрицательного t икс найден неверно.',
      'Two tasks. In both, x was wrongly derived from a negative t.'),
    A('why',
      "t manfiy bo'lsa, iks kvadrat manfiy bo'lishi kerak bo'lardi, bu mumkin emas.",
      'Если t отрицательно, икс квадрат должен был быть отрицательным, а это невозможно.',
      'If t is negative, x squared would have to be negative, which is impossible.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Manfiy t har safar rad etildi.",
      'Оба разобраны. Отрицательное t каждый раз отвергалось.',
      'Both are done. The negative t was rejected each time.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'9x⁴ + 5x² − 4 = 0'}</Row>,
        ok: L("Yo'q. t minus bir manfiy, undan haqiqiy iks topilmaydi.", 'Нет. t минус один отрицательно, из него не находится действительный икс.', 'No. t negative one is negative; no real x can be found from it.'),
        question: L("To'g'ri javob qaysi?", 'Какой ответ верен?', 'Which answer is correct?'),
        items: [
          { id: 'a', right: true, label: L('Faqat x = ±2/3', 'Только x = ±2/3', 'Only x = ±2/3') },
          { id: 'b', label: L('x = ±2/3 yoki x = ±1', 'x = ±2/3 или x = ±1', 'x = ±2/3 or x = ±1'), hint: L("Bu ko'rsatilgan xato javobning o'zi, manfiy t dan iks olinmaydi.", 'Это и есть показанный ошибочный ответ, из отрицательного t икс не берётся.', 'This is the very mistaken answer shown, x cannot come from a negative t.') },
          { id: 'c', label: L('Faqat x = ±1', 'Только x = ±1', 'Only x = ±1'), hint: L("Aksincha, aynan bu t manfiy bo'lgani uchun rad etiladi.", 'Наоборот, именно это t отвергается, будучи отрицательным.', 'The other way around, this t is the one rejected, being negative.') },
        ],
        solution: [
          L('t = −1 manfiy, rad etildi', 't = −1 отрицательно, отвергнут', 't = −1 is negative, rejected'),
          L('javob: x = ±2/3', 'ответ: x = ±2/3', 'answer: x = ±2/3'),
        ],
      },
      {
        expr: <Row size="big" align="center">{'x⁴ + 3x² − 4 = 0'}</Row>,
        ok: L("Yo'q. t minus to'rt manfiy, undan haqiqiy iks topilmaydi.", 'Нет. t минус четыре отрицательно, из него не находится действительный икс.', 'No. t negative four is negative; no real x can be found from it.'),
        question: L("To'g'ri javob qaysi?", 'Какой ответ верен?', 'Which answer is correct?'),
        items: [
          { id: 'a', right: true, label: L('Faqat x = ±1', 'Только x = ±1', 'Only x = ±1') },
          { id: 'b', label: L('x = ±1 yoki x = ±2', 'x = ±1 или x = ±2', 'x = ±1 or x = ±2'), hint: L("Bu ko'rsatilgan xato javobning o'zi, manfiy t dan iks olinmaydi.", 'Это и есть показанный ошибочный ответ, из отрицательного t икс не берётся.', 'This is the very mistaken answer shown, x cannot come from a negative t.') },
          { id: 'c', label: L('Faqat x = ±2', 'Только x = ±2', 'Only x = ±2'), hint: L("Aksincha, aynan bu t manfiy bo'lgani uchun rad etiladi.", 'Наоборот, именно это t отвергается, будучи отрицательным.', 'The other way around, this t is the one rejected, being negative.') },
        ],
        solution: [
          L('t = −4 manfiy, rad etildi', 't = −4 отрицательно, отвергнут', 't = −4 is negative, rejected'),
          L('javob: x = ±1', 'ответ: x = ±1', 'answer: x = ±1'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill`): bikvadrat
// tenglamalar to'liq yechiladi.
// ============================================================
const S13 = {
  eyebrow: L('TO\'LIQ YECHISH', 'ПОЛНОЕ РЕШЕНИЕ', 'THE FULL SOLUTION'),
  title: L(
    "Bikvadrat tenglamani boshidan oxirigacha yeching",
    'Реши биквадратное уравнение от начала до конца',
    'Solve the biquadratic equation from start to finish',
  ),
  audio: [
    A('mount',
      "X kvadrat t deb belgilang, kvadrat tenglamani yeching, keyin t dan iksni toping.",
      'Обозначь икс квадрат через t, реши квадратное уравнение, потом найди икс из t.',
      'Denote x squared by t, solve the quadratic equation, then find x from t.'),
    A('why',
      "Manfiy t bo'lsa, uni rad etib, faqat musbatidan davom eting.",
      'Если t отрицательно, отбрось его и продолжай только с положительным.',
      'If t is negative, discard it and continue only with the positive one.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar t dan iks to'g'ri topildi.",
      'Все три заполнены. Каждый раз икс верно находился из t.',
      'All three are filled. Each time x was correctly found from t.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['8', '2'],
      lines: [
        [{ t: 'x⁴ − 6x² + 8 = 0   →   t² − 6t + ' }, { slot: '8' }, { t: ' = 0' }],
        [{ t: 't = 4,  2   →   x = ±2,  x = ±√' }, { slot: '2' }],
      ],
    },
    tasks: [
      {
        chips: ['15', '5', '3'],
        lines: [
          [{ t: 'x⁴ − 8x² + 15 = 0   →   t² − 8t + ' }, { slot: '15' }, { t: ' = 0' }],
          [{ t: 't = 5,  3   →   x = ±√' }, { slot: '5' }, { t: ',  x = ±√' }, { slot: '3' }],
        ],
      },
      {
        chips: ['12', '2'],
        lines: [
          [{ t: 'x⁴ − x² − 12 = 0   →   t² − t − ' }, { slot: '12' }, { t: ' = 0' }],
          [{ t: 't = 4,  (−3)   →   x = ±' }, { slot: '2' }],
        ],
      },
      {
        chips: ['12', '2', '3'],
        lines: [
          [{ t: 'x⁴ − 7x² + 12 = 0   →   t² − 7t + ' }, { slot: '12' }, { t: ' = 0' }],
          [{ t: 't = 4,  3   →   x = ±' }, { slot: '2' }, { t: ',  x = ±√' }, { slot: '3' }],
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
    "To'rt savol",
    'Четыре вопроса',
    'Four questions',
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
        id: 'q1', tag: 'З38',
        ask: L('0x⁴ + 5x² − 1 = 0 bikvadrat tenglamami?', 'Является ли 0x⁴ + 5x² − 1 = 0 биквадратным?', 'Is 0x⁴ + 5x² − 1 = 0 biquadratic?'),
        options: [
          { id: 'no', right: true, label: L("Yo'q, kvadrat tenglama", 'Нет, квадратное', 'No, it is quadratic') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
          { id: 'linear', label: L("Yo'q, chiziqli", 'Нет, линейное', 'No, it is linear') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Bosh koeffitsiyent nolga teng, to'rtinchi daraja yo'qoladi.", 'Старший коэффициент равен нулю, четвёртая степень исчезает.', 'The leading coefficient is zero, the fourth power vanishes.'),
        ok: L("To'g'ri, qolgani kvadrat tenglama.", 'Верно, остаётся квадратное уравнение.', 'Correct, what remains is a quadratic equation.'),
      },
      {
        id: 'q2', tag: 'З46',
        ask: L('3x² − 2x − 1 = 0 uchun ko\'paytuvchilarga ajratish qaysi?', 'Какое разложение верно для 3x² − 2x − 1 = 0?', 'Which factoring is correct for 3x² − 2x − 1 = 0?'),
        options: [
          { id: 'ok', right: true, label: '(3x + 1)(x − 1)' },
          { id: 'wrong', label: '(3x − 1)(x + 1)' },
          { id: 'c', label: '(x + 1)(x − 1)' },
          { id: 'd', label: '3(x − 1)(x − 1)' },
        ],
        hint: L("Ildizlar minus uchdan bir va bir, ularni qo'ying va tekshiring.", 'Корни минус одна треть и один, подставь и проверь.', 'The roots are negative one third and one; substitute and check.'),
        ok: L("To'g'ri, ochib ko'rsak asl ifoda chiqadi.", 'Верно, раскрыв скобки, получаем исходное выражение.', 'Correct, expanding gives back the original expression.'),
      },
      {
        id: 'q3', tag: 'З40',
        ask: L('t = 9 bo\'lsa, x qanday?', 'Если t = 9, каков x?', 'If t = 9, what is x?'),
        options: [
          { id: 'ok', right: true, label: 'x = ±3' },
          { id: 'onlyPos', label: 'x = 3' },
          { id: 'wrong', label: 'x = 9' },
          { id: 'wrong2', label: 'x = 81' },
        ],
        hint: L("Iks kvadrat to'qqiz, kvadratga oshirilganda ishora yo'qoladi.", 'Икс квадрат равен девяти, при возведении в квадрат знак исчезает.', 'x squared equals nine, and squaring erases the sign.'),
        ok: L("To'g'ri, ikki javob bor.", 'Верно, есть два ответа.', 'Correct, there are two answers.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('x = 1 son x⁴ + 3x² − 4 = 0 tenglamaning ildizimi?', 'Является ли x = 1 корнем уравнения x⁴ + 3x² − 4 = 0?', 'Is x = 1 a root of x⁴ + 3x² − 4 = 0?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
          { id: 'onlyNeg', label: L('Faqat x = −1', 'Только x = −1', 'Only x = −1') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Birni qo'yib hisoblang, bir plyus uch minus to'rt.", 'Подставь один и посчитай, один плюс три минус четыре.', 'Substitute one and compute, one plus three minus four.'),
        ok: L("To'g'ri, natija nolga teng.", 'Верно, результат равен нулю.', 'Correct, the result equals zero.'),
      },
      {
        id: 'q5', tag: 'З48',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "X to'rtinchi daraja minus 5x kvadrat plyus 4 teng nolni yechib, musbat t dan chiqqan ildizlarni yig'ing.",
            'Реши икс в четвёртой степени минус пять икс квадрат плюс четыре равно нулю и собери корни из положительного t.',
            'Solve x to the fourth minus five x squared plus four equals zero and assemble the roots from the positive t.',
          ),
          lines: [
            [{ t: 'x⁴ − 5x² + 4 = 0   →   t = 4,  1   →   x = ±' }, { slot: '2' }, { t: ',  x = ±' }, { slot: '1' }],
          ],
          tiles: [
            { id: 't1', v: '2', x: 12, y: 12 },
            { id: 't2', v: '1', x: 70, y: 14 },
            { id: 't3', v: '4', x: 40, y: 50 },
            { id: 't4', v: '5', x: 78, y: 48 },
          ],
          hint: L(
            "To'rtdan ildiz ikki, birdan ildiz bir.",
            'Корень из четырёх два, корень из единицы один.',
            'The root of four is two, the root of one is one.',
          ),
          doneNote: L(
            "Yig'ildi. To'rt ildiz: ikki, minus ikki, bir, minus bir.",
            'Собрано. Четыре корня: два, минус два, один, минус один.',
            'Assembled. Four roots: two, negative two, one, negative one.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (1-darsning `takeaway`). Yangi matematika yo'q. BLOK
// Б3 SHU YERDA YOPILADI.
// ============================================================
const S15 = {
  eyebrow: UI.summaryEyebrow,
  title: L(
    "T manfiy chiqsa, ildizlar soni kamayadi",
    'Если t выходит отрицательным, число корней уменьшается',
    'If t comes out negative, the number of roots decreases',
  ),
  audio: [
    A('s0',
      "Darsdan bitta rasm qoladi. To'qqiz iks to'rtinchi daraja plyus besh iks kvadrat minus to'rt teng noldan faqat ikkita ildiz chiqdi, to'rtta emas.",
      'С урока остаётся одна картинка. Из девять икс в четвёртой степени плюс пять икс квадрат минус четыре равно нулю вышло только два корня, а не четыре.',
      'One picture stays with you. From nine x to the fourth plus five x squared minus four equals zero, only two roots came out, not four.'),
    A('s1',
      "Bugun ikki narsa qilindi. Bosh koeffitsiyenti birdan farqli tenglamani ko'paytuvchilarga ajratdingiz va bikvadrat tenglamani x kvadrat t deb belgilab yechdingiz.",
      'Сегодня сделано две вещи. Ты разложил на множители уравнение со старшим коэффициентом, отличным от единицы, и решил биквадратное уравнение, обозначив икс квадрат через t.',
      'Two things are done today. You factored an equation whose leading coefficient is not one, and solved a biquadratic equation by denoting x squared as t.',
    ),
    A('s2',
      "Bu bilan kvadrat tenglamalar bloki yakunlanadi. Keyingi blokda tengsizliklar va modul o'rganiladi.",
      'Этим блок квадратных уравнений завершается. В следующем блоке изучаются неравенства и модуль.',
      'This closes the block on quadratic equations. The next block studies inequalities and the absolute value.',
    ),
  ],
  props: {
    mark: '9x⁴ + 5x² − 4 = 0',
    markNote: L(
      "t = 4/9 yoki t = −1, faqat 4/9 qoladi, x = ±2/3",
      't = 4/9 или t = −1, остаётся только 4/9, x = ±2/3',
      't = 4/9 or t = −1, only 4/9 remains, x = ±2/3',
    ),
    lines: [
      L(
        "ax² + bx + c = a(x − x1)(x − x2)",
        'ax² + bx + c = a(x − x1)(x − x2)',
        'ax² + bx + c = a(x − x1)(x − x2)',
      ),
      L(
        "ax⁴ + bx² + c = 0, x² = t bilan kvadrat tenglamaga keladi",
        'ax⁴ + bx² + c = 0, заменой x² = t приводится к квадратному',
        'ax⁴ + bx² + c = 0 reduces to quadratic by x² = t',
      ),
      L(
        "manfiy t dan haqiqiy x topilmaydi",
        'из отрицательного t действительный x не находится',
        'no real x is found from a negative t',
      ),
    ],
    bridge: L(
      "Keyingi blok: tengsizliklar va modul",
      'Следующий блок: неравенства и модуль',
      'Next block: inequalities and the absolute value',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — TANLASH USULI.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З48', 'З38', 'З46',
    'З46', 'З46', 'З46', 'З40', 'З48',
    'З16', 'З48', 'З48', null, null,
  ],
  mechanic: { at: 5, tool: 'factorpair', kind: 'select' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
