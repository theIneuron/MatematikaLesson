// Dars47 · Amaliyot 09 — Pazl · 🔴 · tag: rhombus_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §9 (47-dars, 9-pozitsiya)
//
// UCH JUFTLIK, HAMMASI ROMB HAQIDA, LEKIN UCH XIL YO'NALISHDA:
//   d = 16, 30 -> a = 17   (yarim diagonallar 8 va 15)
//   a = 13, d = 24 -> d = 10   (yarim diagonal 12, ikkinchisi 5, butuni 10)
//   a = 25, d = 30 -> d = 40   (yarim diagonal 15, ikkinchisi 20, butuni 40)
//
// Ikkinchi va uchinchi juftlikda IKKI marta o'lchov o'zgaradi: butun
// diagonaldan yarmiga, keyin yarmidan butunga. З104 ning naqshi — u 49-darsda
// vatar bilan takrorlanadi.
// Kartalarda yozuv bo'shliqsiz (telefonda karta 54px, skelet §14).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'rhombus_pairs', level: '🔴',
  faceSize: 12, faceSizePhone: 10,
  cards: [
    { id: 'f1', side: 0, tokens: ['d=16, 30'] },
    { id: 'f2', side: 0, tokens: ['a=13, d=24'] },
    { id: 'f3', side: 0, tokens: ['a=25, d=30'] },
    { id: 'v1', side: 1, v: 'a = 17' },
    { id: 'v2', side: 1, v: 'd = 10' },
    { id: 'v3', side: 1, v: 'd = 40' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uchta romb. Rombning diagonallari bir-birini teng ikkiga bo'ladi va o'zaro perpendikulyar, ya'ni ular rombni to'rt bir xil to'g'ri burchakli uchburchakka bo'ladi: katetlari yarim diagonallar, gipotenuzasi esa rombning tomoni. Birinchi kartada ikki diagonal berilgan, qolganlarida tomon va bitta diagonal.",
    'Три ромба. Диагонали ромба делят друг друга пополам и взаимно перпендикулярны, то есть разбивают ромб на четыре одинаковых прямоугольных треугольника: катеты — полудиагонали, гипотенуза — сторона ромба. В первой карточке даны две диагонали, в остальных сторона и одна диагональ.',
    'Three rhombuses. The diagonals of a rhombus bisect each other and are mutually perpendicular, splitting it into four identical right triangles: the legs are the half diagonals and the hypotenuse is the side. The first card gives two diagonals, the others a side and one diagonal.'),
  ask: L(
    'Shartni bosing, keyin uyani bosing.',
    'Нажми условие, потом ячейку.',
    'Tap a condition, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisida ikki diagonal berilgan: yarim diagonallar sakkiz va o'n besh, ya'ni oltmish to'rt qo'shuv ikki yuz yigirma besh ikki yuz sakson to'qqiz, ildizi o'n yetti — tomon shu. Ikkinchisida yo'nalish teskari: tomon o'n uch, bitta diagonal yigirma to'rt, ya'ni uning yarmi o'n ikki; ikkinchi yarim diagonal bir yuz oltmish to'qqiz minus bir yuz qirq to'rt ning ildizi, ya'ni besh; butun diagonal esa uning ikki barobari — o'n. Uchinchisi ham shunday: tomon yigirma besh, yarim diagonal o'n besh, ikkinchi yarmi yigirma, butun diagonal qirq. Diqqat: ikki joyda O'LCHOV IKKI MARTA o'zgaradi — avval ikkiga bo'linadi, keyin ikkilantiriladi.",
    'Верно. В первой даны две диагонали: полудиагонали восемь и пятнадцать, значит шестьдесят четыре плюс двести двадцать пять — двести восемьдесят девять, корень семнадцать, это и есть сторона. Во второй направление обратное: сторона тринадцать, одна диагональ двадцать четыре, значит её половина двенадцать; вторая полудиагональ равна корню из ста шестидесяти девяти минус ста сорока четырёх, то есть пяти; а вся диагональ вдвое больше — десять. Третья так же: сторона двадцать пять, полудиагональ пятнадцать, вторая полудиагональ двадцать, вся диагональ сорок. Внимание: в двух местах МАСШТАБ меняется ДВАЖДЫ — сначала делится на два, потом удваивается.',
    'Correct. The first gives two diagonals: the half diagonals are eight and fifteen, so sixty four plus two hundred twenty five is two hundred eighty nine, the root seventeen, which is the side. The second runs backwards: the side is thirteen and one diagonal twenty four, so its half is twelve; the other half diagonal is the root of one hundred sixty nine minus one hundred forty four, that is five; and the whole diagonal is twice that — ten. The third is the same: side twenty five, half diagonal fifteen, the other half twenty, the whole diagonal forty. Note: in two places the SCALE changes TWICE — first halving, then doubling.'),
  wrongs: [
    { when: (s) => s.mate.f1 && s.mate.f1 !== 'v1', text: L(
      "Birinchi kartada ikki DIAGONAL berilgan, ya'ni izlanadigan narsa tomon. Diagonallarni ikkiga bo'ling: sakkiz va o'n besh; ular katetlar, tomon esa gipotenuza. Oltmish to'rt qo'shuv ikki yuz yigirma besh ning ildizi o'n yetti. Butun diagonallar bilan hisoblasangiz, javob ikki barobar katta chiqadi.",
      'В первой карточке даны две ДИАГОНАЛИ, значит искать надо сторону. Раздели диагонали на два: восемь и пятнадцать; это катеты, а сторона гипотенуза. Корень из шестидесяти четырёх плюс двухсот двадцати пяти равен семнадцати. Если считать по целым диагоналям, ответ выйдет вдвое больше.',
      'The first card gives two DIAGONALS, so the side is sought. Halve the diagonals: eight and fifteen; those are the legs and the side is the hypotenuse. The root of sixty four plus two hundred twenty five is seventeen. Computing with the whole diagonals would double the answer.') },
    { when: (s) => s.mate.f2 === 'v3' || s.mate.f3 === 'v2', text: L(
      "Bu ikki natija almashib ketdi. Har birini uch qadamda hisoblang. Birinchisi: yarim diagonal o'n ikki, tomon o'n uch, ikkinchi yarim diagonal besh, butun diagonal o'n. Ikkinchisi: yarim diagonal o'n besh, tomon yigirma besh, ikkinchi yarim diagonal yigirma, butun diagonal qirq. Oxirgi qadamni tashlab ketsangiz, besh va yigirma chiqadi — bunday karta yo'q.",
      'Эти два результата поменялись местами. Считай каждый в три шага. Первый: полудиагональ двенадцать, сторона тринадцать, вторая полудиагональ пять, вся диагональ десять. Второй: полудиагональ пятнадцать, сторона двадцать пять, вторая полудиагональ двадцать, вся диагональ сорок. Если пропустить последний шаг, выйдут пять и двадцать — таких карточек нет.',
      'These two results swapped places. Compute each in three steps. First: half diagonal twelve, side thirteen, other half diagonal five, whole diagonal ten. Second: half diagonal fifteen, side twenty five, other half twenty, whole diagonal forty. Skip the last step and you get five and twenty — there are no such cards.') },
    { when: (s) => s.bad.length >= 2, text: L(
      "Har kartada uchburchakning katetlari YARIM diagonallar ekanini eslang. Diagonal berilgan bo'lsa — ikkiga bo'ling; javob diagonal bo'lsa — oxirida ikkilantiring. Tomon esa har doim gipotenuza va u yarim diagonallardan uzun.",
      'В каждой карточке помни: катеты треугольника — ПОЛОВИНЫ диагоналей. Дана диагональ — раздели на два; ответ диагональ — в конце удвой. А сторона всегда гипотенуза и длиннее полудиагоналей.',
      'Remember in every card that the legs of the triangle are HALF diagonals. A diagonal given: halve it; a diagonal as the answer: double at the end. The side is always the hypotenuse and longer than the half diagonals.') },
  ],
  wrongText: L(
    "Katetlar — yarim diagonallar. Diagonal berilsa ikkiga bo'ling, diagonal so'ralsa oxirida ikkilantiring.",
    'Катеты — полудиагонали. Дана диагональ — делишь на два, спрошена диагональ — в конце удваиваешь.',
    'The legs are half diagonals. A given diagonal is halved; a diagonal asked for is doubled at the end.'),
};

export default function D47_09(props) { return <PairSlots data={DATA} {...props} />; }
