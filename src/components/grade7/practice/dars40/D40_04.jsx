// Dars40 · Amaliyot 04 — Bo'lakni topish · 🟡 · build · tag: seg_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin.
// AB = 30, AC = 12 -> CB = 30 − 12 = 18.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_build', level: '🟡',
  eyebrow: L("Bo'lakni topish", 'Найти часть', 'Find the part'),
  setup: L(
    "Butun kesma va bitta bo'lak ma'lum. Ikkinchi bo'lak ayirish bilan topiladi.",
    'Известны весь отрезок и одна часть. Вторая часть находится вычитанием.',
    'The whole and one part are known. Subtraction gives the other.'),
  given: [['AB', '=', '30'], ['AC', '=', '12']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '30 − 12' },
    { id: 'b', label: '18' },
    { id: 'c', label: '30 + 12' },
    { id: 'd', label: '42' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. CB = 30 − 12 = 18. Tekshirish: 12 + 18 = 30.",
    'Верно. CB = 30 − 12 = 18. Проверка: 12 + 18 = 30.',
    'Correct. CB = 30 − 12 = 18. Check: 12 + 18 = 30.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Qo'shish butun kesmadan katta son beradi: bo'lak butundan katta bo'lolmaydi.",
      'Сложение даёт число больше всего отрезка: часть не может быть больше целого.',
      'Adding gives more than the whole: a part cannot exceed it.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Butundan bo'lakni ayirsangiz nima qoladi?",
    'Что останется, если из целого вычесть часть?',
    'What remains when a part is taken from the whole?'),
};

export default function D40_04(props) { return <BuildLine data={DATA} {...props} />; }
