// Dars45 · Amaliyot 06 — Xato xulosa · 🟡 · fix · tag: par_fix2
// Mexanika: kit.jsx -> TapTerms. Raskladka: 6-o'rin.
// Uch xulosadan biri noto'g'ri: ichki bir tomonli burchaklar TENG emas.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'par_fix2', level: '🟡',
  eyebrow: L('Xato xulosa', 'Неверный вывод', 'The wrong conclusion'),
  setup: L(
    "Parallel chiziqlar haqida uch xulosa yozilgan. Ikkitasi to'g'ri, bittasi esa xossalarni aralashtirgan.",
    'О параллельных прямых сделаны три вывода. Два верных, один путает свойства.',
    'Three conclusions about parallel lines. Two are right, one confuses the properties.'),
  ask: L("NOTO'G'RI xulosani belgilang.", 'Отметь НЕВЕРНЫЙ вывод.', 'Mark the WRONG conclusion.'),
  note: L('Bitta xulosa.', 'Один вывод.', 'One conclusion.'),
  parts: [
    { k: 'term', id: 't1', v: L('mos burchaklar teng', 'соответственные углы равны', 'corresponding angles are equal') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: L('bir tomonli burchaklar teng', 'односторонние углы равны', 'co-interior angles are equal') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: L('almashinuvchilar teng', 'накрест лежащие равны', 'alternate angles are equal') },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. Ichki bir tomonli burchaklar teng emas, ular 180 gradusga to'ldiradi.",
    'Верно. Односторонние углы не равны, они дополняют до 180 градусов.',
    'Correct. Same-side angles are not equal; they complete 180 degrees.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "Mos burchaklar teng -- bu to'g'ri xossa.",
      'Соответственные углы равны — это верное свойство.',
      'Corresponding angles are equal — a correct property.') },
    { when: (s) => s.extra.indexOf('t3') !== -1, text: L(
      "Ichki almashinuvchi burchaklar ham teng -- bu ham to'g'ri.",
      'Накрест лежащие углы тоже равны — это верно.',
      'Alternate angles are equal too — also correct.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Qaysi juft 180 gradusga to'ldiradi? Shu xulosa noto'g'ri yozilgan.",
      'Какая пара дополняет до 180? Именно этот вывод записан неверно.',
      'Which pair completes 180? That conclusion is the wrong one.') },
  ],
  wrongText: L(
    "Uch juftdan ikkitasi teng, bittasi esa 180 beradi. Xulosalarni shu bilan solishtiring.",
    'Из трёх пар две равны, а одна даёт 180. Сверь выводы с этим.',
    'Of the three pairs two are equal and one gives 180. Check the conclusions against that.'),
};

export default function D45_06(props) { return <TapTerms data={DATA} {...props} />; }
