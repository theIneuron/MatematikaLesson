// 9-sinf, 15-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: ORALIQLAR USULI.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (15-dars).
// Skelet:  src/books/grade9/DARS11_17_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 15`
//
// 07-topshiriqda savol ataylab tor: javobning CHEGARALANGAN qismi
// so'raladi, shuning uchun `DomainAxis` ning `interval` rejimi yetadi va
// yangi mexanika kerak bo'lmadi (skelet §2).
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 TrueFalse  🟢 har-safar-almashadi       06 Zones       🟡 har-safar-almashadi
//   02 Choice     🟢 har-safar-almashadi       07 DomainAxis  🟡 qatiy-tengsizlikda-ildiz
//   03 RowTable   🟢 nechta-oraliq             08 ClozeBank   🔴 toliq-korpaytirmaslik
//   04 PlacePoint 🟡 toliq-korpaytirmaslik     09 OrderLines  🔴 nechta-oraliq
//   05 TypeSet    🟡 toliq-korpaytirmaslik     10 AuditLines  🔴 har-safar-almashadi
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D15_01 from './D15_01.jsx';
import D15_02 from './D15_02.jsx';
import D15_03 from './D15_03.jsx';
import D15_04 from './D15_04.jsx';
import D15_05 from './D15_05.jsx';
import D15_06 from './D15_06.jsx';
import D15_07 from './D15_07.jsx';
import D15_08 from './D15_08.jsx';
import D15_09 from './D15_09.jsx';
import D15_10 from './D15_10.jsx';

const HEAD = {
  uz: 'Dars 15 amaliyoti — 10 topshiriq (oraliqlar usuli)',
  ru: 'Практика урока 15 — 10 заданий (метод интервалов)',
  en: 'Lesson 15 practice — 10 tasks (the interval method)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D15_01 },
  { id: '02', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D15_02 },
  { id: '03', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D15_03 },
  { id: '04', label: { uz: 'Belgilash', ru: 'Отметка', en: 'Marking' }, C: D15_04 },
  { id: '05', label: { uz: 'Ildizlar', ru: 'Корни', en: 'Roots' }, C: D15_05 },
  { id: '06', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D15_06 },
  { id: '07', label: { uz: "Sonlar o'qi", ru: 'Ось', en: 'Axis' }, C: D15_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D15_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D15_09 },
  { id: '10', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D15_10 },
];

export default makePractice({ HEAD, ITEMS });
