// Dars06 · Amaliyot 04 — Guruhlar · 🟡 · teg: javob-doim-tashqi-oraliq
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md §04
//
// Bir xil ko'paytma ikki marta, faqat tengsizlik ishorasi boshqa. Guruhni
// AYNAN shu ishora hal qiladi, ko'paytuvchilar emas — shuning uchun
// «javob doim tashqi oraliq» degan yolg'on qoida shu yerda ochiladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'javob-doim-tashqi-oraliq', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Hamma yozuvda tarmoqlar yuqoriga qaragan. Guruhni tengsizlik ishorasi hal qiladi.",
    'Во всех записях ветви направлены вверх. Группу решает знак неравенства.',
    'In every record the branches point up. The group is decided by the sign of the inequality.'),
  ask: L("Har bir yozuvni o'z guruhiga qo'ying.", 'Разложи каждую запись в свою группу.', 'Put each record into its own group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  zoneLbl: 122, zoneSize: 15, itemSize: 15,
  zones: [
    { id: 'a', label: L('Javob ichki oraliq', 'Ответ — внутренний промежуток', 'Answer is an inner interval') },
    { id: 'b', label: L('Javob ikkita nur', 'Ответ — два луча', 'Answer is two rays') },
    { id: 'c', label: L('Javob barcha sonlar', 'Ответ — все числа', 'Answer is all numbers') },
  ],
  items: [
    { id: 'i1', tokens: ['(x − 1)(x − 7) < 0'], zone: 'a' },
    { id: 'i2', tokens: ['(x + 3)(x − 2) < 0'], zone: 'a' },
    { id: 'i3', tokens: ['(x − 1)(x − 7) > 0'], zone: 'b' },
    { id: 'i4', tokens: ['(x + 3)(x − 2) > 0'], zone: 'b' },
    { id: 'i5', tokens: ['x² + 4 > 0'], zone: 'c' },
    { id: 'i6', tokens: ['(x − 2)² + 1 > 0'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Bir xil ko'paytma ikki xil javob berdi: kichik so'ralganda nollar orasidagi oraliq, katta so'ralganda esa ikki chet. Oxirgi ikkitasida ko'paytma hech qachon nolga aylanmaydi va har doim musbat — shuning uchun javob barcha sonlar.",
    'Верно. Одно и то же произведение дало два разных ответа: при «меньше» — промежуток между нулями, при «больше» — два края. В последних двух произведение никогда не обращается в нуль и всегда положительно, поэтому ответ — все числа.',
    'Correct. The same product gave two different answers: with "less than" it is the interval between the zeros, with "greater than" it is the two ends. In the last two the product never becomes zero and is always positive, so the answer is all numbers.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'b' || s.place.i2 === 'b', text: L(
      "Kichik so'ralyapti, ya'ni ko'paytma manfiy bo'ladigan joy kerak. Nollar orasidan bitta son olib sinang.",
      'Спрашивают «меньше», значит нужно место, где произведение отрицательно. Возьми число между нулями и проверь.',
      '"Less than" is asked, so you need where the product is negative. Take a number between the zeros and check.') },
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Katta so'ralyapti, ya'ni ko'paytma musbat bo'ladigan joy. Nollardan uzoqroq son oling: ikkala qavs ham bir xil ishorada bo'ladi.",
      'Спрашивают «больше», значит нужно место, где произведение положительно. Возьми число подальше от нулей: обе скобки будут одного знака.',
      '"Greater than" is asked, so you need where the product is positive. Take a number far from the zeros: both brackets will have the same sign.') },
    { when: (s) => s.place.i5 !== 'c' || s.place.i6 !== 'c', text: L(
      "Bu yozuvlarni nolga tenglashtirib ko'ring: iks kvadrat qo'shuv to'rt hech qachon nolga aylanmaydi. Nol yo'q bo'lsa, ishora ham almashmaydi.",
      'Приравняй эти записи к нулю: икс в квадрате плюс четыре в нуль не обращается никогда. Если нулей нет, то и знак не меняется.',
      'Set these records to zero: x squared plus four never becomes zero. With no zeros there is no sign change either.') },
  ],
  wrongText: L(
    "Har yozuvda ikki savol: nollari bormi, va tengsizlikda katta turibdimi yoki kichik?",
    'Два вопроса к каждой записи: есть ли у неё нули и что стоит в неравенстве — «больше» или «меньше»?',
    'Two questions for each record: does it have zeros, and does the inequality say greater or less?'),
};

export default function D06_04(props) { return <Zones data={DATA} {...props} />; }
