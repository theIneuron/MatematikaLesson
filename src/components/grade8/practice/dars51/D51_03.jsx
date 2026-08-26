// Dars51 · Amaliyot 03 — Chizmalar · 🟢 🖼 · tag: inscribed_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §3 (51-dars, 3-pozitsiya)
//
// T1 NING TA'RIFI KO'Z BILAN TEKSHIRILADI: uchtasida burchakning uchi
// AYLANADA (tomonlari vatar), uchtasida esa MARKAZDA (tomonlari radius).
// Ta'rifni so'z bilan tekshirish uni yodlatardi. Bu topshiriq 01 dagi
// chizmani ham o'qiydigan qiladi: o'quvchi ikki burchakni ajratishni shu
// yerda o'rganadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

// `plain`: hamma chiziq siyoh rangida — rang javobni ochib qo'ymasin,
// ichki va markaziy burchakni faqat UCHNING joyi ajratsin.
const F = { fig: 'circ', plain: true, w: 66, h: 66, r: 24, cx: 33, cy: 33 };

const DATA = {
  tag: 'inscribed_marked', level: '🟢',
  col: 78, itemSize: 12,
  items: [
    // ICHKI CHIZILGAN: uch aylanada, tomonlari vatar. NOM QO'YILMAYDI —
    // faqat ichki chizilganlarida harf tursa, u ham ishorat berib qo'yardi:
    // o'quvchi geometriyaga emas, harfga qarab tanlardi.
    { id: 'i1', hit: true, tokens: [{ ...F, chords: [{ a: 270, b: 30 }, { a: 270, b: 150 }] }] },
    // MARKAZIY: uch markazda, tomonlari radius
    { id: 'i2', tokens: [{ ...F, radii: [45, 155] }] },
    { id: 'i3', hit: true, tokens: [{ ...F, chords: [{ a: 90, b: 210 }, { a: 90, b: 330 }] }] },
    { id: 'i4', tokens: [{ ...F, radii: [195, 300] }] },
    { id: 'i5', hit: true, tokens: [{ ...F, chords: [{ a: 20, b: 140 }, { a: 20, b: 250 }] }] },
    { id: 'i6', tokens: [{ ...F, radii: [100, 235] }] },
  ],
  eyebrow: L('Chizmalar', 'Рисунки', 'Drawings'),
  setup: L(
    "Olti aylanada burchak chizilgan. Uchtasida burchakning uchi aylananing O'ZIDA yotadi va tomonlari vatarlar; uchtasida esa uch MARKAZDA va tomonlari radiuslar. Birinchisi ichki chizilgan burchak, ikkinchisi markaziy.",
    'На шести окружностях начерчен угол. У трёх вершина лежит на САМОЙ окружности, а стороны это хорды; у трёх других вершина в ЦЕНТРЕ, а стороны это радиусы. Первый угол вписанный, второй центральный.',
    'An angle is drawn on six circles. In three of them the vertex lies ON the circle and the sides are chords; in the other three the vertex is at the CENTRE and the sides are radii. The first kind is an inscribed angle, the second a central one.'),
  ask: L(
    'Ichki chizilgan burchak turgan 3 ta chizmani belgilang.',
    'Отметь 3 рисунка, где угол вписанный.',
    'Mark the 3 drawings with an inscribed angle.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Ichki chizilgan burchakning belgisi bitta: uchi aylananing chizig'ida turadi. Rad etilgan uchtasida uch markazda, ya'ni ular markaziy burchak. Farq muhim: bir xil yoyga tiralganda markaziy burchak ichki chizilganidan ikki barobar keng bo'ladi.",
    'Верно. У вписанного угла один признак: вершина стоит на линии окружности. У трёх отклонённых вершина в центре, то есть это центральные углы. Различие важно: опираясь на одну и ту же дугу, центральный угол вдвое шире вписанного.',
    'Correct. An inscribed angle has one mark: the vertex stands on the line of the circle. In the three rejected ones the vertex is at the centre, so they are central angles. The difference matters: subtending the same arc, a central angle is twice as wide as an inscribed one.'),
  wrongs: [
    { when: (s) => s.miss.length > 0 && s.extra.length > 0, text: L(
      "Ikki tur aralashib ketdi. Chizmaga qaraganda BITTA narsani qidiring: burchakning uchi qayerda turibdi. Aylananing chizig'ida bo'lsa ichki chizilgan, markazda bo'lsa markaziy. Tomonlari ham buni takrorlaydi: vatar aylanani ikki nuqtada kesadi, radius esa markazdan chiqadi.",
      'Два вида смешались. Глядя на рисунок, ищи ОДНО: где стоит вершина угла. На линии окружности — вписанный, в центре — центральный. Стороны повторяют то же: хорда пересекает окружность в двух точках, а радиус выходит из центра.',
      'The two kinds got mixed. When looking at a drawing, look for ONE thing: where the vertex of the angle stands. On the line of the circle — inscribed; at the centre — central. The sides repeat the same: a chord meets the circle at two points while a radius leaves the centre.') },
    { when: (s) => s.extra.length > 0, text: L(
      "Ortiqcha belgilangan chizmada burchakning uchi MARKAZDA turibdi, bu markaziy burchak. Uning tomonlari markazdan chiqqan radiuslar, ular aylananing chizig'ida boshlanmaydi. Ichki chizilgan burchakning uchi esa aylananing o'zida yotishi kerak.",
      'На лишнем отмеченном рисунке вершина угла стоит в ЦЕНТРЕ, это центральный угол. Его стороны это радиусы из центра, они не начинаются на линии окружности. А у вписанного угла вершина должна лежать на самой окружности.',
      'In the extra marked drawing the vertex of the angle stands at the CENTRE, so it is a central angle. Its sides are radii from the centre, they do not begin on the line of the circle. An inscribed angle must have its vertex on the circle itself.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bitta ichki chizilgan burchak belgilanmay qoldi. Uni tanish uchun uchni toping: agar u aylananing chizig'ida yotsa va ikki tomoni ham aylanani kesib o'tsa, bu ichki chizilgan burchak. Burchakning ochilishi keng yoki tor bo'lishi ahamiyatsiz.",
      'Один вписанный угол остался неотмеченным. Чтобы его узнать, найди вершину: если она лежит на линии окружности и обе стороны пересекают окружность, это вписанный угол. Широко или узко раскрыт угол, не важно.',
      'One inscribed angle was left unmarked. To spot it, find the vertex: if it lies on the line of the circle and both sides cross the circle, the angle is inscribed. Whether the angle opens wide or narrow does not matter.') },
  ],
  wrongText: L(
    "Bitta narsaga qarang: burchakning uchi qayerda. Aylanada bo'lsa ichki chizilgan, markazda bo'lsa markaziy.",
    'Смотри на одно: где вершина угла. На окружности — вписанный, в центре — центральный.',
    'Look at one thing: where the vertex of the angle is. On the circle — inscribed; at the centre — central.'),
};

export default function D51_03(props) { return <MarkAll data={DATA} {...props} />; }
