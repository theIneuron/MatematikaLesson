// Dars28 · Amaliyot 09 — Mos javoblar · 🔴 🖼 · tag: valid_answers_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §10 (28-dars, 9-pozitsiya)
//
// IKKI XIL SABAB BILAN RAD ETISH BIR TOPSHIRIQDA:
//   4,5 va 5 — tengsizlikni buzadi (З54: chegara qat'iy);
//   −2       — tengsizlikni BUZMAYDI, lekin masalaga zid (З57): manfiy
//              yo'lovchi yo'q.
// Ya'ni ikki tekshiruv ketma-ket bajarilishi kerak, va ularning biri
// yechimga, ikkinchisi MASALAGA tegishli.
//
// CHIZMA — `fig.jsx` ning `axis` speci `spans` bilan (skelet §0a.2):
// 4,5 da bo'sh doiracha, undan chapga qalin chiziq. U yechimni ko'rsatadi,
// lekin masalaning shartini emas — minus ikki chizmada bor, javobda esa yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'valid_answers_marked', level: '🔴',
  col: 120, itemSize: 19,
  given: [[{ fig: 'axis', from: -3, to: 6, step: 1, w: 182, h: 34,
    spans: [{ to: 4.5 }], marks: [{ at: 4.5, open: true }] }]],
  givenLabel: L('x < 4,5', 'x < 4,5', 'x < 4,5'),
  items: [
    { id: 'i1', tokens: ['1'], hit: true },
    { id: 'i2', tokens: ['4,5'] },
    { id: 'i3', tokens: ['3'], hit: true },
    { id: 'i4', tokens: ['5'] },
    { id: 'i5', tokens: ['4'], hit: true },
    { id: 'i6', tokens: ['−2'] },
  ],
  eyebrow: L('Mos javoblar', 'Подходящие ответы', 'Fitting answers'),
  setup: L(
    "x — avtobusdagi yo'lovchilar soni. Tengsizlik yechilgan: x to'rt butun beshdan kichik.",
    'x — число пассажиров в автобусе. Неравенство решено: x меньше четырёх целых пяти десятых.',
    'x is the number of passengers on a bus. The inequality is solved: x is less than four point five.'),
  ask: L(
    "Javob bo'la oladigan 3 ta qiymatni belgilang.",
    'Отметь 3 значения, которые могут быть ответом.',
    'Mark the 3 values that can be an answer.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Tekshiruv ikkita: to'rt butun beshdan kichik, va yo'lovchilar soni. Minus ikki tengsizlikni bajaradi, lekin masalaga zid.",
    'Верно. Проверок две: меньше четырёх целых пяти и число пассажиров. Минус два неравенству удовлетворяет, но задаче противоречит.',
    'Correct. Two checks: less than four point five, and a count of passengers. Minus two satisfies the inequality but contradicts the problem.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
        "Minus ikki tengsizlikni bajaradi, lekin x — yo'lovchilar soni: minus ikkita yo'lovchi yo'q.",
        'Минус два неравенству удовлетворяет, но x — число пассажиров: минус двух пассажиров не бывает.',
        'Minus two satisfies the inequality, but x is a count of passengers: there are no minus two passengers.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "To'rt butun besh — CHEGARA nuqtasi, va tengsizlik qat'iy: x undan qat'iy kichik bo'lishi kerak. Chizmada u yerda BO'SH doiracha turibdi — bu chegara to'plamga kirmasligini bildiradi. Bundan tashqari yo'lovchilarning soni butun bo'lishi ham kerak.",
      'Четыре целых пять — ГРАНИЧНАЯ точка, а неравенство строгое: x должен быть строго меньше. На рисунке там стоит ПУСТОЙ кружок — он и означает, что граница в множество не входит. Кроме того, число пассажиров должно быть целым.',
      'Four point five is the BOUNDARY point, and the inequality is strict: x must be strictly less. The drawing has an EMPTY dot there — that is what marks the boundary as excluded. Besides, a count of passengers must be whole.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Besh to'rt butun beshdan KATTA, ya'ni tengsizlikni umuman bajarmaydi. Chizmaga qarang: besh qalin chiziqdan o'ngda, ya'ni yechimdan tashqarida qolgan.",
      'Пять БОЛЬШЕ четырёх целых пяти десятых, значит неравенству не удовлетворяет вовсе. Посмотри на рисунок: пятёрка правее жирной линии, то есть вне решения.',
      'Five is GREATER than four point five, so it does not satisfy the inequality at all. Look at the drawing: five lies to the right of the thick line, outside the solution.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta qiymat kerak. Har birini IKKI marta tekshiring: avval tengsizlikka qo'ying, keyin masalaning kattaligiga solishtiring. Yo'lovchilarning soni manfiy ham, kasr ham bo'lmaydi.",
      'Нужно ровно три значения. Проверяй каждое ДВАЖДЫ: сначала подставь в неравенство, потом сверь с величиной из задачи. Число пассажиров не бывает ни отрицательным, ни дробным.',
      'Exactly three values are needed. Test each one TWICE: first substitute it into the inequality, then compare it with the quantity in the problem. A count of passengers is neither negative nor fractional.') },
  ],
  wrongText: L(
    "Har qiymatni ikki marta tekshiring: tengsizlikni bajaradimi, va masalaning kattaligiga mos keladimi. Chizma faqat birinchi savolga javob beradi.",
    'Проверяй каждое значение дважды: удовлетворяет ли оно неравенству и подходит ли величине из задачи. Рисунок отвечает только на первый вопрос.',
    'Test every value twice: does it satisfy the inequality, and does it fit the quantity in the problem. The drawing answers only the first question.'),
};

export default function D28_09(props) { return <MarkAll data={DATA} {...props} />; }
