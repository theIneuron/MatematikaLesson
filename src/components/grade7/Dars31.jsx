// ============================================================================
// 7-sinf, Dars 31. KUBLAR YIG'INDISI VA AYIRMASI.
// (Сумма и разность кубов)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// ASOSIY ARALASHTIRISH: kublar YIG'INDISI va yig'indining KUBI. Ular
// butunlay boshqa narsa, va xuk shuni sonlar bilan ko'rsatadi: bir va
// ikkining kublari yig'indisi to'qqiz, yig'indining kubi esa yigirma yetti.
//
// ASBOB O'SHA TO'RTBURCHAK, 2 KARRA 3. Chapda ikki hadli qavs, yuqorida
// TO'LIQSIZ KVADRAT. Olti katak ochiladi va TO'RTTASI juft-juft bo'lib
// yo'q bo'ladi -- shuning uchun javobda faqat ikki kub qoladi. Bu ko'rinadi,
// e'lon qilinmaydi.
//
// TO'LIQSIZ KVADRAT nomi shuning uchun: `a² − ab + b²` da o'rta had
// IKKI KARRA emas. Aynan shu bitta ikkilikning yo'qligi to'rt katakni
// yo'q qiladi. Atama draft: darslikda (66-bet) formulalar bor, nomlanishi
// o'zbek metodisti tomonidan tasdiqlanishi kerak.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_31'
const LESSON_TITLE = L("Kublar yig'indisi va ayirmasi", 'Сумма и разность кубов', 'The sum and difference of cubes')
const LESSON_NO = L('31-dars', 'Урок 31', 'Lesson 31')
const BLOCK = { label: L('B5-blok', 'Блок Б5', 'Block B5'), from: 25, to: 32, current: 31 }

const TAGS = {
  Z1: L("kublar yig'indisi kub bilan almashtirildi", 'сумму кубов спутали с кубом суммы', 'the sum of cubes was mixed up with the cube of a sum'),
  Z2: L("o'rta ko'paytmalar yo'q bo'lmadi", 'средние произведения не уничтожились', 'the middle products did not cancel'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L("koeffitsiyent va ko'rsatkich", 'коэффициент и показатель', 'the coefficient and the exponent'),
  Z5: L("to'liqsiz kvadrat o'qilmadi", 'неполный квадрат не прочитан', 'the incomplete square was not read'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. SONLAR BILAN: kublar yig'indisi va yig'indining kubi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("KUBLAR YIG'INDISI", 'СУММА КУБОВ', 'THE SUM OF CUBES'),
  noBack: true,
  noNotes: true,
  title: L('Qaysi ajratma to\'g\'ri', 'Какое разложение верно', 'Which factorization is right'),
  gate: {
    source: { kind: 'plain', tokens: ['1³', '+', '2³'] },
    rows: [
      { tokens: ['(1', '+', '2)³'], value: '27' },
      { tokens: ['(1', '+', '2)', '·', '3'], value: '9' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Bir va ikkining kublari yig'indisi to'qqizga teng. Ikki o'quvchi uni ikki xil ajratdi. Tabloda natija turadi. Kim haq?",
      'Сумма кубов одного и двух равна девяти. Два ученика разложили её по-разному. На табло результат. Кто прав?',
      'The sum of the cubes of one and two is nine. Two students factored it differently. The boards show the results. Who is right?',
    ),
    items: [
      {
        id: 'pair',
        label: L('Ikki qavsga ajratgani', 'Тот, у кого две скобки', 'The one with two brackets'),
        hint: L(
          "Taxminingiz qabul qilindi. To'rtburchakda tekshiramiz.",
          'Прогноз принят. Проверим на прямоугольнике.',
          'Your prediction is taken. We will check it on the rectangle.',
        ),
      },
      {
        id: 'cube',
        label: L("Yig'indining kubini olgani", 'Тот, кто взял куб суммы', 'The one who took the cube of a sum'),
        hint: L(
          "Yig'indining kubi yigirma yetti, kublar yig'indisi esa to'qqiz. Bu boshqa narsa.",
          'Куб суммы это двадцать семь, а сумма кубов девять. Это разные вещи.',
          'The cube of a sum is twenty seven, the sum of cubes is nine. Different things.',
        ),
      },
      {
        id: 'both',
        label: L('Ikkovi ham to\'g\'ri', 'Оба верны', 'Both are right'),
        hint: L(
          "Bir xil sonlarda yigirma yetti va to'qqiz chiqdi.",
          'При одних и тех же числах вышло двадцать семь и девять.',
          'The same numbers gave twenty seven and nine.',
        ),
      },
      {
        id: 'none',
        label: L("Kublar yig'indisini ajratib bo'lmaydi", 'Сумму кубов разложить нельзя', 'A sum of cubes cannot be factored'),
        hint: L(
          "Ajratma bor, faqat ikkinchi qavs kvadrat emas: unda o'rta had ikki karra emas.",
          'Разложение есть, только вторая скобка не квадрат: в ней средний член не двойной.',
          'A factorization exists, but the second bracket is not a square: its middle term is not doubled.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bir va ikkining kublari yig'indisi to'qqizga teng.", 'Сумма кубов одного и двух равна девяти.', 'The sum of the cubes of one and two is nine.'),
    A('mount', "Ikki o'quvchi uni ikki xil ajratdi. Tabloda natija turadi.", 'Два ученика разложили её по-разному. На табло результат.', 'Two students factored it differently. The boards show the results.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Yig'indining kubi va TO'LIQSIZ kvadrat. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch qisqa savol', 'Три коротких вопроса', 'Three short questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 1,
  items: [
    {
      wrap: false,
      prompt: '(a + b)³',
      ok: L("Yig'indining kubi to'rt hadli. Bugun boshqa narsa bilan ishlaymiz.", 'Куб суммы это четыре члена. Сегодня работаем с другим.', 'The cube of a sum has four terms. Today we work with something else.'),
      items: [
        { id: 'a', label: 'a³ + 3a²b + 3ab² + b³', correct: true },
        { id: 'b', label: 'a³ + b³', tag: 'Z1', hint: L("Kublar orasida yana ikki had bor.", 'Между кубами есть ещё два члена.', 'Two more terms sit between the cubes.') },
        { id: 'c', label: 'a³ + 2a²b + 2ab² + b³', tag: 'Z6', hint: L("O'xshash kataklar uchtadan edi.", 'Подобных клеток было по три.', 'There were three like cells of each.') },
        { id: 'd', label: 'a³ − 3a²b + 3ab² − b³', tag: 'Z3', hint: L("Qavsda qo'shuv turgan edi.", 'В скобке было сложение.', 'The bracket had a plus.') },
      ],
    },
    {
      wrap: false,
      prompt: 'a · a²',
      ok: L("Ko'paytuvchilar uchta.", 'Множителей три.', 'Three factors.'),
      items: [
        { id: 'a', label: 'a³', correct: true },
        { id: 'b', label: 'a⁴', tag: 'Z4', hint: L("Bir va ikki uch beradi.", 'Один и два дают три.', 'One and two give three.') },
        { id: 'c', label: '2a²', tag: 'Z4', hint: L("Bu ko'paytirish, qo'shish emas.", 'Это умножение, а не сложение.', 'This is multiplication, not addition.') },
        { id: 'd', label: 'a²', tag: 'Z4', hint: L("Yana bitta ko'paytuvchi qo'shildi.", 'Добавился ещё один множитель.', 'One more factor was added.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "a² − ab + b² ayirmaning kvadratidan nimasi bilan farq qiladi?",
        'Чем a² − ab + b² отличается от квадрата разности?',
        'How does a² − ab + b² differ from the square of a difference?',
      ),
      ok: L("Ayirmaning kvadratida o'rta had IKKI KARRA bo'ladi.", 'В квадрате разности средний член ДВОЙНОЙ.', 'In the square of a difference the middle term is DOUBLED.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L("o'rta had ikki karra emas", 'средний член не двойной', 'the middle term is not doubled'),
        },
        {
          id: 'b',
          tag: 'Z5',
          label: L('hech qanday farqi yo\'q', 'ничем не отличается', 'no difference at all'),
          hint: L("Ayirmaning kvadratida ikki ab turadi, bu yerda esa oddiy ab.", 'В квадрате разности стоит два ab, а здесь обычное ab.', 'The square of a difference holds two ab, here it is plain ab.'),
        },
        {
          id: 'c',
          tag: 'Z5',
          label: L('ishorasi bilan', 'знаком', 'by the sign'),
          hint: L("Ishora bir xil, farq o'rta hadning koeffitsiyentida.", 'Знак тот же, отличается коэффициент среднего члена.', 'The sign is the same, the middle coefficient differs.'),
        },
        {
          id: 'd',
          tag: 'Z6',
          label: L("bu yerda b kvadrat yo'q", 'здесь нет b в квадрате', 'there is no b squared here'),
          hint: L("b kvadrat ikkovida ham bor.", 'b в квадрате есть в обоих.', 'b squared is in both.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Uchinchisi bugungi darsning kaliti.", 'Три коротких вопроса. Третий это ключ к уроку.', 'Three short questions. The third is the key to this lesson.'),
    A('1', "Ikkinchisi ko'rsatkichlar haqida.", 'Второй про показатели.', 'The second is about exponents.'),
    A('2', "Uchinchisiga diqqat: bitta ikkilikning yo'qligi hammasini o'zgartiradi.", 'Внимание на третий: отсутствие одной двойки меняет всё.', 'Watch the third: one missing two changes everything.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. TO'RTBURCHAK: olti katak, TO'RTTASI yo'q bo'ladi.
// ============================================================
const S3 = {
  kind: 'grid',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('To\'rtta katak yo\'q bo\'ladi', 'Четыре клетки уничтожаются', 'Four cells cancel out'),
  caption: L(
    "Yuqorida to'liqsiz kvadrat turadi: o'rta had ikki karra emas. Olti katakni bosing.",
    'Сверху стоит неполный квадрат: средний член не двойной. Нажми на шесть клеток.',
    'On top is the incomplete square: the middle term is not doubled. Tap the six cells.',
  ),
  left: ['a', '+b'],
  top: ['a²', '−ab', '+b²'],
  cols: 1,
  options: [
    { id: 'a', label: 'a³ + b³' },
    { id: 'b', label: 'a³ + 3a²b + 3ab² + b³' },
    { id: 'c', label: 'a³ − b³' },
    { id: 'd', label: 'a³ + a²b + b³' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Bu yig'indining kubi. Bu yerda esa o'rta kataklar juft-juft bo'lib yo'q bo'ladi.", 'Это куб суммы. А здесь средние клетки уничтожаются парами.', 'That is the cube of a sum. Here the middle cells cancel in pairs.') },
    { key: 'c', tag: 'Z3', hint: L("Birinchi katak a karra a kvadrat, ya'ni musbat a kub.", 'Первая клетка это a на a в квадрате, то есть плюс a в кубе.', 'The first cell is a times a squared, that is plus a cubed.') },
    { key: 'd', tag: 'Z2', hint: L("a kvadrat b li kataklar ikkita va ular qarama-qarshi ishorali.", 'Клеток с a в квадрате b две, и знаки у них противоположны.', 'There are two a squared b cells, with opposite signs.') },
  ],
  note: L(
    "Olti katak, va to'rttasi juft-juft bo'lib yo'q bo'ldi: minus a kvadrat b bilan musbat a kvadrat b, minus ab kvadrat bilan musbat ab kvadrat. Faqat ikki kub qoldi.",
    'Шесть клеток, и четыре уничтожились парами: минус a в квадрате b с плюс a в квадрате b, минус ab в квадрате с плюс ab в квадрате. Остались только два куба.',
    'Six cells, and four cancelled in pairs: minus a squared b with plus a squared b, minus ab squared with plus ab squared. Only the two cubes remain.',
  ),
  audio: [
    A('mount', "Chapda ikki hadli qavs, yuqorida esa uch hadli to'liqsiz kvadrat.", 'Слева двучлен, а сверху трёхчленный неполный квадрат.', 'A binomial on the left, and a three term incomplete square on top.'),
    A('mount', "Olti katakni bosing va ishoralarga qarang.", 'Нажми на шесть клеток и смотри на знаки.', 'Tap the six cells and watch the signs.'),
    A('cell-all', "To'rt katak juft-juft bo'lib yo'q bo'ldi. Ikki kub qoldi.", 'Четыре клетки уничтожились парами. Остались два куба.', 'Four cells cancelled in pairs. The two cubes remain.'),
  ],
}

// ============================================================
// 4. FARQLASH. KUBLAR AYIRMASI: qavsda minus, to'liqsiz kvadratda
// esa QO'SHUV.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Kublar ayirmasi', 'Разность кубов', 'The difference of cubes'),
  caption: L(
    "Endi chapda ayirish, yuqorida esa o'rta had MUSBAT. Olti katakni bosing.",
    'Теперь слева вычитание, а сверху средний член ПОЛОЖИТЕЛЬНЫЙ. Нажми на шесть клеток.',
    'Now the left subtracts, and the middle term on top is POSITIVE. Tap the six cells.',
  ),
  left: ['a', '−b'],
  top: ['a²', '+ab', '+b²'],
  cols: 1,
  options: [
    { id: 'a', label: 'a³ − b³' },
    { id: 'b', label: 'a³ + b³' },
    { id: 'c', label: 'a³ − 3a²b + 3ab² − b³' },
    { id: 'd', label: 'a³ − a²b − b³' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Oxirgi katakda minus b karra b kvadrat, ya'ni manfiy b kub.", 'В последней клетке минус b на b в квадрате, то есть минус b в кубе.', 'The last cell is minus b times b squared, that is minus b cubed.') },
    { key: 'c', tag: 'Z1', hint: L("Bu ayirmaning kubi. Bu yerda esa o'rta kataklar yo'q bo'ladi.", 'Это куб разности. А здесь средние клетки уничтожаются.', 'That is the cube of a difference. Here the middle cells cancel.') },
    { key: 'd', tag: 'Z2', hint: L("a kvadrat b li ikki katak qarama-qarshi ishorali.", 'Две клетки с a в квадрате b имеют противоположные знаки.', 'The two a squared b cells have opposite signs.') },
  ],
  note: L(
    "Farq ikki joyda va u qat'iy: qavsda MINUS bo'lsa, to'liqsiz kvadratda o'rta had MUSBAT bo'ladi. Aks holda o'rta kataklar yo'q bo'lmaydi.",
    'Отличие в двух местах и оно строгое: если в скобке МИНУС, то в неполном квадрате средний член ПОЛОЖИТЕЛЕН. Иначе средние клетки не уничтожатся.',
    'The difference sits in two places and it is strict: a MINUS in the bracket means a POSITIVE middle term in the incomplete square. Otherwise the middle cells will not cancel.',
  ),
  audio: [
    A('mount', "Kublar ayirmasida ikki narsa o'zgaradi: qavsdagi ishora va to'liqsiz kvadratdagi ishora.", 'В разности кубов меняются две вещи: знак в скобке и знак в неполном квадрате.', 'In a difference of cubes two things change: the bracket sign and the sign in the incomplete square.'),
    A('mount', "Olti katakni bosing.", 'Нажми на шесть клеток.', 'Tap the six cells.'),
    A('cell-all', "Yana to'rt katak yo'q bo'ldi.", 'Снова четыре клетки уничтожились.', 'Again four cells cancelled.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Ishora -- eng muhim joyi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Bitta ishora hammasini hal qiladi', 'Один знак решает всё', 'One sign decides everything'),
  template: ['a³ + b³  =  (a + b)(a² ', { slot: 0 }, ' ab + b²)'],
  parts: [
    { id: 'a', label: '−' },
    { id: 'b', label: '+' },
    { id: 'c', label: '· ' },
    { id: 'd', label: '− 2' },
  ],
  answer: ['a'],
  prompt: L(
    "To'liqsiz kvadratdagi o'rta hadning ishorasini qo'ying.",
    'Поставь знак среднего члена в неполном квадрате.',
    'Set the sign of the middle term in the incomplete square.',
  ),
  checkNote: L(
    "Faqat minus bo'lganda o'rta kataklar juft-juft bo'lib yo'q bo'ladi. Qo'shuv bo'lsa ular qoladi va javob boshqa chiqadi.",
    'Только при минусе средние клетки уничтожаются парами. При плюсе они останутся и ответ будет другим.',
    'Only with a minus do the middle cells cancel in pairs. With a plus they stay and the answer changes.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Qo'shuv bo'lganda o'rta kataklar yo'q bo'lmaydi va ortiqcha hadlar paydo bo'ladi.", 'При плюсе средние клетки не уничтожатся и появятся лишние члены.', 'With a plus the middle cells do not cancel and extra terms appear.') },
    { key: 'c', tag: 'Z6', hint: L("Bu yerda ishora kerak, ko'paytirish emas.", 'Здесь нужен знак, а не умножение.', 'A sign is needed here, not a multiplication.') },
    { key: 'd', tag: 'Z5', hint: L("To'liqsiz kvadratda o'rta had ikki karra EMAS: shunchaki ab.", 'В неполном квадрате средний член НЕ двойной: просто ab.', 'In an incomplete square the middle term is NOT doubled: just ab.') },
  ],
  audio: [
    A('mount', "To'rtburchak ishini qildi. Endi formulani yozib qo'yamiz.", 'Прямоугольник свою работу сделал. Теперь запишем формулу.', 'The rectangle has done its job. Now let us write the formula down.'),
    A('mount', "Eng muhim joyi -- o'rta hadning ishorasi.", 'Самое важное место это знак среднего члена.', 'The crucial spot is the sign of the middle term.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. SONLAR BILAN: `x³ + 8`.
// ============================================================
const S6 = {
  kind: 'grid',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Son bilan', 'С числом', 'With a number'),
  caption: L(
    "Chapda x va ikki, yuqorida to'liqsiz kvadrat: x kvadrat minus ikki x qo'shuv to'rt.",
    'Слева x и два, сверху неполный квадрат: x в квадрате минус два x плюс четыре.',
    'On the left x and two, on top the incomplete square: x squared minus two x plus four.',
  ),
  left: ['x', '+2'],
  top: ['x²', '−2x', '+4'],
  cols: 1,
  options: [
    { id: 'a', label: 'x³ + 8' },
    { id: 'b', label: 'x³ + 6x² + 12x + 8' },
    { id: 'c', label: 'x³ − 8' },
    { id: 'd', label: 'x³ + 4x + 8' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Bu x qo'shuv ikkining kubi. Bizda esa boshqa ko'paytma turibdi.", 'Это куб от x плюс два. А у нас другое произведение.', 'That is the cube of x plus two. We have a different product.') },
    { key: 'c', tag: 'Z3', hint: L("Oxirgi katakda ikki karra to'rt, ya'ni musbat sakkiz.", 'В последней клетке два на четыре, то есть плюс восемь.', 'The last cell is two times four, that is plus eight.') },
    { key: 'd', tag: 'Z2', hint: L("x li kataklar qarama-qarshi ishorali va yo'q bo'ladi.", 'Клетки с x имеют противоположные знаки и уничтожаются.', 'The x cells have opposite signs and cancel.') },
  ],
  note: L(
    "Sonlar bilan ham xuddi shunday: to'rt katak yo'q bo'ldi, x kub va sakkiz qoldi. Sakkiz esa ikkining kubi.",
    'С числами точно так же: четыре клетки уничтожились, остались x в кубе и восемь. А восемь это куб двух.',
    'With numbers it is the same: four cells cancelled, leaving x cubed and eight. And eight is two cubed.',
  ),
  audio: [
    A('mount', "Endi harflar emas, son. Sakkiz bu ikkining kubi.", 'Теперь не буквы, а число. Восемь это куб двух.', 'Now a number instead of letters. Eight is two cubed.'),
    A('mount', "Olti katakni bosing.", 'Нажми на шесть клеток.', 'Tap the six cells.'),
    A('cell-all', "x li kataklar yo'q bo'ldi.", 'Клетки с x уничтожились.', 'The x cells cancelled.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH: nega ikkilik yo'q.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Nega ikkilik yo\'q', 'Почему нет двойки', 'Why there is no two'),
  letter: 'x',
  numbers: [1, 2, 3],
  rows: [
    { id: 'r1', role: 'source', expr: 'x³ + 8', sub: (n) => n + '³ + 8', val: (n) => n * n * n + 8 },
    { id: 'r2', expr: '(x + 2)(x² − 2x + 4)', sub: (n) => '(' + n + ' + 2)(' + n + '² − 2 · ' + n + ' + 4)', val: (n) => (n + 2) * (n * n - 2 * n + 4) },
  ],
  probe: {
    question: L(
      "Ikkinchi qavsda o'rta had ikki karra emas. Nega shunday?",
      'Во второй скобке средний член не двойной. Почему так?',
      'The middle term in the second bracket is not doubled. Why is that?',
    ),
    items: [
      {
        id: 'cancel',
        correct: true,
        label: L("Shundagina o'rta kataklar yo'q bo'ladi", 'Только тогда средние клетки уничтожаются', 'Only then do the middle cells cancel'),
      },
      {
        id: 'typo',
        tag: 'Z5',
        label: L("Bu xato, unda ikki ab bo'lishi kerak", 'Это опечатка, там должно быть два ab', 'That is a typo, it should be two ab'),
        hint: L(
          "Ikkilik bilan qatorlar mos kelmaydi: birda o'n emas, boshqa son chiqadi.",
          'С двойкой строки не совпадут: при единице выйдет не девять, а другое число.',
          'With a two the rows will not match: at one it gives something other than nine.',
        ),
      },
      {
        id: 'sq',
        tag: 'Z1',
        label: L('Bu ayirmaning kvadrati', 'Это квадрат разности', 'That is a square of a difference'),
        hint: L(
          "Ayirmaning kvadratida o'rta had ikki karra bo'ladi, bu yerda esa yo'q.",
          'В квадрате разности средний член двойной, а здесь нет.',
          'In a square of a difference the middle term is doubled, here it is not.',
        ),
      },
      {
        id: 'any',
        tag: 'Z6',
        label: L('Koeffitsiyent muhim emas', 'Коэффициент не важен', 'The coefficient does not matter'),
        hint: L(
          "Muhim: ikkilik qo'yilsa, qiymat boshqa bo'lib qoladi.",
          'Важен: если поставить двойку, значение станет другим.',
          'It matters: putting a two there changes the value.',
        ),
      },
    ],
  },
  okText: L(
    "Ikkinchi qavs TO'LIQSIZ kvadrat deb ataladi: o'rta had ikki karra emas. Aynan shu tufayli to'rt o'rta katak juft-juft yo'q bo'ladi.",
    'Вторая скобка называется НЕПОЛНЫМ квадратом: средний член не двойной. Именно поэтому четыре средние клетки уничтожаются парами.',
    'The second bracket is called an INCOMPLETE square: the middle term is not doubled. That is exactly why the four middle cells cancel in pairs.',
  ),
  audio: [
    A('mount', "Yuqorida kublar yig'indisi, pastda uning ajratmasi.", 'Сверху сумма кубов, снизу её разложение.', 'Above a sum of cubes, below its factorization.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Qatorlar mos keldi.", 'Строки совпали.', 'The rows matched.'),
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
    { id: 'f1', label: L("kublar yig'indisi ikki qavsga ajratiladi", 'сумма кубов разлагается на две скобки', 'a sum of cubes factors into two brackets') },
    { id: 'f2', label: L("birinchisi -- ildizlarning yig'indisi", 'первая это сумма корней', 'the first is the sum of the roots') },
    { id: 'f3', label: L("ikkinchisi -- to'liqsiz kvadrat", 'вторая это неполный квадрат', 'the second is the incomplete square') },
    { id: 'f4', label: L("va uning o'rta hadi qarama-qarshi ishorali", 'и его средний член с противоположным знаком', 'and its middle term takes the opposite sign') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval ajratma, keyin birinchi qavs, keyin ikkinchisi, oxirida ishora.",
    'Порядок нарушен. Сначала разложение, потом первая скобка, потом вторая, в конце знак.',
    'The order is off. The factorization first, then the first bracket, then the second, and the sign last.',
  ),
  lawChips: [
    { label: '( ) ( )', tone: 'par' },
    { label: '·', tone: 's2' },
    { label: '−', tone: 's1' },
    { label: '3', tone: 'off' },
  ],
  lawSweep: L(
    "ikki qavs, ko'paytirish, ishora, uchinchi daraja",
    'две скобки, умножение, знак, третья степень',
    'two brackets, multiplication, the sign, the third power',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Kublar yig'indisi ildizlarning yig'indisiga va to'liqsiz kvadratga ajratiladi: birinchi ildizning kvadrati, minus ildizlarning ko'paytmasi, qo'shuv ikkinchi ildizning kvadrati.",
        'Сумма кубов разлагается на сумму корней и неполный квадрат: квадрат первого корня, минус произведение корней, плюс квадрат второго корня.',
        'A sum of cubes factors into the sum of the roots and an incomplete square: the square of the first root, minus the product of the roots, plus the square of the second.',
      ),
      L(
        "Kublar ayirmasida ikki ishora almashadi: birinchi qavsda ayirish, to'liqsiz kvadratda esa o'rta had musbat bo'ladi. To'liqsiz kvadratning o'rta hadi HAR DOIM ikki karra emas.",
        'В разности кубов меняются два знака: в первой скобке вычитание, а в неполном квадрате средний член положителен. Средний член неполного квадрата ВСЕГДА не двойной.',
        'In a difference of cubes two signs change: the first bracket subtracts and the incomplete square has a positive middle term. That middle term is NEVER doubled.',
      ),
    ],
  },
  hookCap: L(
    "Olti katak, to'rttasi yo'q bo'ladi",
    'Шесть клеток, четыре уничтожаются',
    'Six cells, four of them cancel',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("ildizlarning yig'indisi", 'сумма корней', 'the sum of the roots'),
    L("to'liqsiz kvadrat", 'неполный квадрат', 'the incomplete square'),
    L('ishora qarama-qarshi', 'знак противоположный', 'the opposite sign'),
  ],
  audio: [
    A('mount', "Ikki formulani ko'rdik. Endi qoidani yig'amiz.", 'Обе формулы мы увидели. Теперь соберём правило.', 'We have seen both formulas. Now let us build the rule.'),
    A('ok', "To'g'ri. Blokda bitta dars qoldi: algebraik kasrlar.", 'Верно. В блоке остался один урок: алгебраические дроби.', 'Correct. One lesson is left in the block: algebraic fractions.'),
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
  cols: 1,
  items: [
    {
      wrap: false,
      prompt: 'x³ + 1',
      ok: L("Ildizlar x va bir, to'liqsiz kvadratda o'rta had manfiy.", 'Корни x и один, в неполном квадрате средний член отрицательный.', 'The roots are x and one, and the incomplete square has a negative middle term.'),
      items: [
        { id: 'a', label: '(x + 1)(x² − x + 1)', correct: true },
        { id: 'b', label: '(x + 1)³', tag: 'Z1', hint: L("Bu yig'indining kubi, u to'rt hadli.", 'Это куб суммы, он из четырёх членов.', 'That is the cube of a sum, with four terms.') },
        { id: 'c', label: '(x + 1)(x² + x + 1)', tag: 'Z3', hint: L("O'rta had qavsdagi ishoraga qarama-qarshi bo'ladi.", 'Средний член противоположен знаку в скобке.', 'The middle term takes the opposite sign to the bracket.') },
        { id: 'd', label: '(x + 1)(x² − 2x + 1)', tag: 'Z5', hint: L("To'liqsiz kvadratda o'rta had ikki karra emas.", 'В неполном квадрате средний член не двойной.', 'In an incomplete square the middle term is not doubled.') },
      ],
    },
    {
      wrap: false,
      prompt: 'a³ − 27',
      ok: L("Ildizlar a va uch, qavsda ayirish, o'rta had musbat.", 'Корни a и три, в скобке вычитание, средний член положительный.', 'The roots are a and three, the bracket subtracts, the middle term is positive.'),
      items: [
        { id: 'a', label: '(a − 3)(a² + 3a + 9)', correct: true },
        { id: 'b', label: '(a − 3)(a² − 3a + 9)', tag: 'Z3', hint: L("Qavsda minus bo'lsa, o'rta had musbat bo'ladi.", 'Если в скобке минус, средний член положителен.', 'A minus in the bracket means a positive middle term.') },
        { id: 'c', label: '(a − 3)³', tag: 'Z1', hint: L("Bu ayirmaning kubi, u to'rt hadli.", 'Это куб разности, он из четырёх членов.', 'That is the cube of a difference, with four terms.') },
        { id: 'd', label: '(a − 27)(a² + 27a + 729)', tag: 'Z4', hint: L("Yigirma yettining kubdan ildizi uch.", 'Кубический корень из двадцати семи это три.', 'The cube root of twenty seven is three.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Kublar ayirmasida to'liqsiz kvadratning o'rta hadi qanday ishorali?",
        'Какой знак у среднего члена неполного квадрата в разности кубов?',
        'What sign does the middle term of the incomplete square take in a difference of cubes?',
      ),
      ok: L("Qavsdagi ishoraga qarama-qarshi, ya'ni musbat.", 'Противоположный знаку в скобке, то есть плюс.', 'The opposite of the bracket sign, so a plus.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('musbat', 'положительный', 'positive'),
        },
        {
          id: 'b',
          tag: 'Z3',
          label: L('manfiy', 'отрицательный', 'negative'),
          hint: L("Manfiy bo'lsa o'rta kataklar yo'q bo'lmaydi.", 'При отрицательном средние клетки не уничтожатся.', 'With a negative one the middle cells will not cancel.'),
        },
        {
          id: 'c',
          tag: 'Z5',
          label: L('sonlarga bog\'liq', 'зависит от чисел', 'it depends on the numbers'),
          hint: L("Ishora formula bilan belgilanadi.", 'Знак задан формулой.', 'The sign is set by the formula.'),
        },
        {
          id: 'd',
          tag: 'Z5',
          label: L("o'rta had yo'q", 'среднего члена нет', 'there is no middle term'),
          hint: L("To'liqsiz kvadratda uch had bor.", 'В неполном квадрате три члена.', 'An incomplete square has three terms.'),
        },
      ],
    },
    {
      wrap: false,
      prompt: '8x³ + 1',
      ok: L("Sakkiz x kubning ildizi ikki x.", 'Кубический корень из восьми x в кубе это два x.', 'The cube root of eight x cubed is two x.'),
      items: [
        { id: 'a', label: '(2x + 1)(4x² − 2x + 1)', correct: true },
        { id: 'b', label: '(8x + 1)(64x² − 8x + 1)', tag: 'Z4', hint: L("Sakkizning kubdan ildizi ikki.", 'Кубический корень из восьми это два.', 'The cube root of eight is two.') },
        { id: 'c', label: '(2x + 1)(2x² − 2x + 1)', tag: 'Z4', hint: L("Ikki x ning kvadrati to'rt x kvadrat.", 'Квадрат двух x это четыре x в квадрате.', 'The square of two x is four x squared.') },
        { id: 'd', label: '(2x + 1)(4x² + 2x + 1)', tag: 'Z3', hint: L("O'rta had qavsdagi ishoraga qarama-qarshi.", 'Средний член противоположен знаку скобки.', 'The middle term is opposite to the bracket sign.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Uchinchisi ishora haqida.", 'Четыре вопроса. Третий про знак.', 'Four questions. The third is about the sign.'),
    A('1', "Ikkinchisida ayirma bor.", 'Во втором есть разность.', 'The second has a difference.'),
    A('2', "Uchinchisiga o'ylab javob bering.", 'На третий ответь подумав.', 'Think before answering the third.'),
    A('3', "Oxirgisida koeffitsiyent bor.", 'В последнем есть коэффициент.', 'The last one has a coefficient.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: ildizlar, keyin o'rta had.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Katta koeffitsiyent', 'Большой коэффициент', 'A big coefficient'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['27x³ + 1  =  (', { slot: 0 }, ' + 1)(', { slot: 1 }, ' − 3x + 1)'],
  parts: [
    { id: 'a', label: '3x' },
    { id: 'b', label: '9x²' },
    { id: 'c', label: '27x' },
    { id: 'd', label: '3x²' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ildizni va uning kvadratini yozing.",
    'Запиши корень и его квадрат.',
    'Write the root and its square.',
  ),
  checkNote: L(
    "Yigirma yetti x kubning kubdan ildizi uch x, uning kvadrati esa to'qqiz x kvadrat.",
    'Кубический корень из двадцати семи x в кубе это три x, а его квадрат девять x в квадрате.',
    'The cube root of twenty seven x cubed is three x, and its square is nine x squared.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Uch x karra uch x karra uch x yigirma yetti x kub beradi.", 'Три x на три x на три x это двадцать семь x в кубе.', 'Three x by three x by three x is twenty seven x cubed.') },
    { key: 'd', tag: 'Z4', hint: L("Uch x ning kvadrati to'qqiz x kvadrat.", 'Квадрат трёх x это девять x в квадрате.', 'The square of three x is nine x squared.') },
    { key: '*', tag: 'Z4', hint: L("Avval kubdan ildiz, keyin uning kvadrati.", 'Сначала кубический корень, потом его квадрат.', 'The cube root first, then its square.') },
  ],
  probe: {
    question: L("O'rta had nega minus uch x?", 'Почему средний член минус три x?', 'Why is the middle term minus three x?'),
    items: [
      {
        id: 'a',
        correct: true,
        label: L("ildizlarning ko'paytmasi, ishorasi qarama-qarshi", 'произведение корней с противоположным знаком', 'the product of the roots with the opposite sign'),
      },
      {
        id: 'b',
        tag: 'Z5',
        label: L('ikki karra ko\'paytma', 'двойное произведение', 'the double product'),
        hint: L("To'liqsiz kvadratda ikkilik yo'q.", 'В неполном квадрате двойки нет.', 'There is no two in an incomplete square.'),
      },
      {
        id: 'c',
        tag: 'Z3',
        label: L("musbat bo'lishi kerak", 'он должен быть положительным', 'it should be positive'),
        hint: L("Qavsda qo'shuv turibdi, demak o'rta had manfiy.", 'В скобке сложение, значит средний член отрицательный.', 'The bracket adds, so the middle term is negative.'),
      },
      {
        id: 'd',
        tag: 'Z6',
        label: L('shunchaki shunday qabul qilingan', 'просто так принято', 'it is just a convention'),
        hint: L("Bu kelishuv emas: minus bo'lmasa o'rta kataklar yo'q bo'lmaydi.", 'Это не соглашение: без минуса средние клетки не уничтожатся.', 'It is not a convention: without the minus the middle cells will not cancel.'),
      },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval ildiz va uning kvadrati, keyin o'rta had haqida savol.", 'Два шага. Сначала корень и его квадрат, потом вопрос про средний член.', 'Two steps. The root and its square first, then a question about the middle term.'),
    A('mount', "Yigirma yetti bu uchning kubi.", 'Двадцать семь это куб трёх.', 'Twenty seven is three cubed.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Ikki ishora', 'Два знака', 'Two signs'),
  template: ['a³ − 64  =  (a − 4)(a² ', { slot: 0 }, ' 4a ', { slot: 1 }, ' 16)'],
  parts: [
    { id: 'a', label: '+' },
    { id: 'b', label: '+' },
    { id: 'c', label: '−' },
    { id: 'd', label: '− 2' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "To'liqsiz kvadratdagi ikki ishorani qo'ying.",
    'Поставь два знака в неполном квадрате.',
    'Set the two signs in the incomplete square.',
  ),
  checkNote: L(
    "Kublar ayirmasida to'liqsiz kvadratning ikki ishorasi ham musbat. Oltmish to'rt bu to'rtning kubi, uning kvadrati esa o'n olti.",
    'В разности кубов оба знака неполного квадрата положительны. Шестьдесят четыре это куб четырёх, а его квадрат шестнадцать.',
    'In a difference of cubes both signs of the incomplete square are positive. Sixty four is four cubed, and its square is sixteen.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("Qavsda minus turibdi, demak o'rta had musbat.", 'В скобке минус, значит средний член положительный.', 'The bracket has a minus, so the middle term is positive.') },
    { key: 'd', tag: 'Z5', hint: L("To'liqsiz kvadratda ikkilik yo'q.", 'В неполном квадрате двойки нет.', 'There is no two in an incomplete square.') },
    { key: '*', tag: 'Z3', hint: L("Kublar ayirmasida to'liqsiz kvadrat butunlay musbat.", 'В разности кубов неполный квадрат целиком положителен.', 'In a difference of cubes the incomplete square is all positive.') },
  ],
  audio: [
    A('mount', "Bu safar ikki ishorani ham o'zingiz qo'yasiz.", 'На этот раз оба знака ставишь сам.', 'This time you set both signs yourself.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Ildizlar to'g'ri, lekin KUBLAR YIG'INDISI
// o'rniga YIG'INDINING KUBI olingan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Ildizlar to'g'ri topilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Корни найдены верно. И всё же какая строка ошибочна?',
    'The roots are found right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: 'x³ + 27' },
    { id: 'r2', text: '27 = 3 · 3 · 3' },
    { id: 'r3', text: L('ildizlar: x va 3', 'корни: x и 3', 'roots: x and 3') },
    { id: 'r4', text: L('javob: (x + 3)³', 'ответ: (x + 3)³', 'answer: (x + 3)³') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: yigirma yetti uchning kubi.", 'Верно: двадцать семь это куб трёх.', 'Right: twenty seven is three cubed.'),
    r3: L("To'g'ri: ildizlar x va uch.", 'Верно: корни x и три.', 'Right: the roots are x and three.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r3: 'Z1' },
  proofFill: {
    template: ['(x + 3)³  =  x³ + 9x² + 27x + 27   →   x³ + 27  =  (x + 3)(', { slot: 0 }, ' − 3x + ', { slot: 1 }, ')'],
    parts: [
      { id: 'a', label: 'x²' },
      { id: 'b', label: '9' },
      { id: 'c', label: '3x²' },
      { id: 'd', label: '27' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Yig'indining kubi ortiqcha hadlar berdi. To'g'ri ajratmani yozing.",
      'Куб суммы дал лишние члены. Запиши верное разложение.',
      'The cube of a sum gave extra terms. Write the right factorization.',
    ),
    checkNote: L(
      "Yig'indining kubida to'rt had bor, kublar yig'indisida esa ikki. Ajratma ikki qavsdan iborat: yig'indi va to'liqsiz kvadrat.",
      'В кубе суммы четыре члена, а в сумме кубов два. Разложение из двух скобок: сумма и неполный квадрат.',
      'The cube of a sum has four terms, a sum of cubes has two. The factorization is two brackets: the sum and the incomplete square.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z4', hint: L("To'liqsiz kvadratda birinchi had x ning kvadrati.", 'В неполном квадрате первый член это квадрат x.', 'In the incomplete square the first term is x squared.') },
      { key: 'd', tag: 'Z4', hint: L("Oxirgi had ildizning KVADRATI, ya'ni to'qqiz.", 'Последний член это КВАДРАТ корня, то есть девять.', 'The last term is the SQUARE of the root, that is nine.') },
      { key: '*', tag: 'Z1', hint: L("Kublar yig'indisi ikki qavsga ajratiladi.", 'Сумма кубов разлагается на две скобки.', 'A sum of cubes factors into two brackets.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda ildizlar to'g'ri topilgan.", 'В этой ловушке корни найдены верно.', 'In this trap the roots are found right.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Yig'indining kubi va kublar yig'indisi boshqa narsa.", 'Нашёл. Куб суммы и сумма кубов это разные вещи.', 'You found it. The cube of a sum and the sum of cubes are different things.'),
    A('done', "Kublar yig'indisi ikki qavsga ajratiladi.", 'Сумма кубов разлагается на две скобки.', 'A sum of cubes factors into two brackets.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TESKARI YO'L: ko'paytma berilgan, nima chiqadi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE INVERSE TASK'),
  title: L('Ko\'paytma nimani beradi', 'Что даст произведение', 'What the product gives'),
  given: L(
    "Ikki qavs berilgan. Ularni ko'paytirsak nima chiqadi? Hisoblab ko'rmasdan, formulani tanib olishga urinib ko'ring.",
    'Даны две скобки. Что выйдет, если их перемножить? Попробуй узнать формулу, не считая.',
    'Two brackets are given. What comes out if they are multiplied? Try to recognise the formula without computing.',
  ),
  template: ['(x + 5)(x² − 5x + 25)  =  x³ + ', { slot: 0 }],
  parts: [
    { id: 'a', label: '125' },
    { id: 'b', label: '25' },
    { id: 'c', label: '15x' },
    { id: 'd', label: '5' },
  ],
  answer: ['a'],
  prompt: L(
    "Ikkinchi had nima bo'ladi.",
    'Каким будет второй член.',
    'What the second term will be.',
  ),
  checkNote: L(
    "Ikkinchi qavs to'liqsiz kvadrat: beshning kvadrati yigirma besh, o'rta had esa minus besh x. Demak bu kublar yig'indisi, va beshning kubi bir yuz yigirma besh.",
    'Вторая скобка это неполный квадрат: квадрат пяти двадцать пять, средний член минус пять x. Значит это сумма кубов, а куб пяти сто двадцать пять.',
    'The second bracket is an incomplete square: five squared is twenty five, the middle term is minus five x. So this is a sum of cubes, and five cubed is one hundred twenty five.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Javobda ildizning KUBI turadi, kvadrati emas.", 'В ответе стоит КУБ корня, а не квадрат.', 'The answer holds the CUBE of the root, not the square.') },
    { key: 'c', tag: 'Z2', hint: L("O'rta hadlar yo'q bo'ladi: bu shu formulaning butun mohiyati.", 'Средние члены уничтожаются: в этом весь смысл формулы.', 'The middle terms cancel: that is the whole point of the formula.') },
    { key: 'd', tag: 'Z4', hint: L("Beshning kubi bir yuz yigirma besh.", 'Куб пяти это сто двадцать пять.', 'Five cubed is one hundred twenty five.') },
  ],
  audio: [
    A('mount', "Teskari yo'l: ko'paytma berilgan, natija esa yo'q.", 'Обратный путь: произведение дано, а результата нет.', 'The inverse path: the product is given, the result is not.'),
    A('mount', "Ikkinchi qavsga qarang: bu to'liqsiz kvadrat.", 'Посмотри на вторую скобку: это неполный квадрат.', 'Look at the second bracket: it is an incomplete square.'),
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
      prompt: 'x³ + 8',
      ok: L("Ildizlar x va ikki.", 'Корни x и два.', 'The roots are x and two.'),
      items: [
        { id: 'a', label: '(x + 2)(x² − 2x + 4)', correct: true },
        { id: 'b', label: '(x + 2)³', tag: 'Z1', hint: L("Bu yig'indining kubi.", 'Это куб суммы.', 'That is the cube of a sum.') },
        { id: 'c', label: '(x + 2)(x² + 2x + 4)', tag: 'Z3', hint: L("O'rta had qavsdagi ishoraga qarama-qarshi.", 'Средний член противоположен знаку скобки.', 'The middle term is opposite to the bracket sign.') },
        { id: 'd', label: '(x + 2)(x² − 4x + 4)', tag: 'Z5', hint: L("To'liqsiz kvadratda o'rta had ikki karra emas.", 'В неполном квадрате средний член не двойной.', 'In an incomplete square the middle term is not doubled.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: 'y³ − 1',
      ok: L("Qavsda ayirish, to'liqsiz kvadrat butunlay musbat.", 'В скобке вычитание, неполный квадрат целиком положителен.', 'The bracket subtracts, the incomplete square is all positive.'),
      items: [
        { id: 'a', label: '(y − 1)(y² + y + 1)', correct: true },
        { id: 'b', label: '(y − 1)(y² − y + 1)', tag: 'Z3', hint: L("Qavsda minus bo'lsa, o'rta had musbat.", 'Если в скобке минус, средний член положителен.', 'A minus in the bracket means a positive middle term.') },
        { id: 'c', label: '(y − 1)³', tag: 'Z1', hint: L("Bu ayirmaning kubi.", 'Это куб разности.', 'That is the cube of a difference.') },
        { id: 'd', label: '(y − 1)(y² + 2y + 1)', tag: 'Z5', hint: L("O'rta had ikki karra emas.", 'Средний член не двойной.', 'The middle term is not doubled.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Kublar yig'indisining ajratmasida nechta qavs bo'ladi?",
        'Сколько скобок в разложении суммы кубов?',
        'How many brackets are in the factorization of a sum of cubes?',
      ),
      ok: L("Ikkita: yig'indi va to'liqsiz kvadrat.", 'Две: сумма и неполный квадрат.', 'Two: the sum and the incomplete square.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '3', tag: 'Z1', hint: L("Uchta qavs yig'indining kubida bo'lardi.", 'Три скобки были бы в кубе суммы.', 'Three brackets would be the cube of a sum.') },
        { id: 'c', label: '1', tag: 'Z1', hint: L("Bitta qavs ajratma bo'lmaydi.", 'Одна скобка это не разложение.', 'One bracket is not a factorization.') },
        { id: 'd', label: '4', tag: 'Z6', hint: L("Qavslar ikkita, hadlar esa boshqa narsa.", 'Скобок две, а члены это другое.', 'There are two brackets, and terms are another matter.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '8a³ − 27',
      ok: L("Ildizlar ikki a va uch.", 'Корни два a и три.', 'The roots are two a and three.'),
      items: [
        { id: 'a', label: '(2a − 3)(4a² + 6a + 9)', correct: true },
        { id: 'b', label: '(2a − 3)(4a² − 6a + 9)', tag: 'Z3', hint: L("Qavsda minus bo'lsa, o'rta had musbat.", 'Если в скобке минус, средний член положителен.', 'A minus in the bracket means a positive middle term.') },
        { id: 'c', label: '(8a − 3)(64a² + 24a + 9)', tag: 'Z4', hint: L("Sakkiz a kubning kubdan ildizi ikki a.", 'Кубический корень из восьми a в кубе это два a.', 'The cube root of eight a cubed is two a.') },
        { id: 'd', label: '(2a − 3)(2a² + 6a + 9)', tag: 'Z4', hint: L("Ikki a ning kvadrati to'rt a kvadrat.", 'Квадрат двух a это четыре a в квадрате.', 'The square of two a is four a squared.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida ayirma bor.", 'Во втором есть разность.', 'The second has a difference.'),
    A('2', "Uchinchisi qavslar soni haqida.", 'Третий про число скобок.', 'The third is about the bracket count.'),
    A('3', "Oxirgisida ikki koeffitsiyent bor.", 'В последнем два коэффициента.', 'The last one has two coefficients.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Ikki qavs, to\'rtta yo\'q bo\'ldi', 'Две скобки, четыре уничтожились', 'Two brackets, four cancelled'),
  gate: S1.gate,
  fix: {
    tokens: ['(1', '+', '2)', '·', '3'],
    value: '9',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Kublar yig'indisi ikki qavsga ajratiladi: ildizlarning yig'indisi va to'liqsiz kvadrat. Bir va ikki uchun bu uch karra uch, ya'ni to'qqiz.",
    'Сумма кубов разлагается на две скобки: сумма корней и неполный квадрат. Для одного и двух это три на три, то есть девять.',
    'A sum of cubes factors into two brackets: the sum of the roots and the incomplete square. For one and two that is three times three, so nine.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    pair: L('ikki qavsga ajratish', 'разложить на две скобки', 'factor into two brackets'),
    cube: L("yig'indining kubi", 'куб суммы', 'the cube of a sum'),
    both: L('ikkovi ham', 'оба', 'both of them'),
    none: L('ajratib bo\'lmaydi', 'разложить нельзя', 'cannot be factored'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['a³ + b³ → 6', 'a³ − b³ → 6', 'x³ + 8 → (x + 2)', '8a³ − 27 → (2a − 3)'],
  twoLabel: L('B5 bloki tugayapti', 'Блок Б5 завершается', 'Block B5 is closing'),
  twoA: L(
    "olti katak  →  to'rttasi yo'q bo'ladi",
    'шесть клеток  →  четыре уничтожаются',
    'six cells  →  four cancel',
  ),
  twoB: L(
    "to'liqsiz kvadrat  →  ikkilik yo'q",
    'неполный квадрат  →  двойки нет',
    'the incomplete square  →  no two',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'algebraik kasrlar',
    'алгебраические дроби',
    'algebraic fractions',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta ishoradan chiqdi: to'liqsiz kvadratda o'rta had qarama-qarshi ishorali.", 'Вся сегодняшняя работа вышла из одного знака: в неполном квадрате средний член с противоположным знаком.', 'All of today came from one sign: the middle term of the incomplete square takes the opposite sign.'),
    A('mount', "Keyingi dars blokni yopadi: algebraik kasrlar.", 'Следующий урок закрывает блок: алгебраические дроби.', 'The next lesson closes the block: algebraic fractions.'),
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
