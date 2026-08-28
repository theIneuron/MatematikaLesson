// 9-sinf, 3-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: KVADRAT FUNKSIYA.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (3-dars).
// Skelet:  src/books/grade9/DARS02_04_AMALIYOT_SKELET.md
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md
// Pul:     src/books/grade9/TIPLAR_AMALIYOT_9SINF.md
//
// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik · teg
//   01 TrueFalse   🟢 tenglama-vs-funksiya  06 PlacePoint  🟡 nol-vs-vershina
//   02 Choice      🟢 nol-koeff-a           07 DomainAxis  🟡 nol-vs-vershina
//   03 RowTable    🟢 nol-vs-vershina       08 ClozeBank   🔴 nol-koeff-a
//   04 TypeSet     🟡 nol-vs-vershina       09 OrderLines  🔴 tenglama-vs-funksiya
//   05 Zones       🟡 a-kattaligi-ishorasi  10 AuditLines  🔴 nol-koeff-a
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D03_01 from './D03_01.jsx';
import D03_02 from './D03_02.jsx';
import D03_03 from './D03_03.jsx';
import D03_04 from './D03_04.jsx';
import D03_05 from './D03_05.jsx';
import D03_06 from './D03_06.jsx';
import D03_07 from './D03_07.jsx';
import D03_08 from './D03_08.jsx';
import D03_09 from './D03_09.jsx';
import D03_10 from './D03_10.jsx';

const HEAD = {
  uz: "Dars 3 amaliyoti — 10 topshiriq (kvadrat funksiya)",
  ru: 'Практика урока 3 — 10 заданий (квадратичная функция)',
  en: 'Lesson 3 practice — 10 tasks (the quadratic function)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D03_01 },
  { id: '02', label: { uz: 'Yozuv', ru: 'Запись', en: 'Record' }, C: D03_02 },
  { id: '03', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D03_03 },
  { id: '04', label: { uz: 'Nollar', ru: 'Нули', en: 'Zeros' }, C: D03_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D03_05 },
  { id: '06', label: { uz: 'Uchi', ru: 'Вершина', en: 'Vertex' }, C: D03_06 },
  { id: '07', label: { uz: "O'q", ru: 'Ось', en: 'Axis' }, C: D03_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D03_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D03_09 },
  { id: '10', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D03_10 },
];

export default makePractice({ HEAD, ITEMS });
