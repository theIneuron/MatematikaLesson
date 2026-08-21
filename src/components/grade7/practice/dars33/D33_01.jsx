// Dars33 · Amaliyot 01 — Nuqtaning yozuvi · 🟢 · build · tag: point_write
// Mexanika: kit.jsx -> BuildLine. Raskladka: 33-dars, 1-o'rin.
// Abssissa 4, ordinata −7 -> (4; −7). Tartib muhim: avval x, keyin y.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_write', level: '🟢',
  eyebrow: L('Nuqtaning koordinatalari', 'Координаты точки', 'Coordinates of a point'),
  setup: L(
    "Nuqta yozuvida tartib qat'iy: avval abssissa (x), keyin ordinata (y). O'rin almashsa boshqa nuqta chiqadi.",
    'В записи точки порядок строгий: сначала абсцисса (x), потом ордината (y). При перестановке выйдет другая точка.',
    "A point's record has a strict order: the abscissa (x) first, then the ordinate (y). Swapping gives another point."),
  given: [['x', '=', '4'], ['y', '=', '−7']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '(4;' },
    { id: 'b', label: '−7)' },
    { id: 'c', label: '(−7;' },
    { id: 'd', label: '4)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Nuqtaning yozuvini tuzing", 'Составь запись точки', 'Build the point record'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (4; −7): birinchi son o'ngga siljish, ikkinchisi pastga.",
    'Верно. (4; −7): первое число это сдвиг вправо, второе вниз.',
    'Correct. (4; −7): the first number moves right, the second down.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Koordinatalar almashib ketdi: (−7; 4) boshqa nuqta -- u chapda va tepada turadi.",
      'Координаты перепутаны: (−7; 4) это другая точка — она слева и выше.',
      'The coordinates got swapped: (−7; 4) is another point — left and above.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat: abssissa va ordinata.",
      'Запись состоит из двух частей: абсцисса и ордината.',
      'The record has two parts: abscissa and ordinate.') },
  ],
  wrongText: L(
    "Qaysi son birinchi yoziladi -- x mi yoki y?",
    'Какое число пишется первым — x или y?',
    'Which number comes first — x or y?'),
};

export default function D33_01(props) { return <BuildLine data={DATA} {...props} />; }
