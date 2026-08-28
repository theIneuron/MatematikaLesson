// Dars10 · Amaliyot 10 — Xato qator · 🔴 · teg: faqat-bir-chiziqda-tekshirish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// Sistema: y = 2x, y = x² − 3. Tenglashtirish x² − 2x − 3 = 0 beradi,
// ildizlari −1 va 3. Yechim (−1; −2) va (3; 6).
// Xato UCHINCHI qatorda: ordinata PARABOLAdan emas, adashib CHIZIQdan
// olingan deb emas — aksincha, iks uchga teng bo'lganda igrek to'g'ri
// olti, lekin iks minus birga teng bo'lganda igrek minus ikki emas, ikki
// deb yozilgan: ishora tashlab ketilgan. To'rtinchi qator faqat CHIZIQda
// tekshirgani uchun xatoni ko'rsatmaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'faqat-bir-chiziqda-tekshirish', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim grafik usulda emas, tenglashtirish bilan yozilgan. Tekshiruv ham bor, lekin u xatoni tutmagan.",
    'Решение записано не по графику, а приравниванием. Проверка тоже есть, но ошибку она не поймала.',
    'The solution is written by equating rather than from the graph. There is a check too, but it did not catch the error.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['y = 2x'], ['y = x² − 3']],
  exprSize: 15,
  rows: [
    { id: 'r1', tokens: ['2x = x² − 3'] },
    { id: 'r2', tokens: ['x² − 2x − 3 = 0', ',', 'x₁ = −1', ',', 'x₂ = 3'] },
    { id: 'r3', text: L('Nuqtalar:', 'Точки:', 'Points:'), tokens: ['(−1; 2)', 'va', '(3; 6)'] },
    { id: 'r4', text: L('Tekshirish:', 'Проверка:', 'Check:'), tokens: ['3 · 2 = 6'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Iks minus birga teng bo'lganda chiziq bo'yicha igrek MINUS ikki chiqadi, yozuvda esa musbat ikki turibdi. To'rtinchi qator buni ko'rsatmaydi: u faqat ikkinchi nuqtani va faqat CHIZIQda tekshirgan.",
    'Верно, ошибка в третьей строке. При иксе минус один по прямой игрек равен МИНУС двум, а в записи стоит плюс два. Четвёртая строка этого не показывает: она проверила только вторую точку и только по ПРЯМОЙ.',
    'Correct, the error is in the third line. At x equal to minus one the line gives y equal to MINUS two, while the record shows plus two. The fourth line does not reveal this: it checked only the second point and only against the LINE.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: kesishish nuqtasida ikkala igrek ham bir xil, shuning uchun o'ng qismlarni tenglashtirish mumkin.",
      'Эта строка верна: в точке пересечения оба игрека одинаковы, поэтому правые части можно приравнять.',
      'This line is right: at a crossing both y-values are the same, so the right-hand sides may be equated.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: hadlarni bir tomonga o'tkazsak iks kvadrat minus ikki iks minus uch nolga teng, ildizlari minus bir va uch. Keyingi qatorga qarang — ordinatalar to'g'ri hisoblanganmi?",
      'Эта тоже верна: перенеся слагаемые, получим икс в квадрате минус два икс минус три равно нулю, корни минус один и три. Посмотри на следующую строку: верно ли посчитаны ординаты?',
      'This one is right too: moving the terms gives x squared minus two x minus three equals zero, with roots minus one and three. Look at the next line — are the ordinates computed correctly?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qatorda hisob to'g'ri: uch karra ikki haqiqatan olti. Uning kamchiligi boshqada — u faqat bitta nuqtani va faqat bitta tenglamani tekshirgan, xatoning o'zi esa undan yuqorida.",
      'В четвёртой строке вычисление верно: три умножить на два действительно шесть. Её недостаток в другом — она проверила лишь одну точку и лишь одно уравнение, а сама ошибка выше.',
      'The arithmetic in the fourth line is right: three times two really is six. Its flaw is different — it checked only one point and only one equation, while the error itself is above.') },
  ],
  wrongText: L(
    "Har bir ildizni chiziqning tenglamasiga qo'ying va igrekni o'zingiz hisoblang: iks minus birga teng bo'lganda igrek qanday ishorada chiqadi?",
    'Подставь каждый корень в уравнение прямой и посчитай игрек сам: какой знак получается при иксе минус один?',
    'Put each root into the equation of the line and compute y yourself: what sign comes out at x equal to minus one?'),
};

export default function D10_10(props) { return <AuditLines data={DATA} {...props} />; }
