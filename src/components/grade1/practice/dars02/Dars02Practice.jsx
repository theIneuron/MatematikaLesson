// Dars02 amaliyoti — 10 topshiriq (raqamlar 1–5): P2 tanlash + P3 juftlarni ulash.
// Osondan qiyinga (3🟢 / 4🟡 / 3🔴). Har topshiriq mustaqil jsx-question fayli.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D02_01 from './D02_01.jsx';
import D02_02 from './D02_02.jsx';
import D02_03 from './D02_03.jsx';
import D02_04 from './D02_04.jsx';
import D02_05 from './D02_05.jsx';
import D02_06 from './D02_06.jsx';
import D02_07 from './D02_07.jsx';
import D02_08 from './D02_08.jsx';
import D02_09 from './D02_09.jsx';
import D02_10 from './D02_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Raqam', C: D02_01 },     // P2 · Ra'no kartasi — bu qaysi raqam? 🟢
  { id: '02', label: '2 · Miqdor', C: D02_02 },    // P2 · Likopcha — nechta olma? raqamini tanla 🟢
  { id: '03', label: '3 · Ulash', C: D02_03 },     // P3 · 2 juftni chiziq bilan ula (drag) 🟢
  { id: '04', label: '4 · Topish', C: D02_04 },    // P2 · Qaysi karta — 4 raqami? 🟡
  { id: '05', label: '5 · Ulash', C: D02_05 },     // P3 · 3 juftni chiziq bilan ula (drag) 🟡
  { id: '06', label: '6 · Teskari', C: D02_06 },   // P2 · Qaysi savatda 5 ta olma? 🟡
  { id: '07', label: '7 · Nuqta', C: D02_07 },     // P3 · Nuqtalarni sanab raqamga ula (drag) 🟡
  { id: '08', label: '8 · Ulash', C: D02_08 },     // P3 · 4 juftni ula (aralash to'plam, drag) 🔴
  { id: '09', label: '9 · Tartib', C: D02_09 },    // P2 · 2, 3, _, 5 — qaysi raqam tushib qoldi? 🔴
  { id: '10', label: '10 · Raqam ovi', C: D02_10 }, // YANGI · Suzayotgan pufakchalardan barcha 3 ni top 🟡
];

export default function Dars02Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 2 amaliyoti — 10 topshiriq (raqamlar 1–5)</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <PracticeHost key={q.id} Question={q.C} />
      </div>
    </div>
  );
}
