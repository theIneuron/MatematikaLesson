// Dars33 amaliyoti — 10 topshiriq. Mavzu: KOORDINATALAR TEKISLIGI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 33-dars raskladkasi: build, choice, fix, chain, build, order, bracket, build, sort, slots
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D33_01 from './D33_01.jsx';
import D33_02 from './D33_02.jsx';
import D33_03 from './D33_03.jsx';
import D33_04 from './D33_04.jsx';
import D33_05 from './D33_05.jsx';
import D33_06 from './D33_06.jsx';
import D33_07 from './D33_07.jsx';
import D33_08 from './D33_08.jsx';
import D33_09 from './D33_09.jsx';
import D33_10 from './D33_10.jsx';

const HEAD = {
  uz: 'Dars 33 amaliyoti — 10 topshiriq (koordinatalar tekisligi)',
  ru: 'Практика урока 33 — 10 заданий (координатная плоскость)',
  en: 'Lesson 33 practice — 10 tasks (the coordinate plane)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Nuqtaning yozuvi', ru: 'Запись точки', en: 'Writing a point' }, C: D33_01 },  // build 🟢 point_write
  { id: '02', label: { uz: 'Nuqta qayerda', ru: 'Где точка', en: 'Where the point is' }, C: D33_02 },  // choice 🟢 point_where
  { id: '03', label: { uz: "y o'qi", ru: 'Ось y', en: 'The y axis' }, C: D33_03 },  // fix 🟢 axis_fix
  { id: '04', label: { uz: 'Ikki qadam', ru: 'Два шага', en: 'Two steps' }, C: D33_04 },  // chain 🟡 point_chain
  { id: '05', label: { uz: 'Kesma uzunligi', ru: 'Длина отрезка', en: 'Length of a segment' }, C: D33_05 },  // build 🟡 point_distance
  { id: '06', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D33_06 },  // order 🟡 point_order
  { id: '07', label: { uz: "O'qdagi nuqta", ru: 'Точка на оси', en: 'A point on an axis' }, C: D33_07 },  // bracket 🟡 point_on_axis
  { id: '08', label: { uz: "To'rtinchi uch", ru: 'Четвёртая вершина', en: 'The fourth vertex' }, C: D33_08 },  // build 🔴 point_fourth
  { id: '09', label: { uz: 'Uch chorak', ru: 'Три четверти', en: 'Three quadrants' }, C: D33_09 },  // sort 🔴 quadrant_zones
  { id: '10', label: { uz: "Kesmaning o'rtasi", ru: 'Середина отрезка', en: 'Midpoint' }, C: D33_10 },  // slots 🔴 point_middle
];

export default function Dars33Practice({ lang = 'uz' }) {
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
