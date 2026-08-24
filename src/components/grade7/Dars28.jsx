// ============================================================================
// 7-sinf, Dars 28. QISQA KO'PAYTIRISH FORMULALARINI QO'LLASH.
// (Применение формул сокращённого умножения)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// BU DARSDA YANGI FORMULA YO'Q. Ish boshqacha: «hisobla» emas, «YOZUVNI
// TANI». Uch formula uch kunda o'rgatildi, va endi o'quvchi qaysi biri
// kerakligini O'ZI ko'rishi kerak.
//
// ASBOB: ZONALAR. To'rtinchi zona -- «formula yaramaydi». Usiz dars
// formula HAR DOIM bor deb o'rgatib qo'yardi, va bu yolg'on: `(x + 3)(x − 4)`
// oddiy ko'paytirish bilan hisoblanadi.
//
// BELGI QAVSLARDA KO'RINADI, hisobda emas:
//   qavslar BIR XIL          -> kvadrat;
//   hadlar bir xil, ISHORA boshqa -> kvadratlar ayirmasi;
//   sonlar boshqa            -> formula yo'q.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_28'
const LESSON_TITLE = L("Qisqa ko'paytirish formulalarini qo'llash", 'Применение формул сокращённого умножения', 'Applying the special product formulas')
const LESSON_NO = L('28-dars', 'Урок 28', 'Lesson 28')
const BLOCK = { label: L('B5-blok', 'Блок Б5', 'Block B5'), from: 25, to: 32, current: 28 }

const TAGS = {
  Z1: L('formula noto\'g\'ri tanlandi', 'формула выбрана не та', 'the wrong formula was chosen'),
  Z2: L("o'rta had bilan ish", 'работа со средним членом', 'work with the middle term'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L('koeffitsiyent bilan ish', 'работа с коэффициентом', 'work with the coefficient'),
  Z5: L('yozuvning belgisi o\'qilmadi', 'признак записи не прочитан', 'the mark of the record was not read'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Bitta yozuv IKKI XIL formula bilan hisoblangan.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("FORMULANI TANLASH", 'ВЫБОР ФОРМУЛЫ', 'CHOOSING THE FORMULA'),
  noBack: true,
  noNotes: true,
  title: L('Qaysi formula kerak', 'Какая формула нужна', 'Which formula is needed'),
  gate: {
    source: { kind: 'plain', tokens: ['(x', '−', '3)', '(x', '+', '3)'] },
    rows: [
      { tokens: ['x²', '−', '6x', '+', '9'], value: '4' },
      { tokens: ['x²', '−', '9'], value: '16' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Bitta yozuv ikki xil formula bilan hisoblangan. Tabloda x besh bo'lgandagi qiymat turadi. Yozuvning o'zi o'n olti beradi. Kim to'g'ri formulani tanladi?",
      'Одну запись посчитали по двум разным формулам. На табло значение при x равном пяти. Сама запись даёт шестнадцать. Кто выбрал верную формулу?',
      'One record was computed by two different formulas. The boards show the value at x equal to five. The record itself gives sixteen. Who picked the right formula?',
    ),
    items: [
      {
        id: 'diff',
        label: L('Kvadratlar ayirmasini olgani', 'Тот, кто взял разность квадратов', 'The one who took the difference of squares'),
        hint: L(
          "Taxminingiz qabul qilindi. Formulani yozuvdan qanday tanish kerakligini ko'ramiz.",
          'Прогноз принят. Посмотрим, как узнать формулу по записи.',
          'Your prediction is taken. Let us see how to read the formula off the record.',
        ),
      },
      {
        id: 'sq',
        label: L('Ayirmaning kvadratini olgani', 'Тот, кто взял квадрат разности', 'The one who took the square of a difference'),
        hint: L(
          "Ayirmaning kvadrati qavslar BIR XIL bo'lganda bo'ladi. Bu yerda esa ishoralar boshqa.",
          'Квадрат разности бывает, когда скобки ОДИНАКОВЫ. А здесь знаки разные.',
          'A square of a difference happens when the brackets are IDENTICAL. Here the signs differ.',
        ),
      },
      {
        id: 'both',
        label: L('Ikkovi ham: ikki formula ham yaraydi', 'Оба: обе формулы годятся', 'Both: either formula will do'),
        hint: L(
          "Beshda to'rt va o'n olti chiqdi. Ya'ni yozuvlardan bittasi boshlang'ichga teng emas.",
          'При пяти вышло четыре и шестнадцать. Значит одна из записей не равна исходной.',
          'At five it gave four and sixteen. So one of the records is not equal to the original.',
        ),
      },
      {
        id: 'none',
        label: L("Bu yerda formula ishlatilmaydi, oddiy ko'paytirish kerak", 'Формулу здесь применять нельзя, надо умножать в лоб', 'No formula applies here, plain multiplication is needed'),
        hint: L(
          "Oddiy ko'paytirish ham to'g'ri javob beradi, lekin formula xuddi shu javobni tezroq beradi.",
          'Обычное умножение тоже даёт верный ответ, но формула даёт тот же ответ быстрее.',
          'Plain multiplication gives the right answer too, but the formula gives the same answer faster.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bitta yozuv ikki xil formula bilan hisoblangan.", 'Одну запись посчитали по двум разным формулам.', 'One record was computed by two different formulas.'),
    A('mount', "Tabloda x besh bo'lgandagi qiymat turadi. Yozuvning o'zi o'n olti beradi.", 'На табло значение при x равном пяти. Сама запись даёт шестнадцать.', 'The boards show the value at x equal to five. The record itself gives sixteen.'),
    A('mount', "Kim to'g'ri formulani tanladi deb taxmin qilasiz.", 'Кто, по-твоему, выбрал верную формулу.', 'Who do you predict picked the right formula.'),
  ],
}

// ============================================================
// 2. TAYANCH. Uch formula, har biriga bittadan savol. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch formula', 'Три формулы', 'Three formulas'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: false,
      prompt: '(a + b)²',
      ok: L("Qavslar bir xil: o'rta had qo'shiladi.", 'Скобки одинаковые: средний член складывается.', 'Identical brackets: the middle term adds.'),
      items: [
        { id: 'a', label: 'a² + 2ab + b²', correct: true },
        { id: 'b', label: 'a² − 2ab + b²', tag: 'Z3', hint: L("Qavsda qo'shuv turgan edi.", 'В скобке было сложение.', 'The bracket had a plus.') },
        { id: 'c', label: 'a² − b²', tag: 'Z1', hint: L("Bu boshqa formula: unda qavslarning ishorasi boshqa.", 'Это другая формула: там знаки скобок разные.', 'That is another formula: there the bracket signs differ.') },
        { id: 'd', label: 'a² + b²', tag: 'Z2', hint: L("O'rta had tushib qoldi.", 'Средний член пропал.', 'The middle term is missing.') },
      ],
    },
    {
      wrap: false,
      prompt: '(a − b)(a + b)',
      ok: L("Ishoralar boshqa: o'rtadagilar yo'q bo'ladi.", 'Знаки разные: средние уничтожаются.', 'Different signs: the middle ones cancel.'),
      items: [
        { id: 'a', label: 'a² − b²', correct: true },
        { id: 'b', label: 'a² + b²', tag: 'Z3', hint: L("Oxirgi katakda minus b karra b turibdi.", 'В последней клетке минус b на b.', 'The last cell is minus b times b.') },
        { id: 'c', label: 'a² − 2ab + b²', tag: 'Z1', hint: L("Bu qavslar bir xil bo'lganda chiqadi.", 'Это выходит, когда скобки одинаковые.', 'That comes out when the brackets are identical.') },
        { id: 'd', label: 'a² − b', tag: 'Z6', hint: L("Ikkinchi had ham kvadratga ko'tariladi.", 'Второй член тоже возводится в квадрат.', 'The second term is squared too.') },
      ],
    },
    {
      wrap: false,
      prompt: '(a − b)²',
      ok: L("Qavslar bir xil: o'rta had ayiriladi.", 'Скобки одинаковые: средний член вычитается.', 'Identical brackets: the middle term subtracts.'),
      items: [
        { id: 'a', label: 'a² − 2ab + b²', correct: true },
        { id: 'b', label: 'a² − b²', tag: 'Z1', hint: L("Bu ishoralari boshqa qavslar uchun.", 'Это для скобок с разными знаками.', 'That is for brackets with different signs.') },
        { id: 'c', label: 'a² − 2ab − b²', tag: 'Z3', hint: L("Oxirgi katakda ikki minus bor.", 'В последней клетке два минуса.', 'The last cell has two minuses.') },
        { id: 'd', label: 'a² + 2ab + b²', tag: 'Z3', hint: L("Qavsda ayirish turgan edi.", 'В скобке было вычитание.', 'The bracket had a subtraction.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch formula, uch savol. Ular uch darsda o'rgatilgan.", 'Три формулы, три вопроса. Их проходили три урока.', 'Three formulas, three questions. They took three lessons.'),
    A('1', "Ikkinchisida qavslarning ishorasi boshqa.", 'Во втором знаки скобок разные.', 'In the second the bracket signs differ.'),
    A('2', "Uchinchisida qavslar bir xil.", 'В третьем скобки одинаковые.', 'In the third the brackets are identical.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. ZONALAR: to'rtinchi zona -- FORMULA YARAMAYDI.
// ============================================================
const S3 = {
  kind: 'sort',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Yozuvni formulaga bering', 'Отправь запись к формуле', 'Send each record to its formula'),
  zones: [
    { id: 'z1', label: L("Yig'indi kvadrati", 'Квадрат суммы', 'Square of a sum') },
    { id: 'z2', label: L('Ayirma kvadrati', 'Квадрат разности', 'Square of a difference') },
    { id: 'z3', label: L('Kvadratlar ayirmasi', 'Разность квадратов', 'Difference of squares') },
    { id: 'z4', label: L('Formula yaramaydi', 'Формула не подходит', 'No formula applies') },
  ],
  cards: [
    { id: 'c1', text: '(x + 5)²', zone: 'z1' },
    { id: 'c2', text: '(x − 5)²', zone: 'z2' },
    { id: 'c3', text: '(x − 5)(x + 5)', zone: 'z3' },
    { id: 'c4', text: '(x + 5)(x + 2)', zone: 'z4' },
  ],
  prompt: L(
    "To'rt yozuvni formulalarga tarqating. Bittasi hech qaysi formulaga to'g'ri kelmaydi.",
    'Раскинь четыре записи по формулам. Одна из них ни под какую не подходит.',
    'Sort the four records by formula. One of them fits none.',
  ),
  wrongs: [
    {
      tag: 'Z5',
      hint: L(
        "Qavslarga qarang: bir xil bo'lsa kvadrat; hadlar bir xil, ishora boshqa bo'lsa kvadratlar ayirmasi; sonlar boshqa bo'lsa formula yo'q.",
        'Смотри на скобки: одинаковые — квадрат; те же члены с разными знаками — разность квадратов; числа разные — формулы нет.',
        'Look at the brackets: identical means a square; the same terms with different signs means a difference of squares; different numbers means no formula.',
      ),
    },
  ],
  okNote: L(
    "Belgi QAVSLARDA ko'rinadi. Buning uchun hisoblash kerak emas.",
    'Признак виден в СКОБКАХ. Считать для этого не надо.',
    'The mark is visible in the BRACKETS. No computing is needed for it.',
  ),
  audio: [
    A('mount', "To'rt yozuv va to'rt zona. To'rtinchi zona alohida: unda formula yaramaydi.", 'Четыре записи и четыре зоны. Четвёртая зона особая: там формула не подходит.', 'Four records and four zones. The fourth zone is special: no formula applies there.'),
    A('mount', "Hisoblamang. Faqat qavslarga qarang.", 'Не считай. Просто посмотри на скобки.', 'Do not compute. Just look at the brackets.'),
    A('ok', "Belgi qavslarda: bir xilmi, ishoralari boshqami, sonlari boshqami.", 'Признак в скобках: одинаковы, разные знаки или разные числа.', 'The mark is in the brackets: identical, different signs, or different numbers.'),
  ],
}

// ============================================================
// 4. FARQLASH. BIR XIL qavslar: kataklar soni o'sha, natija boshqa.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Qavslar bir xil bo\'lsa', 'Если скобки одинаковые', 'When the brackets are identical'),
  caption: L(
    "Bu yerda qavslar bir xil. Kataklar yana to'rtta -- o'rtadagilariga qarang.",
    'Здесь скобки одинаковые. Клеток по-прежнему четыре — смотри на средние.',
    'Here the brackets are identical. Still four cells — watch the middle ones.',
  ),
  left: ['x', '−3'],
  top: ['x', '−3'],
  options: [
    { id: 'a', label: 'x² − 6x + 9' },
    { id: 'b', label: 'x² − 9' },
    { id: 'c', label: 'x² − 6x − 9' },
    { id: 'd', label: 'x² + 9' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Bunday javob qavslarning ishorasi boshqa bo'lganda chiqadi.", 'Такой ответ выходит, когда знаки скобок разные.', 'That answer appears when the bracket signs differ.') },
    { key: 'c', tag: 'Z3', hint: L("Oxirgi katakda minus uch karra minus uch, ya'ni musbat to'qqiz.", 'В последней клетке минус три на минус три, то есть плюс девять.', 'The last cell is minus three times minus three, that is plus nine.') },
    { key: 'd', tag: 'Z2', hint: L("O'rta ikki katak bo'sh emas, ikkovi ham manfiy uch x.", 'Две средние клетки не пусты, обе минус три x.', 'The two middle cells are not empty, both are minus three x.') },
  ],
  note: L(
    "Kataklar ikkovida ham to'rtta. Farq o'rtadagilarda: bir xil qavslarda ular qo'shiladi, ishoralari boshqa bo'lganda yo'q bo'ladi.",
    'Клеток и там и тут четыре. Разница в средних: у одинаковых скобок они складываются, у разных по знаку — уничтожаются.',
    'Four cells either way. The difference is in the middle ones: identical brackets add them, opposite signs cancel them.',
  ),
  audio: [
    A('mount', "Xukdagi yozuvga o'xshaydi, lekin ikkinchi qavsning ishorasi almashtirilgan.", 'Похоже на запись из хука, но знак второй скобки поменян.', 'It looks like the hook record, but the second bracket sign is flipped.'),
    A('mount', "To'rt katakni bosing va o'rtadagilarni solishtiring.", 'Нажми на четыре клетки и сравни средние.', 'Tap the four cells and compare the middle ones.'),
    A('cell-all', "O'rta kataklar ikkovi ham manfiy, demak ular qo'shiladi.", 'Обе средние клетки отрицательны, значит складываются.', 'Both middle cells are negative, so they add.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Belgi o'qildi -- javob bir qatorda.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Bir qatorda', 'Одной строкой', 'In a single line'),
  given: L(
    "Belgi o'qildi: hadlar bir xil, ishoralar boshqa. Demak kvadratlar ayirmasi.",
    'Признак прочитан: члены одинаковы, знаки разные. Значит разность квадратов.',
    'The mark is read: the same terms, different signs. So a difference of squares.',
  ),
  template: ['(2a − 5)(2a + 5)  =  ', { slot: 0 }, ' − ', { slot: 1 }],
  parts: [
    { id: 'a', label: '4a²' },
    { id: 'b', label: '25' },
    { id: 'c', label: '2a²' },
    { id: 'd', label: '10a' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Javobni bir qatorda yozing.",
    'Запиши ответ одной строкой.',
    'Write the answer in one line.',
  ),
  checkNote: L(
    "Ikki a ning kvadrati to'rt a kvadrat, beshning kvadrati yigirma besh. O'rtadagilar yo'q bo'ldi.",
    'Два a в квадрате это четыре a в квадрате, пять в квадрате двадцать пять. Средние уничтожились.',
    'Two a squared is four a squared, five squared is twenty five. The middle ones cancelled.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Ikki a karra ikki a to'rt a kvadrat beradi.", 'Два a на два a это четыре a в квадрате.', 'Two a times two a is four a squared.') },
    { key: 'd', tag: 'Z2', hint: L("O'rta ko'paytmalar yo'q bo'ldi, javobda a li had yo'q.", 'Средние произведения уничтожились, члена с a в ответе нет.', 'The middle products cancelled, there is no a term in the answer.') },
    { key: '*', tag: 'Z1', hint: L("Formula tanlangan: kvadratlar ayirmasi.", 'Формула выбрана: разность квадратов.', 'The formula is chosen: a difference of squares.') },
  ],
  audio: [
    A('mount', "Belgi o'qilgandan keyin to'rtburchak kerak emas. Javob bir qatorda yoziladi.", 'После того как признак прочитан, прямоугольник не нужен. Ответ пишется одной строкой.', 'Once the mark is read, the rectangle is not needed. The answer is written in one line.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. Yana zonalar, lekin koeffitsiyentlar bilan.
// ============================================================
const S6 = {
  kind: 'sort',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Koeffitsiyentlar bilan', 'С коэффициентами', 'With coefficients'),
  zones: [
    { id: 'z1', label: L("Yig'indi kvadrati", 'Квадрат суммы', 'Square of a sum') },
    { id: 'z2', label: L('Ayirma kvadrati', 'Квадрат разности', 'Square of a difference') },
    { id: 'z3', label: L('Kvadratlar ayirmasi', 'Разность квадратов', 'Difference of squares') },
    { id: 'z4', label: L('Formula yaramaydi', 'Формула не подходит', 'No formula applies') },
  ],
  cards: [
    { id: 'c1', text: '(2m + n)²', zone: 'z1' },
    { id: 'c2', text: '(y − 4)²', zone: 'z2' },
    { id: 'c3', text: '(2m − n)(2m + n)', zone: 'z3' },
    { id: 'c4', text: '(y + 4)(y + 3)', zone: 'z4' },
  ],
  prompt: L(
    "Koeffitsiyent belgini o'zgartirmaydi. Yana to'rt yozuvni tarqating.",
    'Коэффициент признака не меняет. Раскинь ещё четыре записи.',
    'A coefficient does not change the mark. Sort four more records.',
  ),
  wrongs: [
    {
      tag: 'Z5',
      hint: L(
        "Koeffitsiyentga qaramang. Qavslar bir xilmi, ishoralari boshqami, sonlari boshqami -- faqat shu muhim.",
        'Не смотри на коэффициент. Важно одно: скобки одинаковы, знаки разные или числа разные.',
        'Ignore the coefficient. Only this matters: identical brackets, different signs, or different numbers.',
      ),
    },
  ],
  okNote: L(
    "Belgi o'sha uchtaligicha qoldi, koeffitsiyent unga ta'sir qilmadi.",
    'Признак остался тем же, коэффициент на него не повлиял.',
    'The mark stayed the same, the coefficient did not affect it.',
  ),
  audio: [
    A('mount', "Endi yozuvlarda koeffitsiyentlar bor.", 'Теперь в записях есть коэффициенты.', 'Now the records have coefficients.'),
    A('mount', "Belgi esa o'zgarmaydi: qavslarga qarang.", 'А признак не меняется: смотри на скобки.', 'But the mark does not change: look at the brackets.'),
    A('ok', "Koeffitsiyent belgini o'zgartirmadi.", 'Коэффициент признака не изменил.', 'The coefficient did not change the mark.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH: formula YO'Q holat.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Formula yaramaydigan holat', 'Случай, где формулы нет', 'The case with no formula'),
  letter: 'x',
  numbers: [1, 2, 5],
  rows: [
    { id: 'r1', role: 'source', expr: '(x + 3)(x − 4)', sub: (n) => '(' + n + ' + 3)(' + n + ' − 4)', val: (n) => (n + 3) * (n - 4) },
    { id: 'r2', expr: 'x² − x − 12', sub: (n) => n + '² − ' + n + ' − 12', val: (n) => n * n - n - 12 },
  ],
  probe: {
    question: L(
      "Uch sonda ham qatorlar mos keldi. Bu javob qanday olingan?",
      'При всех трёх числах строки совпали. Как получен этот ответ?',
      'The rows matched at all three numbers. How was this answer obtained?',
    ),
    items: [
      {
        id: 'direct',
        correct: true,
        label: L("Oddiy ko'paytirish bilan: har had har hadga", 'Обычным умножением: каждый член на каждый', 'By plain multiplication: every term by every term'),
      },
      {
        id: 'diff',
        tag: 'Z1',
        label: L('Kvadratlar ayirmasi bilan', 'По разности квадратов', 'By the difference of squares'),
        hint: L(
          "Unga bir xil hadlar va boshqa ishoralar kerak, bu yerda esa uch va to'rt.",
          'Для неё нужны одинаковые члены с разными знаками, а здесь три и четыре.',
          'That needs the same terms with different signs, but here we have three and four.',
        ),
      },
      {
        id: 'sq',
        tag: 'Z1',
        label: L('Ayirmaning kvadrati bilan', 'По квадрату разности', 'By the square of a difference'),
        hint: L(
          "Uning uchun qavslar bir xil bo'lishi kerak.",
          'Для него скобки должны быть одинаковыми.',
          'That one needs identical brackets.',
        ),
      },
      {
        id: 'no',
        tag: 'Z2',
        label: L("Bunday ko'paytmani hisoblab bo'lmaydi", 'Такое произведение посчитать нельзя', 'Such a product cannot be computed'),
        hint: L(
          "Hisoblanadi va har doim: to'rt ko'paytma, keyin o'xshashlar.",
          'Считается всегда: четыре произведения, потом подобные.',
          'It always computes: four products, then the like terms.',
        ),
      },
    ],
  },
  okText: L(
    "Formula QISQA YO'L, yagona yo'l emas. Belgi bo'lmasa, oddiy ko'paytirish ishlaydi.",
    'Формула это КОРОТКИЙ путь, а не единственный. Когда признака нет, работает обычное умножение.',
    'A formula is a SHORTCUT, not the only way. With no mark, plain multiplication does the job.',
  ),
  audio: [
    A('mount', "Yuqorida ko'paytma, pastda javob. Formula bu yerda yaramaydi.", 'Сверху произведение, снизу ответ. Формула здесь не подходит.', 'Above the product, below the answer. No formula applies here.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Qatorlar mos keldi, demak javob to'g'ri.", 'Строки совпали, значит ответ верен.', 'The rows matched, so the answer is right.'),
  ],
}

// ============================================================
// 8. QOIDA. Belgi qanday o'qiladi.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z5',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('qavslar bir xil bo\'lsa -- kvadrat', 'скобки одинаковые — квадрат', 'identical brackets mean a square') },
    { id: 'f2', label: L("hadlar bir xil, ishora boshqa bo'lsa -- kvadratlar ayirmasi", 'те же члены с разными знаками — разность квадратов', 'same terms with different signs mean a difference of squares') },
    { id: 'f3', label: L("sonlar boshqa bo'lsa -- formula yo'q", 'числа разные — формулы нет', 'different numbers mean no formula') },
    { id: 'f4', label: L("unda har hadni har hadga ko'paytiramiz", 'тогда умножаем каждый член на каждый', 'then we multiply every term by every term') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval bir xil qavslar, keyin boshqa ishoralar, keyin formula yo'q holati, oxirida nima qilish kerakligi.",
    'Порядок нарушен. Сначала одинаковые скобки, потом разные знаки, потом случай без формулы, в конце что делать.',
    'The order is off. Identical brackets first, then different signs, then the no-formula case, and what to do last.',
  ),
  lawChips: [
    { label: '( )²', tone: 'par' },
    { label: '( ) ( )', tone: 'par' },
    { label: '−', tone: 's1' },
    { label: '·', tone: 's2' },
  ],
  lawSweep: L(
    "kvadrat, ikki qavs, ishora, ko'paytirish",
    'квадрат, две скобки, знак, умножение',
    'the square, two brackets, the sign, multiplication',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Formula yozuvning KO'RINISHIDAN tanladi, hisobdan emas: bir xil qavslar kvadratni beradi, bir xil hadlar boshqa ishora bilan esa kvadratlar ayirmasini.",
        'Формула узнаётся по ВИДУ записи, а не по счёту: одинаковые скобки дают квадрат, одинаковые члены с разными знаками — разность квадратов.',
        'A formula is recognised by the LOOK of the record, not by computing: identical brackets give a square, the same terms with different signs give a difference of squares.',
      ),
      L(
        "Belgi bo'lmasa, formula ham yo'q: ko'paytma oddiy qoida bilan hisoblanadi -- har had har hadga, keyin o'xshash hadlar ixchamlanadi.",
        'Если признака нет, формулы нет тоже: произведение считается обычным правилом — каждый член на каждый, потом приведение подобных.',
        'If the mark is absent, so is the formula: the product is computed by the ordinary rule — every term by every term, then collect like terms.',
      ),
    ],
  },
  hookCap: L(
    'Belgi qavslarda ko\'rinadi',
    'Признак виден по скобкам',
    'The mark shows in the brackets',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('bir xil qavslar', 'одинаковые скобки', 'identical brackets'),
    L('boshqa ishoralar', 'разные знаки', 'different signs'),
    L("belgi yo'q", 'признака нет', 'no mark'),
  ],
  audio: [
    A('mount', "Uch holatni ko'rdik va to'rtinchisini ham: formula yo'q holat. Endi qoidani yig'amiz.", 'Мы увидели три случая и четвёртый тоже: случай без формулы. Теперь соберём правило.', 'We have seen three cases and a fourth: the one with no formula. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda formulalar TESKARI tomonga ishlaydi.", 'Верно. На следующем уроке формулы заработают в обратную сторону.', 'Correct. Next lesson the formulas work in reverse.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Formulani tanlang', 'Выбери формулу', 'Choose the formula'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "(x − 8)(x + 8) uchun qaysi formula yaraydi?",
        'Какая формула подходит для (x − 8)(x + 8)?',
        'Which formula fits (x − 8)(x + 8)?',
      ),
      ok: L("Hadlar bir xil, ishoralar boshqa.", 'Члены одинаковы, знаки разные.', 'The same terms, different signs.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('kvadratlar ayirmasi', 'разность квадратов', 'the difference of squares'),
        },
        {
          id: 'b',
          tag: 'Z1',
          label: L('ayirmaning kvadrati', 'квадрат разности', 'the square of a difference'),
          hint: L("Buning uchun qavslar bir xil bo'lishi kerak.", 'Для него скобки должны быть одинаковыми.', 'That needs identical brackets.'),
        },
        {
          id: 'c',
          tag: 'Z1',
          label: L("yig'indining kvadrati", 'квадрат суммы', 'the square of a sum'),
          hint: L("Buning uchun ham qavslar bir xil bo'lishi kerak.", 'Для него скобки тоже должны быть одинаковыми.', 'That also needs identical brackets.'),
        },
        {
          id: 'd',
          tag: 'Z5',
          label: L("formula yo'q", 'формулы нет', 'no formula'),
          hint: L("Belgi bor: ikki qavsda ham x va sakkiz turibdi.", 'Признак есть: в обеих скобках x и восемь.', 'The mark is there: both brackets hold x and eight.'),
        },
      ],
    },
    {
      wrap: false,
      prompt: '(4x + 3)²',
      ok: L("Qavslar bir xil, koeffitsiyent kvadratga ko'tarildi.", 'Скобки одинаковые, коэффициент возведён в квадрат.', 'Identical brackets, and the coefficient got squared.'),
      items: [
        { id: 'a', label: '16x² + 24x + 9', correct: true },
        { id: 'b', label: '16x² + 9', tag: 'Z2', hint: L("O'rta had tushib qoldi.", 'Средний член пропал.', 'The middle term is missing.') },
        { id: 'c', label: '4x² + 24x + 9', tag: 'Z4', hint: L("To'rt x karra to'rt x o'n olti x kvadrat beradi.", 'Четыре x на четыре x это шестнадцать x в квадрате.', 'Four x times four x is sixteen x squared.') },
        { id: 'd', label: '16x² + 12x + 9', tag: 'Z2', hint: L("O'rta ko'paytma ikki marta olinadi.", 'Среднее произведение берётся дважды.', 'The middle product is taken twice.') },
      ],
    },
    {
      wrap: false,
      prompt: '(5 − y)(5 + y)',
      ok: L("Birinchi had beshlik, shuning uchun uning kvadrati oldinda turadi.", 'Первый член пятёрка, поэтому её квадрат стоит первым.', 'The first term is five, so its square comes first.'),
      items: [
        { id: 'a', label: '25 − y²', correct: true },
        { id: 'b', label: 'y² − 25', tag: 'Z3', hint: L("Birinchi kvadrat beshning kvadrati bo'ladi.", 'Первым стоит квадрат пятёрки.', 'The square of five comes first.') },
        { id: 'c', label: '25 + y²', tag: 'Z3', hint: L("Oxirgi katakda minus y karra y turibdi.", 'В последней клетке минус y на y.', 'The last cell is minus y times y.') },
        { id: 'd', label: '25 − 10y + y²', tag: 'Z1', hint: L("Bu qavslar bir xil bo'lganda chiqadi.", 'Это выходит, когда скобки одинаковые.', 'That comes out when the brackets are identical.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qaysi yozuv uchun formula yo'q?",
        'Для какой записи формулы нет?',
        'Which record has no formula?',
      ),
      ok: L("Sonlar boshqa: ikki va yetti. Belgi yo'q.", 'Числа разные: два и семь. Признака нет.', 'The numbers differ: two and seven. No mark.'),
      items: [
        { id: 'a', label: '(x + 2)(x + 7)', correct: true },
        { id: 'b', label: '(x + 2)(x − 2)', tag: 'Z5', hint: L("Hadlar bir xil, ishoralar boshqa: belgi bor.", 'Члены одинаковы, знаки разные: признак есть.', 'Same terms, different signs: the mark is there.') },
        { id: 'c', label: '(x + 7)²', tag: 'Z5', hint: L("Qavslar bir xil: bu kvadrat.", 'Скобки одинаковые: это квадрат.', 'Identical brackets: that is a square.') },
        { id: 'd', label: '(x − 7)²', tag: 'Z5', hint: L("Qavslar bir xil: bu ham kvadrat.", 'Скобки одинаковые: это тоже квадрат.', 'Identical brackets: that is a square too.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Birinchisi va oxirgisi belgi haqida.", 'Четыре вопроса. Первый и последний про признак.', 'Four questions. The first and last are about the mark.'),
    A('1', "Ikkinchisida koeffitsiyent bor.", 'Во втором есть коэффициент.', 'The second has a coefficient.'),
    A('2', "Uchinchisida son oldinda turibdi.", 'В третьем число стоит первым.', 'In the third the number comes first.'),
    A('3', "Oxirgisiga o'ylab javob bering.", 'На последний ответь подумав.', 'Think before answering the last one.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: javob, keyin FORMULANING NOMI.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ikki harf birga', 'Две буквы вместе', 'Two letters at once'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['(3m + 4n)(3m − 4n)  =  ', { slot: 0 }, ' − ', { slot: 1 }],
  parts: [
    { id: 'a', label: '9m²' },
    { id: 'b', label: '16n²' },
    { id: 'c', label: '3m²' },
    { id: 'd', label: '4n²' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Javobni yozing.",
    'Запиши ответ.',
    'Write the answer.',
  ),
  checkNote: L(
    "Uch m ning kvadrati to'qqiz m kvadrat, to'rt n ning kvadrati o'n olti n kvadrat.",
    'Три m в квадрате это девять m в квадрате, четыре n в квадрате это шестнадцать n в квадрате.',
    'Three m squared is nine m squared, four n squared is sixteen n squared.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Uch m karra uch m to'qqiz m kvadrat beradi.", 'Три m на три m это девять m в квадрате.', 'Three m times three m is nine m squared.') },
    { key: 'd', tag: 'Z4', hint: L("To'rt n karra to'rt n o'n olti n kvadrat beradi.", 'Четыре n на четыре n это шестнадцать n в квадрате.', 'Four n times four n is sixteen n squared.') },
    { key: '*', tag: 'Z4', hint: L("Koeffitsiyent ham kvadratga ko'tariladi.", 'Коэффициент тоже возводится в квадрат.', 'The coefficient is squared too.') },
  ],
  probe: {
    question: L('Qaysi formula qo\'llanildi?', 'Какая формула здесь применена?', 'Which formula was applied here?'),
    items: [
      {
        id: 'a',
        correct: true,
        label: L('kvadratlar ayirmasi', 'разность квадратов', 'the difference of squares'),
      },
      {
        id: 'b',
        tag: 'Z1',
        label: L("yig'indining kvadrati", 'квадрат суммы', 'the square of a sum'),
        hint: L("Qavslarning ishorasi boshqa, demak bu kvadrat emas.", 'Знаки скобок разные, значит это не квадрат.', 'The bracket signs differ, so this is not a square.'),
      },
      {
        id: 'c',
        tag: 'Z1',
        label: L('ayirmaning kvadrati', 'квадрат разности', 'the square of a difference'),
        hint: L("Buning uchun ikki qavs bir xil bo'lishi kerak.", 'Для него две скобки должны быть одинаковыми.', 'That needs the two brackets to be identical.'),
      },
      {
        id: 'd',
        tag: 'Z5',
        label: L("formula yo'q", 'формулы нет', 'no formula'),
        hint: L("Hadlar bir xil, ishoralar boshqa -- belgi bor.", 'Члены одинаковы, знаки разные — признак есть.', 'Same terms, different signs — the mark is there.'),
      },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval javob, keyin formulaning nomi.", 'Два шага. Сначала ответ, потом название формулы.', 'Two steps. The answer first, then the name of the formula.'),
    A('mount', "Ikki harf bor, va ikkovi ham kvadratga ko'tariladi.", 'Здесь две буквы, и обе возводятся в квадрат.', 'There are two letters, and both get squared.'),
    A('two', "Endi ikkinchi qadam: formulani ataylik.", 'Теперь второй шаг: назовём формулу.', 'Now the second step: let us name the formula.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Formula atalmaydi, belgi o'zi o'qiladi.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Formula atalmaydi', 'Формула не названа', 'The formula is not named'),
  template: ['(6 − x)²  =  36 ', { slot: 0 }, ' + x²'],
  parts: [
    { id: 'a', label: '− 12x' },
    { id: 'b', label: '+ 12x' },
    { id: 'c', label: '− 6x' },
    { id: 'd', label: '− 36x' },
  ],
  answer: ['a'],
  prompt: L(
    "Belgini o'zingiz o'qing va o'rta hadni yozing.",
    'Прочитай признак сам и запиши средний член.',
    'Read the mark yourself and write the middle term.',
  ),
  checkNote: L(
    "Qavslar bir xil, demak bu ayirmaning kvadrati. Ikki karra ko'paytma ikki karra olti karra x, ya'ni o'n ikki x, va u ayiriladi.",
    'Скобки одинаковые, значит это квадрат разности. Двойное произведение это два на шесть на x, то есть двенадцать x, и оно вычитается.',
    'Identical brackets, so this is a square of a difference. The double product is two by six by x, that is twelve x, and it is subtracted.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Qavsda ayirish turibdi, demak o'rta had manfiy.", 'В скобке вычитание, значит средний член отрицательный.', 'The bracket has a minus, so the middle term is negative.') },
    { key: 'c', tag: 'Z2', hint: L("Ko'paytma ikki marta olinadi.", 'Произведение берётся дважды.', 'The product is taken twice.') },
    { key: 'd', tag: 'Z6', hint: L("Ikki karra olti karra x o'n ikki x beradi.", 'Два на шесть на x это двенадцать x.', 'Two by six by x is twelve x.') },
  ],
  audio: [
    A('mount', "Bu safar formula atalmaydi. Belgini o'zingiz o'qiysiz.", 'На этот раз формула не названа. Признак читаешь сам.', 'This time the formula is not named. You read the mark yourself.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Belgi O'XSHASH, lekin sonlar BOSHQA: kvadratlar
// ayirmasi qo'llanib, o'rta hadlar tashlab ketilgan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Hisoblangan ikki ko'paytma to'g'ri. Shunday bo'lsa ham, qaysi qator xato?",
    'Оба посчитанных произведения верны. И всё же какая строка ошибочна?',
    'Both computed products are right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '(x + 4)(x − 5)' },
    { id: 'r2', text: 'x · x = x²' },
    { id: 'r3', text: '4 · (−5) = −20' },
    { id: 'r4', text: L("o'rta hadlar yo'q", 'средних членов нет', 'there are no middle terms') },
    { id: 'r5', text: L('javob: x² − 20', 'ответ: x² − 20', 'answer: x² − 20') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: x karra x x kvadrat beradi.", 'Верно: x на x это x в квадрате.', 'Right: x times x is x squared.'),
    r3: L("To'g'ri: to'rt karra minus besh minus yigirma beradi.", 'Верно: четыре на минус пять это минус двадцать.', 'Right: four times minus five is minus twenty.'),
    r5: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z5', r2: 'Z5', r3: 'Z5', r5: 'Z5' },
  proofFill: {
    template: ['x · (−5) + 4 · x  =  ', { slot: 0 }, '   →   x² − x − ', { slot: 1 }],
    parts: [
      { id: 'a', label: '− x' },
      { id: 'b', label: '20' },
      { id: 'c', label: '− 9x' },
      { id: 'd', label: '9' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "O'rta ko'paytmalarni hisoblang va javobni tuzating.",
      'Посчитай средние произведения и исправь ответ.',
      'Work out the middle products and fix the answer.',
    ),
    checkNote: L(
      "Minus besh x va musbat to'rt x birga minus x beradi. Qavslardagi sonlar boshqa, shuning uchun o'rtadagilar yo'q bo'lmaydi.",
      'Минус пять x и плюс четыре x дают минус x. Числа в скобках разные, поэтому средние не уничтожаются.',
      'Minus five x and plus four x give minus x. The numbers in the brackets differ, so the middle terms do not cancel.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z6', hint: L("Minus besh va musbat to'rt minus bir beradi.", 'Минус пять и плюс четыре дают минус один.', 'Minus five and plus four give minus one.') },
      { key: 'd', tag: 'Z6', hint: L("To'rt karra minus besh minus yigirma beradi.", 'Четыре на минус пять это минус двадцать.', 'Four times minus five is minus twenty.') },
      { key: '*', tag: 'Z5', hint: L("Kvadratlar ayirmasi uchun sonlar BIR XIL bo'lishi kerak.", 'Для разности квадратов числа должны быть ОДИНАКОВЫ.', 'A difference of squares needs the numbers to be the SAME.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda yozuv kvadratlar ayirmasiga o'xshaydi: bir qavsda qo'shuv, ikkinchisida ayirish.", 'В этой ловушке запись похожа на разность квадратов: в одной скобке плюс, в другой минус.', 'In this trap the record looks like a difference of squares: a plus in one bracket, a minus in the other.'),
    A('mount', "Lekin sonlar boshqa. Xato birinchi qaysi qatorda.", 'Но числа разные. В какой строке ошибка впервые.', 'But the numbers differ. Which line has the mistake first.'),
    A('proof', "Topdingiz. O'rta ko'paytmalar yo'q bo'lmadi, chunki sonlar boshqa.", 'Нашёл. Средние произведения не уничтожились, потому что числа разные.', 'You found it. The middle products did not cancel, because the numbers differ.'),
    A('done', "Belgi o'xshash bo'lishi yetarli emas: sonlar bir xil bo'lishi kerak.", 'Похожего признака недостаточно: числа должны быть одинаковыми.', 'A similar-looking mark is not enough: the numbers must be the same.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. YUZALAR: kvadrat maydon va to'rtburchak maydon.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Qaysi maydon kattaroq', 'Какой участок больше', 'Which plot is bigger'),
  given: L(
    "Tomoni x qo'shuv besh bo'lgan kvadrat maydon va x karra x qo'shuv o'n bo'lgan to'rtburchak maydon. Kvadrat qanchaga kattaroq?",
    'Квадратный участок со стороной x плюс пять и прямоугольный участок x на x плюс десять. Насколько квадрат больше?',
    'A square plot with side x plus five and a rectangular plot x by x plus ten. By how much is the square bigger?',
  ),
  // YOZUV QISQARTIRILDI: to'liq holida u 57 belgi edi, ikkinchi qatorga
  // tushardi va ekran balandligidan 28px oshib ketardi (o'lchov 2026-08-22,
  // 1366x615). O'rta qadam javobdan KEYINGI izohga ko'chdi -- u yerda joy bor.
  template: ['(x + 5)² − x(x + 10)  =  ', { slot: 0 }],
  parts: [
    { id: 'a', label: '25' },
    { id: 'b', label: '10x' },
    { id: 'c', label: '0' },
    { id: 'd', label: '25x' },
  ],
  answer: ['a'],
  prompt: L(
    "Farq nechchiga teng.",
    'Чему равна разница.',
    'What the difference equals.',
  ),
  checkNote: L(
    "Qavslar ochilsa x² + 10x + 25 − x² − 10x chiqadi. x li hadlar yo'q bo'ldi, yigirma besh qoldi. Ya'ni farq x ga BOG'LIQ EMAS.",
    'Раскроем скобки: x² + 10x + 25 − x² − 10x. Члены с x уничтожились, осталось двадцать пять. То есть разница НЕ ЗАВИСИТ от x.',
    'Expanding gives x² + 10x + 25 − x² − 10x. The x terms cancelled and twenty five remains. So the difference does NOT depend on x.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("O'n x va minus o'n x bir-birini yo'q qildi.", 'Десять x и минус десять x уничтожили друг друга.', 'Ten x and minus ten x cancelled each other.') },
    { key: 'c', tag: 'Z2', hint: L("Yigirma besh qoldi: ikkinchi maydonda unga mos had yo'q.", 'Двадцать пять осталось: во втором участке ему нет пары.', 'Twenty five remains: the second plot has nothing to match it.') },
    { key: 'd', tag: 'Z6', hint: L("Beshning kvadrati yigirma besh, va unda x yo'q.", 'Квадрат пяти это двадцать пять, и в нём нет x.', 'Five squared is twenty five, with no x in it.') },
  ],
  audio: [
    A('mount', "Ikki maydon. Ikkovining tomonlari x ga bog'liq, farqi esa yo'q.", 'Два участка. Стороны обоих зависят от x, а разница нет.', 'Two plots. Both sides depend on x, but the difference does not.'),
    A('mount', "Formulani qo'llang va x li hadlarga qarang.", 'Примени формулу и посмотри на члены с x.', 'Apply the formula and look at the x terms.'),
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
      prompt: '(x + 9)(x − 9)',
      ok: L("Hadlar bir xil, ishoralar boshqa.", 'Члены одинаковы, знаки разные.', 'Same terms, different signs.'),
      items: [
        { id: 'a', label: 'x² − 81', correct: true },
        { id: 'b', label: 'x² + 81', tag: 'Z3', hint: L("Oxirgi katakda to'qqiz karra minus to'qqiz.", 'В последней клетке девять на минус девять.', 'The last cell is nine times minus nine.') },
        { id: 'c', label: 'x² − 18x + 81', tag: 'Z1', hint: L("Bu qavslar bir xil bo'lganda chiqadi.", 'Это выходит, когда скобки одинаковые.', 'That comes out when the brackets are identical.') },
        { id: 'd', label: 'x² − 9', tag: 'Z6', hint: L("To'qqizning kvadrati sakson bir.", 'Квадрат девяти это восемьдесят один.', 'Nine squared is eighty one.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(2y − 3)²',
      ok: L("Qavslar bir xil: o'rta had bor va u manfiy.", 'Скобки одинаковые: средний член есть и он отрицательный.', 'Identical brackets: the middle term is there and negative.'),
      items: [
        { id: 'a', label: '4y² − 12y + 9', correct: true },
        { id: 'b', label: '4y² − 9', tag: 'Z1', hint: L("Bu ishoralari boshqa qavslar uchun.", 'Это для скобок с разными знаками.', 'That is for brackets with different signs.') },
        { id: 'c', label: '4y² − 12y − 9', tag: 'Z3', hint: L("Oxirgi katakda ikki minus bor.", 'В последней клетке два минуса.', 'The last cell has two minuses.') },
        { id: 'd', label: '2y² − 12y + 9', tag: 'Z4', hint: L("Ikki y karra ikki y to'rt y kvadrat beradi.", 'Два y на два y это четыре y в квадрате.', 'Two y times two y is four y squared.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qaysi yozuv uchun formula yo'q?",
        'Для какой записи формулы нет?',
        'Which record has no formula?',
      ),
      ok: L("Sonlar boshqa: olti va besh.", 'Числа разные: шесть и пять.', 'The numbers differ: six and five.'),
      items: [
        { id: 'a', label: '(a + 6)(a + 5)', correct: true },
        { id: 'b', label: '(a + 6)(a − 6)', tag: 'Z5', hint: L("Hadlar bir xil, ishoralar boshqa: belgi bor.", 'Члены одинаковы, знаки разные: признак есть.', 'Same terms, different signs: the mark is there.') },
        { id: 'c', label: '(a − 6)²', tag: 'Z5', hint: L("Qavslar bir xil: bu kvadrat.", 'Скобки одинаковые: это квадрат.', 'Identical brackets: that is a square.') },
        { id: 'd', label: '(a + 6)²', tag: 'Z5', hint: L("Qavslar bir xil: bu ham kvadrat.", 'Скобки одинаковые: это тоже квадрат.', 'Identical brackets: that is a square too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(3 − m)(3 + m) uchun qaysi formula yaraydi?",
        'Какая формула подходит для (3 − m)(3 + m)?',
        'Which formula fits (3 − m)(3 + m)?',
      ),
      ok: L("Hadlar bir xil, ishoralar boshqa. Birinchi kvadrat to'qqiz.", 'Члены одинаковы, знаки разные. Первый квадрат девять.', 'Same terms, different signs. The first square is nine.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('kvadratlar ayirmasi', 'разность квадратов', 'the difference of squares'),
        },
        {
          id: 'b',
          tag: 'Z1',
          label: L("yig'indining kvadrati", 'квадрат суммы', 'the square of a sum'),
          hint: L("Buning uchun qavslar bir xil bo'lishi kerak.", 'Для него скобки должны быть одинаковыми.', 'That needs identical brackets.'),
        },
        {
          id: 'c',
          tag: 'Z1',
          label: L('ayirmaning kvadrati', 'квадрат разности', 'the square of a difference'),
          hint: L("Buning uchun ham qavslar bir xil bo'lishi kerak.", 'Для него скобки тоже должны быть одинаковыми.', 'That also needs identical brackets.'),
        },
        {
          id: 'd',
          tag: 'Z5',
          label: L("formula yo'q", 'формулы нет', 'no formula'),
          hint: L("Ikki qavsda ham uch va m turibdi -- belgi bor.", 'В обеих скобках три и m — признак есть.', 'Both brackets hold three and m — the mark is there.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida qavslar bir xil.", 'Во втором скобки одинаковые.', 'In the second the brackets are identical.'),
    A('2', "Uchinchisi belgi haqida.", 'Третий про признак.', 'The third is about the mark.'),
    A('3', "Oxirgisida son oldinda turibdi.", 'В последнем число стоит первым.', 'In the last one the number comes first.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Belgi qavslarda', 'Признак в скобках', 'The mark is in the brackets'),
  gate: S1.gate,
  fix: {
    tokens: ['x²', '−', '9'],
    value: '16',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Qavslarda bir xil hadlar va boshqa ishoralar turgan edi, demak kvadratlar ayirmasi. Beshda o'n olti chiqadi, yozuvning o'zi kabi.",
    'В скобках стояли одинаковые члены с разными знаками, значит разность квадратов. При пяти выходит шестнадцать, как и у самой записи.',
    'The brackets held the same terms with different signs, so a difference of squares. At five it gives sixteen, just like the record.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    diff: L('kvadratlar ayirmasi', 'разность квадратов', 'the difference of squares'),
    sq: L('ayirmaning kvadrati', 'квадрат разности', 'the square of a difference'),
    both: L('ikkovi ham', 'обе', 'both of them'),
    none: L("formula ishlatilmaydi", 'формулу применять нельзя', 'no formula applies'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(x − 3)(x + 3) → x² − 9', '(x − 3)² → −6x', '(2a − 5)(2a + 5) → 4a²', '(x + 3)(x − 4) → ?'],
  twoLabel: L('B5 bloki davom etadi', 'Блок Б5 продолжается', 'Block B5 continues'),
  twoA: L(
    'qavslar bir xil  →  kvadrat',
    'скобки одинаковые  →  квадрат',
    'identical brackets  →  a square',
  ),
  twoB: L(
    "ishoralar boshqa  →  kvadratlar ayirmasi",
    'знаки разные  →  разность квадратов',
    'different signs  →  a difference of squares',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "formulalar bilan ko'paytuvchilarga ajratish",
    'разложение на множители по формулам',
    'factoring with the formulas',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugun yangi formula bo'lmadi. Yangisi -- formulani QAVSLARDAN tanish.", 'Сегодня новой формулы не было. Новое это узнавать формулу ПО СКОБКАМ.', 'There was no new formula today. What is new is recognising the formula BY THE BRACKETS.'),
    A('mount', "Keyingi darsda formulalar teskari tomonga ishlaydi: ko'phad ko'paytuvchilarga ajratiladi.", 'На следующем уроке формулы заработают в обратную сторону: многочлен разложится на множители.', 'Next lesson the formulas work in reverse: a polynomial gets factored.'),
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
