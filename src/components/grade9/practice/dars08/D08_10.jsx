// Dars08 · Amaliyot 10 — So'zlar · 🔴 · teg: yechim-yoq-holati
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Uchinchi bo'shliq darsning eng qiyin tasdig'ini yopadi: yagona ildiz
// begona bo'lsa, «yechimi yo'q» ham TO'LIQ javob. Tuzoq «cheksiz ko'p
// yechimi bor» — teskari xulosa.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'yechim-yoq-holati', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      'Maxrajida harf bo\'lgan tenglamada avval',
      'В уравнении с буквой в знаменателе сначала выписывают',
      'In an equation with a letter in the denominator, first the') },
    { slot: 0 },
    { text: L(
      "yoziladi. Maxrajlarga ko'paytirilgach hosil bo'lgan ildiz undan chetga chiqsa, u",
      '. Если полученный после умножения на знаменатели корень выходит за него, его называют',
      'is written down. If a root obtained after multiplying by the denominators falls outside it, that root is called') },
    { slot: 1 },
    { text: L(
      "ildiz deyiladi. Agar yagona ildiz begona bo'lsa, tenglamaning",
      'корнем. Если единственный корень оказался посторонним, у уравнения',
      '. If the only root turns out to be extraneous, the equation') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('ODZ', 'ОДЗ', 'domain') },
    { id: 'w2', label: L('begona', 'посторонним', 'extraneous') },
    { id: 'w3', label: L("yechimi yo'q", 'решений нет', 'has no solution') },
    { id: 'w4', label: L('javob', 'ответ', 'answer') },
    { id: 'w5', label: L("qo'shimcha", 'дополнительным', 'additional') },
    { id: 'w6', label: L("cheksiz ko'p yechimi bor", 'бесконечно много решений', 'has infinitely many solutions') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoidada butun yechimning karkasi turibdi: ODZ boshida yoziladi, oxirida u bilan solishtiriladi, va agar hamma ildiz chetga chiqsa — javob «yechimi yo'q» bo'ladi. Bu bo'sh javob emas: tenglamada ildiz yo'qligi ham aniq matematik natija.",
    'Верно, все три слова на месте. В правиле стоит каркас всего решения: ОДЗ выписывают в начале, в конце с ним сверяются, и если все корни вышли за него — ответом будет «решений нет». Это не пустой ответ: отсутствие корней у уравнения — тоже точный математический результат.',
    'Correct, all three words are in place. The rule holds the frame of the whole solution: the domain is written at the start, checked against at the end, and if every root falls outside it the answer is "no solution". That is not an empty answer: having no roots is a precise mathematical result too.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Javob yechimning oxirida turadi, boshida emas. Boshida esa taqiq yoziladi — maxrajni nolga aylantiradigan sonlar.",
      'Ответ стоит в конце решения, а не в начале. В начале выписывают запрет — числа, обращающие знаменатель в нуль.',
      'The answer stands at the end of a solution, not at the start. At the start the ban is written — the numbers that make the denominator zero.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Bunday ildiz qo'shimcha emas — u umuman ildiz emas. Uni asl tenglamaga qo'yib bo'lmaydi: u yerda maxraj nolga aylanadi.",
      'Такой корень не дополнительный — он вообще не корень. Его нельзя подставить в исходное уравнение: там знаменатель обращается в нуль.',
      'Such a root is not additional — it is not a root at all. It cannot be put into the original equation: the denominator becomes zero there.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Bu teskari xulosa. Yagona ildiz chetga chiqsa, qoladigan ildiz umuman yo'q — cheksiz ko'p emas, birorta ham.",
      'Это обратный вывод. Если единственный корень вышел за ОДЗ, не остаётся ни одного корня — не бесконечно много, а вовсе ни одного.',
      'That is the opposite conclusion. If the only root falls outside the domain, no roots remain at all — not infinitely many, but none.') },
  ],
  wrongText: L(
    "Yechimning uch nuqtasini ajrating: boshida nima yoziladi, chetga chiqqan ildiz qanday ataladi, va hamma ildiz chetga chiqsa javob qanday bo'ladi.",
    'Раздели три точки решения: что выписывают в начале, как называют вышедший за ОДЗ корень и каким будет ответ, если все корни вышли.',
    'Separate the three points of a solution: what is written at the start, what a root outside the domain is called, and what the answer is when every root falls outside.'),
};

export default function D08_10(props) { return <ClozeBank data={DATA} {...props} />; }
