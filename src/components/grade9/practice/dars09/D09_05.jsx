// Dars09 · Amaliyot 05 — Ko'paytma · 🟡 · teg: kvadratni-tuldirish-esdan-chiqarish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA: (x + y)² = x² + 2xy + y². Berilgan: x + y = 6, x² + y² = 20.
// 36 = 20 + 2xy → 2xy = 16 → xy = 8.
// Asosiy tuzoq 16: ikkiga bo'lish qadami tushib qolgan.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'kvadratni-tuldirish-esdan-chiqarish', level: '🟡',
  eyebrow: L('Ko\'paytma', 'Произведение', 'Product'),
  setup: L(
    "Yig'indining kvadratini yozing: unda kvadratlar ham, ikki karra ko'paytma ham bor.",
    'Выпиши квадрат суммы: в нём есть и квадраты, и удвоенное произведение.',
    'Write out the square of the sum: it contains both squares and twice the product.'),
  ask: L('xy ko\'paytmani toping.', 'Найди произведение xy.', 'Find the product xy.'),
  hint: L('Javob bitta son.', 'Ответ — одно число.', 'The answer is a single number.'),
  placeholder: '0',
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['x + y = 6'], ['x² + y² = 20']],
  answer: [8],
  correctText: L(
    "To'g'ri, sakkiz. Yig'indining kvadrati o'ttiz oltiga teng, va u kvadratlar yig'indisi ustiga IKKI KARRA ko'paytmadan iborat. Yigirmani ayirsak, ikki karra ko'paytma o'n oltiga teng bo'ladi, demak ko'paytmaning o'zi sakkizga teng. Ikkiga bo'lish qadamini tashlab ketib bo'lmaydi.",
    'Верно, восемь. Квадрат суммы равен тридцати шести, и он складывается из суммы квадратов и УДВОЕННОГО произведения. Вычтя двадцать, получим удвоенное произведение шестнадцать, значит само произведение равно восьми. Шаг деления на два пропустить нельзя.',
    'Correct, eight. The square of the sum is thirty-six, and it consists of the sum of the squares plus TWICE the product. Subtracting twenty leaves twice the product as sixteen, so the product itself is eight. The halving step cannot be skipped.'),
  wrongs: [
    { when: (s) => s.has(16), text: L(
      "O'n olti — bu IKKI KARRA ko'paytma. Yig'indining kvadratida ko'paytma ikki marta uchraydi, shuning uchun yana ikkiga bo'lish kerak.",
      'Шестнадцать — это УДВОЕННОЕ произведение. В квадрате суммы произведение встречается дважды, поэтому нужно ещё разделить на два.',
      'Sixteen is TWICE the product. In the square of a sum the product appears twice, so one more division by two is needed.') },
    { when: (s) => s.has(56), text: L(
      "Ayirish o'rniga qo'shdingiz. Kvadratlar yig'indisi yig'indining kvadratidan AYIRILADI.",
      'Вместо вычитания ты сложил. Сумму квадратов ВЫЧИТАЮТ из квадрата суммы.',
      'You added instead of subtracting. The sum of the squares is SUBTRACTED from the square of the sum.') },
    { when: (s) => s.has(26), text: L(
      "Yig'indining o'zini emas, uning KVADRATINI oling: olti emas, o'ttiz olti.",
      'Возьми не саму сумму, а её КВАДРАТ: не шесть, а тридцать шесть.',
      'Take not the sum itself but its SQUARE: thirty-six, not six.') },
    { when: (s) => s.has(6) || s.has(20), text: L(
      "Bu berilgan sonlarning o'zi. Ular orasidagi bog'lanish yig'indining kvadrati formulasi orqali topiladi.",
      'Это сами данные числа. Связь между ними находят через формулу квадрата суммы.',
      'Those are the given numbers themselves. The link between them comes from the square-of-a-sum formula.') },
  ],
  wrongText: L(
    "Yig'indining kvadratini yozing va undagi uchta hadni sanang: iks kvadrat, ikki karra iks igrek, igrek kvadrat. Qaysi ikkitasi allaqachon ma'lum?",
    'Выпиши квадрат суммы и пересчитай его три слагаемых: икс в квадрате, удвоенное икс игрек, игрек в квадрате. Какие два уже известны?',
    'Write out the square of the sum and count its three terms: x squared, twice xy, y squared. Which two are already known?'),
};

export default function D09_05(props) { return <TypeSet data={DATA} {...props} />; }
