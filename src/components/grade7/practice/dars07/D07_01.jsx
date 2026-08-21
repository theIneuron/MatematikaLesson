// Dars07 · Amaliyot 01 — Qaysi son ildiz · 🟢 · tag: which_is_root
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// 3x − 7 = 8. Ildiz -- tenglamani TO'G'RI tenglikka aylantiradigan son.
//   x = 5:  3 · 5 − 7 = 8   to'g'ri
//   x = 3:  3 · 3 − 7 = 2   noto'g'ri
//   x = 15: 3 · 15 − 7 = 38 noto'g'ri (15 bu 8 + 7, ya'ni ko'paytirishni
//           hisobga olmagan)
// Ildizni topish emas, TEKSHIRISH so'raladi: shu darsning asosiy ko'nikmasi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_is_root', level: '🟢', optCols: 3,
  eyebrow: L('Tenglama ildizi', 'Корень уравнения', 'The root of an equation'),
  setup: L(
    "Ildiz -- shunday son, uni noma'lum o'rniga qo'yganda tenglama to'g'ri tenglikka aylanadi. Tekshirish uchun qo'yib hisoblash kifoya.",
    'Корень — такое число, при подстановке которого уравнение становится верным равенством. Чтобы проверить, достаточно подставить и посчитать.',
    'A root is a number that turns the equation into a true equality. To check it, substitute and work it out.'),
  expr: ['3x', '−', '7', '=', '8'], exprSize: 32,
  ask: L('Qaysi son bu tenglamaning ildizi?', 'Какое число является корнем этого уравнения?', 'Which number is the root of this equation?'),
  opts: [{ label: ['5'] }, { label: ['3'] }, { label: ['15'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. x = 5 bo'lsa: 3 · 5 − 7 = 15 − 7 = 8. Chap tomon o'ng tomonga teng, ya'ni tenglik to'g'ri.",
    'Верно. При x = 5: 3 · 5 − 7 = 15 − 7 = 8. Левая часть равна правой, значит равенство верное.',
    'Correct. With x = 5: 3 · 5 − 7 = 15 − 7 = 8. The left side equals the right side, so the equality holds.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "x = 3 bo'lsa: 3 · 3 − 7 = 2, o'ng tomonda esa 8. Tenglik chiqmadi.",
      'При x = 3: 3 · 3 − 7 = 2, а справа 8. Равенство не получилось.',
      'With x = 3: 3 · 3 − 7 = 2, but the right side is 8. No equality.') },
    { when: (s) => s.picked === 2, text: L(
      "15 bu 8 + 7, lekin x uch marta olinadi: 3 · 15 − 7 = 38. Ko'paytirish hisobga olinmagan.",
      '15 это 8 + 7, но x берётся трижды: 3 · 15 − 7 = 38. Умножение не учтено.',
      '15 is 8 + 7, but x is taken three times: 3 · 15 − 7 = 38. The multiplication was left out.') },
  ],
  wrongText: L(
    "Har sonni x o'rniga qo'yib chap tomonni hisoblang va 8 bilan solishtiring.",
    'Подставь каждое число вместо x, посчитай левую часть и сравни с 8.',
    'Put each number in place of x, work out the left side and compare with 8.'),
};

export default function D07_01(props) { return <Choice data={DATA} {...props} />; }
