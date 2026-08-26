// Dars13 · Amaliyot 06 — Qaysi biri katta · 🟡 · tag: compare_powers
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): qiymatlar uch va to'rt xonali,
// ya'ni farqni ko'rish uchun ikkovini haqiqatan hisoblash kerak.
//
// 4⁵ = 1024, 5⁴ = 625. Ya'ni 4⁵ kattaroq -- asos va ko'rsatkichni almashtirsak
// qiymat O'ZGARADI. Bu darajaning ko'paytirishdan farqi: 4 · 5 va 5 · 4
// bir xil, lekin 4⁵ va 5⁴ boshqa.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'compare_powers', level: '🟡', optCols: 3,
  eyebrow: L('Qaysi biri katta', 'Что больше', 'Which is bigger'),
  setup: L(
    "Ko'paytirishda o'rin almashtirish qiymatni o'zgartirmaydi. Darajada esa asos va ko'rsatkichni almashtirsa qiymat o'zgaradi.",
    'В умножении перестановка не меняет значение. А в степени, если поменять основание и показатель, значение изменится.',
    'Swapping does not change a product. But swapping the base and the exponent does change a power.'),
  expr: ['4⁵', L('va', 'и', 'and'), '5⁴'], exprSize: 34,
  ask: L('Qaysi daraja kattaroq?', 'Какая степень больше?', 'Which power is bigger?'),
  opts: [{ label: ['4⁵'] }, { label: ['5⁴'] }, { label: L('Teng', 'Равны', 'Equal') }],
  correct: 0,
  correctText: L(
    "To'g'ri. 4⁵ = 1024, 5⁴ = 625. Ya'ni 4⁵ ancha katta: ko'paytuvchi kichik bo'lsa ham, ularning soni ko'p.",
    'Верно. 4⁵ = 1024, 5⁴ = 625. То есть 4⁵ заметно больше: множитель меньше, зато множителей больше.',
    'Correct. 4⁵ = 1024, 5⁴ = 625. So 4⁵ is much bigger: the factor is smaller but there are more of them.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "5⁴ da to'rtta beshlik: 625. 4⁵ da esa beshta to'rtlik: 1024. Ko'paytuvchisi ko'p bo'lgani yutdi.",
      'В 5⁴ четыре пятёрки: 625. А в 4⁵ пять четвёрок: 1024. Победило то, где множителей больше.',
      'In 5⁴ there are four fives: 625. In 4⁵ five fours: 1024. The one with more factors won.') },
    { when: (s) => s.picked === 2, text: L(
      "Teng emas: 1024 va 625. Darajada o'rin almashtirish ishlamaydi -- bu ko'paytirish emas.",
      'Не равны: 1024 и 625. В степени перестановка не работает — это не умножение.',
      'Not equal: 1024 and 625. Swapping does not work in powers — this is not a multiplication.') },
  ],
  wrongText: L(
    "Ikkovini hisoblang: 4⁵ nechta to'rtlikdan, 5⁴ nechta beshlikdan iborat?",
    'Посчитай обе: из скольких четвёрок состоит 4⁵ и из скольких пятёрок 5⁴?',
    'Work both out: how many fours make 4⁵ and how many fives make 5⁴?'),
};

export default function D13_06(props) { return <Choice data={DATA} {...props} />; }
