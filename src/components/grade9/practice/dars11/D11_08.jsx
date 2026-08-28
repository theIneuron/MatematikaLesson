// Dars11 · Amaliyot 08 — Xato qator · 🔴 · teg: ozgaruvchini-ifodalash-xatosi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// Sistema: y = 3 − x, x² + y = 5. Qo'ysak x² + (3 − x) = 5, ya'ni
// x² − x − 2 = 0, ildizlari 2 va −1.
// Xato UCHINCHI qatorda: x = 2 da y = 1 to'g'ri, lekin x = −1 da
// y = 3 − (−1) = 4, yozuvda esa 2 turibdi — minusning minusi hisobga
// olinmagan. To'rtinchi qator xatoni tutmaydi: u faqat BIRINCHI juftlikni
// tekshirgan.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'ozgaruvchini-ifodalash-xatosi', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim o'rniga qo'yish usulida yozilgan. Tekshiruv ham bor, lekin u xatoni tutmagan.",
    'Решение записано способом подстановки. Проверка тоже есть, но ошибку она не поймала.',
    'The solution is written by substitution. There is a check too, but it did not catch the error.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['y = 3 − x'], ['x² + y = 5']],
  exprSize: 15,
  rows: [
    { id: 'r1', tokens: ['x² + (3 − x) = 5'] },
    { id: 'r2', tokens: ['x² − x − 2 = 0', ',', 'x₁ = 2', ',', 'x₂ = −1'] },
    { id: 'r3', text: L('Yechimlar:', 'Решения:', 'Solutions:'), tokens: ['(2; 1)', 'va', '(−1; 2)'] },
    { id: 'r4', text: L('Tekshirish:', 'Проверка:', 'Check:'), tokens: ['2² + 1 = 5'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Birinchi juftlik joyida: iks ikkiga teng bo'lganda igrek uch minus ikki, ya'ni bir. Ikkinchisida esa iks minus birga teng, demak igrek uch minus minus bir, ya'ni to'rt — yozuvda esa ikki turibdi. Minusning minusi qo'shuvga aylanadi, aynan shu qadam tushib qolgan. To'rtinchi qator buni ko'rsatmaydi: u faqat birinchi juftlikni tekshirgan, xato esa ikkinchisida.",
    'Верно, ошибка в третьей строке. Первая пара на месте: при иксе, равном двум, игрек равен три минус два, то есть единице. А во второй икс равен минус одному, значит игрек равен три минус минус один, то есть четырём — в записи же стоит два. Минус на минус даёт плюс, и именно этот шаг пропущен. Четвёртая строка этого не показывает: она проверила только первую пару, а ошибка во второй.',
    'Correct, the error is in the third line. The first pair is fine: at x equal to two, y is three minus two, that is one. But in the second, x is minus one, so y is three minus minus one, that is four — while the record shows two. Minus times minus becomes plus, and that is the step that was skipped. The fourth line does not reveal it: it checked only the first pair, and the error is in the second.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: igrekning o'rniga uch minus iks yozildi, ya'ni birinchi tenglamadan olingan ifoda ikkinchisiga qo'yildi.",
      'Эта строка верна: вместо игрека написано три минус икс, то есть выражение из первого уравнения подставлено во второе.',
      'This line is right: three minus x was written for y, that is, the expression from the first equation was put into the second.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: qavsni ochib hadlarni yig'sak, iks kvadrat minus iks minus ikki nolga teng, ildizlari ikki va minus bir. Keyingi qatorga qarang — igreklar to'g'ri hisoblanganmi?",
      'Эта тоже верна: раскрыв скобку и собрав слагаемые, получим икс в квадрате минус икс минус два равно нулю, корни два и минус один. Посмотри на следующую строку: верно ли посчитаны игреки?',
      'This one is right too: opening the bracket and collecting terms gives x squared minus x minus two equals zero, with roots two and minus one. Look at the next line — are the y-values computed correctly?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qatorda hisob to'g'ri: to'rt qo'shuv bir haqiqatan besh. Uning kamchiligi boshqada — u ikkita juftlikdan faqat bittasini tekshirgan, xato esa undan yuqorida.",
      'В четвёртой строке вычисление верно: четыре плюс один действительно пять. Её недостаток в другом — она проверила лишь одну пару из двух, а сама ошибка выше.',
      'The arithmetic in the fourth line is right: four plus one really is five. Its flaw is different — it checked only one of the two pairs, and the error itself is above.') },
  ],
  wrongText: L(
    "Har bir ildizni ifodaga alohida qo'ying va igrekni o'zingiz hisoblang: iks minus birga teng bo'lganda uch minus minus bir nechchi bo'ladi?",
    'Подставь каждый корень в выражение по отдельности и посчитай игрек сам: сколько будет три минус минус один?',
    'Put each root into the expression separately and compute y yourself: what is three minus minus one?'),
};

export default function D11_08(props) { return <AuditLines data={DATA} {...props} />; }
