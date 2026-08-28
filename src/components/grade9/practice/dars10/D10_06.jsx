// Dars10 · Amaliyot 06 — Sonlar o'qi · 🟡 · teg: nuqta-taxmin-emas-tekshiruv
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `point` rejimida.
//
// Chiziq y = x + 5 parabolani y = x² − 1 bilan tenglashtiriladi:
// x² − x − 6 = 0 → x = −2 va x = 3. KATTA abssissa uchga teng.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'nuqta-taxmin-emas-tekshiruv', level: '🟡',
  eyebrow: L('Sonlar o\'qi', 'Числовая ось', 'The number line'),
  setup: L(
    "Bu yerda parabola o'sha, chiziq esa boshqa. Kesishishlarni yana tenglashtirish beradi.",
    'Парабола здесь та же, а прямая другая. Пересечения снова даёт приравнивание.',
    'The parabola here is the same, the line is different. Equating again gives the crossings.'),
  ask: L(
    "Kesishish abssissalaridan KATTASINI o'qda belgilang.",
    'Отметь на оси БОЛЬШУЮ из абсцисс пересечения.',
    'Mark the LARGER of the crossing abscissas on the axis.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['y = x + 5'], ['y = x² − 1']],
  mode: 'point',
  axis: { from: -5, to: 6 },
  answer: { at: 3, closed: true },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Tenglashtirsak, iks qo'shuv besh iks kvadrat minus birga teng; hamma hadni o'ngga o'tkazsak iks kvadrat minus iks minus olti nolga teng bo'ladi. Ildizlari minus ikki va uch, kattasi esa uch. Nuqta bo'yalgan: bu abssissa haqiqiy kesishishga tegishli, chiqarilgan son emas.",
    'Верно. Приравняв, получим икс плюс пять равно икс в квадрате минус один; перенеся всё вправо, получим икс в квадрате минус икс минус шесть равно нулю. Корни — минус два и три, больший из них три. Точка закрашена: эта абсцисса принадлежит настоящему пересечению, а не исключена.',
    'Correct. Equating gives x plus five equals x squared minus one; moving everything right gives x squared minus x minus six equals zero. The roots are minus two and three, and the larger is three. The point is filled: this abscissa belongs to a real crossing, it is not excluded.'),
  wrongs: [
    { when: (s) => s.at === -2, text: L(
      "Ikkala ildiz ham to'g'ri, lekin savolda KATTASI so'ralgan. Minus ikki bilan uchni sonlar o'qida solishtiring.",
      'Оба корня верны, но в вопросе спрашивают БОЛЬШИЙ. Сравни минус два и три на числовой оси.',
      'Both roots are right, but the question asks for the LARGER one. Compare minus two and three on the number line.') },
    { when: (s) => s.at === 5, text: L(
      "Bu chiziqning ozod hadi, kesishishning abssissasi emas. Avval ikkala o'ng qismni tenglashtiring.",
      'Это свободный член прямой, а не абсцисса пересечения. Сначала приравняй обе правые части.',
      'That is the constant term of the line, not a crossing abscissa. Equate the two right-hand sides first.') },
    { when: (s) => s.at === 4, text: L(
      "Bu kesishishning ORDINATASI emas ham, abssissasi ham emas. Iks kvadrat minus iks minus olti nolga teng tenglamani yeching: ko'paytmasi minus olti, yig'indisi bir bo'lgan ikki sonni qidiring.",
      'Это не ордината пересечения и не его абсцисса. Реши уравнение икс в квадрате минус икс минус шесть равно нулю: ищи два числа с произведением минус шесть и суммой один.',
      'That is neither the ordinate of a crossing nor its abscissa. Solve x squared minus x minus six equals zero: look for two numbers with product minus six and sum one.') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Bu abssissa javobga kiradi: uning ustida haqiqiy kesishish turibdi. Bo'sh nuqta chiqarilgan sonni bildiradi.",
      'Эта абсцисса входит в ответ: над ней стоит настоящее пересечение. Пустая точка означает исключённое число.',
      'This abscissa belongs to the answer: a real crossing stands above it. A hollow point means an excluded number.') },
    { when: (s) => !s.atOk, text: L(
      "Ikkala o'ng qismni tenglashtiring va hosil bo'lgan kvadrat tenglamani yeching. Undan keyin ikki ildizdan kattasini tanlang.",
      'Приравняй обе правые части и реши полученное квадратное уравнение. Потом выбери больший из двух корней.',
      'Equate the two right-hand sides and solve the quadratic. Then choose the larger of the two roots.') },
  ],
  wrongText: L(
    "Iks qo'shuv besh iks kvadrat minus birga teng — bu tenglamani nolga keltiring, ildizlarini toping va kattasini belgilang.",
    'Икс плюс пять равно икс в квадрате минус один — приведи это уравнение к нулю, найди корни и отметь больший.',
    'x plus five equals x squared minus one — bring this to zero, find the roots and mark the larger one.'),
};

export default function D10_06(props) { return <DomainAxis data={DATA} {...props} />; }
