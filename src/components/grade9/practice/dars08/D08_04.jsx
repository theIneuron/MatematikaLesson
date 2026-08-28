// Dars08 · Amaliyot 04 — Nuqta · 🟡 · teg: butun-deb-kasr-oqish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// Grafik CHIZILMAYDI: giperbola maxraj nolga aylanadigan joyda uziladi,
// va uni to'g'ri chizish bu darsning mavzusi emas. Formula beriladi,
// o'quvchi qiymatni hisoblab, nuqtani qo'yadi.
//
// Tuzoqlar: (2; 6) — maxraj hisobga olinmagan; (2; 3) — maxrajda x+1
// o'rniga x olingan; (6; 2) — koordinatalar almashgan.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'butun-deb-kasr-oqish', level: '🟡',
  eyebrow: L('Nuqta', 'Точка', 'Point'),
  setup: L(
    "Funksiya kasr bilan berilgan. Qiymatni topish uchun avval maxraj hisoblanadi.",
    'Функция задана дробью. Чтобы найти значение, сначала считают знаменатель.',
    'The function is given by a fraction. To find the value, the denominator is computed first.'),
  ask: L(
    'x = 2 ga mos nuqtani tekislikka qo\'ying.',
    'Поставь на плоскости точку, отвечающую x = 2.',
    'Place the point that matches x = 2.'),
  expr: ['y =', { n: '6', d: 'x + 1' }],
  plane: { x0: -4, x1: 7, y0: -4, y1: 7 },
  answer: [[2, 2]],
  correctText: L(
    "To'g'ri. Ikkida maxraj uchga aylanadi, oltini uchga bo'lsak ikki chiqadi. Kasrda argument avval maxrajga tushadi, keyingina bo'lish bajariladi — shuning uchun qiymat argumentdan katta bo'lishi ham, kichik bo'lishi ham mumkin.",
    'Верно. При двух знаменатель равен трём, и шесть делить на три — два. В дроби аргумент сначала попадает в знаменатель и только потом выполняется деление, поэтому значение может быть и больше аргумента, и меньше.',
    'Correct. At two the denominator is three, and six divided by three is two. In a fraction the argument first goes into the denominator and only then the division happens, so the value can be either larger or smaller than the argument.'),
  wrongs: [
    { when: (s) => s.has(2, 6), text: L(
      "Maxraj hisobga olinmadi: olti shunchaki ko'chirildi. Ikkini maxrajga qo'ying — u nechchiga aylanadi?",
      'Знаменатель не учтён: шестёрка просто переписана. Подставь двойку в знаменатель — чему он станет равен?',
      'The denominator was ignored: the six was simply copied. Put two into the denominator — what does it become?') },
    { when: (s) => s.has(2, 3), text: L(
      "Maxrajda iks emas, iks qo'shuv bir turibdi. Bittani qo'shishni unutmang.",
      'В знаменателе стоит не икс, а икс плюс один. Не забудь прибавить единицу.',
      'The denominator is not x but x plus one. Do not forget to add the one.') },
    { when: (s) => s.has(6, 2) || s.has(3, 2), text: L(
      "Sonlar o'rin almashdi. Birinchi son — argument, u gorizontal o'qda; ikkinchisi — qiymat, u tik o'qda.",
      'Числа поменялись местами. Первое число — аргумент, по горизонтальной оси; второе — значение, по вертикальной.',
      'The numbers changed places. The first is the argument, on the horizontal axis; the second is the value, on the vertical one.') },
  ],
  wrongText: L(
    "Ikki qadam: ikkini maxrajga qo'ying va uni hisoblang, keyin oltini shu songa bo'ling.",
    'Два шага: подставь двойку в знаменатель и посчитай его, потом раздели шесть на это число.',
    'Two steps: put two into the denominator and compute it, then divide six by that number.'),
};

export default function D08_04(props) { return <PlacePoint data={DATA} {...props} />; }
