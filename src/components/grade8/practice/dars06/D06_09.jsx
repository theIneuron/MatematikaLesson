// Dars06 · Amaliyot 09 — Tartib · 🔴 · tag: order_of_actions
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Kontent: src/books/grade8/DARS06_AMALIYOT_KONTENT_V2.md §09
//
// Ilgari bu topshiriq 05-o'rinda va `OrderLines` da turgan. Metodist qarori
// 2026-08-24: mexanikalar 1-darsdan olinadi, shuning uchun qadamlar allaqachon
// qatorda turadi va JOYI almashtiriladi.
//
// Yozuvda QAVS YO'Q, demak avval bo'lish bajariladi va faqat keyin qo'shish.
// Eng qimmat buzilish — qo'shishni oldinga qo'yish, ya'ni yozuvni qavsli
// yozuvdek o'qish. Ikkinchisi — shartni boshiga yoki o'rtaga qo'yish.
// SwapOrder kartalari bir qatorda turadi: so'z asosiy, yozuv qisqa dalil.
// `start` teskari tartib: javobgacha ikki almashtirish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'order_of_actions', level: '🔴',
  expr: [{ n: '1', d: 'k' }, '+', { n: '1', d: 'k' }, ':', '2'], exprSize: 24,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: [{ n: '1', d: 'k' }, ':', '2'],
      label: L("qavs yo'q: avval bo'lish", 'скобки нет: сначала деление', 'no bracket: division first') },
    { id: 'l2', tokens: [{ n: '1', d: '2k' }],
      label: L("bo'lishning natijasi", 'результат деления', 'the result of the division') },
    { id: 'l3', tokens: [{ n: '3', d: '2k' }],
      label: L('endi qo\'shamiz', 'теперь складываем', 'now we add') },
    { id: 'l4', tokens: ['k ≠ 0'],
      label: L('shartni yozamiz', 'запишем условие', 'write the condition') },
  ],
  start: ['l4', 'l3', 'l2', 'l1'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Yozuvda qavs yo'q, demak bo'lish qo'shishdan oldin bajariladi. Yechimning to'rt qadami bir qatorda turadi, lekin tartibi buzilgan.",
    'В записи нет скобок, значит деление выполняется раньше сложения. Четыре шага решения стоят в одну строку, но порядок нарушен.',
    'There are no brackets, so the division comes before the addition. The four steps of the solution stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Qavs yo'q, shuning uchun avval bo'lish: bir bo'linadi k ga bo'linadi ikkiga — bu bir bo'linadi ikki k ga. Endi ikki qo'shiluvchining maxraji k va ikki k, umumiy maxraj ikki k: ikki bo'linadi ikki k ga qo'shuv bir bo'linadi ikki k ga uch bo'linadi ikki k ga teng. Shart esa oxirida: k nolga teng bo'lmasligi kerak.",
    'Верно. Скобки нет, поэтому сначала деление: один делить на k разделить на два — это один делить на два k. Теперь у слагаемых знаменатели k и два k, общий знаменатель два k: два делить на два k плюс один делить на два k — три делить на два k. Условие в конце: k не равно нулю.',
    'Correct. There is no bracket, so the division comes first: one over k divided by two is one over two k. Now the summands have denominators k and two k, the common one is two k: two over two k plus one over two k is three over two k. The condition comes last: k is not zero.'),
  wrongs: [
    { when: (s) => s.pos.l4 === 0, text: L(
      "Shart yechimning boshida turmaydi: u tayyor javobga qo'shiladi.",
      'Условие не стоит в начале решения: оно приписывается к готовому ответу.',
      'The condition does not come first: it is added to the finished answer.') },
    { when: (s) => s.pos.l3 < s.pos.l1, text: L(
      "Qo'shishni oldinga qo'ydingiz — bu yozuvni QAVSLI yozuvdek o'qish. Qavs yo'q, demak bo'lish birinchi bajariladi.",
      'Ты поставил сложение вперёд — это чтение записи как СО СКОБКОЙ. Скобки нет, значит первым выполняется деление.',
      'You put the addition first — that is reading the record as if it had a BRACKET. There is no bracket, so the division goes first.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Natija bo'lishning O'ZIDAN oldin turolmaydi: bir bo'linadi ikki k ga aynan o'sha bo'lishda paydo bo'ladi.",
      'Результат не может стоять ДО самого деления: один делить на два k появляется именно в нём.',
      'The result cannot come BEFORE the division itself: one over two k appears in that very step.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Shart oxirgi qadam: u tayyor javobga qo'shiladi, hisobning o'rtasiga emas.",
      'Условие — последний шаг: оно приписывается к готовому ответу, а не в середину счёта.',
      'The condition is the last step: it is added to the finished answer, not into the middle of the working.') },
  ],
  wrongText: L(
    "Qavs yo'q — demak avval bo'lish, keyin qo'shish. Shart esa doim oxirida.",
    'Скобки нет — значит сначала деление, потом сложение. Условие всегда в конце.',
    'No bracket means division first, then addition. The condition always comes last.'),
};

export default function D06_09(props) { return <SwapOrder data={DATA} {...props} />; }
