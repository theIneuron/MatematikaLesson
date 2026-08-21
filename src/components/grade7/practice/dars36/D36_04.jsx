// Dars36 · Amaliyot 04 — Ikki savol · 🟡 · chain · tag: graph_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 4-o'rin.
// y = −x + 6: x = 2 da y = 4; y = 0 bo'lganda x = 6.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_chain', level: '🟡',
  eyebrow: L('Ikki savol', 'Два вопроса', 'Two questions'),
  setup: L(
    "Birinchi qatorda x berilgan, y so'raladi. Ikkinchisida teskari: y berilgan, x so'raladi.",
    'В первой строке дан x, спрашивается y. Во второй наоборот: дан y, спрашивается x.',
    'The first row gives x and asks for y. The second reverses it.'),
  given: [['y', '=', '−x', '+', '6']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  rows: [
    [{ t: ['x', '=', '2', '→', 'y', '='] }, { slot: 0 }],
    [{ t: ['y', '=', '0', '→', 'x', '='] }, { slot: 1 }],
  ],
  cards: ['4', '6', '8', '−6'],
  answer: ['4', '6'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. −2 + 6 = 4. Ikkinchi qatorda −x + 6 = 0 -> x = 6.",
    'Верно. −2 + 6 = 4. Во второй строке −x + 6 = 0 → x = 6.',
    'Correct. −2 + 6 = 4. In the second row −x + 6 = 0 → x = 6.'),
  wrongs: [
    { when: (s) => s.slots[0] === '8', text: L(
      "x oldida minus turibdi: −2 + 6 = 4, 2 + 6 emas.",
      'Перед x стоит минус: −2 + 6 = 4, а не 2 + 6.',
      'There is a minus before x: −2 + 6 = 4, not 2 + 6.') },
    { when: (s) => s.slots[1] === '−6', text: L(
      "−x + 6 = 0 dan −x = −6, ya'ni x = 6: musbat.",
      'Из −x + 6 = 0 выходит −x = −6, значит x = 6: положительный.',
      'From −x + 6 = 0 we get −x = −6, so x = 6: positive.') },
    { when: (s) => s.slots[0] === '6' || s.slots[1] === '4', text: L(
      "Qatorlar almashib ketdi: birinchisida y so'raladi, ikkinchisida x.",
      'Строки перепутались: в первой спрашивается y, во второй x.',
      'The rows got swapped: the first asks for y, the second for x.') },
  ],
  wrongText: L(
    "Birinchi qatorda x ni qo'ying. Ikkinchisida formulani nolga tenglashtiring.",
    'В первой строке подставь x. Во второй приравняй формулу к нулю.',
    'Substitute x in the first row. Set the rule to zero in the second.'),
};

export default function D36_04(props) { return <SlotsBank data={DATA} {...props} />; }
