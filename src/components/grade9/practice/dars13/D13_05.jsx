// Dars13 · Amaliyot 05 — Belgilash · 🟡 · teg: ozgaruvchi-notogri-tanlash
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// MATEMATIKA: x + y = 9, x − y = 3 -> x = 6, y = 3. Son 63.
// Tuzoq nuqtasi — (3; 6): u ham sistemani «tashqi ko'rinishda» eslatadi,
// lekin unda o'nlar bilan birlar raqami o'rin almashgan va son 36 bo'lib
// qoladi. Aynan shu narsa darsning birinchi tasdig'ini tekshiradi: har
// bir harf NIMANI anglatadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'ozgaruvchi-notogri-tanlash', level: '🟡',
  eyebrow: L('Belgilash', 'Отметка', 'Marking'),
  setup: L(
    "Ikki xonali sonning raqamlari yig'indisi to'qqiz, ayirmasi uch. Iks — o'nlar raqami, igrek — birlar raqami.",
    'Сумма цифр двузначного числа девять, разность — три. Икс — цифра десятков, игрек — цифра единиц.',
    'The digits of a two-digit number add to nine and differ by three. x is the tens digit, y the units digit.'),
  ask: L(
    "Raqamlar juftligini tekislikka qo'ying.",
    'Поставь пару цифр на плоскость.',
    'Place the pair of digits on the plane.'),
  expr: ['x + y = 9', ',', 'x − y = 3'],
  plane: { x0: -1, x1: 9, y0: -1, y1: 9 },
  answer: [[6, 3]],
  correctText: L(
    "To'g'ri. Qo'shsak, ikki iks o'n ikkiga teng, iks olti; keyin igrek to'qqiz minus olti, ya'ni uch. Juftlik olti va uch, son esa oltmish uch. Uch va olti juftligi yaramaydi: uch minus olti minus uchga teng, uchga emas. Ayirmaning ishorasi aynan shu narsani ushlaydi — iks o'nlar raqami, va u KATTASI bo'lishi kerak.",
    'Верно. При сложении два икса равны двенадцати, икс — шесть; затем игрек равен девять минус шесть, то есть три. Пара — шесть и три, число — шестьдесят три. Пара три и шесть не годится: три минус шесть равно минус трём, а не трём. Знак разности ловит именно это — икс это цифра десятков, и она должна быть БОЛЬШЕЙ.',
    'Correct. Adding gives two x equals twelve, so x is six; then y is nine minus six, that is three. The pair is six and three, and the number is sixty-three. The pair three and six will not do: three minus six is minus three, not three. The sign of the difference catches exactly this — x is the tens digit, and it must be the LARGER one.'),
  wrongs: [
    { when: (s) => s.has(3, 6), text: L(
      "Raqamlar o'rin almashdi. Ikkinchi tenglamada iks minus igrek uchga teng, ya'ni iks KATTA raqam. Uch va olti bilan ayirma minus uch chiqadi va son oltmish uch emas, o'ttiz olti bo'lib qoladi.",
      'Цифры поменялись местами. Во втором уравнении икс минус игрек равно трём, значит икс — БОЛЬШАЯ цифра. С тройкой и шестёркой разность выйдет минус три, а число станет тридцать шесть, а не шестьдесят три.',
      'The digits swapped places. In the second equation x minus y is three, so x is the LARGER digit. With three and six the difference comes out minus three, and the number becomes thirty-six instead of sixty-three.') },
    { when: (s) => s.has(9, 3) || s.has(6, 9), text: L(
      "Bu juftlikda yig'indi to'qqiz emas. Ikkala shartni ham bir vaqtda tekshiring: yig'indi to'qqiz VA ayirma uch.",
      'В этой паре сумма не равна девяти. Проверяй оба условия одновременно: сумма девять И разность три.',
      'In this pair the sum is not nine. Check both conditions at once: the sum is nine AND the difference is three.') },
    { when: (s) => s.has(5, 4) || s.has(4, 5), text: L(
      "Yig'indi to'qqiz, lekin ayirma bir — uch emas. Ikkinchi shart ham bajarilishi kerak.",
      'Сумма девять, но разность единица, а не три. Второе условие тоже должно выполняться.',
      'The sum is nine, but the difference is one, not three. The second condition must hold too.') },
    { when: (s) => s.has(9, 0) || s.has(0, 9), text: L(
      "Bu yerda yig'indi to'qqiz, lekin ayirma ham to'qqiz. Ayirmasi uchga teng juftlikni qidiring: iks igrekdan aynan uchga katta bo'lishi kerak.",
      'Здесь сумма девять, но и разность девять. Ищи пару с разностью, равной трём: икс больше игрека ровно на три.',
      'Here the sum is nine, but so is the difference. Look for a pair whose difference is three: x exceeds y by exactly three.') },
  ],
  wrongText: L(
    "Ikkala tenglamani qo'shing, iksni toping, keyin igrekni. Nuqtaning birinchi soni — o'nlar raqami, ikkinchisi — birlar raqami.",
    'Сложи оба уравнения, найди икс, потом игрек. Первое число точки — цифра десятков, второе — цифра единиц.',
    'Add both equations, find x, then y. The first number of the point is the tens digit, the second the units digit.'),
};

export default function D13_05(props) { return <PlacePoint data={DATA} {...props} />; }
