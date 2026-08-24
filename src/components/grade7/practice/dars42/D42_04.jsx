// Dars42 · Amaliyot 04 — Qaysi alomat · 🟡 · build · tag: eq_which_sign
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin `build`.
// 5, 7 va orasidagi 40° -> ikki tomon va orasidagi burchak alomati. Xulosa: uchburchaklar teng.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_which_sign',
  level: '🟡',
  eyebrow: L(
    'Qaysi alomat',
    'Какой признак',
    'Which criterion'),
  setup: L(
    "Berilgan uchlikni o'qing: ikki tomon va ular ORASIDAGI burchak. Alomat nomini va xulosani yig'ing.",
    'Прочитай тройку: две стороны и угол МЕЖДУ ними. Собери название признака и вывод.',
    'Read the triple: two sides and the angle BETWEEN them. Build the criterion name and the conclusion.'),
  given: [['5', ',', '7', ',', 'orasidagi 40°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'ikki tomon va orasidagi burchak' },
    { id: 'b', label: 'uchburchaklar teng' },
    { id: 'c', label: 'uch burchak' },
    { id: 'd', label: "aniqlab bo'lmaydi" },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 52,
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
    "To'g'ri. Ikki tomon va ular orasidagi burchak mos ravishda teng bo'lsa, uchburchaklar teng.",
    'Верно. Если две стороны и угол между ними соответственно равны, треугольники равны.',
    'Correct. Two sides and the included angle being equal makes the triangles equal.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        'Uch burchak berilmagan: bu yerda ikki TOMON va bitta burchak bor.',
        'Три угла не даны: здесь две СТОРОНЫ и один угол.',
        'Three angles are not given: here we have two SIDES and one angle.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Uchlik to'liq: ikki tomon va orasidagi burchak yetadi.",
        'Тройка полная: двух сторон и угла между ними достаточно.',
        'The triple is complete: two sides and the included angle suffice.'),
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
    'Berilganda nechta tomon va nechta burchak bor? Burchak qayerda turibdi?',
    'Сколько в данных сторон и сколько углов? Где стоит угол?',
    'How many sides and angles are given? Where does the angle sit?'),
};

export default function D42_04(props) { return <BuildLine data={DATA} {...props} />; }
