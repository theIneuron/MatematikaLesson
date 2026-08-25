// Dars04 · Amaliyot 09 — Umumiy maxraj qaysi · 🔴 · tag: which_common_denom
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
//
// To'rt yig'indi, to'rt umumiy maxraj. Har birida boshqa qoida ishlaydi:
//   1/t + 1/(t + 3)        -> t(t + 3)   ikki har xil ko'paytuvchi
//   1/(t − 3) + 1/(t + 3)  -> t² − 9     kvadratlar ayirmasi
//   1/t + 1/t²             -> t²         biri ikkinchisining ichida (t³ EMAS)
//   1/(2t) + 1/(3t)        -> 6t         sonlarning eng kichik karralisi (6t² emas)
// Uchinchi va to'rtinchisi eng qimmat: o'quvchi «maxrajlarni ko'paytiraman»
// deb yodlab oladi va t³ yoki 6t² yozadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'which_common_denom', level: '🔴', connect: true,
  itemSize: 14,
  items: [
    { id: 'm1', tokens: [{ n: '1', d: 't' }, '+', { n: '1', d: 't + 3' }] },
    { id: 'm2', tokens: [{ n: '1', d: 't − 3' }, '+', { n: '1', d: 't + 3' }] },
    { id: 'm3', tokens: [{ n: '1', d: 't' }, '+', { n: '1', d: 't²' }] },
    { id: 'm4', tokens: [{ n: '1', d: '2t' }, '+', { n: '1', d: '3t' }] },
  ],
  targets: [
    { id: 't1', label: 't(t + 3)' },
    { id: 't2', label: 't² − 9' },
    { id: 't3', label: 't²' },
    { id: 't4', label: '6t' },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt yig'indi. Har birida umumiy maxraj boshqa yo'l bilan topiladi, va u har doim ham maxrajlarning ko'paytmasi emas.",
    'Четыре суммы. В каждой общий знаменатель находится по-своему, и это не всегда произведение знаменателей.',
    'Four sums. In each the common denominator is found differently, and it is not always the product of the denominators.'),
  ask: L(
    "Chapdan yig'indini bosing, keyin o'ngdan uning ENG KICHIK umumiy maxrajini bosing.",
    'Нажми сумму слева, потом её НАИМЕНЬШИЙ общий знаменатель справа.',
    'Tap a sum on the left, then its SMALLEST common denominator on the right.'),
  correctText: L(
    "To'g'ri. Umumiy maxraj — har ikkala maxrajga BO'LINADIGAN eng kichik ifoda. Ba'zan u ko'paytmaga teng, ba'zan esa kichikroq: t va t kvadratda kattasining o'zi yetadi, ikki t va uch t da esa sonlar uchun oltilik yetarli, harf esa bitta qoladi.",
    'Верно. Общий знаменатель — наименьшее выражение, которое ДЕЛИТСЯ на оба. Иногда он равен произведению, а иногда меньше: для t и t в квадрате хватает большего, а для двух t и трёх t хватает шестёрки, и буква остаётся одна.',
    'Correct. The common denominator is the smallest expression DIVISIBLE by both. Sometimes it equals the product, sometimes it is smaller: for t and t squared the larger one is enough, and for two t and three t a six suffices while the letter stays single.'),
  wrongs: [
    { when: (s) => s.pair.m3 && s.pair.m3 !== 't3', text: L(
      "T va t kvadratni ko'paytirish shart emas: t kvadrat allaqachon t ga bo'linadi. Kattasining o'zi umumiy maxraj bo'ladi.",
      'Перемножать t и t в квадрате не нужно: t в квадрате уже делится на t. Больший из них и есть общий знаменатель.',
      'There is no need to multiply t and t squared: t squared already divides by t. The larger one is the common denominator.') },
    { when: (s) => s.pair.m4 && s.pair.m4 !== 't4', text: L(
      "Ikki t va uch t da harf BITTA qoladi: ikkalasi ham t ga bo'linadi. Sonlar uchun esa ikki va uchning eng kichik umumiy karralisi — olti.",
      'В двух t и трёх t буква остаётся ОДНА: обе делятся на t. А для чисел наименьшее общее кратное двух и трёх — шесть.',
      'For two t and three t the letter stays SINGLE: both divide by t. For the numbers, the least common multiple of two and three is six.') },
    { when: (s) => s.pair.m2 && s.pair.m2 !== 't2', text: L(
      "T minus uch karra t qo'shuv uch — bu kvadratlar ayirmasi, ya'ni t kvadrat minus to'qqiz. Ikkala yozuv bir xil, faqat ko'rinishi boshqa.",
      'T минус три на t плюс три — это разность квадратов, то есть t в квадрате минус девять. Обе записи одинаковы, просто выглядят по-разному.',
      'T minus three times t plus three is a difference of squares, that is t squared minus nine. Both records are the same, only written differently.') },
    { when: (s) => s.pair.m1 && s.pair.m1 !== 't1', text: L(
      "T va t qo'shuv uchda umumiy hech narsa yo'q: biri ikkinchisiga bo'linmaydi. Shuning uchun umumiy maxraj ularning ko'paytmasi.",
      'У t и t плюс три нет ничего общего: одно на другое не делится. Поэтому общий знаменатель — их произведение.',
      'T and t plus three share nothing: neither divides the other. So the common denominator is their product.') },
  ],
  wrongText: L(
    "Har juftlikda so'rang: bir maxraj ikkinchisiga bo'linadimi? Bo'linsa — kattasining o'zi yetadi. Bo'linmasa — ko'paytmasi, lekin avval sonlarni tekshiring.",
    'К каждой паре вопрос: делится ли один знаменатель на другой? Если да — хватит большего. Если нет — произведение, но сначала проверь числа.',
    'Ask of each pair: does one denominator divide the other? If yes, the larger one is enough. If not, the product — but check the numbers first.'),
};

export default function D04_09(props) { return <MatchPairs data={DATA} {...props} />; }
