// Dars52 · Amaliyot 01 — Burchaklar · 🟢 🖼 · tag: inscribed_angles_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §4 (52-dars, 1-pozitsiya)
//
// T3 NING BIRINCHI YARMI: ichki chizilgan to'rtburchakda qarama-qarshi
// burchaklarning yig'indisi 180°. Olti juftlikdan uchtasi shu shartni
// bajaradi. Har juftlik qo'shnisidan bir necha gradusda farq qiladi, ya'ni
// ko'z bilan emas, QO'SHISH bilan hal qilinadi.
// `given` da chizma: «ichki chizilgan to'rtburchak» degan ibora nimani
// anglatishini ko'rsatadi (uchlari aylanada yotadi).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'inscribed_angles_marked', level: '🟢',
  col: 96, itemSize: 14,
  given: [[{
    fig: 'circ', w: 92, h: 82, r: 30, cx: 46, cy: 41,
    verts: [70, 155, 250, 340], vnames: ['B', 'A', 'D', 'C'],
  }]],
  givenLabel: L('Chizma', 'Рисунок', 'The drawing'),
  items: [
    { id: 'i1', hit: true, tokens: ['70° + 110°'] },
    { id: 'i2', tokens: ['70° + 100°'] },
    { id: 'i3', hit: true, tokens: ['90° + 90°'] },
    { id: 'i4', tokens: ['80° + 80°'] },
    { id: 'i5', hit: true, tokens: ['120° + 60°'] },
    { id: 'i6', tokens: ['120° + 70°'] },
  ],
  eyebrow: L('Burchaklar', 'Углы', 'Angles'),
  setup: L(
    "Chizmada ichki chizilgan to'rtburchak: uning to'rt uchi ham aylanada yotadi. Bunday to'rtburchakda qarama-qarshi ikki burchakning yig'indisi bir yuz sakson gradusga teng. Quyida oltita juftlik berilgan.",
    'На рисунке вписанный четырёхугольник: все четыре его вершины лежат на окружности. У такого четырёхугольника сумма двух противоположных углов равна ста восьмидесяти градусам. Ниже даны шесть пар.',
    'The drawing shows an inscribed quadrilateral: all four of its vertices lie on the circle. In such a quadrilateral the sum of two opposite angles equals a hundred and eighty degrees. Six pairs are given below.'),
  ask: L(
    "Ichki chizilgan to'rtburchakda bo'lishi mumkin bo'lgan 3 ta juftlikni belgilang.",
    'Отметь 3 пары, которые возможны у вписанного четырёхугольника.',
    'Mark the 3 pairs that are possible in an inscribed quadrilateral.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uch juftlikda yig'indi bir yuz sakson chiqadi: yetmish qo'shuv bir yuz o'n, to'qson qo'shuv to'qson, bir yuz yigirma qo'shuv oltmish. Rad etilganlarda esa yig'indi bir yuz yetmish, bir yuz oltmish va bir yuz to'qson. Ko'zga ular bir xil ko'rinadi, farqni faqat qo'shish ochadi.",
    'Верно. В трёх парах сумма даёт сто восемьдесят: семьдесят плюс сто десять, девяносто плюс девяносто, сто двадцать плюс шестьдесят. У отклонённых сумма сто семьдесят, сто шестьдесят и сто девяносто. На глаз они выглядят так же, различие открывает только сложение.',
    'Correct. In three pairs the sum comes to a hundred and eighty: seventy plus a hundred and ten, ninety plus ninety, a hundred and twenty plus sixty. In the rejected ones the sums are a hundred and seventy, a hundred and sixty, and a hundred and ninety. To the eye they look the same; only addition reveals the difference.'),
  wrongs: [
    { when: (s) => s.miss.length > 0 && s.extra.length > 0, text: L(
      "Juftliklar aralashib ketdi. Ular ataylab bir-biriga o'xshatib qo'yilgan: yetmish va bir yuz o'n, yetmish va bir yuz — birinchi son bir xil, ikkinchisi esa o'n gradusga farq qiladi. Ko'z bunday farqni ko'rmaydi. Har juftlikni qo'shib ko'ring va natijani bir yuz sakson bilan solishtiring.",
      'Пары перемешались. Они нарочно сделаны похожими: семьдесят и сто десять, семьдесят и сто — первое число одно и то же, а второе отличается на десять градусов. Глаз такого различия не видит. Сложи каждую пару и сравни результат со ста восемьюдесятью.',
      'The pairs got mixed. They were deliberately made alike: seventy and a hundred and ten, seventy and a hundred — the first number is the same and the second differs by ten degrees. The eye does not catch such a difference. Add each pair up and compare the result with a hundred and eighty.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Sakson qo'shuv sakson bir yuz oltmish beradi, bir yuz sakson emas. Bu juftlik to'qson qo'shuv to'qsonga o'xshab ko'rinadi, chunki ikkala songa ham teng, lekin tenglik yetarli emas: yig'indi aniq bir yuz sakson bo'lishi kerak. Teng burchaklardan faqat to'qson va to'qson to'g'ri keladi.",
      'Восемьдесят плюс восемьдесят даёт сто шестьдесят, а не сто восемьдесят. Эта пара похожа на девяносто плюс девяносто, ведь оба числа равны, но равенства мало: сумма должна быть ровно сто восемьдесят. Из равных углов подходят только девяносто и девяносто.',
      'Eighty plus eighty is a hundred and sixty, not a hundred and eighty. This pair looks like ninety plus ninety since both numbers are equal, but equality is not enough: the sum must be exactly a hundred and eighty. Of the equal pairs only ninety and ninety fits.') },
    { when: (s) => s.extra.length > 0, text: L(
      "Ortiqcha belgilangan juftlikning yig'indisi bir yuz saksondan farq qiladi. Shart bitta va u qat'iy: qarama-qarshi ikki burchak birga bir yuz sakson gradusni to'ldirishi kerak, ya'ni ular bir-birini yarim aylanagacha to'ldiradi.",
      'Сумма лишней отмеченной пары отличается от ста восьмидесяти. Условие одно и оно строгое: два противоположных угла вместе должны составлять сто восемьдесят градусов, то есть дополнять друг друга до полуокружности.',
      'The sum of the extra marked pair differs from a hundred and eighty. There is one strict condition: two opposite angles together must make a hundred and eighty degrees, that is, complete each other to a half-circle.') },
    { when: () => true, text: L(
      "Bitta to'g'ri juftlik belgilanmay qoldi. Uchta juftlikda yig'indi aniq bir yuz sakson: yetmish va bir yuz o'n, to'qson va to'qson, bir yuz yigirma va oltmish.",
      'Одна верная пара осталась неотмеченной. В трёх парах сумма ровно сто восемьдесят: семьдесят и сто десять, девяносто и девяносто, сто двадцать и шестьдесят.',
      'One correct pair was left unmarked. In three pairs the sum is exactly a hundred and eighty: seventy and a hundred and ten, ninety and ninety, a hundred and twenty and sixty.') },
  ],
  wrongText: L(
    "Har juftlikni qo'shing. Yig'indi aniq bir yuz sakson bo'lishi kerak.",
    'Сложи каждую пару. Сумма должна быть ровно сто восемьдесят.',
    'Add up each pair. The sum must be exactly a hundred and eighty.'),
};

export default function D52_01(props) { return <MarkAll data={DATA} {...props} />; }
