// Dars26 · Amaliyot 05 — Yechim · 🟡 · tag: system_solution
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §8 (26-dars, 5-pozitsiya)
//
// T3 TO'LIQ: har tengsizlik ALOHIDA yechiladi, keyin ikki yechim
// kesishtiriladi. Ikki xato variant — kesishtirishning o'rniga BITTASINI
// olish (З55): x birdan katta yoki x to'rtdan kichik. Har biri o'zicha
// to'g'ri yechim, lekin sistemaning javobi emas.
//
// To'rtinchi variant — «yechim yo'q»: bu yerda u yolg'on, chunki nurlar
// bir-birini kesib o'tadi. 03-topshiriqda esa u ROST edi.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'system_solution', level: '🟡',
  correct: 0, optCols: 2, optSize: 18,
  expr: ['x − 1 > 0,   x + 2 < 6'], exprSize: 24,
  eyebrow: L('Yechim', 'Решение', 'Solution'),
  setup: L(
    "Sistemani yechish uchun avval har tengsizlikni alohida yechish kerak, keyin ikki yechimni to'g'ri chiziqda kesishtirish.",
    'Чтобы решить систему, надо сначала решить каждое неравенство по отдельности, а потом пересечь два решения на числовой прямой.',
    'To solve the system, first solve each inequality separately, then intersect the two solutions on the number line.'),
  ask: L(
    'Sistemaning yechimi qaysi?',
    'Каково решение системы?',
    'What is the solution of the system?'),
  opts: [
    { label: ['1 < x < 4'] },
    { label: ['x > 1'] },
    { label: ['x < 4'] },
    { label: L("yechim yo'q", 'решений нет', 'no solutions') },
  ],
  correctText: L(
    "To'g'ri. Birinchisidan x birdan katta, ikkinchisidan x to'rtdan kichik. Ikki yechim bir va to'rt orasida ustma-ust tushadi — javob qo'sh tengsizlik. Beshni tekshiring: birinchi shart bajariladi, ikkinchisi esa yo'q.",
    'Верно. Из первого x больше одного, из второго x меньше четырёх. Два решения накладываются между одним и четырьмя — ответ двойное неравенство. Проверь пять: первое условие выполняется, а второе нет.',
    'Correct. The first gives x greater than one, the second x less than four. The two solutions overlap between one and four — the answer is a double inequality. Check five: the first condition holds, the second does not.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu — faqat BIRINCHI tengsizlikning yechimi. Ikkinchisi tekshirilmagan: x birdan katta bo'lgan sonlar orasida beshi ham, o'ni ham bor, lekin ular x qo'shuv ikki oltidan kichik degan shartni buzadi. Sistemada ikkala shart ham bajarilishi kerak, ya'ni javob ikki yechimning KESISHMASI bo'ladi.",
      'Это решение только ПЕРВОГО неравенства. Второе не проверено: среди чисел, больших одного, есть и пять, и десять, но они нарушают условие x плюс два меньше шести. В системе должны выполняться оба условия, значит ответ — ПЕРЕСЕЧЕНИЕ двух решений.',
      'This is the solution of the FIRST inequality only. The second was not checked: among the numbers greater than one there are five and ten, and they break the condition x plus two less than six. A system requires both conditions, so the answer is the INTERSECTION of the two solutions.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu — faqat IKKINCHI tengsizlikning yechimi. Birinchisi tekshirilmagan: to'rtdan kichik sonlar orasida nol ham, minus besh ham bor, lekin ular x minus bir noldan katta degan shartni buzadi. Ikki yechimni birlashtirmasdan, KESISHTIRISH kerak.",
      'Это решение только ВТОРОГО неравенства. Первое не проверено: среди чисел, меньших четырёх, есть и нуль, и минус пять, но они нарушают условие x минус один больше нуля. Два решения надо не объединять, а ПЕРЕСЕКАТЬ.',
      'This is the solution of the SECOND inequality only. The first was not checked: among the numbers less than four there are zero and minus five, and they break the condition x minus one greater than zero. The two solutions must be intersected, not united.') },
    { when: (s) => s.picked === 3, text: L(
      "Yechim bor. Ikki nur qarama-qarshi tomonga qaragan bo'lsa ham, ular bir-birini KESIB o'tadi: birdan o'ngdagi joy va to'rtdan chapdagi joy bir bilan to'rt orasida ustma-ust tushadi. Ikkini qo'yib tekshiring: ikkala shart ham bajariladi. Yechim yo'q bo'ladigan hol — nurlar umuman uchrashmagan hol, masalan x beshdan katta va x ikkidan kichik.",
      'Решение есть. Хотя два луча смотрят в разные стороны, они ПЕРЕСЕКАЮТСЯ: область правее одного и область левее четырёх накладываются между одним и четырьмя. Подставь два и проверь: оба условия выполняются. Решений нет тогда, когда лучи вовсе не встречаются, например x больше пяти и x меньше двух.',
      'There is a solution. Although the two rays point in opposite directions, they DO overlap: the region right of one and the region left of four coincide between one and four. Substitute two and check: both conditions hold. There are no solutions when the rays never meet, for instance x greater than five and x less than two.') },
  ],
  wrongText: L(
    "Har tengsizlikni alohida yeching, keyin ikki yechimni to'g'ri chiziqda kesishtiring. Faqat bittasini olish sistemani yechish emas.",
    'Реши каждое неравенство по отдельности, потом пересеки два решения на числовой прямой. Взять только одно — это не решить систему.',
    'Solve each inequality separately, then intersect the two solutions on the number line. Taking only one of them is not solving the system.'),
};

export default function D26_05(props) { return <Choice data={DATA} {...props} />; }
