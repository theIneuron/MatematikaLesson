// Dars40 · Amaliyot 01 — Qo'shni burchak · 🟢 · choice · tag: ang_adjacent
// Mexanika: kit.jsx -> Choice. Raskladka: 1-o'rin `choice`.
// 47° ning qo'shnisi 180 − 47 = 133°. Tuzoq: 90 − 47 = 43 (to'ldiruvchi burchak).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_adjacent',
  level: '🟢',
  eyebrow: L(
    "Qo'shni burchak",
    'Смежный угол',
    'Adjacent angle'),
  setup: L(
    "Qo'shni burchaklar bir tomonni birga ishlatadi, qolgan ikki tomoni esa bir to'g'ri chiziqni to'ldiradi. Shuning uchun ularning yig'indisi 180 gradus.",
    'Смежные углы имеют общую сторону, а две другие дополняют друг друга до прямой. Поэтому их сумма 180 градусов.',
    'Adjacent angles share one side while the other two make up a straight line, so they add to 180 degrees.'),
  given: [['47°']],
  givenLabel: L(
    'Berilgan burchak:',
    'Данный угол:',
    'Given angle:'),
  ask: L(
    "Uning qo'shni burchagi nechchi gradus?",
    'Сколько градусов его смежный угол?',
    'How many degrees is its adjacent angle?'),
  opts: [{ label: '133°' }, { label: '43°' }, { label: '313°' }, { label: '153°' }],
  correct: 0,
  optCols: 2,
  correctText: L(
    "To'g'ri. 180 − 47 = 133. Ikki burchak birga to'g'ri chiziqni beradi.",
    'Верно. 180 − 47 = 133. Два угла вместе дают прямую.',
    'Correct. 180 − 47 = 133. The two angles together make a straight line.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "43° bu 90 − 47, ya'ni to'ldiruvchi burchak. Qo'shni burchak esa 180 dan hisoblanadi.",
        '43° это 90 − 47, дополнительный угол. Смежный считается от 180.',
        '43° is 90 − 47, the complementary angle. The adjacent one comes from 180.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "313° bu 360 − 47. To'g'ri chiziq 180 gradus, aylana emas.",
        '313° это 360 − 47. Прямая это 180 градусов, а не полный круг.',
        '313° is 360 − 47. A straight line is 180 degrees, not a full circle.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        "153° chiqishi uchun 200 dan ayirilgan. To'g'ri chiziq 180 gradus.",
        'Чтобы вышло 153, вычли из 200. Прямая это 180 градусов.',
        'To get 153 the subtraction started from 200. A straight line is 180.'),
    },
  ],
  wrongText: L(
    "Qo'shni burchaklar yig'indisi 180 gradus. 180 dan berilgan burchakni ayiring.",
    'Сумма смежных углов 180 градусов. Вычти из 180 данный угол.',
    'Adjacent angles add to 180 degrees. Subtract the given angle from 180.'),
};

export default function D40_01(props) { return <Choice data={DATA} {...props} />; }
