// Dars03 · Amaliyot 04 — Juftlash · 🟡 · tag: reduce_to_what
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 2-o'rinda
// turgan, endi 4-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi
// (`DARS02_06_AMALIYOT_SKELET.md` §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
//
// To'rt yozuv, to'rt natija. Ular ATAYLAB o'xshash ko'rinadi:
//   6c/(9c)              -> 2/3            son va harf ko'paytuvchi
//   (c + 6)/(c + 9)      -> qisqarmaydi    QO'SHILUVCHI (З1) — asosiy tuzoq
//   c(c + 6)/(c(c + 9))  -> (c + 6)/(c + 9)  faqat c qisqaradi
//   (c² − 36)/(c + 6)    -> c − 6          avval kvadratlar ayirmasiga ajratish (З15)
// Ikkinchi va uchinchisi bir qarashda bir xil: farq qavsda, ya'ni
// ko'paytuvchi bormi yoki yo'qmi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'reduce_to_what', level: '🟡', connect: true,
  itemSize: 15,
  items: [
    { id: 'm1', tokens: [{ n: '6c', d: '9c' }] },
    { id: 'm2', tokens: [{ n: 'c + 6', d: 'c + 9' }] },
    { id: 'm3', tokens: [{ n: 'c(c + 6)', d: 'c(c + 9)' }] },
    { id: 'm4', tokens: [{ n: 'c² − 36', d: 'c + 6' }] },
  ],
  targets: [
    { id: 't1', label: '2 / 3' },
    { id: 't2', label: L('qisqarmaydi', 'не сокращается', 'does not cancel') },
    { id: 't3', label: '(c + 6) / (c + 9)' },
    { id: 't4', label: 'c − 6' },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt yozuv o'xshash ko'rinadi, lekin ular boshqacha qisqaradi — bittasi esa umuman qisqarmaydi.",
    'Четыре записи выглядят похоже, но сокращаются по-разному — а одна не сокращается вовсе.',
    'The four records look alike but cancel differently — and one does not cancel at all.'),
  ask: L(
    "Chapdan yozuvni bosing, keyin o'ngdan natijani bosing.",
    'Нажми запись слева, потом результат справа.',
    'Tap a record on the left, then its result on the right.'),
  correctText: L(
    "To'g'ri. Qisqartirish faqat KO'PAYTUVCHI bo'yicha bo'ladi. Birinchi va uchinchi yozuvda ko'paytuvchi ko'rinib turibdi, to'rtinchisida esa uni avval ajratish kerak: c kvadrat minus o'ttiz olti bu c minus olti karra c qo'shuv olti. Ikkinchi yozuvda esa qavs yo'q — u yerda c QO'SHILUVCHI, va qo'shiluvchi qisqarmaydi.",
    'Верно. Сокращают только по МНОЖИТЕЛЮ. В первой и третьей записи множитель виден, в четвёртой его сначала надо выделить: c в квадрате минус тридцать шесть — это c минус шесть на c плюс шесть. А во второй скобки нет — там c СЛАГАЕМОЕ, и слагаемое не сокращается.',
    'Correct. Cancelling works only by a FACTOR. In the first and third records the factor is visible; in the fourth it must be taken out first: c squared minus thirty-six is c minus six times c plus six. In the second there is no bracket — there c is a SUMMAND, and summands do not cancel.'),
  wrongs: [
    { when: (s) => s.pair.m2 && s.pair.m2 !== 't2', text: L(
      "Ikkinchi yozuvda c qo'shiluvchi, ko'paytuvchi emas: c qo'shuv olti va c qo'shuv to'qqiz. C ni birga teng qo'ying — yetti bo'lingan o'n chiqadi, va bu hech qanday qisqargan kasrga teng emas.",
      'Во второй записи c — слагаемое, а не множитель: c плюс шесть и c плюс девять. Подставь c равное одному — выйдет семь десятых, и это не равно никакой сокращённой дроби.',
      'In the second record c is a summand, not a factor: c plus six and c plus nine. Put c equal to one — seven tenths, which equals no cancelled fraction.') },
    { when: (s) => s.pair.m4 && s.pair.m4 !== 't4', text: L(
      "To'rtinchi yozuvda suratni avval ko'paytuvchilarga ajrating: c kvadrat minus o'ttiz olti bu kvadratlar ayirmasi. Ajratmasdan turib qisqaradigan narsa ko'rinmaydi.",
      'В четвёртой записи сначала разложи числитель: c в квадрате минус тридцать шесть — это разность квадратов. Пока не разложишь, сокращать нечего.',
      'In the fourth record factor the numerator first: c squared minus thirty-six is a difference of squares. Until you factor it, there is nothing to cancel.') },
    { when: (s) => s.pair.m3 === 't1', text: L(
      "Uchinchi yozuvda faqat c qisqaradi, qavslar esa qoladi: ular bir xil emas, biri c qo'shuv olti, ikkinchisi c qo'shuv to'qqiz.",
      'В третьей записи сокращается только c, а скобки остаются: они разные — одна c плюс шесть, другая c плюс девять.',
      'In the third record only c cancels; the brackets stay — they are different: one is c plus six, the other c plus nine.') },
    { when: (s) => s.pair.m1 && s.pair.m1 !== 't1', text: L(
      "Birinchi yozuvda ikkita ko'paytuvchi qisqaradi: uchlik va c. Olti to'qqizdan bu ikki uchdan.",
      'В первой записи сокращаются два множителя: тройка и c. Шесть девятых — это две трети.',
      'In the first record two factors cancel: the three and the c. Six ninths is two thirds.') },
  ],
  wrongText: L(
    "Har yozuvda bitta savol bering: qavs bormi? Qavs ichidagi butun ifoda ko'paytuvchi bo'lsa qisqaradi, qo'shuv belgisi bilan ulangan narsa esa yo'q.",
    'К каждой записи один вопрос: есть ли скобка? Выражение в скобке как множитель сокращается, а соединённое плюсом — нет.',
    'Ask one question of each record: is there a bracket? An expression in brackets used as a factor cancels; what is joined by a plus does not.'),
};

export default function D03_04(props) { return <MatchPairs data={DATA} {...props} />; }
