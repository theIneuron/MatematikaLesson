// ============================================================================
// 9-sinf, Dars 22. ARIFMETIK PROGRESSIYA.
//
// REDAKSIYA 1, 2026-08-27. Darslik: Algebra 9, 29-§ (153-155-bet).
//   Kirish masalasi (153-bet): o'quvchi har kuni 5 ta test yechishni
//       rejalashtirgan — 5, 10, 15, 20, 25. Darsning XUKI shu.
//   Ta'rif (154-bet): a_(n+1) = a_n + d, d — progressiyaning AYIRMASI.
//   Uchta misol (154-bet): natural qator (d = 1), manfiy butun sonlar
//       (d = −1), va o'zgarmas 3, 3, 3 (d = 0). Ayirma manfiy ham,
//       NOL ham bo'lishi mumkin — buni ataylab ko'rsatadi.
//   1-masala (154-bet): a_n = 1,5 + 3n arifmetik progressiya ekanini
//       isbotlash: ayirma n ga bog'liq emasligini ko'rsatish, d = 3.
//   NOM SABABI (154-bet): a_n = (a_(n−1) + a_(n+1))/2 — har bir had ikki
//       qo'shnisining o'rta ARIFMETIGI, «arifmetik» nomi shundan.
//   Formula (1) (155-bet): a_n = a_1 + (n − 1)d.
//   2-masala: a_1 = −6, d = 4, a_100 = 390.
//   3-masala: 3, 5, 7, 9 ... da 99 ning nomeri, n = 49.
//   4-masala: a_8 = 130, a_12 = 166 — sistema orqali formulani topish.
//
// ASBOB: `SeqTable` (Dars21, «Pribor 5») — bu darsda IKKINCHI marta,
// endi rekurrent qadam BIR XIL bo'lgan holatda. Yangi asbob kerak emas:
// qo'l harakati o'sha — jadvalni birma-bir to'ldirish.
//
// DARSNING BOSH TUZOG'I: formulada (n − 1), n emas. Bu shu mavzuning eng
// keng tarqalgan xatosi va u 12-ekranda alohida ochiladi.
//
// TEGLAR (o'zining):
//   nechta-qadam-adashtirish   — formulada n − 1 o'rniga n olish
//   ayirmani-notogri-hisoblash — ayirmani keyingidan oldingisini emas,
//                                 teskarisiga hisoblash
//   ayirma-doim-musbat-deb-oylash — d manfiy yoki nol bo'la olmaydi
//                                 deb o'ylash
//   qoshni-hadlar-ortasini-unutish — hadning ikki qo'shnisi o'rtasi
//                                 ekanini ishlatmaslik
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, SeqTable } from './asboblar.jsx'

export const META = {
  id: 'grade9-22',
  n: 22,
  row: 22,
  block: 'Б4',
  topic: L('Arifmetik progressiya', 'Арифметическая прогрессия', 'Arithmetic progression'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Arifmetik progressiyada har bir keyingi had oldingisidan bir xil songa farq qiladi, bu son ayirma d",
    'В арифметической прогрессии каждый следующий член отличается от предыдущего на одно и то же число, это разность d',
    'In an arithmetic progression each next term differs from the previous by the same number, the difference d',
  ),
  L(
    "N-chi hadni topish uchun birinchi hadga d ni n minus bir marta qo'shish kerak: a_n = a_1 + (n − 1)d",
    'Чтобы найти n-й член, к первому нужно прибавить d ровно n минус один раз: a_n = a_1 + (n − 1)d',
    'To find the n-th term, add d to the first term exactly n minus one times: a_n = a_1 + (n − 1)d',
  ),
  L(
    "Ikkinchisidan boshlab har bir had ikki qo'shnisining o'rta arifmetigiga teng, nom ham shundan",
    'Начиная со второго, каждый член равен среднему арифметическому двух соседей, отсюда и название',
    'From the second onward, each term equals the arithmetic mean of its two neighbours, hence the name',
  ),
]

export const MISS = {
  'nechta-qadam-adashtirish': {
    what: L(
      "formulada n minus bir o'rniga n olindi",
      'в формуле вместо n минус один взято n',
      'n was used in the formula instead of n minus one',
    ),
    wrong: null,
    at: 0,
  },
  'ayirmani-notogri-hisoblash': {
    what: L(
      "ayirma teskari tomonga hisoblandi",
      'разность посчитана в обратную сторону',
      'the difference was computed the wrong way round',
    ),
    wrong: null,
    at: 0,
  },
  'ayirma-doim-musbat-deb-oylash': {
    what: L(
      "ayirma manfiy yoki nol bo'la olmaydi deb o'ylandi",
      'предполагалось, что разность не может быть отрицательной или нулевой',
      'it was assumed the difference cannot be negative or zero',
    ),
    wrong: null,
    at: 0,
  },
  'qoshni-hadlar-ortasini-unutish': {
    what: L(
      "hadning ikki qo'shnisi o'rtasi ekani ishlatilmadi",
      'не использовано, что член это среднее двух соседей',
      'the fact that a term is the mean of its two neighbours was not used',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — darslikning o'z kirish masalasi.
// ============================================================
const S1 = {
  eyebrow: L("BIR XIL QADAM", 'ОДИНАКОВЫЙ ШАГ', 'AN EQUAL STEP'),
  title: L(
    "Har kuni bir xilda ko'payadi",
    'Каждый день прибавляется одинаково',
    'The same amount is added each day',
  ),
  audio: [
    A('mount',
      "O'quvchi imtihonga tayyorlanib, har kuni beshta test yechishni rejalashtirdi. Birinchi kuni besh, ikkinchisiga o'n, uchinchisiga o'n besh, to'rtinchisiga yigirma.",
      'Ученик, готовясь к экзамену, запланировал каждый день решать по пять тестов. К первому дню пять, ко второму десять, к третьему пятнадцать, к четвёртому двадцать.',
      'A student preparing for an exam planned to solve five tests a day. By the first day five, by the second ten, by the third fifteen, by the fourth twenty.'),
    A('why',
      "21-darsdagi jadvalda hadlar tobora tezroq o'sardi. Bu yerda esa boshqacha.",
      'В таблице с 21 урока члены росли всё быстрее. А здесь иначе.',
      'In the table from lesson 21 the terms grew ever faster. Here it is different.'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Besh, o'n, o'n besh, yigirma. Bu ketma-ketlikda nima o'zgarmaydi?",
      'Пять, десять, пятнадцать, двадцать. Что не меняется в этой последовательности?',
      'Five, ten, fifteen, twenty. What stays the same in this sequence?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L("Qo'shiladigan son", 'Прибавляемое число', 'The number being added'),
      },
      {
        id: 'wrong',
        show: L("Hadning o'zi", 'Сам член', 'The term itself'),
        hint: L(
          "Hadlar o'zgaradi: besh, o'n, o'n besh. O'zgarmaydigani esa har safar qo'shiladigan besh soni.",
          'Члены меняются: пять, десять, пятнадцать. А не меняется то самое число пять, которое прибавляется каждый раз.',
          'The terms change: five, ten, fifteen. What does not change is the five added each time.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Qadam bir xil bo'lgan ketma-ketlik arifmetik progressiya deyiladi, qadam esa uning ayirmasi.",
      'Верно. Последовательность с одинаковым шагом называют арифметической прогрессией, а шаг её разностью.',
      'Correct. A sequence with an equal step is called an arithmetic progression, and the step is its difference.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — 21-darsdan: nomer va had.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Ayirmani qanday topish",
    'Как найти разность',
    'How to find the difference',
  ),
  audio: [
    A('mount',
      "Ayirma topish uchun keyingi haddan oldingisi ayiriladi. Tartib muhim: aynan keyingisidan oldingisi.",
      'Чтобы найти разность, из следующего члена вычитают предыдущий. Порядок важен: именно из следующего предыдущий.',
      'To find the difference, subtract the previous term from the next one. The order matters: the next minus the previous.'),
    A('why',
      "Teskari tomonga hisoblansa, ayirma ishorasi almashib ketadi.",
      'Если посчитать в обратную сторону, у разности поменяется знак.',
      'Computed the other way round, the difference changes sign.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('5, 10, 15, 20, ...', '5, 10, 15, 20, ...', '5, 10, 15, 20, ...')}
      steps={[]}
      ask={L(
        "Bu progressiyaning ayirmasi qanday topiladi?",
        'Как находится разность этой прогрессии?',
        'How is the difference of this progression found?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Keyingisidan oldingisini ayirib: o'n minus besh", 'Из следующего вычесть предыдущий: десять минус пять', 'Next minus previous: ten minus five') },
        {
          id: 'wrong',
          label: L("Oldingisidan keyingisini ayirib: besh minus o'n", 'Из предыдущего вычесть следующий: пять минус десять', 'Previous minus next: five minus ten'),
          hint: L(
            "Bunday hisoblansa minus besh chiqadi, lekin ketma-ketlik o'sib boryapti. Ayirma o'sish qadamini ko'rsatishi kerak.",
            'При таком счёте выйдет минус пять, но последовательность растёт. Разность должна показывать шаг роста.',
            'That way gives minus five, but the sequence is growing. The difference must show the step of growth.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ayirma beshga teng: har qadamda beshta qo'shiladi.",
        'Верно. Разность равна пяти: на каждом шаге прибавляется пять.',
        'Correct. The difference is five: five is added at each step.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — SeqTable: rekurrent qadam bir xil.
// ============================================================
const S3 = {
  eyebrow: L('BIR XIL QADAM BILAN', 'ШАГ ЗА ШАГОМ', 'STEP BY STEP'),
  title: L(
    "Jadval bir xil qadam bilan to'ladi",
    'Таблица заполняется одинаковым шагом',
    'The table fills with an equal step',
  ),
  audio: [
    A('mount',
      "Birinchi had besh, ayirma besh. Jadvalni to'ldiring: har safar oldingisiga beshta qo'shing.",
      'Первый член пять, разность пять. Заполни таблицу: каждый раз прибавляй к предыдущему пять.',
      'The first term is five, the difference is five. Fill the table: add five to the previous each time.'),
    W('cell',
      "21-darsda hadlar tobora tezroq o'sardi, bu yerda esa qadam doim bir xil.",
      'На 21 уроке члены росли всё быстрее, а здесь шаг всё время одинаков.',
      'In lesson 21 the terms grew ever faster, here the step is always the same.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SeqTable
      rule={L('a₁ = 5,  aₙ₊₁ = aₙ + 5', 'a₁ = 5,  aₙ₊₁ = aₙ + 5', 'a₁ = 5,  aₙ₊₁ = aₙ + 5')}
      ns={[1, 2, 3, 4, 5]}
      cells={[
        { value: '5', wrong: '10', hint: L("Birinchi had shartda berilgan: beshga teng.", 'Первый член дан в условии: равен пяти.', 'The first term is given: it equals five.') },
        { value: '10', wrong: '15', hint: L("Beshga beshta qo'shiladi: o'n bo'ladi.", 'К пяти прибавляется пять: получается десять.', 'Five plus five: that makes ten.') },
        { value: '15', wrong: '20', hint: L("O'nga beshta qo'shiladi: o'n besh.", 'К десяти прибавляется пять: пятнадцать.', 'Ten plus five: fifteen.') },
        { value: '20', wrong: '25', hint: L("O'n beshga beshta qo'shiladi: yigirma.", 'К пятнадцати прибавляется пять: двадцать.', 'Fifteen plus five: twenty.') },
        { value: '25', wrong: '30', hint: L("Yigirmaga beshta qo'shiladi: yigirma besh.", 'К двадцати прибавляется пять: двадцать пять.', 'Twenty plus five: twenty five.') },
      ]}
      ask={L(
        "Jadvalni to'ldiring: har qadamda beshta qo'shiladi",
        'Заполни таблицу: на каждом шаге прибавляется пять',
        'Fill the table: five is added at each step',
      )}
      after={L(
        "Ana xolos. Besh, o'n, o'n besh, yigirma, yigirma besh. Qo'shni hadlar orasidagi masofa hamma joyda bir xil.",
        'Вот и всё. Пять, десять, пятнадцать, двадцать, двадцать пять. Расстояние между соседними членами везде одинаково.',
        'That is all it takes. Five, ten, fifteen, twenty, twenty five. The gap between neighbouring terms is the same everywhere.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — AYIRMA MANFIY VA NOL BO'LISHI MUMKIN.
// Darslikning uchta misoli.
// ============================================================
const S4 = {
  eyebrow: L("AYIRMA HAR XIL", 'РАЗНОСТЬ БЫВАЕТ РАЗНОЙ', 'THE DIFFERENCE VARIES'),
  title: L(
    "Ayirma manfiy ham, nol ham bo'ladi",
    'Разность бывает и отрицательной, и нулевой',
    'The difference can be negative or zero',
  ),
  audio: [
    A('mount',
      "Darslik uchta misol beradi. Natural qator bir, ikki, uch: ayirma bir. Manfiy sonlar minus bir, minus ikki, minus uch: ayirma minus bir. Va uchinchi: uch, uch, uch.",
      'Учебник даёт три примера. Натуральный ряд один, два, три: разность один. Отрицательные числа минус один, минус два, минус три: разность минус один. И третий: три, три, три.',
      'The textbook gives three examples. The natural numbers one, two, three: difference one. The negatives minus one, minus two, minus three: difference minus one. And a third: three, three, three.'),
    A('why',
      "Uchinchi misolda hadlar umuman o'zgarmaydi. Bu ham progressiyami?",
      'В третьем примере члены вообще не меняются. Это тоже прогрессия?',
      'In the third example the terms do not change at all. Is that a progression too?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('3, 3, 3, 3, ...', '3, 3, 3, 3, ...', '3, 3, 3, 3, ...')}
      steps={[]}
      ask={L(
        "Hadlari o'zgarmaydigan bu ketma-ketlik arifmetik progressiyami?",
        'Является ли арифметической прогрессией эта последовательность, где члены не меняются?',
        'Is this sequence, whose terms do not change, an arithmetic progression?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Ha, ayirmasi nolga teng", 'Да, её разность равна нулю', 'Yes, its difference equals zero') },
        {
          id: 'wrong',
          label: L("Yo'q, chunki hadlar o'smaydi", 'Нет, потому что члены не растут', 'No, because the terms do not grow'),
          hint: L(
            "Ta'rifda o'sish talab qilinmaydi: har bir keyingisi oldingisidan BIR XIL songa farq qilishi yetarli. Bu son nol ham bo'lishi mumkin.",
            'В определении не требуется рост: достаточно, чтобы каждый следующий отличался от предыдущего на ОДНО И ТО ЖЕ число. Это число может быть и нулём.',
            'The definition does not require growth: it is enough that each next term differs from the previous by the SAME number. That number may be zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ayirma musbat bo'lsa progressiya o'sadi, manfiy bo'lsa kamayadi, nol bo'lsa o'zgarmaydi. Uchalasi ham progressiya.",
        'Верно. При положительной разности прогрессия растёт, при отрицательной убывает, при нулевой не меняется. Все три прогрессии.',
        'Correct. With a positive difference the progression grows, with a negative one it falls, with zero it stays. All three are progressions.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — NEGA «ARIFMETIK»: qo'shnilar o'rtasi.
// ============================================================
const S5 = {
  eyebrow: L('NOM QAYERDAN', 'ОТКУДА НАЗВАНИЕ', 'WHERE THE NAME COMES FROM'),
  title: L(
    "Har bir had ikki qo'shnisining o'rtasi",
    'Каждый член это среднее двух соседей',
    'Each term is the mean of its two neighbours',
  ),
  audio: [
    A('mount',
      "Besh, o'n, o'n besh qatorini oling. O'n soni beshdan besh birlik o'ngda, o'n beshdan besh birlik chapda: u aynan o'rtada turibdi.",
      'Возьми ряд пять, десять, пятнадцать. Десятка на пять правее пяти и на пять левее пятнадцати: она стоит ровно посередине.',
      'Take the row five, ten, fifteen. Ten is five to the right of five and five to the left of fifteen: it sits exactly in the middle.'),
    A('why',
      "O'rtada turgan son ikki chekkaning o'rta arifmetigi bo'ladi.",
      'Число, стоящее посередине, является средним арифметическим двух крайних.',
      'The number in the middle is the arithmetic mean of the two outer ones.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('5,  10,  15', '5,  10,  15', '5,  10,  15')}
      steps={[
        { id: 'm', head: L('Chekkalarning o\'rtasi', 'Среднее крайних', 'Mean of the outer two'), lines: ['(5 + 15)/2 = 10'] },
      ]}
      ask={L(
        "Bu xossa nima uchun muhim?",
        'Чем важно это свойство?',
        'Why does this property matter?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Qo'shnilari ma'lum bo'lsa, o'rtadagi hadni topish mumkin", 'Зная соседей, можно найти средний член', 'Knowing the neighbours, the middle term can be found'),
        },
        {
          id: 'wrong',
          label: L("Hech narsaga, bu shunchaki tasodif", 'Ничем, это просто совпадение', 'By nothing, it is just a coincidence'),
          hint: L(
            "Bu tasodif emas: qadam bir xil bo'lgani uchun o'rtadagi had ikki chekkadan bir xil masofada turadi, ya'ni ularning o'rtasida.",
            'Это не совпадение: раз шаг одинаков, средний член стоит на равном расстоянии от обоих крайних, то есть посередине.',
            'It is no coincidence: since the step is equal, the middle term is equidistant from both, that is, in the middle.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Progressiya arifmetik deb ataladi aynan shuning uchun: har bir had qo'shnilarining o'rta ARIFMETIGI.",
        'Верно. Прогрессия называется арифметической именно поэтому: каждый член это среднее АРИФМЕТИЧЕСКОЕ соседей.',
        'Correct. The progression is called arithmetic for exactly this reason: each term is the ARITHMETIC mean of its neighbours.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — FORMULA VA NEGA (n − 1).
// ============================================================
const S6 = {
  eyebrow: L('FORMULA', 'ФОРМУЛА', 'THE FORMULA'),
  title: L(
    "Nechta qadam qilinadi",
    'Сколько делается шагов',
    'How many steps are taken',
  ),
  audio: [
    A('mount',
      "Birinchi haddan ikkinchisiga bitta qadam, uchinchisiga ikkita, to'rtinchisiga uchta. Qadamlar soni doim nomerdan bitta kam.",
      'От первого члена ко второму один шаг, к третьему два, к четвёртому три. Число шагов всегда на один меньше номера.',
      'From the first term to the second is one step, to the third two, to the fourth three. The number of steps is always one less than the index.'),
    A('why',
      "Shuning uchun formulada n emas, n minus bir turadi.",
      'Поэтому в формуле стоит не n, а n минус один.',
      'That is why the formula has n minus one, not n.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('a₁ = 5,  d = 5', 'a₁ = 5,  d = 5', 'a₁ = 5,  d = 5')}
      steps={[
        { id: 'a', head: L('Ikkinchisiga', 'До второго', 'To the second'), lines: ['a₂ = 5 + 1·5 = 10'] },
        { id: 'b', head: L('Uchinchisiga', 'До третьего', 'To the third'), lines: ['a₃ = 5 + 2·5 = 15'] },
      ]}
      ask={L(
        "Yettinchi hadga yetish uchun necha marta besh qo'shiladi?",
        'Сколько раз прибавляется пять, чтобы дойти до седьмого члена?',
        'How many times is five added to reach the seventh term?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Olti marta', 'Шесть раз', 'Six times') },
        {
          id: 'wrong',
          label: L('Yetti marta', 'Семь раз', 'Seven times'),
          hint: L(
            "Birinchi had allaqachon bor, unga qadam qilish shart emas. Ikkinchisiga bitta qadam, demak yettinchisiga olti qadam.",
            'Первый член уже есть, до него шагать не нужно. До второго один шаг, значит до седьмого шесть.',
            'The first term is already there, no step is needed to reach it. One step to the second, so six to the seventh.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Umumiy formula: a n teng a bir qo'shi n minus bir karra d. Aynan n minus bir, chunki birinchi hadga qadam qilinmaydi.",
        'Верно. Общая формула: a n равно a один плюс n минус один, умножить на d. Именно n минус один, потому что до первого члена шага нет.',
        'Correct. The general formula: a n equals a one plus n minus one, times d. Exactly n minus one, because no step is needed to reach the first term.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — UZOQ HAD: darslikning 2-masalasi.
// ============================================================
const S7 = {
  eyebrow: L('UZOQ HAD', 'ДАЛЁКИЙ ЧЛЕН', 'A DISTANT TERM'),
  title: L(
    "Yuzinchi hadga bitta qadamda",
    'До сотого члена за один шаг',
    'To the hundredth term in one step',
  ),
  audio: [
    A('mount',
      "Progressiyaning birinchi hadi minus olti, ayirmasi to'rt. Yuzinchi hadni toping.",
      'Первый член прогрессии минус шесть, разность четыре. Найди сотый член.',
      'The first term of the progression is minus six, the difference is four. Find the hundredth term.'),
    A('why',
      "Formulaga qo'ying: yuzinchi hadga yetish uchun to'qson to'qqiz qadam kerak.",
      'Подставь в формулу: чтобы дойти до сотого члена, нужно девяносто девять шагов.',
      'Substitute into the formula: reaching the hundredth term takes ninety nine steps.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('a₁ = −6,  d = 4,  a₁₀₀ = ?', 'a₁ = −6,  d = 4,  a₁₀₀ = ?', 'a₁ = −6,  d = 4,  a₁₀₀ = ?')}
      steps={[
        { id: 'f', head: L('Formulaga', 'В формулу', 'Into the formula'), lines: ['a₁₀₀ = −6 + (100 − 1)·4', 'a₁₀₀ = −6 + 99·4'] },
      ]}
      ask={L(
        "Yuzinchi had nechaga teng?",
        'Чему равен сотый член?',
        'What does the hundredth term equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '390' },
        {
          id: 'wrong',
          label: '394',
          hint: L(
            "To'qson to'qqiz karra to'rt uch yuz to'qson olti, undan olti ayiriladi. Agar yuz karra to'rt olinsa, bitta ortiqcha qadam qilingan bo'ladi.",
            'Девяносто девять на четыре триста девяносто шесть, из них вычитается шесть. Если взять сто на четыре, получится один лишний шаг.',
            'Ninety nine times four is three hundred ninety six, minus six. Taking a hundred times four would add one extra step.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uch yuz to'qson. Yuzta katakni to'ldirish shart emas edi: formula bitta qadamda javob berdi.",
        'Верно. Триста девяносто. Заполнять сто ячеек не пришлось: формула дала ответ за один шаг.',
        'Correct. Three hundred ninety. No need to fill a hundred cells: the formula gave the answer in one step.',
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
    "Algebra 9, 29-§, ta'rif va 1-2-masalalar (154-155-bet)",
    'Алгебра 9, §29, определение и задачи 1-2 (стр. 154-155)',
    'Algebra 9, §29, the definition and problems 1-2 (p. 154-155)',
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
          "Formulada nima uchun n minus bir turadi?",
          'Почему в формуле стоит n минус один?',
          'Why does the formula have n minus one?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Birinchi hadga qadam qilinmaydi, qadamlar nomerdan bitta kam", 'До первого члена шага нет, шагов на один меньше номера', 'No step is needed to reach the first term, so there is one step fewer than the index'),
          },
          {
            id: 'wrong',
            label: L("Shunchaki kelishuv, sababi yo'q", 'Просто соглашение, без причины', 'Just a convention, with no reason'),
            hint: L(
              "6-ekranni eslang: ikkinchi hadga bitta qadam, uchinchisiga ikkita. Sabab bor va u sanoqda.",
              'Вспомни 6 экран: до второго члена один шаг, до третьего два. Причина есть, и она в счёте шагов.',
              'Recall screen 6: one step to the second term, two to the third. There is a reason, and it is in counting steps.',
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
    "Ayirma, formula va qo'shnilar o'rtasi",
    'Разность, формула и среднее соседей',
    'The difference, the formula, and the mean of neighbours',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz ayirmani topdingiz, uning manfiy va nol bo'lishini ko'rdingiz, nomning sababini bildingiz va formulani chiqardingiz.",
      'На семи экранах ты нашёл разность, увидел, что она бывает отрицательной и нулевой, узнал причину названия и вывел формулу.',
      'On seven screens you found the difference, saw it can be negative or zero, learned the reason for the name, and derived the formula.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SeqTable: KAMAYUVCHI progressiya.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Endi ayirma manfiy",
    'Теперь разность отрицательна',
    'Now the difference is negative',
  ),
  audio: [
    A('mount',
      "Birinchi had yigirma, ayirma minus uch. Jadvalni to'ldiring: har safar uchta ayiriladi.",
      'Первый член двадцать, разность минус три. Заполни таблицу: каждый раз вычитается три.',
      'The first term is twenty, the difference is minus three. Fill the table: three is subtracted each time.'),
    A('why',
      "Ayirma manfiy bo'lsa, progressiya kamayadi, lekin qadam baribir bir xil.",
      'При отрицательной разности прогрессия убывает, но шаг всё равно одинаков.',
      'With a negative difference the progression falls, but the step is still equal.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SeqTable
      rule={L('a₁ = 20,  d = −3', 'a₁ = 20,  d = −3', 'a₁ = 20,  d = −3')}
      ns={[1, 2, 3, 4, 5]}
      cells={[
        { value: '20', wrong: '17', hint: L("Birinchi had shartda berilgan: yigirmaga teng.", 'Первый член дан в условии: равен двадцати.', 'The first term is given: it equals twenty.') },
        { value: '17', wrong: '23', hint: L("Ayirma manfiy, demak qo'shilmaydi, ayiriladi: yigirma minus uch, o'n yetti.", 'Разность отрицательна, значит не прибавляется, а вычитается: двадцать минус три, семнадцать.', 'The difference is negative, so it is subtracted, not added: twenty minus three, seventeen.') },
        { value: '14', wrong: '15', hint: L("O'n yetti minus uch: o'n to'rt.", 'Семнадцать минус три: четырнадцать.', 'Seventeen minus three: fourteen.') },
        { value: '11', wrong: '12', hint: L("O'n to'rt minus uch: o'n bir.", 'Четырнадцать минус три: одиннадцать.', 'Fourteen minus three: eleven.') },
        { value: '8', wrong: '9', hint: L("O'n bir minus uch: sakkiz.", 'Одиннадцать минус три: восемь.', 'Eleven minus three: eight.') },
      ]}
      ask={L(
        "Jadvalni to'ldiring: ayirma manfiy",
        'Заполни таблицу: разность отрицательна',
        'Fill the table: the difference is negative',
      )}
      after={L(
        "Ana xolos. Yigirma, o'n yetti, o'n to'rt, o'n bir, sakkiz. Progressiya kamayadi, lekin qadam hamma joyda uchga teng.",
        'Вот и всё. Двадцать, семнадцать, четырнадцать, одиннадцать, восемь. Прогрессия убывает, но шаг везде равен трём.',
        'That is all it takes. Twenty, seventeen, fourteen, eleven, eight. The progression falls, but the step is three everywhere.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: ayirmani topish.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Ayirmani topish",
    'Находим разность',
    'Finding the difference',
  ),
  audio: [
    A('mount',
      "Uchta progressiya. Har birida ayirmani toping.",
      'Три прогрессии. В каждой найди разность.',
      'Three progressions. Find the difference in each.'),
    A('why',
      "Keyingi haddan oldingisini ayiring, teskarisiga emas.",
      'Вычитай из следующего члена предыдущий, а не наоборот.',
      'Subtract the previous term from the next, not the other way round.'),
  ],
  props: {
    stepLabel: L('Progressiya', 'Прогрессия', 'Progression'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi: ayirma musbat, manfiy va nol bo'lishi mumkin.",
      'Все три найдены: разность может быть положительной, отрицательной и нулевой.',
      'All three are found: the difference can be positive, negative or zero.',
    ),
    tasks: [
      {
        expr: '7, 11, 15, 19, ...',
        question: L('Ayirma nechaga teng?', 'Чему равна разность?', 'What does the difference equal?'),
        ok: L("Ha. O'n bir minus yetti, to'rtga teng.", 'Да. Одиннадцать минус семь, равно четырём.', 'Yes. Eleven minus seven, equals four.'),
        items: [
          { id: 'a', right: true, label: 'd = 4' },
          { id: 'b', label: 'd = 7', hint: L("Yetti bu birinchi had, ayirma emas. Ayirma qo'shni ikki had orasidagi farq.", 'Семь это первый член, а не разность. Разность это различие между двумя соседними членами.', 'Seven is the first term, not the difference. The difference is the gap between two neighbouring terms.') },
        ],
        solution: ['11 − 7 = 4', '15 − 11 = 4'],
      },
      {
        expr: '12, 9, 6, 3, ...',
        question: L('Ayirma nechaga teng?', 'Чему равна разность?', 'What does the difference equal?'),
        ok: L("Ha. To'qqiz minus o'n ikki, minus uchga teng.", 'Да. Девять минус двенадцать, равно минус трём.', 'Yes. Nine minus twelve, equals minus three.'),
        items: [
          { id: 'a', right: true, label: 'd = −3' },
          { id: 'b', label: 'd = 3', hint: L("Progressiya kamayadi, demak ayirma manfiy. Keyingisidan oldingisini ayiring: to'qqiz minus o'n ikki.", 'Прогрессия убывает, значит разность отрицательна. Вычитай из следующего предыдущий: девять минус двенадцать.', 'The progression falls, so the difference is negative. Subtract previous from next: nine minus twelve.') },
        ],
        solution: ['9 − 12 = −3', '6 − 9 = −3'],
      },
      {
        expr: '−2, 3, 8, 13, ...',
        question: L('Ayirma nechaga teng?', 'Чему равна разность?', 'What does the difference equal?'),
        ok: L("Ha. Uch minus minus ikki, ya'ni uch qo'shi ikki, beshga teng.", 'Да. Три минус минус два, то есть три плюс два, равно пяти.', 'Yes. Three minus minus two, that is three plus two, equals five.'),
        items: [
          { id: 'a', right: true, label: 'd = 5' },
          { id: 'b', label: 'd = 1', hint: L("Minus ikkini ayirish ikkini qo'shish demakdir: uch qo'shi ikki, besh bo'ladi.", 'Вычесть минус два значит прибавить два: три плюс два, получается пять.', 'Subtracting minus two means adding two: three plus two makes five.') },
        ],
        solution: ['3 − (−2) = 3 + 2 = 5', '8 − 3 = 5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: darslikning 3-masalasi.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Had ma'lum, nomer noma'lum",
    'Член известен, номер неизвестен',
    'The term is known, the index is not',
  ),
  audio: [
    A('mount',
      "Har savolda progressiya va had berilgan. Formulaga qo'yib, nomerni toping.",
      'В каждом вопросе даны прогрессия и член. Подставь в формулу и найди номер.',
      'Each question gives a progression and a term. Substitute into the formula and find the index.'),
    A('why',
      "Nomer natural chiqishini ham tekshiring: 21-darsdagi qoida bu yerda ham ishlaydi.",
      'Проверяй и то, натуральным ли вышел номер: правило с 21 урока работает и здесь.',
      'Also check that the index comes out natural: the rule from lesson 21 works here too.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tekshirildi: formula nomerni beradi, lekin u natural bo'lishi ham shart.",
      'Все три проверены: формула даёт номер, но он ещё должен быть натуральным.',
      'All three are checked: the formula gives the index, but it must also be natural.',
    ),
    tasks: [
      {
        expr: '3, 5, 7, 9, ...   99 = ?',
        question: L('To\'qson to\'qqizning nomeri qanday?', 'Каков номер девяноста девяти?', 'What is the index of ninety nine?'),
        ok: L("Ha. To'qson to'qqiz teng uch qo'shi n minus bir karra ikki, bundan n qirq to'qqiz.", 'Да. Девяносто девять равно три плюс n минус один на два, отсюда n сорок девять.', 'Yes. Ninety nine equals three plus n minus one times two, giving n forty nine.'),
        items: [
          { id: 'a', right: true, label: 'n = 49' },
          { id: 'b', label: 'n = 50', hint: L("Ikki n minus ikki teng to'qson olti, demak ikki n to'qson sakkiz, n esa qirq to'qqiz. Ellik olinsa, bitta ortiqcha qadam bo'ladi.", 'Два n минус два равно девяноста шести, значит два n девяносто восемь, а n сорок девять. Если взять пятьдесят, выйдет один лишний шаг.', 'Two n minus two equals ninety six, so two n is ninety eight and n is forty nine. Taking fifty adds one extra step.') },
        ],
        solution: ['99 = 3 + (n − 1)·2', '96 = 2n − 2,  2n = 98', 'n = 49'],
      },
      {
        expr: '4, 7, 10, 13, ...   31 = ?',
        question: L('O\'ttiz birning nomeri qanday?', 'Каков номер тридцати одного?', 'What is the index of thirty one?'),
        ok: L("Ha. O'ttiz bir teng to'rt qo'shi n minus bir karra uch, bundan n o'nga teng.", 'Да. Тридцать один равно четыре плюс n минус один на три, отсюда n равно десяти.', 'Yes. Thirty one equals four plus n minus one times three, giving n equal to ten.'),
        items: [
          { id: 'a', right: true, label: 'n = 10' },
          { id: 'b', label: 'n = 9', hint: L("O'ttiz bir minus to'rt yigirma yetti, uni uchga bo'lsak to'qqiz qadam chiqadi. Qadamlar to'qqizta, nomer esa bittaga ko'p, ya'ni o'n.", 'Тридцать один минус четыре двадцать семь, делим на три, выходит девять шагов. Шагов девять, а номер на один больше, то есть десять.', 'Thirty one minus four is twenty seven, divided by three gives nine steps. Nine steps, and the index is one more, that is ten.') },
        ],
        solution: ['31 = 4 + (n − 1)·3', '27 = 3(n − 1),  n − 1 = 9', 'n = 10'],
      },
      {
        expr: '2, 6, 10, 14, ...   25 = ?',
        question: L('Yigirma besh bu progressiyaning hadimi?', 'Является ли двадцать пять членом этой прогрессии?', 'Is twenty five a term of this progression?'),
        ok: L("Yo'q. Nomer olti butun yetmish besh chiqadi, natural emas, demak yigirma besh had emas.", 'Нет. Номер получается шесть целых семьдесят пять, не натуральный, значит двадцать пять не член.', 'No. The index comes out six point seven five, not natural, so twenty five is not a term.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, nomer natural emas", 'Нет, номер не натуральный', 'No, the index is not natural') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Yigirma besh minus ikki yigirma uch, uni to'rtga bo'lish butun chiqmaydi. Progressiyaning hadlari juft: ikki, olti, o'n, o'n to'rt.", 'Двадцать пять минус два двадцать три, делить на четыре нацело не выходит. Члены прогрессии чётные: два, шесть, десять, четырнадцать.', 'Twenty five minus two is twenty three, which does not divide by four evenly. The terms are even: two, six, ten, fourteen.') },
        ],
        solution: ['25 = 2 + (n − 1)·4', '23 = 4(n − 1),  n − 1 = 5,75', L('Nomer natural emas', 'Номер не натуральный', 'The index is not natural')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Dilnoza n minus bir o'rniga n olgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Bitta ortiqcha qadam",
    'Один лишний шаг',
    'One step too many',
  ),
  audio: [
    A('mount',
      "Dilnozaning yechimi. Birinchi had minus olti, ayirma to'rt. Beshinchi hadni topish uchun u minus oltiga besh karra to'rtni qo'shib, o'n to'rtni yozgan.",
      'Решение Дилнозы. Первый член минус шесть, разность четыре. Чтобы найти пятый член, она прибавила к минус шести пять на четыре и записала четырнадцать.',
      "Dilnoza's solution. The first term is minus six, the difference is four. To find the fifth term she added five times four to minus six and wrote fourteen."),
    A('why',
      "Birinchi haddan beshinchisiga necha qadam kerak?",
      'Сколько шагов нужно от первого члена до пятого?',
      'How many steps are needed from the first term to the fifth?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Birinchi haddan beshinchisiga to'rt qadam kerak, besh emas: Dilnoza bitta ortiqcha qadam qilgan, javob o'n emas, o'n to'rt bo'lib qolgan.",
      'От первого члена до пятого нужно четыре шага, а не пять: Дилноза сделала один лишний шаг, и вместо десяти вышло четырнадцать.',
      'From the first term to the fifth needs four steps, not five: Dilnoza took one extra step, so ten became fourteen.',
    ),
    tasks: [
      {
        expr: 'a₁ = −6,  d = 4,  a₅ = ?',
        question: L(
          "Dilnoza besh karra to'rtni qo'shdi. Birinchi haddan beshinchisiga necha qadam kerak?",
          'Дилноза прибавила пять на четыре. Сколько шагов нужно от первого члена до пятого?',
          'Dilnoza added five times four. How many steps are needed from the first term to the fifth?',
        ),
        ok: L(
          "To'g'ri: to'rt qadam. Minus olti qo'shi to'rt karra to'rt, o'nga teng. Dilnoza bitta ortiqcha qadam qilib, o'n to'rtni olgan.",
          'Верно: четыре шага. Минус шесть плюс четыре на четыре, равно десяти. Дилноза сделала один лишний шаг и получила четырнадцать.',
          'Correct: four steps. Minus six plus four times four equals ten. Dilnoza took one extra step and got fourteen.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("To'rt qadam, javob o'n", 'Четыре шага, ответ десять', 'Four steps, the answer is ten'),
          },
          {
            id: 'b',
            label: L("Besh qadam, Dilnoza to'g'ri qilgan", 'Пять шагов, Дилноза права', 'Five steps, Dilnoza is right'),
            hint: L("Birinchi had allaqachon berilgan, unga qadam qilinmaydi. Shuning uchun formulada n emas, n minus bir turadi.", 'Первый член уже дан, до него шага нет. Именно поэтому в формуле стоит n минус один, а не n.', 'The first term is already given, no step reaches it. That is exactly why the formula has n minus one, not n.'),
          },
        ],
        solution: [
          'a₅ = −6 + (5 − 1)·4 = −6 + 16 = 10',
          L('Dilnoza: −6 + 5·4 = 14', 'Дилноза: −6 + 5·4 = 14', 'Dilnoza: −6 + 5·4 = 14'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning 4-masalasi: ikkita had berilgan.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Birinchi had berilmagan",
    'Первый член не дан',
    'The first term is not given',
  ),
  audio: [
    A('mount',
      "Darslikning masalasi: sakkizinchi had bir yuz o'ttiz, o'n ikkinchisi bir yuz oltmish olti. Birinchi had ham, ayirma ham noma'lum.",
      'Задача из учебника: восьмой член сто тридцать, двенадцатый сто шестьдесят шесть. Ни первый член, ни разность неизвестны.',
      'A textbook problem: the eighth term is one hundred thirty, the twelfth is one hundred sixty six. Neither the first term nor the difference is known.'),
    A('why',
      "Sakkizinchidan o'n ikkinchisiga necha qadam bor? Shu qadamlarda had qanchaga o'sdi?",
      'Сколько шагов от восьмого члена к двенадцатому? На сколько за эти шаги вырос член?',
      'How many steps from the eighth term to the twelfth? By how much did the term grow over those steps?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: ikkita had ma'lum bo'lsa, ular orasidagi qadamlar soni ayirmani beradi.",
      'Найдено: если известны два члена, число шагов между ними даёт разность.',
      'Found: when two terms are known, the number of steps between them gives the difference.',
    ),
    tasks: [
      {
        expr: 'a₈ = 130,  a₁₂ = 166,  d = ?',
        question: L(
          "Sakkizinchidan o'n ikkinchisiga to'rt qadam. Shu to'rt qadamda had o'ttiz oltiga o'sdi. Ayirma nechaga teng?",
          'От восьмого к двенадцатому четыре шага. За эти четыре шага член вырос на тридцать шесть. Чему равна разность?',
          'From the eighth to the twelfth is four steps. Over those four steps the term grew by thirty six. What is the difference?',
        ),
        ok: L(
          "Ha. O'ttiz oltini to'rtga bo'lsak, to'qqiz chiqadi. Bundan birinchi had ham topiladi: bir yuz o'ttiz minus yetti karra to'qqiz, oltmish yetti.",
          'Да. Тридцать шесть делим на четыре, получаем девять. Отсюда находится и первый член: сто тридцать минус семь на девять, шестьдесят семь.',
          'Yes. Thirty six divided by four gives nine. From this the first term follows too: one hundred thirty minus seven times nine, sixty seven.',
        ),
        items: [
          { id: 'a', right: true, label: 'd = 9' },
          { id: 'b', label: 'd = 36', hint: L("O'ttiz olti bu to'rt qadamdagi umumiy o'sish, bitta qadamniki emas. Uni qadamlar soniga bo'lish kerak.", 'Тридцать шесть это общий рост за четыре шага, а не за один. Его нужно разделить на число шагов.', 'Thirty six is the total growth over four steps, not one. It must be divided by the number of steps.') },
        ],
        solution: [
          'a₁₂ − a₈ = 166 − 130 = 36',
          '4d = 36,  d = 9',
          'a₁ = 130 − 7·9 = 67',
        ],
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
    "Blits: ayirma, qadam, o'rta",
    'Блиц: разность, шаг, среднее',
    'Blitz: difference, step, mean',
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
        tag: 'nechta-qadam-adashtirish',
        ask: L(
          "O'ninchi hadga yetish uchun birinchi hadga d necha marta qo'shiladi?",
          'Сколько раз прибавляется d к первому члену, чтобы дойти до десятого?',
          'How many times is d added to the first term to reach the tenth?',
        ),
        options: [
          { id: 'nine', right: true, label: L("To'qqiz", 'Девять', 'Nine') },
          { id: 'ten', label: L("O'n", 'Десять', 'Ten') },
        ],
        ok: L(
          "To'g'ri. Qadamlar soni nomerdan bitta kam: shuning uchun formulada n minus bir turadi.",
          'Верно. Шагов на один меньше номера: поэтому в формуле стоит n минус один.',
          'Correct. There is one step fewer than the index: that is why the formula has n minus one.',
        ),
        hint: L(
          "12-ekranni eslang: Dilnozaning xatosi aynan bitta ortiqcha qadam edi.",
          'Вспомни 12 экран: ошибка Дилнозы была именно в одном лишнем шаге.',
          "Recall screen 12: Dilnoza's mistake was exactly one extra step.",
        ),
      },
      {
        id: 'q2',
        tag: 'ayirma-doim-musbat-deb-oylash',
        ask: L(
          "Arifmetik progressiyaning ayirmasi nolga teng bo'la oladimi?",
          'Может ли разность арифметической прогрессии равняться нулю?',
          'Can the difference of an arithmetic progression equal zero?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Ayirma nol bo'lsa, hadlar o'zgarmaydi, lekin ta'rif bajarilaveradi.",
          'Верно. При нулевой разности члены не меняются, но определение всё равно выполняется.',
          'Correct. With a zero difference the terms do not change, but the definition still holds.',
        ),
        hint: L(
          "4-ekranni eslang: uch, uch, uch qatori ham progressiya edi.",
          'Вспомни 4 экран: ряд три, три, три тоже был прогрессией.',
          'Recall screen 4: the row three, three, three was a progression too.',
        ),
      },
      {
        id: 'q3',
        tag: 'qoshni-hadlar-ortasini-unutish',
        ask: L(
          "Ikkinchisidan boshlab har bir had ikki qo'shnisining o'rta arifmetigiga tengmi?",
          'Верно ли, что начиная со второго каждый член равен среднему арифметическому двух соседей?',
          'Is it true that from the second onward each term equals the arithmetic mean of its two neighbours?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Progressiyaning nomi ham shundan: har bir had qo'shnilarining o'rta arifmetigi.",
          'Верно. Отсюда и название прогрессии: каждый член это среднее арифметическое соседей.',
          'Correct. Hence the name of the progression: each term is the arithmetic mean of its neighbours.',
        ),
        hint: L(
          "5-ekranni eslang: o'n soni besh bilan o'n beshning o'rtasida turgan edi.",
          'Вспомни 5 экран: десятка стояла посередине между пятью и пятнадцатью.',
          'Recall screen 5: ten sat in the middle between five and fifteen.',
        ),
      },
      {
        id: 'q4',
        tag: 'ayirmani-notogri-hisoblash',
        ask: L(
          "Ayirmani topish uchun qaysi haddan qaysinisi ayiriladi?",
          'Чтобы найти разность, из какого члена какой вычитают?',
          'To find the difference, which term is subtracted from which?',
        ),
        options: [
          { id: 'ok', right: true, label: L('Keyingisidan oldingisi', 'Из следующего предыдущий', 'The previous from the next') },
          { id: 'no', label: L('Oldingisidan keyingisi', 'Из предыдущего следующий', 'The next from the previous') },
        ],
        ok: L(
          "To'g'ri. Teskarisiga hisoblansa, ayirmaning ishorasi noto'g'ri chiqadi.",
          'Верно. При обратном счёте у разности выйдет неверный знак.',
          'Correct. Computed the other way round, the difference gets the wrong sign.',
        ),
        hint: L(
          "2-ekranni eslang: besh minus o'n manfiy chiqqan edi, holbuki ketma-ketlik o'sardi.",
          'Вспомни 2 экран: пять минус десять давало отрицательное, хотя последовательность росла.',
          'Recall screen 2: five minus ten gave a negative, although the sequence was growing.',
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
    "Bir xil qadam va uning formulasi",
    'Одинаковый шаг и его формула',
    'The equal step and its formula',
  ),
  audio: [
    A('mount',
      "Birinchi ekranda o'zgarmaydigan narsa qo'shiladigan son ekanini topdingiz. Bugun shu son ayirma deb ataldi va butun mavzuni ochdi.",
      'На первом экране ты нашёл, что неизменным остаётся прибавляемое число. Сегодня это число назвали разностью, и оно раскрыло всю тему.',
      'On the first screen you found that what stays constant is the number being added. Today that number was named the difference, and it opened the whole topic.'),
    A('s1',
      "Siz ayirmani topishni, uning manfiy va nol bo'lishini, nomning sababini va n minus bir qoidasini o'rgandingiz.",
      'Ты освоил нахождение разности, её отрицательность и нулевость, причину названия и правило n минус один.',
      'You learned to find the difference, that it can be negative or zero, the reason for the name, and the n minus one rule.'),
    A('s2',
      "Keyingi darsda arifmetik progressiyaning yig'indisi: birinchi n ta hadni qanday tez qo'shish mumkin.",
      'В следующем уроке сумма арифметической прогрессии: как быстро сложить первые n членов.',
      'The next lesson covers the sum of an arithmetic progression: how to add the first n terms quickly.'),
  ],
  props: {
    mark: 'aₙ = a₁ + (n − 1)d',
    markNote: L(
      "qadamlar soni nomerdan bitta kam",
      'шагов на один меньше номера',
      'one step fewer than the index',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: progressiya yigindisi',
      'Следующий урок: сумма прогрессии',
      'Next lesson: the sum of a progression',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'ayirmani-notogri-hisoblash', ...S2 },
  { role: 'explain',  tool: 'seqtable', tag: 'ayirmani-notogri-hisoblash', ...S3 },
  { role: 'explain',  tag: 'ayirma-doim-musbat-deb-oylash', ...S4 },
  { role: 'explain',  tag: 'qoshni-hadlar-ortasini-unutish', ...S5 },
  { role: 'explain',  tag: 'nechta-qadam-adashtirish', ...S6 },
  { role: 'explain',  tag: 'nechta-qadam-adashtirish', ...S7 },
  { role: 'rule',     tag: 'nechta-qadam-adashtirish', ...S8 },
  { role: 'practice', tool: 'seqtable', tag: 'ayirma-doim-musbat-deb-oylash', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'ayirmani-notogri-hisoblash', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'nechta-qadam-adashtirish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'nechta-qadam-adashtirish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'ayirmani-notogri-hisoblash', ...S13 },
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
