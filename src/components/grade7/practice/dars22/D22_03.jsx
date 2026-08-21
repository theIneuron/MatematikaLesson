// Dars22 · Amaliyot 03 — Ko'paytuvchi oldinda · 🟢 · order · tag: factor_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 3-o'rin.
// 9x² − 36x = 9x(x − 4). Tartib: umumiy ko'paytuvchi oldinda, qavs keyin.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_order', level: '🟢',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Ko'paytuvchilarga ajratilgan yozuvda umumiy ko'paytuvchi oldinda, qavs esa keyin turadi. Ichida nima qolishini bo'lish ko'rsatadi.",
    'В разложении на множители общий множитель стоит впереди, а скобка после него. Что останется внутри, показывает деление.',
    'In a factorisation the common factor comes first and the bracket after. Division shows what stays inside.'),
  expr: ['9x²', '−', '36x'], exprSize: 34,
  cards: [
    { id: 'a', label: '9x' },
    { id: 'b', label: '(x − 4)' },
    { id: 'c', label: '9x²' },
    { id: 'd', label: '(x + 4)' },
    { id: 'e', label: '9' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ko'paytuvchilarni tartib bilan qo'ying", 'Поставь множители по порядку', 'Place the factors in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 9x² : 9x = x va 36x : 9x = 4, ya'ni 9x(x − 4). Ayirma bo'lgani uchun qavsda minus qoladi.",
    'Верно. 9x² : 9x = x и 36x : 9x = 4, значит 9x(x − 4). Так как разность, в скобке остаётся минус.',
    'Correct. 9x² : 9x = x and 36x : 9x = 4, so 9x(x − 4). Being a difference, the minus stays inside.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "9x(x + 4) ochilsa 9x² + 36x chiqadi. Asl yozuvda esa ayirma turibdi.",
      'Раскрытие 9x(x + 4) даёт 9x² + 36x. А в исходной записи разность.',
      'Opening 9x(x + 4) gives 9x² + 36x. But the original is a difference.') },
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "9x² ni chiqarib bo'lmaydi: 36x da x faqat bitta. Umumiy ko'paytuvchi 9x.",
      '9x² вынести нельзя: в 36x только одна x. Общий множитель это 9x.',
      '9x² cannot be taken out: 36x has just one x. The common factor is 9x.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Faqat 9 ni chiqarish kam: ikki hadda ham x bor, u ham umumiy.",
      'Вынести только 9 мало: в обоих членах есть x, она тоже общая.',
      'Taking out only 9 is not enough: both terms have an x, which is common too.') },
    { when: (s) => s.seq.length === 2, text: L(
      "Ko'paytuvchilar to'g'ri, tartibi boshqa: umumiy ko'paytuvchi oldinda turadi.",
      'Множители верные, но порядок другой: общий множитель стоит впереди.',
      'The factors are right but the order is not: the common factor comes first.') },
  ],
  wrongText: L(
    "Ikki hadni umumiy ko'paytuvchiga bo'ling, qoldiqlarni qavsga yozing.",
    'Раздели оба члена на общий множитель, частные запиши в скобку.',
    'Divide both terms by the common factor and put the quotients in the bracket.'),
};

export default function D22_03(props) { return <BuildLine data={DATA} {...props} />; }
