// Dars34 · Amaliyot 01 — Funksiyami · 🟢 · choice · tag: is_function
// Mexanika: kit.jsx -> Choice. Raskladka: 34-dars, 1-o'rin (isinish).
// Jadval: x = 1, 2, 3 -> y = 4, 4, 5. Bu FUNKSIYA: har x ga bitta y.
// y ning takrorlanishi hech narsani buzmaydi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'is_function', level: '🟢',
  eyebrow: L('Funksiyami', 'Функция ли это', 'Is it a function'),
  setup: L(
    "Funksiyada har bir x ga BITTA y mos keladi. y qiymatlari takrorlanishi mumkin -- bu qoidani buzmaydi.",
    'В функции каждому x соответствует ОДИН y. Значения y могут повторяться — это правило не нарушает.',
    'In a function each x has ONE y. Repeated y values are fine.'),
  given: [['x', ':', '1', '2', '3'], ['y', ':', '4', '4', '5']],
  givenLabel: L('Jadval:', 'Таблица:', 'The table:'),
  ask: L('Bu jadval funksiya beradimi?', 'Задаёт ли эта таблица функцию?', 'Does this table give a function?'),
  opts: [
    { label: L("Ha, har x ga bitta y", 'Да, каждому x один y', 'Yes, each x has one y') },
    { label: L("Yo'q, y takrorlanadi", 'Нет, y повторяется', 'No, y repeats') },
    { label: L("Yo'q, x lar har xil", 'Нет, x разные', 'No, the x differ') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Har x o'z y sini oldi: 1 ga 4, 2 ga 4, 3 ga 5. y takrorlanishi mumkin.",
    'Верно. Каждый x получил свой y: 1 → 4, 2 → 4, 3 → 5. Значения y могут повторяться.',
    'Correct. Each x got one y: 1 → 4, 2 → 4, 3 → 5. Repeating y is allowed.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "y ning takrorlanishi qoidani buzmaydi. Buziladigan holat -- bitta x ga IKKI xil y mos kelishi.",
      'Повтор y правило не нарушает. Нарушение это когда одному x соответствуют ДВА разных y.',
      'A repeated y breaks nothing. The rule breaks when one x has TWO different y.') },
    { when: (s) => s.picked === 2, text: L(
      "x lar har xil bo'lishi kerak: bu aynan funksiyaning sharti.",
      'x должны быть разными: это и есть условие функции.',
      'The x must differ: that is exactly what a function needs.') },
  ],
  wrongText: L(
    "Bitta x ga ikki xil y berilganmi? Shu savol hal qiladi.",
    'Есть ли x, которому даны два разных y? Этот вопрос всё решает.',
    'Is there an x with two different y? That settles it.'),
};

export default function D34_01(props) { return <Choice data={DATA} {...props} />; }
