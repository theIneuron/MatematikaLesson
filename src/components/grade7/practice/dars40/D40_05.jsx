// Dars40 · Amaliyot 05 — Tenglamani yozish · 🟡 · bracket · tag: ang_equality
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin `bracket`.
// Qo'shni burchaklar 2x va x + 30: 2x + (x + 30) = 180. Tuzoq: = 90 va ayirma.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_equality',
  level: '🟡',
  eyebrow: L(
    'Tenglamani yozish',
    'Записать уравнение',
    'Write the equation'),
  setup: L(
    "Qo'shni burchaklarning yig'indisi 180 gradus. Ikkinchi burchak qavs bilan yoziladi, chunki u butunligicha qo'shiladi.",
    'Сумма смежных углов 180 градусов. Второй угол пишется в скобках, потому что складывается целиком.',
    'Adjacent angles add to 180 degrees. The second angle goes in brackets because it is added as a whole.'),
  given: [['2x', L('va', 'и', 'and'), 'x + 30']],
  givenLabel: L(
    "Qo'shni burchaklar:",
    'Смежные углы:',
    'Adjacent angles:'),
  cards: [
    { id: 'a', label: '2x' },
    { id: 'b', label: '+ (x + 30)' },
    { id: 'c', label: '= 180' },
    { id: 'd', label: '= 90' },
    { id: 'e', label: '− (x + 30)' },
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
    "To'g'ri. 2x + (x + 30) = 180. Bundan 3x + 30 = 180, ya'ni x = 50.",
    'Верно. 2x + (x + 30) = 180. Отсюда 3x + 30 = 180, значит x = 50.',
    'Correct. 2x + (x + 30) = 180. Hence 3x + 30 = 180 and x = 50.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "90 to'g'ri burchak. Qo'shni burchaklar esa to'g'ri chiziqni beradi: 180.",
        '90 это прямой угол. А смежные углы дают прямую: 180.',
        '90 is a right angle. Adjacent angles make a straight line: 180.'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        "Burchaklar qo'shiladi, ayirilmaydi: ular birga to'g'ri chiziqni to'ldiradi.",
        'Углы складываются, а не вычитаются: вместе они дополняют до прямой.',
        'The angles are added, not subtracted: together they complete a straight line.'),
    },
    {
      when: (s) => s.seq.length < 3,
      text: L(
        "Uch bo'lak kerak: birinchi burchak, ikkinchi burchak, tenglikning o'ng tomoni.",
        'Нужны три части: первый угол, второй угол, правая часть равенства.',
        'Three parts are needed: the first angle, the second angle, the right side.'),
    },
  ],
  wrongText: L(
    "Ikki burchakni qo'shing va yig'indini 180 ga tenglashtiring.",
    'Сложи два угла и приравняй сумму к 180.',
    'Add the two angles and set the sum equal to 180.'),
};

export default function D40_05(props) { return <BuildLine data={DATA} {...props} />; }
