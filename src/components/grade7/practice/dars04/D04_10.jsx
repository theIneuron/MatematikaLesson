// Dars04 · Amaliyot 10 — Ikki qavs birga · 🔴 · build · tag: id_two_brackets
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
// 3(x + 4) − 2(x − 1) = 3x + 12 − 2x + 2 = x + 14.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'id_two_brackets', level: '🔴',
  eyebrow: L('Ikki qavs', 'Две скобки', 'Two brackets'),
  setup: L(
    "Ikkinchi qavs oldida minus va ko'paytuvchi birga turadi: −2 ni ikki hadga ham ko'paytirish kerak, shunda ikkinchi had musbat bo'ladi.",
    'Перед второй скобкой стоят и минус, и множитель: −2 надо умножить на оба члена, тогда второй станет положительным.',
    'The second bracket carries both a minus and a factor: multiply −2 by both terms, making the second positive.'),
  expr: ['3(x', '+', '4)', '−', '2(x', '−', '1)'], exprSize: 26,
  cards: [
    { id: 'a', label: 'x' },
    { id: 'b', label: '+14' },
    { id: 'c', label: '+10' },
    { id: 'd', label: '5x' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3x + 12 − 2x + 2: x lar 3 − 2 = 1, sonlar 12 + 2 = 14. Javob x + 14.",
    'Верно. 3x + 12 − 2x + 2: иксы 3 − 2 = 1, числа 12 + 2 = 14. Ответ x + 14.',
    'Correct. 3x + 12 − 2x + 2: the x give 3 − 2 = 1 and the numbers 12 + 2 = 14. The answer is x + 14.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "+10 chiqishi uchun 12 dan 2 ayirilgan. −2 · (−1) = +2, ya'ni sonlar qo'shiladi: 12 + 2 = 14.",
      'Чтобы вышло +10, из 12 вычли 2. Но −2 · (−1) = +2, значит числа складываются: 12 + 2 = 14.',
      'To get +10 the 2 was subtracted from 12. But −2 · (−1) = +2, so add: 12 + 2 = 14.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "5x chiqishi uchun x lar qo'shilgan. Ikkinchi qavs oldida minus turibdi: 3x − 2x = x.",
      'Чтобы вышло 5x, иксы сложили. Перед второй скобкой минус: 3x − 2x = x.',
      'To get 5x the x were added. The second bracket has a minus: 3x − 2x = x.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: x li had va son.",
      'В ответе два члена: с x и число.',
      'The answer has two terms: the x term and a number.') },
  ],
  wrongText: L(
    "Ikki qavsni oching: ikkinchisida −2 ni ikki hadga ham ko'paytiring, ikki minusga e'tibor bering.",
    'Раскрой обе скобки: во второй умножь −2 на оба члена, следи за двумя минусами.',
    'Open both brackets: multiply −2 by both terms in the second and watch the two minuses.'),
};

export default function D04_10(props) { return <BuildLine data={DATA} {...props} />; }
