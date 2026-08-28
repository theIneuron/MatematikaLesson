// 9-sinf, 14-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: IKKINCHI DARAJALI TENGSIZLIKLAR — D = 0 va D < 0.
// C BLOKI (TENGSIZLIKLAR) SHU DARS BILAN BOSHLANADI.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (14-dars).
// Skelet:  src/books/grade9/DARS11_17_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 14`
//
// 04-topshiriqda javob BITTA nuqta bo'ladi — DomainAxis ning `point`
// rejimi shu holat uchun yetarli, yangi rejim kerak bo'lmadi
// (skelet §2).
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 RowTable   🟢 urinish-notogri-oqish     06 TypeSet     🟡 ikkita-ildiz-deb-oylash
//   02 Choice     🟢 ikkita-ildiz-deb-oylash   07 Zones       🟡 ikkita-ildiz-deb-oylash
//   03 TrueFalse  🟢 diskriminant-manfiy       08 AuditLines  🔴 yechim-yoq-yoki-hamma-son
//   04 DomainAxis 🟡 urinish-notogri-oqish     09 OrderLines  🔴 urinish-notogri-oqish
//   05 PlacePoint 🟡 urinish-notogri-oqish     10 ClozeBank   🔴 diskriminant-manfiy
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D14_01 from './D14_01.jsx';
import D14_02 from './D14_02.jsx';
import D14_03 from './D14_03.jsx';
import D14_04 from './D14_04.jsx';
import D14_05 from './D14_05.jsx';
import D14_06 from './D14_06.jsx';
import D14_07 from './D14_07.jsx';
import D14_08 from './D14_08.jsx';
import D14_09 from './D14_09.jsx';
import D14_10 from './D14_10.jsx';

const HEAD = {
  uz: 'Dars 14 amaliyoti — 10 topshiriq (ikkinchi darajali tengsizliklar)',
  ru: 'Практика урока 14 — 10 заданий (неравенства второй степени)',
  en: 'Lesson 14 practice — 10 tasks (quadratic inequalities)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D14_01 },
  { id: '02', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D14_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D14_03 },
  { id: '04', label: { uz: "Sonlar o'qi", ru: 'Ось', en: 'Axis' }, C: D14_04 },
  { id: '05', label: { uz: 'Belgilash', ru: 'Отметка', en: 'Marking' }, C: D14_05 },
  { id: '06', label: { uz: 'Ildizlar', ru: 'Корни', en: 'Roots' }, C: D14_06 },
  { id: '07', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D14_07 },
  { id: '08', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D14_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D14_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D14_10 },
];

export default makePractice({ HEAD, ITEMS });
