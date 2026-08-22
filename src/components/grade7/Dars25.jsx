// ============================================================================
// 7-sinf, Dars 25. YIG'INDINING KVADRATI VA AYIRMANING KVADRATI.
// (Квадрат суммы и квадрат разности). B5 BLOKINI BOSHLAYDI.
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// YILNING ASOSIY XATOSI SHU YERDA: `(a + b)² = a² + b²`. Etalon (§2, B5) uni
// IKKI yo'l bilan yopadi, va ikkovi ham darsda bor:
//   -- to'rtburchakda `ab` katagi IKKITA va ular ekranda turadi, ochmasdan
//      javob variantlari chiqmaydi;
//   -- son qo'yish: a ikki, b uch bo'lganda 25 chiqadi, a kvadrat qo'shuv
//      b kvadrat esa 13 beradi. Xuk aynan shu ikki tabloni ko'rsatadi.
//
// AYIRMANING KVADRATI FARQLASH EKRANIDA: minusli katakda ikki minus
// ko'paytiriladi va OXIRGI had musbat qoladi. Ya'ni ikki formula orasidagi
// farq bitta: o'rta hadning ishorasi.
//
// ASBOB TAYYOR: yuza to'rtburchagi (3-asbob). Darslik shu modelni o'zi
// so'raydi -- yig'indi kvadratining geometrik ko'rinishi 57-betda.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_25'
const LESSON_TITLE = L("Yig'indining kvadrati va ayirmaning kvadrati", 'Квадрат суммы и квадрат разности', 'The square of a sum and the square of a difference')
const LESSON_NO = L('25-dars', 'Урок 25', 'Lesson 25')
const BLOCK = { label: L('B5-blok', 'Блок Б5', 'Block B5'), from: 25, to: 32, current: 25 }

const TAGS = {
  Z1: L("ikki karra ko'paytma yo'qoldi", 'двойное произведение потеряно', 'the double product was lost'),
  Z2: L("ko'paytma tushib qoldi", 'произведение пропущено', 'a product was skipped'),
  Z3: L("o'rta hadning ishorasi", 'знак среднего члена', 'the sign of the middle term'),
  Z4: L("koeffitsiyent va ko'rsatkich", 'коэффициент и показатель', 'the coefficient and the exponent'),
  Z5: L('formula almashtirildi', 'формула спутана', 'the formula was mixed up'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. TABLODA: a ikki, b uch bo'lgandagi qiymat.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("YIG'INDINING KVADRATI", 'КВАДРАТ СУММЫ', 'THE SQUARE OF A SUM'),
  noBack: true,
  noNotes: true,
  title: L('Ikki had yoki uch had', 'Два члена или три', 'Two terms or three'),
  gate: {
    source: { kind: 'plain', tokens: ['(a', '+', 'b)²'] },
    rows: [
      { tokens: ['a²', '+', 'b²'], value: '13' },
      { tokens: ['a²', '+', '2ab', '+', 'b²'], value: '25' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Yig'indining kvadrati ikki xil ochilgan. Tabloda a ikki, b uch bo'lgandagi qiymat turadi. Yozuvning o'zi shu sonlarda yigirma besh beradi. Kim haq?",
      'Квадрат суммы раскрыли двумя способами. На табло значение при a равном двум и b равном трём. Сама запись при этих числах даёт двадцать пять. Кто прав?',
      'The square of a sum was expanded in two ways. The boards show the value at a equal to two and b equal to three. The record itself gives twenty five there. Who is right?',
    ),
    items: [
      {
        id: 'three',
        label: L('Uch hadli yozuv', 'Тот, у кого три члена', 'The one with three terms'),
        hint: L(
          "Taxminingiz qabul qilindi. To'rtburchakda tekshiramiz.",
          'Прогноз принят. Проверим на прямоугольнике.',
          'Your prediction is taken. We will check it on the rectangle.',
        ),
      },
      {
        id: 'two',
        label: L('Ikki hadli yozuv', 'Тот, у кого два члена', 'The one with two terms'),
        hint: L(
          "Sonlarni qo'ying: ikki qo'shuv uchning kvadrati yigirma besh, to'rt qo'shuv to'qqiz esa o'n uch.",
          'Подставь числа: два плюс три в квадрате это двадцать пять, а четыре плюс девять это тринадцать.',
          'Substitute: two plus three squared is twenty five, while four plus nine is thirteen.',
        ),
      },
      {
        id: 'both',
        label: L("Ikkovi ham: bu bir xil yozuv, faqat qisqarog'i", 'Оба: это одна запись, просто короче', 'Both: it is the same record, just shorter'),
        hint: L(
          "Bitta yozuv bir xil sonlarda ikki xil qiymat bermaydi.",
          'Одна запись при одних и тех же числах не даёт двух разных значений.',
          'One record does not give two different values at the same numbers.',
        ),
      },
      {
        id: 'neither',
        label: L('Hech kim: kvadratni ochib bo\'lmaydi', 'Ни один: квадрат раскрыть нельзя', 'Neither: a square cannot be expanded'),
        hint: L(
          "Kvadrat bu o'sha qavs ikki marta, ikki qavsning ko'paytmasini esa allaqachon hisoblagan edik.",
          'Квадрат это та же скобка дважды, а произведение двух скобок мы уже считали.',
          'A square is that bracket twice, and we have already multiplied two brackets.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Yig'indining kvadrati ikki xil ochilgan.", 'Квадрат суммы раскрыли двумя способами.', 'The square of a sum was expanded in two ways.'),
    A('mount', "Tabloda a ikki, b uch bo'lgandagi qiymat turadi. Yozuvning o'zi yigirma besh beradi.", 'На табло значение при a равном двум и b равном трём. Сама запись даёт двадцать пять.', 'The boards show the value at a equal to two and b equal to three. The record itself gives twenty five.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. 21-darsdan: ikki qavsning ko'paytmasi. KVOTA EKRANI.
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
      prompt: '(x + 3)(x + 5)',
      ok: L("Har had har hadga: to'rt ko'paytma, keyin o'xshashlar.", 'Каждый член на каждый: четыре произведения, потом подобные.', 'Every term by every term: four products, then the like terms.'),
      items: [
        { id: 'a', label: 'x² + 8x + 15', correct: true },
        { id: 'b', label: 'x² + 15', tag: 'Z1', hint: L("O'rta ikki katak ham bor: uch x va besh x.", 'Две средние клетки тоже есть: три x и пять x.', 'The two middle cells are there too: three x and five x.') },
        { id: 'c', label: 'x² + 8x + 8', tag: 'Z6', hint: L("Oxirgi katakda uch karra besh, ya'ni o'n besh.", 'В последней клетке три на пять, то есть пятнадцать.', 'The last cell is three times five, that is fifteen.') },
        { id: 'd', label: '2x + 8x + 15', tag: 'Z4', hint: L("Birinchi katakda x karra x, ya'ni x kvadrat.", 'В первой клетке x на x, то есть x в квадрате.', 'The first cell is x times x, that is x squared.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(a + b)(a + b) da nechta ko'paytma bor?",
        'Сколько произведений в (a + b)(a + b)?',
        'How many products are in (a + b)(a + b)?',
      ),
      ok: L("Ikki had karra ikki had to'rt ko'paytma beradi.", 'Два члена на два члена дают четыре произведения.', 'Two terms by two terms give four products.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '2', tag: 'Z1', hint: L("Har had ikkinchi qavsning har hadiga ko'paytiriladi.", 'Каждый член умножается на каждый член второй скобки.', 'Each term multiplies each term of the second bracket.') },
        { id: 'c', label: '3', tag: 'Z2', hint: L("Ko'paytma to'rtta, lekin ikkitasi bir xil, shuning uchun javobda uch had bo'ladi.", 'Произведений четыре, но два из них одинаковы, поэтому в ответе три члена.', 'There are four products, but two are the same, so the answer has three terms.') },
        { id: 'd', label: '1', tag: 'Z1', hint: L("Qavsda ikkita had bor, va ikkinchi qavsda ham ikkita.", 'В скобке два члена, и во второй скобке тоже два.', 'The bracket has two terms, and so does the second.') },
      ],
    },
    {
      wrap: false,
      prompt: 'ab + ab',
      ok: L("Ikki o'xshash had qo'shildi, koeffitsiyent ikki bo'ldi.", 'Сложились два подобных члена, коэффициент стал двойкой.', 'Two like terms added, and the coefficient became two.'),
      items: [
        { id: 'a', label: '2ab', correct: true },
        { id: 'b', label: 'ab²', tag: 'Z4', hint: L("Qo'shishda ko'rsatkich o'zgarmaydi.", 'При сложении показатель не меняется.', 'Adding does not change the exponent.') },
        { id: 'c', label: 'a²b²', tag: 'Z4', hint: L("Hadlar qo'shiladi, ko'paytirilmaydi.", 'Члены складываются, а не умножаются.', 'The terms add, they do not multiply.') },
        { id: 'd', label: 'ab', tag: 'Z1', hint: L("Qo'shiluvchi ikkita, demak ikki karra ab chiqadi.", 'Слагаемых два, значит выйдет два ab.', 'There are two addends, so two ab comes out.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Hammasi o'tgan blokdan.", 'Три коротких вопроса. Все из прошлого блока.', 'Three short questions. All from the last block.'),
    A('1', "Ikkinchisida ikki qavs bir xil.", 'Во втором скобки одинаковые.', 'In the second the brackets are the same.'),
    A('2', "Uchinchisi o'xshash hadlar haqida. Bugun u kerak bo'ladi.", 'Третий про подобные члены. Сегодня они понадобятся.', 'The third is about like terms. They will be needed today.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. IKKI QAVS BIR XIL: `ab` katagi IKKITA.
// ============================================================
const S3 = {
  kind: 'grid',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Ikki katakda bir xil narsa', 'В двух клетках одно и то же', 'Two cells hold the same thing'),
  caption: L(
    "Kvadrat bu o'sha qavs ikki marta. To'rt katakni bosing.",
    'Квадрат это та же скобка дважды. Нажми на четыре клетки.',
    'A square is that bracket twice. Tap the four cells.',
  ),
  left: ['a', '+b'],
  top: ['a', '+b'],
  options: [
    { id: 'a', label: 'a² + 2ab + b²' },
    { id: 'b', label: 'a² + b²' },
    { id: 'c', label: 'a² + ab + b²' },
    { id: 'd', label: 'a² + 2ab' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Ikki katak bo'sh qoldi, va ikkovida ham ab turibdi.", 'Две клетки остались пустыми, и в обеих стоит ab.', 'Two cells stayed empty, and both hold ab.') },
    { key: 'c', tag: 'Z2', hint: L("ab katagi ikkita, bittasi emas.", 'Клеток с ab две, а не одна.', 'There are two ab cells, not one.') },
    { key: 'd', tag: 'Z2', hint: L("Oxirgi katakda b karra b, ya'ni b kvadrat turibdi.", 'В последней клетке b на b, то есть b в квадрате.', 'The last cell is b times b, that is b squared.') },
  ],
  note: L(
    "To'rt katak, va ikkitasi bir xil ab beradi. Shuning uchun javobda IKKI KARRA ko'paytma turadi, va hadlar uchta bo'ladi.",
    'Четыре клетки, и две дают одинаковое ab. Поэтому в ответе стоит ДВОЙНОЕ произведение, и членов получается три.',
    'Four cells, and two of them give the same ab. So the answer holds a DOUBLE product, and there are three terms.',
  ),
  audio: [
    A('mount', "Qavs kvadratda tursa, u ikki marta yozilgani bilan bir xil.", 'Если скобка стоит в квадрате, это то же, что написать её дважды.', 'A bracket squared is the same as writing it twice.'),
    A('mount', "Chapda ham, yuqorida ham bir xil hadlar. To'rt katakni bosing.", 'И слева, и сверху одинаковые члены. Нажми на четыре клетки.', 'The same terms on the left and on top. Tap the four cells.'),
    A('cell-all', "Ikki katakda bir xil ab chiqdi. Ular qo'shiladi.", 'В двух клетках вышло одинаковое ab. Они складываются.', 'Two cells gave the same ab. They add together.'),
  ],
}

// ============================================================
// 4. FARQLASH. AYIRMANING KVADRATI: o'rta kataklar manfiy, OXIRGISI
// esa musbat -- minus karra minus.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Ayirmaning kvadrati', 'Квадрат разности', 'The square of a difference'),
  caption: L(
    "Endi qavsda ayirish. To'rt katakni bosing va oxirgisining ishorasiga qarang.",
    'Теперь в скобке вычитание. Нажми на четыре клетки и посмотри на знак последней.',
    'Now the bracket has a subtraction. Tap the four cells and watch the sign of the last one.',
  ),
  left: ['a', '−b'],
  top: ['a', '−b'],
  options: [
    { id: 'a', label: 'a² − 2ab + b²' },
    { id: 'b', label: 'a² − 2ab − b²' },
    { id: 'c', label: 'a² − b²' },
    { id: 'd', label: 'a² + 2ab + b²' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Oxirgi katakda ikki minus bor, ular birga musbat beradi.", 'В последней клетке два минуса, вместе они дают плюс.', 'The last cell has two minuses, and together they give a plus.') },
    { key: 'c', tag: 'Z5', hint: L("O'rta ikki katak bo'sh emas, ikkovida ham manfiy ab turibdi.", 'Две средние клетки не пусты, в обеих отрицательное ab.', 'The two middle cells are not empty, both hold a negative ab.') },
    { key: 'd', tag: 'Z3', hint: L("O'rta kataklarda bittadan minus bor, demak ular manfiy.", 'В средних клетках по одному минусу, значит они отрицательны.', 'The middle cells have one minus each, so they are negative.') },
  ],
  note: L(
    "Yig'indi kvadratidan farqi BITTA: o'rta hadning ishorasi. Oxirgi had baribir musbat, chunki minus minusga ko'paytiriladi.",
    'Отличие от квадрата суммы одно: знак среднего члена. Последний член всё равно положителен, потому что минус умножается на минус.',
    'There is one difference from the square of a sum: the sign of the middle term. The last term is still positive, because minus multiplies minus.',
  ),
  audio: [
    A('mount', "O'sha to'rtburchak, lekin qavsda ayirish turibdi.", 'Тот же прямоугольник, но в скобке вычитание.', 'The same rectangle, but the bracket holds a subtraction.'),
    A('mount', "Oxirgi katakka alohida diqqat: unda ikkita minus uchrashadi.", 'Особое внимание на последнюю клетку: в ней встречаются два минуса.', 'Watch the last cell closely: two minuses meet there.'),
    A('cell-all', "O'rta kataklar manfiy, oxirgisi esa musbat chiqdi.", 'Средние клетки отрицательны, а последняя вышла положительной.', 'The middle cells are negative, and the last came out positive.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Formulani o'quvchi yig'adi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Formulani yig\'ing', 'Собери формулу', 'Build the formula'),
  template: ['(a + b)²  =  a² + ', { slot: 0 }, ' + ', { slot: 1 }],
  parts: [
    { id: 'a', label: '2ab' },
    { id: 'b', label: 'b²' },
    { id: 'c', label: 'ab' },
    { id: 'd', label: '2b²' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "O'rtada nima turadi va oxirida nima turadi.",
    'Что стоит в середине и что в конце.',
    'What stands in the middle and what stands at the end.',
  ),
  checkNote: L(
    "ab katagi ikkita, shuning uchun o'rtada ikki karra ko'paytma. Oxirida ikkinchi hadning kvadrati.",
    'Клеток с ab две, поэтому в середине двойное произведение. В конце квадрат второго члена.',
    'There are two ab cells, so the middle holds the double product. At the end, the square of the second term.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("ab katagi ikkita edi.", 'Клеток с ab было две.', 'There were two ab cells.') },
    { key: 'd', tag: 'Z6', hint: L("Oxirgi katak b karra b, ya'ni b kvadrat.", 'Последняя клетка это b на b, то есть b в квадрате.', 'The last cell is b times b, that is b squared.') },
    { key: '*', tag: 'Z1', hint: L("To'rtburchakdagi kataklarni sanang.", 'Посчитай клетки в прямоугольнике.', 'Count the cells in the rectangle.') },
  ],
  audio: [
    A('mount', "To'rtburchak ishini qildi. Endi formulani yozib qo'yamiz.", 'Прямоугольник свою работу сделал. Теперь запишем формулу.', 'The rectangle has done its job. Now let us write the formula down.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. KOEFFITSIYENT QAVS ICHIDA: u ham kvadratga ko'tariladi.
// ============================================================
const S6 = {
  kind: 'grid',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Qavs ichida koeffitsiyent', 'В скобке коэффициент', 'A coefficient inside the bracket'),
  caption: L(
    "Birinchi had ikki x. To'rt katakni bosing.",
    'Первый член это два x. Нажми на четыре клетки.',
    'The first term is two x. Tap the four cells.',
  ),
  left: ['2x', '+3'],
  top: ['2x', '+3'],
  options: [
    { id: 'a', label: '4x² + 12x + 9' },
    { id: 'b', label: '4x² + 9' },
    { id: 'c', label: '2x² + 12x + 9' },
    { id: 'd', label: '4x² + 6x + 9' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("O'rta ikki katak bor: ikki x karra uch, va yana bir marta.", 'Две средние клетки есть: два x на три, и ещё раз.', 'The two middle cells are there: two x times three, and once more.') },
    { key: 'c', tag: 'Z4', hint: L("Ikki x karra ikki x to'rt x kvadrat beradi: koeffitsiyent ham kvadratga ko'tariladi.", 'Два x на два x это четыре x в квадрате: коэффициент тоже возводится в квадрат.', 'Two x times two x is four x squared: the coefficient is squared too.') },
    { key: 'd', tag: 'Z2', hint: L("O'rta ko'paytma ikki marta hisobga olinadi.", 'Среднее произведение считается дважды.', 'The middle product counts twice.') },
  ],
  note: L(
    "Koeffitsiyent harf bilan birga kvadratga ko'tariladi, o'rta ko'paytma esa ikki marta olinadi.",
    'Коэффициент возводится в квадрат вместе с буквой, а среднее произведение берётся дважды.',
    'The coefficient is squared along with the letter, and the middle product is taken twice.',
  ),
  audio: [
    A('mount', "Bu safar qavsda koeffitsiyent bor: ikki x.", 'На этот раз в скобке есть коэффициент: два x.', 'This time the bracket has a coefficient: two x.'),
    A('mount', "Birinchi katakka diqqat: ikkilik ham kvadratga ko'tariladi.", 'Внимание на первую клетку: двойка тоже возводится в квадрат.', 'Watch the first cell: the two is squared as well.'),
    A('cell-all', "To'rt katak ochildi, o'rtadagilari bir xil.", 'Четыре клетки открыты, средние одинаковы.', 'All four cells are open, and the middle ones match.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH: kvadrat NOL bo'lishi
// mumkin. Formula esa har sonda ishlaydi.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Kvadrat nol bo\'lganda', 'Когда квадрат равен нулю', 'When the square is zero'),
  letter: 'x',
  numbers: [1, 3, 5],
  rows: [
    { id: 'r1', role: 'source', expr: '(x − 5)²', sub: (n) => '(' + n + ' − 5)²', val: (n) => (n - 5) * (n - 5) },
    { id: 'r2', expr: 'x² − 10x + 25', sub: (n) => n + '² − 10 · ' + n + ' + 25', val: (n) => n * n - 10 * n + 25 },
  ],
  probe: {
    question: L(
      "x besh bo'lganda ikki qator ham nol berdi. Bu nima degani?",
      'При x равном пяти обе строки дали ноль. Что это значит?',
      'At x equal to five both rows gave zero. What does that mean?',
    ),
    items: [
      {
        id: 'zero',
        correct: true,
        label: L('Kvadrat nol bo\'lishi mumkin: qavs nolga aylandi', 'Квадрат может быть нулём: скобка обратилась в ноль', 'A square can be zero: the bracket became zero'),
      },
      {
        id: 'broken',
        tag: 'Z6',
        label: L('Formula beshda ishlamaydi', 'Формула не работает при пяти', 'The formula fails at five'),
        hint: L(
          "Qatorlar beshda ham mos keldi: nol nolga teng.",
          'Строки совпали и при пяти: ноль равен нулю.',
          'The rows matched at five as well: zero equals zero.',
        ),
      },
      {
        id: 'always',
        tag: 'Z5',
        label: L('Ayirmaning kvadrati har doim nol', 'Квадрат разности всегда ноль', 'The square of a difference is always zero'),
        hint: L(
          "Birda o'n olti, uchda to'rt chiqdi, ya'ni nol emas.",
          'При единице вышло шестнадцать, при трёх четыре, то есть не ноль.',
          'At one it gave sixteen, at three it gave four, so not zero.',
        ),
      },
      {
        id: 'sign',
        tag: 'Z3',
        label: L("Oxirgi had minus yigirma besh bo'lishi kerak", 'Последний член должен быть минус двадцать пять', 'The last term should be minus twenty five'),
        hint: L(
          "Unda birda minus qirq to'qqiz chiqardi, qavs esa o'n olti beradi.",
          'Тогда при единице вышло бы минус сорок девять, а скобка даёт шестнадцать.',
          'Then at one it would give minus forty nine, while the bracket gives sixteen.',
        ),
      },
    ],
  },
  okText: L(
    "Formula har qanday sonda ishlaydi. Nol esa qavs nolga teng bo'lgan joyda chiqadi: besh minus besh.",
    'Формула верна при любом числе. А ноль получается там, где скобка равна нулю: пять минус пять.',
    'The formula holds for any number. Zero appears where the bracket equals zero: five minus five.',
  ),
  audio: [
    A('mount', "Yuqorida qavsli yozuv, pastda formula bo'yicha ochilgan yozuv.", 'Сверху запись со скобкой, снизу раскрытая по формуле.', 'Above the record with the bracket, below the one expanded by the formula.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Ikki qatorni solishtiring.", 'Сравни две строки.', 'Compare the two rows.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z1',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('birinchi hadning kvadrati', 'квадрат первого члена', 'the square of the first term') },
    { id: 'f2', label: L("qo'shuv ikki karra ko'paytma", 'плюс двойное произведение', 'plus the double product') },
    { id: 'f3', label: L("qo'shuv ikkinchi hadning kvadrati", 'плюс квадрат второго', 'plus the square of the second') },
    { id: 'f4', label: L("ayirmada esa o'rta had ayiriladi", 'а в квадрате разности среднее вычитается', 'and in a difference the middle is subtracted') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval birinchi hadning kvadrati, keyin o'rta had, keyin ikkinchisining kvadrati, oxirida ayirma holati.",
    'Порядок нарушен. Сначала квадрат первого, потом средний член, потом квадрат второго, в конце случай разности.',
    'The order is off. The square of the first, then the middle term, then the square of the second, and the difference case last.',
  ),
  lawChips: [
    { label: '( )²', tone: 'par' },
    { label: '·', tone: 's2' },
    { label: '2ab', tone: 'off' },
    { label: '−', tone: 's1' },
  ],
  lawSweep: L(
    "kvadrat, ko'paytma, ikki karra had, ishora",
    'квадрат, произведение, двойной член, знак',
    'the square, the product, the double term, the sign',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ikki ifoda yig'indisining kvadrati birinchisining kvadratiga, birinchi va ikkinchisining ikki karra ko'paytmasiga va ikkinchisining kvadratiga teng.",
        'Квадрат суммы двух выражений равен квадрату первого, плюс двойное произведение первого и второго, плюс квадрат второго.',
        'The square of a sum of two expressions equals the square of the first, plus twice the product of the first and the second, plus the square of the second.',
      ),
      L(
        "Ayirmaning kvadratida faqat o'rta hadning ishorasi almashadi: ikkinchi hadning kvadrati musbat qoladi, chunki minus minusga ko'paytiriladi.",
        'В квадрате разности меняется только знак среднего члена: квадрат второго остаётся положительным, потому что минус умножается на минус.',
        'In the square of a difference only the middle sign changes: the square of the second stays positive, because minus multiplies minus.',
      ),
    ],
  },
  hookCap: L(
    "To'rt katak, lekin uch had",
    'Четыре клетки, но три члена',
    'Four cells, but three terms',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('birinchisining kvadrati', 'квадрат первого', 'the square of the first'),
    L("ikki karra ko'paytma", 'двойное произведение', 'the double product'),
    L('ikkinchisining kvadrati', 'квадрат второго', 'the square of the second'),
  ],
  audio: [
    A('mount', "Ikki formulani ko'rdik va farqi bittaligini aniqladik. Endi qoidani yig'amiz.", 'Обе формулы мы увидели и выяснили, что отличие одно. Теперь соберём правило.', 'We have seen both formulas and found the single difference. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda qavslarning ishorasi boshqa bo'ladi.", 'Верно. На следующем уроке знаки скобок будут разными.', 'Correct. Next lesson the brackets will have different signs.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni toping', 'Найди ответ', 'Find the answer'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: false,
      prompt: '(x + 1)²',
      ok: L("Ikki karra ko'paytma ikki x, oxirida birlik.", 'Двойное произведение это два x, в конце единица.', 'The double product is two x, with one at the end.'),
      items: [
        { id: 'a', label: 'x² + 2x + 1', correct: true },
        { id: 'b', label: 'x² + 1', tag: 'Z1', hint: L("O'rta had tushib qoldi: x karra bir ikki marta.", 'Средний член пропал: x на один дважды.', 'The middle term is missing: x times one, twice.') },
        { id: 'c', label: 'x² + x + 1', tag: 'Z2', hint: L("Ko'paytma ikki marta hisobga olinadi.", 'Произведение считается дважды.', 'The product counts twice.') },
        { id: 'd', label: 'x² + 2x', tag: 'Z2', hint: L("Oxirgi katak bir karra bir, ya'ni bir.", 'Последняя клетка один на один, то есть один.', 'The last cell is one times one, that is one.') },
      ],
    },
    {
      wrap: false,
      prompt: '(y − 4)²',
      ok: L("O'rta had manfiy, oxirgisi esa musbat.", 'Средний член отрицательный, а последний положительный.', 'The middle term is negative and the last is positive.'),
      items: [
        { id: 'a', label: 'y² − 8y + 16', correct: true },
        { id: 'b', label: 'y² − 8y − 16', tag: 'Z3', hint: L("Oxirgi katakda minus to'rt karra minus to'rt.", 'В последней клетке минус четыре на минус четыре.', 'The last cell is minus four times minus four.') },
        { id: 'c', label: 'y² − 16', tag: 'Z1', hint: L("O'rta ikki katak bor.", 'Две средние клетки есть.', 'The two middle cells are there.') },
        { id: 'd', label: 'y² + 8y + 16', tag: 'Z3', hint: L("O'rta kataklarda bittadan minus bor.", 'В средних клетках по одному минусу.', 'The middle cells have one minus each.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "O'xshash hadlar qo'shilgandan keyin yig'indi kvadratida nechta had qoladi?",
        'Сколько членов остаётся в квадрате суммы после приведения подобных?',
        'How many terms remain in the square of a sum after collecting like terms?',
      ),
      ok: L("Ko'paytma to'rtta, lekin ikkitasi qo'shilib bittaga aylanadi.", 'Произведений четыре, но два складываются в один.', 'There are four products, but two add into one.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '4', tag: 'Z2', hint: L("Ikki o'rta ko'paytma o'xshash va bitta hadga qo'shiladi.", 'Два средних произведения подобны и складываются в один член.', 'The two middle products are alike and add into one term.') },
        { id: 'c', label: '2', tag: 'Z1', hint: L("O'rta had ham qoladi, u yo'qolmaydi.", 'Средний член тоже остаётся, он не исчезает.', 'The middle term stays too, it does not vanish.') },
        { id: 'd', label: '5', tag: 'Z6', hint: L("Ko'paytmalar to'rtta, yangi had paydo bo'lmaydi.", 'Произведений четыре, новых членов не появляется.', 'There are four products, no new terms appear.') },
      ],
    },
    {
      wrap: false,
      prompt: '(3a + 2)²',
      ok: L("Uch a kvadratga ko'tarildi, o'rta had ikki karra olindi.", 'Три a возвели в квадрат, средний член взяли дважды.', 'Three a was squared, and the middle term taken twice.'),
      items: [
        { id: 'a', label: '9a² + 12a + 4', correct: true },
        { id: 'b', label: '9a² + 4', tag: 'Z1', hint: L("O'rta had bor: uch a karra ikki, ikki marta.", 'Средний член есть: три a на два, дважды.', 'The middle term is there: three a times two, twice.') },
        { id: 'c', label: '3a² + 12a + 4', tag: 'Z4', hint: L("Uch a karra uch a to'qqiz a kvadrat beradi.", 'Три a на три a это девять a в квадрате.', 'Three a times three a is nine a squared.') },
        { id: 'd', label: '9a² + 6a + 4', tag: 'Z2', hint: L("O'rta ko'paytma ikki marta olinadi.", 'Среднее произведение берётся дважды.', 'The middle product is taken twice.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Uchinchisida hadlar sanaladi.", 'Четыре вопроса. В третьем считаются члены.', 'Four questions. The third counts terms.'),
    A('1', "Ikkinchisida ayirma bor.", 'Во втором есть разность.', 'The second has a difference.'),
    A('2', "Uchinchisiga o'ylab javob bering.", 'На третий ответь подумав.', 'Think before answering the third.'),
    A('3', "Oxirgisida koeffitsiyent bor.", 'В последнем есть коэффициент.', 'The last one has a coefficient.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: hadlar, keyin oxirgi ishora.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Katta koeffitsiyent', 'Большой коэффициент', 'A big coefficient'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['(5x − 2)²  =  ', { slot: 0 }, ' − ', { slot: 1 }, ' + 4'],
  parts: [
    { id: 'a', label: '25x²' },
    { id: 'b', label: '20x' },
    { id: 'c', label: '10x²' },
    { id: 'd', label: '10x' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Birinchi va o'rta hadni yozing. Oxirgisi turibdi.",
    'Запиши первый и средний члены. Последний уже стоит.',
    'Write the first and the middle terms. The last one is already there.',
  ),
  checkNote: L(
    "Besh x ni kvadratga ko'tarsak yigirma besh x kvadrat. Ikki karra ko'paytma esa ikki karra besh x karra ikki, ya'ni yigirma x.",
    'Пять x в квадрате это двадцать пять x в квадрате. Двойное произведение это два на пять x на два, то есть двадцать x.',
    'Five x squared is twenty five x squared. The double product is two times five x times two, that is twenty x.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Besh x karra besh x yigirma besh x kvadrat beradi.", 'Пять x на пять x это двадцать пять x в квадрате.', 'Five x times five x is twenty five x squared.') },
    { key: 'd', tag: 'Z6', hint: L("Ko'paytma ikki marta olinadi: ikki karra besh x karra ikki.", 'Произведение берётся дважды: два на пять x на два.', 'The product is taken twice: two times five x times two.') },
    { key: '*', tag: 'Z4', hint: L("Koeffitsiyent ham kvadratga ko'tariladi.", 'Коэффициент тоже возводится в квадрат.', 'The coefficient is squared as well.') },
  ],
  probe: {
    question: L("Oxirgi had nega musbat?", 'Почему последний член положителен?', 'Why is the last term positive?'),
    items: [
      {
        id: 'a',
        correct: true,
        label: L("minus minusga ko'paytiriladi", 'минус умножается на минус', 'minus multiplies minus'),
      },
      {
        id: 'b',
        tag: 'Z3',
        label: L("oxirgi had har doim musbat bo'ladi", 'последний член всегда положителен', 'the last term is always positive'),
        hint: L("Kvadratda shunday, lekin sababi ikki minusda, o'z-o'zidan emas.", 'В квадрате это так, но причина именно в двух минусах, а не сама собой.', 'In a square it is so, but the reason is the two minuses, not a rule of its own.'),
      },
      {
        id: 'c',
        tag: 'Z3',
        label: L("bu xato, u manfiy bo'lishi kerak", 'это ошибка, он должен быть отрицательным', 'that is a mistake, it should be negative'),
        hint: L("Minus ikki karra minus ikki musbat to'rt beradi.", 'Минус два на минус два даёт плюс четыре.', 'Minus two times minus two gives plus four.'),
      },
      {
        id: 'd',
        tag: 'Z5',
        label: L('chunki kvadrat manfiy bo\'lmaydi', 'потому что квадрат не бывает отрицательным', 'because a square is never negative'),
        hint: L("Gap butun kvadratning qiymati haqida emas, yozuvdagi had haqida.", 'Речь не о значении всего квадрата, а о члене записи.', 'This is about a term of the record, not the value of the whole square.'),
      },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval hadlarni yozish, keyin ishorani tushuntirish.", 'Два шага. Сначала записать члены, потом объяснить знак.', 'Two steps. Write the terms first, then explain the sign.'),
    A('mount', "Koeffitsiyent besh, va u ham kvadratga ko'tariladi.", 'Коэффициент пять, и он тоже возводится в квадрат.', 'The coefficient is five, and it is squared too.'),
    A('two', "Endi ikkinchi qadam: oxirgi hadning ishorasi.", 'Теперь второй шаг: знак последнего члена.', 'Now the second step: the sign of the last term.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Asbob yo'q.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('To\'rtburchaksiz', 'Без прямоугольника', 'Without the rectangle'),
  template: ['(a + 7)²  =  a² + ', { slot: 0 }, ' + ', { slot: 1 }],
  parts: [
    { id: 'a', label: '14a' },
    { id: 'b', label: '49' },
    { id: 'c', label: '7a' },
    { id: 'd', label: '14' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Formula bo'yicha yig'ing.",
    'Собери по формуле.',
    'Build it by the formula.',
  ),
  checkNote: L(
    "Ikki karra ko'paytma bu ikki karra a karra yetti, ya'ni o'n to'rt a. Yettining kvadrati qirq to'qqiz.",
    'Двойное произведение это два на a на семь, то есть четырнадцать a. Квадрат семи это сорок девять.',
    'The double product is two times a times seven, that is fourteen a. The square of seven is forty nine.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("a karra yetti katagi ikkita.", 'Клеток с a на семь две.', 'There are two cells with a times seven.') },
    { key: 'd', tag: 'Z6', hint: L("Oxirida yettining kvadrati turadi.", 'В конце стоит квадрат семи.', 'At the end stands the square of seven.') },
    { key: '*', tag: 'Z1', hint: L("Formulani eslang: kvadrat, ikki karra ko'paytma, kvadrat.", 'Вспомни формулу: квадрат, двойное произведение, квадрат.', 'Recall the formula: square, double product, square.') },
  ],
  audio: [
    A('mount', "Bu safar to'rtburchak yo'q. Formulani o'zingiz qo'llaysiz.", 'На этот раз прямоугольника нет. Формулу применяешь сам.', 'This time there is no rectangle. You apply the formula yourself.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Hisoblangan uchta ko'paytma TO'G'RI, lekin
// ular TO'RTTA bo'lishi kerak edi -- yilning asosiy xatosi.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Hisoblangan ko'paytmalarning hammasi to'g'ri. Shunday bo'lsa ham, qaysi qator xato?",
    'Все посчитанные произведения верны. И всё же какая строка ошибочна?',
    'Every product worked out is right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '(x + 4)²' },
    { id: 'r2', text: 'x · x = x²' },
    { id: 'r3', text: '4 · 4 = 16' },
    { id: 'r4', text: L("o'rta had: 4x", 'средний член: 4x', 'the middle term: 4x') },
    { id: 'r5', text: L('javob: x² + 4x + 16', 'ответ: x² + 4x + 16', 'answer: x² + 4x + 16') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: x karra x x kvadrat beradi.", 'Верно: x на x это x в квадрате.', 'Right: x times x is x squared.'),
    r3: L("To'g'ri: to'rt karra to'rt o'n olti.", 'Верно: четыре на четыре шестнадцать.', 'Right: four times four is sixteen.'),
    r5: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z2', r2: 'Z2', r3: 'Z2', r5: 'Z2' },
  proofFill: {
    template: ['4 · x  =  ', { slot: 0 }, '   →   x² + ', { slot: 1 }, ' + 16'],
    parts: [
      { id: 'a', label: '4x' },
      { id: 'b', label: '8x' },
      { id: 'c', label: '4' },
      { id: 'd', label: '16x' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Tushib qolgan ko'paytmani yozing va javobni tuzating.",
      'Запиши пропущенное произведение и исправь ответ.',
      'Write the missing product and put the answer right.',
    ),
    checkNote: L(
      "Kataklar to'rtta: x karra x, x karra to'rt, to'rt karra x va to'rt karra to'rt. O'rtadagi ikkitasi sakkiz x beradi.",
      'Клеток четыре: x на x, x на четыре, четыре на x и четыре на четыре. Два средних дают восемь x.',
      'There are four cells: x by x, x by four, four by x and four by four. The two middle ones give eight x.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z2', hint: L("To'rt karra x da x harfi qoladi.", 'В четыре на x буква x остаётся.', 'In four times x the letter x stays.') },
      { key: 'd', tag: 'Z6', hint: L("O'rta ko'paytma ikkita, har biri to'rt x.", 'Средних произведений два, каждое по четыре x.', 'There are two middle products, four x each.') },
      { key: '*', tag: 'Z1', hint: L("Kvadratda kataklar to'rtta, uchta emas.", 'В квадрате клеток четыре, а не три.', 'A square has four cells, not three.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda hisoblangan ko'paytmalar to'g'ri.", 'В этой ловушке посчитанные произведения верны.', 'In this trap the products worked out are right.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. To'rtinchi ko'paytma umuman yozilmagan.", 'Нашёл. Четвёртое произведение вообще не было записано.', 'You found it. The fourth product was never written at all.'),
    A('done', "Kvadratda kataklar to'rtta, va o'rtadagi ikkitasi qo'shiladi.", 'В квадрате клеток четыре, и два средних складываются.', 'A square has four cells, and the two middle ones add.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TEZ HISOB: formula sonlar bilan ham ishlaydi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Ustunsiz hisoblash', 'Счёт без столбика', 'Computing without long multiplication'),
  given: L(
    "O'ttiz birni kvadratga ko'taramiz, lekin ustunda ko'paytirmaymiz: o'ttiz bir bu o'ttiz qo'shuv bir.",
    'Возведём в квадрат тридцать один, не умножая в столбик: тридцать один это тридцать плюс один.',
    'Let us square thirty one without long multiplication: thirty one is thirty plus one.',
  ),
  template: ['31²  =  (30 + 1)²  =  900 + ', { slot: 0 }, ' + ', { slot: 1 }],
  parts: [
    { id: 'a', label: '60' },
    { id: 'b', label: '1' },
    { id: 'c', label: '30' },
    { id: 'd', label: '2' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki karra ko'paytma va ikkinchining kvadrati.",
    'Двойное произведение и квадрат второго.',
    'The double product and the square of the second.',
  ),
  checkNote: L(
    "Ikki karra o'ttiz karra bir oltmish beradi, birning kvadrati esa bir. Hammasi bo'lib to'qqiz yuz oltmish bir.",
    'Два на тридцать на один это шестьдесят, а один в квадрате это один. Всего девятьсот шестьдесят один.',
    'Two times thirty times one is sixty, and one squared is one. In all, nine hundred sixty one.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("Ko'paytma ikki marta olinadi: ikki karra o'ttiz karra bir.", 'Произведение берётся дважды: два на тридцать на один.', 'The product is taken twice: two times thirty times one.') },
    { key: 'd', tag: 'Z6', hint: L("Oxirida birning kvadrati turadi.", 'В конце стоит квадрат единицы.', 'At the end stands the square of one.') },
    { key: '*', tag: 'Z1', hint: L("Formula sonlar uchun ham xuddi shunday ishlaydi.", 'Формула для чисел работает точно так же.', 'The formula works the same way for numbers.') },
  ],
  audio: [
    A('mount', "Formula harflar uchun emas, har qanday ifoda uchun ishlaydi. Sonlar ham ifoda.", 'Формула работает не для букв, а для любых выражений. Числа тоже выражения.', 'The formula works for any expressions, not just letters. Numbers are expressions too.'),
    A('mount', "O'ttiz birni o'ttiz qo'shuv bir deb yozamiz va formulani qo'llaymiz.", 'Запишем тридцать один как тридцать плюс один и применим формулу.', 'Let us write thirty one as thirty plus one and apply the formula.'),
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
      prompt: '(x + 6)²',
      ok: L("Ikki karra ko'paytma o'n ikki x.", 'Двойное произведение это двенадцать x.', 'The double product is twelve x.'),
      items: [
        { id: 'a', label: 'x² + 12x + 36', correct: true },
        { id: 'b', label: 'x² + 36', tag: 'Z1', hint: L("O'rta had tushib qoldi.", 'Средний член пропал.', 'The middle term is missing.') },
        { id: 'c', label: 'x² + 6x + 36', tag: 'Z2', hint: L("Ko'paytma ikki marta olinadi.", 'Произведение берётся дважды.', 'The product is taken twice.') },
        { id: 'd', label: 'x² + 12x + 12', tag: 'Z6', hint: L("Oxirida oltining kvadrati turadi.", 'В конце стоит квадрат шести.', 'At the end stands the square of six.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(2a − 1)²',
      ok: L("Koeffitsiyent kvadratga ko'tarildi, o'rta had manfiy.", 'Коэффициент возведён в квадрат, средний член отрицательный.', 'The coefficient is squared and the middle term is negative.'),
      items: [
        { id: 'a', label: '4a² − 4a + 1', correct: true },
        { id: 'b', label: '4a² − 4a − 1', tag: 'Z3', hint: L("Oxirgi katakda minus bir karra minus bir.", 'В последней клетке минус один на минус один.', 'The last cell is minus one times minus one.') },
        { id: 'c', label: '2a² − 4a + 1', tag: 'Z4', hint: L("Ikki a karra ikki a to'rt a kvadrat beradi.", 'Два a на два a это четыре a в квадрате.', 'Two a times two a is four a squared.') },
        { id: 'd', label: '4a² − 2a + 1', tag: 'Z2', hint: L("O'rta ko'paytma ikki marta olinadi.", 'Среднее произведение берётся дважды.', 'The middle product is taken twice.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "x² − 14x + 49 qaysi yozuvga teng?",
        'Какая запись равна x² − 14x + 49?',
        'Which record equals x² − 14x + 49?',
      ),
      ok: L("O'rta had manfiy, oxirgisi musbat: bu ayirmaning kvadrati.", 'Средний член отрицательный, последний положительный: это квадрат разности.', 'The middle term is negative and the last positive: this is a square of a difference.'),
      items: [
        { id: 'a', label: '(x − 7)²', correct: true },
        { id: 'b', label: '(x + 7)²', tag: 'Z3', hint: L("Unda o'rta had musbat bo'lardi.", 'Тогда средний член был бы положительным.', 'Then the middle term would be positive.') },
        { id: 'c', label: '(x − 7)(x + 7)', tag: 'Z5', hint: L("Bu ko'paytma o'rta hadni bermaydi: u ikki hadli javob beradi.", 'Это произведение не даёт среднего члена: у него ответ из двух членов.', 'That product gives no middle term: its answer has two terms.') },
        { id: 'd', label: '(x − 14)²', tag: 'Z6', hint: L("O'rta had ikki karra ko'paytma, ya'ni ikkinchi son yetti.", 'Средний член это двойное произведение, значит второе число семь.', 'The middle term is the double product, so the second number is seven.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(3y + 4)²',
      ok: L("Uch y kvadratga ko'tarildi, o'rta had yigirma to'rt y.", 'Три y возвели в квадрат, средний член двадцать четыре y.', 'Three y was squared, and the middle term is twenty four y.'),
      items: [
        { id: 'a', label: '9y² + 24y + 16', correct: true },
        { id: 'b', label: '9y² + 16', tag: 'Z1', hint: L("O'rta had tushib qoldi.", 'Средний член пропал.', 'The middle term is missing.') },
        { id: 'c', label: '9y² + 12y + 16', tag: 'Z2', hint: L("Ko'paytma ikki marta olinadi: ikki karra uch y karra to'rt.", 'Произведение берётся дважды: два на три y на четыре.', 'The product is taken twice: two times three y times four.') },
        { id: 'd', label: '3y² + 24y + 16', tag: 'Z4', hint: L("Uch y karra uch y to'qqiz y kvadrat beradi.", 'Три y на три y это девять y в квадрате.', 'Three y times three y is nine y squared.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida koeffitsiyent va minus birga.", 'Во втором коэффициент и минус вместе.', 'The second has a coefficient and a minus together.'),
    A('2', "Uchinchisi teskari yo'l.", 'Третий это обратный путь.', 'The third is the inverse path.'),
    A('3', "Oxirgisida koeffitsiyent uch.", 'В последнем коэффициент три.', 'In the last one the coefficient is three.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('To\'rt katak, uch had', 'Четыре клетки, три члена', 'Four cells, three terms'),
  gate: S1.gate,
  fix: {
    tokens: ['a²', '+', '2ab', '+', 'b²'],
    value: '25',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Yig'indi kvadratida to'rt katak bor, va ikkitasi bir xil ab beradi. a ikki, b uch bo'lganda yigirma besh chiqadi, qavsning o'zi kabi.",
    'В квадрате суммы четыре клетки, и две дают одинаковое ab. При a равном двум и b равном трём выходит двадцать пять, как и у самой скобки.',
    'The square of a sum has four cells, and two give the same ab. At a two and b three it gives twenty five, just like the bracket.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    three: L('uch hadli yozuv', 'запись из трёх членов', 'the three term record'),
    two: L('ikki hadli yozuv', 'запись из двух членов', 'the two term record'),
    both: L('ikkovi ham', 'оба', 'both of them'),
    neither: L('ochib bo\'lmaydi', 'раскрыть нельзя', 'cannot be expanded'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(a + b)² → 2ab', '(a − b)² → −2ab', '(2x + 3)² → 12x', '31² → 961'],
  twoLabel: L('B5 bloki boshlandi', 'Блок Б5 начат', 'Block B5 has begun'),
  twoA: L(
    "to'rt katak  →  uch had",
    'четыре клетки  →  три члена',
    'four cells  →  three terms',
  ),
  twoB: L(
    "ikki karra ko'paytma  →  yo'qolmaydi",
    'двойное произведение  →  не теряется',
    'the double product  →  is never lost',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'kvadratlar ayirmasi',
    'разность квадратов',
    'the difference of squares',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta narsadan chiqdi: kvadratda kataklar to'rtta, va o'rtadagi ikkitasi qo'shiladi.", 'Вся сегодняшняя работа вышла из одного: в квадрате четыре клетки, и два средних складываются.', 'All of today came from one thing: a square has four cells, and the two middle ones add.'),
    A('mount', "Keyingi darsda qavslarning ishorasi boshqa bo'ladi, va o'rta hadlar yo'qoladi.", 'На следующем уроке знаки скобок будут разными, и средние члены исчезнут.', 'Next lesson the brackets get different signs, and the middle terms vanish.'),
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
