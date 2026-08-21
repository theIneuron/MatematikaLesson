// Dars03 · Amaliyot 02 — Qaysi amal qulay · 🟢 · tag: pick_handy_step
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): uchinchi ko'paytiruvchi
// uch xonali, javob esa olti xonali.
//
// 8 · 125 · 297. Uch variant ham qoida bo'yicha to'g'ri, savol qulaylikda:
//   8 · 125 = 1000    -> keyin 1000 · 297 = 297000, og'zaki
//   125 · 297 = 37125 -> keyin uni 8 ga ko'paytirish kerak
//   8 · 297 = 2376    -> keyin 2376 · 125, eng uzun yo'l
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'pick_handy_step', level: '🟢',
  eyebrow: L('Qulay qadam', 'Удобный шаг', 'The handy step'),
  setup: L(
    "Uchta ko'paytirishning tartibini o'zimiz tanlaymiz: qiymat o'zgarmaydi. Lekin bitta juftlik mingga aylanadi va qolgan ishni og'zaki qiladi.",
    'Порядок трёх умножений выбираем сами: значение не изменится. Но одна пара даёт тысячу и делает остальное устным.',
    'We choose the order of the three multiplications: the value will not change. But one pair makes a thousand and the rest becomes mental.'),
  expr: ['8', '·', '125', '·', '297'], exprSize: 30,
  ask: L('Qaysi amalni birinchi qilish qulay?', 'Какое действие удобно сделать первым?', 'Which step is handy to do first?'),
  opts: [{ label: ['8', '·', '125'] }, { label: ['125', '·', '297'] }, { label: ['8', '·', '297'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. 8 · 125 = 1000, keyin 1000 · 297 = 297000. Mingga ko'paytirish -- uchta nol qo'shish, xolos.",
    'Верно. 8 · 125 = 1000, затем 1000 · 297 = 297000. Умножить на тысячу — это просто приписать три нуля.',
    'Correct. 8 · 125 = 1000, then 1000 · 297 = 297000. Multiplying by a thousand is just adding three zeros.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "125 · 297 = 37125 -- qoida buzilmadi, lekin besh xonali sonni yana 8 ga ko'paytirish kerak bo'ladi.",
      '125 · 297 = 37125 — правило не нарушено, но пятизначное число придётся ещё умножать на 8.',
      '125 · 297 = 37125 — the rule is not broken, but a five-digit number still has to be multiplied by 8.') },
    { when: (s) => s.picked === 2, text: L(
      "8 · 297 = 2376 -- bu shunchaki chapdan o'ngga hisoblash. 2376 ni 125 ga ko'paytirish eng uzun yo'l.",
      '8 · 297 = 2376 — это просто счёт слева направо. Умножать 2376 на 125 — самый долгий путь.',
      '8 · 297 = 2376 — that is just counting left to right. Multiplying 2376 by 125 is the longest path.') },
  ],
  wrongText: L(
    "Mingga aylanadigan juftlikni qidiring: 125 ni nechaga ko'paytirsa ming chiqadi?",
    'Ищи пару, которая даёт тысячу: на что умножить 125, чтобы вышла тысяча?',
    'Look for the pair that makes a thousand: what times 125 gives a thousand?'),
};

export default function D03_02(props) { return <Choice data={DATA} {...props} />; }
