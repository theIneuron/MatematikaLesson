// Dars03 · Amaliyot 07 — Yaqin yumaloq son · 🔴 · tag: round_neighbour
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): ilgari 48 · 37 edi. Endi
// 98 · 4,7 -- yaqin yumaloq son yuz, ikkinchi ko'paytuvchi esa O'NLI KASR.
// Ya'ni xossa saqlanadi, hisob esa 7-sinf darajasida.
//
// 98 · 4,7 = (100 − 2) · 4,7 = 100 · 4,7 − 2 · 4,7 = 470 − 9,4 = 460,6
// Tekshirish: 98 · 4,7 = 460,6.
// Kartalar orasida 47 (vergulni yo'qotgan), 9,4 to'g'ri, 479,4 (qo'shgan) va
// 460,4 turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'round_neighbour', level: '🔴',
  eyebrow: L('Yaqin yumaloq son', 'Соседнее круглое', 'The round neighbour'),
  setup: L(
    "98 ni 100 − 2 deb olamiz. Yuzga ko'paytirish o'nli kasr bilan ham oson: vergul ikki xona o'ngga ko'chadi.",
    'Берём 98 как 100 − 2. Умножать на сто легко и с десятичной дробью: запятая уходит на два разряда вправо.',
    'We take 98 as 100 − 2. Multiplying by a hundred is easy even with a decimal: the comma moves two places right.'),
  rows: [
    [{ t: ['98', '·', '4,7', '=', '(', '100', '−', '2', ')', '·', '4,7'] }],
    [{ t: ['='] }, { slot: 0 }, { t: ['−'] }, { slot: 1 }, { t: ['='] }, { slot: 2 }],
  ],
  cards: ['470', '9,4', '460,6', '47', '4,7', '479,4'],
  answer: ['470', '9,4', '460,6'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 100 · 4,7 = 470 va 2 · 4,7 = 9,4. Ayirmasi 460,6, ya'ni 98 · 4,7 ning o'zi.",
    'Верно. 100 · 4,7 = 470 и 2 · 4,7 = 9,4. Разность 460,6 — это и есть 98 · 4,7.',
    'Correct. 100 · 4,7 = 470 and 2 · 4,7 = 9,4. The difference 460,6 is exactly 98 · 4,7.'),
  wrongs: [
    { when: (s) => s.slots[0] === '47', text: L(
      "Yuzga ko'paytirganda vergul IKKI xona o'ngga ko'chadi: 4,7 dan 470 chiqadi, 47 emas.",
      'При умножении на сто запятая уходит на ДВА разряда вправо: из 4,7 выходит 470, а не 47.',
      'Multiplying by a hundred moves the comma TWO places right: 4,7 becomes 470, not 47.') },
    { when: (s) => s.slots[1] === '4,7', text: L(
      "Ikkinchi bo'lakda 2 ga ko'paytirish bor: 2 · 4,7 = 9,4.",
      'Во второй части есть умножение на 2: 2 · 4,7 = 9,4.',
      'The second part has a multiplication by 2: 2 · 4,7 = 9,4.') },
    { when: (s) => s.slots[2] === '479,4', text: L(
      "98 bu 100 dan IKKI KAM, shuning uchun 9,4 ayiriladi, qo'shilmaydi: 470 − 9,4 = 460,6.",
      '98 это на ДВА МЕНЬШЕ ста, поэтому 9,4 вычитается, а не прибавляется: 470 − 9,4 = 460,6.',
      '98 is TWO LESS than a hundred, so 9,4 is subtracted, not added: 470 − 9,4 = 460,6.') },
  ],
  wrongText: L(
    "100 ni 4,7 ga ko'paytiring, keyin 2 ni 4,7 ga ko'paytiring va ikkinchisini birinchisidan ayiring.",
    'Умножь 100 на 4,7, потом 2 на 4,7 и вычти второе из первого.',
    'Multiply 100 by 4,7, then 2 by 4,7, and take the second from the first.'),
};

export default function D03_07(props) { return <SlotsBank data={DATA} {...props} />; }
