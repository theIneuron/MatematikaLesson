// Dars03 · Amaliyot 01 — Qulay tartibda hisoblash · 🟢 · tag: regroup_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 25 · 37 · 4. Chapdan o'ngga hisoblash mumkin (25 · 37 = 925, keyin · 4),
// lekin ko'paytiruvchilarning o'rnini almashtirsa ish yengillashadi:
//   25 · 4 = 100,  100 · 37 = 3700
// Darsning fikri aynan shu: QIYMAT o'zgarmaydi, MEHNAT o'zgaradi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'regroup_value', level: '🟢', allowNeg: false, target: 3700,
  eyebrow: L('Qulay tartib', 'Удобный порядок', 'A handy order'),
  setup: L(
    "Ko'paytiruvchilarning o'rnini almashtirish qiymatni o'zgartirmaydi. Yumaloq son beradigan juftlikni topib, avval uni hisoblang.",
    'Перестановка множителей не меняет значение. Найди пару, которая даёт круглое число, и посчитай её первой.',
    'Swapping factors does not change the value. Find the pair that gives a round number and work it out first.'),
  expr: ['25', '·', '37', '·', '4'], exprSize: 34,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 25 · 4 = 100, keyin 100 · 37 = 3700. Chapdan o'ngga hisoblasa ham javob o'sha, lekin ish ko'p.",
    'Верно. 25 · 4 = 100, затем 100 · 37 = 3700. Слева направо ответ тот же, но работы больше.',
    'Correct. 25 · 4 = 100, then 100 · 37 = 3700. Left to right gives the same answer with more work.'),
  wrongs: [
    { when: (s) => s.value === 925, text: L(
      "925 bu 25 · 37, ya'ni ish oxirigacha yetmagan: uchinchi ko'paytiruvchi 4 qoldi.",
      '925 это 25 · 37, работа не доведена до конца: остался третий множитель, 4.',
      '925 is 25 · 37, the work is not finished: the third factor, 4, is still there.') },
    { when: (s) => s.value === 3600 || s.value === 3800, text: L(
      "100 ni 37 ga ko'paytiring: yuzga ko'paytirganda son ortiga ikki nol qo'shiladi.",
      'Умножь 100 на 37: при умножении на сто к числу приписываются два нуля.',
      'Multiply 100 by 37: multiplying by a hundred adds two zeros to the number.') },
    { when: (s) => s.value === 66, text: L(
      "Bu yozuvda ko'paytirish bor, qo'shish emas: 25 · 4 · 37.",
      'В этой записи умножение, а не сложение: 25 · 4 · 37.',
      'This record has multiplication, not addition: 25 · 4 · 37.') },
  ],
  wrongText: L(
    "Avval 25 ni 4 ga ko'paytiring, yuz chiqadi. Keyin yuzni 37 ga ko'paytirish oson.",
    'Сначала умножь 25 на 4, получится сто. А сотню на 37 умножить легко.',
    'First multiply 25 by 4, that makes a hundred. A hundred times 37 is easy.'),
};

export default function D03_01(props) { return <TypeValue data={DATA} {...props} />; }
