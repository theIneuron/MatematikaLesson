// Dars40 · Amaliyot 10 — Xato hisob · 🔴 · fix · tag: seg_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 10-o'rin.
// AB = 15, AC = 6 -> CB = 9. Chuqur javob 21 -- qo'shib yuborilgan.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_fix', level: '🔴',
  eyebrow: L('Xato hisob', 'Неверный расчёт', 'The wrong figure'),
  setup: L(
    "Boshqa o'quvchi bo'lakni topdi, lekin amalni almashtirib yubordi. Bo'lak butundan katta chiqib qolgan.",
    'Другой ученик нашёл часть, но перепутал действие. Часть вышла больше целого.',
    'Another pupil found the part but used the wrong operation: the part came out bigger than the whole.'),
  ask: L("NOTO'G'RI yozuvni belgilang.", 'Отметь НЕВЕРНУЮ запись.', 'Mark the WRONG record.'),
  note: L('Bitta yozuv.', 'Одна запись.', 'One record.'),
  parts: [
    { k: 'term', id: 't1', v: 'AB = 15' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: 'AC = 6' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: 'CB = 21' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. CB = 15 − 6 = 9. Bo'lak butun kesmadan katta bo'lolmaydi -- 21 shu yerda darrov ko'rinadi.",
    'Верно. CB = 15 − 6 = 9. Часть не может быть больше целого — 21 сразу видно.',
    'Correct. CB = 15 − 6 = 9. A part cannot exceed the whole, so 21 stands out.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "AB = 15 bu berilgan ma'lumot, unda xato yo'q.",
      'AB = 15 это данные условия, ошибки здесь нет.',
      'AB = 15 is given data, no error there.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "AC = 6 ham berilgan.",
      'AC = 6 тоже дано.',
      'AC = 6 is given too.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Uchinchi yozuvni tekshiring: bo'lak butun kesmadan katta bo'lishi mumkinmi?",
      'Проверь третью запись: может ли часть быть больше целого?',
      'Check the third record: can a part be bigger than the whole?') },
  ],
  wrongText: L(
    "Bo'laklarni qo'shib ko'ring: 6 + 21 butun kesmaga tengmi?",
    'Сложи части: равно ли 6 + 21 всему отрезку?',
    'Add the parts: does 6 + 21 match the whole?'),
};

export default function D40_10(props) { return <TapTerms data={DATA} {...props} />; }
