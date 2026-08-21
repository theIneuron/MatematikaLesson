// Dars29 · Amaliyot 05 — Avval umumiy ko'paytuvchi · 🟡 · build · tag: common_then_formula
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin.
// 5a² − 45 = 5(a² − 9) = 5(a − 3)(a + 3). Avval umumiy ko'paytuvchi,
// keyin formula.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'common_then_formula', level: '🟡',
  eyebrow: L('Avval umumiy', 'Сначала общий', 'Common factor first'),
  setup: L(
    "Formula darrov ko'rinmaydi: avval umumiy ko'paytuvchini chiqarish kerak. Undan keyin qavs ichida kvadratlar ayirmasi paydo bo'ladi.",
    'Формула видна не сразу: сначала надо вынести общий множитель. После этого в скобке появляется разность квадратов.',
    'The formula is not visible yet: take out the common factor first, and a difference of squares appears inside.'),
  expr: ['5a²', '−', '45'], exprSize: 34,
  cards: [
    { id: 'a', label: '5' },
    { id: 'b', label: '(a − 3)' },
    { id: 'c', label: '(a + 3)' },
    { id: 'd', label: '(a − 9)' },
    { id: 'e', label: '5a' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Oxirigacha ajratib yozing", 'Разложи до конца', 'Factorise it fully'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5a² − 45 = 5(a² − 9), keyin a² − 9 = (a − 3)(a + 3). Javob 5(a − 3)(a + 3).",
    'Верно. 5a² − 45 = 5(a² − 9), потом a² − 9 = (a − 3)(a + 3). Ответ 5(a − 3)(a + 3).',
    'Correct. 5a² − 45 = 5(a² − 9), then a² − 9 = (a − 3)(a + 3). The answer is 5(a − 3)(a + 3).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "(a − 9) da 9 ning ildizi olinmagan: qavsda 3 turishi kerak.",
      'В (a − 9) не извлечён корень из 9: в скобке должно стоять 3.',
      'In (a − 9) the root of 9 was not taken: the bracket needs 3.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "5a ni chiqarib bo'lmaydi: 45 da a yo'q. Umumiy ko'paytuvchi faqat 5.",
      '5a вынести нельзя: в 45 нет буквы a. Общий множитель только 5.',
      '5a cannot come out: 45 has no a. The common factor is just 5.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch ko'paytuvchi bo'ladi: son va ikki qavs.",
      'В ответе три множителя: число и две скобки.',
      'The answer has three factors: a number and two brackets.') },
  ],
  wrongText: L(
    "Ikki hadda nima umumiy? Uni chiqargandan keyin qavs ichida nima qoladi?",
    'Что общего у двух членов? Что останется в скобке после выноса?',
    'What do the two terms share? What stays inside after taking it out?'),
};

export default function D29_05(props) { return <BuildLine data={DATA} {...props} />; }
