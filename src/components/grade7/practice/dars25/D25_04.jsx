// Dars25 · Amaliyot 04 — O'rta hadda xato · 🟡 · fix · tag: sq_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 4-o'rin.
// Chuqur yechim: (2c + 7)² = 4c² + 14c + 49
//   4c² TO'G'RI, 49 TO'G'RI, 14c NOTO'G'RI: 2 · 2c · 7 = 28c.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'sq_fix', level: '🟡',
  eyebrow: L('Xato had', 'Неверный член', 'The wrong term'),
  setup: L(
    "Boshqa o'quvchi kvadratni ochdi. Chetdagi hadlar to'g'ri, o'rtadagisida esa koeffitsiyent hisobga olinmagan.",
    'Другой ученик раскрыл квадрат. Крайние члены верные, а в среднем не учтён коэффициент.',
    'Another pupil expanded the square. The outer terms are right; the middle one ignores the coefficient.'),
  given: [['(2c', '+', '7)²']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("Javobdagi NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член в ответе.', 'Mark the WRONG term in the answer.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: '4c²' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '14c' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '49' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. O'rta had 2 · 2c · 7 = 28c: koeffitsiyent 2 ham ko'paytmaga kiradi. Javob 4c² + 28c + 49.",
    'Верно. Средний член 2 · 2c · 7 = 28c: коэффициент 2 тоже входит в произведение. Ответ 4c² + 28c + 49.',
    'Correct. The middle term is 2 · 2c · 7 = 28c: the coefficient 2 joins the product. The answer is 4c² + 28c + 49.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "4c² to'g'ri: (2c)² da koeffitsiyent ham darajaga ko'tariladi, 2² = 4.",
      '4c² верно: в (2c)² коэффициент тоже возводится в степень, 2² = 4.',
      '4c² is right: in (2c)² the coefficient is squared too, 2² = 4.') },
    { when: (s) => s.extra.indexOf('t3') !== -1, text: L(
      "49 ham to'g'ri: 7² = 49.",
      '49 тоже верно: 7² = 49.',
      '49 is right too: 7² = 49.') },
    { when: (s) => s.miss.length > 0, text: L(
      "O'rta hadni hisoblang: 2 · 2c · 7 nechchi?",
      'Посчитай средний член: чему равно 2 · 2c · 7?',
      'Work out the middle term: what is 2 · 2c · 7?') },
  ],
  wrongText: L(
    "O'rta had ikki karra ko'paytma: ikkiga, birinchi hadga va ikkinchi hadga ko'paytiriladi.",
    'Средний член это двойное произведение: два, первый член и второй член.',
    'The middle term is twice the product: two, the first term and the second.'),
};

export default function D25_04(props) { return <TapTerms data={DATA} {...props} />; }
