// Dars52 · Amaliyot 07 — Kod · 🟡 · tag: code_three
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §4 (52-dars, 7-pozitsiya)
//
// UCH SAVOL UCH TASDIQQA TEGADI, ya'ni kod darsning uchala qismini bir
// joyga yig'adi:
//   gipotenuza 20  -> R = 10          (T2)
//   ∠A = 115°      -> ∠C = 65         (T3, burchaklar)
//   AB=7, BC=5, CD=9 -> DA = 11       (T3, tomonlar)
// Bankdagi `16` — З111: tomonlar teng deb olinganda chiqadigan son.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_three', level: '🟡',
  expr: ['gipotenuza 20', '   ', '∠A = 115°', '   ', '7,  5,  9,  ?'], exprSize: 15,
  cards: ['10', '11', '16', '20', '65', '115'],
  answer: ['10', '11', '65'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch savol: to'g'ri burchakli uchburchakning gipotenuzasi yigirma, tashqi aylananing radiusi izlanadi; ichki chizilgan to'rtburchakda A burchagi bir yuz o'n besh, qarama-qarshi C izlanadi; tashqi chizilgan to'rtburchakning uch tomoni yetti, besh va to'qqiz, to'rtinchisi izlanadi.",
    'В комнате сейф, код трёхзначный. Три вопроса: гипотенуза прямоугольного треугольника двадцать, ищется радиус описанной окружности; у вписанного четырёхугольника угол A сто пятнадцать, ищется противоположный C; три стороны описанного четырёхугольника семь, пять и девять, ищется четвёртая.',
    'A safe in the room, its code has three places. Three questions: a right triangle has hypotenuse twenty, find the circumscribed radius; an inscribed quadrilateral has angle A of a hundred and fifteen, find the opposite C; a circumscribed quadrilateral has sides seven, five and nine, find the fourth.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni kodga o'sish tartibida yozing.",
    'Запиши три ответа в код по возрастанию.',
    'Write the three answers into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uch savol uch xil qoidaga tegdi. Radius gipotenuzaning yarmi, ya'ni o'n. Qarama-qarshi burchak bir yuz saksongacha to'ldiradi: bir yuz sakson ayirmoq bir yuz o'n besh — oltmish besh. To'rtinchi tomon esa yig'indilarning tengligidan chiqadi: yetti qo'shuv to'qqiz o'n olti, demak besh qo'shuv noma'lum ham o'n olti bo'lishi kerak, ya'ni noma'lum o'n bir. O'sish tartibida: o'n, o'n bir, oltmish besh.",
    'Верно. Три вопроса задели три разных правила. Радиус это половина гипотенузы, то есть десять. Противоположный угол дополняет до ста восьмидесяти: сто восемьдесят минус сто пятнадцать это шестьдесят пять. А четвёртая сторона выходит из равенства сумм: семь плюс девять шестнадцать, значит пять плюс неизвестная тоже шестнадцать, то есть неизвестная одиннадцать. По возрастанию: десять, одиннадцать, шестьдесят пять.',
    'Correct. The three questions touched three different rules. The radius is half the hypotenuse, that is, ten. The opposite angle completes to a hundred and eighty: a hundred and eighty minus a hundred and fifteen is sixty-five. And the fourth side follows from the equality of sums: seven plus nine is sixteen, so five plus the unknown is also sixteen, making the unknown eleven. In increasing order: ten, eleven, sixty-five.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('16') !== -1, text: L(
      "O'n olti kodga tushib qoldi. O'n olti — bu birinchi va uchinchi tomonning YIG'INDISI, javob emas. To'rtinchi tomonni topish uchun shu yig'indidan ikkinchi tomonni ayirish kerak: o'n olti ayirmoq besh o'n bir. Yig'indini javob deb olish — darsning tipik xatosi.",
      'Шестнадцать попало в код. Шестнадцать это СУММА первой и третьей стороны, а не ответ. Чтобы найти четвёртую сторону, из этой суммы надо вычесть вторую: шестнадцать минус пять это одиннадцать. Принять сумму за ответ — типичная ошибка урока.',
      'Sixteen got into the code. Sixteen is the SUM of the first and third sides, not the answer. To find the fourth side, subtract the second from that sum: sixteen minus five is eleven. Taking the sum for the answer is a typical error of the lesson.') },
    { when: (s) => s.slots.indexOf('20') !== -1 || s.slots.indexOf('115') !== -1, text: L(
      "Kodga shartdagi sonning O'ZI tushib qoldi. Yigirma — gipotenuza, radius esa uning yarmi. Bir yuz o'n besh — berilgan burchak, qarama-qarshisi esa bir yuz saksongacha to'ldiradi. Har savolda bitta amal bajarilishi kerak edi.",
      'В код попало САМО число из условия. Двадцать это гипотенуза, а радиус её половина. Сто пятнадцать это данный угол, а противоположный дополняет до ста восьмидесяти. В каждом вопросе надо было сделать одно действие.',
      'A number straight from the conditions got into the code. Twenty is the hypotenuse and the radius is its half. A hundred and fifteen is the given angle and the opposite one completes to a hundred and eighty. Each question needed one operation.') },
    { when: () => true, text: L(
      "Uch javobni alohida hisoblang: yigirmaning yarmi, bir yuz sakson ayirmoq bir yuz o'n besh, va yetti qo'shuv to'qqiz ayirmoq besh. Keyin uchtasini o'sish tartibida qo'ying.",
      'Посчитай три ответа по отдельности: половина двадцати, сто восемьдесят минус сто пятнадцать, и семь плюс девять минус пять. Потом поставь три числа по возрастанию.',
      'Compute the three answers separately: half of twenty, a hundred and eighty minus a hundred and fifteen, and seven plus nine minus five. Then put the three numbers in increasing order.') },
  ],
  wrongText: L(
    "Uch savol, uch qoida: gipotenuzaning yarmi, bir yuz saksongacha to'ldirish, yig'indilarning tengligi.",
    'Три вопроса, три правила: половина гипотенузы, дополнение до ста восьмидесяти, равенство сумм.',
    'Three questions, three rules: half the hypotenuse, completion to a hundred and eighty, equality of sums.'),
};

export default function D52_07(props) { return <CodeLock data={DATA} {...props} />; }
