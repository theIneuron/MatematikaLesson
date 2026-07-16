// Dars12 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: bir xil maxrajli kasrlarni taqqoslash.
// Dastur: urok 5.1 — frac_5_04. Daraja: 4 * 🟢 / 4 * 🟡 / 2 * 🔴.
// Qahramonlar: Nodira, Daler, Malika, Farrux.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
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

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Barcha topshiriqlar bir xil maxrajli kasrlarni taqqoslashga asoslangan.
// Qiyinlik: 4 oson (01–04) · 4 o'rta (05–08) · 2 qiyin (09–10).
const ITEMS = [
  { id: '01', label: "1 · Kimniki ko'p", C: D12_01 },  // compare_same_denom 🟢
  { id: '02', label: '2 · Belgi', C: D12_02 },         // sign_choice 🟢
  { id: '03', label: '3 · Chiziq', C: D12_03 },        // visual_compare 🟢
  { id: '04', label: '4 · Sharbat', C: D12_04 },       // story_compare 🟢
  { id: '05', label: "5 · Bo'yash", C: D12_05 },       // shade_compare 🟡
  { id: '06', label: '6 · Tartib', C: D12_06 },        // order_asc 🟡
  { id: '07', label: '7 · Eng katta', C: D12_07 },     // largest_less 🟡
  { id: '08', label: '8 · Xato', C: D12_08 },          // find_error 🟡
  { id: '09', label: '9 · Malika', C: D12_09 },        // two_sided_constraint 🔴
  { id: '10', label: '10 · Nechta', C: D12_10 },       // count_between 🔴
];

export default function Dars12Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 12 amaliyoti — 10 topshiriq (bir xil maxrajli kasrlarni taqqoslash)</strong>
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
