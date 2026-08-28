// 9-sinf, 7-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: BUTUN TENGLAMALAR.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (7-dars).
// Skelet:  src/books/grade9/DARS05_08_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 07`
//
// SHU DARSDA `DomainAxis` ning `point` REJIMI birinchi marta ishlaydi
// (04-topshiriq): chiziqli tenglamaning javobi nur ham, oraliq ham emas —
// bitta nuqta.
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 Choice      🟢 qavs-ochish-ishorasi        06 Zones       🟡 butun-vs-kasr-tenglama
//   02 RowTable    🟢 had-kochirish-ishorasi      07 TypeSet     🟡 qavs-ochish-ishorasi
//   03 TrueFalse   🟢 butun-vs-kasr-tenglama      08 OrderLines  🔴 tekshirish-otkazib-yuborish
//   04 DomainAxis  🟡 qavs-ochish-ishorasi        09 AuditLines  🔴 qavs-ochish-ishorasi
//   05 PlacePoint  🟡 tekshirish-otkazib-yuborish 10 ClozeBank   🔴 had-kochirish-ishorasi
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D07_01 from './D07_01.jsx';
import D07_02 from './D07_02.jsx';
import D07_03 from './D07_03.jsx';
import D07_04 from './D07_04.jsx';
import D07_05 from './D07_05.jsx';
import D07_06 from './D07_06.jsx';
import D07_07 from './D07_07.jsx';
import D07_08 from './D07_08.jsx';
import D07_09 from './D07_09.jsx';
import D07_10 from './D07_10.jsx';

const HEAD = {
  uz: "Dars 7 amaliyoti — 10 topshiriq (butun tenglamalar)",
  ru: 'Практика урока 7 — 10 заданий (целые уравнения)',
  en: 'Lesson 7 practice — 10 tasks (integer equations)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Qavs', ru: 'Скобка', en: 'Bracket' }, C: D07_01 },
  { id: '02', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D07_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D07_03 },
  { id: '04', label: { uz: 'Ildiz', ru: 'Корень', en: 'Root' }, C: D07_04 },
  { id: '05', label: { uz: 'Kesishish', ru: 'Пересечение', en: 'Crossing' }, C: D07_05 },
  { id: '06', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D07_06 },
  { id: '07', label: { uz: 'Ildizni yozish', ru: 'Записать корень', en: 'Write the root' }, C: D07_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D07_08 },
  { id: '09', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D07_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D07_10 },
];

export default makePractice({ HEAD, ITEMS });
