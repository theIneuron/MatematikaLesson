// Dars20 · Amaliyot 10 — Zanjir: ochish, keyin qo'shish · 🔴 · chain · tag: mul_chain
// Faqat MA'LUMOT. Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 10-o'rin.
//
// 1-qator: 4p(3p² − 2p) = 12p³ − 8p²
// 2-qator: ... + 5p(p² + p) = 17p³ − 3p²
//   p³: 12 + 5 = 17        p²: −8 + 5 = −3
// Ikkinchi qator birinchisining natijasiga qo'shiladi, shuning uchun tuzoq
// karta −13p² (ayirgan) turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_chain', level: '🔴',
  eyebrow: L('Zanjir', 'Цепочка', 'A chain'),
  setup: L(
    "Birinchi qatorda qavs ochiladi, ikkinchisida ikkinchi ko'paytma QO'SHILADI. Ikki qavs orasida plyus turibdi, ya'ni ishoralar o'zgarmaydi.",
    'В первой строке раскрывается скобка, во второй второе произведение ПРИБАВЛЯЕТСЯ. Между скобками плюс, значит знаки не меняются.',
    'The first row opens the bracket, the second ADDS the next product. The brackets are joined by a plus, so no signs change.'),
  rows: [
    [{ t: ['4p', '(3p²', '−', '2p)', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['...', '+', '5p', '(p²', '+', 'p)', '='] }, { slot: 2 }, { slot: 3 }],
  ],
  cards: ['12p³', '−8p²', '17p³', '−3p²', '7p³', '−13p²'],
  answer: ['12p³', '−8p²', '17p³', '−3p²'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchi qator: 4p · 3p² = 12p³, 4p · 2p = 8p². Ikkinchisi: 5p · p² = 5p³ va 5p · p = 5p², ya'ni 12 + 5 = 17 va −8 + 5 = −3.",
    'Верно. Первая строка: 4p · 3p² = 12p³, 4p · 2p = 8p². Вторая: 5p · p² = 5p³ и 5p · p = 5p², значит 12 + 5 = 17 и −8 + 5 = −3.',
    'Correct. First row: 4p · 3p² = 12p³, 4p · 2p = 8p². Second: 5p · p² = 5p³ and 5p · p = 5p², so 12 + 5 = 17 and −8 + 5 = −3.'),
  wrongs: [
    { when: (s) => s.slots[3] === '−13p²', text: L(
      "−13p² chiqishi uchun 5p² ayirilgan. Ikki qavs orasida PLYUS turibdi: −8 + 5 = −3.",
      'Чтобы вышло −13p², 5p² вычли. Между скобками стоит ПЛЮС: −8 + 5 = −3.',
      'To get −13p² the 5p² was subtracted. The brackets are joined by a PLUS: −8 + 5 = −3.') },
    { when: (s) => s.slots[2] === '7p³', text: L(
      "7p³ chiqishi uchun 12 dan 5 ayirilgan. Ikkinchi ko'paytma qo'shiladi: 12 + 5 = 17.",
      'Чтобы вышло 7p³, из 12 вычли 5. Второе произведение прибавляется: 12 + 5 = 17.',
      'To get 7p³ the 5 was subtracted from 12. The second product is added: 12 + 5 = 17.') },
    { when: (s) => s.slots[0] === '17p³' || s.slots[1] === '−3p²', text: L(
      "Qatorlar almashib ketdi: birinchi qatorda faqat birinchi qavs ochiladi, ikkinchisida esa yig'indi chiqadi.",
      'Строки перепутались: в первой раскрывается только первая скобка, во второй выходит сумма.',
      'The rows got swapped: the first opens only the first bracket, the second gives the sum.') },
  ],
  wrongText: L(
    "Avval birinchi qavsni oching, keyin ikkinchi ko'paytmaning ikki hadini qo'shing.",
    'Сначала раскрой первую скобку, потом прибавь два члена второго произведения.',
    'Open the first bracket first, then add the two terms of the second product.'),
};

export default function D20_10(props) { return <SlotsBank data={DATA} {...props} />; }
