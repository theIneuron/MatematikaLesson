// Dars16 · Amaliyot 01 — Ildizlar · 🟢 · tag: roots_of_incomplete
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4 (16-dars, 1-pozitsiya)
//
// З42 BIRINCHI TOPSHIRIQDA. `ax² + bx = 0` turidagi tenglamada ikkala tomonni
// x ga bo'lish eng tez yo'l bo'lib ko'rinadi, va o'shanda x = 4 chiqadi —
// ikkinchi variant aynan shu. Lekin nolga bo'lish mumkin emas, va x = 0
// tenglamani to'g'ri qiladi, ya'ni u ildiz. Bo'lish uni tekshirmasdan
// chetga chiqarib tashlaydi (`Dars16.jsx`, 12-ekran).
//
// To'g'ri yo'l — ko'paytuvchilarga ajratish: x(x − 4) = 0.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'roots_of_incomplete', level: '🟢',
  correct: 0, optCols: 2, optSize: 18,
  expr: ['x² − 4x = 0'], exprSize: 30,
  eyebrow: L('Ildizlar', 'Корни', 'Roots'),
  setup: L(
    "Bu tenglamada ozod had yo'q, ya'ni u chala kvadrat tenglama. Chap tomonda umumiy ko'paytuvchi bor.",
    'В этом уравнении нет свободного члена, значит оно неполное квадратное. В левой части есть общий множитель.',
    'This equation has no constant term, so it is an incomplete quadratic. The left side holds a common factor.'),
  ask: L('Tenglamaning ildizlari qanday?', 'Каковы корни уравнения?', 'What are the roots of the equation?'),
  opts: [
    { label: ['x = 0 va x = 4'] },
    { label: ['x = 4'] },
    { label: ['x = 0'] },
    { label: ['x = −4'] },
  ],
  correctText: L(
    "To'g'ri. Umumiy ko'paytuvchini qavsdan chiqaramiz: x karra qavs ichida x minus to'rt nolga teng. Ko'paytma nolga aylanadi, agar ko'paytuvchilardan biri nol bo'lsa — demak x nolga teng yoki x minus to'rt nolga teng. Ikki ildiz: nol va to'rt. Tekshirish: nolda nol minus nol nol; to'rtda o'n olti minus o'n olti nol.",
    'Верно. Вынесем общий множитель: икс на скобку икс минус четыре равно нулю. Произведение обращается в нуль, если хотя бы один множитель нуль — значит икс равен нулю или икс минус четыре равно нулю. Два корня: нуль и четыре. Проверка: в нуле нуль минус нуль нуль; в четырёх шестнадцать минус шестнадцать нуль.',
    'Correct. Take out the common factor: x times the bracket x minus four equals zero. A product is zero when one of its factors is zero — so x is zero or x minus four is zero. Two roots: zero and four. Check: at zero, zero minus zero is zero; at four, sixteen minus sixteen is zero.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "To'rt haqiqatan ildiz, lekin u yolg'iz emas. Bu javob ikkala tomonni x ga bo'lishdan chiqadi, va aynan shu qadam nol ildizni yo'qotadi: x nolga teng bo'lganda x ga bo'lish mumkin emas. Nolni qo'yib ko'ring: nol minus nol nol, ya'ni nol ham ildiz.",
      'Четыре действительно корень, но он не один. Этот ответ выходит из деления обеих частей на икс, и именно этот шаг теряет корень нуль: при иксе равном нулю делить на икс нельзя. Подставь нуль: нуль минус нуль нуль, значит нуль тоже корень.',
      'Four really is a root, but it is not alone. This answer comes from dividing both sides by x, and that very step loses the root zero: when x is zero you cannot divide by x. Substitute zero: zero minus zero is zero, so zero is a root too.') },
    { when: (s) => s.picked === 2, text: L(
      "Nol ildiz, lekin ikkinchisi tushib qoldi. Qavsdan chiqargandan keyin ikki ko'paytuvchi qoladi: x va x minus to'rt. Ikkinchisini ham nolga tenglang: x minus to'rt nol bo'lsa x to'rtga teng. Tekshiring: o'n olti minus o'n olti nol.",
      'Нуль — корень, но второй потерялся. После вынесения остаются два множителя: икс и икс минус четыре. Приравняй к нулю и второй: если икс минус четыре нуль, то икс равен четырём. Проверь: шестнадцать минус шестнадцать нуль.',
      'Zero is a root, but the second one is missing. After factoring, two factors remain: x and x minus four. Set the second to zero as well: if x minus four is zero then x is four. Check: sixteen minus sixteen is zero.') },
    { when: (s) => s.picked === 3, text: L(
      "Minus to'rtni qo'yib ko'ring: minus to'rtning kvadrati arti o'n olti, minus to'rt karra minus to'rt arti o'n olti. O'n olti qo'shuv o'n olti o'ttiz ikki chiqadi, nol emas. Ikkinchi ko'paytuvchi x minus to'rt, uning noli esa arti to'rtda.",
      'Подставь минус четыре: минус четыре в квадрате плюс шестнадцать, минус четыре на минус четыре плюс шестнадцать. Шестнадцать плюс шестнадцать даёт тридцать два, а не нуль. Второй множитель икс минус четыре, и его нуль в плюс четырёх.',
      'Substitute minus four: minus four squared is plus sixteen, and minus four times minus four is plus sixteen. Sixteen plus sixteen gives thirty two, not zero. The second factor is x minus four and its zero sits at plus four.') },
  ],
  wrongText: L(
    "Ikki tomonni x ga BO'LMANG — o'shanda nol ildiz yo'qoladi. Umumiy ko'paytuvchini qavsdan chiqarib, har ko'paytuvchini alohida nolga tenglang.",
    'Не ДЕЛИ обе части на икс — так теряется корень нуль. Вынеси общий множитель и приравняй к нулю каждый множитель по отдельности.',
    'Do NOT divide both sides by x — that loses the root zero. Take out the common factor and set each factor to zero separately.'),
};

export default function D16_01(props) { return <Choice data={DATA} {...props} />; }
