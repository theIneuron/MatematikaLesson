// Dars29 · Amaliyot 04 — Juftlash · 🟡 · tag: abs_to_set
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §11 (29-dars, 4-pozitsiya)
//
// TO'RT YOZUVDA O'SHA UCHLIK, farq esa faqat BELGIDA, va natijalar to'rt
// xil turda:
//   |x| = 3   -> ikki son          (T2)
//   |x| ≤ 3   -> kesma             (T3)
//   |x| ≥ 3   -> ikki nur          (T3, З59 aynan shu yerda)
//   |x| = −3  -> yechim yo'q       (modul manfiy bo'lmaydi)
//
// Ikkinchi va uchinchi juftlik bir-birining teskarisi: biri nolga YAQIN
// sonlarni oladi, ikkinchisi noldan UZOQ sonlarni.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'abs_to_set', level: '🟡',
  connect: true,
  targetSize: 17, itemSize: 13,
  items: [
    { id: 'm1', tokens: ['3', ';', '−3'] },
    { id: 'm2', tokens: ['−3 ≤ x ≤ 3'] },
    { id: 'm3', tokens: ['x ≤ −3', ';', 'x ≥ 3'] },
    { id: 'm4', label: L("yechim yo'q", 'решений нет', 'no solutions') },
  ],
  targets: [
    { id: 't1', tokens: ['|x| = 3'] },
    { id: 't2', tokens: ['|x| ≤ 3'] },
    { id: 't3', tokens: ['|x| ≥ 3'] },
    { id: 't4', tokens: ['|x| = −3'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt yozuvda o'sha uch soni turibdi, farq esa faqat belgida. Har birini son o'qida tasavvur qiling: modul noldan uzoqlikni bildiradi.",
    'В четырёх записях стоит одна и та же тройка, а различие только в знаке. Представь каждую на числовой прямой: модуль означает удалённость от нуля.',
    'The four records hold the same three and differ only in the sign. Picture each on the number line: the absolute value means distance from zero.'),
  ask: L(
    "Chapdan javobni bosing, keyin o'ngdan uning yozuvini bosing.",
    'Нажми ответ слева, потом его запись справа.',
    'Tap an answer on the left, then its record on the right.'),
  correctText: L(
    "To'g'ri. Tenglik noldan aynan uch birlik uzoqlikdagi ikki nuqtani beradi. «Kichik yoki teng» nolga YAQIN sonlarni oladi — kesma; «katta yoki teng» esa UZOQ sonlarni — ikki nur. Manfiy o'ng tomonda esa yechim yo'q.",
    'Верно. Равенство даёт две точки ровно в трёх единицах от нуля. «Меньше или равно» берёт числа БЛИЖЕ к нулю — отрезок; «больше или равно» — ДАЛЬШЕ, то есть два луча. А при отрицательном справа решений нет.',
    'Correct. The equality gives the two points exactly three units from zero. «Less than or equal» takes the numbers NEARER zero — a segment; «greater than or equal» the ones FURTHER — two rays. With a negative on the right there are no solutions.'),
  wrongs: [
    { when: (s) => s.pair.m2 === 't3' || s.pair.m3 === 't2', text: L(
      "Bu ikki yozuv bir-birining TESKARISI. «Modul kichik yoki teng» degani nolga YAQIN turish, ya'ni javob kesma: minus uchdan uchgacha. «Modul katta yoki teng» degani noldan UZOQ turish, ya'ni javob ikki nur — kesmaning tashqarisi. Sonda tekshiring: nolning moduli nol, u uchdan kichik, ya'ni nol birinchi yozuvning yechimi va ikkinchisiniki emas.",
      'Эти две записи ОБРАТНЫ друг другу. «Модуль меньше или равен» значит стоять БЛИЖЕ к нулю, то есть ответ — отрезок от минус трёх до трёх. «Модуль больше или равен» значит стоять ДАЛЬШЕ от нуля, то есть ответ — два луча, всё вне отрезка. Проверь числом: модуль нуля нуль, он меньше трёх, значит нуль решение первой записи, а не второй.',
      'These two records are OPPOSITES. «Absolute value less than or equal» means standing CLOSER to zero, so the answer is the segment from minus three to three. «Greater than or equal» means standing FURTHER from zero, so the answer is two rays, everything outside the segment. Check with a number: the absolute value of zero is zero, which is less than three, so zero solves the first record and not the second.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "«Yechim yo'q» javobi o'ng tomonda MANFIY son turgan yozuvga tegishli. Modul — noldan uzoqlik, uzoqlik esa manfiy bo'lmaydi: qanday x olmang, uning moduli noldan kichik chiqmaydi. Qolgan uch yozuvda o'ng tomon musbat, ya'ni ularning yechimi bor.",
      'Ответ «решений нет» относится к записи, где справа стоит ОТРИЦАТЕЛЬНОЕ число. Модуль — это удалённость от нуля, а удалённость отрицательной не бывает: какой x ни возьми, его модуль меньше нуля не выйдет. В трёх остальных записях справа положительное число, значит решения у них есть.',
      'The answer «no solutions» belongs to the record with a NEGATIVE number on the right. The absolute value is a distance from zero, and a distance is never negative: whichever x you take, its absolute value never comes out below zero. The other three records have a positive number on the right, so they do have solutions.') },
    { when: (s) => s.pair.m1 !== 't1', text: L(
      "Ikki sondan iborat javob TENGLIKKA tegishli: modul aynan uchga teng bo'lsa, noldan aynan uch birlik uzoqlikdagi ikki nuqta chiqadi. Tengsizlik esa nuqtalarni emas, butun to'plamni beradi: kesma yoki ikki nur.",
      'Ответ из двух чисел относится к РАВЕНСТВУ: если модуль равен ровно трём, выходят две точки, стоящие ровно в трёх единицах от нуля. А неравенство даёт не точки, а целое множество: отрезок или два луча.',
      'The answer made of two numbers belongs to the EQUALITY: if the absolute value is exactly three, the two points exactly three units from zero come out. An inequality gives not points but a whole set: a segment or two rays.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvda ikki savol bering: bu tenglikmi yoki tengsizlik, va o'ng tomondagi son musbatmi. Tenglik nuqtalarni beradi, tengsizlik to'plamni; manfiy son esa yechimni umuman yo'qotadi.",
      'В каждой записи задай два вопроса: это равенство или неравенство, и положительно ли число справа. Равенство даёт точки, неравенство — множество; а отрицательное число решений не оставляет вовсе.',
      'Ask two questions of every record: is it an equality or an inequality, and is the number on the right positive. An equality gives points, an inequality a set; and a negative number leaves no solutions at all.') },
  ],
  wrongText: L(
    "Har yozuvni son o'qida tasavvur qiling: modul noldan uzoqlik. «Kichik» nolga yaqin sonlarni, «katta» esa uzoq sonlarni oladi. O'ng tomonda manfiy son tursa, yechim yo'q.",
    'Представляй каждую запись на числовой прямой: модуль — удалённость от нуля. «Меньше» берёт числа ближе к нулю, «больше» — дальше. Если справа отрицательное число, решений нет.',
    'Picture every record on the number line: the absolute value is distance from zero. «Less» takes the numbers nearer zero, «greater» the ones further away. If the right side is negative, there are no solutions.'),
};

export default function D29_04(props) { return <MatchPairs data={DATA} {...props} />; }
