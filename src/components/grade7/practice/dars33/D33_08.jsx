// Dars33 · Amaliyot 08 — Boshga nisbatan simmetriya · 🔴 · build · tag: point_origin
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
// (4; −3) ning koordinatalar boshiga nisbatan simmetrigi (−4; 3):
// IKKI koordinata ham ishorasini almashtiradi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_origin', level: '🔴',
  eyebrow: L('Boshga nisbatan', 'Относительно начала', 'About the origin'),
  setup: L(
    "Koordinatalar boshiga nisbatan simmetriya ikki koordinatani ham ishorasini almashtiradi: nuqta qarama-qarshi chorakka o'tadi.",
    'Симметрия относительно начала координат меняет знак обеих координат: точка переходит в противоположную четверть.',
    'Reflecting about the origin flips both coordinates: the point moves to the opposite quadrant.'),
  given: [['(4;', '−3)']],
  givenLabel: L('Nuqta:', 'Точка:', 'The point:'),
  cards: [
    { id: 'a', label: '(−4;' },
    { id: 'b', label: '3)' },
    { id: 'c', label: '(4;' },
    { id: 'd', label: '−3)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Simmetrik nuqtani tuzing", 'Составь симметричную точку', 'Build the symmetric point'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (−4; 3): ikki ishora ham almashdi. To'rtinchi chorakdan ikkinchi chorakka o'tdi.",
    'Верно. (−4; 3): оба знака поменялись. Из четвёртой четверти точка перешла во вторую.',
    'Correct. (−4; 3): both signs flipped. The point moved from quadrant IV to quadrant II.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 && s.seq.indexOf('b') !== -1, text: L(
      "(4; 3) faqat ordinatani almashtiradi -- bu x o'qiga nisbatan simmetriya. Boshga nisbatan IKKI koordinata ham almashadi.",
      '(4; 3) меняет только ординату — это симметрия относительно оси x. Относительно начала меняются ОБЕ координаты.',
      '(4; 3) flips only the ordinate — that is the x axis. About the origin BOTH flip.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Ordinata ham almashishi kerak: −3 dan 3 ga.",
      'Ордината тоже должна поменяться: из −3 в 3.',
      'The ordinate must flip too: from −3 to 3.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat.",
      'Запись состоит из двух частей.',
      'The record has two parts.') },
  ],
  wrongText: L(
    "Boshga nisbatan simmetriyada nechta koordinata ishorasini almashtiradi?",
    'При симметрии относительно начала сколько координат меняют знак?',
    'Reflecting about the origin: how many coordinates flip?'),
};

export default function D33_08(props) { return <BuildLine data={DATA} {...props} />; }
