// Dars03 · Amaliyot 02 — Yozuv · 🟢 · teg: nol-koeff-a
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md §02
//
// Savol tasniflash: to'rtta yozuvdan qaysi biri ta'rifga TUSHMAYDI.
// Uchta noto'g'ri variant uchta adashishga tegadi: yozilmagan bir,
// c ning yo'qligi, manfiy a.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'nol-koeff-a', level: '🟢',
  correct: 2, optCols: 1, optSize: 18,
  eyebrow: L('Yozuv', 'Запись', 'Record'),
  setup: L(
    "To'rtta yozuv. Uchtasi kvadrat funksiya, bittasi esa yo'q.",
    'Четыре записи. Три из них — квадратичные функции, а одна нет.',
    'Four records. Three of them are quadratic functions, one is not.'),
  ask: L(
    'Qaysi yozuv kvadrat funksiya emas?',
    'Какая запись не является квадратичной функцией?',
    'Which record is not a quadratic function?'),
  opts: [
    { label: ['y = x² − 7'] },
    { label: ['y = 5x² + x'] },
    { label: ['y = 0·x² + 4x − 1'] },
    { label: ['y = −x² + 2x + 9'] },
  ],
  correctText: L(
    "To'g'ri. Iks kvadrat oldidagi son nolga teng, demak butun had yo'qoladi va to'rt iks minus bir qoladi — bu chiziqli funksiya. Ta'rifdagi a nolga teng emas degan shart aynan shuning uchun turibdi.",
    'Верно. Число перед икс в квадрате равно нулю, значит всё слагаемое исчезает и остаётся четыре икс минус один — это линейная функция. Условие «a не равно нулю» в определении стоит именно поэтому.',
    'Correct. The number in front of x squared is zero, so the whole term disappears and four x minus one is left — a linear function. That is exactly why the definition says a is not zero.'),
  wrongs: [
    { when: (s) => s.picked === 0, text: L(
      'Bu yerda iks kvadrat oldida bir turibdi, u yozilmagan xolos. Bir esa nolga teng emas.',
      'Здесь перед икс в квадрате стоит единица, просто она не написана. А единица нулю не равна.',
      'Here the number in front of x squared is one, it is simply not written. And one is not zero.') },
    { when: (s) => s.picked === 1, text: L(
      "Iks kvadrat oldida besh turibdi. b va c ning qanday bo'lishi ta'rifda cheklanmagan: c umuman bo'lmasligi ham mumkin.",
      'Перед икс в квадрате стоит пятёрка. На b и c определение ограничений не ставит: c может и вовсе отсутствовать.',
      'In front of x squared there is a five. The definition puts no limits on b and c: c may be missing altogether.') },
    { when: (s) => s.picked === 3, text: L(
      "Iks kvadrat oldida minus bir turibdi. Manfiy son ham nolga teng emas — u faqat parabolani pastga buradi.",
      'Перед икс в квадрате стоит минус единица. Отрицательное число тоже не равно нулю — оно лишь разворачивает параболу вниз.',
      'In front of x squared there is minus one. A negative number is not zero either — it only turns the parabola downward.') },
  ],
  wrongText: L(
    'Har yozuvda iks kvadrat oldidagi songa qarang. Ulardan qaysi biri nolga teng?',
    'Посмотри в каждой записи на число перед икс в квадрате. Какое из них равно нулю?',
    'Look at the number in front of x squared in each record. Which of them is zero?'),
};

export default function D03_02(props) { return <Choice data={DATA} {...props} />; }
