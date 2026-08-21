// Dars16 · Amaliyot 09 — Ko'paytmaning darajasi · 🔴 · tag: product_degree
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 9a³b² · 4ab⁴ = 36a⁴b⁶. Bir hadning DARAJASI -- harflar ko'rsatkichlarining
// yig'indisi: 4 + 6 = 10.
// Xato javoblar: 6 (faqat b), 4 (faqat a), 36 (koeffitsiyentni yozgan),
// 5 (ko'paytuvchilarning darajasini qo'shmagan: 3 + 2 = 5).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'product_degree', level: '🔴', allowNeg: false, target: 10,
  eyebrow: L('Daraja', 'Степень', 'The degree'),
  setup: L(
    "Bir hadning darajasi -- uning harflari ko'rsatkichlarining yig'indisi. Ya'ni avval ko'paytma topiladi, keyin ko'rsatkichlar qo'shiladi.",
    'Степень одночлена — это сумма показателей его букв. То есть сначала находится произведение, потом складываются показатели.',
    "The degree of a monomial is the sum of its letters' exponents. So find the product first, then add the exponents."),
  expr: ['9a³b²', '·', '4ab⁴'], exprSize: 32,
  label: L("Ko'paytmaning darajasini yozing:", 'Запиши степень произведения:', 'Write the degree of the product:'),
  correctText: L(
    "To'g'ri. Ko'paytma 36a⁴b⁶: a da 3 + 1 = 4, b da 2 + 4 = 6. Daraja esa 4 + 6 = 10.",
    'Верно. Произведение 36a⁴b⁶: у a 3 + 1 = 4, у b 2 + 4 = 6. А степень 4 + 6 = 10.',
    'Correct. The product is 36a⁴b⁶: for a 3 + 1 = 4, for b 2 + 4 = 6. The degree is 4 + 6 = 10.'),
  wrongs: [
    { when: (s) => s.value === 6, text: L(
      "6 bu faqat b ning ko'rsatkichi. Daraja ikki harfning ko'rsatkichini birga oladi: 4 + 6.",
      '6 это только показатель b. Степень берёт показатели обеих букв вместе: 4 + 6.',
      '6 is only the exponent of b. The degree takes both letters together: 4 + 6.') },
    { when: (s) => s.value === 4, text: L(
      "4 bu faqat a ning ko'rsatkichi. b ham hisobga olinadi: 4 + 6 = 10.",
      '4 это только показатель a. b тоже учитывается: 4 + 6 = 10.',
      '4 is only the exponent of a. b counts too: 4 + 6 = 10.') },
    { when: (s) => s.value === 36, text: L(
      "36 bu koeffitsiyent. Daraja sonlarga emas, harf ko'rsatkichlariga qarab aytiladi.",
      '36 это коэффициент. Степень определяется не числами, а показателями букв.',
      '36 is the coefficient. The degree is decided by the exponents of the letters, not by numbers.') },
    { when: (s) => s.value === 5, text: L(
      "5 bu birinchi hadning darajasi: 3 + 2. Ikkinchi had ham qo'shiladi: uning darajasi 1 + 4 = 5.",
      '5 это степень первого одночлена: 3 + 2. Второй тоже участвует: его степень 1 + 4 = 5.',
      '5 is the degree of the first monomial: 3 + 2. The second joins in too: its degree is 1 + 4 = 5.') },
  ],
  wrongText: L(
    "Avval ko'paytmani yozing, keyin uning harflari ko'rsatkichlarini qo'shing.",
    'Сначала запиши произведение, потом сложи показатели его букв.',
    'Write the product first, then add the exponents of its letters.'),
};

export default function D16_09(props) { return <TypeValue data={DATA} {...props} />; }
