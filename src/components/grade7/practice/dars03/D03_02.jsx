// Dars03 · Amaliyot 02 — Qaysi amal qulay · 🟢 · tag: pick_handy_step
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// 8 · 29 · 125. Uchta variant ham QOIDA bo'yicha to'g'ri: ko'paytirishda
// o'rin almashtirish qiymatni o'zgartirmaydi. Savol boshqa: qaysi biri
// ishni yengillashtiradi. 8 · 125 = 1000 yumaloq son beradi, qolganlari esa
// katta sonlarni ko'paytirishga olib boradi.
//
// Sonlar nazariyadagidan boshqa: darsda 4 · 25 = 100 juftligi ko'rsatilgan.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'pick_handy_step', level: '🟢',
  eyebrow: L('Qulay qadam', 'Удобный шаг', 'The handy step'),
  setup: L(
    "Uchta ko'paytirishning tartibini o'zimiz tanlashimiz mumkin: qiymat o'zgarmaydi. Lekin ish hajmi o'zgaradi.",
    'Порядок трёх умножений мы выбираем сами: значение не изменится. А объём работы изменится.',
    'We choose the order of the three multiplications ourselves: the value will not change. The amount of work will.'),
  expr: ['8', '·', '29', '·', '125'], exprSize: 32,
  ask: L('Qaysi amalni birinchi qilish qulay?', 'Какое действие удобно сделать первым?', 'Which step is handy to do first?'),
  opts: [{ label: ['8', '·', '125'] }, { label: ['29', '·', '125'] }, { label: ['8', '·', '29'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. 8 · 125 = 1000, keyin 1000 · 29 = 29000. Yumaloq son ikkinchi amalni og'zaki qiladi.",
    'Верно. 8 · 125 = 1000, затем 1000 · 29 = 29000. Круглое число делает второе действие устным.',
    'Correct. 8 · 125 = 1000, then 1000 · 29 = 29000. A round number makes the second step a mental one.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "29 · 125 = 3625 -- qoida buzilmadi, lekin keyin 3625 ni 8 ga ko'paytirish kerak. Yumaloq son bermaydigan juftlik tanlangan.",
      '29 · 125 = 3625 — правило не нарушено, но потом 3625 надо умножать на 8. Выбрана пара, которая не даёт круглого числа.',
      '29 · 125 = 3625 — the rule is not broken, but then 3625 has to be multiplied by 8. The pair chosen gives no round number.') },
    { when: (s) => s.picked === 2, text: L(
      "8 · 29 = 232 -- bu shunchaki chapdan o'ngga hisoblash. 232 ni 125 ga ko'paytirish esa 8 · 125 dan qiyin.",
      '8 · 29 = 232 — это просто счёт слева направо. А 232 умножить на 125 труднее, чем 8 на 125.',
      '8 · 29 = 232 — that is just counting left to right. And 232 times 125 is harder than 8 times 125.') },
  ],
  wrongText: L(
    "Yumaloq son beradigan juftlikni qidiring: 8 · 125 = 1000.",
    'Ищи пару, которая даёт круглое число: 8 · 125 = 1000.',
    'Look for the pair that gives a round number: 8 · 125 = 1000.'),
};

export default function D03_02(props) { return <Choice data={DATA} {...props} />; }
