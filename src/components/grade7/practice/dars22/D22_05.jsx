// Dars22 · Amaliyot 05 — Minusni chiqarish · 🟡 · build · tag: factor_neg
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin.
// −15t⁴ − 25t² = −5t²(3t² + 5). Minus ham chiqadi: shunda qavs ichidagi
// ikki had ham PLYUS bo'ladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_neg', level: '🟡',
  eyebrow: L('Minusni chiqarish', 'Вынести минус', 'Taking out the minus'),
  setup: L(
    "Ikki had ham manfiy bo'lsa, minusni ham qavs oldiga chiqarish mumkin. Shunda qavs ichidagi ikki had ham plyus bo'lib qoladi.",
    'Если оба члена отрицательные, минус тоже можно вынести за скобку. Тогда внутри оба члена окажутся с плюсом.',
    'When both terms are negative the minus can be taken out too. Then both terms inside come out positive.'),
  expr: ['−15t⁴', '−', '25t²'], exprSize: 32,
  cards: [
    { id: 'a', label: '−5t²' },
    { id: 'b', label: '(3t² + 5)' },
    { id: 'c', label: '5t²' },
    { id: 'd', label: '(3t² − 5)' },
    { id: 'e', label: '(−3t² + 5)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ko'paytuvchilarga ajrating", 'Разложи на множители', 'Factorise it'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. −5t²(3t² + 5) ochilsa −15t⁴ − 25t² beradi: minus ikki hadga ham tarqaladi.",
    'Верно. Раскрытие −5t²(3t² + 5) даёт −15t⁴ − 25t²: минус распространяется на оба члена.',
    'Correct. Opening −5t²(3t² + 5) gives −15t⁴ − 25t²: the minus spreads to both terms.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "5t² ni chiqarsak qavs ichida ikki manfiy had qolardi. Minusni ham chiqarish qavsni tozalaydi.",
      'Если вынести 5t², в скобке остались бы два отрицательных члена. Вынесение минуса очищает скобку.',
      'Taking out 5t² would leave two negative terms inside. Taking the minus out clears the bracket.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "−5t²(3t² − 5) ochilsa −15t⁴ + 25t² chiqadi: ikkinchi had musbat bo'lib qoladi.",
      'Раскрытие −5t²(3t² − 5) даёт −15t⁴ + 25t²: второй член становится положительным.',
      'Opening −5t²(3t² − 5) gives −15t⁴ + 25t²: the second term turns positive.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ichida bir minus, bir plyus turgan: bu ikki hadning ishorasi bir xil emasligini bildiradi. Bizda esa ikkovi manfiy.",
      'Внутри стоят минус и плюс: это значит, что знаки членов разные. А у нас оба отрицательные.',
      'Inside there is a minus and a plus: that means different signs. But both our terms are negative.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki ko'paytuvchidan iborat: bir had va qavs.",
      'Ответ состоит из двух множителей: одночлен и скобка.',
      'The answer has two factors: a monomial and a bracket.') },
  ],
  wrongText: L(
    "Har hadni −5t² ga bo'ling: manfiyni manfiyga bo'lsa musbat chiqadi.",
    'Раздели каждый член на −5t²: минус на минус даёт плюс.',
    'Divide each term by −5t²: a negative over a negative gives a positive.'),
};

export default function D22_05(props) { return <BuildLine data={DATA} {...props} />; }
