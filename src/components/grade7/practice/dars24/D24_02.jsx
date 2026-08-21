// Dars24 · Amaliyot 02 — Uchinchi had xato · 🟢 · fix · tag: div_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 2-o'rin.
// Chuqur yechim: (24m⁴ − 18m³ + 6m²) : 6m² = 4m² − 3m + 6
//   4m² TO'G'RI, −3m TO'G'RI, +6 NOTO'G'RI: 6m² : 6m² = 1, 6 emas.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'div_fix', level: '🟢',
  eyebrow: L('Xato had', 'Неверный член', 'The wrong term'),
  setup: L(
    "Boshqa o'quvchi uch hadni bo'ldi. Ikkitasi to'g'ri, bittasi noto'g'ri: bir xil hadni o'ziga bo'lsa nima chiqadi?",
    'Другой ученик разделил три члена. Два верных, один неверный: что выходит, если разделить член на такой же член?',
    'Another pupil divided three terms. Two are right, one is wrong: what do you get dividing a term by itself?'),
  given: [['(24m⁴', '−', '18m³', '+', '6m²)', ':', '6m²']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("Javobdagi NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член в ответе.', 'Mark the WRONG term in the answer.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: '4m²' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't2', v: '3m' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '6' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. 6m² : 6m² = 1: sonlar teng, ko'rsatkichlar ham teng. Javob 4m² − 3m + 1.",
    'Верно. 6m² : 6m² = 1: числа равны и показатели равны. Ответ 4m² − 3m + 1.',
    'Correct. 6m² : 6m² = 1: equal numbers, equal exponents. The answer is 4m² − 3m + 1.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "4m² to'g'ri: 24 : 6 = 4 va 4 − 2 = 2.",
      '4m² верно: 24 : 6 = 4 и 4 − 2 = 2.',
      '4m² is right: 24 : 6 = 4 and 4 − 2 = 2.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "3m ham to'g'ri: 18 : 6 = 3 va 3 − 2 = 1, ya'ni m birinchi darajada.",
      '3m тоже верно: 18 : 6 = 3 и 3 − 2 = 1, значит m в первой степени.',
      '3m is right too: 18 : 6 = 3 and 3 − 2 = 1, so m to the first power.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Uchinchi hadni tekshiring: 6m² ni 6m² ga bo'lsa nima chiqadi?",
      'Проверь третий член: что выходит при делении 6m² на 6m²?',
      'Check the third term: what does 6m² divided by 6m² give?') },
  ],
  wrongText: L(
    "Har hadni alohida bo'lib ko'ring: son bo'linadi, ko'rsatkich ayiriladi.",
    'Раздели каждый член по отдельности: число делится, показатель вычитается.',
    'Divide each term separately: the number divides, the exponent subtracts.'),
};

export default function D24_02(props) { return <TapTerms data={DATA} {...props} />; }
