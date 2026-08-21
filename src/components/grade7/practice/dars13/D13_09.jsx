// Dars13 · Amaliyot 09 — Katta sonlar bilan · 🔴 · tag: power_expression
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 10³ − 2⁵ = 1000 − 32 = 968.
// Bu yerda daraja AMALLAR TARTIBIGA qo'shiladi: daraja qo'shish va
// ayirishdan oldin hisoblanadi. Ya'ni 1-darsning qoidasi kengaydi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'power_expression', level: '🔴', allowNeg: true, target: 968,
  eyebrow: L('Yozuvning qiymati', 'Значение записи', 'The value of the record'),
  setup: L(
    "Daraja qo'shish va ayirishdan OLDIN hisoblanadi. Ikki darajani topib, keyin ayirish qoladi.",
    'Степень считается РАНЬШЕ сложения и вычитания. Найди две степени, а потом останется вычитание.',
    'Powers are worked out BEFORE addition and subtraction. Find the two powers, then the subtraction is left.'),
  expr: ['10³', '−', '2⁵'], exprSize: 36,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 10³ = 1000, 2⁵ = 32, ayirmasi 968. Daraja birinchi bosqichdan oldin hisoblandi.",
    'Верно. 10³ = 1000, 2⁵ = 32, разность 968. Степень посчитана раньше первой ступени.',
    'Correct. 10³ = 1000, 2⁵ = 32, the difference is 968. The powers came before the first stage.'),
  wrongs: [
    { when: (s) => s.value === 970, text: L(
      "2⁵ ni tekshiring: 2 · 2 · 2 · 2 · 2 = 32, 30 emas.",
      'Проверь 2⁵: 2 · 2 · 2 · 2 · 2 = 32, а не 30.',
      'Check 2⁵: 2 · 2 · 2 · 2 · 2 = 32, not 30.') },
    { when: (s) => s.value === 20, text: L(
      "Darajalarni ko'paytirish deb o'qidingiz: 10 · 3 = 30 va 2 · 5 = 10. Daraja bu asosni o'ziga ko'paytirish.",
      'Ты прочитал степени как умножение: 10 · 3 = 30 и 2 · 5 = 10. А степень это умножение основания само на себя.',
      'The powers were read as multiplications: 10 · 3 = 30 and 2 · 5 = 10. A power multiplies the base by itself.') },
    { when: (s) => s.value === 968 - 968 || s.value === 0, text: L(
      "Ikki darajani alohida hisoblang: 1000 va 32. Ular teng emas.",
      'Посчитай две степени отдельно: 1000 и 32. Они не равны.',
      'Work out the two powers separately: 1000 and 32. They are not equal.') },
  ],
  wrongText: L(
    "10³ nechta nol beradi? 2⁵ nechta ikkilikdan iborat? Ikkovini hisoblab ayiring.",
    'Сколько нулей даёт 10³? Из скольких двоек состоит 2⁵? Посчитай обе и вычти.',
    'How many zeros does 10³ give? How many twos make 2⁵? Work both out and subtract.'),
};

export default function D13_09(props) { return <TypeValue data={DATA} {...props} />; }
