// 9-sinf, 2-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: FUNKSIYANING XOSSALARI — O'SISH VA KAMAYISH, JUFTLIK VA TOQLIK.
//
// Metodist qarori 2026-08-27: 2, 3, 4-darslar amaliyoti 1-darsdagi AYNAN
// o'sha o'nta mexanikada quriladi, faqat ketma-ketligi boshqa. Raskladka
// ko'z bilan emas, skriptdan: `scripts/grade9-practice-layout.mjs`.
//
// Skelet:  src/books/grade9/DARS02_04_AMALIYOT_SKELET.md
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md
// Pul:     src/books/grade9/TIPLAR_AMALIYOT_9SINF.md
//
// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik · teg
//   01 RowTable    🟢 oyna-vs-burilish     06 DomainAxis  🟡 bitta-tarmoq
//   02 Choice      🟢 bitta-nuqtada-xulosa 07 TypeSet     🟡 bitta-nuqtada-xulosa
//   03 TrueFalse   🟢 bitta-tarmoq         08 AuditLines  🔴 bitta-nuqtada-xulosa
//   04 Zones       🟡 oyna-vs-burilish     09 OrderLines  🔴 bitta-nuqtada-xulosa
//   05 PlacePoint  🟡 oyna-vs-burilish     10 ClozeBank   🔴 oyna-vs-burilish
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D02_01 from './D02_01.jsx';
import D02_02 from './D02_02.jsx';
import D02_03 from './D02_03.jsx';
import D02_04 from './D02_04.jsx';
import D02_05 from './D02_05.jsx';
import D02_06 from './D02_06.jsx';
import D02_07 from './D02_07.jsx';
import D02_08 from './D02_08.jsx';
import D02_09 from './D02_09.jsx';
import D02_10 from './D02_10.jsx';

const HEAD = {
  uz: "Dars 2 amaliyoti — 10 topshiriq (funksiyaning xossalari)",
  ru: 'Практика урока 2 — 10 заданий (свойства функции)',
  en: 'Lesson 2 practice — 10 tasks (properties of a function)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D02_01 },
  { id: '02', label: { uz: 'Xulosa', ru: 'Вывод', en: 'Conclusion' }, C: D02_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D02_03 },
  { id: '04', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D02_04 },
  { id: '05', label: { uz: 'Nuqta', ru: 'Точка', en: 'Point' }, C: D02_05 },
  { id: '06', label: { uz: "O'q", ru: 'Ось', en: 'Axis' }, C: D02_06 },
  { id: '07', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D02_07 },
  { id: '08', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D02_08 },
  { id: '09', label: { uz: 'Isbot', ru: 'Доказательство', en: 'Proof' }, C: D02_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D02_10 },
];

export default makePractice({ HEAD, ITEMS });
