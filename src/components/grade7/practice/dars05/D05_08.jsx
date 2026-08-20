// Dars05 · Amaliyot 08 — a − b − c ga teng yozuvlar · 🔴 · tag: same_as_abc
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// a − b − c ga teng yozuvlarni belgilash kerak. Tekshirilgan (a = 10, b = 4,
// c = 3 bilan; a − b − c = 3):
//   a − (b + c)    = 10 − 7 = 3    HA
//   (a − b) − c    = 6 − 3  = 3    HA
//   a + (−b − c)   = 10 − 7 = 3    HA
//   a − (b − c)    = 10 − 1 = 9    yo'q
//   a − b + c      = 6 + 3  = 9    yo'q
//   (a + b) − c    = 14 − 3 = 11   yo'q
// Ikki xato ATAYLAB bir xil son beradi (9): «minusni yarim yo'lda qoldirish»
// ikki ko'rinishda ham shu natijaga olib keladi.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_as_abc', level: '🔴', col: 165, itemSize: 21,
  eyebrow: L('Bir xil yozuv', 'То же выражение', 'The same expression'),
  setup: L(
    "Bitta ifodani har xil yozish mumkin. Tekshirish uchun harflar o'rniga son qo'yib ko'ring, masalan 10, 4 va 3.",
    'Одно выражение можно записать по-разному. Для проверки подставь числа вместо букв, например 10, 4 и 3.',
    'One expression can be written in different ways. To check, put numbers in place of the letters, say 10, 4 and 3.'),
  ask: L('a − b − c ga TENG hamma yozuvni belgilang.', 'Отметь все записи, равные a − b − c.', 'Mark every record equal to a − b − c.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['a', '−', '(', 'b', '+', 'c', ')'], hit: true },
    { id: 'n1', tokens: ['a', '−', '(', 'b', '−', 'c', ')'], hit: false },
    { id: 'p2', tokens: ['(', 'a', '−', 'b', ')', '−', 'c'], hit: true },
    { id: 'n2', tokens: ['a', '−', 'b', '+', 'c'], hit: false },
    { id: 'p3', tokens: ['a', '+', '(', '−b', '−', 'c', ')'], hit: true },
    { id: 'n3', tokens: ['(', 'a', '+', 'b', ')', '−', 'c'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Minusli qavs ikki hadning ishorasini ag'daradi, plyusli qavs esa hech narsani o'zgartirmaydi -- shuning uchun uchtasi bir xil ifoda.",
    'Верно. Минус-скобка переворачивает знак обоих слагаемых, а плюс-скобка ничего не меняет — поэтому три записи это одно выражение.',
    'Correct. A minus bracket flips both terms, a plus bracket changes nothing — so the three records are one expression.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "a − (b − c) da c ning ishorasi ag'darilgan: bu a − b + c bo'ladi. Sonlarda sinang: 10 − (4 − 3) = 9, a − b − c esa 3.",
      'В a − (b − c) знак у c перевернулся: получается a − b + c. Проверь числами: 10 − (4 − 3) = 9, а a − b − c это 3.',
      'In a − (b − c) the sign of c flipped: it becomes a − b + c. Try numbers: 10 − (4 − 3) = 9, while a − b − c is 3.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "a − b + c da c QO'SHILADI, bizda esa ayirilishi kerak. Bu aynan yarim yo'lda qolgan minus.",
      'В a − b + c слагаемое c ПРИБАВЛЯЕТСЯ, а у нас должно вычитаться. Это и есть минус, дошедший до половины.',
      'In a − b + c the c is ADDED, but it must be subtracted. That is exactly the minus that stopped halfway.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "(a + b) − c da b qo'shilgan, bizda esa ayirilishi kerak.",
      'В (a + b) − c слагаемое b прибавлено, а у нас должно вычитаться.',
      'In (a + b) − c the b is added, but it must be subtracted.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi. Sonlarda sinab ko'ring: uchta to'g'ri yozuv ham 3 beradi.",
      'Одну пропустил. Проверь числами: все три верные записи дают 3.',
      'One is missing. Try numbers: all three correct records give 3.') },
  ],
  wrongText: L(
    "a = 10, b = 4, c = 3 ni qo'yib har yozuvni hisoblang. a − b − c bu 3.",
    'Подставь a = 10, b = 4, c = 3 и посчитай каждую запись. a − b − c это 3.',
    'Put a = 10, b = 4, c = 3 in and work each record out. a − b − c is 3.'),
};

export default function D05_08(props) { return <MarkAll data={DATA} {...props} />; }
