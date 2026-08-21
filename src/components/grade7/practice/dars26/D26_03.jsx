// Dars26 · Amaliyot 03 — Koeffitsiyent bilan · 🟢 · build · tag: diff_sq_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin.
// (6k + 5)(6k − 5) = 36k² − 25. Koeffitsiyent ham kvadratga ko'tariladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'diff_sq_build', level: '🟢',
  eyebrow: L('Koeffitsiyent bilan', 'С коэффициентом', 'With a coefficient'),
  setup: L(
    "Birinchi hadda koeffitsiyent bor: (6k)² da 6 ham kvadratga ko'tariladi. Javobda ikki had qoladi.",
    'В первом члене есть коэффициент: в (6k)² шестёрка тоже возводится в квадрат. В ответе остаются два члена.',
    'The first term has a coefficient: in (6k)² the six is squared too. Two terms remain.'),
  expr: ['(6k', '+', '5)', '(6k', '−', '5)'], exprSize: 28,
  cards: [
    { id: 'a', label: '36k²' },
    { id: 'b', label: '−25' },
    { id: 'c', label: '+25' },
    { id: 'd', label: '−60k' },
    { id: 'e', label: '6k²' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (6k)² = 36k², keyin (+5)(−5) = −25. O'rta hadlar yo'qoldi.",
    'Верно. (6k)² = 36k², потом (+5)(−5) = −25. Средние члены исчезли.',
    'Correct. (6k)² = 36k², then (+5)(−5) = −25. The middle terms cancelled.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Ozod had manfiy: bittasida +5, boshqasida −5, ko'paytmasi −25.",
      'Свободный член отрицательный: в одной +5, в другой −5, произведение −25.',
      'The free term is negative: +5 in one bracket and −5 in the other give −25.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "O'rta had qolmaydi: +30k − 30k = 0. Shuning uchun javobda faqat ikki had.",
      'Средний член не остаётся: +30k − 30k = 0. Поэтому в ответе только два члена.',
      'No middle term remains: +30k − 30k = 0. That is why only two terms are left.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "(6k)² da 6 ham kvadratga ko'tariladi: 36k².",
      'В (6k)² шестёрка тоже возводится в квадрат: 36k².',
      'In (6k)² the six is squared too: 36k².') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: kvadrat va son.",
      'В ответе два члена: квадрат и число.',
      'The answer has two terms: a square and a number.') },
  ],
  wrongText: L(
    "Ikki kvadratni hisoblang: (6k)² va 5². Ular orasida qanday ishora turadi?",
    'Посчитай два квадрата: (6k)² и 5². Какой знак между ними?',
    'Work out the two squares: (6k)² and 5². Which sign stands between them?'),
};

export default function D26_03(props) { return <BuildLine data={DATA} {...props} />; }
