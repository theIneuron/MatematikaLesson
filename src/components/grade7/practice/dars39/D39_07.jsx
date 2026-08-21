// Dars39 · Amaliyot 07 — Uchinchi tanlov qo'shildi · 🟡 · chain · tag: comb_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 7-o'rin.
// 1-qator: 3 · 5 = 15. 2-qator: yana 2 variantli tanlov qo'shilsa 15 · 2 = 30.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_chain', level: '🟡',
  eyebrow: L('Yangi tanlov', 'Новый выбор', 'A new choice'),
  setup: L(
    "Avval ikki tanlov bor edi, keyin uchinchisi qo'shildi. Yangi tanlov oldingi variantlarni KO'PAYTIRADI.",
    'Сначала было два выбора, потом добавился третий. Новый выбор УМНОЖАЕТ прежние варианты.',
    'There were two choices, then a third joined. A new choice MULTIPLIES the earlier options.'),
  rows: [
    [{ t: ['3', '·', '5', '='] }, { slot: 0 }],
    [{ t: ['yana', '2', 'variant', '→'] }, { slot: 1 }],
  ],
  cards: ['15', '30', '17', '10'],
  answer: ['15', '30'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 · 5 = 15, keyin 15 · 2 = 30. Uchinchi tanlov variantlarni ikki barobar oshirdi.",
    'Верно. 3 · 5 = 15, потом 15 · 2 = 30. Третий выбор удвоил число вариантов.',
    'Correct. 3 · 5 = 15, then 15 · 2 = 30. The third choice doubled the options.'),
  wrongs: [
    { when: (s) => s.slots[1] === '17', text: L(
      "17 bu 15 + 2. Yangi tanlov qo'shilmaydi, ko'paytiriladi: 15 · 2 = 30.",
      '17 это 15 + 2. Новый выбор не прибавляется, а умножается: 15 · 2 = 30.',
      '17 is 15 + 2. A new choice multiplies, it does not add: 15 · 2 = 30.') },
    { when: (s) => s.slots[0] === '10', text: L(
      "10 emas: 3 · 5 = 15.",
      'Не 10: 3 · 5 = 15.',
      'Not 10: 3 · 5 = 15.') },
    { when: (s) => s.slots[0] === '30' || s.slots[1] === '15', text: L(
      "Qatorlar almashib ketdi: birinchi qatorda ikki tanlov, ikkinchisida uchtasi.",
      'Строки перепутались: в первой два выбора, во второй три.',
      'The rows got swapped: two choices first, three in the second.') },
  ],
  wrongText: L(
    "Birinchi qatorni hisoblang, keyin natijani yangi tanlov soniga ko'paytiring.",
    'Посчитай первую строку, потом умножь результат на число новых вариантов.',
    'Work out the first row, then multiply by the new number of options.'),
};

export default function D39_07(props) { return <SlotsBank data={DATA} {...props} />; }
