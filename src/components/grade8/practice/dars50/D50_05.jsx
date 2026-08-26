// Dars50 · Amaliyot 05 — Guruhlar · 🟡 · tag: secant_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §12 (50-dars, 5-pozitsiya)
//
// IKKINCHI GURUH ATAYLAB IKKI XIL HOLATNI BIRGA OLADI: urinma (`d = R`) va
// umumiy nuqtasiz (`d > R`). Savol esa bitta: kesuvchimi. З107 shu yerda
// tutiladi — `d = R` ni kesuvchiga qo'yish.
//
// Razbor ikkinchi guruhning ichini ajratadi: ikkitasida bitta nuqta,
// ikkitasida nolta nuqta.
// Kartalarda faqat BELGI, zonalarning nomi esa SO'Z (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'secant_or_not', level: '🟡',
  zoneLbl: 116, zoneSize: 13, itemSize: 15,
  zones: [
    { id: 'z1', label: L('KESUVCHI', 'СЕКУЩАЯ', 'A SECANT') },
    { id: 'z2', label: L('KESUVCHI EMAS', 'НЕ СЕКУЩАЯ', 'NOT A SECANT') },
  ],
  items: [
    { id: 'i1', tokens: ['R=9, d=3'], zone: 'z1' },
    { id: 'i2', tokens: ['R=5, d=5'], zone: 'z2' },
    { id: 'i3', tokens: ['R=12, d=7'], zone: 'z1' },
    { id: 'i4', tokens: ['R=8, d=9'], zone: 'z2' },
    { id: 'i5', tokens: ['R=15, d=9'], zone: 'z1' },
    { id: 'i6', tokens: ['R=6, d=6'], zone: 'z2' },
    { id: 'i7', tokens: ['R=7, d=4'], zone: 'z1' },
    { id: 'i8', tokens: ['R=4, d=7'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz holat: har birida radius va markazdan to'g'ri chiziqqacha masofa berilgan. Kesuvchi — aylanani IKKI nuqtada kesib o'tuvchi chiziq.",
    'Восемь случаев: в каждом даны радиус и расстояние от центра до прямой. Секущая — прямая, пересекающая окружность в ДВУХ точках.',
    'Eight cases: each gives a radius and the distance from the centre to a line. A secant is a line crossing the circle at TWO points.'),
  ask: L('Kartani bosing, keyin uning guruhini bosing.', 'Нажми карточку, потом её группу.', 'Tap a card, then tap its group.'),
  bank: L('Holatlar', 'Случаи', 'Cases'),
  correctText: L(
    "To'g'ri. Kesuvchi bo'lish uchun bitta shart: masofa radiusdan KICHIK bo'lishi. To'rtta shunday: uch to'qqizdan kichik, yetti o'n ikkidan, to'qqiz o'n beshdan, to'rt yettidan. Ikkinchi guruh esa ikki xil holatni birga oladi, va razbor ularni ajratadi: ikki kartada masofa radiusga TENG (besh va besh, olti va olti) — bu urinma, umumiy nuqta bitta; ikki kartada esa masofa KATTA (sakkiz va to'qqiz, to'rt va yetti) — umumiy nuqta yo'q. Ikkalasi ham kesuvchi emas, lekin sabab boshqa. Savol faqat «kesuvchimi» degan savol bo'lgani uchun ular bitta guruhda.",
    'Верно. Чтобы быть секущей, нужно одно: расстояние МЕНЬШЕ радиуса. Таких четыре: три меньше девяти, семь меньше двенадцати, девять меньше пятнадцати, четыре меньше семи. А вторая группа объединяет два разных случая, и разбор их различает: в двух карточках расстояние РАВНО радиусу (пять и пять, шесть и шесть) — это касательная, общая точка одна; в двух других расстояние БОЛЬШЕ (восемь и девять, четыре и семь) — общих точек нет. И то и другое не секущая, но причина разная. Поскольку вопрос был только «секущая ли», они в одной группе.',
    'Correct. To be a secant one thing is needed: the distance must be LESS than the radius. There are four such: three under nine, seven under twelve, nine under fifteen, four under seven. The second group gathers two different cases, and the explanation separates them: in two cards the distance EQUALS the radius (five and five, six and six) — a tangent, one common point; in two others the distance is GREATER (eight and nine, four and seven) — no common point. Neither is a secant, but for different reasons. Since the question was only whether it is a secant, they share a group.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i6 === 'z1', text: L(
      "Bu ikki kartada masofa radiusga TENG, ya'ni chiziq aylanaga tegadi va umumiy nuqta bitta bo'ladi. Kesuvchi esa ikki nuqtani talab qiladi. Chegara holati kesuvchi tomonga ham, umumiy nuqtasiz tomonga ham kirmaydi — u alohida uchinchi holat.",
      'В этих двух карточках расстояние РАВНО радиусу, значит прямая касается окружности и общая точка одна. А секущая требует двух точек. Граничный случай не относится ни к секущим, ни к прямым без общих точек — это отдельный третий случай.',
      'In these two cards the distance EQUALS the radius, so the line touches the circle and there is one common point. A secant needs two. The boundary case belongs neither with secants nor with lines that miss the circle — it is a third case of its own.') },
    { when: (s) => s.place.i4 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu kartalarda masofa radiusdan KATTA: sakkiz radius va to'qqiz masofa, to'rt radius va yetti masofa. Chiziq aylanaga yetib bormaydi, ya'ni umumiy nuqta umuman yo'q. Kesuvchi bo'lish uchun masofa kichik bo'lishi kerak.",
      'В этих карточках расстояние БОЛЬШЕ радиуса: радиус восемь и расстояние девять, радиус четыре и расстояние семь. Прямая до окружности не доходит, общих точек нет вовсе. Чтобы быть секущей, расстояние должно быть меньше.',
      'In these cards the distance is GREATER than the radius: radius eight with distance nine, radius four with distance seven. The line never reaches the circle, so there is no common point at all. To be a secant the distance must be smaller.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu kartalarda masofa radiusdan kichik, ya'ni chiziq aylananing ichiga kiradi va uni ikki nuqtada kesadi — bu kesuvchi. Vatarning uzunligini ham hisoblash mumkin: masalan o'n ikki radius va yetti masofada ikki karra ildiz ostida bir yuz qirq to'rt minus qirq to'qqiz.",
      'В этих карточках расстояние меньше радиуса, значит прямая заходит внутрь окружности и пересекает её в двух точках — это секущая. Можно посчитать и длину хорды: например, при радиусе двенадцать и расстоянии семь это дважды корень из ста сорока четырёх минус сорока девяти.',
      'In these cards the distance is less than the radius, so the line enters the circle and crosses it at two points — a secant. The chord can be computed too: with radius twelve and distance seven it is twice the root of one hundred forty four minus forty nine.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada ikki sonni solishtiring. Masofa radiusdan kichik bo'lsa — kesuvchi. Teng yoki katta bo'lsa — kesuvchi emas, lekin sabab boshqa: teng bo'lganda urinma, katta bo'lganda umuman tegmaydi.",
      'В каждой карточке сравни два числа. Расстояние меньше радиуса — секущая. Равно или больше — не секущая, но по разным причинам: при равенстве касательная, при большем не касается вовсе.',
      'Compare the two numbers in every card. A distance less than the radius means a secant. Equal or greater means not a secant, but for different reasons: equal gives a tangent, greater gives no contact at all.') },
  ],
  wrongText: L(
    "Kesuvchi uchun masofa radiusdan KICHIK bo'lishi kerak. Tenglik urinmani beradi, u esa kesuvchi emas.",
    'Для секущей расстояние должно быть МЕНЬШЕ радиуса. Равенство даёт касательную, а она не секущая.',
    'A secant needs the distance LESS than the radius. Equality gives a tangent, and that is not a secant.'),
};

export default function D50_05(props) { return <Zones data={DATA} {...props} />; }
