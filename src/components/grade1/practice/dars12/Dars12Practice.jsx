// Dars12 amaliyoti — 10 topshiriq (tenglik, tengsizlik va qavslar): =, >, < + qavs-ichi-avval.
// Kuchaytirilgan ramp: 1🟢 / 3🟡 / 6🔴. Timsohlar ko'li syujeti (og'iz = taqqoslash belgisi).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D12_01 from './D12_01.jsx';
import D12_02 from './D12_02.jsx';
import D12_03 from './D12_03.jsx';
import D12_04 from './D12_04.jsx';
import D12_05 from './D12_05.jsx';
import D12_06 from './D12_06.jsx';
import D12_07 from './D12_07.jsx';
import D12_08 from './D12_08.jsx';
import D12_09 from './D12_09.jsx';
import D12_10 from './D12_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Taqqoslash', C: D12_01 }, // P4 · 6 vs 4, timsoh — Dars04 spirali 🟢
  { id: '02', label: '2 · Belgi', C: D12_02 },      // P4 · 7 ▢ 5 — belgi tanla 🟡
  { id: '03', label: '3 · Hisobla', C: D12_03 },    // P4 · 3+2 ▢ 4 — avval hisobla 🟡
  { id: '04', label: '4 · To\'g\'rimi', C: D12_04 },// P4 · «5 > 8» to'g'rimi? 🟡
  { id: '05', label: '5 · Qavs', C: D12_05 },       // P4 · (3+2) ▢ 4 — qavs avval 🔴
  { id: '06', label: '6 · Zanjir', C: D12_06 },     // P4 · 4 juft belgi: 6>4, 3<5, 7=7, 8>2 🔴
  { id: '07', label: '7 · Tartib', C: D12_07 },     // LOGIC · tartiblash 7,3,5 → 3<5<7 🔴
  { id: '08', label: '8 · Yozuvlar', C: D12_08 },   // P4 · to'g'ri yozuvlar multi (tuzoq) 🔴
  { id: '09', label: '9 · Ikki qavs', C: D12_09 },  // P4 · (2+3) ▢ (4+1) — teng 🔴
  { id: '10', label: '10 · Qavs qutisi', C: D12_10 }, // YANGI · qavs ichini o'zi hisoblab taqqoslaydi 🔴
];

export default function Dars12Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 12 amaliyoti — 10 topshiriq (tenglik, tengsizlik va qavslar)</strong>
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
