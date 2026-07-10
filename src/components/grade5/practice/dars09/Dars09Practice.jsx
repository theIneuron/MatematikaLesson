// Dars09 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: kasr nima (butunning qismi).
// Darslik §27 (Ulushlar. Oddiy kasrlar) mashqlariga asoslangan.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
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

// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Maslahatsiz.
const ITEMS = [
  { id: '01', label: "1 · O'qish", C: D09_01 },       // read_fraction 🟢 (5/6)
  { id: '02', label: '2 · Maxraj', C: D09_02 },       // surat_maxraj 🟢 (3/4)
  { id: '03', label: "3 · Bo'yash", C: D09_03 },      // shade_fraction 🟡 (3/4 interaktiv)
  { id: '04', label: '4 · Surat', C: D09_04 },        // surat_meaning 🟡
  { id: '05', label: '5 · Kitob', C: D09_05 },        // part_of_book 🟡 (320×3/8=120)
  { id: '06', label: "6 · Bo'yalmagan", C: D09_06 },  // unshaded_fraction 🟡 (5/8)
  { id: '07', label: '7 · Soat', C: D09_07 },         // time_fraction 🔴 (3/4 soat=45)
  { id: '08', label: '8 · Quymoq', C: D09_08 },       // remaining_quymoq 🔴 (4)
  { id: '09', label: '9 · Hovuz', C: D09_09 },        // pool_fraction 🔴 (5/7)
  { id: '10', label: '10 · Qolgan', C: D09_10 },      // book_remaining 🔴 (200)
];

export default function Dars09Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 9 amaliyoti — 10 topshiriq (kasr nima)</strong>
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
