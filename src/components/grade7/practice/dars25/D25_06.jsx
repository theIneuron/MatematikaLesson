// Dars25 · Amaliyot 06 — Ayirmaning kvadrati · 🟡 · build · tag: sq_diff
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin.
// (3n − 4)² = 9n² − 24n + 16. O'rta had MANFIY, oxirgisi esa MUSBAT:
// (−4)² = +16.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sq_diff', level: '🟡',
  eyebrow: L('Ayirmaning kvadrati', 'Квадрат разности', 'Square of a difference'),
  setup: L(
    "Ayirma kvadratga ko'tarilganda faqat O'RTA had manfiy bo'ladi. Oxirgi had kvadrat, ya'ni har doim musbat.",
    'При возведении разности в квадрат отрицательным становится только СРЕДНИЙ член. Последний это квадрат, он всегда положительный.',
    'Squaring a difference makes only the MIDDLE term negative. The last term is a square and always positive.'),
  expr: ['(3n', '−', '4)²'], exprSize: 34,
  cards: [
    { id: 'a', label: '9n²' },
    { id: 'b', label: '−24n' },
    { id: 'c', label: '+16' },
    { id: 'd', label: '−12n' },
    { id: 'e', label: '−16' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (3n)² = 9n², o'rta had −2 · 3n · 4 = −24n, oxirida (−4)² = +16.",
    'Верно. (3n)² = 9n², средний член −2 · 3n · 4 = −24n, в конце (−4)² = +16.',
    'Correct. (3n)² = 9n², the middle term −2 · 3n · 4 = −24n, and (−4)² = +16.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "−12n da ikki karra yo'q: 3 · 4 = 12, keyin yana 2 ga ko'paytiriladi.",
      'В −12n нет двойки: 3 · 4 = 12, потом ещё умножается на 2.',
      '−12n misses the doubling: 3 · 4 = 12, then times 2 again.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Oxirgi had kvadrat: (−4)² = +16. Ikki minus ko'paytirilib musbat beradi.",
      'Последний член это квадрат: (−4)² = +16. Два минуса дают плюс.',
      'The last term is a square: (−4)² = +16. Two minuses give a plus.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch had bo'lishi kerak.",
      'Должно быть три члена.',
      'There must be three terms.') },
  ],
  wrongText: L(
    "Ko'paytma sifatida yozing: (3n − 4)(3n − 4). Oxirgi ko'paytma (−4)(−4) nima beradi?",
    'Запиши как произведение: (3n − 4)(3n − 4). Что даёт (−4)(−4)?',
    'Write it as a product: (3n − 4)(3n − 4). What does (−4)(−4) give?'),
};

export default function D25_06(props) { return <BuildLine data={DATA} {...props} />; }
