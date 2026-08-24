// Dars33 · Amaliyot 05 — Kesma uzunligi · 🟡 · build · tag: point_distance
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// A(−5; 3) va B(11; 3): ordinatalar bir xil, ya'ni kesma gorizontal. AB = 11 − (−5) = 16.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_distance',
  level: '🟡',
  eyebrow: L(
    'Kesma uzunligi',
    'Длина отрезка',
    'Length of a segment'),
  setup: L(
    "Ikki nuqtaning ordinatasi bir xil, ya'ni kesma gorizontal. Uzunlik abssissalar ayirmasidan chiqadi -- ishoralarga diqqat.",
    'У двух точек одинаковая ордината, значит отрезок горизонтальный. Длина выходит из разности абсцисс — следи за знаками.',
    'Both points share the ordinate, so the segment is horizontal. Its length comes from the difference of abscissas.'),
  given: [['A(−5; 3)', ',', 'B(11; 3)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [{ id: 'a', label: 'AB = 16' }, { id: 'b', label: 'AB = 6' }, { id: 'c', label: 'AB = 55' }],
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
    "To'g'ri. 11 − (−5) = 16: noldan chapda 5, o'ngda 11.",
    'Верно. 11 − (−5) = 16: слева от нуля 5, справа 11.',
    'Correct. 11 − (−5) = 16: five units left of zero and eleven to the right.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "6 chiqishi uchun 11 − 5 hisoblangan, ya'ni minus tashlab ketilgan: 11 − (−5) = 16.",
        'Чтобы вышло 6, считали 11 − 5 и потеряли минус: 11 − (−5) = 16.',
        '6 comes from 11 − 5, dropping the minus: 11 − (−5) = 16.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "55 bu 11 · 5. Uzunlik ayirma bilan topiladi, ko'paytma bilan emas.",
        '55 это 11 · 5. Длина находится разностью, а не произведением.',
        '55 is 11 · 5. Length comes from a difference, not a product.'),
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
    "Nolgacha va noldan keyingi masofani qo'shing yoki abssissalar ayirmasini oling.",
    'Сложи расстояния до нуля и после него или возьми разность абсцисс.',
    'Add the distances either side of zero, or take the difference of abscissas.'),
};

export default function D33_05(props) { return <BuildLine data={DATA} {...props} />; }
