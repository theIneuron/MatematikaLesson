// Dars51 · Amaliyot 09 — Juftlash · 🔴 · tag: arc_to_angle
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §3 (51-dars, 9-pozitsiya)
//
// IKKI MANBA, BITTA HISOB: ikki qatorda YOY berilgan, ikki qatorda esa
// MARKAZIY burchak. Markaziy burchak yoyga teng, ya'ni ikkala manba ham
// yarimlanadi. 48-darsning fakti shu yerda ishga tushadi.
// Oxirgi juftlik o'tmas burchak beradi (100°) — bu odatda kutilmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'arc_to_angle', level: '🔴',
  connect: true,
  targetSize: 20, itemSize: 14,
  items: [
    { id: 'm1', tokens: ['yoy 50°'] },
    { id: 'm2', tokens: ['markaziy 90°'] },
    { id: 'm3', tokens: ['yoy 160°'] },
    { id: 'm4', tokens: ['markaziy 200°'] },
  ],
  targets: [
    { id: 't1', tokens: ['25°'] },
    { id: 't2', tokens: ['45°'] },
    { id: 't3', tokens: ['80°'] },
    { id: 't4', tokens: ['100°'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt shart, va ular ikki xil: ikkitasida YOY berilgan, ikkitasida esa MARKAZIY burchak. Markaziy burchak o'zi tiralgan yoyga teng, demak ikkala holatda ham bir xil ish qilinadi. Har shart uchun ichki chizilgan burchakni topish kerak.",
    'Четыре условия, и они двух видов: в двух дана ДУГА, в двух ЦЕНТРАЛЬНЫЙ угол. Центральный угол равен дуге, на которую опирается, значит в обоих случаях делается одно и то же. Для каждого условия надо найти вписанный угол.',
    'Four conditions of two kinds: two give the ARC, two give the CENTRAL angle. A central angle equals the arc it subtends, so the same work is done in both cases. For each condition find the inscribed angle.'),
  ask: L(
    "Chapdan shartni bosing, keyin o'ngdan burchakni bosing.",
    'Нажми условие слева, потом угол справа.',
    'Tap a condition on the left, then the angle on the right.'),
  correctText: L(
    "To'g'ri. To'rt qatorda ham bitta amal: ikkiga bo'lish. Markaziy burchak berilgan qatorlarda bir qadam ko'proq ko'rinadi, lekin u aslida yo'q — markaziy burchak yoyga teng, ya'ni uni yoyning o'rniga qo'yish mumkin. Oxirgi javob o'tmas burchak: ikki yuz graduslik yoyga tiralgan ichki chizilgan burchak bir yuz gradus bo'ladi, va bunday burchak ham bo'laveradi.",
    'Верно. Во всех четырёх строках одно действие: деление на два. Там, где дан центральный угол, кажется, что шагов на один больше, но его нет — центральный угол равен дуге, значит его можно подставить вместо дуги. Последний ответ тупой угол: вписанный угол, опирающийся на дугу в двести градусов, равен ста, и такой угол вполне бывает.',
    'Correct. All four rows take one operation: division by two. Where the central angle is given it looks like an extra step, but there is none — a central angle equals the arc, so it can stand in for the arc. The last answer is an obtuse angle: an inscribed angle subtending an arc of two hundred degrees is a hundred, and such an angle does occur.'),
  wrongs: [
    { when: (s) => s.pair.m2 === 't1' || s.pair.m1 === 't2', text: L(
      "Ikki shart o'rin almashdi. Ellik graduslik yoy yigirma besh gradus beradi, to'qson graduslik markaziy burchak esa qirq besh. Har qatorda faqat bitta amal bor: berilgan sonni ikkiga bo'ling. Markaziy burchak ham, yoy ham bir xil ishlaydi, chunki ular o'zaro teng.",
      'Два условия поменялись местами. Дуга в пятьдесят градусов даёт двадцать пять, а центральный угол в девяносто — сорок пять. В каждой строке лишь одно действие: раздели данное число на два. Центральный угол и дуга работают одинаково, ведь они равны между собой.',
      'Two conditions swapped places. An arc of fifty degrees gives twenty-five, and a central angle of ninety gives forty-five. Each row takes one operation: divide the given number by two. The central angle and the arc behave the same, since they are equal to each other.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "Oxirgi qator noto'g'ri juftlashdi. Ikki yuz graduslik markaziy burchak ikki yuz graduslik yoyga tiraladi, uning yarmi bir yuz gradus. Bir yuz gradus to'qsondan katta, ya'ni burchak o'tmas — bu g'alati ko'rinishi mumkin, lekin ichki chizilgan burchak o'tmas bo'lishi mumkin, chunki yoy bir yuz saksondan katta.",
      'Последняя строка сопоставлена неверно. Центральный угол в двести градусов опирается на дугу в двести градусов, её половина сто. Сто больше девяноста, то есть угол тупой — это может показаться странным, но вписанный угол бывает тупым, если дуга больше ста восьмидесяти.',
      'The last row is matched wrongly. A central angle of two hundred degrees subtends an arc of two hundred degrees, whose half is a hundred. A hundred is more than ninety, so the angle is obtuse — this may look odd, but an inscribed angle can be obtuse when the arc exceeds a hundred and eighty.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Uchtadan ko'p qator o'z juftini topmadi. Hamma qatorda bitta ish: berilgan sonni ikkiga bo'ling va natijani o'ng ustundan qidiring. Markaziy burchak yoyga teng, ya'ni uni alohida hisoblash kerak emas.",
      'Больше трёх строк не нашли свою пару. Во всех строках одно и то же: раздели данное число на два и ищи результат в правом столбце. Центральный угол равен дуге, отдельно его пересчитывать не надо.',
      'More than three rows failed to find their pair. Every row takes the same work: divide the given number by two and look for the result in the right column. A central angle equals the arc, so it needs no separate conversion.') },
    { when: () => true, text: L(
      "Bitta qator o'z juftini topmadi. Har shartni alohida oling va ikkiga bo'ling: ellik, to'qson, bir yuz oltmish va ikki yuz — yigirma besh, qirq besh, sakson va bir yuz beradi.",
      'Одна строка не нашла свою пару. Возьми каждое условие отдельно и раздели на два: пятьдесят, девяносто, сто шестьдесят и двести дадут двадцать пять, сорок пять, восемьдесят и сто.',
      'One row failed to find its pair. Take each condition separately and divide by two: fifty, ninety, a hundred and sixty, and two hundred give twenty-five, forty-five, eighty, and a hundred.') },
  ],
  wrongText: L(
    "Markaziy burchak yoyga teng. Har qatorda berilgan sonni ikkiga bo'ling.",
    'Центральный угол равен дуге. В каждой строке раздели данное число на два.',
    'A central angle equals the arc. In each row divide the given number by two.'),
};

export default function D51_09(props) { return <MatchPairs data={DATA} {...props} />; }
