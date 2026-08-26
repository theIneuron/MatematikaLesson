// Dars47 · Amaliyot 06 — Kod · 🟡 · tag: code_tests
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §9 (47-dars, 6-pozitsiya)
//
// DARSLIKNING UCH TESTI (106-bet), hammasida GIPOTENUZA so'raladi:
//   katet 12, gipotenuza ikkinchi katetdan 6 uzun    -> 15
//   katet 12, ikkinchi katet gipotenuzadan 8 qisqa   -> 13
//   rombning diagonallari 14 va 48                   -> tomoni 25
// Bankdagi tuzoqlar: 18 (12 + 6) va 20 (12 + 8) — З99 va З91 aralashmasi,
// 31 (7 + 24, yarim diagonallarni chiziqli qo'shish).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_tests', level: '🟡',
  expr: ['a = 12,  c = b + 6', '   ', 'a = 12,  b = c − 8', '   ', 'd₁ = 14,  d₂ = 48'], exprSize: 13,
  cards: ['13', '15', '18', '20', '25', '31'],
  answer: ['13', '15', '25'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch masala: birinchi ikkitasida gipotenuza ikkinchi katetdan olti va sakkiz birlik farq qiladi, uchinchisida rombning diagonallari berilgan. Gipotenuza yoki tomon so'raladi.",
    'В комнате сейф, код трёхзначный. Три задачи: в первых двух гипотенуза отличается от второго катета на шесть и на восемь, в третьей даны диагонали ромба. Спрашивается гипотенуза или сторона.',
    'There is a safe in the room, its code three digits. Three problems: in the first two the hypotenuse differs from the other leg by six and by eight; the third gives the diagonals of a rhombus. Each asks for a hypotenuse or a side.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni toping va kodga o'sish tartibida yozing.",
    'Найди три ответа и запиши их в код по возрастанию.',
    'Find the three answers and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchi masala: ikkinchi katet x bo'lsa, gipotenuza x qo'shuv olti; tenglama o'n ikki x teng bir yuz sakkiz, x teng to'qqiz, gipotenuza esa o'n besh. Ikkinchi masala: gipotenuza x bo'lsa, ikkinchi katet x minus sakkiz; tenglama o'n olti x teng ikki yuz sakkiz, x teng o'n uch. Uchinchi masala boshqa yo'ldan: rombning diagonallari bir-birini teng ikkiga bo'ladi va perpendikulyar, ya'ni katetlar yetti va yigirma to'rt; qirq to'qqiz qo'shuv besh yuz yetmish olti olti yuz yigirma besh, ildizi yigirma besh. O'sish tartibida: o'n uch, o'n besh, yigirma besh.",
    'Верно. Первая задача: если второй катет x, то гипотенуза x плюс шесть; уравнение двенадцать x равно ста восьми, x равен девяти, а гипотенуза пятнадцать. Вторая задача: если гипотенуза x, то второй катет x минус восемь; уравнение шестнадцать x равно двухсот восьми, x равен тринадцати. Третья задача другим путём: диагонали ромба делят друг друга пополам и перпендикулярны, значит катеты семь и двадцать четыре; сорок девять плюс пятьсот семьдесят шесть — шестьсот двадцать пять, корень двадцать пять. По возрастанию: тринадцать, пятнадцать, двадцать пять.',
    'Correct. The first problem: if the other leg is x, the hypotenuse is x plus six; the equation twelve x equals one hundred eight gives x as nine, so the hypotenuse is fifteen. The second: if the hypotenuse is x, the other leg is x minus eight; the equation sixteen x equals two hundred eight gives x as thirteen. The third takes another route: the diagonals of a rhombus bisect each other and are perpendicular, so the legs are seven and twenty four; forty nine plus five hundred seventy six is six hundred twenty five, the root is twenty five. In increasing order: thirteen, fifteen, twenty five.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('18') !== -1 || s.slots.indexOf('20') !== -1, text: L(
      "Bu sonlar shartdagi ikki sonni qo'shishdan chiqadi: o'n ikki qo'shuv olti va o'n ikki qo'shuv sakkiz. Lekin shartda olti va sakkiz KATETLAR bilan gipotenuzaning farqi, ya'ni ular berilgan katetga qo'shilmaydi. Noma'lumni harf bilan belgilab, tenglama tuzish kerak.",
      'Эти числа получаются сложением двух чисел из условия: двенадцать плюс шесть и двенадцать плюс восемь. Но шесть и восемь в условии — разность гипотенузы и ВТОРОГО катета, они не прибавляются к данному катету. Надо обозначить неизвестное буквой и составить уравнение.',
      'These numbers come from adding two numbers of the condition: twelve plus six and twelve plus eight. But the six and the eight are the gap between the hypotenuse and the OTHER leg; they are not added to the given leg. The unknown must be labelled and an equation formed.') },
    { when: (s) => s.slots.indexOf('31') !== -1, text: L(
      "O'ttiz bir — yarim diagonallarni chiziqli qo'shishdan chiqadi: yetti qo'shuv yigirma to'rt. Pifagor teoremasi kvadratlarni qo'shadi: qirq to'qqiz qo'shuv besh yuz yetmish olti olti yuz yigirma besh, ildizi yigirma besh. Tomon har doim yarim diagonallarning yig'indisidan kichik bo'ladi.",
      'Тридцать один получается линейным сложением полудиагоналей: семь плюс двадцать четыре. Теорема Пифагора складывает квадраты: сорок девять плюс пятьсот семьдесят шесть — шестьсот двадцать пять, корень двадцать пять. Сторона всегда меньше суммы полудиагоналей.',
      'Thirty one comes from adding the half diagonals linearly: seven plus twenty four. The Pythagorean theorem adds squares: forty nine plus five hundred seventy six is six hundred twenty five, the root is twenty five. The side is always less than the sum of the half diagonals.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: o'n uch, o'n besh, yigirma besh. Masalalarning tartibi javoblarning tartibiga mos kelmaydi.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: тринадцать, пятнадцать, двадцать пять. Порядок задач с порядком ответов не совпадает.',
      'The three answers are right, the order is not. The code goes in increasing order: thirteen, fifteen, twenty five. The order of the problems does not match the order of the answers.') },
    { when: (s) => s.slots.indexOf('25') === -1, text: L(
      "Kodda yigirma besh yo'q, lekin rombning tomoni aynan shu. Diagonallar bir-birini teng ikkiga bo'ladi: yarim diagonallar yetti va yigirma to'rt, va ular perpendikulyar, ya'ni katetlar. Qirq to'qqiz qo'shuv besh yuz yetmish olti ning ildizi yigirma besh.",
      'В коде нет двадцати пяти, а сторона ромба именно такая. Диагонали делят друг друга пополам: полудиагонали семь и двадцать четыре, и они перпендикулярны, то есть катеты. Корень из сорока девяти плюс пятисот семидесяти шести равен двадцати пяти.',
      'The code has no twenty five, yet that is the side of the rhombus. The diagonals bisect each other: the half diagonals are seven and twenty four, and they are perpendicular, hence legs. The root of forty nine plus five hundred seventy six is twenty five.') },
  ],
  wrongText: L(
    "Ikki masalada noma'lumni harf bilan belgilab tenglama tuzing, uchinchisida yarim diagonallarni oling.",
    'В двух задачах обозначь неизвестное буквой и составь уравнение, в третьей возьми полудиагонали.',
    'In two problems label the unknown and form an equation; in the third take the half diagonals.'),
};

export default function D47_06(props) { return <CodeLock data={DATA} {...props} />; }
