// Dars14 amaliyoti — 10 topshiriq. Mavzu: har xil maxrajli kasrlarni taqqoslash (intuitiv).
// Usul: bir xil ulushga (umumiy ulush) keltirish + 1/2 benchmark + vizual. Formal qoidasiz.
// Qahramonlar: Javohir, Umid, Sabina (nazariya darsidan).
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D14_01 from './D14_01.jsx';
import D14_02 from './D14_02.jsx';
import D14_03 from './D14_03.jsx';
import D14_04 from './D14_04.jsx';
import D14_05 from './D14_05.jsx';
import D14_06 from './D14_06.jsx';
import D14_07 from './D14_07.jsx';
import D14_08 from './D14_08.jsx';
import D14_09 from './D14_09.jsx';
import D14_10 from './D14_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Aldov (trap) variantlar bilan.
const ITEMS = [
  { id: '01', label: '1 · Belgi (teng maxraj)', C: D14_01 },  // 🟢 same_denom_sign (3/8 < 5/8)
  { id: '02', label: '2 · Lenta solishtirish', C: D14_02 },   // 🟢 same_num_bars (1/2 > 1/3)
  { id: '03', label: '3 · Umumiy ulush', C: D14_03 },         // 🟡 common_units_fill (1/2=3/6, 2/3=4/6)
  { id: '04', label: '4 · 1/2 bilan', C: D14_04 },            // 🟡 half_benchmark
  { id: '05', label: '5 · Moslash', C: D14_05 },              // 🟡 match_size
  { id: '06', label: '6 · Doira solishtirish', C: D14_06 },   // 🟡 pie_compare (2/3 < 3/4)
  { id: '07', label: '7 · Tartibga solish', C: D14_07 },      // 🔴 order_asc
  { id: '08', label: '8 · Xatoni top', C: D14_08 },           // 🔴 find_wrong
  { id: '09', label: "9 · Umumiy ulush + o'q", C: D14_09 },   // 🔴 common_units_axis
  { id: '10', label: '10 · Aldanmang', C: D14_10 },           // 🔴 trap_numerator
];

export default function Dars14Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 14 amaliyoti — 10 topshiriq (kasrlarni taqqoslash)</strong>
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
