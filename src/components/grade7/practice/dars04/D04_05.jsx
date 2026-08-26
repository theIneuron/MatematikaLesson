// Dars04 · Amaliyot 05 — Ikki nuqtada tekshirish · 🟡 · chain · tag: id_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 5-o'rin.
// 3(x + 2) − x va 2x + 6 har doim teng.
//   x = 4:  chap tomon 3 · 6 − 4 = 14
//   x = 10: o'ng tomon 2 · 10 + 6 = 26 (chap tomon ham 3 · 12 − 10 = 26)
// Kartalarda takror qiymat yo'q: har uyaga o'z soni.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'id_chain', level: '🟡',
  eyebrow: L('Ikki nuqtada', 'В двух точках', 'At two points'),
  setup: L(
    "Har doim teng yozuvlar har qanday sonda bir xil qiymat beradi. Bir nuqtada chap tomonni, boshqasida o'ng tomonni hisoblab ko'ring.",
    'Тождественно равные записи дают одно значение при любом числе. Посчитай левую часть в одной точке, правую в другой.',
    'Identically equal records agree for every value. Work out the left side at one point and the right at another.'),
  given: [['3(x + 2) − x', 'va', '2x + 6']],
  givenLabel: L('Yozuvlar:', 'Записи:', 'Records:'),
  rows: [
    [{ t: ['3(4', '+', '2)', '−', '4', '='] }, { slot: 0 }],
    [{ t: ['2', '·', '10', '+', '6', '='] }, { slot: 1 }],
  ],
  cards: ['14', '26', '18', '20'],
  answer: ['14', '26'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 · 6 − 4 = 14, va x = 10 da 2 · 10 + 6 = 26. Chap tomon ham 3 · 12 − 10 = 26 beradi.",
    'Верно. 3 · 6 − 4 = 14, а при x = 10 выходит 2 · 10 + 6 = 26. Левая часть тоже даёт 3 · 12 − 10 = 26.',
    'Correct. 3 · 6 − 4 = 14, and at x = 10 we get 2 · 10 + 6 = 26. The left side also gives 3 · 12 − 10 = 26.'),
  wrongs: [
    { when: (s) => s.slots[0] === '18', text: L(
      "18 bu 3 · 6, ya'ni −4 hisobga olinmagan: 18 − 4 = 14.",
      '18 это 3 · 6, то есть не учтено −4: 18 − 4 = 14.',
      '18 is 3 · 6, ignoring the −4: 18 − 4 = 14.') },
    { when: (s) => s.slots[1] === '20', text: L(
      "20 bu faqat 2 · 10. Formulada yana +6 turibdi: 26.",
      '20 это только 2 · 10. В формуле есть ещё +6: 26.',
      '20 is only 2 · 10. The rule also has +6: 26.') },
  ],
  wrongText: L(
    "Har qatorda amallar tartibini kuzating: avval qavs va ko'paytirish, keyin qo'shish yoki ayirish.",
    'В каждой строке следи за порядком: сначала скобка и умножение, потом сложение или вычитание.',
    'Follow the order in each row: bracket and multiplication first, then add or subtract.'),
};

export default function D04_05(props) { return <SlotsBank data={DATA} {...props} />; }
