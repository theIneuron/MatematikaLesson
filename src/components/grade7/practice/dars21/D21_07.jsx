// Dars21 · Amaliyot 07 — Ozod had xato · 🟡 · fix · tag: product_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 7-o'rin.
// (b + 5)(b − 2) = b² + 3b − 10. Chuqur javob: b² + 3b − 7 -- ozod had
// qo'shilgan (5 − 2), ko'paytirilmagan (5 · (−2) = −10).
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'product_fix', level: '🟡',
  eyebrow: L('Xato had', 'Неверный член', 'The wrong term'),
  setup: L(
    "Boshqa o'quvchi ikki qavsni ko'paytirdi. Ikki had to'g'ri, bittasi noto'g'ri: ozod hadlar bilan nima qilish kerakligini eslang.",
    'Другой ученик перемножил две скобки. Два члена верные, один неверный: вспомни, что делают со свободными членами.',
    'Another pupil multiplied two brackets. Two terms are right, one is wrong: recall what happens to the free terms.'),
  given: [['(b', '+', '5)', '(b', '−', '2)']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("Javobdagi NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член в ответе.', 'Mark the WRONG term in the answer.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: 'b²' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '3b' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't3', v: '7' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. Ozod hadlar KO'PAYTIRILADI: 5 · (−2) = −10, 5 − 2 emas. Javob b² + 3b − 10.",
    'Верно. Свободные члены ПЕРЕМНОЖАЮТСЯ: 5 · (−2) = −10, а не 5 − 2. Ответ b² + 3b − 10.',
    'Correct. The free terms are MULTIPLIED: 5 · (−2) = −10, not 5 − 2. The answer is b² + 3b − 10.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "b² to'g'ri: b · b = b². Xato ozod hadda.",
      'b² верно: b · b = b². Ошибка в свободном члене.',
      'b² is right: b · b = b². The error is in the free term.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "3b ham to'g'ri: −2b + 5b = 3b. O'rta hadlar QO'SHILADI, va bu qadam bajarilgan.",
      '3b тоже верно: −2b + 5b = 3b. Средние члены СКЛАДЫВАЮТСЯ, и этот шаг сделан.',
      '3b is right too: −2b + 5b = 3b. The middle terms ADD, and that step was done.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Ozod hadni tekshiring: 5 va −2 bilan qanday amal bajarilishi kerak edi?",
      'Проверь свободный член: какое действие нужно было с 5 и −2?',
      'Check the free term: what should have been done with 5 and −2?') },
  ],
  wrongText: L(
    "Har hadni alohida tekshiring: birinchisi ko'paytma, o'rtadagisi yig'indi, oxirgisi ham ko'paytma.",
    'Проверь каждый член: первый это произведение, средний сумма, последний тоже произведение.',
    'Check each term: the first is a product, the middle a sum, the last a product again.'),
};

export default function D21_07(props) { return <TapTerms data={DATA} {...props} />; }
