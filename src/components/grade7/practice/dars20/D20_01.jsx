// Dars20 · Amaliyot 01 — Har hadga alohida · 🟢 · choice · tag: mul_each_term
// Faqat MA'LUMOT. Mexanika: kit.jsx -> Choice. Raskladka: 1-o'rin (isinish).
//
// 5x(3x − 4) = 15x² − 20x. Bir had qavs ichidagi HAR hadga ko'paytiriladi:
// 5x · 3x = 15x², 5x · 4 = 20x.
// Xato variantlar: 15x² − 4 (ikkinchi had ko'paytirilmagan),
// 8x² − 20x (5 va 3 qo'shilgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_each_term', level: '🟢', optCols: 3,
  eyebrow: L('Qavsga ko\'paytirish', 'Умножение на скобку', 'Multiplying a bracket'),
  setup: L(
    "Qavs oldidagi bir had ichidagi HAR hadga ko'paytiriladi. Kataklar soni qavsdagi hadlar soniga teng: ikki had bo'lsa, ikki ko'paytma chiqadi.",
    'Одночлен перед скобкой умножается на КАЖДЫЙ член внутри. Число клеток равно числу членов в скобке: два члена дают два произведения.',
    'The monomial in front multiplies EVERY term inside. The number of cells equals the number of terms: two terms give two products.'),
  expr: ['5x', '(3x', '−', '4)'], exprSize: 32,
  ask: L("Ko'paytma qanday yoziladi?", 'Как записывается произведение?', 'How is the product written?'),
  opts: [{ label: ['15x²', '−', '20x'] }, { label: ['15x²', '−', '4'] }, { label: ['8x²', '−', '20x'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. 5x · 3x = 15x² va 5x · 4 = 20x. Ikkinchi ko'paytmaning oldida minus qoladi.",
    'Верно. 5x · 3x = 15x² и 5x · 4 = 20x. Перед вторым произведением остаётся минус.',
    'Correct. 5x · 3x = 15x² and 5x · 4 = 20x. The second product keeps the minus.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ikkinchi had ko'paytirilmagan: 4 o'sha holda qolib ketgan. 5x · 4 = 20x bo'lishi kerak.",
      'Второй член не умножили: 4 осталось как было. Должно быть 5x · 4 = 20x.',
      'The second term was not multiplied: the 4 stayed as it was. It must be 5x · 4 = 20x.') },
    { when: (s) => s.picked === 2, text: L(
      "8x² chiqishi uchun 5 va 3 qo'shilgan. Koeffitsiyentlar ko'paytiriladi: 5 · 3 = 15.",
      'Чтобы вышло 8x², сложили 5 и 3. Коэффициенты перемножаются: 5 · 3 = 15.',
      'To get 8x² the 5 and 3 were added. Coefficients are multiplied: 5 · 3 = 15.') },
  ],
  wrongText: L(
    "Ikki ko'paytmani alohida hisoblang: 5x ni 3x ga, keyin 5x ni 4 ga.",
    'Посчитай два произведения по отдельности: 5x на 3x, потом 5x на 4.',
    'Work out two products separately: 5x times 3x, then 5x times 4.'),
};

export default function D20_01(props) { return <Choice data={DATA} {...props} />; }
