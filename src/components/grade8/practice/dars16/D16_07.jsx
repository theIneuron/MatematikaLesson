// Dars16 · Amaliyot 07 — Nechta · 🟡 · tag: count_of_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4 (16-dars, 7-pozitsiya)
//
// UCH YOZUV BIR-BIRIGA O'XSHAB TURADI, farqi faqat ishora va o'ng tomonda.
// Ular darsning uch holini beradi:
//   p² = 9   — ikki ildiz (З40: faqat uchni yozib qo'yish oson);
//   4p² = 0  — bitta ildiz, nol;
//   p² = −9  — ildiz yo'q (З41).
// Kartalar qisqa: yozuv ham, javob ham kvadrat kartaga sig'adi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'count_of_roots', level: '🟡',
  faceSize: 14,
  cards: [
    { id: 'f1', side: 0, v: 'p² = 9' },
    { id: 'f2', side: 0, v: '4p² = 0' },
    { id: 'f3', side: 0, v: 'p² = −9' },
    { id: 'v1', side: 1, v: 'ikkita' },
    { id: 'v2', side: 1, v: 'bitta' },
    { id: 'v3', side: 1, v: "yo'q" },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Nechta', 'Сколько', 'How many'),
  setup: L(
    "Uch yozuv bir-biriga o'xshaydi, lekin ildizlarining soni har xil: ikkita, bitta va umuman yo'q. Farqni ishora va o'ng tomondagi son beradi.",
    'Три записи похожи друг на друга, но число корней разное: два, один и ни одного. Разницу дают знак и число справа.',
    'The three records look alike, but their root counts differ: two, one and none. The sign and the number on the right make the difference.'),
  ask: L(
    "Yozuvni bosing, keyin uyani bosing. Har yozuv o'z javobi bilan juftlanadi.",
    'Нажми запись, потом ячейку. Каждая запись встаёт в пару со своим ответом.',
    'Tap a record, then a slot. Each record pairs with its own answer.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Kvadrati to'qqizga teng ikki son bor: uch va minus uch — demak ikki ildiz. Ikkinchisida to'rt p kvadrat nolga teng, ya'ni p kvadrat nolga teng, va kvadrati nol bo'lgan yolg'iz son — nol; bitta ildiz. Uchinchisida esa p kvadrat manfiy songa teng bo'lishi kerak, bu esa mumkin emas: har qanday sonning kvadrati nomanfiy — ildiz yo'q.",
    'Верно. Чисел, чей квадрат равен девяти, два: три и минус три — значит два корня. Во втором четыре p квадрат равно нулю, то есть p квадрат нуль, а число с нулевым квадратом одно — нуль; один корень. В третьем p квадрат должен равняться отрицательному числу, а это невозможно: квадрат любого числа неотрицателен — корней нет.',
    'Correct. There are two numbers whose square is nine: three and minus three — so two roots. In the second, four p squared is zero, so p squared is zero, and only one number squares to zero — zero itself; one root. In the third, p squared would have to equal a negative number, which is impossible: any square is non-negative — no roots.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Bu ikki yozuv o'rin almashdi. Kvadrati to'qqizga teng sonni izlang: uch ham, minus uch ham yaraydi, chunki minus karra minus arti beradi — ikki ildiz. Nolda esa boshqacha: kvadrati nolga teng yolg'iz son bor, va u nolning o'zi.",
      'Эти две записи поменялись местами. Поищи число, чей квадрат равен девяти: годятся и три, и минус три, ведь минус на минус даёт плюс — два корня. А в нуле иначе: число с нулевым квадратом единственное, и это сам нуль.',
      'These two records swapped places. Look for a number whose square is nine: both three and minus three work, since minus times minus gives plus — two roots. Zero is different: only one number squares to zero, zero itself.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi yozuvda o'ng tomon MANFIY. Har qanday sonni kvadratga oshirsangiz nomanfiy son chiqadi: uchning kvadrati to'qqiz, minus uchning kvadrati ham to'qqiz. Demak p kvadrat minus to'qqizga teng bo'ladigan p yo'q. Bu «nol ildiz» degani ham emas — ildiz umuman yo'q.",
      'В третьей записи справа стоит ОТРИЦАТЕЛЬНОЕ число. Квадрат любого числа неотрицателен: три в квадрате девять, минус три в квадрате тоже девять. Значит p, при котором p квадрат равно минус девяти, не существует. Это не «корень нуль» — корней нет вовсе.',
      'In the third record the right side is NEGATIVE. Any number squared is non-negative: three squared is nine, minus three squared is nine as well. So no p makes p squared equal minus nine. This is not «the root is zero» — there are no roots at all.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi yozuvda o'ng tomon NOL. To'rtga bo'lsangiz p kvadrat nolga teng bo'ladi, va nolga teng kvadratni faqat nol beradi. Ikki ildiz bo'lishi uchun o'ng tomon musbat bo'lishi kerak edi.",
      'Во второй записи справа НУЛЬ. Раздели на четыре — выйдет p квадрат равно нулю, а нулевой квадрат даёт только нуль. Для двух корней справа должно было стоять положительное число.',
      'In the second record the right side is ZERO. Divide by four and p squared equals zero, and only zero squares to zero. For two roots the right side would have to be positive.') },
  ],
  wrongText: L(
    "Har yozuvda o'ng tomonga qarang: musbat son — ikki ildiz, nol — bitta ildiz, manfiy son — ildiz yo'q. Sabab bitta: kvadrat manfiy bo'lmaydi.",
    'В каждой записи смотри на правую часть: положительное число — два корня, нуль — один, отрицательное — корней нет. Причина одна: квадрат не бывает отрицательным.',
    'Look at the right side of each record: a positive number means two roots, zero means one, a negative number means none. One reason: a square is never negative.'),
};

export default function D16_07(props) { return <PairSlots data={DATA} {...props} />; }
