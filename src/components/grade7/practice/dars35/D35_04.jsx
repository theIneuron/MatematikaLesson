// Dars35 · Amaliyot 04 — k va b teskari tartibda · 🟡 · slots · tag: k_and_b
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 4-o'rin `slots`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = 9 − 4x: k = −4 (ishora bilan), b = 9. Hadlar teskari tartibda yozilgan -- tuzoq.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'k_and_b',
  level: '🟡',
  eyebrow: L(
    'k va b',
    'k и b',
    'k and b'),
  setup: L(
    'Hadlar teskari tartibda yozilgan: avval ozod had, keyin x li had. k -- x ning oldidagi son ISHORASI BILAN.',
    'Члены записаны в обратном порядке: сначала свободный член, потом член с x. k это число перед x ВМЕСТЕ СО ЗНАКОМ.',
    'The terms are written in reverse: constant first, x term second. k is the number before x WITH its sign.'),
  given: [['y = 9 − 4x']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['k', '='] }, { slot: 0 }, { t: ['b', '='] }, { slot: 1 }]],
  cards: ['−4', '9', '4', '−9'],
  answer: ['−4', '9'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. y = −4x + 9, ya'ni k = −4 va b = 9.",
    'Верно. y = −4x + 9, значит k = −4 и b = 9.',
    'Correct. y = −4x + 9, so k = −4 and b = 9.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '4',
      text: L(
        'x oldidagi minus k ga tegishli: k = −4.',
        'Минус перед x относится к k: k = −4.',
        'The minus before x belongs to k: k = −4.'),
    },
    {
      when: (s) => s.slots[0] === '9' || s.slots[1] === '−4',
      text: L(
        "9 -- ozod had, u b. Hadlar tartibi aldab qo'ymasin.",
        '9 это свободный член, то есть b. Порядок членов не должен обманывать.',
        '9 is the constant, i.e. b. Do not let the order fool you.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma bo'sh katak to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "Yozuvni y = kx + b ko'rinishiga keltiring.",
    'Приведи запись к виду y = kx + b.',
    'Rewrite it as y = kx + b.'),
};

export default function D35_04(props) { return <SlotsBank data={DATA} {...props} />; }
