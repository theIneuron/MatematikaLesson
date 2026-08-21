// Dars13 · Amaliyot 09 — Katta sonlar bilan · 🔴 · tag: power_expression
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): javob besh xonali.
//
// 10⁵ − 3⁵ = 100000 − 243 = 99757.
// Bu yerda daraja AMALLAR TARTIBIGA qo'shiladi: daraja qo'shish va
// ayirishdan oldin hisoblanadi. Ya'ni 1-darsning qoidasi kengaydi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'power_expression', level: '🔴', allowNeg: true, target: 99757,
  eyebrow: L('Yozuvning qiymati', 'Значение записи', 'The value of the record'),
  setup: L(
    "Daraja qo'shish va ayirishdan OLDIN hisoblanadi. Ikki darajani topib, keyin ayirish qoladi.",
    'Степень считается РАНЬШЕ сложения и вычитания. Найди две степени, а потом останется вычитание.',
    'Powers are worked out BEFORE addition and subtraction. Find the two powers, then the subtraction is left.'),
  expr: ['10⁵', '−', '3⁵'], exprSize: 36,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 10⁵ = 100000, 3⁵ = 243, ayirmasi 99757. Daraja birinchi bosqichdan oldin hisoblandi.",
    'Верно. 10⁵ = 100000, 3⁵ = 243, разность 99757. Степень посчитана раньше первой ступени.',
    'Correct. 10⁵ = 100000, 3⁵ = 243, the difference is 99757. The powers came before the first stage.'),
  wrongs: [
    { when: (s) => s.value === 99760, text: L(
      "3⁵ ni tekshiring: 3 · 9 · 27 emas, balki 3 · 3 · 3 · 3 · 3 = 243. 240 emas.",
      'Проверь 3⁵: 3 · 3 · 3 · 3 · 3 = 243, а не 240.',
      'Check 3⁵: 3 · 3 · 3 · 3 · 3 = 243, not 240.') },
    { when: (s) => s.value === 35, text: L(
      "Darajalarni ko'paytirish deb o'qidingiz: 10 · 5 = 50 va 3 · 5 = 15. Daraja bu asosni o'ziga ko'paytirish.",
      'Ты прочитал степени как умножение: 10 · 5 = 50 и 3 · 5 = 15. А степень это умножение основания само на себя.',
      'The powers were read as multiplications: 10 · 5 = 50 and 3 · 5 = 15. A power multiplies the base by itself.') },
    { when: (s) => s.value === 0, text: L(
      "Ikki darajani alohida hisoblang: 100000 va 243. Ular teng emas.",
      'Посчитай две степени отдельно: 100000 и 243. Они не равны.',
      'Work out the two powers separately: 100000 and 243. They are not equal.') },
  ],
  wrongText: L(
    "10⁵ nechta nol beradi? 3⁵ nechta uchlikdan iborat? Ikkovini hisoblab ayiring.",
    'Сколько нулей даёт 10⁵? Из скольких троек состоит 3⁵? Посчитай обе и вычти.',
    'How many zeros does 10⁵ give? How many threes make 3⁵? Work both out and subtract.'),
};

export default function D13_09(props) { return <TypeValue data={DATA} {...props} />; }
