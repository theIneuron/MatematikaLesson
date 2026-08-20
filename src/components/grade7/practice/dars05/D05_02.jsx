// Dars05 · Amaliyot 02 — Manfiy son bilan · 🟢 · tag: minus_bracket_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// −18 − (5 − 11). Qavs ichi: 5 − 11 = −6. Manfiy sonni ayirish esa qo'shishga
// aylanadi: −18 − (−6) = −18 + 6 = −12.
// Qavsni ochib ham o'sha: −18 − 5 + 11 = −12.
// Eng ko'p uchraydigan xato: −18 − 5 − 11 = −34 (ikkinchi ishora o'zgarmagan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'minus_bracket_value', level: '🟢', allowNeg: true, target: -12,
  eyebrow: L('Qiymatni topish', 'Найти значение', 'Find the value'),
  setup: L(
    "Ikki yo'l bor: qavs ichini hisoblash yoki qavsni ochish. Ikkisi ham bir xil javob berishi kerak.",
    'Есть два пути: посчитать скобку или раскрыть её. Оба должны дать один ответ.',
    'There are two ways: work out the bracket or open it. Both must give the same answer.'),
  expr: ['−18', '−', '(', '5', '−', '11', ')'], exprSize: 32,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. Qavs ichi 5 − 11 = −6, manfiy sonni ayirish qo'shishga aylanadi: −18 + 6 = −12. Qavsni ochib ham o'sha: −18 − 5 + 11.",
    'Верно. В скобке 5 − 11 = −6, а вычитание отрицательного превращается в сложение: −18 + 6 = −12. Через раскрытие то же: −18 − 5 + 11.',
    'Correct. The bracket gives 5 − 11 = −6, and subtracting a negative turns into adding: −18 + 6 = −12. Opening the bracket gives the same: −18 − 5 + 11.'),
  wrongs: [
    { when: (s) => s.value === -34, text: L(
      "−34 bu −18 − 5 − 11: ikkinchi hadning ishorasi o'zgarmagan. Minus qavs ichidagi ikkisiga ham tegishli.",
      '−34 это −18 − 5 − 11: у второго слагаемого знак не поменялся. Минус относится к обоим числам в скобке.',
      '−34 is −18 − 5 − 11: the second term kept its sign. The minus applies to both numbers in the bracket.') },
    { when: (s) => s.value === -24, text: L(
      "Qavs ichi manfiy son berdi: 5 − 11 = −6. Uni ayirganda son KATTALASHADI, kichraymaydi.",
      'В скобке получилось отрицательное число: 5 − 11 = −6. При его вычитании число УВЕЛИЧИВАЕТСЯ, а не уменьшается.',
      'The bracket gave a negative number: 5 − 11 = −6. Subtracting it makes the number BIGGER, not smaller.') },
    { when: (s) => s.value === 12, text: L(
      "Ishorani tekshiring: birinchi son −18, ya'ni javob ham manfiy tomonda qoladi.",
      'Проверь знак: первое число −18, значит ответ остаётся в отрицательной стороне.',
      'Check the sign: the first number is −18, so the answer stays on the negative side.') },
  ],
  wrongText: L(
    "Avval qavs ichini hisoblang: 5 − 11 = −6. Keyin −18 dan −6 ni ayiring.",
    'Сначала посчитай скобку: 5 − 11 = −6. Потом вычти −6 из −18.',
    'First work out the bracket: 5 − 11 = −6. Then take −6 from −18.'),
};

export default function D05_02(props) { return <TypeValue data={DATA} {...props} />; }
