// Dars48 · Amaliyot 06 — Tomonni ikki barobar · 🟡 · chain · tag: area_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 6-o'rin.
// To'rtburchak 8 va 15: S = 120. Bir tomon ikki barobar bo'lsa S = 240.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'area_chain', level: '🟡',
  eyebrow: L('Ikki barobar', 'Вдвое больше', 'Twice as long'),
  setup: L(
    "Avval yuza topiladi. Keyin bir tomon ikki barobar oshsa, yuza ham ikki barobar oshadi.",
    'Сначала находится площадь. Если одна сторона увеличится вдвое, площадь тоже вырастет вдвое.',
    'First the area. Doubling one side doubles the area too.'),
  given: [['8', 'va', '15']],
  givenLabel: L('Tomonlar:', 'Стороны:', 'Sides:'),
  rows: [
    [{ t: ['S', '='] }, { slot: 0 }],
    [{ t: ['bir', 'tomon', 'ikki', 'barobar', '→', 'S', '='] }, { slot: 1 }],
  ],
  cards: ['120', '240', '23', '480'],
  answer: ['120', '240'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. S = 8 · 15 = 120. Bir tomon ikki barobar bo'lsa 16 · 15 = 240.",
    'Верно. S = 8 · 15 = 120. При удвоении одной стороны 16 · 15 = 240.',
    'Correct. S = 8 · 15 = 120. Doubling one side gives 16 · 15 = 240.'),
  wrongs: [
    { when: (s) => s.slots[0] === '23', text: L(
      "23 bu 8 + 15. Yuza uchun tomonlar ko'paytiriladi.",
      '23 это 8 + 15. Для площади стороны перемножаются.',
      '23 is 8 + 15. Area multiplies the sides.') },
    { when: (s) => s.slots[1] === '480', text: L(
      "480 chiqishi uchun IKKI tomon ham ikki barobar bo'lgan. Bizda esa faqat bittasi.",
      'Чтобы вышло 480, удвоили ОБЕ стороны. А у нас только одна.',
      'To get 480 BOTH sides were doubled. Only one is.') },
  ],
  wrongText: L(
    "Yuzani toping, keyin bitta ko'paytuvchini ikki barobar oshiring.",
    'Найди площадь, потом удвой один множитель.',
    'Find the area, then double one factor.'),
};

export default function D48_06(props) { return <SlotsBank data={DATA} {...props} />; }
