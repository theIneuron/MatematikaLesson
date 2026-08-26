// Dars22 · Amaliyot 06 — Kod · 🟡 · tag: code_root_counts
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §4 (22-dars, 6-pozitsiya)
//
// UCH TENGLAMA — UCH XIL NATIJA, VA UCHALASINI HAM T HAL QILADI:
//   x⁴ + 5x² + 4 = 0   -> t = −1 va −4, ikkalasi manfiy    -> 0 ta ildiz
//   x⁴ − 3x² − 4 = 0   -> t = 4 va −1, bittasi rad etiladi -> 2 ta ildiz
//   x⁴ − 17x² + 16 = 0 -> t = 1 va 16, ikkalasi musbat     -> 4 ta ildiz
//
// Bankdagi tuzoqlar: `8` — «har t dan to'rtta» degan qarash; `1` va `3` —
// manfiy t ni ham sanash (З48). Kod O'SISH tartibida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_root_counts', level: '🟡',
  expr: ['x⁴+5x²+4=0', '   ', 'x⁴−3x²−4=0', '   ', 'x⁴−17x²+16=0'],
  exprSize: 14,
  cards: ['0', '1', '2', '3', '4', '8'],
  answer: ['0', '2', '4'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch bikvadrat tenglama berilgan. Har birida x² = t belgilash qiling, t larni toping va ulardan nechta x chiqishini sanang.",
    'В комнате сейф, код трёхзначный. Даны три биквадратных уравнения. В каждом сделай замену x² = t, найди значения t и сосчитай, сколько x из них выходит.',
    'There is a safe in the room and its code has three places. Three biquadratic equations are given. In each, make the substitution x² = t, find the values of t and count how many values of x they yield.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch tenglamaning ildizlari sonini kodga o'sish tartibida yozing.",
    'Запиши числа корней трёх уравнений в код по возрастанию.',
    'Write the numbers of roots of the three equations into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisida t minus bir va minus to'rt — ikkalasi manfiy, ildiz yo'q. Ikkinchisida to'rt va minus bir — minus bir rad etiladi, ikki ildiz qoladi. Uchinchisida bir va o'n olti — ikkalasi musbat, to'rt ildiz. O'sish tartibida: nol, ikki, to'rt.",
    'Верно. В первом t равно минус одному и минус четырём — оба отрицательны, корней нет. Во втором четыре и минус один — минус один отбрасывается, остаётся два корня. В третьем один и шестнадцать — оба положительны, четыре корня. По возрастанию: нуль, два, четыре.',
    'Correct. In the first t is minus one and minus four — both negative, no roots. In the second four and minus one — minus one is rejected, two roots remain. In the third one and sixteen — both positive, four roots. In increasing order: zero, two, four.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('8') !== -1, text: L(
      "Sakkiz chiqishi uchun har t to'rtta x berishi kerak edi. Aslida har t ko'pi bilan IKKITA beradi: musbat t da plyus va minus, nolda bitta, manfiyda esa hech biri. Ikki t bo'lgani uchun eng ko'p to'rtta ildiz bo'ladi.",
      'Восемь вышло бы, если бы каждое t давало по четыре x. На деле каждое t даёт не больше ДВУХ: при положительном плюс и минус, при нуле один, при отрицательном ни одного. Раз t два, то корней самое большее четыре.',
      'Eight would come out if every t gave four values of x. In fact each t gives at most TWO: for a positive one plus and minus, for zero one, for a negative none. Since there are two values of t, there are at most four roots.') },
    { when: (s) => s.slots.indexOf('1') !== -1 || s.slots.indexOf('3') !== -1, text: L(
      "Toq son chiqishi uchun t larning biri NOL bo'lishi kerak edi — faqat nol bitta ildiz beradi. Bu uch tenglamada nol t yo'q: ildizlar minus bir, minus to'rt, to'rt, bir, o'n olti. Demak javoblar juft son bo'ladi.",
      'Нечётное число вышло бы, если бы одно из t было НУЛЁМ — только нуль даёт один корень. В этих трёх уравнениях нулевого t нет: корни минус один, минус четыре, четыре, один, шестнадцать. Значит ответы будут чётными.',
      'An odd number would come out if one of the values of t were ZERO — only zero gives a single root. These three equations have no zero t: the roots are minus one, minus four, four, one, sixteen. So the answers are even numbers.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: nol, ikki, to'rt. Tenglamalarning tartibi bu yerda javoblarning tartibi bilan mos keladi, lekin ularni ATAYLAB tekshirish kerak.",
      'Три числа найдены верно, а порядок нарушен. Код пишется по возрастанию: нуль, два, четыре. Порядок уравнений здесь совпадает с порядком ответов, но проверить это надо СПЕЦИАЛЬНО.',
      'The three numbers are right, the order is not. The code goes in increasing order: zero, two, four. Here the order of the equations happens to match the order of the answers, but that must be checked ON PURPOSE.') },
    { when: (s) => s.slots.indexOf('0') === -1, text: L(
      "Kodda nol yo'q, lekin bitta tenglamada ildiz umuman yo'q. Birinchisiga qarang: t kvadrat qo'shuv besh t qo'shuv to'rt nolga teng, ildizlari minus bir va minus to'rt. Ikkalasi ham manfiy, x kvadrat esa manfiy bo'lmaydi — demak haqiqiy ildiz yo'q.",
      'В коде нет нуля, а у одного уравнения корней нет вовсе. Посмотри на первое: t квадрат плюс пять t плюс четыре равно нулю, корни минус один и минус четыре. Оба отрицательны, а x квадрат отрицательным не бывает — значит действительных корней нет.',
      'The code has no zero, yet one equation has no roots at all. Look at the first: t squared plus five t plus four equals zero, roots minus one and minus four. Both are negative, and x squared is never negative — so there are no real roots.') },
  ],
  wrongText: L(
    "Har tenglamada belgilash qiling va t larni toping. Keyin har t ni sanang: musbat ikkita, nol bitta, manfiy esa nol ta x beradi. Uch javobni o'sish tartibida joylashtiring.",
    'В каждом уравнении сделай замену и найди t. Потом сосчитай по каждому t: положительное даёт два x, нуль один, отрицательное ни одного. Три ответа расставь по возрастанию.',
    'In each equation make the substitution and find t. Then count for each t: a positive one gives two values of x, zero gives one, a negative gives none. Put the three answers in increasing order.'),
};

export default function D22_06(props) { return <CodeLock data={DATA} {...props} />; }
