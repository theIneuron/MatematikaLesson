// Dars07 · Amaliyot 01 — Belgilash · 🟢 · tag: inverse_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: src/books/grade8/DARS07_11_AMALIYOT_SKELET.md §5 (7-dars, 1-pozitsiya)
//
// Teskari proporsionallikning belgisi BITTA: harf chiziqning TAGIDA turadi,
// ya'ni x va y ning KO'PAYTMASI o'zgarmaydi. Uchta tuzoq uch xil:
//   12x   — to'g'ri proporsionallik, З27 ning o'zi;
//   x/12  — harf chiziqning USTIDA, ko'paytma emas, nisbat o'zgarmaydi;
//   x + 5 — umuman proporsionallik emas.
// Manfiy k ham teskari proporsionallik (−7/x): shuning uchun u BELGILANADI.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'inverse_marked', level: '🟢',
  col: 164, itemSize: 20,
  items: [
    { id: 'i1', tokens: ['y', '=', { n: '12', d: 'x' }], hit: true },
    { id: 'i2', tokens: ['y', '=', '12x'] },
    { id: 'i3', tokens: ['y', '=', { n: 'x', d: '12' }] },
    { id: 'i4', tokens: ['y', '=', { n: '5', d: 'x' }], hit: true },
    { id: 'i5', tokens: ['y', '=', { n: '−7', d: 'x' }], hit: true },
    { id: 'i6', tokens: ['y', '=', 'x + 5'] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita formula. Teskari proporsionallikda x va y ning ko'paytmasi o'zgarmaydi.",
    'Шесть формул. При обратной пропорциональности произведение x на y не меняется.',
    'Six formulas. In inverse proportionality the product of x and y does not change.'),
  ask: L(
    'Teskari proporsionallik bo\'lgan 3 ta formulani belgilang.',
    'Отметь 3 формулы, которые задают обратную пропорциональность.',
    'Mark the 3 formulas that give inverse proportionality.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasida ham harf chiziqning TAGIDA, demak ko'paytma o'zgarmaydi: birinchisida x ni y ga ko'paytirsangiz o'n ikki chiqadi, ikkinchisida besh, uchinchisida minus yetti. Minus yetti ham k, ishorasi manfiy bo'lgani teskari proporsionallikni buzmaydi — u faqat tarmoqlarni boshqa choraklarga ko'chiradi.",
    'Верно. Во всех трёх буква стоит ПОД чертой, значит произведение не меняется: в первой x на y даёт двенадцать, во второй пять, в третьей минус семь. Минус семь тоже k: отрицательный знак обратную пропорциональность не ломает, он только переносит ветви в другие четверти.',
    'Correct. In all three the letter is BELOW the bar, so the product stays the same: the first gives twelve, the second five, the third minus seven. Minus seven is also k: a negative sign does not break inverse proportionality, it only moves the branches to other quadrants.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu yerda harf chiziq tagida emas, ko'paytuvchi bo'lib turadi. Birni qo'ying — o'n ikki, ikkini qo'ying — yigirma to'rt: x o'sganda y ham o'sadi. Ko'paytma esa o'zgaradi: o'n ikki, keyin qirq sakkiz.",
      'Здесь буква не под чертой, а множитель. Подставь один — двенадцать, подставь два — двадцать четыре: с ростом x растёт и y. А произведение меняется: двенадцать, потом сорок восемь.',
      'Here the letter is not below the bar but a factor. Substitute one and you get twelve, substitute two and you get twenty four: as x grows y grows too. And the product changes: twelve, then forty eight.') },
    { when: (s) => s.extra.indexOf('i3') !== -1, text: L(
      "Bu formulada harf chiziqning USTIDA. O'n ikkini qo'ying — bir chiqadi, yigirma to'rtni qo'ying — ikki. O'zgarmay turgani ko'paytma emas, NISBAT.",
      'В этой формуле буква стоит НАД чертой. Подставь двенадцать — выйдет один, подставь двадцать четыре — два. Неизменным остаётся не произведение, а ОТНОШЕНИЕ.',
      'In this formula the letter is ABOVE the bar. Substitute twelve and you get one, substitute twenty four and you get two. What stays constant is not the product but the RATIO.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu yerda x ga son QO'SHILADI, bo'linish yo'q. Birni qo'ying — olti, ikkini qo'ying — yetti: har qadamda bittaga o'sadi. Ko'paytmani ham sanab ko'ring — olti, keyin o'n to'rt.",
      'Здесь к x число ПРИБАВЛЯЕТСЯ, деления нет. Подставь один — шесть, подставь два — семь: растёт на единицу за шаг. Посчитай и произведение — шесть, потом четырнадцать.',
      'Here a number is ADDED to x, there is no division. Substitute one and you get six, substitute two and you get seven: it grows by one each step. Count the product too — six, then fourteen.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Minus yetti bo'lingan x ni chetlab o'tdingiz. Ko'paytmani sanang: x ni birga teng olsangiz y minus yetti, ko'paytma minus yetti; x ni yettiga olsangiz y minus bir, ko'paytma yana minus yetti. O'zgarmadi, demak bu ham teskari proporsionallik.",
      'Минус семь делить на x осталось в стороне. Посчитай произведение: при x равном одному y минус семь, произведение минус семь; при x равном семи y минус один, произведение то же. Не изменилось — значит это тоже обратная пропорциональность.',
      'Minus seven over x was left out. Count the product: at x equal to one, y is minus seven and the product is minus seven; at x equal to seven, y is minus one and the product is the same. It did not change, so this is inverse proportionality too.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta formula kerak. Har birida bitta narsani ko'ring: x chiziqning tagidami? Tagida bo'lsa ko'paytmani sanab tekshiring.",
      'Нужно ровно три формулы. В каждой смотри одно: x стоит под чертой? Если под чертой — проверь произведение подстановкой.',
      'Exactly three formulas are needed. Look for one thing in each: is x below the bar? If it is, check the product by substituting.') },
  ],
  wrongText: L(
    "Har formulada x ga ikki qiymat qo'yib y ni toping va ko'paytmani sanang. Ko'paytma o'zgarmasa — teskari proporsionallik.",
    'В каждой формуле подставь два значения x, найди y и посчитай произведение. Не изменилось — обратная пропорциональность.',
    'In each formula substitute two values of x, find y and count the product. If the product stays the same it is inverse proportionality.'),
};

export default function D07_01(props) { return <MarkAll data={DATA} {...props} />; }
