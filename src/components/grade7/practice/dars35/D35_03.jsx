// Dars35 · Amaliyot 03 — Ikki qiymat · 🟢 · chain · tag: lin_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 3-o'rin.
// y = 2x + 3: x = 0 -> 3 (b ning o'zi), x = 1 -> 5.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_chain', level: '🟢',
  eyebrow: L('Ikki nuqta', 'Две точки', 'Two points'),
  setup: L(
    "x = 0 bo'lganda faqat ozod had qoladi -- bu grafikning y o'qini kesish nuqtasi. Keyin har qadamda y k ga oshadi.",
    'При x = 0 остаётся только свободный член — это точка пересечения с осью y. Дальше на каждом шаге y растёт на k.',
    'At x = 0 only the free term remains — the crossing of the y axis. After that y grows by k each step.'),
  given: [['y', '=', '2x', '+', '3']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  rows: [
    [{ t: ['x', '=', '0', '→', 'y', '='] }, { slot: 0 }],
    [{ t: ['x', '=', '1', '→', 'y', '='] }, { slot: 1 }],
  ],
  cards: ['3', '5', '0', '2'],
  answer: ['3', '5'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x = 0 da y = 3, x = 1 da y = 5. Bir qadamda y ikkiga oshdi -- bu k.",
    'Верно. При x = 0 выходит y = 3, при x = 1 выходит y = 5. За шаг y вырос на два — это k.',
    'Correct. At x = 0, y = 3; at x = 1, y = 5. One step raised y by two — that is k.'),
  wrongs: [
    { when: (s) => s.slots[0] === '0', text: L(
      "x = 0 bo'lganda 2x nol bo'ladi, lekin +3 qoladi: y = 3.",
      'При x = 0 член 2x равен нулю, но +3 остаётся: y = 3.',
      'At x = 0 the 2x is zero but the +3 stays: y = 3.') },
    { when: (s) => s.slots[1] === '2', text: L(
      "x = 1 da 2 · 1 = 2, keyin +3 qo'shiladi: y = 5.",
      'При x = 1 выходит 2 · 1 = 2, потом добавляется +3: y = 5.',
      'At x = 1 we get 2 · 1 = 2, then +3 joins: y = 5.') },
  ],
  wrongText: L(
    "Har x uchun avval 2x ni hisoblang, keyin 3 ni qo'shing.",
    'Для каждого x посчитай 2x, потом прибавь 3.',
    'For each x work out 2x, then add 3.'),
};

export default function D35_03(props) { return <SlotsBank data={DATA} {...props} />; }
