// Dars26 · Amaliyot 04 — Ajratish, keyin qiymat · 🟡 · chain · tag: diff_sq_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 4-o'rin.
// 1-qator: 121 − t² = (11 − t)(11 + t)
// 2-qator: t = 1 bo'lganda 10 · 12 = 120; tekshirish 121 − 1 = 120.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'diff_sq_chain', level: '🟡',
  eyebrow: L('Ajratish va tekshirish', 'Разложить и проверить', 'Factor and check'),
  setup: L(
    "Kvadratlar ayirmasi ikki qavsga ajraladi. Ajratish to'g'ri ekanini son qo'yib tekshirish mumkin.",
    'Разность квадратов раскладывается на две скобки. Правильность разложения можно проверить подстановкой числа.',
    'A difference of squares splits into two brackets. Substituting a number checks the split.'),
  rows: [
    [{ t: ['121', '−', 't²', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['t', '=', '1', '→'] }, { slot: 2 }],
  ],
  cards: ['(11 − t)', '(11 + t)', '120', '(11 − t)²', '(121 − t)', '122'],
  answer: ['(11 − t)', '(11 + t)', '120'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 121 = 11², ya'ni (11 − t)(11 + t). t = 1 bo'lganda 10 · 12 = 120, va 121 − 1 = 120.",
    'Верно. 121 = 11², значит (11 − t)(11 + t). При t = 1 выходит 10 · 12 = 120, и 121 − 1 = 120.',
    'Correct. 121 = 11², so (11 − t)(11 + t). With t = 1 it gives 10 · 12 = 120, and 121 − 1 = 120.'),
  wrongs: [
    { when: (s) => s.slots[0] === '(11 − t)²' || s.slots[1] === '(11 − t)²', text: L(
      "Kvadrat emas: (11 − t)² ochilsa o'rta had paydo bo'ladi. Ayirmada esa ikki qavs QARAMA-QARSHI ishorali.",
      'Не квадрат: раскрытие (11 − t)² даёт средний член. А в разности две скобки с ПРОТИВОПОЛОЖНЫМИ знаками.',
      'Not a square: opening (11 − t)² gives a middle term. A difference needs OPPOSITE signs.') },
    { when: (s) => s.slots[0] === '(121 − t)' || s.slots[1] === '(121 − t)', text: L(
      "Qavsga sonning o'zi emas, uning ildizi yoziladi: 121 = 11².",
      'В скобку пишется не само число, а его корень: 121 = 11².',
      'The bracket takes the root, not the number itself: 121 = 11².') },
    { when: (s) => s.slots[2] === '122', text: L(
      "t = 1 bo'lganda qavslar 10 va 12 bo'ladi, ko'paytmasi 120.",
      'При t = 1 скобки равны 10 и 12, произведение 120.',
      'With t = 1 the brackets are 10 and 12, and the product is 120.') },
  ],
  wrongText: L(
    "121 nimaning kvadrati? Ikki qavs ishorasi bilan farq qilishi kerak.",
    'Квадрат чего такое 121? Две скобки должны различаться знаком.',
    '121 is the square of what? The two brackets must differ in sign.'),
};

export default function D26_04(props) { return <SlotsBank data={DATA} {...props} />; }
