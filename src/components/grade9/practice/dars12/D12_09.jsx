// Dars12 · Amaliyot 09 — Xato qator · 🔴 · teg: orniga-qoyishni-unutish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// Sistema: 3x + y = 14, 3x − y = 4. Qo'shsak 6x = 18, ya'ni x = 3.
// Xato UCHINCHI qatorda: igrekni topishda 3x o'rniga x qo'yilgan —
// y = 14 − 3 emas, y = 14 − 3·3 = 5. To'rtinchi qator uchinchisidan
// kelib chiqadi, ya'ni «oxirgisini bosaman» yo'li ishlamaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'orniga-qoyishni-unutish', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim qo'shish usulida yozilgan. Qo'shish to'g'ri bajarilgan, xato keyinroq.",
    'Решение записано способом сложения. Сложение выполнено верно, ошибка позже.',
    'The solution is written by the addition method. The adding was done right, the error comes later.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['3x + y = 14'], ['3x − y = 4']],
  exprSize: 15,
  rows: [
    { id: 'r1', text: L("Qo'shamiz:", 'Складываем:', 'Add:'), tokens: ['6x = 18'] },
    { id: 'r2', tokens: ['x = 3'] },
    { id: 'r3', text: L('Igrek:', 'Игрек:', 'Y:'), tokens: ['y = 14 − 3 = 11'] },
    { id: 'r4', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['(3; 11)'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Birinchi tenglamada iksning oldida UCH turibdi, demak uchni qo'yganda uch karra uch, ya'ni to'qqiz chiqadi: igrek o'n to'rt minus to'qqiz, ya'ni besh. Yozuvda esa uch karra uch hisoblanmagan, o'n to'rtdan uchning o'zi ayirilgan. To'rtinchi qator uchinchisining natijasini ko'chiradi, shuning uchun u ham xato — lekin BIRINCHI xato uchinchi qatorda.",
    'Верно, ошибка в третьей строке. В первом уравнении перед иксом стоит ТРИ, значит при подстановке трёх выйдет трижды три, то есть девять: игрек равен четырнадцать минус девять, то есть пять. А в записи трижды три не посчитано, из четырнадцати вычли сам икс. Четвёртая строка переписывает результат третьей, поэтому она тоже неверна — но ПЕРВАЯ ошибка в третьей строке.',
    'Correct, the error is in the third line. In the first equation x carries a THREE in front, so substituting three gives three times three, that is nine: y equals fourteen minus nine, that is five. In the record three times three was never computed; x itself was subtracted from fourteen. The fourth line copies the result of the third, so it is wrong too — but the FIRST error is in the third line.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: igrek bilan minus igrek nol beradi, uch iks qo'shuv uch iks olti iks, o'ng tomonda o'n to'rt qo'shuv to'rt, ya'ni o'n sakkiz.",
      'Эта строка верна: игрек и минус игрек дают нуль, три икса плюс три икса — шесть иксов, справа четырнадцать плюс четыре, то есть восемнадцать.',
      'This line is right: y and minus y give zero, three x plus three x is six x, and on the right fourteen plus four, that is eighteen.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: olti iks o'n sakkizga teng bo'lsa, iks uchga teng. Keyingi qatorga qarang — igrek to'g'ri hisoblanganmi?",
      'Эта тоже верна: если шесть иксов равны восемнадцати, икс равен трём. Посмотри на следующую строку: верно ли посчитан игрек?',
      'This one is right too: if six x equals eighteen, then x is three. Look at the next line — is y computed correctly?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator xato, lekin u BIRINCHI xato emas: u shunchaki oldingi qatordan ko'chirilgan. Xato aynan igrek hisoblangan joyda paydo bo'lgan.",
      'Четвёртая строка неверна, но она не ПЕРВАЯ ошибка: она просто переписана из предыдущей. Ошибка возникла именно там, где считали игрек.',
      'The fourth line is wrong, but it is not the FIRST error: it was simply copied from the line before. The error arose exactly where y was computed.') },
  ],
  wrongText: L(
    "Uchni birinchi tenglamaga o'zingiz qo'ying: uch karra uch qo'shuv igrek o'n to'rtga teng. Igrek nechchi chiqadi?",
    'Подставь три в первое уравнение сам: трижды три плюс игрек равно четырнадцати. Чему равен игрек?',
    'Substitute three into the first equation yourself: three times three plus y equals fourteen. What is y?'),
};

export default function D12_09(props) { return <AuditLines data={DATA} {...props} />; }
