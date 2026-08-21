// Dars41 · Amaliyot 09 — Vertikal burchak va harf · 🔴 · order · tag: ang_vert_letter
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 9-o'rin.
// Vertikal burchaklar teng: 3x = 75 -> x = 25.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_vert_letter', level: '🔴',
  eyebrow: L('Vertikal va harf', 'Вертикальные и буква', 'Vertical with a letter'),
  setup: L(
    "Vertikal burchaklar teng bo'lgani uchun tenglama tuziladi. Uni yechish oddiy: bir bo'lish yetadi.",
    'Вертикальные углы равны, поэтому составляется уравнение. Решается оно одним делением.',
    'Vertical angles are equal, so an equation appears. One division solves it.'),
  given: [['∠1', '=', '3x'], ['∠2', '=', '75°']],
  givenLabel: L('Vertikal burchaklar:', 'Вертикальные углы:', 'Vertical angles:'),
  cards: [
    { id: 'a', label: '3x = 75°' },
    { id: 'b', label: 'x = 25°' },
    { id: 'c', label: '3x + 75° = 180°' },
    { id: 'd', label: 'x = 35°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Qadamlarni tartib bilan qo'ying", 'Поставь шаги по порядку', 'Place the steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Vertikal burchaklar teng: 3x = 75 -> x = 25.",
    'Верно. Вертикальные углы равны: 3x = 75 → x = 25.',
    'Correct. Vertical angles are equal: 3x = 75 → x = 25.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "180 gradus QO'SHNI burchaklar uchun. Vertikal burchaklar esa TENG.",
      '180 градусов для СМЕЖНЫХ углов. А вертикальные РАВНЫ.',
      '180 is for ADJACENT angles. Vertical ones are EQUAL.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "35 emas: 75 : 3 = 25.",
      'Не 35: 75 : 3 = 25.',
      'Not 35: 75 : 3 = 25.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qadam kerak: tenglama va ildiz.",
      'Нужны два шага: уравнение и корень.',
      'Two steps: the equation and the root.') },
  ],
  wrongText: L(
    "Vertikal burchaklar teng bo'lsa, qanday tenglama chiqadi?",
    'Если вертикальные углы равны, какое выйдет уравнение?',
    'If vertical angles are equal, what equation appears?'),
};

export default function D41_09(props) { return <BuildLine data={DATA} {...props} />; }
