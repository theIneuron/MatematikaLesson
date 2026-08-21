// Dars38 · Amaliyot 03 — Javobni juftlik qilib yozish · 🟢 · bracket · tag: sys_pair
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 3-o'rin.
// x = 5, y = −2 -> yechim (5; −2). Tartib: avval x, keyin y.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_pair', level: '🟢',
  eyebrow: L('Javob juftlik', 'Ответ это пара', 'The answer is a pair'),
  setup: L(
    "Sistemaning javobi bitta son emas, JUFTLIK. Uni qavs ichida yozadilar: avval x, keyin y.",
    'Ответ системы это не одно число, а ПАРА. Её пишут в скобках: сначала x, потом y.',
    'A system answers with a PAIR, not a single number. Write it in brackets: x first, then y.'),
  given: [['x', '=', '5'], ['y', '=', '−2']],
  givenLabel: L('Topildi:', 'Найдено:', 'Found:'),
  cards: [
    { id: 'a', label: '(5;' },
    { id: 'b', label: '−2)' },
    { id: 'c', label: '(−2;' },
    { id: 'd', label: '5)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Yechimni juftlik qilib yozing", 'Запиши решение парой', 'Write the solution as a pair'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (5; −2): birinchi o'rinda x, ikkinchisida y.",
    'Верно. (5; −2): на первом месте x, на втором y.',
    'Correct. (5; −2): x first, y second.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Tartib buzildi: (−2; 5) boshqa juftlik, u sistemani bajarmaydi.",
      'Порядок нарушен: (−2; 5) это другая пара, она системе не подходит.',
      'The order is broken: (−2; 5) is a different pair and does not fit.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Juftlik ikki bo'lakdan iborat.",
      'Пара состоит из двух частей.',
      'A pair has two parts.') },
  ],
  wrongText: L(
    "Juftlikda qaysi harf birinchi yoziladi?",
    'Какая буква пишется в паре первой?',
    'Which letter comes first in a pair?'),
};

export default function D38_03(props) { return <BuildLine data={DATA} {...props} />; }
