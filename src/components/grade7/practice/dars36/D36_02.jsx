// Dars36 · Amaliyot 02 — Qurish qadamlari · 🟢 · order · tag: draw_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 2-o'rin `order`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = −2x + 6: x = 0 -> y = 6; x = 3 -> y = 0; ikki nuqtadan chiziq.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'draw_order',
  level: '🟢',
  eyebrow: L(
    'Qurish qadamlari',
    'Шаги построения',
    'Steps of drawing'),
  setup: L(
    "Grafik qurish tartibi: qulay ikki nuqta hisoblanadi, keyin chiziq o'tkaziladi. k manfiy, ya'ni chiziq pastga ketadi.",
    'Порядок построения: считаем две удобные точки, потом проводим прямую. k отрицательный, значит прямая идёт вниз.',
    'Order of drawing: compute two handy points, then draw the line. k is negative, so the line falls.'),
  given: [['y = −2x + 6']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'x = 0 -> y = 6' },
    { id: 'b', label: 'x = 3 -> y = 0' },
    { id: 'c', label: 'ikki nuqtadan chiziq' },
    { id: 'd', label: 'x = 3 -> y = 12' },
    { id: 'e', label: 'bitta nuqtadan chiziq' },
  ],
  answerSeq: ['a', 'b', 'c'],
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
    "To'g'ri. x = 0 da y = 6, x = 3 da y = −6 + 6 = 0, keyin ikki nuqta ulanadi.",
    'Верно. При x = 0 y = 6, при x = 3 y = −6 + 6 = 0, потом соединяем две точки.',
    'Correct. At x = 0 y = 6, at x = 3 y = −6 + 6 = 0, then join the two points.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "12 chiqishi uchun 6 + 6 hisoblangan. k manfiy: −2 · 3 = −6, ya'ni y = 0.",
        'Чтобы вышло 12, считали 6 + 6. k отрицательный: −2 · 3 = −6, значит y = 0.',
        '12 adds 6 and 6. k is negative: −2 · 3 = −6, so y = 0.'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        "Bitta nuqta to'g'ri chiziqni bermaydi.",
        'Одна точка не задаёт прямую.',
        'One point does not fix a line.'),
    },
    {
      when: (s) => s.seq.length < 3,
      text: L(
        'Uch karta kerak.',
        'Нужны три карточки.',
        'Three cards are needed.'),
    },
  ],
  wrongText: L(
    "x = 0 va y = 0 bo'lgan nuqtalar eng qulay.",
    'Удобнее всего точки при x = 0 и при y = 0.',
    'The handiest points are at x = 0 and y = 0.'),
};

export default function D36_02(props) { return <BuildLine data={DATA} {...props} />; }
