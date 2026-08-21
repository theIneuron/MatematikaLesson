// Dars31 · Amaliyot 03 — Ishora almashgan · 🟢 · fix · tag: cube_sign_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 3-o'rin.
// Chuqur yechim: m³ + 64 = (m + 4)(m² + 4m + 16)
//   (m + 4) TO'G'RI, ikkinchi qavs NOTO'G'RI: o'rta had −4m bo'lishi kerak.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_sign_fix', level: '🟢',
  eyebrow: L('Xato bo\'lak', 'Неверная часть', 'The wrong part'),
  setup: L(
    "Boshqa o'quvchi kublar yig'indisini ajratdi. Birinchi qavs to'g'ri, ikkinchisida o'rta hadning ishorasi almashgan.",
    'Другой ученик разложил сумму кубов. Первая скобка верная, во второй перепутан знак среднего члена.',
    'Another pupil factorised a sum of cubes. The first bracket is right; the second has the middle sign wrong.'),
  given: [['m³', '+', '64']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("NOTO'G'RI bo'lakni belgilang.", 'Отметь НЕВЕРНУЮ часть.', 'Mark the WRONG part.'),
  note: L('Bitta bo\'lak.', 'Одна часть.', 'One part.'),
  parts: [
    { k: 'term', id: 't1', v: '(m + 4)' },
    { k: 'sign', v: '·' },
    { k: 'term', id: 't2', v: '(m² + 4m + 16)' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. Yig'indi uchun to'liqsiz kvadratda MINUS bo'ladi: (m + 4)(m² − 4m + 16).",
    'Верно. Для суммы в неполном квадрате МИНУС: (m + 4)(m² − 4m + 16).',
    'Correct. For a sum the incomplete square takes a MINUS: (m + 4)(m² − 4m + 16).'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "(m + 4) to'g'ri: 64 = 4³ va yozuvda yig'indi turibdi.",
      '(m + 4) верно: 64 = 4³ и в записи стоит сумма.',
      '(m + 4) is right: 64 = 4³ and the record is a sum.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Ikkinchi qavsni tekshiring: o'rta hadning ishorasi birinchi qavsga qanday bog'liq?",
      'Проверь вторую скобку: как знак среднего члена связан с первой скобкой?',
      'Check the second bracket: how does its middle sign relate to the first?') },
  ],
  wrongText: L(
    "Ko'paytmani ochib tekshiring: (m + 4)(m² + 4m + 16) nima beradi?",
    'Проверь раскрытием: что даёт (m + 4)(m² + 4m + 16)?',
    'Check by expanding: what does (m + 4)(m² + 4m + 16) give?'),
};

export default function D31_03(props) { return <TapTerms data={DATA} {...props} />; }
