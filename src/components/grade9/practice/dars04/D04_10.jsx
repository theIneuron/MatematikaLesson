// Dars04 · Amaliyot 10 — Xato qator · 🔴 · teg: x0-formula-belgisi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md §10
//
// Birinchi qatorda formula TO'G'RI yozilgan, uchinchi qatorda esa undagi
// minus tushib qolgan. Xato aynan shu yerda: qator formulaga zid.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'x0-formula-belgisi', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.",
    'Решение готово, но ответ неверный. Каждая строка выглядит правильной.',
    'The solution is finished, but the answer is wrong. Every line looks right.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Toping', 'Найти', 'Find'),
  given: [['y = x² + 10x + 7', '→', 'x₀ = ?']],
  exprSize: 17,
  rows: [
    { id: 'r1', tokens: ['x₀ = −b/(2a)'] },
    { id: 'r2', tokens: ['a = 1', ',', 'b = 10'] },
    { id: 'r3', tokens: ['x₀ = 10/2 = 5'] },
    { id: 'r4', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x₀ = 5'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Formulada b ning oldida minus turibdi, uchinchi qatorda esa u tushib qolgan. b o'nga teng, uning qarama-qarshisi minus o'n, ikkiga bo'lsak minus besh chiqadi. Tekshirish oson: parabola tarmoqlari yuqoriga qaragan va b musbat — uchi Oy dan CHAPDA bo'lishi kerak edi.",
    'Верно, ошибка в третьей строке. В формуле перед b стоит минус, а в третьей строке он потерялся. b равно десяти, противоположное к нему минус десять, делённое на два даёт минус пять. Проверить легко: ветви параболы вверх и b положительно — вершина должна была оказаться ЛЕВЕЕ оси Oy.',
    'Correct, the error is in the third line. The formula has a minus in front of b, and in the third line it was lost. b is ten, its opposite is minus ten, and divided by two it gives minus five. The check is easy: the branches point up and b is positive — the vertex should have ended up to the LEFT of the Oy axis.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: formula aynan shunday yoziladi, b ning oldida minus bilan. Xatoni undan pastda qidiring.",
      'Эта строка верна: формула так и записывается, с минусом перед b. Ищи ошибку ниже.',
      'This line is right: the formula is written exactly like that, with a minus in front of b. Look for the error below.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: iks kvadrat oldida bir, iks oldida o'n turibdi. Keyingi qadamga qarang — formuladagi minus qayerga ketdi?",
      'Эта тоже верна: перед икс в квадрате стоит единица, перед икс — десятка. Посмотри на следующий шаг: куда делся минус из формулы?',
      'This one is right too: one stands in front of x squared and ten in front of x. Look at the next step — where did the minus from the formula go?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator uchinchisining natijasini takrorlaydi. Bizga BIRINCHI xato kerak, oxirgisi emas.",
      'Четвёртая строка повторяет результат третьей. Нам нужна ПЕРВАЯ ошибка, а не последняя.',
      'The fourth line repeats the result of the third. We need the FIRST error, not the last one.') },
  ],
  wrongText: L(
    "Birinchi qatordagi formulani uchinchi qator bilan yonma-yon qo'ying. Formulada bor bo'lgan qaysi belgi hisobda yo'q?",
    'Положи рядом формулу из первой строки и вычисление из третьей. Какого знака, который есть в формуле, нет в вычислении?',
    'Put the formula from the first line next to the computation in the third. Which sign present in the formula is missing from the computation?'),
};

export default function D04_10(props) { return <AuditLines data={DATA} {...props} />; }
