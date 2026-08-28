// 9-sinf, 12-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: QO'SHISH USULI.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (12-dars).
// Skelet:  src/books/grade9/DARS11_17_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 12`
//
// 07-topshiriqda birinchi tenglama `given` da turadi, kartochkalar esa
// faqat ikkinchi tenglamalar — shu bilan Zones kartasi telefonda ham
// sig'adi (ikki tenglama bitta kartada sig'masdi).
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 TrueFalse  🟢 qoshish-yoqotish          06 TypeSet     🟡 faqat-bitta-yechim
//   02 RowTable   🟢 yigindini-javob-deb-olish 07 Zones       🟡 qoshish-yoqotish
//   03 Choice     🟢 qoshish-yoqotish          08 ClozeBank   🔴 yigindini-javob-deb-olish
//   04 PlacePoint 🟡 orniga-qoyishni-unutish   09 AuditLines  🔴 orniga-qoyishni-unutish
//   05 DomainAxis 🟡 orniga-qoyishni-unutish   10 OrderLines  🔴 faqat-bitta-yechim
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D12_01 from './D12_01.jsx';
import D12_02 from './D12_02.jsx';
import D12_03 from './D12_03.jsx';
import D12_04 from './D12_04.jsx';
import D12_05 from './D12_05.jsx';
import D12_06 from './D12_06.jsx';
import D12_07 from './D12_07.jsx';
import D12_08 from './D12_08.jsx';
import D12_09 from './D12_09.jsx';
import D12_10 from './D12_10.jsx';

const HEAD = {
  uz: "Dars 12 amaliyoti — 10 topshiriq (qo'shish usuli)",
  ru: 'Практика урока 12 — 10 заданий (способ сложения)',
  en: 'Lesson 12 practice — 10 tasks (the addition method)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D12_01 },
  { id: '02', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D12_02 },
  { id: '03', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D12_03 },
  { id: '04', label: { uz: 'Belgilash', ru: 'Отметка', en: 'Marking' }, C: D12_04 },
  { id: '05', label: { uz: "Sonlar o'qi", ru: 'Ось', en: 'Axis' }, C: D12_05 },
  { id: '06', label: { uz: 'Qiymatlar', ru: 'Значения', en: 'Values' }, C: D12_06 },
  { id: '07', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D12_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D12_08 },
  { id: '09', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D12_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D12_10 },
];

export default makePractice({ HEAD, ITEMS });
