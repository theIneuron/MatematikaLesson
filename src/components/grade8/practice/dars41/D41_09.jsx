// Dars41 · Amaliyot 09 — Pazl · 🔴 · tag: area_back
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3 (41-dars, 9-pozitsiya)
//
// UCH JUFTLIK, UCH YO'NALISH: birinchisida yuza izlanadi, ikkinchisida
// balandlik, uchinchisida asos. Teskari yo'nalishda ikkiga BO'LISH emas,
// IKKILANTIRISH kerak: h = 2S : a.
//
// З85 bilan yurgan o'quvchi uch yarim va to'rt yarimni oladi — butun son
// chiqmasligining o'zi tuzoqni ko'rsatadi, va razbor shuni aytadi.
// Kartalarda yozuv bo'shliqsiz (telefonda karta 54px, skelet §14).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'area_back', level: '🔴',
  faceSize: 12, faceSizePhone: 10,
  cards: [
    { id: 'f1', side: 0, tokens: ['a=12,h=6'] },
    { id: 'f2', side: 0, tokens: ['S=28,a=8'] },
    { id: 'f3', side: 0, tokens: ['S=18,h=4'] },
    { id: 'v1', side: 1, v: 'S=36' },
    { id: 'v2', side: 1, v: 'h=7' },
    { id: 'v3', side: 1, v: 'a=9' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Oltita karta: uchtasida shart, uchtasida natija. Birinchi shartda yuza izlanadi, qolgan ikkitasida esa yuza berilgan va yetmayotgan uzunlik izlanadi.",
    'Шесть карточек: в трёх условие, в трёх результат. В первом условии ищется площадь, а в двух других площадь дана и ищется недостающая длина.',
    'Six cards: three hold a condition, three a result. The first condition asks for the area; in the other two the area is given and the missing length is asked for.'),
  ask: L(
    'Shartni bosing, keyin uyani bosing.',
    'Нажми условие, потом ячейку.',
    'Tap a condition, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisida to'g'ri yo'nalish: o'n ikki karra olti yetmish ikki, yarmi o'ttiz olti. Qolgan ikkitasida yo'nalish teskari, va u yerda ikkiga bo'lish emas, IKKILANTIRISH bor. Yigirma sakkizni ikkilantirsak ellik olti, uni sakkizga bo'lsak yetti — balandlik shu. O'n sakkizni ikkilantirsak o'ttiz olti, uni to'rtga bo'lsak to'qqiz — asos shu. Tekshirish oson: sakkiz karra yetti ning yarmi yigirma sakkiz, to'qqiz karra to'rt ning yarmi o'n sakkiz.",
    'Верно. В первой прямое направление: двенадцать на шесть — семьдесят два, половина тридцать шесть. В двух других направление обратное, и там не деление на два, а УДВОЕНИЕ. Удвоим двадцать восемь — пятьдесят шесть, разделим на восемь — семь, вот высота. Удвоим восемнадцать — тридцать шесть, разделим на четыре — девять, вот основание. Проверка простая: половина от восьми на семь — двадцать восемь, половина от девяти на четыре — восемнадцать.',
    'Correct. The first runs forward: twelve times six is seventy two, half is thirty six. The other two run backwards, and there it is not halving but DOUBLING. Double twenty eight to fifty six, divide by eight and get seven — that is the height. Double eighteen to thirty six, divide by four and get nine — that is the base. Checking is easy: half of eight times seven is twenty eight, half of nine times four is eighteen.'),
  wrongs: [
    { when: (s) => s.mate.f1 && s.mate.f1 !== 'v1', text: L(
      "Birinchi kartada asos ham, balandlik ham berilgan, ya'ni izlanadigan narsa YUZA. O'n ikki karra olti yetmish ikki, yarmi o'ttiz olti. Bu kartada teskari yo'nalish yo'q.",
      'В первой карточке даны и основание, и высота, значит искать нужно ПЛОЩАДЬ. Двенадцать на шесть — семьдесят два, половина тридцать шесть. В этой карточке обратного направления нет.',
      'The first card gives both the base and the height, so what is asked for is the AREA. Twelve times six is seventy two, half is thirty six. There is no reverse direction in this card.') },
    { when: (s) => s.mate.f2 === 'v3' || s.mate.f3 === 'v2', text: L(
      "Ikki natija joyini almashtirdi. Kartadagi HARFGA qarang: yuza bilan asos berilgan bo'lsa, izlanadigan narsa balandlik; yuza bilan balandlik berilgan bo'lsa, asos. Har ikkisini alohida tekshiring: sakkiz karra yetti ning yarmi yigirma sakkiz, to'qqiz karra to'rt ning yarmi o'n sakkiz.",
      'Два результата поменялись местами. Смотри на БУКВУ в карточке: если даны площадь и основание, ищется высота; если площадь и высота — основание. Проверь каждый: половина от восьми на семь — двадцать восемь, половина от девяти на четыре — восемнадцать.',
      'The two results swapped places. Look at the LETTER in the card: if the area and the base are given, the height is asked for; if the area and the height, the base. Check each: half of eight times seven is twenty eight, half of nine times four is eighteen.') },
    { when: (s) => s.bad.length >= 2, text: L(
      "Teskari yo'nalishda yuzani IKKILANTIRING, keyin ma'lum uzunlikka bo'ling. Ikkilantirishni tashlab ketsangiz, uch yarim va to'rt yarim chiqadi — bunday karta yo'q, va butun son chiqmagani xatoni ko'rsatib turadi.",
      'В обратном направлении УДВОЙ площадь, потом раздели на известную длину. Если пропустить удвоение, выйдут три с половиной и четыре с половиной — таких карточек нет, и нецелый ответ сам показывает ошибку.',
      'Going backwards, DOUBLE the area, then divide by the known length. Skip the doubling and you get three and a half and four and a half — there are no such cards, and the non-whole answer points at the mistake itself.') },
  ],
  wrongText: L(
    "To'g'ri yo'nalishda ikkiga bo'linadi, teskari yo'nalishda esa yuza ikkilantiriladi.",
    'В прямом направлении делят на два, в обратном площадь удваивают.',
    'Forwards you halve; backwards you double the area.'),
};

export default function D41_09(props) { return <PairSlots data={DATA} {...props} />; }
