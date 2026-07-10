// Dars06 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: manfiy sonlar son o'qida.
// Manba: 6-sinf «Butun sonlar» + 5-sinf konteksti (harorat, dengiz sathi, bank kartasi).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
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

// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Maslahatsiz.
const ITEMS = [
  { id: '01', label: '1 · Termometr', C: D06_01 },    // read_temp 🟢
  { id: '02', label: '2 · Manfiy son', C: D06_02 },   // pick_negative 🟢
  { id: '03', label: "3 · Son o'qi", C: D06_03 },     // numberline_place 🟡 (interaktiv)
  { id: '04', label: '4 · Taqqoslash', C: D06_04 },   // compare_neg 🟡 (-5<-3)
  { id: '05', label: '5 · Isidimi', C: D06_05 },      // temp_change 🟡
  { id: '06', label: '6 · Karta', C: D06_06 },        // bank_negative 🟡
  { id: '07', label: '7 · Eng kichik', C: D06_07 },   // min_negative 🔴
  { id: '08', label: '8 · Chuqurlik', C: D06_08 },    // depth_diff 🔴 (input)
  { id: '09', label: '9 · Oradagi', C: D06_09 },      // between_count 🔴
  { id: '10', label: '10 · Qaysi katta', C: D06_10 }, // bias_compare 🔴 (-1>-10)
];

export default function Dars06Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 6 amaliyoti — 10 topshiriq (manfiy sonlar son o'qida)</strong>
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
