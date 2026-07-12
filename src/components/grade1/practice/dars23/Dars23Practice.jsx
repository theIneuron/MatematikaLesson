// Dars23 amaliyoti — 10 topshiriq (sanoq ketma-ketligi): 5 lab va 10 lab sanash, oldinga va orqaga.
// Xilma-xil format: keyingi son, yashirin son, zanjir, qadamni top (mantiq), multi, orqaga, masala, interaktiv sakrash.
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bog'i + quyon (tile-track bo'ylab sakraydi) syujeti. Sonlar 5–100 (5/10 lab).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D23_01 from './D23_01.jsx';
import D23_02 from './D23_02.jsx';
import D23_03 from './D23_03.jsx';
import D23_04 from './D23_04.jsx';
import D23_05 from './D23_05.jsx';
import D23_06 from './D23_06.jsx';
import D23_07 from './D23_07.jsx';
import D23_08 from './D23_08.jsx';
import D23_09 from './D23_09.jsx';
import D23_10 from './D23_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 10 lab', C: D23_01 },     // skip10 · 10,20,30,40,?→50 🟢
  { id: '02', label: '2 · 5 lab', C: D23_02 },      // skip5 · 5,10,15,20,?→25 🟡
  { id: '03', label: '3 · Yashirin', C: D23_03 },   // skip10 · 20,30,?,50,60→40 🟡
  { id: '04', label: '4 · 5 lab', C: D23_04 },      // skip5 · 15,20,?,30,35→25 🟡
  { id: '05', label: '5 · Zanjir', C: D23_05 },     // skip_chain · 4 qator (oldinga/orqaga) 🔴
  { id: '06', label: '6 · Qadam', C: D23_06 },      // LOGIC step · 20,30,40,50→qadam 10 (yangi) 🔴
  { id: '07', label: '7 · Orqaga', C: D23_07 },     // skip10_back · 60,50,40,?,20→30 🔴
  { id: '08', label: '8 · 10 lab', C: D23_08 },     // skip_multi · 10 lab barcha son 🔴
  { id: '09', label: '9 · Masala', C: D23_09 },     // skip_word · quyon 10 lab 3 marta→30 🔴
  { id: '10', label: '10 · Sakra', C: D23_10 },     // YANGI perform_skip · «Quyonni sakrating» 25 🔴
];

export default function Dars23Practice() {
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
      {/* MOBIL_DESKTOP_MOSLASH.md naqshi: fixed root — body-skroll yo'q, tugma joyida;
          <640px da layout 390px etalon + zoom bilan real ekranga masshtablanadi. */}
      <style>{`
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff;display:flex;flex-direction:column;zoom:var(--pqz,1);}
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 23 amaliyoti — 10 topshiriq (sanoq ketma-ketligi: 5 lab va 10 lab)</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <PracticeHost key={q.id} Question={q.C} />
      </div>
    </div>
  );
}
