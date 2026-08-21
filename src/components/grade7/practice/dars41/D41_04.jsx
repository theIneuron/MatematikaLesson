// Dars41 · Amaliyot 04 — Vertikal burchaklar · 🟡 · fix · tag: ang_vertical_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 4-o'rin.
// Vertikal burchaklar TENG. Chuqur yechim: 65° va 115° -- bu qo'shni
// burchaklar xossasi, vertikal emas.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_vertical_fix', level: '🟡',
  eyebrow: L('Xato yozuv', 'Неверная запись', 'The wrong record'),
  setup: L(
    "Vertikal burchaklar teng bo'ladi, qo'shni burchaklar esa 180 gradusga to'ldiradi. Boshqa o'quvchi ikkovini aralashtirgan.",
    'Вертикальные углы равны, а смежные дополняют до 180 градусов. Другой ученик их перепутал.',
    'Vertical angles are equal; adjacent ones add to 180. Another pupil mixed them up.'),
  given: [['∠1', '=', '65°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L("NOTO'G'RI yozuvni belgilang.", 'Отметь НЕВЕРНУЮ запись.', 'Mark the WRONG record.'),
  note: L('Bitta yozuv.', 'Одна запись.', 'One record.'),
  parts: [
    { k: 'term', id: 't1', v: "qo'shni = 115°" },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: 'vertikal = 115°' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. Vertikal burchak TENG bo'ladi: 65°. 115° esa qo'shni burchak.",
    'Верно. Вертикальный угол РАВЕН данному: 65°. А 115° это смежный.',
    'Correct. The vertical angle is EQUAL: 65°. The 115° is the adjacent one.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "Qo'shni burchak to'g'ri hisoblangan: 180 − 65 = 115.",
      'Смежный угол посчитан верно: 180 − 65 = 115.',
      'The adjacent angle is right: 180 − 65 = 115.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Vertikal burchaklar haqidagi qoidani eslang: ular teng bo'ladi.",
      'Вспомни правило о вертикальных углах: они равны.',
      'Recall the rule for vertical angles: they are equal.') },
  ],
  wrongText: L(
    "Vertikal burchaklar teng bo'ladimi yoki 180 ga to'ldiradimi?",
    'Вертикальные углы равны или дополняют до 180?',
    'Are vertical angles equal, or do they add to 180?'),
};

export default function D41_04(props) { return <TapTerms data={DATA} {...props} />; }
