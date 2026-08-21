// Dars44 · Amaliyot 04 — Xato burchak · 🟡 · fix · tag: iso_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 4-o'rin.
// Uchi 100° bo'lsa asos burchaklari (180 − 100) : 2 = 40°, 80° emas.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_fix', level: '🟡',
  eyebrow: L('Xato yozuv', 'Неверная запись', 'The wrong record'),
  setup: L(
    "Boshqa o'quvchi uchidagi burchakdan asos burchaklarini topdi, lekin ikkiga bo'lishni unutdi.",
    'Другой ученик нашёл углы при основании по углу при вершине, но забыл разделить на два.',
    'Another pupil found the base angles from the apex but forgot to halve.'),
  given: [['uchi', '=', '100°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L("NOTO'G'RI yozuvni belgilang.", 'Отметь НЕВЕРНУЮ запись.', 'Mark the WRONG record.'),
  note: L('Bitta yozuv.', 'Одна запись.', 'One record.'),
  parts: [
    { k: 'term', id: 't1', v: '180° − 100° = 80°' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: 'asos burchagi = 80°' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 80° bu IKKI asos burchagi birga. Bittasi 80 : 2 = 40°.",
    'Верно. 80° это ДВА угла при основании вместе. Один равен 80 : 2 = 40°.',
    'Correct. 80° covers BOTH base angles. One is 80 : 2 = 40°.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "180 − 100 = 80 to'g'ri: bu ikki asos burchagining yig'indisi.",
      '180 − 100 = 80 верно: это сумма двух углов при основании.',
      '180 − 100 = 80 is right: the sum of both base angles.') },
    { when: (s) => s.miss.length > 0, text: L(
      "80 gradus nechta burchakka tegishli ekanini tekshiring.",
      'Проверь, скольким углам относится эти 80 градусов.',
      'Check how many angles those 80 degrees cover.') },
  ],
  wrongText: L(
    "Asosda nechta burchak bor? 80 gradus ularning yig'indisimi yoki bittasi?",
    'Сколько углов при основании? Эти 80 градусов это их сумма или один угол?',
    'How many base angles are there? Is the 80 their sum or one of them?'),
};

export default function D44_04(props) { return <TapTerms data={DATA} {...props} />; }
