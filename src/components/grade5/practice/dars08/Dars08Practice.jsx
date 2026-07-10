// Dars08 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: sonning darajasi, kvadrat va kub.
// Darslik §18 (Sonning darajasi. Kvadrati va kubi) mashqlariga asoslangan.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
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

// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Maslahatsiz.
const ITEMS = [
  { id: '01', label: '1 · Kvadrat', C: D08_01 },       // square_simple 🟢 (5²=25)
  { id: '02', label: '2 · Daraja shakli', C: D08_02 }, // write_as_power 🟢 (5⁵)
  { id: '03', label: '3 · Kub', C: D08_03 },           // cube_input 🟡 (4³=64)
  { id: '04', label: '4 · Kvadrat', C: D08_04 },       // square_input 🟡 (12²=144)
  { id: '05', label: '5 · Xato top', C: D08_05 },      // find_wrong_power 🟡 (6²≠12)
  { id: '06', label: '6 · Atama', C: D08_06 },         // read_power 🟡 (ko'rsatkich)
  { id: '07', label: '7 · Kub', C: D08_07 },  // order_ops 🔴 ((3+5)²=64)
  { id: '08', label: '8 · Kvadrat', C: D08_08 },  // order_ops2 🔴 (5+6²=41)
  { id: '09', label: '9 · Qaysi katta', C: D08_09 },   // power_vs_power 🔴 (3²>2³)
  { id: '10', label: '10 · Hajm', C: D08_10 },         // cube_context 🔴 (5³=125)
];

export default function Dars08Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 8 amaliyoti — 10 topshiriq (daraja, kvadrat va kub)</strong>
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
