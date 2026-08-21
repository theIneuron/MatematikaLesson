// Dars36 · Amaliyot 01 — Nechta nuqta kerak · 🟢 · choice · tag: how_many_points
// Mexanika: kit.jsx -> Choice. Raskladka: 36-dars, 1-o'rin (isinish).
// To'g'ri chiziq uchun IKKI nuqta kifoya. Uchinchisi tekshirish uchun olinadi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'how_many_points', level: '🟢',
  eyebrow: L('Grafikni qurish', 'Построение графика', 'Drawing the graph'),
  setup: L(
    "Chiziqli funksiyaning grafigi to'g'ri chiziq. Uni chizish uchun eng kam nechta nuqta kerakligini bilish muhim.",
    'График линейной функции это прямая. Важно знать, сколько точек нужно как минимум.',
    'The graph of a linear function is a straight line. It matters how few points are enough.'),
  ask: L("To'g'ri chiziq chizish uchun eng kam nechta nuqta kerak?", 'Сколько точек нужно минимум, чтобы построить прямую?', 'How few points are needed to draw a line?'),
  opts: [
    { label: L('Ikkita', 'Две', 'Two') },
    { label: L('Bitta', 'Одна', 'One') },
    { label: L('Uchta', 'Три', 'Three') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Ikki nuqta to'g'ri chiziqni yagona qilib belgilaydi. Uchinchisi faqat tekshirish uchun olinadi.",
    'Верно. Две точки задают прямую однозначно. Третью берут только для проверки.',
    'Correct. Two points fix the line uniquely. A third is only for checking.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bitta nuqtadan cheksiz ko'p to'g'ri chiziq o'tadi: yo'nalish aniqlanmaydi.",
      'Через одну точку проходит бесконечно много прямых: направление не определено.',
      'Infinitely many lines pass through one point: the direction is undecided.') },
    { when: (s) => s.picked === 2, text: L(
      "Uchta nuqta ortiqcha: ikkitasi yetadi. Uchinchisi xatoni topish uchun foydali, lekin shart emas.",
      'Три точки это больше, чем нужно: хватает двух. Третья полезна для проверки, но не обязательна.',
      'Three points are more than needed: two suffice. A third helps to check but is optional.') },
  ],
  wrongText: L(
    "Bitta nuqtadan nechta to'g'ri chiziq o'tishi mumkin?",
    'Сколько прямых может пройти через одну точку?',
    'How many lines can pass through a single point?'),
};

export default function D36_01(props) { return <Choice data={DATA} {...props} />; }
