// Dars17 · Amaliyot 08 — Xato qator · 🔴 · teg: surat-maxrajni-qisqartirib-yoqotish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// MATEMATIKA: (x − 1)(x + 5)/(x − 1) ≥ 0. Qisqartirish IFODANI to'g'ri
// soddalashtiradi, lekin ANIQLANISH SOHASINI o'zgartirmaydi: bir hamon
// teshik nuqta. To'g'ri javob: x ≥ −5 va x ≠ 1.
//
// Xato UCHINCHI qatorda: javobda teshik nuqta yo'qolgan. To'rtinchi qator
// esa uni ochib bera olmaydi, chunki u NOLNI tekshirgan — teshik nuqtaga
// tegmaydigan son.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'surat-maxrajni-qisqartirib-yoqotish', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Surat va maxrajda bir xil qavs turibdi. Yechimda tekshiruv ham bor, lekin u xatoni tutmagan.",
    'В числителе и знаменателе стоит одинаковая скобка. В решении есть и проверка, но ошибку она не поймала.',
    'The numerator and denominator share the same bracket. The solution has a check too, but it did not catch the error.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['(x − 1)(x + 5)/(x − 1) ≥ 0']],
  exprSize: 15,
  rows: [
    { id: 'r1', text: L("Umumiy ko'paytuvchi:", 'Общий множитель:', 'Common factor:'), tokens: ['x − 1'] },
    { id: 'r2', text: L('Qisqartirgach:', 'После сокращения:', 'After cancelling:'), tokens: ['x + 5 ≥ 0'] },
    { id: 'r3', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x ≥ −5'] },
    { id: 'r4', text: L('Tekshirish:', 'Проверка:', 'Check:'), tokens: ['x = 0', ':', '(−1)(5)/(−1) = 5'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Qisqartirish ifodani soddalashtiradi, lekin ANIQLANISH SOHASINI o'zgartirmaydi: asl kasrda maxraj birda nolga aylanadi, demak bir hamon teshik nuqta. Javob esa uni yo'qotgan. To'g'ri javob: iks minus beshdan katta yoki teng, va iks birdan farqli. To'rtinchi qator buni ko'rsatmaydi, chunki u nolni tekshirgan — teshik nuqtaga tegmaydigan son. Birni qo'yganda esa hech nima chiqmaydi: nol bo'lingan nol.",
    'Верно, ошибка в третьей строке. Сокращение упрощает выражение, но не меняет ОБЛАСТЬ ОПРЕДЕЛЕНИЯ: в исходной дроби знаменатель обращается в нуль при единице, значит единица по-прежнему выколотая точка. А ответ её потерял. Верный ответ: икс больше или равен минус пяти и икс не равен единице. Четвёртая строка этого не показывает, ведь она проверила нуль — число, не задевающее выколотую точку. А при подстановке единицы не выйдет ничего: нуль делить на нуль.',
    'Correct, the error is in the third line. Cancelling simplifies the expression but does not change the DOMAIN: in the original fraction the denominator becomes zero at one, so one is still a punctured point. The answer lost it. The correct answer is x greater than or equal to minus five, and x not equal to one. The fourth line does not reveal this because it checked zero — a number that misses the punctured point. Substituting one gives nothing at all: zero over zero.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: iks minus bir haqiqatan ham suratda ham, maxrajda ham turibdi.",
      'Эта строка верна: икс минус один действительно стоит и в числителе, и в знаменателе.',
      'This line is right: x minus one really does stand in both the numerator and the denominator.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: birdan farqli hamma iksda kasr iks qo'shuv beshga teng, va tengsizlik shu ko'rinishga keladi. Keyingi qatorga qarang — javobda hamma shart hisobga olinganmi?",
      'Эта тоже верна: при всех иксах, кроме единицы, дробь равна икс плюс пять, и неравенство принимает такой вид. Посмотри на следующую строку: учтены ли в ответе все условия?',
      'This one is right too: for every x except one the fraction equals x plus five, and the inequality takes that form. Look at the next line — does the answer account for every condition?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qatorda hisob to'g'ri: minus bir karra besh bo'lingan minus bir haqiqatan besh. Uning kamchiligi boshqada — u teshik nuqtaga tegmaydigan sonni tekshirgan. Birni qo'yib ko'ring va nima chiqishini ko'ring.",
      'В четвёртой строке вычисление верно: минус один на пять делить на минус один действительно пять. Её недостаток в другом — она проверила число, не задевающее выколотую точку. Подставь единицу и посмотри, что выйдет.',
      'The arithmetic in the fourth line is right: minus one times five over minus one really is five. Its flaw is different — it checked a number that misses the punctured point. Substitute one and see what happens.') },
  ],
  wrongText: L(
    "Birni ASL kasrga qo'yib ko'ring: maxrajda nol chiqadi. Bunday iks javobga kirishi mumkinmi, va yozuvdagi javob uni chiqarib tashlaganmi?",
    'Подставь единицу в ИСХОДНУЮ дробь: в знаменателе выйдет нуль. Может ли такой икс входить в ответ, и исключил ли его записанный ответ?',
    'Substitute one into the ORIGINAL fraction: the denominator comes out zero. Can such an x be in the answer, and did the recorded answer exclude it?'),
};

export default function D17_08(props) { return <AuditLines data={DATA} {...props} />; }
