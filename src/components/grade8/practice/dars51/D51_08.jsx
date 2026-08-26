// Dars51 · Amaliyot 08 — Kod · 🔴 · tag: code_angles
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §3 (51-dars, 8-pozitsiya)
//
// Uch yoy, uch burchak: 80 -> 40, 140 -> 70, 180 -> 90. Uchinchisi
// DIAMETR, ya'ni T3 kodning ichida turadi. Bankda yoylarning O'ZI ham
// bor (80, 140, 180) — З109 to'g'ridan-to'g'ri tuzoq bo'lib yotadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_angles', level: '🔴',
  expr: ['yoy  80°,  140°,  180°'], exprSize: 17,
  cards: ['40', '70', '80', '90', '140', '180'],
  answer: ['40', '70', '90'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Bitta aylanada uch xil yoy belgilangan: sakson, bir yuz qirq va bir yuz sakson gradus. Har yoyga tiralgan ichki chizilgan burchakni topish kerak. Oxirgi yoy aylananing yarmi, ya'ni uning vatari diametr.",
    'В комнате сейф, код трёхзначный. На одной окружности отмечены три разные дуги: восемьдесят, сто сорок и сто восемьдесят градусов. Надо найти вписанный угол, опирающийся на каждую. Последняя дуга это половина окружности, то есть её хорда диаметр.',
    'There is a safe in the room and its code has three places. Three different arcs are marked on one circle: eighty, a hundred and forty, and a hundred and eighty degrees. Find the inscribed angle subtending each. The last arc is half the circle, so its chord is a diameter.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch burchakni kodga o'sish tartibida yozing.",
    'Запиши три угла в код по возрастанию.',
    'Write the three angles into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Har yoyning yarmi olindi: saksondan qirq, bir yuz qirqdan yetmish, bir yuz saksondan to'qson. Oxirgisi darsning alohida holi: yoy aylananing yarmi bo'lsa, unga tiralgan burchak har doim to'g'ri. Uchala javob ham berilgan yoylardan kichik, va bu tekshirishning eng oson belgisi.",
    'Верно. У каждой дуги взята половина: из восьмидесяти сорок, из ста сорока семьдесят, из ста восьмидесяти девяносто. Последний случай особый: если дуга это половина окружности, опирающийся на неё угол всегда прямой. Все три ответа меньше данных дуг, и это самый простой признак для проверки.',
    'Correct. Half of each arc was taken: eighty gives forty, a hundred and forty gives seventy, a hundred and eighty gives ninety. The last is the special case: if the arc is half the circle, the angle subtending it is always right. All three answers are smaller than the given arcs, and that is the easiest check.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('80') !== -1 || s.slots.indexOf('140') !== -1 || s.slots.indexOf('180') !== -1, text: L(
      "Kodga YOYNING o'zi tushib qoldi. Sakson, bir yuz qirq va bir yuz sakson — bu yoylar, burchaklar emas. Ichki chizilgan burchak yoydan ikki barobar kichik bo'ladi, ya'ni javoblar bank ro'yxatining birinchi yarmidan olinadi.",
      'В код попала САМА дуга. Восемьдесят, сто сорок и сто восемьдесят это дуги, а не углы. Вписанный угол вдвое меньше дуги, значит ответы берутся из первой половины списка в банке.',
      'The ARC itself got into the code. Eighty, a hundred and forty, and a hundred and eighty are arcs, not angles. An inscribed angle is twice smaller than the arc, so the answers come from the first half of the bank list.') },
    { when: (s) => s.slots.indexOf('90') === -1, text: L(
      "To'qson tushib qoldi. Uchinchi yoy bir yuz sakson gradus, ya'ni aylananing yarmi, va unga tiralgan burchak to'qson bo'ladi. Bu holatni alohida yodlash shart emas: qoida o'sha, yoyning yarmi.",
      'Девяносто выпало. Третья дуга сто восемьдесят градусов, то есть половина окружности, и опирающийся на неё угол равен девяноста. Заучивать этот случай отдельно не нужно: правило то же, половина дуги.',
      'Ninety is missing. The third arc is a hundred and eighty degrees, half the circle, and the angle subtending it is ninety. This case needs no separate memorising: the rule is the same, half the arc.') },
    { when: () => true, text: L(
      "Kod uch burchakdan yig'iladi, va ular o'sish tartibida turishi kerak. Har yoyni ikkiga bo'ling: sakson, bir yuz qirq va bir yuz saksondan qirq, yetmish va to'qson chiqadi.",
      'Код складывается из трёх углов, и стоять они должны по возрастанию. Раздели каждую дугу на два: из восьмидесяти, ста сорока и ста восьмидесяти выйдут сорок, семьдесят и девяносто.',
      'The code is built from three angles and they must stand in increasing order. Divide each arc by two: eighty, a hundred and forty, and a hundred and eighty give forty, seventy, and ninety.') },
  ],
  wrongText: L(
    "Har yoyni ikkiga bo'ling, keyin uch sonni o'sish tartibida qo'ying.",
    'Раздели каждую дугу на два, потом поставь три числа по возрастанию.',
    'Divide each arc by two, then put the three numbers in increasing order.'),
};

export default function D51_08(props) { return <CodeLock data={DATA} {...props} />; }
