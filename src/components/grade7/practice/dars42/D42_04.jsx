// Dars42 · Amaliyot 04 — Uchinchi burchak · 🟡 · build · tag: tri_third
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin.
// 55° va 65° -> uchinchisi 180 − 120 = 60°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_third', level: '🟡',
  eyebrow: L('Uchinchi burchak', 'Третий угол', 'The third angle'),
  setup: L(
    "Ikki burchak ma'lum. Uchinchisi 180 dan ikkovining yig'indisini ayirish bilan topiladi.",
    'Два угла известны. Третий находится вычитанием их суммы из 180.',
    'Two angles are known. The third is 180 minus their sum.'),
  given: [['55°', 'va', '65°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '180° − 120°' },
    { id: 'b', label: '60°' },
    { id: 'c', label: '180° − 55°' },
    { id: 'd', label: '125°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 55 + 65 = 120, keyin 180 − 120 = 60.",
    'Верно. 55 + 65 = 120, потом 180 − 120 = 60.',
    'Correct. 55 + 65 = 120, then 180 − 120 = 60.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Faqat bitta burchak ayirilgan. Ikkinchisini ham hisobga olish kerak: avval ularni qo'shing.",
      'Вычли только один угол. Второй тоже надо учесть: сначала сложи их.',
      'Only one angle was subtracted. The second counts too: add them first.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Ikki ma'lum burchakni qo'shing, keyin 180 dan ayiring.",
    'Сложи два известных угла, потом вычти из 180.',
    'Add the two known angles, then subtract from 180.'),
};

export default function D42_04(props) { return <BuildLine data={DATA} {...props} />; }
