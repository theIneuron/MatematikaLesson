// Dars26 · Amaliyot 06 — Kod · 🟡 · tag: code_integers
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §8 (26-dars, 6-pozitsiya)
//
// BITTA YOZUVDA IKKI XIL CHEGARA (З54): chap chegara QAT'IY (minus ikki
// kirmaydi), o'ng chegara esa qat'iy emas (bir kiradi). Ya'ni «chegara
// kiradimi» degan savolga bitta javob yo'q — har chegaraga alohida qarash
// kerak.
//
// Bankdagi tuzoqlar: `−2` — qat'iy chegarani kiritish; `2` va `−3` —
// oraliqdan chiqib ketish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_integers', level: '🟡',
  expr: ['−2 < x ≤ 1'], exprSize: 26,
  cards: ['−3', '−2', '−1', '0', '1', '2'],
  answer: ['−1', '0', '1'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Sistemaning yechimi qo'sh tengsizlik bilan yozilgan, va uning ichida aynan uchta butun son bor. Diqqat: ikki chegara ikki xil — biri qat'iy, ikkinchisi emas.",
    'В комнате сейф, код трёхзначный. Решение системы записано двойным неравенством, и внутри него ровно три целых числа. Внимание: границы разные — одна строгая, другая нет.',
    'There is a safe in the room and its code has three places. The solution of the system is written as a double inequality holding exactly three whole numbers. Note: the two boundaries differ — one is strict, the other is not.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Yechimning butun sonlarini kodga o'sish tartibida yozing.",
    'Запиши целые числа решения в код по возрастанию.',
    'Write the whole numbers of the solution into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Chap chegarada oddiy belgi turibdi: minus ikki x dan QAT'IY kichik, ya'ni minus ikkining o'zi kirmaydi. O'ng chegarada esa belgi ostida chiziq bor: x birdan kichik yoki TENG, ya'ni bir kiradi. Shuning uchun butun sonlar: minus bir, nol va bir. Minus ikki chetda qoladi, bir esa qoladi — ikki chegara bir xil o'qilmaydi. Tekshirish: minus birni qo'ying — minus ikki minus birdan kichik, to'g'ri; minus bir birdan kichik, to'g'ri.",
    'Верно. На левой границе стоит простой знак: минус два СТРОГО меньше x, то есть само минус два не входит. А на правой под знаком есть черта: x меньше единицы или РАВЕН ей, значит единица входит. Поэтому целые числа: минус один, нуль и один. Минус два остаётся вне, а единица остаётся внутри — две границы читаются по-разному. Проверка: подставь минус один — минус два меньше минус одного, верно; минус один меньше единицы, верно.',
    'Correct. On the left boundary there is a plain sign: minus two is STRICTLY less than x, so minus two itself is out. On the right the sign carries a line: x is less than one or EQUAL to it, so one is in. Hence the whole numbers are minus one, zero and one. Minus two stays outside while one stays inside — the two boundaries are not read the same way. Check: substitute minus one — minus two is less than minus one, true; minus one is less than one, true.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('−2') !== -1, text: L(
      "Minus ikki oraliqqa KIRMAYDI. Chap chegaradagi belgiga qarang: uning ostida chiziq yo'q, ya'ni minus ikki x dan qat'iy kichik bo'lishi kerak. Minus ikkining o'zini qo'ysangiz, minus ikki minus ikkidan kichik degan yolg'on yozuv chiqadi. O'ng chegara esa boshqacha — u yerda chiziq bor.",
      'Минус два в промежуток НЕ ВХОДИТ. Посмотри на знак у левой границы: черты под ним нет, значит минус два должно быть строго меньше x. Подставив само минус два, получишь ложную запись: минус два меньше минус двух. А правая граница другая — там черта есть.',
      'Minus two is NOT in the range. Look at the sign at the left boundary: it carries no line, so minus two must be strictly less than x. Substituting minus two itself gives the false record minus two is less than minus two. The right boundary is different — there the line is present.') },
    { when: (s) => s.slots.indexOf('2') !== -1 || s.slots.indexOf('−3') !== -1, text: L(
      "Bu son oraliqdan TASHQARIDA. Ikki birdan katta, minus uch esa minus ikkidan kichik — ikkalasi ham qo'sh tengsizlikning chegaralaridan chiqib ketadi. Qo'yib tekshiring: ikki birdan kichik yoki teng emas.",
      'Это число ВНЕ промежутка. Два больше единицы, а минус три меньше минус двух — оба выходят за границы двойного неравенства. Проверь подстановкой: два не меньше и не равно единице.',
      'That number is OUTSIDE the range. Two is greater than one and minus three is less than minus two — both fall beyond the boundaries of the double inequality. Check by substitution: two is not less than or equal to one.') },
    { when: (s) => s.slots.indexOf('1') === -1, text: L(
      "Kodda bir yo'q, lekin u oraliqqa KIRADI. O'ng chegaradagi belgi ostida chiziq bor: x birdan kichik YOKI TENG. Birning o'zini qo'ying — bir birga teng, ya'ni shart bajarildi. Ikki chegara bir xil o'qilmaydi: chapdagisi qat'iy, o'ngdagisi yo'q.",
      'В коде нет единицы, а она в промежуток ВХОДИТ. Под знаком правой границы есть черта: x меньше единицы ИЛИ РАВЕН ей. Подставь саму единицу — один равен одному, значит условие выполнено. Две границы читаются по-разному: левая строгая, правая нет.',
      'The code has no one, yet one IS in the range. The sign at the right boundary carries a line: x is less than one OR EQUAL to it. Substitute one itself — one equals one, so the condition holds. The two boundaries are read differently: the left is strict, the right is not.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: minus bir, nol, bir. Manfiy son noldan kichik, nol esa birdan kichik.",
      'Три числа найдены верно, а порядок нарушен. Код пишется по возрастанию: минус один, нуль, один. Отрицательное меньше нуля, а нуль меньше единицы.',
      'The three numbers are right, the order is not. The code goes in increasing order: minus one, zero, one. A negative is below zero, and zero is below one.') },
  ],
  wrongText: L(
    "Ikki chegaraga alohida qarang: chapdagisining ostida chiziq yo'q, o'ngdagisida bor. Keyin oraliqdagi butun sonlarni o'sish tartibida yozing.",
    'Посмотри на две границы по отдельности: под левой черты нет, под правой есть. Потом выпиши целые числа промежутка по возрастанию.',
    'Look at the two boundaries separately: the left has no line, the right does. Then write the whole numbers of the range in increasing order.'),
};

export default function D26_06(props) { return <CodeLock data={DATA} {...props} />; }
