// Dars21 · Amaliyot 04 — Ochish, keyin ixchamlash · 🟡 · chain · tag: product_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 4-o'rin.
// (y + 6)(y − 4) = y² − 4y + 6y − 24 = y² + 2y − 24.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'product_chain', level: '🟡',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Birinchi qatorda to'rt ko'paytma yoziladi, ikkinchisida o'rtadagi ikki had ixchamlanadi. Ikkinchi had manfiy bo'lgani uchun ishoralarga qarash kerak.",
    'В первой строке пишутся четыре произведения, во второй приводятся два средних члена. Второй член отрицательный, поэтому следи за знаками.',
    'The first row writes the four products, the second collects the two middle terms. The second term is negative, so watch the signs.'),
  rows: [
    [{ t: ['(y', '+', '6)', '(y', '−', '4)', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['y²', '−', '4y', '+', '6y', '−', '24', '='] }, { slot: 2 }, { slot: 3 }],
  ],
  cards: ['y² − 4y', '+6y − 24', 'y²', '+2y − 24', 'y² + 4y', '+10y − 24'],
  answer: ['y² − 4y', '+6y − 24', 'y²', '+2y − 24'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. y · (−4) = −4y va 6 · y = +6y, ya'ni −4y + 6y = +2y. Ozod had 6 · (−4) = −24.",
    'Верно. y · (−4) = −4y и 6 · y = +6y, значит −4y + 6y = +2y. Свободный член 6 · (−4) = −24.',
    'Correct. y · (−4) = −4y and 6 · y = +6y, so −4y + 6y = +2y. The free term is 6 · (−4) = −24.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'y² + 4y', text: L(
      "Ikkinchi qavsda −4 turibdi: y · (−4) = −4y, musbat emas.",
      'Во второй скобке стоит −4: y · (−4) = −4y, а не плюс.',
      'The second bracket has −4: y · (−4) = −4y, not positive.') },
    { when: (s) => s.slots[3] === '+10y − 24', text: L(
      "+10y chiqishi uchun 4y va 6y qo'shilgan. Birinchisi MANFIY: −4y + 6y = +2y.",
      'Чтобы вышло +10y, сложили 4y и 6y. Первое ОТРИЦАТЕЛЬНО: −4y + 6y = +2y.',
      'To get +10y the 4y and 6y were added. The first is NEGATIVE: −4y + 6y = +2y.') },
    { when: (s) => s.slots[1] === '+2y − 24' || s.slots[2] === 'y² − 4y', text: L(
      "Qatorlar almashib ketdi: birinchi qatorda ko'paytmalar, ikkinchisida ixchamlangan javob.",
      'Строки перепутались: в первой произведения, во второй приведённый ответ.',
      'The rows got swapped: the first holds the products, the second the collected answer.') },
  ],
  wrongText: L(
    "O'rtadagi ikki hadni ishorasi bilan qo'shing: −4y va +6y.",
    'Сложи два средних члена со знаками: −4y и +6y.',
    'Add the two middle terms with their signs: −4y and +6y.'),
};

export default function D21_04(props) { return <SlotsBank data={DATA} {...props} />; }
