// Dars11 · Amaliyot 05 — Ikki barobar ko'p · 🟡 · tag: twice_as_many
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// «Alida x dona marka, Boburda ikki barobar ko'p, ikkovida 36 dona.»
// Mos tenglamalar (tekshirilgan, hammasining ildizi 12):
//   x + 2x = 36    HA
//   3x = 36        HA  (yig'ilgan ko'rinish)
//   36 − x = 2x    HA  (Boburning markasi = jamidan Alining markasi ayrilgani)
// Mos emas:
//   2x = 36        yo'q (faqat Boburning markasi)
//   x + 2 = 36     yo'q («ikki barobar» ni «ikkiga ko'p» deb o'qigan)
//   x · 2x = 36    yo'q (ko'paytirish o'rinsiz)
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'twice_as_many', level: '🟡', col: 155, itemSize: 21,
  eyebrow: L("Ikki barobar ko'p", 'В два раза больше', 'Twice as many'),
  setup: L(
    "Alida x dona marka bor, Boburda ikki barobar ko'p, ikkovida jami 36 dona. Bitta masalaning tenglamasi bir necha ko'rinishda yozilishi mumkin.",
    'У Али x марок, у Бобура в два раза больше, вместе у них 36. Уравнение одной задачи можно записать по-разному.',
    'Ali has x stamps, Bobur twice as many, together 36. The equation of one problem can be written in several ways.'),
  ask: L('Masalaga MOS hamma tenglamani belgilang.', 'Отметь все уравнения, которые ПОДХОДЯТ к задаче.', 'Mark every equation that MATCHES the problem.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['x', '+', '2x', '=', '36'], hit: true },
    { id: 'n1', tokens: ['2x', '=', '36'], hit: false },
    { id: 'p2', tokens: ['3x', '=', '36'], hit: true },
    { id: 'n2', tokens: ['x', '+', '2', '=', '36'], hit: false },
    { id: 'p3', tokens: ['36', '−', 'x', '=', '2x'], hit: true },
    { id: 'n3', tokens: ['x', '·', '2x', '=', '36'], hit: false },
  ],
  correctText: L(
    "To'g'ri. x + 2x va 3x -- bir xil narsa. 36 − x = 2x esa boshqa tomondan yozilgan: jamidan Alining markasi ayrilsa, Boburning markasi qoladi. Uchtasining ildizi 12.",
    'Верно. x + 2x и 3x — одно и то же. А 36 − x = 2x записано с другой стороны: если из общего вычесть марки Али, останутся марки Бобура. У всех трёх корень 12.',
    'Correct. x + 2x and 3x are the same. And 36 − x = 2x is written from the other side: the total minus Ali leaves Bobur. All three have root 12.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "«Ikki barobar ko'p» bu 2x, «ikkiga ko'p» esa x + 2. Masalada ko'paytirish haqida gap ketgan.",
      '«В два раза больше» это 2x, а «на два больше» это x + 2. В задаче речь про умножение.',
      '"Twice as many" is 2x, while "two more" is x + 2. The problem is about multiplication.') },
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "2x = 36 da faqat Boburning markasi hisobga olingan. Masalada esa IKKOVINING markasi 36 dona.",
      'В 2x = 36 учтены только марки Бобура. А в задаче 36 марок у ОБОИХ вместе.',
      'In 2x = 36 only Bobur is counted. The problem says 36 for BOTH together.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "x · 2x da markalar bir-biriga ko'paytirilgan. Ular esa QO'SHILADI: birida shuncha, ikkinchisida shuncha.",
      'В x · 2x марки перемножены. А их надо СЛОЖИТЬ: у одного столько, у другого столько.',
      'In x · 2x the stamps are multiplied. They should be ADDED: this many for one, that many for the other.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "36 − x = 2x ni tekshirmadingiz: chap tomonda Boburning markasi turadi. Bu ham o'sha masala.",
      'Ты не проверил 36 − x = 2x: слева стоят марки Бобура. Это то же самое условие.',
      'You did not check 36 − x = 2x: the left side is Bobur\'s stamps. It is the same condition.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har tenglamani yechib, ildizi 12 chiqadimi, tekshiring.",
      'Одно пропустил: реши каждое уравнение и проверь, выходит ли корень 12.',
      'One is missing: solve each equation and check whether the root is 12.') },
  ],
  wrongText: L(
    "Har tenglamani masalaga solishtiring: ikkovining markasi 36 bo'lishi kerak, Boburda esa ikki barobar ko'p.",
    'Сверяй каждое уравнение с задачей: у обоих вместе 36, а у Бобура в два раза больше.',
    'Compare each equation with the problem: 36 for both together, and Bobur has twice as many.'),
};

export default function D11_05(props) { return <MarkAll data={DATA} {...props} />; }
