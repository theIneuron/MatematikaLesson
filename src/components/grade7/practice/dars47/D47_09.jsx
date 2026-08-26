// Dars47 · Amaliyot 09 — Yasash mumkinmi · 🔴 · build · tag: comp_possible
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin `build`.
// 5, 6, 12: 5 + 6 = 11 < 12 -> yoylar kesishmaydi, uchburchak yasalmaydi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comp_possible',
  level: '🔴',
  eyebrow: L(
    'Yasash mumkinmi',
    'Можно ли построить',
    'Can it be built'),
  setup: L(
    'Uch tomoni berilgan. Yasashdan oldin tekshirish kerak: yoylar kesishadimi. Ikki javob kerak: xulosa va sabab.',
    'Даны три стороны. Перед построением надо проверить: пересекутся ли дуги. Нужны два ответа: вывод и причина.',
    'Three sides are given. Before building, check whether the arcs meet. Two answers: the conclusion and the reason.'),
  given: [['5, 6, 12']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: L('yasash mumkin emas', 'построить нельзя', 'it cannot be built') },
    { id: 'b', label: '5 + 6 < 12' },
    { id: 'c', label: L('yasash mumkin', 'построить можно', 'it can be built') },
    { id: 'd', label: '12 − 6 = 6' },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 44,
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
    "To'g'ri. 5 + 6 = 11, bu 12 dan kichik: yoylar bir-biriga yetib bormaydi va kesishmaydi.",
    'Верно. 5 + 6 = 11, это меньше 12: дуги не достают друг до друга и не пересекаются.',
    'Correct. 5 + 6 = 11 is below 12: the arcs fall short and never cross.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "Tengsizlik bajarilmadi: 11 < 12, ya'ni yasash mumkin emas.",
        'Неравенство не выполнено: 11 < 12, значит построить нельзя.',
        'The inequality fails: 11 < 12, so it cannot be built.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "12 − 6 = 6 -- bu ayirma, tekshirish esa YIG'INDI bilan qilinadi: 5 + 6 va 12.",
        '12 − 6 = 6 это разность, а проверяют СУММОЙ: 5 + 6 против 12.',
        '12 − 6 = 6 is a difference; the test uses the SUM: 5 + 6 against 12.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    "Ikki kichik tomonni qo'shing va eng katta bilan solishtiring.",
    'Сложи две меньшие стороны и сравни с наибольшей.',
    'Add the two shorter sides and compare with the longest.'),
};

export default function D47_09(props) { return <BuildLine data={DATA} {...props} />; }
