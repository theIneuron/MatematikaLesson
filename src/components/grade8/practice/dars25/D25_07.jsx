// Dars25 · Amaliyot 07 — Pazl · 🟡 · tag: reversed_reading
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §7 (25-dars, 7-pozitsiya)
//
// NOMA'LUM O'NG TOMONDA. `4 < x` ni «x to'rtdan kichik» deb o'qish — eng
// ko'p uchraydigan xato, va u 23-darsning З49 si bilan bir ildizdan:
// tengsizlikda TARTIB ma'noni belgilaydi.
//
// Yozuvni aylantirganda belgi ham aylanadi: to'rt x dan kichik bo'lsa,
// x to'rtdan KATTA. Uchinchi juftlik tenglik bilan: u aylantirilganda
// o'zgarmaydi, va shu farq qoidani ochib beradi.
// Kartalarda yozuv bo'shliqsiz (skelet §0a.3).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'reversed_reading', level: '🟡',
  faceSize: 14, faceSizePhone: 12,
  cards: [
    { id: 'f1', side: 0, tokens: ['4<x'] },
    { id: 'f2', side: 0, tokens: ['4>x'] },
    { id: 'f3', side: 0, tokens: ['4=x'] },
    { id: 'v1', side: 1, v: 'x>4' },
    { id: 'v2', side: 1, v: 'x<4' },
    { id: 'v3', side: 1, v: 'x=4' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuvda noma'lum O'NG tomonda turibdi. Ularni odatdagi ko'rinishga — x chapda turadigan ko'rinishga — keltirish kerak.",
    'В трёх записях неизвестное стоит СПРАВА. Их надо привести к привычному виду, где x стоит слева.',
    'In three records the unknown stands on the RIGHT. They must be brought to the usual form, with x on the left.'),
  ask: L(
    'Yozuvni bosing, keyin uyani bosing.',
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Yozuvni aylantirganda belgi ham aylanadi: to'rt x dan kichik bo'lsa, x to'rtdan katta. Tenglik esa aylanishdan o'zgarmaydi. Tekshiring: x besh bo'lsa, to'rt beshdan kichik va besh to'rtdan katta.",
    'Верно. При перевороте записи знак тоже переворачивается: если четыре меньше x, то x больше четырёх. А равенство при перевороте не меняется. Проверь: при x равном пяти четыре меньше пяти, и пять больше четырёх.',
    'Correct. Turning a record around turns the sign around too: if four is less than x, then x is greater than four. An equality does not change when turned. Check: at x equal to five, four is less than five and five is greater than four.'),
  wrongs: [
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Bu yozuvda TO'RT chapda turibdi: to'rt x dan kichik. Demak x to'rtdan KATTA. Belgiga qarab emas, MA'NOGA qarab o'qing: kim kichik — to'rt; kim katta — x. Sonda tekshiring: x olti bo'lsin — to'rt oltidan kichik, va olti to'rtdan katta. Ikkalasi bir xil gap.",
      'В этой записи ЧЕТЫРЁХ стоит слева: четыре меньше x. Значит x БОЛЬШЕ четырёх. Читай не по знаку, а по СМЫСЛУ: кто меньше — четыре; кто больше — x. Проверь числом: пусть x равен шести — четыре меньше шести, и шесть больше четырёх. Это одно и то же.',
      'In this record FOUR is on the left: four is less than x. So x is GREATER than four. Read by MEANING, not by the sign: who is smaller — four; who is greater — x. Check with a number: let x be six — four is less than six, and six is greater than four. The same statement.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Bu yozuvda to'rt KATTA: to'rt x dan katta. Demak x to'rtdan kichik. Sonda tekshiring: x ikki bo'lsin — to'rt ikkidan katta, va ikki to'rtdan kichik. Yozuvni aylantirganda belgi ham aylanishi kerak, aks holda ma'no teskari bo'lib qoladi.",
      'В этой записи четыре БОЛЬШЕ: четыре больше x. Значит x меньше четырёх. Проверь числом: пусть x равен двум — четыре больше двух, и два меньше четырёх. При перевороте записи знак тоже должен перевернуться, иначе смысл станет обратным.',
      'In this record four is the GREATER one: four is greater than x. So x is less than four. Check with a number: let x be two — four is greater than two, and two is less than four. When a record is turned around the sign must turn too, otherwise the meaning reverses.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Tenglik aylantirilganda O'ZGARMAYDI: to'rt x ga teng bo'lsa, x ham to'rtga teng. Aylanish faqat «katta» va «kichik» belgilarida bo'ladi, chunki ular ikki tomonni ajratadi. Tenglik esa ikki tomonni tenglashtiradi, ya'ni unda ajratadigan narsa yo'q.",
      'Равенство при перевороте НЕ МЕНЯЕТСЯ: если четыре равно x, то и x равен четырём. Переворот бывает только у знаков «больше» и «меньше», ведь они различают стороны. А равенство стороны уравнивает, различать в нём нечего.',
      'An equality does NOT change when turned around: if four equals x, then x equals four. Turning applies only to «greater» and «less», since they distinguish the sides. An equality makes the sides the same, so there is nothing to distinguish.') },
  ],
  wrongText: L(
    "Yozuvni aylantirganda belgi ham aylanadi. Ma'noni o'qing: qaysi kattalik kichik, qaysi biri katta. Javobni son qo'yib tekshiring.",
    'При перевороте записи знак тоже переворачивается. Читай смысл: какая величина меньше, какая больше. Проверь ответ подстановкой числа.',
    'Turning a record around turns the sign around too. Read the meaning: which quantity is smaller, which is greater. Check your answer by substituting a number.'),
};

export default function D25_07(props) { return <PairSlots data={DATA} {...props} />; }
