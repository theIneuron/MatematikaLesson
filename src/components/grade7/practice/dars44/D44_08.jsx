// Dars44 · Amaliyot 08 — Harfli burchaklar · 🔴 · chain · tag: sum_letters
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 8-o'rin `chain`.
// Burchaklar 3x, 2x va 100°: 5x + 100 = 180 -> x = 16, burchaklar 48° va 32°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_letters',
  level: '🔴',
  eyebrow: L(
    'Harf bilan',
    'С буквой',
    'With a letter'),
  setup: L(
    'Ikki burchak harf bilan berilgan. Avval x ni toping, keyin kattaroq burchakni yozing.',
    'Два угла заданы буквой. Сначала найди x, потом запиши больший из них.',
    'Two angles carry a letter. Find x first, then give the larger of them.'),
  given: [['3x', ',', '2x', ',', '100°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['x', '='] }, { slot: 0 }], [{ t: ['katta', 'burchak', '='] }, { slot: 1 }]],
  cards: ['16', '48°', '36', '32°'],
  answer: ['16', '48°'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 3x + 2x + 100 = 180, ya'ni 5x = 80 va x = 16. Burchaklar 48 va 32, kattasi 48.",
    'Верно. 3x + 2x + 100 = 180, значит 5x = 80 и x = 16. Углы 48 и 32, больший 48.',
    'Correct. 3x + 2x + 100 = 180 gives 5x = 80 and x = 16. The angles are 48 and 32, the larger is 48.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '36',
      text: L(
        "36 chiqishi uchun 180 beshga bo'lingan, 100 esa ayirilmagan: avval 180 − 100 = 80.",
        'Чтобы вышло 36, разделили 180 на пять, не вычтя 100: сначала 180 − 100 = 80.',
        '36 divides 180 by five without removing the 100: first 180 − 100 = 80.'),
    },
    {
      when: (s) => s.slots[1] === '32°',
      text: L(
        "32 bu 2x, ya'ni KICHIK burchak. Kattasi 3x = 48.",
        '32 это 2x, МЕНЬШИЙ угол. Больший это 3x = 48.',
        '32 is 2x, the SMALLER angle. The larger is 3x = 48.'),
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
    "Uch burchakni qo'shib 180 ga tenglashtiring, keyin 3x ni hisoblang.",
    'Сложи три угла и приравняй к 180, потом посчитай 3x.',
    'Add the three angles to 180, then compute 3x.'),
};

export default function D44_08(props) { return <SlotsBank data={DATA} {...props} />; }
