// Dars17 · Amaliyot 10 — Qavsni joyiga qo'yish · 🔴 · bracket · tag: bracket_sign
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (qavs kartalari bilan).
// Mexanika RASKLADKADAN: 17-dars, 10-o'rin `bracket`.
//
// 49a² ni olish uchun qavs KERAK: (−7a)² = 49a², chunki ikki minus
// ko'paytiriladi. Qavssiz yozuv −7a² manfiy qiymat beradi, ya'ni farq
// bitta qavsda.
// Kartalar: ( −7a ) ² -- to'g'ri yo'l; −  7a² -- qavssiz yo'l.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'bracket_sign', level: '🔴',
  eyebrow: L('Qavs qayerda', 'Где скобка', 'Where the bracket goes'),
  setup: L(
    "Qavs manfiy sonni butunligi bilan asos qiladi. Qavssiz daraja faqat songa tegishli bo'ladi, minus esa tashqarida qoladi -- shuning uchun javobning ishorasi o'zgaradi.",
    'Скобка делает отрицательное число основанием целиком. Без скобки степень относится только к числу, а минус остаётся снаружи — поэтому знак ответа меняется.',
    'A bracket makes the negative number the base as a whole. Without it the power applies to the number only and the minus stays outside, so the sign of the answer changes.'),
  expr: ['?', '=', '49a²'], exprSize: 34,
  cards: [
    { id: 'op', label: '(' },
    { id: 'm7a', label: '−7a' },
    { id: 'cl', label: ')' },
    { id: 'p2', label: '²' },
    { id: 'mn', label: '−' },
    { id: 'sq', label: '7a²' },
  ],
  answerSeq: ['op', 'm7a', 'cl', 'p2'],
  empty: L("49a² beradigan yozuvni tuzing", 'Собери запись, равную 49a²', 'Build the record equal to 49a²'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (−7a)² da minus qavs ichida: ikki minus ko'paytiriladi va natija musbat bo'ladi. 7 · 7 = 49, ya'ni 49a².",
    'Верно. В (−7a)² минус внутри скобки: два минуса перемножаются, и результат положительный. 7 · 7 = 49, то есть 49a².',
    'Correct. In (−7a)² the minus is inside: two minuses multiply and the result is positive. 7 · 7 = 49, so 49a².'),
  wrongs: [
    { when: (s) => s.seq.indexOf('mn') !== -1 || s.seq.indexOf('sq') !== -1, text: L(
      "−7a² da qavs yo'q: daraja faqat 7a ga emas, faqat a ga tegishli bo'lib qoladi va minus tashqarida turadi. Qiymati manfiy.",
      'В −7a² скобки нет: степень относится только к a, а минус стоит снаружи. Значение отрицательное.',
      'In −7a² there is no bracket: the power applies to a only and the minus stays outside. The value is negative.') },
    { when: (s) => s.seq.indexOf('op') === -1 || s.seq.indexOf('cl') === -1, text: L(
      "Qavssiz minus darajaga ko'tarilmaydi. Ikki qavsni ham qo'yish kerak: ( va ).",
      'Без скобки минус не возводится в степень. Нужно поставить обе скобки: ( и ).',
      'Without a bracket the minus is not raised to the power. Both brackets are needed: ( and ).') },
    { when: (s) => s.seq.indexOf('p2') === -1, text: L(
      "Daraja qo'yilmadi: qavs ustida ikki turishi kerak, aks holda qiymat −7a bo'lib qoladi.",
      'Степень не поставлена: над скобкой должна стоять двойка, иначе значение останется −7a.',
      'The power is missing: a two must stand over the bracket, otherwise the value stays −7a.') },
    { when: (s) => s.seq.join('|') !== 'op|m7a|cl|p2', text: L(
      "Tartibni tekshiring: qavs ochiladi, ichiga −7a, keyin qavs yopiladi va ustiga daraja qo'yiladi.",
      'Проверь порядок: скобка открывается, внутрь −7a, потом скобка закрывается и сверху ставится степень.',
      'Check the order: open the bracket, put −7a inside, close it and set the power above.') },
  ],
  wrongText: L(
    "Javob musbat bo'lishi kerak. Minus qanday qilib darajaga tushadi -- qavs ichida yoki tashqarida?",
    'Ответ должен быть положительным. Как минус попадает под степень — внутри скобки или снаружи?',
    'The answer must be positive. How does the minus come under the power — inside the bracket or outside?'),
};

export default function D17_10(props) { return <BuildLine data={DATA} {...props} />; }
