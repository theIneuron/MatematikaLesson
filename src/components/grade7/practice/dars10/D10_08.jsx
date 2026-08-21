// Dars10 · Amaliyot 08 — Modul va minus · 🔴 · tag: mod_outside_minus
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// Modul BELGISI ichidagi ishorani yo'qotadi, lekin modul TASHQARISIDAGI
// minus o'z joyida qoladi:
//   −|−9| = −9   to'g'ri
//   |−9| = −9    xato: modul manfiy bo'lolmaydi
//   −|9| = 9     xato: tashqaridagi minus yo'qolmaydi
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_outside_minus', level: '🔴', optCols: 3,
  eyebrow: L('Modul va minus', 'Модуль и минус', 'The modulus and the minus'),
  setup: L(
    "Modul ichidagi ishorani yo'qotadi. Lekin modul tashqarisidagi minus modulga tegishli emas -- u o'z joyida qoladi.",
    'Модуль убирает знак того, что стоит внутри. А минус вне модуля к нему не относится — он остаётся на месте.',
    'A modulus removes the sign of what is inside. But a minus outside the modulus does not belong to it — it stays.'),
  ask: L("Qaysi tenglik to'g'ri?", 'Какое равенство верно?', 'Which equality is correct?'),
  opts: [
    { label: ['−|−9|', '=', '−9'] },
    { label: ['|−9|', '=', '−9'] },
    { label: ['−|9|', '=', '9'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. |−9| = 9, keyin oldidagi minus qoladi: −9. Modul ichini musbat qildi, tashqaridagi minus esa ishlashda davom etdi.",
    'Верно. |−9| = 9, а стоящий перед ним минус остаётся: −9. Модуль сделал внутреннее положительным, а внешний минус продолжил действовать.',
    'Correct. |−9| = 9, and the minus in front stays: −9. The modulus made the inside positive while the outer minus kept acting.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Modulning qiymati manfiy bo'lmaydi: |−9| = 9. Modul ichidagi minusni yo'qotadi.",
      'Значение модуля не бывает отрицательным: |−9| = 9. Модуль убирает минус внутри.',
      'A modulus is never negative: |−9| = 9. The modulus removes the minus inside.') },
    { when: (s) => s.picked === 2, text: L(
      "Tashqaridagi minus yo'qolmaydi: |9| = 9, ya'ni −|9| = −9.",
      'Внешний минус не исчезает: |9| = 9, значит −|9| = −9.',
      'The outer minus does not vanish: |9| = 9, so −|9| = −9.') },
  ],
  wrongText: L(
    "Avval modulni hisoblang, keyin tashqaridagi ishorani qo'ying.",
    'Сначала посчитай модуль, потом поставь знак, который стоит снаружи.',
    'Work out the modulus first, then apply the sign that stands outside.'),
};

export default function D10_08(props) { return <Choice data={DATA} {...props} />; }
