// Dars10 · Amaliyot 06 — Ildizi yo'q tenglamalar · 🟡 · tag: mod_no_root
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Modul MANFIY bo'lolmaydi: u masofa. Shuning uchun o'ng tomonda manfiy son
// turgan tenglamaning ildizi yo'q.
//   |x| = −3      ildizi yo'q
//   |x + 1| = −5  ildizi yo'q
//   |2x| = −1     ildizi yo'q
//   |x| = 0       ildiz bor (bitta, x = 0)
//   |x| = 5       ildiz bor (ikkita)
//   |x − 2| = 0   ildiz bor (bitta, x = 2)
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_no_root', level: '🟡', col: 155, itemSize: 22,
  eyebrow: L("Ildizi yo'q", 'Нет корней', 'No roots'),
  setup: L(
    "Modul -- masofa, va masofa manfiy bo'lmaydi. Shu sababli ba'zi modulli tenglamalarning ildizi umuman yo'q.",
    'Модуль — это расстояние, а расстояние не бывает отрицательным. Поэтому у некоторых уравнений с модулем корней нет вовсе.',
    'A modulus is a distance, and a distance is never negative. So some modulus equations have no roots at all.'),
  ask: L("Ildizi YO'Q hamma tenglamani belgilang.", 'Отметь все уравнения, у которых НЕТ корней.', 'Mark every equation with NO roots.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['|x|', '=', '−3'], hit: true },
    { id: 'n1', tokens: ['|x|', '=', '0'], hit: false },
    { id: 'p2', tokens: ['|x', '+', '1|', '=', '−5'], hit: true },
    { id: 'n2', tokens: ['|x|', '=', '5'], hit: false },
    { id: 'p3', tokens: ['|2x|', '=', '−1'], hit: true },
    { id: 'n3', tokens: ['|x', '−', '2|', '=', '0'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Uchtasida o'ng tomon manfiy: hech qanday sonning moduli manfiy bo'lmaydi, shuning uchun ildiz yo'q.",
    'Верно. В трёх правая часть отрицательная: модуль ни одного числа не бывает отрицательным, поэтому корней нет.',
    'Correct. In three the right side is negative: no number has a negative modulus, so there are no roots.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1 || s.extra.indexOf('n3') !== -1, text: L(
      "O'ng tomonda NOL turgan tenglamaning ildizi bor: modul nol bo'lishi mumkin, faqat ildiz bitta bo'ladi.",
      'У уравнения с НУЛЁМ справа корень есть: модуль может быть равен нулю, только корень будет один.',
      'An equation with ZERO on the right does have a root: a modulus can be zero, there is just one root.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "|x| = 5 da o'ng tomon musbat, ya'ni ikki ildiz bor: 5 va −5.",
      'В |x| = 5 правая часть положительная, значит корней два: 5 и −5.',
      'In |x| = 5 the right side is positive, so there are two roots: 5 and −5.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: o'ng tomondagi sonning ISHORASIGA qarang, manfiy bo'lsa ildiz yo'q.",
      'Одно пропустил: смотри на ЗНАК числа справа, если он отрицательный — корней нет.',
      'One is missing: look at the SIGN of the number on the right; if it is negative there are no roots.') },
  ],
  wrongText: L(
    "O'ng tomonga qarang: manfiy son bo'lsa ildiz yo'q, nol bo'lsa bitta, musbat bo'lsa ikkita.",
    'Смотри на правую часть: отрицательное — корней нет, нуль — один, положительное — два.',
    'Look at the right side: negative means no roots, zero means one, positive means two.'),
};

export default function D10_06(props) { return <MarkAll data={DATA} {...props} />; }
