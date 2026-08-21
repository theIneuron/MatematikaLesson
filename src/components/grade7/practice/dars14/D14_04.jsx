// Dars14 · Amaliyot 04 — Qaysi tenglik to'g'ri · 🟡 · tag: props_true_eq
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Har xossaga bittadan to'g'ri va bittadan xato juftlik:
//   a⁵ · a² = a⁷    HA      a⁵ · a² = a¹⁰   yo'q (ko'paytirgan)
//   a⁸ : a² = a⁶    HA      a⁸ : a² = a⁴    yo'q (bo'lgan)
//   (a³)² = a⁶      HA      (a³)² = a⁵      yo'q (qo'shgan)
// Ya'ni uchta xossaning uchtasi ham sinaladi.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'props_true_eq', level: '🟡', col: 160, itemSize: 22,
  eyebrow: L('Tengliklar', 'Равенства', 'Equalities'),
  setup: L(
    "Uch xossa: ko'paytirishda qo'shiladi, bo'lishda ayiriladi, darajaning darajasida ko'paytiriladi.",
    'Три свойства: при умножении складываются, при делении вычитаются, при возведении в степень перемножаются.',
    'Three properties: exponents add when multiplying, subtract when dividing, multiply for a power of a power.'),
  ask: L("TO'G'RI hamma tenglikni belgilang.", 'Отметь все ВЕРНЫЕ равенства.', 'Mark every TRUE equality.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['a⁵', '·', 'a²', '=', 'a⁷'], hit: true },
    { id: 'n1', tokens: ['a⁵', '·', 'a²', '=', 'a¹⁰'], hit: false },
    { id: 'p2', tokens: ['a⁸', ':', 'a²', '=', 'a⁶'], hit: true },
    { id: 'n2', tokens: ['a⁸', ':', 'a²', '=', 'a⁴'], hit: false },
    { id: 'p3', tokens: ['(a³)²', '=', 'a⁶'], hit: true },
    { id: 'n3', tokens: ['(a³)²', '=', 'a⁵'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 5 + 2 = 7; 8 − 2 = 6; 3 · 2 = 6. Har amalda ko'rsatkichlar bilan boshqa ish qilinadi.",
    'Верно. 5 + 2 = 7; 8 − 2 = 6; 3 · 2 = 6. В каждом действии с показателями делают своё.',
    'Correct. 5 + 2 = 7; 8 − 2 = 6; 3 · 2 = 6. Each operation does something different to the exponents.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "a⁵ · a² = a¹⁰ da ko'rsatkichlar ko'paytirilgan. Ko'paytmada esa qo'shiladi: a⁷.",
      'В a⁵ · a² = a¹⁰ показатели перемножили. А в произведении они складываются: a⁷.',
      'In a⁵ · a² = a¹⁰ the exponents were multiplied. In a product they add: a⁷.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "a⁸ : a² = a⁴ da ko'rsatkichlar bo'lingan. Bo'lishda esa ayiriladi: 8 − 2 = 6.",
      'В a⁸ : a² = a⁴ показатели разделили. А при делении они вычитаются: 8 − 2 = 6.',
      'In a⁸ : a² = a⁴ the exponents were divided. In a division they subtract: 8 − 2 = 6.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "(a³)² = a⁵ da ko'rsatkichlar qo'shilgan. Darajaning darajasida esa ko'paytiriladi: 3 · 2 = 6.",
      'В (a³)² = a⁵ показатели сложили. А при возведении степени в степень они перемножаются: 3 · 2 = 6.',
      'In (a³)² = a⁵ the exponents were added. For a power of a power they multiply: 3 · 2 = 6.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har tenglikda amalga qarab ko'rsatkichlarni hisoblang.",
      'Одно пропустил: в каждом равенстве считай показатели по действию.',
      'One is missing: in each equality work out the exponents according to the operation.') },
  ],
  wrongText: L(
    "Amalga qarang: ko'paytirish -- qo'shish, bo'lish -- ayirish, daraja darajasi -- ko'paytirish.",
    'Смотри на действие: умножение — сложить, деление — вычесть, степень степени — перемножить.',
    'Look at the operation: multiplying means adding, dividing means subtracting, a power of a power means multiplying.'),
};

export default function D14_04(props) { return <MarkAll data={DATA} {...props} />; }
