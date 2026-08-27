// Dars18 · Amaliyot 02 — Ixchamlash, keyin qiymat · 🟢 · chain · tag: poly_chain
// Faqat MA'LUMOT. Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 2-o'rin.
//
// 1-qator: 6y² − 9y + 4y² = 10y² − 9y   (6 + 4 = 10, o'xshashlar yig'ildi)
// 2-qator: y = 2 bo'lganda qiymat 40 − 18 = 22. TEKSHIRUV: qiymat shartdagi
// biror son bilan mos kelmasin, aks holda javob yozuvdan ko'chiriladi
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
    [{ t: ['y', '=', '2', '→'] }, { slot: 2 }],
  ],
  cards: ['10y²', '−9y', '22', '10y⁴', '−5y', '4'],
  answer: ['10y²', '−9y', '22'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6y² va 4y² o'xshash: 6 + 4 = 10. Keyin y = 2 bo'lganda 40 − 18 = 22.",
    'Верно. 6y² и 4y² подобны: 6 + 4 = 10. Потом при y = 2 выходит 40 − 18 = 22.',
    'Correct. 6y² and 4y² are alike: 6 + 4 = 10. Then with y = 2 it gives 40 − 18 = 22.'),
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
      "y = 2 bo'lganda 10y² = 40 va 9y = 18, ya'ni 40 − 18 = 22.",
      'При y = 2 выходит 10y² = 40 и 9y = 18, значит 40 − 18 = 22.',
      'With y = 2 you get 10y² = 40 and 9y = 18, so 40 − 18 = 22.') },
  ],
  wrongText: L(
    "Birinchi qatorda harfi bir xil hadlarni qo'shing, keyin ikkinchi qatorda y o'rniga bir qo'ying.",
    'В первой строке сложи члены с одинаковой буквой, потом во второй подставь вместо y единицу.',
    'In the first row add the terms with the same letter, then put one in place of y in the second.'),
};

export default function D18_02(props) { return <SlotsBank data={DATA} {...props} />; }
