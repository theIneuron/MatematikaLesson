// Dars02 · Amaliyot 06 — O'q · 🟡 · teg: bitta-tarmoq
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// grafik esa FuncGraph (`Given` ning `fig` sloti orqali).
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md §06
//
// O'sish oralig'i BURILISH nuqtasidan boshlanadi va o'ngga ketadi.
// Burilish nuqtasining o'zi ham oraliqqa kiradi — nuqta bo'yalgan.
//
// GRAFIK: f(x) = (x − 1)² − 2 , [−3; 5] da. Burilish nuqtasi (1; −2).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis, FuncGraph } from '../asboblar9.jsx';

const F = (x) => (x - 1) * (x - 1) - 2;

const DATA = {
  tag: 'bitta-tarmoq', level: '🟡',
  eyebrow: L('O\'q', 'Ось', 'Axis'),
  setup: L(
    "O'qda uchta narsa ko'rsatiladi: chegara qayerda, u oraliqqa kiradimi va oraliq qaysi tomonga ketadi.",
    'На оси показывают три вещи: где граница, входит ли она в промежуток и в какую сторону промежуток идёт.',
    'The axis shows three things: where the boundary is, whether it belongs to the interval, and which way the interval runs.'),
  ask: L(
    "Funksiya o'suvchi bo'lgan oraliqni o'qda ko'rsating.",
    'Отметь на оси промежуток, на котором функция возрастает.',
    'Mark on the axis the interval where the function is increasing.'),
  fig: <FuncGraph f={F} domain={[-3, 5]} plane={{ x0: -4, x1: 6, y0: -3, y1: 4 }} step={13} />,
  axis: { from: -4, to: 6 },
  answer: { at: 1, closed: true, dir: 'right' },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Burilish nuqtasi birda, undan o'ngda grafik ko'tariladi. Burilish nuqtasining o'zi ham oraliqqa kiradi, shuning uchun nuqta bo'yalgan: undan boshlab funksiya o'sadi.",
    'Верно. Точка поворота — единица, правее её график поднимается. Сама точка поворота тоже входит в промежуток, поэтому точка закрашена: начиная с неё функция возрастает.',
    'Correct. The turning point is at one, and to the right of it the graph rises. The turning point itself belongs to the interval, so the point is filled: from it on the function increases.'),
  wrongs: [
    { when: (s) => s.atOk && s.closedOk && !s.dirOk, text: L(
      "Chapda grafik pastga ketyapti — bu kamayish oralig'i. Burilish nuqtasidan o'ngga qarab yuring va chiziqni kuzating.",
      'Слева график идёт вниз — это промежуток убывания. Иди от точки поворота вправо и следи за линией.',
      'To the left the graph goes down — that is the decreasing interval. Walk right from the turning point and watch the line.') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Chegara topildi. Burilish nuqtasining o'zi ham o'sish oralig'iga kiradi: undan boshlab qiymatlar ortadi.",
      'Граница найдена. Сама точка поворота тоже входит в промежуток возрастания: начиная с неё значения растут.',
      'The boundary is found. The turning point itself also belongs to the increasing interval: from it on the values grow.') },
    { when: (s) => !s.atOk, text: L(
      "Chegara grafikning BURILISH nuqtasi. Chiziq qaysi sonda pastga ketishdan to'xtab, ko'tarila boshlaydi?",
      'Граница — это точка ПОВОРОТА графика. При каком числе линия перестаёт опускаться и начинает подниматься?',
      'The boundary is the TURNING point of the graph. At which number does the line stop falling and start rising?') },
  ],
  wrongText: L(
    "Grafikni burilish nuqtasidan ikkiga bo'ling. Qaysi qismda chiziq ko'tariladi — o'sish oralig'i o'sha yerda.",
    'Раздели график точкой поворота. В какой части линия поднимается — там и промежуток возрастания.',
    'Split the graph at the turning point. Where the line rises is the increasing interval.'),
};

export default function D02_06(props) { return <DomainAxis data={DATA} {...props} />; }
