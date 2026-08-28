// 9-sinf, 16-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: TENGSIZLIKLAR SISTEMASI.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (16-dars).
// Skelet:  src/books/grade9/DARS11_17_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 16`
//
// 06-topshiriq — `DomainAxis` ning `interval` rejimi, va bu yerda uning
// asosiy ishi ko'rinadi: ikki chegara HAR XIL turda bo'ladi (biri yopiq,
// biri ochiq), chunki ular boshqa-boshqa tengsizlikdan kelgan.
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 Choice     🟢 kesishma-emas-birlashma   06 DomainAxis  🟡 chegara-turini-kochirish
//   02 TrueFalse  🟢 chegara-turini-kochirish  07 PlacePoint  🟡 faqat-bitta-tengsizlik
//   03 RowTable   🟢 faqat-bitta-tengsizlik    08 OrderLines  🔴 kesishma-emas-birlashma
//   04 Zones      🟡 faqat-bitta-tengsizlik    09 ClozeBank   🔴 kesishma-emas-birlashma
//   05 TypeSet    🟡 faqat-bitta-tengsizlik    10 AuditLines  🔴 kesishma-yoq-holati
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D16_01 from './D16_01.jsx';
import D16_02 from './D16_02.jsx';
import D16_03 from './D16_03.jsx';
import D16_04 from './D16_04.jsx';
import D16_05 from './D16_05.jsx';
import D16_06 from './D16_06.jsx';
import D16_07 from './D16_07.jsx';
import D16_08 from './D16_08.jsx';
import D16_09 from './D16_09.jsx';
import D16_10 from './D16_10.jsx';

const HEAD = {
  uz: 'Dars 16 amaliyoti — 10 topshiriq (tengsizliklar sistemasi)',
  ru: 'Практика урока 16 — 10 заданий (система неравенств)',
  en: 'Lesson 16 practice — 10 tasks (systems of inequalities)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D16_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D16_02 },
  { id: '03', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D16_03 },
  { id: '04', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D16_04 },
  { id: '05', label: { uz: 'Butun sonlar', ru: 'Целые числа', en: 'Whole numbers' }, C: D16_05 },
  { id: '06', label: { uz: "Sonlar o'qi", ru: 'Ось', en: 'Axis' }, C: D16_06 },
  { id: '07', label: { uz: 'Belgilash', ru: 'Отметка', en: 'Marking' }, C: D16_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D16_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D16_09 },
  { id: '10', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D16_10 },
];

export default makePractice({ HEAD, ITEMS });
