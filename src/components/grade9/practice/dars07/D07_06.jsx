// Dars07 · Amaliyot 06 — Guruhlar · 🟡 · teg: butun-vs-kasr-tenglama
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// Uchinchi zona alohida: tenglama BO'LISHI uchun tenglik belgisi kerak.
// Ikkita yozuvda u yo'q — ular ifoda, tenglama emas.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'butun-vs-kasr-tenglama', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Guruhni ikki narsa hal qiladi: tenglik belgisi bormi va maxrajda iks turibdimi.",
    'Группу решают две вещи: есть ли знак равенства и стоит ли икс в знаменателе.',
    'Two things decide the group: is there an equals sign, and does x stand in a denominator.'),
  ask: L("Har bir yozuvni o'z guruhiga qo'ying.", 'Разложи каждую запись в свою группу.', 'Put each record into its own group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  zoneLbl: 126, zoneSize: 15, itemSize: 15,
  zones: [
    { id: 'a', label: L('Butun tenglama', 'Целое уравнение', 'Integer equation') },
    { id: 'b', label: L('Kasr-ratsional tenglama', 'Дробно-рациональное уравнение', 'Fractional equation') },
    { id: 'c', label: L('Umuman tenglama emas', 'Вообще не уравнение', 'Not an equation at all') },
  ],
  items: [
    { id: 'i1', tokens: ['3(x − 1) = 7'], zone: 'a' },
    { id: 'i2', tokens: ['x² − 2x = 5'], zone: 'a' },
    { id: 'i3', tokens: ['4/(x + 2) = 1'], zone: 'b' },
    { id: 'i4', tokens: ['(x − 1)/x = 3'], zone: 'b' },
    { id: 'i5', tokens: ['2x + 5'], zone: 'c' },
    { id: 'i6', tokens: ['x² − 9'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Tenglama bo'lishi uchun tenglik belgisi kerak: oxirgi ikkitasi shunchaki ifoda, ularni yechib bo'lmaydi. Qolgan to'rttasini esa maxraj ajratadi: iks maxrajda tursa — kasr-ratsional, turmasa — butun. Daraja va qavslar bu bo'linishga ta'sir qilmaydi.",
    'Верно. Чтобы запись была уравнением, нужен знак равенства: последние две — просто выражения, их не решишь. А остальные четыре делит знаменатель: икс в знаменателе — дробно-рациональное, нет — целое. Степень и скобки на это деление не влияют.',
    'Correct. To be an equation a record needs an equals sign: the last two are just expressions and cannot be solved. The other four are split by the denominator: x in a denominator makes it fractional, otherwise it is integer. Powers and brackets do not affect this split.'),
  wrongs: [
    { when: (s) => s.place.i5 !== 'c' || s.place.i6 !== 'c', text: L(
      "Bu yozuvlarda tenglik belgisi yo'q. Ularni yechib bo'lmaydi: yechish uchun nimadir nimagadir teng bo'lishi kerak.",
      'В этих записях нет знака равенства. Их нельзя решить: чтобы решать, что-то должно чему-то равняться.',
      'These records have no equals sign. They cannot be solved: to solve, something must equal something.') },
    { when: (s) => s.place.i2 === 'b', text: L(
      "Iks kvadrat maxrajda emas, suratda turibdi. Daraja tenglamani kasr-ratsional qilmaydi.",
      'Икс в квадрате стоит не в знаменателе, а в числителе. Степень не делает уравнение дробно-рациональным.',
      'x squared stands in the numerator, not the denominator. A power does not make an equation fractional.') },
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Bu yozuvlarda iks MAXRAJDA turibdi, ya'ni bo'luvchi harfga bog'liq. Shuning uchun ular kasr-ratsional va ODZ talab qiladi.",
      'В этих записях икс стоит В ЗНАМЕНАТЕЛЕ, то есть делитель зависит от буквы. Поэтому они дробно-рациональные и требуют ОДЗ.',
      'In these records x stands IN THE DENOMINATOR, so the divisor depends on the letter. That makes them fractional and they need a domain condition.') },
    { when: (s) => s.place.i1 !== 'a', text: L(
      "Qavs butunlikni buzmaydi: uni ochsangiz oddiy ko'phad qoladi, maxrajda esa harf yo'q.",
      'Скобка целостности не нарушает: раскрой её — останется обычный многочлен, а буквы в знаменателе нет.',
      'A bracket does not break integrality: open it and an ordinary polynomial is left, with no letter in a denominator.') },
  ],
  wrongText: L(
    "Har yozuvga ikki savol bering: tenglik belgisi bormi, va iks maxrajda turibdimi?",
    'Задай каждой записи два вопроса: есть ли знак равенства и стоит ли икс в знаменателе?',
    'Ask two questions of every record: is there an equals sign, and is x in a denominator?'),
};

export default function D07_06(props) { return <Zones data={DATA} {...props} />; }
