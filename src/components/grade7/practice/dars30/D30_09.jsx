// Dars30 · Amaliyot 09 — Kvadrat va ayirma birga · 🔴 · build · tag: whole_two_formulas
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// (x + 5)² − (x + 5)(x − 5) = (x² + 10x + 25) − (x² − 25) = 10x + 50.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_two_formulas', level: '🔴',
  eyebrow: L('Ikki formula', 'Две формулы', 'Two formulas'),
  setup: L(
    "Bir yozuvda kvadrat va kvadratlar ayirmasi bor. Ikkovini ochib, keyin ikkinchisining ikki hadini ag'darish kerak.",
    'В одной записи и квадрат, и разность квадратов. Раскрыть обе, потом перевернуть оба члена второй.',
    'One record holds a square and a difference of squares. Expand both, then flip both terms of the second.'),
  expr: ['(x', '+', '5)²', '−', '(x', '+', '5)', '(x', '−', '5)'], exprSize: 24,
  cards: [
    { id: 'a', label: '10x' },
    { id: 'b', label: '+50' },
    { id: 'c', label: '+0' },
    { id: 'd', label: '20x' },
    { id: 'e', label: '−50' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (x² + 10x + 25) − (x² − 25) = 10x + 25 + 25 = 10x + 50.",
    'Верно. (x² + 10x + 25) − (x² − 25) = 10x + 25 + 25 = 10x + 50.',
    'Correct. (x² + 10x + 25) − (x² − 25) = 10x + 25 + 25 = 10x + 50.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Sonlar yo'qolmaydi: ikkinchi qavsdagi −25 ag'darilib +25 bo'ladi, ya'ni 25 + 25 = 50.",
      'Числа не исчезают: −25 второй скобки переворачивается в +25, значит 25 + 25 = 50.',
      'The numbers do not vanish: the −25 flips to +25, so 25 + 25 = 50.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Ikkinchi ko'paytmada o'rta had YO'Q: u kvadratlar ayirmasi, x² − 25.",
      'Во втором произведении среднего члена НЕТ: это разность квадратов, x² − 25.',
      'The second product has NO middle term: it is x² − 25.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ishorani tekshiring: 25 − (−25) = +50.",
      'Проверь знак: 25 − (−25) = +50.',
      'Check the sign: 25 − (−25) = +50.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: x li had va son.",
      'В ответе два члена: с x и число.',
      'The answer has two terms: the x term and a number.') },
  ],
  wrongText: L(
    "Ikki formulani alohida qo'llang, keyin ikkinchi natijaning hamma hadini ag'daring.",
    'Примени две формулы по отдельности, потом переверни все члены второго результата.',
    'Apply both formulas separately, then flip every term of the second result.'),
};

export default function D30_09(props) { return <BuildLine data={DATA} {...props} />; }
