// Dars04 · Amaliyot 08 — Tartib · 🔴 · tag: common_denom_order
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Kontent: src/books/grade8/DARS04_AMALIYOT_KONTENT_V2.md §08
//
// Ilgari bu topshiriq 05-o'rinda va `OrderLines` da turgan. Metodist qarori
// 2026-08-24: mexanikalar 1-darsdan olinadi, shuning uchun qadamlar allaqachon
// qatorda turadi va JOYI almashtiriladi.
//
// SwapOrder kartalari BIR QATORDA — to'rt ustun, telefonda ~85px, shuning
// uchun so'z (`label`) asosiy, yozuv (`tokens`) qisqa dalil.
// Ikki qimmat buzilish: (1) umumiy maxrajni topmasdan keltirishga urinish;
// (2) shartni boshiga yoki o'rtaga qo'yish — shart tayyor javobga qo'shiladi,
// va u DASTLABKI maxrajlardan olinadi, umumiy maxrajdan emas.
// `start` teskari tartib: javobgacha ikki almashtirish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'common_denom_order', level: '🔴',
  expr: [{ n: '2', d: 'g' }, '+', { n: '3', d: 'g + 1' }], exprSize: 24,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['g(g+1)'],
      label: L('umumiy maxrajni topamiz', 'найдём общий знаменатель', 'find the common denominator') },
    { id: 'l2', tokens: ['2(g+1) + 3g'],
      label: L('suratlarni keltiramiz', 'приведём числители', 'bring the numerators') },
    { id: 'l3', tokens: [{ n: '5g+2', d: 'g²+g' }],
      label: L('javobni yozamiz', 'запишем ответ', 'write the answer') },
    { id: 'l4', tokens: ['g ≠ 0,  g ≠ −1'],
      label: L('shartni yozamiz', 'запишем условие', 'write the condition') },
  ],
  start: ['l4', 'l1', 'l3', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Ikki kasrning maxraji har xil. Yechimning to'rt qadami bir qatorda turadi, lekin tartibi buzilgan.",
    'У двух дробей разные знаменатели. Четыре шага решения стоят в одну строку, но порядок нарушен.',
    'The two fractions have different denominators. The four steps of the solution stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval umumiy maxraj topiladi — g karra g qo'shuv bir, chunki bu ikki maxrajning umumiy narsasi yo'q. Keyin har surat o'z qo'shimcha ko'paytuvchisiga ko'paytiriladi: ikki g qo'shuv birga, uch esa g ga. Javob besh g qo'shuv ikki bo'linadi g kvadrat qo'shuv g ga. Shart esa oxirida va DASTLABKI maxrajlardan: g nolga teng emas, g minus birga teng emas.",
    'Верно. Сначала находят общий знаменатель — g на g плюс один, ведь у этих двух знаменателей нет ничего общего. Потом каждый числитель умножают на свой дополнительный множитель: два на g плюс один, а три на g. Ответ — пять g плюс два делить на g в квадрате плюс g. Условие в конце и из ИСХОДНЫХ знаменателей: g не равно нулю и g не равно минус одному.',
    'Correct. First the common denominator is found — g times g plus one, since these two denominators share nothing. Then each numerator is multiplied by its own extra factor: two by g plus one, three by g. The answer is five g plus two over g squared plus g. The condition comes last and from the ORIGINAL denominators: g is not zero and g is not minus one.'),
  wrongs: [
    { when: (s) => s.pos.l4 === 0, text: L(
      "Shart yechimning boshida turmaydi: u tayyor javobga qo'shiladi. Lekin oxirida ham uni umumiy maxrajdan emas, DASTLABKI maxrajlardan oling.",
      'Условие не стоит в начале решения: оно приписывается к готовому ответу. Но и в конце бери его не из общего знаменателя, а из ИСХОДНЫХ.',
      'The condition does not come first: it is added to the finished answer. But at the end take it from the ORIGINAL denominators, not from the common one.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Keltirishdan boshlab bo'lmaydi: har suratni NIMAGA ko'paytirishni bilish uchun avval umumiy maxrajni topish kerak.",
      'Нельзя начинать с приведения: чтобы знать, НА ЧТО умножать каждый числитель, сначала надо найти общий знаменатель.',
      'You cannot start with bringing to a denominator: to know WHAT to multiply each numerator by, the common denominator must be found first.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Shart oxirgi qadam: u tayyor javobga qo'shiladi, hisobning o'rtasiga emas.",
      'Условие — последний шаг: оно приписывается к готовому ответу, а не в середину счёта.',
      'The condition is the last step: it is added to the finished answer, not into the middle of the working.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Javob keltirishdan OLDIN turolmaydi: besh g qo'shuv ikki aynan suratlar keltirilgandan keyin paydo bo'ladi.",
      'Ответ не может стоять ДО приведения: пять g плюс два появляется именно после того, как числители приведены.',
      'The answer cannot come BEFORE the bringing: five g plus two appears exactly after the numerators are brought together.') },
  ],
  wrongText: L(
    "Uch qadam: umumiy maxrajni top, suratlarni keltir, javobni yoz. Shart esa doim oxirida va DASTLABKI maxrajlardan.",
    'Три шага: найди общий знаменатель, приведи числители, запиши ответ. Условие всегда в конце и из ИСХОДНЫХ знаменателей.',
    'Three steps: find the common denominator, bring the numerators, write the answer. The condition always comes last and from the ORIGINAL denominators.'),
};

export default function D04_08(props) { return <SwapOrder data={DATA} {...props} />; }
