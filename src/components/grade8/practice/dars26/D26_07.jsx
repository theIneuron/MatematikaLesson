// Dars26 · Amaliyot 07 — Nechta · 🟡 🖼 · tag: count_integers
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §8 (26-dars, 7-pozitsiya)
//
// CHIZMA — `practice/fig.jsx` ning `axis` speci (skelet §2). U SANALADIGAN
// narsani ko'rsatadi: −4 dan 5 gacha bo'linmalar. Chegara qaysi tomonga
// kirishini esa chizma aytmaydi — buni o'quvchi yozuvdan o'qiydi.
//
// Ikki chegara ikki xil: chapda chiziq bor (minus uch KIRADI), o'ngda yo'q
// (to'rt kirmaydi). Shu sababli javob yetti, olti ham, sakkiz ham emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'count_integers', level: '🟡',
  target: 7, allowNeg: false,
  expr: ['−3 ≤ x < 4'], exprSize: 28,
  given: [[{ fig: 'axis', from: -4, to: 5, step: 1, w: 210, h: 46, marks: [] }]],
  givenLabel: L('Son o\'qi', 'Числовая прямая', 'Number line'),
  eyebrow: L('Nechta', 'Сколько', 'How many'),
  setup: L(
    "Sistemaning yechimi qo'sh tengsizlik bilan yozilgan. Uning ichida nechta BUTUN son borligini sanash kerak. Ikki chegara ikki xil: biri kiradi, ikkinchisi yo'q.",
    'Решение системы записано двойным неравенством. Надо сосчитать, сколько внутри ЦЕЛЫХ чисел. Границы разные: одна входит, другая нет.',
    'The solution of the system is written as a double inequality. Count how many WHOLE numbers lie inside. The two boundaries differ: one is included, the other is not.'),
  label: L('Butun yechimlar soni', 'Число целых решений', 'The number of whole solutions'),
  ask: L('Nechta butun yechim bor?', 'Сколько целых решений?', 'How many whole solutions are there?'),
  correctText: L(
    "To'g'ri. Chap chegarada chiziq bor — minus uch ham yechim; o'ngda yo'q — to'rt kirmaydi. Sanaymiz: minus uch, minus ikki, minus bir, nol, bir, ikki, uch — yettita. Nolni tashlab ketmaslik kerak.",
    'Верно. На левой границе черта есть — минус три тоже решение; на правой нет — четыре не входит. Считаем: минус три, минус два, минус один, нуль, один, два, три — семь. Нуль пропускать нельзя.',
    'Correct. The left boundary carries a line — minus three is a solution too; the right does not — four is out. Count: minus three, minus two, minus one, zero, one, two, three — seven. Zero must not be skipped.'),
  wrongs: [
    { when: (s) => s.value === 6, text: L(
      "Bitta son sanalmay qolgan. Chap chegaraga qarang: belgining ostida CHIZIQ bor, ya'ni minus uchning o'zi ham yechim. Uni qo'yib tekshiring: minus uch minus uchga teng — «katta yoki teng» shartini bajaradi. Chegaralarni birdaniga tashlab ketib bo'lmaydi, har biriga alohida qarash kerak.",
      'Одно число не сосчитано. Посмотри на левую границу: под знаком есть ЧЕРТА, значит само минус три тоже решение. Подставь и проверь: минус три равно минус трём — условие «больше или равно» выполнено. Отбрасывать границы разом нельзя, на каждую надо смотреть отдельно.',
      'One number was not counted. Look at the left boundary: the sign carries a LINE, so minus three itself is a solution. Substitute and check: minus three equals minus three — the condition «greater than or equal» holds. The boundaries cannot be dropped wholesale; each must be looked at separately.') },
    { when: (s) => s.value === 8, text: L(
      "Bitta son ortiqcha sanalgan. O'ng chegaraga qarang: u yerda chiziq YO'Q, ya'ni to'rt yechim emas. Qo'yib tekshiring: to'rt to'rtdan kichik emas, u unga teng. Chap chegara kiradi, o'ngdagisi esa yo'q — bitta yozuvda ikki xil chegara turishi mumkin.",
      'Одно число сосчитано лишним. Посмотри на правую границу: черты там НЕТ, значит четыре решением не является. Проверь подстановкой: четыре не меньше четырёх, оно ему равно. Левая граница входит, а правая нет — в одной записи могут стоять разные границы.',
      'One number was counted in excess. Look at the right boundary: there is NO line there, so four is not a solution. Check by substitution: four is not less than four, it equals it. The left boundary is in and the right is out — one record can hold two different kinds of boundary.') },
    { when: (s) => s.value === 5 || s.value === 4, text: L(
      "Sanashda son tushib qolgan. Chegaralarni yozing va oradagi hamma butun sonni ketma-ket ayting: minus uch, minus ikki, minus bir, nol, bir, ikki, uch. Ko'pincha NOL tashlab ketiladi — u manfiy ham, musbat ham emas, lekin butun son.",
      'При счёте потеряны числа. Выпиши границы и назови подряд все целые между ними: минус три, минус два, минус один, нуль, один, два, три. Чаще всего пропускают НУЛЬ — он не отрицательный и не положительный, но целое число.',
      'Some numbers were lost in the count. Write out the boundaries and name every whole number between them in order: minus three, minus two, minus one, zero, one, two, three. ZERO is skipped most often — it is neither negative nor positive, yet it is a whole number.') },
  ],
  wrongText: L(
    "Ikki chegaraga alohida qarang: chapdagisining ostida chiziq bor, o'ngdagisida yo'q. Keyin sonlarni ketma-ket sanang va nolni tashlab ketmang.",
    'Посмотри на две границы по отдельности: под левой черта есть, под правой нет. Потом пересчитай числа подряд и не пропусти нуль.',
    'Look at the two boundaries separately: the left carries a line, the right does not. Then count the numbers one by one and do not skip zero.'),
};

export default function D26_07(props) { return <TypeValue data={DATA} {...props} />; }
