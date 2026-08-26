// Dars42 · Amaliyot 08 — Pazl · 🔴 · tag: trap_back
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §4 (42-dars, 8-pozitsiya)
//
// UCH JUFTLIK, UCH BOSHQA ISH:
//   a=9, b=5, h=4 -> S=28        (to'g'ri yo'l)
//   S=40, h=5     -> a+b=16      (javob bitta asos EMAS, ikkisining yig'indisi)
//   m=6, h=7      -> S=42        (o'rta chiziq bilan, T2)
// Ikkinchi juftlik eng qimmat: shartda bitta asosni topish uchun ma'lumot
// YETMAYDI, va aynan shuni ko'rish kerak.
// Kartalarda yozuv bo'shliqsiz (telefonda karta 54px, skelet §14).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'trap_back', level: '🔴',
  faceSize: 12, faceSizePhone: 10,
  cards: [
    { id: 'f1', side: 0, tokens: ['a=9,b=5,h=4'] },
    { id: 'f2', side: 0, tokens: ['S=40,h=5'] },
    { id: 'f3', side: 0, tokens: ['m=6,h=7'] },
    { id: 'v1', side: 1, v: 'S=28' },
    { id: 'v2', side: 1, v: 'a+b=16' },
    { id: 'v3', side: 1, v: 'S=42' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Oltita karta: uchtasida shart, uchtasida natija. Uch shart uch xil: birinchisida ikki asos bilan balandlik, ikkinchisida yuza bilan balandlik, uchinchisida o'rta chiziq bilan balandlik berilgan.",
    'Шесть карточек: в трёх условие, в трёх результат. Три условия разные: в первом два основания и высота, во втором площадь и высота, в третьем средняя линия и высота.',
    'Six cards: three hold a condition, three a result. The three conditions differ: the first gives two bases and a height, the second an area and a height, the third a midline and a height.'),
  ask: L(
    'Shartni bosing, keyin uyani bosing.',
    'Нажми условие, потом ячейку.',
    'Tap a condition, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisi to'g'ri yo'l: to'qqiz qo'shuv besh o'n to'rt, yarmi yetti, yetti karra to'rt yigirma sakkiz. Uchinchisida o'rta chiziq berilgan, ya'ni yarim allaqachon olingan: olti karra yetti qirq ikki. Ikkinchisi esa eng qiziq joyi. Qirqni ikkilantirsak sakson, beshga bo'lsak o'n olti — lekin bu BITTA asos emas, ikkisining yig'indisi. Bitta asosni topish uchun ikkinchisini bilish kerak, shart esa uni bermaydi. Shuning uchun javob yig'indining o'zi bo'lib qoladi: bunday shartdan ko'proq narsa chiqmaydi.",
    'Верно. Первая — прямой путь: девять плюс пять — четырнадцать, половина семь, семь на четыре — двадцать восемь. В третьей дана средняя линия, то есть половина уже взята: шесть на семь — сорок два. А вторая самое интересное. Удвоим сорок — восемьдесят, разделим на пять — шестнадцать, но это не ОДНО основание, а сумма двух. Чтобы найти одно, надо знать второе, а условие его не даёт. Поэтому ответом остаётся сама сумма: больше из такого условия не выжать.',
    'Correct. The first is the forward route: nine plus five is fourteen, half is seven, seven times four is twenty eight. The third gives the midline, so the half is already taken: six times seven is forty two. The second is the interesting one. Double forty to eighty, divide by five and get sixteen — but that is not ONE base, it is the sum of two. To find one base you must know the other, and the condition does not give it. So the answer stays the sum itself: nothing more comes out of such a condition.'),
  wrongs: [
    { when: (s) => s.mate.f2 && s.mate.f2 !== 'v2', text: L(
      "Ikkinchi shartda faqat yuza va balandlik berilgan. Ulardan asoslar YIG'INDISI chiqadi: qirqni ikkilantirib beshga bo'lsak o'n olti. Bitta asosni ajratish uchun ikkinchisi kerak, u esa berilmagan — demak javob yig'indi bo'lib qoladi.",
      'Во втором условии даны только площадь и высота. Из них выходит СУММА оснований: удвоить сорок и разделить на пять — шестнадцать. Чтобы выделить одно основание, нужно второе, а его нет, значит ответом остаётся сумма.',
      'The second condition gives only an area and a height. From those comes the SUM of the bases: double forty and divide by five to get sixteen. To single out one base you need the other, and it is not given, so the sum stays the answer.') },
    { when: (s) => s.mate.f3 === 'v1' || s.mate.f1 === 'v3', text: L(
      "Bu ikki natija almashib ketdi. Uchinchi shartda o'rta chiziq berilgan va u yerda ikkiga bo'lish kerak emas: olti karra yetti qirq ikki. Birinchi shartda esa ikki asos bor, ya'ni avval yig'indining yarmi olinadi: yetti karra to'rt yigirma sakkiz.",
      'Эти два результата поменялись местами. В третьем условии дана средняя линия, и делить на два там не нужно: шесть на семь — сорок два. А в первом два основания, то есть сначала берётся половина суммы: семь на четыре — двадцать восемь.',
      'These two results swapped places. The third condition gives the midline, and no halving is needed there: six times seven is forty two. The first has two bases, so half the sum is taken first: seven times four is twenty eight.') },
    { when: (s) => s.bad.length >= 2, text: L(
      "Har kartada BERILGANLARGA qarang, keyin nima chiqishi mumkinligini aniqlang. Ikki asos va balandlik — yuza chiqadi. O'rta chiziq va balandlik — yuza chiqadi. Yuza va balandlik — faqat asoslarning yig'indisi chiqadi.",
      'В каждой карточке смотри на ДАННЫЕ, потом определяй, что из них может выйти. Два основания и высота — выйдет площадь. Средняя линия и высота — выйдет площадь. Площадь и высота — выйдет только сумма оснований.',
      'In each card look at what is GIVEN, then decide what can come out of it. Two bases and a height give the area. A midline and a height give the area. An area and a height give only the sum of the bases.') },
  ],
  wrongText: L(
    "Har shartda nima berilganini sanang: yuza va balandlikdan bitta asos CHIQMAYDI, faqat yig'indi chiqadi.",
    'Посчитай, что дано в каждом условии: из площади и высоты одно основание НЕ выходит, выходит только сумма.',
    'Count what each condition gives: an area and a height do NOT yield one base, only the sum.'),
};

export default function D42_08(props) { return <PairSlots data={DATA} {...props} />; }
