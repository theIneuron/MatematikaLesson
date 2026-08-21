// Dars14 · Amaliyot 06 — Bo'lish, sonli asos · 🟡 · tag: div_numeric
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 3⁶ : 3⁴ = 3² = 9. Xossa hisobni qisqartiradi: 729 : 81 ni hisoblash
// shart emas.
// Xato javoblar: 81 (3⁴ deb hisoblagan), 3 (ko'rsatkichni javob deb olgan),
// 6561 (ko'rsatkichlarni bo'lmagan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'div_numeric', level: '🟡', allowNeg: false, target: 9,
  eyebrow: L("Bo'lish", 'Деление степеней', 'Dividing powers'),
  setup: L(
    "Asoslar bir xil bo'lsa, bo'lishda ko'rsatkichlar ayiriladi. Katta sonlarni hisoblash shart emas.",
    'Если основания одинаковые, при делении показатели вычитаются. Большие числа считать не нужно.',
    'With the same base, dividing subtracts the exponents. There is no need to work out the big numbers.'),
  expr: ['3⁶', ':', '3⁴'], exprSize: 36,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 6 − 4 = 2, ya'ni 3² = 9. Tekshirish: 729 : 81 = 9.",
    'Верно. 6 − 4 = 2, значит 3² = 9. Проверка: 729 : 81 = 9.',
    'Correct. 6 − 4 = 2, so 3² = 9. Check: 729 : 81 = 9.'),
  wrongs: [
    { when: (s) => s.value === 2, text: L(
      "2 bu KO'RSATKICH, javob emas: 3² ni hisoblash kerak, ya'ni 9.",
      '2 это ПОКАЗАТЕЛЬ, а не ответ: надо посчитать 3², то есть 9.',
      '2 is the EXPONENT, not the answer: 3² still has to be worked out, giving 9.') },
    { when: (s) => s.value === 81, text: L(
      "81 bu 3⁴. Ko'rsatkichlarni ayiring: 6 − 4 = 2, keyin 3² = 9.",
      '81 это 3⁴. Вычти показатели: 6 − 4 = 2, потом 3² = 9.',
      '81 is 3⁴. Subtract the exponents: 6 − 4 = 2, then 3² = 9.') },
    { when: (s) => s.value === 27 || s.value === 3, text: L(
      "Ko'rsatkichlarni aniq ayiring: 6 − 4 = 2. 3¹ yoki 3³ emas.",
      'Вычитай показатели точно: 6 − 4 = 2. Не 3¹ и не 3³.',
      'Subtract the exponents exactly: 6 − 4 = 2. Not 3¹ and not 3³.') },
  ],
  wrongText: L(
    "Ko'rsatkichlarni ayiring, keyin chiqqan darajani hisoblang.",
    'Вычти показатели, потом посчитай полученную степень.',
    'Subtract the exponents, then work out the power you get.'),
};

export default function D14_06(props) { return <TypeValue data={DATA} {...props} />; }
