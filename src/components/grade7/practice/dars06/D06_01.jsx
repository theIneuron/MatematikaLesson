// Dars06 · Amaliyot 01 — O'xshash hadlarni topish · 🟢 · tag: find_like_terms
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// 7a + 3b − 2a + 5. O'xshash hadlar -- harfli qismi BIR XIL bo'lganlar:
// 7a va 2a. 3b ning harfi boshqa, 5 da esa harf umuman yo'q.
// Eng ko'p uchraydigan xato: «hammasida harf bor, demak o'xshash» deb 3b ni
// ham belgilash.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'find_like_terms', level: '🟢',
  eyebrow: L("O'xshash hadlar", 'Подобные слагаемые', 'Like terms'),
  setup: L(
    "O'xshash hadlar -- harfli qismi bir xil bo'lgan hadlar. Koeffitsiyent har xil bo'lishi mumkin, harf esa aynan bir xil bo'lishi kerak.",
    'Подобные слагаемые — те, у которых одинаковая буквенная часть. Коэффициент может быть любым, а буква должна быть той же.',
    'Like terms are the ones with the same letter part. The coefficient can differ, the letter must be the same.'),
  ask: L("Yozuvdagi O'XSHASH hadlarni belgilang.", 'Отметь в записи ПОДОБНЫЕ слагаемые.', 'Mark the LIKE terms in the record.'),
  note: L("Hadni bosib belgilanadi.", 'Слагаемое отмечается нажатием.', 'Tap a term to mark it.'),
  parts: [
    { k: 'term', id: 't1', v: '7a' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '3b' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't3', v: '2a' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't4', v: '5' },
  ],
  want: ['t1', 't3'],
  correctText: L(
    "To'g'ri. 7a va 2a harfi bir xil, ular o'xshash. 3b ning harfi boshqa, 5 da esa harf yo'q.",
    'Верно. У 7a и 2a одна и та же буква, они подобны. У 3b буква другая, а у 5 буквы нет вовсе.',
    'Correct. 7a and 2a share the same letter, they are like terms. 3b has a different letter and 5 has none.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "3b ning harfi b, qolganlarida a. Harflar boshqa bo'lsa hadlar o'xshash emas -- ularni qo'shib bo'lmaydi.",
      'У 3b буква b, а у остальных a. Если буквы разные, слагаемые не подобны — их не сложить.',
      '3b has the letter b, the others have a. Different letters mean the terms are not alike — they cannot be added.') },
    { when: (s) => s.extra.indexOf('t4') !== -1, text: L(
      "5 da harf yo'q. U ozod had: faqat boshqa ozod hadlar bilan qo'shiladi.",
      'У 5 буквы нет. Это свободный член: он складывается только с другими свободными членами.',
      '5 has no letter. It is a free term: it adds only to other free terms.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi qoldi: harfi a bo'lgan IKKI had bor, ikkovini ham belgilash kerak.",
      'Одно осталось: слагаемых с буквой a ДВА, отметить нужно оба.',
      'One is left: there are TWO terms with the letter a, both must be marked.') },
  ],
  wrongText: L(
    "Har hadning harfiga qarang. Harflari bir xil bo'lganlari o'xshash hadlar.",
    'Смотри на букву каждого слагаемого. Подобны те, у кого буквы совпали.',
    'Look at the letter of each term. The ones whose letters match are like terms.'),
};

export default function D06_01(props) { return <TapTerms data={DATA} {...props} />; }
