// Dars03 · Amaliyot 02 — Qaysi amal qulay · 🟢 · tag: pick_handy_step
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): o'nli kasr qo'shildi va
// yumaloq juftlik ko'zga tashlanmaydigan bo'ldi.
//
// 8 · 29 · 12,5. Uch variant ham QOIDA bo'yicha to'g'ri, savol qulaylikda:
//   8 · 12,5 = 100     -> keyin 100 · 29 = 2900, og'zaki
//   29 · 12,5 = 362,5  -> keyin uni 8 ga ko'paytirish kerak
//   8 · 29 = 232       -> keyin 232 · 12,5, ya'ni kasrga ko'paytirish
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'pick_handy_step', level: '🟢',
  eyebrow: L('Qulay qadam', 'Удобный шаг', 'The handy step'),
  setup: L(
    "Uchta ko'paytirishning tartibini o'zimiz tanlaymiz: qiymat o'zgarmaydi. Lekin bitta juftlik yumaloq son beradi va qolgan ishni og'zaki qiladi.",
    'Порядок трёх умножений выбираем сами: значение не изменится. Но одна пара даёт круглое число и делает остальное устным.',
    'We choose the order of the three multiplications: the value will not change. But one pair gives a round number and makes the rest mental.'),
  expr: ['8', '·', '29', '·', '12,5'], exprSize: 30,
  ask: L('Qaysi amalni birinchi qilish qulay?', 'Какое действие удобно сделать первым?', 'Which step is handy to do first?'),
  opts: [{ label: ['8', '·', '12,5'] }, { label: ['29', '·', '12,5'] }, { label: ['8', '·', '29'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. 8 · 12,5 = 100, keyin 100 · 29 = 2900. O'nli kasr yo'qoldi va ikkinchi amal og'zaki bo'ldi.",
    'Верно. 8 · 12,5 = 100, затем 100 · 29 = 2900. Десятичная дробь исчезла, и второе действие стало устным.',
    'Correct. 8 · 12,5 = 100, then 100 · 29 = 2900. The decimal vanished and the second step became mental.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "29 · 12,5 = 362,5 -- qoida buzilmadi, lekin kasr saqlanib qoldi va uni yana 8 ga ko'paytirish kerak.",
      '29 · 12,5 = 362,5 — правило не нарушено, но дробь осталась, и её ещё надо умножать на 8.',
      '29 · 12,5 = 362,5 — the rule is not broken, but the decimal stayed and still has to be multiplied by 8.') },
    { when: (s) => s.picked === 2, text: L(
      "8 · 29 = 232 -- bu shunchaki chapdan o'ngga hisoblash. 232 ni 12,5 ga ko'paytirish esa eng qiyin yo'l.",
      '8 · 29 = 232 — это просто счёт слева направо. А 232 умножить на 12,5 — самый трудный путь.',
      '8 · 29 = 232 — that is just counting left to right. And 232 times 12,5 is the hardest path.') },
  ],
  wrongText: L(
    "Kasrni yo'qotadigan juftlikni qidiring: 12,5 ni nechaga ko'paytirsa yuz chiqadi?",
    'Ищи пару, которая убирает дробь: на что умножить 12,5, чтобы вышло сто?',
    'Look for the pair that removes the decimal: what times 12,5 gives a hundred?'),
};

export default function D03_02(props) { return <Choice data={DATA} {...props} />; }
