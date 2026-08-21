// Dars28 · Amaliyot 01 — Qaysi formula · 🟢 · choice · tag: which_formula
// Mexanika: kit.jsx -> Choice. Raskladka: 28-dars, 1-o'rin (isinish).
// (7x − 2)(7x + 2): ikki qavs bir xil, ishoralari qarama-qarshi ->
// kvadratlar ayirmasi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_formula', level: '🟢',
  eyebrow: L('Qaysi formula', 'Какая формула', 'Which formula'),
  setup: L(
    "Formulani tanlash uchun yozuvga qarash kifoya: qavslar bir xilmi, ishoralari qanday, daraja bormi.",
    'Чтобы выбрать формулу, достаточно посмотреть на запись: одинаковы ли скобки, какие знаки, есть ли степень.',
    'To pick the formula just look at the record: are the brackets alike, what are the signs, is there a power.'),
  expr: ['(7x', '−', '2)', '(7x', '+', '2)'], exprSize: 28,
  ask: L('Qaysi formula mos keladi?', 'Какая формула подходит?', 'Which formula fits?'),
  opts: [
    { label: L('Kvadratlar ayirmasi', 'Разность квадратов', 'Difference of squares') },
    { label: L("Ayirmaning kvadrati", 'Квадрат разности', 'Square of a difference') },
    { label: L("Yig'indining kvadrati", 'Квадрат суммы', 'Square of a sum') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Ikki qavsda bir xil hadlar, ishoralari esa qarama-qarshi: (7x)² − 2² = 49x² − 4.",
    'Верно. В двух скобках одинаковые члены с противоположными знаками: (7x)² − 2² = 49x² − 4.',
    'Correct. The brackets hold the same terms with opposite signs: (7x)² − 2² = 49x² − 4.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ayirmaning kvadrati (7x − 2)² ko'rinishida bo'lardi: bir xil qavs ikki marta. Bizda esa ishoralar boshqa.",
      'Квадрат разности выглядел бы как (7x − 2)²: одна и та же скобка дважды. А у нас знаки разные.',
      'A square of a difference would be (7x − 2)²: the same bracket twice. Here the signs differ.') },
    { when: (s) => s.picked === 2, text: L(
      "Yig'indining kvadrati (7x + 2)² bo'lardi. Bizda bir qavsda minus turibdi.",
      'Квадрат суммы был бы (7x + 2)². А у нас в одной скобке минус.',
      'A square of a sum would be (7x + 2)². Here one bracket has a minus.') },
  ],
  wrongText: L(
    "Ikki qavsni solishtiring: hadlari bir xilmi, ishoralari bir xilmi?",
    'Сравни две скобки: одинаковы ли члены и одинаковы ли знаки?',
    'Compare the brackets: same terms, same signs?'),
};

export default function D28_01(props) { return <Choice data={DATA} {...props} />; }
