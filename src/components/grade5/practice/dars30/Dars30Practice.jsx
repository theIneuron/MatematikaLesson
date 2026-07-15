// Dars30 amaliyoti — 10 topshiriq. Mavzu: foiz tushunchasi (foiz = yuzdan ulush).
// Dastur: foiz — butunning yuzdan ulushi; N% = N/100; foiz↔kasr↔o'nli bog'lanishi.
// Hero mexanika = "yuz katak" (10×10 = 100 katak) sekin bo'yaladigan kvadrat.
// Markaziy g'oyalar: 50%=1/2, 25%=1/4, 10%=1/10, 100%=butun; NISBIYLIK (bir xil % har xil miqdor).
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D30_01 from './D30_01.jsx';
import D30_02 from './D30_02.jsx';
import D30_03 from './D30_03.jsx';
import D30_04 from './D30_04.jsx';
import D30_05 from './D30_05.jsx';
import D30_06 from './D30_06.jsx';
import D30_07 from './D30_07.jsx';
import D30_08 from './D30_08.jsx';
import D30_09 from './D30_09.jsx';
import D30_10 from './D30_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Yarmi qaysi kasr', C: D30_01 },   // 🟢 MCQ 50%=1/2
  { id: '02', label: '2 · Necha foiz', C: D30_02 },         // 🟢 bo'sh katak grid=30 → 30
  { id: '03', label: '3 · Chorak mi', C: D30_03 },          // 🟢 Ha/Yo'q 25%=1/4
  { id: '04', label: '4 · Foizni kasrga', C: D30_04 },      // 🟡 moslash 50/25/10/100%
  { id: '05', label: '5 · Kasrni foizga', C: D30_05 },      // 🟡 bo'sh katak 1/4 → 25
  { id: '06', label: "6 · 40% ni bo'yang", C: D30_06 },     // 🟡 konstruktor grid → 40
  { id: '07', label: '7 · Xatoni top', C: D30_07 },         // 🔴 5%=1/5 xato
  { id: '08', label: "8 · Qaysida ko'proq", C: D30_08 },    // 🔴 MCQ nisbiylik powerbank
  { id: '09', label: '9 · Tartibla', C: D30_09 },           // 🔴 25%·1/2·0,25·60%
  { id: '10', label: "10 · O'nlini foizga", C: D30_10 },    // 🔴 bo'sh katak 0,7 → 70
];

export default function Dars30Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#4f46e5' : '#d6dae3'),
    background: active ? '#4f46e5' : '#fff', color: active ? '#fff' : '#374151',
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 30 amaliyoti — 10 topshiriq (foiz tushunchasi)</strong>
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
