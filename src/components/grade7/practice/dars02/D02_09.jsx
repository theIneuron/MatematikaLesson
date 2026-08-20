// Dars02 · Amaliyot 09 — Vaziyatdan yozuvga · 🔴 · tag: situation_to_expr
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// Darsning 13-ekrani teskari yo'l haqida: vaziyat berilgan, yozuvni
// o'quvchi tuzadi. Bu amaliyotning eng qiyin joyi, chunki bu yerda
// hisoblash emas, MODEL tuziladi.
//
// Avtobusda a nafar yo'lovchi bor edi. Bekatda 7 nafari tushdi, chiqqanlar
// esa tushganlardan IKKI BARAVAR ko'p. Ya'ni chiqqanlar 14 nafar.
// Yozuv: a − 7 + 14.
// Kartalar aynan shu beshta: ish ketma-ketlikda, ya'ni o'quvchi qaysi
// amal qaysi joyda turishini hal qiladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'a', label: 'a' },
  { id: 'minus', label: '−' },
  { id: 'c7', label: '7' },
  { id: 'plus', label: '+' },
  { id: 'c14', label: '14' },
];

const DATA = {
  tag: 'situation_to_expr', level: '🔴', useAll: true,
  answerSeq: ['a', 'minus', 'c7', 'plus', 'c14'],
  cards: CARDS,
  eyebrow: L('Vaziyatdan yozuvga', 'Из ситуации в запись', 'From a situation to a record'),
  setup: L(
    "Avtobusda a nafar yo'lovchi bor edi. Bekatda 7 nafari tushdi, chiqqanlar esa tushganlardan ikki baravar ko'p.",
    'В автобусе было a пассажиров. На остановке вышли 7, а вошло вдвое больше, чем вышло.',
    'A bus had a passengers. At the stop 7 got off, and twice as many got on as got off.'),
  empty: L("Kartalarni bosib yozuv yig'ing", 'Собери запись, нажимая карточки', 'Build the record by tapping cards'),
  ask: L("Bekatdan keyingi yo'lovchilar sonining yozuvini yig'ing. Hamma karta ishlatiladi.",
    'Собери запись для числа пассажиров после остановки. Используются все карточки.',
    'Build the record for the number of passengers after the stop. Every card is used.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Tushganlar ayiriladi, chiqqanlar qo'shiladi. Chiqqanlar ikki baravar ko'p, ya'ni 14: a − 7 + 14.",
    'Верно. Вышедшие вычитаются, вошедшие прибавляются. Вошло вдвое больше, то есть 14: a − 7 + 14.',
    'Correct. Those who got off are subtracted, those who got on are added. Twice as many got on, that is 14: a − 7 + 14.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('plus') < s.seq.indexOf('minus'), text: L(
      "Tartibga qarang: avval tushdilar, keyin chiqdilar. Ayirish oldin turadi.",
      'Посмотри на порядок: сначала вышли, потом вошли. Вычитание идёт раньше.',
      'Look at the order: first they got off, then they got on. The subtraction comes first.') },
    { when: (s) => s.seq.indexOf('c14') < s.seq.indexOf('c7'), text: L(
      "7 tushganlar soni, 14 esa chiqqanlar soni. Ular joyini almashtirib bo'lmaydi: biri ayiriladi, biri qo'shiladi.",
      '7 это сколько вышло, 14 — сколько вошло. Их нельзя поменять местами: одно вычитается, другое прибавляется.',
      '7 is how many got off, 14 is how many got on. They cannot swap: one is subtracted, the other added.') },
    { when: (s) => s.seq[0] !== 'a', text: L(
      "Yozuv a dan boshlanadi: dastlab avtobusda shuncha yo'lovchi bor edi.",
      'Запись начинается с a: столько пассажиров было в автобусе сначала.',
      'The record starts with a: that is how many passengers the bus had at first.') },
  ],
  wrongText: L(
    "Boshlang'ich son a. Tushganlar ayiriladi, chiqqanlar qo'shiladi. Chiqqanlar 7 dan ikki baravar ko'p, ya'ni 14.",
    'Начальное число a. Вышедшие вычитаются, вошедшие прибавляются. Вошло вдвое больше семи, то есть 14.',
    'The starting number is a. Those getting off are subtracted, those getting on are added. Twice seven got on, that is 14.'),
};

export default function D02_09(props) { return <BuildLine data={DATA} {...props} />; }
