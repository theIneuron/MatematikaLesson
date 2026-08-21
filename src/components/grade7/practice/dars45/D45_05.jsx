// Dars45 · Amaliyot 05 — Bir tomonli burchak · 🟡 · build · tag: par_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin.
// 118° ning ichki bir tomonli burchagi: 180 − 118 = 62°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'par_build', level: '🟡',
  eyebrow: L('Bir tomonli', 'Односторонний', 'Same-side'),
  setup: L(
    "Ichki bir tomonli burchaklar 180 gradusga to'ldiradi. Bittasi o'tmas bo'lsa, ikkinchisi o'tkir chiqadi.",
    'Односторонние углы дополняют до 180 градусов. Если один тупой, второй выходит острым.',
    'Same-side angles complete 180. If one is obtuse, the other comes out acute.'),
  given: [['∠1', '=', '118°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '180° − 118°' },
    { id: 'b', label: '62°' },
    { id: 'c', label: '118°' },
    { id: 'd', label: '72°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 180 − 118 = 62. Tekshirish: 118 + 62 = 180.",
    'Верно. 180 − 118 = 62. Проверка: 118 + 62 = 180.',
    'Correct. 180 − 118 = 62. Check: 118 + 62 = 180.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "118° teng burchak bo'lardi -- bu mos yoki almashinuvchi juft. Bir tomonlilar esa 180 beradi.",
      '118° было бы равным углом — это соответственные или накрест лежащие. А односторонние дают 180.',
      '118° would be an equal angle — corresponding or alternate. Same-side ones give 180.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "72 emas: 180 − 118 = 62. Hisobni qayta tekshiring.",
      'Не 72: 180 − 118 = 62. Пересчитай.',
      'Not 72: 180 − 118 = 62. Recheck the arithmetic.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Bir tomonli burchaklar yig'indisi nechchi? Ikkinchisini qanday topadilar?",
    'Чему равна сумма односторонних углов? Как найти второй?',
    'What do same-side angles add to? How is the second found?'),
};

export default function D45_05(props) { return <BuildLine data={DATA} {...props} />; }
