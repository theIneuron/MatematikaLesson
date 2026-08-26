// Dars52 · Amaliyot 04 — Radius · 🟡 🖼 · tag: radius_from_hypotenuse
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §4 (52-dars, 4-pozitsiya)
//
// T2 NING IKKINCHI YARMI: to'g'ri burchakli uchburchakda tashqi
// aylananing markazi GIPOTENUZANING O'RTASIDA yotadi, ya'ni gipotenuza
// diametrga aylanadi va R = gipotenuza : 2.
// Chizmada bu ko'rinadi: markaz O aynan AB tomonining ustida turadi.
// 51-dars bilan bog'lanadi: diametrga tiralgan ichki chizilgan burchak
// to'g'ri, va bu yerda o'sha fakt teskari tomondan ishlatiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'radius_from_hypotenuse', level: '🟡',
  target: 13, allowNeg: false,
  // A 0°, B 180° — gipotenuza diametr; C 250° — to'g'ri burchak shu yerda.
  expr: [{
    fig: 'circ', w: 116, h: 92, r: 34, cx: 58, cy: 46,
    verts: [0, 180, 250], vnames: ['A', 'B', 'C'],
  }],
  given: [['AB = 26']],
  givenLabel: L('Gipotenuza', 'Гипотенуза', 'The hypotenuse'),
  eyebrow: L('Radius', 'Радиус', 'The radius'),
  setup: L(
    "To'g'ri burchakli ABC uchburchakning gipotenuzasi AB yigirma olti santimetr. Uning atrofiga tashqi aylana chizilgan. Chizmaga qarang: markaz O aynan gipotenuzaning ustida yotibdi, ya'ni gipotenuza aylananing diametri bo'lib qolgan.",
    'Гипотенуза AB прямоугольного треугольника ABC равна двадцати шести сантиметрам. Вокруг него описана окружность. Посмотри на рисунок: центр O лежит прямо на гипотенузе, то есть гипотенуза оказалась диаметром окружности.',
    'The hypotenuse AB of the right triangle ABC is twenty-six centimetres. A circle is circumscribed about it. Look at the drawing: the centre O lies right on the hypotenuse, so the hypotenuse turns out to be the diameter of the circle.'),
  label: L('Radius, sm', 'Радиус, см', 'The radius, cm'),
  ask: L('Tashqi aylananing radiusi nechaga teng?', 'Чему равен радиус описанной окружности?', 'What is the radius of the circumscribed circle?'),
  correctText: L(
    "To'g'ri. Gipotenuza diametr bo'lgani uchun radius uning yarmi: yigirma oltining yarmi o'n uch. Nega markaz aynan gipotenuzada yotadi? Chunki C dagi burchak to'g'ri, va o'tgan darsdan bilamiz: to'g'ri burchak faqat DIAMETRGA tiralganda chiqadi. Demak AB diametr, va uning o'rtasi markaz.",
    'Верно. Раз гипотенуза это диаметр, радиус её половина: половина двадцати шести это тринадцать. Почему центр лежит именно на гипотенузе? Потому что угол при C прямой, а из прошлого урока известно: прямой угол получается только при опоре на ДИАМЕТР. Значит AB диаметр, и его середина центр.',
    'Correct. Since the hypotenuse is the diameter, the radius is its half: half of twenty-six is thirteen. Why does the centre lie on the hypotenuse? Because the angle at C is right, and from the previous lesson we know a right angle arises only when subtending a DIAMETER. So AB is the diameter and its midpoint is the centre.'),
  wrongs: [
    { when: (s) => s.value === 26, text: L(
      "Bu gipotenuzaning o'zi, ya'ni DIAMETR. Radius diametrning yarmi, demak javob o'n uch. Chizmaga qarang: markazdan A gacha bo'lgan masofa butun AB dan aniq ikki barobar qisqa.",
      'Это сама гипотенуза, то есть ДИАМЕТР. Радиус это половина диаметра, значит ответ тринадцать. Посмотри на рисунок: расстояние от центра до A ровно вдвое короче всего AB.',
      'This is the hypotenuse itself, that is, the DIAMETER. The radius is half the diameter, so the answer is thirteen. Look at the drawing: the distance from the centre to A is exactly twice shorter than the whole of AB.') },
    { when: (s) => s.value === 52, text: L(
      "Amal teskari tomonga ketdi: siz gipotenuzani ikkiga ko'paytirdingiz. Gipotenuza allaqachon diametr, ya'ni aylananing eng uzun vatari — radius undan KATTA bo'lolmaydi. Ikkiga bo'lish kerak edi.",
      'Действие пошло в обратную сторону: ты умножил гипотенузу на два. Гипотенуза уже диаметр, то есть самая длинная хорда окружности — радиус больше неё быть не может. Надо было разделить на два.',
      'The operation went the wrong way: you multiplied the hypotenuse by two. The hypotenuse is already the diameter, the longest chord of the circle — the radius cannot exceed it. It had to be divided by two.') },
    { when: () => true, text: L(
      "To'g'ri burchakli uchburchakda tashqi aylananing markazi gipotenuzaning o'rtasida yotadi. Demak gipotenuza diametr, radius esa uning yarmi: yigirma oltini ikkiga bo'ling.",
      'В прямоугольном треугольнике центр описанной окружности лежит на середине гипотенузы. Значит гипотенуза это диаметр, а радиус её половина: раздели двадцать шесть на два.',
      'In a right triangle the centre of the circumscribed circle lies at the midpoint of the hypotenuse. So the hypotenuse is the diameter and the radius is its half: divide twenty-six by two.') },
  ],
  wrongText: L(
    "Gipotenuza diametr bo'ladi. Radius diametrning yarmi.",
    'Гипотенуза оказывается диаметром. Радиус это половина диаметра.',
    'The hypotenuse is the diameter. The radius is half the diameter.'),
};

export default function D52_04(props) { return <TypeValue data={DATA} {...props} />; }
