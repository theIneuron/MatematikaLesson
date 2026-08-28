// Dars16 · Amaliyot 03 — Jadval · 🟢 · teg: faqat-bitta-tengsizlikni-tekshirish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// Jadval BITTA tengsizlikning chegarasini sonlarda topadi: ikki iks minus
// olti qayerda nolga aylanadi. Bu — sistemani yechishning birinchi yarmi,
// va razborda ikkinchi yarmi ham aytiladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'faqat-bitta-tengsizlikni-tekshirish', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Sistemaning bitta tengsizligi shu ifodadan tuzilgan. Jadval uning chegarasini topishga yordam beradi.",
    'Одно неравенство системы составлено из этого выражения. Таблица помогает найти его границу.',
    'One inequality of the system is built from this expression. The table helps find its boundary.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = 2x − 6'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '0', y: '−6' },
    { id: 'c2', x: '2', y: '−2' },
    { id: 'c3', x: '', y: '0', ans: 3, hole: 'x' },
    { id: 'c4', x: '5', y: '', ans: 4, hole: 'y' },
  ],
  correctText: L(
    "To'g'ri: nol uchda chiqadi, beshda esa qiymat to'rt. Demak ikki iks minus olti uchdan chapda manfiy, uchdan o'ngda musbat, va uchning o'zida nol — «katta yoki teng» tengsizligining javobi shu yerdan boshlanadi. Lekin bu hali SISTEMANING javobi emas: ikkinchi tengsizlik ham tekshirilishi kerak, va u chegarani o'ngdan yoki chapdan qisqartirishi mumkin.",
    'Верно: нуль выходит при трёх, а при пяти значение четыре. Значит два икс минус шесть отрицательно левее трёх, положительно правее и равно нулю в самой тройке — отсюда и начинается ответ неравенства «больше или равно». Но это ещё не ответ СИСТЕМЫ: второе неравенство тоже надо проверить, и оно может урезать границу справа или слева.',
    'Correct: zero comes at three, and at five the value is four. So two x minus six is negative left of three, positive to the right, and zero at three itself — that is where the answer of a "greater than or equal" inequality begins. But this is not the answer of the SYSTEM yet: the second inequality must be checked too, and it may cut the range from the right or the left.'),
  wrongs: [
    { when: (s) => s.vals.c3 === 6, text: L(
      "Oltini ikkiga bo'lish qadami tushib qolgan. Ikki iks minus olti nolga teng bo'lsa, ikki iks oltiga teng, ya'ni iks uch.",
      'Пропущен шаг деления шести на два. Если два икс минус шесть равно нулю, то два икса равны шести, значит икс равен трём.',
      'The step of dividing six by two was skipped. If two x minus six is zero, then two x is six, so x is three.') },
    { when: (s) => s.vals.c3 === 0, text: L(
      "Nol pastki qatorda turibdi — bu ifodaning QIYMATI. Yuqori qatorda esa shu qiymatni beradigan iks so'ralyapti.",
      'Нуль стоит в нижней строке — это ЗНАЧЕНИЕ выражения. А в верхней строке спрашивают икс, дающий это значение.',
      'The zero sits in the bottom row — that is the VALUE of the expression. The top row asks for the x that gives that value.') },
    { when: (s) => s.vals.c4 === 10, text: L(
      "Ozod had tushib qolgan. Ikki karra besh o'n, lekin undan yana oltini ayirish kerak: o'n minus olti to'rt.",
      'Потерян свободный член. Дважды пять — десять, но из него надо ещё вычесть шесть: десять минус шесть — четыре.',
      'The constant term was dropped. Two times five is ten, but six must still be subtracted: ten minus six is four.') },
    { when: (s) => s.vals.c4 === -1 || s.vals.c4 === -4, text: L(
      "Beshda qiymatni o'zingiz hisoblang: ikki karra besh o'n, o'n minus olti to'rt — musbat son.",
      'Посчитай значение при пяти сам: дважды пять — десять, десять минус шесть — четыре, положительное число.',
      'Compute the value at five yourself: two times five is ten, ten minus six is four, a positive number.') },
  ],
  wrongText: L(
    "Har katakda formulani ishlatib ko'ring: iks berilgan bo'lsa, ikkiga ko'paytirib oltini ayiring; igrek berilgan bo'lsa, teskari yo'lda yuring.",
    'В каждой клетке применяй формулу: если дан икс, умножь на два и вычти шесть; если дан игрек, иди обратным путём.',
    'Use the formula in each cell: given x, multiply by two and subtract six; given y, work backwards.'),
};

export default function D16_03(props) { return <RowTable data={DATA} {...props} />; }
