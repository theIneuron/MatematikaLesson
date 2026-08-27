// Dars23 · Amaliyot 04 — Guruhlash, keyin qavs · 🟡 · chain · tag: group_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 4-o'rin.
// 1-qator: 2a + 2b + ca + cb = 2(a + b) + c(a + b)
// 2-qator: = (a + b)(2 + c)
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'group_chain', level: '🟡',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Birinchi qadam -- har guruhdan umumiy ko'paytuvchini chiqarish. Ikkinchi qadam -- paydo bo'lgan bir xil qavsni chiqarish.",
    'Первый шаг — вынести общий множитель из каждой группы. Второй шаг — вынести появившуюся одинаковую скобку.',
    'Step one: take the common factor out of each group. Step two: take out the matching bracket that appears.'),
  rows: [
    [{ t: ['2a', '+', '2b', '+', 'ca', '+', 'cb', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['='] }, { slot: 2 }, { slot: 3 }],
  ],
  cards: ['2(a + b)', '+c(a + b)', '(a + b)', '(2 + c)', '2(a + c)', '(a + 2)'],
  answer: ['2(a + b)', '+c(a + b)', '(a + b)', '(2 + c)'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikki guruhda ham (a + b) chiqdi, oldidagi hadlar 2 va c: javob (a + b)(2 + c).",
    'Верно. В обеих группах вышло (a + b), перед ними стоят 2 и c: ответ (a + b)(2 + c).',
    'Correct. Both groups gave (a + b), with 2 and c in front: the answer is (a + b)(2 + c).'),
  wrongs: [
    { when: (s) => s.slots[0] === '2(a + c)', text: L(
      "Bu guruhlash 2a va ca ni birlashtiradi. Berilgan tartibda esa birinchi ikki hadda 2 umumiy: 2(a + b).",
      'Такая группировка объединяет 2a и ca. А в данном порядке в первых двух членах общий 2: 2(a + b).',
      'That grouping pairs 2a with ca. In the given order the first two share 2: 2(a + b).') },
    { when: (s) => s.slots[3] === '(a + 2)', text: L(
      "Ikkinchi qavsga QAVS OLDIDAGI hadlar yoziladi: 2 va c, ya'ni (2 + c).",
      'Во вторую скобку пишутся члены, стоявшие ПЕРЕД скобками: 2 и c, то есть (2 + c).',
      'The second bracket takes the terms that stood IN FRONT: 2 and c, giving (2 + c).') },
    { when: (s) => s.slots[2] === '(2 + c)', text: L(
      "Tartib boshqa: birinchi ko'paytuvchi umumiy qavs (a + b), ikkinchisi esa (2 + c).",
      'Порядок другой: первый множитель это общая скобка (a + b), а второй (2 + c).',
      'The order differs: the first factor is the common bracket (a + b), the second is (2 + c).') },
  ],
  wrongText: L(
    "Birinchi qatorda ikki guruhni ajratib oling, keyin ikkinchi qatorda umumiy qavsni chiqaring.",
    'В первой строке разложи две группы, потом во второй вынеси общую скобку.',
    'Split the two groups in the first row, then take out the common bracket in the second.'),
};

export default function D23_04(props) { return <SlotsBank data={DATA} {...props} />; }
