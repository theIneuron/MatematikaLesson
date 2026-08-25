// Dars12 · Amaliyot 03 — Guruhlar · 🟢 · tag: splits_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §3 (12-dars, 3-pozitsiya)
//
// DARSNING 12-EKRANI SHU YERDA TEKSHIRILADI (`Dars12.jsx`, З32). Ikkinchi
// guruhning hamma kartasida ko'paytma MUSBAT, ya'ni ildiz BOR va uni hisoblash
// mumkin: minus to'qqiz karra minus to'rt o'ttiz olti, ildizi olti. Lekin
// KO'PAYTUVCHILARDAN alohida ildiz olib bo'lmaydi — minus to'qqizdan ildiz
// yo'q. Ya'ni xossa faqat ikkala ko'paytuvchi nomanfiy bo'lganda ishlaydi.
//
// Shuning uchun guruhlar «ildiz bor / yo'q» emas: ikki guruhda ham ildiz bor.
// Ajratadigan narsa — YOZUVNI IKKI ILDIZGA yozish mumkinmi.
// Qiymatga qarab ajratgan o'quvchi shu yerda tutiladi.
// Zona sarlavhasi qisqa SO'Z: telefonda ustun keni 74px (kit.jsx, Zones).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'splits_or_not', level: '🟢',
  zoneSize: 16, itemSize: 15,
  zones: [
    { id: 'z1', label: L('AJRATILADI', 'РАЗДЕЛЯЕТСЯ', 'SPLITS') },
    { id: 'z2', label: L('AJRATILMAYDI', 'НЕ РАЗДЕЛЯЕТСЯ', 'DOES NOT') },
  ],
  items: [
    { id: 'i1', tokens: [{ r: '9 · 49' }], zone: 'z1' },
    { id: 'i2', tokens: [{ r: '(−9) · (−4)' }], zone: 'z2' },
    { id: 'i3', tokens: [{ r: '16 · 81' }], zone: 'z1' },
    { id: 'i4', tokens: [{ r: '(−16) · (−25)' }], zone: 'z2' },
    { id: 'i5', tokens: [{ r: '4 · 121' }], zone: 'z1' },
    { id: 'i6', tokens: [{ r: '(−2) · (−50)' }], zone: 'z2' },
    { id: 'i7', tokens: [{ r: '25 · 144' }], zone: 'z1' },
    { id: 'i8', tokens: [{ r: '(−1) · (−81)' }], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuvning hammasida ildiz bor: ko'paytmalar musbat. Lekin ba'zilarini ikki ildizga yozish mumkin, ba'zilarini esa yo'q.",
    'У всех восьми записей корень есть: произведения положительны. Но одни можно записать через два корня, а другие нет.',
    'All eight records have a root: the products are positive. But some can be written as two roots and others cannot.'),
  ask: L(
    "Yozuvni bosing, keyin guruhini bosing. Har ko'paytuvchidan alohida ildiz olish mumkinmi?",
    'Нажми запись, потом её группу. Можно ли взять корень из каждого множителя отдельно?',
    'Tap a record, then its group. Can the root be taken from each factor separately?'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  // RAZBOR QISQA: o'lchov 2026-08-24 (grade8-practice-panel.mjs) telefonda RU
  // matnining oxirgi satrlari panel ostida qolganini ko'rsatdi (25px).
  correctText: L(
    "To'g'ri. Xossa faqat ikkala ko'paytuvchi NOMANFIY bo'lganda ishlaydi. Birinchi guruhda hamma son musbat: to'qqiz karra qirq to'qqizdan ildiz yigirma bir, va u uch karra yetti bilan bir xil. Ikkinchi guruhda ko'paytma musbat, ildiz ham bor: minus to'qqiz karra minus to'rt o'ttiz olti, ildizi olti. Lekin minus to'qqizdan ildiz yo'q, demak yozuvni ikkiga ajratish yo'li yopiq.",
    'Верно. Свойство работает только когда оба множителя НЕОТРИЦАТЕЛЬНЫ. В первой группе все числа положительны: корень из девяти на сорок девять — двадцать один, и это то же, что три на семь. Во второй группе произведение положительно и корень есть: минус девять на минус четыре тридцать шесть, корень шесть. Но из минус девяти корня нет, значит разбить запись на два корня нельзя.',
    'Correct. The property works only when both factors are NON-NEGATIVE. In the first group every number is positive: the root of nine times forty nine is twenty one, the same as three times seven. In the second group the product is positive and the root exists: minus nine times minus four is thirty six, root six. But minus nine has no root, so the record cannot be split into two roots.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Ikkala ko'paytuvchi MANFIY bo'lgan yozuv birinchi guruhga tushdi. Ko'paytmasi musbat, bu to'g'ri: minus to'qqiz karra minus to'rt o'ttiz olti. Lekin ajratishga urinib ko'ring — minus to'qqizdan ildiz kerak bo'ladi, kvadrati minus to'qqizga teng son esa yo'q.",
      'Запись, где ОБА множителя отрицательны, попала в первую группу. Произведение положительно — верно, минус девять на минус четыре тридцать шесть. Но попробуй разделить: понадобится корень из минус девяти, а числа с таким квадратом нет. Корень должен извлекаться из каждого множителя.',
      'A record with BOTH factors negative went into the first group. The product is positive, that is true: minus nine times minus four is thirty six. But try splitting it: you would need the root of minus nine, and no number squares to minus nine. To distribute a root over factors, each factor must have a root of its own.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Hamma soni musbat bo'lgan yozuv ikkinchi guruhga tushdi. Bu yerda ajratish ishlaydi va u hisobni yengillashtiradi: yigirma besh karra yuz qirq to'rtni ko'paytirish o'rniga beshni o'n ikkiga ko'paytirsangiz oltmish chiqadi. Tekshiring: oltmishni kvadratga oshirsangiz uch ming olti yuz, yigirma besh karra yuz qirq to'rt ham uch ming olti yuz.",
      'Запись, где все числа положительны, попала во вторую группу. Здесь разделение работает и облегчает счёт: вместо умножения двадцати пяти на сто сорок четыре умножь пять на двенадцать — выйдет шестьдесят. Проверь: шестьдесят в квадрате три тысячи шестьсот, и двадцать пять на сто сорок четыре тоже три тысячи шестьсот.',
      'A record with all numbers positive went into the second group. Here splitting works and makes the arithmetic easier: instead of multiplying twenty five by one hundred forty four, multiply five by twelve and get sixty. Check: sixty squared is three thousand six hundred, and twenty five times one hundred forty four is three thousand six hundred too.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har yozuvda bitta savol bering: chiziq ostidagi ko'paytuvchilarning O'ZIDAN ildiz olinadimi. Ikkalasi ham nomanfiy bo'lsa — ajratiladi. Bittasi manfiy bo'lsa — ajratilmaydi, hatto ko'paytma musbat bo'lsa ham.",
      'С каждой записью задай один вопрос: извлекается ли корень из САМИХ множителей. Оба неотрицательны — разделяется. Хоть один отрицателен — не разделяется, даже если произведение положительно.',
      'Ask one question of every record: does a root exist for the FACTORS themselves. Both non-negative means it splits. Even one negative means it does not, however positive the product is.') },
  ],
  wrongText: L(
    "Ko'paytmaning qiymatiga qaramang, KO'PAYTUVCHILARGA qarang. Manfiy sondan ildiz yo'q, demak u turgan yozuv ikki ildizga ajralmaydi.",
    'Смотри не на значение произведения, а на МНОЖИТЕЛИ. Из отрицательного числа корня нет, значит такая запись на два корня не разбивается.',
    'Look not at the value of the product but at the FACTORS. A negative number has no root, so a record containing one does not split into two roots.'),
};

export default function D12_03(props) { return <Zones data={DATA} {...props} />; }
