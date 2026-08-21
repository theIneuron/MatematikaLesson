// Dars29 · Amaliyot 10 — Umumiy va kvadrat birga · 🔴 · build · tag: fact_common_square
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
// 2m² − 8m + 8 = 2(m² − 4m + 4) = 2(m − 2)².
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fact_common_square', level: '🔴',
  eyebrow: L('Umumiy va kvadrat', 'Общий и квадрат', 'Common factor and square'),
  setup: L(
    "Uch hadning umumiy ko'paytuvchisi 2. Uni chiqargandan keyin qavs ichida to'liq kvadrat qoladi.",
    'Общий множитель трёх членов это 2. После выноса в скобке остаётся полный квадрат.',
    'The three terms share 2. Taking it out leaves a perfect square inside.'),
  expr: ['2m²', '−', '8m', '+', '8'], exprSize: 30,
  cards: [
    { id: 'a', label: '2' },
    { id: 'b', label: '(m − 2)²' },
    { id: 'c', label: '(m + 2)²' },
    { id: 'd', label: '2m' },
    { id: 'e', label: '(m − 4)²' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Oxirigacha ajratib yozing", 'Разложи до конца', 'Factorise it fully'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2(m² − 4m + 4) = 2(m − 2)²: qavs ichida 4 = 2² va o'rta had 2 · m · 2 = 4m.",
    'Верно. 2(m² − 4m + 4) = 2(m − 2)²: в скобке 4 = 2², а средний член 2 · m · 2 = 4m.',
    'Correct. 2(m² − 4m + 4) = 2(m − 2)²: inside 4 = 2² and the middle term 2 · m · 2 = 4m.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "O'rta had manfiy edi: −8m. Ya'ni qavs ichida ham minus turadi: (m − 2)².",
      'Средний член был отрицательным: −8m. Значит и в скобке минус: (m − 2)².',
      'The middle term was negative: −8m. So the bracket has a minus: (m − 2)².') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "(m − 4)² da oxirgi had 16 bo'lardi. Qavs ichida 4 turibdi, ya'ni asos 2.",
      'В (m − 4)² последний член был бы 16. В скобке 4, значит основание 2.',
      'In (m − 4)² the last term would be 16. The bracket holds 4, so the base is 2.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "2m ni chiqarib bo'lmaydi: oxirgi hadda m yo'q.",
      '2m вынести нельзя: в последнем члене нет m.',
      '2m cannot come out: the last term has no m.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki ko'paytuvchidan iborat: son va kvadrat.",
      'Ответ состоит из двух множителей: число и квадрат.',
      'The answer has two factors: a number and a square.') },
  ],
  wrongText: L(
    "Uch hadda nima umumiy? Qavs ichi to'liq kvadratmi, va ichidagi ishora qanday?",
    'Что общего у трёх членов? Полный ли квадрат в скобке и какой знак внутри?',
    'What do the three terms share? Is the bracket a perfect square, and with which sign?'),
};

export default function D29_10(props) { return <BuildLine data={DATA} {...props} />; }
