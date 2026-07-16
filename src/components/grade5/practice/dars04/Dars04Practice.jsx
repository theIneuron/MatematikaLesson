// Dars04 amaliyoti — 10 topshiriq. Mavzu: ustun shaklida ko'paytirish.
// Har topshiriq UNIKAL mexanika + unikal animatsiya. Qahramonlar: Bekzod, Madina, Nilufar, Sardor.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D04_01 from './D04_01.jsx';
import D04_02 from './D04_02.jsx';
import D04_03 from './D04_03.jsx';
import D04_04 from './D04_04.jsx';
import D04_05 from './D04_05.jsx';
import D04_06 from './D04_06.jsx';
import D04_07 from './D04_07.jsx';
import D04_08 from './D04_08.jsx';
import D04_09 from './D04_09.jsx';
import D04_10 from './D04_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: '1 · Savatlar', C: D04_01 },            // sum_to_product 🟢 (4×5)
  { id: '02', label: "2 · Og'zaki", C: D04_02 },            // simple_product 🟢 (25×4)
  { id: '03', label: "3 · O'rin almashtirish", C: D04_03 }, // commutative 🟡 (6×8)
  { id: '04', label: "4 · Yo'qolgan son", C: D04_04 },      // missing_factor 🟡 (125×8)
  { id: '05', label: '5 · Natijani top', C: D04_05 },       // product_input 🟡 (37×59)
  { id: '06', label: '6 · Ombor', C: D04_06 },              // word_product 🟡 (24×15)
  { id: '07', label: '7 · Qulay usul', C: D04_07 },         // qulay_mul 🔴 (25×4×815)
  { id: '08', label: "8 · Katta ko'paytma", C: D04_08 },    // column_mul_big 🔴 (872×314)
  { id: '09', label: '9 · Moslash', C: D04_09 },            // match_product 🔴
  { id: '10', label: '10 · Ixchamlash', C: D04_10 },        // distributive 🔴 (231×4+35)
];

export default function Dars04Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 4 amaliyoti — 10 topshiriq (ustun shaklida ko'paytirish)</strong>
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
