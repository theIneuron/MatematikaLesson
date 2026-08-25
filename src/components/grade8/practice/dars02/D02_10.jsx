// Dars02 · Amaliyot 10 — Tartib · 🔴 · tag: order_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md §10
//
// Ilgari bu topshiriq 07-o'rinda va `OrderLines` da turgan (bankdan satrlarni
// yig'ish). Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi,
// shuning uchun satrlar allaqachon qatorda turadi va JOYI almashtiriladi.
//
// SwapOrder kartalari BIR QATORDA, ya'ni to'rtta ustun — matematika qisqa
// bo'lishi kerak (telefonda ustun eni ~85px). Shu sababli har qadamda so'z
// (`label`) asosiy, yozuv (`tokens`) esa qisqa dalil.
// Boshlang'ich tartib QAT'IY (`start`), tasodifiy emas: aralashtirish ba'zan
// to'g'ri tartibni berib qo'yardi. `start` dan javobgacha uch almashtirish.
// Eng qimmat buzilish — shartni boshiga yoki o'rtaga qo'yish (З2).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'order_steps', level: '🔴',
  expr: [{ n: '4', d: 'n − 6' }], exprSize: 26,
  itemSize: 14,
  cards: [
    { id: 'l1', tokens: ['n² − 6n = n(n − 6)'],
      label: L("yangi maxrajni ajratamiz", 'разложим новый знаменатель', 'split the new denominator') },
    { id: 'l2', tokens: ['· n'],
      label: L("ko'paytuvchini ikki qavatga qo'yamiz", 'умножим оба этажа', 'multiply both floors') },
    { id: 'l3', tokens: [{ n: '4n', d: 'n² − 6n' }],
      label: L('javobni yozamiz', 'запишем ответ', 'write the answer') },
    { id: 'l4', tokens: ['n ≠ 0,  n ≠ 6'],
      label: L('shartni yozamiz', 'запишем условие', 'write the condition') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Kasrni maxraji n² − 6n bo'lgan kasrga keltirish kerak. Yechimning to'rt qadami bir qatorda turadi, lekin tartibi buzilgan.",
    'Дробь нужно привести к знаменателю n² − 6n. Четыре шага решения стоят в одну строку, но порядок нарушен.',
    'The fraction must be brought to the denominator n² − 6n. The four steps of the solution stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval yangi maxraj ko'paytuvchilarga ajratiladi — usul aynan shundan boshlanadi, aks holda nimaga ko'paytirishni bilmaysiz. Ko'rinadi: n karra n minus olti, ya'ni ko'paytuvchi n. Keyin u ikkala qavatga qo'yiladi, javob yoziladi, va oxirida shart: nol yangi ko'paytuvchidan, olti esa dastlabki maxrajdan.",
    'Верно. Сначала новый знаменатель разлагают на множители — способ именно с этого и начинается, иначе непонятно, на что умножать. Видно: n на n минус шесть, значит множитель n. Потом его ставят на оба этажа, записывают ответ, и в конце условие: нуль от нового множителя, шесть от исходного знаменателя.',
    'Correct. First the new denominator is split into factors — that is where the method starts, otherwise you do not know what to multiply by. It shows: n times n minus six, so the factor is n. Then it goes onto both floors, the answer is written, and the condition comes last: zero from the new factor, six from the original denominator.'),
  wrongs: [
    { when: (s) => s.pos.l4 === 0, text: L(
      "Shart yechimning boshida turmaydi: yangi taqiq ko'paytuvchi tanlangandan keyin paydo bo'ladi, undan oldin emas.",
      'Условие не стоит в начале решения: новый запрет появляется после того, как выбран множитель, а не до.',
      'The condition does not come first: the new ban appears after the factor is chosen, not before.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Ko'paytirishdan boshlab bo'lmaydi: NIMAGA ko'paytirishni bilish uchun avval yangi maxrajni ko'paytuvchilarga ajratish kerak.",
      'Нельзя начинать с умножения: чтобы знать, НА ЧТО умножать, сначала надо разложить новый знаменатель на множители.',
      'You cannot start with multiplying: to know WHAT to multiply by, the new denominator must be split into factors first.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Shart oxirgi qadam bo'lishi kerak: u tayyor javobga qo'shiladi, hisobning o'rtasiga emas.",
      'Условие должно быть последним шагом: оно приписывается к готовому ответу, а не в середину счёта.',
      'The condition must be the last step: it is added to the finished answer, not into the middle of the working.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Javob ko'paytirishdan OLDIN turolmaydi: to'rt n aynan o'sha ko'paytirishda paydo bo'ladi.",
      'Ответ не может стоять ДО умножения: четыре n появляется именно в этом умножении.',
      'The answer cannot come BEFORE the multiplication: four n appears in that very multiplication.') },
  ],
  wrongText: L(
    "Usul uch qadam: ko'paytuvchini top, ikkala qavatga qo'y, javobni yoz. Shart esa doim oxirida — va u dastlabki maxrajdan ham, yangi ko'paytuvchidan ham keladi.",
    'Способ в три шага: найди множитель, поставь на оба этажа, запиши ответ. Условие всегда в конце — и оно приходит и от исходного знаменателя, и от нового множителя.',
    'The method has three steps: find the factor, put it on both floors, write the answer. The condition always comes last — and it comes both from the original denominator and from the new factor.'),
};

export default function D02_10(props) { return <SwapOrder data={DATA} {...props} />; }
