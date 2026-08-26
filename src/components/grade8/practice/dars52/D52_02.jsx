// Dars52 · Amaliyot 02 — Guruhlar · 🟢 🖼 · tag: circumscribed_sides
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §4 (52-dars, 2-pozitsiya)
//
// З111 SOF SHAKLDA: tashqi chizilgan to'rtburchakda qarama-qarshi
// tomonlarning YIG'INDILARI teng, tomonlarning o'zi emas. Sakkiz karta
// to'rt juftlik bo'lib turadi va har juftlik BITTA sonda farq qiladi.
//   5,6,9,8 -> 14=14 ha    5,6,9,7 -> 14≠13 yo'q
//   7,4,5,8 -> 12=12 ha    7,4,5,9 -> 12≠13 yo'q
//   10,3,2,9 -> 12=12 ha   10,3,2,8 -> 12≠11 yo'q
//   6,6,6,6 -> 12=12 ha    6,6,7,6 -> 13≠12 yo'q
// CHIZMASIZ, va bu o'lchovning natijasi (2026-08-25). Bu topshiriqda
// sakkiz karta ikki qatorda, ikki zona va razbor bor — telefonda chizmaga
// joy qolmaydi. Uni sig'diradigan o'lcham (42px) da esa aylananing
// tomonlarga urinishi ko'rinmay qoladi, ya'ni chizma o'z ishini bajarmaydi.
// Razborni qisqartirish yo'li yopiq (metodist qarori). O'sha figura 52/09
// da to'liq o'lchamda turadi, ya'ni dars uni baribir ko'rsatadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'circumscribed_sides', level: '🟢',
  zoneSize: 12, itemSize: 14, zoneLbl: 116,
  zones: [
    { id: 'z1', label: L('MUMKIN', 'ВОЗМОЖНО', 'POSSIBLE') },
    { id: 'z2', label: L('MUMKIN EMAS', 'НЕВОЗМОЖНО', 'IMPOSSIBLE') },
  ],
  items: [
    { id: 'i1', tokens: ['5, 6, 9, 8'], zone: 'z1' },
    { id: 'i2', tokens: ['5, 6, 9, 7'], zone: 'z2' },
    { id: 'i3', tokens: ['7, 4, 5, 8'], zone: 'z1' },
    { id: 'i4', tokens: ['7, 4, 5, 9'], zone: 'z2' },
    { id: 'i5', tokens: ['10, 3, 2, 9'], zone: 'z1' },
    { id: 'i6', tokens: ['10, 3, 2, 8'], zone: 'z2' },
    { id: 'i7', tokens: ['6, 6, 6, 6'], zone: 'z1' },
    { id: 'i8', tokens: ['6, 6, 7, 6'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Chizmadagidek to'rtburchakda aylana to'rt tomonga ham urinadi. Unda birinchi va uchinchi tomonning yig'indisi ikkinchi va to'rtinchisinikiga teng. Sakkiz to'plamda tomonlar tartib bilan yozilgan.",
    'В четырёхугольнике, как на рисунке, окружность касается всех четырёх сторон. У него сумма первой и третьей стороны равна сумме второй и четвёртой. В восьми наборах стороны записаны по порядку.',
    'In a quadrilateral like the one drawn, the circle touches all four sides. In it the sum of the first and third sides equals the sum of the second and fourth. In the eight sets the sides are written in order.'),
  ask: L("To'plamni bosing, keyin guruhini bosing.", 'Нажми набор, потом его группу.', 'Tap a set, then its group.'),
  bank: L("To'plamlar", 'Наборы', 'Sets'),
  correctText: L(
    "To'g'ri. To'rt to'plamda yig'indilar teng chiqdi: besh qo'shuv to'qqiz o'n to'rt va olti qo'shuv sakkiz ham o'n to'rt; yetti qo'shuv besh o'n ikki va to'rt qo'shuv sakkiz ham o'n ikki; o'n qo'shuv ikki o'n ikki va uch qo'shuv to'qqiz ham o'n ikki; oltilar esa har tomondan o'n ikki. Rad etilganlarda bitta son o'zgargan, va shu bilan tenglik buzilgan. Diqqat qiling: tomonlarning O'ZI teng bo'lishi shart emas — o'n va ikki bir-biridan besh barobar farq qiladi, lekin to'plam baribir mumkin.",
    'Верно. В четырёх наборах суммы совпали: пять плюс девять четырнадцать и шесть плюс восемь тоже четырнадцать; семь плюс пять двенадцать и четыре плюс восемь тоже двенадцать; десять плюс два двенадцать и три плюс девять тоже двенадцать; а у шестёрок с каждой стороны двенадцать. В отклонённых изменено одно число, и равенство нарушилось. Заметь: САМИ стороны равными быть не обязаны — десять и два различаются в пять раз, а набор всё равно возможен.',
    'Correct. In four sets the sums matched: five plus nine is fourteen and six plus eight is also fourteen; seven plus five is twelve and four plus eight is also twelve; ten plus two is twelve and three plus nine is also twelve; and for the sixes each side gives twelve. In the rejected ones a single number was changed, and the equality broke. Note: the sides THEMSELVES need not be equal — ten and two differ fivefold, yet the set is still possible.'),
  wrongs: [
    { when: (s) => s.place.i5 === 'z2' || s.place.i6 === 'z1', text: L(
      "O'n, uch, ikki, to'qqiz to'plami MUMKIN. Uning tomonlari bir-biridan juda farq qiladi, va shuning uchun u imkonsizdek ko'rinadi. Lekin shart tomonlarning tengligini talab qilmaydi, u YIG'INDILARNING tengligini talab qiladi: o'n qo'shuv ikki o'n ikki, uch qo'shuv to'qqiz ham o'n ikki. Bu darsning eng qimmat chalkashligi.",
      'Набор десять, три, два, девять ВОЗМОЖЕН. Его стороны сильно различаются, и поэтому он кажется невозможным. Но условие не требует равенства сторон, оно требует равенства СУММ: десять плюс два двенадцать, три плюс девять тоже двенадцать. Это самая дорогая путаница урока.',
      'The set ten, three, two, nine IS possible. Its sides differ a great deal, so it looks impossible. But the condition does not demand equal sides, it demands equal SUMS: ten plus two is twelve, three plus nine is also twelve. This is the costliest confusion of the lesson.') },
    { when: (s) => s.place.i8 === 'z1', text: L(
      "Olti, olti, yetti, olti to'plami MUMKIN EMAS. Uchta son bir xil bo'lgani uni to'g'ri qilib ko'rsatadi, lekin hisob boshqa narsani aytadi: olti qo'shuv yetti o'n uch, olti qo'shuv olti esa o'n ikki. Yig'indilar teng emas. Uch tomonning tengligi hech narsani hal qilmaydi.",
      'Набор шесть, шесть, семь, шесть НЕВОЗМОЖЕН. Три одинаковых числа делают его похожим на верный, но счёт говорит другое: шесть плюс семь тринадцать, а шесть плюс шесть двенадцать. Суммы не равны. Равенство трёх сторон ничего не решает.',
      'The set six, six, seven, six is IMPOSSIBLE. Three equal numbers make it look right, but the arithmetic says otherwise: six plus seven is thirteen while six plus six is twelve. The sums are not equal. Three equal sides settle nothing.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Uchtadan ko'p to'plam boshqa guruhda. Har to'plam uchun bitta ish qiling: birinchi va uchinchi sonni qo'shing, keyin ikkinchi va to'rtinchisini qo'shing, va ikki natijani solishtiring. Tomonlarning kattaligi yoki tengligi ahamiyatsiz.",
      'Больше трёх наборов стоят не в своей группе. Для каждого сделай одно: сложи первое и третье число, потом второе и четвёртое, и сравни два результата. Величина или равенство сторон не важны.',
      'More than three sets are in the wrong group. For each one do a single thing: add the first and third numbers, then the second and fourth, and compare the two results. The size or equality of the sides does not matter.') },
    { when: () => true, text: L(
      "Bitta to'plam boshqa guruhda qoldi. Tekshirish bir xil: birinchi qo'shuv uchinchi, ikkinchi qo'shuv to'rtinchi, va ular teng bo'lishi kerak.",
      'Один набор остался не в своей группе. Проверка одна и та же: первое плюс третье, второе плюс четвёртое, и они должны совпасть.',
      'One set stayed in the wrong group. The check is always the same: first plus third, second plus fourth, and the two must agree.') },
  ],
  wrongText: L(
    "Birinchi qo'shuv uchinchi, ikkinchi qo'shuv to'rtinchi. Yig'indilar teng bo'lsa mumkin.",
    'Первое плюс третье, второе плюс четвёртое. Если суммы равны — возможно.',
    'First plus third, second plus fourth. If the sums are equal it is possible.'),
};

export default function D52_02(props) { return <Zones data={DATA} {...props} />; }
