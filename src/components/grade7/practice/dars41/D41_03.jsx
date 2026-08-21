// Dars41 · Amaliyot 03 — Qo'shni burchakni topish · 🟢 · build · tag: ang_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin.
// 40° ning qo'shnisi: 180° − 40° = 140°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_build', level: '🟢',
  eyebrow: L("Qo'shni burchak", 'Смежный угол', 'The adjacent angle'),
  setup: L(
    "Berilgan burchakning qo'shnisini topish uchun 180 dan uni ayirish kerak.",
    'Чтобы найти смежный угол, надо вычесть данный из 180.',
    'To find the adjacent angle, subtract the given one from 180.'),
  given: [['∠1', '=', '40°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '180° − 40°' },
    { id: 'b', label: '140°' },
    { id: 'c', label: '180° + 40°' },
    { id: 'd', label: '220°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 180° − 40° = 140°. Ikki burchak birga yoyilgan burchakni beradi.",
    'Верно. 180° − 40° = 140°. Два угла вместе дают развёрнутый угол.',
    'Correct. 180° − 40° = 140°. Together they form a straight angle.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "220 gradus bo'lolmaydi: qo'shni burchak yoyilgan burchakning bir bo'lagi, ya'ni 180 dan kichik.",
      '220 градусов быть не может: смежный угол это часть развёрнутого, то есть меньше 180.',
      '220 is impossible: an adjacent angle is part of a straight angle, so under 180.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Ikki qo'shni burchak yig'indisi 180 gradus. Ikkinchisini qanday topadilar?",
    'Сумма двух смежных углов 180 градусов. Как находят второй?',
    'Two adjacent angles add to 180. How is the second found?'),
};

export default function D41_03(props) { return <BuildLine data={DATA} {...props} />; }
