// Dars39 · Amaliyot 03 — Borish va qaytish · 🟢 · build · tag: comb_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// 5 borish yo'li va 6 qaytish yo'li: 5 · 6 = 30.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_build',
  level: '🟢',
  eyebrow: L(
    'Borish va qaytish',
    'Туда и обратно',
    'There and back'),
  setup: L(
    "Bolaning borish yo'li beshta, qaytish yo'li esa oltita. Sayohat ikki qismdan iborat, ya'ni tanlovlar ketma-ket.",
    'Способов доехать пять, вернуться шесть. Поездка состоит из двух частей, значит выборы идут подряд.',
    'Five ways there and six back. The trip has two parts, so the choices come in sequence.'),
  given: [['5', L('va', 'и', 'and'), '6']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [{ id: 'a', label: '30' }, { id: 'b', label: '11' }, { id: 'c', label: '36' }],
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
    "To'g'ri. 5 · 6 = 30: har borish yo'liga oltita qaytish yo'li mos keladi.",
    'Верно. 5 · 6 = 30: каждому пути туда отвечают шесть путей обратно.',
    'Correct. 5 · 6 = 30: each way there pairs with six ways back.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "11 bu 5 + 6. Bu yerda ikki tanlov KETMA-KET, ya'ni ko'paytiriladi.",
        '11 это 5 + 6. Здесь два выбора ПОДРЯД, значит умножаем.',
        '11 is 5 + 6. Here two choices happen in SEQUENCE, so multiply.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "36 bu 6 · 6. Borish yo'li beshta.",
        '36 это 6 · 6. Путей туда пять.',
        '36 is 6 · 6. There are five ways there.'),
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
    'Ikki bosqich ketma-ket bajariladi.',
    'Два этапа выполняются подряд.',
    'Two stages happen one after the other.'),
};

export default function D39_03(props) { return <BuildLine data={DATA} {...props} />; }
