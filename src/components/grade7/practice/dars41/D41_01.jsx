// Dars41 · Amaliyot 01 — Ikki nom · 🟢 · order · tag: kind_two_names
// Mexanika: kit.jsx -> BuildLine. Raskladka: 1-o'rin `order`.
// Bir uchburchak IKKI nom oladi: tomonlar bo'yicha va burchaklar bo'yicha. 5, 5, 8 -- teng yonli; katta burchagi 100° -- o'tmas burchakli.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'kind_two_names',
  level: '🟢',
  eyebrow: L(
    'Ikki nom',
    'Два имени',
    'Two names'),
  setup: L(
    "Uchburchak turi ikki xil aytiladi: TOMONLAR bo'yicha va BURCHAKLAR bo'yicha. Bu ikki nom bir-birini almashtirmaydi, ular birga aytiladi.",
    'Вид треугольника называют двумя способами: по СТОРОНАМ и по УГЛАМ. Эти имена не заменяют друг друга, они идут вместе.',
    'A triangle is named in two ways: by SIDES and by ANGLES. The names do not replace each other, they go together.'),
  given: [['5, 5, 8', ';', 'katta burchak 100°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'teng yonli' },
    { id: 'b', label: "o'tmas burchakli" },
    { id: 'c', label: 'teng tomonli' },
    { id: 'd', label: "o'tkir burchakli" },
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
    "To'g'ri. Ikki tomoni teng -- teng yonli; katta burchagi 90 dan katta -- o'tmas burchakli.",
    'Верно. Две стороны равны — равнобедренный; больший угол больше 90 — тупоугольный.',
    'Correct. Two equal sides make it isosceles; the largest angle above 90 makes it obtuse.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        'Teng tomonli uchburchakda UCH tomon teng. Bu yerda 8 boshqacha.',
        'У равностороннего равны ТРИ стороны. Здесь 8 отличается.',
        'An equilateral triangle has THREE equal sides. Here 8 differs.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "100° 90 dan katta, ya'ni burchak o'tmas. O'tkir burchakli uchburchakda hamma burchak 90 dan kichik.",
        '100° больше 90, значит угол тупой. У остроугольного все углы меньше 90.',
        '100° exceeds 90, so the angle is obtuse. An acute triangle keeps every angle below 90.'),
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
    'Avval tomonlarga qarang, keyin katta burchakka.',
    'Сначала посмотри на стороны, потом на больший угол.',
    'Look at the sides first, then at the largest angle.'),
};

export default function D41_01(props) { return <BuildLine data={DATA} {...props} />; }
