// Dars01 · Amaliyot 05 — Guruhlar · 🟡 · teg: three_zones
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md §05
//
// Zona — NOM emas, XOSSA. Uchta zona uch xil holatni ajratadi: maxraj bitta
// sonni kesadi, ildiz butun bir qismni kesadi, ba'zi formulalar esa hech
// nimani kesmaydi.
//
// ASOSIY TUZOQ — `6/(x² + 4)`: maxraj bor, taqiq yo'q. «Maxraj bo'lsa,
// demak taqiq ham bor» degan yolg'on qoida aynan shu yerda o'ladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'three_zones', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Guruh nomi emas, xossa: formula qaysi sonlarda hisoblanmay qoladi.",
    'Группа — не название, а свойство: где формула перестаёт считаться.',
    'A group is not a name but a property: where the formula stops computing.'),
  ask: L(
    "Har bir yozuvni o'z guruhiga qo'ying.",
    'Разложи каждую запись в свою группу.',
    'Put each record into its own group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  zoneLbl: 122, zoneSize: 15, itemSize: 15,
  zones: [
    { id: 'a', label: L('Hamma sonlarda aniqlangan', 'Определена при всех числах', 'Defined for every number') },
    { id: 'b', label: L('Bitta son chiqarib tashlanadi', 'Исключается одно число', 'One number is excluded') },
    { id: 'c', label: L('Butun bir qism chiqarib tashlanadi', 'Исключается целая часть чисел', 'A whole part is excluded') },
  ],
  items: [
    { id: 'i1', tokens: ['y = 4x + 9'], zone: 'a' },
    { id: 'i2', tokens: ['y =', { n: '6', d: 'x² + 4' }], zone: 'a' },
    { id: 'i3', tokens: ['y =', { n: '1', d: 'x − 6' }], zone: 'b' },
    { id: 'i4', tokens: ['y =', { n: '15', d: 'x + 8' }], zone: 'b' },
    { id: 'i5', tokens: ['y =', { r: 'x + 2' }], zone: 'c' },
    { id: 'i6', tokens: ['y =', { r: '10 − x' }], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Uchta xil holat bor: maxraj bitta sonni kesadi, ildiz butun bir qismni kesadi, ba'zi formulalar esa hech nimani kesmaydi. Maxrajning borligining o'zi hali taqiq degani emas.",
    'Верно. Случаев три: знаменатель вырезает одно число, корень вырезает целую часть, а некоторые формулы не вырезают ничего. Наличие знаменателя само по себе ещё не запрет.',
    'Correct. There are three cases: a denominator cuts out one number, a root cuts out a whole part, and some formulas cut out nothing. Having a denominator is not yet a ban.'),
  wrongs: [
    { when: (s) => s.place.i2 !== 'a', text: L(
      "Maxraj bor, lekin u nolga aylanadimi? Kvadrat manfiy bo'lmaydi, ustiga to'rt qo'shiladi. Bu yig'indi eng kichik holatda nechchiga teng?",
      'Знаменатель есть, но обращается ли он в нуль? Квадрат неотрицателен, к нему прибавляют четыре. Чему равна эта сумма в самом малом случае?',
      'There is a denominator, but does it become zero? A square is never negative, and four is added to it. What is the smallest this sum can be?') },
    { when: (s) => s.place.i4 === 'a', text: L(
      'Maxraj nolga aylanadigan sonni qidiring. U musbat emas, lekin bor.',
      'Поищи число, при котором знаменатель обращается в нуль. Оно не положительное, но оно есть.',
      'Look for the number that makes the denominator zero. It is not positive, but it exists.') },
    { when: (s) => s.place.i6 !== 'c', text: L(
      "Ildiz bitta sonni emas, sonlarning butun bir qismini kesadi. O'n ikkini qo'yib ko'ring: ildiz ostida nima chiqadi?",
      'Корень вырезает не одно число, а целую часть чисел. Подставь двенадцать: что получится под корнем?',
      'A root cuts out not one number but a whole part of the numbers. Try twelve: what appears under the root?') },
    { when: (s) => s.place.i5 === 'a', text: L(
      "Minus beshni qo'ying. Ildiz ostida qanday son hosil bo'ladi va bunday ildiz bormi?",
      'Подставь минус пять. Какое число окажется под корнем и существует ли такой корень?',
      'Put in minus five. What number ends up under the root, and does such a root exist?') },
    { when: (s) => s.place.i1 !== 'a', text: L(
      "Bu yozuvda na maxraj bor, na ildiz. Unda kesiladigan narsa qayerdan chiqadi?",
      'В этой записи нет ни знаменателя, ни корня. Откуда тогда взяться запрету?',
      'This record has neither a denominator nor a root. Where would a ban come from?') },
    { when: (s) => s.place.i3 === 'c', text: L(
      "Maxraj oltida nolga aylanadi. Nolga aylanadigan maxraj bitta sonni kesadi, butun bir qismni emas.",
      'Знаменатель обращается в нуль при шести. Такой знаменатель вырезает одно число, а не целую часть.',
      'The denominator becomes zero at six. Such a denominator cuts out one number, not a whole part.') },
  ],
  wrongText: L(
    "Har yozuvga bitta savol bering: bu formula qaysi sonda hisoblanmay qoladi? Javob uch xil bo'ladi — hech qaysida, bitta sonda yoki butun bir qismda.",
    'Задай каждой записи один вопрос: при каком числе эта формула перестаёт считаться? Ответов три — ни при каком, при одном числе, при целой части.',
    'Ask every record one question: at which number does this formula stop computing? There are three answers — at none, at one number, at a whole part.'),
};

export default function D01_05(props) { return <Zones data={DATA} {...props} />; }
