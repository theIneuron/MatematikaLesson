// Dars04 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: ustun shaklida ko'paytirish.
// Darslik §13 (ko'paytirish va uning xossalari) mashqlariga asoslangan.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
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

// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Maslahatsiz. Darslik §13.
const ITEMS = [
  { id: '01', label: "1 · Ko'paytma", C: D04_01 },   // sum_to_product 🟢 (18×5)
  { id: '02', label: '2 · Hisobla', C: D04_02 },     // simple_product 🟢 (25×4)
  { id: '03', label: '3 · Столбик ×', C: D04_03 },   // column_mul 🟡 (854×6)
  { id: '04', label: '4 · Столбик ×', C: D04_04 },   // column_mul 🟡 (125×8)
  { id: '05', label: "5 · Ko'paytma", C: D04_05 },   // product_input 🟡 (37×59)
  { id: '06', label: '6 · Sharbat', C: D04_06 },     // word_product 🟡 (24×15)
  { id: '07', label: '7 · Qulay ×', C: D04_07 },     // qulay_mul 🔴 (25×(4×815))
  { id: '08', label: '8 · Uch xonali', C: D04_08 },  // column_mul_big 🔴 (872×314)
  { id: '09', label: '9 · Xato top', C: D04_09 },    // product_check 🔴
  { id: '10', label: '10 · Ixchamlash', C: D04_10 }, // distributive 🔴 (231×4+35)
];

export default function Dars04Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 4 amaliyoti — 10 topshiriq (ustun shaklida ko'paytirish)</strong>
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
