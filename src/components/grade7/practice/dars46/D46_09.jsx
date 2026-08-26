// Dars46 · Amaliyot 09 — Harf bilan o'tkir burchaklar · 🔴 · slots · tag: rt_letters
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 9-o'rin `slots`.
// To'g'ri burchakli uchburchakda o'tkir burchaklar 2x va 3x: 5x = 90 -> x = 18, burchaklar 36° va 54°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rt_letters',
  level: '🔴',
  eyebrow: L(
    'Harf bilan',
    'С буквой',
    'With a letter'),
  setup: L(
    "To'g'ri burchakli uchburchakning o'tkir burchaklari 2x va 3x. Ikki uyani to'ldiring: x va katta o'tkir burchak.",
    'Острые углы прямоугольного треугольника равны 2x и 3x. Заполни две клетки: x и больший острый угол.',
    'The acute angles of a right triangle are 2x and 3x. Fill both cells: x and the larger acute angle.'),
  given: [['2x', L('va', 'и', 'and'), '3x']],
  givenLabel: L(
    "O'tkir burchaklar:",
    'Острые углы:',
    'Acute angles:'),
  rows: [[{ t: ['x', '='] }, { slot: 0 }, { t: [L('katta', 'больший', 'larger'), L('burchak', 'угол', 'angle'), '='] }, { slot: 1 }]],
  cards: ['18', '54°', '36', '36°'],
  answer: ['18', '54°'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 2x + 3x = 90, ya'ni 5x = 90 va x = 18. Burchaklar 36 va 54, kattasi 54.",
    'Верно. 2x + 3x = 90, значит 5x = 90 и x = 18. Углы 36 и 54, больший 54.',
    'Correct. 2x + 3x = 90 gives 5x = 90 and x = 18. The angles are 36 and 54, the larger 54.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '36',
      text: L(
        "36 chiqishi uchun 180 beshga bo'lingan. O'tkir burchaklarga 90 qoladi, 180 emas.",
        'Чтобы вышло 36, делили 180 на пять. Острым остаётся 90, а не 180.',
        '36 divides 180 by five. The acute angles share 90, not 180.'),
    },
    {
      when: (s) => s.slots[1] === '36°',
      text: L(
        '36 bu 2x -- kichik burchak. Kattasi 3x = 54.',
        '36 это 2x, меньший угол. Больший это 3x = 54.',
        '36 is 2x, the smaller angle. The larger is 3x = 54.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma uya to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "O'tkir burchaklar yig'indisi 90. 2x + 3x ni 90 ga tenglashtiring.",
    'Сумма острых углов 90. Приравняй 2x + 3x к 90.',
    'The acute angles add to 90. Set 2x + 3x equal to 90.'),
};

export default function D46_09(props) { return <SlotsBank data={DATA} {...props} />; }
