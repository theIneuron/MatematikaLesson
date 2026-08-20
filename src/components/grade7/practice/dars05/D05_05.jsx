// Dars05 · Amaliyot 05 — Qavs to'g'ri ochilganmi · 🟡 · tag: opened_right
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Oltita tenglik, uchtasi TO'G'RI ochilgan (tekshirilgan):
//   7 − (2 + 4) = 7 − 2 − 4      1 = 1        HA
//   9 + (3 − 5) = 9 + 3 − 5      7 = 7        HA
//   4 − (−2 + 5) = 4 + 2 − 5     1 = 1        HA
//   7 − (2 + 4) = 7 − 2 + 4      1 va 9       yo'q
//   8 − (6 − 1) = 8 − 6 − 1      3 va 1       yo'q
//   3 + (7 − 2) = 3 − 7 + 2      8 va −2      yo'q
// Ya'ni ikki xato tur ham bor: minusni yarim yo'lda qoldirish va plyusli
// qavsning ishoralarini bekordan o'zgartirish.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'opened_right', level: '🟡', col: 195, itemSize: 19,
  eyebrow: L("To'g'ri ochilganmi", 'Верно ли раскрыто', 'Opened correctly?'),
  setup: L(
    "Har tenglikning chap tomoni bilan o'ng tomonini alohida hisoblang: qiymatlar bir xil bo'lsa, qavs to'g'ri ochilgan.",
    'Посчитай левую и правую часть каждого равенства по отдельности: если значения совпали, скобка раскрыта верно.',
    'Work out the left and right side of each equality separately: if the values match, the bracket was opened correctly.'),
  ask: L("Qavs TO'G'RI ochilgan hamma tenglikni belgilang.", 'Отметь все равенства, где скобка раскрыта ВЕРНО.', 'Mark every equality where the bracket is opened CORRECTLY.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['7', '−', '(', '2', '+', '4', ')', '=', '7', '−', '2', '−', '4'], hit: true },
    { id: 'n1', tokens: ['7', '−', '(', '2', '+', '4', ')', '=', '7', '−', '2', '+', '4'], hit: false },
    { id: 'p2', tokens: ['9', '+', '(', '3', '−', '5', ')', '=', '9', '+', '3', '−', '5'], hit: true },
    { id: 'n2', tokens: ['8', '−', '(', '6', '−', '1', ')', '=', '8', '−', '6', '−', '1'], hit: false },
    { id: 'p3', tokens: ['4', '−', '(', '−2', '+', '5', ')', '=', '4', '+', '2', '−', '5'], hit: true },
    { id: 'n3', tokens: ['3', '+', '(', '7', '−', '2', ')', '=', '3', '−', '7', '+', '2'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Minusli qavsda hamma ishora ag'dariladi, plyusli qavsda esa hech narsa o'zgarmaydi.",
    'Верно. В минус-скобке переворачиваются все знаки, а в плюс-скобке не меняется ничего.',
    'Correct. In a minus bracket every sign flips; in a plus bracket nothing changes.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "8 − (6 − 1) da minus IKKI hadga tegishli: 8 − 6 + 1 = 3. Belgilangan variantda esa 1 chiqadi.",
      'В 8 − (6 − 1) минус относится к ОБОИМ слагаемым: 8 − 6 + 1 = 3. А в отмеченном варианте выходит 1.',
      'In 8 − (6 − 1) the minus applies to BOTH terms: 8 − 6 + 1 = 3. The marked version gives 1.') },
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "7 − (2 + 4) da ikki had ham ayiriladi: 7 − 2 − 4 = 1. Belgilangan variantda 9 chiqadi.",
      'В 7 − (2 + 4) вычитаются оба слагаемых: 7 − 2 − 4 = 1. В отмеченном варианте выходит 9.',
      'In 7 − (2 + 4) both terms are subtracted: 7 − 2 − 4 = 1. The marked version gives 9.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "3 + (7 − 2) da qavs oldida PLYUS: ishoralar o'zgarmaydi, 3 + 7 − 2 = 8. Belgilangan variantda −2 chiqadi.",
      'В 3 + (7 − 2) перед скобкой ПЛЮС: знаки не меняются, 3 + 7 − 2 = 8. В отмеченном варианте выходит −2.',
      'In 3 + (7 − 2) the bracket has a PLUS: signs stay, 3 + 7 − 2 = 8. The marked version gives −2.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi. Ikki tomonni hisoblab solishtiring -- qiymatlar teng bo'lsa, ochilishi to'g'ri.",
      'Одно пропустил. Посчитай обе части и сравни — если значения равны, раскрытие верное.',
      'One is missing. Work out both sides and compare — equal values mean the opening is right.') },
  ],
  wrongText: L(
    "Qavs oldidagi belgiga qarang, keyin ikki tomonni hisoblab solishtiring.",
    'Посмотри на знак перед скобкой, потом посчитай и сравни обе части.',
    'Look at the sign before the bracket, then work out and compare both sides.'),
};

export default function D05_05(props) { return <MarkAll data={DATA} {...props} />; }
