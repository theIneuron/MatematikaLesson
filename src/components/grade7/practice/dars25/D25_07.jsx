// Dars25 · Amaliyot 07 — Uch yozuv, uch natija · 🟡 · sort · tag: sq_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 7-o'rin.
// (x + 6)²      = x² + 12x + 36
// (x − 6)²      = x² − 12x + 36
// (x − 6)(x + 6) = x² − 36        (o'rta had yo'qoladi)
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'sq_zones', level: '🟡', itemSize: 19, zoneLbl: 112,
  eyebrow: L('Uch natija', 'Три результата', 'Three results'),
  setup: L(
    "Uch yozuvda bir xil sonlar, lekin natijalar boshqa. Uchinchisida o'rta had yo'qoladi -- shuning uchun faqat ikki had qoladi.",
    'В трёх записях одни числа, но результаты разные. В третьей средний член исчезает — остаются только два члена.',
    'The three records share the numbers but differ in result. In the third the middle term vanishes, leaving two.'),
  zones: [
    { id: 'z1', label: L('x² + 12x + 36', 'x² + 12x + 36', 'x² + 12x + 36') },
    { id: 'z2', label: L('x² − 12x + 36', 'x² − 12x + 36', 'x² − 12x + 36') },
    { id: 'z3', label: L('x² − 36', 'x² − 36', 'x² − 36') },
  ],
  items: [
    { id: 'i1', tokens: ['(x', '+', '6)²'], zone: 'z1' },
    { id: 'i2', tokens: ['(x', '−', '6)²'], zone: 'z2' },
    { id: 'i3', tokens: ['(x', '−', '6)', '(x', '+', '6)'], zone: 'z3' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Ikki kvadratda o'rta had bor, ishorasi bilan farq qiladi. Uchinchisida esa −6x + 6x = 0, o'rta had yo'qoladi.",
    'Верно. В двух квадратах средний член есть и различается знаком. А в третьей −6x + 6x = 0, средний член исчезает.',
    'Correct. Both squares have a middle term differing in sign. In the third −6x + 6x = 0 and the middle term goes.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "(x − 6)(x + 6) da o'rta hadlar bir-birini yo'qotadi: +6x − 6x = 0. Qoladi x² − 36.",
      'В (x − 6)(x + 6) средние члены уничтожаются: +6x − 6x = 0. Остаётся x² − 36.',
      'In (x − 6)(x + 6) the middle terms cancel: +6x − 6x = 0. What remains is x² − 36.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "(x − 6)² da o'rta had manfiy, oxirgisi esa musbat: (−6)² = +36.",
      'В (x − 6)² средний член отрицательный, а последний положительный: (−6)² = +36.',
      'In (x − 6)² the middle term is negative and the last positive: (−6)² = +36.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "(x + 6)² da hammasi musbat: x² + 12x + 36.",
      'В (x + 6)² всё положительное: x² + 12x + 36.',
      'In (x + 6)² everything is positive: x² + 12x + 36.') },
  ],
  wrongText: L(
    "Har yozuvda o'rta hadga qarang: u bormi, va qanday ishora bilan?",
    'Смотри в каждой записи на средний член: есть ли он и с каким знаком?',
    'In each record look at the middle term: is it there, and with which sign?'),
};

export default function D25_07(props) { return <Zones data={DATA} {...props} />; }
