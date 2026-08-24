// Dars34 · Amaliyot 03 — Manfiy sonni qo'yish · 🟢 · bracket · tag: fn_substitute
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin `bracket`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// f(x) = 3x + 1, f(−5) = 3 · (−5) + 1 = −14. Qavs shart: manfiy son ko'paytiriladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_substitute',
  level: '🟢',
  eyebrow: L(
    "Qo'yish yozuvi",
    'Запись подстановки',
    'The substitution'),
  setup: L(
    "Manfiy son x o'rniga QAVS bilan qo'yiladi, aks holda ishora yo'qoladi. Yozuvni yig'ing.",
    'Отрицательное число подставляется вместо x В СКОБКАХ, иначе теряется знак. Собери запись.',
    'A negative number replaces x IN BRACKETS, otherwise the sign is lost. Build the record.'),
  given: [['f(x) = 3x + 1', ',', 'x = −5']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '3 · (−5)' },
    { id: 'b', label: '+ 1' },
    { id: 'c', label: '3 · 5' },
    { id: 'd', label: '− 1' },
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
    "To'g'ri. 3 · (−5) + 1 = −15 + 1 = −14.",
    'Верно. 3 · (−5) + 1 = −15 + 1 = −14.',
    'Correct. 3 · (−5) + 1 = −15 + 1 = −14.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "Ishora yo'qolgan: x = −5, ya'ni 3 · (−5).",
        'Потерян знак: x = −5, значит 3 · (−5).',
        'The sign is gone: x = −5 means 3 · (−5).'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Formulada +1 turibdi. Qo'shiluvchining ishorasi x bilan almashmaydi.",
        'В формуле стоит +1. Знак слагаемого не меняется вместе с x.',
        'The formula has +1. The constant does not flip with x.'),
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
    'Manfiy sonni qavsda yozing va formuladagi ishorani saqlang.',
    'Запиши отрицательное число в скобках и сохрани знак из формулы.',
    'Put the negative number in brackets and keep the sign from the formula.'),
};

export default function D34_03(props) { return <BuildLine data={DATA} {...props} />; }
