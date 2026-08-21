// Dars33 · Amaliyot 04 — Simmetrik nuqta · 🟡 · chain · tag: point_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 4-o'rin.
// 1-qator: (3; −2) -- to'rtinchi chorak
// 2-qator: x o'qiga nisbatan simmetrigi (3; 2) -- birinchi chorak.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'point_chain', level: '🟡',
  eyebrow: L('Simmetrik nuqta', 'Симметричная точка', 'A symmetric point'),
  setup: L(
    "x o'qiga nisbatan simmetriya ordinataning ishorasini almashtiradi, abssissa esa o'zgarmaydi. Chorak ham shunga qarab o'zgaradi.",
    'Симметрия относительно оси x меняет знак ординаты, а абсцисса остаётся. Четверть меняется вместе с ней.',
    'Reflecting in the x axis flips the ordinate and keeps the abscissa. The quadrant changes with it.'),
  rows: [
    [{ t: ['(3;', '−2)', '→'] }, { slot: 0 }],
    [{ t: ['simmetrigi', '→'] }, { slot: 1 }, { slot: 2 }],
  ],
  cards: ['IV', '(3; 2)', 'I', 'II', '(−3; −2)', 'III'],
  answer: ['IV', '(3; 2)', 'I'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (3; −2) o'ngda va pastda -- to'rtinchi chorak. Ordinata ishorasi almashsa (3; 2) chiqadi -- birinchi chorak.",
    'Верно. (3; −2) справа и внизу — четвёртая четверть. При смене знака ординаты выходит (3; 2) — первая четверть.',
    'Correct. (3; −2) is right and below — quadrant IV. Flipping the ordinate gives (3; 2) — quadrant I.'),
  wrongs: [
    { when: (s) => s.slots[1] === '(−3; −2)', text: L(
      "Bu y o'qiga nisbatan simmetriya: u abssissani almashtiradi. Bizga x o'qi kerak, ya'ni ordinata almashadi.",
      'Это симметрия относительно оси y: она меняет абсциссу. А нам нужна ось x, значит меняется ордината.',
      'That is a reflection in the y axis, which flips the abscissa. We need the x axis, so the ordinate flips.') },
    { when: (s) => s.slots[0] === 'I' || s.slots[0] === 'II' || s.slots[0] === 'III', text: L(
      "(3; −2) da abssissa musbat, ordinata manfiy: bu to'rtinchi chorak.",
      'У (3; −2) абсцисса положительная, ордината отрицательная: это четвёртая четверть.',
      '(3; −2) has a positive abscissa and negative ordinate: quadrant IV.') },
    { when: (s) => s.slots[2] === 'IV' || s.slots[2] === 'III', text: L(
      "(3; 2) da ikki koordinata ham musbat: birinchi chorak.",
      'У (3; 2) обе координаты положительные: первая четверть.',
      '(3; 2) has both coordinates positive: quadrant I.') },
  ],
  wrongText: L(
    "x o'qiga nisbatan simmetriyada qaysi koordinata ishorasini almashtiradi?",
    'При симметрии относительно оси x какая координата меняет знак?',
    'Reflecting in the x axis: which coordinate flips?'),
};

export default function D33_04(props) { return <SlotsBank data={DATA} {...props} />; }
