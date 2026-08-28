// Dars04 · Amaliyot 05 — Guruhlar · 🟡 · teg: x0-formula-belgisi
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md §05
//
// Butun topshiriq −b/(2a) ning ISHORASIGA qurilgan: aniq son hisoblash
// shart emas, lekin ishorani chalkashtirish darrov ko'rinadi. a ning
// kattaligi bu yerda hech nimani hal qilmaydi — tuzoq shu.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'x0-formula-belgisi', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Uchining aniq o'rnini hisoblash shart emas: guruhni uning ishorasi hal qiladi.",
    'Точное место вершины считать не нужно: группу решает её знак.',
    'There is no need to compute the exact place of the vertex: the group is decided by its sign.'),
  ask: L("Har bir yozuvni o'z guruhiga qo'ying.", 'Разложи каждую запись в свою группу.', 'Put each record into its own group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  zoneLbl: 122, zoneSize: 15, itemSize: 16,
  zones: [
    { id: 'a', label: L('Uchi Oy dan chapda', 'Вершина левее Oy', 'Vertex left of Oy') },
    { id: 'b', label: L("Uchi Oy o'qida", 'Вершина на оси Oy', 'Vertex on the Oy axis') },
    { id: 'c', label: L("Uchi Oy dan o'ngda", 'Вершина правее Oy', 'Vertex right of Oy') },
  ],
  items: [
    { id: 'i1', tokens: ['y = x² + 6x'], zone: 'a' },
    { id: 'i2', tokens: ['y = x² + 2x + 5'], zone: 'a' },
    { id: 'i3', tokens: ['y = x² − 7'], zone: 'b' },
    { id: 'i4', tokens: ['y = 3x² + 1'], zone: 'b' },
    { id: 'i5', tokens: ['y = x² − 10x'], zone: 'c' },
    { id: 'i6', tokens: ['y = 2x² − 4x'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Uchining abssissasi b ning QARAMA-QARSHISIDAN chiqadi, shuning uchun musbat b chap tomonni, manfiy b esa o'ng tomonni beradi. b umuman bo'lmasa, uchi Oy o'qida turadi. a ning kattaligi bu yerda hech nimani hal qilmaydi — u faqat sonning kattaligini o'zgartiradi, ishorasini emas.",
    'Верно. Абсцисса вершины получается из ПРОТИВОПОЛОЖНОГО к b, поэтому положительное b даёт левую сторону, а отрицательное — правую. Если члена с икс нет вовсе, вершина стоит на оси Oy. Величина a здесь ничего не решает — она меняет размер числа, но не знак.',
    'Correct. The abscissa of the vertex comes from the OPPOSITE of b, so a positive b gives the left side and a negative b the right. If there is no x term at all, the vertex sits on the Oy axis. The size of a decides nothing here — it changes the size of the number, not its sign.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'c' || s.place.i2 === 'c', text: L(
      "b musbat, formulada esa uning oldida minus turibdi. Musbat sonning qarama-qarshisi qaysi tomonda?",
      'b положительно, а в формуле перед ним стоит минус. С какой стороны находится число, противоположное положительному?',
      'b is positive, and the formula has a minus in front of it. On which side does the opposite of a positive number lie?') },
    { when: (s) => s.place.i5 === 'a' || s.place.i6 === 'a', text: L(
      "b manfiy, uning qarama-qarshisi musbat. Ikki minus birga aylanadi.",
      'b отрицательно, противоположное к нему положительно. Два минуса дают плюс.',
      'b is negative, and its opposite is positive. Two minuses make a plus.') },
    { when: (s) => s.place.i3 !== 'b' || s.place.i4 !== 'b', text: L(
      "Bu yozuvlarda iks li had umuman yo'q, ya'ni b nolga teng. Nolning qarama-qarshisi ham nol.",
      'В этих записях члена с икс нет вовсе, то есть b равно нулю. Противоположное к нулю — тоже нуль.',
      'These records have no x term at all, so b is zero. The opposite of zero is zero.') },
    { when: (s) => s.place.i6 !== 'c', text: L(
      "a ikkiga teng bo'lgani sonni ikki barobar kichraytiradi, lekin ishorani o'zgartirmaydi. Ishorani faqat b hal qiladi.",
      'То, что a равно двум, уменьшает число вдвое, но знак не меняет. Знак решает только b.',
      'That a equals two halves the number but does not change its sign. Only b decides the sign.') },
  ],
  wrongText: L(
    "Har yozuvda b ni toping va uning qarama-qarshisiga qarang. Musbat bo'lsa — o'ngda, manfiy bo'lsa — chapda, nol bo'lsa — o'qning o'zida.",
    'Найди в каждой записи b и посмотри на противоположное к нему. Положительное — справа, отрицательное — слева, нуль — на самой оси.',
    'Find b in every record and look at its opposite. Positive means right, negative means left, zero means on the axis itself.'),
};

export default function D04_05(props) { return <Zones data={DATA} {...props} />; }
