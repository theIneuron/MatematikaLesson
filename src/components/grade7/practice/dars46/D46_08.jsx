// Dars46 · Amaliyot 08 — Chegaradagi holat · 🔴 · fix · tag: ineq_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 8-o'rin.
// 2, 3, 5: 2 + 3 = 5, ya'ni TENG. Tengsizlik qat'iy bo'lishi kerak, shuning
// uchun bunday uchburchak yo'q.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'ineq_fix', level: '🔴',
  eyebrow: L('Chegaradagi holat', 'Граничный случай', 'The boundary case'),
  setup: L(
    "Uch xulosadan biri noto'g'ri. Diqqat: yig'indi uchinchi tomonga TENG bo'lsa ham uchburchak chiqmaydi -- tomonlar bir chiziqqa tushadi.",
    'Один из трёх выводов неверный. Внимание: если сумма РАВНА третьей стороне, треугольника тоже нет — стороны ложатся на одну прямую.',
    'One of the three conclusions is wrong. Note: if the sum EQUALS the third side there is still no triangle — the sides fall in a line.'),
  ask: L("NOTO'G'RI xulosani belgilang.", 'Отметь НЕВЕРНЫЙ вывод.', 'Mark the WRONG conclusion.'),
  note: L('Bitta xulosa.', 'Один вывод.', 'One conclusion.'),
  parts: [
    { k: 'term', id: 't1', v: '3, 4, 6 -- bor' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '2, 3, 5 -- bor' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: "1, 2, 9 -- yo'q" },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 2 + 3 = 5, ya'ni uchinchi tomonga aynan teng. Tengsizlik QAT'IY bo'lishi kerak, shuning uchun uchburchak yo'q.",
    'Верно. 2 + 3 = 5, ровно равно третьей стороне. Неравенство должно быть СТРОГИМ, поэтому треугольника нет.',
    'Correct. 2 + 3 = 5 exactly equals the third side. The inequality must be STRICT, so no triangle.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "3 + 4 = 7 > 6: shart bajarildi, uchburchak bor.",
      '3 + 4 = 7 > 6: условие выполнено, треугольник существует.',
      '3 + 4 = 7 > 6: the condition holds, the triangle exists.') },
    { when: (s) => s.extra.indexOf('t3') !== -1, text: L(
      "1 + 2 = 3 < 9: to'g'ri, bunday uchburchak yo'q.",
      '1 + 2 = 3 < 9: верно, такого треугольника нет.',
      '1 + 2 = 3 < 9: right, no such triangle.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Yig'indi uchinchi tomonga TENG bo'lgan holatni toping: u ham uchburchak bermaydi.",
      'Найди случай, где сумма РАВНА третьей стороне: он тоже не даёт треугольника.',
      'Find the case where the sum EQUALS the third side: that gives no triangle either.') },
  ],
  wrongText: L(
    "Har to'plamda ikki kichik tomonni qo'shib, eng katta bilan solishtiring. Tenglik holatiga alohida qarang.",
    'В каждом наборе сложи две меньшие и сравни с наибольшей. Отдельно посмотри случай равенства.',
    'Add the two shorter sides in each set and compare. Watch the equality case.'),
};

export default function D46_08(props) { return <TapTerms data={DATA} {...props} />; }
