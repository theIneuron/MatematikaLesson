// Dars06 amaliyoti — 10 topshiriq. Mavzu: manfiy sonlar son o'qida.
// Har topshiriq UNIKAL mexanika + animatsiya. Tartib aralashtirilgan.
// Qahramonlar: Bekzod, Madina, Nilufar, Sardor.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D06_01 from './D06_01.jsx';
import D06_02 from './D06_02.jsx';
import D06_03 from './D06_03.jsx';
import D06_04 from './D06_04.jsx';
import D06_05 from './D06_05.jsx';
import D06_06 from './D06_06.jsx';
import D06_07 from './D06_07.jsx';
import D06_08 from './D06_08.jsx';
import D06_09 from './D06_09.jsx';
import D06_10 from './D06_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Tartib aralashtirilgan (bundle TASKS): oson/o'rta/qiyin navbatma-navbat.
const ITEMS = [
  { id: '01', label: '1 · Termometr', C: D06_01 },     // read_temp 🟢
  { id: '04', label: '2 · Taqqoslash', C: D06_04 },    // compare_neg 🟡
  { id: '08', label: '3 · Chuqurlik', C: D06_08 },     // depth_diff 🔴
  { id: '02', label: '4 · Manfiy son', C: D06_02 },    // pick_negative 🟢
  { id: '06', label: '5 · Lift', C: D06_06 },          // bank_negative 🟡
  { id: '10', label: '6 · Qaysi katta', C: D06_10 },   // bias_compare 🔴
  { id: '03', label: "7 · Son o'qi", C: D06_03 },      // numberline_place 🟡
  { id: '09', label: '8 · Oraliq', C: D06_09 },        // between_count 🔴
  { id: '05', label: '9 · Harorat', C: D06_05 },       // temp_change 🟡
  { id: '07', label: '10 · Tartibla', C: D06_07 },     // min_negative 🔴
];

export default function Dars06Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 6 amaliyoti — 10 topshiriq (manfiy sonlar son o'qida)</strong>
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
