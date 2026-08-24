// Dars48 · Amaliyot 05 — To'g'ri burchakli va teng yonli · 🟡 · order · tag: rev_rt_iso
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin `order`.
// To'g'ri burchakli teng yonli uchburchak: 180 − 90 = 90 -> 90 : 2 = 45. O'tkir burchaklar 45° va 45°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'rev_rt_iso',
  level: '🟡',
  eyebrow: L(
    'Uch qadam',
    'Три шага',
    'Three steps'),
  setup: L(
    "Uchburchak ham to'g'ri burchakli, ham teng yonli. O'tkir burchaklarni uch qadamda toping.",
    'Треугольник и прямоугольный, и равнобедренный. Найди острые углы в три шага.',
    'The triangle is both right-angled and isosceles. Find the acute angles in three steps.'),
  given: [["to'g'ri burchakli", ',', 'teng yonli']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '180 − 90 = 90' },
    { id: 'b', label: '90 : 2 = 45' },
    { id: 'c', label: "o'tkir burchaklar 45°" },
    { id: 'd', label: '180 : 2 = 90' },
    { id: 'e', label: "o'tkir burchaklar 90°" },
  ],
  answerSeq: ['a', 'b', 'c'],
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
    "To'g'ri. To'g'ri burchak 90 ni oladi, qolgan 90 esa teng ikki burchakka bo'linadi: 45 va 45.",
    'Верно. Прямой угол забирает 90, а остальные 90 делятся на два равных: 45 и 45.',
    'Correct. The right angle takes 90 and the remaining 90 splits into 45 and 45.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1,
      text: L(
        "90 gradusli o'tkir burchak bo'lmaydi: o'tkir burchak 90 dan kichik.",
        'Острого угла в 90 градусов не бывает: острый меньше 90.',
        'A 90 degree acute angle cannot exist: acute means below 90.'),
    },
    {
      when: (s) => s.seq.length < 3,
      text: L(
        'Uch karta kerak.',
        'Нужны три карточки.',
        'Three cards are needed.'),
    },
  ],
  wrongText: L(
    "Avval to'g'ri burchakni 180 dan ayiring, keyin qolganini teng ikkiga bo'ling.",
    'Сначала вычти прямой угол из 180, потом раздели остаток на два.',
    'Subtract the right angle from 180 first, then halve the remainder.'),
};

export default function D48_05(props) { return <BuildLine data={DATA} {...props} />; }
