// Dars41 · Amaliyot 06 — Bissektrisa · 🟡 · slots · tag: ang_bisector
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 6-o'rin.
// 76° burchakning bissektrisasi ikki teng burchak beradi: 38° va 38°.
// Qo'shnisi esa 180 − 76 = 104°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_bisector', level: '🟡',
  eyebrow: L('Bissektrisa', 'Биссектриса', 'The bisector'),
  setup: L(
    "Bissektrisa burchakni teng ikkiga bo'ladi. Qo'shni burchak esa 180 gradusga to'ldiradi -- ikki savol aralashtirilmasin.",
    'Биссектриса делит угол пополам. А смежный угол дополняет до 180 градусов — не смешивай два вопроса.',
    'A bisector halves the angle. The adjacent angle completes 180 — do not mix the two.'),
  given: [['∠1', '=', '76°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['yarmi', '='] }, { slot: 0 }, { t: ["qo'shnisi", '='] }, { slot: 1 }],
  ],
  cards: ['38°', '104°', '152°', '14°'],
  answer: ['38°', '104°'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 76 : 2 = 38 va 180 − 76 = 104.",
    'Верно. 76 : 2 = 38 и 180 − 76 = 104.',
    'Correct. 76 : 2 = 38 and 180 − 76 = 104.'),
  wrongs: [
    { when: (s) => s.slots[0] === '152°', text: L(
      "152 bu 76 · 2. Bissektrisa burchakni BO'LADI, ko'paytirmaydi.",
      '152 это 76 · 2. Биссектриса ДЕЛИТ угол, а не умножает.',
      '152 is 76 · 2. A bisector DIVIDES the angle.') },
    { when: (s) => s.slots[1] === '14°', text: L(
      "14 bu 90 − 76. Qo'shni burchak esa 180 dan hisoblanadi.",
      '14 это 90 − 76. А смежный угол считается от 180.',
      '14 is 90 − 76. The adjacent angle comes from 180.') },
  ],
  wrongText: L(
    "Bissektrisa uchun bo'lish, qo'shni burchak uchun 180 dan ayirish kerak.",
    'Для биссектрисы деление, для смежного угла вычитание из 180.',
    'Halve for the bisector; subtract from 180 for the adjacent angle.'),
};

export default function D41_06(props) { return <SlotsBank data={DATA} {...props} />; }
