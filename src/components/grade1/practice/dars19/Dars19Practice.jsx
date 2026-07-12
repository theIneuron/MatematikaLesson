// Dars19 amaliyoti — 10 topshiriq (o'nlikdan o'tib ayirish): 13 − 5 = 13 − 3 − 2 = 10 − 2 = 8.
// Make-ten-sub strategiya: avval o'ngacha tushir, keyin qolganini ayir. Ramp: 1🟢 / 3🟡 / 6🔴.
// Shar do'koni syujeti (rakda 1 o'nlik + birliklar; ayirishда sharlar uchib ketadi). Sonlar 0-18.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D19_01 from './D19_01.jsx';
import D19_02 from './D19_02.jsx';
import D19_03 from './D19_03.jsx';
import D19_04 from './D19_04.jsx';
import D19_05 from './D19_05.jsx';
import D19_06 from './D19_06.jsx';
import D19_07 from './D19_07.jsx';
import D19_08 from './D19_08.jsx';
import D19_09 from './D19_09.jsx';
import D19_10 from './D19_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 11−2', C: D19_01 },       // P13 · 11−2=9 spiral (kichik o'tish) 🟢
  { id: '02', label: '2 · 13−5', C: D19_02 },       // P13 · 13−5=8 🟡
  { id: '03', label: '3 · 12−5', C: D19_03 },       // P13 · 12−5=7 🟡
  { id: '04', label: '4 · 14−6', C: D19_04 },       // P13 · 14−6=8 🟡
  { id: '05', label: '5 · 15−7', C: D19_05 },       // P13 · 15−7=8 🔴
  { id: '06', label: '6 · Zanjir', C: D19_06 },     // P13 · 4 qator o'tib ayirish 🔴
  { id: '07', label: '7 · Bog\'lanish', C: D19_07 },// LOGIC · fact-family 8+5=13→13−5=8 (yangi) 🔴
  { id: '08', label: '8 · Barchasi', C: D19_08 },   // P13 · 8 bo'ladigan barcha ayirmalar multi 🔴
  { id: '09', label: '9 · Masala', C: D19_09 },     // P13 · og'zaki masala 13−5=8 🔴
  { id: '10', label: '10 · Uchir', C: D19_10 },     // YANGI · sharlarni uchirib ayiradi (tap-remove) 🔴
];

export default function Dars19Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 19 amaliyoti — 10 topshiriq (o'nlikdan o'tib ayirish)</strong>
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
