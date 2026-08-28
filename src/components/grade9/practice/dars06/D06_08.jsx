// Dars06 · Amaliyot 08 — So'zlar · 🔴 · teg: chegara-nuqta-kiritish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md §08
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'chegara-nuqta-kiritish', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      'Kvadrat uch hadni',
      'Разложив квадратный трёхчлен на',
      'Once the quadratic trinomial is split into') },
    { slot: 0 },
    { text: L(
      "ajratgach, grafik Ox dan yuqorida bo'lgan oraliqlarda funksiya",
      ', на промежутках, где график выше Ox, функция',
      ', on the intervals where the graph is above Ox the function is') },
    { slot: 1 },
    { text: L(
      "bo'ladi. Qat'iy tengsizlikda chegara nollari javobga",
      '. При строгом неравенстве граничные нули в ответ',
      '. In a strict inequality the boundary zeros') },
    { slot: 2 },
    { text: L('.', '.', ' to the answer.') },
  ],
  cards: [
    { id: 'w1', label: L("ko'paytuvchilarga", 'множители', 'factors') },
    { id: 'w2', label: L('musbat', 'положительна', 'positive') },
    { id: 'w3', label: L('kirmaydi', 'не входят', 'do not belong') },
    { id: 'w4', label: L('hadlarga', 'слагаемые', 'terms') },
    { id: 'w5', label: L('manfiy', 'отрицательна', 'negative') },
    { id: 'w6', label: L('kiradi', 'входят', 'belong') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoidada uchta qadam turibdi: ajratish nollarni beradi, nollar oraliqlarni ajratadi, tengsizlikning ishorasi esa chegaralar javobga kirishini hal qiladi.",
    'Верно, все три слова на месте. В правиле стоят три шага: разложение даёт нули, нули делят ось на промежутки, а знак неравенства решает, входят ли границы в ответ.',
    'Correct, all three words are in place. The rule holds three steps: factoring gives the zeros, the zeros split the axis into intervals, and the sign of the inequality decides whether the boundaries belong to the answer.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Hadlar qo'shish bilan bog'langan, ko'paytuvchilar esa ko'paytirish bilan. Ko'paytma nolga aylanishi uchun bitta ko'paytuvchining nol bo'lishi kifoya — nollarni shu qoida beradi.",
      'Слагаемые связаны сложением, а множители умножением. Чтобы произведение обратилось в нуль, достаточно одного нулевого множителя — именно это правило и даёт нули.',
      'Terms are joined by addition, factors by multiplication. A product becomes zero as soon as one factor is zero — that is the rule that gives the zeros.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Ox dan yuqorida turgan nuqtalarning ordinatasi noldan katta. Grafikning shu qismidan bitta nuqta oling va uning balandligiga qarang.",
      'У точек выше Ox ордината больше нуля. Возьми точку с этой части графика и посмотри на её высоту.',
      'Points above Ox have an ordinate greater than zero. Take a point from that part of the graph and look at its height.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Qat'iy tengsizlikda nol javobga to'g'ri kelmaydi: qat'iy katta noldan katta bo'lishni talab qiladi, nolning o'zi esa noldan katta emas.",
      'При строгом неравенстве нуль не подходит: строгое «больше» требует быть больше нуля, а сам нуль больше нуля не является.',
      'In a strict inequality zero does not fit: a strict "greater" demands being greater than zero, and zero itself is not greater than zero.') },
  ],
  wrongText: L(
    "Uchta qadamni ajrating: ajratish, oraliqlarning ishorasi, chegaralarning taqdiri.",
    'Раздели три шага: разложение, знак на промежутках, судьба границ.',
    'Separate the three steps: the factoring, the sign on the intervals, the fate of the boundaries.'),
};

export default function D06_08(props) { return <ClozeBank data={DATA} {...props} />; }
