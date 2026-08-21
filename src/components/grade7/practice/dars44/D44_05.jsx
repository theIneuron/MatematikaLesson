// Dars44 · Amaliyot 05 — Uch qadam · 🟡 · order · tag: iso_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 5-o'rin.
// Uchi 36° -> 180 − 36 = 144 -> 144 : 2 = 72°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_order', level: '🟡',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "Uchidagi burchakdan asos burchaklarini topish ikki amalda bo'ladi: ayirish, keyin ikkiga bo'lish.",
    'Найти углы при основании по углу при вершине можно двумя действиями: вычитание, потом деление на два.',
    'Finding the base angles from the apex takes two actions: subtract, then halve.'),
  given: [['uchi', '=', '36°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '180° − 36°' },
    { id: 'b', label: '144° : 2' },
    { id: 'c', label: '72°' },
    { id: 'd', label: '144°' },
    { id: 'e', label: '36° : 2' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 180 − 36 = 144, keyin 144 : 2 = 72. Ikki asos burchagi 72° bo'ladi.",
    'Верно. 180 − 36 = 144, потом 144 : 2 = 72. Оба угла при основании по 72°.',
    'Correct. 180 − 36 = 144, then 144 : 2 = 72. Both base angles are 72°.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Uchidagi burchakni ikkiga bo'lish kerak emas: bo'linadigan narsa QOLGAN 144 gradus.",
      'Угол при вершине делить не нужно: делится ОСТАВШИЕСЯ 144 градуса.',
      'The apex is not halved: what gets halved is the REMAINING 144 degrees.') },
    { when: (s) => s.seq.indexOf('d') !== -1 && s.seq.indexOf('c') === -1, text: L(
      "144 bu ikki burchakning yig'indisi, javob emas. Uni ikkiga bo'lish kerak.",
      '144 это сумма двух углов, а не ответ. Её надо разделить на два.',
      '144 is the sum of two angles, not the answer. It must be halved.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "Uchidagi burchakni 180 dan ayiring, keyin qolganini ikkiga bo'ling.",
    'Вычти угол при вершине из 180, потом остаток раздели на два.',
    'Subtract the apex from 180, then halve the rest.'),
};

export default function D44_05(props) { return <BuildLine data={DATA} {...props} />; }
