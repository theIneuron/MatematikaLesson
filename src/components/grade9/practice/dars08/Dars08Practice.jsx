// 9-sinf, 8-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: KASR-RATSIONAL TENGLAMALAR.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (8-dars).
// Skelet:  src/books/grade9/DARS05_08_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 08`
//
// Bu dars A blokini yopadi. 06-topshiriqda `point` rejimi 07-darsdagiga
// QARAMA-QARSHI ishlaydi: u yerda ildiz belgilangan va nuqta bo'yalgan
// edi, bu yerda esa ODZ dan chiqarilgan son va nuqta bo'sh.
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 RowTable    🟢 butun-deb-kasr-oqish        06 DomainAxis  🟡 maxraj-nolga-teng
//   02 Choice      🟢 begona-ildizni-qabul-qilish 07 TypeSet     🟡 butun-deb-kasr-oqish
//   03 TrueFalse   🟢 maxraj-nolga-teng           08 AuditLines  🔴 begona-ildizni-qabul-qilish
//   04 PlacePoint  🟡 butun-deb-kasr-oqish        09 OrderLines  🔴 yechim-yoq-holati
//   05 Zones       🟡 maxraj-nolga-teng           10 ClozeBank   🔴 yechim-yoq-holati
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D08_01 from './D08_01.jsx';
import D08_02 from './D08_02.jsx';
import D08_03 from './D08_03.jsx';
import D08_04 from './D08_04.jsx';
import D08_05 from './D08_05.jsx';
import D08_06 from './D08_06.jsx';
import D08_07 from './D08_07.jsx';
import D08_08 from './D08_08.jsx';
import D08_09 from './D08_09.jsx';
import D08_10 from './D08_10.jsx';

const HEAD = {
  uz: "Dars 8 amaliyoti — 10 topshiriq (kasr-ratsional tenglamalar)",
  ru: 'Практика урока 8 — 10 заданий (дробно-рациональные уравнения)',
  en: 'Lesson 8 practice — 10 tasks (fractional equations)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D08_01 },
  { id: '02', label: { uz: 'Nega ODZ', ru: 'Зачем ОДЗ', en: 'Why the domain' }, C: D08_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D08_03 },
  { id: '04', label: { uz: 'Nuqta', ru: 'Точка', en: 'Point' }, C: D08_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D08_05 },
  { id: '06', label: { uz: 'Taqiq', ru: 'Запрет', en: 'Ban' }, C: D08_06 },
  { id: '07', label: { uz: 'Ildiz', ru: 'Корень', en: 'Root' }, C: D08_07 },
  { id: '08', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D08_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D08_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D08_10 },
];

export default makePractice({ HEAD, ITEMS });
