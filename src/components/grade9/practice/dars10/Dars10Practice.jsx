// 9-sinf, 10-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: GRAFIK USUL.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (10-dars).
// Skelet:  src/books/grade9/DARS09_13_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 10`
//
// 07-topshiriqda IKKALA grafik ham chizilgan — buning uchun PlacePoint ga
// `curves` sloti qo'shildi (asboblar9.jsx). Bitta `curve` ishlatgan
// eski topshiriqlar (04, 08-darslar) o'zgarishsiz qoldi.
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 Choice     🟢 grafik-kesishish-nuqtasi   06 DomainAxis  🟡 nuqta-taxmin-emas-tekshiruv
//   02 TrueFalse  🟢 nechta-kesishish-notogri   07 PlacePoint  🟡 grafik-kesishish-nuqtasi
//   03 RowTable   🟢 faqat-bir-chiziqda         08 OrderLines  🔴 nuqta-taxmin-emas-tekshiruv
//   04 TypeSet    🟡 nechta-kesishish-notogri   09 ClozeBank   🔴 grafik-kesishish-nuqtasi
//   05 Zones      🟡 faqat-bir-chiziqda         10 AuditLines  🔴 faqat-bir-chiziqda
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D10_01 from './D10_01.jsx';
import D10_02 from './D10_02.jsx';
import D10_03 from './D10_03.jsx';
import D10_04 from './D10_04.jsx';
import D10_05 from './D10_05.jsx';
import D10_06 from './D10_06.jsx';
import D10_07 from './D10_07.jsx';
import D10_08 from './D10_08.jsx';
import D10_09 from './D10_09.jsx';
import D10_10 from './D10_10.jsx';

const HEAD = {
  uz: 'Dars 10 amaliyoti — 10 topshiriq (grafik usul)',
  ru: 'Практика урока 10 — 10 заданий (графический способ)',
  en: 'Lesson 10 practice — 10 tasks (the graphical method)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D10_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D10_02 },
  { id: '03', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D10_03 },
  { id: '04', label: { uz: 'Abssissalar', ru: 'Абсциссы', en: 'Abscissas' }, C: D10_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D10_05 },
  { id: '06', label: { uz: "Sonlar o'qi", ru: 'Ось', en: 'Axis' }, C: D10_06 },
  { id: '07', label: { uz: 'Belgilash', ru: 'Отметка', en: 'Marking' }, C: D10_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D10_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D10_09 },
  { id: '10', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D10_10 },
];

export default makePractice({ HEAD, ITEMS });
