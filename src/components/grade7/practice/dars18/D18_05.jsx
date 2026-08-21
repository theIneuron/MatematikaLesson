// Dars18 · Amaliyot 05 — Tartibga solish · 🟡 · slots · tag: poly_slots
// Faqat MA'LUMOT. Mexanika: kit.jsx -> SlotsBank. Raskladka: 5-o'rin.
//
// −5 + 8t² − 3t = 8t² − 3t − 5. Standart shaklda hadlar darajasi kamayib
// boradi, ishora esa har hadning o'zi bilan ko'chadi.
// Kartalar orasida +5, −8t², +3t turadi -- ishora almashtirilgan variantlar.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'poly_slots', level: '🟡',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Standart shaklda hadlar darajasi kamayib boradi: avval eng kattasi, oxirida ozod had. Joyi o'zgaradi, ishora esa hadning o'zi bilan ko'chadi.",
    'В стандартном виде степени идут по убыванию: сначала старший член, в конце свободный. Место меняется, а знак переезжает вместе со своим членом.',
    'In standard form the degrees go down: the highest term first, the free term last. Positions change, but each sign travels with its term.'),
  rows: [
    [{ t: ['−5', '+', '8t²', '−', '3t', '='] }, { slot: 0 }, { slot: 1 }, { slot: 2 }],
  ],
  cards: ['8t²', '−3t', '−5', '+5', '−8t²', '+3t'],
  answer: ['8t²', '−3t', '−5'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Darajasi bo'yicha: 8t² (ikkinchi daraja), −3t (birinchi), −5 (ozod had). Uchtasining ham ishorasi o'zgarmadi.",
    'Верно. По степеням: 8t² (вторая), −3t (первая), −5 (свободный член). Ни у одного знак не изменился.',
    'Correct. By degree: 8t² (second), −3t (first), −5 (the free term). None of the signs changed.'),
  wrongs: [
    { when: (s) => s.slots[2] === '+5', text: L(
      "Ozod had −5 edi. Hadni ko'chirish ishorani almashtirmaydi: bu tenglamadagi ko'chirish emas, shunchaki tartib.",
      'Свободный член был −5. Перестановка члена знак не меняет: это не перенос в уравнении, а просто порядок.',
      'The free term was −5. Reordering does not flip signs: this is not moving across an equals sign, just order.') },
    { when: (s) => s.slots[0] === '−8t²', text: L(
      "8t² musbat edi: asl yozuvda uning oldida plyus turgan.",
      '8t² был положительным: в исходной записи перед ним стоит плюс.',
      '8t² was positive: in the original it has a plus before it.') },
    { when: (s) => s.slots[1] === '+3t', text: L(
      "3t manfiy edi. Ishora hadning bir qismi, joyi o'zgarsa ham u o'zgarmaydi.",
      '3t был отрицательным. Знак часть члена, при смене места он не меняется.',
      '3t was negative. The sign is part of the term and does not change with its position.') },
  ],
  wrongText: L(
    "Har hadni ishorasi bilan ko'chiring va darajasi kamayadigan tartibda joylashtiring.",
    'Переноси каждый член вместе со знаком и располагай по убыванию степени.',
    'Move each term with its sign and place them in decreasing degree.'),
};

export default function D18_05(props) { return <SlotsBank data={DATA} {...props} />; }
