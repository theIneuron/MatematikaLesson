// Dars33 · Amaliyot 10 — Kesmaning o'rtasi · 🔴 · slots · tag: point_middle
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 10-o'rin `slots`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// A(−6; 4), B(10; 4): o'rta nuqtaning abssissasi (−6 + 10) : 2 = 2, ordinatasi 4.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'point_middle',
  level: '🔴',
  eyebrow: L(
    "Kesmaning o'rtasi",
    'Середина отрезка',
    'Midpoint'),
  setup: L(
    "Kesma gorizontal: ordinatalar bir xil. O'rta nuqtaning abssissasi ikki abssissaning o'rtasida turadi.",
    'Отрезок горизонтальный: ординаты равны. Абсцисса середины стоит посередине между двумя абсциссами.',
    'The segment is horizontal: the ordinates match. The midpoint abscissa sits halfway between the two.'),
  given: [['A(−6; 4)', ',', 'B(10; 4)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: [L('abssissa', 'абсцисса', 'abscissa'), '='] }, { slot: 0 }, { t: [L('ordinata', 'ордината', 'ordinate'), '='] }, { slot: 1 }]],
  cards: ['2', '4', '8', '16'],
  answer: ['2', '4'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. (−6 + 10) : 2 = 2, ordinata esa o'zgarmaydi: 4.",
    'Верно. (−6 + 10) : 2 = 2, а ордината не меняется: 4.',
    'Correct. (−6 + 10) : 2 = 2, and the ordinate stays 4.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '8',
      text: L(
        "8 chiqishi uchun 16 ikkiga bo'lingan: bu kesma UZUNLIGINING yarmi, o'rta nuqta emas.",
        'Чтобы вышло 8, делили 16: это половина ДЛИНЫ, а не середина.',
        '8 halves 16, which is half the LENGTH, not the midpoint.'),
    },
    {
      when: (s) => s.slots[0] === '16' || s.slots[1] === '16',
      text: L(
        "16 bu kesmaning uzunligi: 10 − (−6). O'rta nuqta esa yarmiga siljigan nuqta.",
        '16 это длина отрезка: 10 − (−6). А середина это точка, сдвинутая на половину.',
        '16 is the length: 10 − (−6). The midpoint is the point shifted by half.'),
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
    "Ikki abssissani qo'shib ikkiga bo'ling. Ordinata o'zgarmaydi.",
    'Сложи две абсциссы и раздели на два. Ордината не меняется.',
    'Add the two abscissas and halve. The ordinate is unchanged.'),
};

export default function D33_10(props) { return <SlotsBank data={DATA} {...props} />; }
