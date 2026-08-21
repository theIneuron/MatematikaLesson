// Dars15 · Amaliyot 05 — O'xshash bir hadlar · 🟡 · tag: like_monomials
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// 3a²b ga o'xshash bir hadlar -- HARFLI QISMI AYNAN bir xil bo'lganlar:
//   −5a²b  HA      a²b  HA (koeffitsiyenti 1)     7a²b  HA
//   3ab²   yo'q (ko'rsatkichlar joyi almashgan)
//   3a²    yo'q (b yo'q)
//   5a²b³  yo'q (b ning ko'rsatkichi boshqa)
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'like_monomials', level: '🟡', col: 130, itemSize: 23,
  eyebrow: L("O'xshash bir hadlar", 'Подобные одночлены', 'Like monomials'),
  setup: L(
    "O'xshash bir hadlarning harfli qismi AYNAN bir xil bo'ladi: harflar ham, ularning ko'rsatkichlari ham mos kelishi kerak. Koeffitsiyent esa har xil bo'lishi mumkin.",
    'У подобных одночленов буквенная часть СОВПАДАЕТ полностью: и буквы, и их показатели. А коэффициент может быть любым.',
    'Like monomials have exactly the same letter part: the letters and their exponents must match. The coefficient may differ.'),
  given: [['3a²b']],
  givenLabel: L('Berilgan bir had:', 'Данный одночлен:', 'The given monomial:'),
  ask: L("3a²b ga O'XSHASH hamma bir hadni belgilang.", 'Отметь все одночлены, ПОДОБНЫЕ 3a²b.', 'Mark every monomial LIKE 3a²b.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['−5a²b'], hit: true },
    { id: 'n1', tokens: ['3ab²'], hit: false },
    { id: 'p2', tokens: ['a²b'], hit: true },
    { id: 'n2', tokens: ['3a²'], hit: false },
    { id: 'p3', tokens: ['7a²b'], hit: true },
    { id: 'n3', tokens: ['5a²b³'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Uchtasining harfli qismi a²b: koeffitsiyent −5, 1 va 7 bo'lishi ahamiyatsiz.",
    'Верно. У всех трёх буквенная часть a²b: коэффициенты −5, 1 и 7 не имеют значения.',
    'Correct. All three have the letter part a²b: the coefficients −5, 1 and 7 do not matter.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "3ab² da ko'rsatkichlar joyi almashgan: a ning ko'rsatkichi 1, b ning ko'rsatkichi 2. Bu boshqa harfli qism.",
      'В 3ab² показатели переставлены: у a показатель 1, у b показатель 2. Это другая буквенная часть.',
      'In 3ab² the exponents are swapped: a has 1 and b has 2. That is a different letter part.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "3a² da b umuman yo'q. Harfli qism to'liq mos kelishi kerak.",
      'В 3a² буквы b нет вовсе. Буквенная часть должна совпадать полностью.',
      'In 3a² there is no b at all. The letter part must match completely.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "5a²b³ da b ning ko'rsatkichi 3, bizda esa 1. Ko'rsatkichlar ham mos kelishi kerak.",
      'В 5a²b³ у b показатель 3, а у нас 1. Показатели тоже должны совпадать.',
      'In 5a²b³ the b has exponent 3, ours has 1. The exponents must match too.') },
    { when: (s) => s.miss.indexOf('p2') !== -1, text: L(
      "a²b ni tekshirmadingiz: koeffitsiyenti yozilmagan, ya'ni u 1. Harfli qismi esa aynan mos.",
      'Ты не проверил a²b: коэффициент не написан, значит он равен 1. А буквенная часть совпадает.',
      'You did not check a²b: the coefficient is not written, so it is 1. The letter part matches exactly.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: koeffitsiyentga qaramang, faqat harflar va ko'rsatkichlarni solishtiring.",
      'Одну пропустил: не смотри на коэффициент, сравнивай только буквы и показатели.',
      'One is missing: ignore the coefficient and compare only the letters and exponents.') },
  ],
  wrongText: L(
    "Koeffitsiyentni yopib, faqat harfli qismni solishtiring: a²b ga aynan tengmi?",
    'Закрой коэффициент и сравни только буквенную часть: совпадает ли она с a²b?',
    'Cover the coefficient and compare only the letter part: is it exactly a²b?'),
};

export default function D15_05(props) { return <MarkAll data={DATA} {...props} />; }
