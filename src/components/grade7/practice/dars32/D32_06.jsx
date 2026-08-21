// Dars32 · Amaliyot 06 — Bir hadga bo'lish · 🟡 · build · tag: frac_mono
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin.
// (2m² + 8m) : 2m = m + 4. Har had 2m ga bo'linadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_mono', level: '🟡',
  eyebrow: L("Bir hadga bo'lish", 'Деление на одночлен', 'Dividing by a monomial'),
  setup: L(
    "Bo'luvchida harf ham bor: 2m. Har hadda son bo'linadi va harf qisqaradi.",
    'В делителе есть и буква: 2m. В каждом члене число делится, а буква сокращается.',
    'The divisor has a letter too: 2m. In each term the number divides and the letter cancels.'),
  expr: ['(2m²', '+', '8m)', ':', '2m'], exprSize: 28,
  cards: [
    { id: 'a', label: 'm' },
    { id: 'b', label: '+4' },
    { id: 'c', label: 'm²' },
    { id: 'd', label: '+8' },
    { id: 'e', label: '+4m' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2m² : 2m = m va 8m : 2m = 4. Javob m + 4.",
    'Верно. 2m² : 2m = m и 8m : 2m = 4. Ответ m + 4.',
    'Correct. 2m² : 2m = m and 8m : 2m = 4. The answer is m + 4.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "m² noto'g'ri: 2m² : 2m da ko'rsatkichlar ayiriladi, 2 − 1 = 1.",
      'm² неверно: в 2m² : 2m показатели вычитаются, 2 − 1 = 1.',
      'm² is wrong: in 2m² : 2m the exponents subtract, 2 − 1 = 1.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "+8 da bo'lish bajarilmagan: 8m : 2m = 4.",
      'В +8 деление не выполнено: 8m : 2m = 4.',
      'In +8 the division was skipped: 8m : 2m = 4.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "+4m da harf qolib ketgan: m : m = 1, ya'ni faqat 4.",
      'В +4m осталась буква: m : m = 1, значит просто 4.',
      'In +4m a letter was left: m : m = 1, so just 4.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi.",
      'В ответе два члена.',
      'The answer has two terms.') },
  ],
  wrongText: L(
    "Har hadni 2m ga bo'ling: sonni bo'ling, harf ko'rsatkichini ayiring.",
    'Раздели каждый член на 2m: число раздели, показатель буквы вычти.',
    'Divide each term by 2m: divide the number, subtract the letter exponent.'),
};

export default function D32_06(props) { return <BuildLine data={DATA} {...props} />; }
