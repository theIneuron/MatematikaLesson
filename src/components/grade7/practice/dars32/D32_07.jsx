// Dars32 · Amaliyot 07 — Ikki bo'luvchi · 🟡 · slots · tag: frac_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin.
// (x² − 25) : (x − 5) = x + 5
// (x² − 25) : (x + 5) = x − 5
// Bir xil bo'linuvchi, ikki xil bo'luvchi -- ikki xil javob.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_slots', level: '🟡',
  eyebrow: L("Ikki bo'luvchi", 'Два делителя', 'Two divisors'),
  setup: L(
    "Bo'linuvchi bir xil: x² − 25 = (x − 5)(x + 5). Bo'luvchi qaysi qavsni olsa, javobda ikkinchisi qoladi.",
    'Делимое одно: x² − 25 = (x − 5)(x + 5). Какую скобку забирает делитель, та и уходит, а вторая остаётся.',
    'The dividend is the same: x² − 25 = (x − 5)(x + 5). Whichever bracket the divisor takes, the other remains.'),
  rows: [
    [{ t: ['(x²', '−', '25)', ':', '(x', '−', '5)', '='] }, { slot: 0 }],
    [{ t: ['(x²', '−', '25)', ':', '(x', '+', '5)', '='] }, { slot: 1 }],
  ],
  cards: ['x + 5', 'x − 5', 'x² + 5', 'x − 25'],
  answer: ['x + 5', 'x − 5'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (x − 5)(x + 5) : (x − 5) = x + 5, va (x − 5)(x + 5) : (x + 5) = x − 5.",
    'Верно. (x − 5)(x + 5) : (x − 5) = x + 5, а (x − 5)(x + 5) : (x + 5) = x − 5.',
    'Correct. (x − 5)(x + 5) : (x − 5) = x + 5, and dividing by (x + 5) leaves x − 5.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'x − 5' || s.slots[1] === 'x + 5', text: L(
      "Javoblar almashib ketdi: bo'luvchi bilan bir xil qavs qisqaradi, IKKINCHISI qoladi.",
      'Ответы перепутались: сокращается скобка, совпадающая с делителем, а остаётся ВТОРАЯ.',
      'The answers got swapped: the bracket matching the divisor cancels and the OTHER one remains.') },
    { when: (s) => s.slots[0] === 'x − 25' || s.slots[1] === 'x − 25', text: L(
      "25 ning ildizi 5: qavslarda 5 turadi.",
      'Корень из 25 это 5: в скобках стоит 5.',
      'The root of 25 is 5: the brackets hold 5.') },
    { when: (s) => s.slots[0] === 'x² + 5' || s.slots[1] === 'x² + 5', text: L(
      "Qisqargandan keyin daraja qolmaydi: ikki qavsdan biri ketadi, ikkinchisi birinchi darajali.",
      'После сокращения степени не остаётся: одна из двух скобок уходит, вторая первой степени.',
      'After cancelling no power remains: one bracket leaves and the other is first degree.') },
  ],
  wrongText: L(
    "Bo'linuvchini ajratib yozing, keyin bo'luvchi bilan bir xil qavsni qisqartiring.",
    'Разложи делимое, потом сократи скобку, совпадающую с делителем.',
    'Factorise the dividend, then cancel the bracket that matches the divisor.'),
};

export default function D32_07(props) { return <SlotsBank data={DATA} {...props} />; }
