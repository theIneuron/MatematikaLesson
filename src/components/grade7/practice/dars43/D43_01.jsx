// Dars43 · Amaliyot 01 — Asosdagi ikkinchi burchak · 🟢 · build · tag: iso_base_equal
// Mexanika: kit.jsx -> BuildLine. Raskladka: 1-o'rin `build`.
// Asosdagi burchaklar teng: biri 50° bo'lsa ikkinchisi ham 50°. Burchaklar yig'indisi bu darsda ISHLATILMAYDI.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_base_equal',
  level: '🟢',
  eyebrow: L(
    'Asosdagi burchaklar',
    'Углы при основании',
    'Base angles'),
  setup: L(
    'Teng yonli uchburchakda asosdagi ikki burchak teng. Bu xossa tomonlar tengligidan chiqadi.',
    'В равнобедренном треугольнике два угла при основании равны. Это свойство идёт из равенства сторон.',
    'An isosceles triangle has equal base angles. The property follows from the equal sides.'),
  given: [[L('asosdagi burchak = 50°', 'угол при основании = 50°', 'base angle = 50°')]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [{ id: 'a', label: '50°' }, { id: 'b', label: '130°' }, { id: 'c', label: '40°' }],
  answerSeq: ['a'],
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
    "To'g'ri. Asosdagi burchaklar teng, ya'ni ikkinchisi ham 50 gradus.",
    'Верно. Углы при основании равны, значит второй тоже 50 градусов.',
    'Correct. The base angles are equal, so the second is 50 degrees too.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "130° bu 50 ning qo'shnisi. Asosdagi burchaklar esa bir-biriga TENG.",
        '130° это смежный к 50. А углы при основании РАВНЫ друг другу.',
        '130° is adjacent to 50. Base angles are EQUAL to each other.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "40° bu 90 − 50. Bu yerda hech narsa 90 ga to'ldirilmaydi.",
        '40° это 90 − 50. Здесь ничего не дополняется до 90.',
        '40° is 90 − 50. Nothing is completed to 90 here.'),
    },
    {
      when: (s) => s.seq.length < 1,
      text: L(
        'Bitta karta kerak.',
        'Нужна одна карточка.',
        'One card is needed.'),
    },
  ],
  wrongText: L(
    'Teng tomonlar qarshisida teng burchaklar yotadi.',
    'Против равных сторон лежат равные углы.',
    'Equal sides face equal angles.'),
};

export default function D43_01(props) { return <BuildLine data={DATA} {...props} />; }
