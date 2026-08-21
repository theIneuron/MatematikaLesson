// Dars16 · Amaliyot 06 — Katta ko'rsatkichlar · 🟡 · tag: mul_big_exp
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 7x¹² · 8x⁹ = 56x²¹. Faqat KO'RSATKICH so'raladi: 12 + 9 = 21.
// Katta ko'rsatkich ataylab: yozib chiqib sanash mumkin emas, qoida kerak.
// Xato javoblar: 108 (12 · 9), 3 (12 − 9), 56 (koeffitsiyentni yozgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_big_exp', level: '🟡', allowNeg: false, target: 21,
  eyebrow: L("Ko'rsatkich", 'Показатель', 'The exponent'),
  setup: L(
    "Ko'rsatkich katta bo'lsa, harflarni yozib chiqib sanash imkoni yo'q. Qoida esa o'zgarmaydi: ko'rsatkichlar qo'shiladi.",
    'Когда показатель большой, расписать буквы и пересчитать не получится. А правило то же: показатели складываются.',
    'With a big exponent writing the letters out is not an option. The rule stays: the exponents add.'),
  expr: ['7x¹²', '·', '8x⁹'], exprSize: 34,
  label: L("Ko'paytmadagi x ning ko'rsatkichini yozing:", 'Запиши показатель x в произведении:', 'Write the exponent of x in the product:'),
  correctText: L(
    "To'g'ri. 12 + 9 = 21, ya'ni ko'paytma 56x²¹. Koeffitsiyent esa 7 · 8 = 56.",
    'Верно. 12 + 9 = 21, то есть произведение 56x²¹. А коэффициент 7 · 8 = 56.',
    'Correct. 12 + 9 = 21, so the product is 56x²¹. The coefficient is 7 · 8 = 56.'),
  wrongs: [
    { when: (s) => s.value === 108, text: L(
      "108 bu 12 · 9. Ko'rsatkichlar ko'paytirilmaydi: har ko'paytuvchi o'z x larini olib keladi, ular birga qo'shiladi.",
      '108 это 12 · 9. Показатели не перемножаются: каждый множитель приносит свои иксы, и они складываются.',
      '108 is 12 · 9. Exponents are not multiplied: each factor brings its own x, and they add up.') },
    { when: (s) => s.value === 3, text: L(
      "3 bu 12 − 9. Ayirish bo'lishda bo'ladi. Ko'paytirishda x lar soni ORTADI.",
      '3 это 12 − 9. Вычитание бывает при делении. При умножении число иксов РАСТЁТ.',
      '3 is 12 − 9. Subtraction happens in division. In multiplication the number of x GROWS.') },
    { when: (s) => s.value === 56, text: L(
      "56 bu koeffitsiyent, ya'ni 7 · 8. So'ralgan narsa esa x ning ko'rsatkichi.",
      '56 это коэффициент, то есть 7 · 8. А спрашивали показатель x.',
      '56 is the coefficient, 7 · 8. The question asked for the exponent of x.') },
  ],
  wrongText: L(
    "Birinchi hadda nechta x bor, ikkinchisida nechta? Ikkovini qo'shing.",
    'Сколько иксов в первом одночлене и сколько во втором? Сложи их.',
    'How many x in the first monomial and how many in the second? Add them.'),
};

export default function D16_06(props) { return <TypeValue data={DATA} {...props} />; }
