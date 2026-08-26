// Dars47 · Amaliyot 10 — Transportirsiz 45 gradus · 🔴 · chain · tag: comp_45_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 10-o'rin `chain`.
// To'g'ri burchakning bissektrisasi 45° beradi: 90 : 2 = 45, transportir kerak emas.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'comp_45_chain',
  level: '🔴',
  eyebrow: L(
    'Transportirsiz',
    'Без транспортира',
    'Without a protractor'),
  setup: L(
    "Yasash o'lchamaydi, u tenglikdan foydalanadi. To'g'ri burchakka bissektrisa o'tkazsak, o'lchamasdan aniq burchak chiqadi.",
    'Построение не измеряет, оно опирается на равенство. Биссектриса прямого угла даёт точный угол без измерения.',
    'A construction does not measure, it uses equality. Bisecting a right angle gives an exact angle with no measuring.'),
  given: [['90°']],
  givenLabel: L(
    'Burchak:',
    'Угол:',
    'Angle:'),
  rows: [
    [{ t: [L('bissektrisa', 'биссектриса', 'bisector'), L('beradi', 'даёт', 'gives')] }, { slot: 0 }],
    [{ t: [L('yana', 'ещё раз', 'again'), L('bir', 'один', 'one'), L('marta', 'раз', 'times'), L('bissektrisa', 'биссектриса', 'bisector')] }, { slot: 1 }],
  ],
  cards: ['45°', '22,5°', '90°', '30°'],
  answer: ['45°', '22,5°'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 90 : 2 = 45, keyin 45 : 2 = 22,5. Ikkovi ham o'lchovsiz chiqadi.",
    'Верно. 90 : 2 = 45, затем 45 : 2 = 22,5. И то и другое получается без измерения.',
    'Correct. 90 : 2 = 45, then 45 : 2 = 22.5. Both come without measuring.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '30°',
      text: L(
        "30 chiqishi uchun 90 uchga bo'lingan. Bissektrisa esa IKKIGA bo'ladi.",
        'Чтобы вышло 30, делили 90 на три. А биссектриса делит на ДВА.',
        '30 divides 90 by three. A bisector divides by TWO.'),
    },
    {
      when: (s) => s.slots[1] === '45°',
      text: L(
        "Ikkinchi bissektrisa 45 ni bo'ladi: 45 : 2 = 22,5.",
        'Вторая биссектриса делит 45: 45 : 2 = 22,5.',
        'The second bisector halves 45: 45 : 2 = 22.5.'),
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
    "Har bissektrisa burchakni ikkiga bo'ladi. Ikki marta bo'lsa nima chiqadi?",
    'Каждая биссектриса делит угол на два. Что будет после двух раз?',
    'Each bisector halves the angle. What comes after two of them?'),
};

export default function D47_10(props) { return <SlotsBank data={DATA} {...props} />; }
