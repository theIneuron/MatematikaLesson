// Dars43 · Amaliyot 06 — Uchidan tushgan chiziq · 🟡 · slots · tag: iso_median
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 6-o'rin `slots`.
// Teng yonli uchburchakda uchidan tushgan bissektrisa asosni teng ikkiga bo'ladi: asos 14 -> 7 va 7.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_median',
  level: '🟡',
  eyebrow: L(
    'Uchidan tushgan chiziq',
    'Линия из вершины',
    'The line from the apex'),
  setup: L(
    "Teng yonli uchburchakda uchidan tushgan bissektrisa asosni teng ikki bo'lakka bo'ladi. Ikki bo'lakni yozing.",
    'В равнобедренном треугольнике биссектриса из вершины делит основание на две равные части. Запиши обе части.',
    'In an isosceles triangle the bisector from the apex splits the base into two equal parts.'),
  given: [['asos = 14']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['birinchi', "bo'lak", '='] }, { slot: 0 }, { t: ['ikkinchi', '='] }, { slot: 1 }]],
  cards: ['7', '7 ham', '14', '3,5'],
  answer: ['7', '7 ham'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 14 : 2 = 7, ikki bo'lak ham 7 ga teng.",
    'Верно. 14 : 2 = 7, обе части равны 7.',
    'Correct. 14 : 2 = 7, both parts equal 7.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '3,5',
      text: L(
        "3,5 bu 14 ni to'rtga bo'lgan. Asos IKKI bo'lakka bo'linadi.",
        '3,5 это 14 делённое на четыре. Основание делится на ДВЕ части.',
        '3.5 divides 14 by four. The base splits into TWO parts.'),
    },
    {
      when: (s) => s.slots[0] === '14' || s.slots[1] === '14',
      text: L(
        "14 bu butun asos. Bo'lak esa uning yarmi.",
        '14 это всё основание. А часть это его половина.',
        '14 is the whole base. A part is half of it.'),
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
    "Asosni ikkiga bo'ling: bo'laklar teng.",
    'Раздели основание на два: части равны.',
    'Halve the base: the parts are equal.'),
};

export default function D43_06(props) { return <SlotsBank data={DATA} {...props} />; }
