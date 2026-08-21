// Dars04 · Amaliyot 07 — Ikkita uya · 🟡 · slots · tag: id_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin.
// 6(2x − 5) = 12x − 30.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'id_slots', level: '🟡',
  eyebrow: L('Ikki had', 'Два члена', 'Two terms'),
  setup: L(
    "Ko'paytuvchi qavs ichidagi ikki hadga ham tegishli. Ikkinchi hadning minusi javobda saqlanadi.",
    'Множитель относится к обоим членам скобки. Минус второго члена сохраняется в ответе.',
    'The factor applies to both terms. The minus of the second term stays in the answer.'),
  rows: [
    [{ t: ['6(2x', '−', '5)', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['12x', '−30', '−5', '8x', '+30', '12'],
  answer: ['12x', '−30'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6 · 2x = 12x va 6 · 5 = 30, ishorasi minus: 12x − 30.",
    'Верно. 6 · 2x = 12x и 6 · 5 = 30, со знаком минус: 12x − 30.',
    'Correct. 6 · 2x = 12x and 6 · 5 = 30 with a minus: 12x − 30.'),
  wrongs: [
    { when: (s) => s.slots[1] === '−5', text: L(
      "−5 ko'paytirilmagan: 6 · 5 = 30.",
      '−5 не умножено: 6 · 5 = 30.',
      '−5 was not multiplied: 6 · 5 = 30.') },
    { when: (s) => s.slots[1] === '+30', text: L(
      "Ishora saqlanadi: qavsda −5 turgan, ya'ni javobda −30.",
      'Знак сохраняется: в скобке стоит −5, значит в ответе −30.',
      'The sign carries over: the bracket has −5, so the answer has −30.') },
    { when: (s) => s.slots[0] === '8x', text: L(
      "8x chiqishi uchun 6 va 2 qo'shilgan. Koeffitsiyentlar ko'paytiriladi: 6 · 2 = 12.",
      'Чтобы вышло 8x, сложили 6 и 2. Коэффициенты перемножаются: 6 · 2 = 12.',
      'To get 8x the 6 and 2 were added. Coefficients multiply: 6 · 2 = 12.') },
    { when: (s) => s.slots[0] === '12', text: L(
      "12 da harf yo'qolgan: 6 · 2x = 12x.",
      'В 12 потерялась буква: 6 · 2x = 12x.',
      'The 12 lost its letter: 6 · 2x = 12x.') },
  ],
  wrongText: L(
    "6 ni ikki hadga alohida ko'paytiring va ishoralarni saqlang.",
    'Умножь 6 на каждый член по отдельности, сохраняя знаки.',
    'Multiply 6 by each term separately, keeping the signs.'),
};

export default function D04_07(props) { return <SlotsBank data={DATA} {...props} />; }
