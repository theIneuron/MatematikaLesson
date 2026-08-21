// Dars37 · Amaliyot 06 — Ishorada xato · 🟡 · fix · tag: prop_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 6-o'rin.
// y = 3x, x = −2: 3 · (−2) = −6. Chuqur javob 6 -- ishora yo'qolgan.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_fix', level: '🟡',
  eyebrow: L('Xato bo\'lak', 'Неверная часть', 'The wrong part'),
  setup: L(
    "Boshqa o'quvchi qiymat hisobladi. Qo'yish to'g'ri, natijada esa ishora yo'qolgan.",
    'Другой ученик посчитал значение. Подстановка верная, а в результате потерялся знак.',
    'Another pupil worked out the value. The substitution is right; the result lost its sign.'),
  given: [['y', '=', '3x'], ['x', '=', '−2']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L("NOTO'G'RI bo'lakni belgilang.", 'Отметь НЕВЕРНУЮ часть.', 'Mark the WRONG part.'),
  note: L('Bitta bo\'lak.', 'Одна часть.', 'One part.'),
  parts: [
    { k: 'term', id: 't1', v: '3 · (−2)' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't2', v: '6' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 3 · (−2) = −6: musbatni manfiyga ko'paytirsa manfiy chiqadi. Nuqta (−2; −6).",
    'Верно. 3 · (−2) = −6: положительное на отрицательное даёт отрицательное. Точка (−2; −6).',
    'Correct. 3 · (−2) = −6: positive times negative is negative. The point is (−2; −6).'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "Qo'yish to'g'ri: x o'rniga −2 qo'yilgan va qavsga olingan.",
      'Подстановка верная: вместо x поставлено −2 и взято в скобки.',
      'The substitution is right: −2 replaced x, in brackets.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Natijani tekshiring: musbatni manfiyga ko'paytirsa qanday ishora chiqadi?",
      'Проверь результат: какой знак даёт положительное на отрицательное?',
      'Check the result: what sign comes from positive times negative?') },
  ],
  wrongText: L(
    "Bitta minus bor: natija musbatmi yoki manfiy?",
    'Минус один: результат положительный или отрицательный?',
    'There is one minus: is the result positive or negative?'),
};

export default function D37_06(props) { return <TapTerms data={DATA} {...props} />; }
