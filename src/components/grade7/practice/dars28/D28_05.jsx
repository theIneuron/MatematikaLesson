// Dars28 · Amaliyot 05 — Uch yozuv, uch formula · 🟡 · sort · tag: formula_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 5-o'rin.
// (6x − 1)(6x + 1) -> kvadratlar ayirmasi
// (6x + 1)²        -> yig'indining kvadrati
// (6x − 1)²        -> ayirmaning kvadrati
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'formula_zones', level: '🟡', itemSize: 20, zoneLbl: 116,
  eyebrow: L('Formulani tanlash', 'Выбрать формулу', 'Choose the formula'),
  setup: L(
    "Uch yozuvda bir xil hadlar: 6x va 1. Formulani ishoralar va daraja belgilaydi.",
    'В трёх записях одни члены: 6x и 1. Формулу определяют знаки и степень.',
    'The three records share 6x and 1. The signs and the power decide the formula.'),
  zones: [
    { id: 'zd', label: L('Kvadratlar ayirmasi', 'Разность квадратов', 'Difference of squares') },
    { id: 'zp', label: L("Yig'indining kvadrati", 'Квадрат суммы', 'Square of a sum') },
    { id: 'zm', label: L('Ayirmaning kvadrati', 'Квадрат разности', 'Square of a difference') },
  ],
  items: [
    { id: 'i1', tokens: ['(6x', '−', '1)', '(6x', '+', '1)'], zone: 'zd' },
    { id: 'i2', tokens: ['(6x', '+', '1)²'], zone: 'zp' },
    { id: 'i3', tokens: ['(6x', '−', '1)²'], zone: 'zm' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Ikki qarama-qarshi qavs -- ayirma; kvadrat belgisi bo'lsa, qavs ichidagi ishora formulani tanlaydi.",
    'Верно. Две противоположные скобки это разность; если стоит квадрат, формулу выбирает знак внутри скобки.',
    'Correct. Two opposite brackets mean a difference; with a square, the sign inside picks the formula.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Ishoralari qarama-qarshi ikki qavs -- bu kvadratlar ayirmasi: 36x² − 1.",
      'Две скобки с противоположными знаками это разность квадратов: 36x² − 1.',
      'Two brackets with opposite signs make a difference of squares: 36x² − 1.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "(6x + 1)² da qavs ichida plyus: yig'indining kvadrati, 36x² + 12x + 1.",
      'В (6x + 1)² внутри плюс: это квадрат суммы, 36x² + 12x + 1.',
      'In (6x + 1)² the inside is a plus: a square of a sum, 36x² + 12x + 1.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "(6x − 1)² da qavs ichida minus: ayirmaning kvadrati, 36x² − 12x + 1.",
      'В (6x − 1)² внутри минус: квадрат разности, 36x² − 12x + 1.',
      'In (6x − 1)² the inside is a minus: a square of a difference, 36x² − 12x + 1.') },
  ],
  wrongText: L(
    "Ikki narsaga qarang: qavs ikkitami yoki daraja bormi, va ichidagi ishora qanday.",
    'Смотри на две вещи: две скобки или степень, и какой знак внутри.',
    'Look at two things: two brackets or a power, and the sign inside.'),
};

export default function D28_05(props) { return <Zones data={DATA} {...props} />; }
