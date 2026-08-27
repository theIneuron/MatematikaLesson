// Dars18 · Amaliyot 02 — Ixchamlash, keyin qiymat · 🟢 · chain · tag: poly_chain
// Faqat MA'LUMOT. Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 2-o'rin.
//
// 1-qator: 6y² − 9y + 4y² = 10y² − 9y   (6 + 4 = 10, o'xshashlar yig'ildi)
// 2-qator: y = 1 bo'lganda qiymat = 1   (10 − 9), ya'ni 1-qator natijasi
// ikkinchisida ishlatiladi.
// Kartalar orasida 10y⁴ (ko'rsatkichni qo'shgan), −5y va 2 turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'poly_chain', level: '🟢',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Avval o'xshash hadlar ixchamlanadi, keyin topilgan yozuvga son qo'yiladi. Ikkinchi qator birinchisining natijasidan chiqadi.",
    'Сначала приводятся подобные члены, потом в полученную запись подставляется число. Вторая строка получается из результата первой.',
    'First the like terms are collected, then a number is substituted into the record. The second row follows from the first.'),
  rows: [
    [{ t: ['6y²', '−', '9y', '+', '4y²', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['y', '=', '1', '→'] }, { slot: 2 }],
  ],
  cards: ['10y²', '−9y', '1', '10y⁴', '−5y', '2'],
  answer: ['10y²', '−9y', '1'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6y² va 4y² o'xshash: 6 + 4 = 10. Keyin y = 1 bo'lganda 10 − 9 = 1.",
    'Верно. 6y² и 4y² подобны: 6 + 4 = 10. Потом при y = 1 выходит 10 − 9 = 1.',
    'Correct. 6y² and 4y² are alike: 6 + 4 = 10. Then with y = 1 it gives 10 − 9 = 1.'),
  wrongs: [
    { when: (s) => s.slots[0] === '10y⁴', text: L(
      "10y⁴ chiqishi uchun ko'rsatkichlar qo'shilgan. O'xshash hadlarda faqat koeffitsiyentlar qo'shiladi, harf o'sha holda qoladi.",
      'Чтобы вышло 10y⁴, сложили показатели. У подобных членов складываются только коэффициенты, буква остаётся той же.',
      'To get 10y⁴ the exponents were added. In like terms only the coefficients add; the letter stays.') },
    { when: (s) => s.slots[1] === '−5y', text: L(
      "−5y chiqishi uchun 9 dan 4 ayirilgan. Lekin 4y² ning harfi boshqa: u −9y bilan qo'shilmaydi.",
      'Чтобы вышло −5y, из 9 вычли 4. Но у 4y² другая буква: с −9y он не складывается.',
      'To get −5y the 4 was taken from 9. But 4y² has a different letter: it does not combine with −9y.') },
    { when: (s) => s.slots[2] === '2', text: L(
      "y = 1 bo'lganda 10y² = 10 va 9y = 9, ya'ni 10 − 9 = 1.",
      'При y = 1 выходит 10y² = 10 и 9y = 9, значит 10 − 9 = 1.',
      'With y = 1 you get 10y² = 10 and 9y = 9, so 10 − 9 = 1.') },
  ],
  wrongText: L(
    "Birinchi qatorda harfi bir xil hadlarni qo'shing, keyin ikkinchi qatorda y o'rniga bir qo'ying.",
    'В первой строке сложи члены с одинаковой буквой, потом во второй подставь вместо y единицу.',
    'In the first row add the terms with the same letter, then put one in place of y in the second.'),
};

export default function D18_02(props) { return <SlotsBank data={DATA} {...props} />; }
