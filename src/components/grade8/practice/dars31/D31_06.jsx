// Dars31 · Amaliyot 06 — Belgilash · 🟡 · tag: equal_one_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §3 (31-dars, 6-pozitsiya)
//
// UCH JUFTLIK, HAR BIRIDA FAQAT KO'RSATKICH FARQ QILADI:
//   9⁰ va 9⁻¹ ; (−7)⁰ va (−7)⁻¹ ; (2/3)⁰ va 0⁰
// Uchinchi juftlik boshqacha: u ko'rsatkichni emas, ASOSNI almashtiradi va
// T3 ni ko'rsatadi — nol asosda nolinchi daraja umuman yo'q.
//
// Ya'ni birga teng bo'lish uchun ikki shart kerak: ko'rsatkich nol VA asos
// noldan farqli. Bittasi yetmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'equal_one_marked', level: '🟡',
  col: 112, itemSize: 18,
  items: [
    { id: 'i1', tokens: ['9⁰'], hit: true },
    { id: 'i2', tokens: ['9⁻¹'] },
    { id: 'i3', tokens: ['(−7)⁰'], hit: true },
    { id: 'i4', tokens: ['(−7)⁻¹'] },
    { id: 'i5', tokens: ['(', { n: '2', d: '3' }, ')⁰'], hit: true },
    { id: 'i6', tokens: ['0⁰'] },
  ],
  eyebrow: L('Belgilash', 'Отметь', 'Mark'),
  setup: L(
    "Olti daraja. Ularning uchtasi aynan birga teng, qolgan uchtasi esa yo'q. Kartalar juft-juft turibdi, va har juftlikda bittagina narsa o'zgargan.",
    'Шесть степеней. Три из них равны ровно единице, а три нет. Карточки стоят парами, и в каждой паре изменено что-то одно.',
    'Six powers. Three of them equal exactly one, three do not. The cards come in pairs, and in each pair just one thing has changed.'),
  ask: L(
    "Birga teng bo'lgan 3 ta yozuvni belgilang.",
    'Отметь 3 записи, равные единице.',
    'Mark the 3 records that equal one.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Birga teng bo'lish uchun IKKI shart kerak: ko'rsatkich nol bo'lsin VA asos noldan farqli bo'lsin. To'qqizning nolinchi darajasi birga teng, minus yettiniki ham — ishora hech narsani buzmaydi. Ikki uchdan ning nolinchi darajasi ham bir: qoida butun songa emas, HAR QANDAY noldan farqli asosga tegishli. Rad etilgan uchtasi ikki xil sababdan: to'qqizning va minus yettining minus birinchi darajasi kasr beradi (bir to'qqizdan va minus bir yettidan), nolning nolinchi darajasi esa umuman aniqlanmagan.",
    'Верно. Чтобы получилась единица, нужны ДВА условия: показатель нуль И основание, отличное от нуля. Девять в нулевой равно единице, минус семь тоже — знак ничего не портит. И две трети в нулевой равно единице: правило относится не к целым числам, а к ЛЮБОМУ основанию, отличному от нуля. Три отвергнутые карточки отпали по двум разным причинам: девять и минус семь в минус первой дают дробь (одну девятую и минус одну седьмую), а нуль в нулевой вообще не определён.',
    'Correct. Two conditions are needed for one: the exponent must be zero AND the base must differ from zero. Nine to the zero is one, and so is minus seven — the sign spoils nothing. Two thirds to the zero is one as well: the rule applies not to whole numbers but to ANY base other than zero. The three rejected cards fall out for two different reasons: nine and minus seven to the minus one give fractions (one ninth and minus one seventh), while zero to the zero is undefined altogether.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Nolning nolinchi darajasi birga TENG EMAS — u umuman aniqlanmagan. Qoidaning shartini o'qing: asos noldan farqli bo'lishi kerak. Bu yerda esa asos aynan nol. Qo'shni kartaga qarang — u yerda o'sha nolinchi daraja turibdi, lekin asos ikki uchdan, va u birga teng.",
      'Нуль в нулевой степени НЕ РАВЕН единице — он вообще не определён. Прочитай условие правила: основание должно быть отлично от нуля. А здесь основание как раз нуль. Посмотри на соседнюю карточку — там та же нулевая степень, но основание две трети, и она равна единице.',
      'Zero to the zero is NOT equal to one — it is undefined altogether. Read the condition of the rule: the base must differ from zero. Here the base is exactly zero. Look at the neighbouring card — the same zero exponent there, but the base is two thirds, and it equals one.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Minus birinchi daraja birni bermaydi — u TESKARI sonni beradi. To'qqizning minus birinchi darajasi bir to'qqizdan, minus yettiniki minus bir yettidan. Bir faqat NOLINCHI darajada chiqadi. Qo'shni kartaga qarang: asos o'sha, ko'rsatkich esa nol, va javob boshqa.",
      'Минус первая степень не даёт единицу — она даёт ОБРАТНОЕ число. Девять в минус первой это одна девятая, минус семь в минус первой это минус одна седьмая. Единица получается только в НУЛЕВОЙ степени. Посмотри на соседнюю карточку: основание то же, а показатель нуль, и ответ другой.',
      'The minus first power does not give one — it gives the RECIPROCAL. Nine to the minus one is one ninth, minus seven to the minus one is minus one seventh. One comes only from the ZERO power. Look at the neighbouring card: the same base, but the exponent is zero, and the answer differs.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Minus yettining nolinchi darajasi chetlab o'tildi, lekin u BIRGA TENG. Manfiy asos taqiq emas: qoida faqat nolni chiqarib tashlaydi. Tekshiring — minus yettining kvadratini o'ziga bo'ling, bir chiqadi, ko'rsatkichlar esa ayirilib nol qoladi. Javob musbat, chunki bo'linma musbat.",
      'Минус семь в нулевой осталось в стороне, а оно РАВНО ЕДИНИЦЕ. Отрицательное основание не запрет: правило исключает только нуль. Проверь — раздели минус семь в квадрате само на себя, получится единица, а показатели вычтутся в нуль. Ответ положительный, потому что частное положительно.',
      'Minus seven to the zero was left out, yet it EQUALS ONE. A negative base is not a ban: the rule excludes only zero. Check — divide minus seven squared by itself and you get one, while the exponents subtract to zero. The answer is positive because the quotient is positive.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Ikki uchdan ning nolinchi darajasi ham birga teng. Qoida asos BUTUN son bo'lishini talab qilmaydi — u faqat noldan farqli bo'lishini talab qiladi. Kasrni ham o'ziga bo'lish mumkin: ikki uchdan ning kvadratini o'ziga bo'lsangiz bir chiqadi.",
      'Две трети в нулевой степени тоже равны единице. Правило не требует, чтобы основание было ЦЕЛЫМ — оно требует лишь, чтобы оно было отлично от нуля. Дробь тоже можно разделить саму на себя: две трети в квадрате, делённые сами на себя, дают единицу.',
      'Two thirds to the zero equals one as well. The rule does not demand that the base be a WHOLE number — only that it differ from zero. A fraction can be divided by itself too: two thirds squared divided by itself gives one.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta yozuv kerak. Har kartaga ikki savol bering: ko'rsatkich nolmi, va asos noldan farqlimi. Ikkala javob ham «ha» bo'lsagina yozuv birga teng.",
      'Нужно ровно три записи. К каждой карточке задай два вопроса: нуль ли показатель и отлично ли основание от нуля. Только если оба ответа «да», запись равна единице.',
      'Exactly three records are needed. Ask two questions of every card: is the exponent zero, and is the base different from zero. Only if both answers are yes does the record equal one.') },
  ],
  wrongText: L(
    "Ikki shartni birga tekshiring: ko'rsatkich nol bo'lsin va asos noldan farqli bo'lsin. Manfiy asos ham, kasr asos ham to'g'ri keladi, nol esa yo'q.",
    'Проверяй два условия сразу: показатель нуль и основание отлично от нуля. Отрицательное основание и дробное подходят, а нуль нет.',
    'Check two conditions together: the exponent is zero and the base is not zero. A negative base and a fractional base both qualify; zero does not.'),
};

export default function D31_06(props) { return <MarkAll data={DATA} {...props} />; }
