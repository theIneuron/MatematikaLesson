// Dars42 · Amaliyot 01 — Ikki tomon yetarlimi · 🟢 · choice · tag: eq_enough
// Mexanika: kit.jsx -> Choice. Raskladka: 1-o'rin `choice`.
// Ikki tomon tengligi yetarli emas: ular ORASIDAGI burchak ham kerak.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_enough',
  level: '🟢',
  eyebrow: L(
    'Yetarlimi',
    'Достаточно ли',
    'Is it enough'),
  setup: L(
    "Uchburchaklar tengligi uchun UCHTA mos element kerak. Ikki tomon tengligi shaklni qulflab qo'ymaydi: ular orasidagi burchak har xil bo'lishi mumkin.",
    'Для равенства треугольников нужны ТРИ соответствующих элемента. Равенство двух сторон не закрепляет форму: угол между ними может быть разным.',
    'Equal triangles need THREE matching elements. Two equal sides do not lock the shape: the angle between them may differ.'),
  ask: L(
    "Ikki tomonga nima qo'shilishi kerak?",
    'Что надо добавить к двум сторонам?',
    'What must join the two sides?'),
  opts: [
    {
      label: L(
        'Orasidagi burchak',
        'Угол между ними',
        'The angle between them'),
    },
    {
      label: L(
        'Istalgan burchak',
        'Любой угол',
        'Any angle'),
    },
    {
      label: L(
        'Perimetr',
        'Периметр',
        'The perimeter'),
    },
    {
      label: L(
        'Hech narsa, yetarli',
        'Ничего, достаточно',
        'Nothing, it is enough'),
    },
  ],
  correct: 0,
  optCols: 2,
  correctText: L(
    "To'g'ri. Ikki tomon va ular ORASIDAGI burchak -- shu uchlik uchburchakni qulflaydi.",
    'Верно. Две стороны и угол МЕЖДУ ними — эта тройка закрепляет треугольник.',
    'Correct. Two sides and the angle BETWEEN them lock the triangle.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        'Istalgan burchak emas: aynan ikki tomon orasidagi burchak kerak.',
        'Не любой угол: нужен именно угол между этими двумя сторонами.',
        'Not any angle: it must be the one between those two sides.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "Perimetr uchinchi tomonni bermaydi: bir xil perimetrda shakl boshqacha bo'lishi mumkin.",
        'Периметр не даёт третью сторону: при одном периметре форма может отличаться.',
        'The perimeter does not fix the third side: the same perimeter allows different shapes.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        "Ikki tomon yetmaydi: ularni bir-biriga nisbatan burish mumkin, uchburchak o'zgaradi.",
        'Двух сторон мало: их можно повернуть друг относительно друга, и треугольник изменится.',
        'Two sides are not enough: rotating one against the other changes the triangle.'),
    },
  ],
  wrongText: L(
    "Ikki tayoqchani burchak bilan ushlab ko'ring: burchak o'zgarsa uchinchi tomon o'zgaradi.",
    'Представь две палочки под углом: меняется угол — меняется третья сторона.',
    'Picture two sticks at an angle: change the angle and the third side changes.'),
};

export default function D42_01(props) { return <Choice data={DATA} {...props} />; }
