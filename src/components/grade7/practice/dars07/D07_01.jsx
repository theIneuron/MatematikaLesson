// Dars07 · Amaliyot 01 — Qaysi son ildiz · 🟢 · tag: which_is_root
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): koeffitsiyent va sonlar uch
// xonali, tekshirish esa og'zaki: 12 · 80 = 960.
//
// 12x − 70 = 890. Ildiz -- tenglamani TO'G'RI tenglikka aylantiradigan son.
//   x = 80:  12 · 80 − 70 = 890    to'g'ri
//   x = 60:  12 · 60 − 70 = 650    noto'g'ri
//   x = 960: 12 · 960 − 70 = 11450 noto'g'ri (960 bu 890 + 70, ya'ni
//            ko'paytirishni hisobga olmagan)
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
  expr: ['12x', '−', '70', '=', '890'], exprSize: 30,
  ask: L('Qaysi son bu tenglamaning ildizi?', 'Какое число является корнем этого уравнения?', 'Which number is the root of this equation?'),
  opts: [{ label: ['80'] }, { label: ['60'] }, { label: ['960'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. x = 80 bo'lsa: 12 · 80 − 70 = 960 − 70 = 890. Chap tomon o'ng tomonga teng, ya'ni tenglik to'g'ri.",
    'Верно. При x = 80: 12 · 80 − 70 = 960 − 70 = 890. Левая часть равна правой, значит равенство верное.',
    'Correct. With x = 80: 12 · 80 − 70 = 960 − 70 = 890. The left side equals the right side, so the equality holds.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "x = 60 bo'lsa: 12 · 60 − 70 = 650, o'ng tomonda esa 890. Tenglik chiqmadi.",
      'При x = 60: 12 · 60 − 70 = 650, а справа 890. Равенство не получилось.',
      'With x = 60: 12 · 60 − 70 = 650, but the right side is 890. No equality.') },
    { when: (s) => s.picked === 2, text: L(
      "960 bu 890 + 70, lekin x o'n ikki marta olinadi: 12 · 960 − 70 = 11450. Ko'paytirish hisobga olinmagan.",
      '960 это 890 + 70, но x берётся двенадцать раз: 12 · 960 − 70 = 11450. Умножение не учтено.',
      '960 is 890 + 70, but x is taken twelve times: 12 · 960 − 70 = 11450. The multiplication was left out.') },
  ],
  wrongText: L(
    "Har sonni x o'rniga qo'yib chap tomonni hisoblang va 890 bilan solishtiring.",
    'Подставь каждое число вместо x, посчитай левую часть и сравни с 890.',
    'Put each number in place of x, work out the left side and compare with 890.'),
};

export default function D07_01(props) { return <Choice data={DATA} {...props} />; }
