// Dars28 · Amaliyot 06 — Kod · 🟡 · tag: code_min_values
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §10 (28-dars, 6-pozitsiya)
//
// UCH SHART, IKKI XIL CHEGARA (З54):
//   x > 4,2   qat'iy, chegara kasr    -> eng kichik butun 5
//   2x ≥ 14   qat'iy emas, x ≥ 7      -> eng kichik butun 7, chegaraning O'ZI
//   x + 3 > 12 qat'iy, x > 9          -> eng kichik butun 10, chegaradan keyingi
//
// Ya'ni ikki holda chegaradan keyingi son olinadi, bir holda esa
// chegaraning o'zi — farqni belgining ostidagi chiziq hal qiladi.
// Bankdagi tuzoqlar: 4 (kasr chegarani pastga yaxlitlash), 6 va 9
// (chegaraning o'zini olib, qat'iylikni hisobga olmaslik).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_min_values', level: '🟡',
  expr: ['x > 4,2', '   ', '2x ≥ 14', '   ', 'x + 3 > 12'], exprSize: 16,
  cards: ['4', '5', '6', '7', '9', '10'],
  answer: ['5', '7', '10'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch masaladan uch shart chiqdi, va har birida noma'lum — BUTUN son (odamlar soni, kunlar soni). Har shartning eng kichik butun qiymatini topish kerak.",
    'В комнате сейф, код трёхзначный. Из трёх задач вышли три условия, и в каждом неизвестное — ЦЕЛОЕ число (число людей, число дней). Надо найти наименьшее целое значение каждого условия.',
    'There is a safe in the room and its code has three places. Three problems gave three conditions, and in each the unknown is a WHOLE number (a count of people, a count of days). Find the smallest whole value for each condition.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch shartning eng kichik butun qiymatini kodga o'sish tartibida yozing.",
    'Запиши наименьшие целые значения трёх условий в код по возрастанию.',
    'Write the smallest whole value of each of the three conditions into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisida chegara kasr: x to'rt butun ikkidan katta, ya'ni birinchi butun son besh. Ikkinchisida ikkala qismni ikkiga bo'lamiz: x yettidan katta yoki TENG — belgi ostida chiziq bor, demak yettining o'zi yaraydi. Uchinchisida uchni ko'chiramiz: x to'qqizdan katta, va belgi ostida chiziq yo'q — to'qqizning o'zi yaramaydi, birinchi mos son o'n. O'sish tartibida: besh, yetti, o'n. Ikki holda chegaradan keyingi son olindi, bir holda esa chegaraning o'zi.",
    'Верно. В первом граница дробная: x больше четырёх целых двух десятых, значит первое целое — пять. Во втором делим обе части на два: x больше или РАВЕН семи — под знаком черта, значит сама семёрка годится. В третьем переносим тройку: x больше девяти, а черты под знаком нет — сама девятка не годится, первое подходящее число десять. По возрастанию: пять, семь, десять. В двух случаях взято число после границы, а в одном — сама граница.',
    'Correct. In the first the boundary is fractional: x is greater than four point two, so the first whole number is five. In the second divide both sides by two: x is greater than or EQUAL to seven — the sign carries a line, so seven itself qualifies. In the third move the three: x is greater than nine, and the sign has no line — nine itself does not qualify and the first fitting number is ten. In increasing order: five, seven, ten. In two cases the number past the boundary was taken, in one the boundary itself.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('4') !== -1, text: L(
      "To'rt to'rt butun ikkidan KICHIK, ya'ni birinchi shartni bajarmaydi. Kasr chegarada yaxlitlash yo'nalishini tengsizlik hal qiladi: x chegaradan KATTA bo'lishi kerak, demak chegaradan o'ngdagi birinchi butun son olinadi — besh.",
      'Четыре МЕНЬШЕ четырёх целых двух десятых, значит первому условию не удовлетворяет. При дробной границе направление округления решает неравенство: x должен быть БОЛЬШЕ границы, значит берут первое целое справа от неё — пять.',
      'Four is LESS than four point two, so it does not satisfy the first condition. With a fractional boundary the direction of rounding is decided by the inequality: x must be GREATER than the boundary, so the first whole number to its right is taken — five.') },
    { when: (s) => s.slots.indexOf('9') !== -1, text: L(
      "To'qqiz uchinchi shartni bajarmaydi. Uchni ko'chiring: x o'n ikki minus uchdan katta, ya'ni to'qqizdan KATTA. Belgi ostida chiziq yo'q, demak to'qqizning o'zi yaramaydi — qo'yib tekshiring: to'qqiz qo'shuv uch o'n ikki, o'n ikki o'n ikkidan katta emas. Birinchi mos son o'n.",
      'Девять третьему условию не удовлетворяет. Перенеси тройку: x больше двенадцати минус три, то есть БОЛЬШЕ девяти. Черты под знаком нет, значит сама девятка не годится — проверь подстановкой: девять плюс три двенадцать, а двенадцать не больше двенадцати. Первое подходящее число десять.',
      'Nine does not satisfy the third condition. Move the three: x is greater than twelve minus three, that is GREATER than nine. The sign has no line, so nine itself does not qualify — check by substitution: nine plus three is twelve, and twelve is not greater than twelve. The first fitting number is ten.') },
    { when: (s) => s.slots.indexOf('6') !== -1, text: L(
      "Olti ikkinchi shartni bajarmaydi: ikki karra olti o'n ikki, o'n ikki esa o'n to'rtdan kichik. Ikkala qismni ikkiga bo'ling — x yettidan katta yoki teng chiqadi. Belgi ostida chiziq bor, ya'ni yettining O'ZI ham yaraydi va undan kichikroq butun son yo'q.",
      'Шесть второму условию не удовлетворяет: два на шесть двенадцать, а двенадцать меньше четырнадцати. Раздели обе части на два — выйдет x больше или равен семи. Под знаком черта, значит САМА семёрка годится, и меньшего целого нет.',
      'Six does not satisfy the second condition: two times six is twelve, and twelve is less than fourteen. Divide both sides by two — you get x greater than or equal to seven. The sign carries a line, so seven ITSELF qualifies and there is no smaller whole number.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: besh, yetti, o'n. Shartlarning tartibi bu yerda javoblarning tartibi bilan mos keladi, lekin buni tekshirish kerak.",
      'Три числа найдены верно, а порядок нарушен. Код пишется по возрастанию: пять, семь, десять. Порядок условий здесь совпадает с порядком ответов, но это надо проверить.',
      'The three numbers are right, the order is not. The code goes in increasing order: five, seven, ten. Here the order of the conditions happens to match the order of the answers, but that must be checked.') },
  ],
  wrongText: L(
    "Har shartni yeching va belgining ostida chiziq bor-yo'qligiga qarang. Chiziq bo'lsa chegaraning o'zi yaraydi, bo'lmasa undan keyingi butun son olinadi.",
    'Реши каждое условие и посмотри, есть ли черта под знаком. Есть — годится сама граница, нет — берут следующее целое за ней.',
    'Solve each condition and look at whether the sign carries a line. With a line the boundary itself qualifies; without it the next whole number past it is taken.'),
};

export default function D28_06(props) { return <CodeLock data={DATA} {...props} />; }
