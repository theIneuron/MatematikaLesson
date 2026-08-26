// Dars04 · Amaliyot 09 — Isbot qadamlari · 🔴 · order · tag: id_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 9-o'rin.
// 5(a + 2) − 3a = 2a + 10 isboti: qavsni ochish, o'xshashlarni ixchamlash,
// natijani solishtirish.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'id_order', level: '🔴',
  eyebrow: L('Isbot qadamlari', 'Шаги доказательства', 'Steps of a proof'),
  setup: L(
    "Ayniyat son bilan emas, XOSSALAR bilan isbotlanadi: qavs ochiladi, o'xshash hadlar ixchamlanadi, natija o'ng tomon bilan solishtiriladi.",
    'Тождество доказывается не числом, а СВОЙСТВАМИ: раскрыть скобку, привести подобные, сравнить с правой частью.',
    'An identity is proved by PROPERTIES, not numbers: open the bracket, collect like terms, compare with the right side.'),
  given: [['5(a + 2) − 3a', 'va', '2a + 10']],
  givenLabel: L('Isbotlash kerak:', 'Доказать:', 'To prove:'),
  cards: [
    { id: 'a', label: '5a + 10 − 3a' },
    { id: 'b', label: '2a + 10' },
    { id: 'c', label: "chap = o'ng" },
    { id: 'd', label: '5a + 2 − 3a' },
    { id: 'e', label: '2a + 2' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5(a + 2) − 3a = 5a + 10 − 3a = 2a + 10 -- o'ng tomon bilan mos keldi, ayniyat isbotlandi.",
    'Верно. 5(a + 2) − 3a = 5a + 10 − 3a = 2a + 10 — совпало с правой частью, тождество доказано.',
    'Correct. 5(a + 2) − 3a = 5a + 10 − 3a = 2a + 10 — it matches the right side, so the identity holds.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "Qavs ochilganda 5 ikkiga ham ko'paytiriladi: 5 · 2 = 10, 2 emas.",
      'При раскрытии 5 умножается и на двойку: 5 · 2 = 10, а не 2.',
      'Opening the bracket multiplies the 2 as well: 5 · 2 = 10, not 2.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: ochish, ixchamlash, solishtirish.",
      'Шаги верные, но порядок другой: раскрытие, приведение, сравнение.',
      'The steps are right but the order is not: open, collect, compare.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak, oxirgisi -- solishtirish.",
      'Должно быть три шага, последний это сравнение.',
      'Three steps are needed, the last being the comparison.') },
  ],
  wrongText: L(
    "Avval qavsni to'liq oching, keyin a li hadlarni yig'ing, oxirida o'ng tomon bilan solishtiring.",
    'Сначала раскрой скобку полностью, потом собери члены с a, в конце сравни с правой частью.',
    'Open the bracket fully, collect the a terms, then compare with the right side.'),
};

export default function D04_09(props) { return <BuildLine data={DATA} {...props} />; }
