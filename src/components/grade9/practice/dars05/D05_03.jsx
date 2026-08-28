// Dars05 · Amaliyot 03 — O'zgarish · 🟢 · teg: gorizontal-vertikal-almashinish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md §03
//
// Savol MANTIQIY (TIPLAR §2.1 p. 1): yozuvning qaysi joyi qaysi
// o'zgarishga javobgar ekani so'raladi, hisob emas.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'gorizontal-vertikal-almashinish', level: '🟢',
  correct: 1, optCols: 1,
  eyebrow: L('O\'zgarish', 'Изменение', 'Change'),
  setup: L(
    "Parabolaning yozuvida to'rt joyni o'zgartirish mumkin.",
    'В записи параболы можно менять четыре места.',
    'Four places in the record of a parabola can be changed.'),
  ask: L(
    'Qaysi o\'zgarish parabolani FAQAT yuqoriga ko\'taradi?',
    'Какое изменение поднимает параболу ТОЛЬКО вверх?',
    'Which change lifts the parabola straight UP only?'),
  opts: [
    { label: L('Qavs ichidagi sonni o\'zgartirish.', 'Изменить число в скобке.', 'Change the number inside the bracket.') },
    { label: L('Qavsdan tashqaridagi songa qo\'shish.', 'Прибавить к числу за скобкой.', 'Add to the number outside the bracket.') },
    { label: L('a koeffitsientini kattalashtirish.', 'Увеличить коэффициент a.', 'Make the coefficient a bigger.') },
    { label: L('a ning ishorasini almashtirish.', 'Поменять знак a.', 'Flip the sign of a.') },
  ],
  correctText: L(
    "To'g'ri. Qavsdan tashqaridagi son butun grafikni tik yo'nalishda ko'chiradi: har bir qiymatga bir xil son qo'shiladi, shakl esa tegilmaydi. Qavs ichidagi son gorizontal ko'chiradi, a esa umuman ko'chirmaydi.",
    'Верно. Число за скобкой переносит весь график по вертикали: к каждому значению прибавляется одно и то же число, а форма не трогается. Число в скобке переносит по горизонтали, а a не переносит вовсе.',
    'Correct. The number outside the bracket moves the whole graph vertically: the same number is added to every value and the shape is untouched. The number inside the bracket moves it horizontally, and a does not move it at all.'),
  wrongs: [
    { when: (s) => s.picked === 0, text: L(
      "Qavs ichidagi son parabolani yon tomonga suradi, yuqoriga emas. Uni o'zgartirsangiz uchining balandligi o'sha-o'sha qoladi.",
      'Число в скобке двигает параболу вбок, а не вверх. Если его менять, высота вершины останется прежней.',
      'The number in the bracket moves the parabola sideways, not up. Change it and the height of the vertex stays the same.') },
    { when: (s) => s.picked === 2, text: L(
      "a ni kattalashtirsangiz parabola torayadi, lekin uchi joyidan qimirlamaydi. Bir nechta iks da qiymatni hisoblab solishtiring.",
      'Если увеличить a, парабола сузится, но вершина с места не сдвинется. Посчитай значения при нескольких икс и сравни.',
      'Making a bigger narrows the parabola, but the vertex does not move. Compute values at a few x and compare.') },
    { when: (s) => s.picked === 3, text: L(
      "a ning ishorasi tarmoqlarni pastga buradi, ya'ni shaklni ag'daradi. Bu ko'chirish emas.",
      'Знак a разворачивает ветви вниз, то есть переворачивает форму. Это не перенос.',
      'The sign of a turns the branches downward, that is, it flips the shape. That is not a shift.') },
  ],
  wrongText: L(
    "Ikkita savolni ajrating: parabola qayerda turadi va qanday ko'rinishda. Tik ko'chirish uchun qaysi son javobgar?",
    'Раздели два вопроса: где стоит парабола и как она выглядит. Какое число отвечает за перенос по вертикали?',
    'Separate two questions: where the parabola stands and how it looks. Which number is responsible for the vertical shift?'),
};

export default function D05_03(props) { return <Choice data={DATA} {...props} />; }
