// Dars10 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: kasr son o'qida.
// Darslik §27 (kasrni son o'qida nuqta sifatida tasvirlash) mashqlariga asoslangan.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
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

// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Maslahatsiz.
const ITEMS = [
  { id: '01', label: "1 · Nuqta", C: D10_01 },        // read_point 🟢 (3/4)
  { id: '02', label: "2 · Bo'linma", C: D10_02 },     // denom_parts 🟢 (1/5→5)
  { id: '03', label: '3 · Belgila', C: D10_03 },      // place_fraction 🟡 (3/4 interaktiv)
  { id: '04', label: '4 · Noto\'g\'ri', C: D10_04 },  // read_improper 🟡 (3/2)
  { id: '05', label: '5 · Orasida', C: D10_05 },      // between_integers 🟡 (7/4)
  { id: '06', label: '6 · Ulush', C: D10_06 },        // denom_meaning 🟡 (1/6)
  { id: '07', label: '7 · Yaqin butun', C: D10_07 },      // equivalent_point 🔴 (2/4=1/2)
  { id: '08', label: '8 · Belgila', C: D10_08 },      // place_improper 🔴 (3/2 interaktiv)
  { id: '09', label: "9 · Eng o'ngda", C: D10_09 },    // farthest_right 🔴 (5/8)
  { id: '10', label: '10 · Nechta', C: D10_10 },      // count_units 🔴 (3)
];

export default function Dars10Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 10 amaliyoti — 10 topshiriq (kasr son o'qida)</strong>
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
