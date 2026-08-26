// Dars29 · Amaliyot 07 — Nechta · 🟡 🖼 · tag: count_integers_abs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §11 (29-dars, 7-pozitsiya)
//
// CHIZMA — `fig.jsx` ning `axis` speci (skelet §2): −4 dan 4 gacha son
// o'qi. U sanaladigan narsani ko'rsatadi, chegaralarni esa emas — ular
// yozuvdan o'qiladi.
//
// Uch xato yo'l:
//   6 — chegaralar sanaldi (tengsizlik QAT'IY, uch va minus uch kirmaydi);
//   3 — faqat musbat tomon sanaldi (З58: modul ikki tomonni ham beradi);
//   7 — ham chegaralar, ham nol ortiqcha.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'count_integers_abs', level: '🟡',
  target: 5, allowNeg: false,
  expr: ['|x| < 3'], exprSize: 30,
  given: [[{ fig: 'axis', from: -4, to: 4, step: 1, w: 216, h: 46, marks: [] }]],
  givenLabel: L('Son o\'qi', 'Числовая прямая', 'Number line'),
  eyebrow: L('Nechta', 'Сколько', 'How many'),
  setup: L(
    "Modul noldan uzoqlikni bildiradi, ya'ni tengsizlik noldan uch birlikdan yaqin turgan sonlarni so'rayapti. Ular orasida nechta butun son borligini sanash kerak.",
    'Модуль означает удалённость от нуля, то есть неравенство спрашивает про числа, стоящие ближе трёх единиц к нулю. Надо сосчитать, сколько среди них целых.',
    'The absolute value means distance from zero, so the inequality asks for the numbers standing closer than three units to zero. Count how many whole numbers are among them.'),
  label: L('Butun yechimlar soni', 'Число целых решений', 'The number of whole solutions'),
  ask: L('Nechta butun yechim bor?', 'Сколько целых решений?', 'How many whole solutions are there?'),
  correctText: L(
    "To'g'ri. Modul uchdan kichik degani, x minus uch bilan uch orasida — ikki tomonda ham. Tengsizlik qat'iy, ya'ni chegaralar kirmaydi: minus ikki, minus bir, nol, bir, ikki — beshta.",
    'Верно. Модуль меньше трёх значит, что x между минус тремя и тремя — с обеих сторон. Неравенство строгое, значит границы не входят: минус два, минус один, нуль, один, два — пять.',
    'Correct. Absolute value less than three means x lies between minus three and three — on both sides. The inequality is strict, so the boundaries are out: minus two, minus one, zero, one, two — five.'),
  wrongs: [
    { when: (s) => s.value === 7, text: L(
      "Chegaralar ortiqcha sanalgan. Tengsizlik QAT'IY: modul uchdan kichik, teng emas. Uchni qo'yib tekshiring — uchning moduli uch, uch esa uchdan kichik emas. Minus uch bilan ham xuddi shunday. Agar belgi ostida chiziq bo'lganida, javob yetti bo'lardi.",
      'Границы сосчитаны лишними. Неравенство СТРОГОЕ: модуль меньше трёх, а не равен. Подставь тройку — модуль трёх три, а три не меньше трёх. С минус тремя так же. Будь под знаком черта, ответом было бы семь.',
      'The boundaries were counted in excess. The inequality is STRICT: the absolute value is less than three, not equal. Substitute three — its absolute value is three, and three is not less than three. The same with minus three. Had the sign carried a line, the answer would be seven.') },
    { when: (s) => s.value === 3, text: L(
      "Faqat bitta tomon sanalgan. Modul noldan uzoqlikni beradi, uzoqlik esa yo'nalishni bilmaydi: minus ikkining moduli ham ikki, ikkining moduli ham ikki. Shuning uchun yechim nolning IKKI tomonida yotadi. Chizmaga qarang — noldan chapda ham bo'linmalar bor.",
      'Сосчитана только одна сторона. Модуль даёт удалённость от нуля, а удалённость не знает направления: и у минус двух модуль два, и у двух модуль два. Поэтому решение лежит по ОБЕ стороны от нуля. Посмотри на рисунок — деления есть и левее нуля.',
      'Only one side was counted. The absolute value gives a distance from zero, and a distance knows no direction: minus two has absolute value two, and so does two. So the solution lies on BOTH sides of zero. Look at the drawing — there are marks to the left of zero as well.') },
    { when: (s) => s.value === 4 || s.value === 6, text: L(
      "Sanashda son tushib qolgan yoki ortiqcha sanalgan. Chegaralarni yozing va oradagi butun sonlarni ketma-ket ayting: minus ikki, minus bir, nol, bir, ikki. Ko'pincha NOL tashlab ketiladi — uning moduli nol, va nol uchdan kichik, ya'ni u ham yechim.",
      'При счёте число потеряно или сосчитано лишним. Выпиши границы и назови подряд целые между ними: минус два, минус один, нуль, один, два. Чаще всего пропускают НУЛЬ — его модуль нуль, а нуль меньше трёх, значит он тоже решение.',
      'A number was lost or counted in excess. Write out the boundaries and name the whole numbers between them in order: minus two, minus one, zero, one, two. ZERO is skipped most often — its absolute value is zero, and zero is less than three, so it is a solution too.') },
  ],
  wrongText: L(
    "Modulni oching: x minus uch bilan uch orasida. Tengsizlik qat'iy, ya'ni chegaralar sanalmaydi. Nolni tashlab ketmang va ikkala tomonni ham sanang.",
    'Раскрой модуль: x между минус тремя и тремя. Неравенство строгое, значит границы не считаются. Не пропусти нуль и сосчитай обе стороны.',
    'Unfold the absolute value: x lies between minus three and three. The inequality is strict, so the boundaries do not count. Do not skip zero and count both sides.'),
};

export default function D29_07(props) { return <TypeValue data={DATA} {...props} />; }
