// Dars31 · Amaliyot 09 — Ajratish va tekshirish · 🔴 · chain · tag: cube_chain_check
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 9-o'rin.
// 1-qator: y³ + 1000 = (y + 10)(y² − 10y + 100)
// 2-qator: y = 1 bo'lganda 11 · 91 = 1001. NEGA NOL EMAS: nolda natija 1000
// chiqadi, ya'ni javob shartning O'ZIDA turadi va ko'chirib qo'yish mumkin.
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
    [{ t: ['y', '=', '1', '→'] }, { slot: 2 }],
  ],
  cards: ['(y + 10)', '(y² − 10y + 100)', '1001', '(y − 10)', '(y² + 10y + 100)', '100'],
  answer: ['(y + 10)', '(y² − 10y + 100)', '1001'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 1000 = 10³. y = 1 bo'lganda 11 · 91 = 1001, y³ + 1000 ham 1001 beradi.",
    'Верно. 1000 = 10³. При y = 1 выходит 11 · 91 = 1001, и y³ + 1000 тоже даёт 1001.',
    'Correct. 1000 = 10³. With y = 1 it gives 11 · 91 = 1001, and y³ + 1000 gives 1001 too.'),
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
      "y = 1 bo'lganda birinchi qavs 11, ikkinchisi 91: ko'paytmasi 1001.",
      'При y = 1 первая скобка равна 11, вторая 91: произведение 1001.',
      'With y = 1 the first bracket is 11 and the second 91: the product is 1001.') },
  ],
  wrongText: L(
    "1000 nimaning kubi? Keyin y = 1 qo'yib ikki qavsning ko'paytmasini hisoblang.",
    'Куб чего такое 1000? Потом подставь единицу и посчитай произведение скобок.',
    '1000 is the cube of what? Then put one in and multiply the brackets.'),
};

export default function D31_09(props) { return <SlotsBank data={DATA} {...props} />; }
