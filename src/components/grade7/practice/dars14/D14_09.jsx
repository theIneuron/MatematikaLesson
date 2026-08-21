// Dars14 · Amaliyot 09 — Ikki xossa ketma-ket · 🔴 · tag: two_props_chain
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// (2³)² : 2⁴. Ikki xossa ketma-ket:
//   (2³)² = 2⁶      ko'rsatkichlar ko'paytirildi
//   2⁶ : 2⁴ = 2²    ko'rsatkichlar ayirildi
//   2² = 4
// Xato javoblar: 2 (ko'rsatkichni javob deb olgan), 64 (bo'lishni
// bajarmagan), 16 (ko'rsatkichlarni qo'shgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'two_props_chain', level: '🔴', allowNeg: false, target: 4,
  eyebrow: L('Ikki xossa ketma-ket', 'Два свойства подряд', 'Two properties in a row'),
  setup: L(
    "Bu yozuvda ikki xossa kerak: avval darajaning darajasi, keyin bo'lish. Har qadamda ko'rsatkichlar bilan boshqa ish qilinadi.",
    'Здесь нужны два свойства: сначала степень степени, потом деление. На каждом шаге с показателями делают своё.',
    'This record needs two properties: first the power of a power, then the division. Each step treats the exponents differently.'),
  expr: ['(2³)²', ':', '2⁴'], exprSize: 34,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. (2³)² = 2⁶, keyin 2⁶ : 2⁴ = 2² = 4. Tekshirish: 64 : 16 = 4.",
    'Верно. (2³)² = 2⁶, затем 2⁶ : 2⁴ = 2² = 4. Проверка: 64 : 16 = 4.',
    'Correct. (2³)² = 2⁶, then 2⁶ : 2⁴ = 2² = 4. Check: 64 : 16 = 4.'),
  wrongs: [
    { when: (s) => s.value === 2, text: L(
      "2 bu ko'rsatkich, javob emas: 2² ni hisoblang, u 4 beradi.",
      '2 это показатель, а не ответ: посчитай 2², выйдет 4.',
      '2 is the exponent, not the answer: work out 2², which is 4.') },
    { when: (s) => s.value === 64, text: L(
      "64 bu (2³)², ya'ni 2⁶. Bo'lish hali bajarilmadi: 2⁶ : 2⁴ = 2².",
      '64 это (2³)², то есть 2⁶. Деление ещё не сделано: 2⁶ : 2⁴ = 2².',
      '64 is (2³)², that is 2⁶. The division is still to come: 2⁶ : 2⁴ = 2².') },
    { when: (s) => s.value === 32 || s.value === 512, text: L(
      "Birinchi qadamda ko'rsatkichlar KO'PAYTIRILADI: 3 · 2 = 6, ya'ni 2⁶.",
      'На первом шаге показатели ПЕРЕМНОЖАЮТСЯ: 3 · 2 = 6, то есть 2⁶.',
      'In the first step the exponents MULTIPLY: 3 · 2 = 6, that is 2⁶.') },
  ],
  wrongText: L(
    "Avval qavsni hisoblang: ko'rsatkichlar ko'paytiriladi. Keyin bo'lishda ayiriladi.",
    'Сначала посчитай скобку: показатели перемножаются. Потом при делении вычитаются.',
    'First the bracket: the exponents multiply. Then in the division they subtract.'),
};

export default function D14_09(props) { return <TypeValue data={DATA} {...props} />; }
