// Dars15 · Amaliyot 10 — Xato qator · 🔴 · teg: har-safar-almashadi-deb-oylash
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// MATEMATIKA: x(x − 4)² > 0. Ildizlari 0 va 4, to'rttasi TAKRORIY.
// To'g'ri yechim: eng o'ngda beshni qo'ysak, 5 · 1 = 5 musbat; to'rtda
// ishora ALMASHMAYDI (takroriy), nolda almashadi. Demak musbat oraliq —
// noldan o'ngga, to'rtdan tashqari. Javob: x > 0, x ≠ 4.
//
// Xato UCHINCHI qatorda: takroriy ildizda ishora almashadi deb olingan.
// To'rtinchi qator o'sha xato xulosadan kelib chiqadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'har-safar-almashadi-deb-oylash', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Tengsizlik oraliqlar usulida yechilgan. Ildizlar to'g'ri topilgan, xato keyinroq.",
    'Неравенство решено методом интервалов. Корни найдены верно, ошибка позже.',
    'The inequality was solved by the interval method. The roots are right, the error comes later.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['x(x − 4)² > 0']],
  exprSize: 15,
  rows: [
    { id: 'r1', text: L('Ildizlar:', 'Корни:', 'Roots:'), tokens: ['0', ',', '4'] },
    { id: 'r2', text: L("To'rt — takroriy ildiz", 'Четыре — повторяющийся корень', 'Four is a repeated root') },
    { id: 'r3', text: L("To'rtdan o'tishda ishora almashadi", 'При переходе через четыре знак меняется', 'Crossing four flips the sign') },
    { id: 'r4', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x < 0', 'yoki', 'x > 4'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. To'rt TAKRORIY ildiz — qavs kvadratda, ya'ni nol ikki marta kesiladi va ishora joyida qoladi. Beshni qo'ysak: besh karra bir — musbat; to'rtdan chapga o'tsak ishora o'zgarmaydi, ya'ni noldan to'rtgacha ham musbat; faqat nolda almashadi. Demak javob noldan o'ngga, to'rtning o'zidan tashqari: u yerda ko'paytma nolga teng, belgi esa qat'iy. To'rtinchi qator xato, lekin u uchinchisidan kelib chiqadi.",
    'Верно, ошибка в третьей строке. Четыре — ПОВТОРЯЮЩИЙСЯ корень: скобка в квадрате, то есть нуль пересекается дважды и знак остаётся на месте. Подставим пять: пять на один — положительно; переходя влево через четыре, знак не меняется, значит от нуля до четырёх тоже положительно; меняется только в нуле. Значит ответ — правее нуля, кроме самой четвёрки: там произведение равно нулю, а знак строгий. Четвёртая строка неверна, но она следует из третьей.',
    'Correct, the error is in the third line. Four is a REPEATED root: the bracket is squared, so zero is crossed twice and the sign stays put. Substitute five: five times one — positive; crossing four leftwards does not flip it, so from zero to four it is positive too; it flips only at zero. So the answer is to the right of zero, except four itself: there the product equals zero, and the sign is strict. The fourth line is wrong, but it follows from the third.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: iks nolda nolga aylanadi, iks minus to'rt esa to'rtda. Boshqa ildiz yo'q.",
      'Эта строка верна: икс обращается в нуль при нуле, а икс минус четыре — при четырёх. Других корней нет.',
      'This line is right: x becomes zero at zero, and x minus four at four. There are no other roots.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: qavs kvadratda turibdi, ya'ni to'rt ko'paytmada ikki marta uchraydi. Keyingi qatorga qarang — takroriy ildizda ishora nima bo'ladi?",
      'Эта тоже верна: скобка стоит в квадрате, то есть четвёрка встречается в произведении дважды. Посмотри на следующую строку: что происходит со знаком в повторяющемся корне?',
      'This one is right too: the bracket is squared, so four occurs twice in the product. Look at the next line — what happens to the sign at a repeated root?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator xato, lekin u BIRINCHI xato emas: u oldingi qatorning natijasi. Xato o'sha «ishora almashadi» degan xulosada.",
      'Четвёртая строка неверна, но она не ПЕРВАЯ ошибка: она следствие предыдущей. Ошибка в самом выводе «знак меняется».',
      'The fourth line is wrong, but it is not the FIRST error: it follows from the previous one. The error is in the conclusion "the sign flips".') },
  ],
  wrongText: L(
    "Ikkita sonni tekshirib ko'ring: beshda ko'paytma musbatmi, va uchda? Ikkalasida ham bir xil ishora chiqsa, to'rtda ishora almashmagan.",
    'Проверь два числа: положительно ли произведение при пяти и при трёх? Если знак одинаков, значит в четырёх он не менялся.',
    'Test two numbers: is the product positive at five, and at three? If the sign is the same, then it did not flip at four.'),
};

export default function D15_10(props) { return <AuditLines data={DATA} {...props} />; }
