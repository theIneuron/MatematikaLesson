// Dars51 · Amaliyot 02 — Yoy · 🟢 · tag: arc_from_angle
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §3 (51-dars, 2-pozitsiya)
//
// 01 dan TESKARI yo'nalish: u yerda yoydan burchak (yarimlash), bu yerda
// burchakdan yoy (ikkilash). Ikki yo'nalishni yonma-yon qo'yish З109 ni
// ikki tomondan yopadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'arc_from_angle', level: '🟢',
  target: 70, allowNeg: false,
  given: [['∠ABC = 35°']],
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  eyebrow: L('Yoy', 'Дуга', 'The arc'),
  setup: L(
    "Aylanaga ichki chizilgan ABC burchagi o'ttiz besh gradusga teng. U tiralgan AC yoyi necha gradus ekanini topish kerak. Bu safar amal teskari tomonga ketadi.",
    'Вписанный в окружность угол ABC равен тридцати пяти градусам. Надо найти, сколько градусов в дуге AC, на которую он опирается. На этот раз действие идёт в обратную сторону.',
    'The inscribed angle ABC equals thirty-five degrees. Find how many degrees the subtended arc AC has. This time the operation goes the other way.'),
  label: L('Yoy, gradus', 'Дуга, градусов', 'The arc, degrees'),
  ask: L('AC yoyi necha gradus?', 'Сколько градусов в дуге AC?', 'How many degrees is the arc AC?'),
  correctText: L(
    "To'g'ri. Ikki yo'nalishni ajratib olish kerak. Yoydan burchakka o'tganda YARIMLAYMIZ, burchakdan yoyga o'tganda esa IKKILAYMIZ. Bu bitta qoidaning ikki tomoni: tenglikda bir tomonda burchak turadi, ikkinchi tomonda yoyning yarmi, va qaysi tomonni izlasak, o'sha amal chiqadi. Bu yerda burchak berilgan, demak ikkilash kerak: o'ttiz besh karra ikki, yetmish. Tekshirish ham o'sha tenglikdan chiqadi: yetmishning yarmi o'ttiz besh, ya'ni dastlabki burchak qaytib keldi. Javob mantiqqa ham mos: yoy o'ziga tiralgan burchakdan har doim katta.",
    'Верно. Надо различать два направления. От дуги к углу ДЕЛИМ пополам, а от угла к дуге УДВАИВАЕМ. Это две стороны одного правила: в равенстве с одной стороны стоит угол, с другой половина дуги, и какую сторону ищем, то действие и выходит. Здесь дан угол, значит надо удваивать: тридцать пять умножить на два, семьдесят. Проверка выходит из того же равенства: половина семидесяти это тридцать пять, то есть исходный угол вернулся. Ответ и по смыслу верен: дуга всегда больше опирающегося на неё угла.',
    'Correct. Two directions must be kept apart. Going from the arc to the angle we HALVE, going from the angle to the arc we DOUBLE. These are two sides of one rule: the equality has the angle on one side and half the arc on the other, and whichever side is sought decides the operation. Here the angle is given, so doubling is needed: thirty-five times two, seventy. The check comes from the same equality: half of seventy is thirty-five, so the original angle came back. The answer also makes sense: an arc is always larger than the angle subtending it.'),
  wrongs: [
    { when: (s) => s.value === 35, text: L(
      "Bu burchakning o'zi. Ichki chizilgan burchak yoyga TENG emas, u yoyning yarmi, demak yoy burchakdan katta bo'lishi kerak. Ikkovini tenglashtirish darsning eng qimmat xatosi.",
      'Это сам угол. Вписанный угол не РАВЕН дуге, он половина дуги, значит дуга должна быть больше угла. Приравнять их — самая дорогая ошибка урока.',
      'This is the angle itself. An inscribed angle is not EQUAL to the arc, it is half of it, so the arc must be larger than the angle. Equating them is the costliest error of the lesson.') },
    { when: (s) => s.value === 17 || s.value === 18, text: L(
      "Amal noto'g'ri tomonga ketdi: siz burchakni yana yarimladingiz. Yarimlash yoydan burchakka o'tganda kerak. Bu yerda esa burchak berilgan va yoy izlanmoqda, demak ikkilash kerak.",
      'Действие пошло не в ту сторону: ты снова поделил угол пополам. Деление пополам нужно при переходе от дуги к углу. А здесь дан угол и ищется дуга, значит надо удваивать.',
      'The operation went the wrong way: you halved the angle again. Halving is what takes you from the arc to the angle. Here the angle is given and the arc is sought, so you must double.') },
    { when: (s) => s.value === 145 || s.value === 325, text: L(
      "Bu qarama-qarshi yoy: uch yuz oltmishdan yetmishni ayirsak ikki yuz to'qson chiqadi, uning yarmi esa bir yuz qirq besh. Lekin so'ralayotgani burchak TIRALGAN yoy, ya'ni uchdan qarama-qarshi tomondagisi, u yetmish gradus.",
      'Это противоположная дуга: триста шестьдесят минус семьдесят даёт двести девяносто, а её половина сто сорок пять. Но спрашивают дугу, на которую угол ОПИРАЕТСЯ, то есть противоположную вершине, она семьдесят градусов.',
      'This is the opposite arc: three hundred and sixty minus seventy is two hundred and ninety, whose half is a hundred and forty-five. But the question asks for the arc the angle SUBTENDS, the one opposite the vertex, and that is seventy degrees.') },
  ],
  wrongText: L(
    "Burchak yoyning yarmi, demak yoy burchakning ikkilangani. O'ttiz beshni ikkiga ko'paytiring.",
    'Угол — половина дуги, значит дуга — удвоенный угол. Умножь тридцать пять на два.',
    'The angle is half the arc, so the arc is the doubled angle. Multiply thirty-five by two.'),
};

export default function D51_02(props) { return <TypeValue data={DATA} {...props} />; }
