// ============================================================================
// 9-sinf, Dars 9. TENGLAMALAR SISTEMASI.
//
// REDAKSIYA 1, 2026-08-27. Darslikdan: II bob «Sistemalar va tengsizliklar»,
// §13 «Ikkinchi darajali tenglama qatnashgan eng oddiy sistemalarni yechish»
// (68-69-bet). Ikki misol: 2-masala (69-bet) — x qo'shi y teng uch, x
// karra y teng minus o'n, Viyet teoremasi TESKARISI bilan yechiladi, bosh
// misol sifatida. 1-masala (68-69-bet) — to'g'ri burchakli uchburchak
// (gipotenuza va yuza masalasi), x kvadrat qo'shi y kvadrat berilganda
// TO'LIQ KVADRATGA KELTIRISH usuli, ikkinchi misol sifatida.
//
// PODXOD_9SINF.md §7 «Prибор 4»: «Системы (уроки 9–13) — тот же прибор
// с двумя уравнениями... графический способ (урок 10) подключает
// прибор 1». BU DARSDA: bosh texnika — Viyet teoremasi teskarisi —
// darslikning o'zida QADAMLAB YECHIM sifatida berilgan (klik-amal emas),
// shuning uchun RecallMC ning intro/steps qatlami ishlatildi (1-8-darsdan
// tanish). `Track` (ikki amal, ikkita tenglama) 11-12-darslarga
// (o'rniga qo'yish, qo'shish usuli) qoldirildi — ular darslikda AYNAN
// amal-baamal berilgan. Grafik usul (10-dars) `SignAxis`ning grafik
// qismini ishlatadi.
//
// TEGLAR (o'zining):
//   sistema-ikkala-tenglama    — javob faqat bitta tenglamani
//                                qanoatlantirsa yetarli deb o'ylash
//   juftlik-tartib-farqi       — (5;−2) va (−2;5) bir xil javob deb
//                                o'ylash, tartib ahamiyatsiz deb hisoblash
//   vieta-teskari-notogri      — yig'indi va ko'paytmani almashtirib
//                                qo'yish yoki ishorada xato
//   kvadratni-tuldirish-esdan-chiqarish — x kvadrat qo'shi y kvadrat
//                                berilganda ikki xy qo'shishni unutish
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-09',
  n: 9,
  row: 9,
  block: 'Б2',
  topic: L('Tenglamalar sistemasi', 'Система уравнений', 'Systems of equations'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Tenglamalar sistemasining yechimi — ikkala tenglamani ham bir vaqtda qanoatlantiradigan (x; y) juftligi",
    'Решением системы уравнений называют пару (x; y), которая удовлетворяет обоим уравнениям одновременно',
    'A solution of a system of equations is a pair (x; y) that satisfies both equations at the same time',
  ),
  L(
    "Agar x qo'shi y va x karra y ma'lum bo'lsa, x va y sonlari z kvadrat minus, yig'indi karra z, qo'shi ko'paytma, teng nol tenglamaning ildizlaridir (Viyet teoremasi teskarisi)",
    'Если известны x плюс y и x, умноженное на y, то x и y являются корнями уравнения z в квадрате минус сумма, умноженная на z, плюс произведение, равно нулю (теорема, обратная теореме Виета)',
    'If x plus y and x times y are known, then x and y are the roots of the equation z squared minus the sum times z plus the product equals zero (the converse of Vieta\'s theorem)',
  ),
  L(
    "X kvadrat qo'shi y kvadrat berilganda, ikki karra x y qo'shilsa, x qo'shi y butun kvadratga keltiriladi",
    'Если даны x в квадрате плюс y в квадрате, добавление двух x y приводит к полному квадрату x плюс y',
    'If x squared plus y squared are given, adding two x y leads to the complete square of x plus y',
  ),
]

export const MISS = {
  'sistema-ikkala-tenglama': {
    what: L(
      "javob faqat bitta tenglamani qanoatlantirsa yetarli deb o'ylandi",
      'предполагалось, что достаточно, если ответ удовлетворяет только одному уравнению',
      'it was assumed that it is enough for the answer to satisfy only one equation',
    ),
    wrong: null,
    at: 0,
  },
  'juftlik-tartib-farqi': {
    what: L(
      "(besh; minus ikki) va (minus ikki; besh) bir xil javob deb hisoblandi",
      'пара (пять; минус два) и (минус два; пять) приняты за один и тот же ответ',
      'the pair (five; minus two) and (minus two; five) were taken as the same answer',
    ),
    wrong: null,
    at: 0,
  },
  'vieta-teskari-notogri': {
    what: L(
      "yig'indi va ko'paytma formulaga almashtirib qo'yildi yoki ishorada xato qilindi",
      'сумма и произведение перепутаны местами в формуле или допущена ошибка в знаке',
      'the sum and product were swapped in the formula, or a sign mistake was made',
    ),
    wrong: null,
    at: 0,
  },
  'kvadratni-tuldirish-esdan-chiqarish': {
    what: L(
      "x kvadrat qo'shi y kvadratni to'liq kvadratga keltirishda ikki xy qo'shish unutildi",
      'при приведении x в квадрате плюс y в квадрате к полному квадрату забыли прибавить два x y',
      'when reducing x squared plus y squared to a complete square, adding two x y was forgotten',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('IKKALASI HAM', 'ОБА СРАЗУ', 'BOTH AT ONCE'),
  title: L(
    "Bitta javob ikkala tenglamaga ham mos kelishi kerak",
    'Один ответ должен подходить сразу обоим уравнениям',
    'One answer must fit both equations at once',
  ),
  audio: [
    A('mount',
      "Ikkita tenglama birga berilgan: x qo'shi y teng uch, va x karra y teng minus o'n.",
      'Даны сразу два уравнения: x плюс y равно трём, и x, умноженное на y, равно минус десяти.',
      'Two equations are given together: x plus y equals three, and x times y equals minus ten.'),
    A('why',
      "Besh va minus ikki sonlarini oling. Ular ikkala tenglamani ham qanoatlantiradimi, yoki faqat bittasini?",
      'Возьми числа пять и минус два. Удовлетворяют ли они обоим уравнениям, или только одному?',
      'Take the numbers five and minus two. Do they satisfy both equations, or only one?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Besh va minus ikki: ular ikkala tenglamani ham qanoatlantiradimi?",
      'Пять и минус два: удовлетворяют ли они обоим уравнениям?',
      'Five and minus two: do they satisfy both equations?',
    ),
    items: [
      { id: 'right', right: true, show: L('Ha, ikkalasini ham', 'Да, обоим', 'Yes, both') },
      {
        id: 'wrong',
        show: L("Faqat birinchisini: besh qo'shi minus ikki uch", 'Только первому: пять плюс минус два равно трём', 'Only the first: five plus minus two equals three'),
        hint: L(
          "Ikkinchisini ham tekshiring: besh karra minus ikki, minus o'n. U ham to'g'ri chiqadi.",
          'Проверь и второе: пять, умноженное на минус два, минус десять. Оно тоже верно.',
          'Check the second one too: five times minus two, minus ten. It also comes out right.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Ikkalasi ham bajariladi. Sistema yechimi aynan shunday: ikkala tenglamaga ham mos keladigan juftlik.",
      'Верно. Выполняются оба. Решение системы это именно такая пара, подходящая обоим уравнениям.',
      'Correct. Both hold. The solution of a system is exactly such a pair, fitting both equations.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — Viyet teoremasi (8-sinfdan tanish).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Viyet teoremasini eslash",
    'Вспоминаем теорему Виета',
    "Recalling Vieta's theorem",
  ),
  audio: [
    A('mount',
      "8-sinfdan savol: z kvadrat minus yetti z qo'shi o'n ikki tenglamasining ildizlari uch va to'rt.",
      'Вопрос с 8 класса: корни уравнения z в квадрате минус семь z плюс двенадцать это три и четыре.',
      'A question from grade 8: the roots of z squared minus seven z plus twelve are three and four.'),
    A('why',
      "Ildizlarning yig'indisi va ko'paytmasini formuladagi sonlar bilan solishtiring.",
      'Сравни сумму и произведение корней с числами в формуле.',
      'Compare the sum and product of the roots with the numbers in the formula.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('z² − 7z + 12 = 0,  z1 = 3,  z2 = 4', 'z² − 7z + 12 = 0,  z1 = 3,  z2 = 4', 'z² − 7z + 12 = 0,  z1 = 3,  z2 = 4')}
      steps={[
        { id: 'sum', head: 'z1 + z2', lines: ['3 + 4 = 7'] },
        { id: 'prod', head: 'z1 · z2', lines: ['3 · 4 = 12'] },
      ]}
      ask={L(
        "Ildizlarning yig'indisi va ko'paytmasi formuladagi qaysi sonlarga teng chiqdi?",
        'Чему оказались равны сумма и произведение корней среди чисел формулы?',
        'What did the sum and product of the roots turn out to equal among the numbers in the formula?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Yigindi yettiga, ko'paytma o'n ikkiga", 'Сумма семи, произведение двенадцати', 'The sum to seven, the product to twelve'),
        },
        {
          id: 'wrong',
          label: L("Yigindi o'n ikkiga, ko'paytma yettiga", 'Сумма двенадцати, произведение семи', 'The sum to twelve, the product to seven'),
          hint: L(
            "Qayta hisoblang: uch qo'shi to'rt yetti beradi, uch karra to'rt esa o'n ikki beradi.",
            'Пересчитай: три плюс четыре даёт семь, а три, умноженное на четыре, даёт двенадцать.',
            'Recompute: three plus four gives seven, and three times four gives twelve.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Yig'indi formuladagi yettiga, ko'paytma o'n ikkiga teng chiqdi. Bugun buni teskari tomondan ishlatamiz.",
        'Верно. Сумма равна семи, произведение двенадцати, как в формуле. Сегодня используем это в обратную сторону.',
        "Correct. The sum equals seven, the product equals twelve, as in the formula. Today we use this in reverse.",
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — BOSH MISOL: x+y=3, xy=−10.
// ============================================================
const S3 = {
  eyebrow: L('TESKARI YO\'L', 'ОБРАТНЫЙ ПУТЬ', 'THE REVERSE PATH'),
  title: L(
    "Yig'indi va ko'paytmadan tenglamaga",
    'От суммы и произведения к уравнению',
    'From the sum and product to an equation',
  ),
  audio: [
    A('mount',
      "Sistema: x qo'shi y teng uch, x karra y teng minus o'n. Bu aynan yig'indi va ko'paytma berilgan holat.",
      'Система: x плюс y равно трём, x, умноженное на y, равно минус десяти. Это как раз случай, когда даны сумма и произведение.',
      'A system: x plus y equals three, x times y equals minus ten. This is exactly the case where the sum and product are given.'),
    W('solve',
      "Viyet teoremasi teskarisi bo'yicha x va y soni z kvadrat minus uch z minus o'n tenglamasining ildizlari.",
      'По теореме, обратной теореме Виета, числа x и y это корни уравнения z в квадрате минус три z минус десять.',
      'By the converse of Vieta\'s theorem, the numbers x and y are the roots of z squared minus three z minus ten.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x + y = 3,  xy = −10', 'x + y = 3,  xy = −10', 'x + y = 3,  xy = −10')}
      steps={[
        { id: 'eq', head: 'z²', lines: ['z² − 3z − 10 = 0'] },
        { id: 'roots', head: 'z', lines: ['(z − 5)(z + 2) = 0', 'z1 = 5,  z2 = −2'] },
      ]}
      ask={L(
        "X va y sonlari qaysi ikkita qiymatni olishi mumkin?",
        'Какие два значения могут принимать числа x и y?',
        'What two values can the numbers x and y take?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '5  ·  −2' },
        {
          id: 'wrong',
          label: '3  ·  −10',
          hint: L(
            "Uch va minus o'n bu formulaga qo'yilgan sonlar, ildizlarning o'zi emas. Tenglamani yechish kerak: z minus besh, qavs, z qo'shi ikki, teng nol.",
            'Три и минус десять это числа, подставленные в формулу, а не сами корни. Нужно решить уравнение: z минус пять, скобка, z плюс два, равно нулю.',
            'Three and minus ten are the numbers substituted into the formula, not the roots themselves. The equation must be solved: z minus five, bracket, z plus two, equals zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. X va y besh va minus ikki qiymatlarini oladi, lekin qaysi biri x, qaysi biri y, buni hali aniqlash kerak.",
        'Верно. x и y принимают значения пять и минус два, но какое из них x, а какое y, ещё предстоит определить.',
        'Correct. x and y take the values five and minus two, but which one is x and which is y is still to be determined.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — IKKALA JUFTLIKNI HAM TEKSHIRISH.
// ============================================================
const S4 = {
  eyebrow: L('TEKSHIRISH', 'ПРОВЕРКА', 'VERIFICATION'),
  title: L(
    "Ikkala juftlikni ham asl sistemaga qo'yamiz",
    'Подставляем обе пары в исходную систему',
    'We substitute both pairs into the original system',
  ),
  audio: [
    A('mount',
      "Besh va minus ikki sonlaridan ikki xil juftlik yasash mumkin: x besh, y minus ikki, yoki x minus ikki, y besh.",
      'Из чисел пять и минус два можно составить две разные пары: x пять, y минус два, или x минус два, y пять.',
      'From the numbers five and minus two, two different pairs can be made: x five, y minus two, or x minus two, y five.'),
    A('why',
      "Ikkalasini ham asl sistemaga qo'yib ko'ring: ikkalasi ham ishlaydimi?",
      'Подставь обе в исходную систему: обе ли работают?',
      'Substitute both into the original system: do both work?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x + y = 3,  xy = −10', 'x + y = 3,  xy = −10', 'x + y = 3,  xy = −10')}
      steps={[
        { id: 'p1', head: '(5; −2)', lines: ['5 + (−2) = 3', '5 · (−2) = −10'] },
        { id: 'p2', head: '(−2; 5)', lines: ['−2 + 5 = 3', '−2 · 5 = −10'] },
      ]}
      ask={L(
        "Ikkala juftlik ham sistemaga mos keladimi?",
        'Обе пары подходят системе?',
        'Do both pairs fit the system?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Ha, ikkalasi ham to'g'ri javob", 'Да, обе верные ответы', 'Yes, both are correct answers') },
        {
          id: 'wrong',
          label: L("Yo'q, faqat bittasi to'g'ri", 'Нет, верна только одна', 'No, only one is correct'),
          hint: L(
            "Ikkalasini ham hisoblang: ikkalasida ham yig'indi uch, ko'paytma minus o'n chiqadi.",
            'Посчитай обе: в обеих сумма получается три, произведение минус десять.',
            'Compute both: in both, the sum comes out three, the product minus ten.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Sistemaning ikkita yechimi bor: besh, minus ikki va minus ikki, besh, bular ikkita HAR XIL juftlik.",
        'Верно. У системы два решения: пять, минус два и минус два, пять, это две РАЗНЫЕ пары.',
        'Correct. The system has two solutions: five, minus two and minus two, five, these are two DIFFERENT pairs.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — TARTIB MUHIM: (5;−2) ≠ (−2;5) DEB QARASH.
// ============================================================
const S5 = {
  eyebrow: L('TARTIB MUHIM', 'ПОРЯДОК ВАЖЕН', 'ORDER MATTERS'),
  title: L(
    "Bir xil sonlar, ikki xil juftlik",
    'Одни и те же числа, две разные пары',
    'The same numbers, two different pairs',
  ),
  audio: [
    A('mount',
      "Besh va minus ikki sonlari ikkala juftlikda ham bor. Lekin (x; y) yozuvida birinchi o'rin x ga, ikkinchisi y ga tegishli.",
      'Числа пять и минус два есть в обеих парах. Но в записи (x; y) первое место принадлежит x, второе y.',
      'The numbers five and minus two are in both pairs. But in the notation (x; y) the first place belongs to x, the second to y.'),
    A('why',
      "X besh, y minus ikki bo'lishi bilan x minus ikki, y besh bo'lishi bir xil holat emas: ular boshqa-boshqa juftliklar.",
      'X равное пяти, y равное минус двум, и x равное минус двум, y равное пяти, это не одно и то же: это разные пары.',
      'x equal to five, y equal to minus two, and x equal to minus two, y equal to five are not the same thing: they are different pairs.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "(besh; minus ikki) va (minus ikki; besh) juftliklari bir xil javobmi?",
        'Пары (пять; минус два) и (минус два; пять) это один и тот же ответ?',
        'Are the pairs (five; minus two) and (minus two; five) the same answer?',
      )}
      cols={1}
      items={[
        { id: 'no', right: true, label: L("Yo'q, bular ikkita har xil juftlik", 'Нет, это две разные пары', 'No, these are two different pairs') },
        {
          id: 'yes',
          label: L("Ha, sonlar bir xil, demak javob ham bir xil", 'Да, числа одни и те же, значит и ответ один', 'Yes, the numbers are the same, so the answer is the same too'),
          hint: L(
            "Juftlikda tartib ahamiyatli: birinchi son x, ikkinchisi y. X besh bo'lishi bilan x minus ikki bo'lishi boshqa-boshqa holat.",
            'В паре важен порядок: первое число x, второе y. x равное пяти и x равное минус двум это разные случаи.',
            'Order matters in a pair: the first number is x, the second is y. x equal to five and x equal to minus two are different cases.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Sistemaning javobi ikkita: (besh; minus ikki) va (minus ikki; besh), ikkalasi ham yoziladi.",
        'Верно. У системы два ответа: (пять; минус два) и (минус два; пять), записываются оба.',
        'Correct. The system has two answers: (five; minus two) and (minus two; five), both are written down.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — TO'LIQ KVADRATGA KELTIRISH:
// x² + y² berilganda ikki xy qo'shish.
// ============================================================
const S6 = {
  eyebrow: L("TO'LIQ KVADRAT", 'ПОЛНЫЙ КВАДРАТ', 'THE COMPLETE SQUARE'),
  title: L(
    "X kvadrat qo'shi y kvadrat berilsa nima qilamiz",
    'Что делать, если даны x в квадрате плюс y в квадрате',
    'What to do when x squared plus y squared are given',
  ),
  audio: [
    A('mount',
      "Yangi sistema: x kvadrat qo'shi y kvadrat teng o'n uch, x karra y teng olti. Bu safar yig'indi to'g'ridan-to'g'ri berilmagan.",
      'Новая система: x в квадрате плюс y в квадрате равно тринадцати, x, умноженное на y, равно шести. На этот раз сумма не дана напрямую.',
      'A new system: x squared plus y squared equals thirteen, x times y equals six. This time the sum is not given directly.'),
    A('why',
      "X qo'shi y butun kvadratini eslang: u x kvadrat qo'shi ikki xy qo'shi y kvadratga teng. Demak ikki xy yetishmayapti.",
      'Вспомни полный квадрат x плюс y: он равен x в квадрате плюс два xy плюс y в квадрате. Значит не хватает двух xy.',
      'Recall the complete square of x plus y: it equals x squared plus two xy plus y squared. So two xy is missing.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x² + y² = 13,  xy = 6', 'x² + y² = 13,  xy = 6', 'x² + y² = 13,  xy = 6')}
      steps={[
        { id: 'add', head: '(x + y)²', lines: ['x² + 2xy + y² = 13 + 2 · 6', '(x + y)² = 25'] },
        { id: 'sum', head: 'x + y', lines: ['x + y = 5'] },
      ]}
      ask={L(
        "Nega ikki xy aynan olti bilan hisoblanadi, ko'paytmaning o'zi bilan emas?",
        'Почему два xy считается именно с шестью, а не с самим произведением?',
        'Why is two xy computed exactly with six, not with the product itself?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Xy allaqachon oltiga teng edi, shuning uchun ikki xy ikki karra olti", 'xy уже был равен шести, поэтому два xy это дважды шесть', 'xy was already equal to six, so two xy is twice six'),
        },
        {
          id: 'wrong',
          label: L("Ikki xy alohida, yangi son deb hisoblanadi", 'Два xy считается отдельным, новым числом', 'Two xy is counted as a separate, new number'),
          hint: L(
            "Sistemada xy olti ekani berilgan, shu sababli ikki xy ni hisoblash uchun oltini ikkiga ko'paytiramiz, yangi son o'ylab topmaymiz.",
            'В системе дано, что xy равен шести, поэтому для двух xy умножаем шесть на два, а не придумываем новое число.',
            'The system gives xy equal to six, so to compute two xy we multiply six by two, not invent a new number.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikki xy o'n ikkiga teng, o'n uchga qo'shilsa yigirma besh, demak x qo'shi y besh butun kvadratga teng, x qo'shi y besh.",
        'Верно. Два xy равно двенадцати, при сложении с тринадцатью даёт двадцать пять, значит x плюс y в квадрате равно двадцати пяти, x плюс y равно пяти.',
        'Correct. Two xy equals twelve, adding to thirteen gives twenty-five, so x plus y squared equals twenty-five, x plus y equals five.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — YAKUNLASH: x+y=5, xy=6 dan Viyet bilan.
// ============================================================
const S7 = {
  eyebrow: L('YAKUNLASH', 'ЗАВЕРШЕНИЕ', 'FINISHING UP'),
  title: L(
    "Endi tanish yo'l bilan yakunlaymiz",
    'Теперь завершаем знакомым путём',
    'Now we finish by a familiar path',
  ),
  audio: [
    A('mount',
      "X qo'shi y besh, x karra y olti topildi. Bu aynan 3-ekrandagi yo'l: yig'indi va ko'paytmadan tenglama tuziladi.",
      'Найдено: x плюс y равно пяти, x, умноженное на y, равно шести. Это точно путь с 3 экрана: из суммы и произведения строится уравнение.',
      'Found: x plus y equals five, x times y equals six. This is exactly the path from screen 3: an equation is built from the sum and product.'),
    W('recognize',
      "Bu tenglama sizga tanish: uni 6-darsda kvadrat tengsizlik uchun yechgan edingiz.",
      'Это уравнение тебе знакомо: ты решал его на 6 уроке для квадратного неравенства.',
      "This equation is familiar to you: you solved it in lesson 6 for a quadratic inequality."),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x + y = 5,  xy = 6', 'x + y = 5,  xy = 6', 'x + y = 5,  xy = 6')}
      steps={[
        { id: 'eq', head: 'z²', lines: ['z² − 5z + 6 = 0'] },
        { id: 'roots', head: 'z', lines: ['z1 = 2,  z2 = 3'] },
      ]}
      ask={L(
        "Bu masalada x va y uzunlik ekanini eslasak, javob qanday yoziladi?",
        'Если вспомнить, что x и y это длины, как записать ответ?',
        'Recalling that x and y are lengths, how is the answer written?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Katetlar: ikki va uch', 'Катеты: два и три', 'The legs: two and three') },
        {
          id: 'wrong',
          label: L("Faqat ikki, uch ortiqcha", 'Только два, тройка лишняя', 'Only two, three is extra'),
          hint: L(
            "Ikkala ildiz ham musbat va masala shartiga mos: ikkalasi ham katet uzunligi bo'la oladi, tartib faqat qaysi tomonni belgilaydi.",
            'Оба корня положительны и подходят условию задачи: оба могут быть длиной катета, порядок лишь указывает, какая это сторона.',
            'Both roots are positive and fit the problem: both can be a leg length, order only marks which side it is.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uchburchakning katetlari ikki sm va uch sm, xuddi darslikdagi javob kabi.",
        'Верно. Катеты треугольника два см и три см, точно как ответ в учебнике.',
        'Correct. The legs of the triangle are two cm and three cm, exactly like the answer in the textbook.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 8. QOIDA.
// ============================================================
const S8_RULE = {
  lines: [
    STATEMENTS[0],
    STATEMENTS[1],
    STATEMENTS[2],
  ],
  source: L(
    "Algebra 9, 13-§ (68-69-bet)",
    'Алгебра 9, §13 (стр. 68-69)',
    'Algebra 9, §13 (p. 68-69)',
  ),
}

function RuleScreen({ audio, onSolved, step, rule }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <RecallMC
        intro={L(
          "Avval savolga javob bering, keyin qoida ochiladi",
          'Сначала ответь на вопрос, потом откроется правило',
          'Answer the question first, then the rule opens',
        )}
        steps={[]}
        ask={L(
          "Yig'indi va ko'paytma to'g'ridan-to'g'ri berilmasa, birinchi qadam nima bo'ladi?",
          'Если сумма и произведение не даны напрямую, каким будет первый шаг?',
          'If the sum and product are not given directly, what is the first step?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Ularni topish: masalan x kvadrat qo'shi y kvadratni to'liq kvadratga keltirish", 'Найти их: например, привести x в квадрате плюс y в квадрате к полному квадрату', 'Find them: for example, reduce x squared plus y squared to a complete square'),
          },
          {
            id: 'wrong',
            label: L('Darrov Viyet formulasiga o\'tish', 'Сразу переходить к формуле Виета', "Go straight to Vieta's formula"),
            hint: L(
              "6-ekranni eslang: yig'indi to'g'ridan-to'g'ri berilmagan edi, uni topish uchun ikki xy qo'shilgan edi.",
              'Вспомни 6 экран: сумма не была дана напрямую, для её нахождения прибавили два xy.',
              'Recall screen 6: the sum was not given directly, two xy was added to find it.',
            ),
          },
        ]}
        after={L(
          "To'g'ri. Endi to'liq qoida.",
          'Верно. Теперь полное правило.',
          'Correct. Now the full rule.',
        )}
        audio={audio}
        onSolved={(r) => { setOpen(true); if (onSolved) onSolved(r) }}
        onStep={step}
      />
      <RuleCard
        title={t(L('QOIDA', 'ПРАВИЛО', 'RULE')) + ' · ' + t(rule.source)}
        lines={rule.lines.map((l) => t(l))}
        masked={!open}
        lockLabel={L(
          "Qoida to'g'ri javobdan keyin ochiladi",
          'Правило откроется после верного ответа',
          'The rule opens after a correct answer',
        )}
      />
    </>
  )
}

const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "Sistema yechimi va Viyet teoremasi teskarisi",
    'Решение системы и теорема, обратная теореме Виета',
    "The solution of a system and Vieta's converse",
  ),
  audio: [
    A('mount',
      "Olti ekranda siz ikkala tenglamani ham tekshirishni, tartibni va to'liq kvadratni o'z qo'lingiz bilan bajardingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам проверял оба уравнения, порядок и полный квадрат. Теперь они в виде правила.',
      'On six screens you checked both equations, the order, and the complete square with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchtasi ham darslikdan.",
      'Правило открылось. Все три из учебника.',
      'The rule is open. All three are from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: yig'indi-ko'paytmadan tenglama, to'rtta.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Tez tenglama tuzish",
    'Быстро строим уравнение',
    'Quickly building the equation',
  ),
  audio: [
    A('mount',
      "To'rtta sistema ketma-ket. Har birida yig'indi va ko'paytmadan z uchun tenglama tuzing.",
      'Четыре системы подряд. В каждой построй уравнение для z из суммы и произведения.',
      'Four systems in a row. In each, build the equation for z from the sum and product.'),
    A('why',
      "Formula bir xil: z kvadrat minus yig'indi karra z qo'shi ko'paytma teng nol.",
      'Формула одна: z в квадрате минус сумма, умноженная на z, плюс произведение равно нулю.',
      'The formula is the same: z squared minus the sum times z plus the product equals zero.'),
  ],
  props: {
    stepLabel: L('Sistema', 'Система', 'System'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham tuzildi. Har safar bir xil yo'l: yig'indi va ko'paytmani formulaga qo'yish.",
      'Все четыре построены. Каждый раз один путь: подставить сумму и произведение в формулу.',
      'All four are built. Same path every time: substitute the sum and product into the formula.',
    ),
    tasks: [
      {
        expr: 'x + y = 8,  xy = 15',
        question: L('Qaysi tenglama tuziladi?', 'Какое уравнение строится?', 'Which equation is built?'),
        ok: L("Ha. Yig'indi sakkiz, ko'paytma o'n besh, to'g'ridan-to'g'ri formulaga qo'yiladi.", 'Да. Сумма восемь, произведение пятнадцать, подставляются прямо в формулу.', 'Yes. The sum is eight, the product is fifteen, substituted directly into the formula.'),
        items: [
          { id: 'a', right: true, label: 'z² − 8z + 15 = 0' },
          { id: 'b', label: 'z² − 15z + 8 = 0', hint: L("Yig'indi va ko'paytma joyi almashtirilgan: yig'indi z oldida, ko'paytma oxirida turadi.", 'Сумма и произведение переставлены местами: сумма стоит перед z, произведение в конце.', 'The sum and product are swapped: the sum stands before z, the product at the end.') },
        ],
        solution: ['s = 8, p = 15', 'z² − 8z + 15 = 0'],
      },
      {
        expr: 'x + y = −4,  xy = 3',
        question: L('Qaysi tenglama tuziladi?', 'Какое уравнение строится?', 'Which equation is built?'),
        ok: L("Ha. Yig'indi minus to'rt, formulada minus yig'indi turadi: minus, minus to'rt, plyus to'rt z.", 'Да. Сумма минус четыре, в формуле стоит минус суммы: минус, минус четыре, плюс четыре z.', 'Yes. The sum is minus four, the formula has minus the sum: minus, minus four, plus four z.'),
        items: [
          { id: 'a', right: true, label: 'z² + 4z + 3 = 0' },
          { id: 'b', label: 'z² − 4z + 3 = 0', hint: L("Yig'indi manfiy ekanini hisobga oling: minus, minus to'rtning natijasi plyus to'rt z bo'ladi.", 'Учти, что сумма отрицательна: минус, минус четыре даёт плюс четыре z.', 'Account for the sum being negative: minus, minus four gives plus four z.') },
        ],
        solution: ['s = −4, p = 3', 'z² + 4z + 3 = 0'],
      },
      {
        expr: 'x + y = 6,  xy = −7',
        question: L('Qaysi tenglama tuziladi?', 'Какое уравнение строится?', 'Which equation is built?'),
        ok: L("Ha. Yig'indi olti, ko'paytma minus yetti, to'g'ridan-to'g'ri qo'yiladi.", 'Да. Сумма шесть, произведение минус семь, подставляются прямо.', 'Yes. The sum is six, the product is minus seven, substituted directly.'),
        items: [
          { id: 'a', right: true, label: 'z² − 6z − 7 = 0' },
          { id: 'b', label: 'z² − 6z + 7 = 0', hint: L("Ko'paytma manfiy ekanini unutmang: minus yetti formulaga o'z ishorasi bilan qo'yiladi.", 'Не забудь, что произведение отрицательно: минус семь подставляется со своим знаком.', 'Do not forget the product is negative: minus seven is substituted with its own sign.') },
        ],
        solution: ['s = 6, p = −7', 'z² − 6z − 7 = 0'],
      },
      {
        expr: 'x² + y² = 20,  xy = 8',
        question: L("Avval yig'indini toping: x qo'shi y nechiga teng?", 'Сначала найди сумму: чему равно x плюс y?', 'First find the sum: what does x plus y equal?'),
        ok: L("Ha. Ikki xy o'n olti, yigirmaga qo'shilsa o'ttiz olti, ildiz olti.", 'Да. Два xy шестнадцать, при сложении с двадцатью даёт тридцать шесть, корень шесть.', 'Yes. Two xy is sixteen, adding to twenty gives thirty-six, the root is six.'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '4', hint: L("Avval ikki xy ni hisoblang: ikki karra sakkiz, o'n olti. Keyin yigirmaga qo'shing.", 'Сначала посчитай два xy: два на восемь, шестнадцать. Потом прибавь к двадцати.', 'First compute two xy: two times eight, sixteen. Then add to twenty.') },
        ],
        solution: ['x² + 2xy + y² = 20 + 16', '(x + y)² = 36', 'x + y = 6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — YO'NALTIRILGAN: x+y=1, xy=−12 to'liq yechim.
// ============================================================
const S10 = {
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L(
    "To'liq yechim: uch qadam",
    'Полное решение: три шага',
    'A full solution: three steps',
  ),
  audio: [
    A('mount',
      "Bitta sistema, uch qadam. Yordam yo'q, lekin har javobdan keyin yechim ochiladi.",
      'Одна система, три шага. Помощи нет, но после каждого ответа откроется решение.',
      'One system, three steps. No help, but after each answer the solution opens.'),
    A('why',
      "Avval tenglamani tuzing, keyin ildizlarni toping, oxirida ikkita javobni yozing.",
      'Сначала построй уравнение, потом найди корни, в конце запиши два ответа.',
      'First build the equation, then find the roots, finally write two answers.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uch qadam ham to'ldi: tenglama tuzildi, ildizlar topildi, ikkita javob yozildi.",
      'Все три шага пройдены: уравнение построено, корни найдены, записаны два ответа.',
      'All three steps are done: the equation is built, the roots are found, two answers are written.',
    ),
    tasks: [
      {
        expr: 'x + y = 1,  xy = −12',
        question: L('Qaysi tenglama tuziladi?', 'Какое уравнение строится?', 'Which equation is built?'),
        ok: L("Ha. Yig'indi bir, ko'paytma minus o'n ikki.", 'Да. Сумма один, произведение минус двенадцать.', 'Yes. The sum is one, the product is minus twelve.'),
        items: [
          { id: 'a', right: true, label: 'z² − z − 12 = 0' },
          { id: 'b', label: 'z² − z + 12 = 0', hint: L("Ko'paytma manfiy ekanini unutmang: minus o'n ikki o'z ishorasi bilan qo'yiladi.", 'Не забудь, что произведение отрицательно: минус двенадцать подставляется со знаком.', 'Do not forget the product is negative: minus twelve is substituted with its sign.') },
        ],
        solution: ['s = 1, p = −12', 'z² − z − 12 = 0'],
      },
      {
        expr: 'z² − z − 12 = 0',
        question: L('Ildizlar qanday?', 'Каковы корни?', 'What are the roots?'),
        ok: L("Ha. Z minus to'rt, qavs, z qo'shi uch, teng nol: to'rt va minus uch.", 'Да. z минус четыре, скобка, z плюс три, равно нулю: четыре и минус три.', 'Yes. z minus four, bracket, z plus three, equals zero: four and minus three.'),
        items: [
          { id: 'a', right: true, label: '4  ·  −3' },
          { id: 'b', label: '−4  ·  3', hint: L("Ko'paytuvchilarni tekshiring: to'rt karra minus uch minus o'n ikki beradi, to'rt qo'shi minus uch bir beradi.", 'Проверь множители: четыре на минус три даёт минус двенадцать, четыре плюс минус три даёт один.', 'Check the factors: four times minus three gives minus twelve, four plus minus three gives one.') },
        ],
        solution: ['(z − 4)(z + 3) = 0', 'z1 = 4,  z2 = −3'],
      },
      {
        expr: 'x + y = 1,  xy = −12',
        question: L("Sistemaning ikkita javobi qanday yoziladi?", 'Как записать два ответа системы?', 'How are the two answers of the system written?'),
        ok: L("Ha. To'rt, minus uch va minus uch, to'rt.", 'Да. Четыре, минус три и минус три, четыре.', 'Yes. Four, minus three and minus three, four.'),
        items: [
          { id: 'a', right: true, label: '(4; −3)  ·  (−3; 4)' },
          { id: 'b', label: L("Faqat (4; −3)", 'Только (4; −3)', 'Only (4; −3)') },
        ],
        solution: [L('Ikkala tartib ham javob', 'Оба порядка это ответ', 'Both orders are answers'), L('(4; −3) va (−3; 4)', '(4; −3) и (−3; 4)', '(4; −3) and (−3; 4)')],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: tekshirish va tartib.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat hisob: tekshirish va tartib",
    'Только счёт: проверка и порядок',
    'Just computation: checking and order',
  ),
  audio: [
    A('mount',
      "Bu safar tenglama tuzilmaydi, faqat berilgan javobni tekshirasiz.",
      'На этот раз уравнение не строится, только проверяешь данный ответ.',
      'This time no equation is built, only the given answer is checked.'),
    A('why',
      "Har safar ikkala tenglamaga ham qo'yib ko'ring, ikkalasi ham to'g'ri chiqishi kerak.",
      'Каждый раз подставляй в оба уравнения, оба должны выйти верными.',
      'Each time substitute into both equations, both must come out true.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tekshirildi: javob faqat ikkala tenglamaga ham mos kelganda to'g'ri hisoblanadi.",
      'Все три проверены: ответ считается верным, только когда подходит обоим уравнениям.',
      'All three are checked: an answer counts as correct only when it fits both equations.',
    ),
    tasks: [
      {
        expr: 'x + y = 4,  xy = 3,  (1; 3)',
        question: L(
          "Taklif etilgan juftlik (bir; uch). Bu juftlik sistemaga mos keladimi?",
          'Предложенная пара (один; три). Эта пара подходит системе?',
          'The proposed pair is (one; three). Does this pair fit the system?',
        ),
        ok: L("Ha. Bir qo'shi uch to'rt, bir karra uch uch.", 'Да. Один плюс три четыре, один на три три.', 'Yes. One plus three is four, one times three is three.'),
        items: [
          { id: 'a', right: true, label: L('Ha, mos keladi', 'Да, подходит', 'Yes, it fits') },
          { id: 'b', label: L("Yo'q, mos kelmaydi", 'Нет, не подходит', 'No, it does not fit'), hint: L("Ikkala tenglamani ham hisoblang: bir qo'shi uch to'rt beradi, bir karra uch uch beradi, ikkalasi ham to'g'ri.", 'Посчитай оба уравнения: один плюс три даёт четыре, один на три даёт три, оба верны.', 'Compute both equations: one plus three gives four, one times three gives three, both correct.') },
        ],
        solution: ['1 + 3 = 4', '1 · 3 = 3', L('Mos keladi', 'Подходит', 'It fits')],
      },
      {
        expr: 'x + y = 4,  xy = 3,  (2; 2)',
        question: L(
          "Taklif etilgan juftlik (ikki; ikki). Bu juftlik sistemaga mos keladimi?",
          'Предложенная пара (два; два). Эта пара подходит системе?',
          'The proposed pair is (two; two). Does this pair fit the system?',
        ),
        ok: L("Yo'q. Yig'indi to'g'ri chiqadi, lekin ko'paytma to'rt bo'lib qoladi, uch emas.", 'Нет. Сумма верна, но произведение получается четыре, а не три.', 'No. The sum is correct, but the product comes out four, not three.'),
        items: [
          { id: 'a', label: L('Ha, mos keladi', 'Да, подходит', 'Yes, it fits') },
          { id: 'b', right: true, label: L("Yo'q, mos kelmaydi", 'Нет, не подходит', 'No, it does not fit') },
        ],
        solution: [L("2 + 2 = 4 (to'g'ri)", '2 + 2 = 4 (верно)', '2 + 2 = 4 (correct)'), L('2 · 2 = 4 (3 emas)', '2 · 2 = 4 (не 3)', '2 · 2 = 4 (not 3)'), L('Mos kelmaydi', 'Не подходит', 'It does not fit')],
      },
      {
        expr: 'x + y = 4,  xy = 3,  (3; 1)',
        question: L(
          "Taklif etilgan juftlik (uch; bir). Bu (bir; uch) bilan bir xil juftlikmi?",
          'Предложенная пара (три; один). Это та же пара, что и (один; три)?',
          'The proposed pair is (three; one). Is this the same pair as (one; three)?',
        ),
        ok: L("Yo'q. Tartib boshqa: bu ham to'g'ri, lekin (1;3) dan farqli, ikkinchi javob.", 'Нет. Порядок другой: это тоже верно, но, в отличие от (1;3), это второй ответ.', 'No. The order is different: this is also correct, but unlike (1;3), it is the second answer.'),
        items: [
          { id: 'a', label: L("Ha, bir xil", 'Да, та же самая', 'Yes, the same') },
          { id: 'b', right: true, label: L("Yo'q, ikkinchi, boshqa javob", 'Нет, второй, другой ответ', 'No, a second, different answer') },
        ],
        solution: ['3 + 1 = 4', '3 · 1 = 3', L("Mos keladi, lekin (1;3) dan boshqa juftlik", 'Подходит, но это пара, отличная от (1;3)', 'It fits, but it is a different pair from (1;3)')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Aziz sistemaning bitta yechimini yozib
// ikkinchisini unutgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Unutilgan ikkinchi javob",
    'Забытый второй ответ',
    'The forgotten second answer',
  ),
  audio: [
    A('mount',
      "Azizning yechimi. X qo'shi y teng olti, x karra y teng besh sistemasi uchun u faqat besh, bir javobini yozdi.",
      'Решение Азиза. Для системы x плюс y равно шести, x, умноженное на y, равно пяти, он записал только ответ пять, один.',
      "Aziz's solution. For the system x plus y equals six, x times y equals five, he wrote only the answer five, one."),
    A('why',
      "Tenglamaning ikkinchi ildizini toping va tekshiring: yana bir javob yo'qmi?",
      'Найди второй корень уравнения и проверь: нет ли ещё одного ответа?',
      'Find the second root of the equation and check: is there another answer?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kvadrat tenglamaning ikkita ildizi bor edi, ikkalasi ham juftlik beradi: javob ikkita, bittasi emas.",
      'У квадратного уравнения было два корня, оба дают пару: ответов два, а не один.',
      'The quadratic equation had two roots, both give a pair: there are two answers, not one.',
    ),
    tasks: [
      {
        expr: 'x + y = 6,  xy = 5',
        question: L(
          "Aziz faqat (5; 1) javobini yozdi. Tenglamaning ikkinchi ildizini toping: yana javob bormi?",
          'Азиз записал только ответ (5; 1). Найди второй корень уравнения: есть ли ещё ответ?',
          'Aziz wrote only the answer (5; 1). Find the second root of the equation: is there another answer?',
        ),
        ok: L(
          "Ha, bor. Z kvadrat minus olti z qo'shi besh tenglamasining ikkita ildizi bor: besh va bir. Demak ikkinchi javob ham bor: (bir; besh).",
          'Да, есть. У уравнения z в квадрате минус шесть z плюс пять два корня: пять и один. Значит есть и второй ответ: (один; пять).',
          'Yes, there is. The equation z squared minus six z plus five has two roots: five and one. So there is a second answer too: (one; five).',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Ha, (bir; besh) ham javob", 'Да, (один; пять) тоже ответ', 'Yes, (one; five) is also an answer'),
          },
          {
            id: 'b',
            label: L("Yo'q, (5; 1) yagona javob", 'Нет, (5; 1) единственный ответ', 'No, (5; 1) is the only answer'),
            hint: L("Tenglamani yeching: z kvadrat minus olti z qo'shi besh, ikkita ildizga ega, bittaga emas.", 'Реши уравнение: z в квадрате минус шесть z плюс пять имеет два корня, а не один.', 'Solve the equation: z squared minus six z plus five has two roots, not one.'),
          },
        ],
        solution: [
          'z² − 6z + 5 = 0',
          '(z − 5)(z − 1) = 0',
          L("To'liq javob: (5; 1) va (1; 5)", 'Полный ответ: (5; 1) и (1; 5)', 'Full answer: (5; 1) and (1; 5)'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ — javoblardan sistemaga.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Javoblardan sistemaga",
    'От ответов к системе',
    'From the answers to the system',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: ikkita javob berilgan, qaysi sistema shu javoblarni berishini siz tanlaysiz.",
      'На этот раз наоборот: даны два ответа, а какая система их даёт, выбираешь ты.',
      'This time it is the other way round: two answers are given, you choose which system gives them.'),
    A('why',
      "Har bir nomzodda yig'indi va ko'paytmani hisoblang, berilgan javoblarga mos kelishini tekshiring.",
      'В каждом кандидате посчитай сумму и произведение, проверь совпадение с данными ответами.',
      'In each candidate, compute the sum and product, check whether they match the given answers.',
    ),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: javoblardan orqaga qaytib, mos sistemani tanlash ham xuddi shu qoidaga tayanadi.",
      'Найдено: путь от ответов назад к системе опирается на то же самое правило.',
      'Found: going backward from the answers to the system relies on the same rule.',
    ),
    tasks: [
      {
        expr: '(4; 2)  ·  (2; 4)',
        question: L(
          "Javoblar (to'rt; ikki) va (ikki; to'rt). Qaysi sistema aynan shu ikki javobni beradi?",
          'Ответы (четыре; два) и (два; четыре). Какая система даёт именно эти два ответа?',
          'The answers are (four; two) and (two; four). Which system gives exactly these two answers?',
        ),
        ok: L("Ha. To'rt qo'shi ikki olti, to'rt karra ikki sakkiz.", 'Да. Четыре плюс два шесть, четыре на два восемь.', 'Yes. Four plus two is six, four times two is eight.'),
        items: [
          { id: 'a', right: true, label: 'x + y = 6,  xy = 8' },
          { id: 'b', label: 'x + y = 8,  xy = 6', hint: L("Yig'indi va ko'paytmani qayta hisoblang: to'rt qo'shi ikki olti beradi, sakkiz emas.", 'Пересчитай сумму и произведение: четыре плюс два даёт шесть, а не восемь.', 'Recompute the sum and product: four plus two gives six, not eight.') },
        ],
        solution: ['4 + 2 = 6', '4 · 2 = 8', 'x + y = 6,  xy = 8'],
      },
      {
        expr: '(−1; −6)  ·  (−6; −1)',
        question: L(
          "Javoblar (minus bir; minus olti) va (minus olti; minus bir). Qaysi sistema aynan shu ikki javobni beradi?",
          'Ответы (минус один; минус шесть) и (минус шесть; минус один). Какая система даёт именно эти два ответа?',
          'The answers are (minus one; minus six) and (minus six; minus one). Which system gives exactly these two answers?',
        ),
        ok: L("Ha. Minus bir qo'shi minus olti minus yetti, minus bir karra minus olti olti.", 'Да. Минус один плюс минус шесть минус семь, минус один на минус шесть шесть.', 'Yes. Minus one plus minus six is minus seven, minus one times minus six is six.'),
        items: [
          { id: 'a', right: true, label: 'x + y = −7,  xy = 6' },
          { id: 'b', label: 'x + y = 7,  xy = 6', hint: L("Ikkala son ham manfiy: ularning yig'indisi ham manfiy bo'lishi kerak, musbat emas.", 'Оба числа отрицательны: их сумма тоже должна быть отрицательной, а не положительной.', 'Both numbers are negative: their sum must also be negative, not positive.') },
        ],
        solution: ['−1 + (−6) = −7', '−1 · (−6) = 6', 'x + y = −7,  xy = 6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits: ikkala tenglama, tartib, Viyet",
    'Блиц: оба уравнения, порядок, Виет',
    'Blitz: both equations, order, Vieta',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular qoidani so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про правило, а не про долгий счёт.',
      'Four questions one after another. They ask about the rule, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'sistema-ikkala-tenglama',
        ask: L(
          "Bir juftlik faqat birinchi tenglamani qanoatlantirsa, u sistemaning yechimimi?",
          'Если пара удовлетворяет только первому уравнению, является ли она решением системы?',
          'If a pair satisfies only the first equation, is it a solution of the system?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Sistemaning yechimi ikkala tenglamani ham bir vaqtda qanoatlantirishi kerak.",
          'Верно. Решение системы обязано удовлетворять обоим уравнениям одновременно.',
          'Correct. A solution of the system must satisfy both equations at the same time.',
        ),
        hint: L(
          "1-ekranni eslang: besh va minus ikki sonlari ikkala tenglamani ham qanoatlantirgani uchun javob bo'ldi.",
          'Вспомни 1 экран: числа пять и минус два стали ответом именно потому, что удовлетворили обоим уравнениям.',
          'Recall screen 1: the numbers five and minus two became the answer exactly because they satisfied both equations.',
        ),
      },
      {
        id: 'q2',
        tag: 'juftlik-tartib-farqi',
        ask: L(
          "(uch; yetti) va (yetti; uch) bir xil juftlikmi?",
          'Пары (три; семь) и (семь; три) это одна и та же пара?',
          'Are the pairs (three; seven) and (seven; three) the same pair?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. (x; y) yozuvida tartib muhim, shuning uchun bular ikkita har xil juftlik.",
          'Верно. В записи (x; y) порядок важен, поэтому это две разные пары.',
          'Correct. In the notation (x; y) order matters, so these are two different pairs.',
        ),
        hint: L(
          "5-ekranni eslang: bir xil sonlar, lekin x va y joyi almashsa, boshqa juftlik hosil bo'ladi.",
          'Вспомни 5 экран: одни и те же числа, но при перемене мест x и y получается другая пара.',
          'Recall screen 5: the same numbers, but swapping the places of x and y gives a different pair.',
        ),
      },
      {
        id: 'q3',
        tag: 'vieta-teskari-notogri',
        ask: L(
          "X qo'shi y teng to'qqiz, x karra y teng yigirma. Z uchun tuzilgan tenglamada z oldida qaysi ishora turadi?",
          'x плюс y равно девяти, x на y равно двадцати. Какой знак стоит перед z в уравнении для z?',
          'x plus y equals nine, x times y equals twenty. What sign stands before z in the equation for z?',
        ),
        options: [
          { id: 'minus', right: true, label: L('Minus to\'qqiz z', 'Минус девять z', 'Minus nine z') },
          { id: 'plus', label: L("Plyus to'qqiz z", 'Плюс девять z', 'Plus nine z') },
        ],
        ok: L(
          "To'g'ri. Formulada doim minus yig'indi karra z turadi, yig'indi musbat bo'lsa ham.",
          'Верно. В формуле всегда стоит минус суммы, умноженной на z, даже если сумма положительна.',
          'Correct. The formula always has minus the sum times z, even when the sum is positive.',
        ),
        hint: L(
          "Formulani eslang: z kvadrat MINUS yig'indi karra z qo'shi ko'paytma teng nol.",
          'Вспомни формулу: z в квадрате МИНУС сумма, умноженная на z, плюс произведение равно нулю.',
          'Recall the formula: z squared MINUS the sum times z plus the product equals zero.',
        ),
      },
      {
        id: 'q4',
        tag: 'kvadratni-tuldirish-esdan-chiqarish',
        ask: L(
          "X kvadrat qo'shi y kvadrat teng o'n, xy teng uch berilgan. X qo'shi y ni topish uchun nima qilinadi?",
          'Даны x в квадрате плюс y в квадрате равно десяти, xy равно трём. Что делают, чтобы найти x плюс y?',
          'Given x squared plus y squared equals ten, xy equals three. What is done to find x plus y?',
        ),
        options: [
          { id: 'add', right: true, label: L("Ikki xy qo'shiladi", 'Прибавляют два xy', 'Two xy is added') },
          { id: 'ignore', label: L('Xy e\'tiborga olinmaydi', 'xy не учитывается', 'xy is ignored') },
        ],
        ok: L(
          "To'g'ri. O'n qo'shi olti, ya'ni ikki karra uch, o'n oltiga teng, undan ildiz olinadi.",
          'Верно. Десять плюс шесть, то есть дважды три, равно шестнадцати, из него извлекается корень.',
          'Correct. Ten plus six, that is twice three, equals sixteen, from which the root is taken.',
        ),
        hint: L(
          "X qo'shi y butun kvadratini eslang: unda x kvadrat, y kvadratdan tashqari ikki xy ham bor.",
          'Вспомни полный квадрат x плюс y: в нём, кроме x в квадрате и y в квадрате, есть ещё два xy.',
          'Recall the complete square of x plus y: besides x squared and y squared, it also has two xy.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Sistema: ikkala tenglama, ikkita javob",
    'Система: оба уравнения, два ответа',
    'The system: both equations, two answers',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda besh va minus ikki sonlari ikkala tenglamani ham qanoatlantirishini tekshirdingiz. Bugun aynan shu g'oyani to'liq egalladingiz.",
      'На первом экране ты проверил, что числа пять и минус два удовлетворяют обоим уравнениям. Сегодня ты полностью освоил именно эту идею.',
      'On the first screen you checked that the numbers five and minus two satisfy both equations. Today you fully mastered exactly this idea.'),
    A('s1',
      "Siz Viyet teoremasi teskarisini, ikkita javobni tartib bilan yozishni va to'liq kvadratga keltirishni o'rgandingiz.",
      'Ты освоил теорему, обратную теореме Виета, запись двух ответов с учётом порядка и приведение к полному квадрату.',
      'You learned the converse of Vieta\'s theorem, writing two answers with attention to order, and reducing to a complete square.'),
    A('s2',
      "Keyingi darsda grafik usul: sistema yechimi grafiklarning kesishish nuqtasi sifatida ko'rinadi.",
      'В следующем уроке графический способ: решение системы видно как точка пересечения графиков.',
      "The next lesson covers the graphical method: the system's solution appears as the intersection point of the graphs."),
  ],
  props: {
    mark: 'z² − sz + p = 0',
    markNote: L(
      "Viyet teoremasi teskarisi",
      'теорема, обратная теореме Виета',
      "Vieta's converse",
    ),
    lines: [
      STATEMENTS[0],
      L(
        "Ikkita javob bo'lsa, ikkalasi ham tartib bilan yoziladi",
        'Если есть два ответа, оба записываются с учётом порядка',
        'If there are two answers, both are written with attention to order',
      ),
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: grafik usul',
      'Следующий урок: графический способ',
      'Next lesson: the graphical method',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'vieta-teskari-notogri', ...S2 },
  { role: 'explain',  tag: 'vieta-teskari-notogri', ...S3 },
  { role: 'explain',  tag: 'sistema-ikkala-tenglama', ...S4 },
  { role: 'explain',  tag: 'juftlik-tartib-farqi', ...S5 },
  { role: 'explain',  tag: 'kvadratni-tuldirish-esdan-chiqarish', ...S6 },
  { role: 'explain',  tag: 'kvadratni-tuldirish-esdan-chiqarish', ...S7 },
  { role: 'rule',     tag: 'kvadratni-tuldirish-esdan-chiqarish', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'vieta-teskari-notogri', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'juftlik-tartib-farqi', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'sistema-ikkala-tenglama', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'juftlik-tartib-farqi', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'vieta-teskari-notogri', ...S13 },
  { role: 'blitz',    tool: 'blitz', ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
