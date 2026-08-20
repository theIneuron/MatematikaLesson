// Dars02 · Amaliyot 08 — Qiymati o'zgarmaydigan yozuv · 🔴 · tag: independent_of_x
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Darsning asosiy fikri teskari tomondan: «bitta yozuv, ko'p qiymat» --
// lekin har doim emas. Ba'zi yozuvlarda x qanday bo'lsa ham qiymat BIR XIL.
// Tekshirilgan (x = 1 va x = 10 bilan):
//   x − x + 7    -> 7 va 7      qiymat o'zgarmaydi   HA
//   3x − 3x + 2  -> 2 va 2      qiymat o'zgarmaydi   HA
//   5 + x − x    -> 5 va 5      qiymat o'zgarmaydi   HA
//   2x + 1       -> 3 va 21     o'zgaradi            yo'q
//   x + x        -> 2 va 20     o'zgaradi            yo'q
//   4x − 4       -> 0 va 36     o'zgaradi            yo'q
// 4x − 4 ATAYLAB qo'yilgan: x = 1 da nol chiqadi va «har doim nol» degan
// xato taassurot tug'diradi. Ikkinchi sonni sinab ko'rish shart.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'independent_of_x', level: '🔴', col: 175, itemSize: 22,
  eyebrow: L("Qiymat o'zgaradimi", 'Меняется ли значение', 'Does the value change'),
  setup: L(
    "Bitta yozuvning ko'p qiymati bo'ladi. Lekin ba'zi yozuvlarda x qanday son bo'lsa ham qiymat o'sha-o'sha qoladi.",
    'У одной записи много значений. Но есть записи, где значение остаётся тем же, каким бы ни был x.',
    'One record has many values. But in some records the value stays the same whatever x is.'),
  ask: L("Qiymati x ga BOG'LIQ BO'LMAGAN hamma yozuvni belgilang.", 'Отметь все записи, значение которых НЕ зависит от x.', 'Mark every record whose value does NOT depend on x.'),
  note: L("Tekshirish uchun ikki xil son qo'yib ko'ring.", 'Чтобы проверить, подставь два разных числа.', 'To check, try two different numbers.'),
  items: [
    { id: 'p1', tokens: ['x', '−', 'x', '+', '7'], hit: true },
    { id: 'n1', tokens: ['2x', '+', '1'], hit: false },
    { id: 'p2', tokens: ['3x', '−', '3x', '+', '2'], hit: true },
    { id: 'n2', tokens: ['x', '+', 'x'], hit: false },
    { id: 'p3', tokens: ['5', '+', 'x', '−', 'x'], hit: true },
    { id: 'n3', tokens: ['4x', '−', '4'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Uchta yozuvda x qo'shilib, keyin darhol ayirilgan: u yo'qoladi va faqat son qoladi -- 7, 2 va 5.",
    'Верно. В трёх записях x прибавили и тут же вычли: он уходит, остаётся только число — 7, 2 и 5.',
    'Correct. In three records x is added and immediately taken away: it cancels and only the number is left — 7, 2 and 5.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "4x − 4 ni ikki marta sinab ko'ring: x = 1 da nol chiqadi, x = 10 da esa 36. Bitta son bilan tekshirish yetmaydi.",
      'Проверь 4x − 4 дважды: при x = 1 выходит нуль, а при x = 10 уже 36. Одного числа для проверки мало.',
      'Test 4x − 4 twice: at x = 1 it gives zero, at x = 10 it gives 36. One number is not enough to check.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "x + x bu ikkita x, ya'ni 2x: x kattalashsa qiymat ham kattalashadi.",
      'x + x это два x, то есть 2x: чем больше x, тем больше значение.',
      'x + x is two x, that is 2x: the bigger x, the bigger the value.') },
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "2x + 1 da x saqlanib qoldi, u yo'qolmadi: har yangi son yangi qiymat beradi.",
      'В 2x + 1 икс остался, он никуда не ушёл: каждое новое число даёт новое значение.',
      'In 2x + 1 the x is still there, it did not cancel: every new number gives a new value.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: agar bir xil harfli had qo'shilib, keyin ayirilgan bo'lsa, u yo'qoladi.",
      'Одну пропустил: если одинаковое слагаемое с буквой прибавили, а потом вычли, оно уходит.',
      'One is missing: if the same letter term is added and then taken away, it cancels.') },
  ],
  wrongText: L(
    "Har yozuvga ikki xil son qo'yib ko'ring. Qiymat ikki marta bir xil chiqsa -- x ga bog'liq emas.",
    'Подставь в каждую запись два разных числа. Если значение вышло одинаковым — от x оно не зависит.',
    'Put two different numbers into each record. If the value comes out the same, it does not depend on x.'),
};

export default function D02_08(props) { return <MarkAll data={DATA} {...props} />; }
