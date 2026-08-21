// Dars38 · Amaliyot 07 — Uch qadam · 🟡 · order · tag: sys_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 7-o'rin.
// y = x − 1 va y = 4: x − 1 = 4 -> x = 5 -> (5; 4).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_order', level: '🟡',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "Uch qadam: tenglama tuzish, x ni topish, javobni juftlik qilib yozish. Oxirgi qadam eng ko'p tashlab ketiladi.",
    'Три шага: составить уравнение, найти x, записать ответ парой. Последний шаг забывают чаще всего.',
    'Three steps: form the equation, find x, write the pair. The last step is the one most often skipped.'),
  given: [['y', '=', 'x', '−', '1'], ['y', '=', '4']],
  givenLabel: L('Sistema:', 'Система:', 'The system:'),
  cards: [
    { id: 'a', label: 'x − 1 = 4' },
    { id: 'b', label: 'x = 5' },
    { id: 'c', label: '(5; 4)' },
    { id: 'd', label: 'x = 3' },
    { id: 'e', label: '(4; 5)' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x − 1 = 4 -> x = 5, yechim (5; 4). Javob juftlik bo'lishi kerak.",
    'Верно. x − 1 = 4 → x = 5, решение (5; 4). Ответ должен быть парой.',
    'Correct. x − 1 = 4 → x = 5, the solution is (5; 4). The answer must be a pair.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "x = 3 emas: ko'chirishda 1 qo'shiladi, 4 + 1 = 5.",
      'x не 3: при переносе единица прибавляется, 4 + 1 = 5.',
      'x is not 3: moving the one adds it, 4 + 1 = 5.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "(4; 5) da tartib buzilgan: birinchi o'rinda x = 5 turishi kerak.",
      'В (4; 5) нарушен порядок: на первом месте должен стоять x = 5.',
      'In (4; 5) the order is wrong: x = 5 comes first.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: tenglama, ildiz, juftlik.",
      'Шаги верные, но порядок другой: уравнение, корень, пара.',
      'The steps are right but the order is not: equation, root, pair.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak, oxirgisi -- javob juftligi.",
      'Должно быть три шага, последний это пара-ответ.',
      'Three steps are needed, the last being the answer pair.') },
  ],
  wrongText: L(
    "y ni birinchi tenglamaga qo'ying, x ni toping, keyin javobni juftlik qilib yozing.",
    'Подставь y в первое уравнение, найди x, потом запиши ответ парой.',
    'Put y into the first equation, find x, then write the answer as a pair.'),
};

export default function D38_07(props) { return <BuildLine data={DATA} {...props} />; }
