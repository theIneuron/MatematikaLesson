// ============================================================================
// 8-sinf, Dars 26. BIR NOMA'LUMLI TENGSIZLIKLAR SISTEMASI.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `twosides.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `twosides`: ikki tengsizlik ketma-ket
// chiziladi, natija — ikki NURNING KESISHMASI (`set: {between}`).
//
// DARSNING ISHI (darslik, 16-§, 94-97-bet, «1. Tengsizliklar sistemalari»
// qismi):
//   1) sistemaning yechimi — noma'lumning HAR IKKI tengsizlikni to'g'ri sonli
//      tengsizlikka aylantiradigan qiymati;
//   2) sistemani yechish — uning yechimlarini topish yoki yo'qligini aniqlash;
//   3) har bir tengsizlik alohida yechiladi, keyin yechimlar to'g'ri
//      chiziqda KESISHTIRILADI, birlashtirish EMAS.
//
// DARSLIK. O'zbek darsligi, 16-§, 95-99-bet: hovuz masalasi (4x > 2000,
// 5x ≤ 4000), to'rt namunali sistema (97-99-bet), kesishma chizmalari.
//
// ADASHISHLAR: bittasi yangi, bittasi qaytadi:
//   З55 — sistemaning ikki yechimi KESISHTIRISH o'rniga BIRLASHTIRILDI;
//   З54 — chegara nuqtasi noto'g'ri kiritildi/chiqarib tashlandi (qaytadi);
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
  id: 'alg-8-26',
  n: 26,
  row: 29,
  block: 'Б4',
  topic: L(
    "Bir noma'lumli tengsizliklar sistemasi",
    'Системы линейных неравенств с одной переменной',
    'Systems of linear inequalities in one variable',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "noma'lumning sistemadagi HAR IKKI tengsizlikni to'g'ri qiladigan qiymati sistemaning yechimi deyiladi",
    'Значение переменной, обращающее в верные ОБА неравенства системы, называется решением системы',
    'A value of the variable that makes BOTH inequalities of the system true is called a solution of the system',
  ),
  L(
    "sistemani yechish uning yechimlarini topish yoki ularning yo'qligini aniqlash demakdir",
    'Решить систему значит найти все её решения или установить, что их нет',
    'Solving the system means finding all its solutions or establishing that there are none',
  ),
  L(
    "har bir tengsizlik alohida yechiladi, keyin ikki yechim to'g'ri chiziqda kesishtiriladi",
    'Каждое неравенство решается по отдельности, затем два решения пересекаются на числовой прямой',
    'Each inequality is solved separately, then the two solutions are intersected on the number line',
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
  'З54': {
    what: L(
      "chegara nuqtasi noto'g'ri kiritildi",
      'граничная точка учтена неверно',
      'the boundary point was handled incorrectly',
    ),
    wrong: '5',
    at: 3,
  },
  'З55': {
    what: L(
      "ikki yechim kesishtirish o'rniga birlashtirildi",
      'два решения объединены вместо пересечения',
      'the two solutions were united instead of intersected',
    ),
    wrong: '0',
    at: 4,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: x = 3 ikkalasiga ham mos keladimi. Yakun: 1 < x < 5,
// ikki ochiq nuqta orasidagi kesma.
// ============================================================
const SC_ASK = L('IKKALASIGA HAM MOSMI', 'ПОДХОДИТ ЛИ ОБОИМ', 'DOES IT FIT BOTH')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="46" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'x > 1,   x < 5'}</text>
      <text x="200" y="76" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink3}>{'x = 3'}</text>
      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="108" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="115" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Ikki nur kesishib, bir dan beshgacha kesma qoladi",
      'Два луча пересекаются, остаётся отрезок от одного до пяти',
      'Two rays intersect, leaving the segment from one to five',
    )}>
      <text x="200" y="24" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fill={T.ink}>{'x > 1,   x < 5'}</text>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <line x1="40" y1="60" x2="360" y2="60" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <rect x="130" y="55" width="140" height="10" rx="5" fill={T.accent} opacity=".85"/>
        <circle cx="130" cy="60" r="4.4" fill={T.paper} stroke={T.accent} strokeWidth="2.4"/>
        <text x="130" y="74" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>1</text>
        <circle cx="270" cy="60" r="4.4" fill={T.paper} stroke={T.accent} strokeWidth="2.4"/>
        <text x="270" y="74" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>5</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1800ms' }}>
        <text x="200" y="98" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.ok}>{'1 < x < 5'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('X = 3 SINAB KO\'RAMIZ', 'ПРОВЕРИМ X = 3', 'LET US TRY X = 3'),
  title: L(
    "X uch bo'lsa, ikkala tengsizlikka ham mos keladimi",
    'Если x равен трём, подходит ли обоим неравенствам',
    'If x equals three, does it fit both inequalities',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki tengsizlik. Ikkalasi ham bir vaqtda to'g'ri bo'lishi kerak.",
      'Два неравенства. Оба должны быть верны одновременно.',
      'Two inequalities. Both must be true at the same time.'),
    A('why',
      "Taxmin qiling, x uch bo'lganda ikkalasi ham to'g'ri chiqadimi.",
      'Предположи, верны ли оба при x равном трём.',
      'Predict whether both are true when x equals three.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, x = 3 ikkalasiga ham mos keladimi?",
      'Как думаешь, подходит ли x = 3 обоим?',
      'Do you think x = 3 fits both?',
    ),
    items: [
      { id: 'yes', show: L('Ha, ikkalasiga ham', 'Да, обоим', 'Yes, both') },
      { id: 'no', show: L("Yo'q, faqat bittasiga", 'Нет, только одному', 'No, only one') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Bitta tengsizlikni yechish (25-darsdan). Shu tayanch
// 5 va 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Bitta tengsizlikni yechishni eslash",
    'Вспоминаем решение одного неравенства',
    'Recalling solving one inequality',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida iks plyus uch katta to'rt to'g'ri yechilgan.",
      'Четыре записи. Только в одной верно решено икс плюс три больше четырёх.',
      'Four records. Only one correctly solves x plus three greater than four.'),
    A('why',
      "Uch chapdan o'ngga o'tib ishorasini almashtiradi.",
      'Тройка, переходя слева направо, меняет знак.',
      'Three, moving from left to right, changes its sign.'),
  ],
  props: {
    ask: L(
      "x + 3 > 4 ning yechimi qaysi yozuvda to'g'ri?",
      'В какой записи верно решено x + 3 > 4?',
      'In which record is x + 3 > 4 correctly solved?',
    ),
    items: [
      { id: 'right', show: 'x > 1', right: true, name: L("uch o'ngga o'tib minus uch bo'ldi", 'тройка, перейдя вправо, стала минус три', 'three, moving right, became negative three') },
      {
        id: 'noflip', show: 'x > 7',
        hint: L("Uch o'ngga o'tsa, qo'shilmaydi, ayiriladi.", 'Тройка, переходя вправо, не складывается, а вычитается.', 'Three, moving right, is subtracted, not added.'),
      },
      {
        id: 'wrongsign', show: 'x < 1',
        hint: L("Uch musbat son, ishora burilmaydi.", 'Три положительное число, знак не переворачивается.', 'Three is a positive number, the sign does not flip.'),
      },
      {
        id: 'zero', show: 'x > 4',
        hint: L("Uch hisobga olinmagan, u ham o'ngga o'tishi kerak edi.", 'Тройка не учтена, она тоже должна была перейти вправо.', 'Three was not accounted for; it too should have moved right.'),
      },
    ],
    after: L(
      "To'g'ri. Uch o'ngga o'tib minus uch bo'ldi, x bir dan katta.",
      'Верно. Тройка, перейдя вправо, стала минус три, x больше одного.',
      'Correct. Three, moving right, became negative three, x is greater than one.',
    ),
  },
}

// ============================================================
// EKRAN 3. X NI BURANG (1-darsning `steppers`). Beshga qanchalik yaqin:
// x besh tomon yaqinlashganda natija ortadi, x beshga tenglashganda
// YO'QOLADI — sistema kesmasining O'NG chegarasi (З54 bilan bog'liq).
// ============================================================
const S3 = {
  eyebrow: L('X NI BURANG', 'КРУТИ X', 'TURN X'),
  title: L(
    "Beshga qanchalik yaqin",
    'Насколько близко к пяти',
    'How close to five',
  ),
  audio: [
    A('mount',
      "X beshdan qancha uzoqligini kuzatamiz. Natija bir bo'lingan besh minus x ga teng.",
      'Смотрим, насколько x далеко от пяти. Результат равен единице, делённой на пять минус x.',
      'We watch how far x is from five. The result equals one divided by five minus x.'),
    A('why',
      "Ikki maqsad beriladi. x ning turli qiymatlarida natijani toping.",
      'Даны две цели. Находи результат при разных значениях x.',
      'Two targets are given. Find the result at different values of x.'),
    A('why',
      "Oxirida x ni beshga tushiring va nima bo'lishini ko'ring.",
      'В конце подведи x к пяти и посмотри, что будет.',
      'At the end bring x up to five and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'x', label: L('x ning qiymati', 'значение x', 'the value of x'),
        start: 2, min: 2, max: 5, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 5 ? null : Math.round((1 / (5 - v[0])) * 100) / 100),
    resultLabel: L('1/(5−x)', '1/(5−x)', '1/(5−x)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "x hali beshga tushmasin, avval maqsadlarni oling.",
      'x пока не подводи к пяти, сначала возьми цели.',
      'Do not bring x up to five yet, take the targets first.',
    ),
    goals: [
      {
        value: 0.5,
        ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
        after: L(
          "0,5. Beshdan uch ayirilganda ikki qoladi, bir bo'lingan ikki 0,5.",
          '0,5. Пять минус три равно двум, единица, делённая на два, это 0,5.',
          '0.5. Five minus three equals two, one divided by two is 0.5.',
        ),
      },
      {
        value: 1,
        ask: L("Endi natija 1 ga teng bo'lsin", 'Теперь пусть результат будет равен 1', 'Now make the result equal 1'),
        after: L(
          "1. Beshdan to'rt ayirilganda bir qoladi, bir bo'lingan bir bir.",
          '1. Пять минус четыре равно одному, единица, делённая на один, это один.',
          '1. Five minus four equals one, one divided by one is one.',
        ),
      },
    ],
    ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
    ask2: L("Endi x ni beshga tushiring", 'Теперь подведи x к пяти', 'Now bring x up to five'),
    broke: L(
      "x beshga teng bo'lganda natija yo'q, chunki nolga bo'lish mumkin emas. Shuning uchun besh sistema yechimiga kirmaydi.",
      'При x равном пяти результата нет, потому что делить на нуль нельзя. Поэтому пять не входит в решение системы.',
      'With x equal to five there is no result, because dividing by zero is not possible. That is why five is not part of the system solution.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI QIYMAT SISTEMA YECHIMI (1-darsning `pick`). Ловушка —
// birlashtirish kesishtirish o'rniga olindi (З55).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI QIYMAT SISTEMA YECHIMI', 'КАКОЕ ЗНАЧЕНИЕ — РЕШЕНИЕ СИСТЕМЫ', 'WHICH VALUE IS A SYSTEM SOLUTION'),
  title: L(
    "x > 1, x < 5 sistemasining yechimi qaysi qiymat",
    'Какое значение — решение системы x > 1, x < 5',
    'Which value is a solution of the system x > 1, x < 5',
  ),
  audio: [
    A('mount',
      "To'rt qiymat taklif qilinadi. Faqat bittasi ikkala tengsizlikka ham mos.",
      'Предложены четыре значения. Только одно подходит обоим неравенствам.',
      'Four values are proposed. Only one fits both inequalities.'),
    A('why',
      "Sistema yechimi ikkalasiga BIRDAN mos bo'lishi kerak, faqat bittasiga emas.",
      'Решение системы должно подходить ОБОИМ сразу, а не только одному.',
      'A system solution must fit BOTH at once, not just one.'),
  ],
  props: {
    ask: L(
      "x > 1, x < 5 sistemasining yechimi qaysi qiymat?",
      'Какое значение — решение системы x > 1, x < 5?',
      'Which value is a solution of the system x > 1, x < 5?',
    ),
    items: [
      { id: 'right', show: 'x = 3', right: true, name: L("uchdan katta ham, beshdan kichik ham", 'больше одного и меньше пяти', 'greater than one and less than five') },
      {
        id: 'onlyfirst', show: 'x = 7',
        hint: L("Bir dan katta, lekin beshdan kichik emas, ikkinchi shartga mos kelmaydi.", 'Больше одного, но не меньше пяти, второму условию не подходит.', 'Greater than one, but not less than five, it does not fit the second condition.'),
      },
      {
        id: 'onlysecond', show: 'x = 0',
        hint: L("Beshdan kichik, lekin bir dan katta emas, birinchi shartga mos kelmaydi.", 'Меньше пяти, но не больше одного, первому условию не подходит.', 'Less than five, but not greater than one, it does not fit the first condition.'),
      },
      {
        id: 'neither', show: 'x = −2',
        hint: L("Ikkalasiga ham mos kelmaydi.", 'Не подходит ни одному из условий.', 'It fits neither condition.'),
      },
    ],
    after: L(
      "To'g'ri. Uch bir dan katta va besh dan kichik, ikkalasiga ham mos.",
      'Верно. Три больше одного и меньше пяти, подходит обоим.',
      'Correct. Three is greater than one and less than five, fitting both.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — IKKI NURNING KESISHMASI (`twosides`).
// Xukdagi sistema shu yerda to'liq ko'riladi.
// ============================================================
const S5 = {
  eyebrow: L('KESISHTIRAMIZ', 'ПЕРЕСЕКАЕМ', 'WE INTERSECT'),
  title: L(
    "x > 1, x < 5 sistemasini to'g'ri chiziqda yechish",
    'Решить систему x > 1, x < 5 на числовой прямой',
    'Solve the system x > 1, x < 5 on the number line',
  ),
  audio: [
    A('mount',
      "Xukdagi sistema. Ikki qadamda to'g'ri chiziqda chizamiz.",
      'Система с хука. Рисуем на числовой прямой за два шага.',
      'The system from the hook. We draw it on the number line in two steps.'),
    A('why',
      "Amal ikkala tengsizlikka birdan tegishli. Qadamni tanlang.",
      'Действие относится сразу к обоим неравенствам. Выбери шаг.',
      'The action applies to both inequalities at once. Choose the step.'),
    W('a2',
      "Ikkinchi qadamda kesishma olindi.",
      'На втором шаге взято пересечение.',
      'In the second step the intersection was taken.'),
  ],
  props: {
    from: -1,
    to: 7,
    start: { left: 'x > 1,   x < 5', rel: '', right: '', set: null },
    steps: [
      {
        ask: L('Birinchi tengsizlikni chizamiz. Nima qilamiz?', 'Рисуем первое неравенство. Что делаем?', 'We draw the first inequality. What do we do?'),
        actions: [
          {
            id: 'first', right: true,
            label: L("x > 1 ni chizish", 'Нарисовать x > 1', 'Draw x > 1'),
            to: { left: 'x > 1,   x < 5', rel: '', right: '' },
            set: { gt: 1 },
          },
          {
            id: 'both',
            label: L("Ikkalasini birdan bo'yash", 'Закрасить сразу оба', 'Shade both at once'),
            hint: L(
              "Har birini alohida chizib, keyin kesishtirish kerak.",
              'Нужно нарисовать каждое отдельно, а затем пересечь.',
              'Each must be drawn separately, then intersected.',
            ),
          },
        ],
      },
      {
        ask: L('Endi ikkinchi tengsizlikni qo\'shamiz. Nima qilamiz?', 'Теперь добавляем второе неравенство. Что делаем?', 'Now we add the second inequality. What do we do?'),
        actions: [
          {
            id: 'intersect', right: true,
            label: L("x < 5 ni qo'shib, kesishmani olish", 'Добавить x < 5 и взять пересечение', 'Add x < 5 and take the intersection'),
            to: { left: '1 < x < 5', rel: '', right: '' },
            set: { between: [1, 5], openLeft: true, openRight: true },
            note: L(
              "Ikki nur kesishib, bir dan beshgacha kesma qoldi.",
              'Два луча пересеклись, остался отрезок от одного до пяти.',
              'Two rays intersected, leaving the segment from one to five.',
            ),
          },
          {
            id: 'union',
            label: L("x < 5 ni qo'shib, birlashtirish", 'Добавить x < 5 и объединить', 'Add x < 5 and unite'),
            counter: { at: '−10', gives: 'x < 5', verdict: L("lekin bir dan katta emas", 'но не больше одного', 'but not greater than one') },
            hint: L(
              "Birlashtirish emas, kesishtirish kerak, ikkalasiga ham mos son kerak.",
              'Нужно не объединение, а пересечение, число должно подходить обоим.',
              'Not a union but an intersection is needed, the number must fit both.',
            ),
          },
        ],
      },
    ],
    note: L(
      "Sistema yechimi bir dan besh gacha, ikkalasi ham ochiq.",
      'Решение системы от одного до пяти, обе точки открыты.',
      'The system solution runs from one to five, both points open.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): kesishmani ikki yo'l bilan
// topish — chizma va son qo'yib tekshirish.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Kesishmani ikki yo'l bilan topish",
    'Найти пересечение двумя способами',
    'Finding the intersection two ways',
  ),
  audio: [
    A('mount',
      "Bitta sistema va ikki yo'l. Ikkalasi ham bir xil kesmani beradi.",
      'Одна система и два пути. Оба дают один и тот же отрезок.',
      'One system and two ways. Both give the same segment.'),
    W('w2',
      "Birinchi yo'lda ikki nur to'g'ri chiziqda chiziladi.",
      'В первом пути два луча рисуются на числовой прямой.',
      'In the first way, two rays are drawn on the number line.'),
    W('w4',
      "Ikkinchi yo'lda chegaralar taqqoslanadi.",
      'Во втором пути сравниваются границы.',
      'In the second way, the boundaries are compared.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL — CHIZMA', 'СПОСОБ 1 — ЧЕРТЁЖ', 'METHOD 1 — THE DRAWING'),
        lead: L(
          "Ikki nurni bir chiziqqa qo'yib, ustma-ust tushgan joyni topamiz",
          'Ставим два луча на одну прямую и находим место, где они совпадают',
          'We place two rays on one line and find where they overlap',
        ),
        rows: [
          { text: 'x > 1' },
          { text: 'x < 5', tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL — CHEGARALARNI TAQQOSLASH', 'СПОСОБ 2 — СРАВНЕНИЕ ГРАНИЦ', 'METHOD 2 — COMPARING THE BOUNDARIES'),
        lead: L(
          "Kattaroq chegara chapdan, kichikroq chegara o'ngdan olinadi",
          'Большая граница берётся слева, меньшая — справа',
          'The larger boundary is taken on the left, the smaller on the right',
        ),
        rows: [
          { text: L('chap chegara: 1', 'левая граница: 1', 'left boundary: 1') },
          { text: L("o'ng chegara: 5", 'правая граница: 5', 'right boundary: 5'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Chizma ko'rgazmali, chegaralarni taqqoslash esa tezroq",
          'Чертёж нагляден, а сравнение границ быстрее',
          'The drawing is visual, comparing boundaries is faster',
        ),
        rows: [{ text: L('1 < x < 5', '1 < x < 5', '1 < x < 5'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): nega birlashtirish emas,
// kesishtirish kerak.
// ============================================================
const S7 = {
  eyebrow: L('NEGA KESISHTIRISH KERAK', 'ПОЧЕМУ НУЖНО ПЕРЕСЕЧЕНИЕ', 'WHY INTERSECTION IS NEEDED'),
  title: L(
    "Nega birlashtirish emas, kesishtirish kerak",
    'Почему нужно не объединение, а пересечение',
    'Why intersection, not union, is needed',
  ),
  audio: [
    A('mount',
      "Sistema HAR IKKI tengsizlikni birdan talab qiladi.",
      'Система требует ОБА неравенства одновременно.',
      'The system demands BOTH inequalities at once.'),
    W('p2',
      "Minus o'n olsak, u besh dan kichik, lekin bir dan katta emas.",
      'Если взять минус десять, оно меньше пяти, но не больше одного.',
      'If we take negative ten, it is less than five, but not greater than one.'),
    W('p4',
      "Shuning uchun minus o'n sistema yechimi emas, faqat kesishgan qism yechim.",
      'Поэтому минус десять не решение системы, решение только пересечённая часть.',
      'That is why negative ten is not a system solution; only the intersected part is the solution.',
    ),
  ],
  props: {
    tokens: [
      { t: 'x > 1', id: 'a' },
      { t: '  ∩  ', id: 'sign' },
      { t: 'x < 5', id: 'b' },
    ],
    steps: [
      {
        focus: 'sign',
        text: L(
          "Birinchi qadam. Sistema belgisi kesishma, ikkalasi ham birdan kerak.",
          'Первый шаг. Знак системы — пересечение, нужны оба сразу.',
          'Step one. The system sign is intersection, both are needed at once.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi qadam. Minus o'n besh dan kichik, lekin bir dan katta emas.",
          'Второй шаг. Минус десять меньше пяти, но не больше одного.',
          'Step two. Negative ten is less than five, but not greater than one.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Uchinchi qadam. Ikkalasiga ham mos kelmagani uchun minus o'n yechim EMAS.",
          'Третий шаг. Так как не подходит обоим, минус десять НЕ решение.',
          'Step three. Since it does not fit both, negative ten is NOT a solution.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Kesishma belgisi ∩ to'plamlar nazariyasidan olingan, va u xuddi ikki soyabon qopqog'ining ustma-ust tushgan qismiga o'xshaydi.",
        'Знак пересечения ∩ взят из теории множеств и напоминает часть, где перекрываются две крыши.',
        'The intersection sign ∩ comes from set theory and resembles the overlapping part of two roofs.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 16-§, 95-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Tengsizliklar sistemasining yechimi",
    'Решение системы неравенств',
    'The solution of a system of inequalities',
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
      { id: 'f1', label: L("noma'lumning sistemadagi har ikki tengsizlikni to'g'ri qiladigan qiymati", 'значение переменной, обращающее в верные оба неравенства системы', 'a value of the variable that makes both inequalities of the system true') },
      { id: 'f2', label: L("sistemaning yechimi deyiladi", 'называется решением системы', 'is called a solution of the system') },
      { id: 'f3', label: L("sistemani yechish uning yechimlarini topish", 'решить систему значит найти её решения', 'solving the system means finding its solutions') },
      { id: 'f4', label: L("yoki ularning yo'qligini aniqlash demakdir", 'или установить, что их нет', 'or establishing that there are none') },
      { id: 'w1', label: L("faqat bitta tengsizlikka mos kelishi kifoya", 'достаточно подходить только одному неравенству', 'it is enough to fit only one inequality') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Yechim HAR IKKI tengsizlikka birdan mos kelishi shart.",
      'Так не складывается. Решение обязано подходить ОБОИМ неравенствам сразу.',
      'That does not fit. The solution must fit BOTH inequalities at once.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 16-§, 95-bet",
        'Учебник, § 16, стр. 95',
        'Textbook, section 16, page 95',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "x uch bo'lganda ikkalasiga ham mos kelishini hali bilmaymiz",
        'Мы пока не знаем, подходит ли x = 3 обоим',
        'We still do not know whether x = 3 fits both',
      ),
      right: L(
        "endi kesishmani ko'rib, ikkalasiga ham mos ekanini bilamiz",
        'теперь, увидев пересечение, знаем, что подходит обоим',
        'now, having seen the intersection, we know it fits both',
      ),
      winner: 'right',
      note: L(
        "Kesishma ishlaydi, birlashtirish emas",
        'Работает пересечение, а не объединение',
        'Intersection works, not union',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): sistemaning kesishmasini toping.
// ============================================================
const ASK_INTERSECT = L('Kesishma qaysi?', 'Каково пересечение?', 'What is the intersection?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Sistemaning kesishmasini toping",
    'Найди пересечение системы',
    'Find the intersection of the system',
  ),
  audio: [
    A('mount',
      "Besh sistema. Har birida ikki tengsizlik kesishtiriladi.",
      'Пять систем. В каждой пересекаются два неравенства.',
      'Five systems. In each, two inequalities are intersected.'),
    A('why',
      "Kattaroq chegara chapdan, kichikroq chegara o'ngdan olinadi.",
      'Большая граница берётся слева, меньшая справа.',
      'The larger boundary is taken on the left, the smaller on the right.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar chegaralar taqqoslanib kesma topilgan.",
      'Все пять разобраны. Каждый раз границы сравнивались и находился отрезок.',
      'All five are done. Each time the boundaries were compared and a segment was found.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x > 2,   x < 6'}</Row>,
        ok: L("Ha. Ikkidan olti gacha oraliq kesishma.", 'Да. Промежуток от двух до шести это пересечение.', 'Yes. The range from two to six is the intersection.'),
        question: ASK_INTERSECT,
        items: [
          { id: 'a', right: true, label: '2 < x < 6' },
          { id: 'b', label: 'x < 6', hint: L("Bu faqat ikkinchi tengsizlik, birinchisi hisobga olinmagan.", 'Это только второе неравенство, первое не учтено.', 'This is only the second inequality; the first is not accounted for.') },
        ],
        solution: ['x > 2', 'x < 6', '2 < x < 6'],
      },
      {
        expr: <Row size="big" align="center">{'x ≥ 0,   x < 4'}</Row>,
        ok: L("Ha. Noldan to'rtgacha, nol kiradi, to'rt kirmaydi.", 'Да. От нуля до четырёх, нуль входит, четыре не входит.', 'Yes. From zero to four, zero is included, four is not.'),
        question: ASK_INTERSECT,
        items: [
          { id: 'a', right: true, label: '0 ≤ x < 4' },
          { id: 'b', label: '0 < x < 4', hint: L("Birinchi tengsizlik qat'iy emas, nol ham kirishi kerak.", 'Первое неравенство не строгое, нуль тоже должен входить.', 'The first inequality is not strict; zero should also be included.') },
        ],
        solution: ['x ≥ 0', 'x < 4', '0 ≤ x < 4'],
      },
      {
        expr: <Row size="big" align="center">{'x > 5,   x < 3'}</Row>,
        ok: L("Ha. Besh dan katta va uch dan kichik son yo'q, yechim yo'q.", 'Да. Числа больше пяти и меньше трёх одновременно нет, решений нет.', 'Yes. No number is both greater than five and less than three, so there are no solutions.'),
        question: ASK_INTERSECT,
        items: [
          { id: 'a', right: true, label: L("Yechim yo'q", 'Решений нет', 'No solutions') },
          { id: 'b', label: '3 < x < 5', hint: L("Bu chegaralar teskari, besh dan katta va uch dan kichik son bo'lolmaydi.", 'Границы перепутаны, число не может быть больше пяти и меньше трёх.', 'The boundaries are reversed; a number cannot be greater than five and less than three.') },
        ],
        solution: ['x > 5', 'x < 3', L("yechim yo'q", 'решений нет', 'no solutions')],
      },
      {
        expr: <Row size="big" align="center">{'x ≤ 7,   x ≤ 2'}</Row>,
        ok: L("Ha. Ikkalasi ham yuqori chegara, kichikrog'i, ikki, olinadi.", 'Да. Обе границы верхние, берётся меньшая, два.', 'Yes. Both are upper boundaries, the smaller one, two, is taken.'),
        question: ASK_INTERSECT,
        items: [
          { id: 'a', right: true, label: 'x ≤ 2' },
          { id: 'b', label: 'x ≤ 7', hint: L("Ettidan kichik hamma son ikkidan ham kichik bo'lishi shart emas, kichikrog'i olinadi.", 'Не всякое число меньше семи меньше и двух, берётся меньшая граница.', 'Not every number less than seven is also less than two; the smaller boundary is taken.') },
        ],
        solution: ['x ≤ 7', 'x ≤ 2', 'x ≤ 2'],
      },
      {
        expr: <Row size="big" align="center">{'x ≥ −3,   x ≥ 1'}</Row>,
        ok: L("Ha. Ikkalasi ham quyi chegara, kattarog'i, bir, olinadi.", 'Да. Обе границы нижние, берётся большая, один.', 'Yes. Both are lower boundaries, the larger one, one, is taken.'),
        question: ASK_INTERSECT,
        items: [
          { id: 'a', right: true, label: 'x ≥ 1' },
          { id: 'b', label: 'x ≥ −3', hint: L("Minus uchdan katta hamma son birdan ham katta bo'lishi shart emas, kattarog'i olinadi.", 'Не всякое число больше минус трёх больше и одного, берётся большая граница.', 'Not every number greater than negative three is also greater than one; the larger boundary is taken.') },
        ],
        solution: ['x ≥ −3', 'x ≥ 1', 'x ≥ 1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): sistema tuzib yechish.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Sistemani yechib, kesmani toping",
    'Реши систему и найди отрезок',
    'Solve the system and find the segment',
  ),
  audio: [
    A('mount',
      "Uch sistema. Har birida avval tengsizliklar yechiladi, keyin kesishtiriladi.",
      'Три системы. В каждой сначала решаются неравенства, затем берётся пересечение.',
      'Three systems. In each, the inequalities are solved first, then intersected.'),
    A('why',
      "Yechishdan keyin chegaralarni solishtiring.",
      'После решения сравни границы.',
      'After solving, compare the boundaries.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar yechish kesishma bilan tugagan.",
      'Все три разобраны. Каждый раз решение заканчивалось пересечением.',
      'All three are done. Each time solving ended with the intersection.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x + 2 > 5,   2x < 10'}</Row>,
        ok: L("Ha. Birinchisi x katta uch, ikkinchisi x kichik besh beradi.", 'Да. Первое даёт x больше трёх, второе x меньше пяти.', 'Yes. The first gives x greater than three, the second x less than five.'),
        question: ASK_INTERSECT,
        items: [
          { id: 'a', right: true, label: '3 < x < 5' },
          { id: 'b', label: '5 < x < 3', hint: L("Chegaralar teskari yozilgan, kichik chegara chapda turishi kerak.", 'Границы записаны наоборот, меньшая граница должна стоять слева.', 'The boundaries are written backwards; the smaller boundary should be on the left.') },
        ],
        solution: ['x + 2 > 5', 'x > 3', '2x < 10', 'x < 5', '3 < x < 5'],
      },
      {
        expr: <Row size="big" align="center">{'3x ≥ 6,   x − 1 ≤ 4'}</Row>,
        ok: L("Ha. Birinchisi x katta yoki teng ikki, ikkinchisi x kichik yoki teng besh beradi.", 'Да. Первое даёт x больше либо равно двум, второе x меньше либо равно пяти.', 'Yes. The first gives x greater than or equal to two, the second x less than or equal to five.'),
        question: ASK_INTERSECT,
        items: [
          { id: 'a', right: true, label: '2 ≤ x ≤ 5' },
          { id: 'b', label: '2 < x < 5', hint: L("Ikkala tengsizlik ham qat'iy emas, chegaralar kirishi kerak.", 'Оба неравенства нестрогие, границы должны входить.', 'Neither inequality is strict; the boundaries should be included.') },
        ],
        solution: ['3x ≥ 6', 'x ≥ 2', 'x − 1 ≤ 4', 'x ≤ 5', '2 ≤ x ≤ 5'],
      },
      {
        expr: <Row size="big" align="center">{'−2x < −8,   x < 10'}</Row>,
        ok: L("Ha. Birinchisi manfiyga bo'linib x katta to'rt, ikkinchisi x kichik o'n beradi.", 'Да. Первое при делении на отрицательное даёт x больше четырёх, второе x меньше десяти.', 'Yes. The first, dividing by a negative, gives x greater than four, the second x less than ten.'),
        question: ASK_INTERSECT,
        items: [
          { id: 'a', right: true, label: '4 < x < 10' },
          { id: 'b', label: 'x < 4', hint: L("Minus ikkiga bo'linganda ishora burilishi kerak edi, x katta to'rt chiqadi.", 'При делении на минус два знак должен был перевернуться, выходит x больше четырёх.', 'Dividing by negative two, the sign should have flipped, giving x greater than four.') },
        ],
        solution: ['−2x < −8', 'x > 4', 'x < 10', '4 < x < 10'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): kesishmani son bilan
// tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Kesishmani son bilan tekshirish",
    'Проверка пересечения числом',
    'Checking the intersection with a number',
  ),
  audio: [
    A('mount',
      "Uch taklif qilingan kesishma. Har birini o'ziga son qo'yib tekshiring.",
      'Предложены три пересечения. Каждое проверь, подставив число.',
      'Three proposed intersections. Check each by substituting a number.'),
    A('why',
      "Kesishmadan bir son olib, ikkala tengsizlikka ham qo'ying.",
      'Возьми число из пересечения и подставь в оба неравенства.',
      'Take a number from the intersection and substitute it into both inequalities.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar son ikkala tengsizlikni ham tekshirib berdi.",
      'Все три разобраны. Каждый раз число проверяло оба неравенства.',
      'All three are done. Each time a number checked both inequalities.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x > 0,   x < 8   →   2 < x < 8'}</Row>,
        ok: L("Yo'q. Ikki qo'yilsa, nolda katta to'g'ri, lekin ikkilangan chegara noto'g'ri, chap chegara nol bo'lishi kerak.", 'Нет. При подстановке двух больше нуля верно, но левая граница должна быть нулём.', 'No. Substituting two, greater than zero is true, but the left boundary should be zero.'),
        question: L("Bu kesishma to'g'rimi?", 'Верно ли это пересечение?', 'Is this intersection correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Chap chegara nol bo'lishi kerak, ikki emas.", 'Левая граница должна быть нулём, а не двойкой.', 'The left boundary should be zero, not two.') },
        ],
        solution: ['x > 0', 'x < 8', L('chap chegara nol', 'левая граница нуль', 'left boundary zero'), '0 < x < 8'],
      },
      {
        expr: <Row size="big" align="center">{'x ≤ 4,   x ≤ 9   →   x ≤ 4'}</Row>,
        ok: L("Ha. Uch qo'yilsa, ikkalasi ham to'g'ri, to'rt kichikrog'i, javob to'g'ri.", 'Да. При подстановке трёх оба верны, четыре меньше, ответ верен.', 'Yes. Substituting three, both hold, four is smaller, the answer is correct.'),
        question: L("Bu kesishma to'g'rimi?", 'Верно ли это пересечение?', 'Is this intersection correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("To'rt to'qqizdan kichikroq, shuning uchun kichikrog'i, to'rt, to'g'ri chegara.", 'Четыре меньше девяти, поэтому меньшая граница, четыре, верна.', 'Four is smaller than nine, so the smaller boundary, four, is correct.') },
        ],
        solution: ['x ≤ 4', 'x ≤ 9', L("to'g'ri", 'верно', 'correct')],
      },
      {
        expr: <Row size="big" align="center">{'x > 6,   x < 2   →   2 < x < 6'}</Row>,
        ok: L("Yo'q. Oltidan katta va ikkidan kichik son bo'lolmaydi, chegaralar chalkashtirilgan.", 'Нет. Число не может быть больше шести и меньше двух, границы перепутаны.', 'No. A number cannot be greater than six and less than two; the boundaries are confused.'),
        question: L("Bu kesishma to'g'rimi?", 'Верно ли это пересечение?', 'Is this intersection correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Bunday sistemaning yechimi yo'q, kesma yozilmaydi.", 'У такой системы нет решений, отрезок не пишется.', 'Such a system has no solutions; no segment should be written.') },
        ],
        solution: ['x > 6', 'x < 2', L("yechim yo'q", 'решений нет', 'no solutions')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): kesishtirish o'rniga
// birlashtirilgan (З55).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Kesishtirilgan yoki birlashtirilganmi",
    'Пересекли или объединили',
    'Intersected or united',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham kesishtirish o'rniga birlashtirilgan.",
      'Два задания. В обоих объединение сделано вместо пересечения.',
      'Two tasks. In both, union was made instead of intersection.'),
    A('why',
      "Sistemaning yechimi ikkalasiga ham mos son, faqat bittasiga emas.",
      'Решение системы это число, подходящее обоим, а не только одному.',
      'A system solution is a number fitting both, not just one.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Sistema har doim kesishma bilan yechiladi.",
      'Оба разобраны. Система всегда решается пересечением.',
      'Both are done. A system is always solved by intersection.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x > 4,   x < 1   →   x > 4  ∪  x < 1'}</Row>,
        ok: L("Ha. Bu birlashtirish, sistema esa kesishmani talab qiladi, va bu holda yechim yo'q.", 'Да. Это объединение, а система требует пересечения, и в этом случае решений нет.', 'Yes. This is a union, but the system requires an intersection, and in this case there are no solutions.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Birlashtirilgan, kesishtirilmagan", 'Объединено, а не пересечено', 'United, not intersected') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, sistema kesishmani talab qiladi.", 'Это и есть показанная ошибка, система требует пересечения.', 'This is the very mistake shown; the system requires an intersection.') },
        ],
        solution: ['x > 4', 'x < 1', L("yechim yo'q", 'решений нет', 'no solutions')],
      },
      {
        expr: <Row size="big" align="center">{'x ≥ 0,   x ≤ 10   →   x ≥ 0  ∪  x ≤ 10'}</Row>,
        ok: L("Ha. Bu birlashtirish har qanday sonni beradi, kesishma esa nol dan o'n gacha.", 'Да. Это объединение даёт любое число, а пересечение это от нуля до десяти.', 'Yes. This union gives any number, while the intersection is from zero to ten.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Birlashtirilgan, kesishtirilmagan", 'Объединено, а не пересечено', 'United, not intersected') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, to'g'ri javob nol dan o'n gacha kesma.", 'Это и есть показанная ошибка, верный ответ это отрезок от нуля до десяти.', 'This is the very mistake shown; the correct answer is the segment from zero to ten.') },
        ],
        solution: ['x ≥ 0', 'x ≤ 10', '0 ≤ x ≤ 10'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH (1-darsning `fill`): sistemani qadamlab yechish.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Sistemani qadamlab yeching",
    'Реши систему по шагам',
    'Solve the system step by step',
  ),
  audio: [
    A('mount',
      "Sistema berilgan. Har bir tengsizlikni yechib, kesishmani yozing.",
      'Дана система. Реши каждое неравенство и запиши пересечение.',
      'A system is given. Solve each inequality and write the intersection.'),
    A('why',
      "Chegaralarni solishtirib, kichik va katta orasidagi kesmani toping.",
      'Сравни границы и найди отрезок между меньшей и большей.',
      'Compare the boundaries and find the segment between the smaller and the larger.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar ikki chegara kesmani bergan.",
      'Все три заполнены. Каждый раз две границы давали отрезок.',
      'All three are filled. Each time two boundaries gave the segment.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['3', '9'],
      lines: [
        [{ t: 'x + 1 > 4,   x − 2 < 7   →   x > ' }, { slot: '3' }, { t: ',   x < ' }, { slot: '9' }],
      ],
    },
    tasks: [
      {
        chips: ['5', '12'],
        lines: [
          [{ t: '2x > 10,   x + 3 < 15   →   x > ' }, { slot: '5' }, { t: ',   x < ' }, { slot: '12' }],
        ],
      },
      {
        chips: ['−1', '6'],
        lines: [
          [{ t: '3x ≥ −3,   2x ≤ 12   →   x ≥ ' }, { slot: '−1' }, { t: ',   x ≤ ' }, { slot: '6' }],
        ],
      },
      {
        chips: ['2', '8'],
        lines: [
          [{ t: '−x < −2,   x − 4 < 4   →   x > ' }, { slot: '2' }, { t: ',   x < ' }, { slot: '8' }],
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
    "Sistema bo'yicha to'rt savol",
    'Четыре вопроса о системе',
    'Four questions about the system',
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
        id: 'q1', tag: 'З55',
        ask: L('x > 3, x < 9 sistemasining kesishmasi qaysi?', 'Каково пересечение системы x > 3, x < 9?', 'What is the intersection of the system x > 3, x < 9?'),
        options: [
          { id: 'ok', right: true, label: '3 < x < 9' },
          { id: 'union', label: 'x > 3 yoki x < 9' },
          { id: 'wrong', label: 'x < 3' },
          { id: 'wrong2', label: 'x > 9' },
        ],
        hint: L("Kesishma ikkalasiga ham mos sonlarni oladi.", 'Пересечение берёт числа, подходящие обоим.', 'The intersection takes numbers that fit both.'),
        ok: L("To'g'ri, uch va to'qqiz orasidagi hamma son.", 'Верно, все числа между тремя и девятью.', 'Correct, all numbers between three and nine.'),
      },
      {
        id: 'q2', tag: 'З54',
        ask: L('x ≥ 2, x < 6 sistemasida x = 2 yechimga kiradimi?', 'Входит ли x = 2 в решение системы x ≥ 2, x < 6?', 'Is x = 2 part of the solution of the system x ≥ 2, x < 6?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Birinchi tengsizlik qat'iy emas, teng holat ham kiradi.", 'Первое неравенство нестрогое, равенство тоже входит.', 'The first inequality is not strict; equality is also included.'),
        ok: L("To'g'ri, ikki ham yechimga kiradi.", 'Верно, два тоже входит в решение.', 'Correct, two is also part of the solution.'),
      },
      {
        id: 'q3', tag: 'З55',
        ask: L('x > 8, x < 3 sistemasining yechimi qanday?', 'Каково решение системы x > 8, x < 3?', 'What is the solution of the system x > 8, x < 3?'),
        options: [
          { id: 'ok', right: true, label: L("Yechim yo'q", 'Решений нет', 'No solutions') },
          { id: 'wrong', label: '3 < x < 8' },
          { id: 'wrong2', label: 'x > 8' },
          { id: 'wrong3', label: 'x < 3' },
        ],
        hint: L("Sakkizdan katta va uchdan kichik son bo'lolmaydi.", 'Число не может быть больше восьми и меньше трёх.', 'A number cannot be greater than eight and less than three.'),
        ok: L("To'g'ri, bunday son yo'q.", 'Верно, такого числа нет.', 'Correct, no such number exists.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('2 < x < 6 yechimida x = 4 tengsizliklarni to\'g\'ri qiladimi?', 'Делает ли x = 4 верными неравенства 2 < x < 6?', 'Does x = 4 make the inequalities 2 < x < 6 true?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("To'rt ikkidan katta va oltidan kichik.", 'Четыре больше двух и меньше шести.', 'Four is greater than two and less than six.'),
        ok: L("To'g'ri, ikkalasi ham bajariladi.", 'Верно, оба выполняются.', 'Correct, both hold.'),
      },
      {
        id: 'q5', tag: 'З55',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "x > 1, x ≤ 7 sistemasini yechib, kesmani yozing.",
            'Реши систему x > 1, x ≤ 7 и запиши отрезок.',
            'Solve the system x > 1, x ≤ 7 and write the segment.',
          ),
          lines: [
            [{ t: '1 < x ' }, { slot: '≤' }, { t: ' 7' }],
          ],
          tiles: [
            { id: 't1', v: '≤', x: 12, y: 12 },
            { id: 't2', v: '<', x: 70, y: 14 },
            { id: 't3', v: '≥', x: 40, y: 50 },
          ],
          hint: L(
            "Ikkinchi tengsizlik qat'iy emas, teng holat kiradi.",
            'Второе неравенство нестрогое, равенство входит.',
            'The second inequality is not strict; equality is included.',
          ),
          doneNote: L(
            "Yig'ildi. O'ng chegara yopiq, chap chegara ochiq qoladi.",
            'Собрано. Правая граница закрыта, левая остаётся открытой.',
            'Assembled. The right boundary is closed, the left stays open.',
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
    "Sistema yechimi ikki nurning kesishmasi",
    'Решение системы — пересечение двух лучей',
    'A system solution is the intersection of two rays',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. X katta bir, x kichik besh, javobi bir dan besh gacha kesma.",
      'С урока остаётся одна запись. x больше одного, x меньше пяти, ответ это отрезок от одного до пяти.',
      'One record stays with you. x greater than one, x less than five, the answer is the segment from one to five.'),
    A('s1',
      "Bugun uch narsa qilindi. Har bir tengsizlikni alohida yechdingiz, ularni to'g'ri chiziqda kesishtirdingiz va birlashtirish bilan farqini ko'rdingiz.",
      'Сегодня сделано три вещи. Ты решил каждое неравенство отдельно, пересёк их на числовой прямой и увидел разницу с объединением.',
      'Three things are done today. You solved each inequality separately, intersected them on the number line, and saw the difference from a union.'),
    A('s2',
      "Keyingi darsda sonli oraliqlar va ularning belgilanishi. Kesma, interval va nurga nom qo'yasiz.",
      'В следующем уроке числовые промежутки и их обозначение. Ты назовёшь отрезок, интервал и луч.',
      'The next lesson covers number intervals and their notation. You will name the segment, interval, and ray.',
    ),
  ],
  props: {
    mark: 'x > 1,   x < 5   →   1 < x < 5',
    markNote: L(
      "ikki nur kesishib kesma qoldi",
      'два луча пересеклись, остался отрезок',
      'two rays intersected, leaving a segment',
    ),
    lines: [
      L(
        "sistema yechimi har ikki tengsizlikka birdan mos son",
        'Решение системы — число, подходящее обоим неравенствам сразу',
        'A system solution is a number fitting both inequalities at once',
      ),
      L(
        "yechimlar to'g'ri chiziqda kesishtiriladi, birlashtirilmaydi",
        'Решения пересекаются на числовой прямой, а не объединяются',
        'Solutions are intersected on the number line, not united',
      ),
      L(
        "kattaroq chegara chapdan, kichikroq chegara o'ngdan olinadi",
        'Большая граница берётся слева, меньшая справа',
        'The larger boundary is taken on the left, the smaller on the right',
      ),
    ],
    bridge: L(
      "Keyingi dars: sonli oraliqlar va ularning belgilanishi",
      'Следующий урок: числовые промежутки и их обозначение',
      'Next lesson: number intervals and their notation',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — IKKI NURNING KESISHMASI (`twosides`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З54', 'З55', 'З55',
    'З55', 'З55', 'З55', 'З55', 'З55',
    'З16', 'З55', 'З55', null, null,
  ],
  mechanic: { at: 5, tool: 'twosides', kind: 'intersect' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
