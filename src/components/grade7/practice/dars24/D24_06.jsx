// Dars24 · Amaliyot 06 — Bo'lish, keyin qiymat · 🟡 · chain · tag: div_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 6-o'rin.
// 1-qator: (32n⁵ − 20n³) : 4n² = 8n³ − 5n
// 2-qator: n = 1 bo'lganda 8 − 5 = 3
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'div_chain', level: '🟡',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Avval bo'linma topiladi, keyin unga son qo'yiladi. Ikkinchi qator birinchisining natijasidan chiqadi.",
    'Сначала находится частное, потом в него подставляется число. Вторая строка следует из результата первой.',
    'First the quotient, then a number is substituted into it. The second row follows from the first.'),
  rows: [
    [{ t: ['(32n⁵', '−', '20n³)', ':', '4n²', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['n', '=', '1', '→'] }, { slot: 2 }],
  ],
  cards: ['8n³', '−5n', '3', '8n⁷', '−5n⁵', '13'],
  answer: ['8n³', '−5n', '3'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 32 : 4 = 8 va 5 − 2 = 3; 20 : 4 = 5 va 3 − 2 = 1. n = 1 bo'lganda 8 − 5 = 3.",
    'Верно. 32 : 4 = 8 и 5 − 2 = 3; 20 : 4 = 5 и 3 − 2 = 1. При n = 1 выходит 8 − 5 = 3.',
    'Correct. 32 : 4 = 8 and 5 − 2 = 3; 20 : 4 = 5 and 3 − 2 = 1. With n = 1 it gives 8 − 5 = 3.'),
  wrongs: [
    { when: (s) => s.slots[0] === '8n⁷' || s.slots[1] === '−5n⁵', text: L(
      "Ko'rsatkichlar qo'shilgan. Bo'lishda ular ayiriladi: 5 − 2 = 3 va 3 − 2 = 1.",
      'Показатели сложили. При делении они вычитаются: 5 − 2 = 3 и 3 − 2 = 1.',
      'The exponents were added. Division subtracts them: 5 − 2 = 3 and 3 − 2 = 1.') },
    { when: (s) => s.slots[2] === '13', text: L(
      "13 chiqishi uchun 8 va 5 qo'shilgan. Bo'linmada ayirma turibdi: 8 − 5 = 3.",
      'Чтобы вышло 13, сложили 8 и 5. В частном стоит разность: 8 − 5 = 3.',
      'To get 13 the 8 and 5 were added. The quotient is a difference: 8 − 5 = 3.') },
  ],
  wrongText: L(
    "Birinchi qatorda bo'linmani toping, keyin n o'rniga bir qo'yib hisoblang.",
    'В первой строке найди частное, потом подставь вместо n единицу.',
    'Find the quotient in the first row, then put one in place of n.'),
};

export default function D24_06(props) { return <SlotsBank data={DATA} {...props} />; }
