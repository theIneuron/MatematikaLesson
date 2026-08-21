// Dars24 · Amaliyot 09 — Uch had, oxirgisi bir · 🔴 · build · tag: div_build_three
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// (48z⁵ − 36z⁴ + 12z³) : 12z³ = 4z² − 3z + 1.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'div_build_three', level: '🔴',
  eyebrow: L("Uch bo'linma", 'Три частных', 'Three quotients'),
  setup: L(
    "Uch hadning uchtasi ham bo'linadi. Oxirgi had bo'luvchi bilan teng, ya'ni uning bo'linmasi bir.",
    'Делятся все три члена. Последний равен делителю, значит его частное равно единице.',
    'All three terms are divided. The last equals the divisor, so its quotient is one.'),
  expr: ['(48z⁵', '−', '36z⁴', '+', '12z³)', ':', '12z³'], exprSize: 24,
  cards: [
    { id: 'a', label: '4z²' },
    { id: 'b', label: '−3z' },
    { id: 'c', label: '+1' },
    { id: 'd', label: '+12' },
    { id: 'e', label: '−3z²' },
    { id: 'f', label: '4z³' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 48 : 12 = 4 va 5 − 3 = 2; 36 : 12 = 3 va 4 − 3 = 1; 12 : 12 = 1 va 3 − 3 = 0.",
    'Верно. 48 : 12 = 4 и 5 − 3 = 2; 36 : 12 = 3 и 4 − 3 = 1; 12 : 12 = 1 и 3 − 3 = 0.',
    'Correct. 48 : 12 = 4 and 5 − 3 = 2; 36 : 12 = 3 and 4 − 3 = 1; 12 : 12 = 1 and 3 − 3 = 0.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "+12 da bo'lish bajarilmagan: 12z³ : 12z³ = 1.",
      'В +12 деление не выполнено: 12z³ : 12z³ = 1.',
      'In +12 the division was skipped: 12z³ : 12z³ = 1.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "36z⁴ : 12z³ da 4 − 3 = 1, ya'ni z birinchi darajada: −3z.",
      'В 36z⁴ : 12z³ выходит 4 − 3 = 1, значит z в первой степени: −3z.',
      'In 36z⁴ : 12z³ we get 4 − 3 = 1, so z to the first power: −3z.') },
    { when: (s) => s.seq.indexOf('f') !== -1, text: L(
      "48z⁵ : 12z³ da 5 − 3 = 2, ya'ni 4z².",
      'В 48z⁵ : 12z³ выходит 5 − 3 = 2, значит 4z².',
      'In 48z⁵ : 12z³ we get 5 − 3 = 2, so 4z².') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch had bo'ladi, oxirgisi bir. Bir ham yoziladi.",
      'В ответе три члена, последний это единица. Единицу тоже пишут.',
      'The answer has three terms and the last is one. That one is written too.') },
  ],
  wrongText: L(
    "Uch hadni alohida bo'ling, ishoralarni saqlang. Oxirgi bo'linma bir chiqadi.",
    'Раздели три члена по отдельности, сохраняя знаки. Последнее частное равно единице.',
    'Divide the three terms separately, keeping the signs. The last quotient is one.'),
};

export default function D24_09(props) { return <BuildLine data={DATA} {...props} />; }
