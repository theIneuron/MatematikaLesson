// Dars09 · Amaliyot 02 — Qavsli oddiy tenglama · 🟢 · tag: bracket_simple
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): sonlar uch va to'rt xonali,
// bo'lish esa og'zaki: 2000 : 4 = 500.
//
// 4(x + 250) = 2000. Ikki yo'l ham to'g'ri:
//   qavsni ochish:  4x + 1000 = 2000 -> 4x = 1000 -> x = 250
//   bo'lish:        x + 250 = 500    -> x = 250
// Tekshirish: 4 · (250 + 250) = 2000.
// Xato javoblar: 1750 (2000 dan 250 ayirgan, 4 ni hisobga olmagan),
// 500 (qavs ichidagi yig'indini javob deb olgan), 750 (2000 : 4 = 500 dan
// keyin 250 qo'shgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'bracket_simple', level: '🟢', allowNeg: true, target: 250,
  eyebrow: L('Qavsli tenglama', 'Уравнение со скобкой', 'An equation with a bracket'),
  setup: L(
    "Qavsni ochish ham, ikki tomonni 4 ga bo'lish ham mumkin. Ikki yo'l bir xil ildizga olib keladi.",
    'Можно раскрыть скобку, а можно разделить обе части на 4. Оба пути ведут к одному корню.',
    'You may open the bracket or divide both sides by 4. Both ways lead to the same root.'),
  expr: ['4', '·', '(', 'x', '+', '250', ')', '=', '2000'], exprSize: 28,
  label: L('Ildizni yozing:', 'Запиши корень:', 'Write the root:'),
  correctText: L(
    "To'g'ri. Ikki tomonni 4 ga bo'lsak x + 250 = 500, ya'ni x = 250. Qavsni ochib ham o'sha: 4x + 1000 = 2000, 4x = 1000, x = 250.",
    'Верно. Разделив обе части на 4, получаем x + 250 = 500, то есть x = 250. Через раскрытие то же: 4x + 1000 = 2000, 4x = 1000, x = 250.',
    'Correct. Dividing both sides by 4 gives x + 250 = 500, so x = 250. Opening the bracket gives the same: 4x + 1000 = 2000, 4x = 1000, x = 250.'),
  wrongs: [
    { when: (s) => s.value === 500, text: L(
      "500 bu qavs ichidagi yig'indi: x + 250 = 500. Ildizni topish uchun undan yana 250 ayirish kerak.",
      '500 это сумма в скобке: x + 250 = 500. Чтобы найти корень, из неё надо ещё вычесть 250.',
      '500 is the sum inside the bracket: x + 250 = 500. To get the root you still take 250 away.') },
    { when: (s) => s.value === 1750, text: L(
      "2000 dan 250 ni ayirish yetmaydi: qavs 4 ga ko'paytirilgan, ya'ni avval bo'lish yoki qavsni ochish kerak.",
      'Вычесть 250 из 2000 недостаточно: скобка умножена на 4, значит сначала надо разделить или раскрыть скобку.',
      'Taking 250 from 2000 is not enough: the bracket is multiplied by 4, so divide first or open the bracket.') },
    { when: (s) => s.value === 750, text: L(
      "2000 : 4 = 500 to'g'ri, lekin keyin 250 QO'SHILMAYDI, ayiriladi: x = 500 − 250 = 250.",
      '2000 : 4 = 500 верно, но потом 250 не ПРИБАВЛЯЕТСЯ, а вычитается: x = 500 − 250 = 250.',
      '2000 : 4 = 500 is right, but then the 250 is not ADDED, it is taken away: x = 500 − 250 = 250.') },
  ],
  wrongText: L(
    "Topilgan sonni tenglamaga qo'yib tekshiring: qavs ichida 500 chiqib, 4 ga ko'paytirilganda 2000 bo'lishi kerak.",
    'Подставь найденное число в уравнение: в скобке должно выйти 500, а после умножения на 4 — две тысячи.',
    'Put your number back: the bracket must give 500 and, multiplied by 4, make two thousand.'),
};

export default function D09_02(props) { return <TypeValue data={DATA} {...props} />; }
