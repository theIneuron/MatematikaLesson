// Dars27 · Amaliyot 05 — Koeffitsiyentli kub · 🟡 · slots · tag: cube_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 5-o'rin.
// (2a + 3)³ = 8a³ + 36a² + 54a + 27.
//   (2a)³ = 8a³; 3 · (2a)² · 3 = 36a²; 3 · 2a · 9 = 54a; 3³ = 27.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_slots', level: '🟡',
  eyebrow: L('Koeffitsiyentli kub', 'Куб с коэффициентом', 'A cube with a coefficient'),
  setup: L(
    "Birinchi hadda koeffitsiyent bor, ya'ni u ham darajaga ko'tariladi: (2a)³ = 8a³, (2a)² = 4a².",
    'В первом члене есть коэффициент, значит он тоже возводится в степень: (2a)³ = 8a³, (2a)² = 4a².',
    'The first term has a coefficient, so it is raised too: (2a)³ = 8a³, (2a)² = 4a².'),
  rows: [
    [{ t: ['(2a', '+', '3)³', '='] }, { slot: 0 }, { slot: 1 }, { slot: 2 }, { slot: 3 }],
  ],
  cards: ['8a³', '+36a²', '+54a', '+27', '+18a²', '+27a'],
  answer: ['8a³', '+36a²', '+54a', '+27'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (2a)³ = 8a³; 3 · 4a² · 3 = 36a²; 3 · 2a · 9 = 54a; 3³ = 27.",
    'Верно. (2a)³ = 8a³; 3 · 4a² · 3 = 36a²; 3 · 2a · 9 = 54a; 3³ = 27.',
    'Correct. (2a)³ = 8a³; 3 · 4a² · 3 = 36a²; 3 · 2a · 9 = 54a; 3³ = 27.'),
  wrongs: [
    { when: (s) => s.slots[1] === '+18a²', text: L(
      "18a² da (2a)² hisobga olinmagan: 3 · (2a)² · 3 = 3 · 4a² · 3 = 36a².",
      'В 18a² не учтено (2a)²: 3 · (2a)² · 3 = 3 · 4a² · 3 = 36a².',
      'In 18a² the (2a)² was missed: 3 · (2a)² · 3 = 3 · 4a² · 3 = 36a².') },
    { when: (s) => s.slots[2] === '+27a', text: L(
      "27a da ikkilik yo'q: 3 · 2a · 3² = 54a.",
      'В 27a нет двойки: 3 · 2a · 3² = 54a.',
      'In 27a the two is missing: 3 · 2a · 3² = 54a.') },
    { when: (s) => s.slots[0] === '+36a²' || s.slots[3] === '8a³', text: L(
      "Hadlar joyi almashib ketdi: birinchisi kub, oxirgisi son.",
      'Члены перепутались местами: первый это куб, последний число.',
      'The terms swapped places: the first is the cube, the last the number.') },
  ],
  wrongText: L(
    "Birinchi hadni butunligi bilan oling: 2a. Uning kubi, kvadrati nechchi?",
    'Возьми первый член целиком: 2a. Чему равен его куб и его квадрат?',
    'Take the first term whole: 2a. What are its cube and its square?'),
};

export default function D27_05(props) { return <SlotsBank data={DATA} {...props} />; }
