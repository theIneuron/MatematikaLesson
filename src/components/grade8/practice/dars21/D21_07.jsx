// Dars21 · Amaliyot 07 — Tartib · 🟡 · tag: word_solve_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §3 (21-dars, 7-pozitsiya)
//
// DARSNING BUTUN MANTIG'I BIR QATORDA: belgilash, tuzish, yechish, rad
// etish. T1, T2 va T3 ketma-ket turadi va har biri oldingisisiz ishlamaydi.
//
// Rad etishni oldinga surish — eng qimmat xato: o'shanda rad etadigan narsa
// hali topilmagan bo'ladi, va ish «javobni oldindan bilish» ga aylanadi.
// Kartada SO'Z asosiy, matematika esa qisqa dalil (telefonda ustun ~85px),
// shuning uchun yozuv bo'shliqsiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'word_solve_steps', level: '🟡',
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['x,x+1'],
      label: L("noma'lumni belgilaymiz", 'обозначаем неизвестное', 'denote the unknown') },
    { id: 'l2', tokens: ['x(x+1)=56'],
      label: L('tenglama tuzamiz', 'составляем уравнение', 'build the equation') },
    { id: 'l3', tokens: ['x=7;x=−8'],
      label: L('tenglamani yechamiz', 'решаем уравнение', 'solve the equation') },
    { id: 'l4', tokens: ['x=7'],
      label: L('zid ildizni rad etamiz', 'отбрасываем противоречащий корень', 'reject the contradicting root') },
  ],
  start: ['l2', 'l1', 'l4', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Masala: ikki ketma-ket natural sonning ko'paytmasi 56 ga teng, kichigini toping. Yechim to'rt qadamdan iborat, lekin qadamlar aralashib ketgan.",
    'Задача: произведение двух последовательных натуральных чисел равно 56, найди меньшее. Решение состоит из четырёх шагов, но шаги перепутаны.',
    'The problem: the product of two consecutive natural numbers is 56, find the smaller one. The solution has four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval belgilash: kichik son x, keyingisi x qo'shuv bir — shundan keyingina masalani yozuvga o'tkazish mumkin. Keyin tenglama: x karra x qo'shuv bir ellik oltiga teng. Undan keyin yechish: ildizlar yetti va minus sakkiz. Va faqat oxirida rad etish: masalada NATURAL son so'ralgan, minus sakkiz esa natural emas — javobda yetti qoladi. Tekshirish: yetti karra sakkiz ellik olti.",
    'Верно. Сначала обозначение: меньшее число x, следующее x плюс один — только после этого задачу можно перевести в запись. Потом уравнение: x на скобку x плюс один равно пятидесяти шести. Затем решение: корни семь и минус восемь. И только в конце отбрасывание: в задаче спрашивали НАТУРАЛЬНОЕ число, а минус восемь натуральным не является — в ответе остаётся семь. Проверка: семь на восемь пятьдесят шесть.',
    'Correct. First the notation: the smaller number is x, the next is x plus one — only then can the problem be turned into a record. Then the equation: x times the bracket x plus one equals fifty six. Then the solving: the roots are seven and minus eight. And only at the end the rejection: the problem asked for a NATURAL number, and minus eight is not natural — seven remains in the answer. Check: seven times eight is fifty six.'),
  wrongs: [
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Rad etish ILDIZLARDAN keyin turadi. Hozircha rad etadigan narsa yo'q: yetti ham, minus sakkiz ham hali topilmagan. Solishtirish oxirgi qadam, chunki u tayyor ildizlarni talab qiladi.",
      'Отбрасывание идёт ПОСЛЕ корней. Пока отбрасывать нечего: ни семь, ни минус восемь ещё не найдены. Сверка — последний шаг, ведь ей нужны готовые корни.',
      'The rejection comes AFTER the roots. So far there is nothing to reject: neither seven nor minus eight has been found. The comparison is the last step, since it needs the roots ready.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Tenglamani belgilashdan OLDIN yozib bo'lmaydi: x nimani bildirishini aytmasdan turib x karra x qo'shuv bir degan yozuvning ma'nosi yo'q. Birinchi qadam — noma'lumni tanlash va ikkinchi kattalikni shu harf orqali yozish.",
      'Уравнение нельзя записать ДО обозначения: пока не сказано, что означает x, запись x на скобку x плюс один не имеет смысла. Первый шаг — выбрать неизвестное и выразить через эту букву вторую величину.',
      'The equation cannot be written BEFORE the notation: until it is said what x stands for, the record x times the bracket x plus one means nothing. The first step is to choose the unknown and express the second quantity through that letter.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Javobdan yoki ildizlardan boshlab bo'lmaydi — ular ishning natijasi. Masala matndan boshlanadi: qaysi kattalik noma'lum va qolganlari u orqali qanday yoziladi.",
      'Начинать с ответа или с корней нельзя — они результат работы. Задача начинается с текста: какая величина неизвестна и как через неё выражаются остальные.',
      'You cannot start with the answer or the roots — they are the result of the work. The problem starts with the text: which quantity is unknown and how the others are expressed through it.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Yechish uchun avval TENGLAMA kerak. Ildizlar biror joydan o'z-o'zidan chiqmaydi: ular x karra x qo'shuv bir ellik oltiga teng degan yozuvdan chiqadi.",
      'Чтобы решать, сначала нужно УРАВНЕНИЕ. Корни не берутся сами собой: они выходят из записи x на скобку x плюс один равно пятидесяти шести.',
      'To solve, an EQUATION is needed first. Roots do not appear by themselves: they come out of the record x times the bracket x plus one equals fifty six.') },
  ],
  wrongText: L(
    "Belgilash birinchi, rad etish oxirgi. Har qadam oldingisining natijasidan foydalanadi: tenglama belgilashdan, ildizlar tenglamadan, rad etish esa ildizlardan.",
    'Обозначение первое, отбрасывание последнее. Каждый шаг пользуется результатом предыдущего: уравнение — обозначением, корни — уравнением, отбрасывание — корнями.',
    'The notation comes first, the rejection last. Each step uses the result of the previous one: the equation uses the notation, the roots use the equation, the rejection uses the roots.'),
};

export default function D21_07(props) { return <SwapOrder data={DATA} {...props} />; }
