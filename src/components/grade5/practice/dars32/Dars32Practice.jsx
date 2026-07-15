// Dars32 amaliyoti — 10 topshiriq. Mavzu: foiz bo'yicha butunni topish (qism → butun).
// Dastur: urok — foiz (qismdan butunga).
// Imzo-mexanika = "butunni yig'ish": berilgan foizli bo'lak nusxalanib 100% ga to'ldiriladi.
// Formula: butun = qism : foiz × 100. Markaziy xato: butunni qism × foiz deb hisoblash.
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D32_01 from './D32_01.jsx';
import D32_02 from './D32_02.jsx';
import D32_03 from './D32_03.jsx';
import D32_04 from './D32_04.jsx';
import D32_05 from './D32_05.jsx';
import D32_06 from './D32_06.jsx';
import D32_07 from './D32_07.jsx';
import D32_08 from './D32_08.jsx';
import D32_09 from './D32_09.jsx';
import D32_10 from './D32_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: "1 · Xarita bo'lagi", C: D32_01 },   // 🟢 MCQ 20%=10 → 50
  { id: '02', label: '2 · Yarmi', C: D32_02 },            // 🟢 bo'sh katak 50%=15 → 30
  { id: '03', label: "3 · Ha/Yo'q", C: D32_03 },          // 🟢 10%=4 → 40 mi?
  { id: '04', label: '4 · Chorak', C: D32_04 },           // 🟡 bo'sh katak 25%=12 → 48
  { id: '05', label: '5 · Bir xil qism', C: D32_05 },     // 🟡 moslash 8 → har xil butun
  { id: '06', label: "6 · Butunni yig'", C: D32_06 },     // 🟡 konstruktor 25% × 4 = 100%
  { id: '07', label: '7 · Xatoni top', C: D32_07 },       // 🔴 10×20=200 xato → 50
  { id: '08', label: '8 · Sinf masalasi', C: D32_08 },    // 🔴 40%=10 → 25
  { id: '09', label: "9 · Qaysi bog'da ko'p", C: D32_09 }, // 🔴 taqqoslash · 50%=20→40 vs 20%=12→60 · whole_compare
  { id: '10', label: '10 · Qaysi butun', C: D32_10 },     // 🔴 MCQ 30%=60 → 200
];

export default function Dars32Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#6d28d9' : '#d6dae3'),
    background: active ? '#6d28d9' : '#fff', color: active ? '#fff' : '#374151',
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 32 amaliyoti — 10 topshiriq (foiz bo'yicha butunni topish)</strong>
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
