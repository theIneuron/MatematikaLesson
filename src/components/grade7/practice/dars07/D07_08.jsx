// Dars07 · Amaliyot 08 — Ildizi yo'q tenglamalar · 🔴 · tag: no_root
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Tenglamaning ildizi BO'LMASLIGI ham mumkin. Tekshirilgan:
//   x + 3 = x + 5   chap tomon o'ngdan har doim 2 ga kichik   ILDIZI YO'Q
//   0 · x = 7       chap tomon har doim 0                     ILDIZI YO'Q
//   x + 2 = x       chap tomon har doim 2 ga katta            ILDIZI YO'Q
//   2x = x          x = 0 da bajariladi                       ildiz bor
//   x − 1 = x − 1   har qanday x da bajariladi                ildiz bor (cheksiz)
//   x · 0 = 0       har qanday x da bajariladi                ildiz bor (cheksiz)
// x · 0 = 0 va 0 · x = 7 ATAYLAB yonma-yon: ikkisi ham nolga ko'paytirish,
// lekin biri har doim to'g'ri, ikkinchisi hech qachon.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'no_root', level: '🔴', col: 165, itemSize: 21,
  eyebrow: L("Ildizi yo'q", 'Нет корней', 'No roots'),
  setup: L(
    "Har tenglamaning ildizi bo'lishi shart emas. Agar hech qanday son tenglikni bajarmasa, tenglamaning ildizi yo'q.",
    'Не у всякого уравнения есть корень. Если ни одно число не даёт равенства, у уравнения корней нет.',
    'Not every equation has a root. If no number makes the equality true, the equation has no roots.'),
  ask: L("Ildizi YO'Q hamma tenglamani belgilang.", 'Отметь все уравнения, у которых НЕТ корней.', 'Mark every equation that has NO roots.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['x', '+', '3', '=', 'x', '+', '5'], hit: true },
    { id: 'n1', tokens: ['2x', '=', 'x'], hit: false },
    { id: 'p2', tokens: ['0', '·', 'x', '=', '7'], hit: true },
    { id: 'n2', tokens: ['x', '−', '1', '=', 'x', '−', '1'], hit: false },
    { id: 'p3', tokens: ['x', '+', '2', '=', 'x'], hit: true },
    { id: 'n3', tokens: ['x', '·', '0', '=', '0'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Uchtasida tenglik hech qanday sonda bajarilmaydi: bir tomon ikkinchisidan doim farq qiladi yoki nolga ko'paytma nolday qoladi.",
    'Верно. В трёх равенство не выполняется ни при каком числе: одна часть всегда отличается от другой, либо произведение с нулём остаётся нулём.',
    'Correct. In three of them no number works: one side always differs from the other, or a product with zero stays zero.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "x · 0 = 0 da tenglik HAR QANDAY son uchun bajariladi: nolga ko'paytma nol. Bu «ildizi yo'q» emas, aksincha, ildiz cheksiz ko'p.",
      'В x · 0 = 0 равенство выполняется при ЛЮБОМ числе: произведение с нулём равно нулю. Это не «нет корней», а наоборот — корней бесконечно много.',
      'In x · 0 = 0 the equality holds for ANY number: a product with zero is zero. That is not "no roots" but infinitely many.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "x − 1 = x − 1 da ikki tomon aynan bir xil, ya'ni har qanday son ildiz bo'ladi.",
      'В x − 1 = x − 1 обе части одинаковы, значит корнем будет любое число.',
      'In x − 1 = x − 1 both sides are identical, so any number is a root.') },
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "2x = x tenglamasining ildizi bor: x = 0 bo'lsa 0 = 0. Nolni tekshirishni esdan chiqarmang.",
      'У 2x = x корень есть: при x = 0 выходит 0 = 0. Не забывай проверять нуль.',
      '2x = x does have a root: with x = 0 you get 0 = 0. Do not forget to test zero.') },
    { when: (s) => s.miss.indexOf('p2') !== -1, text: L(
      "0 · x = 7 ni tekshirmadingiz: qanday son olsak ham chap tomon 0 bo'ladi, 7 esa hech qachon chiqmaydi.",
      'Ты не проверил 0 · x = 7: какое число ни возьми, левая часть равна 0, а 7 не получится никогда.',
      'You did not check 0 · x = 7: whatever number you take the left side is 0, and 7 never appears.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: ikki tomonni solishtiring -- ular orasidagi farq o'zgarmasa, tenglik hech qachon bajarilmaydi.",
      'Одно пропустил: сравни две части — если разница между ними не меняется, равенство не выполнится никогда.',
      'One is missing: compare the two sides — if the gap between them never changes, the equality never holds.') },
  ],
  wrongText: L(
    "Har tenglamada ikki tomonni solishtiring. Nol sonini ham sinab ko'ring: u ko'pincha hal qiladi.",
    'Сравни в каждом уравнении две части. И попробуй нуль: он часто всё решает.',
    'Compare the two sides in each equation. And try zero: it often decides.'),
};

export default function D07_08(props) { return <MarkAll data={DATA} {...props} />; }
