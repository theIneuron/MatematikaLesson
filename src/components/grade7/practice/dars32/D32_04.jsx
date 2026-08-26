// Dars32 · Amaliyot 04 — Umumiy maxraj · 🟡 · bracket · tag: frac_common_denom
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin `bracket`.
// MAVZU TO'LDIRILDI (metodist qarori 2026-08-22): darsning mavzusi «qisqartirish VA
// umumiy maxraj», shuning uchun 4, 6, 7 va 10-topshiriqlar umumiy maxrajga bag'ishlandi.
// Maxraj `:` bilan yoziladi -- sinf amaliyotidagi yozuv.
// 4 va 6 uchun umumiy maxraj 12: ikkovi ham 12 ga butun bo'linadi. Tuzoq: 24 (ko'paytma) va 10 (yig'indi).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_common_denom',
  level: '🟡',
  eyebrow: L(
    'Umumiy maxraj',
    'Общий знаменатель',
    'Common denominator'),
  setup: L(
    "Umumiy maxraj -- ikki maxrajga ham butun bo'linadigan eng kichik son. Uni ko'paytirish bilan ham olish mumkin, lekin son katta bo'lib ketadi.",
    'Общий знаменатель это наименьшее число, которое делится на оба знаменателя. Его можно взять и произведением, но число выйдет больше.',
    'The common denominator is the least number divisible by both. The product also works but gives a larger number.'),
  given: [['a : 4', L('va', 'и', 'and'), 'a : 6']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: L('umumiy maxraj', 'общий знаменатель', 'common denominator') },
    { id: 'b', label: '= 12' },
    { id: 'c', label: '= 24' },
    { id: 'd', label: '= 10' },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 44,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 12 ni 4 ga ham, 6 ga ham butun bo'lish mumkin, va u eng kichigi.",
    'Верно. 12 делится и на 4, и на 6, и это наименьшее такое число.',
    'Correct. 12 divides by both 4 and 6, and it is the least such number.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "24 ham bo'linadi, lekin u eng kichik emas: 4 va 6 ning umumiy maxraji 12.",
        '24 тоже делится, но это не наименьшее: общий знаменатель 4 и 6 равен 12.',
        '24 divides too, yet it is not the least: for 4 and 6 it is 12.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "10 bu 4 + 6. Maxrajlar qo'shilmaydi: umumiy maxraj ikkoviga BO'LINISHI kerak.",
        '10 это 4 + 6. Знаменатели не складываются: общий знаменатель должен ДЕЛИТЬСЯ на оба.',
        '10 is 4 + 6. Denominators are not added: the common one must be DIVISIBLE by both.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    "4 ning karralilarini sanang: 4, 8, 12. Qaysi biri 6 ga ham bo'linadi?",
    'Перечисли кратные 4: 4, 8, 12. Какое из них делится и на 6?',
    'List multiples of 4: 4, 8, 12. Which also divides by 6?'),
};

export default function D32_04(props) { return <BuildLine data={DATA} {...props} />; }
