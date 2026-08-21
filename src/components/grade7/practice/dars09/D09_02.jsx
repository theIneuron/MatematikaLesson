// Dars09 · Amaliyot 02 — Qavsli oddiy tenglama · 🟢 · tag: bracket_simple
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 4(x + 2) = 20. Ikki yo'l ham to'g'ri:
//   qavsni ochish:  4x + 8 = 20 -> 4x = 12 -> x = 3
//   bo'lish:        x + 2 = 5   -> x = 3
// Tekshirish: 4 · (3 + 2) = 20.
// Xato javoblar: 18 (20 dan 2 ayirgan, 4 ni hisobga olmagan), 5 (qavs
// ichidagi yig'indini javob deb olgan), 7 (20 : 4 = 5 dan keyin 2 qo'shgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'bracket_simple', level: '🟢', allowNeg: true, target: 3,
  eyebrow: L('Qavsli tenglama', 'Уравнение со скобкой', 'An equation with a bracket'),
  setup: L(
    "Qavsni ochish ham, ikki tomonni 4 ga bo'lish ham mumkin. Ikki yo'l bir xil ildizga olib keladi.",
    'Можно раскрыть скобку, а можно разделить обе части на 4. Оба пути ведут к одному корню.',
    'You may open the bracket or divide both sides by 4. Both ways lead to the same root.'),
  expr: ['4', '·', '(', 'x', '+', '2', ')', '=', '20'], exprSize: 30,
  label: L('Ildizni yozing:', 'Запиши корень:', 'Write the root:'),
  correctText: L(
    "To'g'ri. Ikki tomonni 4 ga bo'lsak x + 2 = 5, ya'ni x = 3. Qavsni ochib ham o'sha: 4x + 8 = 20, 4x = 12, x = 3.",
    'Верно. Разделив обе части на 4, получаем x + 2 = 5, то есть x = 3. Через раскрытие то же: 4x + 8 = 20, 4x = 12, x = 3.',
    'Correct. Dividing both sides by 4 gives x + 2 = 5, so x = 3. Opening the bracket gives the same: 4x + 8 = 20, 4x = 12, x = 3.'),
  wrongs: [
    { when: (s) => s.value === 5, text: L(
      "5 bu qavs ichidagi yig'indi: x + 2 = 5. Ildizni topish uchun undan yana 2 ayirish kerak.",
      '5 это сумма в скобке: x + 2 = 5. Чтобы найти корень, из неё надо ещё вычесть 2.',
      '5 is the sum inside the bracket: x + 2 = 5. To get the root you still take 2 away.') },
    { when: (s) => s.value === 18, text: L(
      "20 dan 2 ni ayirish yetmaydi: qavs 4 ga ko'paytirilgan, ya'ni avval bo'lish yoki qavsni ochish kerak.",
      'Вычесть 2 из 20 недостаточно: скобка умножена на 4, значит сначала надо разделить или раскрыть скобку.',
      'Taking 2 from 20 is not enough: the bracket is multiplied by 4, so divide first or open the bracket.') },
    { when: (s) => s.value === 7, text: L(
      "20 : 4 = 5 to'g'ri, lekin keyin 2 QO'SHILMAYDI, ayiriladi: x = 5 − 2 = 3.",
      '20 : 4 = 5 верно, но потом 2 не ПРИБАВЛЯЕТСЯ, а вычитается: x = 5 − 2 = 3.',
      '20 : 4 = 5 is right, but then the 2 is not ADDED, it is taken away: x = 5 − 2 = 3.') },
  ],
  wrongText: L(
    "Topilgan sonni tenglamaga qo'yib tekshiring: qavs ichida 5 chiqib, 4 ga ko'paytirilganda 20 bo'lishi kerak.",
    'Подставь найденное число в уравнение: в скобке должно выйти 5, а после умножения на 4 — двадцать.',
    'Put your number back: the bracket must give 5 and, multiplied by 4, make twenty.'),
};

export default function D09_02(props) { return <TypeValue data={DATA} {...props} />; }
