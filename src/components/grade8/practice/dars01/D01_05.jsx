// Dars01 * Amaliyot 05 -- Yozuvlar qayerda ajraladi * 🟡 * tag: where_split
// Faqat MA'LUMOT. Tip: kit.jsx -> Counter (kontrprimer son bilan).
// TASDIQ 3, ADASHISH Z18 ning eng o'tkir ko'rinishi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Counter, L } from '../kit.jsx';

const DATA = {
  tag: 'where_split', level: '🟡',
  varName: 'x',
  left: '(x·x)/x',
  right: 'x',
  leftShow: [{ n: 'x · x', d: 'x' }],
  rightShow: ['x'],
  label: L('son', 'число', 'number'),
  eyebrow: L('Ikki yozuv', 'Две записи', 'Two records'),
  setup: L(
    "Yozuvlar deyarli hamma joyda teng -- bitta qiymatdan tashqari.",
    'Записи равны почти всюду -- кроме одного значения.',
    'The records are equal almost everywhere -- except at one value.',
  ),
  hints: {
    '1': L(
      "Birda chapda 1 : 1 = 1, o'ngda ham 1. Bu yerda ular birdek ishlaydi. Bo'lish BUZILADIGAN qiymatni izlang.",
      'При единице слева 1 : 1 = 1, справа тоже 1. Здесь они работают одинаково. Ищи значение, при котором ломается ДЕЛЕНИЕ.',
      'At one the left gives 1 divided by 1 = 1 and the right gives 1 too. Look for the value that breaks the DIVISION.',
    ),
  },
  wrongText: L(
    "Chapdagi yozuvda chiziq ostida x turadi. Uni nolga aylantiradigan qiymatni qo'yib ko'ring.",
    'В левой записи под чертой стоит x. Подставь значение, которое обращает его в нуль.',
    'In the left record x stands below the bar. Substitute the value that turns it into zero.',
  ),
  correctText: L(
    "To'g'ri. x = 0 da chapda 0 : 0 turadi -- qiymat yo'q; o'ngda esa qiymat bor va u nolga teng.",
    'Верно. При x = 0 слева стоит 0 : 0 -- значения нет; справа значение есть, и оно равно нулю.',
    'Correct. At x = 0 the left is 0 divided by 0 with no value, while the right has a value and it equals zero.',
  ),
};

export default function D01_05(props) { return <Counter data={DATA} {...props} />; }
