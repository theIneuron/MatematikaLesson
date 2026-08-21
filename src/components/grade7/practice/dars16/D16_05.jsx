// Dars16 · Amaliyot 05 — 36y⁵ beradigan ko'paytmalar · 🟡 · tag: same_as_36y5
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Tekshirilgan (hammasining koeffitsiyenti 36, farqi faqat ko'rsatkichda):
//   4y² · 9y³  = 36y⁵   HA
//   6y · 6y⁴   = 36y⁵   HA
//   18y² · 2y³ = 36y⁵   HA
//   12y · 3y⁵  = 36y⁶   yo'q
//   9y³ · 4y³  = 36y⁶   yo'q
//   6y² · 6y²  = 36y⁴   yo'q
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_as_36y5', level: '🟡', col: 148, itemSize: 21,
  eyebrow: L('Bir xil natija', 'Один результат', 'The same result'),
  setup: L(
    "Bu yerda hamma ko'paytmaning soni 36 chiqadi. Farq faqat ko'rsatkichda, ya'ni ularni sanash kerak.",
    'Здесь у всех произведений число выходит 36. Разница только в показателе, значит их надо посчитать.',
    'Every product here gives the number 36. The difference is only in the exponent, so count them.'),
  ask: L('36y⁵ ga TENG hamma yozuvni belgilang.', 'Отметь все записи, равные 36y⁵.', 'Mark every record equal to 36y⁵.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['4y²', '·', '9y³'], hit: true },
    { id: 'n1', tokens: ['12y', '·', '3y⁵'], hit: false },
    { id: 'p2', tokens: ['6y', '·', '6y⁴'], hit: true },
    { id: 'n2', tokens: ['9y³', '·', '4y³'], hit: false },
    { id: 'p3', tokens: ['18y²', '·', '2y³'], hit: true },
    { id: 'n3', tokens: ['6y²', '·', '6y²'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Uchtasida ham ko'rsatkichlar yig'indisi besh: 2 + 3, 1 + 4, 2 + 3. Sonlari esa 36.",
    'Верно. У всех трёх сумма показателей равна пяти: 2 + 3, 1 + 4, 2 + 3. А числа дают 36.',
    'Correct. All three have exponents adding to five: 2 + 3, 1 + 4, 2 + 3. And the numbers give 36.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1 || s.extra.indexOf('n2') !== -1, text: L(
      "Belgilanganlar orasida ko'rsatkichlar yig'indisi olti bo'lgani bor: 1 + 5 va 3 + 3. Ular 36y⁶ beradi.",
      'Среди отмеченных есть запись, где сумма показателей шесть: 1 + 5 и 3 + 3. Они дают 36y⁶.',
      'Among the marked ones the exponents add to six: 1 + 5 and 3 + 3. Those give 36y⁶.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "6y² · 6y² da ko'rsatkichlar 2 + 2 = 4, ya'ni 36y⁴. Bizga beshinchi daraja kerak.",
      'В 6y² · 6y² показатели 2 + 2 = 4, то есть 36y⁴. А нам нужна пятая степень.',
      'In 6y² · 6y² the exponents give 2 + 2 = 4, that is 36y⁴. We need the fifth power.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har ko'paytmada ko'rsatkichlarni qo'shib ko'ring, beshta chiqsa u mos.",
      'Одну пропустил: сложи показатели в каждом произведении, если выйдет пять — она подходит.',
      'One is missing: add the exponents in each product; if it makes five, it fits.') },
  ],
  wrongText: L(
    "Har yozuvda ikki ishni bajaring: sonlarni ko'paytiring va ko'rsatkichlarni qo'shing.",
    'В каждой записи сделай два дела: перемножь числа и сложи показатели.',
    'In each record do two things: multiply the numbers and add the exponents.'),
};

export default function D16_05(props) { return <MarkAll data={DATA} {...props} />; }
