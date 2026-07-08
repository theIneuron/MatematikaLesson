// Dars03 amaliyoti — 10 topshiriq (sonlar 6–10 va 0, «5 va yana» modeli).
// Osondan qiyinga (3🟢 / 4🟡 / 3🔴). Har topshiriq mustaqil jsx-question fayli.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D03_01 from './D03_01.jsx';
import D03_02 from './D03_02.jsx';
import D03_03 from './D03_03.jsx';
import D03_04 from './D03_04.jsx';
import D03_05 from './D03_05.jsx';
import D03_06 from './D03_06.jsx';
import D03_07 from './D03_07.jsx';
import D03_08 from './D03_08.jsx';
import D03_09 from './D03_09.jsx';
import D03_10 from './D03_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Sanash', C: D03_01 },    // P1 · Gilos: 5 va yana 1 — nechta? 🟢
  { id: '02', label: '2 · Raqam', C: D03_02 },     // P2 · Anvar kartasi — bu qaysi raqam? (7) 🟢
  { id: '03', label: '3 · Ulash', C: D03_03 },     // P3 · 2 juftni chiziq bilan ula (6, 8 — drag) 🟢
  { id: '04', label: '4 · Nol', C: D03_04 },       // P2 · Qaysi savat bo'sh? — nol (0) 🟡
  { id: '05', label: '5 · Sanash', C: D03_05 },    // P1 · Yong'oq: 5 va yana 4 — nechta? 🟡
  { id: '06', label: '6 · Ulash', C: D03_06 },     // P3 · 3 juftni chiziq bilan ula (7, 9, 10 — drag) 🟡
  { id: '07', label: '7 · Tartib', C: D03_07 },    // P2 · 6, 7, _, 9 — qaysi raqam tushib qoldi? 🟡
  { id: '08', label: '8 · Sanash', C: D03_08 },    // P1 · Aralash savat: olma + nok = 10 🔴
  { id: '09', label: '9 · Ulash', C: D03_09 },     // P3 · 4 juftni ula — nol (bo'sh quti) ham bor 🔴
  { id: '10', label: '10 · Hosil qil', C: D03_10 }, // YANGI · «5 va yana» ramkasini to'ldirib 7 ni hosil qil 🔴
];

export default function Dars03Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 3 amaliyoti — 10 topshiriq (sonlar 6–10 va 0)</strong>
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
