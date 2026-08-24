// Dars01 · Amaliyot 02 — Guruhlar · 🟢 · tag: same_value_groups
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md §02
//
// Ikki guruh bir-biriga TESKARI: 4/a da harf chiziq tagida, a/4 da ustida.
// To'rt karta juft-juft o'xshash ko'rinadi (8/(2a) va 2a/8), ajratadigan
// narsa faqat harf qaysi qavatda turgani — T1.
// Guruh sarlavhasi SO'Z emas, KASR: `zones[].tokens` (kit.jsx, Zones).
// Razborda shart ham aytiladi: birinchi guruhda a ≠ 0, ikkinchisida taqiq yo'q.
// Yozuvlar har ochilganda aralashtiriladi (Zones ichida).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'same_value_groups', level: '🟢',
  zoneLbl: 92, zoneSize: 20, itemSize: 20,
  zones: [
    { id: 'z1', tokens: [{ n: '4', d: 'a' }] },
    { id: 'z2', tokens: [{ n: 'a', d: '4' }] },
  ],
  items: [
    { id: 'i1', tokens: [{ n: '8', d: '2a' }], zone: 'z1' },
    { id: 'i2', tokens: [{ n: '12', d: '3a' }], zone: 'z1' },
    { id: 'i3', tokens: [{ n: '2a', d: '8' }], zone: 'z2' },
    { id: 'i4', tokens: [{ n: '3a', d: '12' }], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Yuqorida ikki guruh turadi, har birida bitta kasr. Pastdagi to'rt kartaning qiymati shu kasrlardan biriga teng, yozuvi esa boshqacha.",
    'Сверху две группы, в каждой по одной дроби. Значение каждой из четырёх карточек снизу равно одной из них, а запись другая.',
    'Two groups are shown above, one fraction in each. Each of the four cards below has the value of one of them, written differently.'),
  ask: L('Kartani bosing, keyin uning guruhini bosing.', 'Нажми карточку, потом её группу.', 'Tap a card, then tap its group.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Sakkizni ikki a ga bo'lsangiz to'rt a ga qoladi, o'n ikkini uch a ga bo'lsangiz ham xuddi shu. a ni ikkiga qo'ying: birinchi guruhda ikki chiqadi, ikkinchisida yarim. Birinchi guruhda a nolga teng bo'lmasligi kerak, ikkinchisida esa taqiq umuman yo'q — chunki u yerda harf chiziqning ustida.",
    'Верно. Восемь разделить на два a — остаётся четыре a; двенадцать на три a — то же самое. Подставь a равное двум: в первой группе выйдет два, во второй — половина. В первой группе a не должно быть нулём, во второй запрета нет вовсе — там буква стоит над чертой.',
    'Correct. Eight over two a leaves four over a; twelve over three a gives the same. Put a equal to two: the first group gives two, the second gives one half. In the first group a must not be zero; in the second there is no ban at all, because the letter is above the bar.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'z2' || s.place.i2 === 'z2', text: L(
      "Bu ikkisida harf chiziqning TAGIDA qoldi: sakkizni ikki a ga bo'lyapmiz, ikki a ni sakkizga emas. a ni ikkiga qo'yib ikkala guruhning qiymatini solishtiring.",
      'В этих двух буква осталась ПОД чертой: делим восемь на два a, а не два a на восемь. Подставь a равное двум и сравни значения обеих групп.',
      'In these two the letter stayed BELOW the bar: eight is divided by two a, not two a by eight. Put a equal to two and compare the values of both groups.') },
    { when: (s) => s.place.i3 === 'z1' || s.place.i4 === 'z1', text: L(
      "Bu ikkisida harf chiziqning USTIDA: ikki a ni sakkizga bo'lyapmiz. Bunday kasr a o'sganda o'sadi, birinchi guruh esa teskari — a o'sganda kamayadi.",
      'В этих двух буква стоит НАД чертой: два a делим на восемь. Такая дробь растёт вместе с a, а первая группа наоборот — с ростом a убывает.',
      'In these two the letter is ABOVE the bar: two a is divided by eight. Such a fraction grows with a, while the first group does the opposite.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har kartada bitta narsani ko'ring: a qaysi qavatda? Chiziq tagida bo'lsa birinchi guruh, ustida bo'lsa ikkinchi guruh.",
      'Смотри в каждой карточке одно: на каком этаже стоит a? Под чертой — первая группа, над чертой — вторая.',
      'Look for one thing in each card: which floor is a on? Below the bar means the first group, above it the second.') },
  ],
  wrongText: L(
    "a ni ikkiga qo'yib har kartani hisoblang. Ikki chiqsa birinchi guruh, yarim chiqsa ikkinchisi.",
    'Подставь a равное двум и посчитай каждую карточку. Вышло два — первая группа, вышла половина — вторая.',
    'Put a equal to two and compute each card. Two means the first group, one half means the second.'),
};

export default function D01_02(props) { return <Zones data={DATA} {...props} />; }
