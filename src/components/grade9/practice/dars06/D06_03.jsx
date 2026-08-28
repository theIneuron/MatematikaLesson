// Dars06 · Amaliyot 03 — Javob shakli · 🟢 · teg: javob-doim-bitta-oraliq
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md §03
//
// Savol MANTIQIY: aniq sonlar berilmagan, faqat tuzilish — ikkita har xil
// nol va qat'iy katta. Javob hisobdan emas, parabolaning ishorasidan chiqadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'javob-doim-bitta-oraliq', level: '🟢',
  correct: 1, optCols: 1,
  eyebrow: L('Javob shakli', 'Вид ответа', 'Answer shape'),
  setup: L(
    "Ikkita ko'paytuvchi, ikkita har xil nol. Tengsizlikda qat'iy katta turibdi.",
    'Два множителя, два разных нуля. В неравенстве стоит строгое «больше».',
    'Two factors, two different zeros. The inequality is a strict "greater than".'),
  ask: L(
    'Bunday tengsizlikning javobi qanday ko\'rinishda bo\'ladi?',
    'Какой вид имеет ответ такого неравенства?',
    'What shape does the answer of such an inequality have?'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['(x − a)(x − b) > 0', ',', 'a < b']],
  opts: [
    { label: L('Bitta ichki oraliq.', 'Один внутренний промежуток.', 'One inner interval.') },
    { label: L('Ikkita nur.', 'Два луча.', 'Two rays.') },
    { label: L('Barcha sonlar.', 'Все числа.', 'All numbers.') },
    { label: L('Yechim yo\'q.', 'Решений нет.', 'No solution.') },
  ],
  correctText: L(
    "To'g'ri. Tarmoqlar yuqoriga qaragan parabola nollar orasida Ox dan pastda, ikki chetida esa yuqorida turadi. Qat'iy katta so'ralganda javob shu ikki chetdan iborat — bitta oraliq emas, ikkita nur.",
    'Верно. Парабола с ветвями вверх между нулями лежит ниже Ox, а по краям — выше. При строгом «больше» ответ и состоит из этих двух краёв — не один промежуток, а два луча.',
    'Correct. A parabola with branches up lies below Ox between the zeros and above it at the two ends. With a strict "greater than", the answer is exactly those two ends — not one interval but two rays.'),
  wrongs: [
    { when: (s) => s.picked === 0, text: L(
      "Ichki oraliq — bu ko'paytma MANFIY bo'lgan joy. Bu yerda esa musbat so'ralyapti.",
      'Внутренний промежуток — это место, где произведение ОТРИЦАТЕЛЬНО. А здесь спрашивают положительное.',
      'The inner interval is where the product is NEGATIVE. Here a positive one is asked for.') },
    { when: (s) => s.picked === 2, text: L(
      "Nollarning o'zida ko'paytma nolga teng, ular orasida esa manfiy. Demak barcha sonlar javob bo'lolmaydi.",
      'В самих нулях произведение равно нулю, а между ними отрицательно. Значит все числа ответом быть не могут.',
      'At the zeros themselves the product is zero, and between them it is negative. So all numbers cannot be the answer.') },
    { when: (s) => s.picked === 3, text: L(
      "Nollardan uzoqroq son oling, masalan juda katta: ikkala qavs ham musbat, ko'paytma ham musbat. Demak yechim bor.",
      'Возьми число подальше от нулей, например очень большое: обе скобки положительны, произведение тоже. Значит решения есть.',
      'Take a number far from the zeros, say a very large one: both brackets are positive, so is the product. So solutions do exist.') },
  ],
  wrongText: L(
    "Uchta joyni sinang: nollardan chapda, ular orasida va o'ngda. Har birida ko'paytmaning ishorasini yozing.",
    'Испытай три места: левее нулей, между ними и правее. Для каждого выпиши знак произведения.',
    'Test three places: left of the zeros, between them, and to the right. Write down the sign of the product for each.'),
};

export default function D06_03(props) { return <Choice data={DATA} {...props} />; }
