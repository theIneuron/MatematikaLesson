// ============================================================================
// 8-sinf, Dars 21. KVADRAT TENGLAMALAR YORDAMIDA MASALALAR YECHISH.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `plot.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `fourwin`: y = k/x bog'lanishi, javob
// shartga QAYTADI (5-ekran nomi shundan).
//
// DARSNING UCH ISHI (darslik, 27-§, 163-164-bet, 2-masala):
//   1) noma'lum harf bilan belgilanadi, qolgan miqdorlar shu harf orqali
//      yoziladi;
//   2) masala shartidan tenglama tuziladi (ko'pincha kasr-ratsional,
//      20-darsdan);
//   3) tenglama yechiladi, va MASALA SHARTIGA zid ildiz (manfiy tezlik,
//      manfiy uzunlik, manfiy vaqt) rad etiladi — bu ODZ dan farq qiladi,
//      chunki tenglamaning o'zi bu ildizni taqiqlamaydi, faqat HAYOTIY
//      MA'NO taqiqlaydi.
//
// XUKDAN OLINGAN MASALA. Avtobus aeroportga 40 km, taksi 10 daqiqa keyin
// chiqib, ikkalasi bir vaqtda yetib keladi, taksi tezligi avtobusnikidan
// 20 km/soat ortiq. Tenglama: 40/x − 40/(x+20) = 1/6. Ildizlar 60 va −80,
// manfiyi rad etiladi.
//
// ENG NOZIK JOY. Tenglamaning o'zi −80 ni taqiqlamaydi (ODZ buzilmagan,
// x = 0 va x = −20 dan boshqa), lekin tezlik manfiy bo'lolmaydi. Bu YANGI
// tag: З47, chunki 20-darsning З3 (ODZ) bilan aralashtirilmasin.
//
// DARSLIK. O'zbek darsligi, 27-§, 162-164-bet: uslub va 2-masala.
//
// ADASHISHLAR: bittasi yangi, uchtasi qaytadi:
//   З47 — manfiy yechim masala shartiga zid bo'lsa ham javobga qo'shildi;
//   З45 — ikkinchi koeffitsiyentning ishorasi (19-darsdan, endi tenglama
//         tuzishda: "10 daqiqa" ni oltidan bir soatga o'tkazishda ishora);
//   З3  — ODZ bilan hayotiy shartni aralashtirish (20-darsdan qaytadi,
//         6-ekranda ikkinchi usul sifatida);
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
  id: 'alg-8-21',
  n: 21,
  row: 23,
  block: 'Б3',
  topic: L(
    'Kvadrat tenglamalar yordamida masalalar yechish',
    'Решение задач с помощью квадратных уравнений',
    'Solving word problems with quadratic equations',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "noma'lum miqdor harf bilan belgilanadi, qolganlari shu harf orqali yoziladi",
    'Неизвестная величина обозначается буквой, остальные выражаются через неё',
    'The unknown quantity is denoted by a letter, and the rest are expressed through it',
  ),
  L(
    "masala shartidan tenglama tuziladi va yechiladi",
    'Из условия задачи составляется и решается уравнение',
    'An equation is built from the problem\'s condition and solved',
  ),
  L(
    "masala shartiga zid ildiz (manfiy uzunlik, tezlik, vaqt) javobga kiritilmaydi",
    'Корень, противоречащий условию задачи (отрицательная длина, скорость, время), в ответ не включается',
    'A root that contradicts the problem\'s condition (negative length, speed, time) is not included in the answer',
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
  'З3': {
    what: L(
      "ODZ bilan masalaning hayotiy sharti aralashtirildi",
      'ОДЗ уравнения спутана с реальным условием задачи',
      'the equation\'s domain was confused with the problem\'s real-world condition',
    ),
    wrong: null,
    at: 6,
  },
  'З45': {
    what: L(
      "vaqt birligini o'tkazishda (daqiqani soatga) ishora yoki kasr xato olindi",
      'при переводе единиц времени (минут в часы) знак или дробь взяты неверно',
      'when converting time units (minutes to hours), the sign or fraction was taken wrong',
    ),
    wrong: '10',
    at: 4,
  },
  'З47': {
    what: L(
      "manfiy yechim masala shartiga zid bo'lsa ham javobga qo'shildi",
      'отрицательное решение включено в ответ, хотя противоречит условию задачи',
      "a negative solution was included in the answer, even though it contradicts the problem's condition",
    ),
    wrong: '-80',
    at: 5,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: avtobus va taksi bir vaqtda yetib keldi, tezliklari
// tengmi. Yakun: tezliklar boshqa, oltmish va sakson.
// ============================================================
const SC_EQUAL = L('TEZLIKLAR TENGMI', 'РАВНЫ ЛИ СКОРОСТИ', 'ARE THE SPEEDS EQUAL')

const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Avtobus va taksi bir vaqtda yetib keldi",
      'Автобус и такси прибыли одновременно',
      'The bus and the taxi arrived at the same time',
    )}>
      <text x="130" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
        fill={T.ink}>{'avtobus: 40 km'}</text>
      <text x="270" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
        fill={T.ink}>{'taksi: 10 daq keyin'}</text>

      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="90" r="16" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="97" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="126" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_EQUAL)}</text>
    </SceneBand>
  )
}

const FinalScene = () => {
  const t = useT()
  return (
    <SceneBand kind="final" label={L(
      "Tezliklar boshqa: oltmish va sakson",
      'Скорости разные: шестьдесят и восемьдесят',
      'The speeds differ: sixty and eighty',
    )}>
      <text x="130" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
        fill={T.ink}>{'avtobus'}</text>
      <g className="g8-seat" style={{ '--d': '500ms' }}>
        <text x="130" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.ok}>60</text>
      </g>
      <text x="270" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
        fill={T.ink}>{'taksi'}</text>
      <g className="g8-seat" style={{ '--d': '1000ms' }}>
        <text x="270" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.ok}>80</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1500ms' }}>
        <text x="200" y="78" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="8.5" fill={T.tip}>{'minus 80 rad etildi'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('TEZLIKLAR TENGMI', 'РАВНЫ ЛИ СКОРОСТИ', 'ARE THE SPEEDS EQUAL'),
  title: L(
    "Avtobus va taksi bir vaqtga yetib keldi. Tezliklari tengmi",
    'Автобус и такси прибыли одновременно. Равны ли их скорости',
    'The bus and the taxi arrived at the same time. Are their speeds equal',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Avtobus aeroportga jo'nadi. O'n daqiqadan keyin taksi ham xuddi shu yo'lga chiqdi.",
      'Автобус отправился в аэропорт. Через десять минут по тому же пути выехало такси.',
      'The bus set off for the airport. Ten minutes later the taxi took the same route.'),
    A('why',
      "Ikkalasi bir vaqtga yetib keldi. Taxmin qiling, tezliklari tengmi.",
      'Оба прибыли одновременно. Предположи, равны ли их скорости.',
      'Both arrived at the same time. Predict whether their speeds are equal.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, tezliklari tengmi?",
      'Как думаешь, их скорости равны?',
      'Do you think their speeds are equal?',
    ),
    items: [
      { id: 'equal', show: L('Ha, teng', 'Да, равны', 'Yes, equal') },
      { id: 'diff', show: L('Yo\'q, boshqa-boshqa', 'Нет, разные', 'No, different') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Teskari proporsionallik y = k/x (7-sinf / Б1). Shu
// tayanch 5-ekranda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Yo'l, tezlik, vaqt",
    'Путь, скорость, время',
    'Distance, speed, time',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida vaqt formulasi to'g'ri.",
      'Четыре записи. Только в одной формула времени верна.',
      'Four records. Only one has the time formula correct.'),
    A('why',
      "Vaqt yo'lni tezlikka bo'lishga teng.",
      'Время равно пути, делённому на скорость.',
      'Time equals distance divided by speed.'),
  ],
  props: {
    ask: L(
      "40 km yo'lni x tezlikda bosib o'tish vaqti qanday?",
      'Каково время прохождения 40 км при скорости x?',
      'What is the time to cover 40 km at speed x?',
    ),
    items: [
      { id: 'right', show: 't = 40/x', right: true },
      {
        id: 'inv', show: 't = x/40',
        hint: L("Vaqt yo'lni tezlikka bo'lishdan chiqadi, teskarisi emas.", 'Время выходит из деления пути на скорость, а не наоборот.', 'Time comes from dividing distance by speed, not the other way around.'),
      },
      {
        id: 'mul', show: 't = 40 · x',
        hint: L("Ko'paytirish emas, bo'lish kerak.", 'Нужно не умножение, а деление.', 'It needs division, not multiplication.'),
      },
      {
        id: 'const', show: 't = 40',
        hint: L("Vaqt tezlikka bog'liq, u o'zgarmas emas.", 'Время зависит от скорости, оно не постоянно.', 'Time depends on speed, it is not constant.'),
      },
    ],
    after: L(
      "To'g'ri. Yo'l tezlikka bo'linadi, va tezlik oshsa vaqt kamayadi.",
      'Верно. Путь делится на скорость, и с ростом скорости время уменьшается.',
      'Correct. Distance is divided by speed, and as speed grows, time shrinks.',
    ),
  },
}

// ============================================================
// EKRAN 3. TEZLIKNI BURANG (1-darsning `steppers`). Natija — 60 bo'lingan
// tezlikka, ya'ni vaqt. Tezlik nolga tushganda qiymat yo'qoladi (З47).
// ============================================================
const S3 = {
  eyebrow: L('TEZLIKNI BURANG', 'КРУТИ СКОРОСТЬ', 'TURN THE SPEED'),
  title: L(
    "60 km yo'lni bosib o'tish vaqti",
    'Время прохождения 60 км',
    'The time to cover 60 km',
  ),
  audio: [
    A('mount',
      "60 km yo'l bor. Natija shu yo'lni bosib o'tish vaqti, soatlarda.",
      'Есть путь в 60 км. Результат это время его прохождения, в часах.',
      'There is a 60 km distance. The result is the time to cover it, in hours.'),
    A('why',
      "Uch maqsad beriladi. Tezlikning turli qiymatlarida vaqtni toping.",
      'Даны три цели. Находи время при разных значениях скорости.',
      'Three targets are given. Find the time at different values of speed.'),
    A('why',
      "Oxirida tezlikni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти скорость до нуля и посмотри, что будет.',
      'At the end bring the speed down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'x', label: L('tezlik (km/soat)', 'скорость (км/ч)', 'speed (km/h)'),
        start: 15, min: 0, max: 20, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : Math.round((60 / v[0]) * 100) / 100),
    resultLabel: L('vaqt (soat)', 'время (ч)', 'time (h)'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "Tezlik hali nolga tushmasin, avval maqsadlarni oling.",
      'Скорость пока не опускай до нуля, сначала возьми цели.',
      'Do not bring the speed to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: 5,
        ask: L("Vaqt 5 soatga teng bo'lsin", 'Пусть время будет равно 5 часам', 'Make the time equal 5 hours'),
        after: L(
          "Besh soat. Tezlik o'n ikkiga teng bo'lganda oltmish o'n ikkiga bo'linib besh chiqadi.",
          'Пять часов. При скорости двенадцать шестьдесят делится на двенадцать и выходит пять.',
          'Five hours. With speed twelve, sixty divided by twelve gives five.',
        ),
      },
      {
        value: 6,
        ask: L("Endi vaqt 6 soatga teng bo'lsin", 'Теперь пусть время будет равно 6 часам', 'Now make the time equal 6 hours'),
        after: L(
          "Olti soat. Tezlik o'nga teng bo'lganda oltmish o'nga bo'linib olti chiqadi.",
          'Шесть часов. При скорости десять шестьдесят делится на десять и выходит шесть.',
          'Six hours. With speed ten, sixty divided by ten gives six.',
        ),
      },
      {
        value: 12,
        ask: L("Oxirgisi, vaqt 12 soatga teng bo'lsin", 'Последняя, пусть время будет равно 12 часам', 'The last one, make the time equal 12 hours'),
        after: L(
          "O'n ikki soat. Tezlik beshga teng bo'lganda oltmish beshga bo'linib o'n ikki chiqadi.",
          'Двенадцать часов. При скорости пять шестьдесят делится на пять и выходит двенадцать.',
          'Twelve hours. With speed five, sixty divided by five gives twelve.',
        ),
      },
    ],
    ask: L("Vaqt 5 soatga teng bo'lsin", 'Пусть время будет равно 5 часам', 'Make the time equal 5 hours'),
    ask2: L("Endi tezlikni nolga tushiring", 'Теперь опусти скорость до нуля', 'Now bring the speed down to zero'),
    broke: L(
      "Tezlik nolga teng bo'lsa, mashina qo'zg'almaydi, va oltmishni nolga bo'lish kerak bo'lardi. Bunday tezlik masala shartiga to'g'ri kelmaydi.",
      'Если скорость равна нулю, машина не движется, и шестьдесят пришлось бы делить на нуль. Такая скорость не соответствует условию задачи.',
      'If the speed is zero, the car does not move, and sixty would have to be divided by zero. Such a speed does not fit the problem.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI TENGLAMA TO'G'RI (1-darsning `pick`). Ловушка — o'n
// daqiqani soatga o'tkazishda ishora yoki kasr (З45).
// ============================================================
const S4 = {
  eyebrow: L('TENGLAMA TUZAMIZ', 'СОСТАВЛЯЕМ УРАВНЕНИЕ', 'BUILDING THE EQUATION'),
  title: L(
    "Masala uchun qaysi tenglama to'g'ri",
    'Какое уравнение верно для задачи',
    'Which equation is correct for the problem',
  ),
  audio: [
    A('mount',
      "Avtobus tezligi x, taksi tezligi x plyus yigirma. O'n daqiqa farq oltidan bir soatga teng.",
      'Скорость автобуса x, скорость такси x плюс двадцать. Разница в десять минут равна одной шестой часа.',
      'The bus speed is x, the taxi speed is x plus twenty. The ten-minute gap is one sixth of an hour.'),
    A('why',
      "Avtobus ko'proq vaqt yuradi, shuning uchun uning vaqti kattaroq.",
      'Автобус едет дольше, поэтому его время больше.',
      'The bus travels longer, so its time is larger.'),
  ],
  props: {
    ask: L(
      "Qaysi tenglama to'g'ri?",
      'Какое уравнение верно?',
      'Which equation is correct?',
    ),
    items: [
      { id: 'right', show: '40/x − 40/(x+20) = 1/6', right: true },
      {
        id: 'signFlip', show: '40/(x+20) − 40/x = 1/6',
        hint: L("Avtobus vaqti kattaroq, shuning uchun ayirma boshqa tartibda bo'ladi.", 'Время автобуса больше, поэтому разность идёт в другом порядке.', 'The bus time is larger, so the subtraction goes the other way.'),
      },
      {
        id: 'wrongFrac', show: '40/x − 40/(x+20) = 10',
        hint: L("O'n daqiqa soatga o'tkazilmagan, u oltidan bir soatga teng.", 'Десять минут не переведены в часы, это одна шестая часа.', 'Ten minutes were not converted to hours; it is one sixth of an hour.'),
      },
      {
        id: 'wrongPlus', show: '40/x + 40/(x+20) = 1/6',
        hint: L("Vaqtlar qo'shilmaydi, ular orasidagi farq olinadi.", 'Времена не складываются, берётся разность между ними.', 'The times are not added; the difference between them is taken.'),
      },
    ],
    after: L(
      "To'g'ri. Avtobusning vaqti taksining vaqtidan oltidan bir soatga ko'p.",
      'Верно. Время автобуса больше времени такси на одну шестую часа.',
      'Correct. The bus\'s time exceeds the taxi\'s time by one sixth of an hour.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — TO'RT DERAZA (`fourwin`). Y = k/x
// bog'lanishi, javob shartga qaytadi: tezlik yigirmada vaqt necha soat.
// ============================================================
const S5 = {
  eyebrow: L('SHARTGA QAYTAMIZ', 'ВОЗВРАЩАЕМСЯ К УСЛОВИЮ', 'RETURNING TO THE CONDITION'),
  title: L(
    "Tezlik yigirmada mashina necha soatda yetadi",
    'За сколько часов машина доедет при скорости двадцать',
    'In how many hours does the car arrive at speed twenty',
  ),
  audio: [
    A('mount',
      "Mashina oltmish kilometr yo'lni x tezlikda bosib o'tadi.",
      'Машина проходит путь в шестьдесят километров со скоростью x.',
      'The car covers a sixty-kilometer distance at speed x.'),
    A('why',
      "Jadval, grafik va formula hali yopiq. Tezlik yigirmada vaqtni toping.",
      'Таблица, график и формула пока закрыты. Найди время при скорости двадцать.',
      'The table, graph, and formula are still hidden. Find the time at speed twenty.'),
  ],
  props: {
    k: 60,
    text: L(
      "Mashina {k} km yo'lni soatiga x km tezlik bilan bosib o'tadi",
      'Машина проходит {k} км со скоростью x км в час',
      'The car covers {k} km at a speed of x km per hour',
    ),
    xs: [10, 12, 15, 20, 30],
    given: 'text',
    holeAt: 20,
    answer: 'y',
    titles: {
      text: L('SHART', 'УСЛОВИЕ', 'CONDITION'),
      formula: L('FORMULA', 'ФОРМУЛА', 'FORMULA'),
      table: L('JADVAL', 'ТАБЛИЦА', 'TABLE'),
      plot: L('GRAFIK', 'ГРАФИК', 'GRAPH'),
    },
    unit: L('soat', 'ч', 'h'),
    ask: L(
      "Tezlik yigirmaga teng bo'lganda, vaqt necha soat?",
      'Когда скорость равна двадцати, сколько часов время?',
      'When the speed equals twenty, how many hours is the time?',
    ),
    hints: {
      '1.5': L("Bu boshqa tezlikka mos, yigirmaga emas.", 'Это соответствует другой скорости, не двадцати.', 'That matches a different speed, not twenty.'),
      '0.33': L("Yo'l va tezlik almashtirilgan, ular teskari.", 'Путь и скорость перепутаны, они обратны друг другу.', 'Distance and speed got swapped; they are inverses.'),
      '4': L("Oltmishni yigirmaga bo'ling, ko'paytirmang.", 'Раздели шестьдесят на двадцать, а не умножай.', 'Divide sixty by twenty, do not multiply.'),
    },
    after: L(
      "To'g'ri. Oltmish yigirmaga bo'linib uch soat chiqadi.",
      'Верно. Шестьдесят делится на двадцать и выходит три часа.',
      'Correct. Sixty divided by twenty gives three hours.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): manfiy tezlikni rad etish —
// hayotiy shart bilan yoki ODZ bilan (З3, 20-darsdan qaytadi).
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Minus sakson nima uchun rad etiladi",
    'Почему минус восемьдесят отвергается',
    'Why negative eighty is rejected',
  ),
  audio: [
    A('mount',
      "Ikki nomzod bor, oltmish va minus sakson. Ikki sabab ham bir xil xulosa beradi.",
      'Есть два кандидата, шестьдесят и минус восемьдесят. Обе причины дают один вывод.',
      'There are two candidates, sixty and negative eighty. Both reasons give the same conclusion.'),
    W('w2',
      "Birinchi sabab hayotiy shart, tezlik manfiy bo'lolmaydi.",
      'Первая причина реальное условие, скорость не может быть отрицательной.',
      'The first reason is the real-world condition, speed cannot be negative.'),
    W('w4',
      "Ikkinchi sabab ODZ. Minus sakson tenglamaning ODZ sini buzmaydi, lekin bu boshqa masala.",
      'Вторая причина ОДЗ. Минус восемьдесят не нарушает ОДЗ уравнения, но это другой вопрос.',
      'The second reason is the domain. Negative eighty does not violate the equation\'s domain, but that is a different matter.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L("1-USUL — HAYOTIY SHART", 'СПОСОБ 1 — РЕАЛЬНОЕ УСЛОВИЕ', 'METHOD 1 — THE REAL-WORLD CONDITION'),
        lead: L(
          "Tezlik manfiy bo'lolmaydi, bu masalaning o'zidan kelib chiqadi",
          'Скорость не может быть отрицательной, это следует из самой задачи',
          'Speed cannot be negative, which follows from the problem itself',
        ),
        rows: [
          { text: L('x = 60  yoki  x = −80', 'x = 60  или  x = −80', 'x = 60  or  x = −80') },
          { text: 'x = 60', tone: 'ok', note: L('tezlik musbat', 'скорость положительна', 'speed is positive') },
        ],
      },
      {
        name: L("2-USUL — ODZ NI TEKSHIRISH", 'СПОСОБ 2 — ПРОВЕРИТЬ ОДЗ', 'METHOD 2 — CHECK THE DOMAIN'),
        lead: L(
          "Tenglamaning ODZ si x ≠ 0, x ≠ −20 — minus sakson bu ikkisiga kirmaydi",
          'ОДЗ уравнения x ≠ 0, x ≠ −20 — минус восемьдесят не входит в этот список',
          'The equation\'s domain is x ≠ 0, x ≠ −20 — negative eighty is not in that list',
        ),
        rows: [
          { text: '−80 ≠ 0,  −80 ≠ −20', tone: 'no' },
          { text: L("ODZ buzilmagan, lekin masala buzilgan", 'ОДЗ не нарушено, но задача нарушена', 'The domain is not violated, but the problem is violated'), tone: 'no' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKI SABAB, BIR XULOSA', 'ДВЕ ПРИЧИНЫ, ОДИН ВЫВОД', 'TWO REASONS, ONE CONCLUSION'),
        lead: L(
          "ODZ tenglamani, hayotiy shart masalani tekshiradi — bu yerda ikkinchisi hal qiladi",
          'ОДЗ проверяет уравнение, реальное условие — задачу, здесь решает второе',
          'The domain checks the equation, the real condition checks the problem — here the second one decides',
        ),
        rows: [{ text: 'x = 60', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): tenglama nima uchun minus
// saksonni «ko'radi», masala esa yo'q.
// ============================================================
const S7 = {
  eyebrow: L('TENGLAMA VA MASALA', 'УРАВНЕНИЕ И ЗАДАЧА', 'THE EQUATION AND THE PROBLEM'),
  title: L(
    "Tenglama nima uchun ortiqcha ildiz ko'radi",
    'Почему уравнение видит лишний корень',
    'Why the equation sees an extra root',
  ),
  audio: [
    A('mount',
      "Tenglama faqat sonlar bilan ishlaydi, u tezlik yoki uzunlik ekanini bilmaydi.",
      'Уравнение работает только с числами, оно не знает, что это скорость или длина.',
      'The equation works only with numbers; it does not know this is a speed or a length.'),
    W('p2',
      "Minus sakson tenglamani to'g'ri qiladi, ikki tomon ham bir xil songa teng chiqadi.",
      'Минус восемьдесят делает уравнение верным, обе части выходят равными одному числу.',
      'Negative eighty makes the equation true, and both sides come out equal to the same number.'),
    W('p4',
      "Lekin masalada x tezlik, va tezlik manfiy bo'lolmaydi. Bu shart tenglamada yozilmagan.",
      'Но в задаче x это скорость, а скорость не бывает отрицательной. Это условие в уравнении не записано.',
      'But in the problem x is a speed, and speed is never negative. That condition is not written in the equation.',
    ),
  ],
  props: {
    tokens: [
      { t: '40/x − 40/(x+20) = 1/6', id: 'eq' },
      { t: '  →  x = 60  ', id: 'root1' },
      { t: ',  x = −80', id: 'root2' },
    ],
    steps: [
      {
        focus: 'eq',
        text: L(
          "Birinchi qadam. Tenglama ikkita sonni ham qabul qiladi, chunki ikkalasi ham uni to'g'ri qiladi.",
          'Первый шаг. Уравнение принимает оба числа, потому что оба делают его верным.',
          'Step one. The equation accepts both numbers, because both make it true.',
        ),
      },
      {
        focus: 'root2',
        text: L(
          "Ikkinchi qadam. Minus sakson tenglama uchun oddiy son, undan boshqa ma'no yo'q.",
          'Второй шаг. Минус восемьдесят для уравнения просто число, другого смысла в нём нет.',
          'Step two. For the equation, negative eighty is just a number, with no other meaning.',
        ),
      },
      {
        focus: 'root1',
        text: L(
          "Uchinchi qadam. Masalada esa x tezlik, va tezlik manfiy bo'lolmaydi — shuning uchun faqat oltmish qoladi.",
          'Третий шаг. А в задаче x — скорость, и скорость не бывает отрицательной, поэтому остаётся только шестьдесят.',
          'Step three. But in the problem x is a speed, and speed is never negative, so only sixty remains.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Matematik model haqiqatning bir qismini oladi, hammasini emas: tenglama harakatni, tezlikni, vaqtni biladi, lekin ularning manfiy bo'lmasligini bilmaydi — buni yechuvchi qo'shadi.",
        'Математическая модель берёт лишь часть реальности: уравнение знает про движение, скорость, время, но не знает, что они не бывают отрицательными — это добавляет решающий.',
        'A mathematical model captures only part of reality: the equation knows about motion, speed, time, but not that they cannot be negative — the solver adds that.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 27-§, 162-164-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Masalani tenglama bilan yechish tartibi",
    'Порядок решения задачи уравнением',
    'The order for solving a problem with an equation',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik uslubi ochildi, va xukdagi savolga javob keldi.",
      'Открылся приём из учебника, и вопрос с хука получил ответ.',
      'The textbook method opened, and the question from the hook got its answer.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("Noma'lum miqdor harf bilan belgilanadi", 'Неизвестная величина обозначается буквой', 'The unknown quantity is denoted by a letter') },
      { id: 'f2', label: L("qolgan miqdorlar shu harf orqali yoziladi", 'остальные величины выражаются через неё', 'the other quantities are expressed through it') },
      { id: 'f3', label: L("masala shartidan tenglama tuziladi va yechiladi", 'из условия составляется и решается уравнение', 'an equation is built from the condition and solved') },
      { id: 'f4', label: L("masala shartiga zid ildiz javobga kiritilmaydi", 'корень, противоречащий условию, в ответ не включается', 'a root contradicting the condition is not included in the answer') },
      { id: 'w1', label: L("tenglamaning barcha ildizlari javobga kiradi", 'все корни уравнения входят в ответ', 'all roots of the equation are included in the answer') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Tenglama sonlar bilan ishlaydi, u masalaning hayotiy shartini bilmaydi.",
      'Так не складывается. Уравнение работает с числами и не знает о реальном условии задачи.',
      'That does not fit. The equation works with numbers and does not know the problem\'s real-world condition.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 27-§, 162–164-bet",
        'Учебник, § 27, стр. 162–164',
        'Textbook, section 27, pages 162–164',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "tezliklar tengmi degan savol edi",
        'вопрос был, равны ли скорости',
        'the question was whether the speeds were equal',
      ),
      right: L(
        "yo'q, oltmish va sakson, minus sakson rad etildi",
        'нет, шестьдесят и восемьдесят, минус восемьдесят отвергнут',
        'no, sixty and eighty, negative eighty was rejected',
      ),
      winner: 'right',
      note: L(
        "Tezlik manfiy bo'lolmaydi",
        'Скорость не может быть отрицательной',
        'Speed cannot be negative',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): ikki ildizdan qaysi javob.
// ============================================================
const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Qaysi ildiz masalaga javob bo'ladi",
    'Какой корень отвечает задаче',
    'Which root answers the problem',
  ),
  audio: [
    A('mount',
      "Besh masala. Har birida ikkita ildiz bor, lekin faqat bittasi javob bo'ladi.",
      'Пять задач. В каждой два корня, но ответом является только один.',
      'Five problems. In each, there are two roots, but only one is the answer.'),
    A('why',
      "Uzunlik, tezlik, vaqt, yosh, bularning barchasi musbat bo'ladi.",
      'Длина, скорость, время, возраст, всё это положительно.',
      'Length, speed, time, age, all of these are positive.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar manfiy ildiz rad etildi.",
      'Все пять разобраны. Каждый раз отрицательный корень отвергался.',
      'All five are done. Each time the negative root was rejected.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x1 = −3,   x2 = 7'}</Row>,
        ok: L("Ha. Uzunlik manfiy bo'lolmaydi.", 'Да. Длина не может быть отрицательной.', 'Yes. Length cannot be negative.'),
        question: L(
          "To'rtburchak uzunligi topiladi, ildizlar minus 3 va 7. Qaysi ildiz javob?",
          'Находится длина прямоугольника, корни минус 3 и 7. Какой корень является ответом?',
          'The length of a rectangle is being found, the roots are negative 3 and 7. Which root is the answer?',
        ),
        items: [
          { id: 'a', right: true, label: '7' },
          { id: 'b', label: '−3', hint: L("Uzunlik manfiy bo'lolmaydi.", 'Длина не может быть отрицательной.', 'Length cannot be negative.') },
        ],
        solution: [L('uzunlik > 0', 'длина > 0', 'length > 0'), L('javob: 7', 'ответ: 7', 'answer: 7')],
      },
      {
        expr: <Row size="big" align="center">{'x1 = −5,   x2 = 12'}</Row>,
        ok: L("Ha. Yosh manfiy bo'lolmaydi.", 'Да. Возраст не может быть отрицательным.', 'Yes. Age cannot be negative.'),
        question: L(
          "Yosh topiladi, ildizlar minus 5 va 12. Qaysi ildiz javob?",
          'Находится возраст, корни минус 5 и 12. Какой корень является ответом?',
          'Age is being found, the roots are negative 5 and 12. Which root is the answer?',
        ),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '−5', hint: L("Yosh manfiy bo'lolmaydi.", 'Возраст не может быть отрицательным.', 'Age cannot be negative.') },
        ],
        solution: [L('yosh > 0', 'возраст > 0', 'age > 0'), L('javob: 12', 'ответ: 12', 'answer: 12')],
      },
      {
        expr: <Row size="big" align="center">{'x1 = 15,   x2 = −40'}</Row>,
        ok: L("Ha. Tezlik manfiy bo'lolmaydi.", 'Да. Скорость не может быть отрицательной.', 'Yes. Speed cannot be negative.'),
        question: L(
          "Tezlik topiladi, ildizlar 15 va minus 40. Qaysi ildiz javob?",
          'Находится скорость, корни 15 и минус 40. Какой корень является ответом?',
          'Speed is being found, the roots are 15 and negative 40. Which root is the answer?',
        ),
        items: [
          { id: 'a', right: true, label: '15' },
          { id: 'b', label: '−40', hint: L("Tezlik manfiy bo'lolmaydi.", 'Скорость не может быть отрицательной.', 'Speed cannot be negative.') },
        ],
        solution: [L('tezlik > 0', 'скорость > 0', 'speed > 0'), L('javob: 15', 'ответ: 15', 'answer: 15')],
      },
      {
        expr: <Row size="big" align="center">{'x1 = 4,   x2 = −9'}</Row>,
        ok: L("Ha. O'rinlar soni manfiy yoki kasr bo'lolmaydi.", 'Да. Число мест не может быть отрицательным.', 'Yes. A count of seats cannot be negative.'),
        question: L(
          "Qatordagi o'rinlar soni topiladi, ildizlar 4 va minus 9. Qaysi ildiz javob?",
          'Находится число мест в ряду, корни 4 и минус 9. Какой корень является ответом?',
          'The number of seats in a row is being found, the roots are 4 and negative 9. Which root is the answer?',
        ),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '−9', hint: L("O'rinlar soni manfiy bo'lolmaydi.", 'Число мест не может быть отрицательным.', 'A count of seats cannot be negative.') },
        ],
        solution: [L("o'rinlar soni > 0", 'число мест > 0', 'number of seats > 0'), L('javob: 4', 'ответ: 4', 'answer: 4')],
      },
      {
        expr: <Row size="big" align="center">{'x1 = 2,   x2 = −6'}</Row>,
        ok: L("Ha. Vaqt manfiy bo'lolmaydi.", 'Да. Время не может быть отрицательным.', 'Yes. Time cannot be negative.'),
        question: L(
          "Vaqt (soat) topiladi, ildizlar 2 va minus 6. Qaysi ildiz javob?",
          'Находится время (в часах), корни 2 и минус 6. Какой корень является ответом?',
          'Time (in hours) is being found, the roots are 2 and negative 6. Which root is the answer?',
        ),
        items: [
          { id: 'a', right: true, label: '2' },
          { id: 'b', label: '−6', hint: L("Vaqt manfiy bo'lolmaydi.", 'Время не может быть отрицательным.', 'Time cannot be negative.') },
        ],
        solution: [L('vaqt > 0', 'время > 0', 'time > 0'), L('javob: 2', 'ответ: 2', 'answer: 2')],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): masalani boshidan oxirigacha
// yeching.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Masalani boshidan oxirigacha yeching",
    'Реши задачу от начала до конца',
    'Solve the problem from start to finish',
  ),
  audio: [
    A('mount',
      "Uch masala. Tenglama tuzing, yeching va javobni tanlang.",
      'Три задачи. Составь уравнение, реши и выбери ответ.',
      'Three problems. Set up the equation, solve it, and choose the answer.'),
    A('why',
      "Har safar ikkita ildiz chiqadi, lekin ba'zida ikkalasi ham to'g'ri bo'ladi.",
      'Каждый раз выходят два корня, но иногда оба верны.',
      'Each time two roots come out, but sometimes both are valid.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Ba'zida ikkala ildiz ham javobga kirdi.",
      'Все три разобраны. Иногда оба корня входили в ответ.',
      'All three are done. Sometimes both roots belonged in the answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'P = 24,   S = 35'}</Row>,
        ok: L("Ha. Yarim perimetr o'n ikki, tomonlar yetti va besh, ikkalasi ham musbat.", 'Да. Половина периметра двенадцать, стороны семь и пять, обе положительны.', 'Yes. Half the perimeter is twelve, the sides are seven and five, both positive.'),
        question: L(
          "To'g'ri to'rtburchak perimetri 24 sm, yuzasi 35 sm². Tomonlarini toping.",
          'Периметр прямоугольника 24 см, площадь 35 см². Найди стороны.',
          'A rectangle has a perimeter of 24 cm and an area of 35 cm². Find the sides.',
        ),
        items: [
          { id: 'a', right: true, label: L('7 sm  va  5 sm', '7 см  и  5 см', '7 cm  and  5 cm') },
          { id: 'b', label: L('12 sm  va  0 sm', '12 см  и  0 см', '12 cm  and  0 cm'), hint: L("Ikkinchi tomon nolga teng bo'lolmaydi, u ham uzunlik.", 'Вторая сторона не может быть нулём, она тоже длина.', 'The second side cannot be zero, it is a length too.') },
        ],
        solution: ['x(12−x) = 35', 'x² − 12x + 35 = 0', 'x = 7,  x = 5'],
      },
      {
        expr: <Row size="big" align="center">{'40/x − 40/(x+20) = 1/6'}</Row>,
        ok: L("Ha. Tenglama oltmish va minus saksonni beradi, tezlik manfiy bo'lolmaydi.", 'Да. Уравнение даёт шестьдесят и минус восемьдесят, скорость не может быть отрицательной.', 'Yes. The equation gives sixty and negative eighty, and speed cannot be negative.'),
        question: L(
          "Avtobus 40 km, taksi 10 daqiqa keyin chiqib, tezligi 20 km/soat ortiq. Bir vaqtga yetdilar. Tezliklarni toping.",
          'Автобус проходит 40 км, такси выезжает на 10 минут позже со скоростью на 20 км/ч больше. Оба прибыли одновременно. Найди скорости.',
          'The bus covers 40 km, the taxi leaves 10 minutes later at a speed 20 km/h higher. Both arrive at the same time. Find the speeds.',
        ),
        items: [
          { id: 'a', right: true, label: L('60 km/soat  va  80 km/soat', '60 км/ч  и  80 км/ч', '60 km/h  and  80 km/h') },
          { id: 'b', label: L('−80 km/soat  va  −60 km/soat', '−80 км/ч  и  −60 км/ч', '−80 km/h  and  −60 km/h'), hint: L("Tezlik manfiy bo'lolmaydi.", 'Скорость не может быть отрицательной.', 'Speed cannot be negative.') },
        ],
        solution: ['40/x − 40/(x+20) = 1/6', 'x² + 20x − 4800 = 0', 'x = 60,  x = −80'],
      },
      {
        expr: <Row size="big" align="center">{'a − b = 5,   a·b = 84'}</Row>,
        ok: L("Ha. Kattaroq son o'n ikki, kichigi yetti, ikkalasi ham musbat.", 'Да. Большее число двенадцать, меньшее семь, оба положительны.', 'Yes. The larger number is twelve, the smaller is seven, both positive.'),
        question: L(
          "Ikki sonning ayirmasi 5, ko'paytmasi 84. Sonlarni toping.",
          'Разность двух чисел 5, произведение 84. Найди числа.',
          'The difference of two numbers is 5, their product is 84. Find the numbers.',
        ),
        items: [
          { id: 'a', right: true, label: L('12  va  7', '12  и  7', '12  and  7') },
          { id: 'b', label: L('−7  va  −12', '−7  и  −12', '−7  and  −12'), hint: L("Kattaroq son musbat bo'lishi shartga ko'ra talab qilinadi.", 'По условию большее число должно быть положительным.', 'By the condition, the larger number must be positive.') },
        ],
        solution: ['a(a−5) = 84', 'a² − 5a − 84 = 0', 'a = 12,  a = −7'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): javobni masala
// shartiga qo'yib tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Javobni shartga qo'yib tekshirish",
    'Проверка ответа по условию',
    'Checking the answer against the condition',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Javobni masalaning o'z shartiga qo'yib tekshiring.",
      'Три задания. Проверь ответ, подставив его в само условие задачи.',
      'Three tasks. Check the answer by substituting it into the problem\'s own condition.'),
    A('why',
      "Tenglamaga mos kelishi kifoya emas, shartga ham mos kelishi kerak.",
      'Соответствия уравнению недостаточно, нужно соответствие и условию.',
      'Fitting the equation is not enough, it must fit the condition too.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar javob masalaning o'z shartiga qo'yib tekshirildi.",
      'Все три разобраны. Каждый раз ответ проверялся подстановкой в само условие.',
      'All three are done. Each time the answer was checked by substituting into the condition itself.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'P = 24,   a = 7,   b = 5'}</Row>,
        ok: L("Ha. Ikki karra yetti plyus besh yigirma to'rt beradi.", 'Да. Дважды семь плюс пять даёт двадцать четыре.', 'Yes. Two times seven plus five gives twenty four.'),
        question: L(
          "Perimetr 24, tomonlar 7 va 5. To'g'ri hisoblanganmi?",
          'Периметр 24, стороны 7 и 5. Верно ли это посчитано?',
          'The perimeter is 24, the sides are 7 and 5. Is this computed correctly?',
        ),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikki karra yetti plyus besh ni hisoblang.", 'Посчитай дважды семь плюс пять.', 'Compute two times seven plus five.') },
        ],
        solution: ['2(7+5) = 24'],
      },
      {
        expr: <Row size="big" align="center">{'v1 = 60,   v2 = 80'}</Row>,
        ok: L("Ha. Avtobus qirq daqiqada, taksi o'ttiz daqiqada, farq o'n daqiqa.", 'Да. Автобус за сорок минут, такси за тридцать, разница десять минут.', 'Yes. The bus in forty minutes, the taxi in thirty, a ten-minute difference.'),
        question: L(
          "Avtobus tezligi 60, taksi tezligi 80 km/soat. Qirq km yo'lda vaqt farqi o'n daqiqami?",
          'Скорость автобуса 60, такси 80 км/ч. При 40 км разница во времени 10 минут?',
          'The bus speed is 60, the taxi speed is 80 km/h. Over 40 km, is the time difference 10 minutes?',
        ),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Qirq bo'lingan oltmish va qirq bo'lingan sakson ni soatdan daqiqaga o'tkazib solishtiring.", 'Переведи сорок шестидесятых и сорок восьмидесятых из часов в минуты и сравни.', 'Convert forty sixtieths and forty eightieths from hours to minutes and compare.') },
        ],
        solution: [
          L('40/60 soat = 40 daqiqa', '40/60 часа = 40 минут', '40/60 hour = 40 minutes'),
          L('40/80 soat = 30 daqiqa', '40/80 часа = 30 минут', '40/80 hour = 30 minutes'),
        ],
      },
      {
        expr: <Row size="big" align="center">{'a = −7,   b = −12'}</Row>,
        ok: L("Yo'q. Ikkalasi ham manfiy, shart esa musbat sonni talab qilgan edi.", 'Нет. Оба отрицательны, а условие требовало положительное число.', 'No. Both are negative, while the condition required a positive number.'),
        question: L(
          "Sonlar minus 7 va minus 12, ayirmasi 5, ko'paytmasi 84, lekin son musbat bo'lishi kerak edi. Bu javob shartga mosmi?",
          'Числа минус 7 и минус 12, их разность 5, произведение 84, но число должно было быть положительным. Подходит ли этот ответ условию?',
          'The numbers are negative 7 and negative 12, their difference is 5, product 84, but the number was required to be positive. Does this answer fit the condition?',
        ),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Kattaroq son musbat bo'lishi kerak edi, bu yerda ikkalasi ham manfiy.", 'Большее число должно было быть положительным, а здесь оба отрицательны.', 'The larger number should have been positive, but here both are negative.') },
        ],
        solution: ['−7 < 0', L('shartga zid', 'противоречит условию', 'contradicts the condition')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): manfiy yechim shartga
// zid bo'lsa ham javobga qo'shilgan (З47, darsning markaziy xatosi).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Manfiy javob shartga zid",
    'Отрицательный ответ противоречит условию',
    'A negative answer contradicts the condition',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham manfiy ildiz javobga qo'shib qo'yilgan.",
      'Два задания. В обоих отрицательный корень был добавлен в ответ.',
      'Two tasks. In both, a negative root was added to the answer.'),
    A('why',
      "Tenglama uni taqiqlamaydi, lekin masalaning shartida bunday son bo'lmaydi.",
      'Уравнение его не запрещает, но по условию задачи такого числа не бывает.',
      'The equation does not forbid it, but the problem\'s condition rules out such a number.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Manfiy son har safar shartga zid chiqdi.",
      'Оба разобраны. Отрицательное число каждый раз противоречило условию.',
      'Both are done. The negative number contradicted the condition each time.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'40/x − 40/(x+20) = 1/6   →   "javob: 60 km/soat yoki −80 km/soat"'}</Row>,
        ok: L("Yo'q. Tezlik manfiy bo'lolmaydi, minus sakson rad etiladi.", 'Нет. Скорость не может быть отрицательной, минус восемьдесят отвергается.', 'No. Speed cannot be negative, negative eighty is rejected.'),
        question: L("To'g'ri javob qaysi?", 'Какой ответ верен?', 'Which answer is correct?'),
        items: [
          { id: 'a', right: true, label: L('Faqat 60 km/soat', 'Только 60 км/ч', 'Only 60 km/h') },
          { id: 'b', label: L('60 km/soat yoki −80 km/soat', '60 км/ч или −80 км/ч', '60 km/h or −80 km/h'), hint: L("Bu ko'rsatilgan xato javobning o'zi, manfiy tezlik shartga zid.", 'Это и есть показанный ошибочный ответ, отрицательная скорость противоречит условию.', 'This is the very mistaken answer shown, negative speed contradicts the condition.') },
          { id: 'c', label: L('Faqat −80 km/soat', 'Только −80 км/ч', 'Only −80 km/h'), hint: L("Aksincha, aynan minus sakson rad etiladi.", 'Наоборот, именно минус восемьдесят отвергается.', 'The other way around, negative eighty is the one rejected.') },
        ],
        solution: [L('tezlik > 0', 'скорость > 0', 'speed > 0'), L('javob: 60 km/soat', 'ответ: 60 км/ч', 'answer: 60 km/h')],
      },
      {
        expr: <Row size="big" align="center">{'x² − x − 12 = 0   →   "tomon: 4 sm yoki −3 sm"'}</Row>,
        ok: L("Yo'q. Uzunlik manfiy bo'lolmaydi, minus uch rad etiladi.", 'Нет. Длина не может быть отрицательной, минус три отвергается.', 'No. Length cannot be negative, negative three is rejected.'),
        question: L("To'g'ri javob qaysi?", 'Какой ответ верен?', 'Which answer is correct?'),
        items: [
          { id: 'a', right: true, label: L('Faqat 4 sm', 'Только 4 см', 'Only 4 cm') },
          { id: 'b', label: L('4 sm yoki −3 sm', '4 см или −3 см', '4 cm or −3 cm'), hint: L("Bu ko'rsatilgan xato javobning o'zi, manfiy uzunlik shartga zid.", 'Это и есть показанный ошибочный ответ, отрицательная длина противоречит условию.', 'This is the very mistaken answer shown, negative length contradicts the condition.') },
          { id: 'c', label: L('Faqat −3 sm', 'Только −3 см', 'Only −3 cm'), hint: L("Aksincha, aynan minus uch rad etiladi.", 'Наоборот, именно минус три отвергается.', 'The other way around, negative three is the one rejected.') },
        ],
        solution: [L('uzunlik > 0', 'длина > 0', 'length > 0'), L('javob: 4 sm', 'ответ: 4 см', 'answer: 4 cm')],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill`): ish unumi
// masalasi to'liq yechiladi, manfiy ildiz rad etiladi.
// ============================================================
const S13 = {
  eyebrow: L('ISH UNUMI', 'ПРОИЗВОДИТЕЛЬНОСТЬ РАБОТЫ', 'WORK RATE'),
  title: L(
    "Usta necha kunda ishlaydi",
    'За сколько дней справится мастер',
    'How many days does the craftsman need',
  ),
  audio: [
    A('mount',
      "Usta ishni x kunda, shogird undan uch kun ortiq vaqtda bajaradi. Birga ikki kunda bajardilar.",
      'Мастер выполняет работу за x дней, ученик на три дня дольше. Вместе они справились за два дня.',
      'The craftsman finishes the work in x days, the apprentice three days longer. Together they finished in two days.'),
    A('why',
      "Bir kunlik ulushlarni qo'shib, tenglama tuzamiz. Manfiy kun bo'lmaydi.",
      'Складывая дневные доли, составляем уравнение. Отрицательных дней не бывает.',
      'Adding the daily shares, we set up the equation. There is no such thing as a negative day.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar manfiy kun rad etildi.",
      'Все три заполнены. Каждый раз отрицательный день отбрасывался.',
      'All three are filled. Each time the negative day was discarded.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['6', '3'],
      lines: [
        [{ t: '1/x + 1/(x+3) = 1/2   →   x² − x − ' }, { slot: '6' }, { t: ' = 0' }],
        [{ t: L('ildizlar 3 va minus 2, manfiyi rad etiladi, x = ', 'корни 3 и минус 2, отрицательный отбрасывается, x = ', 'roots 3 and minus 2, the negative one is dropped, x = ') }, { slot: '3' }],
      ],
    },
    tasks: [
      {
        chips: ['45', '5'],
        lines: [
          [{ t: "ayirma 4, ko'paytma 45   →   b² + 4b − " }, { slot: '45' }, { t: ' = 0' }],
          [{ t: L('ildizlar 5 va minus 9, manfiyi rad etiladi, b = ', 'корни 5 и минус 9, отрицательный отбрасывается, b = ', 'roots 5 and minus 9, the negative one is dropped, b = ') }, { slot: '5' }],
        ],
      },
      {
        chips: ['24', '6'],
        lines: [
          [{ t: 'P = 20, S = 24   →   x² − 10x + ' }, { slot: '24' }, { t: ' = 0' }],
          [{ t: 'x = ' }, { slot: '6' }, { t: L('  yoki  4', '  или  4', '  or  4') }],
        ],
      },
      {
        chips: ['30', '10'],
        lines: [
          [{ t: '1/x + 1/(x+5) = 1/6   →   x² − 7x − ' }, { slot: '30' }, { t: ' = 0' }],
          [{ t: L('ildizlar 10 va minus 3, manfiyi rad etiladi, x = ', 'корни 10 и минус 3, отрицательный отбрасывается, x = ', 'roots 10 and minus 3, the negative one is dropped, x = ') }, { slot: '10' }],
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
        id: 'q1', tag: 'З47',
        ask: L("Tomon topiladi, ildizlar 6 va minus 9. Javob qaysi?", 'Находится сторона, корни 6 и минус 9. Каков ответ?', 'A side is found, roots 6 and negative 9. What is the answer?'),
        options: [
          { id: 'ok', right: true, label: '6' },
          { id: 'wrong', label: '−9' },
          { id: 'both', label: L('6  va  −9', '6  и  −9', '6  and  −9') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Tomon uzunligi manfiy bo'lolmaydi.", 'Длина стороны не может быть отрицательной.', 'A side length cannot be negative.'),
        ok: L("To'g'ri, uzunlik musbat bo'lishi kerak.", 'Верно, длина должна быть положительной.', 'Correct, length must be positive.'),
      },
      {
        id: 'q2', tag: 'З3',
        ask: L("ODZ tenglamani tekshiradimi yoki masalaning shartini?", 'ОДЗ проверяет уравнение или условие задачи?', 'Does the domain check the equation or the problem\'s condition?'),
        options: [
          { id: 'ok', right: true, label: L('Tenglamani', 'Уравнение', 'The equation') },
          { id: 'problem', label: L('Masalani', 'Задачу', 'The problem') },
          { id: 'both', label: L('Ikkalasini ham', 'И то, и другое', 'Both') },
          { id: 'neither', label: L('Hech qaysisini', 'Ни то, ни другое', 'Neither') },
        ],
        hint: L("ODZ maxrajning nolga aylanishidan kelib chiqadi, bu tenglamaning o'zi.", 'ОДЗ следует из обращения знаменателя в нуль, это свойство самого уравнения.', 'The domain follows from a denominator becoming zero, a property of the equation itself.'),
        ok: L("To'g'ri, hayotiy shartni esa yechuvchi alohida tekshiradi.", 'Верно, а реальное условие проверяет отдельно решающий.', 'Correct, and the solver checks the real condition separately.'),
      },
      {
        id: 'q3', tag: 'З45',
        ask: L("O'n besh daqiqa necha soatga teng?", 'Чему равны пятнадцать минут в часах?', 'What is fifteen minutes in hours?'),
        options: [
          { id: 'ok', right: true, label: '1/4' },
          { id: 'wrong', label: '1/15' },
          { id: 'c', label: '15' },
          { id: 'd', label: '1/6' },
        ],
        hint: L("Bir soat oltmish daqiqa, o'n besh uning to'rtdan bir qismi.", 'Один час шестьдесят минут, пятнадцать, его четверть.', 'One hour is sixty minutes, and fifteen is a quarter of it.'),
        ok: L("To'g'ri, o'n besh oltmishdan bir to'rtga teng.", 'Верно, пятнадцать шестидесятых равно одной четверти.', 'Correct, fifteen sixtieths equals one quarter.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L("Tomonlar 7 va 5, perimetri 24mi?", 'Стороны 7 и 5, периметр 24?', 'Sides 7 and 5, is the perimeter 24?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
          { id: 'onlyIf', label: L("Faqat kvadrat bo'lsa", 'Только если квадрат', 'Only if it is a square') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Ikki karra yetti plyus besh ni hisoblang.", 'Посчитай дважды семь плюс пять.', 'Compute two times seven plus five.'),
        ok: L("To'g'ri, ikki karra o'n ikki yigirma to'rt.", 'Верно, дважды двенадцать двадцать четыре.', 'Correct, two times twelve is twenty four.'),
      },
      {
        id: 'q5', tag: 'З47',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Ikki sonning yig'indisi 3, ko'paytmasi minus 10. Sonlarni topib, musbatini yig'ing.",
            'Сумма двух чисел 3, произведение минус 10. Найди числа и собери положительное.',
            'The sum of two numbers is 3, the product is negative 10. Find the numbers and assemble the positive one.',
          ),
          lines: [
            [{ t: "yig'indi 3, ko'paytma −10   →   sonlar minus 2 va 5, musbati: " }, { slot: '5' }],
          ],
          tiles: [
            { id: 't1', v: '5', x: 12, y: 12 },
            { id: 't2', v: '−2', x: 70, y: 14 },
            { id: 't3', v: '3', x: 40, y: 50 },
            { id: 't4', v: '10', x: 78, y: 48 },
          ],
          hint: L(
            "Ikki son minus ikki va besh, ular yig'indisi uch, ko'paytmasi minus o'n.",
            'Два числа минус два и пять, их сумма три, произведение минус десять.',
            'The two numbers are negative two and five, their sum is three, product negative ten.',
          ),
          doneNote: L(
            "Yig'ildi. Musbat son besh.",
            'Собрано. Положительное число пять.',
            'Assembled. The positive number is five.',
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
    "Javob shartga qaytadi, unga zid ildiz rad etiladi",
    'Ответ возвращается к условию, противоречащий корень отвергается',
    'The answer returns to the condition, and a contradicting root is rejected',
  ),
  audio: [
    A('s0',
      "Darsdan bitta xulosa qoladi. Tenglama ikkita son beradi, lekin masala faqat bittasini qabul qiladi.",
      'С урока остаётся один вывод. Уравнение даёт два числа, но задача принимает только одно.',
      'One conclusion stays with you. The equation gives two numbers, but the problem accepts only one.'),
    A('s1',
      "Bugun uch narsa qilindi. Masaladan tenglama tuzdingiz, uni yechdingiz va shartga zid ildizni rad etdingiz.",
      'Сегодня сделано три вещи. Ты составил уравнение по задаче, решил его и отверг корень, противоречащий условию.',
      'Three things are done today. You built an equation from a problem, solved it, and rejected the root contradicting the condition.'),
    A('s2',
      "Keyingi darsda kvadrat uchhadni ko'paytuvchilarga ajratish va bikvadrat tenglamalar.",
      'В следующем уроке разложение квадратного трёхчлена на множители и биквадратные уравнения.',
      'The next lesson covers factoring a quadratic trinomial and biquadratic equations.',
    ),
  ],
  props: {
    mark: '40/x − 40/(x+20) = 1/6',
    markNote: L(
      "javob 60 km/soat, minus 80 rad etildi",
      'ответ 60 км/ч, минус 80 отвергнут',
      'the answer is 60 km/h, negative 80 was rejected',
    ),
    lines: [
      L(
        "Noma'lum harf bilan belgilanadi",
        'Неизвестное обозначается буквой',
        'The unknown is denoted by a letter',
      ),
      L(
        "Shartdan tenglama tuzilib yechiladi",
        'Из условия составляется и решается уравнение',
        'An equation is built from the condition and solved',
      ),
      L(
        "Shartga zid ildiz javobga kiritilmaydi",
        'Корень, противоречащий условию, в ответ не входит',
        'A root contradicting the condition is not included',
      ),
    ],
    bridge: L(
      "Keyingi dars: ko'paytuvchilarga ajratish va bikvadrat tenglamalar",
      'Следующий урок: разложение на множители и биквадратные уравнения',
      'Next lesson: factoring and biquadratic equations',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — TO'RT DERAZA.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З47', 'З45', 'З47',
    'З3', 'З47', 'З47', 'З47', 'З47',
    'З16', 'З47', 'З47', null, null,
  ],
  mechanic: { at: 5, tool: 'fourwin', kind: 'return' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
