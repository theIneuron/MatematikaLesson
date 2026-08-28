// Dars03 · Amaliyot 05 — Guruhlar · 🟡 · teg: a-kattaligi-ishorasi
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md §05
//
// a ning ISHORASI tarmoqlar qayoqqa qarashini hal qiladi, KATTALIGI esa
// parabola qanchalik tor ekanini. Ikki narsa alohida — tuzoq shu yerdan
// chiqadi: minus nol butun besh ham keng, ham pastga qaragan.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'a-kattaligi-ishorasi', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Hamma yozuv y = x² bilan solishtiriladi. Guruhni a soni hal qiladi: uning ishorasi ham, kattaligi ham.",
    'Все записи сравниваются с y = x². Группу решает число a: и его знак, и его величина.',
    'Every record is compared with y = x². The group is decided by a: both its sign and its size.'),
  ask: L("Har bir yozuvni o'z guruhiga qo'ying.", 'Разложи каждую запись в свою группу.', 'Put each record into its own group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  zoneLbl: 128, zoneSize: 15, itemSize: 16,
  zones: [
    { id: 'a', label: L('y = x² dan tor, yuqoriga', 'Уже, чем y = x², вверх', 'Narrower than y = x², upward') },
    { id: 'b', label: L('y = x² dan keng, yuqoriga', 'Шире, чем y = x², вверх', 'Wider than y = x², upward') },
    { id: 'c', label: L('Pastga qaragan', 'Направлена вниз', 'Opening downward') },
  ],
  items: [
    { id: 'i1', tokens: ['y = 4x²'], zone: 'a' },
    { id: 'i2', tokens: ['y = 3x²'], zone: 'a' },
    { id: 'i3', tokens: ['y = 0,2x²'], zone: 'b' },
    { id: 'i4', tokens: ['y = 0,5x²'], zone: 'b' },
    { id: 'i5', tokens: ['y = −5x²'], zone: 'c' },
    { id: 'i6', tokens: ['y = −0,5x²'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. a ning ISHORASI tarmoqlar qayoqqa qarashini hal qiladi, KATTALIGI esa parabola qanchalik tor ekanini. Birdan katta son parabolani toraytiradi, birdan kichigi kengaytiradi. Bu ikki narsa alohida: manfiy son ham tor, ham keng parabola berishi mumkin.",
    'Верно. ЗНАК a решает, куда смотрят ветви, а ВЕЛИЧИНА — насколько парабола узкая. Число больше единицы сужает параболу, меньше единицы — расширяет. Это две отдельные вещи: отрицательное число может дать и узкую, и широкую параболу.',
    'Correct. The SIGN of a decides which way the branches point, and its SIZE decides how narrow the parabola is. A number bigger than one narrows the parabola, a number smaller than one widens it. These are two separate things: a negative number can give either a narrow or a wide parabola.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Birdan kichik songa ko'paytirilganda qiymatlar kichrayadi, ya'ni parabola pastroq va KENGROQ bo'ladi. Bir nechta iks da qiymatni hisoblab solishtiring.",
      'При умножении на число меньше единицы значения уменьшаются, то есть парабола становится ниже и ШИРЕ. Посчитай значения при нескольких икс и сравни.',
      'Multiplying by a number smaller than one makes the values smaller, so the parabola gets lower and WIDER. Compute values at a few x and compare.') },
    { when: (s) => s.place.i5 !== 'c' || s.place.i6 !== 'c', text: L(
      "Bu guruhni kattalik emas, ISHORA hal qiladi: a manfiy bo'lsa, tarmoqlar pastga qaraydi.",
      'Эту группу решает не величина, а ЗНАК: если a отрицательно, ветви смотрят вниз.',
      'This group is decided not by size but by SIGN: if a is negative, the branches point downward.') },
    { when: (s) => s.place.i1 === 'b' || s.place.i2 === 'b', text: L(
      "To'rt va uch birdan katta, ya'ni qiymatlar tezroq o'sadi va parabola torayadi.",
      'Четыре и три больше единицы, значит значения растут быстрее и парабола сужается.',
      'Four and three are bigger than one, so the values grow faster and the parabola narrows.') },
  ],
  wrongText: L(
    "Har yozuvga ikkita savol bering: a musbatmi yoki manfiy, va u birdan kattami yoki kichik?",
    'Задай каждой записи два вопроса: a положительное или отрицательное, и оно больше единицы или меньше?',
    'Ask two questions of every record: is a positive or negative, and is it bigger or smaller than one?'),
};

export default function D03_05(props) { return <Zones data={DATA} {...props} />; }
