// ============================================================================
// 8-sinf, Dars 20. KASR-RATSIONAL TENGLAMALAR.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `twosides.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `twosides`: maxrajlarga ko'paytiriladi,
// kvadrat tenglama chiqadi, oxirgi qadamda ODZ chetlatgan ildiz chiziqdan
// yo'qoladi.
//
// DARSNING UCH ISHI:
//   1) kasr-ratsional tenglama yechilishidan oldin ODZ topiladi — bu
//      1-6-darslardagi ODZ ishi, endi tenglamaga qo'llanadi;
//   2) maxrajlarga ko'paytirilib, kvadrat (yoki chiziqli) tenglama olinadi;
//   3) topilgan ildizlar ODZ bilan solishtiriladi — ODZ dan chetga
//      chiqqan ildiz POSTORONNIY (begona) ildiz deyiladi va rad etiladi.
//
// ENG NOZIK JOY. Maxrajlarga ko'paytirish yangi, KATTAROQ tenglama beradi,
// va bu tenglama asl tenglamadan KO'PROQ ildizga ega bo'lishi mumkin —
// aynan o'sha nuqtada, maxraj nolga aylangan joyda. Bu darslikda YO'Q,
// lekin kurs ro'yxatida ALLAQACHON turgan З3 adashishi shu haqida
// (Б3, 20-dars uchun ro'yxatda edi).
//
// MANBA. Bu mavzu uchun o'zbek darsligida alohida paragraf yo'q (III bob
// faqat kvadrat tenglamalarga bag'ishlangan). Qoida darsda umumlashtirildi:
// ODZ usuli — 1-6-darslar (Б1), kvadrat tenglama yechish — 15-19-darslar
// (Б3).
//
// ADASHISHLAR: hammasi qaytadi, yangisi yo'q:
//   З3  — begona ildiz deb qabul qilindi (kurs ro'yxatida
//         allaqachon turgan tag, Б3, 20-dars uchun);
//   З2  — ODZ kuzatuvi yo'qotildi (Б1 dan qaytadi, endi tenglamada);
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
  id: 'alg-8-20',
  n: 20,
  row: 22,
  block: 'Б3',
  topic: L(
    'Kasr-ratsional tenglamalar',
    'Дробно-рациональные уравнения',
    'Fractional rational equations',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "kasr-ratsional tenglama yechilishidan oldin ODZ topiladi",
    'Прежде чем решать дробно-рациональное уравнение, находят ОДЗ',
    'Before solving a fractional rational equation, the domain restriction is found',
  ),
  L(
    "maxrajlarga ko'paytirilganda yangi tenglama asl tenglamadan ko'proq ildizga ega bo'lishi mumkin",
    'После умножения на знаменатели новое уравнение может иметь больше корней, чем исходное',
    'After multiplying by the denominators, the new equation may have more roots than the original',
  ),
  L(
    "ODZ dan chetga chiqqan ildiz begona ildiz deyiladi va javobga kiritilmaydi",
    'Корень, выходящий за ОДЗ, называется посторонним и в ответ не включается',
    'A root that falls outside the domain is called extraneous and is not included in the answer',
  ),
]

export const MISS = {
  'З2': {
    what: L(
      "ODZ kuzatuvi yo'qotildi",
      'потеряно отслеживание ОДЗ',
      'tracking of the domain restriction was lost',
    ),
    wrong: null,
    at: 3,
  },
  'З3': {
    what: L(
      "begona ildiz deb qabul qilindi, chunki u maxrajni nolga aylantiradi",
      'посторонний корень принят за корень, хотя он обнуляет знаменатель',
      'an extraneous root was accepted as a root, even though it zeroes a denominator',
    ),
    wrong: '1',
    at: 5,
  },
  'З16': {
    what: L(
      'javob son bilan tekshirilmadi',
      'ответ не проверен числом',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 11,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: ikkita ildiz taklif qilingan, ikkalasi ham to'g'rimi.
// Yakun: faqat bittasi, ikkinchisi ODZ dan chetda.
// ============================================================
const SC_BOTH = L('IKKALASI HAM TO\'G\'RIMI', 'ОБА ЛИ ВЕРНЫ', 'ARE BOTH CORRECT')

const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Tenglama ikkita ildiz berdi",
      'Уравнение дало два корня',
      'The equation gave two roots',
    )}>
      <text x="200" y="55" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
        fill={T.ink}>{'x/(x−1) + 1/(x+1) = 2/(x²−1)'}</text>

      <text x="130" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>x = 1</text>
      <text x="270" y="88" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'x = −3'}</text>

      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="88" r="15" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="94" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="126" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_BOTH)}</text>
    </SceneBand>
  )
}

const FinalScene = () => {
  const t = useT()
  return (
    <SceneBand kind="final" label={L(
      "Faqat minus uch, bir ODZ dan chetda",
      'Только минус три, единица за пределами ОДЗ',
      'Only negative three, one falls outside the domain',
    )}>
      <text x="200" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink}>{'x/(x−1) + 1/(x+1) = 2/(x²−1)'}</text>
      <g className="g8-seat" style={{ '--d': '1500ms' }}>
        <line x1="60" y1="65" x2="340" y2="65" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <circle cx="150" cy="65" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
        <text x="150" y="80" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>1</text>
        <circle cx="260" cy="65" r="4.4" fill={T.ok}/>
        <text x="260" y="80" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>{'−3'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '2000ms' }}>
        <text x="150" y="94" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="7.5" fill={T.tip}>ODZ</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('IKKALASI HAM TO\'G\'RIMI', 'ОБА ЛИ ВЕРНЫ', 'ARE BOTH CORRECT'),
  title: L(
    "Tenglama x va minus 3 ildizlarni berdi. Ikkalasi ham to'g'rimi",
    'Уравнение дало корни x и минус три. Оба ли верны',
    'The equation gave roots one and negative three. Are both correct',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Tenglamada maxrajda iks bor. Yechganda ikkita son chiqdi.",
      'В уравнении в знаменателе стоит икс. При решении вышли два числа.',
      'The equation has x in the denominator. Solving it gave two numbers.'),
    A('why',
      "Taxmin qiling, ikkalasi ham javob bo'la oladimi.",
      'Предположи, могут ли оба быть ответом.',
      'Predict whether both can be the answer.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, ikkalasi ham javobmi?",
      'Как думаешь, оба являются ответом?',
      'Do you think both are the answer?',
    ),
    items: [
      { id: 'both', show: L('Ha, ikkalasi ham', 'Да, оба', 'Yes, both') },
      { id: 'one', show: L('Yo\'q, faqat bittasi', 'Нет, только один', 'No, only one') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. ODZ topish (1-6-darslardan). Shu tayanch 4, 9 va
// 12-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Maxraj qachon nolga aylanadi",
    'Когда знаменатель обращается в нуль',
    'When the denominator becomes zero',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida ODZ to'g'ri topilgan.",
      'Четыре записи. Только в одной ОДЗ найдена верно.',
      'Four records. Only one has the domain found correctly.'),
    A('why',
      "Maxrajni nolga tenglashtirib, iksni topamiz.",
      'Приравняв знаменатель к нулю, находим икс.',
      'Setting the denominator to zero, we find x.'),
  ],
  props: {
    ask: L(
      "1 bo'lingan (x − 5) uchun ODZ qaysi?",
      'Какова ОДЗ для 1, делённого на (x − 5)?',
      'What is the domain for 1 divided by (x − 5)?',
    ),
    items: [
      { id: 'right', show: 'x ≠ 5', right: true },
      {
        id: 'signErr', show: 'x ≠ −5',
        hint: L("Maxraj nolga teng bo'lganda x besh, minus besh emas.", 'Когда знаменатель равен нулю, x равен пяти, а не минус пяти.', 'When the denominator equals zero, x is five, not negative five.'),
      },
      {
        id: 'noExclude', show: L('Cheklov yo\'q', 'Нет ограничений', 'No restriction'),
        hint: L("x besh bo'lganda maxraj nolga aylanadi, cheklov bor.", 'При x равном пяти знаменатель обращается в нуль, ограничение есть.', 'When x equals five, the denominator becomes zero, so there is a restriction.'),
      },
      {
        id: 'wrongVar', show: 'x ≠ 0',
        hint: L("Nol emas, besh maxrajni yo'qqa chiqaradi.", 'Не нуль, а пять обращает знаменатель в нуль.', 'Not zero, but five zeroes the denominator.'),
      },
    ],
    after: L(
      "To'g'ri. Maxraj nolga teng bo'lmasin, demak x besh emas.",
      'Верно. Знаменатель не равен нулю, значит x не равен пяти.',
      'Correct. The denominator is not zero, so x is not five.',
    ),
  },
}

// ============================================================
// EKRAN 3. X NI BURANG (1-darsning `steppers`). Natija — 1 bo'lingan
// (x − 2) ga. x ikkiga tushganda qiymat yo'qoladi — ODZ ning o'zi (З2).
// ============================================================
const S3 = {
  eyebrow: L('X NI BURANG', 'КРУТИ X', 'TURN X'),
  title: L(
    "1 bo'lingan (x minus 2) ga",
    'Единица, делённая на (x минус два)',
    'One divided by (x minus two)',
  ),
  audio: [
    A('mount',
      "x ikkidan uzoqlashsa, kasr hisoblanadi. x ikkiga yaqinlashsa, nima bo'ladi?",
      'Когда x далёк от двух, дробь считается. Что будет, если x приблизится к двум?',
      'When x is far from two, the fraction computes. What happens as x nears two?'),
    A('why',
      "Ikki maqsad beriladi. x ning turli qiymatlarida natijani toping.",
      'Даны две цели. Находи результат при разных значениях x.',
      'Two targets are given. Find the result at different values of x.'),
    A('why',
      "Oxirida x ni ikkiga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти x до двух и посмотри, что будет.',
      'At the end bring x down to two and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'x', label: L('x ning qiymati', 'значение x', 'the value of x'),
        start: 7, min: 2, max: 9, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 2 ? null : Math.round((1 / (v[0] - 2)) * 100) / 100),
    resultLabel: L('1 : (x − 2)', '1 : (x − 2)', '1 : (x − 2)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "x hali ikkiga tushmasin, avval maqsadlarni oling.",
      'x пока не опускай до двух, сначала возьми цели.',
      'Do not bring x down to two yet, take the targets first.',
    ),
    goals: [
      {
        value: 0.25,
        ask: L("Natija 0,25 ga teng bo'lsin", 'Пусть результат будет равен 0,25', 'Make the result equal 0.25'),
        after: L(
          "Nol butun yigirma besh. x oltiga teng bo'lganda maxraj to'rt bo'ladi.",
          'Ноль целых двадцать пять. При x равном шести знаменатель равен четырём.',
          'Zero point two five. With x equal to six, the denominator is four.',
        ),
      },
      {
        value: 1,
        ask: L("Endi natija 1 ga teng bo'lsin", 'Теперь пусть результат будет равен 1', 'Now make the result equal 1'),
        after: L(
          "Bir. x uchga teng bo'lganda maxraj bir bo'ladi.",
          'Один. При x равном трём знаменатель равен единице.',
          'One. With x equal to three, the denominator is one.',
        ),
      },
    ],
    ask: L("Natija 0,25 ga teng bo'lsin", 'Пусть результат будет равен 0,25', 'Make the result equal 0.25'),
    ask2: L("Endi x ni ikkiga tushiring", 'Теперь опусти x до двух', 'Now bring x down to two'),
    broke: L(
      "x ikkiga teng bo'lsa, maxraj nolga aylanadi, bo'linish yo'q. Shuning uchun x ikkiga teng bo'lishi mumkin emas, bu ODZ chegarasi.",
      'Если x равно двум, знаменатель обращается в нуль, а деления не существует. Поэтому x не может равняться двум, это граница ОДЗ.',
      'If x equals two, the denominator becomes zero, and division by it has no value. That is why x cannot equal two, and this is the boundary of the domain.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI ODZ TO'G'RI (1-darsning `pick`).
// ============================================================
const S4 = {
  eyebrow: L('ODZ NI TOPAMIZ', 'НАХОДИМ ОДЗ', 'FINDING THE DOMAIN'),
  title: L(
    "x/(x−1) + 1/(x+1) = 2/(x²−1) uchun ODZ",
    'ОДЗ для x/(x−1) + 1/(x+1) = 2/(x²−1)',
    'The domain for x/(x−1) + 1/(x+1) = 2/(x²−1)',
  ),
  audio: [
    A('mount',
      "Uch maxraj bor. Har birini nolga tenglashtirib tekshiramiz.",
      'Есть три знаменателя. Проверяем каждый, приравняв к нулю.',
      'There are three denominators. We check each by setting it to zero.'),
    A('why',
      "Uchinchi maxraj iks kvadrat minus bir, u ham bir va minus bir da nolga aylanadi.",
      'Третий знаменатель икс квадрат минус один, он тоже обращается в нуль при одном и минус одном.',
      'The third denominator is x squared minus one, and it too becomes zero at one and negative one.'),
  ],
  props: {
    ask: L(
      "ODZ qaysi to'g'ri?",
      'Какая ОДЗ верна?',
      'Which domain is correct?',
    ),
    items: [
      { id: 'right', show: 'x ≠ 1,  x ≠ −1', right: true, name: L("uchta maxraj ham shu ikkisida nolga aylanadi", 'все три знаменателя обращаются в нуль в этих двух точках', 'all three denominators vanish at these two points') },
      {
        id: 'onlyOne', show: 'x ≠ 1',
        hint: L("(x+1) maxraji ham bor, u minus birda nolga aylanadi.", 'Есть и знаменатель (x+1), он обращается в нуль при минус одном.', 'There is also the denominator (x+1), which vanishes at negative one.'),
      },
      {
        id: 'wrongSign', show: 'x ≠ −1,  x ≠ 1',
        hint: L("Bu ro'yxat aslida to'g'ri, lekin belgilar tartibi chalkashtirilmasin, ikkalasi ham kerak.", 'Этот список на деле верен, лишь порядок не должен путать, нужны оба значения.', 'This list is actually fine, only do not let the order confuse you, both values are needed.'),
      },
      {
        id: 'zero', show: 'x ≠ 0',
        hint: L("Nol hech bir maxrajni yo'qqa chiqarmaydi.", 'Нуль не обращает в нуль ни один из знаменателей.', 'Zero does not zero out any of the denominators.'),
      },
    ],
    after: L(
      "To'g'ri. Uchinchi maxraj birinchi ikkisining ko'paytmasi, shuning uchun bitta va boshqa ikkitasi bir xil.",
      'Верно. Третий знаменатель, произведение первых двух, поэтому ограничения совпадают.',
      'Correct. The third denominator is the product of the first two, so the restrictions coincide.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — MAXRAJLARGA KO'PAYTIRISH (`twosides`).
// ODZ dan chetga chiqqan ildiz chiziqdan YO'QOLADI.
// ============================================================
const S5 = {
  eyebrow: L('YECHAMIZ', 'РЕШАЕМ', 'WE SOLVE IT'),
  title: L(
    "X/(x−1) plyus 1/(x+1) teng 2/(x kvadrat−1) ni yeching",
    'Решите x/(x−1) плюс 1/(x+1) равно 2/(x в квадрате−1)',
    'Solve x/(x−1) plus 1/(x+1) equals 2/(x squared−1)',
  ),
  audio: [
    A('mount',
      "ODZ bo'yicha x bir va minus birga teng emas. Endi maxrajlarga ko'paytiramiz.",
      'По ОДЗ x не равен одному и минус одному. Теперь умножаем на знаменатели.',
      'By the domain, x is not one and not negative one. Now we multiply by the denominators.'),
    A('why',
      "Amal ikkala tomonga birdan qo'llanadi. Qadamni tanlang.",
      'Действие применяется сразу к обеим частям. Выбери шаг.',
      'The action applies to both sides at once. Choose the step.'),
    W('a4',
      "Ikki ildiz chiqdi, lekin ulardan bittasi ODZ dan chetda.",
      'Вышло два корня, но один из них за пределами ОДЗ.',
      'Two roots came out, but one of them falls outside the domain.'),
  ],
  props: {
    from: -6,
    to: 6,
    start: { left: 'x/(x−1) + 1/(x+1)', rel: '=', right: '2/(x²−1)', set: null },
    steps: [
      {
        ask: L('Nima qilamiz?', 'Что делаем?', 'What do we do?'),
        actions: [
          {
            id: 'clear', right: true,
            label: L("Ikki tomonni (x−1)(x+1) ga ko'paytirish", 'Умножить обе части на (x−1)(x+1)', 'Multiply both sides by (x−1)(x+1)'),
            to: { left: 'x(x+1) + (x−1)', rel: '=', right: '2' },
          },
          {
            id: 'clearWrong',
            label: L("Faqat chap tomonni ko'paytirish", 'Умножить только левую часть', 'Multiply only the left side'),
            hint: L("Amal ikkala tomonga birdan qo'llanadi, faqat bittasiga emas.", 'Действие применяется сразу к обеим частям, а не только к одной.', 'The action applies to both sides at once, not only to one.'),
          },
        ],
      },
      {
        ask: L('Endi nima qilamiz?', 'Что теперь?', 'And now?'),
        actions: [
          {
            id: 'simplify', right: true,
            label: L("Qavslarni ochib, bir tomonga o'tkazish", 'Раскрыть скобки и перенести в одну часть', 'Expand the brackets and move everything to one side'),
            to: { left: 'x² + 2x − 3', rel: '=', right: '0' },
          },
          {
            id: 'keepAsIs',
            label: L("O'zgarishsiz qoldirish", 'Оставить без изменений', 'Leave it unchanged'),
            hint: L("Qavslar ochilmasa, ildizlarni topib bo'lmaydi.", 'Не раскрыв скобки, корни не найти.', 'Without expanding the brackets, the roots cannot be found.'),
          },
        ],
      },
      {
        ask: L("Ildizlarni tanlash usuli bilan topamiz. Qaysi juftlik to'g'ri?", 'Найдём корни подбором. Какая пара верна?', 'Let us find the roots by selection. Which pair is correct?'),
        actions: [
          {
            id: 'pair', right: true,
            label: L("Yig'indisi minus 2, ko'paytmasi minus 3", 'Сумма минус 2, произведение минус 3', 'Sum negative 2, product negative 3'),
            to: { left: '(x−1)(x+3)', rel: '=', right: '0' },
            set: { points: [1, -3] },
          },
          {
            id: 'pairWrong',
            label: L("Yig'indisi 2, ko'paytmasi 3", 'Сумма 2, произведение 3', 'Sum 2, product 3'),
            hint: L("Ikkinchi koeffitsiyent ikki, yig'indi esa unga qarama-qarshi, minus ikki.", 'Второй коэффициент два, а сумма противоположна ему, минус два.', 'The second coefficient is two, and the sum is its opposite, negative two.'),
          },
        ],
      },
      {
        ask: L("Oxirgi qadam. ODZ ni tekshiramiz.", 'Последний шаг. Проверяем ОДЗ.', 'The last step. We check the domain.'),
        actions: [
          {
            id: 'checkOdz', right: true,
            label: L("x = 1 ni ODZ dan chetga chiqarish", 'Исключить x = 1 по ОДЗ', 'Exclude x = 1 by the domain'),
            to: { left: 'x', rel: '=', right: '−3' },
            set: { point: -3 },
            note: L(
              "Bir ODZ dan chetda, u begona ildiz. Javob faqat minus uch.",
              'Единица за пределами ОДЗ, это посторонний корень. Ответ только минус три.',
              'One falls outside the domain, it is an extraneous root. The answer is only negative three.',
            ),
          },
          {
            id: 'keepBoth',
            label: L("Ikkalasini ham javobga qo'yish", 'Оставить оба в ответе', 'Keep both in the answer'),
            hint: L("Bir ODZ ni buzadi, maxrajda (x−1) bor, u nolga aylanadi.", 'Единица нарушает ОДЗ, в знаменателе есть (x−1), он обращается в нуль.', 'One violates the domain, the denominator holds (x−1), which becomes zero.'),
          },
        ],
      },
    ],
    note: L(
      "Faqat minus uch javob, bir esa begona ildiz.",
      'Только минус три является ответом, единица — посторонний корень.',
      'Only negative three is the answer, one is an extraneous root.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): begona ildizni topish —
// ODZ bilan solishtirish yoki asl tenglamaga qo'yib tekshirish.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Begona ildizni ikki yo'l bilan topish",
    'Найти посторонний корень двумя способами',
    'Finding the extraneous root two ways',
  ),
  audio: [
    A('mount',
      "Ikkita nomzod bor. Ikki yo'l ham bir xil javob beradi.",
      'Есть два кандидата. Оба пути дают один ответ.',
      'There are two candidates. Both ways give the same answer.'),
    W('w2',
      "Birinchi yo'lda nomzodlar ODZ bilan solishtiriladi.",
      'В первом пути кандидаты сравниваются с ОДЗ.',
      'In the first way, the candidates are compared with the domain.'),
    W('w4',
      "Ikkinchi yo'lda nomzodlar asl, kasrli tenglamaga qo'yiladi.",
      'Во втором пути кандидаты подставляются в исходное, дробное уравнение.',
      'In the second way, the candidates are substituted into the original, fractional equation.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L("1-USUL — ODZ BILAN SOLISHTIRISH", 'СПОСОБ 1 — СРАВНИТЬ С ОДЗ', 'METHOD 1 — COMPARE WITH THE DOMAIN'),
        lead: L(
          "Nomzodlar: bir va minus uch. ODZ: bir va minus birdan boshqa",
          'Кандидаты: один и минус три. ОДЗ: кроме одного и минус одного',
          'Candidates: one and negative three. Domain: other than one and negative one',
        ),
        rows: [
          { text: L("x = 1 — ODZ da yo'q", 'x = 1 — вне ОДЗ', 'x = 1 — outside the domain'), tone: 'no' },
          { text: L('x = −3 — ODZ da bor', 'x = −3 — входит в ОДЗ', 'x = −3 — inside the domain'), tone: 'ok' },
        ],
      },
      {
        name: L("2-USUL — ASL TENGLAMAGA QO'YISH", 'СПОСОБ 2 — ПОДСТАВИТЬ В ИСХОДНОЕ', 'METHOD 2 — SUBSTITUTE INTO THE ORIGINAL'),
        lead: L(
          "x = 1 qo'yilsa maxraj nolga aylanadi, hisoblab bo'lmaydi",
          'При x = 1 знаменатель обращается в нуль, посчитать нельзя',
          'At x = 1 the denominator becomes zero, it cannot be computed',
        ),
        rows: [
          { text: L('x = 1: maxraj nol, hisoblanmaydi', 'x = 1: знаменатель нуль, не вычисляется', 'x = 1: denominator is zero, cannot be computed'), tone: 'no' },
          { text: L("x = −3: 1/4 = 1/4, to'g'ri", 'x = −3: 1/4 = 1/4, верно', 'x = −3: 1/4 = 1/4, correct'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL XULOSA BERDI', 'ОБА ДАЛИ ОДИН ВЫВОД', 'BOTH GAVE THE SAME CONCLUSION'),
        lead: L(
          "x = 1 rad etiladi, javob faqat x = minus uch",
          'x = 1 отвергается, ответ только x = минус три',
          'x = 1 is rejected, the answer is only x = negative three',
        ),
        rows: [{ text: 'x = −3', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): maxrajlarga ko'paytirish
// nima uchun ortiqcha ildiz qo'shib qo'yadi.
// ============================================================
const S7 = {
  eyebrow: L('QAYERDAN ORTIQCHA ILDIZ CHIQADI', 'ОТКУДА БЕРЁТСЯ ЛИШНИЙ КОРЕНЬ', 'WHERE THE EXTRA ROOT COMES FROM'),
  title: L(
    "Maxrajlarga ko'paytirish nima uchun xavfli",
    'Почему умножение на знаменатели опасно',
    'Why multiplying by the denominators is risky',
  ),
  audio: [
    A('mount',
      "Ikki tomonni bir ifodaga ko'paytirish faqat u nolga teng bo'lmaganda haqiqiy tenglikni saqlaydi.",
      'Умножение обеих частей на выражение сохраняет истинное равенство только тогда, когда оно не равно нулю.',
      'Multiplying both sides by an expression keeps the equality true only when that expression is not zero.'),
    W('p2',
      "Agar shu ifoda nolga teng bo'lsa, ikki tomon ham nolga aylanadi, va bu HAR QANDAY x da to'g'ri bo'lib qoladi.",
      'Если это выражение равно нулю, обе части обращаются в нуль, и это оказывается верным при ЛЮБОМ x.',
      'If that expression is zero, both sides become zero, and that turns out true for ANY x.'),
    W('p4',
      "Shuning uchun yangi tenglama maxrajni yo'qqa chiqargan nuqtani ham yechim sifatida noto'g'ri taklif qiladi.",
      'Поэтому новое уравнение неверно предлагает точку, обнуляющую знаменатель, тоже как решение.',
      'That is why the new equation wrongly offers the point that zeroes the denominator as a solution too.',
    ),
  ],
  props: {
    tokens: [
      { t: 'x/(x−1) + 1/(x+1) = 2/(x²−1)', id: 'orig' },
      { t: '  →  ', id: 'arrow' },
      { t: 'x(x+1) + (x−1) = 2', id: 'cleared' },
    ],
    steps: [
      {
        focus: 'orig',
        text: L(
          "Birinchi qadam. Asl tenglamada x bir bo'lganda hisoblab bo'lmaydi, maxraj nolga aylanadi.",
          'Первый шаг. В исходном уравнении при x равном одному посчитать нельзя, знаменатель обращается в нуль.',
          'Step one. In the original equation, at x equal to one it cannot be computed, the denominator becomes zero.',
        ),
      },
      {
        focus: 'cleared',
        text: L(
          "Ikkinchi qadam. Tozalangan tenglamada esa x bir qo'yilsa, ikki tomon ham raqamga aylanadi va tekshirish mumkin bo'lib qoladi.",
          'Второй шаг. А в очищенном уравнении при подстановке x равного одному обе части становятся числами, и проверка становится возможной.',
          'Step two. But in the cleared equation, substituting x equal to one turns both sides into numbers, and checking becomes possible.',
        ),
      },
      {
        focus: 'cleared',
        text: L(
          "Uchinchi qadam. Tozalangan tenglama x bir uchun ham to'g'ri chiqib qolishi mumkin, garchi asl tenglama u yerda umuman ma'noga ega bo'lmasa ham.",
          'Третий шаг. Очищенное уравнение может оказаться верным и при x равном одному, хотя исходное там вовсе не имеет смысла.',
          'Step three. The cleared equation can turn out true even at x equal to one, even though the original has no meaning there at all.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Xuddi shu sabab boshqa amallarda ham ishlaydi: ikki tomonni kvadratga oshirish ham ba'zan yo'q ildizni «qo'shib» qo'yadi, chunki manfiy va musbat sonlar kvadratga oshirilganda bir xil bo'lib qoladi.",
        'По той же причине лишний корень иногда «добавляет» и возведение обеих частей в квадрат: положительное и отрицательное число после возведения в квадрат становятся одинаковыми.',
        'The same reason sometimes "adds" an extra root when squaring both sides too: a positive and a negative number become equal after squaring.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). MANBA: darslikda alohida
// paragraf yo'q, qoida ODZ (1-6-dars) va kvadrat tenglama (15-19-dars)
// usullaridan umumlashtirildi.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Kasr-ratsional tenglamani yechish tartibi",
    'Порядок решения дробно-рационального уравнения',
    'The order for solving a fractional rational equation',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Qoida yig'ildi, va xukdagi savolga javob keldi.",
      'Правило собрано, и вопрос с хука получил ответ.',
      'The rule is assembled, and the question from the hook got its answer.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("Avval ODZ topiladi", 'Сначала находится ОДЗ', 'First the domain is found') },
      { id: 'f2', label: L("keyin maxrajlarga ko'paytirib, kvadrat tenglama olinadi", 'потом умножением на знаменатели получают квадратное уравнение', 'then, multiplying by the denominators, a quadratic equation is obtained') },
      { id: 'f3', label: L("uning ildizlari topiladi", 'находят его корни', 'its roots are found') },
      { id: 'f4', label: L("va ODZ dan chetga chiqqan ildiz begona deb rad etiladi", 'а корень, вышедший за ОДЗ, отвергается как посторонний', 'and a root that falls outside the domain is rejected as extraneous') },
      { id: 'w1', label: L("topilgan ildizlarning barchasi javobga kiradi", 'все найденные корни входят в ответ', 'all found roots are included in the answer') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Maxrajlarga ko'paytirish ortiqcha ildiz qo'shib qo'yishi mumkin, shuning uchun ODZ tekshiriladi.",
      'Так не складывается. Умножение на знаменатели может добавить лишний корень, поэтому проверяется ОДЗ.',
      'That does not fit. Multiplying by the denominators can add an extra root, so the domain is checked.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darsda umumlashtirildi: ODZ — 1-6-darslar, kvadrat tenglama — 15-19-darslar",
        'Правило обобщено на уроке: ОДЗ — уроки 1–6, квадратное уравнение — уроки 15–19',
        'The rule is generalized in the lesson: domain — lessons 1–6, quadratic equation — lessons 15–19',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "ikkalasi ham javob bo'la oladimi degan savol edi",
        'вопрос был, могут ли оба быть ответом',
        'the question was whether both could be the answer',
      ),
      right: L(
        "faqat minus uch, bir ODZ dan chetda qoldi",
        'только минус три, единица осталась за пределами ОДЗ',
        'only negative three, one stayed outside the domain',
      ),
      winner: 'right',
      note: L(
        "Har ildiz ODZ bilan tekshiriladi",
        'Каждый корень проверяется по ОДЗ',
        'Every root is checked against the domain',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): ODZ ni toping.
// ============================================================
const ASK_ODZ = L('ODZ qanday?', 'Какова ОДЗ?', 'What is the domain?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Tenglamaning ODZ sini toping",
    'Найди ОДЗ уравнения',
    'Find the domain of the equation',
  ),
  audio: [
    A('mount',
      "Besh tenglama. Har birida maxrajlarni nolga tenglashtirib ODZ toping.",
      'Пять уравнений. В каждом найди ОДЗ, приравняв знаменатели к нулю.',
      'Five equations. In each, find the domain by setting the denominators to zero.'),
    A('why',
      "Har maxrajni alohida tekshiring, ular bir nechta bo'lishi mumkin.",
      'Проверяй каждый знаменатель отдельно, их может быть несколько.',
      'Check each denominator separately, there may be more than one.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har bir maxraj alohida tekshirildi.",
      'Все пять разобраны. Каждый знаменатель проверялся отдельно.',
      'All five are done. Each denominator was checked separately.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3/(x − 4) = 5'}</Row>,
        ok: L("Ha. Maxraj x minus to'rt, u to'rtda nolga aylanadi.", 'Да. Знаменатель x минус четыре, он обращается в нуль при четырёх.', 'Yes. The denominator is x minus four, which vanishes at four.'),
        question: ASK_ODZ,
        items: [
          { id: 'a', right: true, label: 'x ≠ 4' },
          { id: 'b', label: 'x ≠ −4', hint: L("Maxraj nolga teng bo'lganda x to'rt, minus to'rt emas.", 'Когда знаменатель равен нулю, x четыре, а не минус четыре.', 'When the denominator is zero, x is four, not negative four.') },
        ],
        solution: ['x − 4 ≠ 0', 'x ≠ 4'],
      },
      {
        expr: <Row size="big" align="center">{'x/(x + 7) + 2 = 1'}</Row>,
        ok: L("Ha. Maxraj x plyus yetti, u minus yettida nolga aylanadi.", 'Да. Знаменатель x плюс семь, он обращается в нуль при минус семи.', 'Yes. The denominator is x plus seven, which vanishes at negative seven.'),
        question: ASK_ODZ,
        items: [
          { id: 'a', right: true, label: 'x ≠ −7' },
          { id: 'b', label: 'x ≠ 7', hint: L("Maxraj nolga teng bo'lganda x minus yetti, musbat yetti emas.", 'Когда знаменатель равен нулю, x минус семь, а не положительная семь.', 'When the denominator is zero, x is negative seven, not positive seven.') },
        ],
        solution: ['x + 7 ≠ 0', 'x ≠ −7'],
      },
      {
        expr: <Row size="big" align="center">{'5/(x² − 9) = x'}</Row>,
        ok: L("Ha. Maxraj iks kvadrat minus to'qqiz, u uch va minus uchda nolga aylanadi.", 'Да. Знаменатель икс квадрат минус девять, он обращается в нуль при трёх и минус трёх.', 'Yes. The denominator is x squared minus nine, which vanishes at three and negative three.'),
        question: ASK_ODZ,
        items: [
          { id: 'a', right: true, label: 'x ≠ 3,  x ≠ −3' },
          { id: 'b', label: 'x ≠ 9', hint: L("To'qqiz maxrajning o'zi, uni nolga tenglashtirib iksni topamiz.", 'Девять, это сам знаменатель без икса, нужно найти икс, при котором он нулевой.', 'Nine is the denominator expression itself; we must find where it equals zero.') },
        ],
        solution: ['x² − 9 = (x−3)(x+3)', 'x ≠ 3,  x ≠ −3'],
      },
      {
        expr: <Row size="big" align="center">{'2/(x − 1) + 3/(x + 2) = 0'}</Row>,
        ok: L("Ha. Ikki maxraj bor, ular bir va minus ikkida nolga aylanadi.", 'Да. Есть два знаменателя, они обращаются в нуль при одном и минус двух.', 'Yes. There are two denominators, vanishing at one and negative two.'),
        question: ASK_ODZ,
        items: [
          { id: 'a', right: true, label: 'x ≠ 1,  x ≠ −2' },
          { id: 'b', label: 'x ≠ −1,  x ≠ 2', hint: L("Ishoralar aylanib qolgan, x bir va minus ikkida nolga aylanadi.", 'Знаки перевёрнуты, нуль получается при одном и минус двух.', 'The signs got flipped; zero occurs at one and negative two.') },
        ],
        solution: ['x − 1 ≠ 0,  x + 2 ≠ 0', 'x ≠ 1,  x ≠ −2'],
      },
      {
        expr: <Row size="big" align="center">{'x/(x² − 4x) = 3'}</Row>,
        ok: L("Ha. Maxraj iks karra iks minus to'rt, u nol va to'rtda nolga aylanadi.", 'Да. Знаменатель икс умножить на икс минус четыре, он обращается в нуль при нуле и четырёх.', 'Yes. The denominator is x times x minus four, vanishing at zero and four.'),
        question: ASK_ODZ,
        items: [
          { id: 'a', right: true, label: 'x ≠ 0,  x ≠ 4' },
          { id: 'b', label: 'x ≠ 4', hint: L("Maxraj iks ga ham ko'paytirilgan, iks nolga teng bo'lganda ham u nolga aylanadi.", 'Знаменатель умножен и на икс, при иксе равном нулю он тоже нулевой.', 'The denominator is also multiplied by x, so it vanishes at x equal to zero too.') },
        ],
        solution: ['x(x − 4) ≠ 0', 'x ≠ 0,  x ≠ 4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): to'liq yechish, ba'zilarida
// begona ildiz bor.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Tenglamani to'liq yeching",
    'Реши уравнение полностью',
    'Solve the equation fully',
  ),
  audio: [
    A('mount',
      "Uch tenglama. Har birida ODZ tekshirilib, javob aniqlanadi.",
      'Три уравнения. В каждом проверяется ОДЗ и определяется ответ.',
      'Three equations. In each, the domain is checked and the answer is decided.'),
    A('why',
      "Ba'zilarida ikkala ildiz ham qoladi, ba'zilarida bittasi rad etiladi.",
      'В некоторых остаются оба корня, в некоторых один отвергается.',
      'In some, both roots remain, in some, one is rejected.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ODZ javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз ОДЗ проверяла ответ.',
      'All three are done. Each time the domain checked the answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3/(x − 1) = x + 1,   ODZ: x ≠ 1'}</Row>,
        ok: L("Ha. Ikkiga oshirsak iks kvadrat to'rt, x plyus-minus ikki, ikkalasi ham ODZ ga mos.", 'Да. Возводя в квадрат, икс квадрат четыре, x плюс-минус два, оба подходят ОДЗ.', 'Yes. Squaring, x squared is four, x is plus or minus two, both fit the domain.'),
        question: L("Javob qaysi?", 'Каков ответ?', 'What is the answer?'),
        items: [
          { id: 'a', right: true, label: 'x = 2,  x = −2' },
          { id: 'b', label: 'x = 2', hint: L("Minus ikki ham ODZ ga mos, uni rad etishga sabab yo'q.", 'Минус два тоже подходит ОДЗ, причин его отвергать нет.', 'Negative two also fits the domain, there is no reason to reject it.') },
        ],
        solution: ['3 = (x+1)(x−1) = x² − 1', 'x² = 4,  x = ±2'],
      },
      {
        expr: <Row size="big" align="center">{'x/(x − 2) + 1/(x + 2) = 8/(x² − 4),   ODZ: x ≠ 2, x ≠ −2'}</Row>,
        ok: L("Ha. Kvadrat tenglama ikki va minus beshni beradi, lekin ikki ODZ dan chetda.", 'Да. Квадратное уравнение даёт два и минус пять, но два за пределами ОДЗ.', 'Yes. The quadratic gives two and negative five, but two falls outside the domain.'),
        question: L("Javob qaysi?", 'Каков ответ?', 'What is the answer?'),
        items: [
          { id: 'a', right: true, label: 'x = −5' },
          { id: 'b', label: 'x = 2,  x = −5', hint: L("Ikki ODZ ni buzadi, maxrajda (x−2) bor.", 'Два нарушает ОДЗ, в знаменателе есть (x−2).', 'Two violates the domain; the denominator holds (x−2).') },
        ],
        solution: ['x² + 3x − 10 = 0', L('x = 2 (rad etildi),  x = −5', 'x = 2 (отклонено),  x = −5', 'x = 2 (rejected),  x = −5')],
      },
      {
        expr: <Row size="big" align="center">{'2/(x − 1) = 4/(x + 1),   ODZ: x ≠ 1, x ≠ −1'}</Row>,
        ok: L("Ha. Chiziqli tenglama chiqadi, x uch, u ODZ ga mos.", 'Да. Получается линейное уравнение, x три, оно подходит ОДЗ.', 'Yes. A linear equation results, x is three, which fits the domain.'),
        question: L("Javob qaysi?", 'Каков ответ?', 'What is the answer?'),
        items: [
          { id: 'a', right: true, label: 'x = 3' },
          { id: 'b', label: 'x = 1', hint: L("Bir ODZ dan chetda, maxrajni nolga aylantiradi.", 'Единица за пределами ОДЗ, обращает знаменатель в нуль.', 'One is outside the domain; it zeroes a denominator.') },
        ],
        solution: ['2(x+1) = 4(x−1)', 'x = 3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): asl tenglamaga
// qo'yib tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Asl tenglamaga qo'yib tekshirish",
    'Проверка подстановкой в исходное',
    'Checking by substituting into the original',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Sonni asl, kasrli tenglamaga qo'yib tekshiring.",
      'Три задания. Подставь число в исходное, дробное уравнение и проверь.',
      'Three tasks. Substitute the number into the original, fractional equation and check.'),
    A('why',
      "Agar maxraj nolga aylansa, hisoblab bo'lmaydi, bu javob emas.",
      'Если знаменатель обращается в нуль, посчитать нельзя, это не ответ.',
      'If a denominator becomes zero, it cannot be computed, and that is not an answer.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Maxraj nolga aylangan joyda hisoblab bo'lmadi.",
      'Все три разобраны. Там, где знаменатель обращался в нуль, посчитать не удавалось.',
      'All three are done. Where a denominator became zero, no computation was possible.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x/(x−1) + 1/(x+1) = 2/(x²−1),   x = −3'}</Row>,
        ok: L("Ha. Ikkala tomon ham chorakka teng chiqadi.", 'Да. Обе части выходят равными одной четвёртой.', 'Yes. Both sides come out equal to one quarter.'),
        question: L('x = −3 shu tenglamaning ildizimi?', 'Является ли x = −3 корнем этого уравнения?', 'Is x = −3 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Minus uchni qo'yib ikkala tomonni alohida hisoblang.", 'Подставь минус три и посчитай обе части отдельно.', 'Substitute negative three and compute both sides separately.') },
        ],
        solution: ['−3/−4 + 1/−2 = 3/4 − 1/2', '= 1/4 = 2/8'],
      },
      {
        expr: <Row size="big" align="center">{'x/(x−1) + 1/(x+1) = 2/(x²−1),   x = 1'}</Row>,
        ok: L("Yo'q. x bir bo'lganda birinchi va uchinchi maxraj nolga aylanadi, hisoblab bo'lmaydi.", 'Нет. При x равном единице первый и третий знаменатель обращаются в нуль, посчитать нельзя.', 'No. At x equal to one, the first and third denominators become zero, and it cannot be computed.'),
        question: L('x = 1 shu tenglamaning ildizimi?', 'Является ли x = 1 корнем этого уравнения?', 'Is x = 1 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, hisoblanmaydi", 'Нет, не вычисляется', 'No, it cannot be computed') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Birni qo'ysangiz maxrajda nol chiqadi.", 'Подставив единицу, в знаменателе получишь нуль.', 'Substituting one gives zero in a denominator.') },
        ],
        solution: ['x − 1 = 0', L('hisoblay olmaydi', 'вычислить нельзя', 'cannot be computed')],
      },
      {
        expr: <Row size="big" align="center">{'x/(x−2) + 1/(x+2) = 8/(x²−4),   x = −5'}</Row>,
        ok: L("Ha. Ikkala tomon ham yigirma birdan sakkizga teng chiqadi.", 'Да. Обе части выходят равными восьми двадцать первым.', 'Yes. Both sides come out equal to eight twenty-firsts.'),
        question: L('x = −5 shu tenglamaning ildizimi?', 'Является ли x = −5 корнем этого уравнения?', 'Is x = −5 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Minus beshni qo'yib ikkala tomonni alohida hisoblang.", 'Подставь минус пять и посчитай обе части отдельно.', 'Substitute negative five and compute both sides separately.') },
        ],
        solution: ['−5/−7 + 1/−3 = 5/7 − 1/3', '= 8/21'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): ODZ tekshirilmagan,
// posторonний ildiz javobda qoldirilgan (З3, darsning markaziy xatosi).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "ODZ tekshirilmadi",
    'ОДЗ не проверена',
    'The domain was not checked',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham kvadrat tenglama to'g'ri yechilgan, lekin ODZ tekshirilmagan.",
      'Два задания. В обоих квадратное уравнение решено верно, но ОДЗ не проверена.',
      'Two tasks. In both, the quadratic was solved correctly, but the domain was not checked.'),
    A('why',
      "Ildizlardan biri maxrajni nolga aylantiradi, u javobga kirmasligi kerak.",
      'Один из корней обращает знаменатель в нуль, он не должен входить в ответ.',
      'One of the roots zeroes a denominator; it must not be in the answer.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har safar bitta ildiz ODZ tufayli chiqarib tashlandi.",
      'Оба разобраны. Каждый раз один корень отбрасывался из-за ОДЗ.',
      'Both are done. Each time one root was dropped because of the domain.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x/(x−1) + 1/(x+1) = 2/(x²−1)'}</Row>,
        ok: L("Yo'q. Bir ODZ ni buzadi, maxrajda (x−1) bor.", 'Нет. Единица нарушает ОДЗ, в знаменателе есть (x−1).', 'No. One violates the domain; the denominator holds (x−1).'),
        question: L("To'g'ri javob qaysi?", 'Какой ответ верен?', 'Which answer is correct?'),
        items: [
          { id: 'a', right: true, label: L('Faqat x = −3', 'Только x = −3', 'Only x = −3') },
          { id: 'b', label: L('x = 1 va x = −3', 'x = 1 и x = −3', 'x = 1 and x = −3'), hint: L("Bu ko'rsatilgan xato javobning o'zi, ODZ tekshirilmagan.", 'Это и есть показанный ошибочный ответ, ОДЗ не проверена.', 'This is the very mistaken answer shown, the domain was not checked.') },
          { id: 'c', label: L('Faqat x = 1', 'Только x = 1', 'Only x = 1'), hint: L("Aksincha, aynan bir rad etiladi, minus uch qoladi.", 'Наоборот, именно единица отвергается, минус три остаётся.', 'The other way around, one is rejected, negative three stays.') },
        ],
        solution: [
          L('x = 1 ODZ ni buzadi', 'x = 1 нарушает ОДЗ', 'x = 1 violates the domain'),
          L('javob: x = −3', 'ответ: x = −3', 'answer: x = −3'),
        ],
      },
      {
        expr: <Row size="big" align="center">{'x/(x−2) + 1/(x+2) = 8/(x²−4)'}</Row>,
        ok: L("Yo'q. Ikki ODZ ni buzadi, maxrajda (x−2) bor.", 'Нет. Два нарушает ОДЗ, в знаменателе есть (x−2).', 'No. Two violates the domain; the denominator holds (x−2).'),
        question: L("To'g'ri javob qaysi?", 'Какой ответ верен?', 'Which answer is correct?'),
        items: [
          { id: 'a', right: true, label: L('Faqat x = −5', 'Только x = −5', 'Only x = −5') },
          { id: 'b', label: L('x = 2 va x = −5', 'x = 2 и x = −5', 'x = 2 and x = −5'), hint: L("Bu ko'rsatilgan xato javobning o'zi, ODZ tekshirilmagan.", 'Это и есть показанный ошибочный ответ, ОДЗ не проверена.', 'This is the very mistaken answer shown, the domain was not checked.') },
          { id: 'c', label: L('Faqat x = 2', 'Только x = 2', 'Only x = 2'), hint: L("Aksincha, aynan ikki rad etiladi, minus besh qoladi.", 'Наоборот, именно два отвергается, минус пять остаётся.', 'The other way around, two is rejected, negative five stays.') },
        ],
        solution: [
          L('x = 2 ODZ ni buzadi', 'x = 2 нарушает ОДЗ', 'x = 2 violates the domain'),
          L('javob: x = −5', 'ответ: x = −5', 'answer: x = −5'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill`): kasr-ratsional
// tenglamalar to'liq yechiladi, begona ildiz chiqarib tashlanadi.
// ============================================================
const S13 = {
  eyebrow: L('TO\'LIQ YECHISH', 'ПОЛНОЕ РЕШЕНИЕ', 'THE FULL SOLUTION'),
  title: L(
    "Tenglamani boshidan oxirigacha yeching",
    'Реши уравнение от начала до конца',
    'Solve the equation from start to finish',
  ),
  audio: [
    A('mount',
      "Maxrajlarga ko'paytirib kvadrat tenglama oling, keyin ODZ ni tekshiring.",
      'Умножив на знаменатели, получи квадратное уравнение, потом проверь ОДЗ.',
      'Multiplying by the denominators, get a quadratic equation, then check the domain.'),
    A('why',
      "Ikkita nomzod chiqadi, lekin bittasi doim maxrajni nolga aylantiradi.",
      'Выходят два кандидата, но один всегда обращает знаменатель в нуль.',
      'Two candidates come out, but one always zeroes a denominator.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar bitta nomzod ODZ tufayli chiqarib tashlandi.",
      'Все три заполнены. Каждый раз один кандидат отбрасывался из-за ОДЗ.',
      'All three are filled. Each time one candidate was dropped because of the domain.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['36', '-9'],
      lines: [
        [{ t: 'x/(x−4) + 1/(x+4) = 32/(x²−16)   →   x² + 5x − ' }, { slot: '36' }, { t: ' = 0' }],
        [{ t: L('ildizlar 4 va minus 9, ODZ buzilgani uchun x = ', 'корни 4 и минус 9, из-за ОДЗ остаётся x = ', 'roots 4 and minus 9, the domain leaves x = ') }, { slot: '-9' }],
      ],
    },
    tasks: [
      {
        chips: ['55', '-11'],
        lines: [
          [{ t: 'x/(x−5) + 1/(x+5) = 50/(x²−25)   →   x² + 6x − ' }, { slot: '55' }, { t: ' = 0' }],
          [{ t: L('ildizlar 5 va minus 11, ODZ buzilgani uchun x = ', 'корни 5 и минус 11, из-за ОДЗ остаётся x = ', 'roots 5 and minus 11, the domain leaves x = ') }, { slot: '-11' }],
        ],
      },
      {
        chips: ['21', '-7'],
        lines: [
          [{ t: 'x/(x−3) + 1/(x+3) = 18/(x²−9)   →   x² + 4x − ' }, { slot: '21' }, { t: ' = 0' }],
          [{ t: L('ildizlar 3 va minus 7, ODZ buzilgani uchun x = ', 'корни 3 и минус 7, из-за ОДЗ остаётся x = ', 'roots 3 and minus 7, the domain leaves x = ') }, { slot: '-7' }],
        ],
      },
      {
        chips: ['78', '-13'],
        lines: [
          [{ t: 'x/(x−6) + 1/(x+6) = 72/(x²−36)   →   x² + 7x − ' }, { slot: '78' }, { t: ' = 0' }],
          [{ t: L('ildizlar 6 va minus 13, ODZ buzilgani uchun x = ', 'корни 6 и минус 13, из-за ОДЗ остаётся x = ', 'roots 6 and minus 13, the domain leaves x = ') }, { slot: '-13' }],
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
    "ODZ bo'yicha to'rt savol",
    'Четыре вопроса об ОДЗ',
    'Four questions about the domain',
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
        id: 'q1', tag: 'З2',
        ask: L('4/(x + 6) ifodaning ODZ si qanday?', 'Какова ОДЗ выражения 4/(x + 6)?', 'What is the domain of 4/(x + 6)?'),
        options: [
          { id: 'ok', right: true, label: 'x ≠ −6' },
          { id: 'wrong', label: 'x ≠ 6' },
          { id: 'c', label: 'x ≠ 4' },
          { id: 'd', label: L('Cheklov yo\'q', 'Нет ограничений', 'No restriction') },
        ],
        hint: L("Maxrajni nolga tenglashtirib iksni toping.", 'Приравняй знаменатель к нулю и найди икс.', 'Set the denominator to zero and find x.'),
        ok: L("To'g'ri, x minus oltida maxraj nolga aylanadi.", 'Верно, при x равном минус шести знаменатель обращается в нуль.', 'Correct, at x equal to negative six the denominator becomes zero.'),
      },
      {
        id: 'q2', tag: 'З3',
        ask: L('Kvadrat tenglama x = 3 va x = 5 berdi, lekin ODZ x ≠ 5. Javob qanday?', 'Квадратное уравнение дало x = 3 и x = 5, но ОДЗ x ≠ 5. Каков ответ?', 'The quadratic gave x = 3 and x = 5, but the domain says x ≠ 5. What is the answer?'),
        options: [
          { id: 'ok', right: true, label: 'x = 3' },
          { id: 'both', label: 'x = 3,  x = 5' },
          { id: 'onlyFive', label: 'x = 5' },
          { id: 'none', label: L("Yechim yo'q", 'Решений нет', 'No solution') },
        ],
        hint: L("Besh ODZ dan chetda, u begona ildiz.", 'Пять за пределами ОДЗ, это посторонний корень.', 'Five is outside the domain, it is an extraneous root.'),
        ok: L("To'g'ri, faqat uch qoladi.", 'Верно, остаётся только три.', 'Correct, only three remains.'),
      },
      {
        id: 'q3', tag: 'З2',
        ask: L('x/(x² − 1) tenglamada nechta son ODZ dan chetda?', 'Сколько чисел в ОДЗ уравнения x/(x² − 1) отсутствует?', 'How many numbers are missing from the domain in x/(x² − 1)?'),
        options: [
          { id: 'ok', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'one', label: L('Bitta', 'Один', 'One') },
          { id: 'zero', label: L('Nolta', 'Нуль', 'Zero') },
          { id: 'three', label: L('Uchta', 'Три', 'Three') },
        ],
        hint: L("Iks kvadrat minus bir ikki ko'paytuvchiga ajraladi.", 'Икс квадрат минус один разлагается на два множителя.', 'x squared minus one factors into two factors.'),
        ok: L("To'g'ri, bir va minus bir.", 'Верно, один и минус один.', 'Correct, one and negative one.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('x = 4 son 2/(x − 4) = 1 tenglamaning ildizi bo\'la oladimi?', 'Может ли x = 4 быть корнем уравнения 2/(x − 4) = 1?', 'Can x = 4 be a root of 2/(x − 4) = 1?'),
        options: [
          { id: 'ok', right: true, label: L("Yo'q, hisoblanmaydi", 'Нет, не вычисляется', 'No, it cannot be computed') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
          { id: 'sometimes', label: L('Ba\'zan', 'Иногда', 'Sometimes') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("To'rtni qo'ysangiz maxrajda nol chiqadi.", 'Подставив четыре, в знаменателе получишь нуль.', 'Substituting four gives zero in the denominator.'),
        ok: L("To'g'ri, maxraj nolga aylanadi.", 'Верно, знаменатель обращается в нуль.', 'Correct, the denominator becomes zero.'),
      },
      {
        id: 'q5', tag: 'З3',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "X kvadrat minus 2x minus 8 teng nol tenglamasi ODZ x ≠ 4 bilan berilgan. To'g'ri javobni yig'ing.",
            'Уравнение икс квадрат минус два икс минус восемь равно нулю дано с ОДЗ x ≠ 4. Собери верный ответ.',
            'The equation x squared minus two x minus eight equals zero is given with domain x ≠ 4. Assemble the correct answer.',
          ),
          lines: [
            [{ t: 'ildizlar 4 va minus 2, ODZ x ≠ 4   →   javob: x = ' }, { slot: '−2' }],
          ],
          tiles: [
            { id: 't1', v: '−2', x: 12, y: 12 },
            { id: 't2', v: '4', x: 70, y: 14 },
            { id: 't3', v: '2', x: 40, y: 50 },
            { id: 't4', v: '8', x: 78, y: 48 },
          ],
          hint: L(
            "To'rt ODZ ni buzadi, javobda faqat ikkinchi ildiz qoladi.",
            'Четыре нарушает ОДЗ, в ответе остаётся только второй корень.',
            'Four violates the domain, only the second root remains in the answer.',
          ),
          doneNote: L(
            "Yig'ildi. To'rt rad etildi, javob minus ikki.",
            'Собрано. Четыре отвергнуто, ответ минус два.',
            'Assembled. Four is rejected, the answer is negative two.',
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
    "Har ildiz ODZ bilan tekshiriladi",
    'Каждый корень проверяется по ОДЗ',
    'Every root is checked against the domain',
  ),
  audio: [
    A('s0',
      "Darsdan bitta rasm qoladi. Ikki nomzoddan bittasi chiziqdan yo'qoladi, chunki u maxrajni nolga aylantiradi.",
      'С урока остаётся одна картинка. Из двух кандидатов один исчезает с прямой, потому что обращает знаменатель в нуль.',
      'One picture stays with you. Of two candidates, one vanishes from the line because it zeroes a denominator.'),
    A('s1',
      "Bugun uch narsa qilindi. ODZ ni topdingiz, maxrajlarga ko'paytirib kvadrat tenglama oldingiz va begona ildizni rad etdingiz.",
      'Сегодня сделано три вещи. Ты находил ОДЗ, умножением на знаменатели получал квадратное уравнение и отвергал посторонний корень.',
      'Three things are done today. You found the domain, obtained a quadratic by multiplying by the denominators, and rejected the extraneous root.'),
    A('s2',
      "Keyingi darsda kvadrat tenglamalar yordamida masalalar yechiladi.",
      'В следующем уроке решаются задачи с помощью квадратных уравнений.',
      'The next lesson solves word problems using quadratic equations.',
    ),
  ],
  props: {
    mark: 'x/(x−1) + 1/(x+1) = 2/(x²−1)',
    markNote: L(
      "javob faqat x = minus uch",
      'ответ только x = минус три',
      'the answer is only x = negative three',
    ),
    lines: [
      L(
        "Avval ODZ topiladi",
        'Сначала находится ОДЗ',
        'First the domain is found',
      ),
      L(
        "Maxrajlarga ko'paytirib kvadrat tenglama olinadi",
        'Умножением на знаменатели получают квадратное уравнение',
        'Multiplying by the denominators gives a quadratic equation',
      ),
      L(
        "ODZ dan chetga chiqqan ildiz begona deb rad etiladi",
        'Корень за пределами ОДЗ отвергается как посторонний',
        'A root outside the domain is rejected as extraneous',
      ),
    ],
    bridge: L(
      "Keyingi dars: kvadrat tenglamalar yordamida masalalar",
      'Следующий урок: задачи с помощью квадратных уравнений',
      'Next lesson: word problems using quadratic equations',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — MAXRAJLARGA KO'PAYTIRISH.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З2', 'З2', 'З3',
    'З3', 'З3', 'З3', 'З2', 'З3',
    'З16', 'З3', 'З3', null, null,
  ],
  mechanic: { at: 5, tool: 'twosides', kind: 'clear' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
