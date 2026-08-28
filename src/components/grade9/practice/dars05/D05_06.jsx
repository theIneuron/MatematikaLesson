// Dars05 · Amaliyot 06 — Guruhlar · 🟡 · teg: gorizontal-vertikal-almashinish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md §06
//
// Guruhni FAQAT qavs hal qiladi. Ikkita yozuvda qavsdan tashqarida ham son
// bor — u guruhga ta'sir qilmaydi, bu tuzoq. Ikkitasida qavs umuman yo'q.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'gorizontal-vertikal-almashinish', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Hamma yozuv y = x² bilan solishtiriladi. Guruhni qavs ichidagi son hal qiladi.",
    'Все записи сравниваются с y = x². Группу решает число в скобке.',
    'Every record is compared with y = x². The group is decided by the number in the bracket.'),
  ask: L("Har bir yozuvni o'z guruhiga qo'ying.", 'Разложи каждую запись в свою группу.', 'Put each record into its own group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  zoneLbl: 126, zoneSize: 15, itemSize: 16,
  zones: [
    { id: 'a', label: L("O'ngga siljigan", 'Сдвинута вправо', 'Shifted right') },
    { id: 'b', label: L('Chapga siljigan', 'Сдвинута влево', 'Shifted left') },
    { id: 'c', label: L('Faqat yuqoriga yoki pastga', 'Только вверх или вниз', 'Only up or down') },
  ],
  items: [
    { id: 'i1', tokens: ['y = (x − 6)²'], zone: 'a' },
    { id: 'i2', tokens: ['y = (x − 7)² + 2'], zone: 'a' },
    { id: 'i3', tokens: ['y = (x + 5)²'], zone: 'b' },
    { id: 'i4', tokens: ['y = (x + 1)² − 3'], zone: 'b' },
    { id: 'i5', tokens: ['y = x² + 6'], zone: 'c' },
    { id: 'i6', tokens: ['y = x² − 8'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Qavsda minus tursa — o'ngga, qo'shuv tursa — chapga. Qavs umuman bo'lmasa, gorizontal siljish yo'q: bunday parabola faqat yuqoriga yoki pastga ko'chadi. Qavsdan tashqaridagi son bu guruhni hal qilmaydi, u faqat balandlikni o'zgartiradi.",
    'Верно. Минус в скобке — сдвиг вправо, плюс — влево. Если скобки нет вовсе, горизонтального сдвига нет: такая парабола двигается только вверх или вниз. Число за скобкой эту группу не решает, оно меняет лишь высоту.',
    'Correct. A minus in the bracket means a shift to the right, a plus means to the left. With no bracket at all there is no horizontal shift: such a parabola only moves up or down. The number outside the bracket does not decide this group; it only changes the height.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'b' || s.place.i2 === 'b', text: L(
      "Qavsda minus turibdi. Uni nolga tenglashtiring: hosil bo'lgan son musbat, ya'ni uchi noldan o'ngda.",
      'В скобке стоит минус. Приравняй её к нулю: получится положительное число, значит вершина правее нуля.',
      'The bracket holds a minus. Set it to zero: the result is positive, so the vertex is to the right of zero.') },
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Qavsda qo'shuv turibdi, demak qavs manfiy sonda nolga aylanadi va uchi chapda.",
      'В скобке стоит плюс, значит скобка обращается в нуль при отрицательном числе и вершина слева.',
      'The bracket holds a plus, so it becomes zero at a negative number and the vertex is on the left.') },
    { when: (s) => s.place.i5 !== 'c' || s.place.i6 !== 'c', text: L(
      "Bu yozuvlarda qavs umuman yo'q, ya'ni iks toza turibdi. Gorizontal siljish qavsdan chiqadi, undan boshqa joydan emas.",
      'В этих записях скобки нет вовсе, икс стоит чистым. Горизонтальный сдвиг берётся из скобки и ниоткуда больше.',
      'These records have no bracket at all, x stands bare. A horizontal shift comes from the bracket and nowhere else.') },
    { when: (s) => s.place.i2 === 'c' || s.place.i4 === 'c', text: L(
      "Qavsdan tashqaridagi son bu guruhni hal qilmaydi. Avval qavsga qarang: u yerda son bormi?",
      'Число за скобкой эту группу не решает. Сначала посмотри в скобку: есть ли там число?',
      'The number outside the bracket does not decide this group. Look inside the bracket first: is there a number there?') },
  ],
  wrongText: L(
    "Har yozuvda faqat QAVSGA qarang. Qavs yo'q — vertikal; qavsda minus — o'ngga; qavsda qo'shuv — chapga.",
    'Смотри в каждой записи только на СКОБКУ. Скобки нет — вертикаль; минус в скобке — вправо; плюс — влево.',
    'Look only at the BRACKET in each record. No bracket means vertical; a minus means right; a plus means left.'),
};

export default function D05_06(props) { return <Zones data={DATA} {...props} />; }
