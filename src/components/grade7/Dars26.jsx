// ============================================================================
// 7-sinf, Dars 26. KVADRATLAR AYIRMASI.
// (Разность квадратов)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// O'QUVCHI BU HOLATNI ALLAQACHON KO'RGAN. 21-darsda `(x − 2)(x + 2)`
// CHEGARAVIY HOLAT edi: ko'paytma to'rtta, lekin o'rtadagilari bir-birini
// yo'q qildi va javob ikkihad chiqdi. Endi u FORMULA bo'ladi.
//
// BLOKNING XATOSI (etalon §2): `a² + b²` ni kvadratlar ayirmasi kabi
// ajratishga urinish. 7-ekran uni son bilan yopadi: uch sonda ham qiymatlar
// mos kelmaydi, ya'ni yozuvlar teng emas. Bunday formula YO'Q.
//
// ASBOB TAYYOR: yuza to'rtburchagi (3-asbob). Ikki qavsning ishorasi
// BOSHQA, va shu bittagina farq o'rta kataklarni yo'q qiladi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_26'
const LESSON_TITLE = L('Kvadratlar ayirmasi', 'Разность квадратов', 'The difference of squares')
const LESSON_NO = L('26-dars', 'Урок 26', 'Lesson 26')
const BLOCK = { label: L('B5-blok', 'Блок Б5', 'Block B5'), from: 25, to: 32, current: 26 }

const TAGS = {
  Z1: L("o'rta hadlar bilan ish", 'работа со средними членами', 'work with the middle terms'),
  Z2: L("ko'paytma tushib qoldi", 'произведение пропущено', 'a product was skipped'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L('koeffitsiyentdan ildiz', 'корень из коэффициента', 'the root of the coefficient'),
  Z5: L('formula almashtirildi', 'формула спутана', 'the formula was mixed up'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. TABLODA: a besh, b uch bo'lgandagi qiymat.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('KVADRATLAR AYIRMASI', 'РАЗНОСТЬ КВАДРАТОВ', 'THE DIFFERENCE OF SQUARES'),
  noBack: true,
  noNotes: true,
  title: L('Qaysi ajratma to\'g\'ri', 'Какое разложение верно', 'Which factorization is right'),
  gate: {
    source: { kind: 'plain', tokens: ['a²', '−', 'b²'] },
    rows: [
      { tokens: ['(a', '−', 'b)', '(a', '−', 'b)'], value: '4' },
      { tokens: ['(a', '+', 'b)', '(a', '−', 'b)'], value: '16' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Kvadratlar ayirmasi ikki xil ajratilgan. Tabloda a besh, b uch bo'lgandagi qiymat turadi. Yozuvning o'zi o'n olti beradi. Kim haq?",
      'Разность квадратов разложили двумя способами. На табло значение при a равном пяти и b равном трём. Сама запись даёт шестнадцать. Кто прав?',
      'A difference of squares was factored in two ways. The boards show the value at a equal to five and b equal to three. The record itself gives sixteen. Who is right?',
    ),
    items: [
      {
        id: 'mixed',
        label: L('Ishoralari boshqa ikki qavs', 'Тот, у кого скобки с разными знаками', 'The one with brackets of different signs'),
        hint: L(
          "Taxminingiz qabul qilindi. To'rtburchakda tekshiramiz.",
          'Прогноз принят. Проверим на прямоугольнике.',
          'Your prediction is taken. We will check it on the rectangle.',
        ),
      },
      {
        id: 'same',
        label: L('Ikki bir xil qavs', 'Тот, у кого скобки одинаковые', 'The one with two identical brackets'),
        hint: L(
          "Sonlarni qo'ying: besh minus uch ikki, ikki karra ikki esa to'rt. Kerak bo'lgani o'n olti.",
          'Подставь: пять минус три это два, два на два это четыре. А нужно шестнадцать.',
          'Substitute: five minus three is two, two times two is four. But sixteen is needed.',
        ),
      },
      {
        id: 'both',
        label: L('Ikkovi ham to\'g\'ri', 'Оба верны', 'Both are right'),
        hint: L(
          "Bir xil sonlarda to'rt va o'n olti chiqdi, ya'ni yozuvlardan bittasi teng emas.",
          'При одних числах вышло четыре и шестнадцать, значит одна из записей не равна исходной.',
          'At the same numbers it gave four and sixteen, so one of the records is not equal.',
        ),
      },
      {
        id: 'none',
        label: L('Kvadratlar ayirmasini ajratib bo\'lmaydi', 'Разность квадратов разложить нельзя', 'A difference of squares cannot be factored'),
        hint: L(
          "Yigirma besh minus to'qqiz o'n oltiga teng, va o'n olti sakkiz karra ikki. Ajratma bor.",
          'Двадцать пять минус девять это шестнадцать, а шестнадцать это восемь на два. Разложение есть.',
          'Twenty five minus nine is sixteen, and sixteen is eight times two. A factorization exists.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Kvadratlar ayirmasi ikki xil ajratilgan.", 'Разность квадратов разложили двумя способами.', 'A difference of squares was factored in two ways.'),
    A('mount', "Tabloda a besh, b uch bo'lgandagi qiymat turadi. Yozuvning o'zi o'n olti beradi.", 'На табло значение при a равном пяти и b равном трём. Сама запись даёт шестнадцать.', 'The boards show the value at a five and b three. The record itself gives sixteen.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. 21-darsdagi chegaraviy holat va 25-darsning formulasi.
// KVOTA EKRANI.
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
      prompt: '(x − 2)(x + 2)',
      ok: L("O'rta ko'paytmalar bir-birini yo'q qildi -- buni 21-darsda ko'rgan edik.", 'Средние произведения уничтожили друг друга, это мы видели в уроке 21.', 'The middle products cancelled each other, as we saw in lesson 21.'),
      items: [
        { id: 'a', label: 'x² − 4', correct: true },
        { id: 'b', label: 'x² + 4', tag: 'Z3', hint: L("Oxirgi katakda minus ikki karra ikki turibdi.", 'В последней клетке минус два на два.', 'The last cell is minus two times two.') },
        { id: 'c', label: 'x² − 4x − 4', tag: 'Z1', hint: L("O'rtada ikki x va minus ikki x turibdi, ular nol beradi.", 'В середине два x и минус два x, они дают ноль.', 'In the middle two x and minus two x, they give zero.') },
        { id: 'd', label: 'x² − 2', tag: 'Z6', hint: L("Oxirgi katak ikki karra ikki, ya'ni to'rt.", 'Последняя клетка два на два, то есть четыре.', 'The last cell is two times two, that is four.') },
      ],
    },
    {
      wrap: false,
      prompt: '(a − b)²',
      ok: L("Bir xil ikki qavs: o'rta hadlar qo'shiladi.", 'Две одинаковые скобки: средние члены складываются.', 'Two identical brackets: the middle terms add.'),
      items: [
        { id: 'a', label: 'a² − 2ab + b²', correct: true },
        { id: 'b', label: 'a² − b²', tag: 'Z5', hint: L("Bu boshqa formula: unda qavslarning ishorasi boshqa bo'ladi.", 'Это другая формула: там знаки скобок разные.', 'That is another formula: there the brackets have different signs.') },
        { id: 'c', label: 'a² − 2ab − b²', tag: 'Z3', hint: L("Oxirgi katakda ikki minus bor.", 'В последней клетке два минуса.', 'The last cell has two minuses.') },
        { id: 'd', label: 'a² + 2ab + b²', tag: 'Z3', hint: L("O'rta kataklarda bittadan minus bor.", 'В средних клетках по одному минусу.', 'The middle cells have one minus each.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "7² − 3² nechchiga teng?",
        'Чему равно 7² − 3²?',
        'What does 7² − 3² equal?',
      ),
      ok: L("Qirq to'qqiz minus to'qqiz qirq beradi.", 'Сорок девять минус девять это сорок.', 'Forty nine minus nine is forty.'),
      items: [
        { id: 'a', label: '40', correct: true },
        { id: 'b', label: '16', tag: 'Z6', hint: L("Yettining kvadrati qirq to'qqiz, uchning kvadrati to'qqiz.", 'Семь в квадрате сорок девять, три в квадрате девять.', 'Seven squared is forty nine, three squared is nine.') },
        { id: 'c', label: '4', tag: 'Z6', hint: L("Bu yetti minus uch, bizga esa har birining kvadrati kerak.", 'Это семь минус три, а нужен квадрат каждого.', 'That is seven minus three, but each one must be squared.') },
        { id: 'd', label: '58', tag: 'Z6', hint: L("Kvadratlar ayiriladi, qo'shilmaydi.", 'Квадраты вычитаются, а не складываются.', 'The squares are subtracted, not added.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Birinchisi bu darsning kaliti: siz uni allaqachon ko'rgansiz.", 'Три коротких вопроса. Первый это ключ к уроку: ты его уже видел.', 'Three short questions. The first is the key to this lesson: you have seen it already.'),
    A('1', "Ikkinchisi o'tgan darsdan.", 'Второй из прошлого урока.', 'The second is from the last lesson.'),
    A('2', "Uchinchisi sonlar bilan.", 'Третий с числами.', 'The third is with numbers.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. ISHORALAR BOSHQA: o'rta kataklar bir-birini
// yo'q qiladi.
// ============================================================
const S3 = {
  kind: 'grid',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('O\'rta kataklar yo\'q bo\'ladi', 'Средние клетки исчезают', 'The middle cells vanish'),
  caption: L(
    "Chapda qo'shuv, yuqorida ayirish. To'rt katakni bosing.",
    'Слева сложение, сверху вычитание. Нажми на четыре клетки.',
    'A plus on the left, a minus on top. Tap the four cells.',
  ),
  left: ['a', '+b'],
  top: ['a', '−b'],
  options: [
    { id: 'a', label: 'a² − b²' },
    { id: 'b', label: 'a² − 2ab − b²' },
    { id: 'c', label: 'a² + b²' },
    { id: 'd', label: 'a² − ab − b²' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("O'rta kataklarning ishorasi boshqa: biri manfiy, ikkinchisi musbat. Ular nol beradi.", 'У средних клеток разные знаки: одна отрицательна, другая положительна. Они дают ноль.', 'The middle cells have opposite signs: one negative, one positive. They give zero.') },
    { key: 'c', tag: 'Z3', hint: L("Oxirgi katakda b karra minus b turibdi, ya'ni manfiy.", 'В последней клетке b на минус b, то есть отрицательно.', 'The last cell is b times minus b, so negative.') },
    { key: 'd', tag: 'Z2', hint: L("O'rta katak ikkita, va ularning yig'indisi nol.", 'Средних клеток две, и их сумма ноль.', 'There are two middle cells, and their sum is zero.') },
  ],
  note: L(
    "O'rta kataklar manfiy ab va musbat ab beradi. Ular bir-birini yo'q qiladi, va javobda faqat ikki kvadrat qoladi.",
    'Средние клетки дают минус ab и плюс ab. Они уничтожают друг друга, и в ответе остаются только два квадрата.',
    'The middle cells give minus ab and plus ab. They cancel each other, and only the two squares remain.',
  ),
  audio: [
    A('mount', "Bu safar qavslarning ishorasi boshqa: birida qo'shuv, ikkinchisida ayirish.", 'На этот раз знаки скобок разные: в одной сложение, в другой вычитание.', 'This time the brackets have different signs: a plus in one, a minus in the other.'),
    A('mount', "To'rt katakni bosing va o'rtadagilarning ishorasiga qarang.", 'Нажми на четыре клетки и посмотри на знаки средних.', 'Tap the four cells and watch the signs of the middle ones.'),
    A('cell-all', "O'rta kataklarning ishorasi qarama-qarshi. Ularning yig'indisi nol.", 'Знаки средних клеток противоположны. Их сумма ноль.', 'The middle cells have opposite signs. Their sum is zero.'),
  ],
}

// ============================================================
// 4. FARQLASH. BIR XIL ikki qavs: o'rta kataklar QO'SHILADI. Kataklar
// soni bir xil, natija boshqa.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Bir xil qavslar bo\'lsa', 'Если скобки одинаковые', 'When the brackets are identical'),
  caption: L(
    "Endi ikki qavs bir xil. Kataklar soni o'zgarmadi -- to'rttasini bosing.",
    'Теперь скобки одинаковые. Число клеток не изменилось — нажми на четыре.',
    'Now the brackets are identical. The cell count is the same — tap all four.',
  ),
  left: ['a', '−b'],
  top: ['a', '−b'],
  options: [
    { id: 'a', label: 'a² − 2ab + b²' },
    { id: 'b', label: 'a² − b²' },
    { id: 'c', label: 'a² − 2ab − b²' },
    { id: 'd', label: 'a² + b²' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Bunday javob qavslarning ishorasi BOSHQA bo'lganda chiqadi.", 'Такой ответ выходит, когда знаки скобок РАЗНЫЕ.', 'That answer appears when the brackets have DIFFERENT signs.') },
    { key: 'c', tag: 'Z3', hint: L("Oxirgi katakda minus b karra minus b, ya'ni musbat.", 'В последней клетке минус b на минус b, то есть плюс.', 'The last cell is minus b times minus b, so positive.') },
    { key: 'd', tag: 'Z1', hint: L("O'rta kataklar ikkovi ham manfiy, ular yo'q bo'lmaydi, qo'shiladi.", 'Средние клетки обе отрицательны, они не уничтожаются, а складываются.', 'Both middle cells are negative, they do not cancel but add.') },
  ],
  note: L(
    "Farq bitta: qavslar BIR XIL bo'lsa o'rta kataklar qo'shiladi, ishoralari BOSHQA bo'lsa yo'q qiladi. Kataklar esa ikkovida ham to'rtta.",
    'Отличие одно: если скобки ОДИНАКОВЫ, средние клетки складываются, если знаки РАЗНЫЕ — уничтожаются. Клеток и там и тут четыре.',
    'One difference: identical brackets make the middle cells add, opposite signs make them cancel. Either way there are four cells.',
  ),
  audio: [
    A('mount', "O'sha to'rtburchak, lekin qavslar bir xil.", 'Тот же прямоугольник, но скобки одинаковые.', 'The same rectangle, but the brackets are identical.'),
    A('mount', "Kataklar soni o'zgarmadi. O'zgargani -- o'rta kataklarning ishorasi.", 'Число клеток не изменилось. Изменились знаки средних клеток.', 'The cell count did not change. What changed is the signs of the middle cells.'),
    A('cell-all', "Ikkala o'rta katak ham manfiy, demak ular qo'shiladi.", 'Обе средние клетки отрицательны, значит они складываются.', 'Both middle cells are negative, so they add.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. TESKARI YO'L: ayirma berilgan, qavslar
// izlanadi. Koeffitsiyentdan ILDIZ olinadi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Teskari yo\'l', 'Обратный путь', 'The inverse path'),
  template: ['25a² − 9  =  (5a + 3)(', { slot: 0 }, ')'],
  parts: [
    { id: 'a', label: '5a − 3' },
    { id: 'b', label: '5a + 3' },
    { id: 'c', label: '25a − 3' },
    { id: 'd', label: '5a − 9' },
  ],
  answer: ['a'],
  prompt: L(
    "Ikkinchi qavsni yozing. Har hadning ildizini olish kerak.",
    'Запиши вторую скобку. Нужно взять корень из каждого члена.',
    'Write the second bracket. The root of each term is needed.',
  ),
  checkNote: L(
    "Yigirma besh a kvadratning ildizi besh a, to'qqizning ildizi uch. Ishoralar esa boshqa bo'lishi kerak.",
    'Корень из двадцати пяти a в квадрате это пять a, корень из девяти это три. А знаки должны быть разными.',
    'The root of twenty five a squared is five a, the root of nine is three. And the signs must differ.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Ikki bir xil qavs kvadratni beradi, ayirmani emas.", 'Две одинаковые скобки дают квадрат, а не разность.', 'Two identical brackets give a square, not a difference.') },
    { key: 'c', tag: 'Z4', hint: L("Besh a karra besh a yigirma besh a kvadrat beradi, ya'ni qavsda besh a turadi.", 'Пять a на пять a это двадцать пять a в квадрате, значит в скобке пять a.', 'Five a times five a is twenty five a squared, so the bracket holds five a.') },
    { key: 'd', tag: 'Z6', hint: L("To'qqizning ildizi uch, to'qqiz emas.", 'Корень из девяти это три, а не девять.', 'The root of nine is three, not nine.') },
  ],
  audio: [
    A('mount', "Endi teskari yo'l: ayirma bor, qavslar esa yo'q.", 'Теперь обратный путь: разность есть, а скобок нет.', 'Now the inverse path: the difference is there, the brackets are not.'),
    A('mount', "Har haddan ildiz olinadi, va qavslarning ishorasi boshqa bo'ladi.", 'Из каждого члена берётся корень, и знаки скобок будут разными.', 'A root is taken from each term, and the brackets get different signs.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. KOEFFITSIYENT ikki tomonda ham.
// ============================================================
const S6 = {
  kind: 'grid',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Koeffitsiyent bilan', 'С коэффициентом', 'With a coefficient'),
  caption: L(
    "Har qavsda koeffitsiyent bor. To'rt katakni bosing.",
    'В каждой скобке есть коэффициент. Нажми на четыре клетки.',
    'Each bracket has a coefficient. Tap the four cells.',
  ),
  left: ['3x', '+4'],
  top: ['3x', '−4'],
  options: [
    { id: 'a', label: '9x² − 16' },
    { id: 'b', label: '9x² + 16' },
    { id: 'c', label: '9x² − 24x − 16' },
    { id: 'd', label: '3x² − 16' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Oxirgi katakda to'rt karra minus to'rt turibdi.", 'В последней клетке четыре на минус четыре.', 'The last cell is four times minus four.') },
    { key: 'c', tag: 'Z1', hint: L("O'rta kataklar manfiy o'n ikki x va musbat o'n ikki x, ular nol beradi.", 'Средние клетки минус двенадцать x и плюс двенадцать x, они дают ноль.', 'The middle cells are minus twelve x and plus twelve x, they give zero.') },
    { key: 'd', tag: 'Z4', hint: L("Uch x karra uch x to'qqiz x kvadrat beradi.", 'Три x на три x это девять x в квадрате.', 'Three x times three x is nine x squared.') },
  ],
  note: L(
    "Koeffitsiyent ham kvadratga ko'tariladi, o'rta kataklar esa yana yo'q bo'ladi.",
    'Коэффициент тоже возводится в квадрат, а средние клетки снова исчезают.',
    'The coefficient is squared too, and the middle cells vanish again.',
  ),
  audio: [
    A('mount', "Bu safar qavslarda koeffitsiyent bor: uch x.", 'На этот раз в скобках есть коэффициент: три x.', 'This time the brackets have a coefficient: three x.'),
    A('mount', "O'rta kataklarga qarang: ular yana qarama-qarshi.", 'Посмотри на средние клетки: они снова противоположны.', 'Look at the middle cells: they are opposite again.'),
    A('cell-all', "Javobda ikki had qoldi.", 'В ответе осталось два члена.', 'Two terms are left in the answer.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH: KVADRATLAR
// YIG'INDISINI ajratib bo'lmaydi. Blokning atalgan xatosi.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Kvadratlar yig\'indisi', 'Сумма квадратов', 'A sum of squares'),
  letter: 'x',
  numbers: [1, 2, 5],
  rows: [
    { id: 'r1', role: 'source', expr: 'x² + 9', sub: (n) => n + '² + 9', val: (n) => n * n + 9 },
    { id: 'r2', expr: '(x + 3)(x − 3)', sub: (n) => '(' + n + ' + 3)(' + n + ' − 3)', val: (n) => (n + 3) * (n - 3) },
  ],
  probe: {
    question: L(
      "Uch sonda ham qiymatlar mos kelmadi. Bu nima degani?",
      'Ни при одном из трёх чисел значения не совпали. Что это значит?',
      'At none of the three numbers did the values match. What does that mean?',
    ),
    items: [
      {
        id: 'no',
        correct: true,
        label: L("Kvadratlar yig'indisini bunday ajratib bo'lmaydi", 'Сумму квадратов так разложить нельзя', 'A sum of squares cannot be factored this way'),
      },
      {
        id: 'other',
        tag: 'Z1',
        label: L('Mos keladigan boshqa son topish kerak', 'Нужно найти другое число, где совпадёт', 'Another number must be found where it matches'),
        hint: L(
          "Uch son allaqachon farq qildi. Ayniyat uchun esa HAMMA sonda mos kelishi kerak.",
          'Три числа уже разошлись. А для тождества нужно совпадение при всех числах.',
          'Three numbers already differed. An identity must match at every number.',
        ),
      },
      {
        id: 'sign',
        tag: 'Z3',
        label: L("Qavslarni ikkovini ham minus bilan olish kerak", 'Надо взять обе скобки с минусом', 'Both brackets should be taken with a minus'),
        hint: L(
          "Unda ayirmaning kvadrati chiqadi, va unda o'rta had bo'ladi.",
          'Тогда выйдет квадрат разности, а в нём есть средний член.',
          'That gives a square of a difference, which has a middle term.',
        ),
      },
      {
        id: 'calc',
        tag: 'Z6',
        label: L('Qayerda bo\'lsa ham hisobda xato bor', 'Где-то ошибка в счёте', 'There is a slip in the arithmetic somewhere'),
        hint: L(
          "Birda tekshiring: bir qo'shuv to'qqiz o'n, to'rt karra minus ikki esa minus sakkiz.",
          'Проверь при единице: один плюс девять это десять, а четыре на минус два это минус восемь.',
          'Check at one: one plus nine is ten, and four times minus two is minus eight.',
        ),
      },
    ],
  },
  okText: L(
    "Kvadratlar AYIRMASI ajratiladi, YIG'INDISI esa ajratilmaydi. `a² + b²` uchun bunday formula yo'q.",
    'Разность квадратов раскладывается, а сумма квадратов — нет. Формулы для a² + b² не существует.',
    'A difference of squares factors, a sum of squares does not. There is no such formula for a² + b².',
  ),
  audio: [
    A('mount', "Yuqorida kvadratlar yig'indisi, pastda uni ajratishga urinish.", 'Сверху сумма квадратов, снизу попытка её разложить.', 'Above a sum of squares, below an attempt to factor it.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Ikki qatorni solishtiring. Ular mos kelmaydi.", 'Сравни две строки. Они не совпадают.', 'Compare the two rows. They do not match.'),
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
    { id: 'f1', label: L("yig'indini ayirmaga ko'paytirsak", 'произведение суммы на разность', 'the product of a sum by a difference') },
    { id: 'f2', label: L('kvadratlar ayirmasi chiqadi', 'даёт разность квадратов', 'gives a difference of squares') },
    { id: 'f3', label: L("chunki o'rta ko'paytmalar yo'q bo'ladi", 'потому что средние произведения уничтожаются', 'because the middle products cancel') },
    { id: 'f4', label: L("kvadratlar yig'indisi esa ajratilmaydi", 'а сумма квадратов не разлагается', 'and a sum of squares does not factor') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval ko'paytma, keyin natija, keyin sabab, oxirida yig'indi holati.",
    'Порядок нарушен. Сначала произведение, потом результат, потом причина, в конце случай суммы.',
    'The order is off. The product first, then the result, then the reason, and the sum case last.',
  ),
  lawChips: [
    { label: '( ) ( )', tone: 'par' },
    { label: '·', tone: 's2' },
    { label: '−', tone: 's1' },
    { label: '2 · 2', tone: 'off' },
  ],
  lawSweep: L(
    "ikki qavs, ko'paytirish, ishora, kataklar soni",
    'две скобки, умножение, знак, число клеток',
    'two brackets, multiplication, the sign, the cell count',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ikki ifoda yig'indisini ularning ayirmasiga ko'paytirsak, ularning kvadratlari ayirmasi chiqadi. Teskarisi ham to'g'ri: kvadratlar ayirmasi yig'indi va ayirmaning ko'paytmasiga ajratiladi.",
        'Произведение суммы двух выражений на их разность равно разности их квадратов. И обратно: разность квадратов разлагается на произведение суммы и разности.',
        'The product of a sum of two expressions by their difference equals the difference of their squares. And conversely: a difference of squares factors into a sum times a difference.',
      ),
      L(
        "O'rta ko'paytmalar yo'q bo'ladi, chunki ularning ishorasi qarama-qarshi. Shuning uchun javobda uch had emas, IKKI had bo'ladi. Kvadratlar yig'indisi esa ko'paytuvchilarga bunday ajratilmaydi.",
        'Средние произведения уничтожаются, потому что их знаки противоположны. Поэтому в ответе не три члена, а ДВА. А сумма квадратов на множители так не разлагается.',
        'The middle products cancel because their signs are opposite. So the answer has TWO terms, not three. And a sum of squares does not factor this way.',
      ),
    ],
  },
  hookCap: L(
    "O'rtadagilar yo'q bo'ladi, ikki kvadrat qoladi",
    'Средние уничтожаются, остаются два квадрата',
    'The middle ones cancel, two squares remain',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("yig'indi karra ayirma", 'сумма на разность', 'a sum by a difference'),
    L("o'rtadagilar yo'q bo'ladi", 'средние уничтожаются', 'the middle ones cancel'),
    L("yig'indi ajratilmaydi", 'сумма не разлагается', 'a sum does not factor'),
  ],
  audio: [
    A('mount', "Ikki holatni ko'rdik: ishoralar boshqa va ishoralar bir xil. Endi qoidani yig'amiz.", 'Мы увидели два случая: знаки разные и знаки одинаковые. Теперь соберём правило.', 'We have seen two cases: different signs and identical signs. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda qavs uch marta ko'paytiriladi.", 'Верно. На следующем уроке скобка умножается трижды.', 'Correct. Next lesson the bracket is multiplied three times.'),
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
      prompt: '(x − 5)(x + 5)',
      ok: L("O'rtadagilar yo'q bo'ldi, ikki kvadrat qoldi.", 'Средние уничтожились, остались два квадрата.', 'The middle ones cancelled, two squares remain.'),
      items: [
        { id: 'a', label: 'x² − 25', correct: true },
        { id: 'b', label: 'x² + 25', tag: 'Z3', hint: L("Oxirgi katakda minus besh karra besh.", 'В последней клетке минус пять на пять.', 'The last cell is minus five times five.') },
        { id: 'c', label: 'x² − 10x − 25', tag: 'Z1', hint: L("O'rta kataklarning ishorasi qarama-qarshi, ular nol beradi.", 'Знаки средних клеток противоположны, они дают ноль.', 'The middle cells have opposite signs, they give zero.') },
        { id: 'd', label: 'x² − 5', tag: 'Z6', hint: L("Beshning kvadrati yigirma besh.", 'Квадрат пяти это двадцать пять.', 'The square of five is twenty five.') },
      ],
    },
    {
      wrap: false,
      prompt: '4y² − 49',
      ok: L("To'rt y kvadratning ildizi ikki y, qirq to'qqizning ildizi yetti.", 'Корень из четырёх y в квадрате это два y, корень из сорока девяти семь.', 'The root of four y squared is two y, the root of forty nine is seven.'),
      items: [
        { id: 'a', label: '(2y − 7)(2y + 7)', correct: true },
        { id: 'b', label: '(4y − 7)(4y + 7)', tag: 'Z4', hint: L("To'rt y karra to'rt y o'n olti y kvadrat berardi.", 'Четыре y на четыре y дало бы шестнадцать y в квадрате.', 'Four y times four y would give sixteen y squared.') },
        { id: 'c', label: '(2y − 7)(2y − 7)', tag: 'Z5', hint: L("Bir xil ikki qavs kvadratni beradi, ayirmani emas.", 'Две одинаковые скобки дают квадрат, а не разность.', 'Two identical brackets give a square, not a difference.') },
        { id: 'd', label: '(2y − 49)(2y + 49)', tag: 'Z6', hint: L("Qirq to'qqizning ildizi yetti.", 'Корень из сорока девяти это семь.', 'The root of forty nine is seven.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qaysi yozuv ko'paytuvchilarga ajratilmaydi?",
        'Какая запись не разлагается на множители?',
        'Which record does not factor?',
      ),
      ok: L("Kvadratlar yig'indisi ajratilmaydi.", 'Сумма квадратов не разлагается.', 'A sum of squares does not factor.'),
      items: [
        { id: 'a', label: 'x² + 16', correct: true },
        { id: 'b', label: 'x² − 16', tag: 'Z1', hint: L("Bu kvadratlar ayirmasi, u ajratiladi.", 'Это разность квадратов, она разлагается.', 'That is a difference of squares, it factors.') },
        { id: 'c', label: '9x² − 1', tag: 'Z1', hint: L("Bu ham kvadratlar ayirmasi: uch x va bir.", 'Это тоже разность квадратов: три x и один.', 'That is a difference of squares too: three x and one.') },
        { id: 'd', label: 'x² − y²', tag: 'Z1', hint: L("Bu formulaning o'zi.", 'Это сама формула.', 'That is the formula itself.') },
      ],
    },
    {
      wrap: false,
      prompt: '(3a − 2b)(3a + 2b)',
      ok: L("Ikki harf ham kvadratga ko'tarildi.", 'Обе буквы возведены в квадрат.', 'Both letters got squared.'),
      items: [
        { id: 'a', label: '9a² − 4b²', correct: true },
        { id: 'b', label: '9a² + 4b²', tag: 'Z3', hint: L("Oxirgi katakda ikki b karra minus ikki b.", 'В последней клетке два b на минус два b.', 'The last cell is two b times minus two b.') },
        { id: 'c', label: '9a² − 2b²', tag: 'Z4', hint: L("Ikki b karra ikki b to'rt b kvadrat beradi.", 'Два b на два b это четыре b в квадрате.', 'Two b times two b is four b squared.') },
        { id: 'd', label: '3a² − 4b²', tag: 'Z4', hint: L("Uch a karra uch a to'qqiz a kvadrat beradi.", 'Три a на три a это девять a в квадрате.', 'Three a times three a is nine a squared.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ikkinchisi va uchinchisi teskari yo'l.", 'Четыре вопроса. Второй и третий это обратный путь.', 'Four questions. The second and third are the inverse path.'),
    A('1', "Ikkinchisida koeffitsiyentdan ildiz olinadi.", 'Во втором берётся корень из коэффициента.', 'In the second, the root of the coefficient is taken.'),
    A('2', "Uchinchisiga o'ylab javob bering.", 'На третий ответь подумав.', 'Think before answering the third.'),
    A('3', "Oxirgisida ikki harf bor.", 'В последнем две буквы.', 'The last one has two letters.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: qavs, keyin O'RTA HAD haqida savol.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Katta koeffitsiyent', 'Большой коэффициент', 'A big coefficient'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['49x² − 25  =  (', { slot: 0 }, ')(7x + 5)'],
  parts: [
    { id: 'a', label: '7x − 5' },
    { id: 'b', label: '7x + 5' },
    { id: 'c', label: '49x − 5' },
    { id: 'd', label: '7x − 25' },
  ],
  answer: ['a'],
  prompt: L(
    "Birinchi qavsni yozing.",
    'Запиши первую скобку.',
    'Write the first bracket.',
  ),
  checkNote: L(
    "Qirq to'qqiz x kvadratning ildizi yetti x, yigirma beshning ildizi besh.",
    'Корень из сорока девяти x в квадрате это семь x, корень из двадцати пяти пять.',
    'The root of forty nine x squared is seven x, the root of twenty five is five.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Ikki bir xil qavs kvadratni beradi.", 'Две одинаковые скобки дают квадрат.', 'Two identical brackets give a square.') },
    { key: 'c', tag: 'Z4', hint: L("Yetti x karra yetti x qirq to'qqiz x kvadrat beradi.", 'Семь x на семь x это сорок девять x в квадрате.', 'Seven x times seven x is forty nine x squared.') },
    { key: 'd', tag: 'Z6', hint: L("Yigirma beshning ildizi besh.", 'Корень из двадцати пяти это пять.', 'The root of twenty five is five.') },
  ],
  probe: {
    question: L("Javobda nega x li had yo'q?", 'Почему в ответе нет члена с x?', 'Why is there no x term in the answer?'),
    items: [
      {
        id: 'a',
        correct: true,
        label: L("o'rta ko'paytmalar bir-birini yo'q qildi", 'средние произведения уничтожили друг друга', 'the middle products cancelled each other'),
      },
      {
        id: 'b',
        tag: 'Z1',
        label: L("chunki formulada u yo'q", 'потому что в формуле его нет', 'because the formula has none'),
        hint: L("U bor va hisoblanadi, lekin yig'indisi nol chiqadi.", 'Он есть и считается, но в сумме даёт ноль.', 'It is there and gets computed, but the sum is zero.'),
      },
      {
        id: 'c',
        tag: 'Z6',
        label: L('hisobda tushib qoldi', 'его пропустили при счёте', 'it was skipped in the counting'),
        hint: L("Ikkala o'rta ko'paytma ham hisoblangan: minus o'ttiz besh x va musbat o'ttiz besh x.", 'Оба средних произведения посчитаны: минус тридцать пять x и плюс тридцать пять x.', 'Both middle products are computed: minus thirty five x and plus thirty five x.'),
      },
      {
        id: 'd',
        tag: 'Z5',
        label: L('chunki qavslar bir xil', 'потому что скобки одинаковые', 'because the brackets are identical'),
        hint: L("Qavslar aynan boshqa: birida minus, ikkinchisida qo'shuv.", 'Скобки как раз разные: в одной минус, в другой плюс.', 'The brackets are in fact different: a minus in one, a plus in the other.'),
      },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval qavs, keyin o'rta had haqida savol.", 'Два шага. Сначала скобка, потом вопрос про средний член.', 'Two steps. The bracket first, then a question about the middle term.'),
    A('mount', "Ikkinchi qavs berilgan, birinchisini yozing.", 'Вторая скобка дана, запиши первую.', 'The second bracket is given, write the first.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('To\'rtburchaksiz', 'Без прямоугольника', 'Without the rectangle'),
  template: ['x² − 81  =  (x + 9)(', { slot: 0 }, ')'],
  parts: [
    { id: 'a', label: 'x − 9' },
    { id: 'b', label: 'x + 9' },
    { id: 'c', label: 'x − 81' },
    { id: 'd', label: '9 − x' },
  ],
  answer: ['a'],
  prompt: L(
    "Ikkinchi qavsni o'zingiz yozing.",
    'Вторую скобку запиши сам.',
    'Write the second bracket yourself.',
  ),
  checkNote: L(
    "Sakson birning ildizi to'qqiz. Ikkinchi qavsda ayirish bo'ladi.",
    'Корень из восьмидесяти одного это девять. Во второй скобке будет вычитание.',
    'The root of eighty one is nine. The second bracket takes a subtraction.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Ikki bir xil qavs kvadratni beradi.", 'Две одинаковые скобки дают квадрат.', 'Two identical brackets give a square.') },
    { key: 'c', tag: 'Z6', hint: L("Sakson birning ildizi to'qqiz.", 'Корень из восьмидесяти одного это девять.', 'The root of eighty one is nine.') },
    { key: 'd', tag: 'Z3', hint: L("Birinchi kvadrat x, shuning uchun qavsda ham x oldinda turadi.", 'Первый квадрат это x, поэтому и в скобке x стоит первым.', 'The first square is x, so x comes first in the bracket too.') },
  ],
  audio: [
    A('mount', "To'rtburchak yo'q. Ildizni oling va ishorani qo'ying.", 'Прямоугольника нет. Возьми корень и поставь знак.', 'No rectangle. Take the root and set the sign.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Ishoralar TO'G'RI qo'yilgan, lekin
// KOEFFITSIYENTDAN ildiz olinmagan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Ishoralar to'g'ri qo'yilgan: birida qo'shuv, ikkinchisida ayirish. Shunday bo'lsa ham, qaysi qator xato?",
    'Знаки расставлены верно: в одной скобке плюс, в другой минус. И всё же какая строка ошибочна?',
    'The signs are set right: a plus in one bracket, a minus in the other. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '4x² − 9' },
    { id: 'r2', text: '9 = 3 · 3' },
    { id: 'r3', text: '4x² = 4x · 4x' },
    { id: 'r4', text: L('javob: (4x − 3)(4x + 3)', 'ответ: (4x − 3)(4x + 3)', 'answer: (4x − 3)(4x + 3)') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: to'qqiz uch karra uch.", 'Верно: девять это три на три.', 'Right: nine is three times three.'),
    r4: L("Bu qator oldingisidan chiqadi. Xato undan oldin paydo bo'lgan.", 'Эта строка следует из предыдущей. Ошибка появилась раньше.', 'This line follows from the previous one. The mistake appeared earlier.'),
  },
  tags: { r1: 'Z4', r2: 'Z4', r4: 'Z4' },
  proofFill: {
    template: ['4x²  =  ', { slot: 0 }, '   →   (', { slot: 1 }, ')(2x + 3)'],
    parts: [
      { id: 'a', label: '2x · 2x' },
      { id: 'b', label: '2x − 3' },
      { id: 'c', label: '4x · 4x' },
      { id: 'd', label: '4x − 3' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Koeffitsiyentni to'g'ri yoying va qavsni tuzating.",
      'Разложи коэффициент верно и исправь скобку.',
      'Split the coefficient correctly and fix the bracket.',
    ),
    checkNote: L(
      "Ikki x karra ikki x to'rt x kvadrat beradi. Demak qavsda ikki x turadi, to'rt x emas.",
      'Два x на два x даёт четыре x в квадрате. Значит в скобке два x, а не четыре x.',
      'Two x times two x gives four x squared. So the bracket holds two x, not four x.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z4', hint: L("To'rt x karra to'rt x o'n olti x kvadrat beradi.", 'Четыре x на четыре x это шестнадцать x в квадрате.', 'Four x times four x is sixteen x squared.') },
      { key: 'd', tag: 'Z4', hint: L("Qavsdagi koeffitsiyent ikki bo'ladi.", 'Коэффициент в скобке равен двум.', 'The coefficient in the bracket is two.') },
      { key: '*', tag: 'Z4', hint: L("Koeffitsiyentdan ham ildiz olinadi.", 'Из коэффициента тоже берётся корень.', 'The root is taken from the coefficient too.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda ishoralar to'g'ri qo'yilgan.", 'В этой ловушке знаки расставлены верно.', 'In this trap the signs are set right.'),
    A('mount', "Shunday bo'lsa ham ajratma xato. Xato birinchi qaysi qatorda.", 'И всё же разложение неверно. В какой строке ошибка впервые.', 'And yet the factorization is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. To'rt x kvadrat ikki x karra ikki x bo'ladi.", 'Нашёл. Четыре x в квадрате это два x на два x.', 'You found it. Four x squared is two x times two x.'),
    A('done', "Koeffitsiyentdan ildiz olinadi, u shundayligicha qavsga ko'chmaydi.", 'Из коэффициента берётся корень, он не переезжает в скобку как был.', 'The root is taken from the coefficient, it does not move into the bracket unchanged.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TEZ HISOB.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Ustunsiz hisoblash', 'Счёт без столбика', 'Computing without long multiplication'),
  given: L(
    "Ellik birni qirq to'qqizga ko'paytiramiz, lekin ustunda emas: bu ellik qo'shuv bir karra ellik minus bir.",
    'Умножим пятьдесят один на сорок девять, но не в столбик: это пятьдесят плюс один на пятьдесят минус один.',
    'Let us multiply fifty one by forty nine, but not in a column: it is fifty plus one times fifty minus one.',
  ),
  template: ['51 · 49  =  (50 + 1)(50 − 1)  =  2500 − ', { slot: 0 }],
  parts: [
    { id: 'a', label: '1' },
    { id: 'b', label: '2' },
    { id: 'c', label: '100' },
    { id: 'd', label: '50' },
  ],
  answer: ['a'],
  prompt: L(
    "Nima ayiriladi.",
    'Что вычитается.',
    'What gets subtracted.',
  ),
  checkNote: L(
    "Ellikning kvadrati ikki ming besh yuz, birning kvadrati esa bir. Javob ikki ming to'rt yuz to'qson to'qqiz.",
    'Квадрат пятидесяти это две тысячи пятьсот, квадрат единицы это один. Ответ две тысячи четыреста девяносто девять.',
    'The square of fifty is two thousand five hundred, the square of one is one. The answer is two thousand four hundred ninety nine.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Oxirida ikkinchi sonning KVADRATI turadi, ikki karra ko'paytma emas.", 'В конце стоит КВАДРАТ второго числа, а не двойное произведение.', 'At the end stands the SQUARE of the second number, not a double product.') },
    { key: 'c', tag: 'Z6', hint: L("Birning kvadrati bir.", 'Квадрат единицы это один.', 'The square of one is one.') },
    { key: 'd', tag: 'Z6', hint: L("Ayiriladigani ikkinchi sonning kvadrati, birinchisining emas.", 'Вычитается квадрат второго числа, а не первого.', 'What gets subtracted is the square of the second number, not the first.') },
  ],
  audio: [
    A('mount', "Formula sonlar uchun ham ishlaydi. Ellik bir va qirq to'qqiz ellikdan bir qadam narida.", 'Формула работает и для чисел. Пятьдесят один и сорок девять стоят по шагу от пятидесяти.', 'The formula works for numbers too. Fifty one and forty nine are one step from fifty.'),
    A('mount', "Shuning uchun ko'paytma kvadratlar ayirmasiga aylanadi.", 'Поэтому произведение превращается в разность квадратов.', 'So the product turns into a difference of squares.'),
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
      prompt: '(a − 6)(a + 6)',
      ok: L("O'rtadagilar yo'q bo'ldi.", 'Средние уничтожились.', 'The middle ones cancelled.'),
      items: [
        { id: 'a', label: 'a² − 36', correct: true },
        { id: 'b', label: 'a² + 36', tag: 'Z3', hint: L("Oxirgi katakda minus olti karra olti.", 'В последней клетке минус шесть на шесть.', 'The last cell is minus six times six.') },
        { id: 'c', label: 'a² − 12a − 36', tag: 'Z1', hint: L("O'rta kataklar qarama-qarshi.", 'Средние клетки противоположны.', 'The middle cells are opposite.') },
        { id: 'd', label: 'a² − 6', tag: 'Z6', hint: L("Oltining kvadrati o'ttiz olti.", 'Квадрат шести это тридцать шесть.', 'The square of six is thirty six.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '25 − x²',
      ok: L("Birinchi kvadrat yigirma besh, shuning uchun beshlik oldinda turadi.", 'Первый квадрат это двадцать пять, поэтому пятёрка стоит первой.', 'The first square is twenty five, so the five comes first.'),
      items: [
        { id: 'a', label: '(5 − x)(5 + x)', correct: true },
        { id: 'b', label: '(x − 5)(x + 5)', tag: 'Z3', hint: L("Bu x kvadrat minus yigirma besh berardi, bizda esa teskarisi.", 'Это дало бы x в квадрате минус двадцать пять, а у нас наоборот.', 'That would give x squared minus twenty five, but here it is the other way.') },
        { id: 'c', label: '(5 − x)(5 − x)', tag: 'Z5', hint: L("Bir xil ikki qavs kvadratni beradi.", 'Две одинаковые скобки дают квадрат.', 'Two identical brackets give a square.') },
        { id: 'd', label: '(25 − x)(25 + x)', tag: 'Z6', hint: L("Yigirma beshning ildizi besh.", 'Корень из двадцати пяти это пять.', 'The root of twenty five is five.') },
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
      ok: L("Kvadratlar yig'indisi ajratilmaydi.", 'Сумма квадратов не разлагается.', 'A sum of squares does not factor.'),
      items: [
        { id: 'a', label: '9 + y²', correct: true },
        { id: 'b', label: '9 − y²', tag: 'Z1', hint: L("Bu kvadratlar ayirmasi.", 'Это разность квадратов.', 'That is a difference of squares.') },
        { id: 'c', label: 'y² − 100', tag: 'Z1', hint: L("Bu ham ayirma: y va o'n.", 'Это тоже разность: y и десять.', 'That is a difference too: y and ten.') },
        { id: 'd', label: '4y² − 1', tag: 'Z1', hint: L("Bu ham ayirma: ikki y va bir.", 'Это тоже разность: два y и один.', 'That is a difference too: two y and one.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(2m − 5n)(2m + 5n)',
      ok: L("Ikki koeffitsiyent ham kvadratga ko'tarildi.", 'Оба коэффициента возведены в квадрат.', 'Both coefficients got squared.'),
      items: [
        { id: 'a', label: '4m² − 25n²', correct: true },
        { id: 'b', label: '4m² + 25n²', tag: 'Z3', hint: L("Oxirgi katakda besh n karra minus besh n.", 'В последней клетке пять n на минус пять n.', 'The last cell is five n times minus five n.') },
        { id: 'c', label: '2m² − 25n²', tag: 'Z4', hint: L("Ikki m karra ikki m to'rt m kvadrat beradi.", 'Два m на два m это четыре m в квадрате.', 'Two m times two m is four m squared.') },
        { id: 'd', label: '4m² − 5n²', tag: 'Z4', hint: L("Besh n karra besh n yigirma besh n kvadrat beradi.", 'Пять n на пять n это двадцать пять n в квадрате.', 'Five n times five n is twenty five n squared.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida son oldinda turibdi.", 'Во втором число стоит первым.', 'In the second the number comes first.'),
    A('2', "Uchinchisi yig'indi haqida.", 'Третий про сумму.', 'The third is about a sum.'),
    A('3', "Oxirgisida ikki harf bor.", 'В последнем две буквы.', 'The last one has two letters.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('O\'rtadagilar yo\'q bo\'ladi', 'Средние уничтожаются', 'The middle ones cancel'),
  gate: S1.gate,
  fix: {
    tokens: ['(a', '+', 'b)', '(a', '−', 'b)'],
    value: '16',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Qavslarning ishorasi boshqa bo'lishi kerak: faqat shunda o'rta ko'paytmalar bir-birini yo'q qiladi. a besh, b uch bo'lganda o'n olti chiqadi.",
    'Знаки скобок должны быть разными: только тогда средние произведения уничтожают друг друга. При a равном пяти и b равном трём выходит шестнадцать.',
    'The brackets must have different signs: only then do the middle products cancel. At a five and b three it gives sixteen.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    mixed: L('ishoralari boshqa qavslar', 'скобки с разными знаками', 'brackets with different signs'),
    same: L('bir xil qavslar', 'одинаковые скобки', 'identical brackets'),
    both: L('ikkovi ham', 'оба', 'both of them'),
    none: L('ajratib bo\'lmaydi', 'разложить нельзя', 'cannot be factored'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(a + b)(a − b) → 2', '9x² − 16 → (3x − 4)', 'x² + 9 → ?', '51 · 49 → 2499'],
  twoLabel: L('B5 bloki davom etadi', 'Блок Б5 продолжается', 'Block B5 continues'),
  twoA: L(
    "ishoralar boshqa  →  o'rtadagilar yo'q bo'ladi",
    'знаки разные  →  средние уничтожаются',
    'different signs  →  the middle ones cancel',
  ),
  twoB: L(
    "kvadratlar yig'indisi  →  ajratilmaydi",
    'сумма квадратов  →  не разлагается',
    'a sum of squares  →  does not factor',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "yig'indining kubi va ayirmaning kubi",
    'куб суммы и куб разности',
    'the cube of a sum and the cube of a difference',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta farqdan chiqdi: qavslarning ishorasi bir xilmi yoki boshqa.", 'Вся сегодняшняя работа вышла из одного различия: знаки скобок одинаковы или разные.', 'All of today came from one difference: whether the brackets have the same signs or not.'),
    A('mount', "Keyingi darsda qavs uch marta ko'paytiriladi.", 'На следующем уроке скобка умножается трижды.', 'Next lesson the bracket gets multiplied three times.'),
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
