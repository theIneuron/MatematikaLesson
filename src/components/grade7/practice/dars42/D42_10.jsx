// Dars42 · Amaliyot 10 — Isbot qadamlari · 🔴 · order · tag: eq_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin `order`.
// Isbot tartibi: ikki tomon teng -> orasidagi burchak teng -> uchburchaklar teng. Tuzoq: perimetrdan boshlash.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_order',
  level: '🔴',
  eyebrow: L(
    'Isbot qadamlari',
    'Шаги доказательства',
    'Steps of a proof'),
  setup: L(
    "Isbot elementlardan boshlanadi va xulosa bilan tugaydi. Uch qadamni tartib bilan qo'ying.",
    'Доказательство начинается с элементов и кончается выводом. Поставь три шага по порядку.',
    'A proof starts from the elements and ends with the conclusion. Place the three steps in order.'),
  cards: [
    { id: 'a', label: L('AB = A₁B₁ va AC = A₁C₁', 'AB = A₁B₁ и AC = A₁C₁', 'AB = A₁B₁ and AC = A₁C₁') },
    { id: 'b', label: L('burchak A = burchak A₁', 'угол A = угол A₁', 'angle A = angle A₁') },
    { id: 'c', label: L('uchburchaklar teng', 'треугольники равны', 'the triangles are equal') },
    { id: 'd', label: L('perimetrlar teng', 'периметры равны', 'the perimeters are equal') },
    { id: 'e', label: 'BC = B₁C₁' },
  ],
  answerSeq: ['a', 'b', 'c'],
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
    "To'g'ri. Ikki tomon, keyin ular orasidagi burchak, keyin xulosa. Uchinchi tomon va perimetr esa xulosadan KEYIN chiqadi.",
    'Верно. Две стороны, потом угол между ними, потом вывод. Третья сторона и периметр следуют ПОСЛЕ вывода.',
    'Correct. Two sides, then the included angle, then the conclusion. The third side and the perimeter follow AFTER.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1,
      text: L(
        'Perimetr va uchinchi tomon -- bu tenglikning NATIJASI, dalil emas. Ular isbotdan keyin aytiladi.',
        'Периметр и третья сторона это СЛЕДСТВИЕ равенства, а не доказательство. Они идут после.',
        'The perimeter and the third side are CONSEQUENCES, not evidence. They come afterwards.'),
    },
    {
      when: (s) => s.seq.length === 3,
      text: L(
        "Qadamlar to'g'ri, tartibi boshqa: avval tomonlar, keyin burchak, oxirida xulosa.",
        'Шаги верные, но порядок другой: сначала стороны, потом угол, в конце вывод.',
        'The steps are right but the order is not: sides, then the angle, then the conclusion.'),
    },
    {
      when: (s) => s.seq.length < 3,
      text: L(
        'Uch karta kerak.',
        'Нужны три карточки.',
        'Three cards are needed.'),
    },
  ],
  wrongText: L(
    'Alomat uchta elementni talab qiladi. Xulosa esa oxirida turadi.',
    'Признак требует трёх элементов. А вывод стоит в конце.',
    'The criterion needs three elements. The conclusion comes last.'),
};

export default function D42_10(props) { return <BuildLine data={DATA} {...props} />; }
