// Dars15 · Amaliyot 04 — Bir hadning qiymati · 🟡 · tag: monomial_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// −2x³, x = −3.
//   x³ = (−3)³ = −27
//   −2 · (−27) = 54
// Ikki manfiy son musbat ko'paytma beradi. Xato javoblar: −54 (ishorani
// hisobga olmagan) va 18 (x³ ni 3 · 3 deb hisoblagan yoki (−2 · −3)³).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'monomial_value', level: '🟡', allowNeg: true, target: 54,
  eyebrow: L('Bir hadning qiymati', 'Значение одночлена', 'The value of a monomial'),
  setup: L(
    "Avval daraja hisoblanadi, keyin koeffitsiyentga ko'paytiriladi. Ishoralarga alohida e'tibor kerak.",
    'Сначала считается степень, потом умножается на коэффициент. За знаками надо следить отдельно.',
    'The power is worked out first, then multiplied by the coefficient. The signs need separate care.'),
  given: [['x', '=', '−3']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  expr: ['−2x³'], exprSize: 38,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. x³ = (−3)³ = −27, keyin −2 · (−27) = 54. Ikki manfiy son musbat berdi.",
    'Верно. x³ = (−3)³ = −27, затем −2 · (−27) = 54. Два отрицательных дали положительное.',
    'Correct. x³ = (−3)³ = −27, then −2 · (−27) = 54. Two negatives gave a positive.'),
  wrongs: [
    { when: (s) => s.value === -54, text: L(
      "Ishorani tekshiring: (−3)³ = −27 manfiy, koeffitsiyent ham manfiy. Ikki manfiy son ko'paytmasi MUSBAT.",
      'Проверь знак: (−3)³ = −27 отрицательное, коэффициент тоже отрицательный. Произведение двух отрицательных ПОЛОЖИТЕЛЬНО.',
      'Check the sign: (−3)³ = −27 is negative and the coefficient is negative too. A product of two negatives is POSITIVE.') },
    { when: (s) => s.value === 18 || s.value === -18, text: L(
      "x³ bu uchta ko'paytuvchi: (−3) · (−3) · (−3) = −27. 9 esa faqat ikkitasidan chiqadi.",
      'x³ это три множителя: (−3) · (−3) · (−3) = −27. А 9 выходит только из двух.',
      'x³ is three factors: (−3) · (−3) · (−3) = −27. The 9 comes from two only.') },
    { when: (s) => s.value === 216 || s.value === -216, text: L(
      "Koeffitsiyent darajaga KIRMAYDI: avval x³ hisoblanadi, keyin −2 ga ko'paytiriladi.",
      'Коэффициент НЕ входит в степень: сначала считается x³, потом умножается на −2.',
      'The coefficient is NOT part of the power: x³ comes first, then the multiplication by −2.') },
  ],
  wrongText: L(
    "Avval (−3)³ ni hisoblang: uchta minus, natija manfiy. Keyin −2 ga ko'paytiring.",
    'Сначала посчитай (−3)³: три минуса, результат отрицательный. Потом умножь на −2.',
    'First work out (−3)³: three minuses, so the result is negative. Then multiply by −2.'),
};

export default function D15_04(props) { return <TypeValue data={DATA} {...props} />; }
