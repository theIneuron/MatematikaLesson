// Dars01 * Amaliyot 04 -- Bir xil ko'paytuvchi, xato joy * 🟡 * tag: odz_repeated_factor
// Faqat MA'LUMOT. Tip: kit.jsx -> Fix (yozuv ICHIDAGI xato belgini topib,
// tuzatishni yozadi).
//
// METODIST QARORI 2026-08-22: bu topshiriq ilgari SlotsBank (kartani
// bosib uyani to'ldirish) edi -- bu sinfning O'Z `slots`/`fill` asbobi
// bilan bir xil shakl, ya'ni amaliyot uni takrorlagan bo'lardi. Endi BOSHQA
// shakl: tayyor (NOTO'G'RI) javobning ICHIDAGI xato belgi topiladi va
// TUZATISH yoziladi.
//
// XATO: ikkala ko'paytuvchi BIR XIL -- (x − 11)(x − 11) -- lekin xato
// javobda ular XILMA-XIL kvadratlar ayirmasidek o'qilgan: "x != 11, x != −11"
// (xuddi maxraj (x − 11)(x + 11) bo'lgandek). Bu 6-topshiriqning aynan
// TESKARI adashishi: u yerda haqiqiy kvadratlar ayirmasi, bu yerda esa
// kvadratlar ayirmasi BO'LMAGAN joyda uni ko'rish.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Fix, L } from '../kit.jsx';

const DATA = {
  tag: 'odz_repeated_factor', level: '🟡', varName: 'x',
  eyebrow: L('Xato joyni toping', 'Найди ошибку', 'Find the mistake'),
  setup: L(
    "Ikkala ko'paytuvchi bir xil.",
    'Оба множителя одинаковы.',
    'Both factors are identical.',
  ),
  given: [[{ n: '4', d: '(x − 11)(x − 11)' }]],
  statement: [
    { id: 'a', v: 'x' },
    { id: 'eq1', v: '≠' },
    { id: 'n1', v: '11,' },
    { id: 'b', v: 'x' },
    { id: 'eq2', v: '≠' },
    { id: 'n2', v: '−11' },
  ],
  wrongId: 'n2',
  correct: '11',
  ask: L(
    "Qaysi shart xato? Bosing, to'g'ri qiymatni yozing.",
    'Какое условие ошибочно? Нажми, впиши верное значение.',
    'Which condition is wrong? Tap it, type the correct value.',
  ),
  label: L('to\'g\'ri qiymat', 'верное значение', 'correct value'),
  hintsPick: {
    a: L("Bu belgi to'g'ri: birinchi shartning O'ZI xato emas.", 'Этот знак верный: сам первый знак не ошибочен.', 'This sign is right: the first sign itself is not the mistake.'),
    eq1: L("Belgi to'g'ri, muammo unda emas.", 'Знак верный, проблема не в нём.', 'The sign is right, the problem is not here.'),
    n1: L("O'n bir to'g'ri: birinchi ko'paytuvchi aynan shu sonda nolga aylanadi.", 'Одиннадцать верно: первый множитель обращается в нуль именно при этом числе.', 'Eleven is right: the first factor vanishes at exactly this number.'),
    b: L("Bu belgi to'g'ri.", 'Этот знак верный.', 'This sign is right.'),
    eq2: L("Belgi to'g'ri, muammo undan keyingi sonda.", 'Знак верный, проблема в числе после него.', 'The sign is right, the problem is in the number after it.'),
  },
  hints: {
    '-11': L(
      "Bu ayni shu xato son, uni tuzatish kerak edi, qaytarish emas.",
      'Это то самое ошибочное число, его нужно было исправить, а не повторить.',
      'That is the exact wrong number, it needed fixing, not repeating.',
    ),
  },
  fixWrong: L(
    "Ikkala ko'paytuvchi BIR XIL, (x − 11) va (x − 11): ular faqat BITTA sonda -- o'n birda -- nolga aylanadi. Minus o'n bir bu yerga tegishli emas.",
    'Оба множителя ОДИНАКОВЫ, (x − 11) и (x − 11): они обращаются в нуль только при ОДНОМ числе -- одиннадцати. Минус одиннадцать здесь ни при чём.',
    'Both factors are IDENTICAL, (x − 11) and (x − 11): they vanish at only ONE number -- eleven. Minus eleven has no place here.',
  ),
  correctText: L(
    "To'g'ri. Ikkala qavs bir xil bo'lgani uchun ular faqat bitta umumiy sonda -- o'n birda -- nolga aylanadi, ya'ni to'g'ri javob: x != 11. Tekshirish: x = 0 da maxraj (−11)(−11) = 121, kasr hisoblanadi.",
    'Верно. Так как обе скобки одинаковы, они обращаются в нуль только при одном общем числе -- одиннадцати, значит верный ответ: x != 11. Проверка: при x = 0 знаменатель равен (−11)(−11) = 121, дробь считается.',
    'Correct. Since both brackets are identical, they vanish at only one shared number -- eleven, so the right answer is x != 11. Check: at x = 0 the denominator is (-11)(-11) = 121, the fraction computes.',
  ),
};

export default function D01_04(props) { return <Fix data={DATA} {...props} />; }
