// Dars31 · Amaliyot 02 — To'liqsiz kvadrat · 🟢 · choice · tag: incomplete_square
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// a³ − 8 = (a − 2)(a² + 2a + 4). Ayirma uchun to'liqsiz kvadratda PLYUS.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'incomplete_square', level: '🟢', optCols: 3,
  eyebrow: L("To'liqsiz kvadrat", 'Неполный квадрат', 'The incomplete square'),
  setup: L(
    "Kublar ayirmasi (a − 2) ga ajraldi. Ikkinchi ko'paytuvchi to'liqsiz kvadrat: o'rta hadda ikki karra yo'q, ishorasi esa qavsga teskari.",
    'Разность кубов разложилась на (a − 2). Второй множитель это неполный квадрат: удвоения нет, а знак противоположен скобке.',
    'The difference of cubes gave (a − 2). The second factor is an incomplete square: no doubling, and the sign is opposite.'),
  expr: ['a³', '−', '8', '=', '(a', '−', '2)', '·', '?'], exprSize: 26,
  ask: L('Ikkinchi ko\'paytuvchi qanday?', 'Каков второй множитель?', 'What is the second factor?'),
  opts: [{ label: ['a²', '+', '2a', '+', '4'] }, { label: ['a²', '−', '2a', '+', '4'] }, { label: ['a²', '+', '4a', '+', '4'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. Ayirma uchun to'liqsiz kvadratda PLYUS: a² + 2a + 4. Oxirgi had 2² = 4.",
    'Верно. Для разности в неполном квадрате ПЛЮС: a² + 2a + 4. Последний член 2² = 4.',
    'Correct. For a difference the incomplete square takes a PLUS: a² + 2a + 4. The last term is 2² = 4.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Minus emas: birinchi qavsda minus turgan, ya'ni to'liqsiz kvadratda plyus bo'ladi. Ishoralar qarama-qarshi.",
      'Не минус: в первой скобке минус, значит в неполном квадрате плюс. Знаки противоположны.',
      'Not a minus: the first bracket has a minus, so the incomplete square takes a plus. The signs are opposite.') },
    { when: (s) => s.picked === 2, text: L(
      "4a bu ikki karra ko'paytma, ya'ni TO'LIQ kvadrat. To'liqsizda ikki karra bo'lmaydi: 2a.",
      '4a это двойное произведение, то есть ПОЛНЫЙ квадрат. В неполном удвоения нет: 2a.',
      '4a is twice the product — a FULL square. The incomplete one has no doubling: 2a.') },
  ],
  wrongText: L(
    "To'liqsiz kvadratda uch had: birinchisining kvadrati, ko'paytma (ikki karrasiz), ikkinchisining kvadrati.",
    'В неполном квадрате три члена: квадрат первого, произведение без удвоения, квадрат второго.',
    'The incomplete square has three terms: the first squared, the product without doubling, the second squared.'),
};

export default function D31_02(props) { return <Choice data={DATA} {...props} />; }
