// ============================================================================
// 8-sinf, Dars 35. O'RTACHA QIYMAT. MODA. MEDIANA.
//
// Bu fayl, FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `datadrag.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya, 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `datadrag` (`DataDrag`): o'rtacha qiymat
// har safar o'zgaradi, mediana esa son o'rtadagi ikkiligi bilan mos kelib
// turmaguncha qimirlamaydi.
//
// MANBA: 8-sinf algebra darsligi, IV bob, 29-§ (195-198-bet). Barcha sonlar
// darslikdan olingan:
//   - g'o'za hosili, vaznli o'rta qiymat (195-bet, 1-masala): 100 ga dan 33
//     sr, 50 ga dan 30 sr, o'rtacha 32 sr;
//   - sportchi sakrashi (195-bet, 2-masala): 2,1; 1,97; 1,85; 1,97; 1,96;
//     2,06; 2,44 — o'rtacha 2,05 metr, 1,97 ikki marta takrorlangan;
//   - o'quvchilar bo'yi, moda (195-196-bet, 3-masala): 166,168,170,165,164,
//     168,169,163,168,162 — moda 168, o'rtacha 166,4, ular teng emas;
//   - Alina bahosi, moda = o'rtacha (196-bet, 4-masala): 3,3,4,4,4,5,5 —
//     ikkalasi ham to'rt;
//   - qovun massasi, moda yo'q (196-bet): 3,8; 4; 4,5; 5,2; 4,9;
//   - toq qator mediana (196-bet): 20,23,24,27,29,31,34 — mediana 27;
//   - juft qator mediana (197-bet): 12,14,17,21,23,29,32,37 — mediana 22.
//
// ADASHISHLAR, yangi ikkitasi:
//   З71, moda o'rta qiymat bilan chalkashtirilgan, doim teng deb hisoblangan;
//   З72, juft qatorda mediana bitta o'rtadagi son deb olingan, ikkisining
//   o'rtachasi emas;
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
  id: 'alg-8-35',
  n: 35,
  row: 39,
  block: 'Б5',
  topic: L(
    "O'rtacha qiymat, moda, mediana",
    'Среднее значение, мода, медиана',
    'The mean, mode, and median',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Tanlanma sonlarining yig'indisi ularning soniga bo'linsa, o'rtacha qiymat topiladi",
    'Если сумму чисел выборки разделить на их количество, получится среднее значение',
    'If the sum of the sample numbers is divided by their count, the mean is found',
  ),
  L(
    "Tanlanmada eng ko'p uchraydigan qiymat moda deyiladi, moda va o'rtacha qiymat teng bo'lmasligi mumkin",
    'Значение, встречающееся в выборке чаще всего, называется модой, мода и среднее могут не совпадать',
    'The value that occurs most often in the sample is called the mode; the mode and the mean may not be equal',
  ),
  L(
    "Variantalar soni toq bo'lsa mediana qatorning o'rtasidagi son, juft bo'lsa o'rtadagi ikki sonning o'rtachasi",
    'Если количество вариантов нечётное, медиана, средний элемент ряда, если чётное, среднее двух средних элементов',
    'If the number of variants is odd the median is the middle term, if even it is the mean of the two middle terms',
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
  'З71': {
    what: L(
      "moda o'rta qiymat bilan chalkashtirilgan, ikkisi doim teng deb hisoblangan",
      'мода спутана со средним значением, они посчитаны всегда равными',
      'the mode was confused with the mean, the two were assumed always equal',
    ),
    wrong: '166,4',
    at: 10,
  },
  'З72': {
    what: L(
      "juft qatorda mediana bitta o'rtadagi son deb olingan, ikkisining o'rtachasi emas",
      'в чётном ряду медиана взята как один средний элемент, а не как среднее двух средних',
      'in an even series the median was taken as one middle term, not the mean of the two middle terms',
    ),
    wrong: '23',
    at: 12,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: sportchi sakrashi, o'rtacha necha metr. Yakun: uch
// son, bitta qatorning uch qiyofasi.
// ============================================================
const SC_ASK = L('O\'RTACHA NECHA METR', 'В СРЕДНЕМ СКОЛЬКО МЕТРОВ', 'HOW MANY METRES ON AVERAGE')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="50" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fill={T.ink}>{'2,1   1,97   2,44   1,85   1,97   1,96   2,06'}</text>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="200" cy="92" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="99" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Bitta qatorning uch qiyofasi, o'rtacha, moda, mediana",
      'Три образа одного ряда, среднее, мода, медиана',
      'Three faces of one series, the mean, the mode, and the median',
    )}>
      <text x="200" y="45" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fill={T.ink}>{'162 163 164 165 166 168 168 168 169 170'}</text>
      <g className="g8-seat" style={{ '--d': '1300ms' }}>
        <text x="200" y="80" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
          fontWeight="700" fill={T.ok}>{'x̄ = 166,4      M₀ = 168'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1900ms' }}>
        <text x="200" y="105" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fill={T.ink3}>{"ular har doim teng emas"}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('SPORTCHI SAKRASHI', 'ПРЫЖКИ СПОРТСМЕНА', 'THE ATHLETE\'S JUMPS'),
  title: L(
    "Sportchi baland sakrashda yetti marta sakradi. O'rtacha necha metr sakragan",
    'Спортсмен в прыжках в высоту прыгнул семь раз. Сколько метров в среднем',
    'The high jumper jumped seven times. How many metres on average',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Yetti natija turibdi. Ular biroz farq qiladi.",
      'Есть семь результатов. Они немного различаются.',
      'Seven results are there. They differ a little.'),
    A('why',
      "Taxmin qiling, o'rtacha natija qanday son bo'ladi.",
      'Предположи, каким будет среднее значение.',
      'Predict what the average result will be.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, o'rtacha natija qanday son bo'ladi?",
      'Как думаешь, каким будет среднее значение?',
      'What do you think the average value will be?',
    ),
    items: [
      { id: 'a', show: '1,85' },
      { id: 'b', show: '2,05' },
      { id: 'c', show: '2,44' },
      { id: 'd', show: '2,1' },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Yig'indini sonlar soniga bo'lish, o'rtacha qiymatning
// eng oddiy holi (5-6-sinfdan).
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Yig'indini sonlar soniga bo'lishni eslash",
    'Вспоминаем деление суммы на количество чисел',
    'Recalling dividing the sum by the number of terms',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida o'rtacha qiymat to'g'ri topilgan.",
      'Четыре записи. Только в одной верно найдено среднее значение.',
      'Four records. Only in one is the mean correctly found.'),
    A('why',
      "Avval barcha sonlar qo'shiladi, keyin sonlar soniga bo'linadi.",
      'Сначала все числа складываются, затем делятся на их количество.',
      'First all the numbers are added, then divided by their count.'),
  ],
  props: {
    ask: L(
      "3, 5, 7 sonlarining o'rtacha qiymati qaysi yozuvda to'g'ri topilgan?",
      'В какой записи верно найдено среднее значение чисел 3, 5, 7?',
      'In which record is the mean of the numbers 3, 5, 7 correctly found?',
    ),
    items: [
      { id: 'right', show: '(3+5+7) : 3 = 5', right: true, name: L("yig'indi sonlar soniga bo'lingan", 'сумма разделена на количество чисел', 'the sum divided by the count of numbers') },
      {
        id: 'two', show: '(3+5+7) : 2 = 7,5',
        hint: L("Sonlar soni uch, ikkiga emas, uchga bo'linadi.", 'Чисел три, делить нужно на три, а не на два.', 'There are three numbers, divide by three, not two.'),
      },
      {
        id: 'max', show: '7',
        hint: L("Bu eng katta son, o'rtacha emas.", 'Это наибольшее число, а не среднее.', 'That is the greatest number, not the mean.'),
      },
      {
        id: 'sum', show: '15',
        hint: L("Bu faqat yig'indi, sonlar soniga bo'linmagan.", 'Это только сумма, не разделённая на количество.', 'That is only the sum, not divided by the count.'),
      },
    ],
    after: L(
      "To'g'ri. Yig'indi o'n besh, sonlar soni uch, o'rtacha besh.",
      'Верно. Сумма пятнадцать, чисел три, среднее пять.',
      'Correct. The sum is fifteen, three numbers, the mean is five.',
    ),
  },
}

// ============================================================
// EKRAN 3. VAZNLI O'RTACHANI BURANG (1-darsning `steppers`). G'o'za hosili,
// ikki yer maydoni (195-bet, 1-masala).
// ============================================================
const S3 = {
  eyebrow: L('VAZNLI O\'RTACHANI BURANG', 'КРУТИ СРЕДНЕВЗВЕШЕННОЕ', 'TURN THE WEIGHTED MEAN'),
  title: L(
    "Ikki yer maydonidan olingan hosilning vaznli o'rtachasi",
    'Средневзвешенное урожая с двух участков земли',
    'The weighted mean of the harvest from two plots of land',
  ),
  audio: [
    A('mount',
      "Birinchi maydondan gektariga o'ttiz uch, ikkinchisidan o'ttiz sentner hosil olingan.",
      'С первого участка по тридцать три, со второго по тридцать центнеров с гектара.',
      'From the first plot thirty-three, from the second thirty centners per hectare.'),
    A('why',
      "Ikki maydonning maydonini burang, o'rtacha hosil o'zgarishini ko'ring.",
      'Крути площадь двух участков, наблюдай, как меняется средний урожай.',
      'Turn the area of the two plots, watch how the average yield changes.'),
    A('why',
      "Oxirida ikkalasini ham nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти обе площади до нуля и посмотри, что будет.',
      'At the end bring both areas down to zero and see what happens.'),
  ],
  props: {
    cols: [
      { id: 'n1', label: L('1-maydon (ga)', '1-й участок (га)', 'plot 1 (ha)'), start: 50, min: 0, max: 100, step: 50 },
      { id: 'n2', label: L('2-maydon (ga)', '2-й участок (га)', 'plot 2 (ha)'), start: 50, min: 0, max: 100, step: 50, risky: true },
    ],
    calc: (v) => {
      const denom = v[0] + v[1]
      return denom === 0 ? null : Math.round(((33 * v[0] + 30 * v[1]) / denom) * 100) / 100
    },
    resultLabel: L("vaznli o'rtacha", 'средневзвешенное', 'weighted mean'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "ikki maydon ham hali nolga tushmasin, avval maqsadni oling.",
      'Обе площади пока не опускай до нуля, сначала возьми цель.',
      'Do not bring both areas down to zero yet, take the target first.',
    ),
    goals: [
      {
        value: 33,
        ask: L("Natija o'ttiz uchga tenglashsin", 'Пусть результат станет равным тридцати трём', 'Make the result equal thirty-three'),
        after: L(
          "O'ttiz uch. Ikkinchi maydon nolga tushdi, faqat birinchisi qoldi.",
          'Тридцать три. Второй участок опустился до нуля, остался только первый.',
          'Thirty-three. The second plot dropped to zero, only the first remains.',
        ),
      },
    ],
    ask: L("Natija o'ttiz uchga tenglashsin", 'Пусть результат станет равным тридцати трём', 'Make the result equal thirty-three'),
    ask2: L("Endi birinchi maydonni ham nolga tushiring", 'Теперь опусти до нуля и первый участок', 'Now bring the first plot down to zero too'),
    broke: L(
      "Ikki maydon ham nolga teng bo'lsa, hech qanday hosil yo'q, vaznli o'rtachani topib bo'lmaydi.",
      'Если обе площади равны нулю, урожая вообще нет, средневзвешенное найти невозможно.',
      'If both plots are zero, there is no harvest at all, the weighted mean cannot be found.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI SON MODA (1-darsning `pick`). Ловушка, moda o'rtacha
// bilan chalkashtirilgan (З71).
// ============================================================
const S4 = {
  eyebrow: L('QAYSI SON MODA', 'КАКОЕ ЧИСЛО МОДА', 'WHICH NUMBER IS THE MODE'),
  title: L(
    "O'quvchilar bo'yi qatorida qaysi son moda",
    'Какое число в ряду роста учеников является модой',
    'Which number is the mode in the row of pupils\' heights',
  ),
  audio: [
    A('mount',
      "O'n o'quvchining bo'yi o'lchangan. Bir son uch marta takrorlangan.",
      'Измерен рост десяти учеников. Одно число повторилось три раза.',
      'The height of ten pupils was measured. One number repeated three times.'),
    A('why',
      "Moda eng ko'p takrorlangan son, o'rtacha qiymat esa boshqacha hisoblanadi.",
      'Мода это число, повторившееся чаще всего, а среднее считается иначе.',
      'The mode is the number that repeated most often; the mean is computed differently.'),
  ],
  props: {
    ask: L(
      "162, 163, 164, 165, 166, 168, 168, 168, 169, 170 qatorida moda qaysi?",
      'В ряду 162, 163, 164, 165, 166, 168, 168, 168, 169, 170 какое число мода?',
      'In the row 162, 163, 164, 165, 166, 168, 168, 168, 169, 170 which number is the mode?',
    ),
    items: [
      { id: 'right', show: '168', right: true, name: L('uch marta takrorlangan, eng ko\'p', 'повторилось три раза, чаще всего', 'repeated three times, the most') },
      {
        id: 'mean', show: '166,4',
        hint: L("Bu o'rtacha qiymat, moda emas. Moda takrorlanishga qaraladi.", 'Это среднее значение, а не мода. Мода смотрит на повторение.', 'That is the mean, not the mode. The mode looks at repetition.'),
      },
      {
        id: 'low', show: '162',
        hint: L("Bu eng kichik son, bir marta uchraydi.", 'Это наименьшее число, встречается один раз.', 'That is the smallest number, occurring once.'),
      },
      {
        id: 'high', show: '170',
        hint: L("Bu eng katta son, bir marta uchraydi.", 'Это наибольшее число, встречается один раз.', 'That is the largest number, occurring once.'),
      },
    ],
    after: L(
      "To'g'ri. 168 uch marta takrorlangan, boshqalaridan ko'proq.",
      '168 повторилось три раза, больше остальных.',
      '168 repeated three times, more than the others.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI, O'RTACHA KETADI (`datadrag`). Juft qator
// (197-bet), o'rtacha o'zgaradi, mediana ma'lum oraliqda turadi.
// ============================================================
const S5 = {
  eyebrow: L('SONNI SURING', 'СДВИНЬ ЧИСЛО', 'SHIFT THE NUMBER'),
  title: L(
    "O'rtacha qiymat har safar o'zgaradi, mediana esa turib qoladi",
    'Среднее значение меняется каждый раз, а медиана остаётся на месте',
    'The mean changes every time, while the median stays in place',
  ),
  audio: [
    A('mount',
      "Yetti son turibdi, sakkizinchisi suriladi. O'rtacha va mediana pastda hisoblanadi.",
      'Стоят семь чисел, восьмое сдвигается. Среднее и медиана считаются внизу.',
      'Seven numbers stand there, the eighth one is shifted. The mean and the median are computed below.'),
    A('why',
      "Sonni oshirib, o'rtachani o'ttiz uchga yetkazing.",
      'Увеличивай число, доведи среднее до тридцати трёх.',
      'Increase the number, bring the mean up to thirty-three.'),
    W('shift',
      "Mediana nihoyat o'zgardi. Suriladigan son endi o'rtadagi ikkilikning ichiga tushdi.",
      'Медиана наконец изменилась. Сдвигаемое число теперь попало внутрь средней пары.',
      'The median finally changed. The shifted number now landed inside the middle pair.'),
  ],
  props: {
    fixed: [12, 14, 17, 21, 23, 29, 32],
    start: 37,
    min: 7,
    max: 97,
    step: 5,
    goals: [
      {
        mean: 25,
        ask: L("O'rtacha qiymatni yigirma beshga yetkazing", 'Доведи среднее значение до двадцати пяти', 'Bring the mean up to twenty-five'),
        after: L(
          "O'rtacha yigirma beshga chiqdi, lekin mediana hali yigirma ikki, o'zgarmadi.",
          'Среднее выросло до двадцати пяти, а медиана всё ещё двадцать два, не изменилась.',
          'The mean rose to twenty-five, but the median is still twenty-two, unchanged.',
        ),
      },
    ],
    ask: L("O'rtacha qiymatni yigirma beshga yetkazing", 'Доведи среднее значение до двадцати пяти', 'Bring the mean up to twenty-five'),
    ask2: L("Endi sonni pasaytirib, mediananing o'zgarishini ko'ring", 'Теперь опускай число и смотри, как изменится медиана', 'Now lower the number and watch the median change'),
    moveNote: L(
      "Son o'rtadagi ikkilik ichiga tushgach, mediana ham o'zgardi.",
      'Когда число попало внутрь средней пары, медиана тоже изменилась.',
      'Once the number landed inside the middle pair, the median changed too.',
    ),
    fields: [
      {
        ask: L("Hozir mediana nechchiga teng?", 'Чему сейчас равна медиана?', 'What does the median equal now?'),
        kind: 'number',
        answer: '20.5',
        accepts: ['20.5'],
        hints: {
          '22': L("Bu eski qiymat. Son endi o'rtadagi ikkilikni almashtirdi, qaytadan hisoblang.", 'Это старое значение. Число теперь заменило среднюю пару, посчитай снова.', 'That is the old value. The number has now replaced the middle pair, count again.'),
        },
      },
    ],
    note: L(
      "Yigirma va yigirma birning o'rtachasi, yigirma nuqta besh.",
      'Среднее двадцати и двадцати одного, двадцать целых пять десятых.',
      'The mean of twenty and twenty-one, twenty point five.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): medianani topishning ikki
// yo'li, toq qator (196-bet).
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Toq qatorda medianani topishning ikki yo'li",
    'Два способа найти медиану в нечётном ряду',
    'Two ways to find the median in an odd series',
  ),
  audio: [
    A('mount',
      "Bitta natija va ikki yo'l. Ikkalasi ham bir xil medianani beradi.",
      'Один результат и два пути. Оба дают одну и ту же медиану.',
      'One result and two ways. Both give the same median.'),
    W('w2',
      "Birinchi yo'lda ikki chetdan bir xilda sanaladi, o'rtada uchrashiladi.",
      'В первом пути считают с обоих концов одинаково, встречаются в середине.',
      'In the first way, counting proceeds equally from both ends, meeting in the middle.'),
    W('w4',
      "Ikkinchi yo'lda o'rindagi raqam sonlar soniga qo'shib bir qo'shilib, ikkiga bo'linadi.",
      'Во втором пути номер места находят, сложив количество чисел с единицей и разделив на два.',
      'In the second way, the position number is found by adding one to the count and dividing by two.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL, IKKI CHETDAN SANASH', 'СПОСОБ 1, СЧЁТ С ДВУХ КОНЦОВ', 'METHOD 1, COUNTING FROM BOTH ENDS'),
        lead: L(
          "20, 23, 24, 27, 29, 31, 34 qatorida ikki chetdan sanaymiz",
          'В ряду 20, 23, 24, 27, 29, 31, 34 считаем с обоих концов',
          'In the row 20, 23, 24, 27, 29, 31, 34 we count from both ends',
        ),
        rows: [
          { text: '20|34, 23|31, 24|29' },
          { text: L("uchtadan qoldi, o'rtada 27", 'осталось по три, в середине 27', 'three remain on each side, in the middle 27'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL, O\'RIN NOMERI', 'СПОСОБ 2, НОМЕР МЕСТА', 'METHOD 2, THE POSITION NUMBER'),
        lead: L(
          "Yetti son bor, o'rin nomerini hisoblaymiz",
          'Есть семь чисел, вычисляем номер места',
          'There are seven numbers, we compute the position number',
        ),
        rows: [
          { text: '(7+1) : 2 = 4' },
          { text: L("to'rtinchi o'rindagi son 27", 'число на четвёртом месте 27', 'the number in the fourth place is 27'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL MEDIANA BERDI', 'ОБА ДАЛИ ОДНУ МЕДИАНУ', 'BOTH GAVE THE SAME MEDIAN'),
        lead: L(
          "Sanash ko'rgazmali, o'rin nomeri esa tezroq",
          'Счёт нагляден, а номер места быстрее',
          'Counting is visual, the position number is faster',
        ),
        rows: [{ text: '27', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): bitta qatorning uch qiyofasi,
// o'rtacha, moda, mediana.
// ============================================================
const S7 = {
  eyebrow: L('BITTA QATOR, UCH QIYOFA', 'ОДИН РЯД, ТРИ ОБРАЗА', 'ONE SERIES, THREE FACES'),
  title: L(
    "Bitta qatorning uch qiyofasi",
    'Три образа одного ряда',
    'Three faces of one series',
  ),
  audio: [
    A('mount',
      "Bitta qator, uch xil son. Har biri o'zicha ma'lumotni tasvirlaydi.",
      'Один ряд, три разных числа. Каждое по-своему описывает данные.',
      'One series, three different numbers. Each describes the data in its own way.'),
    W('p2',
      "O'rtacha qiymat barcha sonlarni hisobga oladi, hammasi yig'iladi.",
      'Среднее значение учитывает все числа, всё складывается.',
      'The mean accounts for all the numbers, everything is added.'),
    W('p4',
      "Moda esa faqat eng ko'p takrorlangan sonni ko'rsatadi, boshqalarga qaramaydi.",
      'А мода показывает только число, повторившееся чаще всего, на остальные не смотрит.',
      'The mode only shows the number that repeated most, ignoring the rest.',
    ),
  ],
  props: {
    tokens: [
      { t: 'x̄', id: 'a' },
      { t: '  ,  M₀  ,  ', id: 'mid' },
      { t: 'Me', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi son, o'rtacha qiymat. Barcha sonlarning yig'indisi ularning soniga bo'linadi.",
          'Первое число, среднее значение. Сумма всех чисел делится на их количество.',
          'The first number, the mean. The sum of all the numbers divided by their count.',
        ),
      },
      {
        focus: 'mid',
        text: L(
          "Ikkinchi son, moda. Faqat eng ko'p takrorlangan qiymat, boshqalar hisobga olinmaydi.",
          'Второе число, мода. Только самое частое значение, остальные не считаются.',
          'The second number, the mode. Only the most repeated value, the rest are not counted.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi son, mediana. Qatorning o'rtasidagi son, uzoq chetdagi sonlarga bog'liq emas.",
          'Третье число, медиана. Число в середине ряда, не зависит от далёких крайних чисел.',
          'The third number, the median. The middle of the series, not affected by far outlying numbers.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Alinaning „Algebra“ jurnalidagi baholari 3, 3, 4, 4, 4, 5, 5 edi, va bu qatorda moda ham, o'rtacha qiymat ham to'rtga teng chiqdi.",
        'Оценки Алины в журнале по алгебре были 3, 3, 4, 4, 4, 5, 5, и в этом ряду мода и среднее значение совпали, оба вышли равными четырём.',
        'Alina\'s algebra journal grades were 3, 3, 4, 4, 4, 5, 5, and in this series the mode and the mean coincided, both came out equal to four.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Darslik 29-§ ta'riflari.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "O'rtacha qiymat, moda, mediana",
    'Среднее значение, мода, медиана',
    'The mean, the mode, and the median',
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
      { id: 'f1', label: L("sonlar yig'indisi ularning soniga bo'linsa, o'rtacha qiymat topiladi", 'если сумму чисел разделить на их количество, найдётся среднее значение', 'if the sum of the numbers is divided by their count, the mean is found') },
      { id: 'f2', label: L("eng ko'p uchraydigan qiymat moda deyiladi", 'значение, встречающееся чаще всего, называется модой', 'the value occurring most often is called the mode') },
      { id: 'f3', label: L("toq qatorda mediana o'rtadagi son, juft qatorda o'rtadagi ikki sonning o'rtachasi", 'в нечётном ряду медиана средний элемент, в чётном, среднее двух средних', 'in an odd series the median is the middle term, in an even series the mean of the two middle terms') },
      { id: 'w1', label: L("moda va o'rtacha qiymat doim teng bo'ladi", 'мода и среднее значение всегда равны', 'the mode and the mean are always equal') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Moda va o'rtacha qiymat DOIM teng emas, Alinaning bahosidagidek ba'zan mos kelib qoladi, xolos.",
      'Так не складывается. Мода и среднее значение НЕ ВСЕГДА равны, как в оценках Алины, они лишь иногда совпадают.',
      'That does not fit. The mode and the mean are NOT always equal; as with Alina\'s grades, they merely sometimes coincide.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik 29-paragrafi asosida (195-197-bet)",
        'Правило на основе параграфа 29 учебника (стр. 195-197)',
        'The rule is based on section 29 of the textbook (pages 195-197)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Sportchining o'rtacha natijasini qanday topishni hali bilmaymiz",
        'Мы пока не знаем, как найти среднее значение результата спортсмена',
        'We still do not know how to find the athlete\'s average result',
      ),
      right: L(
        "endi o'rtacha qiymat, moda va medianani bir-biridan ajratib bilamiz",
        'теперь умеем отличать друг от друга среднее значение, моду и медиану',
        'now we know how to tell apart the mean, the mode, and the median',
      ),
      winner: 'right',
      note: L(
        "O'rtacha hisoblanadi, moda takrorlanishdan, mediana o'rindan topiladi",
        'Среднее считается, мода находится по повторению, медиана по месту',
        'The mean is computed, the mode is found by repetition, the median by position',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): o'rtacha qiymatni hisoblash.
// ============================================================
const ASK_MEAN = L("O'rtacha qiymat qancha?", 'Чему равно среднее значение?', 'What is the mean?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "O'rtacha qiymatni hisoblang",
    'Вычисли среднее значение',
    'Compute the mean',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida sonlarni qo'shib, soniga bo'lish kerak.",
      'Пять заданий. В каждом нужно сложить числа и разделить на их количество.',
      'Five tasks. In each, add the numbers and divide by their count.'),
    A('why',
      "Takrorlangan son ham alohida qo'shiladi, bir marta emas.",
      'Повторившееся число тоже складывается отдельно, а не один раз.',
      'A repeated number is added separately too, not just once.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar yig'indi to'g'ri sonlar soniga bo'lingan.",
      'Все пять разобраны. Каждый раз сумма верно делилась на количество чисел.',
      'All five are done. Each time the sum was correctly divided by the count of numbers.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'4, 6, 8'}</Row>,
        ok: L("Ha. Yig'indi o'n sakkiz, sonlar soni uch, o'rtacha olti.", 'Да. Сумма восемнадцать, чисел три, среднее шесть.', 'Yes. The sum is eighteen, three numbers, the mean is six.'),
        question: ASK_MEAN,
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '18', hint: L("Bu yig'indi, sonlar soniga bo'linmagan.", 'Это сумма, не делённая на количество.', 'That is the sum, not divided by the count.') },
        ],
        solution: ['4+6+8', '18 : 3', '6'],
      },
      {
        expr: <Row size="big" align="center">{'2,1;  1,97;  1,97;  1,85'}</Row>,
        ok: L("Ha. Yig'indi yetti nuqta to'qson to'rt, sonlar soni to'rt, o'rtacha bir nuqta to'qson beshdan bir.", 'Да. Сумма семь целых девяносто четыре, чисел четыре, среднее одна девяносто пятая.', 'Yes. The sum is seven point ninety-four, four numbers, the mean is one point ninety-five.'),
        question: ASK_MEAN,
        items: [
          { id: 'a', right: true, label: '1,985' },
          { id: 'b', label: '1,97', hint: L("1,97 ikki marta uchraydi, lekin bu moda, o'rtacha emas.", '1,97 встречается два раза, но это мода, а не среднее.', '1.97 occurs twice, but that is the mode, not the mean.') },
        ],
        solution: ['2,1+1,97+1,97+1,85', '7,94 : 4', '1,985'],
      },
      {
        expr: <Row size="big" align="center">{'100 · 33,  50 · 30'}</Row>,
        ok: L("Ha. To'qqiz yuz besh yuz bo'lingan yuz ellik, o'ttiz ikki.", 'Да. Девять сот с пятью сотнями, делённое на сто пятьдесят, тридцать два.', 'Yes. Four thousand eight hundred divided by a hundred fifty, thirty-two.'),
        question: L("Vaznli o'rtacha qancha?", 'Чему равно средневзвешенное?', 'What is the weighted mean?'),
        items: [
          { id: 'a', right: true, label: '32' },
          { id: 'b', label: '31,5', hint: L("Bu maydonlar teng bo'lganda chiqadigan qiymat, bu yerda ular teng emas.", 'Это значение при равных площадях, а тут площади не равны.', 'That is the value when the areas are equal; here they are not equal.') },
        ],
        solution: ['(100·33+50·30) : (100+50)', '4800 : 150', '32'],
      },
      {
        expr: <Row size="big" align="center">{'3, 3, 4, 4, 4, 5, 5'}</Row>,
        ok: L("Ha. Yig'indi yigirma sakkiz, sonlar soni yetti, o'rtacha to'rt.", 'Да. Сумма двадцать восемь, чисел семь, среднее четыре.', 'Yes. The sum is twenty-eight, seven numbers, the mean is four.'),
        question: ASK_MEAN,
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '5', hint: L("Bu eng katta baho, o'rtacha emas.", 'Это наибольшая оценка, а не среднее.', 'That is the highest grade, not the mean.') },
        ],
        solution: ['3+3+4+4+4+5+5', '28 : 7', '4'],
      },
      {
        expr: <Row size="big" align="center">{'3,8;  4;  4,5;  5,2;  4,9'}</Row>,
        ok: L("Ha. Yig'indi yigirma ikki nuqta to'rt, sonlar soni besh, o'rtacha to'rt nuqta qirq sakkiz.", 'Да. Сумма двадцать два целых четыре, чисел пять, среднее четыре целых сорок восемь.', 'Yes. The sum is twenty-two point four, five numbers, the mean is four point forty-eight.'),
        question: ASK_MEAN,
        items: [
          { id: 'a', right: true, label: '4,48' },
          { id: 'b', label: L("Moda yo'q bo'lgani uchun topib bo'lmaydi", 'Нельзя найти, так как моды нет', 'It cannot be found, since there is no mode'), hint: L("O'rtacha qiymat modaga bog'liq emas, u har doim topiladi.", 'Среднее значение не зависит от моды, оно всегда находится.', 'The mean does not depend on the mode, it can always be found.') },
        ],
        solution: ['3,8+4+4,5+5,2+4,9', '22,4 : 5', '4,48'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): modani topish, moda yo'q holi
// bilan.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Modani toping",
    'Найди моду',
    'Find the mode',
  ),
  audio: [
    A('mount',
      "Uch qator. Har birida eng ko'p takrorlangan qiymat izlanadi.",
      'Три ряда. В каждом ищется значение, повторившееся чаще всего.',
      'Three series. In each, the most repeated value is sought.'),
    A('why',
      "Ba'zan hech bir qiymat boshqalaridan ko'p takrorlanmaydi, moda bo'lmaydi.",
      'Иногда ни одно значение не повторяется чаще других, моды не бывает.',
      'Sometimes no value repeats more than the others, there is no mode.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar takrorlanish soni to'g'ri solishtirilgan.",
      'Все три разобраны. Каждый раз число повторений верно сравнивалось.',
      'All three are done. Each time the count of repetitions was correctly compared.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3, 3, 4, 4, 4, 5, 5'}</Row>,
        ok: L("Ha. To'rt uch marta takrorlangan, boshqalaridan ko'p.", 'Да. Четыре повторилось три раза, больше остальных.', 'Yes. Four repeated three times, more than the others.'),
        question: L("Moda qaysi?", 'Какая мода?', 'What is the mode?'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '3', hint: L("Uch faqat ikki marta takrorlangan, to'rtdan kam.", 'Три повторилось только два раза, меньше, чем четыре.', 'Three repeated only twice, fewer than four.') },
        ],
        solution: ['3,3,4,4,4,5,5', '4'],
      },
      {
        expr: <Row size="big" align="center">{'3,8;  4;  4,5;  5,2;  4,9'}</Row>,
        ok: L("Ha. Barcha sonlar bir martadan uchraydi, moda yo'q.", 'Да. Все числа встречаются по одному разу, моды нет.', 'Yes. All the numbers occur once, there is no mode.'),
        question: L("Moda qaysi?", 'Какая мода?', 'What is the mode?'),
        items: [
          { id: 'a', right: true, label: L("Moda yo'q", 'Моды нет', 'There is no mode') },
          { id: 'b', label: '4,5', hint: L("To'rt nuqta besh boshqalaridan ko'p uchramaydi, bir martagina.", 'Четыре целых пять не встречается чаще других, только один раз.', 'Four point five does not occur more than the others, only once.') },
        ],
        solution: ['3,8;4;4,5;5,2;4,9', L("moda yo'q", 'моды нет', 'no mode')],
      },
      {
        expr: <Row size="big" align="center">{'162, 163, 164, 165, 166, 168, 168, 168, 169, 170'}</Row>,
        ok: L("Ha. Yuz oltmish sakkiz uch marta takrorlangan.", 'Да. Сто шестьдесят восемь повторилось три раза.', 'Yes. A hundred sixty-eight repeated three times.'),
        question: L("Moda qaysi?", 'Какая мода?', 'What is the mode?'),
        items: [
          { id: 'a', right: true, label: '168' },
          { id: 'b', label: '166,4', hint: L("Bu o'rtacha qiymat, moda emas.", 'Это среднее значение, а не мода.', 'That is the mean, not the mode.') },
        ],
        solution: ['162,163,164,165,166,168,168,168,169,170', '168'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): toq qator medianasini
// topish, javobni son bilan tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Toq qator medianasini toping",
    'Найди медиану нечётного ряда',
    'Find the median of the odd series',
  ),
  audio: [
    A('mount',
      "Uch qator. Har birida sonlar soni toq.",
      'Три ряда. В каждом количество чисел нечётное.',
      'Three series. In each, the count of numbers is odd.'),
    A('why',
      "Mediana qatorning aynan o'rtasidagi son, ikki chetdan sanab tekshiring.",
      'Медиана это число ровно в середине ряда, проверь, посчитав с обоих концов.',
      'The median is the number exactly in the middle of the series, check by counting from both ends.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar mediana ikki chetdan sanab tekshirilgan.",
      'Все три разобраны. Каждый раз медиана проверялась счётом с обоих концов.',
      'All three are done. Each time the median was checked by counting from both ends.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'20, 23, 24, 27, 29, 31, 34'}</Row>,
        ok: L("Ha. Ikki chetdan uchtadan sanalsa, o'rtada yigirma yetti qoladi.", 'Да. Если считать по три с каждого конца, в середине остаётся двадцать семь.', 'Yes. Counting three from each end, twenty-seven remains in the middle.'),
        question: L("Mediana qancha?", 'Чему равна медиана?', 'What is the median?'),
        items: [
          { id: 'a', right: true, label: '27' },
          { id: 'b', label: '24', hint: L("Bu o'rtadan chapdagi son, aynan o'rtasi emas.", 'Это число слева от середины, а не сама середина.', 'That is the number to the left of the middle, not the middle itself.') },
        ],
        solution: ['20,23,24,27,29,31,34', '27'],
      },
      {
        expr: <Row size="big" align="center">{'5, 8, 9, 12, 15'}</Row>,
        ok: L("Ha. Beshta sondan o'rtadagisi to'qqiz.", 'Да. Из пяти чисел среднее девять.', 'Yes. Of five numbers, the middle one is nine.'),
        question: L("Mediana qancha?", 'Чему равна медиана?', 'What is the median?'),
        items: [
          { id: 'a', right: true, label: '9' },
          { id: 'b', label: '8', hint: L("Bu o'rtadan chapdagi son.", 'Это число слева от середины.', 'That is the number to the left of the middle.') },
        ],
        solution: ['5,8,9,12,15', '9'],
      },
      {
        expr: <Row size="big" align="center">{'1, 2, 2, 3, 4, 4, 4'}</Row>,
        ok: L("Ha. Yetti sondan o'rtadagisi uch.", 'Да. Из семи чисел среднее три.', 'Yes. Of seven numbers, the middle one is three.'),
        question: L("Mediana qancha?", 'Чему равна медиана?', 'What is the median?'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '4', hint: L("To'rt moda, u o'rtada emas, o'ngroqda takrorlangan.", 'Четыре это мода, она не в середине, а повторилась справа.', 'Four is the mode, it is not the middle, it repeated on the right.') },
        ],
        solution: ['1,2,2,3,4,4,4', '3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): moda o'rtacha bilan
// chalkashtirilgan (З71) va juft qatorda mediana xato topilgan (З72).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato javobda nima noto'g'ri",
    'Что неверно в двух ошибочных ответах',
    'What is wrong in two mistaken answers',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham son to'g'ri hisoblanmagan.",
      'Два задания. В обоих число вычислено неверно.',
      'Two tasks. In both, the number was computed incorrectly.'),
    A('why',
      "Moda o'rtacha qiymat emas, juft qatorda mediana ikki o'rtadagi sonning o'rtachasi.",
      'Мода не среднее значение, а в чётном ряду медиана, среднее двух средних чисел.',
      'The mode is not the mean, and in an even series the median is the mean of the two middle numbers.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham ta'rifni chalkashtirishdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за путаницы в определениях.',
      'Both are done. Both mistakes came from confusing the definitions.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'162,163,164,165,166,168,168,168,169,170   →   166,4'}</Row>,
        ok: L("Ha. 166,4 bu o'rtacha qiymat. Moda uch marta takrorlangan 168 bo'lishi kerak edi.", 'Да. 166,4 это среднее значение. Модой должно было быть повторившееся три раза 168.', 'Yes. 166.4 is the mean. The mode should have been 168, which repeated three times.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Moda o'rtacha qiymat bilan chalkashtirilgan", 'Мода спутана со средним значением', 'The mode was confused with the mean') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, 166,4 takrorlanmagan, u faqat hisoblangan.", 'Это и есть показанная ошибка, 166,4 не повторялось, оно только вычислено.', 'This is the very mistake shown; 166.4 never repeated, it was only computed.') },
        ],
        solution: ['162..170', '168'],
      },
      {
        expr: <Row size="big" align="center">{'12,14,17,21,23,29,32,37   →   23'}</Row>,
        ok: L("Ha. Sakkiz son juft, mediana ikki o'rtadagi son, yigirma bir va yigirma uchning o'rtachasi, yigirma ikki bo'lishi kerak edi.", 'Да. Восемь чисел чётное количество, медиана, среднее двух средних, двадцати одного и двадцати трёх, должна была быть двадцать два.', 'Yes. Eight numbers is an even count, the median, the mean of the two middle numbers twenty-one and twenty-three, should have been twenty-two.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Faqat bitta o'rtadagi son olingan, ikkisining o'rtachasi emas", 'Взято только одно среднее число, а не среднее двух', 'Only one middle number was taken, not the mean of the two') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, sakkiz son juft, ikkita o'rtadagi son bor.", 'Это и есть показанная ошибка, восемь чисел чётное, средних чисел два.', 'This is the very mistake shown; eight is even, there are two middle numbers.') },
        ],
        solution: ['21,23', '22'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): juft qatorda medianani
// qadamlab topish.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Juft qatorda medianani qadamlab toping",
    'Найди медиану чётного ряда по шагам',
    'Find the median of the even series step by step',
  ),
  audio: [
    A('mount',
      "Qator berilgan. Avval ikki o'rtadagi sonni, keyin ularning o'rtachasini yozing.",
      'Дан ряд. Сначала запиши два средних числа, потом их среднее.',
      'A series is given. First write the two middle numbers, then their mean.'),
    A('why',
      "Sonlar soni juft bo'lganda, o'rtada har doim ikkita son turadi.",
      'Когда количество чисел чётное, в середине всегда стоят два числа.',
      'When the count of numbers is even, there are always two numbers in the middle.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar ikki o'rtadagi son to'g'ri topilib, o'rtachasi olingan.",
      'Все три заполнены. Каждый раз два средних числа верно находились и бралось их среднее.',
      'All three are filled. Each time the two middle numbers were found and their mean taken.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['21', '23', '22'],
      lines: [
        [{ t: '12,14,17,21,23,29,32,37   →   ' }, { slot: '21' }, { t: ', ' }, { slot: '23' }, { t: '   →   ' }, { slot: '22' }],
      ],
    },
    tasks: [
      {
        chips: ['6', '8', '7'],
        lines: [
          [{ t: '2,4,6,8,10,12   →   ' }, { slot: '6' }, { t: ', ' }, { slot: '8' }, { t: '   →   ' }, { slot: '7' }],
        ],
      },
      {
        chips: ['15', '17', '16'],
        lines: [
          [{ t: '10,13,15,17,19,22   →   ' }, { slot: '15' }, { t: ', ' }, { slot: '17' }, { t: '   →   ' }, { slot: '16' }],
        ],
      },
      {
        chips: ['30', '34', '32'],
        lines: [
          [{ t: '20,25,30,34,40,45   →   ' }, { slot: '30' }, { t: ', ' }, { slot: '34' }, { t: '   →   ' }, { slot: '32' }],
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
    "O'rtacha, moda, mediana bo'yicha to'rt savol",
    'Четыре вопроса о среднем, моде и медиане',
    'Four questions about the mean, the mode, and the median',
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
        id: 'q1', tag: 'З71',
        ask: L('3, 3, 4, 4, 4, 5, 5 qatorida moda va o\'rtacha qiymat tengmi?', 'В ряду 3, 3, 4, 4, 4, 5, 5 равны ли мода и среднее значение?', 'In the series 3, 3, 4, 4, 4, 5, 5 are the mode and the mean equal?'),
        options: [
          { id: 'ok', right: true, label: L('Ha, ikkalasi ham to\'rt', 'Да, оба равны четырём', 'Yes, both equal four') },
          { id: 'no', label: L('Yo\'q, doim teng bo\'lmaydi', 'Нет, они никогда не равны', 'No, they are never equal') },
        ],
        hint: L("Bu qatorda ular tasodifan teng chiqdi, lekin bu har doim shart emas.", 'В этом ряду они случайно совпали, но это не обязательно всегда.', 'In this series they happened to coincide, but that is not always required.'),
        ok: L("To'g'ri, bu qatorda ikkalasi ham to'rt.", 'Верно, в этом ряду оба равны четырём.', 'Correct, in this series both equal four.'),
      },
      {
        id: 'q2', tag: 'З72',
        ask: L('4, 6, 8, 10 qatorining medianasi qancha?', 'Чему равна медиана ряда 4, 6, 8, 10?', 'What is the median of the series 4, 6, 8, 10?'),
        options: [
          { id: 'ok', right: true, label: '7' },
          { id: 'no', label: '8' },
        ],
        hint: L("To'rt son juft, o'rtadagi ikkisi olti va sakkiz, ularning o'rtachasi yetti.", 'Четыре числа, чётное количество, средние два, шесть и восемь, их среднее семь.', 'Four numbers, an even count, the middle two are six and eight, their mean is seven.'),
        ok: L("To'g'ri, olti va sakkizning o'rtachasi yetti.", 'Верно, среднее шести и восьми равно семи.', 'Correct, the mean of six and eight is seven.'),
      },
      {
        id: 'q3', tag: 'З71',
        ask: L('3,8; 4; 4,5; 5,2; 4,9 qatorida moda bormi?', 'Есть ли мода в ряду 3,8; 4; 4,5; 5,2; 4,9?', 'Is there a mode in the series 3.8, 4, 4.5, 5.2, 4.9?'),
        options: [
          { id: 'ok', right: true, label: L('Yo\'q', 'Нет', 'No') },
          { id: 'no', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Barcha qiymatlar bir martadan uchraydi, hech biri boshqasidan ko'p emas.", 'Все значения встречаются по одному разу, ни одно не чаще другого.', 'All the values occur once, none more often than another.'),
        ok: L("To'g'ri, moda yo'q qatorlar ham bo'ladi.", 'Верно, бывают ряды без моды.', 'Correct, series without a mode do exist.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('20, 23, 24, 27, 29, 31, 34 qatorining medianasi 27ga tengmi?', 'Верно ли, что медиана ряда 20, 23, 24, 27, 29, 31, 34 равна 27?', 'Is it true that the median of the series 20, 23, 24, 27, 29, 31, 34 equals 27?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Ikki chetdan sanab ko'ring, o'rtada 27 qoladi.", 'Посчитай с обоих концов, в середине останется 27.', 'Count from both ends, twenty-seven remains in the middle.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З72',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "12,14,17,21,23,29,32,37 qatorining o'rtadagi ikki soni va medianasini yig'ing.",
            'Собери два средних числа и медиану ряда 12,14,17,21,23,29,32,37.',
            'Assemble the two middle numbers and the median of the series 12,14,17,21,23,29,32,37.',
          ),
          lines: [
            [{ t: '12,14,17,' }, { slot: '21' }, { t: ',' }, { slot: '23' }, { t: ',29,32,37   →   ' }, { slot: '22' }],
          ],
          tiles: [
            { id: 't1', v: '21', x: 12, y: 12 },
            { id: 't2', v: '23', x: 55, y: 14 },
            { id: 't3', v: '22', x: 40, y: 50 },
            { id: 't4', v: '17', x: 78, y: 48 },
          ],
          hint: L(
            "Sakkiz son, o'rtadagi ikkisi to'rtinchi va beshinchi o'rinda, yigirma bir va yigirma uch.",
            'Восемь чисел, средние два на четвёртом и пятом месте, двадцать один и двадцать три.',
            'Eight numbers, the middle two are in the fourth and fifth positions, twenty-one and twenty-three.',
          ),
          doneNote: L(
            "Yig'ildi. Ikki o'rtadagi son topildi, ularning o'rtachasi mediana bo'ldi.",
            'Собрано. Два средних числа найдены, их среднее стало медианой.',
            'Assembled. The two middle numbers were found, their mean became the median.',
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
    "O'rtacha hisoblanadi, moda takrorlanishdan, mediana o'rindan topiladi",
    'Среднее считается, мода находится по повторению, медиана по месту',
    'The mean is computed, the mode is found by repetition, the median by position',
  ),
  audio: [
    A('s0',
      "Darsdan bitta qator qoladi. Uch xil son bir xil ma'lumotni uch tomondan tasvirlaydi.",
      'С урока остаётся один ряд. Три разных числа описывают одни данные с трёх сторон.',
      'One series stays with you. Three different numbers describe the same data from three sides.'),
    A('s1',
      "Bugun uch narsa qilindi. Vaznli o'rtachani burdingiz, moda o'rtacha bilan teng emasligini ko'rdingiz va mediananing juft qatorda qanday topilishini bildingiz.",
      'Сегодня сделано три вещи. Ты крутил средневзвешенное, увидел, что мода не равна среднему, и узнал, как находится медиана в чётном ряду.',
      'Three things are done today. You turned the weighted mean, saw that the mode is not the mean, and learned how the median is found in an even series.'),
    A('s2',
      "Keyingi darsda kombinatorika. Barcha holatlarni sanashning o'z usuli bo'ladi.",
      'В следующем уроке комбинаторика. У подсчёта всех случаев будет свой способ.',
      'The next lesson covers combinatorics. Counting all the cases will have its own method.',
    ),
  ],
  props: {
    mark: '162,163,164,165,166,168,168,168,169,170',
    markNote: L(
      "x̄ = 166,4      M₀ = 168",
      'x̄ = 166,4      M₀ = 168',
      'x̄ = 166.4      M₀ = 168',
    ),
    lines: [
      L(
        "Sonlar yig'indisi ularning soniga bo'linsa, o'rtacha qiymat topiladi",
        'Если сумму чисел разделить на их количество, найдётся среднее значение',
        'If the sum of the numbers is divided by their count, the mean is found',
      ),
      L(
        "Eng ko'p uchraydigan qiymat moda, ular o'rtacha bilan teng bo'lmasligi mumkin",
        'Значение, встречающееся чаще всего, это мода, она может не совпадать со средним',
        'The most frequent value is the mode, it may not coincide with the mean',
      ),
      L(
        "Juft qatorda mediana o'rtadagi ikki sonning o'rtachasi",
        'В чётном ряду медиана, среднее двух средних чисел',
        'In an even series the median is the mean of the two middle numbers',
      ),
    ],
    bridge: L(
      "Keyingi dars: kombinatorika, sanashning o'z usuli",
      'Следующий урок: комбинаторика, свой способ подсчёта',
      'Next lesson: combinatorics, its own way of counting',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya, 1-darsning asboblari,
// bitta pozitsiya (5-ekran), O'RTACHA KETADI (`datadrag`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З71', 'З71', 'З72',
    'З72', 'З71', 'З71', 'З71', 'З71',
    'З16', 'З72', 'З72', null, null,
  ],
  mechanic: { at: 5, tool: 'datadrag' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
