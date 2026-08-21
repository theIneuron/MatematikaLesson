// Dars12 · Amaliyot 05 — Kamaytirildi · 🟡 · tag: reduced_by
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// «Sonni 15 ga kamaytirdilar va 40 chiqdi.» Mos yozuvlar (hammasining
// ildizi 55):
//   x − 15 = 40    HA
//   x = 40 + 15    HA  (bir qadam yechilgan ko'rinishi)
//   40 + 15 = x    HA  (tomonlari almashgan, tenglik buzilmadi)
// Mos emas:
//   15 − x = 40    yo'q (sonni 15 dan ayirgan)
//   x + 15 = 40    yo'q (kamaytirish o'rniga oshirgan)
//   x : 15 = 40    yo'q (kamaytirish bo'lish deb o'qilgan)
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'reduced_by', level: '🟡', col: 155, itemSize: 21,
  eyebrow: L('Kamaytirildi', 'Уменьшили', 'Reduced'),
  setup: L(
    "Bir sonni 15 ga kamaytirdilar va 40 chiqdi. Bitta shartni bir necha xil yozish mumkin, lekin har yozuv mos kelmaydi.",
    'Число уменьшили на 15 и получили 40. Одно условие можно записать по-разному, но не любая запись подходит.',
    'A number was reduced by 15 and 40 came out. One condition can be written in several ways, but not any way.'),
  ask: L('Shartga MOS hamma yozuvni belgilang.', 'Отметь все записи, которые ПОДХОДЯТ к условию.', 'Mark every record that MATCHES the condition.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['x', '−', '15', '=', '40'], hit: true },
    { id: 'n1', tokens: ['x', '+', '15', '=', '40'], hit: false },
    { id: 'p2', tokens: ['x', '=', '40', '+', '15'], hit: true },
    { id: 'n2', tokens: ['15', '−', 'x', '=', '40'], hit: false },
    { id: 'p3', tokens: ['40', '+', '15', '=', 'x'], hit: true },
    { id: 'n3', tokens: ['x', ':', '15', '=', '40'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Uchtasi ham bir xil narsani aytadi: x = 55. Tenglikning tomonlarini almashtirish ham mumkin.",
    'Верно. Все три говорят одно и то же: x = 55. Части равенства можно и поменять местами.',
    'Correct. All three say the same thing: x = 55. The sides of an equality may also be swapped.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "15 − x da 15 dan noma'lum ayirilgan. Shartda esa NOMA'LUM SONDAN 15 ayirilgan.",
      'В 15 − x из 15 вычли неизвестное. А по условию 15 вычли ИЗ НЕИЗВЕСТНОГО ЧИСЛА.',
      'In 15 − x the unknown is taken from 15. The condition takes 15 FROM THE UNKNOWN.') },
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "«Kamaytirildi» bu ayirish. x + 15 esa oshirish bo'lardi.",
      '«Уменьшили» это вычитание. А x + 15 было бы увеличением.',
      '"Reduced" means subtraction. x + 15 would be an increase.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "«15 ga kamaytirish» va «15 ga bo'lish» boshqa amallar: birinchisi ayirish.",
      '«Уменьшить на 15» и «разделить на 15» — разные действия: первое это вычитание.',
      '"Reduce by 15" and "divide by 15" are different: the first is a subtraction.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "40 + 15 = x ni tekshirmadingiz: tenglikning tomonlarini almashtirish mumkin, ma'no o'zgarmaydi.",
      'Ты не проверил 40 + 15 = x: части равенства можно менять местами, смысл не меняется.',
      'You did not check 40 + 15 = x: the sides of an equality may swap without changing the meaning.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har yozuvni yechib, x = 55 chiqishini tekshiring.",
      'Одну пропустил: реши каждую запись и проверь, выходит ли x = 55.',
      'One is missing: solve each record and check whether x = 55.') },
  ],
  wrongText: L(
    "Shartni so'zma-so'z o'qing: NOMA'LUM sondan 15 ayirilgan, natija 40.",
    'Читай условие буквально: из НЕИЗВЕСТНОГО числа вычли 15, результат 40.',
    'Read the condition literally: 15 was taken from the UNKNOWN number, giving 40.'),
};

export default function D12_05(props) { return <MarkAll data={DATA} {...props} />; }
