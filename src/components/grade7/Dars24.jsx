// ============================================================================
// 7-sinf, Dars 24. BIRHAD VA KO'PHADLARNI BO'LISH. B4 BLOKINI YOPADI.
// (Деление одночленов и многочленов)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// BO'LISH QOIDA BILAN EMAS, QISQARTIRISH BILAN KO'RSATILADI. B3 blokining
// asbobi -- KO'PAYTUVCHILAR LENTASI -- buni allaqachon qiladi: `cross`
// rejimi qisqargan ko'paytuvchilarni O'CHIRADI, va ko'rsatkichning
// ayirilishi SANOQ bo'lib qoladi, yodlanadigan qoida bo'lib qolmaydi.
// Konveyerda bu asbobning ekrani yo'q edi -- `tape` turi shu dars uchun
// qo'shildi (yangi asbob YOZILMADI, mavjudi ulandi).
//
// LENTA IKKINCHI XATONI HAM YOPADI: `a⁵ : a⁵` da hamma ko'paytuvchi
// o'chiriladi, lekin bo'linma NOL emas, BIRLIK. 22-darsda aynan shu xato
// tuzoq bo'lgan edi, bu yerda u KO'RINADI.
//
// IKKINCHI FRONT -- HADMA-HAD. Bo'linadigan narsa har had, birinchisi
// emas. Tuzoq (12-ekran) shu xatoni qo'yadi: birinchi had benuqson
// bo'lingan, ikkinchisi esa shundayligicha ko'chirilgan.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_24'
const LESSON_TITLE = L("Birhad va ko'phadlarni bo'lish", 'Деление одночленов и многочленов', 'Dividing monomials and polynomials')
const LESSON_NO = L('24-dars', 'Урок 24', 'Lesson 24')
const BLOCK = { label: L('B4-blok', 'Блок Б4', 'Block B4'), from: 18, to: 24, current: 24 }

const TAGS = {
  Z1: L('hamma had bo\'linmadi', 'разделили не все члены', 'not every term was divided'),
  Z2: L('bo\'linma birlik ekani', 'частное равно единице', 'the quotient equals one'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L("ko'rsatkichlar ayirilmadi", 'показатели не вычтены', 'the exponents were not subtracted'),
  Z5: L('boshqa ko\'paytuvchi qisqartirildi', 'сократили не тот множитель', 'the wrong factor was cancelled'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. TABLODA: nechta had bo'lingani.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("BIRHAD VA KO'PHADLARNI BO'LISH", 'ДЕЛЕНИЕ ОДНОЧЛЕНОВ И МНОГОЧЛЕНОВ', 'DIVIDING MONOMIALS AND POLYNOMIALS'),
  noBack: true,
  noNotes: true,
  title: L('Nechta had bo\'lindi', 'Сколько членов разделили', 'How many terms were divided'),
  gate: {
    source: { kind: 'plain', tokens: ['12a⁵', '−', '8a³'] },
    rows: [
      { tokens: ['3a³', '−', '2a'], value: '2' },
      { tokens: ['3a³', '−', '8a³'], value: '1' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Bu yozuv 4a² ga bo'lindi. Tabloda nechta had bo'lingani turadi. Kim haq?",
      'Эту запись разделили на 4a². На табло стоит, сколько членов при этом разделили. Кто прав?',
      'This record was divided by 4a². The boards show how many terms were actually divided. Who is right?',
    ),
    items: [
      {
        id: 'both',
        label: L('Ikkala had ham: har had bo\'linadi', 'Оба члена: делится каждый', 'Both terms: every term gets divided'),
        hint: L(
          "Taxminingiz qabul qilindi. Lenta bilan tekshiramiz.",
          'Прогноз принят. Проверим лентой множителей.',
          'Your prediction is taken. We will check it with the factor tape.',
        ),
      },
      {
        id: 'first',
        label: L("Faqat birinchisi: ikkinchisi shundayligicha ko'chiriladi", 'Только первый: второй переносится как был', 'Only the first: the second is carried over as it was'),
        hint: L(
          "Pastki tabloga qarang: sakkiz a kub o'zgarmay qolgan, bo'luvchi unga yetmagan.",
          'Посмотри на нижнее табло: восемь a в кубе осталось как было, делитель до него не дошёл.',
          'Look at the lower board: eight a cubed stayed as it was, the divisor never reached it.',
        ),
      },
      {
        id: 'none',
        label: L("Bunday bo'lib bo'lmaydi, avval ko'paytuvchini chiqarish kerak", 'Так делить нельзя, сначала надо вынести множитель', 'You cannot divide like this, the factor must come out first'),
        hint: L(
          "Chiqarish mumkin, lekin usiz ham har had to'rt a kvadratga bo'linadi.",
          'Вынести можно, но и без этого каждый член делится на четыре a в квадрате.',
          'Taking it out is allowed, but even without that each term divides by four a squared.',
        ),
      },
      {
        id: 'one',
        label: L("Bitta had: bo'luvchi bitta, demak bo'lish ham bitta", 'Один член: делитель один, значит и деление одно', 'One term: there is one divisor, so one division'),
        hint: L(
          "Bo'luvchi bitta, hadlar esa ikkita, va u har biriga boradi.",
          'Делитель один, а членов два, и он доходит до каждого.',
          'There is one divisor and two terms, and it reaches each of them.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bitta yozuv bir xil bo'luvchiga bo'lindi, javoblar esa boshqa chiqdi.", 'Одну запись разделили на один и тот же делитель, а ответы вышли разные.', 'One record was divided by the same divisor, and the answers came out different.'),
    A('mount', "Tabloda nechta had bo'lingani turadi: bittasida ikkita, ikkinchisida bitta.", 'На табло стоит, сколько членов разделили: у одного два, у другого один.', 'The boards show how many terms were divided: one has two, the other one.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Hadlar soni, darajalarni ko'paytirish va 22-darsdagi
// chiqarish. KVOTA EKRANI.
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
      wrap: true,
      question: null,
      prompt: L(
        "12a⁵ − 8a³ da nechta had bor?",
        'Сколько членов в 12a⁵ − 8a³?',
        'How many terms are in 12a⁵ − 8a³?',
      ),
      ok: L("Ayirish belgisi yozuvni ikki hadga bo'ladi.", 'Знак вычитания делит запись на два члена.', 'The minus sign splits the record into two terms.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '3', tag: 'Z1', hint: L("Ayirish belgisi had emas, u hadlarni ajratadi.", 'Знак вычитания это не член, он разделяет члены.', 'A minus sign is not a term, it separates terms.') },
        { id: 'c', label: '4', tag: 'Z1', hint: L("Hadlarni sanang: birinchisi o'n ikki a beshinchi, ikkinchisi sakkiz a kub.", 'Посчитай члены: первый двенадцать a в пятой, второй восемь a в кубе.', 'Count the terms: the first is twelve a to the fifth, the second is eight a cubed.') },
        { id: 'd', label: '1', tag: 'Z1', hint: L("Minus yozuvni ikkiga bo'ladi.", 'Минус делит запись на две части.', 'The minus splits the record in two.') },
      ],
    },
    {
      wrap: false,
      prompt: 'a³ · a²',
      ok: L("Ko'paytirishda ko'rsatkichlar qo'shiladi.", 'При умножении показатели складываются.', 'When multiplying, the exponents add.'),
      items: [
        { id: 'a', label: 'a⁵', correct: true },
        { id: 'b', label: 'a⁶', tag: 'Z4', hint: L("Uch va ikki qo'shiladi, olti esa ko'paytirishdan chiqadi.", 'Три и два складываются, а шесть выходит из умножения показателей.', 'Three and two add, six comes from multiplying the exponents.') },
        { id: 'c', label: '2a⁵', tag: 'Z6', hint: L("Ko'paytuvchilar birikdi, lekin a harfi bitta.", 'Множители соединились, но буква a одна.', 'The factors joined, but the letter a is single.') },
        { id: 'd', label: 'a⁸', tag: 'Z4', hint: L("Uch va ikki besh beradi.", 'Три и два дают пять.', 'Three and two give five.') },
      ],
    },
    {
      wrap: false,
      prompt: '6a(2a − 3)',
      ok: L("Ko'paytuvchi har hadga bordi -- o'tgan darslardagidek.", 'Множитель дошёл до каждого члена, как и в прошлых уроках.', 'The factor reached every term, as in the earlier lessons.'),
      items: [
        { id: 'a', label: '12a² − 18a', correct: true },
        { id: 'b', label: '12a² − 3', tag: 'Z1', hint: L("Uchlik ham olti a ga ko'paytiriladi.", 'Тройка тоже умножается на шесть a.', 'The three is multiplied by six a as well.') },
        { id: 'c', label: '12a² + 18a', tag: 'Z3', hint: L("Qavs ichida ayirish turgan edi.", 'Внутри скобки было вычитание.', 'The bracket had a subtraction.') },
        { id: 'd', label: '12a² − 18', tag: 'Z4', hint: L("Olti a karra uch da a harfi qoladi.", 'В шесть a на три буква a остаётся.', 'In six a times three the letter a stays.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Bugun bo'lish bilan shug'ullanamiz, shuning uchun ko'paytirishni eslaymiz.", 'Три коротких вопроса. Сегодня займёмся делением, поэтому вспомним умножение.', 'Three short questions. Today we take on division, so let us recall multiplication.'),
    A('1', "Ikkinchisi ko'rsatkichlar haqida.", 'Второй про показатели.', 'The second is about exponents.'),
    A('2', "Uchinchisi o'tgan darslardan.", 'Третий из прошлых уроков.', 'The third is from the earlier lessons.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. LENTA: bo'luvchi ko'paytuvchilarni O'CHIRADI.
// Ko'rsatkichning ayirilishi -- SANOQ.
// ============================================================
const S3 = {
  kind: 'tape',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Bo\'luvchi ko\'paytuvchilarni o\'chiradi', 'Делитель вычёркивает множители', 'The divisor crosses factors out'),
  expr: 'a⁵ : a²',
  item: 'a',
  count: 5,
  cross: 2,
  options: [
    { id: 'a', label: 'a³' },
    { id: 'b', label: 'a⁷' },
    { id: 'c', label: 'a²' },
    { id: 'd', label: '1' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Bo'lishda ko'rsatkichlar ayiriladi, qo'shilmaydi.", 'При делении показатели вычитаются, а не складываются.', 'When dividing, the exponents subtract, they do not add.') },
    { key: 'c', tag: 'Z6', hint: L("Beshdan ikkini ayirsak uch qoladi.", 'Пять минус два это три.', 'Five minus two is three.') },
    { key: 'd', tag: 'Z2', hint: L("Hamma ko'paytuvchi o'chirilmadi: uchtasi turibdi.", 'Вычеркнуты не все множители: три остались.', 'Not all the factors were crossed out: three are left.') },
  ],
  note: L(
    "Bo'luvchi o'zida nechta ko'paytuvchi bo'lsa, shunchasini o'chiradi. Shuning uchun ko'rsatkich ayiriladi.",
    'Делитель вычёркивает столько множителей, сколько их в нём самом. Поэтому показатель вычитается.',
    'The divisor crosses out as many factors as it holds itself. That is why the exponent is subtracted.',
  ),
  audio: [
    A('mount', "Daraja bu ko'paytuvchilar lentasi. Yozuvni bosing va lentani ko'ring.", 'Степень это лента множителей. Нажми на запись и посмотри на ленту.', 'A power is a tape of factors. Tap the record and look at the tape.'),
    A('open', "Bo'luvchida ikkita ko'paytuvchi bor, va u lentadan ikkitasini o'chiradi.", 'В делителе два множителя, и он вычёркивает из ленты два.', 'The divisor has two factors, and it crosses two off the tape.'),
    A('open', "Qolganini sanang. Bu ko'rsatkichning ayirilishi.", 'Посчитай, что осталось. Это и есть вычитание показателей.', 'Count what is left. That is the subtraction of exponents.'),
  ],
}

// ============================================================
// 4. FARQLASH. HAMMA ko'paytuvchi o'chirildi: bo'linma NOL emas,
// BIRLIK. 22-darsning tuzog'i shu yerda KO'RINADI.
// ============================================================
const S4 = {
  kind: 'tape',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Hamma ko\'paytuvchi o\'chsa', 'Если вычеркнуты все', 'When every factor is crossed out'),
  expr: 'a⁵ : a⁵',
  item: 'a',
  count: 5,
  cross: 5,
  options: [
    { id: 'a', label: '1' },
    { id: 'b', label: '0' },
    { id: 'c', label: 'a' },
    { id: 'd', label: '5' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Ko'paytuvchi qolmadi, lekin bo'lishning o'zi birlik beradi: har qanday ifoda o'ziga bo'linganda bir chiqadi.", 'Множителей не осталось, но само деление даёт единицу: любое выражение, разделённое на себя, это один.', 'No factors are left, but the division itself gives one: any expression divided by itself is one.') },
    { key: 'c', tag: 'Z6', hint: L("Beshta ko'paytuvchining hammasi o'chirildi, bittasi ham qolmadi.", 'Все пять множителей вычеркнуты, ни один не остался.', 'All five factors are crossed out, none is left.') },
    { key: 'd', tag: 'Z6', hint: L("Besh bu ko'paytuvchilar soni, bo'linma emas.", 'Пять это число множителей, а не частное.', 'Five is the number of factors, not the quotient.') },
  ],
  note: L(
    "Hamma ko'paytuvchi o'chdi, lekin bo'linma nol emas. Ifoda o'ziga bo'linganda BIRLIK chiqadi -- 22-darsda qavsda qolgan birlik ham shundan.",
    'Все множители вычеркнуты, но частное не ноль. Выражение, разделённое на себя, даёт ЕДИНИЦУ — та самая единица, что оставалась в скобке в уроке 22.',
    'Every factor is crossed out, but the quotient is not zero. An expression divided by itself gives ONE — the very one that stayed in the bracket in lesson 22.',
  ),
  audio: [
    A('mount', "Endi bo'luvchi bo'linuvchining o'ziga teng.", 'Теперь делитель равен самому делимому.', 'Now the divisor equals the dividend itself.'),
    A('open', "Hamma ko'paytuvchi o'chirildi. Lentada hech narsa qolmadi.", 'Все множители вычеркнуты. На ленте ничего не осталось.', 'Every factor is crossed out. Nothing is left on the tape.'),
    A('open', "Lekin bo'linma nol emas. O'ylab javob bering.", 'Но частное не ноль. Подумай и ответь.', 'But the quotient is not zero. Think and answer.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. TO'RTBURCHAK: bo'linmani bo'luvchiga
// ko'paytirsak bo'linuvchi qaytadi. Bo'lish ko'paytirish bilan
// tekshiriladi.
// ============================================================
const S5 = {
  kind: 'grid',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Bo\'lishni ko\'paytirish tekshiradi', 'Деление проверяется умножением', 'Multiplication checks the division'),
  caption: L(
    "Chapda bo'luvchi, yuqorida bo'linma. Kataklarni ochib, bo'linuvchi qaytishini ko'ring.",
    'Слева делитель, сверху частное. Открой клетки и посмотри, вернётся ли делимое.',
    'The divisor on the left, the quotient on top. Open the cells and see whether the dividend comes back.',
  ),
  left: ['4a²'],
  top: ['3a³', '−2a'],
  options: [
    { id: 'a', label: '12a⁵ − 8a³' },
    { id: 'b', label: '12a⁵ + 8a³' },
    { id: 'c', label: '12a⁶ − 8a³' },
    { id: 'd', label: '12a⁵ − 8a²' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Bo'linmaning ikkinchi hadi manfiy, ya'ni ko'paytma ham manfiy.", 'Второй член частного отрицательный, значит и произведение отрицательно.', 'The second term of the quotient is negative, so the product is negative too.') },
    { key: 'c', tag: 'Z4', hint: L("Ikki va uch besh beradi, olti emas.", 'Два и три дают пять, а не шесть.', 'Two and three give five, not six.') },
    { key: 'd', tag: 'Z4', hint: L("Ikkinchi katakda a ning ko'rsatkichlari qo'shiladi: ikki va bir.", 'Во второй клетке показатели a складываются: два и один.', 'In the second cell the a exponents add: two and one.') },
  ],
  note: L(
    "Ko'paytirish bo'linuvchini qaytardi. Demak bo'linma to'g'ri va ikkala had ham bo'lingan.",
    'Умножение вернуло делимое. Значит частное найдено верно и оба члена разделены.',
    'Multiplying gave the dividend back. So the quotient is right and both terms were divided.',
  ),
  audio: [
    A('mount', "Bo'lishni tekshirishning yo'li bitta: bo'linmani bo'luvchiga ko'paytirish.", 'Способ проверить деление один: умножить частное на делитель.', 'There is one way to check a division: multiply the quotient by the divisor.'),
    A('mount', "Ikki katakni oching va boshlang'ich yozuv qaytishini ko'ring.", 'Открой две клетки и посмотри, вернётся ли исходная запись.', 'Open the two cells and see whether the original record comes back.'),
    A('cell-all', "Ikki katak ochildi va bo'linuvchi qaytdi.", 'Две клетки открыты, и делимое вернулось.', 'Both cells are open and the dividend is back.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. Asbob yo'q: har hadni bo'lish.
// ============================================================
const S6 = {
  kind: 'slot',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Har hadni alohida', 'Каждый член отдельно', 'Each term on its own'),
  template: ['(15x⁴ − 25x²) : 5x²  =  ', { slot: 0 }, ' − ', { slot: 1 }],
  parts: [
    { id: 'a', label: '3x²' },
    { id: 'b', label: '5' },
    { id: 'c', label: '3x' },
    { id: 'd', label: '5x' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Har hadni 5x² ga bo'ling.",
    'Раздели каждый член на 5x².',
    'Divide each term by 5x².',
  ),
  checkNote: L(
    "O'n beshni beshga bo'lsak uch, to'rtta x dan ikkitasi o'chadi. Yigirma beshni beshga bo'lsak besh, va x lar butunlay o'chadi.",
    'Пятнадцать на пять это три, из четырёх x вычёркиваются две. Двадцать пять на пять это пять, и все x вычеркнуты.',
    'Fifteen by five is three, and two of the four x are crossed out. Twenty five by five is five, and all the x are gone.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("To'rtdan ikkini ayirsak ikki qoladi, ya'ni x kvadrat.", 'Четыре минус два это два, значит x в квадрате.', 'Four minus two is two, so x squared.') },
    { key: 'd', tag: 'Z2', hint: L("Ikkinchi hadda x lar butunlay o'chadi, harf qolmaydi.", 'Во втором члене все x вычёркиваются, буквы не остаётся.', 'In the second term all the x are crossed out, no letter is left.') },
    { key: '*', tag: 'Z4', hint: L("Har hadda sonlarni bo'ling, harflarning ko'rsatkichini esa ayiring.", 'В каждом члене числа дели, а показатели букв вычитай.', 'In each term divide the numbers and subtract the letter exponents.') },
  ],
  audio: [
    A('mount', "Lenta ham, to'rtburchak ham yo'q. Ikki hadni o'zingiz bo'lasiz.", 'Ни ленты, ни прямоугольника. Два члена делишь сам.', 'No tape and no rectangle. You divide the two terms yourself.'),
    A('mount', "Ikkinchi hadga alohida qarang: undagi x lar butunlay o'chadi.", 'Посмотри особо на второй член: в нём все x вычёркиваются.', 'Look closely at the second term: all its x are crossed out.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH: had bo'luvchining
// O'ZIGA teng va u BIRLIK beradi.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Had bo\'luvchiga teng bo\'lsa', 'Когда член равен делителю', 'When a term equals the divisor'),
  letter: 'a',
  numbers: [1, 2, 5],
  rows: [
    { id: 'r1', role: 'source', expr: '(a³ + a²) : a²', sub: (n) => '(' + n + '³ + ' + n + '²) : ' + n + '²', val: (n) => (n * n * n + n * n) / (n * n) },
    { id: 'r2', expr: 'a + 1', sub: (n) => n + ' + 1', val: (n) => n + 1 },
  ],
  probe: {
    question: L(
      "Ikkinchi had bo'luvchining o'ziga teng edi. Undan nima qoldi?",
      'Второй член был равен самому делителю. Что от него осталось?',
      'The second term was equal to the divisor itself. What is left of it?',
    ),
    items: [
      {
        id: 'one',
        correct: true,
        label: L('Birlik', 'Единица', 'A one'),
      },
      {
        id: 'zero',
        tag: 'Z2',
        label: L('Nol', 'Ноль', 'A zero'),
        hint: L(
          "Nol ayirishda chiqadi. Bo'lishda esa o'ziga bo'linsa bir chiqadi, va sonlar buni ko'rsatdi.",
          'Ноль получается при вычитании. А при делении на себя выходит один, и числа это показали.',
          'Zero comes from subtracting. Dividing by itself gives one, and the numbers showed it.',
        ),
      },
      {
        id: 'nothing',
        tag: 'Z2',
        label: L('Hech narsa', 'Ничего', 'Nothing'),
        hint: L(
          "Hech narsa qolmasa bo'linmada bitta had bo'lardi, sonlar esa ikkitasini ko'rsatdi.",
          'Если бы не осталось ничего, в частном был бы один член, а числа показали два.',
          'If nothing were left, the quotient would have one term, but the numbers showed two.',
        ),
      },
      {
        id: 'letter',
        tag: 'Z6',
        label: L('a harfi', 'Буква a', 'The letter a'),
        hint: L(
          "a kvadratni a kvadratga bo'lsak ko'paytuvchi qolmaydi, demak harf ham qolmaydi.",
          'a в квадрате разделить на a в квадрате: множителей не остаётся, значит и буквы нет.',
          'a squared divided by a squared leaves no factors, so no letter either.',
        ),
      },
    ],
  },
  okText: L(
    "O'ziga bo'lingan had BIRLIK beradi. Shuning uchun bo'linmada ikki had bo'ladi, bitta emas.",
    'Член, разделённый на себя, даёт ЕДИНИЦУ. Поэтому в частном два члена, а не один.',
    'A term divided by itself gives ONE. So the quotient has two terms, not one.',
  ),
  audio: [
    A('mount', "Yuqorida bo'lish yozuvi, pastda javob.", 'Сверху запись деления, снизу ответ.', 'Above the division record, below the answer.'),
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
    { id: 'f1', label: L("ko'phadning har bir hadini", 'каждый член многочлена', 'each term of the polynomial') },
    { id: 'f2', label: L("shu birhadga bo'lamiz", 'делим на этот одночлен', 'we divide by that monomial') },
    { id: 'f3', label: L("bir xil harflarning ko'rsatkichini ayiramiz", 'показатели одинаковых букв вычитаем', 'we subtract the exponents of like letters') },
    { id: 'f4', label: L("bo'luvchiga teng had esa birlik beradi", 'а член, равный делителю, даёт единицу', 'and a term equal to the divisor gives one') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval hadlar, keyin bo'lish, keyin ko'rsatkichlar, oxirida birlik holati.",
    'Порядок нарушен. Сначала члены, потом деление, потом показатели, в конце случай с единицей.',
    'The order is off. Terms first, then dividing, then the exponents, and the case of the one last.',
  ),
  lawChips: [
    { label: '·', tone: 's2' },
    { label: ':', tone: 's2' },
    { label: '1', tone: 'off' },
    { label: '−', tone: 's1' },
  ],
  lawSweep: L(
    "ko'paytirish, bo'lish, birlik, ishora",
    'умножение, деление, единица, знак',
    'multiplication, division, one, the sign',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ko'phadni birhadga bo'lish uchun ko'phadning har bir hadini shu birhadga bo'lish va hosil bo'lgan bo'linmalarni qo'shish kerak.",
        'Чтобы разделить многочлен на одночлен, надо разделить на этот одночлен каждый член многочлена и полученные частные сложить.',
        'To divide a polynomial by a monomial, divide every term of the polynomial by that monomial and add the quotients.',
      ),
      L(
        "Bir xil asosli darajalar bo'linganda ko'rsatkichlar AYIRILADI. Agar had bo'luvchiga teng bo'lsa, bo'linmada undan BIRLIK qoladi.",
        'При делении степеней с одинаковым основанием показатели ВЫЧИТАЮТСЯ. Если член совпадает с делителем, в частном от него остаётся ЕДИНИЦА.',
        'When powers with the same base are divided, the exponents are SUBTRACTED. If a term matches the divisor, a ONE is left from it.',
      ),
    ],
  },
  hookCap: L(
    "Har had bo'linadi, birinchisi emas",
    'Делится каждый член, а не только первый',
    'Every term gets divided, not only the first',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('har had', 'каждый член', 'every term'),
    L("ko'rsatkichlar ayiriladi", 'показатели вычитаются', 'the exponents subtract'),
    L('o\'ziga bo\'linsa bir', 'на себя это единица', 'by itself it is one'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik: lenta, birlik va tekshirish. Endi qoidani yig'amiz.", 'Все случаи мы увидели: лента, единица и проверка. Теперь соберём правило.', 'We have seen all the cases: the tape, the one and the check. Now let us build the rule.'),
    A('ok', "To'g'ri. Bu bilan blok yopiladi.", 'Верно. На этом блок закрывается.', 'Correct. That closes the block.'),
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
      prompt: '18x⁶ : 3x²',
      ok: L("Sonlar bo'lindi, ko'rsatkichlar ayirildi.", 'Числа поделились, показатели вычлись.', 'The numbers divided and the exponents subtracted.'),
      items: [
        { id: 'a', label: '6x⁴', correct: true },
        { id: 'b', label: '6x³', tag: 'Z4', hint: L("Oltidan ikkini ayirsak to'rt qoladi.", 'Шесть минус два это четыре.', 'Six minus two is four.') },
        { id: 'c', label: '6x⁸', tag: 'Z4', hint: L("Bo'lishda ko'rsatkichlar ayiriladi.", 'При делении показатели вычитаются.', 'When dividing, the exponents subtract.') },
        { id: 'd', label: '15x⁴', tag: 'Z6', hint: L("O'n sakkiz uchga bo'linadi, ayirilmaydi.", 'Восемнадцать делится на три, а не вычитается.', 'Eighteen is divided by three, not decreased by it.') },
      ],
    },
    {
      wrap: false,
      prompt: '(20a⁴ − 5a²) : 5a²',
      ok: L("Ikkinchi had bo'luvchiga teng va birlik berdi.", 'Второй член равен делителю и дал единицу.', 'The second term equals the divisor and gave a one.'),
      items: [
        { id: 'a', label: '4a² − 1', correct: true },
        { id: 'b', label: '4a²', tag: 'Z2', hint: L("Ikkinchi had o'ziga bo'linib birlik berdi, u yo'qolmaydi.", 'Второй член разделился на себя и дал единицу, он не исчезает.', 'The second term divided by itself and gave one, it does not vanish.') },
        { id: 'c', label: '4a² − 5', tag: 'Z6', hint: L("Beshni beshga bo'lsak bir chiqadi.", 'Пять разделить на пять это один.', 'Five divided by five is one.') },
        { id: 'd', label: '4a⁶ − 1', tag: 'Z4', hint: L("To'rtdan ikkini ayirsak ikki qoladi.", 'Четыре минус два это два.', 'Four minus two is two.') },
      ],
    },
    {
      wrap: false,
      prompt: '(−9y⁵ + 12y³) : 3y³',
      ok: L("Birinchi had manfiy qoldi, ikkinchisi musbat.", 'Первый член остался отрицательным, второй положительным.', 'The first term stayed negative, the second positive.'),
      items: [
        { id: 'a', label: '−3y² + 4', correct: true },
        { id: 'b', label: '3y² + 4', tag: 'Z3', hint: L("Bo'luvchi musbat, demak birinchi had manfiy qoladi.", 'Делитель положительный, значит первый член остаётся отрицательным.', 'The divisor is positive, so the first term stays negative.') },
        { id: 'c', label: '−3y² − 4', tag: 'Z3', hint: L("Ikkinchi had musbat edi.", 'Второй член был положительным.', 'The second term was positive.') },
        { id: 'd', label: '−3y⁸ + 4', tag: 'Z4', hint: L("Beshdan uchni ayirsak ikki qoladi.", 'Пять минус три это два.', 'Five minus three is two.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(x⁷ − x⁵ + x³) : x³ bo'linmasida nechta had bo'ladi?",
        'Сколько членов будет в частном (x⁷ − x⁵ + x³) : x³?',
        'How many terms will the quotient (x⁷ − x⁵ + x³) : x³ have?',
      ),
      ok: L("Bo'luvchi uchta hadning har biriga boradi.", 'Делитель доходит до каждого из трёх членов.', 'The divisor reaches each of the three terms.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '2', tag: 'Z1', hint: L("Uchinchi had ham bo'linadi, va undan birlik qoladi.", 'Третий член тоже делится, и от него остаётся единица.', 'The third term divides too, and a one is left of it.') },
        { id: 'c', label: '1', tag: 'Z1', hint: L("Har had alohida bo'linadi, ular birlashmaydi.", 'Каждый член делится отдельно, они не сливаются.', 'Each term divides separately, they do not merge.') },
        { id: 'd', label: '4', tag: 'Z6', hint: L("Bo'linuvchida uch had bor, yangi had paydo bo'lmaydi.", 'В делимом три члена, новых не появляется.', 'The dividend has three terms, no new ones appear.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ikkinchisida birlik bor.", 'Четыре вопроса. Во втором есть единица.', 'Four questions. The second has a one.'),
    A('1', "Uchinchisida ishoralarga diqqat.", 'В третьем внимание на знаки.', 'In the third, watch the signs.'),
    A('2', "Oxirgisida hadlar sanaladi.", 'В последнем считаются члены.', 'In the last one the terms are counted.'),
    A('3', "Bo'linmada nechta had bo'lishini o'ylang.", 'Подумай, сколько членов будет в частном.', 'Think about how many terms the quotient will have.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: ikki harf, keyin tekshirish.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ikki harf birga', 'Две буквы вместе', 'Two letters at once'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['(24a⁴b² − 18a³b) : 6a²b  =  ', { slot: 0 }, ' − ', { slot: 1 }],
  parts: [
    { id: 'a', label: '4a²b' },
    { id: 'b', label: '3a' },
    { id: 'c', label: '4a²' },
    { id: 'd', label: '3ab' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Har hadni bo'ling. Harflarni alohida sanang.",
    'Раздели каждый член. Буквы считай отдельно.',
    'Divide each term. Count the letters separately.',
  ),
  checkNote: L(
    "Yigirma to'rtni oltiga bo'lsak to'rt, a lardan ikkitasi o'chadi, b lardan bittasi o'chadi. Ikkinchi hadda esa b butunlay o'chadi.",
    'Двадцать четыре на шесть это четыре, из a вычёркиваются две, из b одна. А во втором члене b вычёркивается полностью.',
    'Twenty four by six is four, two a are crossed out and one b. In the second term the b is fully crossed out.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z2', hint: L("Birinchi hadda b ikkita edi, bittasi qoladi.", 'В первом члене b было две, одна остаётся.', 'The first term had two b, so one is left.') },
    { key: 'd', tag: 'Z2', hint: L("Ikkinchi hadda b bitta, va bo'luvchi uni o'chiradi.", 'Во втором члене b одна, и делитель её вычёркивает.', 'The second term has one b, and the divisor crosses it out.') },
    { key: '*', tag: 'Z4', hint: L("Har harfning ko'rsatkichini alohida ayiring.", 'Показатель каждой буквы вычитай отдельно.', 'Subtract the exponent of each letter separately.') },
  ],
  probe: {
    question: L("Tekshirish: 6a²b karra 3a nechchi bo'ladi?", 'Проверка: чему равно 6a²b на 3a?', 'A check: what is 6a²b times 3a?'),
    items: [
      { id: 'a', correct: true, label: '18a³b' },
      { id: 'b', tag: 'Z4', label: '18a²b', hint: L("Ikkinchi ko'paytuvchida ham a bor, ko'rsatkichlar qo'shiladi.", 'Во втором множителе тоже есть a, показатели складываются.', 'The second factor has an a too, and the exponents add.') },
      { id: 'c', tag: 'Z4', label: '18a³b²', hint: L("b faqat birinchi ko'paytuvchida bor.", 'b есть только в первом множителе.', 'b is only in the first factor.') },
      { id: 'd', tag: 'Z6', label: '9a³b', hint: L("Olti karra uch o'n sakkiz beradi.", 'Шесть на три даёт восемнадцать.', 'Six times three gives eighteen.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval bo'lish, keyin ko'paytirib tekshirish.", 'Два шага. Сначала деление, потом проверка умножением.', 'Two steps. Dividing first, then a check by multiplying.'),
    A('mount', "Ikkinchi hadda b bitta, va u butunlay o'chadi.", 'Во втором члене b одна, и она вычёркивается полностью.', 'The second term has one b, and it is fully crossed out.'),
    A('two', "Endi tekshirish: bo'linmani bo'luvchiga ko'paytiring.", 'Теперь проверка: умножь частное на делитель.', 'Now the check: multiply the quotient by the divisor.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Uch had, oxirgisi bo'luvchiga TENG.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Uch had, oxirgisi qiziq', 'Три члена, последний интересный', 'Three terms, the last one is interesting'),
  template: ['(x⁷ − x⁵ + x³) : x³  =  ', { slot: 0 }, ' − x² + ', { slot: 1 }],
  parts: [
    { id: 'a', label: 'x⁴' },
    { id: 'b', label: '1' },
    { id: 'c', label: 'x¹⁰' },
    { id: 'd', label: '0' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Birinchi va oxirgi hadni yozing. O'rtadagisi allaqachon turibdi.",
    'Запиши первый и последний члены. Средний уже стоит.',
    'Write the first and the last terms. The middle one is already there.',
  ),
  checkNote: L(
    "Yettidan uchni ayirsak to'rt qoladi. Oxirgi had bo'luvchiga teng, shuning uchun undan birlik qoladi.",
    'Семь минус три это четыре. Последний член равен делителю, поэтому от него остаётся единица.',
    'Seven minus three is four. The last term equals the divisor, so a one is left of it.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Bo'lishda ko'rsatkichlar ayiriladi, qo'shilmaydi.", 'При делении показатели вычитаются, а не складываются.', 'When dividing, the exponents subtract, they do not add.') },
    { key: 'd', tag: 'Z2', hint: L("O'ziga bo'lingan had birlik beradi.", 'Член, разделённый на себя, даёт единицу.', 'A term divided by itself gives one.') },
    { key: '*', tag: 'Z2', hint: L("Oxirgi had bo'luvchining o'zi.", 'Последний член это сам делитель.', 'The last term is the divisor itself.') },
  ],
  audio: [
    A('mount', "Uch had. Oxirgisi bo'luvchining o'ziga teng, va bu eng qiziq joyi.", 'Три члена. Последний равен самому делителю, и это самое интересное место.', 'Three terms. The last equals the divisor itself, and that is the interesting part.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Birinchi had BENUQSON bo'lingan, ikkinchisi esa
// shundayligicha ko'chirilgan. Blokning bu yerdagi xatosi.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Birinchi had benuqson bo'lingan. Shunday bo'lsa ham, qaysi qator xato?",
    'Первый член разделён безупречно. И всё же какая строка ошибочна?',
    'The first term is divided flawlessly. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '(12a⁵ − 8a³) : 4a²' },
    { id: 'r2', text: '12a⁵ : 4a² = 3a³' },
    { id: 'r3', text: '8a³ : 4a² = 8a³' },
    { id: 'r4', text: L('javob: 3a³ − 8a³', 'ответ: 3a³ − 8a³', 'answer: 3a³ − 8a³') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: o'n ikkini to'rtga bo'lsak uch, beshta a dan ikkitasi o'chadi.", 'Верно: двенадцать на четыре это три, из пяти a вычёркиваются две.', 'Right: twelve by four is three, and two of the five a are crossed out.'),
    r4: L("Bu qator oldingisidan chiqadi. Xato undan oldin paydo bo'lgan.", 'Эта строка следует из предыдущей. Ошибка появилась раньше.', 'This line follows from the previous one. The mistake appeared earlier.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r4: 'Z1' },
  proofFill: {
    template: ['8a³ : 4a²  =  ', { slot: 0 }, '   →   3a³ − ', { slot: 1 }],
    parts: [
      { id: 'a', label: '2a' },
      { id: 'b', label: '3a³ − 2a' },
      { id: 'c', label: '8a³' },
      { id: 'd', label: '3a³ − 8a³' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Ikkinchi bo'linmani hisoblang va javobni tuzating.",
      'Посчитай второе частное и исправь ответ.',
      'Work out the second quotient and put the answer right.',
    ),
    checkNote: L(
      "Sakkizni to'rtga bo'lsak ikki, uchta a dan ikkitasi o'chadi va bittasi qoladi.",
      'Восемь на четыре это два, из трёх a вычёркиваются две и одна остаётся.',
      'Eight by four is two, two of the three a are crossed out and one stays.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z1', hint: L("Bo'luvchi ikkinchi hadga ham boradi.", 'Делитель доходит и до второго члена.', 'The divisor reaches the second term too.') },
      { key: 'd', tag: 'Z1', hint: L("Javobning ikkinchi hadi ham tuzatiladi.", 'Второй член ответа тоже исправляется.', 'The second term of the answer gets fixed too.') },
      { key: '*', tag: 'Z1', hint: L("Har had bo'linadi, birinchisi emas.", 'Делится каждый член, а не только первый.', 'Every term divides, not only the first.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda birinchi had benuqson bo'lingan.", 'В этой ловушке первый член разделён безупречно.', 'In this trap the first term is divided flawlessly.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Ikkinchi had shundayligicha ko'chirilgan.", 'Нашёл. Второй член перенесли как был.', 'You found it. The second term was carried over as it was.'),
    A('done', "Bo'luvchi bitta, hadlar esa ikkita, va u har biriga boradi.", 'Делитель один, а членов два, и он доходит до каждого.', 'There is one divisor and two terms, and it reaches each.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TESKARI YO'L: bo'luvchi va bo'linma ma'lum,
// bo'linuvchi izlanadi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE INVERSE TASK'),
  title: L('Bo\'linuvchini tiklash', 'Восстановить делимое', 'Restoring the dividend'),
  given: L(
    "Bo'luvchi va bo'linma ma'lum. Bo'linuvchi nima edi?",
    'Делитель и частное известны. Что было делимым?',
    'The divisor and the quotient are known. What was the dividend?',
  ),
  template: ['(', { slot: 0 }, ' − ', { slot: 1 }, ') : 3x²  =  4x³ − 2'],
  parts: [
    { id: 'a', label: '12x⁵' },
    { id: 'b', label: '6x²' },
    { id: 'c', label: '12x⁶' },
    { id: 'd', label: '6x' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Bo'linmaning har hadini bo'luvchiga ko'paytiring.",
    'Умножь каждый член частного на делитель.',
    'Multiply each term of the quotient by the divisor.',
  ),
  checkNote: L(
    "Uch x kvadrat karra to'rt x kub o'n ikki x beshinchi, uch x kvadrat karra ikki esa olti x kvadrat beradi.",
    'Три x в квадрате на четыре x в кубе это двенадцать x в пятой, а три x в квадрате на два это шесть x в квадрате.',
    'Three x squared times four x cubed is twelve x to the fifth, and three x squared times two is six x squared.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Ko'paytirishda ko'rsatkichlar qo'shiladi: ikki va uch besh beradi.", 'При умножении показатели складываются: два и три дают пять.', 'When multiplying, exponents add: two and three give five.') },
    { key: 'd', tag: 'Z4', hint: L("Uch x kvadrat karra ikki da x kvadrat qoladi.", 'В три x в квадрате на два остаётся x в квадрате.', 'In three x squared times two, x squared stays.') },
    { key: '*', tag: 'Z4', hint: L("Bo'lishning tekshiruvi ko'paytirish: bo'linma karra bo'luvchi.", 'Проверка деления это умножение: частное на делитель.', 'A division is checked by multiplying: the quotient by the divisor.') },
  ],
  audio: [
    A('mount', "Teskari yo'l: bo'linma bor, bo'linuvchi esa yo'q.", 'Обратный путь: частное есть, а делимого нет.', 'The inverse path: the quotient is there, the dividend is not.'),
    A('mount', "Bo'linmaning har hadini bo'luvchiga ko'paytirib ko'ring.", 'Умножь каждый член частного на делитель.', 'Multiply each term of the quotient by the divisor.'),
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
      prompt: 'x⁹ : x³',
      ok: L("Ko'rsatkichlar ayirildi.", 'Показатели вычлись.', 'The exponents subtracted.'),
      items: [
        { id: 'a', label: 'x⁶', correct: true },
        { id: 'b', label: 'x³', tag: 'Z4', hint: L("To'qqizdan uchni ayirsak olti qoladi.", 'Девять минус три это шесть.', 'Nine minus three is six.') },
        { id: 'c', label: 'x¹²', tag: 'Z4', hint: L("Bo'lishda ko'rsatkichlar ayiriladi.", 'При делении показатели вычитаются.', 'When dividing, the exponents subtract.') },
        { id: 'd', label: 'x²⁷', tag: 'Z4', hint: L("Ko'rsatkichlar ko'paytirilmaydi.", 'Показатели не умножаются.', 'The exponents are not multiplied.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(10a³ − 10a²) : 10a²',
      ok: L("Ikkinchi had bo'luvchiga teng va birlik berdi.", 'Второй член равен делителю и дал единицу.', 'The second term equals the divisor and gave a one.'),
      items: [
        { id: 'a', label: 'a − 1', correct: true },
        { id: 'b', label: 'a', tag: 'Z2', hint: L("Ikkinchi had birlik beradi, u yo'qolmaydi.", 'Второй член даёт единицу, он не исчезает.', 'The second term gives one, it does not vanish.') },
        { id: 'c', label: 'a − 10', tag: 'Z6', hint: L("O'nni o'nga bo'lsak bir chiqadi.", 'Десять разделить на десять это один.', 'Ten divided by ten is one.') },
        { id: 'd', label: 'a³ − 1', tag: 'Z4', hint: L("Uchdan ikkini ayirsak bir qoladi.", 'Три минус два это один.', 'Three minus two is one.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "7b⁴ : 7b⁴ nechchiga teng?",
        'Чему равно 7b⁴ : 7b⁴?',
        'What does 7b⁴ : 7b⁴ equal?',
      ),
      ok: L("Ifoda o'ziga bo'linganda birlik chiqadi.", 'Выражение, разделённое на себя, даёт единицу.', 'An expression divided by itself gives one.'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '0', tag: 'Z2', hint: L("Nol ayirishda chiqadi, bu yerda esa bo'lish.", 'Ноль получается при вычитании, а здесь деление.', 'Zero comes from subtracting, and here we divide.') },
        { id: 'c', label: '7', tag: 'Z6', hint: L("Yettini yettiga bo'lsak bir chiqadi.", 'Семь разделить на семь это один.', 'Seven divided by seven is one.') },
        { id: 'd', label: 'b', tag: 'Z6', hint: L("Hamma ko'paytuvchi o'chadi, harf ham qolmaydi.", 'Все множители вычёркиваются, буквы тоже не остаётся.', 'Every factor is crossed out, no letter is left either.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(−15x⁵ + 6x³) : 3x³',
      ok: L("Birinchi had manfiy qoldi, ikkinchisi musbat.", 'Первый член остался отрицательным, второй положительным.', 'The first term stayed negative, the second positive.'),
      items: [
        { id: 'a', label: '−5x² + 2', correct: true },
        { id: 'b', label: '5x² + 2', tag: 'Z3', hint: L("Bo'luvchi musbat, birinchi had manfiy qoladi.", 'Делитель положительный, первый член остаётся отрицательным.', 'The divisor is positive, the first term stays negative.') },
        { id: 'c', label: '−5x² − 2', tag: 'Z3', hint: L("Ikkinchi had musbat edi.", 'Второй член был положительным.', 'The second term was positive.') },
        { id: 'd', label: '−5x⁸ + 2', tag: 'Z4', hint: L("Beshdan uchni ayirsak ikki qoladi.", 'Пять минус три это два.', 'Five minus three is two.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida birlik bor.", 'Во втором есть единица.', 'The second has a one.'),
    A('2', "Uchinchisi o'ziga bo'lish haqida.", 'Третий про деление на себя.', 'The third is about dividing by itself.'),
    A('3', "Oxirgisida ishoralarga diqqat.", 'В последнем внимание на знаки.', 'In the last one, watch the signs.'),
  ],
}

// ============================================================
// 15. YAKUN. B4 BLOKI YOPILDI.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Har had bo\'linadi', 'Делится каждый член', 'Every term gets divided'),
  gate: S1.gate,
  fix: {
    tokens: ['3a³', '−', '2a'],
    value: '2',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Bo'luvchi har hadga boradi: o'n ikki a beshinchi uch a kub berdi, sakkiz a kub esa ikki a berdi. Ikkala had ham bo'lingan.",
    'Делитель доходит до каждого члена: двенадцать a в пятой дало три a в кубе, а восемь a в кубе дало два a. Разделены оба члена.',
    'The divisor reaches every term: twelve a to the fifth gave three a cubed, and eight a cubed gave two a. Both terms were divided.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    both: L('ikkala had ham', 'оба члена', 'both terms'),
    first: L('faqat birinchisi', 'только первый', 'only the first'),
    none: L("bunday bo'lib bo'lmaydi", 'так делить нельзя', 'you cannot divide like this'),
    one: L('bitta had', 'один член', 'one term'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['a⁵ : a² → a³', 'a⁵ : a⁵ → 1', '15x⁴ − 25x² → 3x² − 5', 'x⁷ − x⁵ + x³ → 3'],
  twoLabel: L('B4 bloki yopildi', 'Блок Б4 закрыт', 'Block B4 is closed'),
  twoA: L(
    "bo'linadi  →  har had",
    'делится  →  каждый член',
    'divides  →  every term',
  ),
  twoB: L(
    "o'ziga bo'linsa  →  birlik",
    'на себя  →  единица',
    'by itself  →  one',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "yig'indining kvadrati va ayirmaning kvadrati",
    'квадрат суммы и квадрат разности',
    'the square of a sum and the square of a difference',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish ikki narsadan chiqdi: bo'luvchi ko'paytuvchilarni o'chiradi, va o'ziga bo'lingan had birlik beradi.", 'Вся сегодняшняя работа вышла из двух вещей: делитель вычёркивает множители, а член, разделённый на себя, даёт единицу.', 'All of today came from two things: the divisor crosses factors out, and a term divided by itself gives one.'),
    A('mount', "Ko'phadlar bloki shu bilan yopildi. Keyingi blokda qisqa ko'paytirish formulalari.", 'Блок многочленов на этом закрыт. В следующем блоке формулы сокращённого умножения.', 'The polynomial block closes here. The next block brings the special product formulas.'),
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
