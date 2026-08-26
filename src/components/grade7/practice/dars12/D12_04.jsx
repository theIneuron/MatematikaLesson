// Dars12 · Amaliyot 04 — Uch barobar ko'p · 🟡 · tag: three_times_more
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// «Birinchi kun x kg, ikkinchi kun uch barobar ko'p sotildi, jami 96 kg.»
//   x + 3x = 96  ->  4x = 96  ->  x = 24 (birinchi kun)
//   ikkinchi kun: 3 · 24 = 72
// Tekshirish: 24 + 72 = 96.
// Oxirgi uya ATAYLAB: tenglamaning ildizi birinchi kunni beradi, savol esa
// ikkinchi kun haqida ham bo'lishi mumkin.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'three_times_more', level: '🟡',
  eyebrow: L("Uch barobar ko'p", 'В три раза больше', 'Three times as much'),
  setup: L(
    "Birinchi kun x kg olma sotildi, ikkinchi kun uch barobar ko'p. Jami 96 kg sotildi.",
    'В первый день продали x кг яблок, во второй в три раза больше. Всего продали 96 кг.',
    'On the first day x kg of apples were sold, on the second three times as much. In all 96 kg.'),
  rows: [
    [{ t: ['x', '+', '3x', '=', '96'] }],
    [{ slot: 0 }, { t: ['=', '96'] }],
    [{ t: [L('birinchi', 'первая', 'the first'), L('kun', 'день', 'day'), '='] }, { slot: 1 }],
    [{ t: [L('ikkinchi', 'вторая', 'the second'), L('kun', 'день', 'day'), '='] }, { slot: 2 }],
  ],
  cards: ['4x', '24', '72', '3x', '32', '96'],
  answer: ['4x', '24', '72'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x + 3x = 4x, ya'ni 4x = 96 va x = 24. Ikkinchi kun uch barobar ko'p: 3 · 24 = 72. Tekshirish: 24 + 72 = 96.",
    'Верно. x + 3x = 4x, значит 4x = 96 и x = 24. Во второй день втрое больше: 3 · 24 = 72. Проверка: 24 + 72 = 96.',
    'Correct. x + 3x = 4x, so 4x = 96 and x = 24. The second day is three times as much: 3 · 24 = 72. Check: 24 + 72 = 96.'),
  wrongs: [
    { when: (s) => s.slots[0] === '3x', text: L(
      "Birinchi kunning kilogrammlari ham hisobga olinadi: x + 3x = 4x, ya'ni jami to'rt ulush.",
      'Килограммы первого дня тоже входят в сумму: x + 3x = 4x, то есть всего четыре доли.',
      'The first day counts too: x + 3x = 4x, so there are four shares in all.') },
    { when: (s) => s.slots[1] === '32', text: L(
      "32 chiqishi uchun 96 uchga bo'lingan. Ulushlar esa to'rtta: 96 : 4 = 24.",
      'Чтобы вышло 32, 96 разделили на три. А долей четыре: 96 : 4 = 24.',
      'To get 32 the 96 was divided by three. But there are four shares: 96 : 4 = 24.') },
    { when: (s) => s.slots[2] === '24' || s.slots[2] === '96', text: L(
      "Ikkinchi kun birinchisidan uch barobar ko'p: 3 · 24 = 72. Tenglamaning ildizi faqat birinchi kunni beradi.",
      'Второй день втрое больше первого: 3 · 24 = 72. Корень уравнения даёт только первый день.',
      'The second day is three times the first: 3 · 24 = 72. The root gives only the first day.') },
  ],
  wrongText: L(
    "Avval o'xshash hadlarni yig'ing, keyin ulushlar soniga bo'ling. Oxirida ikkinchi kunni hisoblang.",
    'Сначала собери подобные, потом раздели на число долей. В конце посчитай второй день.',
    'Collect like terms first, then divide by the number of shares. Finally work out the second day.'),
};

export default function D12_04(props) { return <SlotsBank data={DATA} {...props} />; }
