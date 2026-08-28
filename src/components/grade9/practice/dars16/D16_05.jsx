// Dars16 · Amaliyot 05 — Javobni kiritish · 🟡 · teg: faqat-bitta-tengsizlikni-tekshirish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA: x² − 16 < 0 -> −4 < x < 4; x > 1 bilan kesishma: 1 < x < 4.
// Butun sonlar: 2 va 3. Bir va to'rt CHEGARADA turadi va ikkala belgi
// ham qat'iy, shuning uchun ular kirmaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'faqat-bitta-tengsizlikni-tekshirish', level: '🟡',
  eyebrow: L('Butun sonlar', 'Целые числа', 'Whole numbers'),
  setup: L(
    "Birinchi tengsizlik oraliq beradi, ikkinchisi uni chapdan qisqartiradi.",
    'Первое неравенство даёт промежуток, второе урезает его слева.',
    'The first inequality gives an interval, the second cuts it from the left.'),
  ask: L(
    "Sistemani qanoatlantiruvchi BARCHA butun sonlarni yozing.",
    'Запиши ВСЕ целые числа, удовлетворяющие системе.',
    'Write down ALL whole numbers satisfying the system.'),
  hint: L(
    "Nuqta-vergul bilan ajrating.",
    'Раздели точкой с запятой.',
    'Separate them with semicolons.'),
  placeholder: '0; 0',
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x² − 16 < 0'], ['x > 1']],
  answer: [2, 3],
  correctText: L(
    "To'g'ri: ikki va uch. Birinchi tengsizlik iks kvadrat o'n oltidan kichik deydi, ya'ni iks minus to'rt bilan to'rt orasida. Ikkinchisi chap chegarani ko'taradi: iks birdan katta. Umumiy qism birdan to'rtgacha, va ikkala chegara ham QAT'IY, shuning uchun bir ham, to'rt ham kirmaydi. Oraliqda faqat ikkita butun son qoladi.",
    'Верно: два и три. Первое неравенство говорит, что икс в квадрате меньше шестнадцати, то есть икс между минус четырьмя и четырьмя. Второе поднимает левую границу: икс больше единицы. Общая часть — от единицы до четырёх, и обе границы СТРОГИЕ, поэтому ни единица, ни четвёрка не входят. В промежутке остаются только два целых числа.',
    'Correct: two and three. The first inequality says x squared is less than sixteen, so x lies between minus four and four. The second lifts the left boundary: x is greater than one. The common part runs from one to four, and both boundaries are STRICT, so neither one nor four is included. Only two whole numbers remain in the interval.'),
  wrongs: [
    { when: (s) => s.has(4) || s.has(1), text: L(
      "Chegara sonining o'zi qo'shilgan, lekin ikkala belgi ham qat'iy. To'rtni birinchi tengsizlikka qo'ying: o'n olti minus o'n olti nol, nol esa noldan kichik emas. Birni ikkinchisiga qo'ying: bir birdan katta emas.",
      'Добавлено само граничное число, но оба знака строгие. Подставь четыре в первое неравенство: шестнадцать минус шестнадцать — нуль, а нуль не меньше нуля. Подставь один во второе: один не больше одного.',
      'A boundary number itself was added, but both signs are strict. Put four into the first inequality: sixteen minus sixteen is zero, and zero is not less than zero. Put one into the second: one is not greater than one.') },
    { when: (s) => s.has(-3) || s.has(-2) || s.has(0), text: L(
      "Ikkinchi tengsizlik unutildi. Bu sonlar minus to'rt bilan to'rt orasida, lekin birdan katta emas — ular faqat BIRINCHI shartni bajaradi.",
      'Второе неравенство забыто. Эти числа лежат между минус четырьмя и четырьмя, но не больше единицы — они выполняют только ПЕРВОЕ условие.',
      'The second inequality was forgotten. These numbers lie between minus four and four but are not greater than one — they satisfy only the FIRST condition.') },
    { when: (s) => s.has(5) || s.has(6), text: L(
      "Birinchi tengsizlik unutildi. Beshni qo'ying: yigirma besh minus o'n olti to'qqiz, to'qqiz esa noldan kichik emas. Bu sonlar faqat IKKINCHI shartni bajaradi.",
      'Первое неравенство забыто. Подставь пять: двадцать пять минус шестнадцать — девять, а девять не меньше нуля. Эти числа выполняют только ВТОРОЕ условие.',
      'The first inequality was forgotten. Put five in: twenty-five minus sixteen is nine, and nine is not less than zero. These numbers satisfy only the SECOND condition.') },
    { when: (s) => s.size === 1, text: L(
      "Bitta son yozildi. Oraliqda undan boshqa butun son ham bor: birdan to'rtgacha oraliqni sanab chiqing.",
      'Записано одно число. В промежутке есть и другое целое: пересчитай промежуток от единицы до четырёх.',
      'One number was written. There is another whole number in the interval: count through the range from one to four.') },
    { when: (s) => s.has(16), text: L(
      "O'n olti — ozod had, javob emas. Iks kvadrat o'n oltidan kichik bo'lsa, iksning o'zi minus to'rt bilan to'rt orasida.",
      'Шестнадцать — свободный член, а не ответ. Если икс в квадрате меньше шестнадцати, то сам икс между минус четырьмя и четырьмя.',
      'Sixteen is the constant term, not an answer. If x squared is less than sixteen, then x itself lies between minus four and four.') },
  ],
  wrongText: L(
    "Avval har bir tengsizlikni alohida yeching: birinchisi minus to'rtdan to'rtgacha, ikkinchisi birdan o'ngga. Umumiy qismini oling va undagi butun sonlarni sanab chiqing.",
    'Сначала реши каждое неравенство отдельно: первое — от минус четырёх до четырёх, второе — правее единицы. Возьми общую часть и пересчитай в ней целые числа.',
    'Solve each inequality separately first: the first from minus four to four, the second right of one. Take the common part and count the whole numbers in it.'),
};

export default function D16_05(props) { return <TypeSet data={DATA} {...props} />; }
