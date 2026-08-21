// Dars30 · Amaliyot 06 — Minusli qavsni hisoblash · 🟡 · build · tag: whole_minus
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin.
// 8 − 3(k − 2) = 8 − 3k + 6 = 14 − 3k.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_minus', level: '🟡',
  eyebrow: L('Minus va ko\'paytuvchi', 'Минус и множитель', 'Minus and factor'),
  setup: L(
    "Qavs oldida minus ham, ko'paytuvchi ham bor. Ikkovi birga ishlaydi: −3 ni qavs ichidagi har hadga ko'paytiring.",
    'Перед скобкой есть и минус, и множитель. Они работают вместе: умножай −3 на каждый член скобки.',
    'The bracket has both a minus and a factor. They work together: multiply −3 by each term inside.'),
  expr: ['8', '−', '3(k', '−', '2)'], exprSize: 30,
  cards: [
    { id: 'a', label: '14' },
    { id: 'b', label: '−3k' },
    { id: 'c', label: '+3k' },
    { id: 'd', label: '2' },
    { id: 'e', label: '−14' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. −3 · k = −3k va −3 · (−2) = +6, ya'ni 8 + 6 = 14. Javob 14 − 3k.",
    'Верно. −3 · k = −3k и −3 · (−2) = +6, значит 8 + 6 = 14. Ответ 14 − 3k.',
    'Correct. −3 · k = −3k and −3 · (−2) = +6, so 8 + 6 = 14. The answer is 14 − 3k.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "2 chiqishi uchun 8 dan 6 ayirilgan. Ikki minus musbat beradi: −3 · (−2) = +6, ya'ni 8 + 6.",
      'Чтобы вышло 2, из 8 вычли 6. Два минуса дают плюс: −3 · (−2) = +6, значит 8 + 6.',
      'To get 2 the 6 was subtracted from 8. Two minuses give a plus: −3 · (−2) = +6, so 8 + 6.') },
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "k li had manfiy: −3 · k = −3k.",
      'Член с k отрицательный: −3 · k = −3k.',
      'The k term is negative: −3 · k = −3k.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ozod had musbat: 8 + 6 = 14.",
      'Свободный член положительный: 8 + 6 = 14.',
      'The free term is positive: 8 + 6 = 14.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: son va k li had.",
      'В ответе два члена: число и член с k.',
      'The answer has two terms: a number and the k term.') },
  ],
  wrongText: L(
    "−3 ni ikki hadga ham ko'paytiring: k ga va (−2) ga. Ikkinchisida ikki minus bor.",
    'Умножь −3 на оба члена: на k и на (−2). Во втором два минуса.',
    'Multiply −3 by both terms: by k and by (−2). The second has two minuses.'),
};

export default function D30_06(props) { return <BuildLine data={DATA} {...props} />; }
