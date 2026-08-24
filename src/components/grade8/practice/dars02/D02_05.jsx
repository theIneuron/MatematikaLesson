// Dars02 · Amaliyot 05 — Pazl · 🟡 · tag: missing_numerator
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md §05
//
// Ilgari bu darsning 01-topshirig'i `TypeExpr` edi: 4/(3y) = ?/(15y²) da
// suratni YOZISH. Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan
// olinadi, `TypeExpr` esa u yerda yo'q. Savol saqlandi va uchga ko'paytirildi:
// endi UCH yangi maxraj bor, har biri o'z suratini talab qiladi.
//
// CHAP bo'lak — yangi MAXRAJ, O'NG bo'lak — yangi SURAT (pazl tishi bilan
// kirishadi, shuning uchun karta noto'g'ri tomonga tushmaydi).
//   3y -> 15y²   ko'paytuvchi 5y    surat 4·5y = 20y
//   3y -> 12y²   ko'paytuvchi 4y    surat 4·4y = 16y
//   3y -> 9y³    ko'paytuvchi 3y²   surat 4·3y² = 12y²
// Asosiy tuzoq — O'XSHASHLIK: 12y² ikki joyda uchraydi (bir maxrajda, bir
// suratda), va ularni juftlash З20 ning aynan o'zi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'missing_numerator', level: '🟡',
  // O'LCHAM BERILMAYDI: kit telefonda 54px, kompyuterda 76px oladi. Qat'iy 74px
  // telefonda bank kartalarini pastdagi tugma tagiga tushirib qo'yardi (o'lchov
  // 2026-08-24, grade8-practice-check.mjs).
  given: [[{ n: '4', d: '3y' }]],
  givenLabel: L('Dastlabki:', 'Исходная:', 'Original:'),
  cards: [
    { id: 'f1', tokens: ['15y²'] },
    { id: 'f2', tokens: ['12y²'] },
    { id: 'f3', tokens: ['9y³'] },
    { id: 'v1', v: '20y' },
    { id: 'v2', v: '16y' },
    { id: 'v3', v: '12y²' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Dastlabki kasr uch xil maxrajga keltirildi. Chapdagi kartalarda yangi MAXRAJ, o'ngdagilarda yangi SURAT turadi.",
    'Исходную дробь привели к трём разным знаменателям. На левых карточках новый ЗНАМЕНАТЕЛЬ, на правых — новый ЧИСЛИТЕЛЬ.',
    'The original fraction was brought to three different denominators. The left cards hold the new DENOMINATOR, the right ones the new NUMERATOR.'),
  ask: L(
    "Har maxrajga o'z suratini toping: kartani bosing, keyin uyani bosing.",
    'К каждому знаменателю найди свой числитель: нажми карточку, потом ячейку.',
    'Find its own numerator for each denominator: tap a card, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Har maxrajdan bitta savol: uch y ni NIMAGA ko'paytirdik? O'n besh y kvadrat uchun besh y, o'n ikki y kvadrat uchun to'rt y, to'qqiz y kub uchun uch y kvadrat. Suratni ham xuddi shu narsaga ko'paytiramiz: to'rt karra besh y yigirma y, to'rt karra to'rt y o'n olti y, to'rt karra uch y kvadrat o'n ikki y kvadrat. y ni birga teng qo'ying: hamma yozuv bir uchdan beradi.",
    'Верно. К каждому знаменателю один вопрос: на ЧТО умножили три y? Для пятнадцати y в квадрате — на пять y, для двенадцати y в квадрате — на четыре y, для девяти y в кубе — на три y в квадрате. Числитель умножаем на то же самое: четыре на пять y — двадцать y, четыре на четыре y — шестнадцать y, четыре на три y в квадрате — двенадцать y в квадрате. Подставь y равное одному: все записи дают одну третью.',
    'Correct. One question for each denominator: what was three y multiplied BY? For fifteen y squared it is five y, for twelve y squared four y, for nine y cubed three y squared. The numerator is multiplied by the same thing: four times five y is twenty y, four times four y is sixteen y, four times three y squared is twelve y squared. Put y equal to one: every record gives one third.'),
  wrongs: [
    { when: (s) => s.mate.f2 === 'v3', text: L(
      "Bir xil ko'rinishga ishonmang: o'n ikki y kvadrat bu yerda ikki joyda uchraydi, biri maxraj, biri surat. Uch y dan o'n ikki y kvadratga o'tish uchun to'rt y kerak, demak surat to'rt karra to'rt y.",
      'Не верь одинаковому виду: двенадцать y в квадрате встречается здесь дважды — раз знаменателем, раз числителем. Чтобы из трёх y получить двенадцать y в квадрате, нужно четыре y, значит числитель — четыре на четыре y.',
      'Do not trust the identical look: twelve y squared appears here twice, once as a denominator and once as a numerator. To get twelve y squared from three y you need four y, so the numerator is four times four y.') },
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Ko'paytuvchilar almashib ketdi: o'n besh y kvadrat uchun besh y, o'n ikki y kvadrat uchun to'rt y kerak. Maxrajdan boshlang — uch y ni ko'paytuvchiga ko'paytirsangiz aynan o'sha maxraj chiqishi kerak.",
      'Множители перепутались: для пятнадцати y в квадрате нужно пять y, для двенадцати — четыре y. Начни со знаменателя: три y на множитель должно дать именно этот знаменатель.',
      'The factors got swapped: fifteen y squared needs five y, twelve y squared needs four y. Start from the denominator: three y times the factor must give exactly that denominator.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "To'qqiz y kub uchun ko'paytuvchi uch y KVADRAT: uch y karra uch y kvadrat to'qqiz y kub. Surat esa to'rt karra uch y kvadrat.",
      'Для девяти y в кубе множитель — три y в КВАДРАТЕ: три y на три y в квадрате даёт девять y в кубе. А числитель — четыре на три y в квадрате.',
      'For nine y cubed the factor is three y SQUARED: three y times three y squared is nine y cubed. And the numerator is four times three y squared.') },
  ],
  wrongText: L(
    "Har maxraj uchun bitta ko'paytuvchi bor. Uni maxrajdan toping, keyin xuddi o'sha ko'paytuvchini suratga qo'llang — xossa ikkala qavatni birga so'raydi.",
    'У каждого знаменателя свой множитель. Найди его по знаменателю и примени тот же множитель к числителю — свойство требует оба этажа сразу.',
    'Every denominator has its own factor. Find it from the denominator, then apply the same factor to the numerator — the property asks for both floors at once.'),
};

export default function D02_05(props) { return <PairSlots data={DATA} {...props} />; }
