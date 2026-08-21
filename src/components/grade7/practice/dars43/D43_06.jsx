// Dars43 · Amaliyot 06 — Mos elementlar · 🟡 · slots · tag: eq_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 6-o'rin.
// Teng uchburchaklar: AB = 8, ∠C = 55° -> mos elementlar ham 8 va 55°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_slots', level: '🟡',
  eyebrow: L('Mos elementlar', 'Соответственные элементы', 'Corresponding parts'),
  setup: L(
    "Uchburchaklar teng bo'lsa, mos tomonlar va mos burchaklar ham teng bo'ladi. Sonlarni o'zgartirish kerak emas.",
    'Если треугольники равны, равны и соответственные стороны, и соответственные углы. Числа менять не нужно.',
    'Equal triangles have equal corresponding sides and angles. The numbers carry over unchanged.'),
  given: [['AB', '=', '8'], ['∠C', '=', '55°']],
  givenLabel: L('Birinchi uchburchak:', 'Первый треугольник:', 'First triangle:'),
  rows: [
    [{ t: ['A₁B₁', '='] }, { slot: 0 }, { t: ['∠C₁', '='] }, { slot: 1 }],
  ],
  cards: ['8', '55°', '16', '125°'],
  answer: ['8', '55°'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Teng uchburchaklarda mos elementlar aynan teng: 8 va 55°.",
    'Верно. У равных треугольников соответственные элементы в точности равны: 8 и 55°.',
    'Correct. Corresponding parts of equal triangles are exactly equal: 8 and 55°.'),
  wrongs: [
    { when: (s) => s.slots[0] === '16', text: L(
      "16 bu 8 · 2. Teng uchburchaklar bir xil o'lchamda: tomon ikki barobar bo'lmaydi.",
      '16 это 8 · 2. Равные треугольники одного размера: сторона не удваивается.',
      '16 is 8 · 2. Equal triangles are the same size: the side does not double.') },
    { when: (s) => s.slots[1] === '125°', text: L(
      "125 bu 55 ning qo'shni burchagi. Mos burchak esa aynan 55° bo'ladi.",
      '125 это смежный угол к 55. А соответственный угол ровно 55°.',
      '125 is the adjacent angle to 55. The corresponding angle is exactly 55°.') },
  ],
  wrongText: L(
    "Teng uchburchaklarda mos element o'zgaradimi?",
    'Меняется ли соответственный элемент у равных треугольников?',
    'Does a corresponding part change between equal triangles?'),
};

export default function D43_06(props) { return <SlotsBank data={DATA} {...props} />; }
