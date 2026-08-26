// ============================================================================
// 8-sinf, Dars 17. KVADRAT TENGLAMA ILDIZLARI FORMULASI.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `squarecut.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `squarecut`: to'la kvadratni ajratish
// usuli — formula shundan chiqariladi, yodlanmaydi.
//
// DARSNING UCH ISHI (darslik, 24-§, 141-144-bet):
//   1) to'la kvadratni ajratish usuli — tenglamaning chap qismida
//      ikkihadning to'la kvadrati hosil qilinadi;
//   2) shu usul umumiy holda qo'llanib, formula chiqariladi:
//      x1,2 = (−b ± √(b² − 4ac)) / (2a);
//   3) b² − 4ac ifoda DISKRIMINANT deyiladi (D harfi bilan belgilanadi).
//      D ning uch holi (D>0, D=0, D<0) shu darsda faqat AYTILADI —
//      chuqur o'rganish 18-darsda.
//
// XUKDAN QOLGAN QARZ. 15- va 16-darslarda "3x² − 4x − 27 = 0" to'liq
// tenglama sifatida qoldirilgan edi ("formula keyingi darsda"). Bu yerda
// shu qarz to'lanadi — QOIDA ekranida, lekin javob CHIROYLI SON EMAS: bu
// atayin, chunki formula har qanday sonda ishlaydi, faqat chiroyli
// misollarda emas.
//
// DARSLIK. O'zbek darsligi, 24-§, 141-144-bet: to'la kvadratni ajratish
// misollari (141-142-bet), umumiy formula chiqarilishi (143-bet),
// diskriminant ta'rifi va uch holi (144-bet).
//
// ADASHISHLAR: bittasi yangi, ikkitasi qaytadi:
//   З44 — manfiy b ning ishorasi formulaning minus b qismida noto'g'ri
//         qo'llanildi;
//   З40 — kvadrat ildiz olinganda faqat musbat javob yozildi, plyus-minus
//         unutildi (13-darsdan qaytadi);
//   З38 — a nolga teng bo'lishi mumkin deb o'ylandi (15-darsdan qaytadi,
//         endi formula maxrajida);
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
  id: 'alg-8-17',
  n: 17,
  row: 19,
  block: 'Б3',
  topic: L(
    'Kvadrat tenglama ildizlari formulasi',
    'Формула корней квадратного уравнения',
    'The formula for the roots of a quadratic equation',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "to'la kvadratni ajratish usuli tenglamaning chap qismida ikkihadning to'la kvadratini hosil qiladi",
    'Метод выделения полного квадрата превращает левую часть уравнения в квадрат двучлена',
    'Completing the square turns the left side of the equation into the square of a binomial',
  ),
  L(
    "x1,2 = (−b ± √(b² − 4ac)) / (2a)",
    'x1,2 = (−b ± √(b² − 4ac)) / (2a)',
    'x1,2 equals negative b plus or minus the root of b squared minus 4ac, over 2a',
  ),
  L(
    "b² − 4ac ifoda diskriminant deyiladi va D harfi bilan belgilanadi",
    'Выражение b² − 4ac называется дискриминантом и обозначается буквой D',
    'The expression b squared minus 4ac is called the discriminant and is denoted by D',
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
      "a nolga teng bo'lishi mumkin deb o'ylandi, endi formula maxrajida",
      'a посчитано способным равняться нулю, теперь уже в знаменателе формулы',
      'a was assumed able to equal zero, now in the denominator of the formula',
    ),
    wrong: '1/(2*0)',
    at: 3,
  },
  'З40': {
    what: L(
      "kvadrat ildiz olinganda faqat musbat javob yozildi, plyus-minus unutildi",
      'при извлечении квадратного корня записан только положительный ответ, плюс-минус забыт',
      'when taking the square root, only the positive answer was written, plus-or-minus forgotten',
    ),
    wrong: '4',
    at: 6,
  },
  'З44': {
    what: L(
      "manfiy b ning ishorasi formulaning minus b qismida noto'g'ri qo'llanildi",
      'знак отрицательного b неверно применён в части формулы «минус b»',
      "a negative b's sign was mishandled in the formula's negative-b part",
    ),
    wrong: '(-6+sqrt(16))/2',
    at: 12,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: 15-16-darslardan qolgan to'liq tenglama.
// Yakun: umumiy formula, D harfi bilan.
// ============================================================
const SC_DEBT = L('OLDINGI DARSLARDAN QARZ', 'ДОЛГ С ПРОШЛЫХ УРОКОВ', 'A DEBT FROM PAST LESSONS')
const SC_FORM = L('FORMULA', 'ФОРМУЛА', 'THE FORMULA')

const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Uch had ham bor: a, b va c",
      'Есть все три члена: a, b и c',
      'All three terms are present: a, b, and c',
    )}>
      <text x="200" y="65" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18"
        fill={T.ink}>{'3x² − 4x − 27 = 0'}</text>

      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="98" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="105" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="130" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_DEBT)}</text>
    </SceneBand>
  )
}

const FinalScene = () => {
  const t = useT()
  return (
    <SceneBand kind="final" label={L(
      "Formula har qanday kvadrat tenglamani yechadi",
      'Формула решает любое квадратное уравнение',
      'The formula solves any quadratic equation',
    )}>
      <text x="200" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
        fill={T.ink}>{'x1,2 = (−b ± √D) / 2a'}</text>
      <g className="g8-seat" style={{ '--d': '600ms' }}>
        <text x="200" y="56" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="8" letterSpacing="0.14em" fill={T.ok}>{t(SC_FORM)}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <text x="200" y="76" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
          fill={T.graph}>{'D = b² − 4ac'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('ENDI YECHA OLAMIZMI', 'МОЖЕМ ЛИ ТЕПЕРЬ РЕШИТЬ', 'CAN WE SOLVE IT NOW'),
  title: L(
    "3x kvadrat minus 4x minus 27 teng nolni endi yecha olamizmi",
    'Можем ли мы теперь решить три икс квадрат минус четыре икс минус двадцать семь равно нулю',
    'Can we now solve three x squared minus four x minus twenty seven equals zero',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Bu tenglamada uch had ham bor, uni oldingi ikki darsda chala usullar bilan yecha olmadik.",
      'В этом уравнении есть все три члена, и в прошлые два урока мы не могли решить его неполными способами.',
      'This equation has all three terms, and in the past two lessons we could not solve it with the incomplete methods.'),
    A('why',
      "Taxmin qiling, bugun uni yecha olamizmi.",
      'Предположи, сможем ли мы решить его сегодня.',
      'Predict whether we can solve it today.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, bugun uni yecha olamizmi?",
      'Как думаешь, сможем мы решить его сегодня?',
      'Do you think we can solve it today?',
    ),
    items: [
      { id: 'yes', show: L('Ha, hozir', 'Да, сейчас', 'Yes, now') },
      { id: 'no', show: L("Yo'q, hali ham yo'q", 'Нет, всё ещё нет', 'No, still not') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Ikkihadning kvadrati: (x + m)² = x² + 2mx + m².
// Shu tayanch 5, 7 va 8-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Ikkihadning kvadrati",
    'Квадрат двучлена',
    'The square of a binomial',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida yoyish to'g'ri.",
      'Четыре записи. Только в одной раскрытие верно.',
      'Four records. Only one has the expansion correct.'),
    A('why',
      "O'rtadagi had ikki karra ikkita songa ko'paytmasidan chiqadi.",
      'Средний член получается умножением двух чисел на два.',
      'The middle term comes from multiplying the two numbers by two.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuvda (x + 3)² to'g'ri yoyilgan?",
      'В какой записи (x + 3)² верно раскрыто?',
      'In which record is (x + 3)² correctly expanded?',
    ),
    items: [
      { id: 'right', show: 'x² + 6x + 9', right: true, name: L('o\'rtadagi had ikki karra uch', 'средний член дважды три', 'middle term twice three') },
      {
        id: 'noMid', show: 'x² + 9',
        hint: L("O'rtadagi had tushib qoldi, u ikki karra iks karra uch.", 'Средний член потерян, это дважды икс на три.', 'The middle term is lost; it is twice x times three.'),
      },
      {
        id: 'wrongMid', show: 'x² + 3x + 9',
        hint: L("O'rtadagi had uch iks emas, olti iks bo'lishi kerak.", 'Средний член не три икс, а должен быть шесть икс.', 'The middle term is not three x, it must be six x.'),
      },
      {
        id: 'wrongLast', show: 'x² + 6x + 3',
        hint: L("Oxirgi had uch emas, uch ning kvadrati, ya'ni to'qqiz bo'lishi kerak.", 'Последний член не три, а квадрат трёх, то есть девять.', 'The last term is not three, it must be three squared, that is nine.'),
      },
    ],
    after: L(
      "To'g'ri. O'rtadagi had ikki karra ko'paytma, oxirgi had kvadrat.",
      'Верно. Средний член, удвоенное произведение, последний, квадрат.',
      'Correct. The middle term is twice the product, the last term is the square.',
    ),
  },
}

// ============================================================
// EKRAN 3. A NI BURANG (1-darsning `steppers`). Natija — bir bo'lingan
// ikki karra a ga, ya'ni formulaning maxraji. a nolga tushganda qiymat
// yo'qoladi — З38 endi formula ichida.
// ============================================================
const S3 = {
  eyebrow: L('A NI BURANG', 'КРУТИ A', 'TURN A'),
  title: L(
    "Formulaning maxraji",
    'Знаменатель формулы',
    'The denominator of the formula',
  ),
  audio: [
    A('mount',
      "Formulada iks ikki karra a ga bo'linadi. Natija bir bo'lingan ikki karra a ga teng bo'lsin.",
      'В формуле икс делится на два, умноженное на a. Пусть результат равен единице, делённой на два a.',
      'In the formula x is divided by two times a. Let the result equal one divided by two a.'),
    A('why',
      "Uch maqsad beriladi. a ning turli qiymatlarida natijani toping.",
      'Даны три цели. Находи результат при разных значениях a.',
      'Three targets are given. Find the result at different values of a.'),
    A('why',
      "Oxirida a ni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти a до нуля и посмотри, что будет.',
      'At the end bring a down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'a', label: L('a ning qiymati', 'значение a', 'the value of a'),
        start: 4, min: 0, max: 8, step: 0.5, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : Math.round((1 / (2 * v[0])) * 100) / 100),
    resultLabel: L('1 : (2a)', '1 : (2a)', '1 : (2a)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "a hali nolga tushmasin, avval maqsadlarni oling.",
      'a пока не опускай до нуля, сначала возьми цели.',
      'Do not bring a to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: 0.25,
        ask: L("Natija 0,25 ga teng bo'lsin", 'Пусть результат будет равен 0,25', 'Make the result equal 0.25'),
        after: L(
          "Nol butun yigirma besh. a ikkiga teng bo'lganda maxraj to'rt bo'ladi.",
          'Ноль целых двадцать пять. При a равном двум знаменатель равен четырём.',
          'Zero point two five. With a equal to two, the denominator is four.',
        ),
      },
      {
        value: 0.5,
        ask: L("Endi natija 0,5 ga teng bo'lsin", 'Теперь пусть результат будет равен 0,5', 'Now make the result equal 0.5'),
        after: L(
          "Nol butun besh. a birga teng bo'lganda maxraj ikki bo'ladi.",
          'Ноль целых пять. При a равном одному знаменатель равен двум.',
          'Zero point five. With a equal to one, the denominator is two.',
        ),
      },
      {
        value: 1,
        ask: L("Oxirgisi, natija 1 ga teng bo'lsin", 'Последняя, пусть результат будет равен 1', 'The last one, make the result equal 1'),
        after: L(
          "Bir. a nol butun besh bo'lganda maxraj bir bo'ladi.",
          'Один. При a равном нулю целых пяти знаменатель равен единице.',
          'One. With a equal to zero point five, the denominator is one.',
        ),
      },
    ],
    ask: L("Natija 0,25 ga teng bo'lsin", 'Пусть результат будет равен 0,25', 'Make the result equal 0.25'),
    ask2: L("Endi a ni nolga tushiring", 'Теперь опусти a до нуля', 'Now bring a down to zero'),
    broke: L(
      "a nolga teng bo'lsa, formulaning maxraji ham nolga aylanadi, bo'linish yo'q. Shuning uchun formula faqat a nolga teng bo'lmaganda ishlaydi.",
      'Если a равно нулю, знаменатель формулы тоже становится нулём, а деления не существует. Поэтому формула работает только когда a не равно нулю.',
      'If a equals zero, the denominator of the formula also becomes zero, and division by it has no value. That is why the formula only works when a is not zero.',
    ),
  },
}

// ============================================================
// EKRAN 4. A, B, C NI FORMULAGA QO'YISH (1-darsning `pick`).
// ============================================================
const S4 = {
  eyebrow: L('FORMULAGA QO\'YAMIZ', 'ПОДСТАВЛЯЕМ В ФОРМУЛУ', 'PLUGGING INTO THE FORMULA'),
  title: L(
    "5x kvadrat minus 3x minus 2 teng nol uchun a, b, c",
    'a, b, c для пяти икс квадрат минус три икс минус два равно нулю',
    'a, b, c for five x squared minus three x minus two equals zero',
  ),
  audio: [
    A('mount',
      "Formulaga qo'yishdan oldin a, b, c ni to'g'ri o'qish kerak.",
      'Перед подстановкой в формулу нужно верно прочитать a, b, c.',
      'Before plugging into the formula, a, b, and c must be read correctly.'),
    A('why',
      "Har had o'z ishorasi bilan birga o'qiladi.",
      'Каждый член читается вместе со своим знаком.',
      'Each term is read together with its own sign.'),
  ],
  props: {
    ask: L(
      "a, b, c to'g'ri qaysi?",
      'Какие a, b, c верны?',
      'Which a, b, c are correct?',
    ),
    items: [
      { id: 'right', show: 'a = 5,  b = −3,  c = −2', right: true },
      {
        id: 'signB', show: 'a = 5,  b = 3,  c = −2',
        hint: L("Ikkinchi had minus uch iks, ishorasi minus.", 'Второй член минус три икс, знак минус.', 'The second term is negative three x, the sign is negative.'),
      },
      {
        id: 'signC', show: 'a = 5,  b = −3,  c = 2',
        hint: L("Ozod had minus ikki, ishorasi minus.", 'Свободный член минус два, знак минус.', 'The constant term is negative two, the sign is negative.'),
      },
      {
        id: 'swap', show: 'a = 5,  b = −2,  c = −3',
        hint: L("b va c almashtirilgan. b iks oldida, c iksisiz turadi.", 'b и c поменяны местами. b стоит при иксе, c без икса.', 'b and c are swapped. b sits with x, c stands without x.'),
      },
    ],
    after: L(
      "To'g'ri. Har had o'z ishorasi bilan formulaga qo'yiladi.",
      'Верно. Каждый член подставляется в формулу со своим знаком.',
      'Correct. Each term is plugged into the formula with its own sign.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — TO'LA KVADRATNI AJRATISH (`squarecut`).
// Darslik 1-masalasi: x² + 2x − 3 = 0.
// ============================================================
const S5 = {
  eyebrow: L('TO\'LA KVADRATNI AJRATISH', 'ВЫДЕЛЕНИЕ ПОЛНОГО КВАДРАТА', 'COMPLETING THE SQUARE'),
  title: L(
    "Iks kvadrat plyus 2x ni to'la kvadratga keltiring",
    'Доведи икс квадрат плюс два икс до полного квадрата',
    'Bring x squared plus two x to a complete square',
  ),
  audio: [
    A('mount',
      "Iks kvadrat plyus ikki iks. Kvadrat va unga tutashgan tasma turadi.",
      'Икс квадрат плюс два икс. Стоит квадрат и прилегающая к нему полоса.',
      'x squared plus two x. A square stands with a strip attached to it.'),
    A('why',
      "Tasmani ikkiga kesib, yarmini kvadratning pastki tomoniga biriktiring.",
      'Разрежь полосу пополам и приложи половину к нижней стороне квадрата.',
      'Cut the strip in half and attach one half to the bottom side of the square.'),
    W('attach',
      "Burchakda dyra qoldi. Uning yuzi qancha ekanini toping.",
      'В углу осталась дырка. Найди, чему равна её площадь.',
      'A hole is left in the corner. Find its area.'),
  ],
  props: {
    b: 2,
    label: 'x² + 2x',
    cutLabel: L('Kesish', 'Разрезать', 'Cut'),
    attachLabel: L('Biriktirish', 'Приложить', 'Attach'),
    fields: [
      {
        ask: L("Dyra qancha?", 'Чему равна дырка?', 'What is the hole?'),
        answer: '1',
        accepts: ['(2/2)^2', '1^2'],
        hints: {
          '2': L("Ikkini ikkiga bo'lish kerak edi, so'ng kvadratga oshirish.", 'Сначала нужно было разделить два на два, потом возвести в квадрат.', 'Two should first be halved, then squared.'),
          '4': L("Kvadratga oshirishdan oldin ikkiga bo'lish kerak edi.", 'Перед возведением в квадрат нужно было разделить на два.', 'Before squaring, it should have been halved.'),
        },
        kind: 'number',
      },
    ],
    note: L(
      "Dyra bir. Demak (x + 1)² = 3 + 1 = 4, bundan x + 1 = ±2, x = 1 yoki x = −3.",
      'Дырка равна единице. Значит (x + 1)² = 3 + 1 = 4, отсюда x + 1 = ±2, x = 1 или x = −3.',
      'The hole is one. So (x + 1) squared equals 3 plus 1, that is 4, so x plus 1 equals plus or minus 2, and x equals 1 or x equals negative 3.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): shu tenglamani ikki yo'l
// bilan tugatish — davom ettirish yoki formula.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Yechimni ikki yo'l bilan tugatish",
    'Довести решение до конца двумя способами',
    'Finishing the solution two ways',
  ),
  audio: [
    A('mount',
      "Bitta tenglama va ikki yo'l. Ikkalasi ham bir xil javob beradi.",
      'Одно уравнение и два пути. Оба дают один ответ.',
      'One equation and two ways. Both give the same answer.'),
    W('w2',
      "Birinchi yo'lda to'la kvadratni ajratish davom ettiriladi.",
      'В первом пути продолжается выделение полного квадрата.',
      'In the first way, completing the square continues.'),
    W('w4',
      "Ikkinchi yo'lda a, b, c to'g'ridan to'g'ri formulaga qo'yiladi.",
      'Во втором пути a, b, c подставляются прямо в формулу.',
      'In the second way, a, b, and c are plugged straight into the formula.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L("1-USUL — DAVOM ETTIRISH", 'СПОСОБ 1 — ПРОДОЛЖИТЬ', 'METHOD 1 — CONTINUE'),
        lead: L(
          "Dyra topildi, endi tenglikni yechamiz",
          'Дырка найдена, теперь решаем равенство',
          'The hole is found, now we solve the equality',
        ),
        rows: [
          { text: '(x + 1)² = 4' },
          { text: 'x + 1 = ±2', tone: 'ok', note: L('ikki holat', 'два случая', 'two cases') },
          { text: 'x = 1,  x = −3', tone: 'ok' },
        ],
      },
      {
        name: L("2-USUL — FORMULAGA QO'YISH", 'СПОСОБ 2 — ПОДСТАВИТЬ В ФОРМУЛУ', 'METHOD 2 — PLUG INTO THE FORMULA'),
        lead: L(
          "a = 1, b = 2, c = −3 ni formulaga qo'yamiz",
          'Подставляем a = 1, b = 2, c = −3 в формулу',
          'We plug a = 1, b = 2, c = −3 into the formula',
        ),
        rows: [
          { text: 'D = 4 + 12 = 16' },
          { text: 'x = (−2 ± 4) / 2', tone: 'ok' },
          { text: 'x = 1,  x = −3', tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('FORMULA SHU USULNING QISQARTMASI', 'ФОРМУЛА — СОКРАЩЁННАЯ ЗАПИСЬ ЭТОГО СПОСОБА', 'THE FORMULA IS A SHORTCUT FOR THIS METHOD'),
        lead: L(
          "Formula har safar to'la kvadratni qaytadan chiqarmaslik uchun kerak",
          'Формула нужна, чтобы не выводить полный квадрат каждый раз заново',
          'The formula exists so completing the square is not redone every time',
        ),
        rows: [{ text: 'x = 1,  x = −3', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): umumiy formulaning chiqarilishi.
// ============================================================
const S7 = {
  eyebrow: L('FORMULA QAYERDAN CHIQADI', 'ОТКУДА БЕРЁТСЯ ФОРМУЛА', 'WHERE THE FORMULA COMES FROM'),
  title: L(
    "Umumiy formulaning chiqarilishi",
    'Вывод общей формулы',
    'The derivation of the general formula',
  ),
  audio: [
    A('mount',
      "ax kvadrat plyus bx plyus c teng nolni a ga bo'lib, xuddi shu usulni takrorlaymiz.",
      'Разделив a икс квадрат плюс b икс плюс c равно нулю на a, повторяем тот же способ.',
      'Dividing a x squared plus b x plus c equals zero by a, we repeat the same method.'),
    W('p2',
      "To'la kvadratni ajratib, dyra ikkidan a ga bo'lingan b ning kvadratiga teng chiqadi.",
      'Выделяя полный квадрат, дырка выходит равной квадрату b, делённого на два a.',
      'Completing the square, the hole comes out equal to the square of b divided by two a.'),
    W('p4',
      "Ildiz olinganda plyus-minus paydo bo'ladi, va iks yolgiz qoldirilganda formula chiqadi.",
      'При извлечении корня появляется плюс-минус, и когда икс остаётся один, выходит формула.',
      'Taking the root brings a plus-or-minus, and isolating x gives the formula.',
    ),
  ],
  props: {
    frac: {
      num: [
        { t: '−b', id: 'nb' },
        { t: ' ± ', id: 'pm' },
        { t: '√(b² − 4ac)', id: 'root' },
      ],
      den: [{ t: '2a', id: 'den' }],
    },
    steps: [
      {
        focus: 'root',
        text: L(
          "Birinchi qadam. To'la kvadratni ajratib, tenglikning o'ng qismida b kvadrat minus to'rt ac chiqadi.",
          'Первый шаг. Выделив полный квадрат, справа выходит b в квадрате минус четыре ac.',
          'Step one. Completing the square, the right side comes out to b squared minus four ac.',
        ),
      },
      {
        focus: 'pm',
        text: L(
          "Ikkinchi qadam. Ikki tomondan ildiz olinganda plyus-minus paydo bo'ladi, chunki ishora yo'qolgan edi.",
          'Второй шаг. При извлечении корня из обеих частей появляется плюс-минус, потому что знак был потерян.',
          'Step two. Taking the root of both sides brings a plus-or-minus, because the sign had been lost.',
        ),
      },
      {
        focus: 'den',
        text: L(
          "Uchinchi qadam. Iks yolgiz qoldirilganda maxrajda ikki a qoladi.",
          'Третий шаг. Когда икс остаётся один, в знаменателе остаётся два a.',
          'Step three. Isolating x, two a remains in the denominator.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Diskriminant so'zi lotincha «ajratuvchi» degan ma'noni beradi, chunki u ildizlar sonini bir-biridan ajratib beradi.",
        'Слово дискриминант с латинского означает различающий, потому что он различает, сколько корней у уравнения.',
        'The word discriminant comes from Latin for distinguishing, because it distinguishes how many roots the equation has.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 24-§, 143-144-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Ildizlar formulasi",
    'Формула корней',
    'The formula for the roots',
  ),
  audio: [
    A('mount',
      "Formula uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для формулы, ты уже видел. Теперь собери её.',
      'Everything the formula needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik formulasi ochildi, va xukdagi qarz to'landi.",
      'Открылась формула из учебника, и долг с хука оплачен.',
      'The textbook formula opened, and the debt from the hook is paid.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("Iks bir, ikkiga teng minus b plyus-minus b kvadrat minus to'rt ac dan ildiz", 'x один, два равно минус b плюс-минус корень из b квадрат минус четыре ac', 'x one, two equals negative b plus or minus the root of b squared minus four ac') },
      { id: 'f2', label: L("bularning yig'indisi ikkiga a ga bo'linadi", 'и всё это делится на два a', 'all divided by two a') },
      { id: 'f3', label: L("b kvadrat minus to'rt ac ifoda", 'выражение b квадрат минус четыре ac', 'the expression b squared minus four ac') },
      { id: 'f4', label: L("diskriminant deyiladi, D harfi bilan belgilanadi", 'называется дискриминантом и обозначается буквой D', 'is called the discriminant and denoted by the letter D') },
      { id: 'w1', label: L("maxraj har doim ikkiga teng", 'знаменатель всегда равен двум', 'the denominator is always two') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Maxraj ikkiga TENG EMAS, u ikkiga a ga ko'paytmasi.",
      'Так не складывается. Знаменатель не равен двум, он равен произведению двух и a.',
      'That does not fit. The denominator is not two, it is two times a.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 24-§, 143–144-bet",
        'Учебник, § 24, стр. 143–144',
        'Textbook, section 24, pages 143–144',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "3x kvadrat minus 4x minus 27 teng nolni hali yecholmaymiz",
        'три икс квадрат минус четыре икс минус двадцать семь равно нулю мы пока не решаем',
        'we still cannot solve three x squared minus four x minus twenty seven equals zero',
      ),
      right: L(
        "endi formula bilan yechamiz, javobi chiroyli son bo'lmasa ham",
        'теперь решаем формулой, даже если ответ не красивое число',
        'now we solve it with the formula, even though the answer is not a neat number',
      ),
      winner: 'right',
      note: L(
        "Formula ishlaydi, chiroyli son bo'lishi shart emas",
        'Формула работает, красивое число не обязательно',
        'The formula works, the answer need not be neat',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): diskriminantni hisoblang.
// ============================================================
const ASK_D = L('D qanday?', 'Чему равно D?', 'What is D?')
const ASK_SOLVE = L('Tenglamani yeching', 'Решите уравнение', 'Solve the equation')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Diskriminantni hisoblang",
    'Вычисли дискриминант',
    'Compute the discriminant',
  ),
  audio: [
    A('mount',
      "Besh tenglama. Har birida D ni hisoblaymiz.",
      'Пять уравнений. В каждом вычисляем D.',
      'Five equations. In each, we compute D.'),
    A('why',
      "D b kvadrat minus to'rt ac ga teng.",
      'D равно b в квадрате минус четыре ac.',
      'D equals b squared minus four a c.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. D musbat, nol va manfiy bo'lgan hollar bor edi.",
      'Все пять разобраны. Были случаи с положительным, нулевым и отрицательным D.',
      'All five are done. There were cases with positive, zero, and negative D.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² + 5x + 6 = 0'}</Row>,
        ok: L("Ha. Yigirma besh minus yigirma to'rt bir chiqadi.", 'Да. Двадцать пять минус двадцать четыре даёт один.', 'Yes. Twenty five minus twenty four gives one.'),
        question: ASK_D,
        items: [
          { id: 'a', right: true, label: '1' },
          { id: 'b', label: '49', hint: L("Bu yigirma besh plyus yigirma to'rt, ammo minus bo'lishi kerak.", 'Это двадцать пять плюс двадцать четыре, а нужен минус.', 'That is twenty five plus twenty four, but it should be minus.') },
        ],
        solution: ['D = 25 − 24', '= 1'],
      },
      {
        expr: <Row size="big" align="center">{'2x² − 3x + 1 = 0'}</Row>,
        ok: L("Ha. To'qqiz minus sakkiz bir chiqadi.", 'Да. Девять минус восемь даёт один.', 'Yes. Nine minus eight gives one.'),
        question: ASK_D,
        items: [
          { id: 'a', right: true, label: '1' },
          { id: 'b', label: '17', hint: L("To'rt ac hisobida a ikki, c bir ekanini unutmang.", 'В четырёх ac не забывай, что a два, c один.', 'In four a c, remember a is two and c is one.') },
        ],
        solution: ['D = 9 − 8', '= 1'],
      },
      {
        expr: <Row size="big" align="center">{'x² − 4x + 4 = 0'}</Row>,
        ok: L("Ha. O'n olti minus o'n olti nol chiqadi.", 'Да. Шестнадцать минус шестнадцать даёт нуль.', 'Yes. Sixteen minus sixteen gives zero.'),
        question: ASK_D,
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '32', hint: L("To'rt ac ni ayirish kerak, qo'shish emas.", 'Четыре ac нужно вычитать, а не складывать.', 'Four a c must be subtracted, not added.') },
        ],
        solution: ['D = 16 − 16', '= 0'],
      },
      {
        expr: <Row size="big" align="center">{'x² + 2x + 5 = 0'}</Row>,
        ok: L("Ha. To'rt minus yigirma minus o'n olti chiqadi.", 'Да. Четыре минус двадцать даёт минус шестнадцать.', 'Yes. Four minus twenty gives negative sixteen.'),
        question: ASK_D,
        items: [
          { id: 'a', right: true, label: '−16' },
          { id: 'b', label: '16', hint: L("To'rt minus yigirma manfiy chiqadi.", 'Четыре минус двадцать даёт отрицательное число.', 'Four minus twenty gives a negative number.') },
        ],
        solution: ['D = 4 − 20', '= −16'],
      },
      {
        expr: <Row size="big" align="center">{'3x² + 2x − 1 = 0'}</Row>,
        ok: L("Ha. To'rt plyus o'n ikki o'n olti chiqadi.", 'Да. Четыре плюс двенадцать даёт шестнадцать.', 'Yes. Four plus twelve gives sixteen.'),
        question: ASK_D,
        items: [
          { id: 'a', right: true, label: '16' },
          { id: 'b', label: '−8', hint: L("C manfiy bir, va minus to'rt ac ikkita minusni yo'qotadi.", 'C минус один, и минус четыре ac убирает оба минуса.', 'c is negative one, and negative four a c cancels both minus signs.') },
        ],
        solution: ['D = 4 + 12', '= 16'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): formula bo'yicha to'liq yechish.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Formula bo'yicha yechimni toping",
    'Найди решение по формуле',
    'Find the solution using the formula',
  ),
  audio: [
    A('mount',
      "Uch tenglama. D hisoblangan, formulaga qo'ying.",
      'Три уравнения. D посчитан, подставь в формулу.',
      'Three equations. D is computed, plug into the formula.'),
    A('why',
      "Plyus-minusni unutmang, ikkalasini ham hisoblang.",
      'Не забывай про плюс-минус, считай оба варианта.',
      'Do not forget plus-or-minus, compute both.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ikkala ildiz ham topildi.",
      'Все три разобраны. Каждый раз находились оба корня.',
      'All three are done. Each time both roots were found.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² + 5x + 6 = 0,   D = 1'}</Row>,
        ok: L("Ha. Minus besh plyus-minus bir, ikkiga bo'lingan.", 'Да. Минус пять плюс-минус один, делённое на два.', 'Yes. Negative five plus or minus one, divided by two.'),
        question: ASK_SOLVE,
        items: [
          { id: 'a', right: true, label: 'x = −2,  x = −3' },
          { id: 'b', label: 'x = 2,  x = 3', hint: L("B musbat besh emas, minus besh, formulada minus b turadi.", 'B не положительное пять, а минус пять, в формуле стоит минус b.', 'b is not positive five, it is negative five, and the formula has negative b.') },
        ],
        solution: ['x = (−5 ± 1) / 2', 'x = −2,  x = −3'],
      },
      {
        expr: <Row size="big" align="center">{'2x² − 3x + 1 = 0,   D = 1'}</Row>,
        ok: L("Ha. Uch plyus-minus bir, to'rtga bo'lingan.", 'Да. Три плюс-минус один, делённое на четыре.', 'Yes. Three plus or minus one, divided by four.'),
        question: ASK_SOLVE,
        items: [
          { id: 'a', right: true, label: 'x = 1,  x = 1/2' },
          { id: 'b', label: 'x = 2,  x = 1', hint: L("Maxraj ikkiga a, ya'ni to'rt, ikki emas.", 'Знаменатель два a, то есть четыре, а не два.', 'The denominator is two a, that is four, not two.') },
        ],
        solution: ['x = (3 ± 1) / 4', 'x = 1,  x = 1/2'],
      },
      {
        expr: <Row size="big" align="center">{'x² − 4x + 4 = 0,   D = 0'}</Row>,
        ok: L("Ha. D nolga teng, shuning uchun ikkala ishora bir xil javob beradi.", 'Да. D равен нулю, поэтому оба знака дают один ответ.', 'Yes. D equals zero, so both signs give the same answer.'),
        question: ASK_SOLVE,
        items: [
          { id: 'a', right: true, label: 'x = 2' },
          { id: 'b', label: L("Ildiz yo'q", 'Корней нет', 'No root'), hint: L("D nolga teng, bu ildiz yo'q degani emas, bitta ildiz degani.", 'D равен нулю, это не значит корней нет, значит корень один.', 'D equals zero does not mean no roots, it means one root.') },
        ],
        solution: ['x = (4 ± 0) / 2', 'x = 2'],
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
      "Uch topshiriq. Formula bergan sonni qo'yib tekshiring.",
      'Три задания. Подставь число, данное формулой, и проверь.',
      'Three tasks. Substitute the number the formula gave and check.'),
    A('why',
      "Qo'ysangiz tenglama nolga aylanishi kerak.",
      'После подстановки уравнение должно обратиться в нуль.',
      'After substitution the equation must turn into zero.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar tenglama nolga aylandi.",
      'Все три разобраны. Каждый раз уравнение обращалось в нуль.',
      'All three are done. Each time the equation turned into zero.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² + 5x + 6 = 0,   x = −2'}</Row>,
        ok: L("Ha. To'rt minus o'n plyus olti nolga teng.", 'Да. Четыре минус десять плюс шесть равно нулю.', 'Yes. Four minus ten plus six equals zero.'),
        question: L('x = −2 shu tenglamaning ildizimi?', 'Является ли x = −2 корнем этого уравнения?', 'Is x = −2 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Minus ikkini qo'yib hisoblang, to'rt minus o'n plyus olti.", 'Подставь минус два и посчитай, четыре минус десять плюс шесть.', 'Substitute negative two and compute, four minus ten plus six.') },
        ],
        solution: ['4 − 10 + 6', '= 0'],
      },
      {
        expr: <Row size="big" align="center">{'2x² − 3x + 1 = 0,   x = 1/2'}</Row>,
        ok: L("Ha. Yarim minus yarim plyus bir emas, hisoblab ko'ring, yarim minus uch ikkidan plyus bir nolga teng.", 'Да, посчитай, половина минус три вторых плюс один равно нулю.', 'Yes, compute, one half minus three halves plus one equals zero.'),
        question: L('x = 1/2 shu tenglamaning ildizimi?', 'Является ли x = 1/2 корнем этого уравнения?', 'Is x = 1/2 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Yarimni qo'yib hisoblang, ikki karra chorak minus uch karra yarim plyus bir.", 'Подставь половину, два умножить на четверть минус три умножить на половину плюс один.', 'Substitute one half, two times a quarter minus three times a half plus one.') },
        ],
        solution: ['2(1/4) − 3(1/2) + 1', '= 0'],
      },
      {
        expr: <Row size="big" align="center">{'x² − 4x + 4 = 0,   x = 2'}</Row>,
        ok: L("Ha. To'rt minus sakkiz plyus to'rt nolga teng.", 'Да. Четыре минус восемь плюс четыре равно нулю.', 'Yes. Four minus eight plus four equals zero.'),
        question: L('x = 2 shu tenglamaning ildizimi?', 'Является ли x = 2 корнем этого уравнения?', 'Is x = 2 a root of this equation?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikkini qo'yib hisoblang, to'rt minus sakkiz plyus to'rt.", 'Подставь два и посчитай, четыре минус восемь плюс четыре.', 'Substitute two and compute, four minus eight plus four.') },
        ],
        solution: ['4 − 8 + 4', '= 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): minus b ning ishorasi
// noto'g'ri qo'llanildi (З44).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Minus b ning ishorasi",
    'Знак минус b',
    'The sign of negative b',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham minus b noto'g'ri ishlatilgan.",
      'Два задания. В обоих неверно использован минус b.',
      'Two tasks. In both, negative b was used incorrectly.'),
    A('why',
      "B manfiy bo'lsa, minus b musbat bo'ladi.",
      'Если b отрицательно, то минус b становится положительным.',
      'If b is negative, then negative b becomes positive.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Ishorani formulaga qo'yishdan oldin tekshirish kerak.",
      'Оба разобраны. Знак нужно проверять перед подстановкой в формулу.',
      'Both are done. The sign must be checked before plugging into the formula.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² − 6x + 5 = 0 → x = (−6 ± 4) / 2'}</Row>,
        ok: L("Ha. B minus olti, demak minus b olti, minus olti emas.", 'Да. B минус шесть, значит минус b шесть, а не минус шесть.', 'Yes. b is negative six, so negative b is six, not negative six.'),
        question: L("To'g'ri formula qaysi?", 'Какая формула верна?', 'Which formula is correct?'),
        items: [
          { id: 'a', right: true, label: 'x = (6 ± 4) / 2' },
          { id: 'b', label: 'x = (−6 ± 4) / 2', hint: L("Bu ko'rsatilgan xato yozuvning o'zi, b ning ishorasi hisobga olinmagan.", 'Это и есть показанная ошибочная запись, знак b не учтён.', 'This is the very mistaken record shown, the sign of b was not accounted for.') },
          { id: 'c', label: 'x = (−6 ± 16) / 2', hint: L("Bu D emas, ildiz ostidagi son to'rt, D emas o'n olti.", 'Это не D, под корнем стоит четыре, а не шестнадцать.', 'That is not D; under the root stands four, not sixteen.') },
        ],
        solution: ['−b = −(−6) = 6', 'x = (6 ± 4) / 2'],
      },
      {
        expr: <Row size="big" align="center">{'2x² + 7x − 4 = 0 → x = (7 ± 9) / 4'}</Row>,
        ok: L("Ha. B musbat yetti, demak minus b minus yetti, musbat yetti emas.", 'Да. B положительное семь, значит минус b минус семь, а не положительное семь.', 'Yes. b is positive seven, so negative b is negative seven, not positive seven.'),
        question: L("To'g'ri formula qaysi?", 'Какая формула верна?', 'Which formula is correct?'),
        items: [
          { id: 'a', right: true, label: 'x = (−7 ± 9) / 4' },
          { id: 'b', label: 'x = (7 ± 9) / 4', hint: L("Bu ko'rsatilgan xato yozuvning o'zi, b ning ishorasi hisobga olinmagan.", 'Это и есть показанная ошибочная запись, знак b не учтён.', 'This is the very mistaken record shown, the sign of b was not accounted for.') },
          { id: 'c', label: 'x = (−7 ± 81) / 4', hint: L("Bu D emas, ildiz ostidagi son sakkiz o'n bir, D esa sakson bir.", 'Под корнем должно стоять восемьдесят один, а не отдельно записанное число.', 'Under the root should stand eighty one, computed as D, not written separately.') },
        ],
        solution: ['−b = −7', 'x = (−7 ± 9) / 4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill`): perimetr va
// yuza masalasi to'liq kvadrat tenglamaga keladi.
// ============================================================
const S13 = {
  eyebrow: L('PERIMETR VA YUZA', 'ПЕРИМЕТР И ПЛОЩАДЬ', 'PERIMETER AND AREA'),
  title: L(
    "To'g'ri to'rtburchak tomonlarini toping",
    'Найди стороны прямоугольника',
    'Find the sides of the rectangle',
  ),
  audio: [
    A('mount',
      "Perimetr va yuza berilgan. Bir tomonni iks deb olib, tenglama tuzamiz.",
      'Даны периметр и площадь. Обозначив одну сторону иксом, составляем уравнение.',
      'The perimeter and area are given. Calling one side x, we set up an equation.'),
    A('why',
      "Yarim perimetrdan ikkinchi tomon iks minus qismida qoladi. D ni hisoblab, formula bilan yeching.",
      'Из половины периметра вторая сторона остаётся в виде разности с иксом. Посчитай D и решай по формуле.',
      'From half the perimeter, the other side remains as a difference with x. Compute D and solve with the formula.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar D hisoblanib, ikkita tomon topildi.",
      'Все три заполнены. Каждый раз считался D и находились обе стороны.',
      'All three are filled. Each time D was computed and both sides were found.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['20', '1', '5', '4'],
      lines: [
        [{ t: 'P = 18, S = 20 → x² − 9x + ' }, { slot: '20' }, { t: ' = 0' }],
        [{ t: 'D = ' }, { slot: '1' }, { t: ',   x = ' }, { slot: '5' }, { t: L('  yoki  ', '  или  ', '  or  ') }, { slot: '4' }],
      ],
    },
    tasks: [
      {
        chips: ['24', '25', '8', '3'],
        lines: [
          [{ t: 'P = 22, S = 24 → x² − 11x + ' }, { slot: '24' }, { t: ' = 0' }],
          [{ t: 'D = ' }, { slot: '25' }, { t: ',   x = ' }, { slot: '8' }, { t: L('  yoki  ', '  или  ', '  or  ') }, { slot: '3' }],
        ],
      },
      {
        chips: ['15', '4', '5', '3'],
        lines: [
          [{ t: 'P = 16, S = 15 → x² − 8x + ' }, { slot: '15' }, { t: ' = 0' }],
          [{ t: 'D = ' }, { slot: '4' }, { t: ',   x = ' }, { slot: '5' }, { t: L('  yoki  ', '  или  ', '  or  ') }, { slot: '3' }],
        ],
      },
      {
        chips: ['40', '9', '8', '5'],
        lines: [
          [{ t: 'P = 26, S = 40 → x² − 13x + ' }, { slot: '40' }, { t: ' = 0' }],
          [{ t: 'D = ' }, { slot: '9' }, { t: ',   x = ' }, { slot: '8' }, { t: L('  yoki  ', '  или  ', '  or  ') }, { slot: '5' }],
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
    "Formula bo'yicha to'rt savol",
    'Четыре вопроса по формуле',
    'Four questions about the formula',
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
        id: 'q1', tag: 'З44',
        ask: L('x² − 8x + 7 = 0 tenglamada minus b qanchaga teng?', 'Чему равен минус b в уравнении x² − 8x + 7 = 0?', 'What is negative b in x² − 8x + 7 = 0?'),
        options: [
          { id: 'ok', right: true, label: '8' },
          { id: 'wrong', label: '−8' },
          { id: 'c', label: '7' },
          { id: 'd', label: '64' },
        ],
        hint: L("B minus sakkiz, minus b esa uning qarama-qarshisi.", 'B минус восемь, а минус b, его противоположность.', 'b is negative eight, and negative b is its opposite.'),
        ok: L("To'g'ri, minus b sakkizga teng.", 'Верно, минус b равен восьми.', 'Correct, negative b equals eight.'),
      },
      {
        id: 'q2', tag: 'З40',
        ask: L('x = (−3 ± 5) / 2 dan nechta ildiz chiqadi?', 'Сколько корней даёт x = (−3 ± 5) / 2?', 'How many roots does x = (−3 ± 5) / 2 give?'),
        options: [
          { id: 'ok', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'one', label: L('Bitta', 'Один', 'One') },
          { id: 'zero', label: L('Nolta', 'Нуль', 'Zero') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Plyus va minusni alohida hisoblang.", 'Посчитай плюс и минус по отдельности.', 'Compute the plus and the minus separately.'),
        ok: L("To'g'ri, plyusdan bir, minusdan minus to'rt chiqadi.", 'Верно, плюс даёт один, минус даёт минус четыре.', 'Correct, plus gives one, minus gives negative four.'),
      },
      {
        id: 'q3', tag: 'З44',
        ask: L('2x² + 5x − 3 = 0 tenglamada a, b, c to\'g\'ri qaysi?', 'Какие a, b, c верны для 2x² + 5x − 3 = 0?', 'Which a, b, c are correct for 2x² + 5x − 3 = 0?'),
        options: [
          { id: 'ok', right: true, label: 'a = 2,  b = 5,  c = −3' },
          { id: 'signC', label: 'a = 2,  b = 5,  c = 3' },
          { id: 'signB', label: 'a = 2,  b = −5,  c = −3' },
          { id: 'swap', label: 'a = 5,  b = 2,  c = −3' },
        ],
        hint: L("Har had o'z ishorasi bilan o'qiladi.", 'Каждый член читается со своим знаком.', 'Each term is read with its own sign.'),
        ok: L("To'g'ri, uchtasi ham o'z ishorasi bilan.", 'Верно, все три со своими знаками.', 'Correct, all three with their own signs.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('x = 0,5 son 2x² + 5x − 3 = 0 tenglamaning ildizimi?', 'Является ли x = 0,5 корнем уравнения 2x² + 5x − 3 = 0?', 'Is x = 0.5 a root of 2x² + 5x − 3 = 0?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
          { id: 'onlyNeg', label: L('Faqat minus uch ildiz', 'Только минус три — корень', 'Only negative three is a root') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Nol butun beshni qo'yib hisoblang, ikki karra chorak plyus ikki yarim minus uch.", 'Подставь ноль целых пять, два на четверть плюс два с половиной минус три.', 'Substitute zero point five, two times a quarter plus two and a half minus three.'),
        ok: L("To'g'ri, natija nolga teng.", 'Верно, результат равен нулю.', 'Correct, the result equals zero.'),
      },
      {
        id: 'q5', tag: 'З40',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "X kvadrat minus 2x minus 8 teng nolni yechib, ikkala ildizni yig'ing.",
            'Реши икс квадрат минус два икс минус восемь равно нулю и собери оба корня.',
            'Solve x squared minus two x minus eight equals zero and assemble both roots.',
          ),
          lines: [
            [{ t: 'x² − 2x − 8 = 0 → x = ' }, { slot: '4' }, { t: ',   x = ' }, { slot: '−2' }],
          ],
          tiles: [
            { id: 't1', v: '4', x: 12, y: 12 },
            { id: 't2', v: '−2', x: 70, y: 14 },
            { id: 't3', v: '2', x: 40, y: 50 },
            { id: 't4', v: '−4', x: 78, y: 48 },
            { id: 't5', v: '8', x: 14, y: 52 },
          ],
          hint: L(
            "D o'ttiz oltiga teng, ildizi olti, minus b esa ikki.",
            'D равен тридцати шести, его корень шесть, а минус b равен двум.',
            'D equals thirty six, its root is six, and negative b equals two.',
          ),
          doneNote: L(
            "Yig'ildi. Ikki plyus olti to'rt, ikki minus olti minus to'rt, ikkiga bo'lingan.",
            'Собрано. Два плюс шесть четыре, два минус шесть минус четыре, делённое на два.',
            'Assembled. Two plus six is four, two minus six is negative four, divided by two.',
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
    "Formula har qanday kvadrat tenglamani yechadi",
    'Формула решает любое квадратное уравнение',
    'The formula solves any quadratic equation',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. Iks bir, ikki teng ikkiga a ga bo'lingan minus b plyus-minus D dan ildiz.",
      'С урока остаётся одна запись. x один, два равно минус b плюс-минус корень из D, делённое на два a.',
      'One record stays with you. x one, two equals negative b plus or minus the root of D, over two a.'),
    A('s1',
      "Bugun uch narsa qilindi. To'la kvadratni ajratdingiz, umumiy formulani chiqardingiz va diskriminant bilan tanishdingiz.",
      'Сегодня сделано три вещи. Ты выделил полный квадрат, вывел общую формулу и познакомился с дискриминантом.',
      'Three things are done today. You completed the square, derived the general formula, and met the discriminant.'),
    A('s2',
      "Keyingi darsda diskriminant chuqurroq o'rganiladi. Uning ishorasi ildizlar sonini aytib beradi.",
      'В следующем уроке дискриминант изучается глубже. Его знак сообщает число корней.',
      'The next lesson studies the discriminant more deeply. Its sign tells the number of roots.',
    ),
  ],
  props: {
    mark: 'x1,2 = (−b ± √D) / 2a',
    markNote: L(
      "D teng b kvadrat minus to'rt ac",
      'D равно b в квадрате минус четыре ac',
      'D equals b squared minus four a c',
    ),
    lines: [
      L(
        "To'la kvadratni ajratish formulani beradi",
        'Выделение полного квадрата даёт формулу',
        'Completing the square gives the formula',
      ),
      L(
        "D = b² − 4ac diskriminant deyiladi",
        'D = b² − 4ac называется дискриминантом',
        'D = b² − 4ac is called the discriminant',
      ),
      L(
        "Formula har qanday a, b, c da ishlaydi",
        'Формула работает при любых a, b, c',
        'The formula works for any a, b, c',
      ),
    ],
    bridge: L(
      "Keyingi dars: diskriminant va ildizlar soni",
      'Следующий урок: дискриминант и число корней',
      'Next lesson: the discriminant and the number of roots',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — TO'LA KVADRATNI AJRATISH.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З38', 'З44', 'З40',
    'З40', 'З44', 'З44', 'З44', 'З40',
    'З16', 'З44', 'З40', null, null,
  ],
  mechanic: { at: 5, tool: 'squarecut', kind: 'derive' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
