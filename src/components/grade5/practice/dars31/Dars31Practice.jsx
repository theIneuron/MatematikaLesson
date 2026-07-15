// Dars31 amaliyoti — 10 topshiriq. Mavzu: sondan foiz topish va chegirma.
// Formula: N% dan A = (A : 100) × N. Chegirma = narx × foiz : 100; yakuniy narx = narx − chegirma.
// Imzo-mexanika = "chegirma tasmasi" (0..100% bar, foiz belgilanganda miqdor sekin to'ladi va sanaladi).
// Markaziy xato: foizni 100 ga bo'lishni unutish (20 × 1200 = 24000). Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D31_01 from './D31_01.jsx';
import D31_02 from './D31_02.jsx';
import D31_03 from './D31_03.jsx';
import D31_04 from './D31_04.jsx';
import D31_05 from './D31_05.jsx';
import D31_06 from './D31_06.jsx';
import D31_07 from './D31_07.jsx';
import D31_08 from './D31_08.jsx';
import D31_09 from './D31_09.jsx';
import D31_10 from './D31_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · 10% i', C: D31_01 },          // 🟢 MCQ 200 ning 10% (of_ten)
  { id: '02', label: '2 · Yarmi', C: D31_02 },          // 🟢 bo'sh katak 60 ning 50% (of_half)
  { id: '03', label: "3 · Ha/Yo'q", C: D31_03 },        // 🟢 80 ning 25% = 20? (of_quarter)
  { id: '04', label: '4 · Chegirma', C: D31_04 },       // 🟡 bo'sh katak 1200×20% arzonlashuv (of_discount_amount)
  { id: '05', label: '5 · Moslash', C: D31_05 },        // 🟡 500 dan foizlar moslash (of_match)
  { id: '06', label: '6 · Tasma', C: D31_06 },          // 🟡 slider 200 ning 35% (of_slider)
  { id: '07', label: '7 · Xatoni top', C: D31_07 },     // 🔴 20×1200=24000 xato (of_error)
  { id: '08', label: '8 · Masala', C: D31_08 },         // 🔴 240000−20% yakuniy narx (of_final_price)
  { id: '09', label: '9 · Belgila', C: D31_09 },        // 🔴 tasmada marker 400 ning 15% (of_arbitrary_mark)
  { id: '10', label: "10 · Qaysi ko'p", C: D31_10 },    // 🔴 MCQ 25%·80 vs 30%·60 (of_compare)
];

export default function Dars31Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#db2777' : '#d6dae3'),
    background: active ? '#db2777' : '#fff', color: active ? '#fff' : '#374151',
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 31 amaliyoti — 10 topshiriq (sondan foiz topish va chegirma)</strong>
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
