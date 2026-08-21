// Dars46 · Amaliyot 02 — Eng katta va eng kichik · 🟢 · chain · tag: side_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 2-o'rin.
// Burchaklar 80°, 60°, 40°: eng katta tomon 80° qarshisida,
// eng kichigi 40° qarshisida.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'side_chain', level: '🟢',
  eyebrow: L('Eng katta va kichik', 'Наибольшая и наименьшая', 'Largest and smallest'),
  setup: L(
    "Uch burchak ma'lum. Tomonlar tartibi burchaklar tartibini takrorlaydi.",
    'Известны три угла. Порядок сторон повторяет порядок углов.',
    'The three angles are known. The order of sides follows the order of angles.'),
  given: [['80°,', '60°,', '40°']],
  givenLabel: L('Burchaklar:', 'Углы:', 'Angles:'),
  rows: [
    [{ t: ['eng', 'katta', 'tomon', '--', 'qarshisida'] }, { slot: 0 }],
    [{ t: ['eng', 'kichik', 'tomon', '--', 'qarshisida'] }, { slot: 1 }],
  ],
  cards: ['80°', '40°', '60°', '180°'],
  answer: ['80°', '40°'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Eng katta tomon 80° qarshisida, eng kichigi 40° qarshisida yotadi.",
    'Верно. Наибольшая сторона против 80°, наименьшая против 40°.',
    'Correct. The largest side faces 80°, the smallest faces 40°.'),
  wrongs: [
    { when: (s) => s.slots[0] === '40°' || s.slots[1] === '80°', text: L(
      "Tartib teskari: katta burchak katta tomonni, kichik burchak kichik tomonni beradi.",
      'Порядок перевёрнут: большой угол даёт большую сторону, малый — малую.',
      'The order is reversed: a big angle gives a big side and a small one a small side.') },
    { when: (s) => s.slots[0] === '60°' || s.slots[1] === '60°', text: L(
      "60° o'rtadagi burchak: uning qarshisidagi tomon ham o'rtada bo'ladi.",
      '60° это средний угол: сторона против него тоже средняя.',
      '60° is the middle angle, so its side is the middle one.') },
  ],
  wrongText: L(
    "Uch burchakdan qaysi biri eng katta, qaysi biri eng kichik?",
    'Какой из трёх углов наибольший, а какой наименьший?',
    'Which of the three angles is largest and which smallest?'),
};

export default function D46_02(props) { return <SlotsBank data={DATA} {...props} />; }
