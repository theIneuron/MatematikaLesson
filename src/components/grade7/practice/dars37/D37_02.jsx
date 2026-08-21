// Dars37 · Amaliyot 02 — Qaysi biri proporsionallik · 🟢 · choice · tag: which_prop
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// y = 7x -- to'g'ri proporsionallik. y = 7x + 1 da ozod had bor,
// y = 7 : x da esa x bo'luvchi -- ikkovi ham proporsionallik emas.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_prop', level: '🟢', optCols: 3,
  eyebrow: L('Qaysi biri', 'Какая из них', 'Which one'),
  setup: L(
    "To'g'ri proporsionallik y = kx ko'rinishida bo'ladi: ozod had yo'q va x bo'luvchida turmaydi.",
    'Прямая пропорциональность имеет вид y = kx: свободного члена нет и x не стоит в делителе.',
    'Direct proportion looks like y = kx: no free term and x is not a divisor.'),
  ask: L("Qaysi formula to'g'ri proporsionallik?", 'Какая формула это прямая пропорциональность?', 'Which rule is a direct proportion?'),
  opts: [{ label: ['y', '=', '7x'] }, { label: ['y', '=', '7x', '+', '1'] }, { label: ['y', '=', '7', ':', 'x'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. y = 7x da faqat k bor, ozod had yo'q: grafik koordinatalar boshidan o'tadi.",
    'Верно. В y = 7x есть только k, свободного члена нет: график проходит через начало координат.',
    'Correct. y = 7x has only k and no free term: the graph passes through the origin.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "y = 7x + 1 chiziqli, lekin proporsionallik emas: ozod had bor, ya'ni grafik boshdan o'tmaydi.",
      'y = 7x + 1 линейная, но не пропорциональность: есть свободный член, значит график не проходит через начало.',
      'y = 7x + 1 is linear but not a proportion: the free term shifts it off the origin.') },
    { when: (s) => s.picked === 2, text: L(
      "y = 7 : x da x bo'luvchida turibdi: x oshsa y KAMAYADI. Bu boshqa bog'lanish.",
      'В y = 7 : x икс стоит в делителе: с ростом x значение y УБЫВАЕТ. Это другая зависимость.',
      'In y = 7 : x the x is a divisor: as x grows y FALLS. A different relationship.') },
  ],
  wrongText: L(
    "Ozod had bormi? x bo'luvchida turadimi? Ikki savol formulani ajratadi.",
    'Есть ли свободный член? Стоит ли x в делителе? Два вопроса всё различают.',
    'Is there a free term? Is x a divisor? Those two questions decide.'),
};

export default function D37_02(props) { return <Choice data={DATA} {...props} />; }
