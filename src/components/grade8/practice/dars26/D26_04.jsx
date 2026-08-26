// Dars26 · Amaliyot 04 — Pazl · 🟡 · tag: range_to_count
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §8 (26-dars, 4-pozitsiya)
//
// UCH ORALIQ — UCH XIL SON. Chegaralar QAT'IY, ya'ni ular sanalmaydi
// (З54): bir dan besh gacha oraliqda uchta butun son bor — ikki, uch,
// to'rt, — beshta emas.
//
// Kartalarda yozuv bo'shliqsiz (skelet §0a.3): telefonda karta 54px, va
// `1 < x < 5` bo'shliqlar bilan sig'maydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'range_to_count', level: '🟡',
  faceSize: 12, faceSizePhone: 10,
  cards: [
    { id: 'f1', side: 0, tokens: ['1<x<5'] },
    { id: 'f2', side: 0, tokens: ['−1<x<4'] },
    { id: 'f3', side: 0, tokens: ['0<x<2'] },
    { id: 'v1', side: 1, v: '3' },
    { id: 'v2', side: 1, v: '4' },
    { id: 'v3', side: 1, v: '1' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch sistemaning yechimi qo'sh tengsizlik bilan yozilgan. Har birida nechta BUTUN son borligini sanash kerak. Chegaralar qat'iy, ya'ni ularning o'zi sanalmaydi.",
    'Решения трёх систем записаны двойным неравенством. В каждом надо сосчитать, сколько там ЦЕЛЫХ чисел. Границы строгие, то есть сами они не считаются.',
    'The solutions of three systems are written as double inequalities. In each, count how many WHOLE numbers there are. The boundaries are strict, so they themselves are not counted.'),
  ask: L(
    'Oraliqni bosing, keyin uyani bosing.',
    'Нажми промежуток, потом ячейку.',
    'Tap a range, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Chegaralar qat'iy, ya'ni sanalmaydi: birdan beshgacha uchta butun son bor. Ikkinchisida nolni tashlab ketmaslik kerak — u ham butun son. Uchinchisida esa faqat bitta.",
    'Верно. Границы строгие, значит не считаются: от одного до пяти три целых числа. Во втором нельзя пропустить нуль — он тоже целое. А в третьем всего одно.',
    'Correct. The boundaries are strict and do not count: from one to five there are three whole numbers. In the second do not skip zero — it is a whole number too. And the third holds just one.'),
  wrongs: [
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Bu oraliqda NOL ham bor. Minus bir bilan to'rt orasidagi butun sonlar: nol, bir, ikki, uch — to'rtta. Nolni tashlab ketish eng ko'p uchraydigan xato: u manfiy ham, musbat ham emas, lekin butun son va oraliqqa kiradi.",
      'В этом промежутке есть и НУЛЬ. Целые между минус одним и четырьмя: нуль, один, два, три — четыре числа. Пропустить нуль — самая частая ошибка: он не отрицательный и не положительный, но он целое число и в промежуток входит.',
      'This range contains ZERO as well. The whole numbers between minus one and four are zero, one, two, three — four of them. Skipping zero is the most common mistake: it is neither negative nor positive, yet it is a whole number and belongs to the range.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Bu oraliqda uchta butun son bor: ikki, uch, to'rt. Chegaralar sanalmaydi — bir birdan katta emas, besh ham beshdan kichik emas, ya'ni ularning o'zi yechim emas. Agar belgilar ostida chiziq bo'lganida, beshta bo'lardi.",
      'В этом промежутке три целых числа: два, три, четыре. Границы не считаются — один не больше одного, пять не меньше пяти, то есть сами они решениями не являются. Будь под знаками черта, вышло бы пять.',
      'This range holds three whole numbers: two, three, four. The boundaries do not count — one is not greater than one and five is not less than five, so they are not solutions themselves. Had the signs carried a line, there would be five.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Bu oraliq eng tor: nol bilan ikki orasida faqat BITTA butun son bor — bir. Nol ham, ikki ham chegara, ya'ni sanalmaydi. Oraliqning eni ikki birlik bo'lsa ham, ichida bitta butun son turadi.",
      'Этот промежуток самый узкий: между нулём и двумя лежит только ОДНО целое число — единица. И нуль, и два — границы, они не считаются. Хотя ширина промежутка две единицы, внутри стоит одно целое число.',
      'This range is the narrowest: between zero and two lies only ONE whole number — one. Both zero and two are boundaries and do not count. Although the range is two units wide, a single whole number sits inside.') },
  ],
  wrongText: L(
    "Har oraliqning chegaralarini yozing va orasidagi butun sonlarni sanang. Chegaralar qat'iy, ya'ni sanalmaydi; nolni esa tashlab ketmang.",
    'Выпиши границы каждого промежутка и сосчитай целые числа между ними. Границы строгие, значит не считаются; а нуль не пропускай.',
    'Write out the boundaries of each range and count the whole numbers between them. The boundaries are strict and do not count; and do not skip zero.'),
};

export default function D26_04(props) { return <PairSlots data={DATA} {...props} />; }
