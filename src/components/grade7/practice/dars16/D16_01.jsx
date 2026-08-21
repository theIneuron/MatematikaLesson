// Dars16 · Amaliyot 01 — Nima bilan nima qilinadi · 🟢 · tag: mul_rule
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// 4x² · 25x³ = 100x⁵. Koeffitsiyentlar KO'PAYTIRILADI (4 · 25 = 100),
// bir xil harfning ko'rsatkichlari QO'SHILADI (2 + 3 = 5).
// Xato variantlar: 100x⁶ (ko'rsatkichlarni ko'paytirgan), 29x⁵
// (koeffitsiyentlarni qo'shgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_rule', level: '🟢', optCols: 3,
  eyebrow: L("Ikki bir hadni ko'paytirish", 'Умножение одночленов', 'Multiplying monomials'),
  setup: L(
    "Bir hadlar ko'paytirilganda ikki xil amal ishlaydi: sonlar bir-biriga ko'paytiriladi, bir xil harfning ko'rsatkichlari esa qo'shiladi.",
    'При умножении одночленов работают два разных действия: числа перемножаются, а показатели одинаковой буквы складываются.',
    'Multiplying monomials uses two different actions: the numbers are multiplied, the exponents of the same letter are added.'),
  expr: ['4x²', '·', '25x³'], exprSize: 34,
  ask: L("Ko'paytma qanday yoziladi?", 'Как записывается произведение?', 'How is the product written?'),
  opts: [{ label: ['100x⁵'] }, { label: ['100x⁶'] }, { label: ['29x⁵'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. 4 · 25 = 100, ko'rsatkichlar esa 2 + 3 = 5. Javob 100x⁵.",
    'Верно. 4 · 25 = 100, а показатели 2 + 3 = 5. Ответ 100x⁵.',
    'Correct. 4 · 25 = 100, and the exponents 2 + 3 = 5. The answer is 100x⁵.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Koeffitsiyent to'g'ri, lekin ko'rsatkichlar ko'paytirilgan: 2 · 3 = 6. x² · x³ da esa ikkita va uchta x birga BESHTA bo'ladi.",
      'Коэффициент верный, но показатели перемножили: 2 · 3 = 6. А в x² · x³ два и три икса вместе дают ПЯТЬ.',
      'The coefficient is right, but the exponents were multiplied: 2 · 3 = 6. In x² · x³ two and three x make FIVE.') },
    { when: (s) => s.picked === 2, text: L(
      "Ko'rsatkich to'g'ri, lekin koeffitsiyentlar qo'shilgan: 4 + 25 = 29. Sonlar esa ko'paytiriladi: 4 · 25 = 100.",
      'Показатель верный, но коэффициенты сложили: 4 + 25 = 29. А числа перемножаются: 4 · 25 = 100.',
      'The exponent is right, but the coefficients were added: 4 + 25 = 29. Numbers are multiplied: 4 · 25 = 100.') },
  ],
  wrongText: L(
    "Ikki amalni alohida bajaring: sonlarni ko'paytiring, harf ko'rsatkichlarini qo'shing.",
    'Сделай два действия по отдельности: числа перемножь, показатели буквы сложи.',
    'Do the two actions separately: multiply the numbers, add the exponents of the letter.'),
};

export default function D16_01(props) { return <Choice data={DATA} {...props} />; }
