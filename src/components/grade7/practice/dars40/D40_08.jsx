// Dars40 · Amaliyot 08 — Ikki marta yarim · 🔴 · order · tag: seg_half_twice
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 8-o'rin.
// AB = 36, M -- AB ning o'rtasi, K -- AM ning o'rtasi -> AK = 9.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_half_twice', level: '🔴',
  eyebrow: L('Ikki marta yarim', 'Дважды половина', 'Halved twice'),
  setup: L(
    "M nuqta AB ni teng ikkiga bo'ladi, K nuqta esa AM ni. Ya'ni yarim ikki marta olinadi.",
    'Точка M делит AB пополам, а точка K делит AM. То есть половина берётся дважды.',
    'M halves AB and K halves AM. The halving happens twice.'),
  given: [['AB', '=', '36']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '36 : 2 = 18' },
    { id: 'b', label: '18 : 2 = 9' },
    { id: 'c', label: 'AK = 9' },
    { id: 'd', label: '36 : 4 = 9' },
    { id: 'e', label: 'AK = 18' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. AM = 18, keyin AK = 9. Ikki marta yarimga bo'lish to'rtga bo'lishga teng.",
    'Верно. AM = 18, потом AK = 9. Двукратное деление пополам равно делению на четыре.',
    'Correct. AM = 18, then AK = 9. Halving twice equals dividing by four.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "18 bu AM, ya'ni M gacha masofa. K esa AM ning o'rtasida: AK = 9.",
      '18 это AM, расстояние до M. А K лежит в середине AM: AK = 9.',
      '18 is AM, the distance to M. K is the midpoint of AM: AK = 9.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "36 : 4 = 9 javob to'g'ri, lekin bu bitta qadam: masalada ikki bo'lish ketma-ket bajariladi.",
      '36 : 4 = 9 даёт верный ответ, но это один шаг: в задаче два деления подряд.',
      '36 : 4 = 9 gives the right answer but skips a step: the task has two halvings.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak: ikki bo'lish va javob.",
      'Должно быть три шага: два деления и ответ.',
      'Three steps: two halvings and the answer.') },
  ],
  wrongText: L(
    "Avval AB ni ikkiga bo'ling, keyin natijani yana ikkiga.",
    'Сначала раздели AB на два, потом результат ещё на два.',
    'Halve AB first, then halve the result again.'),
};

export default function D40_08(props) { return <BuildLine data={DATA} {...props} />; }
