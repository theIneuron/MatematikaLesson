// Dars36 · Amaliyot 06 — Grafikdan formula · 🟡 · build · tag: read_graph
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// To'g'ri chiziq (0; −6) va (3; 0) dan o'tadi: b = −6, k = 6 : 3 = 2.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'read_graph',
  level: '🟡',
  eyebrow: L(
    'Grafikdan formula',
    'Формула по графику',
    'Formula from a graph'),
  setup: L(
    "Chiziq ikki nuqtadan o'tadi. b -- y o'qidagi qiymat, k esa o'zgarishlar nisbati.",
    'Прямая проходит через две точки. b это значение на оси y, а k отношение изменений.',
    'The line passes two points. b is the value on the y axis, k the ratio of changes.'),
  given: [['(0; −6)', 'va', '(3; 0)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'y = 2x − 6' },
    { id: 'b', label: 'y = −2x + 6' },
    { id: 'c', label: 'y = 2x + 6' },
    { id: 'd', label: 'y = 6x − 2' },
  ],
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
    "To'g'ri. b = −6, o'zgarish 0 − (−6) = 6 ni 3 ga bo'lsak k = 2.",
    'Верно. b = −6, изменение 0 − (−6) = 6 делим на 3 и получаем k = 2.',
    'Correct. b = −6, and the change 0 − (−6) = 6 over 3 gives k = 2.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "Qiymat −6 dan 0 ga O'SDI, ya'ni k musbat.",
        'Значение ВЫРОСЛО от −6 до 0, значит k положительный.',
        'The value GREW from −6 to 0, so k is positive.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "b ning ishorasi yo'qolgan: x = 0 da qiymat −6.",
        'Потерян знак b: при x = 0 значение −6.',
        'The sign of b is lost: at x = 0 the value is −6.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        'k va b joyini almashtirgan: k -- x oldidagi son.',
        'k и b поменялись местами: k это число перед x.',
        'k and b swapped: k is the number before x.'),
    },
  ],
  wrongText: L(
    "Avval b ni oling, keyin ordinatalar o'zgarishini abssissalar o'zgarishiga bo'ling.",
    'Сначала возьми b, потом раздели изменение ординат на изменение абсцисс.',
    'Take b first, then divide the change in y by the change in x.'),
};

export default function D36_06(props) { return <BuildLine data={DATA} {...props} />; }
