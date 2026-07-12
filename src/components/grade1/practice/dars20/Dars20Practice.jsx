// Dars20 amaliyoti — 10 topshiriq (o'tib ayirish, mustahkamlash): 20 ichida make-ten ayirish mashqi.
// Xilma-xil format + KREATIV: tanlash, Ha/Yo'q, noma'lum ayriluvchi, taqqoslash, multi, masala, drag.
// Ramp: 1🟢 / 3🟡 / 6🔴. Garaj syujeti (10 joy + yo'lakcha; ayirishda mashina chiqib ketadi). Sonlar 0-20.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D20_01 from './D20_01.jsx';
import D20_02 from './D20_02.jsx';
import D20_03 from './D20_03.jsx';
import D20_04 from './D20_04.jsx';
import D20_05 from './D20_05.jsx';
import D20_06 from './D20_06.jsx';
import D20_07 from './D20_07.jsx';
import D20_08 from './D20_08.jsx';
import D20_09 from './D20_09.jsx';
import D20_10 from './D20_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 12−4', C: D20_01 },       // P13 · 12−4=8 spiral 🟢
  { id: '02', label: '2 · 13−5', C: D20_02 },       // P13 · 13−5=8 🟡
  { id: '03', label: '3 · Ha/Yo\'q', C: D20_03 },   // P2 · 15−8=7 to'g'rimi? (Ha) 🟡
  { id: '04', label: '4 · Yashirin', C: D20_04 },   // P13 · noma'lum ayriluvchi 13−?=8 (5) 🟡
  { id: '05', label: '5 · 16−9', C: D20_05 },       // P13 · 16−9=7 🔴
  { id: '06', label: '6 · Zanjir', C: D20_06 },     // P13 · 4 qator o'tib ayirish 🔴
  { id: '07', label: '7 · Taqqosla', C: D20_07 },   // LOGIC · qaysida ko'p qoldi? 13−5 vs 15−8 (yangi) 🔴
  { id: '08', label: '8 · Barchasi', C: D20_08 },   // P13 · ayirmasi 7 bo'lganlar multi 🔴
  { id: '09', label: '9 · Masala', C: D20_09 },     // P13 · og'zaki masala 13−5=8 🔴
  { id: '10', label: '10 · Chiqar', C: D20_10 },    // YANGI · mashinalarni SUDRAB chiqaradi (drag-sub) 🔴
];

export default function Dars20Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 20 amaliyoti — 10 topshiriq (o'tib ayirish — mustahkamlash)</strong>
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
