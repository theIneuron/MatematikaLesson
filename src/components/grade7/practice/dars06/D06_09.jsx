// Dars06 · Amaliyot 09 — Uch guruhli yozuv · 🔴 · tag: pick_one_group
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// 5a − 3b + 2a + 7b − a. Bu yerda IKKI guruh o'xshash hadlar bor: a li
// uchta va b li ikkita. O'quvchidan faqat a li hadlar so'raladi -- ya'ni
// guruhni ajratib olishi kerak, hammasini emas.
// Uchinchi a ning oldida MINUS turadi va koeffitsiyenti 1: eng ko'p
// e'tibordan chetda qoladigan had aynan shu.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'pick_one_group', level: '🔴', exprSize: 27,
  eyebrow: L('Bitta guruh', 'Одна группа', 'One group'),
  setup: L(
    "Yozuvda ikki guruh o'xshash had bor. Ularni yig'ishdan oldin ajratib olish kerak -- aks holda boshqa guruhning hadi qo'shilib ketadi.",
    'В записи две группы подобных слагаемых. Перед сбором их надо разделить — иначе в сумму попадёт слагаемое из другой группы.',
    'The record has two groups of like terms. They must be separated before collecting — otherwise a term from the other group joins in.'),
  ask: L('Harfi a bo\'lgan HAMMA hadni belgilang.', 'Отметь ВСЕ слагаемые с буквой a.', 'Mark EVERY term with the letter a.'),
  note: L("Ularning soni ikkitadan ko'p bo'lishi mumkin.", 'Их может быть больше двух.', 'There can be more than two.'),
  parts: [
    { k: 'term', id: 't1', v: '5a' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't2', v: '3b' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '2a' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't4', v: '7b' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't5', v: 'a' },
  ],
  want: ['t1', 't3', 't5'],
  correctText: L(
    "To'g'ri. Uchta had: 5a, 2a va a. Ularning koeffitsiyentlari 5 + 2 − 1 = 6, ya'ni 6a. b li hadlar esa alohida yig'iladi.",
    'Верно. Три слагаемых: 5a, 2a и a. Их коэффициенты 5 + 2 − 1 = 6, то есть 6a. А слагаемые с b собираются отдельно.',
    'Correct. Three terms: 5a, 2a and a. Their coefficients give 5 + 2 − 1 = 6, that is 6a. The b terms collect separately.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('t5') !== -1, text: L(
      "Oxirgi had ham a li: unda koeffitsiyent yozilmagan, lekin u 1 ga teng va oldida minus turadi.",
      'Последнее слагаемое тоже с a: коэффициент у него не написан, но он равен 1, и перед ним минус.',
      'The last term has an a too: its coefficient is not written but it equals 1, and it has a minus before it.') },
    { when: (s) => s.extra.indexOf('t2') !== -1 || s.extra.indexOf('t4') !== -1, text: L(
      "b li hadlar boshqa guruh. Ularni a li hadlar bilan qo'shib bo'lmaydi.",
      'Слагаемые с b — другая группа. Их нельзя складывать со слагаемыми с a.',
      'The b terms are a different group. They cannot be added to the a terms.') },
  ],
  wrongText: L(
    "Har hadning harfiga qarang va faqat a li hadlarni belgilang -- koeffitsiyenti yozilmaganini ham.",
    'Смотри на букву каждого слагаемого и отмечай только те, где a — включая то, у которого коэффициент не написан.',
    'Look at the letter of each term and mark only the a ones — including the one whose coefficient is not written.'),
};

export default function D06_09(props) { return <TapTerms data={DATA} {...props} />; }
