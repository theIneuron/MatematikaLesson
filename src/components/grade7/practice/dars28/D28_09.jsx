// Dars28 · Amaliyot 09 — Ikki formula bir yozuvda · 🔴 · build · tag: formula_two
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// (2y + 3)² − (2y − 3)(2y + 3) = (4y² + 12y + 9) − (4y² − 9) = 12y + 18.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'formula_two', level: '🔴',
  eyebrow: L('Ikki formula', 'Две формулы', 'Two formulas'),
  setup: L(
    "Bitta yozuvda ikki formula: kvadrat va kvadratlar ayirmasi. Ikkovini ochib, keyin ayirish qoladi.",
    'В одной записи две формулы: квадрат и разность квадратов. Раскрыть обе, потом останется вычитание.',
    'One record, two formulas: a square and a difference of squares. Expand both, then subtract.'),
  expr: ['(2y', '+', '3)²', '−', '(2y', '−', '3)', '(2y', '+', '3)'], exprSize: 24,
  cards: [
    { id: 'a', label: '12y' },
    { id: 'b', label: '+18' },
    { id: 'c', label: '+9' },
    { id: 'd', label: '24y' },
    { id: 'e', label: '−18' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (4y² + 12y + 9) − (4y² − 9) = 12y + 9 + 9 = 12y + 18. 4y² lar yo'qoldi.",
    'Верно. (4y² + 12y + 9) − (4y² − 9) = 12y + 9 + 9 = 12y + 18. Члены 4y² исчезли.',
    'Correct. (4y² + 12y + 9) − (4y² − 9) = 12y + 9 + 9 = 12y + 18. The 4y² cancelled.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "+9 chiqishi uchun ikkinchi qavsning −9 i ag'darilmagan. Minus qavs oldida turibdi: −(−9) = +9, ya'ni 9 + 9 = 18.",
      'Чтобы вышло +9, −9 второй скобки не перевернули. Перед скобкой минус: −(−9) = +9, значит 9 + 9 = 18.',
      'To get +9 the −9 of the second bracket was not flipped. The bracket has a minus: −(−9) = +9, so 9 + 9 = 18.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "24y chiqishi uchun o'rta had ikki marta hisoblangan. Ikkinchi ko'paytmada o'rta had YO'Q: u kvadratlar ayirmasi.",
      'Чтобы вышло 24y, средний член посчитали дважды. Во втором произведении среднего члена НЕТ: это разность квадратов.',
      'To get 24y the middle term was counted twice. The second product has NO middle term: it is a difference of squares.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ishorani tekshiring: 9 − (−9) = 18, ya'ni musbat.",
      'Проверь знак: 9 − (−9) = 18, то есть положительно.',
      'Check the sign: 9 − (−9) = 18, positive.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: y li had va son.",
      'В ответе два члена: с y и число.',
      'The answer has two terms: the y term and a number.') },
  ],
  wrongText: L(
    "Ikki formulani alohida qo'llang, keyin ikkinchi natijaning ikki hadini ag'daring.",
    'Примени две формулы по отдельности, потом переверни оба члена второго результата.',
    'Apply the two formulas separately, then flip both terms of the second result.'),
};

export default function D28_09(props) { return <BuildLine data={DATA} {...props} />; }
