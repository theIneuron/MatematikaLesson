// Dars03 · Amaliyot 06 — 12 · (7 + 3) ga teng yozuvlar · 🟡 · tag: same_as_distributed
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// 12 · (7 + 3) = 12 · 10 = 120. Tekshirilgan:
//   12 · 7 + 12 · 3  = 84 + 36 = 120   HA (taqsimot qonuni)
//   12 · 10          = 120             HA (qavs ichi hisoblangan)
//   (7 + 3) · 12     = 120             HA (o'rin almashtirish)
//   12 · 7 + 3       = 87              yo'q (ikkinchi songa yetmagan)
//   12 + 7 · 3       = 33              yo'q (ko'paytiruvchi qo'shuvchiga aylangan)
//   12 · 7 · 3       = 252             yo'q (qo'shish ko'paytirishga aylangan)
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_as_distributed', level: '🟡', col: 175, itemSize: 21,
  eyebrow: L('Bir xil qiymat', 'То же значение', 'The same value'),
  setup: L(
    "Bitta qiymatga bir necha yo'l bilan yetish mumkin. Lekin har yozuv emas: ba'zilari boshqa son beradi.",
    'К одному значению можно прийти разными путями. Но не любая запись годится: часть даёт другое число.',
    'The same value can be reached in several ways. But not by any record: some give a different number.'),
  ask: L('12 · (7 + 3) ga TENG hamma yozuvni belgilang.', 'Отметь все записи, равные 12 · (7 + 3).', 'Mark every record equal to 12 · (7 + 3).'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['12', '·', '7', '+', '12', '·', '3'], hit: true },
    { id: 'p2', tokens: ['12', '·', '10'], hit: true },
    { id: 'p3', tokens: ['(', '7', '+', '3', ')', '·', '12'], hit: true },
    { id: 'n1', tokens: ['12', '·', '7', '+', '3'], hit: false },
    { id: 'n2', tokens: ['12', '+', '7', '·', '3'], hit: false },
    { id: 'n3', tokens: ['12', '·', '7', '·', '3'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Qavs ichini hisoblash ham, har songa alohida ko'paytirish ham 120 beradi. O'rin almashtirish esa ko'paytirishda erkin.",
    'Верно. И счёт в скобке, и умножение на каждое число по отдельности дают 120. А переставлять множители можно свободно.',
    'Correct. Working out the bracket and multiplying each number separately both give 120. And factors may be swapped freely.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "12 · 7 + 3 da ko'paytiruvchi ikkinchi songa yetmagan: 84 + 3 = 87, 120 emas.",
      'В 12 · 7 + 3 множитель не дошёл до второго числа: 84 + 3 = 87, а не 120.',
      'In 12 · 7 + 3 the factor did not reach the second number: 84 + 3 = 87, not 120.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "12 · 7 · 3 da qavs ichidagi QO'SHISH ko'paytirishga aylanib qolgan: 252 chiqadi.",
      'В 12 · 7 · 3 СЛОЖЕНИЕ в скобке превратилось в умножение: получается 252.',
      'In 12 · 7 · 3 the ADDITION inside the bracket turned into multiplication: that gives 252.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "12 + 7 · 3 da 12 ko'paytiruvchi emas, qo'shiluvchi bo'lib qolgan: 12 + 21 = 33.",
      'В 12 + 7 · 3 двенадцать стало слагаемым, а не множителем: 12 + 21 = 33.',
      'In 12 + 7 · 3 the twelve became a term, not a factor: 12 + 21 = 33.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: qavs ichini oldin hisoblash ham, har songa tarqatish ham bir xil qiymat beradi.",
      'Одну пропустил: и посчитать скобку сначала, и раздать множитель каждому числу — значение одно.',
      'One is missing: working out the bracket first and handing the factor to each number give the same value.') },
  ],
  wrongText: L(
    "Har yozuvni oxirigacha hisoblang va 120 bilan solishtiring.",
    'Досчитай каждую запись до конца и сравни со 120.',
    'Work each record out to the end and compare with 120.'),
};

export default function D03_06(props) { return <MarkAll data={DATA} {...props} />; }
