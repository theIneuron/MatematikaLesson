// 9-sinf, 6-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: KVADRAT TENGSIZLIKLAR.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (6-dars).
// Skelet:  src/books/grade9/DARS05_08_AMALIYOT_SKELET.md
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md
//
// SHU DARSDA `DomainAxis` ning `interval` REJIMI birinchi marta ishlaydi
// (05-topshiriq): kvadrat tengsizlikning javobi nur emas, oraliq.
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 TrueFalse   🟢 javob-doim-tashqi-oraliq   06 TypeSet     🟡 belgi-almashtirish-notogri
//   02 RowTable    🟢 belgi-almashtirish-notogri 07 PlacePoint  🟡 chegara-nuqta-kiritish
//   03 Choice      🟢 javob-doim-bitta-oraliq    08 ClozeBank   🔴 chegara-nuqta-kiritish
//   04 Zones       🟡 javob-doim-tashqi-oraliq   09 AuditLines  🔴 javob-doim-tashqi-oraliq
//   05 DomainAxis  🟡 chegara-nuqta-kiritish     10 OrderLines  🔴 belgi-almashtirish-notogri
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D06_01 from './D06_01.jsx';
import D06_02 from './D06_02.jsx';
import D06_03 from './D06_03.jsx';
import D06_04 from './D06_04.jsx';
import D06_05 from './D06_05.jsx';
import D06_06 from './D06_06.jsx';
import D06_07 from './D06_07.jsx';
import D06_08 from './D06_08.jsx';
import D06_09 from './D06_09.jsx';
import D06_10 from './D06_10.jsx';

const HEAD = {
  uz: "Dars 6 amaliyoti — 10 topshiriq (kvadrat tengsizliklar)",
  ru: 'Практика урока 6 — 10 заданий (квадратные неравенства)',
  en: 'Lesson 6 practice — 10 tasks (quadratic inequalities)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D06_01 },
  { id: '02', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D06_02 },
  { id: '03', label: { uz: 'Javob shakli', ru: 'Вид ответа', en: 'Answer shape' }, C: D06_03 },
  { id: '04', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D06_04 },
  { id: '05', label: { uz: "O'q", ru: 'Ось', en: 'Axis' }, C: D06_05 },
  { id: '06', label: { uz: 'Nollar', ru: 'Нули', en: 'Zeros' }, C: D06_06 },
  { id: '07', label: { uz: 'Kesishish', ru: 'Пересечение', en: 'Crossings' }, C: D06_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D06_08 },
  { id: '09', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D06_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D06_10 },
];

export default makePractice({ HEAD, ITEMS });
