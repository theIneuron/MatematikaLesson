// ============================================================================
// 7-sinf, Dars 29. FORMULALAR BILAN KO'PAYTUVCHILARGA AJRATISH.
// (Разложение на множители с помощью формул сокращённого умножения)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// FORMULALAR TESKARI TOMONGA ISHLAYDI. 28-darsda o'quvchi qavslarga qarab
// formulani tanidi. Bu yerda qavs YO'Q: ko'phad berilgan va uni FORMULAGA
// YIG'ISH kerak.
//
// BELGI BOSHQACHA O'QILADI: hadlar SONI va ISHORASI.
//   uch had  -> chetdagilar kvadrat bo'lishi kerak, o'rtadagisi esa
//               ularning ildizlarining IKKI KARRA ko'paytmasi;
//   ikki had, minus -> kvadratlar ayirmasi;
//   ikki had, qo'shuv -> ajratilmaydi.
//
// TEKSHIRUV -- KO'PAYTIRISH. Yig'ilgan javob ko'paytirilganda boshlang'ich
// ko'phadni qaytarishi SHART, va 4-ekran shuni to'rtburchakda ko'rsatadi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_29'
const LESSON_TITLE = L("Formulalar bilan ko'paytuvchilarga ajratish", 'Разложение на множители с помощью формул', 'Factoring with the special product formulas')
const LESSON_NO = L('29-dars', 'Урок 29', 'Lesson 29')
const BLOCK = { label: L('B5-blok', 'Блок Б5', 'Block B5'), from: 25, to: 32, current: 29 }

const TAGS = {
  Z1: L('formula noto\'g\'ri tanlandi', 'формула выбрана не та', 'the wrong formula was chosen'),
  Z2: L("o'rta had tekshirilmadi", 'средний член не проверен', 'the middle term was not checked'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L('koeffitsiyentdan ildiz', 'корень из коэффициента', 'the root of the coefficient'),
  Z5: L('yozuvning belgisi o\'qilmadi', 'признак записи не прочитан', 'the mark of the record was not read'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Uch hadli yozuv ikki xil ajratilgan.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("FORMULA TESKARI TOMONGA", 'ФОРМУЛА В ОБРАТНУЮ СТОРОНУ', 'THE FORMULA IN REVERSE'),
  noBack: true,
  noNotes: true,
  title: L('Qaysi ajratma to\'g\'ri', 'Какое разложение верно', 'Which factorization is right'),
  gate: {
    source: { kind: 'plain', tokens: ['x²', '+', '6x', '+', '9'] },
    rows: [
      { tokens: ['(x', '+', '3)²'], value: '16' },
      { tokens: ['(x', '+', '3)', '(x', '−', '3)'], value: '−8' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Uch hadli yozuv ikki xil ajratilgan. Tabloda x bir bo'lgandagi qiymat turadi. Yozuvning o'zi o'n olti beradi. Kim haq?",
      'Трёхчлен разложили двумя способами. На табло значение при x равном единице. Сама запись даёт шестнадцать. Кто прав?',
      'A trinomial was factored in two ways. The boards show the value at x equal to one. The record itself gives sixteen. Who is right?',
    ),
    items: [
      {
        id: 'sq',
        label: L('Kvadratga yig\'gani', 'Тот, кто свернул в квадрат', 'The one who folded it into a square'),
        hint: L(
          "Taxminingiz qabul qilindi. Belgini qanday o'qish kerakligini ko'ramiz.",
          'Прогноз принят. Посмотрим, как читать признак.',
          'Your prediction is taken. Let us see how to read the mark.',
        ),
      },
      {
        id: 'diff',
        label: L('Kvadratlar ayirmasiga ajratgani', 'Тот, кто взял разность квадратов', 'The one who took the difference of squares'),
        hint: L(
          "Kvadratlar ayirmasi IKKI hadli javob beradi, bizda esa uch had turibdi.",
          'Разность квадратов даёт ответ из ДВУХ членов, а у нас три члена.',
          'A difference of squares gives a TWO term answer, but here there are three terms.',
        ),
      },
      {
        id: 'both',
        label: L('Ikkovi ham to\'g\'ri', 'Оба верны', 'Both are right'),
        hint: L(
          "Birda o'n olti va minus sakkiz chiqdi, ya'ni bittasi boshlang'ichga teng emas.",
          'При единице вышло шестнадцать и минус восемь, значит одно из них не равно исходному.',
          'At one it gave sixteen and minus eight, so one of them is not equal to the original.',
        ),
      },
      {
        id: 'none',
        label: L('Uch hadni ajratib bo\'lmaydi', 'Трёхчлен разложить нельзя', 'A trinomial cannot be factored'),
        hint: L(
          "Olti x bu x va uchning ikki karra ko'paytmasi. Demak bu kvadrat.",
          'Шесть x это двойное произведение x и трёх. Значит это квадрат.',
          'Six x is twice the product of x and three. So this is a square.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Uch hadli yozuv ikki xil ajratilgan.", 'Трёхчлен разложили двумя способами.', 'A trinomial was factored in two ways.'),
    A('mount', "Tabloda x bir bo'lgandagi qiymat turadi. Yozuvning o'zi o'n olti beradi.", 'На табло значение при x равном единице. Сама запись даёт шестнадцать.', 'The boards show the value at x equal to one. The record itself gives sixteen.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Oldinga yo'l, ildiz va bir teskari misol. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch qisqa savol', 'Три коротких вопроса', 'Three short questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: false,
      prompt: '(x + 3)²',
      ok: L("Uch had: kvadrat, ikki karra ko'paytma, kvadrat.", 'Три члена: квадрат, двойное произведение, квадрат.', 'Three terms: a square, the double product, a square.'),
      items: [
        { id: 'a', label: 'x² + 6x + 9', correct: true },
        { id: 'b', label: 'x² + 9', tag: 'Z2', hint: L("O'rta had ikki karra ko'paytma bo'lardi.", 'Средний член это двойное произведение.', 'The middle term is the double product.') },
        { id: 'c', label: 'x² + 3x + 9', tag: 'Z2', hint: L("Ko'paytma ikki marta olinadi.", 'Произведение берётся дважды.', 'The product is taken twice.') },
        { id: 'd', label: 'x² − 6x + 9', tag: 'Z3', hint: L("Qavsda qo'shuv turgan edi.", 'В скобке было сложение.', 'The bracket had a plus.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "49 qaysi sonning kvadrati?",
        'Квадратом какого числа является 49?',
        'Forty nine is the square of which number?',
      ),
      ok: L("Yetti karra yetti qirq to'qqiz beradi.", 'Семь на семь даёт сорок девять.', 'Seven times seven gives forty nine.'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '49', tag: 'Z4', hint: L("Qirq to'qqiz karra qirq to'qqiz ancha katta son beradi.", 'Сорок девять на сорок девять даёт гораздо большее число.', 'Forty nine times forty nine gives a much larger number.') },
        { id: 'c', label: '24,5', tag: 'Z6', hint: L("Bu yarmi, ildiz esa boshqa narsa.", 'Это половина, а корень другое.', 'That is a half, and a root is something else.') },
        { id: 'd', label: '14', tag: 'Z6', hint: L("O'n to'rt karra o'n to'rt bir yuz to'qson olti beradi.", 'Четырнадцать на четырнадцать это сто девяносто шесть.', 'Fourteen times fourteen is one hundred ninety six.') },
      ],
    },
    {
      wrap: false,
      prompt: 'x² − 36',
      ok: L("Ikki had va minus: bu kvadratlar ayirmasi.", 'Два члена и минус: это разность квадратов.', 'Two terms and a minus: a difference of squares.'),
      items: [
        { id: 'a', label: '(x − 6)(x + 6)', correct: true },
        { id: 'b', label: '(x − 6)²', tag: 'Z1', hint: L("Ikki bir xil qavs uch hadli javob berardi.", 'Две одинаковые скобки дали бы ответ из трёх членов.', 'Two identical brackets would give a three term answer.') },
        { id: 'c', label: '(x − 36)(x + 36)', tag: 'Z4', hint: L("O'ttiz oltining ildizi olti.", 'Корень из тридцати шести это шесть.', 'The root of thirty six is six.') },
        { id: 'd', label: '(x − 6)(x − 6)', tag: 'Z1', hint: L("Ikki bir xil qavs kvadratni beradi, ayirmani emas.", 'Две одинаковые скобки дают квадрат, а не разность.', 'Two identical brackets give a square, not a difference.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Birinchisi oldinga, uchinchisi esa orqaga yo'l.", 'Три коротких вопроса. Первый вперёд, а третий обратно.', 'Three short questions. The first goes forward, the third goes back.'),
    A('1', "Ikkinchisi ildiz haqida. Bugun u kerak bo'ladi.", 'Второй про корень. Сегодня он понадобится.', 'The second is about a root. It will be needed today.'),
    A('2', "Uchinchisida ikki had bor.", 'В третьем два члена.', 'The third has two terms.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. ZONALAR: belgi HADLAR SONI va ISHORASIDA.
// ============================================================
const S3 = {
  kind: 'sort',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Qaysi formulaga yig\'iladi', 'Во что свёртывается', 'What each one folds into'),
  zones: [
    { id: 'z1', label: L("Yig'indi kvadrati", 'Квадрат суммы', 'Square of a sum') },
    { id: 'z2', label: L('Ayirma kvadrati', 'Квадрат разности', 'Square of a difference') },
    { id: 'z3', label: L('Kvadratlar ayirmasi', 'Разность квадратов', 'Difference of squares') },
    { id: 'z4', label: L('Ajratilmaydi', 'Не разлагается', 'Does not factor') },
  ],
  cards: [
    { id: 'c1', text: 'x² + 10x + 25', zone: 'z1' },
    { id: 'c2', text: 'x² − 10x + 25', zone: 'z2' },
    { id: 'c3', text: 'x² − 25', zone: 'z3' },
    { id: 'c4', text: 'x² + 25', zone: 'z4' },
  ],
  prompt: L(
    "Har yozuvni o'z formulasiga bering. Bittasi ajratilmaydi.",
    'Отправь каждую запись к своей формуле. Одна не разлагается.',
    'Send each record to its formula. One of them does not factor.',
  ),
  wrongs: [
    {
      tag: 'Z5',
      hint: L(
        "Hadlar sonini va ishorani sanang: uch had bo'lsa kvadrat, ikki had va minus bo'lsa kvadratlar ayirmasi, ikki had va qo'shuv bo'lsa ajratilmaydi.",
        'Считай число членов и знак: три члена — квадрат, два члена с минусом — разность квадратов, два члена с плюсом не разлагаются.',
        'Count the terms and the sign: three terms mean a square, two with a minus mean a difference of squares, two with a plus do not factor.',
      ),
    },
  ],
  okNote: L(
    "Belgi ikki narsadan iborat: hadlar SONI va ISHORA. Hisoblash kerak emas.",
    'Признак это две вещи: ЧИСЛО членов и ЗНАК. Считать не надо.',
    'The mark is two things: the NUMBER of terms and the SIGN. No computing needed.',
  ),
  audio: [
    A('mount', "Endi qavs yo'q. Ko'phad berilgan, uni formulaga yig'ish kerak.", 'Теперь скобки нет. Дан многочлен, его надо свернуть в формулу.', 'Now there is no bracket. A polynomial is given, and it must fold into a formula.'),
    A('mount', "Hadlar sonini va ishorani sanang.", 'Посчитай число членов и знак.', 'Count the number of terms and the sign.'),
    A('ok', "Uch had kvadratga, ikki had va minus ayirmaga boradi.", 'Три члена идут к квадрату, два члена с минусом к разности.', 'Three terms go to a square, two with a minus to a difference.'),
  ],
}

// ============================================================
// 4. FARQLASH. YIG'ISH KO'PAYTIRISH BILAN TEKSHIRILADI.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Tekshiruv -- ko\'paytirish', 'Проверка это умножение', 'The check is multiplication'),
  caption: L(
    "Yig'ilgan javob shu. Kataklarni ochib, boshlang'ich uch had qaytishini ko'ring.",
    'Вот свёрнутый ответ. Открой клетки и посмотри, вернётся ли исходный трёхчлен.',
    'Here is the folded answer. Open the cells and see whether the original trinomial returns.',
  ),
  left: ['x', '+5'],
  top: ['x', '+5'],
  options: [
    { id: 'a', label: 'x² + 10x + 25' },
    { id: 'b', label: 'x² + 25' },
    { id: 'c', label: 'x² + 10x + 10' },
    { id: 'd', label: 'x² + 5x + 25' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("O'rta ikki katak bo'sh qoldi.", 'Две средние клетки остались пустыми.', 'The two middle cells stayed empty.') },
    { key: 'c', tag: 'Z6', hint: L("Oxirgi katakda besh karra besh, ya'ni yigirma besh.", 'В последней клетке пять на пять, то есть двадцать пять.', 'The last cell is five times five, that is twenty five.') },
    { key: 'd', tag: 'Z2', hint: L("x karra besh katagi ikkita.", 'Клеток с x на пять две.', 'There are two x times five cells.') },
  ],
  note: L(
    "Yig'ish to'g'ri bo'lsa, ko'paytirish boshlang'ich ko'phadni QAYTARADI. Bu har ajratmaning tekshiruvi.",
    'Если свёртка верна, умножение ВОЗВРАЩАЕТ исходный многочлен. Это проверка любого разложения.',
    'If the folding is right, multiplying RETURNS the original polynomial. That is the check for any factorization.',
  ),
  audio: [
    A('mount', "Ajratma to'g'rimi yoki yo'qmi, buni ko'paytirish aytadi.", 'Верно разложение или нет, скажет умножение.', 'Whether a factorization is right is answered by multiplying.'),
    A('mount', "To'rt katakni oching va boshlang'ich yozuv bilan solishtiring.", 'Открой четыре клетки и сверь с исходной записью.', 'Open the four cells and compare with the original record.'),
    A('cell-all', "To'rt katak boshlang'ich uch hadni qaytardi.", 'Четыре клетки вернули исходный трёхчлен.', 'The four cells returned the original trinomial.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. ISHORA VA ILDIZ: ikkovini o'quvchi qo'yadi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Ishora va ildiz', 'Знак и корень', 'The sign and the root'),
  template: ['x² − 14x + 49  =  (x ', { slot: 0 }, ' ', { slot: 1 }, ')²'],
  parts: [
    { id: 'a', label: '−' },
    { id: 'b', label: '7' },
    { id: 'c', label: '+' },
    { id: 'd', label: '49' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Qavsdagi ishorani va sonni qo'ying.",
    'Поставь знак и число в скобке.',
    'Set the sign and the number in the bracket.',
  ),
  checkNote: L(
    "O'rta had manfiy, demak qavsda ayirish. Qirq to'qqiz yettining kvadrati, shuning uchun qavsda yetti turadi.",
    'Средний член отрицательный, значит в скобке вычитание. Сорок девять это квадрат семи, поэтому в скобке семь.',
    'The middle term is negative, so the bracket has a minus. Forty nine is seven squared, so the bracket holds seven.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("O'rta had minus bilan turibdi.", 'Средний член стоит с минусом.', 'The middle term carries a minus.') },
    { key: 'd', tag: 'Z4', hint: L("Qavsda ILDIZ turadi, kvadratning o'zi emas.", 'В скобке стоит КОРЕНЬ, а не сам квадрат.', 'The bracket holds the ROOT, not the square itself.') },
    { key: '*', tag: 'Z1', hint: L("Uch had -- demak kvadrat. Ishora o'rta haddan olinadi.", 'Три члена значит квадрат. Знак берётся из среднего члена.', 'Three terms mean a square. The sign comes from the middle term.') },
  ],
  audio: [
    A('mount', "Uch had bor, demak bu kvadrat. Qolgani -- ishora va ildiz.", 'Три члена, значит это квадрат. Осталось знак и корень.', 'Three terms, so this is a square. What is left is the sign and the root.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. KOEFFITSIYENTLAR: ildiz koeffitsiyentdan ham olinadi.
// ============================================================
const S6 = {
  kind: 'sort',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Koeffitsiyentlar bilan', 'С коэффициентами', 'With coefficients'),
  zones: [
    { id: 'z1', label: L("Yig'indi kvadrati", 'Квадрат суммы', 'Square of a sum') },
    { id: 'z2', label: L('Ayirma kvadrati', 'Квадрат разности', 'Square of a difference') },
    { id: 'z3', label: L('Kvadratlar ayirmasi', 'Разность квадратов', 'Difference of squares') },
    { id: 'z4', label: L('Ajratilmaydi', 'Не разлагается', 'Does not factor') },
  ],
  cards: [
    { id: 'c1', text: '4x² + 12x + 9', zone: 'z1' },
    { id: 'c2', text: '4x² − 12x + 9', zone: 'z2' },
    { id: 'c3', text: '4x² − 9', zone: 'z3' },
    { id: 'c4', text: '4x² + 9', zone: 'z4' },
  ],
  prompt: L(
    "Koeffitsiyent belgini o'zgartirmaydi. To'rt yozuvni tarqating.",
    'Коэффициент признака не меняет. Раскинь четыре записи.',
    'A coefficient does not change the mark. Sort the four records.',
  ),
  wrongs: [
    {
      tag: 'Z5',
      hint: L(
        "Belgi o'sha: hadlar soni va ishora. To'rt x kvadratning ildizi ikki x, to'qqizning ildizi uch.",
        'Признак тот же: число членов и знак. Корень из четырёх x в квадрате это два x, корень из девяти три.',
        'The mark is the same: the term count and the sign. The root of four x squared is two x, of nine it is three.',
      ),
    },
  ],
  okNote: L(
    "Koeffitsiyent belgiga ta'sir qilmadi, u faqat ildizni o'zgartirdi.",
    'Коэффициент на признак не повлиял, он изменил только корень.',
    'The coefficient did not affect the mark, it only changed the root.',
  ),
  audio: [
    A('mount', "Endi birinchi hadda koeffitsiyent bor.", 'Теперь в первом члене есть коэффициент.', 'Now the first term has a coefficient.'),
    A('mount', "Belgi o'zgarmaydi, faqat ildiz boshqa bo'ladi.", 'Признак не меняется, только корень будет другим.', 'The mark does not change, only the root differs.'),
    A('ok', "To'rt x kvadratning ildizi ikki x.", 'Корень из четырёх x в квадрате это два x.', 'The root of four x squared is two x.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: TO'LIQ BO'LMAGAN kvadrat. O'rta had
// tekshirilmasa, yig'ib bo'lmaydigan narsa yig'iladi.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Kvadratga o\'xshaydi, lekin kvadrat emas', 'Похоже на квадрат, но не квадрат', 'It looks like a square but is not'),
  letter: 'x',
  numbers: [1, 2, 5],
  rows: [
    { id: 'r1', role: 'source', expr: 'x² + 4x + 5', sub: (n) => n + '² + 4 · ' + n + ' + 5', val: (n) => n * n + 4 * n + 5 },
    { id: 'r2', expr: '(x + 2)²', sub: (n) => '(' + n + ' + 2)²', val: (n) => (n + 2) * (n + 2) },
  ],
  probe: {
    question: L(
      "Qiymatlar har safar aynan bittaga farq qildi. Bu nima degani?",
      'Значения каждый раз отличались ровно на единицу. Что это значит?',
      'The values differed by exactly one each time. What does that mean?',
    ),
    items: [
      {
        id: 'no',
        correct: true,
        label: L("Bu to'liq kvadrat emas: kvadratga yig'ib bo'lmaydi", 'Это не полный квадрат: свернуть нельзя', 'This is not a perfect square: it cannot be folded'),
      },
      {
        id: 'close',
        tag: 'Z5',
        label: L("Deyarli kvadrat, shunday yozsa ham bo'ladi", 'Почти квадрат, можно так и записать', 'Almost a square, so it can be written that way'),
        hint: L(
          "Deyarli hisobga o'tmaydi: har sonda farq aynan bir, ya'ni yozuvlar teng emas.",
          'Почти не считается: при любом числе разница ровно один, значит записи не равны.',
          'Almost does not count: at every number the gap is exactly one, so the records are not equal.',
        ),
      },
      {
        id: 'other',
        tag: 'Z1',
        label: L("(x + 2)(x + 3) ni olish kerak", 'Надо взять (x + 2)(x + 3)', 'One should take (x + 2)(x + 3)'),
        hint: L(
          "Birda tekshiring: uch karra to'rt o'n ikki, kerak bo'lgani esa o'n.",
          'Проверь при единице: три на четыре двенадцать, а нужно десять.',
          'Check at one: three times four is twelve, but ten is needed.',
        ),
      },
      {
        id: 'calc',
        tag: 'Z6',
        label: L('Hisobda xato bor', 'Есть ошибка в счёте', 'There is a slip in the arithmetic'),
        hint: L(
          "Birda bir qo'shuv to'rt qo'shuv besh o'n beradi, uchning kvadrati esa to'qqiz.",
          'При единице один плюс четыре плюс пять это десять, а три в квадрате девять.',
          'At one, one plus four plus five is ten, while three squared is nine.',
        ),
      },
    ],
  },
  okText: L(
    "Kvadratga yig'ish uchun O'RTA HAD tekshirilishi shart: u chetdagi ildizlarning ikki karra ko'paytmasi bo'lishi kerak.",
    'Чтобы свернуть в квадрат, надо проверить СРЕДНИЙ ЧЛЕН: он обязан быть двойным произведением крайних корней.',
    'To fold into a square the MIDDLE TERM must be checked: it has to be twice the product of the outer roots.',
  ),
  audio: [
    A('mount', "Yuqorida uch hadli yozuv, pastda unga eng yaqin kvadrat.", 'Сверху трёхчлен, снизу ближайший к нему квадрат.', 'Above a trinomial, below the square closest to it.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Farqni qarang: u har safar bir xil.", 'Посмотри на разницу: она каждый раз одна и та же.', 'Look at the gap: it is the same every time.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z5',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('chetdagi hadlar kvadrat bo\'lishi kerak', 'крайние члены должны быть квадратами', 'the outer terms must be squares') },
    { id: 'f2', label: L("o'rtadagisi esa ildizlarning ikki karra ko'paytmasi", 'а средний двойным произведением их корней', 'and the middle one twice the product of their roots') },
    { id: 'f3', label: L("unda uch had kvadratga yig'iladi", 'тогда трёхчлен свёртывается в квадрат', 'then the trinomial folds into a square') },
    { id: 'f4', label: L("minusli ikki had esa ko'paytmaga", 'а двучлен с минусом в произведение', 'and a binomial with a minus into a product') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval chetdagi hadlar, keyin o'rtadagisi, keyin uch had, oxirida ikki had.",
    'Порядок нарушен. Сначала крайние члены, потом средний, потом трёхчлен, в конце двучлен.',
    'The order is off. The outer terms first, then the middle, then the trinomial, and the binomial last.',
  ),
  lawChips: [
    { label: '( )²', tone: 'par' },
    { label: '2 · ', tone: 'off' },
    { label: '−', tone: 's1' },
    { label: '·', tone: 's2' },
  ],
  lawSweep: L(
    "kvadrat, ikki karra ko'paytma, ishora, tekshiruv",
    'квадрат, двойное произведение, знак, проверка',
    'the square, the double product, the sign, the check',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ko'phadni formula bilan ajratish uchun belgisini o'qish kerak: uch hadli yozuvda chetdagi hadlar kvadrat, o'rtadagisi esa ularning ildizlarining ikki karra ko'paytmasi bo'lishi shart.",
        'Чтобы разложить многочлен по формуле, надо прочитать признак: у трёхчлена крайние члены должны быть квадратами, а средний двойным произведением их корней.',
        'To factor a polynomial by a formula, read its mark: in a trinomial the outer terms must be squares and the middle one twice the product of their roots.',
      ),
      L(
        "Minusli ikki had bu kvadratlar ayirmasi, u ildizlarning yig'indisi va ayirmasiga ajratiladi. Qo'shuvli ikki had esa ko'paytuvchilarga ajratilmaydi.",
        'Двучлен с минусом это разность квадратов, она разлагается на сумму и разность корней. А двучлен с плюсом на множители не разлагается.',
        'A binomial with a minus is a difference of squares and factors into the sum and difference of the roots. A binomial with a plus does not factor.',
      ),
    ],
  },
  hookCap: L(
    'Belgi: hadlar soni va ishora',
    'Признак: число членов и знак',
    'The mark: the term count and the sign',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('chetdagilar kvadrat', 'крайние квадраты', 'the outer ones are squares'),
    L("o'rtadagisi tekshiriladi", 'средний проверяется', 'the middle one is checked'),
    L("ko'paytirib tekshiriladi", 'проверка умножением', 'checked by multiplying'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik, to'liq bo'lmagan kvadratni ham. Endi qoidani yig'amiz.", 'Все случаи мы увидели, и неполный квадрат тоже. Теперь соберём правило.', 'We have seen all the cases, including the imperfect square. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda bir yozuvda bir necha formula uchraydi.", 'Верно. На следующем уроке в одной записи встретятся несколько формул.', 'Correct. Next lesson several formulas meet in one record.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ajratmani toping', 'Найди разложение', 'Find the factorization'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: false,
      prompt: 'x² + 8x + 16',
      ok: L("Chetdagilar x va to'rtning kvadrati, o'rtadagisi esa ikki karra ko'paytma.", 'Крайние это квадраты x и четырёх, а средний двойное произведение.', 'The outer ones are squares of x and four, the middle is the double product.'),
      items: [
        { id: 'a', label: '(x + 4)²', correct: true },
        { id: 'b', label: '(x + 8)²', tag: 'Z4', hint: L("O'n oltining ildizi to'rt, sakkiz emas.", 'Корень из шестнадцати это четыре, а не восемь.', 'The root of sixteen is four, not eight.') },
        { id: 'c', label: '(x + 4)(x − 4)', tag: 'Z1', hint: L("Bunday ko'paytma o'rta hadni bermaydi.", 'Такое произведение не даёт среднего члена.', 'That product gives no middle term.') },
        { id: 'd', label: '(x + 16)²', tag: 'Z4', hint: L("Qavsda ildiz turadi, kvadratning o'zi emas.", 'В скобке стоит корень, а не сам квадрат.', 'The bracket holds the root, not the square.') },
      ],
    },
    {
      wrap: false,
      prompt: '9x² − 4',
      ok: L("Ikki had va minus: ildizlar uch x va ikki.", 'Два члена и минус: корни три x и два.', 'Two terms and a minus: the roots are three x and two.'),
      items: [
        { id: 'a', label: '(3x − 2)(3x + 2)', correct: true },
        { id: 'b', label: '(9x − 4)(9x + 4)', tag: 'Z4', hint: L("To'qqiz x kvadratning ildizi uch x.", 'Корень из девяти x в квадрате это три x.', 'The root of nine x squared is three x.') },
        { id: 'c', label: '(3x − 2)²', tag: 'Z1', hint: L("Kvadrat uch hadli javob berardi.", 'Квадрат дал бы ответ из трёх членов.', 'A square would give a three term answer.') },
        { id: 'd', label: '(3x − 4)(3x + 4)', tag: 'Z4', hint: L("To'rtning ildizi ikki.", 'Корень из четырёх это два.', 'The root of four is two.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qaysi yozuv formulalar bilan ajratilmaydi?",
        'Какая запись не разлагается по формулам?',
        'Which record does not factor by the formulas?',
      ),
      ok: L("Ikki had va qo'shuv: bunday yozuv ajratilmaydi.", 'Два члена и плюс: такая запись не разлагается.', 'Two terms and a plus: such a record does not factor.'),
      items: [
        { id: 'a', label: 'x² + 4', correct: true },
        { id: 'b', label: 'x² − 4', tag: 'Z5', hint: L("Ikki had va minus: bu kvadratlar ayirmasi.", 'Два члена и минус: это разность квадратов.', 'Two terms and a minus: a difference of squares.') },
        { id: 'c', label: 'x² + 4x + 4', tag: 'Z5', hint: L("Uch had, va o'rtadagisi tekshiruvdan o'tadi.", 'Три члена, и средний проходит проверку.', 'Three terms, and the middle one passes the check.') },
        { id: 'd', label: 'x² − 4x + 4', tag: 'Z5', hint: L("Bu ham kvadrat, faqat ayirmaning kvadrati.", 'Это тоже квадрат, только квадрат разности.', 'That is a square too, a square of a difference.') },
      ],
    },
    {
      wrap: false,
      prompt: 'a² − 6a + 9',
      ok: L("O'rta had manfiy, demak ayirmaning kvadrati.", 'Средний член отрицательный, значит квадрат разности.', 'The middle term is negative, so a square of a difference.'),
      items: [
        { id: 'a', label: '(a − 3)²', correct: true },
        { id: 'b', label: '(a + 3)²', tag: 'Z3', hint: L("O'rta had minus bilan turgan edi.", 'Средний член стоял с минусом.', 'The middle term carried a minus.') },
        { id: 'c', label: '(a − 9)²', tag: 'Z4', hint: L("To'qqizning ildizi uch.", 'Корень из девяти это три.', 'The root of nine is three.') },
        { id: 'd', label: '(a − 3)(a + 3)', tag: 'Z1', hint: L("Bunday ko'paytma o'rta hadni bermaydi.", 'Такое произведение не даёт среднего члена.', 'That product gives no middle term.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Uchinchisi ajratilmaydigan yozuv haqida.", 'Четыре вопроса. Третий про запись, которая не разлагается.', 'Four questions. The third is about a record that does not factor.'),
    A('1', "Ikkinchisida koeffitsiyent bor.", 'Во втором есть коэффициент.', 'The second has a coefficient.'),
    A('2', "Uchinchisiga o'ylab javob bering.", 'На третий ответь подумав.', 'Think before answering the third.'),
    A('3', "Oxirgisida o'rta had manfiy.", 'В последнем средний член отрицательный.', 'In the last one the middle term is negative.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: ildizlar, keyin TEKSHIRUV.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ildizlar va tekshiruv', 'Корни и проверка', 'The roots and the check'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['25y² + 20y + 4  =  (', { slot: 0 }, ' + ', { slot: 1 }, ')²'],
  parts: [
    { id: 'a', label: '5y' },
    { id: 'b', label: '2' },
    { id: 'c', label: '25y' },
    { id: 'd', label: '4' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki ildizni yozing.",
    'Запиши два корня.',
    'Write the two roots.',
  ),
  checkNote: L(
    "Yigirma besh y kvadratning ildizi besh y, to'rtning ildizi ikki. Tekshiruv: ikki karra besh y karra ikki yigirma y beradi.",
    'Корень из двадцати пяти y в квадрате это пять y, корень из четырёх два. Проверка: два на пять y на два даёт двадцать y.',
    'The root of twenty five y squared is five y, the root of four is two. Check: two by five y by two gives twenty y.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Besh y karra besh y yigirma besh y kvadrat beradi.", 'Пять y на пять y это двадцать пять y в квадрате.', 'Five y times five y is twenty five y squared.') },
    { key: 'd', tag: 'Z4', hint: L("Qavsda ildiz turadi: to'rtning ildizi ikki.", 'В скобке стоит корень: корень из четырёх это два.', 'The bracket holds the root: the root of four is two.') },
    { key: '*', tag: 'Z4', hint: L("Har chet haddan ildiz olinadi.", 'Из каждого крайнего члена берётся корень.', 'A root is taken from each outer term.') },
  ],
  probe: {
    question: L("Bu aniq kvadrat ekanini qanday tekshiramiz?", 'Как проверить, что это точно квадрат?', 'How do we check that this really is a square?'),
    items: [
      {
        id: 'a',
        correct: true,
        label: L("o'rta had ildizlarning ikki karra ko'paytmasi bo'lishi kerak", 'средний член должен быть двойным произведением корней', 'the middle term must be twice the product of the roots'),
      },
      {
        id: 'b',
        tag: 'Z2',
        label: L('birinchi hadga qarash yetarli', 'достаточно посмотреть на первый член', 'looking at the first term is enough'),
        hint: L("Birinchi had yig'ilmaydigan yozuvda ham kvadrat bo'ladi.", 'Первый член бывает квадратом и у записи, которая не свёртывается.', 'The first term is a square even in a record that does not fold.'),
      },
      {
        id: 'c',
        tag: 'Z6',
        label: L("bitta son qo'yib ko'rish kerak", 'надо подставить какое-нибудь число', 'one should substitute some number'),
        hint: L("Bitta son tasodifan mos kelishi mumkin, belgi esa darhol tekshiriladi.", 'Одно число может совпасть случайно, а признак проверяется сразу.', 'One number may match by chance, while the mark is checked at once.'),
      },
      {
        id: 'd',
        tag: 'Z5',
        label: L('tekshirish shart emas', 'проверять не нужно', 'no check is needed'),
        hint: L("Tekshirmasa, yig'ilmaydigan yozuv ham kvadratga yig'ilib qoladi.", 'Без проверки легко свернуть то, что не свёртывается.', 'Without the check it is easy to fold what does not fold.'),
      },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval ildizlar, keyin tekshiruv.", 'Два шага. Сначала корни, потом проверка.', 'Two steps. The roots first, then the check.'),
    A('mount', "Chetdagi hadlar kvadrat, ularning ildizini oling.", 'Крайние члены квадраты, возьми их корни.', 'The outer terms are squares, take their roots.'),
    A('two', "Endi ikkinchi qadam: bu aniq kvadratmi.", 'Теперь второй шаг: точно ли это квадрат.', 'Now the second step: is it really a square.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Ikki harf, ikki koeffitsiyent.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Ikki harf', 'Две буквы', 'Two letters'),
  template: ['49a² − 25b²  =  (7a − 5b)(', { slot: 0 }, ')'],
  parts: [
    { id: 'a', label: '7a + 5b' },
    { id: 'b', label: '7a − 5b' },
    { id: 'c', label: '49a + 25b' },
    { id: 'd', label: '7a + 5' },
  ],
  answer: ['a'],
  prompt: L(
    "Ikkinchi qavsni yozing.",
    'Запиши вторую скобку.',
    'Write the second bracket.',
  ),
  checkNote: L(
    "Ikki had va minus: ildizlar yetti a va besh b. Bir qavsda ayirish, ikkinchisida qo'shuv.",
    'Два члена и минус: корни семь a и пять b. В одной скобке вычитание, в другой сложение.',
    'Two terms and a minus: the roots are seven a and five b. One bracket subtracts, the other adds.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Ikki bir xil qavs kvadratni beradi, ayirmani emas.", 'Две одинаковые скобки дают квадрат, а не разность.', 'Two identical brackets give a square, not a difference.') },
    { key: 'c', tag: 'Z4', hint: L("Qavsda ildizlar turadi: yetti a va besh b.", 'В скобке стоят корни: семь a и пять b.', 'The brackets hold the roots: seven a and five b.') },
    { key: 'd', tag: 'Z4', hint: L("Yigirma besh b kvadratning ildizi besh b, harf ham qoladi.", 'Корень из двадцати пяти b в квадрате это пять b, буква остаётся.', 'The root of twenty five b squared is five b, the letter stays.') },
  ],
  audio: [
    A('mount', "Ikki harf ham koeffitsiyentli. Ildizni ikkovidan oling.", 'Обе буквы с коэффициентами. Возьми корень из каждой.', 'Both letters have coefficients. Take the root of each.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Ildizlar to'g'ri, o'rta had ham tekshirilgan,
// lekin FORMULA noto'g'ri tanlangan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Ildizlar to'g'ri topilgan, o'rta had ham tekshirilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Корни найдены верно, средний член проверен. И всё же какая строка ошибочна?',
    'The roots are right and the middle term is checked. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: 'x² − 12x + 36' },
    { id: 'r2', text: '36 = 6 · 6' },
    { id: 'r3', text: '12x = 2 · x · 6' },
    { id: 'r4', text: L('javob: (x − 6)(x + 6)', 'ответ: (x − 6)(x + 6)', 'answer: (x − 6)(x + 6)') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: o'ttiz olti oltining kvadrati.", 'Верно: тридцать шесть это квадрат шести.', 'Right: thirty six is six squared.'),
    r3: L("To'g'ri: o'n ikki x ikki karra x karra olti.", 'Верно: двенадцать x это два на x на шесть.', 'Right: twelve x is two by x by six.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r3: 'Z1' },
  proofFill: {
    template: ['(x − 6)(x + 6)  =  ', { slot: 0 }, '   →   x² − 12x + 36  =  (x − 6)', { slot: 1 }],
    parts: [
      { id: 'a', label: 'x² − 36' },
      { id: 'b', label: '²' },
      { id: 'c', label: 'x² − 12x + 36' },
      { id: 'd', label: ' · 2' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Taklif qilingan javobni ko'paytirib tekshiring va to'g'ri ajratmani yozing.",
      'Проверь предложенный ответ умножением и запиши верное разложение.',
      'Check the offered answer by multiplying and write the right factorization.',
    ),
    checkNote: L(
      "Ishoralari boshqa qavslar o'rta hadni bermaydi, bizda esa uch had turibdi. Demak qavslar bir xil, ya'ni kvadrat.",
      'Скобки с разными знаками не дают среднего члена, а у нас три члена. Значит скобки одинаковые, то есть квадрат.',
      'Brackets with different signs give no middle term, but here there are three. So the brackets are identical, a square.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z1', hint: L("Ishoralari boshqa qavslarning o'rta hadi yo'q bo'ladi.", 'У скобок с разными знаками средний член уничтожается.', 'With opposite signs the middle term cancels.') },
      { key: 'd', tag: 'Z6', hint: L("Bir xil ikki qavs kvadrat bilan yoziladi.", 'Две одинаковые скобки записываются квадратом.', 'Two identical brackets are written as a square.') },
      { key: '*', tag: 'Z1', hint: L("Uch had -- demak kvadrat, ikki had -- demak ayirma.", 'Три члена значит квадрат, два члена значит разность.', 'Three terms mean a square, two terms mean a difference.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda ildizlar to'g'ri topilgan va o'rta had tekshirilgan.", 'В этой ловушке корни найдены верно и средний член проверен.', 'In this trap the roots are right and the middle term is checked.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Bunday ko'paytma o'rta hadni bermaydi.", 'Нашёл. Такое произведение не даёт среднего члена.', 'You found it. That product gives no middle term.'),
    A('done', "Uch had bo'lsa qavslar bir xil bo'ladi.", 'Если три члена, скобки одинаковые.', 'When there are three terms, the brackets are identical.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TEZ HISOB: kvadratlar ayirmasi bilan.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Ikki kvadratning ayirmasi', 'Разность двух квадратов', 'A difference of two squares'),
  given: L(
    "Qirq bir kvadrat minus qirq kvadratni ustunda hisoblamaymiz: ajratib olamiz.",
    'Сорок один в квадрате минус сорок в квадрате не будем считать в столбик: разложим.',
    'Forty one squared minus forty squared: instead of long arithmetic, let us factor.',
  ),
  template: ['41² − 40²  =  (41 − 40)(41 + 40)  =  ', { slot: 0 }],
  parts: [
    { id: 'a', label: '81' },
    { id: 'b', label: '1' },
    { id: 'c', label: '1681' },
    { id: 'd', label: '80' },
  ],
  answer: ['a'],
  prompt: L(
    "Ko'paytmani hisoblang.",
    'Посчитай произведение.',
    'Work out the product.',
  ),
  checkNote: L(
    "Birinchi qavs bir, ikkinchisi sakson bir. Bir karra sakson bir sakson bir beradi.",
    'Первая скобка это один, вторая восемьдесят один. Один на восемьдесят один это восемьдесят один.',
    'The first bracket is one, the second eighty one. One times eighty one is eighty one.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Birinchi qavs birga teng, lekin u ikkinchisiga ko'paytiriladi.", 'Первая скобка равна одному, но её умножают на вторую.', 'The first bracket is one, but it is multiplied by the second.') },
    { key: 'c', tag: 'Z6', hint: L("Bu qirq birning kvadrati, javob esa ayirma.", 'Это сорок один в квадрате, а ответ это разность.', 'That is forty one squared, but the answer is the difference.') },
    { key: 'd', tag: 'Z6', hint: L("Ikkinchi qavs qirq bir qo'shuv qirq, ya'ni sakson bir.", 'Вторая скобка это сорок один плюс сорок, то есть восемьдесят один.', 'The second bracket is forty one plus forty, that is eighty one.') },
  ],
  audio: [
    A('mount', "Ikki katta kvadratning ayirmasi. Ustunda hisoblash uzoq.", 'Разность двух больших квадратов. В столбик считать долго.', 'A difference of two big squares. Long arithmetic would take a while.'),
    A('mount', "Formula bilan esa bir qatorda chiqadi.", 'А по формуле выходит в одну строку.', 'By the formula it comes out in a single line.'),
  ],
}

// ============================================================
// 14. BLITS. Baholanadigan YAGONA ekran.
// ============================================================
const S14 = {
  kind: 'blitz',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  items: [
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: 'x² + 2x + 1',
      ok: L("Chetdagilar x va birning kvadrati.", 'Крайние это квадраты x и единицы.', 'The outer ones are squares of x and one.'),
      items: [
        { id: 'a', label: '(x + 1)²', correct: true },
        { id: 'b', label: '(x + 2)²', tag: 'Z4', hint: L("Birning ildizi bir, ikki esa o'rta hadda turadi.", 'Корень из единицы это один, а два стоит в среднем члене.', 'The root of one is one, and two sits in the middle term.') },
        { id: 'c', label: '(x + 1)(x − 1)', tag: 'Z1', hint: L("Bunday ko'paytma o'rta hadni bermaydi.", 'Такое произведение не даёт среднего члена.', 'That product gives no middle term.') },
        { id: 'd', label: '(x − 1)²', tag: 'Z3', hint: L("O'rta had musbat edi.", 'Средний член был положительным.', 'The middle term was positive.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '4a² − 25',
      ok: L("Ildizlar ikki a va besh.", 'Корни два a и пять.', 'The roots are two a and five.'),
      items: [
        { id: 'a', label: '(2a − 5)(2a + 5)', correct: true },
        { id: 'b', label: '(4a − 5)(4a + 5)', tag: 'Z4', hint: L("To'rt a kvadratning ildizi ikki a.", 'Корень из четырёх a в квадрате это два a.', 'The root of four a squared is two a.') },
        { id: 'c', label: '(2a − 5)²', tag: 'Z1', hint: L("Kvadrat uch hadli javob berardi.", 'Квадрат дал бы три члена.', 'A square would give three terms.') },
        { id: 'd', label: '(2a − 25)(2a + 25)', tag: 'Z4', hint: L("Yigirma beshning ildizi besh.", 'Корень из двадцати пяти это пять.', 'The root of twenty five is five.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qaysi yozuv ajratilmaydi?",
        'Какая запись не разлагается?',
        'Which record does not factor?',
      ),
      ok: L("Ikki had va qo'shuv.", 'Два члена и плюс.', 'Two terms and a plus.'),
      items: [
        { id: 'a', label: 'y² + 9', correct: true },
        { id: 'b', label: 'y² − 9', tag: 'Z5', hint: L("Ikki had va minus: ajratiladi.", 'Два члена и минус: разлагается.', 'Two terms and a minus: it factors.') },
        { id: 'c', label: 'y² + 6y + 9', tag: 'Z5', hint: L("Uch had, o'rtadagisi tekshiruvdan o'tadi.", 'Три члена, средний проходит проверку.', 'Three terms, and the middle passes the check.') },
        { id: 'd', label: 'y² − 6y + 9', tag: 'Z5', hint: L("Bu ayirmaning kvadrati.", 'Это квадрат разности.', 'That is a square of a difference.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '9 − 6x + x²',
      ok: L("Chetdagilar uch va x ning kvadrati, o'rtadagisi manfiy.", 'Крайние это квадраты трёх и x, а средний отрицательный.', 'The outer ones are squares of three and x, and the middle is negative.'),
      items: [
        { id: 'a', label: '(3 − x)²', correct: true },
        { id: 'b', label: '(3 + x)²', tag: 'Z3', hint: L("O'rta had minus bilan turgan edi.", 'Средний член стоял с минусом.', 'The middle term carried a minus.') },
        { id: 'c', label: '(9 − x)²', tag: 'Z4', hint: L("To'qqizning ildizi uch.", 'Корень из девяти это три.', 'The root of nine is three.') },
        { id: 'd', label: '(3 − x)(3 + x)', tag: 'Z1', hint: L("Bunday ko'paytma o'rta hadni bermaydi.", 'Такое произведение не даёт среднего члена.', 'That product gives no middle term.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida koeffitsiyent bor.", 'Во втором есть коэффициент.', 'The second has a coefficient.'),
    A('2', "Uchinchisi ajratilmaydigan yozuv haqida.", 'Третий про запись, которая не разлагается.', 'The third is about a record that does not factor.'),
    A('3', "Oxirgisida hadlar boshqa tartibda yozilgan.", 'В последнем члены записаны в другом порядке.', 'In the last one the terms are written in a different order.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Belgi: hadlar soni va ishora', 'Признак: число членов и знак', 'The mark: term count and sign'),
  gate: S1.gate,
  fix: {
    tokens: ['(x', '+', '3)²'],
    value: '16',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Uch had turgan edi, demak kvadrat. Olti x bu x va uchning ikki karra ko'paytmasi, va birda o'n olti chiqadi.",
    'Было три члена, значит квадрат. Шесть x это двойное произведение x и трёх, и при единице выходит шестнадцать.',
    'There were three terms, so a square. Six x is twice the product of x and three, and at one it gives sixteen.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    sq: L('kvadratga yig\'ish', 'свернуть в квадрат', 'fold into a square'),
    diff: L('kvadratlar ayirmasi', 'разность квадратов', 'a difference of squares'),
    both: L('ikkovi ham', 'оба', 'both of them'),
    none: L('ajratib bo\'lmaydi', 'разложить нельзя', 'cannot be factored'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['x² + 6x + 9 → (x + 3)²', 'x² − 25 → (x − 5)', 'x² + 25 → ?', '41² − 40² → 81'],
  twoLabel: L('B5 bloki davom etadi', 'Блок Б5 продолжается', 'Block B5 continues'),
  twoA: L(
    "uch had  →  kvadratga yig'iladi",
    'три члена  →  свёртывается в квадрат',
    'three terms  →  folds into a square',
  ),
  twoB: L(
    "ikki had va minus  →  ko'paytmaga",
    'два члена и минус  →  в произведение',
    'two terms and a minus  →  into a product',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "butun ifodalarni o'zgartirish",
    'преобразование целых выражений',
    'transforming whole expressions',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta belgidan chiqdi: hadlar soni va ishora.", 'Вся сегодняшняя работа вышла из одного признака: число членов и знак.', 'All of today came from one mark: the number of terms and the sign.'),
    A('mount', "Keyingi darsda bir yozuvda bir necha formula uchraydi.", 'На следующем уроке в одной записи встретятся несколько формул.', 'Next lesson several formulas meet in a single record.'),
  ],
}

export default makeLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
