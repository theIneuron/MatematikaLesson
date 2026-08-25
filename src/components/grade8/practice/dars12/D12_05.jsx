// Dars12 · Amaliyot 05 — Pazl · 🟡 · tag: split_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §3 (12-dars, 5-pozitsiya)
//
// XOSSA TESKARI TOMONGA ISHLAYDI. Bu yerda ko'paytuvchilarning O'ZI to'liq
// kvadrat EMAS: ikki, uch, besh, sakkiz, yigirma yetti, sakson. Demak
// «har ko'paytuvchidan ildiz olaman» yo'li ishlamaydi va o'quvchi teskari
// yo'ldan boradi — avval ko'paytiradi, keyin ildiz oladi.
// Ko'paytmalar esa ataylab to'liq kvadrat: 16, 81, 400.
//
// Tuzoq ikki xil: ko'paytmani ildizsiz qoldirish (16, 81, 400) va ildiz
// ostidagi sonlarni qo'shish (10, 30, 85). Ikkisi ham razborda son bilan
// rad etiladi.
// Kartalar KVADRAT (76px), shuning uchun yozuv qisqa: ildiz va bir son.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'split_pairs', level: '🟡',
  faceSize: 14,
  cards: [
    { id: 'f1', tokens: [{ r: '2 · 8' }] },
    { id: 'f2', tokens: [{ r: '3 · 27' }] },
    { id: 'f3', tokens: [{ r: '5 · 80' }] },
    { id: 'v1', v: '4' },
    { id: 'v2', v: '9' },
    { id: 'v3', v: '20' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuvda ko'paytuvchilarning o'zi to'liq kvadrat emas: ulardan alohida ildiz olinmaydi. Lekin ko'paytmalari to'liq kvadrat.",
    'В трёх записях сами множители не полные квадраты: из них по отдельности корень не извлекается. А вот произведения — полные квадраты.',
    'In these three records the factors themselves are not perfect squares: no root can be taken from them separately. The products, however, are perfect squares.'),
  ask: L(
    "Yozuvni bosing, keyin uyani bosing. Har yozuv o'z qiymati bilan juftlanadi.",
    'Нажми запись, потом ячейку. Каждая запись становится в пару со своим значением.',
    'Tap a record, then a slot. Each record pairs with its own value.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Bu yerda xossa teskari tomonga ishladi: ko'paytuvchilardan ildiz olib bo'lmaydi, shuning uchun avval ko'paytirdingiz. Ikki karra sakkiz o'n olti, ildizi to'rt. Uch karra yigirma yetti sakson bir, ildizi to'qqiz. Besh karra sakson to'rt yuz, ildizi yigirma. Tekshiring: to'rtni kvadratga oshirsangiz o'n olti, to'qqizni — sakson bir, yigirmani — to'rt yuz.",
    'Верно. Здесь свойство сработало в обратную сторону: из множителей корень не берётся, поэтому ты сначала перемножил. Два на восемь шестнадцать, корень четыре. Три на двадцать семь восемьдесят один, корень девять. Пять на восемьдесят четыреста, корень двадцать. Проверь: четыре в квадрате шестнадцать, девять — восемьдесят один, двадцать — четыреста.',
    'Correct. Here the property worked the other way round: the factors have no roots, so you multiplied first. Two times eight is sixteen, its root is four. Three times twenty seven is eighty one, its root is nine. Five times eighty is four hundred, its root is twenty. Check: four squared is sixteen, nine squared is eighty one, twenty squared is four hundred.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Ikki yozuv o'rin almashdi. Ko'paytmalarni hisoblang: ikki karra sakkiz o'n olti, uch karra yigirma yetti esa sakson bir. O'n oltidan ildiz to'rt, sakson birdan ildiz to'qqiz. To'rtni kvadratga oshirib tekshiring — sakson bir chiqmaydi.",
      'Две записи поменялись местами. Посчитай произведения: два на восемь шестнадцать, а три на двадцать семь восемьдесят один. Корень из шестнадцати четыре, из восьмидесяти одного девять. Возведи четыре в квадрат — восемьдесят один не выйдет.',
      'Two records swapped places. Compute the products: two times eight is sixteen, while three times twenty seven is eighty one. The root of sixteen is four, of eighty one is nine. Square four and you will not get eighty one.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "Uchinchi yozuv eng kattasi: besh karra sakson to'rt yuz, ildizi yigirma. To'rt yoki to'qqizni kvadratga oshirsangiz o'n olti va sakson bir chiqadi, to'rt yuz esa yo'q.",
      'Третья запись самая большая: пять на восемьдесят четыреста, корень двадцать. Возведи четыре или девять в квадрат — выйдет шестнадцать и восемьдесят один, но не четыреста.',
      'The third record is the biggest: five times eighty is four hundred, and its root is twenty. Squaring four or nine gives sixteen and eighty one, never four hundred.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "Kattaliklar almashdi. Har juftlikni bitta amal bilan tekshiring: uyadagi sonni kvadratga oshiring va ildiz ostidagi ko'paytma bilan solishtiring. Ikki karra sakkiz o'n olti, yigirmaning kvadrati esa to'rt yuz.",
      'Величины перепутаны. Проверяй каждую пару одним действием: возведи число из ячейки в квадрат и сравни с произведением под корнем. Два на восемь шестнадцать, а двадцать в квадрате четыреста.',
      'The sizes got mixed up. Check each pair with one action: square the number in the slot and compare with the product under the root. Two times eight is sixteen, while twenty squared is four hundred.') },
  ],
  wrongText: L(
    "Ko'paytuvchilardan ildiz izlamang — ular to'liq kvadrat emas. Avval ko'paytmani hisoblang, keyin ildiz oling va javobni kvadratga oshirib tekshiring.",
    'Не ищи корень из множителей — они не полные квадраты. Сначала посчитай произведение, потом возьми корень и проверь ответ возведением в квадрат.',
    'Do not look for roots of the factors — they are not perfect squares. Compute the product first, then take the root, then check by squaring your answer.'),
};

export default function D12_05(props) { return <PairSlots data={DATA} {...props} />; }
