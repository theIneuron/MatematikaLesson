// Dars13 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: bir xil suratli kasrlarni taqqoslash.
// Dastur: urok 5.2 — frac_5_05. Markaziy misconception M1 (whole-number bias): "1/4 > 1/2, chunki 4 > 2".
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D13_01 from './D13_01.jsx';
import D13_02 from './D13_02.jsx';
import D13_03 from './D13_03.jsx';
import D13_04 from './D13_04.jsx';
import D13_05 from './D13_05.jsx';
import D13_06 from './D13_06.jsx';
import D13_07 from './D13_07.jsx';
import D13_08 from './D13_08.jsx';
import D13_09 from './D13_09.jsx';
import D13_10 from './D13_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Qiyinlik: 4 oson (01–04) · 4 o'rta (05–08) · 2 qiyin (09,10). Aldov (trap) variantlar bilan.
const ITEMS = [
  { id: '01', label: "1 · Bo'lak", C: D13_01 },       // qaysi bo'lak katta 🟢 compare_same_num
  { id: '02', label: '2 · Belgi', C: D13_02 },        // belgi qo'y 🟢 sign_choice (3/5 > 3/8)
  { id: '03', label: '3 · Qoida', C: D13_03 },        // to'g'ri gap 🟢 true_statement
  { id: '04', label: '4 · Tort', C: D13_04 },         // syujetli taqqoslash 🟢 story_compare
  { id: '05', label: '5 · Juftlash', C: D13_05 },     // bo'laklarni juftlash 🟡 match_piece
  { id: '06', label: '6 · Tartib', C: D13_06 },       // o'sish tartibi 🟡 order_asc
  { id: '07', label: '7 · Eng kichik', C: D13_07 },   // eng kichik kasr 🟡 smallest_greater
  { id: '08', label: '8 · Xato', C: D13_08 },         // xatoni top 🟡 find_error
  { id: '09', label: '9 · Daler', C: D13_09 },        // ishoralardan kasr 🔴 two_sided_constraint
  { id: '10', label: '10 · Poyga', C: D13_10 },       // poyga 🔴 race_compare
];

export default function Dars13Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 13 amaliyoti — 10 topshiriq (bir xil suratli kasrlar)</strong>
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
