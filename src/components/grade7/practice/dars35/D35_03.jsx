// Dars35 · Amaliyot 03 — Ikki nuqta · 🟢 · chain · tag: lin_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 3-o'rin `chain`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = 6x − 15: x = 0 -> −15 (b ning o'zi); y = 0 -> 6x = 15 -> x = 2,5.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_chain',
  level: '🟢',
  eyebrow: L(
    'Ikki savol',
    'Два вопроса',
    'Two questions'),
  setup: L(
    "Birinchi qatorda x = 0 dagi qiymat, ikkinchi qatorda esa y nolga aylanadigan x so'raladi.",
    'В первой строке значение при x = 0, во второй тот x, при котором y обращается в ноль.',
    'The first row asks the value at x = 0, the second the x where y becomes zero.'),
  given: [['y = 6x − 15']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [{ t: ['x = 0', 'da', 'y', '='] }, { slot: 0 }],
    [{ t: ['y = 0', 'da', 'x', '='] }, { slot: 1 }],
  ],
  cards: ['−15', '2,5', '15', '−2,5'],
  answer: ['−15', '2,5'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. x = 0 da y = −15. y = 0 da 6x = 15, ya'ni x = 2,5.",
    'Верно. При x = 0 y = −15. При y = 0 6x = 15, значит x = 2,5.',
    'Correct. At x = 0 y = −15. At y = 0 we get 6x = 15, so x = 2.5.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '15',
      text: L(
        "Ishora yo'qolgan: formulada −15 turibdi.",
        'Потерян знак: в формуле стоит −15.',
        'The sign is lost: the formula has −15.'),
    },
    {
      when: (s) => s.slots[1] === '−2,5',
      text: L(
        "−15 ni o'ng tomonga ko'chirganda ishora almashadi: 6x = +15.",
        'При переносе −15 вправо знак меняется: 6x = +15.',
        'Moving −15 to the right flips its sign: 6x = +15.'),
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
    "x = 0 da harfli had yo'qoladi. Ikkinchi qatorda tenglamani yechish kerak.",
    'При x = 0 член с буквой исчезает. Во второй строке надо решить уравнение.',
    'At x = 0 the letter term vanishes. The second row needs an equation solved.'),
};

export default function D35_03(props) { return <SlotsBank data={DATA} {...props} />; }
