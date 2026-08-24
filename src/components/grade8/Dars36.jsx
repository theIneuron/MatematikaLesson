// ============================================================================
// 8-sinf, Dars 36. KOMBINATORIKA: METOD PEREBORA VA ASOSIY QONUNI.
//
// Bu fayl, FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `treebuild.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya, 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `treebuild` (`TreeBuild`): ikki bosqich
// shoxlari buriladi, yaproqlar soni har safar ko'paytma sifatida chiqadi.
//
// MANBA: 8-sinf algebra darsligi, 30- va 31-§ (200-204-bet). Barcha sonlar
// darslikdan olingan:
//   - 2,3,5 raqamlari, takrorlash bilan ikki xonali son (200-bet, 1-masala):
//     daraxt, 3 · 3 = 9 ta son (22,23,25,32,33,35,52,53,55);
//   - 1,2,3 raqamlari, takrorlamasdan uch xonali son (201-bet, 2-masala):
//     daraxt, 3 · 2 · 1 = 6 ta son (123,132,213,231,312,321);
//   - Buxoro, Samarqand, Xiva marshrutlari (201-bet, 3-masala): 6 marshrut;
//   - 1,2,3 va 0,1,2,3 raqamlari, variantlar jadvali (202-bet, 4-masala):
//     N = 3·3 = 9 va N = 3·4 = 12 (birinchi raqam nolga teng bo'lmaydi);
//   - Samarqand-Toshkent-Xo'jakent transport (203-204-bet, 1-masala):
//     4 · 3 = 12 xil usul, ko'paytirish qoidasi shu yerda ta'riflanadi;
//   - "Makro" supermarketi, piyola-taqsimcha-qoshiq (204-bet, 2-masala):
//     5·6 + 5·4 + 6·4 = 74 xil usul.
//
// ADASHISHLAR, yangi ikkitasi:
//   З73, takrorlanish mumkin va mumkin bo'lmagan holatlar chalkashtirilgan;
//   З74, ko'paytirish qoidasi o'rniga qo'shish qoidasi ishlatilgan;
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
  id: 'alg-8-36',
  n: 36,
  row: 40,
  block: 'Б5',
  topic: L(
    "Kombinatorika, metod perebora va asosiy qonuni",
    'Комбинаторика, метод перебора и основной закон',
    'Combinatorics, the enumeration method and the basic law',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Barcha holatlarni bittasini ham qoldirmay sanash usuli tanlash (perebor) usuli deyiladi",
    'Способ пересчитать все случаи, не пропустив ни одного, называется методом перебора',
    'The way of counting all the cases without missing any is called the enumeration method',
  ),
  L(
    "A dan B ga kelishning m usuli, B dan C ga kelishning n usuli bo'lsa, A dan C ga kelishning m ko'paytirilgan n usuli bor",
    'Если от A до B есть m способов, а от B до C есть n способов, то от A до C есть m, умноженное на n, способов',
    'If there are m ways from A to B, and n ways from B to C, then there are m times n ways from A to C',
  ),
  L(
    "Bir vaqtda faqat bitta yo'l tanlanadigan holatlar qo'shiladi, ketma-ket bosqichlar ko'paytiriladi",
    'Случаи, когда выбирается только один из путей, складываются, а последовательные шаги перемножаются',
    'Cases where only one of several paths is chosen are added, sequential steps are multiplied',
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
  'З73': {
    what: L(
      "takrorlanish mumkin va mumkin bo'lmagan holatlar chalkashtirilgan",
      'случаи с повторением и без повторения были спутаны',
      'the cases with and without repetition were confused',
    ),
    wrong: '27',
    at: 12,
  },
  'З74': {
    what: L(
      "ko'paytirish qoidasi o'rniga qo'shish qoidasi ishlatilgan",
      'вместо правила умножения применено правило сложения',
      'the addition rule was used instead of the multiplication rule',
    ),
    wrong: '7',
    at: 12,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: 2,3,5 raqamlaridan necha son. Yakun: daraxt shoxlari
// ko'paytmaga aylanadi.
// ============================================================
const SC_ASK = L('NECHTA SON CHIQADI', 'СКОЛЬКО ЧИСЕЛ ВЫЙДЕТ', 'HOW MANY NUMBERS WILL COME OUT')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="50" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20"
        fill={T.ink}>{'2   3   5'}</text>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="200" cy="92" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="99" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
      <g className="g8-seat" style={{ '--d': '2800ms' }}>
        <text x="200" y="122" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>{"ikki xonali sonlar"}</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Bosqichlar ko'paytiriladi, tanlovlar qo'shiladi",
      'Шаги перемножаются, выборы складываются',
      'Steps are multiplied, choices are added',
    )}>
      <text x="200" y="45" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fill={T.ink}>{'4      3'}</text>
      <g className="g8-seat" style={{ '--d': '1300ms' }}>
        <text x="200" y="80" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18"
          fontWeight="700" fill={T.ok}>{'4 · 3 = 12'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1900ms' }}>
        <text x="200" y="105" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
          fill={T.ink3}>{"ko'paytirish qoidasi"}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('IKKI XONALI SONLAR', 'ДВУЗНАЧНЫЕ ЧИСЛА', 'TWO-DIGIT NUMBERS'),
  title: L(
    "2, 3, 5 raqamlaridan nechta ikki xonali son tuzish mumkin",
    'Сколько двузначных чисел можно составить из цифр 2, 3, 5',
    'How many two-digit numbers can be made from the digits 2, 3, 5',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Uch raqam bor. Ikki xonali son tuzish kerak, raqamlarni takrorlash mumkin.",
      'Есть три цифры. Нужно составить двузначное число, цифры можно повторять.',
      'There are three digits. A two-digit number must be formed, digits may repeat.'),
    A('why',
      "Taxmin qiling, jami nechta son chiqadi.",
      'Предположи, сколько всего чисел получится.',
      'Predict how many numbers will result in total.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, jami nechta ikki xonali son chiqadi?",
      'Как думаешь, сколько всего получится двузначных чисел?',
      'What do you think, how many two-digit numbers result in total?',
    ),
    items: [
      { id: 'a', show: '3' },
      { id: 'b', show: '6' },
      { id: 'c', show: '9' },
      { id: 'd', show: '25' },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Ketma-ket ikki tanlov usullar sonini ko'paytiradi
// (6-sinfdan tanish tushuncha).
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Ketma-ket ikki tanlovni eslash",
    'Вспоминаем два выбора подряд',
    'Recalling two choices in a row',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida kiyim kombinatsiyalari to'g'ri sanalgan.",
      'Четыре записи. Только в одной верно посчитаны комбинации одежды.',
      'Four records. Only in one are the clothing combinations correctly counted.'),
    A('why',
      "Har bir ko'ylakka har bir shim mos kelishi mumkin, shuning uchun ko'paytiriladi.",
      'Каждая рубашка может сочетаться с каждой парой брюк, поэтому числа перемножаются.',
      'Each shirt can go with each pair of trousers, so the numbers are multiplied.'),
  ],
  props: {
    ask: L(
      "Ikki ko'ylak va uch shim bor. Kombinatsiyalar soni qaysi yozuvda to'g'ri?",
      'Есть две рубашки и три пары брюк. В какой записи верно число комбинаций?',
      'There are two shirts and three pairs of trousers. In which record is the number of combinations correct?',
    ),
    items: [
      { id: 'right', show: '2 · 3 = 6', right: true, name: L('har bir ko\'ylak har bir shim bilan', 'каждая рубашка с каждыми брюками', 'each shirt with each pair of trousers') },
      {
        id: 'sum', show: '2 + 3 = 5',
        hint: L("Bu qo'shish, lekin ko'ylak va shim BIRGALIKDA tanlanadi, ketma-ket ikki tanlov.", 'Это сложение, но рубашка и брюки выбираются ВМЕСТЕ, два выбора подряд.', 'That is addition, but the shirt and trousers are chosen TOGETHER, two choices in a row.'),
      },
      {
        id: 'two', show: '2',
        hint: L("Bu faqat ko'ylaklar soni, shimlar hisobga olinmagan.", 'Это только число рубашек, брюки не учтены.', 'That is only the number of shirts, the trousers are not counted.'),
      },
      {
        id: 'three', show: '3',
        hint: L("Bu faqat shimlar soni, ko'ylaklar hisobga olinmagan.", 'Это только число брюк, рубашки не учтены.', 'That is only the number of trousers, the shirts are not counted.'),
      },
    ],
    after: L(
      "To'g'ri. Ikki ko'ylak, har biriga uch shim, jami olti kombinatsiya.",
      'Верно. Две рубашки, к каждой три пары брюк, всего шесть комбинаций.',
      'Correct. Two shirts, three trousers for each, six combinations in total.',
    ),
  },
}

// ============================================================
// EKRAN 3. YO'LLARNI BURANG (1-darsning `steppers`). Samarqand-Toshkent-
// Xo'jakent (203-204-bet, 1-masala).
// ============================================================
const S3 = {
  eyebrow: L('YO\'LLARNI BURANG', 'КРУТИ ДОРОГИ', 'TURN THE ROADS'),
  title: L(
    "Toshkentdan Xo'jakentga yo'llar sonini burang",
    'Крути число дорог от Ташкента до Ходжакента',
    'Turn the number of roads from Tashkent to Khodjakent',
  ),
  audio: [
    A('mount',
      "Samarqanddan Toshkentga to'rt yo'l bor. Toshkentdan Xo'jakentga yo'llar soni buriladi.",
      'От Самарканда до Ташкента четыре дороги. Крутится число дорог от Ташкента до Ходжакента.',
      'There are four roads from Samarkand to Tashkent. The number of roads from Tashkent to Khodjakent is turned.'),
    A('why',
      "Yo'llar sonini oshirib, natijani o'n ikkiga yetkazing.",
      'Увеличивай число дорог, доведи результат до двенадцати.',
      'Increase the number of roads, bring the result up to twelve.'),
    A('why',
      "Oxirida yo'llar sonini nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти число дорог до нуля и посмотри, что будет.',
      'At the end bring the number of roads down to zero and see what happens.'),
  ],
  props: {
    cols: [
      { id: 'b', label: L("Toshkent-Xo'jakent yo'llari", 'дороги Ташкент-Ходжакент', 'roads Tashkent-Khodjakent'), start: 2, min: 0, max: 6, step: 1, risky: true },
    ],
    calc: (v) => (v[0] === 0 ? null : 4 * v[0]),
    resultLabel: L("Samarqand-Xo'jakent yo'llari", 'дороги Самарканд-Ходжакент', 'roads Samarkand-Khodjakent'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "yo'llar hali nolga tushmasin, avval maqsadni oling.",
      'Дороги пока не опускай до нуля, сначала возьми цель.',
      'Do not bring the roads down to zero yet, take the target first.',
    ),
    goals: [
      {
        value: 12,
        ask: L("Natija o'n ikkiga tenglashsin", 'Пусть результат станет равным двенадцати', 'Make the result equal twelve'),
        after: L(
          "O'n ikki. To'rt yo'l uch yo'lga ko'paytirilgan.",
          'Двенадцать. Четыре дороги умножены на три дороги.',
          'Twelve. Four roads multiplied by three roads.',
        ),
      },
    ],
    ask: L("Natija o'n ikkiga tenglashsin", 'Пусть результат станет равным двенадцати', 'Make the result equal twelve'),
    ask2: L("Endi yo'llar sonini nolga tushiring", 'Теперь опусти число дорог до нуля', 'Now bring the number of roads down to zero'),
    broke: L(
      "Toshkentdan Xo'jakentga birorta yo'l bo'lmasa, Samarqanddan Xo'jakentga umuman yetib bo'lmaydi, usullar yo'q.",
      'Если от Ташкента до Ходжакента нет ни одной дороги, от Самарканда до Ходжакента добраться вообще нельзя, способов нет.',
      'If there is no road at all from Tashkent to Khodjakent, there is no way to reach Khodjakent from Samarkand at all.',
    ),
  },
}

// ============================================================
// EKRAN 4. TAKRORLASH BOR YOKI YO'Q (1-darsning `pick`). Ловушка,
// takrorlanish holatlari chalkashtirilgan (З73).
// ============================================================
const S4 = {
  eyebrow: L('TAKRORLASH BOR YOKI YO\'Q', 'ПОВТОРЕНИЕ ЕСТЬ ИЛИ НЕТ', 'IS THERE REPETITION OR NOT'),
  title: L(
    "1, 2, 3 raqamlaridan, takrorlamasdan, nechta uch xonali son tuzish mumkin",
    'Сколько трёхзначных чисел можно составить из цифр 1, 2, 3 без повторения',
    'How many three-digit numbers can be made from the digits 1, 2, 3 without repetition',
  ),
  audio: [
    A('mount',
      "To'rt javob taklif qilinadi. Faqat bittasida takrorlash yo'qligi hisobga olingan.",
      'Предложены четыре ответа. Только в одном учтено отсутствие повторения.',
      'Four answers are proposed. Only one accounts for no repetition.'),
    A('why',
      "Birinchi raqam uchtadan biri, ikkinchisi qolgan ikkitadan biri, uchinchisi qolgan bittasi.",
      'Первая цифра одна из трёх, вторая одна из оставшихся двух, третья, оставшаяся одна.',
      'The first digit is one of three, the second one of the remaining two, the third the one remaining.'),
  ],
  props: {
    ask: L(
      "1, 2, 3 raqamlaridan, TAKRORLAMASDAN, nechta uch xonali son tuzish mumkin?",
      'Сколько трёхзначных чисел можно составить из 1, 2, 3 БЕЗ повторения?',
      'How many three-digit numbers can be made from 1, 2, 3 WITHOUT repetition?',
    ),
    items: [
      { id: 'right', show: '6', right: true, name: L('uch, ikki, bir, ketma-ket kamayadi', 'три, два, один, убывает подряд', 'three, two, one, decreasing in a row') },
      {
        id: 'nine', show: '9',
        hint: L("To'qqiz takrorlash RUXSAT ETILGANDA chiqadi, bu yerda takrorlash yo'q.", 'Девять выходит, когда повторение РАЗРЕШЕНО, а здесь повторения нет.', 'Nine comes out when repetition IS allowed, but here there is no repetition.'),
      },
      {
        id: 'twentyseven', show: '27',
        hint: L("Yigirma yetti uch xonali son uchun takrorlash bilan chiqadi, bu yerda emas.", 'Двадцать семь выходит для трёхзначного числа с повторением, а не здесь.', 'Twenty-seven comes out for a three-digit number with repetition, not here.'),
      },
      {
        id: 'three', show: '3',
        hint: L("Bu faqat raqamlar soni, hosil bo'lgan sonlar soni emas.", 'Это только количество цифр, а не количество получившихся чисел.', 'That is only the count of digits, not the count of resulting numbers.'),
      },
    ],
    after: L(
      "To'g'ri. Uch, ikki, bir, ko'paytirilsa olti chiqadi.",
      'Верно. Три, два, один, при умножении дают шесть.',
      'Correct. Three, two, one, multiplied give six.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI, DARAXT SHOXLARI (`treebuild`). 2,3,5
// raqamlari, takrorlash bilan (200-bet, 1-masala).
// ============================================================
const S5 = {
  eyebrow: L('DARAXTNI QURING', 'СТРОЙ ДЕРЕВО', 'BUILD THE TREE'),
  title: L(
    "Ikki bosqich shoxlarini buring, yaproqlar soni ko'paytmaga aylanadi",
    'Крути ветви двух шагов, число листьев становится произведением',
    'Turn the branches of two steps, the number of leaves becomes the product',
  ),
  audio: [
    A('mount',
      "Birinchi raqam uchun uch shox, ikkinchi raqam uchun ham uch shoxcha turibdi.",
      'Для первой цифры три ветви, для второй цифры тоже три ветви.',
      'Three branches for the first digit, three branches for the second digit too.'),
    A('why',
      "Ikkalasini ham to'rttaga yetkazib, yaproqlar sonini o'n oltiga chiqaring.",
      'Доведи оба числа до четырёх, чтобы число листьев стало шестнадцать.',
      'Bring both numbers up to four, so the number of leaves becomes sixteen.'),
    W('branch',
      "Bir bosqich nolga tushdi, va yaproq qolmadi. Shoxsiz sayohatni yakunlab bo'lmaydi.",
      'Один шаг опустился до нуля, и листьев не осталось. Без ветви путь не закончить.',
      'One step dropped to zero, and no leaves remain. Without a branch the journey cannot finish.'),
  ],
  props: {
    n1Start: 2,
    n1Min: 0,
    n1Max: 5,
    n2Start: 2,
    n2Min: 0,
    n2Max: 5,
    goals: [
      {
        value: 16,
        ask: L("Yaproqlar soni o'n oltiga tenglashsin", 'Пусть число листьев станет равным шестнадцати', 'Make the number of leaves equal sixteen'),
        after: L(
          "O'n olti. To'rt shox to'rt shoxchaga ko'paytirilgan.",
          'Шестнадцать. Четыре ветви умножены на четыре ветви.',
          'Sixteen. Four branches multiplied by four branches.',
        ),
      },
    ],
    ask2: L("Endi bosqichlardan birini nolga tushiring", 'Теперь опусти один из шагов до нуля', 'Now bring one of the steps down to zero'),
    zeroNote: L(
      "hali maqsadni oling, keyin nolga tushirasiz.",
      'Сначала возьми цель, потом опустишь до нуля.',
      'Take the target first, then bring it down to zero.',
    ),
    broke: L(
      "Bosqichlardan birida shox bo'lmasa, daraxt yaproqsiz qoladi, natija yo'q.",
      'Если на одном из шагов нет ветвей, дерево остаётся без листьев, результата нет.',
      'If one of the steps has no branches, the tree is left without leaves, there is no result.',
    ),
    fields: [
      {
        ask: L("2, 3, 5 raqamlaridan, takrorlash bilan, nechta ikki xonali son tuzish mumkin?", 'Сколько двузначных чисел с повторением можно составить из 2, 3, 5?', 'How many two-digit numbers with repetition can be made from 2, 3, 5?'),
        kind: 'number',
        answer: '9',
        accepts: ['9'],
        hints: {
          '6': L("Bu takrorlamasdan chiqadigan son, bu yerda takrorlash RUXSAT ETILGAN.", 'Это число без повторения, а здесь повторение РАЗРЕШЕНО.', 'That is the number without repetition, but here repetition IS allowed.'),
        },
      },
    ],
    note: L(
      "Uch raqam, har biriga uch raqam, to'qqiz son.",
      'Три цифры, к каждой три цифры, девять чисел.',
      'Three digits, three digits for each, nine numbers.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): sanashning ikki yo'li,
// takrorlamasdan uch xonali son (201-bet, 2-masala).
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "1, 2, 3 raqamlaridan sonlar sonini topishning ikki yo'li",
    'Два способа найти число чисел из цифр 1, 2, 3',
    'Two ways to find the count of numbers from the digits 1, 2, 3',
  ),
  audio: [
    A('mount',
      "Bitta natija va ikki yo'l. Ikkalasi ham bir xil sonni beradi.",
      'Один результат и два пути. Оба дают одно и то же число.',
      'One result and two ways. Both give the same number.'),
    W('w2',
      "Birinchi yo'lda barcha sonlar bittalab yozib chiqiladi.",
      'В первом пути все числа выписываются по одному.',
      'In the first way, all the numbers are written out one by one.'),
    W('w4',
      "Ikkinchi yo'lda uch bosqich ko'paytiriladi, har bosqichda tanlov kamayadi.",
      'Во втором пути перемножаются три шага, на каждом шаге выбор уменьшается.',
      'In the second way, three steps are multiplied, the choice shrinking at each step.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL, BARCHASINI YOZISH', 'СПОСОБ 1, ВЫПИСАТЬ ВСЁ', 'METHOD 1, WRITING THEM ALL OUT'),
        lead: L(
          "1, 2, 3 raqamlaridan barcha uch xonali sonlarni yozamiz",
          'Выписываем все трёхзначные числа из цифр 1, 2, 3',
          'We write out all the three-digit numbers from the digits 1, 2, 3',
        ),
        rows: [
          { text: '123, 132, 213, 231, 312, 321' },
          { text: L("oltita son chiqdi", 'вышло шесть чисел', 'six numbers came out'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL, BOSQICHLARNI KO\'PAYTIRISH', 'СПОСОБ 2, ПЕРЕМНОЖИТЬ ШАГИ', 'METHOD 2, MULTIPLYING THE STEPS'),
        lead: L(
          "Uchta bosqichni ko'paytiramiz, har safar tanlov kamayadi",
          'Перемножаем три шага, на каждом выбор уменьшается',
          'We multiply three steps, the choice shrinking each time',
        ),
        rows: [
          { text: '3 · 2 · 1' },
          { text: L("olti chiqdi, yozmasdan turib", 'вышло шесть, без выписывания', 'six came out, without writing anything'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL SON BERDI', 'ОБА ДАЛИ ОДНО ЧИСЛО', 'BOTH GAVE THE SAME NUMBER'),
        lead: L(
          "Yozish ishonchli, ko'paytirish esa tezroq",
          'Выписывание надёжно, а умножение быстрее',
          'Writing them out is reliable, multiplying is faster',
        ),
        rows: [{ text: '6', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): ko'paytirish qoidasining uch
// qismi, Samarqand-Toshkent-Xo'jakent.
// ============================================================
const S7 = {
  eyebrow: L('QOIDANING UCH QISMI', 'ТРИ ЧАСТИ ПРАВИЛА', 'THE THREE PARTS OF THE RULE'),
  title: L(
    "Ko'paytirish qoidasining uch qismi",
    'Три части правила умножения',
    'The three parts of the multiplication rule',
  ),
  audio: [
    A('mount',
      "Uch shahar, ikki bosqich. Har bir bosqichning o'z usullari soni bor.",
      'Три города, два шага. У каждого шага своё число способов.',
      'Three cities, two steps. Each step has its own number of ways.'),
    W('p2',
      "Birinchi bosqich, Samarqanddan Toshkentga to'rt yo'l.",
      'Первый шаг, от Самарканда до Ташкента четыре дороги.',
      'The first step, four roads from Samarkand to Tashkent.'),
    W('p4',
      "Ikkinchi bosqich, Toshkentdan Xo'jakentga uch yo'l, va ular ko'paytiriladi.",
      'Второй шаг, от Ташкента до Ходжакента три дороги, и они перемножаются.',
      'The second step, three roads from Tashkent to Khodjakent, and they are multiplied.',
    ),
  ],
  props: {
    tokens: [
      { t: '4', id: 'a' },
      { t: '  ·  ', id: 'mid' },
      { t: '3  =  12', id: 'b' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi son. Samarqanddan Toshkentga kelishning to'rt usuli.",
          'Первое число. Четыре способа добраться от Самарканда до Ташкента.',
          'The first number. Four ways to reach Tashkent from Samarkand.',
        ),
      },
      {
        focus: 'mid',
        text: L(
          "Ko'paytirish belgisi. Har bir birinchi usulga ikkinchi bosqichning barcha usullari mos keladi.",
          'Знак умножения. Каждому способу первого шага соответствуют все способы второго.',
          'The multiplication sign. Every way of the first step pairs with all the ways of the second.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ikkinchi son va natija. Uch usul, ko'paytirilganda o'n ikki yo'l chiqadi.",
          'Второе число и результат. Три способа, при умножении дают двенадцать путей.',
          'The second number and the result. Three ways, multiplied giving twelve paths.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "„Makro“ supermarketida piyola, taqsimcha va choy qoshig'ini ikkitadan tanlashning yetmish to'rt xil usuli bor, chunki uch juftlik alohida ko'paytirilib, keyin qo'shiladi.",
        'В супермаркете «Макро» выбрать по два предмета из пиалы, тарелочки и чайной ложки можно семьдесят четырьмя способами, потому что три пары перемножаются отдельно, а потом складываются.',
        'In the "Makro" supermarket, choosing two items out of a bowl, a small plate, and a teaspoon can be done in seventy-four ways, because the three pairs are multiplied separately and then added.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). Darslik 31-§ ta'rifi.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Kombinatorikaning asosiy qoidasi",
    'Основное правило комбинаторики',
    'The basic law of combinatorics',
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
      { id: 'f1', label: L("A dan B ga m usul, B dan C ga n usul bo'lsa", 'если от A до B m способов, а от B до C n способов', 'if there are m ways from A to B, and n ways from B to C') },
      { id: 'f2', label: L("A dan C ga kelishning jami m ko'paytirilgan n usuli bor", 'то от A до C всего m, умноженное на n, способов', 'then there are m times n ways from A to C in total') },
      { id: 'f3', label: L("bir yo'lni tanlash mumkin bo'lgan holatlar esa qo'shiladi", 'а случаи, где выбирается лишь один путь, складываются', 'while cases where only one path is chosen are added') },
      { id: 'w1', label: L("usullar soni har doim qo'shiladi", 'число способов всегда складывается', 'the number of ways is always added') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Ketma-ket bosqichlar ko'paytiriladi, faqat bir yo'l tanlanadigan holatlar qo'shiladi.",
      'Так не складывается. Последовательные шаги перемножаются, складываются лишь случаи с выбором одного пути.',
      'That does not fit. Sequential steps are multiplied; only cases choosing a single path are added.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik 31-paragrafi asosida (203-204-bet)",
        'Правило на основе параграфа 31 учебника (стр. 203-204)',
        'The rule is based on section 31 of the textbook (pages 203-204)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "2, 3, 5 raqamlaridan nechta son chiqishini hali bilmaymiz",
        'Мы пока не знаем, сколько чисел выйдет из 2, 3, 5',
        'We still do not know how many numbers come out of 2, 3, 5',
      ),
      right: L(
        "endi bosqichlarni ko'paytirib, to'qqiz son chiqishini bilamiz",
        'теперь, перемножив шаги, знаем, что выйдет девять чисел',
        'now, multiplying the steps, we know nine numbers come out',
      ),
      winner: 'right',
      note: L(
        "Ketma-ket bosqichlar ko'paytiriladi, alternativ yo'llar qo'shiladi",
        'Последовательные шаги перемножаются, альтернативные пути складываются',
        'Sequential steps are multiplied, alternative paths are added',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): takrorlash bor va yo'q holatlar.
// ============================================================
const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Sonlar sonini hisoblang, takrorlanishga e'tibor bering",
    'Вычисли число чисел, обращая внимание на повторение',
    'Compute the count of numbers, paying attention to repetition',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida takrorlash bor yoki yo'qligini ko'rish kerak.",
      'Пять заданий. В каждом нужно смотреть, есть повторение или нет.',
      'Five tasks. In each, check whether there is repetition or not.'),
    A('why',
      "Takrorlash bo'lsa, har bosqichda tanlov kamaymaydi.",
      'Если повторение есть, выбор на каждом шаге не уменьшается.',
      'If there is repetition, the choice does not shrink at each step.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar takrorlash borligi yoki yo'qligi to'g'ri hisobga olingan.",
      'Все пять разобраны. Каждый раз верно учтено, есть повторение или нет.',
      'All five are done. Each time it was correctly accounted whether there was repetition or not.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'A, B, C'}</Row>,
        ok: L("Ha. Har uch o'rinda ham uch harfdan biri turadi, uch marta ko'paytirilgan.", 'Да. На каждом из трёх мест любая из трёх букв, перемножено трижды.', 'Yes. At each of the three positions, any of the three letters, multiplied three times.'),
        question: L("Uchta harfdan, takrorlash bilan, uch harfli shifr tuzilsa, nechta shifr chiqadi?", 'Если из трёх букв, с повторением, составлять трёхбуквенный шифр, сколько шифров получится?', 'If from three letters, with repetition, a three-letter code is formed, how many codes result?'),
        items: [
          { id: 'a', right: true, label: '27' },
          { id: 'b', label: '6', hint: L("Olti takrorlamasdan chiqadi, bu yerda takrorlash bor.", 'Шесть выходит без повторения, а здесь повторение есть.', 'Six comes out without repetition, but here there is repetition.') },
        ],
        solution: ['3·3·3', '27'],
      },
      {
        expr: <Row size="big" align="center">{'A, B, C'}</Row>,
        ok: L("Ha. Uch, ikki, bir, ketma-ket kamayadi.", 'Да. Три, два, один, убывает подряд.', 'Yes. Three, two, one, decreasing in a row.'),
        question: L("Uchta harfdan, takrorlamasdan, uch harfli shifr tuzilsa, nechta shifr chiqadi?", 'Если из трёх букв, без повторения, составлять трёхбуквенный шифр, сколько шифров получится?', 'If from three letters, without repetition, a three-letter code is formed, how many codes result?'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '27', hint: L("Yigirma yetti takrorlash bilan chiqadi, bu yerda takrorlash yo'q.", 'Двадцать семь выходит с повторением, а здесь повторения нет.', 'Twenty-seven comes out with repetition, but here there is none.') },
        ],
        solution: ['3·2·1', '6'],
      },
      {
        expr: <Row size="big" align="center">{'0, 1, 2, 3'}</Row>,
        ok: L("Ha. Birinchi raqam uch xil, ikkinchisi to'rt xil, o'n ikki chiqadi.", 'Да. Первая цифра три варианта, вторая четыре, выходит двенадцать.', 'Yes. The first digit has three options, the second four, giving twelve.'),
        question: L("Shu to'rt raqamdan ikki xonali son tuzilsa, birinchi raqam nolga teng bo'lmasa, nechta son chiqadi?", 'Если из этих четырёх цифр составить двузначное число, первая цифра не нуль, сколько чисел получится?', 'If a two-digit number is formed from these four digits, with the first digit not zero, how many numbers result?'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '16', hint: L("Birinchi raqam nolga teng bo'lmaydi, shuning uchun to'rt emas, uch xil.", 'Первая цифра не может быть нулём, поэтому вариантов не четыре, а три.', 'The first digit cannot be zero, so there are three options, not four.') },
        ],
        solution: ['3·4', '12'],
      },
      {
        expr: <Row size="big" align="center">{'4, 5, 8'}</Row>,
        ok: L("Ha. Har uch o'rinda ham uch raqamdan biri, uch marta ko'paytirilgan.", 'Да. На каждом из трёх мест любая из трёх цифр, перемножено трижды.', 'Yes. At each of the three positions, any of the three digits, multiplied three times.'),
        question: L("Shu raqamlardan, takrorlash bilan, uch xonali son tuzilsa, nechta son chiqadi?", 'Если из этих цифр, с повторением, составить трёхзначное число, сколько чисел получится?', 'If a three-digit number is formed from these digits, with repetition, how many numbers result?'),
        items: [
          { id: 'a', right: true, label: '27' },
          { id: 'b', label: '9', hint: L("To'qqiz ikki xonali son uchun chiqadi, bu yerda uch xonali.", 'Девять выходит для двузначного числа, а здесь трёхзначное.', 'Nine comes out for a two-digit number, but here it is three-digit.') },
        ],
        solution: ['3·3·3', '27'],
      },
      {
        expr: <Row size="big" align="center">{'2, 3, 2'}</Row>,
        ok: L("Ha. Ikki, uch va ikki ketma-ket ko'paytiriladi, o'n ikki chiqadi.", 'Да. Два, три и два перемножаются подряд, выходит двенадцать.', 'Yes. Two, three, and two are multiplied in a row, giving twelve.'),
        question: L("Ikki sho'rva turi, uch asosiy taom, ikki shirinlikdan nechta ovqat to'plami tuzish mumkin?", 'Сколько наборов еды можно составить из двух видов супа, трёх основных блюд и двух десертов?', 'How many meal sets can be made from two soup types, three main dishes, and two desserts?'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '7', hint: L("Ikki qo'shilgan uch, ikki yetti beradi, lekin bu uchtasi BIRGALIKDA tanlanadi, ko'paytirish kerak.", 'Два плюс три плюс два дают семь, но эти три блюда выбираются ВМЕСТЕ, нужно умножение.', 'Two plus three plus two gives seven, but these three dishes are chosen TOGETHER, multiplication is needed.') },
        ],
        solution: ['2·3·2', '12'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): ko'paytirish qoidasini
// qo'llash, ketma-ket bosqichlar.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ko'paytirish qoidasini qo'llang",
    'Примени правило умножения',
    'Apply the multiplication rule',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida ketma-ket bosqichlar bor.",
      'Три задания. В каждом есть последовательные шаги.',
      'Three tasks. Each has sequential steps.'),
    A('why',
      "Bosqichlar soni nechta bo'lsa, shuncha son ko'paytiriladi.",
      'Сколько шагов, столько чисел перемножается.',
      'As many steps as there are, that many numbers are multiplied.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar bosqichlar to'g'ri ko'paytirilgan.",
      'Все три разобраны. Каждый раз шаги верно перемножались.',
      'All three are done. Each time the steps were correctly multiplied.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3, 5'}</Row>,
        ok: L("Ha. Uch besh marta ko'paytirilib, o'n besh chiqadi.", 'Да. Три умножено на пять, выходит пятнадцать.', 'Yes. Three multiplied by five, giving fifteen.'),
        question: L("A dan B ga uch, B dan C ga besh usul bo'lsa, A dan C ga necha usul bor?", 'Если от A до B три способа, а от B до C пять, сколько способов от A до C?', 'If there are three ways from A to B, and five from B to C, how many ways from A to C?'),
        items: [
          { id: 'a', right: true, label: '15' },
          { id: 'b', label: '8', hint: L("Sakkiz uch bilan beshning yig'indisi, lekin bosqichlar ketma-ket, ko'paytirish kerak.", 'Восемь это сумма трёх и пяти, но шаги последовательны, нужно умножение.', 'Eight is the sum of three and five, but the steps are sequential, multiplication is needed.') },
        ],
        solution: ['3·5', '15'],
      },
      {
        expr: <Row size="big" align="center">{'3, 4'}</Row>,
        ok: L("Ha. Uch to'rt marta ko'paytirilib, o'n ikki chiqadi.", 'Да. Три умножено на четыре, выходит двенадцать.', 'Yes. Three multiplied by four, giving twelve.'),
        question: L("Uch ko'ylak, to'rt shim bo'lsa, nechta kiyim kombinatsiyasi tuzish mumkin?", 'Если есть три рубашки и четыре пары брюк, сколько комбинаций одежды можно составить?', 'If there are three shirts and four pairs of trousers, how many outfit combinations can be made?'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '7', hint: L("Bu yig'indi, lekin ko'ylak va shim birgalikda tanlanadi.", 'Это сумма, но рубашка и брюки выбираются вместе.', 'That is a sum, but the shirt and trousers are chosen together.') },
        ],
        solution: ['3·4', '12'],
      },
      {
        expr: <Row size="big" align="center">{'5, 2'}</Row>,
        ok: L("Ha. Besh ikki marta ko'paytirilib, o'n chiqadi.", 'Да. Пять умножено на два, выходит десять.', 'Yes. Five multiplied by two, giving ten.'),
        question: L("Bir shahardan ikkinchisiga besh yo'l, undan uchinchisiga ikki yo'l bo'lsa, birinchisidan uchinchisiga necha usul bor?", 'Если от первого города до второго пять дорог, а от второго до третьего две, сколько способов от первого до третьего?', 'If there are five roads from the first city to the second, and two from the second to the third, how many ways from the first to the third?'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '7', hint: L("Bu yig'indi, lekin bosqichlar ketma-ket, ko'paytirish kerak.", 'Это сумма, но шаги последовательны, нужно умножение.', 'That is a sum, but the steps are sequential, multiplication is needed.') },
        ],
        solution: ['5·2', '10'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): "Makro" misolini
// son bilan tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "\"Makro\" misolini son bilan tekshiring",
    'Проверь пример «Макро» вычислением',
    'Check the "Makro" example by computation',
  ),
  audio: [
    A('mount',
      "Uch juftlik bor, piyola-taqsimcha, piyola-qoshiq, taqsimcha-qoshiq.",
      'Есть три пары, пиала-тарелочка, пиала-ложка, тарелочка-ложка.',
      'There are three pairs, bowl-plate, bowl-spoon, plate-spoon.'),
    A('why',
      "Har juftlik alohida ko'paytiriladi, keyin uchtasi qo'shiladi.",
      'Каждая пара перемножается отдельно, потом все три складываются.',
      'Each pair is multiplied separately, then the three are added.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ko'paytirish, keyin qo'shish tekshirilgan.",
      'Все три разобраны. Каждый раз проверялось умножение, затем сложение.',
      'All three are done. Each time the multiplication, then the addition, was checked.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'5, 6'}</Row>,
        ok: L("Ha. Besh olti marta ko'paytirilib, o'ttiz chiqadi.", 'Да. Пять умножено на шесть, выходит тридцать.', 'Yes. Five multiplied by six, giving thirty.'),
        question: L("Besh xil piyola va olti xil taqsimchadan bittadan tanlansa, juftlik nechta usulda tanlanadi?", 'Если выбрать по одному из пяти видов пиал и шести видов тарелочек, сколько способов выбрать пару?', 'If one is chosen from five bowl types and one from six plate types, how many ways to choose the pair?'),
        items: [
          { id: 'a', right: true, label: '30' },
          { id: 'b', label: '11', hint: L("O'n bir yig'indi, lekin ikkalasi birgalikda tanlanadi.", 'Одиннадцать это сумма, но оба предмета выбираются вместе.', 'Eleven is the sum, but both items are chosen together.') },
        ],
        solution: ['5·6', '30'],
      },
      {
        expr: <Row size="big" align="center">{'5·4,  6·4'}</Row>,
        ok: L("Ha. Yigirma qo'shilgan yigirma to'rt, qirq to'rt chiqadi.", 'Да. Двадцать плюс двадцать четыре, выходит сорок четыре.', 'Yes. Twenty plus twenty-four gives forty-four.'),
        question: L("Piyola-qoshiq va taqsimcha-qoshiq juftliklari birgalikda nechta usul beradi?", 'Сколько способов дают вместе пары пиала-ложка и тарелочка-ложка?', 'How many ways do the bowl-spoon and plate-spoon pairs give together?'),
        items: [
          { id: 'a', right: true, label: '44' },
          { id: 'b', label: '38', hint: L("Qaytadan hisoblang, yigirma va yigirma to'rtni qo'shing.", 'Посчитай снова, сложи двадцать и двадцать четыре.', 'Compute again, add twenty and twenty-four.') },
        ],
        solution: ['5·4+6·4', '20+24', '44'],
      },
      {
        expr: <Row size="big" align="center">{'30, 20, 24'}</Row>,
        ok: L("Ha. Uchtasi qo'shilib, yetmish to'rt chiqadi.", 'Да. Все три складываются, выходит семьдесят четыре.', 'Yes. All three add up to seventy-four.'),
        question: L("Barcha juftliklarning jami usullari qancha?", 'Каково общее число способов для всех пар?', 'What is the total number of ways for all the pairs?'),
        items: [
          { id: 'a', right: true, label: '74' },
          { id: 'b', label: '64', hint: L("Qaytadan qo'shing, bitta juftlik tushib qolgan.", 'Сложи снова, одна пара потерялась.', 'Add again, one pair was dropped.') },
        ],
        solution: ['30+20+24', '74'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): qo'shish ko'paytirish
// o'rniga ishlatilgan (З74) va takrorlanish chalkashtirilgan (З73).
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
      "Ikki topshiriq. Ikkalasida ham qoida noto'g'ri qo'llangan.",
      'Два задания. В обоих правило применено неверно.',
      'Two tasks. In both, the rule was applied incorrectly.'),
    A('why',
      "Ketma-ket bosqichlar ko'paytiriladi, va takrorlash bor-yo'qligi farq qiladi.",
      'Последовательные шаги перемножаются, и наличие повторения важно.',
      'Sequential steps are multiplied, and whether repetition exists matters.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham qoidani chalkashtirishdan kelib chiqqan.",
      'Обе разобраны. Обе ошибки возникли из-за путаницы в правиле.',
      'Both are done. Both mistakes came from confusing the rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'4, 3   →   4+3 = 7'}</Row>,
        ok: L("Ha. Bu ikki ketma-ket bosqich, ular ko'paytirilishi kerak edi, qo'shilmasligi.", 'Да. Это два последовательных шага, их нужно было умножить, а не сложить.', 'Yes. These are two sequential steps, they should have been multiplied, not added.'),
        question: L("Bir shahardan ikkinchisiga to'rt yo'l, undan uchinchisiga uch yo'l bo'lsa, va javob to'rt qo'shilgan uch deb yozilgan bo'lsa, bu yerda xato qayerda?", 'Если от первого города до второго четыре дороги, а от второго до третьего три, и ответ записан как четыре плюс три, в чём здесь ошибка?', 'If there are four roads from the first city to the second, and three from the second to the third, and the answer was written as four plus three, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ko'paytirish o'rniga qo'shish ishlatilgan", 'Вместо умножения использовано сложение', 'Addition was used instead of multiplication') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, ikki bosqich ko'paytirilishi kerak edi.", 'Это и есть показанная ошибка, два шага нужно было умножить.', 'This is the very mistake shown; the two steps should have been multiplied.') },
        ],
        solution: ['4·3', '12'],
      },
      {
        expr: <Row size="big" align="center">{'1,2,3   →   3·3·3 = 27'}</Row>,
        ok: L("Ha. Takrorlash yo'q, shuning uchun har bosqichda tanlov kamayadi, uch, ikki, bir bo'lishi kerak edi.", 'Да. Повторения нет, поэтому выбор на каждом шаге уменьшается, должно было быть три, два, один.', 'Yes. There is no repetition, so the choice shrinks at each step; it should have been three, two, one.'),
        question: L("1, 2, 3 raqamlaridan, takrorlamasdan, uch xonali son tuzilgan va javob uch marta o'ziga ko'paytirilgan uch deb hisoblangan bo'lsa, bu yerda xato qayerda?", 'Если из цифр 1, 2, 3, без повторения, составлено трёхзначное число, а ответ посчитан как три, умноженное на себя три раза, в чём здесь ошибка?', 'If a three-digit number is formed from the digits 1, 2, 3, without repetition, and the answer was computed as three multiplied by itself three times, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Takrorlanish yo'qligi hisobga olinmagan", 'Не учтено отсутствие повторения', 'The absence of repetition was not accounted for') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, takrorlash yo'q, tanlov kamayishi kerak edi.", 'Это и есть показанная ошибка, повторения нет, выбор должен был уменьшаться.', 'This is the very mistake shown; there is no repetition, the choice should have shrunk.') },
        ],
        solution: ['3·2·1', '6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (1-darsning `fill`): ko'paytirish qoidasini
// qadamlab qo'llash.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Ko'paytirish qoidasini qadamlab qo'llang",
    'Примени правило умножения по шагам',
    'Apply the multiplication rule step by step',
  ),
  audio: [
    A('mount',
      "Ikki bosqich berilgan. Avval har bosqichning usullar sonini, keyin ko'paytmani yozing.",
      'Даны два шага. Сначала запиши число способов каждого шага, потом произведение.',
      'Two steps are given. First write the number of ways of each step, then the product.'),
    A('why',
      "Bosqichlar ketma-ket bo'lgani uchun ko'paytiriladi.",
      'Так как шаги идут подряд, они перемножаются.',
      'Since the steps come one after another, they are multiplied.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar ikki bosqich to'g'ri ko'paytirilgan.",
      'Все три заполнены. Каждый раз два шага верно перемножались.',
      'All three are filled. Each time the two steps were correctly multiplied.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['4', '3', '12'],
      lines: [
        [{ t: '4, 3   →   ' }, { slot: '4' }, { t: ' · ' }, { slot: '3' }, { t: ' = ' }, { slot: '12' }],
      ],
    },
    tasks: [
      {
        chips: ['2', '5', '10'],
        lines: [
          [{ t: '2, 5   →   ' }, { slot: '2' }, { t: ' · ' }, { slot: '5' }, { t: ' = ' }, { slot: '10' }],
        ],
      },
      {
        chips: ['3', '3', '9'],
        lines: [
          [{ t: '3, 3   →   ' }, { slot: '3' }, { t: ' · ' }, { slot: '3' }, { t: ' = ' }, { slot: '9' }],
        ],
      },
      {
        chips: ['6', '4', '24'],
        lines: [
          [{ t: '6, 4   →   ' }, { slot: '6' }, { t: ' · ' }, { slot: '4' }, { t: ' = ' }, { slot: '24' }],
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
    "Kombinatorika bo'yicha to'rt savol",
    'Четыре вопроса о комбинаторике',
    'Four questions about combinatorics',
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
        id: 'q1', tag: 'З73',
        ask: L('1, 2 raqamlaridan, takrorlash bilan, nechta ikki xonali son tuzish mumkin?', 'Сколько двузначных чисел с повторением можно составить из цифр 1, 2?', 'How many two-digit numbers with repetition can be made from the digits 1, 2?'),
        options: [
          { id: 'ok', right: true, label: '4' },
          { id: 'two', label: '2' },
        ],
        hint: L("Ikki, ikkiga ko'paytirilib, to'rt chiqadi.", 'Два умножено на два, выходит четыре.', 'Two multiplied by two gives four.'),
        ok: L("To'g'ri, ikki, ikkiga ko'paytirilib, to'rt chiqadi.", 'Верно, два умножено на два, выходит четыре.', 'Correct, two multiplied by two gives four.'),
      },
      {
        id: 'q2', tag: 'З74',
        ask: L('A dan B ga 2 usul, B dan C ga 3 usul bo\'lsa, A dan C ga necha usul bor?', 'Если от A до B два способа, а от B до C три, сколько способов от A до C?', 'If there are two ways from A to B, and three from B to C, how many ways are there from A to C?'),
        options: [
          { id: 'ok', right: true, label: '6' },
          { id: 'no', label: '5' },
        ],
        hint: L("Ikki uch marta ko'paytiriladi, chunki bosqichlar ketma-ket.", 'Два умножается на три, потому что шаги последовательны.', 'Two is multiplied by three, because the steps are sequential.'),
        ok: L("To'g'ri, ikki ko'paytirilgan uch, olti beradi.", 'Верно, два, умноженное на три, даёт шесть.', 'Correct, two times three gives six.'),
      },
      {
        id: 'q3', tag: 'З73',
        ask: L('1, 2, 3 raqamlaridan, TAKRORLAMASDAN, uch xonali son nechta?', 'Сколько трёхзначных чисел из 1, 2, 3 БЕЗ повторения?', 'How many three-digit numbers from 1, 2, 3 WITHOUT repetition?'),
        options: [
          { id: 'ok', right: true, label: '6' },
          { id: 'no', label: '27' },
        ],
        hint: L("Uch, ikki, bir, ketma-ket kamayadi.", 'Три, два, один, убывает подряд.', 'Three, two, one, decreasing in a row.'),
        ok: L("To'g'ri, uch ikki bir ko'paytirilib, olti chiqadi.", 'Верно, три, два, один, при умножении дают шесть.', 'Correct, three, two, one, multiplied give six.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('4 ko\'paytirilgan 3, 12ga tengmi?', 'Верно ли, что 4, умноженное на 3, равно 12?', 'Is it true that 4 times 3 equals 12?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, natija o'n ikki chiqadi.", 'Посчитай, результат выйдет двенадцать.', 'Compute it, the result is twelve.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З74',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Uch ko'ylak, besh shim uchun kombinatsiyalar sonini yig'ing.",
            'Собери число комбинаций для трёх рубашек и пяти брюк.',
            'Assemble the number of combinations for three shirts and five trousers.',
          ),
          lines: [
            [{ t: '3, 5   →   ' }, { slot: '3' }, { t: ' · ' }, { slot: '5' }, { t: ' = ' }, { slot: '15' }],
          ],
          tiles: [
            { id: 't1', v: '3', x: 12, y: 12 },
            { id: 't2', v: '5', x: 55, y: 14 },
            { id: 't3', v: '15', x: 40, y: 50 },
            { id: 't4', v: '8', x: 78, y: 48 },
          ],
          hint: L(
            "Uch va besh ketma-ket bosqichlar, ko'paytirilishi kerak, sakkiz esa yig'indi.",
            'Три и пять, последовательные шаги, нужно умножить, а восемь это сумма.',
            'Three and five are sequential steps, they must be multiplied; eight is the sum.',
          ),
          doneNote: L(
            "Yig'ildi. Ikki bosqich ko'paytirilib, kombinatsiyalar soni topildi.",
            'Собрано. Два шага перемножены, найдено число комбинаций.',
            'Assembled. The two steps were multiplied, the number of combinations found.',
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
    "Ketma-ket bosqichlar ko'paytiriladi, alternativ yo'llar qo'shiladi",
    'Последовательные шаги перемножаются, альтернативные пути складываются',
    'Sequential steps are multiplied, alternative paths are added',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. To'rt yo'l uch yo'lga ko'paytirilib, o'n ikki chiqadi.",
      'С урока остаётся одна запись. Четыре дороги умножаются на три, выходит двенадцать.',
      'One record stays with you. Four roads multiplied by three, giving twelve.'),
    A('s1',
      "Bugun uch narsa qilindi. Yo'llar sonini burdingiz, daraxt qurdingiz va takrorlash bor-yo'qligini ajratib bilishni o'rgandingiz.",
      'Сегодня сделано три вещи. Ты крутил число дорог, строил дерево и научился отличать наличие повторения.',
      'Three things are done today. You turned the number of roads, built a tree, and learned to tell whether repetition exists.'),
    A('s2',
      "Sekkiz sinf algebra qismi shu bilan yakunlandi. Endi geometriya davom etadi.",
      'На этом алгебраическая часть восьмого класса завершена. Далее продолжается геометрия.',
      'With this, the algebra part of the eighth grade is complete. Geometry continues next.',
    ),
  ],
  props: {
    mark: '4 · 3 = 12',
    markNote: L(
      "Samarqand-Toshkent-Xo'jakent",
      'Самарканд-Ташкент-Ходжакент',
      'Samarkand-Tashkent-Khodjakent',
    ),
    lines: [
      L(
        "Barcha holatlarni bittasini ham qoldirmay sanash usuli tanlash usuli deyiladi",
        'Способ пересчитать все случаи, не пропустив ни одного, называется методом перебора',
        'The way of counting all the cases without missing any is called the enumeration method',
      ),
      L(
        "A dan B ga m usul, B dan C ga n usul bo'lsa, A dan C ga m ko'paytirilgan n usuli bor",
        'Если от A до B m способов, а от B до C n способов, то от A до C, m умноженное на n, способов',
        'If there are m ways from A to B, and n from B to C, then there are m times n ways from A to C',
      ),
      L(
        "Bir yo'l tanlanadigan holatlar qo'shiladi, ketma-ket bosqichlar ko'paytiriladi",
        'Случаи с выбором одного пути складываются, последовательные шаги перемножаются',
        'Cases choosing one path are added, sequential steps are multiplied',
      ),
    ],
    bridge: L(
      "Algebra qismi tugadi, keyingi darslarda geometriya",
      'Часть алгебры завершена, далее уроки геометрии',
      'The algebra part is complete, geometry lessons follow',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya, 1-darsning asboblari,
// bitta pozitsiya (5-ekran), DARAXT SHOXLARI (`treebuild`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З74', 'З73', 'З73',
    'З73', 'З74', 'З74', 'З73', 'З74',
    'З16', 'З74', 'З74', null, null,
  ],
  mechanic: { at: 5, tool: 'treebuild' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
