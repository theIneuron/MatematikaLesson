// ============================================================================
// 8-sinf, Dars 28. TENGSIZLIKLAR YORDAMIDA MASALALAR YECHISH.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `twosides.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `twosides`: masala shartidan tuzilgan
// tengsizlik yechiladi, keyin javob masala shartiga qarab tekshiriladi.
//
// DIQQAT — bu darsning DARSLIKDA ALOHIDA PARAGRAFI YO'Q (15-, 16-darslardan
// farqli). Masalalar 15-§ (poyezd, 85-bet) va 16-§ (hovuz, 95-bet) ichida
// KIRISH MISOLI sifatida, hamda mashqlar bo'limida (№263-265 atrofida)
// alohida topshiriq sifatida uchraydi. Blok 3-dagi 20- va 28-darslar bilan
// bir xil holat (o'sha yerda ham alohida paragraf yo'q edi).
//
// DARSNING ISHI:
//   1) noma'lum kattalik harf bilan belgilanadi;
//   2) masala sharti tengsizlikka (yoki sistemaga) aylantiriladi;
//   3) tengsizlik yechiladi;
//   4) YECHIMDAN masala shartiga zid qiymatlar (manfiy uzunlik, tezlik,
//      vaqt, butun bo'lmagan predmet soni) chiqarib tashlanadi.
//
// MASALALAR: poyezd tezligi (15-§ dan, 4x ≥ 200), hovuz to'lishi (16-§ dan,
// sistema 4x ≥ 2000, 5x ≤ 4000).
//
// ADASHISHLAR: bittasi yangi, ikkitasi qaytadi:
//   З57 — yechimdan masala shartiga zid qiymat chiqarib tashlanmadi;
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
  id: 'alg-8-28',
  n: 28,
  row: 31,
  block: 'Б4',
  topic: L(
    'Tengsizliklar yordamida masalalar yechish',
    'Решение задач с помощью неравенств',
    'Solving problems using inequalities',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "noma'lum kattalik harf bilan belgilanadi, masala sharti tengsizlikka aylantiriladi",
    'Неизвестная величина обозначается буквой, условие задачи превращается в неравенство',
    'The unknown quantity is denoted by a letter, and the condition is turned into an inequality',
  ),
  L(
    "tengsizlik yechiladi, yechim to'g'ri chiziqda topiladi",
    'Неравенство решается, решение находится на числовой прямой',
    'The inequality is solved, and the solution is found on the number line',
  ),
  L(
    "yechimdan masala shartiga zid qiymatlar (manfiy uzunlik, tezlik, vaqt) chiqarib tashlanadi",
    'Из решения исключаются значения, противоречащие условию задачи (отрицательная длина, скорость, время)',
    "Values contradicting the problem's condition (negative length, speed, time) are excluded from the solution",
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
    wrong: '50',
    at: 3,
  },
  'З57': {
    what: L(
      "yechimdan masala shartiga zid qiymat chiqarib tashlanmadi",
      'из решения не исключено значение, противоречащее условию задачи',
      "a value contradicting the problem's condition was not excluded from the solution",
    ),
    wrong: '-10',
    at: 4,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: poyezd 200 km, 4 soatda, tezlik yetarlimi. Yakun:
// 4x ≥ 200, x ≥ 50 km/soat.
// ============================================================
const SC_ASK = L('TEZLIK YETARLIMI', 'ДОСТАТОЧНА ЛИ СКОРОСТЬ', 'IS THE SPEED ENOUGH')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="46" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink}>{'200 km,   4 soat'}</text>
      <text x="200" y="76" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
        fill={T.ink3}>{'x = 40 km/soat'}</text>
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
      "To'rt marta tezlik kamida ikki yuz bo'lishi kerak, tezlik kamida ellik",
      'Четыре умножить на скорость должно быть не меньше двухсот, скорость не меньше пятидесяти',
      'Four times the speed must be at least two hundred, the speed at least fifty',
    )}>
      <text x="200" y="24" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fill={T.ink}>{'4x ≥ 200'}</text>
      <g className="g8-seat" style={{ '--d': '1200ms' }}>
        <line x1="60" y1="60" x2="340" y2="60" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <rect x="200" y="55" width="140" height="10" rx="5" fill={T.accent} opacity=".85"/>
        <circle cx="200" cy="60" r="4.4" fill={T.ok}/>
        <text x="200" y="74" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>50</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1800ms' }}>
        <text x="200" y="98" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.ok}>{'x ≥ 50'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('QIRQ KM/SOAT YETADIMI', 'ХВАТИТ ЛИ СОРОК КМ/Ч', 'IS FORTY KM/H ENOUGH'),
  title: L(
    "Poyezd to'rt soatda kamida ikki yuz km yurishi kerak, qirq tezlik yetadimi",
    'Поезд должен пройти за четыре часа не менее двухсот км, хватит ли скорости сорок',
    'The train must cover at least two hundred km in four hours, is a speed of forty enough',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Poyezd to'rt soatda kamida ikki yuz kilometr yurishi kerak.",
      'Поезд должен пройти за четыре часа не менее двухсот километров.',
      'The train must cover at least two hundred kilometers in four hours.'),
    A('why',
      "Taxmin qiling, qirq kilometr soatiga tezlik bunga yetarlimi.",
      'Предположи, хватит ли для этого скорости сорок километров в час.',
      'Predict whether a speed of forty kilometers per hour is enough for this.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, qirq kilometr soatiga yetarlimi?",
      'Как думаешь, сорок километров в час достаточно?',
      'Do you think forty kilometers per hour is enough?',
    ),
    items: [
      { id: 'yes', show: L('Ha, yetadi', 'Да, хватит', 'Yes, enough') },
      { id: 'no', show: L("Yo'q, yetmaydi", 'Нет, не хватит', 'No, not enough') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Masala shartidan tengsizlik tuzish. Shu tayanch 5 va
// 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Shartdan tengsizlik tuzishni eslash",
    'Вспоминаем составление неравенства из условия',
    'Recalling how to set up an inequality from a condition',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida shart to'g'ri tengsizlikka aylantirilgan.",
      'Четыре записи. Только в одной условие верно превращено в неравенство.',
      'Four records. Only one correctly turns the condition into an inequality.'),
    A('why',
      "Kamida degan so'z katta yoki teng belgisini beradi.",
      'Слово не менее даёт знак больше либо равно.',
      'The phrase at least gives the greater-than-or-equal sign.'),
  ],
  props: {
    ask: L(
      "To'rt soatda kamida ikki yuz km shartiga qaysi yozuv mos?",
      'Какая запись соответствует условию за четыре часа не менее двухсот км?',
      'Which record matches the condition of at least two hundred km in four hours?',
    ),
    items: [
      { id: 'right', show: '4x ≥ 200', right: true, name: L("kamida, katta yoki teng", 'не менее, больше либо равно', 'at least, greater than or equal') },
      {
        id: 'strict', show: '4x > 200',
        hint: L("Kamida so'zi teng holatni ham qo'shadi, belgi qat'iy emas.", 'Слово не менее включает и равенство, знак нестрогий.', 'The phrase at least also includes equality, the sign is not strict.'),
      },
      {
        id: 'wrongdir', show: '4x ≤ 200',
        hint: L("Kamida ikki yuz, pastdan chegara, belgi katta yoki teng bo'lishi kerak.", 'Не менее двухсот это нижняя граница, знак должен быть больше либо равно.', 'At least two hundred is a lower bound, the sign should be greater than or equal.'),
      },
      {
        id: 'wrongcoef', show: 'x ≥ 200',
        hint: L("To'rt soat hisobga olinmagan, masofa tezlik karra vaqt.", 'Четыре часа не учтены, расстояние это скорость умножить на время.', 'Four hours was not accounted for; distance is speed times time.'),
      },
    ],
    after: L(
      "To'g'ri. To'rt soatlik masofa tezlik karra to'rt, u kamida ikki yuzga teng.",
      'Верно. Расстояние за четыре часа это скорость умножить на четыре, оно не менее двухсот.',
      'Correct. The distance over four hours is speed times four, at least two hundred.',
    ),
  },
}

// ============================================================
// EKRAN 3. X NI BURANG (1-darsning `steppers`). Tezlik x kuzatiladi, vaqt
// 200/x sifatida hisoblanadi: x nolga tushganda vaqt YO'QOLADI (З54).
// ============================================================
const S3 = {
  eyebrow: L('X NI BURANG', 'КРУТИ X', 'TURN X'),
  title: L(
    "Ikki yuz km qancha vaqtda",
    'За сколько времени двести км',
    'In how much time two hundred km',
  ),
  audio: [
    A('mount',
      "Tezlik x bo'lsin. Vaqt ikki yuz bo'lingan x ga teng.",
      'Пусть скорость равна x. Время равно двести, делённое на x.',
      'Let the speed be x. The time equals two hundred divided by x.'),
    A('why',
      "Ikki maqsad beriladi. x ning turli qiymatlarida vaqtni toping.",
      'Даны две цели. Находи время при разных значениях x.',
      'Two targets are given. Find the time at different values of x.'),
    A('why',
      "Oxirida x ni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти x до нуля и посмотри, что будет.',
      'At the end bring x down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'x', label: L('tezlik x (km/soat)', 'скорость x (км/ч)', 'speed x (km/h)'),
        start: 100, min: 0, max: 100, step: 10, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : Math.round((200 / v[0]) * 100) / 100),
    resultLabel: L('vaqt (soat)', 'время (ч)', 'time (h)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "x hali nolga tushmasin, avval maqsadlarni oling.",
      'x пока не опускай до нуля, сначала возьми цели.',
      'Do not bring x down to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: 4,
        ask: L("Vaqt 4 soatga teng bo'lsin", 'Пусть время будет равно 4 часам', 'Make the time equal 4 hours'),
        after: L(
          "4. Ellikga bo'lingan ikki yuz to'rt soat beradi.",
          '4. Двести, делённое на пятьдесят, даёт четыре часа.',
          '4. Two hundred divided by fifty gives four hours.',
        ),
      },
      {
        value: 2,
        ask: L("Endi vaqt 2 soatga teng bo'lsin", 'Теперь пусть время будет равно 2 часам', 'Now make the time equal 2 hours'),
        after: L(
          "2. Yuzga bo'lingan ikki yuz ikki soat beradi.",
          '2. Двести, делённое на сто, даёт два часа.',
          '2. Two hundred divided by a hundred gives two hours.',
        ),
      },
    ],
    ask: L("Vaqt 4 soatga teng bo'lsin", 'Пусть время будет равно 4 часам', 'Make the time equal 4 hours'),
    ask2: L("Endi x ni nolga tushiring", 'Теперь опусти x до нуля', 'Now bring x down to zero'),
    broke: L(
      "Tezlik nolga teng bo'lganda vaqt yo'q, chunki nolga bo'lish mumkin emas, turgan poyezd hech qachon yetib bormaydi.",
      'При нулевой скорости времени нет, потому что делить на нуль нельзя, стоящий поезд никогда не доедет.',
      'With zero speed there is no time, because dividing by zero is not possible, a standing train never arrives.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI JAVOB TO'G'RI (1-darsning `pick`). Ловушка — masala
// shartiga zid qiymat chiqarib tashlanmagan (З57).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI JAVOB TO\'G\'RI', 'КАКОЙ ОТВЕТ ВЕРЕН', 'WHICH ANSWER IS CORRECT'),
  title: L(
    "4x ≥ 200 ning to'g'ri yechimi qaysi",
    'Каково верное решение 4x ≥ 200',
    'What is the correct solution of 4x ≥ 200',
  ),
  audio: [
    A('mount',
      "To'rt javob taklif qilinadi. Faqat bittasi tezlik uchun mantiqan to'g'ri.",
      'Предложены четыре ответа. Только один имеет смысл для скорости.',
      'Four answers are proposed. Only one makes sense for a speed.'),
    A('why',
      "Tezlik manfiy bo'lolmaydi, bu masalaning o'z sharti.",
      'Скорость не может быть отрицательной, это условие самой задачи.',
      'Speed cannot be negative; that is a condition of the problem itself.'),
  ],
  props: {
    ask: L(
      "4x ≥ 200 ning tezlik uchun mantiqan to'g'ri yechimi qaysi?",
      'Каково имеющее смысл для скорости решение 4x ≥ 200?',
      'What is the sensible-for-speed solution of 4x ≥ 200?',
    ),
    items: [
      { id: 'right', show: 'x ≥ 50', right: true, name: L("tezlik musbat, mantiqan to'g'ri", 'скорость положительна, разумно', 'speed is positive, reasonable') },
      {
        id: 'includesneg', show: 'x ≥ −10',
        hint: L("Bu tengsizlikning o'zi emas, va manfiy tezlik mantiqsiz.", 'Это не решение самого неравенства, а отрицательная скорость бессмысленна.', 'This is not the inequality itself, and a negative speed makes no sense.'),
      },
      {
        id: 'wrongdiv', show: 'x ≤ 50',
        hint: L("To'rtga bo'linganda ishora burilmaydi, to'rt musbat son.", 'При делении на четыре знак не переворачивается, четыре положительное число.', 'Dividing by four does not flip the sign; four is a positive number.'),
      },
      {
        id: 'wrongnum', show: 'x ≥ 800',
        hint: L("Ko'paytirish o'rniga bo'lish kerak edi, ikki yuz to'rtga bo'linadi.", 'Нужно было делить, а не умножать, двести делится на четыре.', 'Division was needed, not multiplication; two hundred divided by four.'),
      },
    ],
    after: L(
      "To'g'ri. X katta yoki teng ellik, va tezlik musbat bo'lgani uchun bu to'liq mantiqiy javob.",
      'Верно. x больше либо равно пятидесяти, и так как скорость положительна, это полностью разумный ответ.',
      'Correct. x is greater than or equal to fifty, and since speed is positive, this is a fully sensible answer.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — SHARTDAN YECHIMGACHA (`twosides`). Xukdagi
// masala shu yerda to'liq yechiladi.
// ============================================================
const S5 = {
  eyebrow: L('YECHAMIZ', 'РЕШАЕМ', 'WE SOLVE IT'),
  title: L(
    "Poyezd masalasini oxirigacha yeching",
    'Решите задачу о поезде до конца',
    'Solve the train problem to the end',
  ),
  audio: [
    A('mount',
      "Xukdagi masaladan tengsizlik. Uni yechib, javobni tekshiramiz.",
      'Неравенство из задачи с хука. Решаем его и проверяем ответ.',
      'The inequality from the hook problem. We solve it and check the answer.'),
    A('why',
      "Amal ikkala qismga birdan qo'llanadi. Qadamni tanlang.",
      'Действие применяется сразу к обеим частям. Выбери шаг.',
      'The action applies to both sides at once. Choose the step.'),
    W('a2',
      "Ikkinchi qadamda javob masala shartiga qarab tekshirildi.",
      'На втором шаге ответ проверен по условию задачи.',
      'In the second step the answer was checked against the problem condition.'),
  ],
  props: {
    from: -20,
    to: 100,
    start: { left: '4x', rel: '≥', right: '200', set: null },
    steps: [
      {
        ask: L('Nima qilamiz?', 'Что делаем?', 'What do we do?'),
        actions: [
          {
            id: 'div4', right: true,
            label: L("Ikkala qismni to'rtga bo'lish", 'Разделить обе части на четыре', 'Divide both sides by four'),
            to: { left: 'x', rel: '≥', right: '50' },
            set: { ge: 50 },
          },
          {
            id: 'sub200',
            label: L("Ikki yuzni ayirish", 'Вычесть двести', 'Subtract two hundred'),
            hint: L(
              "Ikki yuz o'ng tomonda turadi, to'rt esa iksga ko'paytiruvchi, ayirish kerak emas.",
              'Двести стоит справа, а четыре это множитель при иксе, вычитать не нужно.',
              'Two hundred is on the right, and four is the coefficient of x; no subtraction is needed.',
            ),
          },
        ],
      },
      {
        ask: L("Endi javobni masala shartiga qarab tekshiramiz. Tezlik manfiy bo'la oladimi?", 'Теперь проверим ответ по условию задачи. Может ли скорость быть отрицательной?', 'Now we check the answer against the problem. Can speed be negative?'),
        actions: [
          {
            id: 'keep', right: true,
            label: L("Yo'q, tezlik faqat musbat bo'ladi, javob x ≥ 50 to'liq mantiqiy", 'Нет, скорость только положительна, ответ x ≥ 50 полностью разумен', 'No, speed is only positive, the answer x ≥ 50 is fully sensible'),
            to: { left: 'x', rel: '≥', right: '50' },
            set: { ge: 50 },
            note: L(
              "Yechimning hammasi mantiqiy, chunki eng kichik qiymat ellik ham musbat.",
              'Всё решение имеет смысл, потому что даже наименьшее значение пятьдесят положительно.',
              'The whole solution makes sense, because even the smallest value fifty is positive.',
            ),
          },
          {
            id: 'discard',
            label: L("Ha, manfiy qism chiqarib tashlanishi kerak", 'Да, отрицательную часть нужно исключить', 'Yes, the negative part must be excluded'),
            hint: L(
              "X katta yoki teng ellikning hammasi allaqachon musbat, chiqarib tashlashga hojat yo'q.",
              'Всё x больше либо равное пятидесяти уже положительно, исключать нечего.',
              'Everything with x greater than or equal to fifty is already positive; there is nothing to exclude.',
            ),
          },
        ],
      },
    ],
    note: L(
      "Poyezd tezligi kamida ellik km/soat bo'lishi kerak.",
      'Скорость поезда должна быть не менее пятидесяти км/ч.',
      'The speed of the train must be at least fifty km/h.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): javobni ikki yo'l bilan
// tekshirish — chegara sonini qo'yish va mantiqiy tekshirish.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Javobni ikki yo'l bilan tekshirish",
    'Проверить ответ двумя способами',
    'Checking the answer two ways',
  ),
  audio: [
    A('mount',
      "Bitta javob va ikki yo'l. Ikkalasi ham uni tasdiqlaydi.",
      'Один ответ и два пути. Оба его подтверждают.',
      'One answer and two ways. Both confirm it.'),
    W('w2',
      "Birinchi yo'lda chegara sonini asl shartga qo'yamiz.",
      'В первом пути подставляем граничное число в исходное условие.',
      'In the first way we substitute the boundary number into the original condition.'),
    W('w4',
      "Ikkinchi yo'lda masala shartiga mantiqan mos kelishini tekshiramiz.",
      'Во втором пути проверяем логическое соответствие условию задачи.',
      'In the second way we check logical fit with the problem condition.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL — SON QO\'YIB TEKSHIRISH', 'СПОСОБ 1 — ПРОВЕРКА ПОДСТАНОВКОЙ', 'METHOD 1 — CHECKING BY SUBSTITUTION'),
        lead: L(
          "Ellikni qo'yamiz, to'rt karra ellik ikki yuz",
          'Подставляем пятьдесят, четыре умножить на пятьдесят двести',
          'We substitute fifty, four times fifty is two hundred',
        ),
        rows: [
          { text: '4 · 50 = 200' },
          { text: L("teng, shart bajarildi", 'равно, условие выполнено', 'equal, the condition holds'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL — MANTIQIY TEKSHIRISH', 'СПОСОБ 2 — ЛОГИЧЕСКАЯ ПРОВЕРКА', 'METHOD 2 — LOGICAL CHECK'),
        lead: L(
          "X ≥ 50 ning hammasi musbat, tezlik bo'la oladi",
          'Всё x ≥ 50 положительно, может быть скоростью',
          'Everything with x ≥ 50 is positive, and can be a speed',
        ),
        rows: [
          { text: L("manfiy qiymat yo'q", 'отрицательных значений нет', 'no negative values') },
          { text: L('yechim to\'liq mantiqiy', 'решение полностью разумно', 'the solution is fully sensible'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Son qo'yish tez, mantiqiy tekshirish esa javobni to'liq qiladi",
          'Подстановка быстрая, а логическая проверка делает ответ полным',
          'Substitution is fast, logical checking makes the answer complete',
        ),
        rows: [{ text: 'x ≥ 50', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): nega hovuz masalasi sistema
// beradi.
// ============================================================
const S7 = {
  eyebrow: L('HOVUZ MASALASI', 'ЗАДАЧА О БАССЕЙНЕ', 'THE POOL PROBLEM'),
  title: L(
    "Nega hovuz masalasi ikki shart beradi",
    'Почему задача о бассейне даёт два условия',
    'Why the pool problem gives two conditions',
  ),
  audio: [
    A('mount',
      "To'rt ming litrli hovuz. To'rt soatda yarmidan ko'p to'lishi kerak.",
      'Бассейн на четыре тысячи литров. За четыре часа должен наполниться больше чем наполовину.',
      'A four-thousand-liter pool. In four hours it must fill more than halfway.'),
    W('p2',
      "Bu birinchi shart, to'rt karra x kamida ikki ming.",
      'Это первое условие, четыре умножить на x не менее двух тысяч.',
      'This is the first condition, four times x is at least two thousand.'),
    W('p4',
      "Ikkinchi shart, besh soatda to'rt mingdan oshmasligi kerak, besh karra x ko'pi bilan to'rt ming.",
      'Второе условие, за пять часов не должно превысить четыре тысячи, пять умножить на x не более четырёх тысяч.',
      'The second condition, in five hours it must not exceed four thousand, five times x at most four thousand.',
    ),
  ],
  props: {
    tokens: [
      { t: '4x ≥ 2000', id: 'a' },
      { t: '  ∩  ', id: 'sign' },
      { t: '5x ≤ 4000', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qadam. To'rt soatda kamida yarmi, bu birinchi tengsizlik.",
          'Первый шаг. За четыре часа не менее половины, это первое неравенство.',
          'Step one. In four hours at least half, this is the first inequality.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi qadam. Besh soatda toshib ketmasligi, bu ikkinchi tengsizlik.",
          'Второй шаг. За пять часов не должен перелиться, это второе неравенство.',
          'Step two. In five hours it must not overflow, this is the second inequality.',
        ),
      },
      {
        focus: 'sign',
        text: L(
          "Uchinchi qadam. Ikkalasi ham bir vaqtda bajarilishi kerak, shuning uchun sistema.",
          'Третий шаг. Оба должны выполняться одновременно, поэтому система.',
          'Step three. Both must hold at once, so it is a system.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Ko'pgina amaliy masalalarda faqat bitta shart kamdan-kam yetarli bo'ladi, shuning uchun muhandislar deyarli har doim sistema bilan ishlaydi.",
        'В большинстве практических задач одного условия почти никогда не хватает, поэтому инженеры почти всегда работают с системой.',
        'In most real problems, one condition is almost never enough, so engineers almost always work with a system.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIKDA ALOHIDA PARAGRAF YO'Q:
// qoida 15- va 16-darslar masalalari asosida umumlashtirilgan.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Masalani tengsizlik bilan yechish usuli",
    'Способ решения задачи с помощью неравенства',
    'The method of solving a problem using an inequality',
  ),
  audio: [
    A('mount',
      "Usul uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для способа, ты уже видел. Теперь собери его.',
      'Everything the method needs, you have already seen. Now assemble it.'),
    W('card',
      "Usul ochildi, va xukdagi qarz to'landi.",
      'Способ открылся, и долг с хука оплачен.',
      'The method opened, and the debt from the hook is paid.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("noma'lum kattalik harf bilan belgilanadi", 'неизвестная величина обозначается буквой', 'the unknown quantity is denoted by a letter') },
      { id: 'f2', label: L("masala sharti tengsizlikka aylantiriladi", 'условие задачи превращается в неравенство', 'the condition is turned into an inequality') },
      { id: 'f3', label: L("tengsizlik yechiladi", 'неравенство решается', 'the inequality is solved') },
      { id: 'f4', label: L("shartga zid qiymatlar yechimdan chiqarib tashlanadi", 'значения, противоречащие условию, исключаются из решения', 'values contradicting the condition are excluded from the solution') },
      { id: 'w1', label: L("yechimning hamma qiymati javobga kiradi", 'все значения решения входят в ответ', 'all values of the solution belong in the answer') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Matematik yechim va masala javobi bir xil emas, tekshirish shart.",
      'Так не складывается. Математическое решение и ответ задачи не одно и то же, проверка обязательна.',
      'That does not fit. The mathematical solution and the problem answer are not the same; checking is required.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Usul darsda umumlashtirilgan: poyezd masalasi 15-§, hovuz masalasi 16-§ (85- va 95-bet)",
        'Способ обобщён в уроке: задача о поезде § 15, задача о бассейне § 16 (стр. 85 и 95)',
        'The method is generalized in the lesson: the train problem section 15, the pool problem section 16 (pages 85 and 95)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Qirq km/soat yetarli emasligini hali bilmaymiz",
        'Мы пока не знаем, что сорока км/ч не хватит',
        'We still do not know that forty km/h is not enough',
      ),
      right: L(
        "endi tengsizlik yechib, ellikdan kam yetmasligini bilamiz",
        'теперь, решив неравенство, знаем, что меньше пятидесяти не хватит',
        'now, having solved the inequality, we know less than fifty is not enough',
      ),
      winner: 'right',
      note: L(
        "Tengsizlik yechimi masala javobini beradi, tekshirilgandan keyin",
        'Решение неравенства даёт ответ задачи, после проверки',
        'The inequality solution gives the problem answer, after checking',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): masala shartidan tengsizlik
// tuzing.
// ============================================================
const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Shartdan tengsizlik tuzing",
    'Составь неравенство из условия',
    'Set up the inequality from the condition',
  ),
  audio: [
    A('mount',
      "Besh shart. Har biriga mos tengsizlikni toping.",
      'Пять условий. Для каждого найди подходящее неравенство.',
      'Five conditions. For each, find the matching inequality.'),
    A('why',
      "Kamida, ko'pi bilan, dan oshmaydi kabi so'zlarga e'tibor bering.",
      'Обращай внимание на слова не менее, не более, не превышает.',
      'Pay attention to phrases like at least, at most, does not exceed.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar shartdagi so'z belgini aniqlab bergan.",
      'Все пять разобраны. Каждый раз слово в условии определяло знак.',
      'All five are done. Each time the word in the condition determined the sign.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x'}</Row>,
        ok: L("Ha. Uzunlik eniga besh qo'shilgandan kamida katta bo'lishi kerak.", 'Да. Длина должна быть не менее ширины плюс пять.', 'Yes. The length must be at least the width plus five.'),
        question: L(
          "To'g'ri to'rtburchak eni x, uzunligi kamida 5 sm ortiq bo'lishi kerak. Qaysi tengsizlik to'g'ri?",
          'Ширина прямоугольника x, длина должна быть не менее чем на 5 см больше. Какое неравенство верно?',
          'The rectangle width is x, the length must be at least 5 cm greater. Which inequality is correct?',
        ),
        items: [
          { id: 'a', right: true, label: 'uzunlik ≥ x + 5' },
          { id: 'b', label: 'uzunlik ≤ x + 5', hint: L("Kamida ortiq, demak katta yoki teng, kichik emas.", 'Не менее больше, значит больше либо равно, а не меньше.', 'At least more means greater than or equal, not less.') },
        ],
        solution: [L('uzunlik ≥ eni + 5', 'длина ≥ ширина + 5', 'length ≥ width + 5')],
      },
      {
        expr: <Row size="big" align="center">{'x'}</Row>,
        ok: L("Ha. Ko'pi bilan, demak kichik yoki teng.", 'Да. Не более значит меньше либо равно.', 'Yes. At most means less than or equal.'),
        question: L(
          "Sinfda o'quvchilar soni ko'pi bilan 30 ta bo'lishi kerak. Qaysi tengsizlik to'g'ri?",
          'Число учеников в классе должно быть не более 30. Какое неравенство верно?',
          'The number of students in a class must be at most 30. Which inequality is correct?',
        ),
        items: [
          { id: 'a', right: true, label: 'x ≤ 30' },
          { id: 'b', label: 'x ≥ 30', hint: L("Ko'pi bilan yuqori chegara, belgi kichik yoki teng bo'lishi kerak.", 'Не более это верхняя граница, знак должен быть меньше либо равно.', 'At most is an upper bound, the sign should be less than or equal.') },
        ],
        solution: ['x ≤ 30'],
      },
      {
        expr: <Row size="big" align="center">{'x'}</Row>,
        ok: L("Ha. Oshmasligi, demak kichik yoki teng.", 'Да. Не должна превышать значит меньше либо равно.', 'Yes. Not to exceed means less than or equal.'),
        question: L(
          "Xarid narxi 50000 so'mdan oshmasligi kerak. Qaysi tengsizlik to'g'ri?",
          'Стоимость покупки не должна превышать 50000 сумов. Какое неравенство верно?',
          'The purchase price must not exceed 50000 soums. Which inequality is correct?',
        ),
        items: [
          { id: 'a', right: true, label: 'x ≤ 50000' },
          { id: 'b', label: 'x < 50000', hint: L("Oshmasligi ellik mingning o'zini ham qamrab oladi, belgi qat'iy emas.", 'Не должна превышать включает и сами пятьдесят тысяч, знак нестрогий.', 'Not to exceed includes fifty thousand itself; the sign is not strict.') },
        ],
        solution: ['x ≤ 50000'],
      },
      {
        expr: <Row size="big" align="center">{'x'}</Row>,
        ok: L("Ha. Kamida, demak katta yoki teng.", 'Да. Не менее значит больше либо равно.', 'Yes. At least means greater than or equal.'),
        question: L(
          "Ishchilar guruhi kamida 8 kishidan iborat bo'lishi kerak. Qaysi tengsizlik to'g'ri?",
          'Рабочая группа должна состоять не менее чем из 8 человек. Какое неравенство верно?',
          'The work team must consist of at least 8 people. Which inequality is correct?',
        ),
        items: [
          { id: 'a', right: true, label: 'x ≥ 8' },
          { id: 'b', label: 'x > 8', hint: L("Kamida sakkizning o'zini ham qamrab oladi, belgi qat'iy emas.", 'Не менее включает и сами восемь, знак нестрогий.', 'At least includes eight itself; the sign is not strict.') },
        ],
        solution: ['x ≥ 8'],
      },
      {
        expr: <Row size="big" align="center">{'x'}</Row>,
        ok: L("Ha. Kam, demak qat'iy kichik.", 'Да. Меньше значит строго меньше.', 'Yes. Less than means strictly less.'),
        question: L(
          "Konteynerga sig'adigan yuk 500 kg dan kam bo'lishi shart. Qaysi tengsizlik to'g'ri?",
          'Груз, помещающийся в контейнер, должен быть меньше 500 кг. Какое неравенство верно?',
          'The cargo that fits in the container must be less than 500 kg. Which inequality is correct?',
        ),
        items: [
          { id: 'a', right: true, label: 'x < 500' },
          { id: 'b', label: 'x ≤ 500', hint: L("Shartda aynan kam deyilgan, besh yuzning o'zi kirmaydi.", 'В условии сказано именно меньше, сами пятьсот не входят.', 'The condition says strictly less; five hundred itself is not included.') },
        ],
        solution: ['x < 500'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): masalani sistema bilan yeching.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Masalani sistema bilan yeching",
    'Реши задачу с помощью системы',
    'Solve the problem with a system',
  ),
  audio: [
    A('mount',
      "Uch masala. Har birida ikki shart sistemaga birlashadi.",
      'Три задачи. В каждой два условия объединяются в систему.',
      'Three problems. In each, two conditions combine into a system.'),
    A('why',
      "Ikkala shartni ham tengsizlikka aylantirib, kesishtiring.",
      'Преврати оба условия в неравенства и найди пересечение.',
      'Turn both conditions into inequalities and find the intersection.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ikki shart bir kesmaga birlashgan.",
      'Все три разобраны. Каждый раз два условия объединялись в один отрезок.',
      'All three are done. Each time two conditions combined into one segment.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'4x ≥ 2000,   5x ≤ 4000'}</Row>,
        ok: L("Ha. Birinchisi x katta yoki teng besh yuz, ikkinchisi x kichik yoki teng sakkiz yuz beradi.", 'Да. Первое даёт x больше либо равно пятистам, второе x меньше либо равно восемьсот.', 'Yes. The first gives x greater than or equal to five hundred, the second x less than or equal to eight hundred.'),
        question: L("Hovuz masalasi. To'ldirish tezligi qanday oraliqda?", 'Задача о бассейне. В каком промежутке скорость наполнения?', 'The pool problem. In what range is the fill rate?'),
        items: [
          { id: 'a', right: true, label: '500 ≤ x ≤ 800' },
          { id: 'b', label: 'x ≥ 500', hint: L("Ikkinchi shart hisobga olinmagan, hovuz toshib ketmasligi ham kerak.", 'Второе условие не учтено, бассейн тоже не должен переливаться.', 'The second condition was not accounted for; the pool must also not overflow.') },
        ],
        solution: ['4x ≥ 2000', 'x ≥ 500', '5x ≤ 4000', 'x ≤ 800', '500 ≤ x ≤ 800'],
      },
      {
        expr: <Row size="big" align="center">{'x + 3 ≥ 10,   2x ≤ 20'}</Row>,
        ok: L("Ha. Birinchisi x katta yoki teng yetti, ikkinchisi x kichik yoki teng o'n beradi.", 'Да. Первое даёт x больше либо равно семи, второе x меньше либо равно десяти.', 'Yes. The first gives x greater than or equal to seven, the second x less than or equal to ten.'),
        question: L("Ishchi kunlar masalasi. Kunlar soni qanday oraliqda?", 'Задача о рабочих днях. В каком промежутке число дней?', 'The workdays problem. In what range is the number of days?'),
        items: [
          { id: 'a', right: true, label: '7 ≤ x ≤ 10' },
          { id: 'b', label: '7 ≤ x ≤ 20', hint: L("Ikki karra iks kichik yoki teng yigirma dan x kichik yoki teng o'n chiqadi, yigirma emas.", 'Из два икс меньше либо равно двадцати выходит x меньше либо равно десяти, а не двадцати.', 'From 2x ≤ 20 comes x ≤ 10, not 20.') },
        ],
        solution: ['x + 3 ≥ 10', 'x ≥ 7', '2x ≤ 20', 'x ≤ 10', '7 ≤ x ≤ 10'],
      },
      {
        expr: <Row size="big" align="center">{'3x ≤ 90,   x > 0'}</Row>,
        ok: L("Ha. Birinchisi x kichik yoki teng o'ttiz beradi, ikkinchisi x musbat bo'lishini talab qiladi.", 'Да. Первое даёт x меньше либо равно тридцати, второе требует, чтобы x было положительным.', 'Yes. The first gives x less than or equal to thirty, the second requires x to be positive.'),
        question: L("Byudjet masalasi. Buyum narxi qanday oraliqda?", 'Задача о бюджете. В каком промежутке цена предмета?', 'The budget problem. In what range is the item price?'),
        items: [
          { id: 'a', right: true, label: '0 < x ≤ 30' },
          { id: 'b', label: '0 ≤ x ≤ 30', hint: L("Narx qat'iy musbat bo'lishi kerak, nol narx mantiqsiz.", 'Цена должна быть строго положительной, нулевая цена не имеет смысла.', 'The price must be strictly positive; a zero price makes no sense.') },
        ],
        solution: ['3x ≤ 90', 'x ≤ 30', 'x > 0', '0 < x ≤ 30'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): javobni masala
// shartiga qarab tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Javobni masala shartiga qarab tekshirish",
    'Проверка ответа по условию задачи',
    'Checking the answer against the problem condition',
  ),
  audio: [
    A('mount',
      "Uch taklif qilingan javob. Har birini masala mantiqiga qarab tekshiring.",
      'Предложены три ответа. Каждый проверь по смыслу задачи.',
      'Three proposed answers. Check each against the meaning of the problem.'),
    A('why',
      "Uzunlik, tezlik, miqdor kabi kattaliklar manfiy bo'lolmaydi.",
      'Такие величины, как длина, скорость, количество, не могут быть отрицательными.',
      'Quantities like length, speed, and count cannot be negative.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar masala mantiqi javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз смысл задачи проверял ответ.',
      'All three are done. Each time the meaning of the problem checked the answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x ≥ −3'}</Row>,
        ok: L("Yo'q. Uzunlik manfiy bo'lolmaydi, javob uzunlik musbat shartiga birlashtirilishi kerak.", 'Нет. Длина не может быть отрицательной, ответ нужно объединить с условием положительности длины.', 'No. Length cannot be negative; the answer must be combined with the condition that length is positive.'),
        question: L("Uzunlik x uchun bu javob chiqdi. Bu to'liq javobmi?", 'Для длины x получен такой ответ. Это полный ответ?', 'For length x this answer was obtained. Is this the full answer?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Uzunlik manfiy bo'lolmaydi, matematik yechim to'liq javob emas.", 'Длина не может быть отрицательной, математическое решение не полный ответ.', 'Length cannot be negative; the mathematical solution is not the full answer.') },
        ],
        solution: ['x ≥ −3', L('uzunlik musbat', 'длина положительна', 'length is positive'), 'x > 0'],
      },
      {
        expr: <Row size="big" align="center">{'x ≤ 12,5'}</Row>,
        ok: L("Yo'q. Kishilar soni butun bo'lishi kerak, javob x ≤ 12 bo'lishi kerak.", 'Нет. Число людей должно быть целым, ответ должен быть x ≤ 12.', 'No. The number of people must be a whole number; the answer should be x ≤ 12.'),
        question: L("Kishilar soni x uchun bu javob chiqdi. Bu to'liq javobmi?", 'Для числа людей x получен такой ответ. Это полный ответ?', 'For the number of people x this answer was obtained. Is this the full answer?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Kishi yarim bo'lmaydi, javob eng katta butun songacha qisqartiriladi.", 'Человека не бывает половины, ответ сужается до наибольшего целого числа.', 'There is no such thing as half a person; the answer narrows to the largest whole number.') },
        ],
        solution: ['x ≤ 12,5', L('butun son', 'целое число', 'a whole number'), 'x ≤ 12'],
      },
      {
        expr: <Row size="big" align="center">{'x ≥ 60'}</Row>,
        ok: L("Ha. Tezlik musbat bo'lishi mumkin, javob to'liq to'g'ri.", 'Да. Скорость может быть положительной, ответ полностью верен.', 'Yes. Speed can be positive, the answer is fully correct.'),
        question: L("Tezlik x uchun bu javob chiqdi. Bu to'liq javobmi?", 'Для скорости x получен такой ответ. Это полный ответ?', 'For speed x this answer was obtained. Is this the full answer?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Oltmishdan katta yoki teng hamma son musbat, qo'shimcha cheklov kerak emas.", 'Все числа больше либо равные шестидесяти положительны, дополнительное ограничение не нужно.', 'All numbers greater than or equal to sixty are positive; no extra restriction is needed.') },
        ],
        solution: ['x ≥ 60', L("to'liq to'g'ri", 'полностью верно', 'fully correct')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): shartga zid qiymat
// chiqarib tashlanmagan (З57).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Javobda shartga zid qiymat qoldimi",
    'Осталось ли в ответе значение, противоречащее условию',
    'Did a value contradicting the condition remain in the answer',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham javobda mantiqsiz qiymat qolgan.",
      'Два задания. В обоих в ответе осталось бессмысленное значение.',
      'Two tasks. In both, a nonsensical value remained in the answer.'),
    A('why',
      "Uzunlik, vaqt, tezlik, miqdor, bularning barchasi musbat bo'ladi.",
      'Длина, время, скорость, количество, всё это положительно.',
      'Length, time, speed, count, all of these are positive.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har safar mantiqsiz qism chiqarib tashlangan.",
      'Оба разобраны. Каждый раз бессмысленная часть исключена.',
      'Both are done. Each time the nonsensical part was excluded.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'2x ≥ −10   →   x ≥ −5'}</Row>,
        ok: L("Ha. Vaqt manfiy bo'lolmaydi, javob x ≥ 0 bo'lishi kerak edi.", 'Да. Время не может быть отрицательным, ответ должен быть x ≥ 0.', 'Yes. Time cannot be negative; the answer should be x ≥ 0.'),
        question: L("Vaqt x uchun bu javob berilgan. Bu yerda xato qayerda?", 'Для времени x дан такой ответ. В чём здесь ошибка?', 'For time x this answer was given. Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Manfiy vaqt chiqarib tashlanmagan", 'Отрицательное время не исключено', 'Negative time was not excluded') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, vaqt manfiy bo'lolmaydi.", 'Это и есть показанная ошибка, время не может быть отрицательным.', 'This is the very mistake shown; time cannot be negative.') },
        ],
        solution: ['2x ≥ −10', 'x ≥ −5', L('vaqt musbat', 'время положительно', 'time is positive'), 'x ≥ 0'],
      },
      {
        expr: <Row size="big" align="center">{'x ≤ 4,5'}</Row>,
        ok: L("Ha. Tomonlar soni butun bo'lishi kerak, to'rt yarim tomon bo'lmaydi.", 'Да. Число сторон должно быть целым, четыре с половиной сторон не бывает.', 'Yes. The number of sides must be a whole number; there is no such thing as four and a half sides.'),
        question: L("Tomonlar soni x uchun x = 4,5 ham javobga kiritilgan. Bu yerda xato qayerda?", 'Для числа сторон x в ответ включено и x = 4,5. В чём здесь ошибка?', 'For the number of sides x, x = 4.5 was also included in the answer. Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Butun bo'lmagan qiymat chiqarib tashlanmagan", 'Нецелое значение не исключено', 'A non-whole value was not excluded') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, tomonlar soni faqat butun bo'ladi.", 'Это и есть показанная ошибка, число сторон бывает только целым.', 'This is the very mistake shown; the number of sides can only be a whole number.') },
        ],
        solution: ['x ≤ 4,5', L('butun son', 'целое число', 'a whole number'), 'x ≤ 4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH (1-darsning `fill`): masalani qadamlab yechish.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Masalani qadamlab yeching",
    'Реши задачу по шагам',
    'Solve the problem step by step',
  ),
  audio: [
    A('mount',
      "Shart berilgan. Tengsizlik tuzib, yechib, javobni tekshiring.",
      'Дано условие. Составь неравенство, реши его и проверь ответ.',
      'A condition is given. Set up the inequality, solve it, and check the answer.'),
    A('why',
      "Yechimdan mantiqsiz qismni chiqarib tashlashni unutmang.",
      'Не забудь исключить из решения бессмысленную часть.',
      'Do not forget to exclude the nonsensical part from the solution.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar tengsizlik yechimi javobga aylangan.",
      'Все три заполнены. Каждый раз решение неравенства превращалось в ответ.',
      'All three are filled. Each time the inequality solution turned into an answer.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['5x', '20', '4'],
      lines: [
        [{ t: "Kamida 20 sm, tomon x  →  " }, { slot: '5x' }, { t: ' ≥ ' }, { slot: '20' }],
        [{ t: 'x ≥ ' }, { slot: '4' }],
      ],
    },
    tasks: [
      {
        chips: ['3x', '60', '20'],
        lines: [
          [{ t: "Ko'pi bilan 60 kg, quti x  →  " }, { slot: '3x' }, { t: ' ≤ ' }, { slot: '60' }],
          [{ t: 'x ≤ ' }, { slot: '20' }],
        ],
      },
      {
        chips: ['4x', '100', '25'],
        lines: [
          [{ t: "Kamida 100 metr, qator x  →  " }, { slot: '4x' }, { t: ' ≥ ' }, { slot: '100' }],
          [{ t: 'x ≥ ' }, { slot: '25' }],
        ],
      },
      {
        chips: ['2x', '90', '45'],
        lines: [
          [{ t: "90 dan oshmasin, buyum x  →  " }, { slot: '2x' }, { t: ' ≤ ' }, { slot: '90' }],
          [{ t: 'x ≤ ' }, { slot: '45' }],
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
    "Masala yechish bo'yicha to'rt savol",
    'Четыре вопроса о решении задач',
    'Four questions about solving problems',
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
        id: 'q1', tag: 'З57',
        ask: L('Uzunlik x uchun x ≥ −7 javob berilgan, bu to\'liqmi?', 'Для длины x дан ответ x ≥ −7, он полный?', 'For length x the answer x ≥ −7 is given, is it complete?'),
        options: [
          { id: 'no', right: true, label: L("Yo'q, x > 0 bilan birlashtirilishi kerak", 'Нет, нужно объединить с x > 0', 'No, it must be combined with x > 0') },
          { id: 'yes', label: L('Ha, to\'liq', 'Да, полный', 'Yes, complete') },
        ],
        hint: L("Uzunlik manfiy bo'lolmaydi.", 'Длина не может быть отрицательной.', 'Length cannot be negative.'),
        ok: L("To'g'ri, mantiqsiz qism chiqarib tashlanishi kerak.", 'Верно, бессмысленную часть нужно исключить.', 'Correct, the nonsensical part must be excluded.'),
      },
      {
        id: 'q2', tag: 'З57',
        ask: L("Kamida o'n qanday belgi beradi?", 'Какой знак даёт не менее десяти?', 'What sign does at least ten give?'),
        options: [
          { id: 'ok', right: true, label: 'x ≥ 10' },
          { id: 'strict', label: 'x > 10' },
          { id: 'wrong', label: 'x ≤ 10' },
        ],
        hint: L("Kamida so'zi teng holatni ham qamrab oladi.", 'Слово не менее включает и равенство.', 'The phrase at least also includes equality.'),
        ok: L("To'g'ri, o'nning o'zi ham kiradi.", 'Верно, сама десятка тоже входит.', 'Correct, ten itself is also included.'),
      },
      {
        id: 'q3', tag: 'З54',
        ask: L('4x ≤ 40 ning yechimi qaysi?', 'Каково решение 4x ≤ 40?', 'What is the solution of 4x ≤ 40?'),
        options: [
          { id: 'ok', right: true, label: 'x ≤ 10' },
          { id: 'wrong', label: 'x ≥ 10' },
          { id: 'wrong2', label: 'x ≤ 4' },
        ],
        hint: L("To'rt musbat son, ishora burilmaydi, qirq to'rtga bo'linadi.", 'Четыре положительное, знак не переворачивается, сорок делится на четыре.', 'Four is positive, the sign does not flip, forty divided by four.'),
        ok: L("To'g'ri, x kichik yoki teng o'n.", 'Верно, x меньше либо равно десяти.', 'Correct, x is less than or equal to ten.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L("x = 10 son 4x ≤ 40 ni to'g'ri qiladimi?", 'Делает ли x = 10 верным 4x ≤ 40?', 'Does x = 10 make 4x ≤ 40 true?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("To'rt karra o'n qirq, qirqga teng, belgi qat'iy emas.", 'Четыре на десять сорок, равно сорока, знак нестрогий.', 'Four times ten is forty, equal to forty, the sign is not strict.'),
        ok: L("To'g'ri, teng holat ham qamrab olinadi.", 'Верно, равенство тоже входит.', 'Correct, equality is also included.'),
      },
      {
        id: 'q5', tag: 'З57',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Miqdor x uchun 3x ≥ −6 dan chiqqan x ≥ −2 ni tekshirib, to'liq javobni yozing.",
            'Проверь x ≥ −2, полученное из 3x ≥ −6 для количества x, и запиши полный ответ.',
            'Check x ≥ −2, obtained from 3x ≥ −6 for a count x, and write the full answer.',
          ),
          lines: [
            [{ t: 'x ' }, { slot: '≥' }, { t: ' 0' }],
          ],
          tiles: [
            { id: 't1', v: '≥', x: 12, y: 12 },
            { id: 't2', v: '≤', x: 70, y: 14 },
            { id: 't3', v: '=', x: 40, y: 50 },
          ],
          hint: L(
            "Miqdor manfiy bo'lolmaydi, javob nolddan boshlanadi.",
            'Количество не может быть отрицательным, ответ начинается с нуля.',
            'A count cannot be negative; the answer starts from zero.',
          ),
          doneNote: L(
            "Yig'ildi. Manfiy qism chiqarib tashlangach, javob x ≥ 0.",
            'Собрано. После исключения отрицательной части ответ x ≥ 0.',
            'Assembled. After excluding the negative part, the answer is x ≥ 0.',
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
    "Yechim topilgach, javob masala shartiga qarab tekshiriladi",
    'После нахождения решения ответ проверяется по условию задачи',
    'After finding the solution, the answer is checked against the problem condition',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. To'rt karra tezlik kamida ikki yuz, javobi tezlik kamida ellik.",
      'С урока остаётся одна запись. Четыре умножить на скорость не менее двухсот, ответ скорость не менее пятидесяти.',
      'One record stays with you. Four times the speed at least two hundred, the answer speed at least fifty.'),
    A('s1',
      "Bugun uch narsa qilindi. Shartdan tengsizlik tuzdingiz, uni yechdingiz va javobni masala mantiqiga qarab tekshirdingiz.",
      'Сегодня сделано три вещи. Ты составил неравенство из условия, решил его и проверил ответ по смыслу задачи.',
      'Three things are done today. You set up an inequality from a condition, solved it, and checked the answer against the meaning of the problem.'),
    A('s2',
      "Keyingi darsda sonning moduli. Tenglama va tengsizliklarda modul bilan tanishasiz.",
      'В следующем уроке модуль числа. Познакомишься с модулем в уравнениях и неравенствах.',
      'The next lesson covers the absolute value of a number. You will meet the absolute value in equations and inequalities.',
    ),
  ],
  props: {
    mark: '4x ≥ 200   →   x ≥ 50',
    markNote: L(
      "tezlik musbat, javob to'liq mantiqiy",
      'скорость положительна, ответ полностью разумен',
      'speed is positive, the answer is fully sensible',
    ),
    lines: [
      L(
        "noma'lum belgilanadi, shart tengsizlikka aylanadi",
        'Неизвестное обозначается, условие превращается в неравенство',
        'The unknown is denoted, the condition becomes an inequality',
      ),
      L(
        "tengsizlik yechiladi",
        'Неравенство решается',
        'The inequality is solved',
      ),
      L(
        "javob masala shartiga qarab tekshiriladi va tozalanadi",
        'Ответ проверяется по условию задачи и уточняется',
        'The answer is checked against the problem condition and refined',
      ),
    ],
    bridge: L(
      "Keyingi dars: sonning moduli",
      'Следующий урок: модуль числа',
      'Next lesson: the absolute value of a number',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — SHARTDAN YECHIMGACHA (`twosides`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З54', 'З57', 'З57',
    'З57', 'З57', 'З57', 'З57', 'З57',
    'З16', 'З57', 'З57', null, null,
  ],
  mechanic: { at: 5, tool: 'twosides', kind: 'wordproblem' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
