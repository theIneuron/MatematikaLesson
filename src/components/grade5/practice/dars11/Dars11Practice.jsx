// Dars11 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: kasr — bo'lish natijasi (a:b = a/b).
// Darslik §31 (Bo'lish va kasrlar) mashqlariga asoslangan. Topshiriqlar animatsiyali.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D11_01 from './D11_01.jsx';
import D11_02 from './D11_02.jsx';
import D11_03 from './D11_03.jsx';
import D11_04 from './D11_04.jsx';
import D11_05 from './D11_05.jsx';
import D11_06 from './D11_06.jsx';
import D11_07 from './D11_07.jsx';
import D11_08 from './D11_08.jsx';
import D11_09 from './D11_09.jsx';
import D11_10 from './D11_10.jsx';

// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Maslahatsiz.
const ITEMS = [
  { id: '01', label: '1 · Kasrga', C: D11_01 },        // div_as_fraction 🟢 (4:5→4/5)
  { id: '02', label: "2 · Bo'linmaga", C: D11_02 },    // fraction_as_div 🟢 (3/7→3:7)
  { id: '03', label: '3 · Taqsimlash', C: D11_03 },    // sharing 🟡 (5 bola 4 olma)
  { id: '04', label: '4 · Kunlik non', C: D11_04 },    // per_day 🟡 (18/7 kasr-input)
  { id: '05', label: '5 · Qiymati', C: D11_05 },       // div_compute 🟡 (12/4=3)
  { id: '06', label: '6 · Kasr shaklida', C: D11_06 }, // natural_as_fraction 🟡 (4→24/6)
  { id: '07', label: '7 · Tezlik', C: D11_07 },        // speed_fraction 🔴 (2/35 kasr-input)
  { id: '08', label: '8 · Kvadrat', C: D11_08 },       // perimeter_side 🔴 (7/4 kasr-input)
  { id: '09', label: '9 · Tomon', C: D11_09 },         // rectangle_side 🔴 (19/7)
  { id: '10', label: "10 · Yig'indi", C: D11_10 },     // sum_div_rule 🔴 ((15+9+6):3=10)
];

export default function Dars11Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 11 amaliyoti — 10 topshiriq (kasr — bo'lish natijasi)</strong>
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
