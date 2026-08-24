// Dars05 · Amaliyot 04 — Tartib · 🟡 · tag: divide_order
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Kontent: src/books/grade8/DARS05_AMALIYOT_KONTENT_V2.md §04
//
// Ilgari bu topshiriq 08-o'rinda va `OrderLines` da turgan. Metodist qarori
// 2026-08-24: mexanikalar 1-darsdan olinadi, shuning uchun qadamlar allaqachon
// qatorda turadi va JOYI almashtiriladi. 🔴 dan 🟡 ga tushgani uchun misol
// soddalashtirildi: bitta harf, bitta shart.
//
// SwapOrder kartalari BIR QATORDA — to'rt ustun, telefonda ~85px, shuning
// uchun so'z (`label`) asosiy, yozuv (`tokens`) qisqa dalil.
// Eng qimmat buzilish — shartni boshiga qo'yish yoki ag'darishdan oldin
// ko'paytirishga o'tish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'divide_order', level: '🟡',
  expr: [{ n: '1', d: 'k' }, ':', { n: 'k', d: '4' }], exprSize: 24,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['·', { n: '4', d: 'k' }],
      label: L("bo'luvchini ag'daramiz", 'перевернём делитель', 'flip the divisor') },
    { id: 'l2', tokens: [{ n: '1·4', d: 'k·k' }],
      label: L("ko'paytiramiz", 'перемножим', 'multiply') },
    { id: 'l3', tokens: [{ n: '4', d: 'k²' }],
      label: L('javobni yozamiz', 'запишем ответ', 'write the answer') },
    { id: 'l4', tokens: ['k ≠ 0'],
      label: L('shartni yozamiz', 'запишем условие', 'write the condition') },
  ],
  start: ['l4', 'l2', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Kasrni kasrga bo'lish kerak. Yechimning to'rt qadami bir qatorda turadi, lekin tartibi buzilgan.",
    'Дробь нужно разделить на дробь. Четыре шага решения стоят в одну строку, но порядок нарушен.',
    'A fraction has to be divided by a fraction. The four steps of the solution stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Bo'lish avval KO'PAYTIRISHGA aylantiriladi: bo'luvchi ag'dariladi va k bo'linadi to'rtga o'rniga to'rt bo'linadi k ga bo'ladi. Keyin ko'paytiriladi: surat suratga, maxraj maxrajga. Javob to'rt bo'linadi k kvadratga. Shart esa oxirida: k nolga teng bo'lmasligi kerak — u ham birinchi kasrning maxrajida, ham bo'luvchining suratida turibdi.",
    'Верно. Деление сначала превращают в УМНОЖЕНИЕ: делитель переворачивается, и вместо k делить на четыре получается четыре делить на k. Потом перемножают: числитель на числитель, знаменатель на знаменатель. Ответ — четыре делить на k в квадрате. Условие в конце: k не равно нулю — она стоит и в знаменателе первой дроби, и в числителе делителя.',
    'Correct. Division is first turned into MULTIPLICATION: the divisor is flipped, so k over four becomes four over k. Then the multiplication is done: numerator times numerator, denominator times denominator. The answer is four over k squared. The condition comes last: k is not zero — it stands both in the first denominator and in the numerator of the divisor.'),
  wrongs: [
    { when: (s) => s.pos.l4 === 0, text: L(
      "Shart yechimning boshida turmaydi: u tayyor javobga qo'shiladi. Lekin uni javobdan emas, DASTLABKI yozuvdan oling.",
      'Условие не стоит в начале решения: оно приписывается к готовому ответу. Но берут его не из ответа, а из ИСХОДНОЙ записи.',
      'The condition does not come first: it is added to the finished answer. But take it from the ORIGINAL record, not from the answer.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Ko'paytirishga o'tishdan oldin bo'luvchini ag'darish kerak: aks holda siz bo'lishni emas, boshqa amalni bajarasiz.",
      'Прежде чем перемножать, надо перевернуть делитель: иначе ты выполняешь не деление, а другое действие.',
      'Before multiplying you must flip the divisor: otherwise you are doing a different operation, not division.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Shart oxirgi qadam: u tayyor javobga qo'shiladi, hisobning o'rtasiga emas.",
      'Условие — последний шаг: оно приписывается к готовому ответу, а не в середину счёта.',
      'The condition is the last step: it is added to the finished answer, not into the middle of the working.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Javob ko'paytirishdan OLDIN turolmaydi: to'rt bo'linadi k kvadratga aynan o'sha ko'paytirishda paydo bo'ladi.",
      'Ответ не может стоять ДО умножения: четыре делить на k в квадрате появляется именно в этом умножении.',
      'The answer cannot come BEFORE the multiplication: four over k squared appears in that very multiplication.') },
  ],
  wrongText: L(
    "Uch qadam: bo'luvchini ag'dar, ko'paytir, javobni yoz. Shart esa doim oxirida va dastlabki yozuvdan.",
    'Три шага: переверни делитель, перемножь, запиши ответ. Условие всегда в конце и из исходной записи.',
    'Three steps: flip the divisor, multiply, write the answer. The condition always comes last and from the original record.'),
};

export default function D05_04(props) { return <SwapOrder data={DATA} {...props} />; }
