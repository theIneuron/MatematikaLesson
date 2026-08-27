// ============================================================================
// 8-sinf, Dars 32. BUTUN KO'RSATKICHLI DARAJANING XOSSALARI.
//
// Bu fayl, FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya, 1-darsning asboblari, bitta pozitsiya,
// blokning mexanikasi. 5-ekranda `transform` (+ `WhyStep`): manfiy
// ko'rsatkichli ko'paytirish qadamlab soddalashtiriladi.
//
// DIQQAT, darslikda daraja xossalari RATSIONAL ko'rsatkich uchun beriladi
// (9-§, 44-bet, qutili qoida): "Natural ko'rsatkichli darajaning barcha
// xossalari istalgan ratsional ko'rsatkichli va musbat asosli darajalar
// uchun to'g'ri bo'lishini ko'rsatish mumkin." Butun ko'rsatkich ratsional
// ko'rsatkichning xususiy holati, shuning uchun xossalar to'g'ridan-to'g'ri
// qo'llaniladi. Misollar (7^(1/4)·7^(3/4)=7, 9^(2/3):9^(1/6)=3, 45-bet)
// ratsional ko'rsatkichli, shu sabab bu darsda BUTUN ko'rsatkichli
// misollar bilan almashtirilgan.
//
// DARSNING ISHI:
//   1) aᵖ · aᵠ = aᵖ⁺ᵠ (ko'rsatkichlar QO'SHILADI);
//   2) aᵖ : aᵠ = aᵖ⁻ᵠ (ko'rsatkichlar AYIRILADI);
//   3) (aᵖ)ᵠ = aᵖᵠ (ko'rsatkichlar KO'PAYTIRILADI);
//   4) bu xossalar p, q ISTALGAN butun son bo'lganda ham to'g'ri, a ≠ 0.
//
// ADASHISHLAR: ikkitasi yangi:
//   З64, ko'paytirishda ko'rsatkichlar AYIRILGAN yoki bo'lishda QO'SHILGAN;
//   З65, daraja darajaga ko'tarilganda ko'rsatkichlar QO'SHILGAN, ko'paytirish
//        o'rniga;
//   З16, javob son bilan tekshirilmadi (11-ekranda, qaytadi).
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
  id: 'alg-8-32',
  n: 32,
  row: 36,
  block: 'Б5',
  topic: L(
    "Butun ko'rsatkichli darajaning xossalari",
    'Свойства степени с целым показателем',
    'Properties of the power with an integer exponent',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "aᵖ · aᵠ = aᵖ⁺ᵠ, ko'rsatkichlar qo'shiladi",
    'aᵖ · aᵠ = aᵖ⁺ᵠ, показатели складываются',
    'aᵖ · aᵠ = aᵖ⁺ᵠ, the exponents are added',
  ),
  L(
    "aᵖ : aᵠ = aᵖ⁻ᵠ, ko'rsatkichlar ayiriladi",
    'aᵖ : aᵠ = aᵖ⁻ᵠ, показатели вычитаются',
    'aᵖ : aᵠ = aᵖ⁻ᵠ, the exponents are subtracted',
  ),
  L(
    "(aᵖ)ᵠ = aᵖᵠ, ko'rsatkichlar ko'paytiriladi, va bu xossalar p, q istalgan butun son bo'lganda ham to'g'ri",
    '(aᵖ)ᵠ = aᵖᵠ, показатели умножаются, и эти свойства верны при любых целых p, q',
    '(aᵖ)ᵠ = aᵖᵠ, the exponents are multiplied, and these properties hold for any integer p, q',
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
  'З64': {
    what: L(
      "ko'paytirishda ko'rsatkichlar ayirildi yoki bo'lishda qo'shildi",
      'при умножении показатели вычтены или при делении сложены',
      'the exponents were subtracted when multiplying, or added when dividing',
    ),
    wrong: '2',
    at: 4,
  },
  'З65': {
    what: L(
      "daraja darajaga ko'tarilganda ko'rsatkichlar ko'paytirish o'rniga qo'shildi",
      'при возведении степени в степень показатели сложены вместо умножения',
      'when raising a power to a power, the exponents were added instead of multiplied',
    ),
    wrong: '-1',
    at: 9,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: 2³ karra 2⁻¹ qanday chiqadi. Yakun: 2⁴ karra 2⁻⁶,
// javob bir bo'lingan to'rt.
// ============================================================
const SC_ASK = L('KO\'RSATKICHLAR NIMA BO\'LADI', 'ЧТО БУДЕТ С ПОКАЗАТЕЛЯМИ', 'WHAT HAPPENS TO THE EXPONENTS')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fill={T.ink}>{'2³ · 2⁻¹'}</text>
      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="100" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="107" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "To'rt va minus olti qo'shilib minus ikki chiqadi",
      'Четыре и минус шесть складываются и выходит минус два',
      'Four and negative six add up to negative two',
    )}>
      <text x="70" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink}>{'2⁴ · 2⁻⁶'}</text>
      <path d="M138 26 L156 26 M150 20 L156 26 L150 32" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '600ms' }}>
        <text x="220" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.ok}>{'2⁻²'}</text>
      </g>
      <path d="M255 26 L273 26 M267 20 L273 26 L267 32" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <text x="320" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.ok}>{'1/4'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('KO\'RSATKICHLAR QO\'SHILADI', 'ПОКАЗАТЕЛИ СКЛАДЫВАЮТСЯ', 'THE EXPONENTS ADD'),
  title: L(
    "2³ karra 2⁻¹ ning ko'rsatkichi qanday bo'ladi",
    'Каким будет показатель у 2³ умножить на 2⁻¹',
    'What will the exponent be for 2³ times 2⁻¹',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki daraja ko'paytiriladi. Birining ko'rsatkichi musbat, ikkinchisi manfiy.",
      'Умножаются две степени. У одной показатель положительный, у другой отрицательный.',
      'Two powers are multiplied. One has a positive exponent, the other negative.'),
    A('why',
      "Taxmin qiling, natijaviy ko'rsatkich qanday bo'ladi.",
      'Предположи, каким будет итоговый показатель.',
      'Predict what the resulting exponent will be.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, ko'rsatkichlarga nima bo'ladi?",
      'Как думаешь, что будет с показателями?',
      'What do you think happens to the exponents?',
    ),
    items: [
      { id: 'add', show: L("Qo'shiladi", 'Складываются', 'They add') },
      { id: 'sub', show: L("Ayiriladi", 'Вычитаются', 'They subtract') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Ko'paytirish qoidasi musbat ko'rsatkichda (7-sinfdan).
// Shu tayanch 5 va 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Ko'paytirish qoidasini eslash",
    'Вспоминаем правило умножения',
    'Recalling the multiplication rule',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida ko'paytirish to'g'ri qilingan.",
      'Четыре записи. Только в одной умножение выполнено верно.',
      'Four records. Only one performs the multiplication correctly.'),
    A('why',
      "Bir xil asosli darajalar ko'paytirilganda ko'rsatkichlar qo'shiladi.",
      'При умножении степеней с одинаковым основанием показатели складываются.',
      'When multiplying powers with the same base, the exponents add.'),
  ],
  props: {
    ask: L(
      "3² karra 3⁴ qaysi yozuvda to'g'ri hisoblangan?",
      'В какой записи верно вычислено 3² умножить на 3⁴?',
      'In which record is 3² times 3⁴ correctly computed?',
    ),
    items: [
      { id: 'right', show: '3² · 3⁴ = 3⁶', right: true, name: L("ikki va to'rt qo'shilib olti", 'два и четыре сложились в шесть', 'two and four added to six') },
      {
        id: 'sub', show: '3² · 3⁴ = 3⁻²',
        hint: L("Ko'paytirishda ko'rsatkichlar qo'shiladi, ayirilmaydi.", 'При умножении показатели складываются, а не вычитаются.', 'When multiplying, exponents add, they do not subtract.'),
      },
      {
        id: 'mul', show: '3² · 3⁴ = 3⁸',
        hint: L("Sakkiz ko'rsatkichlarning ko'paytmasi, u daraja darajaga ko'tarilganda ishlaydi.", 'Восемь это произведение показателей, оно работает при возведении степени в степень.', 'Eight is the product of the exponents; that works for a power raised to a power.'),
      },
      {
        id: 'base', show: '9² · 9⁴ = 9⁶',
        hint: L("Asos o'zgarmaydi, uch qoladi, to'qqiz emas.", 'Основание не меняется, остаётся тройка, а не девять.', 'The base does not change; it stays three, not nine.'),
      },
    ],
    after: L(
      "To'g'ri. Asos uch qoladi, ko'rsatkichlar ikki va to'rt qo'shilib olti chiqadi.",
      'Верно. Основание остаётся тройкой, показатели два и четыре складываются в шесть.',
      'Correct. The base stays three, the exponents two and four add to six.',
    ),
  },
}

// ============================================================
// EKRAN 3. A NI BURANG (1-darsning `steppers`). a² karra a⁻³ ni kuzatish:
// bu a⁻¹, ya'ni bir bo'lingan a. a nolga tushganda YO'QOLADI.
// ============================================================
const S3 = {
  eyebrow: L('A NI BURANG', 'КРУТИ A', 'TURN A'),
  title: L(
    "a kvadrat karra a minus kub qanday songa teng",
    'Чему равно a в квадрате умножить на a в минус кубе',
    'What does a squared times a to the negative cube equal',
  ),
  audio: [
    A('mount',
      "a kvadrat karra a minus kub. Ko'rsatkichlar qo'shilib minus bir chiqadi.",
      'a в квадрате умножить на a в минус кубе. Показатели складываются в минус один.',
      'A squared times a to the negative cube. The exponents add to negative one.'),
    A('why',
      "Ikki maqsad beriladi. a ning turli qiymatlarida natijani toping.",
      'Даны две цели. Находи результат при разных значениях a.',
      'Two targets are given. Find the result at different values of a.'),
    A('why',
      "Oxirida a ni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти a до нуля и посмотри, что будет.',
      'At the end bring a down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'a', label: L('a ning qiymati', 'значение a', 'the value of a'),
        start: -4, min: -4, max: 4, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : Math.round((1 / v[0]) * 100) / 100),
    resultLabel: L('a² · a⁻³', 'a² · a⁻³', 'a² · a⁻³'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "a hali nolga tushmasin, avval maqsadlarni oling.",
      'a пока не опускай до нуля, сначала возьми цели.',
      'Do not bring a down to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: 0.5,
        ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
        after: L(
          "0,5. a kvadrat karra a minus kub a minus birga teng, ikkida bir bo'lingan ikki.",
          '0,5. a в квадрате умножить на a в минус кубе равно a в минус первой, при двух это одна вторая.',
          '0.5. a squared times a to negative three equals a to negative one; at a equals two, that is one half.',
        ),
      },
      {
        value: -1,
        ask: L("Endi natija minus 1 ga teng bo'lsin", 'Теперь пусть результат будет равен минус 1', 'Now make the result equal negative 1'),
        after: L(
          "Minus bir. Minus birda a minus birinchi daraja minus birga teng.",
          'Минус один. При минус одном a в минус первой степени равно минус одному.',
          'Negative one. At negative one, a to the negative first power equals negative one.',
        ),
      },
    ],
    ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
    ask2: L("Endi a ni nolga tushiring", 'Теперь опусти a до нуля', 'Now bring a down to zero'),
    broke: L(
      "a nolga teng bo'lganda natija yo'q, chunki manfiy ko'rsatkichli daraja nolda aniqlanmagan.",
      'При a равном нулю результата нет, потому что степень с отрицательным показателем при нуле не определена.',
      'With a equal to zero there is no result, because a power with a negative exponent is not defined at zero.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI NATIJA TO'G'RI (1-darsning `pick`). Ловушка — bo'lishda
// ko'rsatkichlar qo'shilgan (З64).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI NATIJA TO\'G\'RI', 'КАКОЙ РЕЗУЛЬТАТ ВЕРЕН', 'WHICH RESULT IS CORRECT'),
  title: L(
    "5³ ni 5⁵ ga bo'lgan natija qaysi",
    'Каков результат деления 5³ на 5⁵',
    'What is the result of dividing 5³ by 5⁵',
  ),
  audio: [
    A('mount',
      "To'rt natija taklif qilinadi. Faqat bittasi to'g'ri.",
      'Предложены четыре результата. Только один верный.',
      'Four results are proposed. Only one is correct.'),
    A('why',
      "Bo'lishda ko'rsatkichlar ayiriladi, qo'shilmaydi.",
      'При делении показатели вычитаются, а не складываются.',
      'When dividing, exponents subtract, they do not add.'),
  ],
  props: {
    ask: L(
      "5³ : 5⁵ ning natijasi qaysi?",
      'Каков результат 5³ : 5⁵?',
      'What is the result of 5³ : 5⁵?',
    ),
    items: [
      { id: 'right', show: '5⁻²', right: true, name: L("uch minus besh minus ikki", 'три минус пять минус два', 'three minus five negative two') },
      {
        id: 'added', show: '5⁸',
        hint: L("Bu qo'shish, bo'lishda ko'rsatkichlar ayiriladi.", 'Это сложение, а при делении показатели вычитаются.', 'That is addition; when dividing, exponents subtract.'),
      },
      {
        id: 'wrongsign', show: '5²',
        hint: L("Uchdan besh ayirilganda minus ikki chiqadi, ikki emas.", 'Три минус пять даёт минус два, а не два.', 'Three minus five gives negative two, not two.'),
      },
      {
        id: 'mul', show: '5¹⁵',
        hint: L("Bu ko'paytirish, u daraja darajaga ko'tarilganda ishlaydi.", 'Это умножение, оно работает при возведении степени в степень.', 'That is multiplication; it works for a power raised to a power.'),
      },
    ],
    after: L(
      "To'g'ri. Uchdan besh ayirilib minus ikki chiqadi.",
      'Верно. Три минус пять даёт минус два.',
      'Correct. Three minus five gives negative two.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — QADAMLAB SODDALASHTIRISH (`transform`).
// Xukdagi ifoda shu yerda to'liq ochiladi: 2⁴ · 2⁻⁶.
// ============================================================
const S5 = {
  eyebrow: L('SODDALASHTIRAMIZ', 'УПРОЩАЕМ', 'WE SIMPLIFY'),
  title: L(
    "2⁴ karra 2⁻⁶ ni soddalashtiring",
    'Упростите 2⁴ умножить на 2⁻⁶',
    'Simplify 2⁴ times 2⁻⁶',
  ),
  audio: [
    A('mount',
      "Xukdagi ifoda. Ikki qadamda soddalashtiramiz.",
      'Выражение с хука. Упрощаем его за два шага.',
      'The expression from the hook. We simplify it in two steps.'),
    A('why',
      "Har qadamda amal va asoslanish tanlanadi.",
      'На каждом шаге выбирается действие и его основание.',
      'At each step, the action and its justification are chosen.'),
    W('s3',
      "Ikkinchi qadamda manfiy daraja kasrga aylandi.",
      'На втором шаге отрицательная степень превратилась в дробь.',
      'In the second step, the negative power turned into a fraction.'),
  ],
  props: {
    start: <Row size="row" align="center">{'2⁴ · 2⁻⁶'}</Row>,
    steps: [
      {
        actions: [
          { id: 'add', label: L("Ko'rsatkichlarni qo'shish", 'Сложить показатели', 'Add the exponents') },
          { id: 'sub', label: L("Ko'rsatkichlarni ayirish", 'Вычесть показатели', 'Subtract the exponents') },
        ],
        action: 'add',
        wrongs: [
          {
            action: 'sub',
            hint: L(
              "Ayirish bo'lishda ishlaydi, ko'paytirishda emas.",
              'Вычитание работает при делении, а не при умножении.',
              'Subtraction works for division, not multiplication.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'mul', right: true,
              label: L("Bir xil asosli darajalar ko'paytirilganda ko'rsatkichlar qo'shiladi", 'При умножении степеней с одинаковым основанием показатели складываются', 'When multiplying powers with the same base, the exponents add'),
            },
            {
              id: 'div',
              label: L("Bo'lish qoidasi", 'Правило деления', 'The division rule'),
              hint: L(
                "Bu yerda ko'paytirish, bo'lish emas.",
                'Здесь умножение, а не деление.',
                'This is multiplication here, not division.',
              ),
            },
          ],
        },
        ask: L("Natijaviy ko'rsatkichni yozing", 'Запиши итоговый показатель', 'Write the resulting exponent'),
        answer: '-2',
        accepts: ['-2'],
        hints: {
          '*': L("To'rt va minus oltini qo'shing.", 'Сложи четыре и минус шесть.', 'Add four and negative six.'),
        },
        show: <Row size="row" align="center">{'2⁻²'}</Row>,
      },
      {
        actions: [
          { id: 'frac', label: L("Manfiy darajani kasrga aylantirish", 'Превратить отрицательную степень в дробь', 'Turn the negative power into a fraction') },
          { id: 'sign', label: L("Ishorani almashtirish", 'Сменить знак', 'Change the sign') },
        ],
        action: 'frac',
        wrongs: [
          {
            action: 'sign',
            hint: L(
              "Ishora almashtirish teskari son emas.",
              'Смена знака это не обратное число.',
              'Changing the sign is not the reciprocal.',
            ),
          },
        ],
        ask: L("Sonli qiymatini yozing", 'Запиши числовое значение', 'Write the numerical value'),
        answer: '1/4',
        accepts: ['0.25', '1/4'],
        hints: {
          '*': L("Ikkini kvadratga oshirib, teskarisini oling.", 'Возведи два в квадрат и возьми обратное число.', 'Square two and take the reciprocal.'),
        },
        show: <Row size="row" align="center">{'1/4'}</Row>,
      },
    ],
    foot: L(
      "2⁴ karra 2⁻⁶ bir bo'lingan to'rtga teng.",
      '2⁴ умножить на 2⁻⁶ равно одной четвёртой.',
      '2⁴ times 2⁻⁶ equals one quarter.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): 2⁴ karra 2⁻⁶ ni ikki yo'l
// bilan tekshirish — ko'rsatkich qo'shish va to'g'ridan-to'g'ri hisoblash.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "2⁴ karra 2⁻⁶ ni ikki yo'l bilan tekshirish",
    'Проверить 2⁴ умножить на 2⁻⁶ двумя способами',
    'Checking 2⁴ times 2⁻⁶ two ways',
  ),
  audio: [
    A('mount',
      "Bitta ifoda va ikki yo'l. Ikkalasi ham bir xil javob beradi.",
      'Одно выражение и два пути. Оба дают один ответ.',
      'One expression and two ways. Both give the same answer.'),
    W('w2',
      "Birinchi yo'lda ko'rsatkichlar qo'shiladi.",
      'В первом пути складываются показатели.',
      'In the first way, the exponents are added.'),
    W('w4',
      "Ikkinchi yo'lda har bir daraja alohida hisoblanadi.",
      'Во втором пути каждая степень считается отдельно.',
      'In the second way, each power is computed separately.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL — KO\'RSATKICH QO\'SHISH', 'СПОСОБ 1 — СЛОЖЕНИЕ ПОКАЗАТЕЛЕЙ', 'METHOD 1 — ADDING EXPONENTS'),
        lead: L(
          "To'rt va minus olti qo'shilib minus ikki chiqadi",
          'Четыре и минус шесть складываются в минус два',
          'Four and negative six add to negative two',
        ),
        rows: [
          { text: '2⁴⁺⁻⁶ = 2⁻²' },
          { text: '1/4', tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL — ALOHIDA HISOBLASH', 'СПОСОБ 2 — ОТДЕЛЬНЫЙ СЧЁТ', 'METHOD 2 — SEPARATE COMPUTATION'),
        lead: L(
          "2⁴ o'n olti, 2⁻⁶ bir bo'lingan oltmish to'rt",
          '2⁴ равно шестнадцати, 2⁻⁶ равно одной шестьдесят четвёртой',
          '2⁴ equals sixteen, 2⁻⁶ equals one sixty-fourth',
        ),
        rows: [
          { text: '16 · 1/64' },
          { text: '1/4', tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Ko'rsatkich qo'shish tezroq, alohida hisoblash esa tekshiradi",
          'Сложение показателей быстрее, а отдельный счёт проверяет',
          'Adding exponents is faster, separate computation checks it',
        ),
        rows: [{ text: '1/4', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): nega ko'rsatkichlar qo'shiladi.
// ============================================================
const S7 = {
  eyebrow: L('NEGA KO\'RSATKICHLAR QO\'SHILADI', 'ПОЧЕМУ ПОКАЗАТЕЛИ СКЛАДЫВАЮТСЯ', 'WHY EXPONENTS ADD'),
  title: L(
    "Nega ko'paytirishda ko'rsatkichlar qo'shiladi",
    'Почему при умножении показатели складываются',
    'Why exponents add when multiplying',
  ),
  audio: [
    A('mount',
      "aᵖ demak p marta a ko'paytiruvchi, musbat yoki manfiy ravishda.",
      'aᵖ означает p множителей a, взятых с плюсом или минусом.',
      'aᵖ means p factors of a, taken positively or negatively.'),
    W('p2',
      "aᵖ karra aᵠ birlashtirilganda, ko'paytiruvchilar soni p plus q bo'ladi.",
      'При объединении aᵖ и aᵠ количество множителей становится p плюс q.',
      'When aᵖ and aᵠ are combined, the number of factors becomes p plus q.'),
    W('p4',
      "Manfiy ko'rsatkich teskari ko'paytiruvchini bildiradi, shuning uchun qoida manfiyda ham ishlaydi.",
      'Отрицательный показатель означает обратный множитель, поэтому правило работает и при отрицательных числах.',
      'A negative exponent means a reciprocal factor, so the rule works for negative numbers too.',
    ),
  ],
  props: {
    tokens: [
      { t: 'aᵖ', id: 'a' },
      { t: ' · aᵠ = ', id: 'sign' },
      { t: 'aᵖ⁺ᵠ', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qadam. aᵖ p marta ko'paytiruvchini bildiradi.",
          'Первый шаг. aᵖ означает p множителей.',
          'Step one. aᵖ means p factors.',
        ),
      },
      {
        focus: 'sign',
        text: L(
          "Ikkinchi qadam. aᵖ va aᵠ birlashtirilganda, ko'paytiruvchilar soni yig'iladi.",
          'Второй шаг. При объединении aᵖ и aᵠ множители складываются.',
          'Step two. Combining aᵖ and aᵠ, the factors add up.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qadam. Manfiy ko'rsatkich teskari ko'paytiruvchi bo'lgani uchun, qo'shish qoidasi manfiy sonlarda ham to'g'ri.",
          'Третий шаг. Так как отрицательный показатель — обратный множитель, правило сложения верно и для отрицательных чисел.',
          'Step three. Since a negative exponent is a reciprocal factor, the addition rule holds for negative numbers too.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Daraja xossalarini butun va manfiy ko'rsatkichlarga kengaytirish golland matematigi Simon Stevin ishlariga borib taqaladi.",
        'Расширение свойств степени на целые и отрицательные показатели восходит к работам голландского математика Симона Стевина.',
        'Extending the properties of powers to integer and negative exponents traces back to the work of the Dutch mathematician Simon Stevin.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIKDA ratsional ko'rsatkich
// uchun beriladi (9-§, 44-bet), bu darsda butun ko'rsatkichga qo'llaniladi.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Daraja xossalari",
    'Свойства степени',
    'Properties of the power',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Qoida ochildi, va xukdagi qarz to'landi.",
      'Правило открылось, и долг с хука оплачен.',
      'The rule opened, and the debt from the hook is paid.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("aᵖ · aᵠ ko'paytirilganda", 'при умножении aᵖ · aᵠ', 'when multiplying aᵖ · aᵠ') },
      { id: 'f2', label: L("ko'rsatkichlar qo'shiladi, aᵖ⁺ᵠ chiqadi", 'показатели складываются, выходит aᵖ⁺ᵠ', 'the exponents add, giving aᵖ⁺ᵠ') },
      { id: 'f3', label: L("aᵖ ni aᵠ ga bo'linganda", 'при делении aᵖ на aᵠ', 'when dividing aᵖ by aᵠ') },
      { id: 'f4', label: L("ko'rsatkichlar ayiriladi, aᵖ⁻ᵠ chiqadi", 'показатели вычитаются, выходит aᵖ⁻ᵠ', 'the exponents subtract, giving aᵖ⁻ᵠ') },
      { id: 'w1', label: L("(aᵖ)ᵠ hisoblanganda ko'rsatkichlar qo'shiladi", 'при вычислении (aᵖ)ᵠ показатели складываются', 'when computing (aᵖ)ᵠ the exponents add') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Daraja darajaga ko'tarilganda ko'rsatkichlar KO'PAYTIRILADI, qo'shilmaydi.",
      'Так не складывается. При возведении степени в степень показатели УМНОЖАЮТСЯ, а не складываются.',
      'That does not fit. Raising a power to a power MULTIPLIES the exponents, it does not add them.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 9-§, 44-bet (ratsional ko'rsatkich uchun berilgan, butun holatga qo'llaniladi)",
        'Учебник, § 9, стр. 44 (дано для рационального показателя, применяется к целому)',
        'Textbook, section 9, page 44 (given for the rational exponent, applied to the integer case)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "2³ karra 2⁻¹ ning ko'rsatkichi qanday ekanini hali bilmaymiz",
        'Мы пока не знаем, каким будет показатель у 2³ умножить на 2⁻¹',
        'We still do not know what the exponent will be for 2³ times 2⁻¹',
      ),
      right: L(
        "endi ko'rsatkichlarni qo'shib, ikki degani bilamiz",
        'теперь, сложив показатели, знаем, что это два',
        'now, having added the exponents, we know it is two',
      ),
      winner: 'right',
      note: L(
        "Ko'paytirish qo'shadi, bo'lish ayiradi, daraja darajaga ko'paytiradi",
        'Умножение складывает, деление вычитает, степень в степени умножает',
        'Multiplication adds, division subtracts, a power of a power multiplies',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): xossalarni qo'llang.
// ============================================================
const ASK_RESULT3 = L('Natija qaysi?', 'Каков результат?', 'What is the result?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Xossani qo'llang",
    'Примени свойство',
    'Apply the property',
  ),
  audio: [
    A('mount',
      "Besh ifoda. Har birida bitta xossa qo'llaniladi.",
      'Пять выражений. В каждом применяется одно свойство.',
      'Five expressions. Each applies one property.'),
    A('why',
      "Amalning turiga qarab ko'rsatkichlar qo'shiladi, ayiriladi yoki ko'paytiriladi.",
      'В зависимости от действия показатели складываются, вычитаются или умножаются.',
      'Depending on the operation, exponents add, subtract, or multiply.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar amal turi to'g'ri qoidani bergan.",
      'Все пять разобраны. Каждый раз тип действия давал верное правило.',
      'All five are done. Each time the type of operation gave the right rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'4³ · 4⁻⁵'}</Row>,
        ok: L("Ha. Uch va minus besh qo'shilib minus ikki chiqadi.", 'Да. Три и минус пять складываются в минус два.', 'Yes. Three and negative five add to negative two.'),
        question: ASK_RESULT3,
        items: [
          { id: 'a', right: true, label: '4⁻²' },
          { id: 'b', label: '4⁸', hint: L("Ko'paytirishda qo'shiladi, uch va minus besh esa minus ikki beradi.", 'При умножении складываются, а три и минус пять дают минус два.', 'When multiplying they add, and three and negative five give negative two.') },
        ],
        solution: ['4³ · 4⁻⁵', '4⁻²'],
      },
      {
        expr: <Row size="big" align="center">{'6⁻² : 6³'}</Row>,
        ok: L("Ha. Minus ikkidan uch ayirilib minus besh chiqadi.", 'Да. Минус два минус три даёт минус пять.', 'Yes. Negative two minus three gives negative five.'),
        question: ASK_RESULT3,
        items: [
          { id: 'a', right: true, label: '6⁻⁵' },
          { id: 'b', label: '6¹', hint: L("Bo'lishda ayiriladi, minus ikki minus uch esa minus besh beradi.", 'При делении вычитается, а минус два минус три дают минус пять.', 'When dividing, it subtracts, and negative two minus three gives negative five.') },
        ],
        solution: ['6⁻² : 6³', '6⁻⁵'],
      },
      {
        expr: <Row size="big" align="center">{'(3⁻²)⁴'}</Row>,
        ok: L("Ha. Minus ikki va to'rt ko'paytirilib minus sakkiz chiqadi.", 'Да. Минус два и четыре умножаются в минус восемь.', 'Yes. Negative two and four multiply to negative eight.'),
        question: ASK_RESULT3,
        items: [
          { id: 'a', right: true, label: '3⁻⁸' },
          { id: 'b', label: '3²', hint: L("Daraja darajaga ko'tarilganda ko'paytiriladi, minus ikki va to'rt esa minus sakkiz beradi.", 'При возведении степени в степень умножается, а минус два и четыре дают минус восемь.', 'Raising a power to a power multiplies, and negative two and four give negative eight.') },
        ],
        solution: ['(3⁻²)⁴', '3⁻⁸'],
      },
      {
        expr: <Row size="big" align="center">{'7⁵ · 7⁻⁵'}</Row>,
        ok: L("Ha. Besh va minus besh qo'shilib nol chiqadi, natija bir.", 'Да. Пять и минус пять складываются в нуль, результат один.', 'Yes. Five and negative five add to zero, the result is one.'),
        question: ASK_RESULT3,
        items: [
          { id: 'a', right: true, label: '7⁰ = 1' },
          { id: 'b', label: '7¹⁰', hint: L("Besh va minus besh qo'shilsa, nol chiqadi, o'n emas.", 'Пять и минус пять в сумме дают нуль, а не десять.', 'Five and negative five sum to zero, not ten.') },
        ],
        solution: ['7⁵ · 7⁻⁵', '7⁰', '1'],
      },
      {
        expr: <Row size="big" align="center">{'2⁻³ : 2⁻⁵'}</Row>,
        ok: L("Ha. Minus uchdan minus besh ayirilib ikki chiqadi.", 'Да. Минус три минус минус пять даёт два.', 'Yes. Negative three minus negative five gives two.'),
        question: ASK_RESULT3,
        items: [
          { id: 'a', right: true, label: '2²' },
          { id: 'b', label: '2⁻⁸', hint: L("Ikki manfiy son ayirilganda ishoralar farqi olinadi, minus uchdan minus besh ikki beradi.", 'При вычитании двух отрицательных берётся разница знаков, минус три минус минус пять дают два.', 'Subtracting two negatives takes the difference; negative three minus negative five gives two.') },
        ],
        solution: ['2⁻³ : 2⁻⁵', '2²'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): sonli qiymatini toping.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Sonli qiymatini toping",
    'Найди числовое значение',
    'Find the numerical value',
  ),
  audio: [
    A('mount',
      "Uch ifoda. Avval qoidani qo'llang, keyin sonini hisoblang.",
      'Три выражения. Сначала примени правило, потом вычисли число.',
      'Three expressions. First apply the rule, then compute the number.'),
    A('why',
      "Ko'rsatkichni topgandan keyin darajani ochib, sonni yozing.",
      'Найдя показатель, раскрой степень и запиши число.',
      'After finding the exponent, expand the power and write the number.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ko'rsatkich sonli javobga aylangan.",
      'Все три разобраны. Каждый раз показатель превращался в числовой ответ.',
      'All three are done. Each time the exponent turned into a numerical answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3⁵ · 3⁻³'}</Row>,
        ok: L("Ha. Besh va minus uch qo'shilib ikki chiqadi, uch kvadrat to'qqiz.", 'Да. Пять и минус три складываются в два, три в квадрате девять.', 'Yes. Five and negative three add to two, three squared is nine.'),
        question: L("Sonli qiymati qaysi?", 'Каково числовое значение?', 'What is the numerical value?'),
        items: [
          { id: 'a', right: true, label: '9' },
          { id: 'b', label: '3', hint: L("Ko'rsatkich ikki, uch kvadrat to'qqiz, uch emas.", 'Показатель два, три в квадрате девять, а не три.', 'The exponent is two, three squared is nine, not three.') },
        ],
        solution: ['3⁵ · 3⁻³', '3²', '9'],
      },
      {
        expr: <Row size="big" align="center">{'2⁻⁴ · 2⁶'}</Row>,
        ok: L("Ha. Minus to'rt va olti qo'shilib ikki chiqadi, ikki kvadrat to'rt.", 'Да. Минус четыре и шесть складываются в два, два в квадрате четыре.', 'Yes. Negative four and six add to two, two squared is four.'),
        question: L("Sonli qiymati qaysi?", 'Каково числовое значение?', 'What is the numerical value?'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '2', hint: L("Ko'rsatkich ikki, ikki kvadrat to'rt, ikki emas.", 'Показатель два, два в квадрате четыре, а не два.', 'The exponent is two, two squared is four, not two.') },
        ],
        solution: ['2⁻⁴ · 2⁶', '2²', '4'],
      },
      {
        expr: <Row size="big" align="center">{'5² : 5⁴'}</Row>,
        ok: L("Ha. Ikkidan to'rt ayirilib minus ikki chiqadi, teskarisi bir bo'lingan yigirma besh.", 'Да. Два минус четыре даёт минус два, обратное это одна двадцать пятая.', 'Yes. Two minus four gives negative two, the reciprocal is one twenty-fifth.'),
        question: L("Sonli qiymati qaysi?", 'Каково числовое значение?', 'What is the numerical value?'),
        items: [
          { id: 'a', right: true, label: '1/25' },
          { id: 'b', label: '25', hint: L("Ko'rsatkich minus ikki, teskari son kerak, 25 emas.", 'Показатель минус два, нужно обратное число, а не 25.', 'The exponent is negative two; the reciprocal is needed, not 25.') },
        ],
        solution: ['5² : 5⁴', '5⁻²', '1/25'],
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
      "Ko'rsatkichlarni qo'shib yoki ayirib, natijani solishtiring.",
      'Сложив или вычтя показатели, сравни результат.',
      'By adding or subtracting the exponents, compare the result.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло ответ.',
      'All three are done. Each time computation checked the answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'2² · 2⁻⁵   →   2⁻³'}</Row>,
        ok: L("Ha. Ikki va minus besh qo'shilib minus uch chiqadi.", 'Да. Два и минус пять складываются в минус три.', 'Yes. Two and negative five add to negative three.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikki va minus besh rostdan ham minus uch beradi.", 'Два и минус пять действительно дают минус три.', 'Two and negative five indeed give negative three.') },
        ],
        solution: ['2² · 2⁻⁵', '2⁻³'],
      },
      {
        expr: <Row size="big" align="center">{'7⁻¹ : 7²   →   7¹'}</Row>,
        ok: L("Yo'q. Minus birdan ikki ayirilib minus uch chiqadi, bir emas.", 'Нет. Минус один минус два даёт минус три, а не один.', 'No. Negative one minus two gives negative three, not one.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Minus birdan ikki ayirilganda minus uch chiqadi.", 'При вычитании двух из минус одного получается минус три.', 'Subtracting two from negative one gives negative three.') },
        ],
        solution: ['7⁻¹ : 7²', '7⁻³'],
      },
      {
        expr: <Row size="big" align="center">{'(2⁻¹)³   →   2⁻³'}</Row>,
        ok: L("Ha. Minus bir va uch ko'paytirilib minus uch chiqadi.", 'Да. Минус один и три умножаются в минус три.', 'Yes. Negative one and three multiply to negative three.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Minus bir karra uch rostdan ham minus uch beradi.", 'Минус один умножить на три действительно даёт минус три.', 'Negative one times three indeed gives negative three.') },
        ],
        solution: ['(2⁻¹)³', '2⁻³'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): daraja darajaga
// ko'tarilganda ko'rsatkichlar qo'shilgan (З65).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Qo'shildi yoki ko'paytirildimi",
    'Сложили или умножили',
    'Were they added or multiplied',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham daraja darajaga ko'tarilganda ko'rsatkichlar qo'shilgan.",
      'Два задания. В обоих при возведении степени в степень показатели сложили.',
      'Two tasks. In both, when raising a power to a power, the exponents were added.'),
    A('why',
      "Daraja darajaga ko'tarilganda ko'rsatkichlar ko'paytiriladi, qo'shilmaydi.",
      'При возведении степени в степень показатели умножаются, а не складываются.',
      'When raising a power to a power, exponents multiply, they do not add.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Daraja darajaga ko'tarilganda ko'rsatkichlar har doim ko'paytiriladi.",
      'Оба разобраны. При возведении степени в степень показатели всегда умножаются.',
      'Both are done. Raising a power to a power always multiplies the exponents.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'(4⁻²)³   →   4¹'}</Row>,
        ok: L("Ha. Minus ikki va uch ko'paytirilib minus olti chiqishi kerak edi, bir emas.", 'Да. Минус два и три должны были умножиться в минус шесть, а не в один.', 'Yes. Negative two and three should have multiplied to negative six, not one.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ko'rsatkichlar qo'shilgan, ko'paytirilmagan", 'Показатели сложены, а не умножены', 'The exponents were added, not multiplied') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, minus ikki va uch ko'paytirilishi kerak.", 'Это и есть показанная ошибка, минус два и три должны умножаться.', 'This is the very mistake shown; negative two and three should be multiplied.') },
        ],
        solution: ['(4⁻²)³', '4⁻⁶'],
      },
      {
        expr: <Row size="big" align="center">{'(2⁻³)⁻²   →   2⁻⁵'}</Row>,
        ok: L("Ha. Minus uch va minus ikki ko'paytirilib olti chiqishi kerak edi, minus besh emas.", 'Да. Минус три и минус два должны были умножиться в шесть, а не в минус пять.', 'Yes. Negative three and negative two should have multiplied to six, not negative five.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ko'rsatkichlar qo'shilgan, ko'paytirilmagan", 'Показатели сложены, а не умножены', 'The exponents were added, not multiplied') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, ikki manfiy son ko'paytirilib musbat chiqadi.", 'Это и есть показанная ошибка, два отрицательных числа при умножении дают положительное.', 'This is the very mistake shown; two negative numbers multiply to a positive.') },
        ],
        solution: ['(2⁻³)⁻²', '2⁶'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH (1-darsning `fill`): xossani qadamlab qo'llash.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Xossani qadamlab qo'llang",
    'Примени свойство по шагам',
    'Apply the property step by step',
  ),
  audio: [
    A('mount',
      "Ifoda berilgan. Ko'rsatkichni toping, keyin sonli qiymatini yozing.",
      'Дано выражение. Найди показатель, затем запиши числовое значение.',
      'An expression is given. Find the exponent, then write the numerical value.'),
    A('why',
      "Amalning turiga qarab qo'shing, ayiring yoki ko'paytiring.",
      'В зависимости от действия складывай, вычитай или умножай.',
      'Depending on the operation, add, subtract, or multiply.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar ko'rsatkich sonli javobni bergan.",
      'Все три заполнены. Каждый раз показатель давал числовой ответ.',
      'All three are filled. Each time the exponent gave the numerical answer.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['-1', '1/3'],
      lines: [
        [{ t: '3² · 3⁻³ = 3' }, { slot: '-1' }, { t: ' = ' }, { slot: '1/3' }],
      ],
    },
    tasks: [
      {
        chips: ['-2', '1/16'],
        lines: [
          [{ t: '2¹ · 2⁻³ = 2' }, { slot: '-2' }, { t: ' = ' }, { slot: '1/16' }],
        ],
      },
      {
        chips: ['-3', '1/125'],
        lines: [
          [{ t: '5⁻¹ : 5² = 5' }, { slot: '-3' }, { t: ' = ' }, { slot: '1/125' }],
        ],
      },
      {
        chips: ['4', '81'],
        lines: [
          [{ t: '(3⁻²)⁻² = 3' }, { slot: '4' }, { t: ' = ' }, { slot: '81' }],
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
    "Daraja xossalari bo'yicha to'rt savol",
    'Четыре вопроса о свойствах степени',
    'Four questions about the properties of the power',
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
        id: 'q1', tag: 'З64',
        ask: L('3⁴ · 3⁻⁶ ning ko\'rsatkichi qaysi?', 'Каков показатель у 3⁴ · 3⁻⁶?', 'What is the exponent of 3⁴ · 3⁻⁶?'),
        options: [
          { id: 'ok', right: true, label: '−2' },
          { id: 'sub', label: '10' },
          { id: 'wrong', label: '2' },
        ],
        hint: L("Ko'paytirishda qo'shiladi, to'rt va minus olti minus ikki beradi.", 'При умножении складываются, четыре и минус шесть дают минус два.', 'When multiplying they add; four and negative six give negative two.'),
        ok: L("To'g'ri, ko'rsatkichlar qo'shilib minus ikki chiqadi.", 'Верно, показатели складываются в минус два.', 'Correct, the exponents add to negative two.'),
      },
      {
        id: 'q2', tag: 'З65',
        ask: L('(5⁻¹)⁴ ning ko\'rsatkichi qaysi?', 'Каков показатель у (5⁻¹)⁴?', 'What is the exponent of (5⁻¹)⁴?'),
        options: [
          { id: 'ok', right: true, label: '−4' },
          { id: 'added', label: '3' },
          { id: 'wrong', label: '4' },
        ],
        hint: L("Daraja darajaga ko'tarilganda ko'paytiriladi, minus bir va to'rt minus to'rt beradi.", 'При возведении степени в степень умножаются, минус один и четыре дают минус четыре.', 'Raising a power to a power multiplies; negative one and four give negative four.'),
        ok: L("To'g'ri, ko'rsatkichlar ko'paytirilib minus to'rt chiqadi.", 'Верно, показатели умножаются в минус четыре.', 'Correct, the exponents multiply to negative four.'),
      },
      {
        id: 'q3', tag: 'З64',
        ask: L('6⁻² : 6⁻⁵ ning ko\'rsatkichi qaysi?', 'Каков показатель у 6⁻² : 6⁻⁵?', 'What is the exponent of 6⁻² : 6⁻⁵?'),
        options: [
          { id: 'ok', right: true, label: '3' },
          { id: 'wrong', label: '−7' },
          { id: 'wrong2', label: '−3' },
        ],
        hint: L("Bo'lishda ayiriladi, minus ikkidan minus besh ayirilsa uch chiqadi.", 'При делении вычитается, минус два минус минус пять дают три.', 'When dividing, it subtracts; negative two minus negative five gives three.'),
        ok: L("To'g'ri, ko'rsatkichlar ayirilib uch chiqadi.", 'Верно, показатели вычитаются в три.', 'Correct, the exponents subtract to three.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('2³ · 2⁻³ = 1 to\'g\'rimi?', 'Верно ли 2³ · 2⁻³ = 1?', 'Is 2³ · 2⁻³ = 1 correct?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Uch va minus uch qo'shilib nol chiqadi, nolinchi daraja bir.", 'Три и минус три складываются в нуль, нулевая степень единица.', 'Three and negative three add to zero, the zero power is one.'),
        ok: L("To'g'ri, natija bir.", 'Верно, результат один.', 'Correct, the result is one.'),
      },
      {
        id: 'q5', tag: 'З64',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "3⁵ karra 3⁻⁷ ning ko'rsatkichini yig'ing.",
            'Собери показатель у 3⁵ умножить на 3⁻⁷.',
            'Assemble the exponent of 3⁵ times 3⁻⁷.',
          ),
          lines: [
            [{ t: '3' }, { slot: '−2' }],
          ],
          tiles: [
            { id: 't1', v: '−2', x: 12, y: 12 },
            { id: 't2', v: '12', x: 70, y: 14 },
            { id: 't3', v: '2', x: 40, y: 50 },
          ],
          hint: L(
            "Besh va minus yetti qo'shilib minus ikki chiqadi.",
            'Пять и минус семь складываются в минус два.',
            'Five and negative seven add to negative two.',
          ),
          doneNote: L(
            "Yig'ildi. Ko'rsatkichlar qo'shilib minus ikki chiqdi.",
            'Собрано. Показатели сложились в минус два.',
            'Assembled. The exponents added to negative two.',
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
    "Ko'paytirish qo'shadi, bo'lish ayiradi, daraja darajaga ko'paytiradi",
    'Умножение складывает, деление вычитает, степень в степени умножает',
    'Multiplication adds, division subtracts, a power of a power multiplies',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. 2 to'rtinchi karra 2 minus oltinchi, javobi bir bo'lingan to'rt.",
      'С урока остаётся одна запись. 2 в четвёртой умножить на 2 в минус шестой, ответ одна четвёртая.',
      'One record stays with you. Two to the fourth times two to the negative sixth, the answer one quarter.'),
    A('s1',
      "Bugun uch narsa qilindi. Ko'paytirish qoidasini manfiy ko'rsatkichga qo'lladingiz, bo'lish qoidasini qo'lladingiz va daraja darajaga ko'tarish qoidasini qo'lladingiz.",
      'Сегодня сделано три вещи. Ты применил правило умножения к отрицательному показателю, применил правило деления и правило возведения степени в степень.',
      'Three things are done today. You applied the multiplication rule to a negative exponent, applied the division rule, and applied the power-of-a-power rule.'),
    A('s2',
      "Keyingi darsda sonning standart ko'rinishi. Katta va kichik sonlar qisqa yoziladi.",
      'В следующем уроке стандартный вид числа. Большие и маленькие числа записываются короче.',
      'The next lesson covers the standard form of a number. Large and small numbers are written more briefly.',
    ),
  ],
  props: {
    mark: '2⁴ · 2⁻⁶ = 2⁻² = 1/4',
    markNote: L(
      "to'rt va minus olti qo'shilib minus ikki chiqdi",
      'четыре и минус шесть сложились в минус два',
      'four and negative six added to negative two',
    ),
    lines: [
      L(
        "aᵖ · aᵠ = aᵖ⁺ᵠ, ko'rsatkichlar qo'shiladi",
        'aᵖ · aᵠ = aᵖ⁺ᵠ, показатели складываются',
        'aᵖ · aᵠ = aᵖ⁺ᵠ, the exponents add',
      ),
      L(
        "aᵖ : aᵠ = aᵖ⁻ᵠ, ko'rsatkichlar ayiriladi",
        'aᵖ : aᵠ = aᵖ⁻ᵠ, показатели вычитаются',
        'aᵖ : aᵠ = aᵖ⁻ᵠ, the exponents subtract',
      ),
      L(
        "(aᵖ)ᵠ = aᵖᵠ, ko'rsatkichlar ko'paytiriladi",
        '(aᵖ)ᵠ = aᵖᵠ, показатели умножаются',
        '(aᵖ)ᵠ = aᵖᵠ, the exponents multiply',
      ),
    ],
    bridge: L(
      "Keyingi dars: sonning standart ko'rinishi",
      'Следующий урок: стандартный вид числа',
      'Next lesson: the standard form of a number',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya, 1-darsning asboblari,
// bitta pozitsiya (5-ekran), QADAMLAB SODDALASHTIRISH (`transform`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З64', 'З64', 'З64',
    'З64', 'З64', 'З64', 'З64', 'З64',
    'З16', 'З65', 'З65', null, null,
  ],
  mechanic: { at: 5, tool: 'transform', kind: 'whyStep' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
