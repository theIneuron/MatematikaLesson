// Dars41 · Amaliyot 08 — Biri ikki barobar · 🔴 · build · tag: ang_double
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
// Qo'shni burchaklardan biri ikkinchisidan ikki barobar katta:
// x + 2x = 180 -> x = 60, burchaklar 60° va 120°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_double', level: '🔴',
  eyebrow: L('Ikki barobar', 'Вдвое больше', 'Twice as big'),
  setup: L(
    "Bir burchak x, ikkinchisi 2x. Qo'shni bo'lgani uchun yig'indisi 180 gradus -- tenglama shundan chiqadi.",
    'Один угол x, второй 2x. Они смежные, значит сумма 180 градусов — отсюда уравнение.',
    'One angle is x, the other 2x. Being adjacent they add to 180, giving the equation.'),
  cards: [
    { id: 'a', label: '3x = 180°' },
    { id: 'b', label: 'x = 60°' },
    { id: 'c', label: '60° va 120°' },
    { id: 'd', label: '2x = 180°' },
    { id: 'e', label: 'x = 90°' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x + 2x = 3x = 180 -> x = 60. Burchaklar 60° va 120°: yig'indisi 180.",
    'Верно. x + 2x = 3x = 180 → x = 60. Углы 60° и 120°: сумма 180.',
    'Correct. x + 2x = 3x = 180 → x = 60. The angles are 60° and 120°, summing to 180.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "2x emas, 3x: x va 2x birga uch x beradi.",
      'Не 2x, а 3x: x и 2x вместе дают три x.',
      'Not 2x but 3x: x and 2x together make three x.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: tenglama, ildiz, ikki burchak.",
      'Шаги верные, но порядок другой: уравнение, корень, два угла.',
      'The steps are right but the order is not: equation, root, the two angles.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "x va 2x ni qo'shsangiz nechta x chiqadi? Yig'indi nechchiga teng?",
    'Сколько x выйдет из x и 2x? Чему равна сумма?',
    'How many x come from x and 2x? What is the sum?'),
};

export default function D41_08(props) { return <BuildLine data={DATA} {...props} />; }
