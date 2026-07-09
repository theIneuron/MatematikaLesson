// Dars07 amaliyoti — 10 topshiriq (qo'shishning ma'nosi): P7 birlashtirish + P8 misol-tuzish + LOGIC.
// Kuchaytirilgan ramp: 1🟢 / 3🟡 / 6🔴 (metodist: «kreativlashtir va qiyinlashtir»). O'yin maydonchasi syujeti.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D07_01 from './D07_01.jsx';
import D07_02 from './D07_02.jsx';
import D07_03 from './D07_03.jsx';
import D07_04 from './D07_04.jsx';
import D07_05 from './D07_05.jsx';
import D07_06 from './D07_06.jsx';
import D07_07 from './D07_07.jsx';
import D07_08 from './D07_08.jsx';
import D07_09 from './D07_09.jsx';
import D07_10 from './D07_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Ramka', C: D07_01 },       // P5 · 5 qizil + 3 yashil = ? — Dars06 spirali 🟢
  { id: '02', label: '2 · Qo\'shilish', C: D07_02 }, // P7 · 2 bola + 3 keldi (kuchukcha chalg'ituvchi!) 🟡
  { id: '03', label: '3 · Kaptarlar', C: D07_03 },   // P7 · 4 kaptar + 2 keldi (chumchuq chalg'ituvchi!) 🟡
  { id: '04', label: '4 · Misol tuz', C: D07_04 },   // P8 · Kartalardan misolni O'ZI tuzadi: [5]+[4]=9 🔴
  { id: '05', label: '5 · Uycha', C: D07_05 },       // P7 · Jami 9: 5 ko'rinadi — uychada 4 🟡
  { id: '06', label: '6 · Zanjir', C: D07_06 },      // P8 · 5+3, 6+3, 4+4, 7+3 — TO'RTTA birdaniga (8–10) 🔴
  { id: '07', label: '7 · Mantiq', C: D07_07 },      // LOGIC · O'suvchi naqsh 2,3,4,? →5 (6-kubik aldamchi) 🔴
  { id: '08', label: '8 · Sharlar', C: D07_08 },     // P7 · Jami TO'QQIZ — 5 shardan 3 tasi (soxta 8 va 10) 🔴
  { id: '09', label: '9 · Masala', C: D07_09 },      // P7 · IKKI bosqich: 6 + 3 + 1 = 10 🔴
  { id: '10', label: '10 · Birlashtir', C: D07_10 }, // YANGI · «+» tugma — 5+4=9 uchib birlashadi 🔴
];

export default function Dars07Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 7 amaliyoti — 10 topshiriq (qo'shishning ma'nosi)</strong>
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
