// 9-sinf, 13-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: MASALALAR (sistema orqali). B BLOKI SHU DARS BILAN YAKUNLANADI.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (13-dars).
// Skelet:  src/books/grade9/DARS11_17_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 13`
//
// Bu darsda mexanikalar SO'ZNI tenglamaga o'tkazishga qaratilgan: 03 va 06
// «marta katta» bilan «ga katta» ni ajratadi, 04 va 07 shartga zid
// nomzodni rad etadi, 05 esa harflar nimani bildirishini tekshiradi —
// raqamlar o'rin almashsa, son butunlay boshqa bo'lib qoladi.
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 Choice     🟢 ozgaruvchi-tanlash        06 Zones       🟡 shartni-tenglamaga
//   02 RowTable   🟢 shartni-tenglamaga        07 DomainAxis  🟡 nomuvofiq-yechim
//   03 TrueFalse  🟢 shartni-tenglamaga        08 OrderLines  🔴 javobni-qaytarmaslik
//   04 TypeSet    🟡 nomuvofiq-yechim          09 AuditLines  🔴 shartni-tenglamaga
//   05 PlacePoint 🟡 ozgaruvchi-tanlash        10 ClozeBank   🔴 javobni-qaytarmaslik
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D13_01 from './D13_01.jsx';
import D13_02 from './D13_02.jsx';
import D13_03 from './D13_03.jsx';
import D13_04 from './D13_04.jsx';
import D13_05 from './D13_05.jsx';
import D13_06 from './D13_06.jsx';
import D13_07 from './D13_07.jsx';
import D13_08 from './D13_08.jsx';
import D13_09 from './D13_09.jsx';
import D13_10 from './D13_10.jsx';

const HEAD = {
  uz: 'Dars 13 amaliyoti — 10 topshiriq (masalalar)',
  ru: 'Практика урока 13 — 10 заданий (задачи)',
  en: 'Lesson 13 practice — 10 tasks (word problems)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D13_01 },
  { id: '02', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D13_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D13_03 },
  { id: '04', label: { uz: 'Sonlar', ru: 'Числа', en: 'Numbers' }, C: D13_04 },
  { id: '05', label: { uz: 'Belgilash', ru: 'Отметка', en: 'Marking' }, C: D13_05 },
  { id: '06', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D13_06 },
  { id: '07', label: { uz: "Sonlar o'qi", ru: 'Ось', en: 'Axis' }, C: D13_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D13_08 },
  { id: '09', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D13_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D13_10 },
];

export default makePractice({ HEAD, ITEMS });
