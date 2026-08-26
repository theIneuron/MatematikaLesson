// Dars44 · Amaliyot 05 — Pazl · 🟡 · tag: sides_back
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §6 (44-dars, 5-pozitsiya)
//
// UCH JUFTLIK, IKKINCHISI TESKARI YO'NALISHDA:
//   a=9, b=12  -> c=15    (kvadratlarni qo'shish)
//   c=25, a=7  -> b=24    (kvadratlarning AYIRMASI)
//   a=20, b=21 -> c=29    (kvadratlarni qo'shish, katta sonlar)
// З92 ikkinchi juftlikda tutiladi: yigirma besh minus yetti o'n sakkiz —
// bunday karta yo'q, chunki ayirish UZUNLIKLARDA emas, KVADRATLARDA bajariladi.
// Kartalarda yozuv bo'shliqsiz (telefonda karta 54px, skelet §14).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'sides_back', level: '🟡',
  faceSize: 12, faceSizePhone: 10,
  cards: [
    { id: 'f1', side: 0, tokens: ['a=9,b=12'] },
    { id: 'f2', side: 0, tokens: ['c=25,a=7'] },
    { id: 'f3', side: 0, tokens: ['a=20,b=21'] },
    { id: 'v1', side: 1, v: 'c=15' },
    { id: 'v2', side: 1, v: 'b=24' },
    { id: 'v3', side: 1, v: 'c=29' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Oltita karta: uchtasida shart, uchtasida natija. Ikki shartda katetlar berilgan va gipotenuza izlanadi, bittasida esa gipotenuza bilan bir katet berilgan va ikkinchi katet izlanadi.",
    'Шесть карточек: в трёх условие, в трёх результат. В двух условиях даны катеты и ищется гипотенуза, в одном даны гипотенуза и один катет и ищется второй катет.',
    'Six cards: three hold a condition, three a result. Two conditions give the legs and ask for the hypotenuse; one gives the hypotenuse and one leg and asks for the other leg.'),
  ask: L(
    'Shartni bosing, keyin uyani bosing.',
    'Нажми условие, потом ячейку.',
    'Tap a condition, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchi va uchinchi shartda kvadratlar QO'SHILADI: sakson bir qo'shuv bir yuz qirq to'rt ikki yuz yigirma besh, ildizi o'n besh; to'rt yuz qo'shuv to'rt yuz qirq bir sakkiz yuz qirq bir, ildizi yigirma to'qqiz. Ikkinchi shartda esa kvadratlar AYIRILADI, chunki gipotenuza allaqachon berilgan: olti yuz yigirma besh minus qirq to'qqiz besh yuz yetmish olti, ildizi yigirma to'rt. Ikki yo'nalishning farqi bitta: nima izlanayotgani. Gipotenuza izlansa — qo'shish, katet izlansa — ayirish.",
    'Верно. В первом и третьем условии квадраты СКЛАДЫВАЮТСЯ: восемьдесят один плюс сто сорок четыре — двести двадцать пять, корень пятнадцать; четыреста плюс четыреста сорок один — восемьсот сорок один, корень двадцать девять. А во втором квадраты ВЫЧИТАЮТСЯ, ведь гипотенуза уже дана: шестьсот двадцать пять минус сорок девять — пятьсот семьдесят шесть, корень двадцать четыре. Разница двух направлений в одном: что именно ищется. Ищется гипотенуза — сложение, ищется катет — вычитание.',
    'Correct. In the first and third conditions the squares are ADDED: eighty one plus one hundred forty four is two hundred twenty five, the root is fifteen; four hundred plus four hundred forty one is eight hundred forty one, the root is twenty nine. In the second the squares are SUBTRACTED, since the hypotenuse is already given: six hundred twenty five minus forty nine is five hundred seventy six, the root is twenty four. One thing separates the two directions: what is being sought. Seeking the hypotenuse means adding; seeking a leg means subtracting.'),
  wrongs: [
    { when: (s) => s.mate.f2 && s.mate.f2 !== 'v2', text: L(
      "Ikkinchi shartda GIPOTENUZA berilgan (u eng katta son), ya'ni izlanadigan narsa katet. Ayirish kerak, lekin uzunliklarda emas: yigirma besh minus yetti o'n sakkiz — bu xato. Kvadratlarda ayirish kerak: olti yuz yigirma besh minus qirq to'qqiz besh yuz yetmish olti, ildizi yigirma to'rt.",
      'Во втором условии дана ГИПОТЕНУЗА (это наибольшее число), значит искать надо катет. Вычитать нужно, но не длины: двадцать пять минус семь — восемнадцать, это ошибка. Вычитать надо квадраты: шестьсот двадцать пять минус сорок девять — пятьсот семьдесят шесть, корень двадцать четыре.',
      'The second condition gives the HYPOTENUSE (the largest number), so a leg is being sought. Subtraction is needed, but not of the lengths: twenty five minus seven is eighteen, and that is wrong. The squares are subtracted: six hundred twenty five minus forty nine is five hundred seventy six, the root is twenty four.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "Bu ikki natija almashib ketdi. Ikkalasida ham qo'shish bajariladi, lekin sonlar boshqa: sakson bir qo'shuv bir yuz qirq to'rt ikki yuz yigirma besh (ildizi o'n besh), to'rt yuz qo'shuv to'rt yuz qirq bir sakkiz yuz qirq bir (ildizi yigirma to'qqiz). Katetlar kattaroq bo'lsa, gipotenuza ham kattaroq.",
      'Эти два результата поменялись местами. В обоих выполняется сложение, но числа разные: восемьдесят один плюс сто сорок четыре — двести двадцать пять (корень пятнадцать), четыреста плюс четыреста сорок один — восемьсот сорок один (корень двадцать девять). Чем больше катеты, тем больше гипотенуза.',
      'These two results swapped places. Both involve addition but with different numbers: eighty one plus one hundred forty four is two hundred twenty five (root fifteen), four hundred plus four hundred forty one is eight hundred forty one (root twenty nine). Larger legs mean a larger hypotenuse.') },
    { when: (s) => s.bad.length >= 2, text: L(
      "Har shartda avval eng KATTA sonni toping: agar u berilgan bo'lsa, u gipotenuza va kvadratlar ayiriladi; agar berilmagan bo'lsa, gipotenuza izlanadi va kvadratlar qo'shiladi. Kartadagi harflar ham shuni aytadi.",
      'В каждом условии сначала найди НАИБОЛЬШЕЕ число: если оно дано, это гипотенуза и квадраты вычитаются; если не дано, гипотенуза ищется и квадраты складываются. Буквы в карточке говорят о том же.',
      'In every condition first find the LARGEST number: if it is given, it is the hypotenuse and the squares are subtracted; if it is not, the hypotenuse is sought and the squares are added. The letters on the card say the same.') },
  ],
  wrongText: L(
    "Gipotenuza izlansa kvadratlar qo'shiladi, katet izlansa ayiriladi. Ikki holatda ham oxirida ildiz chiqariladi.",
    'Ищется гипотенуза — квадраты складываются, ищется катет — вычитаются. В обоих случаях в конце извлекается корень.',
    'Seeking the hypotenuse the squares are added, seeking a leg they are subtracted. Either way the root is taken at the end.'),
};

export default function D44_05(props) { return <PairSlots data={DATA} {...props} />; }
