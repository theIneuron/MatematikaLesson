// 9-sinf, 17-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: KASR-RATSIONAL TENGSIZLIKLAR. C BLOKI SHU DARS BILAN YAKUNLANADI.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (17-dars).
// Skelet:  src/books/grade9/DARS11_17_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 17`
//
// Darsning butun gapi 05-topshiriqda ko'rinadi: bitta javobda ikkita
// chegara IKKI XIL turda — surat noli yopiq (belgi qat'iy emas), maxraj
// noli ochiq (har doim). `DomainAxis` ning `interval` rejimi aynan shu
// holat uchun ishlatiladi.
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 RowTable   🟢 nollarni-toliq-belgilamaslik  06 PlacePoint  🟡 maxraj-nolini-kiritish
//   02 TrueFalse  🟢 maxraj-nolini-kiritish        07 Zones       🟡 nollarni-toliq-belgilamaslik
//   03 Choice     🟢 maxrajga-korpaytirib-yechish  08 AuditLines  🔴 qisqartirib-yoqotish
//   04 TypeSet    🟡 nollarni-toliq-belgilamaslik  09 ClozeBank   🔴 maxraj-nolini-kiritish
//   05 DomainAxis 🟡 maxraj-nolini-kiritish        10 OrderLines  🔴 maxrajga-korpaytirib-yechish
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D17_01 from './D17_01.jsx';
import D17_02 from './D17_02.jsx';
import D17_03 from './D17_03.jsx';
import D17_04 from './D17_04.jsx';
import D17_05 from './D17_05.jsx';
import D17_06 from './D17_06.jsx';
import D17_07 from './D17_07.jsx';
import D17_08 from './D17_08.jsx';
import D17_09 from './D17_09.jsx';
import D17_10 from './D17_10.jsx';

const HEAD = {
  uz: 'Dars 17 amaliyoti — 10 topshiriq (kasr-ratsional tengsizliklar)',
  ru: 'Практика урока 17 — 10 заданий (дробно-рациональные неравенства)',
  en: 'Lesson 17 practice — 10 tasks (fractional rational inequalities)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D17_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D17_02 },
  { id: '03', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D17_03 },
  { id: '04', label: { uz: 'Nol nuqtalar', ru: 'Нулевые точки', en: 'Zero points' }, C: D17_04 },
  { id: '05', label: { uz: "Sonlar o'qi", ru: 'Ось', en: 'Axis' }, C: D17_05 },
  { id: '06', label: { uz: 'Belgilash', ru: 'Отметка', en: 'Marking' }, C: D17_06 },
  { id: '07', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D17_07 },
  { id: '08', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D17_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D17_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D17_10 },
];

export default makePractice({ HEAD, ITEMS });
