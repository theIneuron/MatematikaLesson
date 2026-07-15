// Dars07 amaliyoti — 10 topshiriq. Mavzu: butun sonlarni taqqoslash, qarama-qarshi sonlar.
// Qahramonlar: Bekzod, Madina, Nilufar, Sardor, Aziza.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D07_01 from './D07_01.jsx';
import D07_02 from './D07_02.jsx';
import D07_03 from './D07_03.jsx';
import D07_04 from './D07_04.jsx';
import D07_05 from './D07_05.jsx';
import D07_06 from './D07_06.jsx';
import D07_07 from './D07_07.jsx';
import D07_08 from './D07_08.jsx';
import D07_09 from './D07_09.jsx';
import D07_10 from './D07_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Aldov (trap) variantlar bilan.
const ITEMS = [
  { id: '01', label: '1 · Qarama-qarshi', C: D07_01 },  // qarama-qarshi son 🟢 opposite (7→-7)
  { id: '02', label: '2 · Ishora', C: D07_02 },         // ishorani almashtir 🟢 opposite_sign
  { id: '03', label: '3 · Taqqoslash', C: D07_03 },     // manfiy vs musbat 🟡 compare_neg_pos (-13<6)
  { id: '04', label: '4 · Kim balandroq', C: D07_04 },  // ikki manfiy 🟡 compare_two_neg (-11>-17)
  { id: '05', label: '5 · Nol qoidasi', C: D07_05 },    // nol qoidasi 🟡 zero_rule (0>-3)
  { id: '06', label: '6 · Qarshisini top', C: D07_06 }, // manfiyning aksi 🟡 opposite_of_neg (-12→12)
  { id: '07', label: '7 · Tartibla', C: D07_07 },       // butun sonlarni tartiblash 🔴 order_integers
  { id: '08', label: '8 · Xatoni top', C: D07_08 },     // qarama-qarshi xatosi 🔴 opposite_error (4→-4)
  { id: '09', label: '9 · Eng sovuq', C: D07_09 },      // eng kichik harorat 🔴 temp_coldest (-14)
  { id: '10', label: '10 · Ikki karra', C: D07_10 },    // ikki karra aks 🔴 opposite_double
];

export default function Dars07Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 7 amaliyoti — 10 topshiriq (butun sonlarni taqqoslash, qarama-qarshi sonlar)</strong>
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
