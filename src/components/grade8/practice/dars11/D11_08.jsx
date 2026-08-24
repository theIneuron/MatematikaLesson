// Dars11 · Amaliyot 08 — Tartib · 🔴 · tag: compare_steps · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 8-pozitsiya), §4a
//
// Taqqoslashning to'rt qadami. Eng qimmat joyi — IKKINCHI qadam: ikki sonni
// kvadratga oshirish. Uni tashlab ketish З33 ning o'zi: ildizni «taxminan
// besh» deb yumaloqlash va tenglik chiqarish.
//
// CHIZMA (metodist qarori 2026-08-24): son o'qida faqat BESH belgilangan.
// Ildizning joyi ko'rsatilmaydi — u javob, va uni qadamlar beradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'compare_steps', level: '🔴',
  expr: [{ fig: 'axis', from: 4, to: 7, w: 260, h: 50, marks: [{ at: 5, label: '5' }] }],
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: [{ r: '26' }, '?', '5'],
      label: L('savol', 'вопрос', 'the question') },
    { id: 'l2', tokens: ['26 ? 25'],
      label: L('kvadratga oshiramiz', 'возводим в квадрат', 'square both') },
    { id: 'l3', tokens: ['26 > 25'],
      label: L('sonlarni solishtiramiz', 'сравниваем числа', 'compare the numbers') },
    { id: 'l4', tokens: [{ r: '26' }, '> 5'],
      label: L('xulosa', 'вывод', 'the conclusion') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Chizmada besh belgilangan, ildizning joyi esa yo'q — uni topish kerak. To'rt qadam taqqoslashni oxirigacha olib boradi, lekin tartibi buzilgan.",
    'На чертеже отмечено пять, а места корня нет — его надо найти. Четыре шага доводят сравнение до конца, но порядок нарушен.',
    'The plot marks five, but the place of the root is missing — it has to be found. Four steps carry the comparison to the end, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval savol qo'yiladi: yigirma oltidan ildiz va besh — qaysi biri katta. Keyin ikki son ham kvadratga oshiriladi: ildizning kvadrati yigirma olti, beshning kvadrati yigirma besh. Kvadratlar solishtiriladi: yigirma olti yigirma beshdan katta. Va faqat shundan keyin xulosa chiqadi: ildiz osti katta bo'lsa ildiz ham katta, demak yigirma oltidan ildiz beshdan katta.",
    'Верно. Сначала ставится вопрос: корень из двадцати шести и пять — что больше. Потом оба числа возводятся в квадрат: квадрат корня двадцать шесть, квадрат пяти двадцать пять. Квадраты сравниваются: двадцать шесть больше двадцати пяти. И только после этого выходит вывод: больше подкоренное — больше корень, значит корень из двадцати шести больше пяти.',
    'Correct. First the question is set: the root of twenty six and five — which is bigger. Then both numbers are squared: the square of the root is twenty six, the square of five is twenty five. The squares are compared: twenty six is more than twenty five. And only then comes the conclusion: a bigger radicand means a bigger root, so the root of twenty six is more than five.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Xulosadan boshlab bo'lmaydi: u taqqoslashning NATIJASI. Undan oldin kvadratlar solishtirilishi kerak.",
      'Начинать с вывода нельзя: он РЕЗУЛЬТАТ сравнения. До него надо сравнить квадраты.',
      'You cannot start from the conclusion: it is the RESULT of the comparison. The squares must be compared first.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Yigirma olti va yigirma beshni solishtirish uchun ular avval PAYDO BO'LISHI kerak — ya'ni kvadratga oshirish qadamidan keyin. Yigirma besh qaydan keldi? Beshning kvadratidan.",
      'Чтобы сравнить двадцать шесть и двадцать пять, они сначала должны ПОЯВИТЬСЯ — то есть после шага возведения в квадрат. Откуда взялось двадцать пять? Из квадрата пяти.',
      'To compare twenty six and twenty five they must first APPEAR — that is, after the squaring step. Where did twenty five come from? From the square of five.') },
    { when: (s) => s.pos.l2 < s.pos.l1 || s.seq[0] === 'l2', text: L(
      "Kvadratga oshirish birinchi qadam emas: avval NIMANI taqqoslash kerakligini yozib olish kerak. Savolsiz nimani kvadratga oshirish ham ma'lum bo'lmaydi.",
      'Возведение в квадрат не первый шаг: сначала надо записать, ЧТО сравнивается. Без вопроса неизвестно, что возводить в квадрат.',
      'Squaring is not the first step: first you must write down WHAT is being compared. Without the question there is nothing to square.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Xulosa kvadratlarni solishtirgandan keyin chiqadi. Ildiz osti katta bo'lsa ildiz ham katta degan xossa aynan shu solishtirishga tayanadi.",
      'Вывод выходит после сравнения квадратов. Свойство «больше подкоренное — больше корень» опирается именно на это сравнение.',
      'The conclusion comes after the squares are compared. The property that a bigger radicand means a bigger root rests on exactly that comparison.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: bu yerda turgan sonlar qaysi qadamdan keldi?",
    'Спроси у каждого шага: откуда взялись стоящие в нём числа?',
    'Ask every step: where did the numbers standing in it come from?'),
};

export default function D11_08(props) { return <SwapOrder data={DATA} {...props} />; }
