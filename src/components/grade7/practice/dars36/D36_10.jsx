// Dars36 · Amaliyot 10 — Qiymatda xato · 🔴 · fix · tag: graph_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 10-o'rin.
// y = −2x + 1, x = 3: −2 · 3 = −6, −6 + 1 = −5. Chuqur javob 7 -- ishora
// hisobga olinmagan.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_fix', level: '🔴',
  eyebrow: L('Xato bo\'lak', 'Неверная часть', 'The wrong part'),
  setup: L(
    "Boshqa o'quvchi qiymat hisobladi. Ikki qadam to'g'ri, natijada esa ishora yo'qolgan.",
    'Другой ученик посчитал значение. Два шага верные, а в результате потерялся знак.',
    'Another pupil worked out the value. Two steps are right; the result lost its sign.'),
  given: [['y', '=', '−2x', '+', '1'], ['x', '=', '3']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L("NOTO'G'RI bo'lakni belgilang.", 'Отметь НЕВЕРНУЮ часть.', 'Mark the WRONG part.'),
  note: L('Bitta bo\'lak.', 'Одна часть.', 'One part.'),
  parts: [
    { k: 'term', id: 't1', v: '−2 · 3' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '1' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't3', v: '7' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. −2 · 3 = −6, keyin −6 + 1 = −5. Javob 7 emas, −5.",
    'Верно. −2 · 3 = −6, потом −6 + 1 = −5. Ответ не 7, а −5.',
    'Correct. −2 · 3 = −6, then −6 + 1 = −5. The answer is −5, not 7.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "−2 · 3 to'g'ri yozilgan: x o'rniga 3 qo'yilgan.",
      '−2 · 3 записано верно: вместо x подставлена тройка.',
      '−2 · 3 is written correctly: 3 replaced x.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "+1 ham to'g'ri: formulada ozod had +1.",
      '+1 тоже верно: в формуле свободный член +1.',
      '+1 is right too: the rule has +1.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Natijani tekshiring: −6 ga 1 qo'shilsa nima chiqadi?",
      'Проверь результат: что выйдет, если к −6 прибавить 1?',
      'Check the result: what is −6 plus 1?') },
  ],
  wrongText: L(
    "−2 · 3 nechchi? Undan keyin 1 qo'shilsa natija musbatmi?",
    'Чему равно −2 · 3? Станет ли результат положительным после +1?',
    'What is −2 · 3? Does adding 1 make it positive?'),
};

export default function D36_10(props) { return <TapTerms data={DATA} {...props} />; }
