// Dars05 · Amaliyot 04 — Ochib, yig'ish · 🟡 · tag: open_and_collect
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// (5a + 3) − (2a − 8) = 5a + 3 − 2a + 8 = 3a + 11.
//   harfli hadlar: 5a − 2a = 3a
//   sonlar:        3 + 8 = 11   (minus 8 ishorasini o'zgartirdi)
// Kartalar orasida 7a (5a va 2a ni qo'shgan), a (?) va −5 (3 dan 8 ayirgan,
// ya'ni ikkinchi qavsning ishorasini o'zgartirmagan) turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'open_and_collect', level: '🟡',
  eyebrow: L("Ochib, yig'ish", 'Раскрыть и собрать', 'Open and collect'),
  setup: L(
    "Qavslar ochilgach, o'xshash hadlar yig'iladi: harflilar harflilar bilan, sonlar sonlar bilan.",
    'После раскрытия скобок собираются подобные слагаемые: буквенные с буквенными, числа с числами.',
    'Once the brackets are open, like terms are collected: letter terms with letter terms, numbers with numbers.'),
  rows: [
    [{ t: ['(', '5a', '+', '3', ')', '−', '(', '2a', '−', '8', ')'] }],
    [{ t: ['='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['3a', '7a', 'a', '+11', '−5', '+5'],
  answer: ['3a', '+11'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5a − 2a = 3a, sonlar esa 3 + 8 = 11: minus qavsni ochganda 8 qo'shiluvchiga aylandi.",
    'Верно. 5a − 2a = 3a, а числа 3 + 8 = 11: при раскрытии минус-скобки восьмёрка стала прибавляться.',
    'Correct. 5a − 2a = 3a, and the numbers give 3 + 8 = 11: opening the minus bracket turned the eight into an addition.'),
  wrongs: [
    { when: (s) => s.slots[0] === '7a', text: L(
      "Ikkinchi qavs oldida minus turgan, ya'ni 2a AYIRILADI: 5a − 2a = 3a.",
      'Перед второй скобкой минус, значит 2a ВЫЧИТАЕТСЯ: 5a − 2a = 3a.',
      'The second bracket has a minus, so 2a is SUBTRACTED: 5a − 2a = 3a.') },
    { when: (s) => s.slots[1] === '−5', text: L(
      "Sonlarga qarang: qavs ichida −8 turgan edi, minus uni +8 ga aylantirdi. 3 + 8 = 11.",
      'Посмотри на числа: в скобке было −8, минус превратил его в +8. 3 + 8 = 11.',
      'Look at the numbers: the bracket had −8, and the minus turned it into +8. 3 + 8 = 11.') },
    { when: (s) => s.slots[1] === '+5', text: L(
      "8 ning ishorasi o'zgardi, lekin 3 dan ayirilmaydi: ikkisi ham qo'shiluvchi bo'lib qoldi, 3 + 8 = 11.",
      'Знак восьмёрки изменился, но её не вычитают из 3: оба стали слагаемыми, 3 + 8 = 11.',
      'The sign of the eight changed, but it is not taken from 3: both became terms, 3 + 8 = 11.') },
  ],
  wrongText: L(
    "Avval qavslarni ochib yozib ko'ring: 5a + 3 − 2a + 8. Keyin o'xshashlarini yig'ing.",
    'Сначала выпиши раскрытые скобки: 5a + 3 − 2a + 8. Потом собери подобные.',
    'First write the brackets out: 5a + 3 − 2a + 8. Then collect the like terms.'),
};

export default function D05_04(props) { return <SlotsBank data={DATA} {...props} />; }
