// Dars30 · Amaliyot 04 — Uch qadam · 🟡 · order · tag: whole_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 4-o'rin.
// (x + 6)² − x² = x² + 12x + 36 − x² = 12x + 36.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_order', level: '🟡',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "Kvadrat ochiladi, keyin x² lar bir-birini yo'qotadi. Uch qadamni tartib bilan qo'yish kerak.",
    'Квадрат раскрывается, потом члены x² уничтожаются. Три шага надо расставить по порядку.',
    'The square is expanded, then the x² cancel. Place the three steps in order.'),
  expr: ['(x', '+', '6)²', '−', 'x²'], exprSize: 30,
  cards: [
    { id: 'a', label: 'x² + 12x + 36 − x²' },
    { id: 'b', label: '12x + 36' },
    { id: 'c', label: 'x² + 36 − x²' },
    { id: 'd', label: '36' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Qadamlarni tartib bilan qo'ying", 'Поставь шаги по порядку', 'Place the steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Kvadrat ochilib x² + 12x + 36 berdi, keyin x² lar yo'qoldi: 12x + 36.",
    'Верно. Квадрат раскрылся как x² + 12x + 36, потом x² уничтожились: 12x + 36.',
    'Correct. The square gave x² + 12x + 36, then the x² cancelled: 12x + 36.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "O'rta had tashlab ketilgan: (x + 6)² = x² + 12x + 36, faqat x² + 36 emas.",
      'Средний член потерян: (x + 6)² = x² + 12x + 36, а не просто x² + 36.',
      'The middle term is missing: (x + 6)² = x² + 12x + 36, not just x² + 36.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qadam kerak: ochish va ixchamlash.",
      'Нужны два шага: раскрытие и приведение.',
      'Two steps are needed: expanding and collecting.') },
  ],
  wrongText: L(
    "Kvadratni to'liq ochib yozing: unda uch had bo'ladi.",
    'Раскрой квадрат полностью: в нём три члена.',
    'Expand the square fully: it has three terms.'),
};

export default function D30_04(props) { return <BuildLine data={DATA} {...props} />; }
