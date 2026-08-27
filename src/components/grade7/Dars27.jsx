// ============================================================================
// 7-sinf, Dars 27. YIG'INDINING KUBI VA AYIRMANING KUBI.
// (Куб суммы и куб разности)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// UCHLIKLAR E'LON QILINMAYDI, SANOQDAN CHIQADI. To'rtburchak IKKINCHI
// marta ishlaydi: chapda qavs, YUQORIDA esa uning KVADRATI -- ya'ni
// 25-darsda topilgan uch had. Olti katak, va o'xshash hadlar qo'shilganda
// `3a²b` va `3ab²` O'ZI paydo bo'ladi.
//
// ETALONDAGI FARQ (§2, B5): u «kubning sakkiz bo'lagi ko'rinadi» deydi --
// sakkiz `(a+b)(a+b)(a+b)` dan chiqadi. To'rtburchak esa YASSI, shuning
// uchun bu yerda OLTI katak: kvadrat allaqachon uch hadga yig'ilgan va u
// ikki hadga ko'paytiriladi. Matematika bir xil, uchliklar sanoqdan
// chiqadi, lekin sakkiz bo'lakni o'quvchi ko'rmaydi. Hajmiy asbob sinfda
// yo'q va bitta dars uchun yozilmadi (metodist qarori 2026-08-21).
//
// BLOKNING XATOSI: kubda `3a²b` va `3ab²` tushib qoladi. Tuzoq shuni
// qo'yadi: besh katak to'g'ri hisoblangan, oltinchisi javobga kirmagan.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_27'
const LESSON_TITLE = L("Yig'indining kubi va ayirmaning kubi", 'Куб суммы и куб разности', 'The cube of a sum and the cube of a difference')
const LESSON_NO = L('27-dars', 'Урок 27', 'Lesson 27')
const BLOCK = { label: L('B5-blok', 'Блок Б5', 'Block B5'), from: 25, to: 32, current: 27 }

const TAGS = {
  Z1: L('uchlik ko\'paytuvchi yo\'qoldi', 'тройной множитель потерян', 'the factor of three was lost'),
  Z2: L("ko'paytma tushib qoldi", 'произведение пропущено', 'a product was skipped'),
  Z3: L('kubda ishoralar', 'знаки в кубе', 'the signs in a cube'),
  Z4: L("koeffitsiyent va ko'rsatkich", 'коэффициент и показатель', 'the coefficient and the exponent'),
  Z5: L('kub kvadrat bilan almashtirildi', 'куб спутан с квадратом', 'the cube was mixed up with the square'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. SONLAR BILAN: bir va ikkining kubi. Tabloda hisob natijasi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("YIG'INDINING KUBI", 'КУБ СУММЫ', 'THE CUBE OF A SUM'),
  noBack: true,
  noNotes: true,
  title: L('Nechta had bo\'ladi', 'Сколько будет членов', 'How many terms there will be'),
  gate: {
    source: { kind: 'plain', tokens: ['(1', '+', '2)³'] },
    rows: [
      { tokens: ['1', '+', '8'], value: '9' },
      { tokens: ['1', '+', '6', '+', '12', '+', '8'], value: '27' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
    "(1 + 2)³. Bittasi kublarni qo'shdi, ikkinchisi to'rt had hisobladi. Tabloda natija turadi. Aslida nechchi bo'ladi?",
    '(1 + 2)³. Один сложил кубы, другой посчитал четыре члена. На табло результат. Сколько на самом деле?',
    '(1 + 2)³. One student added the cubes, the other counted four terms. The boards show the results. What is it really?',
  ),
    items: [
      {
        id: 'four',
        label: L("To'rt had: kublar orasida yana ikkitasi bor", 'Четыре члена: между кубами есть ещё два', 'Four terms: two more sit between the cubes'),
        hint: L(
          "Taxminingiz qabul qilindi. To'rtburchakda tekshiramiz.",
          'Прогноз принят. Проверим на прямоугольнике.',
          'Your prediction is taken. We will check it on the rectangle.',
        ),
      },
      {
        id: 'two',
        label: L('Ikki had: har birining kubi', 'Два члена: куб каждого', 'Two terms: the cube of each'),
        hint: L(
          "Bir qo'shuv ikki uch bo'ladi, uchning kubi esa yigirma yetti, to'qqiz emas.",
          'Один плюс два это три, а три в кубе двадцать семь, а не девять.',
          'One plus two is three, and three cubed is twenty seven, not nine.',
        ),
      },
      {
        id: 'three',
        label: L("Uch had, kvadratdagi kabi", 'Три члена, как в квадрате суммы', 'Three terms, as in the square of a sum'),
        hint: L(
          "Kvadratda uchta, lekin bu yerda qavs yana bir marta ko'paytiriladi.",
          'В квадрате три, но здесь скобка умножается ещё раз.',
          'In a square there are three, but here the bracket is multiplied once more.',
        ),
      },
      {
        id: 'one',
        label: L('Kubni ochib bo\'lmaydi', 'Куб раскрыть нельзя', 'A cube cannot be expanded'),
        hint: L(
          "Kub bu qavs uch marta, qavslarning ko'paytmasini esa allaqachon hisoblaganmiz.",
          'Куб это скобка трижды, а произведение скобок мы уже считали.',
          'A cube is that bracket three times, and we have multiplied brackets already.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bir qo'shuv ikkining kubini ikki o'quvchi hisobladi.", 'Куб суммы один плюс два посчитали два ученика.', 'Two students worked out the cube of one plus two.'),
    A('mount', "Bittasi kublarni qo'shdi, ikkinchisi to'rtta had hisobladi.", 'Один сложил кубы, другой посчитал четыре члена.', 'One added the cubes, the other counted four terms.'),
    A('mount', "Aslida nechchi bo'ladi deb taxmin qilasiz.", 'Сколько будет на самом деле, по-твоему.', 'What do you predict it really is.'),
  ],
}

// ============================================================
// 2. TAYANCH. 25-darsning formulasi va darajalarni ko'paytirish.
// KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
  cols: 2,
  items: [
    {
      wrap: false,
      prompt: '(a + b)²',
      ok: L("Bugun bu uch had yuqori qatorga chiqadi.", 'Сегодня эти три члена встанут в верхний ряд.', 'Today these three terms will go into the top row.'),
      items: [
        { id: 'a', label: 'a² + 2ab + b²', correct: true },
        { id: 'b', label: 'a² + b²', tag: 'Z1', hint: L("O'rta had ikki karra ko'paytma bo'lardi.", 'Средний член это двойное произведение.', 'The middle term is the double product.') },
        { id: 'c', label: 'a² + ab + b²', tag: 'Z2', hint: L("ab katagi ikkita.", 'Клеток с ab две.', 'There are two ab cells.') },
        { id: 'd', label: 'a² − 2ab + b²', tag: 'Z3', hint: L("Qavsda qo'shuv turgan edi.", 'В скобке было сложение.', 'The bracket had a plus.') },
      ],
    },
    {
      wrap: false,
      prompt: 'a² · a',
      ok: L("Ko'paytuvchilar uchta: ikkitasi kvadratdan, bittasi alohida.", 'Множителей три: два из квадрата и один отдельно.', 'Three factors: two from the square and one on its own.'),
      items: [
        { id: 'a', label: 'a³', correct: true },
        { id: 'b', label: 'a⁴', tag: 'Z4', hint: L("Ikki va bir uch beradi.", 'Два и один дают три.', 'Two and one give three.') },
        { id: 'c', label: '2a²', tag: 'Z4', hint: L("Bu ko'paytirish, qo'shish emas.", 'Это умножение, а не сложение.', 'This is multiplication, not addition.') },
        { id: 'd', label: 'a²', tag: 'Z4', hint: L("Yana bitta ko'paytuvchi qo'shildi.", 'Добавился ещё один множитель.', 'One more factor was added.') },
      ],
    },
    {
      wrap: false,
      prompt: '2ab · a',
      ok: L("Koeffitsiyent o'zgarmadi, a ning ko'rsatkichi esa oshdi.", 'Коэффициент не изменился, а показатель a вырос.', 'The coefficient stayed, the exponent of a grew.'),
      items: [
        { id: 'a', label: '2a²b', correct: true },
        { id: 'b', label: '2ab', tag: 'Z4', hint: L("Yana bitta a qo'shildi.", 'Добавилась ещё одна a.', 'One more a was added.') },
        { id: 'c', label: '2a²b²', tag: 'Z4', hint: L("b faqat bitta ko'paytuvchida bor.", 'b есть только в одном множителе.', 'b is in one factor only.') },
        { id: 'd', label: '3a²b', tag: 'Z6', hint: L("Koeffitsiyent a ga ko'paytirilganda o'zgarmaydi.", 'Коэффициент не меняется от умножения на a.', 'The coefficient does not change when multiplied by a.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Birinchisi bugun yuqori qatorga chiqadi.", 'Три коротких вопроса. Первый сегодня встанет в верхний ряд.', 'Three short questions. The first will go into the top row today.'),
    A('1', "Ikkinchisi ko'rsatkichlar haqida.", 'Второй про показатели.', 'The second is about exponents.'),
    A('2', "Uchinchisida koeffitsiyent bor.", 'В третьем есть коэффициент.', 'The third has a coefficient.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. TO'RTBURCHAK IKKINCHI QAVATDA: yuqorida
// KVADRAT turadi. Olti katak, uchliklar SANOQDAN chiqadi.
// ============================================================
const S3 = {
  kind: 'grid',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Yuqorida kvadrat turadi', 'Сверху стоит квадрат', 'The square goes on top'),
  caption: L(
    "Chapda qavs, yuqorida esa uning kvadrati. Olti katakni bosing.",
    'Слева скобка, сверху её квадрат. Нажми на шесть клеток.',
    'The bracket on the left, its square on top. Tap the six cells.',
  ),
  left: ['a', '+b'],
  top: ['a²', '+2ab', '+b²'],
  cols: 1,
  options: [
    { id: 'a', label: 'a³ + 3a²b + 3ab² + b³' },
    { id: 'b', label: 'a³ + b³' },
    { id: 'c', label: 'a³ + 2a²b + 2ab² + b³' },
    { id: 'd', label: 'a³ + 3a²b + 3ab²' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("O'rtadagi to'rt katak bo'sh qoldi, ular yo'qolmaydi.", 'Четыре средние клетки остались пустыми, они не исчезают.', 'The four middle cells stayed empty, they do not vanish.') },
    { key: 'c', tag: 'Z1', hint: L("a kvadrat b katagi ikkita emas, uchta: ikkisi bitta katakdan, biri boshqasidan.", 'Клеток с a в квадрате b не две, а три: две из одной клетки и одна из другой.', 'There are three a squared b, not two: two from one cell and one from another.') },
    { key: 'd', tag: 'Z2', hint: L("Oxirgi katakda b karra b kvadrat, ya'ni b kub turibdi.", 'В последней клетке b на b в квадрате, то есть b в кубе.', 'The last cell is b times b squared, that is b cubed.') },
  ],
  note: L(
    "Kataklar oltita, javobda esa to'rt had: o'xshashlar qo'shildi va UCHLIKLARNI berdi. Uchlik e'lon qilinmadi, u sanoqdan chiqdi.",
    'Клеток шесть, а в ответе четыре члена: подобные сложились и дали ТРОЙКИ. Тройка не объявлена, она вышла из счёта.',
    'Six cells, four terms in the answer: the like terms added and produced the THREES. The three was not declared, it came out of counting.',
  ),
  audio: [
    A('mount', "Kub bu qavs uch marta. Ikkitasini biz allaqachon ko'paytirgan edik, natijasi uch had.", 'Куб это скобка трижды. Две из них мы уже перемножили, вышло три члена.', 'A cube is that bracket three times. Two of them we already multiplied, giving three terms.'),
    A('mount', "Shu uch had yuqori qatorga chiqadi, chapda esa qavsning o'zi qoladi.", 'Эти три члена встают в верхний ряд, а слева остаётся сама скобка.', 'Those three terms go into the top row, and the bracket itself stays on the left.'),
    A('cell-all', "Olti katak ochildi. Endi o'xshash hadlarni qo'shing.", 'Шесть клеток открыты. Теперь сложи подобные члены.', 'All six cells are open. Now add the like terms.'),
  ],
}

// ============================================================
// 4. FARQLASH. AYIRMANING KUBI: ishoralar NAVBATLASHADI.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Ayirmaning kubi', 'Куб разности', 'The cube of a difference'),
  caption: L(
    "Endi qavsda ayirish, va yuqorida ayirmaning kvadrati turadi.",
    'Теперь в скобке вычитание, и сверху стоит квадрат разности.',
    'Now the bracket has a minus, and the square of the difference goes on top.',
  ),
  left: ['a', '−b'],
  top: ['a²', '−2ab', '+b²'],
  cols: 1,
  options: [
    { id: 'a', label: 'a³ − 3a²b + 3ab² − b³' },
    { id: 'b', label: 'a³ − 3a²b − 3ab² − b³' },
    { id: 'c', label: 'a³ − b³' },
    { id: 'd', label: 'a³ + 3a²b + 3ab² + b³' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Uchinchi hadda ikki minus uchrashadi: minus b karra minus ikki ab.", 'В третьем члене встречаются два минуса: минус b на минус два ab.', 'In the third term two minuses meet: minus b times minus two ab.') },
    { key: 'c', tag: 'Z1', hint: L("O'rtadagi to'rt katak bo'sh emas.", 'Четыре средние клетки не пусты.', 'The four middle cells are not empty.') },
    { key: 'd', tag: 'Z3', hint: L("Chapda manfiy had turibdi, u uch katakning ishorasini o'zgartiradi.", 'Слева отрицательный член, он меняет знак трёх клеток.', 'The left has a negative term, and it flips the sign of three cells.') },
  ],
  note: L(
    "Ishoralar NAVBATLASHADI: minus, qo'shuv, minus. Sabab sodda: manfiy had toq marta ko'paytirilgan hadlarni manfiy qiladi.",
    'Знаки ЧЕРЕДУЮТСЯ: минус, плюс, минус. Причина проста: отрицательный член делает отрицательными те члены, где он взят нечётное число раз.',
    'The signs ALTERNATE: minus, plus, minus. The reason is simple: the negative term makes negative those terms where it is taken an odd number of times.',
  ),
  audio: [
    A('mount', "O'sha to'rtburchak, lekin qavsda ayirish.", 'Тот же прямоугольник, но в скобке вычитание.', 'The same rectangle, but the bracket has a minus.'),
    A('mount', "Yuqorida ham ayirmaning kvadrati turadi, unda o'rta had manfiy.", 'Сверху тоже квадрат разности, там средний член отрицательный.', 'On top is the square of the difference, whose middle term is negative.'),
    A('cell-all', "Olti katak ochildi. Ishoralarni ketma-ket ko'ring.", 'Шесть клеток открыты. Посмотри на знаки по порядку.', 'All six cells are open. Look at the signs in order.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Formulani o'quvchi yig'adi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Ikki o\'rta had', 'Два средних члена', 'The two middle terms'),
  template: ['(a + b)³  =  a³ + ', { slot: 0 }, ' + ', { slot: 1 }, ' + b³'],
  parts: [
    { id: 'a', label: '3a²b' },
    { id: 'b', label: '3ab²' },
    { id: 'c', label: 'a²b' },
    { id: 'd', label: '2ab²' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "O'rtadagi ikki hadni yozing.",
    'Запиши два средних члена.',
    'Write the two middle terms.',
  ),
  checkNote: L(
    "a kvadrat b uch katakdan chiqadi, ab kvadrat ham uchtadan. Shuning uchun ikkovining oldida uchlik turadi.",
    'a в квадрате b выходит из трёх клеток, ab в квадрате тоже из трёх. Поэтому у обоих стоит тройка.',
    'a squared b comes from three cells, and ab squared from three as well. That is why both carry a three.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("Bunday katak uchta, bittasi emas.", 'Таких клеток три, а не одна.', 'There are three such cells, not one.') },
    { key: 'd', tag: 'Z6', hint: L("ab kvadrat katagi ham uchta.", 'Клеток с ab в квадрате тоже три.', 'There are three ab squared cells too.') },
    { key: '*', tag: 'Z1', hint: L("O'xshash kataklarni sanang.", 'Посчитай подобные клетки.', 'Count the like cells.') },
  ],
  audio: [
    A('mount', "To'rtburchak oltita katakni berdi. Endi formulani yozib qo'yamiz.", 'Прямоугольник дал шесть клеток. Теперь запишем формулу.', 'The rectangle gave six cells. Now let us write the formula down.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. Sonlar bilan: `(x + 2)³`.
// ============================================================
const S6 = {
  kind: 'grid',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Son bilan', 'С числом', 'With a number'),
  caption: L(
    "Yuqorida qavsning kvadrati: x kvadrat qo'shuv to'rt x qo'shuv to'rt. Olti katakni bosing.",
    'Сверху квадрат скобки: x в квадрате плюс четыре x плюс четыре. Нажми на шесть клеток.',
    'On top the square of the bracket: x squared plus four x plus four. Tap the six cells.',
  ),
  left: ['x', '+2'],
  top: ['x²', '+4x', '+4'],
  cols: 1,
  options: [
    { id: 'a', label: 'x³ + 6x² + 12x + 8' },
    { id: 'b', label: 'x³ + 8' },
    { id: 'c', label: 'x³ + 2x² + 4x + 8' },
    { id: 'd', label: 'x³ + 6x² + 12x' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("O'rtadagi to'rt katak bo'sh qoldi.", 'Четыре средние клетки остались пустыми.', 'The four middle cells stayed empty.') },
    { key: 'c', tag: 'Z1', hint: L("x kvadratli kataklar ikkita: x karra to'rt x va ikki karra x kvadrat. Ular olti x kvadrat beradi.", 'Клеток с x в квадрате две: x на четыре x и двойка на x в квадрате. Вместе шесть x в квадрате.', 'There are two x squared cells: x times four x and two times x squared. Together six x squared.') },
    { key: 'd', tag: 'Z2', hint: L("Oxirgi katakda ikki karra to'rt, ya'ni sakkiz.", 'В последней клетке два на четыре, то есть восемь.', 'The last cell is two times four, that is eight.') },
  ],
  note: L(
    "Sonlar bilan ham xuddi shunday: olti katak, to'rt had, va o'rtadagilarning koeffitsiyenti olti va o'n ikki.",
    'С числами точно так же: шесть клеток, четыре члена, а у средних коэффициенты шесть и двенадцать.',
    'With numbers it is the same: six cells, four terms, and the middle coefficients are six and twelve.',
  ),
  audio: [
    A('mount', "Endi harflar emas, sonlar. Qavsning kvadrati yuqorida yozilgan.", 'Теперь не буквы, а числа. Квадрат скобки написан сверху.', 'Now numbers instead of letters. The square of the bracket is written on top.'),
    A('mount', "Olti katakni bosing va o'xshashlarni qo'shing.", 'Нажми на шесть клеток и сложи подобные.', 'Tap the six cells and add the like terms.'),
    A('cell-all', "Olti katak ochildi. x kvadratli kataklar ikkita.", 'Шесть клеток открыты. Клеток с x в квадрате две.', 'All six cells are open. Two of them have x squared.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH: `x³ + 1` nega
// yaramaydi.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Kublar orasida nima bor', 'Что стоит между кубами', 'What sits between the cubes'),
  letter: 'x',
  numbers: [1, 2, 3],
  rows: [
    { id: 'r1', role: 'source', expr: '(x + 1)³', sub: (n) => '(' + n + ' + 1)³', val: (n) => (n + 1) * (n + 1) * (n + 1) },
    { id: 'r2', expr: 'x³ + 3x² + 3x + 1', sub: (n) => n + '³ + 3 · ' + n + '² + 3 · ' + n + ' + 1', val: (n) => n * n * n + 3 * n * n + 3 * n + 1 },
  ],
  probe: {
    question: L(
      "Uch sonda ham qatorlar mos keldi. Nega `x³ + 1` yaramaydi?",
      'При всех трёх числах строки совпали. Почему x³ + 1 не подходит?',
      'The rows matched at all three numbers. Why does x³ + 1 not work?',
    ),
    items: [
      {
        id: 'mid',
        correct: true,
        label: L('Kublar orasida yana ikki had bor', 'Между кубами есть ещё два члена', 'Two more terms sit between the cubes'),
      },
      {
        id: 'calc',
        tag: 'Z6',
        label: L('Chunki hisobda xato bor', 'Потому что там ошибка в счёте', 'Because there is a slip in the arithmetic'),
        hint: L(
          "Birda qavs sakkiz beradi, x kub qo'shuv bir esa ikki. Bu xato emas, bu boshqa yozuv.",
          'При единице скобка даёт восемь, а x в кубе плюс один даёт два. Это не ошибка, это другая запись.',
          'At one the bracket gives eight, while x cubed plus one gives two. That is not a slip, it is a different record.',
        ),
      },
      {
        id: 'big',
        tag: 'Z1',
        label: L("Katta sonlarda yaraydi", 'При больших числах подходит', 'It works for large numbers'),
        hint: L(
          "Uchda qavs oltmish to'rt beradi, x kub qo'shuv bir esa yigirma sakkiz.",
          'При трёх скобка даёт шестьдесят четыре, а x в кубе плюс один двадцать восемь.',
          'At three the bracket gives sixty four, while x cubed plus one gives twenty eight.',
        ),
      },
      {
        id: 'sq',
        tag: 'Z5',
        label: L('Bunday faqat kvadratda bo\'ladi', 'Так бывает только в квадрате', 'That only happens in a square'),
        hint: L(
          "Kvadratda ham o'rta had bor: u yerda bitta, bu yerda ikkita.",
          'В квадрате тоже есть средний член: там один, здесь два.',
          'A square has a middle term too: one there, two here.',
        ),
      },
    ],
  },
  okText: L(
    "Yig'indining kubi TO'RT haddan iborat. Kublar chetda turadi, orasida esa ikki uchlik.",
    'Куб суммы состоит из ЧЕТЫРЁХ членов. Кубы стоят по краям, а между ними две тройки.',
    'The cube of a sum has FOUR terms. The cubes stand at the edges, with two threes between them.',
  ),
  audio: [
    A('mount', "Yuqorida qavs kubda, pastda formula bo'yicha ochilgan yozuv.", 'Сверху скобка в кубе, снизу раскрытая по формуле запись.', 'Above the bracket cubed, below the record expanded by the formula.'),
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
    { id: 'f1', label: L('birinchi hadning kubi', 'куб первого члена', 'the cube of the first term') },
    { id: 'f2', label: L("qo'shuv uch karra birinchining kvadrati karra ikkinchisi", 'плюс три раза квадрат первого на второй', 'plus three times the square of the first by the second') },
    { id: 'f3', label: L("qo'shuv uch karra birinchisi karra ikkinchining kvadrati", 'плюс три раза первый на квадрат второго', 'plus three times the first by the square of the second') },
    { id: 'f4', label: L("qo'shuv ikkinchi hadning kubi", 'плюс куб второго члена', 'plus the cube of the second term') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Birinchining kubi, keyin ikki o'rta had, oxirida ikkinchisining kubi.",
    'Порядок нарушен. Куб первого, потом два средних члена, в конце куб второго.',
    'The order is off. The cube of the first, then the two middle terms, then the cube of the second.',
  ),
  lawChips: [
    { label: '( )³', tone: 'par' },
    { label: '·', tone: 's2' },
    { label: '3', tone: 'off' },
    { label: '−', tone: 's1' },
  ],
  lawSweep: L(
    "kub, ko'paytma, uchlik, ishora",
    'куб, произведение, тройка, знак',
    'the cube, the product, the three, the sign',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ikki ifoda yig'indisining kubi birinchisining kubiga, birinchisining kvadrati karra ikkinchisining uch karrasiga, birinchisi karra ikkinchisining kvadratining uch karrasiga va ikkinchisining kubiga teng.",
        'Куб суммы двух выражений равен кубу первого, плюс три раза квадрат первого на второй, плюс три раза первый на квадрат второго, плюс куб второго.',
        'The cube of a sum equals the cube of the first, plus three times the square of the first by the second, plus three times the first by the square of the second, plus the cube of the second.',
      ),
      L(
        "Ayirmaning kubida ishoralar navbatlashadi: minus, qo'shuv, minus. Uchliklar esa o'xshash kataklarning SONIDAN chiqadi, ular har biri uchta.",
        'В кубе разности знаки чередуются: минус, плюс, минус. А тройки берутся из ЧИСЛА подобных клеток: их по три.',
        'In the cube of a difference the signs alternate: minus, plus, minus. And the threes come from the NUMBER of like cells: three of each.',
      ),
    ],
  },
  hookCap: L(
    "Olti katak, to'rt had",
    'Шесть клеток, четыре члена',
    'Six cells, four terms',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('birinchisining kubi', 'куб первого', 'the cube of the first'),
    L('ikki uchlik', 'две тройки', 'two threes'),
    L('ikkinchisining kubi', 'куб второго', 'the cube of the second'),
  ],
  audio: [
    A('mount', "Ikki formulani ko'rdik. Endi qoidani yig'amiz.", 'Обе формулы мы увидели. Теперь соберём правило.', 'We have seen both formulas. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda formulani TANLASH kerak bo'ladi.", 'Верно. На следующем уроке формулу надо будет ВЫБИРАТЬ.', 'Correct. Next lesson the formula will have to be CHOSEN.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni toping', 'Найди ответ', 'Find the answer'),
  question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
  cols: 1,
  items: [
    {
      wrap: false,
      prompt: '(x + 1)³',
      ok: L("Uchliklar joyida, kublar chetda.", 'Тройки на месте, кубы по краям.', 'The threes are in place, the cubes at the edges.'),
      items: [
        { id: 'a', label: 'x³ + 3x² + 3x + 1', correct: true },
        { id: 'b', label: 'x³ + 1', tag: 'Z1', hint: L("Kublar orasida yana ikki had bor.", 'Между кубами есть ещё два члена.', 'Two more terms sit between the cubes.') },
        { id: 'c', label: 'x³ + 3x² + 3x', tag: 'Z2', hint: L("Oxirgi had birning kubi, ya'ni bir.", 'Последний член это куб единицы, то есть один.', 'The last term is the cube of one, that is one.') },
        { id: 'd', label: 'x³ + 2x² + 2x + 1', tag: 'Z1', hint: L("O'xshash kataklar uchta, ikkita emas.", 'Подобных клеток три, а не две.', 'There are three like cells, not two.') },
      ],
    },
    {
      wrap: false,
      prompt: '(a − 1)³',
      ok: L("Ishoralar navbatlashdi: minus, qo'shuv, minus.", 'Знаки чередовались: минус, плюс, минус.', 'The signs alternated: minus, plus, minus.'),
      items: [
        { id: 'a', label: 'a³ − 3a² + 3a − 1', correct: true },
        { id: 'b', label: 'a³ − 1', tag: 'Z1', hint: L("O'rta hadlar yo'qolmaydi.", 'Средние члены не исчезают.', 'The middle terms do not vanish.') },
        { id: 'c', label: 'a³ − 3a² − 3a − 1', tag: 'Z3', hint: L("Uchinchi hadda ikki minus uchrashadi va musbat beradi.", 'В третьем члене встречаются два минуса и дают плюс.', 'In the third term two minuses meet and give a plus.') },
        { id: 'd', label: 'a³ + 3a² + 3a + 1', tag: 'Z3', hint: L("Qavsda ayirish turgan edi.", 'В скобке было вычитание.', 'The bracket had a subtraction.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "O'xshash hadlar qo'shilgandan keyin yig'indi kubida nechta had qoladi?",
        'Сколько членов остаётся в кубе суммы после приведения подобных?',
        'How many terms remain in the cube of a sum after collecting like terms?',
      ),
      ok: L("Olti katak, lekin o'xshashlari qo'shilib to'rt had beradi.", 'Шесть клеток, но подобные складываются в четыре члена.', 'Six cells, but the like ones add into four terms.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '6', tag: 'Z2', hint: L("Kataklar oltita, lekin ikki juft o'xshash qo'shiladi.", 'Клеток шесть, но две пары подобных складываются.', 'There are six cells, but two pairs of like terms add.') },
        { id: 'c', label: '2', tag: 'Z1', hint: L("O'rtadagi hadlar ham qoladi.", 'Средние члены тоже остаются.', 'The middle terms stay too.') },
        { id: 'd', label: '3', tag: 'Z5', hint: L("Uchta had kvadratda bo'ladi, kubda esa to'rtta.", 'Три члена бывает в квадрате, а в кубе четыре.', 'Three terms happen in a square, a cube has four.') },
      ],
    },
    {
      wrap: false,
      prompt: '(2x + 1)³',
      ok: L("Koeffitsiyent har hadda kvadratga va kubga ko'tarildi.", 'Коэффициент в каждом члене возведён в квадрат и в куб.', 'The coefficient got squared and cubed in each term.'),
      items: [
        { id: 'a', label: '8x³ + 12x² + 6x + 1', correct: true },
        { id: 'b', label: '8x³ + 1', tag: 'Z1', hint: L("O'rta hadlar yo'qolmaydi.", 'Средние члены не исчезают.', 'The middle terms do not vanish.') },
        { id: 'c', label: '2x³ + 12x² + 6x + 1', tag: 'Z4', hint: L("Ikki x ni kubga ko'tarsak sakkiz x kub chiqadi.", 'Два x в кубе это восемь x в кубе.', 'Two x cubed is eight x cubed.') },
        { id: 'd', label: '8x³ + 6x² + 12x + 1', tag: 'Z6', hint: L("Ikkinchi had uch karra to'rt x kvadrat, ya'ni o'n ikki x kvadrat.", 'Второй член это три на четыре x в квадрате, то есть двенадцать x в квадрате.', 'The second term is three times four x squared, that is twelve x squared.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Uchinchisida hadlar sanaladi.", 'Четыре вопроса. В третьем считаются члены.', 'Four questions. The third counts terms.'),
    A('1', "Ikkinchisida ishoralar navbatlashadi.", 'Во втором знаки чередуются.', 'In the second the signs alternate.'),
    A('2', "Uchinchisiga o'ylab javob bering.", 'На третий ответь подумав.', 'Think before answering the third.'),
    A('3', "Oxirgisida koeffitsiyent bor.", 'В последнем есть коэффициент.', 'The last one has a coefficient.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Katta son', 'Большое число', 'A big number'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['(x + 3)³  =  x³ + ', { slot: 0 }, ' + ', { slot: 1 }, ' + 27'],
  parts: [
    { id: 'a', label: '9x²' },
    { id: 'b', label: '27x' },
    { id: 'c', label: '3x²' },
    { id: 'd', label: '9x' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "O'rtadagi ikki hadni yozing. Oxirgisi turibdi.",
    'Запиши два средних члена. Последний уже стоит.',
    'Write the two middle terms. The last one is there.',
  ),
  checkNote: L(
    "3 · x² · 3 = 9x², 3 · x · 9 = 27x.",
    '3 · x² · 3 = 9x², 3 · x · 9 = 27x.',
    '3 · x² · 3 = 9x², 3 · x · 9 = 27x.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("Uchlik ko'paytuvchi majburiy: o'xshash kataklar uchta.", 'Тройной множитель обязателен: подобных клеток три.', 'The factor of three is required: there are three like cells.') },
    { key: 'd', tag: 'Z6', hint: L("Uch karra x karra to'qqiz yigirma yetti x beradi.", 'Три на x на девять это двадцать семь x.', 'Three by x by nine is twenty seven x.') },
    { key: '*', tag: 'Z1', hint: L("Har o'rta hadda uchlik turadi.", 'В каждом среднем члене стоит тройка.', 'Each middle term carries a three.') },
  ],
  probe: {
    question: L('Oxirgi had nechchiga teng?', 'Чему равен последний член?', 'What does the last term equal?'),
    items: [
      { id: 'a', correct: true, label: '27' },
      { id: 'b', tag: 'Z6', label: '9', hint: L("Bu uchning kvadrati, kerak bo'lgani esa kubi.", 'Это квадрат трёх, а нужен куб.', 'That is three squared, but the cube is needed.') },
      { id: 'c', tag: 'Z6', label: '3', hint: L("Oxirgi had ikkinchi hadning kubi.", 'Последний член это куб второго члена.', 'The last term is the cube of the second term.') },
      { id: 'd', tag: 'Z6', label: '81', hint: L("Uchning kubi yigirma yetti.", 'Куб трёх это двадцать семь.', 'Three cubed is twenty seven.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval o'rta hadlar, keyin oxirgisi.", 'Два шага. Сначала средние члены, потом последний.', 'Two steps. The middle terms first, then the last.'),
    A('mount', "Ikkinchi had uchlik, va uning kvadrati ham, kubi ham kerak bo'ladi.", 'Второй член это тройка, и понадобится и её квадрат, и куб.', 'The second term is three, and both its square and cube will be needed.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. ISHORALAR: o'quvchi ikkita ishorani qo'yadi.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Ishoralarni qo\'ying', 'Расставь знаки', 'Set the signs'),
  template: ['(a − 3)³  =  a³ − 9a² ', { slot: 0 }, ' 27a ', { slot: 1 }],
  parts: [
    { id: 'a', label: '+' },
    { id: 'b', label: '− 27' },
    { id: 'c', label: '−' },
    { id: 'd', label: '+ 27' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ayirmaning kubida ishoralar navbatlashadi. Qolgan ikkitasini qo'ying.",
    'В кубе разности знаки чередуются. Поставь два оставшихся.',
    'In the cube of a difference the signs alternate. Set the two that are left.',
  ),
  checkNote: L(
    "Ishoralar tartibi: minus, qo'shuv, minus. Oxirgi had manfiy uchning kubi, ya'ni manfiy yigirma yetti.",
    'Порядок знаков: минус, плюс, минус. Последний член это куб минус трёх, то есть минус двадцать семь.',
    'The order of signs: minus, plus, minus. The last term is minus three cubed, that is minus twenty seven.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("Ishoralar navbatlashadi: minusdan keyin qo'shuv keladi.", 'Знаки чередуются: после минуса идёт плюс.', 'The signs alternate: a plus follows a minus.') },
    { key: 'd', tag: 'Z3', hint: L("Manfiy sonning kubi manfiy bo'ladi.", 'Куб отрицательного числа отрицателен.', 'The cube of a negative number is negative.') },
    { key: '*', tag: 'Z3', hint: L("Manfiy had toq marta ko'paytirilgan joyda ishora manfiy.", 'Там, где отрицательный член взят нечётное число раз, знак минус.', 'Where the negative term is taken an odd number of times, the sign is minus.') },
  ],
  audio: [
    A('mount', "Hadlar yozilgan, ishoralar esa yo'q. Ularni o'zingiz qo'yasiz.", 'Члены записаны, а знаков нет. Их ставишь сам.', 'The terms are written, the signs are not. You set them yourself.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Besh katak to'g'ri hisoblangan, `3ab²` javobga
// KIRMAGAN -- blokning atalgan xatosi.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Hisoblangan kataklarning hammasi to'g'ri. Shunday bo'lsa ham, qaysi qator xato?",
    'Все посчитанные клетки верны. И всё же какая строка ошибочна?',
    'Every cell that was worked out is right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '(a + b)³' },
    { id: 'r2', text: 'a · a² = a³' },
    { id: 'r3', text: 'a · 2ab = 2a²b' },
    { id: 'r4', text: L("boshqa ko'paytma yo'q", 'других произведений нет', 'there are no other products') },
    { id: 'r5', text: L('a³ + 3a²b + b³', 'a³ + 3a²b + b³', 'a³ + 3a²b + b³') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: a karra a kvadrat a kub beradi.", 'Верно: a на a в квадрате это a в кубе.', 'Right: a times a squared is a cubed.'),
    r3: L("To'g'ri: a karra ikki ab ikki a kvadrat b beradi.", 'Верно: a на два ab это два a в квадрате b.', 'Right: a times two ab is two a squared b.'),
    r5: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r3: 'Z1', r5: 'Z1' },
  proofFill: {
    template: ['a · b² + b · 2ab  =  ', { slot: 0 }, '   →   a³ + 3a²b + ', { slot: 1 }],
    parts: [
      { id: 'a', label: '3ab²' },
      { id: 'b', label: '3ab² + b³' },
      { id: 'c', label: 'ab²' },
      { id: 'd', label: 'b³' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Qolgan kataklarni hisoblang va javobni to'ldiring.",
      'Посчитай оставшиеся клетки и дострой ответ.',
      'Work out the remaining cells and complete the answer.',
    ),
    checkNote: L(
      "a karra b kvadrat va b karra ikki ab birga uch ab kvadrat beradi. Javobda ular yo'q edi.",
      'a на b в квадрате и b на два ab вместе дают три ab в квадрате. В ответе их не было.',
      'a by b squared and b by two ab together give three ab squared. The answer had neither.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z1', hint: L("Bunday katak uchta: bittasi va yana ikkitasi.", 'Таких клеток три: одна и ещё две.', 'There are three such cells: one and two more.') },
      { key: 'd', tag: 'Z2', hint: L("b kubdan tashqari ab kvadratli hadlar ham tushib qolgan.", 'Кроме куба b пропущены и члены с ab в квадрате.', 'Besides b cubed, the ab squared terms are missing too.') },
      { key: '*', tag: 'Z1', hint: L("Kataklar oltita, javobda esa to'rt had bo'ladi.", 'Клеток шесть, а в ответе четыре члена.', 'There are six cells, and four terms in the answer.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda hisoblangan kataklar to'g'ri.", 'В этой ловушке посчитанные клетки верны.', 'In this trap the cells worked out are right.'),
    A('mount', "Shunday bo'lsa ham javob to'liq emas. Xato birinchi qaysi qatorda.", 'И всё же ответ неполон. В какой строке ошибка впервые.', 'And yet the answer is incomplete. Which line has the mistake first.'),
    A('proof', "Topdingiz. Uchta katak umuman hisoblanmagan.", 'Нашёл. Три клетки вообще не посчитаны.', 'You found it. Three cells were never worked out.'),
    A('done', "Kataklar oltita, va har o'xshash guruh uchtadan.", 'Клеток шесть, и каждая группа подобных по три.', 'There are six cells, and each like group has three.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TEZ HISOB: o'n birning kubi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('O\'n birning kubi', 'Куб одиннадцати', 'Eleven cubed'),
  given: L(
    "11³ ni hisoblaymiz: 11 = 10 + 1.",
    'Возведём 11³: 11 = 10 + 1.',
    'Let us cube 11³: 11 = 10 + 1.',
  ),
  template: ['11³  =  (10 + 1)³  =  1000 + ', { slot: 0 }, ' + ', { slot: 1 }, ' + 1'],
  parts: [
    { id: 'a', label: '300' },
    { id: 'b', label: '30' },
    { id: 'c', label: '100' },
    { id: 'd', label: '3' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki o'rta hadni hisoblang.",
    'Посчитай два средних члена.',
    'Work out the two middle terms.',
  ),
  checkNote: L(
    "3 · 100 · 1 = 300, 3 · 10 · 1 = 30. Hammasi 1331.",
    '3 · 100 · 1 = 300, 3 · 10 · 1 = 30. Всего 1331.',
    '3 · 100 · 1 = 300, 3 · 10 · 1 = 30. In all 1331.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("Uchlik ko'paytuvchi majburiy: uch karra yuz.", 'Тройной множитель обязателен: три на сто.', 'The factor of three is required: three times one hundred.') },
    { key: 'd', tag: 'Z6', hint: L("Uch karra o'n karra bir o'ttiz beradi.", 'Три на десять на один это тридцать.', 'Three by ten by one is thirty.') },
    { key: '*', tag: 'Z1', hint: L("Formula sonlar uchun ham xuddi shunday ishlaydi.", 'Формула для чисел работает точно так же.', 'The formula works the same for numbers.') },
  ],
  audio: [
    A('mount', "Formula sonlar uchun ham ishlaydi. O'n bir bu o'n qo'shuv bir.", 'Формула работает и для чисел. Одиннадцать это десять плюс один.', 'The formula works for numbers too. Eleven is ten plus one.'),
    A('mount', "O'n ning kubi ming, birning kubi bir. O'rtadagilar qoldi.", 'Куб десяти это тысяча, куб единицы один. Остались средние.', 'Ten cubed is a thousand, one cubed is one. The middle ones are left.'),
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
      question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
      prompt: '(x + 2)³',
      ok: L("Uchliklar olti va o'n ikki koeffitsiyentni berdi.", 'Тройки дали коэффициенты шесть и двенадцать.', 'The threes gave the coefficients six and twelve.'),
      items: [
        { id: 'a', label: 'x³ + 6x² + 12x + 8', correct: true },
        { id: 'b', label: 'x³ + 8', tag: 'Z1', hint: L("O'rta hadlar yo'qolmaydi.", 'Средние члены не исчезают.', 'The middle terms do not vanish.') },
        { id: 'c', label: 'x³ + 2x² + 4x + 8', tag: 'Z1', hint: L("O'xshash kataklar uchta, shuning uchun uchlik ko'paytuvchi turadi.", 'Подобных клеток три, поэтому стоит тройной множитель.', 'There are three like cells, so a factor of three appears.') },
        { id: 'd', label: 'x³ + 6x² + 12x', tag: 'Z2', hint: L("Oxirgi had ikkining kubi, ya'ni sakkiz.", 'Последний член это куб двух, то есть восемь.', 'The last term is two cubed, that is eight.') },
      ],
    },
    {
      wrap: false,
      question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
      prompt: '(y − 2)³',
      ok: L("Ishoralar navbatlashdi.", 'Знаки чередовались.', 'The signs alternated.'),
      items: [
        { id: 'a', label: 'y³ − 6y² + 12y − 8', correct: true },
        { id: 'b', label: 'y³ − 8', tag: 'Z1', hint: L("O'rta hadlar yo'qolmaydi.", 'Средние члены не исчезают.', 'The middle terms do not vanish.') },
        { id: 'c', label: 'y³ − 6y² − 12y − 8', tag: 'Z3', hint: L("Uchinchi hadda ikki minus uchrashadi.", 'В третьем члене встречаются два минуса.', 'Two minuses meet in the third term.') },
        { id: 'd', label: 'y³ + 6y² + 12y + 8', tag: 'Z3', hint: L("Qavsda ayirish turgan edi.", 'В скобке было вычитание.', 'The bracket had a subtraction.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ayirmaning kubida oxirgi hadning ishorasi qanday?",
        'Какой знак у последнего члена в кубе разности?',
        'What sign does the last term of a cube of a difference have?',
      ),
      ok: L("Manfiy sonning kubi manfiy bo'ladi.", 'Куб отрицательного числа отрицателен.', 'The cube of a negative number is negative.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('minus', 'минус', 'minus'),
        },
        {
          id: 'b',
          tag: 'Z3',
          label: L("qo'shuv", 'плюс', 'plus'),
          hint: L("Kvadratda musbat bo'lardi, kubda esa uch marta ko'paytiriladi.", 'В квадрате был бы плюс, а в кубе множитель берётся трижды.', 'In a square it would be plus, but a cube takes it three times.'),
        },
        {
          id: 'c',
          tag: 'Z3',
          label: L('sonlarga bog\'liq', 'зависит от чисел', 'it depends on the numbers'),
          hint: L("Ishora formula bilan belgilanadi, sonlar bilan emas.", 'Знак задан формулой, а не числами.', 'The sign is set by the formula, not by the numbers.'),
        },
        {
          id: 'd',
          tag: 'Z1',
          label: L("oxirgi had yo'q", 'последнего члена нет', 'there is no last term'),
          hint: L("Kubda to'rt had bor, oxirgisi ikkinchi hadning kubi.", 'В кубе четыре члена, последний это куб второго.', 'A cube has four terms, the last being the cube of the second.'),
        },
      ],
    },
    {
      wrap: false,
      question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
      prompt: '(3x + 1)³',
      ok: L("Uch x kubda yigirma yetti x kub, kvadratda esa to'qqiz x kvadrat.", 'Три x в кубе это двадцать семь x в кубе, а в квадрате девять x в квадрате.', 'Three x cubed is twenty seven x cubed, and squared it is nine x squared.'),
      items: [
        { id: 'a', label: '27x³ + 27x² + 9x + 1', correct: true },
        { id: 'b', label: '27x³ + 1', tag: 'Z1', hint: L("O'rta hadlar yo'qolmaydi.", 'Средние члены не исчезают.', 'The middle terms do not vanish.') },
        { id: 'c', label: '3x³ + 27x² + 9x + 1', tag: 'Z4', hint: L("Uch x ni kubga ko'tarsak yigirma yetti x kub chiqadi.", 'Три x в кубе это двадцать семь x в кубе.', 'Three x cubed is twenty seven x cubed.') },
        { id: 'd', label: '27x³ + 9x² + 27x + 1', tag: 'Z6', hint: L("Ikkinchi had uch karra to'qqiz x kvadrat, ya'ni yigirma yetti x kvadrat.", 'Второй член это три на девять x в квадрате, то есть двадцать семь x в квадрате.', 'The second term is three by nine x squared, that is twenty seven x squared.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida ayirma bor.", 'Во втором есть разность.', 'The second has a difference.'),
    A('2', "Uchinchisi ishora haqida.", 'Третий про знак.', 'The third is about the sign.'),
    A('3', "Oxirgisida koeffitsiyent uch.", 'В последнем коэффициент три.', 'In the last one the coefficient is three.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Olti katak, to\'rt had', 'Шесть клеток, четыре члена', 'Six cells, four terms'),
  gate: S1.gate,
  fix: {
    tokens: ['1', '+', '6', '+', '12', '+', '8'],
    value: '27',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Kublar orasida yana ikki had bor, va ularning oldida uchlik turadi. Bir va ikki uchun bu olti va o'n ikki, hammasi bo'lib yigirma yetti.",
    'Между кубами есть ещё два члена, и перед ними стоит тройка. Для одного и двух это шесть и двенадцать, а всего двадцать семь.',
    'Two more terms sit between the cubes, each carrying a three. For one and two that is six and twelve, twenty seven in all.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    four: L("to'rt had", 'четыре члена', 'four terms'),
    two: L('ikki had', 'два члена', 'two terms'),
    three: L('uch had', 'три члена', 'three terms'),
    one: L('ochib bo\'lmaydi', 'раскрыть нельзя', 'cannot be expanded'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(a + b)³ → 6', '(a − b)³ → −3a²b', '(x + 2)³ → 12x', '11³ → 1331'],
  twoLabel: L('B5 bloki davom etadi', 'Блок Б5 продолжается', 'Block B5 continues'),
  twoA: L(
    "olti katak  →  to'rt had",
    'шесть клеток  →  четыре члена',
    'six cells  →  four terms',
  ),
  twoB: L(
    'uchlik  →  sanoqdan chiqadi',
    'тройка  →  выходит из счёта',
    'the three  →  comes out of counting',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "formulalarni qo'llash",
    'применение формул сокращённого умножения',
    'applying the special product formulas',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Uchliklar e'lon qilinmadi: ular o'xshash kataklarni sanaganda chiqdi.", 'Тройки не были объявлены: они вышли из подсчёта подобных клеток.', 'The threes were not declared: they came from counting the like cells.'),
    A('mount', "Keyingi darsda yangi formula bo'lmaydi. Formulani TANLASH kerak bo'ladi.", 'На следующем уроке новой формулы не будет. Формулу надо будет ВЫБИРАТЬ.', 'Next lesson brings no new formula. The formula will have to be CHOSEN.'),
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
