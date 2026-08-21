// Dars45 · Amaliyot 09 — Harf bilan · 🔴 · build · tag: par_letter
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// Ichki bir tomonli burchaklar 2x va 3x: 5x = 180 -> x = 36.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'par_letter', level: '🔴',
  eyebrow: L('Harf bilan', 'С буквой', 'With a letter'),
  setup: L(
    "Ikki bir tomonli burchak 2x va 3x. Ular 180 gradusga to'ldirgani uchun tenglama chiqadi.",
    'Два односторонних угла равны 2x и 3x. Так как они дают 180, выходит уравнение.',
    'Two same-side angles are 2x and 3x. Since they complete 180, an equation appears.'),
  given: [['2x', 'va', '3x', '--', 'bir', 'tomonli']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '5x = 180°' },
    { id: 'b', label: 'x = 36°' },
    { id: 'c', label: '5x = 90°' },
    { id: 'd', label: 'x = 18°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Tenglamani tuzib yeching", 'Составь уравнение и реши', 'Set up and solve'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2x + 3x = 5x = 180 -> x = 36. Burchaklar 72° va 108°: yig'indisi 180.",
    'Верно. 2x + 3x = 5x = 180 → x = 36. Углы 72° и 108°: сумма 180.',
    'Correct. 2x + 3x = 5x = 180 → x = 36. The angles are 72° and 108°, summing to 180.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "90 gradus bir tomonli burchaklar uchun emas: ular 180 gradusga to'ldiradi.",
      '90 градусов не для односторонних углов: они дополняют до 180.',
      '90 is not for same-side angles: they complete 180.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qadam kerak: tenglama va ildiz.",
      'Нужны два шага: уравнение и корень.',
      'Two steps: the equation and the root.') },
  ],
  wrongText: L(
    "2x va 3x ni qo'shsangiz nechta x chiqadi? Yig'indi nechchiga teng?",
    'Сколько x выйдет из 2x и 3x? Чему равна сумма?',
    'How many x come from 2x and 3x? What is the sum?'),
};

export default function D45_09(props) { return <BuildLine data={DATA} {...props} />; }
