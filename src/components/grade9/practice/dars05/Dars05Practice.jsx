// 9-sinf, 5-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: GRAFIKLARNI KO'CHIRISH.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (5-dars).
// Skelet:  src/books/grade9/DARS05_08_AMALIYOT_SKELET.md
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md
// Pul:     src/books/grade9/TIPLAR_AMALIYOT_9SINF.md
//
// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik · teg
//   01 RowTable    🟢 uchi-notogri-oqish      06 Zones       🟡 gorizontal-vertikal-almashinish
//   02 TrueFalse   🟢 ishora-teskari-siljish  07 TypeSet     🟡 ishora-teskari-siljish
//   03 Choice      🟢 gorizontal-vertikal-...  08 AuditLines  🔴 ishora-teskari-siljish
//   04 PlacePoint  🟡 uchi-notogri-oqish      09 ClozeBank   🔴 a-joyni-ozgartirmaydi
//   05 DomainAxis  🟡 uchi-notogri-oqish      10 OrderLines  🔴 uchi-notogri-oqish
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D05_01 from './D05_01.jsx';
import D05_02 from './D05_02.jsx';
import D05_03 from './D05_03.jsx';
import D05_04 from './D05_04.jsx';
import D05_05 from './D05_05.jsx';
import D05_06 from './D05_06.jsx';
import D05_07 from './D05_07.jsx';
import D05_08 from './D05_08.jsx';
import D05_09 from './D05_09.jsx';
import D05_10 from './D05_10.jsx';

const HEAD = {
  uz: "Dars 5 amaliyoti — 10 topshiriq (grafiklarni ko'chirish)",
  ru: 'Практика урока 5 — 10 заданий (перенос графиков)',
  en: 'Lesson 5 practice — 10 tasks (shifting graphs)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D05_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D05_02 },
  { id: '03', label: { uz: "O'zgarish", ru: 'Изменение', en: 'Change' }, C: D05_03 },
  { id: '04', label: { uz: 'Uchi', ru: 'Вершина', en: 'Vertex' }, C: D05_04 },
  { id: '05', label: { uz: "O'q", ru: 'Ось', en: 'Axis' }, C: D05_05 },
  { id: '06', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D05_06 },
  { id: '07', label: { uz: 'Abssissa', ru: 'Абсцисса', en: 'Abscissa' }, C: D05_07 },
  { id: '08', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D05_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D05_09 },
  { id: '10', label: { uz: 'Yasash', ru: 'Построение', en: 'Construction' }, C: D05_10 },
];

export default makePractice({ HEAD, ITEMS });
