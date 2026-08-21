// Dars19 · Amaliyot 09 — Ikki harfli qo'shish · 🔴 · slots · tag: add_two_letters
// Faqat MA'LUMOT. Mexanika: kit.jsx -> SlotsBank. Raskladka: 9-o'rin.
//
// (7x² − 3xy + y²) + (−2x² + 8xy) = 5x² + 5xy + y²
//   x²: 7 − 2 = 5     xy: −3 + 8 = 5     y²: o'xshashi yo'q, qoladi
// Kartalar orasida 9x² (ayirish o'rniga qo'shgan), −5xy (ishora), −y² turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'add_two_letters', level: '🔴',
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Ikkinchi qavsda manfiy had bor, lekin qavs oldida plyus turibdi -- ishoralar o'zgarmaydi. y² ning o'xshashi yo'q, u o'z holida qoladi.",
    'Во второй скобке есть отрицательный член, но перед скобкой плюс — знаки не меняются. У y² подобных нет, он остаётся как есть.',
    'The second bracket holds a negative term, but the bracket has a plus — no signs change. y² has no like term and stays.'),
  rows: [
    [{ t: ['(7x²', '−', '3xy', '+', 'y²)', '+', '(−2x²', '+', '8xy)', '='] }, { slot: 0 }, { slot: 1 }, { slot: 2 }],
  ],
  cards: ['5x²', '+5xy', '+y²', '9x²', '−5xy', '−y²'],
  answer: ['5x²', '+5xy', '+y²'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x²: 7 − 2 = 5. xy: −3 + 8 = 5. y² ning o'xshashi yo'q, shuning uchun o'zgarmaydi.",
    'Верно. x²: 7 − 2 = 5. xy: −3 + 8 = 5. У y² подобных нет, поэтому он не меняется.',
    'Correct. x²: 7 − 2 = 5. xy: −3 + 8 = 5. y² has no like term, so it stays unchanged.'),
  wrongs: [
    { when: (s) => s.slots[0] === '9x²', text: L(
      "9x² chiqishi uchun 7 va 2 qo'shilgan. Ikkinchi qavsda −2x² turibdi, ya'ni ayiriladi: 7 − 2 = 5.",
      'Чтобы вышло 9x², сложили 7 и 2. Во второй скобке стоит −2x², значит вычитаем: 7 − 2 = 5.',
      'To get 9x² the 7 and 2 were added. The second bracket has −2x², so subtract: 7 − 2 = 5.') },
    { when: (s) => s.slots[1] === '−5xy', text: L(
      "Ishorani tekshiring: −3 + 8 = +5, chunki sakkiz uchdan katta.",
      'Проверь знак: −3 + 8 = +5, потому что восемь больше трёх.',
      'Check the sign: −3 + 8 = +5, because eight is bigger than three.') },
    { when: (s) => s.slots[2] === '−y²', text: L(
      "y² musbat edi va qavs oldida plyus turgan: ishorasi o'zgarmaydi.",
      'y² был положительным, и перед скобкой стоит плюс: знак не меняется.',
      'y² was positive and the bracket has a plus: the sign does not change.') },
  ],
  wrongText: L(
    "Uch guruhni alohida qo'shing: x², xy va y². Har guruhda koeffitsiyentlarni ishorasi bilan hisoblang.",
    'Сложи три группы по отдельности: x², xy и y². В каждой считай коэффициенты со знаками.',
    'Add three groups separately: x², xy and y². In each, add the coefficients with their signs.'),
};

export default function D19_09(props) { return <SlotsBank data={DATA} {...props} />; }
