// Dars17 · Amaliyot 02 — Koeffitsiyent darajaga · 🟢 · tag: coef_to_power
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// (5y⁴)³ = 125y¹². Faqat KOEFFITSIYENT so'raladi: 5³ = 125.
// Xato javoblar: 15 (5 · 3), 25 (5², ko'rsatkichni ikki deb olgan),
// 8 (5 + 3).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'coef_to_power', level: '🟢', allowNeg: false, target: 125,
  eyebrow: L('Koeffitsiyent', 'Коэффициент', 'The coefficient'),
  setup: L(
    "Qavs ustidagi ko'rsatkich songa ham tegishli: son shu darajaga ko'tariladi, ya'ni o'ziga shuncha marta ko'paytiriladi.",
    'Показатель над скобкой относится и к числу: оно возводится в эту степень, то есть умножается само на себя столько раз.',
    'The exponent over the bracket applies to the number too: it is raised to that power, multiplied by itself that many times.'),
  expr: ['(5y⁴)³'], exprSize: 38,
  label: L('Koeffitsiyentni yozing:', 'Запиши коэффициент:', 'Write the coefficient:'),
  correctText: L(
    "To'g'ri. 5³ = 5 · 5 · 5 = 125. To'liq javob 125y¹²: ko'rsatkich 4 · 3 = 12.",
    'Верно. 5³ = 5 · 5 · 5 = 125. Полный ответ 125y¹²: показатель 4 · 3 = 12.',
    'Correct. 5³ = 5 · 5 · 5 = 125. The full answer is 125y¹²: the exponent is 4 · 3 = 12.'),
  wrongs: [
    { when: (s) => s.value === 15, text: L(
      "15 bu 5 · 3. Ko'rsatkich ko'paytuvchi emas: u beshlik necha marta ko'paytirilishini aytadi.",
      '15 это 5 · 3. Показатель не множитель: он говорит, сколько раз умножается пятёрка.',
      '15 is 5 · 3. The exponent is not a factor: it says how many times the five is multiplied.') },
    { when: (s) => s.value === 25, text: L(
      "25 bu 5². Qavs ustida esa uch turibdi, ya'ni beshta uch marta olinadi: 125.",
      '25 это 5². А над скобкой стоит три, значит пятёрка берётся трижды: 125.',
      '25 is 5². But the bracket has three above it, so the five is taken three times: 125.') },
    { when: (s) => s.value === 8, text: L(
      "8 bu 5 + 3. Bu yerda qo'shish yo'q: son darajaga ko'tariladi.",
      '8 это 5 + 3. Здесь нет сложения: число возводится в степень.',
      '8 is 5 + 3. There is no addition here: the number is raised to a power.') },
  ],
  wrongText: L(
    "Beshni uch marta o'ziga ko'paytiring: 5 · 5 = 25, keyin yana 5 ga.",
    'Умножь пятёрку саму на себя три раза: 5 · 5 = 25, потом ещё на 5.',
    'Multiply the five by itself three times: 5 · 5 = 25, then by 5 again.'),
};

export default function D17_02(props) { return <TypeValue data={DATA} {...props} />; }
