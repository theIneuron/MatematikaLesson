// Dars18 amaliyoti — 10 topshiriq (o'tib qo'shish, mustahkamlash): 20 ichida make-ten qo'shish mashqi.
// Xilma-xil format (fluency): tanlash, Ha/Yo'q, noma'lum qo'shiluvchi, tarozi-tenglik, multi, masala, drag.
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bozori syujeti (yashik = ten-frame). Sonlar 0-20, qo'shiluvchi ≤9.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D18_01 from './D18_01.jsx';
import D18_02 from './D18_02.jsx';
import D18_03 from './D18_03.jsx';
import D18_04 from './D18_04.jsx';
import D18_05 from './D18_05.jsx';
import D18_06 from './D18_06.jsx';
import D18_07 from './D18_07.jsx';
import D18_08 from './D18_08.jsx';
import D18_09 from './D18_09.jsx';
import D18_10 from './D18_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 7+4', C: D18_01 },        // P13 · 7+4=11 spiral 🟢
  { id: '02', label: '2 · 8+7', C: D18_02 },        // P13 · 8+7=15 🟡
  { id: '03', label: '3 · Ha/Yo\'q', C: D18_03 },   // P2 · to'g'rimi? 9+6=15 (Ha) — yangi format 🟡
  { id: '04', label: '4 · Yashirin', C: D18_04 },   // P13 · noma'lum qo'shiluvchi 8+?=14 (6) 🟡
  { id: '05', label: '5 · 8+8', C: D18_05 },        // P13 · 8+8=16 (dubl) 🔴
  { id: '06', label: '6 · Zanjir', C: D18_06 },     // P13 · 4 qator aralash o'tib qo'shish 🔴
  { id: '07', label: '7 · Tarozi', C: D18_07 },     // LOGIC · tenglik/balans 8+5=9+? (yangi) 🔴
  { id: '08', label: '8 · Barchasi', C: D18_08 },   // P13 · 14 bo'ladigan barcha yig'indilar multi 🔴
  { id: '09', label: '9 · Masala', C: D18_09 },     // P13 · og'zaki masala 8+6=14 🔴
  { id: '10', label: '10 · Sur', C: D18_10 },       // YANGI · SUDRAB make-ten → qopqoq yopiladi → yig'indini tanlash 🔴
];

export default function Dars18Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 18 amaliyoti — 10 topshiriq (o'tib qo'shish — mustahkamlash)</strong>
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
