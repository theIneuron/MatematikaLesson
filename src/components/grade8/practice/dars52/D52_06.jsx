// Dars52 · Amaliyot 06 — Juftlash · 🟡 · tag: quad_to_opposite_angle
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §4 (52-dars, 6-pozitsiya)
//
// T3 hisobga aylanadi: qarama-qarshi burchak bir yuz saksongacha
// to'ldiradi. Oxirgi juftlik chegara holati — to'qsonning qarama-qarshisi
// ham to'qson, va bu tenglik faqat to'g'ri burchakda chiqadi.
// 37-dars bilan QARAMA-QARSHI qo'yiladi: parallelogrammda qarama-qarshi
// burchaklar TENG, ichki chizilgan to'rtburchakda esa 180 gacha to'ldiradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'quad_to_opposite_angle', level: '🟡',
  connect: true,
  targetSize: 20, itemSize: 15,
  items: [
    { id: 'm1', tokens: ['∠A = 70°'] },
    { id: 'm2', tokens: ['∠A = 95°'] },
    { id: 'm3', tokens: ['∠B = 120°'] },
    { id: 'm4', tokens: ['∠B = 90°'] },
  ],
  targets: [
    { id: 't1', tokens: ['110°'] },
    { id: 't2', tokens: ['85°'] },
    { id: 't3', tokens: ['60°'] },
    { id: 't4', tokens: ['90°'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "ABCD ichki chizilgan to'rtburchak, ya'ni uning to'rt uchi ham aylanada yotadi. Ikki qatorda A burchagi, ikki qatorda B burchagi berilgan. Har biri uchun QARAMA-QARSHI burchakni topish kerak: A ga qarama-qarshi C, B ga qarama-qarshi D.",
    'ABCD вписанный четырёхугольник, то есть все четыре его вершины лежат на окружности. В двух строках дан угол A, в двух угол B. Для каждого надо найти ПРОТИВОПОЛОЖНЫЙ угол: для A это C, для B это D.',
    'ABCD is an inscribed quadrilateral, so all four of its vertices lie on the circle. Two rows give the angle A, two give the angle B. For each, find the OPPOSITE angle: opposite A is C, opposite B is D.'),
  ask: L(
    "Chapdan burchakni bosing, keyin o'ngdan qarama-qarshisini bosing.",
    'Нажми угол слева, потом противоположный ему справа.',
    'Tap an angle on the left, then its opposite on the right.'),
  correctText: L(
    "To'g'ri. Hamma qatorda bitta amal: bir yuz saksondan berilgan burchakni ayirish. Yetmishdan bir yuz o'n, to'qson beshdan sakson besh, bir yuz yigirmadan oltmish, to'qsondan esa to'qson. Oxirgisi qiziq: to'qsonning qarama-qarshisi ham to'qson chiqdi, ya'ni ikki burchak TENG bo'ldi. Lekin bu tenglik tasodif emas va umumiy qoida ham emas: u faqat to'g'ri burchakda chiqadi, chunki to'qson qo'shuv to'qson aynan bir yuz sakson.",
    'Верно. Во всех строках одно действие: вычесть данный угол из ста восьмидесяти. Из семидесяти сто десять, из девяноста пяти восемьдесят пять, из ста двадцати шестьдесят, а из девяноста девяносто. Последнее любопытно: у девяноста противоположный тоже девяносто, то есть углы оказались РАВНЫ. Но это равенство не случайно и не общее правило: оно выходит только у прямого угла, ведь девяносто плюс девяносто это ровно сто восемьдесят.',
    'Correct. Every row takes one operation: subtract the given angle from a hundred and eighty. Seventy gives a hundred and ten, ninety-five gives eighty-five, a hundred and twenty gives sixty, and ninety gives ninety. The last is curious: the opposite of ninety is also ninety, so the two angles came out EQUAL. But that equality is neither accidental nor a general rule: it happens only for a right angle, since ninety plus ninety is exactly a hundred and eighty.'),
  wrongs: [
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "To'qsonning qarama-qarshisi ham to'qson. Bu javob boshqalardan ajralib turadi va shuning uchun shubhali ko'rinadi, lekin hisob o'sha: bir yuz saksondan to'qsonni ayirsak to'qson qoladi. Ichki chizilgan to'rtburchakda ikki qarama-qarshi burchak teng bo'lishi mumkin, lekin faqat ikkalasi ham to'g'ri bo'lganda.",
      'У девяноста противоположный тоже девяносто. Этот ответ выделяется среди других и потому кажется подозрительным, но счёт тот же: сто восемьдесят минус девяносто это девяносто. У вписанного четырёхугольника два противоположных угла могут быть равны, но только если оба прямые.',
      'The opposite of ninety is also ninety. This answer stands out from the rest and so looks suspicious, but the arithmetic is the same: a hundred and eighty minus ninety is ninety. In an inscribed quadrilateral two opposite angles can be equal, but only when both are right.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m3 === 't1', text: L(
      "Yetmish va bir yuz yigirma o'rin almashdi. Har qatorni alohida hisoblang: bir yuz sakson ayirmoq yetmish bir yuz o'n, bir yuz sakson ayirmoq bir yuz yigirma esa oltmish. Berilgan burchak katta bo'lgani sari javob kichrayadi — ikkalasi birga har doim bir yuz saksonni to'ldiradi.",
      'Семьдесят и сто двадцать поменялись местами. Считай каждую строку отдельно: сто восемьдесят минус семьдесят это сто десять, а сто восемьдесят минус сто двадцать это шестьдесят. Чем больше данный угол, тем меньше ответ — вместе они всегда составляют сто восемьдесят.',
      'Seventy and a hundred and twenty swapped places. Compute each row separately: a hundred and eighty minus seventy is a hundred and ten, and a hundred and eighty minus a hundred and twenty is sixty. The larger the given angle, the smaller the answer — together they always make a hundred and eighty.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Uchtadan ko'p qator o'z juftini topmadi. Diqqat: bu parallelogramm emas. Parallelogrammda qarama-qarshi burchaklar TENG, ichki chizilgan to'rtburchakda esa ular bir yuz saksongacha TO'LDIRADI. Bir yuz saksondan berilganini ayiring.",
      'Больше трёх строк не нашли пару. Внимание: это не параллелограмм. В параллелограмме противоположные углы РАВНЫ, а у вписанного четырёхугольника они ДОПОЛНЯЮТ друг друга до ста восьмидесяти. Вычти данный угол из ста восьмидесяти.',
      'More than three rows failed to find their pair. Note: this is not a parallelogram. In a parallelogram opposite angles are EQUAL, while in an inscribed quadrilateral they COMPLETE each other to a hundred and eighty. Subtract the given angle from a hundred and eighty.') },
    { when: () => true, text: L(
      "Bitta qator o'z juftini topmadi. Har birida bir xil amal: bir yuz saksondan berilgan burchakni ayiring.",
      'Одна строка не нашла свою пару. В каждой одно и то же действие: вычти данный угол из ста восьмидесяти.',
      'One row failed to find its pair. Each takes the same operation: subtract the given angle from a hundred and eighty.') },
  ],
  wrongText: L(
    "Bir yuz saksondan berilgan burchakni ayiring. Bu tenglik emas, TO'LDIRISH.",
    'Вычти данный угол из ста восьмидесяти. Это не равенство, а ДОПОЛНЕНИЕ.',
    'Subtract the given angle from a hundred and eighty. This is not equality but COMPLETION.'),
};

export default function D52_06(props) { return <MatchPairs data={DATA} {...props} />; }
