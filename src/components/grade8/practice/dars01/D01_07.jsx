// Dars01 * Amaliyot 07 -- Ikki maxraj, ikki shart * 🟡 * tag: two_denominators
// Faqat MA'LUMOT. Tip: kit.jsx -> Input (kind odz).
// ADASHISH Z2 ning eng qimmat shakli: shart YO'QOLADI, chunki u bitta emas.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Input, L } from '../kit.jsx';

const DATA = {
  tag: 'two_denominators', level: '🟡', kind: 'odz', varName: 'x',
  excluded: [0, 5],
  eyebrow: L('Ikki kasr', 'Две дроби', 'Two fractions'),
  setup: L(
    "Har kasrning o'z maxraji, o'z taqig'i bor.",
    'У каждой дроби свой знаменатель, свой запрет.',
    'Each fraction has its own denominator, its own restriction.',
  ),
  expr: [{ n: '12', d: 'x' }, ' + ', { n: '2', d: 'x - 5' }],
  exprSize: 26,
  ask: L(
    "Qaysi qiymatlarda ifoda qiymatga ega emas? Shartni yozing.",
    'При каких значениях у записи нет значения? Запиши условие.',
    'At what values does the record have no value? Write the condition.',
  ),
  label: L('shart', 'условие', 'condition'),
  placeholder: L('masalan x != 2', 'например x != 2', 'e.g. x != 2'),
  hints: {
    'x != 5': L(
      "Beshni topdingiz, nol esa qoldi. Birinchi kasrning maxraji x ning O'ZI: nolda u nolga aylanadi.",
      'Пятёрку нашёл, а нуль потерялся. У первой дроби знаменатель это САМ x: при нуле он обращается в нуль.',
      'You found the five but lost the zero. The first fraction has x ITSELF below the bar: at zero it vanishes.',
    ),
    'x != 0': L(
      "Nolni topdingiz, beshni esa qoldirdingiz. Ikkinchi maxraj x - 5, va u beshda nolga aylanadi.",
      'Нуль нашёл, а пятёрку оставил. Второй знаменатель x - 5, он обращается в нуль при пяти.',
      'You found the zero but left out the five. The second denominator is x - 5 and it vanishes at five.',
    ),
  },
  correctText: L(
    "To'g'ri. x = 0 da birinchi kasr, x = 5 da ikkinchi kasr qiymatga ega emas, ya'ni shart x != 0 va x != 5.",
    'Верно. При x = 0 нет значения у первой дроби, при x = 5 -- у второй, значит условие x != 0 и x != 5.',
    'Correct. At x = 0 the first fraction has no value, at x = 5 the second does not, so the condition is x != 0 and x != 5.',
  ),
  wrongText: L(
    "Har kasrga alohida qarang: maxrajni nolga tenglashtirib, o'z taqiqini oling. Ikki taqiq birga ifodaning shartini beradi.",
    'Смотри на каждую дробь отдельно: приравняй знаменатель к нулю и получи её запрет. Оба запрета вместе дают условие записи.',
    'Look at each fraction separately: set its denominator to zero and get its restriction. Both together give the condition.',
  ),
};

export default function D01_07(props) { return <Input data={DATA} {...props} />; }
