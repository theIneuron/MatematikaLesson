// Dars05 amaliyoti — 10 topshiriq. Mavzu: bo'lish va qoldiqli bo'lish.
// Har topshiriq UNIKAL mexanika + animatsiya. Tartib aralashtirilgan.
// Qahramonlar: Bekzod, Madina, Nilufar, Sardor.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D05_01 from './D05_01.jsx';
import D05_02 from './D05_02.jsx';
import D05_03 from './D05_03.jsx';
import D05_04 from './D05_04.jsx';
import D05_05 from './D05_05.jsx';
import D05_06 from './D05_06.jsx';
import D05_07 from './D05_07.jsx';
import D05_08 from './D05_08.jsx';
import D05_09 from './D05_09.jsx';
import D05_10 from './D05_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg. Tartib aralashtirilgan.
const ITEMS = [
  { id: '01', label: "1 · Teng ulash", C: D05_01 },        // simple_div 🟢 (96 : 4)
  { id: '04', label: '2 · Qanday qoldiq', C: D05_04 },     // remainder_possible 🟡
  { id: '08', label: '3 · Ikki amal', C: D05_08 },         // word_two_step 🔴
  { id: '02', label: '4 · Qoldiqsizmi', C: D05_02 },       // divides_evenly 🟢
  { id: '06', label: '5 · Burchakda', C: D05_06 },         // long_div 🟡 (3080 : 5)
  { id: '10', label: '6 · Qoldiqni moslash', C: D05_10 },  // remainder_match 🔴
  { id: '03', label: '7 · Tekshirish', C: D05_03 },        // div_check 🟡
  { id: '09', label: "8 · Bo'linuvchi", C: D05_09 },       // clue_dividend 🔴 (781)
  { id: '05', label: '9 · Masala', C: D05_05 },            // remainder_context 🟡 (50 : 8)
  { id: '07', label: "10 · Katta bo'lish", C: D05_07 },    // long_div_input 🔴 (6489 : 7)
];

export default function Dars05Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 5 amaliyoti — 10 topshiriq (bo'lish va qoldiqli bo'lish)</strong>
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
