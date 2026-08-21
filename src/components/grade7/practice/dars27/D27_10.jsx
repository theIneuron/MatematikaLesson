// Dars27 · Amaliyot 10 — Koeffitsiyent va minus birga · 🔴 · build · tag: cube_hard
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
// (3k − 1)³ = 27k³ − 27k² + 9k − 1.
//   (3k)³ = 27k³; 3 · 9k² · (−1) = −27k²; 3 · 3k · 1 = +9k; (−1)³ = −1.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_hard', level: '🔴',
  eyebrow: L('Koeffitsiyent va minus', 'Коэффициент и минус', 'Coefficient and minus'),
  setup: L(
    "Bir vaqtda ikki narsa ishlaydi: koeffitsiyent darajaga ko'tariladi va ishoralar navbatlashadi.",
    'Работают две вещи сразу: коэффициент возводится в степень и знаки чередуются.',
    'Two things at once: the coefficient is raised to the power and the signs alternate.'),
  expr: ['(3k', '−', '1)³'], exprSize: 34,
  cards: [
    { id: 'a', label: '27k³' },
    { id: 'b', label: '−27k²' },
    { id: 'c', label: '+9k' },
    { id: 'd', label: '−1' },
    { id: 'e', label: '−9k²' },
    { id: 'f', label: '+1' },
  ],
  answerSeq: ['a', 'b', 'c', 'd'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (3k)³ = 27k³; 3 · (3k)² · 1 = 27k², minus bilan; 3 · 3k · 1 = 9k, musbat; (−1)³ = −1.",
    'Верно. (3k)³ = 27k³; 3 · (3k)² · 1 = 27k² с минусом; 3 · 3k · 1 = 9k, положительно; (−1)³ = −1.',
    'Correct. (3k)³ = 27k³; 3 · (3k)² · 1 = 27k² with a minus; 3 · 3k · 1 = 9k, positive; (−1)³ = −1.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "−9k² da (3k)² hisobga olinmagan: 3 · 9k² = 27k².",
      'В −9k² не учтено (3k)²: 3 · 9k² = 27k².',
      'In −9k² the (3k)² was missed: 3 · 9k² = 27k².') },
    { when: (s) => s.seq.indexOf('f') !== -1, text: L(
      "Oxirgi had manfiy: (−1)³ = −1, chunki toq daraja minusni saqlaydi.",
      'Последний член отрицательный: (−1)³ = −1, нечётная степень сохраняет минус.',
      'The last term is negative: (−1)³ = −1, an odd power keeps the minus.') },
    { when: (s) => s.seq.length < 4, text: L(
      "Kubda to'rt had bo'ladi.",
      'В кубе четыре члена.',
      'A cube has four terms.') },
  ],
  wrongText: L(
    "Har hadda ikki narsani hisoblang: koeffitsiyentning darajasi va ishora.",
    'В каждом члене посчитай две вещи: степень коэффициента и знак.',
    'Work out two things per term: the power of the coefficient and the sign.'),
};

export default function D27_10(props) { return <BuildLine data={DATA} {...props} />; }
