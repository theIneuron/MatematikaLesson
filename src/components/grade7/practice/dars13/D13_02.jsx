// Dars13 · Amaliyot 02 — Darajani hisoblash · 🟢 · tag: power_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 3⁴ = 3 · 3 · 3 · 3 = 81.
// Xato javoblar: 12 (3 · 4), 64 (4³ deb hisoblagan), 27 (bir marta kam
// ko'paytirgan, ya'ni 3³).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'power_value', level: '🟢', allowNeg: false, target: 81,
  eyebrow: L('Darajani hisoblash', 'Вычислить степень', 'Work out the power'),
  setup: L(
    "Asos ko'rsatkich necha marta bo'lsa, shuncha marta ko'paytuvchi bo'ladi. Ko'paytirishlarni sanab chiqing.",
    'Основание берётся множителем столько раз, сколько показывает показатель. Пересчитай умножения.',
    'The base is a factor as many times as the exponent says. Count the multiplications.'),
  expr: ['3⁴'], exprSize: 40,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 3 · 3 = 9, 9 · 3 = 27, 27 · 3 = 81. To'rt marta ko'paytuvchi bo'ldi.",
    'Верно. 3 · 3 = 9, 9 · 3 = 27, 27 · 3 = 81. Множитель взят четыре раза.',
    'Correct. 3 · 3 = 9, 9 · 3 = 27, 27 · 3 = 81. The factor was taken four times.'),
  wrongs: [
    { when: (s) => s.value === 12, text: L(
      "12 bu 3 · 4. Ko'rsatkich ko'paytuvchi emas: u ko'paytirishlar SONINI aytadi.",
      '12 это 3 · 4. Показатель не множитель: он говорит, СКОЛЬКО раз умножать.',
      '12 is 3 · 4. The exponent is not a factor: it says HOW MANY times to multiply.') },
    { when: (s) => s.value === 64, text: L(
      "64 bu 4³, ya'ni asos va ko'rsatkich almashgan. Pastda 3 turibdi.",
      '64 это 4³, то есть основание и показатель перепутаны. Внизу стоит 3.',
      '64 is 4³, so the base and the exponent got swapped. The 3 is below.') },
    { when: (s) => s.value === 27, text: L(
      "27 bu 3³, uchta ko'paytuvchi. Bizga esa to'rttasi kerak: 27 · 3 = 81.",
      '27 это 3³, три множителя. А нам нужно четыре: 27 · 3 = 81.',
      '27 is 3³, three factors. We need four: 27 · 3 = 81.') },
  ],
  wrongText: L(
    "Uchni to'rt marta yozib ko'paytiring: 3 · 3 · 3 · 3.",
    'Напиши тройку четыре раза и перемножь: 3 · 3 · 3 · 3.',
    'Write the three four times and multiply: 3 · 3 · 3 · 3.'),
};

export default function D13_02(props) { return <TypeValue data={DATA} {...props} />; }
