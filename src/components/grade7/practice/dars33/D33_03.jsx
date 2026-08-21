// Dars33 · Amaliyot 03 — Qaysi nuqta o'qda emas · 🟢 · fix · tag: axis_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 3-o'rin.
// y o'qida yotishi uchun ABSSISSA nol bo'lishi kerak.
//   A(0; 5) -- yotadi;  B(5; 0) -- yotmaydi (u x o'qida);  C(0; 0) -- yotadi.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'axis_fix', level: '🟢',
  eyebrow: L('Xato yozuv', 'Неверная запись', 'The wrong record'),
  setup: L(
    "Uch nuqta y o'qida yotadi deb yozilgan. Bittasi yotmaydi: y o'qida yotish uchun abssissa nol bo'lishi kerak.",
    'Три точки записаны как лежащие на оси y. Одна не лежит: для этого нулём должна быть абсцисса.',
    'Three points are listed as lying on the y axis. One does not: the abscissa must be zero.'),
  ask: L("y o'qida YOTMAYDIGAN nuqtani belgilang.", 'Отметь точку, которая НЕ лежит на оси y.', 'Mark the point that does NOT lie on the y axis.'),
  note: L('Bitta nuqta.', 'Одна точка.', 'One point.'),
  parts: [
    { k: 'term', id: 't1', v: '(0; 5)' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '(5; 0)' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: '(0; 0)' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. (5; 0) da abssissa besh, ya'ni nuqta o'ngga siljigan: u x o'qida yotadi.",
    'Верно. У (5; 0) абсцисса пять, значит точка сдвинута вправо: она лежит на оси x.',
    'Correct. (5; 0) has abscissa five, so it shifts right: it lies on the x axis.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "(0; 5) da abssissa nol, ya'ni nuqta y o'qida yotadi.",
      'У (0; 5) абсцисса нуль, значит точка лежит на оси y.',
      '(0; 5) has abscissa zero, so it lies on the y axis.') },
    { when: (s) => s.extra.indexOf('t3') !== -1, text: L(
      "(0; 0) koordinatalar boshi: u ikki o'qda ham yotadi.",
      '(0; 0) это начало координат: оно лежит на обеих осях.',
      '(0; 0) is the origin: it lies on both axes.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Har nuqtaning BIRINCHI sonini tekshiring: u nolmi?",
      'Проверь ПЕРВОЕ число каждой точки: нуль ли оно?',
      'Check the FIRST number of each point: is it zero?') },
  ],
  wrongText: L(
    "y o'qida abssissa doim nol. Qaysi nuqtada birinchi son noldan farqli?",
    'На оси y абсцисса всегда нуль. У какой точки первое число не нуль?',
    'On the y axis the abscissa is always zero. Which point breaks that?'),
};

export default function D33_03(props) { return <TapTerms data={DATA} {...props} />; }
