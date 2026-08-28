// ============================================================================
// 9-sinf, Dars 21. KETMA-KETLIKLAR. BLOK B4 SHU DARS BILAN BOSHLANADI.
//
// REDAKSIYA 1, 2026-08-27. Darslik: Algebra 9, IV bob «Числовые
// последовательности. Прогрессии», 28-§ (150-152-bet).
//   Ta'rif (150-bet): har bir natural n ga a_n soni mos qo'yiladi;
//       a_1 birinchi had, a_n n-chi had, n esa hadning NOMERI.
//   1-masala (151-bet): a_n = n(n − 2), yuzinchi had a_100 = 9800.
//   2-masala (151-bet): a_n = 2n + 3. 1) 43 ga teng hadning nomeri n = 20;
//       2) 50 had bo'la oladimi — n = 23,5 chiqadi, natural emas, demak YO'Q.
//       Bu darsning ASOSIY YANGI FIKRI: nomer faqat natural bo'ladi.
//   3-masala (151-bet): REKURRENT usul, b_1 = 1, b_2 = 3, b_5 = 11.
//
// DARSLIKDAGI OPECHATKA (tekshirilgan 2026-08-27). 3-masalada formula
// `b_(n+2) = b_(n+1) + b_1` deb chop etilgan, lekin O'SHA YERDAGI yechim
// `b_3 = b_2 + b_1 = 4`, `b_4 = b_3 + b_2 = 7`, `b_5 = b_4 + b_3 = 11` deb
// hisoblaydi, ya'ni `+ b_n`. Bosilgan formula bo'yicha ketma-ketlik
// 1, 3, 4, 5, 6 bo'lardi va b_5 = 6 chiqardi, darslikning o'z javobi esa
// 11. Demak bosilgan formulada xato, yechim to'g'ri. Darsda YECHIM
// bo'yicha, ya'ni `b_(n+2) = b_(n+1) + b_n` olinadi.
//
// ASBOB: `SeqTable` — YANGI, sinfning beshinchi asbobi (PODXOD_9SINF.md
// §3, «прибор 5», B4 ning 7 darsi). Nega yangi asbob kerak bo'ldi:
// B3 blokining uchta darsi yangi asbobsiz yig'ilgan edi, chunki u yerda
// o'quvchining QO'L HARAKATI eskisi qolgan. Bu yerda harakat boshqa —
// jadvalni birma-bir to'ldirish va to'lgan jadvaldan qonuniyatni ko'rish.
//
// TEGLAR (o'zining):
//   nomer-va-had-adashtirish   — hadning NOMERINI hadning O'ZI bilan
//                                 adashtirish
//   nomer-natural-emasligini-unutish — nomer kasr chiqqanda ham son
//                                 ketma-ketlikning hadi deb hisoblash
//   rekurrentni-bir-qadamda-hisoblash — rekurrent formulada oraliq
//                                 hadlarni tashlab, birdan yakuniga sakrash
//   formulani-nomerga-notogri-qoyish — n o'rniga hadning qiymatini
//                                 qo'yib yuborish
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, SeqTable } from './asboblar.jsx'

export const META = {
  id: 'grade9-21',
  n: 21,
  row: 21,
  block: 'Б4',
  topic: L('Ketma-ketliklar', 'Последовательности', 'Sequences'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Ketma-ketlikda har bir natural nomer n ga bitta had a_n mos qo'yiladi: nomer va had ikki xil narsa",
    'В последовательности каждому натуральному номеру n соответствует один член a_n: номер и член это разные вещи',
    'In a sequence each natural index n corresponds to one term a_n: the index and the term are different things',
  ),
  L(
    "Nomer faqat natural son bo'ladi: nomer kasr chiqsa, bu son ketma-ketlikning hadi emas",
    'Номер бывает только натуральным: если номер получился дробным, это число не является членом последовательности',
    'An index is only ever a natural number: if the index comes out fractional, that number is not a term of the sequence',
  ),
  L(
    "Rekurrent formulada keyingi had oldingilari orqali topiladi, shuning uchun hadlar birin ketin hisoblanadi",
    'В рекуррентной формуле следующий член находится через предыдущие, поэтому члены считают по очереди',
    'In a recurrence the next term is found from the previous ones, so terms are computed one after another',
  ),
]

export const MISS = {
  'nomer-va-had-adashtirish': {
    what: L(
      "hadning nomeri hadning o'zi bilan adashtirildi",
      'номер члена перепутан с самим членом',
      "the term's index was confused with the term itself",
    ),
    wrong: null,
    at: 0,
  },
  'nomer-natural-emasligini-unutish': {
    what: L(
      "nomer kasr chiqqanda ham son had deb hisoblandi",
      'число сочтено членом, хотя номер получился дробным',
      'a number was counted as a term although the index came out fractional',
    ),
    wrong: null,
    at: 0,
  },
  'rekurrentni-bir-qadamda-hisoblash': {
    what: L(
      "rekurrent formulada oraliq hadlar tashlab ketildi",
      'в рекуррентной формуле пропущены промежуточные члены',
      'intermediate terms were skipped in the recurrence',
    ),
    wrong: null,
    at: 0,
  },
  'formulani-nomerga-notogri-qoyish': {
    what: L(
      "formulaga n o'rniga hadning qiymati qo'yildi",
      'в формулу вместо n подставлено значение члена',
      "the term's value was substituted into the formula instead of n",
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — darslikning o'z kirishi: raqamlangan hisoblar.
// ============================================================
const S1 = {
  eyebrow: L('NOMER VA QIYMAT', 'НОМЕР И ЗНАЧЕНИЕ', 'INDEX AND VALUE'),
  title: L(
    "Har bir nomerda o'z soni turadi",
    'У каждого номера стоит своё число',
    'Each index has its own number',
  ),
  audio: [
    A('mount',
      "Omonat bankida har bir hisobning nomeri bor. Birinchi hisobda bir mingta so'm, ikkinchisida ikki ming, uchinchisida yetti ming. Nomer va undagi pul ikki xil narsa.",
      'В сберегательном банке у каждого счёта есть номер. На первом счёте тысяча сумов, на втором две тысячи, на третьем семь тысяч. Номер и лежащие на нём деньги это разные вещи.',
      'In a savings bank each account has an index. The first holds one thousand sums, the second two thousand, the third seven thousand. The index and the money on it are different things.'),
    A('why',
      "Nomer birdan boshlanadi va tartib bilan boradi, qiymat esa istalgancha bo'lishi mumkin.",
      'Номер начинается с единицы и идёт по порядку, а значение может быть любым.',
      'The index starts at one and goes in order, while the value can be anything.'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Uchinchi hisobda yetti ming so'm bor. Bu yerda uch nima?",
      'На третьем счёте семь тысяч сумов. Что здесь тройка?',
      'The third account holds seven thousand sums. What is the three here?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L('Nomer', 'Номер', 'The index'),
      },
      {
        id: 'wrong',
        show: L('Qiymat', 'Значение', 'The value'),
        hint: L(
          "Qiymat yetti ming, u hisobda yotgan pul. Uch esa hisobning tartib raqami, ya'ni nomeri.",
          'Значение это семь тысяч, деньги на счёте. А тройка это порядковый номер счёта.',
          'The value is seven thousand, the money on the account. The three is the account order number, the index.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bugun shu ikki narsani ajratamiz: nomer n va had a n. Chalkashtirish bu mavzuning asosiy xatosi.",
      'Верно. Сегодня разделяем эти две вещи: номер n и член a n. Их путаница главная ошибка темы.',
      'Correct. Today we separate these two: the index n and the term a n. Confusing them is the main mistake of this topic.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — formulaga son qo'yish (funksiyadan tanish).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Formulaga nomerni qo'yish",
    'Подставляем номер в формулу',
    'Substituting the index into the formula',
  ),
  audio: [
    A('mount',
      "Ketma-ketlik formula bilan berilishi mumkin. Masalan, a n teng n karra n minus ikki.",
      'Последовательность можно задать формулой. Например, a n равно n умножить на n минус два.',
      'A sequence can be given by a formula. For example, a n equals n times n minus two.'),
    A('why',
      "Birinchi darsdagi funksiya mashinasini eslang: kirishga nomer beriladi, chiqishda had olinadi.",
      'Вспомни машину функции с первого урока: на вход подаётся номер, на выходе получается член.',
      'Recall the function machine from the first lesson: the index goes in, the term comes out.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('aₙ = n(n − 2)', 'aₙ = n(n − 2)', 'aₙ = n(n − 2)')}
      steps={[]}
      ask={L(
        "Uchinchi had nechaga teng?",
        'Чему равен третий член?',
        'What does the third term equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Uchga', 'Трём', 'Three') },
        {
          id: 'wrong',
          label: L('Bitta', 'Единице', 'One'),
          hint: L(
            "Nomer uch, demak n o'rniga uch qo'yiladi: uch karra uch minus ikki, ya'ni uch karra bir.",
            'Номер три, значит вместо n подставляется тройка: три умножить на три минус два, то есть три на один.',
            'The index is three, so three goes in place of n: three times three minus two, that is three times one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri: uch karra bir, uchga teng. Nomer uch, had esa uch, lekin bu tasodif, keyingi ekranda ular ajraladi.",
        'Верно: три на один, равно трём. Номер три и член три, но это совпадение, на следующем экране они разойдутся.',
        'Correct: three times one, equals three. The index is three and the term is three, but that is a coincidence, they diverge on the next screen.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — YANGI ASBOB: jadvalni to'ldirish.
// Darslikning 1-masalasi: a_n = n(n − 2).
// ============================================================
const S3 = {
  eyebrow: L('YANGI ASBOB', 'НОВЫЙ ПРИБОР', 'A NEW TOOL'),
  title: L(
    "Jadvalni birma-bir to'ldirish",
    'Заполняем таблицу по одной ячейке',
    'Filling the table one cell at a time',
  ),
  audio: [
    A('mount',
      "Har bir nomer uchun hadni hisoblang va katakka qo'ying. Chapdan o'ngga, birin ketin.",
      'Для каждого номера посчитай член и поставь в ячейку. Слева направо, по очереди.',
      'For each index compute the term and put it in the cell. Left to right, one by one.'),
    W('cell',
      "Nomer o'sib borsa ham, hadlar bir xil qadam bilan o'smaydi: bu qonuniyatni jadval ko'rsatadi.",
      'Хотя номер растёт, члены растут не одинаковым шагом: эту закономерность и показывает таблица.',
      'Although the index grows, the terms do not grow by an equal step: the table is what shows this.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SeqTable
      rule={L('aₙ = n(n − 2)', 'aₙ = n(n − 2)', 'aₙ = n(n − 2)')}
      ns={[1, 2, 3, 4, 5]}
      cells={[
        { value: '−1', wrong: '1', hint: L("Bir karra bir minus ikki: bir karra minus bir, minus bir bo'ladi.", 'Один умножить на один минус два: один на минус один, получается минус один.', 'One times one minus two: one times minus one, giving minus one.') },
        { value: '0', wrong: '2', hint: L("Ikki karra ikki minus ikki: ikki karra nol, nolga teng.", 'Два умножить на два минус два: два на ноль, равно нулю.', 'Two times two minus two: two times zero, equals zero.') },
        { value: '3', wrong: '1', hint: L("Uch karra uch minus ikki: uch karra bir, uchga teng.", 'Три умножить на три минус два: три на один, равно трём.', 'Three times three minus two: three times one, equals three.') },
        { value: '8', wrong: '6', hint: L("To'rt karra to'rt minus ikki: to'rt karra ikki, sakkizga teng.", 'Четыре умножить на четыре минус два: четыре на два, равно восьми.', 'Four times four minus two: four times two, equals eight.') },
        { value: '15', wrong: '10', hint: L("Besh karra besh minus ikki: besh karra uch, o'n beshga teng.", 'Пять умножить на пять минус два: пять на три, равно пятнадцати.', 'Five times five minus two: five times three, equals fifteen.') },
      ]}
      ask={L(
        "Har bir nomer uchun hadni tanlang",
        'Для каждого номера выбери член',
        'For each index choose the term',
      )}
      after={L(
        "Ana xolos. Jadval to'ldi: minus bir, nol, uch, sakkiz, o'n besh. Nomer bir qadam bilan o'sadi, hadlar esa tobora tezroq.",
        'Вот и всё. Таблица заполнена: минус один, ноль, три, восемь, пятнадцать. Номер растёт на один, а члены всё быстрее.',
        'That is all it takes. The table is filled: minus one, zero, three, eight, fifteen. The index grows by one, the terms ever faster.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — UZOQ HAD: a_100 (darslikning 1-masalasi).
// ============================================================
const S4 = {
  eyebrow: L('UZOQ HAD', 'ДАЛЁКИЙ ЧЛЕН', 'A DISTANT TERM'),
  title: L(
    "Yuzinchi hadga jadval kerak emas",
    'До сотого члена таблица не нужна',
    'No table is needed for the hundredth term',
  ),
  audio: [
    A('mount',
      "Yuzinchi hadni topish uchun yuzta katakni to'ldirish shart emas: formulaga darrov yuzni qo'ying.",
      'Чтобы найти сотый член, не нужно заполнять сто ячеек: сразу подставь в формулу сотню.',
      'To find the hundredth term you need not fill a hundred cells: substitute a hundred into the formula at once.'),
    A('why',
      "Formula bilan berilgan ketma-ketlikning kuchi shunda: istalgan nomerga darrov o'tish mumkin.",
      'В этом сила последовательности, заданной формулой: можно сразу перейти к любому номеру.',
      'That is the power of a sequence given by a formula: you can jump straight to any index.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('aₙ = n(n − 2),  a₁₀₀ = ?', 'aₙ = n(n − 2),  a₁₀₀ = ?', 'aₙ = n(n − 2),  a₁₀₀ = ?')}
      steps={[
        { id: 'p', head: L('Qo\'yamiz', 'Подставляем', 'Substitute'), lines: ['a₁₀₀ = 100 · (100 − 2)'] },
      ]}
      ask={L(
        "Yuzinchi had nechaga teng?",
        'Чему равен сотый член?',
        'What does the hundredth term equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '9800' },
        {
          id: 'wrong',
          label: '10000',
          hint: L(
            "Yuz karra yuz emas, yuz karra to'qson sakkiz: qavs ichidan ikki ayiriladi.",
            'Не сто на сто, а сто на девяносто восемь: в скобках вычитается двойка.',
            'Not a hundred times a hundred, but a hundred times ninety eight: two is subtracted inside the brackets.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Yuz karra to'qson sakkiz, to'qqiz ming sakkiz yuz. Jadvalsiz, bitta qadamda.",
        'Верно. Сто на девяносто восемь, девять тысяч восемьсот. Без таблицы, за один шаг.',
        'Correct. A hundred times ninety eight, nine thousand eight hundred. Without a table, in one step.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — TESKARI SAVOL: nomerni topish.
// Darslikning 2-masalasi, 1-qismi.
// ============================================================
const S5 = {
  eyebrow: L('TESKARI SAVOL', 'ОБРАТНЫЙ ВОПРОС', 'THE REVERSE QUESTION'),
  title: L(
    "Had ma'lum, nomer noma'lum",
    'Член известен, номер неизвестен',
    'The term is known, the index is not',
  ),
  audio: [
    A('mount',
      "Yangi ketma-ketlik: a n teng ikki n qo'shi uch. Endi teskari savol: qaysi nomerdagi had qirq uchga teng?",
      'Новая последовательность: a n равно два n плюс три. Теперь обратный вопрос: у члена с каким номером значение сорок три?',
      'A new sequence: a n equals two n plus three. Now the reverse question: which index has the term forty three?'),
    A('why',
      "Bu tenglama: ikki n qo'shi uch teng qirq uch. Uni n ga nisbatan yeching.",
      'Это уравнение: два n плюс три равно сорока трём. Реши его относительно n.',
      'This is an equation: two n plus three equals forty three. Solve it for n.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('aₙ = 2n + 3,  aₙ = 43', 'aₙ = 2n + 3,  aₙ = 43', 'aₙ = 2n + 3,  aₙ = 43')}
      steps={[
        { id: 'e', head: L('Tenglama', 'Уравнение', 'The equation'), lines: ['2n + 3 = 43', '2n = 40'] },
      ]}
      ask={L(
        "Bu hadning nomeri qanday?",
        'Каков номер этого члена?',
        'What is the index of this term?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Yigirma', 'Двадцать', 'Twenty') },
        {
          id: 'wrong',
          label: L('Qirq', 'Сорок', 'Forty'),
          hint: L(
            "Ikki n qirqqa teng, demak n ning o'zi yigirma: yana ikkiga bo'lish kerak.",
            'Два n равно сорока, значит сам n равен двадцати: нужно ещё разделить на два.',
            'Two n equals forty, so n itself is twenty: one more division by two is needed.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Yigirmanchi had qirq uchga teng. Nomer yigirma, had esa qirq uch: ular butunlay boshqa sonlar.",
        'Верно. Двадцатый член равен сорока трём. Номер двадцать, а член сорок три: это совсем разные числа.',
        'Correct. The twentieth term equals forty three. The index is twenty, the term is forty three: entirely different numbers.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — DARSNING BOSH FIKRI: nomer natural.
// Darslikning 2-masalasi, 2-qismi.
// ============================================================
const S6 = {
  eyebrow: L('NOMER NATURAL', 'НОМЕР НАТУРАЛЕН', 'THE INDEX IS NATURAL'),
  title: L(
    "Har qanday son had bo'la olmaydi",
    'Не всякое число может быть членом',
    'Not every number can be a term',
  ),
  audio: [
    A('mount',
      "Xuddi shu ketma-ketlik. Ellik soni uning hadi bo'la oladimi? Tenglamani yeching: ikki n qo'shi uch teng ellik.",
      'Та же последовательность. Может ли пятьдесят быть её членом? Реши уравнение: два n плюс три равно пятидесяти.',
      'The same sequence. Can fifty be one of its terms? Solve the equation: two n plus three equals fifty.'),
    A('why',
      "Nomer nima bo'lishi mumkinligini eslang: hisoblar bir, ikki, uch deb raqamlanadi.",
      'Вспомни, каким может быть номер: счета нумеруются один, два, три.',
      'Recall what an index can be: accounts are numbered one, two, three.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('2n + 3 = 50', '2n + 3 = 50', '2n + 3 = 50')}
      steps={[
        { id: 'e', head: L('Yechamiz', 'Решаем', 'Solve'), lines: ['2n = 47', 'n = 23,5'] },
      ]}
      ask={L(
        "Nomer yigirma uch butun besh chiqdi. Ellik bu ketma-ketlikning hadimi?",
        'Номер получился двадцать три целых пять. Является ли пятьдесят членом этой последовательности?',
        'The index came out twenty three point five. Is fifty a term of this sequence?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Yo'q, chunki nomer natural son emas", 'Нет, потому что номер не натуральное число', 'No, because the index is not a natural number'),
        },
        {
          id: 'wrong',
          label: L("Ha, nomeri yigirma uch butun besh", 'Да, с номером двадцать три целых пять', 'Yes, with index twenty three point five'),
          hint: L(
            "Yarim hisob bo'lmaganidek, yarim nomer ham bo'lmaydi. Nomer faqat bir, ikki, uch kabi natural son bo'ladi.",
            'Как не бывает половины счёта, так не бывает и половины номера. Номер только натуральный: один, два, три.',
            'Just as there is no half an account, there is no half an index. An index is only natural: one, two, three.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu darsning bosh fikri: tenglama yechilsa ham, nomer natural chiqmasa, son ketma-ketlikning hadi emas.",
        'Верно. Это главная мысль урока: даже если уравнение решилось, но номер не натуральный, число не является членом последовательности.',
        'Correct. This is the main idea of the lesson: even if the equation solves, if the index is not natural, the number is not a term.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — REKURRENT USUL (darslikning 3-masalasi).
// ============================================================
const S7 = {
  eyebrow: L('REKURRENT USUL', 'РЕКУРРЕНТНЫЙ СПОСОБ', 'THE RECURRENT WAY'),
  title: L(
    "Keyingi had oldingilari orqali",
    'Следующий член через предыдущие',
    'The next term from the previous ones',
  ),
  audio: [
    A('mount',
      "Ketma-ketlikni boshqacha ham berish mumkin: har bir had oldingi ikkitasining yig'indisi. Boshlanishi berilgan: birinchi had bir, ikkinchisi uch.",
      'Последовательность можно задать иначе: каждый член это сумма двух предыдущих. Начало дано: первый член один, второй три.',
      'A sequence can be given differently: each term is the sum of the two before it. The start is given: the first term is one, the second is three.'),
    W('cell',
      "Bunday usul rekurrent deyiladi. Bu yerda uzoq hadga sakrab bo'lmaydi: hadlar birin ketin hisoblanadi.",
      'Такой способ называют рекуррентным. Здесь нельзя перепрыгнуть к далёкому члену: члены считаются по очереди.',
      'Such a way is called recurrent. Here you cannot jump to a distant term: terms are computed one after another.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SeqTable
      rule={L('b₁ = 1,  b₂ = 3,  bₙ₊₂ = bₙ₊₁ + bₙ', 'b₁ = 1,  b₂ = 3,  bₙ₊₂ = bₙ₊₁ + bₙ', 'b₁ = 1,  b₂ = 3,  bₙ₊₂ = bₙ₊₁ + bₙ')}
      ns={[1, 2, 3, 4, 5]}
      cells={[
        { value: '1', wrong: '3', hint: L("Birinchi had shartda berilgan: birga teng.", 'Первый член дан в условии: равен единице.', 'The first term is given in the statement: it equals one.') },
        { value: '3', wrong: '1', hint: L("Ikkinchi had ham shartda berilgan: uchga teng.", 'Второй член тоже дан в условии: равен трём.', 'The second term is also given: it equals three.') },
        { value: '4', wrong: '2', hint: L("Uchinchi had oldingi ikkitasining yig'indisi: uch qo'shi bir, to'rt.", 'Третий член сумма двух предыдущих: три плюс один, четыре.', 'The third term is the sum of the two before: three plus one, four.') },
        { value: '7', wrong: '5', hint: L("To'rtinchi had to'rt qo'shi uch: yettiga teng. Oldingi IKKITASI qo'shiladi.", 'Четвёртый член четыре плюс три: равно семи. Складываются ДВА предыдущих.', 'The fourth term is four plus three: seven. The TWO previous ones are added.') },
        { value: '11', wrong: '10', hint: L("Beshinchi had yetti qo'shi to'rt: o'n birga teng.", 'Пятый член семь плюс четыре: равно одиннадцати.', 'The fifth term is seven plus four: eleven.') },
      ]}
      ask={L(
        "Jadvalni to'ldiring: har bir had oldingi ikkitasining yig'indisi",
        'Заполни таблицу: каждый член это сумма двух предыдущих',
        'Fill the table: each term is the sum of the two before it',
      )}
      after={L(
        "Ana xolos. Beshinchi had o'n birga teng. Uzoq hadga sakrab bo'lmadi: har birini oldingisidan hisoblashga to'g'ri keldi.",
        'Вот и всё. Пятый член равен одиннадцати. Перепрыгнуть к далёкому члену не вышло: каждый пришлось считать из предыдущих.',
        'That is all it takes. The fifth term is eleven. Jumping to a distant term did not work: each had to be computed from the previous ones.',
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
    "Algebra 9, 28-§, 1-3-masalalar (150-151-bet)",
    'Алгебра 9, §28, задачи 1-3 (стр. 150-151)',
    'Algebra 9, §28, problems 1-3 (p. 150-151)',
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
          "Nomer qanday son bo'lishi mumkin?",
          'Каким числом может быть номер?',
          'What kind of number can an index be?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L('Faqat natural: bir, ikki, uch', 'Только натуральным: один, два, три', 'Only natural: one, two, three'),
          },
          {
            id: 'wrong',
            label: L('Har qanday son', 'Любым числом', 'Any number'),
            hint: L(
              "6-ekranni eslang: nomer kasr chiqqani uchun ellik soni had bo'la olmadi.",
              'Вспомни 6 экран: именно из-за дробного номера пятьдесят не смогло быть членом.',
              'Recall screen 6: it was the fractional index that stopped fifty from being a term.',
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
    "Nomer, had va ikki xil berilish usuli",
    'Номер, член и два способа задания',
    'Index, term, and two ways of defining',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz jadval to'ldirdingiz, uzoq hadga sakradingiz, nomerni topdingiz va rekurrent usulni ko'rdingiz. Endi ular qoida sifatida.",
      'На семи экранах ты заполнил таблицу, перепрыгнул к далёкому члену, нашёл номер и увидел рекуррентный способ. Теперь они в виде правила.',
      'On seven screens you filled a table, jumped to a distant term, found an index, and saw the recurrent way. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SeqTable TAKRORI, mustaqil.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Yangi formula, endi mustaqil",
    'Новая формула, теперь самостоятельно',
    'A new formula, now on your own',
  ),
  audio: [
    A('mount',
      "Yangi ketma-ketlik: a n teng n kvadrat minus n. Jadvalni to'ldiring.",
      'Новая последовательность: a n равно n в квадрате минус n. Заполни таблицу.',
      'A new sequence: a n equals n squared minus n. Fill the table.'),
    A('why',
      "Har bir katakda n o'rniga o'z nomerini qo'ying.",
      'В каждой ячейке подставляй вместо n её собственный номер.',
      'In each cell substitute its own index in place of n.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SeqTable
      rule={L('aₙ = n² − n', 'aₙ = n² − n', 'aₙ = n² − n')}
      ns={[1, 2, 3, 4, 5]}
      cells={[
        { value: '0', wrong: '1', hint: L("Bir kvadrat minus bir: bir minus bir, nolga teng.", 'Один в квадрате минус один: один минус один, равно нулю.', 'One squared minus one: one minus one, equals zero.') },
        { value: '2', wrong: '3', hint: L("Ikki kvadrat minus ikki: to'rt minus ikki, ikkiga teng.", 'Два в квадрате минус два: четыре минус два, равно двум.', 'Two squared minus two: four minus two, equals two.') },
        { value: '6', wrong: '7', hint: L("Uch kvadrat minus uch: to'qqiz minus uch, oltiga teng.", 'Три в квадрате минус три: девять минус три, равно шести.', 'Three squared minus three: nine minus three, equals six.') },
        { value: '12', wrong: '13', hint: L("To'rt kvadrat minus to'rt: o'n olti minus to'rt, o'n ikkiga teng.", 'Четыре в квадрате минус четыре: шестнадцать минус четыре, равно двенадцати.', 'Four squared minus four: sixteen minus four, equals twelve.') },
        { value: '20', wrong: '21', hint: L("Besh kvadrat minus besh: yigirma besh minus besh, yigirmaga teng.", 'Пять в квадрате минус пять: двадцать пять минус пять, равно двадцати.', 'Five squared minus five: twenty five minus five, equals twenty.') },
      ]}
      ask={L(
        "Har bir nomer uchun hadni tanlang",
        'Для каждого номера выбери член',
        'For each index choose the term',
      )}
      after={L(
        "Ana xolos. Nol, ikki, olti, o'n ikki, yigirma. Har bir had ikki qo'shni sonning ko'paytmasi.",
        'Вот и всё. Ноль, два, шесть, двенадцать, двадцать. Каждый член это произведение двух соседних чисел.',
        'That is all it takes. Zero, two, six, twelve, twenty. Each term is the product of two neighbouring numbers.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: nomer bo'yicha had.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Nomerdan hadga",
    'От номера к члену',
    'From index to term',
  ),
  audio: [
    A('mount',
      "To'rtta formula. Har birida so'ralgan hadni hisoblang.",
      'Четыре формулы. В каждой посчитай запрошенный член.',
      'Four formulas. In each, compute the requested term.'),
    A('why',
      "Nomerni formulaga qo'ying, hadning qiymatini emas.",
      'Подставляй в формулу номер, а не значение члена.',
      'Substitute the index into the formula, not the value of the term.'),
  ],
  props: {
    stepLabel: L('Formula', 'Формула', 'Formula'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham hisoblandi: formulaga har doim NOMER qo'yiladi.",
      'Все четыре посчитаны: в формулу всегда подставляется НОМЕР.',
      'All four are computed: it is always the INDEX that goes into the formula.',
    ),
    tasks: [
      {
        expr: 'aₙ = 3n − 1,   a₄ = ?',
        question: L('To\'rtinchi had nechaga teng?', 'Чему равен четвёртый член?', 'What does the fourth term equal?'),
        ok: L("Ha. Uch karra to'rt minus bir, o'n bir.", 'Да. Три на четыре минус один, одиннадцать.', 'Yes. Three times four minus one, eleven.'),
        items: [
          { id: 'a', right: true, label: '11' },
          { id: 'b', label: '12', hint: L("Uch karra to'rt o'n ikki, undan yana bir ayiriladi.", 'Три на четыре двенадцать, из них ещё вычитается единица.', 'Three times four is twelve, and one more is subtracted.') },
        ],
        solution: ['a₄ = 3 · 4 − 1 = 11'],
      },
      {
        expr: 'aₙ = n² + 1,   a₆ = ?',
        question: L('Oltinchi had nechaga teng?', 'Чему равен шестой член?', 'What does the sixth term equal?'),
        ok: L("Ha. Olti kvadrat o'ttiz olti, qo'shi bir, o'ttiz yetti.", 'Да. Шесть в квадрате тридцать шесть, плюс один, тридцать семь.', 'Yes. Six squared is thirty six, plus one, thirty seven.'),
        items: [
          { id: 'a', right: true, label: '37' },
          { id: 'b', label: '13', hint: L("Olti kvadrat bu olti karra olti, ya'ni o'ttiz olti, ikki karra olti emas.", 'Шесть в квадрате это шесть на шесть, то есть тридцать шесть, а не два на шесть.', 'Six squared is six times six, that is thirty six, not two times six.') },
        ],
        solution: ['a₆ = 6² + 1 = 36 + 1 = 37'],
      },
      {
        expr: 'aₙ = 2n + 3,   aₙ = 43,   n = ?',
        question: L('Bu hadning nomeri qanday?', 'Каков номер этого члена?', 'What is the index of this term?'),
        ok: L("Ha. Ikki n qirqqa teng, n yigirmaga teng.", 'Да. Два n равно сорока, n равно двадцати.', 'Yes. Two n equals forty, n equals twenty.'),
        items: [
          { id: 'a', right: true, label: 'n = 20' },
          { id: 'b', label: 'n = 43', hint: L("Qirq uch bu hadning qiymati, nomeri emas. Nomerni topish uchun tenglama yechiladi.", 'Сорок три это значение члена, а не его номер. Чтобы найти номер, решают уравнение.', 'Forty three is the value of the term, not its index. To find the index, solve the equation.') },
        ],
        solution: ['2n + 3 = 43', '2n = 40,  n = 20'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: son had bo'la oladimi.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Bu son had bo'la oladimi",
    'Может ли это число быть членом',
    'Can this number be a term',
  ),
  audio: [
    A('mount',
      "Har savolda ketma-ketlik va son berilgan. Tenglamani yechib, nomer natural chiqadimi, tekshiring.",
      'В каждом вопросе даны последовательность и число. Реши уравнение и проверь, натуральный ли получится номер.',
      'Each question gives a sequence and a number. Solve the equation and check whether the index comes out natural.'),
    A('why',
      "Nomer kasr yoki manfiy chiqsa, son had emas.",
      'Если номер получился дробным или отрицательным, число не является членом.',
      'If the index comes out fractional or negative, the number is not a term.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tekshirildi: tenglama yechilishi hali kifoya emas, nomer natural bo'lishi ham kerak.",
      'Все три проверены: решить уравнение ещё не достаточно, номер должен быть натуральным.',
      'All three are checked: solving the equation is not enough, the index must also be natural.',
    ),
    tasks: [
      {
        expr: '4n − 1 = 27',
        question: L('Yigirma yetti bu ketma-ketlikning hadimi?', 'Является ли двадцать семь членом этой последовательности?', 'Is twenty seven a term of this sequence?'),
        ok: L("Ha. To'rt n yigirma sakkizga teng, n yettiga teng, bu natural son.", 'Да. Четыре n равно двадцати восьми, n равно семи, это натуральное число.', 'Yes. Four n equals twenty eight, n equals seven, a natural number.'),
        items: [
          { id: 'a', right: true, label: L('Ha, nomeri yetti', 'Да, с номером семь', 'Yes, with index seven') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Tenglamani yeching: to'rt n minus bir teng yigirma yetti, demak to'rt n yigirma sakkiz, n yetti. Yetti natural son.", 'Реши уравнение: четыре n минус один равно двадцати семи, значит четыре n двадцать восемь, n семь. Семь натуральное число.', 'Solve: four n minus one equals twenty seven, so four n is twenty eight, n is seven. Seven is natural.') },
        ],
        solution: ['4n − 1 = 27', '4n = 28,  n = 7'],
      },
      {
        expr: '4n − 1 = 30',
        question: L('O\'ttiz bu ketma-ketlikning hadimi?', 'Является ли тридцать членом этой последовательности?', 'Is thirty a term of this sequence?'),
        ok: L("Yo'q. To'rt n o'ttiz birga teng, n esa yetti butun yigirma besh, natural emas.", 'Нет. Четыре n равно тридцати одному, а n семь целых двадцать пять, не натуральное.', 'No. Four n equals thirty one, so n is seven point two five, not natural.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, nomer natural emas", 'Нет, номер не натуральный', 'No, the index is not natural') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Tenglama yechildi, lekin nomer kasr chiqdi. Kasr nomer bo'lmaydi, demak son had emas.", 'Уравнение решилось, но номер получился дробным. Дробного номера не бывает, значит число не член.', 'The equation solved, but the index came out fractional. There is no fractional index, so the number is not a term.') },
        ],
        solution: ['4n − 1 = 30', '4n = 31,  n = 7,75'],
      },
      {
        expr: 'n² = 20',
        question: L('Yigirma bu ketma-ketlikning hadimi?', 'Является ли двадцать членом этой последовательности?', 'Is twenty a term of this sequence?'),
        ok: L("Yo'q. Yigirma biror natural sonning kvadrati emas: to'rt kvadrat o'n olti, besh kvadrat yigirma besh.", 'Нет. Двадцать не является квадратом натурального числа: четыре в квадрате шестнадцать, пять в квадрате двадцать пять.', 'No. Twenty is not the square of a natural number: four squared is sixteen, five squared is twenty five.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaysi natural sonning kvadrati yigirmaga teng? To'rt va besh orasida bunday son yo'q.", 'Квадрат какого натурального числа равен двадцати? Между четырьмя и пятью такого числа нет.', 'The square of which natural number is twenty? There is no such number between four and five.') },
        ],
        solution: ['n² = 20', L('Natural yechim yoq: 4² = 16, 5² = 25', 'Натурального решения нет: 4² = 16, 5² = 25', 'No natural solution: 4² = 16, 5² = 25')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Ozoda rekurrent formulada oraliq hadlarni tashlagan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Rekurrentda oraliq hadlarni tashlash",
    'Пропустить промежуточные члены в рекуррентной',
    'Skipping intermediate terms in a recurrence',
  ),
  audio: [
    A('mount',
      "Ozodaning yechimi. Shart: birinchi had ikki, har bir keyingisi oldingisidan uch marta katta. U to'rtinchi hadni topish uchun ikkini uchga ko'paytirib, oltini yozgan.",
      'Решение Озоды. Условие: первый член два, каждый следующий втрое больше предыдущего. Чтобы найти четвёртый член, она умножила два на три и записала шесть.',
      "Ozoda's solution. The statement: the first term is two, each next is three times the previous. To find the fourth term she multiplied two by three and wrote six."),
    A('why',
      "Uch marta ko'paytirish nechta qadamda bajarilishi kerak edi?",
      'Сколько раз нужно было умножить на три?',
      'How many times should the multiplication by three have happened?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Birinchidan to'rtinchiga o'tish uchun uch qadam kerak: ikkinchi, uchinchi va to'rtinchi had. Ozoda faqat bitta qadam qilgan.",
      'От первого к четвёртому нужно три шага: второй, третий и четвёртый член. Озода сделала только один шаг.',
      'Going from the first to the fourth needs three steps: the second, third and fourth term. Ozoda made only one.',
    ),
    tasks: [
      {
        expr: 'a₁ = 2,  aₙ₊₁ = 3aₙ,   a₄ = ?',
        question: L(
          "Ozoda a to'rtni oltiga teng deb yozdi. Birinchi haddan to'rtinchisiga o'tish uchun nechta qadam kerak?",
          'Озода записала a четыре равным шести. Сколько шагов нужно, чтобы дойти от первого члена до четвёртого?',
          'Ozoda wrote a four as six. How many steps are needed to get from the first term to the fourth?',
        ),
        ok: L(
          "To'g'ri: uch qadam. Ikki, olti, o'n sakkiz, ellik to'rt. Ozoda bitta qadamdan keyin to'xtab, ikkinchi hadni to'rtinchi deb yozgan.",
          'Верно: три шага. Два, шесть, восемнадцать, пятьдесят четыре. Озода остановилась после одного шага и записала второй член как четвёртый.',
          'Correct: three steps. Two, six, eighteen, fifty four. Ozoda stopped after one step and wrote the second term as the fourth.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L('Uch qadam, javob ellik to\'rt', 'Три шага, ответ пятьдесят четыре', 'Three steps, the answer is fifty four'),
          },
          {
            id: 'b',
            label: L("Bitta qadam, Ozoda to'g'ri qilgan", 'Один шаг, Озода права', 'One step, Ozoda is right'),
            hint: L("Bitta ko'paytirish birinchi haddan IKKINCHISIGA olib keladi. To'rtinchiga yetish uchun yana ikki marta ko'paytirish kerak.", 'Одно умножение ведёт от первого члена ко ВТОРОМУ. Чтобы дойти до четвёртого, нужно умножить ещё дважды.', 'One multiplication leads from the first term to the SECOND. To reach the fourth, two more are needed.'),
          },
        ],
        solution: [
          'a₁ = 2,  a₂ = 6,  a₃ = 18,  a₄ = 54',
          L('Ozoda a₂ ni a₄ deb yozgan', 'Озода записала a₂ как a₄', 'Ozoda wrote a₂ as a₄'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — jadvaldan formulani o'qish.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Teskari yo'l: jadvaldan formulaga",
    'Обратный путь: от таблицы к формуле',
    'The reverse route: from table to formula',
  ),
  audio: [
    A('mount',
      "Bu safar jadval berilgan, formula esa yo'q: uch, besh, yetti, to'qqiz. Qaysi formula bu hadlarni beradi?",
      'На этот раз дана таблица, а формулы нет: три, пять, семь, девять. Какая формула даёт эти члены?',
      'This time the table is given but the formula is not: three, five, seven, nine. Which formula gives these terms?'),
    A('why',
      "Har bir nomerni mos hadga solishtiring: nomer bir qadam o'sganda had ikki qadam o'sadi.",
      'Сопоставь каждый номер с его членом: когда номер растёт на один, член растёт на два.',
      'Match each index with its term: when the index grows by one, the term grows by two.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: formulani tekshirish uchun uni har bir nomerga qo'yib ko'rish kifoya.",
      'Найдено: чтобы проверить формулу, достаточно подставить в неё каждый номер.',
      'Found: to check a formula, it is enough to substitute each index into it.',
    ),
    tasks: [
      {
        expr: 'a₁ = 3,  a₂ = 5,  a₃ = 7,  a₄ = 9',
        question: L(
          "Qaysi formula bu jadvalni beradi?",
          'Какая формула даёт эту таблицу?',
          'Which formula gives this table?',
        ),
        ok: L(
          "Ha. Bir uchni, ikki beshni, uch yettini, to'rt to'qqizni beradi: to'rttasi ham to'g'ri.",
          'Да. Один даёт три, два пять, три семь, четыре девять: все четыре сходятся.',
          'Yes. One gives three, two gives five, three gives seven, four gives nine: all four match.',
        ),
        items: [
          { id: 'a', right: true, label: 'aₙ = 2n + 1' },
          { id: 'b', label: 'aₙ = n + 2', hint: L("Bu formulani tekshiring: birinchi nomerda u uchni beradi, lekin ikkinchisida to'rtni, jadvalda esa besh turibdi.", 'Проверь эту формулу: при первом номере она даёт три, но при втором четыре, а в таблице пять.', 'Check this formula: at the first index it gives three, but at the second it gives four, while the table has five.') },
        ],
        solution: [
          'a₁ = 2 · 1 + 1 = 3',
          'a₂ = 2 · 2 + 1 = 5',
          L('Formula: aₙ = 2n + 1', 'Формула: aₙ = 2n + 1', 'Formula: aₙ = 2n + 1'),
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
    "Blits: nomer, had, rekurrent",
    'Блиц: номер, член, рекуррентность',
    'Blitz: index, term, recurrence',
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
        tag: 'nomer-natural-emasligini-unutish',
        ask: L(
          "Nomer kasr chiqsa, bu son ketma-ketlikning hadi bo'ladimi?",
          'Если номер получился дробным, является ли число членом последовательности?',
          'If the index comes out fractional, is the number a term of the sequence?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Nomer faqat natural bo'ladi: kasr nomer bo'lmaydi.",
          'Верно. Номер бывает только натуральным: дробного номера не существует.',
          'Correct. An index is only ever natural: there is no fractional index.',
        ),
        hint: L(
          "6-ekranni eslang: ellik uchun nomer yigirma uch butun besh chiqqan va son had bo'lmagan.",
          'Вспомни 6 экран: для пятидесяти номер вышел двадцать три целых пять, и число не оказалось членом.',
          'Recall screen 6: for fifty the index came out twenty three point five, and the number was not a term.',
        ),
      },
      {
        id: 'q2',
        tag: 'nomer-va-had-adashtirish',
        ask: L(
          "Formulaga nima qo'yiladi: hadning nomerimi yoki qiymatimi?",
          'Что подставляют в формулу: номер члена или его значение?',
          'What is substituted into the formula: the index of the term or its value?',
        ),
        options: [
          { id: 'n', right: true, label: L('Nomer', 'Номер', 'The index') },
          { id: 'v', label: L('Qiymat', 'Значение', 'The value') },
        ],
        ok: L(
          "To'g'ri. Formula nomerdan hadni hisoblaydi, teskarisini emas.",
          'Верно. Формула вычисляет член по номеру, а не наоборот.',
          'Correct. The formula computes the term from the index, not the other way round.',
        ),
        hint: L(
          "5-ekranni eslang: nomer yigirma edi, had esa qirq uch. Bular butunlay boshqa sonlar.",
          'Вспомни 5 экран: номер был двадцать, а член сорок три. Это совсем разные числа.',
          'Recall screen 5: the index was twenty and the term forty three. Entirely different numbers.',
        ),
      },
      {
        id: 'q3',
        tag: 'rekurrentni-bir-qadamda-hisoblash',
        ask: L(
          "Rekurrent formulada uzoq hadga darrov sakrash mumkinmi?",
          'Можно ли в рекуррентной формуле сразу перепрыгнуть к далёкому члену?',
          'In a recurrence, can you jump straight to a distant term?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Har bir had oldingilaridan hisoblanadi, shuning uchun hadlar birin ketin topiladi.",
          'Верно. Каждый член вычисляется из предыдущих, поэтому члены находят по очереди.',
          'Correct. Each term is computed from the previous ones, so terms are found one after another.',
        ),
        hint: L(
          "7-ekranni eslang: beshinchi hadga yetish uchun uchinchi va to'rtinchisini ham hisoblashga to'g'ri kelgan.",
          'Вспомни 7 экран: чтобы дойти до пятого члена, пришлось посчитать и третий, и четвёртый.',
          'Recall screen 7: to reach the fifth term, the third and fourth had to be computed too.',
        ),
      },
      {
        id: 'q4',
        tag: 'formulani-nomerga-notogri-qoyish',
        ask: L(
          "Formula bilan berilgan ketma-ketlikda yuzinchi hadga darrov o'tish mumkinmi?",
          'Можно ли в последовательности, заданной формулой, сразу перейти к сотому члену?',
          'In a sequence given by a formula, can you go straight to the hundredth term?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Formulaga yuzni qo'yish kifoya, oraliq hadlarni hisoblash shart emas.",
          'Верно. Достаточно подставить в формулу сотню, промежуточные члены считать не нужно.',
          'Correct. It is enough to substitute a hundred into the formula, no intermediate terms are needed.',
        ),
        hint: L(
          "4-ekranni eslang: a yuz bitta qadamda topilgan edi, to'qqiz ming sakkiz yuz.",
          'Вспомни 4 экран: a сто было найдено за один шаг, девять тысяч восемьсот.',
          'Recall screen 4: a hundred was found in one step, nine thousand eight hundred.',
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
    "Nomer, had va ikki usul",
    'Номер, член и два способа',
    'Index, term and two ways',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda nomer va qiymat ikki xil narsa ekanini ajratdingiz. Bugun shu farq butun mavzuning kaliti bo'ldi.",
      'На первом экране ты различил номер и значение как две разные вещи. Сегодня это различие стало ключом ко всей теме.',
      'On the first screen you told the index and the value apart. Today that distinction became the key to the whole topic.'),
    A('s1',
      "Siz jadval to'ldirishni, uzoq hadga sakrashni, had bo'yicha nomerni topishni va rekurrent usulni o'rgandingiz.",
      'Ты освоил заполнение таблицы, переход к далёкому члену, поиск номера по члену и рекуррентный способ.',
      'You learned to fill the table, to jump to a distant term, to find an index from a term, and the recurrent way.'),
    A('s2',
      "Keyingi darsda arifmetik progressiya: hadlar bir xil qadam bilan o'sadigan ketma-ketlik.",
      'В следующем уроке арифметическая прогрессия: последовательность, где члены растут одинаковым шагом.',
      'The next lesson covers the arithmetic progression: a sequence whose terms grow by an equal step.'),
  ],
  props: {
    mark: 'aₙ = n(n − 2)',
    markNote: L(
      "nomerdan hadga",
      'от номера к члену',
      'from index to term',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: arifmetik progressiya',
      'Следующий урок: арифметическая прогрессия',
      'Next lesson: the arithmetic progression',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'nomer-va-had-adashtirish', ...S2 },
  { role: 'explain',  tool: 'seqtable', tag: 'formulani-nomerga-notogri-qoyish', ...S3 },
  { role: 'explain',  tag: 'formulani-nomerga-notogri-qoyish', ...S4 },
  { role: 'explain',  tag: 'nomer-va-had-adashtirish', ...S5 },
  { role: 'explain',  tag: 'nomer-natural-emasligini-unutish', ...S6 },
  { role: 'explain',  tool: 'seqtable', tag: 'rekurrentni-bir-qadamda-hisoblash', ...S7 },
  { role: 'rule',     tag: 'nomer-natural-emasligini-unutish', ...S8 },
  { role: 'practice', tool: 'seqtable', tag: 'formulani-nomerga-notogri-qoyish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'nomer-va-had-adashtirish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'nomer-natural-emasligini-unutish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'rekurrentni-bir-qadamda-hisoblash', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'formulani-nomerga-notogri-qoyish', ...S13 },
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
