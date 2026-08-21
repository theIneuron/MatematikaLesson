// Dars32 · Amaliyot 08 — Bitta had bo'linmagan · 🔴 · fix · tag: frac_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 8-o'rin.
// Chuqur yechim: (3a + 6) : 3 = a + 6
//   a TO'G'RI, +6 NOTO'G'RI: 6 : 3 = 2.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_fix', level: '🔴',
  eyebrow: L('Xato had', 'Неверный член', 'The wrong term'),
  setup: L(
    "Boshqa o'quvchi bo'ldi, lekin bitta had bo'linmagan qolib ketdi. Son qo'yib tekshirish darrov ko'rsatadi.",
    'Другой ученик поделил, но один член остался без деления. Подстановка числа это сразу покажет.',
    'Another pupil divided, but one term was left undivided. Substituting a number shows it at once.'),
  given: [['(3a', '+', '6)', ':', '3']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("Javobdagi NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член в ответе.', 'Mark the WRONG term in the answer.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: 'a' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '6' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 6 : 3 = 2, ya'ni javob a + 2. Tekshirish: a = 1 bo'lsa (3 + 6) : 3 = 3 va a + 2 = 3.",
    'Верно. 6 : 3 = 2, значит ответ a + 2. Проверка: при a = 1 выходит (3 + 6) : 3 = 3 и a + 2 = 3.',
    'Correct. 6 : 3 = 2, so the answer is a + 2. Check: at a = 1 both give 3.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "a to'g'ri: 3a : 3 = a.",
      'a верно: 3a : 3 = a.',
      'a is right: 3a : 3 = a.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Ikkinchi hadni tekshiring: 6 ni 3 ga bo'lsa nechchi chiqadi?",
      'Проверь второй член: сколько выйдет, если 6 разделить на 3?',
      'Check the second term: what is 6 divided by 3?') },
  ],
  wrongText: L(
    "a = 1 qo'yib ikki tomonni solishtiring: asl yozuv nima beradi, javob nima beradi?",
    'Подставь a = 1 и сравни: что даёт исходная запись и что ответ?',
    'Put a = 1 and compare: what does the original give and what does the answer give?'),
};

export default function D32_08(props) { return <TapTerms data={DATA} {...props} />; }
