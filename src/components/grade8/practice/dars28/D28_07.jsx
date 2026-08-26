// Dars28 · Amaliyot 07 — Tartib · 🟡 · tag: word_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §10 (28-dars, 7-pozitsiya)
//
// T1, T2, T3 BIR QATORDA. Oxirgi qadam — butun sonli javobni tanlash — eng
// ko'p tashlab ketiladigan qadam (З57): tengsizlik yechilgandan keyin ish
// tugagandek tuyuladi, va javobda «olti butun oltidan o'n daftar» qolib
// ketadi.
//
// Kartada SO'Z asosiy, matematika qisqa dalil, yozuv bo'shliqsiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'word_steps', level: '🟡',
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['x'],
      label: L("x — daftarlar soni", 'x — число тетрадей', 'x is the number of notebooks') },
    { id: 'l2', tokens: ['3000x≤20000'],
      label: L('tengsizlik tuzamiz', 'составляем неравенство', 'build the inequality') },
    { id: 'l3', tokens: ['x≤6,6'],
      label: L('tengsizlikni yechamiz', 'решаем неравенство', 'solve the inequality') },
    { id: 'l4', tokens: ['x=6'],
      label: L('butun javobni tanlaymiz', 'выбираем целый ответ', 'choose the whole answer') },
  ],
  start: ['l2', 'l1', 'l4', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Masala: bitta daftar 3000 so'm, Azizda 20000 so'm bor, u eng ko'pi bilan nechta daftar oladi. Yechim to'rt qadamdan iborat, lekin qadamlar aralashib ketgan.",
    'Задача: одна тетрадь 3000 сумов, у Азиза 20000 сумов, сколько тетрадей он купит самое большее. Решение состоит из четырёх шагов, но шаги перепутаны.',
    'The problem: one notebook costs 3000 soums, Aziz has 20000 soums, at most how many notebooks can he buy. The solution has four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval belgilash: x — daftarlarning soni. Keyin tengsizlik: uch ming x yigirma mingdan kichik yoki teng. Undan keyin yechish: ikkala qismni uch mingga bo'lamiz va x olti butun oltidan o'ndan kichik yoki teng bo'ladi. Va faqat oxirida javob: daftarlarning soni butun bo'lishi kerak, demak eng kattasi olti. Oxirgi qadamni tashlab ketsangiz, javobda kasr son qoladi — daftarning bo'lagini esa sotib bo'lmaydi.",
    'Верно. Сначала обозначение: x — число тетрадей. Потом неравенство: три тысячи x меньше или равно двадцати тысячам. Затем решение: делим обе части на три тысячи и получаем, что x меньше или равен шести целым шести десятым. И только в конце ответ: число тетрадей должно быть целым, значит наибольшее это шесть. Пропустишь последний шаг — в ответе останется дробь, а часть тетради не купишь.',
    'Correct. First the notation: x is the number of notebooks. Then the inequality: three thousand x is less than or equal to twenty thousand. Then the solving: divide both sides by three thousand and x turns out less than or equal to six point six. And only at the end the answer: the count of notebooks must be whole, so the largest is six. Skip the last step and a fraction stays in the answer — but part of a notebook cannot be bought.'),
  wrongs: [
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Butun javobni tanlash YECHIMDAN keyin bo'ladi: tanlaydigan narsa hali topilmagan. Avval x olti butun oltidan o'ndan kichik yoki teng degan yechim kerak, undan keyingina undagi eng katta butun son olinadi.",
      'Выбор целого ответа идёт ПОСЛЕ решения: выбирать пока не из чего. Сначала нужно решение x меньше или равен шести целым шести десятым, и только потом из него берут наибольшее целое.',
      'Choosing the whole answer comes AFTER the solving: there is nothing to choose from yet. First the solution x less than or equal to six point six is needed, and only then is the largest whole number taken from it.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Tengsizlikni belgilashdan OLDIN yozib bo'lmaydi: x nimani bildirishini aytmasdan turib uch ming x degan yozuvning ma'nosi yo'q. Birinchi qadam — noma'lumni tanlash.",
      'Неравенство нельзя записать ДО обозначения: пока не сказано, что означает x, запись три тысячи x не имеет смысла. Первый шаг — выбрать неизвестное.',
      'The inequality cannot be written BEFORE the notation: until it is said what x stands for, the record three thousand x means nothing. The first step is to choose the unknown.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Javobdan yoki yechimdan boshlab bo'lmaydi — ular ishning natijasi. Masala matndan boshlanadi: qaysi kattalik noma'lum.",
      'Начинать с ответа или с решения нельзя — они результат работы. Задача начинается с текста: какая величина неизвестна.',
      'You cannot start with the answer or the solution — they are the result of the work. The problem starts with the text: which quantity is unknown.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Yechish uchun avval TENGSIZLIK kerak. Olti butun oltidan o'n degan son o'z-o'zidan chiqmaydi: u uch ming x yigirma mingdan kichik yoki teng degan yozuvdan chiqadi.",
      'Чтобы решать, сначала нужно НЕРАВЕНСТВО. Шесть целых шесть десятых не берутся сами собой: они выходят из записи три тысячи x меньше или равно двадцати тысячам.',
      'To solve, an INEQUALITY is needed first. Six point six does not appear by itself: it comes out of the record three thousand x less than or equal to twenty thousand.') },
  ],
  wrongText: L(
    "Belgilash birinchi, butun javob oxirgi. Tengsizlikning yechimi hali javob emas: masala butun sonni so'rayapti.",
    'Обозначение первое, целый ответ последний. Решение неравенства — ещё не ответ: задача спрашивает целое число.',
    'The notation comes first, the whole answer last. The solution of the inequality is not yet the answer: the problem asks for a whole number.'),
};

export default function D28_07(props) { return <SwapOrder data={DATA} {...props} />; }
