// Dars14 · Amaliyot 07 — Saralash · 🟡 · teg: ikkita-ildiz-deb-oylash
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// Zona — NOM emas, XOSSA: uch hadning nechta haqiqiy ildizi bor.
// TEKSHIRUV (diskriminant):
//   x² − 7x + 10 -> 49 − 40 = 9 > 0        ikkita
//   x² + 3x − 4  -> 9 + 16 = 25 > 0        ikkita
//   x² + 8x + 16 -> 64 − 64 = 0            bitta
//   4x² − 4x + 1 -> 16 − 16 = 0            bitta
//   x² + x + 3   -> 1 − 12 = −11 < 0       nolta
//   x² − 2x + 5  -> 4 − 20 = −16 < 0       nolta
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'ikkita-ildiz-deb-oylash', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Har bir uch had uchun diskriminantni hisoblang va nechta ildiz borligini aniqlang.",
    'Для каждого трёхчлена посчитай дискриминант и определи, сколько корней.',
    'For each trinomial compute the discriminant and decide how many roots there are.'),
  ask: L(
    'Yozuvni bosing, keyin guruhni bosing.',
    'Нажми запись, потом нажми группу.',
    'Tap a record, then tap a group.'),
  itemSize: 16,
  zones: [
    { id: 'a', label: L('Ikkita ildiz', 'Два корня', 'Two roots') },
    { id: 'b', label: L('Bitta ildiz', 'Один корень', 'One root') },
    { id: 'c', label: L("Ildiz yo'q", 'Корней нет', 'No roots') },
  ],
  items: [
    { id: 'i1', tokens: ['x² − 7x + 10'], zone: 'a' },
    { id: 'i2', tokens: ['x² + 3x − 4'], zone: 'a' },
    { id: 'i3', tokens: ['x² + 8x + 16'], zone: 'b' },
    { id: 'i4', tokens: ['4x² − 4x + 1'], zone: 'b' },
    { id: 'i5', tokens: ['x² + x + 3'], zone: 'c' },
    { id: 'i6', tokens: ['x² − 2x + 5'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Birinchi guruhda diskriminant musbat: to'qqiz va yigirma besh. Ikkinchi guruhda nol — ikkalasi ham to'liq kvadrat: iks qo'shuv to'rt butunning kvadrati va ikki iks minus bir butunning kvadrati. Uchinchi guruhda manfiy: minus o'n bir va minus o'n olti. Diskriminantning ISHORASI ildizlar sonini to'g'ridan-to'g'ri beradi, ildizlarni topish shart emas.",
    'Верно. В первой группе дискриминант положителен: девять и двадцать пять. Во второй — нуль, и оба трёхчлена полные квадраты: икс плюс четыре в квадрате и два икс минус один в квадрате. В третьей — отрицателен: минус одиннадцать и минус шестнадцать. ЗНАК дискриминанта прямо даёт число корней, сами корни искать не нужно.',
    'Correct. In the first group the discriminant is positive: nine and twenty-five. In the second it is zero, and both are perfect squares: x plus four squared, and two x minus one squared. In the third it is negative: minus eleven and minus sixteen. The SIGN of the discriminant gives the number of roots directly; the roots themselves need not be found.'),
  wrongs: [
    { when: (s) => s.place.i5 !== 'c' || s.place.i6 !== 'c', text: L(
      "Bu yozuvlarda diskriminant manfiy: birida bir minus o'n ikki, ikkinchisida to'rt minus yigirma. Manfiy diskriminantda haqiqiy ildiz umuman bo'lmaydi.",
      'В этих записях дискриминант отрицателен: в одной один минус двенадцать, в другой четыре минус двадцать. При отрицательном дискриминанте действительных корней нет вовсе.',
      'In these records the discriminant is negative: one minus twelve in one, four minus twenty in the other. With a negative discriminant there are no real roots at all.') },
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Bu yozuvlar to'liq kvadrat: diskriminanti nolga teng, ya'ni ildiz bitta. Iks qo'shuv to'rt butunning kvadratini nolga tenglashtiring — bitta ildiz chiqadi.",
      'Эти записи — полные квадраты: дискриминант равен нулю, значит корень один. Приравняй икс плюс четыре в квадрате к нулю — выйдет один корень.',
      'These records are perfect squares: the discriminant is zero, so there is one root. Set x plus four squared to zero — one root comes out.') },
    { when: (s) => s.place.i1 === 'b' || s.place.i2 === 'b', text: L(
      "Bu yozuvlarda diskriminant musbat: qirq to'qqiz minus qirq to'qqizga teng, va to'qqiz qo'shuv o'n olti yigirma beshga teng. Musbat diskriminant IKKITA har xil ildiz beradi, bitta emas.",
      'В этих записях дискриминант положителен: сорок девять минус сорок — девять, и девять плюс шестнадцать — двадцать пять. Положительный дискриминант даёт ДВА разных корня, а не один.',
      'In these records the discriminant is positive: forty-nine minus forty is nine, and nine plus sixteen is twenty-five. A positive discriminant gives TWO different roots, not one.') },
    { when: (s) => s.place.i1 === 'c' || s.place.i2 === 'c' || s.place.i3 === 'c' || s.place.i4 === 'c', text: L(
      "Uchinchi guruhga faqat diskriminanti MANFIY bo'lgan yozuvlar tushadi. Bu yozuvning diskriminanti manfiy emas.",
      'В третью группу попадают только записи с ОТРИЦАТЕЛЬНЫМ дискриминантом. У этой записи дискриминант не отрицателен.',
      'Only records with a NEGATIVE discriminant belong to the third group. This one does not have a negative discriminant.') },
  ],
  wrongText: L(
    "Har bir uch had uchun diskriminantni yozib hisoblang: iks oldidagi koeffitsientning kvadrati minus to'rt karra birinchi va oxirgi koeffitsientlarning ko'paytmasi. Uning ishorasi guruhni beradi.",
    'Для каждого трёхчлена выпиши и посчитай дискриминант: квадрат коэффициента при иксе минус четыре на произведение первого и последнего коэффициентов. Его знак и даёт группу.',
    'Write out and compute the discriminant for each trinomial: the square of the x-coefficient minus four times the product of the first and last coefficients. Its sign gives the group.'),
};

export default function D14_07(props) { return <Zones data={DATA} {...props} />; }
