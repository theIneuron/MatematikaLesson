// Dars16 · Amaliyot 02 — Koeffitsiyentning ishorasi · 🟢 · tag: mul_coef_sign
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// −15a³ · 20a = −300a⁴. Faqat KOEFFITSIYENT so'raladi: −15 · 20 = −300.
// Xato javoblar: 300 (ishorani tashlab ketgan), 5 (−15 + 20, qo'shgan),
// −35 (−15 va −20 deb qo'shgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_coef_sign', level: '🟢', allowNeg: true, target: -300,
  eyebrow: L('Koeffitsiyent', 'Коэффициент', 'The coefficient'),
  setup: L(
    "Ko'paytmaning koeffitsiyenti -- bir hadlar sonlarining ko'paytmasi. Ishora ham shu ko'paytmadan chiqadi: bitta minus javobni manfiy qiladi.",
    'Коэффициент произведения — это произведение чисел одночленов. Знак берётся оттуда же: один минус делает ответ отрицательным.',
    "The coefficient of the product is the product of the monomials' numbers. The sign comes from there too: one minus makes the answer negative."),
  expr: ['−15a³', '·', '20a'], exprSize: 34,
  label: L('Koeffitsiyentni yozing:', 'Запиши коэффициент:', 'Write the coefficient:'),
  correctText: L(
    "To'g'ri. −15 · 20 = −300. Bitta ko'paytuvchi manfiy, ya'ni javob ham manfiy: −300a⁴.",
    'Верно. −15 · 20 = −300. Один множитель отрицательный, значит и ответ отрицательный: −300a⁴.',
    'Correct. −15 · 20 = −300. One factor is negative, so the answer is negative too: −300a⁴.'),
  wrongs: [
    { when: (s) => s.value === 300, text: L(
      "Ishora yo'qoldi: minusli sonni musbatga ko'paytirsa natija manfiy bo'ladi. Javob −300.",
      'Потерялся знак: отрицательное число, умноженное на положительное, даёт отрицательное. Ответ −300.',
      'The sign got lost: a negative times a positive is negative. The answer is −300.') },
    { when: (s) => s.value === 5 || s.value === -5, text: L(
      "5 bu −15 + 20, ya'ni qo'shish. Koeffitsiyentlar esa ko'paytiriladi: −15 · 20.",
      '5 это −15 + 20, то есть сложение. А коэффициенты перемножаются: −15 · 20.',
      '5 is −15 + 20, an addition. Coefficients are multiplied: −15 · 20.') },
    { when: (s) => s.value === -35, text: L(
      "−35 chiqishi uchun ikki son ham manfiy deb qo'shilgan. Ikkinchi ko'paytuvchi musbat: 20.",
      'Чтобы вышло −35, оба числа сложили как отрицательные. А второй множитель положительный: 20.',
      'To get −35 both numbers were added as negatives. The second factor is positive: 20.') },
  ],
  wrongText: L(
    "Sonlarni ko'paytiring va ishorani hisoblang: minuslar soni bitta bo'lsa javob manfiy.",
    'Перемножь числа и посчитай знак: если минус один, ответ отрицательный.',
    'Multiply the numbers and work out the sign: one minus makes the answer negative.'),
};

export default function D16_02(props) { return <TypeValue data={DATA} {...props} />; }
