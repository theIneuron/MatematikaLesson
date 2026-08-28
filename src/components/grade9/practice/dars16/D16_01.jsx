// Dars16 · Amaliyot 01 — Test · 🟢 · teg: kesishma-emas-birlashma-deb-oylash
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
//
// MANTIQIY savol (TIPLAR_AMALIYOT_9SINF.md §2.1): TA'RIF so'ralyapti.
// Ikkinchi variant — darsning asosiy adashishi: «va» ni «yoki» bilan
// almashtirish.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'kesishma-emas-birlashma-deb-oylash', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Sistemada ikkita tengsizlik turibdi. Ular «va» bilan bog'langan.",
    'В системе стоят два неравенства. Они связаны словом «и».',
    'A system holds two inequalities. They are joined by "and".'),
  ask: L(
    "Sistemaning yechimi qanday sonlardan iborat?",
    'Из каких чисел состоит решение системы?',
    'What numbers make up the solution of a system?'),
  opts: [
    { label: L(
      "Ikkala tengsizlikni bir vaqtda qanoatlantiradigan sonlardan",
      'Из чисел, которые удовлетворяют обоим неравенствам одновременно',
      'The numbers that satisfy both inequalities at once') },
    { label: L(
      "Hech bo'lmasa bittasini qanoatlantiradigan sonlardan",
      'Из чисел, которые удовлетворяют хотя бы одному из них',
      'The numbers that satisfy at least one of them') },
    { label: L(
      "Ikkala javobni birlashtirib olingan sonlardan",
      'Из чисел, полученных объединением обоих ответов',
      'The numbers obtained by joining both answers together') },
    { label: L(
      "Birinchi tengsizlikning javobidan",
      'Из ответа первого неравенства',
      'The answer of the first inequality') },
  ],
  correctText: L(
    "To'g'ri. «Va» degani ikkala shart ham BIR VAQTDA bajarilishi kerak, ya'ni son ikkala javobga ham tushishi shart. O'qda bu ikki to'plamning ustma-ust tushgan qismi bo'ladi — umumiy qism. Ikkinchi va uchinchi variantlar bir xil narsani aytadi va ikkalasi ham «yoki» ning ta'rifi: u yerda son bitta shartni bajarsa ham yetadi, va o'qda qismlar birlashadi, kesishmaydi.",
    'Верно. «И» означает, что оба условия должны выполняться ОДНОВРЕМЕННО, то есть число обязано попасть в оба ответа. На оси это часть, где два множества наложились друг на друга — общая часть. Второй и третий варианты говорят одно и то же, и оба — определение «или»: там достаточно, чтобы число выполняло одно условие, и на оси части объединяются, а не пересекаются.',
    'Correct. "And" means both conditions must hold AT ONCE, so a number has to fall into both answers. On the axis that is the part where the two sets overlap — the common part. The second and third options say the same thing, and both are the definition of "or": there it is enough for a number to satisfy one condition, and on the axis the parts unite rather than intersect.'),
  wrongs: [
    { when: (s) => s.picked === 1 || s.picked === 2, text: L(
      "Bu «yoki» ning ta'rifi. Sistemada esa «va» turibdi: son ikkala tengsizlikni ham qanoatlantirishi kerak. Sonlarda tekshirib ko'ring: iks noldan katta va iks minus beshdan kichik bo'lgan son bormi?",
      'Это определение «или». А в системе стоит «и»: число должно удовлетворять обоим неравенствам. Проверь на числах: есть ли число, которое больше нуля и меньше минус пяти?',
      'That is the definition of "or". But a system holds "and": a number must satisfy both inequalities. Check on numbers: is there a number greater than zero and less than minus five?') },
    { when: (s) => s.picked === 3, text: L(
      "Ikkinchi tengsizlik ham shart, u shunchaki turib qolmagan. Faqat birinchisini olsak, uning javobidagi ko'p sonlar ikkinchi shartga zid bo'lib chiqadi.",
      'Второе неравенство — тоже условие, оно стоит там не просто так. Взяв только первое, получим в ответе много чисел, противоречащих второму условию.',
      'The second inequality is a condition too, it is not there for decoration. Taking only the first leaves many numbers in the answer that break the second condition.') },
  ],
  wrongText: L(
    "«Va» so'zini so'zma-so'z o'qing: son birinchi shartni bajarsin VA ikkinchisini ham bajarsin. Bittasi yetarli emas.",
    'Прочитай слово «и» буквально: число выполняет первое условие И выполняет второе. Одного недостаточно.',
    'Read the word "and" literally: a number satisfies the first condition AND satisfies the second. One is not enough.'),
};

export default function D16_01(props) { return <Choice data={DATA} {...props} />; }
