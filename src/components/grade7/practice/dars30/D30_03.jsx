// Dars30 · Amaliyot 03 — Ikki qadam · 🟢 · chain · tag: whole_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 3-o'rin.
// 1-qator: 5(y − 3) + 2(y + 4) = 5y − 15 va +2y + 8
// 2-qator: ixchamlansa 7y − 7.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_chain', level: '🟢',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Birinchi qatorda ikki qavs ochiladi, ikkinchisida o'xshash hadlar yig'iladi. Ikki qavs oldida plyus turgani uchun ishoralar o'zgarmaydi.",
    'В первой строке раскрываются две скобки, во второй приводятся подобные. Перед скобками плюс, поэтому знаки не меняются.',
    'The first row opens both brackets, the second collects like terms. Both brackets have a plus, so no signs flip.'),
  rows: [
    [{ t: ['5(y', '−', '3)', '+', '2(y', '+', '4)', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['='] }, { slot: 2 }, { slot: 3 }],
  ],
  cards: ['5y − 15', '+2y + 8', '7y', '−7', '5y − 3', '+7'],
  answer: ['5y − 15', '+2y + 8', '7y', '−7'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5y + 2y = 7y, sonlar esa −15 + 8 = −7.",
    'Верно. 5y + 2y = 7y, а числа −15 + 8 = −7.',
    'Correct. 5y + 2y = 7y, and the numbers −15 + 8 = −7.'),
  wrongs: [
    { when: (s) => s.slots[0] === '5y − 3', text: L(
      "Ko'paytuvchi ikki hadga ham tegishli: 5 · 3 = 15, ya'ni 5y − 15.",
      'Множитель относится к обоим членам: 5 · 3 = 15, значит 5y − 15.',
      'The factor applies to both terms: 5 · 3 = 15, giving 5y − 15.') },
    { when: (s) => s.slots[3] === '+7', text: L(
      "Sonlarni ishorasi bilan qo'shing: −15 + 8 = −7, manfiy.",
      'Сложи числа со знаками: −15 + 8 = −7, отрицательное.',
      'Add the numbers with signs: −15 + 8 = −7, negative.') },
    { when: (s) => s.slots[1] === '7y' || s.slots[2] === '5y − 15', text: L(
      "Qatorlar almashib ketdi: birinchi qatorda qavslar ochiladi, ikkinchisida javob.",
      'Строки перепутались: в первой раскрываются скобки, во второй ответ.',
      'The rows got swapped: the first opens the brackets, the second holds the answer.') },
  ],
  wrongText: L(
    "Ko'paytuvchini qavs ichidagi HAR hadga ko'paytiring, keyin o'xshashlarni yig'ing.",
    'Умножь множитель на КАЖДЫЙ член скобки, потом приведи подобные.',
    'Multiply the factor by EVERY term inside, then collect like terms.'),
};

export default function D30_03(props) { return <SlotsBank data={DATA} {...props} />; }
