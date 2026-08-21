// Dars18 · Amaliyot 06 — Qavsga olish · 🟡 · bracket · tag: poly_bracket
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 6-o'rin.
//
// x³ − 4x + 7 ni qavs bilan yozish: x³ − (4x − 7).
// Minus qavs oldiga chiqsa, ichidagi HAR hadning ishorasi ag'dariladi:
// −4x + 7 -> −(4x − 7). Tuzoq: −(4x + 7) ichidagi ikkinchi ishorani
// o'zgartirmagan variant.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'poly_bracket', level: '🟡',
  eyebrow: L('Qavs oldida minus', 'Минус перед скобкой', 'Minus before the bracket'),
  setup: L(
    "Ikkita hadni minusli qavsga olish kerak. Minus qavs oldiga chiqqanda ichidagi har hadning ishorasi ag'dariladi.",
    'Два члена надо взять в скобку с минусом. Когда минус выносится перед скобку, знак каждого члена внутри переворачивается.',
    'Two terms must go into a bracket with a minus. When the minus moves out front, the sign of every term inside flips.'),
  expr: ['x³', '−', '4x', '+', '7'], exprSize: 32,
  cards: [
    { id: 'x3', label: 'x³' },
    { id: 'mo', label: '−(' },
    { id: 'in', label: '4x − 7' },
    { id: 'cl', label: ')' },
    { id: 'po', label: '+(' },
    { id: 'in2', label: '4x + 7' },
  ],
  answerSeq: ['x3', 'mo', 'in', 'cl'],
  empty: L("Yozuvni qavs bilan tuzing", 'Собери запись со скобкой', 'Build the record with a bracket'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x³ − (4x − 7) qavsni ochsa x³ − 4x + 7 beradi. Ikki ishora ham ag'darilgan.",
    'Верно. x³ − (4x − 7) при раскрытии даёт x³ − 4x + 7. Оба знака перевернулись.',
    'Correct. Opening x³ − (4x − 7) gives x³ − 4x + 7. Both signs flipped.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('in2') !== -1 && s.seq.indexOf('mo') !== -1, text: L(
      "−(4x + 7) ochilsa −4x − 7 chiqadi, bizda esa +7 turishi kerak. Ikkinchi ishorani ham ag'darish kerak.",
      'Раскрытие −(4x + 7) даёт −4x − 7, а нам нужно +7. Второй знак тоже надо перевернуть.',
      'Opening −(4x + 7) gives −4x − 7, but we need +7. The second sign must flip too.') },
    { when: (s) => s.seq.indexOf('po') !== -1, text: L(
      "Plyusli qavs ichidagi ishoralarni o'zgartirmaydi, ya'ni −4x ni qavsga olib bo'lmaydi. Bizga minusli qavs kerak.",
      'Скобка с плюсом знаки внутри не меняет, значит −4x в неё не убрать. Нужна скобка с минусом.',
      'A bracket with a plus leaves the signs alone, so −4x cannot go inside. A minus bracket is needed.') },
    { when: (s) => s.seq.indexOf('cl') === -1 || s.seq.indexOf('x3') === -1, text: L(
      "Yozuv to'liq emas: x³ oldinda turadi, qavs esa yopilishi kerak.",
      'Запись не полная: x³ стоит впереди, а скобка должна закрыться.',
      'The record is incomplete: x³ comes first and the bracket must be closed.') },
  ],
  wrongText: L(
    "Qavsni ochib tekshiring: natija asl yozuv bilan bir xil chiqishi kerak.",
    'Проверь раскрытием: результат должен совпасть с исходной записью.',
    'Check by opening it: the result must match the original record.'),
};

export default function D18_06(props) { return <BuildLine data={DATA} {...props} />; }
