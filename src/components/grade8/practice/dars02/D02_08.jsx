// Dars02 · Amaliyot 08 — Juftlash · 🔴 · tag: record_to_condition
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 5-o'rinda
// turgan, endi 8-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi (skelet §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
//
// METODIST QARORI 2026-08-22: tubdan almashtirildi (ilgari `StepsReason`).
// Yangi mexanika: JUFTLASH — chapdan yozuvni, o'ngdan shartni bosadi.
//
// To'rt yozuv, to'rt shart. Hammasi 7/4 dan yasalgan, ya'ni QIYMAT
// hammasida bir xil — farq faqat KO'PAYTUVCHIDA va u tug'diradigan taqiqda:
//   7p/(4p)             ko'paytuvchi p        -> p ≠ 0
//   7(p−3)/(4(p−3))     ko'paytuvchi p − 3    -> p ≠ 3
//   7(p+1)/(4(p+1))     ko'paytuvchi p + 1    -> p ≠ −1
//   7/4                 ko'paytuvchi yo'q     -> shart yo'q
// Oxirgisi tuzoq: o'quvchi har yozuvda shart bo'lishi kerak deb o'ylaydi.
// Uchinchisi ikkinchi tuzoq: p qo'shuv bir nolga MINUS birda aylanadi.
// O'ng ustun har ochilganda aralashtiriladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'record_to_condition', level: '🔴',
  itemSize: 15, targetSize: 15, connect: true,
  items: [
    { id: 'm1', tokens: [{ n: '7p', d: '4p' }] },
    { id: 'm2', tokens: [{ n: '7(p − 3)', d: '4(p − 3)' }] },
    { id: 'm3', tokens: [{ n: '7(p² − 9)', d: '4(p² − 9)' }] },
    { id: 'm4', tokens: [{ n: '7', d: '4' }] },
  ],
  targets: [
    { id: 't1', label: 'p ≠ 0' },
    { id: 't2', label: 'p ≠ 3' },
    { id: 't3', label: 'p ≠ 3,  p ≠ −3' },
    { id: 't4', label: L("shart yo'q", 'условия нет', 'no condition') },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt yozuv ham 7/4 dan yasalgan va hammasining qiymati bir xil. Farq faqat ko'paytuvchida: har biri o'z taqig'ini olib keladi.",
    'Все четыре записи сделаны из 7/4, и значение у всех одно. Разница только в множителе: каждый приносит свой запрет.',
    'All four records are made from 7/4 and all have the same value. The only difference is the factor: each brings its own ban.'),
  ask: L(
    "Chapdan yozuvni bosing, keyin o'ngdan uning shartini bosing.",
    'Нажми запись слева, потом её условие справа.',
    'Tap a record on the left, then its condition on the right.'),
  correctText: L(
    "To'g'ri. Taqiqni ko'paytuvchi beradi, kasrning qiymati emas: to'rttasining ham qiymati yetti to'rtdan. Ko'paytuvchi p nolda nolga aylanadi, p minus uch — uchda, p kvadrat minus to'qqiz esa IKKI joyda: uchda va minus uchda. Ko'paytuvchi umuman qo'shilmagan joyda yangi shart ham yo'q.",
    'Верно. Запрет задаёт множитель, а не значение дроби: у всех четырёх значение семь четвёртых. Множитель p обращается в нуль при нуле, p минус три — при трёх, а p в квадрате минус девять в ДВУХ местах: при трёх и минус трёх. Где множителя нет, нет и нового условия.',
    'Correct. The ban is set by the factor, not by the value: all four have the value seven quarters. The factor p becomes zero at zero, p minus three at three, and p squared minus nine in TWO places: at three and minus three. Where no factor was added there is no new condition.'),
  wrongs: [
    { when: (s) => s.pair.m4 && s.pair.m4 !== 't4', text: L(
      "Yetti to'rtdan — oddiy sonli kasr, unda harf umuman yo'q. Harf bo'lmasa, nolga aylanadigan narsa ham yo'q, demak shart ham yo'q.",
      'Семь четвёртых — обычная числовая дробь, буквы в ней нет вовсе. Нет буквы — нечему обращаться в нуль, значит нет и условия.',
      'Seven quarters is an ordinary numeric fraction with no letter at all. No letter means nothing can become zero, so there is no condition.') },
    { when: (s) => s.pair.m3 === 't2' || s.pair.m2 === 't3', text: L(
      "Kvadrat IKKITA nol beradi: p kvadrat minus to'qqiz uchda ham, minus uchda ham nolga aylanadi, chunki har ikkisining kvadrati to'qqiz. p minus uch esa faqat uchda. Ikkalasini qo'yib tekshiring.",
      'Квадрат даёт ДВА нуля: p в квадрате минус девять обращается в нуль и при трёх, и при минус трёх — квадрат обоих равен девяти. А p минус три только при трёх. Подставь оба.',
      'A square gives TWO zeros: p squared minus nine becomes zero at three and at minus three, since both squares are nine. But p minus three only at three. Substitute both.') },
    { when: (s) => s.pair.m1 && s.pair.m1 !== 't1', text: L(
      "Birinchi yozuvda ko'paytuvchi — p ning o'zi. U nolda nolga aylanadi, va o'sha yerda surat ham, maxraj ham nol bo'ladi.",
      'В первой записи множитель — сама p. Она обращается в нуль при нуле, и там же обнуляются и числитель, и знаменатель.',
      'In the first record the factor is p itself. It becomes zero at zero, and there both numerator and denominator vanish.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvda bitta savol bering: yetti to'rtdanni NIMAGA ko'paytirishgan? O'sha ko'paytuvchi nolga aylanadigan son — javob.",
      'К каждой записи один вопрос: на ЧТО умножили семь четвёртых? Число, при котором этот множитель обращается в нуль, и есть ответ.',
      'Ask one question of each record: what was seven quarters multiplied BY? The number where that factor becomes zero is the answer.') },
  ],
  wrongText: L(
    "Ko'paytuvchini toping va uni nolga tenglang. Shart o'sha yechimdan chiqadi.",
    'Найди множитель и приравняй его к нулю. Условие выходит из этого решения.',
    'Find the factor and set it to zero. The condition comes out of that.'),
};

export default function D02_08(props) { return <MatchPairs data={DATA} {...props} />; }
