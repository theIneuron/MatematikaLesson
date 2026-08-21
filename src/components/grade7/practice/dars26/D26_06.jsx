// Dars26 · Amaliyot 06 — Og'zaki hisob · 🟡 · bracket · tag: diff_sq_mental
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 6-o'rin.
// 51 · 49 = (50 + 1)(50 − 1) = 2500 − 1 = 2499. Formula og'zaki hisobni
// beradi: ustunda ko'paytirish shart emas.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'diff_sq_mental', level: '🟡',
  eyebrow: L('Og\'zaki hisob', 'Устный счёт', 'Mental arithmetic'),
  setup: L(
    "Ikki son o'rtasida bir xil son turadi: 51 va 49 ning o'rtasi 50. Shu sonni ishlatib ko'paytmani kvadratlar ayirmasiga aylantirish mumkin.",
    'Между двумя числами стоит одно: у 51 и 49 середина 50. С его помощью произведение превращается в разность квадратов.',
    'The two numbers share a midpoint: 50 sits between 51 and 49. That turns the product into a difference of squares.'),
  expr: ['51', '·', '49'], exprSize: 34,
  cards: [
    { id: 'a', label: '(50 + 1)' },
    { id: 'b', label: '(50 − 1)' },
    { id: 'c', label: '(50 + 2)' },
    { id: 'd', label: '(49 + 1)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki qavsni qo'ying", 'Поставь две скобки', 'Place the two brackets'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (50 + 1)(50 − 1) = 2500 − 1 = 2499. Ustunda ko'paytirish kerak bo'lmadi.",
    'Верно. (50 + 1)(50 − 1) = 2500 − 1 = 2499. Умножать в столбик не понадобилось.',
    'Correct. (50 + 1)(50 − 1) = 2500 − 1 = 2499. No long multiplication needed.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "(50 + 2) bu 52, bizda esa 51. Ikki qavs 50 dan bir xil masofada bo'lishi kerak.",
      '(50 + 2) это 52, а у нас 51. Скобки должны быть на одинаковом расстоянии от 50.',
      '(50 + 2) is 52, but we have 51. Both brackets must sit the same distance from 50.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "(49 + 1) bu 50 ning o'zi. Ikki ko'paytuvchi ham 50 dan bir qadam uzoqda: 50 + 1 va 50 − 1.",
      '(49 + 1) это само 50. Оба множителя на шаг от 50: 50 + 1 и 50 − 1.',
      '(49 + 1) is 50 itself. Both factors are one step from 50: 50 + 1 and 50 − 1.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qavs kerak: yig'indi va ayirma.",
      'Нужны две скобки: сумма и разность.',
      'Two brackets are needed: a sum and a difference.') },
  ],
  wrongText: L(
    "51 va 49 ning o'rtasidagi son nechchi? Har biri undan qancha uzoqda?",
    'Какое число между 51 и 49? На сколько каждое от него отстоит?',
    'Which number sits between 51 and 49? How far is each from it?'),
};

export default function D26_06(props) { return <BuildLine data={DATA} {...props} />; }
