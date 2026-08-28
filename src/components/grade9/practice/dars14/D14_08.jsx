// Dars14 · Amaliyot 08 — Xato qator · 🔴 · teg: yechim-yoq-yoki-hamma-son
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// MATEMATIKA: x² − 6x + 13 > 0, D = 36 − 52 = −16 < 0, tarmoqlar yuqoriga.
// Ildiz yo'q, demak grafik butunlay Ox dan YUQORIDA: javob barcha sonlar.
//
// Xato UCHINCHI qatorda: «ildiz yo'q» dan «yechim yo'q» degan xulosa
// chiqarilgan. To'rtinchi qator uchinchisidan kelib chiqadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'yechim-yoq-yoki-hamma-son', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Tengsizlik yechilgan. Diskriminant to'g'ri hisoblangan, lekin undan chiqarilgan xulosa xato.",
    'Неравенство решено. Дискриминант посчитан верно, но вывод из него сделан неверный.',
    'The inequality was solved. The discriminant is computed correctly, but the conclusion drawn from it is wrong.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['x² − 6x + 13 > 0']],
  exprSize: 15,
  rows: [
    { id: 'r1', tokens: ['D = 36 − 52 = −16'] },
    { id: 'r2', text: L("Diskriminant manfiy, ildiz yo'q", 'Дискриминант отрицателен, корней нет', 'The discriminant is negative, there are no roots') },
    { id: 'r3', text: L("Ildiz yo'q, demak yechim ham yo'q", 'Корней нет, значит и решений нет', 'No roots, so there are no solutions either') },
    { id: 'r4', text: L("Javob: yechim yo'q", 'Ответ: решений нет', 'Answer: no solution') },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Ildiz yo'qligi grafikning Ox bilan umumiy nuqtasi yo'qligini bildiradi, xolos. Grafik uzluksiz, demak u o'qning faqat bitta tomonida turadi — tarmoqlari yuqoriga qaragani uchun butunlay YUQORIDA. Ya'ni ifoda har qanday iksda musbat va javob barcha sonlar. Nolda tekshirib ko'ring: o'n uch, musbat. Ildiz yo'qligidan yechim yo'qligi kelib chiqmaydi — ba'zan aksincha, yechim BARCHA sonlar bo'ladi.",
    'Верно, ошибка в третьей строке. Отсутствие корней означает лишь, что у графика нет общих точек с Ox. График непрерывен, значит он лежит только с одной стороны от оси — а поскольку ветви вверх, целиком ВЫШЕ. То есть выражение положительно при любом иксе и ответ — любое число. Проверь в нуле: тринадцать, положительно. Из отсутствия корней отсутствие решений не следует — иногда наоборот, решением оказываются ВСЕ числа.',
    'Correct, the error is in the third line. No roots means only that the graph has no common points with Ox. The graph is continuous, so it lies on one side of the axis only — and since the branches point upwards, entirely ABOVE it. So the expression is positive for every x and the answer is all numbers. Check at zero: thirteen, positive. No roots does not imply no solutions — sometimes the opposite, the solution is ALL numbers.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: minus oltining kvadrati o'ttiz olti, to'rt karra o'n uch ellik ikki, ayirmasi minus o'n olti.",
      'Эта строка верна: минус шесть в квадрате — тридцать шесть, четырежды тринадцать — пятьдесят два, разность минус шестнадцать.',
      'This line is right: minus six squared is thirty-six, four times thirteen is fifty-two, and the difference is minus sixteen.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: manfiy diskriminantda haqiqiy ildiz bo'lmaydi. Keyingi qatorga qarang — ildiz yo'qligidan qanday xulosa chiqarilgan?",
      'Эта тоже верна: при отрицательном дискриминанте действительных корней нет. Посмотри на следующую строку: какой вывод сделан из отсутствия корней?',
      'This one is right too: with a negative discriminant there are no real roots. Look at the next line — what conclusion was drawn from having no roots?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator xato, lekin u BIRINCHI xato emas: u shunchaki oldingi qatordan ko'chirilgan. Xato o'sha xulosa chiqarilgan joyda paydo bo'lgan.",
      'Четвёртая строка неверна, но она не ПЕРВАЯ ошибка: она просто переписана из предыдущей. Ошибка возникла там, где сделали вывод.',
      'The fourth line is wrong, but it is not the FIRST error: it was simply copied from the line before. The error arose where the conclusion was drawn.') },
  ],
  wrongText: L(
    "Nolni tengsizlikka qo'yib ko'ring: chap tomon nechchi chiqadi va tengsizlik bajariladimi? Agar bajarilsa, «yechim yo'q» degan javob to'g'ri bo'lolmaydi.",
    'Подставь нуль в неравенство: чему равна левая часть и выполняется ли неравенство? Если выполняется, ответ «решений нет» верным быть не может.',
    'Substitute zero into the inequality: what is the left side and does the inequality hold? If it does, the answer "no solution" cannot be right.'),
};

export default function D14_08(props) { return <AuditLines data={DATA} {...props} />; }
