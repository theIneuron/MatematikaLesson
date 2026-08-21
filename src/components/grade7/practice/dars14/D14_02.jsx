// Dars14 · Amaliyot 02 — Sonli asos bilan · 🟢 · tag: mul_numeric
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 2⁵ · 2³ = 2⁸ = 256. Xossani ishlatsa ish qisqaradi: 32 · 8 ni hisoblash
// ham mumkin, lekin 2⁸ ni bilish tezroq.
// Xato javoblar: 2¹⁵ = 32768 (ko'rsatkichlarni ko'paytirgan) va 40 (asos
// va ko'rsatkichni ko'paytirgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_numeric', level: '🟢', allowNeg: false, target: 256,
  eyebrow: L('Sonli asos', 'Числовое основание', 'A numeric base'),
  setup: L(
    "Xossa sonlar uchun ham ishlaydi: asoslar bir xil bo'lsa, ko'rsatkichlar qo'shiladi. Keyin darajani hisoblash qoladi.",
    'Свойство работает и для чисел: если основания одинаковые, показатели складываются. Потом остаётся посчитать степень.',
    'The property works for numbers too: same base means the exponents add. Then the power is worked out.'),
  expr: ['2⁵', '·', '2³'], exprSize: 36,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 2⁵ · 2³ = 2⁸ = 256. Tekshirish: 32 · 8 = 256.",
    'Верно. 2⁵ · 2³ = 2⁸ = 256. Проверка: 32 · 8 = 256.',
    'Correct. 2⁵ · 2³ = 2⁸ = 256. Check: 32 · 8 = 256.'),
  wrongs: [
    { when: (s) => s.value === 32768, text: L(
      "32768 bu 2¹⁵: ko'rsatkichlar ko'paytirilgan. Ko'paytmada esa ular qo'shiladi: 5 + 3 = 8.",
      '32768 это 2¹⁵: показатели перемножили. А в произведении они складываются: 5 + 3 = 8.',
      '32768 is 2¹⁵: the exponents were multiplied. In a product they add: 5 + 3 = 8.') },
    { when: (s) => s.value === 40, text: L(
      "40 bu 32 + 8. Darajalar ko'paytirilmoqda, qo'shilmayapti: 32 · 8 = 256.",
      '40 это 32 + 8. Степени умножаются, а не складываются: 32 · 8 = 256.',
      '40 is 32 + 8. The powers are multiplied, not added: 32 · 8 = 256.') },
    { when: (s) => s.value === 64, text: L(
      "64 bu 2⁶. Ko'rsatkichlarni sanang: 5 + 3 = 8, ya'ni 2⁸ = 256.",
      '64 это 2⁶. Посчитай показатели: 5 + 3 = 8, значит 2⁸ = 256.',
      '64 is 2⁶. Count the exponents: 5 + 3 = 8, so 2⁸ = 256.') },
  ],
  wrongText: L(
    "Ko'rsatkichlarni qo'shing: 5 + 3 = 8. Keyin 2⁸ ni hisoblang.",
    'Сложи показатели: 5 + 3 = 8. Потом посчитай 2⁸.',
    'Add the exponents: 5 + 3 = 8. Then work out 2⁸.'),
};

export default function D14_02(props) { return <TypeValue data={DATA} {...props} />; }
