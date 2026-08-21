// Dars32 · Amaliyot 03 — Har hadni bo'lish · 🟢 · build · tag: frac_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin.
// (5x + 15) : 5 = x + 3.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_build', level: '🟢',
  eyebrow: L('Bo\'lish', 'Деление', 'Division'),
  setup: L(
    "Ikki hadning ham bo'luvchiga bo'linishi kerak. Birinchi haddan harf qoladi, ikkinchisidan son.",
    'Оба члена должны разделиться на делитель. От первого остаётся буква, от второго число.',
    'Both terms must be divided. The first leaves a letter, the second a number.'),
  expr: ['(5x', '+', '15)', ':', '5'], exprSize: 30,
  cards: [
    { id: 'a', label: 'x' },
    { id: 'b', label: '+3' },
    { id: 'c', label: '+15' },
    { id: 'd', label: '5x' },
    { id: 'e', label: '+5' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5x : 5 = x va 15 : 5 = 3. Javob x + 3.",
    'Верно. 5x : 5 = x и 15 : 5 = 3. Ответ x + 3.',
    'Correct. 5x : 5 = x and 15 : 5 = 3. The answer is x + 3.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "+15 bo'linmagan: 15 : 5 = 3.",
      '+15 не поделено: 15 : 5 = 3.',
      '+15 was not divided: 15 : 5 = 3.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "5x bo'linmagan: 5x : 5 = x.",
      '5x не поделено: 5x : 5 = x.',
      '5x was not divided: 5x : 5 = x.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "+5 chiqishi uchun 15 dan 5 ayirilgan. Bo'lish kerak: 15 : 5 = 3.",
      'Чтобы вышло +5, из 15 вычли 5. Нужно делить: 15 : 5 = 3.',
      'To get +5 the 5 was subtracted from 15. It must be divided: 15 : 5 = 3.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi.",
      'В ответе два члена.',
      'The answer has two terms.') },
  ],
  wrongText: L(
    "Har hadni alohida 5 ga bo'ling.",
    'Раздели каждый член на 5 по отдельности.',
    'Divide each term by 5 separately.'),
};

export default function D32_03(props) { return <BuildLine data={DATA} {...props} />; }
