// Dars29 · Amaliyot 10 — Pazl · 🔴 · tag: abs_to_answer
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §11 (29-dars, 10-pozitsiya)
//
// UCH YOZUVDA O'SHA TO'RTLIK VA NOL, javoblar esa uch xil TURDA:
//   |x| = 4  -> ikki son     ±4        (T2)
//   |x| ≤ 4  -> kesma        [−4; 4]   (T3, 27-darsning yozuvi)
//   |x| = 0  -> bitta son    0         (chegara holi)
//
// Uchinchi juftlik 09-topshiriqning davomi: moduli nolga teng bo'lgan
// yagona son — nolning o'zi, ya'ni bu yerda plyus-minus YO'Q.
// Kartalarda yozuv bo'shliqsiz (skelet §0a.3).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'abs_to_answer', level: '🔴',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['|x|=4'] },
    { id: 'f2', side: 0, tokens: ['|x|≤4'] },
    { id: 'f3', side: 0, tokens: ['|x|=0'] },
    { id: 'v1', side: 1, v: '±4' },
    { id: 'v2', side: 1, v: '[−4;4]' },
    { id: 'v3', side: 1, v: '0' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuvda o'sha to'rt soni turibdi, farq esa belgida. Javoblar uch xil turda bo'ladi: ikki son, oraliq va bitta son.",
    'В трёх записях стоит одна и та же четвёрка, а различие в знаке. Ответы будут трёх разных видов: два числа, промежуток и одно число.',
    'The three records hold the same four and differ in the sign. The answers come in three different kinds: two numbers, a range and a single number.'),
  ask: L(
    'Yozuvni bosing, keyin uyani bosing.',
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Tenglik ikki nuqtani beradi, tengsizlik esa kesmani — chegaralari bilan, chunki belgi ostida chiziq bor. Uchinchisi chegara holi: modul faqat nolda nolga teng, ya'ni javob BITTA son va plyus-minus yo'q.",
    'Верно. Равенство даёт две точки, а неравенство — отрезок вместе с границами, ведь под знаком черта. Третья запись — граничный случай: модуль равен нулю только при нуле, значит ответ ОДНО число и плюс-минуса нет.',
    'Correct. The equality gives two points, the inequality a segment with its boundaries, since the sign carries a line. The third is the boundary case: an absolute value is zero only at zero, so the answer is ONE number with no plus-or-minus.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi yozuvda o'ng tomonda NOL turibdi, va bu alohida hol. Modul noldan uzoqlik, uzoqlik esa faqat bitta joyda nolga aylanadi — nolning o'zida. Shuning uchun bu tenglamaning yagona ildizi bor: nol. Plyus-minus bu yerda ishlamaydi, chunki plyus nol bilan minus nol bir xil son.",
      'В третьей записи справа стоит НУЛЬ, и это особый случай. Модуль — удалённость от нуля, а удалённость обращается в нуль лишь в одном месте — в самом нуле. Поэтому у этого уравнения единственный корень: нуль. Плюс-минус здесь не работает, ведь плюс нуль и минус нуль — одно и то же число.',
      'The third record has ZERO on the right, and that is a special case. The absolute value is a distance from zero, and a distance vanishes at exactly one place — zero itself. So this equation has a single root: zero. Plus-or-minus does not apply here, since plus zero and minus zero are the same number.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi yozuvda TENGSIZLIK turibdi, ya'ni javob bitta yoki ikkita son emas, butun TO'PLAM bo'ladi. Modul to'rtdan kichik yoki teng degani, x noldan to'rt birlikdan uzoq turmaydi — bu minus to'rtdan to'rtgacha bo'lgan kesma. Belgi ostida chiziq bor, demak chegaralar ham kiradi va qavslar kvadrat.",
      'Во второй записи стоит НЕРАВЕНСТВО, значит ответ — не одно и не два числа, а целое МНОЖЕСТВО. Модуль меньше или равен четырём значит, что x не отстоит от нуля дальше четырёх единиц — это отрезок от минус четырёх до четырёх. Под знаком черта, значит границы входят и скобки квадратные.',
      'The second record holds an INEQUALITY, so the answer is not one or two numbers but a whole SET. Absolute value less than or equal to four means x stands no further than four units from zero — the segment from minus four to four. The sign carries a line, so the boundaries are included and the brackets are square.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi yozuvda TENGLIK va o'ng tomonda musbat son turibdi — bunday tenglamaning aynan ikkita ildizi bor. Son o'qida noldan to'rt birlik uzoqlikda ikki nuqta bor: biri o'ngda, biri chapda. Javob plyus-minus to'rt.",
      'В первой записи стоит РАВЕНСТВО и справа положительное число — у такого уравнения ровно два корня. На числовой прямой в четырёх единицах от нуля стоят две точки: одна справа, другая слева. Ответ плюс-минус четыре.',
      'The first record holds an EQUALITY with a positive number on the right — such an equation has exactly two roots. On the number line there are two points four units from zero: one on the right, one on the left. The answer is plus or minus four.') },
  ],
  wrongText: L(
    "Har yozuvda ikki savol bering: bu tenglikmi yoki tengsizlik, va o'ng tomonda qanday son turibdi. Tenglik nuqta beradi, tengsizlik to'plam; nol esa yagona ildiz beradi.",
    'В каждой записи задай два вопроса: это равенство или неравенство, и какое число стоит справа. Равенство даёт точки, неравенство — множество; а нуль даёт единственный корень.',
    'Ask two questions of every record: is it an equality or an inequality, and what number stands on the right. An equality gives points, an inequality a set; and zero gives a single root.'),
};

export default function D29_10(props) { return <PairSlots data={DATA} {...props} />; }
