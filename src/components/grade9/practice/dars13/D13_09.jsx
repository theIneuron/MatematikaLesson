// Dars13 · Amaliyot 09 — Xato qator · 🔴 · teg: shartni-notogri-tenglamaga-otkazish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// MASALA: bir son ikkinchisidan 3 ga katta, kvadratlarining ayirmasi 33.
//   x − y = 3, x² − y² = 33 -> (x − y)(x + y) = 33 -> 3(x + y) = 33
//   -> x + y = 11; x + y = 11 va x − y = 3 dan x = 7, y = 4.
//
// Xato UCHINCHI qatorda: igrek uchga teng deb olingan — bu shartdagi
// AYIRMA, sonning o'zi emas. To'rtinchi qator faqat YIG'INDINI tekshiradi,
// shuning uchun xatoni tutmaydi: sakkiz qo'shuv uch haqiqatan o'n bir.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'shartni-notogri-tenglamaga-otkazish', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Masala: bir son ikkinchisidan uchga katta, kvadratlarining ayirmasi o'ttiz uch. Yechimda tekshiruv ham bor, lekin u xatoni tutmagan.",
    'Задача: одно число на три больше другого, разность их квадратов тридцать три. В решении есть и проверка, но ошибку она не поймала.',
    'Problem: one number is three greater than another, and the difference of their squares is thirty-three. The solution has a check too, but it did not catch the error.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x − y = 3'], ['x² − y² = 33']],
  exprSize: 15,
  rows: [
    { id: 'r1', tokens: ['(x − y)(x + y) = 33'] },
    { id: 'r2', tokens: ['3(x + y) = 33', ',', 'x + y = 11'] },
    { id: 'r3', text: L('Sonlar:', 'Числа:', 'The numbers:'), tokens: ['x = 8', ',', 'y = 3'] },
    { id: 'r4', text: L('Tekshirish:', 'Проверка:', 'Check:'), tokens: ['8 + 3 = 11'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Igrek uchga teng deb olingan, lekin uch — bu shartdagi AYIRMA, ikkinchi sonning o'zi emas. To'g'ri yechish uchun ikkita tenglamani birga olish kerak: yig'indi o'n bir, ayirma uch, demak iks yetti va igrek to'rt. Tekshiramiz: yetti minus to'rt uch, qirq to'qqiz minus o'n olti o'ttiz uch. To'rtinchi qator xatoni tutmaydi, chunki u faqat yig'indini tekshirgan: sakkiz qo'shuv uch ham o'n bir.",
    'Верно, ошибка в третьей строке. Игрек принят равным трём, но три — это РАЗНОСТЬ из условия, а не само второе число. Чтобы решить верно, надо взять два уравнения вместе: сумма одиннадцать, разность три, значит икс семь и игрек четыре. Проверяем: семь минус четыре — три, сорок девять минус шестнадцать — тридцать три. Четвёртая строка ошибку не ловит, потому что проверила только сумму: восемь плюс три — тоже одиннадцать.',
    'Correct, the error is in the third line. y was taken to be three, but three is the DIFFERENCE from the statement, not the second number itself. To solve it properly the two equations must be taken together: the sum is eleven, the difference is three, so x is seven and y is four. Check: seven minus four is three, forty-nine minus sixteen is thirty-three. The fourth line does not catch the error because it checked only the sum: eight plus three is eleven as well.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: kvadratlar ayirmasi yig'indi bilan ayirmaning ko'paytmasiga teng — bu ko'paytirishning qisqa formulasi.",
      'Эта строка верна: разность квадратов равна произведению суммы на разность — это формула сокращённого умножения.',
      'This line is right: the difference of squares equals the product of the sum and the difference — the standard identity.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: ayirma uchga teng, shuning uchun uni uch bilan almashtirish mumkin, va yig'indi o'n bir chiqadi. Keyingi qatorga qarang — sonlar shu ikki shartdan topilganmi?",
      'Эта тоже верна: разность равна трём, поэтому её можно заменить тройкой, и сумма выходит одиннадцать. Посмотри на следующую строку: найдены ли числа из этих двух условий?',
      'This one is right too: the difference is three, so it may be replaced by three, and the sum comes out eleven. Look at the next line — were the numbers found from those two conditions?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qatorda hisob to'g'ri: sakkiz qo'shuv uch haqiqatan o'n bir. Uning kamchiligi boshqada — u faqat yig'indini tekshirgan, ayirmani esa yo'q: sakkiz minus uch besh, uch emas.",
      'В четвёртой строке вычисление верно: восемь плюс три действительно одиннадцать. Её недостаток в другом — она проверила только сумму, а разность нет: восемь минус три — пять, а не три.',
      'The arithmetic in the fourth line is right: eight plus three really is eleven. Its flaw is different — it checked only the sum, not the difference: eight minus three is five, not three.') },
  ],
  wrongText: L(
    "Ikkita shartni birga oling: yig'indi o'n bir va ayirma uch. Shu ikki tenglamadan sonlarni o'zingiz toping va yozuvdagi bilan solishtiring.",
    'Возьми два условия вместе: сумма одиннадцать и разность три. Найди числа из этих двух уравнений сам и сравни с записью.',
    'Take the two conditions together: the sum is eleven and the difference is three. Find the numbers from those two equations yourself and compare with the record.'),
};

export default function D13_09(props) { return <AuditLines data={DATA} {...props} />; }
