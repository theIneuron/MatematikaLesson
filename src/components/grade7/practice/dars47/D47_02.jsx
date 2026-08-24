// Dars47 · Amaliyot 02 — Yoy nimani beradi · 🟢 · choice · tag: comp_arc
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin `choice`.
// Bir nuqtadan chizilgan yoy -- undan bir xil uzoqlikdagi nuqtalar to'plami.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'comp_arc',
  level: '🟢',
  eyebrow: L(
    'Yoy',
    'Дуга',
    'The arc'),
  setup: L(
    'Sirkul bilan bir nuqtadan yoy chizildi. Bu yoyda yotgan nuqtalarning umumiy xossasi bor.',
    'Циркулем провели дугу из одной точки. У точек этой дуги есть общее свойство.',
    'An arc was drawn from one point. The points on it share one property.'),
  ask: L(
    'Yoydagi nuqtalar haqida nima aytish mumkin?',
    'Что можно сказать о точках дуги?',
    'What holds for the points of the arc?'),
  opts: [
    {
      label: L(
        'Markazdan bir xil uzoqlikda',
        'Одинаково удалены от центра',
        'Equally far from the centre'),
    },
    {
      label: L(
        "Bir to'g'ri chiziqda yotadi",
        'Лежат на одной прямой',
        'Lie on a straight line'),
    },
    {
      label: L(
        'Bir xil burchak beradi',
        'Дают одинаковый угол',
        'Give the same angle'),
    },
    {
      label: L(
        "Hech qanday umumiy xossa yo'q",
        'Общего свойства нет',
        'They share nothing'),
    },
  ],
  correct: 0,
  optCols: 1,
  correctText: L(
    "To'g'ri. Yoy -- markazdan bir xil uzoqlikdagi nuqtalar. Shuning uchun sirkul yasashlarda tenglikni beradi.",
    'Верно. Дуга это точки на одинаковом расстоянии от центра. Поэтому циркуль в построениях даёт равенство.',
    'Correct. An arc holds points at one distance from the centre, which is why the compass gives equality.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "To'g'ri chiziqni chizg'ich beradi, yoyni esa sirkul: yoy egilgan.",
        'Прямую даёт линейка, а дугу циркуль: дуга изогнута.',
        'A ruler gives a line; a compass gives an arc, and an arc is curved.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "Burchak bu yerda o'lchanmaydi: sirkul masofa bilan ishlaydi.",
        'Угол здесь не измеряется: циркуль работает с расстоянием.',
        'No angle is measured here: the compass works with distance.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        'Umumiy xossa bor va u eng muhimi: markazgacha masofa bir xil.',
        'Общее свойство есть, и оно главное: расстояние до центра одинаково.',
        'There is a shared property, the key one: the distance to the centre is equal.'),
    },
  ],
  wrongText: L(
    "Sirkulning ochilishi yoy chizilganda o'zgaradimi?",
    'Меняется ли раствор циркуля, пока чертится дуга?',
    'Does the compass opening change while the arc is drawn?'),
};

export default function D47_02(props) { return <Choice data={DATA} {...props} />; }
