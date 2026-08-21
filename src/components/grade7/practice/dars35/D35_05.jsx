// Dars35 · Amaliyot 05 — Kesish nuqtasida xato · 🟡 · fix · tag: lin_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 5-o'rin.
// y = 4x − 3. y o'qini kesish nuqtasi (0; −3), (0; 3) emas.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_fix', level: '🟡',
  eyebrow: L('Xato bo\'lak', 'Неверная часть', 'The wrong part'),
  setup: L(
    "Boshqa o'quvchi k va b ni to'g'ri ko'rsatdi, lekin kesish nuqtasini ishorasiz yozdi.",
    'Другой ученик верно указал k и b, но точку пересечения записал без знака.',
    'Another pupil found k and b correctly but wrote the crossing point without its sign.'),
  given: [['y', '=', '4x', '−', '3']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  ask: L("NOTO'G'RI bo'lakni belgilang.", 'Отметь НЕВЕРНУЮ часть.', 'Mark the WRONG part.'),
  note: L('Bitta bo\'lak.', 'Одна часть.', 'One part.'),
  parts: [
    { k: 'term', id: 't1', v: 'k = 4' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: 'b = −3' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: '(0; 3)' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. x = 0 bo'lganda y = −3, ya'ni kesish nuqtasi (0; −3). U b bilan bir xil ishorada bo'ladi.",
    'Верно. При x = 0 выходит y = −3, значит точка пересечения (0; −3). Её знак совпадает с b.',
    'Correct. At x = 0, y = −3, so the crossing point is (0; −3). It carries the sign of b.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "k = 4 to'g'ri: x oldida 4 turibdi.",
      'k = 4 верно: перед x стоит 4.',
      'k = 4 is right: the 4 stands before x.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "b = −3 ham to'g'ri: ozod had minus bilan.",
      'b = −3 тоже верно: свободный член с минусом.',
      'b = −3 is right too: the free term is negative.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Kesish nuqtasini tekshiring: x = 0 qo'yilganda y qanday chiqadi?",
      'Проверь точку пересечения: что выходит при x = 0?',
      'Check the crossing point: what does x = 0 give?') },
  ],
  wrongText: L(
    "x = 0 qo'yib y ni hisoblang: u b ga teng bo'ladi.",
    'Подставь x = 0 и посчитай y: он равен b.',
    'Put x = 0 and work out y: it equals b.'),
};

export default function D35_05(props) { return <TapTerms data={DATA} {...props} />; }
