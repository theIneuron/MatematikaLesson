// Dars04 · Amaliyot 02 — Belgilash · 🟢 · tag: add_marked_right
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Kontent: src/books/grade8/DARS04_AMALIYOT_KONTENT_V2.md §02
//
// Ilgari bu o'rinda `StrikeOut` turgan. Metodist qarori 2026-08-24: o'nta
// mexanika 1-darsdan olinadi, shuning uchun savol TANISHga aylandi.
//
// Oltita tenglik, uchtasi to'g'ri. Uch noto'g'risi — uch adashish:
//   i2  maxrajlar ham qo'shildi (7/2c)
//   i4  AYIRISHDA qavs qo'yilmadi: c + 8 − c + 2 deb hisoblandi (10/c)
//   i6  qo'shish ko'paytirishga aylandi (8/c²)
// i3 va i4 yonma-yon turadi va faqat SURATDA farq qiladi — ayirishdagi qavs
// shu yerda tutiladi (ilgari bu alohida `RepairPart` topshirig'i edi).
// «Hammasi yoki hech narsa»: uchtasi ham topilishi kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'add_marked_right', level: '🟢',
  col: 168, itemSize: 13,
  items: [
    { id: 'i1', tokens: [{ n: '3', d: 'c' }, '+', { n: '4', d: 'c' }, '=', { n: '7', d: 'c' }], hit: true },
    { id: 'i2', tokens: [{ n: '3', d: 'c' }, '+', { n: '4', d: 'c' }, '=', { n: '7', d: '2c' }] },
    { id: 'i3', tokens: [{ n: 'c + 8', d: 'c' }, '−', { n: 'c + 2', d: 'c' }, '=', { n: '6', d: 'c' }], hit: true },
    { id: 'i4', tokens: [{ n: 'c + 8', d: 'c' }, '−', { n: 'c + 2', d: 'c' }, '=', { n: '10', d: 'c' }] },
    { id: 'i5', tokens: [{ n: '5', d: 'c' }, '−', { n: '2', d: 'c' }, '=', { n: '3', d: 'c' }], hit: true },
    { id: 'i6', tokens: [{ n: '4', d: 'c' }, '+', { n: '4', d: 'c' }, '=', { n: '8', d: 'c²' }] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita tenglik. Maxrajlar hamma joyda bir xil — ish faqat suratlarda.",
    'Шесть равенств. Знаменатели везде одинаковы — работа только в числителях.',
    'Six equalities. The denominators are equal everywhere — all the work is in the numerators.'),
  ask: L(
    "To'g'ri yozilgan 3 tenglikni belgilang.",
    'Отметь 3 равенства, записанные верно.',
    'Mark the 3 equalities written correctly.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Maxraj o'zgarmaydi. Ayirishda ikkinchi surat BUTUNLIGICHA ayiriladi: c qo'shuv sakkiz minus qavs c qo'shuv ikki — olti chiqadi.",
    'Верно. Знаменатель не меняется. При вычитании второй числитель вычитается ЦЕЛИКОМ: c плюс восемь минус скобка c плюс два — выходит шесть.',
    'Correct. The denominator stays. In subtraction the second numerator is taken away AS A WHOLE: c plus eight minus the bracket c plus two gives six.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i4') !== -1 || s.miss.indexOf('i3') !== -1, text: L(
      "Ikkinchi surat QAVSDA turadi, minus ikkiga ham tegadi. c ni birga teng qo'ying: to'qqiz minus uch olti, o'n emas.",
      'Второй числитель стоит в СКОБКАХ, минус достаётся и двойке. Подставь c равное одному: девять минус три — шесть, а не десять.',
      'The second numerator stands in BRACKETS; the minus reaches the two as well. Put c equal to one: nine minus three is six, not ten.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Maxrajlar qo'shilmaydi: maxraj bo'lakning O'LCHAMI. c ni birga teng qo'ying: yetti chiqadi, yetti ikkidan emas.",
      'Знаменатели не складывают: знаменатель — это РАЗМЕР доли. Подставь c равное одному: выйдет семь, а не семь вторых.',
      'Denominators are not added: the denominator is the SIZE of the part. Put c equal to one: you get seven, not seven halves.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Qo'shishda maxrajlar ko'paytirilmaydi. c ni ikkiga teng qo'ying: to'rt chiqadi, ikki emas.",
      'При сложении знаменатели не перемножают. Подставь c равное двум: выйдет четыре, а не два.',
      'In addition denominators are not multiplied. Put c equal to two: you get four, not two.') },
    { when: (s) => s.miss.length >= 2, text: L(
      "Har tenglikka ikki savol: maxraj o'zgarmadimi, surat bilan nima qilindi?",
      'К каждому равенству два вопроса: знаменатель не изменился и что сделали с числителем?',
      'Two questions per equality: did the denominator stay, and what was done to the numerator?') },
  ],
  wrongText: L(
    "Maxraj o'zgarmaydi. Ayirishda ikkinchi surat qavsda: minus uning har hadiga tegadi.",
    'Знаменатель не меняется. При вычитании второй числитель в скобках: минус достаётся каждому его слагаемому.',
    'The denominator does not change. In subtraction the second numerator is in brackets: the minus reaches each of its terms.'),
};

export default function D04_02(props) { return <MarkAll data={DATA} {...props} />; }
