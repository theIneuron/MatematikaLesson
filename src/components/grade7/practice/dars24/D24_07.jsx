// Dars24 · Amaliyot 07 — Ikki harfda ortiqcha harf · 🟡 · fix · tag: div_two_letters_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 7-o'rin.
// Chuqur yechim: (30a⁴b − 18a³b² + 12a²b) : 6a²b = 5a² − 3ab + 2b
//   5a² TO'G'RI, −3ab TO'G'RI, +2b NOTO'G'RI: 12a²b : 6a²b = 2, harf yo'q.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'div_two_letters_fix', level: '🟡',
  eyebrow: L('Ortiqcha harf', 'Лишняя буква', 'An extra letter'),
  setup: L(
    "Ikki harfli bo'lishda har harf alohida qisqaradi. Bitta hadda harf ortiqcha qolib ketgan.",
    'При делении с двумя буквами каждая буква сокращается отдельно. В одном члене буква осталась лишней.',
    'With two letters each one cancels separately. In one term a letter was left over.'),
  given: [['(30a⁴b', '−', '18a³b²', '+', '12a²b)', ':', '6a²b']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("Javobdagi NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член в ответе.', 'Mark the WRONG term in the answer.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: '5a²' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't2', v: '3ab' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '2b' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. 12a²b : 6a²b da a lar ham, b lar ham teng: 2 − 2 = 0 va 1 − 1 = 0. Ya'ni faqat 2.",
    'Верно. В 12a²b : 6a²b и a, и b равны: 2 − 2 = 0 и 1 − 1 = 0. Значит просто 2.',
    'Correct. In 12a²b : 6a²b both a and b match: 2 − 2 = 0 and 1 − 1 = 0. So just 2.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "5a² to'g'ri: 30 : 6 = 5, a da 4 − 2 = 2, b da 1 − 1 = 0.",
      '5a² верно: 30 : 6 = 5, у a 4 − 2 = 2, у b 1 − 1 = 0.',
      '5a² is right: 30 : 6 = 5, for a 4 − 2 = 2, for b 1 − 1 = 0.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "3ab ham to'g'ri: a da 3 − 2 = 1, b da 2 − 1 = 1, ya'ni ikki harf ham birinchi darajada.",
      '3ab тоже верно: у a 3 − 2 = 1, у b 2 − 1 = 1, обе буквы в первой степени.',
      '3ab is right too: for a 3 − 2 = 1 and for b 2 − 1 = 1, both to the first power.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Uchinchi hadni tekshiring: unda b ning ko'rsatkichi bo'luvchi bilan bir xil emasmi?",
      'Проверь третий член: не совпадает ли показатель b с делителем?',
      'Check the third term: does the exponent of b match the divisor?') },
  ],
  wrongText: L(
    "Har hadda ikki harfni alohida qisqartiring: a larni va b larni.",
    'В каждом члене сокращай две буквы по отдельности: a и b.',
    'In each term cancel the two letters separately: the a and the b.'),
};

export default function D24_07(props) { return <TapTerms data={DATA} {...props} />; }
