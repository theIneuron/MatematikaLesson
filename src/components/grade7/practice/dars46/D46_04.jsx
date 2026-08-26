// Dars46 · Amaliyot 04 — Uchburchak tengsizligi · 🟡 · build · tag: tri_ineq
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin `build`.
// 3, 4 va 8: 3 + 4 = 7 < 8 -> uchburchak mavjud emas.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_ineq',
  level: '🟡',
  eyebrow: L(
    'Uchburchak tengsizligi',
    'Неравенство треугольника',
    'Triangle inequality'),
  setup: L(
    "Uchburchak bo'lishi uchun ikki kichik tomonning yig'indisi eng katta tomondan katta bo'lishi kerak. Ikki javob kerak: xulosa va uning sababi.",
    'Чтобы треугольник существовал, сумма двух меньших сторон должна быть больше наибольшей. Нужны два ответа: вывод и его причина.',
    'A triangle needs the two shorter sides to exceed the longest. Two answers: the conclusion and the reason.'),
  given: [['3, 4, 8']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: L("uchburchak yo'q", 'треугольника нет', 'no triangle') },
    { id: 'b', label: '3 + 4 < 8' },
    { id: 'c', label: L('uchburchak bor', 'треугольник есть', 'the triangle exists') },
    { id: 'd', label: '3 + 4 + 8 = 15' },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 44,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 3 + 4 = 7, bu 8 dan kichik: ikki qisqa tomon uchinchisiga yetib bormaydi.",
    'Верно. 3 + 4 = 7, это меньше 8: две короткие стороны не дотягиваются до третьей.',
    'Correct. 3 + 4 = 7 is below 8: the two short sides cannot reach across.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "Tengsizlik bajarilmadi: 7 < 8. Bunday uchburchak yo'q.",
        'Неравенство не выполнено: 7 < 8. Такого треугольника нет.',
        'The inequality fails: 7 < 8. No such triangle exists.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '15 bu perimetr. Tengsizlikda ikki kichik tomon eng katta bilan solishtiriladi.',
        '15 это периметр. В неравенстве две меньшие сравниваются с наибольшей.',
        '15 is the perimeter. The inequality compares the two shorter sides with the longest.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    "Ikki kichik tomonni qo'shing va eng katta tomon bilan solishtiring.",
    'Сложи две меньшие стороны и сравни с наибольшей.',
    'Add the two shorter sides and compare with the longest.'),
};

export default function D46_04(props) { return <BuildLine data={DATA} {...props} />; }
