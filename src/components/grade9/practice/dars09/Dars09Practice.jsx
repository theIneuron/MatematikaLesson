// 9-sinf, 9-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: TENGLAMALAR SISTEMASI.
//
// Raskladka skriptdan: `scripts/grade9-practice-layout.mjs` (9-dars).
// Skelet:  src/books/grade9/DARS09_13_AMALIYOT_SKELET.md
// Kontent: `node scripts/grade9-practice-kontent.mjs 09`
//
// Bu dars B blokini ochadi. Uchta 🟢 ketma-ket kelgani uchun boshlanish
// yengil: ha/yo'q, test, jadval — uchalasi ham bitta savolga qaytadi,
// juftlik IKKALA tenglamani ham qanoatlantiradimi.
//
// Metodik xarita: mexanika · qiyinlik · teg
//   01 TrueFalse   🟢 sistema-ikkala-tenglama   06 PlacePoint  🟡 juftlik-tartib-farqi
//   02 Choice      🟢 vieta-teskari-notogri     07 DomainAxis  🟡 vieta-teskari-notogri
//   03 RowTable    🟢 sistema-ikkala-tenglama   08 ClozeBank   🔴 vieta-teskari-notogri
//   04 Zones       🟡 sistema-ikkala-tenglama   09 OrderLines  🔴 vieta-teskari-notogri
//   05 TypeSet     🟡 kvadratni-tuldirish       10 AuditLines  🔴 juftlik-tartib-farqi
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴.
//
// Amaliyotda ovoz yo'q. `import React` SHART: LMS xom jsx ni klassik
// rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D09_01 from './D09_01.jsx';
import D09_02 from './D09_02.jsx';
import D09_03 from './D09_03.jsx';
import D09_04 from './D09_04.jsx';
import D09_05 from './D09_05.jsx';
import D09_06 from './D09_06.jsx';
import D09_07 from './D09_07.jsx';
import D09_08 from './D09_08.jsx';
import D09_09 from './D09_09.jsx';
import D09_10 from './D09_10.jsx';

const HEAD = {
  uz: "Dars 9 amaliyoti — 10 topshiriq (tenglamalar sistemasi)",
  ru: 'Практика урока 9 — 10 заданий (системы уравнений)',
  en: 'Lesson 9 practice — 10 tasks (systems of equations)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D09_01 },
  { id: '02', label: { uz: 'Tenglama', ru: 'Уравнение', en: 'Equation' }, C: D09_02 },
  { id: '03', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D09_03 },
  { id: '04', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D09_04 },
  { id: '05', label: { uz: "Ko'paytma", ru: 'Произведение', en: 'Product' }, C: D09_05 },
  { id: '06', label: { uz: 'Juftlik', ru: 'Пара', en: 'Pair' }, C: D09_06 },
  { id: '07', label: { uz: 'Kichik son', ru: 'Меньшее число', en: 'Smaller' }, C: D09_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D09_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D09_09 },
  { id: '10', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D09_10 },
];

export default makePractice({ HEAD, ITEMS });
