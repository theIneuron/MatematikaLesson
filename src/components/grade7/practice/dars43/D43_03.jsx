// Dars43 · Amaliyot 03 — Mos burchak · 🟢 · build · tag: eq_corresponding
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin.
// Teng uchburchaklarda ∠A = 40°, ∠B = 70° -> ∠C = 180 − 110 = 70°.
// Mos burchak ham 70° bo'ladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_corresponding', level: '🟢',
  eyebrow: L('Mos burchak', 'Соответственный угол', 'Corresponding angle'),
  setup: L(
    "Teng uchburchaklarda mos burchaklar teng. Uchinchi burchakni topsak, ikkinchi uchburchakdagi mos burchak ham shu bo'ladi.",
    'У равных треугольников соответственные углы равны. Найдя третий угол, получаем и соответственный во втором треугольнике.',
    'Equal triangles have equal corresponding angles. Finding the third gives the matching one too.'),
  given: [['∠A', '=', '40°'], ['∠B', '=', '70°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '180° − 110°' },
    { id: 'b', label: '70°' },
    { id: 'c', label: '180° − 40°' },
    { id: 'd', label: '140°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 40 + 70 = 110, keyin 180 − 110 = 70. Ikkinchi uchburchakdagi mos burchak ham 70°.",
    'Верно. 40 + 70 = 110, потом 180 − 110 = 70. Соответственный угол второго треугольника тоже 70°.',
    'Correct. 40 + 70 = 110, then 180 − 110 = 70. The corresponding angle is 70° too.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Faqat bitta burchak ayirilgan: ikkinchisini ham hisobga olish kerak.",
      'Вычли только один угол: второй тоже надо учесть.',
      'Only one angle was subtracted: the second counts too.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Ikki burchakni qo'shing, keyin 180 dan ayiring.",
    'Сложи два угла, потом вычти из 180.',
    'Add the two angles, then subtract from 180.'),
};

export default function D43_03(props) { return <BuildLine data={DATA} {...props} />; }
