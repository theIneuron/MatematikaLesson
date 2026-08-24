// Dars47 amaliyoti — 10 topshiriq. Mavzu: SIRKUL VA CHIZG'ICH BILAN YASASHLAR.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 47-dars raskladkasi: slots, choice, bracket, chain, fix, sort, build, order, build, chain
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D47_01 from './D47_01.jsx';
import D47_02 from './D47_02.jsx';
import D47_03 from './D47_03.jsx';
import D47_04 from './D47_04.jsx';
import D47_05 from './D47_05.jsx';
import D47_06 from './D47_06.jsx';
import D47_07 from './D47_07.jsx';
import D47_08 from './D47_08.jsx';
import D47_09 from './D47_09.jsx';
import D47_10 from './D47_10.jsx';

const HEAD = {
  uz: "Dars 47 amaliyoti — 10 topshiriq (sirkul va chizg'ich bilan yasashlar)",
  ru: 'Практика урока 47 — 10 заданий (построения циркулем и линейкой)',
  en: 'Lesson 47 practice — 10 tasks (compass and ruler constructions)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Sirkulning ishi', ru: 'Работа циркуля', en: 'What the compass does' }, C: D47_01 },  // slots 🟢 comp_meaning
  { id: '02', label: { uz: 'Yoy', ru: 'Дуга', en: 'The arc' }, C: D47_02 },  // choice 🟢 comp_arc
  { id: '03', label: { uz: 'Tenglikni yozish', ru: 'Записать равенство', en: 'Write the equality' }, C: D47_03 },  // bracket 🟢 comp_bracket
  { id: '04', label: { uz: 'Bissektrisa yasash', ru: 'Построение биссектрисы', en: 'Building a bisector' }, C: D47_04 },  // chain 🟡 comp_bisector_chain
  { id: '05', label: { uz: 'Yasashdagi xato', ru: 'Ошибка в построении', en: 'A flaw in the construction' }, C: D47_05 },  // fix 🟡 comp_fix
  { id: '06', label: { uz: 'Nima yasaldi', ru: 'Что построено', en: 'What was built' }, C: D47_06 },  // sort 🟡 comp_zones
  { id: '07', label: { uz: "Kesmani ko'chirish", ru: 'Перенос отрезка', en: 'Copying a segment' }, C: D47_07 },  // build 🟡 comp_copy
  { id: '08', label: { uz: 'Yasash tartibi', ru: 'Порядок построения', en: 'Order of construction' }, C: D47_08 },  // order 🔴 comp_order
  { id: '09', label: { uz: 'Yasash mumkinmi', ru: 'Можно ли построить', en: 'Can it be built' }, C: D47_09 },  // build 🔴 comp_possible
  { id: '10', label: { uz: 'Transportirsiz', ru: 'Без транспортира', en: 'Without a protractor' }, C: D47_10 },  // chain 🔴 comp_45_chain
];

export default function Dars47Practice({ lang = 'uz' }) {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#fe5b1a' : '#d6dae3'),
    background: active ? '#fe5b1a' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif", whiteSpace: 'nowrap',
  });

  return (
    <div className="pq-fixroot" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* MOBIL_DESKTOP_MOSLASH.md naqshi + AMALIYOT_GLOBAL_STANDART.md 1-band: fon #fff7ed. */}
      <style>{`
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff7ed;display:flex;flex-direction:column;zoom:var(--pqz,1);}
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>{HEAD[lang] || HEAD.uz}</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {i + 1} · {item.label[lang] || item.label.uz}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <PracticeHost key={q.id + '-' + lang} Question={q.C} lang={lang} showLanguageSwitch={false} title={null} />
      </div>
    </div>
  );
}
