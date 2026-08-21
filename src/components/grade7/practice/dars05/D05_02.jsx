// Dars05 · Amaliyot 02 — Manfiy son bilan · 🟢 · tag: minus_bracket_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): uch xonali hadlar, ishora saqlandi.
//
// −240 − (60 − 130). Qavs ichi: 60 − 130 = −70. Manfiy sonni ayirish esa
// qo'shishga aylanadi: −240 − (−70) = −240 + 70 = −170.
// Qavsni ochib ham o'sha: −240 − 60 + 130 = −170.
// Eng ko'p uchraydigan xato: −240 − 60 − 130 = −430 (ikkinchi ishora
// o'zgarmagan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'minus_bracket_value', level: '🟢', allowNeg: true, target: -170,
  eyebrow: L('Qiymatni topish', 'Найти значение', 'Find the value'),
  setup: L(
    "Ikki yo'l bor: qavs ichini hisoblash yoki qavsni ochish. Ikkisi ham bir xil javob berishi kerak.",
    'Есть два пути: посчитать скобку или раскрыть её. Оба должны дать один ответ.',
    'There are two ways: work out the bracket or open it. Both must give the same answer.'),
  expr: ['−240', '−', '(', '60', '−', '130', ')'], exprSize: 30,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. Qavs ichi 60 − 130 = −70, manfiy sonni ayirish qo'shishga aylanadi: −240 + 70 = −170. Qavsni ochib ham o'sha: −240 − 60 + 130.",
    'Верно. В скобке 60 − 130 = −70, а вычитание отрицательного превращается в сложение: −240 + 70 = −170. Через раскрытие то же: −240 − 60 + 130.',
    'Correct. The bracket gives 60 − 130 = −70, and subtracting a negative turns into adding: −240 + 70 = −170. Opening the bracket gives the same: −240 − 60 + 130.'),
  wrongs: [
    { when: (s) => s.value === -430, text: L(
      "−430 bu −240 − 60 − 130: ikkinchi hadning ishorasi o'zgarmagan. Minus qavs ichidagi ikkisiga ham tegishli.",
      '−430 это −240 − 60 − 130: у второго слагаемого знак не поменялся. Минус относится к обоим числам в скобке.',
      '−430 is −240 − 60 − 130: the second term kept its sign. The minus applies to both numbers in the bracket.') },
    { when: (s) => s.value === -310, text: L(
      "Qavs ichi manfiy son berdi: 60 − 130 = −70. Uni ayirganda son KATTALASHADI, kichraymaydi.",
      'В скобке получилось отрицательное число: 60 − 130 = −70. При его вычитании число УВЕЛИЧИВАЕТСЯ, а не уменьшается.',
      'The bracket gave a negative number: 60 − 130 = −70. Subtracting it makes the number BIGGER, not smaller.') },
    { when: (s) => s.value === 170, text: L(
      "Ishorani tekshiring: birinchi son −240, ya'ni javob ham manfiy tomonda qoladi.",
      'Проверь знак: первое число −240, значит ответ остаётся в отрицательной стороне.',
      'Check the sign: the first number is −240, so the answer stays on the negative side.') },
  ],
  wrongText: L(
    "Avval qavs ichini hisoblang: 60 − 130 = −70. Keyin −240 dan −70 ni ayiring.",
    'Сначала посчитай скобку: 60 − 130 = −70. Потом вычти −70 из −240.',
    'First work out the bracket: 60 − 130 = −70. Then take −70 from −240.'),
};

export default function D05_02(props) { return <TypeValue data={DATA} {...props} />; }
