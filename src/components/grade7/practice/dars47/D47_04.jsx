// Dars47 · Amaliyot 04 — Bissektrisa yasash · 🟡 · chain · tag: comp_bisector_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 4-o'rin `chain`.
// Bissektrisa 76° burchakni ikki teng bo'lakka bo'ladi: 38° va 38°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'comp_bisector_chain',
  level: '🟡',
  eyebrow: L(
    'Bissektrisa yasash',
    'Построение биссектрисы',
    'Building a bisector'),
  setup: L(
    "Sirkul bilan bissektrisa yasaldi. Bissektrisa burchakni teng ikkiga bo'ladi -- shu ma'noda yasash o'lchovga tayanmaydi.",
    'Циркулем построили биссектрису. Она делит угол на две равные части — построение не опирается на измерение.',
    'A bisector was built with the compass. It halves the angle, and the construction relies on no measurement.'),
  given: [['76°']],
  givenLabel: L(
    'Burchak:',
    'Угол:',
    'Angle:'),
  rows: [
    [{ t: ['birinchi', "bo'lak", '='] }, { slot: 0 }],
    [{ t: ['ikkinchi', "bo'lak", '='] }, { slot: 1 }],
  ],
  cards: ['38°', '38° ham', '19°', '152°'],
  answer: ['38°', '38° ham'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 76 : 2 = 38, ikki bo'lak ham 38 gradus.",
    'Верно. 76 : 2 = 38, обе части по 38 градусов.',
    'Correct. 76 : 2 = 38, both parts are 38 degrees.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '19°',
      text: L(
        "19 bu 76 ni to'rtga bo'lgan. Bissektrisa IKKI bo'lak beradi.",
        '19 это 76 делённое на четыре. Биссектриса даёт ДВЕ части.',
        '19 divides 76 by four. A bisector gives TWO parts.'),
    },
    {
      when: (s) => s.slots[0] === '152°' || s.slots[1] === '152°',
      text: L(
        "152 bu 76 · 2. Bissektrisa burchakni kattalashtirmaydi, bo'ladi.",
        '152 это 76 · 2. Биссектриса не увеличивает угол, а делит его.',
        '152 is 76 · 2. A bisector divides the angle, it does not double it.'),
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
    "Bissektrisa burchakni nechta teng bo'lakka bo'ladi?",
    'На сколько равных частей биссектриса делит угол?',
    'Into how many equal parts does a bisector split the angle?'),
};

export default function D47_04(props) { return <SlotsBank data={DATA} {...props} />; }
