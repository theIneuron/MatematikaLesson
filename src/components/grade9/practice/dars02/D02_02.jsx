// Dars02 · Amaliyot 02 — Xulosa · 🟢 · teg: bitta-nuqtada-xulosa
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md §02
//
// Savol MANTIQIY (TIPLAR §2.1 p. 1): tayyor javob tanlanmaydi, berilgan
// ma'lumotdan nima CHIQISHI so'raladi. Darsning eng qimmat gapi shu yerda:
// juftlik va toqlik shartida «har qanday x uchun» degan so'z turibdi.
//
// QARSHI MISOL razborda: y = x³ − x + 3. Unda y(1) = 3 va y(−1) = 3 —
// topshiriqning berilganiga AYNAN tushadi — lekin y(2) = 9, y(−2) = −3.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'bitta-nuqtada-xulosa', level: '🟢',
  correct: 3, optCols: 1,
  eyebrow: L('Xulosa', 'Вывод', 'Conclusion'),
  setup: L(
    'Biror funksiya haqida ikkita qiymat ma\'lum.',
    'Про некоторую функцию известны два значения.',
    'Two values of some function are known.'),
  ask: L('Bundan qanday xulosa chiqadi?', 'Какой вывод из этого следует?', 'What follows from this?'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['y(1) = 3'], ['y(−1) = 3']],
  opts: [
    { label: L('Funksiya juft.', 'Функция чётная.', 'The function is even.') },
    { label: L('Funksiya toq.', 'Функция нечётная.', 'The function is odd.') },
    { label: L('Funksiya na juft, na toq.', 'Функция ни чётная, ни нечётная.', 'The function is neither even nor odd.') },
    { label: L('Bitta sonda tekshirish yetarli emas.', 'Проверки в одном числе недостаточно.', 'Checking at one number is not enough.') },
  ],
  correctText: L(
    "To'g'ri. Juftlik shartida «har qanday iks uchun» degan so'z turibdi. Masalan iks kub minus iks qo'shuv uch funksiyasida ham birda va minus birda qiymat uchga teng, lekin ikkida to'qqiz, minus ikkida esa minus uch chiqadi — demak u juft emas. Bitta juftlik hech qanday xulosaga yetmaydi.",
    'Верно. В условии чётности стоят слова «при любом икс». Например, у функции икс в кубе минус икс плюс три при единице и при минус единице значение равно трём, а при двух — девять, при минус двух — минус три, значит она не чётная. Одной пары не хватает ни для какого вывода.',
    'Correct. The condition for evenness says "for every x". For instance, x cubed minus x plus three gives three both at one and at minus one, but nine at two and minus three at minus two — so it is not even. One pair is not enough for any conclusion.'),
  wrongs: [
    { when: (s) => s.picked === 0, text: L(
      "Ikki qiymat mos tushdi, lekin shart bitta juftlik uchun emas, har qanday iks uchun qo'yiladi. Iks kub minus iks qo'shuv uch funksiyasini sinab ko'ring: birda ham, minus birda ham uch chiqadi, ikki va minus ikkida esa sonlar boshqa.",
      'Два значения совпали, но условие ставится не на одну пару, а на любой икс. Проверь функцию икс в кубе минус икс плюс три: и при единице, и при минус единице выходит три, а при двух и минус двух числа разные.',
      'Two values matched, but the condition is placed on every x, not on one pair. Try x cubed minus x plus three: it gives three at one and at minus one, but different numbers at two and minus two.') },
    { when: (s) => s.picked === 1, text: L(
      "Toqlik uchun qiymatlar teng emas, QARAMA-QARSHI bo'lishi kerak edi: minus uch va uch. Bu yerda ikkalasi ham uch.",
      'Для нечётности значения должны быть не равными, а ПРОТИВОПОЛОЖНЫМИ: минус три и три. Здесь оба равны трём.',
      'For oddness the values must be not equal but OPPOSITE: minus three and three. Here both are three.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu ham xulosa, va uni ham bitta juftlikdan chiqarib bo'lmaydi. Berilgan ma'lumot uchala xulosaning hech biriga yetmaydi.",
      'Это тоже вывод, и его тоже нельзя сделать по одной паре. Данных не хватает ни для одного из трёх выводов.',
      'That is a conclusion too, and it also cannot be drawn from one pair. The data is not enough for any of the three.') },
  ],
  wrongText: L(
    "Juftlik va toqlik shartida «har qanday iks uchun» degan so'z turibdi. Bitta juftlik nimani isbotlaydi?",
    'В условии чётности и нечётности стоят слова «при любом икс». Что доказывает одна пара?',
    'The conditions for even and odd both say "for every x". What does one pair prove?'),
};

export default function D02_02(props) { return <Choice data={DATA} {...props} />; }
