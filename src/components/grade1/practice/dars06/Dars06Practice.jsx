// Dars06 amaliyoti — 10 topshiriq (son tarkibi 6–10): P5/P6 + ikki rangli o'nlik-ramka + LOGIC.
// 5 oson (1🟢/4🟡) + 5 qiyin (🔴). Avtobus sayohati syujeti.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D06_01 from './D06_01.jsx';
import D06_02 from './D06_02.jsx';
import D06_03 from './D06_03.jsx';
import D06_04 from './D06_04.jsx';
import D06_05 from './D06_05.jsx';
import D06_06 from './D06_06.jsx';
import D06_07 from './D06_07.jsx';
import D06_08 from './D06_08.jsx';
import D06_09 from './D06_09.jsx';
import D06_10 from './D06_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Takror', C: D06_01 },     // P6 · Bekat son-uyi: 5=(3,?) — Dars05 spirali 🟢
  { id: '02', label: '2 · Yashirin', C: D06_02 },   // P5 · Avtobusda jami 6: oldda 4 qizil — orqada? 🟡
  { id: '03', label: '3 · Son uyi', C: D06_03 },    // P6 · 7=(3,?) — bekat uychasi 🟡
  { id: '04', label: '4 · Salon', C: D06_04 },      // P5 · Ikki rangli salon: 5 qizil + 2 yashil = ? 🟡
  { id: '05', label: '5 · Bo\'sh joy', C: D06_05 }, // P2 · 10 o'rindiq, 7 band — nechta bo'sh? (7+3=10) 🟡
  { id: '06', label: '6 · Zanjir', C: D06_06 },     // P6 · 8-uyning 3 qavati birdaniga 🔴
  { id: '07', label: '7 · Mantiq', C: D06_07 },     // LOGIC · Navbat AABB: qizil,qizil,yashil,yashil...? 🔴
  { id: '08', label: '8 · Chiptalar', C: D06_08 },  // P5 · Jami O'N bo'ladigan BARCHA chiptalar (3/4) 🔴
  { id: '09', label: '9 · Maydoncha', C: D06_09 },  // P5 · Jami 9: derazada 6 — orqada nechta? 🔴
  { id: '10', label: '10 · To\'ldir', C: D06_10 },  // YANGI · Avtobusni to'ldir: 8 yo'lovchi, 2-rangli ramka 🔴
];

export default function Dars06Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 6 amaliyoti — 10 topshiriq (son tarkibi 6–10)</strong>
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
