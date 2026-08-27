// Dars31 · Amaliyot 09 — Ajratish va tekshirish · 🔴 · chain · tag: cube_chain_check
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 9-o'rin.
// 1-qator: y³ + 1000 = (y + 10)(y² − 10y + 100)
// 2-qator: y = 0 bo'lganda 10 · 100 = 1000; asl yozuvda ham 1000.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_chain_check', level: '🔴',
  eyebrow: L('Ajratish va tekshirish', 'Разложить и проверить', 'Factor and check'),
  setup: L(
    "Ajratish to'g'ri ekanini nol qo'yib tekshirish qulay: ikki qavsning ko'paytmasi asl sonni berishi kerak.",
    'Разложение удобно проверить подстановкой нуля: произведение двух скобок должно дать исходное число.',
    'Substituting zero is a handy check: the product of the brackets must give the original number.'),
  rows: [
    [{ t: ['y³', '+', '1000', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['y', '=', '0', '→'] }, { slot: 2 }],
  ],
  cards: ['(y + 10)', '(y² − 10y + 100)', '1000', '(y − 10)', '(y² + 10y + 100)', '100'],
  answer: ['(y + 10)', '(y² − 10y + 100)', '1000'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 1000 = 10³. y = 0 bo'lganda 10 · 100 = 1000, ya'ni ajratish to'g'ri.",
    'Верно. 1000 = 10³. При y = 0 выходит 10 · 100 = 1000, значит разложение верное.',
    'Correct. 1000 = 10³. With y = 0 it gives 10 · 100 = 1000, so the split is right.'),
  wrongs: [
    { when: (s) => s.slots[0] === '(y − 10)', text: L(
      "Yozuvda yig'indi turibdi, ya'ni birinchi qavs ham yig'indi.",
      'В записи сумма, значит и первая скобка сумма.',
      'The record is a sum, so the first bracket is a sum.') },
    { when: (s) => s.slots[1] === '(y² + 10y + 100)', text: L(
      "Yig'indi uchun to'liqsiz kvadratda MINUS bo'ladi: y² − 10y + 100.",
      'Для суммы в неполном квадрате МИНУС: y² − 10y + 100.',
      'For a sum the incomplete square takes a MINUS: y² − 10y + 100.') },
    { when: (s) => s.slots[2] === '100', text: L(
      "y = 0 bo'lganda birinchi qavs 10, ikkinchisi 100: ko'paytmasi 1000.",
      'При y = 0 первая скобка равна 10, вторая 100: произведение 1000.',
      'With y = 0 the first bracket is 10 and the second 100: the product is 1000.') },
  ],
  wrongText: L(
    "1000 nimaning kubi? Keyin nol qo'yib ikki qavsning ko'paytmasini hisoblang.",
    'Куб чего такое 1000? Потом подставь нуль и посчитай произведение скобок.',
    '1000 is the cube of what? Then put zero in and multiply the brackets.'),
};

export default function D31_09(props) { return <SlotsBank data={DATA} {...props} />; }
