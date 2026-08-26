// Dars45 · Amaliyot 03 — Xato juftlik · 🟢 · fix · tag: par_fix1
// Mexanika: kit.jsx -> TapTerms. Raskladka: 3-o'rin.
// Ichki almashinuvchi burchaklar teng: 70° va 70°. Chuqur yozuv 70° va 110°
// -- bu bir tomonli burchaklar xossasi.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'par_fix1', level: '🟢',
  eyebrow: L('Xato yozuv', 'Неверная запись', 'The wrong record'),
  setup: L(
    "Ikki yozuvdan biri noto'g'ri: almashinuvchi burchaklar teng, bir tomonlilar esa 180 ga to'ldiradi.",
    'Одна из двух записей неверна: накрест лежащие равны, а односторонние дополняют до 180.',
    'One of the two records is wrong: alternate angles are equal, same-side ones complete 180.'),
  given: [['∠1', '=', '70°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L("NOTO'G'RI yozuvni belgilang.", 'Отметь НЕВЕРНУЮ запись.', 'Mark the WRONG record.'),
  note: L('Bitta yozuv.', 'Одна запись.', 'One record.'),
  parts: [
    { k: 'term', id: 't1', v: L('bir tomonli = 110°', 'односторонний = 110°', 'co-interior = 110°') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: L('almashinuvchi = 110°', 'накрест лежащий = 110°', 'alternate = 110°') },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. Ichki almashinuvchi burchak TENG bo'ladi: 70°. 110° esa bir tomonli burchak.",
    'Верно. Накрест лежащий угол РАВЕН: 70°. А 110° это односторонний.',
    'Correct. The alternate angle is EQUAL: 70°. The 110° is the same-side one.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "Bir tomonli burchak to'g'ri hisoblangan: 180 − 70 = 110.",
      'Односторонний угол посчитан верно: 180 − 70 = 110.',
      'The same-side angle is right: 180 − 70 = 110.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Almashinuvchi burchak haqidagi xossani eslang: ular teng.",
      'Вспомни свойство накрест лежащих углов: они равны.',
      'Recall the property of alternate angles: they are equal.') },
  ],
  wrongText: L(
    "Qaysi juft teng bo'ladi: almashinuvchimi yoki bir tomonlimi?",
    'Какая пара равна: накрест лежащие или односторонние?',
    'Which pair is equal: alternate or same-side?'),
};

export default function D45_03(props) { return <TapTerms data={DATA} {...props} />; }
