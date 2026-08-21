// Dars03 · Amaliyot 01 — Qulay tartibda hisoblash · 🟢 · tag: regroup_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA IKKI MARTA KO'TARILDI (metodist qarori 2026-08-21: sonlar ham
// uch-besh xonali bo'lishi kerak). Xossaning o'zi o'sha, lekin endi javob
// besh xonali va yo'lda o'nli kasr bilan ishlash bor.
//
// −2500 · 4,3 · 4. O'rin almashtirsak:
//   −2500 · 4 = −10000,  −10000 · 4,3 = −43000
// Chapdan o'ngga: −2500 · 4,3 = −10750, keyin · 4 -- ancha uzun yo'l.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'regroup_value', level: '🟢', allowNeg: true, target: -43000,
  eyebrow: L('Qulay tartib', 'Удобный порядок', 'A handy order'),
  setup: L(
    "Ko'paytiruvchilarning o'rnini almashtirish qiymatni o'zgartirmaydi. O'n mingga aylanadigan juftlikni topib, avval uni hisoblang -- va ishorani yo'qotmang.",
    'Перестановка множителей не меняет значение. Найди пару, которая даёт десять тысяч, и посчитай её первой — и не потеряй знак.',
    'Swapping factors does not change the value. Find the pair that makes ten thousand and work it out first — and keep the sign.'),
  expr: ['−2500', '·', '4,3', '·', '4'], exprSize: 30,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. −2500 · 4 = −10000, keyin −10000 · 4,3 = −43000. O'n mingga ko'paytirganda vergul to'rt xona o'ngga ko'chadi.",
    'Верно. −2500 · 4 = −10000, затем −10000 · 4,3 = −43000. При умножении на десять тысяч запятая уходит на четыре разряда вправо.',
    'Correct. −2500 · 4 = −10000, then −10000 · 4,3 = −43000. Multiplying by ten thousand moves the comma four places right.'),
  wrongs: [
    { when: (s) => s.value === 43000, text: L(
      "Ishora yo'qoldi: manfiy ko'paytuvchi bitta, ya'ni ko'paytma ham manfiy.",
      'Потерялся знак: отрицательный множитель один, значит и произведение отрицательное.',
      'The sign got lost: there is one negative factor, so the product is negative too.') },
    { when: (s) => s.value === -10750 || s.value === 10750, text: L(
      "−10750 bu −2500 · 4,3, ya'ni ish oxirigacha yetmagan: uchinchi ko'paytiruvchi 4 qoldi.",
      '−10750 это −2500 · 4,3, работа не доведена до конца: остался третий множитель, 4.',
      '−10750 is −2500 · 4,3, the work is not finished: the third factor, 4, is still there.') },
    { when: (s) => s.value === -4300 || s.value === -430000, text: L(
      "Nollarni sanang: −2500 · 4 = −10000, ya'ni to'rt nol. Undan keyin 4,3 ga ko'paytirilsa −43000 chiqadi.",
      'Посчитай нули: −2500 · 4 = −10000, то есть четыре нуля. После умножения на 4,3 выходит −43000.',
      'Count the zeros: −2500 · 4 = −10000, four zeros. Multiplying by 4,3 then gives −43000.') },
  ],
  wrongText: L(
    "Avval −2500 ni 4 ga ko'paytiring: minus o'n ming chiqadi. Keyin uni 4,3 ga ko'paytirish oson.",
    'Сначала умножь −2500 на 4: получится минус десять тысяч. Дальше умножить на 4,3 легко.',
    'First multiply −2500 by 4: that makes minus ten thousand. Then multiplying by 4,3 is easy.'),
};

export default function D03_01(props) { return <TypeValue data={DATA} {...props} />; }
