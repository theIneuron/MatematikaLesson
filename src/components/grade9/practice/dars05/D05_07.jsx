// Dars05 · Amaliyot 07 — Abssissa · 🟡 · teg: ishora-teskari-siljish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md §07
//
// Uchta tuzoq uchta xil chalkashlik: ishorani teskari olish, qavsdan
// tashqaridagi sonni javob deb berish va uning qarama-qarshisini berish.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'ishora-teskari-siljish', level: '🟡',
  eyebrow: L('Abssissa', 'Абсцисса', 'Abscissa'),
  setup: L(
    "Uchining abssissasi qavs nolga aylanadigan sondan chiqadi.",
    'Абсцисса вершины берётся из числа, при котором скобка обращается в нуль.',
    'The abscissa of the vertex comes from the number that makes the bracket zero.'),
  ask: L('Uchining abssissasini yozing.', 'Напиши абсциссу вершины.', 'Write the abscissa of the vertex.'),
  hint: L('Javob bitta son.', 'Ответ — одно число.', 'The answer is a single number.'),
  placeholder: '0',
  expr: ['y = (x + 7)² − 5'],
  answer: [-7],
  correctText: L(
    "To'g'ri, minus yetti. Qavsda qo'shuv yetti turibdi, u nolga aylanishi uchun iks minus yettiga teng bo'lishi kerak. Qavsdagi son ishorasi shu tarzda TESKARI ishlaydi.",
    'Верно, минус семь. В скобке стоит плюс семь, и чтобы она обратилась в нуль, икс должен равняться минус семи. Именно так знак числа в скобке работает НАОБОРОТ.',
    'Correct, minus seven. The bracket holds plus seven, and for it to become zero x must equal minus seven. That is exactly how the sign inside the bracket works the OTHER way round.'),
  wrongs: [
    { when: (s) => s.has(7), text: L(
      "Ishora teskari olindi. Qavsni nolga tenglashtiring: iks qo'shuv yetti nolga teng bo'lsa, iks nimaga teng?",
      'Знак взят наоборот. Приравняй скобку к нулю: если икс плюс семь равно нулю, чему равен икс?',
      'The sign was taken the other way. Set the bracket to zero: if x plus seven is zero, what does x equal?') },
    { when: (s) => s.has(-5), text: L(
      "Minus besh — qavsdan tashqaridagi son, u uchining balandligini beradi. Savol esa abssissa haqida.",
      'Минус пять — число за скобкой, оно даёт высоту вершины. А спрашивают абсциссу.',
      'Minus five is the number outside the bracket; it gives the height of the vertex. The question is about the abscissa.') },
    { when: (s) => s.has(5), text: L(
      "Bu qavsdan tashqaridagi sonning qarama-qarshisi. Abssissa qavs ICHIDAN chiqadi.",
      'Это противоположное к числу за скобкой. Абсцисса берётся ИЗ скобки.',
      'That is the opposite of the number outside the bracket. The abscissa comes from INSIDE the bracket.') },
  ],
  wrongText: L(
    "Qavsni nolga tenglashtiring va iksni toping. Qavsdan tashqaridagi songa tegmang — u boshqa savolga javob beradi.",
    'Приравняй скобку к нулю и найди икс. Число за скобкой не трогай — оно отвечает на другой вопрос.',
    'Set the bracket to zero and find x. Leave the number outside the bracket alone — it answers a different question.'),
};

export default function D05_07(props) { return <TypeSet data={DATA} {...props} />; }
