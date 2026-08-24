// Dars34 · Amaliyot 08 — Hisoblash tartibi · 🔴 · order · tag: fn_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin `order`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// f(x) = 2x² + 3x, f(−4): (−4)² = 16 -> 2 · 16 = 32 va 3 · (−4) = −12 -> 32 − 12 = 20.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_order',
  level: '🔴',
  eyebrow: L(
    'Hisoblash tartibi',
    'Порядок вычисления',
    'Order of computing'),
  setup: L(
    "Uch qadamni tartib bilan qo'ying: avval daraja, keyin ko'paytirish, oxirida qo'shish.",
    'Поставь три шага по порядку: сначала степень, потом умножение, в конце сложение.',
    'Place the three steps in order: power first, then multiplication, then addition.'),
  given: [['f(x) = 2x² + 3x', ',', 'x = −4']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '(−4)² = 16' },
    { id: 'b', label: '2 · 16 = 32 va 3 · (−4) = −12' },
    { id: 'c', label: '32 − 12 = 20' },
    { id: 'd', label: '2 · (−4) = −8' },
    { id: 'e', label: '−8 − 12 = −20' },
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
    "To'g'ri. Daraja avval hisoblanadi: 16. Keyin ko'paytmalar, oxirida qo'shish: 20.",
    'Верно. Сначала степень: 16. Потом произведения, в конце сложение: 20.',
    'Correct. The power comes first: 16. Then the products, then the sum: 20.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1,
      text: L(
        "2x² da avval x KVADRATGA ko'tariladi, keyin 2 ga ko'paytiriladi: (2x)² emas.",
        'В 2x² сначала x возводится в КВАДРАТ, потом умножается на 2: это не (2x)².',
        'In 2x² the x is SQUARED first and then doubled: it is not (2x)².'),
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
    "Daraja ko'paytirishdan oldin bajariladi.",
    'Степень выполняется раньше умножения.',
    'Powers come before multiplication.'),
};

export default function D34_08(props) { return <BuildLine data={DATA} {...props} />; }
