// Dars09 · Amaliyot 06 — Juftlik · 🟡 · teg: juftlik-tartib-farqi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// MATEMATIKA: x + y = 6 va x − y = 2 → x = 4, y = 2.
// Asosiy tuzoq (2; 4): juftlikda tartib almashtirilgan. (3; 3) esa faqat
// birinchi tenglamani qanoatlantiradi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'juftlik-tartib-farqi', level: '🟡',
  eyebrow: L('Juftlik', 'Пара', 'Pair'),
  setup: L(
    "Sistemaning yechimi — juftlik. Birinchi son iks, ikkinchisi igrek.",
    'Решение системы — пара. Первое число — икс, второе — игрек.',
    'The solution of a system is a pair. The first number is x, the second is y.'),
  ask: L(
    "Sistemaning yechimini tekislikka qo'ying.",
    'Поставь решение системы на плоскости.',
    'Place the solution of the system on the plane.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x + y = 6'], ['x − y = 2']],
  plane: { x0: -2, x1: 7, y0: -3, y1: 6 },
  answer: [[4, 2]],
  correctText: L(
    "To'g'ri. Ikkala tenglamani qo'shsak, igrek yo'qoladi va ikki iks sakkizga teng bo'ladi, ya'ni iks to'rtga. Uni birinchi tenglamaga qo'ysak, igrek ikkiga teng. Nuqtaning birinchi soni har doim iks, ikkinchisi igrek — shu tartib yechimni belgilaydi.",
    'Верно. Сложив оба уравнения, игрек исчезает и два икс равно восьми, то есть икс равен четырём. Подставив его в первое уравнение, получим игрек равен двум. Первое число точки — всегда икс, второе — игрек, и именно этот порядок задаёт решение.',
    'Correct. Adding the two equations makes y vanish and gives two x equals eight, so x is four. Putting it into the first equation gives y equals two. The first number of a point is always x and the second is y — that order is what defines the solution.'),
  wrongs: [
    { when: (s) => s.has(2, 4), text: L(
      "Sonlar o'rin almashdi. Ikkinchi tenglamani tekshiring: ikki minus to'rt minus ikkiga teng, ikkiga emas. Juftlikda tartib ahamiyatli.",
      'Числа поменялись местами. Проверь второе уравнение: два минус четыре равно минус двум, а не двум. В паре важен порядок.',
      'The numbers changed places. Check the second equation: two minus four is minus two, not two. Order matters in a pair.') },
    { when: (s) => s.has(3, 3), text: L(
      "Bu juftlik faqat birinchi tenglamani qanoatlantiradi: uch qo'shuv uch olti. Ikkinchisini tekshiring: uch minus uch nolga teng, ikkiga emas.",
      'Эта пара удовлетворяет только первому уравнению: три плюс три — шесть. Проверь второе: три минус три равно нулю, а не двум.',
      'This pair satisfies only the first equation: three plus three is six. Check the second: three minus three is zero, not two.') },
    { when: (s) => s.has(4, -2) || s.has(-2, 4), text: L(
      "Igrekning ishorasi chalkashdi. Iksni birinchi tenglamaga qo'ying: to'rt qo'shuv igrek oltiga teng bo'lsa, igrek musbat.",
      'Перепутан знак игрека. Подставь икс в первое уравнение: если четыре плюс игрек равно шести, игрек положителен.',
      'The sign of y got mixed up. Put x into the first equation: if four plus y is six, then y is positive.') },
  ],
  wrongText: L(
    "Ikkala tenglamani qo'shing — igrek yo'qoladi va iks topiladi. Keyin iksni istalgan tenglamaga qo'yib igrekni toping, va nuqtani shu tartibda qo'ying.",
    'Сложи оба уравнения — игрек исчезнет и найдётся икс. Потом подставь икс в любое уравнение и найди игрек, и ставь точку в этом порядке.',
    'Add the two equations — y vanishes and x is found. Then put x into either equation to find y, and place the point in that order.'),
};

export default function D09_06(props) { return <PlacePoint data={DATA} {...props} />; }
