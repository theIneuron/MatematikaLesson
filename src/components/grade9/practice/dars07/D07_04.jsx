// Dars07 · Amaliyot 04 — Ildiz · 🟡 · teg: qavs-ochish-ishorasi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `point` REJIMIDA: bitta nuqta + turi, yo'nalishsiz.
//
// Bu rejim shu dars uchun qo'shildi: chiziqli tenglamaning javobi nur ham,
// oraliq ham emas — BITTA nuqta. Nuqta bo'yalgan, chunki ildiz javobga
// kiradi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'qavs-ochish-ishorasi', level: '🟡',
  eyebrow: L('Ildiz', 'Корень', 'Root'),
  setup: L(
    "Tenglamaning ildizi — uni to'g'ri tenglikka aylantiradigan son.",
    'Корень уравнения — число, обращающее его в верное равенство.',
    'A root of an equation is a number that turns it into a true equality.'),
  ask: L(
    "Tenglamaning ildizini o'qda belgilang.",
    'Отметь на оси корень уравнения.',
    'Mark the root of the equation on the axis.'),
  expr: ['2(x − 3) = x + 1'],
  mode: 'point',
  axis: { from: -2, to: 10 },
  answer: { at: 7, closed: true },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Qavs ochilganda ikki iks minus olti chiqadi — ikki HAR IKKALA hadga tushadi. Keyin iks chapga, olti o'ngga ko'chiriladi: iks yettiga teng. Nuqta bo'yalgan, chunki ildiz javobning o'zi.",
    'Верно. При раскрытии скобки получается два икс минус шесть — двойка умножается на ОБА слагаемых. Потом икс переносится влево, шестёрка вправо: икс равен семи. Точка закрашена, потому что корень и есть ответ.',
    'Correct. Opening the bracket gives two x minus six — the two multiplies BOTH terms. Then x moves left and six moves right: x equals seven. The point is filled because the root is the answer itself.'),
  wrongs: [
    { when: (s) => s.at === 4, text: L(
      "Qavs to'liq ochilmadi: ikki faqat iksga ko'paytirildi, uchga esa yo'q. Ikkini qavs ichidagi HAR IKKALA hadga ko'paytiring.",
      'Скобка раскрыта не полностью: двойка умножена только на икс, а на тройку нет. Умножь двойку на ОБА слагаемых в скобке.',
      'The bracket was not opened fully: the two multiplied only x, not the three. Multiply the two by BOTH terms inside the bracket.') },
    { when: (s) => s.at === 5, text: L(
      "Hadlarni ko'chirishda ishora almashishini tekshiring: minus olti o'ng tomonga o'tganda qanday bo'ladi?",
      'Проверь смену знака при переносе: каким становится минус шесть, переходя вправо?',
      'Check the sign change when moving terms: what does minus six become on the right-hand side?') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Ildiz javobning o'zi, u albatta javobga kiradi. Bo'sh nuqta chiqarib tashlangan sonni bildiradi.",
      'Корень — это и есть ответ, он безусловно в него входит. Пустая точка означает исключённое число.',
      'The root is the answer itself, so it certainly belongs. A hollow point means an excluded number.') },
    { when: (s) => !s.atOk, text: L(
      "Uch qadam: qavsni oching, iks li hadlarni bir tomonga yig'ing, sonlarni ikkinchi tomonga.",
      'Три шага: раскрой скобку, собери слагаемые с икс в одну сторону, числа в другую.',
      'Three steps: open the bracket, gather the x terms on one side and the numbers on the other.') },
  ],
  wrongText: L(
    "Qavsni oching va topgan soningizni ASL tenglamaga qo'yib tekshiring: ikkala tomon teng chiqdimi?",
    'Раскрой скобку и подставь найденное число в ИСХОДНОЕ уравнение: равны ли обе части?',
    'Open the bracket and put your number into the ORIGINAL equation: do both sides come out equal?'),
};

export default function D07_04(props) { return <DomainAxis data={DATA} {...props} />; }
