// ============================================================================
// 7-sinf, Dars 32. ALGEBRAIK KASRLAR: QISQARTIRISH VA UMUMIY MAXRAJ.
// (Алгебраические дроби: сокращение и приведение к общему знаменателю)
// B5 BLOKINI YOPADI.
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// DARS HAJMI METODIST QARORI BILAN CHEKLANGAN (2026-08-21): rejada bu dars
// «qisqartirish, umumiy maxraj va arifmetik amallar» deb yozilgan, lekin
// bitta darsda ikki ish qoladi -- QISQARTIRISH va UMUMIY MAXRAJ. Etalon
// (§2, B5) aynan shu ikki xatoni nomlaydi:
//   -- kasrni QO'SHILUVCHI bo'yicha qisqartirish (ko'paytuvchi o'rniga);
//   -- umumiy maxrajga keltirganda suratni QISMAN ko'paytirish.
// Kasrlarni ko'paytirish va bo'lish bu darsga kirmaydi.
//
// KASRLAR CHIZIQLI YOZILADI (`a/6`, `(2x + 4) : 2`): sinfda kasr chizig'i
// uchun na asbob, na uslub bor. Chiziq kerak bo'lsa, bu QATLAM ishi.
//
// ASBOBLAR TAYYOR: ko'paytuvchilar lentasi (qisqartirish -- o'chirish),
// son qo'yish (qo'shiluvchi bo'yicha qisqartirish YOLG'ON javob beradi) va
// yozuvni yig'ish. 13-ekran blokni yopadi: surat kvadratlar ayirmasi
// formulasi bilan ajratiladi va qavs maxraj bilan qisqaradi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_32'
const LESSON_TITLE = L('Algebraik kasrlar: qisqartirish va umumiy maxraj', 'Алгебраические дроби: сокращение и общий знаменатель', 'Algebraic fractions: cancelling and a common denominator')
const LESSON_NO = L('32-dars', 'Урок 32', 'Lesson 32')
const BLOCK = { label: L('B5-blok', 'Блок Б5', 'Block B5'), from: 25, to: 32, current: 32 }

const TAGS = {
  Z1: L("qo'shiluvchi bo'yicha qisqartirildi", 'сократили по слагаемому', 'cancelled by an addend'),
  Z2: L('had yo\'qoldi', 'член потерян', 'a term was lost'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L('boshqa ko\'paytuvchi qisqartirildi', 'сократили не тот множитель', 'the wrong factor was cancelled'),
  Z5: L('surat qisman ko\'paytirildi', 'числитель домножен частично', 'the numerator was only partly multiplied'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Ikki xil qisqartirish: ikkilikni o'chirish yoki
// ko'paytuvchini chiqarish.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('ALGEBRAIK KASRLAR', 'АЛГЕБРАИЧЕСКИЕ ДРОБИ', 'ALGEBRAIC FRACTIONS'),
  noBack: true,
  noNotes: true,
  title: L('Nimani qisqartirish mumkin', 'Что можно сократить', 'What may be cancelled'),
  gate: {
    source: { kind: 'plain', tokens: ['(2x', '+', '4)', ':', '2'] },
    rows: [
      { tokens: ['x', '+', '4'], value: '6' },
      { tokens: ['x', '+', '2'], value: '4' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Bittasi ikkiliklarni o'chirdi, ikkinchisi avval ko'paytuvchini chiqardi. Tabloda x ikki bo'lgandagi qiymat turadi, yozuvning o'zi esa to'rt beradi. Kim haq?",
      'Один вычеркнул двойки, другой сначала вынес множитель. На табло значение при x равном двум, а сама запись даёт четыре. Кто прав?',
      'One crossed out the twos, the other first took out a factor. The boards show the value at x equal to two, and the record itself gives four. Who is right?',
    ),
    items: [
      {
        id: 'factor',
        label: L("Avval ko'paytuvchini chiqargani", 'Тот, кто сначала вынес множитель', 'The one who took out a factor first'),
        hint: L(
          "Taxminingiz qabul qilindi. Lenta bilan tekshiramiz.",
          'Прогноз принят. Проверим лентой множителей.',
          'Your prediction is taken. We will check it with the factor tape.',
        ),
      },
      {
        id: 'cross',
        label: L("Ikkiliklarni o'chirgani", 'Тот, кто вычеркнул двойки', 'The one who crossed out the twos'),
        hint: L(
          "Ikkini qo'ying: sakkizni ikkiga bo'lsak to'rt, x qo'shuv to'rt esa olti beradi.",
          'Подставь два: восемь делить на два это четыре, а x плюс четыре даёт шесть.',
          'Substitute two: eight divided by two is four, while x plus four gives six.',
        ),
      },
      {
        id: 'both',
        label: L('Ikkovi ham to\'g\'ri', 'Оба верны', 'Both are right'),
        hint: L(
          "Ikkida olti va to'rt chiqdi, ya'ni bittasi boshlang'ichga teng emas.",
          'При двух вышло шесть и четыре, значит одно из них не равно исходному.',
          'At two it gave six and four, so one of them is not equal to the original.',
        ),
      },
      {
        id: 'none',
        label: L('Bunday yozuvni qisqartirib bo\'lmaydi', 'Такую запись сократить нельзя', 'Such a record cannot be cancelled'),
        hint: L(
          "Qisqartirish mumkin, lekin faqat ikkala hadning umumiy ko'paytuvchisini.",
          'Сократить можно, но только общий множитель обоих членов.',
          'It can be cancelled, but only by a factor common to both terms.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bitta yozuv ikki xil qisqartirilgan.", 'Одну запись сократили двумя способами.', 'One record was cancelled in two ways.'),
    A('mount', "Tabloda x ikki bo'lgandagi qiymat turadi. Yozuvning o'zi to'rt beradi.", 'На табло значение при x равном двум. Сама запись даёт четыре.', 'The boards show the value at x equal to two. The record itself gives four.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Chiqarish, bo'lish va o'ziga bo'lish. KVOTA EKRANI.
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
      prompt: '2x + 4',
      ok: L("Ikkilik ikkala haddan chiqdi.", 'Двойка вынеслась из обоих членов.', 'The two came out of both terms.'),
      items: [
        { id: 'a', label: '2(x + 2)', correct: true },
        { id: 'b', label: '2(x + 4)', tag: 'Z6', hint: L("To'rtni ikkiga bo'lsak ikki chiqadi.", 'Четыре разделить на два это два.', 'Four divided by two is two.') },
        { id: 'c', label: 'x + 2', tag: 'Z1', hint: L("Bu bo'lishning natijasi, chiqarish esa ko'paytuvchini oldiga qo'yadi.", 'Это результат деления, а вынесение ставит множитель перед скобкой.', 'That is the result of dividing; taking out puts the factor before the bracket.') },
        { id: 'd', label: '2(2x + 2)', tag: 'Z6', hint: L("Ikki x ni ikkiga bo'lsak x qoladi.", 'Два x разделить на два это x.', 'Two x divided by two is x.') },
      ],
    },
    {
      wrap: false,
      prompt: '6a³ : 3a',
      ok: L("Sonlar bo'lindi, ko'rsatkichlar ayirildi.", 'Числа поделились, показатели вычлись.', 'The numbers divided and the exponents subtracted.'),
      items: [
        { id: 'a', label: '2a²', correct: true },
        { id: 'b', label: '2a³', tag: 'Z4', hint: L("Maxrajda ham a bor, u bittasini o'chiradi.", 'В знаменателе тоже есть a, она вычёркивает одну.', 'The denominator has an a too, and it crosses one out.') },
        { id: 'c', label: '3a²', tag: 'Z6', hint: L("Oltini uchga bo'lsak ikki chiqadi.", 'Шесть разделить на три это два.', 'Six divided by three is two.') },
        { id: 'd', label: '2a', tag: 'Z4', hint: L("Uchdan bitta a o'chirildi, ikkitasi qoladi.", 'Из трёх a вычеркнута одна, остаются две.', 'One a of three is crossed out, two remain.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "5a ni 5a ga bo'lsak nechchi bo'ladi?",
        'Чему равно 5a разделить на 5a?',
        'What is five a divided by five a?',
      ),
      ok: L("Ifoda o'ziga bo'linsa birlik chiqadi.", 'Выражение, разделённое на себя, даёт единицу.', 'An expression divided by itself gives one.'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '0', tag: 'Z2', hint: L("Nol ayirishda chiqadi, bu yerda esa bo'lish.", 'Ноль получается при вычитании, а здесь деление.', 'Zero comes from subtracting, and here we divide.') },
        { id: 'c', label: '5a', tag: 'Z6', hint: L("Hamma ko'paytuvchi o'chadi.", 'Все множители вычёркиваются.', 'Every factor is crossed out.') },
        { id: 'd', label: 'a', tag: 'Z4', hint: L("a ham o'chadi: u ikkala tomonda bor.", 'a тоже вычёркивается: она есть с обеих сторон.', 'The a is crossed out too: it is on both sides.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Ular bugungi ishning uchta qismi.", 'Три коротких вопроса. Это три части сегодняшней работы.', 'Three short questions. They are the three parts of today.'),
    A('1', "Ikkinchisi bo'lish haqida.", 'Второй про деление.', 'The second is about division.'),
    A('2', "Uchinchisi birlik haqida.", 'Третий про единицу.', 'The third is about the one.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. LENTA: qisqartirish bu KO'PAYTUVCHINI o'chirish.
// ============================================================
const S3 = {
  kind: 'tape',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Qisqartirish bu o\'chirish', 'Сокращение это вычёркивание', 'Cancelling is crossing out'),
  expr: 'a⁵ : a³',
  item: 'a',
  count: 5,
  cross: 3,
  options: [
    { id: 'a', label: 'a²' },
    { id: 'b', label: 'a⁸' },
    { id: 'c', label: '1' },
    { id: 'd', label: 'a³' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Bo'lishda ko'rsatkichlar ayiriladi.", 'При делении показатели вычитаются.', 'When dividing, the exponents subtract.') },
    { key: 'c', tag: 'Z2', hint: L("Hamma ko'paytuvchi o'chirilmadi: ikkitasi qoldi.", 'Вычеркнуты не все множители: две остались.', 'Not every factor was crossed out: two remain.') },
    { key: 'd', tag: 'Z6', hint: L("Beshdan uchni ayirsak ikki qoladi.", 'Пять минус три это два.', 'Five minus three is two.') },
  ],
  note: L(
    "Kasrni qisqartirish -- bu umumiy KO'PAYTUVCHILARNI o'chirish. Lentada faqat ko'paytuvchilar turadi, shuning uchun bu yerda xato qilish qiyin.",
    'Сократить дробь значит вычеркнуть общие МНОЖИТЕЛИ. На ленте стоят только множители, поэтому здесь трудно ошибиться.',
    'Cancelling a fraction means crossing out common FACTORS. The tape holds only factors, so it is hard to go wrong here.',
  ),
  audio: [
    A('mount', "Kasr bu bo'lish. Yozuvni bosing va ko'paytuvchilar lentasini ko'ring.", 'Дробь это деление. Нажми на запись и посмотри на ленту множителей.', 'A fraction is a division. Tap the record and look at the factor tape.'),
    A('open', "Maxraj uchta ko'paytuvchini o'chirdi.", 'Знаменатель вычеркнул три множителя.', 'The denominator crossed out three factors.'),
    A('open', "Qolganini sanang.", 'Посчитай, что осталось.', 'Count what is left.'),
  ],
}

// ============================================================
// 4. FARQLASH, SON BILAN: QO'SHILUVCHINI o'chirish mumkin emas.
// Blokning atalgan xatosi.
// ============================================================
const S4 = {
  kind: 'substitute',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Qo\'shiluvchi va ko\'paytuvchi', 'Слагаемое и множитель', 'An addend and a factor'),
  letter: 'x',
  numbers: [1, 2, 5],
  rows: [
    { id: 'r1', role: 'source', expr: '(2x + 4) : 2', sub: (n) => '(2 · ' + n + ' + 4) : 2', val: (n) => (2 * n + 4) / 2 },
    { id: 'r2', expr: 'x + 2', sub: (n) => n + ' + 2', val: (n) => n + 2 },
  ],
  probe: {
    question: L(
      "Nega ikkiliklarni o'chirib x qo'shuv to'rt deb yozib bo'lmaydi?",
      'Почему нельзя вычеркнуть двойки и получить x плюс четыре?',
      'Why can the twos not be crossed out to give x plus four?',
    ),
    items: [
      {
        id: 'mult',
        correct: true,
        label: L("Faqat butun yozuvning ko'paytuvchisi qisqaradi, to'rtlik esa qo'shiluvchi", 'Сокращается только множитель всей записи, а четыре это слагаемое', 'Only a factor of the whole record cancels, and four is an addend'),
      },
      {
        id: 'luck',
        tag: 'Z1',
        label: L("Mumkin, shunchaki bu yerda mos kelmadi", 'Можно, просто здесь не совпало', 'It is allowed, it just did not match here'),
        hint: L(
          "Uch son sinaldi va uchtasida ham farq qildi.",
          'Проверили три числа, и при всех трёх разошлось.',
          'Three numbers were tried, and all three differed.',
        ),
      },
      {
        id: 'four',
        tag: 'Z3',
        label: L("To'rtlikni ham o'chirish kerak edi", 'Надо было вычеркнуть и четвёрку', 'The four should have been crossed out too'),
        hint: L(
          "Unda faqat x qolardi, va ikkida u ikki beradi, to'rt emas.",
          'Тогда остался бы только x, а при двух это два, а не четыре.',
          'Then only x would remain, and at two that is two, not four.',
        ),
      },
      {
        id: 'no',
        tag: 'Z2',
        label: L('Bunday yozuvni umuman qisqartirib bo\'lmaydi', 'Такую запись вообще нельзя сократить', 'Such a record cannot be cancelled at all'),
        hint: L(
          "Qisqartirish mumkin: avval ikkilik ikkala haddan chiqariladi.",
          'Сократить можно: сначала двойка выносится из обоих членов.',
          'It can be cancelled: first the two is taken out of both terms.',
        ),
      },
    ],
  },
  okText: L(
    "Qisqartirish faqat KO'PAYTUVCHI bilan bo'ladi. Shuning uchun avval umumiy ko'paytuvchi chiqariladi, keyin qisqartiriladi.",
    'Сокращать можно ТОЛЬКО множитель. Поэтому сначала выносят общий множитель, и лишь потом сокращают.',
    'Only a FACTOR may be cancelled. So the common factor is taken out first, and only then cancelled.',
  ),
  audio: [
    A('mount', "Yuqorida kasr, pastda to'g'ri qisqartirilgan javob.", 'Сверху дробь, снизу верно сокращённый ответ.', 'Above the fraction, below the correctly cancelled answer.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Ikki qatorni solishtiring: ular mos keldi.", 'Сравни две строки: они совпали.', 'Compare the two rows: they matched.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Qisqartirish IKKI QADAMDA: chiqarish,
// keyin o'chirish.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Avval chiqarish, keyin o\'chirish', 'Сначала вынести, потом вычеркнуть', 'Take out first, then cross out'),
  lines: ['(3x + 6) : 3  =  3(x + 2) : 3'],
  template: ['=  ', { slot: 0 }],
  parts: [
    { id: 'a', label: 'x + 2' },
    { id: 'b', label: 'x + 6' },
    { id: 'c', label: 'x' },
    { id: 'd', label: '3x + 2' },
  ],
  answer: ['a'],
  prompt: L(
    "Qisqartirgandan keyin nima qoladi.",
    'Что останется после сокращения.',
    'What remains after cancelling.',
  ),
  checkNote: L(
    "Uchlik ikkala haddan chiqarildi va maxraj bilan o'chdi. Qavs ichidagi ikki had o'z joyida qoldi.",
    'Тройка вынесена из обоих членов и сократилась с делителем. Оба члена в скобке остались на месте.',
    'The three was taken out of both terms and cancelled with the divisor. Both bracket terms stayed.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Oltilik ham uchga bo'linadi va ikki beradi.", 'Шестёрка тоже делится на три и даёт два.', 'The six divides by three too and gives two.') },
    { key: 'c', tag: 'Z2', hint: L("Qavsda ikki had bor, ikkovi ham qoladi.", 'В скобке два члена, оба остаются.', 'The bracket has two terms, both stay.') },
    { key: 'd', tag: 'Z1', hint: L("Uchlik qavs oldiga chiqarilgan, ichida esa x turadi.", 'Тройка вынесена перед скобку, а внутри стоит x.', 'The three went before the bracket, and x stands inside.') },
  ],
  audio: [
    A('mount', "Qisqartirish ikki qadamdan iborat.", 'Сокращение состоит из двух шагов.', 'Cancelling takes two steps.'),
    A('mount', "Avval umumiy ko'paytuvchi chiqariladi, keyin u maxraj bilan o'chadi.", 'Сначала выносится общий множитель, потом он сокращается со знаменателем.', 'First the common factor comes out, then it cancels with the denominator.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. ISHORA bilan.
// ============================================================
const S6 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Ishora bilan', 'Со знаком', 'With a sign'),
  template: ['(5a − 10) : 5  =  ', { slot: 0 }, ' − ', { slot: 1 }],
  parts: [
    { id: 'a', label: 'a' },
    { id: 'b', label: '2' },
    { id: 'c', label: '5a' },
    { id: 'd', label: '10' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Beshlikni chiqarib qisqartiring.",
    'Вынеси пятёрку и сократи.',
    'Take out the five and cancel.',
  ),
  checkNote: L(
    "Beshlik ikkala haddan chiqdi: qavsda a minus ikki qoldi, va beshlik maxraj bilan o'chdi.",
    'Пятёрка вынеслась из обоих членов: в скобке осталось a минус два, а пятёрка сократилась.',
    'The five came out of both terms: the bracket kept a minus two, and the five cancelled.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Beshlik maxraj bilan o'chdi, u javobda qolmaydi.", 'Пятёрка сократилась со знаменателем, в ответе её нет.', 'The five cancelled with the denominator, it is not in the answer.') },
    { key: 'd', tag: 'Z1', hint: L("O'nlikni beshga bo'lsak ikki chiqadi.", 'Десять разделить на пять это два.', 'Ten divided by five is two.') },
    { key: '*', tag: 'Z1', hint: L("Har hadni beshga bo'ling.", 'Раздели каждый член на пять.', 'Divide each term by five.') },
  ],
  audio: [
    A('mount', "Endi ikkinchi had manfiy. Ish esa o'sha.", 'Теперь второй член отрицательный. А работа та же.', 'Now the second term is negative. The work is the same.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: kasr BUTUNLAY qisqardi, birlik qoldi.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Kasr butunlay qisqardi', 'Дробь сократилась целиком', 'The fraction cancelled entirely'),
  letter: 'a',
  numbers: [1, 2, 5],
  rows: [
    { id: 'r1', role: 'source', expr: '(3a + 6) : (3a + 6)', sub: (n) => '(3 · ' + n + ' + 6) : (3 · ' + n + ' + 6)', val: (n) => (3 * n + 6) / (3 * n + 6) },
    { id: 'r2', expr: '1', sub: () => '1', val: () => 1 },
  ],
  probe: {
    question: L(
      "Surat va maxraj bir xil. Natija nima?",
      'Числитель и знаменатель одинаковы. Каков результат?',
      'The numerator and the denominator are the same. What is the result?',
    ),
    items: [
      {
        id: 'one',
        correct: true,
        label: L('Birlik', 'Единица', 'One'),
      },
      {
        id: 'zero',
        tag: 'Z2',
        label: L('Nol', 'Ноль', 'Zero'),
        hint: L(
          "Nol ayirishda chiqadi. Bo'lishda esa o'ziga bo'linsa bir chiqadi, va sonlar shuni ko'rsatdi.",
          'Ноль получается при вычитании. А при делении на себя выходит один, и числа это показали.',
          'Zero comes from subtracting. Dividing by itself gives one, and the numbers showed it.',
        ),
      },
      {
        id: 'expr',
        tag: 'Z6',
        label: L("3a qo'shuv 6", 'три a плюс шесть', 'three a plus six'),
        hint: L(
          "Bu suratning o'zi. Bo'lishdan keyin esa bir qoladi.",
          'Это сам числитель. А после деления остаётся один.',
          'That is the numerator itself. After dividing, one remains.',
        ),
      },
      {
        id: 'no',
        tag: 'Z1',
        label: L("Ikki hadli yozuvni qisqartirib bo'lmaydi", 'Запись из двух членов сократить нельзя', 'A two term record cannot be cancelled'),
        hint: L(
          "Bu yerda butun yozuv butun yozuvga bo'linadi, ya'ni ko'paytuvchi butunlay o'chadi.",
          'Здесь вся запись делится на всю запись, то есть множитель вычёркивается целиком.',
          'Here the whole record divides the whole record, so the factor cancels completely.',
        ),
      },
    ],
  },
  okText: L(
    "Har qanday yozuv o'ziga bo'linsa birlik chiqadi, ikki hadli yozuv ham. Buni 24-darsda ham ko'rgan edik.",
    'Любая запись, разделённая на себя, даёт единицу, и запись из двух членов тоже. Это мы видели и в уроке 24.',
    'Any record divided by itself gives one, a two term record included. We saw this in lesson 24 as well.',
  ),
  audio: [
    A('mount', "Yuqorida kasr, va uning surati bilan maxraji bir xil.", 'Сверху дробь, и её числитель совпадает со знаменателем.', 'Above a fraction whose numerator equals its denominator.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Natija o'zgarmadi.", 'Результат не менялся.', 'The result never changed.'),
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
    { id: 'f1', label: L("avval umumiy ko'paytuvchini chiqaramiz", 'сначала выносим общий множитель', 'first we take out the common factor') },
    { id: 'f2', label: L("keyin ko'paytuvchini qisqartiramiz", 'потом сокращаем множитель', 'then we cancel the factor') },
    { id: 'f3', label: L("qo'shiluvchini qisqartirib bo'lmaydi", 'слагаемое сокращать нельзя', 'an addend may not be cancelled') },
    { id: 'f4', label: L("umumiy maxraj uchun esa butun suratni ko'paytiramiz", 'а для общего знаменателя домножаем весь числитель', 'and for a common denominator we multiply the whole numerator') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval chiqarish, keyin qisqartirish, keyin taqiq, oxirida umumiy maxraj.",
    'Порядок нарушен. Сначала вынесение, потом сокращение, потом запрет, в конце общий знаменатель.',
    'The order is off. Taking out first, then cancelling, then the prohibition, and the common denominator last.',
  ),
  lawChips: [
    { label: '( )', tone: 'par' },
    { label: ':', tone: 's2' },
    { label: '1', tone: 'off' },
    { label: '+', tone: 's1' },
  ],
  lawSweep: L(
    "qavs, bo'lish, birlik, qo'shish",
    'скобка, деление, единица, сложение',
    'the bracket, division, one, adding',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Kasr faqat surat va maxrajning umumiy KO'PAYTUVCHISIGA qisqartiriladi. Shuning uchun avval umumiy ko'paytuvchi qavsdan chiqariladi, keyin qisqartiriladi. Qo'shiluvchini qisqartirib bo'lmaydi.",
        'Дробь сокращают только на общий МНОЖИТЕЛЬ числителя и знаменателя. Поэтому сначала выносят общий множитель, и лишь потом сокращают. Слагаемое сокращать нельзя.',
        'A fraction is cancelled only by a common FACTOR of the numerator and the denominator. So the common factor is taken out first, and only then cancelled. An addend may not be cancelled.',
      ),
      L(
        "Umumiy maxrajga keltirganda maxraj nechchiga ko'paytirilsa, BUTUN surat ham shunchaga ko'paytiriladi -- bitta hadi emas, hammasi.",
        'При приведении к общему знаменателю на что умножается знаменатель, на то же домножается ВЕСЬ числитель — не один его член, а все.',
        'When bringing to a common denominator, whatever multiplies the denominator multiplies the WHOLE numerator — every term, not one.',
      ),
    ],
  },
  hookCap: L(
    "Faqat ko'paytuvchi qisqaradi",
    'Сокращается только множитель',
    'Only a factor cancels',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("avval chiqarish", 'сначала вынести', 'take out first'),
    L("keyin qisqartirish", 'потом сократить', 'then cancel'),
    L("surat butunlay ko'paytiriladi", 'числитель домножается весь', 'the whole numerator is multiplied'),
  ],
  audio: [
    A('mount', "Uch holatni ko'rdik: o'chirish, qo'shiluvchi va birlik. Endi qoidani yig'amiz.", 'Три случая мы увидели: вычёркивание, слагаемое и единицу. Теперь соберём правило.', 'We have seen three cases: crossing out, the addend and the one. Now let us build the rule.'),
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
      prompt: '(4x + 12) : 4',
      ok: L("To'rtlik ikkala haddan chiqdi va qisqardi.", 'Четвёрка вынеслась из обоих членов и сократилась.', 'The four came out of both terms and cancelled.'),
      items: [
        { id: 'a', label: 'x + 3', correct: true },
        { id: 'b', label: 'x + 12', tag: 'Z1', hint: L("O'n ikkilik ham to'rtga bo'linadi.", 'Двенадцать тоже делится на четыре.', 'Twelve divides by four as well.') },
        { id: 'c', label: 'x', tag: 'Z2', hint: L("Ikkinchi had yo'qolmaydi.", 'Второй член не исчезает.', 'The second term does not vanish.') },
        { id: 'd', label: '4x + 3', tag: 'Z4', hint: L("Birinchi had ham bo'linadi.", 'Первый член тоже делится.', 'The first term divides too.') },
      ],
    },
    {
      wrap: false,
      prompt: '(6a − 9) : 3',
      ok: L("Uchlik chiqdi, ishora esa o'z joyida qoldi.", 'Тройка вынеслась, а знак остался на месте.', 'The three came out, and the sign stayed.'),
      items: [
        { id: 'a', label: '2a − 3', correct: true },
        { id: 'b', label: '2a − 9', tag: 'Z1', hint: L("To'qqizlik ham uchga bo'linadi.", 'Девятка тоже делится на три.', 'The nine divides by three as well.') },
        { id: 'c', label: '2a + 3', tag: 'Z3', hint: L("Bo'luvchi musbat, demak ishora o'zgarmaydi.", 'Делитель положительный, значит знак не меняется.', 'The divisor is positive, so the sign does not change.') },
        { id: 'd', label: '6a − 3', tag: 'Z4', hint: L("Birinchi had ham uchga bo'linadi.", 'Первый член тоже делится на три.', 'The first term divides by three too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qaysi yozuvni qisqartirib bo'lmaydi?",
        'Какую запись сократить нельзя?',
        'Which record cannot be cancelled?',
      ),
      ok: L("Uch qo'shuv x da umumiy ko'paytuvchi yo'q.", 'В три плюс x нет общего множителя.', 'Three plus x has no common factor.'),
      items: [
        { id: 'a', label: '(3 + x) : 3', correct: true },
        { id: 'b', label: '(3x + 3) : 3', tag: 'Z1', hint: L("Bu yerda uchlik ikkala hadda bor.", 'Здесь тройка есть в обоих членах.', 'Here the three is in both terms.') },
        { id: 'c', label: '(6x + 9) : 3', tag: 'Z1', hint: L("Olti ham, to'qqiz ham uchga bo'linadi.", 'И шесть, и девять делятся на три.', 'Both six and nine divide by three.') },
        { id: 'd', label: '(3x − 3) : 3', tag: 'Z1', hint: L("Uchlik ikkala hadda bor.", 'Тройка есть в обоих членах.', 'The three is in both terms.') },
      ],
    },
    {
      wrap: false,
      prompt: '(2a + 2b) : (a + b)',
      ok: L("Ikkilik chiqarilgach, qavs maxraj bilan qisqardi.", 'После вынесения двойки скобка сократилась со знаменателем.', 'After the two came out, the bracket cancelled with the denominator.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '2a', tag: 'Z4', hint: L("Qavs butunlay qisqaradi: unda a qo'shuv b turibdi.", 'Скобка сокращается целиком: в ней a плюс b.', 'The bracket cancels whole: it holds a plus b.') },
        { id: 'c', label: '2ab', tag: 'Z4', hint: L("Qavs ichidagi yig'indi maxrajga teng.", 'Сумма в скобке равна знаменателю.', 'The sum in the bracket equals the denominator.') },
        { id: 'd', label: '0', tag: 'Z2', hint: L("Qisqargandan keyin ikkilik qoladi, nol emas.", 'После сокращения остаётся двойка, а не ноль.', 'After cancelling a two remains, not zero.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Uchinchisi qisqartirilmaydigan yozuv haqida.", 'Четыре вопроса. Третий про запись, которую нельзя сократить.', 'Four questions. The third is about a record that cannot be cancelled.'),
    A('1', "Ikkinchisida ishora bor.", 'Во втором есть знак.', 'The second has a sign.'),
    A('2', "Uchinchisiga o'ylab javob bering.", 'На третий ответь подумав.', 'Think before answering the third.'),
    A('3', "Oxirgisida maxraj ham qavsli.", 'В последнем знаменатель тоже со скобкой.', 'In the last one the denominator has a bracket too.'),
  ],
}

// ============================================================
// 10. MASHQ 2. UMUMIY MAXRAJ. Qadamlar atalgan.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Umumiy maxraj', 'Общий знаменатель', 'A common denominator'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['a/2 + a/3  =  ', { slot: 0 }, '/6 + ', { slot: 1 }, '/6'],
  parts: [
    { id: 'a', label: '3a' },
    { id: 'b', label: '2a' },
    { id: 'c', label: 'a' },
    { id: 'd', label: '6a' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki kasrni oltinchi maxrajga keltiring.",
    'Приведи обе дроби к знаменателю шесть.',
    'Bring both fractions to the denominator six.',
  ),
  checkNote: L(
    "Birinchi maxraj uchga ko'paytirildi, demak surat ham uchga. Ikkinchisi ikkiga, demak surat ham ikkiga.",
    'Первый знаменатель умножили на три, значит и числитель на три. Второй на два, значит и числитель на два.',
    'The first denominator was multiplied by three, so the numerator too. The second by two, so its numerator too.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z5', hint: L("Maxraj o'zgardi, demak surat ham o'zgarishi kerak.", 'Знаменатель изменился, значит и числитель должен измениться.', 'The denominator changed, so the numerator must change too.') },
    { key: 'd', tag: 'Z6', hint: L("Ikkidan oltiga o'tish uchun uchga ko'paytiriladi.", 'Чтобы из двух получить шесть, умножают на три.', 'To turn two into six you multiply by three.') },
    { key: '*', tag: 'Z5', hint: L("Maxraj nechchiga ko'paytirilsa, surat ham shunchaga.", 'На что умножен знаменатель, на то же и числитель.', 'Whatever multiplies the denominator multiplies the numerator.') },
  ],
  probe: {
    question: L('Ikkisi birga nechchi beradi?', 'Сколько получится вместе?', 'What do the two give together?'),
    items: [
      { id: 'a', correct: true, label: '5a/6' },
      { id: 'b', tag: 'Z6', label: 'a/6', hint: L("Uch a va ikki a besh a beradi.", 'Три a и два a дают пять a.', 'Three a and two a give five a.') },
      { id: 'c', tag: 'Z5', label: '5a/12', hint: L("Maxraj olti bo'lib qoladi, ikki marta olinmaydi.", 'Знаменатель остаётся шесть, он не берётся дважды.', 'The denominator stays six, it is not taken twice.') },
      { id: 'd', tag: 'Z6', label: '6a/6', hint: L("Suratlar qo'shiladi: uch a va ikki a.", 'Числители складываются: три a и два a.', 'The numerators add: three a and two a.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval umumiy maxraj, keyin qo'shish.", 'Два шага. Сначала общий знаменатель, потом сложение.', 'Two steps. The common denominator first, then adding.'),
    A('mount', "Umumiy maxraj olti: ikki ham, uch ham unga bo'linadi.", 'Общий знаменатель шесть: и два, и три на него делятся.', 'The common denominator is six: both two and three divide it.'),
    A('two', "Endi ikkinchi qadam: suratlarni qo'shing.", 'Теперь второй шаг: сложи числители.', 'Now the second step: add the numerators.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. SURAT BUTUNLAY ko'paytiriladi -- blokning
// ikkinchi atalgan xatosi.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Surat butunlay', 'Числитель целиком', 'The whole numerator'),
  template: ['(a + 1)/3  =  ', { slot: 0 }, '/6'],
  parts: [
    { id: 'a', label: '2a + 2' },
    { id: 'b', label: '2a + 1' },
    { id: 'c', label: 'a + 2' },
    { id: 'd', label: '2a' },
  ],
  answer: ['a'],
  prompt: L(
    "Maxraj ikkiga ko'paytirildi. Suratni yozing.",
    'Знаменатель умножили на два. Запиши числитель.',
    'The denominator was multiplied by two. Write the numerator.',
  ),
  checkNote: L(
    "Butun surat ikkiga ko'paytirildi: a ham, birlik ham. Shuning uchun ikki a qo'shuv ikki.",
    'Весь числитель умножен на два: и a, и единица. Поэтому два a плюс два.',
    'The whole numerator was multiplied by two: both a and the one. Hence two a plus two.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Birlik ham ikkiga ko'paytiriladi.", 'Единицу тоже надо умножить на два.', 'The one must be multiplied by two as well.') },
    { key: 'c', tag: 'Z5', hint: L("a ham ikkiga ko'paytiriladi.", 'a тоже умножается на два.', 'The a is multiplied by two too.') },
    { key: 'd', tag: 'Z2', hint: L("Birlik yo'qolmaydi, u ham ko'paytiriladi.", 'Единица не исчезает, она тоже умножается.', 'The one does not vanish, it gets multiplied too.') },
  ],
  audio: [
    A('mount', "Maxraj ikki marta katta bo'ldi. Surat bilan nima bo'lishi kerak.", 'Знаменатель стал в два раза больше. Что должно стать с числителем.', 'The denominator became twice as big. What must happen to the numerator.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Ikki bo'linma to'g'ri, lekin javobda ikkinchi
// had QISQARTIRILMAGAN holda qolgan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Bo'linma to'g'ri hisoblangan. Shunday bo'lsa ham, qaysi qator xato?",
    'Частное посчитано верно. И всё же какая строка ошибочна?',
    'The quotient is computed right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '(4x + 8) : 4' },
    { id: 'r2', text: L('faqat birinchi had bo\'linadi', 'делится только первый член', 'only the first term is divided') },
    { id: 'r3', text: '4x : 4 = x' },
    { id: 'r4', text: L('x + 8', 'x + 8', 'x + 8') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r3: L("To'g'ri: to'rt x ni to'rtga bo'lsak x chiqadi.", 'Верно: четыре x разделить на четыре это x.', 'Right: four x divided by four is x.'),
    r4: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z1', r3: 'Z1', r4: 'Z1' },
  proofFill: {
    template: ['(4x + 8) : 4  =  ', { slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: '4(x + 2) : 4' },
      { id: 'b', label: 'x + 2' },
      { id: 'c', label: 'x + 8' },
      { id: 'd', label: '4x + 2' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Umumiy ko'paytuvchini chiqaring va javobni tuzating.",
      'Вынеси общий множитель и исправь ответ.',
      'Take out the common factor and fix the answer.',
    ),
    checkNote: L(
      "Ikkinchi bo'linma hisoblangan edi, lekin javobga ko'chirilmagan. To'rtlik chiqarilsa, xato bo'lishi mumkin emas.",
      'Второе частное было посчитано, но в ответ не перенесено. Если вынести четвёрку, ошибиться невозможно.',
      'The second quotient was computed but never carried into the answer. Take the four out and the mistake becomes impossible.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z1', hint: L("Sakkizlik ham to'rtga bo'linadi, javobda ikki turadi.", 'Восьмёрка тоже делится на четыре, в ответе стоит два.', 'The eight divides by four too, the answer holds two.') },
      { key: 'd', tag: 'Z4', hint: L("Birinchi had ham bo'linadi.", 'Первый член тоже делится.', 'The first term divides too.') },
      { key: '*', tag: 'Z1', hint: L("Avval umumiy ko'paytuvchi chiqariladi.", 'Сначала выносится общий множитель.', 'The common factor comes out first.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda ikki bo'linma ham to'g'ri hisoblangan.", 'В этой ловушке оба частных посчитаны верно.', 'In this trap both quotients are computed right.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Ikkinchi bo'linma javobga ko'chirilmagan.", 'Нашёл. Второе частное не перенесли в ответ.', 'You found it. The second quotient never reached the answer.'),
    A('done', "Ko'paytuvchini chiqarish shu xatoni imkonsiz qiladi.", 'Вынесение множителя делает эту ошибку невозможной.', 'Taking out the factor makes this mistake impossible.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. BLOKNI YOPADI: surat kvadratlar ayirmasi bilan
// ajratiladi va qavs maxraj bilan qisqaradi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Formula qisqartirishga yordam beradi', 'Формула помогает сократить', 'A formula helps to cancel'),
  given: L(
    "Suratda kvadratlar ayirmasi turibdi. Uni ajratsak, bitta qavs maxraj bilan qisqaradi.",
    'В числителе стоит разность квадратов. Если её разложить, одна скобка сократится со знаменателем.',
    'The numerator is a difference of squares. Factor it and one bracket cancels with the denominator.',
  ),
  template: ['(a² − 9)/(a + 3)  =  (a − 3)(a + 3)/(a + 3)  =  ', { slot: 0 }],
  parts: [
    { id: 'a', label: 'a − 3' },
    { id: 'b', label: 'a + 3' },
    { id: 'c', label: 'a² − 3' },
    { id: 'd', label: 'a' },
  ],
  answer: ['a'],
  prompt: L(
    "Qisqargandan keyin nima qoladi.",
    'Что останется после сокращения.',
    'What remains after cancelling.',
  ),
  checkNote: L(
    "Surat kvadratlar ayirmasi formulasi bilan ajratildi, va a qo'shuv uch qavsi maxraj bilan o'chdi. Ikkinchi qavs qoldi.",
    'Числитель разложен по формуле разности квадратов, и скобка a плюс три сократилась со знаменателем. Осталась вторая скобка.',
    'The numerator was factored by the difference of squares, and the bracket a plus three cancelled with the denominator. The other bracket remains.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Aynan shu qavs maxraj bilan qisqardi, u javobda qolmaydi.", 'Именно эта скобка сократилась со знаменателем, в ответе её нет.', 'That very bracket cancelled with the denominator, it is not in the answer.') },
    { key: 'c', tag: 'Z1', hint: L("Qavsni qisman qisqartirib bo'lmaydi: u butun ko'paytuvchi.", 'Скобку нельзя сократить частично: она целый множитель.', 'A bracket cannot be cancelled in part: it is a whole factor.') },
    { key: 'd', tag: 'Z2', hint: L("Qavsdagi uchlik ham qoladi.", 'Тройка в скобке тоже остаётся.', 'The three in the bracket stays too.') },
  ],
  audio: [
    A('mount', "Bu ekran blokni yopadi: formulalar kasrlarni qisqartirishga yordam beradi.", 'Этот экран замыкает блок: формулы помогают сокращать дроби.', 'This screen closes the block: the formulas help cancel fractions.'),
    A('mount', "Suratni ajratib, umumiy ko'paytuvchini toping.", 'Разложи числитель и найди общий множитель.', 'Factor the numerator and find the common factor.'),
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
      prompt: '(6x + 3) : 3',
      ok: L("Uchlik ikkala haddan chiqdi.", 'Тройка вынеслась из обоих членов.', 'The three came out of both terms.'),
      items: [
        { id: 'a', label: '2x + 1', correct: true },
        { id: 'b', label: '2x + 3', tag: 'Z1', hint: L("Uchlikni uchga bo'lsak bir chiqadi.", 'Три разделить на три это один.', 'Three divided by three is one.') },
        { id: 'c', label: '2x', tag: 'Z2', hint: L("Ikkinchi had yo'qolmaydi: u birga aylanadi.", 'Второй член не исчезает: он становится единицей.', 'The second term does not vanish: it becomes one.') },
        { id: 'd', label: '6x + 1', tag: 'Z4', hint: L("Birinchi had ham uchga bo'linadi.", 'Первый член тоже делится на три.', 'The first term divides by three too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qaysi yozuvni qisqartirib bo'lmaydi?",
        'Какую запись сократить нельзя?',
        'Which record cannot be cancelled?',
      ),
      ok: L("Ikki qo'shuv a da umumiy ko'paytuvchi yo'q.", 'В два плюс a нет общего множителя.', 'Two plus a has no common factor.'),
      items: [
        { id: 'a', label: '(2 + a) : 2', correct: true },
        { id: 'b', label: '(2a + 2) : 2', tag: 'Z1', hint: L("Ikkilik ikkala hadda bor.", 'Двойка есть в обоих членах.', 'The two is in both terms.') },
        { id: 'c', label: '(4a + 6) : 2', tag: 'Z1', hint: L("To'rt ham, olti ham ikkiga bo'linadi.", 'И четыре, и шесть делятся на два.', 'Both four and six divide by two.') },
        { id: 'd', label: '(2a − 8) : 2', tag: 'Z1', hint: L("Ikkilik ikkala hadda bor.", 'Двойка есть в обоих членах.', 'The two is in both terms.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: 'b/4 + b/2',
      ok: L("Umumiy maxraj to'rt: ikkinchi kasrning surati ikkiga ko'paytirildi.", 'Общий знаменатель четыре: числитель второй дроби домножен на два.', 'The common denominator is four: the second numerator was multiplied by two.'),
      items: [
        { id: 'a', label: '3b/4', correct: true },
        { id: 'b', label: '2b/4', tag: 'Z5', hint: L("Ikkinchi kasrning surati ikkiga ko'paytiriladi, ya'ni ikki b bo'ladi.", 'Числитель второй дроби умножается на два, то есть станет два b.', 'The second numerator is multiplied by two, becoming two b.') },
        { id: 'c', label: '2b/6', tag: 'Z6', hint: L("Maxrajlar qo'shilmaydi, umumiy maxraj tanlanadi.", 'Знаменатели не складываются, выбирается общий.', 'Denominators do not add, a common one is chosen.') },
        { id: 'd', label: '3b/6', tag: 'Z5', hint: L("Umumiy maxraj to'rt: ikki to'rtga bo'linadi.", 'Общий знаменатель четыре: два делит четыре.', 'The common denominator is four: two divides four.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(x² − 4)/(x − 2)',
      ok: L("Surat ajratildi va bitta qavs qisqardi.", 'Числитель разложен, и одна скобка сократилась.', 'The numerator factored and one bracket cancelled.'),
      items: [
        { id: 'a', label: 'x + 2', correct: true },
        { id: 'b', label: 'x − 2', tag: 'Z4', hint: L("Aynan shu qavs maxraj bilan qisqardi.", 'Именно эта скобка сократилась со знаменателем.', 'That is the bracket that cancelled with the denominator.') },
        { id: 'c', label: 'x² − 2', tag: 'Z1', hint: L("Qavsni qisman qisqartirib bo'lmaydi.", 'Скобку нельзя сократить частично.', 'A bracket cannot be cancelled in part.') },
        { id: 'd', label: 'x', tag: 'Z2', hint: L("Qavsdagi ikkilik ham qoladi.", 'Двойка в скобке тоже остаётся.', 'The two in the bracket stays too.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi qisqartirilmaydigan yozuv haqida.", 'Второй про запись, которую нельзя сократить.', 'The second is about a record that cannot be cancelled.'),
    A('2', "Uchinchisi umumiy maxraj haqida.", 'Третий про общий знаменатель.', 'The third is about a common denominator.'),
    A('3', "Oxirgisida formula yordam beradi.", 'В последнем поможет формула.', 'In the last one a formula helps.'),
  ],
}

// ============================================================
// 15. YAKUN. B5 BLOKI YOPILDI.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Faqat ko\'paytuvchi qisqaradi', 'Сокращается только множитель', 'Only a factor cancels'),
  gate: S1.gate,
  fix: {
    tokens: ['x', '+', '2'],
    value: '4',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Qisqartirish faqat ko'paytuvchi bilan bo'ladi. Avval ikkilik ikkala haddan chiqariladi, keyin u maxraj bilan o'chadi. Ikkida to'rt chiqadi.",
    'Сокращать можно только множитель. Сначала двойка выносится из обоих членов, потом сокращается со знаменателем. При двух выходит четыре.',
    'Only a factor may be cancelled. First the two comes out of both terms, then it cancels with the denominator. At two it gives four.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    factor: L("ko'paytuvchini chiqarish", 'вынести множитель', 'take out the factor'),
    cross: L("ikkiliklarni o'chirish", 'вычеркнуть двойки', 'cross out the twos'),
    both: L('ikkovi ham', 'оба', 'both of them'),
    none: L("qisqartirib bo'lmaydi", 'сократить нельзя', 'cannot be cancelled'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(2x + 4) : 2 → x + 2', 'a/2 + a/3 → 5a/6', '(a + 1)/3 → 2a + 2', 'a² − 9 → (a − 3)'],
  twoLabel: L('B5 bloki yopildi', 'Блок Б5 закрыт', 'Block B5 is closed'),
  twoA: L(
    "ko'paytuvchi  →  qisqaradi",
    'множитель  →  сокращается',
    'a factor  →  cancels',
  ),
  twoB: L(
    "qo'shiluvchi  →  qisqarmaydi",
    'слагаемое  →  не сокращается',
    'an addend  →  does not cancel',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'koordinatalar tekisligi',
    'координатная плоскость',
    'the coordinate plane',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta so'zdan chiqdi: ko'paytuvchi. Qo'shiluvchi qisqarmaydi.", 'Вся сегодняшняя работа вышла из одного слова: множитель. Слагаемое не сокращается.', 'All of today came from one word: factor. An addend does not cancel.'),
    A('mount', "Qisqa ko'paytirish formulalari bloki shu bilan yopildi. Keyingi blokda koordinatalar tekisligi.", 'Блок формул сокращённого умножения на этом закрыт. В следующем блоке координатная плоскость.', 'The block of special product formulas closes here. The next block brings the coordinate plane.'),
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
