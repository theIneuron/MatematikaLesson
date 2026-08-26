// Dars41 · Amaliyot 03 — Uch teng tomon · 🟢 · build · tag: kind_three_equal
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin `build`.
// 7, 7, 7 -- teng tomonli va (60° bo'lgani uchun) o'tkir burchakli.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'kind_three_equal',
  level: '🟢',
  eyebrow: L(
    'Uch teng tomon',
    'Три равные стороны',
    'Three equal sides'),
  setup: L(
    "Uch tomoni ham teng. Bunday uchburchakning hamma burchagi 60 gradus. Ikki nomni yig'ing.",
    'Все три стороны равны. У такого треугольника все углы 60 градусов. Собери два имени.',
    'All three sides are equal, and such a triangle has all angles 60 degrees. Build both names.'),
  given: [['7, 7, 7']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: L('teng tomonli', 'равносторонний', 'equilateral') },
    { id: 'b', label: L("o'tkir burchakli", 'остроугольный', 'acute') },
    { id: 'c', label: L('teng yonli emas', 'не равнобедренный', 'not isosceles') },
    { id: 'd', label: L("to'g'ri burchakli", 'прямоугольный', 'right-angled') },
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
    "To'g'ri. Uch tomon teng -- teng tomonli; burchaklari 60 -- o'tkir burchakli.",
    'Верно. Три стороны равны — равносторонний; углы по 60 — остроугольный.',
    'Correct. Three equal sides make it equilateral; angles of 60 make it acute.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "Teng tomonli uchburchak teng yonli HAM bo'ladi: unda ikki teng tomon bor, hatto uchta.",
        'Равносторонний треугольник ТОЖЕ равнобедренный: у него есть две равные стороны, даже три.',
        'An equilateral triangle IS isosceles too: it has two equal sides, in fact three.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "To'g'ri burchak 90 gradus. Bu yerda burchaklar 60.",
        'Прямой угол это 90 градусов. Здесь углы по 60.',
        'A right angle is 90 degrees. Here the angles are 60.'),
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
    "Tomonlar bo'yicha nom va burchaklar bo'yicha nom -- ikkovi ham kerak.",
    'Нужны оба имени: по сторонам и по углам.',
    'Both names are needed: by sides and by angles.'),
};

export default function D41_03(props) { return <BuildLine data={DATA} {...props} />; }
