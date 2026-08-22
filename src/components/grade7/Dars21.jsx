// ============================================================================
// 7-sinf, Dars 21. KO'PHADLARNI KO'PAYTIRISH.
// (Умножение многочленов)
//
// KONVEYER DARSI: bu faylda JSX yo'q, o'ram `screens.jsx` da. Har ekran
// obyektining `kind` maydoni formani tanlaydi.
//
// ASBOB: `AreaGrid` -- YUZA TO'RTBURCHAGI. 20-darsda uning bitta qatori bor
// edi, bu yerda IKKI QATOR bo'ladi va kataklar TO'RTTA. Blokning yillik
// xatosi -- qavslarni chetdan chetga ko'paytirish, ya'ni ikki qavsdan ikkita
// ko'paytma yasash -- shu bilan YOPILADI: to'rt katak turgan joyda ikkita
// ko'paytma yozib bo'lmaydi, ikki katak BO'SH qoladi va u ko'rinadi.
//
// IKKINCHI YARIM ISH -- O'XSHASH HADLAR. 20-darsda javob to'g'ridan to'g'ri
// kataklardan yig'ilardi, bu yerda esa kataklardan keyin qo'shish bor: ikki
// o'rta ko'paytma o'xshash bo'lib chiqadi. Shu ish 5-ekranda HADLAR USTUNIGA
// beriladi (`TermColumns`): o'xshash hadlar bitta ustunga tushadi.
//
// CHEGARAVIY HOLAT (7-ekran) ATAYIN qo'yilgan: ikki ikkihadning ko'paytmasi
// UCHHAD bo'lishi SHART emas. O'rta ko'paytmalar bir-birini yo'q qilishi
// mumkin, va bu 26-darsning (kvadratlar ayirmasi) tayyorgarligi.
//
// ASBOB HISOBLAMAYDI (§8.1): katak ochilganda ko'paytuvchilar JUFTI
// ko'rinadi, natijani o'quvchi topadi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_21'
const LESSON_TITLE = L("Ko'phadlarni ko'paytirish", 'Умножение многочленов', 'Multiplying polynomials')
const LESSON_NO = L('21-dars', 'Урок 21', 'Lesson 21')
const BLOCK = { label: L('B4-blok', 'Блок Б4', 'Block B4'), from: 18, to: 24, current: 21 }

const TAGS = {
  Z1: L("faqat chetdagi hadlar ko'paytirildi", 'перемножили только крайние члены', 'only the outer terms were multiplied'),
  Z2: L("ko'paytma tushib qoldi", 'произведение пропущено', 'a product was skipped'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L("ko'rsatkichlar bilan ish", 'работа с показателями', 'work with the exponents'),
  Z5: L("o'xshash bo'lmagan hadlar qo'shildi", 'сложили неподобные члены', 'unlike terms were added'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Ikki o'quvchi bitta ko'paytmani hisobladi. Tablolarda
// HISOBLANGAN KO'PAYTMALAR SONI turadi: ikkita va to'rtta.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("KO'PHADLARNI KO'PAYTIRISH", 'УМНОЖЕНИЕ МНОГОЧЛЕНОВ', 'MULTIPLYING POLYNOMIALS'),
  noBack: true,
  noNotes: true,
  title: L("Nechta ko'paytma kerak", 'Сколько произведений нужно', 'How many products are needed'),
  gate: {
    source: { kind: 'plain', tokens: ['(x', '+', '3)', '(x', '+', '5)'] },
    rows: [
      { tokens: ['x²', '+', '15'], value: '2' },
      { tokens: ['x²', '+', '8x', '+', '15'], value: '4' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Ikki qavsning har birida ikki had bor. Tablolarda hisoblangan ko'paytmalar soni turadi. Kim haq?",
      'В каждой из двух скобок по два члена. На табло стоит число посчитанных произведений. Кто прав?',
      'Each of the two brackets has two terms. The boards show how many products were worked out. Who is right?',
    ),
    items: [
      {
        id: 'four',
        label: L("To'rtta: har had har hadga", 'Четыре: каждый член на каждый', 'Four: every term by every term'),
        hint: L(
          "Taxminingiz qabul qilindi. To'rtburchakda tekshiramiz.",
          'Прогноз принят. Проверим на прямоугольнике.',
          'Your prediction is taken. We will check it on the rectangle.',
        ),
      },
      {
        id: 'two',
        label: L('Ikkita: birinchi birinchiga, ikkinchi ikkinchiga', 'Два: первый на первый, второй на второй', 'Two: the first by the first, the second by the second'),
        hint: L(
          "Pastki tabloga qarang: unda x li had bor. U qaysi ko'paytmadan chiqdi.",
          'Посмотри на нижнее табло: там есть член с x. Из какого произведения он вышел.',
          'Look at the lower board: it has an x term. Which product did it come from.',
        ),
      },
      {
        id: 'three',
        label: L('Uchta: javobdagi hadlar soniga qarab', 'Три: по числу членов в ответе', 'Three: by the number of terms in the answer'),
        hint: L(
          "Ko'paytmalar soni va javobdagi hadlar soni boshqa narsa. Avval ko'paytmalar hisoblanadi.",
          'Число произведений и число членов в ответе это разные вещи. Сначала считаются произведения.',
          'The number of products and the number of terms in the answer are different things. The products come first.',
        ),
      },
      {
        id: 'inside',
        label: L('Avval qavs ichini hisoblash kerak', 'Сначала надо посчитать в скобках', 'The brackets must be worked out first'),
        hint: L(
          "Qavs ichida x li had va son turibdi, ular o'xshash emas va qo'shilmaydi.",
          'В скобке член с x и число, они не подобны и не складываются.',
          'A bracket holds an x term and a number, they are not like and do not add.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi bitta ko'paytmani hisobladi va boshqa javob oldi.", 'Два ученика считали одно произведение и получили разное.', 'Two students worked out the same product and got different answers.'),
    A('mount', "Tablolarda hisoblangan ko'paytmalar soni turadi: bittasida ikkita, ikkinchisida to'rtta.", 'На табло стоит число посчитанных произведений: у одного два, у другого четыре.', 'The boards show how many products were computed: one has two, the other four.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Uchta qisqa savol: 20-darsdan bitta, B3 dan bitta,
// va O'XSHASH HADLAR -- bugungi ishning ikkinchi yarmi.
// KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch qisqa savol', 'Три коротких вопроса', 'Three short questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  items: [
    {
      prompt: '2x(x + 5)',
      ok: L("Ikki katak: ko'paytuvchi har hadga bordi.", 'Две клетки: множитель дошёл до каждого члена.', 'Two cells: the factor reached every term.'),
      items: [
        { id: 'a', label: '2x² + 10x', correct: true },
        { id: 'b', label: '2x² + 5', tag: 'Z1', hint: L("Beshlik ham ikki x ga ko'paytiriladi.", 'Пятёрка тоже умножается на два x.', 'The five is multiplied by two x as well.') },
        { id: 'c', label: '2x² + 10', tag: 'Z4', hint: L("Ikki x karra besh da x qoladi.", 'В два x на пять буква x остаётся.', 'In two x times five the letter x stays.') },
        { id: 'd', label: '7x²', tag: 'Z5', hint: L("Qavs ichida x li had va son turgan edi, ular o'xshash emas.", 'В скобке был член с x и число, они не подобны.', 'The bracket had an x term and a number, they are not alike.') },
      ],
    },
    {
      prompt: '−3a · 4a',
      ok: L("Koeffitsiyentlar ko'paytirildi, ikkita a esa a kvadratni berdi.", 'Коэффициенты умножились, а две a дали a в квадрате.', 'The coefficients multiplied, and the two a gave a squared.'),
      items: [
        { id: 'a', label: '−12a²', correct: true },
        { id: 'b', label: '−12a', tag: 'Z4', hint: L("Ikkita a bor, demak a kvadrat.", 'Есть две a, значит a в квадрате.', 'There are two a, so a squared.') },
        { id: 'c', label: '12a²', tag: 'Z3', hint: L("Bitta minus toq, ishora qoladi.", 'Один минус это нечётно, знак остаётся.', 'One minus is odd, the sign stays.') },
        { id: 'd', label: '−7a²', tag: 'Z6', hint: L("Uch va to'rt qo'shilmaydi, ko'paytiriladi.", 'Три и четыре не складывают, а умножают.', 'Three and four are not added but multiplied.') },
      ],
    },
    {
      prompt: '5x − 2x + x',
      ok: L("Hamma had o'xshash, koeffitsiyentlar ishorasi bilan qo'shildi.", 'Все члены подобны, коэффициенты сложились со своими знаками.', 'All the terms are alike, and the coefficients added with their signs.'),
      items: [
        { id: 'a', label: '4x', correct: true },
        { id: 'b', label: '2x', tag: 'Z3', hint: L("Oxirgi had oldida qo'shuv turibdi, ayirish emas.", 'Перед последним членом стоит сложение, а не вычитание.', 'The last term has a plus before it, not a minus.') },
        { id: 'c', label: '4x³', tag: 'Z4', hint: L("O'xshash hadlarni qo'shganda ko'rsatkich o'zgarmaydi.", 'При сложении подобных членов показатель не меняется.', 'Adding like terms does not change the exponent.') },
        { id: 'd', label: '8x', tag: 'Z3', hint: L("Ikkinchi had manfiy, u ayiriladi.", 'Второй член отрицательный, он вычитается.', 'The second term is negative, it gets subtracted.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Birinchisi o'tgan darsdan, ikkinchisi bir hadlar haqida.", 'Три коротких вопроса. Первый из прошлого урока, второй про одночлены.', 'Three short questions. The first from the last lesson, the second about monomials.'),
    A('1', "Ikkinchisida ishora bor.", 'Во втором есть знак.', 'The second has a sign.'),
    A('2', "Uchinchisi o'xshash hadlar haqida. Bugun u kerak bo'ladi.", 'Третий про подобные члены. Сегодня они понадобятся.', 'The third is about like terms. They will be needed today.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. TO'RTBURCHAK IKKI QATOR BO'LDI: to'rt katak.
// ============================================================
const S3 = {
  kind: 'grid',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L("To'rtburchak ikki qator bo'ldi", 'Прямоугольник стал двухрядным', 'The rectangle now has two rows'),
  caption: L(
    "Chapda birinchi qavsning hadlari, yuqorida ikkinchisining. Har katakni bosing.",
    'Слева члены первой скобки, сверху второй. Нажми на каждую клетку.',
    'On the left the terms of the first bracket, on top those of the second. Tap each cell.',
  ),
  left: ['x', '+3'],
  top: ['x', '+5'],
  options: [
    { id: 'a', label: 'x² + 8x + 15' },
    { id: 'b', label: 'x² + 15' },
    { id: 'c', label: '2x + 8x + 15' },
    { id: 'd', label: 'x² + 8x + 8' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Ikki katak bo'sh qoldi: uchlik x ga va x uchlikka ham ko'paytiriladi.", 'Две клетки остались пустыми: тройка на x и x на тройку тоже умножаются.', 'Two cells stayed empty: three by x and x by three are multiplied too.') },
    { key: 'c', tag: 'Z4', hint: L("Birinchi katakda x karra x turibdi, ya'ni x kvadrat.", 'В первой клетке x на x, то есть x в квадрате.', 'The first cell holds x times x, that is x squared.') },
    { key: 'd', tag: 'Z6', hint: L("Oxirgi katakda uch karra besh, ya'ni o'n besh.", 'В последней клетке три на пять, то есть пятнадцать.', 'The last cell is three times five, that is fifteen.') },
  ],
  note: L(
    "Kataklar to'rtta: chapdagi ikki had yuqoridagi ikki hadga ko'paytirildi.",
    'Клеток четыре: два члена слева умножились на два члена сверху.',
    'There are four cells: two terms on the left times two terms on top.',
  ),
  audio: [
    A('mount', "Ilgari to'rtburchakning bitta qatori bor edi, chunki chapda bitta ko'paytuvchi turardi.", 'Раньше у прямоугольника был один ряд, потому что слева стоял один множитель.', 'The rectangle used to have one row, because a single factor stood on the left.'),
    A('mount', "Endi chapda ham ikki had bor, shuning uchun qatorlar ikkita va kataklar to'rtta.", 'Теперь слева тоже два члена, поэтому рядов два, а клеток четыре.', 'Now the left has two terms as well, so there are two rows and four cells.'),
    A('cell-all', "To'rt katak ochildi. Endi har ko'paytmani hisoblang va javobni yig'ing.", 'Четыре клетки открыты. Теперь посчитай каждое произведение и собери ответ.', 'All four cells are open. Now work out each product and build the answer.'),
  ],
}

// ============================================================
// 4. FARQLASH. 20-DARS BILAN yonma-yon: chapda bitta ko'paytuvchi
// bo'lganda ikki katak, ikki had bo'lganda to'rt katak. Xato variant
// aynan YILNING xatosi: chetdan chetga.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Ikki katak yoki to\'rt katak', 'Две клетки или четыре', 'Two cells or four'),
  caption: L(
    "O'tgan darsda chapda bitta ko'paytuvchi turardi va kataklar ikkita edi. Endi chapda ikki had.",
    'В прошлом уроке слева стоял один множитель и клеток было две. Теперь слева два члена.',
    'Last lesson a single factor stood on the left and there were two cells. Now the left has two terms.',
  ),
  left: ['2x', '+1'],
  top: ['x', '+5'],
  options: [
    { id: 'a', label: '2x² + 11x + 5' },
    { id: 'b', label: '2x² + 5' },
    { id: 'c', label: '2x² + 10x + 5' },
    { id: 'd', label: '2x² + 11x + 1' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Bu ikki katakning javobi, kataklar esa to'rtta. Ikkitasi bo'sh qoladi.", 'Это ответ для двух клеток, а клеток четыре. Две останутся пустыми.', 'That is an answer for two cells, but there are four. Two would stay empty.') },
    { key: 'c', tag: 'Z2', hint: L("Birlik ham x ga ko'paytiriladi, va u yana bitta x li had beradi.", 'Единица тоже умножается на x, и она даёт ещё один член с x.', 'The one is multiplied by x too, and it gives one more x term.') },
    { key: 'd', tag: 'Z6', hint: L("Oxirgi katakda bir karra besh, ya'ni besh.", 'В последней клетке один на пять, то есть пять.', 'The last cell is one times five, that is five.') },
  ],
  note: L(
    "Kataklar soni chapdagi hadlar soni karra yuqoridagi hadlar soni.",
    'Число клеток это число членов слева, умноженное на число членов сверху.',
    'The cell count is the number of terms on the left times the number on top.',
  ),
  audio: [
    A('mount', "Chapdagi birinchi had ikki x, ikkinchisi esa birlik. Birlik ham had.", 'Первый член слева это два x, а второй единица. Единица тоже член.', 'The first term on the left is two x, and the second is one. One is a term too.'),
    A('mount', "To'rt katakni bosing va birlik qaysi ko'paytmalarni bergani ko'ring.", 'Нажми на четыре клетки и посмотри, какие произведения дала единица.', 'Tap the four cells and see which products the one gave.'),
    A('cell-all', "Birlik ikki ko'paytma berdi: x va besh.", 'Единица дала два произведения: x и пять.', 'The one gave two products: x and five.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. HADLAR USTUNI: to'rt ko'paytma ustunlarga
// yozildi va O'XSHASHLARI bitta ustunga tushdi. Bu bugungi ishning
// ikkinchi yarmi -- 20-darsda u yo'q edi.
// ============================================================
const S5 = {
  kind: 'columns',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L("O'xshashlar bitta ustunda", 'Подобные в одном столбике', 'Like terms in one column'),
  caption: L(
    "O'sha to'rt ko'paytma ustunlarga yozildi. Har ustunni bosing.",
    'Те же четыре произведения расставлены по столбикам. Нажми на каждый столбик.',
    'The same four products are laid out in columns. Tap each column.',
  ),
  rows: [
    { op: '', cells: ['x²', '5x', '15'] },
    { op: '+', cells: [null, '3x', null] },
  ],
  options: [
    { id: 'a', label: 'x² + 8x + 15' },
    { id: 'b', label: 'x² + 8x² + 15' },
    { id: 'c', label: '9x² + 15' },
    { id: 'd', label: 'x² + 15x + 15' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("O'xshash hadlarni qo'shganda ko'rsatkich o'zgarmaydi: besh x va uch x sakkiz x beradi.", 'При сложении подобных показатель не меняется: пять x и три x дают восемь x.', 'Adding like terms does not change the exponent: five x and three x give eight x.') },
    { key: 'c', tag: 'Z5', hint: L("x kvadrat va sakkiz x o'xshash emas, ularning ko'rsatkichlari boshqa.", 'x в квадрате и восемь x не подобны, у них разные показатели.', 'x squared and eight x are not alike, their exponents differ.') },
    { key: 'd', tag: 'Z6', hint: L("Bitta ustunda hadlar qo'shiladi, ko'paytirilmaydi.", 'В одном столбике члены складываются, а не умножаются.', 'Inside one column the terms add, they do not multiply.') },
  ],
  note: L(
    "Bitta ustunga faqat o'xshash hadlar tushadi. Chetdagi ustunlarda esa qo'shiladigan narsa yo'q.",
    'В один столбик попадают только подобные члены. А в крайних столбиках складывать нечего.',
    'Only like terms land in one column. In the outer columns there is nothing to add.',
  ),
  audio: [
    A('mount', "To'rtburchak ko'paytmalarni berdi, lekin ish tugamadi.", 'Прямоугольник дал произведения, но работа не кончилась.', 'The rectangle gave the products, but the work is not over.'),
    A('mount', "Ikki o'rta ko'paytma o'xshash hadlar bo'lib chiqdi, va ular qo'shiladi.", 'Два средних произведения оказались подобными членами, и они складываются.', 'The two middle products turned out to be like terms, and they add.'),
    A('col-all', "Uch ustun ochildi. O'rtadagisida ikkita had turadi.", 'Три столбика открыты. В среднем стоят два члена.', 'All three columns are open. The middle one holds two terms.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. Ishora va koeffitsiyent BIRGA: manfiy had chapda.
// ============================================================
const S6 = {
  kind: 'grid',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Chapda manfiy had', 'Слева отрицательный член', 'A negative term on the left'),
  caption: L(
    "Chapdagi ikkinchi had manfiy. To'rt katakni bosing va ishoralarga qarang.",
    'Второй член слева отрицательный. Нажми на четыре клетки и смотри на знаки.',
    'The second term on the left is negative. Tap the four cells and watch the signs.',
  ),
  left: ['2a', '−3'],
  top: ['a', '+4'],
  options: [
    { id: 'a', label: '2a² + 5a − 12' },
    { id: 'b', label: '2a² + 11a − 12' },
    { id: 'c', label: '2a² + 5a + 12' },
    { id: 'd', label: '2a² − 12' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Uchinchi katakda manfiy uch turibdi, demak o'rtada sakkiz a dan uch a ayiriladi.", 'В третьей клетке минус три, значит в середине из восьми a вычитается три a.', 'The third cell holds minus three, so in the middle three a is taken from eight a.') },
    { key: 'c', tag: 'Z3', hint: L("Oxirgi katakda manfiy uch karra to'rt turibdi, ikkinchi minus yo'q.", 'В последней клетке минус три на четыре, второго минуса нет.', 'The last cell is minus three times four, there is no second minus.') },
    { key: 'd', tag: 'Z1', hint: L("O'rta ikki katak ham bo'sh emas: ular a li hadlarni beradi.", 'Две средние клетки тоже не пусты: они дают члены с a.', 'The two middle cells are not empty either: they give a terms.') },
  ],
  note: L(
    "Manfiy had o'z ishorasi bilan ko'paytiriladi, va u ikki katakka boradi.",
    'Отрицательный член умножается со своим знаком, и он идёт в две клетки.',
    'A negative term multiplies with its own sign, and it goes into two cells.',
  ),
  audio: [
    A('mount', "Bu safar chapda manfiy had bor, va u ikki katakda qatnashadi.", 'На этот раз слева отрицательный член, и он участвует в двух клетках.', 'This time there is a negative term on the left, and it takes part in two cells.'),
    A('mount', "O'rtadagi ikki ko'paytmaning ishorasiga alohida qarang.", 'На знаки двух средних произведений посмотри особо.', 'Look closely at the signs of the two middle products.'),
    A('cell-all', "To'rt katak ochildi. O'rtadagi ikkitasining ishorasi boshqa.", 'Четыре клетки открыты. У двух средних знаки разные.', 'All four cells are open. The two middle ones have different signs.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH. Ikki ikkihadning
// ko'paytmasi IKKIHAD chiqdi: o'rta ko'paytmalar bir-birini yo'q
// qildi. 26-darsning tayyorgarligi.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Javobda ikki had qoldi", 'В ответе осталось два члена', 'Only two terms are left in the answer'),
  letter: 'x',
  numbers: [1, 3, 5],
  rows: [
    { id: 'r1', role: 'source', expr: '(x − 2)(x + 2)', sub: (n) => '(' + n + ' − 2)(' + n + ' + 2)', val: (n) => (n - 2) * (n + 2) },
    { id: 'r2', expr: 'x² − 4', sub: (n) => n + '² − 4', val: (n) => n * n - 4 },
  ],
  probe: {
    question: L(
      "Javob ikkihad bo'lib chiqdi. Demak o'rta ko'paytmalarni hisoblamaslik ham mumkinmi?",
      'Ответ вышел двучленом. Значит, средние произведения можно и не считать?',
      'The answer came out as a binomial. So can the middle products be skipped?',
    ),
    items: [
      {
        id: 'zero',
        correct: true,
        label: L("Yo'q. Ular hisoblandi va bir-birini yo'q qildi", 'Нет. Их посчитали, и они уничтожили друг друга', 'No. They were computed, and they cancelled each other'),
      },
      {
        id: 'skip',
        tag: 'Z2',
        label: L("Ha, ularni tashlab ketish mumkin", 'Да, их можно пропустить', 'Yes, they can be skipped'),
        hint: L(
          "Ko'paytmalar baribir to'rtta. Ikkitasi nol berdi, lekin yo'qolmadi.",
          'Произведений всё равно четыре. Два из них дали ноль, но не исчезли.',
          'There are still four products. Two of them gave zero, but did not vanish.',
        ),
      },
      {
        id: 'same',
        tag: 'Z1',
        label: L('Ha, qavslarda bir xil son turganda', 'Да, когда в скобках одинаковые числа', 'Yes, when the brackets hold the same number'),
        hint: L(
          "Sonlar bir xil, lekin ishoralar boshqa. O'rta hadlarni aynan turli ishora yo'q qildi.",
          'Числа одинаковые, но знаки разные. Средние члены уничтожили именно разные знаки.',
          'The numbers are the same, but the signs differ. It was the different signs that cancelled the middle terms.',
        ),
      },
      {
        id: 'three',
        tag: 'Z5',
        label: L("Yo'q, javobda uch had bo'lishi shart", 'Нет, в ответе обязательно три члена', 'No, the answer must have three terms'),
        hint: L(
          "O'xshash hadlar qo'shildi va ulardan nol qoldi. Ikkihad bu yerda qonuniy.",
          'Подобные члены сложились, и от них остался ноль. Двучлен здесь законен.',
          'The like terms added and left zero. A binomial is legitimate here.',
        ),
      },
    ],
  },
  okText: L(
    "Ya'ni ikki ikkihadning ko'paytmasi UCHHAD bo'lishi shart emas: o'rta ko'paytmalar bir-birini yo'q qilishi mumkin.",
    'То есть произведение двух двучленов не обязано быть трёхчленом: средние произведения могут уничтожить друг друга.',
    'So the product of two binomials need not be a trinomial: the middle products can cancel each other.',
  ),
  audio: [
    A('mount', "Yuqorida ikki qavsning ko'paytmasi, pastda esa ikki hadli javob.", 'Сверху произведение двух скобок, снизу ответ из двух членов.', 'Above the product of two brackets, below an answer with two terms.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Ikki qatorni solishtiring. Ular teng chiqdi.", 'Сравни две строки. Они вышли равными.', 'Compare the two rows. They came out equal.'),
  ],
}

// ============================================================
// 8. QOIDA. 20-DARS QOIDASIDAN FARQI: oxirida o'xshash hadlarni
// ixchamlash qadami paydo bo'ldi.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z1',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("bir ko'phadning har bir hadini", 'каждый член одного многочлена', 'each term of one polynomial') },
    { id: 'f2', label: L("ikkinchisining har bir hadiga ko'paytiramiz", 'умножаем на каждый член другого', 'we multiply by each term of the other') },
    { id: 'f3', label: L("hosil bo'lgan ko'paytmalarni qo'shamiz", 'полученные произведения складываем', 'and add the products we got') },
    { id: 'f4', label: L("va o'xshash hadlarni ixchamlaymiz", 'и приводим подобные члены', 'and collect the like terms') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval hadlar, keyin ko'paytirish, keyin qo'shish, oxirida o'xshashlarni ixchamlash.",
    'Порядок нарушен. Сначала члены, потом умножение, потом сложение, в конце приведение подобных.',
    'The order is off. Terms first, then multiplication, then addition, and collecting like terms last.',
  ),
  lawChips: [
    { label: '( ) ( )', tone: 'par' },
    { label: '·', tone: 's2' },
    { label: '+', tone: 's1' },
    { label: '2 · 2', tone: 'off' },
  ],
  lawSweep: L(
    "ikki qavs, ko'paytirish, qo'shish, ko'paytmalar soni",
    'две скобки, умножение, сложение, число произведений',
    'two brackets, multiplication, addition, product count',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ko'phadni ko'phadga ko'paytirish uchun bir ko'phadning har bir hadini ikkinchi ko'phadning har bir hadiga ko'paytirish va hosil bo'lgan ko'paytmalarni qo'shish kerak.",
        'Чтобы умножить многочлен на многочлен, нужно каждый член одного многочлена умножить на каждый член другого и полученные произведения сложить.',
        'To multiply a polynomial by a polynomial, multiply every term of one by every term of the other and add the products.',
      ),
      L(
        "Ko'paytmalar soni chapdagi hadlar soni karra o'ngdagi hadlar soniga teng, so'ngra o'xshash hadlar ixchamlanadi.",
        'Число произведений равно числу членов слева, умноженному на число членов справа, а затем приводятся подобные члены.',
        'The number of products is the term count on the left times the term count on the right, and then the like terms are collected.',
      ),
    ],
  },
  hookCap: L(
    "Ikki had karra ikki had -- to'rt ko'paytma",
    'Два члена на два члена это четыре произведения',
    'Two terms by two terms means four products',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('har had har hadga', 'каждый член на каждый', 'every term by every term'),
    L('ishora had bilan ketadi', 'знак идёт с членом', 'the sign travels with the term'),
    L("o'xshashlar oxirida qo'shiladi", 'подобные складываются в конце', 'like terms add at the end'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило.', 'We have seen all the cases. Now let us build the rule.'),
    A('ok', "O'tgan darsning qoidasiga bitta qadam qo'shildi: oxirida o'xshash hadlar ixchamlanadi.", 'К правилу прошлого урока добавился один шаг: в конце приводятся подобные члены.', 'One step was added to last lesson rule: like terms are collected at the end.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI. To'rt savol: ikkitasi hisob, bittasi
// KO'PAYTMALAR SONI, oxirgisi bir xil qavslar.
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
      prompt: '(x + 2)(x + 6)',
      ok: L("O'rtada ikki x va olti x qo'shildi, chetda esa ikki karra olti.", 'В середине сложились два x и шесть x, а по краям два на шесть.', 'In the middle two x and six x added, and at the edges two times six.'),
      items: [
        { id: 'a', label: 'x² + 8x + 12', correct: true },
        { id: 'b', label: 'x² + 12', tag: 'Z1', hint: L("O'rta ikki katak ham bor: ikki x va olti x.", 'Две средние клетки тоже есть: два x и шесть x.', 'The two middle cells are there too: two x and six x.') },
        { id: 'c', label: 'x² + 12x + 8', tag: 'Z6', hint: L("Yig'indi o'rta hadni beradi, ko'paytma esa oxirgisini.", 'Сумма даёт средний член, а произведение последний.', 'The sum gives the middle term, the product gives the last one.') },
        { id: 'd', label: '2x + 8x + 12', tag: 'Z4', hint: L("Birinchi katakda x karra x, ya'ni x kvadrat.", 'В первой клетке x на x, то есть x в квадрате.', 'The first cell is x times x, that is x squared.') },
      ],
    },
    {
      wrap: false,
      prompt: '(3x − 1)(2x + 7)',
      ok: L("O'rtada yigirma bir x dan ikki x ayirildi.", 'В середине из двадцати одного x вычлось два x.', 'In the middle two x was taken from twenty one x.'),
      items: [
        { id: 'a', label: '6x² + 19x − 7', correct: true },
        { id: 'b', label: '6x² + 23x − 7', tag: 'Z3', hint: L("Uchinchi katakda manfiy bir karra ikki x turibdi, u ayiriladi.", 'В третьей клетке минус один на два x, он вычитается.', 'The third cell is minus one times two x, and it gets subtracted.') },
        { id: 'c', label: '6x² + 19x + 7', tag: 'Z3', hint: L("Oxirgi katakda manfiy bir karra yetti turibdi.", 'В последней клетке минус один на семь.', 'The last cell is minus one times seven.') },
        { id: 'd', label: '6x² − 7', tag: 'Z1', hint: L("Ikki katak bo'sh qoldi, ular x li hadlarni beradi.", 'Две клетки остались пустыми, они дают члены с x.', 'Two cells stayed empty, they give the x terms.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(a + b + c)(d + e) da nechta ko'paytma bor?",
        'Сколько произведений в (a + b + c)(d + e)?',
        'How many products are in (a + b + c)(d + e)?',
      ),
      ok: L("Uch had karra ikki had olti ko'paytma beradi.", 'Три члена на два члена дают шесть произведений.', 'Three terms by two terms give six products.'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '5', tag: 'Z2', hint: L("Hadlar soni qo'shilmaydi, ko'paytiriladi.", 'Числа членов не складываются, а умножаются.', 'The term counts are not added but multiplied.') },
        { id: 'c', label: '4', tag: 'Z1', hint: L("Birinchi qavsda uch had bor, ularning har biri ikki marta qatnashadi.", 'В первой скобке три члена, и каждый участвует дважды.', 'The first bracket has three terms, and each takes part twice.') },
        { id: 'd', label: '3', tag: 'Z1', hint: L("Ikkinchi qavsda ham ikki had bor, ular ham hisobga kiradi.", 'Во второй скобке тоже два члена, они тоже считаются.', 'The second bracket has two terms as well, and they count too.') },
      ],
    },
    {
      wrap: false,
      prompt: '(a − 4)(a − 4)',
      ok: L("Ikki o'rta ko'paytma ham manfiy, shuning uchun o'rtada sakkiz a ayiriladi.", 'Оба средних произведения отрицательны, поэтому в середине вычитается восемь a.', 'Both middle products are negative, so eight a is subtracted in the middle.'),
      items: [
        { id: 'a', label: 'a² − 8a + 16', correct: true },
        { id: 'b', label: 'a² − 16', tag: 'Z1', hint: L("O'rta kataklar bo'sh emas: ikkalasida ham manfiy to'rt a.", 'Средние клетки не пусты: в обеих минус четыре a.', 'The middle cells are not empty: both hold minus four a.') },
        { id: 'c', label: 'a² − 8a − 16', tag: 'Z3', hint: L("Oxirgi katakda ikki minus bor, ular birga musbat beradi.", 'В последней клетке два минуса, вместе они дают плюс.', 'The last cell has two minuses, and together they give a plus.') },
        { id: 'd', label: 'a² − 16a + 16', tag: 'Z6', hint: L("O'rtada to'rt a va to'rt a qo'shiladi, ko'paytirilmaydi.", 'В середине складываются четыре a и четыре a, а не умножаются.', 'In the middle four a and four a add, they do not multiply.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Uchinchisida hisob emas, ko'paytmalar soni so'raladi.", 'Четыре вопроса. В третьем спрашивают не ответ, а число произведений.', 'Four questions. The third asks not for the answer but for the number of products.'),
    A('1', "Ikkinchisida ishora bor.", 'Во втором есть знак.', 'The second has a sign.'),
    A('2', "Uchinchisida qavslardagi hadlarni sanang.", 'В третьем посчитай члены в скобках.', 'In the third, count the terms in the brackets.'),
    A('3', "Oxirgisida ikki qavs bir xil.", 'В последнем скобки одинаковые.', 'In the last one the brackets are the same.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: avval o'rta ko'paytmalar, keyin
// ularni ixchamlash.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("O'rta hadlar", 'Средние члены', 'The middle terms'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['(3x − 2)(2x + 5)  =  6x² + ', { slot: 0 }, ' − ', { slot: 1 }, ' − 10'],
  parts: [
    { id: 'a', label: '15x' },
    { id: 'b', label: '4x' },
    { id: 'c', label: '10x' },
    { id: 'd', label: '6x' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Chetdagi ikki ko'paytma yozilgan. O'rtadagi ikkitasini yozing.",
    'Крайние два произведения записаны. Впиши два средних.',
    'The two outer products are written. Write the two middle ones.',
  ),
  checkNote: L(
    "Uch x karra besh o'n besh x, manfiy ikki karra ikki x esa manfiy to'rt x.",
    'Три x на пять это пятнадцать x, а минус два на два x это минус четыре x.',
    'Three x times five is fifteen x, and minus two times two x is minus four x.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Manfiy ikki beshga emas, ikki x ga ko'paytiriladi.", 'Минус два умножается на два x, а не на пять.', 'Minus two is multiplied by two x, not by five.') },
    { key: 'd', tag: 'Z6', hint: L("Uch x beshga ko'paytiriladi, ikkiga emas.", 'Три x умножается на пять, а не на два.', 'Three x is multiplied by five, not by two.') },
    { key: '*', tag: 'Z6', hint: L("Har katakda o'z jufti turadi, ularni almashtirib bo'lmaydi.", 'В каждой клетке своя пара, их нельзя перепутать.', 'Each cell has its own pair, they cannot be swapped.') },
  ],
  probe: {
    question: L("Javobda o'rta had qanday bo'ladi?", 'Каким будет средний член в ответе?', 'What will the middle term of the answer be?'),
    items: [
      { id: 'a', correct: true, label: '11x' },
      { id: 'b', tag: 'Z3', label: '19x', hint: L("Ikkinchi had manfiy, u qo'shilmaydi, ayiriladi.", 'Второй член отрицательный, он не складывается, а вычитается.', 'The second term is negative, it is not added but subtracted.') },
      { id: 'c', tag: 'Z4', label: '11x²', hint: L("O'xshash hadlarni qo'shganda ko'rsatkich o'zgarmaydi.", 'При сложении подобных показатель не меняется.', 'Adding like terms does not change the exponent.') },
      { id: 'd', tag: 'Z4', label: '11', hint: L("Ikkala hadda ham x bor, u javobda qoladi.", 'В обоих членах есть x, он остаётся в ответе.', 'Both terms have an x, and it stays in the answer.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval o'rta ko'paytmalar, keyin ularni ixchamlash.", 'Два шага. Сначала средние произведения, потом их приведение.', 'Two steps. The middle products first, then collecting them.'),
    A('mount', "Chetdagi ikkitasi allaqachon yozilgan.", 'Крайние два уже записаны.', 'The two outer ones are already written.'),
    A('two', "Endi ikkinchi qadam: o'rta hadni ixchamlang.", 'Теперь второй шаг: приведи средний член.', 'Now the second step: collect the middle term.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Asbob yo'q. IKKI QAVS HAM MANFIY hadli:
// javobda ikki ishora ham o'quvchining ishi.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L("To'rtburchaksiz, ikki minus bilan", 'Без прямоугольника, с двумя минусами', 'No rectangle, with two minuses'),
  template: ['(a − 5)(a − 6)  =  a² ', { slot: 0 }, ' ', { slot: 1 }],
  parts: [
    { id: 'a', label: '− 11a' },
    { id: 'b', label: '+ 30' },
    { id: 'c', label: '+ 11a' },
    { id: 'd', label: '− 30' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Javobni yig'ing. Ikki qavsda ham manfiy had turibdi.",
    'Собери ответ. В обеих скобках стоит отрицательный член.',
    'Build the answer. Both brackets hold a negative term.',
  ),
  checkNote: L(
    "O'rtada manfiy besh a va manfiy olti a qo'shildi, oxirida esa ikki minus musbat berdi.",
    'В середине сложились минус пять a и минус шесть a, а в конце два минуса дали плюс.',
    'In the middle minus five a and minus six a added, and at the end two minuses gave a plus.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("O'rtadagi ikki ko'paytma ham manfiy: minus besh a va minus olti a.", 'Оба средних произведения отрицательны: минус пять a и минус шесть a.', 'Both middle products are negative: minus five a and minus six a.') },
    { key: 'd', tag: 'Z3', hint: L("Oxirgi katakda minus besh karra minus olti turibdi, ikki minus musbat beradi.", 'В последней клетке минус пять на минус шесть, два минуса дают плюс.', 'The last cell is minus five times minus six, two minuses give a plus.') },
    { key: '*', tag: 'Z3', hint: L("Har katakning ishorasini alohida hisoblang.", 'Считай знак каждой клетки отдельно.', 'Work out the sign of each cell separately.') },
  ],
  audio: [
    A('mount', "Bu safar to'rtburchak yo'q, va ikki qavsda ham minus turibdi.", 'На этот раз прямоугольника нет, и в обеих скобках минус.', 'This time there is no rectangle, and both brackets have a minus.'),
    A('mount', "O'rtadagi ishora va oxirgi ishora boshqacha chiqadi.", 'Знак в середине и знак в конце выйдут разными.', 'The sign in the middle and the sign at the end will come out different.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Hamma ko'paytma hisoblangan, hisob to'g'ri, lekin
// OXIRGI KATAKDA ikki minus MINUS berib qo'yilgan. Xato birinchi
// aynan o'sha qatorda.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "To'rt ko'paytma ham yozilgan, tushib qolgani yo'q. Shunday bo'lsa ham, qaysi qator xato?",
    'Все четыре произведения записаны, пропущенных нет. И всё же какая строка ошибочна?',
    'All four products are written, none is missing. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '(x − 4)(x − 5)' },
    { id: 'r2', text: 'x · (−5) = −5x' },
    { id: 'r3', text: '(−4) · x = −4x' },
    { id: 'r4', text: '(−4) · (−5) = −20' },
    { id: 'r5', text: L('javob: x² − 9x − 20', 'ответ: x² − 9x − 20', 'answer: x² − 9x − 20') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: x karra manfiy besh manfiy besh x beradi.", 'Верно: x на минус пять даёт минус пять x.', 'Right: x times minus five gives minus five x.'),
    r3: L("To'g'ri: manfiy to'rt karra x manfiy to'rt x beradi.", 'Верно: минус четыре на x даёт минус четыре x.', 'Right: minus four times x gives minus four x.'),
    r5: L("Bu qator oldingisidan chiqadi. Xato undan oldin paydo bo'lgan.", 'Эта строка следует из предыдущей. Ошибка появилась раньше.', 'This line follows from the previous one. The mistake appeared earlier.'),
  },
  tags: { r1: 'Z3', r2: 'Z3', r3: 'Z3', r5: 'Z3' },
  proofFill: {
    template: ['(−4) · (−5)  =  ', { slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: '+ 20' },
      { id: 'b', label: 'x² − 9x + 20' },
      { id: 'c', label: '− 20' },
      { id: 'd', label: 'x² − 9x − 20' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Oxirgi ko'paytmani hisoblang va javobni tuzating.",
      'Посчитай последнее произведение и исправь ответ.',
      'Work out the last product and put the answer right.',
    ),
    checkNote: L(
      "Ikki minus musbat beradi, shuning uchun oxirgi had musbat yigirma bo'ladi.",
      'Два минуса дают плюс, поэтому последний член это плюс двадцать.',
      'Two minuses give a plus, so the last term is plus twenty.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z3', hint: L("Minus to'rt karra minus besh: ikkita minus bor.", 'Минус четыре на минус пять: минусов два.', 'Minus four times minus five: there are two minuses.') },
      { key: 'd', tag: 'Z3', hint: L("Javobning oxirgi hadi ham tuzatiladi.", 'Последний член ответа тоже исправляется.', 'The last term of the answer gets fixed too.') },
      { key: '*', tag: 'Z3', hint: L("Ikki minusning ko'paytmasi musbat.", 'Произведение двух минусов положительно.', 'The product of two minuses is positive.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda hamma ko'paytma yozilgan, tushib qolgani yo'q.", 'В этой ловушке все произведения записаны, пропущенных нет.', 'In this trap every product is written, none is missing.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Oxirgi katakda ikki minus musbat berishi kerak edi.", 'Нашёл. В последней клетке два минуса должны были дать плюс.', 'You found it. In the last cell two minuses should have given a plus.'),
    A('done', "Ko'paytmalar soni to'g'ri bo'lsa ham, har birining ishorasi tekshiriladi.", 'Даже если число произведений верно, знак каждого проверяется.', 'Even when the product count is right, the sign of each one gets checked.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TESKARI YO'L: ko'paytma va bitta qavs berilgan,
// ikkinchi qavs izlanadi. 22 va 23-darslarning tayyorgarligi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE INVERSE TASK'),
  title: L('Ikkinchi qavsni tiklash', 'Восстановить вторую скобку', 'Restoring the second bracket'),
  given: L(
    "Ko'paytma ma'lum, bitta qavs ham ma'lum. Ikkinchi qavsda nima turgan edi?",
    'Произведение известно, одна скобка тоже известна. Что стояло во второй?',
    'The product is known and one bracket is known. What was in the second?',
  ),
  template: ['6a² − 7a − 20  =  (2a − 5)(3a ', { slot: 0 }, ')'],
  parts: [
    { id: 'a', label: '+ 4' },
    { id: 'b', label: '− 4' },
    { id: 'c', label: '+ 4a' },
    { id: 'd', label: '+ 5' },
  ],
  answer: ['a'],
  prompt: L(
    "Oxirgi ko'paytmadan boshlang: u manfiy yigirma berishi kerak.",
    'Начни с последнего произведения: оно должно дать минус двадцать.',
    'Start from the last product: it must give minus twenty.',
  ),
  checkNote: L(
    "Manfiy besh karra to'rt manfiy yigirma beradi, o'rtada esa sakkiz a dan o'n besh a ayirilib manfiy yetti a chiqadi.",
    'Минус пять на четыре даёт минус двадцать, а в середине из восьми a вычитается пятнадцать a и выходит минус семь a.',
    'Minus five times four gives minus twenty, and in the middle fifteen a is taken from eight a, giving minus seven a.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Manfiy besh karra manfiy to'rt musbat yigirma berardi, bizga esa manfiy kerak.", 'Минус пять на минус четыре дало бы плюс двадцать, а нужен минус.', 'Minus five times minus four would give plus twenty, but a minus is needed.') },
    { key: 'c', tag: 'Z4', hint: L("Unda oxirgi hadda harf qolardi, javobda esa u son.", 'Тогда в последнем члене осталась бы буква, а в ответе он число.', 'Then the last term would keep a letter, but in the answer it is a number.') },
    { key: 'd', tag: 'Z6', hint: L("Manfiy besh karra besh manfiy yigirma besh beradi.", 'Минус пять на пять даёт минус двадцать пять.', 'Minus five times five gives minus twenty five.') },
  ],
  audio: [
    A('mount', "Bu safar teskari yo'l: ko'paytma bor, ikkinchi qavsning bir hadi esa yo'q.", 'На этот раз обратный путь: произведение есть, а одного члена второй скобки нет.', 'This time the inverse path: the product is there, but one term of the second bracket is not.'),
    A('mount', "Oxirgi ko'paytmadan boshlash qulay: unda faqat sonlar qatnashadi.", 'Удобно начать с последнего произведения: в нём участвуют только числа.', 'It is easier to start from the last product: only numbers take part in it.'),
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
      prompt: '(x + 1)(x + 6)',
      ok: L("Birlik ham had, u ikki ko'paytmada qatnashdi.", 'Единица тоже член, она участвовала в двух произведениях.', 'One is a term too, it took part in two products.'),
      items: [
        { id: 'a', label: 'x² + 7x + 6', correct: true },
        { id: 'b', label: 'x² + 6', tag: 'Z1', hint: L("O'rta kataklar bo'sh emas: olti x va x.", 'Средние клетки не пусты: шесть x и x.', 'The middle cells are not empty: six x and x.') },
        { id: 'c', label: 'x² + 6x + 6', tag: 'Z2', hint: L("Birlik x ga ham ko'paytiriladi va yana bitta x beradi.", 'Единица умножается и на x, и даёт ещё один x.', 'The one is multiplied by x as well and gives one more x.') },
        { id: 'd', label: 'x² + 7x + 7', tag: 'Z6', hint: L("Oxirgi katakda bir karra olti, ya'ni olti.", 'В последней клетке один на шесть, то есть шесть.', 'The last cell is one times six, that is six.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(a − 3)(a + 3)',
      ok: L("O'rta ikki ko'paytma bir-birini yo'q qildi.", 'Два средних произведения уничтожили друг друга.', 'The two middle products cancelled each other.'),
      items: [
        { id: 'a', label: 'a² − 9', correct: true },
        { id: 'b', label: 'a² + 9', tag: 'Z3', hint: L("Oxirgi katakda manfiy uch karra uch turibdi.", 'В последней клетке минус три на три.', 'The last cell is minus three times three.') },
        { id: 'c', label: 'a² − 6a − 9', tag: 'Z5', hint: L("O'rtada uch a va manfiy uch a turibdi, ular nol beradi.", 'В середине три a и минус три a, они дают ноль.', 'In the middle three a and minus three a, they give zero.') },
        { id: 'd', label: 'a² − 6a + 9', tag: 'Z3', hint: L("Bu ikki qavs bir xil bo'lganda chiqardi, bu yerda esa ishoralar boshqa.", 'Так вышло бы, если бы скобки были одинаковы, а здесь знаки разные.', 'That would come out if the brackets were the same, but here the signs differ.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(2x − 1)(x² + 3x − 5) da nechta ko'paytma bor?",
        'Сколько произведений в (2x − 1)(x² + 3x − 5)?',
        'How many products are in (2x − 1)(x² + 3x − 5)?',
      ),
      ok: L("Ikki had karra uch had olti ko'paytma beradi.", 'Два члена на три члена дают шесть произведений.', 'Two terms by three terms give six products.'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '5', tag: 'Z2', hint: L("Hadlar soni qo'shilmaydi, ko'paytiriladi.", 'Числа членов не складываются, а умножаются.', 'The term counts are not added but multiplied.') },
        { id: 'c', label: '4', tag: 'Z1', hint: L("Ikkinchi qavsda uch had bor, ularning har biri ikki marta qatnashadi.", 'Во второй скобке три члена, и каждый участвует дважды.', 'The second bracket has three terms, and each takes part twice.') },
        { id: 'd', label: '3', tag: 'Z1', hint: L("Birinchi qavsda ham ikki had bor.", 'В первой скобке тоже два члена.', 'The first bracket has two terms as well.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(2y + 1)(3y − 2)',
      ok: L("O'rtada uch y dan to'rt y ayirildi va bitta manfiy y qoldi.", 'В середине из трёх y вычлось четыре y и остался один минус y.', 'In the middle four y was taken from three y and one minus y was left.'),
      items: [
        { id: 'a', label: '6y² − y − 2', correct: true },
        { id: 'b', label: '6y² + y − 2', tag: 'Z3', hint: L("To'rt y uch y dan katta, shuning uchun o'rtada minus qoladi.", 'Четыре y больше трёх y, поэтому в середине остаётся минус.', 'Four y is more than three y, so a minus stays in the middle.') },
        { id: 'c', label: '6y² − 2', tag: 'Z1', hint: L("O'rta kataklar bo'sh emas: manfiy to'rt y va uch y.", 'Средние клетки не пусты: минус четыре y и три y.', 'The middle cells are not empty: minus four y and three y.') },
        { id: 'd', label: '6y² − 4y − 2', tag: 'Z2', hint: L("Birlik ham uch y ga ko'paytiriladi.", 'Единица тоже умножается на три y.', 'The one is multiplied by three y as well.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida qavslarning ishoralari boshqa.", 'Во втором у скобок разные знаки.', 'In the second the brackets have different signs.'),
    A('2', "Uchinchisida ko'paytmalar sonini sanang.", 'В третьем посчитай число произведений.', 'In the third, count the number of products.'),
    A('3', "Oxirgisida o'rta had bittagina.", 'В последнем средний член всего один.', 'In the last one the middle term is just one.'),
  ],
}

// ============================================================
// 15. YAKUN. Yangi matematika yo'q (§4.2): xuk sahnasi tuzatiladi.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Har had har hadga', 'Каждый член на каждый', 'Every term by every term'),
  gate: S1.gate,
  fix: {
    tokens: ['x²', '+', '8x', '+', '15'],
    value: '4',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Ikki qavsda ham ikki had bor edi, ya'ni to'rt katak va to'rt ko'paytma. O'rtadagi besh x va uch x qo'shilib sakkiz x berdi.",
    'В обеих скобках было по два члена, значит четыре клетки и четыре произведения. Средние пять x и три x сложились в восемь x.',
    'Both brackets had two terms, so four cells and four products. The middle five x and three x added into eight x.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    four: L("to'rtta ko'paytma", 'четыре произведения', 'four products'),
    two: L("ikkita ko'paytma", 'два произведения', 'two products'),
    three: L("uchta ko'paytma", 'три произведения', 'three products'),
    inside: L('avval qavs ichi', 'сначала внутри скобок', 'the brackets first'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(x + 3)(x + 5) → 4', '(2x + 1)(x + 5) → 4', '(2a − 3)(a + 4) → 4', '(x − 2)(x + 2) → x² − 4'],
  twoLabel: L('B4 bloki davom etadi', 'Блок Б4 продолжается', 'Block B4 continues'),
  twoA: L(
    "kataklar  →  chapdagi hadlar karra yuqoridagi hadlar",
    'клетки  →  члены слева на члены сверху',
    'cells  →  terms on the left by terms on top',
  ),
  twoB: L(
    "o'xshashlar  →  oxirida ixchamlanadi",
    'подобные  →  приводятся в конце',
    'like terms  →  collected at the end',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "umumiy ko'paytuvchini qavsdan chiqarish",
    'вынесение общего множителя за скобки',
    'taking a common factor out of the brackets',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish ikki qadamdan chiqdi: har had har hadga, keyin o'xshashlarni ixchamlash.", 'Вся сегодняшняя работа вышла из двух шагов: каждый член на каждый, потом приведение подобных.', 'All of today came from two steps: every term by every term, then collecting like terms.'),
    A('mount', "Keyingi darsda teskari yo'lga o'tamiz: ko'paytma bor, qavs esa izlanadi.", 'На следующем уроке пойдём обратным путём: произведение есть, а скобку надо найти.', 'Next lesson we go the inverse way: the product is there, and the bracket has to be found.'),
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
