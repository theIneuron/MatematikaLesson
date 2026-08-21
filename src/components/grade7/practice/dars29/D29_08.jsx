// Dars29 · Amaliyot 08 — To'rtinchi daraja · 🔴 · build · tag: fact_fourth
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
// a⁴ − 16 = (a² − 4)(a² + 4) = (a − 2)(a + 2)(a² + 4).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fact_fourth', level: '🔴',
  eyebrow: L('Ikki marta ajratish', 'Разложить дважды', 'Split twice'),
  setup: L(
    "Birinchi ajratishdan keyin qavslardan biri yana kvadratlar ayirmasi bo'lib chiqadi. Yig'indi esa ajralmaydi.",
    'После первого разложения одна из скобок снова оказывается разностью квадратов. А сумма не разлагается.',
    'After the first split one bracket is again a difference of squares. The sum does not split.'),
  expr: ['a⁴', '−', '16'], exprSize: 34,
  cards: [
    { id: 'a', label: '(a − 2)' },
    { id: 'b', label: '(a + 2)' },
    { id: 'c', label: '(a² + 4)' },
    { id: 'd', label: '(a² − 4)' },
    { id: 'e', label: '(a − 4)' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Oxirigacha ajratib yozing", 'Разложи до конца', 'Factorise it fully'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. a⁴ − 16 = (a² − 4)(a² + 4), keyin a² − 4 = (a − 2)(a + 2). Yig'indi shu holda qoladi.",
    'Верно. a⁴ − 16 = (a² − 4)(a² + 4), потом a² − 4 = (a − 2)(a + 2). Сумма остаётся как есть.',
    'Correct. a⁴ − 16 = (a² − 4)(a² + 4), then a² − 4 = (a − 2)(a + 2). The sum stays.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "(a² − 4) ni ham ajratish mumkin: u kvadratlar ayirmasi.",
      '(a² − 4) тоже разлагается: это разность квадратов.',
      '(a² − 4) splits too: it is a difference of squares.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "16 ning ildizi 4, a⁴ ning ildizi a². Keyingi qadamda 4 ning ildizi 2 bo'ladi.",
      'Корень из 16 это 4, корень из a⁴ это a². На следующем шаге корень из 4 это 2.',
      'The root of 16 is 4 and of a⁴ is a². At the next step the root of 4 is 2.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch ko'paytuvchi bo'ladi.",
      'В ответе три множителя.',
      'The answer has three factors.') },
  ],
  wrongText: L(
    "a⁴ nimaning kvadrati? Ajratgandan keyin qavslarni yana tekshiring.",
    'Квадрат чего такое a⁴? После разложения проверь скобки снова.',
    'a⁴ is the square of what? After splitting, check the brackets again.'),
};

export default function D29_08(props) { return <BuildLine data={DATA} {...props} />; }
