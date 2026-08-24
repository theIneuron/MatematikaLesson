// ============================================================================
// 8-sinf, Dars 27. SONLI ORALIQLAR VA ULARNING BELGILANISHI.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `twosides.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `twosides`: qo'sh tengsizlik ikki qadamda
// QAVS YOZUVIGA aylanadi (`set: {between, openLeft, openRight}` — shu
// dars uchun kengaytirilgan, chunki yarim-interval ikki xil chegarani bir
// vaqtda talab qiladi).
//
// DARSNING ISHI (darslik, 16-§, 96-97-bet, «2. Sonli oraliqlar» qismi):
//   1) a ≤ x ≤ b — KESMA, [a; b] deb belgilanadi, ikkala chegara ham kiradi;
//   2) a < x < b — INTERVAL, (a; b) deb belgilanadi, ikkala chegara ham
//      chiqarib tashlanadi;
//   3) a ≤ x < b yoki a < x ≤ b — YARIM-INTERVAL, [a; b) yoki (a; b] deb
//      belgilanadi, bitta chegara kiradi, ikkinchisi chiqarib tashlanadi;
//   4) kesma, interval, yarim-interval va nur — barchasi SONLI ORALIQ.
//
// DARSLIK. O'zbek darsligi, 16-§, 96-97-bet: uch ta'rif, [-2;3], (-2;3),
// [-1;2), (4;7] namunalari.
//
// ADASHISHLAR: bittasi yangi, bittasi qaytadi:
//   З56 — qavs turi tengsizlikning qat'iyligiga mos kelmadi (kvadrat va
//         oddiy qavs almashtirilgan);
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
  id: 'alg-8-27',
  n: 27,
  row: 30,
  block: 'Б4',
  topic: L(
    'Sonli oraliqlar va ularning belgilanishi',
    'Числовые промежутки и их обозначение',
    'Number intervals and their notation',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "a ≤ x ≤ b tengsizlikni qanoatlantiruvchi sonlar to'plami kesma deyiladi va [a; b] deb belgilanadi",
    'Множество чисел, удовлетворяющих a ≤ x ≤ b, называется отрезком и обозначается [a; b]',
    'The set of numbers satisfying a ≤ x ≤ b is called a segment and is denoted [a; b]',
  ),
  L(
    "a < x < b tengsizlikni qanoatlantiruvchi sonlar to'plami interval deyiladi va (a; b) deb belgilanadi",
    'Множество чисел, удовлетворяющих a < x < b, называется интервалом и обозначается (a; b)',
    'The set of numbers satisfying a < x < b is called an interval and is denoted (a; b)',
  ),
  L(
    "a ≤ x < b yoki a < x ≤ b to'plami yarim-interval deyiladi, bitta chegara kiradi, ikkinchisi chiqarib tashlanadi",
    'Множество, удовлетворяющее a ≤ x < b или a < x ≤ b, называется полуинтервалом, одна граница входит, другая нет',
    'A set satisfying a ≤ x < b or a < x ≤ b is called a half-interval, one boundary is included, the other is not',
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
    wrong: '2',
    at: 3,
  },
  'З56': {
    what: L(
      "qavs turi tengsizlikning qat'iyligiga mos kelmadi",
      'тип скобки не соответствует строгости неравенства',
      "the bracket type did not match the inequality's strictness",
    ),
    wrong: '[3',
    at: 4,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: [−2; 3] va (−2; 3) bir xilmi. Yakun: 3 < x ≤ 8,
// (3; 8] yarim-interval.
// ============================================================
const SC_ASK = L('BIR XILMI', 'ОДНО И ТО ЖЕ', 'ARE THEY THE SAME')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="130" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fill={T.ink}>{'[−2; 3]'}</text>
      <text x="270" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fill={T.ink}>{'(−2; 3)'}</text>
      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="94" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="101" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Chap chegara ochiq, o'ng chegara yopiq, yarim-interval chiqadi",
      'Левая граница открыта, правая закрыта, выходит полуинтервал',
      'The left boundary is open, the right is closed, giving a half-interval',
    )}>
      <text x="200" y="24" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fill={T.ink}>{'3 < x ≤ 8'}</text>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <line x1="40" y1="60" x2="360" y2="60" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <rect x="140" y="55" width="140" height="10" rx="5" fill={T.accent} opacity=".85"/>
        <circle cx="140" cy="60" r="4.4" fill={T.paper} stroke={T.accent} strokeWidth="2.4"/>
        <text x="140" y="74" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>3</text>
        <circle cx="280" cy="60" r="4.4" fill={T.ok}/>
        <text x="280" y="74" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>8</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1800ms' }}>
        <text x="200" y="98" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.ok}>{'(3; 8]'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('QAVSLAR TURLI', 'СКОБКИ РАЗНЫЕ', 'THE BRACKETS DIFFER'),
  title: L(
    "Kvadrat va oddiy qavs bir xil to'plamni bildiradimi",
    'Означают ли квадратная и круглая скобка одно и то же множество',
    'Do square and round brackets mean the same set',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki yozuv. Ikkalasida ham minus ikki va uch sonlari bor.",
      'Две записи. В обеих есть числа минус два и три.',
      'Two records. Both have the numbers negative two and three.'),
    A('why',
      "Taxmin qiling, ikkalasi bir xil to'plamni bildiradimi.",
      'Предположи, означают ли они одно и то же множество.',
      'Predict whether they mean the same set.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, ikkalasi bir xil to'plammi?",
      'Как думаешь, это одно и то же множество?',
      'Do you think this is the same set?',
    ),
    items: [
      { id: 'same', show: L("Ha, bir xil", 'Да, одно и то же', 'Yes, the same') },
      { id: 'diff', show: L("Yo'q, har xil", 'Нет, разные', 'No, different') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Ochiq va to'la nuqta (25-darsdan). Shu tayanch 5 va
// 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Ochiq va to'la nuqtani eslash",
    'Вспоминаем открытую и закрытую точку',
    'Recalling the open and closed point',
  ),
  audio: [
    A('mount',
      "To'rt tasvir. Faqat bittasida x ≤ 4 to'g'ri chizilgan.",
      'Четыре рисунка. Только на одном верно изображено x ≤ 4.',
      'Four pictures. Only one correctly draws x ≤ 4.'),
    A('why',
      "Qat'iy bo'lmagan tengsizlikda chegara TO'LA nuqta bilan belgilanadi.",
      'В нестрогом неравенстве граница отмечается ЗАКРЫТОЙ точкой.',
      'In a non-strict inequality, the boundary is marked with a CLOSED point.'),
  ],
  props: {
    ask: L(
      "x ≤ 4 qaysi tasvirda to'g'ri?",
      'На каком рисунке верно изображено x ≤ 4?',
      'In which picture is x ≤ 4 drawn correctly?',
    ),
    items: [
      { id: 'right', show: L("to'rtda TO'LA nuqta, chapga bo'yash", 'в четырёх ЗАКРЫТАЯ точка, закраска налево', 'a CLOSED point at four, shading to the left'), right: true, name: L("qat'iy emas, chegara kiradi", 'нестрого, граница входит', 'not strict, the boundary is included') },
      {
        id: 'open', show: L("to'rtda OCHIQ nuqta, chapga bo'yash", 'в четырёх ОТКРЫТАЯ точка, закраска налево', 'an OPEN point at four, shading to the left'),
        hint: L("Belgi qat'iy emas, teng holat ham kiradi, nuqta to'la bo'lishi kerak.", 'Знак не строгий, равенство входит, точка должна быть закрытой.', 'The sign is not strict, equality is included, the point should be closed.'),
      },
      {
        id: 'wrongdir', show: L("to'rtda TO'LA nuqta, o'ngga bo'yash", 'в четырёх ЗАКРЫТАЯ точка, закраска направо', 'a CLOSED point at four, shading to the right'),
        hint: L("Belgi kichik yoki teng, bo'yash chapga qarab borishi kerak.", 'Знак меньше либо равно, закраска должна идти налево.', 'The sign is less-than-or-equal, so shading should go to the left.'),
      },
      {
        id: 'both', show: L("to'rtda OCHIQ nuqta, o'ngga bo'yash", 'в четырёх ОТКРЫТАЯ точка, закраска направо', 'an OPEN point at four, shading to the right'),
        hint: L("Ikkalasi ham xato, nuqta to'la bo'lishi va bo'yash chapga borishi kerak.", 'Обе ошибки, точка должна быть закрытой, а закраска налево.', 'Both are wrong, the point should be closed and shading should go left.'),
      },
    ],
    after: L(
      "To'g'ri. Qat'iy bo'lmagan belgida chegara to'la nuqta bilan kiradi.",
      'Верно. В нестрогом знаке граница входит закрытой точкой.',
      'Correct. In a non-strict sign, the boundary is included with a closed point.',
    ),
  },
}

// ============================================================
// EKRAN 3. B NI BURANG (1-darsning `steppers`). [2; b] kesmasining uzunligi
// kuzatiladi: b ikkiga yaqinlashganda kesma qisqaradi, b ikkiga tenglashganda
// YO'QOLADI — kesma NUQTAGA aylanadi (З54 bilan bog'liq).
// ============================================================
const S3 = {
  eyebrow: L('B NI BURANG', 'КРУТИ B', 'TURN B'),
  title: L(
    "[2; b] kesmasi qanchalik qisqa",
    "Насколько короток отрезок [2; b]",
    'How short is the segment [2; b]',
  ),
  audio: [
    A('mount',
      "Chap chegara ikkida qotib qoladi. O'ng chegara b o'zgaradi.",
      'Левая граница закреплена на двух. Правая граница b меняется.',
      'The left boundary is fixed at two. The right boundary b changes.'),
    A('why',
      "Ikki maqsad beriladi. b ning turli qiymatlarida natijani toping.",
      'Даны две цели. Находи результат при разных значениях b.',
      'Two targets are given. Find the result at different values of b.'),
    A('why',
      "Oxirida b ni ikkiga tushiring va nima bo'lishini ko'ring.",
      'В конце подведи b к двум и посмотри, что будет.',
      'At the end bring b down to two and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'b', label: L('b ning qiymati', 'значение b', 'the value of b'),
        start: 4, min: 2, max: 6, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 2 ? null : Math.round((1 / (v[0] - 2)) * 100) / 100),
    resultLabel: L('1/(b−2)', '1/(b−2)', '1/(b−2)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "b hali ikkiga tushmasin, avval maqsadlarni oling.",
      'b пока не подводи к двум, сначала возьми цели.',
      'Do not bring b down to two yet, take the targets first.',
    ),
    goals: [
      {
        value: 0.5,
        ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
        after: L(
          "0,5. To'rtdan ikki ayirilganda ikki qoladi, bir bo'lingan ikki 0,5.",
          '0,5. Четыре минус два равно двум, единица, делённая на два, это 0,5.',
          '0.5. Four minus two equals two, one divided by two is 0.5.',
        ),
      },
      {
        value: 1,
        ask: L("Endi natija 1 ga teng bo'lsin", 'Теперь пусть результат будет равен 1', 'Now make the result equal 1'),
        after: L(
          "1. Uchdan ikki ayirilganda bir qoladi, bir bo'lingan bir bir.",
          '1. Три минус два равно одному, единица, делённая на один, это один.',
          '1. Three minus two equals one, one divided by one is one.',
        ),
      },
    ],
    ask: L("Natija 0,5 ga teng bo'lsin", 'Пусть результат будет равен 0,5', 'Make the result equal 0.5'),
    ask2: L("Endi b ni ikkiga tushiring", 'Теперь подведи b к двум', 'Now bring b down to two'),
    broke: L(
      "b ikkiga teng bo'lganda natija yo'q, chunki nolga bo'lish mumkin emas. Shu paytda kesma nuqtaga aylanib qoladi.",
      'При b равном двум результата нет, потому что делить на нуль нельзя. В этот момент отрезок превращается в точку.',
      'With b equal to two there is no result, because dividing by zero is not possible. At that moment the segment turns into a point.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI QAVS TO'G'RI (1-darsning `pick`). Ловушка — qavs turi
// qat'iylikka mos kelmadi (З56).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI QAVS TO\'G\'RI', 'КАКАЯ СКОБКА ВЕРНА', 'WHICH BRACKET IS CORRECT'),
  title: L(
    "3 ≤ x < 8 qaysi belgilanishga mos",
    'Какому обозначению соответствует 3 ≤ x < 8',
    'Which notation matches 3 ≤ x < 8',
  ),
  audio: [
    A('mount',
      "To'rt belgilanish taklif qilinadi. Faqat bittasi ikkala chegaraga ham mos.",
      'Предложены четыре обозначения. Только одно соответствует обеим границам.',
      'Four notations are proposed. Only one matches both boundaries.'),
    A('why',
      "Chap chegara qat'iy emas, kvadrat qavs. O'ng chegara qat'iy, oddiy qavs.",
      'Левая граница нестрогая, квадратная скобка. Правая строгая, круглая скобка.',
      'The left boundary is not strict, a square bracket. The right is strict, a round bracket.'),
  ],
  props: {
    ask: L(
      "3 ≤ x < 8 qanday belgilanadi?",
      'Как обозначается 3 ≤ x < 8?',
      'How is 3 ≤ x < 8 denoted?',
    ),
    items: [
      { id: 'right', show: '[3; 8)', right: true, name: L("chap yopiq, o'ng ochiq", 'слева закрыто, справа открыто', 'closed on the left, open on the right') },
      {
        id: 'bothround', show: '(3; 8)',
        hint: L("Chap chegara qat'iy emas, u ham kirishi kerak, kvadrat qavs bo'lishi kerak.", 'Левая граница нестрогая, она тоже входит, должна быть квадратная скобка.', 'The left boundary is not strict, it too is included, it should be a square bracket.'),
      },
      {
        id: 'bothsquare', show: '[3; 8]',
        hint: L("O'ng chegara qat'iy, u chiqarib tashlanadi, oddiy qavs bo'lishi kerak.", 'Правая граница строгая, она исключается, должна быть круглая скобка.', 'The right boundary is strict, it is excluded, it should be a round bracket.'),
      },
      {
        id: 'swapped', show: '(3; 8]',
        hint: L("Qavslar almashtirilgan, chap yopiq bo'lishi, o'ng ochiq bo'lishi kerak edi.", 'Скобки перепутаны, левая должна быть закрытой, правая открытой.', 'The brackets are swapped, the left should be closed, the right open.'),
      },
    ],
    after: L(
      "To'g'ri. Chap chegara kiradi, kvadrat qavs; o'ng chegara chiqadi, oddiy qavs.",
      'Верно. Левая граница входит, квадратная скобка; правая исключается, круглая скобка.',
      'Correct. The left boundary is included, a square bracket; the right is excluded, a round bracket.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — QAVS YOZUVIGA O'TISH (`twosides`).
// Xukdagi qiyoslash shu yerda ochiladi: 3 < x ≤ 8 dan (3; 8] gacha.
// ============================================================
const S5 = {
  eyebrow: L('BELGILAYMIZ', 'ОБОЗНАЧАЕМ', 'WE DENOTE IT'),
  title: L(
    "3 < x ≤ 8 ni qavs bilan yozing",
    'Запишите 3 < x ≤ 8 в виде скобки',
    'Write 3 < x ≤ 8 using brackets',
  ),
  audio: [
    A('mount',
      "Qo'sh tengsizlik. Uni ikki qadamda qavs yozuviga aylantiramiz.",
      'Двойное неравенство. Превращаем его в запись со скобками за два шага.',
      'A double inequality. We turn it into bracket notation in two steps.'),
    A('why',
      "Amal har ikki chegaraga tegishli. Qadamni tanlang.",
      'Действие относится к обеим границам. Выбери шаг.',
      'The action concerns both boundaries. Choose the step.'),
    W('a2',
      "Ikkinchi qadamda o'ng chegara qo'shildi.",
      'На втором шаге добавлена правая граница.',
      'In the second step the right boundary was added.'),
  ],
  props: {
    from: 0,
    to: 10,
    start: { left: '3 < x ≤ 8', rel: '=', right: '?', set: null },
    steps: [
      {
        ask: L("Chap chegara qat'iy. Qanday nuqta bilan chiziladi?", 'Левая граница строгая. Какой точкой рисуется?', 'The left boundary is strict. Which point marks it?'),
        actions: [
          {
            id: 'openleft', right: true,
            label: L("Ochiq nuqta, uchdan boshlab", 'Открытая точка, начиная от трёх', 'An open point, starting from three'),
            to: { left: '3 < x ≤ 8', rel: '=', right: '?' },
            set: { gt: 3 },
          },
          {
            id: 'closedleft',
            label: L("Yopiq nuqta, uchdan boshlab", 'Закрытая точка, начиная от трёх', 'A closed point, starting from three'),
            counter: { at: '3', gives: '3 ≤ 3', verdict: L("lekin belgi qat'iy katta", 'но знак строго больше', 'but the sign is strictly greater') },
            hint: L(
              "Belgi qat'iy katta, uch o'zi kirmaydi, nuqta ochiq bo'lishi kerak.",
              'Знак строго больше, сама тройка не входит, точка должна быть открытой.',
              'The sign is strictly greater, three itself is not included, the point should be open.',
            ),
          },
        ],
      },
      {
        ask: L("Endi o'ng chegarani qo'shamiz. U qat'iy emas. Qanday nuqta?", 'Теперь добавляем правую границу. Она нестрогая. Какой точкой?', 'Now we add the right boundary. It is not strict. Which point?'),
        actions: [
          {
            id: 'closedright', right: true,
            label: L("Yopiq nuqta, sakkizda to'xtash", 'Закрытая точка, остановка на восьми', 'A closed point, stopping at eight'),
            to: { left: '3 < x ≤ 8', rel: '=', right: '(3; 8]' },
            set: { between: [3, 8], openLeft: true, openRight: false },
            note: L(
              "Chap ochiq, o'ng yopiq: yarim-interval (3; 8] chiqdi.",
              'Слева открыто, справа закрыто: получился полуинтервал (3; 8].',
              'Open on the left, closed on the right: the half-interval (3; 8] comes out.',
            ),
          },
          {
            id: 'openright',
            label: L("Ochiq nuqta, sakkizda to'xtash", 'Открытая точка, остановка на восьми', 'An open point, stopping at eight'),
            counter: { at: '8', gives: '8 ≤ 8', verdict: L("lekin sakkiz kirishi kerak", 'но восемь должно входить', 'but eight should be included') },
            hint: L(
              "Belgi kichik yoki teng, sakkiz kiradi, nuqta yopiq bo'lishi kerak.",
              'Знак меньше либо равно, восемь входит, точка должна быть закрытой.',
              'The sign is less-than-or-equal, eight is included, the point should be closed.',
            ),
          },
        ],
      },
    ],
    note: L(
      "Javob: (3; 8], chap chegara chiqadi, o'ng chegara kiradi.",
      'Ответ: (3; 8], левая граница исключается, правая входит.',
      'The answer: (3; 8], the left boundary is excluded, the right is included.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): (3; 8] ni ikki yo'l bilan
// tekshirish — chizma va son qo'yib tekshirish.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "(3; 8] ni ikki yo'l bilan tekshirish",
    'Проверить (3; 8] двумя способами',
    'Checking (3; 8] two ways',
  ),
  audio: [
    A('mount',
      "Bitta yozuv va ikki yo'l. Ikkalasi ham bir xil to'plamni beradi.",
      'Одна запись и два пути. Оба дают одно множество.',
      'One record and two ways. Both give the same set.'),
    W('w2',
      "Birinchi yo'lda chegara sonlar sinaladi.",
      'В первом пути проверяются граничные числа.',
      'In the first way, the boundary numbers are tested.'),
    W('w4',
      "Ikkinchi yo'lda chizmada nuqta turi tekshiriladi.",
      'Во втором пути на чертеже проверяется тип точки.',
      'In the second way, the point type on the drawing is checked.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL — CHEGARA SONLARNI SINASH', 'СПОСОБ 1 — ПРОВЕРКА ГРАНИЧНЫХ ЧИСЕЛ', 'METHOD 1 — TESTING THE BOUNDARY NUMBERS'),
        lead: L(
          "Uch va sakkizni asl tengsizlikka qo'yamiz",
          'Подставляем три и восемь в исходное неравенство',
          'We substitute three and eight into the original inequality',
        ),
        rows: [
          { text: '3 < 3 ≤ 8' },
          { text: L('uch kirmaydi, sakkiz kiradi', 'три не входит, восемь входит', 'three does not fit, eight fits'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL — CHIZMADAGI NUQTA', 'СПОСОБ 2 — ТОЧКА НА ЧЕРТЕЖЕ', 'METHOD 2 — THE POINT ON THE DRAWING'),
        lead: L(
          "Uchda ochiq nuqta, sakkizda yopiq nuqta",
          'В трёх открытая точка, в восьми закрытая',
          'An open point at three, a closed point at eight',
        ),
        rows: [
          { text: L('ochiq nuqta = oddiy qavs', 'открытая точка = круглая скобка', 'open point = round bracket') },
          { text: L('yopiq nuqta = kvadrat qavs', 'закрытая точка = квадратная скобка', 'closed point = square bracket'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Son qo'yib sinash tez, chizma esa ko'rgazmali",
          'Проверка числом быстрая, а чертёж нагляден',
          'Testing with a number is fast, the drawing is visual',
        ),
        rows: [{ text: '(3; 8]', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): nega to'rt xil oraliq bor.
// ============================================================
const S7 = {
  eyebrow: L('NEGA TO\'RT XIL', 'ПОЧЕМУ ЧЕТЫРЕ ВИДА', 'WHY FOUR KINDS'),
  title: L(
    "Nega to'rt xil sonli oraliq bor",
    'Почему бывает четыре вида числовых промежутков',
    'Why there are four kinds of number intervals',
  ),
  audio: [
    A('mount',
      "Har bir chegara mustaqil ravishda kirishi yoki chiqishi mumkin.",
      'Каждая граница может независимо входить или не входить.',
      'Each boundary can independently be included or excluded.'),
    W('p2',
      "Ikkalasi ham kirsa, kesma. Ikkalasi ham chiqsa, interval.",
      'Если обе входят, это отрезок. Если обе не входят, это интервал.',
      'If both are included, it is a segment. If both are excluded, it is an interval.'),
    W('p4',
      "Bittasi kirib, ikkinchisi chiqsa, yarim-interval chiqadi.",
      'Если одна входит, а другая не входит, выходит полуинтервал.',
      'If one is included and the other is not, a half-interval results.',
    ),
  ],
  props: {
    tokens: [
      { t: '[a', id: 'a' },
      { t: ' ; ', id: 'sign' },
      { t: 'b]', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qadam. Chap chegara: kirsa kvadrat qavs, chiqsa oddiy qavs.",
          'Первый шаг. Левая граница: входит — квадратная скобка, не входит — круглая.',
          'Step one. The left boundary: included, a square bracket; excluded, a round one.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi qadam. O'ng chegara ham xuddi shunday, mustaqil tanlanadi.",
          'Второй шаг. Правая граница выбирается точно так же, независимо.',
          'Step two. The right boundary is chosen the same way, independently.',
        ),
      },
      {
        focus: 'sign',
        text: L(
          "Uchinchi qadam. Ikki chegara mustaqil bo'lgani uchun to'rt kombinatsiya chiqadi.",
          'Третий шаг. Так как границы независимы, получается четыре комбинации.',
          'Step three. Since the boundaries are independent, four combinations result.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Kvadrat va oddiy qavs bilan belgilash frantsuz matematigi Burbaki guruhi tomonidan yigirmanchi asrda keng tarqatilgan.",
        'Обозначение квадратными и круглыми скобками широко распространила французская группа математиков Бурбаки в двадцатом веке.',
        'Notation with square and round brackets was widely spread by the French mathematics group Bourbaki in the twentieth century.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 16-§, 96-97-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Kesma, interval, yarim-interval",
    'Отрезок, интервал, полуинтервал',
    'Segment, interval, half-interval',
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
      { id: 'f1', label: L("a ≤ x ≤ b to'plami kesma deyiladi", 'множество a ≤ x ≤ b называется отрезком', 'the set a ≤ x ≤ b is called a segment') },
      { id: 'f2', label: L("va [a; b] deb belgilanadi", 'и обозначается [a; b]', 'and is denoted [a; b]') },
      { id: 'f3', label: L("a < x < b to'plami interval deyiladi", 'множество a < x < b называется интервалом', 'the set a < x < b is called an interval') },
      { id: 'f4', label: L("va (a; b) deb belgilanadi", 'и обозначается (a; b)', 'and is denoted (a; b)') },
      { id: 'w1', label: L("ikkalasi ham bir xil qavs bilan yoziladi", 'оба записываются одной и той же скобкой', 'both are written with the same bracket') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Kesma va interval turli qavs bilan yoziladi, chegaralar kirishi turlicha.",
      'Так не складывается. Отрезок и интервал пишутся разными скобками, границы входят по-разному.',
      'That does not fit. A segment and an interval use different brackets; the boundaries are included differently.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 16-§, 96-97-bet",
        'Учебник, § 16, стр. 96–97',
        'Textbook, section 16, pages 96–97',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "[−2; 3] va (−2; 3) bir xil deb o'ylagandik",
        'Мы думали, что [−2; 3] и (−2; 3) — одно и то же',
        'We thought [−2; 3] and (−2; 3) were the same',
      ),
      right: L(
        "endi kesma va interval har xil ekanini bilamiz",
        'теперь знаем, что отрезок и интервал разные',
        'now we know a segment and an interval are different',
      ),
      winner: 'right',
      note: L(
        "Qavs turi chegaraning kirish-kirmasligini aytadi",
        'Тип скобки сообщает, входит граница или нет',
        'The bracket type tells whether the boundary is included',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): oraliqqa nom bering.
// ============================================================
const ASK_NAME = L('Bu qaysi oraliq?', 'Какой это промежуток?', 'Which interval is this?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Oraliqqa nom bering",
    'Назови промежуток',
    'Name the interval',
  ),
  audio: [
    A('mount',
      "Besh tengsizlik. Har biriga mos oraliq nomini toping.",
      'Пять неравенств. Для каждого найди подходящее название промежутка.',
      'Five inequalities. For each, find the matching interval name.'),
    A('why',
      "Ikki chegaraning kirish-kirmasligiga qarab nom tanlanadi.",
      'Название выбирается по тому, входят ли обе границы.',
      'The name is chosen by whether both boundaries are included.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar chegaralar nomni aniqlab bergan.",
      'Все пять разобраны. Каждый раз границы определяли название.',
      'All five are done. Each time the boundaries determined the name.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'2 ≤ x ≤ 9'}</Row>,
        ok: L("Ha. Ikkalasi ham kiradi, bu kesma.", 'Да. Обе входят, это отрезок.', 'Yes. Both are included, this is a segment.'),
        question: ASK_NAME,
        items: [
          { id: 'a', right: true, label: L('Kesma [2; 9]', 'Отрезок [2; 9]', 'Segment [2; 9]') },
          { id: 'b', label: L('Interval (2; 9)', 'Интервал (2; 9)', 'Interval (2; 9)'), hint: L("Belgilar qat'iy emas, ikkalasi ham kiradi, kesma bo'lishi kerak.", 'Знаки нестрогие, обе границы входят, должен быть отрезок.', 'The signs are not strict, both boundaries are included, it should be a segment.') },
        ],
        solution: ['2 ≤ x ≤ 9', '[2; 9]'],
      },
      {
        expr: <Row size="big" align="center">{'−1 < x < 5'}</Row>,
        ok: L("Ha. Ikkalasi ham chiqadi, bu interval.", 'Да. Обе исключаются, это интервал.', 'Yes. Both are excluded, this is an interval.'),
        question: ASK_NAME,
        items: [
          { id: 'a', right: true, label: L('Interval (−1; 5)', 'Интервал (−1; 5)', 'Interval (−1; 5)') },
          { id: 'b', label: L('Kesma [−1; 5]', 'Отрезок [−1; 5]', 'Segment [−1; 5]'), hint: L("Belgilar qat'iy, ikkalasi ham chiqadi, interval bo'lishi kerak.", 'Знаки строгие, обе границы исключаются, должен быть интервал.', 'The signs are strict, both boundaries are excluded, it should be an interval.') },
        ],
        solution: ['−1 < x < 5', '(−1; 5)'],
      },
      {
        expr: <Row size="big" align="center">{'0 ≤ x < 6'}</Row>,
        ok: L("Ha. Nol kiradi, olti chiqadi, bu yarim-interval.", 'Да. Нуль входит, шесть не входит, это полуинтервал.', 'Yes. Zero is included, six is not, this is a half-interval.'),
        question: ASK_NAME,
        items: [
          { id: 'a', right: true, label: L("Yarim-interval [0; 6)", 'Полуинтервал [0; 6)', 'Half-interval [0; 6)') },
          { id: 'b', label: L('Kesma [0; 6]', 'Отрезок [0; 6]', 'Segment [0; 6]'), hint: L("O'ng chegara qat'iy, olti chiqadi, kesma bo'la olmaydi.", 'Правая граница строгая, шесть не входит, это не может быть отрезок.', 'The right boundary is strict, six is excluded, it cannot be a segment.') },
        ],
        solution: ['0 ≤ x < 6', '[0; 6)'],
      },
      {
        expr: <Row size="big" align="center">{'3 < x ≤ 7'}</Row>,
        ok: L("Ha. Uch chiqadi, yetti kiradi, bu ham yarim-interval.", 'Да. Три не входит, семь входит, это тоже полуинтервал.', 'Yes. Three is excluded, seven is included, this too is a half-interval.'),
        question: ASK_NAME,
        items: [
          { id: 'a', right: true, label: L("Yarim-interval (3; 7]", 'Полуинтервал (3; 7]', 'Half-interval (3; 7]') },
          { id: 'b', label: L('Interval (3; 7)', 'Интервал (3; 7)', 'Interval (3; 7)'), hint: L("O'ng chegara qat'iy emas, yetti kiradi, interval bo'la olmaydi.", 'Правая граница нестрогая, семь входит, это не может быть интервал.', 'The right boundary is not strict, seven is included, it cannot be an interval.') },
        ],
        solution: ['3 < x ≤ 7', '(3; 7]'],
      },
      {
        expr: <Row size="big" align="center">{'−4 ≤ x ≤ −4'}</Row>,
        ok: L("Ha. Ikki chegara ustma-ust tushib, kesma bitta nuqtaga aylanadi.", 'Да. Две границы совпадают, отрезок стягивается в точку.', 'Yes. The two boundaries coincide, the segment shrinks to a point.'),
        question: ASK_NAME,
        items: [
          { id: 'a', right: true, label: L('Kesma [−4; −4], bitta nuqta', 'Отрезок [−4; −4], одна точка', 'Segment [−4; −4], one point') },
          { id: 'b', label: L("Bunday oraliq bo'lmaydi", 'Такого промежутка не бывает', 'No such interval exists'), hint: L("Chegaralar teng bo'lganda ham kesma bo'ladi, u yagona nuqtadan iborat.", 'Даже при равных границах это отрезок, состоящий из одной точки.', 'Even with equal boundaries it is a segment made of a single point.') },
        ],
        solution: ['−4 ≤ x ≤ −4', '[−4; −4]'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): oraliqni tengsizlikka aylantiring.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Oraliqni tengsizlikka aylantiring",
    'Преобрази промежуток в неравенство',
    'Turn the interval into an inequality',
  ),
  audio: [
    A('mount',
      "Uch oraliq belgisi. Har biriga mos tengsizlikni toping.",
      'Три обозначения промежутка. Для каждого найди неравенство.',
      'Three interval notations. For each, find the matching inequality.'),
    A('why',
      "Kvadrat qavs qat'iy emas belgi, oddiy qavs qat'iy belgi beradi.",
      'Квадратная скобка даёт нестрогий знак, а круглая строгий.',
      'A square bracket gives a non-strict sign, a round one a strict sign.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar qavs turi belgini aniqlab bergan.",
      'Все три разобраны. Каждый раз тип скобки определял знак.',
      'All three are done. Each time the bracket type determined the sign.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'[1; 6]'}</Row>,
        ok: L("Ha. Ikkalasi ham kvadrat qavs, ikkalasi ham qat'iy emas.", 'Да. Обе скобки квадратные, обе нестрогие.', 'Yes. Both brackets are square, both are non-strict.'),
        question: L("Qaysi tengsizlikka mos?", 'Какому неравенству соответствует?', 'Which inequality does it match?'),
        items: [
          { id: 'a', right: true, label: '1 ≤ x ≤ 6' },
          { id: 'b', label: '1 < x < 6', hint: L("Qavslar kvadrat, ikkalasi ham qat'iy emas bo'lishi kerak.", 'Скобки квадратные, оба знака должны быть нестрогими.', 'The brackets are square, both signs should be non-strict.') },
        ],
        solution: ['[1; 6]', '1 ≤ x ≤ 6'],
      },
      {
        expr: <Row size="big" align="center">{'(−3; 2)'}</Row>,
        ok: L("Ha. Ikkalasi ham oddiy qavs, ikkalasi ham qat'iy.", 'Да. Обе скобки круглые, обе строгие.', 'Yes. Both brackets are round, both are strict.'),
        question: L("Qaysi tengsizlikka mos?", 'Какому неравенству соответствует?', 'Which inequality does it match?'),
        items: [
          { id: 'a', right: true, label: '−3 < x < 2' },
          { id: 'b', label: '−3 ≤ x ≤ 2', hint: L("Qavslar oddiy, ikkalasi ham qat'iy bo'lishi kerak.", 'Скобки круглые, оба знака должны быть строгими.', 'The brackets are round, both signs should be strict.') },
        ],
        solution: ['(−3; 2)', '−3 < x < 2'],
      },
      {
        expr: <Row size="big" align="center">{'(0; 5]'}</Row>,
        ok: L("Ha. Chap oddiy qavs qat'iy, o'ng kvadrat qavs qat'iy emas.", 'Да. Левая круглая скобка строгая, правая квадратная нестрогая.', 'Yes. The left round bracket is strict, the right square bracket is non-strict.'),
        question: L("Qaysi tengsizlikka mos?", 'Какому неравенству соответствует?', 'Which inequality does it match?'),
        items: [
          { id: 'a', right: true, label: '0 < x ≤ 5' },
          { id: 'b', label: '0 ≤ x < 5', hint: L("Chap qavs oddiy, u qat'iy; o'ng qavs kvadrat, u qat'iy emas.", 'Левая скобка круглая, она строгая; правая квадратная, она нестрогая.', 'The left bracket is round, strict; the right is square, non-strict.') },
        ],
        solution: ['(0; 5]', '0 < x ≤ 5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): oraliqni son bilan
// tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Oraliqni son bilan tekshirish",
    'Проверка промежутка числом',
    'Checking the interval with a number',
  ),
  audio: [
    A('mount',
      "Uch taklif qilingan oraliq. Har birini chegara soni bilan tekshiring.",
      'Предложены три промежутка. Каждый проверь граничным числом.',
      'Three proposed intervals. Check each with a boundary number.'),
    A('why',
      "Chegara sonini olib, qavs uni kiritayotganini tekshiring.",
      'Возьми граничное число и проверь, включает ли его скобка.',
      'Take a boundary number and check whether the bracket includes it.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar chegara soni oraliqni tekshirib berdi.",
      'Все три разобраны. Каждый раз граничное число проверяло промежуток.',
      'All three are done. Each time a boundary number checked the interval.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'[2; 7)   →   x = 7'}</Row>,
        ok: L("Yo'q. O'ng qavs oddiy, yetti chiqarib tashlanadi.", 'Нет. Правая скобка круглая, семь исключается.', 'No. The right bracket is round, seven is excluded.'),
        question: L("Bu to'g'rimi?", 'Верно ли это?', 'Is this correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Yopiq qavs faqat kvadrat bo'lganda kiradi, bu yerda oddiy.", 'Точка входит только при квадратной скобке, а здесь она круглая.', 'The point is included only with a square bracket, but here it is round.') },
        ],
        solution: ['[2; 7)', L("yetti chiqarib tashlanadi", 'семь исключается', 'seven is excluded')],
      },
      {
        expr: <Row size="big" align="center">{'[−5; 0]   →   x = −5'}</Row>,
        ok: L("Ha. Chap qavs kvadrat, minus besh kiradi.", 'Да. Левая скобка квадратная, минус пять входит.', 'Yes. The left bracket is square, negative five is included.'),
        question: L("Bu to'g'rimi?", 'Верно ли это?', 'Is this correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Chap qavs kvadrat, chegara kiradi.", 'Левая скобка квадратная, граница входит.', 'The left bracket is square, the boundary is included.') },
        ],
        solution: ['[−5; 0]', L('minus besh kiradi', 'минус пять входит', 'negative five is included')],
      },
      {
        expr: <Row size="big" align="center">{'(1; 9)   →   x = 1'}</Row>,
        ok: L("Yo'q. Chap qavs oddiy, bir chiqarib tashlanadi.", 'Нет. Левая скобка круглая, единица исключается.', 'No. The left bracket is round, one is excluded.'),
        question: L("Bu to'g'rimi?", 'Верно ли это?', 'Is this correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Oddiy qavs chegarani chiqarib tashlaydi, bir kirmaydi.", 'Круглая скобка исключает границу, единица не входит.', 'A round bracket excludes the boundary; one is not included.') },
        ],
        solution: ['(1; 9)', L('bir chiqarib tashlanadi', 'единица исключается', 'one is excluded')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): qavs turi qat'iylikka
// mos kelmagan (З56).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Qavs to'g'ri tanlanganmi",
    'Верно ли выбрана скобка',
    'Was the bracket chosen correctly',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham qavs turi qat'iylikka mos kelmagan.",
      'Два задания. В обоих тип скобки не соответствует строгости.',
      'Two tasks. In both, the bracket type does not match the strictness.'),
    A('why',
      "Qat'iy belgi oddiy qavs, qat'iy bo'lmagan belgi kvadrat qavs beradi.",
      'Строгий знак даёт круглую скобку, а нестрогий квадратную.',
      'A strict sign gives a round bracket, a non-strict sign a square one.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Qavs turi har doim belgining qat'iyligiga bog'liq.",
      'Оба разобраны. Тип скобки всегда зависит от строгости знака.',
      'Both are done. The bracket type always depends on the strictness of the sign.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'2 < x ≤ 6   →   [2; 6]'}</Row>,
        ok: L("Ha. Chap belgi qat'iy, ikki chiqarib tashlanishi kerak, oddiy qavs bo'lishi kerak edi.", 'Да. Левый знак строгий, два должно исключаться, скобка должна быть круглой.', 'Yes. The left sign is strict, two should be excluded, the bracket should be round.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Chap qavs noto'g'ri tanlangan", 'Левая скобка выбрана неверно', 'The left bracket was chosen incorrectly') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, chap belgi qat'iy, chap qavs oddiy bo'lishi kerak.", 'Это и есть показанная ошибка, левый знак строгий, левая скобка должна быть круглой.', 'This is the very mistake shown; the left sign is strict, the left bracket should be round.') },
        ],
        solution: ['2 < x ≤ 6', '(2; 6]'],
      },
      {
        expr: <Row size="big" align="center">{'0 ≤ x < 9   →   (0; 9)'}</Row>,
        ok: L("Ha. Chap belgi qat'iy emas, nol kirishi kerak, kvadrat qavs bo'lishi kerak edi.", 'Да. Левый знак нестрогий, нуль должен входить, скобка должна быть квадратной.', 'Yes. The left sign is not strict, zero should be included, the bracket should be square.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Chap qavs noto'g'ri tanlangan", 'Левая скобка выбрана неверно', 'The left bracket was chosen incorrectly') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, chap belgi qat'iy emas, chap qavs kvadrat bo'lishi kerak.", 'Это и есть показанная ошибка, левый знак нестрогий, левая скобка должна быть квадратной.', 'This is the very mistake shown; the left sign is not strict, the left bracket should be square.') },
        ],
        solution: ['0 ≤ x < 9', '[0; 9)'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH (1-darsning `fill`): tengsizlikni qavs yozuviga
// aylantirish qadamlari.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Tengsizlikni qavs bilan yozing",
    'Запиши неравенство скобками',
    'Write the inequality with brackets',
  ),
  audio: [
    A('mount',
      "Qo'sh tengsizlik berilgan. Har bir chegaraga mos qavsni tanlang.",
      'Дано двойное неравенство. Выбери подходящую скобку для каждой границы.',
      'A double inequality is given. Choose the matching bracket for each boundary.'),
    A('why',
      "Qat'iy belgi oddiy qavs, qat'iy bo'lmagan belgi kvadrat qavs.",
      'Строгий знак даёт круглую скобку, а нестрогий квадратную.',
      'A strict sign gives a round bracket, a non-strict one a square bracket.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar ikki qavs to'g'ri tanlangan.",
      'Все три заполнены. Каждый раз обе скобки выбраны верно.',
      'All three are filled. Each time both brackets were chosen correctly.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['[', ']'],
      lines: [
        [{ t: '4 ≤ x ≤ 10   →   ' }, { slot: '[' }, { t: '4; 10' }, { slot: ']' }],
      ],
    },
    tasks: [
      {
        chips: ['(', ')'],
        lines: [
          [{ t: '−2 < x < 3   →   ' }, { slot: '(' }, { t: '−2; 3' }, { slot: ')' }],
        ],
      },
      {
        chips: ['[', ')'],
        lines: [
          [{ t: '1 ≤ x < 5   →   ' }, { slot: '[' }, { t: '1; 5' }, { slot: ')' }],
        ],
      },
      {
        chips: ['(', ']'],
        lines: [
          [{ t: '6 < x ≤ 12   →   ' }, { slot: '(' }, { t: '6; 12' }, { slot: ']' }],
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
    "Sonli oraliqlar bo'yicha to'rt savol",
    'Четыре вопроса о числовых промежутках',
    'Four questions about number intervals',
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
        id: 'q1', tag: 'З56',
        ask: L('2 < x < 8 qanday belgilanadi?', 'Как обозначается 2 < x < 8?', 'How is 2 < x < 8 denoted?'),
        options: [
          { id: 'ok', right: true, label: '(2; 8)' },
          { id: 'square', label: '[2; 8]' },
          { id: 'half1', label: '[2; 8)' },
          { id: 'half2', label: '(2; 8]' },
        ],
        hint: L("Ikkalasi ham qat'iy, ikkalasi ham oddiy qavs.", 'Оба строгие, обе скобки круглые.', 'Both are strict, both brackets are round.'),
        ok: L("To'g'ri, ikkalasi ham chiqadi.", 'Верно, обе границы исключаются.', 'Correct, both boundaries are excluded.'),
      },
      {
        id: 'q2', tag: 'З54',
        ask: L('[5; 5] to\'plamida nechta son bor?', 'Сколько чисел в множестве [5; 5]?', 'How many numbers are in the set [5; 5]?'),
        options: [
          { id: 'ok', right: true, label: L('Bitta', 'Одно', 'One') },
          { id: 'none', label: L('Bitta ham yo\'q', 'Ни одного', 'None') },
          { id: 'inf', label: L('Cheksiz ko\'p', 'Бесконечно много', 'Infinitely many') },
        ],
        hint: L("Ikki chegara ustma-ust tushganda kesma yagona nuqtaga aylanadi.", 'Когда границы совпадают, отрезок стягивается в одну точку.', 'When the boundaries coincide, the segment shrinks to a single point.'),
        ok: L("To'g'ri, faqat besh soni.", 'Верно, только число пять.', 'Correct, only the number five.'),
      },
      {
        id: 'q3', tag: 'З56',
        ask: L('x ≥ 3 qanday belgilanadi?', 'Как обозначается x ≥ 3?', 'How is x ≥ 3 denoted?'),
        options: [
          { id: 'ok', right: true, label: '[3; +∞)' },
          { id: 'wrong', label: '(3; +∞)' },
          { id: 'wrong2', label: '[3; +∞]' },
        ],
        hint: L("Uch kiradi, kvadrat qavs; cheksizlikda chegara yo'q, doim oddiy qavs.", 'Три входит, квадратная скобка; у бесконечности границы нет, всегда круглая скобка.', 'Three is included, a square bracket; infinity has no boundary, always a round bracket.'),
        ok: L("To'g'ri, uch kiradi, cheksizlik doim ochiq.", 'Верно, три входит, бесконечность всегда открыта.', 'Correct, three is included, infinity is always open.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('(4; 10] da x = 4 bormi?', 'Есть ли x = 4 в (4; 10]?', 'Is x = 4 in (4; 10]?'),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Chap qavs oddiy, to'rt chiqarib tashlanadi.", 'Левая скобка круглая, четыре исключается.', 'The left bracket is round, four is excluded.'),
        ok: L("To'g'ri, to'rt kirmaydi.", 'Верно, четыре не входит.', 'Correct, four is not included.'),
      },
      {
        id: 'q5', tag: 'З56',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "1 ≤ x < 6 ni qavs bilan yozing.",
            'Запиши 1 ≤ x < 6 скобками.',
            'Write 1 ≤ x < 6 with brackets.',
          ),
          lines: [
            [{ slot: '[' }, { t: '1; 6' }, { slot: ')' }],
          ],
          tiles: [
            { id: 't1', v: '[', x: 12, y: 12 },
            { id: 't2', v: ')', x: 70, y: 14 },
            { id: 't3', v: '(', x: 40, y: 50 },
            { id: 't4', v: ']', x: 78, y: 48 },
          ],
          hint: L(
            "Chap belgi qat'iy emas, o'ng belgi qat'iy.",
            'Левый знак нестрогий, правый строгий.',
            'The left sign is not strict, the right one is strict.',
          ),
          doneNote: L(
            "Yig'ildi. Chap kvadrat qavs, o'ng oddiy qavs.",
            'Собрано. Слева квадратная скобка, справа круглая.',
            'Assembled. A square bracket on the left, a round one on the right.',
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
    "Qavs turi chegaraning kirish-kirmasligini aytadi",
    'Тип скобки сообщает, входит граница или нет',
    'The bracket type tells whether the boundary is included',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. Uch kichik x kichik yoki teng sakkiz, javobi ochiq-yopiq qavs uch, sakkiz kvadrat qavs.",
      'С урока остаётся одна запись. Три меньше x меньше либо равно восьми, ответ круглая-квадратная скобка три, восемь.',
      'One record stays with you. Three less than x less than or equal to eight, the answer a round-square bracket three, eight.'),
    A('s1',
      "Bugun uch narsa qilindi. Ochiq va yopiq nuqtani eslading, ularni qavs turiga bog'ladingiz va yarim-interval bilan tanishdingiz.",
      'Сегодня сделано три вещи. Ты вспомнил открытую и закрытую точку, связал их с типом скобки и познакомился с полуинтервалом.',
      'Three things are done today. You recalled the open and closed point, linked them to the bracket type, and met the half-interval.'),
    A('s2',
      "Keyingi darsda tengsizliklar orqali masalalar yechish. Sonli oraliqlar javobni yozishda kerak bo'ladi.",
      'В следующем уроке решение задач с помощью неравенств. Числовые промежутки понадобятся при записи ответа.',
      'The next lesson covers solving word problems using inequalities. Number intervals will be needed to write the answer.',
    ),
  ],
  props: {
    mark: '3 < x ≤ 8   →   (3; 8]',
    markNote: L(
      "chap chiqadi, o'ng kiradi",
      'левая исключается, правая входит',
      'the left is excluded, the right is included',
    ),
    lines: [
      L(
        "ikkalasi ham kirsa kesma, [a; b]",
        'Если обе входят, отрезок, [a; b]',
        'If both are included, a segment, [a; b]',
      ),
      L(
        "ikkalasi ham chiqsa interval, (a; b)",
        'Если обе исключаются, интервал, (a; b)',
        'If both are excluded, an interval, (a; b)',
      ),
      L(
        "bittasi kirib ikkinchisi chiqsa, yarim-interval",
        'Если одна входит, а другая нет, полуинтервал',
        'If one is included and the other is not, a half-interval',
      ),
    ],
    bridge: L(
      "Keyingi dars: tengsizliklar orqali masalalar yechish",
      'Следующий урок: решение задач с помощью неравенств',
      'Next lesson: solving problems using inequalities',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — QAVS YOZUVIGA O'TISH (`twosides`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З54', 'З56', 'З56',
    'З56', 'З56', 'З56', 'З56', 'З56',
    'З16', 'З56', 'З56', null, null,
  ],
  mechanic: { at: 5, tool: 'twosides', kind: 'notation' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
