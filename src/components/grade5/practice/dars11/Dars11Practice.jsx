// Dars11 amaliyoti — 10 topshiriq. Mavzu: kasr — bo'lish natijasi (a:b = a/b).
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D11_01 from './D11_01.jsx';
import D11_02 from './D11_02.jsx';
import D11_03 from './D11_03.jsx';
import D11_04 from './D11_04.jsx';
import D11_05 from './D11_05.jsx';
import D11_06 from './D11_06.jsx';
import D11_07 from './D11_07.jsx';
import D11_08 from './D11_08.jsx';
import D11_09 from './D11_09.jsx';
import D11_10 from './D11_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Tartib aralashtirilgan (bundle TASKS): oson→qiyin galma-gal.
const ITEMS = [
  { id: '01', label: "1 · Bo'lish → kasr", C: D11_01 },     // div_as_fraction 🟢 (4:5→4/5)
  { id: '04', label: '2 · Kunlik ulush', C: D11_04 },       // per_day 🟡 (18/7 kasr-input)
  { id: '07', label: '3 · Tezlik kasri', C: D11_07 },       // speed_fraction 🔴 (2/35 kasr-input)
  { id: '02', label: "4 · Kasr → bo'lish", C: D11_02 },     // fraction_as_div 🟢 (3/7→3:7)
  { id: '06', label: '5 · Natural son', C: D11_06 },        // natural_as_fraction 🟡 (4→24/6)
  { id: '09', label: "6 · To'rtburchak tomoni", C: D11_09 },// rectangle_side 🔴 (19/7)
  { id: '03', label: "7 · Teng bo'lish", C: D11_03 },       // sharing 🟡 (5 bola 4 olma)
  { id: '10', label: "8 · Yig'indi bo'lish", C: D11_10 },   // sum_div_rule 🔴 ((15+9+6):3=10)
  { id: '05', label: "9 · Bo'lishni hisobla", C: D11_05 },  // div_compute 🟡 (12/4=3)
  { id: '08', label: '10 · Perimetr tomoni', C: D11_08 },   // perimeter_side 🔴 (7/4 kasr-input)
];

export default function Dars11Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 11 amaliyoti — 10 topshiriq (kasr — bo'lish natijasi)</strong>
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
