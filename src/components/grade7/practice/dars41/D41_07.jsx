// Dars41 · Amaliyot 07 — Perimetr formulasi · 🟡 · bracket · tag: kind_formula
// Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin `bracket`.
// Teng yonli uchburchak perimetri: P = 2a + b, a -- yon tomon, b -- asos.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'kind_formula',
  level: '🟡',
  eyebrow: L(
    'Formula',
    'Формула',
    'Formula'),
  setup: L(
    "Teng yonli uchburchakda ikki yon tomon teng, asos esa boshqa. Perimetr formulasini yig'ing.",
    'У равнобедренного две боковые равны, а основание другое. Собери формулу периметра.',
    'An isosceles triangle has two equal legs and a different base. Build the perimeter formula.'),
  given: [['a', '--', 'yon tomon', ',', 'b', '--', 'asos']],
  givenLabel: L(
    'Belgilash:',
    'Обозначения:',
    'Notation:'),
  cards: [
    { id: 'a', label: 'P =' },
    { id: 'b', label: '2a' },
    { id: 'c', label: '+ b' },
    { id: 'd', label: '2b' },
    { id: 'e', label: '+ a' },
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
    "To'g'ri. P = 2a + b: yon tomon ikki marta, asos bir marta.",
    'Верно. P = 2a + b: боковая дважды, основание один раз.',
    'Correct. P = 2a + b: the leg twice, the base once.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        '2b asos ikki marta degani. Ikki marta olinadigan tomon YON tomon.',
        '2b значит основание дважды. Дважды берётся БОКОВАЯ сторона.',
        '2b doubles the base. It is the LEG that appears twice.'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        "Bu yozuvda a ikki joyda chiqib qoladi. Formulada har tomon o'z sonicha turadi.",
        'В этой записи a попадает в два места. В формуле каждая сторона стоит столько раз, сколько её есть.',
        'This puts a in two places. Each side appears exactly as many times as it occurs.'),
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
    'Teng yonli uchburchakda nechta yon tomon va nechta asos bor?',
    'Сколько у равнобедренного боковых сторон и сколько оснований?',
    'How many legs and how many bases does an isosceles triangle have?'),
};

export default function D41_07(props) { return <BuildLine data={DATA} {...props} />; }
