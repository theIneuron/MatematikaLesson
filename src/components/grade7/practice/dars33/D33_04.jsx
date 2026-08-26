// Dars33 · Amaliyot 04 — Ikki marta simmetriya · 🟡 · chain · tag: point_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 4-o'rin `chain`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// (−4; 9) -> x o'qiga nisbatan (−4; −9) -> keyin y o'qiga nisbatan (4; −9).
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'point_chain',
  level: '🟡',
  eyebrow: L(
    'Ikki qadam',
    'Два шага',
    'Two steps'),
  setup: L(
    "x o'qiga nisbatan simmetriyada ordinata ishorasi almashadi, y o'qiga nisbatan esa abssissa. Ikki qadam ketma-ket bajariladi.",
    'При симметрии относительно оси x меняет знак ордината, относительно оси y — абсцисса. Два шага идут друг за другом.',
    'Reflecting in the x axis flips the ordinate; in the y axis, the abscissa. The two steps follow each other.'),
  given: [['(−4; 9)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [{ t: ['x', L("o'qiga", 'относительно оси', 'in the axis'), L('nisbatan', 'относительно', 'relative to')] }, { slot: 0 }],
    [{ t: [L('keyin', 'потом', 'then'), 'y', L("o'qiga", 'относительно оси', 'in the axis')] }, { slot: 1 }],
  ],
  cards: ['(−4; −9)', '(4; −9)', '(4; 9)', '(9; −4)'],
  answer: ['(−4; −9)', '(4; −9)'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. Avval ordinata ishorasi almashdi: (−4; −9). Keyin abssissa: (4; −9).",
    'Верно. Сначала сменился знак ординаты: (−4; −9). Потом абсциссы: (4; −9).',
    'Correct. First the ordinate flipped: (−4; −9). Then the abscissa: (4; −9).'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '(4; 9)',
      text: L(
        "x o'qiga nisbatan ABSSISSA o'zgarmaydi: faqat ordinata ishorasi almashadi.",
        'При симметрии относительно оси x АБСЦИССА не меняется: знак меняет только ордината.',
        'Reflecting in the x axis leaves the ABSCISSA alone: only the ordinate flips.'),
    },
    {
      when: (s) => s.slots[1] === '(9; −4)',
      text: L(
        "Bu yerda koordinatalar joyini almashtirgan. Simmetriya faqat ISHORANI o'zgartiradi.",
        'Здесь координаты поменялись местами. Симметрия меняет только ЗНАК.',
        'Here the coordinates swapped places. Reflection changes only the SIGN.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma uya to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    'Har qadamda faqat bitta ishora almashadi.',
    'На каждом шаге меняется только один знак.',
    'Only one sign flips at each step.'),
};

export default function D33_04(props) { return <SlotsBank data={DATA} {...props} />; }
