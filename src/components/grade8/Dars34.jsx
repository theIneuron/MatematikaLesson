// ============================================================================
// 8-sinf, Dars 34. MA'LUMOTLARNI YIG'ISH VA IFODALASH.
//
// Bu fayl, FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `freqtable.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya, 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `freqtable` (`FreqTable`): xom son o'z
// ustuniga tushadi, chastota o'zi oshadi.
//
// MANBA: 8-sinf algebra darsligi, IV bob, 28-§ (188-192-bet). Barcha sonlar
// darslikdan olingan:
//   - lampochka misoli (189-bet): bosh to'plam va tanlanma;
//   - g'o'za g'unchalari, 10 tup (189-bet, 4-masala): 15,11,10,15,17,15,16,
//     16,17,18 — variatsion qatori va chastotalar jadvali (190-bet, 3- va
//     4-jadval) shu ma'lumotdan;
//   - DAN, 30 avtomobil tezligi km/h (191-bet, 5-masala): 60,62,65,66,68,
//     71,73,75 / chastota 2,2,5,7,6,4,3,1 — chastotalar poligoni (39-rasm);
//   - DAN, 100 avtomobil, 6 oylik yurgan masofasi km, 7 sinf (192-bet):
//     8001-9000...14001-15000 / chastota 4,6,18,36,22,10,4 — poligon VA
//     ustunli diagramma bir ma'lumotda (40-a, b rasm).
//
// ADASHISHLAR, yangi ikkitasi:
//   З69, chastota (butun son) va nisbiy chastota (ulush) chalkashtirilgan;
//   З70, chastotalar yig'indisi tanlanma hajmiga teng emasligi tekshirilmadi;
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
  id: 'alg-8-34',
  n: 34,
  row: 38,
  block: 'Б5',
  topic: L(
    "Ma'lumotlarni yig'ish va ifodalash",
    'Сбор и представление данных',
    'Collecting and representing data',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Tanlanma natijalari o'sish tartibida yozilgan qator variatsion qator deyiladi",
    'Ряд, в котором результаты выборки записаны в порядке возрастания, называется вариационным рядом',
    'The row where the sample results are written in increasing order is called the variation series',
  ),
  L(
    "Har bir variant necha marta takrorlangani chastota, uning tanlanma hajmiga nisbati nisbiy chastota deyiladi",
    'Число, сколько раз повторился каждый вариант, называется частотой, а его отношение к объёму выборки, относительной частотой',
    'The number of times each variant repeats is the frequency, and its ratio to the sample size is the relative frequency',
  ),
  L(
    "Chastotalar yig'indisi doim tanlanma hajmiga teng",
    'Сумма частот всегда равна объёму выборки',
    'The sum of the frequencies always equals the sample size',
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
  'З69': {
    what: L(
      "chastota va nisbiy chastota chalkashtirilgan, ulush o'rniga butun son yozilgan",
      'частота и относительная частота спутаны, вместо доли записано целое число',
      'frequency and relative frequency were confused, a whole number written instead of a share',
    ),
    wrong: '3',
    at: 10,
  },
  'З70': {
    what: L(
      "chastotalar yig'indisi tanlanma hajmiga teng emasligi tekshirilmadi",
      'не проверено, что сумма частот равна объёму выборки',
      'it was not checked that the sum of the frequencies equals the sample size',
    ),
    wrong: '96',
    at: 12,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: lampochka zavodi, bosh to'plam va tanlanma. Yakun:
// chastotalar poligoni siljigan chiziq sifatida.
// ============================================================
const SC_ASK = L('MINGTASINI SINASH SHART EMAS', 'ТЫСЯЧУ ПРОВЕРЯТЬ НЕ НУЖНО', 'NO NEED TO TEST THEM ALL')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="48" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink}>{"zavod, ko'p ming lampochka"}</text>
      <g className="g8-seat" style={{ '--d': '2000ms' }}>
        <circle cx="200" cy="90" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="97" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.graph}>{'1000'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '2600ms' }}>
        <text x="200" y="122" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>{'sinash uchun tanlanma'}</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Nuqtalar tutashtirilsa poligon, ustun qilinsa diagramma chiqadi",
      'Точки соединили — вышел полигон, поставили столбиками — диаграмма',
      'Connect the points and a polygon appears, stand them as bars and a chart appears',
    )}>
      <polyline points="120,80 145,78 170,55 195,30 220,48 245,60 270,68 280,75"
        fill="none" stroke={T.ok} strokeWidth="2.4"/>
      <g className="g8-seat" style={{ '--d': '1400ms' }}>
        <text x="200" y="105" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fill={T.ink3}>{'chastotalar poligoni'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('BOSH TO\'PLAM VA TANLANMA', 'ГЕНЕРАЛЬНАЯ СОВОКУПНОСТЬ И ВЫБОРКА', 'POPULATION AND SAMPLE'),
  title: L(
    "Zavod ko'p ming lampochka chiqaradi. Sifatini bilish uchun nechtasini sinash kerak",
    'Завод выпускает много тысяч лампочек. Сколько нужно проверить, чтобы узнать качество',
    'A factory makes many thousands of light bulbs. How many must be tested to know the quality',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Zavod juda ko'p lampochka chiqaradi. Hammasini sinab bo'lmaydi.",
      'Завод выпускает очень много лампочек. Проверить все невозможно.',
      'The factory makes very many light bulbs. Testing all of them is impossible.'),
    A('why',
      "Taxmin qiling, sifatni bilish uchun nechtasi tekshiriladi.",
      'Предположи, сколько лампочек проверяют, чтобы узнать качество.',
      'Predict how many light bulbs are checked to learn the quality.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, nechta lampochka tasodifiy tanlab sinaladi?",
      'Как думаешь, сколько лампочек выбирают случайно для проверки?',
      'What do you think, how many light bulbs are randomly picked for testing?',
    ),
    items: [
      { id: 'a', show: '5' },
      { id: 'b', show: '1000' },
      { id: 'c', show: L("Hammasi", 'Все', 'All of them') },
      { id: 'd', show: '100 000' },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Sonlarni o'sish tartibida yozish (5-6-sinfdan). Shu
// tayanch variatsion qator uchun kerak.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Sonlarni o'sish tartibida yozishni eslash",
    'Вспоминаем запись чисел в порядке возрастания',
    'Recalling writing numbers in increasing order',
  ),
  audio: [
    A('mount',
      "To'rt qator. Faqat bittasida sonlar to'g'ri, o'sish tartibida.",
      'Четыре ряда. Только в одном числа верно расставлены по возрастанию.',
      'Four rows. Only in one are the numbers correctly arranged in increasing order.'),
    A('why',
      "Har bir keyingi son avvalgisidan kichik bo'lmasligi kerak.",
      'Каждое следующее число не должно быть меньше предыдущего.',
      'Each next number must not be smaller than the previous one.'),
  ],
  props: {
    ask: L(
      "15, 11, 10, 17, 16 sonlari qaysi qatorda o'sish tartibida?",
      'В каком ряду числа 15, 11, 10, 17, 16 расставлены по возрастанию?',
      'In which row are the numbers 15, 11, 10, 17, 16 arranged in increasing order?',
    ),
    items: [
      { id: 'right', show: '10, 11, 15, 16, 17', right: true, name: L('har biri avvalgisidan katta yoki teng', 'каждое больше или равно предыдущему', 'each is greater than or equal to the previous one') },
      {
        id: 'orig', show: '15, 11, 10, 17, 16',
        hint: L("Bu berilgan tartib, hali saralanmagan.", 'Это исходный порядок, ещё не отсортированный.', 'That is the original order, not yet sorted.'),
      },
      {
        id: 'desc', show: '17, 16, 15, 11, 10',
        hint: L("Bu kamayish tartibi, o'sish emas.", 'Это порядок убывания, а не возрастания.', 'That is decreasing order, not increasing.'),
      },
      {
        id: 'wrong', show: '10, 11, 16, 15, 17',
        hint: L("O'n olti o'n beshdan keyin turibdi, bu xato joy.", 'Шестнадцать стоит после пятнадцати, это неверное место.', 'Sixteen stands after fifteen, that is the wrong place.'),
      },
    ],
    after: L(
      "To'g'ri. O'sish tartibida yozilgan qator variatsion qator deyiladi.",
      'Верно. Ряд, записанный по возрастанию, называется вариационным рядом.',
      'Correct. The row written in increasing order is called the variation series.',
    ),
  },
}

// ============================================================
// EKRAN 3. SONNI BURANG (1-darsning `steppers`). Nisbiy chastota, chastota
// bo'lingan tanlanma hajmi; hajm nolga tushganda aniqlanmagan.
// ============================================================
const S3 = {
  eyebrow: L('NISBIY CHASTOTANI BURANG', 'КРУТИ ОТНОСИТЕЛЬНУЮ ЧАСТОТУ', 'TURN THE RELATIVE FREQUENCY'),
  title: L(
    "Nisbiy chastota, chastota bo'lingan tanlanma hajmi",
    'Относительная частота, частота, делённая на объём выборки',
    'The relative frequency is the frequency divided by the sample size',
  ),
  audio: [
    A('mount',
      "Ikki son buriladi. Bir variant necha marta uchragani va jami nechta sinov o'tkazilgani.",
      'Крутятся два числа. Сколько раз встретился вариант и сколько всего было испытаний.',
      'Two numbers are turned. How many times the variant occurred and how many trials there were in total.'),
    A('why',
      "Ikki maqsad beriladi. Nisbiy chastotani turli qiymatlarga olib boring.",
      'Даны две цели. Приведи относительную частоту к разным значениям.',
      'Two targets are given. Bring the relative frequency to different values.'),
    A('why',
      "Oxirida jami sinovlar sonini nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти общее число испытаний до нуля и посмотри, что будет.',
      'At the end bring the total number of trials down to zero and see what happens.'),
  ],
  props: {
    cols: [
      { id: 'ni', label: L("necha marta uchragan", 'сколько раз встретился', 'how many times it occurred'), start: 3, min: 0, max: 10, step: 1 },
      { id: 'n', label: L('jami sinovlar', 'всего испытаний', 'total trials'), start: 10, min: 0, max: 10, step: 1, risky: true },
    ],
    calc: (v) => (v[1] === 0 ? null : Math.round((v[0] / v[1]) * 100) / 100),
    resultLabel: L('nisbiy chastota', 'относительная частота', 'relative frequency'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "jami sinovlar hali nolga tushmasin, avval maqsadlarni oling.",
      'Общее число испытаний пока не опускай до нуля, сначала возьми цели.',
      'Do not bring the total trials down to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: 0.5,
        ask: L("Nisbiy chastota 0,5 bo'lsin", 'Пусть относительная частота будет равна 0,5', 'Make the relative frequency equal 0.5'),
        after: L(
          "0,5. Besh marta o'nta sinovdan, yarmi.",
          '0,5. Пять раз из десяти испытаний, половина.',
          '0.5. Five times out of ten trials, half.',
        ),
      },
      {
        value: 0.2,
        ask: L("Endi nisbiy chastota 0,2 bo'lsin", 'Теперь пусть относительная частота будет равна 0,2', 'Now make the relative frequency equal 0.2'),
        after: L(
          "0,2. Ikki marta o'nta sinovdan, beshdan bir ulush.",
          '0,2. Два раза из десяти испытаний, одна пятая доля.',
          '0.2. Two times out of ten trials, one fifth of the share.',
        ),
      },
    ],
    ask: L("Nisbiy chastota 0,5 bo'lsin", 'Пусть относительная частота будет равна 0,5', 'Make the relative frequency equal 0.5'),
    ask2: L("Endi jami sinovlar sonini nolga tushiring", 'Теперь опусти общее число испытаний до нуля', 'Now bring the total number of trials down to zero'),
    broke: L(
      "Jami sinovlar nolga teng bo'lganda nisbiy chastotani topib bo'lmaydi, chunki hech qanday sinov o'tkazilmagan. Ulush hisoblanadigan narsaning o'zi yo'q.",
      'Когда общее число испытаний равно нулю, относительную частоту найти невозможно, потому что испытаний не было. Нет того, от чего считать долю.',
      'When the total number of trials is zero, the relative frequency cannot be found, because no trial took place. There is nothing to compute the share from.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI VARIANT KO'P (1-darsning `pick`). Jadvalni o'qish, eng
// katta chastotani topish.
// ============================================================
const S4 = {
  eyebrow: L('JADVALNI O\'QING', 'ПРОЧТИ ТАБЛИЦУ', 'READ THE TABLE'),
  title: L(
    "G'o'za g'unchalari sonining chastotalar jadvalida qaysi variant eng ko'p uchraydi",
    'В таблице частот числа бутонов хлопчатника какой вариант встречается чаще всего',
    'In the frequency table of cotton bud counts, which variant occurs most often',
  ),
  audio: [
    A('mount',
      "Jadval bor, variant va chastota ustunlari. Eng katta chastotali variant izlanadi.",
      'Есть таблица, столбцы варианта и частоты. Ищем вариант с наибольшей частотой.',
      'There is a table, with variant and frequency columns. We look for the variant with the greatest frequency.'),
    A('why',
      "Chastota ustuniga qaraladi, o'zining son qiymatiga emas.",
      'Смотрим на столбец частоты, а не на сам вариант.',
      'We look at the frequency column, not at the variant value itself.'),
  ],
  props: {
    ask: L(
      "Variant 10, 11, 15, 16, 17, 18, chastota 1, 1, 3, 2, 2, 1. Qaysi variant eng ko'p uchraydi?",
      'Вариант 10, 11, 15, 16, 17, 18, частота 1, 1, 3, 2, 2, 1. Какой вариант встречается чаще всего?',
      'Variant 10, 11, 15, 16, 17, 18, frequency 1, 1, 3, 2, 2, 1. Which variant occurs most often?',
    ),
    items: [
      { id: 'right', show: '15', right: true, name: L('chastotasi uch, eng katta', 'частота три, наибольшая', 'frequency three, the greatest') },
      {
        id: 'ten', show: '10',
        hint: L("O'nning chastotasi bir, eng kichigi.", 'У десяти частота один, самая маленькая.', 'Ten has frequency one, the smallest.'),
      },
      {
        id: 'seventeen', show: '17',
        hint: L("O'n yettining chastotasi ikki, o'n beshdan kam.", 'У семнадцати частота два, меньше, чем у пятнадцати.', 'Seventeen has frequency two, less than fifteen.'),
      },
      {
        id: 'freq', show: '3',
        hint: L("Uch bu chastota, variant emas. Savol variant haqida.", 'Три это частота, а не вариант. Вопрос про вариант.', 'Three is the frequency, not the variant. The question is about the variant.'),
      },
    ],
    after: L(
      "To'g'ri. O'n besh uch marta takrorlangan, boshqalaridan ko'proq.",
      'Верно. Пятнадцать повторилось три раза, больше остальных.',
      'Correct. Fifteen repeated three times, more than the others.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI, XOM MA'LUMOT TERILADI (`freqtable`).
// G'o'za g'unchalari, 10 tup (darslik, 189-190-bet).
// ============================================================
const S5 = {
  eyebrow: L('SONLARNI USTUNLARGA TERING', 'РАЗЛОЖИ ЧИСЛА ПО СТОЛБЦАМ', 'SORT THE NUMBERS INTO COLUMNS'),
  title: L(
    "Har bir sonni bosing, u o'z ustuniga tushadi",
    'Нажимай на каждое число, оно падает в свой столбец',
    'Tap each number, it drops into its own column',
  ),
  audio: [
    A('mount',
      "O'n tup g'o'zadagi g'unchalar soni sanalgan. O'n xom son turibdi.",
      'Посчитаны бутоны на десяти кустах хлопчатника. Стоят десять сырых чисел.',
      'The buds on ten cotton plants were counted. Ten raw numbers are standing there.'),
    A('why',
      "Har bir sonni bosing, u shu qiymatning ustuniga tushadi va chastota birga oshadi.",
      'Нажимай на каждое число, оно падает в столбец своего значения, и частота увеличивается на один.',
      'Tap each number, it drops into the column of its value, and the frequency increases by one.'),
    W('tally',
      "Hammasi ustunlarga tushdi. Bu darslikdagi chastotalar jadvalining o'zi.",
      'Все числа разложены по столбцам. Это и есть таблица частот из учебника.',
      'All the numbers are sorted into columns. This is exactly the frequency table from the textbook.'),
  ],
  props: {
    raw: [15, 11, 10, 15, 17, 15, 16, 16, 17, 18],
    values: [10, 11, 15, 16, 17, 18],
    fields: [
      {
        ask: L("15 sonining nisbiy chastotasi qancha?", 'Чему равна относительная частота числа 15?', 'What is the relative frequency of the number 15?'),
        kind: 'number',
        answer: '3/10',
        accepts: ['3/10', '0.3'],
        hints: {
          '3': L("Uch bu chastota, o'z chastotasi. Nisbiy chastota uchun uni o'nga bo'lish kerak.", 'Три это сама частота. Для относительной нужно разделить её на десять.', 'Three is the frequency itself. For the relative frequency it must be divided by ten.'),
        },
      },
    ],
    note: L(
      "O'n besh uch marta uchradi, jami o'n tup, nisbiy chastota o'n dan uch.",
      'Пятнадцать встретилось три раза, всего десять кустов, относительная частота три десятых.',
      'Fifteen occurred three times, ten plants in total, the relative frequency is three tenths.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): chastotani topishning ikki
// yo'li, xom ro'yxatdan sanash va jadvaldan o'qish.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "O'n besh sonining chastotasini topishning ikki yo'li",
    'Два способа найти частоту числа пятнадцать',
    'Two ways to find the frequency of the number fifteen',
  ),
  audio: [
    A('mount',
      "Bitta natija va ikki yo'l. Ikkalasi ham bir xil chastotani beradi.",
      'Один результат и два пути. Оба дают одну и ту же частоту.',
      'One result and two ways. Both give the same frequency.'),
    W('w2',
      "Birinchi yo'lda xom ro'yxat qatorma-qator sanaladi.",
      'В первом пути сырой список считается по порядку.',
      'In the first way, the raw list is counted in order.'),
    W('w4',
      "Ikkinchi yo'lda tayyor jadvaldagi ustun o'qiladi.",
      'Во втором пути читается столбец из готовой таблицы.',
      'In the second way, the column of the ready table is read.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL, RO\'YXATDAN SANASH', 'СПОСОБ 1, СЧЁТ ПО СПИСКУ', 'METHOD 1, COUNTING FROM THE LIST'),
        lead: L(
          "15, 11, 10, 15, 17, 15, 16, 16, 17, 18 ro'yxatida o'n beshni sanaymiz",
          'В списке 15, 11, 10, 15, 17, 15, 16, 16, 17, 18 считаем пятнадцать',
          'In the list 15, 11, 10, 15, 17, 15, 16, 16, 17, 18 we count fifteen',
        ),
        rows: [
          { text: '15, 15, 15' },
          { text: L("uch marta uchraydi", 'встречается три раза', 'occurs three times'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL, JADVALDAN O\'QISH', 'СПОСОБ 2, ЧТЕНИЕ ИЗ ТАБЛИЦЫ', 'METHOD 2, READING FROM THE TABLE'),
        lead: L(
          "Tayyor jadvalda o'n besh ustunidagi chastotani o'qiymiz",
          'В готовой таблице читаем частоту в столбце пятнадцати',
          'In the ready table we read the frequency in the column of fifteen',
        ),
        rows: [
          { text: L('variant 15, chastota 3', 'вариант 15, частота 3', 'variant 15, frequency 3') },
          { text: L("jadval tayyor, faqat o'qiladi", 'таблица готова, только читается', 'the table is ready, only read'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL CHASTOTA BERDI', 'ОБА ДАЛИ ОДНУ ЧАСТОТУ', 'BOTH GAVE THE SAME FREQUENCY'),
        lead: L(
          "Sanash ishonchli, jadval esa tezroq",
          'Счёт надёжен, а таблица быстрее',
          'Counting is reliable, the table is faster',
        ),
        rows: [{ text: '3', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): chastotalar poligonining uch
// qismi, DAN, 30 avtomobil tezligi (191-bet, 5-masala).
// ============================================================
const S7 = {
  eyebrow: L('POLIGON QANDAY QURILADI', 'КАК СТРОИТСЯ ПОЛИГОН', 'HOW THE POLYGON IS BUILT'),
  title: L(
    "Chastotalar poligonining uch qismi",
    'Три части полигона частот',
    'The three parts of the frequency polygon',
  ),
  audio: [
    A('mount',
      "O'ttiz avtomobil tezligi o'lchandi. Har bir nuqta bitta variantni ko'rsatadi.",
      'Измерена скорость тридцати автомобилей. Каждая точка показывает один вариант.',
      'The speed of thirty cars was measured. Each point shows one variant.'),
    W('p2',
      "Nuqtaning gorizontal o'qi variantni, vertikal o'qi chastotani ko'rsatadi.",
      'Горизонтальная ось точки показывает вариант, вертикальная, частоту.',
      'The point\'s horizontal axis shows the variant, the vertical shows the frequency.'),
    W('p4',
      "Nuqtalar ketma-ket kesmalar bilan tutashtirilganda poligon hosil bo'ladi.",
      'Когда точки соединены отрезками по порядку, получается полигон.',
      'When the points are connected by segments in order, the polygon is formed.',
    ),
  ],
  props: {
    tokens: [
      { t: '(65; 5)', id: 'a' },
      { t: '  →  ', id: 'arrow' },
      { t: '(66; 7)', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi nuqta. Oltmish besh kilometr soatiga tezlik, besh marta uchragan.",
          'Первая точка. Скорость шестьдесят пять километров в час, встретилась пять раз.',
          'The first point. Speed sixty-five kilometres per hour, occurred five times.',
        ),
      },
      {
        focus: 'arrow',
        text: L(
          "Ikkinchi qadam. Nuqtalar tezlik o'sishi tartibida ketma-ket tutashtiriladi.",
          'Второй шаг. Точки соединяются подряд, в порядке роста скорости.',
          'The second step. The points are connected in a row, in order of increasing speed.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi nuqta. Oltmish olti kilometr soatiga tezlik, yetti marta uchragan, eng katta chastota.",
          'Третья точка. Скорость шестьдесят шесть километров в час, встретилась семь раз, наибольшая частота.',
          'The third point. Speed sixty-six kilometres per hour, occurred seven times, the greatest frequency.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Poligon so'zi yunoncha ko'p burchak degan ma'noni bildiradi, chastotalar poligoni ham ko'p burchakli siniq chiziq.",
        'Слово полигон по-гречески означает многоугольник, и полигон частот тоже ломаная линия с многими углами.',
        'The word polygon means many-angled in Greek, and the frequency polygon is also a broken line with many angles.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Darslik 28-§ ta'riflari.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Variatsion qator, chastota, nisbiy chastota",
    'Вариационный ряд, частота, относительная частота',
    'The variation series, frequency, relative frequency',
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
      { id: 'f1', label: L("tanlanma natijalari o'sish tartibida yozilsa, variatsion qator hosil bo'ladi", 'если результаты выборки записать по возрастанию, получится вариационный ряд', 'if the sample results are written in increasing order, a variation series results') },
      { id: 'f2', label: L("har bir variant necha marta takrorlangani chastota deyiladi", 'сколько раз повторился каждый вариант, называется частотой', 'how many times each variant repeats is called the frequency') },
      { id: 'f3', label: L("chastotaning tanlanma hajmiga nisbati nisbiy chastota deyiladi", 'отношение частоты к объёму выборки называется относительной частотой', 'the ratio of the frequency to the sample size is called the relative frequency') },
      { id: 'w1', label: L("chastotalar yig'indisi istalgan songa teng bo'lishi mumkin", 'сумма частот может быть равна любому числу', 'the sum of the frequencies can equal any number') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Chastotalar yig'indisi ISTALGAN songa emas, aynan tanlanma hajmiga teng.",
      'Так не складывается. Сумма частот равна не ЛЮБОМУ числу, а именно объёму выборки.',
      'That does not fit. The sum of the frequencies equals not just ANY number, but exactly the sample size.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik 28-paragrafi asosida (188-190-bet)",
        'Правило на основе параграфа 28 учебника (стр. 188-190)',
        'The rule is based on section 28 of the textbook (pages 188-190)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Zavodning barcha lampochkalarini qanday sinashni hali bilmaymiz",
        'Мы пока не знаем, как проверить все лампочки завода',
        'We still do not know how to test all the light bulbs of the factory',
      ),
      right: L(
        "endi tanlanma va uning variatsion qatori bilan ishlashni bilamiz",
        'теперь умеем работать с выборкой и её вариационным рядом',
        'now we know how to work with a sample and its variation series',
      ),
      winner: 'right',
      note: L(
        "Chastota necha marta uchraganini, nisbiy chastota ulushini ko'rsatadi",
        'Частота показывает, сколько раз, относительная частота, какую долю',
        'The frequency shows how many times, the relative frequency shows what share',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): DAN, 100 avtomobil, 7 sinfli
// jadvalni o'qish (192-bet).
// ============================================================
const ASK_TABLE = L("Jadvaldan javobni toping", 'Найди ответ по таблице', 'Find the answer from the table')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Yuz avtomobilning masofa jadvalini o'qing",
    'Прочти таблицу пробега ста автомобилей',
    'Read the mileage table of a hundred cars',
  ),
  audio: [
    A('mount',
      "Yetti sinf. Har birida masofa oralig'i va chastota.",
      'Семь классов. В каждом интервал расстояния и частота.',
      'Seven classes. Each has a distance interval and a frequency.'),
    A('why',
      "Savolga qarab, kerakli sinfning chastotasi o'qiladi.",
      'В зависимости от вопроса читается частота нужного класса.',
      'Depending on the question, the frequency of the needed class is read.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar kerakli sinf jadvaldan to'g'ri topilgan.",
      'Все пять разобраны. Каждый раз нужный класс верно находился в таблице.',
      'All five are done. Each time the needed class was correctly found in the table.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'4, 6, 18, 36, 22, 10, 4'}</Row>,
        ok: L("Ha. To'rtinchi sinfning chastotasi o'ttiz olti, eng katta.", 'Да. Частота четвёртого класса тридцать шесть, наибольшая.', 'Yes. The fourth class has frequency thirty-six, the greatest.'),
        question: L("Qaysi sinfning chastotasi eng katta?", 'У какого класса частота наибольшая?', 'Which class has the greatest frequency?'),
        items: [
          { id: 'a', right: true, label: L('11001–12000', '11001–12000', '11001-12000') },
          { id: 'b', label: L('10001–11000', '10001–11000', '10001-11000'), hint: L("Bu uchinchi sinf, chastotasi o'n sakkiz, eng kattasi emas.", 'Это третий класс, частота восемнадцать, не наибольшая.', 'That is the third class, frequency eighteen, not the greatest.') },
        ],
        solution: ['11001–12000', '36'],
      },
      {
        expr: <Row size="big" align="center">{'4, 6, 18, 36, 22, 10, 4'}</Row>,
        ok: L("Ha. Birinchi sinfning chastotasi to'rt.", 'Да. Частота первого класса четыре.', 'Yes. The first class has frequency four.'),
        question: L("Birinchi sinfning chastotasi qancha?", 'Чему равна частота первого класса?', 'What is the frequency of the first class?'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '6', hint: L("Bu ikkinchi sinfning chastotasi.", 'Это частота второго класса.', 'That is the frequency of the second class.') },
        ],
        solution: ['8001–9000', '4'],
      },
      {
        expr: <Row size="big" align="center">{'8001–9000'}</Row>,
        ok: L("Ha. Har bir sinf ming kilometrni qamrab oladi.", 'Да. Каждый класс охватывает тысячу километров.', 'Yes. Each class spans a thousand kilometres.'),
        question: L("Har bir sinfning o'lchami necha kilometr?", 'Каков размер каждого класса в километрах?', 'What is the size of each class in kilometres?'),
        items: [
          { id: 'a', right: true, label: '1000' },
          { id: 'b', label: '100', hint: L("8001 dan 9000 gacha ming kilometr, yuz emas.", 'От 8001 до 9000 тысяча километров, а не сто.', 'From 8001 to 9000 is a thousand kilometres, not a hundred.') },
        ],
        solution: ['9000 − 8001 + 1', '1000'],
      },
      {
        expr: <Row size="big" align="center">{'4, 6, 18, 36, 22, 10, 4'}</Row>,
        ok: L("Ha. To'rt qo'shilgan olti, o'n sakkiz, o'ttiz olti, yigirma ikki, o'n, to'rt, jami yuz.", 'Да. Четыре плюс шесть, восемнадцать, тридцать шесть, двадцать два, десять, четыре, всего сто.', 'Yes. Four plus six, eighteen, thirty-six, twenty-two, ten, four, altogether a hundred.'),
        question: L("Barcha chastotalarning yig'indisi qancha?", 'Чему равна сумма всех частот?', 'What is the sum of all the frequencies?'),
        items: [
          { id: 'a', right: true, label: '100' },
          { id: 'b', label: '96', hint: L("Bitta sinf tushib qolgan, yig'indi yuzga teng bo'lishi kerak, tanlanma hajmicha.", 'Один класс пропущен, сумма должна равняться сотне, объёму выборки.', 'One class is missing; the sum should equal a hundred, the sample size.') },
        ],
        solution: ['4+6+18+36+22+10+4', '100'],
      },
      {
        expr: <Row size="big" align="center">{'4, 6, 18, 36, 22, 10, 4'}</Row>,
        ok: L("Ha. Beshinchi sinfning chastotasi yigirma ikki.", 'Да. Частота пятого класса двадцать два.', 'Yes. The fifth class has frequency twenty-two.'),
        question: L("Beshinchi sinfning chastotasi qancha?", 'Чему равна частота пятого класса?', 'What is the frequency of the fifth class?'),
        items: [
          { id: 'a', right: true, label: '22' },
          { id: 'b', label: '10', hint: L("Bu oltinchi sinfning chastotasi, beshinchisi emas.", 'Это частота шестого класса, а не пятого.', 'That is the frequency of the sixth class, not the fifth.') },
        ],
        solution: ['12001–13000', '22'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): nisbiy chastotani hisoblash,
// g'o'za jadvalidan (190-191-bet).
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Nisbiy chastotani hisoblang",
    'Вычисли относительную частоту',
    'Compute the relative frequency',
  ),
  audio: [
    A('mount',
      "Uch variant. Har birining nisbiy chastotasini toping.",
      'Три варианта. Найди относительную частоту каждого.',
      'Three variants. Find the relative frequency of each.'),
    A('why',
      "Chastota tanlanma hajmiga bo'linadi, jami o'n tup.",
      'Частота делится на объём выборки, всего десять кустов.',
      'The frequency is divided by the sample size, ten plants in total.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar chastota o'n tupga bo'lingan.",
      'Все три разобраны. Каждый раз частота делилась на десять кустов.',
      'All three are done. Each time the frequency was divided by ten plants.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'10  →  1'}</Row>,
        ok: L("Ha. Bir bo'lingan o'n, o'ndan bir ulush.", 'Да. Один делённый на десять, одна десятая доля.', 'Yes. One divided by ten, one tenth of a share.'),
        question: L("Nisbiy chastota qancha?", 'Чему равна относительная частота?', 'What is the relative frequency?'),
        items: [
          { id: 'a', right: true, label: '1/10' },
          { id: 'b', label: '1', hint: L("Bu chastotaning o'zi, ulush emas. Uni o'n tupga bo'lish kerak.", 'Это сама частота, а не доля. Её нужно разделить на десять кустов.', 'That is the frequency itself, not the share. It must be divided by ten plants.') },
        ],
        solution: ['1', '1/10'],
      },
      {
        expr: <Row size="big" align="center">{'16  →  2'}</Row>,
        ok: L("Ha. Ikki bo'lingan o'n, beshdan bir ulush.", 'Да. Два делённых на десять, одна пятая доля.', 'Yes. Two divided by ten, one fifth of a share.'),
        question: L("Nisbiy chastota qancha?", 'Чему равна относительная частота?', 'What is the relative frequency?'),
        items: [
          { id: 'a', right: true, label: '1/5' },
          { id: 'b', label: '2', hint: L("Bu chastotaning o'zi. Ikki bo'lingan o'n qisqartiriladi.", 'Это сама частота. Два делённых на десять сокращается.', 'That is the frequency itself. Two divided by ten reduces.') },
        ],
        solution: ['2/10', '1/5'],
      },
      {
        expr: <Row size="big" align="center">{'17  →  2'}</Row>,
        ok: L("Ha. Ikki bo'lingan o'n, beshdan bir ulush, o'n oltinikidek.", 'Да. Два делённых на десять, одна пятая доля, как у шестнадцати.', 'Yes. Two divided by ten, one fifth of a share, same as sixteen.'),
        question: L("Nisbiy chastota qancha?", 'Чему равна относительная частота?', 'What is the relative frequency?'),
        items: [
          { id: 'a', right: true, label: '1/5' },
          { id: 'b', label: '2/17', hint: L("Bo'linuvchi tanlanma hajmi o'n, o'n yetti emas.", 'Делитель это объём выборки десять, а не семнадцать.', 'The divisor is the sample size ten, not seventeen.') },
        ],
        solution: ['2/10', '1/5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): chastotalar yig'indisi
// tanlanma hajmiga teng ekanini son bilan tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Chastotalar yig'indisi tanlanma hajmiga tengligini tekshiring",
    'Проверь, что сумма частот равна объёму выборки',
    'Check that the sum of the frequencies equals the sample size',
  ),
  audio: [
    A('mount',
      "Uch jadval. Har birida chastotalarni qo'shib, tanlanma hajmini toping.",
      'Три таблицы. В каждой сложи частоты и найди объём выборки.',
      'Three tables. In each, add the frequencies and find the sample size.'),
    A('why',
      "Yig'indi jami sinovlar soniga teng bo'lishi kerak.",
      'Сумма должна равняться общему числу испытаний.',
      'The sum must equal the total number of trials.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar yig'indi hisoblab tekshirilgan.",
      'Все три разобраны. Каждый раз сумма проверялась вычислением.',
      'All three are done. Each time the sum was checked by computation.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'1, 1, 3, 2, 2, 1'}</Row>,
        ok: L("Ha. Bir qo'shilgan bir, uch, ikki, ikki, bir, jami o'n.", 'Да. Один плюс один, три, два, два, один, всего десять.', 'Yes. One plus one, three, two, two, one, altogether ten.'),
        question: L("Tanlanma hajmi qancha?", 'Каков объём выборки?', 'What is the sample size?'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '9', hint: L("Bitta chastota tushib qolgan, qaytadan qo'shing.", 'Одна частота потерялась, сложи снова.', 'One frequency was dropped, add again.') },
        ],
        solution: ['1+1+3+2+2+1', '10'],
      },
      {
        expr: <Row size="big" align="center">{'2, 2, 5, 7, 6, 4, 3, 1'}</Row>,
        ok: L("Ha. Sakkiz son qo'shilib, jami o'ttiz chiqadi.", 'Да. Восемь чисел складываются, получается тридцать.', 'Yes. Eight numbers add up, giving thirty.'),
        question: L("Tanlanma hajmi qancha?", 'Каков объём выборки?', 'What is the sample size?'),
        items: [
          { id: 'a', right: true, label: '30' },
          { id: 'b', label: '28', hint: L("Qaytadan qo'shing, bitta son yetishmayapti.", 'Сложи снова, одного числа не хватает.', 'Add again, one number is missing.') },
        ],
        solution: ['2+2+5+7+6+4+3+1', '30'],
      },
      {
        expr: <Row size="big" align="center">{'4, 6, 18, 36, 22, 10, 4'}</Row>,
        ok: L("Ha. Yetti son qo'shilib, jami yuz chiqadi.", 'Да. Семь чисел складываются, получается сто.', 'Yes. Seven numbers add up, giving a hundred.'),
        question: L("Tanlanma hajmi qancha?", 'Каков объём выборки?', 'What is the sample size?'),
        items: [
          { id: 'a', right: true, label: '100' },
          { id: 'b', label: '90', hint: L("Qaytadan qo'shing, yig'indi kamroq chiqdi.", 'Сложи снова, сумма получилась меньше.', 'Add again, the sum came out too small.') },
        ],
        solution: ['4+6+18+36+22+10+4', '100'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): chastotalar yig'indisi
// hajmga teng emas (З70) va chastota-nisbiy chastota chalkashtirilgan (З69).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato jadvalda nima noto'g'ri",
    'Что неверно в двух ошибочных таблицах',
    'What is wrong in two mistaken tables',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham jadval bilan ishlashda xato ketilgan.",
      'Два задания. В обоих допущена ошибка при работе с таблицей.',
      'Two tasks. In both, a mistake was made while working with a table.'),
    A('why',
      "Chastotalar yig'indisi hajmga teng bo'lishi va chastota bilan nisbiy chastota chalkashmasligi kerak.",
      'Сумма частот должна равняться объёму, а частоту с относительной частотой путать нельзя.',
      'The sum of the frequencies must equal the sample size, and the frequency must not be confused with the relative frequency.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham jadval qoidasiga zid edi.",
      'Обе разобраны. Обе ошибки противоречили правилу таблицы.',
      'Both are done. Both mistakes contradicted the rule of the table.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'4, 6, 18, 36, 22, 10  →  100'}</Row>,
        ok: L("Ha. Oltita son qo'shilsa to'qson olti chiqadi, yuz emas. Bitta sinf tushib qolgan.", 'Да. Шесть чисел в сумме дают девяносто шесть, а не сто. Один класс пропущен.', 'Yes. Six numbers add up to ninety-six, not a hundred. One class is missing.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Chastotalar yig'indisi hajmga teng emas", 'Сумма частот не равна объёму', 'The sum of the frequencies does not equal the size') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, to'qson olti yuzga teng emas.", 'Это и есть показанная ошибка, девяносто шесть не равно ста.', 'This is the very mistake shown; ninety-six does not equal a hundred.') },
        ],
        solution: ['4+6+18+36+22+10', '96'],
      },
      {
        expr: <Row size="big" align="center">{'15  →  3'}</Row>,
        ok: L("Ha. Uch bu chastota, butun son. Nisbiy chastota uchun uni o'n tupga bo'lish kerak edi.", 'Да. Три это частота, целое число. Для относительной нужно было разделить на десять кустов.', 'Yes. Three is the frequency, a whole number. For the relative frequency it needed to be divided by ten plants.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Chastota nisbiy chastota bilan chalkashtirilgan", 'Частота спутана с относительной частотой', 'The frequency was confused with the relative frequency') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, nisbiy chastota kasr bo'lishi kerak.", 'Это и есть показанная ошибка, относительная частота должна быть дробью.', 'This is the very mistake shown; the relative frequency must be a fraction.') },
        ],
        solution: ['3/10', '0,3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): poligon nuqtalarini
// qadamlab yozish, DAN 30 avtomobil tezligi.
// ============================================================
const S13 = {
  eyebrow: L('POLIGON NUQTALARINI YOZISH', 'ЗАПИСЬ ТОЧЕК ПОЛИГОНА', 'WRITING THE POLYGON POINTS'),
  title: L(
    "Poligon nuqtalarini qadamlab yozing",
    'Запиши точки полигона по шагам',
    'Write the polygon points step by step',
  ),
  audio: [
    A('mount',
      "Jadval berilgan. Har bir nuqta variant va chastotadan tuziladi.",
      'Дана таблица. Каждая точка составляется из варианта и частоты.',
      'A table is given. Each point is made of the variant and the frequency.'),
    A('why',
      "Birinchi son variant, ikkinchi son chastota.",
      'Первое число, вариант, второе число, частота.',
      'The first number is the variant, the second is the frequency.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar nuqta variant va chastotadan to'g'ri tuzilgan.",
      'Все три заполнены. Каждый раз точка верно составлялась из варианта и частоты.',
      'All three are filled. Each time the point was correctly made of the variant and the frequency.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['65', '5'],
      lines: [
        [{ t: '65, 5   →   (' }, { slot: '65' }, { t: '; ' }, { slot: '5' }, { t: ')' }],
      ],
    },
    tasks: [
      {
        chips: ['60', '2'],
        lines: [
          [{ t: '60, 2   →   (' }, { slot: '60' }, { t: '; ' }, { slot: '2' }, { t: ')' }],
        ],
      },
      {
        chips: ['66', '7'],
        lines: [
          [{ t: '66, 7   →   (' }, { slot: '66' }, { t: '; ' }, { slot: '7' }, { t: ')' }],
        ],
      },
      {
        chips: ['75', '1'],
        lines: [
          [{ t: '75, 1   →   (' }, { slot: '75' }, { t: '; ' }, { slot: '1' }, { t: ')' }],
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
    "Ma'lumotlar tahlili bo'yicha to'rt savol",
    'Четыре вопроса об анализе данных',
    'Four questions about data analysis',
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
        id: 'q1', tag: 'З69',
        ask: L('Variant 18ning chastotasi bir. Uning nisbiy chastotasi qancha, jami o\'n tup bo\'lsa?', 'Частота варианта 18 равна одному. Чему равна его относительная частота, если всего десять кустов?', 'The frequency of variant 18 is one. What is its relative frequency, out of ten plants total?'),
        options: [
          { id: 'ok', right: true, label: '1/10' },
          { id: 'one', label: '1' },
          { id: 'ten', label: '10' },
        ],
        hint: L("Bir bu chastotaning o'zi, uni o'n tupga bo'lish kerak.", 'Один это сама частота, её нужно разделить на десять кустов.', 'One is the frequency itself; it must be divided by ten plants.'),
        ok: L("To'g'ri, nisbiy chastota o'ndan bir ulush.", 'Верно, относительная частота одна десятая доля.', 'Correct, the relative frequency is one tenth of a share.'),
      },
      {
        id: 'q2', tag: 'З70',
        ask: L('Chastotalar 5, 7, 6, 4 deb berilgan, tanlanma hajmi 30 deyilgan. Bu to\'g\'rimi?', 'Даны частоты 5, 7, 6, 4, а объём выборки назван равным 30. Верно ли это?', 'Frequencies 5, 7, 6, 4 are given, and the sample size is called 30. Is this correct?'),
        options: [
          { id: 'ok', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'no', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Besh qo'shilgan yetti, olti, to'rt yigirma ikki chiqadi, o'ttiz emas.", 'Пять плюс семь, шесть, четыре, получается двадцать два, а не тридцать.', 'Five plus seven, six, four gives twenty-two, not thirty.'),
        ok: L("To'g'ri, yig'indi yigirma ikki, tanlanma hajmi bilan mos emas.", 'Верно, сумма двадцать два, не совпадает с объёмом выборки.', 'Correct, the sum is twenty-two, not matching the stated sample size.'),
      },
      {
        id: 'q3', tag: 'З69',
        ask: L('Nisbiy chastota necha bilan bir orasida bo\'lishi kerak?', 'Между какими числами должна находиться относительная частота?', 'Between which numbers must the relative frequency lie?'),
        options: [
          { id: 'ok', right: true, label: L('Nol bilan bir orasida', 'Между нулём и единицей', 'Between zero and one') },
          { id: 'no', label: L('Bir bilan tanlanma hajmi orasida', 'Между единицей и объёмом выборки', 'Between one and the sample size') },
        ],
        hint: L("Nisbiy chastota ulush, u doim nol bilan bir orasida qoladi.", 'Относительная частота это доля, она всегда остаётся между нулём и единицей.', 'The relative frequency is a share, it always stays between zero and one.'),
        ok: L("To'g'ri, ulush hech qachon birdan katta bo'lmaydi.", 'Верно, доля никогда не бывает больше единицы.', 'Correct, a share is never greater than one.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('Chastotalar 1, 1, 3, 2, 2, 1 jami o\'nga tengmi?', 'Верно ли, что сумма частот 1, 1, 3, 2, 2, 1 равна десяти?', 'Is it true that the sum of frequencies 1, 1, 3, 2, 2, 1 equals ten?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Barchasini qo'shib ko'ring, natija o'n chiqadi.", 'Сложи всё, получится десять.', 'Add them all, the result is ten.'),
        ok: L("To'g'ri, yig'indi hisoblash mos keladi.", 'Верно, вычисление суммы совпадает.', 'Correct, the sum computation matches.'),
      },
      {
        id: 'q5', tag: 'З70',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Variant 17ning chastotasi va nisbiy chastotasini yig'ing.",
            'Собери частоту и относительную частоту варианта 17.',
            'Assemble the frequency and relative frequency of variant 17.',
          ),
          lines: [
            [{ t: '17   →   ' }, { slot: '2' }, { t: ',  ' }, { slot: '1/5' }],
          ],
          tiles: [
            { id: 't1', v: '2', x: 12, y: 12 },
            { id: 't2', v: '1/5', x: 70, y: 14 },
            { id: 't3', v: '17', x: 40, y: 50 },
            { id: 't4', v: '2/17', x: 78, y: 48 },
          ],
          hint: L(
            "O'n yettining chastotasi ikki, nisbiy chastota ikki bo'lingan o'n, qisqartirilgach besh dan bir.",
            'Частота семнадцати два, относительная частота два делённых на десять, после сокращения одна пятая.',
            'The frequency of seventeen is two, the relative frequency is two divided by ten, reduced to one fifth.',
          ),
          doneNote: L(
            "Yig'ildi. Chastota butun son, nisbiy chastota ulush.",
            'Собрано. Частота, целое число, относительная частота, доля.',
            'Assembled. The frequency is a whole number, the relative frequency is a share.',
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
    "Chastota necha marta, nisbiy chastota qanday ulush",
    'Частота, сколько раз, относительная частота, какая доля',
    'The frequency is how many times, the relative frequency is what share',
  ),
  audio: [
    A('s0',
      "Darsdan bitta rasm qoladi. Nuqtalar tutashtirilsa, chastotalar poligoni chiqadi.",
      'С урока остаётся одна картинка. Если соединить точки, выходит полигон частот.',
      'One picture stays with you. Connect the points and the frequency polygon appears.'),
    A('s1',
      "Bugun uch narsa qilindi. Xom sonlarni ustunlarga terdingiz, chastota va nisbiy chastota farqini ko'rdingiz va chastotalar yig'indisi hajmga tengligini tekshirdingiz.",
      'Сегодня сделано три вещи. Ты разложил сырые числа по столбцам, увидел разницу частоты и относительной частоты, и проверил, что сумма частот равна объёму.',
      'Three things are done today. You sorted raw numbers into columns, saw the difference between frequency and relative frequency, and checked that the sum of frequencies equals the sample size.'),
    A('s2',
      "Keyingi darsda o'rtacha qiymat, moda va mediana. Bir xil ma'lumotni boshqa uch son bilan tasvirlaysiz.",
      'В следующем уроке среднее значение, мода и медиана. Те же данные опишешь тремя другими числами.',
      'The next lesson covers the mean, mode, and median. You will describe the same data with three other numbers.',
    ),
  ],
  props: {
    mark: '(60;2) (62;2) (65;5) (66;7) (68;6) (71;4) (73;3) (75;1)',
    markNote: L(
      "chastotalar poligoni",
      'полигон частот',
      'the frequency polygon',
    ),
    lines: [
      L(
        "Tanlanma natijalari o'sish tartibida yozilsa, variatsion qator hosil bo'ladi",
        'Если результаты выборки записать по возрастанию, получится вариационный ряд',
        'If the sample results are written in increasing order, a variation series results',
      ),
      L(
        "Chastota necha marta takrorlanganini, nisbiy chastota qaysi ulushni ko'rsatadi",
        'Частота показывает, сколько раз повторилось, относительная частота, какую долю',
        'The frequency shows how many times it repeated, the relative frequency shows what share',
      ),
      L(
        "Chastotalar yig'indisi doim tanlanma hajmiga teng",
        'Сумма частот всегда равна объёму выборки',
        'The sum of the frequencies always equals the sample size',
      ),
    ],
    bridge: L(
      "Keyingi dars: o'rtacha qiymat, moda va mediana",
      'Следующий урок: среднее значение, мода и медиана',
      'Next lesson: the mean, mode, and median',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya, 1-darsning asboblari,
// bitta pozitsiya (5-ekran), XOM MA'LUMOT TERILADI (`freqtable`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З69', 'З69', 'З70',
    'З70', 'З69', 'З69', 'З70', 'З69',
    'З16', 'З70', 'З69', null, null,
  ],
  mechanic: { at: 5, tool: 'freqtable' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
