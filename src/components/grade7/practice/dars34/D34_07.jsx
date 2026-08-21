// Dars34 · Amaliyot 07 — Manfiy sonda xato · 🟡 · fix · tag: fn_neg_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 7-o'rin.
// Chuqur yechim: f(x) = x², f(−3) = −9. Xato: (−3)² = +9.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_neg_fix', level: '🟡',
  eyebrow: L('Xato bo\'lak', 'Неверная часть', 'The wrong part'),
  setup: L(
    "Boshqa o'quvchi manfiy son qo'ydi, lekin kvadratning ishorasini xato yozdi.",
    'Другой ученик подставил отрицательное число, но неверно записал знак квадрата.',
    'Another pupil substituted a negative number but got the sign of the square wrong.'),
  given: [['f(x)', '=', 'x²']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  ask: L("NOTO'G'RI bo'lakni belgilang.", 'Отметь НЕВЕРНУЮ часть.', 'Mark the WRONG part.'),
  note: L('Bitta bo\'lak.', 'Одна часть.', 'One part.'),
  parts: [
    { k: 'term', id: 't1', v: 'f(−3)' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't2', v: '(−3)²' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't3', v: '−9' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. (−3)² = (−3) · (−3) = +9: ikki minus musbat beradi. Javob 9.",
    'Верно. (−3)² = (−3) · (−3) = +9: два минуса дают плюс. Ответ 9.',
    'Correct. (−3)² = (−3) · (−3) = +9: two minuses give a plus. The answer is 9.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "f(−3) yozuvi to'g'ri: manfiy son ham qo'yilishi mumkin.",
      'Запись f(−3) верна: отрицательное число подставлять можно.',
      'f(−3) is fine: a negative number may be substituted.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "(−3)² ham to'g'ri yozilgan: qavs manfiy sonni butunligi bilan asos qiladi.",
      '(−3)² записано верно: скобка делает отрицательное число основанием целиком.',
      '(−3)² is written correctly: the bracket makes the negative number the base.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Natijani tekshiring: (−3) · (−3) qanday ishora beradi?",
      'Проверь результат: какой знак даёт (−3) · (−3)?',
      'Check the result: what sign does (−3) · (−3) give?') },
  ],
  wrongText: L(
    "Ikki minus ko'paytirilsa qanday ishora chiqadi?",
    'Какой знак выходит при умножении двух минусов?',
    'What sign comes from multiplying two minuses?'),
};

export default function D34_07(props) { return <TapTerms data={DATA} {...props} />; }
