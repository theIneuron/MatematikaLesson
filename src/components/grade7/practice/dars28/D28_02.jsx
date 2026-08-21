// Dars28 · Amaliyot 02 — O'rta had yetmadi · 🟢 · fix · tag: formula_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 2-o'rin.
// Chuqur yechim: (3a − 5)² = 9a² − 15a + 25
//   9a² TO'G'RI, 25 TO'G'RI, −15a NOTO'G'RI: 2 · 3a · 5 = 30a.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'formula_fix', level: '🟢',
  eyebrow: L('Xato had', 'Неверный член', 'The wrong term'),
  setup: L(
    "Boshqa o'quvchi kvadratni ochdi. Chetdagi hadlar to'g'ri, o'rtadagisida ikki karra hisobga olinmagan.",
    'Другой ученик раскрыл квадрат. Крайние члены верные, а в среднем не учтено удвоение.',
    'Another pupil expanded the square. The outer terms are right; the middle one misses the doubling.'),
  given: [['(3a', '−', '5)²']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("Javobdagi NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член в ответе.', 'Mark the WRONG term in the answer.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: '9a²' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't2', v: '15a' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '25' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. O'rta had 2 · 3a · 5 = 30a. Javob 9a² − 30a + 25.",
    'Верно. Средний член 2 · 3a · 5 = 30a. Ответ 9a² − 30a + 25.',
    'Correct. The middle term is 2 · 3a · 5 = 30a. The answer is 9a² − 30a + 25.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "9a² to'g'ri: (3a)² = 9a².",
      '9a² верно: (3a)² = 9a².',
      '9a² is right: (3a)² = 9a².') },
    { when: (s) => s.extra.indexOf('t3') !== -1, text: L(
      "25 ham to'g'ri: (−5)² = +25.",
      '25 тоже верно: (−5)² = +25.',
      '25 is right too: (−5)² = +25.') },
    { when: (s) => s.miss.length > 0, text: L(
      "O'rta hadni hisoblang: 2 · 3a · 5 nechchi?",
      'Посчитай средний член: чему равно 2 · 3a · 5?',
      'Work out the middle term: what is 2 · 3a · 5?') },
  ],
  wrongText: L(
    "O'rta had ikki karra ko'paytma: 2 · birinchi · ikkinchi.",
    'Средний член это двойное произведение: 2 · первый · второй.',
    'The middle term is twice the product: 2 · first · second.'),
};

export default function D28_02(props) { return <TapTerms data={DATA} {...props} />; }
