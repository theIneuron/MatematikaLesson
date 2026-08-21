// Dars08 · Amaliyot 07 — Ildizi bir xil tenglamalar · 🔴 · tag: same_root
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// 2x = 10 ning ildizi x = 5. Boshqa tenglamalarning ildizi (tekshirilgan):
//   x = 5        -> 5     HA
//   4x = 20      -> 5     HA  (ikki tomon 2 ga ko'paytirilgan)
//   2x + 3 = 13  -> 5     HA  (ikki tomonga 3 qo'shilgan)
//   x + 2 = 10   -> 8     yo'q
//   x : 2 = 10   -> 20    yo'q
//   10x = 2      -> 0,2   yo'q
// Fikr: tenglamaning IKKI tomoniga bir xil narsa qilinsa, ildiz o'zgarmaydi.
// Bitta tomonga qilinsa esa o'zgaradi -- x + 2 = 10 aynan shunday.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_root', level: '🔴', col: 155, itemSize: 21,
  eyebrow: L('Ildizi bir xil', 'Тот же корень', 'The same root'),
  setup: L(
    "Tenglamaning IKKI tomoniga bir xil amal qilinsa, ildiz o'zgarmaydi. Faqat bitta tomonga qilinsa -- o'zgaradi.",
    'Если с ОБЕИМИ частями уравнения сделать одно и то же, корень не изменится. Если только с одной — изменится.',
    'Doing the same thing to BOTH sides of an equation leaves the root unchanged. Doing it to one side only changes it.'),
  given: [['2x', '=', '10']],
  givenLabel: L('Berilgan tenglama:', 'Исходное уравнение:', 'The original equation:'),
  ask: L("Ildizi SHU tenglama bilan bir xil bo'lgan hamma tenglamani belgilang.", 'Отметь все уравнения, у которых корень ТОТ ЖЕ.', 'Mark every equation with the SAME root.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['x', '=', '5'], hit: true },
    { id: 'n1', tokens: ['x', '+', '2', '=', '10'], hit: false },
    { id: 'p2', tokens: ['4x', '=', '20'], hit: true },
    { id: 'n2', tokens: ['x', ':', '2', '=', '10'], hit: false },
    { id: 'p3', tokens: ['2x', '+', '3', '=', '13'], hit: true },
    { id: 'n3', tokens: ['10x', '=', '2'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 4x = 20 -- ikki tomon 2 ga ko'paytirilgan; 2x + 3 = 13 -- ikki tomonga 3 qo'shilgan; x = 5 esa yechimning o'zi. Uchtasining ildizi 5.",
    'Верно. 4x = 20 — обе части умножены на 2; 2x + 3 = 13 — к обеим частям прибавили 3; x = 5 это само решение. У всех трёх корень 5.',
    'Correct. 4x = 20 — both sides times 2; 2x + 3 = 13 — 3 added to both sides; x = 5 is the solution itself. All three have root 5.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "x + 2 = 10 da chap tomonda 2x emas, x turibdi: uning ildizi 8. Ko'paytirish qo'shishga aylanib ketgan.",
      'В x + 2 = 10 слева стоит x, а не 2x: его корень 8. Умножение превратилось в сложение.',
      'In x + 2 = 10 the left side has x, not 2x: its root is 8. The multiplication turned into an addition.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "x : 2 = 10 da noma'lum BO'LINADI, ya'ni ildizi 20. Bo'lish ko'paytirishning teskarisi.",
      'В x : 2 = 10 неизвестное ДЕЛИТСЯ, поэтому корень 20. Деление обратно умножению.',
      'In x : 2 = 10 the unknown is DIVIDED, so the root is 20. Division is the opposite of multiplication.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "10x = 2 da sonlar joyi almashgan: ildizi 0,2 chiqadi, 5 emas.",
      'В 10x = 2 числа поменялись местами: корень получается 0,2, а не 5.',
      'In 10x = 2 the numbers swapped places: the root is 0.2, not 5.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "2x + 3 = 13 ni tekshirmadingiz: ikki tomonga 3 qo'shilgan, ya'ni ildiz o'sha 5 bo'lib qoladi.",
      'Ты не проверил 2x + 3 = 13: к обеим частям прибавили 3, значит корень остался тем же, 5.',
      'You did not check 2x + 3 = 13: 3 was added to both sides, so the root is still 5.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har tenglamani yechib ildizini 5 bilan solishtiring.",
      'Одно пропустил: реши каждое уравнение и сравни корень с 5.',
      'One is missing: solve each equation and compare its root with 5.') },
  ],
  wrongText: L(
    "Har tenglamani yechib ko'ring. Ildizi 5 bo'lganlari mos keladi.",
    'Реши каждое уравнение. Подходят те, у которых корень 5.',
    'Solve each equation. The ones with root 5 fit.'),
};

export default function D08_07(props) { return <MarkAll data={DATA} {...props} />; }
