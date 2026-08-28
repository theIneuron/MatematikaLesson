// Dars12 · Amaliyot 04 — Belgilash · 🟡 · teg: orniga-qoyishni-unutish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// MATEMATIKA: x + y = 1 va x − y = 5 qo'shilsa, 2x = 6, ya'ni x = 3;
// igrek birinchi tenglamadan: y = 1 − 3 = −2. Yechim (3; −2).
// Bitta nuqta so'raladi, lekin uni topish uchun IKKI qadam kerak:
// qo'shish iksni beradi, o'rniga qo'yish igrekni.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'orniga-qoyishni-unutish', level: '🟡',
  eyebrow: L('Belgilash', 'Отметка', 'Marking'),
  setup: L(
    "Qo'shsangiz igrek yo'qoladi va iks topiladi. Lekin yechim — juftlik, demak igrek ham kerak.",
    'При сложении игрек исчезнет и найдётся икс. Но решение — пара, значит нужен и игрек.',
    'Adding makes y vanish and gives x. But a solution is a pair, so y is needed too.'),
  ask: L(
    "Sistemaning yechimini tekislikka qo'ying.",
    'Поставь решение системы на плоскость.',
    'Place the solution of the system on the plane.'),
  expr: ['x + y = 1', ',', 'x − y = 5'],
  // TEKISLIK O'NGGA UZAYTIRILDI (tekshiruv 2026-08-28): «ikkiga bo'lish
  // qadami tashlab ketildi» tuzog'i (6; −2) ilgari tekislikdan tashqarida
  // qolardi, ya'ni o'sha razbor hech qachon chiqmasdi.
  plane: { x0: -4, x1: 6, y0: -5, y1: 4 },
  answer: [[3, -2]],
  correctText: L(
    "To'g'ri. Qo'shsak, igrek bilan minus igrek nol beradi: ikki iks oltiga teng, iks uch. Endi iksni birinchi tenglamaga qo'yamiz: uch qo'shuv igrek birga teng, ya'ni igrek minus ikki. Nuqta uch va minus ikki. Tekshirish ikkinchi tenglamada: uch minus minus ikki, ya'ni besh — to'g'ri.",
    'Верно. При сложении игрек и минус игрек дают нуль: два икса равны шести, икс равен трём. Теперь подставляем икс в первое уравнение: три плюс игрек равно одному, значит игрек минус два. Точка — три и минус два. Проверка во втором уравнении: три минус минус два, то есть пять — верно.',
    'Correct. Adding makes y and minus y give zero: two x equals six, so x is three. Now substitute x into the first equation: three plus y equals one, so y is minus two. The point is three and minus two. Check in the second equation: three minus minus two, that is five — right.'),
  wrongs: [
    { when: (s) => s.has(-2, 3), text: L(
      "Koordinatalar o'rin almashdi. Birinchi son har doim iks: uni qo'shish berdi, igrek esa keyin o'rniga qo'yishdan chiqdi.",
      'Координаты поменялись местами. Первое число — всегда икс: его дало сложение, а игрек вышел потом из подстановки.',
      'The coordinates swapped places. The first number is always x: adding gave it, while y came later from the substitution.') },
    { when: (s) => s.has(3, 0) || s.has(3, 4), text: L(
      "Iks to'g'ri topilgan, igrek esa emas. Uchni birinchi tenglamaga qo'ying: uch qo'shuv igrek birga teng bo'lsa, igrek nechchi?",
      'Икс найден верно, а игрек нет. Подставь три в первое уравнение: если три плюс игрек равно одному, чему равен игрек?',
      'x was found correctly but y was not. Put three into the first equation: if three plus y equals one, what is y?') },
    { when: (s) => s.has(3, 2), text: L(
      "Igrekda ishora tushib qoldi. Uch qo'shuv igrek birga teng: yig'indi uchdan KICHIK, demak igrek manfiy.",
      'В игреке потерялся знак. Три плюс игрек равно одному: сумма МЕНЬШЕ трёх, значит игрек отрицателен.',
      'A sign was lost in y. Three plus y equals one: the sum is LESS than three, so y is negative.') },
    { when: (s) => s.has(6, -2) || s.has(-3, -2), text: L(
      "Iks noto'g'ri. Qo'shgandan keyin ikki iks olti bo'ldi, demak iks uchga teng — ikkiga bo'lish qadami tushib qolgan.",
      'Икс неверен. После сложения два икса стали шестью, значит икс равен трём — пропущен шаг деления на два.',
      'x is wrong. After adding, two x became six, so x is three — the step of dividing by two was skipped.') },
  ],
  wrongText: L(
    "Avval qo'shing va iksni toping, keyin iksni ixtiyoriy tenglamaga qo'yib igrekni toping. Nuqtaning birinchi soni iks.",
    'Сначала сложи и найди икс, потом подставь икс в любое уравнение и найди игрек. Первое число точки — икс.',
    'First add and find x, then substitute x into either equation and find y. The first number of the point is x.'),
};

export default function D12_04(props) { return <PlacePoint data={DATA} {...props} />; }
