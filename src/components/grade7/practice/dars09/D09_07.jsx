// Dars09 · Amaliyot 07 — Ildizi ikkiga teng · 🔴 · tag: root_is_two
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Oltita tenglama, uchtasining ildizi 2 (tekshirilgan):
//   3x − 1 = 5       -> 3x = 6      -> x = 2    HA
//   2(x + 1) = 6     -> x + 1 = 3   -> x = 2    HA
//   5x = 10          -> x = 2                   HA
//   x + 2 = 2        -> x = 0                   yo'q
//   4 − x = 6        -> x = −2                  yo'q
//   3(x − 2) = 6     -> x − 2 = 2   -> x = 4    yo'q
// 4 − x = 6 va 3(x − 2) = 6 ATAYLAB: birinchisida noma'lum ayiriladi,
// ikkinchisida qavs ichidagi ayirish javobni ikki barobar uzoqlashtiradi.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'root_is_two', level: '🔴', col: 165, itemSize: 21,
  eyebrow: L('Ildizi ikki', 'Корень равен двум', 'The root is two'),
  setup: L(
    "Tenglamalar har xil ko'rinishda, lekin ba'zilarining ildizi bir xil. Har birini yechib tekshirish kerak.",
    'Уравнения разного вида, но у некоторых корень одинаковый. Каждое надо решить и проверить.',
    'The equations look different, yet some share a root. Each has to be solved and checked.'),
  ask: L("Ildizi 2 ga TENG hamma tenglamani belgilang.", 'Отметь все уравнения, корень которых равен 2.', 'Mark every equation whose root is 2.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['3x', '−', '1', '=', '5'], hit: true },
    { id: 'n1', tokens: ['x', '+', '2', '=', '2'], hit: false },
    { id: 'p2', tokens: ['2', '·', '(', 'x', '+', '1', ')', '=', '6'], hit: true },
    { id: 'n2', tokens: ['4', '−', 'x', '=', '6'], hit: false },
    { id: 'p3', tokens: ['5x', '=', '10'], hit: true },
    { id: 'n3', tokens: ['3', '·', '(', 'x', '−', '2', ')', '=', '6'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 3x = 6, x + 1 = 3 va 5x = 10 -- uchtasi ham x = 2 ga olib keladi.",
    'Верно. 3x = 6, x + 1 = 3 и 5x = 10 — все три ведут к x = 2.',
    'Correct. 3x = 6, x + 1 = 3 and 5x = 10 all lead to x = 2.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "3(x − 2) = 6 da ikki tomonni 3 ga bo'lsak x − 2 = 2, ya'ni x = 4. Qavs ichidagi ayirish ildizni ikki barobar uzoqlashtirdi.",
      'В 3(x − 2) = 6 после деления на 3 выходит x − 2 = 2, то есть x = 4. Вычитание в скобке отодвинуло корень.',
      'In 3(x − 2) = 6 dividing by 3 gives x − 2 = 2, so x = 4. The subtraction in the bracket moved the root further.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "4 − x = 6 da noma'lum AYIRILADI: x = 4 − 6 = −2. Ishora teskari chiqadi.",
      'В 4 − x = 6 неизвестное ВЫЧИТАЕТСЯ: x = 4 − 6 = −2. Знак выходит обратным.',
      'In 4 − x = 6 the unknown is SUBTRACTED: x = 4 − 6 = −2. The sign comes out the other way.') },
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "x + 2 = 2 da ildiz 0: 2 ni ikki tomondan olib tashlasak x = 0 qoladi.",
      'В x + 2 = 2 корень 0: если убрать 2 из обеих частей, останется x = 0.',
      'In x + 2 = 2 the root is 0: taking 2 from both sides leaves x = 0.') },
    { when: (s) => s.miss.indexOf('p2') !== -1, text: L(
      "2(x + 1) = 6 ni tekshirmadingiz: ikki tomonni 2 ga bo'lsak x + 1 = 3, ya'ni x = 2.",
      'Ты не проверил 2(x + 1) = 6: разделив обе части на 2, получаем x + 1 = 3, то есть x = 2.',
      'You did not check 2(x + 1) = 6: dividing both sides by 2 gives x + 1 = 3, so x = 2.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har tenglamaga 2 ni qo'yib ikki tomonni solishtiring.",
      'Одно пропустил: подставь 2 в каждое уравнение и сравни две части.',
      'One is missing: put 2 into each equation and compare the two sides.') },
  ],
  wrongText: L(
    "Har tenglamaga x = 2 ni qo'yib ko'ring: chap tomon o'ng tomonga teng chiqdimi?",
    'Подставь x = 2 в каждое уравнение: левая часть совпала с правой?',
    'Put x = 2 into each equation: did the left side match the right?'),
};

export default function D09_07(props) { return <MarkAll data={DATA} {...props} />; }
