// Dars05 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: burchak usulida bo'lish, qoldiqli bo'lish.
// Darslik §14 (bo'lish) va §15 (qoldiqli bo'lish) mashqlariga asoslangan.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
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

// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Maslahatsiz. Darslik §14-15.
const ITEMS = [
  { id: '01', label: '1 · Hisobla', C: D05_01 },      // simple_div 🟢 (75:3)
  { id: '02', label: '2 · Qoldiqsizmi', C: D05_02 },  // divides_evenly 🟢
  { id: '03', label: '3 · Уголок :', C: D05_03 },     // long_div 🟡 (3080:5)
  { id: '04', label: '4 · Уголок :', C: D05_04 },     // long_div 🟡 (1072:8)
  { id: '05', label: '5 · Xato top', C: D05_05 },     // div_check 🟡
  { id: '06', label: '6 · Qoldiq', C: D05_06 },       // remainder_possible 🟡
  { id: '07', label: "7 · Bo'linma", C: D05_07 },     // long_div_input 🔴 (15655:31)
  { id: '08', label: "8 · To'liq quti", C: D05_08 },    // remainder_context 🔴 (50:8)
  { id: '09', label: '9 · Topishmoq', C: D05_09 },    // clue_dividend 🔴 (781)
  { id: '10', label: '10 · Daftar narxi', C: D05_10 },   // word_two_step 🔴 (9900:55)
];

export default function Dars05Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'),
    background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif", whiteSpace: 'nowrap',
  });

  return (
    <div className="pq-fixroot" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff;display:flex;flex-direction:column;zoom:var(--pqz,1);}
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 5 amaliyoti — 10 topshiriq (burchak usulida bo'lish)</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <PracticeHost key={q.id} Question={q.C} />
      </div>
    </div>
  );
}
