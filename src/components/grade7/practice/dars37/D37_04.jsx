// Dars37 · Amaliyot 04 — Uch formula · 🟡 · sort · tag: prop_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 4-o'rin.
// y = −6x -> to'g'ri proporsionallik; y = 2x + 3 -> chiziqli, lekin emas;
// y = 6 : x -> umuman proporsional emas (teskari bog'lanish).
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_zones', level: '🟡', itemSize: 20, zoneLbl: 118,
  eyebrow: L('Uch formula', 'Три формулы', 'Three rules'),
  setup: L(
    "Uch formulada yettilik yoki oltilik bor, lekin ular boshqa bog'lanishlar. Ozod had va bo'linish hammasini o'zgartiradi.",
    'В трёх формулах есть шестёрка, но зависимости разные. Свободный член и деление всё меняют.',
    'All three carry a six, yet the relationships differ. A free term or a division changes everything.'),
  zones: [
    { id: 'zp', label: L("To'g'ri proporsionallik", 'Прямая пропорциональность', 'Direct proportion') },
    { id: 'zl', label: L('Chiziqli, lekin emas', 'Линейная, но нет', 'Linear, but not') },
    { id: 'zn', label: L('Proporsional emas', 'Не пропорциональна', 'Not proportional') },
  ],
  items: [
    { id: 'i1', tokens: ['y', '=', '−6x'], zone: 'zp' },
    { id: 'i2', tokens: ['y', '=', '2x', '+', '3'], zone: 'zl' },
    { id: 'i3', tokens: ['y', '=', '6', ':', 'x'], zone: 'zn' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Formulalar', 'Формулы', 'Rules'),
  correctText: L(
    "To'g'ri. y = −6x da faqat k bor -- manfiy bo'lsa ham proporsionallik. Ozod had bo'lsa chiziqli, x bo'luvchida bo'lsa esa umuman boshqa.",
    'Верно. В y = −6x есть только k — даже отрицательный, это пропорциональность. Со свободным членом линейная, а с x в делителе совсем другое.',
    'Correct. y = −6x has only k — negative still counts. A free term makes it merely linear; x as divisor is something else.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "k manfiy bo'lishi mumkin: y = −6x ham to'g'ri proporsionallik, grafik boshdan o'tadi.",
      'k может быть отрицательным: y = −6x тоже прямая пропорциональность, график проходит через начало.',
      'k may be negative: y = −6x is still a direct proportion through the origin.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "y = 2x + 3 da ozod had bor: grafik boshdan o'tmaydi, ya'ni proporsionallik emas.",
      'В y = 2x + 3 есть свободный член: график не проходит через начало, значит не пропорциональность.',
      'y = 2x + 3 has a free term: the graph misses the origin, so not a proportion.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "y = 6 : x da x bo'luvchida: bu chiziqli funksiya ham emas.",
      'В y = 6 : x икс в делителе: это даже не линейная функция.',
      'In y = 6 : x the x is a divisor: not even a linear function.') },
  ],
  wrongText: L(
    "Har formulada ikki narsani tekshiring: ozod had bormi va x qayerda turadi.",
    'В каждой формуле проверь два признака: есть ли свободный член и где стоит x.',
    'Check two things in each: is there a free term, and where does x sit.'),
};

export default function D37_04(props) { return <Zones data={DATA} {...props} />; }
