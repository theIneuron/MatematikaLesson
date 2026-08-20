// Dars03 · Amaliyot 02 — Qaysi amal qulay · 🟢 · tag: pick_handy_step
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// 4 · 17 · 25. Uchta variant ham QOIDA bo'yicha to'g'ri: ko'paytirishda
// o'rin almashtirish qiymatni o'zgartirmaydi. Savol boshqa: qaysi biri
// ishni yengillashtiradi. 4 · 25 = 100 yumaloq son beradi, qolganlari esa
// uch xonali sonlarni ko'paytirishga olib boradi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'pick_handy_step', level: '🟢',
  eyebrow: L('Qulay qadam', 'Удобный шаг', 'The handy step'),
  setup: L(
    "Uchta ko'paytirishning tartibini o'zimiz tanlashimiz mumkin: qiymat o'zgarmaydi. Lekin ish hajmi o'zgaradi.",
    'Порядок трёх умножений мы выбираем сами: значение не изменится. А объём работы изменится.',
    'We choose the order of the three multiplications ourselves: the value will not change. The amount of work will.'),
  expr: ['4', '·', '17', '·', '25'], exprSize: 34,
  ask: L('Qaysi amalni birinchi qilish qulay?', 'Какое действие удобно сделать первым?', 'Which step is handy to do first?'),
  opts: [{ label: ['4', '·', '25'] }, { label: ['17', '·', '25'] }, { label: ['4', '·', '17'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. 4 · 25 = 100, keyin 100 · 17 = 1700. Yumaloq son ikkinchi amalni og'zaki qiladi.",
    'Верно. 4 · 25 = 100, затем 100 · 17 = 1700. Круглое число делает второе действие устным.',
    'Correct. 4 · 25 = 100, then 100 · 17 = 1700. A round number makes the second step a mental one.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "17 · 25 = 425 -- qoida buzilmadi, lekin keyin 425 ni 4 ga ko'paytirish kerak. Yumaloq son bermaydigan juftlik tanlangan.",
      '17 · 25 = 425 — правило не нарушено, но потом 425 надо умножать на 4. Выбрана пара, которая не даёт круглого числа.',
      '17 · 25 = 425 — the rule is not broken, but then 425 has to be multiplied by 4. The pair chosen gives no round number.') },
    { when: (s) => s.picked === 2, text: L(
      "4 · 17 = 68 -- bu shunchaki chapdan o'ngga hisoblash. 68 ni 25 ga ko'paytirish esa 4 · 25 dan qiyin.",
      '4 · 17 = 68 — это просто счёт слева направо. А 68 умножить на 25 труднее, чем 4 на 25.',
      '4 · 17 = 68 — that is just counting left to right. And 68 times 25 is harder than 4 times 25.') },
  ],
  wrongText: L(
    "Yumaloq son beradigan juftlikni qidiring: 4 · 25 = 100.",
    'Ищи пару, которая даёт круглое число: 4 · 25 = 100.',
    'Look for the pair that gives a round number: 4 · 25 = 100.'),
};

export default function D03_02(props) { return <Choice data={DATA} {...props} />; }
