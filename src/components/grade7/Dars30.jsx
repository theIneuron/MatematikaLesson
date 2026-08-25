// ============================================================================
// 7-sinf, Dars 30. BUTUN IFODALARNI O'ZGARTIRISH.
// (Преобразование целых выражений)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// YANGI FORMULA YO'Q. Yangi narsa -- BITTA YOZUVDA BIR NECHA AMAL: ikki
// kvadratni ochish, qavs oldidagi minusni tarqatish va o'xshash hadlarni
// ixchamlash. Xatolar ham shu tartibda tug'iladi.
//
// ASOSIY XATO -- QAVS OLDIDAGI MINUS. 19-darsda u ustunda ko'rsatilgan edi:
// minus qavs ichidagi HAR hadning ishorasini almashtiradi. Bu yerda o'sha
// xato formulalar ustida qaytadi: `(x + 3)² − (x − 3)²` da ikkinchi
// kvadratning UCHTA hadi ham ishorasini almashtiradi.
//
// ASBOBLAR TAYYOR: yuza to'rtburchagi (ikki kvadratni ochish), son qo'yish
// (natija x ga bog'liq emasligini ko'rsatish) va yozuvni yig'ish.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_30'
const LESSON_TITLE = L("Butun ifodalarni o'zgartirish", 'Преобразование целых выражений', 'Transforming whole expressions')
const LESSON_NO = L('30-dars', 'Урок 30', 'Lesson 30')
const BLOCK = { label: L('B5-blok', 'Блок Б5', 'Block B5'), from: 25, to: 32, current: 30 }

const TAGS = {
  Z1: L('qavs oldidagi minus', 'минус перед скобкой', 'the minus before the bracket'),
  Z2: L("o'xshash hadlar ixchamlanmadi", 'подобные члены не приведены', 'the like terms were not collected'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L('koeffitsiyent bilan ish', 'работа с коэффициентом', 'work with the coefficient'),
  Z5: L('amallar tartibi', 'порядок действий', 'the order of operations'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Ikki kvadratning ayirmasi: 12x yoki nol.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("BIR NECHA AMAL BIRGA", 'НЕСКОЛЬКО ДЕЙСТВИЙ СРАЗУ', 'SEVERAL STEPS AT ONCE'),
  noBack: true,
  noNotes: true,
  title: L('Nol yoki nol emas', 'Ноль или не ноль', 'Zero or not zero'),
  gate: {
    source: { kind: 'plain', tokens: ['(x', '+', '3)²', '−', '(x', '−', '3)²'] },
    rows: [
      { tokens: ['0'], value: '0' },
      { tokens: ['12x'], value: '24' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Ikki kvadratning ayirmasi. Bittasi «bir xil narsalar ayiriladi, demak nol» dedi. Tabloda x ikki bo'lgandagi qiymat turadi, yozuvning o'zi esa yigirma to'rt beradi. Kim haq?",
      'Разность двух квадратов. Один сказал: вычитается почти одно и то же, значит ноль. На табло значение при x равном двум, а сама запись даёт двадцать четыре. Кто прав?',
      'A difference of two squares. One said: nearly the same thing is subtracted, so zero. The boards show the value at x equal to two, and the record itself gives twenty four. Who is right?',
    ),
    items: [
      {
        id: 'twelve',
        label: L('O\'n ikki x chiqqani', 'Тот, у кого двенадцать x', 'The one who got twelve x'),
        hint: L(
          "Taxminingiz qabul qilindi. Ikki kvadratni ochib tekshiramiz.",
          'Прогноз принят. Проверим, раскрыв оба квадрата.',
          'Your prediction is taken. We will check by expanding both squares.',
        ),
      },
      {
        id: 'zero',
        label: L('Nol chiqqani', 'Тот, у кого ноль', 'The one who got zero'),
        hint: L(
          "Qavslar bir xil emas: birida qo'shuv, ikkinchisida ayirish. Ikkida yigirma to'rt chiqadi.",
          'Скобки не одинаковые: в одной сложение, в другой вычитание. При двух выходит двадцать четыре.',
          'The brackets are not the same: one adds, the other subtracts. At two it gives twenty four.',
        ),
      },
      {
        id: 'nine',
        label: L('Faqat sonlar qoladi', 'Останутся только числа', 'Only numbers will remain'),
        hint: L(
          "Bu safar sonlar yo'q bo'ladi, x li hadlar esa qoladi. Buni ochib ko'rsatamiz.",
          'На этот раз исчезнут числа, а члены с x останутся. Мы это покажем.',
          'This time the numbers cancel and the x terms stay. We will show it.',
        ),
      },
      {
        id: 'cant',
        label: L('Bunday ifodani o\'zgartirib bo\'lmaydi', 'Такое выражение преобразовать нельзя', 'Such an expression cannot be transformed'),
        hint: L(
          "Har kvadratni formulaga ko'ra ochish mumkin, keyin o'xshash hadlar ixchamlanadi.",
          'Каждый квадрат раскрывается по формуле, потом приводятся подобные.',
          'Each square expands by the formula, then the like terms are collected.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki kvadratning ayirmasi. Qavslar deyarli bir xil.", 'Разность двух квадратов. Скобки почти одинаковые.', 'A difference of two squares. The brackets are nearly the same.'),
    A('mount', "Bittasi nol dedi, ikkinchisi o'n ikki x dedi. Tabloda x ikki bo'lgandagi qiymat.", 'Один сказал ноль, другой двенадцать x. На табло значение при x равном двум.', 'One said zero, the other twelve x. The boards show the value at x equal to two.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Ikki formula va qavs oldidagi minus. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: false,
      prompt: '(x + 3)²',
      ok: L("Uch had, o'rtadagisi ikki karra ko'paytma.", 'Три члена, средний двойное произведение.', 'Three terms, the middle one the double product.'),
      items: [
        { id: 'a', label: 'x² + 6x + 9', correct: true },
        { id: 'b', label: 'x² + 9', tag: 'Z2', hint: L("O'rta had tushib qoldi.", 'Средний член пропал.', 'The middle term is missing.') },
        { id: 'c', label: 'x² + 3x + 9', tag: 'Z2', hint: L("Ko'paytma ikki marta olinadi.", 'Произведение берётся дважды.', 'The product is taken twice.') },
        { id: 'd', label: 'x² − 6x + 9', tag: 'Z3', hint: L("Qavsda qo'shuv turgan edi.", 'В скобке было сложение.', 'The bracket had a plus.') },
      ],
    },
    {
      wrap: false,
      prompt: '−(a − 5)',
      ok: L("Minus qavs ichidagi har hadning ishorasini almashtiradi.", 'Минус меняет знак каждого члена в скобке.', 'The minus flips the sign of every term in the bracket.'),
      items: [
        { id: 'a', label: '−a + 5', correct: true },
        { id: 'b', label: '−a − 5', tag: 'Z1', hint: L("Beshlik oldidagi ishora ham almashadi.", 'Знак перед пятёркой тоже меняется.', 'The sign before the five flips as well.') },
        { id: 'c', label: 'a − 5', tag: 'Z1', hint: L("Birinchi hadning ishorasi ham almashadi.", 'Знак первого члена тоже меняется.', 'The sign of the first term flips too.') },
        { id: 'd', label: 'a + 5', tag: 'Z1', hint: L("Minus ikkala hadga ham boradi, faqat bittasiga emas.", 'Минус доходит до обоих членов, а не до одного.', 'The minus reaches both terms, not just one.') },
      ],
    },
    {
      wrap: false,
      prompt: '5x² − 3x² + x²',
      ok: L("Hamma had o'xshash, koeffitsiyentlar ishorasi bilan qo'shildi.", 'Все члены подобны, коэффициенты сложились со знаками.', 'All the terms are alike, and the coefficients added with their signs.'),
      items: [
        { id: 'a', label: '3x²', correct: true },
        { id: 'b', label: 'x²', tag: 'Z3', hint: L("Oxirgi had oldida qo'shuv turibdi.", 'Перед последним членом сложение.', 'The last term has a plus before it.') },
        { id: 'c', label: '3x⁶', tag: 'Z4', hint: L("Qo'shishda ko'rsatkich o'zgarmaydi.", 'При сложении показатель не меняется.', 'Adding does not change the exponent.') },
        { id: 'd', label: '9x²', tag: 'Z3', hint: L("Ikkinchi had ayiriladi.", 'Второй член вычитается.', 'The second term is subtracted.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Ikkinchisi bugungi darsning eng nozik joyi.", 'Три коротких вопроса. Второй это самое тонкое место урока.', 'Three short questions. The second is the delicate spot of the lesson.'),
    A('1', "Ikkinchisida qavs oldida minus turibdi.", 'Во втором перед скобкой стоит минус.', 'In the second a minus stands before the bracket.'),
    A('2', "Uchinchisi o'xshash hadlar haqida.", 'Третий про подобные члены.', 'The third is about like terms.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. BIRINCHI KVADRATNI OCHAMIZ.
// ============================================================
const S3 = {
  kind: 'grid',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Birinchi kvadrat', 'Первый квадрат', 'The first square'),
  caption: L(
    "Birinchi qavsni ochamiz. To'rt katakni bosing.",
    'Раскроем первую скобку. Нажми на четыре клетки.',
    'Let us expand the first bracket. Tap the four cells.',
  ),
  left: ['x', '+3'],
  top: ['x', '+3'],
  options: [
    { id: 'a', label: 'x² + 6x + 9' },
    { id: 'b', label: 'x² + 9' },
    { id: 'c', label: 'x² + 3x + 9' },
    { id: 'd', label: 'x² + 6x + 6' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("O'rta ikki katak bo'sh qoldi.", 'Две средние клетки остались пустыми.', 'The two middle cells stayed empty.') },
    { key: 'c', tag: 'Z2', hint: L("x karra uch katagi ikkita.", 'Клеток с x на три две.', 'There are two x times three cells.') },
    { key: 'd', tag: 'Z6', hint: L("Oxirgi katakda uch karra uch, ya'ni to'qqiz.", 'В последней клетке три на три, то есть девять.', 'The last cell is three times three, that is nine.') },
  ],
  note: L(
    "Birinchi qism tayyor. Ikkinchi qavs ham ochiladi, lekin uning oldida MINUS turadi.",
    'Первая часть готова. Вторая скобка тоже раскроется, но перед ней стоит МИНУС.',
    'The first part is done. The second bracket expands too, but a MINUS stands before it.',
  ),
  audio: [
    A('mount', "Ishni bo'lib bajaramiz: avval birinchi kvadratni ochamiz.", 'Работу разделим: сначала раскроем первый квадрат.', 'Let us split the work: expand the first square first.'),
    A('mount', "To'rt katakni bosing.", 'Нажми на четыре клетки.', 'Tap the four cells.'),
    A('cell-all', "Birinchi qism tayyor: uch had.", 'Первая часть готова: три члена.', 'The first part is done: three terms.'),
  ],
}

// ============================================================
// 4. FARQLASH. IKKINCHI KVADRAT: o'rta had manfiy, va u ham
// MINUS bilan ayiriladi -- ya'ni ishoralar IKKI MARTA o'zgaradi.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Ikkinchi kvadrat', 'Второй квадрат', 'The second square'),
  caption: L(
    "Endi ikkinchi qavsni ochamiz. Uning oldida minus turganini eslab turing.",
    'Теперь раскроем вторую скобку. Помни, что перед ней стоит минус.',
    'Now the second bracket. Remember the minus standing before it.',
  ),
  left: ['x', '−3'],
  top: ['x', '−3'],
  options: [
    { id: 'a', label: 'x² − 6x + 9' },
    { id: 'b', label: 'x² − 6x − 9' },
    { id: 'c', label: 'x² − 9' },
    { id: 'd', label: 'x² + 6x + 9' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Oxirgi katakda ikki minus bor, ular musbat beradi.", 'В последней клетке два минуса, они дают плюс.', 'The last cell has two minuses, they give a plus.') },
    { key: 'c', tag: 'Z2', hint: L("O'rta ikki katak bo'sh emas.", 'Две средние клетки не пусты.', 'The two middle cells are not empty.') },
    { key: 'd', tag: 'Z3', hint: L("O'rta kataklarda bittadan minus bor.", 'В средних клетках по одному минусу.', 'The middle cells have one minus each.') },
  ],
  note: L(
    "Ikkinchi qism ham uch hadli. Endi eng nozik joy: bu UCH HAD MINUS bilan ayiriladi, ya'ni ularning HAMMASI ishorasini almashtiradi.",
    'Вторая часть тоже трёхчлен. Теперь самое тонкое: этот ТРЁХЧЛЕН вычитается с минусом, то есть ВСЕ его члены меняют знак.',
    'The second part is a trinomial too. Now the delicate bit: this TRINOMIAL is subtracted, so ALL of its terms change sign.',
  ),
  audio: [
    A('mount', "Ikkinchi qavs birinchisidan faqat ishora bilan farq qiladi.", 'Вторая скобка отличается от первой только знаком.', 'The second bracket differs from the first only in sign.'),
    A('mount', "To'rt katakni bosing va o'rtadagilarga qarang.", 'Нажми на четыре клетки и посмотри на средние.', 'Tap the four cells and look at the middle ones.'),
    A('cell-all', "Uch had chiqdi. Lekin ularning oldida minus turibdi.", 'Вышло три члена. Но перед ними стоит минус.', 'Three terms came out. But a minus stands before them.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. MINUSNI TARQATISH: uch hadning hammasi
// ishorasini almashtiradi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("ENG NOZIK QADAM", 'САМЫЙ ТОНКИЙ ШАГ', 'THE DELICATE STEP'),
  title: L('Minus uch hadga', 'Минус на три члена', 'A minus onto three terms'),
  lines: ['x² + 6x + 9 − (x² − 6x + 9)'],
  template: ['=  x² + 6x + 9 − x² ', { slot: 0 }, ' 6x ', { slot: 1 }, ' 9'],
  parts: [
    { id: 'a', label: '+' },
    { id: 'b', label: '−' },
    { id: 'c', label: '·' },
    { id: 'd', label: '+ 6' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Qavs ochilganda uch hadning ishorasi qanday bo'ladi.",
    'Какими станут знаки трёх членов при раскрытии скобки.',
    'What the signs of the three terms become when the bracket opens.',
  ),
  checkNote: L(
    "Minus har hadning ishorasini almashtirdi: x kvadrat manfiy, minus olti x musbat, to'qqiz manfiy bo'ldi.",
    'Минус поменял знак каждого члена: x в квадрате стал отрицательным, минус шесть x положительным, девять отрицательным.',
    'The minus flipped every sign: x squared became negative, minus six x became positive, nine became negative.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z5', hint: L("Bu qo'shish va ayirish, ko'paytirish emas.", 'Это сложение и вычитание, а не умножение.', 'This is adding and subtracting, not multiplying.') },
    { key: 'd', tag: 'Z6', hint: L("Hadning o'zi o'zgarmaydi, faqat ishorasi almashadi.", 'Сам член не меняется, меняется только знак.', 'The term itself does not change, only its sign.') },
    { key: '*', tag: 'Z1', hint: L("Qavs oldidagi minus HAR hadga boradi.", 'Минус перед скобкой доходит до КАЖДОГО члена.', 'The minus before the bracket reaches EVERY term.') },
  ],
  audio: [
    A('mount', "Ikki qism ochildi. Endi ularni ayirish kerak.", 'Обе части раскрыты. Теперь их надо вычесть.', 'Both parts are expanded. Now they must be subtracted.'),
    A('mount', "Qavs oldidagi minus uch hadning hammasiga boradi.", 'Минус перед скобкой доходит до всех трёх членов.', 'The minus before the bracket reaches all three terms.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. O'XSHASH HADLARNI IXCHAMLASH: nima yo'q bo'ladi.
// ============================================================
const S6 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Nima yo\'q bo\'ladi', 'Что уничтожится', 'What cancels'),
  lines: ['x² + 6x + 9 − x² + 6x − 9'],
  template: ['=  ', { slot: 0 }],
  parts: [
    { id: 'a', label: '12x' },
    { id: 'b', label: '0' },
    { id: 'c', label: '2x² + 12x' },
    { id: 'd', label: '12x + 18' },
  ],
  answer: ['a'],
  prompt: L(
    "O'xshash hadlarni ixchamlang.",
    'Приведи подобные члены.',
    'Collect the like terms.',
  ),
  checkNote: L(
    "x kvadrat va minus x kvadrat yo'q bo'ldi, to'qqiz va minus to'qqiz ham. Olti x va olti x esa qo'shildi.",
    'x в квадрате и минус x в квадрате уничтожились, девять и минус девять тоже. А шесть x и шесть x сложились.',
    'x squared and minus x squared cancelled, nine and minus nine too. And six x and six x added.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Olti x va olti x yo'q bo'lmaydi: ularning ishorasi bir xil, demak qo'shiladi.", 'Шесть x и шесть x не уничтожаются: у них одинаковый знак, значит складываются.', 'Six x and six x do not cancel: same sign, so they add.') },
    { key: 'c', tag: 'Z3', hint: L("Ikkinchi x kvadrat manfiy, ular yo'q bo'ladi.", 'Второй x в квадрате отрицательный, они уничтожаются.', 'The second x squared is negative, so they cancel.') },
    { key: 'd', tag: 'Z3', hint: L("To'qqiz va minus to'qqiz nol beradi.", 'Девять и минус девять дают ноль.', 'Nine and minus nine give zero.') },
  ],
  audio: [
    A('mount', "Endi oxirgi qadam: o'xshash hadlarni ixchamlash.", 'Теперь последний шаг: привести подобные члены.', 'Now the last step: collect the like terms.'),
    A('mount', "Diqqat: bir xil ishorali hadlar qo'shiladi, qarama-qarshi ishorali hadlar yo'q bo'ladi.", 'Внимание: члены с одинаковым знаком складываются, с противоположным уничтожаются.', 'Careful: terms with the same sign add, terms with opposite signs cancel.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: natija x GA BOG'LIQ EMAS.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Javobda x yo\'q', 'В ответе нет x', 'No x in the answer'),
  letter: 'x',
  numbers: [1, 2, 5],
  rows: [
    { id: 'r1', role: 'source', expr: '(x + 3)(x − 3) − x²', sub: (n) => '(' + n + ' + 3)(' + n + ' − 3) − ' + n + '²', val: (n) => (n + 3) * (n - 3) - n * n },
    { id: 'r2', expr: '−9', sub: () => '−9', val: () => -9 },
  ],
  probe: {
    question: L(
      "Uch xil sonda ham bir xil javob chiqdi. Bu nima degani?",
      'При трёх разных числах вышел один и тот же ответ. Что это значит?',
      'Three different numbers gave the same answer. What does that mean?',
    ),
    items: [
      {
        id: 'const',
        correct: true,
        label: L("x li hadlar yo'q bo'ldi, faqat son qoldi", 'Члены с x уничтожились, осталось только число', 'The x terms cancelled and only a number is left'),
      },
      {
        id: 'luck',
        tag: 'Z5',
        label: L('Tasodif', 'Совпадение', 'A coincidence'),
        hint: L(
          "Uch xil son sinaldi va uchtasida ham bir xil chiqdi.",
          'Проверили три разных числа, и при всех трёх вышло одинаково.',
          'Three different numbers were tried, and all three gave the same.',
        ),
      },
      {
        id: 'zero',
        tag: 'Z2',
        label: L("x nolga teng bo'lgan", 'Значит x равен нулю', 'It means x equals zero'),
        hint: L(
          "x bir, ikki va besh edi, lekin javob o'zgarmadi.",
          'x был один, два и пять, но ответ не менялся.',
          'x was one, two and five, and the answer never changed.',
        ),
      },
      {
        id: 'err',
        tag: 'Z6',
        label: L('Hisobda xato bor', 'Есть ошибка в счёте', 'There is a slip in the arithmetic'),
        hint: L(
          "Birda to'rt karra minus ikki minus sakkiz, undan bir ayirilsa minus to'qqiz chiqadi.",
          'При единице четыре на минус два это минус восемь, минус один даёт минус девять.',
          'At one, four times minus two is minus eight, and minus one gives minus nine.',
        ),
      },
    ],
  },
  okText: L(
    "Ba'zi ifodalarda x li hadlarning hammasi yo'q bo'ladi. Unda qiymat harfga BOG'LIQ EMAS.",
    'В некоторых выражениях все члены с x уничтожаются. Тогда значение НЕ ЗАВИСИТ от буквы.',
    'In some expressions every x term cancels. Then the value does NOT depend on the letter.',
  ),
  audio: [
    A('mount', "Yuqorida ifoda, pastda esa oddiy son.", 'Сверху выражение, снизу просто число.', 'Above an expression, below just a number.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Javob o'zgarmadi.", 'Ответ не изменился.', 'The answer did not change.'),
  ],
}

// ============================================================
// 8. QOIDA. TARTIB.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z5',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('avval qavslarni formulalar bilan ochamiz', 'сначала раскрываем скобки по формулам', 'first we expand the brackets by the formulas') },
    { id: 'f2', label: L("keyin qavs oldidagi minusni tarqatamiz", 'потом разносим минус перед скобкой', 'then we spread the minus before the bracket') },
    { id: 'f3', label: L("so'ngra o'xshash hadlarni ixchamlaymiz", 'затем приводим подобные члены', 'then we collect the like terms') },
    { id: 'f4', label: L('va javobni yozamiz', 'и записываем ответ', 'and write the answer') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval qavslar, keyin minus, keyin o'xshash hadlar, oxirida javob.",
    'Порядок нарушен. Сначала скобки, потом минус, потом подобные, в конце ответ.',
    'The order is off. Brackets first, then the minus, then the like terms, and the answer last.',
  ),
  lawChips: [
    { label: '( )²', tone: 'par' },
    { label: '−', tone: 's1' },
    { label: '+', tone: 's1' },
    { label: '·', tone: 's2' },
  ],
  lawSweep: L(
    "qavs, minus, qo'shish, ko'paytirish",
    'скобка, минус, сложение, умножение',
    'the bracket, the minus, adding, multiplying',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Butun ifodani o'zgartirish uchun avval qavslar ochiladi -- kerak bo'lsa formulalar bilan, so'ngra o'xshash hadlar ixchamlanadi.",
        'Чтобы преобразовать целое выражение, сначала раскрывают скобки — где нужно, по формулам, а затем приводят подобные члены.',
        'To transform a whole expression, first expand the brackets — by the formulas where needed — and then collect the like terms.',
      ),
      L(
        "Qavs oldida minus turgan bo'lsa, u qavs ichidagi HAR hadning ishorasini almashtiradi. Ba'zan harfli hadlarning hammasi yo'q bo'ladi va javob sonli bo'lib qoladi.",
        'Если перед скобкой стоит минус, он меняет знак КАЖДОГО члена внутри. Иногда все буквенные члены уничтожаются, и ответ становится числом.',
        'If a minus stands before the bracket, it flips the sign of EVERY term inside. Sometimes all the letter terms cancel and the answer becomes a number.',
      ),
    ],
  },
  hookCap: L(
    'Minus qavs ichidagi hamma hadga boradi',
    'Минус доходит до всех членов в скобке',
    'The minus reaches every term in the bracket',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('avval qavslar', 'сначала скобки', 'brackets first'),
    L('keyin minus', 'потом минус', 'then the minus'),
    L("oxirida o'xshashlar", 'в конце подобные', 'like terms last'),
  ],
  audio: [
    A('mount', "Uch qadamni bajardik. Endi tartibni qoida qilib yozamiz.", 'Три шага мы сделали. Теперь запишем порядок правилом.', 'We have done the three steps. Now let us write the order as a rule.'),
    A('ok', "To'g'ri. Keyingi darsda yana bir juft formula qo'shiladi.", 'Верно. На следующем уроке добавится ещё пара формул.', 'Correct. Next lesson adds one more pair of formulas.'),
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
      prompt: '(a + 4)² − (a − 4)²',
      ok: L("Kvadratlar va sonlar yo'q bo'ldi, ikki o'rta had qo'shildi.", 'Квадраты и числа уничтожились, два средних члена сложились.', 'The squares and the numbers cancelled, the two middle terms added.'),
      items: [
        { id: 'a', label: '16a', correct: true },
        { id: 'b', label: '0', tag: 'Z1', hint: L("Ikkinchi qavsning o'rta hadi manfiy, minus esa uni musbat qiladi.", 'Средний член второй скобки отрицательный, а минус делает его положительным.', 'The middle term of the second bracket is negative, and the minus makes it positive.') },
        { id: 'c', label: '8a', tag: 'Z1', hint: L("O'rta hadlar ikkita: sakkiz a va yana sakkiz a.", 'Средних членов два: восемь a и ещё восемь a.', 'There are two middle terms: eight a and eight a again.') },
        { id: 'd', label: '2a² + 16a', tag: 'Z3', hint: L("Ikkinchi a kvadrat manfiy bo'ladi, ular yo'q bo'ladi.", 'Второй a в квадрате будет отрицательным, они уничтожаются.', 'The second a squared is negative, they cancel.') },
      ],
    },
    {
      wrap: false,
      prompt: '(x + 2)² − x²',
      ok: L("x kvadratlar yo'q bo'ldi, qolgani o'rta had va son.", 'x в квадрате уничтожились, остались средний член и число.', 'The x squares cancelled, leaving the middle term and the number.'),
      items: [
        { id: 'a', label: '4x + 4', correct: true },
        { id: 'b', label: '4', tag: 'Z2', hint: L("O'rta had qoladi: to'rt x.", 'Средний член остаётся: четыре x.', 'The middle term stays: four x.') },
        { id: 'c', label: '2x² + 4x + 4', tag: 'Z3', hint: L("Ikkinchi x kvadrat ayiriladi, demak ular yo'q bo'ladi.", 'Второй x в квадрате вычитается, значит они уничтожаются.', 'The second x squared is subtracted, so they cancel.') },
        { id: 'd', label: '4x', tag: 'Z2', hint: L("Ikkining kvadrati ham qoladi.", 'Квадрат двух тоже остаётся.', 'The square of two stays too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qavs oldidagi minus uch hadli qavsda nechta ishorani almashtiradi?",
        'Сколько знаков меняет минус перед скобкой из трёх членов?',
        'How many signs does a minus before a three term bracket flip?',
      ),
      ok: L("Har hadning ishorasi almashadi, ya'ni uchta.", 'Знак каждого члена меняется, то есть три.', 'Every term flips, so three.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '1', tag: 'Z1', hint: L("Minus faqat birinchi hadga emas, hammasiga boradi.", 'Минус доходит не только до первого члена, а до всех.', 'The minus reaches not only the first term but all of them.') },
        { id: 'c', label: '2', tag: 'Z1', hint: L("Uchinchi hadning ishorasi ham almashadi.", 'Знак третьего члена тоже меняется.', 'The third term flips too.') },
        { id: 'd', label: '0', tag: 'Z1', hint: L("Minus qavs oldida turibdi, u ta'sir qiladi.", 'Минус стоит перед скобкой, он действует.', 'The minus stands before the bracket and it acts.') },
      ],
    },
    {
      wrap: false,
      prompt: '(2x − 1)² − 4x²',
      ok: L("To'rt x kvadratlar yo'q bo'ldi.", 'Четыре x в квадрате уничтожились.', 'The four x squared cancelled.'),
      items: [
        { id: 'a', label: '−4x + 1', correct: true },
        { id: 'b', label: '4x + 1', tag: 'Z3', hint: L("O'rta had manfiy edi: minus to'rt x.", 'Средний член был отрицательным: минус четыре x.', 'The middle term was negative: minus four x.') },
        { id: 'c', label: '8x² − 4x + 1', tag: 'Z3', hint: L("To'rt x kvadrat ayiriladi, demak ular yo'q bo'ladi.", 'Четыре x в квадрате вычитается, значит они уничтожаются.', 'Four x squared is subtracted, so they cancel.') },
        { id: 'd', label: '−4x', tag: 'Z2', hint: L("Birning kvadrati ham qoladi.", 'Квадрат единицы тоже остаётся.', 'The square of one stays too.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Uchinchisi minus haqida.", 'Четыре вопроса. Третий про минус.', 'Four questions. The third is about the minus.'),
    A('1', "Ikkinchisida ikkinchi qavs oddiy kvadrat.", 'Во втором вторая скобка это простой квадрат.', 'In the second the second part is a plain square.'),
    A('2', "Uchinchisiga o'ylab javob bering.", 'На третий ответь подумав.', 'Think before answering the third.'),
    A('3', "Oxirgisida koeffitsiyent bor.", 'В последнем есть коэффициент.', 'The last one has a coefficient.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: ochish, keyin ixchamlash.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ikki qadamda', 'В два шага', 'In two steps'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['(3x + 1)² − 9x²  =  9x² + ', { slot: 0 }, ' + 1 − ', { slot: 1 }],
  parts: [
    { id: 'a', label: '6x' },
    { id: 'b', label: '9x²' },
    { id: 'c', label: '3x' },
    { id: 'd', label: '3x²' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Kvadratni ochib yozing va ayiriladigan hadni ko'chiring.",
    'Раскрой квадрат и перенеси вычитаемый член.',
    'Expand the square and carry over the subtracted term.',
  ),
  checkNote: L(
    "Ikki karra uch x karra bir olti x beradi. Ayiriladigan had esa to'qqiz x kvadrat bo'lib qoladi.",
    'Два на три x на один это шесть x. А вычитаемый член так и остаётся девять x в квадрате.',
    'Two by three x by one is six x. And the subtracted term stays nine x squared.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z2', hint: L("Ko'paytma ikki marta olinadi.", 'Произведение берётся дважды.', 'The product is taken twice.') },
    { key: 'd', tag: 'Z4', hint: L("Uch x karra uch x to'qqiz x kvadrat beradi.", 'Три x на три x это девять x в квадрате.', 'Three x times three x is nine x squared.') },
    { key: '*', tag: 'Z4', hint: L("Koeffitsiyent ham kvadratga ko'tariladi.", 'Коэффициент тоже возводится в квадрат.', 'The coefficient is squared too.') },
  ],
  probe: {
    question: L("Ixchamlagandan keyin javob qanday bo'ladi?", 'Каким будет ответ после приведения?', 'What will the answer be after collecting?'),
    items: [
      { id: 'a', correct: true, label: '6x + 1' },
      { id: 'b', tag: 'Z3', label: '18x² + 6x + 1', hint: L("To'qqiz x kvadrat ayiriladi, demak ular yo'q bo'ladi.", 'Девять x в квадрате вычитается, значит они уничтожаются.', 'Nine x squared is subtracted, so they cancel.') },
      { id: 'c', tag: 'Z2', label: '6x', hint: L("Birning kvadrati qoladi.", 'Квадрат единицы остаётся.', 'The square of one stays.') },
      { id: 'd', tag: 'Z2', label: '1', hint: L("O'rta had ham qoladi.", 'Средний член тоже остаётся.', 'The middle term stays too.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval kvadratni ochish, keyin ixchamlash.", 'Два шага. Сначала раскрыть квадрат, потом привести.', 'Two steps. Expand the square first, then collect.'),
    A('mount', "Diqqat: ayiriladigan had ham to'qqiz x kvadrat.", 'Внимание: вычитаемый член тоже девять x в квадрате.', 'Careful: the subtracted term is nine x squared too.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Uchta qadam birga', 'Три шага сразу', 'Three steps at once'),
  template: ['(y − 5)² + 10y  =  ', { slot: 0 }, ' + ', { slot: 1 }],
  parts: [
    { id: 'a', label: 'y²' },
    { id: 'b', label: '25' },
    { id: 'c', label: '2y²' },
    { id: 'd', label: '10y' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Kvadratni ochib, o'xshash hadlarni ixchamlang.",
    'Раскрой квадрат и приведи подобные.',
    'Expand the square and collect the like terms.',
  ),
  checkNote: L(
    "Kvadratdan minus o'n y chiqdi, unga o'n y qo'shildi va ular yo'q bo'ldi. Qolgani y kvadrat va yigirma besh.",
    'Из квадрата вышло минус десять y, к нему прибавилось десять y, и они уничтожились. Осталось y в квадрате и двадцать пять.',
    'The square gave minus ten y, ten y was added, and they cancelled. What remains is y squared and twenty five.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Kvadratda bitta y kvadrat bor, ikkinchisi yo'q.", 'В квадрате один y в квадрате, второго нет.', 'The square has one y squared, there is no second.') },
    { key: 'd', tag: 'Z2', hint: L("Minus o'n y va o'n y bir-birini yo'q qildi.", 'Минус десять y и десять y уничтожили друг друга.', 'Minus ten y and ten y cancelled each other.') },
    { key: '*', tag: 'Z2', hint: L("Avval kvadratni ochib, keyin o'xshashlarni qarang.", 'Сначала раскрой квадрат, потом смотри подобные.', 'Expand the square first, then look at the like terms.') },
  ],
  audio: [
    A('mount', "Bu safar qavs bitta, lekin undan keyin yana had bor.", 'На этот раз скобка одна, но после неё есть ещё член.', 'This time there is one bracket, but another term follows it.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Ikki kvadrat TO'G'RI ochilgan, lekin qavs
// oldidagi minus faqat BIRINCHI hadga borgan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Ikki kvadrat ham to'g'ri ochilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Оба квадрата раскрыты верно. И всё же какая строка ошибочна?',
    'Both squares are expanded right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '(x + 3)² − (x − 3)²' },
    { id: 'r2', text: 'x² + 6x + 9 − (x² − 6x + 9)' },
    { id: 'r3', text: 'x² + 6x + 9 − x² − 6x + 9' },
    { id: 'r4', text: L('18', '18', '18') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: ikki kvadrat ham formula bo'yicha ochilgan.", 'Верно: оба квадрата раскрыты по формуле.', 'Right: both squares are expanded by the formula.'),
    r4: L("Bu qator oldingisidan chiqadi. Xato undan oldin paydo bo'lgan.", 'Эта строка следует из предыдущей. Ошибка появилась раньше.', 'This line follows from the previous one. The mistake appeared earlier.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r4: 'Z1' },
  proofFill: {
    template: ['− (x² − 6x + 9)  =  −x² ', { slot: 0 }, ' 6x − 9   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: '+' },
      { id: 'b', label: '12x' },
      { id: 'c', label: '−' },
      { id: 'd', label: '18' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Minusni to'g'ri tarqatib, javobni tuzating.",
      'Разнеси минус верно и исправь ответ.',
      'Spread the minus correctly and fix the answer.',
    ),
    checkNote: L(
      "Minus uch hadning hammasiga bordi: minus olti x musbat olti x bo'ldi, to'qqiz esa manfiy. Shundan keyin sonlar yo'q bo'ladi.",
      'Минус дошёл до всех трёх членов: минус шесть x стало плюс шесть x, а девять отрицательным. После этого числа уничтожаются.',
      'The minus reached all three terms: minus six x became plus six x, and nine became negative. After that the numbers cancel.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z1', hint: L("Qavs ichida minus olti x turgan edi, minus uni musbat qiladi.", 'В скобке стояло минус шесть x, минус делает его положительным.', 'The bracket held minus six x, and the minus makes it positive.') },
      { key: 'd', tag: 'Z3', hint: L("To'qqiz va minus to'qqiz yo'q bo'ladi, son qolmaydi.", 'Девять и минус девять уничтожаются, числа не остаётся.', 'Nine and minus nine cancel, no number remains.') },
      { key: '*', tag: 'Z1', hint: L("Minus qavs ichidagi HAR hadga boradi.", 'Минус доходит до КАЖДОГО члена в скобке.', 'The minus reaches EVERY term in the bracket.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda ikki kvadrat ham to'g'ri ochilgan.", 'В этой ловушке оба квадрата раскрыты верно.', 'In this trap both squares are expanded right.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Minus faqat birinchi hadga borgan.", 'Нашёл. Минус дошёл только до первого члена.', 'You found it. The minus reached only the first term.'),
    A('done', "Minus uchta hadning hammasining ishorasini almashtiradi.", 'Минус меняет знак всех трёх членов.', 'The minus flips the sign of all three terms.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. ISBOT: ifoda x ga bog'liq emasligini ko'rsatish.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('ISBOT', 'ДОКАЗАТЕЛЬСТВО', 'A PROOF'),
  title: L('Harfga bog\'liq emas', 'Не зависит от буквы', 'It does not depend on the letter'),
  given: L(
    "Bu ifodaning qiymati x ga bog'liq emasligini ko'rsating: hamma x li had yo'q bo'lishi kerak.",
    'Покажи, что значение этого выражения не зависит от x: все члены с x должны уничтожиться.',
    'Show that the value of this expression does not depend on x: every x term must cancel.',
  ),
  template: ['(x + 4)(x − 4) − x²  =  x² − 16 − x²  =  ', { slot: 0 }],
  parts: [
    { id: 'a', label: '−16' },
    { id: 'b', label: '16' },
    { id: 'c', label: '0' },
    { id: 'd', label: '−16x' },
  ],
  answer: ['a'],
  prompt: L(
    "Nima qoladi.",
    'Что останется.',
    'What remains.',
  ),
  checkNote: L(
    "x kvadrat va minus x kvadrat yo'q bo'ldi. Qolgani minus o'n olti, va unda x yo'q.",
    'x в квадрате и минус x в квадрате уничтожились. Осталось минус шестнадцать, и в нём нет x.',
    'x squared and minus x squared cancelled. What remains is minus sixteen, with no x in it.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Kvadratlar ayirmasida to'rtning kvadrati ayiriladi.", 'В разности квадратов квадрат четырёх вычитается.', 'In a difference of squares the square of four is subtracted.') },
    { key: 'c', tag: 'Z2', hint: L("Minus o'n olti qoladi: unga mos had yo'q.", 'Минус шестнадцать остаётся: ему нет пары.', 'Minus sixteen remains: it has no match.') },
    { key: 'd', tag: 'Z6', hint: L("O'n oltida x yo'q, u sof son.", 'В шестнадцати нет x, это чистое число.', 'Sixteen has no x, it is a plain number.') },
  ],
  audio: [
    A('mount', "Ba'zan ifodaning qiymati harfga bog'liq bo'lmaydi, va buni ko'rsatish mumkin.", 'Иногда значение выражения не зависит от буквы, и это можно показать.', 'Sometimes an expression does not depend on the letter, and this can be shown.'),
    A('mount', "Qavsni ochib, x li hadlar yo'q bo'lishini kuzatib boring.", 'Раскрой скобку и следи, как исчезают члены с x.', 'Expand the bracket and watch the x terms disappear.'),
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
      prompt: '(x + 1)² − (x − 1)²',
      ok: L("Kvadratlar va birlar yo'q bo'ldi, o'rta hadlar qo'shildi.", 'Квадраты и единицы уничтожились, средние члены сложились.', 'The squares and the ones cancelled, the middle terms added.'),
      items: [
        { id: 'a', label: '4x', correct: true },
        { id: 'b', label: '0', tag: 'Z1', hint: L("Ikkinchi qavsning o'rta hadi minus bilan musbatga aylanadi.", 'Средний член второй скобки с минусом становится положительным.', 'The middle term of the second bracket becomes positive with the minus.') },
        { id: 'c', label: '2x', tag: 'Z1', hint: L("O'rta hadlar ikkita: ikki x va yana ikki x.", 'Средних членов два: два x и ещё два x.', 'There are two middle terms: two x and two x again.') },
        { id: 'd', label: '2x² + 4x', tag: 'Z3', hint: L("Ikkinchi x kvadrat ayiriladi.", 'Второй x в квадрате вычитается.', 'The second x squared is subtracted.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(a + 5)² − a²',
      ok: L("a kvadratlar yo'q bo'ldi.", 'a в квадрате уничтожились.', 'The a squares cancelled.'),
      items: [
        { id: 'a', label: '10a + 25', correct: true },
        { id: 'b', label: '25', tag: 'Z2', hint: L("O'rta had qoladi: o'n a.", 'Средний член остаётся: десять a.', 'The middle term stays: ten a.') },
        { id: 'c', label: '2a² + 10a + 25', tag: 'Z3', hint: L("Ikkinchi a kvadrat ayiriladi.", 'Второй a в квадрате вычитается.', 'The second a squared is subtracted.') },
        { id: 'd', label: '10a', tag: 'Z2', hint: L("Beshning kvadrati ham qoladi.", 'Квадрат пяти тоже остаётся.', 'The square of five stays too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "−(2a − 3b + 1) qanday yoziladi?",
        'Как записывается −(2a − 3b + 1)?',
        'How is −(2a − 3b + 1) written out?',
      ),
      ok: L("Uch hadning hammasi ishorasini almashtirdi.", 'Все три члена поменяли знак.', 'All three terms flipped sign.'),
      items: [
        { id: 'a', label: '−2a + 3b − 1', correct: true },
        { id: 'b', label: '−2a − 3b + 1', tag: 'Z1', hint: L("Ikkinchi va uchinchi hadlarning ishorasi ham almashadi.", 'Знаки второго и третьего членов тоже меняются.', 'The second and third signs flip too.') },
        { id: 'c', label: '2a − 3b + 1', tag: 'Z1', hint: L("Birinchi hadning ishorasi ham almashadi.", 'Знак первого члена тоже меняется.', 'The first sign flips too.') },
        { id: 'd', label: '−2a + 3b + 1', tag: 'Z1', hint: L("Uchinchi hadning ishorasi ham almashadi.", 'Знак третьего члена тоже меняется.', 'The third sign flips too.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(x − 3)(x + 3) − x²',
      ok: L("x kvadratlar yo'q bo'ldi, son qoldi.", 'x в квадрате уничтожились, осталось число.', 'The x squares cancelled, a number remains.'),
      items: [
        { id: 'a', label: '−9', correct: true },
        { id: 'b', label: '9', tag: 'Z3', hint: L("Kvadratlar ayirmasida uchning kvadrati ayiriladi.", 'В разности квадратов квадрат трёх вычитается.', 'In a difference of squares the square of three is subtracted.') },
        { id: 'c', label: '0', tag: 'Z2', hint: L("Minus to'qqiz qoladi.", 'Минус девять остаётся.', 'Minus nine remains.') },
        { id: 'd', label: '−9x', tag: 'Z6', hint: L("To'qqizda x yo'q.", 'В девяти нет x.', 'Nine has no x.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida ikkinchi qism oddiy kvadrat.", 'Во втором вторая часть простой квадрат.', 'In the second the second part is a plain square.'),
    A('2', "Uchinchisi minus haqida.", 'Третий про минус.', 'The third is about the minus.'),
    A('3', "Oxirgisida javob son bo'ladi.", 'В последнем ответ будет числом.', 'In the last one the answer is a number.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Minus hamma hadga', 'Минус на все члены', 'The minus onto every term'),
  gate: S1.gate,
  fix: {
    tokens: ['12x'],
    value: '24',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Qavslar bir xil emas: ikkinchisining o'rta hadi manfiy, va minus uni musbat qiladi. Shuning uchun o'rta hadlar qo'shilib o'n ikki x beradi.",
    'Скобки не одинаковые: у второй средний член отрицательный, и минус делает его положительным. Поэтому средние члены складываются в двенадцать x.',
    'The brackets are not the same: the second has a negative middle term, and the minus makes it positive. So the middle terms add into twelve x.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    twelve: L("o'n ikki x", 'двенадцать x', 'twelve x'),
    zero: L('nol', 'ноль', 'zero'),
    nine: L('faqat sonlar', 'только числа', 'only numbers'),
    cant: L("o'zgartirib bo'lmaydi", 'преобразовать нельзя', 'cannot be transformed'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(x + 3)² → 6x', '(x − 3)² → −6x', '−( ) → 3', '(x + 4)(x − 4) − x² → −16'],
  twoLabel: L('B5 bloki davom etadi', 'Блок Б5 продолжается', 'Block B5 continues'),
  twoA: L(
    "avval qavslar  →  keyin o'xshashlar",
    'сначала скобки  →  потом подобные',
    'brackets first  →  then like terms',
  ),
  twoB: L(
    'minus  →  hamma hadga',
    'минус  →  на все члены',
    'the minus  →  onto every term',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "kublar yig'indisi va ayirmasi",
    'сумма и разность кубов',
    'the sum and difference of cubes',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugun yangi formula bo'lmadi. Yangisi -- tartib: avval qavslar, keyin minus, oxirida o'xshash hadlar.", 'Сегодня новой формулы не было. Новое это порядок: сначала скобки, потом минус, в конце подобные.', 'No new formula today. What is new is the order: brackets, then the minus, then the like terms.'),
    A('mount', "Keyingi darsda yana bir juft formula qo'shiladi.", 'На следующем уроке добавится ещё пара формул.', 'Next lesson adds one more pair of formulas.'),
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
