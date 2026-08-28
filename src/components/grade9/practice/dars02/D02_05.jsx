// Dars02 · Amaliyot 05 — Nuqta · 🟡 · teg: oyna-vs-burilish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md §05
//
// Toq funksiyaning simmetriyasi — BURILISH, oyna emas: ikkala son ham
// ishorasini almashtiradi. Asosiy tuzoq (−2; 3) — bu juft funksiyaning
// simmetriyasi, ya'ni `oyna-vs-burilish` ning o'zi.
//
// Berilgan nuqta `marks` orqali OLDINDAN chiziladi. Usiz topshiriqni
// umuman qo'yib bo'lmaydi: o'quvchi nimaga nisbatan simmetrik qo'yishini
// bilmaydi. Jadval bu yerda yo'q.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'oyna-vs-burilish', level: '🟡',
  eyebrow: L('Nuqta', 'Точка', 'Point'),
  setup: L(
    "Funksiya toq. Uning grafigidagi bitta nuqta tekislikda belgilangan.",
    'Функция нечётная. Одна точка её графика отмечена на плоскости.',
    'The function is odd. One point of its graph is marked on the plane.'),
  ask: L(
    "Toqlik bo'yicha unga mos nuqtani qo'ying.",
    'Поставь точку, отвечающую ей по нечётности.',
    'Place the point that matches it by oddness.'),
  marks: [[2, 3]],
  plane: { x0: -4, x1: 4, y0: -4, y1: 4 },
  answer: [[-2, -3]],
  correctText: L(
    "To'g'ri. Toq funksiyada ikkala son ham ishorasini almashtiradi: argument minus ikki bo'ladi, qiymat esa minus uch. Bu koordinatalar boshiga nisbatan burilish — nuqtani nol atrofida yarim aylantirgandek.",
    'Верно. У нечётной функции знак меняют оба числа: аргумент становится минус два, а значение — минус три. Это симметрия относительно начала координат, как поворот точки на пол-оборота вокруг нуля.',
    'Correct. For an odd function both numbers change sign: the argument becomes minus two and the value minus three. This is symmetry about the origin, like turning the point half a turn around zero.'),
  wrongs: [
    { when: (s) => s.has(-2, 3), text: L(
      "Faqat birinchi son ishorasini almashtirdi. Bu oyna simmetriyasi, ya'ni JUFT funksiyaniki. Toq funksiyada qiymat ham ishorasini almashtiradi.",
      'Знак поменяло только первое число. Это зеркальная симметрия, то есть свойство ЧЁТНОЙ функции. У нечётной знак меняет и значение.',
      'Only the first number changed sign. That is mirror symmetry, the property of an EVEN function. For an odd one the value changes sign too.') },
    { when: (s) => s.has(2, -3), text: L(
      "Faqat qiymat ishorasini almashtirdi, argument joyida qoldi. Toqlik sharti minus iks dan boshlanadi.",
      'Знак поменяло только значение, а аргумент остался на месте. Условие нечётности начинается с минус икс.',
      'Only the value changed sign, the argument stayed put. The condition for oddness starts from minus x.') },
    { when: (s) => s.has(3, -2) || s.has(-3, 2), text: L(
      "Sonlar o'rin almashdi. Birinchi son gorizontal o'qda, ikkinchisi tik o'qda o'lchanadi.",
      'Числа поменялись местами. Первое откладывают по горизонтальной оси, второе — по вертикальной.',
      'The numbers changed places. The first goes along the horizontal axis, the second along the vertical one.') },
  ],
  wrongText: L(
    "Toqlik sharti: minus iks da qiymat ham qarama-qarshi bo'ladi. Demak nuqtaning ikkala soni ham ishorasini almashtiradi.",
    'Условие нечётности: при минус икс значение становится противоположным. Значит знак меняют оба числа точки.',
    'The condition for oddness: at minus x the value becomes the opposite. So both numbers of the point change sign.'),
};

export default function D02_05(props) { return <PlacePoint data={DATA} {...props} />; }
