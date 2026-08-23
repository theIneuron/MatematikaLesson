// ============================================================================
// 8-sinf, Dars 33. SONNING STANDART KO'RINISHI.
//
// Bu fayl, FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `standardform.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya, 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `standardform` (`StandardForm`): ученик
// vergulni suradi, ko'rsatkich o'zi o'zgaradi, son o'zi o'zgarmaydi.
//
// DIQQAT, darslikda standart ko'rinish uchun ALOHIDA PARAGRAF YO'Q (na
// o'zbek, na rus nashrida): bu — matematikaning umumiy konvensiyasi, va dars
// uni shu sifatida beradi, darslikka havola qilmasdan.
//
// DARSNING ISHI:
//   1) katta son uchun vergul CHAPGA suriladi, ko'rsatkich MUSBAT chiqadi;
//   2) kichik son uchun vergul O'NGGA suriladi, ko'rsatkich MANFIY chiqadi;
//   3) birinchi ko'paytiruvchi (mantissa) doim bir bilan o'n orasida bo'ladi;
//   4) nolni standart shaklda yozib bo'lmaydi.
//
// ADASHISHLAR, yangi ikkitasi:
//   З66, mantissa bir bilan o'n orasida qolmadi (o'ndan katta yoki teng);
//   З67, kichik son uchun ko'rsatkich ishorasi unutildi (manfiy o'rniga musbat);
//   З16, javob son bilan tekshirilmadi (11-ekranda, har doim shart).
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
  id: 'alg-8-33',
  n: 33,
  row: 37,
  block: 'Б5',
  topic: L(
    "Sonning standart ko'rinishi",
    'Стандартный вид числа',
    'The standard form of a number',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Har qanday son a ko'paytirilgan o'nning n darajasiga tenglashtirib yoziladi, bunda a bir bilan o'n orasida",
    'Любое число записывается как a, умноженное на десять в степени n, где a от одного до десяти',
    'Any number is written as a times ten to the power n, where a is from one to ten',
  ),
  L(
    "Katta son uchun n musbat, kichik son uchun n manfiy",
    'Для большого числа n положительно, для маленького n отрицательно',
    'For a large number n is positive, for a small number n is negative',
  ),
  L(
    "Nolni standart shaklda yozib bo'lmaydi",
    'Нуль невозможно записать в стандартном виде',
    'Zero cannot be written in standard form',
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
  'З66': {
    what: L(
      "mantissa bir bilan o'n orasida qolmadi, o'ndan katta yoki teng qoldirilgan",
      'мантисса не осталась от одного до десяти, оставлена больше или равной десяти',
      'the mantissa did not stay between one and ten, left greater than or equal to ten',
    ),
    wrong: '36',
    at: 4,
  },
  'З67': {
    what: L(
      "kichik son uchun ko'rsatkich ishorasi unutildi, manfiy o'rniga musbat yozilgan",
      'для маленького числа знак показателя забыт, вместо отрицательного записан положительный',
      'for a small number the sign of the exponent was forgotten, positive written instead of negative',
    ),
    wrong: '4',
    at: 12,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: katta sonni qisqa yozish savoli. Yakun: qoida
// mantissa va ko'rsatkich uchun.
// ============================================================
const SC_ASK = L('QANDAY QISQA YOZAMIZ', 'КАК ЗАПИСАТЬ КОРОЧЕ', 'HOW TO WRITE IT SHORTER')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="55" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fill={T.ink}>{'36 000 000'}</text>
      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="98" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="105" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Mantissa doim bir bilan o'n orasida, ko'rsatkich ishorani belgilaydi",
      'Мантисса всегда от одного до десяти, показатель задаёт знак',
      'The mantissa is always between one and ten, the exponent sets the sign',
    )}>
      <text x="200" y="20" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fill={T.ink}>{'36 000 000        0,0007'}</text>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <text x="200" y="58" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
          fontWeight="700" fill={T.ok}>{'3,6 × 10⁷        7 × 10⁻⁴'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1800ms' }}>
        <text x="200" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fill={T.ink3}>{'1 ≤ a < 10'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('KATTA SON', 'БОЛЬШОЕ ЧИСЛО', 'A LARGE NUMBER'),
  title: L(
    "O'zbekiston aholisi taxminan o'ttiz olti million kishi. Fanda bu son qanday yoziladi",
    'Население Узбекистана примерно тридцать шесть миллионов человек. Как это число записывают в науке',
    "Uzbekistan's population is about thirty-six million people. How is this number written in science",
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "O'ttiz olti million. Nol juda ko'p.",
      'Тридцать шесть миллионов. Нулей очень много.',
      'Thirty-six million. There are very many zeros.'),
    A('why',
      "Taxmin qiling, olimlar bunday sonni qanday qisqa yozadi.",
      'Предположи, как учёные записывают такое число короче.',
      'Predict how scientists write such a number shorter.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, qaysi yozuv fanda ishlatiladi?",
      'Как думаешь, какая запись используется в науке?',
      'What do you think, which record is used in science?',
    ),
    items: [
      { id: 'a', show: '36 000 000' },
      { id: 'b', show: '3,6 × 10⁷' },
      { id: 'c', show: '360 × 10⁵' },
      { id: 'd', show: '36 × 10⁶' },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. O'nga, yuzga, mingga ko'paytirish, vergul necha joy
// suriladi (5-6-sinfdan). Shu tayanch 3, 5 va 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "O'nning darajasiga ko'paytirishni eslash",
    'Вспоминаем умножение на степень десяти',
    'Recalling multiplication by a power of ten',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida vergul to'g'ri suriladi.",
      'Четыре записи. Только в одной запятая сдвинута верно.',
      'Four records. Only in one is the point moved correctly.'),
    A('why',
      "O'nning darajasi vergulni necha joy surishni aytadi.",
      'Степень десяти говорит, на сколько мест сдвигается запятая.',
      'The power of ten tells how many places the point moves.'),
  ],
  props: {
    ask: L(
      "3,6 ko'paytirilgan o'nning uchinchi darajasi qaysi yozuvda to'g'ri?",
      'В какой записи верно 3,6, умноженное на десять в третьей степени?',
      'In which record is 3.6 times ten to the third power correct?',
    ),
    items: [
      { id: 'right', show: '3 600', right: true, name: L("vergul uch joy o'ngga suriladi", 'запятая сдвигается на три места вправо', 'the point moves three places right') },
      {
        id: 'two', show: '360',
        hint: L("Bu ikki joy, ko'rsatkich uch, bir joy yetishmaydi.", 'Это два места, показатель три, одного места не хватает.', 'That is two places; the exponent is three, one place is missing.'),
      },
      {
        id: 'four', show: '36 000',
        hint: L("Bu to'rt joy, ko'rsatkich uch, bir joy ortiq.", 'Это четыре места, показатель три, одно место лишнее.', 'That is four places; the exponent is three, one place too many.'),
      },
      {
        id: 'left', show: '0,0036',
        hint: L("Vergul o'ngga suriladi, chapga emas.", 'Запятая сдвигается вправо, а не влево.', 'The point moves right, not left.'),
      },
    ],
    after: L(
      "To'g'ri. Ko'rsatkich uch, vergul uch joy o'ngga suriladi.",
      'Верно. Показатель три, запятая сдвигается на три места вправо.',
      'Correct. The exponent is three, the point moves three places right.',
    ),
  },
}

// ============================================================
// EKRAN 3. SONNI BURANG (1-darsning `steppers`). Ko'rsatkich sonning
// xonalar sonidan chiqadi; nolda ko'rsatkichni topib bo'lmaydi (yangi
// tushuncha: nol standart shaklda aniqlanmagan).
// ============================================================
const S3 = {
  eyebrow: L('SONNI BURANG', 'КРУТИ ЧИСЛО', 'TURN THE NUMBER'),
  title: L(
    "Ko'rsatkich sonning xonalar sonidan chiqadi",
    'Показатель выходит из количества разрядов числа',
    'The exponent comes from the number of digits',
  ),
  audio: [
    A('mount',
      "Son buriladi. Ko'rsatkich, standart shakl uchun kerak bo'lgan qiymat, o'zi hisoblanadi.",
      'Число крутится. Показатель, нужный для стандартного вида, считается сам.',
      'The number is turned. The exponent needed for standard form is computed on its own.'),
    A('why',
      "Ikki maqsad beriladi. Sonni turli qiymatlarga olib boring.",
      'Даны две цели. Приведи число к разным значениям.',
      'Two targets are given. Bring the number to different values.'),
    A('why',
      "Oxirida sonni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти число до нуля и посмотри, что будет.',
      'At the end bring the number down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'v', label: L('son', 'число', 'the number'),
        start: 0, min: 0, max: 9950, step: 50, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : Math.floor(Math.log(v[0]) / Math.log(10))),
    resultLabel: L("ko'rsatkich n", 'показатель n', 'exponent n'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "son hali nolga tushmasin, avval maqsadlarni oling.",
      'Число пока не опускай до нуля, сначала возьми цели.',
      'Do not bring the number down to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: 1,
        ask: L("Ko'rsatkich n bir bo'lsin", 'Пусть показатель n будет равен одному', 'Make the exponent n equal one'),
        after: L(
          "Bir. Son o'n bilan to'qson to'qqiz orasida, ikki xonali.",
          'Один. Число между десятью и девяносто девятью, двузначное.',
          'One. The number is between ten and ninety-nine, two digits.',
        ),
      },
      {
        value: 2,
        ask: L("Endi ko'rsatkich n ikki bo'lsin", 'Теперь пусть показатель n будет равен двум', 'Now make the exponent n equal two'),
        after: L(
          "Ikki. Son yuz bilan to'qqiz yuz to'qson to'qqiz orasida, uch xonali.",
          'Два. Число между сотней и девятьсот девяносто девятью, трёхзначное.',
          'Two. The number is between a hundred and nine hundred ninety-nine, three digits.',
        ),
      },
    ],
    ask: L("Ko'rsatkich n bir bo'lsin", 'Пусть показатель n будет равен одному', 'Make the exponent n equal one'),
    ask2: L("Endi sonni nolga tushiring", 'Теперь опусти число до нуля', 'Now bring the number down to zero'),
    broke: L(
      "Son nolga teng bo'lganda ko'rsatkichni topib bo'lmaydi, chunki birinchi ko'paytiruvchi hech qachon nolga teng emas. Shuning uchun nolni standart shaklda yozib bo'lmaydi.",
      'Когда число равно нулю, показатель найти невозможно, потому что первый множитель никогда не равен нулю. Поэтому нуль невозможно записать в стандартном виде.',
      'When the number equals zero the exponent cannot be found, because the first factor is never zero. That is why zero cannot be written in standard form.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI YOZUV TO'G'RI (1-darsning `pick`). Ловушка, mantissa
// o'ndan katta yoki teng qoldirilgan (З66).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI YOZUV TO\'G\'RI', 'КАКАЯ ЗАПИСЬ ВЕРНА', 'WHICH RECORD IS CORRECT'),
  title: L(
    "O'ttiz olti million qaysi yozuvda to'g'ri ifodalangan",
    'В какой записи верно выражено тридцать шесть миллионов',
    'In which record are thirty-six million correctly expressed',
  ),
  audio: [
    A('mount',
      "To'rt yozuv taklif qilinadi. Faqat bittasida ikki shart ham bajarilgan.",
      'Предложены четыре записи. Только в одной выполнены оба условия.',
      'Four records are proposed. Only in one are both conditions met.'),
    A('why',
      "Birinchi ko'paytiruvchi bir bilan o'n orasida bo'lishi va son o'zgarmasligi kerak.",
      'Первый множитель должен быть от одного до десяти, а само число не должно меняться.',
      'The first factor must be from one to ten, and the number itself must not change.'),
  ],
  props: {
    ask: L(
      "O'ttiz olti million qaysi yozuvda to'g'ri?",
      'В какой записи верно записаны тридцать шесть миллионов?',
      'In which record are thirty-six million correctly written?',
    ),
    items: [
      { id: 'right', show: '3,6 × 10⁷', right: true, name: L("mantissa bir bilan o'n orasida, son saqlangan", 'мантисса от одного до десяти, число сохранено', 'mantissa between one and ten, the number preserved') },
      {
        id: 'big', show: '36 × 10⁶',
        hint: L("O'ttiz olti bir bilan o'n orasida emas, birinchi ko'paytiruvchi kattaroq bo'lib qoldi.", 'Тридцать шесть не от одного до десяти, первый множитель остался слишком большим.', 'Thirty-six is not between one and ten, the first factor is left too large.'),
      },
      {
        id: 'small', show: '0,36 × 10⁸',
        hint: L("0,36 birdan kichik, birinchi ko'paytiruvchi bir bilan o'n orasida bo'lishi kerak.", 'Ноль целых тридцать шесть меньше единицы, первый множитель должен быть от одного до десяти.', 'Zero point thirty-six is less than one; the first factor must be from one to ten.'),
      },
      {
        id: 'wrong-n', show: '3,6 × 10⁶',
        hint: L("Mantissa to'g'ri, lekin ko'rsatkich bitta kam, son o'zgarib qoldi.", 'Мантисса верна, но показатель на один меньше, число изменилось.', 'The mantissa is correct, but the exponent is one too small, the number changed.'),
      },
    ],
    after: L(
      "To'g'ri. Uch nuqta olti bir bilan o'n orasida, va ko'rsatkich yetti sonni saqlab qoladi.",
      'Верно. Три целых шесть от одного до десяти, а показатель семь сохраняет число.',
      'Correct. Three point six is between one and ten, and the exponent seven preserves the number.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI, VERGUL SURILADI (`standardform`). Ko'rsatkich
// o'zi o'zgaradi, son o'zi o'zgarmaydi.
// ============================================================
const S5 = {
  eyebrow: L('VERGULNI SURING', 'ПЕРЕДВИНЬ ЗАПЯТУЮ', 'MOVE THE POINT'),
  title: L(
    "Vergulni suring, ko'rsatkich o'zi o'zgaradi",
    'Передвинь запятую, показатель изменится сам',
    'Move the point, the exponent will change on its own',
  ),
  audio: [
    A('mount',
      "O'ttiz olti million turibdi. Vergulni birinchi raqamdan keyin qo'yish kerak.",
      'Стоят тридцать шесть миллионов. Запятую нужно поставить после первой цифры.',
      'Thirty-six million is standing there. The point needs to go right after the first digit.'),
    A('why',
      "Vergulni chapga suring va ko'rsatkichning qanday o'zgarishini kuzating.",
      'Сдвигай запятую влево и наблюдай, как меняется показатель.',
      'Move the point left and watch how the exponent changes.'),
    W('point',
      "Vergul joyiga tushdi. Mantissa bir bilan o'n orasida, va ko'rsatkich o'zi hisoblandi.",
      'Запятая встала на место. Мантисса от одного до десяти, а показатель посчитался сам.',
      'The point settled into place. The mantissa is between one and ten, and the exponent computed itself.'),
  ],
  props: {
    digits: ['3', '6', '0', '0', '0', '0', '0', '0'],
    mode: 'big',
    start: 8,
    target: 1,
    fields: [
      {
        ask: L("Mantissa, birinchi ko'paytiruvchi, qancha?", 'Мантисса, первый множитель, чему равна?', 'What is the mantissa, the first factor?'),
        kind: 'number',
        answer: '3.6',
        accepts: ['3.6'],
        hints: {
          '36': L("Bu hali son o'zi, vergul qo'yilmagan. Uch nuqta olti kerak.", 'Это ещё само число, запятая не поставлена. Нужно три целых шесть.', 'That is still the plain number, no point placed. Three point six is needed.'),
        },
      },
      {
        ask: L("Ko'rsatkich n qancha?", 'Чему равен показатель n?', 'What is the exponent n?'),
        kind: 'number',
        answer: '7',
        accepts: ['7'],
        hints: {
          '8': L("Bu sondagi raqamlar soni, vergul bir joy suriladi, ko'rsatkich bittaga kamayadi.", 'Это количество цифр в числе, запятая сдвигается на одно место, показатель на единицу меньше.', 'That is the digit count of the number; the point moves one place, the exponent is one less.'),
          '6': L("Bir kam. Vergul yettinchi raqamdan o'tib, birinchidan keyin turadi.", 'На один меньше. Запятая проходит седьмую цифру и встаёт после первой.', 'One too few. The point passes the seventh digit and stands after the first.'),
        },
      },
    ],
    note: L(
      "Uch nuqta olti ko'paytirilgan o'nning yettinchi darajasi, va son o'zgarmadi.",
      'Три целых шесть, умноженное на десять в седьмой степени, и число не изменилось.',
      'Three point six times ten to the seventh power, and the number did not change.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): ko'rsatkichni topishning ikki
// yo'li, xonalarni sanash va o'nga ketma-ket bo'lish.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Ko'rsatkichni topishning ikki yo'li",
    'Два способа найти показатель',
    'Two ways to find the exponent',
  ),
  audio: [
    A('mount',
      "Bitta natija va ikki yo'l. Ikkalasi ham bir xil ko'rsatkichni beradi.",
      'Один результат и два пути. Оба дают один и тот же показатель.',
      'One result and two ways. Both give the same exponent.'),
    W('w2',
      "Birinchi yo'lda birinchi raqamdan keyin qolgan raqamlar sanaladi.",
      'В первом пути считаются цифры, оставшиеся после первой.',
      'In the first way, the digits left after the first one are counted.'),
    W('w4',
      "Ikkinchi yo'lda son birdan o'ngacha bo'lguncha ketma-ket o'nga bo'linadi.",
      'Во втором пути число делят на десять подряд, пока оно не станет от одного до десяти.',
      'In the second way, the number is divided by ten repeatedly until it is between one and ten.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL, RAQAMLARNI SANASH', 'СПОСОБ 1, СЧЁТ ЦИФР', 'METHOD 1, COUNTING DIGITS'),
        lead: L(
          "45 000 000 dagi birinchi raqamdan keyin qolganlarni sanaymiz",
          'Считаем цифры, оставшиеся после первой в числе 45 000 000',
          'We count the digits left after the first one in 45,000,000',
        ),
        rows: [
          { text: '4 | 5000000' },
          { text: L("etti raqam qoldi", 'осталось семь цифр', 'seven digits remain'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL, KETMA-KET BO\'LISH', 'СПОСОБ 2, ПОСЛЕДОВАТЕЛЬНОЕ ДЕЛЕНИЕ', 'METHOD 2, DIVIDING STEP BY STEP'),
        lead: L(
          "45 000 000 ni o'nga ketma-ket bo'lamiz",
          'Делим 45 000 000 на десять последовательно',
          'We divide 45,000,000 by ten step by step',
        ),
        rows: [
          { text: '4500000, 450000, ... , 4,5' },
          { text: L("yetti marta bo'lindi", 'разделено семь раз', 'divided seven times'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL KO\'RSATKICH BERDI', 'ОБА ДАЛИ ОДИН ПОКАЗАТЕЛЬ', 'BOTH GAVE THE SAME EXPONENT'),
        lead: L(
          "Sanash tezroq, bo'lish esa nega ishlashini ko'rsatadi",
          'Счёт быстрее, а деление показывает, почему это работает',
          'Counting is faster, dividing shows why it works',
        ),
        rows: [{ text: '4,5 × 10⁷', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): yozuvning uch qismi, mantissa,
// asos, ko'rsatkich.
// ============================================================
const S7 = {
  eyebrow: L('YOZUVNING UCH QISMI', 'ТРИ ЧАСТИ ЗАПИСИ', 'THREE PARTS OF THE RECORD'),
  title: L(
    "Standart yozuvning uch qismi",
    'Три части стандартной записи',
    'The three parts of the standard record',
  ),
  audio: [
    A('mount',
      "Bir yozuv, uch qism. Har biri o'z ishini qiladi.",
      'Одна запись, три части. Каждая делает своё дело.',
      'One record, three parts. Each does its own job.'),
    W('p2',
      "Mantissa sonning raqamlarini beradi va doim bir bilan o'n orasida turadi.",
      'Мантисса даёт цифры числа и всегда стоит от одного до десяти.',
      'The mantissa gives the digits of the number and always stays between one and ten.'),
    W('p4',
      "Ko'rsatkich vergul necha joy surilganini aytadi, asos esa doim o'n.",
      'Показатель говорит, на сколько мест сдвинута запятая, а основание всегда десять.',
      'The exponent tells how many places the point moved, and the base is always ten.',
    ),
  ],
  props: {
    tokens: [
      { t: '3,6', id: 'a' },
      { t: '  ×  10', id: 'base' },
      { t: '⁷', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qism, mantissa. U doim bir bilan o'n orasida.",
          'Первая часть, мантисса. Она всегда от одного до десяти.',
          'The first part, the mantissa. It is always between one and ten.',
        ),
      },
      {
        focus: 'base',
        text: L(
          "Ikkinchi qism, asos. U har doim o'n, boshqa son bo'lmaydi.",
          'Вторая часть, основание. Оно всегда десять, другого числа не бывает.',
          'The second part, the base. It is always ten, never another number.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qism, ko'rsatkich. U vergul necha joy surilganini bildiradi.",
          'Третья часть, показатель. Он говорит, на сколько мест сдвинулась запятая.',
          'The third part, the exponent. It tells how many places the point moved.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Yorug'lik tezligi soniyada uch yuz ming kilometr, standart shaklda uch ko'paytirilgan o'nning beshinchi darajasiga km/s.",
        'Скорость света триста тысяч километров в секунду, в стандартном виде три, умноженное на десять в пятой степени, км/с.',
        'The speed of light is three hundred thousand kilometres per second, in standard form three times ten to the fifth power km/s.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIKDA ALOHIDA SAHIFA YO'Q:
// qoida matematik konvensiya sifatida umumlashtirilgan.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Sonning standart ko'rinishi",
    'Стандартный вид числа',
    'The standard form of a number',
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
      { id: 'f1', label: L("har qanday son a ko'paytirilgan o'nning n darajasiga tenglashadi", 'любое число равно a, умноженному на десять в степени n', 'any number equals a times ten to the power n') },
      { id: 'f2', label: L("bunda a bir bilan o'n orasida", 'при этом a от одного до десяти', 'where a is between one and ten') },
      { id: 'f3', label: L("katta son uchun n musbat, kichik son uchun n manfiy", 'для большого числа n положительно, для маленького отрицательно', 'for a large number n is positive, for a small number negative') },
      { id: 'w1', label: L("a istalgan songa teng bo'lishi mumkin", 'a может быть равно любому числу', 'a can equal any number') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Birinchi ko'paytiruvchi ISTALGAN son emas, u doim bir bilan o'n orasida.",
      'Так не складывается. Первый множитель не ЛЮБОЕ число, он всегда от одного до десяти.',
      'That does not fit. The first factor is not ANY number, it always stays between one and ten.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darsda umumlashtirilgan, darslikda standart ko'rinish uchun alohida paragraf yo'q",
        'Правило обобщено в уроке, в учебнике для стандартного вида отдельного параграфа нет',
        'The rule is generalized in the lesson; the textbook has no dedicated section for standard form',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "O'ttiz olti millionni qanday qisqa yozishni hali bilmaymiz",
        'Мы пока не знаем, как коротко записать тридцать шесть миллионов',
        'We still do not know how to write thirty-six million shorter',
      ),
      right: L(
        "endi vergulni surib, uch nuqta olti ko'paytirilgan o'nning yettinchi darajasi ekanini bilamiz",
        'теперь, сдвинув запятую, знаем, что это три целых шесть, умноженное на десять в седьмой степени',
        'now, having moved the point, we know it is three point six times ten to the seventh power',
      ),
      winner: 'right',
      note: L(
        "Mantissa bir bilan o'n orasida, ko'rsatkich ishorani belgilaydi",
        'Мантисса от одного до десяти, показатель задаёт знак',
        'The mantissa is between one and ten, the exponent sets the sign',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): katta sonni standart shaklga
// o'tkazish.
// ============================================================
const ASK_FORM = L("Standart shakli qaysi?", 'Каков стандартный вид?', 'What is the standard form?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Katta sonni standart shaklga o'tkazing",
    'Переведи большое число в стандартный вид',
    'Convert the large number to standard form',
  ),
  audio: [
    A('mount',
      "Besh son. Har biri katta, nollar bilan tugaydi.",
      'Пять чисел. Каждое большое, заканчивается нулями.',
      'Five numbers. Each is large, ending in zeros.'),
    A('why',
      "Birinchi raqamdan keyin vergul qo'yiladi, qolgan raqamlar ko'rsatkichni beradi.",
      'После первой цифры ставится запятая, оставшиеся цифры дают показатель.',
      'The point goes after the first digit, the remaining digits give the exponent.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar birinchi raqamdan keyin vergul to'g'ri qo'yilgan.",
      'Все пять разобраны. Каждый раз запятая верно ставилась после первой цифры.',
      'All five are done. Each time the point was correctly placed after the first digit.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'4 500 000'}</Row>,
        ok: L("Ha. To'rt nuqta besh ko'paytirilgan o'nning oltinchi darajasi.", 'Да. Четыре целых пять, умноженное на десять в шестой степени.', 'Yes. Four point five times ten to the sixth power.'),
        question: ASK_FORM,
        items: [
          { id: 'a', right: true, label: '4,5 × 10⁶' },
          { id: 'b', label: '45 × 10⁵', hint: L("Qirq besh bir bilan o'n orasida emas.", 'Сорок пять не от одного до десяти.', 'Forty-five is not between one and ten.') },
        ],
        solution: ['4 500 000', '4,5 × 10⁶'],
      },
      {
        expr: <Row size="big" align="center">{'800 000'}</Row>,
        ok: L("Ha. Sakkiz ko'paytirilgan o'nning beshinchi darajasi.", 'Да. Восемь, умноженное на десять в пятой степени.', 'Yes. Eight times ten to the fifth power.'),
        question: ASK_FORM,
        items: [
          { id: 'a', right: true, label: '8 × 10⁵' },
          { id: 'b', label: '8 × 10⁴', hint: L("Bir kam. Sakkizdan keyin besh raqam qoladi.", 'На один меньше. После восьми остаётся пять цифр.', 'One too few. After the eight, five digits remain.') },
        ],
        solution: ['800 000', '8 × 10⁵'],
      },
      {
        expr: <Row size="big" align="center">{'12 300 000'}</Row>,
        ok: L("Ha. Bir nuqta ikki uch ko'paytirilgan o'nning yettinchi darajasi.", 'Да. Один целых двадцать три, умноженное на десять в седьмой степени.', 'Yes. One point two three times ten to the seventh power.'),
        question: ASK_FORM,
        items: [
          { id: 'a', right: true, label: '1,23 × 10⁷' },
          { id: 'b', label: '12,3 × 10⁶', hint: L("O'n ikki bir bilan o'n orasida emas.", 'Двенадцать не от одного до десяти.', 'Twelve is not between one and ten.') },
        ],
        solution: ['12 300 000', '1,23 × 10⁷'],
      },
      {
        expr: <Row size="big" align="center">{'95 000 000'}</Row>,
        ok: L("Ha. To'qqiz nuqta besh ko'paytirilgan o'nning yettinchi darajasi.", 'Да. Девять целых пять, умноженное на десять в седьмой степени.', 'Yes. Nine point five times ten to the seventh power.'),
        question: ASK_FORM,
        items: [
          { id: 'a', right: true, label: '9,5 × 10⁷' },
          { id: 'b', label: '95 × 10⁶', hint: L("To'qson besh bir bilan o'n orasida emas.", 'Девяносто пять не от одного до десяти.', 'Ninety-five is not between one and ten.') },
        ],
        solution: ['95 000 000', '9,5 × 10⁷'],
      },
      {
        expr: <Row size="big" align="center">{'6 000'}</Row>,
        ok: L("Ha. Olti ko'paytirilgan o'nning uchinchi darajasi.", 'Да. Шесть, умноженное на десять в третьей степени.', 'Yes. Six times ten to the third power.'),
        question: ASK_FORM,
        items: [
          { id: 'a', right: true, label: '6 × 10³' },
          { id: 'b', label: '6 × 10⁴', hint: L("Bitta ortiq. Oltidan keyin uch raqam qoladi, to'rt emas.", 'На одну больше. После шести остаётся три цифры, не четыре.', 'One too many. After the six, three digits remain, not four.') },
        ],
        solution: ['6 000', '6 × 10³'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): standart shakldan oddiy songa
// qaytish, teskari ko'nikma.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Standart shakldan oddiy songa qaytaring",
    'Верни стандартный вид к обычному числу',
    'Convert the standard form back to a plain number',
  ),
  audio: [
    A('mount',
      "Uch yozuv. Har birini oddiy son sifatida yozing.",
      'Три записи. Каждую запиши как обычное число.',
      'Three records. Write each as a plain number.'),
    A('why',
      "Ko'rsatkich vergulni necha joy o'ngga surishni aytadi.",
      'Показатель говорит, на сколько мест сдвинуть запятую вправо.',
      'The exponent tells how many places to move the point right.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ko'rsatkich vergulning yo'lini ko'rsatgan.",
      'Все три разобраны. Каждый раз показатель указывал путь запятой.',
      'All three are done. Each time the exponent showed the way for the point.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'2,7 × 10⁴'}</Row>,
        ok: L("Ha. Vergul to'rt joy o'ngga suriladi, ikki nolni to'ldiradi.", 'Да. Запятая сдвигается на четыре места вправо, добавляются два нуля.', 'Yes. The point moves four places right, filling in two zeros.'),
        question: L("Oddiy son qaysi?", 'Какое обычное число?', 'What is the plain number?'),
        items: [
          { id: 'a', right: true, label: '27 000' },
          { id: 'b', label: '2 700', hint: L("Ko'rsatkich to'rt, vergul to'rt joy suriladi, uch joy emas.", 'Показатель четыре, запятая сдвигается на четыре места, а не на три.', 'The exponent is four, the point moves four places, not three.') },
        ],
        solution: ['2,7 × 10⁴', '27 000'],
      },
      {
        expr: <Row size="big" align="center">{'5 × 10⁶'}</Row>,
        ok: L("Ha. Vergul olti joy o'ngga suriladi, oltita nol qoladi.", 'Да. Запятая сдвигается на шесть мест вправо, остаётся шесть нулей.', 'Yes. The point moves six places right, six zeros remain.'),
        question: L("Oddiy son qaysi?", 'Какое обычное число?', 'What is the plain number?'),
        items: [
          { id: 'a', right: true, label: '5 000 000' },
          { id: 'b', label: '500 000', hint: L("Bitta nol yetishmaydi, ko'rsatkich olti.", 'Одного нуля не хватает, показатель шесть.', 'One zero is missing, the exponent is six.') },
        ],
        solution: ['5 × 10⁶', '5 000 000'],
      },
      {
        expr: <Row size="big" align="center">{'9,1 × 10³'}</Row>,
        ok: L("Ha. Vergul uch joy o'ngga suriladi, bir nol qoladi.", 'Да. Запятая сдвигается на три места вправо, остаётся один нуль.', 'Yes. The point moves three places right, one zero remains.'),
        question: L("Oddiy son qaysi?", 'Какое обычное число?', 'What is the plain number?'),
        items: [
          { id: 'a', right: true, label: '9 100' },
          { id: 'b', label: '910', hint: L("Ko'rsatkich uch, vergul uch joy suriladi, ikki joy emas.", 'Показатель три, запятая сдвигается на три места, а не на два.', 'The exponent is three, the point moves three places, not two.') },
        ],
        solution: ['9,1 × 10³', '9 100'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): kichik sonni standart
// shaklga o'tkazish, javobni son bilan tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Kichik sonni standart shaklga o'tkazing",
    'Переведи маленькое число в стандартный вид',
    'Convert the small number to standard form',
  ),
  audio: [
    A('mount',
      "Uch kichik son. Har birida vergulgacha nollar bor.",
      'Три маленьких числа. В каждом до первой значащей цифры есть нули.',
      'Three small numbers. Each has zeros before the first meaningful digit.'),
    A('why',
      "Vergul o'ngga suriladi, ko'rsatkich manfiy chiqadi.",
      'Запятая сдвигается вправо, показатель выходит отрицательным.',
      'The point moves right, the exponent comes out negative.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ko'rsatkich hisoblab tekshirilgan.",
      'Все три разобраны. Каждый раз показатель проверялся вычислением.',
      'All three are done. Each time the exponent was checked by computation.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'0,0007'}</Row>,
        ok: L("Ha. Vergul to'rt joy o'ngga surilib, yetti ko'paytirilgan o'nning minus to'rtinchi darajasi chiqadi.", 'Да. Запятая сдвигается на четыре места вправо, получается семь, умноженное на десять в минус четвёртой степени.', 'Yes. The point moves four places right, giving seven times ten to the negative fourth power.'),
        question: ASK_FORM,
        items: [
          { id: 'a', right: true, label: '7 × 10⁻⁴' },
          { id: 'b', label: '7 × 10⁴', hint: L("Son birdan kichik, ko'rsatkich manfiy bo'lishi kerak.", 'Число меньше единицы, показатель должен быть отрицательным.', 'The number is less than one, the exponent must be negative.') },
        ],
        solution: ['0,0007', '7 × 10⁻⁴'],
      },
      {
        expr: <Row size="big" align="center">{'0,00036'}</Row>,
        ok: L("Ha. Uch nuqta olti ko'paytirilgan o'nning minus to'rtinchi darajasi.", 'Да. Три целых шесть, умноженное на десять в минус четвёртой степени.', 'Yes. Three point six times ten to the negative fourth power.'),
        question: ASK_FORM,
        items: [
          { id: 'a', right: true, label: '3,6 × 10⁻⁴' },
          { id: 'b', label: '3,6 × 10⁻⁵', hint: L("Bitta ortiq. Vergulgacha to'rt raqam bor, besh emas.", 'На одну больше. До запятой четыре цифры, а не пять.', 'One too many. There are four digits before the point, not five.') },
        ],
        solution: ['0,00036', '3,6 × 10⁻⁴'],
      },
      {
        expr: <Row size="big" align="center">{'0,000009'}</Row>,
        ok: L("Ha. To'qqiz ko'paytirilgan o'nning minus oltinchi darajasi.", 'Да. Девять, умноженное на десять в минус шестой степени.', 'Yes. Nine times ten to the negative sixth power.'),
        question: ASK_FORM,
        items: [
          { id: 'a', right: true, label: '9 × 10⁻⁶' },
          { id: 'b', label: '9 × 10⁶', hint: L("Ishora unutilgan, son birdan kichik, ko'rsatkich manfiy bo'lishi kerak.", 'Знак забыт, число меньше единицы, показатель должен быть отрицательным.', 'The sign was forgotten, the number is less than one, the exponent must be negative.') },
        ],
        solution: ['0,000009', '9 × 10⁻⁶'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): mantissa o'ndan katta
// qoldirilgan (З66) va kichik son uchun ishora unutilgan (З67).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato yozuvda nima noto'g'ri",
    'Что неверно в двух ошибочных записях',
    'What is wrong in two mistaken records',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham standart shaklning bir sharti buzilgan.",
      'Два задания. В обоих нарушено одно из условий стандартного вида.',
      'Two tasks. In both, one condition of standard form is broken.'),
    A('why',
      "Mantissa bir bilan o'n orasida bo'lishi va ishora sonning kattaligiga mos kelishi kerak.",
      'Мантисса должна быть от одного до десяти, а знак должен соответствовать величине числа.',
      'The mantissa must be between one and ten, and the sign must match the size of the number.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham shartlardan biriga zid edi.",
      'Оба разобраны. Обе ошибки противоречили одному из условий.',
      'Both are done. Both mistakes contradicted one of the conditions.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'45 000 000   →   45 × 10⁶'}</Row>,
        ok: L("Ha. Qirq besh bir bilan o'n orasida emas, mantissa to'g'ri normallashtirilmagan.", 'Да. Сорок пять не от одного до десяти, мантисса не нормализована верно.', 'Yes. Forty-five is not between one and ten, the mantissa was not normalized correctly.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Mantissa bir bilan o'n orasida qolmadi", 'Мантисса не осталась от одного до десяти', 'The mantissa did not stay between one and ten') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, qirq besh o'ndan katta.", 'Это и есть показанная ошибка, сорок пять больше десяти.', 'This is the very mistake shown; forty-five is greater than ten.') },
        ],
        solution: ['45 000 000', '4,5 × 10⁷'],
      },
      {
        expr: <Row size="big" align="center">{'0,00052   →   5,2 × 10⁴'}</Row>,
        ok: L("Ha. Son birdan ancha kichik, ko'rsatkich manfiy bo'lishi kerak edi, musbat emas.", 'Да. Число намного меньше единицы, показатель должен был быть отрицательным, а не положительным.', 'Yes. The number is much less than one, the exponent should have been negative, not positive.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ko'rsatkich ishorasi unutilgan", 'Забыт знак показателя', 'The sign of the exponent was forgotten') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, son birdan kichik bo'lganda ko'rsatkich manfiy bo'lishi kerak.", 'Это и есть показанная ошибка, когда число меньше единицы, показатель должен быть отрицательным.', 'This is the very mistake shown; when the number is less than one, the exponent must be negative.') },
        ],
        solution: ['0,00052', '5,2 × 10⁻⁴'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): mantissa va ko'rsatkichni
// qadamlab topish.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Sonni standart shaklga qadamlab o'tkazing",
    'Переведи число в стандартный вид по шагам',
    'Convert the number to standard form step by step',
  ),
  audio: [
    A('mount',
      "Son berilgan. Avval mantissani, keyin ko'rsatkichni yozing.",
      'Дано число. Сначала запиши мантиссу, потом показатель.',
      'A number is given. First write the mantissa, then the exponent.'),
    A('why',
      "Mantissa birinchi raqamdan boshlanadi, ko'rsatkich qolgan raqamlar sonidan chiqadi.",
      'Мантисса начинается с первой цифры, показатель выходит из числа оставшихся цифр.',
      'The mantissa starts from the first digit, the exponent comes from the count of the remaining digits.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar mantissa va ko'rsatkich to'g'ri topilgan.",
      'Все три заполнены. Каждый раз мантисса и показатель находились верно.',
      'All three are filled. Each time the mantissa and exponent were found correctly.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['7,2', '5'],
      lines: [
        [{ t: '720 000 = ' }, { slot: '7,2' }, { t: ' × 10' }, { slot: '5' }],
      ],
    },
    tasks: [
      {
        chips: ['4,5', '4'],
        lines: [
          [{ t: '45 000 = ' }, { slot: '4,5' }, { t: ' × 10' }, { slot: '4' }],
        ],
      },
      {
        chips: ['8', '-4'],
        lines: [
          [{ t: '0,0008 = ' }, { slot: '8' }, { t: ' × 10' }, { slot: '-4' }],
        ],
      },
      {
        chips: ['3,1', '6'],
        lines: [
          [{ t: '3 100 000 = ' }, { slot: '3,1' }, { t: ' × 10' }, { slot: '6' }],
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
    "Standart shakl bo'yicha to'rt savol",
    'Четыре вопроса о стандартном виде',
    'Four questions about standard form',
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
        id: 'q1', tag: 'З66',
        ask: L('270 000 ning ko\'rsatkichi qaysi?', 'Каков показатель у 270 000?', 'What is the exponent for 270,000?'),
        options: [
          { id: 'ok', right: true, label: '5' },
          { id: 'four', label: '4' },
          { id: 'six', label: '6' },
        ],
        hint: L("Ikki nuqta yetti ko'paytirilgan o'nning beshinchi darajasi, oltmirinchi emas.", 'Два целых семь, умноженное на десять в пятой степени, не в шестой.', 'Two point seven times ten to the fifth power, not the sixth.'),
        ok: L("To'g'ri, beshinchi daraja sonni saqlaydi.", 'Верно, пятая степень сохраняет число.', 'Correct, the fifth power preserves the number.'),
      },
      {
        id: 'q2', tag: 'З66',
        ask: L('3,2 × 10⁶ va 32 × 10⁵ dan qaysi biri standart shaklga to\'g\'ri keladi?', 'Какая из записей, 3,2 × 10⁶ или 32 × 10⁵, соответствует стандартному виду?', 'Which of 3.2 × 10⁶ or 32 × 10⁵ matches standard form?'),
        options: [
          { id: 'ok', right: true, label: '3,2 × 10⁶' },
          { id: 'no', label: '32 × 10⁵' },
        ],
        hint: L("O'ttiz ikki bir bilan o'n orasida emas.", 'Тридцать два не от одного до десяти.', 'Thirty-two is not between one and ten.'),
        ok: L("To'g'ri, uch nuqta ikki bir bilan o'n orasida.", 'Верно, три целых два от одного до десяти.', 'Correct, three point two is between one and ten.'),
      },
      {
        id: 'q3', tag: 'З67',
        ask: L('0,00041 ning ko\'rsatkichi manfiy yoki musbat?', 'Показатель у 0,00041 отрицательный или положительный?', 'Is the exponent for 0.00041 negative or positive?'),
        options: [
          { id: 'ok', right: true, label: L('Manfiy', 'Отрицательный', 'Negative') },
          { id: 'no', label: L('Musbat', 'Положительный', 'Positive') },
        ],
        hint: L("Son birdan kichik, shuning uchun ko'rsatkich manfiy.", 'Число меньше единицы, поэтому показатель отрицательный.', 'The number is less than one, so the exponent is negative.'),
        ok: L("To'g'ri, kichik son uchun ko'rsatkich doim manfiy.", 'Верно, для маленького числа показатель всегда отрицательный.', 'Correct, for a small number the exponent is always negative.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('6 000 = 6 × 10³ to\'g\'rimi?', 'Верно ли 6 000 = 6 × 10³?', 'Is 6,000 = 6 × 10³ correct?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Oltidan keyin uch nol, ko'rsatkich uch, hisoblash mos keladi.", 'После шести три нуля, показатель три, вычисление совпадает.', 'After the six, three zeros, exponent three, the computation matches.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З67',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "9 300 000 ning mantissasi va ko'rsatkichini yig'ing.",
            'Собери мантиссу и показатель числа 9 300 000.',
            'Assemble the mantissa and exponent of 9,300,000.',
          ),
          lines: [
            [{ t: '9 300 000 = ' }, { slot: '9,3' }, { t: ' × 10' }, { slot: '6' }],
          ],
          tiles: [
            { id: 't1', v: '9,3', x: 12, y: 12 },
            { id: 't2', v: '6', x: 70, y: 14 },
            { id: 't3', v: '93', x: 40, y: 50 },
            { id: 't4', v: '7', x: 78, y: 48 },
          ],
          hint: L(
            "To'qqiz nuqta uch bir bilan o'n orasida, undan keyin olti raqam qoladi.",
            'Девять целых три от одного до десяти, после неё остаётся шесть цифр.',
            'Nine point three is between one and ten, after it six digits remain.',
          ),
          doneNote: L(
            "Yig'ildi. Mantissa bir bilan o'n orasida, ko'rsatkich sonni saqladi.",
            'Собрано. Мантисса от одного до десяти, показатель сохранил число.',
            'Assembled. The mantissa is between one and ten, the exponent preserved the number.',
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
    "Mantissa bir bilan o'n orasida, ko'rsatkich ishorani belgilaydi",
    'Мантисса от одного до десяти, показатель задаёт знак',
    'The mantissa is between one and ten, the exponent sets the sign',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. Katta va kichik son bir qatorda turadi.",
      'С урока остаётся одна запись. Большое и маленькое число стоят в одном ряду.',
      'One record stays with you. The large and small number stand in one row.'),
    A('s1',
      "Bugun uch narsa qilindi. Vergulni surdingiz, mantissani bir bilan o'n orasida qoldirishni ko'rdingiz va nolni standart shaklda yozib bo'lmasligini bildingiz.",
      'Сегодня сделано три вещи. Ты сдвигал запятую, увидел, что мантисса остаётся от одного до десяти, и узнал, что нуль невозможно записать в стандартном виде.',
      'Three things are done today. You moved the point, saw the mantissa stay between one and ten, and learned that zero cannot be written in standard form.'),
    A('s2',
      "Keyingi darsda ma'lumotlarni yig'ish va ifodalash. Katta sonlar jadval va diagrammada ham qisqa yoziladi.",
      'В следующем уроке сбор и представление данных. Большие числа коротко записываются и в таблице, и на диаграмме.',
      'The next lesson covers collecting and representing data. Large numbers are written shortly in tables and charts too.',
    ),
  ],
  props: {
    mark: '3,6 × 10⁷        7 × 10⁻⁴',
    markNote: L(
      "36 000 000, 0,0007",
      '36 000 000, 0,0007',
      '36,000,000, 0.0007',
    ),
    lines: [
      L(
        "Har qanday son a ko'paytirilgan o'nning n darajasiga tenglashadi, a bir bilan o'n orasida",
        'Любое число равно a, умноженному на десять в степени n, где a от одного до десяти',
        'Any number equals a times ten to the power n, where a is between one and ten',
      ),
      L(
        "Katta son uchun n musbat, kichik son uchun n manfiy",
        'Для большого числа n положительно, для маленького отрицательно',
        'For a large number n is positive, for a small number negative',
      ),
      L(
        "Nolni standart shaklda yozib bo'lmaydi",
        'Нуль невозможно записать в стандартном виде',
        'Zero cannot be written in standard form',
      ),
    ],
    bridge: L(
      "Keyingi dars: ma'lumotlarni yig'ish va ifodalash",
      'Следующий урок: сбор и представление данных',
      'Next lesson: collecting and representing data',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya, 1-darsning asboblari,
// bitta pozitsiya (5-ekran), VERGUL SURILADI (`standardform`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З66', 'З66', 'З66',
    'З67', 'З67', 'З66', 'З66', 'З67',
    'З16', 'З66', 'З67', null, null,
  ],
  mechanic: { at: 5, tool: 'standardform' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
