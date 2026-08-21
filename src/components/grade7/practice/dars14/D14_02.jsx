// Dars14 · Amaliyot 02 — Sonli asos bilan · 🟢 · tag: mul_numeric
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): javob uch xonali, asos esa
// ikkilik emas -- yodlangan javob ishlamaydi.
//
// 3⁴ · 3² = 3⁶ = 729. Xossani ishlatsa ish qisqaradi: 81 · 9 ni hisoblash
// ham mumkin, lekin 3⁶ ni bilish tezroq.
// Xato javoblar: 3⁸ = 6561 (ko'rsatkichlarni ko'paytirgan), 90 (81 + 9) va
// 81 (bitta ko'paytuvchini tashlab ketgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_numeric', level: '🟢', allowNeg: false, target: 729,
  eyebrow: L('Sonli asos', 'Числовое основание', 'A numeric base'),
  setup: L(
    "Xossa sonlar uchun ham ishlaydi: asoslar bir xil bo'lsa, ko'rsatkichlar qo'shiladi. Keyin darajani hisoblash qoladi.",
    'Свойство работает и для чисел: если основания одинаковые, показатели складываются. Потом остаётся посчитать степень.',
    'The property works for numbers too: same base means the exponents add. Then the power is worked out.'),
  expr: ['3⁴', '·', '3²'], exprSize: 36,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 3⁴ · 3² = 3⁶ = 729. Tekshirish: 81 · 9 = 729.",
    'Верно. 3⁴ · 3² = 3⁶ = 729. Проверка: 81 · 9 = 729.',
    'Correct. 3⁴ · 3² = 3⁶ = 729. Check: 81 · 9 = 729.'),
  wrongs: [
    { when: (s) => s.value === 6561, text: L(
      "6561 bu 3⁸: ko'rsatkichlar ko'paytirilgan. Ko'paytmada esa ular qo'shiladi: 4 + 2 = 6.",
      '6561 это 3⁸: показатели перемножили. А в произведении они складываются: 4 + 2 = 6.',
      '6561 is 3⁸: the exponents were multiplied. In a product they add: 4 + 2 = 6.') },
    { when: (s) => s.value === 90, text: L(
      "90 bu 81 + 9. Darajalar ko'paytirilmoqda, qo'shilmayapti: 81 · 9 = 729.",
      '90 это 81 + 9. Степени умножаются, а не складываются: 81 · 9 = 729.',
      '90 is 81 + 9. The powers are multiplied, not added: 81 · 9 = 729.') },
    { when: (s) => s.value === 81, text: L(
      "81 bu 3⁴, ya'ni ikkinchi ko'paytuvchi tashlab ketilgan. Ko'rsatkichlarni qo'shing: 4 + 2 = 6, 3⁶ = 729.",
      '81 это 3⁴, то есть второй множитель потерялся. Сложи показатели: 4 + 2 = 6, значит 3⁶ = 729.',
      '81 is 3⁴, so the second factor got lost. Add the exponents: 4 + 2 = 6, so 3⁶ = 729.') },
  ],
  wrongText: L(
    "Ko'rsatkichlarni qo'shing: 4 + 2 = 6. Keyin 3⁶ ni hisoblang.",
    'Сложи показатели: 4 + 2 = 6. Потом посчитай 3⁶.',
    'Add the exponents: 4 + 2 = 6. Then work out 3⁶.'),
};

export default function D14_02(props) { return <TypeValue data={DATA} {...props} />; }
