// 9-sinf, 1-dars amaliyoti — 10 topshiriq, 10 XIL MEXANIKA.
// Mavzu: FUNKSIYA VA ANIQLANISH SOHASI.
//
// Metodist qarori 2026-08-26: 9-sinf amaliyoti 8-sinfdagi qoida bo'yicha
// quriladi — 52 dars x 10 topshiriq, har darsda AYNAN shu o'nta mexanika,
// faqat ketma-ketlik boshqa. Uchtasini metodist ko'rsatdi (test, ha/yo'q,
// javobni kiritish), yettitasi tasdiqlandi.
//
// Skelet:  src/books/grade9/DARS01_AMALIYOT_SKELET.md
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md
// Pul:     src/books/grade9/TIPLAR_AMALIYOT_9SINF.md
//
// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik · teg
//   01 Choice      🟢 not_a_function     06 TypeSet     🟡 both_bans
//   02 RowTable    🟢 table_both_ways    07 DomainAxis  🟡 domain_on_axis
//   03 TrueFalse   🟢 graph_claims       08 OrderLines  🔴 order_domain
//   04 PlacePoint  🟡 place_point        09 AuditLines  🔴 first_wrong_line
//   05 Zones       🟡 three_zones        10 ClozeBank   🔴 rule_words
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Mexanikalar: beshtasi umumiy qatlamdan (`grade8/practice/kit.jsx`),
// beshtasi sinfning o'zidan (`grade9/practice/asboblar9.jsx`). Nusxa yo'q.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { makePractice } from '../Amaliyot.jsx';
import D01_01 from './D01_01.jsx';
import D01_02 from './D01_02.jsx';
import D01_03 from './D01_03.jsx';
import D01_04 from './D01_04.jsx';
import D01_05 from './D01_05.jsx';
import D01_06 from './D01_06.jsx';
import D01_07 from './D01_07.jsx';
import D01_08 from './D01_08.jsx';
import D01_09 from './D01_09.jsx';
import D01_10 from './D01_10.jsx';

const HEAD = {
  uz: "Dars 1 amaliyoti — 10 topshiriq (funksiya va aniqlanish sohasi)",
  ru: 'Практика урока 1 — 10 заданий (функция и область определения)',
  en: 'Lesson 1 practice — 10 tasks (function and domain)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Juftliklar', ru: 'Пары', en: 'Pairs' }, C: D01_01 },
  { id: '02', label: { uz: 'Jadval', ru: 'Таблица', en: 'Table' }, C: D01_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D01_03 },
  { id: '04', label: { uz: 'Nuqta', ru: 'Точка', en: 'Point' }, C: D01_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D01_05 },
  { id: '06', label: { uz: 'Taqiq', ru: 'Запрет', en: 'Ban' }, C: D01_06 },
  { id: '07', label: { uz: "O'q", ru: 'Ось', en: 'Axis' }, C: D01_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D01_08 },
  { id: '09', label: { uz: 'Xato qator', ru: 'Ошибочная строка', en: 'Wrong line' }, C: D01_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D01_10 },
];

export default makePractice({ HEAD, ITEMS });
