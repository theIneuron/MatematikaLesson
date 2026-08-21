// Dars29 · Amaliyot 07 — Uch uya · 🟡 · slots · tag: fact_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin.
// 3k³ − 12k = 3k(k² − 4) = 3k(k − 2)(k + 2).
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'fact_slots', level: '🟡',
  eyebrow: L('Uch ko\'paytuvchi', 'Три множителя', 'Three factors'),
  setup: L(
    "Umumiy ko'paytuvchida harf ham bor: 3k. Undan keyin qavs ichida kvadratlar ayirmasi qoladi.",
    'В общем множителе есть и буква: 3k. После выноса в скобке остаётся разность квадратов.',
    'The common factor includes a letter: 3k. Then a difference of squares stays inside.'),
  rows: [
    [{ t: ['3k³', '−', '12k', '='] }, { slot: 0 }, { slot: 1 }, { slot: 2 }],
  ],
  cards: ['3k', '(k − 2)', '(k + 2)', '3', '(k − 4)', '(k² + 4)'],
  answer: ['3k', '(k − 2)', '(k + 2)'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3k chiqdi, qavs ichida k² − 4 qoldi va u (k − 2)(k + 2) ga ajraladi.",
    'Верно. Вынесли 3k, в скобке осталось k² − 4, а оно раскладывается на (k − 2)(k + 2).',
    'Correct. 3k came out, leaving k² − 4, which splits into (k − 2)(k + 2).'),
  wrongs: [
    { when: (s) => s.slots[0] === '3', text: L(
      "Faqat 3 ni chiqarish kam: ikki hadda ham k bor. Umumiy ko'paytuvchi 3k.",
      'Вынести только 3 мало: в обоих членах есть k. Общий множитель 3k.',
      'Taking out only 3 is not enough: both terms have a k. The common factor is 3k.') },
    { when: (s) => s.slots[1] === '(k − 4)' || s.slots[2] === '(k − 4)', text: L(
      "4 ning ildizi 2: qavsda 2 turadi.",
      'Корень из 4 это 2: в скобке стоит 2.',
      'The root of 4 is 2: the bracket holds 2.') },
    { when: (s) => s.slots[1] === '(k² + 4)' || s.slots[2] === '(k² + 4)', text: L(
      "k² + 4 yig'indi: u ajralmaydi. Bizda esa ayirma turibdi.",
      'k² + 4 это сумма: она не разлагается. А у нас разность.',
      'k² + 4 is a sum and does not split. We have a difference.') },
  ],
  wrongText: L(
    "Ikki hadda nima umumiy -- son va harf? Qavs ichida nima qoladi?",
    'Что общего у двух членов — число и буква? Что остаётся в скобке?',
    'What do the two terms share — a number and a letter? What stays inside?'),
};

export default function D29_07(props) { return <SlotsBank data={DATA} {...props} />; }
