// Dars27 · Amaliyot 09 — Ikki harfli kub · 🔴 · slots · tag: cube_two_letters
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 9-o'rin.
// (p + 2q)³ = p³ + 6p²q + 12pq² + 8q³.
//   3 · p² · 2q = 6p²q; 3 · p · (2q)² = 3 · p · 4q² = 12pq²; (2q)³ = 8q³.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_two_letters', level: '🔴',
  eyebrow: L('Ikki harfli kub', 'Куб с двумя буквами', 'A cube with two letters'),
  setup: L(
    "Ikkinchi had 2q: uning kvadrati 4q², kubi 8q³. Har hadda ikki harf ham qatnashadi, faqat darajalari o'zgaradi.",
    'Второй член это 2q: его квадрат 4q², куб 8q³. В каждом члене участвуют обе буквы, меняются только степени.',
    'The second term is 2q: its square is 4q² and its cube 8q³. Both letters appear in each term, only the powers change.'),
  rows: [
    [{ t: ['(p', '+', '2q)³', '='] }, { slot: 0 }, { slot: 1 }, { slot: 2 }, { slot: 3 }],
  ],
  cards: ['p³', '+6p²q', '+12pq²', '+8q³', '+3p²q', '+2q³'],
  answer: ['p³', '+6p²q', '+12pq²', '+8q³'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 · p² · 2q = 6p²q; 3 · p · 4q² = 12pq²; (2q)³ = 8q³.",
    'Верно. 3 · p² · 2q = 6p²q; 3 · p · 4q² = 12pq²; (2q)³ = 8q³.',
    'Correct. 3 · p² · 2q = 6p²q; 3 · p · 4q² = 12pq²; (2q)³ = 8q³.'),
  wrongs: [
    { when: (s) => s.slots[1] === '+3p²q', text: L(
      "3p²q da ikkilik hisobga olinmagan: 3 · p² · 2q = 6p²q.",
      'В 3p²q не учтена двойка: 3 · p² · 2q = 6p²q.',
      'In 3p²q the two was missed: 3 · p² · 2q = 6p²q.') },
    { when: (s) => s.slots[3] === '+2q³', text: L(
      "(2q)³ da ikkilik ham kubga ko'tariladi: 2³ = 8, ya'ni 8q³.",
      'В (2q)³ двойка тоже возводится в куб: 2³ = 8, значит 8q³.',
      'In (2q)³ the two is cubed too: 2³ = 8, giving 8q³.') },
    { when: (s) => s.slots[0] === '+8q³' || s.slots[3] === 'p³', text: L(
      "Hadlar joyi almashib ketdi: birinchisi p³, oxirgisi 8q³.",
      'Члены перепутались местами: первый p³, последний 8q³.',
      'The terms swapped places: p³ first, 8q³ last.') },
  ],
  wrongText: L(
    "Ikkinchi hadni butunligi bilan oling: 2q. Uning kvadrati va kubi nechchi?",
    'Возьми второй член целиком: 2q. Чему равны его квадрат и куб?',
    'Take the second term whole: 2q. What are its square and cube?'),
};

export default function D27_09(props) { return <SlotsBank data={DATA} {...props} />; }
