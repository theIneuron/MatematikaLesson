// Dars41 · Amaliyot 10 — Harf bilan · 🔴 · chain · tag: kind_letter_p
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 10-o'rin `chain`.
// Tomonlar x, x va x + 4, P = 34: 3x + 4 = 34 -> x = 10, asos 14.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'kind_letter_p',
  level: '🔴',
  eyebrow: L(
    'Harf bilan',
    'С буквой',
    'With a letter'),
  setup: L(
    "Yon tomonlar x, asos esa x + 4. Ikki qatorni to'ldiring: avval x, keyin asos.",
    'Боковые равны x, основание x + 4. Заполни две строки: сначала x, потом основание.',
    'The legs are x and the base is x + 4. Fill both rows: x first, then the base.'),
  given: [['x, x', 'va', 'x + 4', ';', 'P = 34']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['x', '='] }, { slot: 0 }], [{ t: ['asos', '='] }, { slot: 1 }]],
  cards: ['10', '14', '11', '34'],
  answer: ['10', '14'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. x + x + x + 4 = 34, ya'ni 3x = 30 va x = 10. Asos 10 + 4 = 14.",
    'Верно. x + x + x + 4 = 34, значит 3x = 30 и x = 10. Основание 10 + 4 = 14.',
    'Correct. x + x + x + 4 = 34 gives 3x = 30 and x = 10. The base is 10 + 4 = 14.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '11',
      text: L(
        "11 chiqishi uchun 34 uchga bo'lingan, lekin +4 ayirilmagan: avval 34 − 4 = 30.",
        'Чтобы вышло 11, разделили 34 на три, не вычтя +4: сначала 34 − 4 = 30.',
        '11 divides 34 by three without removing the +4: first 34 − 4 = 30.'),
    },
    {
      when: (s) => s.slots[1] === '10',
      text: L(
        '10 bu yon tomon. Asos undan 4 ga katta: 14.',
        '10 это боковая сторона. Основание на 4 больше: 14.',
        '10 is the leg. The base is 4 more: 14.'),
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
    "Uch tomonni qo'shing: x + x + (x + 4). Yig'indi 34 ga teng.",
    'Сложи три стороны: x + x + (x + 4). Сумма равна 34.',
    'Add the three sides: x + x + (x + 4). The sum is 34.'),
};

export default function D41_10(props) { return <SlotsBank data={DATA} {...props} />; }
