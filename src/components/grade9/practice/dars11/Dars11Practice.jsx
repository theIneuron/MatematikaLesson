// 9-sinf, 11-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: O'RNIGA QO'YISH USULI.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (11-dars).
// Skelet:  src/books/grade9/DARS11_17_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 11`
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 RowTable   🟢 ozgaruvchini-ifodalash   06 PlacePoint  🟡 notogri-orniga-qoyish
//   02 TrueFalse  🟢 notogri-orniga-qoyish    07 Zones       🟡 manfiy-kvadrat-holati
//   03 Choice     🟢 notogri-orniga-qoyish    08 AuditLines  🔴 ozgaruvchini-ifodalash
//   04 DomainAxis 🟡 notogri-orniga-qoyish    09 ClozeBank   🔴 manfiy-kvadrat-holati
//   05 TypeSet    🟡 kasr-birlashtirish       10 OrderLines  🔴 ozgaruvchini-ifodalash
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D11_01 from './D11_01.jsx';
import D11_02 from './D11_02.jsx';
import D11_03 from './D11_03.jsx';
import D11_04 from './D11_04.jsx';
import D11_05 from './D11_05.jsx';
import D11_06 from './D11_06.jsx';
import D11_07 from './D11_07.jsx';
import D11_08 from './D11_08.jsx';
import D11_09 from './D11_09.jsx';
import D11_10 from './D11_10.jsx';

const HEAD = {
  uz: "Dars 11 amaliyoti — 10 topshiriq (o'rniga qo'yish usuli)",
  ru: 'Практика урока 11 — 10 заданий (способ подстановки)',
  en: 'Lesson 11 practice — 10 tasks (the substitution method)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D11_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D11_02 },
  { id: '03', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D11_03 },
  { id: '04', label: { uz: "Sonlar o'qi", ru: 'Ось', en: 'Axis' }, C: D11_04 },
  { id: '05', label: { uz: 'Qiymatlar', ru: 'Значения', en: 'Values' }, C: D11_05 },
  { id: '06', label: { uz: 'Belgilash', ru: 'Отметка', en: 'Marking' }, C: D11_06 },
  { id: '07', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D11_07 },
  { id: '08', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D11_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D11_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D11_10 },
];

export default makePractice({ HEAD, ITEMS });
