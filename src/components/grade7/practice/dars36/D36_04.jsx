// Dars36 · Amaliyot 04 — Ikki savol · 🟡 · chain · tag: graph_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 4-o'rin `chain`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = 4x − 18: x = 2 -> −10; y = 0 -> x = 4,5.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_chain',
  level: '🟡',
  eyebrow: L(
    'Ikki savol',
    'Два вопроса',
    'Two questions'),
  setup: L(
    "Birinchi qatorda qiymat hisoblanadi, ikkinchisida esa grafikning x o'qini kesish nuqtasi topiladi.",
    'В первой строке считаем значение, во второй находим пересечение графика с осью x.',
    'The first row computes a value, the second finds where the graph meets the x axis.'),
  given: [['y = 4x − 18']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [{ t: ['x = 2', 'da', 'y', '='] }, { slot: 0 }],
    [{ t: ['y = 0', 'da', 'x', '='] }, { slot: 1 }],
  ],
  cards: ['−10', '4,5', '26', '18'],
  answer: ['−10', '4,5'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 8 − 18 = −10; keyin 4x = 18, ya'ni x = 4,5.",
    'Верно. 8 − 18 = −10; затем 4x = 18, значит x = 4,5.',
    'Correct. 8 − 18 = −10; then 4x = 18, so x = 4.5.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '26',
      text: L(
        '26 chiqishi uchun 8 + 18 hisoblangan. Formulada 18 AYIRILADI.',
        'Чтобы вышло 26, считали 8 + 18. В формуле 18 ВЫЧИТАЕТСЯ.',
        '26 adds 8 and 18. The formula SUBTRACTS 18.'),
    },
    {
      when: (s) => s.slots[1] === '18',
      text: L(
        "18 ni 4 ga bo'lish qolib ketgan: 18 : 4 = 4,5.",
        'Забыли поделить 18 на 4: 18 : 4 = 4,5.',
        'The division by 4 is missing: 18 : 4 = 4.5.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma uya to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    'Ikkinchi qatorda tenglama yechiladi: 4x − 18 = 0.',
    'Во второй строке решается уравнение: 4x − 18 = 0.',
    'The second row solves 4x − 18 = 0.'),
};

export default function D36_04(props) { return <SlotsBank data={DATA} {...props} />; }
