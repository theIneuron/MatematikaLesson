// Dars02 · Amaliyot 05 — Bir xil ma'noli yozuvlar · 🟡 · tag: same_as_12a
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// 12a ga TENG yozuvlarni belgilash kerak -- «a qanday bo'lsa ham» degani.
// Tekshirilgan:
//   12 · a    -- yashiringan belgi ochilgan, o'sha yozuv        HA
//   a · 12    -- ko'paytiruvchilar joyi almashdi, qiymat o'sha  HA
//   6a + 6a   -- o'n ikkita a, ikki bo'lakka bo'lingan          HA
//   12 + a    -- qo'shish, ko'paytirish emas                    yo'q
//   a : 12    -- bo'lish, va tartib ham boshqa                  yo'q
//   12a − a   -- bu o'n bir a                                   yo'q
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_as_12a', level: '🟡', col: 175, itemSize: 22,
  eyebrow: L("Bir xil ma'noda", 'То же самое', 'The same thing'),
  setup: L(
    "Bitta narsa har xil yozilishi mumkin. Quyidagilardan ba'zilari 12a ning o'zi, ba'zilari esa boshqa yozuv.",
    'Одно и то же можно записать по-разному. Часть записей ниже — это тот же 12a, а часть — уже другое.',
    'The same thing can be written in different ways. Some records below are the same 12a, others are something else.'),
  ask: L('12a ga TENG hamma yozuvni belgilang.', 'Отметь все записи, равные 12a.', 'Mark every record equal to 12a.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['12', '·', 'a'], hit: true },
    { id: 'p2', tokens: ['a', '·', '12'], hit: true },
    { id: 'p3', tokens: ['6a', '+', '6a'], hit: true },
    { id: 'n1', tokens: ['12', '+', 'a'], hit: false },
    { id: 'n2', tokens: ['a', ':', '12'], hit: false },
    { id: 'n3', tokens: ['12a', '−', 'a'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 12a bu 12 · a; ko'paytiruvchilarning o'rni almashsa qiymat o'zgarmaydi; 6a va 6a esa birgalikda o'n ikkita a.",
    'Верно. 12a это 12 · a; от перестановки множителей значение не меняется; а 6a и 6a вместе — те же двенадцать a.',
    'Correct. 12a is 12 · a; swapping the factors does not change the value; and 6a plus 6a is the same twelve a.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "Belgilanganlar orasida 12 + a bor: bu qo'shish. Yashiringan belgi esa ko'paytirish edi.",
      'Среди отмеченных есть 12 + a: это сложение. А спрятанный знак был умножением.',
      'Among the marked ones there is 12 + a: that is addition. The hidden sign was multiplication.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "Belgilanganlar orasida 12a − a bor: o'n ikkita a dan bittasi ayrildi, o'n bitta qoldi.",
      'Среди отмеченных есть 12a − a: из двенадцати a убрали одно, осталось одиннадцать.',
      'Among the marked ones there is 12a − a: one a was taken from twelve, eleven are left.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "Belgilanganlar orasida a : 12 bor: bo'lish ko'paytirish emas, va o'rin almashtirish bo'lishda ishlamaydi.",
      'Среди отмеченных есть a : 12: деление не умножение, и переставлять в делении нельзя.',
      'Among the marked ones there is a : 12: division is not multiplication, and you cannot swap places in a division.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "6a + 6a ni tekshirmadingiz: oltita a va yana oltita a bu o'n ikkita a.",
      'Ты не проверил 6a + 6a: шесть a и ещё шесть a — это двенадцать a.',
      'You did not check 6a + 6a: six a and another six a make twelve a.') },
  ],
  wrongText: L(
    "Har yozuvni tekshirib ko'ring: a o'rniga bir xil sonni qo'ying va qiymatlarni taqqoslang.",
    'Проверь каждую запись: подставь вместо a одно и то же число и сравни значения.',
    'Test each record: put the same number in place of a and compare the values.'),
};

export default function D02_05(props) { return <MarkAll data={DATA} {...props} />; }
