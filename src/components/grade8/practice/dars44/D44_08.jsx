// Dars44 · Amaliyot 08 — Juftlash · 🔴 · tag: mixed_sides
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §6 (44-dars, 8-pozitsiya)
//
// TO'RT JUFTLIK, YO'NALISHLAR ARALASH: ikkitasida gipotenuza izlanadi,
// ikkitasida katet.
//   a=12, b=35 -> c=37 ;  c=41, a=9  -> b=40
//   a=10, b=24 -> c=26 ;  c=30, a=18 -> b=24
// Oxirgi ikki natija yaqin (26 va 24), va bu ataylab: shartga qaramasdan
// «kattasini olaman» degan yo'l ishlamaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'mixed_sides', level: '🔴',
  connect: true,
  targetSize: 17, itemSize: 15,
  items: [
    { id: 'm1', tokens: ['a=12, b=35'] },
    { id: 'm2', tokens: ['c=41, a=9'] },
    { id: 'm3', tokens: ['a=10, b=24'] },
    { id: 'm4', tokens: ['c=30, a=18'] },
  ],
  targets: [
    { id: 't1', tokens: ['c = 37'] },
    { id: 't2', tokens: ['b = 40'] },
    { id: 't3', tokens: ['c = 26'] },
    { id: 't4', tokens: ['b = 24'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt to'g'ri burchakli uchburchak. Ikkitasida ikki katet berilgan, ikkitasida gipotenuza bilan bir katet. Yozuvdagi harflar nima berilganini aytadi: c — gipotenuza, a va b — katetlar.",
    'Четыре прямоугольных треугольника. В двух даны два катета, в двух гипотенуза и один катет. Буквы в записи говорят, что дано: c — гипотенуза, a и b — катеты.',
    'Four right triangles. Two give the two legs, two give the hypotenuse and one leg. The letters say what is given: c is the hypotenuse, a and b the legs.'),
  ask: L(
    "Chapdan shartni bosing, keyin o'ngdan natijani bosing.",
    'Нажми условие слева, потом результат справа.',
    'Tap a condition on the left, then the result on the right.'),
  correctText: L(
    "To'g'ri. Ikki shartda gipotenuza izlanadi va kvadratlar qo'shiladi: bir yuz qirq to'rt qo'shuv bir ming ikki yuz yigirma besh bir ming uch yuz oltmish to'qqiz, ildizi o'ttiz yetti; yuz qo'shuv besh yuz yetmish olti olti yuz yetmish olti, ildizi yigirma olti. Ikki shartda katet izlanadi va kvadratlar ayiriladi: bir ming olti yuz sakson bir minus sakson bir bir ming olti yuz, ildizi qirq; to'qqiz yuz minus uch yuz yigirma to'rt besh yuz yetmish olti, ildizi yigirma to'rt. Diqqat qiladigan joy: oxirgi ikki javob yaqin — yigirma olti va yigirma to'rt, — lekin biri gipotenuza, ikkinchisi katet. Harflarni o'qish kerak.",
    'Верно. В двух условиях ищется гипотенуза и квадраты складываются: сто сорок четыре плюс тысяча двести двадцать пять — тысяча триста шестьдесят девять, корень тридцать семь; сто плюс пятьсот семьдесят шесть — шестьсот семьдесят шесть, корень двадцать шесть. В двух ищется катет и квадраты вычитаются: тысяча шестьсот восемьдесят один минус восемьдесят один — тысяча шестьсот, корень сорок; девятьсот минус триста двадцать четыре — пятьсот семьдесят шесть, корень двадцать четыре. На что стоит обратить внимание: два последних ответа близки — двадцать шесть и двадцать четыре, — но один гипотенуза, другой катет. Буквы надо читать.',
    'Correct. In two conditions the hypotenuse is sought and the squares are added: one hundred forty four plus one thousand two hundred twenty five is one thousand three hundred sixty nine, the root is thirty seven; one hundred plus five hundred seventy six is six hundred seventy six, the root is twenty six. In two a leg is sought and the squares are subtracted: one thousand six hundred eighty one minus eighty one is one thousand six hundred, the root is forty; nine hundred minus three hundred twenty four is five hundred seventy six, the root is twenty four. Worth noticing: the last two answers are close — twenty six and twenty four — but one is a hypotenuse and the other a leg. The letters must be read.'),
  wrongs: [
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki juftlik almashib ketdi, va sabab shu: javoblari yaqin, lekin ishlari boshqa. Uchinchi shartda ikki KATET berilgan, ya'ni gipotenuza izlanadi va kvadratlar QO'SHILADI: yuz qo'shuv besh yuz yetmish olti, ildizi yigirma olti. To'rtinchi shartda gipotenuza berilgan, ya'ni katet izlanadi va kvadratlar AYIRILADI: to'qqiz yuz minus uch yuz yigirma to'rt, ildizi yigirma to'rt.",
      'Эти две пары поменялись местами, и вот почему: ответы близки, а действия разные. В третьем условии даны два КАТЕТА, значит ищется гипотенуза и квадраты СКЛАДЫВАЮТСЯ: сто плюс пятьсот семьдесят шесть, корень двадцать шесть. В четвёртом дана гипотенуза, значит ищется катет и квадраты ВЫЧИТАЮТСЯ: девятьсот минус триста двадцать четыре, корень двадцать четыре.',
      'These two pairs were swapped, and here is why: their answers are close but their work differs. The third condition gives two LEGS, so the hypotenuse is sought and the squares are ADDED: one hundred plus five hundred seventy six, root twenty six. The fourth gives the hypotenuse, so a leg is sought and the squares are SUBTRACTED: nine hundred minus three hundred twenty four, root twenty four.') },
    { when: (s) => s.pair.m2 && s.pair.m2 !== 't2', text: L(
      "Ikkinchi shartda gipotenuza qirq bir, katet esa to'qqiz — ya'ni ikkinchi katet izlanadi va u qirqqa teng. Kvadratlarni ayirish kerak: bir ming olti yuz sakson bir minus sakson bir bir ming olti yuz, ildizi qirq. Chiziqli ayirish (qirq bir minus to'qqiz) o'ttiz ikkini beradi — bunday karta yo'q.",
      'Во втором условии гипотенуза сорок один, катет девять — значит ищется второй катет, и он равен сорока. Надо вычитать квадраты: тысяча шестьсот восемьдесят один минус восемьдесят один — тысяча шестьсот, корень сорок. Линейное вычитание (сорок один минус девять) даёт тридцать два — такой карточки нет.',
      'The second condition has hypotenuse forty one and leg nine, so the other leg is sought and equals forty. The squares must be subtracted: one thousand six hundred eighty one minus eighty one is one thousand six hundred, the root is forty. Plain subtraction (forty one minus nine) gives thirty two — there is no such card.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har shartda birinchi ish — harflarni o'qish. Shartda c bor bo'lsa, gipotenuza BERILGAN va kvadratlar ayiriladi; c yo'q bo'lsa, gipotenuza izlanadi va kvadratlar qo'shiladi. Javobning harfi ham buni tasdiqlaydi.",
      'В каждом условии первое дело — прочитать буквы. Если в условии есть c, гипотенуза ДАНА и квадраты вычитаются; если c нет, гипотенуза ищется и квадраты складываются. Буква в ответе это подтверждает.',
      'The first job in every condition is to read the letters. If c is in the condition, the hypotenuse is GIVEN and the squares are subtracted; if c is absent, the hypotenuse is sought and the squares are added. The letter in the answer confirms it.') },
  ],
  wrongText: L(
    "Harflarni o'qing: c berilgan bo'lsa kvadratlar ayiriladi, berilmagan bo'lsa qo'shiladi.",
    'Читай буквы: если c дано — квадраты вычитаются, если нет — складываются.',
    'Read the letters: if c is given the squares are subtracted, if not they are added.'),
};

export default function D44_08(props) { return <MatchPairs data={DATA} {...props} />; }
