// Dars11 amaliyoti — 10 topshiriq (o'rin almashtirish: a+b=b+a): P11 + LOGIC simmetriya.
// Kuchaytirilgan ramp: 1🟢 / 3🟡 / 6🔴. Poyezd bekati syujeti.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D11_01 from './D11_01.jsx';
import D11_02 from './D11_02.jsx';
import D11_03 from './D11_03.jsx';
import D11_04 from './D11_04.jsx';
import D11_05 from './D11_05.jsx';
import D11_06 from './D11_06.jsx';
import D11_07 from './D11_07.jsx';
import D11_08 from './D11_08.jsx';
import D11_09 from './D11_09.jsx';
import D11_10 from './D11_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Vagonlar', C: D11_01 },   // P7 · 4 qizil + 3 ko'k vagon — Dars10 spirali 🟢
  { id: '02', label: '2 · Almashdi', C: D11_02 },   // P11 · 3+2 va 2+3 — jami o'zgarmaydi 🟡
  { id: '03', label: '3 · Teng', C: D11_03 },       // P11 · 6+2=8 bo'lsa 2+6=? 🟡
  { id: '04', label: '4 · Ikki yozuv', C: D11_04 }, // P8 · rasmga mos IKKI yozuv (3+2 va 2+3) 🟡
  { id: '05', label: '5 · Tenglama', C: D11_05 },   // P11 · «4+5 = 5+▢» to'ldir 🔴
  { id: '06', label: '6 · Juftlash', C: D11_06 },   // P8 · drag: 3+4 ↔ 4+3 kommutativ juftlar 🔴
  { id: '07', label: '7 · Simmetriya', C: D11_07 }, // LOGIC · ko'zgu naqsh (yangi mantiq) 🔴
  { id: '08', label: '8 · Tengliklar', C: D11_08 }, // P11 · to'g'ri tengliklar multi (tuzoq) 🔴
  { id: '09', label: '9 · Hiyla', C: D11_09 },      // P9 · 2+7 → 7+2 oson hisobla 🔴
  { id: '10', label: '10 · Almashtir', C: D11_10 }, // YANGI · Vagonlarni o'zi almashtiradi 🔴
];

export default function Dars11Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 11 amaliyoti — 10 topshiriq (o'rin almashtirish)</strong>
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
