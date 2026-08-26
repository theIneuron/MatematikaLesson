// Dars01 · Amaliyot 04 — Nuqta · 🟡 · teg: place_point
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md §04
//
// METODIST QARORI 2026-08-26 (ikkinchi): jadval GORIZONTAL yoziladi va
// funksiyaning O'ZI ham beriladi, lekin OZOD HADI noma'lum: y = 3x + b.
// Shu bilan topshiriq «jadvaldan ko'chirish» bo'lib qolmaydi — b ni avval
// jadvalning to'liq ustunidan topish kerak.
//
// MATEMATIKA. Jadvalda uchta ustun: (−1; 0), (0; ?), (?; −3). To'liq ustun
// b ni beradi: 3·(−1) + b = 0, demak b = 3. Undan keyin ikkita savol:
//   x = 0 da qiymat qanday?      y = 3·0 + 3 = 3   → nuqta (0; 3)
//   y = −3 da argument qanday?   3x + 3 = −3       → nuqta (−2; −3)
// Ikkala nuqta ham tekislikka qo'yiladi, ikkalasi ham to'g'ri bo'lsagina
// zachot.
//
// TUZOQLAR TEKISLIKDA BOR, ya'ni o'quvchi ularni qila oladi va razbor
// chiqadi: (0; 0) — ozod had nol deb olingan; (−3; −3) — qiymat argument
// deb olingan; (3; 0) va (−3; −2) — koordinatalar almashtirilgan.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'place_point', level: '🟡',
  eyebrow: L('Nuqta', 'Точка', 'Point'),
  setup: L(
    "Funksiya formula bilan berilgan, lekin ozod hadi noma'lum. Uni jadvalning to'liq ustunidan toping.",
    'Функция задана формулой, но свободный член неизвестен. Найди его по полному столбцу таблицы.',
    'The function is given by a formula, but the constant term is unknown. Find it from the full column of the table.'),
  ask: L(
    "x = 0 ga mos nuqtani va y = −3 ga mos nuqtani tekislikka qo'ying.",
    'Поставь на плоскости точку, отвечающую x = 0, и точку, отвечающую y = −3.',
    'Place the point that matches x = 0 and the point that matches y = −3.'),
  expr: ['y = 3x + b'],
  table: {
    xLabel: 'x', yLabel: 'y',
    cols: [{ x: '−1', y: '0' }, { x: '0', y: '?' }, { x: '?', y: '−3' }],
  },
  plane: { x0: -4, x1: 4, y0: -4, y1: 4 },
  answer: [[0, 3], [-2, -3]],
  correctText: L(
    "To'g'ri, ikkala nuqta ham. To'liq ustun ozod hadni berdi: minus birda qiymat nolga teng, demak uch marta minus bir qo'shuv b nolga teng va b uchga teng. Shundan keyin nolda qiymat uchga teng bo'ldi, minus uch qiymati esa minus ikkida chiqdi.",
    'Верно, обе точки. Полный столбец дал свободный член: при минус единице значение равно нулю, значит три умножить на минус один плюс b равно нулю и b равно трём. После этого при нуле значение оказалось равным трём, а значение минус три получилось при минус двух.',
    'Correct, both points. The full column gave the constant term: at minus one the value is zero, so three times minus one plus b equals zero and b equals three. After that the value at zero came out as three, and the value minus three came out at minus two.'),
  wrongs: [
    { when: (s) => s.has(0, 0), text: L(
      "x nolga teng bo'lganda qiymat ham nol bo'lishi shart emas: formulada ozod had bor. Uni to'liq ustundan toping — minus birda qiymat nolga teng.",
      'При x, равном нулю, значение не обязано быть нулём: в формуле есть свободный член. Найди его по полному столбцу — при минус единице значение равно нулю.',
      'When x is zero the value need not be zero: the formula has a constant term. Find it from the full column — at minus one the value is zero.') },
    { when: (s) => s.has(-3, -3), text: L(
      "Minus uch — bu QIYMAT, argument emas. Uni formulaning chap tomoniga qo'ying va tenglamani yeching.",
      'Минус три — это ЗНАЧЕНИЕ, а не аргумент. Подставь его в левую часть формулы и реши уравнение.',
      'Minus three is the VALUE, not the argument. Put it on the left-hand side of the formula and solve the equation.') },
    { when: (s) => s.has(3, 0) || s.has(-3, -2), text: L(
      "Koordinatalar o'rin almashdi. Birinchi son har doim gorizontal o'qda, ikkinchisi tik o'qda o'lchanadi.",
      'Координаты поменялись местами. Первое число всегда откладывают по горизонтальной оси, второе — по вертикальной.',
      'The coordinates changed places. The first number always goes along the horizontal axis, the second along the vertical one.') },
    { when: (s) => s.has(0, 3), text: L(
      "Birinchi nuqta joyida. Ikkinchisi uchun minus uchni QIYMAT sifatida formulaga qo'ying: uch iks qo'shuv uch minus uchga teng.",
      'Первая точка на месте. Для второй подставь минус три как ЗНАЧЕНИЕ: три икс плюс три равно минус трём.',
      'The first point is right. For the second one put minus three in as the VALUE: three x plus three equals minus three.') },
    { when: (s) => s.has(-2, -3), text: L(
      "Ikkinchi nuqta joyida. Birinchisi uchun formulaga nolni qo'ying: uch marta nol nolga teng, demak qiymatni nima beradi?",
      'Вторая точка на месте. Для первой подставь в формулу нуль: три умножить на нуль равно нулю, а что тогда даёт значение?',
      'The second point is right. For the first one put zero into the formula: three times zero is zero, so what gives the value then?') },
  ],
  wrongText: L(
    "Avval ozod hadni toping: to'liq ustunni formulaga qo'ying. Keyin qolgan ikkita katakni hisoblang va har nuqtaning ikkala sonini ham tekshiring.",
    'Сначала найди свободный член: подставь в формулу полный столбец. Потом вычисли две оставшиеся клетки и проверь у каждой точки оба числа.',
    'First find the constant term: put the full column into the formula. Then compute the two remaining cells and check both numbers of each point.'),
};

export default function D01_04(props) { return <PlacePoint data={DATA} {...props} />; }
