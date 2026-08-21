// Dars36 · Amaliyot 06 — Grafikdan formula · 🟡 · build · tag: read_graph
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin.
// To'g'ri chiziq (0; −4) va (2; 0) dan o'tadi: b = −4, k = 2.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'read_graph', level: '🟡',
  eyebrow: L('Grafikdan o\'qish', 'Прочитать по графику', 'Read from the graph'),
  setup: L(
    "To'g'ri chiziq ikki nuqtada berilgan. Birinchisi y o'qini kesish nuqtasi, ikkinchisi x o'qini kesish nuqtasi.",
    'Прямая задана двумя точками. Первая это пересечение с осью y, вторая с осью x.',
    'The line is given by two points: the y intercept and the x intercept.'),
  given: [['(0;', '−4)'], ['(2;', '0)']],
  givenLabel: L('Nuqtalar:', 'Точки:', 'Points:'),
  cards: [
    { id: 'a', label: 'k = 2' },
    { id: 'b', label: 'b = −4' },
    { id: 'c', label: 'k = −2' },
    { id: 'd', label: 'b = 2' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("k va b ni toping", 'Найди k и b', 'Find k and b'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. b = −4, chunki x = 0 da y = −4. Ikki qadamda y −4 dan 0 ga o'sdi, ya'ni bir qadamda 2: k = 2.",
    'Верно. b = −4, потому что при x = 0 выходит y = −4. За два шага y вырос с −4 до 0, значит за шаг на 2: k = 2.',
    'Correct. b = −4 since y = −4 at x = 0. Over two steps y rose from −4 to 0, so 2 per step: k = 2.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "y o'sdi: −4 dan 0 ga. O'sish k ni musbat qiladi.",
      'Значение выросло: с −4 до 0. Рост делает k положительным.',
      'The value grew from −4 to 0. Growth makes k positive.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "b = 2 emas: 2 bu ikkinchi nuqtaning abssissasi. b esa x = 0 dagi qiymat, ya'ni −4.",
      'b не 2: двойка это абсцисса второй точки. А b это значение при x = 0, то есть −4.',
      'b is not 2: that is the second abscissa. b is the value at x = 0, which is −4.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki son kerak: k va b.",
      'Нужны два числа: k и b.',
      'Two numbers are needed: k and b.') },
  ],
  wrongText: L(
    "x = 0 dagi qiymat b ni beradi. Keyin x ikki oshganda y qancha o'sganini ikkiga bo'ling.",
    'Значение при x = 0 даёт b. Потом раздели прирост y на два шага x.',
    'The value at x = 0 gives b. Then divide the rise in y by the two steps in x.'),
};

export default function D36_06(props) { return <BuildLine data={DATA} {...props} />; }
