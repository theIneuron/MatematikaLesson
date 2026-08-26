// Dars29 · Amaliyot 06 — Tartib · 🟡 · tag: abs_ineq_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §11 (29-dars, 6-pozitsiya)
//
// T3 NING YO'LI: modulli tengsizlik QO'SH tengsizlikka ochiladi, keyin
// hamma qismga bir xil son qo'shiladi, va javob oraliq bilan yoziladi
// (27-darsning yozuvi).
//
// Qo'sh tengsizlikka o'tishni qo'shishdan KEYIN qo'yish — asosiy xato:
// o'shanda modul hali ochilmagan bo'ladi, va unga qo'shish mumkin emas.
// Kartada SO'Z asosiy, matematika qisqa dalil, yozuv bo'shliqsiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'abs_ineq_steps', level: '🟡',
  expr: ['|x − 1| ≤ 4'], exprSize: 26,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['−4≤x−1≤4'],
      label: L("qo'sh tengsizlikka yozamiz", 'записываем двойным неравенством', 'write it as a double inequality') },
    { id: 'l2', tokens: ['+1'],
      label: L("hamma qismga 1 qo'shamiz", 'прибавляем 1 ко всем частям', 'add 1 to every part') },
    { id: 'l3', tokens: ['−3≤x≤5'],
      label: L('yechimni yozamiz', 'записываем решение', 'write the solution') },
    { id: 'l4', tokens: ['[−3;5]'],
      label: L('oraliq bilan yozamiz', 'записываем промежутком', 'write it as a range') },
  ],
  start: ['l2', 'l1', 'l4', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Modulli tengsizlikni yechish to'rt qadamdan iborat, lekin qadamlar aralashib ketgan. Oxirgi qadam 27-darsning yozuvi.",
    'Решение неравенства с модулем состоит из четырёх шагов, но шаги перепутаны. Последний шаг — запись из урока 27.',
    'Solving an inequality with an absolute value takes four steps, but the steps are mixed up. The last step is the notation from lesson 27.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval modulni ochamiz: ichkaridagi ifoda minus to'rt bilan to'rt orasida. Keyin uchala qismga bir qo'shamiz, keyin yechimni yozamiz, oxirida oraliq bilan. Tekshirish: x nol bo'lsa, birning moduli bir, bir to'rtdan kichik.",
    'Верно. Сначала раскрываем модуль: выражение внутри между минус четырьмя и четырьмя. Потом прибавляем единицу ко всем трём частям, затем пишем решение, в конце промежутком. Проверка: при x равном нулю модуль единицы один, один меньше четырёх.',
    'Correct. First unfold the absolute value: the inside lies between minus four and four. Then add one to all three parts, then write the solution, and at the end the range. Check: at x equal to zero the absolute value of one is one, and one is less than four.'),
  wrongs: [
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Bir qo'shish MODUL OCHILGANDAN keyin bo'ladi. Modul ichidagi ifodaga to'g'ridan-to'g'ri son qo'shib bo'lmaydi: modul butun ifodani qamrab turadi. Avval uni qo'sh tengsizlikka aylantirish kerak, undan keyingina uchala qismga bir qo'shiladi.",
      'Прибавление единицы идёт ПОСЛЕ раскрытия модуля. К выражению внутри модуля нельзя прибавить число напрямую: модуль охватывает всё выражение. Сначала его надо превратить в двойное неравенство, и только потом прибавлять единицу ко всем трём частям.',
      'Adding one comes AFTER the absolute value is unfolded. A number cannot be added straight to the expression inside: the bars enclose the whole expression. It must first be turned into a double inequality, and only then is one added to all three parts.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Oraliq bilan yozish YECHIM topilgandan keyin bo'ladi: kvadrat qavslar ichiga qo'yiladigan chegaralar hali topilmagan. Avval x minus uch bilan besh orasida degan xulosa chiqadi, keyin u qisqa yozuvga aylantiriladi.",
      'Запись промежутком идёт ПОСЛЕ того, как найдено решение: границы, которые ставят в квадратные скобки, ещё не найдены. Сначала выходит вывод, что x между минус тремя и пятью, потом он превращается в краткую запись.',
      'Writing it as a range comes AFTER the solution is found: the boundaries that go inside the square brackets have not been found yet. First the conclusion that x lies between minus three and five, then it is turned into the short notation.') },
    { when: (s) => s.seq[0] === 'l3' || s.seq[0] === 'l4', text: L(
      "Javobdan boshlab bo'lmaydi — u ishning natijasi. Modulli tengsizlik har doim MODULNI OCHISHDAN boshlanadi: modul turgan holda hech qanday amal bajarib bo'lmaydi.",
      'Начинать с ответа нельзя — он результат работы. Неравенство с модулем всегда начинается с РАСКРЫТИЯ МОДУЛЯ: пока модуль стоит, никакого действия выполнить нельзя.',
      'You cannot start with the answer — it is the result of the work. An inequality with an absolute value always starts by UNFOLDING it: while the bars stand, no operation can be carried out.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Yechim QO'SHISHDAN keyin yoziladi. Qo'sh tengsizlikda o'rtada x minus bir turibdi, x esa yolg'iz emas — uni yolg'iz qoldirish uchun uchala qismga bir qo'shish kerak. Faqat shundan keyin chegaralar minus uch va besh bo'ladi.",
      'Решение записывается ПОСЛЕ прибавления. В двойном неравенстве в середине стоит x минус один, то есть x не один — чтобы его выделить, ко всем трём частям прибавляют единицу. Только после этого границы становятся минус три и пять.',
      'The solution is written AFTER the addition. In the double inequality the middle holds x minus one, so x is not alone — to isolate it, one is added to all three parts. Only then do the boundaries become minus three and five.') },
  ],
  wrongText: L(
    "Modulni ochish birinchi, oraliq yozuvi oxirgi. Qo'sh tengsizlikda amal UCHALA qismga birdan qo'llanadi.",
    'Раскрытие модуля первое, запись промежутком последняя. В двойном неравенстве действие применяется сразу ко ВСЕМ трём частям.',
    'Unfolding the absolute value comes first, the range notation last. In a double inequality an operation applies to ALL three parts at once.'),
};

export default function D29_06(props) { return <SwapOrder data={DATA} {...props} />; }
