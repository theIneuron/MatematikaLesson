// Dars44 · Amaliyot 08 — Uchi ikki barobar · 🔴 · chain · tag: iso_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 8-o'rin.
// Uchi 2x, asos burchaklari x va x: 4x = 180 -> x = 45, uchi 90°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_chain', level: '🔴',
  eyebrow: L('Uchi ikki barobar', 'Вершина вдвое', 'Apex twice as big'),
  setup: L(
    "Uchidagi burchak asos burchagidan ikki barobar katta. Uch burchak birga 180 beradi: x + x + 2x.",
    'Угол при вершине вдвое больше угла при основании. Три угла вместе дают 180: x + x + 2x.',
    'The apex is twice a base angle. All three make 180: x + x + 2x.'),
  rows: [
    [{ t: ['4x', '=', '180°', '→', 'x', '='] }, { slot: 0 }],
    [{ t: ['uchi', '='] }, { slot: 1 }],
  ],
  cards: ['45°', '90°', '60°', '120°'],
  answer: ['45°', '90°'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4x = 180 -> x = 45, uchi 2 · 45 = 90°. Bu to'g'ri burchakli teng yonli uchburchak.",
    'Верно. 4x = 180 → x = 45, вершина 2 · 45 = 90°. Это прямоугольный равнобедренный треугольник.',
    'Correct. 4x = 180 → x = 45, apex 2 · 45 = 90°. A right isosceles triangle.'),
  wrongs: [
    { when: (s) => s.slots[0] === '60°', text: L(
      "60 chiqishi uchun 180 uchga bo'lingan. Bizda esa to'rt x bor: x + x + 2x.",
      'Чтобы вышло 60, разделили 180 на три. А у нас четыре x: x + x + 2x.',
      'To get 60 the 180 was divided by three. We have four x: x + x + 2x.') },
    { when: (s) => s.slots[1] === '120°', text: L(
      "120 bu 2 · 60. x = 45 bo'lgani uchun uchi 90°.",
      '120 это 2 · 60. Так как x = 45, вершина равна 90°.',
      '120 is 2 · 60. Since x = 45, the apex is 90°.') },
  ],
  wrongText: L(
    "Nechta x bor: ikki asos burchagi va ikki barobar uchi. Yig'indini 180 ga tenglashtiring.",
    'Сколько всего x: два угла при основании и вдвое больший при вершине. Приравняй сумму к 180.',
    'Count the x: two base angles plus a double apex. Set the sum to 180.'),
};

export default function D44_08(props) { return <SlotsBank data={DATA} {...props} />; }
