// Dars12 · Amaliyot 09 — Daftar va ruchka · 🔴 · tag: build_notebooks
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// «Beshta daftar x so'mdan va bitta 3000 so'mlik ruchka olindi, 18000 so'm
// to'landi.» Tenglama: 5x + 3000 = 18000. (Bundan 5x = 15000, x = 3000.)
// Diqqat: ruchkaning narxi ham 3000, javob ham 3000 -- lekin bu tasodif,
// va shuning uchun tekshirish muhim.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'x5', label: '5x' },
  { id: 'plus', label: '+' },
  { id: 'n3000', label: '3000' },
  { id: 'eq', label: '=' },
  { id: 'n18000', label: '18000' },
];

const DATA = {
  tag: 'build_notebooks', level: '🔴', useAll: true,
  answerSeq: ['x5', 'plus', 'n3000', 'eq', 'n18000'],
  cards: CARDS,
  eyebrow: L('Daftar va ruchka', 'Тетради и ручка', 'Notebooks and a pen'),
  setup: L(
    "Beshta bir xil daftar x so'mdan va bitta ruchka 3000 so'mdan olindi. Jami 18000 so'm to'landi.",
    'Купили пять одинаковых тетрадей по x сум и одну ручку за 3000 сум. Всего заплатили 18000 сум.',
    'Five identical notebooks at x each and one pen for 3000 were bought. In all 18000 was paid.'),
  empty: L("Kartalarni bosib tenglama yig'ing", 'Собери уравнение, нажимая карточки', 'Build the equation by tapping cards'),
  ask: L("Masalaning tenglamasini yig'ing. Hamma karta ishlatiladi.",
    'Собери уравнение к задаче. Используются все карточки.',
    'Build the equation for the problem. Every card is used.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Beshta daftar 5x, ruchka 3000, jami 18000: 5x + 3000 = 18000. Bundan 5x = 15000 va x = 3000: bitta daftar ham 3000 so'm.",
    'Верно. Пять тетрадей это 5x, ручка 3000, всего 18000: 5x + 3000 = 18000. Отсюда 5x = 15000 и x = 3000: одна тетрадь тоже 3000 сум.',
    'Correct. Five notebooks are 5x, the pen 3000, the total 18000: 5x + 3000 = 18000. Hence 5x = 15000 and x = 3000: a notebook also costs 3000.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('eq') < s.seq.indexOf('n3000'), text: L(
      "Ruchkaning puli ham to'langan summaning ichida: u chap tomonda, tenglik belgisidan oldin.",
      'Деньги за ручку тоже входят в заплаченное: они слева, до знака равенства.',
      'The pen money is part of what was paid: it belongs on the left, before the equals sign.') },
    { when: (s) => s.seq[0] !== 'x5', text: L(
      "Tenglama daftarlardan boshlanadi: beshta daftar x so'mdan, ya'ni 5x.",
      'Уравнение начинается с тетрадей: пять тетрадей по x сум, то есть 5x.',
      'The equation starts with the notebooks: five at x each, that is 5x.') },
    { when: (s) => s.seq.indexOf('n18000') < s.seq.indexOf('eq'), text: L(
      "18000 bu JAMI to'langan pul, ya'ni natija.",
      '18000 это ВСЯ заплаченная сумма, то есть результат.',
      '18000 is the TOTAL paid, that is the result.') },
  ],
  wrongText: L(
    "Chap tomonga xaridning bo'laklarini yozing, o'ng tomonga jami summani.",
    'Слева запиши части покупки, справа общую сумму.',
    'On the left write the parts of the purchase, on the right the total.'),
};

export default function D12_09(props) { return <BuildLine data={DATA} {...props} />; }
