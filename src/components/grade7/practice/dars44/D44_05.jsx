// Dars44 · Amaliyot 05 — Uch qadam · 🟡 · order · tag: sum_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin `order`.
// To'g'ri burchakli uchburchak: 90 va 35 -> 90 + 35 = 125 -> 180 − 125 = 55.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_order',
  level: '🟡',
  eyebrow: L(
    'Uch qadam',
    'Три шага',
    'Three steps'),
  setup: L(
    "To'g'ri burchakli uchburchakda bir burchak 90, ikkinchisi 35. Uchinchisini uch qadamda toping.",
    'В прямоугольном треугольнике один угол 90, другой 35. Найди третий в три шага.',
    'A right triangle has one angle 90 and another 35. Find the third in three steps.'),
  given: [['90°', 'va', '35°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '90 + 35 = 125' },
    { id: 'b', label: '180 − 125 = 55' },
    { id: 'c', label: 'uchinchisi 55°' },
    { id: 'd', label: '90 − 35 = 55' },
    { id: 'e', label: 'uchinchisi 125°' },
  ],
  answerSeq: ['a', 'b', 'c'],
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. Ikki burchakni qo'shib 180 dan ayirdik: 55 gradus.",
    'Верно. Сложили два угла и вычли из 180: 55 градусов.',
    'Correct. The two angles were added and taken from 180: 55 degrees.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '90 − 35 ham 55 beradi, lekin bu tasodif: qoida 180 dan ayirishni talab qiladi.',
        '90 − 35 тоже даёт 55, но это совпадение: правило требует вычитать из 180.',
        '90 − 35 also gives 55, but that is a coincidence: the rule subtracts from 180.'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        "125 bu ikki burchakning yig'indisi, uchinchi burchak emas.",
        '125 это сумма двух углов, а не третий угол.',
        '125 is the sum of two angles, not the third angle.'),
    },
    {
      when: (s) => s.seq.length < 3,
      text: L(
        'Uch karta kerak.',
        'Нужны три карточки.',
        'Three cards are needed.'),
    },
  ],
  wrongText: L(
    "Avval ma'lum ikki burchakni qo'shing, keyin 180 dan ayiring.",
    'Сначала сложи два известных угла, потом вычти из 180.',
    'Add the two known angles first, then subtract from 180.'),
};

export default function D44_05(props) { return <BuildLine data={DATA} {...props} />; }
