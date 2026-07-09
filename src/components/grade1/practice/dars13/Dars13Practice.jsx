// Dars13 amaliyoti — 10 topshiriq (o'nlik — sanoq birligi): 10 birlik = 1 o'nlik (dasta).
// Kuchaytirilgan ramp: 1🟢 / 3🟡 / 6🔴. Qalam do'koni syujeti (dasta = 10 qalam).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D13_01 from './D13_01.jsx';
import D13_02 from './D13_02.jsx';
import D13_03 from './D13_03.jsx';
import D13_04 from './D13_04.jsx';
import D13_05 from './D13_05.jsx';
import D13_06 from './D13_06.jsx';
import D13_07 from './D13_07.jsx';
import D13_08 from './D13_08.jsx';
import D13_09 from './D13_09.jsx';
import D13_10 from './D13_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Sanash', C: D13_01 },     // P1 · 7 qalam — Dars12 spirali 🟢
  { id: '02', label: '2 · Dasta', C: D13_02 },      // P13 · 10 qalam bog'lanadi = 1 dasta 🟡
  { id: '03', label: '3 · Dastada', C: D13_03 },    // P13 · 1 dasta = nechta qalam? (10) 🟡
  { id: '04', label: '4 · To\'ldir', C: D13_04 },   // P13 · 7 bor, o'nlikka nechta yetmaydi? (3) 🟡
  { id: '05', label: '5 · Qaysi ko\'p', C: D13_05 },// P13 · 1 dasta vs 9 yakka (10 > 9) 🔴
  { id: '06', label: '6 · Zanjir', C: D13_06 },     // P13 · 4 qator o'nlikka to'ldirish 🔴
  { id: '07', label: '7 · Guruhlash', C: D13_07 },  // LOGIC · o'nlik/birlik saralash (yangi) 🔴
  { id: '08', label: '8 · O\'nlik', C: D13_08 },    // P13 · aynan O'N bo'ladigan barchasi (tuzoq) 🔴
  { id: '09', label: '9 · Birliklar', C: D13_09 },  // P13 · 1 o'nlik = nechta birlik? (10) 🔴
  { id: '10', label: '10 · Yasab ol', C: D13_10 },  // YANGI · 10 qalamni bog'lab dasta yasaydi 🔴
];

export default function Dars13Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 13 amaliyoti — 10 topshiriq (o'nlik — sanoq birligi)</strong>
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
