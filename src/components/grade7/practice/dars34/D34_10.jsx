// Dars34 · Amaliyot 10 — Ikki qadamli zanjir · 🔴 · chain · tag: fn_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 10-o'rin.
// f(x) = 2x − 5. 1-qator: f(4) = 3. 2-qator: f(3) = 1 -- birinchi natija
// ikkinchi qatorda argument bo'lib ishlatiladi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_chain', level: '🔴',
  eyebrow: L('Zanjir', 'Цепочка', 'A chain'),
  setup: L(
    "Birinchi qatorda f(4) hisoblanadi, ikkinchi qatorda esa uning natijasi argument bo'lib qaytadi.",
    'В первой строке считается f(4), а во второй его результат сам становится аргументом.',
    'The first row works out f(4); in the second its result becomes the argument.'),
  given: [['f(x)', '=', '2x', '−', '5']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  rows: [
    [{ t: ['f(4)', '='] }, { slot: 0 }],
    [{ t: ['f(f(4))', '='] }, { slot: 1 }],
  ],
  cards: ['3', '1', '8', '11'],
  answer: ['3', '1'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. f(4) = 8 − 5 = 3, keyin f(3) = 6 − 5 = 1.",
    'Верно. f(4) = 8 − 5 = 3, потом f(3) = 6 − 5 = 1.',
    'Correct. f(4) = 8 − 5 = 3, then f(3) = 6 − 5 = 1.'),
  wrongs: [
    { when: (s) => s.slots[0] === '8', text: L(
      "8 bu faqat 2 · 4. Formulada yana −5 turibdi: 8 − 5 = 3.",
      '8 это только 2 · 4. В формуле есть ещё −5: 8 − 5 = 3.',
      '8 is only 2 · 4. The rule also has −5: 8 − 5 = 3.') },
    { when: (s) => s.slots[1] === '11', text: L(
      "Ikkinchi qatorda argument 3, 8 emas: f(3) = 6 − 5 = 1.",
      'Во второй строке аргумент 3, а не 8: f(3) = 6 − 5 = 1.',
      'The second row takes 3 as the argument, not 8: f(3) = 6 − 5 = 1.') },
    { when: (s) => s.slots[0] === '1' || s.slots[1] === '3', text: L(
      "Qatorlar almashib ketdi: birinchi qatorda f(4), ikkinchisida f(3).",
      'Строки перепутались: в первой f(4), во второй f(3).',
      'The rows got swapped: f(4) first, then f(3).') },
  ],
  wrongText: L(
    "Birinchi qatorni hisoblang, natijani ikkinchi qatorga argument sifatida qo'ying.",
    'Посчитай первую строку и поставь результат аргументом во вторую.',
    'Work out the first row and use its result as the argument in the second.'),
};

export default function D34_10(props) { return <SlotsBank data={DATA} {...props} />; }
