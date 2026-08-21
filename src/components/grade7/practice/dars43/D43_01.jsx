// Dars43 · Amaliyot 01 — Teng uchburchakning perimetri · 🟢 · build · tag: eq_perimeter
// Mexanika: kit.jsx -> BuildLine. Raskladka: 43-dars, 1-o'rin.
// Teng uchburchaklarning tomonlari mos ravishda teng, ya'ni perimetrlari ham
// teng: 6 + 8 + 10 = 24.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_perimeter', level: '🟢',
  eyebrow: L('Teng uchburchaklar', 'Равные треугольники', 'Equal triangles'),
  setup: L(
    "Teng uchburchaklarda mos tomonlar teng. Shuning uchun bir uchburchakning perimetri ikkinchisining perimetrini ham beradi.",
    'У равных треугольников соответственные стороны равны. Поэтому периметр одного даёт и периметр другого.',
    'Equal triangles have equal corresponding sides, so one perimeter gives the other.'),
  given: [['6,', '8,', '10']],
  givenLabel: L('Tomonlar:', 'Стороны:', 'Sides:'),
  cards: [
    { id: 'a', label: '6 + 8 + 10' },
    { id: 'b', label: '24' },
    { id: 'c', label: '6 · 8 · 10' },
    { id: 'd', label: '480' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Perimetrni hisoblang", 'Посчитай периметр', 'Work out the perimeter'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Perimetr tomonlar yig'indisi: 6 + 8 + 10 = 24. Teng uchburchakda ham 24.",
    'Верно. Периметр это сумма сторон: 6 + 8 + 10 = 24. У равного треугольника тоже 24.',
    'Correct. The perimeter is the sum of the sides: 6 + 8 + 10 = 24, the same for the equal triangle.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Ko'paytirish yuza uchun ishlatiladi. Perimetr esa tomonlarning YIG'INDISI.",
      'Умножение используется для площади. А периметр это СУММА сторон.',
      'Multiplication belongs to area. The perimeter is the SUM of the sides.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Perimetr qanday topiladi -- tomonlar qo'shiladimi yoki ko'paytiriladimi?",
    'Как находят периметр — стороны складывают или умножают?',
    'How is a perimeter found — adding or multiplying the sides?'),
};

export default function D43_01(props) { return <BuildLine data={DATA} {...props} />; }
