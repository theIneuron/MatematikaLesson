// Dars15 · Amaliyot 03 — Ishora · 🟢 · tag: sign_of_b
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3 (15-dars, 3-pozitsiya)
//
// З39 NING TAYANCHI: koeffitsiyent ISHORASI BILAN o'qiladi. Sakkiz karta
// juft-juft: har juftlikda faqat b ning ishorasi farq qiladi, qolgani bir xil.
// Shuning uchun «yozuvni umumiy ko'rinishi bo'yicha tanish» yo'li ishlamaydi —
// bitta belgiga qarash kerak.
//
// IKKI KARTADA BOSH KOEFFITSIYENT MANFIY (`−p² − 4p + 7` va `−p² + 4p + 7`):
// a ning minusi b ning ishorasiga TEGMAYDI. Aynan shu joyda o'quvchi
// «yozuvda ikki minus bor, demak b musbat» degan yo'lga kirib ketadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'sign_of_b', level: '🟢',
  zoneSize: 15, itemSize: 14,
  zones: [
    { id: 'z1', label: L('b MANFIY', 'b ОТРИЦАТЕЛЬНОЕ', 'b NEGATIVE') },
    { id: 'z2', label: L('b MUSBAT', 'b ПОЛОЖИТЕЛЬНОЕ', 'b POSITIVE') },
  ],
  items: [
    { id: 'i1', tokens: ['p² − 3p + 1 = 0'], zone: 'z1' },
    { id: 'i2', tokens: ['p² + 3p − 1 = 0'], zone: 'z2' },
    { id: 'i3', tokens: ['2p² − p = 0'], zone: 'z1' },
    { id: 'i4', tokens: ['3p² + p = 0'], zone: 'z2' },
    { id: 'i5', tokens: ['−p² − 4p + 7 = 0'], zone: 'z1' },
    { id: 'i6', tokens: ['−p² + 4p + 7 = 0'], zone: 'z2' },
    { id: 'i7', tokens: ['5p² − 10p − 2 = 0'], zone: 'z1' },
    { id: 'i8', tokens: ['5p² + 10p − 2 = 0'], zone: 'z2' },
  ],
  eyebrow: L('Ishora', 'Знак', 'Sign'),
  setup: L(
    "Ikkinchi koeffitsiyent — p ning oldidagi son, va u ISHORASI bilan o'qiladi. Kartalar juft-juft: har juftlikda faqat bitta belgi farq qiladi.",
    'Второй коэффициент — это число перед p, и читается он ВМЕСТЕ со знаком. Карточки идут парами: в каждой паре различается только один знак.',
    'The second coefficient is the number in front of p, and it is read together with its sign. The cards come in pairs: within a pair only one sign differs.'),
  ask: L(
    "Yozuvni bosing, keyin guruhini bosing. b ning ishorasi qanday?",
    'Нажми запись, потом её группу. Какой знак у b?',
    'Tap a record, then its group. What is the sign of b?'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Ikkinchi koeffitsiyent p ning oldidagi son va uning ishorasi: minus uch, arti uch, minus bir, arti bir, minus to'rt, arti to'rt, minus o'n, arti o'n. Ikki yozuvda bosh koeffitsiyent manfiy, lekin bu b ga tegmaydi.",
    'Верно. Второй коэффициент — это число перед p вместе со знаком: минус три, плюс три, минус один, плюс один, минус четыре, плюс четыре, минус десять, плюс десять. В двух записях старший коэффициент отрицателен, но к b это не относится.',
    'Correct. The second coefficient is the number in front of p together with its sign: minus three, plus three, minus one, plus one, minus four, plus four, minus ten, plus ten. In two records the leading coefficient is negative, but that does not concern b.'),
  wrongs: [
    { when: (s) => s.place.i5 === 'z2' || s.place.i6 === 'z1', text: L(
      "Bosh koeffitsiyent manfiy bo'lgan yozuv chalg'itdi. a ning minusi faqat x kvadratga tegishli; b esa p ning oldidagi belgidan o'qiladi.",
      'Запись с отрицательным старшим коэффициентом сбила с толку. Минус у a относится только к икс квадрат; а b читается по знаку перед p.',
      'The record with a negative leading coefficient threw you off. The minus of a belongs to x squared only; b is read from the sign in front of p.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i4 === 'z1', text: L(
      "Bu yozuvlarda koeffitsiyent KO'RINMAYDI, lekin u bor va birga teng. Minus p degani minus bir karra p, arti p degani arti bir karra p. Ishora esa belgidan o'qiladi.",
      'В этих записях коэффициент НЕ ВИДЕН, но он есть и равен единице. Минус p это минус один на p, плюс p это плюс один на p. А знак читается из записи.',
      'In these records the coefficient is INVISIBLE, but it exists and equals one. Minus p is minus one times p, plus p is plus one times p. The sign is read from the record.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har yozuvda bitta joyga qarang: p ning oldidagi belgi va son. Kvadrat had ham, ozod had ham bu savolga aloqasi yo'q.",
      'В каждой записи смотри в одно место: знак и число перед p. Ни квадратное слагаемое, ни свободный член к этому вопросу отношения не имеют.',
      'Look at one place in every record: the sign and number in front of p. Neither the squared term nor the constant term has anything to do with this question.') },
  ],
  wrongText: L(
    "b ni p ning oldidan o'qing, belgisi bilan birga. Bosh koeffitsiyentning minusi b ga o'tmaydi, va ko'rinmagan koeffitsiyent birga teng.",
    'Читай b перед p, вместе со знаком. Минус старшего коэффициента на b не переходит, а невидимый коэффициент равен единице.',
    'Read b from in front of p, together with its sign. The minus of the leading coefficient does not carry over to b, and an invisible coefficient equals one.'),
};

export default function D15_03(props) { return <Zones data={DATA} {...props} />; }
