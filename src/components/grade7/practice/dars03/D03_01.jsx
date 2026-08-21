// Dars03 · Amaliyot 01 — Qulay tartibda hisoblash · 🟢 · tag: regroup_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 20 · 43 · 5. Chapdan o'ngga hisoblash mumkin (20 · 43 = 860, keyin · 5),
// lekin ko'paytiruvchilarning o'rnini almashtirsa ish yengillashadi:
//   20 · 5 = 100,  100 · 43 = 4300
// Darsning fikri aynan shu: QIYMAT o'zgarmaydi, MEHNAT o'zgaradi.
//
// SONLAR nazariyadagidan BOSHQA (metodist savoli 2026-08-21): darsda
// 4 · 25 · 37 = 3700 misoli ekranda javobi bilan turadi, uni amaliyotga
// ko'chirsa tekshiruv eslab qolishga aylanadi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'regroup_value', level: '🟢', allowNeg: false, target: 4300,
  eyebrow: L('Qulay tartib', 'Удобный порядок', 'A handy order'),
  setup: L(
    "Ko'paytiruvchilarning o'rnini almashtirish qiymatni o'zgartirmaydi. Yumaloq son beradigan juftlikni topib, avval uni hisoblang.",
    'Перестановка множителей не меняет значение. Найди пару, которая даёт круглое число, и посчитай её первой.',
    'Swapping factors does not change the value. Find the pair that gives a round number and work it out first.'),
  expr: ['20', '·', '43', '·', '5'], exprSize: 34,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. 20 · 5 = 100, keyin 100 · 43 = 4300. Chapdan o'ngga hisoblasa ham javob o'sha, lekin ish ko'p.",
    'Верно. 20 · 5 = 100, затем 100 · 43 = 4300. Слева направо ответ тот же, но работы больше.',
    'Correct. 20 · 5 = 100, then 100 · 43 = 4300. Left to right gives the same answer with more work.'),
  wrongs: [
    { when: (s) => s.value === 860, text: L(
      "860 bu 20 · 43, ya'ni ish oxirigacha yetmagan: uchinchi ko'paytiruvchi 5 qoldi.",
      '860 это 20 · 43, работа не доведена до конца: остался третий множитель, 5.',
      '860 is 20 · 43, the work is not finished: the third factor, 5, is still there.') },
    { when: (s) => s.value === 430 || s.value === 43000, text: L(
      "100 ni 43 ga ko'paytiring: yuzga ko'paytirganda son ortiga IKKI nol qo'shiladi, 4300.",
      'Умножь 100 на 43: при умножении на сто приписываются ДВА нуля, 4300.',
      'Multiply 100 by 43: multiplying by a hundred adds TWO zeros, 4300.') },
    { when: (s) => s.value === 68, text: L(
      "Bu yozuvda ko'paytirish bor, qo'shish emas: 20 · 5 · 43.",
      'В этой записи умножение, а не сложение: 20 · 5 · 43.',
      'This record has multiplication, not addition: 20 · 5 · 43.') },
  ],
  wrongText: L(
    "Avval 20 ni 5 ga ko'paytiring, yuz chiqadi. Keyin yuzni 43 ga ko'paytirish oson.",
    'Сначала умножь 20 на 5, получится сто. А сотню на 43 умножить легко.',
    'First multiply 20 by 5, that makes a hundred. A hundred times 43 is easy.'),
};

export default function D03_01(props) { return <TypeValue data={DATA} {...props} />; }
