// Dars13 · Amaliyot 06 — Qaysi biri katta · 🟡 · tag: compare_powers
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// 2³ = 8, 3² = 9. Ya'ni 3² kattaroq -- asos va ko'rsatkichni almashtirsak
// qiymat O'ZGARADI. Bu darajaning ko'paytirishdan farqi: 2 · 3 va 3 · 2
// bir xil, lekin 2³ va 3² boshqa.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'compare_powers', level: '🟡', optCols: 3,
  eyebrow: L('Qaysi biri katta', 'Что больше', 'Which is bigger'),
  setup: L(
    "Ko'paytirishda o'rin almashtirish qiymatni o'zgartirmaydi. Darajada esa asos va ko'rsatkichni almashtirsa qiymat o'zgaradi.",
    'В умножении перестановка не меняет значение. А в степени, если поменять основание и показатель, значение изменится.',
    'Swapping does not change a product. But swapping the base and the exponent does change a power.'),
  expr: ['2³', 'va', '3²'], exprSize: 34,
  ask: L('Qaysi daraja kattaroq?', 'Какая степень больше?', 'Which power is bigger?'),
  opts: [{ label: ['3²'] }, { label: ['2³'] }, { label: L('Teng', 'Равны', 'Equal') }],
  correct: 0,
  correctText: L(
    "To'g'ri. 2³ = 8, 3² = 9. Ya'ni 3² bir birlikka katta: asos va ko'rsatkichning o'rni muhim.",
    'Верно. 2³ = 8, 3² = 9. То есть 3² больше на единицу: место основания и показателя важно.',
    'Correct. 2³ = 8, 3² = 9. So 3² is bigger by one: the places of base and exponent matter.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "2³ = 2 · 2 · 2 = 8, 3² = 3 · 3 = 9. Sakkiz to'qqizdan kichik.",
      '2³ = 2 · 2 · 2 = 8, 3² = 3 · 3 = 9. Восемь меньше девяти.',
      '2³ = 2 · 2 · 2 = 8, 3² = 3 · 3 = 9. Eight is less than nine.') },
    { when: (s) => s.picked === 2, text: L(
      "Teng emas: 8 va 9. Darajada o'rin almashtirish ishlamaydi -- bu ko'paytirish emas.",
      'Не равны: 8 и 9. В степени перестановка не работает — это не умножение.',
      'Not equal: 8 and 9. Swapping does not work in powers — this is not a multiplication.') },
  ],
  wrongText: L(
    "Ikkovini hisoblang: 2³ nechta ikkilikdan, 3² nechta uchlikdan iborat?",
    'Посчитай обе: из скольких двоек состоит 2³ и из скольких троек 3²?',
    'Work both out: how many twos make 2³ and how many threes make 3²?'),
};

export default function D13_06(props) { return <Choice data={DATA} {...props} />; }
