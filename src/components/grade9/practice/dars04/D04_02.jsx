// Dars04 · Amaliyot 02 — Ha yoki yo'q · 🟢 · teg: simmetriya-oqi-vertikal
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md §02
//
// Simmetriya o'qi TIK chiziq. Ikkinchi hukm gorizontal chiziqni taklif
// qiladi — `simmetriya-oqi-vertikal` ning o'zi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'simmetriya-oqi-vertikal', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    'Parabola va uning uchi berilgan.',
    'Даны парабола и её вершина.',
    'A parabola and its vertex are given.'),
  ask: L(
    "Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['y = x² − 6x + 8'], ['uchi (3; −1)']],
  itemSize: 16,
  items: [
    { id: 's1', tokens: ['x = 3'], yes: true, claim: L(
      "tik chizig'i — simmetriya o'qi.",
      'эта вертикальная прямая — ось симметрии.',
      'this vertical line is the axis of symmetry.') },
    { id: 's2', tokens: ['y = −1'], yes: false, claim: L(
      "gorizontal chizig'i — simmetriya o'qi.",
      'эта горизонтальная прямая — ось симметрии.',
      'this horizontal line is the axis of symmetry.') },
    { id: 's3', tokens: ['(3; −1)'], yes: true, claim: L(
      "nuqtadan o'tuvchi o'qqa nisbatan ikki tarmoq simmetrik.",
      'относительно оси через эту точку две ветви симметричны.',
      'about the axis through this point the two branches are symmetric.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri, uchtasi ham. Simmetriya o'qi TIK chiziq: u uchidan o'tadi va parabolani ikki teng tarmoqqa bo'ladi. Gorizontal chiziq esa parabolani ikkiga bo'lmaydi — uning ikki tomonida tarmoqlar bir xil emas.",
    'Верно, все три. Ось симметрии — ВЕРТИКАЛЬНАЯ прямая: она проходит через вершину и делит параболу на две равные ветви. Горизонтальная прямая параболу пополам не делит — по её сторонам ветви разные.',
    'Correct, all three. The axis of symmetry is a VERTICAL line: it passes through the vertex and splits the parabola into two equal branches. A horizontal line does not halve the parabola — the branches on its two sides are different.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Gorizontal chiziqni tasavvur qiling va parabolani unga nisbatan aks ettiring: pastga qaragan parabola chiqadi, ya'ni boshqa shakl.",
      'Представь горизонтальную прямую и отрази параболу относительно неё: получится парабола, направленная вниз, то есть другая фигура.',
      'Picture the horizontal line and reflect the parabola in it: you get a downward parabola, a different figure.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Uchining abssissasi uch. Shu son orqali o'tuvchi tik chiziq parabolani ikki teng qismga bo'ladi.",
      'Абсцисса вершины — три. Вертикальная прямая через это число делит параболу на две равные части.',
      'The abscissa of the vertex is three. The vertical line through that number splits the parabola into two equal parts.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Uchidan tik chiziq o'tkazing va parabolani shu chiziq bo'ylab buking: chap tarmoq o'ng tarmoq ustiga tushadimi?",
      'Проведи через вершину вертикальную прямую и согни параболу по ней: ляжет ли левая ветвь на правую?',
      'Draw a vertical line through the vertex and fold the parabola along it: does the left branch land on the right one?') },
  ],
  wrongText: L(
    "Parabolani qaysi chiziq bo'ylab bukish mumkin, shunda ikki yarim ustma-ust tushadi? Shu chiziq — simmetriya o'qi.",
    'По какой прямой можно согнуть параболу, чтобы половины совпали? Эта прямая и есть ось симметрии.',
    'Along which line can the parabola be folded so the halves match? That line is the axis of symmetry.'),
};

export default function D04_02(props) { return <TrueFalse data={DATA} {...props} />; }
