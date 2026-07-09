// Dars08 amaliyoti — 10 topshiriq (ayirishning ma'nosi): P9 olib tashlash + P8 yozuv + LOGIC.
// Kuchaytirilgan ramp: 1🟢 / 3🟡 / 6🔴. Qishloq hovlisi syujeti. Minus shu darsda ochiladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D08_01 from './D08_01.jsx';
import D08_02 from './D08_02.jsx';
import D08_03 from './D08_03.jsx';
import D08_04 from './D08_04.jsx';
import D08_05 from './D08_05.jsx';
import D08_06 from './D08_06.jsx';
import D08_07 from './D08_07.jsx';
import D08_08 from './D08_08.jsx';
import D08_09 from './D08_09.jsx';
import D08_10 from './D08_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Takror', C: D08_01 },      // P7 · 3 tovuq + 2 keldi — Dars07 spirali 🟢
  { id: '02', label: '2 · Olmalar', C: D08_02 },     // P9 · Shoxda 6 edi, 2 tushdi — nechta QOLDI? 🟡
  { id: '03', label: '3 · Tovuqlar', C: D08_03 },    // P9 · 7 tovuq — 3 katakka kirdi — qoldi? 🟡
  { id: '04', label: '4 · Yozuv', C: D08_04 },       // P8 · Quyon 2 sabzini oldi → «5 − 2» 🟡
  { id: '05', label: '5 · Tuxumlar', C: D08_05 },    // P9 · 8 − ? = 5 (noma'lum ayriluvchi) 🔴
  { id: '06', label: '6 · Zanjir', C: D08_06 },      // P8 · 6−2, 5−3, 7−4, 9−5 birdaniga 🔴
  { id: '07', label: '7 · Mantiq', C: D08_07 },      // LOGIC · Kamayuvchi naqsh: 5,4,3,? 🔴
  { id: '08', label: '8 · Kir ipi', C: D08_08 },     // P9 · Natijasi UCH — 5 tadan 4 tasi (6−2 tuzoq) 🔴
  { id: '09', label: '9 · Masala', C: D08_09 },      // P9 · IKKI bosqich: 9 − 3 − 2 = 4 🔴
  { id: '10', label: '10 · Bajar', C: D08_10 },      // YANGI · 7−3: bola o'zi 3 qushni uchiradi 🔴
];

export default function Dars08Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 8 amaliyoti — 10 topshiriq (ayirishning ma'nosi)</strong>
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
