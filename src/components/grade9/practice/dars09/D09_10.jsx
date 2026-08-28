// Dars09 · Amaliyot 10 — Xato qator · 🔴 · teg: juftlik-tartib-farqi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// Yechimning boshi to'g'ri: tenglama ham, ildizlar ham. Xato uchinchi
// qatorda — ikkita juftlikdan faqat bittasi yozilgan. To'rtinchi qator
// esa tekshiruv, va u aynan shu bitta juftlikni tekshirgani uchun
// xatoni ko'rsatmaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'juftlik-tartib-farqi', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim tayyor, lekin javob to'liq emas. Har bir qator to'g'riday ko'rinadi.",
    'Решение готово, но ответ неполный. Каждая строка выглядит правильной.',
    'The solution is finished, but the answer is incomplete. Every line looks right.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Yeching', 'Решить', 'Solve'),
  given: [['x + y = 9'], ['xy = 18']],
  exprSize: 16,
  rows: [
    { id: 'r1', tokens: ['z² − 9z + 18 = 0'] },
    { id: 'r2', tokens: ['z₁ = 3', ',', 'z₂ = 6'] },
    { id: 'r3', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['(3; 6)'] },
    { id: 'r4', text: L('Tekshirish:', 'Проверка:', 'Check:'), tokens: ['3 + 6 = 9', ',', '3 · 6 = 18'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Ildizlar to'g'ri topilgan, lekin ulardan IKKITA juftlik yig'iladi: uch-olti va olti-uch. Ildizlar orasida tartib yo'q, juftlikda esa bor — iks uchga ham, oltiga ham teng bo'lishi mumkin. Javobda ikkalasi ham yozilishi kerak edi. To'rtinchi qator xatoni ko'rsatmaydi, chunki u faqat yozilgan juftlikni tekshirgan.",
    'Верно, ошибка в третьей строке. Корни найдены правильно, но из них собираются ДВЕ пары: три-шесть и шесть-три. У корней порядка нет, а у пары есть — икс может равняться и трём, и шести. В ответе должны были стоять обе. Четвёртая строка ошибку не показывает, ведь она проверила только записанную пару.',
    'Correct, the error is in the third line. The roots are found correctly, but TWO pairs are assembled from them: three-six and six-three. Roots have no order, a pair does — x can equal three or six. Both pairs had to stand in the answer. The fourth line does not reveal the error because it checked only the pair that was written.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: yig'indi qarama-qarshi ishora bilan, ko'paytma esa o'z ishorasida tushgan. Xatoni undan pastda qidiring.",
      'Эта строка верна: сумма вошла с противоположным знаком, произведение — со своим. Ищи ошибку ниже.',
      'This line is right: the sum entered with the opposite sign and the product with its own. Look for the error below.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: uch va oltining yig'indisi to'qqiz, ko'paytmasi o'n sakkiz. Keyingi qadamga qarang — ikki ildizdan nechta juftlik yig'iladi?",
      'Эта тоже верна: сумма трёх и шести — девять, произведение — восемнадцать. Посмотри на следующий шаг: сколько пар собирается из двух корней?',
      'This one is right too: three and six sum to nine and multiply to eighteen. Look at the next step — how many pairs are assembled from two roots?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qatorda hisob to'g'ri: uch qo'shuv olti haqiqatan to'qqiz. U xatoni ko'rsatmaydi, chunki faqat bitta juftlikni tekshirgan — lekin xatoning o'zi undan yuqorida.",
      'В четвёртой строке вычисления верны: три плюс шесть действительно девять. Она не показывает ошибку, потому что проверила лишь одну пару, — но сама ошибка выше.',
      'The arithmetic in the fourth line is right: three plus six really is nine. It does not reveal the error because it checked only one pair — but the error itself is above.') },
  ],
  wrongText: L(
    "Ikkita ildizdan nechta juftlik tuzish mumkin? Iks uchga teng bo'lgan holat va iks oltiga teng bo'lgan holat — bir xilmi?",
    'Сколько пар можно составить из двух корней? Случай, когда икс равен трём, и случай, когда икс равен шести, — это одно и то же?',
    'How many pairs can be made from two roots? Is the case x equals three the same as the case x equals six?'),
};

export default function D09_10(props) { return <AuditLines data={DATA} {...props} />; }
