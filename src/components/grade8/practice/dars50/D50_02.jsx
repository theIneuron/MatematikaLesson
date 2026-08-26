// Dars50 · Amaliyot 02 — Belgilash · 🟢 · tag: tangent_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §12 (50-dars, 2-pozitsiya)
//
// URINMA FAQAT `d = R` BO'LGANDA (T1). Belgilanadigan uchtasida masofa
// radiusga teng, va bittasida ular o'nli kasr bilan berilgan — tenglikni
// butun sonlarda «ko'rish» odati shu yerda sinaladi.
//
// Rad etilganlar uch xil: `d > R` (umumiy nuqta yo'q), `d < R` (kesuvchi) va
// `d = 0` — chiziq markazdan o'tadi, ya'ni eng uzun vatarni beradi. Oxirgisi
// tuzoq: nol «masofa yo'q» degani emas, «masofa nolga teng» degani.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'tangent_marked', level: '🟢',
  col: 128, itemSize: 16,
  items: [
    { id: 'i1', hit: true, tokens: ['R=6, d=6'] },
    { id: 'i2', tokens: ['R=8, d=10'] },
    { id: 'i3', hit: true, tokens: ['R=4,5, d=4,5'] },
    { id: 'i4', tokens: ['R=5, d=4'] },
    { id: 'i5', hit: true, tokens: ['R=12, d=12'] },
    { id: 'i6', tokens: ['R=10, d=0'] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Olti holat: har birida aylananing radiusi va markazdan to'g'ri chiziqqacha masofa berilgan. To'g'ri chiziq aylanaga urinishi uchun bitta shart bajarilishi kerak.",
    'Шесть случаев: в каждом даны радиус окружности и расстояние от центра до прямой. Чтобы прямая касалась окружности, должно выполняться одно условие.',
    'Six cases: each gives the radius of a circle and the distance from the centre to a line. For the line to be tangent to the circle, one condition must hold.'),
  ask: L(
    "To'g'ri chiziq aylanaga URINGAN 3 ta holatni belgilang.",
    'Отметь 3 случая, где прямая КАСАЕТСЯ окружности.',
    'Mark the 3 cases where the line is TANGENT to the circle.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Urinma faqat bitta holatda bo'ladi: masofa radiusga TENG. Belgilangan uchtasida aynan shunday, va uchinchisida sonlar o'nli kasr bilan yozilgan — tenglik esa o'nli kasrda ham tenglik bo'lib qoladi. Rad etilganlar uch xil: birinchisida masofa radiusdan katta, ya'ni chiziq aylanaga yetib bormaydi va umumiy nuqta yo'q; ikkinchisida masofa kichik, ya'ni chiziq aylanani kesib o'tadi va ikki nuqta paydo bo'ladi; uchinchisida masofa nolga teng — chiziq markazdan o'tadi va aylanani ikki nuqtada, eng uzun vatar bo'ylab kesadi. Nol «masofa yo'q» degani emas.",
    'Верно. Касательная бывает только в одном случае: расстояние РАВНО радиусу. У трёх отмеченных именно так, и в третьем числа записаны десятичной дробью — но равенство остаётся равенством и в десятичной записи. Отвергнутые разные: в первом расстояние больше радиуса, прямая до окружности не доходит и общих точек нет; во втором расстояние меньше, прямая пересекает окружность и появляются две точки; в третьем расстояние равно нулю — прямая проходит через центр и пересекает окружность в двух точках, по самой длинной хорде. Нуль не значит «расстояния нет».',
    'Correct. A tangent occurs in one case only: the distance EQUALS the radius. That is so for the three marked, and in the third the numbers are written as decimals — but an equality stays an equality in decimal form too. The rejected ones differ: in the first the distance exceeds the radius, the line never reaches the circle and there is no common point; in the second the distance is smaller, the line crosses the circle and two points appear; in the third the distance is zero — the line passes through the centre and crosses the circle at two points along its longest chord. Zero does not mean there is no distance.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Masofa nolga teng bo'lishi «masofa yo'q» degani emas: nol ham son, va u radiusdan KICHIK. Markazdan o'tuvchi chiziq aylanani ikki nuqtada kesadi — bu kesuvchi, hatto eng uzun vatarni beradigan kesuvchi. Urinma uchun esa masofa aynan radiusga teng bo'lishi kerak.",
      'Расстояние, равное нулю, не значит «расстояния нет»: нуль тоже число, и он МЕНЬШЕ радиуса. Прямая через центр пересекает окружность в двух точках — это секущая, причём дающая самую длинную хорду. А для касательной расстояние должно быть в точности равно радиусу.',
      'A distance of zero does not mean there is no distance: zero is a number too, and it is LESS than the radius. A line through the centre crosses the circle at two points — a secant, and the one giving the longest chord. For a tangent the distance must equal the radius exactly.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu yerda masofa radiusdan KATTA: sakkiz radius, o'n esa masofa. Chiziq aylanaga yetib bormaydi, ya'ni umumiy nuqta umuman yo'q. Urinma uchun masofa radiusga teng bo'lishi kerak — kattaligi ham, kichikligi ham urinmani buzadi.",
      'Здесь расстояние БОЛЬШЕ радиуса: радиус восемь, расстояние десять. Прямая до окружности не доходит, значит общих точек нет вовсе. Для касательной расстояние должно быть равно радиусу — и больше, и меньше одинаково ломают касание.',
      'Here the distance is GREATER than the radius: radius eight, distance ten. The line never reaches the circle, so there is no common point at all. A tangent needs the distance to equal the radius — both greater and smaller break the tangency.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu yerda masofa radiusdan KICHIK: to'rt va besh. Chiziq aylananing ichiga kiradi va uni ikki nuqtada kesadi — bu kesuvchi. Vatarning uzunligini ham hisoblash mumkin: ikki karra ildiz ostida yigirma besh minus o'n olti, ya'ni olti.",
      'Здесь расстояние МЕНЬШЕ радиуса: четыре и пять. Прямая заходит внутрь окружности и пересекает её в двух точках — это секущая. Можно посчитать и длину хорды: дважды корень из двадцати пяти минус шестнадцати, то есть шесть.',
      'Here the distance is LESS than the radius: four and five. The line enters the circle and crosses it at two points — a secant. The chord can even be computed: twice the root of twenty five minus sixteen, that is six.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "O'nli kasrli holat chetlab o'tildi, lekin u ham urinma: to'rt butun besh o'ndan to'rt butun besh o'ndanga teng. Tenglik sonning YOZUVIGA bog'liq emas — butun son ham, kasr ham bir xil qoidaga bo'ysunadi.",
      'Случай с десятичной дробью пропущен, а это тоже касательная: четыре с половиной равно четырём с половиной. Равенство не зависит от ЗАПИСИ числа — и целое, и дробь подчиняются одному правилу.',
      'The decimal case was skipped, yet it is a tangent too: four and a half equals four and a half. Equality does not depend on how a number is WRITTEN — whole numbers and decimals obey the same rule.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta holat kerak. Har birida ikki sonni solishtiring: teng bo'lsa urinma, katta bo'lsa umumiy nuqta yo'q, kichik bo'lsa kesuvchi.",
      'Нужно ровно три случая. В каждом сравни два числа: равны — касательная, больше — общих точек нет, меньше — секущая.',
      'Exactly three cases are needed. Compare the two numbers in each: equal means a tangent, greater means no common point, smaller means a secant.') },
  ],
  wrongText: L(
    "Masofani radius bilan solishtiring. Urinma faqat TENGLIKDA bo'ladi, nol esa radiusdan kichik.",
    'Сравни расстояние с радиусом. Касательная бывает только при РАВЕНСТВЕ, а нуль меньше радиуса.',
    'Compare the distance with the radius. A tangent needs EQUALITY, and zero is less than the radius.'),
};

export default function D50_02(props) { return <MarkAll data={DATA} {...props} />; }
