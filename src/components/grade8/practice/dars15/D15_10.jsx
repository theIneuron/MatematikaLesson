// Dars15 · Amaliyot 10 — Kod · 🔴 · tag: code_abc
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3 (15-dars, 10-pozitsiya)
//
// KODNING TARTIBI «O'SISH» EMAS, a, b, c — savol shuni ochiq aytadi.
// Bundan oldin tenglamani standart shaklga keltirish kerak: dastlabki yozuvda
// qavs bor va o'ng tomonda yetti turadi.
//
// ENG KO'P UCHRAYDIGAN XATO — standart shaklga keltirmasdan o'qish: o'shanda
// c yetti bo'lib chiqadi, holbuki yetti chapga o'tganda MINUS yetti bo'ladi
// (З39). Bankda aynan shu ikki son yonma-yon turadi: 7 va −7.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_abc', level: '🔴',
  expr: ['x(x + 6) = 7'], exprSize: 26,
  cards: ['−7', '−6', '−1', '1', '6', '7'],
  answer: ['1', '6', '−7'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Kodni tenglamaning koeffitsiyentlari beradi, lekin yozuv standart shaklda emas: qavs bor va o'ng tomonda son turadi.",
    'В комнате сейф, код трёхзначный. Код дают коэффициенты уравнения, но запись не в стандартном виде: есть скобка и число справа.',
    'There is a safe in the room and its code has three places. The coefficients give the code, but the record is not in standard form: there is a bracket and a number on the right.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Tenglamani standart shaklga keltiring va a, b, c ni SHU TARTIBDA kodga yozing.",
    'Приведи уравнение к стандартному виду и запиши a, b, c в код В ЭТОМ порядке.',
    'Bring the equation to standard form and write a, b, c into the code IN THAT order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Qavsni ochamiz: x karra x x kvadrat, x karra olti olti x. Keyin yettini chapga o'tkazamiz va u minus yetti bo'ladi: x kvadrat qo'shuv olti x minus yetti nolga teng. Endi koeffitsiyentlar ko'rinadi: a bir, b olti, c minus yetti. Tekshirish: birni qo'ysangiz bir qo'shuv olti minus yetti nol chiqadi, ya'ni bir bu tenglamaning ildizi.",
    'Верно. Раскрываем скобку: икс на икс — икс квадрат, икс на шесть — шесть икс. Потом переносим семь влево, и оно становится минус семь: икс квадрат плюс шесть икс минус семь равно нулю. Теперь коэффициенты видны: a один, b шесть, c минус семь. Проверка: подставь один — один плюс шесть минус семь равно нулю, значит один корень этого уравнения.',
    'Correct. Expand the bracket: x times x is x squared, x times six is six x. Then seven moves left and becomes minus seven: x squared plus six x minus seven equals zero. Now the coefficients are visible: a is one, b is six, c is minus seven. Check: substitute one and one plus six minus seven is zero, so one is a root of this equation.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('7') !== -1, text: L(
      "Yetti standart shaklga keltirmasdan o'qildi. O'ng tomondagi had chapga o'tganda ISHORASINI almashtiradi: yetti minus yetti bo'ladi. Tekshirib ko'ring: c yettiga teng bo'lsa, birni qo'yganda bir qo'shuv olti qo'shuv yetti o'n to'rt chiqadi, nol emas.",
      'Семь прочитано без приведения к стандартному виду. Слагаемое справа при переносе влево МЕНЯЕТ знак: семь становится минус семь. Проверь: если c равно семи, то при подстановке единицы выйдет один плюс шесть плюс семь, то есть четырнадцать, а не нуль.',
      'Seven was read without bringing the equation to standard form. A term moving from the right to the left CHANGES its sign: seven becomes minus seven. Check: if c were seven, substituting one would give one plus six plus seven, fourteen, not zero.') },
    { when: (s) => s.slots.indexOf('−6') !== -1, text: L(
      "Ikkinchi koeffitsiyent MUSBAT: qavs ichida arti olti turadi, va x karra olti arti olti x beradi. Minus olti chiqishi uchun qavs ichida x minus olti bo'lishi kerak edi.",
      'Второй коэффициент ПОЛОЖИТЕЛЕН: в скобке стоит плюс шесть, и икс на шесть даёт плюс шесть икс. Минус шесть вышло бы, если бы в скобке стояло икс минус шесть.',
      'The second coefficient is POSITIVE: the bracket holds plus six, and x times six gives plus six x. Minus six would come from a bracket reading x minus six.') },
    { when: (s) => s.slots.indexOf('−1') !== -1, text: L(
      "Bosh koeffitsiyent bir, minus bir emas: qavs oldida hech qanday minus yo'q. x karra x arti x kvadrat beradi.",
      'Старший коэффициент один, а не минус один: перед скобкой никакого минуса нет. Икс на икс даёт плюс икс квадрат.',
      'The leading coefficient is one, not minus one: there is no minus in front of the bracket. x times x gives plus x squared.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. Kodda a, b, c tartibi turadi: bosh koeffitsiyent, ikkinchi koeffitsiyent, ozod had. Bu «o'sish tartibi» emas.",
      'Числа найдены верно, а порядок нет. В коде порядок a, b, c: старший коэффициент, второй коэффициент, свободный член. Это не «по возрастанию».',
      'The numbers are right, the order is not. The code holds a, b, c in that order: the leading coefficient, the second coefficient, the constant term. This is not «increasing order».') },
  ],
  wrongText: L(
    "Avval qavsni ochib, o'ng tomondagi hadni chapga o'tkazing — o'tishda ishora almashadi. Keyin uch koeffitsiyentni a, b, c tartibida yozing.",
    'Сначала раскрой скобку и перенеси слагаемое справа влево — при переносе знак меняется. Потом запиши три коэффициента в порядке a, b, c.',
    'First expand the bracket and move the term from the right to the left — moving flips the sign. Then write the three coefficients in the order a, b, c.'),
};

export default function D15_10(props) { return <CodeLock data={DATA} {...props} />; }
