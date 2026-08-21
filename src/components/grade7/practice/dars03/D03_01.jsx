// Dars03 · Amaliyot 01 — Qulay tartibda hisoblash · 🟢 · tag: regroup_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21: «amaliyotlar 5-6 sinfda
// o'tilganidan qiyinroq bo'lishi kerak»). Xossaning o'zi o'sha, lekin sonlar
// 7-sinfning: manfiy ko'paytuvchi va o'nli kasr.
//
// −20 · 4,3 · 5. Ko'paytiruvchilarning o'rnini almashtirsak:
//   −20 · 5 = −100,  −100 · 4,3 = −430
// Ikki narsani birga ushlash kerak: yumaloq juftlik VA ishora.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'regroup_value', level: '🟢', allowNeg: true, target: -430,
  eyebrow: L('Qulay tartib', 'Удобный порядок', 'A handy order'),
  setup: L(
    "Ko'paytiruvchilarning o'rnini almashtirish qiymatni o'zgartirmaydi. Yumaloq son beradigan juftlikni topib, avval uni hisoblang -- va ishorani yo'qotmang.",
    'Перестановка множителей не меняет значение. Найди пару, которая даёт круглое число, и посчитай её первой — и не потеряй знак.',
    'Swapping factors does not change the value. Find the pair that gives a round number and work it out first — and keep the sign.'),
  expr: ['−20', '·', '4,3', '·', '5'], exprSize: 32,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. −20 · 5 = −100, keyin −100 · 4,3 = −430. Manfiy ko'paytuvchi bitta, ya'ni javob manfiy.",
    'Верно. −20 · 5 = −100, затем −100 · 4,3 = −430. Отрицательный множитель один, значит ответ отрицательный.',
    'Correct. −20 · 5 = −100, then −100 · 4,3 = −430. There is one negative factor, so the answer is negative.'),
  wrongs: [
    { when: (s) => s.value === 430, text: L(
      "Ishora yo'qoldi: manfiy ko'paytuvchi bitta, ya'ni ko'paytma ham manfiy bo'ladi.",
      'Потерялся знак: отрицательный множитель один, значит и произведение отрицательное.',
      'The sign got lost: there is one negative factor, so the product is negative too.') },
    { when: (s) => s.value === -86 || s.value === 86, text: L(
      "−86 bu −20 · 4,3, ya'ni ish oxirigacha yetmagan: uchinchi ko'paytiruvchi 5 qoldi.",
      '−86 это −20 · 4,3, работа не доведена до конца: остался третий множитель, 5.',
      '−86 is −20 · 4,3, the work is not finished: the third factor, 5, is still there.') },
    { when: (s) => s.value === -43 || s.value === -4300, text: L(
      "−100 ni 4,3 ga ko'paytiring: o'nli kasrni yuzga ko'paytirsa vergul ikki xona o'ngga ko'chadi, 430.",
      'Умножь −100 на 4,3: при умножении на сто запятая уходит на два разряда вправо, 430.',
      'Multiply −100 by 4,3: multiplying by a hundred moves the comma two places right, 430.') },
  ],
  wrongText: L(
    "Avval −20 ni 5 ga ko'paytiring, minus yuz chiqadi. Keyin uni 4,3 ga ko'paytirish oson.",
    'Сначала умножь −20 на 5, получится минус сто. А сотню на 4,3 умножить легко.',
    'First multiply −20 by 5, that makes minus a hundred. A hundred times 4,3 is easy.'),
};

export default function D03_01(props) { return <TypeValue data={DATA} {...props} />; }
