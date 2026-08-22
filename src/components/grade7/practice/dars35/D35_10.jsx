// Dars35 · Amaliyot 10 — Qaysi x da qiymat 19 · 🔴 · build · tag: lin_which_x
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = −2x + 5, y = 19: −2x = 14 -> x = −7.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_which_x',
  level: '🔴',
  eyebrow: L(
    'Teskari savol',
    'Обратный вопрос',
    'The reverse question'),
  setup: L(
    "Qiymat berilgan, argument so'raladi. Ozod hadni ko'chirgach manfiy koeffitsiyentga bo'lish kerak -- javob manfiy chiqadi.",
    'Дано значение, спрашивают аргумент. После переноса свободного члена делим на отрицательный коэффициент — ответ выйдет отрицательным.',
    'The value is given and the argument asked. After moving the constant, divide by the negative coefficient: the answer is negative.'),
  given: [['y = −2x + 5', ',', 'y = 19']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [{ id: 'a', label: 'x = −7' }, { id: 'b', label: 'x = 7' }, { id: 'c', label: 'x = −12' }],
  answerSeq: ['a'],
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
    "To'g'ri. −2x + 5 = 19 dan −2x = 14, ya'ni x = −7.",
    'Верно. Из −2x + 5 = 19 следует −2x = 14, значит x = −7.',
    'Correct. −2x + 5 = 19 gives −2x = 14, so x = −7.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "Ishora tashlab ketilgan: 14 ni −2 ga bo'lsak −7 chiqadi.",
        'Потерян знак: 14 делённое на −2 даёт −7.',
        'The sign is lost: 14 divided by −2 is −7.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "−12 chiqishi uchun 5 va 19 qo'shilgan. Ozod had KO'CHIRILADI: 19 − 5 = 14.",
        'Чтобы вышло −12, сложили 5 и 19. Свободный член ПЕРЕНОСИТСЯ: 19 − 5 = 14.',
        '−12 adds 5 and 19. The constant MOVES across: 19 − 5 = 14.'),
    },
    {
      when: (s) => s.seq.length < 1,
      text: L(
        'Bitta karta kerak.',
        'Нужна одна карточка.',
        'One card is needed.'),
    },
  ],
  wrongText: L(
    "Ozod hadni o'ng tomonga ko'chiring, keyin −2 ga bo'ling.",
    'Перенеси свободный член вправо, потом раздели на −2.',
    'Move the constant to the right, then divide by −2.'),
};

export default function D35_10(props) { return <BuildLine data={DATA} {...props} />; }
