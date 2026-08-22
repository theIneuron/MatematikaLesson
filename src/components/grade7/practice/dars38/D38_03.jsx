// Dars38 · Amaliyot 03 — Javobni yozish · 🟢 · bracket · tag: sys_pair
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin `bracket`.
// x = 5, y = −2 -> yechim (5; −2). Tartib: avval x, keyin y.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_pair',
  level: '🟢',
  eyebrow: L(
    'Javobni yozish',
    'Записать ответ',
    'Write the answer'),
  setup: L(
    "Sistemaning javobi juftlik ko'rinishida yoziladi: avval x, keyin y.",
    'Ответ системы записывается парой: сначала x, потом y.',
    'A system answer is written as a pair: x first, then y.'),
  given: [['x = 5', ',', 'y = −2']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '(5;' },
    { id: 'b', label: '−2)' },
    { id: 'c', label: '(−2;' },
    { id: 'd', label: '2)' },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 44,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. (5; −2): abssissa 5, ordinata −2.",
    'Верно. (5; −2): абсцисса 5, ордината −2.',
    'Correct. (5; −2): abscissa 5, ordinate −2.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        'Tartib almashgan: avval x yoziladi.',
        'Порядок нарушен: сначала пишется x.',
        'The order is wrong: x comes first.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Ishora yo'qolgan: y = −2.",
        'Потерян знак: y = −2.',
        'The sign is lost: y = −2.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    'Avval x, keyin y; ishoralarni saqlang.',
    'Сначала x, потом y; сохрани знаки.',
    'x first, then y, signs kept.'),
};

export default function D38_03(props) { return <BuildLine data={DATA} {...props} />; }
