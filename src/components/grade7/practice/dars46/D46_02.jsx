// Dars46 · Amaliyot 02 — Ikkinchi o'tkir burchak · 🟢 · chain · tag: rt_acute_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 2-o'rin `chain`.
// To'g'ri burchakli uchburchakda o'tkir burchaklar yig'indisi 90°: 35 -> 55. Eng katta tomon -- gipotenuza.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rt_acute_chain',
  level: '🟢',
  eyebrow: L(
    'Ikki qadam',
    'Два шага',
    'Two steps'),
  setup: L(
    "To'g'ri burchakli uchburchakda 90 gradus allaqachon olingan, ya'ni ikki o'tkir burchakka 90 gradus qoladi.",
    'В прямоугольном треугольнике 90 градусов уже занято, значит на два острых угла остаётся 90 градусов.',
    'A right triangle already spends 90 degrees, so the two acute angles share the remaining 90.'),
  given: [["o'tkir burchak = 35°"]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [{ t: ['ikkinchi', "o'tkir", 'burchak', '='] }, { slot: 0 }],
    [{ t: ['eng', 'katta', 'tomon', '--'] }, { slot: 1 }],
  ],
  cards: ['55°', 'gipotenuza', '145°', 'katet'],
  answer: ['55°', 'gipotenuza'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 90 − 35 = 55. To'g'ri burchak eng katta bo'lgani uchun eng katta tomon gipotenuza.",
    'Верно. 90 − 35 = 55. Прямой угол наибольший, поэтому наибольшая сторона это гипотенуза.',
    'Correct. 90 − 35 = 55. The right angle is the largest, so the hypotenuse is the largest side.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '145°',
      text: L(
        "145 chiqishi uchun 180 dan ayirilgan. Lekin 90 allaqachon band: o'tkir burchaklarga 90 qoladi.",
        'Чтобы вышло 145, вычли из 180. Но 90 уже занято: на острые остаётся 90.',
        '145 subtracts from 180, but 90 is already used: the acute angles share 90.'),
    },
    {
      when: (s) => s.slots[1] === 'katet',
      text: L(
        "Katet o'tkir burchak qarshisida: 35 va 55 gradus 90 dan kichik.",
        'Катет лежит против острого угла: 35 и 55 меньше 90.',
        'A leg faces an acute angle: 35 and 55 are below 90.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma uya to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    '90 dan berilgan burchakni ayiring, keyin eng katta burchakning qarshisiga qarang.',
    'Вычти данный угол из 90, потом посмотри против наибольшего угла.',
    'Subtract the given angle from 90, then look opposite the largest angle.'),
};

export default function D46_02(props) { return <SlotsBank data={DATA} {...props} />; }
