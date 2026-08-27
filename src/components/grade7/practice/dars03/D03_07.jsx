// Dars03 · Amaliyot 07 — Yaqin yumaloq son · 🔴 · tag: round_neighbour
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): ilgari 48 · 37 edi. Endi
// 998 · 4,7 -- yaqin yumaloq son ming, ikkinchi ko'paytuvchi esa O'NLI KASR.
// Ya'ni xossa saqlanadi, hisob esa 7-sinf darajasida.
//
// 998 · 4,7 = (1000 − 2) · 4,7 = 1000 · 4,7 − 2 · 4,7 = 4700 − 9,4 = 4690,6
// Tekshirish: 998 · 4,7 = 4690,6.
// Kartalar orasida 470 (bir xona kam) va 4709,4 (ayirish o'rniga qo'shgan)
// turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'round_neighbour', level: '🔴',
  eyebrow: L('Yaqin yumaloq son', 'Соседнее круглое', 'The round neighbour'),
  setup: L(
    "998 ni 1000 − 2 deb olamiz. Mingga ko'paytirish o'nli kasr bilan ham oson: vergul uch xona o'ngga ko'chadi.",
    'Берём 998 как 1000 − 2. Умножать на тысячу легко и с десятичной дробью: запятая уходит на три разряда вправо.',
    'We take 998 as 1000 − 2. Multiplying by a thousand is easy even with a decimal: the comma moves three places right.'),
  rows: [
    [{ t: ['998', '·', '4,7', '=', '(', '1000', '−', '2', ')', '·', '4,7'] }],
    [{ t: ['='] }, { slot: 0 }, { t: ['−'] }, { slot: 1 }, { t: ['='] }, { slot: 2 }],
  ],
  cards: ['4700', '9,4', '4690,6', '470', '4,7', '4709,4'],
  answer: ['4700', '9,4', '4690,6'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 1000 · 4,7 = 4700 va 2 · 4,7 = 9,4. Ayirmasi 4690,6, ya'ni 998 · 4,7 ning o'zi.",
    'Верно. 1000 · 4,7 = 4700 и 2 · 4,7 = 9,4. Разность 4690,6 — это и есть 998 · 4,7.',
    'Correct. 1000 · 4,7 = 4700 and 2 · 4,7 = 9,4. The difference 4690,6 is exactly 998 · 4,7.'),
  wrongs: [
    { when: (s) => s.slots[0] === '470', text: L(
      "Mingga ko'paytirganda vergul UCH xona o'ngga ko'chadi: 4,7 dan 4700 chiqadi, 470 emas.",
      'При умножении на тысячу запятая уходит на ТРИ разряда вправо: из 4,7 выходит 4700, а не 470.',
      'Multiplying by a thousand moves the comma THREE places right: 4,7 becomes 4700, not 470.') },
    { when: (s) => s.slots[1] === '4,7', text: L(
      "Ikkinchi bo'lakda 2 ga ko'paytirish bor: 2 · 4,7 = 9,4.",
      'Во второй части есть умножение на 2: 2 · 4,7 = 9,4.',
      'The second part has a multiplication by 2: 2 · 4,7 = 9,4.') },
    { when: (s) => s.slots[2] === '4709,4', text: L(
      "998 bu 1000 dan IKKI KAM, shuning uchun 9,4 ayiriladi, qo'shilmaydi: 4700 − 9,4 = 4690,6.",
      '998 это на ДВА МЕНЬШЕ тысячи, поэтому 9,4 вычитается, а не прибавляется: 4700 − 9,4 = 4690,6.',
      '998 is TWO LESS than a thousand, so 9,4 is subtracted, not added: 4700 − 9,4 = 4690,6.') },
  ],
  wrongText: L(
    "1000 ni 4,7 ga ko'paytiring, keyin 2 ni 4,7 ga ko'paytiring va ikkinchisini birinchisidan ayiring.",
    'Умножь 1000 на 4,7, потом 2 на 4,7 и вычти второе из первого.',
    'Multiply 1000 by 4,7, then 2 by 4,7, and take the second from the first.'),
};

export default function D03_07(props) { return <SlotsBank data={DATA} {...props} />; }
