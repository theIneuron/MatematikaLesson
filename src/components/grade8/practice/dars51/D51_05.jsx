// Dars51 · Amaliyot 05 — Guruhlar · 🟡 · tag: pair_right_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §3 (51-dars, 5-pozitsiya)
//
// SAKKIZ KARTA TO'RT JUFTLIK: har juftlikda YOY BIR XIL, javob esa
// boshqa. Shu sababli guruhni yoyning kattaligiga qarab ajratib bo'lmaydi,
// faqat hisob ajratadi.
//   60 -> 30 rost,  60 -> 60 yolg'on (З109)
//   180 -> 90 rost, 180 -> 180 yolg'on (З109)
//   100 -> 50 rost, 100 -> 130 yolg'on (З108: 260 ning yarmi)
//   140 -> 70 rost, 140 -> 110 yolg'on (З108: 220 ning yarmi)
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'pair_right_or_not', level: '🟡',
  zoneSize: 12, itemSize: 14, zoneLbl: 108,
  zones: [
    { id: 'z1', label: L("TO'G'RI", 'ВЕРНО', 'CORRECT') },
    { id: 'z2', label: L("NOTO'G'RI", 'НЕВЕРНО', 'WRONG') },
  ],
  items: [
    { id: 'i1', tokens: ['60° → 30°'], zone: 'z1' },
    { id: 'i2', tokens: ['60° → 60°'], zone: 'z2' },
    { id: 'i3', tokens: ['100° → 50°'], zone: 'z1' },
    { id: 'i4', tokens: ['100° → 130°'], zone: 'z2' },
    { id: 'i5', tokens: ['180° → 90°'], zone: 'z1' },
    { id: 'i6', tokens: ['180° → 180°'], zone: 'z2' },
    { id: 'i7', tokens: ['140° → 70°'], zone: 'z1' },
    { id: 'i8', tokens: ['140° → 110°'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuv. Har birida chapda YOY, o'ngda esa shu yoyga tiralgan ichki chizilgan burchak uchun aytilgan javob turibdi. Diqqat: yoylar juft-juft takrorlanadi, javoblari esa boshqa.",
    'Восемь записей. В каждой слева ДУГА, а справа ответ, названный для вписанного угла, который на неё опирается. Внимание: дуги повторяются парами, а ответы разные.',
    'Eight records. In each, the ARC is on the left and on the right is the answer named for the inscribed angle subtending it. Note: the arcs repeat in pairs while the answers differ.'),
  ask: L("Yozuvni bosing, keyin guruhini bosing.", 'Нажми запись, потом её группу.', 'Tap a record, then its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Qoida bitta: burchak yoyning yarmi. Oltmishning yarmi o'ttiz, bir yuzning yarmi ellik, bir yuz saksonning yarmi to'qson, bir yuz qirqning yarmi yetmish. Rad etilgan to'rtta ikki xil yo'ldan xato bo'ldi: ikkitasida javob yoyga TENG olingan, ikkitasida esa qarama-qarshi yoyning yarmi hisoblangan.",
    'Верно. Правило одно: угол — половина дуги. Половина шестидесяти тридцать, половина ста пятьдесят, половина ста восьмидесяти девяносто, половина ста сорока семьдесят. Четыре отклонённых ошибочны двумя разными путями: в двух ответ взят РАВНЫМ дуге, а в двух посчитана половина противоположной дуги.',
    'Correct. There is one rule: the angle is half the arc. Half of sixty is thirty, half of a hundred is fifty, half of a hundred and eighty is ninety, half of a hundred and forty is seventy. The four rejected ones are wrong in two different ways: in two the answer was taken EQUAL to the arc, and in two the half of the opposite arc was computed.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i6 === 'z1', text: L(
      "Yoyga TENG javob to'g'ri guruhga tushib qoldi. Oltmish graduslik yoyga tiralgan burchak oltmish emas, o'ttiz gradus; bir yuz sakson graduslik yoyga tiralgani esa bir yuz sakson emas, to'qson. Ichki chizilgan burchak yoydan har doim ikki barobar KICHIK. Bu darsning eng qimmat xatosi.",
      'Ответ, РАВНЫЙ дуге, попал в верную группу. Угол, опирающийся на дугу в шестьдесят градусов, равен не шестидесяти, а тридцати; а опирающийся на сто восемьдесят — не ста восьмидесяти, а девяноста. Вписанный угол всегда вдвое МЕНЬШЕ дуги. Это самая дорогая ошибка урока.',
      'An answer EQUAL to the arc landed in the correct group. An angle subtending an arc of sixty degrees is not sixty but thirty; one subtending a hundred and eighty is not a hundred and eighty but ninety. An inscribed angle is always twice SMALLER than the arc. This is the costliest error of the lesson.') },
    { when: (s) => s.place.i4 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu yerda boshqa yo'ldan xato bo'ldi: qarama-qarshi yoy hisoblangan. Bir yuz graduslik yoyning qarshisida ikki yuz oltmish gradus turadi, uning yarmi bir yuz o'ttiz. Lekin burchak berilgan yoyga tiraladi, qarshisidagiga emas: javob ellik. Tekshirish belgisi: ichki chizilgan burchak o'z yoyining yarmi, ya'ni yoydan katta bo'lolmaydi.",
      'Здесь ошибка другого рода: посчитана противоположная дуга. Напротив дуги в сто градусов лежит двести шестьдесят, её половина сто тридцать. Но угол опирается на данную дугу, а не на противоположную: ответ пятьдесят. Признак для проверки: вписанный угол — половина своей дуги, значит больше дуги он быть не может.',
      'Here the error is of a different kind: the opposite arc was computed. Opposite an arc of a hundred degrees lies two hundred and sixty, whose half is a hundred and thirty. But the angle subtends the given arc, not the opposite one: the answer is fifty. A check: an inscribed angle is half of its own arc, so it can never exceed the arc.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Uchtadan ko'p yozuv boshqa guruhda. Har juftlikda yoy bir xil, ya'ni yoyning kattaligiga qarab hal qilib bo'lmaydi. Bitta amalni bajaring: yoyni ikkiga bo'ling va natijani o'ngdagi son bilan solishtiring.",
      'Больше трёх записей стоят не в своей группе. В каждой паре дуга одна и та же, значит по величине дуги решить нельзя. Сделай одно действие: раздели дугу на два и сравни с числом справа.',
      'More than three records are in the wrong group. Within each pair the arc is the same, so the size of the arc decides nothing. Do one operation: divide the arc by two and compare with the number on the right.') },
    { when: () => true, text: L(
      "Bitta yozuv boshqa guruhda qoldi. Har birini alohida tekshiring: yoyni ikkiga bo'ling va chiqqan sonni o'ngdagi bilan solishtiring. Ular teng bo'lsa yozuv to'g'ri.",
      'Одна запись осталась не в своей группе. Проверь каждую отдельно: раздели дугу на два и сравни полученное число с тем, что справа. Совпали — запись верна.',
      'One record stayed in the wrong group. Check each one on its own: divide the arc by two and compare the result with the number on the right. If they agree, the record is correct.') },
  ],
  wrongText: L(
    "Har juftlikda yoy bir xil. Bitta amal hal qiladi: yoyni ikkiga bo'ling.",
    'В каждой паре дуга одна и та же. Решает одно действие: раздели дугу на два.',
    'The arc is the same within each pair. One operation decides: divide the arc by two.'),
};

export default function D51_05(props) { return <Zones data={DATA} {...props} />; }
