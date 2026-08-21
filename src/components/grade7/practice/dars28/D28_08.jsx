// Dars28 · Amaliyot 08 — Ikki kvadrat ayirmasi · 🔴 · chain · tag: formula_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 8-o'rin.
// 1-qator: (x + 4)² − (x − 4)² = (x² + 8x + 16) − (x² − 8x + 16)
// 2-qator: ixchamlansa 16x. Kvadratlar va sonlar yo'qoladi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'formula_chain', level: '🔴',
  eyebrow: L('Ikki kvadrat', 'Два квадрата', 'Two squares'),
  setup: L(
    "Ikki kvadrat ochiladi va ayiriladi. x² lar va sonlar bir-birini yo'qotadi, faqat o'rta hadlar qoladi.",
    'Два квадрата раскрываются и вычитаются. Члены x² и числа уничтожаются, остаются только средние члены.',
    'Both squares are expanded and subtracted. The x² terms and numbers cancel; only the middle terms remain.'),
  rows: [
    [{ t: ['(x', '+', '4)²', '−', '(x', '−', '4)²', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['='] }, { slot: 2 }],
  ],
  cards: ['x² + 8x + 16', '−(x² − 8x + 16)', '16x', '32', '8x', '−(x² + 8x + 16)'],
  answer: ['x² + 8x + 16', '−(x² − 8x + 16)', '16x'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x² − x² = 0, 16 − 16 = 0, o'rta hadlar esa 8x + 8x = 16x.",
    'Верно. x² − x² = 0, 16 − 16 = 0, а средние члены 8x + 8x = 16x.',
    'Correct. x² − x² = 0, 16 − 16 = 0, and the middle terms give 8x + 8x = 16x.'),
  wrongs: [
    { when: (s) => s.slots[2] === '8x', text: L(
      "Ikkinchi qavs ochilganda −8x ag'darilib +8x bo'ladi: 8x + 8x = 16x.",
      'При раскрытии второй скобки −8x переворачивается в +8x: 8x + 8x = 16x.',
      'Opening the second bracket flips −8x into +8x: 8x + 8x = 16x.') },
    { when: (s) => s.slots[2] === '32', text: L(
      "32 bu 16 + 16. Sonlar esa bir-birini yo'qotadi: 16 − 16 = 0.",
      '32 это 16 + 16. А числа уничтожаются: 16 − 16 = 0.',
      '32 is 16 + 16. But the numbers cancel: 16 − 16 = 0.') },
    { when: (s) => s.slots[1] === '−(x² + 8x + 16)', text: L(
      "Ikkinchi kvadrat AYIRMANING kvadrati: (x − 4)² = x² − 8x + 16.",
      'Второй квадрат это квадрат РАЗНОСТИ: (x − 4)² = x² − 8x + 16.',
      'The second square is a square of a DIFFERENCE: (x − 4)² = x² − 8x + 16.') },
  ],
  wrongText: L(
    "Ikki kvadratni ochib yozing, keyin ikkinchisining hamma hadini ag'daring.",
    'Раскрой два квадрата, потом переверни все члены второго.',
    'Expand both squares, then flip every term of the second.'),
};

export default function D28_08(props) { return <SlotsBank data={DATA} {...props} />; }
