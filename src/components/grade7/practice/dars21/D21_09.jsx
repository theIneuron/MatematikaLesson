// Dars21 · Amaliyot 09 — Ikki harf · 🔴 · slots · tag: product_two_letters
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 9-o'rin.
// (2p + q)(3p − 4q) = 6p² − 8pq + 3pq − 4q² = 6p² − 5pq − 4q².
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'product_two_letters', level: '🔴',
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Ikki harf bo'lganda o'rtadagi hadlar pq ko'rinishida chiqadi -- ular o'xshash va ixchamlanadi. Chetdagi hadlar esa p² va q².",
    'Когда букв две, средние члены выходят вида pq — они подобны и приводятся. А крайние члены это p² и q².',
    'With two letters the middle terms come out as pq — they are alike and collect. The outer terms are p² and q².'),
  rows: [
    [{ t: ['(2p', '+', 'q)', '(3p', '−', '4q)', '='] }, { slot: 0 }, { slot: 1 }, { slot: 2 }],
  ],
  cards: ['6p²', '−5pq', '−4q²', '+5pq', '6p', '+4q²'],
  answer: ['6p²', '−5pq', '−4q²'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2p · 3p = 6p². O'rtada −8pq + 3pq = −5pq. Oxirida q · (−4q) = −4q².",
    'Верно. 2p · 3p = 6p². В середине −8pq + 3pq = −5pq. В конце q · (−4q) = −4q².',
    'Correct. 2p · 3p = 6p². The middle gives −8pq + 3pq = −5pq. At the end q · (−4q) = −4q².'),
  wrongs: [
    { when: (s) => s.slots[1] === '+5pq', text: L(
      "Ishorani tekshiring: −8pq va +3pq. Sakkiz uchdan katta, ya'ni yig'indi manfiy: −5pq.",
      'Проверь знак: −8pq и +3pq. Восемь больше трёх, значит сумма отрицательная: −5pq.',
      'Check the sign: −8pq and +3pq. Eight beats three, so the sum is negative: −5pq.') },
    { when: (s) => s.slots[2] === '+4q²', text: L(
      "Oxirgi ko'paytmada bitta minus bor: q · (−4q) = −4q².",
      'В последнем произведении один минус: q · (−4q) = −4q².',
      'The last product has one minus: q · (−4q) = −4q².') },
    { when: (s) => s.slots[0] === '6p', text: L(
      "2p · 3p da harflar ham ko'paytiriladi: p · p = p², ya'ni 6p².",
      'В 2p · 3p буквы тоже перемножаются: p · p = p², значит 6p².',
      'In 2p · 3p the letters multiply too: p · p = p², so 6p².') },
  ],
  wrongText: L(
    "To'rt ko'paytmani yozing: 2p·3p, 2p·(−4q), q·3p, q·(−4q). O'rtadagi ikkitasi o'xshash.",
    'Запиши четыре произведения: 2p·3p, 2p·(−4q), q·3p, q·(−4q). Два средних подобны.',
    'Write the four products: 2p·3p, 2p·(−4q), q·3p, q·(−4q). The two middle ones are alike.'),
};

export default function D21_09(props) { return <SlotsBank data={DATA} {...props} />; }
