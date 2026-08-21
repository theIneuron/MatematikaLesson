// Dars21 · Amaliyot 08 — Ikki minus · 🔴 · build · tag: product_two_neg
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
// (3n − 4)(2n − 5) = 6n² − 15n − 8n + 20 = 6n² − 23n + 20.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'product_two_neg', level: '🔴',
  eyebrow: L('Ikki minus', 'Два минуса', 'Two minuses'),
  setup: L(
    "Ikki qavsda ham minus turibdi. O'rta hadlar ikkisi ham manfiy chiqadi, ozod had esa ikki minusdan musbat bo'ladi.",
    'В обеих скобках стоит минус. Оба средних члена выходят отрицательными, а свободный из двух минусов становится положительным.',
    'Both brackets have a minus. Both middle terms come out negative, while the free term turns positive from two minuses.'),
  expr: ['(3n', '−', '4)', '(2n', '−', '5)'], exprSize: 28,
  cards: [
    { id: 'a', label: '6n²' },
    { id: 'b', label: '−23n' },
    { id: 'c', label: '+20' },
    { id: 'd', label: '−7n' },
    { id: 'e', label: '−20' },
    { id: 'f', label: '+23n' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3n · 2n = 6n². O'rtada −15n − 8n = −23n. Ozod had (−4)(−5) = +20.",
    'Верно. 3n · 2n = 6n². В середине −15n − 8n = −23n. Свободный член (−4)(−5) = +20.',
    'Correct. 3n · 2n = 6n². The middle gives −15n − 8n = −23n. The free term is (−4)(−5) = +20.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "−7n chiqishi uchun 15 va 8 ayirilgan. Ikkovi ham manfiy: −15n − 8n = −23n.",
      'Чтобы вышло −7n, из 15 вычли 8. Оба отрицательные: −15n − 8n = −23n.',
      'To get −7n the 8 was taken from 15. Both are negative: −15n − 8n = −23n.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ozod hadda IKKI minus bor: (−4) · (−5) = +20, manfiy emas.",
      'В свободном члене ДВА минуса: (−4) · (−5) = +20, а не отрицательное.',
      'The free term has TWO minuses: (−4) · (−5) = +20, not negative.') },
    { when: (s) => s.seq.indexOf('f') !== -1, text: L(
      "O'rta hadlar ikkisi ham manfiy: 3n · (−5) va (−4) · 2n. Yig'indisi ham manfiy.",
      'Оба средних члена отрицательные: 3n · (−5) и (−4) · 2n. Сумма тоже отрицательная.',
      'Both middle terms are negative: 3n · (−5) and (−4) · 2n. Their sum is negative too.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch had bo'ladi: n², o'rta had va son. Bittasi qo'yilmadi.",
      'В ответе три члена: n², средний и число. Одного не поставил.',
      'The answer has three terms: n², the middle one and the number. One is missing.') },
  ],
  wrongText: L(
    "To'rt ko'paytmani ishorasi bilan yozing, keyin o'rtadagi ikkitasini qo'shing.",
    'Запиши четыре произведения со знаками, потом сложи два средних.',
    'Write the four products with their signs, then add the two middle ones.'),
};

export default function D21_08(props) { return <BuildLine data={DATA} {...props} />; }
