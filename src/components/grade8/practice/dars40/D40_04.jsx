// Dars40 · Amaliyot 04 — Guruhlar · 🟡 · tag: enough_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §12 (40-dars, 4-pozitsiya)
//
// З83 SOF SHAKLDA, VA KARTALAR JUFT-JUFT:
//   a=8, h=3   / a=8, b=3      — bitta HARF farq qiladi
//   a=10, h=4,5 / a=10, d=6    — balandlik va diagonal
//   a=6, h=6   / h=4, b=5      — asos umuman yo'q
//   a=2,5, h=4 / ∠A=60°, a=8   — burchak balandlikni almashtirmaydi
// Yuzani topish uchun ASOS va unga MOS BALANDLIK kerak; boshqa hech qanday
// juftlik yetarli emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'enough_or_not', level: '🟡',
  zoneSize: 12, itemSize: 14, zoneLbl: 124,
  zones: [
    { id: 'z1', label: L('YUZA TOPILADI', 'ПЛОЩАДЬ НАЙДЁТСЯ', 'THE AREA CAN BE FOUND') },
    { id: 'z2', label: L('TOPILMAYDI', 'НЕ НАЙДЁТСЯ', 'CANNOT BE FOUND') },
  ],
  items: [
    { id: 'i1', tokens: ['a = 8,  h = 3'], zone: 'z1' },
    { id: 'i2', tokens: ['a = 8,  b = 3'], zone: 'z2' },
    { id: 'i3', tokens: ['a = 10,  h = 4,5'], zone: 'z1' },
    { id: 'i4', tokens: ['a = 10,  d = 6'], zone: 'z2' },
    { id: 'i5', tokens: ['a = 6,  h = 6'], zone: 'z1' },
    { id: 'i6', tokens: ['h = 4,  b = 5'], zone: 'z2' },
    { id: 'i7', tokens: ['a = 2,5,  h = 4'], zone: 'z1' },
    { id: 'i8', tokens: ['∠A = 60°,  a = 8'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz to'plam ma'lumot. Belgilar: a — asos, h — unga mos balandlik, b — qo'shni tomon, d — diagonal. Qaysi to'plamda yuzani topish mumkinligini aniqlash kerak.",
    'Восемь наборов данных. Обозначения: a — основание, h — соответствующая высота, b — соседняя сторона, d — диагональ. Надо определить, в каком наборе площадь найти можно.',
    'Eight sets of data. The notation: a is the base, h the matching height, b the adjacent side, d a diagonal. Decide in which sets the area can be found.'),
  ask: L("To'plamni bosing, keyin guruhini bosing.", 'Нажми набор, потом его группу.', 'Tap a set, then its group.'),
  bank: L("Ma'lumotlar", 'Наборы', 'Data sets'),
  correctText: L(
    "To'g'ri. Yuza uchun ANIQ ikki narsa kerak: asos va unga MOS balandlik; qiymat butun yoki kasr bo'lishi ahamiyatsiz. Rad etilganlar to'rt xil yetishmovchilik: asos va qo'shni TOMON (qiyalik noma'lum); diagonal; balandlik bor, ASOS yo'q; burchak — undan balandlikni topish 9-sinfning ishi.",
    'Верно. Для площади нужны ровно две вещи: основание и СООТВЕТСТВУЮЩАЯ ему высота; целые значения или дробные — не важно. Отвергнутые показывают четыре нехватки: основание и соседняя СТОРОНА (наклон неизвестен); диагональ; высота есть, а ОСНОВАНИЯ нет; угол — находить по нему высоту это работа девятого класса.',
    'Correct. The area needs exactly two things: the base and its MATCHING height; whole or fractional values make no difference. The rejected ones show four shortfalls: the base and the adjacent SIDE (the tilt is unknown); a diagonal; a height with no BASE; an angle — deriving a height from it is ninth-grade work.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1', text: L(
      "Bu yerda a va b — IKKI TOMON, balandlik emas. Ular yuzani bermaydi, chunki bir xil ikki tomondan cheksiz ko'p parallelogramm yasash mumkin: yotqizib borsangiz tomonlar o'zgarmaydi, yuza esa kamayaveradi. Qo'shni kartaga qarang — u yerda o'sha sakkiz va uch turibdi, lekin ikkinchi harf h, va o'shanda yuza topiladi.",
      'Здесь a и b — ДВЕ СТОРОНЫ, а не высота. Площади они не дают, ведь из двух одинаковых сторон можно построить бесконечно много параллелограммов: наклоняя фигуру, стороны не изменишь, а площадь будет убывать. Посмотри на соседнюю карточку — там те же восемь и три, но вторая буква h, и тогда площадь находится.',
      'Here a and b are TWO SIDES, not a height. They do not give the area, since infinitely many parallelograms can be built from the same two sides: tilt the figure and the sides stay while the area falls. Look at the neighbouring card — the same eight and three there, but the second letter is h, and then the area can be found.') },
    { when: (s) => s.place.i4 === 'z1', text: L(
      "Diagonal — figuraning ichidagi kesma, lekin u balandlik emas: u asosga perpendikulyar emas va uni ikki uchni tutashtirish uchun chizadilar. Yuzaning formulasida diagonal umuman qatnashmaydi. Bir xil asos va bir xil diagonal bilan turli yuzali parallelogrammlar yasash mumkin.",
      'Диагональ — отрезок внутри фигуры, но не высота: она не перпендикулярна основанию и проводится, чтобы соединить две вершины. В формуле площади диагональ не участвует вовсе. С одним и тем же основанием и одной и той же диагональю можно построить параллелограммы разной площади.',
      'A diagonal is a segment inside the figure, but not a height: it is not perpendicular to the base and is drawn to join two vertices. The area formula does not involve a diagonal at all. With the same base and the same diagonal, parallelograms of different areas can be built.') },
    { when: (s) => s.place.i6 === 'z1', text: L(
      "Bu to'plamda balandlik bor, lekin ASOS yo'q: b — qo'shni tomon, va balandlik unga mos emas. Yuza IKKI o'lchamdan yig'iladi, va ular bir-biriga MOS bo'lishi kerak: asos va aynan o'sha asosga tushirilgan balandlik. Bitta balandlik o'z-o'zidan hech narsa bermaydi.",
      'В этом наборе высота есть, а ОСНОВАНИЯ нет: b — соседняя сторона, и высота ей не соответствует. Площадь складывается из ДВУХ размеров, и они должны СООТВЕТСТВОВАТЬ друг другу: основание и высота, опущенная именно на это основание. Одна высота сама по себе не даёт ничего.',
      'This set has a height but no BASE: b is the adjacent side, and the height does not match it. An area is built from TWO measurements and they must MATCH each other: a base and the height dropped onto that very base. A height by itself gives nothing.') },
    { when: (s) => s.place.i8 === 'z1', text: L(
      "Burchak balandlikni ALMASHTIRMAYDI. Burchakdan balandlikni hisoblash mumkin, lekin buning uchun trigonometriya kerak, va u 9-sinfda o'rganiladi. Bu darsda balandlik BERILGAN bo'lishi kerak. Diqqat qiling: to'plamda hatto ikkinchi tomon ham yo'q — faqat asos va burchak.",
      'Угол высоту НЕ ЗАМЕНЯЕТ. Вычислить высоту по углу можно, но для этого нужна тригонометрия, а её изучают в девятом классе. В этом уроке высота должна быть ДАНА. И заметь: в наборе нет даже второй стороны — только основание и угол.',
      'An angle does not REPLACE a height. A height can be computed from an angle, but that needs trigonometry, taught in the ninth grade. In this lesson the height must be GIVEN. Note too: the set does not even have a second side — only the base and an angle.') },
    { when: (s) => s.place.i7 === 'z2' || s.place.i5 === 'z2' || s.place.i3 === 'z2', text: L(
      "Bu to'plamda kerakli ikkovi ham bor: asos va unga mos balandlik. Qiymatning kasr bo'lgani yoki asos bilan balandlikning teng bo'lgani hech narsani buzmaydi — formula har qanday sonlar bilan ishlaydi. Ko'paytiring va javobni yozing.",
      'В этом наборе есть оба нужных: основание и соответствующая высота. Дробное значение или равенство основания и высоты ничего не портят — формула работает с любыми числами. Перемножь и запиши ответ.',
      'This set has both of the needed items: the base and its matching height. A fractional value, or the base equalling the height, spoils nothing — the formula works with any numbers. Multiply and write the answer.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har to'plamda ikki savol bering: asos bormi, va unga MOS balandlik bormi. Faqat ikkala javob ham «ha» bo'lganda yuza topiladi. Tomon, diagonal va burchak balandlikning o'rnini bosolmaydi.",
      'В каждом наборе задай два вопроса: есть ли основание и есть ли СООТВЕТСТВУЮЩАЯ ему высота. Площадь находится, только когда оба ответа «да». Сторона, диагональ и угол высоту не заменяют.',
      'Ask two questions of every set: is there a base, and is there a height MATCHING it. The area can be found only when both answers are yes. A side, a diagonal and an angle cannot stand in for a height.') },
  ],
  wrongText: L(
    "Yuza uchun asos va unga MOS balandlik kerak. Tomon, diagonal va burchak balandlikning o'rnini bosmaydi.",
    'Для площади нужны основание и СООТВЕТСТВУЮЩАЯ ему высота. Сторона, диагональ и угол высоту не заменяют.',
    'The area needs a base and its MATCHING height. A side, a diagonal and an angle do not stand in for a height.'),
};

export default function D40_04(props) { return <Zones data={DATA} {...props} />; }
