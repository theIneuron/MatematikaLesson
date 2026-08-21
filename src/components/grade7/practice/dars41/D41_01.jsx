// Dars41 · Amaliyot 01 — Qo'shni burchak · 🟢 · order · tag: ang_adjacent
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 41-dars, 1-o'rin.
// Qo'shni burchaklar yig'indisi 180°. Biri 50° -> ikkinchisi 130°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_adjacent', level: '🟢',
  eyebrow: L("Qo'shni burchaklar", 'Смежные углы', 'Adjacent angles'),
  setup: L(
    "Qo'shni burchaklar birga yoyilgan burchakni tashkil qiladi, ya'ni yig'indisi 180 daraja.",
    'Смежные углы вместе образуют развёрнутый угол, значит их сумма 180 градусов.',
    'Adjacent angles form a straight angle, so they add to 180 degrees.'),
  given: [['∠1', '=', '50°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '180° − 50°' },
    { id: 'b', label: '130°' },
    { id: 'c', label: '90° − 50°' },
    { id: 'd', label: '40°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 180° − 50° = 130°. Tekshirish: 50 + 130 = 180.",
    'Верно. 180° − 50° = 130°. Проверка: 50 + 130 = 180.',
    'Correct. 180° − 50° = 130°. Check: 50 + 130 = 180.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "90 gradus TO'LDIRUVCHI burchaklar uchun. Qo'shni burchaklar yig'indisi 180 gradus.",
      '90 градусов это для дополнительных углов. Сумма смежных углов 180 градусов.',
      '90 degrees is for complementary angles. Adjacent angles add to 180.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Qo'shni burchaklar birga qanday burchak beradi? Uning o'lchovi nechchi?",
    'Какой угол образуют смежные углы вместе? Какова его мера?',
    'What angle do adjacent angles form together? What is its measure?'),
};

export default function D41_01(props) { return <BuildLine data={DATA} {...props} />; }
