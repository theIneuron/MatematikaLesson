// Dars41 · Amaliyot 08 — Nom va uzun perimetr · 🔴 · build · tag: kind_long_p
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin `build`.
// 8, 8, 15 -- teng yonli, P = 31. Tuzoq: 24 (uch tomon 8 deb olingan).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'kind_long_p',
  level: '🔴',
  eyebrow: L(
    'Nom va perimetr',
    'Имя и периметр',
    'Name and perimeter'),
  setup: L(
    "Tomonlar yaqin, lekin teng emas. Ikki javob kerak: tomonlar bo'yicha nom va perimetr.",
    'Стороны близки, но не равны. Нужны два ответа: имя по сторонам и периметр.',
    'The sides are close but not equal. Two answers are needed: the side name and the perimeter.'),
  given: [['8, 8, 15']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'teng yonli' },
    { id: 'b', label: 'P = 31' },
    { id: 'c', label: 'har xil tomonli' },
    { id: 'd', label: 'P = 24' },
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
    "To'g'ri. 8 = 8, ya'ni teng yonli; 8 + 8 + 15 = 31.",
    'Верно. 8 = 8, значит равнобедренный; 8 + 8 + 15 = 31.',
    'Correct. 8 = 8 makes it isosceles; 8 + 8 + 15 = 31.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        'Har xil tomonlida uch tomon ham boshqa-boshqa. Bu yerda ikkitasi 8.',
        'У разностороннего все три стороны разные. Здесь две по 8.',
        'A scalene triangle has three different sides. Here two of them are 8.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "24 bu 8 · 3. Uchinchi tomon 15, ya'ni 8 + 8 + 15 = 31.",
        '24 это 8 · 3. Третья сторона 15, значит 8 + 8 + 15 = 31.',
        '24 is 8 · 3. The third side is 15, so 8 + 8 + 15 = 31.'),
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
    "Ikki bir xil son bor, uchinchisi boshqa. Perimetr uchtasining yig'indisi.",
    'Есть два одинаковых числа и третье другое. Периметр это сумма всех трёх.',
    'Two numbers match and the third differs. The perimeter adds all three.'),
};

export default function D41_08(props) { return <BuildLine data={DATA} {...props} />; }
