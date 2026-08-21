// Dars37 · Amaliyot 01 — k ni topish · 🟢 · build · tag: prop_find_k
// Mexanika: kit.jsx -> BuildLine. Raskladka: 37-dars, 1-o'rin.
// y = kx, (2; 10) -> k = 10 : 2 = 5, ya'ni y = 5x.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_find_k', level: '🟢',
  eyebrow: L("To'g'ri proporsionallik", 'Прямая пропорциональность', 'Direct proportion'),
  setup: L(
    "y = kx da ozod had yo'q. k ni topish uchun ordinatani abssissaga bo'lish kifoya.",
    'В y = kx нет свободного члена. Чтобы найти k, достаточно разделить ординату на абсциссу.',
    'In y = kx there is no free term. Divide the ordinate by the abscissa to find k.'),
  given: [['(2;', '10)']],
  givenLabel: L('Nuqta:', 'Точка:', 'The point:'),
  cards: [
    { id: 'a', label: 'k = 5' },
    { id: 'b', label: 'y = 5x' },
    { id: 'c', label: 'k = 20' },
    { id: 'd', label: 'y = 2x' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("k ni topib formulani yozing", 'Найди k и запиши формулу', 'Find k and write the rule'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. k = 10 : 2 = 5, ya'ni y = 5x. Tekshirish: 5 · 2 = 10.",
    'Верно. k = 10 : 2 = 5, значит y = 5x. Проверка: 5 · 2 = 10.',
    'Correct. k = 10 : 2 = 5, so y = 5x. Check: 5 · 2 = 10.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "20 bu 10 · 2. k ni topish uchun BO'LISH kerak: 10 : 2 = 5.",
      '20 это 10 · 2. Чтобы найти k, надо ДЕЛИТЬ: 10 : 2 = 5.',
      '20 is 10 · 2. To find k you DIVIDE: 10 : 2 = 5.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "y = 2x da 2 bu abssissa, koeffitsiyent emas: 2 · 2 = 4, 10 emas.",
      'В y = 2x двойка это абсцисса, а не коэффициент: 2 · 2 = 4, а не 10.',
      'In y = 2x the 2 is the abscissa, not the coefficient: 2 · 2 = 4, not 10.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: k va formula.",
      'Нужны две части: k и формула.',
      'Two parts are needed: k and the rule.') },
  ],
  wrongText: L(
    "Ordinatani abssissaga bo'ling: 10 : 2 nechchi?",
    'Раздели ординату на абсциссу: сколько 10 : 2?',
    'Divide the ordinate by the abscissa: what is 10 : 2?'),
};

export default function D37_01(props) { return <BuildLine data={DATA} {...props} />; }
