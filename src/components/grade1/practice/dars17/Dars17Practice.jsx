// Dars17 amaliyoti — 10 topshiriq (o'nlikdan o'tib qo'shish): 8+5 = 8+2+3 = 10+3 = 13.
// Make-ten strategiya: avval o'ngacha to'ldir, keyin qolganini. Ramp: 1🟢 / 3🟡 / 6🔴.
// Shirinlik qutisi syujeti (IKKI ten-frame: 1-quti 10ga to'ladi, qolgani 2-qutiga). Sonlar 0-20.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D17_01 from './D17_01.jsx';
import D17_02 from './D17_02.jsx';
import D17_03 from './D17_03.jsx';
import D17_04 from './D17_04.jsx';
import D17_05 from './D17_05.jsx';
import D17_06 from './D17_06.jsx';
import D17_07 from './D17_07.jsx';
import D17_08 from './D17_08.jsx';
import D17_09 from './D17_09.jsx';
import D17_10 from './D17_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 9+2', C: D17_01 },        // P13 · eng kichik o'tish (9+2=11) 🟢
  { id: '02', label: '2 · 8+5', C: D17_02 },        // P13 · 8+5=13 (8+2+3) 🟡
  { id: '03', label: '3 · 9+4', C: D17_03 },        // P13 · 9+4=13 (9+1+3) 🟡
  { id: '04', label: '4 · 7+5', C: D17_04 },        // P13 · 7+5=12 (7+3+2) 🟡
  { id: '05', label: '5 · 8+6', C: D17_05 },        // P13 · 8+6=14 (8+2+4) 🔴
  { id: '06', label: '6 · Zanjir', C: D17_06 },     // P13 · 4 qator o'tib qo'shish 🔴
  { id: '07', label: '7 · Bo\'lish', C: D17_07 },   // LOGIC · make-ten split (yangi mantiq turi) 🔴
  { id: '08', label: '8 · Barchasi', C: D17_08 },   // P13 · 13 bo'ladigan barcha yig'indilar multi 🔴
  { id: '09', label: '9 · Masala', C: D17_09 },     // P13 · og'zaki masala 8+5=13 🔴
  { id: '10', label: '10 · O\'tkaz', C: D17_10 },   // YANGI · ikki qutiga o'tkazib qo'shadi 🔴
];

export default function Dars17Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 17 amaliyoti — 10 topshiriq (o'nlikdan o'tib qo'shish)</strong>
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
