// Dars55 · Amaliyot 03 — Koordinatalar · 🟢 🖼 · tag: which_coords
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §7 (55-dars, 3-pozitsiya)
//
// A(2;5), B(7;1) -> AB(5; −4). Chizmada to'r bor: o'quvchi surilishni
// KATAK bilan sanab tekshira oladi — o'ngga besh, pastga to'rt.
// Tuzoqlar: (−5;4) — З116; (9;6) — qo'shildi; (5;4) — ishora tushdi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_coords', level: '🟢',
  correct: 0, optCols: 2, optSize: 18,
  expr: [{
    fig: 'vec', w: 118, h: 96,
    grid: { x: [-1, 8], y: [-1, 6] },
    arrows: [{ from: [2, 5], to: [7, 1], name: 'AB' }],
    dots: [{ at: [2, 5], name: 'A', dy: -6 }, { at: [7, 1], name: 'B', dy: -6 }],
  }],
  given: [['A(2; 5)'], ['B(7; 1)']],
  givenLabel: L('Nuqtalar', 'Точки', 'The points'),
  eyebrow: L('Koordinatalar', 'Координаты', 'Coordinates'),
  setup: L(
    "Koordinata tekisligida A va B nuqtalari belgilangan, ular orasida AB vektori chizilgan. Vektorning koordinatalarini topish kerak. Chizmada kataklarni sanash mumkin: strelka qaysi tomonga va qancha siljigan.",
    'На координатной плоскости отмечены точки A и B, между ними начерчен вектор AB. Надо найти координаты вектора. По рисунку можно считать клетки: куда и на сколько сместилась стрелка.',
    'The points A and B are marked on the coordinate plane with the vector AB drawn between them. Find the coordinates of the vector. The cells in the drawing can be counted: which way and by how much the arrow shifted.'),
  ask: L(
    'AB vektorining koordinatalari qanday?',
    'Каковы координаты вектора AB?',
    'What are the coordinates of the vector AB?'),
  opts: [
    { label: ['(5; −4)'] },
    { label: ['(−5; 4)'] },
    { label: ['(9; 6)'] },
    { label: ['(5; 4)'] },
  ],
  correctText: L(
    "To'g'ri. Oxirdan boshni ayiramiz: yetti ayirmoq ikki besh, bir ayirmoq besh minus to'rt. Chizmada buni sanash mumkin: strelka o'ngga besh katak va pastga to'rt katak siljidi. Pastga siljish ikkinchi koordinatani MANFIY qiladi, va shu sababdan javobda minus turibdi.",
    'Верно. Из конца вычитаем начало: семь минус два пять, один минус пять минус четыре. По рисунку это можно сосчитать: стрелка сместилась вправо на пять клеток и вниз на четыре. Смещение вниз делает вторую координату ОТРИЦАТЕЛЬНОЙ, отсюда и минус в ответе.',
    'Correct. From the end we subtract the start: seven minus two is five, one minus five is minus four. The drawing lets you count it: the arrow shifted five cells right and four cells down. A downward shift makes the second coordinate NEGATIVE, hence the minus in the answer.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Tartib teskarilangan: boshning koordinatalaridan oxirniki ayirilgan. Bu QARAMA-QARSHI vektorni beradi, ya'ni BA ni, AB ni emas. Chizmaga qarang: strelka A dan B ga qaraydi, ya'ni o'ngga va pastga. O'ngga siljish musbat, pastga siljish manfiy.",
      'Порядок перепутан: из координат начала вычли координаты конца. Это даёт ПРОТИВОПОЛОЖНЫЙ вектор, то есть BA, а не AB. Посмотри на рисунок: стрелка идёт из A в B, то есть вправо и вниз. Смещение вправо положительно, вниз отрицательно.',
      'The order is reversed: the end coordinates were subtracted from the start ones. That gives the OPPOSITE vector, BA rather than AB. Look at the drawing: the arrow runs from A to B, that is, right and down. A rightward shift is positive, a downward shift negative.') },
    { when: (s) => s.picked === 2, text: L(
      "Siz koordinatalarni QO'SHDINGIZ: ikki qo'shuv yetti to'qqiz, besh qo'shuv bir olti. Qo'shish nuqtalarning koordinatalarini birlashtiradi, lekin vektor bu SURILISH — bir nuqtadan ikkinchisiga o'tish. Surilishni topish uchun ayirish kerak.",
      'Ты СЛОЖИЛ координаты: два плюс семь девять, пять плюс один шесть. Сложение объединяет координаты точек, но вектор это СМЕЩЕНИЕ — переход от одной точки к другой. Чтобы найти смещение, надо вычитать.',
      'You ADDED the coordinates: two plus seven is nine, five plus one is six. Addition merges the coordinates of the points, but a vector is a SHIFT — the move from one point to the other. To find a shift you must subtract.') },
    { when: (s) => s.picked === 3, text: L(
      "Birinchi koordinata to'g'ri, ikkinchisida esa ishora tushib qolgan. Bir ayirmoq besh minus to'rt, to'rt emas. Chizmada bu ko'rinadi: B nuqtasi A dan PASTDA yotibdi, demak vektor pastga qaraydi va ikkinchi koordinata manfiy bo'lishi kerak.",
      'Первая координата верна, а во второй потерян знак. Один минус пять это минус четыре, а не четыре. На рисунке это видно: точка B лежит НИЖЕ A, значит вектор направлен вниз и вторая координата должна быть отрицательной.',
      'The first coordinate is right, but the sign is lost in the second. One minus five is minus four, not four. The drawing shows it: the point B lies BELOW A, so the vector points down and the second coordinate must be negative.') },
  ],
  wrongText: L(
    "Oxirdan boshni ayiring. Chizmada sanang: o'ngga qancha, pastga qancha.",
    'Из конца вычти начало. Посчитай по рисунку: сколько вправо, сколько вниз.',
    'Subtract the start from the end. Count it in the drawing: how far right, how far down.'),
};

export default function D55_03(props) { return <Choice data={DATA} {...props} />; }
