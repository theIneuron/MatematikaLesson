// Dars03 · Amaliyot 06 — Tartib · 🟡 · tag: reduce_order
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Kontent: src/books/grade8/DARS03_AMALIYOT_KONTENT_V2.md §06
//
// Ilgari bu topshiriq 04-o'rinda va `OrderLines` da turgan. Metodist qarori
// 2026-08-24: mexanikalar 1-darsdan olinadi, shuning uchun satrlar allaqachon
// qatorda turadi va JOYI almashtiriladi.
//
// SwapOrder kartalari BIR QATORDA — to'rt ustun, telefonda ~85px. Shuning
// uchun har qadamda so'z (`label`) asosiy, yozuv (`tokens`) qisqa dalil.
// Ikki qimmat buzilish: (1) ajratishdan OLDIN qisqartirish — bu yerda umumiy
// ko'paytuvchi hali ko'rinmaydi; (2) shartni boshiga yoki o'rtaga qo'yish.
// `start` teskari tartib: javobgacha ikki almashtirish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'reduce_order', level: '🟡',
  expr: [{ n: '2e + 10', d: 'e² − 25' }], exprSize: 26,
  itemSize: 12,
  cards: [
    // Ustunning eni telefonda ~78px: bo'shliqli yozuv (e − 5)(e + 5) ikki
    // qatorga bo'linib ketardi, shuning uchun shu KARTADA yozuv zich (o'lchov
    // 2026-08-24). Matematika o'zgarmadi.
    { id: 'l1', tokens: [{ n: '2(e+5)', d: '(e−5)(e+5)' }],
      label: L("ikkala qavatni ajratamiz", 'разложим оба этажа', 'factor both floors') },
    { id: 'l2', tokens: ['e + 5'],
      label: L("umumiy ko'paytuvchini qisqartiramiz", 'сократим общий множитель', 'cancel the common factor') },
    { id: 'l3', tokens: [{ n: '2', d: 'e − 5' }],
      label: L('javobni yozamiz', 'запишем ответ', 'write the answer') },
    { id: 'l4', tokens: ['e ≠ 5,  e ≠ −5'],
      label: L('shartni yozamiz', 'запишем условие', 'write the condition') },
  ],
  start: ['l4', 'l3', 'l2', 'l1'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Kasrni qisqartirish kerak. Yechimning to'rt qadami bir qatorda turadi, lekin tartibi buzilgan.",
    'Дробь нужно сократить. Четыре шага решения стоят в одну строку, но порядок нарушен.',
    'The fraction has to be cancelled. The four steps of the solution stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval ikkala qavat ko'paytuvchilarga ajratiladi: tepada ikkitani qavsdan chiqaramiz, pastda kvadratlar ayirmasi. Shundan keyingina umumiy ko'paytuvchi e qo'shuv besh KO'RINADI va qisqaradi. Shart esa oxirida va DASTLABKI maxrajdan: u ikki joyda nolga aylanadi, qisqargan kasrda esa ulardan biri ko'rinmay qoladi.",
    'Верно. Сначала оба этажа раскладывают на множители: сверху выносим двойку, снизу разность квадратов. Только после этого общий множитель e плюс пять СТАНОВИТСЯ ВИДЕН и сокращается. Условие — в конце и из ИСХОДНОГО знаменателя: он обращается в нуль в двух местах, а в сокращённой дроби одно из них не видно.',
    'Correct. First both floors are factored: a two is taken out above, a difference of squares below. Only then does the common factor e plus five BECOME VISIBLE and cancel. The condition comes last and from the ORIGINAL denominator: it is zero in two places, and in the cancelled fraction one of them is invisible.'),
  wrongs: [
    { when: (s) => s.pos.l4 === 0, text: L(
      "Shart yechimning boshida turmaydi. Lekin uni oxirida ham QISQARGAN kasrdan olmang: taqiqni dastlabki maxraj belgilaydi.",
      'Условие не стоит в начале решения. Но и в конце его не берут из СОКРАЩЁННОЙ дроби: запрет задаёт исходный знаменатель.',
      'The condition does not come first. But at the end do not take it from the CANCELLED fraction either: the original denominator sets the ban.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Qisqartirishdan boshlab bo'lmaydi: ikki e qo'shuv o'n va e kvadrat minus yigirma besh yozuvida bir xil KO'PAYTUVCHI ko'rinmaydi. Avval ikkala qavatni ajrating.",
      'С сокращения начинать нельзя: в записи два e плюс десять и e в квадрате минус двадцать пять одинакового МНОЖИТЕЛЯ не видно. Сначала разложи оба этажа.',
      'You cannot start with cancelling: in two e plus ten and e squared minus twenty five no common FACTOR is visible. Factor both floors first.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Shart oxirgi qadam: u tayyor javobga qo'shiladi, hisobning o'rtasiga emas.",
      'Условие — последний шаг: оно приписывается к готовому ответу, а не в середину счёта.',
      'The condition is the last step: it is added to the finished answer, not into the middle of the working.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Javob qisqartirishdan OLDIN turolmaydi: ikki bo'linadi e minus beshga aynan qisqartirishdan keyin paydo bo'ladi.",
      'Ответ не может стоять ДО сокращения: два делить на e минус пять появляется именно после сокращения.',
      'The answer cannot come BEFORE the cancelling: two over e minus five appears exactly after it.') },
  ],
  wrongText: L(
    "Uch qadam: ikkala qavatni ko'paytuvchilarga ajrating, umumiy ko'paytuvchini qisqartiring, javobni yozing. Shart esa doim oxirida va dastlabki maxrajdan.",
    'Три шага: разложи оба этажа на множители, сократи общий множитель, запиши ответ. Условие всегда в конце и из исходного знаменателя.',
    'Three steps: factor both floors, cancel the common factor, write the answer. The condition always comes last and from the original denominator.'),
};

export default function D03_06(props) { return <SwapOrder data={DATA} {...props} />; }
