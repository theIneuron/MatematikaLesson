// Dars55 · Amaliyot 06 — Juftlash · 🟡 · tag: vector_to_length
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §7 (55-dars, 6-pozitsiya)
//
// OLDINGI BLOKDAN: 44-darsning Pifagor teoremasi. Modul aynan shundan
// chiqadi — koordinatalar katetlar, modul gipotenuza. To'rtta ham
// tanish uchlik: 3-4-5, 6-8-10, 5-12-13, 8-15-17.
// Ikkinchisi birinchisining ikki barobari, va moduli ham ikki barobar —
// bu T2 bilan bog'lanadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'vector_to_length', level: '🟡',
  connect: true,
  targetSize: 20, itemSize: 16,
  items: [
    { id: 'm1', tokens: ['(3; 4)'] },
    { id: 'm2', tokens: ['(6; 8)'] },
    { id: 'm3', tokens: ['(5; 12)'] },
    { id: 'm4', tokens: ['(8; 15)'] },
  ],
  targets: [
    { id: 't1', tokens: ['5'] },
    { id: 't2', tokens: ['10'] },
    { id: 't3', tokens: ['13'] },
    { id: 't4', tokens: ['17'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt vektor koordinatalari bilan berilgan. Har birining modulini, ya'ni uzunligini topish kerak. Modul koordinatalarning kvadratlari yig'indisining ildiziga teng — bu Pifagor teoremasi, koordinatalar katet, modul esa gipotenuza.",
    'Четыре вектора заданы координатами. Надо найти модуль каждого, то есть длину. Модуль равен корню из суммы квадратов координат — это теорема Пифагора, где координаты катеты, а модуль гипотенуза.',
    'Four vectors are given by coordinates. Find the modulus, that is, the length, of each. The modulus equals the root of the sum of the squares of the coordinates — this is the Pythagorean theorem, with the coordinates as legs and the modulus as the hypotenuse.'),
  ask: L(
    "Chapdan vektorni bosing, keyin o'ngdan modulini bosing.",
    'Нажми вектор слева, потом его модуль справа.',
    'Tap a vector on the left, then its modulus on the right.'),
  correctText: L(
    "To'g'ri. To'rttasi ham tanish Pifagor uchligi: uch-to'rt-besh, olti-sakkiz-o'n, besh-o'n ikki-o'n uch, sakkiz-o'n besh-o'n yetti. Ikkinchi qatorga alohida qarang: uning koordinatalari birinchisinikidan aniq ikki barobar katta, va moduli ham aniq ikki barobar. Bu tasodif emas — vektorni ikkiga ko'paytirsak, uzunligi ham ikki barobar oshadi.",
    'Верно. Все четыре знакомые тройки Пифагора: три-четыре-пять, шесть-восемь-десять, пять-двенадцать-тринадцать, восемь-пятнадцать-семнадцать. Присмотрись ко второй строке: её координаты ровно вдвое больше, чем у первой, и модуль тоже ровно вдвое. Это не случайность — умножив вектор на два, мы удваиваем и длину.',
    'Correct. All four are familiar Pythagorean triples: three-four-five, six-eight-ten, five-twelve-thirteen, eight-fifteen-seventeen. Look closely at the second row: its coordinates are exactly twice those of the first, and its modulus is exactly twice as well. That is no accident — multiplying a vector by two doubles its length.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Birinchi va ikkinchi qator o'rin almashdi. Uch va to'rt katetlarda gipotenuza besh, olti va sakkizda esa o'n. Ikkinchi vektor birinchisining ikki barobari, ya'ni uning moduli ham ikki barobar katta bo'lishi kerak — besh emas, o'n.",
      'Первая и вторая строки поменялись местами. При катетах три и четыре гипотенуза пять, а при шести и восьми десять. Второй вектор вдвое больше первого, значит и модуль у него должен быть вдвое больше — не пять, а десять.',
      'The first and second rows swapped places. With legs three and four the hypotenuse is five, with six and eight it is ten. The second vector is twice the first, so its modulus must be twice as large — ten, not five.') },
    { when: (s) => s.pair.m3 !== 't3' || s.pair.m4 !== 't4', text: L(
      "Uchinchi yoki to'rtinchi qator noto'g'ri juftlashdi. Hisoblang: besh kvadrat yigirma besh, o'n ikki kvadrat bir yuz qirq to'rt, yig'indisi bir yuz oltmish to'qqiz, uning ildizi o'n uch. Sakkiz kvadrat oltmish to'rt, o'n besh kvadrat ikki yuz yigirma besh, yig'indisi ikki yuz sakson to'qqiz, uning ildizi o'n yetti.",
      'Третья или четвёртая строка сопоставлена неверно. Посчитай: пять в квадрате двадцать пять, двенадцать в квадрате сто сорок четыре, вместе сто шестьдесят девять, корень тринадцать. Восемь в квадрате шестьдесят четыре, пятнадцать в квадрате двести двадцать пять, вместе двести восемьдесят девять, корень семнадцать.',
      'The third or fourth row is matched wrongly. Compute: five squared is twenty-five, twelve squared is a hundred and forty-four, together a hundred and sixty-nine, whose root is thirteen. Eight squared is sixty-four, fifteen squared is two hundred and twenty-five, together two hundred and eighty-nine, whose root is seventeen.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Uchtadan ko'p qator o'z juftini topmadi. Modul koordinatalarning YIG'INDISI emas: uch qo'shuv to'rt yetti bo'lardi, modul esa besh. Kvadratlarni qo'shing, keyin ildiz oling.",
      'Больше трёх строк не нашли пару. Модуль это не СУММА координат: три плюс четыре было бы семь, а модуль пять. Складывай квадраты, потом бери корень.',
      'More than three rows failed to find their pair. The modulus is not the SUM of the coordinates: three plus four would be seven, while the modulus is five. Add the squares, then take the root.') },
    { when: () => true, text: L(
      "Bitta qator o'z juftini topmadi. Har vektor uchun: koordinatalarni kvadratga oshiring, qo'shing, ildiz oling.",
      'Одна строка не нашла свою пару. Для каждого вектора: возведи координаты в квадрат, сложи, возьми корень.',
      'One row failed to find its pair. For each vector: square the coordinates, add them, take the root.') },
  ],
  wrongText: L(
    "Modul koordinatalarning kvadratlari yig'indisining ildizi. Bu Pifagor teoremasi.",
    'Модуль это корень из суммы квадратов координат. Это теорема Пифагора.',
    'The modulus is the root of the sum of the squares of the coordinates. This is the Pythagorean theorem.'),
};

export default function D55_06(props) { return <MatchPairs data={DATA} {...props} />; }
