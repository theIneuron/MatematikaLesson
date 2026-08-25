// Dars06 · Amaliyot 07 — Juftlash · 🟡 · tag: first_action
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 3-o'rinda
// turgan, endi 7-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi
// (`DARS02_06_AMALIYOT_SKELET.md` §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
//
// To'rt ifoda, to'rt «birinchi amal». Ifodalar deyarli bir xil ko'rinadi,
// farq faqat QAVSDA va amal belgisida:
//   1/f + 1/f · f      -> ko'paytirish (qavs yo'q, ikkinchi bosqich oldin)
//   (1/f + 1/f) · f    -> qavs ichidagi qo'shish
//   1/f : 1/f + 1      -> bo'lish (qavs yo'q)
//   1/f : (1/f − 1)    -> qavs ichidagi ayirish
// Ya'ni tartibni ifodaning KO'RINISHI emas, qavs belgilaydi (З15).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'first_action', level: '🟡', connect: true,
  itemSize: 15,
  items: [
    { id: 'm1', tokens: [{ n: '1', d: 'f' }, '+', { n: '1', d: 'f' }, '·', 'f'] },
    { id: 'm2', tokens: ['(', { n: '1', d: 'f' }, '+', { n: '1', d: 'f' }, ')', '·', 'f'] },
    { id: 'm3', tokens: [{ n: '1', d: 'f' }, ':', { n: '1', d: 'f' }, '+', '1'] },
    { id: 'm4', tokens: [{ n: '1', d: 'f' }, ':', '(', { n: '1', d: 'f' }, '−', '1', ')'] },
  ],
  targets: [
    { id: 't1', label: L("ko'paytirish", 'умножение', 'multiplication') },
    { id: 't2', label: L("qavsdagi qo'shish", 'сложение в скобке', 'addition in the bracket') },
    { id: 't3', label: L("bo'lish", 'деление', 'division') },
    { id: 't4', label: L('qavsdagi ayirish', 'вычитание в скобке', 'subtraction in the bracket') },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt ifoda deyarli bir xil ko'rinadi. Farq faqat qavsda va amal belgisida — lekin aynan shu tartibni belgilaydi.",
    'Четыре выражения выглядят почти одинаково. Разница только в скобке и знаке действия — но именно она задаёт порядок.',
    'The four expressions look almost the same. The only difference is the bracket and the operation sign — and that is what sets the order.'),
  ask: L(
    "Chapdan ifodani bosing, keyin o'ngdan BIRINCHI bajariladigan amalni bosing.",
    'Нажми выражение слева, потом ПЕРВОЕ выполняемое действие справа.',
    'Tap an expression on the left, then the FIRST operation to be carried out on the right.'),
  correctText: L(
    "To'g'ri. Qavs bo'lsa — u har doim birinchi. Qavs bo'lmasa — ikkinchi bosqich, ya'ni ko'paytirish va bo'lish oldin bajariladi, qo'shish va ayirish esa keyin. Bu qoida sonlardagidek, harfli ifodalarda ham o'zgarmaydi.",
    'Верно. Есть скобка — она всегда первая. Скобки нет — сначала вторая ступень, то есть умножение и деление, а сложение и вычитание потом. Правило то же, что и у чисел, и для буквенных выражений оно не меняется.',
    'Correct. If there is a bracket, it always comes first. If not, the second stage — multiplication and division — goes first, and addition and subtraction after. The rule is the same as with numbers and does not change for letter expressions.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Birinchi juftlikda qavsga qarang. Birinchi ifodada qavs YO'Q — demak ko'paytirish oldin. Ikkinchisida qavs BOR — demak qo'shish oldin.",
      'В первой паре смотри на скобку. В первом выражении скобки НЕТ — значит умножение раньше. Во втором скобка ЕСТЬ — значит сложение раньше.',
      'In the first pair look at the bracket. The first expression has NO bracket — so multiplication comes first. The second HAS one — so addition comes first.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Ikkinchi juftlikda ham o'sha farq: uchinchi ifodada qavs yo'q, shuning uchun bo'lish oldin; to'rtinchisida qavs bor, shuning uchun ayirish oldin.",
      'Во второй паре та же разница: в третьем выражении скобки нет, поэтому раньше деление; в четвёртом скобка есть, поэтому раньше вычитание.',
      'The second pair has the same difference: the third expression has no bracket, so division comes first; the fourth has one, so subtraction comes first.') },
    { when: (s) => s.pair.m2 === 't4' || s.pair.m4 === 't2', text: L(
      "Ikkala qavsda ham amal bor, lekin ular boshqa: birinchisida qo'shish, ikkinchisida ayirish. Belgiga qarang.",
      'В обеих скобках есть действие, но они разные: в одной сложение, в другой вычитание. Смотри на знак.',
      'Both brackets hold an operation, but different ones: addition in one, subtraction in the other. Look at the sign.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har ifodada avval QAVS bormi, shuni qarang. Bo'lsa — qavs ichidagi amal birinchi. Bo'lmasa — ko'paytirish yoki bo'lish birinchi.",
      'В каждом выражении сначала посмотри, есть ли СКОБКА. Есть — первым идёт действие в ней. Нет — первым идёт умножение или деление.',
      'In each expression first look for a BRACKET. If there is one, the operation inside it comes first. If not, multiplication or division comes first.') },
  ],
  wrongText: L(
    "Tartib ikki qadamda aniqlanadi: avval qavs, keyin ikkinchi bosqich. Qo'shish va ayirish har doim oxirida.",
    'Порядок определяется в два шага: сначала скобка, потом вторая ступень. Сложение и вычитание всегда в конце.',
    'The order is set in two steps: the bracket first, then the second stage. Addition and subtraction always come last.'),
};

export default function D06_07(props) { return <MatchPairs data={DATA} {...props} />; }
