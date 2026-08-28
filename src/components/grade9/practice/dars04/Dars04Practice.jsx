// 9-sinf, 4-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: PARABOLA — uchi, simmetriya o'qi, besh nuqtadan yasash.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (4-dars).
// Skelet:  src/books/grade9/DARS02_04_AMALIYOT_SKELET.md
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md
// Pul:     src/books/grade9/TIPLAR_AMALIYOT_9SINF.md
//
// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik · teg
//   01 Choice      🟢 x0-formula-belgisi      06 TypeSet     🟡 x0-formula-belgisi
//   02 TrueFalse   🟢 simmetriya-oqi-vertikal 07 PlacePoint  🟡 nosimmetrik-nuqtalar
//   03 RowTable    🟢 nosimmetrik-nuqtalar    08 OrderLines  🔴 nollarsiz-grafik
//   04 DomainAxis  🟡 x0-formula-belgisi      09 ClozeBank   🔴 simmetriya-oqi-vertikal
//   05 Zones       🟡 x0-formula-belgisi      10 AuditLines  🔴 x0-formula-belgisi
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D04_01 from './D04_01.jsx';
import D04_02 from './D04_02.jsx';
import D04_03 from './D04_03.jsx';
import D04_04 from './D04_04.jsx';
import D04_05 from './D04_05.jsx';
import D04_06 from './D04_06.jsx';
import D04_07 from './D04_07.jsx';
import D04_08 from './D04_08.jsx';
import D04_09 from './D04_09.jsx';
import D04_10 from './D04_10.jsx';

const HEAD = {
  uz: "Dars 4 amaliyoti — 10 topshiriq (parabola)",
  ru: 'Практика урока 4 — 10 заданий (парабола)',
  en: 'Lesson 4 practice — 10 tasks (the parabola)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Ikki parabola', ru: 'Две параболы', en: 'Two parabolas' }, C: D04_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D04_02 },
  { id: '03', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D04_03 },
  { id: '04', label: { uz: "O'q", ru: 'Ось', en: 'Axis' }, C: D04_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D04_05 },
  { id: '06', label: { uz: 'Uchi', ru: 'Вершина', en: 'Vertex' }, C: D04_06 },
  { id: '07', label: { uz: 'Simmetriya', ru: 'Симметрия', en: 'Symmetry' }, C: D04_07 },
  { id: '08', label: { uz: 'Yasash', ru: 'Построение', en: 'Construction' }, C: D04_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D04_09 },
  { id: '10', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D04_10 },
];

export default makePractice({ HEAD, ITEMS });
