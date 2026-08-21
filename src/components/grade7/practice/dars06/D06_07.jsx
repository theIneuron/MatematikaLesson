// Dars06 · Amaliyot 07 — Qavsdan keyin yig'ish · 🔴 · tag: bracket_then_collect
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 4(x + 3) − 2x. Avval ko'paytuvchi qavs ichiga tarqaladi (3-dars), keyin
// o'xshash hadlar yig'iladi (bu dars):
//   4x + 12 − 2x  ->  harflilar: 4x − 2x = 2x,  son: 12
//   javob: 2x + 12
// Kartalar orasida 6x (ayirishni qo'shishga aylantirgan), 2 (harfni tashlab
// ketgan), +3 (qavs ichidagini ko'paytirmagan) va +15 (12 va 3 ni qo'shgan).
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'bracket_then_collect', level: '🔴',
  eyebrow: L("Qavsdan keyin yig'ish", 'Скобка, потом сбор', 'Bracket first, then collect'),
  setup: L(
    "Avval qavs oldidagi ko'paytuvchi ichidagi HAR hadga tarqaladi. Shundan keyingina o'xshash hadlar yig'iladi.",
    'Сначала множитель перед скобкой раздаётся КАЖДОМУ слагаемому внутри. Только после этого собираются подобные.',
    'First the factor before the bracket is handed to EVERY term inside. Only then are like terms collected.'),
  rows: [
    [{ t: ['4', '·', '(', 'x', '+', '3', ')', '−', '2x'] }],
    [{ t: ['='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['2x', '6x', '2', '+12', '+3', '+15'],
  answer: ['2x', '+12'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4 · x = 4x va 4 · 3 = 12. Keyin 4x − 2x = 2x, son esa 12 bo'lib qoladi: 2x + 12.",
    'Верно. 4 · x = 4x и 4 · 3 = 12. Затем 4x − 2x = 2x, а число остаётся 12: 2x + 12.',
    'Correct. 4 · x = 4x and 4 · 3 = 12. Then 4x − 2x = 2x, and the number stays 12: 2x + 12.'),
  wrongs: [
    { when: (s) => s.slots[0] === '6x', text: L(
      "2x ning oldida minus turibdi: 4x − 2x = 2x, qo'shilmaydi.",
      'Перед 2x стоит минус: 4x − 2x = 2x, а не складывается.',
      'The 2x has a minus before it: 4x − 2x = 2x, not added.') },
    { when: (s) => s.slots[1] === '+3', text: L(
      "Qavs ichidagi 3 ham 4 ga ko'paytiriladi: 4 · 3 = 12. Ko'paytuvchi ikki hadga ham tarqaladi.",
      'Тройка в скобке тоже умножается на 4: 4 · 3 = 12. Множитель раздаётся обоим слагаемым.',
      'The 3 in the bracket is multiplied by 4 as well: 4 · 3 = 12. The factor goes to both terms.') },
    { when: (s) => s.slots[0] === '2', text: L(
      "Harf yo'qolib qoldi: 4x − 2x = 2x, natijada harf saqlanadi.",
      'Буква потерялась: 4x − 2x = 2x, в результате буква остаётся.',
      'The letter got lost: 4x − 2x = 2x, the letter stays in the result.') },
    { when: (s) => s.slots[1] === '+15', text: L(
      "12 va 3 ni qo'shib bo'lmaydi: 3 allaqachon ko'paytirilib 12 ga aylangan.",
      'Нельзя складывать 12 и 3: тройка уже была умножена и стала 12.',
      'You cannot add 12 and 3: the 3 was already multiplied and became 12.') },
  ],
  wrongText: L(
    "Avval qavsni ochib yozib ko'ring: 4x + 12 − 2x. Keyin o'xshashlarini yig'ing.",
    'Сначала выпиши раскрытую скобку: 4x + 12 − 2x. Потом собери подобные.',
    'First write the bracket out: 4x + 12 − 2x. Then collect the like terms.'),
};

export default function D06_07(props) { return <SlotsBank data={DATA} {...props} />; }
