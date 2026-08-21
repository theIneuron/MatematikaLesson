// Dars24 · Amaliyot 01 — Har had bo'linadi · 🟢 · choice · tag: div_each_term
// Mexanika: kit.jsx -> Choice. Raskladka: 24-dars, 1-o'rin (isinish).
// (18x⁴ + 12x²) : 6x² = 3x² + 2. Har had alohida bo'linadi.
// Xato variantlar: 3x² + 2x² (ikkinchi hadda harf qoldirilgan),
// 3x⁶ + 2 (ko'rsatkichlarni qo'shgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'div_each_term', level: '🟢', optCols: 3,
  eyebrow: L("Ko'phadni bo'lish", 'Деление многочлена', 'Dividing a polynomial'),
  setup: L(
    "Ko'phadni bir hadga bo'lish uchun HAR had alohida bo'linadi. Sonlar bo'linadi, ko'rsatkichlar ayiriladi.",
    'Чтобы разделить многочлен на одночлен, делится КАЖДЫЙ член отдельно. Числа делятся, показатели вычитаются.',
    'To divide a polynomial by a monomial, EVERY term is divided separately. Numbers divide, exponents subtract.'),
  expr: ['(18x⁴', '+', '12x²)', ':', '6x²'], exprSize: 28,
  ask: L("Bo'linma qanday yoziladi?", 'Как записывается частное?', 'How is the quotient written?'),
  opts: [{ label: ['3x²', '+', '2'] }, { label: ['3x²', '+', '2x²'] }, { label: ['3x⁶', '+', '2'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. 18 : 6 = 3 va 4 − 2 = 2, ya'ni 3x². Ikkinchi hadda 12 : 6 = 2 va 2 − 2 = 0, harf qolmaydi.",
    'Верно. 18 : 6 = 3 и 4 − 2 = 2, значит 3x². Во втором члене 12 : 6 = 2 и 2 − 2 = 0, буква не остаётся.',
    'Correct. 18 : 6 = 3 and 4 − 2 = 2, giving 3x². In the second term 12 : 6 = 2 and 2 − 2 = 0, so no letter.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ikkinchi hadda harf qolib ketgan: 12x² : 6x² da ko'rsatkichlar teng, 2 − 2 = 0. Ya'ni faqat 2.",
      'Во втором члене осталась буква: в 12x² : 6x² показатели равны, 2 − 2 = 0. Значит просто 2.',
      'The second term kept a letter: in 12x² : 6x² the exponents are equal, 2 − 2 = 0. So just 2.') },
    { when: (s) => s.picked === 2, text: L(
      "3x⁶ chiqishi uchun ko'rsatkichlar qo'shilgan. Bo'lishda ular AYIRILADI: 4 − 2 = 2.",
      'Чтобы вышло 3x⁶, показатели сложили. При делении они ВЫЧИТАЮТСЯ: 4 − 2 = 2.',
      'To get 3x⁶ the exponents were added. In division they SUBTRACT: 4 − 2 = 2.') },
  ],
  wrongText: L(
    "Ikki bo'linmani alohida hisoblang: 18x⁴ : 6x² va 12x² : 6x².",
    'Посчитай два частных по отдельности: 18x⁴ : 6x² и 12x² : 6x².',
    'Work out the two quotients separately: 18x⁴ : 6x² and 12x² : 6x².'),
};

export default function D24_01(props) { return <Choice data={DATA} {...props} />; }
